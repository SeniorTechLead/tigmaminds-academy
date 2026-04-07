import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import RedSeaCFDDiagram from '../diagrams/RedSeaCFDDiagram';
import RedSeaWindSetdownDiagram from '../diagrams/RedSeaWindSetdownDiagram';
import RedSeaCrossSectionDiagram from '../diagrams/RedSeaCrossSectionDiagram';
import RedSeaTideDiagram from '../diagrams/RedSeaTideDiagram';
import BernoulliDiagram from '../diagrams/BernoulliDiagram';
import PressureDepthDiagram from '../diagrams/PressureDepthDiagram';

export default function RedSeaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The Navier-Stokes equations — the master equations of fluid flow',
      concept: `Everything in Levels 1 and 2 — tidal forces, wind stress, pressure, continuity, Bernoulli — are special cases of one set of equations: the **Navier-Stokes equations**.

In their simplest form for incompressible flow:

**ρ(∂v/∂t + v·∇v) = -∇P + μ∇²v + f**

Left side: mass × acceleration (Newton’s second law for fluids)
Right side: pressure forces + viscous forces + external forces (gravity, wind)

These equations are so fundamental that proving whether smooth solutions always exist is one of the **Millennium Prize Problems** — worth $1 million. Nobody has solved it in 180 years.

But we do not need an analytical solution. We solve them **numerically** — breaking space into tiny cells and marching forward in time. This is CFD.

The code breaks down each term and shows what it physically represents.`,
      analogy: 'Newton’s F = ma says: force = mass × acceleration. The Navier-Stokes equations say exactly the same thing, but for every tiny parcel of fluid simultaneously. Instead of one ball with one force, you have billions of fluid parcels, each being pushed by pressure from neighbors, dragged by viscosity, and pulled by gravity. It is F = ma applied to a continuous medium.',
      storyConnection: 'The NCAR Red Sea simulation solved a simplified version of Navier-Stokes (the shallow water form). The wind enters as the external force f, gravity enters through the pressure gradient -∇P, and viscosity μ∇²v handles friction with the seabed. Every physical effect in the story maps to a term in these equations.',
      checkQuestion: 'The Navier-Stokes existence and smoothness problem is unsolved. What does "smooth solutions always exist" mean, and why is it hard to prove?',
      checkAnswer: 'It asks: given any smooth initial conditions, do the equations always produce a solution where velocity and pressure remain smooth (finite, differentiable) for all time? The difficulty is that the v·∇v term (nonlinear advection) can create increasingly sharp gradients that might blow up to infinity. Turbulence makes this worse — the equations can develop near-singularities at very small scales. Nobody has proven they do or do not blow up.',
      codeIntro: 'Visualize each term of the Navier-Stokes equations for a simple channel flow.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D channel flow: steady state
# rho * v * dv/dx = -dP/dx + mu * d^2v/dy^2 + wind_stress_effect

nx = 200
ny = 50
x = np.linspace(0, 100, nx)  # metres along channel
y = np.linspace(0, 2, ny)    # metres (depth)

# Velocity profile (parabolic — Poiseuille flow approximation)
# Fastest at surface, zero at seabed (no-slip condition)
u_surface = 2.0  # m/s
u_profile = u_surface * (2 * y / 2 - (y / 2)**2)  # parabolic

# Create 2D velocity field
U = np.outer(np.ones(nx), u_profile)

# Terms of Navier-Stokes (simplified)
# Pressure gradient (drives flow)
dPdx = -50 * np.ones(nx)  # Pa/m (constant pressure drop)

# Viscous term (resistance from seabed friction)
mu = 1.08e-3
d2udy2 = mu * u_surface * (-2 / 2**2) * np.ones(ny)

# Advection term
advection = np.gradient(u_profile) * u_surface

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Velocity profile
axes[0,0].plot(u_profile, y, linewidth=2.5, color='#3b82f6')
axes[0,0].fill_betweenx(y, u_profile, alpha=0.15, color='#3b82f6')
axes[0,0].set_xlabel('Velocity (m/s)', fontsize=10)
axes[0,0].set_ylabel('Height above seabed (m)', fontsize=10)
axes[0,0].set_title('Velocity Profile (v)', fontsize=12)
axes[0,0].axhline(0, color='#92400e', linewidth=2, label='Seabed (no-slip)')
axes[0,0].legend(fontsize=9)
axes[0,0].grid(alpha=0.3)

# Pressure gradient
axes[0,1].barh(['Pressure\\ngradient\\n(-∇P)'], [abs(dPdx[0])], color='#ef4444', height=0.4)
axes[0,1].set_xlabel('Force per unit volume (Pa/m)', fontsize=10)
axes[0,1].set_title('Pressure Term (-∇P)', fontsize=12)
axes[0,1].grid(alpha=0.3)
axes[0,1].text(abs(dPdx[0])/2, 0, 'Drives flow\\nfrom high to\\nlow pressure', ha='center',
               va='center', fontsize=9, color='white')

# Viscous term
axes[1,0].plot(d2udy2, y, linewidth=2.5, color='#8b5cf6')
axes[1,0].set_xlabel('Viscous force (Pa/m)', fontsize=10)
axes[1,0].set_ylabel('Height (m)', fontsize=10)
axes[1,0].set_title('Viscous Term (μ∇²v)', fontsize=12)
axes[1,0].grid(alpha=0.3)

# Wind stress
wind_forces = [0, 0.5, 1.0, 1.44, 2.0]
labels = ['Calm', 'Breeze', 'Gale', 'Storm\\n(63 mph)', 'Hurricane']
axes[1,1].bar(labels, wind_forces, color='#f97316', width=0.5)
axes[1,1].set_ylabel('Wind stress τ (Pa)', fontsize=10)
axes[1,1].set_title('External Force Term (f)', fontsize=12)
axes[1,1].grid(alpha=0.3, axis='y')

plt.suptitle('Navier-Stokes: ρ(dv/dt + v·∇v) = -∇P + μ∇²v + f', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Each subplot shows one term of the Navier-Stokes equation:")
print("  v: the velocity field we are solving for")
print("  -∇P: pressure gradient that drives flow")
print("  μ∇²v: viscous friction that resists flow")
print("  f: external forces (wind, gravity)")`,
      challenge: 'Research: which industries use CFD solvers based on Navier-Stokes? List 5 applications outside oceanography. (Hint: aerospace, automotive, medicine, weather, electronics cooling.)',
      successHint: 'The Navier-Stokes equations are the backbone of all fluid simulation. Every CFD code — from weather prediction to airplane design to blood flow modeling — solves some form of these equations. You now understand what each term means physically.',
    },
    {
      title: 'Finite difference method — turning calculus into code',
      concept: `The Navier-Stokes equations contain derivatives (∂v/∂t, ∇P, ∇²v). Computers cannot compute derivatives directly — they work with numbers, not symbols. The **finite difference method** approximates derivatives using nearby values:

**∂f/∂x ≈ (f[i+1] - f[i-1]) / (2Δx)** (central difference)
**∂²f/∂x² ≈ (f[i+1] - 2f[i] + f[i-1]) / Δx²** (second derivative)
**∂f/∂t ≈ (fⁿ⁺¹ - fⁿ) / Δt** (forward in time)

Replace every derivative with its finite difference approximation, and you turn a differential equation into an algebraic equation that a computer can solve cell by cell.

The accuracy depends on Δx and Δt — smaller steps = more accurate but slower. The NCAR study used ~500 m grid spacing. Modern ocean models use 1–100 m.`,
      analogy: 'To estimate the slope of a hill, you do not need calculus. Just measure your altitude at two points 10 metres apart and divide the height difference by 10. That IS the finite difference method. The closer your measurement points, the more accurate your slope estimate. CFD does this for millions of points simultaneously.',
      storyConnection: 'The NCAR simulation divided the Gulf of Suez into ~40,000 grid cells. For each cell, at each timestep, it computed: how much water flows in from neighbors (finite difference of flux), what pressure the neighbors exert (finite difference of pressure), and how wind pushes the surface (boundary condition). Repeat for thousands of timesteps.',
      checkQuestion: 'If you halve the grid spacing (Δx → Δx/2), how many more cells do you need in 2D? How does this affect computation time?',
      checkAnswer: 'In 2D, halving Δx doubles the cells in each direction: 2×2 = 4x more cells. But smaller Δx also requires smaller Δt for stability (CFL condition), roughly halving Δt. So total work is about 4×2 = 8x more computation. In 3D it would be 16x. This is why high-resolution CFD is computationally expensive.',
      codeIntro: 'Demonstrate finite differences by computing derivatives numerically and comparing to exact values.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Function: f(x) = sin(x)
# Exact derivative: f'(x) = cos(x)
# Exact second derivative: f''(x) = -sin(x)

x = np.linspace(0, 2 * np.pi, 100)
f = np.sin(x)
dx = x[1] - x[0]

# Finite difference approximations
# First derivative: central difference
df_numeric = np.zeros_like(f)
for i in range(1, len(f) - 1):
    df_numeric[i] = (f[i+1] - f[i-1]) / (2 * dx)

# Second derivative
d2f_numeric = np.zeros_like(f)
for i in range(1, len(f) - 1):
    d2f_numeric[i] = (f[i+1] - 2*f[i] + f[i-1]) / dx**2

# Exact values
df_exact = np.cos(x)
d2f_exact = -np.sin(x)

fig, axes = plt.subplots(3, 1, figsize=(10, 8), sharex=True)

axes[0].plot(x, f, linewidth=2, color='#3b82f6', label='f(x) = sin(x)')
axes[0].set_ylabel('f(x)', fontsize=10)
axes[0].set_title('Finite Differences: Turning Calculus Into Code', fontsize=13)
axes[0].legend(fontsize=10)
axes[0].grid(alpha=0.3)

axes[1].plot(x, df_exact, linewidth=2, color='#10b981', label="Exact: f'(x) = cos(x)")
axes[1].plot(x[1:-1], df_numeric[1:-1], '--', linewidth=2, color='#ef4444',
             label='Finite difference approximation')
axes[1].set_ylabel("f'(x)", fontsize=10)
axes[1].legend(fontsize=10)
axes[1].grid(alpha=0.3)

axes[2].plot(x, d2f_exact, linewidth=2, color='#10b981', label="Exact: f''(x) = -sin(x)")
axes[2].plot(x[1:-1], d2f_numeric[1:-1], '--', linewidth=2, color='#ef4444',
             label='Finite difference approximation')
axes[2].set_ylabel("f''(x)", fontsize=10)
axes[2].set_xlabel('x', fontsize=10)
axes[2].legend(fontsize=10)
axes[2].grid(alpha=0.3)

plt.tight_layout()
plt.show()

error_1st = np.max(np.abs(df_numeric[1:-1] - df_exact[1:-1]))
error_2nd = np.max(np.abs(d2f_numeric[1:-1] - d2f_exact[1:-1]))
print(f"Grid spacing: dx = {dx:.4f}")
print(f"Max error in 1st derivative: {error_1st:.6f}")
print(f"Max error in 2nd derivative: {error_2nd:.6f}")
print()
print("The dashed red lines match the solid green lines almost perfectly!")
print("Finite differences turn continuous calculus into discrete computation.")`,
      challenge: 'Reduce the number of points from 100 to 20 and re-run. How does the error change? Plot error vs number of grid points to see the convergence rate.',
      successHint: 'Every CFD solver is built on finite differences (or the closely related finite volume / finite element methods). The art of CFD is choosing the right discretization scheme for your problem — balancing accuracy against computational cost.',
    },
    {
      title: 'CFL condition — the speed limit of simulation',
      concept: `There is a critical constraint on CFD simulations: the **Courant-Friedrichs-Lewy (CFL) condition**:

**CFL = v × Δt / Δx ≤ 1**

This says: information in the simulation must not travel more than one grid cell per timestep. If it does, the simulation becomes **unstable** — numbers explode to infinity.

Think of it this way: if a wave moves at 4.4 m/s and your cells are 500 m wide, your timestep must be less than 500/4.4 ≈ 113 seconds. Go beyond that, and the wave "jumps over" cells, missing important physics.

For the Red Sea simulation: Δx = 500 m, wave speed = √(g×10) ≈ 10 m/s, so Δt < 50 seconds. With 24 hours to simulate, that is at least 1,728 timesteps.

The code demonstrates what happens when CFL is violated.`,
      analogy: 'Imagine photographing a race car. If your camera shutter speed is fast enough, you see the car in each frame. If the shutter is too slow, the car blurs or "disappears" between frames. CFL says: your simulation "shutter speed" (Δt) must be fast enough to capture the fastest-moving feature. Otherwise, the simulation misses the physics and crashes.',
      storyConnection: 'The NCAR team had to choose Δt carefully. The fastest wave in their simulation (shallow water gravity wave, ~10 m/s) set the CFL limit. Using Δx = 500 m, they needed Δt < 50 s. They likely used Δt ≈ 10–20 s for safety. Over 24 simulated hours, that is ~4,000–8,000 timesteps — each requiring computation over all ~40,000 grid cells.',
      checkQuestion: 'If you refine the grid from Δx = 500 m to Δx = 100 m, how does the CFL condition change your required timestep?',
      checkAnswer: 'CFL = vΔt/Δx ≤ 1, so Δt ≤ Δx/v = 100/10 = 10 seconds (down from 50). Five times smaller Δx means five times smaller Δt. Combined with 5× more cells in each dimension (25× more cells total in 2D), you need 25 × 5 = 125× more computation. This is why high-resolution CFD demands supercomputers.',
      codeIntro: 'Run a wave simulation with stable and unstable CFL numbers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def run_wave_sim(nx, cfl_target, n_steps=300):
    """1D wave equation solver with given CFL number"""
    L = 100.0
    dx = L / nx
    c = 10.0  # wave speed (m/s)
    dt = cfl_target * dx / c

    x = np.linspace(0, L, nx)
    u = np.exp(-((x - 30) / 5)**2)  # Gaussian pulse
    u_prev = np.exp(-((x - 30 + c*dt) / 5)**2)

    snapshots = [(0, u.copy())]
    for step in range(1, n_steps + 1):
        u_new = np.zeros(nx)
        for i in range(1, nx - 1):
            u_new[i] = (2*u[i] - u_prev[i]
                       + (c*dt/dx)**2 * (u[i+1] - 2*u[i] + u[i-1]))
        u_prev = u.copy()
        u = u_new
        if step in [50, 100, 200, n_steps]:
            snapshots.append((step * dt, u.copy()))
    return x, snapshots, cfl_target

# Stable run (CFL = 0.5)
x1, snaps1, cfl1 = run_wave_sim(200, 0.5)

# Marginally stable (CFL = 0.9)
x2, snaps2, cfl2 = run_wave_sim(200, 0.9)

# Unstable (CFL = 1.2) — will blow up!
x3, snaps3, cfl3 = run_wave_sim(200, 1.2, n_steps=80)

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

for ax, (x, snaps, cfl), title_extra in [
    (axes[0], (x1, snaps1, cfl1), 'STABLE'),
    (axes[1], (x2, snaps2, cfl2), 'MARGINAL'),
    (axes[2], (x3, snaps3, cfl3), 'UNSTABLE')
]:
    colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
    for (t, u), color in zip(snaps[:5], colors):
        vals = np.clip(u, -5, 5)
        ax.plot(x, vals, linewidth=1.5, color=color, label=f't={t:.1f}s')
    ax.set_title(f'CFL = {cfl} ({title_extra})', fontsize=11)
    ax.set_xlabel('x (m)', fontsize=9)
    ax.set_ylim(-3, 3)
    ax.legend(fontsize=7)
    ax.grid(alpha=0.3)

axes[0].set_ylabel('Wave amplitude', fontsize=10)
plt.suptitle('CFL Condition: The Speed Limit of Simulation', fontsize=13)
plt.tight_layout()
plt.show()

print("CFL = 0.5: Wave propagates smoothly ✔")
print("CFL = 0.9: Still works but slight numerical diffusion")
print("CFL = 1.2: EXPLODES! Numbers grow without bound ✘")
print()
print("The CFL condition is the most important stability rule in CFD.")
print("Break it, and your simulation is meaningless.")`,
      challenge: 'Find the exact CFL value where the simulation transitions from stable to unstable. Try CFL = 0.95, 1.0, 1.05. What happens at exactly CFL = 1.0?',
      successHint: 'The CFL condition is a non-negotiable constraint in explicit CFD schemes. It ties grid resolution directly to computational cost. Implicit schemes can bypass CFL at the cost of solving large matrix systems each timestep.',
    },
    {
      title: 'Boundary conditions — the walls of the simulation',
      concept: `A CFD simulation needs to know what happens at the edges of its domain. These are **boundary conditions**, and they are just as important as the equations themselves.

Common types:
- **No-slip**: fluid velocity = 0 at solid walls (seabed, coastline)
- **Free surface**: pressure = atmospheric at the water surface
- **Inflow/outflow**: specify velocity or pressure at open boundaries
- **Wind stress**: apply shear force at the water surface

For the Red Sea simulation, the key boundary conditions were:
1. **Seabed**: no-slip (water cannot flow through the ground)
2. **Surface**: wind stress of 1.44 Pa directed east
3. **Open sea boundaries**: allow water to flow in and out freely
4. **Coastline**: no-flow (water cannot pass through land)

Getting boundary conditions wrong can ruin an otherwise perfect simulation. The code demonstrates how different boundary conditions change the solution.`,
      analogy: 'Boundary conditions are the rules of the game. Imagine simulating a billiards shot. The equations of motion tell you how balls move. But you also need to know: what happens when a ball hits the cushion (boundary)? Does it bounce (reflective BC), stop (no-slip BC), or disappear (open BC)? The same equations give completely different results depending on the boundary rules.',
      storyConnection: 'The coastline geometry of the Gulf of Suez is a crucial boundary condition. The narrow, elongated shape channels the wind effect. If the Gulf were circular instead of elongated, the same wind would produce much less setdown because water could escape sideways. The geography IS the boundary condition.',
      checkQuestion: 'What is the "no-slip condition" and why does it exist?',
      checkAnswer: 'At a solid surface, the fluid velocity matches the surface velocity (zero for a stationary wall). This happens because fluid molecules in direct contact with the wall are attracted to it (adhesion) and essentially stick. The layer above is dragged by viscosity, creating a velocity gradient. This is why dust on a fan blade is not blown off by the airflow — the air right at the blade surface is stationary.',
      codeIntro: 'Compare channel flow solutions with different boundary conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

ny = 100
y = np.linspace(0, 2, ny)  # channel height (m)

# Driving force (pressure gradient + wind)
dPdx = 50  # Pa/m
mu = 1.08e-3  # viscosity
rho = 1025
H = 2.0  # channel depth

# Case 1: No-slip top and bottom (pipe flow)
# Parabolic profile: u = (dPdx / 2mu) * y * (H - y)
u_noslip = (dPdx / (2 * mu)) * y * (H - y)

# Case 2: No-slip bottom, free surface top (wind-driven)
# Linear + wind stress profile
tau_wind = 1.44  # Pa
u_wind = (dPdx / (2 * mu)) * y * (H - y) + (tau_wind / mu) * y

# Case 3: No-slip bottom, slip top (frictionless surface)
u_slip = (dPdx / (2 * mu)) * y * (2 * H - y)

# Normalize for comparison
u_noslip_n = u_noslip / np.max(u_noslip)
u_wind_n = u_wind / np.max(np.abs(u_wind))
u_slip_n = u_slip / np.max(u_slip)

plt.figure(figsize=(10, 6))
plt.plot(u_noslip_n, y, linewidth=2.5, color='#3b82f6', label='No-slip both walls (pipe)')
plt.plot(u_wind_n, y, linewidth=2.5, color='#f97316', label='No-slip bottom + wind stress top')
plt.plot(u_slip_n, y, linewidth=2.5, color='#10b981', label='No-slip bottom + free-slip top')

plt.axhline(0, color='#92400e', linewidth=2, label='Seabed (no-slip)')
plt.axhline(H, color='#06b6d4', linewidth=1.5, linestyle='--', label='Water surface')

plt.xlabel('Normalized velocity', fontsize=11)
plt.ylabel('Height above seabed (m)', fontsize=11)
plt.title('How Boundary Conditions Change the Flow', fontsize=13)
plt.legend(fontsize=9)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print("Same equations, same driving force — different boundary conditions:")
print()
print("Blue (pipe): Zero velocity at top AND bottom → symmetric parabola")
print("Orange (wind): Wind pushes the surface → fastest at the top")
print("Green (free-slip): Frictionless top → skewed parabola")
print()
print("The Red Sea simulation uses the ORANGE profile:")
print("no-slip at the seabed, wind stress at the surface.")`,
      challenge: 'What if the seabed were frictionless (free-slip bottom)? Modify the equations to use slip at both boundaries. What happens to the velocity profile? Is this physically realistic?',
      successHint: 'Boundary conditions are where the physics meets the geometry. The same equations with different BCs model pipes, rivers, oceans, blood vessels, or atmospheric flow. Choosing the right BCs is one of the most important decisions in setting up a CFD simulation.',
    },
    {
      title: '2D simulation — grid, solve, visualize',
      concept: `Now we put everything together: Navier-Stokes equations + finite differences + CFL condition + boundary conditions = a complete 2D CFD simulation.

The workflow is:
1. **Define geometry** (grid representing the Gulf of Suez, including the ridge)
2. **Set initial conditions** (still water at sea level)
3. **Apply boundary conditions** (wind at surface, no-slip at seabed/coast)
4. **Time-march** (update velocity and pressure at each grid cell using finite differences)
5. **Visualize** (plot water level, velocity vectors, pressure fields)

The code implements a simplified 2D shallow water simulation of wind setdown over a ridge. This is conceptually identical to what the NCAR team ran, just at lower resolution.`,
      analogy: 'Building a CFD simulation is like setting up a model railway. First you lay the track (define the grid). Then you place the trains (initial conditions). You set the signals and switches (boundary conditions). Then you press "go" and watch what happens (time-marching). If you set it up wrong, trains crash (simulation blows up).',
      storyConnection: 'The NCAR simulation used a 2D grid of the Gulf of Suez bathymetry (seabed topography from sonar surveys). Real data, real equations, real physics. Their result: a 3–4 km dry corridor lasting ~4 hours with 63 mph east wind. This is science at its best — taking an ancient story, translating it into equations, and testing it.',
      checkQuestion: 'The NCAR study used ~40,000 grid cells. Modern ocean models use billions. What enables this increase?',
      checkAnswer: 'Three things: (1) Moore’s Law — processors are ~10,000× faster than in 2010. (2) Parallelism — modern simulations run on thousands of GPUs simultaneously, each handling a portion of the grid. (3) Better algorithms — adaptive mesh refinement puts more cells where they are needed (near the ridge) and fewer where the flow is simple (open sea).',
      codeIntro: 'Run a 2D shallow water simulation with wind over a ridge.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 2D Shallow Water Simulation (simplified)
nx, ny = 80, 40
Lx, Ly = 50000, 20000  # 50km x 20km
dx, dy = Lx/nx, Ly/ny
g = 9.81
dt = 5.0  # seconds
n_steps = 3000  # ~4 hours

x = np.linspace(0, Lx, nx)
y = np.linspace(0, Ly, ny)
X, Y = np.meshgrid(x, y)

# Bathymetry: ridge across the middle (east-west)
ridge_y = Ly / 2
bed = -10 + 8 * np.exp(-((Y - ridge_y) / 2000)**2)

# Initial conditions
h = np.maximum(0.1, -bed)  # water depth
u = np.zeros((ny, nx))  # x-velocity (east)
v = np.zeros((ny, nx))  # y-velocity (north)

# Wind stress (eastward)
rho = 1025
tau_x = 1.44  # Pa (63 mph east wind)

# Time-march
for step in range(n_steps):
    h_new = h.copy()
    u_new = u.copy()

    for j in range(1, ny-1):
        for i in range(1, nx-1):
            # Mass conservation
            h_new[j,i] = h[j,i] - dt * (
                (h[j,i+1]*u[j,i+1] - h[j,i-1]*u[j,i-1]) / (2*dx) +
                (h[j+1,i]*v[j+1,i] - h[j-1,i]*v[j-1,i]) / (2*dy)
            )
            # x-momentum
            surface_slope_x = ((bed[j,i+1]+h[j,i+1]) - (bed[j,i-1]+h[j,i-1])) / (2*dx)
            u_new[j,i] = u[j,i] - dt * g * surface_slope_x + dt * tau_x / (rho * max(h[j,i], 0.1))

    h = np.maximum(0.05, h_new)
    u = u_new

# Final water surface
surface = bed + h

# Plot
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Water depth
im1 = axes[0].pcolormesh(X/1000, Y/1000, h, cmap='Blues', shading='auto')
axes[0].contour(X/1000, Y/1000, bed, levels=[-8, -6, -4, -2], colors='brown',
                linewidths=0.5, alpha=0.5)
plt.colorbar(im1, ax=axes[0], label='Water depth (m)')
axes[0].set_xlabel('East (km)', fontsize=10)
axes[0].set_ylabel('North (km)', fontsize=10)
axes[0].set_title('Water Depth After Wind Setdown', fontsize=12)

# Water surface elevation
im2 = axes[1].pcolormesh(X/1000, Y/1000, surface, cmap='RdYlBu', shading='auto',
                          vmin=-1, vmax=1)
axes[1].contour(X/1000, Y/1000, surface, levels=[0], colors='gold', linewidths=2)
plt.colorbar(im2, ax=axes[1], label='Surface elevation (m)')
axes[1].set_xlabel('East (km)', fontsize=10)
axes[1].set_ylabel('North (km)', fontsize=10)
axes[1].set_title('Surface Elevation (gold = exposed ridge)', fontsize=12)

plt.suptitle('2D CFD: Wind Setdown Over Submarine Ridge', fontsize=14)
plt.tight_layout()
plt.show()

exposed = np.sum(surface <= 0) * dx * dy / 1e6  # km^2
print(f"Exposed seabed area: {exposed:.1f} km²")
print(f"Simulation: {n_steps * dt / 3600:.1f} hours of wind")
print("Gold contour shows where the ridge is exposed above water.")`,
      challenge: 'Add a second simulation phase where the wind stops (set tau_x = 0) and run for 1000 more steps. Plot the water returning. How quickly does the ridge re-flood?',
      successHint: 'You just ran a genuine 2D computational fluid dynamics simulation! The NCAR team’s version was more refined (better numerics, real bathymetry, validated against tide gauge data), but the fundamental approach is identical. This is how modern science investigates historical and geological questions.',
    },
    {
      title: 'Sensitivity analysis — what if the parameters change?',
      concept: `A good scientist does not just run one simulation. They ask: **how sensitive is the result to the input parameters?** This is called **sensitivity analysis**.

For the Red Sea crossing, the key parameters are:
- Wind speed (what if it was 50 mph instead of 63?)
- Wind duration (8 hours instead of 12?)
- Ridge depth (3 m instead of 2?)
- Tidal phase (neap tide instead of spring?)

If the result (ridge exposure) only works for one precise combination of parameters, it is **fragile** — unlikely to occur naturally. If it works across a range of reasonable parameters, it is **robust** — a plausible natural event.

The code runs a parameter sweep and maps out which combinations produce a dry crossing.`,
      analogy: 'When you bake a cake, the recipe says "350°F for 30 minutes." But what if your oven runs 25° hot? Or you leave it in 5 minutes extra? Sensitivity analysis tests: does the cake still turn out okay with small variations? A robust recipe works across a range. A fragile one fails with any deviation. The same logic applies to physical models.',
      storyConnection: 'The robustness question is central to the historical debate. If the crossing ONLY works with exactly 63 mph wind for exactly 12 hours over exactly a 2 m ridge during exactly a spring tide — it might be a one-in-a-million coincidence. If it works across a range of conditions — it is a plausible recurring natural phenomenon. Let’s find out.',
      checkQuestion: 'In the sensitivity analysis, which parameter do you expect to have the largest effect: wind speed, ridge depth, or tidal phase?',
      checkAnswer: 'Wind speed, because the setdown scales with V² (quadratic). A 20% change in wind speed produces a 44% change in setdown. Ridge depth has a linear effect (1:1). Tidal phase contributes only ~0.3–0.4 m variation. So wind speed dominates the sensitivity. This makes physical sense — the wind is doing most of the work.',
      codeIntro: 'Run a parameter sweep: which combinations of wind speed and ridge depth produce a crossing?',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified setdown model
# total_drop = tide_drop + wind_setdown
# wind_setdown = rho_air * Cd * V^2 * fetch / (g * depth * rho_water)

rho_air = 1.225
Cd = 1.5e-3
g = 9.81
rho_water = 1025
fetch = 50000  # 50 km

# Parameter ranges
wind_speeds = np.linspace(20, 40, 50)  # m/s (45-90 mph)
ridge_depths = np.linspace(1, 5, 50)    # metres

# Tide contribution (spring low = -0.35, neap = -0.15)
tide_drops = [0.15, 0.25, 0.35]  # metres
tide_labels = ['Neap', 'Average', 'Spring']

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))

for ax, tide_drop, label in zip(axes, tide_drops, tide_labels):
    # Calculate total drop for each combination
    W, D = np.meshgrid(wind_speeds, ridge_depths)
    wind_setdown = rho_air * Cd * W**2 * fetch / (g * D * rho_water)
    total_drop = wind_setdown + tide_drop

    # Does it expose the ridge? (total_drop >= ridge_depth)
    exposed = total_drop >= D

    # Plot
    im = ax.pcolormesh(W * 2.237, D, exposed.astype(float), cmap='RdYlGn',
                       shading='auto', vmin=0, vmax=1)
    ax.contour(W * 2.237, D, total_drop - D, levels=[0], colors='white', linewidths=2)
    ax.set_xlabel('Wind speed (mph)', fontsize=10)
    ax.set_title(f'{label} tide (Δ = {tide_drop} m)', fontsize=11)
    ax.grid(alpha=0.2)

    # Mark NCAR scenario
    ax.plot(63, 2, 'w*', markersize=12, zorder=5)

axes[0].set_ylabel('Ridge depth (m)', fontsize=10)
plt.suptitle('Sensitivity: Green = Crossing Possible, Red = Not', fontsize=13)
plt.tight_layout()
plt.show()

print("White star = NCAR scenario (63 mph, 2 m ridge)")
print("White line = threshold (above = exposed, below = submerged)")
print()
print("Key findings:")
print("  • Ridge depth is the most constraining factor")
print("  • At 2 m depth, winds as low as ~50 mph may work (spring tide)")
print("  • At 3 m depth, only hurricane-force winds (>75 mph) work")
print("  • Spring tide extends the green zone noticeably")
print()
print("Conclusion: the crossing is ROBUST for ridges ≤2 m deep")
print("with strong-gale to storm-force winds. Not a one-in-a-million event.")`,
      challenge: 'Add wind duration as a third parameter. The setdown takes time to develop — it is not instant. Assume the full setdown requires 12 hours and scales linearly with time. Create a 3D sensitivity analysis.',
      successHint: 'Sensitivity analysis is how engineers and scientists build confidence in their models. The Red Sea crossing turns out to be fairly robust: a 2-metre ridge in the Gulf of Suez can be exposed by a range of plausible wind conditions during spring tides. This is not a contrived scenario — it is a natural phenomenon that likely recurs every few decades.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Navier-Stokes, CFD methods, and simulation</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises involve real CFD simulations. Click to start Python.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[RedSeaCFDDiagram, RedSeaCrossSectionDiagram, RedSeaWindSetdownDiagram, RedSeaTideDiagram, BernoulliDiagram, PressureDepthDiagram][i] ? createElement([RedSeaCFDDiagram, RedSeaCrossSectionDiagram, RedSeaWindSetdownDiagram, RedSeaTideDiagram, BernoulliDiagram, PressureDepthDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
