import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import RedSeaCFDDiagram from '../diagrams/RedSeaCFDDiagram';
import RedSeaWindSetdownDiagram from '../diagrams/RedSeaWindSetdownDiagram';
import RedSeaCrossSectionDiagram from '../diagrams/RedSeaCrossSectionDiagram';
import RedSeaTideDiagram from '../diagrams/RedSeaTideDiagram';
import BernoulliDiagram from '../diagrams/BernoulliDiagram';
import PressureDepthDiagram from '../diagrams/PressureDepthDiagram';

export default function RedSeaLevel4() {
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
      title: 'Turbulence modelling \u2014 the unsolved problem',
      concept: `Direct simulation of every turbulent eddy (Direct Numerical Simulation, DNS) requires grids so fine that the cost is proportional to **Re\u00b3** \u2014 for Re = 10\u2076, that is 10\u00b9\u2078 grid cells. Impossible for ocean-scale problems.

Instead, engineers use **turbulence models** that approximate the effect of small-scale eddies:
- **k-\u03b5 model**: tracks turbulent kinetic energy (k) and dissipation rate (\u03b5). Two extra transport equations. Most popular in industry.
- **k-\u03c9 model**: better near walls. Used in aerospace.
- **Large Eddy Simulation (LES)**: resolves large eddies, models small ones. Middle ground between DNS and k-\u03b5.

For the Red Sea simulation, a simple eddy viscosity model sufficed because the large-scale flow (wind setdown) dominates. But modeling the turbulent return flow accurately would require at least k-\u03b5.

The code implements a simple mixing-length turbulence model and shows how it affects the velocity profile.`,
      analogy: 'Imagine tracking every raindrop in a thunderstorm (DNS) vs tracking the storm clouds and estimating how much rain each produces (turbulence modeling). The first is exact but impossible. The second captures the big picture accurately, trading micro-detail for tractability. Turbulence models are weather forecasts for fluid flow.',
      storyConnection: 'The returning water after wind cessation would generate intense turbulence \u2014 standing waves, hydraulic jumps, and chaotic vortices. Modeling this accurately requires turbulence models. The NCAR study focused on the setdown phase (mostly laminar/steady), but a full simulation of the return event would need LES or similar.',
      checkQuestion: 'Why is turbulence often called "the last great unsolved problem of classical physics"?',
      checkAnswer: 'Because despite 180 years of study, we have no general analytical solution to turbulent flow. We know the equations (Navier-Stokes), but they are nonlinear and chaotic \u2014 tiny changes in initial conditions lead to completely different flow patterns. We can simulate turbulence numerically, but we cannot predict it analytically. Even defining what "turbulence" IS precisely remains debated.',
      codeIntro: 'Implement a mixing-length turbulence model for channel flow.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Channel flow with mixing-length turbulence model
H = 2.0  # depth (m)
ny = 200
y = np.linspace(0, H, ny)
dy = y[1] - y[0]

mu = 1.08e-3       # molecular viscosity
rho = 1025
tau_surface = 1.44  # wind stress (Pa)
kappa = 0.41        # von Karman constant

# Mixing length: l = kappa * y (near wall), capped at 0.09*H
l_mix = np.minimum(kappa * y, 0.09 * H)

# Solve for velocity profile iteratively
u = np.zeros(ny)
u_prev = np.ones(ny)

for iteration in range(1000):
    # Velocity gradient
    dudy = np.gradient(u, dy)

    # Eddy viscosity: nu_t = l^2 * |du/dy|
    nu_t = l_mix**2 * np.abs(dudy)

    # Effective viscosity
    nu_eff = mu / rho + nu_t

    # Solve: d/dy(nu_eff * du/dy) = -tau/(rho*H)
    for j in range(1, ny - 1):
        u[j] = 0.5 * (u[j+1] + u[j-1]) + 0.5 * dy**2 * tau_surface / (rho * H * max(nu_eff[j], 1e-6))

    # Boundary conditions
    u[0] = 0  # no-slip at seabed
    # Free surface: du/dy = tau/(mu) at top
    u[-1] = u[-2] + dy * tau_surface / (rho * max(nu_eff[-1], 1e-6))

    if np.max(np.abs(u - u_prev)) < 1e-6:
        break
    u_prev = u.copy()

# Laminar profile for comparison
u_laminar = tau_surface / mu * y

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(u / np.max(u), y, linewidth=2.5, color='#ef4444', label='Turbulent (mixing-length)')
ax1.plot(u_laminar / np.max(u_laminar), y, '--', linewidth=2, color='#3b82f6', label='Laminar')
ax1.set_xlabel('Normalized velocity', fontsize=10)
ax1.set_ylabel('Height (m)', fontsize=10)
ax1.set_title('Velocity Profile: Laminar vs Turbulent', fontsize=12)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)

ax2.plot(nu_t * 1000, y, linewidth=2.5, color='#8b5cf6')
ax2.fill_betweenx(y, nu_t * 1000, alpha=0.15, color='#8b5cf6')
ax2.axvline(mu/rho * 1000, color='#3b82f6', linewidth=1.5, linestyle='--',
            label=f'Molecular viscosity')
ax2.set_xlabel('Eddy viscosity (mm\u00b2/s)', fontsize=10)
ax2.set_ylabel('Height (m)', fontsize=10)
ax2.set_title('Eddy Viscosity Profile', fontsize=12)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("Turbulent profile is much FLATTER than laminar:")
print("  Turbulent mixing redistributes momentum across the channel")
print("  Laminar profile is linear (all transport by molecular viscosity)")
print()
print(f"Eddy viscosity at mid-depth: {nu_t[ny//2]*1000:.1f} mm\u00b2/s")
print(f"Molecular viscosity: {mu/rho*1000:.4f} mm\u00b2/s")
print(f"Ratio: {nu_t[ny//2]/(mu/rho):.0f}x \u2014 turbulence dominates!")`,
      challenge: 'Research the k-\u03b5 model. What are the two transport equations it solves? How does it improve on the mixing-length model? List one advantage and one disadvantage of each.',
      successHint: 'Turbulence modeling is where CFD becomes an art as well as a science. The choice of turbulence model \u2014 k-\u03b5, k-\u03c9, LES, or DNS \u2014 depends on the problem, the required accuracy, and the available computing power. There is no one-size-fits-all solution.',
    },
    {
      title: 'Adaptive mesh refinement \u2014 resolution where it matters',
      concept: `A uniform grid wastes cells in regions where nothing interesting happens (open sea) and lacks resolution where physics is complex (near the ridge, at the coast).

**Adaptive Mesh Refinement (AMR)** solves this by using a coarse grid initially and automatically refining it wherever the solution has large gradients (rapid changes in velocity, pressure, or water level).

For the Red Sea problem:
- Open sea: 1 km cells (nothing happening)
- Near ridge: 50 m cells (where exposure occurs)
- At ridge edge: 10 m cells (sharp water-land boundary)

This can reduce the total cell count by 10\u201350\u00d7 compared to a uniform fine grid, while maintaining accuracy where it matters.

The code demonstrates AMR by detecting gradients and refining the grid.`,
      analogy: 'A photographer uses auto-focus: the camera puts maximum resolution (sharpness) on the subject\u2019s face and lets the background blur. AMR does the same for simulations \u2014 maximum computational resolution on the interesting physics, coarse resolution on the boring parts.',
      storyConnection: 'If you wanted to simulate the exact moment the ridge becomes exposed \u2014 the boundary between dry and wet \u2014 you need extremely fine resolution at that boundary. AMR would automatically place its finest cells right along the waterline, tracking it as it retreats and then rushes back.',
      checkQuestion: 'If AMR reduces cell count by 20\u00d7, does the simulation run 20\u00d7 faster?',
      checkAnswer: 'Not quite. AMR adds overhead: detecting where to refine, managing the multi-resolution grid, and interpolating between coarse and fine regions. Practical speedup is typically 5\u201315\u00d7 (not the full 20\u00d7). Also, the CFL condition is set by the finest cells, so the timestep is determined by the smallest cell size. Still, a 5\u201315\u00d7 speedup is enormous \u2014 turning a month-long simulation into a few days.',
      codeIntro: 'Demonstrate adaptive mesh refinement on a 1D water level problem.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D seabed + water surface
x_fine = np.linspace(0, 50, 1000)  # fine reference grid (km)

# Seabed
bed = -10 + 8 * np.exp(-((x_fine - 25) / 3)**2)

# Water surface (after wind setdown — drops near ridge)
surface = -0.5 * np.exp(-((x_fine - 25) / 5)**2)

# Gradient magnitude (used for AMR criteria)
gradient = np.abs(np.gradient(surface, x_fine[1] - x_fine[0]))

# AMR: refine where gradient is high
threshold_1 = 0.03  # first refinement level
threshold_2 = 0.08  # second refinement level

# Assign resolution levels
level = np.zeros_like(x_fine, dtype=int)
level[gradient > threshold_1] = 1
level[gradient > threshold_2] = 2

# Simulate cell sizes
cell_sizes = np.where(level == 0, 1.0, np.where(level == 1, 0.25, 0.0625))

fig, axes = plt.subplots(3, 1, figsize=(12, 8), sharex=True)

# Seabed + surface
axes[0].fill_between(x_fine, bed, -12, alpha=0.3, color='#92400e', label='Seabed')
axes[0].plot(x_fine, bed, linewidth=2, color='#92400e')
axes[0].plot(x_fine, surface, linewidth=2, color='#3b82f6', label='Water surface')
axes[0].axhline(0, color='silver', linewidth=1, linestyle='--')
axes[0].set_ylabel('Elevation (m)', fontsize=10)
axes[0].set_title('Adaptive Mesh Refinement (AMR)', fontsize=13)
axes[0].legend(fontsize=9)
axes[0].grid(alpha=0.3)

# Gradient
axes[1].plot(x_fine, gradient, linewidth=2, color='#f97316')
axes[1].fill_between(x_fine, gradient, alpha=0.1, color='#f97316')
axes[1].axhline(threshold_1, color='#10b981', linewidth=1, linestyle='--', label=f'Level 1 threshold')
axes[1].axhline(threshold_2, color='#ef4444', linewidth=1, linestyle='--', label=f'Level 2 threshold')
axes[1].set_ylabel('|gradient|', fontsize=10)
axes[1].legend(fontsize=9)
axes[1].grid(alpha=0.3)

# Resolution map
colors_map = {0: '#3b82f6', 1: '#10b981', 2: '#ef4444'}
for lv in [0, 1, 2]:
    mask = level == lv
    label = ['Coarse (1 km)', 'Medium (250 m)', 'Fine (62 m)'][lv]
    axes[2].scatter(x_fine[mask], np.ones(np.sum(mask)) * lv, c=colors_map[lv],
                    s=2, label=label)
axes[2].set_ylabel('Refinement level', fontsize=10)
axes[2].set_xlabel('Position (km)', fontsize=10)
axes[2].set_yticks([0, 1, 2])
axes[2].set_yticklabels(['Coarse', 'Medium', 'Fine'])
axes[2].legend(fontsize=9)
axes[2].grid(alpha=0.3)

plt.tight_layout()
plt.show()

n_coarse = np.sum(level == 0)
n_medium = np.sum(level == 1)
n_fine = np.sum(level == 2)
total_uniform = len(x_fine)
total_amr = n_coarse / 16 + n_medium / 4 + n_fine  # effective cell count
print(f"Uniform fine grid: {total_uniform} cells")
print(f"AMR equivalent: ~{total_amr:.0f} cells")
print(f"Reduction: {total_uniform / total_amr:.1f}x fewer cells")
print()
print("Fine resolution ONLY where the physics demands it (near the ridge).")
print("Open sea uses coarse cells \u2014 nothing interesting happening there.")`,
      challenge: 'Implement AMR in the 2D simulation from Level 3. Start with a 20\u00d720 grid and refine cells where |gradient(h)| exceeds a threshold. Compare the result to a uniform 80\u00d780 grid.',
      successHint: 'AMR is one of the most powerful tools in modern CFD. It enables simulations of problems that would be impossible with uniform grids \u2014 from galaxy formation to blood flow in arteries to, yes, wind setdown in the Gulf of Suez.',
    },
    {
      title: 'Validation \u2014 how do we know the simulation is correct?',
      concept: `A simulation is only as good as its validation. The NCAR team validated their Red Sea model against:

1. **Analytical solutions**: For simple test cases (uniform wind over flat bottom), the simulation must match the known exact solution.
2. **Tide gauge data**: Comparison with measured tides at stations in the Gulf of Suez.
3. **Satellite altimetry**: Sea surface heights measured by satellites.
4. **Historical records**: The model should reproduce known wind setdown events (e.g., Lake Erie wind setdown events are well-documented).

Validation quantifies the **error**: if measured tide height is 1.05 m and the model predicts 1.12 m, the error is 7 cm (6.7%). Published CFD studies typically report these errors.

The code demonstrates validation by comparing a numerical solution to an exact analytical solution.`,
      analogy: 'Before trusting a new scale (your simulation), you weigh something whose weight you already know (a reference mass). If the scale reads 1.02 kg for a 1.00 kg mass, you know its error is 2%. You then correct for this and trust it for unknown weights. Validation is weighing the known mass.',
      storyConnection: 'The NCAR study validated against Lake Erie wind setdown events (where water drops 2+ metres at the western end during strong east winds \u2014 well-documented since the 1940s). The model reproduced Lake Erie accurately before being applied to the Gulf of Suez. This gives confidence in the Red Sea results.',
      checkQuestion: 'Can a simulation ever be "proven correct"?',
      checkAnswer: 'No. Validation can show a model matches observations within some error bound, but it cannot prove the model is correct for all conditions. A model might work perfectly for wind speeds 40\u201370 mph but fail at 80 mph due to physics it does not capture (wave breaking, spray generation). This is why scientists report "validated for conditions X" rather than "proven correct." All models are approximations.',
      codeIntro: 'Validate a numerical shallow water solver against an exact analytical solution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Analytical solution for wind setdown over flat bottom:
# eta(x) = tau * (x - L/2) / (rho * g * h)
# where eta = surface displacement, tau = wind stress

rho = 1025
g = 9.81
h0 = 3.0      # depth (m)
tau = 1.44     # wind stress (Pa)
L = 50000      # domain length (m)

# Analytical solution
x_exact = np.linspace(0, L, 1000)
eta_exact = tau * (x_exact - L/2) / (rho * g * h0)

# Numerical solution (Lax-Friedrichs, same as Level 2)
for nx in [20, 50, 100, 200]:
    dx = L / nx
    dt = 2.0
    x_num = np.linspace(0, L, nx)
    h = h0 * np.ones(nx)
    u = np.zeros(nx)

    for step in range(5000):
        h_new = h.copy()
        u_new = u.copy()
        for i in range(1, nx-1):
            h_new[i] = 0.5*(h[i+1]+h[i-1]) - dt/(2*dx)*(h[i+1]*u[i+1]-h[i-1]*u[i-1])
            slope = (h[i+1] - h[i-1]) / (2*dx)
            u_new[i] = 0.5*(u[i+1]+u[i-1]) - dt*g*slope + dt*tau/(rho*max(h[i],0.1))
        h = np.maximum(0.1, h_new)
        u = u_new

    eta_num = h - h0

    if nx == 200:
        plt.figure(figsize=(10, 5))
        plt.plot(x_exact/1000, eta_exact*100, linewidth=2.5, color='#10b981',
                 label='Analytical (exact)')

# Run all resolutions and plot
plt.figure(figsize=(12, 6))
plt.plot(x_exact/1000, eta_exact*100, linewidth=3, color='#10b981', label='Exact solution')

errors = []
resolutions = [20, 50, 100, 200]
colors = ['#ef4444', '#f97316', '#8b5cf6', '#3b82f6']

for nx, color in zip(resolutions, colors):
    dx = L / nx
    dt = 2.0
    x_num = np.linspace(0, L, nx)
    h = h0 * np.ones(nx)
    u = np.zeros(nx)

    for step in range(5000):
        h_new = h.copy()
        u_new = u.copy()
        for i in range(1, nx-1):
            h_new[i] = 0.5*(h[i+1]+h[i-1]) - dt/(2*dx)*(h[i+1]*u[i+1]-h[i-1]*u[i-1])
            slope = (h[i+1] - h[i-1]) / (2*dx)
            u_new[i] = 0.5*(u[i+1]+u[i-1]) - dt*g*slope + dt*tau/(rho*max(h[i],0.1))
        h = np.maximum(0.1, h_new)
        u = u_new

    eta_num = h - h0
    eta_interp = np.interp(x_exact, x_num, eta_num)
    error = np.sqrt(np.mean((eta_interp - eta_exact)**2)) * 100  # cm
    errors.append(error)

    plt.plot(x_num/1000, eta_num*100, '--', linewidth=1.5, color=color,
             label=f'nx={nx} (err={error:.2f} cm)')

plt.xlabel('Position (km)', fontsize=11)
plt.ylabel('Surface displacement (cm)', fontsize=11)
plt.title('Validation: Numerical vs Analytical Solution', fontsize=13)
plt.legend(fontsize=9)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print("Convergence:")
for nx, err in zip(resolutions, errors):
    print(f"  nx = {nx:4d}: error = {err:.3f} cm")
print()
print("More grid cells \u2192 smaller error \u2192 closer to exact solution")
print("This is how we KNOW the simulation is working correctly.")`,
      challenge: 'Plot error vs 1/dx on a log-log scale. What is the convergence rate (slope)? For a second-order scheme, the slope should be ~2 (error halves when you double the resolution).',
      successHint: 'Validation gives us quantified confidence. Without it, a simulation is just a pretty picture. With it, the simulation becomes a scientific tool. The NCAR team\u2019s validation is what makes their Red Sea result credible.',
    },
    {
      title: 'Monte Carlo uncertainty \u2014 probabilistic predictions',
      concept: `Real-world inputs (wind speed, ridge depth, tidal phase) are never known exactly. They have **uncertainty**. Monte Carlo simulation handles this by running the model thousands of times, each with slightly different inputs drawn from probability distributions.

Instead of asking "does the ridge get exposed at 63 mph?", we ask "what is the **probability** of the ridge being exposed, given that wind speed is 63 \u00b1 10 mph?"

The procedure:
1. Define probability distributions for each uncertain input
2. Draw random samples from each distribution
3. Run the model for each sample
4. Collect all results and compute statistics (mean, 95% confidence interval, probability of exposure)

This transforms a deterministic "yes/no" answer into a probabilistic "85% likely" answer.`,
      analogy: 'Imagine predicting the outcome of 1000 cricket matches. Each match has random elements (toss, weather, player form). You cannot predict any single match, but you can predict that Team A wins ~60% of them. Monte Carlo works the same way: run the "match" (simulation) 1000 times with random variations and count how often you get the desired outcome.',
      storyConnection: 'How likely is the Red Sea crossing scenario? Monte Carlo gives us a number. If we know the statistical distributions of wind events and tidal conditions in the Gulf of Suez, we can estimate how often the combination needed for ridge exposure actually occurs. Is it once per century? Once per millennium? Monte Carlo can estimate this.',
      checkQuestion: 'If you run 10,000 Monte Carlo samples and 8,500 produce ridge exposure, what is the probability of exposure? What is the 95% confidence interval on this probability?',
      checkAnswer: 'Probability = 8500/10000 = 85%. The 95% confidence interval for a binomial proportion is approximately p \u00b1 1.96\u221a(p(1-p)/n) = 0.85 \u00b1 1.96\u221a(0.85\u00d70.15/10000) = 0.85 \u00b1 0.007 = [84.3%, 85.7%]. With 10,000 samples, we know the probability to within \u00b10.7%.',
      codeIntro: 'Run a Monte Carlo simulation of the Red Sea crossing scenario.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
n_samples = 5000

# Uncertain parameters (drawn from distributions)
# Wind speed: mean 63 mph, std 15 mph (strong gale to hurricane range)
wind_mph = np.random.normal(63, 15, n_samples)
wind_ms = wind_mph / 2.237

# Ridge depth: mean 2.0 m, std 0.5 m (bathymetric uncertainty)
ridge_depth = np.random.normal(2.0, 0.5, n_samples)
ridge_depth = np.maximum(0.5, ridge_depth)  # can't be negative

# Tidal contribution: uniform between 0.1 and 0.4 m
tide_drop = np.random.uniform(0.1, 0.4, n_samples)

# Wind duration: mean 12 hours, std 3 hours
duration = np.random.normal(12, 3, n_samples)
duration = np.maximum(2, duration)

# Calculate setdown for each sample
rho_air = 1.225
Cd = 1.5e-3
g = 9.81
rho_water = 1025
fetch = 50000

# Wind setdown (capped by duration effect — assumes full setdown at 12h)
duration_factor = np.minimum(1.0, duration / 12)
wind_setdown = rho_air * Cd * wind_ms**2 * fetch / (g * ridge_depth * rho_water)
total_drop = wind_setdown * duration_factor + tide_drop

# Does the ridge get exposed?
exposed = total_drop >= ridge_depth
prob = np.mean(exposed)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Wind speed distribution
axes[0,0].hist(wind_mph, bins=50, color='#f97316', alpha=0.7, edgecolor='white')
axes[0,0].axvline(63, color='white', linewidth=2, linestyle='--', label='Mean (63 mph)')
axes[0,0].set_xlabel('Wind speed (mph)', fontsize=10)
axes[0,0].set_title('Wind Speed Distribution', fontsize=11)
axes[0,0].legend(fontsize=9)

# Ridge depth
axes[0,1].hist(ridge_depth, bins=50, color='#8b5cf6', alpha=0.7, edgecolor='white')
axes[0,1].axvline(2.0, color='white', linewidth=2, linestyle='--', label='Mean (2.0 m)')
axes[0,1].set_xlabel('Ridge depth (m)', fontsize=10)
axes[0,1].set_title('Ridge Depth Uncertainty', fontsize=11)
axes[0,1].legend(fontsize=9)

# Total setdown vs ridge depth scatter
colors = ['#10b981' if e else '#ef4444' for e in exposed]
axes[1,0].scatter(wind_mph, total_drop, c=colors, s=2, alpha=0.5)
axes[1,0].axhline(2.0, color='silver', linewidth=1, linestyle='--')
axes[1,0].set_xlabel('Wind speed (mph)', fontsize=10)
axes[1,0].set_ylabel('Total water drop (m)', fontsize=10)
axes[1,0].set_title(f'Green = exposed, Red = submerged  (P = {prob:.1%})', fontsize=11)

# Probability as function of wind speed
wind_bins = np.linspace(30, 100, 30)
probs = []
for lo, hi in zip(wind_bins[:-1], wind_bins[1:]):
    mask = (wind_mph >= lo) & (wind_mph < hi)
    if np.sum(mask) > 10:
        probs.append(np.mean(exposed[mask]))
    else:
        probs.append(np.nan)

axes[1,1].plot(wind_bins[:-1] + np.diff(wind_bins)/2, probs,
               linewidth=2.5, color='#06b6d4', marker='o', markersize=4)
axes[1,1].set_xlabel('Wind speed (mph)', fontsize=10)
axes[1,1].set_ylabel('Probability of exposure', fontsize=10)
axes[1,1].set_title('Exposure Probability vs Wind Speed', fontsize=11)
axes[1,1].axhline(0.5, color='silver', linewidth=1, linestyle='--')
axes[1,1].grid(alpha=0.3)

plt.suptitle(f'Monte Carlo Analysis: {n_samples} Simulations', fontsize=14)
plt.tight_layout()
plt.show()

print(f"Results from {n_samples} Monte Carlo samples:")
print(f"  Probability of ridge exposure: {prob:.1%}")
print(f"  Mean total drop: {np.mean(total_drop):.2f} m")
print(f"  95% CI of total drop: [{np.percentile(total_drop, 2.5):.2f}, {np.percentile(total_drop, 97.5):.2f}] m")
print()
print(f"At wind > 55 mph: exposure probability = {np.mean(exposed[wind_mph > 55]):.1%}")
print(f"At wind > 70 mph: exposure probability = {np.mean(exposed[wind_mph > 70]):.1%}")`,
      challenge: 'Add correlation between wind speed and duration (strong winds tend to last longer). Use a bivariate normal distribution. How does this change the exposure probability?',
      successHint: 'Monte Carlo transforms engineering from "will this work?" to "how likely is this to work?" This probabilistic thinking is essential in risk assessment, weather prediction, financial modeling, and historical science.',
    },
    {
      title: 'Dimensional analysis and scaling laws',
      concept: `Before running expensive simulations, physicists use **dimensional analysis** to understand which variables matter and how they scale.

The **Buckingham \u03a0 theorem** states: if a physical problem involves n variables and k fundamental dimensions (mass, length, time), it can be described by n-k dimensionless groups.

For wind setdown:
- Variables: wind stress (\u03c4), depth (h), fetch (L), gravity (g), density (\u03c1)
- That is 5 variables with 3 dimensions (M, L, T)
- So we need 5-3 = 2 dimensionless groups

\u03a0\u2081 = \u0394h/h (relative setdown)
\u03a0\u2082 = \u03c4L/(\u03c1gh\u00b2) (wind forcing ratio)

The universal scaling law: **\u0394h/h = f(\u03c4L/\u03c1gh\u00b2)**

This single relationship tells us everything about wind setdown WITHOUT solving any differential equations. If we know \u03a0\u2082, we know \u03a0\u2081.`,
      analogy: 'Before building a full-size bridge, engineers test a 1/100 scale model. Dimensional analysis tells them which measurements on the small model translate exactly to the full bridge, and which need correction. It is the science of knowing what to scale and what stays the same.',
      storyConnection: 'Dimensional analysis tells us that \u0394h/h depends on \u03c4L/(\u03c1gh\u00b2). For the Red Sea: \u03c4 = 1.44 Pa, L = 50 km, h = 2 m, \u03c1 = 1025 kg/m\u00b3. \u03a0\u2082 = 1.44 \u00d7 50000 / (1025 \u00d7 9.81 \u00d7 4) = 1.79. Since \u03a0\u2082 > 1, the setdown exceeds the depth \u2014 the ridge is exposed. One number answers the question.',
      codeIntro: 'Derive and plot the universal scaling law for wind setdown.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Universal scaling: Delta_h/h vs tau*L/(rho*g*h^2)
# From simplified setdown formula: Delta_h = tau*L/(rho*g*h)
# So Delta_h/h = tau*L/(rho*g*h^2) = Pi_2

Pi2 = np.linspace(0, 3, 200)
Pi1 = Pi2  # from the simplified linear theory

plt.figure(figsize=(10, 6))
plt.plot(Pi2, Pi1, linewidth=3, color='#3b82f6', label='Linear theory: \u0394h/h = \u03c4L/\u03c1gh\u00b2')
plt.fill_between(Pi2, Pi1, alpha=0.1, color='#3b82f6')
plt.axhline(1.0, color='#ef4444', linewidth=2, linestyle='--',
            label='Full exposure (\u0394h = h)')
plt.axvline(1.0, color='#ef4444', linewidth=1, linestyle=':', alpha=0.5)

# Plot specific scenarios
scenarios = [
    ('Red Sea (63 mph, 2m)', 1.44 * 50000 / (1025 * 9.81 * 4)),
    ('Lake Erie event', 1.0 * 300000 / (1000 * 9.81 * 25)),
    ('Bathtub model', 0.1 * 0.3 / (1000 * 9.81 * 0.0004)),
]

colors = ['gold', '#10b981', '#f97316']
for (label, pi2), color in zip(scenarios, colors):
    pi1 = pi2
    plt.plot(pi2, pi1, 'o', color=color, markersize=10, zorder=5)
    plt.annotate(f'{label}\\n\u03a0\u2082 = {pi2:.2f}',
                 xy=(pi2, pi1), xytext=(pi2 + 0.15, pi1 + 0.2),
                 fontsize=9, color=color,
                 arrowprops=dict(arrowstyle='->', color=color))

plt.xlabel('\u03a0\u2082 = \u03c4L/(\u03c1gh\u00b2)  [Wind forcing ratio]', fontsize=12)
plt.ylabel('\u03a0\u2081 = \u0394h/h  [Relative setdown]', fontsize=12)
plt.title('Universal Scaling Law for Wind Setdown', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.xlim(0, 3)
plt.ylim(0, 3)
plt.tight_layout()
plt.show()

print("The universal curve tells us EVERYTHING:")
print()
print("  If \u03a0\u2082 < 1: Partial setdown (ridge still submerged)")
print("  If \u03a0\u2082 = 1: Full exposure (setdown equals depth)")
print("  If \u03a0\u2082 > 1: Complete drainage (water removed entirely)")
print()
for label, pi2 in scenarios:
    status = "EXPOSED" if pi2 >= 1 else "submerged"
    print(f"  {label}: \u03a0\u2082 = {pi2:.2f} \u2192 {status}")`,
      challenge: 'Use dimensional analysis to predict wind setdown on Mars (atmosphere: \u03c1 = 0.02 kg/m\u00b3, wind = 30 m/s, over a 1-metre-deep hypothetical lake). Would Martian winds create significant setdown? Why or why not?',
      successHint: 'Dimensional analysis is the physicist\u2019s shortcut. Before running any simulation, a quick \u03a0 calculation can tell you whether the phenomenon is even possible. For the Red Sea, \u03a0\u2082 > 1 \u2014 wind setdown exceeds the depth. That single number encapsulates everything we learned across all four levels.',
    },
    {
      title: 'Capstone \u2014 from ancient story to modern science',
      concept: `Let us step back and see the complete journey:

**Level 1**: Tides, wind setdown, pressure, gravity waves \u2014 the basic physics of the Red Sea crossing.

**Level 2**: Conservation laws (mass, momentum, energy), Reynolds number, shear stress \u2014 the fundamental equations of fluid dynamics.

**Level 3**: Navier-Stokes equations, finite differences, CFL condition, boundary conditions, 2D CFD \u2014 the tools of computational science.

**Level 4**: Turbulence, AMR, validation, Monte Carlo, dimensional analysis \u2014 the advanced methods that make real-world predictions possible.

From a 3,000-year-old story, you have learned the entire framework of computational fluid dynamics. Every concept \u2014 tidal forces, wind stress, the Navier-Stokes equations, turbulence models, mesh refinement, uncertainty quantification \u2014 is used daily by thousands of engineers and scientists worldwide.

The final code brings everything together in one comprehensive simulation.`,
      analogy: 'You started by watching a river and asking "why does the water move?" You now understand the equations governing that motion, can write code to simulate it, know how to check whether your simulation is trustworthy, and can quantify uncertainty. You have gone from observer to scientist.',
      storyConnection: 'The parting of the Red Sea is not just a story. It is a problem in fluid dynamics that was solved using modern computational methods. Whether the event happened exactly as described, or approximately, or metaphorically \u2014 the physics is real, testable, and beautiful. Every great story contains science waiting to be discovered.',
      checkQuestion: 'If you had to design the definitive simulation of the Red Sea crossing, what would your computational setup look like? Grid resolution, turbulence model, boundary conditions, validation strategy, uncertainty quantification?',
      checkAnswer: 'Grid: AMR with base 1 km, refined to 10 m at the ridge, covering the northern Gulf of Suez (~100 km \u00d7 30 km). Turbulence: k-\u03b5 for the return flow, no explicit model for the setdown phase. BCs: real bathymetry, tidal forcing at open boundaries, wind stress from reanalysis data. Validation: against Lake Erie wind setdown records and Gulf of Suez tide gauges. Uncertainty: Monte Carlo with 10,000 samples varying wind speed, direction, duration, ridge depth, and tidal phase. Run on a GPU cluster.',
      codeIntro: 'Build the complete model: wind setdown, exposure, and return \u2014 all in one simulation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Complete Red Sea Crossing Simulator
# Phase 1: Wind builds over 12 hours
# Phase 2: Full setdown for 4 hours
# Phase 3: Wind stops, water returns

nx = 200
L = 50000
dx = L / nx
g = 9.81
rho = 1025
dt = 2.0

x = np.linspace(0, L, nx)

# Bathymetry
bed = -10 + 8 * np.exp(-((x - L/2) / 3000)**2)

# Initial conditions
h = np.maximum(0.1, -bed)
u = np.zeros(nx)

# Simulation phases
phases = [
    ("Wind building", 12 * 3600, lambda t: 1.44 * min(1, t / (8*3600))),
    ("Full setdown", 4 * 3600, lambda t: 1.44),
    ("Wind stops", 2 * 3600, lambda t: 1.44 * max(0, 1 - t / 600)),
]

results = []
total_time = 0

for phase_name, duration, wind_fn in phases:
    n_steps = int(duration / dt)
    for step in range(n_steps):
        t_phase = step * dt
        tau = wind_fn(t_phase)

        h_new = h.copy()
        u_new = u.copy()
        for i in range(1, nx-1):
            h_new[i] = 0.5*(h[i+1]+h[i-1]) - dt/(2*dx)*(h[i+1]*u[i+1]-h[i-1]*u[i-1])
            slope = ((bed[i+1]+h[i+1])-(bed[i-1]+h[i-1]))/(2*dx)
            u_new[i] = 0.5*(u[i+1]+u[i-1]) - dt*g*slope + dt*tau/(rho*max(h[i],0.1))
        h = np.maximum(0.05, h_new)
        u = u_new

        if step % (n_steps // 3) == 0 or step == n_steps - 1:
            surface = bed + h
            results.append((total_time + t_phase, phase_name, surface.copy()))

    total_time += duration

# Plot key moments
fig, axes = plt.subplots(2, 3, figsize=(15, 8))
indices = [0, len(results)//4, len(results)//2,
           3*len(results)//4, -2, -1]
titles = ['Start', 'Wind building', 'Peak setdown',
          'Full exposure', 'Wind stopping', 'Water returned']
colors_phase = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

for ax, idx, title, color in zip(axes.flat, indices, titles, colors_phase):
    t, phase, surface = results[idx]
    ax.fill_between(x/1000, bed, -12, alpha=0.3, color='#92400e')
    ax.plot(x/1000, bed, linewidth=1.5, color='#92400e')
    ax.plot(x/1000, surface, linewidth=2, color=color)
    ax.fill_between(x/1000, bed, surface, where=(surface > bed), alpha=0.2, color=color)
    ax.axhline(0, color='silver', linewidth=0.5, linestyle='--')
    ax.set_title(f'{title} (t={t/3600:.1f}h)', fontsize=10)
    ax.set_ylim(-12, 2)
    ax.grid(alpha=0.2)

axes[1,0].set_xlabel('km', fontsize=9)
axes[1,1].set_xlabel('km', fontsize=9)
axes[1,2].set_xlabel('km', fontsize=9)
axes[0,0].set_ylabel('Elevation (m)', fontsize=9)
axes[1,0].set_ylabel('Elevation (m)', fontsize=9)

plt.suptitle('The Parting of the Red Sea \u2014 Complete Fluid Dynamics Simulation', fontsize=14)
plt.tight_layout()
plt.show()

print("=== Complete Timeline ===")
print("  0-12h:  East wind builds \u2192 water pushed from ridge")
print("  12-16h: Full setdown \u2192 ridge EXPOSED (crossing window)")
print("  16h:    Wind stops \u2192 water returns in ~20 minutes")
print()
print("From an ancient story to a peer-reviewed CFD simulation.")
print("Physics does not prove or disprove faith \u2014")
print("but it does show that the natural world is extraordinary.")`,
      challenge: 'This is your capstone project. Add improvements of your choice: (a) 2D grid, (b) Monte Carlo uncertainty on wind, (c) AMR near the ridge, (d) turbulence model for the return phase. Present your results as a scientific poster.',
      successHint: 'You have completed a full journey through computational fluid dynamics. From tides to Navier-Stokes to Monte Carlo, you now have the foundational knowledge used by climate scientists, aerospace engineers, and computational physicists worldwide. The Red Sea was your textbook \u2014 the equations are your tools for everything that flows.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced CFD, turbulence, and scientific validation</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises involve advanced CFD simulations. Click to start Python.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={[RedSeaCFDDiagram, RedSeaCrossSectionDiagram, RedSeaWindSetdownDiagram, RedSeaTideDiagram, BernoulliDiagram, PressureDepthDiagram][i] ? createElement([RedSeaCFDDiagram, RedSeaCrossSectionDiagram, RedSeaWindSetdownDiagram, RedSeaTideDiagram, BernoulliDiagram, PressureDepthDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
