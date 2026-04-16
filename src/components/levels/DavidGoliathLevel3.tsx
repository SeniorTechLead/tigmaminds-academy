import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import NewtonForceDiagram from '../diagrams/NewtonForceDiagram';
import WorkForceDiagram from '../diagrams/WorkForceDiagram';
import EnergyBarChartDiagram from '../diagrams/EnergyBarChartDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import SlopeInterceptDiagram from '../diagrams/SlopeInterceptDiagram';
import DistanceFormulaDiagram from '../diagrams/DistanceFormulaDiagram';

export default function DavidGoliathLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Numerical integration — Euler method for projectile with drag',
      concept: `In Level 2, we simulated drag using a simple loop: update velocity, update position, repeat. That IS numerical integration — specifically the **Euler method**, the simplest way to solve differential equations on a computer.

The idea: if you know position and velocity right now, you can estimate them a tiny time step dt later:
- v_new = v_old + a * dt (velocity changes by acceleration times time step)
- x_new = x_old + v * dt (position changes by velocity times time step)

With air resistance, acceleration depends on velocity, which makes the equation **nonlinear** — no neat formula exists. But the Euler method handles it easily: just recalculate acceleration at each step.

The catch: Euler's method accumulates error. Smaller dt = more accurate but slower. The code compares different time steps to show how accuracy depends on dt, then introduces the **improved Euler (Heun's) method** which is significantly more accurate for the same step size.`,
      analogy: 'Imagine navigating through fog. You can only see 1 meter ahead. You take a step, look again, take another step. With tiny steps (small dt), you follow the path accurately. With huge steps, you drift off course. The Euler method is "walking through fog" — each step uses only local information to estimate the next position.',
      storyConnection: 'Ancient ballistics was pure empirical trial: slingers adjusted by watching where stones landed. Numerical integration lets us do thousands of virtual "trials" in seconds. David had years of practice; we have the Euler method. Both converge on the right answer — one through muscle memory, the other through computation.',
      checkQuestion: 'If you halve the time step (dt/2), roughly how much more accurate does the basic Euler method become?',
      checkAnswer: 'About twice as accurate. Euler\'s method has first-order accuracy: the global error is proportional to dt. Halving dt halves the error — but doubles the computation time. The Heun method (improved Euler) is second-order: halving dt reduces error by a factor of 4, making it much more efficient for the same accuracy.',
      codeIntro: 'Compare Euler method accuracy with different time steps.',
      code: `import numpy as np
import matplotlib.pyplot as plt

m, g = 0.05, 9.8
Cd, rho, A = 0.47, 1.2, np.pi * 0.01**2
v0, angle, h0 = 30, 25, 1.5

def simulate(dt):
    vx = v0 * np.cos(np.radians(angle))
    vy = v0 * np.sin(np.radians(angle))
    x, y, xs, ys = 0, h0, [0], [h0]
    while y >= 0:
        v = np.sqrt(vx**2 + vy**2)
        Fd = 0.5 * rho * v**2 * Cd * A / m
        ax = -Fd * vx / v
        ay = -g - Fd * vy / v
        vx += ax * dt; vy += ay * dt
        x += vx * dt; y += vy * dt
        xs.append(x); ys.append(y)
    return xs, ys

plt.figure(figsize=(10, 5))
for dt, color, style in [(0.1, 'red', '--'), (0.01, 'orange', '-.'),
                          (0.001, 'lime', '-'), (0.0001, 'cyan', '-')]:
    xs, ys = simulate(dt)
    plt.plot(xs, ys, color=color, linewidth=2, linestyle=style,
             label=f'dt={dt} (range={xs[-1]:.2f}m)')

plt.xlabel('Distance (m)', fontsize=12)
plt.ylabel('Height (m)', fontsize=12)
plt.title('Euler Method: Accuracy vs Time Step', fontsize=14)
plt.legend(fontsize=10); plt.grid(alpha=0.3); plt.ylim(0)
plt.show()

print("Notice: dt=0.1 gives a noticeably different trajectory")
print("dt=0.001 and dt=0.0001 are nearly identical — converged")
print("Rule of thumb: use the largest dt where halving it")
print("doesn't change the answer significantly")`,
      challenge: 'Implement the Heun (improved Euler) method: compute acceleration at current state, take a tentative Euler step, compute acceleration at the new state, then average the two accelerations for the actual step. Compare accuracy at dt=0.01 vs basic Euler at dt=0.001.',
      successHint: 'The Euler method is the foundation of all physics simulations. From weather forecasting to spacecraft trajectories, the same idea applies: step forward in time using current conditions to estimate future conditions.',
    },
    {
      title: 'Rotational mechanics — angular velocity and torque in the sling',
      concept: `The sling is a **rotational machine**. David swings the stone in a circle, and the physics of rotation governs how the stone accelerates.

Key rotational quantities (and their linear analogs):
- **Angular velocity** omega (like linear velocity v): how fast it spins (rad/s)
- **Angular acceleration** alpha (like linear acceleration a): how fast omega changes
- **Torque** tau (like force F): what causes angular acceleration. tau = I * alpha
- **Moment of inertia** I (like mass m): resistance to angular acceleration. I = m * r^2

For the sling, I = m * r^2 (a point mass at distance r). The torque David applies through his wrist and arm accelerates the stone from rest to full speed.

The faster David wants to spin the stone, the more torque he needs. And the longer the sling (larger r), the more torque required — but also the faster the release speed (v = omega * r). There is an optimal sling length that balances these tradeoffs.`,
      analogy: 'Push a merry-go-round. A lightweight one spins up easily (low moment of inertia). A heavy one resists (high I). Now imagine the merry-go-round gets bigger — even if the mass stays the same, it is harder to spin because the mass is farther from the center. That is I = m*r^2: distance matters as r-squared.',
      storyConnection: 'Ancient sling cords were typically 60-100 cm long. Longer slings give higher release speeds but are harder to control and take longer to spin up. David, a shepherd, likely used a medium-length sling (~80 cm) — long enough for good speed, short enough for accuracy while protecting his flock.',
      checkQuestion: 'If David doubles the sling length, what happens to the moment of inertia and the release speed (assuming the same angular velocity)?',
      checkAnswer: 'Moment of inertia quadruples (I = m*r^2, so doubling r gives 4x I). Release speed doubles (v = omega*r). But maintaining the same angular velocity requires 4x more torque (tau = I*alpha, and spinning up to the same omega requires the same alpha with 4x the I). So longer slings give more speed but demand much more arm strength.',
      codeIntro: 'Model the sling spin-up: torque, angular acceleration, and energy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

m = 0.05  # stone mass (kg)
torque_arm = 8.0  # Newtons of effective wrist/arm force

sling_lengths = [0.5, 0.75, 1.0, 1.25, 1.5]
spin_up_time = 0.8  # seconds to spin up

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

for L in sling_lengths:
    I = m * L**2  # moment of inertia
    tau = torque_arm * L  # torque = force * lever arm
    alpha = tau / I  # angular acceleration

    dt = 0.001
    t_arr, omega_arr, v_arr = [0], [0], [0]
    omega = 0
    for _ in range(int(spin_up_time / dt)):
        omega += alpha * dt
        t_arr.append(t_arr[-1] + dt)
        omega_arr.append(omega)
        v_arr.append(omega * L)

    ax1.plot(t_arr, omega_arr, linewidth=2, label=f'L={L}m')
    ax2.plot(t_arr, v_arr, linewidth=2, label=f'L={L}m')

    v_final = omega * L
    print(f"L={L:.2f}m: omega={omega:.0f} rad/s, "
          f"v_release={v_final:.0f} m/s ({v_final*3.6:.0f} km/h)")

ax1.set_xlabel('Time (s)'); ax1.set_ylabel('Angular velocity (rad/s)')
ax1.set_title('Spin-Up: Angular Velocity'); ax1.legend(fontsize=9)
ax1.grid(alpha=0.3)

ax2.set_xlabel('Time (s)'); ax2.set_ylabel('Release speed (m/s)')
ax2.set_title('Spin-Up: Linear Speed'); ax2.legend(fontsize=9)
ax2.grid(alpha=0.3)

plt.tight_layout(); plt.show()`,
      challenge: 'Add friction/air drag on the spinning stone (drag torque proportional to omega^2). Now there is a terminal angular velocity where drive torque equals drag torque. Which sling length reaches the highest release speed with drag included?',
      successHint: 'Rotational mechanics governs everything that spins: wheels, turbines, flywheels, planets. The sling is a beautiful example because it converts rotational motion directly into linear (projectile) motion at release.',
    },
    {
      title: 'Energy conservation — PE to KE conversions',
      concept: `Energy is never created or destroyed — it only changes form. For the sling stone:

1. **Muscle energy** (chemical) in David's arm converts to **rotational kinetic energy** in the spinning stone
2. At release, rotational KE becomes **translational KE** (1/2 mv^2)
3. During flight, KE converts to **gravitational PE** (mgh) as it rises, then back to KE as it falls
4. At impact, KE converts to **deformation energy** (breaking bone), heat, and sound

The total energy is conserved at each step. The code tracks the energy budget throughout the stone's flight, showing KE and PE as functions of position. At the peak, KE is minimum and PE is maximum. At impact, nearly all energy is kinetic.

Energy conservation is the most powerful tool in physics because it lets you solve problems without knowing the details of the forces — just the initial and final states.`,
      analogy: 'Energy conservation is like a bank account that never gains or loses money — it just moves between checking (KE) and savings (PE). When the stone rises, money moves from checking to savings. When it falls, money comes back. At the peak, checking is at its minimum and savings at its maximum. The total balance never changes.',
      storyConnection: 'David\'s muscles stored chemical energy from the food he ate as a shepherd. He converted it to kinetic energy in the stone. The stone\'s kinetic energy at impact was enough to fracture bone. This unbroken chain — food to muscle to stone to impact — is energy conservation in action across a story that spans seconds.',
      checkQuestion: 'If the stone reaches a maximum height of 3 meters above its launch point, how much kinetic energy did it convert to potential energy at the peak?',
      checkAnswer: 'PE = mgh = 0.05 * 9.8 * 3 = 1.47 J. Out of the initial KE of 22.5 J (at 30 m/s), only 1.47 J converts to PE — about 6.5%. Most of the energy stays as kinetic because at low angles (12-20 degrees), the stone does not rise much. This is another reason low angles are preferred in combat: almost all the launch energy arrives as impact energy.',
      codeIntro: 'Track kinetic and potential energy throughout the stone\'s flight.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v0, angle, h0, g, m = 30, 20, 1.5, 9.8, 0.05
vx = v0 * np.cos(np.radians(angle))
vy = v0 * np.sin(np.radians(angle))

disc = vy**2 + 2*g*h0
t_land = (vy + np.sqrt(disc)) / g
t = np.linspace(0, t_land, 500)

y = h0 + vy*t - 0.5*g*t**2
vy_t = vy - g*t
speed = np.sqrt(vx**2 + vy_t**2)

KE = 0.5 * m * speed**2
PE = m * g * y
TE = KE + PE  # total (should be constant)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

# Energy vs time
ax1.plot(t, KE, 'r', linewidth=2, label='Kinetic Energy (KE)')
ax1.plot(t, PE, 'b', linewidth=2, label='Potential Energy (PE)')
ax1.plot(t, TE, 'w--', linewidth=1.5, alpha=0.7, label='Total Energy')
ax1.fill_between(t, 0, KE, alpha=0.15, color='red')
ax1.fill_between(t, KE, KE+PE, alpha=0.15, color='blue')
ax1.set_xlabel('Time (s)'); ax1.set_ylabel('Energy (J)')
ax1.set_title('Energy Conservation During Flight')
ax1.legend(fontsize=10); ax1.grid(alpha=0.3)

# Stacked area chart
ax2.stackplot(t, KE, PE, colors=['red', 'blue'], alpha=0.6,
              labels=['KE', 'PE'])
ax2.set_xlabel('Time (s)'); ax2.set_ylabel('Energy (J)')
ax2.set_title('Energy Budget (stacked)')
ax2.legend(fontsize=10); ax2.grid(alpha=0.3)

plt.tight_layout(); plt.show()

print(f"Launch KE:  {KE[0]:.2f} J")
print(f"Impact KE:  {KE[-1]:.2f} J")
print(f"Peak PE:    {max(PE):.2f} J")
print(f"Total (constant): {TE[0]:.2f} J")`,
      challenge: 'Add air resistance to the energy tracking. With drag, total mechanical energy (KE+PE) is no longer constant — where does the "lost" energy go? Plot the energy lost to drag as a third curve.',
      successHint: 'Energy conservation is the most powerful principle in physics. It connects seemingly different phenomena: the food David ate, the spinning of his arm, the arc of the stone, and the impact on Goliath. One unbroken chain of energy transformation.',
    },
    {
      title: 'Impact mechanics — coefficient of restitution',
      concept: `When the stone hits Goliath, the collision is **inelastic** — the stone does not bounce back perfectly. The degree of "bounciness" is measured by the **coefficient of restitution** (e):

**e = (separation speed) / (approach speed)**

- e = 1: perfectly elastic (billiard balls, nearly)
- e = 0: perfectly inelastic (the stone sticks, like clay on a wall)
- Real impacts: 0 < e < 1

For a stone hitting bone: e is approximately 0.2-0.4. This means only 20-40% of the approach speed comes back as separation speed. The remaining kinetic energy is absorbed by the target — deforming tissue, fracturing bone, generating heat and sound.

The **absorbed energy** is what causes damage:
E_absorbed = (1/2) m v^2 * (1 - e^2)

A low coefficient of restitution means most energy is absorbed — exactly what you want in a weapon and exactly what you do not want in protective gear.`,
      analogy: 'Drop a basketball (e is about 0.8) — it bounces back almost to the height you dropped it from. Drop a beanbag (e is about 0.1) — it barely bounces. The beanbag absorbs most of the impact energy internally (deforming the beans). A stone hitting a forehead is closer to the beanbag scenario — most energy is absorbed.',
      storyConnection: 'The text says the stone "sank into" Goliath\'s forehead, implying very low restitution (e near 0). The stone did not bounce — it transferred nearly all its kinetic energy into the skull. This is a hallmark of a devastating collision: low e means maximum energy transfer to the target.',
      checkQuestion: 'Why are boxing gloves designed to have a HIGHER coefficient of restitution than a bare fist?',
      checkAnswer: 'A boxing glove (padded, springy) has higher e than a bare fist (hard, inelastic). Higher e means the fist bounces back more — and LESS energy is absorbed by the target\'s head. The glove reduces absorbed energy, reducing brain injury risk. Counterintuitively, a "softer" impact (higher e) is less damaging because less energy is transferred. Gloves protect the receiver, not the puncher.',
      codeIntro: 'Model impact energy absorption for different coefficients of restitution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

m = 0.05; v_impact = 28  # m/s (after air resistance)
KE_initial = 0.5 * m * v_impact**2

e_values = np.linspace(0, 1, 200)
KE_absorbed = KE_initial * (1 - e_values**2)
KE_retained = KE_initial * e_values**2

plt.figure(figsize=(10, 5))
plt.fill_between(e_values, 0, KE_absorbed, alpha=0.4, color='red',
                 label='Energy absorbed by target')
plt.fill_between(e_values, KE_absorbed, KE_initial, alpha=0.4,
                 color='cyan', label='Energy in rebound')
plt.plot(e_values, KE_absorbed, 'r', linewidth=2)

# Mark specific materials
materials = [(0.1, 'Clay/tissue'), (0.3, 'Stone on bone'),
             (0.6, 'Hard rubber'), (0.85, 'Steel ball')]
for e, name in materials:
    ea = KE_initial * (1 - e**2)
    plt.plot(e, ea, 'wo', markersize=8)
    plt.annotate(f'{name}\
{ea:.1f} J absorbed',
                 xy=(e, ea), xytext=(e+0.05, ea+1),
                 fontsize=9, color='yellow',
                 arrowprops=dict(arrowstyle='->', color='yellow'))

plt.xlabel('Coefficient of Restitution (e)', fontsize=12)
plt.ylabel('Energy (J)', fontsize=12)
plt.title(f'Impact Energy Budget (KE = {KE_initial:.1f} J)', fontsize=14)
plt.legend(fontsize=10); plt.grid(alpha=0.3)
plt.show()

print(f"Total KE at impact: {KE_initial:.1f} J")
for e, name in materials:
    absorbed = KE_initial * (1 - e**2)
    print(f"  {name} (e={e}): {absorbed:.1f} J absorbed ({100*absorbed/KE_initial:.0f}%)")`,
      challenge: 'A bulletproof vest works by catching the bullet (e near 0) but spreading the force over a large area AND over a longer time. Model a vest that absorbs 99% of the energy but spreads it over 200 cm^2 over 5 ms. What is the peak pressure? Is it survivable?',
      successHint: 'The coefficient of restitution elegantly quantifies how much energy a collision transfers to the target. Combined with impulse (F*t) and pressure (F/A), you now have three independent ways to analyze impact — each revealing different aspects of the same event.',
    },
    {
      title: 'Ballistic pendulum — measuring projectile speed',
      concept: `How do you measure a projectile's speed before high-speed cameras existed? The **ballistic pendulum**, invented in 1742, is an ingenious solution.

A projectile hits a heavy pendulum bob and embeds in it (perfectly inelastic collision). The pendulum swings upward. By measuring the height it reaches, you can work backward to find the projectile's speed.

The physics uses TWO conservation laws in sequence:
1. **Conservation of momentum** (during collision): m*v = (m+M)*V
2. **Conservation of energy** (during swing): (1/2)(m+M)V^2 = (m+M)gh

Combining: **v = ((m+M)/m) * sqrt(2gh)**

This is elegant: a difficult-to-measure quantity (speed) is converted to an easy-to-measure quantity (height). The code simulates the full sequence: collision, momentum transfer, swing, and height measurement.`,
      analogy: 'Imagine a bowling ball hitting a hanging sandbag. The sandbag swings. A faster ball makes the bag swing higher. If you know the bag\'s weight and measure how high it swings, you can calculate the ball\'s original speed — without ever directly measuring speed. The ballistic pendulum is this principle formalized.',
      storyConnection: 'Could we measure David\'s sling speed with a ballistic pendulum? Set up a heavy clay target on a rope. Sling a stone into it. Measure how high the clay swings. From the formula, we can calculate the stone\'s speed. This was literally how 18th-century military engineers tested weapons — a bridge between ancient arms and modern measurement.',
      checkQuestion: 'Why must the collision be perfectly inelastic (projectile sticks) for this method to work?',
      checkAnswer: 'If the projectile bounces (partially elastic), some kinetic energy stays with the projectile. The pendulum receives LESS momentum than expected, swings less, and you underestimate the speed. For the formula to work, ALL the projectile\'s momentum must transfer to the pendulum. "Perfectly inelastic" guarantees this: the projectile and pendulum move together after collision.',
      codeIntro: 'Simulate a ballistic pendulum and recover the projectile speed from swing height.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Setup
m_stone = 0.05   # projectile mass (kg)
M_bob = 2.0      # pendulum mass (kg)
v_stone = 30     # unknown speed we want to measure

# Step 1: Inelastic collision (momentum conservation)
V_combined = m_stone * v_stone / (m_stone + M_bob)
print(f"=== Ballistic Pendulum ===")
print(f"Stone: {m_stone} kg at {v_stone} m/s")
print(f"Bob: {M_bob} kg at rest")
print(f"After collision: {m_stone+M_bob} kg at {V_combined:.4f} m/s")

# Step 2: Swing up (energy conservation)
g = 9.8
h_max = V_combined**2 / (2 * g)
print(f"Pendulum swings to height: {h_max*100:.2f} cm")

# Step 3: Recover original speed from measured height
v_recovered = (m_stone + M_bob) / m_stone * np.sqrt(2 * g * h_max)
print(f"\
Recovered speed: {v_recovered:.2f} m/s (actual: {v_stone})")
print(f"Error: {abs(v_recovered - v_stone):.6f} m/s")

# Plot: speed recovery for different swing heights
heights = np.linspace(0.001, 0.05, 200)  # measured heights (m)
speeds = (m_stone + M_bob) / m_stone * np.sqrt(2 * g * heights)

plt.figure(figsize=(10, 5))
plt.plot(heights * 100, speeds, 'gold', linewidth=2.5)
plt.plot(h_max * 100, v_stone, 'ro', markersize=12,
         label=f'Our measurement: h={h_max*100:.1f}cm -> v={v_stone}m/s')
plt.xlabel('Swing height (cm)', fontsize=12)
plt.ylabel('Recovered projectile speed (m/s)', fontsize=12)
plt.title('Ballistic Pendulum: Height -> Speed', fontsize=14)
plt.legend(fontsize=10); plt.grid(alpha=0.3)
plt.show()`,
      challenge: 'What if the pendulum bob is only 0.5 kg instead of 2 kg? How does this change the swing height and the sensitivity of the measurement? Is a heavier or lighter bob better for accurate measurements?',
      successHint: 'The ballistic pendulum beautifully chains two conservation laws: momentum (for the collision) and energy (for the swing). This two-step approach — using one conservation law to set up another — is a powerful technique throughout physics.',
    },
    {
      title: 'Biomechanics of throwing — lever arms and muscle force',
      concept: `David's arm is a **lever system** — a biomechanical machine that amplifies the speed of his wrist to launch the stone.

The arm has three main segments:
- **Upper arm** (humerus): rotates at the shoulder
- **Forearm** (radius/ulna): rotates at the elbow
- **Hand + sling**: rotates at the wrist

Each joint adds velocity. The shoulder rotates slowly but has a long lever arm. The wrist rotates fastest but has a short lever arm. The sling extends the effective lever arm of the hand.

The tip speed of each segment adds up: **v_tip = omega_shoulder * L_upper + omega_elbow * L_forearm + omega_wrist * (L_hand + L_sling)**

This is why slingers use their whole body: legs, torso, shoulder, elbow, wrist, and sling form a kinetic chain where each segment adds velocity to the next. The same principle governs baseball pitching, tennis serves, and golf swings.`,
      analogy: 'Think of cracking a whip. The handle moves slowly, but each thinner segment moves faster, until the tip breaks the sound barrier. The human arm works the same way: each joint is a thinner, faster segment of the "whip." The sling is the final, thinnest segment — the crack of the whip.',
      storyConnection: 'David was a shepherd who used his sling daily to ward off predators. Years of practice built the neuromuscular coordination for an optimal kinetic chain — the precise timing of shoulder, elbow, and wrist that maximizes tip speed. His biomechanical skill was honed by survival, not sport.',
      checkQuestion: 'Why can a baseball pitcher throw faster than a football quarterback, even though a football is lighter?',
      checkAnswer: 'A baseball pitcher uses a full overhand kinetic chain: wind-up, leg drive, hip rotation, shoulder rotation, elbow extension, wrist snap. Each segment accelerates the next. A quarterback uses a sidearm/three-quarter motion with less leg drive and hip rotation, engaging fewer segments of the kinetic chain. The pitcher\'s mechanics extract more speed from the same muscles, despite the similar ball weights.',
      codeIntro: 'Model the arm as a multi-segment lever and calculate tip speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Arm segment data
segments = [
    ("Shoulder", 0.30, 15),   # (name, length_m, omega_rad_s)
    ("Elbow",    0.25, 25),
    ("Wrist",    0.10, 40),
    ("Sling",    0.80, 0),    # sling adds length, no extra rotation
]

# Calculate cumulative tip speed
v_cumulative = 0
names, speeds = [], []
print("=== Kinetic Chain: Arm + Sling ===")
for name, length, omega in segments:
    if omega > 0:
        v_add = omega * length
        v_cumulative += v_add
        print(f"  {name}: omega={omega} rad/s x L={length}m "
              f"= +{v_add:.1f} m/s (total: {v_cumulative:.1f})")
    else:
        # Sling extends the last segment's angular velocity
        v_add = segments[-2][2] * length  # wrist omega * sling length
        v_cumulative += v_add
        print(f"  {name}: wrist_omega x L={length}m "
              f"= +{v_add:.1f} m/s (total: {v_cumulative:.1f})")
    names.append(name)
    speeds.append(v_cumulative)

plt.figure(figsize=(10, 5))
colors = ['#ff6b6b', '#ffa94d', '#69db7c', '#4dabf7']
bars = plt.bar(names, speeds, color=colors, edgecolor='white', linewidth=2)

# Add incremental labels
prev = 0
for bar, speed in zip(bars, speeds):
    increment = speed - prev
    plt.text(bar.get_x() + bar.get_width()/2, speed + 0.5,
             f'+{increment:.1f} m/s', ha='center', fontsize=10,
             color='white', fontweight='bold')
    prev = speed

plt.ylabel('Cumulative tip speed (m/s)', fontsize=12)
plt.title('Kinetic Chain: How Each Segment Adds Speed', fontsize=14)
plt.grid(axis='y', alpha=0.3)
plt.show()

print(f"\
Final release speed: {v_cumulative:.1f} m/s "
      f"({v_cumulative*3.6:.0f} km/h)")
print(f"The sling alone contributes {segments[-2][2]*segments[-1][1]:.1f} m/s "
      f"— {100*segments[-2][2]*segments[-1][1]/v_cumulative:.0f}% of total!")`,
      challenge: 'Vary sling length from 0.3m to 1.5m and plot final release speed vs. sling length. At what point does a longer sling stop helping (because the slinger cannot control it)? Add a "control penalty" that reduces wrist omega for longer slings.',
      successHint: 'The kinetic chain principle explains why technique matters more than raw strength. Each joint segment multiplies the previous one\'s contribution. The sling is the ultimate force multiplier — extending the kinetic chain beyond the hand.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced mechanics and numerical methods</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced mechanics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python</>)}
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
            diagram={[NewtonForceDiagram, SineWaveDiagram, EnergyBarChartDiagram, WorkForceDiagram, SlopeInterceptDiagram, DistanceFormulaDiagram][i] ? createElement([NewtonForceDiagram, SineWaveDiagram, EnergyBarChartDiagram, WorkForceDiagram, SlopeInterceptDiagram, DistanceFormulaDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
