import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FlyingSquirrelLevel3() {
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
      title: 'Patagium as airfoil — how a skin membrane generates lift',
      concept: `Flying squirrels do not actually fly — they glide. The patagium, a furry membrane of skin stretching from wrist to ankle, acts as an airfoil. When the squirrel leaps and spreads its limbs, the patagium catches air and generates **lift** — a net upward force perpendicular to the direction of travel.

Lift arises from the same physics that keeps airplanes aloft. The shape of the patagium deflects air downward. By Newton's third law, the air pushes the squirrel upward. The membrane is not perfectly flat — the squirrel adjusts its limbs to create a slight camber (curve), which increases the pressure difference between the top and bottom surfaces.

Key aerodynamic variables:
- **Lift (L)**: L = 0.5 * rho * v^2 * A * C_L, where rho is air density, v is velocity, A is wing area, and C_L is the lift coefficient
- **Drag (D)**: D = 0.5 * rho * v^2 * A * C_D — the force opposing motion through air
- **Glide angle (theta)**: tan(theta) = D / L — steeper angle means more drag relative to lift

A flying squirrel's patagium has a wing loading (weight / area) of about 25-50 N/m^2. Compare this to a hang glider at ~30 N/m^2 — remarkably similar.`,
      analogy: 'The patagium works like a bedsheet held between two friends running downhill. If you hold it flat and let the wind catch it from below, it billows up and creates an upward force. The squirrel does the same thing but with exquisite control — adjusting the "sheet" by moving its wrists and ankles.',
      storyConnection: 'The flying squirrel in our story launched from the tallest sal tree in the forest. Its patagium was not just a passive cape — it was a precision instrument, converting gravitational potential energy into horizontal distance through lift generation.',
      checkQuestion: 'If a flying squirrel doubled its patagium area (somehow), what would happen to the lift force at the same speed? And what trade-off would the larger membrane create?',
      checkAnswer: 'Lift would double (it is directly proportional to area). But the larger membrane would also double the drag. Additionally, a bigger membrane would increase mass, be harder to fold when climbing, and could snag on branches. Evolution optimizes for the whole system, not just one variable.',
      codeIntro: 'Model the lift and drag forces on a flying squirrel patagium at different speeds and angles of attack.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Physical constants and squirrel parameters
rho = 1.225  # air density at sea level (kg/m^3)
mass = 0.15  # flying squirrel mass (kg)
g = 9.81     # gravity (m/s^2)
weight = mass * g
A = 0.06     # patagium area (m^2) — about 600 cm^2

# Lift and drag coefficients vary with angle of attack (alpha)
# Using simplified thin-airfoil approximations
alpha_range = np.linspace(0, 45, 200)  # degrees
alpha_rad = np.radians(alpha_range)

# C_L increases roughly linearly until stall (~15-20 degrees), then drops
C_L = np.where(alpha_rad < np.radians(18),
               2 * np.pi * alpha_rad * 0.35,  # reduced efficiency vs ideal airfoil
               np.maximum(2 * np.pi * np.radians(18) * 0.35 - 0.08 * (alpha_range - 18), 0.2))

# C_D has a minimum at small alpha, increases with alpha^2 (induced drag)
C_D_parasitic = 0.05  # form drag from body + fur
C_D = C_D_parasitic + 0.015 * alpha_rad**2  # induced drag component

# Compute forces at typical glide speed
v = 8.0  # m/s — typical flying squirrel glide speed
q = 0.5 * rho * v**2  # dynamic pressure

lift = q * A * C_L
drag = q * A * C_D
L_over_D = C_L / C_D

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Lift and drag vs angle of attack
ax = axes[0, 0]
ax.plot(alpha_range, lift, color='#22c55e', linewidth=2, label='Lift')
ax.plot(alpha_range, drag, color='#ef4444', linewidth=2, label='Drag')
ax.axhline(weight, color='#f59e0b', linestyle='--', linewidth=1.5, label=f'Weight ({weight:.2f} N)')
ax.axvline(18, color='gray', linestyle=':', alpha=0.5, label='Stall angle')
ax.set_xlabel('Angle of attack (degrees)', color='white')
ax.set_ylabel('Force (N)', color='white')
ax.set_title('Lift & Drag vs Angle of Attack', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Lift-to-drag ratio
ax = axes[0, 1]
ax.plot(alpha_range, L_over_D, color='#a855f7', linewidth=2)
best_idx = np.argmax(L_over_D)
ax.plot(alpha_range[best_idx], L_over_D[best_idx], 'o', color='#f59e0b', markersize=10)
ax.annotate(f'Best L/D = {L_over_D[best_idx]:.1f} at {alpha_range[best_idx]:.1f}°',
            xy=(alpha_range[best_idx], L_over_D[best_idx]),
            xytext=(alpha_range[best_idx] + 8, L_over_D[best_idx] - 0.5),
            color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax.set_xlabel('Angle of attack (degrees)', color='white')
ax.set_ylabel('L/D ratio', color='white')
ax.set_title('Lift-to-Drag Ratio (Glide Efficiency)', color='white', fontsize=11)

# Plot 3: Glide path at different angles
ax = axes[1, 0]
launch_height = 20  # meters
for alpha_deg in [5, 10, 15, 25]:
    idx = np.argmin(np.abs(alpha_range - alpha_deg))
    glide_ratio = C_L[idx] / C_D[idx]
    horizontal_dist = launch_height * glide_ratio
    ax.plot([0, horizontal_dist], [launch_height, 0], linewidth=2,
            label=f'α={alpha_deg}°, range={horizontal_dist:.1f}m')
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Glide Paths from 20m Launch', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0)
ax.set_ylim(0)

# Plot 4: Wing loading comparison
ax = axes[1, 1]
animals = ['Flying\\nsquirrel', 'Sugar\\nglider', 'Colugo', 'Flying\\nfish', 'Hang\\nglider', 'Albatross']
wing_loading = [25, 20, 15, 80, 30, 140]  # N/m^2 approximate
colors = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#6b7280', '#ef4444']
bars = ax.bar(animals, wing_loading, color=colors, edgecolor='none', width=0.6)
ax.set_ylabel('Wing loading (N/m²)', color='white')
ax.set_title('Wing Loading Comparison', color='white', fontsize=11)
for bar, wl in zip(bars, wing_loading):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
            str(wl), ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print(f"Flying squirrel parameters:")
print(f"  Mass: {mass} kg, Patagium area: {A*1e4:.0f} cm², Wing loading: {weight/A:.1f} N/m²")
print(f"  At v={v} m/s, best L/D = {L_over_D[best_idx]:.1f} at alpha = {alpha_range[best_idx]:.1f}°")
print(f"  From 20m height, max horizontal range ≈ {20 * L_over_D[best_idx]:.1f}m")
print(f"  That is remarkably efficient for a mammal with no powered flight.")`,
      challenge: 'Add wind: if there is a 3 m/s headwind, the effective airspeed increases. Recompute the forces and glide distance. Then try a 3 m/s tailwind. Which extends the glide more — launching from higher or having a tailwind?',
      successHint: 'The physics of gliding is all about converting potential energy to horizontal distance as efficiently as possible. The patagium is evolution\'s answer to the same engineering problem that aircraft designers face.',
    },
    {
      title: 'Lift-to-drag ratio — the number that rules all gliders',
      concept: `The **lift-to-drag ratio (L/D)** is the single most important number for any gliding animal or aircraft. It tells you how many meters forward you travel for every meter of altitude lost.

A flying squirrel achieves L/D ratios of about 1.5 to 3.0. That means from 10 meters up, it can travel 15-30 meters horizontally. Compare:
- **Flying squirrel**: L/D ≈ 2-3
- **Sugar glider**: L/D ≈ 2-3
- **Colugo (flying lemur)**: L/D ≈ 3-4
- **Hang glider**: L/D ≈ 12-15
- **Sailplane**: L/D ≈ 30-50
- **Albatross**: L/D ≈ 20

L/D depends on the **Reynolds number** — a dimensionless quantity that captures the ratio of inertial to viscous forces: Re = (rho * v * L) / mu. Small animals at low speeds operate in a low-Reynolds regime where viscous drag is relatively more important, which is why their L/D ratios are lower than large aircraft.

The optimal glide speed (speed for maximum L/D) is also not the minimum sink speed. Minimum sink rate gets you the longest time aloft; maximum L/D gets you the farthest distance. Different goals, different speeds.`,
      analogy: 'L/D ratio is like fuel economy for a car. A car that gets 30 miles per gallon (high L/D) can go farther on the same tank than one that gets 10 mpg (low L/D). The "fuel" for a glider is altitude — every meter of height is a fixed energy budget, and L/D tells you how efficiently you convert it to distance.',
      storyConnection: 'The flying squirrel did not just leap randomly — it chose the tallest tree and launched at precisely the right moment. Instinctively, it was maximizing its L/D ratio: enough speed for good lift, not so steep that drag dominated.',
      checkQuestion: 'A flying squirrel has L/D = 2.5 and launches from 15 meters. A colugo has L/D = 3.5 and launches from 10 meters. Which travels farther horizontally?',
      checkAnswer: 'Flying squirrel: 15 * 2.5 = 37.5 m. Colugo: 10 * 3.5 = 35 m. The squirrel wins despite lower efficiency because it started higher. This shows that launch height and L/D ratio are both important — total range = height * L/D.',
      codeIntro: 'Explore how Reynolds number affects L/D and find optimal glide speeds for different-sized gliders.',
      code: `import numpy as np
import matplotlib.pyplot as plt

rho = 1.225  # air density kg/m^3
mu = 1.81e-5  # dynamic viscosity of air (Pa·s)

# Define different gliders: (name, mass_kg, area_m2, chord_m, color)
gliders = [
    ('Flying squirrel', 0.15, 0.06, 0.12, '#22c55e'),
    ('Sugar glider', 0.12, 0.055, 0.10, '#3b82f6'),
    ('Colugo', 1.5, 0.25, 0.25, '#a855f7'),
    ('Hang glider', 100, 14.0, 2.0, '#f59e0b'),
]

speeds = np.linspace(2, 25, 200)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Reynolds number vs speed for each glider
ax = axes[0, 0]
for name, mass, area, chord, color in gliders:
    Re = rho * speeds * chord / mu
    ax.semilogy(speeds, Re, color=color, linewidth=2, label=name)
ax.axhspan(1e3, 1e5, alpha=0.1, color='#ef4444', label='Low Re (viscous)')
ax.axhspan(1e5, 1e7, alpha=0.1, color='#22c55e', label='High Re (inertial)')
ax.set_xlabel('Airspeed (m/s)', color='white')
ax.set_ylabel('Reynolds number', color='white')
ax.set_title('Reynolds Number vs Speed', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: L/D vs speed for each glider
ax = axes[0, 1]
best_ld_data = []
for name, mass, area, chord, color in gliders:
    weight = mass * 9.81
    Re_vals = rho * speeds * chord / mu
    # C_L required for steady glide (lift = weight)
    q = 0.5 * rho * speeds**2
    C_L_required = weight / (q * area)
    # Parasitic drag coefficient decreases with Reynolds number
    C_D0 = 0.02 + 5.0 / np.sqrt(Re_vals + 1)
    # Induced drag: C_Di = C_L^2 / (pi * e * AR)
    AR = chord**2 / area  # simplified aspect ratio
    e = 0.7  # Oswald efficiency
    C_Di = C_L_required**2 / (np.pi * e * max(AR, 0.5))
    C_D_total = C_D0 + C_Di
    L_over_D = C_L_required / C_D_total
    # Only valid where C_L < ~1.5 (no stall)
    valid = C_L_required < 1.5
    ax.plot(speeds[valid], L_over_D[valid], color=color, linewidth=2, label=name)
    if np.any(valid):
        best_idx = np.argmax(L_over_D[valid])
        best_ld_data.append((name, speeds[valid][best_idx], L_over_D[valid][best_idx]))
        ax.plot(speeds[valid][best_idx], L_over_D[valid][best_idx], 'o', color=color, markersize=8)

ax.set_xlabel('Airspeed (m/s)', color='white')
ax.set_ylabel('L/D ratio', color='white')
ax.set_title('Glide Efficiency vs Speed', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Sink rate vs speed (polar curve)
ax = axes[1, 0]
for name, mass, area, chord, color in gliders:
    weight = mass * 9.81
    q = 0.5 * rho * speeds**2
    C_L_required = weight / (q * area)
    Re_vals = rho * speeds * chord / mu
    C_D0 = 0.02 + 5.0 / np.sqrt(Re_vals + 1)
    AR = chord**2 / area
    C_Di = C_L_required**2 / (np.pi * 0.7 * max(AR, 0.5))
    C_D_total = C_D0 + C_Di
    L_over_D = C_L_required / C_D_total
    sink_rate = speeds / L_over_D  # m/s downward
    valid = (C_L_required < 1.5) & (C_L_required > 0.05)
    ax.plot(speeds[valid], sink_rate[valid], color=color, linewidth=2, label=name)
    if np.any(valid):
        best_sink = np.argmin(sink_rate[valid])
        ax.plot(speeds[valid][best_sink], sink_rate[valid][best_sink], 'v', color=color, markersize=8)

ax.set_xlabel('Airspeed (m/s)', color='white')
ax.set_ylabel('Sink rate (m/s)', color='white')
ax.set_title('Speed Polar (lower = better)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.invert_yaxis()

# Plot 4: Summary table as text
ax = axes[1, 1]
ax.axis('off')
table_text = "Glider Performance Summary\\n" + "=" * 40 + "\\n\\n"
for name, best_v, best_ld in best_ld_data:
    table_text += f"{name}:\\n"
    table_text += f"  Best L/D = {best_ld:.1f} at {best_v:.1f} m/s\\n"
    table_text += f"  Range from 20m = {20 * best_ld:.0f} m\\n\\n"
ax.text(0.05, 0.95, table_text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Key insight: L/D ratio determines glide range per meter of altitude.")
print("Small animals operate at low Reynolds numbers where viscous drag dominates.")
print("This caps their L/D at 2-4, while large gliders achieve 15-50.")`,
      challenge: 'Add a "flying fish" entry (mass=0.3 kg, area=0.01 m^2, chord=0.05 m) and a "Pteranodon" entry (mass=20 kg, area=3.0 m^2, chord=0.8 m). How do their L/D values compare? Why might extinct flying reptiles have been excellent gliders?',
      successHint: 'L/D ratio is the master variable of all unpowered flight. Evolution cannot change the laws of physics, but it can optimize body shape, membrane area, and behavior to squeeze the best L/D from the constraints of size and speed.',
    },
    {
      title: 'Angle of attack optimization — the art of controlled descent',
      concept: `The **angle of attack (AoA)** is the angle between the airfoil (patagium) and the oncoming airflow. It is the primary control variable for any gliding animal.

At low AoA (2-5°), lift is small but drag is also small — good for fast, flat glides. At moderate AoA (8-15°), lift increases substantially, enabling slower flight and tighter turns. Above the **critical angle** (~15-20° for most airfoils), the airflow separates from the upper surface, lift collapses, and **stall** occurs.

Flying squirrels control AoA by:
1. **Wrist angle**: extending or flexing the wrists changes the leading edge angle
2. **Ankle position**: spreading or tucking the hind legs changes the trailing edge
3. **Tail**: the flat, furry tail acts as a stabilizer and elevator
4. **Body arch**: arching or flattening the torso changes the overall camber

High-speed camera studies show that flying squirrels adjust AoA multiple times per second during a single glide. They pitch up (increase AoA) just before landing to increase drag and slow down — exactly like a pilot performing a "flare" landing.

The optimal AoA depends on the goal:
- **Maximum range**: fly at the AoA that maximizes L/D
- **Minimum sink**: fly at a slightly higher AoA (more lift, but also more drag)
- **Landing**: pitch up sharply to stall intentionally, converting speed to a gentle touchdown`,
      analogy: 'Angle of attack is like the angle of a skateboard ramp. Too shallow and you barely leave the ground. Too steep and you go straight up and lose all forward speed. There is a sweet spot that gives you the most distance — and the best skaters (and squirrels) adjust continuously.',
      storyConnection: 'When the flying squirrel reached its target tree, it did not just crash into the trunk. It pitched its body upward at the last moment, like an airplane flaring for landing — a steep angle of attack that traded speed for a gentle stop.',
      checkQuestion: 'Why do flying squirrels pitch up (increase AoA) right before landing, even though this reduces their L/D ratio?',
      checkAnswer: 'At landing, the goal switches from maximum distance to minimum impact speed. Pitching up increases both lift and drag — the extra drag decelerates the squirrel, while the momentary extra lift prevents a steep dive into the trunk. The brief stall right at contact means landing at near-zero vertical velocity. It is the same principle as a pilot flaring just above the runway.',
      codeIntro: 'Simulate a full glide trajectory with dynamic angle of attack adjustments, including the landing flare.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulation parameters
rho = 1.225
mass = 0.15
g = 9.81
A = 0.06  # patagium area
dt = 0.005  # time step (seconds)

def aero_coefficients(alpha_deg):
    """Compute C_L and C_D for a given angle of attack."""
    alpha = np.radians(alpha_deg)
    if alpha_deg < 18:
        C_L = 2 * np.pi * alpha * 0.35
    else:
        C_L = max(2 * np.pi * np.radians(18) * 0.35 - 0.12 * (alpha_deg - 18), 0.1)
    C_D = 0.05 + 0.015 * alpha**2
    return C_L, C_D

def simulate_glide(launch_height, aoa_strategy, max_time=10.0):
    """Simulate 2D glide trajectory.
    aoa_strategy: function(x, y, vx, vy, t) -> alpha_degrees
    """
    x, y = 0.0, launch_height
    vx, vy = 5.0, 0.0  # initial horizontal push
    trajectory = [(x, y)]
    times = [0.0]
    aoas = []
    speeds = []
    t = 0.0

    while y > 0 and t < max_time:
        v = np.sqrt(vx**2 + vy**2)
        if v < 0.1:
            break
        # Flight path angle
        gamma = np.arctan2(-vy, vx)
        alpha_deg = aoa_strategy(x, y, vx, vy, t)
        C_L, C_D = aero_coefficients(alpha_deg)
        q = 0.5 * rho * v**2

        # Lift perpendicular to velocity, drag opposite to velocity
        L = q * A * C_L
        D = q * A * C_D

        # Resolve forces into x and y
        ax_aero = (-D * np.cos(gamma) - L * np.sin(gamma)) / mass
        ay_aero = (-D * np.sin(gamma) + L * np.cos(gamma)) / mass - g

        vx += ax_aero * dt
        vy += ay_aero * dt
        x += vx * dt
        y += vy * dt
        t += dt

        trajectory.append((x, max(y, 0)))
        times.append(t)
        aoas.append(alpha_deg)
        speeds.append(v)

    return np.array(trajectory), np.array(times[:-1]), np.array(aoas), np.array(speeds)

# Strategy 1: Constant angle of attack
def constant_aoa(x, y, vx, vy, t):
    return 10.0

# Strategy 2: Optimized — adjust based on altitude
def optimized_aoa(x, y, vx, vy, t):
    if y > 5:
        return 8.0   # cruise: maximize L/D
    elif y > 2:
        return 12.0  # transition: increase lift
    else:
        return 22.0  # flare: pitch up to slow down

# Strategy 3: Too steep — stalls early
def steep_aoa(x, y, vx, vy, t):
    return 25.0

# Strategy 4: Adaptive — adjusts to maximize L/D continuously
def adaptive_aoa(x, y, vx, vy, t):
    v = np.sqrt(vx**2 + vy**2)
    # Find alpha that maximizes L/D at current speed
    best_alpha = 8.0
    best_ld = 0
    for a in np.arange(2, 20, 0.5):
        cl, cd = aero_coefficients(a)
        if cd > 0 and cl / cd > best_ld:
            best_ld = cl / cd
            best_alpha = a
    # Flare near ground
    if y < 2:
        return 22.0
    return best_alpha

launch_h = 20.0
strategies = [
    ('Constant 10°', constant_aoa, '#3b82f6'),
    ('Steep 25° (stalling)', steep_aoa, '#ef4444'),
    ('Altitude-adaptive', optimized_aoa, '#22c55e'),
    ('L/D-optimized + flare', adaptive_aoa, '#f59e0b'),
]

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

results = {}
for name, strategy, color in strategies:
    traj, times, aoas, speeds = simulate_glide(launch_h, strategy)
    results[name] = (traj, times, aoas, speeds, color)
    axes[0, 0].plot(traj[:, 0], traj[:, 1], color=color, linewidth=2, label=name)

ax = axes[0, 0]
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Glide Trajectories', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0)

# Plot AoA over time
ax = axes[0, 1]
for name, (traj, times, aoas, speeds, color) in results.items():
    if len(aoas) > 0:
        ax.plot(times[:len(aoas)], aoas, color=color, linewidth=1.5, label=name)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Angle of attack (°)', color='white')
ax.set_title('Angle of Attack Over Time', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot speed over time
ax = axes[1, 0]
for name, (traj, times, aoas, speeds, color) in results.items():
    if len(speeds) > 0:
        ax.plot(times[:len(speeds)], speeds, color=color, linewidth=1.5, label=name)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Speed (m/s)', color='white')
ax.set_title('Airspeed Over Time', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Summary bar chart
ax = axes[1, 1]
names_short = ['Const 10°', 'Steep 25°', 'Adaptive', 'L/D opt']
ranges = [results[s[0]][0][-1, 0] for s in strategies]
landing_speeds = []
for s in strategies:
    sp = results[s[0]][3]
    landing_speeds.append(sp[-1] if len(sp) > 0 else 0)

x_pos = np.arange(len(names_short))
bars = ax.bar(x_pos - 0.2, ranges, 0.35, color='#3b82f6', label='Range (m)')
ax2 = ax.twinx()
bars2 = ax2.bar(x_pos + 0.2, landing_speeds, 0.35, color='#ef4444', label='Landing speed (m/s)')
ax.set_xticks(x_pos)
ax.set_xticklabels(names_short, color='white', fontsize=9)
ax.set_ylabel('Range (m)', color='#3b82f6')
ax2.set_ylabel('Landing speed (m/s)', color='#ef4444')
ax.set_title('Range vs Landing Speed', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Strategy comparison (launch height = 20m):")
for name, (traj, times, aoas, speeds, color) in results.items():
    rng = traj[-1, 0]
    ls = speeds[-1] if len(speeds) > 0 else 0
    print(f"  {name:25s}: range={rng:.1f}m, landing speed={ls:.1f} m/s")
print()
print("The L/D-optimized strategy with landing flare gives the best")
print("combination of range AND low landing speed — exactly what evolution selected for.")`,
      challenge: 'Add a wind gust simulation: at t=1.5 seconds, apply a sudden 3 m/s updraft for 0.5 seconds. How should the AoA strategy change to exploit the updraft? Real squirrels adjust instantly to thermals.',
      successHint: 'Angle of attack is the gliding animal\'s primary control input. The difference between a crash and a graceful landing is a few degrees of adjustment at exactly the right moment.',
    },
    {
      title: 'Convergent evolution of gliding — when nature reinvents the same solution',
      concept: `At least six independent lineages of mammals have evolved gliding, plus numerous reptiles, amphibians, and fish. This is a textbook case of **convergent evolution** — unrelated species independently evolving similar traits in response to similar environmental pressures.

Known gliding lineages:
- **Flying squirrels** (Pteromyini): 50+ species across Asia, Europe, North America
- **Sugar gliders** (Petaurus): marsupials in Australia
- **Colugos** (Dermoptera): the most accomplished mammalian gliders, SE Asia
- **Anomalures** (Anomaluridae): scaly-tailed squirrels of Africa
- **Flying fish** (Exocoetidae): use enlarged pectoral fins
- **Draco lizards**: use rib-supported flaps
- **Wallace's flying frog**: uses oversized webbed feet

What drives convergent evolution? The same **selection pressure** — in this case, the need to move between trees in a 3D canopy without descending to the ground (where predators lurk). The "fitness landscape" has a peak at "membrane glider," and multiple lineages found their way to it.

Convergent evolution is strong evidence that evolution is not random — natural selection drives organisms toward similar optimal solutions when facing similar problems.`,
      analogy: 'Convergent evolution is like how every culture independently invented the wheel, the boat, and the arch. Nobody copied anyone — the problems of transport, water crossing, and structural support have the same physics everywhere, so the solutions converge. Biological evolution works the same way.',
      storyConnection: 'Our flying squirrel shares the sky with sugar gliders on the other side of the world — two completely unrelated mammals that look almost identical when gliding. The story of the flying squirrel is really the story of how nature solves the same engineering problem repeatedly.',
      checkQuestion: 'Flying squirrels (rodents) and sugar gliders (marsupials) are very distantly related — their common ancestor lived ~160 million years ago. Why do they look nearly identical when gliding?',
      checkAnswer: 'The physics of gliding at that body size in a forest canopy dictates a narrow range of viable body plans: a flat membrane between forelimbs and hindlimbs, a flat tail for stability, large eyes for nocturnal navigation. Natural selection independently drove both lineages to the same optimum. The convergence is so precise that even their body masses and patagium areas are similar.',
      codeIntro: 'Simulate a fitness landscape and show how multiple starting points converge to the same gliding phenotype.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 2D fitness landscape: x-axis = membrane area, y-axis = body mass
# Fitness is highest where the combination gives good gliding performance
membrane_area = np.linspace(0, 1, 100)  # normalized 0-1
body_mass = np.linspace(0, 1, 100)  # normalized 0-1
M, B = np.meshgrid(membrane_area, body_mass)

# Fitness function: peak at optimal membrane/mass ratio for gliding
# Multiple local peaks for different strategies
fitness = (1.5 * np.exp(-((M - 0.65)**2 + (B - 0.3)**2) / 0.02)  # small glider (squirrel/sugar glider)
         + 1.2 * np.exp(-((M - 0.8)**2 + (B - 0.5)**2) / 0.03)   # large glider (colugo)
         + 0.5 * np.exp(-((M - 0.2)**2 + (B - 0.15)**2) / 0.01)  # tiny glider (frog)
         + 0.3 * np.exp(-((M - 0.1)**2 + (B - 0.7)**2) / 0.05))  # non-glider baseline

# Simulate evolutionary trajectories — hill climbing with noise
def evolve(start_m, start_b, steps=300, lr=0.003, noise=0.01):
    """Gradient ascent on fitness landscape with mutation noise."""
    path = [(start_m, start_b)]
    m, b = start_m, start_b
    for _ in range(steps):
        # Numerical gradient
        dm = 0.005
        if 0 < m < 1 and 0 < b < 1:
            mi, bi = int(m * 99), int(b * 99)
            mi = np.clip(mi, 1, 98)
            bi = np.clip(bi, 1, 98)
            grad_m = (fitness[bi, mi+1] - fitness[bi, mi-1]) / 2
            grad_b = (fitness[bi+1, mi] - fitness[bi-1, mi]) / 2
        else:
            grad_m, grad_b = 0, 0
        m += lr * grad_m + np.random.randn() * noise
        b += lr * grad_b + np.random.randn() * noise
        m = np.clip(m, 0.01, 0.99)
        b = np.clip(b, 0.01, 0.99)
        path.append((m, b))
    return np.array(path)

# Different starting lineages (distant relatives)
lineages = [
    ('Proto-rodent (→ Flying squirrel)', 0.15, 0.25, '#22c55e'),
    ('Proto-marsupial (→ Sugar glider)', 0.20, 0.40, '#3b82f6'),
    ('Proto-dermopteran (→ Colugo)', 0.50, 0.60, '#a855f7'),
    ('Proto-anuran (→ Flying frog)', 0.10, 0.10, '#f59e0b'),
    ('Proto-squamate (→ Draco lizard)', 0.05, 0.20, '#ef4444'),
]

fig, axes = plt.subplots(1, 3, figsize=(15, 5.5))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Fitness landscape with evolutionary paths
ax = axes[0]
contour = ax.contourf(M, B, fitness, levels=20, cmap='magma')
for name, sm, sb, color in lineages:
    path = evolve(sm, sb)
    ax.plot(path[:, 0], path[:, 1], color=color, linewidth=1.5, alpha=0.8)
    ax.plot(path[0, 0], path[0, 1], 'o', color=color, markersize=8)
    ax.plot(path[-1, 0], path[-1, 1], '*', color=color, markersize=14)
    short_name = name.split('(')[1].rstrip(')')
    ax.annotate(short_name, xy=(path[-1, 0], path[-1, 1]),
                xytext=(5, 5), textcoords='offset points',
                color=color, fontsize=7, fontweight='bold')
ax.set_xlabel('Membrane area (normalized)', color='white')
ax.set_ylabel('Body mass (normalized)', color='white')
ax.set_title('Fitness Landscape + Evolutionary Paths', color='white', fontsize=10)

# Plot 2: Trait convergence over evolutionary time
ax = axes[1]
for name, sm, sb, color in lineages:
    path = evolve(sm, sb)
    # Track distance to nearest fitness peak
    peak_m, peak_b = 0.65, 0.3  # main glider peak
    dist = np.sqrt((path[:, 0] - peak_m)**2 + (path[:, 1] - peak_b)**2)
    ax.plot(dist, color=color, linewidth=2, label=name.split('(')[0].strip())
ax.set_xlabel('Evolutionary time (generations)', color='white')
ax.set_ylabel('Distance to glider optimum', color='white')
ax.set_title('Convergence to Gliding Phenotype', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Final phenotype comparison (radar-style as bar chart)
ax = axes[2]
traits = ['Membrane\\narea', 'Body\\nmass', 'L/D\\nratio', 'Nocturnal\\nadapt.', 'Tail\\nlength']
# Normalized trait values (0-1) for converged gliders
squirrel_traits = [0.7, 0.3, 0.5, 0.9, 0.8]
sugar_glider_traits = [0.65, 0.25, 0.5, 0.85, 0.75]
colugo_traits = [0.9, 0.5, 0.7, 0.95, 0.4]

x = np.arange(len(traits))
width = 0.25
ax.bar(x - width, squirrel_traits, width, color='#22c55e', label='Flying squirrel')
ax.bar(x, sugar_glider_traits, width, color='#3b82f6', label='Sugar glider')
ax.bar(x + width, colugo_traits, width, color='#a855f7', label='Colugo')
ax.set_xticks(x)
ax.set_xticklabels(traits, color='white', fontsize=8)
ax.set_ylabel('Trait value (normalized)', color='white')
ax.set_title('Trait Convergence Across Lineages', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Convergent evolution of gliding:")
print("  - At least 6 mammalian lineages evolved gliding independently")
print("  - Same selection pressure (canopy movement) → same solution (membrane)")
print("  - Convergence extends to body size, nocturnality, and even diet")
print("  - This is strong evidence that evolution is predictable given constraints")`,
      challenge: 'Modify the fitness landscape to add a second peak for "powered flight" at (0.3, 0.05) — small body with high muscle ratio. Can any lineage reach it? What does this tell you about why powered flight evolved only once in mammals (bats)?',
      successHint: 'Convergent evolution shows that natural selection is not random — it is an optimization process. When the physics of the problem is the same, the solution space is constrained, and unrelated lineages converge on the same design.',
    },
    {
      title: 'Nocturnal ecology — how flying squirrels own the night canopy',
      concept: `Nearly all 50+ species of flying squirrel are **nocturnal**. This is not coincidence — it is an evolutionary strategy shaped by multiple interacting pressures:

1. **Predator avoidance**: Diurnal raptors (hawks, eagles) are the primary predators of canopy mammals. By being active at night, flying squirrels avoid the most dangerous hunters. Owls are a threat, but their density is much lower.

2. **Reduced competition**: Diurnal squirrels (which cannot glide) dominate daytime foraging. By shifting to night, flying squirrels access the same food without direct competition — this is called **temporal niche partitioning**.

3. **Thermal efficiency**: Small mammals lose heat rapidly (high surface-area-to-volume ratio). Night activity in tropical/subtropical forests means lower metabolic cost since temperatures are cooler but not cold, reducing overheating risk during energetic gliding.

4. **Sensory adaptations**: Flying squirrels have enormous eyes relative to body size — up to 2x the diameter of same-sized diurnal squirrels. Their retinas are rod-dominated (sensitive in low light but poor color vision). They also rely heavily on whiskers (vibrissae) for spatial awareness.

The **tapetum lucidum** (reflective layer behind the retina) is present in many nocturnal mammals but NOT in flying squirrels — they achieve night vision through large corneas and rod-rich retinas instead. This is unusual and suggests their nocturnality evolved relatively recently.`,
      analogy: 'Nocturnal ecology is like the night shift at a factory. The same machines (trees, food sources) are available, but different workers (species) use them. By choosing the night shift, flying squirrels avoid the most aggressive coworkers (hawks) and compete only with the mellower night crew (owls, civets).',
      storyConnection: 'The flying squirrel in our story always appeared after sunset, its huge dark eyes reflecting the moonlight. Those eyes were not just beautiful — they were precision instruments evolved to navigate a three-dimensional canopy in near-darkness.',
      checkQuestion: 'If climate change caused a forest to become significantly hotter during the day, would you expect flying squirrels to become MORE or LESS nocturnal? Why?',
      checkAnswer: 'More nocturnal, or more strictly nocturnal (avoiding even dusk/dawn). Higher daytime temperatures would increase metabolic costs during the energy-intensive process of gliding. Night would become even more favorable thermally. Additionally, heat-stressed diurnal predators might shift their hunting to cooler dawn/dusk periods, pushing flying squirrels deeper into the night.',
      codeIntro: 'Model the energetic costs and predation risk over a 24-hour cycle to find the optimal activity window.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.linspace(0, 24, 1000)

# Model 1: Predation risk over 24 hours
# Raptors active 6am-7pm, owls active 8pm-5am
raptor_risk = 0.8 * np.exp(-((hours - 12) ** 2) / 8)   # peak at noon
owl_risk = 0.3 * np.exp(-((np.minimum(hours, 24 - hours)) ** 2) / 6)  # peak at midnight
total_predation = raptor_risk + owl_risk

# Model 2: Light levels (affects foraging and navigation)
light = np.maximum(0, np.sin(np.pi * (hours - 6) / 12))
light[hours > 18] = 0
light[hours < 6] = 0
# Moonlight (much dimmer)
moonlight = 0.05 + 0.1 * np.maximum(0, np.sin(np.pi * (hours - 18) / 12))

# Model 3: Temperature cycle
temp = 22 + 8 * np.sin(np.pi * (hours - 6) / 12)  # peaks at noon
temp = np.where(hours < 6, 18 + 2 * np.sin(np.pi * hours / 12), temp)
temp = np.where(hours > 18, 22 - 4 * (hours - 18) / 6, temp)

# Model 4: Metabolic cost of activity (higher in heat)
# Flying squirrels are endotherms — cost increases with temperature deviation
optimal_temp = 20
metabolic_cost = 1.0 + 0.05 * (temp - optimal_temp) ** 2

# Model 5: Food availability (insects peak at dusk, fruit always available)
insect_availability = 0.3 + 0.7 * np.exp(-((hours - 20) ** 2) / 4)
fruit_availability = np.ones_like(hours) * 0.6  # always available
food = 0.5 * insect_availability + 0.5 * fruit_availability

# Combined fitness: food * safety / metabolic_cost
safety = 1.0 / (1.0 + 5 * total_predation)
fitness = food * safety / metabolic_cost

# Eye size model — photon capture
eye_diameters = np.linspace(3, 12, 50)  # mm
# Photon capture scales with area (diameter^2)
photon_capture = (eye_diameters / 6) ** 2
# Metabolic cost of large eyes scales linearly
eye_cost = 0.5 + 0.05 * eye_diameters
# Night vision utility
night_vision_fitness = photon_capture / eye_cost

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Predation risk
ax = axes[0, 0]
ax.fill_between(hours, raptor_risk, alpha=0.3, color='#ef4444', label='Raptor risk')
ax.fill_between(hours, owl_risk, alpha=0.3, color='#a855f7', label='Owl risk')
ax.plot(hours, total_predation, color='white', linewidth=2, label='Total risk')
ax.axvspan(20, 4, alpha=0.1, color='#22c55e')  # safe window
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Predation risk', color='white')
ax.set_title('Predation Risk (24h)', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Light levels
ax = axes[0, 1]
ax.fill_between(hours, light, alpha=0.4, color='#f59e0b', label='Sunlight')
ax.fill_between(hours, moonlight, alpha=0.4, color='#6b7280', label='Moonlight')
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Light intensity', color='white')
ax.set_title('Light Availability', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Temperature and metabolic cost
ax = axes[0, 2]
ax.plot(hours, temp, color='#ef4444', linewidth=2, label='Temperature (°C)')
ax2 = ax.twinx()
ax2.plot(hours, metabolic_cost, color='#3b82f6', linewidth=2, linestyle='--', label='Metabolic cost')
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Temperature (°C)', color='#ef4444')
ax2.set_ylabel('Metabolic cost', color='#3b82f6')
ax.set_title('Thermal Environment', color='white', fontsize=10)
ax2.tick_params(colors='gray')

# Food availability
ax = axes[1, 0]
ax.plot(hours, insect_availability, color='#22c55e', linewidth=2, label='Insects')
ax.plot(hours, fruit_availability, color='#f59e0b', linewidth=2, label='Fruit/nuts')
ax.plot(hours, food, color='white', linewidth=2, linestyle='--', label='Combined food')
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Food availability', color='white')
ax.set_title('Food Resources', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Combined fitness
ax = axes[1, 1]
ax.plot(hours, fitness, color='#22c55e', linewidth=2.5)
ax.fill_between(hours, fitness, alpha=0.2, color='#22c55e')
optimal_hour = hours[np.argmax(fitness)]
ax.axvline(optimal_hour, color='#f59e0b', linestyle='--', linewidth=2)
ax.annotate(f'Optimal: {optimal_hour:.0f}:00',
            xy=(optimal_hour, np.max(fitness)),
            xytext=(optimal_hour + 2, np.max(fitness) * 0.9),
            color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Activity fitness', color='white')
ax.set_title('Optimal Activity Window', color='white', fontsize=10)

# Eye size optimization
ax = axes[1, 2]
ax.plot(eye_diameters, night_vision_fitness, color='#a855f7', linewidth=2)
best_eye = eye_diameters[np.argmax(night_vision_fitness)]
ax.axvline(best_eye, color='#f59e0b', linestyle='--')
ax.annotate(f'Optimal: {best_eye:.0f}mm',
            xy=(best_eye, np.max(night_vision_fitness)),
            xytext=(best_eye + 1, np.max(night_vision_fitness) * 0.85),
            color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
# Mark actual flying squirrel and regular squirrel
ax.axvline(9, color='#22c55e', linestyle=':', label='Flying squirrel (9mm)')
ax.axvline(5, color='#ef4444', linestyle=':', label='Day squirrel (5mm)')
ax.set_xlabel('Eye diameter (mm)', color='white')
ax.set_ylabel('Night vision fitness', color='white')
ax.set_title('Eye Size Optimization', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print(f"Optimal activity time: {optimal_hour:.0f}:00 (early night)")
print(f"This matches real flying squirrel behavior: peak activity 1-3 hours after sunset.")
print(f"The model correctly predicts nocturnality from first principles:")
print(f"  - Low predation risk at night")
print(f"  - Insect peak at dusk")
print(f"  - Lower metabolic costs at cooler temperatures")
print(f"  - Large eyes (9mm) compensate for low light")`,
      challenge: 'Add seasonal variation: in winter, nights are longer and colder. Modify the temperature curve and light cycle for a 14-hour night. Does the optimal activity window shift? Do flying squirrels in cold climates need to be active longer to get enough food?',
      successHint: 'Nocturnal ecology is a systems problem — predation risk, temperature, food availability, and sensory capability all interact. Flying squirrels solved this multi-objective optimization through millions of years of natural selection.',
    },
    {
      title: 'Population genetics of fragmented habitats — when forests become islands',
      concept: `Deforestation does not just reduce habitat — it **fragments** it. A continuous forest becomes scattered patches separated by open ground that gliding animals cannot cross if the gaps are too wide. For flying squirrels, which can glide 20-50 meters at most, a 100-meter clearing is as impassable as an ocean.

This creates **genetic islands**. When populations are cut off from each other:

1. **Genetic drift**: In small populations, random chance causes allele frequencies to shift unpredictably. Rare alleles can be lost forever. This reduces **genetic diversity** — the raw material for adaptation.

2. **Inbreeding**: With fewer potential mates, individuals increasingly breed with relatives. This increases **homozygosity** (having two identical alleles), which can expose harmful recessive traits — **inbreeding depression**.

3. **Local extinction risk**: Small, genetically impoverished populations are vulnerable to disease, environmental change, and demographic stochasticity (random variation in birth/death rates).

The **effective population size** (Ne) is usually much smaller than the census size (N). For flying squirrels, Ne might be 20-30% of N because not all individuals breed, and reproductive success is uneven.

Conservation genetics uses tools like **Fst** (fixation index) to measure genetic differentiation between populations. Fst = 0 means free gene flow; Fst = 1 means complete isolation.`,
      analogy: 'Genetic fragmentation is like breaking a large school into 10 tiny schools with no student transfers. Each small school develops its own culture (genetic drift), students increasingly date within their small class (inbreeding), and if a disease hits one school, there are not enough students to keep it running (extinction risk). A connected system is resilient; isolated fragments are fragile.',
      storyConnection: 'The flying squirrel\'s forest was once continuous — a vast green corridor connecting hilltop to hilltop. As roads and farms carved it up, the squirrel\'s family became trapped on one fragment. It could see other forest patches across the clearing but could not reach them. Its world had become an island.',
      checkQuestion: 'A forest fragment supports 50 flying squirrels. The effective population size is Ne = 15. How many generations until significant genetic drift occurs? (Hint: the "rule of thumb" is that drift becomes important when the number of generations approaches Ne.)',
      checkAnswer: 'Significant drift occurs within about Ne = 15 generations. For flying squirrels with a generation time of ~2 years, that is only 30 years. Within a human lifetime, an isolated fragment can lose substantial genetic diversity. This is why conservation biologists are so concerned about habitat fragmentation — the genetic damage happens fast.',
      codeIntro: 'Simulate genetic drift, fragmentation, and gene flow in a metapopulation of flying squirrels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_drift(pop_size, generations, initial_freq=0.5, n_loci=20):
    """Simulate genetic drift for multiple independent loci."""
    freqs = np.full((generations + 1, n_loci), initial_freq)
    for gen in range(generations):
        for locus in range(n_loci):
            # Binomial sampling: each generation, draw 2N alleles from current freq
            n_alleles = np.random.binomial(2 * pop_size, freqs[gen, locus])
            freqs[gen + 1, locus] = n_alleles / (2 * pop_size)
    return freqs

def simulate_metapopulation(n_patches, pop_sizes, migration_rate, generations, n_loci=10):
    """Simulate drift + migration across patches."""
    freqs = np.full((n_patches, generations + 1, n_loci), 0.5)
    # Give each patch slightly different starting frequencies
    for p in range(n_patches):
        freqs[p, 0, :] = np.random.uniform(0.3, 0.7, n_loci)

    for gen in range(generations):
        for p in range(n_patches):
            for locus in range(n_loci):
                # Drift
                n_alleles = np.random.binomial(2 * pop_sizes[p], freqs[p, gen, locus])
                new_freq = n_alleles / (2 * pop_sizes[p])
                # Migration: receive alleles from other patches
                if migration_rate > 0 and n_patches > 1:
                    migrants_freq = np.mean([freqs[q, gen, locus] for q in range(n_patches) if q != p])
                    new_freq = (1 - migration_rate) * new_freq + migration_rate * migrants_freq
                freqs[p, gen + 1, locus] = np.clip(new_freq, 0, 1)
    return freqs

def compute_fst(freqs_by_patch):
    """Compute Fst (fixation index) from allele frequencies across patches."""
    p_mean = np.mean(freqs_by_patch)
    Ht = 2 * p_mean * (1 - p_mean)  # total heterozygosity
    Hs = np.mean([2 * p * (1 - p) for p in freqs_by_patch])  # within-patch heterozygosity
    if Ht == 0:
        return 0
    return (Ht - Hs) / Ht

generations = 200

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Drift in small vs large population
ax = axes[0, 0]
small_pop = simulate_drift(15, generations, n_loci=8)
large_pop = simulate_drift(500, generations, n_loci=8)
for i in range(8):
    ax.plot(small_pop[:, i], color='#ef4444', alpha=0.4, linewidth=1)
    ax.plot(large_pop[:, i], color='#22c55e', alpha=0.4, linewidth=1)
ax.plot([], [], color='#ef4444', linewidth=2, label='Ne=15 (fragment)')
ax.plot([], [], color='#22c55e', linewidth=2, label='Ne=500 (intact)')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Allele frequency', color='white')
ax.set_title('Genetic Drift: Small vs Large Pop.', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Heterozygosity loss over time
ax = axes[0, 1]
for Ne, color, label in [(15, '#ef4444', 'Ne=15'), (50, '#f59e0b', 'Ne=50'),
                          (200, '#3b82f6', 'Ne=200'), (500, '#22c55e', 'Ne=500')]:
    gens = np.arange(generations + 1)
    # Expected heterozygosity: H(t) = H(0) * (1 - 1/(2Ne))^t
    H = 0.5 * (1 - 1 / (2 * Ne)) ** gens
    ax.plot(gens, H, color=color, linewidth=2, label=label)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Expected heterozygosity', color='white')
ax.set_title('Diversity Loss Over Time', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Metapopulation — isolated fragments
ax = axes[0, 2]
meta_isolated = simulate_metapopulation(5, [20, 20, 20, 20, 20], 0.0, generations, n_loci=5)
colors_patches = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444']
for p in range(5):
    mean_freq = np.mean(meta_isolated[p], axis=1)
    ax.plot(mean_freq, color=colors_patches[p], linewidth=1.5, label=f'Patch {p+1}')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean allele frequency', color='white')
ax.set_title('Isolated Fragments (no gene flow)', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Metapopulation — with gene flow
ax = axes[1, 0]
meta_connected = simulate_metapopulation(5, [20, 20, 20, 20, 20], 0.05, generations, n_loci=5)
for p in range(5):
    mean_freq = np.mean(meta_connected[p], axis=1)
    ax.plot(mean_freq, color=colors_patches[p], linewidth=1.5, label=f'Patch {p+1}')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean allele frequency', color='white')
ax.set_title('Connected Fragments (5% migration)', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Fst over time for different migration rates
ax = axes[1, 1]
for m_rate, color, label in [(0.0, '#ef4444', 'No migration'),
                               (0.01, '#f59e0b', '1% migration'),
                               (0.05, '#3b82f6', '5% migration'),
                               (0.10, '#22c55e', '10% migration')]:
    meta = simulate_metapopulation(5, [30]*5, m_rate, generations, n_loci=10)
    fst_over_time = []
    for gen in range(0, generations + 1, 5):
        patch_freqs = [np.mean(meta[p, gen, :]) for p in range(5)]
        fst_over_time.append(compute_fst(patch_freqs))
    ax.plot(range(0, generations + 1, 5), fst_over_time, color=color, linewidth=2, label=label)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Fst (genetic differentiation)', color='white')
ax.set_title('Fst Over Time by Migration Rate', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Conservation recommendation
ax = axes[1, 2]
ax.axis('off')
text = """Conservation Genetics Summary
================================

Fragmented habitat with Ne=15 per patch:
- Loses 50% genetic diversity in ~20 generations
- Fst approaches 1.0 (complete isolation)
- Inbreeding depression likely within 10 generations

Wildlife corridors (enabling 5% migration):
- Maintains >80% diversity over 200 generations
- Fst stays below 0.1 (one large population)
- Inbreeding depression prevented

PRESCRIPTION: Even one migrant per generation
(Nm = 1) can prevent most drift-related damage.
Build corridors. Connect fragments."""

ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Key finding: Genetic isolation is as dangerous as habitat loss.")
print("A forest fragment with 50 squirrels but no gene flow will lose")
print("critical diversity within decades. Wildlife corridors that allow")
print("even a few migrants per generation can prevent this collapse.")`,
      challenge: 'Add a "corridor construction" event at generation 100: migration rate jumps from 0 to 0.05. How quickly does genetic diversity recover? Is it faster or slower than the rate of loss? This asymmetry matters for conservation planning.',
      successHint: 'Population genetics is where ecology meets evolution. The flying squirrel does not just need trees — it needs CONNECTED trees. Conservation biology is as much about corridors as it is about reserves.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Gliding Aerodynamics & Ecology
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (physics & biology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for aerodynamics simulations. Click to start.</p>
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
