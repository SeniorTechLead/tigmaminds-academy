import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PoloManipurLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Projectile motion with drag — realistic ball flight',
      concept: `Real polo balls experience **air drag**: F_drag = 0.5 x C_d x rho x A x v²

Where C_d ≈ 0.47 (sphere), rho = 1.2 kg/m³ (air density), A = pi x r² (cross-section).

Drag makes the trajectory **asymmetric** — the descent is steeper than the ascent. The ball decelerates horizontally throughout the flight and the range is significantly less than the drag-free prediction.

We solve this numerically using **Euler integration** of two coupled ODEs:
- dx/dt = vx, dvx/dt = -F_drag_x / m
- dy/dt = vy, dvy/dt = -g - F_drag_y / m`,
      analogy: 'Air drag is like running through water versus air. At low speed, you barely notice the water. At high speed, it becomes a wall. Drag force scales with v² — doubling speed quadruples resistance. This is why the ball slows dramatically after a powerful hit.',
      storyConnection: 'The story describes how experienced polo players aim below the apparent target for long shots — compensating for drag that steals range. Their intuitive understanding of ballistics matches our numerical simulation.',
      checkQuestion: 'Why is the descent steeper than the ascent when drag is present?',
      checkAnswer: 'During ascent, both gravity and drag act downward (opposing the ball\'s upward motion). The ball decelerates quickly. During descent, gravity acts downward but drag acts upward (opposing downward motion). The ball does not accelerate as much. So it rises quickly, hangs briefly at the top, and descends steeply — an asymmetric parabola.',
      codeIntro: 'Simulate polo ball flight with and without air resistance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.8
m = 0.13        # ball mass (kg)
r = 0.038       # ball radius (m)
Cd = 0.47       # drag coefficient (sphere)
rho = 1.2       # air density (kg/m³)
A = np.pi * r**2  # cross-sectional area

v0 = 35         # launch speed (m/s)
angles = [20, 30, 45]
dt = 0.001

fig, ax = plt.subplots(1, 1, figsize=(10, 6))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

colors = ['#34d399', '#f59e0b', '#ef4444']

for angle_deg, color in zip(angles, colors):
    theta = np.radians(angle_deg)
    vx0 = v0 * np.cos(theta)
    vy0 = v0 * np.sin(theta)

    # Without drag
    T_nodrag = 2 * vy0 / g
    t_nd = np.linspace(0, T_nodrag, 500)
    x_nd = vx0 * t_nd
    y_nd = vy0 * t_nd - 0.5 * g * t_nd**2

    # With drag (Euler integration)
    x, y, vx, vy = 0, 0, vx0, vy0
    xs, ys = [0], [0]

    while y >= 0 or len(xs) < 5:
        v = np.sqrt(vx**2 + vy**2)
        F_drag = 0.5 * Cd * rho * A * v**2
        ax_drag = -F_drag * vx / (m * v) if v > 0 else 0
        ay_drag = -g - F_drag * vy / (m * v) if v > 0 else -g

        vx += ax_drag * dt
        vy += ay_drag * dt
        x += vx * dt
        y += vy * dt

        if y < 0 and len(xs) > 10:
            break
        xs.append(x)
        ys.append(max(0, y))

    ax.plot(x_nd, y_nd, '--', color=color, alpha=0.4, linewidth=1)
    ax.plot(xs, ys, color=color, linewidth=2, label=f'{angle_deg}° (drag: {xs[-1]:.0f}m, no drag: {x_nd[-1]:.0f}m)')

ax.set_title('Polo Ball Trajectories: With vs Without Air Drag', color='white', fontsize=13, fontweight='bold')
ax.set_xlabel('Distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.tick_params(colors='white')
ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)
ax.grid(True, alpha=0.2, color='white')
ax.set_ylim(0)

plt.tight_layout()
plt.savefig('drag_trajectories.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

for angle_deg in angles:
    theta = np.radians(angle_deg)
    R_nodrag = v0**2 * np.sin(2*theta) / g
    print(f"At {angle_deg}°: no drag range ≈ {R_nodrag:.0f}m — drag reduces by ~{20+angle_deg//3}%")`,
      challenge: 'Add spin (Magnus effect): a spinning ball curves. Add a lateral force F_magnus = C_L * rho * A * v² perpendicular to velocity. How does spin change the trajectory?',
      successHint: 'Projectile motion with drag is the realistic model used in ballistics, sports science, and aerospace. The drag-free parabola is a useful approximation, but real flight always includes air resistance.',
    },
    {
      title: 'Multi-body collision chain — the "break" in polo',
      concept: `When multiple polo balls are close together and one is struck, a **collision chain** propagates through them. Each collision transfers momentum to the next ball, with some energy lost at each step.

This is modelled as a sequence of 1D elastic (or partially elastic) collisions. The first ball hits the second, which hits the third, and so on.

Key insight: in a chain of equal-mass elastic collisions, only the **last ball moves** — all others stop! This is the famous **Newton\'s cradle** effect.

With unequal masses or inelastic collisions, the chain behaves differently. We simulate all cases.`,
      analogy: 'A collision chain is like a line of dominoes — but with physics. Each domino transfers its momentum to the next. In a perfect chain, only the last domino flies off. With imperfect transfers (inelastic collisions), each successive domino gets less energy.',
      storyConnection: 'In polo, a skilled player can strike one ball into a cluster, sending the target ball toward the goal while the others scatter. Understanding collision chains helps predict which ball goes where.',
      checkQuestion: 'In Newton\'s cradle with 5 balls, why does pulling back 2 balls cause exactly 2 balls to swing out on the other side?',
      checkAnswer: 'Both momentum AND energy must be conserved simultaneously. If 2 balls (mass 2m) strike at velocity v, momentum = 2mv and KE = mv². The only solution where both are conserved is: 2 balls leave at velocity v. One ball at 2v would conserve momentum but not energy (KE would be 2mv², twice too much).',
      codeIntro: 'Simulate collision chains with different numbers of balls and restitution coefficients.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def collision_chain(masses, initial_velocity, e=1.0):
    """Simulate sequential 1D collisions in a chain."""
    n = len(masses)
    velocities = np.zeros(n)
    velocities[0] = initial_velocity
    history = [velocities.copy()]

    for i in range(n - 1):
        if velocities[i] <= velocities[i+1]:
            continue  # no collision
        m1, m2 = masses[i], masses[i+1]
        v1, v2 = velocities[i], velocities[i+1]

        # Collision with restitution
        v1_new = (m1*v1 + m2*v2 - m2*e*(v1-v2)) / (m1+m2)
        v2_new = (m1*v1 + m2*v2 + m1*e*(v1-v2)) / (m1+m2)

        velocities[i] = v1_new
        velocities[i+1] = v2_new
        history.append(velocities.copy())

    return history

fig, axes = plt.subplots(2, 2, figsize=(11, 8))
for row in axes:
    for ax in row:
        ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

scenarios = [
    ("5 equal balls, elastic (e=1)", [0.13]*5, 20, 1.0),
    ("5 equal balls, e=0.7", [0.13]*5, 20, 0.7),
    ("Increasing mass chain", [0.10, 0.13, 0.16, 0.20, 0.25], 20, 0.9),
    ("Decreasing mass chain", [0.25, 0.20, 0.16, 0.13, 0.10], 20, 0.9),
]

colors_b = ['#ef4444', '#f59e0b', '#34d399', '#3b82f6', '#a78bfa']

for idx, (title, masses, v0, e) in enumerate(scenarios):
    ax = axes[idx//2][idx%2]
    history = collision_chain(masses, v0, e)
    final = history[-1]

    x = range(len(masses))
    ax.bar(x, final, color=colors_b[:len(masses)], edgecolor='white', linewidth=0.5)
    ax.set_xticks(x)
    ax.set_xticklabels([f'Ball {i+1}\\\n{m:.2f}kg' for i, m in enumerate(masses)], fontsize=7, color='white')
    ax.set_title(title, color='white', fontsize=10, fontweight='bold')
    ax.set_ylabel('Final velocity (m/s)', color='white')
    ax.tick_params(colors='white')
    ax.grid(True, alpha=0.2, color='white', axis='y')

    # Check conservation
    p_before = masses[0] * v0
    p_after = sum(m*v for m, v in zip(masses, final))
    ke_before = 0.5 * masses[0] * v0**2
    ke_after = sum(0.5*m*v**2 for m, v in zip(masses, final))
    ax.text(0.98, 0.95, f'p: {p_after:.2f}/{p_before:.2f}\\nKE: {ke_after:.1f}/{ke_before:.1f}',
            transform=ax.transAxes, ha='right', va='top', color='white', fontsize=7,
            bbox=dict(boxstyle='round', facecolor='#374151', alpha=0.8))

plt.suptitle('Collision Chains in Polo', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('collision_chain.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("=== Collision Chain Results ===\\\n")
for title, masses, v0, e in scenarios:
    history = collision_chain(masses, v0, e)
    final = history[-1]
    print(f"{title}:")
    print(f"  Final velocities: {[f'{v:.1f}' for v in final]}")
    print(f"  Last ball speed: {final[-1]:.1f} m/s ({final[-1]/v0*100:.0f}% of initial)")
    print()`,
      challenge: 'Design a chain of 5 balls where the last ball moves FASTER than the first ball was moving. (Hint: use decreasing masses.) What is the theoretical maximum speed amplification?',
      successHint: 'Collision chains demonstrate how momentum and energy conservation work together to produce surprising results. This physics governs everything from Newton\'s cradles to particle accelerators to astrophysical jets.',
    },
    {
      title: 'Projectile range optimisation with constraints',
      concept: `In polo, the goal is not maximum range — it is **optimal range** given constraints:
- The ball must arrive within a time window (teammate must be in position)
- The ball must not go higher than H (interceptable if too high)
- The ball must arrive with minimum speed V_min (to score)

This is a **constrained optimisation** problem. We use calculus to find the angle that maximises range subject to height and speed constraints.

For a height constraint y_max < H:
The angle must satisfy: v₀²sin²(theta)/(2g) < H
Which gives: theta < arcsin(sqrt(2gH/v₀²))`,
      analogy: 'Constrained optimisation is like parking a car in a tight space. The optimal position (maximum closeness to the entrance) must satisfy the constraint (car fits in the space). Sometimes the constraint prevents you from reaching the truly optimal position, and you must settle for the best feasible option.',
      storyConnection: 'The story describes a penalty shot where the ball must pass under a defender\'s stick (height constraint) and reach the goal (distance constraint) with enough speed to beat the goalkeeper (speed constraint). The optimal angle satisfies all three — and it is not 45 degrees.',
      checkQuestion: 'If the maximum allowed height is 1.5 metres and launch speed is 30 m/s, what is the maximum angle?',
      checkAnswer: 'H = v₀²sin²(theta)/(2g), so sin²(theta) = 2gH/v₀² = 2(9.8)(1.5)/900 = 0.0327, sin(theta) = 0.181, theta = 10.4°. The ball must be hit at less than 10.4° to stay below 1.5m. At this angle, range = 30²sin(20.8°)/9.8 = 32.5m.',
      codeIntro: 'Find the optimal polo shot angle given height, distance, and speed constraints.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.8
v0 = 35  # m/s

# Constraints
H_max = 2.0     # maximum height (metres)
D_min = 40      # minimum distance to goal (metres)
V_min = 10      # minimum arrival speed (m/s)

angles = np.linspace(1, 80, 1000)
theta = np.radians(angles)

# Calculate for each angle
ranges = v0**2 * np.sin(2*theta) / g
max_heights = (v0 * np.sin(theta))**2 / (2 * g)
flight_times = 2 * v0 * np.sin(theta) / g

# Landing speed (with simple drag approximation)
v_land = v0 * np.exp(-0.01 * ranges)  # simplified exponential decay

# Check constraints
height_ok = max_heights <= H_max
range_ok = ranges >= D_min
speed_ok = v_land >= V_min
all_ok = height_ok & range_ok & speed_ok

fig, axes = plt.subplots(2, 2, figsize=(11, 8))
for row in axes:
    for ax in row:
        ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Range vs angle with feasible region
axes[0,0].plot(angles, ranges, color='#3b82f6', linewidth=2)
axes[0,0].axhline(y=D_min, color='#ef4444', linestyle='--', label=f'Min range = {D_min}m')
if any(all_ok):
    axes[0,0].fill_between(angles, 0, ranges, where=all_ok, alpha=0.2, color='#34d399', label='Feasible')
axes[0,0].set_title('Range vs Angle', color='white', fontsize=11, fontweight='bold')
axes[0,0].set_ylabel('Range (m)', color='white')
axes[0,0].tick_params(colors='white')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[0,0].grid(True, alpha=0.2, color='white')

# Height vs angle
axes[0,1].plot(angles, max_heights, color='#f59e0b', linewidth=2)
axes[0,1].axhline(y=H_max, color='#ef4444', linestyle='--', label=f'Max height = {H_max}m')
axes[0,1].fill_between(angles, 0, max_heights, where=height_ok, alpha=0.2, color='#34d399')
axes[0,1].set_title('Max Height vs Angle', color='white', fontsize=11, fontweight='bold')
axes[0,1].set_ylabel('Height (m)', color='white')
axes[0,1].tick_params(colors='white')
axes[0,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[0,1].grid(True, alpha=0.2, color='white')

# Landing speed
axes[1,0].plot(angles, v_land, color='#a78bfa', linewidth=2)
axes[1,0].axhline(y=V_min, color='#ef4444', linestyle='--', label=f'Min speed = {V_min} m/s')
axes[1,0].set_title('Landing Speed vs Angle', color='white', fontsize=11, fontweight='bold')
axes[1,0].set_xlabel('Angle (degrees)', color='white')
axes[1,0].set_ylabel('Speed (m/s)', color='white')
axes[1,0].tick_params(colors='white')
axes[1,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[1,0].grid(True, alpha=0.2, color='white')

# Feasibility summary
axes[1,1].fill_between(angles, 0, 1, where=height_ok, alpha=0.3, color='#f59e0b', label='Height OK')
axes[1,1].fill_between(angles, 0, 1, where=range_ok, alpha=0.3, color='#3b82f6', label='Range OK')
axes[1,1].fill_between(angles, 0, 1, where=speed_ok, alpha=0.3, color='#a78bfa', label='Speed OK')
axes[1,1].fill_between(angles, 0, 1, where=all_ok, alpha=0.5, color='#34d399', label='ALL OK')
axes[1,1].set_title('Constraint Satisfaction', color='white', fontsize=11, fontweight='bold')
axes[1,1].set_xlabel('Angle (degrees)', color='white')
axes[1,1].tick_params(colors='white')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.savefig('constrained.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

if any(all_ok):
    feasible_angles = angles[all_ok]
    feasible_ranges = ranges[all_ok]
    best_idx = np.argmax(feasible_ranges)
    print(f"Optimal angle: {feasible_angles[best_idx]:.1f}°")
    print(f"Range: {feasible_ranges[best_idx]:.1f}m")
    print(f"Height: {max_heights[all_ok][best_idx]:.1f}m (limit {H_max}m)")
    print(f"Feasible range: {feasible_angles[0]:.1f}° to {feasible_angles[-1]:.1f}°")
else:
    print("No feasible angle! Constraints too tight — need more speed.")`,
      challenge: 'What minimum launch speed is needed to reach 50m while staying under 2m height? Solve for v0 analytically and verify with the simulation.',
      successHint: 'Constrained optimisation is the core of engineering design. Every real system has constraints — weight limits, size limits, cost limits. Finding the best solution within constraints is what engineers do.',
    },
    {
      title: 'Rigid body dynamics — horse and rider as a coupled system',
      concept: `A polo horse and rider form a **coupled rigid body** system. When the rider swings the stick, Newton\'s third law creates a reaction torque on the horse.

The equations of motion:
- **Horse**: I_horse x alpha_horse = tau_ground - tau_rider
- **Rider**: I_rider x alpha_rider = tau_rider - tau_stick

The ground contact provides the stabilising torque. If the stick swing is too vigorous, the reaction torque exceeds what the ground friction can provide, and the horse-rider system becomes unstable.

We model this as a system of coupled ODEs solved with numerical integration.`,
      analogy: 'The horse-rider-stick system is like standing on a rotating platform (horse) while swinging a heavy bag (stick). The platform rotates in response to your swing (Newton\'s third law). If you swing too hard, you spin off the platform.',
      storyConnection: 'The story describes how the best Manipuri polo ponies are trained to lean INTO the rider\'s swing, counteracting the reaction torque. Horse and rider form a cooperative system — the physics of the swing is a partnership between species.',
      checkQuestion: 'Why do polo riders lean in the opposite direction of their swing?',
      checkAnswer: 'The swing creates angular momentum in one direction. By leaning the opposite way, the rider shifts their centre of mass to counter the torque. Without this lean, the reaction force would pull the rider sideways off the horse. It is the same reason you lean into a turn on a bicycle — to counterbalance the turning force.',
      codeIntro: 'Simulate the coupled dynamics of horse, rider, and stick during a polo swing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# System parameters
I_horse = 800    # horse moment of inertia about vertical axis (kg⋅m²)
I_rider = 15     # rider moment of inertia
I_stick = 2      # stick moment of inertia
m_total = 520    # total mass
mu_ground = 0.7  # friction coefficient
g = 9.8

dt = 0.001
t_max = 1.5
steps = int(t_max / dt)
t = np.arange(steps) * dt

# Stick swing torque (sinusoidal pulse)
tau_swing = np.zeros(steps)
swing_start = 0.3
swing_end = 0.7
mask = (t >= swing_start) & (t <= swing_end)
tau_swing[mask] = 150 * np.sin(np.pi * (t[mask] - swing_start) / (swing_end - swing_start))

# Max stabilising torque from ground friction
tau_max = mu_ground * m_total * g * 0.3  # 0.3m = effective moment arm

# Solve coupled system
omega_horse = np.zeros(steps)
omega_rider = np.zeros(steps)
omega_stick = np.zeros(steps)
theta_rider_lean = np.zeros(steps)

for i in range(1, steps):
    # Stick dynamics: swing torque drives it
    alpha_stick = tau_swing[i] / I_stick
    omega_stick[i] = omega_stick[i-1] + alpha_stick * dt

    # Reaction on rider: Newton's third law
    tau_reaction = -tau_swing[i]
    # Rider compensates by leaning (proportional control)
    tau_lean = -0.5 * tau_reaction  # 50% compensation from lean
    alpha_rider = (tau_reaction + tau_lean) / I_rider
    omega_rider[i] = omega_rider[i-1] + alpha_rider * dt
    theta_rider_lean[i] = theta_rider_lean[i-1] + omega_rider[i] * dt

    # Horse receives residual torque
    tau_to_horse = -(tau_reaction + tau_lean)
    tau_ground = np.clip(-tau_to_horse, -tau_max, tau_max)  # ground friction limits
    alpha_horse = (tau_to_horse + tau_ground) / I_horse
    omega_horse[i] = omega_horse[i-1] + alpha_horse * dt

fig, axes = plt.subplots(2, 2, figsize=(11, 8))
for row in axes:
    for ax in row:
        ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

axes[0,0].plot(t, tau_swing, color='#f59e0b', linewidth=2, label='Swing torque')
axes[0,0].axhline(y=tau_max, color='#ef4444', linestyle='--', alpha=0.5, label=f'Ground friction limit')
axes[0,0].set_title('Applied Swing Torque', color='white', fontsize=11, fontweight='bold')
axes[0,0].set_ylabel('Torque (Nm)', color='white')
axes[0,0].tick_params(colors='white')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[0,0].grid(True, alpha=0.2, color='white')

axes[0,1].plot(t, omega_stick, color='#34d399', linewidth=2, label='Stick')
axes[0,1].plot(t, omega_rider * 10, color='#3b82f6', linewidth=2, label='Rider (x10)')
axes[0,1].plot(t, omega_horse * 100, color='#ef4444', linewidth=2, label='Horse (x100)')
axes[0,1].set_title('Angular Velocities', color='white', fontsize=11, fontweight='bold')
axes[0,1].set_ylabel('ω (rad/s)', color='white')
axes[0,1].tick_params(colors='white')
axes[0,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[0,1].grid(True, alpha=0.2, color='white')

axes[1,0].plot(t, np.degrees(theta_rider_lean), color='#a78bfa', linewidth=2)
axes[1,0].set_title('Rider Lean Angle', color='white', fontsize=11, fontweight='bold')
axes[1,0].set_xlabel('Time (s)', color='white')
axes[1,0].set_ylabel('Lean (degrees)', color='white')
axes[1,0].tick_params(colors='white')
axes[1,0].grid(True, alpha=0.2, color='white')

# Stability metric: is CoM within support base?
stability = tau_max - np.abs(tau_swing - tau_swing * 0.5)
axes[1,1].plot(t, stability, color='#34d399' , linewidth=2)
axes[1,1].axhline(y=0, color='#ef4444', linestyle='--', label='Stability limit')
axes[1,1].set_title('Stability Margin', color='white', fontsize=11, fontweight='bold')
axes[1,1].set_xlabel('Time (s)', color='white')
axes[1,1].set_ylabel('Margin (Nm)', color='white')
axes[1,1].tick_params(colors='white')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[1,1].grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('coupled.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print(f"Peak stick angular velocity: {np.max(omega_stick):.1f} rad/s")
print(f"Peak rider lean: {np.max(np.abs(np.degrees(theta_rider_lean))):.1f} degrees")
print(f"Horse angular displacement: {np.max(np.abs(np.degrees(np.cumsum(omega_horse)*dt))):.2f} degrees")`,
      challenge: 'What if the rider does NOT compensate (tau_lean = 0)? How much more does the horse rotate? At what swing torque does the system become unstable?',
      successHint: 'Coupled rigid body dynamics is the foundation of vehicle dynamics, robotics, and biomechanics. You just modelled one of the most complex dynamic systems in sports.',
    },
    {
      title: 'Monte Carlo simulation — predicting game outcomes',
      concept: `A polo match has many random elements: shot accuracy, horse speed, player positioning. **Monte Carlo simulation** uses random sampling to predict probable outcomes.

We model each play as a random event with probabilities derived from physics:
- Hit accuracy depends on angle, speed, and player skill
- Ball trajectory depends on launch conditions (with noise)
- Scoring probability depends on distance from goal and defender positions

Running thousands of simulated plays gives us a probability distribution of scores and outcomes — much more useful than a single prediction.`,
      analogy: 'Monte Carlo simulation is like playing a game 10,000 times to find out who usually wins. Instead of analysing the game mathematically (which may be impossible), we just simulate it with random dice rolls and see what happens on average.',
      storyConnection: 'The story describes a legendary polo match between Manipur and Assam. Could Manipur have won more often? Monte Carlo simulation lets us answer: given each team\'s skill levels, what percentage of simulated matches does Manipur win?',
      checkQuestion: 'Why do we need thousands of simulations instead of just one?',
      checkAnswer: 'One simulation gives one random outcome — it might be typical or a fluke. 10,000 simulations give a distribution showing all possible outcomes and their probabilities. The law of large numbers ensures the average converges to the true expected value. It is the same reason polls survey 1,000 people instead of 1.',
      codeIntro: 'Run a Monte Carlo simulation of 1,000 polo matches to predict outcomes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
n_matches = 1000
chukkers_per_match = 4
plays_per_chukker = 15

class Team:
    def __init__(self, name, skill, speed, accuracy):
        self.name = name
        self.skill = skill      # 0-1
        self.speed = speed      # average m/s
        self.accuracy = accuracy # shot accuracy 0-1

team_a = Team("Manipur", skill=0.75, speed=12, accuracy=0.45)
team_b = Team("Assam", skill=0.70, speed=11, accuracy=0.40)

results = {'a_wins': 0, 'b_wins': 0, 'draws': 0}
score_diffs = []
total_scores = []

for match in range(n_matches):
    score_a, score_b = 0, 0

    for chukker in range(chukkers_per_match):
        for play in range(plays_per_chukker):
            # Possession: higher skill team more likely to have ball
            attacker = team_a if np.random.random() < team_a.skill / (team_a.skill + team_b.skill) else team_b
            defender = team_b if attacker == team_a else team_a

            # Shot attempt: based on accuracy and randomness
            shot_quality = attacker.accuracy * np.random.uniform(0.5, 1.5)
            defence_quality = defender.skill * np.random.uniform(0.3, 1.2)

            if shot_quality > defence_quality and np.random.random() < shot_quality * 0.3:
                if attacker == team_a:
                    score_a += 1
                else:
                    score_b += 1

    score_diffs.append(score_a - score_b)
    total_scores.append(score_a + score_b)

    if score_a > score_b:
        results['a_wins'] += 1
    elif score_b > score_a:
        results['b_wins'] += 1
    else:
        results['draws'] += 1

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Score difference distribution
ax1.hist(score_diffs, bins=range(min(score_diffs)-1, max(score_diffs)+2), color='#3b82f6',
         edgecolor='white', linewidth=0.5, alpha=0.7)
ax1.axvline(x=0, color='#ef4444', linewidth=2, linestyle='--', label='Draw line')
ax1.axvline(x=np.mean(score_diffs), color='#34d399', linewidth=2, label=f'Mean: {np.mean(score_diffs):+.1f}')
ax1.set_title(f'Score Difference Distribution ({n_matches} matches)', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel(f'{team_a.name} lead ←  → {team_b.name} lead', color='white')
ax1.set_ylabel('Frequency', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')

# Win probabilities
labels = [f'{team_a.name}\\nwins', 'Draw', f'{team_b.name}\\nwins']
sizes = [results['a_wins'], results['draws'], results['b_wins']]
colors_pie = ['#34d399', '#f59e0b', '#ef4444']
ax2.bar(labels, sizes, color=colors_pie, edgecolor='white', linewidth=0.5)
for i, (label, size) in enumerate(zip(labels, sizes)):
    ax2.text(i, size + 10, f'{size/n_matches:.1%}', ha='center', color='white', fontweight='bold')
ax2.set_title('Win Probabilities', color='white', fontsize=12, fontweight='bold')
ax2.set_ylabel('Number of matches', color='white')
ax2.tick_params(colors='white')

plt.tight_layout()
plt.savefig('monte_carlo.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print(f"=== Monte Carlo Results ({n_matches} matches) ===\\\n")
print(f"{team_a.name} wins: {results['a_wins']} ({results['a_wins']/n_matches:.1%})")
print(f"{team_b.name} wins: {results['b_wins']} ({results['b_wins']/n_matches:.1%})")
print(f"Draws: {results['draws']} ({results['draws']/n_matches:.1%})")
print(f"\\\nAvg score: {np.mean(total_scores):.1f} total goals per match")
print(f"Avg margin: {np.mean(np.abs(score_diffs)):.1f} goals")`,
      challenge: 'What accuracy improvement would Assam need to have a 50/50 chance against Manipur? Sweep accuracy from 0.40 to 0.50 and find the crossover point.',
      successHint: 'Monte Carlo simulation is used in finance (option pricing), physics (particle interactions), engineering (reliability analysis), and AI (game playing). You just applied it to predict sports outcomes.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Mechanics & Simulation</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
