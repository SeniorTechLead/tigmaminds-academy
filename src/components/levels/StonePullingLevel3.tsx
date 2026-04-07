import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function StonePullingLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Newton\'s Second Law — acceleration and dynamics of the pull',
      concept: `So far we have analyzed stone-pulling at constant velocity (equilibrium). But real stone-pulling involves **acceleration** — starting from rest, speeding up, slowing down, and stopping.

**Newton's Second Law**: F_net = ma

For the stone on a ramp:
**ma = F_pull - mg×sin(θ) - μ×mg×cos(θ)**

Rearranging:
**a = (F_pull - mg×sin(θ) - μ×mg×cos(θ)) / m**

The pull force varies as people join, tire, and rest. The acceleration changes moment to moment, making this a **differential equation** that must be solved numerically.

📚 *Numerical integration with Euler's method: v(t+dt) = v(t) + a(t)×dt and x(t+dt) = x(t) + v(t)×dt. Small dt gives better accuracy.*`,
      analogy: 'Imagine pushing a shopping cart. At first you push hard and it accelerates. Then you match friction force and it moves at constant speed. If you push less, it slows down. The stone experiences exactly this — a dynamic balance of pulling force, gravity, and friction that changes throughout the ceremony.',
      storyConnection: 'The rhythmic chanting of the Naga stone-pullers is not just ceremonial — it synchronizes the pull. A coordinated surge overcomes static friction and accelerates the stone. Then the team settles into a rhythm that maintains constant velocity. Understanding the dynamics explains why coordination matters more than raw strength.',
      checkQuestion: 'Why is more force needed to START the stone than to KEEP it moving?',
      checkAnswer: 'Static friction coefficient (μ_s ≈ 0.6-0.8) is higher than kinetic friction coefficient (μ_k ≈ 0.4-0.6). Additionally, the stone may have settled into the ground, creating extra resistance. The initial surge must overcome both static friction AND provide acceleration. Once moving, only kinetic friction and gravity component need to be overcome for constant velocity.',
      codeIntro: 'Simulate the dynamics of a stone-pulling event with realistic force variations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

mass = 5000; g = 9.81
theta = np.radians(8); mu_s = 0.15; mu_k = 0.10  # rollers
distance_total = 200  # meters

# Simulate time-varying pull force
dt = 0.1  # seconds
t_max = 600  # 10 minutes max
times = np.arange(0, t_max, dt)
n = len(times)

# Pull force model: coordinated surges with fatigue
def pull_force(t, n_people=60):
    base = n_people * 250  # base force per person
    # Rhythmic surging (every ~10 seconds, synchronized pull)
    surge = 1 + 0.3 * np.sin(2 * np.pi * t / 10)
    # Fatigue over time
    fatigue = np.exp(-t / 1200)  # half-power at ~14 minutes
    # Startup ramp (people joining)
    ramp = min(1, t / 15)  # 15 seconds to reach full pull
    return base * surge * fatigue * ramp

# Numerical integration
velocity = np.zeros(n)
position = np.zeros(n)
accel = np.zeros(n)
forces = np.zeros(n)

moving = False
for i in range(1, n):
    F_pull = pull_force(times[i])
    forces[i] = F_pull
    F_gravity = mass * g * np.sin(theta)

    if not moving:
        F_friction = mu_s * mass * g * np.cos(theta)
        if F_pull > F_gravity + F_friction:
            moving = True
    if moving:
        F_friction = mu_k * mass * g * np.cos(theta)

    F_net = F_pull - F_gravity - F_friction if moving else 0
    a = F_net / mass
    accel[i] = a
    velocity[i] = max(0, velocity[i-1] + a * dt)
    position[i] = position[i-1] + velocity[i] * dt

    if position[i] >= distance_total:
        position[i:] = distance_total
        break

# Trim to relevant time
end_idx = np.searchsorted(position, distance_total)
end_idx = min(end_idx + 50, n)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

t_plot = times[:end_idx]

axes[0,0].plot(t_plot, forces[:end_idx]/1000, color='#f59e0b', linewidth=1, alpha=0.8)
threshold = (mass*g*np.sin(theta) + mu_s*mass*g*np.cos(theta))/1000
axes[0,0].axhline(y=threshold, color='#f87171', linestyle='--', alpha=0.7, label=f'Static friction threshold')
axes[0,0].set_ylabel('Pull Force (kN)', color='white', fontsize=10)
axes[0,0].set_title('Applied Force', color='white', fontsize=12, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

axes[0,1].plot(t_plot, accel[:end_idx], color='#a78bfa', linewidth=1)
axes[0,1].axhline(y=0, color='white', linestyle=':', alpha=0.3)
axes[0,1].set_ylabel('Acceleration (m/s²)', color='white', fontsize=10)
axes[0,1].set_title('Acceleration', color='white', fontsize=12, fontweight='bold')

axes[1,0].plot(t_plot, velocity[:end_idx]*3.6, color='#10b981', linewidth=2)
axes[1,0].set_ylabel('Speed (km/h)', color='white', fontsize=10)
axes[1,0].set_title('Velocity', color='white', fontsize=12, fontweight='bold')

axes[1,1].plot(t_plot, position[:end_idx], color='#60a5fa', linewidth=2)
axes[1,1].axhline(y=distance_total, color='white', linestyle=':', alpha=0.3)
axes[1,1].set_ylabel('Position (m)', color='white', fontsize=10)
axes[1,1].set_title('Distance Covered', color='white', fontsize=12, fontweight='bold')

for ax in axes[1,:]: ax.set_xlabel('Time (s)', color='white', fontsize=10)

plt.suptitle('Stone-Pulling Dynamics — Numerical Simulation', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

completion_time = times[min(np.searchsorted(position, distance_total), n-1)]
max_speed = np.max(velocity) * 3.6
avg_speed = distance_total / completion_time * 3.6 if completion_time > 0 else 0
print(f"Results: {distance_total}m in {completion_time:.0f}s ({completion_time/60:.1f} min)")
print(f"Max speed: {max_speed:.2f} km/h | Avg speed: {avg_speed:.2f} km/h")
print(f"Static friction overcome at t ≈ {times[np.argmax(velocity > 0)]:.1f}s")`,
      challenge: 'Model a "stall" event where the team loses coordination at t=200s (force drops to 60% for 30 seconds). Does the stone stop? How long to recover?',
      successHint: 'You have simulated the full dynamics of stone-pulling including startup, acceleration, steady state, and fatigue. This is how engineers model any force-driven motion problem.',
    },
    {
      title: 'Energy conservation — tracking every joule',
      concept: `The **conservation of energy** states that total energy never changes — it only transforms between forms:

**KE + PE + W_friction = W_input**

Where:
- KE = ½mv² (kinetic energy)
- PE = mgh (gravitational potential energy)
- W_friction = energy lost to heat
- W_input = work done by pullers

At any moment:
**W_input = ΔKE + ΔPE + W_friction**

This is a powerful diagnostic tool. If the stone is moving slowly despite high input power, the energy must be going somewhere — usually friction. By tracking energy flows, we can identify inefficiencies.

📚 *Cumulative sums (np.cumsum) track running totals over time — perfect for tracking energy accumulation.*`,
      analogy: 'Energy accounting is like financial accounting. Income (work input from pullers) must equal the sum of savings (potential energy), current spending (kinetic energy), and waste (friction heat). If the books do not balance, something is wrong with the model. Conservation of energy is nature\'s accounting rule — the books ALWAYS balance.',
      storyConnection: 'Every drop of sweat, every grain of rice consumed at the feast — it all converts to energy that either raises the stone, moves it forward, or is lost to friction. Energy conservation connects the community\'s physical effort to the physics of motion in a profound way.',
      checkQuestion: 'At the end of the pull, the stone is at rest at its destination. Where did all the kinetic energy go?',
      checkAnswer: 'When the stone decelerates to a stop, the kinetic energy is converted to heat through friction between the stone/rollers and the ground. You could, in principle, measure a very slight temperature increase in the contact surfaces. Some energy also goes into sound (the scraping/grinding noise) and deformation of the ground. The final state has all input energy stored as potential energy (height gained) plus heat (friction losses).',
      codeIntro: 'Build a complete energy flow diagram for the stone-pulling process.',
      code: `import numpy as np
import matplotlib.pyplot as plt

mass = 5000; g = 9.81; theta = np.radians(8); mu_k = 0.10
dt = 0.1; n_people = 60

# Simulate the pull
t_max = 400
times = np.arange(0, t_max, dt)
n = len(times)

pull_per_person = 280  # N average
force_applied = np.array([n_people * pull_per_person * min(1, t/10) * np.exp(-t/800)
                          for t in times])

velocity = np.zeros(n)
position = np.zeros(n)

F_grav = mass * g * np.sin(theta)
F_fric_base = mu_k * mass * g * np.cos(theta)

for i in range(1, n):
    F_net = force_applied[i] - F_grav - F_fric_base
    a = F_net / mass
    velocity[i] = max(0, velocity[i-1] + a * dt)
    position[i] = position[i-1] + velocity[i] * dt

# Energy calculations
height = position * np.sin(theta)
KE = 0.5 * mass * velocity**2
PE = mass * g * height
W_friction = np.cumsum(F_fric_base * velocity * dt)
W_input = np.cumsum(force_applied * velocity * dt)

# Energy balance check
E_total = KE + PE + W_friction
error = np.abs(W_input - E_total)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Energy stacked area
axes[0,0].fill_between(times, 0, KE/1000, alpha=0.7, color='#f59e0b', label='Kinetic Energy')
axes[0,0].fill_between(times, KE/1000, (KE+PE)/1000, alpha=0.7, color='#10b981', label='Potential Energy')
axes[0,0].fill_between(times, (KE+PE)/1000, (KE+PE+W_friction)/1000, alpha=0.7, color='#f87171', label='Friction Heat')
axes[0,0].plot(times, W_input/1000, 'w--', linewidth=2, label='Total Input Work')
axes[0,0].set_ylabel('Energy (kJ)', color='white', fontsize=10)
axes[0,0].set_title('Energy Flow Over Time', color='white', fontsize=12, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Instantaneous power
P_input = force_applied * velocity / 1000  # kW
P_gravity = F_grav * velocity / 1000
P_friction = F_fric_base * velocity / 1000
P_accel = np.gradient(KE, dt) / 1000

axes[0,1].plot(times, P_input, color='white', linewidth=2, label='Input power')
axes[0,1].fill_between(times, 0, P_gravity, alpha=0.5, color='#10b981', label='→ Gravity')
axes[0,1].fill_between(times, P_gravity, P_gravity + P_friction, alpha=0.5, color='#f87171', label='→ Friction')
axes[0,1].set_ylabel('Power (kW)', color='white', fontsize=10)
axes[0,1].set_title('Power Distribution', color='white', fontsize=12, fontweight='bold')
axes[0,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Final energy pie chart
final_KE = KE[-1]; final_PE = PE[-1]; final_fric = W_friction[-1]
total = final_KE + final_PE + final_fric
sizes = [final_PE, final_fric, final_KE]
labels = [f'Potential Energy\\\n{final_PE/1000:.1f} kJ ({final_PE/total*100:.1f}%)',
          f'Friction Losses\\\n{final_fric/1000:.1f} kJ ({final_fric/total*100:.1f}%)',
          f'Kinetic Energy\\\n{final_KE/1000:.1f} kJ ({final_KE/total*100:.1f}%)']
pie_colors = ['#10b981', '#f87171', '#f59e0b']
axes[1,0].pie(sizes, labels=labels, colors=pie_colors, textprops={'color':'white', 'fontsize':9},
              startangle=90, labeldistance=1.2)
axes[1,0].set_title('Final Energy Distribution', color='white', fontsize=12, fontweight='bold')

# Energy conservation check
axes[1,1].plot(times, error, color='#a78bfa', linewidth=1.5)
axes[1,1].set_ylabel('Energy Balance Error (J)', color='white', fontsize=10)
axes[1,1].set_xlabel('Time (s)', color='white', fontsize=10)
axes[1,1].set_title('Conservation Check (should be ~0)', color='white', fontsize=12, fontweight='bold')

for ax in axes[0,:]: ax.set_xlabel('Time (s)', color='white', fontsize=10)
axes[1,1].set_xlabel('Time (s)', color='white', fontsize=10)

plt.suptitle('Complete Energy Analysis — Stone Pull', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print(f"Final state (t = {t_max}s):")
print(f"  Distance: {position[-1]:.1f} m | Height: {height[-1]:.1f} m | Speed: {velocity[-1]*3.6:.2f} km/h")
print(f"  Input work: {W_input[-1]/1000:.1f} kJ")
print(f"  Potential energy: {final_PE/1000:.1f} kJ ({final_PE/W_input[-1]*100:.1f}%)")
print(f"  Friction losses: {final_fric/1000:.1f} kJ ({final_fric/W_input[-1]*100:.1f}%)")
print(f"  Overall efficiency: {final_PE/W_input[-1]*100:.1f}%")`,
      challenge: 'Add a "braking" phase at the end where the team must slow the stone to a stop. Where does the kinetic energy go? Is the total input work higher if the stone is moving fast at the end?',
      successHint: 'You have verified conservation of energy numerically. The energy balance error should be near zero, confirming our simulation is physically correct. This verification step is essential in engineering simulations.',
    },
    {
      title: 'Rope tension analysis — catenary curves and load distribution',
      concept: `When many people pull a stone with ropes, the tension is not uniform. A rope under its own weight forms a **catenary curve** (from the Latin "catena" = chain).

The catenary equation:
**y = a × cosh(x/a)**

Where a = H/w (horizontal tension / weight per unit length).

For stone-pulling, the rope analysis involves:
1. **Tension distribution**: tension is highest at the attachment point
2. **Angle effect**: pulling at an angle reduces horizontal force
3. **Load sharing**: with multiple ropes, some carry more load than others
4. **Elasticity**: rope stretching stores and releases energy

📚 *numpy provides np.cosh() (hyperbolic cosine) for catenary calculations, and np.linalg.solve() for systems of equations.*`,
      analogy: 'A rope is like a chain of people passing a heavy object. The person closest to the load bears the most weight. Each person down the chain bears slightly less. In a rope, the fibers near the load end carry the highest tension. This is why ropes always break at the load end or at knots, never in the middle.',
      storyConnection: 'Naga stone-pullers use multiple ropes attached at different points, with teams pulling at various angles. The elders who organize the pull instinctively understand load distribution — they place the strongest pullers at the rope attachments and space the teams to minimize rope angle.',
      checkQuestion: 'Why do the Naga use multiple shorter ropes rather than one very long rope?',
      checkAnswer: 'Three reasons: (1) A single long rope stretches more under load, wasting energy in elastic deformation. (2) If one rope breaks, a single-rope system fails completely, while a multi-rope system still has backup. (3) Multiple ropes allow different teams to pull from different angles, distributing the force more evenly and allowing for course corrections. This is redundancy and load distribution — fundamental engineering principles.',
      codeIntro: 'Model the rope tension and catenary shape for a stone-pulling configuration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Catenary analysis
def catenary(x, a):
    return a * (np.cosh(x / a) - 1)

# Multi-rope stone-pulling setup
stone_pos = np.array([0, 0])  # stone at origin
n_ropes = 5
rope_length = 20  # meters each

# Puller positions (fanned out ahead of stone)
puller_angles = np.linspace(-30, 30, n_ropes)  # degrees
puller_angles_rad = np.radians(puller_angles)
puller_positions = np.column_stack([
    rope_length * np.cos(puller_angles_rad),
    rope_length * np.sin(puller_angles_rad)
])

# Each team pulls with different force (outer teams weaker)
pull_forces = np.array([400, 600, 800, 600, 400]) * 5  # N (team of 5 each)

# Resolve forces
F_x = pull_forces * np.cos(puller_angles_rad)
F_y = pull_forces * np.sin(puller_angles_rad)

total_Fx = np.sum(F_x)
total_Fy = np.sum(F_y)
total_F = np.sqrt(total_Fx**2 + total_Fy**2)
pull_direction = np.degrees(np.arctan2(total_Fy, total_Fx))

fig, axes = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ax.spines.values(): s.set_color('#4b5563')

# Plot 1: Top-down view of rope configuration
ax = axes[0]
# Draw stone
stone_rect = plt.Rectangle((-1, -0.8), 2, 1.6, color='#9ca3af', ec='white', linewidth=2)
ax.add_patch(stone_rect)
ax.text(0, 0, 'STONE', ha='center', va='center', color='#1f2937', fontsize=10, fontweight='bold')

# Draw ropes and pullers
colors = ['#f87171', '#f59e0b', '#10b981', '#60a5fa', '#a78bfa']
for i in range(n_ropes):
    ax.plot([0, puller_positions[i,0]], [0, puller_positions[i,1]],
            color=colors[i], linewidth=2, alpha=0.7)
    ax.scatter([puller_positions[i,0]], [puller_positions[i,1]],
              color=colors[i], s=100, zorder=5, edgecolors='white')
    # Force arrow
    scale = 0.005
    ax.annotate('', xy=(puller_positions[i,0] + F_x[i]*scale,
                        puller_positions[i,1] + F_y[i]*scale),
               xytext=(puller_positions[i,0], puller_positions[i,1]),
               arrowprops=dict(arrowstyle='->', color=colors[i], lw=2))
    ax.text(puller_positions[i,0]+1, puller_positions[i,1]+0.5,
            f'{pull_forces[i]/1000:.1f} kN', color=colors[i], fontsize=9)

# Resultant force
ax.annotate('', xy=(total_Fx*0.005, total_Fy*0.005), xytext=(0, 0),
           arrowprops=dict(arrowstyle='->', color='white', lw=3))
ax.text(8, -3, f'Resultant: {total_F/1000:.1f} kN\\\nDirection: {pull_direction:.1f}°',
        color='white', fontsize=10, bbox=dict(facecolor='#374151', edgecolor='#4b5563', pad=5))

ax.set_xlim(-5, 25); ax.set_ylim(-12, 12)
ax.set_aspect('equal')
ax.set_xlabel('Forward (m)', color='white', fontsize=11)
ax.set_ylabel('Lateral (m)', color='white', fontsize=11)
ax.set_title('Top View: Rope Configuration', color='white', fontsize=13, fontweight='bold')

# Plot 2: Catenary shape of middle rope (side view)
ax2 = axes[1]
rope_weight_per_m = 0.5  # kg/m
H = pull_forces[2]  # horizontal tension of center rope
a_param = H / (rope_weight_per_m * 9.81)

x_rope = np.linspace(-rope_length/2, rope_length/2, 200)
y_rope = -catenary(x_rope, a_param)
sag = -y_rope.min()

ax2.plot(x_rope + rope_length/2, y_rope - y_rope.min(), color='#10b981', linewidth=3)
ax2.scatter([0, rope_length], [0, 0], color='white', s=100, zorder=5)
ax2.annotate(f'Sag: {sag:.2f} m', xy=(rope_length/2, -sag + y_rope.min()),
            xytext=(rope_length/2 + 3, -sag/2), color='#f59e0b', fontsize=11,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Tension along rope
tension_at_point = H / np.cos(np.arctan(np.gradient(y_rope, x_rope)))
ax2_twin = ax2.twinx()
ax2_twin.plot(x_rope + rope_length/2, tension_at_point/1000, '--', color='#f87171', linewidth=1.5, alpha=0.7)
ax2_twin.set_ylabel('Tension (kN)', color='#f87171', fontsize=10)
ax2_twin.tick_params(colors='#f87171')

ax2.set_xlabel('Distance along rope (m)', color='white', fontsize=11)
ax2.set_ylabel('Rope Height (m)', color='white', fontsize=11)
ax2.set_title('Side View: Rope Catenary & Tension', color='white', fontsize=13, fontweight='bold')

plt.suptitle('Rope Mechanics in Stone-Pulling', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

print("Force Resolution:")
for i in range(n_ropes):
    print(f"  Rope {i+1}: angle={puller_angles[i]:>+5.0f}° | F={pull_forces[i]/1000:.1f} kN | "
          f"Fx={F_x[i]/1000:.2f} kN | Fy={F_y[i]/1000:.2f} kN")
print(f"\\\n  Total forward force: {total_Fx/1000:.2f} kN")
print(f"  Total lateral force: {total_Fy/1000:.2f} kN (should be ~0)")
print(f"  Rope sag (center rope): {sag:.2f} m")`,
      challenge: 'What happens if the rightmost rope breaks? Recalculate the resultant force and direction. How does the stone\'s trajectory change? Should the remaining teams adjust their positions?',
      successHint: 'You have analyzed vector force resolution, catenary curves, and tension distribution. These are the same tools used to design suspension bridges, cable car systems, and construction cranes.',
    },
    {
      title: 'Terrain optimization — finding the best path with gradient descent',
      concept: `The **optimal path** for stone-pulling minimizes total work:

**W_total = ∫(mg×sin(θ(s)) + μ×mg×cos(θ(s))) ds**

Where s is the distance along the path and θ(s) varies with terrain.

This is a **calculus of variations** problem. In practice, we use **gradient descent** to find good paths numerically:

1. Start with a straight-line path
2. Calculate total work along the path
3. Perturb each waypoint slightly
4. Accept the perturbation if it reduces total work
5. Repeat until no improvement is found

This is the same algorithm used in machine learning, route planning, and robotics.

📚 *Optimization algorithms iteratively improve a solution. Gradient descent follows the "steepest downhill" direction of a cost function — like water flowing downhill to find the lowest point.*`,
      analogy: 'Finding the optimal path is like water finding its way downhill. Water does not calculate — it simply flows in the direction of steepest descent at each point. Our algorithm does the same: at each step, it adjusts the path in the direction that reduces total work the most. The final path may not be the absolute best possible, but it is very good.',
      storyConnection: 'The stone-pulling route through the village is chosen by experienced elders who know the terrain intimately. They avoid steep sections, use natural contours, and route around soft ground. Our optimization algorithm discovers the same kind of route mathematically.',
      checkQuestion: 'Why might the shortest path NOT be the optimal path for stone-pulling?',
      checkAnswer: 'The shortest path (straight line) might cross steep terrain or soft ground. A longer path that avoids these obstacles can require less total work because: (1) lower slopes reduce the gravity component, (2) harder ground reduces friction, (3) wider paths allow more pullers to work simultaneously. The optimal path balances distance against difficulty — exactly what a gradient descent algorithm finds.',
      codeIntro: 'Use gradient descent to find the optimal stone-pulling path across terrain.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate terrain elevation map
grid_size = 50
x = np.linspace(0, 200, grid_size)  # meters
y = np.linspace(0, 200, grid_size)
X, Y = np.meshgrid(x, y)

# Terrain: gentle hills with a ridge
terrain = (20 * np.sin(X/40) * np.cos(Y/60) +
           10 * np.exp(-((X-100)**2 + (Y-80)**2)/2000) +
           15 * np.exp(-((Y-100)/30)**2) +  # ridge across the middle
           0.05 * X)  # general upward slope

# Start and end points
start = np.array([10, 100])  # starting position
end = np.array([190, 100])   # destination

def path_work(waypoints, terrain_grid, x_grid, y_grid, mass=5000, g=9.81, mu=0.12):
    """Calculate total work along a path through terrain."""
    from scipy.interpolate import RegularGridInterpolator
    interp = RegularGridInterpolator((y_grid, x_grid), terrain_grid)

    # Full path including start and end
    full_path = np.vstack([start, waypoints.reshape(-1, 2), end])
    total_work = 0

    for i in range(1, len(full_path)):
        p0, p1 = full_path[i-1], full_path[i]
        dx = np.sqrt((p1[0]-p0[0])**2 + (p1[1]-p0[1])**2)
        if dx < 0.1: continue

        # Get elevations
        h0 = float(interp([p0[1], p0[0]]))
        h1 = float(interp([p1[1], p1[0]]))
        dh = h1 - h0
        theta = np.arctan2(abs(dh), dx)

        # Work = gravity component + friction
        if dh > 0:  # uphill
            work = mass * g * dh + mu * mass * g * np.cos(theta) * dx
        else:  # downhill: friction only (gravity helps)
            work = mu * mass * g * np.cos(theta) * dx - mass * g * abs(dh) * 0.3  # partial gravity recovery
        total_work += max(0, work)

    return total_work

# Gradient descent optimization
n_waypoints = 8
# Initial straight-line path
init_waypoints = np.column_stack([
    np.linspace(start[0], end[0], n_waypoints + 2)[1:-1],
    np.full(n_waypoints, start[1])
])

waypoints = init_waypoints.copy()
best_work = path_work(waypoints, terrain, x, y)
work_history = [best_work]

learning_rate = 2.0
n_iterations = 200

for iteration in range(n_iterations):
    improved = False
    for i in range(n_waypoints):
        for dim in [0, 1]:  # try x and y perturbations
            for direction in [-1, 1]:
                trial = waypoints.copy()
                trial[i, dim] += direction * learning_rate
                # Keep within bounds
                trial[i, 0] = np.clip(trial[i, 0], 5, 195)
                trial[i, 1] = np.clip(trial[i, 1], 5, 195)
                trial_work = path_work(trial, terrain, x, y)
                if trial_work < best_work:
                    waypoints = trial
                    best_work = trial_work
                    improved = True
    work_history.append(best_work)
    if not improved:
        learning_rate *= 0.8
        if learning_rate < 0.1:
            break

# Visualization
fig, axes = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')

# Terrain with paths
im = axes[0].contourf(X, Y, terrain, levels=20, cmap='terrain')
cb = plt.colorbar(im, ax=axes[0], shrink=0.8, label='Elevation (m)')
cb.ax.yaxis.label.set_color('white')
cb.ax.tick_params(colors='white')

# Straight path
straight = np.vstack([start, init_waypoints, end])
axes[0].plot(straight[:, 0], straight[:, 1], 'r--', linewidth=2, label='Straight path', alpha=0.7)

# Optimized path
optimal = np.vstack([start, waypoints, end])
axes[0].plot(optimal[:, 0], optimal[:, 1], 'w-', linewidth=3, label='Optimized path')
axes[0].scatter(waypoints[:, 0], waypoints[:, 1], color='#f59e0b', s=50, zorder=5)
axes[0].scatter(*start, color='#10b981', s=150, marker='o', zorder=6, edgecolors='white', label='Start')
axes[0].scatter(*end, color='#f87171', s=150, marker='*', zorder=6, edgecolors='white', label='End')

axes[0].set_xlabel('Distance (m)', color='white', fontsize=11)
axes[0].set_ylabel('Lateral (m)', color='white', fontsize=11)
axes[0].set_title('Optimal Path Through Terrain', color='white', fontsize=13, fontweight='bold')
axes[0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

# Convergence plot
axes[1].plot(work_history, color='#10b981', linewidth=2)
axes[1].set_xlabel('Iteration', color='white', fontsize=11)
axes[1].set_ylabel('Total Work (J)', color='white', fontsize=11)
axes[1].set_title('Optimization Convergence', color='white', fontsize=13, fontweight='bold')
for s in ['top','right']: axes[1].spines[s].set_visible(False)
for s in ['bottom','left']: axes[1].spines[s].set_color('white')

plt.suptitle('Gradient Descent: Finding the Best Stone-Pulling Route', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

straight_work = path_work(init_waypoints, terrain, x, y)
print(f"Straight path work: {straight_work/1000:.1f} kJ")
print(f"Optimized path work: {best_work/1000:.1f} kJ")
print(f"Savings: {(1-best_work/straight_work)*100:.1f}%")
print(f"Iterations to converge: {len(work_history)-1}")`,
      challenge: 'Add "soft ground" zones (higher μ = 0.4 in certain areas) to the terrain. How does the optimal path change — does it route around soft zones even if it means going uphill?',
      successHint: 'You have implemented gradient descent optimization — the same algorithm that powers machine learning. Applied to stone-pulling, it finds routes that traditional knowledge discovered through centuries of trial and error.',
    },
    {
      title: 'Structural analysis — will the stone crack?',
      concept: `When a large stone is lifted by pry bars or supported on rollers, **stress concentrations** can cause it to crack. The stone is not a point mass — it has internal stresses.

**Stress = Force / Area** (σ = F/A, in Pascals)

For a beam (or stone slab) supported at two points:
- **Bending stress**: σ = M×y / I
  - M = bending moment
  - y = distance from neutral axis
  - I = moment of inertia

The stone cracks when stress exceeds its **tensile strength** (typically 5-15 MPa for granite, 2-5 MPa for sandstone).

Supporting the stone on closely-spaced rollers distributes the load and reduces maximum bending stress. This is why the Naga use many rollers, not just two or three.

📚 *Numerical methods can solve for stress distributions across 2D cross-sections, revealing where a stone is most likely to crack.*`,
      analogy: 'Imagine lying on a bed of nails vs standing on one nail. The same body weight is distributed across thousands of points (low stress per nail) vs concentrated on one point (extremely high stress). Rollers under a stone work the same way — more rollers = more contact points = lower stress per point = less chance of cracking.',
      storyConnection: 'Ancient stones chosen for pulling ceremonies were selected not just for size but for structural integrity. Stones with visible cracks, grain boundaries, or weak layers were rejected. The elders understood intuitively what structural analysis reveals mathematically: some stones are strong, others will break under the pulling stresses.',
      checkQuestion: 'Why does a stone crack from the bottom when supported at two ends with a load in the middle?',
      checkAnswer: 'When a beam bends, the top surface compresses (gets shorter) and the bottom surface stretches (gets longer). Stone is strong in compression but weak in tension — it can handle being squeezed but cracks easily when pulled apart. The bottom surface, under maximum tensile stress, is where the crack initiates. This is why concrete (also weak in tension) uses steel reinforcement bars on the tension side.',
      codeIntro: 'Analyze the bending stress in a stone slab supported on rollers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stone slab properties
length = 3.0    # meters
width = 1.5     # meters
height = 0.4    # meters
density = 2700  # kg/m³ (granite)
mass = length * width * height * density
weight = mass * 9.81

tensile_strength = 8e6  # Pa (8 MPa for granite)

print(f"Stone: {length}m × {width}m × {height}m granite")
print(f"Mass: {mass:.0f} kg | Weight: {weight/1000:.1f} kN")
print(f"Tensile strength: {tensile_strength/1e6:.0f} MPa")
print("=" * 55)

# Case 1: Supported at two ends (worst case)
def bending_analysis(n_supports, L, w_per_m, h, b):
    """Analyze bending stress for n equally-spaced supports."""
    I = b * h**3 / 12  # moment of inertia
    y_max = h / 2       # max distance from neutral axis

    if n_supports == 2:
        # Simply supported beam with distributed load
        span = L
        M_max = w_per_m * span**2 / 8  # maximum bending moment
    else:
        # Multiple supports: treat as continuous beam
        span = L / (n_supports - 1)
        M_max = w_per_m * span**2 / 8  # approximate for continuous beam

    sigma_max = M_max * y_max / I
    safety_factor = tensile_strength / sigma_max if sigma_max > 0 else float('inf')
    return M_max, sigma_max, safety_factor, span

w_per_m = weight / length  # load per meter

print(f"\\n{'Supports':>10} | {'Span':>6} | {'M_max':>8} | {'Stress':>8} | {'SF':>5} | {'Status':>10}")
print("-" * 60)

configs = [2, 3, 4, 5, 6, 8, 10]
stresses = []
sfs = []

for n in configs:
    M, sigma, SF, span = bending_analysis(n, length, w_per_m, height, width)
    stresses.append(sigma / 1e6)
    sfs.append(SF)
    status = "SAFE" if SF > 2 else "MARGINAL" if SF > 1 else "WILL CRACK"
    print(f"  {n:>7} | {span:>5.2f}m | {M:>6.0f} Nm | {sigma/1e6:>6.2f} MPa | {SF:>5.1f} | {status}")

# Visualization
fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Stress vs number of supports
bar_colors = ['#f87171' if s > tensile_strength/1e6 else '#f59e0b' if s > tensile_strength/1e6/2 else '#10b981' for s in stresses]
axes[0].bar([str(n) for n in configs], stresses, color=bar_colors, edgecolor='white', linewidth=0.5)
axes[0].axhline(y=tensile_strength/1e6, color='#f87171', linestyle='--', label=f'Tensile strength ({tensile_strength/1e6:.0f} MPa)')
axes[0].set_xlabel('Number of Rollers', color='white', fontsize=11)
axes[0].set_ylabel('Max Bending Stress (MPa)', color='white', fontsize=11)
axes[0].set_title('Stress vs Roller Count', color='white', fontsize=12, fontweight='bold')
axes[0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

# Safety factor
axes[1].bar([str(n) for n in configs], sfs, color=['#f87171' if sf < 1 else '#f59e0b' if sf < 2 else '#10b981' for sf in sfs],
            edgecolor='white', linewidth=0.5)
axes[1].axhline(y=1, color='#f87171', linestyle='--', label='Failure threshold')
axes[1].axhline(y=2, color='#f59e0b', linestyle='--', label='Safety minimum')
axes[1].set_xlabel('Number of Rollers', color='white', fontsize=11)
axes[1].set_ylabel('Safety Factor', color='white', fontsize=11)
axes[1].set_title('Safety Factor vs Roller Count', color='white', fontsize=12, fontweight='bold')
axes[1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

# Bending moment diagram for 4-roller case
x_beam = np.linspace(0, length, 500)
n_sup = 4
span = length / (n_sup - 1)
M_beam = np.zeros_like(x_beam)
for i, xi in enumerate(x_beam):
    seg = int(xi / span)
    x_local = xi - seg * span
    if x_local <= span:
        M_beam[i] = w_per_m * x_local * (span - x_local) / 2

axes[2].fill_between(x_beam, M_beam, alpha=0.3, color='#a78bfa')
axes[2].plot(x_beam, M_beam, color='#a78bfa', linewidth=2)
# Mark roller positions
for i in range(n_sup):
    pos = i * span
    axes[2].axvline(x=pos, color='white', linestyle=':', alpha=0.3)
    axes[2].scatter([pos], [0], marker='^', s=100, color='#f59e0b', zorder=5)
axes[2].set_xlabel('Position along stone (m)', color='white', fontsize=11)
axes[2].set_ylabel('Bending Moment (Nm)', color='white', fontsize=11)
axes[2].set_title('Bending Moment (4 rollers)', color='white', fontsize=12, fontweight='bold')

plt.suptitle('Structural Analysis: Will the Stone Crack?', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

print(f"\\\nMinimum rollers needed (safety factor > 2): {configs[next(i for i, sf in enumerate(sfs) if sf > 2)]}")`,
      challenge: 'What if the stone has a pre-existing crack at the center? Model how a crack reduces the effective cross-section and increases local stress. At what crack depth does the stone become unsafe?',
      successHint: 'You have performed structural analysis — the same calculations that civil engineers use for bridges, buildings, and dams. The insight that more support points reduce stress explains many engineering design choices.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Mechanics Modeling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy, matplotlib, and scipy. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
