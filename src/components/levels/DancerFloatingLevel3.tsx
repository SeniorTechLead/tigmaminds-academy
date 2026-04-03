import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function DancerFloatingLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Center of mass & balance',
      concept: `Every object — and every human body — has a **center of mass** (CoM): the single point where the entire mass of the system can be considered to act. For a uniform rod, the CoM is at its geometric center. For a human standing upright, the CoM is roughly at the navel, about 55% of total height above the ground.

Balance is maintained when the vertical projection of the CoM falls within the **base of support** — the area enclosed by the contact points with the ground. Standing on two feet, the base of support is the polygon formed by the outlines of both feet. Standing on one foot, it shrinks to a single foot's area. A dancer on pointe reduces the base of support to roughly 10 square centimeters — an area smaller than a postage stamp.

The physics of balance is simple: if the CoM's vertical projection exits the base of support, gravity creates a **torque** that tips the body. The body must either shift the CoM back (by leaning) or widen the base (by stepping). Every dance move is a negotiation between these two strategies. Traditional dances from the floating markets of Northeast India involve rapid transitions between wide stances on unstable boat surfaces and narrow balances during expressive gestures — demanding extraordinary proprioceptive skill.`,
      analogy: 'Imagine balancing a broomstick upright on your palm. The stick\'s center of mass is halfway up. If it tilts, you must move your hand underneath to keep the CoM above your palm. Now imagine the broomstick is your body and your feet are the palm. Every dance movement is you moving the "palm" to stay under the ever-shifting "stick."',
      storyConnection: 'In "The Dancer of the Floating Market," the dancer performs on boats that shift and sway. The boat itself is a moving base of support, which means the dancer must constantly recalculate where the CoM falls relative to a platform that is itself in motion — a double balance problem that makes floating market dance uniquely challenging.',
      checkQuestion: 'A dancer stands on one foot (base of support = 12 cm x 8 cm rectangle). Her CoM is 95 cm above the ground and shifts 5 cm horizontally when she extends an arm. Is she still balanced?',
      checkAnswer: 'The base of support extends about 6 cm to each side of center (half of 12 cm). A 5 cm horizontal shift keeps the CoM projection within the 6 cm boundary, so she remains balanced — but barely. Adding just 2 cm more shift (perhaps by extending the other arm) would move the projection outside the base and she would need to step or lean to compensate.',
      codeIntro: 'Model a dancer\'s center of mass using a segmented body model and visualize how it shifts during different poses.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Segmented body model — each segment has a mass fraction and position
# Based on standard biomechanical data (Winter, 2009)
segments = {
    'head':       {'mass_frac': 0.081, 'length': 0.20},
    'trunk':      {'mass_frac': 0.497, 'length': 0.50},
    'upper_arm':  {'mass_frac': 0.028, 'length': 0.28},
    'forearm':    {'mass_frac': 0.016, 'length': 0.25},
    'hand':       {'mass_frac': 0.006, 'length': 0.10},
    'thigh':      {'mass_frac': 0.100, 'length': 0.40},
    'shank':      {'mass_frac': 0.047, 'length': 0.38},
    'foot':       {'mass_frac': 0.014, 'length': 0.25},
}

total_mass = 55.0  # kg
height = 1.60  # meters

# Define four dance poses as segment positions (x, y) of each segment's CoM
poses = {
    'Standing upright': {
        'head': (0, 1.50), 'trunk': (0, 1.10),
        'upper_arm_L': (-0.15, 1.10), 'upper_arm_R': (0.15, 1.10),
        'forearm_L': (-0.15, 0.85), 'forearm_R': (0.15, 0.85),
        'hand_L': (-0.15, 0.70), 'hand_R': (0.15, 0.70),
        'thigh_L': (-0.10, 0.65), 'thigh_R': (0.10, 0.65),
        'shank_L': (-0.10, 0.30), 'shank_R': (0.10, 0.30),
        'foot_L': (-0.10, 0.05), 'foot_R': (0.10, 0.05),
    },
    'Arabesque (one leg back)': {
        'head': (0.05, 1.45), 'trunk': (0.10, 1.05),
        'upper_arm_L': (-0.05, 1.30), 'upper_arm_R': (0.30, 1.20),
        'forearm_L': (-0.05, 1.50), 'forearm_R': (0.50, 1.10),
        'hand_L': (-0.05, 1.60), 'hand_R': (0.60, 1.00),
        'thigh_L': (-0.05, 0.65), 'thigh_R': (0.30, 0.90),
        'shank_L': (-0.05, 0.30), 'shank_R': (0.55, 1.00),
        'foot_L': (-0.05, 0.05), 'foot_R': (0.75, 1.05),
    },
    'Arms extended sideways': {
        'head': (0, 1.50), 'trunk': (0, 1.10),
        'upper_arm_L': (-0.30, 1.15), 'upper_arm_R': (0.30, 1.15),
        'forearm_L': (-0.55, 1.15), 'forearm_R': (0.55, 1.15),
        'hand_L': (-0.70, 1.15), 'hand_R': (0.70, 1.15),
        'thigh_L': (-0.10, 0.65), 'thigh_R': (0.10, 0.65),
        'shank_L': (-0.10, 0.30), 'shank_R': (0.10, 0.30),
        'foot_L': (-0.10, 0.05), 'foot_R': (0.10, 0.05),
    },
    'Boat-balance crouch': {
        'head': (0, 1.20), 'trunk': (0.05, 0.85),
        'upper_arm_L': (-0.25, 0.90), 'upper_arm_R': (0.25, 0.90),
        'forearm_L': (-0.35, 0.75), 'forearm_R': (0.35, 0.75),
        'hand_L': (-0.40, 0.65), 'hand_R': (0.40, 0.65),
        'thigh_L': (-0.15, 0.55), 'thigh_R': (0.15, 0.55),
        'shank_L': (-0.18, 0.25), 'shank_R': (0.18, 0.25),
        'foot_L': (-0.15, 0.05), 'foot_R': (0.15, 0.05),
    },
}

# Mass assignments for bilateral segments
mass_map = {
    'head': 0.081, 'trunk': 0.497,
    'upper_arm_L': 0.028, 'upper_arm_R': 0.028,
    'forearm_L': 0.016, 'forearm_R': 0.016,
    'hand_L': 0.006, 'hand_R': 0.006,
    'thigh_L': 0.100, 'thigh_R': 0.100,
    'shank_L': 0.047, 'shank_R': 0.047,
    'foot_L': 0.014, 'foot_R': 0.014,
}

fig, axes = plt.subplots(1, 4, figsize=(16, 6))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Center of Mass in Four Dance Poses', color='white', fontsize=14, fontweight='bold')

for ax, (pose_name, seg_positions) in zip(axes, poses.items()):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

    # Compute center of mass
    com_x, com_y, total_w = 0, 0, 0
    for seg_name, (sx, sy) in seg_positions.items():
        w = mass_map[seg_name]
        com_x += w * sx
        com_y += w * sy
        total_w += w
        ax.plot(sx, sy, 'o', color='#3b82f6', markersize=6, alpha=0.6)

    com_x /= total_w
    com_y /= total_w

    # Draw base of support
    feet = [(v[0], v[1]) for k, v in seg_positions.items() if 'foot' in k]
    if feet:
        base_left = min(f[0] for f in feet) - 0.05
        base_right = max(f[0] for f in feet) + 0.05
        ax.fill_between([base_left, base_right], -0.05, 0.05,
                       color='#22c55e', alpha=0.3, label='Base of support')
        ax.axvline(base_left, color='#22c55e', linewidth=1, linestyle='--', alpha=0.5)
        ax.axvline(base_right, color='#22c55e', linewidth=1, linestyle='--', alpha=0.5)

    # Plot CoM
    ax.plot(com_x, com_y, '*', color='#f59e0b', markersize=18, zorder=10)
    ax.axvline(com_x, color='#f59e0b', linewidth=1, linestyle=':', alpha=0.7)
    ax.set_title(pose_name, color='white', fontsize=10)
    ax.set_xlim(-0.9, 0.9)
    ax.set_ylim(-0.1, 1.7)
    ax.set_xlabel('x (m)', color='gray', fontsize=8)

axes[0].set_ylabel('Height (m)', color='gray', fontsize=9)
axes[0].legend(fontsize=7, loc='upper left')

plt.tight_layout()
plt.show()

print("Center of Mass analysis for each pose:")
print("=" * 55)
for pose_name, seg_positions in poses.items():
    com_x, com_y, total_w = 0, 0, 0
    for seg_name, (sx, sy) in seg_positions.items():
        w = mass_map[seg_name]
        com_x += w * sx; com_y += w * sy; total_w += w
    com_x /= total_w; com_y /= total_w
    print(f"{pose_name}:")
    print(f"  CoM = ({com_x:.3f}, {com_y:.3f}) m")
    print(f"  CoM height = {com_y:.2f} m ({com_y/height*100:.1f}% of body height)")`,
      challenge: 'Add a fifth pose where the dancer is leaning far to one side with one arm extended. Calculate whether the CoM projection falls outside the base of support. If it does, compute the restoring torque needed (torque = mass x g x horizontal_offset).',
      successHint: 'The center of mass is not a fixed point inside your body — it moves as you move. A skilled dancer exploits this fact, deliberately shifting the CoM to create the illusion of floating while maintaining just enough overlap with the base of support to avoid falling.',
    },
    {
      title: 'Angular momentum in spins',
      concept: `When a dancer spins, the physics of **angular momentum** takes over. Angular momentum L equals the moment of inertia I times the angular velocity omega: L = I x omega. The moment of inertia depends on how mass is distributed relative to the axis of rotation: I = sum(m_i x r_i^2), where r_i is the distance of each mass element from the spin axis.

The key principle is **conservation of angular momentum**: if no external torque acts, L remains constant. Since L = I x omega, if you decrease I (by pulling mass closer to the axis), omega must increase to compensate. This is why figure skaters and dancers spin faster when they pull their arms in and slower when they extend them.

The numbers are dramatic. A dancer with arms extended might have I = 4.0 kg.m^2 and spin at 2 revolutions per second (omega = 4pi rad/s). Pulling arms tight to the chest might reduce I to 1.5 kg.m^2, and conservation of L means omega increases to 4pi x (4.0/1.5) = approximately 5.3 revolutions per second. This is a 165% increase in spin speed — achieved without any additional muscular effort, purely through geometry.

Traditional dances from the floating markets use controlled spins where the dancer manages angular momentum while accounting for the boat's own rotation — effectively a two-body angular momentum problem.`,
      analogy: 'Imagine sitting on a swivel chair holding two heavy books at arm\'s length. Have someone give you a spin. Now pull the books to your chest — you speed up dramatically. Push them out — you slow down. The total angular momentum stays the same; you are just redistributing it between "fast spin, compact shape" and "slow spin, spread shape."',
      storyConnection: 'The dancer in the floating market story executes spins on a narrow boat deck. Each spin demonstrates conservation of angular momentum — arms spread wide for slow, graceful turns, then snapped inward for dramatic fast pirouettes. The boat\'s slight counter-rotation in the water is the equal and opposite reaction predicted by Newton\'s third law applied to angular motion.',
      checkQuestion: 'A dancer starts a pirouette with I = 3.5 kg.m^2 at 1.5 rev/s. She pulls her arms in, reducing I to 1.2 kg.m^2. What is her new spin rate?',
      checkAnswer: 'L = I1 x omega1 = 3.5 x 1.5 = 5.25 kg.m^2.rev/s. After pulling in: omega2 = L / I2 = 5.25 / 1.2 = 4.375 rev/s. She nearly triples her spin rate, going from a graceful rotation to a rapid pirouette.',
      codeIntro: 'Simulate how angular velocity changes as a dancer pulls arms in during a spin, and plot the relationship between moment of inertia and spin speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Angular Momentum Conservation in Dance Spins ---

# Body segment moments of inertia about vertical axis
# Approximation: each arm as a rod rotating about one end
arm_mass = 3.5  # kg per arm
arm_length = 0.60  # m
forearm_mass = 1.8  # kg per forearm
forearm_length = 0.30  # m

body_core_I = 1.2  # kg.m^2 (torso + legs, roughly constant)

def moment_of_inertia(arm_angle_deg):
    """Calculate total I as arms move from extended (90) to tucked (0)."""
    theta = np.radians(arm_angle_deg)
    # Arm distance from axis: r = arm_length * sin(theta)
    r_arm = arm_length * np.sin(theta) * 0.5  # CoM at half-length
    r_forearm = (arm_length * np.sin(theta) +
                 forearm_length * np.sin(theta) * 0.5)
    I_arms = 2 * (arm_mass * r_arm**2 + forearm_mass * r_forearm**2)
    return body_core_I + I_arms

# Simulate a spin: arms start at 80 degrees, pull to 5 degrees over 2 seconds
t = np.linspace(0, 2.0, 500)
arm_angles = 80 - 75 * (1 - np.exp(-2.5 * t))  # exponential pull-in

I_values = np.array([moment_of_inertia(a) for a in arm_angles])
initial_omega = 2.0 * 2 * np.pi  # 2 rev/s in rad/s
L = I_values[0] * initial_omega  # conserved angular momentum

omega_values = L / I_values  # rad/s
rpm_values = omega_values / (2 * np.pi)  # rev/s

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Angular Momentum Conservation During a Dance Spin',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Arm angle over time
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, arm_angles, color='#3b82f6', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Arm angle from body (degrees)', color='white')
ax.set_title('Arm position during pull-in', color='white')
ax.axhline(0, color='gray', linewidth=0.5, linestyle='--')

# Panel 2: Moment of inertia
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, I_values, color='#f59e0b', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Moment of inertia (kg.m²)', color='white')
ax.set_title('Moment of inertia decreases', color='white')

# Panel 3: Angular velocity
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(t, rpm_values, color='#22c55e', linewidth=2.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Spin rate (rev/s)', color='white')
ax.set_title('Spin rate increases (L conserved)', color='white')

# Panel 4: I vs omega (hyperbolic relationship)
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
I_range = np.linspace(I_values.min(), I_values.max(), 200)
omega_range = L / I_range / (2 * np.pi)
ax.plot(I_range, omega_range, color='#ef4444', linewidth=2.5)
ax.scatter([I_values[0], I_values[-1]], [rpm_values[0], rpm_values[-1]],
           color='white', s=100, zorder=10, edgecolors='#ef4444', linewidth=2)
ax.set_xlabel('Moment of inertia (kg.m²)', color='white')
ax.set_ylabel('Spin rate (rev/s)', color='white')
ax.set_title('I vs omega: hyperbolic curve (L = constant)', color='white')
ax.annotate('Arms out', (I_values[0], rpm_values[0]),
            textcoords="offset points", xytext=(10, 10), color='white', fontsize=9)
ax.annotate('Arms in', (I_values[-1], rpm_values[-1]),
            textcoords="offset points", xytext=(-50, -15), color='white', fontsize=9)

plt.tight_layout()
plt.show()

print(f"Angular momentum L = {L:.2f} kg.m^2/s (conserved)")
print(f"Arms extended: I = {I_values[0]:.3f} kg.m^2, spin = {rpm_values[0]:.2f} rev/s")
print(f"Arms tucked:   I = {I_values[-1]:.3f} kg.m^2, spin = {rpm_values[-1]:.2f} rev/s")
print(f"Speed multiplier: {rpm_values[-1]/rpm_values[0]:.2f}x")
print(f"\\nKey insight: The dancer does NO additional work to spin faster.")
print(f"The speed increase comes entirely from geometry — redistributing mass.")`,
      challenge: 'Extend the model to include the dancer holding a prop (a 0.5 kg flag on a 0.8 m pole) in one hand. How does this asymmetric mass distribution affect the spin? Calculate the wobble (precession) that results from the off-axis mass.',
      successHint: 'Angular momentum conservation is why every spinning dancer in the world uses the same technique — arms in to speed up, arms out to slow down. The physics is non-negotiable; the artistry is in how gracefully you exploit it.',
    },
    {
      title: 'Torque & rotational equilibrium',
      concept: `**Torque** is the rotational equivalent of force. While force causes linear acceleration, torque causes angular acceleration. Torque equals force times the perpendicular distance from the axis of rotation: tau = F x d x sin(theta). The unit is Newton-meters (N.m).

A body is in **rotational equilibrium** when the sum of all torques equals zero — clockwise torques exactly balance counterclockwise torques. A dancer holding a pose must achieve both translational equilibrium (net force = 0, so they don\'t accelerate linearly) and rotational equilibrium (net torque = 0, so they don\'t start spinning or tipping).

Consider a dancer leaning forward at the waist. Gravity pulls the upper body downward (creating a clockwise torque about the hips). To maintain equilibrium, the back muscles must generate an equal counterclockwise torque. If the upper body (mass ~35 kg) leans forward so its CoM is 0.25 m ahead of the hips, the gravitational torque is 35 x 9.8 x 0.25 = 85.75 N.m. The erector spinae muscles, acting at roughly 0.05 m behind the spine, must generate 85.75 / 0.05 = 1715 N of force — nearly 5 times the weight of the upper body. This is why back injuries are common in dancers; the mechanical disadvantage of the back muscles is severe.`,
      analogy: 'Think of a seesaw. A heavy child close to the pivot can balance a lighter child far from the pivot because torque = force x distance. Your body is full of seesaws: the elbow joint is a seesaw where the biceps muscle (close to the pivot) must pull with enormous force to lift a weight held in the hand (far from the pivot).',
      storyConnection: 'The floating market dancer must maintain rotational equilibrium not just in the body but also in the body-boat system. When the dancer leans forward, the boat tilts back. The dancer intuitively solves simultaneous equilibrium equations for both body and boat — a computational task that would challenge an engineering student but is performed effortlessly through years of practice.',
      checkQuestion: 'A dancer extends one leg horizontally behind (mass 12 kg, CoM 0.4 m behind hip joint). What counterbalancing torque must the hip flexors provide to hold this position? If the hip flexor attaches 0.08 m from the joint, what force must it exert?',
      checkAnswer: 'Gravitational torque from the leg: 12 x 9.8 x 0.4 = 47.04 N.m. The hip flexor must match this: F x 0.08 = 47.04, so F = 588 N (about 60 kg-force). The muscle must pull with 5x the weight of the leg due to its short lever arm. This is the mechanical disadvantage of biological lever systems.',
      codeIntro: 'Calculate and visualize the torques acting on a dancer\'s body in various poses, showing how muscles must compensate for gravitational torques.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Torque Analysis for Dance Poses ---

# Body segments with mass and typical CoM distances from joints
body_mass = 55.0  # kg total
g = 9.81  # m/s^2

# Define poses and their torque situations
# Each entry: (segment_name, mass_kg, distance_from_joint_m, muscle_lever_arm_m)
poses = {
    'Forward lean (45°)': [
        ('Upper body', 25.0, 0.25, 0.05, 'Erector spinae'),
        ('Head', 4.5, 0.35, 0.05, 'Erector spinae'),
    ],
    'Arabesque (leg back)': [
        ('Extended leg', 12.0, 0.40, 0.08, 'Hip flexors'),
        ('Upper body lean', 25.0, 0.15, 0.05, 'Erector spinae'),
    ],
    'Arms extended front': [
        ('Left arm', 3.5, 0.50, 0.04, 'Posterior deltoid'),
        ('Right arm', 3.5, 0.50, 0.04, 'Posterior deltoid'),
    ],
    'Deep plié (squat)': [
        ('Upper body', 25.0, 0.10, 0.05, 'Erector spinae'),
        ('Both thighs', 20.0, 0.20, 0.06, 'Quadriceps'),
    ],
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Torque Analysis: Gravity vs Muscle Force in Dance Poses',
             color='white', fontsize=14, fontweight='bold')

colors_grav = '#ef4444'
colors_musc = '#22c55e'

for ax, (pose_name, segments) in zip(axes.flat, poses.items()):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    names = []
    grav_torques = []
    muscle_forces = []
    mech_advantages = []

    for seg in segments:
        seg_name, mass, dist, lever, muscle = seg
        tau_grav = mass * g * dist
        f_muscle = tau_grav / lever
        ma = dist / lever  # mechanical disadvantage ratio

        names.append(f"{seg_name}\\n({muscle})")
        grav_torques.append(tau_grav)
        muscle_forces.append(f_muscle)
        mech_advantages.append(ma)

    x = np.arange(len(names))
    width = 0.35

    bars1 = ax.bar(x - width/2, grav_torques, width, color=colors_grav,
                   alpha=0.8, label='Gravity torque (N.m)')
    bars2 = ax.bar(x + width/2, [f * 0.05 for f in muscle_forces], width,
                   color=colors_musc, alpha=0.8, label='Muscle torque (N.m)')

    # Annotate with muscle force
    for i, (f, ma) in enumerate(zip(muscle_forces, mech_advantages)):
        ax.text(x[i] + width/2, grav_torques[i] * 0.5,
                f'F = {f:.0f} N\\nMA = {ma:.1f}x',
                color='white', fontsize=8, ha='center', va='center')

    ax.set_title(pose_name, color='white', fontsize=11)
    ax.set_xticks(x)
    ax.set_xticklabels(names, fontsize=8, color='white')
    ax.set_ylabel('Torque (N.m)', color='white', fontsize=9)
    if ax == axes.flat[0]:
        ax.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("Torque summary for all poses:")
print("=" * 70)
for pose_name, segments in poses.items():
    print(f"\\n{pose_name}:")
    total_torque = 0
    for seg in segments:
        seg_name, mass, dist, lever, muscle = seg
        tau = mass * g * dist
        f = tau / lever
        total_torque += tau
        print(f"  {seg_name}: tau = {tau:.1f} N.m | {muscle} force = {f:.0f} N "
              f"(mech. disadvantage = {dist/lever:.1f}x)")
    print(f"  Total gravitational torque: {total_torque:.1f} N.m")`,
      challenge: 'Add a "dancer on a tilting boat" analysis: if the boat tilts 10 degrees, the effective gravitational torque changes because the gravity vector is no longer perpendicular to the deck. Recalculate all torques with the boat at 0, 5, 10, and 15 degree tilts.',
      successHint: 'The mechanical disadvantage of human muscles — they attach close to joints but must counteract forces acting far from joints — is the fundamental reason dance is so physically demanding. Every graceful pose is maintained by muscle forces 5-10x larger than the weight of the limbs involved.',
    },
    {
      title: 'Biomechanical energy in jumps',
      concept: `A dance jump is a projectile motion problem where the projectile is the dancer's own body. The physics splits into two phases: the **launch** (muscle-powered upward acceleration) and the **flight** (projectile motion governed solely by gravity, once the feet leave the ground).

During launch, the dancer's legs do work to accelerate the body upward. The kinetic energy at takeoff equals KE = 0.5 x m x v^2, where v is the vertical velocity at the moment of liftoff. This kinetic energy is converted to gravitational potential energy at the peak: PE = m x g x h, where h is the height of the jump. Setting KE = PE gives h = v^2 / (2g).

A typical dance jump reaches 0.3-0.5 m height, requiring takeoff velocities of 2.4-3.1 m/s. The power output is impressive: a 55 kg dancer pushing off over 0.3 seconds to reach 3 m/s generates an average force of 55 x 3/0.3 = 550 N above body weight, for a total ground reaction force of about 1090 N — nearly double body weight. The **rate of force development** (how quickly force ramps up) is a key biomechanical measure of explosive power and varies significantly between dance styles.

The illusion of "floating" at the peak of a jump comes from a biomechanical trick: the dancer raises their legs during the ascent and lowers them during the descent, keeping the torso at a nearly constant height even though the CoM follows a perfect parabola. The audience watches the torso, not the CoM, and perceives a longer hang time.`,
      analogy: 'A dance jump is like a ball thrown upward: it follows a parabola, spending equal time going up and coming down. The "floating" illusion is like a magician\'s misdirection — the dancer\'s CoM follows boring physics, but by raising the legs (moving mass upward relative to the torso) the visible part of the body appears to hover at the peak.',
      storyConnection: 'When the floating market dancer leaps between boats, the jump height and trajectory must be precisely controlled. Too much height wastes energy; too little and the dancer falls short. The landing must also account for the boat\'s recoil — the momentum transferred to the landing boat pushes it away, and the dancer must absorb this with bent knees.',
      checkQuestion: 'A 55 kg dancer jumps 0.4 m high. What was the takeoff velocity? How much kinetic energy was needed? If the push-off took 0.25 seconds, what was the average power output of the legs?',
      checkAnswer: 'v = sqrt(2 x 9.81 x 0.4) = 2.80 m/s. KE = 0.5 x 55 x 2.80^2 = 215.6 J. Power = 215.6 / 0.25 = 862 W. For context, a professional cyclist sustains about 400 W — the dancer briefly produces more than double that, but only for a quarter of a second.',
      codeIntro: 'Simulate the full biomechanics of a dance jump: ground reaction forces, trajectory, the floating illusion, and energy analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.81
mass = 55.0  # kg
jump_height = 0.40  # meters

# Phase 1: Calculate takeoff velocity and push-off dynamics
v_takeoff = np.sqrt(2 * g * jump_height)
push_off_time = 0.25  # seconds
push_off_dt = np.linspace(0, push_off_time, 100)

# Ground reaction force profile (sinusoidal push-off)
# F = mg + F_extra * sin(pi*t/T) during push-off
impulse_needed = mass * v_takeoff  # kg.m/s
# Integral of F_extra*sin over [0,T] = F_extra * 2T/pi
F_extra_peak = impulse_needed * np.pi / (2 * push_off_time)
GRF = mass * g + F_extra_peak * np.sin(np.pi * push_off_dt / push_off_time)

# Phase 2: Flight (projectile motion)
flight_time = 2 * v_takeoff / g
flight_dt = np.linspace(0, flight_time, 200)
y_com = v_takeoff * flight_dt - 0.5 * g * flight_dt**2

# The floating illusion: torso height vs CoM height
# Dancer raises legs during ascent, lowers during descent
leg_raise = 0.15 * np.sin(np.pi * flight_dt / flight_time)  # legs go up, torso stays
y_torso = y_com + leg_raise  # torso appears higher

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Biomechanics of a Dance Jump (height = 40 cm)',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Ground reaction force
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.fill_between(push_off_dt * 1000, GRF, mass * g, color='#ef4444', alpha=0.4)
ax.plot(push_off_dt * 1000, GRF, color='#ef4444', linewidth=2.5)
ax.axhline(mass * g, color='gray', linewidth=1, linestyle='--', label=f'Body weight = {mass*g:.0f} N')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Ground reaction force (N)', color='white')
ax.set_title('Push-off phase: GRF profile', color='white')
ax.legend(fontsize=9)
ax.text(push_off_time*500, F_extra_peak + mass*g - 50,
        f'Peak = {F_extra_peak + mass*g:.0f} N\\n({(F_extra_peak + mass*g)/(mass*g):.1f}x body weight)',
        color='white', fontsize=9)

# Panel 2: Trajectory — CoM vs Torso (floating illusion)
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.plot(flight_dt * 1000, y_com * 100, color='#3b82f6', linewidth=2.5,
        label='Center of mass (parabola)')
ax.plot(flight_dt * 1000, y_torso * 100, color='#f59e0b', linewidth=2.5,
        linestyle='--', label='Torso height (what audience sees)')
ax.axhline(jump_height * 100 * 0.9, color='gray', linewidth=0.5, linestyle=':')
ax.set_xlabel('Time in air (ms)', color='white')
ax.set_ylabel('Height (cm)', color='white')
ax.set_title('The "floating" illusion', color='white')
ax.legend(fontsize=9)

# Panel 3: Energy analysis
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
KE = 0.5 * mass * (v_takeoff - g * flight_dt)**2
PE = mass * g * y_com
total_E = np.full_like(flight_dt, 0.5 * mass * v_takeoff**2)
ax.plot(flight_dt * 1000, KE, color='#ef4444', linewidth=2, label='Kinetic energy')
ax.plot(flight_dt * 1000, PE, color='#22c55e', linewidth=2, label='Potential energy')
ax.plot(flight_dt * 1000, total_E, color='white', linewidth=2, linestyle='--', label='Total energy')
ax.set_xlabel('Time in air (ms)', color='white')
ax.set_ylabel('Energy (J)', color='white')
ax.set_title('Energy conservation during flight', color='white')
ax.legend(fontsize=9)

# Panel 4: Height vs takeoff velocity
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
v_range = np.linspace(0, 4.0, 100)
h_range = v_range**2 / (2 * g)
ax.plot(v_range, h_range * 100, color='#a855f7', linewidth=2.5)
ax.scatter([v_takeoff], [jump_height * 100], color='#f59e0b', s=100, zorder=10)
ax.annotate(f'Our jump: {v_takeoff:.2f} m/s, {jump_height*100:.0f} cm',
            (v_takeoff, jump_height * 100), textcoords="offset points",
            xytext=(10, 10), color='white', fontsize=9)
ax.set_xlabel('Takeoff velocity (m/s)', color='white')
ax.set_ylabel('Jump height (cm)', color='white')
ax.set_title('Jump height vs takeoff velocity', color='white')

plt.tight_layout()
plt.show()

print(f"Jump analysis:")
print(f"  Height: {jump_height*100:.0f} cm")
print(f"  Takeoff velocity: {v_takeoff:.2f} m/s")
print(f"  Flight time: {flight_time*1000:.0f} ms")
print(f"  Peak GRF: {F_extra_peak + mass*g:.0f} N ({(F_extra_peak + mass*g)/(mass*g):.1f}x body weight)")
print(f"  Kinetic energy at takeoff: {0.5*mass*v_takeoff**2:.1f} J")
print(f"  Average power during push-off: {0.5*mass*v_takeoff**2/push_off_time:.0f} W")`,
      challenge: 'Model a jump between two boats: the dancer must clear a 0.5 m horizontal gap while also jumping 0.3 m high. Calculate the optimal takeoff angle, required velocity, and the recoil velocity of both the launch boat and landing boat (assume each boat has a mass of 200 kg).',
      successHint: 'Every jump is a negotiation between muscle power and gravity. The floating illusion shows that biomechanics is not just physics — it is physics combined with the perceptual psychology of the audience.',
    },
    {
      title: 'Momentum transfer in partner dance',
      concept: `When two dancers interact — holding hands, pushing off, or catching each other — **conservation of linear momentum** governs the physics. The total momentum of the system (dancer A + dancer B) before and after an interaction must be equal if no external horizontal forces act.

Consider two dancers of masses m1 and m2 who push off from each other while standing close. Initially both are stationary, so total momentum = 0. After the push: m1*v1 + m2*v2 = 0, meaning v1/v2 = -m2/m1. The lighter dancer moves faster in the opposite direction. If m1 = 50 kg and m2 = 70 kg, and the 70 kg dancer moves at 1 m/s, the 50 kg dancer moves at -1.4 m/s. The lighter dancer always recoils faster.

In a catch move, the problem becomes an inelastic collision. A 50 kg dancer running at 3 m/s is caught by a 70 kg stationary dancer. The combined velocity is (50 x 3) / (50 + 70) = 1.25 m/s. The kinetic energy before was 225 J; after, it is 0.5 x 120 x 1.25^2 = 93.75 J. The "missing" 131.25 J was absorbed by the muscles and joints of both dancers. This is why catching technique matters — the goal is to dissipate that energy gradually through bent knees and controlled deceleration, not abruptly through stiff joints.`,
      analogy: 'Two dancers pushing off from each other are like two ice skaters who face each other and push — both slide away from the point of contact, with the lighter one moving faster. A catch move is like catching an egg — you have to move your hand backward with the egg to absorb the impact gently, or the egg breaks. The dancer\'s body is the hand; the running partner is the egg.',
      storyConnection: 'In the floating market, dancers sometimes reach across from one boat to another for partner movements. The momentum exchange between the dancers causes the boats to move in response — a vivid demonstration of Newton\'s third law. The boats are low-friction "platforms" that make momentum conservation visible in a way that hard ground does not.',
      checkQuestion: 'Two dancers (55 kg and 65 kg) on separate 150 kg boats push off from each other. The 65 kg dancer plus their boat moves at 0.3 m/s. What is the velocity of the 55 kg dancer plus their boat?',
      checkAnswer: 'Total momentum = 0 initially. (65 + 150) x 0.3 + (55 + 150) x v2 = 0. So 64.5 + 205 x v2 = 0, giving v2 = -64.5 / 205 = -0.315 m/s. The lighter dancer-boat system moves slightly faster in the opposite direction, as expected from momentum conservation.',
      codeIntro: 'Simulate momentum exchange in partner dance moves: push-offs, catches, and lifts, visualizing the velocity and energy changes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Momentum Transfer in Partner Dance ---
g = 9.81

# Scenario 1: Push-off on boats
m1, m2 = 55.0, 65.0  # dancer masses (kg)
m_boat = 150.0  # boat mass (kg)

# Push-off: impulse = F * dt
push_impulse = 80.0  # N.s (typical push-off impulse)

v1_after = -push_impulse / (m1 + m_boat)  # dancer 1 + boat
v2_after = push_impulse / (m2 + m_boat)   # dancer 2 + boat

# Scenario 2: Running catch (inelastic collision)
v_runner = 3.0  # m/s
m_runner = 50.0
m_catcher = 70.0
v_combined = (m_runner * v_runner) / (m_runner + m_catcher)
KE_before = 0.5 * m_runner * v_runner**2
KE_after = 0.5 * (m_runner + m_catcher) * v_combined**2
energy_absorbed = KE_before - KE_after

# Scenario 3: Varying mass ratios
mass_ratios = np.linspace(0.5, 2.0, 100)
m_fixed = 60.0
v_lighter = push_impulse / (m_fixed / mass_ratios + m_boat)
v_heavier = push_impulse / (m_fixed * mass_ratios + m_boat)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Momentum Transfer in Partner Dance',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Push-off on boats — velocity comparison
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
labels = [f'Dancer 1\\n({m1}kg + {m_boat}kg boat)', f'Dancer 2\\n({m2}kg + {m_boat}kg boat)']
velocities = [abs(v1_after), abs(v2_after)]
momenta = [(m1+m_boat)*abs(v1_after), (m2+m_boat)*abs(v2_after)]
bars = ax.bar(labels, velocities, color=['#3b82f6', '#f59e0b'], alpha=0.8)
for bar, v, p in zip(bars, velocities, momenta):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.005,
            f'v = {v:.3f} m/s\\np = {p:.1f} kg.m/s', ha='center', color='white', fontsize=9)
ax.set_ylabel('Speed (m/s)', color='white')
ax.set_title('Push-off: lighter system moves faster', color='white')

# Panel 2: Catch — energy analysis
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
categories = ['KE before\\n(runner only)', 'KE after\\n(combined)', 'Energy absorbed\\n(by muscles)']
values = [KE_before, KE_after, energy_absorbed]
colors = ['#ef4444', '#22c55e', '#f59e0b']
bars = ax.bar(categories, values, color=colors, alpha=0.8)
for bar, v in zip(bars, values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 3,
            f'{v:.1f} J', ha='center', color='white', fontsize=10)
ax.set_ylabel('Energy (J)', color='white')
ax.set_title(f'Catch move: {m_runner}kg at {v_runner}m/s caught by {m_catcher}kg', color='white')

# Panel 3: Time evolution of a catch (deceleration)
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
catch_duration = 0.5  # seconds to decelerate
t_catch = np.linspace(0, catch_duration, 200)
# Exponential deceleration (soft catch)
v_runner_t = v_combined + (v_runner - v_combined) * np.exp(-6 * t_catch)
v_catcher_t = v_combined * (1 - np.exp(-6 * t_catch))
ax.plot(t_catch * 1000, v_runner_t, color='#ef4444', linewidth=2.5, label=f'Runner ({m_runner}kg)')
ax.plot(t_catch * 1000, v_catcher_t, color='#3b82f6', linewidth=2.5, label=f'Catcher ({m_catcher}kg)')
ax.axhline(v_combined, color='gray', linewidth=1, linestyle='--', label=f'Final v = {v_combined:.2f} m/s')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Velocity (m/s)', color='white')
ax.set_title('Catch deceleration over time', color='white')
ax.legend(fontsize=9)

# Panel 4: Mass ratio effect on recoil velocities
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
m_a = np.linspace(40, 80, 100)
m_b = 60.0  # fixed partner mass
v_a = push_impulse / (m_a + m_boat)
v_b = push_impulse / (m_b + m_boat)
ax.plot(m_a, v_a * 100, color='#3b82f6', linewidth=2.5, label='Dancer A velocity')
ax.axhline(v_b * 100, color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Dancer B velocity (fixed at {m_b}kg)')
ax.set_xlabel('Dancer A mass (kg)', color='white')
ax.set_ylabel('Recoil speed (cm/s)', color='white')
ax.set_title('How mass affects recoil speed (on boats)', color='white')
ax.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Momentum analysis summary:")
print(f"\\nPush-off on boats (impulse = {push_impulse} N.s):")
print(f"  Dancer 1 ({m1}kg) + boat: v = {abs(v1_after):.4f} m/s")
print(f"  Dancer 2 ({m2}kg) + boat: v = {abs(v2_after):.4f} m/s")
print(f"  Total momentum: {(m1+m_boat)*v1_after + (m2+m_boat)*v2_after:.6f} kg.m/s (≈ 0)")
print(f"\\nCatch move:")
print(f"  Runner: {m_runner}kg at {v_runner} m/s = {m_runner*v_runner:.1f} kg.m/s")
print(f"  Combined velocity: {v_combined:.2f} m/s")
print(f"  Energy absorbed by muscles: {energy_absorbed:.1f} J ({energy_absorbed/KE_before*100:.1f}% of total)")`,
      challenge: 'Model a lift: dancer A (55 kg) is lifted by dancer B (75 kg). Calculate the force B must exert, the work done to raise A by 0.5 m, the power required to complete the lift in 1 second, and the combined CoM position at each stage.',
      successHint: 'Every partner dance move is a momentum exchange problem. The physics dictates that the lighter dancer always moves faster, the energy lost in catches must be absorbed by muscles, and boats make the physics visible by removing friction.',
    },
    {
      title: 'Fluid dynamics of dance on water',
      concept: `Dancing on a boat means interacting with **fluid dynamics**. When a dancer shifts weight on a boat, the boat rocks, displacing water. The restoring force comes from **buoyancy** — described by Archimedes\' principle: the upward force equals the weight of water displaced.

A flat-bottomed boat of width W, length L, and draft d experiences a restoring torque when tilted by angle theta: tau_restore = rho_water x g x L x W^3 / 12 x sin(theta), where rho_water = 1000 kg/m^3. This creates oscillatory rocking with a natural period that depends on the boat\'s **metacentric height** — the distance between the center of buoyancy and the metacenter. A higher metacentric height means faster rocking (more stable but less comfortable); a lower metacentric height means slower, gentler rocking but greater risk of capsizing.

The dancer must synchronize movements with the boat\'s natural rocking period. Dancing "against" the boat — shifting weight when the boat is tilting the other way — amplifies the oscillation and risks capsizing. Dancing "with" the boat — moving in phase — maintains stability. This is a forced oscillation problem where the dancer is the driving force and the boat is the oscillator. The dancer intuitively avoids the **resonance frequency** of the boat, because exciting resonance would mean maximum rocking amplitude.

Viscous damping from the water determines how quickly rocking decays. In calm water (low damping), a single misstep can cause oscillations that persist for many seconds. In flowing water (higher damping), the boat settles faster but introduces new challenges from current forces.`,
      analogy: 'A boat in water is like a pendulum — tip it and it swings back, overshoots, swings again, and gradually settles. The dancer must time their movements to this pendulum. It is like pushing a child on a swing: push in rhythm and the swings grow enormous (resonance — dangerous on a boat). Push off-rhythm and the motion stays small.',
      storyConnection: 'The floating market story takes place on boats in waterways. The dancer\'s skill is not just in the dance moves themselves but in coupling those moves to the boat\'s natural dynamics. The best floating market dancers have an intuitive understanding of hydrodynamics that allows them to create the illusion of dancing on solid ground while actually performing on a rocking, responsive surface.',
      checkQuestion: 'A boat is 4 m long, 1.2 m wide, and has a metacentric height of 0.3 m. Its total mass (boat + dancer) is 250 kg. Estimate the natural rocking period.',
      checkAnswer: 'The rocking period for small angles is approximately T = 2*pi*sqrt(I / (m*g*GM)), where GM is metacentric height. For a rectangular cross-section, the moment of inertia about the roll axis is roughly m*W^2/12 = 250*1.44/12 = 30 kg.m^2. T = 2*pi*sqrt(30/(250*9.81*0.3)) = 2*pi*sqrt(0.0408) = 2*pi*0.202 = 1.27 seconds. The boat rocks about once per 1.3 seconds.',
      codeIntro: 'Simulate boat rocking dynamics when a dancer shifts weight, including buoyancy restoring forces, damping, and resonance analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Boat Rocking Dynamics ---
g = 9.81
rho_water = 1000.0  # kg/m^3

# Boat parameters
boat_length = 4.0  # m
boat_width = 1.2   # m
boat_mass = 180.0   # kg
dancer_mass = 55.0
total_mass = boat_mass + dancer_mass

# Metacentric height (stability measure)
# For flat-bottom: BM = I_waterplane / V_displaced
V_displaced = total_mass / rho_water  # m^3
draft = V_displaced / (boat_length * boat_width)
I_waterplane = boat_length * boat_width**3 / 12
BM = I_waterplane / V_displaced
KB = draft / 2  # center of buoyancy above keel
KG = 0.35  # center of gravity above keel (with dancer standing)
GM = KB + BM - KG  # metacentric height

# Moment of inertia for rolling
I_roll = total_mass * boat_width**2 / 12

# Natural frequency and period
omega_n = np.sqrt(total_mass * g * GM / I_roll)
T_natural = 2 * np.pi / omega_n

# Damping coefficient (water viscosity)
damping_ratio = 0.15  # underdamped

# Simulate: dancer shifts weight at different frequencies
t = np.linspace(0, 15, 3000)
dt = t[1] - t[0]

def simulate_rocking(drive_period, damping=damping_ratio):
    """Simulate boat rocking with dancer weight shifts."""
    omega_d = 2 * np.pi / drive_period if drive_period > 0 else 0
    theta = np.zeros_like(t)
    omega = np.zeros_like(t)
    # Forcing: dancer shifts CoM by 0.2 m sinusoidally
    shift_amplitude = 0.2  # m
    for i in range(1, len(t)):
        # External torque from dancer's weight shift
        if drive_period > 0:
            tau_ext = dancer_mass * g * shift_amplitude * np.sin(omega_d * t[i])
        else:
            tau_ext = 0
        # Restoring torque
        tau_restore = -total_mass * g * GM * np.sin(theta[i-1])
        # Damping torque
        tau_damp = -2 * damping * omega_n * I_roll * omega[i-1]
        # Angular acceleration
        alpha = (tau_ext + tau_restore + tau_damp) / I_roll
        omega[i] = omega[i-1] + alpha * dt
        theta[i] = theta[i-1] + omega[i] * dt
    return np.degrees(theta)

# Three scenarios: below resonance, at resonance, above resonance
drive_periods = [T_natural * 2, T_natural, T_natural * 0.5]
labels = ['Slow dancing (2x period)', 'AT RESONANCE (danger!)', 'Fast dancing (0.5x period)']
colors = ['#22c55e', '#ef4444', '#3b82f6']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Boat Rocking Dynamics: Dancer as Driving Force',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Time series for three frequencies
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for period, label, color in zip(drive_periods, labels, colors):
    theta_deg = simulate_rocking(period)
    ax.plot(t, theta_deg, color=color, linewidth=1.5, label=label, alpha=0.9)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Tilt angle (degrees)', color='white')
ax.set_title(f'Rocking response (natural period = {T_natural:.2f} s)', color='white')
ax.legend(fontsize=8)
ax.axhline(0, color='gray', linewidth=0.5)

# Panel 2: Frequency response curve
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
freq_ratios = np.linspace(0.1, 3.0, 200)
# Amplitude response of damped driven oscillator
amp_response = 1.0 / np.sqrt((1 - freq_ratios**2)**2 + (2 * damping_ratio * freq_ratios)**2)
ax.plot(freq_ratios, amp_response, color='#f59e0b', linewidth=2.5)
ax.axvline(1.0, color='#ef4444', linewidth=1.5, linestyle='--', label='Resonance (ratio = 1)')
ax.set_xlabel('Frequency ratio (f_dance / f_natural)', color='white')
ax.set_ylabel('Amplitude multiplier', color='white')
ax.set_title('Resonance curve: avoid ratio = 1!', color='white')
ax.legend(fontsize=9)

# Panel 3: Free decay (how long rocking persists)
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for zeta, label, color in [(0.05, 'Calm water (low damping)', '#ef4444'),
                            (0.15, 'Normal water', '#f59e0b'),
                            (0.40, 'Flowing river (high damping)', '#22c55e')]:
    theta_free = 5 * np.exp(-zeta * omega_n * t) * np.cos(omega_n * np.sqrt(1 - zeta**2) * t)
    ax.plot(t, theta_free, color=color, linewidth=2, label=label)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Tilt angle (degrees)', color='white')
ax.set_title('Free decay: effect of water damping', color='white')
ax.legend(fontsize=9)

# Panel 4: Stability diagram
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
widths = np.linspace(0.6, 2.0, 50)
dancer_heights = [0.2, 0.35, 0.5]  # KG values
for kg, color, label in zip(dancer_heights, ['#22c55e', '#f59e0b', '#ef4444'],
                             ['Low CoG (crouching)', 'Normal standing', 'Arms raised high']):
    gm_vals = []
    for w in widths:
        V = total_mass / rho_water
        d_loc = V / (boat_length * w)
        Iw = boat_length * w**3 / 12
        bm_loc = Iw / V
        kb_loc = d_loc / 2
        gm_loc = kb_loc + bm_loc - kg
        gm_vals.append(gm_loc)
    ax.plot(widths, gm_vals, color=color, linewidth=2.5, label=label)
ax.axhline(0, color='#ef4444', linewidth=2, linestyle='--', alpha=0.5)
ax.fill_between(widths, -0.5, 0, color='#ef4444', alpha=0.1)
ax.text(1.0, -0.15, 'CAPSIZE ZONE (GM < 0)', color='#ef4444', fontsize=10, fontweight='bold')
ax.set_xlabel('Boat width (m)', color='white')
ax.set_ylabel('Metacentric height GM (m)', color='white')
ax.set_title('Stability vs boat width and dancer posture', color='white')
ax.legend(fontsize=9)
ax.set_ylim(-0.3, 1.5)

plt.tight_layout()
plt.show()

print(f"Boat parameters:")
print(f"  Dimensions: {boat_length} x {boat_width} m, draft = {draft:.3f} m")
print(f"  Metacentric height GM = {GM:.3f} m")
print(f"  Natural rocking period = {T_natural:.2f} s ({1/T_natural:.2f} Hz)")
print(f"  Damping ratio = {damping_ratio}")
print(f"\\nKey insight: The dancer must AVOID the natural rocking frequency.")
print(f"Dancing at {T_natural:.2f}s period causes resonance — maximum tilt.")
print(f"Safe dance rhythms: < {T_natural*0.7:.2f}s or > {T_natural*1.5:.2f}s period.")`,
      challenge: 'Add a wave effect: the water itself oscillates with a 2-second period and 5 cm amplitude. Now the boat is driven by BOTH the waves and the dancer. Find the dancer\'s optimal rhythm that minimizes total rocking when waves are present (hint: destructive interference).',
      successHint: 'The floating market dancer is unconsciously solving a fluid dynamics problem: avoid resonance, use damping, and time movements to the boat\'s natural period. This same physics governs how ships are stabilized, how earthquake-resistant buildings are designed, and how suspension bridges handle wind.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Dance Biomechanics & Physics
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (balance fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real biomechanics and physics simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
