import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function StarDeepoorLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Meteorite entry physics — atmospheric ablation and deceleration',
      concept: `When a meteoroid enters Earth\'s atmosphere at 15-70 km/s, it encounters rapidly increasing air density. The kinetic energy is enormous: a 1-meter boulder traveling at 20 km/s carries 2×10¹¹ J — equivalent to 50 tons of TNT. Understanding what happens requires the physics of **hypersonic aerodynamics**.

At these speeds, air cannot move out of the way fast enough. A **bow shock** forms in front of the meteoroid, compressing and heating the air to 10,000-20,000 K. This superheated plasma radiates energy back onto the meteoroid's surface, heating it to its melting point and beyond. Material peels off the surface — this is **ablation**, and it is the primary braking mechanism.

The deceleration equation combines drag and mass loss: m(dv/dt) = -½ρ_air × v² × Cd × A, while dm/dt = -½ρ_air × v³ × Ch × A / Q, where Cd is the drag coefficient, Ch is the heat transfer coefficient, A is the cross-sectional area, and Q is the heat of ablation (energy needed to remove unit mass of material). The coupled system shows that most meteoroids lose 90-99% of their mass during atmospheric transit.

Only objects larger than about 10 meters diameter retain significant velocity when they hit the ground. Smaller ones are **decelerated to terminal velocity** (100-300 m/s) high in the atmosphere and fall relatively gently — these are the meteorites we find on the ground.`,
      analogy: 'Atmospheric entry is like pushing your hand through water at increasing speed. At walking speed, water flows around your hand easily. At swimming speed, you feel resistance. At speedboat speed, the water cannot move aside — it sprays and splashes violently, eroding anything in its path. A meteoroid at 20 km/s experiences air as if it were dense liquid, ablating its surface like a sandblaster.',
      storyConnection: 'The star that fell at Deepor Beel did not simply drop from the sky — it blazed a trail of fire across the atmosphere, shedding material and slowing from cosmic velocity to something survivable. The fragment that reached the ground was a fraction of what entered the atmosphere, sculpted by the violence of atmospheric passage into a smooth, melted-surface stone.',
      checkQuestion: 'Why do iron meteorites survive atmospheric entry better than stony meteorites of the same size?',
      checkAnswer: 'Iron meteorites have higher material strength (do not fragment as easily under aerodynamic stress), higher thermal conductivity (distribute heat rather than concentrating it), and higher heat of ablation Q (more energy needed to remove material). Their density is also higher (~8 g/cm³ vs ~3.5 g/cm³), giving them more momentum per unit cross-section (lower area-to-mass ratio), so they decelerate less. All these factors mean iron meteorites lose a smaller fraction of their mass during entry.',
      codeIntro: 'Simulate meteoroid atmospheric entry with coupled drag-ablation equations and compare different meteoroid types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Meteoroid atmospheric entry simulation ---
def atmospheric_entry(mass_kg, velocity_ms, diameter_m, density_kg_m3,
                      heat_ablation_J_kg, entry_angle_deg=45, Cd=1.5, Ch=0.1):
    """Simulate meteoroid entry through Earth's atmosphere."""
    dt = 0.001  # seconds
    g = 9.81
    R_earth = 6.371e6
    angle = np.radians(entry_angle_deg)

    # Atmospheric density model (exponential)
    def rho_air(h):
        if h > 100000: return 0
        H = 8500  # scale height (m)
        return 1.225 * np.exp(-h / H)

    # State: [altitude, velocity, mass]
    h = 120000  # start at 120 km
    v = velocity_ms
    m = mass_kg
    r = diameter_m / 2

    trajectory = {'time': [], 'altitude': [], 'velocity': [], 'mass': [],
                  'deceleration': [], 'heat_flux': [], 'brightness': []}
    t = 0

    while h > 0 and v > 10 and m > mass_kg * 0.001:
        rho = rho_air(h)
        A = np.pi * r**2  # cross-section

        # Drag force
        F_drag = 0.5 * rho * v**2 * Cd * A

        # Ablation rate
        dm_dt = -0.5 * rho * v**3 * Ch * A / heat_ablation_J_kg
        dm_dt = max(dm_dt, -m / dt * 0.5)  # prevent negative mass

        # Deceleration
        decel = F_drag / m if m > 0 else 0

        # Heat flux on surface
        q_flux = 0.5 * rho * v**3 * Ch

        # Luminous energy (proportional to kinetic energy loss rate)
        brightness = 0.01 * F_drag * v  # luminous efficiency ~1%

        # Record
        trajectory['time'].append(t)
        trajectory['altitude'].append(h / 1000)  # km
        trajectory['velocity'].append(v / 1000)   # km/s
        trajectory['mass'].append(m)
        trajectory['deceleration'].append(decel / g)  # in g's
        trajectory['heat_flux'].append(q_flux / 1e6)  # MW/m^2
        trajectory['brightness'].append(brightness)

        # Update state
        v -= (decel - g * np.sin(angle)) * dt
        v = max(v, 0)
        h -= v * np.sin(angle) * dt
        m += dm_dt * dt
        m = max(m, 0)

        # Update radius from remaining mass
        r = (3 * m / (4 * np.pi * density_kg_m3))**(1/3)
        t += dt

        if t > 60: break  # safety limit

    return {k: np.array(v) for k, v in trajectory.items()}

# --- Simulate different meteoroid types ---
meteoroids = {
    'Iron (1m)': {'mass': 4189*7800, 'velocity': 20000, 'diameter': 2.0,
                  'density': 7800, 'ablation': 8e6, 'color': '#ef4444'},
    'Stony (1m)': {'mass': 4189*3500, 'velocity': 20000, 'diameter': 2.0,
                   'density': 3500, 'ablation': 5e6, 'color': '#f59e0b'},
    'Carbonaceous (1m)': {'mass': 4189*2200, 'velocity': 20000, 'diameter': 2.0,
                          'density': 2200, 'ablation': 3e6, 'color': '#22c55e'},
    'Small stone (10cm)': {'mass': 0.524*3500, 'velocity': 15000, 'diameter': 0.1,
                           'density': 3500, 'ablation': 5e6, 'color': '#3b82f6'},
}

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Altitude vs velocity
ax = axes[0, 0]
ax.set_facecolor('#111827')
for name, params in meteoroids.items():
    traj = atmospheric_entry(params['mass'], params['velocity'], params['diameter'],
                              params['density'], params['ablation'])
    ax.plot(traj['velocity'], traj['altitude'], color=params['color'], linewidth=2, label=name)
ax.set_xlabel('Velocity (km/s)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Deceleration Profile', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Mass loss
ax = axes[0, 1]
ax.set_facecolor('#111827')
for name, params in meteoroids.items():
    traj = atmospheric_entry(params['mass'], params['velocity'], params['diameter'],
                              params['density'], params['ablation'])
    mass_frac = traj['mass'] / traj['mass'][0] * 100
    ax.plot(traj['altitude'], mass_frac, color=params['color'], linewidth=2, label=name)
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Remaining Mass (%)', color='white')
ax.set_title('Ablation Mass Loss', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.invert_xaxis()

# Deceleration (g-force)
ax = axes[0, 2]
ax.set_facecolor('#111827')
for name, params in meteoroids.items():
    traj = atmospheric_entry(params['mass'], params['velocity'], params['diameter'],
                              params['density'], params['ablation'])
    ax.plot(traj['altitude'], traj['deceleration'], color=params['color'], linewidth=2, label=name)
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Deceleration (g)', color='white')
ax.set_title('Peak Deceleration', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.invert_xaxis()

# Heat flux
ax = axes[1, 0]
ax.set_facecolor('#111827')
for name, params in meteoroids.items():
    traj = atmospheric_entry(params['mass'], params['velocity'], params['diameter'],
                              params['density'], params['ablation'])
    ax.plot(traj['altitude'], traj['heat_flux'], color=params['color'], linewidth=2, label=name)
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Heat Flux (MW/m²)', color='white')
ax.set_title('Surface Heating', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.invert_xaxis()

# Brightness (fireball luminosity)
ax = axes[1, 1]
ax.set_facecolor('#111827')
for name, params in meteoroids.items():
    traj = atmospheric_entry(params['mass'], params['velocity'], params['diameter'],
                              params['density'], params['ablation'])
    brightness_norm = traj['brightness'] / max(traj['brightness'].max(), 1e-10)
    ax.plot(traj['altitude'], brightness_norm, color=params['color'], linewidth=2, label=name)
ax.set_xlabel('Altitude (km)', color='white')
ax.set_ylabel('Relative Brightness', color='white')
ax.set_title('Fireball Luminosity', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.invert_xaxis()

# Entry angle effect
ax = axes[1, 2]
ax.set_facecolor('#111827')
angles = [15, 30, 45, 60, 80]
colors_angle = plt.cm.viridis(np.linspace(0.2, 0.9, len(angles)))
for angle, col in zip(angles, colors_angle):
    traj = atmospheric_entry(4189*3500, 20000, 2.0, 3500, 5e6, entry_angle_deg=angle)
    ax.plot(traj['velocity'], traj['altitude'], color=col, linewidth=2, label=f'{angle}°')
ax.set_xlabel('Velocity (km/s)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Entry Angle Effect (stony 1m)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Atmospheric Entry Summary:")
for name, params in meteoroids.items():
    traj = atmospheric_entry(params['mass'], params['velocity'], params['diameter'],
                              params['density'], params['ablation'])
    surv = traj['mass'][-1]/traj['mass'][0]*100
    v_final = traj['velocity'][-1]
    h_final = traj['altitude'][-1]
    print(f"  {name}: survived={surv:.1f}%, final v={v_final:.2f} km/s, final alt={h_final:.1f} km")`,
      challenge: 'Add atmospheric fragmentation: when dynamic pressure (0.5*rho*v²) exceeds the material strength, the meteoroid breaks into fragments. Model 2-3 fragments diverging and compute each one\'s trajectory independently.',
      successHint: 'Atmospheric entry physics involves the intersection of fluid dynamics, thermodynamics, and materials science. The same equations that describe meteoroid entry describe spacecraft reentry — understanding one gives you insight into the other.',
    },
    {
      title: 'Impact crater scaling laws — from energy to morphology',
      concept: `When a meteorite strikes the ground with sufficient velocity (>2-3 km/s), it creates an **impact crater** through a process fundamentally different from a simple hole. The impact generates a shock wave that propagates through both the meteorite and the target rock at thousands of meters per second. This shock wave has pressures exceeding 100 GPa — enough to melt and even vaporize rock.

Crater formation occurs in three stages: **contact/compression** (shock wave generation, meteorite destruction), **excavation** (shocked material flows outward and upward, creating a bowl), and **modification** (unstable crater walls collapse, forming a final crater larger than the initial cavity).

The fundamental scaling law relates crater diameter D to impact energy E: **D = k × E^(1/3.4)** for simple craters, where k depends on target material and gravity. This means a 10x increase in energy only doubles the crater diameter — craters are surprisingly insensitive to energy because much energy goes into heating rock rather than moving it.

The transition from **simple** (bowl-shaped) to **complex** (central peak, terraced walls) craters occurs at about 4 km diameter on Earth. Above this size, gravity causes the transient crater to collapse inward, creating a shallower, wider final form with a central uplift.`,
      analogy: 'Crater formation is like dropping a stone into thick mud. The stone disappears, but the mud splashes outward and upward, creating a bowl much larger than the stone. Then the walls of the bowl slowly slump inward, making it wider and shallower. The final crater barely resembles the original hole — it is the product of the material\'s response to the impact, not just the size of the impactor.',
      storyConnection: 'The star that fell at Deepor did not just land — it struck with enough energy to reshape the landscape. Whether the depression near Deepor Beel is impact-related or geological, the physics of crater formation tells us what such an impact would look like: a bowl-shaped depression, possibly with scattered fragments and shock-altered rock.',
      checkQuestion: 'A meteorite impact and a nuclear explosion can both create craters. At the same energy, which creates a larger crater and why?',
      checkAnswer: 'At the same total energy, a nuclear explosion creates a larger crater because all the energy is deposited at the surface. A meteorite buries itself before delivering maximum energy to the ground, coupling more energy into the deep subsurface (which does not contribute much to crater excavation). However, for very large meteorites, the coupling is so efficient that the difference becomes small. For kilometer-scale impacts, the point-source approximation (all energy at a point) works well for both cases.',
      codeIntro: 'Compute crater dimensions from impact parameters using established scaling laws and visualize crater morphology.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Impact crater scaling laws ---
g_earth = 9.81  # m/s^2
rho_target = 2700  # target rock density (kg/m^3, granite)

def impact_energy(mass_kg, velocity_ms):
    """Kinetic energy of impactor."""
    return 0.5 * mass_kg * velocity_ms**2

def crater_diameter_pi_scaling(impactor_mass, impactor_vel, impactor_density,
                                target_density=2700, gravity=9.81):
    """Pi-group scaling (Schmidt-Holsapple) for crater diameter."""
    # Transient crater diameter
    a = (3 * impactor_mass / (4 * np.pi * impactor_density))**(1/3)  # impactor radius
    E = 0.5 * impactor_mass * impactor_vel**2

    # Pi-scaling parameters (for competent rock)
    mu = 0.55  # velocity scaling exponent
    K1 = 0.93  # coupling coefficient

    # Gravity-regime scaling
    pi_2 = gravity * a / impactor_vel**2  # gravity parameter
    pi_V = K1 * pi_2**(-3*mu/(2+mu)) * (impactor_density / target_density)**(6*mu/(6+mu*(3-6)))

    # Transient crater volume
    V_transient = pi_V * impactor_mass / target_density

    # Transient crater diameter (assuming paraboloid, depth/diameter = 1/3)
    D_transient = 2 * (3 * V_transient / np.pi)**(1/3) * 1.2

    # Final crater diameter (simple crater: D_final ~ 1.2 * D_transient)
    D_final = 1.25 * D_transient

    # Simple-to-complex transition
    D_transition = 4000  # meters on Earth
    if D_final > D_transition:
        D_final = D_transition * (D_final / D_transition)**0.85  # complex crater widening

    depth = D_final / 5 if D_final < D_transition else D_final / 20

    return D_final, depth, V_transient, E

# --- Compute craters for various impactors ---
impactor_diameters = np.logspace(-1, 4, 100)  # 0.1m to 10km
velocities = [15000, 20000, 30000]
colors_v = ['#22c55e', '#f59e0b', '#ef4444']

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# --- Crater diameter vs impactor size ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
for vel, col in zip(velocities, colors_v):
    crater_diams = []
    for d_imp in impactor_diameters:
        mass = (4/3) * np.pi * (d_imp/2)**3 * 3500
        D, _, _, _ = crater_diameter_pi_scaling(mass, vel, 3500)
        crater_diams.append(D)
    ax.loglog(impactor_diameters, crater_diams, color=col, linewidth=2,
              label=f'v = {vel/1000:.0f} km/s')
ax.axhline(y=4000, color='white', linestyle='--', alpha=0.3, label='Simple/complex transition')
ax.set_xlabel('Impactor Diameter (m)', color='white')
ax.set_ylabel('Crater Diameter (m)', color='white')
ax.set_title('Crater Size vs Impactor Size', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Energy vs crater diameter ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
energies = np.logspace(10, 25, 100)  # Joules
crater_from_E = []
for E in energies:
    # Invert: E = 0.5*m*v^2, D ~ k * m^(1/3.4) * v^(2/3.4)
    # Simplified: D ~ 0.07 * E^(1/3.4) for rock targets
    D = 0.07 * E**(1/3.4)
    crater_from_E.append(D)
ax.loglog(energies, crater_from_E, color='#3b82f6', linewidth=2)
# Mark known craters
known = [('Barringer', 4e16, 1200), ('Chicxulub', 4e23, 180000), ('Tunguska', 1e16, 0)]
for name, E_est, D_est in known:
    if D_est > 0:
        ax.scatter([E_est], [D_est], s=100, color='#ef4444', zorder=5)
        ax.annotate(name, (E_est, D_est), xytext=(5,5), textcoords='offset points',
                   color='white', fontsize=7)
ax.set_xlabel('Impact Energy (J)', color='white')
ax.set_ylabel('Crater Diameter (m)', color='white')
ax.set_title('Energy-Diameter Scaling', color='white')
ax.tick_params(colors='gray')

# --- Crater cross-section (simple) ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
D_simple = 1000  # 1km crater
depth_simple = D_simple / 5
r_range = np.linspace(-D_simple, D_simple, 500)
# Parabolic profile
z_floor = depth_simple * (2 * r_range / D_simple)**2 - depth_simple
z_rim = np.where(np.abs(r_range) > D_simple/2,
                  50 * np.exp(-(np.abs(r_range) - D_simple/2)**2 / (D_simple/10)**2), 0)
z_total = np.where(np.abs(r_range) < D_simple/2, z_floor, z_rim)

ax.fill_between(r_range, z_total, -depth_simple * 1.2, color='#6b5b3d', alpha=0.5)
ax.fill_between(r_range, z_total, 0, where=z_total < 0, color='#4a3f2f', alpha=0.8)
ax.plot(r_range, z_total, color='#f59e0b', linewidth=2)
ax.axhline(y=0, color='white', linestyle='--', alpha=0.3)
ax.set_xlabel('Distance from center (m)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.set_title(f'Simple Crater Cross-Section (D={D_simple}m)', color='white')
ax.tick_params(colors='gray')

# --- Complex crater cross-section ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
D_complex = 20000  # 20km crater
depth_complex = D_complex / 20
r_range_c = np.linspace(-D_complex * 0.8, D_complex * 0.8, 500)

# Central peak
central_peak = 300 * np.exp(-r_range_c**2 / (D_complex/8)**2)
# Floor
z_floor_c = depth_complex * (2 * r_range_c / D_complex)**4 - depth_complex
# Terraced walls (modulated rim)
terrace = 100 * np.sin(np.abs(r_range_c) / D_complex * 20) * np.exp(-(np.abs(r_range_c) - D_complex/2.5)**2 / (D_complex/8)**2)
z_complex = np.where(np.abs(r_range_c) < D_complex/2.5, z_floor_c + central_peak, terrace)

ax.fill_between(r_range_c, z_complex, -depth_complex*1.2, color='#6b5b3d', alpha=0.5)
ax.fill_between(r_range_c, z_complex, 0, where=z_complex<0, color='#4a3f2f', alpha=0.8)
ax.plot(r_range_c, z_complex, color='#f59e0b', linewidth=2)
ax.axhline(y=0, color='white', linestyle='--', alpha=0.3)
ax.set_xlabel('Distance (m)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.set_title(f'Complex Crater (D={D_complex/1000:.0f}km, central peak)', color='white')
ax.tick_params(colors='gray')

# --- Depth/Diameter ratio ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
D_range = np.logspace(1, 5, 100)
dd_ratio = np.where(D_range < 4000, 1/5, 1/20 * (4000/D_range)**0.3)
ax.semilogx(D_range, dd_ratio, color='#a855f7', linewidth=2)
ax.axvline(x=4000, color='white', linestyle='--', alpha=0.3, label='Simple/complex transition')
ax.set_xlabel('Crater Diameter (m)', color='white')
ax.set_ylabel('Depth/Diameter Ratio', color='white')
ax.set_title('Crater Proportions', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Ejecta blanket thickness vs distance ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
D_crater = 1000  # 1km crater
r_ejecta = np.linspace(D_crater/2, D_crater * 5, 200)
# Ejecta thickness: t ~ (R/r)^3 * thickness_at_rim
t_rim = 10  # meters at rim
t_ejecta = t_rim * (D_crater / (2 * r_ejecta))**3
ax.semilogy(r_ejecta / D_crater, t_ejecta, color='#ef4444', linewidth=2)
ax.set_xlabel('Distance from Center (crater diameters)', color='white')
ax.set_ylabel('Ejecta Thickness (m)', color='white')
ax.set_title('Ejecta Blanket: Thickness Falls Off Steeply', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Impact Crater Scaling Results:")
test_cases = [
    ('1m stone at 20 km/s', (4/3)*np.pi*0.5**3*3500, 20000, 3500),
    ('10m stone at 20 km/s', (4/3)*np.pi*5**3*3500, 20000, 3500),
    ('100m iron at 20 km/s', (4/3)*np.pi*50**3*7800, 20000, 7800),
    ('1km stone at 20 km/s', (4/3)*np.pi*500**3*3500, 20000, 3500),
]
for name, mass, vel, dens in test_cases:
    D, depth, V, E = crater_diameter_pi_scaling(mass, vel, dens)
    print(f"  {name}: crater D={D:.0f}m, depth={depth:.0f}m, E={E:.2e}J")`,
      challenge: 'Add a Mars comparison: Mars has lower gravity (3.72 m/s²) and thinner atmosphere. Show how the same impactor creates a different crater on Mars vs Earth.',
      successHint: 'Crater scaling laws are one of the great triumphs of dimensional analysis in physics. By identifying the key dimensionless groups (gravity parameter, strength parameter, density ratio), we can predict crater sizes spanning 15 orders of magnitude in energy with a single equation.',
    },
    {
      title: 'Shock metamorphism — reading impact history from minerals',
      concept: `Impact events leave permanent signatures in rocks and minerals. **Shock metamorphism** creates unique features that occur ONLY under the extreme pressures (>10 GPa) and temperatures of impacts — they cannot be formed by any other geological process.

Key shock indicators, in order of increasing pressure:
- **Planar deformation features (PDFs)** in quartz (10-35 GPa): parallel sets of closely spaced planes where the crystal lattice has been deformed. Multiple sets at specific crystallographic orientations are diagnostic of impact.
- **Diaplectic glass** (35-50 GPa): the crystal structure is destroyed but the grain retains its original shape — the mineral "melts" internally without flowing. Diaplectic quartz glass (also called maskelynite in feldspar) is unmistakable evidence of impact.
- **High-pressure polymorphs** (12-45 GPa): coesite and stishovite (high-pressure forms of SiO₂) form during shock compression. They are metastable at surface conditions and persist as impact markers for billions of years.
- **Impact melt** (>50 GPa): rock melted by the shock wave, forming glass or fine-grained crystalline rocks with distinctive chemistry (mixed composition from multiple source rocks).

These features allow geologists to confirm impact craters even when the crater morphology has been eroded away. The **peak pressure** at any point in the crater can be estimated from which shock features are present.`,
      analogy: 'Shock metamorphism is like a forensic fingerprint at a crime scene. Just as specific fingerprint patterns uniquely identify a person, specific mineral deformations uniquely identify an impact event. No earthquake, no volcanic eruption, no tectonic process creates PDFs in quartz or stishovite — these are the exclusive signatures of cosmic violence. Finding them in a rock is like finding the meteorite\'s fingerprint.',
      storyConnection: 'If the Deepor Beel event left rock fragments, a geologist could examine them under a microscope for shock features. PDFs in quartz, high-pressure minerals, or impact melt glass would confirm the cosmic origin beyond any doubt. The story\'s "fallen star" would leave physical evidence encoded in the crystal structure of the rocks it touched.',
      checkQuestion: 'A geologist finds stishovite (a high-pressure SiO₂ polymorph) in sedimentary rock layers from 66 million years ago. What can they conclude?',
      checkAnswer: 'The stishovite is definitive evidence of an impact event at that time — it forms only above 12 GPa, well beyond any endogenic geological process. Combined with the age of 66 Ma, this is evidence for the Chicxulub impact (the asteroid that contributed to dinosaur extinction). Stishovite has been found in the global K-Pg boundary layer, confirming that the impact distributed shocked material worldwide. This is exactly how the impact hypothesis was confirmed in the 1990s.',
      codeIntro: 'Model shock wave propagation through rock, compute peak pressures at different distances, and map which shock features form where.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Shock wave propagation and metamorphism ---
def shock_pressure_profile(impactor_mass, impactor_vel, impactor_density,
                           target_density=2700, target_sound_speed=5000):
    """Compute peak shock pressure as function of distance from impact point."""
    # Impact pressure (Hugoniot)
    # P_impact ~ rho_t * U_s * u_p, where u_p ~ v_impact/2 for similar materials
    u_p = impactor_vel / 2  # particle velocity
    # Shock velocity: U_s = C_0 + s * u_p (linear Hugoniot)
    s = 1.5  # Hugoniot slope parameter for rock
    C0 = target_sound_speed
    U_s = C0 + s * u_p
    P_contact = target_density * U_s * u_p  # Pa

    # Impactor radius
    a = (3 * impactor_mass / (4 * np.pi * impactor_density))**(1/3)

    # Pressure decay with distance: P(r) ~ P_contact * (a/r)^n, n ≈ 2-3
    n_decay = 2.5
    r_range = np.logspace(np.log10(a), np.log10(a * 100), 500)
    P_range = P_contact * (a / r_range)**n_decay

    return r_range, P_range, P_contact, a

# Shock metamorphism zones (pressure thresholds in GPa)
shock_zones = {
    'Fracturing': (0.5, 2, '#6b7280'),
    'Planar fractures': (2, 10, '#3b82f6'),
    'PDFs in quartz': (10, 35, '#22c55e'),
    'Diaplectic glass': (35, 50, '#f59e0b'),
    'Impact melt': (50, 100, '#ef4444'),
    'Vaporization': (100, 500, '#a855f7'),
}

# Compute for a medium-sized impactor
mass_imp = (4/3) * np.pi * 50**3 * 3500  # 100m stony
vel_imp = 20000

r, P, P0, a_imp = shock_pressure_profile(mass_imp, vel_imp, 3500)
P_GPa = P / 1e9

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# --- Pressure vs distance ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.loglog(r / a_imp, P_GPa, color='white', linewidth=2)
for zone_name, (p_low, p_high, col) in shock_zones.items():
    ax.axhspan(p_low, p_high, alpha=0.15, color=col)
    mask = (P_GPa >= p_low) & (P_GPa <= p_high)
    if mask.any():
        ax.text(r[mask][len(r[mask])//2] / a_imp, (p_low + p_high) / 2,
                zone_name, color=col, fontsize=6, ha='center')
ax.set_xlabel('Distance from Impact (impactor radii)', color='white')
ax.set_ylabel('Peak Pressure (GPa)', color='white')
ax.set_title('Shock Pressure Decay', color='white')
ax.tick_params(colors='gray')

# --- Shock zone map (2D crater view) ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
theta = np.linspace(0, 2*np.pi, 100)
for zone_name, (p_low, p_high, col) in reversed(list(shock_zones.items())):
    # Find radii where pressure equals boundaries
    r_inner = a_imp * (P0 / (p_high * 1e9))**(1/2.5) if p_high * 1e9 < P0 else a_imp
    r_outer = a_imp * (P0 / (p_low * 1e9))**(1/2.5) if p_low * 1e9 < P0 else r[-1]
    ax.fill_between(r_outer * np.cos(theta) / a_imp, r_outer * np.sin(theta) / a_imp,
                     alpha=0.4, color=col, label=f'{zone_name} ({p_low}-{p_high} GPa)')
ax.set_xlabel('Distance (impactor radii)', color='white')
ax.set_ylabel('Distance (impactor radii)', color='white')
ax.set_title('Shock Metamorphism Zones (plan view)', color='white')
ax.set_aspect('equal')
ax.legend(fontsize=5, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper right')
ax.tick_params(colors='gray')

# --- Hugoniot curve ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
u_p_range = np.linspace(0, 10000, 200)
materials = {
    'Granite': {'C0': 5000, 's': 1.5, 'rho': 2700, 'color': '#22c55e'},
    'Iron': {'C0': 3800, 's': 1.6, 'rho': 7800, 'color': '#ef4444'},
    'Ice': {'C0': 1600, 's': 1.4, 'rho': 900, 'color': '#3b82f6'},
}
for mat_name, mat in materials.items():
    U_s = mat['C0'] + mat['s'] * u_p_range
    P_hug = mat['rho'] * U_s * u_p_range / 1e9
    ax.plot(u_p_range / 1000, P_hug, color=mat['color'], linewidth=2, label=mat_name)
ax.set_xlabel('Particle Velocity (km/s)', color='white')
ax.set_ylabel('Shock Pressure (GPa)', color='white')
ax.set_title('Hugoniot Curves: Pressure vs Particle Velocity', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Temperature behind shock ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Post-shock temperature: T = T0 + P*V_0*(gamma-1)/(2*Cv)
# Simplified: T ~ P/(rho*Cv) for strong shocks
Cv_rock = 1000  # J/(kg·K)
T_range = P / (2700 * Cv_rock)
ax.semilogx(r / a_imp, T_range, color='#ef4444', linewidth=2)
ax.axhline(y=1400, color='#f59e0b', linestyle='--', alpha=0.5, label='Melting point (rock)')
ax.axhline(y=3000, color='#a855f7', linestyle='--', alpha=0.5, label='Vaporization')
ax.set_xlabel('Distance (impactor radii)', color='white')
ax.set_ylabel('Post-shock Temperature (K)', color='white')
ax.set_title('Shock Heating', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Quartz phase diagram with shock path ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Simplified SiO2 phase diagram
P_phase = np.linspace(0, 100, 200)
# Phase boundaries (approximate)
ax.fill_between(P_phase, 0, 1000, where=P_phase<2, alpha=0.3, color='#22c55e', label='α-Quartz')
ax.fill_between(P_phase, 0, 1000, where=(P_phase>=2)&(P_phase<9), alpha=0.3, color='#3b82f6', label='Coesite')
ax.fill_between(P_phase, 0, 1000, where=(P_phase>=9)&(P_phase<50), alpha=0.3, color='#f59e0b', label='Stishovite')
ax.fill_between(P_phase, 0, 1000, where=P_phase>=50, alpha=0.3, color='#ef4444', label='Melt/Glass')
# Shock path (Hugoniot)
T_shock = 300 + P_phase * 1e9 / (2700 * 1000) * 0.3  # simplified
ax.plot(P_phase, T_shock, color='white', linewidth=2, linestyle='--', label='Shock path')
ax.set_xlabel('Pressure (GPa)', color='white')
ax.set_ylabel('Temperature (K)', color='white')
ax.set_title('SiO₂ Phase Diagram with Shock Path', color='white')
ax.set_ylim(0, 5000)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Impactor size vs zones ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
imp_diameters = [1, 10, 50, 100, 500]
zone_names = list(shock_zones.keys())
zone_extents = np.zeros((len(imp_diameters), len(zone_names)))
for i, d in enumerate(imp_diameters):
    mass = (4/3) * np.pi * (d/2)**3 * 3500
    r_z, P_z, P0_z, a_z = shock_pressure_profile(mass, 20000, 3500)
    P_GPa_z = P_z / 1e9
    for j, (zn, (pl, ph, _)) in enumerate(shock_zones.items()):
        mask = (P_GPa_z >= pl) & (P_GPa_z <= ph)
        if mask.any():
            zone_extents[i, j] = (r_z[mask][-1] - r_z[mask][0])

x_pos = np.arange(len(imp_diameters))
width = 0.12
for j, (zn, (_, _, col)) in enumerate(shock_zones.items()):
    ax.bar(x_pos + j*width, zone_extents[:, j], width, color=col, alpha=0.7, label=zn)
ax.set_xticks(x_pos + 0.3)
ax.set_xticklabels([f'{d}m' for d in imp_diameters], color='white')
ax.set_xlabel('Impactor Diameter', color='white')
ax.set_ylabel('Zone Extent (m)', color='white')
ax.set_title('Shock Zone Size by Impactor', color='white')
ax.legend(fontsize=5, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Shock Metamorphism Summary (100m stone at 20 km/s):")
print(f"  Contact pressure: {P0/1e9:.0f} GPa")
for zone_name, (p_low, p_high, col) in shock_zones.items():
    r_inner = a_imp * (P0 / (p_high * 1e9))**(1/2.5) if p_high*1e9 < P0 else a_imp
    r_outer = a_imp * (P0 / (p_low * 1e9))**(1/2.5) if p_low*1e9 < P0 else 0
    print(f"  {zone_name}: {r_inner:.0f}m to {r_outer:.0f}m from center")`,
      challenge: 'Add a drilling simulation: a geologist drills a vertical core through the crater. Plot the shock features they would encounter at each depth, from surface ejecta through the shocked basement rock.',
      successHint: 'Shock metamorphism is the Rosetta Stone of impact science. Without it, we could not distinguish impact craters from volcanic calderas or tectonic basins. Every confirmed impact crater on Earth was verified through microscopic shock features — the physics leaves an indelible signature in the crystal structure of minerals.',
    },
    {
      title: 'Meteorite classification — chemical fingerprints from space',
      concept: `Meteorites are classified by their chemical composition and texture into three major groups: **irons** (primarily Fe-Ni alloy), **stony-irons** (mix of metal and silicate), and **stones** (primarily silicate minerals). Stones are further divided into **chondrites** (primitive, containing chondrules — millimeter-sized spheres of once-molten silicate) and **achondrites** (processed, lacking chondrules — fragments of differentiated parent bodies).

The chemical classification uses element ratios as fingerprints. Key discriminants:
- **Fe/Si ratio**: irons >> chondrites > achondrites
- **Mg/Si ratio**: distinguishes between chondrite groups (H, L, LL, E, C)
- **Oxygen isotope ratios** (δ¹⁷O, δ¹⁸O): the gold standard for linking meteorites to parent bodies. Each parent body has a unique oxygen isotope signature because isotope ratios were set during solar system formation and differ between regions of the protoplanetary disk.
- **Siderophile element patterns** (Ir, Os, Ni): reveal whether the parent body differentiated (formed a metallic core) or remained primitive.

Cluster analysis on multi-element chemistry automatically groups meteorites into their traditional classes, demonstrating that the classification scheme is real — not arbitrary. Each cluster corresponds to a distinct parent body in the solar system.`,
      analogy: 'Meteorite classification is like identifying a person\'s hometown from their accent. Different regions produce different accents (chemical signatures). A trained linguist (geochemist) can listen to someone speak (analyze a rock) and say "you are from southeast of the asteroid belt, a body that never melted" (an L chondrite from a primitive parent body). The chemical "accent" is set at birth (solar system formation) and cannot be faked.',
      storyConnection: 'If the star that fell at Deepor Beel could be recovered and analyzed, its chemical composition would tell us exactly where it came from in the solar system. Was it a piece of a primitive chondrite parent body, never melted since the solar system formed? Or a fragment of a differentiated asteroid that once had a metallic core? The chemistry is a return address written in atoms.',
      checkQuestion: 'Two meteorites have identical major element compositions but different oxygen isotope ratios. Can they come from the same parent body?',
      checkAnswer: 'No. Oxygen isotope ratios are the most robust identifier of parent body origin. Two meteorites from the same parent body MUST have the same oxygen isotope signature (plotting on the same mass-fractionation line). Different oxygen ratios mean different parent bodies, even if major elements are similar. This is because major elements can be fractionated by igneous processes (melting, crystallization) on the parent body, but oxygen isotopes preserve the original nebular signature. It is like two siblings having the same family name but different DNA — impossible.',
      codeIntro: 'Analyze meteorite chemical compositions, build a classifier using element ratios, and visualize the classification space.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Synthetic meteorite chemical database ---
def generate_meteorites(n_per_class=30):
    """Generate synthetic meteorite compositions (wt% of major elements)."""
    classes = {
        'H chondrite': {'Fe': (27, 2), 'Si': (17, 1), 'Mg': (14, 1), 'O': (35, 2),
                        'd18O': (3.5, 0.3), 'd17O': (2.8, 0.2)},
        'L chondrite': {'Fe': (22, 2), 'Si': (19, 1), 'Mg': (15, 1), 'O': (37, 2),
                        'd18O': (4.5, 0.3), 'd17O': (3.5, 0.2)},
        'LL chondrite': {'Fe': (19, 2), 'Si': (19, 1), 'Mg': (16, 1), 'O': (38, 2),
                         'd18O': (5.0, 0.3), 'd17O': (3.8, 0.2)},
        'Carbonaceous': {'Fe': (18, 3), 'Si': (14, 2), 'Mg': (12, 2), 'O': (40, 3),
                         'd18O': (1.0, 1.0), 'd17O': (-1.0, 1.0)},
        'Achondrite': {'Fe': (15, 3), 'Si': (22, 2), 'Mg': (10, 3), 'O': (42, 2),
                       'd18O': (3.8, 0.5), 'd17O': (2.0, 0.5)},
        'Iron': {'Fe': (90, 3), 'Si': (0.5, 0.3), 'Mg': (0.2, 0.1), 'O': (1, 0.5),
                 'd18O': (0, 0.1), 'd17O': (0, 0.1)},
    }
    data = []
    labels = []
    for cls_name, params in classes.items():
        for _ in range(n_per_class):
            sample = {el: max(0, np.random.normal(mu, sig)) for el, (mu, sig) in params.items()}
            data.append(sample)
            labels.append(cls_name)
    return data, labels

data, labels = generate_meteorites(40)
n = len(data)

# Extract arrays
Fe = np.array([d['Fe'] for d in data])
Si = np.array([d['Si'] for d in data])
Mg = np.array([d['Mg'] for d in data])
d18O = np.array([d['d18O'] for d in data])
d17O = np.array([d['d17O'] for d in data])

unique_labels = list(set(labels))
color_map = {'H chondrite': '#22c55e', 'L chondrite': '#3b82f6', 'LL chondrite': '#a855f7',
             'Carbonaceous': '#f59e0b', 'Achondrite': '#ef4444', 'Iron': '#6b7280'}

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# --- Fe/Si vs Mg/Si ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
for lbl in unique_labels:
    mask = [l == lbl for l in labels]
    ax.scatter(Fe[mask]/Si[mask], Mg[mask]/Si[mask], color=color_map[lbl], s=30,
              alpha=0.7, label=lbl, edgecolors='white', linewidth=0.3)
ax.set_xlabel('Fe/Si', color='white')
ax.set_ylabel('Mg/Si', color='white')
ax.set_title('Chemical Classification: Fe/Si vs Mg/Si', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Oxygen three-isotope plot ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
for lbl in unique_labels:
    mask = [l == lbl for l in labels]
    ax.scatter(d18O[mask], d17O[mask], color=color_map[lbl], s=30,
              alpha=0.7, label=lbl, edgecolors='white', linewidth=0.3)
# Terrestrial fractionation line
x_tfl = np.linspace(-2, 7, 100)
ax.plot(x_tfl, 0.52 * x_tfl, '--', color='white', alpha=0.5, label='TFL (slope=0.52)')
ax.set_xlabel('δ¹⁸O (‰)', color='white')
ax.set_ylabel('δ¹⁷O (‰)', color='white')
ax.set_title('Oxygen Isotope Plot (each cluster = parent body)', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- k-NN classification ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
# Build feature matrix
X_class = np.column_stack([Fe/Si, Mg/Si, d18O, d17O])
y_class = np.array([unique_labels.index(l) for l in labels])

# Standardize
mu_c = X_class.mean(0); sig_c = X_class.std(0) + 1e-10
X_std = (X_class - mu_c) / sig_c

# Leave-one-out k-NN
k = 5
correct = 0
predictions = []
for i in range(n):
    dists = np.sqrt(np.sum((np.delete(X_std, i, axis=0) - X_std[i])**2, axis=1))
    nearest = np.argsort(dists)[:k]
    y_others = np.delete(y_class, i)
    neighbor_labels = y_others[nearest]
    pred = np.bincount(neighbor_labels, minlength=len(unique_labels)).argmax()
    predictions.append(pred)
    if pred == y_class[i]:
        correct += 1

acc = correct / n
# Confusion matrix
cm = np.zeros((len(unique_labels), len(unique_labels)), dtype=int)
for true, pred in zip(y_class, predictions):
    cm[true, pred] += 1

ax.imshow(cm, cmap='Blues', aspect='equal')
ax.set_xticks(range(len(unique_labels)))
ax.set_yticks(range(len(unique_labels)))
short_labels = [l.split()[0][:6] for l in unique_labels]
ax.set_xticklabels(short_labels, rotation=45, color='white', fontsize=7)
ax.set_yticklabels(short_labels, color='white', fontsize=7)
for i in range(len(unique_labels)):
    for j in range(len(unique_labels)):
        ax.text(j, i, str(cm[i,j]), ha='center', va='center', color='white' if cm[i,j]<5 else 'black', fontsize=8)
ax.set_xlabel('Predicted', color='white')
ax.set_ylabel('True', color='white')
ax.set_title(f'k-NN Confusion Matrix (acc={acc:.0%})', color='white')
ax.tick_params(colors='gray')

# --- Fe content distribution ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
for lbl in unique_labels:
    mask = [l == lbl for l in labels]
    ax.hist(Fe[mask], bins=15, alpha=0.4, color=color_map[lbl], label=lbl)
ax.set_xlabel('Fe (wt%)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Iron Content by Meteorite Class', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- PCA for dimensionality reduction ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Simple PCA (numpy only)
X_centered = X_std - X_std.mean(0)
cov = X_centered.T @ X_centered / (n - 1)
eigenvalues, eigenvectors = np.linalg.eigh(cov)
idx = np.argsort(eigenvalues)[::-1]
pc1 = X_centered @ eigenvectors[:, idx[0]]
pc2 = X_centered @ eigenvectors[:, idx[1]]
for lbl_idx, lbl in enumerate(unique_labels):
    mask = y_class == lbl_idx
    ax.scatter(pc1[mask], pc2[mask], color=color_map[lbl], s=30, alpha=0.7,
              label=lbl, edgecolors='white', linewidth=0.3)
ax.set_xlabel(f'PC1 ({eigenvalues[idx[0]]/eigenvalues.sum()*100:.0f}% var)', color='white')
ax.set_ylabel(f'PC2 ({eigenvalues[idx[1]]/eigenvalues.sum()*100:.0f}% var)', color='white')
ax.set_title('PCA: Meteorite Classification Space', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Unknown meteorite classification ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
# Classify a "mystery" meteorite
mystery = {'Fe': 21.5, 'Si': 18.5, 'Mg': 15.2, 'd18O': 4.3, 'd17O': 3.3}
x_mystery = np.array([mystery['Fe']/mystery['Si'], mystery['Mg']/mystery['Si'],
                       mystery['d18O'], mystery['d17O']])
x_mystery_std = (x_mystery - mu_c) / sig_c
dists_m = np.sqrt(np.sum((X_std - x_mystery_std)**2, axis=1))
nearest_m = np.argsort(dists_m)[:5]
neighbor_classes = [labels[i] for i in nearest_m]
from collections import Counter
votes = Counter(neighbor_classes)
prediction_m = votes.most_common(1)[0][0]

text = f"MYSTERY METEORITE CLASSIFICATION\\n{'='*35}\\n\\n"
text += f"Fe: {mystery['Fe']:.1f}%  Si: {mystery['Si']:.1f}%\\n"
text += f"Mg: {mystery['Mg']:.1f}%  δ¹⁸O: {mystery['d18O']:.1f}‰\\n\\n"
text += f"Nearest neighbors:\\n"
for idx_m in nearest_m:
    text += f"  {labels[idx_m]} (dist={dists_m[idx_m]:.2f})\\n"
text += f"\\nCLASSIFICATION: {prediction_m}\\n"
text += f"Confidence: {votes[prediction_m]/5:.0%}"
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10, color='white',
        verticalalignment='top', fontfamily='monospace')

plt.tight_layout()
plt.show()

print(f"Classification accuracy: {acc:.0%}")
print(f"Mystery meteorite classified as: {prediction_m}")
print(f"\\nKey: oxygen isotopes are the gold standard — they separate parent bodies")
print("that major elements alone cannot distinguish.")`,
      challenge: 'Add trace element patterns (Ir, Ni, Co, Cr) and build a decision tree classifier. Compare its accuracy with k-NN and analyze which features are most discriminating.',
      successHint: 'Meteorite classification is applied geochemistry at its finest. Each meteorite is a message from a specific location in the early solar system. By reading the chemical fingerprints — especially oxygen isotopes — we can trace individual rocks back to their parent bodies across 4.6 billion years of history.',
    },
    {
      title: 'Crater morphometry — measuring crater shapes from topographic data',
      concept: `Crater morphometry — the quantitative measurement of crater shape — is how planetary scientists analyze impact features from orbital data. When a spacecraft photographs a crater on Mars or the Moon, morphometric analysis extracts the physical story of the impact.

Key morphometric parameters:
- **Diameter (D)**: measured at the rim crest
- **Depth (d)**: from rim crest to floor center. The d/D ratio distinguishes fresh from degraded craters
- **Rim height (h_rim)**: above surrounding terrain. Fresh craters on the Moon have h_rim ≈ 0.04D
- **Circularity**: how close to a perfect circle. Oblique impacts (angle < 15°) create elliptical craters
- **Ejecta radius**: how far the ejecta extends, typically 1-2 crater diameters
- **Central peak height**: for complex craters, the uplift of the central peak

**Digital Elevation Models (DEMs)** provide the raw data. We extract radial profiles (elevation vs distance from center), azimuthal profiles (elevation at constant radius around the crater), and compute statistical measures of symmetry, roughness, and degradation state.

The **degradation state** tells us relative age: fresh craters have sharp rims and deep floors; old craters are filled with sediment and have eroded rims. On the Moon, where there is no erosion, degradation comes from subsequent smaller impacts chipping away at the crater.`,
      analogy: 'Crater morphometry is like measuring footprints in the sand. A fresh footprint is deep, sharp-edged, and clearly shows the shoe sole pattern. An old footprint is shallow, rounded, and partially filled with windblown sand. By measuring depth, edge sharpness, and infill, you can estimate how old the footprint is. Craters work the same way — their shape tells you their age and the nature of the impact that made them.',
      storyConnection: 'If the Deepor Beel area preserves an impact structure, morphometric analysis of the topography would reveal it. Even a heavily eroded crater millions of years old retains subtle signatures in the elevation data — a gentle circular depression, a slight rim raised above the surroundings, and anomalous drainage patterns.',
      checkQuestion: 'A crater has d/D = 0.10. On the Moon, fresh craters have d/D ≈ 0.20. What does this tell you about the crater\'s age or history?',
      checkAnswer: 'The crater is either heavily degraded (old, eroded, or infilled) or it has been modified by post-impact processes. A d/D of 0.10 is half the fresh value, suggesting roughly 50% infill of the original cavity. On the Moon, this corresponds to a moderately degraded state (Class C out of A-D). On Earth, infill could be sedimentary (lake deposits, volcanic fill) or erosional (weathering of the rim and floor). Morphometric ratios are the primary tool for assessing crater preservation state.',
      codeIntro: 'Generate synthetic crater topography, extract morphometric parameters, and classify craters by degradation state.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Synthetic crater DEM generation ---
def generate_crater_dem(D_km, d_D_ratio=0.20, rim_h_ratio=0.04,
                        resolution=200, degradation=0.0, ellipticity=1.0):
    """Generate a synthetic crater DEM.
    degradation: 0=fresh, 1=heavily degraded
    ellipticity: 1=circular, 0.5=very elliptical
    """
    size = D_km * 3
    x = np.linspace(-size/2, size/2, resolution)
    y = np.linspace(-size/2, size/2, resolution)
    X, Y = np.meshgrid(x, y)

    # Elliptical distance
    R = np.sqrt(X**2 + (Y / ellipticity)**2)
    theta = np.arctan2(Y, X)

    D = D_km
    depth = D * d_D_ratio * (1 - 0.7 * degradation)
    rim_height = D * rim_h_ratio * (1 - 0.8 * degradation)
    crater_R = D / 2

    # Crater floor (parabolic)
    floor = np.where(R < crater_R, depth * (R / crater_R)**2 - depth, 0)

    # Rim
    rim = rim_height * np.exp(-(R - crater_R)**2 / (crater_R * 0.1)**2)
    rim = np.where(R > crater_R * 0.8, rim, 0)

    # Ejecta blanket
    ejecta = rim_height * 0.5 * np.where(R > crater_R,
                                           (crater_R / R)**3, 0)

    # Combine
    dem = floor + rim + ejecta

    # Add degradation (infill and noise)
    if degradation > 0:
        infill = degradation * depth * 0.5 * np.exp(-R**2 / (crater_R * 0.8)**2)
        dem += infill
    dem += np.random.randn(resolution, resolution) * D * 0.002 * (1 + degradation)

    return x, y, dem

# --- Generate craters at different degradation states ---
fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Crater Morphometry Analysis', color='white', fontsize=14)

degradation_states = [0, 0.3, 0.6, 0.9]
deg_labels = ['Fresh', 'Moderate', 'Degraded', 'Heavily Degraded']
D_test = 10  # km

for idx, (deg, lbl) in enumerate(zip(degradation_states, deg_labels)):
    x, y, dem = generate_crater_dem(D_test, degradation=deg)

    # Top view
    ax = axes[0, idx]
    ax.set_facecolor('#111827')
    im = ax.imshow(dem, extent=[x[0], x[-1], y[0], y[-1]], origin='lower',
                   cmap='terrain', aspect='equal')
    ax.set_title(f'{lbl} (deg={deg})', color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=6)

    # Radial profile
    ax = axes[1, idx]
    ax.set_facecolor('#111827')
    center_idx = len(x) // 2
    profile = dem[center_idx, :]
    ax.plot(x, profile, color='#22c55e', linewidth=2)
    ax.axhline(y=0, color='white', linestyle='--', alpha=0.3)
    ax.set_xlabel('Distance (km)', color='white')
    ax.set_ylabel('Elevation (km)', color='white')
    ax.set_title(f'd/D = {abs(profile.min())/D_test:.3f}', color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=6)

plt.tight_layout()
plt.show()

# --- Morphometric parameter extraction ---
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# d/D ratio vs degradation
ax = axes[0, 0]
ax.set_facecolor('#111827')
degs = np.linspace(0, 1, 50)
dD_ratios = []
for deg in degs:
    _, _, dem = generate_crater_dem(10, degradation=deg)
    center = len(dem)//2
    profile = dem[center, :]
    dD_ratios.append(abs(profile.min()) / 10)
ax.plot(degs, dD_ratios, 'o-', color='#22c55e', linewidth=2, markersize=3)
ax.set_xlabel('Degradation State', color='white')
ax.set_ylabel('d/D Ratio', color='white')
ax.set_title('Depth-Diameter Ratio vs Degradation', color='white')
ax.tick_params(colors='gray')

# Rim height vs degradation
ax = axes[0, 1]
ax.set_facecolor('#111827')
rim_heights = []
for deg in degs:
    _, _, dem = generate_crater_dem(10, degradation=deg)
    center = len(dem)//2
    profile = dem[center, :]
    rim_heights.append(max(profile))
ax.plot(degs, rim_heights, 'o-', color='#f59e0b', linewidth=2, markersize=3)
ax.set_xlabel('Degradation State', color='white')
ax.set_ylabel('Rim Height (km)', color='white')
ax.set_title('Rim Height vs Degradation', color='white')
ax.tick_params(colors='gray')

# Circularity for different ellipticities
ax = axes[0, 2]
ax.set_facecolor('#111827')
ellips = [1.0, 0.8, 0.6, 0.4]
for ell in ellips:
    _, _, dem = generate_crater_dem(10, ellipticity=ell, degradation=0)
    # Compute circularity from rim contour
    threshold = dem.max() * 0.3
    rim_mask = dem > threshold
    area = rim_mask.sum()
    perimeter = np.sum(np.abs(np.diff(rim_mask.astype(int), axis=0))) + \
                np.sum(np.abs(np.diff(rim_mask.astype(int), axis=1)))
    circularity = 4 * np.pi * area / (perimeter**2 + 1e-10)
    ax.scatter([ell], [circularity], s=100, label=f'e={ell}', edgecolors='white')
ax.set_xlabel('Ellipticity', color='white')
ax.set_ylabel('Circularity (1=perfect circle)', color='white')
ax.set_title('Circularity vs Impact Angle', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Multiple crater sizes
ax = axes[1, 0]
ax.set_facecolor('#111827')
crater_sizes = [2, 5, 10, 20, 50]
for D in crater_sizes:
    x, y, dem = generate_crater_dem(D, degradation=0)
    center = len(x)//2
    profile = dem[center, :]
    r_norm = x / D  # normalize to crater diameter
    z_norm = profile / D  # normalize depths
    ax.plot(r_norm, z_norm, linewidth=2, label=f'D={D}km')
ax.set_xlabel('Distance / Diameter', color='white')
ax.set_ylabel('Elevation / Diameter', color='white')
ax.set_title('Normalized Profiles (self-similar)', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3D view of fresh crater
ax = axes[1, 1]
ax.remove()
ax = fig.add_subplot(2, 3, 5, projection='3d')
ax.set_facecolor('#111827')
x3, y3, dem3 = generate_crater_dem(10, degradation=0, resolution=80)
X3, Y3 = np.meshgrid(x3, y3)
ax.plot_surface(X3, Y3, dem3, cmap='terrain', linewidth=0, antialiased=False)
ax.set_xlabel('km', color='white', fontsize=7)
ax.set_ylabel('km', color='white', fontsize=7)
ax.set_title('3D: Fresh 10km Crater', color='white', fontsize=10)
ax.tick_params(colors='gray', labelsize=5)

# Degradation classification
ax = axes[1, 2]
ax.set_facecolor('#111827')
n_craters = 80
true_degs = np.random.uniform(0, 1, n_craters)
measured_dD = []
measured_rim = []
for deg in true_degs:
    _, _, dem = generate_crater_dem(10, degradation=deg)
    c = len(dem)//2
    p = dem[c,:]
    measured_dD.append(abs(p.min())/10)
    measured_rim.append(max(p))

ax.scatter(measured_dD, measured_rim, c=true_degs, cmap='RdYlGn_r', s=30,
          edgecolors='white', linewidth=0.3)
ax.set_xlabel('d/D Ratio', color='white')
ax.set_ylabel('Rim Height (km)', color='white')
ax.set_title('Morphometric Classification Space', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Crater Morphometry Summary:")
print(f"  Fresh crater d/D: {dD_ratios[0]:.3f}")
print(f"  Heavily degraded d/D: {dD_ratios[-1]:.3f}")
print(f"  Degradation reduces d/D by {(1-dD_ratios[-1]/dD_ratios[0])*100:.0f}%")
print(f"  Rim height drops from {rim_heights[0]:.3f} to {rim_heights[-1]:.3f} km")`,
      challenge: 'Add a crater age estimation module: use d/D ratio and rim roughness to estimate relative age on a 0-4 Gyr scale, calibrated to known lunar crater ages.',
      successHint: 'Crater morphometry is how we read the geological history of planetary surfaces. Every crater is a clock and a record of its formation event. The quantitative approach — measuring shapes rather than just looking at them — enables automated analysis of the millions of craters on the Moon and Mars.',
    },
    {
      title: 'Orbital mechanics — where do meteorites come from?',
      concept: `Every meteorite that falls to Earth was once part of an asteroid or comet orbiting the Sun. To trace a meteorite back to its source, we need **orbital mechanics** — the physics of objects moving under gravity.

All solar system bodies follow **Kepler's laws**: orbits are ellipses with the Sun at one focus. An orbit is defined by six elements, the most important being:
- **Semi-major axis (a)**: half the longest diameter, determines orbital period via Kepler's third law: T² = a³ (T in years, a in AU)
- **Eccentricity (e)**: 0 = circle, 0-1 = ellipse, 1 = parabola. Most asteroids have e = 0.05-0.25
- **Inclination (i)**: tilt relative to Earth\'s orbital plane

Meteoroids reach Earth through **dynamical delivery mechanisms**: gravitational perturbations by Jupiter, Yarkovsky effect (thermal radiation pressure), and orbital resonances (specific orbital periods where Jupiter's gravity amplifies perturbations). These processes move asteroids from the main belt into Earth-crossing orbits over millions of years.

By tracking a fireball's trajectory through the atmosphere using multiple ground cameras, we can compute the meteoroid's pre-entry orbit and determine which part of the asteroid belt it came from. Only about 40 meteorites have had their orbits recovered — each one is a direct link between a rock in our hands and a specific region of space.`,
      analogy: 'Orbital mechanics is like tracking a ball thrown across a field in reverse. You see where it landed (the meteorite impact site) and which direction it came from (fireball trajectory), and you work backward to figure out who threw it (which asteroid). The "thrower" in this case is the gravitational dynamics of the asteroid belt, and the "field" is the inner solar system.',
      storyConnection: 'The star that fell at Deepor Beel traveled millions of kilometers through space before its final plunge. Its orbit — shaped by Jupiter\'s gravity over millions of years — brought it from the asteroid belt to an intersection with Earth\'s path. The impact was the end of a journey that began when the solar system was young.',
      checkQuestion: 'Most recovered meteorites come from the inner asteroid belt (2.1-2.5 AU), not the outer belt (3-4 AU). Why?',
      checkAnswer: 'Two reasons: (1) The inner belt is closer to the 3:1 Kirkwood gap (orbital resonance with Jupiter at 2.5 AU), which is the most efficient dynamical pathway for delivering material to Earth-crossing orbits. Objects in this resonance have their eccentricity pumped up until they cross Earth\'s orbit. (2) Inner belt objects have shorter travel times to Earth, so they spend less time being re-scattered or destroyed before impact. The outer belt has fewer efficient delivery pathways and objects take longer to reach Earth, giving more time for collisional destruction.',
      codeIntro: 'Simulate asteroid orbital dynamics, compute Earth-crossing conditions, and trace meteorite origins using orbital mechanics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Orbital mechanics for meteorite delivery ---
AU = 1.496e11  # meters
G = 6.674e-11
M_sun = 1.989e30

def orbital_period(a_au):
    """Kepler's third law: T(years) = a(AU)^1.5"""
    return a_au**1.5

def orbital_velocity(a_au, r_au):
    """Vis-viva equation: v = sqrt(GM*(2/r - 1/a))"""
    a = a_au * AU; r = r_au * AU
    return np.sqrt(G * M_sun * (2/r - 1/a))

def orbit_path(a_au, e, n_points=360):
    """Compute (x,y) path for an elliptical orbit."""
    theta = np.linspace(0, 2*np.pi, n_points)
    r = a_au * (1 - e**2) / (1 + e * np.cos(theta))
    x = r * np.cos(theta)
    y = r * np.sin(theta)
    return x, y

def perihelion(a, e):
    return a * (1 - e)

def aphelion(a, e):
    return a * (1 + e)

# --- Solar system overview ---
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Inner solar system orbits
ax = axes[0, 0]
ax.set_facecolor('#111827')
planets = {'Mercury': (0.387, 0.206), 'Venus': (0.723, 0.007),
           'Earth': (1.0, 0.017), 'Mars': (1.524, 0.093)}
planet_colors = {'Mercury': '#6b7280', 'Venus': '#f59e0b', 'Earth': '#3b82f6', 'Mars': '#ef4444'}
for name, (a, e) in planets.items():
    x, y = orbit_path(a, e)
    ax.plot(x, y, color=planet_colors[name], linewidth=1.5, label=name)
# Some asteroids
for _ in range(30):
    a_ast = np.random.uniform(2.0, 3.5)
    e_ast = np.random.uniform(0.01, 0.25)
    x_a, y_a = orbit_path(a_ast, e_ast)
    ax.plot(x_a, y_a, color='#22c55e', linewidth=0.3, alpha=0.3)
# Earth-crossing asteroid
x_ec, y_ec = orbit_path(1.8, 0.5)
ax.plot(x_ec, y_ec, color='#f59e0b', linewidth=2, label='Earth-crosser')
ax.scatter([0], [0], color='yellow', s=100, zorder=5)
ax.set_aspect('equal')
ax.set_xlabel('AU', color='white')
ax.set_ylabel('AU', color='white')
ax.set_title('Inner Solar System', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_xlim(-4, 4); ax.set_ylim(-4, 4)

# --- Asteroid belt distribution ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
n_asteroids = 2000
a_belt = np.random.uniform(1.8, 4.0, n_asteroids)
e_belt = np.abs(np.random.normal(0.1, 0.1, n_asteroids))
# Remove Kirkwood gaps (resonances with Jupiter)
kirkwood_gaps = [2.065, 2.502, 2.825, 3.279]  # 4:1, 3:1, 5:2, 2:1
for gap in kirkwood_gaps:
    mask = np.abs(a_belt - gap) > 0.05
    a_belt = a_belt[mask]; e_belt = e_belt[mask]
    n_asteroids = len(a_belt)

ax.scatter(a_belt, e_belt, s=2, color='#22c55e', alpha=0.5)
for gap, label in zip(kirkwood_gaps, ['4:1', '3:1', '5:2', '2:1']):
    ax.axvline(x=gap, color='#ef4444', linestyle='--', alpha=0.5, linewidth=1)
    ax.text(gap, 0.45, label, color='#ef4444', fontsize=7, ha='center')
# Earth-crossing boundary
a_cross = np.linspace(0.5, 4, 100)
e_cross = 1 - 1.0 / a_cross  # perihelion = 1 AU
ax.plot(a_cross[e_cross > 0], e_cross[e_cross > 0], color='#3b82f6', linewidth=2,
        label='Earth-crossing boundary')
ax.set_xlabel('Semi-major Axis (AU)', color='white')
ax.set_ylabel('Eccentricity', color='white')
ax.set_title('Asteroid Belt (Kirkwood gaps marked)', color='white')
ax.set_xlim(1.5, 4.2); ax.set_ylim(0, 0.5)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Orbital velocity vs distance ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
r_range = np.linspace(0.3, 5, 200)
# Circular orbit velocity
v_circ = orbital_velocity(r_range, r_range) / 1000
ax.plot(r_range, v_circ, color='#22c55e', linewidth=2, label='Circular orbit')
# Earth
v_earth = orbital_velocity(1.0, 1.0) / 1000
ax.scatter([1.0], [v_earth], s=100, color='#3b82f6', zorder=5)
ax.annotate(f'Earth ({v_earth:.1f} km/s)', (1.0, v_earth), xytext=(10, 10),
           textcoords='offset points', color='white', fontsize=8)
# Escape velocity
v_esc = np.sqrt(2) * v_circ
ax.plot(r_range, v_esc, color='#ef4444', linewidth=2, linestyle='--', label='Escape velocity')
ax.set_xlabel('Distance from Sun (AU)', color='white')
ax.set_ylabel('Velocity (km/s)', color='white')
ax.set_title('Orbital and Escape Velocities', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Meteorite entry velocity distribution ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Simulate entry velocities
n_meteoroids = 1000
a_met = np.random.uniform(1.5, 3.5, n_meteoroids)
e_met = np.abs(np.random.normal(0.15, 0.15, n_meteoroids))
# Only those that cross Earth's orbit
earth_crossers = perihelion(a_met, e_met) <= 1.0
a_ec = a_met[earth_crossers]; e_ec = e_met[earth_crossers]

# Entry velocity: v_inf = sqrt(v_helio^2 + v_earth^2 - 2*v_helio*v_earth*cos(theta))
# Simplified: v_entry ~ sqrt(v_escape_earth^2 + v_inf^2)
v_earth_ms = 29780  # m/s
v_escape_earth = 11200  # m/s
v_helio = orbital_velocity(a_ec, 1.0)
v_inf = np.sqrt(np.abs(v_helio**2 - v_earth_ms**2))
v_entry = np.sqrt(v_inf**2 + v_escape_earth**2) / 1000  # km/s

ax.hist(v_entry, bins=30, color='#f59e0b', alpha=0.7, edgecolor='white', linewidth=0.5)
ax.axvline(x=11.2, color='#22c55e', linestyle='--', label='Min (escape velocity)')
ax.axvline(x=72, color='#ef4444', linestyle='--', label='Max (retrograde comet)')
ax.set_xlabel('Entry Velocity (km/s)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Meteoroid Entry Velocity Distribution', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Delivery timescale from Yarkovsky effect ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Yarkovsky drift rate: da/dt ~ 1e-4 AU/Myr for 1m body
body_sizes = np.logspace(-1, 2, 100)  # meters
drift_rate = 1e-4 / body_sizes  # AU/Myr (inversely proportional to size)
delivery_time = 0.3 / drift_rate  # time to drift 0.3 AU to resonance (Myr)
ax.loglog(body_sizes, delivery_time, color='#a855f7', linewidth=2)
ax.axhline(y=4500, color='white', linestyle='--', alpha=0.3, label='Age of solar system')
ax.set_xlabel('Body Diameter (m)', color='white')
ax.set_ylabel('Delivery Time (Myr)', color='white')
ax.set_title('Yarkovsky Delivery Timescale', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Recovered meteorite orbits ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
recovered = {
    'Pribram': (2.40, 0.67),
    'Innisfree': (1.87, 0.47),
    'Peekskill': (1.49, 0.41),
    'Tagish Lake': (2.10, 0.57),
    'Neuschwanstein': (2.40, 0.67),
    'Chelyabinsk': (1.72, 0.57),
}
ax.scatter([], [])  # dummy for legend
for name, (a, e) in recovered.items():
    ax.scatter([a], [e], s=80, zorder=5, edgecolors='white', linewidth=0.5)
    ax.annotate(name, (a, e), xytext=(5, 5), textcoords='offset points',
               color='white', fontsize=6)
# Background belt
ax.scatter(a_belt[:500], e_belt[:500], s=1, color='#22c55e', alpha=0.3)
# Earth-crossing boundary
ax.plot(a_cross[e_cross>0], e_cross[e_cross>0], color='#3b82f6', linewidth=2, label='Earth-crossing')
ax.set_xlabel('Semi-major Axis (AU)', color='white')
ax.set_ylabel('Eccentricity', color='white')
ax.set_title('Recovered Meteorite Orbits', color='white')
ax.set_xlim(1, 4); ax.set_ylim(0, 0.8)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Orbital Mechanics Summary:")
print(f"  Earth-crossing asteroids: {earth_crossers.sum()} of {n_meteoroids}")
print(f"  Mean entry velocity: {v_entry.mean():.1f} km/s")
print(f"  Entry velocity range: {v_entry.min():.1f} - {v_entry.max():.1f} km/s")
print(f"  Kirkwood gaps (resonances) at: {', '.join(f'{g:.3f} AU' for g in kirkwood_gaps)}")
print()
for name, (a, e) in recovered.items():
    q = a*(1-e); Q = a*(1+e)
    print(f"  {name}: a={a:.2f} AU, e={e:.2f}, perihelion={q:.2f} AU, aphelion={Q:.2f} AU")`,
      challenge: 'Simulate the Yarkovsky drift of a 10m asteroid from the 3:1 Kirkwood gap to an Earth-crossing orbit. Track how the semi-major axis changes over millions of years and show the transition from belt orbit to Earth-crossing orbit.',
      successHint: 'Orbital mechanics connects every meteorite in our collections to a specific location in the solar system. The combination of orbital data, chemical fingerprints, and shock features tells us the complete story: where the rock formed, what happened to it in space, and how it got to Earth. Each meteorite is a planetary probe we did not have to launch.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (meteorite science fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real impact physics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            />
        ))}
      </div>
    </div>
  );
}
