import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import RedSeaWindSetdownDiagram from '../diagrams/RedSeaWindSetdownDiagram';
import RedSeaCFDDiagram from '../diagrams/RedSeaCFDDiagram';
import RedSeaCrossSectionDiagram from '../diagrams/RedSeaCrossSectionDiagram';
import RedSeaTideDiagram from '../diagrams/RedSeaTideDiagram';
import BuoyancyDiagram from '../diagrams/BuoyancyDiagram';
import PressureDepthDiagram from '../diagrams/PressureDepthDiagram';

export default function RedSeaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Continuity equation — what goes in must come out',
      concept: `In Level 1 you learned that wind pushes water sideways. But where exactly does the water go? The **continuity equation** answers this.

The principle is simple: water is incompressible. If you squeeze it out of one place, it must appear somewhere else. Mathematically:

**A₁ × v₁ = A₂ × v₂**

where A is the cross-sectional area and v is the flow velocity. If a wide channel narrows, the water must speed up. If it widens, the water slows.

This is why the water piles up on the downwind side during wind setdown. The wind pushes water from the shallow ridge area (wide, slow) into the deeper channels (narrower effective area for the displaced volume), and the water level rises there.

The continuity equation is the **first** of three conservation laws that form the basis of all fluid dynamics. We will build the other two in this level.`,
      analogy: 'Put your thumb over a garden hose. The opening gets smaller (A decreases), so the water speeds up (v increases) to maintain the same flow rate. This is the continuity equation in action. Every river, every pipe, every blood vessel follows this rule.',
      storyConnection: 'When wind pushes water off the ridge, the continuity equation tells us where it goes: into the deeper channels on either side. The channels are the "larger hose" that absorbs the displaced volume. The wider and deeper the surrounding sea, the less the water level rises there.',
      checkQuestion: 'A river is 20 m wide and 2 m deep, flowing at 1 m/s. It enters a gorge that is 5 m wide and 4 m deep. What is the flow speed in the gorge?',
      checkAnswer: 'A₁v₁ = A₂v₂. A₁ = 20×2 = 40 m². A₂ = 5×4 = 20 m². v₂ = A₁v₁/A₂ = 40×1/20 = 2 m/s. The water doubles in speed. This is why rivers flow faster through narrow gorges — the same volume of water per second must pass through a smaller opening.',
      codeIntro: 'Visualize how flow speed changes with channel width.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Channel width varies along length (simulating ridge area)
x = np.linspace(0, 10, 500)  # km along channel

# Width profile: narrow at ridge (x=5), wide at edges
width = 2 + 3 * np.abs(np.sin(np.pi * x / 10))  # km

# Depth profile: shallow at ridge, deep at edges
depth = 1 + 4.5 * np.abs(np.sin(np.pi * x / 10))  # metres

# Cross-sectional area
area = width * 1000 * depth  # m^2

# Continuity: Q = A * v = constant
Q = area[0] * 0.5  # flow rate based on edge conditions (0.5 m/s)
velocity = Q / area

fig, axes = plt.subplots(3, 1, figsize=(10, 8), sharex=True)

axes[0].plot(x, width, linewidth=2, color='#06b6d4')
axes[0].fill_between(x, width, alpha=0.1, color='#06b6d4')
axes[0].set_ylabel('Channel width (km)', fontsize=10)
axes[0].set_title('Continuity Equation: A₁v₁ = A₂v₂', fontsize=13)
axes[0].axvline(5, color='#fbbf24', linewidth=1, linestyle='--', alpha=0.5)
axes[0].grid(alpha=0.3)

axes[1].plot(x, depth, linewidth=2, color='#3b82f6')
axes[1].fill_between(x, depth, alpha=0.1, color='#3b82f6')
axes[1].set_ylabel('Depth (m)', fontsize=10)
axes[1].axvline(5, color='#fbbf24', linewidth=1, linestyle='--', alpha=0.5)
axes[1].grid(alpha=0.3)

axes[2].plot(x, velocity, linewidth=2.5, color='#ef4444')
axes[2].fill_between(x, velocity, alpha=0.1, color='#ef4444')
axes[2].set_ylabel('Flow speed (m/s)', fontsize=10)
axes[2].set_xlabel('Position along channel (km)', fontsize=10)
axes[2].axvline(5, color='#fbbf24', linewidth=1, linestyle='--', alpha=0.5)
axes[2].text(5.1, max(velocity)*0.9, 'Ridge', color='#fbbf24', fontsize=10)
axes[2].grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("At the narrow, shallow ridge: water SPEEDS UP")
print("At the wide, deep channels: water SLOWS DOWN")
print("Same volume per second everywhere — that is continuity.")`,
      challenge: 'If the ridge narrowed to just 0.5 km wide, what would happen to the flow speed? Calculate and discuss whether this creates a safety hazard for anyone crossing.',
      successHint: 'The continuity equation is the simplest conservation law: conservation of mass. Every CFD simulation starts here. Combined with momentum and energy conservation, it forms the Navier-Stokes equations.',
    },
    {
      title: 'Bernoulli’s principle — fast flow means low pressure',
      concept: `The continuity equation told us that narrow channels have faster flow. Bernoulli’s principle adds the next piece: **where fluid moves faster, pressure drops**.

The equation is:

**P + ½ρv² + ρgh = constant**

This says that pressure energy + kinetic energy + potential energy stays constant along a streamline. If velocity (v) increases, pressure (P) must decrease to compensate.

For the Red Sea crossing, Bernoulli explains why the returning water is so dangerous. As it funnels back over the ridge, it speeds up (continuity), and the pressure drops. This creates a **venturi effect** — the same principle that makes airplane wings generate lift.

The fast, low-pressure return flow would be difficult to stand in, even at moderate depths. A person standing in 50 cm of fast-moving water experiences far more force than they would expect.`,
      analogy: 'Hold a strip of paper below your lower lip and blow across the top. The paper rises! Your breath creates fast-moving air above the paper (low pressure), while still air below pushes up (higher pressure). The pressure difference lifts the paper. This is Bernoulli in action — and the same principle explains airplane flight.',
      storyConnection: 'The returning water would not merely rise gently around anyone on the ridge. Bernoulli tells us it would rush back as a fast, low-pressure flow — essentially a horizontal waterfall. This explains the Exodus description of waters "overwhelming" the pursuers rather than simply rising around them.',
      checkQuestion: 'An airplane wing works because air moves faster over the curved top than the flat bottom. If air over the top moves at 70 m/s and under the bottom at 60 m/s, which surface has lower pressure?',
      checkAnswer: 'The top surface has lower pressure. Bernoulli: P + ½ρv² = constant. Higher v means lower P. The pressure difference (higher below, lower above) creates an upward force — lift. A Boeing 747’s wings create enough pressure difference to support 400 tonnes.',
      codeIntro: 'Calculate and plot pressure along a narrowing channel.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Channel narrowing simulation
x = np.linspace(0, 100, 500)  # metres

# Channel width narrows from 100m to 20m and back
width = 20 + 40 * (1 + np.cos(np.pi * x / 50)) / 2
width = np.clip(width, 20, 60)

# Flow speed (continuity: wider = slower)
v_ref = 1.0  # m/s in wide section
v = v_ref * 60 / width

# Bernoulli: P + 0.5*rho*v^2 = constant
rho = 1025  # seawater
P_total = 101325 + 0.5 * rho * v_ref**2  # constant (reference)
P = P_total - 0.5 * rho * v**2

# Normalize pressure for clearer plot
P_kPa = P / 1000

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 8), sharex=True)

ax1.plot(x, width, linewidth=2, color='#06b6d4')
ax1.fill_between(x, width, alpha=0.15, color='#06b6d4')
ax1.set_ylabel('Channel width (m)', fontsize=10)
ax1.set_title('Bernoulli\'s Principle: Faster Flow = Lower Pressure', fontsize=13)
ax1.grid(alpha=0.3)

ax2.plot(x, v, linewidth=2.5, color='#ef4444')
ax2.fill_between(x, v, alpha=0.15, color='#ef4444')
ax2.set_ylabel('Flow speed (m/s)', fontsize=10)
ax2.grid(alpha=0.3)

ax3.plot(x, P_kPa, linewidth=2.5, color='#8b5cf6')
ax3.fill_between(x, P_kPa, alpha=0.15, color='#8b5cf6')
ax3.set_ylabel('Pressure (kPa)', fontsize=10)
ax3.set_xlabel('Position along channel (m)', fontsize=10)
ax3.grid(alpha=0.3)

plt.tight_layout()
plt.show()

v_narrow = v_ref * 60 / 20
dP = 0.5 * rho * (v_narrow**2 - v_ref**2)
print(f"Wide section: v = {v_ref:.1f} m/s")
print(f"Narrow section: v = {v_narrow:.1f} m/s")
print(f"Pressure drop: {dP:.0f} Pa ({dP/1000:.1f} kPa)")
print()
print("Where the channel narrows: speed UP, pressure DOWN")
print("This is why fast-returning water creates suction.")`,
      challenge: 'A firehose nozzle narrows from 10 cm diameter to 2 cm. If water enters at 2 m/s, what is the exit speed? What is the pressure drop? (Use ρ=1000 for freshwater.)',
      successHint: 'Bernoulli’s equation is the second conservation law: conservation of energy along a streamline. It explains everything from carburetors to blood flow to the curve on a cricket ball.',
    },
    {
      title: 'Viscosity and Reynolds number — smooth or turbulent?',
      concept: `When water flows slowly, it moves in smooth, parallel layers — **laminar flow**. When it moves fast, the layers break into chaotic swirls — **turbulent flow**. The transition depends on the **Reynolds number**:

**Re = (ρ × v × L) / μ**

where ρ is density, v is velocity, L is a characteristic length (like channel depth), and μ is viscosity (the "thickness" of the fluid).

When Re < ~2000: laminar (smooth)
When Re > ~4000: turbulent (chaotic)
Between: transitional

For the Red Sea return flow (v ≈ 4 m/s, L ≈ 2 m, seawater): Re ≈ 8 million. That is **extremely turbulent**. The returning water would be a churning, violent flow — not a gentle rise.

Understanding Reynolds number is crucial in CFD: turbulent flow requires much finer computational grids and more complex equations than laminar flow.`,
      analogy: 'Turn on a tap very slightly — the water comes out as a smooth, clear stream (laminar). Turn it on full blast — the stream breaks into a noisy, opaque splash (turbulent). The Reynolds number tells you where the transition happens. Higher speed, larger scale, or thinner fluid all push toward turbulence.',
      storyConnection: 'The returning Red Sea water would be at Reynolds number ~8 million — violently turbulent. This means standing waves, vortices, and unpredictable surges. A person caught in this flow would face not just rising water but chaotic, swirling forces pulling in multiple directions. This matches the biblical description of total devastation.',
      checkQuestion: 'Honey flows slowly down a spoon in a smooth stream. Water splashes turbulently. Both are fluids — why the difference?',
      checkAnswer: 'Honey has viscosity about 10,000 times greater than water. Since Re = ρvL/μ, and μ is 10,000× larger for honey, its Reynolds number is 10,000× smaller. Even at reasonable speeds, honey’s Re stays well below 2000 (laminar). Water’s low viscosity means almost any real-world flow has Re >> 4000 (turbulent).',
      codeIntro: 'Calculate Reynolds number for different flow conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Seawater properties
rho = 1025     # kg/m^3
mu = 1.08e-3   # Pa.s (dynamic viscosity of seawater)

# Range of flow speeds
v = np.linspace(0.01, 5, 500)  # m/s
L = 2.0  # characteristic length (water depth) in metres

# Reynolds number
Re = rho * v * L / mu

plt.figure(figsize=(10, 5))
plt.semilogy(v, Re, linewidth=2.5, color='#06b6d4')

# Zones
plt.axhspan(0, 2000, alpha=0.1, color='green', label='Laminar (Re < 2000)')
plt.axhspan(2000, 4000, alpha=0.1, color='yellow', label='Transitional')
plt.axhspan(4000, 1e8, alpha=0.05, color='red', label='Turbulent (Re > 4000)')

# Mark return flow
v_return = 4.4  # m/s (gravity wave speed)
Re_return = rho * v_return * L / mu
plt.plot(v_return, Re_return, 'o', color='#ef4444', markersize=10, zorder=5)
plt.annotate(f'Return flow\\nRe = {Re_return:.0e}', xy=(v_return, Re_return),
             xytext=(3.0, Re_return/5), fontsize=10, color='#ef4444',
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

plt.xlabel('Flow speed (m/s)', fontsize=11)
plt.ylabel('Reynolds number (log scale)', fontsize=11)
plt.title('Reynolds Number: Laminar vs Turbulent Flow', fontsize=13)
plt.legend(fontsize=9, loc='lower right')
plt.grid(alpha=0.3, which='both')
plt.tight_layout()
plt.show()

print(f"Return flow: v = {v_return} m/s, L = {L} m")
print(f"Reynolds number = {Re_return:.2e}")
print(f"This is {Re_return/4000:.0f}x above the turbulent threshold!")
print()
print("Laminar: smooth, predictable, gentle")
print("Turbulent: chaotic, violent, dangerous")
print("The returning Red Sea water would be EXTREMELY turbulent.")`,
      challenge: 'Calculate Re for blood flowing through an artery (v=0.3 m/s, L=0.01 m, ρ=1060 kg/m³, μ=3.5×10⁻³ Pa.s). Is blood flow laminar or turbulent? Why does this matter for cardiovascular health?',
      successHint: 'Reynolds number is how engineers decide what type of simulation to run. Laminar CFD is straightforward. Turbulent CFD requires additional models (like k-ε or Large Eddy Simulation) and far more computing power. The Red Sea flow is firmly in the turbulent regime.',
    },
    {
      title: 'Shear stress — how wind grips water',
      concept: `Wind does not just push on the ocean surface like a hand pushing a box. It creates **shear stress** — a friction force between the moving air and the water surface.

The wind shear stress formula is:

**τ = ρ_air × C_d × V²**

where ρ_air is air density (~1.225 kg/m³), C_d is the drag coefficient (~1.5×10⁻³), and V is wind speed.

Notice V²: doubling the wind speed quadruples the stress. This is why hurricane-force winds can push entire seas.

At 63 mph (28 m/s): τ = 1.225 × 0.0015 × 28² = **1.44 Pa**.

That seems small, but applied over 50 km of fetch (the distance the wind blows over water) for 12 hours, it moves enormous volumes. The total force on the water surface is τ × area = 1.44 × (50,000 × 3,500) = **252 million Newtons**. That is the weight of about 25,000 cars — pressing on the water surface.`,
      analogy: 'Rub your palm across a tabletop. The friction between your skin and the table is shear stress. Rub faster and the friction is stronger (proportional to speed squared for fluids). Now imagine your palm is 50 km long and you are rubbing across an ocean surface. That is wind shear.',
      storyConnection: 'The "strong east wind all that night" in Exodus created a sustained shear stress on the Gulf of Suez’s surface. The V² dependence means a 63 mph wind creates 4x the force of a 32 mph wind. The specific wind speed matters enormously, and the biblical description of an unusually strong wind aligns with the physics requirement.',
      checkQuestion: 'Why does the formula use V² instead of just V? What physical principle causes this?',
      checkAnswer: 'The drag force on a surface in a fluid depends on the dynamic pressure of the flow, which is ½ρV². This comes from the kinetic energy of the air molecules hitting the surface. Kinetic energy = ½mv², so the energy (and thus force) delivered per impact goes as v². More speed means both more impacts per second AND more energy per impact — a double whammy.',
      codeIntro: 'Calculate wind shear stress and total force for different wind speeds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

rho_air = 1.225  # kg/m^3
C_d = 1.5e-3     # drag coefficient

# Wind speeds from calm to hurricane
v_ms = np.linspace(0, 40, 200)  # m/s
v_mph = v_ms * 2.237

# Shear stress
tau = rho_air * C_d * v_ms**2

# Total force over fetch area
fetch = 50000  # metres
channel_width = 3500  # metres
area = fetch * channel_width
total_force = tau * area
total_force_cars = total_force / 10000  # 1 car ~ 10 kN weight

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(v_mph, tau, linewidth=2.5, color='#f97316')
ax1.fill_between(v_mph, tau, alpha=0.1, color='#f97316')
ax1.axvline(63, color='silver', linewidth=1, linestyle='--')
ax1.annotate(f'63 mph: τ = {rho_air*C_d*28.2**2:.2f} Pa',
             xy=(63, rho_air*C_d*28.2**2), xytext=(30, 2.5),
             fontsize=10, color='#f97316',
             arrowprops=dict(arrowstyle='->', color='#f97316'))
ax1.set_xlabel('Wind speed (mph)', fontsize=10)
ax1.set_ylabel('Shear stress (Pa)', fontsize=10)
ax1.set_title('Wind Shear Stress: τ = ρCₑV²', fontsize=12)
ax1.grid(alpha=0.3)

ax2.plot(v_mph, total_force_cars, linewidth=2.5, color='#ef4444')
ax2.fill_between(v_mph, total_force_cars, alpha=0.1, color='#ef4444')
ax2.axvline(63, color='silver', linewidth=1, linestyle='--')
ax2.set_xlabel('Wind speed (mph)', fontsize=10)
ax2.set_ylabel('Force (equivalent car-weights)', fontsize=10)
ax2.set_title(f'Total Force over {fetch/1000:.0f} km × {channel_width/1000:.1f} km', fontsize=12)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

v_target = 28.2
tau_target = rho_air * C_d * v_target**2
F_target = tau_target * area
print(f"At 63 mph (28.2 m/s):")
print(f"  Shear stress: {tau_target:.2f} Pa")
print(f"  Total force: {F_target:.0f} N ({F_target/1e6:.0f} MN)")
print(f"  Equivalent to: {F_target/10000:.0f} car-weights")
print()
print("V-squared makes all the difference:")
print(f"  At 30 mph: τ = {rho_air*C_d*(30/2.237)**2:.2f} Pa")
print(f"  At 63 mph: τ = {tau_target:.2f} Pa")
print(f"  Ratio: {(63/30)**2:.1f}x (speed doubled → force quadrupled)")`,
      challenge: 'A Category 5 hurricane has winds of 157 mph. Calculate its wind shear stress. How many times greater is it than the 63 mph wind? This is why hurricanes create such devastating storm surges.',
      successHint: 'Wind shear stress is the input that drives the entire wind setdown phenomenon. It enters the Navier-Stokes equations as a boundary condition at the water surface. In Level 3, you will see how CFD solvers use this to compute the full flow field.',
    },
    {
      title: 'Shallow water equations — the simplified model',
      concept: `The full Navier-Stokes equations are complex. But for shallow water (where the depth is much less than the horizontal extent), we can simplify them into the **shallow water equations**:

**∂h/∂t + ∂(hu)/∂x = 0** (mass conservation)
**∂u/∂t + u × ∂u/∂x + g × ∂h/∂x = τ/(ρh)** (momentum)

The first equation says: the rate of change of water height equals the rate of inflow minus outflow. The second says: the water accelerates due to pressure gradients (gravity pulling water from high to low) and wind stress.

These equations are what the NCAR team actually solved in their 2010 study. They discretized the Gulf of Suez into a grid of cells, applied the wind stress as a boundary condition, and marched the solution forward in time.

The code implements a simplified 1D version of these equations.`,
      analogy: 'Imagine a row of connected bathtubs. When one has more water, it spills into its neighbors. Each bathtub’s water level depends on how much flows in from the left and out to the right. The shallow water equations describe exactly this — but with millions of tiny "bathtubs" (grid cells) and the addition of wind pushing the water.',
      storyConnection: 'The NCAR simulation used the shallow water equations on a grid covering the northern Gulf of Suez. Each cell was about 500 m × 500 m. The simulation ran for 24 hours of simulated time. The result: a 3–4 km dry corridor lasting ~4 hours, with water returning in ~30 minutes when wind stopped.',
      checkQuestion: 'Why can’t we just use the full 3D Navier-Stokes equations instead of the shallow water approximation?',
      checkAnswer: 'We can, but it is far more expensive. The Gulf of Suez at 500 m horizontal resolution and 0.5 m vertical resolution would need ~2 million 3D cells (vs ~40,000 for 2D shallow water). Each cell requires solving 5+ equations per timestep, and turbulence modelling adds more. The shallow water equations capture the essential physics (water level changes and horizontal flow) at a fraction of the cost.',
      codeIntro: 'Implement a simplified 1D shallow water solver and watch wind push water off a ridge.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D Shallow Water Equations (Lax-Friedrichs scheme)
nx = 200        # grid cells
L = 50000       # domain length (50 km)
dx = L / nx
g = 9.81
dt = 1.0        # seconds
n_steps = 20000 # ~5.5 hours

x = np.linspace(0, L, nx)

# Bathymetry: ridge in the middle
ridge_center = L / 2
ridge_width = 5000  # 5 km wide
bed = -10 + 8 * np.exp(-((x - ridge_center) / (ridge_width / 3))**2)
# bed ranges from -10 (deep) to -2 (ridge peak)

# Initial water surface at z=0 (sea level)
h = np.maximum(0.01, -bed)  # water depth = surface - bed
u = np.zeros(nx)  # initially still

# Wind stress (applied as body force)
rho = 1025
wind_stress = 1.44  # Pa (63 mph wind)

# Store snapshots
snapshots = []
snap_times = [0, 5000, 10000, 15000, 20000]

for step in range(n_steps + 1):
    if step in snap_times:
        surface = bed + h
        snapshots.append((step * dt / 3600, h.copy(), surface.copy()))

    # Lax-Friedrichs step
    h_new = h.copy()
    u_new = u.copy()

    for i in range(1, nx - 1):
        # Mass conservation
        h_new[i] = 0.5 * (h[i+1] + h[i-1]) - dt / (2*dx) * (h[i+1]*u[i+1] - h[i-1]*u[i-1])

        # Momentum (with wind and gravity)
        surface_slope = (bed[i+1] + h[i+1] - bed[i-1] - h[i-1]) / (2*dx)
        wind_accel = wind_stress / (rho * max(h[i], 0.1))
        u_new[i] = 0.5 * (u[i+1] + u[i-1]) - dt * g * surface_slope + dt * wind_accel

    h = np.maximum(0.01, h_new)
    u = u_new

# Plot snapshots
plt.figure(figsize=(12, 6))
colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
for (t, h_snap, surface), color in zip(snapshots, colors):
    plt.plot(x / 1000, surface, linewidth=2, color=color, label=f't = {t:.1f} hrs')

plt.fill_between(x/1000, bed, -12, alpha=0.3, color='#92400e', label='Seabed')
plt.plot(x/1000, bed, linewidth=2, color='#92400e')
plt.axhline(0, color='silver', linewidth=1, linestyle='--', label='Sea level')

plt.xlabel('Position (km)', fontsize=11)
plt.ylabel('Height (m)', fontsize=11)
plt.title('1D Shallow Water Simulation: Wind Pushes Water Off Ridge', fontsize=13)
plt.legend(fontsize=9)
plt.grid(alpha=0.3)
plt.ylim(-12, 3)
plt.tight_layout()
plt.show()

print("Watch the water level drop over the ridge (center) as wind blows!")
print("Water piles up on the downwind side (right).")
print("The ridge becomes exposed when the blue surface drops below 0.")`,
      challenge: 'Set wind_stress to 0 and watch what happens (no wind = no setdown). Then try doubling it to 2.88 Pa. How does the exposure time change?',
      successHint: 'You just ran a computational fluid dynamics simulation! This is fundamentally what the NCAR team did — just in 2D with much finer resolution and more sophisticated numerics. The principle is identical: discretize space, apply physics laws, march forward in time.',
    },
    {
      title: 'Energy budget — where does the wind’s energy go?',
      concept: `The wind delivers kinetic energy to the water. Where does it all go?

1. **Kinetic energy of flow**: Water moves sideways (½ρv² per unit volume)
2. **Potential energy**: Water piles up on the downwind side (ρgh per unit volume)
3. **Turbulent dissipation**: Chaotic motion converts kinetic energy to heat
4. **Surface waves**: Energy goes into generating waves

For the Red Sea wind setdown, the energy balance is dominated by **potential energy** — lifting water from the ridge area and piling it up in the deeper channels. The wind must do enough work to raise the water level on the downwind side by the same volume that was removed from the ridge area.

This energy approach gives us an independent check on the simulation: is the wind energy input sufficient to create the observed setdown?`,
      analogy: 'Pushing water uphill in a bathtub takes energy. The wind is doing exactly this — lifting water from the shallow middle and pushing it into a pile on one side. The energy cost is gravity × mass × height lifted, just like lifting any object.',
      storyConnection: 'The sustained east wind "all night" represents a massive energy input. 63 mph wind over 50 km of water surface for 12 hours delivers approximately 10¹² joules — equivalent to a small nuclear power plant running for an hour. Nature is enormously powerful when concentrated.',
      checkQuestion: 'After the wind stops and water returns, where does the potential energy go?',
      checkAnswer: 'The potential energy stored in the piled-up water converts back to kinetic energy as the water rushes back (gravity accelerates it). Some becomes turbulent kinetic energy (chaotic swirling), which ultimately dissipates as heat. A tiny fraction generates sound (the roar of rushing water). Energy is never destroyed — only transformed.',
      codeIntro: 'Calculate the energy budget for the wind setdown scenario.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Energy calculations for wind setdown
rho = 1025      # seawater kg/m^3
g = 9.81

# Geometry
ridge_length = 3500  # m (crossing width)
ridge_area = 3500 * 50000  # m^2 (ridge section)
setdown = 2.0   # metres of water removed from ridge
pileup_height = 0.5  # metres of rise on downwind side
pileup_area = 3500 * 100000  # m^2 (receiving area, larger)

# Energy to lift water (potential energy)
mass_moved = rho * ridge_area * setdown  # kg
PE_setdown = mass_moved * g * setdown / 2  # average lift = setdown/2
PE_pileup = rho * pileup_area * pileup_height * g * pileup_height / 2

# Wind energy input
wind_speed = 28.2  # m/s
tau = 1.225 * 1.5e-3 * wind_speed**2  # Pa
power = tau * wind_speed * ridge_area  # Watts (stress * speed * area)
time = 12 * 3600  # 12 hours in seconds
total_wind_energy = power * time

# Kinetic energy of flow
v_flow = 0.5  # m/s average flow speed
KE = 0.5 * rho * ridge_area * setdown * v_flow**2

# Energy budget
energies = {
    'Wind input': total_wind_energy,
    'Potential (setdown)': PE_setdown,
    'Potential (pileup)': PE_pileup,
    'Kinetic (flow)': KE,
    'Turbulent loss': total_wind_energy - PE_setdown - PE_pileup - KE,
}

names = list(energies.keys())
values = [v / 1e9 for v in energies.values()]  # convert to GJ
colors = ['#f97316', '#3b82f6', '#06b6d4', '#ef4444', '#8b5cf6']

plt.figure(figsize=(10, 5))
bars = plt.bar(names, values, color=colors, width=0.6, edgecolor='white', linewidth=0.5)
plt.ylabel('Energy (Gigajoules)', fontsize=11)
plt.title('Energy Budget: Where Does the Wind\'s Energy Go?', fontsize=13)
plt.xticks(fontsize=9, rotation=15)
plt.grid(axis='y', alpha=0.3)

for bar, val in zip(bars, values):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(values)*0.02,
             f'{val:.0f} GJ', ha='center', fontsize=9, color='lightgray')

plt.tight_layout()
plt.show()

print("Energy Budget Summary:")
for name, val in energies.items():
    print(f"  {name:25s}: {val/1e9:.1f} GJ")
print()
print(f"Total wind energy over 12 hours: {total_wind_energy/1e9:.0f} GJ")
print(f"That is equivalent to {total_wind_energy/3.6e12:.1f} MWh of electricity")
print("or about 1 hour of a nuclear power plant.")`,
      challenge: 'What fraction of the wind energy goes into useful setdown (potential energy) vs turbulent losses? Is wind setdown "efficient"? Compare to solar panels (~20% efficient) or car engines (~30%).',
      successHint: 'Energy conservation is the third and final conservation law in fluid dynamics. You now have all three: mass (continuity), momentum (Bernoulli/Navier-Stokes), and energy. Together, they form the complete foundation of CFD.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Conservation laws and fluid dynamics fundamentals</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for fluid dynamics computations. Click to start.</p>
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
            diagram={[RedSeaCFDDiagram, RedSeaWindSetdownDiagram, RedSeaCrossSectionDiagram, RedSeaTideDiagram, BuoyancyDiagram, PressureDepthDiagram][i] ? createElement([RedSeaCFDDiagram, RedSeaWindSetdownDiagram, RedSeaCrossSectionDiagram, RedSeaTideDiagram, BuoyancyDiagram, PressureDepthDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
