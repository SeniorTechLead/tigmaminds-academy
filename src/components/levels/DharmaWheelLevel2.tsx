import { useState, useRef, useCallback } from 'react';
import { Loader2, Cog } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DharmaWheelLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Rotational kinematics — the equations of spinning',
      concept: `Just as linear motion has its kinematic equations (v = u + at, s = ut + ½at²), rotational motion has exact equivalents:

| Linear | Rotational |
|---|---|
| v = u + at | ω = ω₀ + αt |
| s = ut + ½at² | θ = ω₀t + ½αt² |
| v² = u² + 2as | ω² = ω₀² + 2αθ |

Where:
- ω = angular velocity (rad/s)
- α = angular acceleration (rad/s²)
- θ = angle turned (radians)

The connection between linear and rotational: **v = rω** and **a = rα**

This means a point on the rim of a wheel travels faster than a point near the hub. At the contact point with the ground, the rim velocity exactly equals the wheel’s forward velocity — that is why the contact point is momentarily stationary (pure rolling condition).`,
      analogy: 'Rotational kinematics is the same film as linear kinematics, just shown on a circular screen. Every equation has the same structure — replace distance with angle, velocity with angular velocity, acceleration with angular acceleration. If you know one, you know the other.',
      storyConnection: 'When the Buddha set the Wheel of Dharma in motion at Sarnath, it started from rest (ω₀ = 0) and accelerated. The rotational kinematics equations describe that exact process: how quickly it spun up, how many revolutions it completed, and the angular velocity it reached.',
      checkQuestion: 'A wheel starts from rest and accelerates at 2 rad/s² for 5 seconds. How many complete revolutions does it make?',
      checkAnswer: 'θ = ω₀t + ½αt² = 0 + ½(2)(5²) = 25 rad. Revolutions = 25 / (2π) = 3.98 ≈ 4 complete revolutions. Final angular velocity: ω = ω₀ + αt = 0 + 2(5) = 10 rad/s ≈ 95.5 RPM.',
      codeIntro: 'Simulate a wheel spinning up and plot angle, velocity, and acceleration over time.',
      code: `import numpy as np

# Rotational Kinematics Simulator
print("Rotational Kinematics: Spinning Up a Wheel")
print("=" * 55)

# Parameters
alpha = 3.0     # angular acceleration (rad/s^2)
t_max = 10.0    # seconds
dt = 0.5

print(f"Angular acceleration: {alpha} rad/s^2")
print(f"Starting from rest (omega_0 = 0)")
print()
print(f"{'Time (s)':>8} | {'omega (rad/s)':>14} | {'RPM':>8} | {'Angle (rad)':>12} | {'Revs':>6}")
print("-" * 60)

for t in np.arange(0, t_max + dt, dt):
    omega = alpha * t
    theta = 0.5 * alpha * t**2
    rpm = omega * 60 / (2 * np.pi)
    revs = theta / (2 * np.pi)
    if t % 1.0 < 0.01:
        print(f"{t:>8.1f} | {omega:>14.2f} | {rpm:>8.1f} | {theta:>12.2f} | {revs:>6.2f}")

print()

# The connection: v = r * omega
r = 0.35  # wheel radius
omega_final = alpha * t_max
v_rim = r * omega_final
print(f"At t = {t_max} s:")
print(f"  Angular velocity: {omega_final:.1f} rad/s ({omega_final * 60 / (2*np.pi):.0f} RPM)")
print(f"  Rim speed: v = r * omega = {r} * {omega_final:.1f} = {v_rim:.1f} m/s")
print(f"  That's {v_rim * 3.6:.1f} km/h at the rim!")`,
      challenge: 'A car wheel (radius 0.3 m) decelerates from 100 km/h to rest in 4 seconds. Calculate the angular deceleration and total revolutions during braking.',
      successHint: 'Rotational kinematics is the language of everything that spins. Once you map linear → rotational, every problem you solved in straight-line physics has a spinning counterpart.',
    },
    {
      title: 'Newton’s second law for rotation: τ = Iα',
      concept: `Newton’s second law says F = ma (force = mass × acceleration). The rotational version is:

**τ = Iα** (torque = moment of inertia × angular acceleration)

This is the most important equation in rotational dynamics. It tells us:
- To spin something up faster (α), you need more torque (τ)
- Heavier wheels (larger I) need more torque for the same acceleration
- For a given torque, lighter wheels accelerate faster

**Moment of inertia** depends on mass distribution:
- Move mass to the rim → I increases → harder to spin up, but more stable and stores more energy
- Move mass to the hub → I decreases → easier to spin up, but less stable

This is why:
- Racing bicycle wheels are as light as possible (small I, quick acceleration)
- Flywheel rims are as heavy as possible (large I, maximum energy storage)
- The design depends on the PURPOSE of the wheel`,
      analogy: 'τ = Iα is like F = ma wearing a spinning costume. Force becomes torque, mass becomes moment of inertia, acceleration becomes angular acceleration. The structure is identical — only the stage has changed from straight lines to circles.',
      storyConnection: 'The Dharma Wheel has eight heavy spokes extending to a broad rim. This design maximises the moment of inertia — once set in motion, it resists stopping. If the spokes were thin and the rim light, the teaching would have less "rotational inertia" and be easier to halt. The design of the symbol encodes the physics of persistence.',
      checkQuestion: 'Two wheels have the same mass (3 kg) and radius (0.4 m). One is a solid disc, the other a thin ring. Which accelerates faster under the same torque?',
      checkAnswer: 'Solid disc: I = ½mr² = ½(3)(0.16) = 0.24 kg·m². Thin ring: I = mr² = 3(0.16) = 0.48 kg·m². Since α = τ/I, the disc has lower I and accelerates twice as fast. The ring resists acceleration more because its mass is all at the rim.',
      codeIntro: 'Compare acceleration of different wheel designs under the same applied torque.',
      code: `import numpy as np

# tau = I * alpha: Rotational Newton's Second Law
print("Rotational Newton's Second Law: tau = I * alpha")
print("=" * 60)

tau = 10.0  # Applied torque (N.m)
m = 3.0     # mass (kg)
r = 0.4     # radius (m)

designs = [
    ("Solid disc",          0.5 * m * r**2),
    ("Thin ring (rim only)", m * r**2),
    ("Solid sphere",        0.4 * m * r**2),
    ("Thin spherical shell", 2/3 * m * r**2),
    ("Rod through centre",  1/12 * m * (2*r)**2),
]

print(f"Applied torque: {tau} N.m, Mass: {m} kg, Radius: {r} m")
print()
print(f"{'Design':>24} | {'I (kg.m^2)':>12} | {'alpha (rad/s^2)':>16} | {'Time to 100 RPM':>16}")
print("-" * 76)

omega_target = 100 * 2 * np.pi / 60  # 100 RPM in rad/s
for name, I in designs:
    alpha = tau / I
    t = omega_target / alpha
    print(f"{name:>24} | {I:>12.4f} | {alpha:>16.2f} | {t:>14.2f} s")

print()
print("Lower I = faster acceleration. Higher I = more energy when spinning.")
print()

# Racing vs flywheel design
print("Design tradeoff: Racing wheel vs Flywheel")
print("-" * 55)
omega = 100 * 2 * np.pi / 60
for name, I in designs[:2]:
    alpha_val = tau / I
    KE = 0.5 * I * omega**2
    print(f"  {name}:")
    print(f"    Acceleration: {alpha_val:.2f} rad/s^2 (agility)")
    print(f"    Energy at 100 RPM: {KE:.1f} J (storage)")`,
      challenge: 'A motor applies 5 N·m of torque to a wheel but friction opposes with 1.2 N·m. Net torque = 5 - 1.2 = 3.8 N·m. If I = 0.5 kg·m², plot the angular velocity over 20 seconds. When does the wheel reach 1000 RPM?',
      successHint: 'τ = Iα is the rotational law of motion. Combined with L = Iω and KE = ½Iω², these three equations form the complete toolkit for analysing anything that spins.',
    },
    {
      title: 'Gear trains — trading speed for torque',
      concept: `Gears are wheels with teeth that interlock. When a small gear drives a large gear:
- The large gear turns **slower** (lower ω)
- But it turns with **more torque** (τ)
- Power is conserved: P = τω stays (roughly) constant

The **gear ratio** = teeth on driven gear / teeth on driving gear

If a 20-tooth gear drives a 60-tooth gear:
- Gear ratio = 60/20 = 3:1
- Output turns 3× slower
- Output has 3× more torque

This is why:
- Bicycles have gear shifts (low gear = more torque for hills, high gear = more speed for flats)
- Cars have transmissions (1st gear for starting, 5th gear for highway)
- Clocks use gear trains (converting fast spring energy into slow, precise hand movement)

The fundamental tradeoff: **you cannot get more speed AND more torque**. You can only convert one into the other.`,
      analogy: 'A gear train is like a currency exchange. You trade speed for torque, or torque for speed. A 3:1 gear ratio is like exchanging 3 dollars for 1 euro — you get fewer units, but each one is worth more. You never get something for nothing; you just change the denomination.',
      storyConnection: 'Buddhist monasteries historically used water wheels with gear trains to grind grain and power prayer wheels. The rushing water provided high speed but low torque. Gears converted that into the slow, powerful rotation needed to turn heavy stone mills. The same principle powers the Dharma Wheel metaphor: teachings are "geared" for different audiences.',
      checkQuestion: 'A motor spins at 1500 RPM with 2 N·m of torque. You need 150 RPM at the output. What gear ratio do you need, and what torque will you get?',
      checkAnswer: 'Gear ratio = 1500/150 = 10:1. Output torque = 2 × 10 = 20 N·m (ignoring friction losses). Power check: input = 2 × (1500×2π/60) = 314 W. Output = 20 × (150×2π/60) = 314 W. Power is conserved.',
      codeIntro: 'Design a gear train for a specific application and verify power conservation.',
      code: `import numpy as np

# Gear Train Calculator
print("Gear Train Design: Trading Speed for Torque")
print("=" * 60)

def gear_train(omega_in, tau_in, ratio, efficiency=0.95):
    omega_out = omega_in / ratio
    tau_out = tau_in * ratio * efficiency
    P_in = tau_in * omega_in
    P_out = tau_out * omega_out
    return omega_out, tau_out, P_in, P_out

# Motor specs
motor_rpm = 3000
motor_torque = 5  # N.m
motor_omega = motor_rpm * 2 * np.pi / 60

print(f"Motor: {motor_rpm} RPM, {motor_torque} N.m")
print(f"Power: {motor_torque * motor_omega:.0f} W")
print()

# Different applications
apps = [
    ("Bicycle (flat road)", 1.0),
    ("Bicycle (steep hill)", 3.0),
    ("Clock mechanism", 100.0),
    ("Industrial mixer", 10.0),
    ("Wind turbine", 50.0),
]

print(f"{'Application':>24} | {'Ratio':>6} | {'Out RPM':>8} | {'Out Torque':>11} | {'Power Out':>10}")
print("-" * 72)

for name, ratio in apps:
    o_out, t_out, p_in, p_out = gear_train(motor_omega, motor_torque, ratio)
    rpm_out = o_out * 60 / (2 * np.pi)
    print(f"{name:>24} | {ratio:>5.0f}:1 | {rpm_out:>8.1f} | {t_out:>9.1f} N.m | {p_out:>8.0f} W")

print()
print("Note: Power is roughly conserved (5% loss per stage).")
print("You CANNOT increase both speed AND torque — only trade one for the other.")
print()

# Multi-stage gearing
print("Multi-Stage Gearing (3 stages of 5:1 = 125:1 total):")
omega, tau = motor_omega, motor_torque
for stage in range(3):
    omega_new, tau_new, _, _ = gear_train(omega, tau, 5.0)
    print(f"  Stage {stage+1}: {omega*60/(2*np.pi):.0f} RPM, {tau:.1f} N.m -> {omega_new*60/(2*np.pi):.1f} RPM, {tau_new:.1f} N.m")
    omega, tau = omega_new, tau_new`,
      challenge: 'Design a gear train for a bicycle that allows the rider to climb a 15% grade (requiring 40 N·m at the wheel) and also cruise at 30 km/h on flat ground, using a motor that outputs 10 N·m at 80 RPM. How many gear ratios do you need?',
      successHint: 'Gears are the translators of rotational physics. They let you match a motor’s characteristics to any task. Understanding P = τω (power = torque × angular velocity) is the key to all mechanical design.',
    },
    {
      title: 'Rolling without slipping — the pure roll condition',
      concept: `When a wheel rolls perfectly on a surface without skidding:

**v = rω** (translational velocity = radius × angular velocity)

This is the **pure rolling condition**. It means the contact point between wheel and ground has zero velocity relative to the ground. Sounds impossible? Think about it: the bottom of a rolling wheel moves backward (from rotation) at exactly the same speed the whole wheel moves forward (from translation). These cancel perfectly.

When the wheel is:
- Spinning too fast for its forward speed → **wheel spin** (like tires on ice)
- Moving forward too fast for its spin → **skidding** (like locked brakes)

The total kinetic energy of a rolling wheel:
**KE_total = ½mv² + ½Iω²** (translational + rotational)

For a solid disc rolling at speed v:
KE = ½mv² + ½(½mr²)(v/r)² = ½mv² + ¼mv² = ¾mv²

A rolling disc has 50% more kinetic energy than a sliding block of the same mass at the same speed!`,
      analogy: 'A rolling wheel’s contact point is like a relay runner handing off a baton. Each point on the rim touches the ground for an instant (velocity = 0), hands off the job to the next point, then lifts away. The "baton" of ground contact passes smoothly around the wheel. If the runner trips (skids) or hands off too early (spins), the relay breaks down.',
      storyConnection: 'The Dharma Wheel rolls through history without slipping — each generation of teachers "touches down" to deliver the teaching, then lifts away as the next takes over. Pure rolling is the physics of continuous, unbroken transmission.',
      checkQuestion: 'A wheel (radius 0.5 m) rolls down a hill at 10 m/s. What is its angular velocity? What if it starts skidding (pure translation, no rotation)?',
      checkAnswer: 'Pure rolling: ω = v/r = 10/0.5 = 20 rad/s. If skidding (locked wheels): ω = 0 but v = 10 m/s. The skidding wheel has less total KE because it lacks the rotational component. Also, skidding → kinetic friction → longer stopping distance than rolling with brakes that maintain the pure roll condition (ABS braking).',
      codeIntro: 'Simulate a wheel rolling down a ramp and compare pure rolling vs skidding.',
      code: `import numpy as np

# Pure Rolling vs Skidding
print("Rolling Without Slipping: v = r * omega")
print("=" * 55)

m = 5.0     # mass (kg)
r = 0.3     # radius (m)
g = 9.81
angle = 30  # degrees - ramp angle

# For a solid disc rolling without slipping down a ramp:
# a = g * sin(theta) / (1 + I/(mr^2))
# For solid disc: I = 0.5*m*r^2, so I/(mr^2) = 0.5
# a = g * sin(theta) / 1.5

a_roll = g * np.sin(np.radians(angle)) / 1.5
a_slide = g * np.sin(np.radians(angle))  # no rotation, pure sliding (frictionless)

print(f"Ramp angle: {angle}°")
print(f"  Rolling acceleration:  {a_roll:.2f} m/s^2")
print(f"  Sliding acceleration:  {a_slide:.2f} m/s^2")
print(f"  Sliding is {a_slide/a_roll:.2f}x faster!")
print()

# Time to roll 5 metres
L = 5.0  # ramp length
t_roll = np.sqrt(2 * L / a_roll)
t_slide = np.sqrt(2 * L / a_slide)
v_roll = a_roll * t_roll
v_slide = a_slide * t_slide

print(f"Race down a {L} m ramp:")
print(f"  Rolling: {t_roll:.2f} s, final speed {v_roll:.2f} m/s")
print(f"  Sliding: {t_slide:.2f} s, final speed {v_slide:.2f} m/s")
print()

# Energy breakdown at bottom
KE_trans = 0.5 * m * v_roll**2
I = 0.5 * m * r**2
omega = v_roll / r
KE_rot = 0.5 * I * omega**2
KE_total = KE_trans + KE_rot
PE_lost = m * g * L * np.sin(np.radians(angle))

print("Energy breakdown for rolling disc at bottom:")
print(f"  Translational KE: {KE_trans:.1f} J ({100*KE_trans/KE_total:.0f}%)")
print(f"  Rotational KE:    {KE_rot:.1f} J ({100*KE_rot/KE_total:.0f}%)")
print(f"  Total KE:         {KE_total:.1f} J")
print(f"  PE lost:          {PE_lost:.1f} J")
print(f"  Energy conserved? {'Yes' if abs(KE_total - PE_lost) < 0.1 else 'Check!'}")`,
      challenge: 'Race different shapes down the same ramp: solid disc, hollow ring, solid sphere, hollow sphere. Which arrives first? (Hint: it depends only on I/(mr²), not on mass or radius.)',
      successHint: 'The pure rolling condition v = rω is the foundation of wheeled transport. ABS brakes, traction control, and differential gears all exist to maintain this condition. Breaking it means losing efficiency and control.',
    },
    {
      title: 'Rotational energy in real machines — engines and turbines',
      concept: `Every engine and turbine converts some form of energy into rotational motion. The key metric is **power**:

**P = τω** (power = torque × angular velocity)

This tells us:
- A diesel engine at 200 N·m and 2000 RPM: P = 200 × (2000×2π/60) = 41,888 W ≈ 56 HP
- A bicycle rider at 40 N·m and 80 RPM: P = 40 × (80×2π/60) = 335 W ≈ 0.45 HP

Engine types differ in how they produce torque:
- **Internal combustion**: expanding gas pushes pistons, converted to rotation via crankshaft
- **Electric motor**: magnetic fields push coils, directly rotational
- **Turbine**: flowing fluid pushes blades, directly rotational
- **Human muscle**: muscle contraction pulls on levers (bones), converted to rotation at joints

All produce torque. All follow τ = Iα. All are limited by P = τω.

The **torque curve** of an engine shows how torque varies with RPM. Petrol engines peak at mid-RPM; electric motors deliver maximum torque at zero RPM (which is why electric cars accelerate so fast from a standstill).`,
      analogy: 'Power is like the flow rate of water from a tap. Torque is the water pressure, and angular velocity is how wide you open the tap. You can have high pressure with a narrow opening (high torque, low RPM — a diesel engine climbing a hill) or low pressure with the tap wide open (low torque, high RPM — a motorcycle on the highway). The total flow (power) is pressure × opening.',
      storyConnection: 'The Dharma Wheel is turned by different forces in different eras — the Buddha’s direct teaching (high torque, low speed), then written sutras spreading widely (lower torque per reader, but reaching millions). The total power of the teaching’s spread is τω — the product of intensity and reach.',
      checkQuestion: 'Why can an electric car beat a petrol supercar in a 0-100 km/h sprint, even though the supercar has more power?',
      checkAnswer: 'Electric motors produce maximum torque at 0 RPM. From a standstill, every bit of the motor’s torque is available for acceleration. Petrol engines need to reach mid-range RPM before peak torque is available, and the clutch/transmission wastes time and energy during launch. Even though the supercar may have 500 HP vs 300 HP for the EV, the EV delivers its torque instantly while the petrol car is still building up. P = τω matters, but τ at zero ω matters most for launch.',
      codeIntro: 'Model engine torque curves and compare power output of different engine types.',
      code: `import numpy as np

# Engine Torque Curves and Power
print("Engine Power: P = torque * omega")
print("=" * 55)

def petrol_torque(rpm):
    """Typical petrol engine torque curve: peaks at ~4000 RPM"""
    peak = 4000
    tau_max = 200  # N.m
    return tau_max * np.exp(-0.5 * ((rpm - peak) / 2000)**2)

def electric_torque(rpm):
    """Electric motor: max torque at 0, constant to base speed, then drops"""
    tau_max = 300  # N.m
    base_speed = 3000
    if isinstance(rpm, np.ndarray):
        result = np.where(rpm <= base_speed, tau_max, tau_max * base_speed / rpm)
        return result
    return tau_max if rpm <= base_speed else tau_max * base_speed / rpm

def diesel_torque(rpm):
    """Diesel: broader torque curve, peaks at lower RPM"""
    peak = 2500
    tau_max = 350  # N.m
    return tau_max * np.exp(-0.5 * ((rpm - peak) / 1500)**2)

rpms = np.linspace(500, 7000, 14)

print(f"{'RPM':>6} | {'Petrol (N.m)':>13} | {'Electric (N.m)':>15} | {'Diesel (N.m)':>13}")
print("-" * 55)

for rpm in rpms:
    p = petrol_torque(rpm)
    e = electric_torque(rpm)
    d = diesel_torque(rpm)
    print(f"{rpm:>6.0f} | {p:>13.0f} | {e:>15.0f} | {d:>13.0f}")

print()
# Power comparison at 3000 RPM
rpm_test = 3000
omega = rpm_test * 2 * np.pi / 60
for name, func in [("Petrol", petrol_torque), ("Electric", electric_torque), ("Diesel", diesel_torque)]:
    tau = func(rpm_test)
    P = tau * omega
    hp = P / 745.7
    print(f"{name:>10} at {rpm_test} RPM: {tau:.0f} N.m, {P:.0f} W ({hp:.0f} HP)")`,
      challenge: 'Plot all three torque curves AND their power curves (P = τ × ω) on the same chart. Where does each engine type produce maximum POWER? (Hint: it is NOT at peak torque.)',
      successHint: 'P = τω is the master equation of mechanical engineering. Every engine, motor, turbine, and windmill is designed around this relationship. Understanding it lets you evaluate any rotating machine.',
    },
    {
      title: 'Flywheel optimisation — materials, speed limits, and design',
      concept: `A flywheel stores energy as KE = ½Iω². To store more energy, you can increase I (heavier, bigger) or ω (faster spin). Since KE depends on ω², speed is more effective — but there is a limit.

The limit is **centripetal stress**. Every particle of the spinning wheel experiences an outward force (centripetal acceleration = ω²r). The stress on the material at the rim:

**σ = ρω²r²** (density × angular velocity² × radius²)

When σ exceeds the material’s tensile strength, the flywheel **explodes**. This limits the maximum energy per unit mass:

**E/m = σ_max / (2ρ)** (energy per mass = tensile strength / twice the density)

This reveals the optimal material: **high strength, low density** — carbon fibre, not steel.

| Material | Strength (MPa) | Density (kg/m³) | E/m (kJ/kg) |
|---|---|---|---|
| Steel | 500 | 7800 | 32 |
| Titanium | 900 | 4500 | 100 |
| Carbon fibre | 2000 | 1600 | 625 |

Carbon fibre stores nearly 20× more energy per kg than steel!`,
      analogy: 'A flywheel at maximum speed is like a balloon inflated to bursting. The faster it spins, the more the rim material stretches outward. A stronger, lighter material (carbon fibre) is like a stronger balloon — it can be inflated further before popping, storing more air (energy) per gram of rubber (mass).',
      storyConnection: 'The Dharma Wheel is depicted as indestructible — a perfect, eternal wheel. In reality, every flywheel has a speed limit beyond which it disintegrates. The lesson: even the strongest wheel has limits. Understanding those limits (through materials science) is how engineers build flywheels that approach the ideal without breaking.',
      checkQuestion: 'A steel flywheel (density 7800 kg/m³, strength 500 MPa, radius 0.5 m) — what is its maximum RPM before failure?',
      checkAnswer: 'σ = ρω²r². At failure: ω_max = sqrt(σ_max / (ρr²)) = sqrt(500×10⁶ / (7800 × 0.25)) = sqrt(256,410) = 506.4 rad/s = 4,834 RPM. A carbon fibre flywheel of the same size: ω_max = sqrt(2000×10⁶ / (1600 × 0.25)) = sqrt(5,000,000) = 2,236 rad/s = 21,354 RPM. Nearly 4.5× faster.',
      codeIntro: 'Compare flywheel materials and find the optimal design for maximum energy density.',
      code: `import numpy as np

# Flywheel Optimisation: Materials and Speed Limits
print("Flywheel Material Comparison")
print("=" * 65)

materials = [
    ("Cast iron",    200e6,  7200,  "Traditional"),
    ("Steel",        500e6,  7800,  "Common"),
    ("Aluminium",    300e6,  2700,  "Lightweight"),
    ("Titanium",     900e6,  4500,  "Aerospace"),
    ("Glass fibre",  1000e6, 2000,  "Composite"),
    ("Carbon fibre", 2000e6, 1600,  "Advanced"),
    ("CNT (theory)", 60000e6, 1300, "Future"),
]

r = 0.3  # radius (m)

print(f"Flywheel radius: {r} m")
print()
print(f"{'Material':>16} | {'E/m (kJ/kg)':>12} | {'Max RPM':>9} | {'Max rim speed':>14}")
print("-" * 60)

for name, sigma, rho, note in materials:
    # Energy per mass
    e_per_m = sigma / (2 * rho) / 1000  # kJ/kg
    # Max angular velocity
    omega_max = np.sqrt(sigma / (rho * r**2))
    rpm_max = omega_max * 60 / (2 * np.pi)
    v_rim = omega_max * r
    print(f"{name:>16} | {e_per_m:>12.0f} | {rpm_max:>9.0f} | {v_rim:>11.0f} m/s")

print()
print("Key insight: energy/mass depends ONLY on strength/density ratio.")
print("Carbon fibre: 20x better than cast iron.")
print("CNT (carbon nanotubes): could theoretically store 23,000 kJ/kg")
print("  — that's more than petrol (46,000 kJ/kg is chemical, but")
print("     only ~30% converts to motion. CNT would be ~100% efficient).")`,
      challenge: 'Design a flywheel UPS (uninterruptible power supply) that can deliver 10 kW for 60 seconds. Choose material, radius, and mass. What RPM range (max to min) does it operate in?',
      successHint: 'Flywheel engineering is a beautiful application of rotational physics + materials science. The equations are simple (σ = ρω²r², KE = ½Iω²), but optimising real designs requires understanding material failure, bearing losses, vacuum systems, and cost. In Level 3, we build the complete flywheel simulator.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cog className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Rotational dynamics, gears, rolling physics, and flywheel engineering</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for rotational dynamics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cog className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
