import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LittleBoatLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Pressure and depth — why submarines must be strong',
      concept: `In Level 1, we learned that buoyancy comes from pressure differences. Now let us examine pressure itself. **Pressure** is force per unit area, measured in Pascals (Pa). At sea level, atmospheric pressure is about 101,325 Pa — that is 10 tonnes pressing on every square metre of your body.

Underwater, pressure increases linearly with depth:

**P = P_atm + ρ × g × h**

Where:
- P_atm = atmospheric pressure (101,325 Pa)
- ρ = water density (1000 kg/m³ for fresh water)
- g = gravitational acceleration (9.8 m/s²)
- h = depth in metres

Every 10 metres of depth adds about 1 atmosphere (100,000 Pa) of pressure. At 100m depth, the pressure is 11 atmospheres — 11 times what you feel at the surface.

This is why:
- Divers cannot go below ~40m without special gas mixtures
- Submarine hulls must be incredibly thick and strong
- Deep-sea creatures have evolved bodies that withstand crushing pressure
- The Brahmaputra's deepest channels (30-40m) would exert 4-5 atmospheres on a sunken boat`,
      analogy: 'Imagine stacking bricks on your hand. One brick is manageable. Ten bricks hurt. A hundred would break bones. Water works the same way — each layer of water above you is like another brick. The deeper you go, the more water-bricks are pressing down on you from every direction.',
      storyConnection: 'When the boy dove under his capsized boat to retrieve supplies, he felt the pressure on his ears at just 3 metres depth. That discomfort is 1.3 atmospheres pressing on his eardrums. Brahmaputra river dolphins dive to 20m routinely — their bodies are adapted to handle the pressure changes that would injure a human.',
      checkQuestion: 'A dam holds back a lake that is 50m deep. Where on the dam wall is the pressure greatest — at the top, middle, or bottom? Why do dams get thicker toward the base?',
      checkAnswer: 'Pressure is greatest at the bottom (P = 101325 + 1000 × 9.8 × 50 ≈ 591,325 Pa or about 5.8 atmospheres). Dams are thicker at the base because they must withstand this greater pressure. The triangular cross-section of a dam is a direct consequence of the linear increase of pressure with depth.',
      codeIntro: 'Visualize how pressure increases with depth and the forces on a submerged structure.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Pressure vs depth
depths = np.linspace(0, 100, 200)  # metres
P_atm = 101325  # Pa
rho = 1000  # kg/m³
g = 9.8  # m/s²

pressure = P_atm + rho * g * depths
pressure_atm = pressure / P_atm  # in atmospheres

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')

# Pressure vs depth
ax1.set_facecolor('#111827')
ax1.plot(pressure_atm, depths, color='#3b82f6', linewidth=2)
ax1.fill_betweenx(depths, 1, pressure_atm, alpha=0.15, color='#3b82f6')
ax1.invert_yaxis()
ax1.set_xlabel('Pressure (atmospheres)', color='white')
ax1.set_ylabel('Depth (m)', color='white')
ax1.set_title('Pressure Increases with Depth', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Mark key depths
markers = [(0, 'Surface'), (10, 'Recreational dive limit'),
           (40, 'Brahmaputra deep channel'), (100, 'Submarine depth')]
for d, label in markers:
    p = (P_atm + rho * g * d) / P_atm
    ax1.plot(p, d, 'o', color='#f59e0b', markersize=8)
    ax1.annotate(f'{label}\
({p:.1f} atm)', xy=(p, d), xytext=(p + 0.5, d + 3),
                color='#f59e0b', fontsize=8, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Force on a dam wall
ax2.set_facecolor('#111827')
dam_depth = 50  # metres
y = np.linspace(0, dam_depth, 100)
force_per_m = rho * g * y  # pressure at each depth (Pa = N/m²)

ax2.fill_betweenx(y, 0, force_per_m / 1000, color='#3b82f6', alpha=0.3)
ax2.plot(force_per_m / 1000, y, color='#3b82f6', linewidth=2)
ax2.invert_yaxis()
ax2.set_xlabel('Pressure on dam wall (kPa)', color='white')
ax2.set_ylabel('Depth (m)', color='white')
ax2.set_title('Pressure Distribution on a 50m Dam', color='white', fontsize=13)
ax2.tick_params(colors='gray')

# Total force on 1m-wide strip
total_force = 0.5 * rho * g * dam_depth**2  # N per metre width
ax2.annotate(f'Total force per metre width:\
{total_force/1000:.0f} kN/m\
({total_force/1e6:.1f} MN/m)',
            xy=(300, 35), color='#f59e0b', fontsize=10,
            bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#f59e0b'))

plt.tight_layout()
plt.show()

print("Pressure at key depths (fresh water):")
for d in [0, 10, 20, 40, 100]:
    p = P_atm + rho * g * d
    print(f"  {d:3d}m: {p/P_atm:.1f} atm ({p/1000:.0f} kPa)")
print()
print(f"Total force on 50m dam (per metre width): {total_force/1e6:.1f} MN")
print("That's roughly the weight of 1,250 cars per metre of dam width.")`,
      challenge: 'The Mariana Trench is 11,000m deep. Calculate the pressure there. How thick would a steel sphere need to be to survive it? (Steel yields at ~250 MPa)',
      successHint: 'Pressure and depth are linked by one of the simplest equations in physics. Yet this equation governs the design of every dam, submarine, diving suit, and underwater pipeline in the world.',
    },
    {
      title: "Bernoulli's principle — faster flow means lower pressure",
      concept: `Daniel Bernoulli discovered something counterintuitive in 1738: **when a fluid speeds up, its pressure drops**. This is Bernoulli's principle, and it explains how airplane wings generate lift, how carburettors work, and why a shower curtain blows inward.

The equation (for incompressible, inviscid flow along a streamline):

**P + ½ρv² + ρgh = constant**

This says that pressure energy + kinetic energy + potential energy stays the same along a flow path. If velocity (v) increases, pressure (P) must decrease to keep the sum constant.

Applications in boat design:
- **Sail shape**: wind flows faster over the curved outside of a sail than the flat inside, creating a pressure difference that pushes the boat forward
- **Hull speed**: water flowing faster under a boat creates lower pressure, which can cause the bow to dip
- **Venturi effect**: water flowing through a narrow channel speeds up and drops in pressure — this is why water rushes dangerously fast through narrow gorges

The Brahmaputra narrows at several points, and at each narrows, the current accelerates and the water level actually drops slightly — Bernoulli in action.`,
      analogy: 'Imagine a crowd of people walking through a hallway. When the hallway narrows, everyone must walk faster to maintain the same flow rate. In that narrow section, they are spread thinner (lower "people pressure") but moving faster. Bernoulli says the same thing about fluid molecules.',
      storyConnection: 'The boy noticed that where the Brahmaputra narrowed between rocky bluffs, the current became dangerously fast. He knew to avoid these narrows. What he was observing was Bernoulli\'s principle: the same volume of water had to squeeze through a smaller cross-section, so it sped up dramatically.',
      checkQuestion: 'When you blow air between two sheets of paper held vertically, they move toward each other rather than apart. Why?',
      checkAnswer: 'The moving air between the papers has higher velocity and therefore lower pressure (Bernoulli). The still air on the outside of each paper has normal atmospheric pressure. The higher outside pressure pushes the papers together. This is the same principle that gives airplane wings lift.',
      codeIntro: 'Visualize Bernoulli\'s principle in a narrowing channel (Venturi effect).',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Venturi tube simulation
# Channel narrows from wide to narrow to wide
x = np.linspace(0, 10, 500)

# Channel shape (half-width)
channel_width = 1.0 - 0.5 * np.exp(-((x - 5)**2) / 2)

# Flow velocity (continuity: A1*v1 = A2*v2)
v_inlet = 2.0  # m/s
width_inlet = channel_width[0]
velocity = v_inlet * width_inlet / channel_width

# Pressure (Bernoulli: P + 0.5*rho*v^2 = constant)
rho = 1000
P_inlet = 101325  # Pa
pressure = P_inlet + 0.5 * rho * v_inlet**2 - 0.5 * rho * velocity**2

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Channel shape with velocity arrows
ax1.set_facecolor('#111827')
ax1.fill_between(x, -channel_width, channel_width, color='#1e40af', alpha=0.2)
ax1.plot(x, channel_width, color='#92400e', linewidth=2)
ax1.plot(x, -channel_width, color='#92400e', linewidth=2)

# Velocity arrows (spacing indicates speed)
for xi in np.arange(0.5, 10, 0.5):
    idx = np.argmin(np.abs(x - xi))
    v = velocity[idx]
    w = channel_width[idx]
    arrow_len = v / 10
    for y_pos in np.linspace(-w * 0.6, w * 0.6, 3):
        ax1.annotate('', xy=(xi + arrow_len, y_pos), xytext=(xi, y_pos),
                    arrowprops=dict(arrowstyle='->', color='#60a5fa', lw=1))

ax1.set_ylabel('Width (m)', color='white')
ax1.set_title('Venturi Effect: Channel Shape & Flow', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Velocity profile
ax2.set_facecolor('#111827')
ax2.plot(x, velocity, color='#22c55e', linewidth=2)
ax2.fill_between(x, velocity, alpha=0.15, color='#22c55e')
ax2.set_ylabel('Velocity (m/s)', color='white')
ax2.set_title('Flow Velocity (faster in narrow section)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Pressure profile
ax3.set_facecolor('#111827')
ax3.plot(x, pressure / 1000, color='#ef4444', linewidth=2)
ax3.fill_between(x, pressure / 1000, alpha=0.15, color='#ef4444')
ax3.set_ylabel('Pressure (kPa)', color='white')
ax3.set_xlabel('Position along channel (m)', color='white')
ax3.set_title('Pressure (drops where velocity increases)', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# Annotate the key point
idx_narrow = np.argmin(channel_width)
ax2.annotate(f'Max velocity: {velocity[idx_narrow]:.1f} m/s',
            xy=(x[idx_narrow], velocity[idx_narrow]),
            xytext=(x[idx_narrow] + 1, velocity[idx_narrow] - 0.5),
            color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax3.annotate(f'Min pressure: {pressure[idx_narrow]/1000:.1f} kPa',
            xy=(x[idx_narrow], pressure[idx_narrow]/1000),
            xytext=(x[idx_narrow] + 1, pressure[idx_narrow]/1000 + 0.5),
            color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Bernoulli's principle: P + ½ρv² = constant")
print(f"  Inlet: v = {v_inlet:.1f} m/s, P = {P_inlet/1000:.1f} kPa")
print(f"  Narrow: v = {velocity[idx_narrow]:.1f} m/s, P = {pressure[idx_narrow]/1000:.1f} kPa")
print(f"  Pressure drop: {(P_inlet - pressure[idx_narrow])/1000:.1f} kPa")
print()
print("This is why river gorges are dangerous:")
print("  Narrow channel → fast current → low pressure → suction effects")`,
      challenge: 'An airplane wing has air flowing at 80 m/s over the top and 70 m/s under the bottom. Calculate the pressure difference and the lift force on a wing of area 30 m² (use air density 1.225 kg/m³).',
      successHint: 'Bernoulli\'s principle connects fluid velocity and pressure in a single elegant equation. It is the foundation of aerodynamics, hydraulic engineering, and explains countless everyday phenomena.',
    },
    {
      title: 'Streamlining — reducing drag through shape',
      concept: `When a boat moves through water, it fights **drag** — the resistance force opposing its motion. Drag wastes energy. Reducing drag means going faster with less fuel (or less paddling).

There are two main types of drag:
- **Form drag** (pressure drag): caused by the shape pushing water aside. A flat plate has high form drag; a teardrop shape has very low form drag.
- **Skin friction drag**: caused by water rubbing against the hull surface. Depends on surface roughness and wetted area.

**Streamlining** is the art of shaping a body to minimize total drag. The ideal streamlined shape is a **teardrop**: rounded at the front, tapering gradually to a point at the rear.

Why a teardrop? The rounded front lets water flow smoothly around the object. The gradual taper at the rear prevents **flow separation** — when water cannot follow the surface and breaks away into turbulent eddies. These eddies create a low-pressure zone behind the object that literally sucks it backward.

The **drag coefficient** (Cd) quantifies how streamlined a shape is:
- Flat plate: Cd ≈ 1.28
- Sphere: Cd ≈ 0.47
- Cylinder: Cd ≈ 1.2
- Teardrop: Cd ≈ 0.04
- Modern car: Cd ≈ 0.25-0.35`,
      analogy: 'Imagine running through a crowded market. If you run sideways (flat plate), you bump into everyone. If you lead with your shoulder and taper your body (teardrop), people flow around you. A streamlined shape is the social equivalent of being polite — you slip through the crowd with minimum disruption.',
      storyConnection: 'The boy noticed that logs floating in the Brahmaputra with pointed ends drifted faster than square-cut logs. Traditional Assamese boats have pointed bows for the same reason — they learned streamlining from centuries of observation, encoding fluid dynamics into boat-building tradition.',
      checkQuestion: 'A golf ball has dimples on its surface. Dimples increase surface roughness, which should increase friction drag. Yet a dimpled golf ball flies farther than a smooth one. Why?',
      checkAnswer: 'Dimples trigger early turbulence in the boundary layer, which helps the flow stay attached to the ball longer. This delays flow separation, dramatically reducing form drag (which is much larger than friction drag for a ball). The small increase in friction drag is overwhelmed by the large decrease in form drag. Net result: less total drag.',
      codeIntro: 'Compare drag coefficients and power requirements for different hull shapes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Drag comparison for different shapes
shapes = ['Flat plate', 'Cylinder', 'Sphere', 'Half-sphere\
(bow)', 'Streamlined\
hull', 'Teardrop']
cd_values = [1.28, 1.20, 0.47, 0.42, 0.15, 0.04]
colors_list = ['#ef4444', '#ef4444', '#f59e0b', '#f59e0b', '#22c55e', '#22c55e']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Cd comparison
ax1.set_facecolor('#111827')
bars = ax1.bar(shapes, cd_values, color=colors_list, edgecolor='none')
ax1.set_ylabel('Drag coefficient (Cd)', color='white')
ax1.set_title('Drag Coefficients by Shape', color='white', fontsize=13)
ax1.tick_params(colors='gray')
for bar, cd in zip(bars, cd_values):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
             f'{cd}', ha='center', color='white', fontsize=10)

# Power required vs speed for different hulls
ax2.set_facecolor('#111827')
speeds = np.linspace(0, 8, 100)  # m/s
rho = 1000
A = 0.5  # cross-sectional area (m²)

hull_types = {
    'Traditional flat': {'Cd': 0.8, 'color': '#ef4444'},
    'Round bottom': {'Cd': 0.4, 'color': '#f59e0b'},
    'Streamlined': {'Cd': 0.15, 'color': '#22c55e'},
}

for name, params in hull_types.items():
    drag = 0.5 * params['Cd'] * rho * A * speeds**2
    power = drag * speeds / 1000  # kW
    ax2.plot(speeds, power, color=params['color'], linewidth=2, label=f"{name} (Cd={params['Cd']})")

ax2.set_xlabel('Speed (m/s)', color='white')
ax2.set_ylabel('Power required (kW)', color='white')
ax2.set_title('Power to Overcome Drag', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 50)

plt.tight_layout()
plt.show()

print("Streamlining impact:")
for name, params in hull_types.items():
    speed = 5  # m/s
    drag = 0.5 * params['Cd'] * rho * A * speed**2
    power = drag * speed
    print(f"  {name} at {speed} m/s: {drag:.0f}N drag, {power/1000:.1f}kW power")

print()
ratio = 0.8 / 0.15
print(f"Streamlining saves {(1 - 1/ratio)*100:.0f}% of the power!")
print("That's the difference between arriving exhausted and arriving fresh.")`,
      challenge: 'Calculate the drag force on a submarine (Cd=0.1, frontal area=30m², speed=10m/s). Then calculate the power needed. How does this compare to a typical car engine?',
      successHint: 'Streamlining is one of the most impactful engineering techniques. A 50% reduction in Cd means a 50% reduction in drag force and a 50% reduction in fuel consumption at any given speed. Every modern vehicle is shaped by computational fluid dynamics.',
    },
    {
      title: 'Stability in rough water — how boats survive waves',
      concept: `In Level 1, we covered static stability — will a boat right itself when tilted? Now we tackle **dynamic stability** — how a boat behaves in real waves, which tilt it repeatedly and sometimes violently.

Key concepts:
- **Roll**: rotation around the long axis (side to side). The most dangerous motion.
- **Pitch**: rotation around the width axis (bow up, stern down). Uncomfortable but rarely capsizing.
- **Yaw**: rotation around the vertical axis (turning left/right). Controlled by the rudder.

A boat's **natural roll period** depends on its metacentric height (GM):

**T_roll ≈ 0.8 × B / √GM**

Where B is the beam (width) and GM is metacentric height. A stiff boat (high GM) rolls quickly — snappy and uncomfortable. A tender boat (low GM) rolls slowly — comfortable but dangerously close to capsizing.

**Resonance** is the greatest danger. If waves hit the boat at its natural roll frequency, each wave adds energy to the roll, building up amplitude until the boat capsizes. This is why experienced sailors change course or speed to avoid rolling in sync with the waves.`,
      analogy: 'Push a child on a swing. If you push at the natural frequency, the swing goes higher and higher (resonance). Push at the wrong time and the swing dampens. A boat in waves is exactly like a swing — if the wave frequency matches the boat\'s natural roll frequency, disaster follows.',
      storyConnection: 'The Brahmaputra during monsoon produces steep, short-period waves from the fierce current. The boy had to angle his boat to take waves at 45 degrees rather than beam-on (sideways), instinctively avoiding the resonance condition that would have rolled his small boat over.',
      checkQuestion: 'Why do large ships sometimes capsize in storms while smaller fishing boats survive? Should bigger always mean safer?',
      checkAnswer: 'Large ships can encounter waves whose period matches their natural roll period, causing resonance. Their enormous momentum means once a roll builds, it is hard to stop. Smaller boats often have shorter roll periods that do not match ocean wave periods. Also, fishing boats can ride over waves that break against the side of a large ship. Size helps in moderate seas but can be a liability in extreme conditions if the wave period is wrong.',
      codeIntro: 'Simulate a boat rolling in waves and show how resonance builds dangerous motion.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Roll dynamics simulation
# Simplified: d²θ/dt² + 2ζω₀(dθ/dt) + ω₀²θ = F_wave(t)

dt = 0.01
t = np.arange(0, 60, dt)

# Boat parameters
GM = 0.5  # metacentric height (m)
beam = 3.0  # boat width (m)
T_natural = 0.8 * beam / np.sqrt(GM)  # natural roll period
omega_0 = 2 * np.pi / T_natural  # natural frequency
zeta = 0.1  # damping ratio (small = low damping)

# Three wave scenarios
fig, axes = plt.subplots(3, 1, figsize=(12, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

scenarios = [
    ('Waves far from resonance', T_natural * 2.5),
    ('Waves near resonance (DANGER)', T_natural * 1.0),
    ('Waves slightly off resonance', T_natural * 0.7),
]

for ax, (title, T_wave) in zip(axes, scenarios):
    ax.set_facecolor('#111827')
    omega_wave = 2 * np.pi / T_wave
    wave_amplitude = 0.3  # rad (about 17 degrees)

    # Numerical integration (Euler method)
    theta = np.zeros_like(t)
    theta_dot = np.zeros_like(t)

    for i in range(1, len(t)):
        force = wave_amplitude * omega_0**2 * np.sin(omega_wave * t[i])
        theta_ddot = force - 2 * zeta * omega_0 * theta_dot[i-1] - omega_0**2 * theta[i-1]
        theta_dot[i] = theta_dot[i-1] + theta_ddot * dt
        theta[i] = theta[i-1] + theta_dot[i] * dt

    angle_deg = np.degrees(theta)
    max_roll = np.max(np.abs(angle_deg))
    color = '#ef4444' if max_roll > 30 else ('#f59e0b' if max_roll > 15 else '#22c55e')

    ax.plot(t, angle_deg, color=color, linewidth=1)
    ax.axhline(30, color='#ef4444', linestyle='--', linewidth=0.5, alpha=0.5)
    ax.axhline(-30, color='#ef4444', linestyle='--', linewidth=0.5, alpha=0.5)
    ax.set_ylabel('Roll (°)', color='white')
    ax.set_title(f'{title} (T_wave={T_wave:.1f}s, max roll={max_roll:.0f}°)',
                color='white', fontsize=11)
    ax.tick_params(colors='gray')
    ax.set_ylim(-50, 50)

    if max_roll > 30:
        ax.text(30, 40, 'CAPSIZE RISK', color='#ef4444', fontsize=12, fontweight='bold', ha='center')

axes[-1].set_xlabel('Time (seconds)', color='white')
plt.tight_layout()
plt.show()

print(f"Boat: beam={beam}m, GM={GM}m")
print(f"Natural roll period: {T_natural:.1f} seconds")
print(f"Natural frequency: {omega_0:.2f} rad/s")
print()
print("Key finding: when wave period matches the natural roll period,")
print("the roll amplitude builds up to dangerous levels (resonance).")
print("Even small waves can capsize a boat if the timing is wrong.")`,
      challenge: 'Increase the damping ratio from 0.1 to 0.4 (simulating adding bilge keels — flat plates on the hull bottom). How does this change the resonance response? Why do all large ships have bilge keels?',
      successHint: 'Understanding resonance and roll dynamics is critical for ship safety. Every vessel is tested for its roll characteristics, and cargo loading must be planned to achieve the right GM — too stiff is uncomfortable, too tender is dangerous.',
    },
    {
      title: 'Propulsion — how boats move through water',
      concept: `Moving a boat requires overcoming drag. The propulsion system must generate a **thrust force** equal to drag force to maintain constant speed, and greater than drag to accelerate.

Methods of propulsion:
- **Paddles/oars**: human-powered, convert muscle energy to thrust. Efficiency ~60-70%. Used on the Brahmaputra for millennia.
- **Sails**: convert wind energy to thrust. Free energy but depends on weather. Efficiency varies wildly with wind angle.
- **Propellers**: convert rotational energy (from engine) to thrust. Marine propeller efficiency is typically 50-70%.
- **Water jets**: pump water backward at high speed. Good at high speeds and shallow water.

**Newton's Third Law** drives all propulsion: push water backward → boat moves forward. The thrust equals the rate of momentum given to the water:

**F_thrust = ṁ × (v_exit - v_inlet)**

Where ṁ is mass flow rate and v is velocity. A propeller works by accelerating a large mass of water by a small amount. A jet works by accelerating a small mass of water by a large amount. The propeller is more efficient because kinetic energy wasted in the wake scales with v² — so moving lots of water slowly wastes less energy than moving a little water fast.`,
      analogy: 'Propulsion is like walking on ice. You push backward with your foot (giving the ice momentum). Newton\'s Third Law pushes you forward. A big, slow push (like spreading your weight on snowshoes) is more efficient than a small, fast kick (like wearing stilettos). Propellers are snowshoes; jets are stilettos.',
      storyConnection: 'The boy used a bamboo pole in shallow sections and switched to a paddle in deep water. The pole pushes against the riverbed (solid reaction force), which is more efficient than pushing against water (fluid reaction force, some water just moves aside). River boatmen instinctively choose the most efficient propulsion method for each section.',
      checkQuestion: 'Why do ships use propellers with 3-7 blades instead of just 1 or 2? More blades means more drag on the propeller itself.',
      checkAnswer: 'A single blade creates pulsating thrust (strong push, then nothing, then strong push). This causes vibration and stress. Multiple blades spread the thrust evenly around the rotation, creating smooth, continuous force. The vibration reduction and structural benefits far outweigh the small increase in drag. Also, each blade operates in "clean" water if properly spaced, rather than in the turbulent wake of the previous blade.',
      codeIntro: 'Compare propulsion efficiency for different methods and simulate thrust vs. speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Propulsion comparison
speeds = np.linspace(0.1, 10, 100)  # m/s
rho = 1000  # kg/m³

# Drag force (same boat)
Cd = 0.3
A = 0.8  # frontal area
drag = 0.5 * Cd * rho * A * speeds**2

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Power required vs available for different propulsion
ax1.set_facecolor('#111827')
power_drag = drag * speeds / 1000  # kW needed

# Propulsion methods
methods = {
    'Paddle (human)': {'max_power': 0.1, 'efficiency': 0.65, 'color': '#f59e0b'},
    'Sail (moderate wind)': {'max_power': 2.0, 'efficiency': 0.35, 'color': '#3b82f6'},
    'Outboard motor (10HP)': {'max_power': 7.5, 'efficiency': 0.55, 'color': '#22c55e'},
    'Diesel + propeller': {'max_power': 50.0, 'efficiency': 0.65, 'color': '#a855f7'},
}

ax1.plot(speeds, power_drag, color='#ef4444', linewidth=2, linestyle='--', label='Drag power')

for name, params in methods.items():
    available = params['max_power'] * params['efficiency']
    ax1.axhline(available, color=params['color'], linewidth=1.5, linestyle='-', alpha=0.7)
    # Max speed is where available power = drag power
    mask = power_drag <= available
    if np.any(mask):
        max_v = speeds[mask][-1]
        ax1.plot(max_v, available, 'o', color=params['color'], markersize=8)
        ax1.annotate(f'{name}\
max {max_v:.1f} m/s', xy=(max_v, available),
                    xytext=(max_v - 2, available + 3), color=params['color'], fontsize=8,
                    arrowprops=dict(arrowstyle='->', color=params['color']))

ax1.set_xlabel('Speed (m/s)', color='white')
ax1.set_ylabel('Power (kW)', color='white')
ax1.set_title('Power Required vs Available', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 40)

# Propeller efficiency vs advance ratio
ax2.set_facecolor('#111827')

# Typical propeller efficiency curve
J = np.linspace(0, 1.5, 100)  # advance ratio (v / nD)

# Different propeller designs
props = {
    '2-blade': {'eta_max': 0.60, 'J_opt': 0.75, 'color': '#f59e0b'},
    '4-blade': {'eta_max': 0.65, 'J_opt': 0.65, 'color': '#22c55e'},
    '6-blade': {'eta_max': 0.62, 'J_opt': 0.55, 'color': '#3b82f6'},
}

for name, params in props.items():
    J_opt = params['J_opt']
    eta_max = params['eta_max']
    sigma = 0.4
    eta = eta_max * np.exp(-((J - J_opt)**2) / (2 * sigma**2))
    eta = np.where(J > 0, eta, 0)
    ax2.plot(J, eta * 100, color=params['color'], linewidth=2, label=name)

ax2.set_xlabel('Advance ratio J (v / nD)', color='white')
ax2.set_ylabel('Efficiency (%)', color='white')
ax2.set_title('Propeller Efficiency vs Operating Point', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Maximum speeds for each propulsion method:")
for name, params in methods.items():
    available = params['max_power'] * params['efficiency']
    mask = power_drag <= available
    max_v = speeds[mask][-1] if np.any(mask) else 0
    print(f"  {name}: {max_v:.1f} m/s ({max_v*1.944:.1f} knots)")

print()
print("Key insight: power needed scales with v³ (drag × speed)")
print("Doubling speed requires 8× the power!")
print("This is why cargo ships move slowly — speed is expensive.")`,
      challenge: 'A human can sustain about 75W of useful power while paddling. At what speed does drag power equal 75W × 0.65 efficiency? This is the maximum sustained paddling speed. How long would it take to cross the 1km-wide Brahmaputra?',
      successHint: 'Propulsion efficiency determines how far you can go on a given amount of energy — whether that energy comes from rice and dal (human paddling) or diesel fuel. Every transport engineer optimizes this trade-off.',
    },
    {
      title: 'Designing for floods — engineering against nature',
      concept: `The Brahmaputra floods every monsoon season. The river can rise 5-10 metres, spread kilometres wider, and carry debris at devastating speeds. Designing boats, bridges, and buildings for flood conditions is one of the greatest engineering challenges in Assam.

Flood forces on structures:
- **Hydrostatic force**: pressure from still or slow water. Scales with depth squared.
- **Hydrodynamic force**: moving water impact. F = ½ × Cd × ρ × A × v². A 3 m/s current exerts ~4,500 N/m² on a wall.
- **Debris impact**: logs, vehicles, even buildings carried by floodwater. A 500 kg log at 3 m/s has momentum of 1,500 kg·m/s.
- **Erosion**: flowing water undermines foundations, scours riverbanks, and changes the river's course entirely.

Flood-resistant design principles:
1. **Elevate**: build on stilts (chang ghar — traditional Assamese raised houses)
2. **Streamline**: round pillars resist floods better than square ones
3. **Breakaway**: design non-critical parts to break away and reduce load
4. **Anchor**: deep foundations that resist scour
5. **Float**: some structures are designed to rise with floodwater (floating houses)`,
      analogy: 'Designing for floods is like designing a car for crashes. You cannot prevent the event, so you design for survival. Crumple zones absorb impact (breakaway walls), the rigid cabin protects occupants (reinforced core), and airbags cushion the blow (flood barriers). The best flood design expects failure and plans for it.',
      storyConnection: 'The boy\'s village was built on stilts — traditional chang ghars that had survived centuries of Brahmaputra floods. His boat was designed to be dragged onto high ground quickly. Nothing in the village was irreplaceable at ground level. This is engineering wisdom passed down through generations — flood-resilient design encoded in culture.',
      checkQuestion: 'The Brahmaputra floods annually, yet people continue to live along its banks. Is this irrational? What does engineering say?',
      checkAnswer: 'It is rational because the floodplain soil is extremely fertile (floods deposit nutrient-rich silt), the river provides fish and transport, and the land is flat and buildable. The key is not avoiding floods but designing for them — raised buildings, flood-resistant agriculture (floating gardens), and early warning systems. The engineering challenge is coexistence, not avoidance.',
      codeIntro: 'Calculate flood forces on structures and compare traditional vs. modern design.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Flood force calculations
flood_depths = np.linspace(0, 10, 100)  # metres
current_speeds = np.linspace(0, 5, 100)  # m/s
rho = 1000  # kg/m³
g = 9.8

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Hydrostatic force on a wall (per metre width)
ax1.set_facecolor('#111827')
F_static = 0.5 * rho * g * flood_depths**2 / 1000  # kN per metre width
ax1.plot(flood_depths, F_static, color='#3b82f6', linewidth=2)
ax1.fill_between(flood_depths, F_static, alpha=0.15, color='#3b82f6')
ax1.set_xlabel('Flood depth (m)', color='white')
ax1.set_ylabel('Force per metre width (kN/m)', color='white')
ax1.set_title('Hydrostatic Force on a Wall', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Mark typical flood depths
for d, label in [(3, 'Minor flood'), (6, 'Major flood'), (9, 'Catastrophic')]:
    f = 0.5 * rho * g * d**2 / 1000
    color = '#22c55e' if d <= 3 else ('#f59e0b' if d <= 6 else '#ef4444')
    ax1.plot(d, f, 'o', color=color, markersize=8)
    ax1.annotate(f'{label}\
{f:.0f} kN/m', xy=(d, f), xytext=(d + 0.5, f + 20),
                color=color, fontsize=8, arrowprops=dict(arrowstyle='->', color=color))

# 2. Hydrodynamic force vs current speed
ax2.set_facecolor('#111827')
pillar_shapes = {
    'Square pillar': {'Cd': 2.0, 'color': '#ef4444'},
    'Round pillar': {'Cd': 1.0, 'color': '#f59e0b'},
    'Streamlined': {'Cd': 0.3, 'color': '#22c55e'},
}
A = 2.0  # submerged area (m²)

for name, params in pillar_shapes.items():
    F_dyn = 0.5 * params['Cd'] * rho * A * current_speeds**2 / 1000
    ax2.plot(current_speeds, F_dyn, color=params['color'], linewidth=2, label=name)

ax2.set_xlabel('Current speed (m/s)', color='white')
ax2.set_ylabel('Force (kN)', color='white')
ax2.set_title('Hydrodynamic Force on Bridge Pillars', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# 3. Traditional vs modern flood-resistant design
ax3.set_facecolor('#111827')
years = np.arange(2000, 2025)
np.random.seed(42)

# Flood damage (arbitrary units, annual)
flood_severity = np.random.exponential(1.5, len(years))
flood_severity[7] = 8  # 2007 major flood
flood_severity[12] = 7  # 2012 major flood
flood_severity[22] = 9  # 2022 major flood

# Damage for different building types
traditional_damage = flood_severity * 0.3  # chang ghar (stilts) — low damage
modern_ground = flood_severity * 1.5  # concrete on ground — high damage
modern_elevated = flood_severity * 0.2  # modern elevated — lowest damage

ax3.bar(years - 0.25, modern_ground, 0.25, color='#ef4444', alpha=0.8, label='Ground-level concrete')
ax3.bar(years, traditional_damage, 0.25, color='#f59e0b', alpha=0.8, label='Traditional chang ghar')
ax3.bar(years + 0.25, modern_elevated, 0.25, color='#22c55e', alpha=0.8, label='Modern elevated')
ax3.set_xlabel('Year', color='white')
ax3.set_ylabel('Flood damage (relative)', color='white')
ax3.set_title('Flood Damage by Building Type', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# 4. Scour depth estimation
ax4.set_facecolor('#111827')
pillar_diameter = np.linspace(0.5, 5, 100)  # metres
flow_speed = 3.0  # m/s

# Simplified scour depth: ds = 2.0 * D^0.65 * v^0.43
scour_depth = 2.0 * pillar_diameter**0.65 * flow_speed**0.43

ax4.plot(pillar_diameter, scour_depth, color='#a855f7', linewidth=2)
ax4.fill_between(pillar_diameter, scour_depth, alpha=0.15, color='#a855f7')
ax4.set_xlabel('Pillar diameter (m)', color='white')
ax4.set_ylabel('Scour depth (m)', color='white')
ax4.set_title(f'Foundation Scour Depth (v={flow_speed} m/s)', color='white', fontsize=12)
ax4.tick_params(colors='gray')
ax4.annotate('Foundation must be\
deeper than this!', xy=(3, 2.0 * 3**0.65 * 3**0.43),
            xytext=(1, 7), color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Flood engineering summary:")
print(f"  5m flood, still water: {0.5*rho*g*25/1000:.0f} kN/m on walls")
print(f"  3 m/s current on round pillar: {0.5*1.0*rho*2.0*9/1000:.1f} kN")
print(f"  3 m/s current on square pillar: {0.5*2.0*rho*2.0*9/1000:.1f} kN")
print()
print("Traditional Assamese wisdom:")
print("  Chang ghar (stilts) > ground-level concrete in every flood metric")
print("  Modern engineering agrees: ELEVATE, don't resist.")`,
      challenge: 'A debris log (500kg) hits a bridge pillar at 4 m/s and stops in 0.1 seconds. Calculate the impact force (F = m × Δv / Δt). Compare this to the steady-state hydrodynamic force. Which is more dangerous?',
      successHint: 'You have completed the full journey from basic buoyancy to flood engineering. The boy\'s little boat on the Brahmaputra was a starting point for understanding forces, fluid dynamics, and the engineering that keeps millions of people safe during monsoon season.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Naval Engineering — builds on Level 1 fluid dynamics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for engineering simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
