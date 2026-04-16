import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import VimanaLiftDragDiagram from '../diagrams/VimanaLiftDragDiagram';
import VimanaBernoulliDiagram from '../diagrams/VimanaBernoulliDiagram';
import VimanaJetEngineDiagram from '../diagrams/VimanaJetEngineDiagram';
import VimanaRocketDiagram from '../diagrams/VimanaRocketDiagram';
import NewtonForceDiagram from '../diagrams/NewtonForceDiagram';
import WorkForceDiagram from '../diagrams/WorkForceDiagram';

export default function VimanaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The four forces — your first flight model',
      concept: `In Level 0 you learned that every aircraft balances four forces: **lift** (up), **weight** (down), **thrust** (forward), and **drag** (backward).

Now let’s put numbers on these forces. We’ll use Python to model a simple aircraft and check whether it can fly. The key variables are:
- **mass** (kg) — determines weight via W = m × g
- **thrust** (N) — what the engine provides
- **lift** (N) — what the wings generate
- **drag** (N) — what the air resists

If lift > weight, the plane climbs. If thrust > drag, it accelerates. The code below defines an aircraft and prints its flight status.

📚 *A Newton (N) is the SI unit of force. 1 N ≈ the weight of a small apple.*`,
      analogy: 'Think of flying as a tug-of-war in two directions simultaneously. Vertically, lift and weight are pulling against each other. Horizontally, thrust and drag are pulling against each other. The plane goes wherever the winning side pulls it.',
      storyConnection: 'The Pushpaka Vimana flew by divine will, effortlessly overcoming gravity. Real aircraft need careful engineering to balance these four forces. Rama’s flight from Lanka to Ayodhya would have required continuous thrust to overcome drag over thousands of kilometres.',
      checkQuestion: 'A 70,000 kg aircraft has engines producing 180,000 N of thrust and wings generating 700,000 N of lift. Drag is 180,000 N. What is its flight status?',
      checkAnswer: 'Weight = 70,000 × 9.8 = 686,000 N. Lift (700,000) > Weight (686,000), so it CLIMBS. Thrust (180,000) = Drag (180,000), so it maintains constant speed. The aircraft is climbing at constant speed.',
      codeIntro: 'Model the four forces on an aircraft and determine its flight status.',
      code: `# Four Forces Flight Model
mass = 75000    # kg (like an A320)
g = 9.8         # gravitational acceleration (m/s^2)
thrust = 200000 # Newtons (both engines combined)
drag = 175000   # Newtons (air resistance)
lift = 740000   # Newtons (wing lift at cruise speed)

weight = mass * g

print("=== Pushpaka Flight Computer ===")
print(f"Mass:    {mass:,} kg")
print(f"Weight:  {weight:,.0f} N  (m × g = {mass} × {g})")
print(f"Lift:    {lift:,.0f} N")
print(f"Thrust:  {thrust:,.0f} N")
print(f"Drag:    {drag:,.0f} N")
print()

# Vertical balance
net_vertical = lift - weight
if net_vertical > 0:
    print(f"Vertical: CLIMBING  (net force = +{net_vertical:,.0f} N up)")
elif net_vertical == 0:
    print("Vertical: LEVEL FLIGHT  (lift = weight)")
else:
    print(f"Vertical: DESCENDING  (net force = {net_vertical:,.0f} N down)")

# Horizontal balance
net_horizontal = thrust - drag
if net_horizontal > 0:
    print(f"Horizontal: ACCELERATING  (net = +{net_horizontal:,.0f} N forward)")
elif net_horizontal == 0:
    print("Horizontal: CONSTANT SPEED  (thrust = drag)")
else:
    print(f"Horizontal: DECELERATING  (net = {net_horizontal:,.0f} N backward)")

# Net acceleration (F = ma)
a_vertical = net_vertical / mass
a_horizontal = net_horizontal / mass
print(f"\
Vertical acceleration: {a_vertical:.2f} m/s²")
print(f"Horizontal acceleration: {a_horizontal:.2f} m/s²")`,
      challenge: 'Change the mass to 90,000 kg (a fully loaded aircraft). Does it still climb? How much extra lift or thrust would you need to maintain the same flight status?',
      successHint: 'You have built your first flight model. The four forces are just arithmetic: compare lift vs. weight and thrust vs. drag. Every flight simulator in the world starts with exactly this calculation.',
    },
    {
      title: 'The lift equation — how speed creates lift',
      concept: `Lift is not magic — it follows a precise formula:

**L = ½ × ρ × v² × S × C_L**

Where:
- **ρ** (rho) = air density (kg/m³) — about 1.225 at sea level
- **v** = airspeed (m/s) — how fast the wing moves through the air
- **S** = wing area (m²) — bigger wings = more lift
- **C_L** = lift coefficient — a number (typically 0.2 to 2.0) that depends on wing shape and angle

The **v²** is the key. Double your speed and lift quadruples. This is why takeoff requires reaching a specific speed: below that speed, the wings cannot generate enough lift to support the aircraft’s weight.

The code below calculates lift at different speeds and finds the **takeoff speed** — the minimum speed where lift equals weight.`,
      analogy: 'Think of the v² term like this: if you stick your hand out a car window at 30 km/h, you feel a gentle push. At 60 km/h (double), the push is not double — it is FOUR times stronger. That is the v² effect. Speed is the most powerful lever for generating lift.',
      storyConnection: 'The Pushpaka Vimana could reportedly hover motionless. For a real aircraft, no forward speed = no lift. Helicopters solve this with spinning blades (which create their own airspeed), but fixed-wing aircraft must always keep moving to stay airborne.',
      checkQuestion: 'An aircraft with wing area 120 m², C_L = 1.2, at sea level, needs to support 700,000 N. What is its minimum speed?',
      checkAnswer: 'L = 0.5 × 1.225 × v² × 120 × 1.2 = 88.2 × v². Set L = 700,000: v² = 700,000/88.2 = 7,936.5. v = √7936.5 ≈ 89.1 m/s ≈ 321 km/h. That is a realistic takeoff speed for a large jet.',
      codeIntro: 'Calculate lift at different speeds and find the takeoff speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Aircraft parameters (like an A320)
rho = 1.225      # air density at sea level (kg/m^3)
S = 122.6        # wing area (m^2)
C_L = 1.4        # lift coefficient (flaps down for takeoff)
mass = 73500     # kg
g = 9.8
weight = mass * g

# Calculate lift at different speeds
speeds_ms = np.linspace(0, 120, 200)  # 0 to 120 m/s
speeds_kmh = speeds_ms * 3.6           # convert to km/h
lift = 0.5 * rho * speeds_ms**2 * S * C_L

# Find takeoff speed (where lift = weight)
v_takeoff_ms = np.sqrt(weight / (0.5 * rho * S * C_L))
v_takeoff_kmh = v_takeoff_ms * 3.6

plt.figure(figsize=(10, 5))
plt.plot(speeds_kmh, lift / 1000, linewidth=2.5, color='royalblue', label='Lift force')
plt.axhline(weight / 1000, color='red', linewidth=2, linestyle='--', label=f'Weight = {weight/1000:.0f} kN')
plt.axvline(v_takeoff_kmh, color='green', linewidth=1.5, linestyle=':', alpha=0.7)
plt.annotate(f'Takeoff: {v_takeoff_kmh:.0f} km/h',
             xy=(v_takeoff_kmh, weight/1000),
             xytext=(v_takeoff_kmh + 30, weight/1000 + 100),
             fontsize=10, color='green',
             arrowprops=dict(arrowstyle='->', color='green'))

plt.xlabel('Airspeed (km/h)', fontsize=12)
plt.ylabel('Force (kN)', fontsize=12)
plt.title('Lift vs. Speed — Finding Takeoff Speed', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print(f"Takeoff speed: {v_takeoff_ms:.1f} m/s = {v_takeoff_kmh:.0f} km/h")
print(f"At this speed, lift ({weight/1000:.0f} kN) = weight ({weight/1000:.0f} kN)")
print(f"\
Notice the curve is a PARABOLA (v² effect):")
print(f"  At 50 km/h: lift = {0.5*rho*(50/3.6)**2*S*C_L/1000:.0f} kN")
print(f"  At 100 km/h: lift = {0.5*rho*(100/3.6)**2*S*C_L/1000:.0f} kN (4x more!)")`,
      challenge: 'Change rho to 0.4 (high altitude, thin air). What happens to the takeoff speed? This is why airports at high altitude need longer runways — aircraft need to go faster to get the same lift.',
      successHint: 'The lift equation is one of the most important formulas in aerospace engineering. The v² dependence means speed is everything — go fast enough and even a brick could fly (with the right wing shape).',
    },
    {
      title: 'Drag equation — the cost of speed',
      concept: `Lift is free, right? Just go faster and you get more lift? Not quite. There is a cost: **drag** also increases with speed, and it follows a similar formula:

**D = ½ × ρ × v² × S × C_D**

The C_D (drag coefficient) depends on the aircraft’s shape. A streamlined aircraft has C_D around 0.02-0.04. A brick has C_D around 1.0.

Here is the problem: as you go faster, drag increases as v² too. To maintain constant speed, your engines must produce thrust equal to drag. So flying twice as fast requires **four times the thrust** (and roughly four times the fuel consumption).

This is why commercial aircraft cruise at specific speeds — fast enough for efficient lift, but not so fast that drag wastes fuel. The code computes the **lift-to-drag ratio** (L/D), which tells you how efficiently the aircraft converts speed into altitude.`,
      analogy: 'Drag is like running through water. Walk slowly and you barely feel resistance. Run and the water pushes back hard. Sprint and it is like hitting a wall. The resistance grows as the square of your speed — doubling your speed means four times the resistance.',
      storyConnection: 'The Pushpaka Vimana was described as moving effortlessly at the speed of thought. In reality, speed always has a cost. The vulture Jatayu, who tried to stop Ravana’s Vimana, was a real bird that understood the trade-off between speed and energy expenditure. Large soaring birds like vultures maximise their lift-to-drag ratio to fly thousands of kilometres with minimal energy.',
      checkQuestion: 'If C_L = 1.0 and C_D = 0.05, what is the lift-to-drag ratio? What does this number mean physically?',
      checkAnswer: 'L/D = C_L / C_D = 1.0 / 0.05 = 20. This means for every 1 newton of drag the aircraft must overcome, it gets 20 newtons of lift. Modern gliders achieve L/D ratios of 50-70. A brick is about 0.5.',
      codeIntro: 'Plot lift, drag, and the lift-to-drag ratio across a range of speeds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

rho = 1.225
S = 122.6
C_L = 0.5       # cruise configuration (flaps up)
C_D = 0.03      # streamlined jetliner
mass = 73500
g = 9.8

speeds = np.linspace(50, 300, 200)  # m/s

lift = 0.5 * rho * speeds**2 * S * C_L
drag = 0.5 * rho * speeds**2 * S * C_D
ld_ratio = C_L / C_D  # constant for fixed C_L, C_D

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Forces vs speed
ax1.plot(speeds * 3.6, lift / 1000, linewidth=2, color='royalblue', label='Lift')
ax1.plot(speeds * 3.6, drag / 1000, linewidth=2, color='orangered', label='Drag')
ax1.set_xlabel('Airspeed (km/h)', fontsize=11)
ax1.set_ylabel('Force (kN)', fontsize=11)
ax1.set_title('Lift and Drag vs. Speed', fontsize=13)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)

# Power required (P = Drag * v)
power = drag * speeds / 1e6  # megawatts
ax2.plot(speeds * 3.6, power, linewidth=2.5, color='purple')
ax2.set_xlabel('Airspeed (km/h)', fontsize=11)
ax2.set_ylabel('Power required (MW)', fontsize=11)
ax2.set_title('Engine Power Needed vs. Speed', fontsize=13)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Lift-to-drag ratio (L/D): {ld_ratio:.1f}")
print(f"  For every 1 N of drag, wings produce {ld_ratio:.1f} N of lift")
print(f"\
Power required (P = D × v) grows as v³:")
print(f"  At 200 km/h: {0.5*rho*(200/3.6)**2*S*C_D*(200/3.6)/1e6:.2f} MW")
print(f"  At 400 km/h: {0.5*rho*(400/3.6)**2*S*C_D*(400/3.6)/1e6:.2f} MW")
print(f"  At 800 km/h: {0.5*rho*(800/3.6)**2*S*C_D*(800/3.6)/1e6:.2f} MW")
print("  Double the speed = 8x the power needed!")`,
      challenge: 'Try C_D = 0.08 (a less streamlined shape). How much more power is needed at cruising speed? This is why aircraft designers obsess over reducing drag — even tiny improvements save millions of dollars in fuel.',
      successHint: 'Drag is the tax of flight. The v² relationship means that beyond a certain speed, drag costs more energy than the lift is worth. Finding the sweet spot is the art of aerodynamic design.',
    },
    {
      title: 'Simulating takeoff — a runway acceleration model',
      concept: `Taking off is a race. The aircraft starts at rest, engines at full thrust, and accelerates down the runway. As speed increases, drag also increases (fighting the thrust) and lift builds up. The moment lift exceeds weight, the wheels leave the ground.

The code below simulates this second-by-second. At each time step:
1. Calculate current drag and lift based on current speed
2. Compute net horizontal force = thrust - drag - friction
3. Update speed using F = ma (Δv = F/m × Δt)
4. Check if lift ≥ weight (liftoff!)

This is a **physics simulation** — using equations to predict what happens over time. The same approach is used in real flight simulators, weather models, and rocket trajectory calculations.`,
      analogy: 'Takeoff is like pushing a shopping cart on a slightly uphill, muddy road. At first you push hard and accelerate. As you go faster, the mud (drag) pushes back harder. Eventually you reach a speed where the cart starts to float above the mud (liftoff). If the road runs out before you reach that speed, you are in trouble — which is why runways need to be long enough.',
      storyConnection: 'The Pushpaka Vimana reportedly rose vertically with no runway needed — like a helicopter or a modern VTOL aircraft. Conventional aircraft need hundreds of metres of runway because they must accelerate to generate enough lift. The V-22 Osprey can take off vertically using tilting rotors, but at a huge fuel cost compared to a normal takeoff run.',
      checkQuestion: 'If you shortened the runway by 500 metres, what could the pilot do to still take off safely?',
      checkAnswer: 'Several options: (1) reduce the aircraft’s mass by carrying less fuel or cargo (less weight to overcome), (2) increase engine thrust (faster acceleration), (3) deploy flaps to increase C_L (higher lift at lower speed), or (4) wait for a headwind (airspeed is ground speed + wind speed, so wind gives free airspeed). Real pilots consider all of these.',
      codeIntro: 'Simulate a takeoff run from standstill to liftoff.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Aircraft parameters
mass = 73500
g = 9.8
S = 122.6
C_L = 1.4        # flaps down (takeoff config)
C_D = 0.08       # flaps down = more drag too
rho = 1.225
thrust = 240000   # N (both engines, full takeoff power)
mu_roll = 0.02    # rolling friction coefficient

weight = mass * g
dt = 0.1          # time step (seconds)

# Simulation arrays
times, speeds, positions, lifts, drags = [0], [0], [0], [0], [0]
t, v, x = 0, 0, 0
liftoff_t, liftoff_x, liftoff_v = None, None, None

while t < 60 and x < 3000:
    t += dt
    L = 0.5 * rho * v**2 * S * C_L
    D = 0.5 * rho * v**2 * S * C_D
    friction = mu_roll * max(weight - L, 0)
    net_force = thrust - D - friction
    a = net_force / mass
    v += a * dt
    x += v * dt

    times.append(t)
    speeds.append(v)
    positions.append(x)
    lifts.append(L)
    drags.append(D)

    if L >= weight and liftoff_t is None:
        liftoff_t, liftoff_x, liftoff_v = t, x, v

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 8))

ax1.plot(times, [s * 3.6 for s in speeds], linewidth=2, color='royalblue')
if liftoff_t: ax1.axvline(liftoff_t, color='green', linestyle=':', alpha=0.7)
ax1.set_xlabel('Time (s)'); ax1.set_ylabel('Speed (km/h)')
ax1.set_title('Speed vs. Time'); ax1.grid(alpha=0.3)

ax2.plot(times, positions, linewidth=2, color='orange')
if liftoff_x: ax2.axhline(liftoff_x, color='green', linestyle=':', alpha=0.7)
ax2.set_xlabel('Time (s)'); ax2.set_ylabel('Runway distance (m)')
ax2.set_title('Position vs. Time'); ax2.grid(alpha=0.3)

ax3.plot(times, [l/1000 for l in lifts], linewidth=2, color='blue', label='Lift')
ax3.axhline(weight/1000, color='red', linestyle='--', label='Weight')
ax3.plot(times, [d/1000 for d in drags], linewidth=2, color='orange', label='Drag')
ax3.set_xlabel('Time (s)'); ax3.set_ylabel('Force (kN)')
ax3.set_title('Forces During Takeoff'); ax3.legend(fontsize=9); ax3.grid(alpha=0.3)

# Thrust vs drag
ax4.fill_between(times, [thrust/1000]*len(times), [d/1000 for d in drags], alpha=0.3, color='green', label='Net thrust')
ax4.plot(times, [thrust/1000]*len(times), color='green', linewidth=1.5, label='Thrust')
ax4.plot(times, [d/1000 for d in drags], color='red', linewidth=1.5, label='Drag')
ax4.set_xlabel('Time (s)'); ax4.set_ylabel('Force (kN)')
ax4.set_title('Thrust vs. Drag'); ax4.legend(fontsize=9); ax4.grid(alpha=0.3)

plt.tight_layout()
plt.show()

if liftoff_t:
    print(f"LIFTOFF at t = {liftoff_t:.1f} s")
    print(f"  Runway used: {liftoff_x:.0f} m")
    print(f"  Liftoff speed: {liftoff_v*3.6:.0f} km/h ({liftoff_v:.0f} m/s)")
else:
    print("WARNING: Did not achieve liftoff in simulation!")`,
      challenge: 'Try increasing the mass to 90,000 kg (heavier payload). How much longer runway does the aircraft need? Then try increasing thrust to 300,000 N. What changes?',
      successHint: 'You have just built a takeoff simulator. The same numerical integration technique (Δv = a×Δt, Δx = v×Δt) is the foundation of every physics simulation, from weather forecasting to orbital mechanics.',
    },
    {
      title: 'Jet engine thrust — Newton’s third law in action',
      concept: `A jet engine is a Newton’s third law machine. It pushes air backward, and the reaction force pushes the aircraft forward. The thrust depends on how much air it processes and how fast it accelerates that air:

**Thrust = mass_flow_rate × (v_exhaust - v_intake)**

Where:
- **mass_flow_rate** (ṁ) = kg of air passing through per second
- **v_exhaust** = speed of exhaust gas leaving the engine
- **v_intake** = speed of air entering the engine (= aircraft speed)

A turbofan engine on a 777 processes about 1,500 kg of air per second and accelerates it from ~250 m/s (cruise speed) to ~350 m/s (exhaust speed). That Δv of 100 m/s, applied to 1,500 kg/s, gives 150,000 N of thrust.

The code models a simplified jet engine and shows how thrust changes with airspeed.`,
      analogy: 'A jet engine works like standing on a skateboard and throwing bowling balls backward. Each ball you throw pushes you forward (Newton’s third law). Throw more balls per second (higher mass flow rate) or throw them faster (higher exhaust velocity) and you accelerate faster. A jet engine does this continuously with air instead of bowling balls.',
      storyConnection: 'The Ramayana describes the Pushpaka Vimana as self-propelled, needing no external force. A jet engine is self-sustaining too — its exhaust spins the turbine, which drives the compressor, which feeds the combustion. It is a beautifully circular machine that creates its own momentum.',
      checkQuestion: 'A jet engine has a mass flow rate of 200 kg/s. Air enters at 250 m/s and exits at 500 m/s. What is the thrust?',
      checkAnswer: 'Thrust = 200 × (500 - 250) = 200 × 250 = 50,000 N. At higher aircraft speeds, v_intake increases, so the speed difference decreases, and thrust drops — unless exhaust speed also increases.',
      codeIntro: 'Model a jet engine and see how thrust varies with flight speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified turbofan engine model
mass_flow = 500      # kg/s (air through engine)
v_exhaust = 400      # m/s (exhaust gas speed, fixed)
bypass_ratio = 5     # 5 kg bypass air per 1 kg core air

# At different flight speeds, thrust changes
airspeeds = np.linspace(0, 300, 200)  # m/s

# Core thrust: mass_flow_core * (v_exhaust - v_aircraft)
# Bypass thrust: mass_flow_bypass * (v_bypass_exit - v_aircraft)
m_core = mass_flow / (1 + bypass_ratio)
m_bypass = mass_flow - m_core
v_bypass_exit = 200  # m/s (fan exit speed, lower than core)

thrust_core = m_core * np.maximum(v_exhaust - airspeeds, 0)
thrust_bypass = m_bypass * np.maximum(v_bypass_exit - airspeeds, 0)
thrust_total = thrust_core + thrust_bypass

plt.figure(figsize=(10, 5))
plt.plot(airspeeds * 3.6, thrust_total / 1000, linewidth=2.5, color='royalblue', label='Total thrust')
plt.plot(airspeeds * 3.6, thrust_core / 1000, linewidth=1.5, color='red', linestyle='--', label='Core (hot exhaust)')
plt.plot(airspeeds * 3.6, thrust_bypass / 1000, linewidth=1.5, color='green', linestyle='--', label='Bypass (cold fan)')
plt.xlabel('Airspeed (km/h)', fontsize=12)
plt.ylabel('Thrust (kN)', fontsize=12)
plt.title('Turbofan Engine Thrust vs. Airspeed', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print(f"At standstill (v=0): thrust = {mass_flow * v_exhaust / 1000:.0f} kN (maximum)")
print(f"At 250 m/s (900 km/h): thrust = {thrust_total[np.argmin(np.abs(airspeeds-250))]/1000:.0f} kN")
print(f"\
Bypass contributes {m_bypass/(m_core+m_bypass)*100:.0f}% of air mass")
print(f"  but at lower exhaust speed ({v_bypass_exit} vs {v_exhaust} m/s)")
print(f"\
This is why turbofans are efficient: they move a LOT")
print(f"of air a LITTLE bit faster, rather than a little air a lot faster.")`,
      challenge: 'Increase bypass_ratio to 10 (like the latest engines). How does the thrust profile change? Why do modern engines have increasingly large fans?',
      successHint: 'The thrust equation shows why jet engines get less effective at higher speeds: the speed difference between exhaust and intake shrinks. This fundamental limit is why supersonic aircraft need afterburners or completely different engine designs.',
    },
    {
      title: 'Escape velocity — how fast to leave a planet',
      concept: `The Pushpaka Vimana flew to the heavens. To actually leave Earth, you need to reach **escape velocity**: the speed at which your kinetic energy equals the gravitational potential energy binding you to the planet.

**v_escape = √(2GM/r)**

Where G is the gravitational constant, M is the planet’s mass, and r is the distance from the planet’s centre.

For Earth: v_escape = 11.2 km/s = 40,320 km/h.

The code calculates escape velocity for every planet in the solar system and visualises the relationship between planet mass, radius, and escape velocity.`,
      analogy: 'Imagine throwing a ball straight up. Throw gently and it comes back. Throw harder and it goes higher before returning. There is one special speed where the ball goes up forever and never comes back — that is escape velocity. For Earth, that speed is 11.2 km/s. The bigger or denser the planet, the harder you have to throw.',
      storyConnection: 'Rama’s flight from Lanka to Ayodhya stayed within the atmosphere. But the ancient texts describe vimanas travelling to other lokas (worlds). To reach another planet, the Vimana would need to exceed escape velocity — a feat that requires enormous energy, far beyond any mythological description.',
      checkQuestion: 'The Moon has mass 7.34 × 10²² kg and radius 1.74 × 10⁶ m. What is its escape velocity? (G = 6.674 × 10⁻¹¹)',
      checkAnswer: 'v = √(2 × 6.674×10⁻¹¹ × 7.34×10²² / 1.74×10⁶) = √(5.626×10⁶) ≈ 2,372 m/s ≈ 2.4 km/s. About one-fifth of Earth’s. This is why leaving the Moon requires much less fuel than leaving Earth.',
      codeIntro: 'Calculate escape velocities for all planets in the solar system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

G = 6.674e-11  # gravitational constant (N m^2 / kg^2)

# Planet data: name, mass (kg), radius (m)
planets = [
    ("Mercury", 3.30e23, 2.44e6, "gray"),
    ("Venus",   4.87e24, 6.05e6, "orange"),
    ("Earth",   5.97e24, 6.37e6, "royalblue"),
    ("Mars",    6.42e23, 3.39e6, "red"),
    ("Jupiter", 1.90e27, 6.99e7, "peru"),
    ("Saturn",  5.68e26, 5.82e7, "gold"),
    ("Uranus",  8.68e25, 2.54e7, "lightblue"),
    ("Neptune", 1.02e26, 2.46e7, "blue"),
    ("Moon",    7.34e22, 1.74e6, "silver"),
]

names, v_escapes, colors = [], [], []
for name, M, r, color in planets:
    v_esc = np.sqrt(2 * G * M / r) / 1000  # km/s
    names.append(name)
    v_escapes.append(v_esc)
    colors.append(color)

plt.figure(figsize=(10, 5))
bars = plt.barh(names[::-1], v_escapes[::-1], color=colors[::-1], height=0.6)
plt.xlabel('Escape velocity (km/s)', fontsize=12)
plt.title('Escape Velocity of Solar System Bodies', fontsize=14)
plt.grid(axis='x', alpha=0.3)

for bar, v in zip(bars, v_escapes[::-1]):
    plt.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
             f'{v:.1f} km/s', va='center', fontsize=9, color='white')

plt.tight_layout()
plt.show()

print("=== Escape Velocities ===")
for name, v in zip(names, v_escapes):
    print(f"  {name:10s}: {v:5.1f} km/s  ({v*3600:.0f} km/h)")
print(f"\
Jupiter’s escape velocity is {v_escapes[4]/v_escapes[2]:.1f}x Earth’s")
print(f"Moon’s escape velocity is {v_escapes[8]/v_escapes[2]:.2f}x Earth’s")
print(f"\
This is why leaving Earth requires massive rockets,")
print(f"but leaving the Moon was done with a small engine.")`,
      challenge: 'Add Pluto (mass 1.31×10²² kg, radius 1.19×10⁶ m) and the Sun (mass 1.99×10³⁰ kg, radius 6.96×10⁸ m) to the chart. The Sun’s escape velocity is a surprise — how does it compare to the speed of light?',
      successHint: 'Escape velocity connects the ancient dream of flying to the heavens with modern rocket science. The formula is elegant: more massive or smaller planet = harder to escape. This single equation governs every space mission ever launched.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Aerodynamics fundamentals with Python</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for aerodynamics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[VimanaLiftDragDiagram, VimanaBernoulliDiagram, VimanaJetEngineDiagram, VimanaRocketDiagram, NewtonForceDiagram, WorkForceDiagram][i] ? createElement([VimanaLiftDragDiagram, VimanaBernoulliDiagram, VimanaJetEngineDiagram, VimanaRocketDiagram, NewtonForceDiagram, WorkForceDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
