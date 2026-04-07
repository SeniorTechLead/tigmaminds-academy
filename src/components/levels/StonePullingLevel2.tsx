import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function StonePullingLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Force diagram — visualizing the physics of stone-pulling',
      concept: `A **free-body diagram** shows all forces acting on an object. For a stone being pulled up a ramp:

1. **Weight (W)**: straight down, W = mg
2. **Normal force (N)**: perpendicular to ramp surface, N = mg×cos(θ)
3. **Friction (f)**: along the ramp opposing motion, f = μN
4. **Applied force (F)**: along the ramp in direction of motion

Equilibrium (constant velocity): F = mg×sin(θ) + μ×mg×cos(θ)

The key insight is that the weight vector decomposes into two components along and perpendicular to the ramp. This decomposition is the foundation of all ramp mechanics.

📚 *matplotlib can draw arrows (quiver plots) and shapes to create physics diagrams. plt.annotate() adds labeled arrows.*`,
      analogy: 'A free-body diagram is like a recipe — it lists every ingredient (force) and its amount (magnitude). Missing one force is like forgetting salt: the result is wrong. If you forget friction in your calculation, you will underestimate the force needed, and the stone will not move.',
      storyConnection: 'Before the Naga community pulls, elders assess the path — instinctively estimating slope, surface conditions, and required force. The free-body diagram makes this intuitive assessment precise and quantitative.',
      checkQuestion: 'On a ramp, the normal force is LESS than the weight. Where does the "missing" force go?',
      checkAnswer: 'The weight vector has two components: one perpendicular to the ramp (balanced by the normal force) and one parallel to the ramp (the component that makes the stone want to slide downhill). The "missing" force is the parallel component mg×sin(θ). As the ramp gets steeper, more of the weight shifts from normal to parallel, which is why steeper ramps require more pulling force.',
      codeIntro: 'Draw a free-body diagram of a stone on an inclined plane.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

fig, ax = plt.subplots(figsize=(10, 7))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

theta = 20  # degrees
theta_rad = np.radians(theta)
mass = 5000; g = 9.81; mu = 0.15

# Draw ramp
ramp_length = 8
ramp_x = [0, ramp_length * np.cos(theta_rad)]
ramp_y = [0, ramp_length * np.sin(theta_rad)]
ax.fill([0, ramp_x[1], ramp_x[1], 0], [0, ramp_y[1], 0, 0], color='#4b5563', alpha=0.5)
ax.plot(ramp_x, ramp_y, 'w-', linewidth=2)
ax.plot([0, ramp_x[1]], [0, 0], 'w-', linewidth=1, alpha=0.5)

# Stone position (center of ramp)
sx = 4 * np.cos(theta_rad)
sy = 4 * np.sin(theta_rad)
stone = patches.Rectangle((sx - 0.4, sy - 0.1), 0.8, 0.8,
                           angle=theta, color='#9ca3af', ec='white', linewidth=2)
ax.add_patch(stone)
ax.text(sx + 0.1, sy + 0.5, '5000 kg', color='white', fontsize=11, fontweight='bold')

# Force arrows (scaled for visibility)
scale = 0.00008
W = mass * g
N = W * np.cos(theta_rad)
F_fric = mu * N
F_grav_parallel = W * np.sin(theta_rad)
F_pull = F_grav_parallel + F_fric

# Weight (straight down)
ax.annotate('', xy=(sx, sy - W*scale), xytext=(sx, sy),
            arrowprops=dict(arrowstyle='->', color='#f87171', lw=3))
ax.text(sx + 0.2, sy - W*scale/2, f'W = {W/1000:.1f} kN', color='#f87171', fontsize=10)

# Normal force (perpendicular to ramp, upward)
nx = -np.sin(theta_rad) * N * scale
ny = np.cos(theta_rad) * N * scale
ax.annotate('', xy=(sx + nx, sy + ny), xytext=(sx, sy),
            arrowprops=dict(arrowstyle='->', color='#60a5fa', lw=3))
ax.text(sx + nx - 1.2, sy + ny, f'N = {N/1000:.1f} kN', color='#60a5fa', fontsize=10)

# Friction (along ramp, downhill)
fx = -np.cos(theta_rad) * F_fric * scale * 3
fy = -np.sin(theta_rad) * F_fric * scale * 3
ax.annotate('', xy=(sx + fx, sy + fy), xytext=(sx, sy),
            arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=3))
ax.text(sx + fx - 0.5, sy + fy - 0.3, f'f = {F_fric/1000:.1f} kN', color='#f59e0b', fontsize=10)

# Applied pull (along ramp, uphill)
px = np.cos(theta_rad) * F_pull * scale * 3
py = np.sin(theta_rad) * F_pull * scale * 3
ax.annotate('', xy=(sx + px, sy + py), xytext=(sx, sy),
            arrowprops=dict(arrowstyle='->', color='#10b981', lw=3))
ax.text(sx + px + 0.1, sy + py + 0.2, f'F = {F_pull/1000:.1f} kN', color='#10b981', fontsize=10)

# Angle arc
arc = patches.Arc((0, 0), 2, 2, angle=0, theta1=0, theta2=theta, color='white', linewidth=1.5)
ax.add_patch(arc)
ax.text(1.2, 0.2, f'θ = {theta}°', color='white', fontsize=11)

# Info box
info = f'Stone: {mass:,} kg | θ = {theta}° | μ = {mu}\\nPull force needed: {F_pull/1000:.1f} kN ({int(F_pull/500)+1} people)'
ax.text(0.5, 3.5, info, color='white', fontsize=11,
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#374151', edgecolor='#4b5563'))

ax.set_xlim(-1, 9); ax.set_ylim(-1.5, 4.5)
ax.set_aspect('equal')
ax.set_title('Free-Body Diagram: Stone on Inclined Plane', color='white', fontsize=14, fontweight='bold')
ax.axis('off')
plt.tight_layout()
plt.show()

print(f"Force breakdown:")
print(f"  Weight component along ramp: {F_grav_parallel/1000:.1f} kN")
print(f"  Friction force: {F_fric/1000:.1f} kN")
print(f"  Total pull needed: {F_pull/1000:.1f} kN")`,
      challenge: 'Draw the same diagram for a steeper angle (35 degrees). How does the relative size of each force arrow change? Which force grows fastest with angle?',
      successHint: 'Free-body diagrams turn intuition into precision. Every force is accounted for, every direction is clear. This is the fundamental tool of mechanical engineering.',
    },
    {
      title: 'Force vs angle — finding the sweet spot',
      concept: `The total pulling force on a ramp is:
**F = mg×sin(θ) + μ×mg×cos(θ)**

This is the sum of two opposing trends:
- **Gravity component** mg×sin(θ) increases with angle
- **Friction** μ×mg×cos(θ) decreases with angle (less normal force on steeper ramps)

There is an optimal angle where total force is minimized:
**θ_optimal = arctan(μ)**

For μ = 0.15: θ_opt = arctan(0.15) = 8.5°
For μ = 0.50: θ_opt = arctan(0.50) = 26.6°

This is profound: the rougher the surface, the steeper the optimal ramp. On a perfectly frictionless surface, the optimal angle would be 0° (horizontal).

📚 *matplotlib's plt.plot() draws lines from data arrays. Multiple plt.plot() calls overlay multiple curves on the same axes.*`,
      analogy: 'It is like choosing highway speed for fuel efficiency. Too slow (gentle ramp) and the engine runs inefficiently (friction dominates). Too fast (steep ramp) and wind resistance is enormous (gravity component dominates). There is a sweet spot that minimizes total fuel consumption — just as there is a sweet spot ramp angle that minimizes pulling force.',
      storyConnection: 'Naga stone-pulling paths are not random — they follow slopes that centuries of experience have shown to be optimal. The mathematical optimum at arctan(μ) matches what traditional knowledge discovered empirically: moderately gentle slopes on prepared surfaces.',
      checkQuestion: 'If you reduce friction to near zero (greased ice), the optimal angle approaches 0°. But at exactly 0°, you need zero force to overcome gravity on flat ground. Is there still any force needed?',
      checkAnswer: 'On perfectly flat, perfectly frictionless ground, you need zero force to maintain constant velocity (Newton\'s First Law). You need some force to START moving (accelerate), but once moving, the stone continues forever. In reality, even greased rollers have some friction, so the optimal angle is slightly above 0° — typically 3-5° for the best surfaces.',
      codeIntro: 'Plot pulling force vs angle for different surface conditions and find the optimal angle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

mass = 5000; g = 9.81
angles = np.linspace(0.5, 60, 200)
angles_rad = np.radians(angles)

surfaces = [
    ('Bare rock (μ=0.60)', 0.60, '#f87171'),
    ('Packed earth (μ=0.35)', 0.35, '#f59e0b'),
    ('Wood planks (μ=0.20)', 0.20, '#a78bfa'),
    ('Log rollers (μ=0.12)', 0.12, '#10b981'),
    ('Greased rollers (μ=0.05)', 0.05, '#60a5fa'),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.5))
fig.patch.set_facecolor('#1f2937')

for ax in [ax1, ax2]:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

print("Optimal Ramp Angles for Different Surfaces")
print("=" * 55)

for name, mu, color in surfaces:
    F_total = mass * g * (np.sin(angles_rad) + mu * np.cos(angles_rad))
    F_kN = F_total / 1000

    ax1.plot(angles, F_kN, color=color, linewidth=2, label=name)

    # Find and mark minimum
    opt_idx = np.argmin(F_total)
    opt_angle = angles[opt_idx]
    opt_force = F_total[opt_idx]
    ax1.scatter([opt_angle], [opt_force/1000], color=color, s=80, zorder=5, edgecolors='white')

    theoretical_opt = np.degrees(np.arctan(mu))
    people = int(opt_force / 500) + 1
    print(f"  {name:30s} | optimal: {opt_angle:>5.1f}° (theory: {theoretical_opt:.1f}°) | F: {opt_force/1000:.1f} kN | {people} people")

ax1.set_xlabel('Ramp Angle (degrees)', color='white', fontsize=11)
ax1.set_ylabel('Total Pulling Force (kN)', color='white', fontsize=11)
ax1.set_title('Pulling Force vs Ramp Angle', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8, loc='upper left')

# Plot 2: Decomposition for one surface
mu = 0.20
F_gravity = mass * g * np.sin(angles_rad) / 1000
F_friction = mu * mass * g * np.cos(angles_rad) / 1000
F_total = F_gravity + F_friction

ax2.plot(angles, F_gravity, '--', color='#f87171', linewidth=2, label='Gravity component')
ax2.plot(angles, F_friction, '--', color='#f59e0b', linewidth=2, label='Friction component')
ax2.plot(angles, F_total, '-', color='#10b981', linewidth=3, label='Total force')

opt_idx = np.argmin(F_total)
ax2.axvline(x=angles[opt_idx], color='white', linestyle=':', alpha=0.5)
ax2.annotate(f'Optimal: {angles[opt_idx]:.1f}°', xy=(angles[opt_idx], F_total[opt_idx]),
             xytext=(angles[opt_idx]+10, F_total[opt_idx]), color='white', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='white'))

ax2.set_xlabel('Ramp Angle (degrees)', color='white', fontsize=11)
ax2.set_ylabel('Force (kN)', color='white', fontsize=11)
ax2.set_title('Force Decomposition (μ=0.20)', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

plt.tight_layout()
plt.show()`,
      challenge: 'If you could choose between investing in a longer, gentler ramp OR investing in better surface preparation (lower μ), which gives more benefit per unit cost? Compare quantitatively.',
      successHint: 'The optimal angle formula θ = arctan(μ) is one of the most elegant results in mechanics. It tells engineers exactly how to design ramps for minimum effort.',
    },
    {
      title: 'Roller mechanics — converting sliding to rolling friction',
      concept: `**Rolling friction** is dramatically lower than sliding friction. A stone on log rollers experiences:

**F_rolling = C_rr × W / r**

Where:
- C_rr = rolling resistance coefficient (~0.01-0.05 for hard surfaces)
- W = weight of the stone
- r = roller radius

Compare:
- Sliding friction: F = μW (μ ≈ 0.3-0.6)
- Rolling friction: F = C_rr × W / r (effective μ ≈ 0.02-0.10)

Rolling is 5-30× easier than sliding because the contact point does not slide — it lifts and re-contacts. The roller converts destructive sliding (which wastes energy as heat) into efficient rotation.

📚 *numpy arrays support element-wise operations. np.linspace(start, stop, n) creates n evenly spaced values — perfect for plotting smooth curves.*`,
      analogy: 'Imagine dragging a heavy suitcase across an airport floor (sliding friction). Now put wheels on it (rolling friction). The difference is dramatic — the same suitcase that required all your strength to drag now rolls with one finger. Log rollers do exactly this for stones, converting the terrible sliding friction into manageable rolling friction.',
      storyConnection: 'The log roller is the most important technology in Naga stone-pulling. Without it, moving a 5-tonne stone would require 50+ people struggling against sliding friction. With rollers, 15-20 people can do the same job. The logs are harvested from specific trees known for their hardness and roundness.',
      checkQuestion: 'Why does roller diameter matter? Would bigger rollers or smaller rollers be better?',
      checkAnswer: 'Bigger rollers have lower rolling resistance (F = C_rr × W / r, so larger r means smaller F). But bigger rollers are heavier, harder to position, and raise the stone higher (requiring more work to lift onto them). The practical optimum is typically 15-25 cm diameter — large enough for low friction, small enough to handle. This matches the log sizes traditionally used in Naga stone-pulling.',
      codeIntro: 'Compare sliding vs rolling friction and analyze the effect of roller diameter.',
      code: `import numpy as np
import matplotlib.pyplot as plt

mass = 5000; g = 9.81; W = mass * g

# Comparison: sliding vs rolling
print("Sliding vs Rolling Friction — 5,000 kg Stone")
print("=" * 55)

sliding_mu = [0.65, 0.50, 0.35, 0.20]
sliding_names = ['Rough stone', 'Packed earth', 'Wet earth', 'Wood planks']

print("\\nSliding friction:")
for name, mu in zip(sliding_names, sliding_mu):
    F = mu * W
    print(f"  {name:15s} (μ={mu:.2f}): {F/1000:>6.1f} kN ({int(F/500)+1} people)")

print("\\nRolling friction (log rollers):")
Crr = 0.02  # rolling resistance coefficient for wood on earth
radii = [0.05, 0.075, 0.10, 0.125, 0.15, 0.20, 0.25]
for r in radii:
    F_roll = Crr * W / r
    eff_mu = F_roll / W
    print(f"  r = {r*100:>5.1f} cm: {F_roll/1000:>6.2f} kN (eff μ={eff_mu:.3f}, {max(1,int(F_roll/500)+1)} people)")

# Plotting
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.5))
fig.patch.set_facecolor('#1f2937')

for ax in [ax1, ax2]:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Plot 1: Force comparison bar chart
methods = ['Rough\\nstone', 'Packed\\nearth', 'Wet\\nearth', 'Wood\\nplanks',
           'Rollers\\n10cm', 'Rollers\\n15cm', 'Rollers\\n20cm']
forces = [0.65*W, 0.50*W, 0.35*W, 0.20*W,
          Crr*W/0.10, Crr*W/0.15, Crr*W/0.20]
colors = ['#f87171','#f87171','#f59e0b','#f59e0b','#10b981','#10b981','#10b981']

bars = ax1.bar(methods, [f/1000 for f in forces], color=colors, edgecolor='white', linewidth=0.5)
ax1.set_ylabel('Pulling Force (kN)', color='white', fontsize=11)
ax1.set_title('Sliding vs Rolling: Force Comparison', color='white', fontsize=13, fontweight='bold')

for bar, force in zip(bars, forces):
    ax1.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.3,
             f'{force/1000:.1f}', ha='center', color='white', fontsize=9)

# Plot 2: Rolling force vs roller diameter
diameters = np.linspace(5, 40, 100)  # cm
radii_m = diameters / 200  # convert to meters (radius)
F_rolling = Crr * W / radii_m / 1000  # kN

ax2.plot(diameters, F_rolling, color='#10b981', linewidth=2.5)
ax2.axhline(y=0.50*W/1000, color='#f87171', linestyle='--', alpha=0.7, label='Sliding on packed earth')
ax2.axhline(y=0.20*W/1000, color='#f59e0b', linestyle='--', alpha=0.7, label='Sliding on wood planks')
ax2.fill_between(diameters, F_rolling, alpha=0.15, color='#10b981')

# Mark practical range
ax2.axvspan(15, 25, alpha=0.1, color='#60a5fa', label='Practical roller size')

ax2.set_xlabel('Roller Diameter (cm)', color='white', fontsize=11)
ax2.set_ylabel('Rolling Force (kN)', color='white', fontsize=11)
ax2.set_title('Rolling Force vs Roller Size', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)
ax2.set_ylim(0, 20)

plt.tight_layout()
plt.show()

# Savings summary
best_sliding = 0.35 * W  # wet earth
best_rolling = Crr * W / 0.15
print(f"\\nBest sliding (wet earth): {best_sliding/1000:.1f} kN")
print(f"Best rolling (15cm logs): {best_rolling/1000:.2f} kN")
print(f"Rolling is {best_sliding/best_rolling:.0f}x easier than best sliding!")`,
      challenge: 'What if the rollers are not perfectly round (eccentricity)? Model the extra force needed if rollers have a 5% deviation from circular. How much does imperfect roundness cost?',
      successHint: 'Rolling friction is the single biggest force-reduction technique available. The invention of the wheel (and before it, the log roller) was one of humanity\'s most important engineering breakthroughs.',
    },
    {
      title: 'Power and time — how long does the pull take?',
      concept: `**Power** is the rate of doing work:

**P = W / t = F × v**

Where:
- P = power in Watts (W)
- W = work in Joules
- t = time in seconds
- F = force, v = velocity

A human can sustain about 75 W of useful mechanical power (like a dim light bulb). In short bursts, up to 300-400 W.

For stone-pulling:
- Total work = F × distance
- Total power available = number_of_people × power_per_person
- Time = Work / Power

This determines how long the ceremony takes — and why the community needs breaks, food, and water.

📚 *matplotlib can create multi-panel figures with plt.subplots(rows, cols). Each panel shows a different aspect of the same data.*`,
      analogy: 'Power is like the width of a pipe filling a pool. Work is the total water needed (pool volume). More people pulling is like a wider pipe — the same total water (work) flows through faster. This is why stone-pulling is a community event: one person could theoretically move the stone, but it would take months. A hundred people do it in hours.',
      storyConnection: 'The stone-pulling ceremony typically takes several hours, with the community working in shifts. The physics of power explains why: even 100 people can only sustain about 7,500 W total, and moving a 5-tonne stone 500 m up a slope requires roughly 200,000 J of work.',
      checkQuestion: 'Why do pullers slow down over time, even if they maintain the same force?',
      checkAnswer: 'Human power output decreases with duration. A person can produce 300 W for 30 seconds, 150 W for 10 minutes, or 75 W for an hour. This is because muscles deplete glycogen (fast energy) quickly and must switch to fat metabolism (slow energy). The stone-pulling tradition of rhythmic chanting and periodic rests is an instinctive optimization of human power output over the multi-hour event.',
      codeIntro: 'Calculate the time and energy cost of different stone-pulling strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

mass = 5000; g = 9.81; distance = 500; height = 15  # 500m path, 15m height gain

# Total work for different methods
methods = {
    'Bare dragging (μ=0.50)': {'mu': 0.50, 'angle': 1.7, 'rollers': False},
    'Wet path (μ=0.30)':      {'mu': 0.30, 'angle': 1.7, 'rollers': False},
    'Log rollers (eff μ=0.08)': {'mu': 0.08, 'angle': 1.7, 'rollers': True},
    'Greased rollers (eff μ=0.04)': {'mu': 0.04, 'angle': 1.7, 'rollers': True},
}

# Human power model: decreases with time
def human_power(t_hours, n_people):
    """Average sustainable power output over time."""
    P_peak = 150  # W per person (moderate effort)
    fatigue = np.exp(-0.3 * t_hours)  # exponential fatigue
    return n_people * P_peak * (0.5 + 0.5 * fatigue)

n_people = 80

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

print(f"Stone-Pulling Time & Energy Analysis")
print(f"Stone: {mass:,} kg | Distance: {distance} m | Height gain: {height} m | People: {n_people}")
print("=" * 75)

colors = ['#f87171', '#f59e0b', '#60a5fa', '#10b981']
all_results = []

for (name, params), color in zip(methods.items(), colors):
    theta = np.radians(params['angle'])
    F_pull = mass * g * (np.sin(theta) + params['mu'] * np.cos(theta))
    W_total = F_pull * distance
    W_gravity = mass * g * height
    W_friction = W_total - W_gravity
    efficiency = W_gravity / W_total * 100

    # Time simulation with fatigue
    times = np.linspace(0, 8, 500)  # hours
    dt = times[1] - times[0]
    dist_covered = np.zeros_like(times)
    velocity = np.zeros_like(times)

    for i in range(1, len(times)):
        P = human_power(times[i], n_people)
        v = P / F_pull if F_pull > 0 else 0  # v = P/F
        velocity[i] = v * 3600  # m/h for display
        dist_covered[i] = dist_covered[i-1] + v * dt * 3600

    # Find completion time
    completed_idx = np.searchsorted(dist_covered, distance)
    completion_time = times[min(completed_idx, len(times)-1)]

    all_results.append((name, W_total, completion_time, efficiency, F_pull))

    # Plot progress
    axes[0,0].plot(times, dist_covered, color=color, linewidth=2, label=name.split('(')[0].strip())
    axes[0,1].plot(times, velocity, color=color, linewidth=2)

    print(f"  {name:35s}")
    print(f"    Force: {F_pull/1000:.1f} kN | Work: {W_total/1e6:.2f} MJ | Time: {completion_time:.1f} h | Efficiency: {efficiency:.0f}%")

axes[0,0].axhline(y=distance, color='white', linestyle=':', alpha=0.3)
axes[0,0].set_xlabel('Time (hours)', color='white', fontsize=10)
axes[0,0].set_ylabel('Distance Covered (m)', color='white', fontsize=10)
axes[0,0].set_title('Progress Over Time', color='white', fontsize=12, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

axes[0,1].set_xlabel('Time (hours)', color='white', fontsize=10)
axes[0,1].set_ylabel('Speed (m/h)', color='white', fontsize=10)
axes[0,1].set_title('Pulling Speed (decreases with fatigue)', color='white', fontsize=12, fontweight='bold')

# Bar chart of completion times
names_short = [n.split('(')[0].strip() for n, _, _, _, _ in all_results]
times_h = [t for _, _, t, _, _ in all_results]
axes[1,0].barh(names_short, times_h, color=colors, edgecolor='white', linewidth=0.5)
axes[1,0].set_xlabel('Completion Time (hours)', color='white', fontsize=10)
axes[1,0].set_title('Total Time by Method', color='white', fontsize=12, fontweight='bold')

# Energy breakdown
works_mj = [w/1e6 for _, w, _, _, _ in all_results]
grav_work = mass * g * height / 1e6
axes[1,1].bar(names_short, works_mj, color=colors, edgecolor='white', linewidth=0.5)
axes[1,1].axhline(y=grav_work, color='white', linestyle='--', alpha=0.5, label=f'Minimum (gravity only): {grav_work:.2f} MJ')
axes[1,1].set_xlabel('Method', color='white', fontsize=10)
axes[1,1].set_ylabel('Total Work (MJ)', color='white', fontsize=10)
axes[1,1].set_title('Energy Cost by Method', color='white', fontsize=12, fontweight='bold')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[1,1].tick_params(axis='x', rotation=15)

plt.suptitle('Stone-Pulling: Time, Power & Energy Analysis', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()`,
      challenge: 'What if you split the 80 people into two shifts of 40, alternating every 30 minutes? Model the power output with rest periods and compare total completion time.',
      successHint: 'You now understand the complete physics picture: force determines how many people you need, work determines total energy cost, and power determines how long it takes. The Naga ceremony optimizes all three through surface preparation, route selection, and community coordination.',
    },
    {
      title: 'Efficiency comparison — ranking all simple machines',
      concept: `The **efficiency** of a machine is the ratio of useful output work to total input work:

**η = W_output / W_input × 100%**

For stone-pulling, useful work is raising the stone (mgh), and input work includes friction losses:

**η = mgh / (mgh + W_friction) × 100%**

No real machine is 100% efficient — energy is always lost to friction, heat, and sound. The goal is to maximize efficiency by choosing the best combination of simple machines.

The Naga approach stacks multiple techniques:
1. Rollers (reduce friction)
2. Ramp (reduce instantaneous force)
3. Lever (pry bars for positioning)
4. Lubrication (further reduce friction)
5. Rope leverage (around guide posts)

📚 *matplotlib's plt.bar() creates bar charts. Stacked bars (using the bottom parameter) show how totals break down into components.*`,
      analogy: 'Efficiency is like fuel economy in a car. A car that converts 25% of fuel energy into motion is more efficient than one that converts only 15%. The "lost" energy goes to heat, noise, and friction — it does not disappear (conservation of energy), but it does not help move the car. Similarly, every joule lost to friction in stone-pulling is a joule that does not raise the stone.',
      storyConnection: 'The evolution of Naga stone-pulling techniques over centuries is a story of increasing efficiency. Each generation discovered improvements — better surfaces, larger rollers, optimal routes — that reduced wasted energy. This empirical optimization parallels what engineers do with mathematical models.',
      checkQuestion: 'Why can efficiency never reach 100% in a real system?',
      checkAnswer: 'The Second Law of Thermodynamics states that some energy must always be converted to heat (entropy increases). Even the best bearings have some friction. Even the smoothest surfaces have microscopic roughness. In practice, additional losses come from: rope stretching (elastic energy), sound production (vibrational energy), air resistance, and deformation of the ground surface. The theoretical minimum loss is set by thermodynamics; the practical minimum is much higher.',
      codeIntro: 'Calculate and compare the efficiency of every stone-pulling method.',
      code: `import numpy as np
import matplotlib.pyplot as plt

mass = 5000; g = 9.81; height = 15  # raising stone 15 meters

W_useful = mass * g * height  # minimum work required (gravity only)

# All methods with their effective friction and path characteristics
methods = [
    ('Straight vertical lift', 0, 90, 15),
    ('Steep ramp, bare rock', 0.60, 30, 30),
    ('Steep ramp, planks', 0.20, 30, 30),
    ('Medium ramp, wet earth', 0.30, 15, 58),
    ('Medium ramp, planks', 0.20, 15, 58),
    ('Gentle ramp, log rollers', 0.10, 8, 108),
    ('Gentle ramp, greased rollers', 0.04, 8, 108),
    ('Optimal ramp, greased rollers', 0.04, 2.3, 374),
]

print("Efficiency Analysis — All Stone-Pulling Methods")
print(f"Useful work (raising {mass:,} kg by {height} m): {W_useful/1000:.1f} kJ")
print("=" * 80)

results = []
for name, mu, angle, path_length in methods:
    theta = np.radians(angle)
    if angle == 90:
        W_friction = 0
        F_pull = mass * g
    else:
        W_friction = mu * mass * g * np.cos(theta) * path_length
        F_pull = mass * g * (np.sin(theta) + mu * np.cos(theta))

    W_total = W_useful + W_friction
    efficiency = W_useful / W_total * 100
    people = max(1, int(F_pull / 500) + 1)
    results.append((name, W_total, W_friction, efficiency, F_pull, people))

print(f"{'Method':>35} | {'W_total':>8} | {'W_lost':>8} | {'Eff':>5} | {'Force':>7} | {'People':>6}")
print("-" * 80)
for name, W_t, W_f, eff, F, ppl in results:
    print(f"  {name:>33} | {W_t/1000:>6.1f} kJ | {W_f/1000:>6.1f} kJ | {eff:>4.1f}% | {F/1000:>5.1f} kN | {ppl:>5}")

# Visualization
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

for ax in [ax1, ax2]:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

names = [r[0].replace(', ', '\\n') for r in results]
useful = [W_useful/1000] * len(results)
friction_losses = [r[2]/1000 for r in results]
efficiencies = [r[3] for r in results]

# Stacked bar: useful work + friction loss
x = np.arange(len(results))
ax1.bar(x, useful, color='#10b981', label='Useful work (raising stone)', width=0.6)
ax1.bar(x, friction_losses, bottom=useful, color='#f87171', label='Friction losses', width=0.6)
ax1.set_xticks(x)
ax1.set_xticklabels(names, fontsize=7, rotation=45, ha='right')
ax1.set_ylabel('Work (kJ)', color='white', fontsize=11)
ax1.set_title('Work Breakdown by Method', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

# Efficiency bars
colors_eff = ['#f87171' if e < 50 else '#f59e0b' if e < 75 else '#10b981' for e in efficiencies]
ax2.barh(x, efficiencies, color=colors_eff, edgecolor='white', linewidth=0.5, height=0.6)
ax2.set_yticks(x)
ax2.set_yticklabels(names, fontsize=7)
ax2.set_xlabel('Efficiency (%)', color='white', fontsize=11)
ax2.set_title('Energy Efficiency by Method', color='white', fontsize=13, fontweight='bold')
ax2.set_xlim(0, 105)
for i, eff in enumerate(efficiencies):
    ax2.text(eff + 1, i, f'{eff:.1f}%', color='white', fontsize=9, va='center')

plt.suptitle('Stone-Pulling Engineering: Complete Efficiency Analysis', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

best = max(results, key=lambda r: r[3])
worst = min(results[1:], key=lambda r: r[3])  # exclude vertical lift
print(f"\\nBest method: {best[0]} ({best[3]:.1f}% efficient, {best[5]} people)")
print(f"Worst practical method: {worst[0]} ({worst[3]:.1f}% efficient, {worst[5]} people)")
print(f"Engineering improvement: {best[3]-worst[3]:.1f} percentage points of efficiency")`,
      challenge: 'Add a "cost" column: each method has setup costs (building ramp, cutting rollers, etc.). Calculate cost-effectiveness as (efficiency gain / setup cost). Which investment gives the best return?',
      successHint: 'You have completed a full engineering analysis comparing all stone-pulling methods. The progression from brute force (30% efficiency) to optimized engineering (95%+ efficiency) mirrors the entire history of mechanical engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualizing Mechanical Systems</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with matplotlib. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
