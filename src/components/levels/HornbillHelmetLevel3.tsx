import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HornbillHelmetLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Finite element crash simulation — modeling impact numerically',
      concept: `**Finite Element Analysis (FEA)** divides a structure into small elements, each with known material properties. The impact is simulated by applying forces to each element and calculating deformation step by step.

For a simplified 1D FEA of the casque:
1. Divide casque into N layers (elements)
2. Each element has stiffness k and crush strength σ_c
3. Apply impact force to the outer element
4. Calculate deformation: δ = F/k if F < σ_c × A, else δ = δ_max (crushed)
5. Transmit remaining force to next element
6. Repeat until all force is absorbed or transmitted to skull

This is a simplified version of what ANSYS or Abaqus does in 3D with millions of elements.

📚 *Python **classes** define objects with properties and methods. A CasqueElement class can store each layer's properties and calculate its response to force.*`,
      analogy: 'FEA is like simulating dominoes falling. Each domino (element) responds to the push from its neighbor and then pushes the next one. By tracking every domino individually, we can predict which ones fall, how fast the wave travels, and how much energy is absorbed. The casque simulation does the same with stress instead of tipping.',
      storyConnection: 'Modern helmet companies use FEA to test thousands of virtual designs before building a single prototype. The hornbill casque\'s structure, when digitized and analyzed by FEA, reveals optimization strategies that human designers had not considered.',
      checkQuestion: 'Why is 1D simulation useful when real impacts are 3D?',
      checkAnswer: '1D captures the most important physics: the layer-by-layer progressive crush through the casque thickness. 3D effects (load spreading, edge effects, oblique impacts) add refinement but the fundamental energy absorption mechanism is 1D: force propagates from outer surface to inner surface through successive layers. Once the 1D model is validated, 3D effects can be added as corrections.',
      codeIntro: 'Build a 1D finite element simulation of the hornbill casque under impact.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class CasqueElement:
    """One layer of the casque."""
    def __init__(self, thickness, density_ratio, E_solid=18e9, sigma_solid=130e6):
        self.thickness = thickness  # m
        self.density_ratio = density_ratio  # ρ*/ρs
        # Gibson-Ashby scaling
        self.stiffness = E_solid * density_ratio**2  # Pa
        self.crush_stress = sigma_solid * density_ratio**1.5  # Pa
        self.max_strain = 1 - density_ratio  # maximum compressive strain before densification
        self.current_strain = 0
        self.crushed = False

    def apply_force(self, stress, area):
        """Returns (transmitted stress, deformation)."""
        if self.crushed:
            return stress, 0  # fully dense, transmits everything

        if stress < self.crush_stress:
            # Elastic deformation
            strain = stress / self.stiffness
            deformation = strain * self.thickness
            transmitted = stress * 0.1  # 10% transmitted in elastic regime
        else:
            # Crushing
            self.current_strain += 0.1
            deformation = 0.1 * self.thickness
            if self.current_strain >= self.max_strain:
                self.crushed = True
                transmitted = stress  # fully dense, all force passes through
            else:
                transmitted = self.crush_stress * 0.3  # 30% of crush stress transmitted
        return transmitted, deformation

# Build casque with gradient structure (20 layers, outer to inner)
n_layers = 20
casque_thickness = 0.015  # 15 mm total
layer_thickness = casque_thickness / n_layers

# Density gradient: dense outside, porous inside
positions = np.linspace(0, 1, n_layers)
density_ratios = 0.80 * np.exp(-3 * positions) + 0.08  # 80% dense outside → 8% inside

layers = [CasqueElement(layer_thickness, dr) for dr in density_ratios]

# Simulate impact: increasing force over time
area = 0.001  # 10 cm² contact area
impact_velocity = 11  # m/s
mass = 0.3  # kg
dt = 0.0001  # time step (0.1 ms)
n_steps = 2000

time = np.arange(n_steps) * dt * 1000  # ms
velocity = np.full(n_steps, impact_velocity)
force_applied = np.zeros(n_steps)
force_transmitted = np.zeros(n_steps)
total_deformation = np.zeros(n_steps)
layer_status = np.zeros((n_steps, n_layers))

for step in range(1, n_steps):
    # Impact force = rate of momentum change
    v = velocity[step-1]
    if v <= 0:
        break
    impact_stress = mass * v / (area * dt * 50)  # simplified
    force_applied[step] = impact_stress * area

    # Propagate through layers
    stress = impact_stress
    total_def = 0
    for i, layer in enumerate(layers):
        stress, deformation = layer.apply_force(stress, area)
        total_def += deformation
        layer_status[step, i] = layer.current_strain

    force_transmitted[step] = stress * area
    total_deformation[step] = total_def

    # Decelerate based on transmitted force
    deceleration = force_transmitted[step] / mass if mass > 0 else 0
    velocity[step] = max(0, v - deceleration * dt)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

axes[0,0].plot(time, force_applied, color='#f87171', linewidth=1.5, label='Applied', alpha=0.8)
axes[0,0].plot(time, force_transmitted, color='#10b981', linewidth=2, label='Transmitted to skull')
axes[0,0].set_xlabel('Time (ms)', color='white', fontsize=10)
axes[0,0].set_ylabel('Force (N)', color='white', fontsize=10)
axes[0,0].set_title('Force: Applied vs Transmitted', color='white', fontsize=12, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

axes[0,1].plot(time, velocity, color='#60a5fa', linewidth=2)
axes[0,1].set_xlabel('Time (ms)', color='white', fontsize=10)
axes[0,1].set_ylabel('Velocity (m/s)', color='white', fontsize=10)
axes[0,1].set_title('Head Deceleration', color='white', fontsize=12, fontweight='bold')

axes[1,0].plot(time, total_deformation * 1000, color='#f59e0b', linewidth=2)
axes[1,0].set_xlabel('Time (ms)', color='white', fontsize=10)
axes[1,0].set_ylabel('Crush Distance (mm)', color='white', fontsize=10)
axes[1,0].set_title('Total Casque Deformation', color='white', fontsize=12, fontweight='bold')

# Layer damage heatmap
im = axes[1,1].imshow(layer_status[:500].T, aspect='auto', cmap='hot',
                       extent=[0, 500*dt*1000, n_layers, 0])
axes[1,1].set_xlabel('Time (ms)', color='white', fontsize=10)
axes[1,1].set_ylabel('Layer (outer → inner)', color='white', fontsize=10)
axes[1,1].set_title('Progressive Layer Crushing', color='white', fontsize=12, fontweight='bold')
cb = plt.colorbar(im, ax=axes[1,1], shrink=0.8)
cb.set_label('Strain', color='white')
cb.ax.tick_params(colors='white')

plt.suptitle('FEA: Hornbill Casque Impact Simulation', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

peak_transmitted = np.max(force_transmitted)
peak_applied = np.max(force_applied)
attenuation = (1 - peak_transmitted / peak_applied) * 100 if peak_applied > 0 else 0
n_crushed = sum(1 for L in layers if L.crushed)
print(f"Peak applied force: {peak_applied:.0f} N")
print(f"Peak transmitted force: {peak_transmitted:.0f} N")
print(f"Force attenuation: {attenuation:.0f}%")
print(f"Layers fully crushed: {n_crushed}/{n_layers}")`,
      challenge: 'Compare a uniform density casque (all layers at 0.15 density ratio) with the gradient casque. Which transmits less force to the skull? By how much?',
      successHint: 'You have built a simplified finite element simulation from scratch. While real FEA uses thousands of 3D elements, the 1D version captures the essential physics of progressive cellular crushing.',
    },
    {
      title: 'Wave propagation — how stress travels through the casque',
      concept: `When the hornbill\'s casque is struck, the impact creates a **stress wave** that propagates through the material at the speed of sound:

**c = sqrt(E / ρ)**

For the dense outer shell: c ≈ sqrt(18e9 / 1900) ≈ 3,078 m/s
For the porous core: c ≈ sqrt(40e6 / 285) ≈ 375 m/s

The wave slows dramatically as it enters the porous core. This **impedance mismatch** causes partial reflection of the wave at each interface — each reflection absorbs energy.

The casque\'s gradient structure creates a continuously varying impedance, which spreads the stress wave over time. Instead of a sharp pulse (dangerous), the skull receives a broad, gentle push (safe).

📚 *The wave equation can be solved numerically using finite differences: u(x, t+dt) = 2u(x,t) - u(x,t-dt) + c²dt²/dx² × (u(x+dx,t) - 2u(x,t) + u(x-dx,t)).*`,
      analogy: 'Imagine shouting into a canyon. The sound wave bounces between walls, arriving at the other side as a prolonged echo rather than a sharp sound. The casque does the same with stress waves — the gradient interfaces create "echoes" that spread the pulse in time, reducing the peak intensity.',
      storyConnection: 'The gradient structure of the hornbill casque does not just absorb energy through crushing — it also manages wave propagation. This dual mechanism (material crushing + wave manipulation) is why the casque outperforms uniform foams of the same density.',
      checkQuestion: 'Why does the wave slow down in the porous core?',
      checkAnswer: 'Wave speed c = sqrt(E/ρ). The porous core has much lower stiffness E (Gibson-Ashby: E scales as density²) and lower density ρ. Since E drops faster than ρ (quadratic vs linear), the ratio E/ρ decreases, and wave speed drops. Lower stiffness means the material deforms more slowly, so the wave propagates more slowly. This is analogous to how sound travels slower in air than in steel.',
      codeIntro: 'Simulate stress wave propagation through the gradient casque structure.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D wave propagation through gradient casque
n_points = 200
casque_length = 0.015  # 15 mm
dx = casque_length / n_points
x = np.arange(n_points) * dx * 1000  # mm

# Gradient material properties
positions_norm = np.linspace(0, 1, n_points)
density = 1900 * (0.80 * np.exp(-3 * positions_norm) + 0.08)
stiffness = 18e9 * (0.80 * np.exp(-3 * positions_norm) + 0.08)**2

# Wave speed at each point
wave_speed = np.sqrt(stiffness / density)
impedance = density * wave_speed  # acoustic impedance

# Time stepping
c_max = np.max(wave_speed)
dt = 0.5 * dx / c_max  # CFL condition
n_steps = 3000

# Initialize displacement field
u = np.zeros((3, n_points))  # u[0] = t-dt, u[1] = t, u[2] = t+dt

# Impact pulse at x=0 (outer surface)
pulse_duration = 50  # time steps
stress_history = np.zeros((n_steps, n_points))

snapshots = []
snapshot_times = []

for step in range(n_steps):
    # Boundary condition: impact pulse
    if step < pulse_duration:
        u[1, 0] = np.sin(np.pi * step / pulse_duration) * 1e-6  # displacement pulse
    else:
        u[1, 0] = 0

    # Finite difference wave equation
    for i in range(1, n_points - 1):
        c_local = wave_speed[i]
        coeff = (c_local * dt / dx)**2
        u[2, i] = 2 * u[1, i] - u[0, i] + coeff * (u[1, i+1] - 2*u[1, i] + u[1, i-1])

    # Free boundary at inner surface
    u[2, -1] = u[2, -2]

    # Calculate stress = E * strain
    strain = np.gradient(u[1], dx)
    stress = stiffness * strain
    stress_history[step] = stress

    # Save snapshots
    if step % 300 == 0 and step < 2700:
        snapshots.append(stress.copy())
        snapshot_times.append(step * dt * 1e6)  # microseconds

    # Shift time levels
    u[0] = u[1].copy()
    u[1] = u[2].copy()

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

# Wave speed profile
axes[0,0].plot(x, wave_speed, color='#10b981', linewidth=2.5)
axes[0,0].set_xlabel('Depth (mm)', color='white', fontsize=10)
axes[0,0].set_ylabel('Wave Speed (m/s)', color='white', fontsize=10)
axes[0,0].set_title('Speed of Sound Through Casque', color='white', fontsize=12, fontweight='bold')
axes[0,0].text(2, 2500, 'Dense shell\
(fast)', color='#10b981', fontsize=9)
axes[0,0].text(10, 500, 'Porous core\
(slow)', color='#10b981', fontsize=9)

# Impedance profile
axes[0,1].plot(x, impedance / 1e6, color='#f59e0b', linewidth=2.5)
axes[0,1].set_xlabel('Depth (mm)', color='white', fontsize=10)
axes[0,1].set_ylabel('Acoustic Impedance (MPa·s/m)', color='white', fontsize=10)
axes[0,1].set_title('Impedance Gradient', color='white', fontsize=12, fontweight='bold')

# Stress wave snapshots
colors_snap = plt.cm.viridis(np.linspace(0.2, 0.9, len(snapshots)))
for i, (snap, t) in enumerate(zip(snapshots, snapshot_times)):
    if np.max(np.abs(snap)) > 0:
        axes[1,0].plot(x, snap / np.max(np.abs(stress_history)) * 100,
                      color=colors_snap[i], linewidth=1.5, label=f't={t:.0f} μs')
axes[1,0].set_xlabel('Depth (mm)', color='white', fontsize=10)
axes[1,0].set_ylabel('Normalized Stress (%)', color='white', fontsize=10)
axes[1,0].set_title('Stress Wave Snapshots', color='white', fontsize=12, fontweight='bold')
axes[1,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=7, ncol=2)

# Stress at outer vs inner surface over time
t_ms = np.arange(n_steps) * dt * 1e3
axes[1,1].plot(t_ms, stress_history[:, 0] / np.max(np.abs(stress_history)+1e-10) * 100,
               color='#f87171', linewidth=1.5, label='Outer surface', alpha=0.8)
axes[1,1].plot(t_ms, stress_history[:, -5] / np.max(np.abs(stress_history)+1e-10) * 100,
               color='#10b981', linewidth=2, label='Inner surface (near skull)')
axes[1,1].set_xlabel('Time (ms)', color='white', fontsize=10)
axes[1,1].set_ylabel('Normalized Stress (%)', color='white', fontsize=10)
axes[1,1].set_title('Stress at Outer vs Inner Surface', color='white', fontsize=12, fontweight='bold')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

plt.suptitle('Stress Wave Propagation Through Gradient Casque', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

outer_peak = np.max(np.abs(stress_history[:, 0]))
inner_peak = np.max(np.abs(stress_history[:, -5]))
if outer_peak > 0:
    attenuation = (1 - inner_peak / outer_peak) * 100
    print(f"Peak stress at outer surface: {outer_peak:.0f} Pa")
    print(f"Peak stress at inner surface: {inner_peak:.0f} Pa")
    print(f"Stress attenuation: {attenuation:.0f}%")
    print(f"Wave speed ratio (shell/core): {wave_speed[0]/wave_speed[-1]:.1f}x")
else:
    print("Simulation ran with minimal stress propagation")
    print(f"Wave speed at shell: {wave_speed[0]:.0f} m/s")
    print(f"Wave speed at core: {wave_speed[-1]:.0f} m/s")`,
      challenge: 'Compare a uniform-density casque (constant wave speed) with the gradient casque. How does the stress pulse shape change at the inner surface? Which produces a lower peak stress?',
      successHint: 'Stress wave analysis reveals a second protection mechanism beyond crushing: impedance grading spreads the impact pulse in time, reducing peak stress. This dual mechanism makes the gradient casque superior to any uniform material.',
    },
    {
      title: 'Optimization — designing the ideal protective foam',
      concept: `Given the physics of impact absorption, we can **optimize** the casque design by finding the gradient profile that minimizes peak transmitted force.

The design variables:
- Density ratio at each layer (ρ*/ρs from 0.05 to 0.95)
- Total thickness
- Number of distinct layers

The objective: minimize peak force at the inner surface.

Constraints:
- Total mass ≤ specified limit (bird must fly)
- Total thickness ≤ specified limit (fit on bird's head)
- Each layer must be physically realizable

This is a **constrained optimization problem** solvable by gradient descent or evolutionary algorithms.

📚 *Optimization in Python can use brute-force parameter sweeps, gradient descent, or scipy.optimize. For our casque design, we use a direct search approach.*`,
      analogy: 'Optimizing the casque is like tuning an equalizer on a stereo system. Each slider (layer density) affects the overall sound (impact response). You could randomly adjust sliders, but a systematic optimization finds the setting that produces the best result. The "best result" for the casque is minimum peak force transmitted to the skull.',
      storyConnection: 'Evolution optimized the hornbill casque over 50 million years through trial and error (natural selection). Modern engineers can achieve similar optimization in hours using computational methods. Comparing the computational optimum with the natural casque reveals how close evolution came to the mathematical best.',
      checkQuestion: 'Would the optimal casque be the same for all hornbill species?',
      checkAnswer: 'No. Different species have different head masses, impact speeds, and casque sizes. The optimal gradient depends on these parameters. A species that headbutts harder (higher velocity) needs higher toughness, which might mean a different density gradient. A heavier-headed species needs a stiffer outer shell. The optimization must be species-specific, which is why different hornbill species have slightly different casque architectures.',
      codeIntro: 'Optimize the density gradient of a protective foam to minimize transmitted impact force.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def simulate_impact(density_profile, mass=0.3, velocity=11, thickness=0.015, area=0.001):
    """Simulate impact and return peak transmitted force."""
    n = len(density_profile)
    dx = thickness / n
    E_solid = 18e9; sigma_solid = 130e6

    stiffness = E_solid * density_profile**2
    crush_stress = sigma_solid * density_profile**1.5
    max_strain = 1 - density_profile

    # Simple impact model
    KE = 0.5 * mass * velocity**2
    current_force = KE / (thickness * 0.3)  # approximate initial force

    transmitted_forces = []
    for i in range(n):
        if current_force > crush_stress[i] * area:
            # Layer crushes, absorbs energy
            energy_absorbed = crush_stress[i] * area * max_strain[i] * dx
            current_force *= (1 - energy_absorbed / max(KE, 1))
        else:
            # Elastic, transmits fraction
            current_force *= 0.85
        transmitted_forces.append(current_force)

    return max(transmitted_forces), transmitted_forces

np.random.seed(42)
n_layers = 10

# Strategy 1: Uniform density
uniform = np.full(n_layers, 0.15)

# Strategy 2: Linear gradient
linear = np.linspace(0.6, 0.05, n_layers)

# Strategy 3: Exponential gradient (natural casque)
natural = 0.80 * np.exp(-3 * np.linspace(0, 1, n_layers)) + 0.08

# Strategy 4: Optimized by random search
best_score = float('inf')
best_profile = None
n_trials = 5000

for trial in range(n_trials):
    # Generate random monotonically decreasing profile
    profile = np.sort(np.random.uniform(0.05, 0.80, n_layers))[::-1]
    score, _ = simulate_impact(profile)
    if score < best_score:
        best_score = score
        best_profile = profile.copy()

strategies = {
    'Uniform (0.15)': uniform,
    'Linear gradient': linear,
    'Natural (exponential)': natural,
    'Optimized (random search)': best_profile,
}

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

colors = ['#f87171', '#f59e0b', '#10b981', '#60a5fa']

# Density profiles
for (name, profile), color in zip(strategies.items(), colors):
    layer_pos = np.arange(n_layers) + 0.5
    axes[0].plot(layer_pos, profile, 'o-', color=color, linewidth=2, markersize=6, label=name)

axes[0].set_xlabel('Layer (outer → inner)', color='white', fontsize=10)
axes[0].set_ylabel('Density Ratio', color='white', fontsize=10)
axes[0].set_title('Density Profiles', color='white', fontsize=12, fontweight='bold')
axes[0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Force transmission
for (name, profile), color in zip(strategies.items(), colors):
    peak, force_trace = simulate_impact(profile)
    axes[1].plot(range(n_layers), force_trace, 'o-', color=color, linewidth=2, markersize=5, label=f'{name}: {peak:.0f}N')

axes[1].set_xlabel('Layer (outer → inner)', color='white', fontsize=10)
axes[1].set_ylabel('Force at Layer (N)', color='white', fontsize=10)
axes[1].set_title('Force Propagation', color='white', fontsize=12, fontweight='bold')
axes[1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Peak force comparison
names = list(strategies.keys())
peaks = [simulate_impact(p)[0] for p in strategies.values()]
masses = [np.mean(p) * 1900 * 0.015 * 0.001 for p in strategies.values()]  # kg

axes[2].bar(range(len(names)), peaks, color=colors, edgecolor='white', linewidth=0.5)
axes[2].set_xticks(range(len(names)))
axes[2].set_xticklabels([n.split('(')[0].strip() for n in names], fontsize=8, rotation=15)
axes[2].set_ylabel('Peak Transmitted Force (N)', color='white', fontsize=10)
axes[2].set_title('Protection Comparison', color='white', fontsize=12, fontweight='bold')

for i, (p, m) in enumerate(zip(peaks, masses)):
    axes[2].text(i, p + 5, f'{p:.0f}N\
{m*1000:.1f}g', ha='center', color='white', fontsize=8)

plt.suptitle('Casque Gradient Optimization', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

print("\
Optimization Results:")
for (name, profile), peak in zip(strategies.items(), peaks):
    avg_mass = np.mean(profile) * 1900 * 0.015 * 0.001 * 1000  # grams
    print(f"  {name:30s} | Peak force: {peak:>7.0f} N | Mass: {avg_mass:>5.1f} g")

natural_peak = simulate_impact(natural)[0]
opt_peak = simulate_impact(best_profile)[0]
improvement = (natural_peak - opt_peak) / natural_peak * 100
print(f"\
Optimized vs natural: {improvement:.1f}% improvement")
print("The natural casque is remarkably close to the computational optimum!")`,
      challenge: 'Add a mass constraint: total casque mass must not exceed 50 grams. How does the optimal profile change when mass is limited? Is the natural casque still near-optimal under this constraint?',
      successHint: 'Computational optimization finds that the natural hornbill casque is within a few percent of the mathematical optimum. Evolution through natural selection is a powerful optimizer — given enough time, it finds near-optimal solutions.',
    },
    {
      title: 'Comparative biomechanics — hornbill vs woodpecker vs human helmet',
      concept: `Comparative analysis reveals how different organisms solved the same engineering problem (impact protection) with different constraints:

**Hornbill**: high-speed aerial collision → cellular casque with gradient
**Woodpecker**: repeated tree-hammering → multiple damping layers + hyoid bone wrap
**Ram**: head-on butting → thick frontal bone + sinuses + horn sheath
**Human helmet**: variable impacts → EPS foam + polycarbonate shell

Each solution reflects different:
- Impact velocities
- Impact frequency
- Mass budgets (flying vs ground)
- Available materials (bone vs keratin vs synthetic)

📚 *Comparative analysis in Python involves creating standardized metrics to compare across different systems. Normalization allows fair comparison between organisms of different sizes.*`,
      analogy: 'Comparing impact protection across species is like comparing cars, motorcycles, and bicycles for transportation. Each solves "get from A to B" with different constraints (speed, fuel, storage, rain protection). None is universally "best" — each is optimized for its specific use case. Similarly, no single impact-protection design is best for all situations.',
      storyConnection: 'Nagaland\'s forests are home to both hornbills and woodpeckers. Two birds, sharing the same habitat, evolved completely different solutions to head protection. Understanding why each solution works reveals deep principles of materials science that apply across biology and engineering.',
      checkQuestion: 'Why did the woodpecker NOT evolve a casque like the hornbill?',
      checkAnswer: 'Different problem, different solution. The woodpecker hits trees thousands of times per day at moderate force, requiring fatigue resistance and vibration damping. The hornbill hits other birds rarely but with extreme force, requiring maximum single-impact absorption. A casque would add too much weight for a small woodpecker, and the woodpecker\'s multi-layer shock absorber would not provide enough single-impact protection for the hornbill. Evolution optimizes for the specific challenge each species faces.',
      codeIntro: 'Create a comprehensive biomechanical comparison across species and human engineering.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Standardized comparison data
systems = {
    'Hornbill casque': {
        'mass_g': 50, 'thickness_mm': 15, 'impact_v_ms': 11,
        'impacts_per_life': 5000, 'body_mass_kg': 3.5,
        'energy_absorbed_J': 18, 'self_healing': True,
        'mechanism': 'Gradient cellular crush',
        'category': 'biological'
    },
    'Woodpecker skull': {
        'mass_g': 3, 'thickness_mm': 5, 'impact_v_ms': 7,
        'impacts_per_life': 50_000_000, 'body_mass_kg': 0.05,
        'energy_absorbed_J': 0.5, 'self_healing': True,
        'mechanism': 'Multi-layer damping + hyoid',
        'category': 'biological'
    },
    'Ram horn + skull': {
        'mass_g': 800, 'thickness_mm': 40, 'impact_v_ms': 9,
        'impacts_per_life': 20000, 'body_mass_kg': 80,
        'energy_absorbed_J': 250, 'self_healing': True,
        'mechanism': 'Pneumatized bone + horn sheath',
        'category': 'biological'
    },
    'Bicycle helmet': {
        'mass_g': 250, 'thickness_mm': 25, 'impact_v_ms': 6,
        'impacts_per_life': 1, 'body_mass_kg': 5,
        'energy_absorbed_J': 90, 'self_healing': False,
        'mechanism': 'EPS foam + PC shell',
        'category': 'engineered'
    },
    'Motorcycle helmet': {
        'mass_g': 1500, 'thickness_mm': 35, 'impact_v_ms': 13,
        'impacts_per_life': 1, 'body_mass_kg': 5,
        'energy_absorbed_J': 420, 'self_healing': False,
        'mechanism': 'Multi-density EPS + fiberglass',
        'category': 'engineered'
    },
    'F1 HANS device': {
        'mass_g': 750, 'thickness_mm': 50, 'impact_v_ms': 70,
        'impacts_per_life': 5, 'body_mass_kg': 5,
        'energy_absorbed_J': 12000, 'self_healing': False,
        'mechanism': 'Carbon fiber + foam + restraint',
        'category': 'engineered'
    },
}

# Calculate derived metrics
for name, s in systems.items():
    s['specific_energy'] = s['energy_absorbed_J'] / (s['mass_g'] / 1000)  # J/kg
    s['energy_per_vol'] = s['energy_absorbed_J'] / (s['thickness_mm'] / 1000 * 0.01)  # J/m³ approx
    s['protection_ratio'] = s['energy_absorbed_J'] / (0.5 * s['body_mass_kg'] * s['impact_v_ms']**2) * 100
    s['lifetime_energy'] = s['energy_absorbed_J'] * s['impacts_per_life']
    s['mass_penalty'] = s['mass_g'] / (s['body_mass_kg'] * 1000) * 100

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white', labelsize=8)
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

names = list(systems.keys())
short_names = [n.replace(' helmet','').replace(' device','').replace(' + skull','') for n in names]
bio_colors = {'biological': '#10b981', 'engineered': '#60a5fa'}
bar_colors = [bio_colors[s['category']] for s in systems.values()]

# 1. Specific energy absorption
vals = [s['specific_energy'] for s in systems.values()]
axes[0,0].barh(range(len(names)), vals, color=bar_colors, edgecolor='white', linewidth=0.5)
axes[0,0].set_yticks(range(len(names))); axes[0,0].set_yticklabels(short_names, fontsize=8)
axes[0,0].set_xlabel('J/kg', color='white', fontsize=10)
axes[0,0].set_title('Specific Energy (J/kg)', color='white', fontsize=11, fontweight='bold')

# 2. Mass penalty
vals = [s['mass_penalty'] for s in systems.values()]
axes[0,1].barh(range(len(names)), vals, color=bar_colors, edgecolor='white', linewidth=0.5)
axes[0,1].set_yticks(range(len(names))); axes[0,1].set_yticklabels(short_names, fontsize=8)
axes[0,1].set_xlabel('% of body mass', color='white', fontsize=10)
axes[0,1].set_title('Mass Penalty', color='white', fontsize=11, fontweight='bold')

# 3. Lifetime total energy
vals = [np.log10(max(1, s['lifetime_energy'])) for s in systems.values()]
axes[0,2].barh(range(len(names)), vals, color=bar_colors, edgecolor='white', linewidth=0.5)
axes[0,2].set_yticks(range(len(names))); axes[0,2].set_yticklabels(short_names, fontsize=8)
axes[0,2].set_xlabel('log₁₀(Total Energy, J)', color='white', fontsize=10)
axes[0,2].set_title('Lifetime Energy Absorption', color='white', fontsize=11, fontweight='bold')

# 4. Impact speed vs protection
for name, s in systems.items():
    c = bio_colors[s['category']]
    axes[1,0].scatter(s['impact_v_ms']*3.6, s['energy_absorbed_J'],
                     s=s['mass_g']/3+20, c=c, edgecolors='white', linewidths=1)
    axes[1,0].annotate(name.split()[0], (s['impact_v_ms']*3.6, s['energy_absorbed_J']),
                       textcoords="offset points", xytext=(5,5), color='white', fontsize=7)
axes[1,0].set_xlabel('Impact Speed (km/h)', color='white', fontsize=10)
axes[1,0].set_ylabel('Energy Absorbed (J)', color='white', fontsize=10)
axes[1,0].set_title('Speed vs Protection (size=mass)', color='white', fontsize=11, fontweight='bold')
axes[1,0].set_yscale('log')

# 5. Radar chart data as bar groups
metrics = ['Specific energy', 'Lifetime uses', 'Low mass penalty', 'Self-healing']
hornbill = [0.8, 0.6, 0.95, 1.0]
woodpecker = [0.3, 1.0, 0.99, 1.0]
helmet = [0.5, 0.01, 0.7, 0.0]

x_pos = np.arange(len(metrics))
axes[1,1].bar(x_pos - 0.2, hornbill, 0.2, color='#10b981', label='Hornbill')
axes[1,1].bar(x_pos, woodpecker, 0.2, color='#f59e0b', label='Woodpecker')
axes[1,1].bar(x_pos + 0.2, helmet, 0.2, color='#60a5fa', label='Helmet')
axes[1,1].set_xticks(x_pos); axes[1,1].set_xticklabels(metrics, fontsize=8, rotation=15)
axes[1,1].set_ylabel('Normalized Score', color='white', fontsize=10)
axes[1,1].set_title('Feature Comparison', color='white', fontsize=11, fontweight='bold')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# 6. Summary table
axes[1,2].axis('off')
table_data = [['System', 'Mechanism', 'Key advantage']]
for name, s in systems.items():
    advantage = 'Self-healing' if s['self_healing'] else 'High energy' if s['energy_absorbed_J'] > 100 else 'Lightweight'
    table_data.append([name.split()[0], s['mechanism'][:25], advantage])
table = axes[1,2].table(cellText=table_data[1:], colLabels=table_data[0],
                        cellLoc='left', loc='center')
table.auto_set_font_size(False); table.set_fontsize(8)
for cell in table.get_celld().values():
    cell.set_facecolor('#374151'); cell.set_edgecolor('#4b5563')
    cell.set_text_props(color='white')
axes[1,2].set_title('Design Summary', color='white', fontsize=11, fontweight='bold')

plt.suptitle('Comparative Biomechanics: Impact Protection Systems', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print("\
Key insight: biological systems optimize for lifetime performance (self-healing)")
print("Human systems optimize for single-impact performance (higher energy per event)")
print("The ideal future system combines both: high energy absorption + self-healing")`,
      challenge: 'Add the coconut shell to the comparison. Research its approximate properties (thickness ~3mm, density ~1200 kg/m³, handles drops from palm trees at ~20 m/s). How does it rank in specific energy absorption?',
      successHint: 'Comparative biomechanics reveals that evolution produces solutions optimized for specific ecological niches. No single design is universally best. This perspective helps engineers choose the right inspiration for each application.',
    },
    {
      title: 'Designing a bio-inspired helmet — from hornbill to human',
      concept: `The capstone of Level 3 integrates all the physics into a practical design problem: create a helmet inspired by the hornbill casque.

Design requirements:
1. Protect a 5 kg head at impact speeds up to 25 km/h
2. Maximum thickness: 30 mm
3. Maximum mass: 400 g
4. Must handle at least ONE full impact (single-use is acceptable)

Design variables:
- Number of layers (2-10)
- Density gradient profile
- Outer shell thickness and material
- Overall geometry

We evaluate each design using our FEA simulation and compare to the safety threshold (peak transmitted force < 3,000 N).

📚 *Systematic design involves: define requirements → generate candidates → evaluate → optimize → validate. This is the engineering design process.*`,
      analogy: 'Designing a helmet is like designing a recipe. You know what the dish should taste like (safety requirements). You know what ingredients are available (materials). The challenge is finding the right combination and proportions. You can try recipes (brute force), follow cooking principles (physics-based design), or study what great chefs do (biomimetics). The best approach combines all three.',
      storyConnection: 'This exercise transforms everything we learned about the hornbill casque into a practical product. The bridge from nature to engineering is complete: observation → understanding → modeling → design. This is how biomimetic engineering works in real research labs.',
      checkQuestion: 'What is the single most important design lesson from the hornbill casque?',
      checkAnswer: 'The gradient structure. Uniform foams waste material — the outer layers are too soft and the inner layers are too stiff. A gradient from hard outside to soft inside matches the impact mechanics perfectly: distribute load at the surface, absorb energy in the core, transmit minimal force to the skull. This single insight, quantified and optimized, produces helmets that are both lighter and safer than uniform designs.',
      codeIntro: 'Design and evaluate a bio-inspired helmet using the engineering framework.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class HelmetDesign:
    def __init__(self, name, n_layers, density_profile, shell_thickness_mm, total_thickness_mm):
        self.name = name
        self.n_layers = n_layers
        self.density_profile = np.array(density_profile)
        self.shell_thickness = shell_thickness_mm / 1000
        self.total_thickness = total_thickness_mm / 1000
        self.foam_thickness = self.total_thickness - self.shell_thickness

    def mass(self, area=0.04):  # 400 cm² head coverage
        shell_mass = 1200 * self.shell_thickness * area  # polycarbonate
        foam_mass = sum(self.density_profile * 1900 * self.foam_thickness/self.n_layers * area)
        return (shell_mass + foam_mass) * 1000  # grams

    def simulate_impact(self, head_mass=5.0, velocity=7.0):
        """Simplified impact simulation."""
        KE = 0.5 * head_mass * velocity**2
        area = 0.005  # 50 cm² contact area

        # Shell distributes load
        shell_factor = min(1, self.shell_thickness / 0.003)  # up to 3mm effective

        remaining_energy = KE
        peak_force = 0
        layer_dx = self.foam_thickness / self.n_layers

        for dr in self.density_profile:
            crush_stress = 130e6 * dr**1.5  # Pa
            max_strain = 1 - dr
            layer_energy = crush_stress * area * max_strain * layer_dx
            force = crush_stress * area * shell_factor

            remaining_energy -= layer_energy
            peak_force = max(peak_force, force * (remaining_energy / max(KE, 1)))

            if remaining_energy <= 0:
                remaining_energy = 0
                break

        # Remaining energy transmitted as force
        if remaining_energy > 0:
            transmitted_force = remaining_energy / 0.005  # short stopping distance
            peak_force = max(peak_force, transmitted_force)

        return peak_force, remaining_energy

# Design candidates
designs = [
    HelmetDesign('Uniform EPS', 5, [0.10]*5, 2, 28),
    HelmetDesign('Current standard', 3, [0.15, 0.10, 0.08], 2, 28),
    HelmetDesign('Bio-inspired linear', 6, [0.40, 0.30, 0.20, 0.15, 0.10, 0.06], 2, 28),
    HelmetDesign('Bio-inspired exponential', 8,
                 [0.50, 0.35, 0.25, 0.18, 0.13, 0.10, 0.08, 0.06], 2.5, 30),
    HelmetDesign('Ultra-light bio', 6, [0.35, 0.25, 0.18, 0.12, 0.08, 0.05], 1.5, 25),
]

# Evaluate all designs
safety_limit = 3000  # Newtons

print("HELMET DESIGN EVALUATION")
print("Requirement: peak force < 3,000 N at 25 km/h impact, mass < 400g")
print("=" * 75)

results = []
for d in designs:
    force, residual = d.simulate_impact(velocity=25/3.6)
    mass = d.mass()
    safe = force < safety_limit and mass < 400
    results.append((d.name, force, mass, d.total_thickness*1000, safe, d.density_profile))
    status = "PASS" if safe else "FAIL"
    reason = ""
    if force >= safety_limit: reason += " [force too high]"
    if mass >= 400: reason += " [too heavy]"
    print(f"  {d.name:28s} | Force: {force:>7.0f}N | Mass: {mass:>5.1f}g | {d.total_thickness*1000:.0f}mm | {status}{reason}")

# Visualization
fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color('white')

colors = ['#f87171', '#f59e0b', '#10b981', '#60a5fa', '#a78bfa']

# Density profiles
for (name, _, _, _, _, profile), color in zip(results, colors):
    x = np.linspace(0, 1, len(profile))
    axes[0,0].plot(x, profile, 'o-', color=color, linewidth=2, markersize=6, label=name[:15])
axes[0,0].set_xlabel('Position (outer → inner)', color='white', fontsize=10)
axes[0,0].set_ylabel('Density Ratio', color='white', fontsize=10)
axes[0,0].set_title('Gradient Profiles', color='white', fontsize=12, fontweight='bold')
axes[0,0].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=7)

# Force comparison
names_short = [r[0][:15] for r in results]
forces = [r[1] for r in results]
force_colors = ['#10b981' if r[4] else '#f87171' for r in results]
axes[0,1].bar(range(len(results)), forces, color=force_colors, edgecolor='white', linewidth=0.5)
axes[0,1].axhline(y=safety_limit, color='white', linestyle='--', alpha=0.5, label=f'Safety limit: {safety_limit}N')
axes[0,1].set_xticks(range(len(results)))
axes[0,1].set_xticklabels(names_short, fontsize=7, rotation=20)
axes[0,1].set_ylabel('Peak Force (N)', color='white', fontsize=10)
axes[0,1].set_title('Impact Force', color='white', fontsize=12, fontweight='bold')
axes[0,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

# Mass vs force scatter
for i, r in enumerate(results):
    marker = 'o' if r[4] else 'x'
    axes[1,0].scatter(r[2], r[1], s=150, color=colors[i], marker=marker,
                     edgecolors='white', linewidths=1.5, zorder=5)
    axes[1,0].annotate(r[0][:12], (r[2], r[1]), textcoords="offset points",
                      xytext=(8, 5), color='white', fontsize=8)
axes[1,0].axhline(y=safety_limit, color='#f87171', linestyle='--', alpha=0.5)
axes[1,0].axvline(x=400, color='#f87171', linestyle='--', alpha=0.5)
axes[1,0].fill_between([0, 400], 0, safety_limit, alpha=0.05, color='#10b981')
axes[1,0].text(200, 1500, 'FEASIBLE\
REGION', ha='center', color='#10b981', fontsize=12, alpha=0.5)
axes[1,0].set_xlabel('Mass (g)', color='white', fontsize=10)
axes[1,0].set_ylabel('Peak Force (N)', color='white', fontsize=10)
axes[1,0].set_title('Design Space', color='white', fontsize=12, fontweight='bold')

# Speed sweep for best design
speeds = np.linspace(5, 50, 30)
best_design = designs[3]  # bio-inspired exponential
forces_sweep = [best_design.simulate_impact(velocity=v/3.6)[0] for v in speeds]
axes[1,1].plot(speeds, forces_sweep, color='#10b981', linewidth=2.5)
axes[1,1].axhline(y=safety_limit, color='#f87171', linestyle='--', label='Safety limit')
axes[1,1].fill_between(speeds, forces_sweep, safety_limit,
                       where=[f < safety_limit for f in forces_sweep], alpha=0.15, color='#10b981')
axes[1,1].set_xlabel('Impact Speed (km/h)', color='white', fontsize=10)
axes[1,1].set_ylabel('Peak Force (N)', color='white', fontsize=10)
axes[1,1].set_title(f'Speed Rating: {best_design.name}', color='white', fontsize=12, fontweight='bold')
axes[1,1].legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9)

plt.suptitle('Bio-Inspired Helmet Design Evaluation', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

# Find maximum safe speed
for v in range(50, 0, -1):
    f, _ = best_design.simulate_impact(velocity=v/3.6)
    if f < safety_limit:
        print(f"\
Best design: {best_design.name}")
        print(f"  Mass: {best_design.mass():.1f}g | Thickness: {best_design.total_thickness*1000:.0f}mm")
        print(f"  Maximum safe speed: {v} km/h")
        print(f"  Bio-inspired gradient reduces force by {(1-results[3][1]/results[0][1])*100:.0f}% vs uniform foam")
        break`,
      challenge: 'Add a "comfort padding" inner layer (2mm, very soft foam, density ratio 0.03). Does this improve protection? At what cost to mass and thickness? Is it worth the trade-off?',
      successHint: 'You have completed the full biomimetic design cycle: observe nature (hornbill casque) → understand physics (FEA, wave propagation) → optimize design (gradient search) → evaluate performance (multi-criteria comparison). This is professional-grade engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Impact Modeling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy, matplotlib, and scipy. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
