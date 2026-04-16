import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RasLilaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'N-body gravity — when dancers pull on each other',
      concept: `In reality, every mass attracts every other mass. In a system of N bodies, each body feels gravitational pull from all N-1 others. The total force on body i is:

**F_i = Sum over j (G x m_i x m_j / r_ij²) x r_hat_ij**

This is the **N-body problem** — one of the most famous unsolved problems in physics. For N >= 3, there is no general analytical solution. We must solve it numerically.

We use the **Verlet integration** method (better than Euler for energy conservation):
- v(t + dt/2) = v(t) + a(t) x dt/2
- x(t + dt) = x(t) + v(t + dt/2) x dt
- a(t + dt) = F(x(t + dt)) / m
- v(t + dt) = v(t + dt/2) + a(t + dt) x dt/2`,
      analogy: 'The N-body problem is like predicting the movement of people in a crowded room where everyone is connected by invisible rubber bands. Each person is pulled toward every other person. With 2 people, the motion is simple. With 3, it becomes complex. With 100, it is chaotic — small changes in initial positions lead to completely different outcomes.',
      storyConnection: 'In Ras Lila, each dancer is "pulled" by the rhythm and by adjacent dancers. If we replace this social connection with gravitational attraction, the dance becomes an N-body simulation — and the resulting patterns can be eerily similar to the traditional choreography.',
      checkQuestion: 'Why can we solve the 2-body problem analytically but not the 3-body problem?',
      checkAnswer: 'The 2-body problem reduces to a single effective body orbiting a fixed point. The equations decouple into independent radial and angular equations, both solvable. With 3 bodies, the equations remain coupled — the position of body 3 affects bodies 1 and 2, which affect body 3. This circular dependency prevents separation of variables. Henri Poincare proved in 1889 that no general closed-form solution exists.',
      codeIntro: 'Simulate an N-body gravitational system inspired by Ras Lila dancers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# N-body gravitational simulation (2D)
N = 6           # number of bodies (like 6 dancers)
G_sim = 1.0     # gravitational constant (simulation units)
dt = 0.01
steps = 3000

# Initial conditions: bodies arranged in a circle with tangential velocity
np.random.seed(42)
angle = np.linspace(0, 2*np.pi, N, endpoint=False)
r0 = 2.0  # initial circle radius

x = np.zeros((steps, N, 2))   # positions
v = np.zeros((steps, N, 2))   # velocities
masses = np.ones(N) * 1.0

# Set initial positions and velocities
for i in range(N):
    x[0, i] = r0 * np.array([np.cos(angle[i]), np.sin(angle[i])])
    # Tangential velocity for roughly circular orbit
    speed = 0.5
    v[0, i] = speed * np.array([-np.sin(angle[i]), np.cos(angle[i])])

def compute_forces(positions, masses):
    N = len(masses)
    forces = np.zeros((N, 2))
    for i in range(N):
        for j in range(N):
            if i != j:
                r_vec = positions[j] - positions[i]
                r_mag = np.sqrt(np.sum(r_vec**2)) + 0.05  # softening
                forces[i] += G_sim * masses[i] * masses[j] / r_mag**3 * r_vec
    return forces

# Verlet integration
for t in range(1, steps):
    forces = compute_forces(x[t-1], masses)
    a = forces / masses[:, None]
    v_half = v[t-1] + 0.5 * a * dt
    x[t] = x[t-1] + v_half * dt
    forces_new = compute_forces(x[t], masses)
    a_new = forces_new / masses[:, None]
    v[t] = v_half + 0.5 * a_new * dt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

colors = ['#ef4444', '#f59e0b', '#34d399', '#3b82f6', '#a78bfa', '#ec4899']
for i in range(N):
    ax1.plot(x[:, i, 0], x[:, i, 1], color=colors[i], linewidth=0.5, alpha=0.6)
    ax1.plot(x[0, i, 0], x[0, i, 1], 'o', color=colors[i], markersize=8)
    ax1.plot(x[-1, i, 0], x[-1, i, 1], 's', color=colors[i], markersize=6)

ax1.set_title(f'{N}-Body Gravitational Dance', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('x', color='white')
ax1.set_ylabel('y', color='white')
ax1.tick_params(colors='white')
ax1.set_aspect('equal')
ax1.grid(True, alpha=0.2, color='white')

# Energy conservation check
KE_total = np.zeros(steps)
PE_total = np.zeros(steps)
for t in range(steps):
    for i in range(N):
        KE_total[t] += 0.5 * masses[i] * np.sum(v[t, i]**2)
        for j in range(i+1, N):
            r = np.sqrt(np.sum((x[t,i] - x[t,j])**2)) + 0.05
            PE_total[t] -= G_sim * masses[i] * masses[j] / r

E_total = KE_total + PE_total
time = np.arange(steps) * dt
ax2.plot(time, KE_total, color='#34d399', linewidth=1, label='KE')
ax2.plot(time, PE_total, color='#ef4444', linewidth=1, label='PE')
ax2.plot(time, E_total, color='#f59e0b', linewidth=2, label='Total E')
ax2.set_title('Energy Conservation', color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Time', color='white')
ax2.set_ylabel('Energy', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('nbody.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

drift = abs(E_total[-1] - E_total[0]) / abs(E_total[0]) * 100
print(f"Energy drift: {drift:.2f}% (Verlet keeps this small)")
print(f"Bodies: {N}, Steps: {steps}, dt: {dt}")`,
      challenge: 'Add a massive central body (mass=10) at the origin. How does this change the dynamics? Does the system become more stable?',
      successHint: 'You just built an N-body gravitational simulator. This is the same approach used to model galaxy formation, star clusters, and planetary system evolution. The N-body problem remains one of computational physics\' grand challenges.',
    },
    {
      title: 'Hohmann transfer orbit — changing lanes in space',
      concept: `To move a spacecraft from one circular orbit to another, the most fuel-efficient method is the **Hohmann transfer orbit** — an elliptical path that touches both the initial and final orbits.

Steps:
1. **First burn**: at the inner orbit, fire engines forward to increase speed. The spacecraft enters an elliptical orbit with periapsis at the inner orbit and apoapsis at the outer orbit.
2. **Coast**: the spacecraft follows the ellipse (free — no fuel needed).
3. **Second burn**: at the outer orbit, fire engines forward again to circularise.

The required velocity changes (delta-v):
- delta_v1 = v_transfer_periapsis - v_inner_circular
- delta_v2 = v_outer_circular - v_transfer_apoapsis

Total delta_v = delta_v1 + delta_v2`,
      analogy: 'A Hohmann transfer is like changing lanes on a highway via an exit ramp. You speed up to enter the ramp (first burn), coast along the ramp, then adjust speed to match the new lane (second burn). The ramp is the transfer ellipse. Going directly (perpendicular lane change) would cost much more fuel.',
      storyConnection: 'In Ras Lila, when dancers transition from an inner circle to an outer circle, they do not jump directly outward. They take a curved, spiralling path — the dance equivalent of a Hohmann transfer. Physics governs both the optimal spacecraft trajectory and the graceful dance transition.',
      checkQuestion: 'Why not just point the rocket outward and fire?',
      checkAnswer: 'Firing radially outward wastes energy. The spacecraft already has tangential velocity from its current orbit. A radial burn fights against this velocity. A tangential burn works WITH the existing velocity, requiring much less fuel. The Hohmann transfer exploits this by making both burns tangential — adding to the existing orbital velocity.',
      codeIntro: 'Calculate and visualise a Hohmann transfer orbit from ISS to geostationary orbit.',
      code: `import numpy as np
import matplotlib.pyplot as plt

G = 6.674e-11
M = 5.972e24
R_earth = 6.371e6

r1 = R_earth + 400e3      # ISS orbit
r2 = R_earth + 35786e3    # Geostationary orbit

# Circular orbit velocities
v1_circ = np.sqrt(G * M / r1)
v2_circ = np.sqrt(G * M / r2)

# Transfer ellipse parameters
a_transfer = (r1 + r2) / 2  # semi-major axis
v1_transfer = np.sqrt(G * M * (2/r1 - 1/a_transfer))  # at periapsis
v2_transfer = np.sqrt(G * M * (2/r2 - 1/a_transfer))  # at apoapsis

delta_v1 = v1_transfer - v1_circ
delta_v2 = v2_circ - v2_transfer
total_dv = delta_v1 + delta_v2

# Transfer time = half the elliptical period
T_transfer = np.pi * np.sqrt(a_transfer**3 / (G * M))

fig, ax = plt.subplots(1, 1, figsize=(8, 8))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

theta = np.linspace(0, 2*np.pi, 200)

# Earth
earth = plt.Circle((0, 0), R_earth/1e6, color='#3b82f6', alpha=0.5)
ax.add_patch(earth)

# Inner orbit (ISS)
ax.plot(r1/1e6 * np.cos(theta), r1/1e6 * np.sin(theta), '--', color='#34d399', linewidth=1, label=f'ISS ({r1/1e3-R_earth/1e3:.0f} km)')

# Outer orbit (GEO)
ax.plot(r2/1e6 * np.cos(theta), r2/1e6 * np.sin(theta), '--', color='#f59e0b', linewidth=1, label=f'GEO ({r2/1e3-R_earth/1e3:.0f} km)')

# Transfer ellipse (half)
e_transfer = (r2 - r1) / (r2 + r1)
theta_half = np.linspace(0, np.pi, 200)
r_transfer = a_transfer * (1 - e_transfer**2) / (1 + e_transfer * np.cos(theta_half))
ax.plot(r_transfer/1e6 * np.cos(theta_half), r_transfer/1e6 * np.sin(theta_half),
        color='#ef4444', linewidth=3, label='Transfer orbit')

# Burn points
ax.plot(r1/1e6, 0, '*', color='#34d399', markersize=15, zorder=10, label=f'Burn 1: +{delta_v1/1000:.2f} km/s')
ax.plot(-r2/1e6, 0, '*', color='#f59e0b', markersize=15, zorder=10, label=f'Burn 2: +{delta_v2/1000:.2f} km/s')

ax.set_title('Hohmann Transfer: ISS to Geostationary', color='white', fontsize=13, fontweight='bold')
ax.set_xlabel('x (1000 km)', color='white')
ax.set_ylabel('y (1000 km)', color='white')
ax.tick_params(colors='white')
ax.set_aspect('equal')
ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=9, loc='upper right')
ax.grid(True, alpha=0.15, color='white')

plt.tight_layout()
plt.savefig('hohmann.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print(f"ISS orbit: r = {r1/1e3:.0f} km, v = {v1_circ/1000:.2f} km/s")
print(f"GEO orbit: r = {r2/1e3:.0f} km, v = {v2_circ/1000:.2f} km/s")
print(f"\
Transfer orbit:")
print(f"  Semi-major axis: {a_transfer/1e6:.1f} x 10⁶ m")
print(f"  Burn 1 (at ISS): Δv = {delta_v1/1000:.3f} km/s")
print(f"  Burn 2 (at GEO): Δv = {delta_v2/1000:.3f} km/s")
print(f"  Total Δv: {total_dv/1000:.3f} km/s")
print(f"  Transfer time: {T_transfer/3600:.1f} hours")`,
      challenge: 'Calculate the Hohmann transfer from Earth orbit to Mars orbit (around the Sun). r1 = 1 AU, r2 = 1.524 AU. How long does the transfer take?',
      successHint: 'The Hohmann transfer is the most fuel-efficient way to change orbits and has been used by virtually every interplanetary mission. You just calculated the same trajectory that sent satellites to geostationary orbit.',
    },
    {
      title: 'Tidal locking — when the dance freezes',
      concept: `The Moon always shows the same face to Earth. This is **tidal locking** — when an orbiting body\'s rotation period equals its orbital period, so one side always faces the central body.

Tidal locking happens because:
1. The central body\'s gravity creates a slight **bulge** on the near side of the orbiting body
2. If the orbiting body rotates faster than it orbits, the bulge is dragged ahead
3. Gravity pulls back on the bulge, creating a **tidal torque** that slows the rotation
4. Over millions of years, the rotation slows until rotation = orbit period

The tidal torque is: tau ~ (M/m) x (R/r)³

Larger mass ratios and closer orbits produce stronger tidal locking.`,
      analogy: 'Tidal locking is like a dancer who starts spinning freely but is gradually pulled by a partner\'s gaze until they always face the partner. The "gravitational gaze" (tidal torque) is weak per rotation but relentless over millions of years, eventually locking the orientation.',
      storyConnection: 'In Ras Lila, some choreographies have dancers always facing the centre (representing tidal locking) while others have dancers spinning freely. The tidal locking formation requires more discipline but creates a powerful visual — all faces toward the centre, like moons locked to their planet.',
      checkQuestion: 'Is the Moon slowing down or has tidal locking already completed?',
      checkAnswer: 'Tidal locking of the Moon is complete — its rotation period equals its orbital period (27.3 days). But the Moon is still tidally affecting Earth: Earth\'s rotation is slowing by about 2.3 milliseconds per century due to tidal friction from the Moon. In the far future, Earth will also become tidally locked to the Moon.',
      codeIntro: 'Simulate the tidal locking process — a spinning body gradually synchronising with its orbit.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Tidal locking simulation
# A moon starts spinning fast and gradually locks to its orbital period

T_orbit = 27.3          # orbital period (days)
omega_orbit = 2 * np.pi / T_orbit

# Initial spin: 4x orbital rate (moon spinning fast)
omega_spin_initial = 4 * omega_orbit

# Tidal torque coefficient (determines how fast locking occurs)
tau_coeff = 0.0002      # simplified tidal coupling

dt = 0.1  # days
t_max = 30000  # days
steps = int(t_max / dt)

t = np.zeros(steps)
omega_spin = np.zeros(steps)
spin_angle = np.zeros(steps)
orbital_angle = np.zeros(steps)

omega_spin[0] = omega_spin_initial

for i in range(1, steps):
    t[i] = i * dt
    orbital_angle[i] = omega_orbit * t[i]

    # Tidal torque tries to synchronise spin with orbit
    delta_omega = omega_spin[i-1] - omega_orbit
    tidal_torque = -tau_coeff * delta_omega
    omega_spin[i] = omega_spin[i-1] + tidal_torque * dt
    spin_angle[i] = spin_angle[i-1] + omega_spin[i] * dt

# Compute the angle difference (should approach constant when locked)
angle_diff = (spin_angle - orbital_angle) % (2 * np.pi)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

t_years = t / 365.25

ax1.plot(t_years, omega_spin / omega_orbit, color='#3b82f6', linewidth=1.5, label='Spin / Orbital rate')
ax1.axhline(y=1, color='#34d399', linestyle='--', alpha=0.7, label='Locked (ratio = 1)')
ax1.set_title('Tidal Locking: Spin Synchronisation', color='white', fontsize=13, fontweight='bold')
ax1.set_ylabel('ω_spin / ω_orbit', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax1.grid(True, alpha=0.2, color='white')
ax1.set_ylim(0, 4.5)

ax2.plot(t_years, np.degrees(angle_diff), color='#f59e0b', linewidth=0.5, alpha=0.8)
ax2.set_title('Face Angle Relative to Planet', color='white', fontsize=13, fontweight='bold')
ax2.set_xlabel('Time (years)', color='white')
ax2.set_ylabel('Angle difference (degrees)', color='white')
ax2.tick_params(colors='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('tidal_lock.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

# Find locking time
locked_idx = np.argmax(np.abs(omega_spin / omega_orbit - 1) < 0.01)
lock_time_years = t[locked_idx] / 365.25
print(f"Initial spin rate: {omega_spin_initial/omega_orbit:.1f}x orbital rate")
print(f"Tidal locking achieved after ~{lock_time_years:.0f} years")
print(f"Final spin/orbit ratio: {omega_spin[-1]/omega_orbit:.4f}")`,
      challenge: 'What if the tidal coupling is 10x stronger (tau_coeff = 0.002)? How much faster does locking occur? In reality, closer moons lock faster — increase tau_coeff to represent a moon orbiting at half the distance.',
      successHint: 'Tidal locking is why we only see one face of the Moon, and why many exoplanets close to their stars may have permanent day and night sides. You just simulated a process that takes millions of years in nature.',
    },
    {
      title: 'Lagrange points — where dancers can stand still',
      concept: `In a two-body system (like Earth-Sun), there are five special points where a third small body can remain stationary relative to the other two. These are the **Lagrange points** L1-L5.

- **L1**: between the two bodies (balance of gravity)
- **L2**: behind the smaller body (gravity + centrifugal balance)
- **L3**: behind the larger body (opposite side)
- **L4 & L5**: forming equilateral triangles with the two bodies (stable!)

L4 and L5 are particularly remarkable: they are **stable equilibria**. Small objects naturally collect there — this is why Jupiter has "Trojan" asteroids at its L4 and L5 points.

The L1 point distance from Earth: r_L1 = R x (M_earth / (3 x M_sun))^(1/3)`,
      analogy: 'Lagrange points are like calm spots in a whirlpool. Most of the water is moving, but there are specific locations where the currents cancel out and a floating leaf stays put. The L4 and L5 points are like eddies where debris naturally accumulates.',
      storyConnection: 'In Ras Lila, certain positions in the formation are "rest points" where dancers barely move while those around them dance vigorously. These are the choreographic equivalent of Lagrange points — special positions of balance in a dynamic system.',
      checkQuestion: 'Why are L4 and L5 stable but L1, L2, L3 unstable?',
      checkAnswer: 'L1, L2, L3 are saddle points — stable in one direction but unstable in another (like sitting on a mountain ridge). Any sideways perturbation sends the object drifting away. L4 and L5 are stable because the Coriolis force (in the rotating frame) pushes displaced objects back toward the Lagrange point. It is like a bowl versus a ridge.',
      codeIntro: 'Calculate and visualise the five Lagrange points of the Earth-Sun system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Earth-Sun system Lagrange points
M_sun = 1.989e30
M_earth = 5.972e24
R = 1.496e11  # Earth-Sun distance (1 AU)

# Mass ratio
mu = M_earth / (M_sun + M_earth)

# L1: approximately R * (mu/3)^(1/3) from Earth toward Sun
r_L1 = R * (mu / 3) ** (1/3)
# L2: approximately R * (mu/3)^(1/3) from Earth away from Sun
r_L2 = R * (mu / 3) ** (1/3)

# Positions in AU
L1 = np.array([1 - r_L1/R, 0])
L2 = np.array([1 + r_L2/R, 0])
L3 = np.array([-1 - 5/12 * mu, 0])
L4 = np.array([0.5 - mu, np.sqrt(3)/2])
L5 = np.array([0.5 - mu, -np.sqrt(3)/2])

fig, ax = plt.subplots(1, 1, figsize=(9, 8))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Earth orbit
theta = np.linspace(0, 2*np.pi, 200)
ax.plot(np.cos(theta), np.sin(theta), '--', color='#3b82f6', alpha=0.3, linewidth=1)

# Sun and Earth
ax.plot(0, 0, 'o', color='#fbbf24', markersize=20, zorder=10)
ax.annotate('Sun', (0.05, -0.08), color='#fbbf24', fontsize=10, fontweight='bold')
ax.plot(1, 0, 'o', color='#3b82f6', markersize=10, zorder=10)
ax.annotate('Earth', (1.05, -0.08), color='#3b82f6', fontsize=10, fontweight='bold')

# Lagrange points
lagrange = {'L1': L1, 'L2': L2, 'L3': L3, 'L4': L4, 'L5': L5}
lp_colors = {'L1': '#ef4444', 'L2': '#f59e0b', 'L3': '#a78bfa', 'L4': '#34d399', 'L5': '#34d399'}
lp_styles = {'L1': 'x', 'L2': 'x', 'L3': 'x', 'L4': '^', 'L5': 'v'}

for name, pos in lagrange.items():
    ax.plot(pos[0], pos[1], lp_styles[name], color=lp_colors[name], markersize=15, markeredgewidth=3, zorder=8)
    offset = (0.05, 0.05) if name != 'L5' else (0.05, -0.12)
    ax.annotate(name, (pos[0]+offset[0], pos[1]+offset[1]), color=lp_colors[name], fontsize=12, fontweight='bold')

# Draw equilateral triangle for L4/L5
triangle = plt.Polygon([L4, [0,0], [1,0]], fill=False, edgecolor='#34d399', linewidth=1, linestyle='--', alpha=0.4)
ax.add_patch(triangle)
triangle2 = plt.Polygon([L5, [0,0], [1,0]], fill=False, edgecolor='#34d399', linewidth=1, linestyle='--', alpha=0.4)
ax.add_patch(triangle2)

ax.set_title('Lagrange Points of the Earth-Sun System', color='white', fontsize=14, fontweight='bold')
ax.set_xlabel('x (AU)', color='white')
ax.set_ylabel('y (AU)', color='white')
ax.tick_params(colors='white')
ax.set_aspect('equal')
ax.grid(True, alpha=0.15, color='white')
ax.set_xlim(-1.6, 1.6)
ax.set_ylim(-1.3, 1.3)

plt.tight_layout()
plt.savefig('lagrange.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("Lagrange points (in AU from Sun):")
for name, pos in lagrange.items():
    dist_from_earth = np.sqrt((pos[0]-1)**2 + pos[1]**2)
    print(f"  {name}: ({pos[0]:.4f}, {pos[1]:.4f}) — {dist_from_earth*149.6:.1f} million km from Earth")
print(f"\
L1 distance from Earth: {r_L1/1e6:.1f} x 10⁶ km = {r_L1/R*100:.2f}% of AU")
print("The James Webb Space Telescope orbits near L2!")`,
      challenge: 'The JWST is at L2. Calculate how far L2 is from Earth in km. How long does a signal take to travel from JWST to Earth at the speed of light?',
      successHint: 'Lagrange points are essential for space mission design. L2 hosts several telescopes (JWST, Planck, Gaia), and L4/L5 may become locations for future space stations. You just calculated these positions from first principles.',
    },
    {
      title: 'Gravitational slingshot — stealing energy from planets',
      concept: `A spacecraft can gain speed by flying close to a planet — the **gravitational slingshot** (or gravity assist). In the planet\'s reference frame, the spacecraft\'s speed does not change. But in the Sun\'s frame, it can gain (or lose) enormous speed.

The maximum velocity change is:
**delta_v = 2 x v_planet**

Where v_planet is the planet\'s orbital speed. For Jupiter (v ≈ 13 km/s), a single flyby can add up to 26 km/s — more than twice the speed change from any chemical rocket.

The slingshot works because the spacecraft "borrows" a tiny amount of the planet\'s orbital energy. The planet slows down imperceptibly (by nanometres per year) while the spacecraft gains enormous speed.`,
      analogy: 'A gravitational slingshot is like bouncing a tennis ball off a moving train. In the train\'s reference frame, the ball bounces back at the same speed. But from the ground, the ball flies away much faster because it gained the train\'s speed. The planet is the "moving train."',
      storyConnection: 'In Ras Lila, when a dancer briefly holds hands with a faster-moving dancer in an adjacent ring, the slower dancer is accelerated — slung forward by the brief connection. This is the dance equivalent of a gravitational slingshot: brief contact, large speed change.',
      checkQuestion: 'Voyager 2 used gravity assists from Jupiter, Saturn, Uranus, and Neptune. Why did it need so many?',
      checkAnswer: 'Each assist changes the spacecraft\'s direction and speed. Jupiter gave Voyager the big speed boost, but also aimed it at Saturn. Saturn aimed it at Uranus, and so on. Without multiple assists, Voyager would have needed vastly more fuel (or a more powerful rocket that did not exist). The Grand Tour alignment of planets only happens once every 175 years.',
      codeIntro: 'Simulate a gravitational slingshot around Jupiter and calculate the speed gain.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Gravitational slingshot around Jupiter
v_jupiter = 13.07e3  # Jupiter's orbital speed (m/s)
M_jupiter = 1.898e27
G = 6.674e-11

# Spacecraft approaches Jupiter from behind
v_spacecraft_initial = 10e3  # 10 km/s relative to Sun

# In Jupiter's reference frame
v_approach = v_spacecraft_initial - (-v_jupiter)  # relative to Jupiter

# Closest approach distance determines deflection
r_min_options = np.array([1, 2, 5, 10, 20]) * 7.15e7  # multiples of Jupiter radius

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# For a hyperbolic trajectory, deflection angle:
# sin(theta/2) = 1 / (1 + r_min * v_inf^2 / (G*M))
v_inf = abs(v_approach)  # hyperbolic excess velocity
delta_vs = []
deflections = []

for r_min in r_min_options:
    e = 1 + r_min * v_inf**2 / (G * M_jupiter)  # eccentricity
    theta = 2 * np.arcsin(1 / e)  # deflection angle
    deflections.append(np.degrees(theta))

    # Speed change in Sun's frame
    # v_out = v_jupiter + v_inf (in best case, 180 degree deflection)
    # More precisely: delta_v = 2 * v_inf * sin(theta/2) (in planet frame)
    dv_planet_frame = 2 * v_inf * np.sin(theta / 2)
    # In Sun's frame, the boost depends on geometry
    v_out = np.sqrt(v_spacecraft_initial**2 + 2*v_jupiter*dv_planet_frame*np.cos(0))
    delta_v_sun = v_out - v_spacecraft_initial
    delta_vs.append(delta_v_sun)

r_jupiter_radii = r_min_options / 7.15e7

ax1.plot(r_jupiter_radii, deflections, 'o-', color='#f59e0b', linewidth=2, markersize=8)
ax1.set_title('Deflection Angle vs Closest Approach', color='white', fontsize=11, fontweight='bold')
ax1.set_xlabel('Closest approach (Jupiter radii)', color='white')
ax1.set_ylabel('Deflection (degrees)', color='white')
ax1.tick_params(colors='white')
ax1.grid(True, alpha=0.2, color='white')

ax2.bar(range(len(r_min_options)), np.array(delta_vs)/1000, color='#34d399', edgecolor='white', linewidth=0.5)
ax2.set_xticks(range(len(r_min_options)))
ax2.set_xticklabels([f'{r:.0f} Rj' for r in r_jupiter_radii])
ax2.set_title('Speed Gain from Jupiter Slingshot', color='white', fontsize=11, fontweight='bold')
ax2.set_xlabel('Closest approach', color='white')
ax2.set_ylabel('Speed gain (km/s)', color='white')
ax2.tick_params(colors='white')

plt.tight_layout()
plt.savefig('slingshot.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("Jupiter Gravity Assist Analysis:")
print(f"Initial speed: {v_spacecraft_initial/1000:.1f} km/s")
print(f"Jupiter speed: {v_jupiter/1000:.2f} km/s\
")
for r, defl, dv in zip(r_jupiter_radii, deflections, delta_vs):
    print(f"  r_min = {r:.0f} Rj: deflection = {defl:.1f}°, Δv = {dv/1000:.1f} km/s")
print(f"\
Maximum theoretical Δv (180° deflection): {2*v_jupiter/1000:.1f} km/s")`,
      challenge: 'Calculate the slingshot for Saturn (v = 9.68 km/s, M = 5.68e26, R = 5.82e7 m). How does it compare to Jupiter? Which planet gives better gravity assists?',
      successHint: 'Gravitational slingshots are the most elegant trick in space travel — gaining enormous speed from nothing but gravity. Every outer solar system mission has used them, and you just calculated the physics behind them.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Orbital Mechanics</span>
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
