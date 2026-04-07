import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TurtleMountainLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Reptile thermoregulation — ectothermy as a computational problem',
      concept: `Turtles are ectotherms: they cannot generate internal heat the way mammals do. Their body temperature is determined by a balance between heat gained from the environment and heat lost to it. This is not a deficiency — it is an alternative thermal strategy that works brilliantly for the right body plan.

The heat balance equation for a turtle is:
m * c * dT/dt = Q_solar + Q_conduction + Q_convection + Q_radiation + Q_metabolic

Where:
- **Q_solar**: heat absorbed from sunlight (depends on shell colour, surface area, and orientation to sun)
- **Q_conduction**: heat gained/lost through direct contact with ground or water
- **Q_convection**: heat lost to moving air or water
- **Q_radiation**: infrared radiation emitted by the body (proportional to T^4 by Stefan-Boltzmann law)
- **Q_metabolic**: tiny amount of heat from metabolism (negligible in reptiles at rest)

A turtle regulates its temperature by **behavior**: basking in sun (increase Q_solar), retreating to shade (decrease Q_solar), entering water (change Q_conduction), and adjusting posture (change exposed surface area). This behavioral thermoregulation is a real-time optimization algorithm.`,
      analogy: 'An ectotherm is like a house with no furnace but excellent windows. You control the temperature by opening or closing blinds (basking vs. shade), opening windows (convection), and insulating the walls (retreating into the shell). It costs almost nothing to run, but you must actively manage it.',
      storyConnection: 'The turtle climbing the mountain in our story faces a thermoregulation crisis. At higher altitudes, temperatures drop and solar radiation changes. Every rest stop is a thermal decision: bask on a sun-warmed rock, or shelter from cold wind? The turtle is solving an optimization problem with every step.',
      checkQuestion: 'A turtle basks on a dark rock at noon. Its body temperature is rising toward 40C, which is dangerously hot. What behavioral responses are available, and which heat transfer terms do they modify?',
      checkAnswer: 'The turtle can: (1) move to shade — reduces Q_solar. (2) Enter water — increases Q_conduction to a cooler medium and adds Q_convection. (3) Retract into shell — reduces exposed surface area, lowering Q_solar and Q_convection but also trapping heat. (4) Orient body perpendicular to sun — reduces projected solar area. The optimal response depends on which cooling channel is most effective given current conditions.',
      codeIntro: 'Build a thermal model of a turtle and simulate body temperature under different environmental conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Turtle thermal model
def turtle_temperature(hours, T_air, solar_W, wind_speed, substrate_T,
                       mass_kg=5.0, shell_absorptivity=0.7, shell_area_m2=0.04):
    """Simulate turtle body temperature over time."""
    c = 3400  # specific heat of turtle tissue (J/kg/K)
    dt = 60  # time step in seconds
    n_steps = int(hours * 3600 / dt)

    T_body = np.zeros(n_steps)
    T_body[0] = T_air[0] if hasattr(T_air, '__len__') else T_air

    sigma = 5.67e-8  # Stefan-Boltzmann constant
    emissivity = 0.95

    for i in range(1, n_steps):
        t_idx = min(int(i * dt / 3600 * len(T_air) / hours), len(T_air) - 1) if hasattr(T_air, '__len__') else 0
        Ta = T_air[t_idx] if hasattr(T_air, '__len__') else T_air
        S = solar_W[t_idx] if hasattr(solar_W, '__len__') else solar_W
        Ts = substrate_T[t_idx] if hasattr(substrate_T, '__len__') else substrate_T
        w = wind_speed

        Tb = T_body[i-1]

        # Heat fluxes (W)
        Q_solar = shell_absorptivity * S * shell_area_m2
        Q_convection = -10 * (1 + 2*w) * shell_area_m2 * (Tb - Ta)  # h ~ 10 + 20*wind
        Q_conduction = 5 * 0.01 * (Ts - Tb)  # k * A_contact * dT
        Q_radiation = -emissivity * sigma * shell_area_m2 * ((Tb+273)**4 - (Ta+273)**4)
        Q_metabolic = 0.02 * mass_kg  # negligible

        Q_total = Q_solar + Q_convection + Q_conduction + Q_radiation + Q_metabolic
        dT = Q_total * dt / (mass_kg * c)
        T_body[i] = Tb + dT

    time_hours = np.linspace(0, hours, n_steps)
    return time_hours, T_body

# Simulate a 12-hour day
hours = 12
n_points = 100
time_profile = np.linspace(0, hours, n_points)

# Air temperature: cool morning, warm afternoon
T_air = 20 + 12 * np.sin(np.pi * time_profile / hours)
# Solar radiation: bell curve peaking at noon
solar = 800 * np.sin(np.pi * time_profile / hours) ** 1.5
solar = np.maximum(solar, 0)
# Substrate temperature: lags air by ~1 hour
substrate = 18 + 15 * np.sin(np.pi * (time_profile - 1) / hours)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Environmental conditions
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(time_profile, T_air, color='#ef4444', linewidth=2, label='Air temp')
ax.plot(time_profile, substrate, color='#f59e0b', linewidth=2, label='Substrate')
ax2 = ax.twinx()
ax2.plot(time_profile, solar, color='#fbbf24', linewidth=2, linestyle='--', label='Solar (W/m²)')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax2.set_ylabel('Solar radiation (W/m²)', color='#fbbf24')
ax.set_title('Environmental conditions', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Plot 2: Body temperature for different masses
ax = axes[0, 1]
ax.set_facecolor('#111827')
masses = [0.5, 2.0, 5.0, 15.0]
for mass, clr in zip(masses, ['#22c55e', '#3b82f6', '#a855f7', '#ef4444']):
    t, Tb = turtle_temperature(hours, T_air, solar, 1.0, substrate, mass_kg=mass)
    ax.plot(t, Tb, color=clr, linewidth=2, label=f'{mass} kg')
ax.plot(time_profile, T_air, color='gray', linewidth=1, linestyle='--', label='Air')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Body temperature (°C)', color='white')
ax.set_title('Thermal inertia vs body mass', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Wind speed effect
ax = axes[0, 2]
ax.set_facecolor('#111827')
for wind, clr, lbl in [(0, '#ef4444', 'No wind'), (2, '#f59e0b', '2 m/s'), (5, '#3b82f6', '5 m/s'), (10, '#22c55e', '10 m/s')]:
    t, Tb = turtle_temperature(hours, T_air, solar, wind, substrate)
    ax.plot(t, Tb, color=clr, linewidth=2, label=lbl)
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Body temp (°C)', color='white')
ax.set_title('Wind cooling effect', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Shell colour (absorptivity) effect
ax = axes[1, 0]
ax.set_facecolor('#111827')
for absorb, clr, lbl in [(0.3, '#3b82f6', 'Light shell 0.3'), (0.5, '#22c55e', 'Medium 0.5'),
                           (0.7, '#f59e0b', 'Dark 0.7'), (0.95, '#ef4444', 'Black 0.95')]:
    t, Tb = turtle_temperature(hours, T_air, solar, 1.0, substrate, shell_absorptivity=absorb)
    ax.plot(t, Tb, color=clr, linewidth=2, label=lbl)
ax.axhline(38, color='#ef4444', linewidth=1, linestyle=':', label='Heat stress')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Body temp (°C)', color='white')
ax.set_title('Shell colour effect', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Heat flux breakdown at noon
ax = axes[1, 1]
ax.set_facecolor('#111827')
Tb_noon = 32  # approximate
Ta_noon = 32
S_noon = 800
Ts_noon = 33
a, area = 0.7, 0.04
sigma = 5.67e-8

fluxes = {
    'Solar': a * S_noon * area,
    'Convection': -10 * 3 * area * (Tb_noon - Ta_noon),
    'Conduction': 5 * 0.01 * (Ts_noon - Tb_noon),
    'Radiation': -0.95 * sigma * area * ((Tb_noon+273)**4 - (Ta_noon+273)**4),
    'Metabolic': 0.1,
}
names = list(fluxes.keys())
vals = list(fluxes.values())
colors_bar = ['#fbbf24', '#3b82f6', '#f59e0b', '#ef4444', '#22c55e']
ax.barh(names, vals, color=colors_bar, height=0.5)
ax.axvline(0, color='gray', linewidth=1)
ax.set_xlabel('Heat flux (W)', color='white')
ax.set_title('Heat budget at noon', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Altitude effect (decreasing T_air)
ax = axes[1, 2]
ax.set_facecolor('#111827')
altitudes = [100, 500, 1000, 2000]
for alt, clr in zip(altitudes, ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']):
    lapse = alt * 6.5 / 1000  # lapse rate: 6.5 C per 1000m
    T_alt = T_air - lapse
    sub_alt = substrate - lapse
    t, Tb = turtle_temperature(hours, T_alt, solar * (1 + alt*0.0001), 1.5, sub_alt)
    ax.plot(t, Tb, color=clr, linewidth=2, label=f'{alt}m')
ax.axhline(15, color='#3b82f6', linewidth=1, linestyle=':', label='Activity threshold')
ax.set_xlabel('Hour', color='white')
ax.set_ylabel('Body temp (°C)', color='white')
ax.set_title('Altitude lapse rate effect', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Turtle thermoregulation model:")
print(f"  Heavier turtles have more thermal inertia (slower heating/cooling)")
print(f"  Wind dramatically increases convective heat loss")
print(f"  Dark shells absorb more solar radiation")
print(f"  At 2000m, the 6.5°C/km lapse rate reduces body temp significantly")
print(f"  Heat budget at noon: solar dominates input, radiation dominates loss")`,
      challenge: 'Add a behavioral thermoregulation algorithm: the turtle moves between sun and shade to maintain body temperature between 25-35C. Implement a simple controller that switches behavior based on current body temperature.',
      successHint: 'Ectothermic thermoregulation is fundamentally a control systems problem. The turtle is a feedback controller: sense temperature, choose behavior, modify heat balance. This same framework applies to engineering thermostats, HVAC systems, and spacecraft thermal management.',
    },
    {
      title: 'Shell biomechanics — stress distribution in a dome structure',
      concept: `A turtle shell is an engineering marvel: a thin, curved composite structure that resists crushing loads from predators while remaining light enough to carry. The shell functions as a **thin-walled pressure vessel** — or more precisely, a dome.

Dome structures distribute loads efficiently because compressive forces travel along the curved surface rather than concentrating at a point. The key equations come from membrane theory:

For a dome under uniform pressure p:
- **Meridional stress**: sigma_m = p * R / (2 * t), where R is radius of curvature and t is shell thickness
- **Hoop stress**: sigma_h = p * R / (2 * t) * (1 - cos(phi) / (1 + cos(phi))), where phi is the angle from the apex

At the top of the dome (phi = 0), both stresses are equal: pure biaxial compression. At the base (phi = 90), the hoop stress becomes tensile — this is where domes tend to crack, and where the turtle shell connects to the plastron (belly plate) with a bony bridge.

The turtle shell is also a **composite material**: an outer layer of keratin scutes (tough, flexible) bonded to an inner layer of bony plates (hard, rigid). This composite combines stiffness with fracture toughness, similar to how fiberglass combines glass fibers with resin.`,
      analogy: 'A turtle shell works like an egg. Try to crush an egg by squeezing it evenly from all sides — it is surprisingly strong because the dome distributes force everywhere. But tap it at a point — it cracks because the force concentrates. Predator teeth are point loads; the dome shape is the defense.',
      storyConnection: 'The turtle climbing the mountain risks falls and rockslides. Its shell is not just a home but a crash helmet, engineered by evolution to distribute impact forces across the entire structure. Every bump on the trail tests the biomechanical design of the dome.',
      checkQuestion: 'Why is a flatter shell (lower dome height relative to diameter) weaker under top-down loads than a more domed shell?',
      checkAnswer: 'A flatter shell has a larger radius of curvature at the apex. Since stress = p * R / (2t), a larger R means higher stress for the same pressure and thickness. Additionally, a flat shell cannot efficiently redirect vertical loads into compressive membrane forces — more of the load creates bending, which thin shells resist poorly. This is why tortoises (which face predators from above) have highly domed shells while aquatic turtles (which face different pressures) have flatter, more streamlined shells.',
      codeIntro: 'Model stress distribution in a turtle shell dome under different loading conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Shell dome stress analysis
def dome_stresses(R, t, p, phi_range):
    """Membrane stresses in a spherical dome under uniform pressure."""
    phi = np.radians(phi_range)
    # Meridional (along meridian lines)
    sigma_m = p * R / (2 * t) * np.ones_like(phi)
    # Hoop (circumferential)
    sigma_h = p * R / (2 * t) * (1 - 1 / (1 + np.cos(phi)))
    return sigma_m, sigma_h

def point_load_stress(R, t, F, phi_range, phi_load=0):
    """Approximate stress from a point load (predator tooth)."""
    phi = np.radians(phi_range)
    phi_l = np.radians(phi_load)
    # Stress concentration near load point
    dist = np.abs(phi - phi_l) * R
    dist = np.maximum(dist, 0.001)  # avoid division by zero
    # Approximate: stress decays as 1/distance from point load
    sigma = F / (2 * np.pi * t * dist)
    return sigma

# Shell parameters
R_domed = 0.10  # 10 cm radius for domed shell
R_flat = 0.20   # 20 cm radius for flat shell (same base diameter)
t = 0.003       # 3 mm shell thickness
p_crush = 5000  # Pa, uniform crushing pressure
F_tooth = 50    # N, point load from predator tooth

phi_range = np.linspace(0.1, 85, 200)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Membrane stresses — domed shell
ax = axes[0, 0]
ax.set_facecolor('#111827')
sm, sh = dome_stresses(R_domed, t, p_crush, phi_range)
ax.plot(phi_range, sm/1000, color='#22c55e', linewidth=2, label='Meridional')
ax.plot(phi_range, sh/1000, color='#3b82f6', linewidth=2, label='Hoop')
ax.axhline(0, color='gray', linewidth=1, linestyle='--')
ax.set_xlabel('Angle from apex (degrees)', color='white')
ax.set_ylabel('Stress (kPa)', color='white')
ax.set_title(f'Domed shell (R={R_domed*100:.0f}cm)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Compare domed vs flat
ax = axes[0, 1]
ax.set_facecolor('#111827')
sm_d, sh_d = dome_stresses(R_domed, t, p_crush, phi_range)
sm_f, sh_f = dome_stresses(R_flat, t, p_crush, phi_range)
ax.plot(phi_range, sm_d/1000, color='#22c55e', linewidth=2, label='Domed meridional')
ax.plot(phi_range, sm_f/1000, color='#ef4444', linewidth=2, label='Flat meridional')
ax.set_xlabel('Angle from apex (degrees)', color='white')
ax.set_ylabel('Stress (kPa)', color='white')
ax.set_title('Domed vs flat shell stress', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Point load stress distribution
ax = axes[0, 2]
ax.set_facecolor('#111827')
s_point_d = point_load_stress(R_domed, t, F_tooth, phi_range, phi_load=0)
s_point_f = point_load_stress(R_flat, t, F_tooth, phi_range, phi_load=0)
ax.plot(phi_range, s_point_d/1e6, color='#22c55e', linewidth=2, label='Domed')
ax.plot(phi_range, s_point_f/1e6, color='#ef4444', linewidth=2, label='Flat')
ax.set_xlabel('Angle from load point (degrees)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Point load (predator tooth)', color='white', fontsize=11)
ax.set_ylim(0, 50)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Shell thickness optimization
ax = axes[1, 0]
ax.set_facecolor('#111827')
thicknesses = np.linspace(0.001, 0.01, 50)
max_stress_per_t = []
mass_per_t = []
for tt in thicknesses:
    sm, sh = dome_stresses(R_domed, tt, p_crush, phi_range)
    max_stress_per_t.append(np.max(np.abs(sm)))
    mass_per_t.append(2 * np.pi * R_domed**2 * tt * 2000)  # bone density ~2000 kg/m³

ax.plot(np.array(thicknesses)*1000, np.array(max_stress_per_t)/1000, color='#ef4444', linewidth=2, label='Max stress')
ax2 = ax.twinx()
ax2.plot(np.array(thicknesses)*1000, np.array(mass_per_t)*1000, color='#3b82f6', linewidth=2, label='Shell mass')
ax.set_xlabel('Shell thickness (mm)', color='white')
ax.set_ylabel('Max stress (kPa)', color='#ef4444')
ax2.set_ylabel('Mass (g)', color='#3b82f6')
ax.set_title('Thickness trade-off: strength vs weight', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Plot 5: Composite material properties
ax = axes[1, 1]
ax.set_facecolor('#111827')
materials = ['Keratin\n(outer)', 'Bone\n(inner)', 'Composite\n(shell)', 'Steel\n(reference)']
youngs = [3, 18, 12, 200]  # GPa (approximate)
toughness = [50, 5, 30, 100]  # kJ/m² (approximate)
x = np.arange(len(materials))
bars1 = ax.bar(x - 0.2, youngs, 0.35, color='#22c55e', label="Stiffness (GPa)")
bars2 = ax.bar(x + 0.2, toughness, 0.35, color='#a855f7', label="Toughness (kJ/m²)")
ax.set_xticks(x)
ax.set_xticklabels(materials, fontsize=8, color='white')
ax.set_ylabel('Value', color='white')
ax.set_title('Shell composite properties', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Dome shape visualization with stress coloring
ax = axes[1, 2]
ax.set_facecolor('#111827')
theta = np.linspace(0, 2*np.pi, 100)
phi_vis = np.linspace(0, np.pi/2, 50)
# Draw dome cross-section with stress colors
x_dome = R_domed * np.sin(phi_vis)
y_dome = R_domed * np.cos(phi_vis)
sm_vis, sh_vis = dome_stresses(R_domed, t, p_crush, np.degrees(phi_vis))
stress_mag = np.sqrt(sm_vis**2 + sh_vis**2)
for i in range(len(phi_vis) - 1):
    color_val = stress_mag[i] / stress_mag.max()
    ax.plot(x_dome[i:i+2]*100, y_dome[i:i+2]*100,
            color=plt.cm.RdYlGn_r(color_val), linewidth=4)
ax.plot(-x_dome*100, y_dome*100, color='gray', linewidth=2, linestyle='--')
ax.set_xlabel('Horizontal distance (cm)', color='white')
ax.set_ylabel('Height (cm)', color='white')
ax.set_title('Stress distribution on dome (red=high)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Shell biomechanics analysis:")
print(f"  Domed shell (R={R_domed*100:.0f}cm): max meridional stress = {np.max(sm_d)/1000:.1f} kPa")
print(f"  Flat shell (R={R_flat*100:.0f}cm): max meridional stress = {np.max(sm_f)/1000:.1f} kPa")
print(f"  Stress ratio (flat/domed): {np.max(sm_f)/np.max(sm_d):.1f}x")
print(f"  Composite advantage: keratin adds toughness, bone adds stiffness")
print(f"  The dome shape converts crushing loads into membrane compression")`,
      challenge: 'Add an impact simulation: a predator applies a sudden point load. Model the stress wave propagating through the shell. How does shell curvature affect wave speed and stress concentration?',
      successHint: 'Shell biomechanics is structural engineering at its finest. The same dome principles that make turtle shells strong also make cathedral domes, egg shells, and spacecraft pressure vessels work. Nature solved these engineering problems 200 million years ago.',
    },
    {
      title: 'Nesting ecology — temperature-dependent sex determination',
      concept: `In many turtle species, the sex of offspring is determined not by chromosomes but by the temperature of the nest during a critical period of development. This is called **temperature-dependent sex determination (TSD)**.

The typical pattern:
- Below a **pivotal temperature** (Tp, often ~29°C): all males
- Above Tp: all females
- At exactly Tp: 50/50 sex ratio

The transition is not abrupt — it follows a sigmoid function:
P(female) = 1 / (1 + exp(-k * (T - Tp)))

where k controls the steepness of the transition. A large k means a narrow temperature window for mixed-sex clutches; a small k means a broader transition zone.

This matters enormously for conservation. Climate change is warming nest temperatures worldwide. Warmer nests produce more females. Some beach populations already show 90%+ female hatchlings. If the trend continues, populations could run out of males — a demographic catastrophe called **feminization**.

The nest itself is a thermal system. Temperature varies with depth, soil composition, shade cover, and distance from the coast. A single nest can have a temperature gradient of 2-3°C from top to bottom, producing both sexes from the same clutch.`,
      analogy: 'TSD is like a thermostat that controls a factory production line. Below the set point, the factory makes product A (males). Above it, product B (females). If someone gradually turns up the thermostat (climate change), the factory makes nothing but product B, and eventually runs out of the raw materials that only product A can provide.',
      storyConnection: 'The turtle climbing toward the mountain is also climbing toward cooler temperatures. If she nests at higher altitude, her eggs will experience lower temperatures, potentially producing more males. The mountain journey is not just a pilgrimage — it is a sex-ratio optimization strategy driven by thermal biology.',
      checkQuestion: 'A conservation manager wants to produce a 50/50 sex ratio in a captive breeding program. The pivotal temperature is 29°C with k=1.5. What incubation temperature should they target, and how precisely must they control it?',
      checkAnswer: 'They should target exactly 29°C (the pivotal temperature). The precision needed depends on k. With k=1.5, a 1°C deviation from Tp shifts the sex ratio to about 82% female (at 30°C) or 82% male (at 28°C). They need temperature control within +/-0.5°C for a roughly 60/40 to 40/60 range. In practice, this requires a precision incubator — natural nests have far more temperature variation.',
      codeIntro: 'Model temperature-dependent sex determination and simulate how climate warming affects population sex ratios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Temperature-Dependent Sex Determination model
def sex_ratio(T, Tp=29.0, k=1.5):
    """Probability of female given nest temperature."""
    return 1 / (1 + np.exp(-k * (T - Tp)))

def nest_temperature_profile(T_surface, depth_cm, soil_type='sand'):
    """Temperature at depth in nest (simplified conduction model)."""
    # Thermal diffusivity varies by soil type
    diffusivity = {'sand': 0.3, 'clay': 0.2, 'loam': 0.25}
    alpha = diffusivity.get(soil_type, 0.25)
    # Temperature amplitude decreases exponentially with depth
    damping = np.exp(-depth_cm * 0.05 / np.sqrt(alpha))
    return T_surface * damping + (1 - damping) * (T_surface - 3)  # deep soil slightly cooler

# Climate warming scenario
def project_sex_ratios(years, warming_rate=0.03, Tp=29.0, base_T=28.5):
    """Project sex ratios under climate warming."""
    temperatures = base_T + warming_rate * years
    ratios = sex_ratio(temperatures, Tp)
    return temperatures, ratios

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: TSD sigmoid curve
ax = axes[0, 0]
ax.set_facecolor('#111827')
T_range = np.linspace(25, 33, 200)
for k_val, clr, lbl in [(0.5, '#3b82f6', 'Broad (k=0.5)'), (1.5, '#22c55e', 'Typical (k=1.5)'), (3.0, '#ef4444', 'Sharp (k=3.0)')]:
    ax.plot(T_range, sex_ratio(T_range, k=k_val) * 100, color=clr, linewidth=2, label=lbl)
ax.axhline(50, color='gray', linewidth=1, linestyle='--')
ax.axvline(29, color='#f59e0b', linewidth=1, linestyle='--', label='Pivotal T')
ax.set_xlabel('Nest temperature (°C)', color='white')
ax.set_ylabel('% Female', color='white')
ax.set_title('Temperature-Dependent Sex Determination', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Nest temperature gradient
ax = axes[0, 1]
ax.set_facecolor('#111827')
depths = np.linspace(0, 40, 100)
for T_surf, clr, lbl in [(30, '#ef4444', 'Hot day 30°C'), (28, '#f59e0b', 'Warm 28°C'), (26, '#3b82f6', 'Cool 26°C')]:
    T_depth = np.array([nest_temperature_profile(T_surf, d) for d in depths])
    ax.plot(T_depth, depths, color=clr, linewidth=2, label=lbl)
ax.axvline(29, color='#22c55e', linewidth=2, linestyle='--', label='Pivotal T')
ax.invert_yaxis()
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Depth (cm)', color='white')
ax.set_title('Temperature gradient in nest', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Climate projection — sex ratio over decades
ax = axes[0, 2]
ax.set_facecolor('#111827')
years = np.arange(0, 101)
for rate, clr, lbl in [(0.01, '#3b82f6', '+0.01°C/yr'), (0.03, '#f59e0b', '+0.03°C/yr'), (0.05, '#ef4444', '+0.05°C/yr')]:
    temps, ratios = project_sex_ratios(years, warming_rate=rate)
    ax.plot(2025 + years, ratios * 100, color=clr, linewidth=2, label=lbl)
ax.axhline(50, color='gray', linewidth=1, linestyle='--')
ax.axhline(90, color='#ef4444', linewidth=1, linestyle=':', label='Critical feminization')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('% Female hatchlings', color='white')
ax.set_title('Sex ratio under climate warming', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Clutch simulation — sex ratio variation
ax = axes[1, 0]
ax.set_facecolor('#111827')
n_clutches = 500
clutch_temps = np.random.normal(29, 1.5, n_clutches)
clutch_sizes = np.random.randint(8, 20, n_clutches)
clutch_female_pcts = []
for ct, cs in zip(clutch_temps, clutch_sizes):
    # Each egg position has slightly different temperature
    egg_temps = ct + np.random.normal(0, 0.5, cs)
    females = np.random.random(cs) < sex_ratio(egg_temps)
    clutch_female_pcts.append(females.mean() * 100)
ax.hist(clutch_female_pcts, bins=30, color='#a855f7', edgecolor='none', alpha=0.8)
ax.axvline(np.mean(clutch_female_pcts), color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Mean: {np.mean(clutch_female_pcts):.0f}%')
ax.set_xlabel('% Female in clutch', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Clutch-level sex ratio variation', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Altitude effect on nesting
ax = axes[1, 1]
ax.set_facecolor('#111827')
altitudes = np.linspace(0, 2000, 100)
lapse_rate = 6.5 / 1000  # C per meter
base_nest_T = 31  # sea level nest temp
alt_nest_T = base_nest_T - lapse_rate * altitudes
alt_sex_ratio = sex_ratio(alt_nest_T) * 100
ax.plot(altitudes, alt_sex_ratio, color='#22c55e', linewidth=2)
ax.fill_between(altitudes, alt_sex_ratio, alpha=0.2, color='#22c55e')
ax.axhline(50, color='gray', linewidth=1, linestyle='--')
ax.set_xlabel('Nesting altitude (m)', color='white')
ax.set_ylabel('% Female', color='white')
ax.set_title('Altitude as sex ratio control', color='white', fontsize=11)
ax.tick_params(colors='gray')
# Mark the altitude for 50% ratio
target_alt = (base_nest_T - 29) / lapse_rate
ax.axvline(target_alt, color='#f59e0b', linewidth=2, linestyle='--', label=f'50% at {target_alt:.0f}m')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Management strategies comparison
ax = axes[1, 2]
ax.set_facecolor('#111827')
strategies = ['No action', 'Shade\nstructures', 'Water\ncooling', 'Higher\naltitude', 'Incubation\ncontrol']
base_ratio = sex_ratio(31) * 100  # current hot beach
ratios_strat = [
    base_ratio,
    sex_ratio(31 - 1.5) * 100,  # shade reduces 1.5C
    sex_ratio(31 - 2.5) * 100,  # water reduces 2.5C
    sex_ratio(31 - 2.0) * 100,  # 300m altitude = ~2C
    50,  # perfect control
]
colors_strat = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7']
bars = ax.bar(strategies, ratios_strat, color=colors_strat, width=0.6)
ax.axhline(50, color='gray', linewidth=1, linestyle='--', label='Target 50%')
ax.set_ylabel('% Female', color='white')
ax.set_title('Conservation strategies', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Temperature-Dependent Sex Determination:")
print(f"  Pivotal temperature: 29.0°C")
print(f"  Current warm beach (31°C): {sex_ratio(31)*100:.0f}% female")
print(f"  With 2°C cooling: {sex_ratio(29)*100:.0f}% female")
print(f"  Altitude for 50% ratio: {target_alt:.0f}m")
print(f"  Climate warming at 0.03°C/yr: 90% female by ~{2025 + int((np.log(9)/1.5 + 29 - 28.5)/0.03)}") `,
      challenge: 'Model a population over 50 years with TSD and climate warming. Track the operational sex ratio (breeding adults) and determine when the population becomes functionally extinct (too few males for all females to breed).',
      successHint: 'TSD is one of the most dramatic examples of how climate change threatens biodiversity through indirect mechanisms. The threat is not that turtles cannot survive warmer temperatures — it is that their populations become reproductively non-functional.',
    },
    {
      title: 'Energy budgets for mountain climbing — optimal pacing strategy',
      concept: `A turtle climbing a mountain must manage its energy budget carefully. As an ectotherm with limited energy reserves, every meter of elevation gain has a calculable metabolic cost. The energy budget framework is:

E_available = E_stored (fat + glycogen) + E_intake (food along the way) - E_maintenance (basal metabolism)

E_climbing = m * g * h / efficiency

where m is mass, g is gravitational acceleration, h is height gained, and efficiency is the fraction of metabolic energy converted to mechanical work (about 10-25% for reptiles).

The optimal pacing strategy depends on:
- **Temperature windows**: reptiles can only be active within a thermal range (~15-35°C). Outside this, they must rest.
- **Altitude lapse rate**: temperature drops ~6.5°C per 1000m, shrinking the daily activity window at higher altitudes
- **Food availability**: decreases with altitude above the treeline
- **Gradient**: steeper slopes cost more energy per horizontal meter but may be shorter total distance

The optimization problem is: minimize total energy expenditure (or maximize probability of reaching the summit) given thermal constraints, energy reserves, and terrain.`,
      analogy: 'The turtle\'s mountain climb is like planning a road trip with a gas tank that only works between certain engine temperatures — and the temperature drops as you gain altitude. You must plan fuel stops (basking sites), manage your speed (pacing), and choose routes that keep the engine in its operating range.',
      storyConnection: 'The turtle in our story is not just stubbornly climbing — she is executing an energy management strategy. Every basking pause on a sun-warmed rock is a fuel stop. Every shaded rest under a boulder is thermal management. The slow pace is not a limitation but an optimization for the journey ahead.',
      checkQuestion: 'A 5 kg turtle needs to climb 500m. At 15% mechanical efficiency, how much metabolic energy is required just for the climb, ignoring maintenance costs?',
      checkAnswer: 'E = m*g*h / efficiency = 5 * 9.81 * 500 / 0.15 = 163,500 J = 163.5 kJ. That is about 39 kcal — roughly equivalent to the energy in a large insect meal. But the turtle also needs maintenance energy (basal metabolic rate) for every hour of the multi-day journey, which typically dominates total expenditure. The actual energy budget could be 5-10 times the climbing cost alone.',
      codeIntro: 'Simulate the turtle mountain climb with thermal constraints, energy budgets, and pacing optimization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class MountainClimber:
    """Turtle climbing a mountain with thermal and energy constraints."""

    def __init__(self, mass_kg=5.0, fat_reserve_kJ=800, base_altitude=100):
        self.mass = mass_kg
        self.energy = fat_reserve_kJ * 1000  # convert to J
        self.altitude = base_altitude
        self.body_temp = 25.0
        self.efficiency = 0.15
        self.bmr_W = 0.5 * mass_kg  # basal metabolic rate in Watts
        self.active_temp_range = (15, 35)  # can only move in this range
        self.optimal_temp = 28  # peak performance temperature

    def air_temp_at_altitude(self, alt, hour):
        """Air temperature considering altitude and time of day."""
        base = 30 - 6.5 * alt / 1000  # lapse rate
        daily_var = 8 * np.sin(np.pi * (hour - 6) / 12) if 6 <= hour <= 18 else -5
        return base + daily_var

    def update_body_temp(self, T_air, basking, dt_hours):
        """Update body temperature based on environment and behavior."""
        target = T_air + (15 if basking else 0)  # basking adds solar heating
        target = min(target, 40)
        tau = 1.5  # thermal time constant (hours)
        self.body_temp += (target - self.body_temp) * (1 - np.exp(-dt_hours / tau))

    def can_move(self):
        return self.active_temp_range[0] <= self.body_temp <= self.active_temp_range[1]

    def climb_cost_J(self, dh_meters):
        """Energy to climb dh meters."""
        return self.mass * 9.81 * dh_meters / self.efficiency

    def speed_factor(self):
        """Speed relative to optimal, based on body temperature."""
        if not self.can_move():
            return 0
        # Bell curve around optimal temperature
        return np.exp(-0.5 * ((self.body_temp - self.optimal_temp) / 5) ** 2)

def simulate_climb(target_altitude=1500, base_altitude=100, strategy='conservative'):
    """Simulate multi-day mountain climb."""
    turtle = MountainClimber(base_altitude=base_altitude)

    dt = 0.25  # 15-minute time steps
    max_hours = 240  # 10 days max

    log = {'time': [], 'altitude': [], 'energy': [], 'body_temp': [],
           'air_temp': [], 'moving': [], 'basking': []}

    base_climb_rate = 20  # meters per hour at optimal conditions

    for step in range(int(max_hours / dt)):
        t = step * dt
        hour = t % 24

        T_air = turtle.air_temp_at_altitude(turtle.altitude, hour)

        # Strategy determines behavior
        is_night = hour < 6 or hour > 19
        too_cold = turtle.body_temp < turtle.active_temp_range[0] + 3
        too_hot = turtle.body_temp > turtle.active_temp_range[1] - 3

        if strategy == 'conservative':
            basking = too_cold and not is_night
            moving = turtle.can_move() and not is_night and not too_cold and not too_hot
        elif strategy == 'aggressive':
            basking = too_cold and not is_night
            moving = turtle.can_move() and not is_night
        else:  # optimal
            basking = too_cold and not is_night and (6 < hour < 9 or 15 < hour < 18)
            moving = turtle.can_move() and not is_night and 8 < hour < 17

        turtle.update_body_temp(T_air, basking, dt)

        # Movement
        if moving and turtle.energy > 0:
            speed = base_climb_rate * turtle.speed_factor()
            dh = speed * dt
            cost = turtle.climb_cost_J(dh)
            if cost <= turtle.energy:
                turtle.altitude += dh
                turtle.energy -= cost
        # Maintenance cost always applies
        turtle.energy -= turtle.bmr_W * dt * 3600

        log['time'].append(t)
        log['altitude'].append(turtle.altitude)
        log['energy'].append(turtle.energy / 1000)  # kJ
        log['body_temp'].append(turtle.body_temp)
        log['air_temp'].append(T_air)
        log['moving'].append(1 if moving else 0)
        log['basking'].append(1 if basking else 0)

        if turtle.altitude >= target_altitude:
            break
        if turtle.energy <= 0:
            break

    return {k: np.array(v) for k, v in log.items()}

# Run three strategies
strategies = ['conservative', 'aggressive', 'optimal']
results = {s: simulate_climb(strategy=s) for s in strategies}

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
strat_colors = {'conservative': '#3b82f6', 'aggressive': '#ef4444', 'optimal': '#22c55e'}

# Plot 1: Altitude over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
for s in strategies:
    r = results[s]
    ax.plot(r['time'] / 24, r['altitude'], color=strat_colors[s], linewidth=2, label=s.capitalize())
ax.axhline(1500, color='#f59e0b', linewidth=1, linestyle='--', label='Target')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Altitude (m)', color='white')
ax.set_title('Climb progress by strategy', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Energy reserves
ax = axes[0, 1]
ax.set_facecolor('#111827')
for s in strategies:
    r = results[s]
    ax.plot(r['time'] / 24, r['energy'], color=strat_colors[s], linewidth=2, label=s.capitalize())
ax.axhline(0, color='#ef4444', linewidth=1, linestyle='--')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Energy (kJ)', color='white')
ax.set_title('Energy reserves', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Body temperature (first 3 days of optimal)
ax = axes[0, 2]
ax.set_facecolor('#111827')
r = results['optimal']
mask = r['time'] < 72
ax.plot(r['time'][mask], r['body_temp'][mask], color='#22c55e', linewidth=1.5, label='Body temp')
ax.plot(r['time'][mask], r['air_temp'][mask], color='#94a3b8', linewidth=1, label='Air temp', alpha=0.5)
ax.axhline(35, color='#ef4444', linewidth=1, linestyle=':', label='Upper limit')
ax.axhline(15, color='#3b82f6', linewidth=1, linestyle=':', label='Lower limit')
ax.fill_between(r['time'][mask], 15, 35, alpha=0.05, color='#22c55e')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Thermal management (first 3 days)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Activity budget
ax = axes[1, 0]
ax.set_facecolor('#111827')
for s in strategies:
    r = results[s]
    total_steps = len(r['time'])
    moving_pct = r['moving'].sum() / total_steps * 100
    basking_pct = r['basking'].sum() / total_steps * 100
    resting_pct = 100 - moving_pct - basking_pct
    ax.bar(s, moving_pct, color=strat_colors[s], label='Moving' if s == strategies[0] else '')
    ax.bar(s, basking_pct, bottom=moving_pct, color='#f59e0b')
    ax.bar(s, resting_pct, bottom=moving_pct + basking_pct, color='#94a3b8')
ax.set_ylabel('% of time', color='white')
ax.set_title('Activity budget', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: Speed vs altitude (optimal strategy)
ax = axes[1, 1]
ax.set_facecolor('#111827')
r = results['optimal']
# Compute instantaneous climb rate
dt_arr = np.diff(r['time']) * 3600  # seconds
dh_arr = np.diff(r['altitude'])
speed = dh_arr / (dt_arr / 3600)  # m/hr
speed[speed < 0.1] = np.nan
mid_alt = (r['altitude'][:-1] + r['altitude'][1:]) / 2
valid = ~np.isnan(speed) & (speed > 0.5)
ax.scatter(mid_alt[valid], speed[valid], s=3, alpha=0.3, color='#22c55e')
# Running average
bins = np.arange(100, 1500, 50)
for i in range(len(bins) - 1):
    mask_bin = valid & (mid_alt >= bins[i]) & (mid_alt < bins[i+1])
    if mask_bin.sum() > 0:
        ax.plot([(bins[i]+bins[i+1])/2], [np.nanmean(speed[mask_bin])],
                'o', color='#f59e0b', markersize=6)
ax.set_xlabel('Altitude (m)', color='white')
ax.set_ylabel('Climb rate (m/hr)', color='white')
ax.set_title('Speed decreases with altitude', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Summary table
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
data = []
for s in strategies:
    r = results[s]
    final_alt = r['altitude'][-1]
    days = r['time'][-1] / 24
    energy_used = r['energy'][0] - r['energy'][-1]
    reached = final_alt >= 1490
    data.append([s.capitalize(), f'{final_alt:.0f}m', f'{days:.1f}d', f'{energy_used:.0f}kJ', 'Yes' if reached else 'No'])
table = ax.table(cellText=data, colLabels=['Strategy', 'Final Alt', 'Time', 'Energy', 'Summit?'],
                 cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for cell in table.get_celld().values():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
ax.set_title('Strategy comparison', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("Mountain climb simulation results:")
for s in strategies:
    r = results[s]
    print(f"  {s}: {r['altitude'][-1]:.0f}m in {r['time'][-1]/24:.1f} days, {r['energy'][0]-r['energy'][-1]:.0f}kJ used")`,
      challenge: 'Add food foraging stops along the route. The turtle can pause to eat, gaining energy but losing time. Find the optimal number and duration of foraging stops to minimize total travel time.',
      successHint: 'Energy budget modeling is fundamental to animal ecology. It explains migration routes, habitat selection, body size evolution, and extinction risk. The same framework applies to electric vehicle range planning, spacecraft mission design, and marathon pacing strategies.',
    },
    {
      title: 'Population connectivity — movement corridors and genetic flow',
      concept: `Turtle populations are not isolated islands — they are connected by individuals moving between habitat patches. This connectivity determines genetic diversity, recolonization after local extinction, and long-term population viability.

Movement corridors are landscape features that facilitate travel between patches: river systems, forest corridors, ridgelines. The connectivity between two populations depends on:

- **Distance**: farther apart = less exchange
- **Resistance**: terrain difficulty, barriers (roads, rivers, cliffs)
- **Corridor width**: narrower corridors support fewer travelers
- **Predator density**: along the route

We can model connectivity as a **resistance network** (graph theory). Each habitat patch is a node. Edges have weights representing the cost of travel. The **effective resistance** between two nodes (from circuit theory) predicts gene flow better than simple geographic distance.

For turtles, which move slowly and have high site fidelity, connectivity is especially critical. A single highway cutting through a corridor can isolate populations that have been connected for millions of years, leading to genetic divergence and inbreeding depression within decades.`,
      analogy: 'Population connectivity is like internet bandwidth between cities. Two cities 100 km apart with a fiber optic cable (wide corridor) have better connectivity than two cities 50 km apart connected by a single phone line (narrow corridor through hostile terrain). The bandwidth — not just the distance — determines how much genetic information flows.',
      storyConnection: 'The turtle climbing the mountain is also a genetic courier. By moving between lowland and highland populations, she carries alleles that maintain genetic diversity in both populations. Her mountain journey is a single data point in a landscape genetics study spanning centuries.',
      checkQuestion: 'Two turtle populations are separated by a 2 km highway with heavy traffic. A wildlife overpass (50m wide) is built. Would you expect immediate genetic mixing or a slow process?',
      checkAnswer: 'Slow process. Turtles have low movement rates and high site fidelity. Even with the overpass, only a few individuals per generation will cross. Genetic mixing requires those crossers to successfully reproduce in the new population. Effective gene flow might take 10-50 generations (potentially centuries for long-lived turtles) to significantly reduce genetic differentiation. The overpass removes the barrier but does not accelerate the inherently slow process of turtle dispersal.',
      codeIntro: 'Model landscape connectivity using resistance networks and simulate gene flow between turtle populations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Landscape connectivity model
class LandscapeNetwork:
    """Model habitat patches connected by movement corridors."""

    def __init__(self, n_patches):
        self.n = n_patches
        # Random patch positions
        self.positions = np.random.uniform(0, 100, (n_patches, 2))
        # Patch quality (0-1)
        self.quality = np.random.beta(3, 2, n_patches)
        # Population size proportional to quality
        self.pop_size = (self.quality * 100 + 20).astype(int)
        # Genetic diversity (initially random)
        self.allele_freqs = np.random.uniform(0.2, 0.8, (n_patches, 5))

    def resistance(self, i, j, barriers=None):
        """Travel resistance between patches i and j."""
        dist = np.linalg.norm(self.positions[i] - self.positions[j])
        base_resistance = dist

        # Add barrier effects
        if barriers is not None:
            for bx, by, strength in barriers:
                # Check if path crosses barrier
                p1, p2 = self.positions[i], self.positions[j]
                # Simple: distance from barrier to midpoint
                midpoint = (p1 + p2) / 2
                d_barrier = np.sqrt((midpoint[0]-bx)**2 + (midpoint[1]-by)**2)
                if d_barrier < 15:  # barrier effect zone
                    base_resistance *= (1 + strength * (1 - d_barrier/15))

        return base_resistance

    def connectivity_matrix(self, barriers=None, max_dist=40):
        """Compute pairwise connectivity (inverse resistance)."""
        C = np.zeros((self.n, self.n))
        for i in range(self.n):
            for j in range(i+1, self.n):
                dist = np.linalg.norm(self.positions[i] - self.positions[j])
                if dist < max_dist:
                    r = self.resistance(i, j, barriers)
                    C[i, j] = C[j, i] = 1 / r
        return C

    def simulate_gene_flow(self, n_generations, barriers=None):
        """Simulate allele frequency changes due to migration."""
        C = self.connectivity_matrix(barriers)
        migration_rate = C / C.max() * 0.05  # normalize, max 5% migration

        history = [self.allele_freqs.copy()]

        for gen in range(n_generations):
            new_freqs = self.allele_freqs.copy()
            for i in range(self.n):
                incoming = np.zeros(5)
                total_migration = 0
                for j in range(self.n):
                    if i != j and migration_rate[i, j] > 0:
                        m = migration_rate[i, j]
                        incoming += m * self.allele_freqs[j]
                        total_migration += m

                if total_migration > 0:
                    # Mix local and immigrant alleles
                    new_freqs[i] = (1 - total_migration) * self.allele_freqs[i] + incoming

                # Genetic drift (small populations drift more)
                drift = np.random.normal(0, 0.01 / np.sqrt(self.pop_size[i]), 5)
                new_freqs[i] = np.clip(new_freqs[i] + drift, 0.01, 0.99)

            self.allele_freqs = new_freqs
            history.append(new_freqs.copy())

        return history

# Create landscape
land = LandscapeNetwork(12)

# Define barriers (highway at x=50)
barriers = [(50, y, 3.0) for y in range(0, 101, 20)]

# Simulate without barriers
land1 = LandscapeNetwork(12)
land1.positions = land.positions.copy()
land1.allele_freqs = land.allele_freqs.copy()
hist_no_barrier = land1.simulate_gene_flow(100)

# Simulate with barriers
land2 = LandscapeNetwork(12)
land2.positions = land.positions.copy()
land2.allele_freqs = np.copy(land.allele_freqs)
hist_with_barrier = land2.simulate_gene_flow(100, barriers)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Landscape map
ax = axes[0, 0]
ax.set_facecolor('#111827')
C = land.connectivity_matrix()
for i in range(land.n):
    for j in range(i+1, land.n):
        if C[i, j] > 0:
            ax.plot([land.positions[i, 0], land.positions[j, 0]],
                   [land.positions[i, 1], land.positions[j, 1]],
                   color='#22c55e', linewidth=C[i, j]*50, alpha=0.3)
sc = ax.scatter(land.positions[:, 0], land.positions[:, 1],
               s=land.pop_size * 3, c=land.quality, cmap='viridis',
               edgecolors='white', linewidth=1, zorder=5)
for i in range(land.n):
    ax.annotate(str(i), land.positions[i], ha='center', va='center',
               fontsize=7, color='white', fontweight='bold')
ax.set_xlabel('X (km)', color='white')
ax.set_ylabel('Y (km)', color='white')
ax.set_title('Habitat network (size=pop, color=quality)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 2: Landscape with barrier
ax = axes[0, 1]
ax.set_facecolor('#111827')
C2 = land.connectivity_matrix(barriers)
for i in range(land.n):
    for j in range(i+1, land.n):
        if C2[i, j] > 0:
            ax.plot([land.positions[i, 0], land.positions[j, 0]],
                   [land.positions[i, 1], land.positions[j, 1]],
                   color='#22c55e', linewidth=C2[i, j]*50, alpha=0.3)
ax.scatter(land.positions[:, 0], land.positions[:, 1],
          s=land.pop_size * 3, c=land.quality, cmap='viridis',
          edgecolors='white', linewidth=1, zorder=5)
ax.axvline(50, color='#ef4444', linewidth=3, linestyle='-', label='Highway barrier')
ax.set_xlabel('X (km)', color='white')
ax.set_ylabel('Y (km)', color='white')
ax.set_title('With highway barrier', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Genetic diversity over time
ax = axes[0, 2]
ax.set_facecolor('#111827')
# Average genetic differentiation (Fst proxy)
def fst_over_time(history):
    fst = []
    for gen_freqs in history:
        p_bar = gen_freqs.mean(axis=0)
        var_p = gen_freqs.var(axis=0)
        pq = p_bar * (1 - p_bar)
        fst_val = np.mean(var_p / np.maximum(pq, 0.001))
        fst.append(fst_val)
    return fst

fst_no = fst_over_time(hist_no_barrier)
fst_yes = fst_over_time(hist_with_barrier)
ax.plot(fst_no, color='#22c55e', linewidth=2, label='No barrier')
ax.plot(fst_yes, color='#ef4444', linewidth=2, label='With barrier')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Fst (differentiation)', color='white')
ax.set_title('Genetic divergence', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Allele frequency trajectories (gene 0) by patch
ax = axes[1, 0]
ax.set_facecolor('#111827')
for i in range(min(6, land.n)):
    vals = [h[i, 0] for h in hist_no_barrier]
    ax.plot(vals, linewidth=1.5, alpha=0.7, label=f'Patch {i}')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Allele frequency', color='white')
ax.set_title('Gene flow homogenizes (no barrier)', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Same but with barrier
ax = axes[1, 1]
ax.set_facecolor('#111827')
left = [i for i in range(land.n) if land.positions[i, 0] < 50]
right = [i for i in range(land.n) if land.positions[i, 0] >= 50]
for i in left[:3]:
    vals = [h[i, 0] for h in hist_with_barrier]
    ax.plot(vals, color='#3b82f6', linewidth=1.5, alpha=0.7, label=f'West {i}')
for i in right[:3]:
    vals = [h[i, 0] for h in hist_with_barrier]
    ax.plot(vals, color='#ef4444', linewidth=1.5, alpha=0.7, label=f'East {i}')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Allele frequency', color='white')
ax.set_title('Barrier splits gene pools', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Connectivity matrix heatmap
ax = axes[1, 2]
ax.set_facecolor('#111827')
im = ax.imshow(C2, cmap='YlGnBu', origin='lower')
ax.set_xlabel('Patch', color='white')
ax.set_ylabel('Patch', color='white')
ax.set_title('Connectivity matrix (with barrier)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='Connectivity')

plt.tight_layout()
plt.show()

print("Landscape connectivity analysis:")
print(f"  {land.n} habitat patches")
print(f"  Without barrier: Fst = {fst_no[-1]:.4f} (low = well-mixed)")
print(f"  With barrier: Fst = {fst_yes[-1]:.4f} (high = diverging)")
print(f"  Barrier increased differentiation by {fst_yes[-1]/max(fst_no[-1], 0.001):.1f}x")
print(f"  West patches: {len(left)}, East patches: {len(right)}")`,
      challenge: 'Add a wildlife corridor (overpass) at one point across the highway. How wide must it be and how many individuals must use it per generation to prevent significant genetic divergence? Find the minimum effective corridor.',
      successHint: 'Landscape genetics — combining genetic data with spatial analysis — is one of the most active fields in conservation biology. The same graph theory and network analysis used here powers internet routing, social network analysis, and epidemiology.',
    },
    {
      title: 'Survivorship analysis — building a life table from mark-recapture data',
      concept: `To understand any population, you need to know how mortality is distributed across age classes. A **life table** tracks a cohort from birth to death, recording:

- **lx**: proportion surviving to age x (survivorship)
- **dx**: proportion dying between age x and x+1 (mortality)
- **qx**: probability of dying in interval [x, x+1] given alive at x (mortality rate = dx/lx)
- **ex**: life expectancy at age x (mean remaining lifespan)

Turtles have a characteristic **Type III survivorship curve**: extremely high mortality in early life (eggs and hatchlings) followed by very low mortality in adults. This is the opposite of humans (Type I: low early mortality, high late mortality).

The conservation implication is profound: for species with Type III survivorship, protecting adults has far more demographic impact than protecting eggs. One adult female turtle might lay 1000 eggs over her 50-year life. If adult survival drops even slightly, the population collapses — no number of egg protection programs can compensate.

Mark-recapture methods estimate survival by capturing, marking, releasing, and recapturing individuals. The Cormack-Jolly-Seber (CJS) model accounts for imperfect detection: not every living animal is recaptured, so you must estimate both survival probability (phi) and recapture probability (p) simultaneously.`,
      analogy: 'A turtle life table is like a funnel. A thousand eggs enter the top. Most are eaten, flooded, or fail to develop — by the time hatchlings emerge, you are down to 100. Of those, predators take 80 in the first year. But the 20 survivors have low mortality for the next 50 years. The funnel is very wide at the top and very narrow at the bottom.',
      storyConnection: 'The turtle in our story has beaten incredible odds just by being alive. She survived as an egg, as a hatchling, through her juvenile years. Her mountain climb is possible only because she has reached the adult stage where survival probability is high. Her story is a statistical improbability — one of perhaps a thousand siblings who did not make it.',
      checkQuestion: 'A population has 90% adult survival per year but only 1% egg-to-adult survival. If you could improve either to save the population, which would you choose: increase adult survival to 95%, or increase egg survival to 5%?',
      checkAnswer: 'Increase adult survival. Population growth rate in long-lived species is far more sensitive to adult survival than to reproductive output. This is because each adult reproduces for many years — a 5% improvement in adult survival means 5% more breeding-years per individual, compounding over a 50-year lifespan. Increasing egg survival quintouples recruitment but those recruits face the gauntlet of juvenile mortality. This asymmetry is called "elasticity analysis" and is the basis of modern turtle conservation prioritizing bycatch reduction over nest protection.',
      codeIntro: 'Build a life table from simulated mark-recapture data, construct survivorship curves, and perform population viability analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Turtle life table construction
def generate_life_table(egg_survival=0.6, hatchling_survival=0.1,
                        juvenile_survival=0.5, adult_survival=0.92,
                        max_age=60, cohort_size=1000):
    """Generate a complete life table for a turtle population."""
    # Age-specific survival rates
    survival = np.ones(max_age)
    survival[0] = egg_survival  # egg to hatchling
    survival[1] = hatchling_survival  # first year
    for age in range(2, 6):
        survival[age] = juvenile_survival + (adult_survival - juvenile_survival) * (age - 2) / 4
    for age in range(6, max_age):
        survival[age] = adult_survival * (1 - 0.005 * max(0, age - 40))  # senescence after 40

    # Build life table
    lx = np.ones(max_age + 1)
    for age in range(max_age):
        lx[age + 1] = lx[age] * survival[age]

    dx = np.diff(-lx)  # deaths per age
    qx = dx / lx[:-1]  # mortality rate

    # Life expectancy at each age
    ex = np.zeros(max_age)
    for age in range(max_age):
        ex[age] = np.sum(lx[age+1:]) / lx[age]

    # Fecundity (eggs per female per year, starting at maturity ~12 years)
    mx = np.zeros(max_age)
    for age in range(12, max_age):
        mx[age] = 15 * min(1, (age - 12) / 5)  # ramp up to 15 eggs/year

    return {
        'age': np.arange(max_age),
        'lx': lx[:-1],
        'dx': dx,
        'qx': qx,
        'ex': ex,
        'mx': mx,
        'survival': survival,
    }

# Generate mark-recapture data
def simulate_mark_recapture(n_years=10, n_marked=50, phi=0.92, p_recapture=0.3):
    """Simulate CJS mark-recapture encounters."""
    encounters = np.zeros((n_marked, n_years), dtype=int)
    encounters[:, 0] = 1  # all marked in year 0

    alive = np.ones(n_marked, dtype=bool)
    for yr in range(1, n_years):
        # Survival
        alive = alive & (np.random.random(n_marked) < phi)
        # Recapture (only among alive)
        recaptured = alive & (np.random.random(n_marked) < p_recapture)
        encounters[:, yr] = recaptured.astype(int)

    return encounters

lt = generate_life_table()
encounters = simulate_mark_recapture()

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Survivorship curves (Type I, II, III)
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Turtle (Type III)
ax.semilogy(lt['age'], lt['lx'] * 1000, color='#22c55e', linewidth=2, label='Turtle (Type III)')
# Human-like (Type I)
type1_lx = np.exp(-0.001 * lt['age']**2)
ax.semilogy(lt['age'], type1_lx * 1000, color='#3b82f6', linewidth=2, label='Mammal (Type I)')
# Bird-like (Type II)
type2_lx = np.exp(-0.05 * lt['age'])
ax.semilogy(lt['age'], type2_lx * 1000, color='#f59e0b', linewidth=2, label='Bird (Type II)')
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Survivors (log scale)', color='white')
ax.set_title('Survivorship curves', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Age-specific mortality
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.bar(lt['age'][:20], lt['qx'][:20], color='#ef4444', edgecolor='none', alpha=0.8)
ax.set_xlabel('Age', color='white')
ax.set_ylabel('Mortality rate (qx)', color='white')
ax.set_title('Mortality peaks in year 1', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Life expectancy
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(lt['age'], lt['ex'], color='#a855f7', linewidth=2)
ax.set_xlabel('Age', color='white')
ax.set_ylabel('Expected remaining years', color='white')
ax.set_title('Life expectancy (increases after year 1!)', color='white', fontsize=11)
ax.tick_params(colors='gray')
# Highlight the paradox: life expectancy increases after surviving early years
ax.annotate(f"At birth: {lt['ex'][0]:.1f} yrs", (0, lt['ex'][0]),
           fontsize=9, color='#ef4444', fontweight='bold')
ax.annotate(f"If survive to 5: {lt['ex'][5]:.1f} yrs", (5, lt['ex'][5]),
           fontsize=9, color='#22c55e', fontweight='bold')

# Plot 4: Mark-recapture encounter history
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.imshow(encounters[:30], aspect='auto', cmap='YlGn', origin='lower')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Individual', color='white')
ax.set_title('Mark-recapture encounters (30 of 50)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: Estimate survival from recapture data
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Simple survival estimate: proportion seen again after last sighting
n_years_data = encounters.shape[1]
yearly_survival_est = []
for yr in range(n_years_data - 1):
    seen_this_year = encounters[:, yr] == 1
    if seen_this_year.sum() > 0:
        seen_later = encounters[seen_this_year, yr+1:].max(axis=1) > 0
        yearly_survival_est.append(seen_later.mean())
    else:
        yearly_survival_est.append(np.nan)

ax.plot(range(len(yearly_survival_est)), yearly_survival_est, 'o-',
        color='#f59e0b', linewidth=2, markersize=8, label='Estimated phi')
ax.axhline(0.92, color='#22c55e', linewidth=2, linestyle='--', label='True phi = 0.92')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Estimated survival', color='white')
ax.set_title('Survival estimation from recapture', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 1.1)

# Plot 6: Elasticity analysis — which parameter matters most?
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Population growth rate (lambda) sensitivity
def calc_lambda(egg_s, hatch_s, juv_s, adult_s):
    lt_test = generate_life_table(egg_s, hatch_s, juv_s, adult_s)
    Ro = np.sum(lt_test['lx'] * lt_test['mx'])
    T = np.sum(lt_test['age'] * lt_test['lx'] * lt_test['mx']) / max(Ro, 0.001)
    return Ro ** (1 / max(T, 1))

base_lambda = calc_lambda(0.6, 0.1, 0.5, 0.92)
perturbation = 0.05

params = ['Egg survival', 'Hatchling surv', 'Juvenile surv', 'Adult survival']
elasticities = []
for i, (e, h, j, a) in enumerate([(0.6+perturbation, 0.1, 0.5, 0.92),
                                     (0.6, 0.1+perturbation, 0.5, 0.92),
                                     (0.6, 0.1, 0.5+perturbation, 0.92),
                                     (0.6, 0.1, 0.5, 0.92+perturbation)]):
    new_lambda = calc_lambda(e, h, j, a)
    elasticity = (new_lambda - base_lambda) / base_lambda / perturbation
    elasticities.append(elasticity)

bars = ax.barh(params, elasticities, color=['#94a3b8', '#3b82f6', '#f59e0b', '#22c55e'], height=0.5)
ax.set_xlabel('Elasticity (proportional sensitivity)', color='white')
ax.set_title('What matters most for pop growth?', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Life table analysis:")
print(f"  Cohort of 1000 eggs:")
print(f"    Survive to age 1: {lt['lx'][1]*1000:.0f}")
print(f"    Survive to age 5: {lt['lx'][5]*1000:.0f}")
print(f"    Survive to age 20: {lt['lx'][20]*1000:.1f}")
print(f"  Life expectancy at birth: {lt['ex'][0]:.1f} years")
print(f"  Life expectancy if survive to age 5: {lt['ex'][5]:.1f} years")
print(f"  Population growth rate (lambda): {base_lambda:.4f}")
print(f"\\nConservation priority: ADULT SURVIVAL is {elasticities[3]/elasticities[0]:.1f}x more")
print(f"important than egg survival for population growth.")`,
      challenge: 'Simulate a population viability analysis (PVA): run the life table model stochastically for 100 years and estimate the probability of extinction under different adult survival scenarios (0.85, 0.90, 0.92, 0.95). What is the minimum viable population size?',
      successHint: 'Life table analysis and population viability analysis are the workhorses of conservation biology. Every endangered species recovery plan starts with these numbers. The insight that adult survival matters most has redirected millions of conservation dollars from nest protection to bycatch reduction for sea turtles worldwide.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Computational Scientist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology and physics fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for ecology and biomechanics simulations. Click to start.</p>
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
