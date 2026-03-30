import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import VimanaLiftDragDiagram from '../diagrams/VimanaLiftDragDiagram';
import VimanaBernoulliDiagram from '../diagrams/VimanaBernoulliDiagram';
import VimanaJetEngineDiagram from '../diagrams/VimanaJetEngineDiagram';
import VimanaRocketDiagram from '../diagrams/VimanaRocketDiagram';
import OrbitalMechanicsDiagram from '../diagrams/OrbitalMechanicsDiagram';
import GravitationalFieldDiagram from '../diagrams/GravitationalFieldDiagram';

export default function VimanaLevel4() {
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
      title: 'Navier-Stokes fundamentals \u2014 the equations of fluid motion',
      concept: `All of aerodynamics ultimately reduces to the **Navier-Stokes equations** \u2014 the governing equations for fluid motion. They express Newton\u2019s second law (F = ma) applied to every infinitesimal parcel of fluid:

**\u03C1(Du/Dt) = -\u2207P + \u03BC\u2207\u00B2u + \u03C1g**

Where:
- Left side: mass \u00D7 acceleration of a fluid element
- **-\u2207P**: pressure gradient force
- **\u03BC\u2207\u00B2u**: viscous (friction) force
- **\u03C1g**: gravitational body force

These equations are so complex that no general analytical solution exists \u2014 proving whether smooth solutions always exist is one of the seven Millennium Prize Problems ($1 million bounty).

We cannot solve them exactly, but we can solve them **numerically** \u2014 discretising space into a grid and computing forces at each point. This is the basis of **Computational Fluid Dynamics (CFD)**.

The code implements a simple 2D flow solver using the stream function-vorticity formulation.`,
      analogy: 'The Navier-Stokes equations are the "laws of physics" for every fluid on Earth. Pouring cream into coffee, wind blowing around a building, blood flowing through arteries, air over a wing \u2014 all governed by these same equations. They are to fluids what F = ma is to solid objects, but infinitely more complex because every tiny parcel of fluid is simultaneously pushed by pressure, slowed by friction, and pulled by gravity.',
      storyConnection: 'Vishwakarma, the divine engineer, created the Vimana with perfect knowledge of how air behaves. Modern aerospace engineers use CFD to simulate millions of points around an aircraft, solving the Navier-Stokes equations at each one. A single high-fidelity simulation of airflow around a full aircraft can take weeks on a supercomputer.',
      checkQuestion: 'Why is the Navier-Stokes existence and smoothness problem worth $1 million?',
      checkAnswer: 'The equations perfectly describe real fluid motion, yet we cannot prove they always produce smooth, finite solutions from smooth initial conditions. There might be cases where velocity becomes infinite (a singularity) in finite time. Understanding this would have profound implications for turbulence theory and whether our mathematical models of reality are fundamentally consistent.',
      codeIntro: 'Implement a simplified 2D potential flow solver around a cylinder.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 2D potential flow around a cylinder
# Exact solution: superposition of uniform flow + doublet + vortex

U_inf = 1.0     # freestream velocity
R = 1.0         # cylinder radius
Gamma = 4.0     # circulation (determines lift)

# Create grid
nx, ny = 200, 200
x = np.linspace(-4, 4, nx)
y = np.linspace(-3, 3, ny)
X, Y = np.meshgrid(x, y)
r = np.sqrt(X**2 + Y**2)
theta = np.arctan2(Y, X)

# Mask the cylinder interior
mask = r < R

# Velocity components (polar to Cartesian)
# v_r = U_inf * (1 - R^2/r^2) * cos(theta)
# v_theta = -U_inf * (1 + R^2/r^2) * sin(theta) + Gamma/(2*pi*r)
vr = U_inf * (1 - R**2/r**2) * np.cos(theta)
vt = -U_inf * (1 + R**2/r**2) * np.sin(theta) + Gamma / (2 * np.pi * r)

u = vr * np.cos(theta) - vt * np.sin(theta)
v = vr * np.sin(theta) + vt * np.cos(theta)

# Speed and pressure coefficient
speed = np.sqrt(u**2 + v**2)
Cp = 1 - (speed / U_inf)**2

# Mask cylinder
u[mask] = 0; v[mask] = 0; speed[mask] = 0; Cp[mask] = 0

# Stream function
psi = U_inf * Y * (1 - R**2/r**2) + Gamma / (2*np.pi) * np.log(r/R)
psi[mask] = np.nan

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Streamlines
ax1.contour(X, Y, psi, levels=30, colors='royalblue', linewidths=0.8)
circle = plt.Circle((0, 0), R, color='gray', fill=True)
ax1.add_patch(circle)
ax1.set_xlim(-3, 3); ax1.set_ylim(-2.5, 2.5)
ax1.set_aspect('equal')
ax1.set_title(f'Streamlines (\u0393 = {Gamma:.1f})', fontsize=13)
ax1.set_xlabel('x/R'); ax1.set_ylabel('y/R')
ax1.grid(alpha=0.2)

# Pressure field
cp_plot = ax2.contourf(X, Y, Cp, levels=20, cmap='RdBu_r')
circle2 = plt.Circle((0, 0), R, color='gray', fill=True)
ax2.add_patch(circle2)
plt.colorbar(cp_plot, ax=ax2, label='C_p')
ax2.set_xlim(-3, 3); ax2.set_ylim(-2.5, 2.5)
ax2.set_aspect('equal')
ax2.set_title('Pressure Coefficient', fontsize=13)
ax2.set_xlabel('x/R'); ax2.set_ylabel('y/R')

plt.tight_layout()
plt.show()

# Kutta-Joukowski theorem: Lift = rho * U * Gamma
L_per_unit = 1.225 * U_inf * Gamma
print(f"Circulation \u0393 = {Gamma:.1f}")
print(f"Kutta-Joukowski lift (per unit span): L = \u03c1U\u0393 = {L_per_unit:.2f} N/m")
print(f"\\nNote: asymmetric streamlines = net upward force (LIFT)")
print(f"The stagnation points have shifted due to circulation.")`,
      challenge: 'Set Gamma = 0 (no circulation). The flow becomes symmetric and there is no lift \u2014 this is d\u2019Alembert\u2019s paradox. Then gradually increase Gamma and observe how asymmetry (and lift) develops.',
      successHint: 'Potential flow theory gives exact solutions for idealised flows. The Kutta-Joukowski theorem \u2014 L = \u03C1U\u0393 \u2014 is one of the most elegant results in all of physics. Real wings generate circulation naturally through their shape and the Kutta condition at the trailing edge.',
    },
    {
      title: 'Gravity assist \u2014 stealing speed from planets',
      concept: `The most ingenious trick in space mission design is the **gravity assist** (or gravitational slingshot). A spacecraft flies close to a planet, and the planet\u2019s gravity bends its trajectory and changes its speed \u2014 all without burning any fuel.

From the planet\u2019s reference frame, the spacecraft enters and exits at the same speed (elastic collision). But the planet is moving through space. In the Sun\u2019s reference frame, the spacecraft gains or loses speed depending on whether it passes behind or in front of the planet.

The maximum \u0394v from a gravity assist is **2 \u00D7 v_planet** (in the limiting case of a 180\u00B0 turn). For Jupiter, v_planet \u2248 13 km/s, so a gravity assist can provide up to ~26 km/s \u2014 more than twice Earth\u2019s escape velocity, for free.

Voyager 2 used gravity assists at Jupiter, Saturn, Uranus, and Neptune, reaching 17 km/s \u2014 fast enough to leave the solar system entirely.`,
      analogy: 'Imagine throwing a tennis ball at a moving truck. If you throw it at the front of the truck (moving toward you), the ball bounces back much faster than you threw it. The ball "stole" kinetic energy from the truck. The truck barely noticed (it is so massive), but the ball gained enormous speed. A gravity assist works the same way: the spacecraft is the ball, the planet is the truck.',
      storyConnection: 'The Pushpaka Vimana moved at the speed of thought. Real interplanetary spacecraft need every trick available to reach distant planets. ISRO\u2019s Mangalyaan mission to Mars used a clever series of orbit-raising manoeuvres from Earth orbit, saving fuel. Gravity assists at Mars were not used for Mangalyaan, but they are essential for missions to the outer solar system.',
      checkQuestion: 'Could you use a gravity assist to slow down? When would you want to?',
      checkAnswer: 'Yes. If you pass in front of a planet (relative to its orbital motion), you lose speed instead of gaining it. This is useful for missions to the inner solar system \u2014 you need to slow down to drop closer to the Sun. MESSENGER used gravity assists at Venus to slow down enough to enter Mercury orbit.',
      codeIntro: 'Simulate a gravity assist around Jupiter.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified gravity assist simulation
# Planet: Jupiter
v_planet = 13.07e3  # Jupiter orbital velocity (m/s)
M_jupiter = 1.898e27
G = 6.674e-11
R_jupiter = 7.149e7

# Spacecraft approaches Jupiter from behind (gains speed)
v_approach_inf = 10e3  # approach speed relative to Sun (m/s)
v_rel = v_approach_inf  # relative to Jupiter (simplified: approaching from behind)

# Different closest approach distances
r_perijove = np.linspace(1.5 * R_jupiter, 20 * R_jupiter, 100)

# Deflection angle: sin(delta/2) = 1 / (1 + r_p * v_rel^2 / (G*M))
e_param = 1 + r_perijove * v_rel**2 / (G * M_jupiter)
delta = 2 * np.arcsin(1 / e_param)

# Speed gain in Sun's frame
# v_out^2 = v_in^2 + 2*v_planet*v_rel*(1 - cos(delta))
# Simplified: delta_v = 2 * v_rel * sin(delta/2) (in planet frame, redirected)
dv_gain = 2 * v_rel * np.sin(delta / 2)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(r_perijove / R_jupiter, np.degrees(delta), linewidth=2.5, color='royalblue')
ax1.set_xlabel('Closest approach (Jupiter radii)', fontsize=11)
ax1.set_ylabel('Deflection angle (\u00b0)', fontsize=11)
ax1.set_title('Trajectory Bending', fontsize=13)
ax1.grid(alpha=0.3)

ax2.plot(r_perijove / R_jupiter, dv_gain / 1000, linewidth=2.5, color='green')
ax2.set_xlabel('Closest approach (Jupiter radii)', fontsize=11)
ax2.set_ylabel('\u0394v gain (km/s)', fontsize=11)
ax2.set_title('Speed Gain from Gravity Assist', fontsize=13)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

# Simulate the trajectory in 2D
r_p = 2.0 * R_jupiter  # closest approach
v_inf = v_rel
e = 1 + r_p * v_inf**2 / (G * M_jupiter)
a = r_p / (e - 1)

theta = np.linspace(-np.pi + 0.1, np.pi - 0.1, 500)
r = a * (e**2 - 1) / (1 + e * np.cos(theta))
valid = r > 0

x = r[valid] * np.cos(theta[valid]) / R_jupiter
y = r[valid] * np.sin(theta[valid]) / R_jupiter

plt.figure(figsize=(8, 8))
plt.plot(x, y, linewidth=2, color='green', label='Spacecraft trajectory')
circle = plt.Circle((0, 0), 1, color='orange', alpha=0.7, label='Jupiter')
plt.gca().add_patch(circle)
plt.arrow(-15, -5, 5, 0, head_width=0.5, color='blue', alpha=0.5)
plt.text(-12, -6.5, f'Approach ({v_approach_inf/1000:.0f} km/s)', fontsize=10, color='blue')
defl = 2 * np.arcsin(1 / e)
print(f"\\n=== Jupiter Gravity Assist ===")
print(f"Closest approach: {r_p/R_jupiter:.1f} Jupiter radii")
print(f"Deflection angle: {np.degrees(defl):.1f}\u00b0")
print(f"Speed gain: {2*v_inf*np.sin(defl/2)/1000:.1f} km/s")
print(f"\\nEntry speed (Sun frame): {v_approach_inf/1000:.0f} km/s")
print(f"Exit speed (Sun frame): ~{(v_approach_inf + 2*v_inf*np.sin(defl/2))/1000:.0f} km/s")
print(f"Free \u0394v = {2*v_inf*np.sin(defl/2)/1000:.1f} km/s (no fuel spent!)")

plt.xlim(-20, 20); plt.ylim(-15, 15)
plt.gca().set_aspect('equal')
plt.xlabel('x (Jupiter radii)'); plt.ylabel('y (Jupiter radii)')
plt.title(f'Gravity Assist Trajectory (deflection = {np.degrees(defl):.0f}\u00b0)', fontsize=13)
plt.legend(fontsize=9); plt.grid(alpha=0.2)
plt.show()`,
      challenge: 'Calculate the gravity assist for Venus (M = 4.87\u00D710\u00B2\u2074 kg, R = 6.05\u00D710\u2076 m, v_orbital = 35 km/s). How does it compare to Jupiter? Why is Venus useful for missions to Mercury?',
      successHint: 'Gravity assists transform mission design. Without them, we could not have explored the outer solar system \u2014 the \u0394v requirements would be impossibly high. Voyager, Cassini, New Horizons, and JUICE all depend on this elegant hack of orbital mechanics.',
    },
    {
      title: 'Multi-body trajectory optimisation',
      concept: `Real interplanetary missions do not fly in straight lines. They use a sequence of gravity assists, each carefully timed to exploit planetary alignments. Finding the optimal sequence is a **combinatorial optimisation problem** \u2014 which planets, in which order, with what timing?

The **porkchop plot** is the aerospace engineer\u2019s primary tool. It shows the \u0394v cost of a mission for every possible combination of launch date and arrival date. The minimum-energy trajectories appear as "sweet spots" on the plot.

The code generates a simplified porkchop plot for an Earth-to-Mars transfer, showing how launch windows are constrained by planetary alignment. Mars launch windows open approximately every **26 months** (synodic period).`,
      analogy: 'Planning an interplanetary trajectory is like planning a road trip where all the cities are constantly moving. You cannot just drive to Mars \u2014 you have to predict where Mars will be when you arrive, aim for that point, and time your departure so that you arrive with minimum fuel. Miss the window and you wait 26 months for the next opportunity.',
      storyConnection: 'The Pushpaka Vimana could go anywhere at any time. Real space missions are slaves to orbital mechanics and planetary alignment. ISRO\u2019s Mangalyaan launched in November 2013 during a narrow window \u2014 if they had missed it, the next opportunity would have been in 2016.',
      checkQuestion: 'Why do Mars launch windows occur every 26 months instead of every 12 months?',
      checkAnswer: 'The 26-month period is the **synodic period** of Mars relative to Earth. Earth orbits the Sun in 365 days, Mars in 687 days. It takes 780 days (26 months) for Earth to "lap" Mars and return to the same relative position. The optimal Hohmann transfer geometry recurs at this interval.',
      codeIntro: 'Generate a porkchop plot for Earth-Mars transfer windows.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified Earth-Mars porkchop plot
# Using vis-viva equation for Hohmann-like transfers

G = 6.674e-11
M_sun = 1.989e30
r_earth = 1.496e11  # AU in metres
r_mars = 2.279e11

# Earth and Mars orbital periods (days)
T_earth = 365.25
T_mars = 686.97

# Angular positions (simplified circular orbits)
def planet_angle(t_days, T):
    return 2 * np.pi * t_days / T

# Launch dates: range over 3 years
launch_days = np.arange(0, 1100, 5)
# Flight durations: 150 to 400 days
flight_days = np.arange(150, 401, 5)

# Calculate delta-v for each combination
dv_grid = np.zeros((len(flight_days), len(launch_days)))

for i, tof in enumerate(flight_days):
    for j, t_launch in enumerate(launch_days):
        t_arrive = t_launch + tof

        # Angular positions at launch and arrival
        theta_e = planet_angle(t_launch, T_earth)
        theta_m = planet_angle(t_arrive, T_mars)

        # Transfer angle
        d_theta = (theta_m - theta_e) % (2 * np.pi)

        # Semi-major axis of transfer orbit (approximation)
        # For a given transfer angle and time, use Lambert's problem
        # Simplified: use Hohmann as baseline and penalise deviations
        a_hohmann = (r_earth + r_mars) / 2
        tof_hohmann = np.pi * np.sqrt(a_hohmann**3 / (G * M_sun)) / 86400  # days

        # Delta-v penalty for non-optimal transfer
        tof_ratio = tof / tof_hohmann
        angle_penalty = abs(np.sin(d_theta - np.pi))
        dv_base = 3.6  # km/s (Hohmann minimum)
        dv = dv_base * (1 + 0.5 * abs(tof_ratio - 1) + 0.8 * angle_penalty)
        dv_grid[i, j] = dv

plt.figure(figsize=(12, 7))
levels = np.arange(3.5, 12, 0.5)
cs = plt.contourf(launch_days, flight_days, dv_grid, levels=levels, cmap='RdYlGn_r')
plt.colorbar(cs, label='Total \u0394v (km/s)')
plt.contour(launch_days, flight_days, dv_grid, levels=[4.0, 5.0, 6.0], colors='black', linewidths=0.5)

plt.xlabel('Launch date (days from epoch)', fontsize=12)
plt.ylabel('Flight time (days)', fontsize=12)
plt.title('Porkchop Plot: Earth to Mars Transfer', fontsize=14)
plt.grid(alpha=0.2)
plt.show()

# Find minimum delta-v
min_idx = np.unravel_index(np.argmin(dv_grid), dv_grid.shape)
best_tof = flight_days[min_idx[0]]
best_launch = launch_days[min_idx[1]]
best_dv = dv_grid[min_idx]

print(f"=== Optimal Earth-Mars Transfer ===")
print(f"Best launch: day {best_launch}")
print(f"Flight time: {best_tof} days ({best_tof/30:.1f} months)")
print(f"Minimum \u0394v: {best_dv:.2f} km/s")
print(f"\\nMars synodic period: {T_earth * T_mars / abs(T_mars - T_earth):.0f} days (~26 months)")
print(f"Next launch windows appear as blue valleys on the plot")
print(f"Missing a window means waiting ~780 days for the next one")`,
      challenge: 'Modify the code to generate a porkchop plot for Earth-to-Venus. Venus is closer (r = 1.082\u00D710\u00B9\u00B9 m, T = 225 days). How does the synodic period and minimum \u0394v compare to Mars?',
      successHint: 'Porkchop plots are the primary mission design tool at every space agency. They reveal the narrow windows when interplanetary travel is feasible. Every Mars mission \u2014 Mangalyaan, Perseverance, Tianwen-1 \u2014 launched within the same 2-3 week window dictated by orbital mechanics.',
    },
    {
      title: 'Aerobraking \u2014 using atmosphere as a brake',
      concept: `Entering orbit around a planet normally requires a large retro-burn: you fire engines to slow down. But if the planet has an atmosphere, you can use **aerobraking** instead \u2014 deliberately dipping into the upper atmosphere to use drag as a free brake.

This saves enormous amounts of fuel. Mars Reconnaissance Orbiter reduced its orbital period from 35 hours to 2 hours using aerobraking over 6 months \u2014 saving hundreds of kilograms of fuel.

The challenge: dip too deep and the spacecraft burns up. Stay too high and there is not enough drag. The "corridor" is only about 10 km wide at Mars.

The code simulates iterative aerobraking passes: each pass through the atmosphere shaves off a little orbital energy, gradually lowering the orbit.`,
      analogy: 'Imagine you are on a swing going very high. To slow down, instead of dragging your feet on the ground (which would stop you suddenly), you stick your hands out every time you pass through the lowest point, creating air resistance. Each pass slows you a little. After many passes, you are going at a comfortable speed. That is aerobraking: using friction at the lowest orbital point to gradually slow down.',
      storyConnection: 'The Pushpaka Vimana descended to Ayodhya smoothly. Real spacecraft arriving at Mars face a brutal choice: carry enough fuel for a large braking burn (heavy and expensive) or use the thin Martian atmosphere as a free brake (risky but elegant). ISRO\u2019s Mangalyaan used a single large burn to enter Mars orbit, but future missions may use aerobraking to save mass.',
      checkQuestion: 'Why is aerobraking at Mars riskier than at Earth?',
      checkAnswer: 'Mars\u2019s atmosphere is 100 times thinner than Earth\u2019s and highly variable \u2014 density can change by 50% due to dust storms. The aerobraking corridor is extremely narrow. At Earth, the thick atmosphere provides a wider margin. Mars Odyssey had to abort several aerobraking passes when unexpected dust storms changed atmospheric density.',
      codeIntro: 'Simulate iterative aerobraking to circularise a Mars orbit.',
      code: `import numpy as np
import matplotlib.pyplot as plt

G = 6.674e-11
M_mars = 6.42e23
R_mars = 3.39e6

# Initial orbit: highly elliptical (typical capture orbit)
r_periapsis = R_mars + 150e3   # 150 km (dips into upper atmosphere)
r_apoapsis = R_mars + 35000e3  # 35,000 km (very high)

# Target orbit
r_target_apo = R_mars + 300e3  # 300 km circular

passes = []
r_apo = r_apoapsis

for i in range(500):
    a = (r_periapsis + r_apo) / 2
    v_peri = np.sqrt(G * M_mars * (2/r_periapsis - 1/a))
    T = 2 * np.pi * np.sqrt(a**3 / (G * M_mars))

    # Atmospheric drag at periapsis (simplified)
    alt_peri = r_periapsis - R_mars
    rho = 0.02 * np.exp(-alt_peri / 11100)  # Mars atmosphere model
    Cd_A = 15  # m^2 (spacecraft drag area)
    mass = 2000  # kg

    # Delta-v from drag (one pass through periapsis region, ~100 km path)
    path_length = 200e3  # metres through dense atmosphere
    dv_drag = 0.5 * rho * v_peri**2 * Cd_A / mass * path_length / v_peri

    # Reduce apoapsis
    v_new = v_peri - dv_drag
    a_new = 1 / (2/r_periapsis - v_new**2 / (G * M_mars))
    r_apo_new = 2 * a_new - r_periapsis

    passes.append({
        'pass': i + 1,
        'r_apo': r_apo / 1000,
        'T': T / 3600,
        'dv': dv_drag,
        'v_peri': v_peri,
    })

    r_apo = max(r_apo_new, r_periapsis + 1000)

    if r_apo <= r_target_apo:
        break

apo_history = [p['r_apo'] for p in passes]
period_history = [p['T'] for p in passes]
dv_history = [p['dv'] for p in passes]

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 8))

ax1.plot(range(1, len(passes)+1), [a/1000 for a in apo_history], linewidth=2, color='orange')
ax1.axhline(r_target_apo/1000, color='green', linestyle='--', label='Target (300 km)')
ax1.set_xlabel('Aerobraking pass'); ax1.set_ylabel('Apoapsis altitude (km)')
ax1.set_title('Apoapsis Reduction'); ax1.legend(fontsize=9); ax1.grid(alpha=0.3)

ax2.plot(range(1, len(passes)+1), period_history, linewidth=2, color='royalblue')
ax2.set_xlabel('Aerobraking pass'); ax2.set_ylabel('Orbital period (hours)')
ax2.set_title('Period Reduction'); ax2.grid(alpha=0.3)

ax3.plot(range(1, len(passes)+1), [d*1000 for d in dv_history], linewidth=2, color='red')
ax3.set_xlabel('Aerobraking pass'); ax3.set_ylabel('\u0394v per pass (mm/s)')
ax3.set_title('Drag Deceleration per Pass'); ax3.grid(alpha=0.3)

# Final orbit visualisation
theta = np.linspace(0, 2*np.pi, 300)
# Initial orbit
a_init = (r_periapsis + r_apoapsis) / 2
e_init = (r_apoapsis - r_periapsis) / (r_apoapsis + r_periapsis)
r_init = a_init * (1 - e_init**2) / (1 + e_init * np.cos(theta))
# Final orbit
a_final = (r_periapsis + r_apo) / 2
e_final = (r_apo - r_periapsis) / (r_apo + r_periapsis)
r_final = a_final * (1 - e_final**2) / (1 + e_final * np.cos(theta))

ax4.plot(r_init * np.cos(theta) / R_mars, r_init * np.sin(theta) / R_mars,
         'r--', linewidth=1, label='Initial orbit', alpha=0.5)
ax4.plot(r_final * np.cos(theta) / R_mars, r_final * np.sin(theta) / R_mars,
         'g-', linewidth=2, label='Final orbit')
mars = plt.Circle((0, 0), 1, color='orangered', alpha=0.7)
ax4.add_patch(mars)
ax4.set_aspect('equal'); ax4.set_xlim(-12, 12); ax4.set_ylim(-12, 12)
ax4.set_title('Orbit Shape Change'); ax4.legend(fontsize=9); ax4.grid(alpha=0.2)

plt.tight_layout()
plt.show()

total_dv = sum(dv_history)
print(f"=== Mars Aerobraking Summary ===")
print(f"Total passes: {len(passes)}")
print(f"Initial apoapsis: {r_apoapsis/1000 - R_mars/1000:.0f} km")
print(f"Final apoapsis: {r_apo/1000 - R_mars/1000:.0f} km")
print(f"Total \u0394v from drag: {total_dv:.1f} m/s")
print(f"Equivalent fuel saved: ~{total_dv * mass / (350*9.8):.0f} kg (at I_sp=350s)")`,
      challenge: 'Change r_periapsis to 120 km (deeper dip). How many fewer passes are needed? What is the risk?',
      successHint: 'Aerobraking is one of the cleverest techniques in space mission design. It trades time for fuel, using the planet\u2019s atmosphere as a free brake. Every kilogram of fuel saved is a kilogram of scientific instruments that can be carried instead.',
    },
    {
      title: 'Interstellar travel \u2014 the physics of reaching the stars',
      concept: `The nearest star system, **Alpha Centauri**, is 4.37 light-years away \u2014 about 41 trillion kilometres. At the speed of Voyager 1 (17 km/s), it would take **73,000 years** to get there. Even at 10% the speed of light, the trip takes 44 years.

The challenges are immense:
- **Energy**: accelerating even 1 tonne to 0.1c requires 4.5 \u00D7 10\u00B9\u2074 J \u2014 the annual energy output of a small country
- **Time**: at achievable speeds, the journey takes decades to centuries
- **Communication**: at 4.37 light-years, a message takes 4.37 years each way
- **Radiation**: interstellar hydrogen at 0.1c hits like cosmic rays

Proposed solutions include **solar sails** (pushed by lasers), **nuclear pulse propulsion** (detonating bombs behind the ship), and **Bussard ramjets** (scooping interstellar hydrogen as fuel).

The Breakthrough Starshot initiative proposes accelerating gram-scale probes to 0.2c using a ground-based laser array \u2014 reaching Alpha Centauri in 20 years.`,
      analogy: 'If the Sun were a tennis ball in London, Alpha Centauri would be another tennis ball in Moscow. Everything in between is empty space. Now imagine trying to throw a grain of sand from London to Moscow with enough precision to hit the ball. That is the challenge of interstellar travel. The distances are not just big \u2014 they are fundamentally different from anything in our solar system.',
      storyConnection: 'The Pushpaka Vimana was said to reach "other lokas" \u2014 other worlds. The ancient imagination had no concept of the true distances between stars. The gap between stars is so vast that it makes the distance from Lanka to Ayodhya seem infinitesimally small. Yet the dream persists, and physics offers a few narrow paths to the stars.',
      checkQuestion: 'If you could somehow build a ship that accelerated at 1g (9.8 m/s\u00B2) continuously, how long would it take to reach Alpha Centauri?',
      checkAnswer: 'About 3.6 years ship time (due to relativistic time dilation). You would accelerate at 1g for half the journey (reaching ~0.95c) and decelerate at 1g for the second half. Earth time would be about 6 years. The energy required is astronomical \u2014 but 1g acceleration provides comfortable "gravity" for the crew and dramatic time savings through relativity.',
      codeIntro: 'Compare interstellar propulsion concepts and travel times to Alpha Centauri.',
      code: `import numpy as np
import matplotlib.pyplot as plt

c = 3e8          # speed of light (m/s)
d_alpha = 4.37   # light-years to Alpha Centauri
d_metres = d_alpha * 9.461e15  # in metres

# Propulsion concepts: name, max speed (fraction of c), mass budget
concepts = [
    ("Voyager (current tech)", 0.00006, "14 tonnes"),
    ("Nuclear thermal", 0.001, "~1000 tonnes"),
    ("Nuclear pulse (Orion)", 0.05, "~10,000 tonnes"),
    ("Fusion drive", 0.1, "~500 tonnes"),
    ("Laser sail (Starshot)", 0.2, "~1 gram"),
    ("Antimatter drive", 0.5, "~100 tonnes"),
    ("1g continuous", 0.95, "theoretical"),
]

names = [c[0] for c in concepts]
speeds = [c[1] for c in concepts]
travel_years = [d_alpha / s if s < 0.1 else d_alpha / s * 1.05 for s in speeds]  # simplified

plt.figure(figsize=(12, 5))

# Travel time (log scale)
bars = plt.barh(names[::-1], [np.log10(t) for t in travel_years[::-1]],
                color=['#ef4444' if t > 1000 else '#f59e0b' if t > 100 else '#22c55e' for t in travel_years[::-1]],
                height=0.6)
plt.xlabel('log\u2081\u2080(Travel time in years)', fontsize=11)
plt.title('Travel Time to Alpha Centauri (4.37 light-years)', fontsize=14)
plt.grid(axis='x', alpha=0.3)

# Add labels
for bar, t in zip(bars, travel_years[::-1]):
    if t > 1000:
        label = f'{t:,.0f} years'
    elif t > 1:
        label = f'{t:.0f} years'
    else:
        label = f'{t:.1f} years'
    plt.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
             label, va='center', fontsize=9, color='white')

plt.tight_layout()
plt.show()

# Energy requirements
print("=== Energy Required to Reach Alpha Centauri ===")
payload = 1000  # kg
for name, v_frac, mass_note in concepts:
    v = v_frac * c
    KE = 0.5 * payload * v**2  # non-relativistic approximation
    if v_frac > 0.1:
        # Relativistic: KE = (gamma - 1) * m * c^2
        gamma = 1 / np.sqrt(1 - v_frac**2)
        KE = (gamma - 1) * payload * c**2
    t = d_metres / v / (365.25 * 86400)
    print(f"  {name:30s}: {v_frac*100:6.2f}% c, {t:>10,.0f} years, KE = {KE:.2e} J")

# Context
print(f"\\nFor comparison:")
print(f"  World annual energy use: ~5.8 \u00d7 10\u00b9\u00b2\u2070 J")
print(f"  Sun output per second:   3.8 \u00d7 10\u00b2\u2076 J")
print(f"  Tsar Bomba (largest nuke): 2.1 \u00d7 10\u00b9\u2077 J")

# Relativistic time dilation at constant 1g acceleration
print(f"\\n=== 1g Continuous Acceleration ===")
g_accel = 9.8
# Ship time to reach Alpha Centauri at 1g (acceleration for half, deceleration for half)
# tau = (c/g) * arccosh(1 + g*d/(2*c^2)) for half the journey
tau_half = (c / g_accel) * np.arccosh(1 + g_accel * d_metres / (2 * c**2))
tau_total = 2 * tau_half
print(f"  Ship time: {tau_total / (365.25*86400):.1f} years")
t_earth_half = (c / g_accel) * np.sinh(tau_half * g_accel / c)
print(f"  Earth time: {2*t_earth_half / (365.25*86400):.1f} years")
v_max = c * np.tanh(tau_half * g_accel / c)
print(f"  Peak speed: {v_max/c:.3f} c ({v_max/1000:.0f} km/s)")`,
      challenge: 'Calculate the travel time for a Breakthrough Starshot probe (1 gram, 0.2c) including a 10-minute laser acceleration phase. What is the laser power needed to accelerate 1 gram to 0.2c in 10 minutes?',
      successHint: 'Interstellar travel is the ultimate engineering challenge. The distances are so vast that they require propulsion technologies we have not yet built. But the physics allows it \u2014 the Vimana\u2019s dream of travelling between worlds is not impossible, just extraordinarily difficult.',
    },
    {
      title: 'Capstone: Design your own Vimana mission',
      concept: `You now have the tools to design a complete aerospace mission from first principles. In this capstone, you will design a **multi-phase mission** that combines everything:

1. **Phase 1: Atmospheric flight** \u2014 takeoff, climb, cruise (lift/drag/thrust)
2. **Phase 2: Orbital insertion** \u2014 rocket equation, escape from atmosphere
3. **Phase 3: Transfer orbit** \u2014 Hohmann transfer to destination
4. **Phase 4: Arrival** \u2014 aerobraking or orbital insertion burn

The code provides a mission design framework. You choose the destination, vehicle parameters, and trajectory. The simulator computes \u0394v budgets, fuel requirements, and transit times.

This is how real mission design works at ISRO, NASA, and SpaceX \u2014 define the mission, calculate the physics, iterate until feasible.`,
      analogy: 'Designing a space mission is like planning a multi-leg journey where each leg has completely different physics: driving to the airport (aerodynamics), flying to another continent (orbital mechanics), taking a boat to an island (different medium). You need different vehicles, different fuel, and different skills for each phase. The art is in connecting them seamlessly.',
      storyConnection: 'The Pushpaka Vimana made the impossible look effortless \u2014 it flew through atmosphere, above the clouds, and supposedly to other lokas. Your mission design will achieve the same thing, but with real physics. Every parameter you choose has consequences: more payload means more fuel means a bigger rocket means more fuel. Vishwakarma did not need to worry about the rocket equation. You do.',
      checkQuestion: 'What is the single biggest constraint on mission design?',
      checkAnswer: 'Mass. Every kilogram of payload requires roughly 10-20 kg of fuel to reach orbit, and every kg of fuel for the orbital phase requires additional fuel to get that fuel off the ground. This exponential relationship (the rocket equation) is the fundamental constraint. Everything else \u2014 cost, schedule, risk \u2014 traces back to mass.',
      codeIntro: 'Design a complete mission: Earth surface to Mars orbit.',
      code: `import numpy as np
import matplotlib.pyplot as plt

G = 6.674e-11
M_earth = 5.972e24; R_earth = 6.371e6
M_mars = 6.42e23; R_mars = 3.39e6
M_sun = 1.989e30
r_earth_orbit = 1.496e11; r_mars_orbit = 2.279e11

print("=" * 60)
print("  VIMANA MISSION PLANNER: Earth to Mars")
print("=" * 60)

# === PHASE 1: Launch to LEO ===
print("\\n--- Phase 1: Launch to Low Earth Orbit ---")
alt_leo = 400e3
v_leo = np.sqrt(G * M_earth / (R_earth + alt_leo))
dv_gravity_loss = 1500  # m/s (typical)
dv_drag_loss = 200      # m/s
dv_to_leo = v_leo + dv_gravity_loss + dv_drag_loss
print(f"  Orbital velocity at {alt_leo/1000:.0f} km: {v_leo:.0f} m/s")
print(f"  Gravity + drag losses: {dv_gravity_loss + dv_drag_loss} m/s")
print(f"  Total \u0394v to LEO: {dv_to_leo:.0f} m/s ({dv_to_leo/1000:.2f} km/s)")

# === PHASE 2: Trans-Mars Injection ===
print("\\n--- Phase 2: Trans-Mars Injection (TMI) ---")
a_transfer = (r_earth_orbit + r_mars_orbit) / 2
v_earth_orbit = np.sqrt(G * M_sun / r_earth_orbit)
v_transfer_earth = np.sqrt(G * M_sun * (2/r_earth_orbit - 1/a_transfer))
dv_tmi = v_transfer_earth - v_earth_orbit  # heliocentric
# Add Earth escape
v_inf = dv_tmi
v_escape_from_leo = np.sqrt(v_inf**2 + 2 * G * M_earth / (R_earth + alt_leo))
dv_tmi_actual = v_escape_from_leo - v_leo
print(f"  Heliocentric \u0394v: {dv_tmi:.0f} m/s")
print(f"  From LEO (Oberth effect): {dv_tmi_actual:.0f} m/s")

# === PHASE 3: Cruise ===
T_transfer = np.pi * np.sqrt(a_transfer**3 / (G * M_sun))
print(f"\\n--- Phase 3: Cruise ---")
print(f"  Transfer time: {T_transfer/86400:.0f} days ({T_transfer/86400/30:.1f} months)")

# === PHASE 4: Mars Orbit Insertion ===
print("\\n--- Phase 4: Mars Orbit Insertion ---")
v_transfer_mars = np.sqrt(G * M_sun * (2/r_mars_orbit - 1/a_transfer))
v_mars_orbit = np.sqrt(G * M_mars / r_mars_orbit)
v_mars_orbital = np.sqrt(G * M_sun / r_mars_orbit)
v_inf_mars = v_transfer_mars - v_mars_orbital
alt_mars_orbit = 400e3
v_mars_orbit_local = np.sqrt(G * M_mars / (R_mars + alt_mars_orbit))
v_arrival = np.sqrt(v_inf_mars**2 + 2 * G * M_mars / (R_mars + alt_mars_orbit))
dv_moi = v_arrival - v_mars_orbit_local
print(f"  Approach v_inf: {v_inf_mars:.0f} m/s")
print(f"  MOI \u0394v: {dv_moi:.0f} m/s")

# === TOTAL BUDGET ===
dv_total = dv_to_leo + dv_tmi_actual + dv_moi
print(f"\\n{'='*60}")
print(f"  TOTAL \u0394v BUDGET: {dv_total:.0f} m/s ({dv_total/1000:.2f} km/s)")
print(f"{'='*60}")

# === VEHICLE SIZING ===
print("\\n--- Vehicle Sizing ---")
payload = 5000  # kg (spacecraft + instruments)
Isp_stage1 = 310; Isp_stage2 = 450; Isp_stage3 = 450
g0 = 9.8

# Stage 3: MOI
mr3 = np.exp(dv_moi / (Isp_stage3 * g0))
m3_initial = payload * mr3
fuel3 = m3_initial - payload

# Stage 2: TMI
mr2 = np.exp(dv_tmi_actual / (Isp_stage2 * g0))
m2_initial = m3_initial * mr2
fuel2 = m2_initial - m3_initial

# Stage 1: LEO
mr1 = np.exp(dv_to_leo / (Isp_stage1 * g0))
m1_initial = m2_initial * mr1
fuel1 = m1_initial - m2_initial

print(f"  Payload: {payload/1000:.1f} t")
print(f"  Stage 3 (MOI): {fuel3/1000:.1f} t fuel")
print(f"  Stage 2 (TMI): {fuel2/1000:.1f} t fuel")
print(f"  Stage 1 (LEO): {fuel1/1000:.1f} t fuel")
print(f"  TOTAL LAUNCH MASS: {m1_initial/1000:.0f} t")
print(f"  Payload fraction: {payload/m1_initial*100:.2f}%")

# Visualise mission phases
phases = ['Launch to LEO', 'TMI burn', 'Cruise', 'MOI burn']
dvs = [dv_to_leo/1000, dv_tmi_actual/1000, 0, dv_moi/1000]
colors = ['red', 'orange', 'green', 'blue']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
ax1.bar(phases, dvs, color=colors)
ax1.set_ylabel('\u0394v (km/s)', fontsize=11)
ax1.set_title('Mission \u0394v Budget', fontsize=13)
ax1.grid(axis='y', alpha=0.3)

masses = [m1_initial, m2_initial, m3_initial, payload]
labels = ['Launch', 'After Stage 1', 'After Stage 2', 'Payload']
ax2.bar(labels, [m/1000 for m in masses], color=['red', 'orange', 'gold', 'green'])
ax2.set_ylabel('Mass (tonnes)', fontsize=11)
ax2.set_title('Mass at Each Phase', fontsize=13)
ax2.grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.show()`,
      challenge: 'Redesign the mission for a return trip (add \u0394v for Mars ascent, Earth return transfer, and Earth capture). What is the total \u0394v and how does the launch mass change?',
      successHint: 'You have designed a complete interplanetary mission \u2014 the same process used by ISRO for Mangalyaan, by NASA for Perseverance, and by SpaceX for Starship. The Pushpaka Vimana\u2019s journey from Lanka to Ayodhya is just the beginning. The real voyage is from Earth to the stars.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Expert-level aerospace engineering and mission design</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced mission design. Click to start.</p>
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
            diagram={[VimanaLiftDragDiagram, OrbitalMechanicsDiagram, GravitationalFieldDiagram, VimanaBernoulliDiagram, VimanaRocketDiagram, VimanaJetEngineDiagram][i] ? createElement([VimanaLiftDragDiagram, OrbitalMechanicsDiagram, GravitationalFieldDiagram, VimanaBernoulliDiagram, VimanaRocketDiagram, VimanaJetEngineDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
