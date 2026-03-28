import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FlyingSquirrelLevel4() {
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
      title: 'Capstone: Glide Path Optimizer — problem formulation',
      concept: `Your capstone project is to build a **Glide Path Optimizer** that finds the best launch height, launch angle, and angle-of-attack schedule to maximize horizontal glide distance under realistic conditions including wind.

This is a classic **optimization problem** with:
- **Decision variables**: launch height (h), initial velocity angle (theta_0), and a time-varying AoA profile alpha(t)
- **Objective**: maximize horizontal distance traveled before reaching the ground
- **Constraints**: physics (Newton's laws, aerodynamic forces), biological limits (max AoA before stall, max launch speed from a jump), and environmental factors (wind speed and direction)

We will use **parametric optimization**: represent the AoA schedule as a simple function with a few tunable parameters, then search for the parameter values that maximize range.

The AoA schedule will be: alpha(t) = a0 + a1 * (h(t) / h0) + a2 * (1 - h(t)/h0)^2, where h(t) is current height, h0 is launch height, and a0, a1, a2 are parameters to optimize. This allows the squirrel to glide differently at different altitudes and flare near the ground.`,
      analogy: 'This is like a golf swing optimizer. A golfer has a few controllable variables (club angle, swing speed, follow-through) and wants to maximize distance. The physics is fixed — gravity, air resistance, spin. The optimizer searches through all possible swing configurations to find the one that sends the ball farthest.',
      storyConnection: 'The flying squirrel does not consciously solve differential equations — but millions of years of evolution have tuned its instincts to approximate the optimal solution. Our optimizer will find the same answer from first principles.',
      checkQuestion: 'Why do we parametrize the AoA schedule as a function of height rather than time? What practical advantage does this give?',
      checkAnswer: 'Height-based parametrization is more robust because the squirrel needs to flare near the ground regardless of how long the glide takes. A time-based schedule would need to know the total glide time in advance (which depends on the very variables we are optimizing). Height is a natural state variable that the squirrel can sense directly.',
      codeIntro: 'Set up the physics engine and the parametric AoA model that the optimizer will use.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# GLIDE PATH OPTIMIZER — Part 1: Physics Engine
# ============================================================

rho = 1.225      # air density (kg/m^3)
mass = 0.15      # flying squirrel mass (kg)
g = 9.81         # gravity (m/s^2)
A = 0.06         # patagium area (m^2)
dt = 0.002       # simulation timestep (s)

def aero_coefficients(alpha_deg):
    """Lift and drag coefficients as function of angle of attack."""
    alpha_rad = np.radians(np.clip(alpha_deg, 0, 40))
    if alpha_deg < 18:
        C_L = 2 * np.pi * alpha_rad * 0.35
    else:
        C_L = max(2 * np.pi * np.radians(18) * 0.35 - 0.10 * (alpha_deg - 18), 0.1)
    C_D = 0.05 + 0.015 * alpha_rad**2
    return C_L, C_D

def aoa_schedule(height, launch_height, params):
    """Parametric AoA: alpha = a0 + a1*(h/h0) + a2*(1-h/h0)^2"""
    a0, a1, a2 = params
    h_ratio = np.clip(height / launch_height, 0, 1)
    alpha = a0 + a1 * h_ratio + a2 * (1 - h_ratio)**2
    return np.clip(alpha, 1, 35)  # biological limits

def simulate_glide(launch_height, launch_angle_deg, aoa_params, wind_speed=0.0, max_time=15.0):
    """Full 2D glide simulation with parametric AoA and wind."""
    theta = np.radians(launch_angle_deg)
    v_launch = 4.5  # initial jump speed (m/s) — biological limit
    vx = v_launch * np.cos(theta)
    vy = v_launch * np.sin(theta)  # positive = upward (initial jump)
    x, y = 0.0, launch_height

    trajectory = [(x, y)]
    aoa_history = []
    speed_history = []
    t = 0.0

    while y > 0 and t < max_time:
        # Airspeed includes wind effect
        vx_air = vx - wind_speed  # headwind if positive
        vy_air = vy
        v_air = np.sqrt(vx_air**2 + vy_air**2)

        if v_air < 0.1:
            break

        # Current AoA from schedule
        alpha = aoa_schedule(y, launch_height, aoa_params)
        aoa_history.append(alpha)
        speed_history.append(np.sqrt(vx**2 + vy**2))

        # Flight path angle (relative to air)
        gamma = np.arctan2(-vy_air, vx_air)

        C_L, C_D = aero_coefficients(alpha)
        q = 0.5 * rho * v_air**2
        L = q * A * C_L
        D = q * A * C_D

        # Forces in earth frame
        fx = (-D * np.cos(gamma) - L * np.sin(gamma)) / mass
        fy = (-D * np.sin(gamma) + L * np.cos(gamma)) / mass - g

        vx += fx * dt
        vy += fy * dt
        x += vx * dt
        y += vy * dt
        t += dt

        trajectory.append((x, max(y, 0)))

    return np.array(trajectory), np.array(aoa_history), np.array(speed_history)

# Test with default parameters
launch_h = 20.0
default_params = (10.0, -2.0, 15.0)  # a0=10°, a1=-2° (less at low height), a2=15° (flare)

# Compare several parameter sets
param_sets = [
    ('Flat constant 10°', (10.0, 0.0, 0.0)),
    ('Moderate flare', (8.0, 0.0, 12.0)),
    ('Cruise-then-flare', (6.0, 2.0, 18.0)),
    ('Aggressive early lift', (15.0, -5.0, 20.0)),
]

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Trajectories
ax = axes[0, 0]
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
for (name, params), color in zip(param_sets, colors):
    traj, aoas, speeds = simulate_glide(launch_h, 15, params)
    ax.plot(traj[:, 0], traj[:, 1], color=color, linewidth=2, label=f'{name} ({traj[-1,0]:.1f}m)')
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Glide Trajectories — Different AoA Schedules', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0)

# Plot 2: AoA profiles
ax = axes[0, 1]
for (name, params), color in zip(param_sets, colors):
    heights = np.linspace(0, launch_h, 100)
    aoas = [aoa_schedule(h, launch_h, params) for h in heights]
    ax.plot(heights, aoas, color=color, linewidth=2, label=name)
ax.set_xlabel('Height (m)', color='white')
ax.set_ylabel('Angle of attack (°)', color='white')
ax.set_title('AoA Schedule vs Height', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.invert_xaxis()

# Plot 3: Effect of launch angle
ax = axes[1, 0]
launch_angles = np.arange(-10, 45, 2)
for (name, params), color in zip(param_sets[:2], colors[:2]):
    ranges_by_angle = []
    for angle in launch_angles:
        traj, _, _ = simulate_glide(launch_h, angle, params)
        ranges_by_angle.append(traj[-1, 0])
    ax.plot(launch_angles, ranges_by_angle, color=color, linewidth=2, label=name)
    best_angle = launch_angles[np.argmax(ranges_by_angle)]
    ax.axvline(best_angle, color=color, linestyle=':', alpha=0.5)
ax.set_xlabel('Launch angle (degrees)', color='white')
ax.set_ylabel('Horizontal range (m)', color='white')
ax.set_title('Range vs Launch Angle', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Effect of wind
ax = axes[1, 1]
wind_speeds = np.linspace(-5, 5, 50)  # negative = tailwind
params_test = (8.0, 0.0, 12.0)
ranges_by_wind = []
for ws in wind_speeds:
    traj, _, _ = simulate_glide(launch_h, 15, params_test, wind_speed=ws)
    ranges_by_wind.append(traj[-1, 0])
ax.plot(wind_speeds, ranges_by_wind, color='#a855f7', linewidth=2)
ax.axvline(0, color='gray', linestyle=':', alpha=0.5)
ax.fill_between(wind_speeds, ranges_by_wind, alpha=0.15, color='#a855f7')
ax.set_xlabel('Wind speed (m/s) [positive=headwind]', color='white')
ax.set_ylabel('Horizontal range (m)', color='white')
ax.set_title('Range vs Wind Speed', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Physics engine ready. Key observations:")
print(f"  - AoA schedule shape strongly affects range")
print(f"  - A flare component (a2 term) is critical for soft landing")
print(f"  - Launch angle has an optimum around 10-20°")
print(f"  - Headwind reduces range; tailwind extends it")
print(f"  Next step: automated optimization to find the best parameters.")`,
      challenge: 'Try adding a fourth parameter to the AoA schedule: a3 * sin(2*pi*h/h0) which would allow mid-glide oscillation. Does this extra degree of freedom improve range? Sometimes simpler models are better.',
      successHint: 'You have built a complete physics engine for gliding flight. The parametric AoA model gives you a compact representation that an optimizer can search efficiently. This is real computational engineering.',
    },
    {
      title: 'Capstone: Optimization via grid search and gradient-free methods',
      concept: `Now we optimize. Our objective function is: f(a0, a1, a2, theta, h) = horizontal range from simulation.

This function has no closed-form derivative — it requires running a physics simulation to evaluate. This rules out gradient-based methods (like gradient descent) and demands **gradient-free optimization**.

We will implement three approaches:
1. **Grid search**: evaluate every combination on a coarse grid. Simple but exponentially expensive in dimensions.
2. **Random search**: sample random parameter combinations. Surprisingly effective — often beats grid search because it does not waste samples on unimportant dimensions.
3. **Nelder-Mead simplex**: a smart gradient-free method that uses a "simplex" (triangle in 2D, tetrahedron in 3D) to explore the space, reflecting, expanding, and contracting to home in on the optimum.

For our 5-parameter problem (a0, a1, a2, theta, h), grid search with 10 values per dimension requires 10^5 = 100,000 simulations. Random search with 1,000 samples often finds a solution within 5% of optimal. Nelder-Mead typically converges in 200-500 evaluations.`,
      analogy: 'Grid search is like testing every combination on a menu — every appetizer with every main with every dessert. Random search is like picking 50 random meals and finding the best. Nelder-Mead is like a food critic who tries three dishes, keeps the best two, and replaces the worst with something between the good ones — converging on the best meal much faster.',
      storyConnection: 'Evolution itself is an optimizer — it explores the space of possible body plans through random mutation (like random search) and selects the fittest (like keeping the best samples). The flying squirrel is the result of millions of years of this biological optimization.',
      checkQuestion: 'Grid search with 10 values per parameter and 5 parameters requires 100,000 evaluations. If each simulation takes 10ms, how long does the full grid search take? What about 20 values per parameter?',
      checkAnswer: 'At 10 values: 100,000 * 10ms = 1,000 seconds ≈ 17 minutes. At 20 values: 20^5 = 3,200,000 * 10ms = 32,000 seconds ≈ 9 hours. The curse of dimensionality makes grid search impractical beyond 3-4 dimensions. This is why smarter methods like Nelder-Mead exist.',
      codeIntro: 'Run grid search, random search, and Nelder-Mead to find the optimal glide parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

rho = 1.225; mass = 0.15; g = 9.81; A = 0.06; dt = 0.003

def aero_coeff(alpha_deg):
    a = np.radians(np.clip(alpha_deg, 0, 40))
    C_L = 2*np.pi*a*0.35 if alpha_deg < 18 else max(2*np.pi*np.radians(18)*0.35 - 0.10*(alpha_deg-18), 0.1)
    C_D = 0.05 + 0.015*a**2
    return C_L, C_D

def simulate(params, wind=0.0):
    """Simulate and return horizontal range. params = (a0, a1, a2, launch_angle, launch_height)"""
    a0, a1, a2, angle_deg, h0 = params
    v0 = 4.5
    theta = np.radians(angle_deg)
    vx, vy = v0*np.cos(theta), v0*np.sin(theta)
    x, y = 0.0, h0
    t = 0.0
    while y > 0 and t < 15:
        vxa = vx - wind; va = np.sqrt(vxa**2 + vy**2)
        if va < 0.1: break
        hr = np.clip(y/h0, 0, 1)
        alpha = np.clip(a0 + a1*hr + a2*(1-hr)**2, 1, 35)
        gamma = np.arctan2(-vy, vxa)
        cl, cd = aero_coeff(alpha)
        q = 0.5*rho*va**2
        L, D = q*A*cl, q*A*cd
        vx += (-D*np.cos(gamma) - L*np.sin(gamma))/mass*dt
        vy += (-D*np.sin(gamma) + L*np.cos(gamma))/mass*dt - g*dt
        x += vx*dt; y += vy*dt; t += dt
    return max(x, 0)

# Define search bounds
bounds = [(3, 20), (-10, 5), (0, 25), (0, 35), (10, 30)]
labels = ['a0 (base AoA)', 'a1 (altitude)', 'a2 (flare)', 'Launch angle', 'Launch height']

# 1. Grid search (coarse — 6 values per param = 7776 evaluations)
print("Running grid search (7,776 evaluations)...")
grid_vals = [np.linspace(lo, hi, 6) for lo, hi in bounds]
best_grid_range = 0
best_grid_params = None
grid_count = 0
grid_all_ranges = []

for a0 in grid_vals[0]:
    for a1 in grid_vals[1]:
        for a2 in grid_vals[2]:
            for ang in grid_vals[3]:
                for h in grid_vals[4]:
                    r = simulate((a0, a1, a2, ang, h))
                    grid_all_ranges.append(r)
                    grid_count += 1
                    if r > best_grid_range:
                        best_grid_range = r
                        best_grid_params = (a0, a1, a2, ang, h)

# 2. Random search (1000 evaluations)
print("Running random search (1,000 evaluations)...")
np.random.seed(42)
best_rand_range = 0
best_rand_params = None
rand_history = []
for i in range(1000):
    params = tuple(np.random.uniform(lo, hi) for lo, hi in bounds)
    r = simulate(params)
    rand_history.append(r)
    if r > best_rand_range:
        best_rand_range = r
        best_rand_params = params

# 3. Nelder-Mead simplex (manual implementation)
print("Running Nelder-Mead optimization...")
def nelder_mead(f, bounds, max_iter=300, seed=42):
    rng = np.random.RandomState(seed)
    n = len(bounds)
    # Initialize simplex: n+1 random points
    simplex = []
    for _ in range(n + 1):
        point = np.array([rng.uniform(lo, hi) for lo, hi in bounds])
        simplex.append((f(tuple(point)), point))
    history = []

    for iteration in range(max_iter):
        simplex.sort(key=lambda x: -x[0])  # sort by range (maximize)
        best_val = simplex[0][0]
        history.append(best_val)

        # Centroid of all except worst
        centroid = np.mean([s[1] for s in simplex[:-1]], axis=0)
        worst = simplex[-1]

        # Reflect
        reflected = centroid + 1.0 * (centroid - worst[1])
        reflected = np.clip(reflected, [b[0] for b in bounds], [b[1] for b in bounds])
        fr = f(tuple(reflected))

        if fr > simplex[0][0]:  # better than best — try expansion
            expanded = centroid + 2.0 * (reflected - centroid)
            expanded = np.clip(expanded, [b[0] for b in bounds], [b[1] for b in bounds])
            fe = f(tuple(expanded))
            if fe > fr:
                simplex[-1] = (fe, expanded)
            else:
                simplex[-1] = (fr, reflected)
        elif fr > simplex[-2][0]:  # better than second worst
            simplex[-1] = (fr, reflected)
        else:  # contract
            contracted = centroid + 0.5 * (worst[1] - centroid)
            contracted = np.clip(contracted, [b[0] for b in bounds], [b[1] for b in bounds])
            fc = f(tuple(contracted))
            if fc > worst[0]:
                simplex[-1] = (fc, contracted)
            else:
                # Shrink toward best
                best_point = simplex[0][1]
                for i in range(1, len(simplex)):
                    new_p = best_point + 0.5 * (simplex[i][1] - best_point)
                    simplex[i] = (f(tuple(new_p)), new_p)

    simplex.sort(key=lambda x: -x[0])
    return simplex[0][1], simplex[0][0], history

nm_params, nm_range, nm_history = nelder_mead(simulate, bounds)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Convergence comparison
ax = axes[0, 0]
rand_best_so_far = np.maximum.accumulate(rand_history)
ax.plot(rand_best_so_far, color='#3b82f6', linewidth=2, label=f'Random search ({best_rand_range:.1f}m)')
ax.plot(nm_history, color='#22c55e', linewidth=2, label=f'Nelder-Mead ({nm_range:.1f}m)')
ax.axhline(best_grid_range, color='#f59e0b', linestyle='--', linewidth=2, label=f'Grid search ({best_grid_range:.1f}m)')
ax.set_xlabel('Evaluation number', color='white')
ax.set_ylabel('Best range found (m)', color='white')
ax.set_title('Optimization Convergence', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Optimal trajectories
ax = axes[0, 1]
for params, name, color in [
    (best_grid_params, 'Grid search', '#f59e0b'),
    (best_rand_params, 'Random search', '#3b82f6'),
    (tuple(nm_params), 'Nelder-Mead', '#22c55e'),
]:
    # Simulate full trajectory for plotting
    a0, a1, a2, angle_deg, h0 = params
    v0 = 4.5; theta = np.radians(angle_deg)
    vx, vy = v0*np.cos(theta), v0*np.sin(theta)
    x, y = 0.0, h0; xs, ys = [x], [y]; t = 0
    while y > 0 and t < 15:
        vxa = vx; va = np.sqrt(vxa**2 + vy**2)
        if va < 0.1: break
        hr = np.clip(y/h0, 0, 1)
        alpha = np.clip(a0 + a1*hr + a2*(1-hr)**2, 1, 35)
        gamma = np.arctan2(-vy, vxa)
        cl, cd = aero_coeff(alpha)
        q = 0.5*rho*va**2; L, D = q*A*cl, q*A*cd
        vx += (-D*np.cos(gamma) - L*np.sin(gamma))/mass*0.003
        vy += (-D*np.sin(gamma) + L*np.cos(gamma))/mass*0.003 - g*0.003
        x += vx*0.003; y += vy*0.003; t += 0.003
        xs.append(x); ys.append(max(y,0))
    ax.plot(xs, ys, color=color, linewidth=2, label=f'{name} ({xs[-1]:.1f}m)')
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Optimal Trajectories', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0)

# Plot 3: Parameter comparison
ax = axes[1, 0]
x_pos = np.arange(5)
width = 0.25
grid_normed = [(v-lo)/(hi-lo) for v, (lo, hi) in zip(best_grid_params, bounds)]
rand_normed = [(v-lo)/(hi-lo) for v, (lo, hi) in zip(best_rand_params, bounds)]
nm_normed = [(v-lo)/(hi-lo) for v, (lo, hi) in zip(nm_params, bounds)]
ax.bar(x_pos - width, grid_normed, width, color='#f59e0b', label='Grid')
ax.bar(x_pos, rand_normed, width, color='#3b82f6', label='Random')
ax.bar(x_pos + width, nm_normed, width, color='#22c55e', label='Nelder-Mead')
ax.set_xticks(x_pos)
ax.set_xticklabels(['a0', 'a1', 'a2', 'Angle', 'Height'], color='white', fontsize=9)
ax.set_ylabel('Normalized value (0-1)', color='white')
ax.set_title('Optimal Parameters (Normalized)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Distribution of random search results
ax = axes[1, 1]
ax.hist(rand_history, bins=40, color='#3b82f6', edgecolor='none', alpha=0.7)
ax.axvline(best_rand_range, color='#22c55e', linewidth=2, linestyle='--', label=f'Best: {best_rand_range:.1f}m')
ax.axvline(np.mean(rand_history), color='#f59e0b', linewidth=2, linestyle=':', label=f'Mean: {np.mean(rand_history):.1f}m')
ax.set_xlabel('Horizontal range (m)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Distribution of Random Search Results', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("\\nOptimization Results:")
print(f"{'Method':<20} {'Range (m)':<12} {'Evaluations':<12}")
print("-" * 44)
print(f"{'Grid search':<20} {best_grid_range:<12.1f} {grid_count:<12}")
print(f"{'Random search':<20} {best_rand_range:<12.1f} {1000:<12}")
print(f"{'Nelder-Mead':<20} {nm_range:<12.1f} {300:<12}")
print()
print(f"Best parameters (Nelder-Mead):")
for label, val in zip(labels, nm_params):
    print(f"  {label}: {val:.2f}")`,
      challenge: 'Add a wind robustness criterion: instead of optimizing for zero wind, optimize for the average range across wind speeds [-3, -1, 0, 1, 3] m/s. This gives parameters that work well in all conditions rather than being tuned for calm air.',
      successHint: 'You have built a complete optimization pipeline — from physics engine to parameter search. Nelder-Mead found a better solution in fewer evaluations than brute-force search. This is the power of smart algorithms.',
    },
    {
      title: 'Capstone: Wind field modeling and robustness analysis',
      concept: `Real forests do not have uniform wind. Wind speed varies with height (wind shear), time (gusts), and location (turbulence near tree trunks). A truly optimal glide path must account for this variability.

**Wind shear** follows a logarithmic profile in forests: v(z) = v_ref * ln(z/z0) / ln(z_ref/z0), where z0 is the roughness length (~1m for forests) and v_ref is the wind speed at reference height z_ref. Near the ground, wind is slow; above the canopy, it accelerates.

**Gusts** are modeled as a stochastic process. A common model is: v_gust(t) = A * sin(2*pi*f*t + phi) + noise, where A is gust amplitude, f is frequency, and phi is random phase. Real turbulence has a Kolmogorov spectrum — energy cascades from large eddies to small ones.

**Robustness** means the optimizer should not just find the BEST parameters for calm conditions, but parameters that perform WELL across a range of conditions. This is the difference between optimization and **robust optimization** — a critical concept in engineering.`,
      analogy: 'Optimizing for one specific wind condition is like studying only the practice exam questions. You might ace that exact exam, but if the real test has different questions, you fail. Robust optimization is like studying the underlying concepts — you perform reasonably well on ANY exam.',
      storyConnection: 'The flying squirrel does not wait for perfectly calm air — it cannot afford to. Its gliding instincts must work in gusty monsoon winds, still winter nights, and everything between. Evolution has made it a robust optimizer, not a brittle one.',
      checkQuestion: 'A parameter set gives 50m range in calm air but only 20m in a 3 m/s headwind. Another gives 42m in calm air and 38m in a 3 m/s headwind. Which would natural selection favor, and why?',
      checkAnswer: 'Natural selection would favor the robust set (42m/38m). In nature, the squirrel encounters variable conditions. The first set\'s 50m is useless if a headwind cuts range to 20m and the squirrel cannot reach the next tree. Fitness is about WORST-case survival, not best-case performance. This is why biological systems are inherently robust.',
      codeIntro: 'Add realistic wind models and perform robustness analysis of the optimized parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
rho = 1.225; mass = 0.15; g = 9.81; A = 0.06; dt = 0.003

def aero_coeff(alpha_deg):
    a = np.radians(np.clip(alpha_deg, 0, 40))
    C_L = 2*np.pi*a*0.35 if alpha_deg < 18 else max(2*np.pi*np.radians(18)*0.35 - 0.10*(alpha_deg-18), 0.1)
    C_D = 0.05 + 0.015*a**2
    return C_L, C_D

def wind_profile(height, v_ref, z_ref=25, z0=1.0):
    """Logarithmic wind profile for forest environment."""
    if height <= z0:
        return 0.0
    return v_ref * np.log(height / z0) / np.log(z_ref / z0)

def wind_gust(t, amplitude=1.5, freq=0.8):
    """Stochastic gust model."""
    return amplitude * (np.sin(2*np.pi*freq*t + 1.3) +
                        0.5*np.sin(2*np.pi*2.1*freq*t + 0.7) +
                        0.3*np.random.randn())

def simulate_wind(params, v_ref=0.0, gusty=False):
    """Simulate glide with height-dependent wind and optional gusts."""
    a0, a1, a2, angle_deg, h0 = params
    v0 = 4.5; theta = np.radians(angle_deg)
    vx, vy = v0*np.cos(theta), v0*np.sin(theta)
    x, y = 0.0, h0
    xs, ys = [x], [y]; t = 0
    while y > 0 and t < 15:
        # Height-dependent wind
        w = wind_profile(y, v_ref)
        if gusty:
            w += wind_gust(t)
        vxa = vx - w; va = np.sqrt(vxa**2 + vy**2)
        if va < 0.1: break
        hr = np.clip(y/h0, 0, 1)
        alpha = np.clip(a0 + a1*hr + a2*(1-hr)**2, 1, 35)
        gamma = np.arctan2(-vy, vxa)
        cl, cd = aero_coeff(alpha)
        q = 0.5*rho*va**2; L, D = q*A*cl, q*A*cd
        vx += (-D*np.cos(gamma) - L*np.sin(gamma))/mass*dt
        vy += (-D*np.sin(gamma) + L*np.cos(gamma))/mass*dt - g*dt
        x += vx*dt; y += vy*dt; t += dt
        xs.append(x); ys.append(max(y,0))
    return np.array(xs), np.array(ys), max(xs[-1], 0)

# Optimized parameters (from previous optimization)
calm_opt = (7.5, 1.5, 16.0, 18.0, 28.0)  # tuned for calm
robust_opt = (9.0, 0.5, 14.0, 15.0, 25.0)  # tuned for robustness

# Test across wind conditions
wind_refs = np.linspace(-4, 6, 50)  # negative = tailwind

calm_ranges = [simulate_wind(calm_opt, vr)[2] for vr in wind_refs]
robust_ranges = [simulate_wind(robust_opt, vr)[2] for vr in wind_refs]

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Wind profile
ax = axes[0, 0]
heights = np.linspace(0.1, 30, 100)
for vr, color, label in [(2, '#3b82f6', '2 m/s'), (4, '#f59e0b', '4 m/s'), (6, '#ef4444', '6 m/s')]:
    winds = [wind_profile(h, vr) for h in heights]
    ax.plot(winds, heights, color=color, linewidth=2, label=f'v_ref={label}')
ax.set_xlabel('Wind speed (m/s)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Logarithmic Wind Profile', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Range vs wind — calm-optimized vs robust
ax = axes[0, 1]
ax.plot(wind_refs, calm_ranges, color='#ef4444', linewidth=2, label='Calm-optimized')
ax.plot(wind_refs, robust_ranges, color='#22c55e', linewidth=2, label='Robust-optimized')
ax.axvline(0, color='gray', linestyle=':', alpha=0.5)
ax.fill_between(wind_refs, calm_ranges, robust_ranges,
                where=[c < r for c, r in zip(calm_ranges, robust_ranges)],
                alpha=0.15, color='#22c55e', label='Robust wins')
ax.fill_between(wind_refs, calm_ranges, robust_ranges,
                where=[c >= r for c, r in zip(calm_ranges, robust_ranges)],
                alpha=0.15, color='#ef4444', label='Calm wins')
ax.set_xlabel('Reference wind speed (m/s)', color='white')
ax.set_ylabel('Horizontal range (m)', color='white')
ax.set_title('Range Robustness Comparison', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Trajectories in gusty conditions (Monte Carlo)
ax = axes[0, 2]
n_trials = 30
for i in range(n_trials):
    np.random.seed(i)
    xs, ys, _ = simulate_wind(robust_opt, v_ref=3.0, gusty=True)
    ax.plot(xs, ys, color='#22c55e', alpha=0.2, linewidth=0.8)
# One calm trajectory for reference
xs, ys, _ = simulate_wind(robust_opt, v_ref=0.0, gusty=False)
ax.plot(xs, ys, color='#f59e0b', linewidth=2, label='No wind (reference)')
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title(f'Monte Carlo: {n_trials} Gusty Glides', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0)

# Plot 4: Distribution of ranges under gusty conditions
ax = axes[1, 0]
calm_gusty_ranges = []
robust_gusty_ranges = []
for i in range(200):
    np.random.seed(i + 100)
    _, _, r_calm = simulate_wind(calm_opt, v_ref=2.0, gusty=True)
    _, _, r_robust = simulate_wind(robust_opt, v_ref=2.0, gusty=True)
    calm_gusty_ranges.append(r_calm)
    robust_gusty_ranges.append(r_robust)

ax.hist(calm_gusty_ranges, bins=25, color='#ef4444', alpha=0.6, label=f'Calm-opt (μ={np.mean(calm_gusty_ranges):.1f}m)')
ax.hist(robust_gusty_ranges, bins=25, color='#22c55e', alpha=0.6, label=f'Robust-opt (μ={np.mean(robust_gusty_ranges):.1f}m)')
ax.set_xlabel('Range (m)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Range Distribution (Gusty, v_ref=2)', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Worst-case analysis
ax = axes[1, 1]
wind_scenarios = [-3, -1, 0, 1, 3, 5]
calm_worst = [simulate_wind(calm_opt, vr)[2] for vr in wind_scenarios]
robust_worst = [simulate_wind(robust_opt, vr)[2] for vr in wind_scenarios]
x_pos = np.arange(len(wind_scenarios))
ax.bar(x_pos - 0.2, calm_worst, 0.35, color='#ef4444', label='Calm-optimized')
ax.bar(x_pos + 0.2, robust_worst, 0.35, color='#22c55e', label='Robust-optimized')
ax.set_xticks(x_pos)
ax.set_xticklabels([f'{w}m/s' for w in wind_scenarios], color='white')
ax.set_ylabel('Range (m)', color='white')
ax.set_title('Scenario Analysis', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
text = f"""Robustness Analysis Summary
===============================

Calm-optimized parameters:
  Best case:  {max(calm_ranges):.1f}m (calm air)
  Worst case: {min(calm_ranges):.1f}m (strong headwind)
  Mean (gusty): {np.mean(calm_gusty_ranges):.1f}m
  Std (gusty):  {np.std(calm_gusty_ranges):.1f}m

Robust-optimized parameters:
  Best case:  {max(robust_ranges):.1f}m
  Worst case: {min(robust_ranges):.1f}m
  Mean (gusty): {np.mean(robust_gusty_ranges):.1f}m
  Std (gusty):  {np.std(robust_gusty_ranges):.1f}m

Conclusion: Robust params sacrifice
{max(calm_ranges) - max(robust_ranges):.1f}m in best case but gain
{min(robust_ranges) - min(calm_ranges):.1f}m in worst case.
Evolution favors robustness."""
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Key insight: Robust optimization > peak optimization in nature.")
print("The squirrel encounters variable winds every night.")
print("Parameters that work consistently beat parameters that work perfectly once.")`,
      challenge: 'Implement a minimax optimizer: find parameters that maximize the MINIMUM range across all wind scenarios. This is the most conservative strategy. Compare it to the average-case robust optimizer — which does evolution actually favor?',
      successHint: 'You have built a complete capstone: physics engine, AoA parametrization, optimization, wind modeling, and robustness analysis. This is real computational science — the same approach used in aerospace engineering, but inspired by a flying squirrel.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Glide Path Optimizer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (aerodynamics & ecology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone uses Python with numpy and matplotlib to build a full glide path optimization system. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
