import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MonkeyBridgeLevel3() {
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
      title: 'Primate locomotion biomechanics — how monkeys move through three-dimensional forests',
      concept: `Primates have evolved a remarkable diversity of locomotion modes, each adapted to different forest structures. The main modes are: **quadrupedal walking** (on branches, like macaques), **brachiation** (swinging below branches by arms, like gibbons), **vertical clinging and leaping** (jumping between vertical trunks, like tarsiers), **suspensory locomotion** (hanging and moving slowly below branches, like orangutans), and **bipedal walking** (on the ground or large branches, like humans).

Each mode involves different biomechanical tradeoffs. Quadrupedal walking is energetically cheap on horizontal surfaces but requires wide, stable branches. Brachiation is fast through the canopy but demands extreme upper-body strength and long arms. Leaping is fast but high-risk — a missed landing means a potentially fatal fall. The locomotion mode an animal uses determines which parts of the forest it can access and how it connects different resource patches.

The **Froude number** (Fr = v^2 / gL) is a dimensionless parameter that characterizes gait transitions. Here, v is speed, g is gravitational acceleration, and L is leg (or arm) length. At Fr < 0.5, primates walk; at Fr > 0.5, they transition to running or galloping. For brachiating primates, an analogous parameter uses arm length and swing speed.

The **cost of transport** (COT) measures energy per unit distance per unit body mass: COT = metabolic rate / (body mass * speed). Arboreal locomotion typically costs 2-4 times more energy than terrestrial locomotion of the same speed, because the animal must navigate a three-dimensional, discontinuous substrate — branches of varying diameter, angle, and stability. This energetic cost shapes primate ranging patterns, group sizes, and habitat selection.`,
      analogy: 'Imagine navigating a city where the only paths are ropes strung between buildings at various heights, with different rope thicknesses and tensions. Walking on a thick taut rope (large branch) is easy. Swinging from rope to rope (brachiation) is fast but exhausting. Jumping between buildings (leaping) is terrifying. The city layout (forest structure) determines which routes are possible, and your body shape (anatomy) determines which modes you can use. Primates are the ultimate parkour athletes of this rope-city.',
      storyConnection: 'The monkeys in the story build a bridge — a cooperative locomotion solution. In the forests of Northeast India, Assamese macaques and hoolock gibbons face real canopy gaps every day. The macaques use quadrupedal locomotion on large branches and occasional leaps for gaps under 3 meters. The gibbons brachiate across gaps up to 10 meters. When the canopy is broken by logging or road construction, these locomotion modes fail, and the animals become trapped — which is exactly the crisis the story depicts.',
      checkQuestion: 'A hoolock gibbon (arm span 1.5 m) needs to cross a 12-meter gap between two trees. Its maximum brachiation speed is 3 m/s. Can it cross by swinging, and if not, what alternatives does it have?',
      checkAnswer: 'At 3 m/s and 1.5 m arm reach, the gibbon completes one swing arc (roughly pi * arm_length = 4.7 m) every pi * 1.5 / 3 = 1.57 seconds, covering about 3 m of horizontal distance per swing. To cross 12 m would require 4 consecutive swings with perfect branch spacing — possible in continuous canopy but impossible across a true gap. Without intermediate supports, the gibbon must: (1) find an alternative route around the gap (often adding 100+ meters), (2) descend to the ground and cross terrestrially (high predation risk for gibbons), or (3) not cross at all, fragmenting its range. This is why canopy connectivity is critical for arboreal primates.',
      codeIntro: 'Model the biomechanics of different primate locomotion modes and compare their speed, energy cost, and gap-crossing ability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Primate Locomotion Biomechanics ---

class PrimateLocomotion:
    """Model different locomotion modes for primates."""

    def __init__(self, species, mass_kg, arm_length_m, leg_length_m):
        self.species = species
        self.mass = mass_kg
        self.arm = arm_length_m
        self.leg = leg_length_m
        self.g = 9.81

    def froude_number(self, speed, limb='leg'):
        """Fr = v^2 / (g * L)"""
        L = self.leg if limb == 'leg' else self.arm
        return speed**2 / (self.g * L)

    def max_brachiation_speed(self):
        """Max speed limited by pendulum dynamics."""
        return np.sqrt(self.g * self.arm) * 1.5  # empirical factor

    def max_leap_distance(self, launch_angle=45):
        """Maximum leap distance from a branch."""
        v_max = np.sqrt(2 * self.g * self.leg * 2)  # max jump velocity
        angle_rad = np.radians(launch_angle)
        return v_max**2 * np.sin(2 * angle_rad) / self.g

    def cost_of_transport(self, speed, mode='quadrupedal'):
        """Energy cost in J/(kg*m) for different modes."""
        if mode == 'quadrupedal':
            # Terrestrial quadrupedal: COT ~ 10.7 * M^(-0.32) * speed^0.5
            return 10.7 * self.mass**(-0.32) * max(speed, 0.1)**0.5
        elif mode == 'brachiation':
            # Brachiation: ~2x cost of quadrupedal at same speed
            return 2.0 * 10.7 * self.mass**(-0.32) * max(speed, 0.1)**0.5
        elif mode == 'leaping':
            # Leaping: very high cost per distance
            return 4.0 * 10.7 * self.mass**(-0.32) * max(speed, 0.1)**0.5
        elif mode == 'climbing':
            # Vertical climbing: highest cost
            return 6.0 * 10.7 * self.mass**(-0.32) * max(speed, 0.1)**0.5
        return 10.0

# NE Indian primates
species = {
    'Hoolock gibbon': PrimateLocomotion('Hoolock gibbon', 7, 0.75, 0.35),
    'Assamese macaque': PrimateLocomotion('Assamese macaque', 10, 0.40, 0.35),
    'Capped langur': PrimateLocomotion('Capped langur', 12, 0.45, 0.40),
    'Slow loris': PrimateLocomotion('Slow loris', 1.5, 0.15, 0.12),
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Speed capabilities by mode
ax = axes[0, 0]
ax.set_facecolor('#111827')
modes = ['quadrupedal', 'brachiation', 'leaping', 'climbing']
mode_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
x = np.arange(len(species))
width = 0.2

for i, (mode, color) in enumerate(zip(modes, mode_colors)):
    speeds = []
    for name, sp in species.items():
        if mode == 'brachiation':
            speeds.append(sp.max_brachiation_speed())
        elif mode == 'leaping':
            speeds.append(sp.max_leap_distance() / 0.5)  # distance/time
        elif mode == 'climbing':
            speeds.append(1.0 * sp.mass**(-0.2))
        else:
            speeds.append(2.0 * sp.leg / 0.3)  # scaled by leg length
    ax.bar(x + i * width, speeds, width, color=color, label=mode, edgecolor='none')

ax.set_xticks(x + 1.5 * width)
ax.set_xticklabels(species.keys(), color='white', fontsize=7, rotation=15)
ax.set_ylabel('Max speed (m/s)', color='white')
ax.set_title('Locomotion speed by mode and species', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Cost of transport vs speed
ax = axes[0, 1]
ax.set_facecolor('#111827')
speeds = np.linspace(0.5, 5, 50)
sp_colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b']
for (name, sp), color in zip(species.items(), sp_colors):
    cot_quad = [sp.cost_of_transport(s, 'quadrupedal') for s in speeds]
    cot_brach = [sp.cost_of_transport(s, 'brachiation') for s in speeds]
    ax.plot(speeds, cot_quad, color=color, linewidth=2, label=f'{name} (quad)')
    ax.plot(speeds, cot_brach, color=color, linewidth=2, linestyle='--', alpha=0.5)
ax.set_xlabel('Speed (m/s)', color='white')
ax.set_ylabel('Cost of transport (J/kg/m)', color='white')
ax.set_title('Energy cost vs speed', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Maximum gap-crossing ability
ax = axes[1, 0]
ax.set_facecolor('#111827')
gap_methods = {
    'Leap': [sp.max_leap_distance() for sp in species.values()],
    'Brachiation reach': [sp.arm * 2 * np.pi * 0.5 for sp in species.values()],  # single swing
    'Branch bridge (body length)': [sp.leg * 4 for sp in species.values()],  # rough body length
}
gap_colors = ['#ef4444', '#3b82f6', '#22c55e']
for i, (method, dists) in enumerate(gap_methods.items()):
    ax.bar(x + i * 0.25, dists, 0.25, color=gap_colors[i], label=method, edgecolor='none')
ax.set_xticks(x + 0.25)
ax.set_xticklabels(species.keys(), color='white', fontsize=7, rotation=15)
ax.set_ylabel('Max gap distance (m)', color='white')
ax.set_title('Gap-crossing ability', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Froude number vs speed (gait transition)
ax = axes[1, 1]
ax.set_facecolor('#111827')
speeds_fr = np.linspace(0.1, 6, 100)
for (name, sp), color in zip(species.items(), sp_colors):
    fr = [sp.froude_number(s) for s in speeds_fr]
    ax.plot(speeds_fr, fr, color=color, linewidth=2, label=name)
ax.axhline(0.5, color='white', linestyle='--', linewidth=1, label='Walk-run transition (Fr=0.5)')
ax.axhline(2.5, color='gray', linestyle=':', linewidth=1, label='Gallop transition (Fr=2.5)')
ax.set_xlabel('Speed (m/s)', color='white')
ax.set_ylabel('Froude number', color='white')
ax.set_title('Froude number: gait transitions', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 5)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("NE Indian primate locomotion summary:")
for name, sp in species.items():
    print(f"  {name}: mass={sp.mass}kg, max leap={sp.max_leap_distance():.1f}m, "
          f"max brachiation speed={sp.max_brachiation_speed():.1f}m/s")`,
      challenge: 'Add the stump-tailed macaque (mass=10kg, arm=0.38m, leg=0.33m) and compare it to the Assamese macaque. Despite similar mass, do their locomotion capabilities differ?',
      successHint: 'Small differences in limb proportions create meaningful differences in locomotion. Even a few centimeters of arm length changes brachiation capability significantly because the pendulum period scales with the square root of length.',
    },
    {
      title: 'Brachiation as a pendulum — the physics of swinging through trees',
      concept: `Brachiation — swinging below branches using alternating arm grips — is the fastest arboreal locomotion mode. Gibbons can brachiate at speeds up to 15 m/s (55 km/h) with remarkable energy efficiency. The physics of brachiation is fundamentally that of a **pendulum**: the body swings below the hand grip point, converting potential energy to kinetic energy and back.

A simple pendulum has period T = 2*pi*sqrt(L/g), where L is the pendulum length (arm length for brachiation) and g is gravitational acceleration. For a gibbon with 0.75 m arms, T = 2*pi*sqrt(0.75/9.81) = 1.74 seconds for a full swing. The horizontal distance covered per half-swing is approximately 2*L*sin(theta_max), where theta_max is the maximum swing angle.

But real brachiation is more complex than a simple pendulum. The brachiator can **pump energy** into the swing by raising or lowering its center of mass at strategic points — similar to how a child pumps a playground swing. By tucking legs at the top of the swing (reducing moment of inertia) and extending at the bottom (increasing moment), the primate transfers energy from body configuration changes into swing amplitude. This is called **ricochetal brachiation**.

The key energy equation is: E_kinetic = 0.5 * m * v^2 at the bottom of the swing, E_potential = m * g * h at the top. If the brachiator releases at angle theta from vertical, it becomes a **projectile**, and the gap it can cross depends on release speed, release angle, and release height. The optimal release angle for maximum horizontal distance is about 45 degrees, but real brachiators release at 20-30 degrees because they need to catch the next branch at a similar height.`,
      analogy: 'Brachiation is like a series of trapeze artists in a circus, each catching and releasing at precisely timed moments. The pendulum physics determines the natural rhythm — try to swing faster than the natural period and you waste energy fighting gravity. Go slower and you lose momentum. The skilled brachiator matches the natural pendulum frequency of its arms, just as a skilled trapeze artist matches the natural frequency of the trapeze.',
      storyConnection: 'The monkeys in the story create a bridge by linking their bodies — effectively extending the pendulum length beyond any single animal\'s arm reach. In the forests of Nagaland and Meghalaya, hoolock gibbons depend on continuous canopy for brachiation. A single gap of 5 meters that is trivial for a leaping macaque can be an insurmountable barrier for a gibbon whose locomotion requires overhead support at every swing point.',
      checkQuestion: 'A gibbon brachiating at the natural pendulum frequency covers 2 meters per swing with 0.75 m arms. If arm length were doubled to 1.5 m, how much distance would each swing cover?',
      checkAnswer: 'Distance per swing scales approximately linearly with arm length: 2 * L * sin(theta). If theta is the same, doubling arm length doubles the distance to about 4 meters per swing. But the period also changes: T = 2*pi*sqrt(L/g), so doubling L increases the period by a factor of sqrt(2) = 1.41. The swing takes 41% longer, so speed increases by a factor of 2/1.41 = 1.41. Longer arms mean longer, slower swings that cover more distance — which is why gibbons (the fastest brachiators) have proportionally the longest arms of any primate.',
      codeIntro: 'Simulate brachiation as a series of pendulum swings, including energy pumping and projectile phases for gap crossing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Brachiation Pendulum Model ---

class BrachiationModel:
    """Model brachiation as pendulum + projectile dynamics."""

    def __init__(self, arm_length=0.75, body_mass=7.0):
        self.L = arm_length
        self.m = body_mass
        self.g = 9.81

    def pendulum_period(self):
        """Natural period of the arm-as-pendulum."""
        return 2 * np.pi * np.sqrt(self.L / self.g)

    def swing_trajectory(self, theta_max=60, n_points=100, pump_factor=1.0):
        """Compute position during a single pendulum swing."""
        theta_max_rad = np.radians(theta_max)
        t = np.linspace(0, self.pendulum_period() / 2, n_points)
        omega = np.sqrt(self.g / self.L)

        # Small angle: theta(t) = theta_max * cos(omega * t)
        # Start from -theta_max, swing to +theta_max
        theta = -theta_max_rad * np.cos(omega * t * pump_factor)

        x = self.L * np.sin(theta)
        y = -self.L * np.cos(theta)

        # Velocity at each point
        v = self.L * omega * theta_max_rad * np.abs(np.sin(omega * t))

        return x, y, v, theta

    def horizontal_distance_per_swing(self, theta_max=60):
        """Horizontal distance covered in one half-swing."""
        return 2 * self.L * np.sin(np.radians(theta_max))

    def release_projectile(self, v_release, theta_release, h_release, h_target=0):
        """Compute projectile trajectory after release."""
        theta_rad = np.radians(theta_release)
        vx = v_release * np.cos(theta_rad)
        vy = v_release * np.sin(theta_rad)

        # Time of flight to h_target
        # h_target = h_release + vy*t - 0.5*g*t^2
        a = -0.5 * self.g
        b = vy
        c = h_release - h_target
        disc = b**2 - 4*a*c
        if disc < 0:
            return None, None, 0
        t_land = (-b - np.sqrt(disc)) / (2*a)
        if t_land < 0:
            t_land = (-b + np.sqrt(disc)) / (2*a)

        t = np.linspace(0, max(t_land, 0.01), 100)
        x = vx * t
        y = h_release + vy * t - 0.5 * self.g * t**2

        horizontal_distance = vx * t_land
        return x, y, horizontal_distance

    def max_gap_crossing(self, theta_max=60):
        """Maximum gap the brachiator can cross."""
        omega = np.sqrt(self.g / self.L)
        theta_rad = np.radians(theta_max)
        v_bottom = self.L * omega * theta_rad  # speed at bottom of swing

        # Release at various angles to find optimum
        best_dist = 0
        best_angle = 0
        for release_angle in range(10, 80, 5):
            _, _, dist = self.release_projectile(v_bottom, release_angle, self.L * 0.5)
            if dist > best_dist:
                best_dist = dist
                best_angle = release_angle
        return best_dist, best_angle

# --- Compare species ---
gibbon = BrachiationModel(arm_length=0.75, body_mass=7)
macaque = BrachiationModel(arm_length=0.40, body_mass=10)
langur = BrachiationModel(arm_length=0.45, body_mass=12)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Swing trajectories
ax = axes[0, 0]
ax.set_facecolor('#111827')
for model_obj, color, name in [(gibbon, '#3b82f6', 'Gibbon'), (macaque, '#ef4444', 'Macaque'), (langur, '#22c55e', 'Langur')]:
    x, y, v, theta = model_obj.swing_trajectory(theta_max=50)
    # Center at branch point (0, 0)
    ax.plot(x, y, color=color, linewidth=2, label=name)
    ax.plot(0, 0, 'o', color=color, markersize=8)  # grip point
ax.set_xlabel('Horizontal position (m)', color='white')
ax.set_ylabel('Vertical position (m)', color='white')
ax.set_title('Swing trajectory (single pendulum arc)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# Plot 2: Velocity during swing
ax = axes[0, 1]
ax.set_facecolor('#111827')
for model_obj, color, name in [(gibbon, '#3b82f6', 'Gibbon'), (macaque, '#ef4444', 'Macaque'), (langur, '#22c55e', 'Langur')]:
    x, y, v, theta = model_obj.swing_trajectory(theta_max=50)
    t = np.linspace(0, model_obj.pendulum_period() / 2, len(v))
    ax.plot(t, v, color=color, linewidth=2, label=f'{name} (T={model_obj.pendulum_period():.2f}s)')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Speed (m/s)', color='white')
ax.set_title('Speed during swing (peak at bottom)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Gap-crossing projectile trajectories
ax = axes[1, 0]
ax.set_facecolor('#111827')
for model_obj, color, name in [(gibbon, '#3b82f6', 'Gibbon'), (macaque, '#ef4444', 'Macaque')]:
    omega = np.sqrt(model_obj.g / model_obj.L)
    v_release = model_obj.L * omega * np.radians(50)
    for angle in [20, 35, 45]:
        x_proj, y_proj, dist = model_obj.release_projectile(v_release, angle, model_obj.L * 0.5)
        if x_proj is not None:
            ls = '-' if angle == 35 else '--'
            ax.plot(x_proj, y_proj, color=color, linewidth=1.5, linestyle=ls,
                    alpha=0.7 if angle != 35 else 1.0,
                    label=f'{name} {angle}deg ({dist:.1f}m)' if angle == 35 else None)

ax.axhline(0, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Projectile trajectories after release', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Max gap vs arm length
ax = axes[1, 1]
ax.set_facecolor('#111827')
arm_lengths = np.linspace(0.2, 1.2, 50)
max_gaps = []
for al in arm_lengths:
    m = BrachiationModel(arm_length=al)
    gap, _ = m.max_gap_crossing(theta_max=50)
    max_gaps.append(gap)
ax.plot(arm_lengths, max_gaps, color='#a855f7', linewidth=2)
# Mark species
for model_obj, color, name in [(gibbon, '#3b82f6', 'Gibbon'), (macaque, '#ef4444', 'Macaque'), (langur, '#22c55e', 'Langur')]:
    gap, _ = model_obj.max_gap_crossing(50)
    ax.plot(model_obj.L, gap, 'o', color=color, markersize=10, zorder=5)
    ax.annotate(name, (model_obj.L, gap), textcoords='offset points',
                xytext=(10, 5), color='white', fontsize=9)
ax.set_xlabel('Arm length (m)', color='white')
ax.set_ylabel('Max gap crossing (m)', color='white')
ax.set_title('Gap-crossing scales with arm length', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Brachiation parameters:")
for model_obj, name in [(gibbon, 'Gibbon'), (macaque, 'Macaque'), (langur, 'Langur')]:
    gap, angle = model_obj.max_gap_crossing(50)
    print(f"  {name}: period={model_obj.pendulum_period():.2f}s, "
          f"swing distance={model_obj.horizontal_distance_per_swing(50):.2f}m, "
          f"max gap={gap:.2f}m at {angle}deg")`,
      challenge: 'Model ricochetal brachiation by adding energy pumping: increase the effective arm length by 10% at the bottom of each swing and decrease by 10% at the top. How much faster does the gibbon travel?',
      successHint: 'Energy pumping increases speed by 15-20%, matching observations that real gibbons are faster than simple pendulum models predict. This is the biomechanical secret of gibbon speed — they are not just pendulums, they are actively driven pendulums.',
    },
    {
      title: 'Social learning in primates — how monkeys teach each other new skills',
      concept: `Primates are exceptional social learners. They acquire behaviors not just through individual trial-and-error but by observing and imitating group members. This **social learning** is a form of cultural transmission — behaviors spread through populations much like genes, but through observation rather than reproduction.

The main mechanisms of social learning in primates are: **stimulus enhancement** (attention is drawn to an object another animal is interacting with), **emulation** (learning the goal of an action by watching the outcome), **imitation** (copying the specific motor pattern used by a demonstrator), and **teaching** (an experienced individual actively modifies its behavior to facilitate learning by a naive individual, at a cost to itself). True teaching is rare in non-human primates but has been documented in tool use contexts.

Social learning creates **behavioral traditions** — group-specific behaviors that persist across generations. Japanese macaques on Koshima Island have a potato-washing tradition that has been transmitted for over 60 years. Different chimpanzee populations have distinct tool-use cultures. For primates in NE India, behavioral traditions may include group-specific travel routes, food processing techniques, and alarm call dialects.

The mathematical model of social learning is the **diffusion of innovation**: a new behavior spreads through a group following a logistic curve. The rate of spread depends on: the number of demonstrators (more demonstrators = faster spread), observation opportunities (closer social networks = faster), and the difficulty of the behavior (harder skills spread slower). The **network-based diffusion analysis** (NBDA) uses the social network structure of a group to predict which individuals will learn next and how fast the innovation spreads.`,
      analogy: 'Social learning in a monkey troop works like a viral video in a social network. One individual discovers something useful (the viral content). Their close social contacts see it first (friends see the video). Those contacts spread it to their contacts (sharing). The speed of spread depends on the network structure — a well-connected individual spreads the behavior faster than a peripheral one. And just as some videos are too complicated to replicate (people watch but cannot reproduce the trick), some behaviors are too difficult for social learning to transmit.',
      storyConnection: 'The monkey bridge in the story is a cooperative behavior that requires coordination, trust, and learned technique. In real primate groups, such complex cooperative behaviors must be socially transmitted — each generation learns from the previous one. If the chain of transmission breaks (due to population decline, group fragmentation, or loss of key knowledgeable individuals), the behavior can be lost forever. This is cultural extinction, and it is as irreversible as genetic extinction.',
      checkQuestion: 'A researcher introduces a puzzle box with food inside to a macaque group. The alpha male solves it first. Would you expect the innovation to spread faster or slower than if a low-ranking juvenile solved it first? Why?',
      checkAnswer: 'The innovation would spread FASTER if the alpha male solves it, because: (1) more individuals watch the alpha (he is the most observed individual in the group due to dominance hierarchy monitoring), (2) other males are motivated to acquire the same skills as the alpha (social prestige), and (3) the alpha\'s social network connections span the entire group. If a low-ranking juvenile solves it, fewer individuals observe the solution, and some may even be inhibited from approaching the puzzle while the juvenile is using it. The identity of the innovator matters as much as the innovation itself.',
      codeIntro: 'Model the diffusion of a new behavior through a primate social network using network-based diffusion.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Social Learning Diffusion Model ---

class PrimateGroup:
    """Model a primate social group with network structure."""

    def __init__(self, n_individuals=25):
        self.n = n_individuals
        # Assign ranks (0 = alpha, n-1 = lowest)
        self.ranks = np.arange(n_individuals)
        # Generate social network (adjacency matrix)
        self.network = self._generate_network()
        # Observation probability: more likely to watch higher-ranked
        self.obs_prob = self._compute_observation_probs()

    def _generate_network(self):
        """Generate a realistic primate social network."""
        net = np.zeros((self.n, self.n))
        for i in range(self.n):
            for j in range(i + 1, self.n):
                # Closer ranks = stronger connection
                rank_dist = abs(self.ranks[i] - self.ranks[j])
                # Kin bonds (nearby indices more likely related)
                kin_dist = abs(i - j)
                prob = 0.8 * np.exp(-rank_dist / 5) * np.exp(-kin_dist / 8)
                if np.random.rand() < prob:
                    strength = np.random.uniform(0.3, 1.0)
                    net[i, j] = strength
                    net[j, i] = strength
        return net

    def _compute_observation_probs(self):
        """Probability of individual i observing individual j."""
        obs = np.zeros((self.n, self.n))
        for i in range(self.n):
            for j in range(self.n):
                if i == j:
                    continue
                # More likely to watch: (1) higher rank, (2) closer network ties
                rank_bonus = max(0, self.ranks[i] - self.ranks[j]) / self.n
                network_bonus = self.network[i, j]
                obs[i, j] = 0.1 + 0.5 * rank_bonus + 0.4 * network_bonus
        # Normalize rows
        for i in range(self.n):
            row_sum = obs[i].sum()
            if row_sum > 0:
                obs[i] /= row_sum
        return obs

    def simulate_diffusion(self, initial_learner=0, learning_difficulty=0.3, n_steps=50):
        """Simulate behavior spreading through the group."""
        learned = np.zeros(self.n, dtype=bool)
        learned[initial_learner] = True
        history = [learned.copy()]

        for step in range(n_steps):
            new_learned = learned.copy()
            for i in range(self.n):
                if learned[i]:
                    continue
                # Probability of learning: sum of observation probs * learned status
                demonstrators = np.where(learned)[0]
                if len(demonstrators) == 0:
                    continue
                obs_of_demo = sum(self.obs_prob[i, d] for d in demonstrators)
                learn_prob = obs_of_demo * (1 - learning_difficulty) * 0.3
                if np.random.rand() < learn_prob:
                    new_learned[i] = True
            learned = new_learned
            history.append(learned.copy())

        return np.array(history)

# --- Run simulations ---
group = PrimateGroup(n_individuals=25)

# Scenario 1: Alpha male discovers behavior
diffusion_alpha = group.simulate_diffusion(initial_learner=0, learning_difficulty=0.3, n_steps=50)

# Scenario 2: Low-ranking juvenile discovers
diffusion_juvenile = group.simulate_diffusion(initial_learner=22, learning_difficulty=0.3, n_steps=50)

# Scenario 3: Easy behavior (alpha)
diffusion_easy = group.simulate_diffusion(initial_learner=0, learning_difficulty=0.1, n_steps=50)

# Scenario 4: Hard behavior (alpha)
diffusion_hard = group.simulate_diffusion(initial_learner=0, learning_difficulty=0.7, n_steps=50)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Diffusion curves
ax = axes[0, 0]
ax.set_facecolor('#111827')
cumulative_alpha = diffusion_alpha.sum(axis=1) / group.n * 100
cumulative_juv = diffusion_juvenile.sum(axis=1) / group.n * 100
cumulative_easy = diffusion_easy.sum(axis=1) / group.n * 100
cumulative_hard = diffusion_hard.sum(axis=1) / group.n * 100

ax.plot(range(len(cumulative_alpha)), cumulative_alpha, color='#3b82f6', linewidth=2, label='Alpha discovers (moderate)')
ax.plot(range(len(cumulative_juv)), cumulative_juv, color='#ef4444', linewidth=2, label='Juvenile discovers (moderate)')
ax.plot(range(len(cumulative_easy)), cumulative_easy, color='#22c55e', linewidth=2, label='Alpha discovers (easy)')
ax.plot(range(len(cumulative_hard)), cumulative_hard, color='#f59e0b', linewidth=2, label='Alpha discovers (hard)')
ax.set_xlabel('Time steps', color='white')
ax.set_ylabel('% of group that learned', color='white')
ax.set_title('Innovation diffusion curves', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Social network visualization
ax = axes[0, 1]
ax.set_facecolor('#111827')
# Simple circular layout
angles = np.linspace(0, 2 * np.pi, group.n, endpoint=False)
x_pos = np.cos(angles) * 3
y_pos = np.sin(angles) * 3
# Draw edges
for i in range(group.n):
    for j in range(i + 1, group.n):
        if group.network[i, j] > 0.3:
            ax.plot([x_pos[i], x_pos[j]], [y_pos[i], y_pos[j]],
                    color='gray', alpha=group.network[i, j] * 0.5, linewidth=0.5)
# Draw nodes colored by learning order (alpha scenario)
learn_order = np.zeros(group.n)
for step, state in enumerate(diffusion_alpha):
    for i in range(group.n):
        if state[i] and learn_order[i] == 0 and (step > 0 or i == 0):
            learn_order[i] = step
learn_order[learn_order == 0] = len(diffusion_alpha)
scatter = ax.scatter(x_pos, y_pos, c=learn_order, cmap='RdYlGn_r', s=100,
                     edgecolor='white', linewidth=1, zorder=5, vmin=0, vmax=50)
plt.colorbar(scatter, ax=ax, label='Time step learned')
for i in range(group.n):
    ax.text(x_pos[i], y_pos[i] + 0.4, f'{i}', color='white', fontsize=6, ha='center')
ax.set_title('Social network (color = learning order)', color='white', fontsize=11)
ax.set_xlim(-4.5, 4.5)
ax.set_ylim(-4.5, 4.5)
ax.set_xticks([])
ax.set_yticks([])

# Plot 3: Learning order by rank
ax = axes[1, 0]
ax.set_facecolor('#111827')
# For alpha scenario: when did each rank learn?
rank_learn_alpha = []
rank_learn_juv = []
for rank in range(group.n):
    for step, state in enumerate(diffusion_alpha):
        if state[rank]:
            rank_learn_alpha.append(step)
            break
    else:
        rank_learn_alpha.append(50)

    for step, state in enumerate(diffusion_juvenile):
        if state[rank]:
            rank_learn_juv.append(step)
            break
    else:
        rank_learn_juv.append(50)

ax.scatter(range(group.n), rank_learn_alpha, color='#3b82f6', s=50, label='Alpha discovers', zorder=5)
ax.scatter(range(group.n), rank_learn_juv, color='#ef4444', s=50, label='Juvenile discovers', zorder=5)
ax.set_xlabel('Individual rank (0=alpha)', color='white')
ax.set_ylabel('Time step when learned', color='white')
ax.set_title('Learning order by social rank', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Network degree vs learning speed
ax = axes[1, 1]
ax.set_facecolor('#111827')
degrees = group.network.sum(axis=1)
ax.scatter(degrees, rank_learn_alpha, color='#a855f7', s=60, edgecolor='white', linewidth=0.5)
# Fit trend
z = np.polyfit(degrees, rank_learn_alpha, 1)
p = np.poly1d(z)
x_fit = np.linspace(min(degrees), max(degrees), 50)
ax.plot(x_fit, p(x_fit), color='#f59e0b', linewidth=2, linestyle='--', label=f'Trend (slope={z[0]:.1f})')
ax.set_xlabel('Network degree (number of connections)', color='white')
ax.set_ylabel('Time step when learned', color='white')
ax.set_title('Well-connected learn faster', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Diffusion summary (50 time steps):")
print(f"  Alpha discovers (moderate): {cumulative_alpha[-1]:.0f}% learned")
print(f"  Juvenile discovers (moderate): {cumulative_juv[-1]:.0f}% learned")
print(f"  Alpha discovers (easy): {cumulative_easy[-1]:.0f}% learned")
print(f"  Alpha discovers (hard): {cumulative_hard[-1]:.0f}% learned")
print()
corr = np.corrcoef(degrees, rank_learn_alpha)[0, 1]
print(f"  Correlation (network degree vs learning speed): {corr:.3f}")
print("  Well-connected individuals learn innovations faster.")`,
      challenge: 'Remove the alpha male at time step 10 (set learned[0] = False and remove all network edges). Does the innovation continue spreading or stall? This models what happens when a knowledgeable leader is lost.',
      successHint: 'If the alpha was the only demonstrator for several individuals, removing him creates a gap in the diffusion chain. But if enough secondary demonstrators exist, the innovation survives. Redundancy in social networks protects cultural knowledge.',
    },
    {
      title: 'Canopy connectivity — why tree spacing determines primate survival',
      concept: `For arboreal primates, the forest canopy is not a continuous surface — it is a network of connected and disconnected patches. **Canopy connectivity** measures how easily an animal can travel through the canopy without descending to the ground. High connectivity means overlapping tree crowns and continuous pathways. Low connectivity means isolated tree crowns separated by gaps.

Connectivity depends on three factors: **tree density** (trees per hectare), **crown diameter** (how wide each tree's canopy spreads), and **crown overlap** (whether adjacent crowns touch). If the average crown diameter is 10 m and the average tree spacing is 8 m, crowns overlap and the canopy is connected. If spacing is 12 m, there is a 2 m gap that some species can cross but others cannot.

The key metric is the **gap size distribution**: how many gaps of each size exist along a transect. If 95% of gaps are less than 2 m (crossable by all primates) but 5% are 5-10 m (crossable only by leaping species), then the forest is functionally connected for macaques but fragmented for gibbons.

From graph theory, we can model the canopy as a **network** where each tree is a node and edges connect trees whose crowns overlap or are close enough for the target species to cross. The **largest connected component** of this network determines how much of the forest the animal can access without descending to the ground. If logging or road construction removes a few critical trees (high-betweenness nodes), the network can fragment into isolated components, trapping primates in small habitat patches.

**Percolation theory** predicts a sharp transition: as trees are removed, connectivity drops gradually until a critical threshold (~60% tree density for random removal), at which point the network suddenly collapses into many small fragments. This phase transition means that moderate logging may have minimal impact, but one additional tree removed near the threshold can catastrophically fragment the habitat.`,
      analogy: 'Canopy connectivity is like a road network for cars that cannot go off-road. As long as the roads connect, you can reach any destination. Removing a few minor roads (small trees) is annoying but navigable. But removing a highway (a large tree that connects two forest patches) can isolate entire neighborhoods. And just as a city reaches a crisis point where removing one more road causes gridlock, a forest reaches a percolation threshold where removing one more tree causes ecological collapse.',
      storyConnection: 'The monkey bridge in the story exists because there IS a gap — a break in canopy connectivity that prevents normal travel. In the forests of Northeast India, roads, powerlines, and logging create exactly these gaps. The Hollongapar Gibbon Sanctuary in Assam is bisected by a railway line, creating a gap that gibbons cannot cross. Artificial canopy bridges (rope bridges strung between trees across the gap) have been installed to restore connectivity — the engineering version of the story\'s monkey bridge.',
      checkQuestion: 'A forest has 200 trees per hectare with 8 m average crown diameter. A road is built through the forest, creating a 15 m gap. Which primate species can still cross?',
      checkAnswer: 'With 8 m crown diameter and 200 trees/ha, the natural gap between most tree crowns is small (< 3m). The 15 m road gap is uncrossable by: gibbons (max brachiation gap ~5 m), slow lorises (no leaping ability), and langurs (moderate leapers, max ~6 m). Macaques might cross by descending to the road surface but face predation and traffic risk. Effectively, the road fragments the habitat for ALL arboreal primates. Solutions: a canopy bridge (rope or planted trees) or an underpass/overpass designed for wildlife.',
      codeIntro: 'Model canopy connectivity as a graph network and analyze how tree removal affects habitat accessibility for different primate species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Canopy Connectivity Network Model ---

class CanopyNetwork:
    """Model forest canopy as a connectivity graph."""

    def __init__(self, n_trees=100, area_ha=1.0, mean_crown_diameter=8.0):
        self.n = n_trees
        self.area = area_ha * 10000  # convert to m2
        self.side = np.sqrt(self.area)
        self.crown_d = mean_crown_diameter

        # Random tree positions
        self.x = np.random.uniform(0, self.side, n_trees)
        self.y = np.random.uniform(0, self.side, n_trees)
        # Individual crown diameters (variation around mean)
        self.crowns = np.random.normal(mean_crown_diameter, 1.5, n_trees)
        self.crowns = np.clip(self.crowns, 3, 15)
        self.alive = np.ones(n_trees, dtype=bool)

    def gap_between(self, i, j):
        """Gap distance between tree crowns (0 if overlapping)."""
        dist = np.sqrt((self.x[i] - self.x[j])**2 + (self.y[i] - self.y[j])**2)
        gap = dist - (self.crowns[i] + self.crowns[j]) / 2
        return max(gap, 0)

    def build_adjacency(self, max_gap):
        """Build adjacency matrix for species with given gap-crossing ability."""
        adj = np.zeros((self.n, self.n), dtype=bool)
        for i in range(self.n):
            if not self.alive[i]:
                continue
            for j in range(i + 1, self.n):
                if not self.alive[j]:
                    continue
                if self.gap_between(i, j) <= max_gap:
                    adj[i, j] = True
                    adj[j, i] = True
        return adj

    def connected_components(self, adj):
        """Find connected components using BFS."""
        visited = np.zeros(self.n, dtype=bool)
        components = []

        for start in range(self.n):
            if visited[start] or not self.alive[start]:
                continue
            # BFS
            component = []
            queue = [start]
            visited[start] = True
            while queue:
                node = queue.pop(0)
                component.append(node)
                for neighbor in range(self.n):
                    if adj[node, neighbor] and not visited[neighbor]:
                        visited[neighbor] = True
                        queue.append(neighbor)
            components.append(component)

        return components

    def largest_component_fraction(self, max_gap):
        """Fraction of trees in the largest connected component."""
        adj = self.build_adjacency(max_gap)
        components = self.connected_components(adj)
        if not components:
            return 0
        return max(len(c) for c in components) / sum(self.alive)

    def remove_trees(self, n_remove, method='random'):
        """Remove trees (simulate logging)."""
        alive_idx = np.where(self.alive)[0]
        if method == 'random':
            to_remove = np.random.choice(alive_idx, min(n_remove, len(alive_idx)), replace=False)
        elif method == 'largest':
            # Remove largest trees first
            sizes = [(i, self.crowns[i]) for i in alive_idx]
            sizes.sort(key=lambda x: -x[1])
            to_remove = [s[0] for s in sizes[:n_remove]]
        self.alive[to_remove] = False

# --- Analyze connectivity ---

# Species gap-crossing abilities
species_gaps = {
    'Hoolock gibbon': 2.0,    # needs near-continuous canopy
    'Capped langur': 4.0,     # moderate leaper
    'Assamese macaque': 5.0,  # good leaper
    'Slow loris': 1.0,        # must have overlapping crowns
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Forest map with connectivity
ax = axes[0, 0]
ax.set_facecolor('#111827')
forest = CanopyNetwork(n_trees=80, area_ha=1.0, mean_crown_diameter=8)
adj = forest.build_adjacency(max_gap=3.0)
# Draw crown circles
for i in range(forest.n):
    circle = plt.Circle((forest.x[i], forest.y[i]), forest.crowns[i] / 2,
                         color='#22c55e', alpha=0.2, edgecolor='#22c55e', linewidth=0.5)
    ax.add_patch(circle)
# Draw edges
for i in range(forest.n):
    for j in range(i + 1, forest.n):
        if adj[i, j]:
            ax.plot([forest.x[i], forest.x[j]], [forest.y[i], forest.y[j]],
                    color='#3b82f6', alpha=0.2, linewidth=0.5)
ax.scatter(forest.x, forest.y, c='#22c55e', s=10, zorder=5)
ax.set_xlim(0, forest.side)
ax.set_ylim(0, forest.side)
ax.set_xlabel('X (m)', color='white')
ax.set_ylabel('Y (m)', color='white')
ax.set_title('Forest canopy network (gap < 3m)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# Plot 2: Connectivity by species
ax = axes[0, 1]
ax.set_facecolor('#111827')
sp_colors = ['#ef4444', '#f59e0b', '#3b82f6', '#a855f7']
for (sp, gap), color in zip(species_gaps.items(), sp_colors):
    frac = forest.largest_component_fraction(gap)
    ax.bar(sp.split()[0], frac * 100, color=color, edgecolor='none')
    ax.text(sp.split()[0], frac * 100 + 1, f'{frac*100:.0f}%',
            ha='center', color='white', fontsize=9)
ax.set_ylabel('% forest accessible (largest component)', color='white')
ax.set_title('Habitat accessibility by species', color='white', fontsize=11)
ax.set_ylim(0, 110)
labels = ax.get_xticklabels()
for l in labels:
    l.set_color('white')
    l.set_fontsize(8)
ax.tick_params(colors='gray')

# Plot 3: Percolation curve — connectivity vs tree removal
ax = axes[1, 0]
ax.set_facecolor('#111827')
removal_fracs = np.linspace(0, 0.7, 30)
for (sp, gap), color in zip(list(species_gaps.items())[:3], sp_colors):
    connectivity = []
    for frac in removal_fracs:
        test_forest = CanopyNetwork(n_trees=80, area_ha=1.0, mean_crown_diameter=8)
        n_remove = int(frac * 80)
        test_forest.remove_trees(n_remove, method='random')
        conn = test_forest.largest_component_fraction(gap)
        connectivity.append(conn * 100)
    ax.plot(removal_fracs * 100, connectivity, color=color, linewidth=2, label=sp)
ax.axhline(50, color='gray', linestyle='--', linewidth=1, label='50% threshold')
ax.set_xlabel('Trees removed (%)', color='white')
ax.set_ylabel('Connectivity (%)', color='white')
ax.set_title('Percolation: connectivity vs logging', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Gap size distribution
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Compute all gaps
gaps = []
for i in range(forest.n):
    min_gap = 999
    for j in range(forest.n):
        if i != j:
            g = forest.gap_between(i, j)
            if g < min_gap:
                min_gap = g
    gaps.append(min_gap)
gaps = np.array(gaps)
ax.hist(gaps, bins=20, color='#3b82f6', edgecolor='none', alpha=0.7)
for (sp, gap_max), color in zip(species_gaps.items(), sp_colors):
    ax.axvline(gap_max, color=color, linestyle='--', linewidth=2, label=f'{sp.split()[0]} max gap')
ax.set_xlabel('Gap to nearest tree (m)', color='white')
ax.set_ylabel('Number of trees', color='white')
ax.set_title('Gap size distribution', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Canopy connectivity analysis (80 trees, 1 ha):")
for sp, gap in species_gaps.items():
    frac = forest.largest_component_fraction(gap)
    print(f"  {sp}: gap tolerance={gap}m, connectivity={frac*100:.0f}%")`,
      challenge: 'Add a road (remove all trees in a 15m-wide strip through the middle). Calculate the connectivity reduction and test whether a single canopy bridge (one tree placed in the gap) restores connectivity.',
      successHint: 'A single strategically placed tree (or artificial bridge) in a critical gap can restore connectivity for the entire forest. This is the power of graph theory — identifying the single most important intervention point.',
    },
    {
      title: 'Arboreal ecology — the vertical forest and niche partitioning',
      concept: `A tropical forest is not a single habitat but a stack of distinct habitats separated by height: the **forest floor** (0-2 m), **understory** (2-10 m), **subcanopy** (10-20 m), **canopy** (20-35 m), and **emergent layer** (35+ m). Each layer has distinct light levels, temperature, humidity, food resources, and predation pressures. Arboreal primates partition these layers, with different species specializing in different heights.

This **vertical stratification** reduces competition between sympatric (co-occurring) primate species. In the forests of NE India, hoolock gibbons occupy the upper canopy (20-30 m), capped langurs use the subcanopy and canopy (15-25 m), Assamese macaques range from ground to subcanopy (0-20 m), and slow lorises occupy understory and subcanopy (5-15 m) at night. Each species is morphologically adapted to its preferred height: gibbons have long arms for brachiation among large canopy branches; macaques have versatile limbs for both terrestrial and arboreal travel.

The **niche overlap** between two species can be quantified using the Pianka overlap index: O = sum(p_i * q_i) / sqrt(sum(p_i^2) * sum(q_i^2)), where p_i and q_i are the proportions of time each species spends in height layer i. O ranges from 0 (no overlap, completely different layers) to 1 (identical layer use). High overlap increases competition; species with high overlap must differ in diet, activity time, or some other niche dimension to coexist.

**Logging** disrupts vertical stratification by removing emergent and upper canopy trees. This compresses the available habitat into lower layers, increasing niche overlap and competitive pressure. Species that specialized in the upper canopy (gibbons) lose their habitat entirely, while generalists (macaques) may benefit from reduced competition as specialists decline.`,
      analogy: 'The vertical forest is like a multi-story apartment building where different families live on different floors. The penthouse residents (gibbons) have the best views and sunshine but must climb far to reach food at ground level. The ground-floor residents (macaques) have easy access to the garden but less light. Each family chose their floor based on their needs and abilities. Logging is like demolishing the top floors — penthouse residents lose everything, while ground-floor residents are inconvenienced but survive.',
      storyConnection: 'The monkeys who build the bridge in the story occupy the mid-canopy — they need connected branches at 15-20 m height to travel efficiently. A gap at their preferred height is a real barrier, even if lower branches exist. This is because descending to the understory means entering a different ecological zone with different predators (snakes, large carnivores) and different competitors. The bridge solves the gap problem at the right height, within the monkeys\' own ecological layer.',
      checkQuestion: 'If selective logging removes only trees above 25 m (the largest, most valuable timber), which primate species is most affected and why?',
      checkAnswer: 'The hoolock gibbon is most affected because it specializes in the upper canopy (20-30 m). Removing trees above 25 m eliminates the emergent layer and reduces the canopy layer, destroying the gibbon\'s primary habitat and travel corridors. The gibbon cannot simply shift to lower layers because: (1) its brachiation locomotion requires large, horizontal branches found only in the upper canopy, (2) lower layers are already occupied by langurs and macaques, and (3) the reduced crown area at lower heights provides less food. Selective logging of large trees is effectively targeted habitat destruction for canopy specialists.',
      codeIntro: 'Model vertical niche partitioning among NE Indian primates and analyze how logging changes the competitive landscape.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Vertical Niche Partitioning Model ---

class ForestProfile:
    """Model the vertical structure of a tropical forest."""

    def __init__(self, max_height=40):
        self.max_h = max_height
        self.layers = {
            'Floor': (0, 2),
            'Understory': (2, 10),
            'Subcanopy': (10, 20),
            'Canopy': (20, 35),
            'Emergent': (35, max_height),
        }

    def layer_resources(self, logging_intensity=0):
        """Resource availability per layer (fruits, leaves, insects)."""
        resources = {
            'Floor': 0.3,
            'Understory': 0.5,
            'Subcanopy': 0.7,
            'Canopy': 1.0,
            'Emergent': 0.8,
        }
        if logging_intensity > 0:
            resources['Emergent'] *= max(0, 1 - logging_intensity * 2)
            resources['Canopy'] *= max(0.2, 1 - logging_intensity * 0.8)
            resources['Subcanopy'] *= max(0.5, 1 - logging_intensity * 0.3)
        return resources

# Primate height preferences (probability distribution over 0-40m)
class PrimateNiche:
    def __init__(self, name, preferred_height, height_std, mass):
        self.name = name
        self.pref_h = preferred_height
        self.h_std = height_std
        self.mass = mass

    def height_distribution(self, heights):
        """Probability density over height."""
        dist = np.exp(-0.5 * ((heights - self.pref_h) / self.h_std)**2)
        dist /= dist.sum()
        return dist

    def pianka_overlap(self, other, heights):
        """Pianka niche overlap index."""
        p = self.height_distribution(heights)
        q = other.height_distribution(heights)
        num = np.sum(p * q)
        denom = np.sqrt(np.sum(p**2) * np.sum(q**2))
        return num / max(denom, 1e-10)

# NE Indian primates
primates = [
    PrimateNiche('Hoolock gibbon', 25, 4, 7),
    PrimateNiche('Capped langur', 18, 5, 12),
    PrimateNiche('Assamese macaque', 10, 7, 10),
    PrimateNiche('Slow loris', 8, 3, 1.5),
]

heights = np.linspace(0, 40, 100)
forest = ForestProfile()

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Height distribution profiles
ax = axes[0, 0]
ax.set_facecolor('#111827')
primate_colors = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b']
for p, color in zip(primates, primate_colors):
    dist = p.height_distribution(heights)
    ax.fill_betweenx(heights, 0, dist, alpha=0.3, color=color)
    ax.plot(dist, heights, color=color, linewidth=2, label=p.name)
# Layer boundaries
for name, (lo, hi) in forest.layers.items():
    ax.axhline(hi, color='gray', linestyle=':', linewidth=0.5)
    ax.text(0.001, (lo + hi) / 2, name, color='gray', fontsize=7, va='center')
ax.set_xlabel('Relative time spent', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Vertical niche partitioning', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Niche overlap matrix
ax = axes[0, 1]
ax.set_facecolor('#111827')
n_sp = len(primates)
overlap_matrix = np.zeros((n_sp, n_sp))
for i in range(n_sp):
    for j in range(n_sp):
        overlap_matrix[i, j] = primates[i].pianka_overlap(primates[j], heights)
im = ax.imshow(overlap_matrix, cmap='YlOrRd', vmin=0, vmax=1)
plt.colorbar(im, ax=ax, label='Pianka overlap')
ax.set_xticks(range(n_sp))
ax.set_yticks(range(n_sp))
names = [p.name.split()[0] for p in primates]
ax.set_xticklabels(names, color='white', fontsize=8, rotation=45)
ax.set_yticklabels(names, color='white', fontsize=8)
ax.set_title('Niche overlap matrix', color='white', fontsize=11)
for i in range(n_sp):
    for j in range(n_sp):
        ax.text(j, i, f'{overlap_matrix[i,j]:.2f}', ha='center', va='center',
                color='white' if overlap_matrix[i,j] < 0.5 else 'black', fontsize=8)

# Plot 3: Effect of logging on niche distributions
ax = axes[0, 2]
ax.set_facecolor('#111827')
# Logging compresses gibbons downward
gibbon_normal = primates[0].height_distribution(heights)
gibbon_logged = PrimateNiche('Gibbon (logged)', 18, 5, 7).height_distribution(heights)
ax.fill_betweenx(heights, 0, gibbon_normal, alpha=0.3, color='#3b82f6', label='Gibbon (intact)')
ax.fill_betweenx(heights, 0, gibbon_logged, alpha=0.3, color='#ef4444', label='Gibbon (logged)')
langur_dist = primates[1].height_distribution(heights)
ax.fill_betweenx(heights, 0, langur_dist, alpha=0.3, color='#22c55e', label='Langur (unchanged)')
ax.set_xlabel('Relative time spent', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Logging compresses gibbon niche', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Resource availability before/after logging
ax = axes[1, 0]
ax.set_facecolor('#111827')
resources_intact = forest.layer_resources(0)
resources_logged = forest.layer_resources(0.7)
layer_names = list(resources_intact.keys())
x_lay = np.arange(len(layer_names))
width = 0.35
ax.bar(x_lay - width/2, list(resources_intact.values()), width, color='#22c55e',
       label='Intact forest', edgecolor='none')
ax.bar(x_lay + width/2, list(resources_logged.values()), width, color='#ef4444',
       label='Logged forest', edgecolor='none')
ax.set_xticks(x_lay)
ax.set_xticklabels(layer_names, color='white', fontsize=8)
ax.set_ylabel('Resource availability', color='white')
ax.set_title('Resources by forest layer', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Overlap increase from logging
ax = axes[1, 1]
ax.set_facecolor('#111827')
logging_intensities = np.linspace(0, 0.9, 20)
gibbon_langur_overlap = []
for li in logging_intensities:
    # Gibbon shifts down proportionally to logging
    shifted_pref = max(25 - li * 10, 12)
    shifted_std = max(4 - li * 1, 2)
    shifted_gibbon = PrimateNiche('Gibbon', shifted_pref, shifted_std, 7)
    overlap = shifted_gibbon.pianka_overlap(primates[1], heights)
    gibbon_langur_overlap.append(overlap)
ax.plot(logging_intensities * 100, gibbon_langur_overlap, color='#a855f7', linewidth=2)
ax.set_xlabel('Logging intensity (%)', color='white')
ax.set_ylabel('Gibbon-Langur niche overlap', color='white')
ax.set_title('Logging increases competitive overlap', color='white', fontsize=11)
ax.axhline(0.8, color='#ef4444', linestyle='--', label='High competition zone')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Species vulnerability ranking
ax = axes[1, 2]
ax.set_facecolor('#111827')
vulnerability = []
for p in primates:
    # Vulnerability = high preferred height + narrow niche
    v = p.pref_h / 40 * 0.5 + (1 / p.h_std) * 0.5
    vulnerability.append(v)
sorted_idx = np.argsort(vulnerability)[::-1]
sorted_names = [primates[i].name for i in sorted_idx]
sorted_vuln = [vulnerability[i] for i in sorted_idx]
sorted_colors = [primate_colors[i] for i in sorted_idx]
ax.barh(range(len(sorted_names)), sorted_vuln, color=sorted_colors, edgecolor='none')
ax.set_yticks(range(len(sorted_names)))
ax.set_yticklabels(sorted_names, color='white', fontsize=9)
ax.set_xlabel('Logging vulnerability score', color='white')
ax.set_title('Species vulnerability to logging', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Vertical niche analysis:")
for p in primates:
    print(f"  {p.name}: preferred height={p.pref_h}m, std={p.h_std}m")
print()
print("Key niche overlaps:")
for i in range(n_sp):
    for j in range(i+1, n_sp):
        print(f"  {primates[i].name} vs {primates[j].name}: {overlap_matrix[i,j]:.3f}")`,
      challenge: 'Add a temporal dimension: the slow loris is nocturnal while macaques are diurnal. Compute the effective niche overlap accounting for both height AND time partitioning. Does adding time reduce competition below the spatial overlap alone?',
      successHint: 'Temporal partitioning dramatically reduces effective competition. The slow loris and macaque may use similar heights but never at the same time, so their realized niche overlap is near zero. This is why tropical forests support so many primate species — they partition resources across multiple dimensions simultaneously.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Biomechanist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology & physics fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for biomechanics and ecology modeling. Click to start.</p>
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