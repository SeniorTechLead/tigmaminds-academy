import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudRefusedLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Why clouds don\'t always rain — the droplet growth barrier',
      concept: `A cloud is not water waiting to fall. It is billions of tiny droplets suspended in air, each one far too small to rain. A typical cloud droplet is about 10 micrometers across — one hundred times smaller than a raindrop. At that size, updrafts easily hold droplets aloft. For rain to fall, droplets must grow from 10 micrometers to about 1000 micrometers (1 mm). That is a factor of 100 in radius, or a factor of one million in volume.

The first stage of growth is **condensation**: water vapor deposits onto the droplet surface. This follows **Kohler theory**, which balances two competing effects:

- **Curvature effect (Kelvin)**: Small droplets have high surface curvature, which raises the equilibrium vapor pressure above the droplet surface. This means small droplets evaporate more easily than large ones.
- **Solute effect (Raoult)**: Dissolved salts in the droplet lower the equilibrium vapor pressure, making it easier for the droplet to grow.

The Kohler curve shows the supersaturation required for a droplet to grow. There is a **critical radius** — if a droplet reaches this size, it can grow freely. Below it, the droplet is trapped.

But condensation alone is too slow. It can take a droplet from 1 to 10 micrometers in minutes, but growing from 10 to 100 micrometers by condensation alone would take hours. Real clouds produce rain in 20-30 minutes. Something else must be happening: **collision-coalescence**. Larger droplets fall faster, sweep up smaller ones, and grow rapidly. This is the "size gap" problem — condensation is too slow past 10 micrometers, and collision-coalescence only kicks in around 40 micrometers. Bridging that gap is one of the great unsolved puzzles in cloud physics.`,
      analogy: 'Imagine a crowded dance floor where everyone is walking slowly (condensation growth). People bump into each other occasionally but nobody is moving fast enough to really collide. Now imagine one person starts jogging (a slightly larger droplet). They bump into walkers, absorb their momentum, speed up, bump into more people, and soon they are running across the floor sweeping everyone up. That transition from walking to running is the droplet growth barrier — and cloud seeding tries to give some dancers a head start.',
      storyConnection: 'In the story, the cloud that refused to rain hung over Assam, heavy and gray but stubbornly dry. The tea gardens of upper Assam depend on monsoon timing measured in days — a week\'s delay can stress the second flush crop that produces the region\'s most prized leaves. The cloud\'s refusal is not stubbornness; it is physics. Its droplets are trapped below the critical growth threshold.',
      checkQuestion: 'A cloud has high liquid water content but the droplet size distribution is very narrow — most droplets are around 8 micrometers. Why might this cloud not produce rain even though it contains plenty of water?',
      checkAnswer: 'Collision-coalescence requires some droplets to be significantly larger than others so they fall faster and sweep up smaller ones. A narrow size distribution means all droplets fall at similar speeds, so collisions are rare and gentle. The cloud has the water but not the size diversity to trigger the cascade. This is exactly the situation cloud seeding aims to fix — introducing nuclei that create a few large ice crystals or droplets to break the symmetry.',
      codeIntro: 'Model the Kohler curve and visualize the critical supersaturation barrier for different aerosol sizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Kohler theory parameters
# S(r) = (a/r) - (b/r^3)  (simplified form)
# a = 2*sigma_w / (rho_w * Rv * T)  [curvature / Kelvin term]
# b = 3*i*Ms*mw / (4*pi*rho_w*Ms)   [solute / Raoult term]

sigma_w = 0.072   # surface tension of water (N/m)
rho_w = 1000.0    # water density (kg/m^3)
Rv = 461.5        # gas constant for water vapor (J/kg/K)
T = 273.15        # temperature (K)

a = 2 * sigma_w / (rho_w * Rv * T)

# Solute parameter b for different dry aerosol radii (NaCl)
# b = (i * Ms * Mw) / (4/3 * pi * rho_s * Ms) simplified:
# For NaCl: i=2, Mw=0.018 kg/mol, Ms=0.0585 kg/mol, rho_s=2160 kg/m3
i_NaCl = 2
Mw = 0.018
Ms_NaCl = 0.0585
rho_s = 2160.0

r_dry_values = [0.01e-6, 0.05e-6, 0.1e-6, 0.5e-6]  # dry aerosol radii (m)
labels = ['10 nm', '50 nm', '100 nm', '500 nm']
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

for ax in [ax1, ax2]:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

# Plot Kohler curves
r = np.linspace(0.01e-6, 10e-6, 5000)  # wet droplet radius

for r_dry, label, color in zip(r_dry_values, labels, colors):
    # Solute term: b = i * (4/3 * pi * r_dry^3 * rho_s / Ms) * Mw
    n_s = (4/3 * np.pi * r_dry**3 * rho_s) / Ms_NaCl  # moles of solute
    b = i_NaCl * n_s * Mw / ((4/3) * np.pi * rho_w)

    # Kohler equation: S = exp(a/r - b/r^3) - 1  (approx: S ~ a/r - b/r^3)
    S_percent = (a / r - b / r**3) * 100  # supersaturation in %

    ax1.plot(r * 1e6, S_percent, color=color, linewidth=2, label=f'r_dry = {label}')

    # Mark critical point
    # dS/dr = 0 => -a/r^2 + 3b/r^4 = 0 => r_crit = sqrt(3b/a)
    r_crit = np.sqrt(3 * b / a)
    S_crit = (a / r_crit - b / r_crit**3) * 100
    ax1.plot(r_crit * 1e6, S_crit, 'o', color=color, markersize=8, zorder=5)

ax1.axhline(y=0, color='white', linewidth=0.5, linestyle='--', alpha=0.5)
ax1.set_xlim(0, 5)
ax1.set_ylim(-0.5, 2.0)
ax1.set_xlabel('Droplet radius (micrometers)', color='white', fontsize=11)
ax1.set_ylabel('Supersaturation (%)', color='white', fontsize=11)
ax1.set_title('Kohler curves: the growth barrier', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Right panel: droplet growth by condensation over time
# dr/dt = (S - S_eq) / (Fd + Fk) * 1/r  (simplified condensation growth)
# Approximately: r * dr = G * S_excess * dt => r^2 = r0^2 + 2*G*S*t

G = 1e-10  # growth parameter (m^2/s), typical for 0.5% supersaturation
S_excess = 0.005  # 0.5% supersaturation
times = np.linspace(0, 3600, 1000)  # 1 hour in seconds

r0_values = [1e-6, 5e-6, 10e-6, 20e-6]
r0_labels = ['1 um', '5 um', '10 um', '20 um']
r0_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

for r0, label, color in zip(r0_values, r0_labels, r0_colors):
    r_t = np.sqrt(r0**2 + 2 * G * S_excess * times)
    ax2.plot(times / 60, r_t * 1e6, color=color, linewidth=2, label=f'r0 = {label}')

# Mark the collision-coalescence threshold
ax2.axhline(y=40, color='#a855f7', linewidth=2, linestyle='--', alpha=0.8)
ax2.text(50, 42, 'Collision-coalescence threshold (~40 um)', color='#a855f7', fontsize=9)

# Mark raindrop size
ax2.axhline(y=100, color='#ec4899', linewidth=1, linestyle=':', alpha=0.6)
ax2.text(50, 103, 'Small raindrop (~100 um)', color='#ec4899', fontsize=8)

ax2.set_xlabel('Time (minutes)', color='white', fontsize=11)
ax2.set_ylabel('Droplet radius (micrometers)', color='white', fontsize=11)
ax2.set_title('Condensation growth: too slow alone', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

plt.tight_layout()
plt.show()

# Summary statistics
print("Kohler Theory Summary")
print("=" * 55)
for r_dry, label in zip(r_dry_values, labels):
    n_s = (4/3 * np.pi * r_dry**3 * rho_s) / Ms_NaCl
    b = i_NaCl * n_s * Mw / ((4/3) * np.pi * rho_w)
    r_crit = np.sqrt(3 * b / a)
    S_crit = (a / r_crit - b / r_crit**3) * 100
    print(f"  Dry aerosol {label:>6s}: critical radius = {r_crit*1e6:.2f} um, critical S = {S_crit:.3f}%")

print()
print("Key insight: larger aerosols need LESS supersaturation to activate.")
print("A 500 nm salt particle activates at ~0.04% supersaturation,")
print("while a 10 nm particle needs nearly 2%. This is why aerosol")
print("size distribution controls how many cloud droplets form.")`,
      challenge: 'Modify the code to add ammonium sulfate ((NH4)2SO4) alongside NaCl. Use Ms = 0.132 kg/mol, rho_s = 1770 kg/m3, i = 3 (van\'t Hoff factor). Compare the Kohler curves. Which salt is a more effective cloud condensation nucleus at the same dry size?',
      successHint: 'The Kohler curve is the gatekeeper of cloud physics. Every droplet in every cloud on Earth must pass through this energy barrier. Understanding it explains why some clouds rain and others do not — and why adding the right nuclei can tip the balance.',
    },
    {
      title: 'Cloud seeding science — forcing the Bergeron process',
      concept: `Cloud seeding is not magic. It is applied nucleation physics. The idea dates to 1946 when Vincent Schaefer dropped dry ice into a supercooled cloud chamber and watched ice crystals explode into existence. The key insight: most cloud droplets are **supercooled liquid** — water that remains liquid well below 0 degrees C because it has no surface to freeze onto.

There are two main approaches:

**Glaciogenic seeding** uses silver iodide (AgI) as an artificial ice nucleus. AgI has a crystal structure nearly identical to ice (hexagonal, with lattice spacing within 2% of ice). When AgI particles enter a supercooled cloud, they trigger the **Bergeron process**:

1. AgI particles act as ice nuclei, converting supercooled droplets to ice crystals
2. The saturation vapor pressure over ice is lower than over liquid water at the same temperature
3. Air that is saturated with respect to liquid water is **supersaturated** with respect to ice
4. Ice crystals grow rapidly at the expense of surrounding liquid droplets, which evaporate
5. Ice crystals grow large enough to fall, melting into raindrops below the freezing level

**Hygroscopic seeding** takes a different approach. Instead of creating ice, it introduces large salt particles (NaCl, CaCl2) at cloud base. These giant CCN create a few oversized droplets that initiate collision-coalescence earlier, jumpstarting warm rain.

The critical question is not whether seeding changes cloud microphysics — it does. The question is whether that microphysical change translates into meaningful precipitation increases at the ground.`,
      analogy: 'Think of a supercooled cloud as a room full of people standing perfectly still, balanced on one foot. They could all fall over (freeze) but nobody wants to go first. Silver iodide is like someone who walks in and deliberately falls — suddenly everyone nearby topples too, creating a chain reaction. The Bergeron process is the cascade: once ice crystals form, they steal moisture from the liquid droplets around them, growing rapidly while the droplets shrink and disappear.',
      storyConnection: 'The cloud that refused to rain over Assam was likely filled with supercooled droplets — plenty of water, no trigger. In the tea estates around Dibrugarh, plantation workers have watched such clouds pass overhead for generations, knowing rain was close but out of reach. India\'s cloud seeding research program, active since the 1950s, has focused on exactly these monsoon clouds — trying to make the stubborn ones release their water over drought-stressed regions.',
      checkQuestion: 'Why does silver iodide work as an ice nucleus while most other substances do not? And why does seeding only work in supercooled clouds, not warm clouds above 0 degrees C?',
      checkAnswer: 'AgI works because its crystal lattice is an almost perfect template for ice — the hexagonal arrangement and atomic spacing match within 2%, so water molecules can arrange themselves into ice structure on the AgI surface with minimal energy penalty (low contact angle). Most other substances have crystal structures nothing like ice, so water cannot use them as templates. Seeding only works in supercooled clouds because the Bergeron process requires the coexistence of ice crystals and liquid droplets — the vapor pressure difference drives ice growth. In warm clouds (above 0C), there is no phase difference to exploit, so AgI does nothing. For warm clouds, hygroscopic seeding is the only option.',
      codeIntro: 'Simulate the Bergeron process: model ice crystal growth at the expense of surrounding liquid droplets in a mixed-phase cloud.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bergeron process simulation
# Ice crystals grow because: e_sat_liquid > e_sat_ice at T < 0C
# The difference drives vapor from liquid droplets to ice crystals

def sat_vapor_pressure_liquid(T_C):
    """Tetens formula for saturation vapor pressure over liquid water (Pa)"""
    return 610.78 * np.exp(17.27 * T_C / (T_C + 237.3))

def sat_vapor_pressure_ice(T_C):
    """Saturation vapor pressure over ice (Pa)"""
    return 610.78 * np.exp(21.875 * T_C / (T_C + 265.5))

# Show the vapor pressure difference
T_range = np.linspace(-40, 0, 200)
e_liquid = sat_vapor_pressure_liquid(T_range)
e_ice = sat_vapor_pressure_ice(T_range)
diff = e_liquid - e_ice

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

# Panel 1: Vapor pressure over ice vs liquid
ax = axes[0, 0]
ax.plot(T_range, e_liquid, color='#3b82f6', linewidth=2, label='Over liquid water')
ax.plot(T_range, e_ice, color='#22c55e', linewidth=2, label='Over ice')
ax.fill_between(T_range, e_ice, e_liquid, alpha=0.2, color='#f59e0b')
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Saturation vapor pressure (Pa)', color='white')
ax.set_title('The Bergeron gap', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 2: Supersaturation w.r.t. ice in a liquid-saturated environment
ax = axes[0, 1]
S_ice = ((e_liquid - e_ice) / e_ice) * 100
ax.plot(T_range, S_ice, color='#f59e0b', linewidth=2)
ax.axhline(y=0, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Supersaturation w.r.t. ice (%)', color='white')
ax.set_title('Ice sees supersaturation in a liquid cloud', color='white', fontsize=12, fontweight='bold')
# Mark the maximum
max_idx = np.argmax(S_ice)
ax.plot(T_range[max_idx], S_ice[max_idx], 'o', color='#ef4444', markersize=10, zorder=5)
ax.annotate(f'Max at {T_range[max_idx]:.0f}C: {S_ice[max_idx]:.1f}%',
            xy=(T_range[max_idx], S_ice[max_idx]),
            xytext=(T_range[max_idx] + 8, S_ice[max_idx] - 3),
            color='#ef4444', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Panel 3: Simulate Bergeron process over time
ax = axes[1, 0]
T_cloud = -15  # cloud temperature (C)
dt = 1.0  # time step (seconds)
n_steps = 1200  # 20 minutes

# Initial conditions
n_liquid = 100    # number of liquid droplets per ice crystal
r_ice = 10e-6     # initial ice crystal radius (m)
r_liquid = 10e-6  # initial liquid droplet radius (m)
rho_i = 917.0     # ice density (kg/m3)

# Growth rates depend on vapor pressure difference
e_l = sat_vapor_pressure_liquid(T_cloud)
e_i = sat_vapor_pressure_ice(T_cloud)
S_diff = (e_l - e_i) / e_i  # supersaturation driving ice growth

# Simplified growth: ice grows, liquid shrinks to conserve total water
G_ice = 5e-10  # ice crystal growth parameter (m^2/s)

r_ice_history = np.zeros(n_steps)
r_liquid_history = np.zeros(n_steps)

r_ice_t = r_ice
r_liquid_t = r_liquid

for step in range(n_steps):
    r_ice_history[step] = r_ice_t
    r_liquid_history[step] = r_liquid_t

    # Ice grows proportional to supersaturation
    if r_ice_t > 0:
        dr_ice = G_ice * S_diff / r_ice_t * dt
        r_ice_t += dr_ice

    # Liquid shrinks (mass conservation: water lost by liquid = water gained by ice)
    # Volume of 1 ice crystal growth = n_liquid * volume loss per droplet
    vol_gained = 4/3 * np.pi * ((r_ice_t)**3 - r_ice_history[step]**3)
    vol_lost_per_droplet = vol_gained / n_liquid if n_liquid > 0 else 0

    if r_liquid_t > 0:
        new_vol = max(0, 4/3 * np.pi * r_liquid_t**3 - vol_lost_per_droplet)
        r_liquid_t = (3 * new_vol / (4 * np.pi))**(1/3) if new_vol > 0 else 0

times = np.arange(n_steps) * dt / 60  # minutes

ax.plot(times, r_ice_history * 1e6, color='#22c55e', linewidth=2, label='Ice crystal')
ax.plot(times, r_liquid_history * 1e6, color='#3b82f6', linewidth=2, label='Liquid droplets')
ax.axhline(y=100, color='#ec4899', linewidth=1, linestyle=':', alpha=0.6)
ax.text(1, 103, 'Raindrop threshold', color='#ec4899', fontsize=8)
ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Radius (micrometers)', color='white')
ax.set_title(f'Bergeron process at {T_cloud}C', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 4: Ice crystal growth rate vs temperature
ax = axes[1, 1]
temps = np.linspace(-40, -1, 100)
e_liq = sat_vapor_pressure_liquid(temps)
e_ic = sat_vapor_pressure_ice(temps)
growth_rate = (e_liq - e_ic) / e_ic  # proportional to growth rate

ax.plot(temps, growth_rate * 100, color='#a855f7', linewidth=2)
ax.fill_between(temps, 0, growth_rate * 100, alpha=0.15, color='#a855f7')
ax.axvline(x=-15, color='#ef4444', linewidth=1.5, linestyle='--', alpha=0.7)
ax.text(-14.5, growth_rate.max() * 90, 'Dendrite\
growth\
regime', color='#ef4444', fontsize=9)
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Ice growth driving force (%)', color='white')
ax.set_title('Optimal seeding temperature', color='white', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.show()

print("Bergeron Process Simulation Results")
print("=" * 55)
print(f"  Cloud temperature: {T_cloud}C")
print(f"  Vapor pressure over liquid: {e_l:.1f} Pa")
print(f"  Vapor pressure over ice:    {e_i:.1f} Pa")
print(f"  Difference:                 {e_l - e_i:.1f} Pa ({S_diff*100:.1f}% supersaturation for ice)")
print()
print(f"  Initial ice crystal radius:  {r_ice*1e6:.0f} um")
print(f"  Final ice crystal radius:    {r_ice_history[-1]*1e6:.0f} um")
print(f"  Initial liquid droplet radius: {r_liquid*1e6:.0f} um")
print(f"  Final liquid droplet radius:   {r_liquid_history[-1]*1e6:.0f} um")
print()
print("The ice crystal grows at the expense of liquid droplets.")
print("This is the Bergeron process: ice steals vapor from liquid.")
print("Silver iodide seeding introduces ice nuclei to trigger this cascade.")`,
      challenge: 'Vary the cloud temperature from -5C to -35C and plot the final ice crystal size after 20 minutes at each temperature. At what temperature does ice grow fastest? This optimal temperature determines the best altitude for seeding aircraft to release silver iodide.',
      successHint: 'The Bergeron process is nature\'s rain-making mechanism for cold clouds. Cloud seeding simply provides the trigger that nature sometimes lacks. The physics is straightforward — the engineering challenge is delivering the right nuclei to the right place at the right time.',
    },
    {
      title: 'Nucleation theory — energy barriers and critical radii',
      concept: `Why doesn\'t water freeze the moment it drops below 0 degrees C? Why don\'t cloud droplets form the instant air becomes supersaturated? The answer is **nucleation theory** — one of the most important ideas in all of physics.

Consider a tiny embryo of ice forming inside supercooled liquid water. Two energy terms compete:

**Volume energy** (favorable): The ice phase is thermodynamically more stable below 0C. Converting liquid to ice releases latent heat. This energy scales with the volume of the embryo, which goes as r^3.

**Surface energy** (unfavorable): Creating a new ice-liquid interface costs energy. Surface molecules are in a high-energy state because they have fewer neighbors. This energy scales with the surface area, which goes as r^2.

For small embryos, the surface term (r^2) dominates the volume term (r^3), so the total energy *increases* as the embryo grows. There is an **energy barrier** — a maximum in the total energy at the **critical radius** r*. Embryos smaller than r* spontaneously shrink and disappear. Only embryos that fluctuate past r* can grow freely.

**Homogeneous nucleation** requires the embryo to form entirely from random molecular fluctuations. This demands enormous supersaturation (~300% for water droplets, or supercooling to about -38C for ice). It almost never happens in the atmosphere.

**Heterogeneous nucleation** provides a foreign surface (an aerosol, a silver iodide crystal) that reduces the effective surface energy. The contact angle between the ice embryo and the substrate determines how much the energy barrier is lowered. AgI has a contact angle near 0 with ice, reducing the barrier by orders of magnitude. This is why cloud seeding works.`,
      analogy: 'Imagine building a sandcastle at the beach. The first few handfuls of sand keep collapsing (surface tension dominates — the embryo is below critical size). But if you can pile enough sand to form a stable base (reach the critical radius), the castle can grow freely. Building on a flat rock (heterogeneous nucleation) is much easier than building on loose sand (homogeneous nucleation) because the rock provides a stable foundation that reduces the amount of sand you need for a stable base.',
      storyConnection: 'The cloud that refused to rain was in a nucleation crisis. It had the raw material — water vapor, supercooled droplets — but lacked the surfaces to trigger ice formation. Cherrapunji, just across the border in Meghalaya, receives over 11,000 mm of rain annually because orographic lift forces moist air upward so violently that nucleation happens readily. The stubborn cloud over the Assam plains had no such forcing. It needed a push — exactly what artificial nuclei provide.',
      checkQuestion: 'At -10C, homogeneous nucleation of ice is essentially impossible but heterogeneous nucleation on AgI occurs readily. Both involve forming ice in supercooled water. What specifically is different about the energy landscape?',
      checkAnswer: 'The volume free energy term is identical in both cases — it depends only on temperature and the thermodynamic properties of ice vs. liquid. What changes is the surface energy term. In homogeneous nucleation, the entire surface of the ice embryo is an ice-liquid interface with full surface energy. In heterogeneous nucleation on AgI, part of the embryo surface rests on the AgI crystal, which has almost zero contact angle with ice. This eliminates most of the surface energy penalty, lowering the critical energy barrier by a factor that can be 10^6 or more. The critical radius is smaller, and random thermal fluctuations can easily push embryos over the barrier.',
      codeIntro: 'Compute and visualize the classical nucleation energy barrier for both homogeneous and heterogeneous nucleation of ice from supercooled water.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Classical Nucleation Theory for ice formation in supercooled water

# Physical constants
sigma_il = 0.033     # ice-liquid surface energy (J/m^2)
L_f = 3.34e5         # latent heat of fusion (J/kg)
rho_ice = 917.0      # ice density (kg/m^3)
T_m = 273.15         # melting point (K)
k_B = 1.381e-23      # Boltzmann constant (J/K)

def delta_G_homogeneous(r, T_C):
    """Free energy of ice embryo formation (homogeneous nucleation)"""
    T = T_m + T_C  # actual temperature in K
    delta_T = T_m - T  # supercooling
    if delta_T <= 0:
        return np.zeros_like(r)
    # Volume free energy: delta_Gv = -rho_ice * L_f * delta_T / T_m
    delta_Gv = -rho_ice * L_f * delta_T / T_m
    # Total: delta_G = (4/3)*pi*r^3 * delta_Gv + 4*pi*r^2 * sigma_il
    return (4/3) * np.pi * r**3 * delta_Gv + 4 * np.pi * r**2 * sigma_il

def critical_radius(T_C):
    """Critical radius for homogeneous nucleation"""
    delta_T = -T_C  # supercooling (positive value)
    if delta_T <= 0:
        return float('inf')
    delta_Gv = rho_ice * L_f * delta_T / T_m
    return 2 * sigma_il / delta_Gv

def critical_barrier(T_C):
    """Critical energy barrier for homogeneous nucleation"""
    r_star = critical_radius(T_C)
    delta_T = -T_C
    delta_Gv = rho_ice * L_f * delta_T / T_m
    return (16 * np.pi * sigma_il**3) / (3 * delta_Gv**2)

def f_theta(theta_deg):
    """Geometric factor for heterogeneous nucleation"""
    theta = np.radians(theta_deg)
    cos_t = np.cos(theta)
    return (2 + cos_t) * (1 - cos_t)**2 / 4

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

# Panel 1: Energy barrier vs radius at different temperatures
ax = axes[0, 0]
r = np.linspace(0, 30e-9, 500)  # radius in meters
temps = [-5, -10, -15, -20, -30]
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

for T_C, color in zip(temps, colors):
    dG = delta_G_homogeneous(r, T_C)
    # Convert to units of kT at that temperature
    kT = k_B * (T_m + T_C)
    ax.plot(r * 1e9, dG / kT, color=color, linewidth=2, label=f'{T_C}C')

ax.axhline(y=0, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.set_xlim(0, 30)
ax.set_ylim(-500, 3000)
ax.set_xlabel('Embryo radius (nm)', color='white')
ax.set_ylabel('Free energy (units of kT)', color='white')
ax.set_title('Nucleation energy barrier', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 2: Critical radius and barrier vs temperature
ax = axes[0, 1]
T_range = np.linspace(-40, -1, 200)
r_stars = [critical_radius(T) * 1e9 for T in T_range]  # in nm
barriers = [critical_barrier(T) / (k_B * (T_m + T)) for T in T_range]  # in kT

ax_twin = ax.twinx()
l1, = ax.plot(T_range, r_stars, color='#22c55e', linewidth=2, label='Critical radius')
l2, = ax_twin.plot(T_range, barriers, color='#ef4444', linewidth=2, label='Energy barrier')

ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Critical radius (nm)', color='#22c55e')
ax_twin.set_ylabel('Barrier height (kT)', color='#ef4444')
ax.set_title('Critical parameters vs temperature', color='white', fontsize=12, fontweight='bold')
ax.tick_params(axis='y', colors='#22c55e')
ax_twin.tick_params(axis='y', colors='#ef4444')
ax_twin.set_facecolor('#111827')
ax_twin.spines['right'].set_color('#ef4444')
ax_twin.spines['left'].set_color('#22c55e')

lines = [l1, l2]
ax.legend(lines, [l.get_label() for l in lines], facecolor='#1f2937',
          edgecolor='gray', labelcolor='white', fontsize=9, loc='upper right')

# Panel 3: Heterogeneous vs homogeneous nucleation
ax = axes[1, 0]
T_C = -15  # fixed temperature
r = np.linspace(0, 20e-9, 500)
kT = k_B * (T_m + T_C)

dG_homo = delta_G_homogeneous(r, T_C) / kT

# Contact angles for different substrates
substrates = [
    ('Homogeneous', 180, '#ef4444'),  # equivalent to no substrate
    ('Poor nucleus (90 deg)', 90, '#f59e0b'),
    ('Good nucleus (45 deg)', 45, '#22c55e'),
    ('AgI (~2 deg)', 2, '#3b82f6'),
]

for name, theta, color in substrates:
    f = f_theta(theta)
    dG = delta_G_homogeneous(r, T_C) * f / kT
    ax.plot(r * 1e9, dG, color=color, linewidth=2, label=f'{name}: f={f:.4f}')

ax.axhline(y=0, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.axhline(y=60, color='gray', linewidth=0.5, linestyle=':', alpha=0.5)
ax.text(12, 65, 'Thermal fluctuation limit (~60 kT)', color='gray', fontsize=8)
ax.set_xlim(0, 20)
ax.set_ylim(-200, 1500)
ax.set_xlabel('Embryo radius (nm)', color='white')
ax.set_ylabel('Free energy (kT)', color='white')
ax.set_title(f'Heterogeneous nucleation at {T_C}C', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 4: Contact angle vs barrier reduction
ax = axes[1, 1]
thetas = np.linspace(0, 180, 200)
f_values = [f_theta(t) for t in thetas]

ax.plot(thetas, f_values, color='#a855f7', linewidth=2.5)
ax.fill_between(thetas, 0, f_values, alpha=0.15, color='#a855f7')

# Mark specific substrates
markers = [('AgI', 2, '#3b82f6'), ('Kaolinite', 45, '#22c55e'),
           ('Soot', 70, '#f59e0b'), ('Nothing', 180, '#ef4444')]
for name, theta, color in markers:
    f = f_theta(theta)
    ax.plot(theta, f, 'o', color=color, markersize=10, zorder=5)
    ax.annotate(name, xy=(theta, f), xytext=(theta + 5, f + 0.05),
                color=color, fontsize=10, fontweight='bold')

ax.set_xlabel('Contact angle (degrees)', color='white')
ax.set_ylabel('f(theta): barrier reduction factor', color='white')
ax.set_title('How substrates lower the nucleation barrier', color='white', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.show()

print("Classical Nucleation Theory Summary")
print("=" * 60)
print(f"  Ice-liquid surface energy: {sigma_il} J/m^2")
print()
for T_C in [-5, -10, -15, -20, -30, -38]:
    r_star = critical_radius(T_C)
    dG_star = critical_barrier(T_C)
    kT = k_B * (T_m + T_C)
    print(f"  T = {T_C:>4d}C: r* = {r_star*1e9:.2f} nm, barrier = {dG_star/kT:.0f} kT")

print()
print("Heterogeneous nucleation barrier factors (at any temperature):")
for name, theta, _ in substrates:
    print(f"  {name:30s}: f = {f_theta(theta):.6f} (barrier x {f_theta(theta):.6f})")
print()
print("AgI reduces the barrier by a factor of ~10^-7.")
print("That is why a few grams of AgI can seed an entire cloud.")`,
      challenge: 'Calculate the nucleation rate J = J0 * exp(-delta_G_star / kT) where J0 ~ 10^34 m^-3 s^-1 for ice nucleation. Plot J vs temperature for both homogeneous and heterogeneous (AgI) nucleation. At what temperature does homogeneous nucleation become significant (J > 1 m^-3 s^-1)? Compare with the observed limit of about -38C.',
      successHint: 'Classical nucleation theory is a cornerstone of physical chemistry, materials science, and atmospheric science. The same math that explains cloud seeding also explains crystal growth, bubble formation in boiling water, and the solidification of metals. Once you understand the r^2 vs r^3 competition, you see nucleation barriers everywhere.',
    },
    {
      title: 'Atmospheric chemistry — aerosols, pollution, and cloud properties',
      concept: `Every cloud droplet forms on an aerosol particle. No aerosols, no clouds. This makes aerosols the most important atmospheric constituent you have never heard of.

**Cloud condensation nuclei (CCN)** are the subset of aerosols that can activate into cloud droplets at realistic supersaturations (0.1-1%). Their effectiveness depends on size and chemistry:
- Sea salt from ocean spray: excellent CCN, large and hygroscopic
- Sulfate aerosols from SO2 oxidation: good CCN, important over oceans
- Organic aerosols from vegetation and combustion: moderate CCN
- Mineral dust from deserts: poor CCN for liquid but good ice nuclei
- Black carbon (soot): poor CCN, but absorbs sunlight and heats the atmosphere

The **Twomey effect** (first aerosol indirect effect) is one of the most important phenomena in climate science. When more CCN are present:
1. The same amount of cloud water is distributed over more droplets
2. Each droplet is smaller
3. More, smaller droplets have higher total surface area
4. Higher surface area reflects more sunlight (higher albedo)
5. The cloud appears brighter from space

But there is a twist. More, smaller droplets also suppress precipitation (less collision-coalescence) which means the cloud lasts longer — the **Albrecht effect** (second aerosol indirect effect). This creates a feedback: pollution makes clouds brighter AND longer-lived, which cools the planet. How much cooling? This is the single largest uncertainty in climate science, estimated at -0.5 to -1.5 W/m^2.

**Ship tracks** are the smoking gun. Satellite images show bright white lines in marine clouds that follow shipping lanes exactly. Ship exhaust provides extra CCN, the clouds over the ship track have more, smaller droplets, and they reflect more sunlight. This natural experiment proves the Twomey effect is real.`,
      analogy: 'Imagine you have a bucket of paint and need to cover a wall. If you pour it into 10 large buckets, each bucket covers a small patch with thick paint (few large droplets). If you pour the same amount into 1000 small spray cans, you get thin, even coverage over a much larger area (many small droplets). The wall (cloud) looks very different even though the total paint (water) is the same. Pollution is like switching from buckets to spray cans — same water, different distribution, different appearance from space.',
      storyConnection: 'Assam\'s tea gardens burn brush after harvest, and brick kilns line the Brahmaputra valley. This pollution adds aerosols that modify monsoon clouds in ways that are still poorly understood. Nearby Cherrapunji\'s extreme rainfall may be partly due to its relatively clean air — fewer CCN mean larger droplets and more efficient rain. The irony: the pollution from Assam\'s own industry may be contributing to the stubborn clouds that refuse to rain over its tea gardens. The cloud in the story may have been poisoned by the very people who needed its rain.',
      checkQuestion: 'A factory opens upwind of a region that depends on rainfall for agriculture. Cloud cover increases (clouds last longer), but rainfall decreases. Explain this seemingly contradictory observation using aerosol-cloud interactions.',
      checkAnswer: 'The factory emits aerosols that act as CCN. More CCN means more, smaller cloud droplets (Twomey effect). Smaller droplets suppress collision-coalescence, inhibiting rain formation (precipitation suppression). The clouds persist longer because they are not raining out (Albrecht effect), so cloud cover increases. But each cloud produces less rain. More cloud, less rain — the aerosol indirect effects work together to create this paradox. This is exactly what has been observed downwind of major pollution sources.',
      codeIntro: 'Model the Twomey effect: show how doubling CCN concentration changes the droplet size distribution, cloud albedo, and precipitation efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Twomey effect: more CCN -> more droplets -> smaller droplets -> brighter cloud

def cloud_properties(N_ccn, LWC=0.3e-3):
    """
    Calculate cloud droplet properties given CCN concentration.
    N_ccn: CCN concentration (per m^3)
    LWC: liquid water content (kg/m^3), typical = 0.3 g/m^3
    Returns: mean radius, effective radius, albedo, autoconversion rate
    """
    rho_w = 1000.0  # water density

    # Assume all CCN activate: N_droplets = N_ccn
    N_d = N_ccn

    # Mean volume radius: LWC = N_d * (4/3)*pi*r^3 * rho_w
    r_vol = (3 * LWC / (4 * np.pi * rho_w * N_d))**(1/3)

    # Effective radius (for radiation): r_eff ~ 1.08 * r_vol (typical)
    r_eff = 1.08 * r_vol

    # Cloud optical depth: tau = (3 * LWP) / (2 * rho_w * r_eff)
    # LWP = LWC * cloud_depth
    cloud_depth = 500  # meters
    LWP = LWC * cloud_depth
    tau = (3 * LWP) / (2 * rho_w * r_eff)

    # Albedo (two-stream approximation): A = tau / (tau + 7.7)
    albedo = tau / (tau + 7.7)

    # Autoconversion rate (simplified Kessler): proportional to r^6
    # Larger droplets rain more efficiently
    autoconv = r_vol**6 * N_d  # relative precipitation efficiency

    return r_vol, r_eff, tau, albedo, autoconv

# Range of CCN concentrations
N_range = np.logspace(7, 10, 200)  # 10^7 to 10^10 per m^3
# Typical: clean marine ~100/cm^3 = 10^8/m^3, polluted ~1000/cm^3 = 10^9/m^3

results = np.array([cloud_properties(N) for N in N_range])
r_vol = results[:, 0]
r_eff = results[:, 1]
tau = results[:, 2]
albedo = results[:, 3]
autoconv = results[:, 4]

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

N_cm3 = N_range * 1e-6  # convert to per cm^3

# Panel 1: Droplet size vs CCN
ax = axes[0, 0]
ax.plot(N_cm3, r_vol * 1e6, color='#3b82f6', linewidth=2)
ax.set_xscale('log')
ax.axhline(y=14, color='#ef4444', linewidth=1, linestyle=':', alpha=0.6)
ax.text(20, 14.5, 'Rain threshold (~14 um)', color='#ef4444', fontsize=8)
ax.set_xlabel('CCN concentration (cm^-3)', color='white')
ax.set_ylabel('Mean droplet radius (um)', color='white')
ax.set_title('More CCN = smaller droplets', color='white', fontsize=11, fontweight='bold')

# Panel 2: Cloud optical depth vs CCN
ax = axes[0, 1]
ax.plot(N_cm3, tau, color='#f59e0b', linewidth=2)
ax.set_xscale('log')
ax.set_xlabel('CCN concentration (cm^-3)', color='white')
ax.set_ylabel('Optical depth (tau)', color='white')
ax.set_title('More CCN = thicker-looking cloud', color='white', fontsize=11, fontweight='bold')

# Panel 3: Albedo vs CCN
ax = axes[0, 2]
ax.plot(N_cm3, albedo, color='#22c55e', linewidth=2.5)
ax.set_xscale('log')
ax.set_xlabel('CCN concentration (cm^-3)', color='white')
ax.set_ylabel('Cloud albedo', color='white')
ax.set_title('Twomey effect: brighter clouds', color='white', fontsize=11, fontweight='bold')

# Mark clean vs polluted
for N_val, label, color in [(100, 'Clean marine', '#3b82f6'), (1000, 'Polluted', '#ef4444')]:
    _, _, _, alb, _ = cloud_properties(N_val * 1e6)
    ax.axvline(x=N_val, color=color, linewidth=1, linestyle='--', alpha=0.5)
    ax.plot(N_val, alb, 'o', color=color, markersize=8, zorder=5)
    ax.annotate(f'{label}\
A={alb:.2f}', xy=(N_val, alb),
                xytext=(N_val * 2, alb - 0.05), color=color, fontsize=9)

# Panel 4: Precipitation efficiency vs CCN
ax = axes[1, 0]
autoconv_norm = autoconv / autoconv.max()
ax.plot(N_cm3, autoconv_norm, color='#ec4899', linewidth=2)
ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlabel('CCN concentration (cm^-3)', color='white')
ax.set_ylabel('Relative precip. efficiency', color='white')
ax.set_title('More CCN = less rain', color='white', fontsize=11, fontweight='bold')

# Panel 5: Droplet size distributions (clean vs polluted)
ax = axes[1, 1]
r_bins = np.linspace(0, 30, 100)  # micrometers

# Gamma distribution for droplet sizes
from numpy import exp as np_exp
for N_ccn_cm3, label, color in [(100, 'Clean (100 CCN/cm3)', '#3b82f6'),
                                  (500, 'Moderate (500 CCN/cm3)', '#22c55e'),
                                  (2000, 'Polluted (2000 CCN/cm3)', '#ef4444')]:
    r_mean = cloud_properties(N_ccn_cm3 * 1e6)[0] * 1e6  # in um
    alpha = 6.0  # shape parameter
    beta = r_mean / alpha
    n_r = r_bins**(alpha - 1) * np.exp(-r_bins / beta) / (beta**alpha)
    n_r = n_r / n_r.max() * N_ccn_cm3  # scale by concentration
    ax.plot(r_bins, n_r, color=color, linewidth=2, label=label)

ax.set_xlabel('Droplet radius (um)', color='white')
ax.set_ylabel('Number concentration (relative)', color='white')
ax.set_title('Size distributions shift left with pollution', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Panel 6: Radiative forcing estimate
ax = axes[1, 2]
# Simplified: delta_F = -F_solar * delta_albedo * cloud_fraction
F_solar = 340  # W/m^2 average incoming solar
cloud_fraction = 0.67
N_base = 100  # clean baseline CCN/cm^3
_, _, _, A_base, _ = cloud_properties(N_base * 1e6)

N_increase = np.linspace(1, 10, 100)  # multiplication factor
forcing = np.zeros_like(N_increase)

for i, factor in enumerate(N_increase):
    _, _, _, A_new, _ = cloud_properties(N_base * factor * 1e6)
    delta_A = A_new - A_base
    forcing[i] = -F_solar * delta_A * cloud_fraction

ax.plot(N_increase, forcing, color='#a855f7', linewidth=2.5)
ax.fill_between(N_increase, forcing, 0, alpha=0.15, color='#a855f7')
ax.axhline(y=0, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.axhline(y=-1.0, color='#ef4444', linewidth=1, linestyle=':', alpha=0.5)
ax.text(6, -0.85, 'IPCC estimate range', color='#ef4444', fontsize=8)
ax.set_xlabel('CCN multiplication factor', color='white')
ax.set_ylabel('Radiative forcing (W/m^2)', color='white')
ax.set_title('Aerosol cooling effect (Twomey)', color='white', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.show()

print("Twomey Effect Analysis")
print("=" * 60)
print(f"  Fixed liquid water content: 0.3 g/m^3")
print(f"  Cloud depth: 500 m")
print()
for N_val, label in [(50, 'Very clean'), (100, 'Clean marine'),
                      (300, 'Average'), (1000, 'Polluted'), (3000, 'Very polluted')]:
    rv, re, t, a, ac = cloud_properties(N_val * 1e6)
    print(f"  {label:20s} ({N_val:>5d} CCN/cm3): r={rv*1e6:.1f}um, tau={t:.0f}, albedo={a:.2f}")
print()
print("Doubling CCN from 100 to 200 /cm3:")
_, _, _, A1, _ = cloud_properties(100e6)
_, _, _, A2, _ = cloud_properties(200e6)
dA = A2 - A1
dF = -F_solar * dA * cloud_fraction
print(f"  Albedo change: {A1:.3f} -> {A2:.3f} (delta = {dA:.3f})")
print(f"  Radiative forcing: {dF:.2f} W/m^2")
print()
print("This is why aerosol-cloud interactions are the largest")
print("uncertainty in climate projections. The same physics that")
print("controls whether a cloud rains also controls Earth's energy budget.")`,
      challenge: 'Add a ship track simulation: model a line of enhanced CCN (1000/cm^3) embedded in clean marine air (100/cm^3). Create a 2D plot showing cloud albedo across the domain, with the ship track visible as a bright line. This replicates what satellites actually observe.',
      successHint: 'Aerosol-cloud interactions connect air pollution, cloud seeding, and climate change into a single physical framework. Understanding the Twomey effect means understanding that every time we change aerosol concentrations — whether by seeding a cloud or by burning fossil fuels — we alter the planet\'s reflectivity.',
    },
    {
      title: 'Statistical analysis of weather modification — does cloud seeding actually work?',
      concept: `Here is the uncomfortable truth about cloud seeding: after 75 years of research, we still cannot say with certainty how well it works. The fundamental problem is **attribution** — the atmosphere is chaotic, and no two clouds are the same. If you seed a cloud and it rains, how do you know it would not have rained anyway?

This is a **causal inference** problem, and it is one of the hardest in all of science. The gold standard solution is the **randomized controlled trial (RCT)**:

1. Identify a set of candidate clouds
2. Randomly assign each cloud to treatment (seeded) or control (not seeded)
3. Measure precipitation from both groups
4. Compare using proper statistical tests

The landmark experiments:
- **Project Whitetop** (1960s, Missouri): found seeding *reduced* rainfall. Later reanalysis showed the result was a statistical artifact of poor randomization.
- **Climax experiments** (Colorado, 1960-70s): showed 10-30% increase in snowfall from seeding. But the result has been debated for decades.
- **Wyoming Weather Modification Pilot Project** (2005-2014): rigorous randomized design, found 5-15% increase in snowfall, but not statistically significant at the 95% level.
- **UAE rain enhancement** (ongoing): massive modern program with advanced statistical design.

The core statistical challenges:
- **High natural variability**: precipitation varies by 100-300% between storms naturally. Detecting a 10-15% signal in that noise requires enormous sample sizes.
- **Contamination**: seeded material can drift into control areas.
- **Selection bias**: operators tend to seed clouds that look promising, biasing the sample.
- **Multiple comparisons**: with many weather variables to measure, some will show "significant" results by chance.

Modern analysis uses **bootstrap resampling**, **permutation tests**, and **Bayesian methods** to handle these challenges.`,
      analogy: 'Imagine you want to test whether a fertilizer helps crops grow. But your fields are on different hillsides, get different amounts of sun, have different soil, and experience different microclimates. Some years it rains more than others. Now imagine each field is the size of a county and you can only run the experiment once per year. That is the cloud seeding evaluation problem — massive natural variability, expensive experiments, tiny sample sizes, and no two experimental units are alike.',
      storyConnection: 'India has conducted cloud seeding operations over drought-prone regions including parts of Assam and neighboring states since the 1950s. The results have been deeply controversial. After some operations, officials claimed success because rain fell — but rain often falls during monsoon season regardless. Without proper randomization and controls, these claims are scientifically meaningless. The tea planters of Assam, watching clouds pass overhead, need to know: if we pay for seeding, will we actually get more rain? The statistics say: probably some, but less than you hope, and we are not entirely sure.',
      checkQuestion: 'A cloud seeding company shows you data: "In 20 seeded events, average rainfall was 12mm. In 20 unseeded events, average rainfall was 9mm. Seeding increased rainfall by 33%." Why should you be skeptical of this claim?',
      checkAnswer: 'Multiple issues: (1) Were events randomly assigned? If the company chose which events to seed, they may have picked more promising clouds. (2) Sample size is tiny — with high precipitation variability, 20 events per group is far too few for statistical significance. (3) The 33% claim ignores uncertainty; the confidence interval likely includes zero (no effect). (4) Was there proper blinding? Did the people measuring rainfall know which events were seeded? (5) Cherry-picking: were there other metrics where seeding showed no effect that are not being reported? Extraordinary claims require extraordinary evidence, and a 33% increase from 40 events is not extraordinary evidence.',
      codeIntro: 'Simulate a cloud seeding experiment with realistic variability, then apply permutation tests to determine whether observed differences are statistically significant.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate cloud seeding experiment
# True seeding effect: 10% increase in precipitation (optimistic estimate)
true_effect = 0.10  # 10% increase

# Natural precipitation variability
base_precip_mean = 10.0   # mm
base_precip_std = 8.0     # mm (high variability is realistic)

def run_experiment(n_seeded, n_control, true_effect, base_mean, base_std):
    """Simulate a randomized cloud seeding experiment."""
    # Control group: natural precipitation (lognormal distribution)
    control = np.random.lognormal(
        mean=np.log(base_mean) - 0.5 * np.log(1 + (base_std/base_mean)**2),
        sigma=np.sqrt(np.log(1 + (base_std/base_mean)**2)),
        size=n_control
    )

    # Seeded group: natural + true effect
    seeded = np.random.lognormal(
        mean=np.log(base_mean * (1 + true_effect)) - 0.5 * np.log(1 + (base_std/base_mean)**2),
        sigma=np.sqrt(np.log(1 + (base_std/base_mean)**2)),
        size=n_seeded
    )

    return seeded, control

def permutation_test(seeded, control, n_permutations=10000):
    """Permutation test for difference in means."""
    observed_diff = np.mean(seeded) - np.mean(control)
    combined = np.concatenate([seeded, control])
    n_seeded = len(seeded)

    count_extreme = 0
    perm_diffs = np.zeros(n_permutations)

    for i in range(n_permutations):
        np.random.shuffle(combined)
        perm_seeded = combined[:n_seeded]
        perm_control = combined[n_seeded:]
        perm_diffs[i] = np.mean(perm_seeded) - np.mean(perm_control)
        if perm_diffs[i] >= observed_diff:
            count_extreme += 1

    p_value = count_extreme / n_permutations
    return observed_diff, p_value, perm_diffs

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

# Experiment 1: Small sample (n=20 each) - typical early experiment
seeded_small, control_small = run_experiment(20, 20, true_effect, base_precip_mean, base_precip_std)
obs_diff_small, p_small, perm_diffs_small = permutation_test(seeded_small, control_small)

ax = axes[0, 0]
bins = np.linspace(0, 40, 20)
ax.hist(control_small, bins=bins, alpha=0.6, color='#3b82f6', label=f'Control (n=20, mean={np.mean(control_small):.1f})')
ax.hist(seeded_small, bins=bins, alpha=0.6, color='#22c55e', label=f'Seeded (n=20, mean={np.mean(seeded_small):.1f})')
ax.set_xlabel('Precipitation (mm)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Small experiment (n=20)', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

ax = axes[0, 1]
ax.hist(perm_diffs_small, bins=50, color='#6b7280', alpha=0.7)
ax.axvline(x=obs_diff_small, color='#ef4444', linewidth=2, linestyle='-',
           label=f'Observed diff: {obs_diff_small:.2f} mm')
ax.set_xlabel('Difference in means (mm)', color='white')
ax.set_ylabel('Permutation count', color='white')
ax.set_title(f'Permutation test (p = {p_small:.3f})', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Experiment 2: Large sample (n=500 each) - Wyoming-scale
seeded_large, control_large = run_experiment(500, 500, true_effect, base_precip_mean, base_precip_std)
obs_diff_large, p_large, perm_diffs_large = permutation_test(seeded_large, control_large)

ax = axes[0, 2]
ax.hist(perm_diffs_large, bins=50, color='#6b7280', alpha=0.7)
ax.axvline(x=obs_diff_large, color='#ef4444', linewidth=2, linestyle='-',
           label=f'Observed diff: {obs_diff_large:.2f} mm')
ax.set_xlabel('Difference in means (mm)', color='white')
ax.set_ylabel('Permutation count', color='white')
ax.set_title(f'Large experiment (n=500, p = {p_large:.3f})', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Panel 4: Power analysis - how many events do we need?
ax = axes[1, 0]
sample_sizes = [10, 20, 50, 100, 200, 500, 1000]
power_results = []

for n in sample_sizes:
    significant_count = 0
    n_trials = 500
    for trial in range(n_trials):
        s, c = run_experiment(n, n, true_effect, base_precip_mean, base_precip_std)
        # Quick bootstrap test
        obs = np.mean(s) - np.mean(c)
        combined = np.concatenate([s, c])
        perm_count = 0
        for _ in range(200):  # fewer permutations for speed
            np.random.shuffle(combined)
            if np.mean(combined[:n]) - np.mean(combined[n:]) >= obs:
                perm_count += 1
        if perm_count / 200 < 0.05:
            significant_count += 1
    power_results.append(significant_count / n_trials)

ax.plot(sample_sizes, power_results, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax.axhline(y=0.8, color='#ef4444', linewidth=1, linestyle='--', alpha=0.7)
ax.text(50, 0.82, 'Desired power = 0.80', color='#ef4444', fontsize=9)
ax.set_xlabel('Events per group', color='white')
ax.set_ylabel('Statistical power', color='white')
ax.set_title('Power analysis: 10% true effect', color='white', fontsize=11, fontweight='bold')
ax.set_xscale('log')

# Panel 5: Multiple comparisons problem
ax = axes[1, 1]
n_metrics = 20  # test 20 different weather variables
n_simulations = 1000
false_positive_rates = []

for alpha in [0.05, 0.01, 0.005]:
    fp_count = 0
    for _ in range(n_simulations):
        # No true effect for any metric
        p_values = np.random.uniform(0, 1, n_metrics)  # under null, p-values are uniform
        if np.any(p_values < alpha):
            fp_count += 1
    false_positive_rates.append(fp_count / n_simulations)

# Bonferroni correction
bonf_rates = []
for alpha in [0.05, 0.01, 0.005]:
    corrected_alpha = alpha / n_metrics
    fp_count = 0
    for _ in range(n_simulations):
        p_values = np.random.uniform(0, 1, n_metrics)
        if np.any(p_values < corrected_alpha):
            fp_count += 1
    bonf_rates.append(fp_count / n_simulations)

x_pos = np.arange(3)
width = 0.35
ax.bar(x_pos - width/2, false_positive_rates, width, color='#ef4444', alpha=0.8, label='Uncorrected')
ax.bar(x_pos + width/2, bonf_rates, width, color='#22c55e', alpha=0.8, label='Bonferroni corrected')
ax.set_xticks(x_pos)
ax.set_xticklabels(['alpha=0.05', 'alpha=0.01', 'alpha=0.005'], color='white')
ax.set_ylabel('False positive rate', color='white')
ax.set_title(f'Multiple comparisons ({n_metrics} metrics)', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 6: Effect size matters more than p-value
ax = axes[1, 2]
effect_sizes = [0.0, 0.05, 0.10, 0.15, 0.20, 0.30]
n_events = 100

for effect, color in zip(effect_sizes, ['#6b7280', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']):
    diffs = []
    for _ in range(1000):
        s, c = run_experiment(n_events, n_events, effect, base_precip_mean, base_precip_std)
        diffs.append((np.mean(s) - np.mean(c)) / np.mean(c) * 100)
    ax.hist(diffs, bins=30, alpha=0.4, color=color, label=f'{effect*100:.0f}% true effect')

ax.axvline(x=0, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Observed effect (%)', color='white')
ax.set_ylabel('Count (of 1000 experiments)', color='white')
ax.set_title('Effect size distributions overlap heavily', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper right')

plt.tight_layout()
plt.show()

print("Cloud Seeding Statistical Analysis")
print("=" * 60)
print(f"  True seeding effect: {true_effect*100:.0f}% increase")
print(f"  Natural variability: mean={base_precip_mean:.0f}mm, std={base_precip_std:.0f}mm")
print(f"  Coefficient of variation: {base_precip_std/base_precip_mean*100:.0f}%")
print()
print(f"  Small experiment (n=20):  observed diff = {obs_diff_small:.2f}mm, p = {p_small:.3f}")
print(f"  Large experiment (n=500): observed diff = {obs_diff_large:.2f}mm, p = {p_large:.3f}")
print()
print("Power analysis (events needed per group for 80% power):")
for n, power in zip(sample_sizes, power_results):
    marker = " <-- sufficient" if power >= 0.8 else ""
    print(f"  n = {n:>5d}: power = {power:.2f}{marker}")
print()
print("This is why cloud seeding remains controversial after 75 years.")
print("A 10% effect buried in 80% natural variability needs hundreds")
print("of events to detect reliably. Most programs run far fewer.")`,
      challenge: 'Implement a Bayesian analysis: start with a skeptical prior (effect centered at 0% with wide uncertainty), update with the experimental data, and show the posterior distribution. How does the posterior change as you add more experimental events? At what point does the evidence overcome the skeptical prior?',
      successHint: 'The cloud seeding attribution problem is a masterclass in statistical reasoning. It teaches you that the question is never "did it rain after seeding?" but "did it rain MORE than it would have without seeding?" That distinction — correlation vs causation, controlled by randomization — is the foundation of all experimental science.',
    },
    {
      title: 'Climate engineering and ethics — who decides the world\'s weather?',
      concept: `Cloud seeding is weather modification at the local scale. But the same principles can be scaled up to **climate engineering** (geoengineering) — deliberate, large-scale intervention in Earth\'s climate system.

**Stratospheric aerosol injection (SAI)**: Inject sulfate aerosols into the stratosphere to reflect sunlight, mimicking the cooling effect of large volcanic eruptions. The 1991 Pinatubo eruption cooled the planet by ~0.5C for two years. SAI could potentially offset 1-2C of warming. Cost estimate: $2-10 billion per year — shockingly cheap compared to the cost of climate change.

**Marine cloud brightening (MCB)**: Spray sea salt aerosol into low marine clouds to increase their reflectivity via the Twomey effect. This is cloud seeding scaled up from precipitation enhancement to climate cooling.

**Cirrus cloud thinning**: Thin high-altitude ice clouds to allow more longwave radiation to escape to space. Uses the same ice nucleation physics as glaciogenic cloud seeding, but in reverse — you want fewer, larger ice crystals that fall out, reducing cloud cover.

The science is real. The ethics are terrifying:

- **Termination shock**: If you start SAI and then stop (political instability, war, funding cuts), warming snaps back within years. You are committing future generations to perpetual intervention.
- **Uneven effects**: SAI reduces global mean temperature but changes precipitation patterns. Models suggest it could reduce monsoon rainfall in South Asia by 5-10% while offsetting global warming. Assam\'s tea gardens could suffer.
- **Moral hazard**: If geoengineering seems to work, it reduces the urgency to cut emissions. But geoengineering does not address ocean acidification, and it must be maintained forever.
- **Governance**: Who decides? A wealthy nation could unilaterally deploy SAI for ~$10 billion/year. There is no international framework for governing the planet's thermostat.
- **Environmental justice**: The nations most affected by altered precipitation patterns are often those with the least political power to influence deployment decisions.`,
      analogy: 'Imagine your house is on fire (climate change). Geoengineering is like turning on a powerful air conditioner while the fire still burns. The temperature inside goes down, and it feels better. But the house is still on fire. The smoke is still accumulating. The structure is still weakening. And the moment the air conditioner breaks, the heat hits you all at once. The right solution is to put out the fire (cut emissions). But if the fire is already too large, the air conditioner might buy time while you fight it.',
      storyConnection: 'The cloud that refused to rain is a small parable for a planetary dilemma. Assam depends on monsoon regularity — the Brahmaputra valley\'s entire ecology, agriculture, and culture is tuned to seasonal rainfall patterns established over millennia. Geoengineering models consistently show that interventions designed to help one region can harm another. A stratospheric veil that reduces warming in the Arctic might weaken the Indian monsoon that waters Assam\'s tea. The cloud in the story refused to rain on its own terms. The deeper question is: should we force it?',
      checkQuestion: 'A billionaire proposes to fund marine cloud brightening off the California coast to protect against drought. What are three specific concerns that go beyond "is the science sound?"',
      checkAnswer: 'First, distributional justice: brightening clouds off California could alter precipitation downwind — Mexico, the Pacific islands, or Asia could receive less rain. Who compensates them? Second, governance precedent: if one person can modify regional climate, what stops a nation from doing it at continental scale without consent? There is no legal framework. Third, moral hazard: if California solves its drought with cloud brightening, the political will to address underlying water management and climate emissions evaporates. The intervention treats the symptom while the disease progresses. These are not hypothetical — they are the central debates in the geoengineering research community today.',
      codeIntro: 'Model the radiative forcing from stratospheric aerosol injection and marine cloud brightening, and simulate their effect on global temperature and monsoon rainfall.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple energy balance climate model with geoengineering
# dT/dt = (1/C) * (F_solar * (1-alpha) + F_greenhouse - F_outgoing + F_geo)

class ClimateModel:
    def __init__(self):
        self.C = 4.2e8          # heat capacity (J/m^2/K) - ocean mixed layer
        self.lambda_r = 3.2     # climate sensitivity parameter (W/m^2/K)
        self.F_2xCO2 = 3.7     # forcing from doubling CO2 (W/m^2)
        self.T_eq = 288.0       # pre-industrial equilibrium temperature (K)

    def run(self, years, co2_scenario, geo_forcing=None):
        """
        Run the climate model.
        co2_scenario: function(year) -> CO2 concentration in ppm
        geo_forcing: function(year) -> additional forcing in W/m^2 (negative = cooling)
        """
        dt = 0.1  # years
        n_steps = int(years / dt)
        T = np.zeros(n_steps)
        T[0] = self.T_eq
        time = np.linspace(0, years, n_steps)

        for i in range(1, n_steps):
            year = time[i]
            co2 = co2_scenario(year)
            F_co2 = self.F_2xCO2 * np.log2(co2 / 280.0)  # forcing relative to pre-industrial

            F_geo = geo_forcing(year) if geo_forcing is not None else 0.0
            F_total = F_co2 + F_geo

            dT = (F_total - self.lambda_r * (T[i-1] - self.T_eq)) / self.C * (dt * 365.25 * 86400)
            T[i] = T[i-1] + dT

        return time, T

# CO2 scenarios
def co2_business_as_usual(year):
    """RCP 8.5-like: CO2 rises from 280 to ~900 ppm by 2100"""
    if year < 1850:
        return 280
    return 280 * np.exp(0.004 * (year - 1850))

def co2_mitigation(year):
    """Strong mitigation: CO2 peaks at ~450 ppm around 2050"""
    if year < 1850:
        return 280
    elif year < 2050:
        return 280 + 170 * (1 - np.exp(-0.02 * (year - 1850)))
    else:
        return 280 + 170 * (1 - np.exp(-0.02 * (2050 - 1850))) * np.exp(-0.01 * (year - 2050))

# Geoengineering scenarios
def sai_forcing(year):
    """SAI deployed starting 2030, ramps to -2 W/m^2"""
    if year < 2030:
        return 0
    return -2.0 * min(1.0, (year - 2030) / 10)  # ramp over 10 years

def sai_terminated(year):
    """SAI deployed 2030-2060, then abruptly stopped"""
    if year < 2030 or year >= 2060:
        return 0
    return -2.0 * min(1.0, (year - 2030) / 10)

def mcb_forcing(year):
    """Marine cloud brightening: -1 W/m^2 starting 2035"""
    if year < 2035:
        return 0
    return -1.0 * min(1.0, (year - 2035) / 5)

model = ClimateModel()
years = 300
start = 1850

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

# Panel 1: Temperature trajectories
ax = axes[0, 0]
scenarios = [
    ('Business as usual', co2_business_as_usual, None, '#ef4444'),
    ('BAU + SAI', co2_business_as_usual, sai_forcing, '#22c55e'),
    ('BAU + SAI (terminated 2060)', co2_business_as_usual, sai_terminated, '#f59e0b'),
    ('Strong mitigation', co2_mitigation, None, '#3b82f6'),
    ('Mitigation + MCB', co2_mitigation, mcb_forcing, '#a855f7'),
]

for name, co2_fn, geo_fn, color in scenarios:
    time, T = model.run(years, co2_fn, geo_fn)
    time_abs = time + start - (time[0])
    # Offset so pre-industrial starts at 0
    ax.plot(time_abs[time_abs <= 2150], (T - model.T_eq)[time_abs <= 2150],
            color=color, linewidth=2, label=name)

ax.axhline(y=1.5, color='white', linewidth=0.5, linestyle=':', alpha=0.4)
ax.text(2155, 1.5, '1.5C target', color='white', fontsize=7, va='center')
ax.axhline(y=2.0, color='white', linewidth=0.5, linestyle=':', alpha=0.4)
ax.text(2155, 2.0, '2.0C target', color='white', fontsize=7, va='center')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Warming above pre-industrial (C)', color='white')
ax.set_title('Temperature pathways', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper left')
ax.set_xlim(1850, 2150)

# Panel 2: Termination shock detail
ax = axes[0, 1]
time, T_sai = model.run(years, co2_business_as_usual, sai_terminated)
time, T_bau = model.run(years, co2_business_as_usual, None)
time_abs = time + start - time[0]
mask = (time_abs >= 2020) & (time_abs <= 2100)

ax.plot(time_abs[mask], (T_bau - model.T_eq)[mask], color='#ef4444', linewidth=2, label='BAU (no intervention)')
ax.plot(time_abs[mask], (T_sai - model.T_eq)[mask], color='#f59e0b', linewidth=2.5, label='SAI terminated at 2060')

# Highlight the shock
ax.axvline(x=2060, color='#f59e0b', linewidth=1, linestyle='--', alpha=0.5)
ax.annotate('SAI stops', xy=(2060, 1.5), xytext=(2065, 1.0),
            color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Calculate warming rate after termination
idx_2060 = np.argmin(np.abs(time_abs - 2060))
idx_2065 = np.argmin(np.abs(time_abs - 2065))
idx_2070 = np.argmin(np.abs(time_abs - 2070))
warming_rate = (T_sai[idx_2070] - T_sai[idx_2060]) / 10
ax.annotate(f'Rate: {warming_rate:.2f} C/decade', xy=(2065, T_sai[idx_2065] - model.T_eq),
            color='white', fontsize=9, xytext=(2070, 2.5),
            arrowprops=dict(arrowstyle='->', color='white'))

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Warming (C)', color='white')
ax.set_title('Termination shock', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 3: Forcing components
ax = axes[0, 2]
year_range = np.linspace(1850, 2150, 500)
co2_forcing = [model.F_2xCO2 * np.log2(co2_business_as_usual(y) / 280.0) for y in year_range]
sai_f = [sai_forcing(y) for y in year_range]
net = [cf + sf for cf, sf in zip(co2_forcing, sai_f)]

ax.fill_between(year_range, 0, co2_forcing, alpha=0.3, color='#ef4444', label='CO2 forcing')
ax.fill_between(year_range, 0, sai_f, alpha=0.3, color='#3b82f6', label='SAI forcing')
ax.plot(year_range, net, color='#22c55e', linewidth=2, label='Net forcing')
ax.axhline(y=0, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Radiative forcing (W/m^2)', color='white')
ax.set_title('Forcing balance', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 4: Monsoon impact (simplified model)
ax = axes[1, 0]
# SAI reduces land-sea temperature contrast, weakening monsoons
# Simplified: monsoon rainfall ~ base * (1 + alpha * (T_land - T_ocean))
T_land_sea_base = 5.0  # C temperature contrast
monsoon_base = 100  # relative units

year_range_m = np.linspace(2000, 2100, 200)
monsoon_bau = []
monsoon_sai = []
monsoon_mit = []

for y in year_range_m:
    # BAU: warming increases land-sea contrast slightly
    co2_f = model.F_2xCO2 * np.log2(co2_business_as_usual(y) / 280.0)
    dT_bau = co2_f / model.lambda_r
    monsoon_bau.append(monsoon_base * (1 + 0.02 * dT_bau))

    # SAI: reduces temperature but also reduces land-sea contrast
    sai = sai_forcing(y)
    dT_sai = (co2_f + sai) / model.lambda_r
    # SAI preferentially cools land (aerosol effect), reducing contrast
    contrast_reduction = -0.03 * abs(sai)  # SAI reduces contrast
    monsoon_sai.append(monsoon_base * (1 + 0.02 * dT_sai + contrast_reduction))

    # Mitigation
    co2_f_mit = model.F_2xCO2 * np.log2(co2_mitigation(y) / 280.0)
    dT_mit = co2_f_mit / model.lambda_r
    monsoon_mit.append(monsoon_base * (1 + 0.02 * dT_mit))

ax.plot(year_range_m, monsoon_bau, color='#ef4444', linewidth=2, label='BAU')
ax.plot(year_range_m, monsoon_sai, color='#f59e0b', linewidth=2, label='BAU + SAI')
ax.plot(year_range_m, monsoon_mit, color='#3b82f6', linewidth=2, label='Mitigation')
ax.axhline(y=monsoon_base, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Monsoon rainfall index', color='white')
ax.set_title('South Asian monsoon impact', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Panel 5: Cost comparison
ax = axes[1, 1]
interventions = ['SAI\
(annual)', 'MCB\
(annual)', 'Global\
emissions\
reduction', 'Climate\
damage\
(annual)']
costs = [5, 10, 500, 2000]  # billions USD
bar_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

bars = ax.bar(interventions, costs, color=bar_colors, alpha=0.8)
ax.set_ylabel('Cost (billion USD/year)', color='white')
ax.set_title('Cost comparison', color='white', fontsize=11, fontweight='bold')
ax.tick_params(axis='x', colors='white', labelsize=9)

for bar, cost in zip(bars, costs):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 30,
            f'$' + str(cost) + 'B', ha='center', color='white', fontsize=10, fontweight='bold')

# Panel 6: Decision matrix
ax = axes[1, 2]
ax.axis('off')
table_data = [
    ['Criterion', 'SAI', 'MCB', 'Mitigation'],
    ['Effectiveness', 'High', 'Moderate', 'High'],
    ['Speed', 'Years', 'Years', 'Decades'],
    ['Cost', 'Very low', 'Low', 'Very high'],
    ['Reversibility', 'Poor *', 'Good', 'Slow'],
    ['Side effects', 'Severe', 'Moderate', 'Minimal'],
    ['Governance', 'Nightmare', 'Regional', 'Global'],
    ['Moral hazard', 'High', 'Moderate', 'None'],
]

table = ax.table(cellText=table_data, loc='center', cellLoc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
table.scale(1.0, 1.8)

for (i, j), cell in table.get_celld().items():
    cell.set_edgecolor('gray')
    if i == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(color='white', fontweight='bold')
    else:
        cell.set_facecolor('#1f2937')
        cell.set_text_props(color='white')

ax.set_title('Intervention comparison', color='white', fontsize=11, fontweight='bold', pad=20)

plt.tight_layout()
plt.show()

print("Climate Engineering Analysis")
print("=" * 60)
print("SAI at -2 W/m^2 offsets ~1.1C of CO2 warming.")
print(f"Termination shock warming rate: {warming_rate:.2f} C/decade")
print(f"  (Normal warming rate under BAU: ~0.3 C/decade)")
print(f"  Termination shock is {warming_rate/0.3:.1f}x faster than gradual warming.")
print()
print("Key tensions:")
print("  1. SAI is cheap and fast, but creates dependency and side effects")
print("  2. MCB is safer but less powerful")
print("  3. Mitigation is the right answer but may be too slow")
print("  4. The cheapness of SAI means any nation could deploy unilaterally")
print()
print("* SAI 'reversibility' is misleading: stopping SAI is reversible,")
print("  but the termination shock is dangerous. You cannot stop without")
print("  having first solved the underlying CO2 problem.")
print()
print("The cloud that refused to rain asks a simple question.")
print("Geoengineering asks the same question at planetary scale:")
print("Should we force nature to do what we want?")`,
      challenge: 'Add a "delayed mitigation + temporary geoengineering" scenario: SAI starts in 2030, aggressive emissions cuts begin in 2040, SAI is gradually phased out as CO2 levels decline. Show that this "bridge" strategy avoids termination shock while keeping warming below 2C. Is this the least-bad option?',
      successHint: 'Climate engineering forces you to think about science, politics, ethics, and justice simultaneously. There is no purely technical answer. The code gives you numbers, but the decision requires values. That is the hardest lesson in all of STEM: the most important questions are not answered by equations alone.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Cloud Physics & Weather Modification
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (atmospheric science fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real cloud physics simulations. Click to start.</p>
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
