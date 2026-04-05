import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MishingFishLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fish behavior and ethology — why fish move the way they do',
      concept: `Ethology is the scientific study of animal behavior. Fish behavior is governed by a hierarchy of drives: **feeding**, **predator avoidance**, **reproduction**, and **territory defense**. Understanding these drives is the key to understanding why traditional fish traps work.

Fish exhibit several stereotyped behaviors that the Mishing people exploit:

- **Rheotaxis**: the tendency to orient and swim against the current. Fish face upstream to maintain position and capture drifting food. Traps placed facing downstream exploit this — fish swim in but cannot turn around.
- **Thigmotaxis**: the tendency to seek contact with surfaces. Fish feel safer near structures (logs, rocks, trap walls). This is why fish enter woven bamboo enclosures voluntarily.
- **Diel vertical migration**: many species move to different depths at different times of day, following light levels and prey availability.
- **Schooling**: fish aggregate for predator defense (dilution effect, confusion effect). A trap that captures one fish often captures many because the school follows.

The Mishing fish trap is not a brute-force device. It is an ethological instrument — a structure designed around how fish perceive and respond to their environment.`,
      analogy: 'Think of a fish trap like a shopping mall designed by behavioral psychologists. The entrance is wide and inviting (low-barrier entry). The interior has attractive features (shelter, flow patterns that mimic natural resting spots). The exit is narrow and confusing. The mall does not force anyone inside — it exploits natural human tendencies. A Mishing trap does the same with fish instincts.',
      storyConnection: 'The Mishing people did not learn fish behavior from textbooks. They learned it from generations of observation — watching which trap shapes worked in which currents, which seasons brought which species, how water level changes altered fish movement. This is empirical ethology, refined over centuries.',
      checkQuestion: 'A fish trap works well during monsoon floods but catches nothing during the dry season at the same location. What ethological explanation could account for this?',
      checkAnswer: 'During monsoon floods, fish migrate upstream to spawn and exploit new flooded habitats (lateral migration). The trap intercepts this predictable movement. In the dry season, fish are sedentary, holding in deep pools with minimal movement. The trap sees no traffic. Effective trapping requires understanding seasonal behavioral patterns, not just trap design.',
      codeIntro: 'Model fish movement using simple behavioral rules: rheotaxis, thigmotaxis, and random foraging.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate fish movement in a river section
# River flows left to right (positive x direction)
n_fish = 20
n_steps = 300
dt = 0.1

# River parameters
river_width = 10.0  # meters
river_length = 30.0  # meters
current_speed = 0.5  # m/s in x direction

# Behavioral parameters
rheotaxis_strength = 0.3   # tendency to swim against current
thigmotaxis_strength = 0.2  # tendency to stay near banks
random_strength = 0.15       # random foraging movement
speed = 0.8                  # fish swim speed

# Initialize fish positions (random in river)
positions = np.zeros((n_fish, n_steps, 2))
positions[:, 0, 0] = np.random.uniform(5, 25, n_fish)  # x
positions[:, 0, 1] = np.random.uniform(1, river_width - 1, n_fish)  # y

for t in range(1, n_steps):
    for i in range(n_fish):
        x, y = positions[i, t-1]

        # Rheotaxis: swim against current (negative x)
        rheo_dx = -rheotaxis_strength * current_speed
        rheo_dy = 0

        # Thigmotaxis: move toward nearest bank if far from both
        dist_to_bottom = y
        dist_to_top = river_width - y
        if dist_to_bottom < 2.0:
            thig_dy = -thigmotaxis_strength  # stay near bottom bank
        elif dist_to_top < 2.0:
            thig_dy = thigmotaxis_strength   # stay near top bank
        else:
            thig_dy = 0
        thig_dx = 0

        # Random foraging
        angle = np.random.uniform(0, 2 * np.pi)
        rand_dx = random_strength * np.cos(angle)
        rand_dy = random_strength * np.sin(angle)

        # Current pushes fish downstream
        current_dx = current_speed * dt

        # Combined movement
        dx = (rheo_dx + thig_dx + rand_dx + current_dx) * speed * dt
        dy = (rheo_dy + thig_dy + rand_dy) * speed * dt

        # Update position with boundary reflection
        new_x = np.clip(x + dx, 0, river_length)
        new_y = np.clip(y + dy, 0.2, river_width - 0.2)

        positions[i, t] = [new_x, new_y]

# Visualize
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: All fish trajectories
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.fill_between([0, river_length], 0, river_width, alpha=0.1, color='#3b82f6')
for i in range(n_fish):
    ax.plot(positions[i, :, 0], positions[i, :, 1], alpha=0.4, linewidth=0.5)
    ax.scatter(positions[i, -1, 0], positions[i, -1, 1], s=20, zorder=5)
ax.set_xlim(0, river_length)
ax.set_ylim(0, river_width)
ax.set_xlabel('Distance downstream (m)', color='white')
ax.set_ylabel('River width (m)', color='white')
ax.set_title('Fish trajectories (rheotaxis + thigmotaxis)', color='white', fontsize=11)
ax.annotate('Current direction >>>', xy=(15, 9.5), color='#60a5fa', fontsize=9, ha='center')
ax.tick_params(colors='gray')

# Plot 2: Position density heatmap
ax = axes[0, 1]
ax.set_facecolor('#111827')
all_x = positions[:, :, 0].flatten()
all_y = positions[:, :, 1].flatten()
heatmap, xedges, yedges = np.histogram2d(all_x, all_y, bins=[30, 15])
ax.imshow(heatmap.T, origin='lower', aspect='auto', cmap='hot',
          extent=[0, river_length, 0, river_width])
ax.set_xlabel('Distance downstream (m)', color='white')
ax.set_ylabel('River width (m)', color='white')
ax.set_title('Fish density heatmap', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Bank preference (thigmotaxis)
ax = axes[1, 0]
ax.set_facecolor('#111827')
final_y = positions[:, -1, 1]
ax.hist(all_y, bins=20, color='#22c55e', edgecolor='none', alpha=0.7, density=True)
ax.axvline(river_width / 2, color='#f59e0b', linestyle='--', label='River center')
ax.set_xlabel('Position across river width (m)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Cross-river distribution (thigmotaxis effect)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Upstream vs downstream drift over time
ax = axes[1, 1]
ax.set_facecolor('#111827')
mean_x = positions[:, :, 0].mean(axis=0)
time = np.arange(n_steps) * dt
ax.plot(time, mean_x, color='#a855f7', linewidth=2)
ax.axhline(positions[:, 0, 0].mean(), color='#f59e0b', linestyle='--', label='Starting mean x')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Mean x position (m)', color='white')
ax.set_title('Mean position over time (rheotaxis vs current)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Behavioral simulation results:")
print(f"  Fish started at mean x = {positions[:, 0, 0].mean():.1f} m")
print(f"  Fish ended at mean x = {positions[:, -1, 0].mean():.1f} m")
drift = positions[:, -1, 0].mean() - positions[:, 0, 0].mean()
print(f"  Net drift: {drift:+.1f} m ({'downstream' if drift > 0 else 'upstream'})")
print(f"  Bank preference: {(all_y < 2).sum() + (all_y > river_width - 2).sum()} of {len(all_y)} positions near banks")
print()
print("These behavioral tendencies — rheotaxis and thigmotaxis — are exactly")
print("what the Mishing fish trap exploits. Place a funnel-shaped trap near")
print("the bank, facing downstream, and fish swim right in.")`,
      challenge: 'Add a "trap zone" (a rectangle near one bank) and count how many fish enter it over the simulation. Try different trap positions and orientations to find the optimal placement.',
      successHint: 'The Mishing people optimized trap placement through centuries of trial and error. You just replicated that process computationally in minutes. Both approaches converge on the same answer: near-bank, facing downstream, at current constriction points.',
    },
    {
      title: 'Hydraulic engineering in nature — how water flow shapes trap design',
      concept: `Water does not flow uniformly in a river. Understanding the velocity profile is critical to trap engineering.

**Laminar flow profile**: In a channel, water moves fastest at the center and slowest near the banks and riverbed. This is described by the **log-law velocity profile**:

u(z) = (u*/k) * ln(z/z0)

where u* is the friction velocity, k is von Karman's constant (0.41), z is height above the bed, and z0 is the roughness length.

**Key hydraulic concepts for trap design**:
- **Bernoulli's principle**: Where water speeds up (constriction), pressure drops. Fish use low-pressure zones to rest. Trap entrances are narrow, creating a pressure drop that helps guide fish in.
- **Eddies and recirculation**: Behind obstacles, water reverses direction. Fish rest in these eddies. Traditional traps create artificial eddies inside to keep fish calm.
- **Discharge**: Q = A * v (flow rate = cross-sectional area times velocity). Traps work best at specific discharge rates — too fast and they wash away; too slow and fish do not move.
- **Froude number**: Fr = v / sqrt(g*h). When Fr > 1 (supercritical flow), standing waves form. Traps exploit the transition zones between subcritical and supercritical flow.

The Mishing trap is a hydraulic device as much as a biological one.`,
      analogy: 'Imagine pouring water through a funnel. The wide end collects water easily, the narrow neck speeds it up (Bernoulli), and once through, the water cannot easily flow back. A Mishing fish trap works on the same principle — a wide funnel entrance narrows to a point where the fish cannot turn around, and the interior has calm water (like the collection vessel below the funnel).',
      storyConnection: 'The Mishing people build their traps during specific water levels and current conditions. They know that a trap placed in fast current will catch different species than one in slack water. This is applied hydraulic engineering — matching trap geometry to flow conditions for optimal capture.',
      checkQuestion: 'Why would a fish trap with a very narrow entrance catch fewer fish than one with a moderately narrow entrance, even though the narrow one is harder to escape?',
      checkAnswer: 'The very narrow entrance creates a high-velocity jet (Bernoulli) that fish cannot swim against to enter. It also creates turbulence that fish avoid. A moderately narrow entrance maintains a gentle inward flow that fish can navigate naturally. Trap design is an optimization problem: narrow enough to prevent escape, wide enough to allow entry.',
      codeIntro: 'Model the velocity profile in a river cross-section and simulate how a constriction (trap entrance) affects flow patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model river cross-section velocity profile
river_width = 10.0  # meters
river_depth = 2.0   # meters
n_points = 100

# Log-law velocity profile across width and depth
y_positions = np.linspace(0.01, river_width, n_points)
z_positions = np.linspace(0.01, river_depth, 50)

# Parabolic profile across width (zero at banks, max at center)
width_factor = 4 * y_positions * (river_width - y_positions) / river_width**2

# Log profile with depth
u_star = 0.05  # friction velocity
kappa = 0.41   # von Karman constant
z0 = 0.01      # roughness length

Y, Z = np.meshgrid(y_positions, z_positions)
width_2d = 4 * Y * (river_width - Y) / river_width**2
depth_2d = (u_star / kappa) * np.log(Z / z0)
velocity_field = width_2d * depth_2d
velocity_field = np.clip(velocity_field, 0, None)

# Normalize to realistic speeds
v_max = 1.2  # m/s
velocity_field = velocity_field / velocity_field.max() * v_max

# Model constriction (trap entrance)
constriction_y_center = 2.0  # near bank
constriction_width = 1.0     # narrow entrance
trap_x = 15.0  # position along river

# Bernoulli: velocity increases at constriction
A_river = river_width * river_depth
A_constriction = constriction_width * river_depth
# Q = A * v, so v_constriction = v_river * (A_river / A_constriction)
speed_ratio = min(A_river / A_constriction, 5)  # cap for realism

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Velocity cross-section
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.contourf(Y, Z, velocity_field, levels=20, cmap='viridis')
plt.colorbar(im, ax=ax, label='Velocity (m/s)')
ax.set_xlabel('Width (m)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.set_title('River velocity profile (cross-section)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 2: Surface velocity across width
ax = axes[0, 1]
ax.set_facecolor('#111827')
surface_v = velocity_field[-1, :]
ax.plot(y_positions, surface_v, color='#22c55e', linewidth=2, label='Surface velocity')
ax.fill_between(y_positions, 0, surface_v, alpha=0.2, color='#22c55e')
# Mark optimal trap zones (near banks where velocity is moderate)
optimal_mask = (surface_v > 0.2) & (surface_v < 0.6)
ax.fill_between(y_positions, 0, surface_v, where=optimal_mask,
                alpha=0.4, color='#f59e0b', label='Optimal trap zone')
ax.set_xlabel('Width position (m)', color='white')
ax.set_ylabel('Velocity (m/s)', color='white')
ax.set_title('Surface velocity across river width', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Bernoulli effect at constriction
ax = axes[1, 0]
ax.set_facecolor('#111827')
x_along = np.linspace(0, 30, 200)
# Model constriction effect on velocity
base_v = 0.4  # base velocity near bank
constriction_center = 15.0
constriction_sigma = 0.5
constriction_effect = (speed_ratio - 1) * np.exp(-(x_along - constriction_center)**2 / (2 * constriction_sigma**2))
v_along = base_v * (1 + constriction_effect)
# Bernoulli: pressure drops where velocity increases
p_along = 0.5 * 1000 * (base_v**2 - v_along**2)  # Pascals (simplified)

ax.plot(x_along, v_along, color='#22c55e', linewidth=2, label='Velocity')
ax2 = ax.twinx()
ax2.plot(x_along, p_along, color='#ef4444', linewidth=2, linestyle='--', label='Pressure change')
ax.axvline(constriction_center, color='#f59e0b', linestyle=':', alpha=0.5, label='Trap entrance')
ax.set_xlabel('Distance along river (m)', color='white')
ax.set_ylabel('Velocity (m/s)', color='#22c55e')
ax2.set_ylabel('Pressure change (Pa)', color='#ef4444')
ax.set_title('Bernoulli effect at trap constriction', color='white', fontsize=11)
ax.legend(loc='upper left', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Plot 4: Froude number along river with varying depth
ax = axes[1, 1]
ax.set_facecolor('#111827')
depths = np.linspace(0.3, 3.0, 100)
g = 9.81
v_typical = 0.8  # m/s
froude = v_typical / np.sqrt(g * depths)
ax.plot(depths, froude, color='#a855f7', linewidth=2)
ax.axhline(1.0, color='#ef4444', linestyle='--', linewidth=1, label='Fr = 1 (critical flow)')
ax.fill_between(depths, froude, 1.0, where=froude > 1, alpha=0.2, color='#ef4444', label='Supercritical')
ax.fill_between(depths, froude, 1.0, where=froude < 1, alpha=0.2, color='#3b82f6', label='Subcritical')
ax.set_xlabel('Water depth (m)', color='white')
ax.set_ylabel('Froude number', color='white')
ax.set_title('Froude number vs depth (v = 0.8 m/s)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Hydraulic analysis:")
print(f"  Max river velocity: {velocity_field.max():.2f} m/s (center, surface)")
print(f"  Constriction speed ratio: {speed_ratio:.1f}x")
print(f"  Velocity at trap entrance: {base_v * speed_ratio:.2f} m/s")
print(f"  Pressure drop at entrance: {abs(p_along.min()):.0f} Pa")
print()
print("Optimal trap placement: near-bank zone where velocity is 0.2-0.6 m/s")
print("Too fast = fish cannot enter. Too slow = fish are not moving.")
print("The Mishing people know this intuitively from generations of observation.")`,
      challenge: 'Vary the constriction width from 0.5 to 3.0 meters and plot how entrance velocity and pressure drop change. Find the constriction width that maximizes the pressure gradient (which draws fish in) without exceeding a velocity that fish can swim against (~1.0 m/s for typical river fish).',
      successHint: 'Hydraulic engineering is one of humanity\'s oldest sciences. Every irrigation canal, every dam, every fish trap embodies principles that were only formalized mathematically in the 18th century. Indigenous knowledge systems often arrive at optimal engineering solutions through empirical iteration.',
    },
    {
      title: 'Fluid dynamics of fish traps — computational flow simulation',
      concept: `To truly understand why a Mishing fish trap works, we need to simulate flow around and through the trap structure. This is **computational fluid dynamics** (CFD) in miniature.

The fundamental equation governing fluid flow is the **Navier-Stokes equation**:

rho * (du/dt + u * grad(u)) = -grad(p) + mu * laplacian(u) + f

For our purposes, we can use a simplified 2D model:
- **Potential flow**: assumes inviscid, irrotational flow. We solve Laplace's equation for the velocity potential.
- **Streamlines**: curves that are everywhere tangent to the velocity field. Fish tend to follow streamlines because swimming across them costs energy.
- **Stagnation points**: where velocity = 0. These form in front of obstacles and behind them. Fish rest at stagnation points.

A well-designed trap creates streamlines that funnel inward at the entrance and form a recirculation zone (eddy) inside. The eddy traps fish because the streamlines form a closed loop — fish following the flow go in circles instead of finding the exit.

The geometry of the trap — the funnel angle, wall spacing, interior shape — determines the flow topology and hence the trapping efficiency.`,
      analogy: 'Streamlines in a river are like lanes on a highway. Fish prefer to stay in their lane (follow streamlines) because lane changes cost energy. A fish trap is like an off-ramp that merges seamlessly with the highway — fish flow naturally into it. Inside the trap, the lanes form a roundabout with no exits. The fish keep circling, unable to find the original on-ramp.',
      storyConnection: 'The funnel shape of the Mishing trap is not arbitrary. It creates converging streamlines that guide fish inward. The wider interior creates diverging streamlines and eddies that keep fish inside. The Mishing builders did not know the word "streamline," but they understood the concept perfectly through observation of water flow around bamboo structures.',
      checkQuestion: 'If you placed a flat wall perpendicular to the current instead of a funnel-shaped entrance, what would happen to the flow field and why would it catch fewer fish?',
      checkAnswer: 'A flat wall creates a large stagnation zone in front (high pressure) that deflects fish sideways before they reach it. The flow separates at the wall edges, creating turbulent wake behind it. Fish avoid both the high-pressure zone and the turbulence. A funnel shape creates smooth, converging streamlines with gentle pressure gradients that fish can follow naturally. Shape matters as much as size.',
      codeIntro: 'Simulate 2D potential flow around a simplified fish trap geometry and visualize streamlines, velocity fields, and fish trajectories.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 2D flow simulation around a fish trap using potential flow superposition
# We model the trap as a combination of a uniform flow + source/sink pairs

# Grid
nx, ny = 150, 100
x = np.linspace(-5, 15, nx)
y = np.linspace(-5, 5, ny)
X, Y = np.meshgrid(x, y)

# Uniform flow (river current, left to right)
U_inf = 1.0

# Velocity from uniform flow
Vx_uniform = U_inf * np.ones_like(X)
Vy_uniform = np.zeros_like(Y)

# Add source-sink pairs to model trap walls
# Sources push flow outward, sinks draw flow inward
# Trap entrance: a sink that draws fish in
trap_x, trap_y = 5.0, 0.0
sink_strength = -3.0  # negative = sink

# Compute velocity field from point sink (trap entrance)
dx_sink = X - trap_x
dy_sink = Y - trap_y
r_sink = np.sqrt(dx_sink**2 + dy_sink**2)
r_sink = np.maximum(r_sink, 0.1)  # avoid singularity
Vx_sink = sink_strength * dx_sink / (2 * np.pi * r_sink**2)
Vy_sink = sink_strength * dy_sink / (2 * np.pi * r_sink**2)

# Add a weak source inside trap (models recirculation)
source_x, source_y = 7.0, 0.0
source_strength = 1.5
dx_src = X - source_x
dy_src = Y - source_y
r_src = np.sqrt(dx_src**2 + dy_src**2)
r_src = np.maximum(r_src, 0.1)
Vx_src = source_strength * dx_src / (2 * np.pi * r_src**2)
Vy_src = source_strength * dy_src / (2 * np.pi * r_src**2)

# Total velocity field
Vx = Vx_uniform + Vx_sink + Vx_src
Vy = Vy_uniform + Vy_sink + Vy_src
speed = np.sqrt(Vx**2 + Vy**2)
speed = np.clip(speed, 0, 5)  # clip for visualization

# Simulate fish trajectories through the flow field
n_fish = 15
fish_start_x = np.full(n_fish, -3.0)
fish_start_y = np.linspace(-2.5, 2.5, n_fish)
fish_paths = []

for i in range(n_fish):
    path = [(fish_start_x[i], fish_start_y[i])]
    fx, fy = fish_start_x[i], fish_start_y[i]
    for step in range(500):
        # Interpolate velocity at fish position
        xi = int((fx - x[0]) / (x[1] - x[0]))
        yi = int((fy - y[0]) / (y[1] - y[0]))
        xi = np.clip(xi, 0, nx - 2)
        yi = np.clip(yi, 0, ny - 2)

        vx = Vx[yi, xi]
        vy = Vy[yi, xi]

        # Fish follows flow + small random component
        noise_x = np.random.normal(0, 0.02)
        noise_y = np.random.normal(0, 0.02)
        dt = 0.05
        fx += (vx + noise_x) * dt
        fy += (vy + noise_y) * dt

        # Boundaries
        if fx < x[0] or fx > x[-1] or fy < y[0] or fy > y[-1]:
            break
        path.append((fx, fy))
    fish_paths.append(np.array(path))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Streamlines
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.streamplot(X, Y, Vx, Vy, color=speed, cmap='cool', density=1.5, linewidth=0.8, arrowsize=0.8)
# Draw trap outline
trap_outline_x = [4.0, 5.0, 8.0, 8.0, 5.0, 4.0]
trap_outline_y_top = [2.0, 0.5, 1.5, -1.5, -0.5, -2.0]
ax.plot(trap_outline_x[:3], trap_outline_y_top[:3], color='#f59e0b', linewidth=3, label='Trap walls')
ax.plot(trap_outline_x[3:], trap_outline_y_top[3:], color='#f59e0b', linewidth=3)
ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.set_title('Flow streamlines around fish trap', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Speed field
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.contourf(X, Y, speed, levels=20, cmap='inferno')
plt.colorbar(im, ax=ax, label='Speed (m/s)')
ax.plot(trap_outline_x[:3], trap_outline_y_top[:3], color='#22c55e', linewidth=2)
ax.plot(trap_outline_x[3:], trap_outline_y_top[3:], color='#22c55e', linewidth=2)
ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.set_title('Flow speed (high at entrance, low inside)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Fish trajectories
ax = axes[1, 0]
ax.set_facecolor('#111827')
trapped = 0
for i, path in enumerate(fish_paths):
    color = '#22c55e' if path[-1, 0] > 4.5 else '#3b82f6'
    if path[-1, 0] > 4.5 and abs(path[-1, 1]) < 2.0:
        trapped += 1
        color = '#ef4444'
    ax.plot(path[:, 0], path[:, 1], color=color, alpha=0.6, linewidth=1)
    ax.scatter(path[0, 0], path[0, 1], color='white', s=15, zorder=5)
    ax.scatter(path[-1, 0], path[-1, 1], color=color, s=25, zorder=5, marker='D')
ax.plot(trap_outline_x[:3], trap_outline_y_top[:3], color='#f59e0b', linewidth=3)
ax.plot(trap_outline_x[3:], trap_outline_y_top[3:], color='#f59e0b', linewidth=3)
ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.set_title(f'Fish trajectories ({trapped}/{n_fish} trapped)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 4: Velocity vectors near trap entrance
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Zoom into trap entrance area
mask_x = (X > 2) & (X < 9)
mask_y = (Y > -3) & (Y < 3)
mask = mask_x & mask_y
skip = 5
ax.quiver(X[::skip, ::skip], Y[::skip, ::skip],
          Vx[::skip, ::skip], Vy[::skip, ::skip],
          speed[::skip, ::skip], cmap='cool', scale=30)
ax.plot(trap_outline_x[:3], trap_outline_y_top[:3], color='#f59e0b', linewidth=3)
ax.plot(trap_outline_x[3:], trap_outline_y_top[3:], color='#f59e0b', linewidth=3)
ax.set_xlim(2, 9)
ax.set_ylim(-3, 3)
ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.set_title('Velocity vectors near trap entrance', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Fish trapping simulation:")
print(f"  {trapped} of {n_fish} fish entered the trap zone")
print(f"  Capture rate: {trapped/n_fish*100:.0f}%")
print()
print("The converging streamlines at the entrance guide fish inward.")
print("The diverging flow inside creates recirculation — fish cannot find the exit.")
print("This is the same fluid dynamics principle used in industrial cyclone separators.")`,
      challenge: 'Modify the sink/source strengths and positions to create a better trap design. Can you achieve a capture rate above 80%? What happens if you add a second sink at a different angle?',
      successHint: 'CFD is used in everything from airplane wing design to predicting blood flow in arteries. The fish trap is a beautiful entry point because the geometry is simple but the physics is real. Traditional builders optimized these shapes through iteration; modern engineers use simulation.',
    },
    {
      title: 'Indigenous knowledge systems — science before the scientific method',
      concept: `The Mishing fish trap represents **Traditional Ecological Knowledge (TEK)** — a body of observations, practices, and beliefs about the natural world that has been developed, tested, and refined over generations.

TEK is not anecdotal. It follows a rigorous process:
- **Long-term observation**: Mishing fishers observe fish behavior across decades, seasons, flood cycles, and moon phases. This is longitudinal data collection that no academic study can match.
- **Hypothesis testing**: "If I angle the trap entrance 30 degrees, will I catch more fish?" This is tested, and the result is incorporated into practice or discarded.
- **Peer review**: Knowledge is shared within the community. Ineffective techniques die out. Effective ones are taught to the next generation.
- **Adaptive management**: Practices change in response to environmental shifts — different traps for different seasons, different river conditions, different target species.

The key difference from Western science is not rigor but **codification**. TEK is transmitted orally, through practice, and through cultural ritual. It is not written in journals. This makes it vulnerable to loss when communities are displaced or when young people leave traditional livelihoods.

**Ethnobiology** is the academic field that documents and validates TEK, finding that indigenous knowledge often aligns with — and sometimes exceeds — scientific understanding.`,
      analogy: 'TEK is like an open-source software project with a 10,000-year commit history but no version control system. Every generation adds improvements, but the changelog is stored in human memory, songs, and rituals rather than in a repository. When a community is disrupted, it is like losing the entire git history — the latest release still exists, but the reasoning behind every decision is gone.',
      storyConnection: 'The Mishing fish trap is not just a tool — it is a codification of centuries of ecological knowledge in bamboo and rattan. The angle of the funnel encodes knowledge about fish behavior. The mesh size encodes knowledge about target species. The placement season encodes knowledge about migration patterns. Every design choice is a data point from generations of observation.',
      checkQuestion: 'A government agency proposes replacing traditional Mishing fish traps with modern net fishing because nets are "more efficient." What might be lost, and how could you quantify it?',
      checkAnswer: 'Traditional traps are inherently selective — mesh size and entrance geometry target specific species and size classes, allowing juveniles and non-target species to escape. Nets are less selective and can cause overfishing. You could quantify this by comparing bycatch rates, juvenile mortality, species diversity in catch, and long-term fish population stability between the two methods. The "efficient" method might be sustainable, while the "more efficient" one might collapse the fishery within a decade.',
      codeIntro: 'Build a model comparing traditional selective harvesting vs. modern non-selective harvesting and their long-term effects on fish populations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Compare selective (traditional) vs non-selective (modern) harvesting
# on a fish population over 50 years

n_years = 50
n_species = 4
species_names = ['Target catfish', 'Small minnow', 'Juvenile catfish', 'River shrimp']
initial_pop = np.array([1000, 5000, 2000, 3000], dtype=float)

# Growth rates (logistic)
r = np.array([0.3, 0.8, 0.5, 0.6])  # intrinsic growth rate
K = np.array([5000, 20000, 5000, 10000], dtype=float)  # carrying capacity

# Interaction matrix: species affect each other
# Positive = benefits from other species; negative = competition/predation
interactions = np.array([
    [0, 0.01, -0.02, 0.005],    # catfish eats minnows, competes with juveniles
    [-0.005, 0, 0.002, 0.001],  # minnows: preyed on by catfish
    [0.03, 0.005, 0, 0.001],    # juveniles grow into adults
    [0.001, 0.002, 0.001, 0],   # shrimp: weakly affected
])

def simulate_harvest(initial, harvest_rates, years):
    """Simulate population dynamics with harvesting."""
    pop = np.zeros((years, len(initial)))
    pop[0] = initial.copy()

    for t in range(1, years):
        for i in range(len(initial)):
            # Logistic growth
            growth = r[i] * pop[t-1, i] * (1 - pop[t-1, i] / K[i])

            # Species interactions
            interaction_effect = 0
            for j in range(len(initial)):
                if i != j:
                    interaction_effect += interactions[i, j] * pop[t-1, j]

            # Harvest
            harvested = harvest_rates[i] * pop[t-1, i]

            pop[t, i] = max(pop[t-1, i] + growth + interaction_effect - harvested, 0)

    return pop

# Traditional harvesting: selective — only target species (adult catfish)
traditional_rates = np.array([0.15, 0.0, 0.0, 0.01])  # only harvest adults + some shrimp

# Modern net harvesting: non-selective — catches everything
modern_rates = np.array([0.15, 0.08, 0.10, 0.05])  # same total effort, spread across species

# Intensive modern: higher total harvest
intensive_rates = np.array([0.25, 0.12, 0.15, 0.08])

pop_trad = simulate_harvest(initial_pop, traditional_rates, n_years)
pop_modern = simulate_harvest(initial_pop, modern_rates, n_years)
pop_intensive = simulate_harvest(initial_pop, intensive_rates, n_years)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']

# Plot 1: Traditional harvesting
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i in range(n_species):
    ax.plot(range(n_years), pop_trad[:, i], color=colors[i], linewidth=2, label=species_names[i])
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Traditional selective harvesting', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Modern non-selective
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i in range(n_species):
    ax.plot(range(n_years), pop_modern[:, i], color=colors[i], linewidth=2, label=species_names[i])
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Modern non-selective harvesting', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Intensive modern
ax = axes[1, 0]
ax.set_facecolor('#111827')
for i in range(n_species):
    ax.plot(range(n_years), pop_intensive[:, i], color=colors[i], linewidth=2, label=species_names[i])
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Intensive non-selective harvesting', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Biodiversity comparison (Shannon diversity index)
ax = axes[1, 1]
ax.set_facecolor('#111827')

def shannon_diversity(pop_row):
    total = pop_row.sum()
    if total == 0:
        return 0
    proportions = pop_row / total
    proportions = proportions[proportions > 0]
    return -np.sum(proportions * np.log(proportions))

div_trad = [shannon_diversity(pop_trad[t]) for t in range(n_years)]
div_modern = [shannon_diversity(pop_modern[t]) for t in range(n_years)]
div_intensive = [shannon_diversity(pop_intensive[t]) for t in range(n_years)]

ax.plot(range(n_years), div_trad, color='#22c55e', linewidth=2, label='Traditional')
ax.plot(range(n_years), div_modern, color='#f59e0b', linewidth=2, label='Modern')
ax.plot(range(n_years), div_intensive, color='#ef4444', linewidth=2, label='Intensive')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Shannon diversity index', color='white')
ax.set_title('Biodiversity over time', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Summary statistics
print("Population at year 50:")
print(f"{'Species':<20} {'Traditional':>12} {'Modern':>12} {'Intensive':>12}")
print("-" * 58)
for i in range(n_species):
    print(f"{species_names[i]:<20} {pop_trad[-1, i]:>12.0f} {pop_modern[-1, i]:>12.0f} {pop_intensive[-1, i]:>12.0f}")
print("-" * 58)
print(f"{'Total biomass':<20} {pop_trad[-1].sum():>12.0f} {pop_modern[-1].sum():>12.0f} {pop_intensive[-1].sum():>12.0f}")
print(f"{'Shannon diversity':<20} {div_trad[-1]:>12.2f} {div_modern[-1]:>12.2f} {div_intensive[-1]:>12.2f}")
print()
print("Traditional selective harvesting maintains higher biodiversity")
print("because it targets only adult fish, allowing juveniles and")
print("non-target species to sustain the ecosystem.")`,
      challenge: 'Add a "collapse threshold" — if any species drops below 100 individuals, it goes locally extinct (set to 0). How many years until the first extinction under each harvesting strategy?',
      successHint: 'The lesson here is profound: "more efficient" harvesting can destroy the resource it depends on. Traditional knowledge systems often encode sustainability constraints that modern optimization ignores. The Mishing trap is not just a fishing tool — it is a conservation technology.',
    },
    {
      title: 'Sustainable aquaculture — balancing yield and ecosystem health',
      concept: `Aquaculture is the farming of aquatic organisms — fish, shrimp, shellfish, algae. It now produces more food fish than wild capture. But sustainability is the central challenge.

**Key aquaculture parameters**:

- **Stocking density**: fish per cubic meter. Too low = wasted space. Too high = stress, disease, poor water quality, stunted growth. The optimal density depends on species, water flow, and feed availability.
- **Feed conversion ratio (FCR)**: kg of feed per kg of fish growth. FCR = 1.5 means 1.5 kg of feed produces 1 kg of fish. Lower is better. Salmon FCR ~ 1.2, catfish ~ 1.8, shrimp ~ 2.5.
- **Carrying capacity**: the maximum biomass a water body can sustain. Determined by dissolved oxygen, ammonia removal rate, and water exchange.
- **Growth model**: fish growth follows a sigmoid (S-shaped) curve described by the **von Bertalanffy growth function**:

  L(t) = L_inf * (1 - exp(-K * (t - t0)))

  where L_inf is maximum length, K is growth rate, t0 is theoretical age at zero length.

- **Dissolved oxygen (DO)**: fish need > 5 mg/L. At high stocking density, metabolic demand depletes DO faster than it can be replenished.

The Mishing approach to fish management is essentially low-intensity aquaculture: managing wild fish through habitat manipulation (trap placement, seasonal restrictions) rather than intensive farming.`,
      analogy: 'Stocking density in a fish pond is like student density in a classroom. A few students in a large room — no problems, but expensive per student. Pack 100 students into a small room — air quality drops, noise increases, individual attention disappears, and learning (growth) suffers. There is an optimal class size that maximizes learning per dollar, just as there is an optimal stocking density that maximizes fish yield per pond.',
      storyConnection: 'The Mishing people manage their fisheries by controlling when and where they fish, not by building ponds. This is extensive management — using the entire river as a "pond" and the trap as a selective harvesting tool. Modern aquaculture is intensive management — controlling every parameter in a small space. Both have trade-offs. The Mishing approach is lower yield but self-sustaining.',
      checkQuestion: 'A fish farmer doubles the stocking density to double production. Feed costs double. But fish growth rate drops by 40% due to stress. Did the farmer actually increase production?',
      checkAnswer: 'No. Production = stocking density x growth rate. If density doubles (2x) but growth drops by 40% (0.6x), production is 2 x 0.6 = 1.2x — only a 20% increase. But feed costs doubled (2x), so cost per kg of fish increased by 2/1.2 = 1.67x. The farmer is producing slightly more fish at much higher cost. This is the diminishing returns trap in intensive aquaculture.',
      codeIntro: 'Model fish growth and pond carrying capacity to find the optimal stocking density that maximizes yield.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Von Bertalanffy growth model for a fish species
L_inf = 40.0     # maximum length (cm)
K_growth = 0.3   # growth rate coefficient
t0 = -0.5        # theoretical age at zero length
weight_coeff = 0.012  # length-weight relationship: W = a * L^b
weight_exp = 3.0

def fish_length(t):
    """Von Bertalanffy growth function."""
    return L_inf * (1 - np.exp(-K_growth * (t - t0)))

def fish_weight(length):
    """Length-weight relationship (isometric growth)."""
    return weight_coeff * length**weight_exp

# Carrying capacity model
pond_volume = 1000  # cubic meters
DO_supply_rate = 50.0  # mg/L/day (from aeration + photosynthesis)
DO_minimum = 5.0  # mg/L minimum for fish
DO_demand_per_kg = 0.5  # mg/L/day per kg of fish biomass

# FCR model (increases with density due to stress)
base_fcr = 1.5
fcr_density_factor = 0.3  # FCR increases by this per fish/m3

# Simulate different stocking densities
densities = np.arange(0.5, 20.5, 0.5)  # fish per m3
grow_months = 12
time = np.linspace(0, grow_months / 12 * 3, 100)  # in years

# For each density, simulate growth and yield
final_yields = []
final_fcrs = []
final_dos = []
costs = []
profits = []

fish_price_per_kg = 5.0  # $/kg
feed_price_per_kg = 1.5  # $/kg

for density in densities:
    n_fish = density * pond_volume

    # Stress reduces growth rate
    stress_factor = max(0.2, 1.0 - 0.04 * density)  # linear decline
    effective_K = K_growth * stress_factor

    # Growth with stress
    L_t = L_inf * (1 - np.exp(-effective_K * (time - t0)))
    W_t = weight_coeff * np.clip(L_t, 0, None)**weight_exp

    # Final weight per fish
    final_weight = W_t[-1] / 1000  # kg
    total_biomass = n_fish * final_weight  # kg
    biomass_per_m3 = total_biomass / pond_volume

    # DO check
    do_demand = biomass_per_m3 * DO_demand_per_kg
    do_available = DO_supply_rate - do_demand
    final_dos.append(max(do_available, 0))

    # Mortality from low DO
    if do_available < DO_minimum:
        mortality = min(0.5, (DO_minimum - do_available) / DO_minimum)
        total_biomass *= (1 - mortality)

    # FCR
    fcr = base_fcr + fcr_density_factor * density
    final_fcrs.append(fcr)

    # Economics
    total_feed = total_biomass * fcr
    total_cost = total_feed * feed_price_per_kg
    revenue = total_biomass * fish_price_per_kg
    profit = revenue - total_cost

    final_yields.append(total_biomass)
    costs.append(total_cost)
    profits.append(profit)

final_yields = np.array(final_yields)
profits = np.array(profits)

# Find optima
best_yield_idx = np.argmax(final_yields)
best_profit_idx = np.argmax(profits)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Von Bertalanffy growth curves at different densities
ax = axes[0, 0]
ax.set_facecolor('#111827')
for d, color in [(1, '#22c55e'), (5, '#3b82f6'), (10, '#f59e0b'), (15, '#ef4444')]:
    sf = max(0.2, 1.0 - 0.04 * d)
    L = L_inf * (1 - np.exp(-(K_growth * sf) * (time - t0)))
    W = weight_coeff * np.clip(L, 0, None)**weight_exp
    ax.plot(time * 12, W, color=color, linewidth=2, label=f'{d} fish/m3')
ax.set_xlabel('Months', color='white')
ax.set_ylabel('Weight (g)', color='white')
ax.set_title('Growth curves by stocking density', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Total yield vs density
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(densities, final_yields, color='#22c55e', linewidth=2)
ax.axvline(densities[best_yield_idx], color='#f59e0b', linestyle='--',
           label=f'Max yield at {densities[best_yield_idx]:.0f}/m3')
ax.scatter([densities[best_yield_idx]], [final_yields[best_yield_idx]],
           color='#f59e0b', s=100, zorder=5)
ax.set_xlabel('Stocking density (fish/m3)', color='white')
ax.set_ylabel('Total yield (kg)', color='white')
ax.set_title('Yield vs stocking density', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Profit vs density
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(densities, profits, color='#a855f7', linewidth=2)
ax.axvline(densities[best_profit_idx], color='#f59e0b', linestyle='--',
           label=f'Max profit at {densities[best_profit_idx]:.0f}/m3')
ax.axhline(0, color='gray', linestyle=':', linewidth=1)
ax.scatter([densities[best_profit_idx]], [profits[best_profit_idx]],
           color='#f59e0b', s=100, zorder=5)
ax.set_xlabel('Stocking density (fish/m3)', color='white')
ax.set_ylabel('Profit ($)', color='white')
ax.set_title('Profit vs stocking density', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: FCR vs density
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(densities, final_fcrs, color='#ef4444', linewidth=2)
ax.set_xlabel('Stocking density (fish/m3)', color='white')
ax.set_ylabel('Feed conversion ratio', color='white')
ax.set_title('FCR increases with density (stress)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 5: Dissolved oxygen
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(densities, final_dos, color='#3b82f6', linewidth=2)
ax.axhline(DO_minimum, color='#ef4444', linestyle='--', label=f'DO minimum ({DO_minimum} mg/L)')
ax.fill_between(densities, 0, final_dos, where=np.array(final_dos) < DO_minimum,
                alpha=0.3, color='#ef4444', label='Danger zone')
ax.set_xlabel('Stocking density (fish/m3)', color='white')
ax.set_ylabel('Available DO (mg/L)', color='white')
ax.set_title('Dissolved oxygen vs density', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Summary comparison
ax = axes[1, 2]
ax.set_facecolor('#111827')
categories = ['Max Yield\\nDensity', 'Max Profit\\nDensity']
vals = [densities[best_yield_idx], densities[best_profit_idx]]
bars = ax.bar(categories, vals, color=['#22c55e', '#a855f7'], edgecolor='none', width=0.5)
for bar, v in zip(bars, vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
            f'{v:.0f}/m3', ha='center', color='white', fontsize=12, fontweight='bold')
ax.set_ylabel('Optimal density (fish/m3)', color='white')
ax.set_title('Max yield != max profit', color='white', fontsize=10)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Optimal stocking density for max yield:  {densities[best_yield_idx]:.0f} fish/m3 ({final_yields[best_yield_idx]:.0f} kg)")
print(f"Optimal stocking density for max profit: {densities[best_profit_idx]:.0f} fish/m3 (\{profits[best_profit_idx]:.0f})")
print(f"Max yield density FCR: {final_fcrs[best_yield_idx]:.1f}")
print(f"Max profit density FCR: {final_fcrs[best_profit_idx]:.1f}")
print()
print("Key insight: maximum yield and maximum profit occur at different densities.")
print("Pushing for maximum yield wastes feed and stresses fish.")
print("The economically optimal point is always lower than the biological maximum.")`,
      challenge: 'Add a "disease outbreak" probability that increases with stocking density (e.g., 2% per fish/m3). When disease strikes, 30% of fish die. Run 100 Monte Carlo simulations and compare expected profit at different densities. How does disease risk change the optimal density?',
      successHint: 'This is operations research applied to biology. The same optimization framework works for any farming system: maximize output subject to resource constraints and diminishing returns. The Mishing approach of low-density, selective harvesting naturally avoids the diminishing-returns trap.',
    },
    {
      title: 'Optimal foraging theory — the economics of eating',
      concept: `**Optimal foraging theory (OFT)** applies economic optimization to animal feeding behavior. It predicts that natural selection favors animals that maximize energy intake per unit time.

The core model is the **prey model** (also called the diet breadth model):

For each prey type i:
- **e_i**: energy gained from consuming it (calories)
- **h_i**: handling time (time to catch, subdue, eat, and digest)
- **lambda_i**: encounter rate (how often you find it)

The **profitability** of prey type i is: e_i / h_i (energy per unit handling time)

The optimal diet rule: rank prey by profitability. Add prey types to the diet starting from the most profitable. Keep adding types until the marginal type reduces the overall intake rate.

Mathematically, include prey type k if:
e_k / h_k > sum(lambda_i * e_i) / (1 + sum(lambda_i * h_i))

for all types i already in the diet.

**Key predictions of OFT**:
- Animals should be more selective when food is abundant (why eat low-quality food when high-quality food is common?)
- Specialization increases when high-quality prey is common
- Diet breadth expands when food is scarce
- Prey size preference depends on handling time, not just energy

This theory also explains why fish enter traps — the trap offers an energy-efficient resting spot (low cost) that appears to have food potential.`,
      analogy: 'OFT is like a consultant optimizing a restaurant menu. Each dish has a preparation time (handling time) and a profit margin (energy value). The optimal menu includes only dishes where the profit-per-minute exceeds the restaurant average. A dish that takes 2 hours but earns $5 should be dropped — even if it is delicious. Animals make the same calculation instinctively.',
      storyConnection: 'The Mishing people place bait in their traps — not randomly, but specifically chosen to match the target species diet. They know that catfish prefer decomposing organic matter, while mahseer prefer river insects. This is applied optimal foraging theory: make the trap more "profitable" than natural foraging options, and fish will enter voluntarily.',
      checkQuestion: 'According to OFT, a predator ignores a small but abundant prey item. Then the abundance of its preferred large prey drops. What happens to the predator\'s diet?',
      checkAnswer: 'The predator starts eating the small prey. When the preferred prey becomes rare, encounter rate drops, reducing the overall energy intake rate. The small prey, previously below the profitability threshold, now exceeds it because the "baseline" intake rate has dropped. Diet breadth expands when preferred food is scarce. This is called the "hunger broadens the diet" prediction and has been confirmed in many species.',
      codeIntro: 'Implement the optimal foraging prey model and simulate how diet breadth changes with prey availability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Define prey types available to a river fish
prey_types = {
    'Insect larvae': {'energy': 8, 'handling_time': 0.5, 'base_encounter': 3.0},
    'Small shrimp': {'energy': 15, 'handling_time': 1.0, 'base_encounter': 1.5},
    'Worm': {'energy': 12, 'handling_time': 0.8, 'base_encounter': 2.0},
    'Small fish': {'energy': 40, 'handling_time': 3.0, 'base_encounter': 0.5},
    'Snail': {'energy': 6, 'handling_time': 2.0, 'base_encounter': 2.5},
    'Algae clump': {'energy': 3, 'handling_time': 0.3, 'base_encounter': 5.0},
}

names = list(prey_types.keys())
energies = np.array([prey_types[n]['energy'] for n in names])
handling = np.array([prey_types[n]['handling_time'] for n in names])
base_encounters = np.array([prey_types[n]['base_encounter'] for n in names])

# Profitability ranking
profitability = energies / handling
rank_order = np.argsort(-profitability)  # descending

print("Prey profitability ranking:")
print(f"{'Rank':<6} {'Prey':<18} {'Energy':<10} {'Handling':<12} {'Profitability':<14}")
print("-" * 60)
for rank, idx in enumerate(rank_order):
    print(f"{rank+1:<6} {names[idx]:<18} {energies[idx]:<10.1f} {handling[idx]:<12.1f} {profitability[idx]:<14.1f}")

def optimal_diet(encounters, energies, handling):
    """Determine optimal diet using the prey model."""
    prof = energies / handling
    ranked = np.argsort(-prof)

    included = []
    for k_pos in range(len(ranked)):
        k = ranked[k_pos]
        # Calculate intake rate with current diet
        if len(included) == 0:
            included.append(k)
            continue

        # Check if adding prey type k improves intake rate
        num = sum(encounters[i] * energies[i] for i in included)
        den = 1 + sum(encounters[i] * handling[i] for i in included)
        current_rate = num / den

        if prof[k] > current_rate:
            included.append(k)
        # Once we reject one, we reject all lower-ranked types too
        else:
            break

    return included

# Simulate diet breadth across different abundance levels
abundance_multipliers = np.linspace(0.1, 3.0, 50)
diet_breadths = []
intake_rates = []

for mult in abundance_multipliers:
    encounters = base_encounters * mult
    diet = optimal_diet(encounters, energies, handling)
    diet_breadths.append(len(diet))

    # Calculate actual intake rate
    num = sum(encounters[i] * energies[i] for i in diet)
    den = 1 + sum(encounters[i] * handling[i] for i in diet)
    intake_rates.append(num / den)

# Simulate: what if we remove the best prey?
scenarios = [
    ('All prey available', base_encounters),
    ('No small fish', base_encounters * np.array([1, 1, 1, 0, 1, 1])),
    ('Only insects + algae', base_encounters * np.array([1, 0, 0, 0, 0, 1])),
    ('Half abundance', base_encounters * 0.5),
]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Profitability bar chart
ax = axes[0, 0]
ax.set_facecolor('#111827')
sorted_names = [names[i] for i in rank_order]
sorted_prof = profitability[rank_order]
colors_bar = ['#22c55e' if p > 10 else '#f59e0b' if p > 5 else '#ef4444' for p in sorted_prof]
ax.barh(range(len(names)), sorted_prof, color=colors_bar, edgecolor='none')
ax.set_yticks(range(len(names)))
ax.set_yticklabels(sorted_names, color='white', fontsize=9)
ax.set_xlabel('Profitability (energy / handling time)', color='white')
ax.set_title('Prey profitability ranking', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 2: Diet breadth vs abundance
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(abundance_multipliers, diet_breadths, color='#a855f7', linewidth=2, marker='o', markersize=3)
ax.set_xlabel('Prey abundance multiplier', color='white')
ax.set_ylabel('Number of prey types in diet', color='white')
ax.set_title('Diet breadth vs food abundance', color='white', fontsize=11)
ax.set_ylim(0, len(names) + 1)
ax.tick_params(colors='gray')

# Plot 3: Intake rate vs abundance
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(abundance_multipliers, intake_rates, color='#22c55e', linewidth=2)
ax.set_xlabel('Prey abundance multiplier', color='white')
ax.set_ylabel('Energy intake rate (cal/time)', color='white')
ax.set_title('Intake rate vs food abundance', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 4: Scenario comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
scenario_names = []
scenario_rates = []
scenario_diets = []
for name_s, enc in scenarios:
    diet = optimal_diet(enc, energies, handling)
    num = sum(enc[i] * energies[i] for i in diet)
    den = 1 + sum(enc[i] * handling[i] for i in diet)
    scenario_names.append(name_s)
    scenario_rates.append(num / den)
    scenario_diets.append(len(diet))

x_pos = range(len(scenarios))
bars = ax.bar(x_pos, scenario_rates, color='#3b82f6', edgecolor='none', width=0.6)
for bar, rate, breadth in zip(bars, scenario_rates, scenario_diets):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{rate:.1f}\\n({breadth} types)', ha='center', color='white', fontsize=9)
ax.set_xticks(x_pos)
ax.set_xticklabels(scenario_names, color='white', fontsize=8, rotation=15)
ax.set_ylabel('Intake rate', color='white')
ax.set_title('Scenario comparison', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print()
print("Key OFT predictions confirmed:")
print("1. Diet narrows when food is abundant (specialists)")
print("2. Diet broadens when food is scarce (generalists)")
print("3. Removing the top prey type forces diet expansion")
print("4. Profitability (energy/handling) determines inclusion, not energy alone")`,
      challenge: 'Add a "trap bait" prey type with very high energy but zero handling time (it is just sitting there). How does this distort the optimal diet? This models why fish enter traps — the bait offers an irresistible profitability ratio.',
      successHint: 'Optimal foraging theory connects ecology to economics. The same mathematical framework describes a fish choosing prey, a bee choosing flowers, and a shopper choosing groceries. Understanding these decision rules lets us design traps, manage fisheries, and predict how animals respond to environmental change.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Computational Biologist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology & engineering fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real biological modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            />
        ))}
      </div>
    </div>
  );
}
