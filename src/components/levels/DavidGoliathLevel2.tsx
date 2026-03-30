import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import NewtonForceDiagram from '../diagrams/NewtonForceDiagram';
import WorkForceDiagram from '../diagrams/WorkForceDiagram';
import EnergyBarChartDiagram from '../diagrams/EnergyBarChartDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import SlopeInterceptDiagram from '../diagrams/SlopeInterceptDiagram';
import DistanceFormulaDiagram from '../diagrams/DistanceFormulaDiagram';

export default function DavidGoliathLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Vector decomposition — breaking velocity into x and y',
      concept: `In Level 1 you used vx = v*cos(theta) and vy = v*sin(theta). Now let's understand **why** this works.

A **vector** has both magnitude (how much) and direction (which way). Velocity is a vector: "30 m/s at 35 degrees above horizontal" contains two pieces of information.

**Decomposition** splits one diagonal vector into two perpendicular components: horizontal (x) and vertical (y). This works because of right triangle geometry:
- The velocity vector is the hypotenuse
- vx = v * cos(theta) is the adjacent side
- vy = v * sin(theta) is the opposite side

Why bother? Because physics equations are simpler when written for x and y separately. Gravity only affects y. Horizontal motion has no acceleration. By decomposing, we turn one hard 2D problem into two easy 1D problems.

The code below visualizes vector decomposition for different launch angles and shows how the x and y components change.`,
      analogy: 'Imagine walking diagonally across a football field. Your friend asks: "How far did you go east-west, and how far north-south?" You decompose your diagonal path into two perpendicular parts. The diagonal distance is the hypotenuse; the east-west and north-south parts are the components. Vectors work exactly the same way.',
      storyConnection: 'David released his stone at an angle — not purely horizontal, not purely vertical. The stone\'s velocity had both a horizontal component (carrying it toward Goliath) and a vertical component (giving it a slight upward arc). Understanding vector decomposition lets us calculate exactly how fast the stone moved in each direction.',
      checkQuestion: 'At what angle are the horizontal and vertical components of velocity equal?',
      checkAnswer: 'At 45 degrees. cos(45) = sin(45) = 0.707, so vx = vy = 0.707 * v. Below 45 degrees, the horizontal component dominates (low, fast trajectory). Above 45 degrees, the vertical component dominates (high, arcing trajectory). This is also why 45 degrees gives maximum range: equal investment in horizontal and vertical motion.',
      codeIntro: 'Visualize how velocity decomposes into x and y at different angles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v0 = 30  # total speed
angles = [15, 30, 45, 60, 75]

fig, axes = plt.subplots(1, 5, figsize=(15, 3))
for ax, angle in zip(axes, angles):
    vx = v0 * np.cos(np.radians(angle))
    vy = v0 * np.sin(np.radians(angle))

    # Draw components
    ax.arrow(0, 0, vx, 0, head_width=0.8, color='cyan', linewidth=2)
    ax.arrow(0, 0, 0, vy, head_width=0.8, color='orange', linewidth=2)
    ax.arrow(0, 0, vx, vy, head_width=1.0, color='lime', linewidth=2.5)

    ax.set_xlim(-2, 35); ax.set_ylim(-2, 35)
    ax.set_aspect('equal'); ax.grid(alpha=0.2)
    ax.set_title(f'{angle} deg', fontsize=11)
    ax.text(vx/2, -1.5, f'vx={vx:.0f}', ha='center', fontsize=8, color='cyan')
    ax.text(-1.5, vy/2, f'vy={vy:.0f}', ha='right', fontsize=8, color='orange')

plt.suptitle('Vector Decomposition: v (green) = vx (cyan) + vy (orange)',
             fontsize=13)
plt.tight_layout(); plt.show()

for a in angles:
    vx = v0 * np.cos(np.radians(a))
    vy = v0 * np.sin(np.radians(a))
    print(f"{a:2d} deg: vx={vx:5.1f} m/s, vy={vy:5.1f} m/s")`,
      challenge: 'Add angle 0 (horizontal) and 90 (vertical) to the list. What happens to the components at these extremes? Verify that vx^2 + vy^2 = v0^2 for every angle (Pythagorean theorem).',
      successHint: 'Vector decomposition is the single most used technique in physics. Every 2D problem — projectiles, forces on a ramp, electric fields — starts by decomposing vectors into components.',
    },
    {
      title: 'Parametric equations — x(t) and y(t) for projectiles',
      concept: `In Level 1 we plotted y vs. x (the parabola). Now let's look at the motion **as a function of time** using **parametric equations**:

- x(t) = vx * t (position at time t, horizontal)
- y(t) = h0 + vy * t - (1/2) * g * t^2 (position at time t, vertical)

These are "parametric" because both x and y depend on a **parameter** t (time). At any moment t, you can compute exactly where the stone is.

This is more powerful than y(x) because it tells you **when** the stone is at each position, not just **where**. You can calculate:
- When does the stone reach maximum height? (When vy - g*t = 0, so t_peak = vy/g)
- When does it hit the ground? (When y(t) = 0)
- How fast is it going at any moment? (vx is constant; vy(t) = vy - g*t)

The code animates the stone's position at each time step, showing x(t) and y(t) as separate plots alongside the combined trajectory.`,
      analogy: 'Think of GPS tracking. A GPS does not record your path as a shape on a map. It records your position at each moment: "at t=0, you were at (0,0); at t=1, at (5,3); at t=2, at (10,5)." That is parametric: position as a function of time. From this, you can reconstruct the path AND know your speed at every moment.',
      storyConnection: 'The stone\'s flight from David\'s sling to Goliath\'s forehead took roughly 0.85 seconds (25 meters at ~29 m/s horizontal speed). In that fraction of a second, gravity pulled the stone down about 3.5 meters. David compensated by aiming above the target. Parametric equations let us trace every millisecond of this brief flight.',
      checkQuestion: 'At what time is the stone\'s speed at its minimum during the flight?',
      checkAnswer: 'At the peak of the trajectory. The horizontal speed vx is constant throughout. The vertical speed starts at vy (upward), decreases to zero at the peak, then increases (downward). Total speed = sqrt(vx^2 + vy(t)^2). Since vx is constant, total speed is minimum when vy(t) = 0, which is at the peak. The minimum speed is vx = v0*cos(theta).',
      codeIntro: 'Plot x(t), y(t), and the combined trajectory with time markers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v0, angle, h0, g = 30, 20, 1.5, 9.8
vx = v0 * np.cos(np.radians(angle))
vy = v0 * np.sin(np.radians(angle))

# Solve for when y = 0 (hits ground)
# h0 + vy*t - 0.5*g*t^2 = 0
disc = vy**2 + 2*g*h0
t_land = (vy + np.sqrt(disc)) / g
t = np.linspace(0, t_land, 300)

x = vx * t
y = h0 + vy * t - 0.5 * g * t**2

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# x(t)
axes[0].plot(t, x, 'cyan', linewidth=2)
axes[0].set_title('x(t) — horizontal position')
axes[0].set_xlabel('Time (s)'); axes[0].set_ylabel('x (m)')
axes[0].grid(alpha=0.3)

# y(t)
axes[1].plot(t, y, 'orange', linewidth=2)
t_peak = vy / g
axes[1].axvline(t_peak, color='red', linestyle='--', alpha=0.5,
                label=f'Peak at t={t_peak:.2f}s')
axes[1].set_title('y(t) — vertical position')
axes[1].set_xlabel('Time (s)'); axes[1].set_ylabel('y (m)')
axes[1].legend(fontsize=9); axes[1].grid(alpha=0.3)

# Combined trajectory with time dots
axes[2].plot(x, y, 'lime', linewidth=2)
# Mark every 0.1 seconds
for ti in np.arange(0, t_land, 0.1):
    xi = vx * ti
    yi = h0 + vy * ti - 0.5 * g * ti**2
    axes[2].plot(xi, yi, 'wo', markersize=4)
axes[2].set_title('Trajectory with time markers')
axes[2].set_xlabel('x (m)'); axes[2].set_ylabel('y (m)')
axes[2].grid(alpha=0.3)

plt.tight_layout(); plt.show()
print(f"Flight time: {t_land:.3f} s")
print(f"Peak height: {h0 + vy**2/(2*g):.2f} m at t = {t_peak:.3f} s")
print(f"Range: {vx * t_land:.1f} m")`,
      challenge: 'Add a fourth subplot showing the stone\'s speed vs. time: speed(t) = sqrt(vx^2 + (vy - g*t)^2). Where is the speed minimum? Does it match your prediction from the comprehension check?',
      successHint: 'Parametric equations are more powerful than simple y(x) plots because they include time. In physics, engineering, and game development, trajectories are almost always computed parametrically.',
    },
    {
      title: 'Air resistance — drag force and terminal velocity',
      concept: `So far we have ignored air resistance. For a heavy cannonball, that is fine. For a small sling stone, air resistance matters.

The **drag force** opposes motion and depends on speed:

**F_drag = 1/2 * rho * v^2 * C_d * A**

Where:
- rho = air density (~1.2 kg/m^3)
- v = speed
- C_d = drag coefficient (~0.47 for a sphere)
- A = cross-sectional area

The drag force is proportional to **v-squared** — it grows rapidly with speed. At some speed, drag equals gravity and the object stops accelerating. This is **terminal velocity**.

For David's stone (~2 cm diameter, 50 grams):
- At 30 m/s, drag is about 0.05 N — comparable to the stone's weight (0.49 N)
- Drag reduces range by roughly 20-30%

The code compares trajectories with and without air resistance.`,
      analogy: 'Stick your hand out of a car window at 30 km/h — gentle breeze. At 100 km/h — strong push. At 200 km/h — you can barely hold your hand out. That is v-squared drag: doubling speed quadruples the force. Now imagine a tiny stone fighting that same air at 100+ km/h.',
      storyConnection: 'David\'s smooth stones from the brook were aerodynamically better than rough stones. A smooth sphere has a lower drag coefficient (~0.47) compared to a rough, irregular rock (~0.8+). Choosing smooth stones was not just about fitting the sling — it was inadvertently optimizing for less air resistance.',
      checkQuestion: 'A feather and a steel ball are dropped in a vacuum tube. Which hits the ground first?',
      checkAnswer: 'They hit at the same time. In a vacuum there is no air resistance, so both experience only gravity (g = 9.8 m/s^2 regardless of mass). This is Galileo\'s famous insight. In air, the feather has enormous drag relative to its weight and falls slowly. The steel ball barely notices air resistance. The difference is ENTIRELY due to drag, not gravity.',
      codeIntro: 'Compare trajectories with and without air resistance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stone properties
m = 0.05; r = 0.01  # 50g, 1cm radius
A = np.pi * r**2     # cross-section
Cd = 0.47; rho = 1.2; g = 9.8

v0, angle = 30, 25
vx0 = v0 * np.cos(np.radians(angle))
vy0 = v0 * np.sin(np.radians(angle))

dt = 0.001
# --- No drag ---
t_nd, x_nd, y_nd = [0], [0], [1.5]
vx, vy = vx0, vy0
while y_nd[-1] >= 0:
    x_nd.append(x_nd[-1] + vx * dt)
    y_nd.append(y_nd[-1] + vy * dt)
    vy -= g * dt
    t_nd.append(t_nd[-1] + dt)

# --- With drag ---
x_d, y_d = [0], [1.5]
vx, vy = vx0, vy0
while y_d[-1] >= 0:
    v = np.sqrt(vx**2 + vy**2)
    F_drag = 0.5 * rho * v**2 * Cd * A
    ax = -F_drag * vx / (v * m)
    ay = -g - F_drag * vy / (v * m)
    vx += ax * dt; vy += ay * dt
    x_d.append(x_d[-1] + vx * dt)
    y_d.append(y_d[-1] + vy * dt)

plt.figure(figsize=(10, 5))
plt.plot(x_nd, y_nd, 'lime', linewidth=2, label='No drag (ideal)')
plt.plot(x_d, y_d, 'red', linewidth=2, label='With air resistance')
plt.xlabel('Distance (m)'); plt.ylabel('Height (m)')
plt.title('Effect of Air Resistance on Sling Stone', fontsize=14)
plt.legend(fontsize=11); plt.grid(alpha=0.3)
plt.ylim(0); plt.show()

print(f"Range without drag: {x_nd[-1]:.1f} m")
print(f"Range with drag:    {x_d[-1]:.1f} m")
print(f"Reduction: {100*(1 - x_d[-1]/x_nd[-1]):.0f}%")`,
      challenge: 'Try doubling the stone radius to 2 cm (keeping mass the same). How does drag change? Now try a denser stone (same size, mass = 100g). Which parameter matters more for range: size or mass?',
      successHint: 'Air resistance makes real ballistics more complex than textbook parabolas. The v-squared drag term means fast objects lose speed rapidly. This is why sling stones, bullets, and baseballs all have shorter ranges than the ideal formula predicts.',
    },
    {
      title: 'Momentum and impulse — F * t = delta p',
      concept: `When the stone hits Goliath, what matters is not just force, but **how the force is delivered over time**. This brings us to **momentum** and **impulse**.

**Momentum**: p = m * v (mass times velocity). A moving object's "quantity of motion."

**Impulse**: J = F * delta_t = delta_p (force times time = change in momentum).

The impulse-momentum theorem says: the impulse applied to an object equals its change in momentum. This works both ways:
- The sling applies impulse to accelerate the stone (building momentum)
- The stone applies impulse to Goliath's forehead (transferring momentum)

The key insight for impacts: **shorter stopping time = larger force**. If the stone stops in 1 millisecond instead of 10, the force is 10x greater. This is why helmets work — they increase the stopping time, reducing force.`,
      analogy: 'Catching a water balloon: catch it gently with yielding hands (long stopping time) and it survives. Catch it stiffly (short stopping time) and it bursts. The balloon has the same momentum either way, but a short stop creates a huge force spike. Goliath\'s rigid forehead was like catching the stone stiffly — maximum force.',
      storyConnection: 'Goliath wore a bronze helmet but his forehead was exposed between the helmet\'s brim and his face guard. The stone hit bare skin over bone — an extremely short stopping distance (maybe 2-3 mm of skin deformation). This short stopping distance meant a very short stopping time and therefore an enormous impact force.',
      checkQuestion: 'If David had used a clay pot instead of a stone (same mass and speed), would the impact force on Goliath be higher or lower?',
      checkAnswer: 'Lower. A clay pot would shatter on impact, spreading the collision over a longer time as the clay fragments. The total impulse (momentum change) is the same, but the longer duration means lower peak force. This is the same principle as car crumple zones: the car "shatters" to extend the collision time and reduce force on passengers.',
      codeIntro: 'Calculate impulse and impact force for different stopping times.',
      code: `import numpy as np
import matplotlib.pyplot as plt

m = 0.05   # stone mass (kg)
v = 30     # impact speed (m/s)
p = m * v  # momentum

# Range of stopping times (from very short to longer)
stop_times = np.logspace(-4, -1, 200)  # 0.1ms to 100ms
forces = p / stop_times

plt.figure(figsize=(10, 5))
plt.loglog(stop_times * 1000, forces, 'gold', linewidth=2.5)

# Mark specific scenarios
scenarios = [
    (0.0005, 'Bone impact'),
    (0.002,  'Leather armor'),
    (0.01,   'Padded armor'),
    (0.05,   'Cushioned catch'),
]
for t_stop, label in scenarios:
    f = p / t_stop
    plt.plot(t_stop*1000, f, 'ro', markersize=10)
    plt.annotate(f'{label}\\n{f:.0f} N', xy=(t_stop*1000, f),
                 xytext=(t_stop*1000*1.5, f*1.3), fontsize=9,
                 color='cyan', arrowprops=dict(arrowstyle='->', color='cyan'))

plt.xlabel('Stopping time (milliseconds)', fontsize=12)
plt.ylabel('Impact force (N)', fontsize=12)
plt.title(f'Impulse: F = p/t (p = {p:.2f} kg*m/s)', fontsize=14)
plt.grid(alpha=0.3, which='both')
plt.show()

print(f"Momentum: {p:.2f} kg*m/s")
for t_stop, label in scenarios:
    print(f"  {label}: F = {p/t_stop:.0f} N ({p/t_stop/9.8:.0f} kg-force)")`,
      challenge: 'A boxer\'s punch delivers about 400 N. At what stopping time does David\'s stone match a boxer\'s punch? What if the stone hits at 40 m/s instead of 30?',
      successHint: 'Impulse = change in momentum is one of the most practical physics concepts. It explains why we use crumple zones, airbags, boxing gloves, and landing mats — all designed to increase stopping time and reduce peak force.',
    },
    {
      title: 'Pressure and area — P = F/A calculations',
      concept: `We just calculated the impact force. But force alone does not determine whether the stone penetrates or bounces off. What matters is **pressure** — force distributed over area:

**P = F / A** (Pascals = Newtons per square meter)

David's stone is roughly spherical with ~1 cm radius. The contact area on impact is tiny — maybe 1 cm^2 (0.0001 m^2). This concentrates all the force into a small point.

Compare:
- Stone on forehead: F = 3000 N over 1 cm^2 = **30 MPa** (30 million Pascals)
- Same force from a pillow: F = 3000 N over 500 cm^2 = **0.06 MPa**

The stone's pressure is 500x higher than the pillow's with the same force. This is why pointed projectiles are more effective than blunt ones — same force, smaller area, higher pressure.

Bone fracture threshold for the human skull is about **40-80 MPa**. David's stone was right in that danger zone.`,
      analogy: 'Stand on a floor in flat shoes: your weight spreads over two soles (~400 cm^2). Comfortable. Now stand on stiletto heels: same weight on two tiny heel points (~2 cm^2). The pressure is 200x higher — enough to dent wood floors. Same force, different area, dramatically different effect.',
      storyConnection: 'The text says the stone "sank into his forehead." This is a pressure effect. A smooth, round stone concentrates its force on a contact patch of about 1 cm^2. At 30 MPa of pressure, this exceeds the fracture threshold of frontal bone. The stone did not need to be large — it needed to be fast and focused.',
      checkQuestion: 'Would a flat stone or a round stone cause more damage at the same speed?',
      checkAnswer: 'A round stone. A round stone contacts the forehead at a small point, concentrating all force into a tiny area (high pressure). A flat stone spreads the same force over a larger area (lower pressure). This is why bullets are pointed, not flat — shape determines the contact area, which determines pressure, which determines penetration.',
      codeIntro: 'Calculate impact pressure for different projectile shapes and sizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

F_impact = 3000  # Newtons (from our impulse calculation)

# Different contact areas (in cm^2, converted to m^2)
shapes = [
    ("Pointed stone",   0.25),
    ("Round stone 1cm", 1.0),
    ("Round stone 2cm", 3.0),
    ("Flat stone",      10.0),
    ("Open hand slap",  100.0),
    ("Pillow",          500.0),
]

names = [s[0] for s in shapes]
areas_cm2 = [s[1] for s in shapes]
areas_m2 = [a * 1e-4 for a in areas_cm2]
pressures = [F_impact / a for a in areas_m2]
pressures_mpa = [p / 1e6 for p in pressures]

plt.figure(figsize=(10, 5))
colors = ['red' if p > 40 else 'orange' if p > 10 else 'green'
          for p in pressures_mpa]
bars = plt.barh(names, pressures_mpa, color=colors)
plt.axvline(40, color='red', linestyle='--', alpha=0.7,
            label='Skull fracture threshold (~40 MPa)')
plt.xlabel('Impact Pressure (MPa)', fontsize=12)
plt.title(f'P = F/A — Same Force ({F_impact} N), Different Areas', fontsize=14)
plt.legend(fontsize=10); plt.grid(axis='x', alpha=0.3)

for bar, p in zip(bars, pressures_mpa):
    plt.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
             f'{p:.1f} MPa', va='center', fontsize=9, color='white')

plt.tight_layout(); plt.show()
print("Red = above skull fracture threshold (40 MPa)")
print("Orange = bone damage likely (10-40 MPa)")
print("Green = bruise only (<10 MPa)")`,
      challenge: 'What if Goliath wore a bronze helmet plate (spreading impact over 20 cm^2)? Recalculate the pressure. Does the helmet save him? Now try padding under the helmet (stopping time increases to 5 ms). What is the combined effect of more area AND more time?',
      successHint: 'P = F/A explains why sharp things cut and blunt things bruise. Combined with impulse (controlling F via stopping time), you now have the full picture of impact mechanics: force, time, and area together determine damage.',
    },
    {
      title: 'Multi-angle simulator — comparing trajectories',
      concept: `Let's build a proper **trajectory simulator** that ties together everything from this level: vector decomposition, parametric equations, air resistance, and impact analysis.

The simulator launches stones at multiple angles from the same speed and overlays their trajectories. You can see:
- How angle trades off range vs. height
- How air resistance distorts the ideal parabola
- Which trajectory hits a specific target
- The impact speed and energy at the target

This is how real ballistics analysis works: simulate many scenarios, compare them, and find the optimal solution. Ancient slingers did this through practice; we do it with code.`,
      analogy: 'Imagine a sprinkler that you can tilt. At each angle, water follows a different arc. Some angles give long, low streams; others give short, high arcs. Our simulator is like watching the sprinkler at every possible angle simultaneously — all trajectories overlaid on one plot.',
      storyConnection: 'Military slingers in ancient armies trained with specific angles for different situations: low angles for rapid fire against charging troops, medium angles for distance, high angles for lobbing over shields. David chose a low, fast trajectory — minimizing flight time so Goliath could not dodge or deflect.',
      checkQuestion: 'If you plot trajectories for 10 degrees through 80 degrees, which trajectory reaches the target fastest (not which goes farthest)?',
      checkAnswer: 'The lowest angle that still reaches the target. Lower angles have more horizontal velocity, so the stone covers horizontal distance faster. A 10-degree launch at 30 m/s has vx = 29.5 m/s, reaching 25 meters in 0.85 seconds. A 45-degree launch has vx = 21.2 m/s, taking 1.18 seconds — 40% slower. In combat, time-to-target matters more than range.',
      codeIntro: 'Overlay multiple trajectories and compare arrival time and impact speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v0 = 30; g = 9.8; h0 = 1.5
m = 0.05; r_stone = 0.01
A = np.pi * r_stone**2; Cd = 0.47; rho = 1.2
target_x = 25; target_h = 2.7

angles = [10, 15, 20, 25, 30, 45]
plt.figure(figsize=(12, 6))

for angle in angles:
    vx, vy = v0*np.cos(np.radians(angle)), v0*np.sin(np.radians(angle))
    xs, ys, dt = [0], [h0], 0.001
    while ys[-1] >= 0 and xs[-1] < 100:
        v = np.sqrt(vx**2 + vy**2)
        Fd = 0.5 * rho * v**2 * Cd * A
        vx -= Fd * vx / (v * m) * dt
        vy -= (g + Fd * vy / (v * m)) * dt
        xs.append(xs[-1] + vx * dt)
        ys.append(ys[-1] + vy * dt)
    plt.plot(xs, ys, linewidth=2, label=f'{angle} deg')

# Target marker
plt.plot(target_x, target_h, 'r*', markersize=20, label='Goliath')
plt.axhline(0, color='gray', linewidth=0.5)
plt.xlabel('Distance (m)', fontsize=12)
plt.ylabel('Height (m)', fontsize=12)
plt.title('Multi-Angle Trajectory Comparison (with drag)', fontsize=14)
plt.legend(fontsize=10); plt.grid(alpha=0.3)
plt.ylim(0, 15); plt.xlim(0, 60)
plt.show()

print("Compare which angle best hits the target at (25m, 2.7m)")
print("Lower angles arrive faster but may miss high targets")
print("Higher angles give more clearance but take longer")`,
      challenge: 'Add a "wall" at x=15m that is 3m tall (draw it with plt.plot). Which angles clear the wall AND still hit Goliath? This is a real military problem: lobbing projectiles over fortifications.',
      successHint: 'You built a multi-angle ballistics simulator with air resistance. This is genuinely useful code — the same approach is used in sports analytics, military planning, and game physics engines.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 projectile motion foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ballistics and mechanics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[SlopeInterceptDiagram, SineWaveDiagram, NewtonForceDiagram, WorkForceDiagram, EnergyBarChartDiagram, DistanceFormulaDiagram][i] ? createElement([SlopeInterceptDiagram, SineWaveDiagram, NewtonForceDiagram, WorkForceDiagram, EnergyBarChartDiagram, DistanceFormulaDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
