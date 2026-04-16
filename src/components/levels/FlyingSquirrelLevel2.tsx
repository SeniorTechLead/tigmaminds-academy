import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FlyingSquirrelLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Glide path calculations — ballistics meets aerodynamics',
      concept: `A gliding trajectory is a balance between gravity (pulling down) and aerodynamic forces (lift up, drag back). The equations of motion:

**Horizontal**: m(dvx/dt) = -D cos(γ) - L sin(γ)
**Vertical**: m(dvy/dt) = -D sin(γ) + L cos(γ) - mg

where γ is the flight path angle, D is drag, L is lift, m is mass, g is gravity.

For a steady-state glide (constant speed, constant angle):
- **Glide angle**: tan(γ) = D/L = 1/(L/D)
- **Glide speed**: V = √(2mg cos(γ) / (ρACₗ))
- **Sink rate**: V_sink = V × sin(γ)
- **Range from height h**: R = h × (L/D) × cos(γ)

The optimal glide speed minimizes the sink rate (for maximum time aloft) or maximizes L/D (for maximum range). These are different speeds — maximum range speed is about 30% faster than minimum sink speed.`,
      analogy: 'Glide path calculations are like route planning with a limited fuel tank. The "fuel" is altitude. The L/D ratio is fuel efficiency. The best range speed gets you the farthest before running out of altitude. The minimum sink speed keeps you airborne the longest (useful for waiting for a thermal or updraft). Same physics, different objectives.',
      storyConnection: 'The flying squirrel instinctively knows its own "glide equations" — it chooses the right launch speed, angle, and body posture for each specific gap in the forest. A 20m gap requires different parameters than a 50m gap. The squirrel computes these in real-time using its vestibular system and visual feedback.',
      checkQuestion: 'A hang glider with L/D=15 launches from a 500m cliff. How far can it glide in still air? If there\'s a 5 m/s headwind, how does this change?',
      checkAnswer: 'Still air range: R = 500 × 15 = 7,500m (7.5 km). With headwind, the ground speed decreases but the glide ratio in air doesn\'t change. If glide speed is ~45 km/h and headwind is 18 km/h, ground speed is 27 km/h. The time aloft stays the same, but the ground distance drops by 27/45 = 60%, so range ≈ 4,500m. Headwinds significantly reduce glide range.',
      codeIntro: 'Numerically simulate the complete glide trajectory with full physics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def simulate_glide(mass, wing_area, CD0, AR, e, v0, launch_height, alpha_schedule=None):
    dt = 0.005
    rho = 1.225
    g = 9.81
    x, y = 0, launch_height
    vx, vy = v0, 0
    traj_x, traj_y, traj_v, traj_t = [x], [y], [v0], [0]
    t = 0
    while y > 0 and x < 500 and t < 30:
        v = np.sqrt(vx**2 + vy**2)
        if v < 0.5: break
        gamma = np.arctan2(-vy, vx)
        if alpha_schedule:
            alpha = alpha_schedule(x, y, t)
        else:
            alpha = 8  # default
        alpha_rad = np.radians(alpha)
        CL = min(2 * np.pi * alpha_rad * 0.6, 1.8)
        if alpha > 18: CL *= np.exp(-(alpha - 18) / 5)
        CD = CD0 + CL**2 / (np.pi * AR * e)
        q = 0.5 * rho * v**2 * wing_area
        L, D = q * CL, q * CD
        ax = (-D * np.cos(gamma) - L * np.sin(gamma)) / mass
        ay = (-D * np.sin(gamma) + L * np.cos(gamma) - g * mass) / mass
        vx += ax * dt; vy += ay * dt
        x += vx * dt; y += vy * dt
        t += dt
        traj_x.append(x); traj_y.append(y)
        traj_v.append(v); traj_t.append(t)
    return np.array(traj_x), np.array(traj_y), np.array(traj_v), np.array(traj_t)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Compare different initial speeds
ax1.set_facecolor('#111827')
speeds = [5, 8, 11, 15]
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

for v0, color in zip(speeds, colors):
    x, y, v, t = simulate_glide(0.15, 0.04, 0.05, 1.5, 0.7, v0, 20)
    mask = y >= 0
    ax1.plot(x[mask], y[mask], color=color, linewidth=2, label=f'v₀={v0} m/s, range={x[mask][-1]:.0f}m')

ax1.set_xlabel('Horizontal distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Glide Trajectories at Different Launch Speeds', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(-1, 22)

# Optimal speed analysis
ax2.set_facecolor('#111827')
v0_range = np.linspace(3, 20, 50)
ranges = []
flight_times = []
for v0 in v0_range:
    x, y, v, t = simulate_glide(0.15, 0.04, 0.05, 1.5, 0.7, v0, 20)
    mask = y >= 0
    ranges.append(x[mask][-1])
    flight_times.append(t[mask][-1])

ax2.plot(v0_range, ranges, color='#22c55e', linewidth=2.5, label='Range (m)')
ax2_t = ax2.twinx()
ax2_t.plot(v0_range, flight_times, color='#3b82f6', linewidth=2.5, linestyle='--', label='Time aloft (s)')

best_range_idx = np.argmax(ranges)
best_time_idx = np.argmax(flight_times)
ax2.plot(v0_range[best_range_idx], ranges[best_range_idx], 'o', color='#22c55e', markersize=10)
ax2.annotate(f'Max range: {ranges[best_range_idx]:.0f}m\
at {v0_range[best_range_idx]:.1f} m/s',
             xy=(v0_range[best_range_idx], ranges[best_range_idx]),
             xytext=(v0_range[best_range_idx]+2, ranges[best_range_idx]-5),
             color='#22c55e', fontsize=9, arrowprops=dict(arrowstyle='->', color='#22c55e'))

ax2.set_xlabel('Launch speed (m/s)', color='white')
ax2.set_ylabel('Range (m)', color='#22c55e')
ax2_t.set_ylabel('Time aloft (s)', color='#3b82f6')
ax2.set_title('Optimal Launch Speed', color='white', fontsize=13)
lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_t.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2_t.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Optimal launch speed for max range: {v0_range[best_range_idx]:.1f} m/s")
print(f"  Maximum range: {ranges[best_range_idx]:.0f}m from 20m height")
print(f"  Glide ratio: {ranges[best_range_idx]/20:.1f}")
print(f"Optimal speed for max time aloft: {v0_range[best_time_idx]:.1f} m/s")
print(f"  Maximum time: {flight_times[best_time_idx]:.1f}s")`,
      challenge: 'Add a 3 m/s tailwind to the simulation (add 3 to vx at each step). How does it change the range and optimal launch speed? What about a 3 m/s headwind?',
      successHint: 'Glide path calculation is core aerospace engineering. The same equations govern paper airplanes, hang gliders, Space Shuttle re-entry, and flying squirrels. The physics doesn\'t care about the size — only the ratios matter.',
    },
    {
      title: 'Wingsuit design — human attempts at squirrel flight',
      concept: `A **wingsuit** is a human-worn patagium: fabric stretched between the arms and legs, and between the legs. It transforms a human skydiver into a glider with L/D ratios of 2.5-3.5 — comparable to a flying squirrel.

Wingsuit aerodynamics:
- **Wing area**: ~1.0-1.3 m² (compared to body frontal area of ~0.6 m²)
- **Wing loading**: ~700-900 N/m² (vs squirrel's ~37 N/m²)
- **Glide speed**: ~160-200 km/h (vs squirrel's ~30 km/h)
- **Best L/D**: ~3.0-3.5 (advanced suits)
- **Stall speed**: ~100 km/h (impossible to land without a parachute)

The high wing loading means wingsuits must fly fast — there's no possibility of a slow, controlled landing like a squirrel. The parachute is mandatory.

Wingsuit design challenges: the pilot's body provides the structure (no rigid frame), so wing shape changes with body position. Every arm movement changes the camber, span, and angle of attack. The pilot IS the control system.`,
      analogy: 'A wingsuit pilot is like a flying squirrel scaled up 400× by weight but only 30× by wing area. The physics says: you must fly 4× faster (speed scales as √(weight/area)). At 160 km/h, there\'s no room for error — which is why wingsuit BASE jumping is one of the most dangerous sports in the world.',
      storyConnection: 'The flying squirrel of Hollongapar glides at ~30 km/h and lands gently on a tree trunk. A wingsuit pilot doing the same maneuver would need to slow from 160 km/h to zero — that\'s a parachute\'s job. The squirrel\'s low wing loading (light body, large membrane) is the key advantage that no human-sized wingsuit can replicate without rigid structure.',
      checkQuestion: 'Why can\'t we make a wingsuit with enough area to land without a parachute? Just make the wing bigger.',
      checkAnswer: 'Scaling problem: to get the squirrel\'s wing loading (37 N/m²), a 75kg human would need 75×9.81/37 ≈ 20 m² of wing area. That\'s a 4.5m × 4.5m sheet — far too large to control with just body movements. It would also create enormous torques that could flip the pilot. A rigid frame would help (that\'s a hang glider), but then it\'s no longer a "suit." The fundamental constraint is that fabric wings need body structure for control, and the human body isn\'t big enough.',
      codeIntro: 'Compare wingsuit physics to flying squirrel physics and find the scaling limits.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Scaling comparison: squirrel to human
ax1.set_facecolor('#111827')

# Parameters for different "pilots"
pilots = {
    'Flying squirrel': {'mass': 0.15, 'area': 0.04, 'color': '#22c55e'},
    'Sugar glider': {'mass': 0.12, 'area': 0.03, 'color': '#06b6d4'},
    'Colugo': {'mass': 1.5, 'area': 0.25, 'color': '#3b82f6'},
    'Wingsuit (basic)': {'mass': 80, 'area': 1.0, 'color': '#f59e0b'},
    'Wingsuit (advanced)': {'mass': 80, 'area': 1.3, 'color': '#ef4444'},
    'Hang glider': {'mass': 100, 'area': 15, 'color': '#a855f7'},
    'Paraglider': {'mass': 100, 'area': 25, 'color': '#ec4899'},
}

g = 9.81
rho = 1.225
CL_max = 1.2

names = list(pilots.keys())
wing_loadings = [p['mass'] * g / p['area'] for p in pilots.values()]
stall_speeds = [np.sqrt(2 * wl / (rho * CL_max)) for wl in wing_loadings]
colors_p = [p['color'] for p in pilots.values()]

x = np.arange(len(names))
ax1.bar(x, stall_speeds, color=colors_p, alpha=0.8, edgecolor='white', linewidth=0.5)
for i, (ss, wl) in enumerate(zip(stall_speeds, wing_loadings)):
    ax1.text(i, ss + 1, f'{ss:.0f} m/s\
({ss*3.6:.0f} km/h)', ha='center', color='white', fontsize=7)

ax1.axhline(5, color='#22c55e', linestyle=':', alpha=0.3)
ax1.text(6.5, 6, 'Survivable landing speed (~5 m/s)', color='#22c55e', fontsize=8)

ax1.set_xticks(x)
ax1.set_xticklabels(names, rotation=30, ha='right', color='white', fontsize=8)
ax1.set_ylabel('Minimum glide speed (m/s)', color='white')
ax1.set_title('Stall Speed: Why Wingsuits Need Parachutes', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# 2. Glide performance envelope
ax2.set_facecolor('#111827')

for name, params in pilots.items():
    m, A, c = params['mass'], params['area'], params['color']
    wl = m * g / A

    speeds = np.linspace(stall_speeds[list(pilots.keys()).index(name)] * 0.9,
                          stall_speeds[list(pilots.keys()).index(name)] * 3, 100)
    # Sink rate = V * sin(gamma) where tan(gamma) = 1/(L/D)
    CL = 2 * m * g / (rho * speeds**2 * A)
    CL = np.clip(CL, 0, CL_max)
    CD = 0.05 + CL**2 / (np.pi * 1.5 * 0.7)
    LD = CL / CD
    sink_rates = speeds / LD

    valid = CL < CL_max
    if valid.any():
        ax2.plot(speeds[valid], sink_rates[valid], color=c, linewidth=2, label=name)
        min_sink_idx = np.argmin(sink_rates[valid])
        ax2.plot(speeds[valid][min_sink_idx], sink_rates[valid][min_sink_idx],
                 'o', color=c, markersize=6)

ax2.set_xlabel('Airspeed (m/s)', color='white')
ax2.set_ylabel('Sink rate (m/s)', color='white')
ax2.set_title('Speed Polar: Sink Rate vs Airspeed', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper right')
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 80)
ax2.set_ylim(0, 30)
ax2.invert_yaxis()

plt.tight_layout()
plt.show()

print("Scaling comparison:")
for name, params in pilots.items():
    m, A = params['mass'], params['area']
    wl = m * g / A
    ss = np.sqrt(2 * wl / (rho * CL_max))
    print(f"  {name:>22}: mass={m:>5.1f}kg, area={A:>5.2f}m², W/S={wl:>7.1f}N/m², stall={ss:>5.1f}m/s")`,
      challenge: 'Design the minimum wingsuit that could theoretically land without a parachute. What wing area would a 75kg pilot need for a landing speed of 10 m/s (survivable with training)? What would this look like?',
      successHint: 'Wingsuits are the closest humans come to flying squirrel flight. The scaling laws are unforgiving — we\'re too heavy for our wing area. But the physics is identical, and understanding it enables both safer wingsuit design and better UAV engineering.',
    },
    {
      title: 'Paraglider physics — controlled descent in a fabric wing',
      concept: `A **paraglider** is an inflatable fabric wing — essentially a giant flying squirrel membrane with an aspect ratio of 4-6 (vs 1.5 for a squirrel). Key physics:

**Ram-air inflation**: The paraglider wing is open at the front edge. Forward motion forces air into cells, inflating the wing into an airfoil shape. No rigid structure needed — air pressure maintains the shape.

**Performance**:
- L/D ratio: 8-11 (competition: up to 13)
- Stall speed: 22-25 km/h (slow enough for running landings)
- Glide speed: 35-55 km/h
- Sink rate: 1.0-1.5 m/s (can be offset by thermals)
- Wing loading: 35-45 N/m² (similar to a flying squirrel!)

**Control**: Two brake toggles (trailing-edge deflectors). Pulling the right toggle increases drag on the right side → turns right. Pulling both → increases angle of attack → slows down. Full stall (both brakes fully down) → the wing collapses and resets.

**Thermals**: Rising columns of warm air can lift a paraglider faster than it sinks. Skilled pilots use thermals to gain altitude, extending flights for hours and hundreds of kilometers.`,
      analogy: 'A paraglider is a flying squirrel scaled to human size with the right aspect ratio. The wing loading is nearly identical (~40 N/m²), which is why paragliders can land slowly enough for a human to run to a stop. It\'s the engineering solution to the "wingsuit landing problem" — make the wing big enough and the right shape.',
      storyConnection: 'The paraglider solves the problem that wingsuits can\'t: slow, controlled flight and landing at human scale. Its wing loading matches the flying squirrel\'s, its control method (brake toggles) is analogous to the squirrel\'s limb adjustments, and its stall speed allows survivable landings. It\'s biomimicry at its most direct.',
      checkQuestion: 'A paraglider with L/D=9 is 2km above a landing zone. How far upwind can the pilot start and still reach it in calm air?',
      checkAnswer: 'Range = altitude × L/D = 2000 × 9 = 18,000m = 18 km. But wind changes everything: a 15 km/h headwind reduces ground speed from ~40 km/h to ~25 km/h, reducing range to 18 × (25/40) = 11.25 km. A tailwind increases range proportionally. This is why wind assessment is critical for paraglider pilots.',
      codeIntro: 'Simulate paraglider flight with thermal soaring.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Paraglider flight with thermals
ax1.set_facecolor('#111827')

dt = 0.5  # seconds
total_time = 600  # 10 minutes
glide_speed = 11  # m/s (40 km/h)
sink_rate = 1.2  # m/s
LD = glide_speed / sink_rate

x, y, z = 0, 0, 500  # start at 500m altitude
traj_x, traj_y, traj_z = [x], [y], [z]

# Define thermals (x, y, radius, strength)
thermals = [
    (300, 200, 100, 2.5),   # m/s updraft
    (800, -100, 80, 3.0),
    (1500, 300, 120, 2.0),
    (2200, 0, 90, 3.5),
]

heading = 0  # radians
for t_step in range(int(total_time / dt)):
    t = t_step * dt

    # Calculate thermal lift at current position
    thermal_lift = 0
    for tx, ty, tr, ts in thermals:
        dist = np.sqrt((x - tx)**2 + (y - ty)**2)
        if dist < tr:
            thermal_lift += ts * (1 - (dist/tr)**2)  # Gaussian-like profile

    # Pilot steers toward nearest strong thermal if sinking
    if thermal_lift < sink_rate and z > 100:
        best_thermal = min(thermals, key=lambda t: np.sqrt((x-t[0])**2 + (y-t[1])**2))
        target_heading = np.arctan2(best_thermal[1] - y, best_thermal[0] - x)
        heading += 0.02 * np.sin(target_heading - heading)  # gradual turn

    # If in thermal, circle
    if thermal_lift > sink_rate * 0.8:
        heading += 0.03  # tight turn to stay in thermal

    # Update position
    vx = glide_speed * np.cos(heading)
    vy = glide_speed * np.sin(heading)
    vz = thermal_lift - sink_rate

    x += vx * dt
    y += vy * dt
    z += vz * dt
    z = max(z, 0)

    traj_x.append(x)
    traj_y.append(y)
    traj_z.append(z)

    if z <= 0: break

# Plot top-down view with color = altitude
traj_x, traj_y, traj_z = np.array(traj_x), np.array(traj_y), np.array(traj_z)
for i in range(len(traj_x) - 1):
    color = plt.cm.plasma(traj_z[i] / max(traj_z.max(), 1))
    ax1.plot(traj_x[i:i+2], traj_y[i:i+2], color=color, linewidth=1.5)

# Draw thermals
for tx, ty, tr, ts in thermals:
    circle = plt.Circle((tx, ty), tr, facecolor='#f59e0b', alpha=0.15, edgecolor='#f59e0b', linewidth=1, linestyle='--')
    ax1.add_patch(circle)
    ax1.text(tx, ty, f'{ts}m/s', ha='center', va='center', color='#f59e0b', fontsize=7)

ax1.plot(traj_x[0], traj_y[0], 'o', color='#22c55e', markersize=10, label='Launch')
ax1.plot(traj_x[-1], traj_y[-1], 's', color='#ef4444', markersize=10, label='Landing')
ax1.set_xlabel('East (m)', color='white')
ax1.set_ylabel('North (m)', color='white')
ax1.set_title('Paraglider Flight Path (top view, color=altitude)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_aspect('equal')

# 2. Altitude profile
ax2.set_facecolor('#111827')
time_axis = np.arange(len(traj_z)) * dt / 60  # minutes
ax2.plot(time_axis, traj_z, color='#22c55e', linewidth=2)
ax2.fill_between(time_axis, traj_z, alpha=0.1, color='#22c55e')

# Mark thermal encounters
for i in range(1, len(traj_z)):
    if traj_z[i] > traj_z[i-1] + 0.1:
        ax2.axvspan(time_axis[i-1], time_axis[i], alpha=0.05, color='#f59e0b')

ax2.set_xlabel('Time (minutes)', color='white')
ax2.set_ylabel('Altitude (m)', color='white')
ax2.set_title('Altitude Profile', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

total_dist = np.sqrt((traj_x[-1]-traj_x[0])**2 + (traj_y[-1]-traj_y[0])**2)
flight_time = len(traj_z) * dt / 60
max_alt = traj_z.max()
print(f"Flight summary:")
print(f"  Flight time: {flight_time:.1f} minutes")
print(f"  Start altitude: {traj_z[0]:.0f}m, Max altitude: {max_alt:.0f}m")
print(f"  Straight-line distance: {total_dist:.0f}m")
print(f"  Base L/D: {LD:.1f}, Sink rate: {sink_rate} m/s")
print(f"  Thermals enabled altitude gain above launch height!")`,
      challenge: 'Make the thermals stronger (5 m/s) and see how high the pilot can climb. In real life, pilots have reached 8,000m altitude and flown 500+ km using thermals. What limits the maximum altitude?',
      successHint: 'Paragliders demonstrate that the flying squirrel\'s design works at human scale — you just need the right wing loading. Thermal soaring adds energy extraction from the atmosphere, enabling flights that would be impossible on pure gliding alone.',
    },
    {
      title: 'UAV glider design — engineering autonomous flight',
      concept: `Unmanned Aerial Vehicles (UAVs) that use gliding save enormous amounts of energy compared to powered multirotor drones. Glider UAVs are used for:

- **Atmospheric research**: soaring in thermals for days
- **Surveillance**: silent, long-endurance observation
- **Cargo delivery**: glide from altitude to remote locations
- **Environmental monitoring**: mapping forests, oceans, wildlife

Design parameters for a glider UAV:
- **Wing area and span**: determines L/D and stall speed
- **Airfoil selection**: cambered vs symmetric, thick vs thin
- **Control surfaces**: ailerons (roll), elevator (pitch), rudder (yaw)
- **Autopilot**: IMU + GPS + barometer for autonomous navigation
- **Thermal detection**: variometer (measures vertical speed) for autonomous soaring

The flying squirrel's design principles directly apply:
- Low aspect ratio for forest navigation → UAV for indoor/urban environments
- Active shape control → morphing wings on UAVs
- Landing flare maneuver → autonomous precision landing algorithms`,
      analogy: 'A glider UAV is a robotic flying squirrel: it uses gravity and aerodynamics instead of batteries, navigates obstacles autonomously, and can adjust its flight parameters in real-time. The main difference is that the UAV uses silicon for its brain while the squirrel uses neurons — but the control algorithms are remarkably similar.',
      storyConnection: 'Imagine a UAV designed to survey the Hollongapar Gibbon Wildlife Sanctuary — monitoring gibbons, flying squirrels, and forest health. It would need the squirrel\'s flight characteristics: low wing loading for slow flight, high maneuverability for canopy navigation, and precision landing capability. The flying squirrel is the design brief.',
      checkQuestion: 'A fixed-wing UAV glider can stay aloft for hours in thermals. A quadcopter drone lasts 20-30 minutes on a battery. Why not always use gliders?',
      checkAnswer: 'Gliders can\'t hover, take off vertically, or fly slowly in tight spaces. They need a launch mechanism (catapult, hand throw, or runway) and open space for circling in thermals. Quadcopters excel at precision hovering, vertical takeoff/landing, and indoor flight. The ideal is a hybrid: VTOL (vertical takeoff) transitioning to fixed-wing glide — which is exactly what many modern drones do.',
      codeIntro: 'Design and simulate a glider UAV with autonomous thermal soaring.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. UAV design space: wing loading vs aspect ratio
ax = axes[0, 0]
ax.set_facecolor('#111827')

wl_range = np.linspace(10, 200, 100)
ar_range = np.linspace(1, 20, 100)
WL, AR = np.meshgrid(wl_range, ar_range)

# Best L/D for each combination
CD0 = 0.03  # UAV has smoother surface than squirrel
e = 0.85
best_LD = 0.5 * np.sqrt(np.pi * e * AR / CD0)

# Stall speed
rho = 1.225
CL_max = 1.4
V_stall = np.sqrt(2 * WL / (rho * CL_max))

# Combined score: high L/D, low stall speed
score = best_LD / V_stall

im = ax.contourf(wl_range, ar_range, score, levels=20, cmap='viridis')
plt.colorbar(im, ax=ax, label='Score (L/D per stall speed)')

# Mark designs
designs = {
    'Forest UAV': (40, 3, '#22c55e'),
    'Long-range': (80, 15, '#ef4444'),
    'Flying squirrel': (37, 1.5, '#f59e0b'),
    'Paraglider': (40, 5, '#3b82f6'),
}
for name, (wl, ar, c) in designs.items():
    ax.plot(wl, ar, 'o', color=c, markersize=10, markeredgecolor='white', markeredgewidth=1.5)
    ax.annotate(name, (wl, ar), textcoords="offset points", xytext=(5, 5), color=c, fontsize=8)

ax.set_xlabel('Wing loading (N/m²)', color='white')
ax.set_ylabel('Aspect ratio', color='white')
ax.set_title('UAV Design Space', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 2. Endurance comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')

drone_types = ['Quadcopter\
(battery)', 'Fixed-wing\
(battery)', 'Glider\
(no thermal)', 'Glider\
(thermal soaring)']
endurance_hrs = [0.5, 2, 4, 48]  # hours
range_km = [5, 50, 80, 500]
colors_drone = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

x = np.arange(len(drone_types))
ax.bar(x - 0.2, endurance_hrs, 0.35, color=colors_drone, alpha=0.8, label='Endurance (hrs)')
ax_r = ax.twinx()
ax_r.bar(x + 0.2, range_km, 0.35, color=colors_drone, alpha=0.4, label='Range (km)')

ax.set_xticks(x)
ax.set_xticklabels(drone_types, color='white', fontsize=8)
ax.set_ylabel('Endurance (hours)', color='white')
ax_r.set_ylabel('Range (km)', color='white')
ax.set_title('UAV Endurance & Range Comparison', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax_r.tick_params(colors='gray')

# 3. Autonomous thermal detection
ax = axes[1, 0]
ax.set_facecolor('#111827')

# Simulate variometer readings during a thermal encounter
time = np.linspace(0, 120, 600)  # 2 minutes
base_sink = -1.2  # m/s
thermal_center = 60  # seconds
thermal_width = 20  # seconds
thermal_strength = 3.0  # m/s

vario = base_sink + thermal_strength * np.exp(-((time - thermal_center) / thermal_width)**2)
vario += np.random.normal(0, 0.3, len(time))  # sensor noise

ax.plot(time, vario, color='#22c55e', linewidth=1.5, alpha=0.7)
ax.axhline(0, color='#f59e0b', linestyle='--', linewidth=1, label='Zero sink (climbing!)')
ax.fill_between(time, vario, 0, where=vario > 0, alpha=0.2, color='#22c55e', label='Thermal detected')
ax.fill_between(time, vario, 0, where=vario <= 0, alpha=0.1, color='#ef4444')

ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Vertical speed (m/s)', color='white')
ax.set_title('Variometer: Thermal Detection', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 4. Forest survey mission simulation
ax = axes[1, 1]
ax.set_facecolor('#111827')

# UAV surveys a forest in a lawn-mower pattern
survey_x, survey_y = [], []
altitude = 200  # meters
leg_length = 500  # meters
n_legs = 8
spacing = 50  # meters between legs

for leg in range(n_legs):
    if leg % 2 == 0:
        survey_x.extend([0, leg_length])
    else:
        survey_x.extend([leg_length, 0])
    survey_y.extend([leg * spacing, leg * spacing])
    if leg < n_legs - 1:
        survey_x.extend([survey_x[-1], survey_x[-1]])
        survey_y.extend([leg * spacing, (leg + 1) * spacing])

ax.plot(survey_x, survey_y, color='#22c55e', linewidth=1.5, alpha=0.8)
ax.plot(survey_x[0], survey_y[0], 'o', color='#3b82f6', markersize=10, label='Launch')
ax.plot(survey_x[-1], survey_y[-1], 's', color='#ef4444', markersize=10, label='Recovery')

# Camera coverage
for i in range(0, len(survey_x)-1, 20):
    rect = plt.Rectangle((survey_x[i]-15, survey_y[i]-15), 30, 30,
                          facecolor='#22c55e', alpha=0.05, edgecolor='none')
    ax.add_patch(rect)

ax.set_xlabel('East (m)', color='white')
ax.set_ylabel('North (m)', color='white')
ax.set_title('Forest Survey Flight Plan', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_aspect('equal')

plt.tight_layout()
plt.show()

print("UAV glider design for Hollongapar forest survey:")
print("  Wing loading: ~40 N/m² (matches flying squirrel)")
print("  Aspect ratio: 3-5 (balance of efficiency + maneuverability)")
print("  Stall speed: ~7 m/s (25 km/h) — slow enough for forest")
print("  Endurance: 2-4 hours (pure glide from altitude)")
print("  Payload: camera, LiDAR, temperature sensors")`,
      challenge: 'Design a UAV to monitor the flying squirrel population in Hollongapar. It needs to fly slowly (< 30 km/h), carry a 200g infrared camera, and survey 1 km² of forest. What are the key design parameters?',
      successHint: 'UAV glider design is where biology meets aerospace engineering. The flying squirrel\'s flight characteristics provide a validated design template for forest-surveying drones — nature already solved the optimization problem.',
    },
    {
      title: 'Energy harvesting in flight — extracting power from the atmosphere',
      concept: `Unpowered gliders can extract energy from the atmosphere to gain altitude and extend flight indefinitely:

**Thermal soaring**: Rising columns of warm air (thermals) provide vertical lift. Pilots circle within thermals, climbing 2-5 m/s. Thermals form over dark surfaces (parking lots, plowed fields), sun-facing slopes, and urban heat islands.

**Ridge soaring**: Wind deflected upward by a hill or cliff creates a continuous band of lift along the ridge. Birds (and glider pilots) fly back and forth along ridges for hours.

**Dynamic soaring**: Exploiting wind shear (wind speed changes with altitude). Albatrosses use this to fly thousands of kilometers without flapping, extracting energy from the speed difference between slow air near the ocean surface and fast wind above.

The energy budget: potential energy (mgh) → kinetic energy (½mv²) → drag losses. Energy harvesting reverses this: atmospheric energy → potential energy. A glider that harvests more energy than it loses to drag can fly indefinitely.

This is why albatrosses can circle the globe and solar-powered gliders can stay aloft for months.`,
      analogy: 'Energy harvesting in flight is like regenerative braking in an electric car. The car recaptures energy when braking. A glider recaptures energy when entering a thermal. Both are extracting energy from their environment that would otherwise be lost. The difference: the car stores it in a battery, the glider stores it as altitude.',
      storyConnection: 'The flying squirrel doesn\'t harvest atmospheric energy — it\'s purely a "descending glider." But the principles of energy harvesting could extend UAV flight in the Hollongapar forest: thermals rising from sunny clearings, ridge lift along the Brahmaputra river bluffs, and wind shear above the canopy. A smart UAV could exploit all of these.',
      checkQuestion: 'An albatross can fly 900 km per day without flapping. Where does the energy come from? It\'s not thermals — the open ocean has few thermals.',
      checkAnswer: 'Dynamic soaring. The wind near the ocean surface is slow (friction), but 10-20m above it\'s fast. The albatross zooms upward into the fast wind (gaining energy), turns, dives back toward the surface (trading altitude for speed), and pulls up again. Each cycle extracts energy from the wind shear. The math shows this can provide enough energy for indefinite flight — as long as there\'s wind.',
      codeIntro: 'Simulate dynamic soaring: extracting energy from wind shear like an albatross.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Wind shear profile and dynamic soaring
ax1.set_facecolor('#111827')

# Wind profile: logarithmic boundary layer
heights = np.linspace(0, 25, 200)
wind_speed = 12 * np.log(heights / 0.01 + 1) / np.log(20 / 0.01 + 1)  # 12 m/s at 20m

ax1.plot(wind_speed, heights, color='#3b82f6', linewidth=2.5, label='Wind speed')
ax1.fill_betweenx(heights, 0, wind_speed, alpha=0.1, color='#3b82f6')

# Dynamic soaring trajectory
t = np.linspace(0, 4 * np.pi, 200)
soar_x = 3 * np.sin(t)  # wind direction oscillation (simplified)
soar_z = 10 + 8 * np.cos(t)  # altitude oscillation

ax1_t = ax1.twiny()
ax1_t.plot(soar_x * 3, soar_z, color='#22c55e', linewidth=2, label='Albatross path')
ax1_t.set_xlabel('Position (relative)', color='#22c55e')

# Annotate phases
ax1.annotate('Climb into\
fast wind', xy=(8, 18), color='#f59e0b', fontsize=8,
             bbox=dict(boxstyle='round', facecolor='#f59e0b', alpha=0.2))
ax1.annotate('Dive toward\
surface', xy=(3, 4), color='#ef4444', fontsize=8,
             bbox=dict(boxstyle='round', facecolor='#ef4444', alpha=0.2))
ax1.annotate('ENERGY\
EXTRACTED\
HERE', xy=(10, 12), color='#22c55e', fontsize=9,
             fontweight='bold')

ax1.set_xlabel('Wind speed (m/s)', color='#3b82f6')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Dynamic Soaring in Wind Shear', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# 2. Energy budget: sources and sinks during flight
ax2.set_facecolor('#111827')

# Simulate energy over time for different soaring strategies
dt = 0.1
total_time = 300  # 5 minutes
time = np.arange(0, total_time, dt)

# Pure glide (no energy input)
mass = 8.5  # albatross kg
g = 9.81
sink_rate = 1.0  # m/s
E_glide = mass * g * (500 - sink_rate * time)  # potential energy from 500m

# Thermal soaring
thermal_rate = 2.0  # m/s average climb
E_thermal = mass * g * (200 + (thermal_rate - sink_rate) * time)

# Dynamic soaring (oscillating energy extraction)
E_dynamic = mass * g * 100 * np.ones_like(time)
for i in range(1, len(time)):
    energy_extract = 2.5 * np.sin(2 * np.pi * time[i] / 30)**2  # energy from shear
    energy_loss = sink_rate  # energy to drag
    net = energy_extract - energy_loss
    E_dynamic[i] = E_dynamic[i-1] + mass * g * net * dt

E_glide = np.clip(E_glide, 0, None)
E_thermal = np.clip(E_thermal, 0, None)

ax2.plot(time, E_glide / 1000, color='#ef4444', linewidth=2, label='Pure glide (descending)')
ax2.plot(time, E_thermal / 1000, color='#f59e0b', linewidth=2, label='Thermal soaring (climbing)')
ax2.plot(time, E_dynamic / 1000, color='#22c55e', linewidth=2, label='Dynamic soaring (steady)')

ax2.axhline(0, color='#4b5563', linestyle=':', alpha=0.3)
ax2.set_xlabel('Time (seconds)', color='white')
ax2.set_ylabel('Total energy (kJ)', color='white')
ax2.set_title('Energy Budget: Soaring Strategies', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Energy harvesting strategies:")
print("  Pure glide: energy decreases steadily (limited endurance)")
print("  Thermal soaring: net energy gain (can climb indefinitely)")
print("  Dynamic soaring: steady-state (indefinite flight in wind shear)")
print()
print("Albatross dynamic soaring:")
print("  Speed: 50-110 km/h (no flapping)")
print("  Daily range: up to 900 km")
print("  Energy source: wind speed difference between surface and altitude")
print("  Efficiency: can fly for YEARS without landing")`,
      challenge: 'Calculate the energy extracted per dynamic soaring cycle. If the wind at 20m is 12 m/s and at 1m is 2 m/s, and the albatross gains 10 m/s of airspeed from the shear, how much kinetic energy does it gain per cycle? Compare to the energy lost to drag.',
      successHint: 'Energy harvesting transforms gliding from a descent into indefinite flight. The same principles are being applied to solar-powered UAVs, atmospheric research drones, and even Mars aircraft. The albatross showed us the way — energy is everywhere in the atmosphere, if you know how to extract it.',
    },
    {
      title: 'Biomimetic aircraft — from squirrels to morphing wings',
      concept: `Bio-inspired aircraft design is moving beyond copying shapes to copying **principles**:

**Morphing wings**: Aircraft that change wing shape in flight, like the flying squirrel changes its patagium. NASA's X-56A and FlexSys FlexFoil systems bend wings smoothly (no hinged flaps), reducing drag by 5-12%.

**Perching landing**: Squirrels flare to land on vertical surfaces. Drones that can perch on wires, poles, or walls using similar stall-and-grab maneuvers save enormous energy (no hover needed).

**Formation flight**: Birds in V-formation exploit wingtip vortices from the bird ahead, saving 10-15% energy. Airbus tested "fello'fly" with commercial aircraft in formation.

**Micro air vehicles (MAVs)**: Insect-scale drones (~10cm) that use the same aerodynamics as flying insects and small gliders. At this scale, the physics is different: viscous forces dominate, and wings must flap (like insects) or use membrane deformation (like squirrels).

The flying squirrel's design principles — membrane wings, active shape control, precision landing, low-speed maneuverability — are exactly what next-generation urban air mobility vehicles need.`,
      analogy: 'Biomimetic aircraft design is like translating a novel from nature\'s language to engineering\'s language. You don\'t translate word-for-word (copying the exact shape) — you translate meaning-for-meaning (copying the design principle). The flying squirrel\'s "meaning" is: lightweight, morphing, slow, maneuverable, precise landing. That\'s the design specification for urban UAVs.',
      storyConnection: 'The flying squirrel of Hollongapar is a living prototype for the aircraft of the future: it demonstrates that membrane wings, active shape control, and biomechanical landing are viable engineering solutions. Every time a flying squirrel glides between trees in Assam, it\'s performing a flight test that aerospace engineers would pay millions to replicate.',
      checkQuestion: 'SpaceX lands rockets vertically using thrust vector control. The flying squirrel lands on tree trunks using aerodynamic stall. Which approach is more energy-efficient?',
      checkAnswer: 'The squirrel\'s approach is vastly more efficient — it uses no fuel, only converting kinetic energy to drag heating. Rocket landing uses enormous amounts of fuel to decelerate. But the squirrel\'s approach only works at low speeds where aerodynamic braking is sufficient. At rocket speeds (>1000 km/h), the atmosphere can\'t provide enough drag force, so propulsive braking is necessary. Different speed regimes require different solutions.',
      codeIntro: 'Compare bio-inspired vs conventional aircraft design and project future trends.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Morphing wing advantage
ax = axes[0, 0]
ax.set_facecolor('#111827')

# L/D at different speeds for fixed vs morphing wing
speeds = np.linspace(5, 40, 200)  # m/s

# Fixed wing (optimized for one speed)
design_speed = 15  # m/s
CL_fixed = 0.8  # fixed CL
CD_fixed = 0.04 + CL_fixed**2 / (np.pi * 6 * 0.8)
LD_fixed = CL_fixed / CD_fixed * np.exp(-((speeds - design_speed) / 10)**2) * 1.2

# Morphing wing (adapts CL for each speed)
CL_morph = np.clip(2 * 0.15 * 9.81 / (1.225 * speeds**2 * 0.04), 0.2, 1.5)  # optimal CL
CD_morph = 0.03 + CL_morph**2 / (np.pi * 6 * 0.85)
LD_morph = CL_morph / CD_morph

ax.plot(speeds, LD_fixed, color='#ef4444', linewidth=2, label='Fixed wing')
ax.plot(speeds, LD_morph, color='#22c55e', linewidth=2, label='Morphing wing')
ax.fill_between(speeds, LD_fixed, LD_morph, where=LD_morph > LD_fixed,
                alpha=0.15, color='#22c55e', label='Morphing advantage')
ax.set_xlabel('Airspeed (m/s)', color='white')
ax.set_ylabel('L/D ratio', color='white')
ax.set_title('Fixed vs Morphing Wing Performance', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 2. Evolution of bio-inspired aircraft
ax = axes[0, 1]
ax.set_facecolor('#111827')

milestones = [
    (1903, 'Wright Flyer', 'Bird wing warping', '#f59e0b'),
    (1950, 'Variable sweep', 'Bird wing folding', '#ef4444'),
    (1990, 'MAVs', 'Insect flight', '#22c55e'),
    (2010, 'Perching drones', 'Bird/squirrel landing', '#3b82f6'),
    (2015, 'Morphing wings', 'Squirrel patagium', '#a855f7'),
    (2020, 'Formation UAVs', 'V-formation birds', '#ec4899'),
    (2025, 'Bio-hybrid', 'Living + synthetic', '#06b6d4'),
]

for i, (year, name, inspiration, color) in enumerate(milestones):
    ax.plot(year, i, 'o', color=color, markersize=12)
    ax.text(year + 3, i, f'{name}\
({inspiration})', va='center', color='white', fontsize=8)
    ax.axhline(i, color='#4b5563', alpha=0.1, linewidth=0.5)

ax.set_xlabel('Year', color='white')
ax.set_title('Bio-Inspired Aircraft Timeline', color='white', fontsize=11)
ax.set_yticks([])
ax.tick_params(colors='gray')

# 3. Size vs speed regime for different flyers
ax = axes[1, 0]
ax.set_facecolor('#111827')

flyers = {
    'Fruit fly': (0.003, 0.8, '#ec4899'),
    'Dragonfly': (0.05, 5, '#a855f7'),
    'Hummingbird': (0.1, 12, '#ef4444'),
    'Flying squirrel': (0.3, 10, '#22c55e'),
    'Pigeon': (0.5, 20, '#3b82f6'),
    'Albatross': (3.5, 30, '#f59e0b'),
    'MAV drone': (0.1, 5, '#06b6d4'),
    'Glider UAV': (1.5, 15, '#84cc16'),
    'Cessna 172': (11, 60, '#9ca3af'),
}

for name, (span, speed, color) in flyers.items():
    ax.scatter(span, speed, s=100, c=color, edgecolors='white', linewidths=1, zorder=5)
    ax.annotate(name, (span, speed), textcoords="offset points", xytext=(5, 5),
                color='white', fontsize=7)

# Reynolds number contours
spans = np.logspace(-2, 2, 100)
for Re, ls in [(1e3, ':'), (1e4, '--'), (1e5, '-'), (1e6, '-')]:
    nu = 1.5e-5  # kinematic viscosity of air
    v = Re * nu / spans
    ax.plot(spans, v, color='#4b5563', linestyle=ls, alpha=0.3, linewidth=0.8)
    valid_idx = np.argmin(np.abs(v - 30))
    if spans[valid_idx] < 10:
        ax.text(spans[valid_idx], 32, f'Re={Re:.0e}', color='#4b5563', fontsize=7)

ax.set_xscale('log')
ax.set_xlabel('Wingspan (m)', color='white')
ax.set_ylabel('Flight speed (m/s)', color='white')
ax.set_title('Size-Speed Map of Flyers', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 4. Future concepts
ax = axes[1, 1]
ax.set_facecolor('#111827')
concepts = ['Morphing\
wings', 'Perching\
landing', 'Thermal\
soaring', 'Formation\
flight', 'Bio-hybrid\
materials', 'Neural\
control']
readiness = [7, 6, 8, 5, 3, 4]  # Technology Readiness Level (1-9)
impact = [8, 7, 9, 6, 10, 9]  # Potential impact (1-10)
colors_c = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#ec4899']

ax.scatter(readiness, impact, s=[200]*6, c=colors_c, edgecolors='white', linewidths=1.5, zorder=5)
for i, name in enumerate(concepts):
    ax.annotate(name, (readiness[i], impact[i]), textcoords="offset points",
                xytext=(10, 0), color='white', fontsize=8, va='center')

ax.set_xlabel('Technology Readiness (1-9)', color='white')
ax.set_ylabel('Potential Impact (1-10)', color='white')
ax.set_title('Bio-Inspired Flight: Readiness vs Impact', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_xlim(1, 10)
ax.set_ylim(1, 11)

plt.tight_layout()
plt.show()

print("Bio-inspired aircraft design principles from the flying squirrel:")
print("  1. Morphing wings: active shape control for multi-speed optimization")
print("  2. Low wing loading: slow flight in confined spaces")
print("  3. Precision landing: stall-flare maneuver on vertical surfaces")
print("  4. Membrane structure: lightweight, foldable, damage-tolerant")
print("  5. Active stability: continuous feedback control, not static stability")
print()
print("The flying squirrel is not just a curiosity — it's a design manual")
print("for the next generation of urban air vehicles.")`,
      challenge: 'Design a bio-inspired drone for delivering medical supplies to remote villages in Assam. It must: (1) carry 500g payload, (2) glide 10km from a hilltop launch, (3) land precisely in a small clearing. What design parameters would you choose?',
      successHint: 'From glide path calculations to wingsuits to paragliders to UAVs to energy harvesting to morphing wings — the flying squirrel of Hollongapar connects all of aerodynamics. Nature\'s designs aren\'t just elegant — they\'re practical engineering solutions that we\'re only now learning to replicate.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Bio-inspired Flight — some physics and math experience helpful</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced aerodynamics simulations. Click to start.</p>
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