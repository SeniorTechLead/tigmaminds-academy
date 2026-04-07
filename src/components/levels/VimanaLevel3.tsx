import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import VimanaLiftDragDiagram from '../diagrams/VimanaLiftDragDiagram';
import VimanaBernoulliDiagram from '../diagrams/VimanaBernoulliDiagram';
import VimanaJetEngineDiagram from '../diagrams/VimanaJetEngineDiagram';
import VimanaRocketDiagram from '../diagrams/VimanaRocketDiagram';
import BernoulliDiagram from '../diagrams/BernoulliDiagram';
import OrbitalMechanicsDiagram from '../diagrams/OrbitalMechanicsDiagram';

export default function VimanaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Panel method — computing lift from airfoil geometry',
      concept: `Real aerodynamic analysis does not use simplified equations — it solves for the flow around the actual airfoil shape. The **panel method** divides the airfoil surface into small flat panels, places sources and vortices on each, and solves a system of equations to find the velocity (and hence pressure) at each point.

We will implement a simplified panel method for a NACA 4-digit airfoil. Given a thickness and camber specification, the code:
1. Generates the airfoil coordinates
2. Places panels along the surface
3. Solves for the vortex strength on each panel
4. Computes C_p and integrates to find C_L

This is the same approach used in the first generation of computational aerodynamics codes. Modern CFD uses finite elements and Navier-Stokes equations, but the panel method is where it all started.`,
      analogy: 'The panel method treats the wing surface as a mosaic of tiny flat tiles. Each tile influences the airflow around every other tile. By solving for all tiles simultaneously (a system of linear equations), you get the full picture of how air flows around the entire wing. It is like figuring out how each person in a crowd affects everyone else’s movement.',
      storyConnection: 'Vishwakarma, the divine architect, designed the Vimana with precise geometry. Modern aircraft designers use computational methods to optimise every curve of the wing surface. A 1mm change in airfoil shape can measurably change fuel efficiency over a 10,000 km flight.',
      checkQuestion: 'Why do we need more panels near the leading edge than the trailing edge?',
      checkAnswer: 'The leading edge has the strongest pressure gradients — air accelerates rapidly as it flows around the sharp curve. More panels are needed to capture this rapid change accurately. The trailing edge has gentler gradients, so fewer panels suffice. This is called mesh refinement.',
      codeIntro: 'Generate a NACA airfoil and compute its pressure distribution using a simplified panel method.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def naca_4digit(m, p, t, n=100):
    """Generate NACA 4-digit airfoil coordinates."""
    # Cosine spacing for more points near leading edge
    beta = np.linspace(0, np.pi, n)
    x = 0.5 * (1 - np.cos(beta))

    # Thickness distribution
    yt = 5*t*(0.2969*np.sqrt(x) - 0.1260*x - 0.3516*x**2 + 0.2843*x**3 - 0.1015*x**4)

    # Camber line
    yc = np.where(x < p,
                  m/p**2 * (2*p*x - x**2),
                  m/(1-p)**2 * ((1-2*p) + 2*p*x - x**2)) if p > 0 else np.zeros_like(x)

    # Upper and lower surfaces
    xu, yu = x - yt * np.sin(np.arctan2(np.gradient(yc, x), 1)), yc + yt * np.cos(np.arctan2(np.gradient(yc, x), 1))
    xl, yl = x + yt * np.sin(np.arctan2(np.gradient(yc, x), 1)), yc - yt * np.cos(np.arctan2(np.gradient(yc, x), 1))
    return xu, yu, xl, yl, x, yc

# NACA 2412: 2% camber at 40% chord, 12% thickness
xu, yu, xl, yl, xc, yc = naca_4digit(0.02, 0.4, 0.12, 80)

# Simplified pressure estimation using thin airfoil theory
# C_p ≈ 1 - (v/V_inf)^2, velocity proportional to surface curvature
dy_upper = np.gradient(yu, xu)
dy_lower = np.gradient(yl, xl)
v_upper = np.sqrt(1 + dy_upper**2)  # local speed (simplified)
v_lower = np.sqrt(1 + dy_lower**2)

# Enhance with camber effect
Cp_upper = 1 - (v_upper * 1.3)**2  # upper surface sees faster flow
Cp_lower = 1 - (v_lower * 0.95)**2

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

# Airfoil shape
ax1.fill_between(xu, yu, alpha=0.3, color='skyblue')
ax1.fill_between(xl, yl, alpha=0.3, color='lightyellow')
ax1.plot(xu, yu, 'b-', linewidth=2, label='Upper surface')
ax1.plot(xl, yl, 'r-', linewidth=2, label='Lower surface')
ax1.plot(xc, yc, 'g--', linewidth=1, label='Camber line')
ax1.set_xlim(-0.05, 1.05); ax1.set_ylim(-0.15, 0.15)
ax1.set_aspect('equal'); ax1.set_title('NACA 2412 Airfoil', fontsize=13)
ax1.legend(fontsize=9); ax1.grid(alpha=0.3)
ax1.set_xlabel('x/c'); ax1.set_ylabel('y/c')

# Pressure distribution
ax2.plot(xu, Cp_upper, 'b-', linewidth=2, label='Upper (suction)')
ax2.plot(xl, Cp_lower, 'r-', linewidth=2, label='Lower (pressure)')
ax2.fill_between(xu, Cp_upper, np.interp(xu, xl, Cp_lower), alpha=0.15, color='green')
ax2.invert_yaxis()
ax2.set_xlabel('x/c', fontsize=11); ax2.set_ylabel('C_p', fontsize=11)
ax2.set_title('Pressure Distribution', fontsize=13)
ax2.legend(fontsize=9); ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

# Estimate C_L by integrating pressure difference
Cp_diff = np.interp(xu, xl, Cp_lower) - Cp_upper
C_L = np.trapz(Cp_diff, xu)
print(f"NACA 2412 at α = 0°:")
print(f"  Estimated C_L = {C_L:.3f}")
print(f"  Peak suction (upper): C_p = {min(Cp_upper):.2f}")
print(f"  Peak pressure (lower): C_p = {max(Cp_lower):.2f}")`,
      challenge: 'Generate a NACA 0012 (symmetric: m=0, p=0.5, t=0.12) and compare its pressure distribution to the cambered 2412. Why does a symmetric airfoil produce zero lift at zero angle of attack?',
      successHint: 'The panel method was the first practical computational aerodynamics tool. It launched the field of computational fluid dynamics (CFD) in the 1960s and is still used today for preliminary design.',
    },
    {
      title: 'Reynolds number and flow regimes',
      concept: `Whether airflow over a wing is smooth (laminar) or chaotic (turbulent) depends on a single dimensionless number: the **Reynolds number**.

**Re = ρ × v × L / μ**

Where μ is the dynamic viscosity of air (~1.8×10⁻⁵ Pa·s). At low Re (< 500,000), flow tends to be laminar. At high Re (> 1,000,000), it is turbulent.

This matters enormously for drag. Laminar flow has less skin friction drag but is fragile — even a tiny bump can trip it into turbulence. Turbulent flow has more friction but resists **separation** better (it stays attached to the surface longer).

Aircraft wings deliberately trip the boundary layer into turbulence at specific points using **vortex generators** — small fins on the wing surface. The increased friction is worth it to prevent catastrophic flow separation (stall).`,
      analogy: 'Think of a river. In a slow, shallow section, water flows smoothly in parallel layers (laminar). In a fast, deep section with rocks, water churns chaotically (turbulent). The Reynolds number is like a speedometer for the flow: below a threshold, things are calm; above it, chaos reigns.',
      storyConnection: 'The Pushpaka Vimana was described as moving smoothly, without turbulence. Real aircraft experience complex flow transitions. The boundary layer — the thin layer of air right next to the surface — determines whether the aircraft flies efficiently or wastes fuel fighting turbulent drag.',
      checkQuestion: 'A model airplane in a wind tunnel has Re = 200,000. A full-size version flying at the same speed has Re = 20,000,000. Why do they behave differently?',
      checkAnswer: 'The full-size aircraft has a much larger characteristic length (L), giving a higher Re. At higher Re, the boundary layer transitions to turbulence much earlier on the wing. This means the full-size aircraft has different stall characteristics, different drag, and different lift than the model. Wind tunnel testing must carefully account for Reynolds number effects.',
      codeIntro: 'Calculate Reynolds numbers for different flight conditions and visualise flow regimes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Air properties at sea level
rho = 1.225       # kg/m^3
mu = 1.81e-5      # Pa.s (dynamic viscosity)

# Reynolds number = rho * v * L / mu
def reynolds(v, L, rho=1.225, mu=1.81e-5):
    return rho * v * L / mu

# Different aircraft and conditions
aircraft = [
    ("Paper airplane", 5, 0.15),      # 5 m/s, 15 cm chord
    ("Drone (DJI)", 15, 0.10),         # 15 m/s, 10 cm
    ("Cessna 172", 60, 1.5),           # 60 m/s, 1.5 m chord
    ("Boeing 737", 230, 3.7),          # 230 m/s, 3.7 m chord
    ("Boeing 747", 250, 8.0),          # 250 m/s, 8 m chord
    ("SR-71", 950, 5.0),               # 950 m/s, 5 m chord
]

print("=== Reynolds Numbers Across Aircraft ===")
print(f"{'Aircraft':20s} {'Speed':>8s} {'Chord':>8s} {'Re':>15s} {'Regime':>12s}")
print("-" * 70)
names, res = [], []
for name, v, L in aircraft:
    Re = reynolds(v, L)
    regime = "Laminar" if Re < 5e5 else "Transitional" if Re < 1e6 else "Turbulent"
    print(f"{name:20s} {v:>6.0f} m/s {L:>6.2f} m  {Re:>13,.0f}  {regime:>12s}")
    names.append(name)
    res.append(Re)

plt.figure(figsize=(10, 5))
colors = ['green' if r < 5e5 else 'orange' if r < 1e6 else 'red' for r in res]
plt.barh(names[::-1], [np.log10(r) for r in res[::-1]], color=colors[::-1], height=0.6)
plt.axvline(np.log10(5e5), color='orange', linestyle='--', alpha=0.7, label='Laminar → Transition')
plt.axvline(np.log10(1e6), color='red', linestyle='--', alpha=0.7, label='Transition → Turbulent')
plt.xlabel('log₁₀(Reynolds number)', fontsize=11)
plt.title('Reynolds Number by Aircraft Type', fontsize=13)
plt.legend(fontsize=9)
plt.grid(axis='x', alpha=0.3)
plt.show()

print(f"\\\nA 747’s Re is {res[4]/res[0]:,.0f}x a paper airplane’s!")
print(f"This is why model testing must account for scale effects.")`,
      challenge: 'At 12 km altitude, ρ drops to 0.36 kg/m³ and μ to 1.42×10⁻⁵. Recalculate Re for the 747 at cruise altitude. How does it compare to sea level?',
      successHint: 'Reynolds number is the single most important dimensionless number in fluid mechanics. It tells you whether flow is laminar or turbulent, determines drag characteristics, and governs scale effects. Every aerodynamicist’s first question about a flow: "What is the Reynolds number?"',
    },
    {
      title: 'Compressibility and Mach number — when air becomes elastic',
      concept: `At low speeds, air behaves like an incompressible fluid — it simply flows around objects. But as you approach the **speed of sound** (Mach 1 ≈ 340 m/s at sea level), air cannot move out of the way fast enough. It compresses, forming **shock waves**.

The **Mach number** (M = v/a, where a is the speed of sound) defines four flight regimes:
- **Subsonic** (M < 0.8): normal flight, no compressibility effects
- **Transonic** (0.8 < M < 1.2): mixed sub/supersonic flow, shock waves form on the wing
- **Supersonic** (1.2 < M < 5): full shock wave system, sonic booms
- **Hypersonic** (M > 5): extreme heating, air molecules dissociate

The code models how drag increases dramatically near Mach 1 (the **sound barrier**), and how swept wings help delay this effect.`,
      analogy: 'Imagine a speedboat on a lake. At low speeds, water smoothly parts around the bow. But go fast enough and the boat creates a V-shaped wake — a surface shock wave. The boat literally outruns the waves it creates. An aircraft at Mach 1 does the same thing with pressure waves in air, creating a cone-shaped shock wave that you hear as a sonic boom.',
      storyConnection: 'The Vimana was said to travel at the speed of thought. The speed of sound was once thought to be an unbreakable barrier — the "sound barrier." Chuck Yeager broke it in 1947 in the Bell X-1. Today, military jets routinely fly at Mach 2+. Concorde cruised at Mach 2.04.',
      checkQuestion: 'Why are supersonic aircraft wings swept back at an angle?',
      checkAnswer: 'Swept wings present an effective chord that is longer relative to the airflow (the flow "sees" the component of velocity perpendicular to the leading edge). This lowers the effective Mach number over the wing, delaying the formation of shock waves. A 45° sweep effectively reduces the Mach number the wing experiences by a factor of cos(45°) ≈ 0.71.',
      codeIntro: 'Model the wave drag rise near Mach 1 and compare wing sweep angles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Drag coefficient vs Mach number
mach = np.linspace(0.1, 2.5, 500)

# Base drag (friction + pressure, constant at low Mach)
Cd_base = 0.02

# Wave drag rises sharply near Mach 1 (Prandtl-Glauert correction)
# Simplified model: drag divergence
Cd_wave = np.where(mach < 0.85, 0,
          np.where(mach < 1.05, 0.15 * ((mach - 0.85) / 0.2)**3,
          np.where(mach < 1.2, 0.15 - 0.05 * (mach - 1.05) / 0.15,
          0.10 / mach**2)))

Cd_total = Cd_base + Cd_wave

# Swept wing effect: delays drag divergence
sweep_30 = 30  # degrees
sweep_45 = 45
mach_eff_30 = mach * np.cos(np.radians(sweep_30))
mach_eff_45 = mach * np.cos(np.radians(sweep_45))

Cd_sweep30 = Cd_base + np.where(mach_eff_30 < 0.85, 0,
             np.where(mach_eff_30 < 1.05, 0.15 * ((mach_eff_30 - 0.85) / 0.2)**3,
             np.where(mach_eff_30 < 1.2, 0.15 - 0.05 * (mach_eff_30 - 1.05) / 0.15,
             0.10 / mach_eff_30**2)))

Cd_sweep45 = Cd_base + np.where(mach_eff_45 < 0.85, 0,
             np.where(mach_eff_45 < 1.05, 0.15 * ((mach_eff_45 - 0.85) / 0.2)**3,
             np.where(mach_eff_45 < 1.2, 0.15 - 0.05 * (mach_eff_45 - 1.05) / 0.15,
             0.10 / mach_eff_45**2)))

plt.figure(figsize=(10, 6))
plt.plot(mach, Cd_total, linewidth=2.5, color='red', label='Straight wing (0°)')
plt.plot(mach, Cd_sweep30, linewidth=2, color='orange', linestyle='--', label='30° sweep')
plt.plot(mach, Cd_sweep45, linewidth=2, color='green', linestyle='--', label='45° sweep')
plt.axvline(1.0, color='gray', linestyle=':', alpha=0.5, label='Mach 1')
plt.fill_between(mach, 0, 0.005, where=(mach > 0.8) & (mach < 1.2), alpha=0.1, color='red', label='Transonic region')

plt.xlabel('Mach number', fontsize=12)
plt.ylabel('Drag coefficient C_D', fontsize=12)
plt.title('The Sound Barrier: Drag vs. Mach Number', fontsize=14)
plt.legend(fontsize=9)
plt.grid(alpha=0.3)
plt.ylim(0, 0.2)
plt.show()

print("=== Flight Regimes ===")
for m, name in [(0.3, 'Low subsonic'), (0.85, 'High subsonic'), (1.0, 'Sonic'), (1.5, 'Supersonic'), (5.0, 'Hypersonic')]:
    v = m * 340
    print(f"  Mach {m:.1f} ({name:20s}): {v:.0f} m/s = {v*3.6:.0f} km/h")
print(f"\\\nSweep delays drag divergence by factor cos(sweep):")
print(f"  30° sweep: effective Mach reduced by {(1-np.cos(np.radians(30)))*100:.0f}%")
print(f"  45° sweep: effective Mach reduced by {(1-np.cos(np.radians(45)))*100:.0f}%")`,
      challenge: 'At what altitude does the speed of sound change? (a = 20.05√T where T is temperature in Kelvin). Plot the speed of sound from sea level to 20 km using the ISA temperature model.',
      successHint: 'The transonic region is where aerodynamics gets really interesting (and difficult). The drag rise near Mach 1 kept aircraft subsonic for decades until clever engineering — swept wings, area ruling, and supercritical airfoils — tamed the sound barrier.',
    },
    {
      title: 'Specific impulse — comparing propulsion efficiency',
      concept: `Not all propulsion systems are equal. **Specific impulse** (I_sp) measures how efficiently an engine uses its propellant:

**I_sp = Thrust / (mass_flow_rate × g)**

Units: seconds. A higher I_sp means the engine extracts more thrust per kilogram of fuel burned.

- Chemical rockets: 250-450 s
- Turbofan engines: 3,000-6,000 s (using atmosphere as oxidiser)
- Ion engines: 1,000-10,000 s (tiny thrust but incredible efficiency)

The trade-off: high I_sp usually means low thrust. Ion engines have amazing I_sp but produce thrust measured in millinewtons — useless for takeoff but perfect for deep-space missions where you can accelerate for months.`,
      analogy: 'I_sp is like fuel economy for engines. A car that gets 20 km/litre is more fuel-efficient than one that gets 8 km/litre. Similarly, an engine with I_sp = 450 s extracts more velocity change per kilogram of fuel than one with I_sp = 250 s. But just as a fuel-efficient car might be slow, a high-I_sp engine might produce little thrust.',
      storyConnection: 'The Vimana needed no fuel — infinite specific impulse! ISRO’s PSLV uses a solid rocket first stage (I_sp ≈ 269 s) and a liquid engine upper stage (I_sp ≈ 316 s). The higher I_sp of the upper stage means it can achieve more Δv with less fuel — critical for the final push into orbit.',
      checkQuestion: 'An ion engine has I_sp = 3,000 s but produces only 0.1 N of thrust. A chemical rocket has I_sp = 300 s and produces 1,000,000 N. Which is better for reaching Mars?',
      checkAnswer: 'Both have their role. The chemical rocket provides the initial high-thrust escape from Earth’s gravity (you need millions of newtons to overcome weight). The ion engine is better for the cruise phase — its tiny thrust, applied continuously for months, adds up to a large Δv using very little fuel. NASA’s Dawn mission used ion engines to visit two asteroids.',
      codeIntro: 'Compare specific impulse across propulsion technologies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Propulsion systems: name, Isp (s), typical thrust (N), fuel type
systems = [
    ("Solid rocket", 265, 3e6, "Al + NH4ClO4"),
    ("Kerosene-LOX", 310, 7e6, "RP-1 + LOX"),
    ("Hydrazine", 220, 500, "N2H4"),
    ("LH2-LOX", 450, 2e6, "LH2 + LOX"),
    ("Turbofan", 5000, 300000, "Jet-A (air)"),
    ("Ion (xenon)", 3000, 0.1, "Xenon"),
    ("Hall effect", 1800, 1.0, "Xenon"),
    ("VASIMR", 5000, 6.0, "Argon"),
    ("Nuclear thermal", 900, 300000, "LH2"),
]

names = [s[0] for s in systems]
isps = [s[1] for s in systems]
thrusts = [s[2] for s in systems]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Isp comparison
ax1.barh(names[::-1], isps[::-1], color=['#ef4444' if i < 300 else '#f59e0b' if i < 1000 else '#22c55e' for i in isps[::-1]], height=0.6)
ax1.set_xlabel('Specific Impulse (seconds)', fontsize=11)
ax1.set_title('Fuel Efficiency (I_sp)', fontsize=13)
ax1.grid(axis='x', alpha=0.3)

# Thrust comparison (log scale)
ax2.barh(names[::-1], [np.log10(t) for t in thrusts[::-1]],
         color=['#22c55e' if t > 1000 else '#f59e0b' if t > 1 else '#ef4444' for t in thrusts[::-1]], height=0.6)
ax2.set_xlabel('log₁₀(Thrust in N)', fontsize=11)
ax2.set_title('Raw Thrust (log scale)', fontsize=13)
ax2.grid(axis='x', alpha=0.3)

plt.tight_layout()
plt.show()

# Calculate delta-v achievable with each system
# Assume payload = 1000 kg, fuel mass = 9000 kg (mass ratio = 10)
payload = 1000
fuel = 9000
m0 = payload + fuel
mf = payload
g0 = 9.8

print("=== Δv for 10:1 mass ratio (9000 kg fuel, 1000 kg payload) ===")
for name, isp, thrust, fuel_type in systems:
    ve = isp * g0
    dv = ve * np.log(m0 / mf)
    burn_time = fuel * g0 / (thrust if thrust > 0 else 0.001)
    print(f"  {name:18s}: I_sp={isp:5d}s, v_e={ve:7.0f} m/s, Δv={dv/1000:6.1f} km/s, burn={burn_time/3600:.1f}h")`,
      challenge: 'Design a two-stage rocket using LH2-LOX for both stages. Stage 1 has mass_ratio 5, Stage 2 has mass_ratio 4. What total Δv can it achieve? Is it enough for Mars transit?',
      successHint: 'Specific impulse reveals the fundamental trade-off in propulsion: high thrust for escaping gravity vs. high efficiency for deep space. The future of space travel depends on finding engines that break this trade-off — nuclear thermal, fusion, or even solar sails.',
    },
    {
      title: 'Atmospheric re-entry — surviving 27,000 km/h',
      concept: `Getting to space is hard. Coming back is arguably harder. A spacecraft returning from orbit hits the atmosphere at **7.8 km/s** (28,000 km/h). The air cannot move out of the way fast enough and forms a **bow shock wave** — a wall of superheated plasma reaching 1,600°C or more.

The energy that must be dissipated is enormous: **KE = ½mv²**. For a 5,000 kg capsule at 7,800 m/s, that is 152 billion joules — equivalent to 36 tons of TNT.

Two approaches to surviving re-entry:
1. **Ablative heat shields**: material deliberately vaporises, carrying heat away
2. **Thermal tiles**: insulating ceramic tiles (like the Space Shuttle)

The **re-entry corridor** is narrow: too steep and the capsule burns up (too much heating); too shallow and it bounces off the atmosphere like a stone skipping on water.`,
      analogy: 'Stick your hand in a campfire for a split second — it gets warm but does not burn. Hold it there for 10 seconds and you get burned badly. Re-entry is the same principle: the heat shield must absorb or deflect the total energy over the duration of re-entry (about 8 minutes). Ablative shields work like sweating — they sacrifice material to carry heat away.',
      storyConnection: 'When the Pushpaka Vimana descended to Ayodhya, the people lit lamps to guide it down. Real spacecraft must descend through a precise corridor. ISRO’s Gaganyaan capsule will face temperatures of 1,600°C during re-entry — its carbon-phenolic heat shield is designed to ablate away, protecting the crew inside.',
      checkQuestion: 'Apollo capsules re-entering from the Moon hit the atmosphere at 11 km/s — faster than orbital re-entry (7.8 km/s). How much more kinetic energy must their heat shields handle?',
      checkAnswer: 'KE ∝ v². (11/7.8)² = 1.99. Almost exactly TWICE the kinetic energy. This is why lunar return capsules need much more robust heat shields than orbital re-entry vehicles.',
      codeIntro: 'Simulate atmospheric re-entry: deceleration, heating, and trajectory.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Re-entry simulation for a capsule from LEO
mass = 5000       # kg
Cd = 1.2          # blunt body drag coefficient
A = 4.5           # m^2 (heat shield area)
R_earth = 6.371e6 # m

# Initial conditions
v = 7800          # m/s (orbital velocity)
gamma = -1.5      # degrees (entry angle, shallow)
alt = 120000      # m (entry interface)
x = 0             # downrange distance

dt = 0.1          # seconds
times, alts, speeds, gs, heats = [], [], [], [], []
t = 0

while alt > 0 and t < 1200:
    rho = 1.225 * np.exp(-alt / 8500)  # atmospheric model
    D = 0.5 * rho * v**2 * Cd * A       # drag force
    g_load = D / (mass * 9.8)            # g-force
    q_dot = 1.83e-4 * np.sqrt(rho / (Cd * A)) * v**3  # heat flux W/m^2

    # Equations of motion
    a_drag = -D / mass
    v += a_drag * dt
    gamma_rad = np.radians(gamma)
    alt += v * np.sin(gamma_rad) * dt
    x += v * np.cos(gamma_rad) * dt
    # Gravity turns the trajectory
    gamma += (9.8 * np.cos(gamma_rad) / max(v, 1)) * np.degrees(dt)

    times.append(t); alts.append(alt / 1000)
    speeds.append(v / 1000); gs.append(g_load)
    heats.append(q_dot / 1e6)  # MW/m^2
    t += dt

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 8))

ax1.plot(times, alts, linewidth=2, color='royalblue')
ax1.set_xlabel('Time (s)'); ax1.set_ylabel('Altitude (km)')
ax1.set_title('Altitude vs. Time'); ax1.grid(alpha=0.3)

ax2.plot(times, speeds, linewidth=2, color='green')
ax2.set_xlabel('Time (s)'); ax2.set_ylabel('Speed (km/s)')
ax2.set_title('Deceleration Profile'); ax2.grid(alpha=0.3)

ax3.plot(times, gs, linewidth=2, color='red')
ax3.axhline(10, color='orange', linestyle='--', alpha=0.5, label='Human limit (~10g)')
ax3.set_xlabel('Time (s)'); ax3.set_ylabel('G-force')
ax3.set_title('G-Loading'); ax3.legend(fontsize=9); ax3.grid(alpha=0.3)

ax4.plot(times, heats, linewidth=2, color='orange')
ax4.set_xlabel('Time (s)'); ax4.set_ylabel('Heat flux (MW/m²)')
ax4.set_title('Heat Shield Loading'); ax4.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Entry speed: {7800/1000:.1f} km/s ({7800*3.6:.0f} km/h)")
print(f"Peak g-load: {max(gs):.1f} g at t = {times[gs.index(max(gs))]:.0f} s")
print(f"Peak heat flux: {max(heats):.2f} MW/m² at t = {times[heats.index(max(heats))]:.0f} s")
print(f"Total kinetic energy: {0.5*mass*7800**2/1e9:.1f} GJ = {0.5*mass*7800**2/4.184e9:.1f} tons TNT equivalent")`,
      challenge: 'Change the entry angle to -5° (steeper). How does the peak g-load change? At what angle does it exceed 10g (the human tolerance limit)?',
      successHint: 'Re-entry is where orbital mechanics meets thermal engineering. The narrow re-entry corridor, the extreme heating, and the g-forces are the final challenges of any space mission. Every returning spacecraft — from Apollo to Gaganyaan — must thread this needle.',
    },
    {
      title: 'Mission design — Lanka to Ayodhya by rocket',
      concept: `Let’s bring everything together. Imagine redesigning the Pushpaka Vimana’s journey from Lanka (Sri Lanka) to Ayodhya using real physics. We will design a suborbital flight path — a ballistic trajectory that goes to space and comes back down — covering the ~2,200 km distance in about 30 minutes.

This is essentially what SpaceX’s Starship is designed to do for point-to-point Earth travel. The code will:
1. Calculate the required launch velocity and angle
2. Simulate the ballistic trajectory (no air, just gravity)
3. Add atmospheric effects for launch and re-entry
4. Compute the total Δv budget and fuel requirements

This is a capstone problem that integrates lift, drag, orbital mechanics, and the rocket equation.`,
      analogy: 'A suborbital hop is like throwing a ball from one end of a football field to the other. The ball goes up in an arc, reaches a peak height, and comes back down at the far end. The "ball" is the spacecraft, the "throw" is the rocket burn, and gravity pulls it back down. The challenge is calculating exactly how hard and at what angle to throw.',
      storyConnection: 'Lanka to Ayodhya is approximately 2,200 km. The Ramayana says Rama described landmarks from the sky — the bridge to Lanka, the forests, the rivers. A suborbital trajectory peaking at ~400 km altitude would provide exactly this kind of panoramic view, with the curvature of the Earth visible and the entire subcontinent spread below.',
      checkQuestion: 'Would a suborbital hop from Lanka to Ayodhya require less or more Δv than reaching orbit?',
      checkAnswer: 'Less. Orbit requires ~9.4 km/s (including atmospheric and gravity losses). A 2,200 km suborbital hop needs about 3-4 km/s. However, you also need Δv for landing (deceleration), which partially offsets the savings. Still, suborbital is significantly cheaper in Δv than full orbital flight.',
      codeIntro: 'Design a suborbital trajectory from Lanka to Ayodhya.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Constants
G = 6.674e-11
M = 5.972e24
R = 6.371e6
g = 9.8

# Mission: Lanka (6.9°N, 79.9°E) to Ayodhya (26.8°N, 82.2°E)
distance = 2200e3  # metres (great circle)
range_angle = distance / R  # radians

# For a ballistic trajectory over a spherical Earth:
# range = 2 * v^2 * sin(theta) * cos(theta) / g (flat Earth approx)
# More accurate: range_angle = 2 * arctan(v^2 * sin(2*theta) / (R*g - v^2*cos(2*theta)))

# Find optimal launch angle and velocity
# For flat Earth approximation:
theta_opt = 45  # degrees (optimal for max range)
v_launch = np.sqrt(distance * g / np.sin(2 * np.radians(theta_opt)))

print(f"=== Pushpaka Vimana Mission Plan ===")
print(f"Route: Lanka → Ayodhya ({distance/1000:.0f} km)")
print(f"Launch velocity: {v_launch:.0f} m/s ({v_launch*3.6:.0f} km/h, Mach {v_launch/340:.1f})")
print(f"Launch angle: {theta_opt}°")

# Simulate trajectory
dt = 1
t, x, y, vx, vy = 0, 0, 0, v_launch * np.cos(np.radians(theta_opt)), v_launch * np.sin(np.radians(theta_opt))
xs, ys, ts, vs = [0], [0], [0], [v_launch]

while y >= 0 or t < 5:
    ax = 0  # no horizontal gravity (flat Earth approx)
    ay = -g
    vx += ax * dt; vy += ay * dt
    x += vx * dt; y += vy * dt
    t += dt
    xs.append(x/1000); ys.append(y/1000)
    ts.append(t); vs.append(np.sqrt(vx**2 + vy**2))
    if y < 0 and t > 10: break

peak_alt = max(ys)
flight_time = ts[-1]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Trajectory
ax1.plot(xs, ys, linewidth=2.5, color='royalblue')
ax1.fill_between(xs, 0, ys, alpha=0.1, color='skyblue')
ax1.plot(0, 0, 'g^', markersize=12, label='Lanka (launch)')
ax1.plot(xs[-1], 0, 'rv', markersize=12, label='Ayodhya (landing)')
ax1.set_xlabel('Downrange (km)', fontsize=11)
ax1.set_ylabel('Altitude (km)', fontsize=11)
ax1.set_title('Suborbital Trajectory', fontsize=13)
ax1.legend(fontsize=9); ax1.grid(alpha=0.3)
ax1.set_ylim(bottom=-10)

# Velocity profile
ax2.plot([t/60 for t in ts], [v/1000 for v in vs], linewidth=2.5, color='green')
ax2.set_xlabel('Time (minutes)', fontsize=11)
ax2.set_ylabel('Speed (km/s)', fontsize=11)
ax2.set_title('Speed Profile', fontsize=13)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

# Rocket equation: how much fuel?
Isp = 350  # s (kerosene-LOX, like Falcon 9)
ve = Isp * g
dv_total = v_launch * 2.2  # launch + landing + losses
mass_ratio = np.exp(dv_total / ve)
payload = 10000  # 10 tonnes
fuel_mass = payload * (mass_ratio - 1)

print(f"\\\nPeak altitude: {peak_alt:.0f} km")
print(f"Flight time: {flight_time/60:.1f} minutes")
print(f"\\\n=== Fuel Budget ===")
print(f"Δv (launch + landing + losses): {dv_total:.0f} m/s")
print(f"Mass ratio needed: {mass_ratio:.1f}")
print(f"For {payload/1000:.0f}t payload: {fuel_mass/1000:.0f}t fuel needed")
print(f"Total vehicle mass: {(payload+fuel_mass)/1000:.0f}t")`,
      challenge: 'Redesign the mission as an orbital flight instead (go to orbit, fly half an orbit, de-orbit). Compare the Δv budget. Which is more fuel-efficient for a 2,200 km hop?',
      successHint: 'You have designed a space mission from myth to physics. The Pushpaka Vimana’s journey from Lanka to Ayodhya, reimagined with real engineering, requires about 3.3 km/s of Δv and would take 30 minutes at an altitude offering the same panoramic view the Ramayana describes. The dream is the same; only the method has changed.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced aerodynamics, compressibility, and mission design</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced flight and space simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[VimanaBernoulliDiagram, VimanaLiftDragDiagram, VimanaJetEngineDiagram, VimanaRocketDiagram, BernoulliDiagram, OrbitalMechanicsDiagram][i] ? createElement([VimanaBernoulliDiagram, VimanaLiftDragDiagram, VimanaJetEngineDiagram, VimanaRocketDiagram, BernoulliDiagram, OrbitalMechanicsDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
