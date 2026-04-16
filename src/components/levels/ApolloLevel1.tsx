import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ApolloLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The rocket equation — why rockets are 98% fuel',
      concept: `The Saturn V rocket weighed **2,970 tonnes** at liftoff. The spacecraft that reached the Moon weighed **45 tonnes**. Why so much fuel?

The **Tsiolkovsky rocket equation** (1903) explains:

**Δv = ve × ln(m₀ / mf)**

Where Δv is the speed change needed, ve is the exhaust velocity, m₀ is the initial mass (with fuel), and mf is the final mass (without fuel). The **ln** (natural logarithm) means fuel requirements grow **exponentially** with the desired speed.

The cruel physics: fuel to accelerate later must be accelerated NOW. So carrying more fuel means needing more fuel to carry that fuel. It's a compounding problem — like interest on a loan.

Getting to the Moon requires Δv ≈ 16 km/s (multiple burns). With ve ≈ 4.4 km/s for the best 1960s engines, the equation gives m₀/mf ≈ 37. You need 37 kg of fuel for every 1 kg of payload. Hence: 98% fuel.

📚 *The natural logarithm ln(x) is the inverse of e^x. It grows very slowly — ln(1000) ≈ 7. This means even moderate speed changes require enormous fuel ratios.*`,
      analogy: 'Imagine carrying your lunch to work in a backpack. Now imagine you also need to carry the fuel for carrying the backpack. And fuel for carrying THAT fuel. Each layer of fuel needs its own fuel. This compounding is why rockets are mostly fuel — it\'s the backpacker\'s paradox at extreme scale.',
      storyConnection: 'The Saturn V was the tallest, heaviest, most powerful rocket ever built — 110 metres tall, fueled by 2,000 tonnes of liquid oxygen and kerosene. It burned through 13 tonnes of propellant PER SECOND during the first stage. All of it to accelerate 45 tonnes to the Moon.',
      checkQuestion: 'If exhaust velocity doubles (from 4.4 to 8.8 km/s), how does the fuel ratio change for the same Δv = 16 km/s?',
      checkAnswer: 'New ratio: e^(16/8.8) = e^1.82 ≈ 6.2. Original ratio: e^(16/4.4) = e^3.64 ≈ 38. Doubling exhaust velocity reduces the fuel ratio from 38:1 to 6:1 — a massive improvement. This is why ion engines (ve ≈ 30 km/s) are so efficient, even though they produce tiny thrust.',
      codeIntro: 'Apply the Tsiolkovsky rocket equation — calculate fuel requirements for different missions.',
      code: `import numpy as np

def rocket_equation(delta_v_kms, exhaust_v_kms):
    """
    Tsiolkovsky rocket equation.
    Returns the mass ratio m0/mf (initial/final mass).
    """
    return np.exp(delta_v_kms / exhaust_v_kms)

def fuel_fraction(mass_ratio):
    """Fraction of total mass that is fuel."""
    return 1 - 1/mass_ratio

# Mission delta-v requirements (km/s)
missions = [
    ("Low Earth Orbit", 9.4),
    ("Geostationary orbit", 11.8),
    ("Lunar orbit", 15.9),
    ("Lunar landing & return", 18.0),
    ("Mars orbit", 17.0),
    ("Mars landing & return", 24.0),
    ("Escape Solar System", 16.7),
]

# Engine types
engines = [
    ("Chemical (Saturn V)", 4.4),
    ("Chemical (modern)", 4.6),
    ("Ion engine", 30.0),
    ("Nuclear thermal", 9.0),
    ("Theoretical fusion", 100.0),
]

print("=== Tsiolkovsky Rocket Equation Calculator ===")
print(f"\
Mass ratios (initial/final) for different missions and engines:")
print(f"{'Mission':<28}", end="")
for name, _ in engines:
    print(f" {name[:12]:>13}", end="")
print()
print("-" * 80)

for mission, dv in missions:
    print(f"{mission:<28}", end="")
    for _, ve in engines:
        ratio = rocket_equation(dv, ve)
        if ratio > 10000:
            print(f" {'>10,000':>13}", end="")
        else:
            print(f" {ratio:>12.1f}×", end="")
    print()

# Detailed Saturn V analysis
print("\
=== Saturn V Fuel Analysis ===")
saturn_v_mass_kg = 2970000  # 2,970 tonnes
payload_to_moon = 45000     # 45 tonnes (CSM + LM)

print(f"Total launch mass: {saturn_v_mass_kg/1000:,.0f} tonnes")
print(f"Payload to Moon: {payload_to_moon/1000:.0f} tonnes")
print(f"Fuel fraction: {(1 - payload_to_moon/saturn_v_mass_kg)*100:.1f}%")
print(f"Mass ratio: {saturn_v_mass_kg/payload_to_moon:.0f}:1")

# Fuel consumption rate
burn_rate_kg_s = 13000  # 13 tonnes per second (first stage)
stage1_burn_s = 168     # seconds
stage1_fuel = burn_rate_kg_s * stage1_burn_s

print(f"\
First stage:")
print(f"  Burn rate: {burn_rate_kg_s/1000:.0f} tonnes/second")
print(f"  Burn time: {stage1_burn_s} seconds ({stage1_burn_s/60:.1f} minutes)")
print(f"  Fuel consumed: {stage1_fuel/1000:,.0f} tonnes ({stage1_fuel/saturn_v_mass_kg*100:.0f}% of total)")

# Why staging helps
print("\
=== Why Staging Helps ===")
print("Single stage to orbit (no staging):")
single_ratio = rocket_equation(9.4, 4.4)
print(f"  Mass ratio: {single_ratio:.0f}:1 — impractical")

print("Two stages (drop empty tanks):")
stage1_dv = 5.0
stage2_dv = 4.4
ratio1 = rocket_equation(stage1_dv, 4.4)
ratio2 = rocket_equation(stage2_dv, 4.4)
total_ratio = ratio1 * ratio2
print(f"  Stage 1 ratio: {ratio1:.1f}:1")
print(f"  Stage 2 ratio: {ratio2:.1f}:1")
print(f"  Combined: {total_ratio:.0f}:1 — much better than {single_ratio:.0f}:1!")
print(f"  Staging reduces total mass by {(1 - total_ratio/single_ratio)*100:.0f}%")`,
      challenge: 'SpaceX\'s Starship uses methalox (methane+oxygen) with ve ≈ 3.6 km/s but is fully reusable — it doesn\'t discard stages. Calculate the mass ratio for LEO (Δv = 9.4 km/s). Is it practical? (Yes, because reusability means you don\'t need to build a new rocket each time.)',
      successHint: 'The Tsiolkovsky equation is the fundamental law of spaceflight. Every rocket ever launched — from V-2s to SpaceX Falcons — is constrained by this exponential relationship between speed and fuel. Understanding it is understanding why space travel is hard.',
    },
    {
      title: 'Hohmann transfer orbits — the fuel-efficient path to the Moon',
      concept: `You can't fly straight to the Moon — it's a moving target, 384,000 km away, orbiting Earth at 3,680 km/h. Instead, you use a **Hohmann transfer orbit**: an elliptical path that touches your starting orbit and your destination orbit.

The procedure: (1) Fire your engine to speed up from circular orbit into an elliptical orbit whose far point reaches the Moon's distance. (2) Coast for 3 days (no fuel needed). (3) Fire again at the far point to slow down into lunar orbit.

The beauty: the entire 384,000 km journey uses fuel for only **two brief burns** — a few minutes each. The rest is coasting on the elliptical path, governed by gravity alone.

The Hohmann transfer minimises the total Δv (and thus fuel) for a two-burn transfer between circular orbits. It was calculated by Walter Hohmann in 1925 — decades before anyone flew in space.

📚 *An ellipse is the shape of all orbits. A circle is a special case of an ellipse. The Moon's orbit is nearly circular. The transfer orbit is a long, thin ellipse connecting the two circles.*`,
      analogy: 'Throwing a ball to a running friend: you don\'t throw AT them (they\'ll have moved by the time the ball arrives). You throw AHEAD of them, so ball and friend arrive at the same point at the same time. The Hohmann transfer does the same — aiming the spacecraft at where the Moon WILL BE, not where it is now.',
      storyConnection: 'Apollo 11 entered its Hohmann transfer on July 16, 1969, with a single engine burn lasting about 6 minutes. Then the crew shut down the engine and coasted for 3 days. On July 19, a second burn slowed them into lunar orbit. Two burns, 6 minutes of thrust total, covering 384,000 km.',
      checkQuestion: 'The Apollo spacecraft coasted for 3 days. If the Moon is 384,000 km away, what was the average speed?',
      checkAnswer: '384,000 / (3 × 24) = 5,333 km/h ≈ 1.5 km/s. But the speed varied — fastest near Earth (where gravity accelerates it), slowest near the Moon (where it\'s been slowing down). The average hides the dynamic nature of orbital mechanics.',
      codeIntro: 'Calculate the Hohmann transfer from Earth orbit to the Moon — burn times, coast duration, and delta-v.',
      code: `import numpy as np

# Constants
G = 6.674e-11        # gravitational constant
M_earth = 5.972e24   # Earth mass (kg)
R_earth = 6371000    # Earth radius (m)

def orbital_velocity(radius, mass=M_earth):
    """Circular orbital velocity at given radius."""
    return np.sqrt(G * mass / radius)

def hohmann_transfer(r1, r2, central_mass=M_earth):
    """
    Calculate Hohmann transfer between two circular orbits.
    r1: starting orbit radius (m)
    r2: destination orbit radius (m)
    Returns: delta_v1, delta_v2, transfer_time
    """
    # Velocities in circular orbits
    v1_circular = orbital_velocity(r1, central_mass)
    v2_circular = orbital_velocity(r2, central_mass)

    # Semi-major axis of transfer ellipse
    a_transfer = (r1 + r2) / 2

    # Velocities in the transfer orbit (vis-viva equation)
    v1_transfer = np.sqrt(G * central_mass * (2/r1 - 1/a_transfer))
    v2_transfer = np.sqrt(G * central_mass * (2/r2 - 1/a_transfer))

    # Delta-v for each burn
    dv1 = abs(v1_transfer - v1_circular)  # departure burn
    dv2 = abs(v2_circular - v2_transfer)  # arrival burn

    # Transfer time (half the orbital period of the transfer ellipse)
    T_transfer = np.pi * np.sqrt(a_transfer**3 / (G * central_mass))

    return dv1, dv2, T_transfer

# Earth to Moon transfer
LEO_altitude = 200000  # 200 km Low Earth Orbit
r_LEO = R_earth + LEO_altitude
r_Moon = 384400000     # 384,400 km

dv1, dv2, transfer_time = hohmann_transfer(r_LEO, r_Moon)

print("=== Hohmann Transfer: Earth to Moon ===")
print(f"Starting orbit: {LEO_altitude/1000:.0f} km altitude (LEO)")
print(f"Destination: {r_Moon/1000:.0f} km (Moon's orbit)")
print(f"\
First burn (departure): Δv = {dv1:.0f} m/s ({dv1/1000:.2f} km/s)")
print(f"Second burn (arrival):  Δv = {dv2:.0f} m/s ({dv2/1000:.2f} km/s)")
print(f"Total Δv: {(dv1+dv2):.0f} m/s ({(dv1+dv2)/1000:.2f} km/s)")
print(f"Transfer time: {transfer_time/3600:.1f} hours ({transfer_time/86400:.1f} days)")

# Compare with other destinations
print("\
=== Hohmann Transfers to Various Destinations ===")
destinations = [
    ("ISS (400 km)", R_earth + 400000),
    ("Geostationary (35,786 km)", R_earth + 35786000),
    ("Moon (384,400 km)", 384400000),
    ("Mars (average, ~225M km)", 225e9),  # simplified, sun-centered
]

print(f"{'Destination':<28} {'Δv total':>10} {'Time':>12}")
print("-" * 52)

for name, r2 in destinations[:3]:
    d1, d2, t = hohmann_transfer(r_LEO, r2)
    print(f"{name:<28} {(d1+d2)/1000:>8.2f} km/s {t/3600:>9.1f} hrs")

# Orbital velocities at key points
print("\
=== Orbital Velocities ===")
for name, r in [("LEO (200 km)", r_LEO), ("Moon's orbit", r_Moon)]:
    v = orbital_velocity(r)
    print(f"{name:<28} v = {v:.0f} m/s ({v/1000:.2f} km/s)")

# Apollo 11 timeline
print("\
=== Apollo 11 Timeline ===")
events = [
    ("Launch", "July 16, 13:32 UTC", "Saturn V ignites, 7.5 million pounds of thrust"),
    ("LEO insertion", "July 16, 13:44 UTC", "In orbit at 185 km, v = 7.79 km/s"),
    ("TLI burn", "July 16, 16:22 UTC", "6 min burn, Δv = 3.05 km/s → Moon trajectory"),
    ("Coast phase", "July 16-19", "3 days, no engine, governed by gravity"),
    ("LOI burn", "July 19, 17:22 UTC", "6 min burn, Δv = 0.89 km/s → lunar orbit"),
    ("Landing", "July 20, 20:17 UTC", "Eagle touches down with 25 sec fuel left"),
]
for name, time, desc in events:
    print(f"  {name:<20} {time:<24} {desc}")`,
      challenge: 'Calculate a Hohmann transfer from LEO to Mars orbit (assuming both orbits are around the Sun). The transfer time will be much longer — about how many months? This is the same calculation NASA uses to plan Mars missions.',
      successHint: 'You calculated the actual trajectory used by Apollo 11 — the same Hohmann transfer math used for every planetary mission. The key insight: orbital mechanics is counter-intuitive. To go higher, you speed UP (which seems backward). To slow down, you speed UP in the retrograde direction. But the math works perfectly.',
    },
    {
      title: 'Priority scheduling — the software that saved the landing',
      concept: `Three minutes before landing, the Apollo Guidance Computer flashed a **1202 alarm** — executive overflow. The computer was overloaded: too many tasks, not enough processing power.

Margaret Hamilton's software handled this with **priority scheduling**: every task was assigned a priority level (1 = highest, 255 = lowest). When the processor was overloaded, it **paused** the lowest-priority task, saved its state, and ran the highest-priority one. When the high-priority task finished, it resumed the paused task.

The 1202 alarm meant: "I dropped some low-priority tasks (rendezvous radar) to focus on high-priority ones (navigation, throttle)." The computer was telling the crew: *I'm overloaded, but I'm handling it.*

This is **preemptive multitasking** — the same technique used by every modern operating system. Your phone running 20 apps simultaneously uses exactly the same principle Margaret Hamilton invented for Apollo.

📚 *Preemptive means the OS can interrupt a running task without permission. Non-preemptive means tasks must voluntarily yield. Apollo used preemptive — essential for real-time systems where delay = crash.*`,
      analogy: 'You\'re cooking dinner, the phone rings, and the smoke detector goes off. You don\'t finish the phone call before dealing with the smoke — you DROP the low-priority task (phone call) and handle the high-priority one (smoke alarm). That\'s priority scheduling: urgent tasks interrupt less urgent ones.',
      storyConnection: 'Steve Bales, the 26-year-old engineer in Mission Control, had 15 seconds to decide: abort or continue. He knew Hamilton\'s software was designed for exactly this scenario — the alarms meant the computer was working correctly, not failing. "We\'re GO on that alarm." The landing continued.',
      checkQuestion: 'Why was the rendezvous radar running during descent? It wasn\'t needed for landing.',
      checkAnswer: 'A checklist error — the radar was switched to the wrong mode, causing it to query the computer constantly for data it didn\'t need yet. This consumed processing time that the descent guidance needed. The priority scheduler correctly identified it as lower priority and dropped it.',
      codeIntro: 'Build a priority task scheduler — simulate the Apollo 1202 alarm scenario.',
      code: `import numpy as np

class Task:
    def __init__(self, name, priority, cpu_ms, critical=False):
        self.name = name
        self.priority = priority  # lower number = higher priority
        self.cpu_ms = cpu_ms      # CPU time needed per cycle
        self.critical = critical  # must not be dropped
        self.running = True
        self.dropped_count = 0

class PriorityScheduler:
    """Simple priority scheduler like the Apollo Guidance Computer."""

    def __init__(self, cpu_budget_ms):
        self.cpu_budget = cpu_budget_ms  # total CPU time per cycle
        self.tasks = []
        self.log = []

    def add_task(self, task):
        self.tasks.append(task)

    def schedule(self, cycle_name=""):
        """Run one scheduling cycle. Drop lowest-priority tasks if overloaded."""
        # Sort by priority (lower number = higher priority)
        sorted_tasks = sorted(self.tasks, key=lambda t: t.priority)

        total_needed = sum(t.cpu_ms for t in sorted_tasks if t.running)
        overloaded = total_needed > self.cpu_budget
        alarm = None

        if overloaded:
            # Drop lowest-priority tasks until we fit in the budget
            remaining = self.cpu_budget
            for task in sorted_tasks:
                if remaining >= task.cpu_ms:
                    remaining -= task.cpu_ms
                    task.running = True
                else:
                    if not task.critical:
                        task.running = False
                        task.dropped_count += 1
                        alarm = "1202"  # Executive overflow

        # Log the cycle
        running_tasks = [t for t in sorted_tasks if t.running]
        dropped_tasks = [t for t in sorted_tasks if not t.running]
        cpu_used = sum(t.cpu_ms for t in running_tasks)

        self.log.append({
            "cycle": cycle_name,
            "cpu_used": cpu_used,
            "cpu_budget": self.cpu_budget,
            "running": [t.name for t in running_tasks],
            "dropped": [t.name for t in dropped_tasks],
            "alarm": alarm,
        })

        # Reset all tasks to running for next cycle
        for t in self.tasks:
            t.running = True

        return alarm

# Create the Apollo Guidance Computer scenario
agc = PriorityScheduler(cpu_budget_ms=85)  # 85ms per cycle (11.7 Hz)

# Tasks running during descent
agc.add_task(Task("Navigation", priority=1, cpu_ms=25, critical=True))
agc.add_task(Task("Throttle control", priority=2, cpu_ms=20, critical=True))
agc.add_task(Task("Altitude radar", priority=3, cpu_ms=15, critical=True))
agc.add_task(Task("Display update", priority=4, cpu_ms=10))
agc.add_task(Task("Rendezvous radar", priority=5, cpu_ms=20))  # shouldn't be on!
agc.add_task(Task("Telemetry", priority=6, cpu_ms=8))
agc.add_task(Task("Keyboard handler", priority=7, cpu_ms=5))

print("=== Apollo Guidance Computer — Priority Scheduler ===")
print(f"CPU budget: {agc.cpu_budget} ms per cycle")
print(f"Tasks loaded: {len(agc.tasks)}")
total_demand = sum(t.cpu_ms for t in agc.tasks)
print(f"Total CPU demand: {total_demand} ms ({total_demand/agc.cpu_budget*100:.0f}% of budget)")
print(f"Overloaded: {'YES' if total_demand > agc.cpu_budget else 'No'}")

# Run scheduling cycles
print(f"\
{'Cycle':<20} {'Alarm':>6} {'CPU Used':>9} {'Running':>40} {'Dropped':>20}")
print("-" * 97)

scenarios = [
    "Normal descent",
    "Rendezvous radar ON",
    "Extra telemetry burst",
    "Throttle adjustment",
    "Final approach",
]

for i, scenario in enumerate(scenarios):
    alarm = agc.schedule(scenario)
    entry = agc.log[-1]
    running = ", ".join(entry["running"][:4])
    if len(entry["running"]) > 4:
        running += f" +{len(entry['running'])-4}"
    dropped = ", ".join(entry["dropped"]) if entry["dropped"] else "None"
    alarm_str = entry["alarm"] or "—"
    print(f"{scenario:<20} {alarm_str:>6} {entry['cpu_used']:>6}ms "
          f"{running:>40} {dropped:>20}")

# What would happen WITHOUT priority scheduling?
print(f"\
=== Without Priority Scheduling ===")
print(f"CPU demand: {total_demand} ms > budget: {agc.cpu_budget} ms")
print(f"Result: COMPUTER CRASH — all tasks fail")
print(f"Navigation, throttle control, altitude radar — ALL LOST")
print(f"The Lunar Module crashes into the Moon at 150 km/h")
print(f"\
With priority scheduling: critical tasks keep running,")
print(f"non-critical tasks are gracefully dropped, crew is alerted.")
print(f"The 1202 alarm saved the mission.")`,
      challenge: 'What if the display update task was marked as critical? Now the scheduler can\'t drop it to save CPU. What happens? (The system can\'t fit all critical tasks in the budget — a real emergency. This is why marking everything as "critical" defeats the purpose of priority scheduling.)',
      successHint: 'You built a priority scheduler — the core of every operating system. Windows, macOS, Linux, iOS, Android — they all use priority scheduling to run many programs on limited hardware. Margaret Hamilton invented this for Apollo; you just implemented it in Python.',
    },
    {
      title: 'Gravity and orbits — why astronauts float',
      concept: `A common misconception: astronauts float because there's "no gravity" in space. Wrong. At the International Space Station's altitude (400 km), gravity is **89% as strong** as on Earth's surface. The astronauts are NOT weightless — they're in **free fall**.

Imagine an elevator with its cable cut. Everyone inside floats relative to the elevator — they're all falling at the same rate. The elevator IS falling, but the people inside don't feel the fall because the floor isn't pushing up on them anymore.

An orbit is exactly this: the spacecraft is perpetually falling toward Earth, but it's moving sideways fast enough that the Earth's surface curves away beneath it at the same rate. It falls and misses — forever. This is what "being in orbit" means: falling around the Earth.

**Orbital velocity at LEO**: v = √(GM/r) ≈ 7.8 km/s (28,000 km/h). At this speed, the spacecraft's curved fall matches the Earth's curvature.

📚 *Newton imagined a cannon on a very tall mountain. Fire it slowly and the ball falls to Earth. Fire it faster and it goes further. At the right speed, the ball falls around the Earth in a circle — it's in orbit. This is Newton's cannonball thought experiment.*`,
      analogy: 'Swing a ball on a string in a circle. The string (gravity) constantly pulls the ball inward (toward the center). The ball\'s velocity (sideways speed) keeps it from falling in. If you cut the string, the ball flies off in a straight line (no gravity = no orbit). If you slow the ball, it spirals inward (too slow = crash). Orbital mechanics is the balance between these two forces.',
      storyConnection: 'Apollo 11 orbited the Moon at about 1.6 km/s — much slower than Earth orbit (7.8 km/s) because the Moon is much smaller and has weaker gravity. The Lunar Module descended from this orbit — trading orbital velocity for a controlled descent to the surface.',
      checkQuestion: 'At 400 km altitude, gravity is 89% of surface value. Why do astronauts on the ISS appear weightless?',
      checkAnswer: 'Because the ISS and the astronauts are both falling at the same rate — they\'re in the same orbit. There\'s no relative force between them. It\'s like jumping off a diving board: you feel weightless during the fall, not because gravity disappeared, but because nothing is pushing back against you.',
      codeIntro: 'Calculate orbital velocities, periods, and the physics of free fall for different altitudes.',
      code: `import numpy as np

G = 6.674e-11       # gravitational constant (m³/kg/s²)
M_earth = 5.972e24  # Earth mass (kg)
R_earth = 6371000   # Earth radius (m)
M_moon = 7.342e22   # Moon mass (kg)
R_moon = 1737000    # Moon radius (m)

def orbital_velocity(r, M):
    """Circular orbital velocity at radius r around mass M."""
    return np.sqrt(G * M / r)

def orbital_period(r, M):
    """Orbital period at radius r around mass M."""
    return 2 * np.pi * np.sqrt(r**3 / (G * M))

def gravity_at_altitude(h, M=M_earth, R=R_earth):
    """Gravitational acceleration at altitude h above surface."""
    return G * M / (R + h)**2

# Gravity at different altitudes
print("=== Gravity vs Altitude ===")
g_surface = gravity_at_altitude(0)
print(f"{'Altitude':<20} {'g (m/s²)':>10} {'% of surface':>14}")
print("-" * 46)

for h_km in [0, 10, 100, 200, 400, 1000, 10000, 35786, 384400]:
    g = gravity_at_altitude(h_km * 1000)
    pct = g / g_surface * 100
    name = {0: "Surface", 10: "Cruising altitude", 400: "ISS",
            35786: "Geostationary", 384400: "Moon's distance"}.get(h_km, "")
    label = f"{h_km:>6} km {name}" if name else f"{h_km:>6} km"
    print(f"{label:<20} {g:>8.3f} {pct:>12.1f}%")

# Orbital velocities and periods
print(f"\
=== Orbital Parameters ===")
print(f"{'Location':<24} {'Altitude':>10} {'Velocity':>10} {'Period':>12}")
print("-" * 58)

orbits = [
    ("Low Earth Orbit", 200, M_earth, R_earth),
    ("ISS", 400, M_earth, R_earth),
    ("GPS satellites", 20200, M_earth, R_earth),
    ("Geostationary", 35786, M_earth, R_earth),
    ("Moon's orbit", 384400, M_earth, R_earth),
    ("Lunar orbit (Apollo)", 110, M_moon, R_moon),
]

for name, h_km, M, R in orbits:
    r = R + h_km * 1000
    v = orbital_velocity(r, M)
    T = orbital_period(r, M)
    T_hours = T / 3600
    T_str = f"{T_hours:.1f} hrs" if T_hours < 48 else f"{T_hours/24:.1f} days"
    print(f"{name:<24} {h_km:>8} km {v/1000:>8.2f} km/s {T_str:>12}")

# Newton's cannonball
print(f"\
=== Newton's Cannonball ===")
print(f"Fire a ball from a mountaintop at different speeds:")
h_mountain = 100000  # 100 km (edge of space)
for v_kmh in [1000, 5000, 10000, 20000, 28000, 40000]:
    v_ms = v_kmh / 3.6
    v_orbital = orbital_velocity(R_earth + h_mountain)
    v_escape = v_orbital * np.sqrt(2)

    if v_ms < v_orbital * 0.5:
        result = "Falls back to Earth quickly"
    elif v_ms < v_orbital:
        result = f"Suborbital — goes higher but falls back"
    elif v_ms < v_orbital * 1.1:
        result = f"ORBIT — circles the Earth"
    elif v_ms < v_escape:
        result = f"Elliptical orbit — goes very far, comes back"
    else:
        result = f"ESCAPE — leaves Earth forever"

    print(f"  {v_kmh:>6} km/h: {result}")`,
      challenge: 'Calculate the orbital velocity and period for a satellite orbiting Mars (M = 6.39×10²³ kg, R = 3,390 km) at 300 km altitude. How does it compare to Earth orbit? (Mars is smaller and lighter, so orbital velocity is lower and you could orbit with less fuel.)',
      successHint: 'You calculated the orbital mechanics used by every satellite, space station, and planetary mission. The key insight: orbit is not "floating in space" — it\'s perpetual free fall, balanced by sideways velocity. Understanding this distinction is the foundation of all spaceflight.',
    },
    {
      title: 'The descent — simulating the last 12 minutes',
      concept: `The Lunar Module descended from 110 km orbit to the surface in approximately **12 minutes**. This wasn't a free fall — it was a **controlled powered descent**, with the descent engine firing continuously to slow the spacecraft from orbital velocity (1.6 km/s) to zero at the surface.

The descent had three phases:
1. **Braking phase** (8 minutes): engine at maximum thrust, slowing from 1.6 km/s
2. **Approach phase** (3 minutes): engine throttled back, pitching to near-vertical
3. **Terminal descent** (1 minute): final hover and touchdown at ~1 m/s

The critical constraint: **fuel**. The LM carried enough fuel for about 12 minutes of descent engine operation. Armstrong's manual flying at the end consumed extra fuel — he landed with **25 seconds** remaining.

📚 *Powered descent is the opposite of a launch: instead of accelerating against gravity, you're decelerating against gravity. The engine burns "backward" to slow down. This is called a "suicide burn" in modern rocketry — though NASA prefers less dramatic terminology.*`,
      analogy: 'Imagine driving a car toward a wall. You need to brake to a stop EXACTLY at the wall — not before (you\'d fall short) and not after (you\'d crash). The amount of braking depends on your speed and the distance. The Moon descent is the same — brake from 1.6 km/s to zero at exactly the right altitude.',
      storyConnection: 'At 4:14 PM on July 20, 1969, Armstrong saw the computer guiding them toward a boulder field. He took manual control and flew sideways, searching for a clear spot. Mission Control called fuel remaining: "60 seconds... 30 seconds..." He landed with 25 seconds of fuel left.',
      checkQuestion: 'If the descent engine produces 45,000 N of thrust and the LM weighs 15,000 kg on the Moon (gravity = 1.62 m/s²), what is the net deceleration?',
      checkAnswer: 'Thrust deceleration = 45,000 / 15,000 = 3.0 m/s². Gravity pulls down at 1.62 m/s². Net deceleration = 3.0 - 1.62 = 1.38 m/s² (relative to the surface). This means the LM slows at 1.38 m/s² — it takes about 19 minutes to stop from 1.6 km/s at this rate, but the engine can throttle up for faster braking.',
      codeIntro: 'Simulate the Apollo 11 powered descent — track altitude, velocity, and fuel from orbit to touchdown.',
      code: `import numpy as np

def simulate_descent(
    initial_altitude_m=15000,  # start of powered descent
    initial_velocity_ms=150,    # horizontal + vertical
    initial_down_velocity=30,   # downward velocity
    engine_thrust_N=45000,      # descent engine max thrust
    dry_mass_kg=6800,           # LM without fuel
    fuel_mass_kg=8200,          # descent fuel
    moon_gravity=1.62,          # m/s²
    exhaust_velocity=3050,      # m/s
    dt=1.0,                     # time step (seconds)
):
    """Simulate the powered descent to the lunar surface."""

    altitude = initial_altitude_m
    v_down = initial_down_velocity   # downward velocity (positive = down)
    v_horiz = initial_velocity_ms    # horizontal velocity
    fuel = fuel_mass_kg
    time = 0

    log = []

    while altitude > 0 and fuel > 0:
        total_mass = dry_mass_kg + fuel
        velocity = np.sqrt(v_down**2 + v_horiz**2)

        # Throttle control (simplified)
        if altitude > 2000:
            throttle = 0.92  # braking phase: near max
        elif altitude > 150:
            throttle = 0.55  # approach phase: reduced
        else:
            throttle = 0.25  # terminal: gentle

        thrust = engine_thrust_N * throttle

        # Fuel consumption
        fuel_rate = thrust / exhaust_velocity  # kg/s
        fuel_used = fuel_rate * dt
        fuel -= fuel_used

        if fuel <= 0:
            fuel = 0
            thrust = 0

        # Acceleration from engine (opposing velocity)
        engine_accel = thrust / total_mass

        # Apply deceleration (simplified: mostly vertical at this point)
        v_down -= engine_accel * 0.7 * dt  # 70% vertical
        v_down += moon_gravity * dt          # gravity pulls down
        v_horiz -= engine_accel * 0.3 * dt   # 30% horizontal

        v_down = max(v_down, -5)  # can't go up too fast
        v_horiz = max(v_horiz, 0)

        # Update altitude
        altitude -= v_down * dt
        time += dt

        if time % 30 < dt or altitude < 200:
            log.append({
                "time": time,
                "altitude": max(altitude, 0),
                "v_down": v_down,
                "v_horiz": v_horiz,
                "fuel_kg": max(fuel, 0),
                "fuel_sec": max(fuel, 0) / max(fuel_rate, 0.01),
                "throttle": throttle,
            })

    return log

log = simulate_descent()

print("=== Apollo 11 Lunar Descent Simulation ===")
print(f"{'Time (s)':>8} {'Alt (m)':>9} {'V↓ (m/s)':>9} {'V→ (m/s)':>9} "
      f"{'Fuel (kg)':>9} {'Fuel (s)':>9} {'Phase':>12}")
print("-" * 67)

for entry in log:
    phase = "Braking" if entry["altitude"] > 2000 else "Approach" if entry["altitude"] > 150 else "Terminal"
    fuel_warning = " ⚠️" if entry["fuel_sec"] < 30 else ""
    print(f"{entry['time']:>7.0f} {entry['altitude']:>8.0f} {entry['v_down']:>8.1f} "
          f"{entry['v_horiz']:>8.1f} {entry['fuel_kg']:>8.0f} {entry['fuel_sec']:>7.0f}s "
          f"{phase:>12}{fuel_warning}")

# Final stats
final = log[-1]
print(f"\
=== Touchdown ===")
print(f"Time: {final['time']:.0f} seconds ({final['time']/60:.1f} minutes)")
print(f"Final velocity: ↓{final['v_down']:.1f} m/s, →{final['v_horiz']:.1f} m/s")
print(f"Fuel remaining: {final['fuel_kg']:.0f} kg ({final['fuel_sec']:.0f} seconds)")
if final['fuel_sec'] < 30:
    print("⚠️ CRITICAL: Less than 30 seconds of fuel!")
    print("Armstrong's actual margin was 25 seconds.")`,
      challenge: 'Add a "manual override" at altitude 150 m — reduce v_horiz to 0 over 30 seconds (Armstrong flying sideways to avoid boulders). How much extra fuel does this consume? This is the margin that almost made Apollo 11 abort.',
      successHint: 'You simulated the most dramatic 12 minutes in the history of spaceflight — from orbit to touchdown with 25 seconds of fuel remaining. This is a control systems problem: managing a dynamic system (the LM) to reach a target state (landed, zero velocity) under constraints (limited fuel). Every rocket landing — including SpaceX\'s Falcon boosters — solves the same problem.',
    },
    {
      title: 'Margaret Hamilton\'s legacy — why software engineering matters',
      concept: `Before Apollo, programming was considered clerical work — "just typing instructions." Margaret Hamilton changed that. She argued that writing software for life-critical systems required the same rigour as mechanical or electrical engineering. She coined the term **"software engineering"** to give it the respect it deserved.

Her key innovations:
1. **Priority scheduling** — tasks are ranked by importance; the system handles overload gracefully
2. **Error detection and recovery** — the software anticipates failures and has predefined responses
3. **Asynchronous processing** — tasks run independently and communicate through shared data
4. **Human-in-the-loop design** — the software informs the crew of problems rather than hiding them

These principles are now the foundation of every reliable software system: operating systems, air traffic control, medical devices, autonomous vehicles, and banking.

📚 *Margaret Hamilton received the Presidential Medal of Freedom in 2016 for her work on Apollo. The award citation: "Her example speaks of the American spirit of discovery that exists in every girl and boy who knows that somehow, to look beyond the heavens is to look deep within ourselves."*`,
      analogy: 'Imagine a hospital emergency department. Patients are triaged by severity (priority scheduling). Doctors handle multiple patients simultaneously (asynchronous processing). Equipment has alarms (error detection). And the doctor — not the machine — makes the final call on treatment (human in the loop). Hamilton designed software the same way — robust, prioritized, and transparent.',
      storyConnection: 'Hamilton\'s team was young — many in their twenties. They hand-coded 145,000 lines of assembly language, tested it obsessively, and wove it into rope memory (physical, unchangeable). There was no "undo," no "patch," no "update." The software had to be perfect before launch. It was.',
      checkQuestion: 'Why did Hamilton insist that software for life-critical systems needed its own engineering discipline?',
      checkAnswer: 'Because software bugs can kill people — just as a structural flaw in a bridge can. The Therac-25 radiation therapy machine (1985-87) killed patients due to a software race condition. The Boeing 737 MAX crashes (2018-19) were caused by a software design flaw. Hamilton\'s point — that software errors are engineering failures, not "just bugs" — was proven tragically right.',
      codeIntro: 'Explore software reliability concepts — error handling, graceful degradation, and defensive programming.',
      code: `# Software Engineering Principles from Apollo

# 1. DEFENSIVE PROGRAMMING — always validate inputs
def safe_divide(a, b):
    """Apollo-style: never crash, always return something useful."""
    if b == 0:
        print(f"WARNING: Division by zero (a={a}, b={b}). Returning 0.")
        return 0
    return a / b

# Without defensive programming:
# result = 100 / 0  → CRASH! Program stops.

# With defensive programming:
result = safe_divide(100, 0)  # Warning, returns 0, continues
print(f"safe_divide(100, 0) = {result}")
print(f"safe_divide(100, 3) = {safe_divide(100, 3):.2f}")
print()

# 2. GRACEFUL DEGRADATION — when resources are limited, drop non-essentials
def run_system(cpu_available, tasks):
    """Run tasks by priority, dropping low-priority ones if overloaded."""
    sorted_tasks = sorted(tasks, key=lambda t: t["priority"])
    running = []
    dropped = []
    cpu_used = 0

    for task in sorted_tasks:
        if cpu_used + task["cpu"] <= cpu_available:
            running.append(task["name"])
            cpu_used += task["cpu"]
        else:
            if task.get("critical"):
                # Critical task: MUST run, even if over budget
                running.append(task["name"] + " [FORCED]")
                cpu_used += task["cpu"]
            else:
                dropped.append(task["name"])

    return running, dropped, cpu_used

tasks = [
    {"name": "Navigation", "priority": 1, "cpu": 30, "critical": True},
    {"name": "Engine control", "priority": 2, "cpu": 25, "critical": True},
    {"name": "Display", "priority": 3, "cpu": 15},
    {"name": "Telemetry", "priority": 4, "cpu": 10},
    {"name": "Diagnostics", "priority": 5, "cpu": 10},
]

print("=== Graceful Degradation ===")
for cpu in [100, 80, 60, 40]:
    running, dropped, used = run_system(cpu, tasks)
    print(f"CPU available: {cpu}% → Running: {', '.join(running)}")
    if dropped:
        print(f"                  Dropped: {', '.join(dropped)}")
    print()

# 3. ERROR HANDLING — anticipate and plan for failure
class MissionComputer:
    """Simplified Apollo Guidance Computer with error handling."""

    def __init__(self):
        self.errors = []
        self.status = "NOMINAL"

    def execute(self, command, value):
        try:
            if command == "THROTTLE":
                if not 0 <= value <= 100:
                    raise ValueError(f"Throttle {value}% out of range [0-100]")
                return f"Throttle set to {value}%"

            elif command == "NAVIGATE":
                if value is None:
                    raise ValueError("No navigation data")
                return f"Course set to {value}°"

            elif command == "LAND":
                if value < 0:
                    raise ValueError(f"Negative altitude: {value}m")
                return f"Descending to {value}m"

            else:
                raise ValueError(f"Unknown command: {command}")

        except ValueError as e:
            self.errors.append(str(e))
            self.status = "CAUTION"
            return f"ERROR: {e} — continuing with safe defaults"

    def report(self):
        print(f"Status: {self.status}")
        if self.errors:
            print(f"Errors logged: {len(self.errors)}")
            for e in self.errors:
                print(f"  ⚠ {e}")

# Test the computer
agc = MissionComputer()
print("=== Error Handling Demo ===")
print(agc.execute("THROTTLE", 75))
print(agc.execute("THROTTLE", 150))   # out of range
print(agc.execute("NAVIGATE", None))   # missing data
print(agc.execute("LAND", -100))       # negative altitude
print(agc.execute("SELF_DESTRUCT", 1)) # unknown command
print()
agc.report()

# Hamilton's legacy in numbers
print("\
=== Margaret Hamilton's Legacy ===")
legacy = [
    ("Apollo software", "145,000 lines of code"),
    ("Written in", "Assembly language (lowest level)"),
    ("Storage", "Rope memory (woven copper wire)"),
    ("Computer speed", "0.043 MHz (your phone: ~3,000 MHz)"),
    ("Memory", "74 KB (your phone: ~6,000,000 KB)"),
    ("Missions flown", "Apollo 7 through Apollo 17 (manned)"),
    ("Term coined", "'Software engineering' — now one of the largest professions"),
    ("Award", "Presidential Medal of Freedom (2016)"),
]
for item, detail in legacy:
    print(f"  {item:<20} {detail}")`,
      challenge: 'Add a "watchdog timer" to the MissionComputer: if any command takes longer than 100ms (simulated), the computer resets that task and logs an error. This is how real spacecraft computers detect hung processes — the same principle used in every modern OS.',
      successHint: 'You practiced three core software engineering principles from Apollo: defensive programming (validate all inputs), graceful degradation (drop non-essentials under load), and error handling (anticipate failures and plan for them). These principles — invented for getting humans to the Moon — are now used in every piece of reliable software on Earth.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Orbital mechanics and software engineering through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model rocket physics, orbital transfers, and the software that saved Apollo 11.
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
