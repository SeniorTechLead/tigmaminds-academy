import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HawkBlueLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Equations of motion — simulating hawk flight paths',
      concept: `A hawk in flight obeys Newton\'s second law in two dimensions:

\`m × dvx/dt = T×cos(θ) - D×cos(γ) - L×sin(γ)\`
\`m × dvz/dt = T×sin(θ) + L×cos(γ) - D×sin(γ) - mg + F_thermal\`

Where γ = flight path angle, θ = thrust angle, and F_thermal = buoyancy from thermal updraft.

For a gliding hawk (T=0), the equations simplify to a balance between lift, drag, and gravity. The flight path is determined by the instantaneous lift-to-drag ratio and the vertical air velocity.

We solve these using the **Euler method**: update position and velocity at each time step using current forces.

📚 *2D physics simulations track both x and z components simultaneously. numpy arrays for position and velocity make the code clean and efficient.*`,
      analogy: 'The flight simulation is like a pinball machine in the sky. The hawk is the ball, gravity pulls it down, thermals push it up, drag slows it, and lift deflects it. At each instant, the hawk adjusts its "flippers" (wings) to navigate this force field. Our simulation computes the ball\'s path one tiny step at a time.',
      storyConnection: 'The flight path of a hawk over Blue Mountain is a continuous negotiation with physics. Circling in a thermal, the hawk banks steeply, trading horizontal speed for vertical gain. Gliding between thermals, it levels out, minimizing drag. Diving on prey, it tucks its wings and accelerates under gravity. Each maneuver is a solution to the equations of motion.',
      checkQuestion: 'Why must the hawk bank (tilt) when circling in a thermal?',
      checkAnswer: 'In a banked turn, the lift force tilts inward, providing the centripetal force needed for circular motion. The vertical component of lift must still equal weight, so total lift must be greater than weight: L = W/cos(bank_angle). At 45° bank, the hawk needs 1.41× its weight in lift, requiring either more speed or higher angle of attack.',
      codeIntro: 'Simulate a hawk\'s complete flight path: thermal climb, glide, and dive.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

dt = 0.1  # seconds
mass = 1.5
g = 9.81
rho = 1.1
S = 0.22
b = 1.1
CD0 = 0.022

# Simulation state
x, z = 0.0, 500.0  # position (m)
vx, vz = 12.0, 0.0  # velocity (m/s)

path_x, path_z = [x], [z]
time = [0]

# Flight phases
phases = [
    ('thermal_climb', 120),   # 2 minutes circling
    ('glide', 180),           # 3 minutes gliding
    ('thermal_climb', 90),    # 1.5 minutes
    ('glide', 120),           # 2 minutes
    ('dive', 15),             # 15 seconds dive
]

t_total = 0
for phase_name, duration in phases:
    for step in range(int(duration / dt)):
        V = np.sqrt(vx**2 + vz**2)
        if V < 1: V = 1

        q = 0.5 * rho * V**2
        CL = mass * g / (q * S) if phase_name != 'dive' else 0.2
        CD = CD0 + CL**2 / (np.pi * (b**2/S) * 0.85)

        # Forces
        L = q * S * CL
        D = q * S * CD

        # Flight path angle
        gamma = np.arctan2(vz, vx)

        if phase_name == 'thermal_climb':
            # Thermal updraft + circular path
            w_thermal = 3.5  # m/s updraft
            ax_force = (-D * np.cos(gamma) - L * np.sin(gamma)) / mass
            az_force = (L * np.cos(gamma) - D * np.sin(gamma) - g + w_thermal * g / 20) / mass + w_thermal * 0.15
            # Circular motion: slowly advance x
            vx = max(vx, 3.0)

        elif phase_name == 'glide':
            ax_force = (-D * np.cos(gamma)) / mass
            az_force = (L * np.cos(gamma) - D * np.sin(gamma)) / mass - g

        elif phase_name == 'dive':
            CL = 0.15  # minimal lift
            L = q * S * CL
            D = q * S * (CD0 * 0.5)  # tucked wings
            ax_force = (-D * vx / V) / mass
            az_force = (-D * vz / V) / mass - g

        vx += ax_force * dt
        vz += az_force * dt
        x += vx * dt
        z += vz * dt

        vx = max(vx, 2.0)  # minimum forward speed
        z = max(z, 0)

        path_x.append(x)
        path_z.append(z)
        t_total += dt
        time.append(t_total)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#111827')

# Flight path
ax1.set_facecolor('#1f2937')
path_x_km = [px/1000 for px in path_x]
# Color by phase
colors_map = {'thermal_climb': '#34d399', 'glide': '#fbbf24', 'dive': '#f87171'}
t_idx = 0
for phase_name, duration in phases:
    n_pts = int(duration / dt)
    end_idx = min(t_idx + n_pts + 1, len(path_x_km))
    ax1.plot(path_x_km[t_idx:end_idx], path_z[t_idx:end_idx],
             color=colors_map[phase_name], linewidth=2, label=phase_name if t_idx < 300 else '')
    t_idx = end_idx - 1

ax1.set_xlabel('Horizontal distance (km)', color='lightgray', fontsize=12)
ax1.set_ylabel('Altitude (m)', color='lightgray', fontsize=12)
ax1.set_title('Hawk Flight Path Over Blue Mountain', color='white', fontsize=14, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Altitude vs time
ax2.set_facecolor('#1f2937')
ax2.plot(time, path_z, color='#60a5fa', linewidth=2)
ax2.set_xlabel('Time (seconds)', color='lightgray', fontsize=12)
ax2.set_ylabel('Altitude (m)', color='lightgray', fontsize=12)
ax2.set_title('Altitude Profile', color='white', fontsize=13, fontweight='bold')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/hawk_flight_sim.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print(f"Total distance: {path_x[-1]/1000:.1f} km")
print(f"Max altitude: {max(path_z):.0f} m")
print(f"Final altitude: {path_z[-1]:.0f} m")
print(f"Total time: {t_total:.0f} seconds ({t_total/60:.1f} minutes)")`,
      challenge: 'Add wind: a constant 5 m/s headwind during glide phases. How much does this reduce the hawk\'s cross-country distance? What if the hawk adjusts speed according to MacCready theory?',
      successHint: 'You built a 2D flight dynamics simulator solving Newton\'s equations for a soaring hawk. This is the same physics engine (greatly simplified) used in flight simulators and UAV autopilot design.',
    },
    {
      title: 'Optimal circling in thermals',
      concept: `When circling in a thermal, the hawk must choose:
- **Bank angle** (φ): steeper bank → tighter circle → stays in thermal core, but requires more lift (L = W/cos φ), which means more induced drag
- **Airspeed**: faster → larger circle radius (\`r = V²/(g×tan φ)\`), but lower induced drag per unit speed

The **optimal bank angle** maximizes climb rate:
\`climb_rate = w_thermal(r) - sink_rate(V, φ)\`

Where w_thermal(r) decreases with radius (Gaussian profile) and sink_rate increases with bank angle.

This is a **constrained optimization**: find the (V, φ) pair that maximizes climb rate, subject to the constraint that the circle fits inside the thermal.

📚 *We solve this by evaluating a 2D grid of (V, φ) combinations and finding the maximum — a brute-force optimization on a small parameter space.*`,
      analogy: 'Choosing bank angle in a thermal is like choosing a lane on a spiral parking ramp. The inner lane (tight circle, steep bank) keeps you near the center where the thermal is strongest but costs more fuel (higher drag). The outer lane (gentle bank) is easier but may take you to the thermal edge where the updraft is weak. The optimal lane balances these factors.',
      storyConnection: 'Watch a hawk circling in a thermal: it does not fly in a perfect circle. It constantly adjusts bank angle, shifting toward the side where the updraft is stronger. When it drifts to the thermal edge (reduced climb), it tightens the circle. This real-time optimization is an astonishing feat of neural computation.',
      checkQuestion: 'At 45° bank angle, how much more lift must the hawk generate compared to straight flight?',
      checkAnswer: 'L = W/cos(45°) = W/0.707 = 1.414×W. The hawk must generate 41.4% more lift, which requires either higher speed or higher angle of attack. This extra lift comes with increased induced drag, which increases the sink rate — the cost of circling.',
      codeIntro: 'Find the optimal bank angle and airspeed for a hawk circling in a thermal.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

mass = 1.5
g = 9.81
W = mass * g
rho = 1.1
S = 0.22
b = 1.1
CD0 = 0.022
e = 0.85
AR = b**2 / S

# Thermal model: Gaussian with max 4 m/s, radius 150m
w_max = 4.0
sigma_thermal = 150  # meters

def thermal_strength(radius):
    return w_max * np.exp(-radius**2 / (2 * sigma_thermal**2))

def sink_rate_banked(V, phi_deg):
    phi = np.radians(phi_deg)
    load_factor = 1 / np.cos(phi)
    W_eff = W * load_factor
    q = 0.5 * rho * V**2
    CL = W_eff / (q * S)
    CD = CD0 + CL**2 / (np.pi * AR * e)
    D = q * S * CD
    return D * V / W_eff

# Grid search
V_range = np.arange(8, 25, 0.5)
phi_range = np.arange(15, 60, 1)
V_grid, phi_grid = np.meshgrid(V_range, phi_range)

climb = np.zeros_like(V_grid)
for i in range(len(phi_range)):
    for j in range(len(V_range)):
        V = V_range[j]
        phi = phi_range[i]
        phi_rad = np.radians(phi)
        r = V**2 / (g * np.tan(phi_rad))  # turn radius
        w_th = thermal_strength(r)
        sr = sink_rate_banked(V, phi)
        climb[i, j] = w_th - sr

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Contour map of climb rate
ax1.set_facecolor('#1f2937')
levels = np.linspace(-1, 3, 20)
cf = ax1.contourf(V_grid, phi_grid, climb, levels=levels, cmap='RdYlGn')
plt.colorbar(cf, ax=ax1, label='Climb rate (m/s)')
ax1.contour(V_grid, phi_grid, climb, levels=[0], colors='white', linewidths=2)

# Mark optimum
opt_idx = np.unravel_index(np.argmax(climb), climb.shape)
opt_V = V_range[opt_idx[1]]
opt_phi = phi_range[opt_idx[0]]
opt_climb = climb[opt_idx]
ax1.plot(opt_V, opt_phi, '*', color='white', markersize=15)
ax1.annotate(f'Optimum: V={opt_V:.0f}m/s, φ={opt_phi}°\
Climb={opt_climb:.2f}m/s',
             xy=(opt_V, opt_phi), xytext=(opt_V+3, opt_phi+5),
             color='white', fontsize=10, arrowprops=dict(arrowstyle='->', color='white'))

ax1.set_xlabel('Airspeed (m/s)', color='lightgray', fontsize=12)
ax1.set_ylabel('Bank angle (degrees)', color='lightgray', fontsize=12)
ax1.set_title('Climb Rate Map', color='white', fontsize=13, fontweight='bold')
ax1.tick_params(colors='lightgray')

# Circle radius vs bank angle at optimal speed
ax2.set_facecolor('#1f2937')
phi_plot = np.linspace(15, 55, 100)
r_turn = opt_V**2 / (g * np.tan(np.radians(phi_plot)))
w_th = thermal_strength(r_turn)
sr = np.array([sink_rate_banked(opt_V, p) for p in phi_plot])
net = w_th - sr

ax2.plot(phi_plot, w_th, color='#34d399', linewidth=2, label='Thermal strength')
ax2.plot(phi_plot, sr, color='#f87171', linewidth=2, label='Sink rate (cost)')
ax2.plot(phi_plot, net, color='#fbbf24', linewidth=3, label='Net climb')
ax2.axhline(0, color='gray', linewidth=0.5)
ax2.axvline(opt_phi, color='white', linestyle=':', alpha=0.5)

ax2.set_xlabel('Bank angle (degrees)', color='lightgray', fontsize=12)
ax2.set_ylabel('Rate (m/s)', color='lightgray', fontsize=12)
ax2.set_title(f'Optimization at V={opt_V:.0f} m/s', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/hawk_thermal_opt.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

opt_r = opt_V**2 / (g * np.tan(np.radians(opt_phi)))
print(f"Optimal: V={opt_V:.0f} m/s, bank={opt_phi}°, radius={opt_r:.0f}m, climb={opt_climb:.2f} m/s")`,
      challenge: 'How does the optimal bank angle change for wider thermals (sigma=300m) vs narrow thermals (sigma=80m)? Hawks in different environments circle differently — wide lazy circles in strong desert thermals, tight spirals in weak forest thermals.',
      successHint: 'You solved the thermal circling optimization — a classic problem in soaring flight theory. Hawks solve this continuously and instinctively, adjusting bank angle and speed in real time. Your grid search found the same answer that millions of years of evolution encoded in hawk neurology.',
    },
    {
      title: 'Navier-Stokes simplified — boundary layer on a wing',
      concept: `The **Navier-Stokes equations** govern all fluid flow. For airflow over a wing, we focus on the **boundary layer** — the thin region near the surface where air velocity transitions from zero (stuck to the wing) to full freestream speed.

The boundary layer can be:
- **Laminar**: smooth, orderly flow. Low drag but easily disrupted.
- **Turbulent**: chaotic, mixed flow. Higher drag but resists separation (stall).

Boundary layer thickness grows along the wing:
\`δ(x) = 5x / √(Re_x)\` (laminar)

Where Re_x = ρVx/μ is the local Reynolds number and μ is viscosity.

**Separation** occurs when the boundary layer detaches from the wing surface — causing stall. Turbulent boundary layers resist separation better, which is why golf balls have dimples (trip laminar flow to turbulent).

📚 *We model the boundary layer profile at different positions along the wing chord. The Blasius solution gives the exact laminar profile.*`,
      analogy: 'The boundary layer is like a crowd of people being pushed past a wall. People touching the wall cannot move (no-slip condition). People just above them are slowed by friction. People far from the wall walk at full speed. The "boundary layer" is the region where the crowd is slowed by the wall. A thicker layer means more friction (drag).',
      storyConnection: 'Hawk feathers create a textured surface that manages the boundary layer. The overlapping structure trips laminar flow to turbulent at the right point, preventing separation on the upper wing surface. This is why hawks can fly at high angles of attack without stalling — their feathers are natural turbulators.',
      checkQuestion: 'Why does a golf ball fly farther with dimples than without?',
      checkAnswer: 'Dimples trip the boundary layer from laminar to turbulent. The turbulent boundary layer has more momentum near the surface, so it stays attached longer around the back of the ball. This reduces the size of the wake (low-pressure region behind the ball), which reduces pressure drag. The small increase in skin friction is far outweighed by the reduction in pressure drag.',
      codeIntro: 'Model the boundary layer on a hawk wing at different Reynolds numbers.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Boundary layer on hawk wing
chord = 0.15    # m (wing chord length)
V = 15          # m/s airspeed
rho = 1.1       # kg/m³
mu = 1.8e-5     # Pa·s (air viscosity)
Re = rho * V * chord / mu

print(f"BOUNDARY LAYER ANALYSIS — HAWK WING")
print(f"Chord: {chord*100:.0f} cm, Speed: {V} m/s")
print(f"Reynolds number: {Re:.0f}")
print()

# Blasius boundary layer profile
def blasius_profile(eta):
    """Approximate Blasius velocity profile."""
    return np.tanh(eta * 0.7) ** 1.5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Boundary layer growth along chord
ax1.set_facecolor('#1f2937')
x_positions = np.linspace(0.005, chord, 200)
Re_x = rho * V * x_positions / mu

# Laminar thickness
delta_lam = 5 * x_positions / np.sqrt(Re_x)
# Turbulent thickness (if transition occurs)
delta_turb = 0.37 * x_positions / Re_x**0.2

# Transition point (typically Re_x ≈ 500,000)
trans_x = 500000 * mu / (rho * V)
delta_actual = np.where(x_positions < trans_x, delta_lam, delta_turb)

ax1.plot(x_positions*100, delta_lam*1000, color='#34d399', linewidth=2, label='Laminar')
ax1.plot(x_positions*100, delta_turb*1000, color='#f87171', linewidth=2, label='Turbulent')
ax1.plot(x_positions*100, delta_actual*1000, color='white', linewidth=2.5, linestyle='--', label='Actual')
ax1.axvline(trans_x*100, color='#fbbf24', linestyle=':', label=f'Transition ({trans_x*100:.1f}cm)')

ax1.set_xlabel('Position along chord (cm)', color='lightgray', fontsize=12)
ax1.set_ylabel('Boundary layer thickness (mm)', color='lightgray', fontsize=12)
ax1.set_title('Boundary Layer Growth on Hawk Wing', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Velocity profiles at different positions
ax2.set_facecolor('#1f2937')
positions = [0.02, 0.05, 0.10, 0.15]
colors = ['#34d399', '#fbbf24', '#f87171', '#a78bfa']

for x_pos, color in zip(positions, colors):
    Re_local = rho * V * x_pos / mu
    delta = 5 * x_pos / np.sqrt(Re_local)
    y = np.linspace(0, delta * 3, 100)
    eta = y / delta
    u_V = blasius_profile(eta)

    ax2.plot(u_V, y * 1000, color=color, linewidth=2.5,
             label=f'x = {x_pos*100:.0f} cm (δ={delta*1000:.2f}mm)')

ax2.set_xlabel('Velocity / Freestream velocity', color='lightgray', fontsize=12)
ax2.set_ylabel('Height above surface (mm)', color='lightgray', fontsize=12)
ax2.set_title('Velocity Profiles at Different Chord Positions', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/hawk_boundary.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

# Skin friction calculation
Cf_lam = 1.328 / np.sqrt(Re)
Cf_turb = 0.074 / Re**0.2
Df_lam = 0.5 * rho * V**2 * chord * 1.0 * Cf_lam  # per unit span
Df_turb = 0.5 * rho * V**2 * chord * 1.0 * Cf_turb
print(f"Skin friction drag (per meter span):")
print(f"  Laminar:   Cf = {Cf_lam:.5f}, Drag = {Df_lam:.3f} N/m")
print(f"  Turbulent: Cf = {Cf_turb:.5f}, Drag = {Df_turb:.3f} N/m")
print(f"  Turbulent drag is {Df_turb/Df_lam:.1f}x higher than laminar")`,
      challenge: 'Model the effect of feather texture: add a roughness element at 30% chord that trips the boundary layer to turbulent. Compare the total drag (skin friction) with and without the trip. In what conditions is forced transition beneficial?',
      successHint: 'You modeled the boundary layer — the thin region that controls drag and stall. This is simplified Navier-Stokes, the same physics that governs everything from blood flow in arteries to airflow around skyscrapers. Hawk feathers are nature\'s boundary layer management system.',
    },
    {
      title: 'Vortex dynamics — wingtip vortices and formation flight',
      concept: `When a wing generates lift, it creates **wingtip vortices** — rotating tubes of air that trail behind each wingtip. These vortices:

- Contain enormous energy (dangerous to small aircraft behind large ones)
- Create **downwash** behind the wing (the induced drag mechanism)
- Persist for minutes after the wing passes

The **Biot-Savart law** describes the velocity field of a vortex:
\`v = Γ / (2π r)\`

Where Γ is the vortex circulation (strength) and r is the distance from the vortex core.

Formation flight exploits vortices: flying in the upwash region of the leader\'s wingtip vortex gives free lift. V-formation flight can save 10-15% energy.

📚 *We model vortex velocity fields using numpy array operations. The induced velocity at any point is the vector sum of contributions from all vortices.*`,
      analogy: 'A wingtip vortex is like the whirlpool behind a boat paddle. Each stroke creates a spinning vortex that trails behind. The bigger the paddle (wing) and the harder you push (more lift), the stronger the whirlpool. These vortices carry energy away from the wing — that lost energy is induced drag.',
      storyConnection: 'Hawks migrating past Blue Mountain sometimes fly in loose formations — not the tight V-shape of geese, but offset positions that still exploit each other\'s vortex upwash. This cooperative flight behavior reduces the energy cost of migration, allowing hawks to travel farther each day.',
      checkQuestion: 'Why does flying in the upwash region of another bird\'s vortex save energy?',
      checkAnswer: 'The lead bird\'s wingtip vortex creates upwash outboard of the wingtip. A following bird positioned in this upwash gets free vertical velocity — essentially a localized thermal created by the leader. The following bird can generate the same lift with less angle of attack, reducing its induced drag by 10-15%.',
      codeIntro: 'Model wingtip vortex fields and calculate energy savings from formation flight.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Vortex model parameters
wingspan = 1.2    # m
Gamma = 2.0       # m²/s (circulation strength)

def vortex_velocity(y, z, y_core, z_core, gamma):
    """Velocity induced by a single vortex at (y_core, z_core)."""
    dy = y - y_core
    dz = z - z_core
    r2 = dy**2 + dz**2 + 0.01**2  # small core radius to avoid singularity
    vy = gamma * dz / (2 * np.pi * r2)
    vz = -gamma * dy / (2 * np.pi * r2)
    return vy, vz

# Create velocity field behind a hawk
ny, nz = 100, 80
y = np.linspace(-3, 3, ny)
z = np.linspace(-2, 2, nz)
Y, Z = np.meshgrid(y, z)

# Two wingtip vortices (left rotates CW, right rotates CCW)
vy_l, vz_l = vortex_velocity(Y, Z, -wingspan/2, 0, Gamma)
vy_r, vz_r = vortex_velocity(Y, Z, wingspan/2, 0, -Gamma)

VY = vy_l + vy_r
VZ = vz_l + vz_r

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Vortex velocity field
ax1.set_facecolor('#1f2937')
speed = np.sqrt(VY**2 + VZ**2)
cf = ax1.contourf(Y, Z, VZ, levels=np.linspace(-3, 3, 25), cmap='RdBu_r')
plt.colorbar(cf, ax=ax1, label='Vertical velocity (m/s)')
skip = 4
ax1.quiver(Y[::skip, ::skip], Z[::skip, ::skip],
           VY[::skip, ::skip], VZ[::skip, ::skip],
           color='white', alpha=0.4, scale=30)

# Mark hawk position and wing span
ax1.plot([-wingspan/2, wingspan/2], [0, 0], 'w-', linewidth=3, label='Leader hawk')
ax1.plot(-wingspan/2, 0, 'wo', markersize=8)
ax1.plot(wingspan/2, 0, 'wo', markersize=8)

ax1.set_xlabel('Spanwise position (m)', color='lightgray')
ax1.set_ylabel('Vertical position (m)', color='lightgray')
ax1.set_title('Wingtip Vortex Field Behind a Hawk', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')

# Formation flight savings
ax2.set_facecolor('#1f2937')
lateral_offsets = np.linspace(-3, 3, 200)

upwash_at_follower = []
for y_off in lateral_offsets:
    _, vz1 = vortex_velocity(y_off, 0, -wingspan/2, 0, Gamma)
    _, vz2 = vortex_velocity(y_off, 0, wingspan/2, 0, -Gamma)
    upwash_at_follower.append(vz1 + vz2)

upwash = np.array(upwash_at_follower)
energy_saving = np.clip(upwash / 1.0 * 15, -5, 20)  # % saving

ax2.plot(lateral_offsets, energy_saving, color='#34d399', linewidth=2.5)
ax2.fill_between(lateral_offsets, energy_saving, where=energy_saving > 0,
                  alpha=0.2, color='#34d399')
ax2.axhline(0, color='gray', linewidth=0.5)
ax2.axvspan(-wingspan/2, wingspan/2, alpha=0.15, color='#f87171', label='Behind leader (downwash)')

optimal_pos = lateral_offsets[np.argmax(energy_saving)]
ax2.axvline(optimal_pos, color='#fbbf24', linestyle='--',
            label=f'Optimal position ({optimal_pos:.1f}m)')
ax2.set_xlabel('Lateral offset from leader (m)', color='lightgray')
ax2.set_ylabel('Energy saving (%)', color='lightgray')
ax2.set_title('Formation Flight Energy Savings', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=9)
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/hawk_vortex.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print(f"Maximum energy saving: {max(energy_saving):.1f}% at offset {optimal_pos:.2f} m")
print(f"Optimal position: {abs(optimal_pos)/wingspan*100:.0f}% of wingspan outboard of leader's tip")`,
      challenge: 'Model a V-formation of 7 hawks. Each hawk contributes vortices and benefits from all upstream hawks. What is the energy saving for the last hawk in the formation? Does the V-shape (echelon angle) matter?',
      successHint: 'You modeled wingtip vortices using the Biot-Savart law — the mathematical foundation of vortex dynamics. This physics explains formation flight, wake turbulence at airports, and the design of modern winglets. The hawks of Blue Mountain use cooperative vortex dynamics to reduce the energy cost of their seasonal migrations.',
    },
    {
      title: 'Multi-objective flight optimization',
      concept: `A hawk faces multiple, conflicting objectives during a cross-country flight:

1. **Maximize distance** (get to destination)
2. **Minimize energy** (conserve fat reserves)
3. **Minimize time** (arrive before dark / reach food source)
4. **Maximize safety** (avoid turbulence, predators, exhaustion)

These objectives conflict: fast travel (objective 3) costs more energy (conflicts with 2). Flying high is safe but slow (conflicts with 1 and 3).

The **Pareto front** is the set of solutions where no objective can be improved without worsening another. Multi-objective optimization finds this front.

📚 *We evaluate many random flight strategies, compute their multi-objective scores, and identify the Pareto-optimal set — strategies that represent the best possible tradeoffs.*`,
      analogy: 'Multi-objective optimization is like choosing a restaurant. You want the food to be cheap, fast, and good. But cheap+fast is usually not good (fast food). Good+cheap is usually slow (home cooking). Good+fast is expensive (fine dining). The Pareto front is the set of restaurants where you cannot improve one criterion without sacrificing another.',
      storyConnection: 'A hawk migrating past Blue Mountain makes thousands of micro-decisions per hour: which thermal to use, how long to circle, when to leave for the next one, how fast to glide. Each decision balances speed, energy, and safety. Evolution has equipped hawks with neural circuits that solve this multi-objective optimization in real time.',
      checkQuestion: 'Why is the Pareto front more useful than a single "best" solution?',
      checkAnswer: 'Because the "best" solution depends on priorities. A starving hawk should prioritize energy conservation (different from a hawk racing to a nesting site). The Pareto front shows all optimal tradeoffs, and the decision-maker (hawk or engineer) chooses based on current priorities. A single optimum assumes fixed priorities, which is rarely realistic.',
      codeIntro: 'Find the Pareto front of flight strategies balancing distance, energy, and time.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

np.random.seed(42)
n_strategies = 500

# Generate random flight strategies
# Parameters: thermal dwell time, glide speed, altitude ceiling
dwell_times = np.random.uniform(60, 300, n_strategies)  # seconds
glide_speeds = np.random.uniform(10, 28, n_strategies)   # m/s
alt_ceilings = np.random.uniform(500, 2000, n_strategies) # meters

# Evaluate each strategy (8-hour flight day)
distances = []
energies = []
times_to_100km = []

for i in range(n_strategies):
    dwell = dwell_times[i]
    v_glide = glide_speeds[i]
    alt_max = alt_ceilings[i]

    climb_rate = 2.5 - 0.001 * alt_max  # weaker at height
    alt_gained = climb_rate * dwell
    alt_gained = min(alt_gained, alt_max)

    glide_ratio = 15 - 0.2 * (v_glide - 15)  # L/D decreases at high speed
    glide_dist = alt_gained * max(glide_ratio, 3) / 1000  # km
    glide_time = glide_dist * 1000 / v_glide  # seconds

    cycle_time = dwell + glide_time
    cycles_per_day = 8 * 3600 / cycle_time

    total_dist = glide_dist * cycles_per_day
    energy_cost = 0.5 + 0.01 * v_glide**2  # relative
    total_energy = energy_cost * cycles_per_day

    time_100 = 100 / (total_dist / 8) if total_dist > 0 else 99  # hours

    distances.append(total_dist)
    energies.append(total_energy)
    times_to_100km.append(time_100)

distances = np.array(distances)
energies = np.array(energies)
times_100 = np.array(times_to_100km)

# Find Pareto front (maximize distance, minimize energy)
is_pareto = np.ones(n_strategies, dtype=bool)
for i in range(n_strategies):
    for j in range(n_strategies):
        if i != j:
            if distances[j] >= distances[i] and energies[j] <= energies[i]:
                if distances[j] > distances[i] or energies[j] < energies[i]:
                    is_pareto[i] = False
                    break

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Distance vs Energy
ax1.set_facecolor('#1f2937')
ax1.scatter(distances[~is_pareto], energies[~is_pareto],
            c='#4b5563', s=15, alpha=0.4, label='Dominated')
ax1.scatter(distances[is_pareto], energies[is_pareto],
            c='#34d399', s=40, zorder=5, label='Pareto optimal')

# Sort Pareto points for line
pareto_d = distances[is_pareto]
pareto_e = energies[is_pareto]
sort_idx = np.argsort(pareto_d)
ax1.plot(pareto_d[sort_idx], pareto_e[sort_idx], color='#34d399',
         linewidth=2, linestyle='--', alpha=0.7)

ax1.set_xlabel('Daily distance (km)', color='lightgray', fontsize=12)
ax1.set_ylabel('Energy cost (relative)', color='lightgray', fontsize=12)
ax1.set_title('Pareto Front — Distance vs Energy', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Strategy comparison
ax2.set_facecolor('#1f2937')
scatter = ax2.scatter(glide_speeds, dwell_times, c=distances,
                       cmap='viridis', s=20, alpha=0.6)
ax2.scatter(glide_speeds[is_pareto], dwell_times[is_pareto],
            c='white', s=60, marker='*', zorder=5, label='Pareto optimal')
plt.colorbar(scatter, ax=ax2, label='Distance (km)')

ax2.set_xlabel('Glide speed (m/s)', color='lightgray', fontsize=12)
ax2.set_ylabel('Thermal dwell time (s)', color='lightgray', fontsize=12)
ax2.set_title('Strategy Space', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/hawk_pareto.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print(f"Pareto optimal strategies: {np.sum(is_pareto)} out of {n_strategies}")
print(f"\
Example Pareto strategies:")
print(f"{'Distance':>10} {'Energy':>10} {'Speed':>8} {'Dwell':>8}")
for i in np.where(is_pareto)[0][:5]:
    print(f"{distances[i]:>10.0f} {energies[i]:>10.1f} {glide_speeds[i]:>8.1f} {dwell_times[i]:>8.0f}")`,
      challenge: 'Add a third objective: safety (inversely proportional to maximum altitude — higher is more exposed to predators and weather). Visualize the 3D Pareto surface. How does adding safety as an objective change the set of optimal strategies?',
      successHint: 'You performed multi-objective optimization and found the Pareto front — the gold standard for decision-making with conflicting goals. This technique is used in engineering design, investment portfolio optimization, and — as we have shown — understanding the flight strategies of soaring hawks over Blue Mountain.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Flight Dynamics & Optimization</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
