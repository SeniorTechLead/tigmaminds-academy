import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import VimanaBernoulliDiagram from '../diagrams/VimanaBernoulliDiagram';
import VimanaLiftDragDiagram from '../diagrams/VimanaLiftDragDiagram';
import VimanaJetEngineDiagram from '../diagrams/VimanaJetEngineDiagram';
import BernoulliDiagram from '../diagrams/BernoulliDiagram';
import VimanaRocketDiagram from '../diagrams/VimanaRocketDiagram';
import EnergyBarChartDiagram from '../diagrams/EnergyBarChartDiagram';

export default function VimanaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Airfoil pressure distribution — mapping the forces',
      concept: `In Level 1 you calculated total lift from the lift equation. Now let’s look at where that lift actually comes from by mapping the **pressure distribution** around an airfoil.

Pressure is not uniform around a wing. It varies at every point along the surface. On the upper surface, pressure drops dramatically near the leading edge (where air accelerates most), creating a strong suction effect. On the lower surface, pressure stays near atmospheric.

The **pressure coefficient** C_p tells us how pressure at any point compares to free-stream pressure:
**C_p = (P - P_∞) / (½ρv²_∞)**

Negative C_p = suction (lower than ambient). Positive C_p = compression.

We will model a simplified airfoil and plot C_p around it. The area between the upper and lower C_p curves represents the net lift.`,
      analogy: 'Think of the pressure distribution as a topographic map of force on the wing. The upper surface has a deep valley of low pressure (suction pulling the wing up). The lower surface has a gentle hill of high pressure (pushing the wing up). The total lift is like the volume of earth between the valley and the hill.',
      storyConnection: 'Jatayu attacked Ravana’s Vimana from above, clawing at its upper surface. If the Vimana were a real aircraft, damaging the upper surface would be devastating — it is where most of the suction (lift) is generated. A dent on top is far worse than a dent on the bottom.',
      checkQuestion: 'If C_p on the upper surface peaks at -3.0 at the leading edge and on the lower surface is +0.5, which surface contributes more to lift?',
      checkAnswer: 'The upper surface contributes far more. C_p = -3.0 means the pressure is 3 dynamic pressures below ambient (strong suction), while +0.5 on the lower surface is only a mild compression. Typically, about 60-70% of total lift comes from the upper surface suction.',
      codeIntro: 'Model pressure distribution around an airfoil cross-section.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified NACA 2412 airfoil pressure distribution
# x/c = position along chord (0 = leading edge, 1 = trailing edge)
x_upper = np.array([0, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])
Cp_upper = np.array([1.0, -2.5, -2.0, -1.4, -0.9, -0.65, -0.5, -0.4, -0.3, -0.2, -0.12, -0.05, 0.0])

x_lower = np.array([0, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])
Cp_lower = np.array([1.0, 0.2, 0.15, 0.1, 0.05, 0.02, -0.02, -0.05, -0.07, -0.06, -0.04, -0.02, 0.0])

plt.figure(figsize=(10, 6))
plt.plot(x_upper, Cp_upper, 'b-o', linewidth=2, markersize=5, label='Upper surface')
plt.plot(x_lower, Cp_lower, 'r-s', linewidth=2, markersize=5, label='Lower surface')
plt.fill_between(x_upper, Cp_upper, np.interp(x_upper, x_lower, Cp_lower),
                 alpha=0.15, color='green', label='Net lift (area between)')
plt.gca().invert_yaxis()  # Convention: negative Cp (suction) at top
plt.xlabel('Position along chord (x/c)', fontsize=12)
plt.ylabel('Pressure coefficient C_p', fontsize=12)
plt.title('Pressure Distribution Around an Airfoil (NACA 2412)', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.axhline(0, color='gray', linewidth=0.5)
plt.show()

# Estimate C_L from pressure distribution
# C_L ≈ integral of (Cp_lower - Cp_upper) dx/c
Cp_diff = np.interp(x_upper, x_lower, Cp_lower) - Cp_upper
C_L_estimate = np.trapz(Cp_diff, x_upper)

print(f"Estimated C_L from pressure distribution: {C_L_estimate:.2f}")
print(f"\\nKey observations:")
print(f"  Peak suction on upper surface: C_p = {min(Cp_upper):.1f} (at {x_upper[np.argmin(Cp_upper)]:.3f}c)")
print(f"  The leading edge has the strongest pressure gradient")
print(f"  About {abs(min(Cp_upper))/(abs(min(Cp_upper))+max(Cp_lower))*100:.0f}% of lift comes from upper surface suction")`,
      challenge: 'Increase the angle of attack by making Cp_upper more negative (e.g., peak of -4.0 instead of -2.5). What happens to C_L? At what point would the flow separate (stall)?',
      successHint: 'Pressure distribution is how aerodynamicists really think about lift. The lift equation gives you the total; the pressure distribution tells you where it comes from and where things might go wrong (separation, stall).',
    },
    {
      title: 'Angle of attack and stall — the limit of lift',
      concept: `Every wing has a maximum lift it can produce, and exceeding that limit causes a **stall** — a sudden, dramatic loss of lift.

The **angle of attack** (α) is the angle between the wing and the oncoming air. Increasing α increases lift — up to a point. Beyond about 15-18° for most airfoils, the smooth airflow over the upper surface **separates** from the wing. Instead of following the curve, the air breaks away into turbulent eddies. Pressure above the wing jumps up (less suction), and lift collapses.

This is a stall. It does not mean the engine stopped — it means the wing stopped producing enough lift. It can happen at any speed and any altitude if the angle of attack exceeds the critical value.

The code models C_L vs. α and simulates what happens during a stall.`,
      analogy: 'Hold your hand flat out a car window, tilted slightly up. You feel lift. Tilt it more and the lift increases. But tilt it too far and suddenly your hand gets pushed backward chaotically — the smooth airflow broke up into turbulence. That is a stall. There is a critical angle beyond which smooth flow cannot cling to the surface.',
      storyConnection: 'Jatayu’s wings were cut by Ravana during his attack on the Vimana. A damaged wing cannot maintain smooth airflow, which means reduced lift and potential stall. Real birds can partially compensate for wing damage by adjusting their angle of attack — but beyond a point, they cannot fly.',
      checkQuestion: 'Why do aircraft stall at higher speeds at high altitude compared to sea level?',
      checkAnswer: 'At high altitude, air density (ρ) is lower. Lift = ½ρv²SC_L. With lower ρ, the aircraft needs higher speed (v) to generate the same lift. The stall speed (minimum speed for level flight) increases with altitude because the air is thinner.',
      codeIntro: 'Model the lift coefficient vs. angle of attack, including the stall region.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lift coefficient vs angle of attack for a typical airfoil
alpha = np.linspace(-5, 25, 300)  # degrees

# Before stall: C_L increases linearly (about 0.1 per degree)
# Stall occurs around 15-16 degrees
alpha_stall = 15.5
C_L_max = 1.6
slope = 0.1  # per degree (typical for most airfoils)

C_L = np.where(
    alpha < alpha_stall,
    slope * (alpha + 2),  # linear region (C_L = 0 at alpha = -2)
    C_L_max * np.exp(-0.15 * (alpha - alpha_stall)**2)  # post-stall drop
)

# Also model C_D (drag increases sharply at stall)
C_D = 0.01 + 0.005 * alpha**2 / 100 + np.where(
    alpha > alpha_stall,
    0.15 * (alpha - alpha_stall),
    0
)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# C_L vs alpha
ax1.plot(alpha, C_L, linewidth=2.5, color='royalblue')
ax1.axvline(alpha_stall, color='red', linestyle='--', linewidth=1.5, label=f'Stall ({alpha_stall}°)')
ax1.axhline(C_L_max, color='green', linestyle=':', alpha=0.5)
ax1.annotate(f'C_L max = {C_L_max}', xy=(alpha_stall, C_L_max),
             xytext=(alpha_stall + 3, C_L_max - 0.3),
             fontsize=10, arrowprops=dict(arrowstyle='->', color='red'))
ax1.fill_between(alpha, C_L, where=alpha > alpha_stall, alpha=0.15, color='red', label='Stall region')
ax1.set_xlabel('Angle of attack α (°)', fontsize=11)
ax1.set_ylabel('Lift coefficient C_L', fontsize=11)
ax1.set_title('Lift vs. Angle of Attack', fontsize=13)
ax1.legend(fontsize=9); ax1.grid(alpha=0.3)

# C_L / C_D (efficiency)
ld = C_L / np.maximum(C_D, 0.001)
ax2.plot(alpha, ld, linewidth=2.5, color='green')
best_alpha = alpha[np.argmax(ld)]
ax2.axvline(best_alpha, color='green', linestyle='--', alpha=0.5)
ax2.annotate(f'Best L/D at {best_alpha:.0f}°', xy=(best_alpha, max(ld)),
             xytext=(best_alpha + 5, max(ld) - 5), fontsize=10,
             arrowprops=dict(arrowstyle='->', color='green'))
ax2.set_xlabel('Angle of attack α (°)', fontsize=11)
ax2.set_ylabel('Lift-to-drag ratio (L/D)', fontsize=11)
ax2.set_title('Aerodynamic Efficiency', fontsize=13)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Stall angle: {alpha_stall}°")
print(f"Maximum C_L: {C_L_max}")
print(f"Best L/D ratio: {max(ld):.1f} at α = {best_alpha:.0f}°")
print(f"\\nCruise is typically at the best L/D angle ({best_alpha:.0f}°)")
print(f"Takeoff uses higher α for maximum lift (closer to stall)")`,
      challenge: 'Add leading-edge slats (shift stall angle to 20° and increase C_L_max to 2.2). This is what real aircraft do for takeoff and landing. Plot both clean and slatted wing on the same chart.',
      successHint: 'Stall is the most dangerous aerodynamic phenomenon pilots face. Understanding the C_L vs. α curve is essential for every pilot and aircraft designer. The margin between maximum lift and stall is often just a few degrees.',
    },
    {
      title: 'Climb and descent — full flight profile simulation',
      concept: `In Level 1, we simulated takeoff. Now let’s simulate an entire flight: takeoff, climb, cruise, descent, and landing. This requires tracking altitude, speed, and fuel burn over time.

The key physics:
- **Climb**: thrust > drag, lift > weight. Aircraft gains altitude at the cost of excess thrust.
- **Cruise**: thrust = drag, lift = weight. Constant altitude and speed. Most fuel-efficient.
- **Descent**: engines at idle, drag > thrust. Aircraft trades altitude for forward distance (glides).

Rate of climb depends on **excess power**: power available from engines minus power needed to overcome drag. The higher the excess, the faster the climb.

**ROC = (Thrust - Drag) × v / Weight** (metres per second)`,
      analogy: 'A full flight is like a car trip over a mountain pass. You accelerate on the flat approach (takeoff run), power uphill at full throttle (climb), cruise along the ridge (cruise altitude), then coast downhill in neutral (descent), and brake to a stop at the destination (landing). Each phase has different engine settings and speed.',
      storyConnection: 'The Ramayana describes Rama pointing out landmarks as the Vimana flew from Lanka to Ayodhya. At cruising altitude, the entire Indian peninsula would have been visible below. Modern aircraft cruise at 10-12 km altitude, where you can see the curvature of the earth and landmarks hundreds of kilometres away — just as the text describes.',
      checkQuestion: 'Why do aircraft cruise at high altitude (10-12 km) rather than low altitude?',
      checkAnswer: 'At high altitude, air density is much lower (about 1/3 of sea level). Lower density means less drag at any given speed. The aircraft can fly faster for the same fuel consumption, or maintain the same speed with less thrust. The trade-off is that engines produce less thrust in thin air, but the drag reduction more than compensates.',
      codeIntro: 'Simulate a complete flight profile from takeoff to landing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Flight parameters
mass = 73500; g = 9.8; S = 122.6
max_thrust = 240000; idle_thrust = 20000
C_L_cruise = 0.5; C_D_cruise = 0.03
cruise_alt = 10000  # metres
cruise_speed = 230  # m/s

dt = 1  # 1-second time steps
t, alt, speed, dist = 0, 0, 0, 0
times, alts, speeds, dists, phases = [], [], [], [], []

phase = 'takeoff'
fuel = 15000  # kg of fuel

while t < 7200 and phase != 'stopped':
    # Air density decreases with altitude (ISA model)
    rho = 1.225 * np.exp(-alt / 8500)
    weight = (mass + fuel) * g

    if phase == 'takeoff':
        thrust = max_thrust; C_L, C_D = 1.4, 0.08
        L = 0.5 * rho * speed**2 * S * C_L
        D = 0.5 * rho * speed**2 * S * C_D
        net = thrust - D - 0.02 * max(weight - L, 0)
        speed += (net / (mass + fuel)) * dt
        dist += speed * dt
        if L >= weight: phase = 'climb'; speed = max(speed, 80)

    elif phase == 'climb':
        thrust = max_thrust * 0.9
        L = weight  # maintain level acceleration
        D = 0.5 * rho * speed**2 * S * C_D_cruise * 1.5
        roc = (thrust - D) * speed / weight
        alt += roc * dt; speed = min(speed + 0.5 * dt, cruise_speed)
        dist += speed * dt; fuel -= 1.2 * dt / 1000
        if alt >= cruise_alt: phase = 'cruise'

    elif phase == 'cruise':
        thrust_needed = 0.5 * rho * cruise_speed**2 * S * C_D_cruise
        thrust = thrust_needed; speed = cruise_speed
        dist += speed * dt; fuel -= 0.8 * dt / 1000
        if dist > 2500000: phase = 'descent'  # ~2500 km flight

    elif phase == 'descent':
        thrust = idle_thrust; speed = max(speed - 0.3 * dt, 80)
        D = 0.5 * rho * speed**2 * S * C_D_cruise
        rod = (D - thrust) * speed / weight
        alt -= max(rod * dt, 0); alt = max(alt, 0)
        dist += speed * dt; fuel -= 0.3 * dt / 1000
        if alt <= 0: phase = 'stopped'

    times.append(t / 60); alts.append(alt / 1000)
    speeds.append(speed * 3.6); dists.append(dist / 1000)
    phases.append(phase)
    t += dt

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 8))

ax1.plot(times, alts, linewidth=2, color='royalblue')
ax1.set_xlabel('Time (min)'); ax1.set_ylabel('Altitude (km)')
ax1.set_title('Altitude Profile'); ax1.grid(alpha=0.3)

ax2.plot(times, speeds, linewidth=2, color='green')
ax2.set_xlabel('Time (min)'); ax2.set_ylabel('Speed (km/h)')
ax2.set_title('Speed Profile'); ax2.grid(alpha=0.3)

ax3.plot(times, dists, linewidth=2, color='orange')
ax3.set_xlabel('Time (min)'); ax3.set_ylabel('Distance (km)')
ax3.set_title('Distance Covered'); ax3.grid(alpha=0.3)

# Phase timeline
phase_colors = {'takeoff': 'red', 'climb': 'orange', 'cruise': 'green', 'descent': 'blue', 'stopped': 'gray'}
for i in range(len(times) - 1):
    ax4.axvspan(times[i], times[i+1], color=phase_colors.get(phases[i], 'gray'), alpha=0.3)
ax4.set_xlabel('Time (min)'); ax4.set_yticks([])
ax4.set_title('Flight Phases'); ax4.grid(alpha=0.3)
for p, c in phase_colors.items():
    if p in phases: ax4.plot([], [], color=c, linewidth=8, alpha=0.5, label=p)
ax4.legend(fontsize=9)

plt.tight_layout()
plt.show()

print(f"Total flight time: {times[-1]:.0f} minutes")
print(f"Total distance: {dists[-1]:.0f} km")
print(f"Cruise altitude: {cruise_alt/1000:.0f} km")
print(f"Fuel remaining: {fuel:.0f} kg")`,
      challenge: 'Change cruise_alt to 12,000 m and see how it affects flight time and fuel consumption. Higher cruise = less drag = less fuel, but longer climb.',
      successHint: 'You have simulated a complete flight — the same kind of simulation that airlines use to plan routes, calculate fuel loads, and optimise efficiency. The physics is just forces and energy, applied step by step over time.',
    },
    {
      title: 'The Tsiolkovsky rocket equation — tyranny of fuel',
      concept: `The **Tsiolkovsky rocket equation** is the most important and most frustrating equation in space travel:

**Δv = v_e × ln(m_0 / m_f)**

Where:
- **Δv** = change in velocity (how much speed you can gain)
- **v_e** = exhaust velocity (how fast gas leaves the engine)
- **m_0** = initial mass (rocket + fuel + payload)
- **m_f** = final mass (rocket + payload, after fuel is burned)
- **ln** = natural logarithm

The logarithm is the tyrant. To double your Δv, you need to **square** your mass ratio (m_0/m_f). Want to go to Mars? You need about 4 km/s more Δv than orbit. That means exponentially more fuel.

This is why rockets use **staging**: when a fuel tank is empty, you drop it to reduce m_f, improving the mass ratio for the remaining stages.`,
      analogy: 'Imagine you are on a frozen lake with a pile of bricks and you can only move by throwing bricks in the opposite direction. Each brick you throw accelerates you a little. But here is the catch: every brick you have not thrown yet is dead weight you must also accelerate. The first brick barely moves you because you are carrying all the others. The last brick gives you the biggest push because there is no dead weight left. This is the rocket equation in a nutshell.',
      storyConnection: 'The Pushpaka Vimana carried an entire city’s worth of rooms and gardens. For a rocket, every extra kilogram of payload requires exponentially more fuel. ISRO’s LVM3 rocket weighs 640 tonnes at launch but delivers only 8 tonnes to orbit — a payload fraction of 1.25%. The Vimana’s ornate decoration would be an aerospace engineer’s nightmare.',
      checkQuestion: 'A rocket has exhaust velocity 3,000 m/s and a mass ratio of 10 (90% fuel). What is its Δv?',
      checkAnswer: 'Δv = 3000 × ln(10) = 3000 × 2.303 = 6,908 m/s ≈ 6.9 km/s. This is not enough to reach orbit (7.9 km/s) from a single stage — you would need either higher exhaust velocity, a better mass ratio, or staging.',
      codeIntro: 'Explore the rocket equation and see why staging is essential.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v_e = 3000  # m/s (typical kerosene-LOX engine)

# Single stage: vary mass ratio
mass_ratios = np.linspace(1.1, 20, 200)
delta_v_single = v_e * np.log(mass_ratios)

# Staging: two stages, each with mass ratio R
# Total delta_v = 2 * v_e * ln(R)
R_staged = np.linspace(1.1, 8, 200)
delta_v_staged = 2 * v_e * np.log(R_staged)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Single stage
ax1.plot(mass_ratios, delta_v_single / 1000, linewidth=2.5, color='royalblue', label='Single stage')
ax1.axhline(7.9, color='green', linestyle='--', label='LEO (7.9 km/s)')
ax1.axhline(11.2, color='red', linestyle='--', label='Escape (11.2 km/s)')
ax1.set_xlabel('Mass ratio (m_0/m_f)', fontsize=11)
ax1.set_ylabel('Δv (km/s)', fontsize=11)
ax1.set_title('Single Stage Rocket', fontsize=13)
ax1.legend(fontsize=9); ax1.grid(alpha=0.3)

# Staged vs single
ax2.plot(R_staged, delta_v_staged / 1000, linewidth=2.5, color='orange', label='2-stage (each R)')
ax2.plot(R_staged, v_e * np.log(R_staged) / 1000, linewidth=1.5, color='blue', linestyle='--', label='Single stage (same R)')
ax2.axhline(7.9, color='green', linestyle='--', alpha=0.5)
ax2.axhline(11.2, color='red', linestyle='--', alpha=0.5)
ax2.set_xlabel('Mass ratio per stage', fontsize=11)
ax2.set_ylabel('Δv (km/s)', fontsize=11)
ax2.set_title('Two-Stage vs. Single-Stage', fontsize=13)
ax2.legend(fontsize=9); ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

# Practical example: Saturn V
print("=== Saturn V Moon Rocket ===")
stages = [
    ("Stage 1 (S-IC)", 2290000, 131000, 2580),
    ("Stage 2 (S-II)", 480000, 36000, 4130),
    ("Stage 3 (S-IVB)", 119000, 13000, 4130),
]
total_dv = 0
payload = 45000  # kg to LEO
remaining = sum(s[1] for s in stages) + payload
for name, fuel, dry, ve in stages:
    m0 = remaining
    mf = m0 - fuel
    dv = ve * np.log(m0 / mf)
    total_dv += dv
    remaining = mf
    print(f"  {name}: m0={m0/1000:.0f}t, mf={mf/1000:.0f}t, Δv={dv/1000:.2f} km/s")

print(f"\\nTotal Δv: {total_dv/1000:.2f} km/s")
print(f"Payload to LEO: {payload/1000:.0f} tonnes")
print(f"Total launch mass: {(sum(s[1]+s[2] for s in stages)+payload)/1000:.0f} tonnes")`,
      challenge: 'Add a 4th stage with mass_ratio 3 and v_e = 4500 (hydrogen engine). How much additional Δv does it provide? Is it enough to reach escape velocity?',
      successHint: 'The rocket equation is exponential tyranny. Every extra km/s of Δv requires disproportionately more fuel. Staging is the key engineering trick: by dropping empty tanks, you reset the mass ratio for each subsequent stage.',
    },
    {
      title: 'Orbital mechanics — how to stay up without falling',
      concept: `An orbit is not about altitude — it is about **horizontal speed**. At 7.9 km/s, you are falling toward Earth constantly, but moving sideways so fast that the Earth curves away beneath you at the same rate. You are in perpetual free fall.

The **orbital velocity** at any height h above the surface is:
**v_orbit = √(GM / (R + h))**

At low Earth orbit (400 km), v ≈ 7.7 km/s. The period is about 92 minutes — you see 16 sunrises per day on the ISS.

Higher orbits are slower but have longer periods. At 35,786 km altitude, the orbital period is exactly 24 hours — the satellite stays fixed above one point on Earth. This is a **geostationary orbit**, used by TV and weather satellites.

The code calculates orbital parameters at different altitudes and plots the relationship.`,
      analogy: 'Imagine standing on a tall mountain and throwing a ball horizontally. Throw it gently and it curves down and hits the ground nearby. Throw it harder and it goes further before landing. Throw it at 7.9 km/s and it falls at the same rate the Earth curves — it goes all the way around and comes back to you. That is an orbit. Newton himself proposed this exact thought experiment in 1687.',
      storyConnection: 'The Pushpaka Vimana flew at a speed controlled by thought. Real orbital spacecraft must maintain precise speeds. Too slow and they fall back to Earth. Too fast and they escape to interplanetary space. The ISS orbits at exactly 7.66 km/s — any faster and it would drift away from Earth.',
      checkQuestion: 'At what altitude is the orbital period exactly 12 hours (used by GPS satellites)?',
      checkAnswer: 'Using T = 2π√(r³/GM): r³ = GM × (T/2π)² = 3.986×10¹⁴ × (43200/6.283)² = 3.986×10¹⁴ × 4.726×10⁷ = 1.884×10²². r = 2.66×10⁷ m. Altitude = r - R_earth = 26,600 - 6,371 = 20,229 km. GPS satellites orbit at about 20,200 km altitude.',
      codeIntro: 'Calculate orbital velocity and period at different altitudes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

G = 6.674e-11
M_earth = 5.972e24
R_earth = 6.371e6  # metres

# Altitudes from 200 km to 40,000 km
altitudes = np.linspace(200e3, 40000e3, 500)
r = R_earth + altitudes

# Orbital velocity and period
v_orbit = np.sqrt(G * M_earth / r)
T_orbit = 2 * np.pi * r / v_orbit  # seconds

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(altitudes / 1000, v_orbit / 1000, linewidth=2.5, color='royalblue')
ax1.set_xlabel('Altitude (km)', fontsize=11)
ax1.set_ylabel('Orbital velocity (km/s)', fontsize=11)
ax1.set_title('Orbital Velocity vs. Altitude', fontsize=13)
ax1.grid(alpha=0.3)
# Mark key orbits
for alt, name, color in [(400, 'ISS', 'green'), (20200, 'GPS', 'orange'), (35786, 'GEO', 'red')]:
    v = np.sqrt(G * M_earth / (R_earth + alt * 1000))
    ax1.plot(alt, v / 1000, 'o', color=color, markersize=8)
    ax1.annotate(f'{name}\\n{v/1000:.1f} km/s', xy=(alt, v/1000),
                 xytext=(alt + 2000, v/1000 + 0.3), fontsize=9, color=color)

ax2.plot(altitudes / 1000, T_orbit / 3600, linewidth=2.5, color='orange')
ax2.set_xlabel('Altitude (km)', fontsize=11)
ax2.set_ylabel('Orbital period (hours)', fontsize=11)
ax2.set_title('Orbital Period vs. Altitude', fontsize=13)
ax2.axhline(24, color='red', linestyle='--', alpha=0.5, label='24 hours (geostationary)')
ax2.grid(alpha=0.3); ax2.legend(fontsize=9)
for alt, name, color in [(400, 'ISS: 1.5h', 'green'), (20200, 'GPS: 12h', 'orange'), (35786, 'GEO: 24h', 'red')]:
    T = 2 * np.pi * (R_earth + alt * 1000) / np.sqrt(G * M_earth / (R_earth + alt * 1000))
    ax2.plot(alt, T / 3600, 'o', color=color, markersize=8)

plt.tight_layout()
plt.show()

print("=== Key Orbits ===")
for alt, name in [(400, 'ISS (LEO)'), (20200, 'GPS (MEO)'), (35786, 'Geostationary (GEO)')]:
    r_o = R_earth + alt * 1000
    v = np.sqrt(G * M_earth / r_o)
    T = 2 * np.pi * r_o / v
    print(f"  {name:25s}: alt = {alt:,} km, v = {v/1000:.2f} km/s, T = {T/3600:.1f} hours")`,
      challenge: 'Calculate the orbital altitude needed for a satellite to orbit the Moon (M = 7.34×10²² kg, R = 1.74×10⁶ m) with a period of 2 hours. At what altitude would a lunar geostationary orbit be?',
      successHint: 'Orbital mechanics is the physics that makes space exploration possible. The ISS, GPS, weather satellites, and every interplanetary probe all follow these same equations. Kepler discovered the relationships; Newton explained why they work.',
    },
    {
      title: 'Hohmann transfer — the cheapest way between orbits',
      concept: `Getting from one orbit to another requires changing your velocity. The most fuel-efficient way to move between two circular orbits is a **Hohmann transfer**: an elliptical orbit that just touches both the starting orbit and the destination orbit.

It requires exactly **two burns**:
1. At the starting orbit: fire engines to speed up (enter the transfer ellipse)
2. At the destination orbit: fire again to speed up and circularise

The total Δv is the sum of both burns. The code calculates the Hohmann transfer from LEO to geostationary orbit (the most common commercial transfer).

This is how ISRO sends satellites from their initial parking orbit to their final operational orbit. It takes about 5 hours for the transfer.`,
      analogy: 'Imagine you are running laps on an inner track at a stadium. You want to switch to the outer track. The cheapest way (least energy): sprint briefly to enter a diagonal path that takes you from the inner to the outer track, then sprint again when you arrive to match the outer track’s pace. Two sprints, one transition. That is a Hohmann transfer.',
      storyConnection: 'Rama’s journey from Lanka to Ayodhya was a direct path. In space, you cannot fly directly between orbits — you must follow elliptical transfer paths dictated by gravity. ISRO’s Chandrayaan missions used multiple Hohmann-like transfers to gradually raise their orbit from Earth orbit to the Moon’s orbit.',
      checkQuestion: 'Why is a Hohmann transfer not used for interplanetary missions that need to arrive quickly?',
      checkAnswer: 'A Hohmann transfer takes the longest time of any transfer orbit (it is a half-ellipse). For Mars, it takes about 9 months. Faster trajectories are possible but require more Δv (more fuel). For crewed Mars missions, faster transfers are preferred to reduce radiation exposure, even though they cost more fuel.',
      codeIntro: 'Calculate a Hohmann transfer from LEO to geostationary orbit.',
      code: `import numpy as np
import matplotlib.pyplot as plt

G = 6.674e-11
M = 5.972e24
R = 6.371e6

# Starting orbit: LEO at 400 km
r1 = R + 400e3
v1 = np.sqrt(G * M / r1)

# Destination: GEO at 35,786 km
r2 = R + 35786e3
v2 = np.sqrt(G * M / r2)

# Hohmann transfer ellipse
a_transfer = (r1 + r2) / 2  # semi-major axis
v_transfer_at_r1 = np.sqrt(G * M * (2/r1 - 1/a_transfer))
v_transfer_at_r2 = np.sqrt(G * M * (2/r2 - 1/a_transfer))

# Delta-v for each burn
dv1 = v_transfer_at_r1 - v1  # speed up to enter transfer
dv2 = v2 - v_transfer_at_r2  # speed up to circularise

# Transfer time = half the transfer orbit period
T_transfer = np.pi * np.sqrt(a_transfer**3 / (G * M))

# Plot the orbits
theta = np.linspace(0, 2*np.pi, 300)
x1 = r1 * np.cos(theta) / 1e6
y1 = r1 * np.sin(theta) / 1e6
x2 = r2 * np.cos(theta) / 1e6
y2 = r2 * np.sin(theta) / 1e6

# Transfer ellipse (half)
theta_t = np.linspace(0, np.pi, 150)
r_transfer = a_transfer * (1 - ((r2-r1)/(r2+r1))**2) / (1 - (r2-r1)/(r2+r1) * np.cos(theta_t))
xt = r_transfer * np.cos(theta_t) / 1e6
yt = r_transfer * np.sin(theta_t) / 1e6

plt.figure(figsize=(8, 8))
plt.plot(x1, y1, 'b-', linewidth=1.5, label=f'LEO ({r1/1e6-R/1e6:.0f} km)')
plt.plot(x2, y2, 'r-', linewidth=1.5, label=f'GEO ({r2/1e6-R/1e6:.0f} km)')
plt.plot(xt, yt, 'g--', linewidth=2, label='Transfer orbit')
earth = plt.Circle((0, 0), R/1e6, color='lightblue', label='Earth')
plt.gca().add_patch(earth)

# Burn points
plt.plot(r1/1e6, 0, 'g^', markersize=12, label=f'Burn 1: +{dv1/1000:.2f} km/s')
plt.plot(-r2/1e6, 0, 'rv', markersize=12, label=f'Burn 2: +{dv2/1000:.2f} km/s')

plt.axis('equal'); plt.grid(alpha=0.2)
plt.xlabel('x (Mm)'); plt.ylabel('y (Mm)')
plt.title('Hohmann Transfer: LEO to GEO', fontsize=14)
plt.legend(fontsize=9, loc='upper right')
plt.show()

print("=== Hohmann Transfer: LEO → GEO ===")
print(f"LEO velocity:  {v1/1000:.3f} km/s at {(r1-R)/1000:.0f} km")
print(f"GEO velocity:  {v2/1000:.3f} km/s at {(r2-R)/1000:.0f} km")
print(f"\\nBurn 1 (Δv): +{dv1/1000:.3f} km/s (enter transfer)")
print(f"Burn 2 (Δv): +{dv2/1000:.3f} km/s (circularise)")
print(f"Total Δv:     {(dv1+dv2)/1000:.3f} km/s")
print(f"Transfer time: {T_transfer/3600:.1f} hours")`,
      challenge: 'Calculate a Hohmann transfer from Earth orbit to Mars orbit (r_Mars = 2.279×10¹¹ m, using the Sun’s mass M_sun = 1.989×10³⁰ kg). How long does the transfer take?',
      successHint: 'The Hohmann transfer is the workhorse of space mission design. Every satellite ever placed in geostationary orbit — including India’s GSAT series — used some variant of this technique. It is orbital mechanics at its most elegant.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Intermediate aerodynamics and orbital mechanics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for flight and orbital simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={[VimanaBernoulliDiagram, VimanaLiftDragDiagram, VimanaJetEngineDiagram, VimanaRocketDiagram, BernoulliDiagram, EnergyBarChartDiagram][i] ? createElement([VimanaBernoulliDiagram, VimanaLiftDragDiagram, VimanaJetEngineDiagram, VimanaRocketDiagram, BernoulliDiagram, EnergyBarChartDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
