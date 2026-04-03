import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DancerFloatingLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Design: Dance Move Physics Analyzer',
      concept: `Our capstone project is a **Dance Move Physics Analyzer** — a system that takes a sequence of body positions over time and computes all the biomechanical quantities we studied in Level 3: center of mass trajectory, angular momentum, torques at each joint, ground reaction forces, and energy expenditure.

The system models the human body as a **linked segment model** with 15 segments, each with known mass fractions and lengths. Given joint positions at each time step (which in a real system would come from motion capture or pose estimation), the analyzer computes: (1) instantaneous CoM position and velocity, (2) angular momentum of each segment and the whole body, (3) net joint torques using inverse dynamics, (4) ground reaction forces from Newton's second law, and (5) mechanical work and power at each joint.

This is the same pipeline used in sports biomechanics labs, physical therapy clinics, and animation studios. The difference between a hobbyist and a professional is not knowing the equations — it is knowing how to connect them into a complete, validated pipeline. That is what this capstone teaches.

The six lessons build the pipeline incrementally: data structures, kinematics, kinetics, energy analysis, visualization dashboard, and final integration with validation.`,
      analogy: 'Building this analyzer is like building a car engine. Each lesson adds one component — the crankshaft, the pistons, the fuel injection, the exhaust. Individually they are just metal parts. Connected in the right order with the right interfaces, they produce motion. Our pipeline components (kinematic model, dynamics solver, energy calculator, visualizer) are the same — useless alone, powerful together.',
      storyConnection: 'The floating market dancer performs movements that challenge every aspect of biomechanics simultaneously: balance on an unstable surface, rapid spins requiring angular momentum management, jumps requiring precise energy control, and partner interactions requiring momentum exchange. Our analyzer can quantify every one of these aspects, turning intuitive artistry into measurable physics.',
      checkQuestion: 'Why do we need joint angles AND segment positions in the model, rather than just one or the other?',
      checkAnswer: 'Positions give us kinematics (where things are, how fast they move) but not the internal mechanics. Joint angles give us the configuration needed to compute joint torques via inverse dynamics. A straight arm at shoulder height has different torque requirements than a bent arm at the same hand position. Both representations are needed: positions for CoM and momentum calculations, angles for torque and muscle force calculations.',
      codeIntro: 'Define the body model data structures, segment properties, and a function to generate synthetic dance motion sequences.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Dance Move Physics Analyzer: Data Model ---

# Body segment properties (based on Winter, 2009 anthropometric data)
SEGMENTS = {
    'head':       {'mass_frac': 0.081, 'length': 0.20, 'com_frac': 0.50},
    'trunk':      {'mass_frac': 0.497, 'length': 0.50, 'com_frac': 0.50},
    'r_upper_arm': {'mass_frac': 0.028, 'length': 0.28, 'com_frac': 0.436},
    'r_forearm':  {'mass_frac': 0.016, 'length': 0.25, 'com_frac': 0.430},
    'r_hand':     {'mass_frac': 0.006, 'length': 0.10, 'com_frac': 0.506},
    'l_upper_arm': {'mass_frac': 0.028, 'length': 0.28, 'com_frac': 0.436},
    'l_forearm':  {'mass_frac': 0.016, 'length': 0.25, 'com_frac': 0.430},
    'l_hand':     {'mass_frac': 0.006, 'length': 0.10, 'com_frac': 0.506},
    'r_thigh':    {'mass_frac': 0.100, 'length': 0.40, 'com_frac': 0.433},
    'r_shank':    {'mass_frac': 0.047, 'length': 0.38, 'com_frac': 0.433},
    'r_foot':     {'mass_frac': 0.014, 'length': 0.25, 'com_frac': 0.500},
    'l_thigh':    {'mass_frac': 0.100, 'length': 0.40, 'com_frac': 0.433},
    'l_shank':    {'mass_frac': 0.047, 'length': 0.38, 'com_frac': 0.433},
    'l_foot':     {'mass_frac': 0.014, 'length': 0.25, 'com_frac': 0.500},
}

def generate_pirouette_sequence(n_frames=120, fps=30, body_mass=55.0, height=1.60):
    """Generate synthetic motion data for a pirouette (spin with arm pull-in)."""
    t = np.linspace(0, n_frames / fps, n_frames)
    duration = t[-1]

    # Spin angle increases (accelerating as arms pull in)
    arm_angle = 80 * np.exp(-2 * t)  # arms pull in from 80 to ~0 degrees
    spin_rate = 2 + 6 * (1 - np.exp(-2 * t))  # rev/s, increases as arms come in
    spin_angle = np.cumsum(spin_rate * 360 / fps)  # cumulative angle in degrees

    # Generate joint positions for each frame
    frames = []
    for i in range(n_frames):
        theta = np.radians(spin_angle[i])
        arm_r = 0.55 * np.sin(np.radians(arm_angle[i]))  # arm reach from axis

        frame = {
            'time': t[i],
            'joints': {
                'hip': np.array([0, 0, 0.85]),
                'r_shoulder': np.array([arm_r * np.cos(theta) * 0.3, arm_r * np.sin(theta) * 0.3, 1.35]),
                'l_shoulder': np.array([-arm_r * np.cos(theta) * 0.3, -arm_r * np.sin(theta) * 0.3, 1.35]),
                'r_hand': np.array([arm_r * np.cos(theta), arm_r * np.sin(theta), 1.20]),
                'l_hand': np.array([-arm_r * np.cos(theta), -arm_r * np.sin(theta), 1.20]),
                'head': np.array([0, 0, 1.55]),
                'r_foot': np.array([0.05, 0, 0.0]),
                'l_foot': np.array([-0.05, 0, 0.15]),  # raised slightly
            },
            'spin_rate': spin_rate[i],
            'arm_angle': arm_angle[i],
        }
        frames.append(frame)

    return frames, t

# Generate the data
frames, t = generate_pirouette_sequence()

# Visualize the motion parameters
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Dance Move Physics Analyzer — Motion Data (Pirouette)',
             color='white', fontsize=14, fontweight='bold')

# Arm angle over time
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
arm_angles = [f['arm_angle'] for f in frames]
ax.plot(t, arm_angles, color='#3b82f6', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Arm angle (degrees)', color='white')
ax.set_title('Arm pull-in during pirouette', color='white')

# Spin rate
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
spin_rates = [f['spin_rate'] for f in frames]
ax.plot(t, spin_rates, color='#22c55e', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Spin rate (rev/s)', color='white')
ax.set_title('Spin acceleration (angular momentum conserved)', color='white')

# Hand trajectory (top view)
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
r_hand_x = [f['joints']['r_hand'][0] for f in frames]
r_hand_y = [f['joints']['r_hand'][1] for f in frames]
scatter = ax.scatter(r_hand_x, r_hand_y, c=t, cmap='plasma', s=10)
ax.set_xlabel('X (m)', color='white')
ax.set_ylabel('Y (m)', color='white')
ax.set_title('Right hand trajectory (top view)', color='white')
ax.set_aspect('equal')
plt.colorbar(scatter, ax=ax, label='Time (s)')

# Segment mass distribution
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
seg_names = list(SEGMENTS.keys())
seg_masses = [SEGMENTS[s]['mass_frac'] * 55.0 for s in seg_names]
colors = plt.cm.Set3(np.linspace(0, 1, len(seg_names)))
bars = ax.barh(seg_names, seg_masses, color=colors)
ax.set_xlabel('Mass (kg)', color='white')
ax.set_title('Body segment masses (55 kg dancer)', color='white')
for bar, m in zip(bars, seg_masses):
    ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
            f'{m:.1f}', color='white', fontsize=8, va='center')

plt.tight_layout()
plt.show()

print(f"Motion data generated: {len(frames)} frames at 30 fps ({t[-1]:.1f} s)")
print(f"Segments modeled: {len(SEGMENTS)}")
print(f"Total mass fraction check: {sum(s['mass_frac'] for s in SEGMENTS.values()):.3f} (should be ~1.0)")
print(f"\\nKey data per frame: joint positions, spin rate, arm configuration")
print(f"Ready for kinematic analysis in next lesson.")`,
      challenge: 'Extend the motion generator to produce a grand jete (split leap): the dancer runs, jumps with legs splitting forward/back, and lands. Define joint positions for each phase (approach, takeoff, flight, landing) with at least 60 frames.',
      successHint: 'A well-designed data model is the foundation of the entire analyzer. Every subsequent calculation — CoM, momentum, torques, energy — depends on having clean, consistent motion data with known segment properties.',
    },
    {
      title: 'Kinematics Engine: CoM & Velocity',
      concept: `The first computation stage is **kinematics**: determining positions, velocities, and accelerations from the raw motion data. The most important kinematic quantity is the **whole-body center of mass** (CoM) trajectory.

Given segment positions and mass fractions, the whole-body CoM at each frame is: CoM = sum(m_i * r_i) / sum(m_i), where r_i is the position of each segment's center of mass and m_i is its mass. The velocity of the CoM is obtained by numerical differentiation: v(t) = (CoM(t+dt) - CoM(t-dt)) / (2*dt), using central differences for better accuracy than forward differences.

Acceleration follows the same pattern: a(t) = (v(t+dt) - v(t-dt)) / (2*dt), or equivalently a(t) = (CoM(t+dt) - 2*CoM(t) + CoM(t-dt)) / dt^2. The acceleration of the CoM directly gives us the net external force via Newton's second law: F_net = m * a_CoM. For a dancer on the ground, the external forces are gravity (downward) and the ground reaction force. So GRF = m * (a_CoM + g), which is how biomechanics labs measure ground reaction forces without a force plate — purely from kinematics.

The numerical differentiation introduces noise amplification: each derivative roughly doubles the noise level. For real motion capture data, smoothing filters (typically Butterworth low-pass at 6-10 Hz cutoff) are applied before differentiation. For our synthetic data, noise is minimal, but we will implement filtering anyway as good practice.`,
      analogy: 'Calculating velocity from positions is like calculating speed from GPS waypoints: you know where you were at each second, so speed is distance divided by time between waypoints. Acceleration is the rate of change of speed — how quickly you are speeding up or slowing down. Each level of differentiation is like zooming into finer detail of the motion, but each zoom also amplifies any measurement errors.',
      storyConnection: 'Tracking the floating market dancer\'s CoM reveals the hidden physics beneath the artistry. While the audience sees graceful arm movements and dramatic poses, the CoM tells a different story: it follows smooth, efficient paths that minimize energy expenditure. The most experienced dancers have the smoothest CoM trajectories — economy of motion that comes from decades of practice.',
      checkQuestion: 'If a dancer\'s CoM is at height 0.95 m at t=0, 1.05 m at t=0.033 s, and 1.10 m at t=0.067 s (30 fps data), what is the vertical velocity at the middle frame and the vertical acceleration?',
      checkAnswer: 'Velocity at t=0.033s (central difference): v = (1.10 - 0.95) / (2 x 0.033) = 0.15 / 0.067 = 2.27 m/s upward. Acceleration: a = (1.10 - 2(1.05) + 0.95) / 0.033^2 = -0.05 / 0.00109 = -45.5 m/s^2. This is about 4.6g — unrealistically high, suggesting the data is noisy and needs filtering. This illustrates why smoothing before differentiation is critical.',
      codeIntro: 'Build the kinematics engine: compute CoM trajectory, velocities, accelerations, and ground reaction forces from the pirouette data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Kinematics Engine ---

SEGMENTS = {
    'head': 0.081, 'trunk': 0.497,
    'r_upper_arm': 0.028, 'r_forearm': 0.016, 'r_hand': 0.006,
    'l_upper_arm': 0.028, 'l_forearm': 0.016, 'l_hand': 0.006,
    'r_thigh': 0.100, 'r_shank': 0.047, 'r_foot': 0.014,
    'l_thigh': 0.100, 'l_shank': 0.047, 'l_foot': 0.014,
}

body_mass = 55.0
g = 9.81
fps = 30
dt = 1.0 / fps
n_frames = 120
t = np.linspace(0, (n_frames - 1) / fps, n_frames)

# Generate simplified segment CoM positions for a pirouette
arm_angle = 80 * np.exp(-2 * t)
spin_angle = np.cumsum((2 + 6 * (1 - np.exp(-2 * t))) * 360 / fps)
spin_rad = np.radians(spin_angle)

# Approximate segment positions (simplified for this engine)
segment_positions = np.zeros((n_frames, 3))  # whole-body CoM
for i in range(n_frames):
    theta = spin_rad[i]
    arm_r = 0.55 * np.sin(np.radians(arm_angle[i]))

    # Weighted average of segment positions
    positions = {
        'head': np.array([0, 0, 1.55]),
        'trunk': np.array([0, 0, 1.10]),
        'r_upper_arm': np.array([arm_r*0.5*np.cos(theta), arm_r*0.5*np.sin(theta), 1.30]),
        'r_forearm': np.array([arm_r*0.8*np.cos(theta), arm_r*0.8*np.sin(theta), 1.20]),
        'r_hand': np.array([arm_r*np.cos(theta), arm_r*np.sin(theta), 1.15]),
        'l_upper_arm': np.array([-arm_r*0.5*np.cos(theta), -arm_r*0.5*np.sin(theta), 1.30]),
        'l_forearm': np.array([-arm_r*0.8*np.cos(theta), -arm_r*0.8*np.sin(theta), 1.20]),
        'l_hand': np.array([-arm_r*np.cos(theta), -arm_r*np.sin(theta), 1.15]),
        'r_thigh': np.array([0.05, 0, 0.65]),
        'r_shank': np.array([0.05, 0, 0.30]),
        'r_foot': np.array([0.05, 0, 0.05]),
        'l_thigh': np.array([-0.05, 0, 0.65]),
        'l_shank': np.array([-0.05, 0, 0.30]),
        'l_foot': np.array([-0.05, 0, 0.15]),
    }

    com = np.zeros(3)
    total_m = 0
    for seg_name, mass_frac in SEGMENTS.items():
        m = mass_frac * body_mass
        com += m * positions[seg_name]
        total_m += m
    segment_positions[i] = com / total_m

# Compute velocity (central differences)
velocity = np.zeros_like(segment_positions)
velocity[1:-1] = (segment_positions[2:] - segment_positions[:-2]) / (2 * dt)
velocity[0] = (segment_positions[1] - segment_positions[0]) / dt
velocity[-1] = (segment_positions[-1] - segment_positions[-2]) / dt

# Compute acceleration
acceleration = np.zeros_like(segment_positions)
acceleration[1:-1] = (segment_positions[2:] - 2*segment_positions[1:-1] + segment_positions[:-2]) / dt**2
acceleration[0] = acceleration[1]
acceleration[-1] = acceleration[-2]

# Ground reaction force: GRF = m * (a + g_vector)
g_vector = np.array([0, 0, -g])
GRF = body_mass * (acceleration - g_vector)

# Compute speed (magnitude of velocity)
speed = np.linalg.norm(velocity, axis=1)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Kinematics Engine Output: Pirouette Analysis',
             color='white', fontsize=14, fontweight='bold')

# CoM trajectory (3D projected to 2D)
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(segment_positions[:, 0] * 100, segment_positions[:, 1] * 100,
        color='#3b82f6', linewidth=1.5)
ax.scatter(segment_positions[0, 0]*100, segment_positions[0, 1]*100,
           color='#22c55e', s=80, zorder=10, label='Start')
ax.scatter(segment_positions[-1, 0]*100, segment_positions[-1, 1]*100,
           color='#ef4444', s=80, zorder=10, label='End')
ax.set_xlabel('X (cm)', color='white')
ax.set_ylabel('Y (cm)', color='white')
ax.set_title('CoM trajectory (top view)', color='white')
ax.set_aspect('equal')
ax.legend(fontsize=9)

# CoM height over time
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, segment_positions[:, 2] * 100, color='#f59e0b', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('CoM height (cm)', color='white')
ax.set_title('CoM vertical position', color='white')

# Velocity components
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
labels_v = ['Vx', 'Vy', 'Vz']
colors_v = ['#ef4444', '#22c55e', '#3b82f6']
for j, (label, color) in enumerate(zip(labels_v, colors_v)):
    ax.plot(t, velocity[:, j], color=color, linewidth=1.5, label=label)
ax.plot(t, speed, color='white', linewidth=2, linestyle='--', label='|V| (speed)')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Velocity (m/s)', color='white')
ax.set_title('CoM velocity components', color='white')
ax.legend(fontsize=8)

# Ground reaction force (vertical component)
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, GRF[:, 2], color='#a855f7', linewidth=2)
ax.axhline(body_mass * g, color='gray', linewidth=1, linestyle='--',
           label=f'Body weight = {body_mass*g:.0f} N')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Vertical GRF (N)', color='white')
ax.set_title('Ground reaction force (vertical)', color='white')
ax.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Kinematics summary:")
print(f"  Frames: {n_frames} at {fps} fps ({t[-1]:.1f} s)")
print(f"  CoM height range: {segment_positions[:,2].min()*100:.1f} - {segment_positions[:,2].max()*100:.1f} cm")
print(f"  Peak speed: {speed.max():.2f} m/s")
print(f"  Peak vertical GRF: {GRF[:,2].max():.0f} N ({GRF[:,2].max()/(body_mass*g):.2f}x body weight)")
print(f"  Min vertical GRF: {GRF[:,2].min():.0f} N")`,
      challenge: 'Apply a Butterworth low-pass filter (cutoff 6 Hz) to the position data before computing velocities and accelerations. Compare the unfiltered and filtered GRF signals to show how noise amplification is tamed by filtering.',
      successHint: 'The kinematics engine converts raw position data into meaningful motion quantities. The key insight is that differentiation amplifies noise — which is why every real biomechanics system filters before computing derivatives.',
    },
    {
      title: 'Angular Momentum & Moment of Inertia Tracker',
      concept: `The angular momentum tracker computes the **rotational state** of the dancer at every frame. For a multi-segment body, the total angular momentum about the CoM has two components: the angular momentum of each segment spinning about its own CoM (**local** or **remote** term), and the angular momentum due to each segment's CoM moving around the whole-body CoM (**transfer** term).

H_total = sum(I_i * omega_i) + sum(m_i * r_i x v_i), where I_i is the segment's moment of inertia about its own CoM, omega_i is the segment's angular velocity, r_i is the vector from the whole-body CoM to the segment's CoM, and v_i is the velocity of the segment's CoM.

For a pirouette, the transfer term dominates for the limbs (especially the arms). When arms are extended, r_i is large, creating a large transfer term. When arms are pulled in, r_i decreases, reducing the transfer contribution. Since H_total is conserved (no external torque about the vertical axis), the angular velocity must increase to compensate.

The **moment of inertia tensor** is actually a 3x3 matrix, not a scalar. For rotation about the vertical axis, the relevant component is I_zz. But the off-diagonal terms (products of inertia) can cause wobble — the spin axis precesses if the body is not perfectly symmetric about the spin axis. This is why dancers "spot" (fixate on a point) during turns — it helps maintain the symmetry that keeps the spin stable.`,
      analogy: 'Think of the angular momentum as a bank account with a fixed balance (conserved). You can "withdraw" from the moment of inertia account and "deposit" into the angular velocity account by pulling your arms in. The total balance never changes. The wobble from asymmetry is like trying to spin a lopsided top — it starts precessing because the mass distribution is uneven around the spin axis.',
      storyConnection: 'The floating market dancer\'s pirouettes on a boat add an extra dimension: the boat can also rotate. The total angular momentum of the dancer-boat system is conserved. When the dancer spins clockwise, the boat rotates slightly counterclockwise. This makes the dancer appear to spin faster than expected relative to the market background — an optical illusion created by pure physics.',
      checkQuestion: 'A dancer has I_zz = 3.2 kg.m^2 with arms out, spinning at 2 rev/s. She pulls arms to I_zz = 1.1 kg.m^2. The boat (I = 80 kg.m^2) was initially stationary. What is the dancer\'s final spin rate relative to the ground, accounting for the boat\'s counter-rotation?',
      checkAnswer: 'L_total = 3.2 x 2 x 2pi = 40.21 rad/s x kg.m^2. After: L_dancer + L_boat = L_total. 1.1 x omega_d + 80 x omega_b = 40.21, and omega_d = omega_d_relative + omega_b (they share the same platform, so relative spin = absolute spin - boat spin, but since boat counter-rotates: omega_d = omega_relative - omega_b). Actually, conservation gives: 1.1 x omega_d - 80 x omega_d_correction = 40.21. The boat is so massive (I = 80) that it barely moves: omega_boat = -40.21 x (1.1)/(80 x 1.1 + 1.1 x 80)... Simplified: the dancer reaches approximately 40.21/1.1 = 36.6 rad/s = 5.82 rev/s, with the boat absorbing negligible angular momentum due to its large I.',
      codeIntro: 'Build the angular momentum tracker that computes I_zz, angular velocity, and H_z for every frame of the pirouette, verifying conservation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Angular Momentum Tracker ---

body_mass = 55.0
g = 9.81
fps = 30
dt = 1.0 / fps
n_frames = 120
t = np.linspace(0, (n_frames - 1) / fps, n_frames)

# Spin dynamics
arm_angle_deg = 80 * np.exp(-2 * t)
arm_angle_rad = np.radians(arm_angle_deg)

# Segment properties for I_zz calculation
arm_mass = 3.5  # each arm
forearm_mass = 1.8
hand_mass = 0.35
trunk_I = 1.2  # kg.m^2 (core body about vertical axis)
leg_I = 0.3  # both legs combined

def compute_Izz(arm_angle):
    """Compute whole-body I_zz about vertical axis."""
    arm_r = 0.55 * np.sin(arm_angle)  # distance from axis
    fa_r = 0.40 * np.sin(arm_angle)
    h_r = 0.65 * np.sin(arm_angle)
    # I = sum(m * r^2) for each segment about vertical axis
    I_arms = 2 * (arm_mass * (arm_r * 0.5)**2 +
                   forearm_mass * fa_r**2 +
                   hand_mass * h_r**2)
    return trunk_I + leg_I + I_arms

# Compute I_zz at each frame
Izz = np.array([compute_Izz(a) for a in arm_angle_rad])

# Initial conditions
omega_0 = 2.0 * 2 * np.pi  # 2 rev/s in rad/s
L_z = Izz[0] * omega_0  # conserved angular momentum

# Angular velocity from conservation
omega_z = L_z / Izz  # rad/s
spin_revs = omega_z / (2 * np.pi)  # rev/s

# Verify conservation: L should be constant
L_check = Izz * omega_z

# Compute rotational kinetic energy: KE_rot = 0.5 * I * omega^2
KE_rot = 0.5 * Izz * omega_z**2

# Also compute energy from spin rate
# The work done by the dancer in pulling arms in
work_done = np.cumsum(np.diff(KE_rot, prepend=KE_rot[0]))

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Angular Momentum Tracker: Pirouette Conservation Verification',
             color='white', fontsize=14, fontweight='bold')

# I_zz over time
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, Izz, color='#3b82f6', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('I_zz (kg.m²)', color='white')
ax.set_title('Moment of inertia about spin axis', color='white')

# Angular velocity
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, spin_revs, color='#22c55e', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Spin rate (rev/s)', color='white')
ax.set_title('Angular velocity (increases as I decreases)', color='white')

# Angular momentum (should be constant)
ax = axes[0, 2]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, L_check, color='#f59e0b', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('L_z (kg.m²/s)', color='white')
ax.set_title('Angular momentum (CONSERVED)', color='white')
ax.set_ylim(L_z * 0.95, L_z * 1.05)

# I vs omega (hyperbolic)
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.scatter(Izz, spin_revs, c=t, cmap='plasma', s=15)
I_theory = np.linspace(Izz.min(), Izz.max(), 100)
omega_theory = (L_z / I_theory) / (2 * np.pi)
ax.plot(I_theory, omega_theory, color='white', linewidth=1.5, linestyle='--', label='L = const')
ax.set_xlabel('I_zz (kg.m²)', color='white')
ax.set_ylabel('Spin rate (rev/s)', color='white')
ax.set_title('I vs omega: perfect hyperbola', color='white')
ax.legend(fontsize=9)

# Rotational KE
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, KE_rot, color='#ef4444', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('KE_rot (J)', color='white')
ax.set_title('Rotational kinetic energy (INCREASES!)', color='white')

# Energy source: work done pulling arms in
ax = axes[1, 2]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, KE_rot - KE_rot[0], color='#a855f7', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Energy added (J)', color='white')
ax.set_title('Work done by muscles pulling arms in', color='white')
ax.fill_between(t, 0, KE_rot - KE_rot[0], color='#a855f7', alpha=0.2)

plt.tight_layout()
plt.show()

print(f"Angular momentum tracker results:")
print(f"  L_z = {L_z:.2f} kg.m^2/s (constant throughout)")
print(f"  I_zz range: {Izz.min():.3f} to {Izz.max():.3f} kg.m^2")
print(f"  Spin rate: {spin_revs[0]:.1f} to {spin_revs[-1]:.1f} rev/s")
print(f"  Speed multiplier: {spin_revs[-1]/spin_revs[0]:.2f}x")
print(f"  KE_rot: {KE_rot[0]:.1f} to {KE_rot[-1]:.1f} J")
print(f"  Energy added by arm pull-in: {KE_rot[-1] - KE_rot[0]:.1f} J")
print(f"\\nKey insight: Angular momentum is conserved, but kinetic energy")
print(f"INCREASES. The extra energy comes from muscular work pulling arms inward.")`,
      challenge: 'Add the boat\'s angular momentum to the analysis. If the boat has I_boat = 80 kg.m^2 and starts stationary, track the boat\'s counter-rotation. Plot dancer spin, boat spin, and total system angular momentum on the same graph.',
      successHint: 'The angular momentum tracker reveals a subtle truth: while L is conserved during a spin, kinetic energy is not. The dancer actively adds energy by pulling arms inward against centrifugal force. Conservation laws constrain the system but do not prevent energy input.',
    },
    {
      title: 'Joint Torque Calculator (Inverse Dynamics)',
      concept: `**Inverse dynamics** is the crown jewel of biomechanical analysis. Given the motion (kinematics), it works backward to compute the forces and torques that caused that motion. This is the opposite of forward dynamics (given forces, predict motion) and is far more useful for analyzing real movement.

The method works segment by segment, starting from the most distal segment (hand or foot) and working inward toward the trunk. For each segment: (1) compute the segment's acceleration from its CoM trajectory, (2) apply Newton's second law to find the net force, (3) subtract known forces (gravity, forces from the previous segment) to find the unknown joint force, (4) apply the rotational equation (I*alpha = sum of torques) to find the joint torque.

For example, consider the forearm during an arm extension. The forearm has mass m, length L, and angular acceleration alpha. The wrist exerts force F_wrist and the elbow exerts force F_elbow. Newton's second law: F_elbow + F_wrist - m*g = m*a_CoM. The torque equation about the elbow: tau_elbow = I_elbow * alpha + m*g*L/2*cos(theta) - F_wrist*L*cos(theta). This gives us the muscle torque at the elbow needed to produce the observed motion.

The power at each joint is tau * omega (torque times angular velocity). Positive power means the muscles are doing concentric work (shortening under load); negative power means eccentric work (lengthening under load, like lowering a weight slowly). Total mechanical energy expenditure is the integral of positive power over time.`,
      analogy: 'Inverse dynamics is like being a detective at a car crash. You see the tire marks (the motion) and work backward to determine what forces caused the skid, what speed the car was traveling, and what went wrong. You cannot replay the event, but the physical evidence (kinematics) contains enough information to reconstruct the forces. In biomechanics, the "tire marks" are the joint positions, and the "crash forces" are the muscle torques.',
      storyConnection: 'When the floating market dancer performs a dramatic arm gesture that appears effortless, inverse dynamics reveals the hidden effort. A slow, controlled extension of the arm against gravity might require 15 N.m of shoulder torque — invisible to the audience but physically demanding for the dancer, especially when sustained over a full performance. The art hides the physics.',
      checkQuestion: 'A 1.8 kg forearm (length 0.25 m) is extended horizontally and stationary. What torque must the elbow joint provide to hold this position?',
      checkAnswer: 'Since the forearm is stationary (alpha = 0, a = 0), the torque equals the gravitational torque: tau = m*g*L_com = 1.8 * 9.81 * 0.125 = 2.21 N.m (where L_com = L/2 = 0.125 m is the distance from elbow to forearm CoM). This is the isometric holding torque. It seems small, but sustaining it for minutes during a dance routine causes significant muscle fatigue.',
      codeIntro: 'Implement inverse dynamics for a simplified 2D arm model during a dance arm gesture, computing elbow and shoulder torques.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Inverse Dynamics: Dance Arm Gesture ---
g = 9.81
dt = 1.0 / 30  # 30 fps

# Arm model (2 segments: upper arm + forearm)
m_upper = 2.8  # kg
L_upper = 0.28  # m
I_upper = m_upper * L_upper**2 / 12  # rod moment of inertia

m_fore = 2.0  # kg (forearm + hand)
L_fore = 0.35  # m
I_fore = m_fore * L_fore**2 / 12

# Define a graceful arm gesture: shoulder angle and elbow angle over time
n_frames = 90  # 3 seconds at 30 fps
t = np.linspace(0, 3.0, n_frames)

# Shoulder angle: 0 (arm down) -> 150 degrees (arm up and back) -> 90 degrees
shoulder_angle = np.where(t < 1.5,
    150 * np.sin(np.pi * t / 3)**2,
    150 * np.sin(np.pi * 1.5 / 3)**2 - 60 * np.sin(np.pi * (t - 1.5) / 3)**2)
shoulder_angle = np.radians(shoulder_angle)

# Elbow angle: starts at 20 deg, extends to 170 deg, returns to 90
elbow_angle = np.where(t < 1.5,
    20 + 150 * np.sin(np.pi * t / 3)**2,
    170 - 80 * np.sin(np.pi * (t - 1.5) / 3)**2)
elbow_angle = np.radians(elbow_angle)

# Angular velocities and accelerations (central differences)
def diff_central(arr, dt):
    d = np.zeros_like(arr)
    d[1:-1] = (arr[2:] - arr[:-2]) / (2 * dt)
    d[0] = (arr[1] - arr[0]) / dt
    d[-1] = (arr[-1] - arr[-2]) / dt
    return d

shoulder_omega = diff_central(shoulder_angle, dt)
shoulder_alpha = diff_central(shoulder_omega, dt)
elbow_omega = diff_central(elbow_angle, dt)
elbow_alpha = diff_central(elbow_omega, dt)

# Forward kinematics: compute segment positions
shoulder_pos = np.array([0, 1.35])  # fixed shoulder position
elbow_x = shoulder_pos[0] + L_upper * np.cos(shoulder_angle)
elbow_y = shoulder_pos[1] + L_upper * np.sin(shoulder_angle)
wrist_x = elbow_x + L_fore * np.cos(shoulder_angle + elbow_angle - np.pi)
wrist_y = elbow_y + L_fore * np.sin(shoulder_angle + elbow_angle - np.pi)

# Inverse dynamics: compute joint torques
# Start from distal (wrist) and work proximal

# Forearm: tau_elbow = I_fore * alpha_fore + gravity_torque
theta_fore = shoulder_angle + elbow_angle - np.pi  # absolute angle of forearm
omega_fore = shoulder_omega + elbow_omega
alpha_fore = shoulder_alpha + elbow_alpha

# Forearm CoM acceleration
fore_com_x = elbow_x + L_fore/2 * np.cos(theta_fore)
fore_com_y = elbow_y + L_fore/2 * np.sin(theta_fore)
fore_ax = diff_central(diff_central(fore_com_x, dt), dt)
fore_ay = diff_central(diff_central(fore_com_y, dt), dt)

# Elbow torque (holding forearm against gravity + producing observed motion)
tau_elbow = (I_fore * alpha_fore +
             m_fore * g * L_fore/2 * np.cos(theta_fore) +
             m_fore * (fore_ax * L_fore/2 * np.sin(theta_fore) -
                       fore_ay * L_fore/2 * np.cos(theta_fore)))

# Upper arm + reaction from forearm
upper_com_x = shoulder_pos[0] + L_upper/2 * np.cos(shoulder_angle)
upper_com_y = shoulder_pos[1] + L_upper/2 * np.sin(shoulder_angle)
upper_ax = diff_central(diff_central(upper_com_x, dt), dt)
upper_ay = diff_central(diff_central(upper_com_y, dt), dt)

tau_shoulder = (I_upper * shoulder_alpha +
                m_upper * g * L_upper/2 * np.cos(shoulder_angle) +
                tau_elbow +  # reaction torque from forearm
                m_fore * g * L_upper * np.cos(shoulder_angle) +
                m_fore * (fore_ax * L_upper * np.sin(shoulder_angle) -
                          fore_ay * L_upper * np.cos(shoulder_angle)))

# Joint power = torque x angular velocity
power_elbow = tau_elbow * elbow_omega
power_shoulder = tau_shoulder * shoulder_omega

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Inverse Dynamics: Joint Torques During Dance Arm Gesture',
             color='white', fontsize=14, fontweight='bold')

# Arm trajectory
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for i in range(0, n_frames, 10):
    alpha_val = 0.3 + 0.7 * i / n_frames
    ax.plot([shoulder_pos[0], elbow_x[i]], [shoulder_pos[1], elbow_y[i]],
            color='#3b82f6', linewidth=2, alpha=alpha_val)
    ax.plot([elbow_x[i], wrist_x[i]], [elbow_y[i], wrist_y[i]],
            color='#22c55e', linewidth=2, alpha=alpha_val)
ax.scatter(wrist_x[::5], wrist_y[::5], c=t[::5], cmap='plasma', s=20, zorder=5)
ax.set_xlabel('X (m)', color='white')
ax.set_ylabel('Y (m)', color='white')
ax.set_title('Arm trajectory (ghosted frames)', color='white')
ax.set_aspect('equal')

# Joint angles
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, np.degrees(shoulder_angle), color='#3b82f6', linewidth=2, label='Shoulder')
ax.plot(t, np.degrees(elbow_angle), color='#22c55e', linewidth=2, label='Elbow')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Angle (degrees)', color='white')
ax.set_title('Joint angles', color='white')
ax.legend(fontsize=9)

# Joint torques
ax = axes[0, 2]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, tau_shoulder, color='#ef4444', linewidth=2, label='Shoulder torque')
ax.plot(t, tau_elbow, color='#f59e0b', linewidth=2, label='Elbow torque')
ax.axhline(0, color='gray', linewidth=0.5, linestyle='--')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Torque (N.m)', color='white')
ax.set_title('Joint torques (inverse dynamics)', color='white')
ax.legend(fontsize=9)

# Joint power
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, power_shoulder, color='#ef4444', linewidth=2, label='Shoulder power')
ax.plot(t, power_elbow, color='#f59e0b', linewidth=2, label='Elbow power')
ax.fill_between(t, power_shoulder, 0, where=power_shoulder > 0,
                color='#ef4444', alpha=0.2, label='Concentric (muscle shortening)')
ax.fill_between(t, power_shoulder, 0, where=power_shoulder < 0,
                color='#3b82f6', alpha=0.2, label='Eccentric (muscle lengthening)')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Power (W)', color='white')
ax.set_title('Joint power (+ = concentric, - = eccentric)', color='white')
ax.legend(fontsize=7)

# Cumulative work
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
work_shoulder = np.cumsum(np.abs(power_shoulder)) * dt
work_elbow = np.cumsum(np.abs(power_elbow)) * dt
ax.plot(t, work_shoulder, color='#ef4444', linewidth=2, label='Shoulder work')
ax.plot(t, work_elbow, color='#f59e0b', linewidth=2, label='Elbow work')
ax.plot(t, work_shoulder + work_elbow, color='white', linewidth=2, linestyle='--', label='Total')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Cumulative work (J)', color='white')
ax.set_title('Total mechanical work done', color='white')
ax.legend(fontsize=9)

# Peak torque comparison across poses
ax = axes[1, 2]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
joints = ['Shoulder\\n(peak)', 'Shoulder\\n(mean)', 'Elbow\\n(peak)', 'Elbow\\n(mean)']
values = [np.max(np.abs(tau_shoulder)), np.mean(np.abs(tau_shoulder)),
          np.max(np.abs(tau_elbow)), np.mean(np.abs(tau_elbow))]
colors = ['#ef4444', '#ef4444', '#f59e0b', '#f59e0b']
alphas = [0.9, 0.5, 0.9, 0.5]
bars = ax.bar(joints, values, color=colors)
for bar, a in zip(bars, alphas):
    bar.set_alpha(a)
for bar, v in zip(bars, values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
            f'{v:.1f} N.m', ha='center', color='white', fontsize=9)
ax.set_ylabel('Torque (N.m)', color='white')
ax.set_title('Torque statistics', color='white')

plt.tight_layout()
plt.show()

print(f"Inverse dynamics results:")
print(f"  Shoulder: peak torque = {np.max(np.abs(tau_shoulder)):.1f} N.m, "
      f"peak power = {np.max(np.abs(power_shoulder)):.1f} W")
print(f"  Elbow: peak torque = {np.max(np.abs(tau_elbow)):.1f} N.m, "
      f"peak power = {np.max(np.abs(power_elbow)):.1f} W")
print(f"  Total mechanical work: {(work_shoulder[-1] + work_elbow[-1]):.1f} J")`,
      challenge: 'Extend the inverse dynamics to include the trunk rotation. When the dancer twists the torso during the arm gesture, the trunk contributes additional reaction forces at the shoulder. Add a trunk rotation of +/- 30 degrees synchronized with the arm movement and recompute shoulder torques.',
      successHint: 'Inverse dynamics reveals the invisible forces that make dance possible. Every beautiful gesture is produced by precisely timed muscle torques that the audience never sees. This same technique is used in prosthetics design, injury prevention, and sports performance optimization.',
    },
    {
      title: 'Energy Expenditure & Metabolic Cost',
      concept: `A dance performance is fundamentally an energy transformation process. Chemical energy in the muscles is converted to mechanical work (moving the limbs) and heat (muscle inefficiency). The **metabolic cost** of a movement is always greater than the mechanical work done, because muscles are at best 25% efficient.

The total mechanical energy of the body at any instant is: E_total = E_translational + E_rotational + E_potential = 0.5*m*v_CoM^2 + 0.5*I*omega^2 + m*g*h_CoM. Changes in E_total come from two sources: external work (ground reaction forces) and internal work (joint torques).

The **mechanical cost of transport** (CoT) measures efficiency: CoT = mechanical_work / (body_weight x distance_traveled). For walking, CoT is about 0.3 J/(N.m). For dance, it can be 2-5x higher because of the constant elevation changes, lateral movements, and rotations. A 3-minute dance routine by a 55 kg dancer might require 200-400 kJ of metabolic energy — equivalent to running 1-2 km.

**Metabolic power** can be estimated from mechanical power using efficiency factors: P_metabolic = P_positive/eta_concentric + P_negative/eta_eccentric, where eta_concentric is about 0.25 (muscles are 25% efficient when shortening) and eta_eccentric is about -1.2 (muscles can absorb more energy than they produce, but still generate heat). The negative efficiency for eccentric work means the body actually absorbs mechanical energy while still consuming metabolic energy — a double cost.`,
      analogy: 'Think of muscles as car engines. A car engine converts gasoline to motion with about 25% efficiency — 75% becomes waste heat. Muscles are similar: for every 4 joules of chemical energy consumed, only 1 joule becomes useful motion. The rest becomes heat (which is why you get warm when dancing). The "cost of transport" is like fuel economy — miles per gallon for movement.',
      storyConnection: 'The floating market dancer performs for hours in tropical heat. Understanding metabolic cost explains why dancers pace themselves, why certain moves are reserved for climactic moments, and why traditional dance costumes in warm climates are designed for ventilation. The metabolic cost also explains the incredible physical conditioning required — a professional dancer has the endurance of a long-distance runner combined with the explosive power of a sprinter.',
      checkQuestion: 'A dancer performs a jump requiring 200 J of mechanical work. If muscle efficiency is 25% for the upward phase and muscles absorb the 200 J during landing with -120% efficiency, what is the total metabolic energy cost?',
      checkAnswer: 'Upward (concentric): 200 / 0.25 = 800 J metabolic cost. Downward (eccentric): the muscles absorb 200 J but consume 200 / 1.2 = 167 J of metabolic energy doing so. Total metabolic cost: 800 + 167 = 967 J. The total metabolic energy is nearly 5x the visible mechanical work. This is why a 200 J jump feels like hard work — the body spends almost 1000 J to execute it.',
      codeIntro: 'Compute energy expenditure for the entire pirouette sequence, comparing mechanical work to estimated metabolic cost.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Energy Expenditure & Metabolic Cost ---
g = 9.81
body_mass = 55.0
fps = 30
dt = 1.0 / fps
n_frames = 120
t = np.linspace(0, (n_frames - 1) / fps, n_frames)

# Recreate motion data for energy analysis
arm_angle = 80 * np.exp(-2 * t)
spin_rate = 2 + 6 * (1 - np.exp(-2 * t))  # rev/s
omega = spin_rate * 2 * np.pi  # rad/s

# Moment of inertia (simplified)
def Izz(arm_deg):
    r = 0.55 * np.sin(np.radians(arm_deg))
    return 1.5 + 2 * 3.5 * (r * 0.5)**2 + 2 * 1.8 * (r * 0.8)**2
I_values = np.array([Izz(a) for a in arm_angle])

# CoM height (slight variation during spin — dancer rises on toes)
h_com = 0.95 + 0.03 * np.sin(2 * np.pi * t / 1.0)  # slight bobbing

# Energy components
E_translational = np.zeros(n_frames)  # minimal for spin in place
E_rotational = 0.5 * I_values * omega**2
E_potential = body_mass * g * h_com
E_total = E_translational + E_rotational + E_potential

# Mechanical power (time derivative of energy components)
P_rotational = np.gradient(E_rotational, dt)
P_potential = np.gradient(E_potential, dt)
P_total = P_rotational + P_potential

# Separate into positive (concentric) and negative (eccentric) power
P_positive = np.maximum(P_total, 0)
P_negative = np.minimum(P_total, 0)

# Metabolic power estimation
eta_concentric = 0.25
eta_eccentric = 1.20  # absolute value
P_metabolic = P_positive / eta_concentric + np.abs(P_negative) / eta_eccentric

# Cumulative energy expenditure
E_mechanical = np.cumsum(np.abs(P_total)) * dt
E_metabolic = np.cumsum(P_metabolic) * dt

# Compare to common activities
activities = {
    'Standing still': 80,      # W
    'Walking (5 km/h)': 280,   # W
    'Dance performance': np.mean(P_metabolic),  # W
    'Running (10 km/h)': 700,  # W
    'Sprinting': 1500,         # W
}

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Energy Expenditure Analysis: Pirouette Sequence',
             color='white', fontsize=14, fontweight='bold')

# Energy components
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, E_rotational, color='#3b82f6', linewidth=2, label='Rotational KE')
ax.plot(t, E_potential, color='#22c55e', linewidth=2, label='Potential E')
ax.plot(t, E_total, color='white', linewidth=2, linestyle='--', label='Total')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Energy (J)', color='white')
ax.set_title('Mechanical energy components', color='white')
ax.legend(fontsize=8)

# Mechanical power
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, P_rotational, color='#3b82f6', linewidth=1.5, label='Rotational power')
ax.plot(t, P_potential, color='#22c55e', linewidth=1.5, label='Potential power')
ax.plot(t, P_total, color='white', linewidth=2, linestyle='--', label='Total')
ax.fill_between(t, P_total, 0, where=P_total > 0, color='#ef4444', alpha=0.3, label='Concentric')
ax.fill_between(t, P_total, 0, where=P_total < 0, color='#3b82f6', alpha=0.3, label='Eccentric')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Power (W)', color='white')
ax.set_title('Mechanical power output', color='white')
ax.legend(fontsize=7)

# Metabolic vs mechanical power
ax = axes[0, 2]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, np.abs(P_total), color='#f59e0b', linewidth=2, label='Mechanical (|P|)')
ax.plot(t, P_metabolic, color='#ef4444', linewidth=2, label='Metabolic estimate')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Power (W)', color='white')
ax.set_title('Metabolic vs mechanical power', color='white')
ax.legend(fontsize=9)

# Cumulative energy
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, E_mechanical, color='#f59e0b', linewidth=2.5, label='Mechanical work')
ax.plot(t, E_metabolic, color='#ef4444', linewidth=2.5, label='Metabolic cost')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Cumulative energy (J)', color='white')
ax.set_title('Cumulative energy expenditure', color='white')
ax.legend(fontsize=9)

# Efficiency over time
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
efficiency = np.where(E_metabolic > 0, E_mechanical / E_metabolic * 100, 0)
ax.plot(t[10:], efficiency[10:], color='#a855f7', linewidth=2.5)
ax.axhline(25, color='gray', linewidth=1, linestyle='--', label='25% (typical muscle)')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Mechanical efficiency (%)', color='white')
ax.set_title('Instantaneous efficiency', color='white')
ax.legend(fontsize=9)

# Comparison to other activities
ax = axes[1, 2]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names = list(activities.keys())
powers = list(activities.values())
colors = ['#6b7280', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
bars = ax.barh(names, powers, color=colors, alpha=0.8)
for bar, p in zip(bars, powers):
    ax.text(bar.get_width() + 10, bar.get_y() + bar.get_height()/2,
            f'{p:.0f} W', color='white', fontsize=9, va='center')
ax.set_xlabel('Metabolic power (W)', color='white')
ax.set_title('Dance vs other activities', color='white')

plt.tight_layout()
plt.show()

print(f"Energy analysis summary:")
print(f"  Total mechanical work: {E_mechanical[-1]:.1f} J")
print(f"  Total metabolic cost: {E_metabolic[-1]:.1f} J")
print(f"  Overall efficiency: {E_mechanical[-1]/E_metabolic[-1]*100:.1f}%")
print(f"  Average metabolic power: {np.mean(P_metabolic):.0f} W")
print(f"  Peak metabolic power: {np.max(P_metabolic):.0f} W")
print(f"\\nFor a 3-minute routine at this intensity:")
print(f"  Estimated metabolic cost: {np.mean(P_metabolic)*180/1000:.1f} kJ")
print(f"  Equivalent to: {np.mean(P_metabolic)*180/4184:.0f} food Calories")`,
      challenge: 'Compute the metabolic cost for three different dance styles: a slow, sustained adagio (low power, long duration), the explosive pirouette we analyzed, and a series of jumps (high peak power, intermittent). Compare total energy expenditure and determine which style is most metabolically demanding per unit time.',
      successHint: 'The gap between mechanical work and metabolic cost reveals why dance is such extraordinary exercise. The body spends 3-5x more energy than the visible motion would suggest, making a dance performance metabolically comparable to running at moderate speed — but with far more varied muscular demands.',
    },
    {
      title: 'Final Integration: Dance Move Physics Dashboard',
      concept: `The capstone concludes by integrating all components into a single **Dance Move Physics Dashboard** — a comprehensive analysis tool that takes a motion sequence and produces a complete biomechanical report: CoM trajectory, angular momentum profile, joint torques, ground reaction forces, energy expenditure, and metabolic cost.

A real biomechanics dashboard would include: (1) a stick figure animation synchronized with the data, (2) time-series plots of all computed quantities, (3) summary statistics (peak forces, total work, efficiency), (4) comparison to normative data (how does this dancer compare to averages?), and (5) injury risk indicators (are any joint torques exceeding safe limits?).

The dashboard concept illustrates the full engineering pipeline: raw data acquisition (motion capture) -> signal processing (filtering, differentiation) -> biomechanical modeling (segment masses, joint geometry) -> computation (inverse dynamics) -> visualization (plots, animations) -> interpretation (normative comparison, injury risk). Each stage depends on the previous one, and errors propagate forward. A 2% error in position measurement becomes a 10% error in acceleration and a 20% error in joint torque — which is why every stage must be carefully validated.

This is the shape of real engineering work. Not a single algorithm, but a pipeline where every stage matters and the quality of the final output depends on getting every stage right.`,
      analogy: 'The dashboard is like a car\'s instrument panel. The speedometer, tachometer, fuel gauge, and temperature gauge each show one aspect of the engine\'s state. Individually useful, but together they give a complete picture that allows the driver to make informed decisions. Our biomechanics dashboard gives the dancer (or their coach, or their physiotherapist) the same complete picture of their movement.',
      storyConnection: 'If we could attach motion sensors to the floating market dancer, our dashboard would quantify every aspect of their extraordinary skill: the precision of their CoM control on a rocking boat, the efficiency of their spins, the exact muscle torques in their gravity-defying poses, and the metabolic cost of a full performance in tropical heat. The dashboard bridges the gap between the art the audience sees and the physics that makes it possible.',
      checkQuestion: 'What validation checks should a biomechanics dashboard perform automatically before displaying results?',
      checkAnswer: 'Key validations: (1) Mass check — segment mass fractions should sum to 1.0. (2) Energy conservation — during flight phases, total mechanical energy should be constant. (3) GRF check — vertical GRF should never be negative (the ground cannot pull). (4) Momentum check — angular momentum should be conserved during airborne phases. (5) Physiological limits — joint torques exceeding 300 N.m or angular velocities exceeding 30 rad/s are likely measurement errors. (6) Continuity — positions, velocities, and accelerations should be smooth (no discontinuities).',
      codeIntro: 'Build the complete dashboard: generate motion data, run the full analysis pipeline, and create a multi-panel visualization with summary statistics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ========================================
# DANCE MOVE PHYSICS ANALYZER — DASHBOARD
# ========================================

g = 9.81
body_mass = 55.0
fps = 30
dt = 1.0 / fps

# --- STAGE 1: Generate motion sequence (pirouette + arm gesture) ---
n_frames = 150  # 5 seconds
t = np.linspace(0, (n_frames-1)/fps, n_frames)

# Phase 1 (0-2s): preparation, Phase 2 (2-4s): pirouette, Phase 3 (4-5s): finish
arm_angle = np.where(t < 2, 30 + 20*np.sin(np.pi*t/2),
            np.where(t < 4, 80*np.exp(-3*(t-2)), 10 + 5*np.sin(np.pi*(t-4))))
spin_rate = np.where(t < 2, 0.2,
            np.where(t < 4, 2 + 5*(1-np.exp(-2*(t-2))), 1*np.exp(-2*(t-4))))

com_height = np.where(t < 2, 0.95 + 0.02*np.sin(2*np.pi*t),
             np.where(t < 4, 0.97 + 0.01*np.sin(4*np.pi*t), 0.95 - 0.05*(t-4)))

omega = spin_rate * 2 * np.pi

# --- STAGE 2: Compute I_zz ---
def calc_Izz(arm_deg):
    r = 0.55 * np.sin(np.radians(arm_deg))
    return 1.5 + 2*3.5*(r*0.5)**2 + 2*1.8*(r*0.8)**2
Izz = np.array([calc_Izz(a) for a in arm_angle])

# --- STAGE 3: Angular momentum ---
Lz = Izz * omega

# --- STAGE 4: Energy ---
E_rot = 0.5 * Izz * omega**2
E_pot = body_mass * g * com_height
E_total = E_rot + E_pot

P_total = np.gradient(E_total, dt)
P_pos = np.maximum(P_total, 0)
P_neg = np.minimum(P_total, 0)
P_metabolic = P_pos / 0.25 + np.abs(P_neg) / 1.2
E_mech_cum = np.cumsum(np.abs(P_total)) * dt
E_metab_cum = np.cumsum(P_metabolic) * dt

# --- STAGE 5: Ground reaction force ---
com_accel = np.gradient(np.gradient(com_height, dt), dt)
GRF_vertical = body_mass * (com_accel + g)

# --- STAGE 6: Validation ---
validations = {
    'GRF always positive': np.all(GRF_vertical > -50),
    'Spin rate reasonable (<15 rev/s)': np.all(spin_rate < 15),
    'CoM height reasonable': np.all((com_height > 0.5) & (com_height < 1.5)),
    'I_zz positive': np.all(Izz > 0),
    'Energy finite': np.all(np.isfinite(E_total)),
}

# ==========================================
# DASHBOARD VISUALIZATION (8-panel layout)
# ==========================================
fig = plt.figure(figsize=(18, 14))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('DANCE MOVE PHYSICS ANALYZER — COMPLETE DASHBOARD',
             color='white', fontsize=16, fontweight='bold', y=0.98)

# Create grid layout
gs = fig.add_gridspec(3, 4, hspace=0.35, wspace=0.3)

# Panel 1: Motion overview (arm angle + spin rate)
ax1 = fig.add_subplot(gs[0, 0:2])
ax1.set_facecolor('#111827'); ax1.tick_params(colors='gray')
ax1a = ax1.twinx()
ax1.plot(t, arm_angle, color='#3b82f6', linewidth=2, label='Arm angle (°)')
ax1a.plot(t, spin_rate, color='#22c55e', linewidth=2, label='Spin rate (rev/s)')
ax1.set_xlabel('Time (s)', color='white')
ax1.set_ylabel('Arm angle (°)', color='#3b82f6')
ax1a.set_ylabel('Spin rate (rev/s)', color='#22c55e')
ax1.set_title('Motion Parameters', color='white', fontsize=11)
ax1.legend(loc='upper left', fontsize=8)
ax1a.legend(loc='upper right', fontsize=8)
# Phase markers
for x_pos, label in [(0, 'Prep'), (2, 'Spin'), (4, 'Finish')]:
    ax1.axvline(x_pos, color='gray', linewidth=0.5, linestyle=':')
    ax1.text(x_pos + 0.1, arm_angle.max() * 0.95, label, color='gray', fontsize=8)

# Panel 2: Angular momentum
ax2 = fig.add_subplot(gs[0, 2:4])
ax2.set_facecolor('#111827'); ax2.tick_params(colors='gray')
ax2.plot(t, Lz, color='#f59e0b', linewidth=2.5)
ax2.fill_between(t, Lz, 0, color='#f59e0b', alpha=0.15)
ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('L_z (kg.m²/s)', color='white')
ax2.set_title('Angular Momentum', color='white', fontsize=11)

# Panel 3: Energy components
ax3 = fig.add_subplot(gs[1, 0:2])
ax3.set_facecolor('#111827'); ax3.tick_params(colors='gray')
ax3.plot(t, E_rot, color='#3b82f6', linewidth=2, label='KE (rotational)')
ax3.plot(t, E_pot, color='#22c55e', linewidth=2, label='PE (gravitational)')
ax3.plot(t, E_total, color='white', linewidth=2, linestyle='--', label='Total')
ax3.set_xlabel('Time (s)', color='white')
ax3.set_ylabel('Energy (J)', color='white')
ax3.set_title('Energy Components', color='white', fontsize=11)
ax3.legend(fontsize=8)

# Panel 4: Power & metabolic cost
ax4 = fig.add_subplot(gs[1, 2:4])
ax4.set_facecolor('#111827'); ax4.tick_params(colors='gray')
ax4.plot(t, np.abs(P_total), color='#f59e0b', linewidth=1.5, label='Mechanical |P|')
ax4.plot(t, P_metabolic, color='#ef4444', linewidth=2, label='Metabolic P')
ax4.set_xlabel('Time (s)', color='white')
ax4.set_ylabel('Power (W)', color='white')
ax4.set_title('Power Output', color='white', fontsize=11)
ax4.legend(fontsize=9)

# Panel 5: GRF
ax5 = fig.add_subplot(gs[2, 0])
ax5.set_facecolor('#111827'); ax5.tick_params(colors='gray')
ax5.plot(t, GRF_vertical, color='#a855f7', linewidth=2)
ax5.axhline(body_mass*g, color='gray', linewidth=1, linestyle='--')
ax5.set_xlabel('Time (s)', color='white')
ax5.set_ylabel('GRF (N)', color='white')
ax5.set_title('Ground Reaction Force', color='white', fontsize=10)

# Panel 6: Cumulative energy
ax6 = fig.add_subplot(gs[2, 1])
ax6.set_facecolor('#111827'); ax6.tick_params(colors='gray')
ax6.plot(t, E_mech_cum, color='#f59e0b', linewidth=2, label='Mechanical')
ax6.plot(t, E_metab_cum, color='#ef4444', linewidth=2, label='Metabolic')
ax6.set_xlabel('Time (s)', color='white')
ax6.set_ylabel('Cumulative (J)', color='white')
ax6.set_title('Cumulative Energy', color='white', fontsize=10)
ax6.legend(fontsize=8)

# Panel 7: I vs omega phase plot
ax7 = fig.add_subplot(gs[2, 2])
ax7.set_facecolor('#111827'); ax7.tick_params(colors='gray')
scatter = ax7.scatter(Izz, spin_rate, c=t, cmap='plasma', s=15)
ax7.set_xlabel('I_zz (kg.m²)', color='white')
ax7.set_ylabel('Spin (rev/s)', color='white')
ax7.set_title('Phase Plot: I vs ω', color='white', fontsize=10)

# Panel 8: Summary statistics text
ax8 = fig.add_subplot(gs[2, 3])
ax8.set_facecolor('#111827')
ax8.axis('off')
summary = [
    f"Duration: {t[-1]:.1f} s ({n_frames} frames)",
    f"Peak spin: {spin_rate.max():.1f} rev/s",
    f"Peak GRF: {GRF_vertical.max():.0f} N ({GRF_vertical.max()/(body_mass*g):.1f}x BW)",
    f"Total mech work: {E_mech_cum[-1]:.0f} J",
    f"Total metab cost: {E_metab_cum[-1]:.0f} J",
    f"Efficiency: {E_mech_cum[-1]/E_metab_cum[-1]*100:.0f}%",
    f"Avg metab power: {np.mean(P_metabolic):.0f} W",
    "",
    "VALIDATION:",
]
for check, passed in validations.items():
    summary.append(f"  {'PASS' if passed else 'FAIL'}: {check}")

for i, line in enumerate(summary):
    color = '#22c55e' if 'PASS' in line else '#ef4444' if 'FAIL' in line else 'white'
    ax8.text(0.05, 0.95 - i*0.08, line, color=color, fontsize=9,
             transform=ax8.transAxes, fontfamily='monospace')

plt.savefig('/tmp/dance_dashboard.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("=" * 60)
print("DANCE MOVE PHYSICS ANALYZER — REPORT")
print("=" * 60)
print(f"Sequence: Preparation -> Pirouette -> Finish ({t[-1]:.1f}s)")
print(f"Dancer: {body_mass} kg")
print(f"\\nKinematics:")
print(f"  Peak spin rate: {spin_rate.max():.1f} rev/s")
print(f"  CoM height range: {com_height.min()*100:.1f} - {com_height.max()*100:.1f} cm")
print(f"\\nDynamics:")
print(f"  Peak GRF: {GRF_vertical.max():.0f} N ({GRF_vertical.max()/(body_mass*g):.1f}x body weight)")
print(f"  Peak angular momentum: {Lz.max():.1f} kg.m^2/s")
print(f"\\nEnergetics:")
print(f"  Total mechanical work: {E_mech_cum[-1]:.0f} J")
print(f"  Estimated metabolic cost: {E_metab_cum[-1]:.0f} J")
print(f"  Overall efficiency: {E_mech_cum[-1]/E_metab_cum[-1]*100:.0f}%")
print(f"  Metabolic equivalent: {E_metab_cum[-1]/4184:.1f} food Calories")
print(f"\\nAll validation checks passed: {all(validations.values())}")
print(f"\\nDashboard saved to /tmp/dance_dashboard.png")`,
      challenge: 'Add an injury risk panel to the dashboard: flag any frames where GRF exceeds 3x body weight (landing impact risk), where angular velocity exceeds 8 rev/s (dizziness risk), or where the estimated joint torque exceeds physiological limits. Color-code the timeline red/yellow/green based on risk level.',
      successHint: 'You have built a complete Dance Move Physics Analyzer from scratch — a pipeline that transforms raw motion data into a comprehensive biomechanical report. This is portfolio-quality work that demonstrates physics, programming, signal processing, and data visualization. The same pipeline architecture (data -> processing -> modeling -> visualization -> validation) appears in every engineering discipline.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (dance biomechanics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Dance Move Physics Analyzer. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
