import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ThangTaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Euler\'s rotation equations — spinning in 3D',
      concept: `Real sword spins happen in **three dimensions**, not two. The sword can rotate about three axes simultaneously. Euler's rotation equations describe this:

**I_x * d(omega_x)/dt = (I_y - I_z) * omega_y * omega_z + tau_x**

And similarly for y and z axes. These are a system of **coupled differential equations** — the rotation about each axis affects the others.

The key insight: a sword is not symmetric. Its moment of inertia is large about one axis (spinning like a propeller) and small about another (spinning like a drill). This asymmetry creates **gyroscopic precession** — the sword wobbles if the spin axis is not aligned with a principal axis.

We solve these equations numerically using Euler's method, stepping through time.`,
      analogy: 'Gyroscopic precession is why a spinning top does not fall over — instead, it slowly wobbles in a cone. The faster it spins, the less it wobbles. A spinning sword has the same property: a fast spin stabilises the blade, but any imperfection in the spin creates a slow wobble that the warrior must compensate for.',
      storyConnection: 'Advanced Thang-Ta practitioners perform three-dimensional spinning patterns where the sword rotates about multiple axes simultaneously. These complex patterns are not just showmanship — they exploit gyroscopic stability to maintain control during rapid transitions.',
      checkQuestion: 'Why does a fast-spinning sword feel more stable than a slowly spinning one?',
      checkAnswer: 'A fast spin stores more angular momentum L. Any perturbation (air resistance, uneven grip) creates a torque that tries to change L. But changing a large L requires a proportionally large torque. So a fast-spinning sword resists disturbances — it "fights back" against attempts to deflect it. This is gyroscopic stability.',
      codeIntro: 'Solve Euler\'s rotation equations for a spinning Thang-Ta sword in 3D.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Principal moments of inertia for a sword (asymmetric body)
Ix = 0.001    # about blade axis (very small — sword is thin)
Iy = 0.08     # about flat side
Iz = 0.082    # about edge-on axis

# Initial angular velocities (rad/s)
wx0 = 0.5     # slight spin about blade axis
wy0 = 0.1     # slight wobble
wz0 = 20.0    # main spin (like a propeller)

# Euler's rotation equations
dt = 0.001
t_max = 2.0
steps = int(t_max / dt)

wx = np.zeros(steps)
wy = np.zeros(steps)
wz = np.zeros(steps)
t = np.zeros(steps)

wx[0], wy[0], wz[0] = wx0, wy0, wz0

for i in range(1, steps):
    t[i] = i * dt
    # Euler's equations (torque-free rotation)
    dwx = (Iy - Iz) / Ix * wy[i-1] * wz[i-1]
    dwy = (Iz - Ix) / Iy * wz[i-1] * wx[i-1]
    dwz = (Ix - Iy) / Iz * wx[i-1] * wy[i-1]

    wx[i] = wx[i-1] + dwx * dt
    wy[i] = wy[i-1] + dwy * dt
    wz[i] = wz[i-1] + dwz * dt

# Angular momentum magnitude (should be conserved)
L = np.sqrt((Ix*wx)**2 + (Iy*wy)**2 + (Iz*wz)**2)

fig, axes = plt.subplots(2, 2, figsize=(10, 8))
for row in axes:
    for ax in row:
        ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

axes[0,0].plot(t, wx, color='#ef4444', linewidth=1, label='ωx (blade axis)')
axes[0,0].plot(t, wy, color='#34d399', linewidth=1, label='ωy (flat)')
axes[0,0].set_title('Wobble Components', color='white', fontsize=11, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[0,0].tick_params(colors='white')

axes[0,1].plot(t, wz, color='#3b82f6', linewidth=1)
axes[0,1].set_title('Main Spin ωz', color='white', fontsize=11, fontweight='bold')
axes[0,1].tick_params(colors='white')

axes[1,0].plot(wx, wy, color='#f59e0b', linewidth=0.5, alpha=0.7)
axes[1,0].set_title('Wobble Pattern (ωx vs ωy)', color='white', fontsize=11, fontweight='bold')
axes[1,0].set_xlabel('ωx', color='white')
axes[1,0].set_ylabel('ωy', color='white')
axes[1,0].tick_params(colors='white')
axes[1,0].set_aspect('equal')

axes[1,1].plot(t, L, color='#a78bfa', linewidth=1)
axes[1,1].set_title('|L| Conservation Check', color='white', fontsize=11, fontweight='bold')
axes[1,1].set_xlabel('Time (s)', color='white')
axes[1,1].tick_params(colors='white')

for ax in axes.flat:
    ax.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('euler_rotation.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print(f"Main spin: {wz0/(2*np.pi):.1f} rev/s")
print(f"Wobble amplitude: ωx={np.max(np.abs(wx)):.2f}, ωy={np.max(np.abs(wy)):.2f} rad/s")
print(f"|L| conservation: initial={L[0]:.4f}, final={L[-1]:.4f}, drift={abs(L[-1]-L[0])/L[0]*100:.2f}%")`,
      challenge: 'Double the main spin rate (wz0=40). Does the wobble amplitude change? What happens if you make the sword more symmetric (Iy closer to Iz)?',
      successHint: 'Euler\'s rotation equations govern everything that spins in 3D: gyroscopes, satellites, spinning tops, and weapons. You just solved the same equations that aerospace engineers use for satellite attitude control.',
    },
    {
      title: 'Impact mechanics — what happens when the sword strikes',
      concept: `When a spinning sword strikes a target, the collision involves both **linear** and **angular** impulse. The impact force depends on:

1. **Rotational kinetic energy** before impact: KE = 0.5 x I x omega²
2. **Contact time**: shorter contact = higher peak force
3. **Coefficient of restitution**: how "bouncy" the collision is (e = 0 for perfectly inelastic, e = 1 for elastic)
4. **Point of impact** along the blade: there is a **centre of percussion** (sweet spot) where the impact feels cleanest

At the centre of percussion, the reaction force at the hand is **zero** during impact. This is why skilled warriors aim to strike with a specific part of the blade — it maximises energy transfer while minimising jarring to the hand.`,
      analogy: 'The centre of percussion is like the "sweet spot" on a tennis racket or cricket bat. Hit the ball there, and your hand feels nothing — all energy transfers to the ball. Hit off-centre, and your hand stings. The sword has the same sweet spot.',
      storyConnection: 'The story describes how the master strikes a coconut cleanly in two without the sword bouncing or jarring. This is not just technique — it is physics. The master strikes at the centre of percussion with optimal speed, transferring maximum energy to the target.',
      checkQuestion: 'Why does a shorter contact time result in higher peak force?',
      checkAnswer: 'Impulse = Force x Time = change in momentum. For a given momentum change (fixed by the collision), if time decreases, force must increase proportionally. A 0.001s contact delivers 10x the peak force of a 0.01s contact. This is why sharp, rigid blades cut better than dull, flexible ones — they have shorter contact times.',
      codeIntro: 'Simulate sword impact at different blade positions and find the centre of percussion.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sword properties
m = 1.2            # mass (kg)
L = 0.8            # length (m)
I_pivot = (1.0/3) * m * L**2  # moment of inertia about handle end
com = L / 2        # centre of mass from pivot

# Centre of percussion (for rod pivoted at end)
# cop = I / (m * com) = (mL²/3) / (m * L/2) = 2L/3
cop = I_pivot / (m * com)

omega0 = 20.0      # angular velocity at impact (rad/s)
e = 0.1            # coefficient of restitution (nearly inelastic — cutting)

# Impact analysis at different blade positions
positions = np.linspace(0.2, L, 50)  # distance from handle

# For each position, calculate:
# - velocity at impact point: v = omega * r
# - reaction force at hand (from rigid body collision)
# - energy transferred to target

fig, axes = plt.subplots(1, 3, figsize=(12, 5))
for ax in axes:
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

v_impact = omega0 * positions
contact_time = 0.005  # seconds

# Hand reaction force calculation
# F_hand = m * a_com - F_impact at that point
# For the CoP, F_hand = 0
hand_force = np.abs(m * omega0**2 * com * (1 - positions / cop))

# Energy transferred (simplified)
KE_initial = 0.5 * I_pivot * omega0**2
energy_transfer = KE_initial * (1 - e**2) * (positions / L)**2
energy_transfer = np.minimum(energy_transfer, KE_initial)

axes[0].plot(positions * 100, v_impact, color='#34d399', linewidth=2)
axes[0].set_title('Impact Velocity', color='white', fontsize=11, fontweight='bold')
axes[0].set_xlabel('Position along blade (cm)', color='white')
axes[0].set_ylabel('Speed (m/s)', color='white')
axes[0].tick_params(colors='white')

axes[1].plot(positions * 100, hand_force, color='#ef4444', linewidth=2)
axes[1].axvline(x=cop*100, color='#f59e0b', linestyle='--', linewidth=2, label=f'CoP = {cop*100:.0f}cm')
axes[1].set_title('Hand Reaction Force', color='white', fontsize=11, fontweight='bold')
axes[1].set_xlabel('Position along blade (cm)', color='white')
axes[1].set_ylabel('Force (N)', color='white')
axes[1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
axes[1].tick_params(colors='white')

axes[2].plot(positions * 100, energy_transfer, color='#a78bfa', linewidth=2)
axes[2].axvline(x=cop*100, color='#f59e0b', linestyle='--', linewidth=2, label='CoP')
axes[2].set_title('Energy Transferred', color='white', fontsize=11, fontweight='bold')
axes[2].set_xlabel('Position along blade (cm)', color='white')
axes[2].set_ylabel('Energy (J)', color='white')
axes[2].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
axes[2].tick_params(colors='white')

for ax in axes:
    ax.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('impact.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print(f"Centre of Percussion: {cop:.3f}m ({cop*100:.0f}cm from handle)")
print(f"This is {cop/L*100:.0f}% along the blade")
print(f"\
At CoP: v={omega0*cop:.1f} m/s, hand force ≈ 0 N")
print(f"At tip:  v={omega0*L:.1f} m/s, hand force = {hand_force[-1]:.0f} N")
print(f"\
Total KE available: {KE_initial:.1f} J")`,
      challenge: 'What if the sword has a weighted tip (centre of mass shifts from L/2 to 0.6L)? Recalculate the centre of percussion. How does tip-weighting affect the sweet spot?',
      successHint: 'The centre of percussion is real physics that every martial artist, cricketer, and baseball player exploits instinctively. You just derived it mathematically.',
    },
    {
      title: 'Multi-body dynamics — two-sworded combat',
      concept: `Advanced Thang-Ta uses two swords simultaneously. This creates a **multi-body dynamics** problem: two independent rotating systems connected through the warrior's body.

The warrior must:
- Apply torque to both swords independently
- Keep total angular momentum manageable (torso twist)
- Coordinate timing so both swords are effective
- Manage the torso counter-rotation (Newton's third law)

When the right sword swings clockwise, it creates a torque on the body that tries to rotate the torso counter-clockwise. The left sword can compensate — swinging in the opposite direction to balance the torso. This is called **dynamic balance**.`,
      analogy: 'Dual-sword fighting is like juggling. Each hand operates independently, but the whole body must coordinate to stay balanced. A juggler who focuses on one hand drops the other ball. A dual swordsman who focuses on one sword loses control of the other — and their balance.',
      storyConnection: 'The story describes the legendary dual-sword dance where both blades spin in opposite directions, creating a defensive dome around the warrior. This requires extraordinary coordination — and perfect understanding of how opposing angular momenta cancel.',
      checkQuestion: 'If both swords spin in the same direction, what happens to the warrior\'s body?',
      checkAnswer: 'The body experiences the sum of both torques in the same direction. The torso twists violently to compensate (Newton\'s third law). This is why dual-sword techniques almost always use opposite rotations — the angular momenta partially cancel, keeping the torso stable.',
      codeIntro: 'Simulate dual-sword dynamics with torso coupling.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Dual sword system
I_sword = 0.085      # moment of inertia per sword
I_torso = 3.0        # torso moment of inertia (much larger)

# Scenario 1: Both swords spin the same direction
# Scenario 2: Swords spin in opposite directions

dt = 0.01
t_max = 3.0
steps = int(t_max / dt)
t = np.arange(steps) * dt

def simulate_dual(omega_R_input, omega_L_input, label):
    """Simulate dual-sword system with torso coupling."""
    omega_R = np.zeros(steps)
    omega_L = np.zeros(steps)
    omega_torso = np.zeros(steps)

    omega_R[0] = omega_R_input
    omega_L[0] = omega_L_input

    for i in range(1, steps):
        # Applied torques (sinusoidal — rhythmic swinging)
        tau_R = 2.0 * np.sin(2 * np.pi * 1.5 * t[i])
        tau_L = 2.0 * np.sin(2 * np.pi * 1.5 * t[i] + np.pi * (0 if label == 'Same' else 1))

        # Torso receives reaction torques
        tau_torso = -(tau_R + tau_L)  # Newton's third law
        damping = -0.5 * omega_torso[i-1]  # body damping

        omega_R[i] = omega_R[i-1] + tau_R / I_sword * dt
        omega_L[i] = omega_L[i-1] + tau_L / I_sword * dt
        omega_torso[i] = omega_torso[i-1] + (tau_torso + damping) / I_torso * dt

    return omega_R, omega_L, omega_torso

fig, axes = plt.subplots(2, 2, figsize=(11, 8))
for row in axes:
    for ax in row:
        ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

for idx, (mode, ax_row) in enumerate([('Same', axes[0]), ('Opposite', axes[1])]):
    wR, wL, wT = simulate_dual(10, 10 * (1 if mode == 'Same' else -1), mode)

    ax_row[0].plot(t, wR, color='#ef4444', linewidth=1.5, label='Right sword')
    ax_row[0].plot(t, wL, color='#3b82f6', linewidth=1.5, label='Left sword')
    ax_row[0].set_title(f'{mode} Direction — Sword ω', color='white', fontsize=11, fontweight='bold')
    ax_row[0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
    ax_row[0].tick_params(colors='white')
    ax_row[0].grid(True, alpha=0.2, color='white')

    ax_row[1].plot(t, wT, color='#f59e0b', linewidth=2)
    ax_row[1].set_title(f'{mode} Direction — Torso ω', color='white', fontsize=11, fontweight='bold')
    ax_row[1].tick_params(colors='white')
    ax_row[1].grid(True, alpha=0.2, color='white')

    torso_rms = np.sqrt(np.mean(wT**2))
    print(f"{mode} direction: torso RMS angular velocity = {torso_rms:.3f} rad/s")

axes[1][0].set_xlabel('Time (s)', color='white')
axes[1][1].set_xlabel('Time (s)', color='white')

plt.tight_layout()
plt.savefig('dual_sword.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("\
Opposite-direction swords create much less torso disturbance!")
print("This is why dual-sword katas almost always use counter-rotation.")`,
      challenge: 'What if the two swords have different masses (right=1.2kg, left=0.8kg)? How does the torso disturbance change for opposite-direction spinning? Can you adjust the left sword speed to compensate?',
      successHint: 'Multi-body dynamics with coupling is the foundation of robotics, vehicle dynamics, and biomechanics. You just modelled a system with three interacting rigid bodies.',
    },
    {
      title: 'Energy efficiency of a complete kata',
      concept: `A Thang-Ta **kata** (form) is a sequence of moves. Some katas are efficient — most energy goes into the sword motion. Others waste energy on unnecessary body motion, air resistance, and muscle co-contraction.

We can model a kata as a sequence of **states** (angular velocity, position) connected by **transitions** (accelerations). The total energy cost is:

E_total = Sum of (0.5 * I * delta_omega²) for each transition
         + muscle_inefficiency_factor * E_total
         + air_drag losses

A well-designed kata minimises energy waste by:
- Using momentum from one move to power the next
- Avoiding hard stops (which waste kinetic energy)
- Flowing through the centre of percussion on each strike`,
      analogy: 'An efficient kata is like efficient driving. Constant speed (cruising) uses less fuel than stop-and-go. Coasting into stops rather than braking saves energy. A kata that flows smoothly from move to move is "fuel-efficient" — the warrior can fight longer without tiring.',
      storyConnection: 'The story describes how the grandmaster performs a 100-move kata without breaking a sweat, while students are exhausted after 20 moves of the same kata. The difference is not fitness — it is efficiency. The master wastes no energy on unnecessary stops and starts.',
      checkQuestion: 'Why do smooth, flowing katas use less energy than sharp, staccato ones?',
      checkAnswer: 'Every time the sword stops and restarts, ALL its kinetic energy is lost to muscles (braking) and must be regenerated (accelerating). A flowing kata converts the kinetic energy of one move into the next, like a pendulum. The sword is never fully stopped, so energy is recycled rather than wasted.',
      codeIntro: 'Model and compare the energy efficiency of two Thang-Ta katas.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class Kata:
    def __init__(self, name, moves):
        self.name = name
        self.moves = moves  # list of (omega_start, omega_end, duration) per move
        self.I = 0.085      # sword moment of inertia

    def calculate_energy(self):
        total_energy = 0
        energies = []
        for omega_start, omega_end, duration in self.moves:
            # Energy to change angular velocity
            delta_omega = abs(omega_end - omega_start)
            E = 0.5 * self.I * delta_omega**2
            # Add muscle inefficiency (muscles are ~25% efficient)
            E_metabolic = E / 0.25
            total_energy += E_metabolic
            energies.append(E_metabolic)
        return total_energy, energies

# Staccato kata — hard stops between each move
staccato_moves = [
    (0, 20, 0.3),    # accelerate
    (20, 0, 0.2),    # hard stop
    (0, -18, 0.3),   # reverse
    (-18, 0, 0.2),   # hard stop
    (0, 22, 0.25),   # accelerate
    (22, 0, 0.15),   # hard stop
    (0, -20, 0.3),   # reverse
    (-20, 0, 0.2),   # hard stop
]

# Flowing kata — momentum carries between moves
flowing_moves = [
    (0, 20, 0.3),     # accelerate
    (20, 18, 0.1),    # slight decel
    (18, -16, 0.4),   # smooth reversal (momentum helps)
    (-16, -18, 0.1),  # slight accel
    (18, 20, 0.4),    # smooth reversal
    (20, -18, 0.4),   # smooth reversal
    (-18, 15, 0.4),   # smooth reversal
    (15, 0, 0.5),     # gentle stop
]

kata_staccato = Kata("Staccato (stop-start)", staccato_moves)
kata_flowing = Kata("Flowing (continuous)", flowing_moves)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

for kata, color, ax in [(kata_staccato, '#ef4444', ax1), (kata_flowing, '#34d399', ax2)]:
    E_total, energies = kata.calculate_energy()
    t = 0
    times, omegas = [0], [kata.moves[0][0]]
    for omega_s, omega_e, dur in kata.moves:
        times.extend([t, t + dur])
        omegas.extend([omega_s, omega_e])
        t += dur

    ax.plot(times, omegas, color=color, linewidth=2)
    ax.fill_between(times, omegas, 0, alpha=0.15, color=color)
    ax.set_title(f'{kata.name}\
Energy: {E_total:.0f} J', color='white', fontsize=11, fontweight='bold')
    ax.set_xlabel('Time (s)', color='white')
    ax.set_ylabel('Angular velocity (rad/s)', color='white')
    ax.tick_params(colors='white')
    ax.grid(True, alpha=0.2, color='white')
    ax.axhline(y=0, color='white', alpha=0.3)

plt.tight_layout()
plt.savefig('kata_efficiency.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

E_staccato, _ = kata_staccato.calculate_energy()
E_flowing, _ = kata_flowing.calculate_energy()
print(f"Staccato kata energy: {E_staccato:.0f} J (metabolic)")
print(f"Flowing kata energy:  {E_flowing:.0f} J (metabolic)")
print(f"Efficiency gain: {(1 - E_flowing/E_staccato)*100:.0f}% less energy for flowing style")
print(f"\
A master using the flowing style can fight {E_staccato/E_flowing:.1f}x longer!")`,
      challenge: 'Design your own kata with 10 moves that is even more efficient than the flowing kata. The constraint: every move must reach at least omega=15 rad/s (to be combat-effective). What is the minimum energy cost?',
      successHint: 'Energy efficiency analysis applies to everything from martial arts to electric vehicles to industrial robotics. The principle is universal: smooth transitions waste less energy than abrupt ones.',
    },
    {
      title: 'Inverse dynamics — from motion to muscle forces',
      concept: `**Inverse dynamics** is the opposite of forward kinematics. Instead of asking "given the forces, what is the motion?", we ask "given the motion, what forces were required?"

From motion-capture data (joint angles over time), we calculate:
1. Angular accelerations (second derivative of angle)
2. Required torques at each joint (tau = I * alpha + coupling terms)
3. Muscle forces (from joint torques and lever arms)

This is how **sports biomechanics** works. Record a master's movement, run inverse dynamics, and discover exactly which muscles generate the power and when.`,
      analogy: 'Inverse dynamics is like reverse-engineering a recipe from the finished dish. A chef tastes a dish and deduces the ingredients and cooking method. A biomechanist watches a movement and deduces the muscle forces and timing that created it.',
      storyConnection: 'The story describes how modern sports scientists studied Thang-Ta masters using motion capture cameras. They discovered that masters use different muscle activation patterns than beginners — recruiting proximal muscles first and distal muscles last, creating the kinetic chain in the optimal sequence.',
      checkQuestion: 'If a joint has zero angular acceleration, does that mean zero muscle torque?',
      checkAnswer: 'Not necessarily. Zero angular acceleration means the net torque is zero — but gravity, friction, and the weight of distal segments all create torques that the muscles must counteract. Holding a sword still at arm\'s length requires significant muscle force even though nothing is moving.',
      codeIntro: 'Perform inverse dynamics analysis on a Thang-Ta strike to find the required joint torques.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Motion capture data: joint angles over time for a strike
dt = 0.01
t = np.arange(0, 0.6, dt)
n = len(t)

# Shoulder angle (radians) — smooth strike
theta_shoulder = 2.0 - 1.5 * (1 - np.exp(-5*t)) * np.sin(3*t + 0.5)
# Elbow angle
theta_elbow = -1.2 + 0.9 * (1 - np.exp(-4*t)) * np.cos(4*t)
# Wrist angle
theta_wrist = 0.3 - 1.1 * (1 - np.exp(-6*t)) * np.sin(5*t)

# Numerical differentiation: angular velocity and acceleration
def differentiate(signal, dt):
    vel = np.gradient(signal, dt)
    acc = np.gradient(vel, dt)
    return vel, acc

omega_s, alpha_s = differentiate(theta_shoulder, dt)
omega_e, alpha_e = differentiate(theta_elbow, dt)
omega_w, alpha_w = differentiate(theta_wrist, dt)

# Simplified inverse dynamics (ignoring coupling for clarity)
# Segment masses and lengths
m_ua, L_ua = 2.5, 0.30    # upper arm
m_fa, L_fa = 1.5, 0.28    # forearm
m_sw, L_sw = 1.2, 0.65    # sword

I_ua = (1.0/3) * m_ua * L_ua**2
I_fa = (1.0/3) * m_fa * L_fa**2
I_sw = (1.0/3) * m_sw * L_sw**2

# Required torques (simplified — each joint supports everything distal)
tau_wrist = I_sw * alpha_w
tau_elbow = I_fa * alpha_e + I_sw * (alpha_e + alpha_w)  # supports forearm + sword
tau_shoulder = I_ua * alpha_s + (I_fa + I_sw) * (alpha_s + alpha_e)

fig, axes = plt.subplots(2, 2, figsize=(11, 8))
for row in axes:
    for ax in row:
        ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

axes[0,0].plot(t, np.degrees(theta_shoulder), color='#ef4444', label='Shoulder')
axes[0,0].plot(t, np.degrees(theta_elbow), color='#34d399', label='Elbow')
axes[0,0].plot(t, np.degrees(theta_wrist), color='#3b82f6', label='Wrist')
axes[0,0].set_title('Joint Angles', color='white', fontsize=11, fontweight='bold')
axes[0,0].set_ylabel('Angle (degrees)', color='white')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[0,0].tick_params(colors='white')

axes[0,1].plot(t, omega_s, color='#ef4444', label='Shoulder')
axes[0,1].plot(t, omega_e, color='#34d399', label='Elbow')
axes[0,1].plot(t, omega_w, color='#3b82f6', label='Wrist')
axes[0,1].set_title('Angular Velocities', color='white', fontsize=11, fontweight='bold')
axes[0,1].set_ylabel('ω (rad/s)', color='white')
axes[0,1].tick_params(colors='white')

axes[1,0].plot(t, tau_shoulder, color='#ef4444', linewidth=2, label='Shoulder')
axes[1,0].plot(t, tau_elbow, color='#34d399', linewidth=2, label='Elbow')
axes[1,0].plot(t, tau_wrist, color='#3b82f6', linewidth=2, label='Wrist')
axes[1,0].set_title('Required Joint Torques', color='white', fontsize=11, fontweight='bold')
axes[1,0].set_xlabel('Time (s)', color='white')
axes[1,0].set_ylabel('Torque (Nm)', color='white')
axes[1,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[1,0].tick_params(colors='white')

# Power at each joint
P_shoulder = tau_shoulder * omega_s
P_elbow = tau_elbow * omega_e
P_wrist = tau_wrist * omega_w
axes[1,1].plot(t, P_shoulder, color='#ef4444', label=f'Shoulder (peak {np.max(np.abs(P_shoulder)):.0f}W)')
axes[1,1].plot(t, P_elbow, color='#34d399', label=f'Elbow (peak {np.max(np.abs(P_elbow)):.0f}W)')
axes[1,1].plot(t, P_wrist, color='#3b82f6', label=f'Wrist (peak {np.max(np.abs(P_wrist)):.0f}W)')
axes[1,1].set_title('Joint Power', color='white', fontsize=11, fontweight='bold')
axes[1,1].set_xlabel('Time (s)', color='white')
axes[1,1].set_ylabel('Power (W)', color='white')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
axes[1,1].tick_params(colors='white')

for ax in axes.flat:
    ax.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('inverse_dynamics.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("Peak torques:")
print(f"  Shoulder: {np.max(np.abs(tau_shoulder)):.1f} Nm")
print(f"  Elbow:    {np.max(np.abs(tau_elbow)):.1f} Nm")
print(f"  Wrist:    {np.max(np.abs(tau_wrist)):.1f} Nm")
print(f"\
Shoulder generates {np.max(np.abs(tau_shoulder))/np.max(np.abs(tau_wrist)):.1f}x more torque than wrist")`,
      challenge: 'Add gravity effects: each segment exerts a gravitational torque m*g*L_com*cos(theta) on its joint. Recalculate the torques. How much does gravity change the picture?',
      successHint: 'Inverse dynamics is the core tool of biomechanics, rehabilitation engineering, and sports science. You just performed the same analysis that Olympic coaches use to optimise athlete performance.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Rotational Mechanics</span>
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
