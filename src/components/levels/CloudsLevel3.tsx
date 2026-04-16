import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudsLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Cloud formation physics — why air cools as it rises',
      concept: `Clouds form when invisible water vapor in the air becomes visible liquid droplets or ice crystals. This happens through a chain of physics:

1. **Adiabatic cooling**: When air rises, it moves into regions of lower atmospheric pressure. Lower pressure allows the air parcel to expand. Expansion requires energy, which comes from the air's own internal heat — so the air cools without losing heat to its surroundings. This is "adiabatic" cooling (no heat exchange with the environment). Dry air cools at about 9.8 °C per kilometer of ascent (the dry adiabatic lapse rate). Once condensation begins, latent heat release slows the cooling to about 5-6 °C/km (the moist/saturated adiabatic lapse rate).

2. **Dew point**: Every parcel of air has a temperature at which it becomes saturated — 100% relative humidity. This is the dew point. When the air temperature drops to the dew point, water vapor starts condensing.

3. **Condensation nuclei**: Water vapor does not condense easily on its own — it needs tiny particles (dust, pollen, sea salt, soot) to condense onto. These are called Cloud Condensation Nuclei (CCN). Without CCN, air can become supersaturated beyond 100% humidity without forming droplets. Polluted air has more CCN, producing more but smaller droplets.

The altitude where rising air first reaches the dew point is the **Lifting Condensation Level (LCL)** — the flat base you see on cumulus clouds.`,
      analogy: 'Think of a pressure cooker in reverse. In a pressure cooker, high pressure raises the boiling point and keeps water liquid at temperatures above 100 °C. Rising air does the opposite: lower pressure at altitude lowers the point at which vapor saturates, so water that was happily invisible at ground level suddenly condenses into a visible cloud.',
      storyConnection: 'In Assam, the Brahmaputra Valley is a natural cloud factory. Warm, moisture-laden air from the Bay of Bengal is funneled northward and forced to rise over the Meghalaya Plateau. The air cools adiabatically, hits the dew point, and dumps enormous amounts of rain on Cherrapunji and Mawsynram — two of the wettest places on Earth. The boy who talked to clouds would have watched this process daily from the valley floor.',
      checkQuestion: 'If a parcel of dry air at 30 °C starts rising from the ground and the dew point at that location is 10 °C, approximately at what altitude will a cloud begin to form?',
      checkAnswer: 'The dry adiabatic lapse rate is about 9.8 °C/km. The air must cool from 30 °C to 10 °C — a drop of 20 °C. At 9.8 °C per km, that takes about 20/9.8 = 2.04 km, roughly 2 km above the surface. This is where the Lifting Condensation Level (LCL) sits — the flat cloud base.',
      codeIntro: 'Model adiabatic cooling and find the Lifting Condensation Level for different surface conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Adiabatic lapse rates
DRY_LAPSE = 9.8    # °C per km (unsaturated air)
MOIST_LAPSE = 5.5   # °C per km (average, once condensation begins)

def find_lcl_and_profile(T_surface, dew_point, max_alt_km=10):
    """Calculate temperature profile and LCL for rising air."""
    altitudes = np.linspace(0, max_alt_km, 1000)
    temperatures = np.zeros_like(altitudes)

    lcl_alt = None
    for i, alt in enumerate(altitudes):
        if lcl_alt is None:
            # Below LCL: dry adiabatic cooling
            T = T_surface - DRY_LAPSE * alt
            if T <= dew_point:
                lcl_alt = alt
                lcl_temp = T
                temperatures[i] = T
            else:
                temperatures[i] = T
        else:
            # Above LCL: moist adiabatic cooling (slower due to latent heat)
            temperatures[i] = lcl_temp - MOIST_LAPSE * (alt - lcl_alt)

    return altitudes, temperatures, lcl_alt

# Three Assam scenarios
scenarios = [
    {"name": "Dry winter day", "T": 20, "Td": 5, "color": "#f59e0b"},
    {"name": "Pre-monsoon (hot, humid)", "T": 35, "Td": 25, "color": "#ef4444"},
    {"name": "Monsoon peak (saturated)", "T": 28, "Td": 26, "color": "#3b82f6"},
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')
for ax in [ax1, ax2]:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

print("Cloud Formation Physics — Lifting Condensation Level")
print("=" * 55)

for s in scenarios:
    alts, temps, lcl = find_lcl_and_profile(s["T"], s["Td"])
    ax1.plot(temps, alts, color=s["color"], linewidth=2, label=s["name"])
    if lcl is not None:
        ax1.axhline(y=lcl, color=s["color"], linestyle='--', alpha=0.5)
        ax1.plot(s["Td"], lcl, 'o', color=s["color"], markersize=10, zorder=5)
        print(f"{s['name']:30s}: Surface={s['T']}°C, Dew point={s['Td']}°C -> LCL at {lcl:.2f} km")
    else:
        print(f"{s['name']:30s}: Surface={s['T']}°C, Dew point={s['Td']}°C -> No cloud (too dry)")

ax1.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax1.set_ylabel('Altitude (km)', color='white', fontsize=11)
ax1.set_title('Temperature profile of rising air', color='white', fontsize=13)
ax1.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.set_xlim(-60, 40)
ax1.set_ylim(0, 10)

# Show CCN effect on droplet size
ccn_counts = np.logspace(1, 4, 50)  # 10 to 10000 per cm^3
water_content = 0.3  # g/m^3 liquid water content (constant)
# Volume per droplet = total_water / (n_droplets * density_water)
# V = (4/3)pi*r^3, so r = (3V/(4pi))^(1/3)
droplet_radius = ((3 * water_content * 1e-6) / (4 * np.pi * ccn_counts * 1e6 * 1000))**(1/3) * 1e6  # in micrometers

ax2.semilogx(ccn_counts, droplet_radius, color='#22c55e', linewidth=2.5)
ax2.axhline(y=14, color='#ef4444', linestyle='--', alpha=0.7, label='Rain threshold (~14 μm)')
ax2.fill_between(ccn_counts, 14, droplet_radius, where=droplet_radius > 14,
                  alpha=0.2, color='#3b82f6', label='Can form rain')
ax2.fill_between(ccn_counts, 14, droplet_radius, where=droplet_radius <= 14,
                  alpha=0.2, color='#ef4444', label='Too small for rain')
ax2.set_xlabel('CCN concentration (per cm³)', color='white', fontsize=11)
ax2.set_ylabel('Mean droplet radius (μm)', color='white', fontsize=11)
ax2.set_title('More CCN → smaller droplets → less rain', color='white', fontsize=13)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print()
print("Key insight: During Assam's monsoon, the surface air is so humid")
print("(dew point ~26°C) that the LCL is extremely low — clouds form")
print("just a few hundred meters above the ground. That is why the hills")
print("of Meghalaya disappear into cloud during June-September.")`,
      challenge: 'Add the environmental lapse rate (6.5 °C/km average) to the plot and find where the rising air parcel becomes colder than the environment. That is the equilibrium level — the altitude where clouds stop growing. What happens if the rising air stays warmer than the environment all the way to the tropopause?',
      successHint: 'You have modeled the fundamental physics behind every cloud you see. The difference between a fair-weather puff and a towering thunderstorm comes down to how far the rising air remains warmer than its surroundings — a concept called convective available potential energy (CAPE).',
    },
    {
      title: 'Cloud classification — reading the sky like a book',
      concept: `In 1803, Luke Howard proposed a classification system for clouds that meteorologists still use today. Clouds are organized by **altitude** and **shape**:

**High clouds (above 6 km):**
- **Cirrus (Ci)**: Thin, wispy, made entirely of ice crystals. They form at -40 °C or colder. Often signal an approaching warm front 12-24 hours away.
- **Cirrostratus (Cs)**: Thin sheet covering the sky, creates halos around sun/moon. Warm front approaching.
- **Cirrocumulus (Cc)**: Small white puffs in rows ("mackerel sky"). Rare and short-lived.

**Mid-level clouds (2-6 km):**
- **Altostratus (As)**: Gray/blue sheet, sun appears as a dim disc. Rain often follows within hours.
- **Altocumulus (Ac)**: White/gray patches in waves or rolls. "Mackerel sky" at mid-levels.

**Low clouds (below 2 km):**
- **Stratus (St)**: Uniform gray sheet, drizzle possible. Fog is just stratus at ground level.
- **Stratocumulus (Sc)**: Lumpy gray/white sheet with gaps. The most common cloud type globally.
- **Nimbostratus (Ns)**: Thick, dark, rain-bearing layer. Continuous moderate rain/snow.

**Vertical development (any altitude):**
- **Cumulus (Cu)**: Puffy "cauliflower" clouds with flat bases. Fair weather when small.
- **Cumulonimbus (Cb)**: The king of clouds. Towers from near surface to the tropopause (12-16 km). Produces thunderstorms, heavy rain, hail, lightning, and sometimes tornadoes. The anvil top forms where the rising air hits the tropopause and spreads out.`,
      analogy: 'Cloud classification is like identifying trees. Just as you can distinguish an oak from a pine by its shape, height, and leaves, you can identify cloud types by their altitude, shape (puffy vs. layered), and whether they produce rain. And just as a forester reads a landscape by its tree species, a meteorologist reads the weather by its cloud types.',
      storyConnection: 'The boy who talked to clouds would have seen the full cast of characters over the Brahmaputra Valley. During winter: high cirrus and low stratus. Pre-monsoon (April-May): towering cumulonimbus building each afternoon, bringing violent nor-westers (bordoichila). Monsoon peak (June-August): nimbostratus dumping days of continuous rain, with embedded cumulonimbus bringing downpours. The clouds told him the monsoon story.',
      checkQuestion: 'You see high thin clouds creating a halo around the sun, followed 12 hours later by a thickening gray layer through which the sun is barely visible. What sequence of clouds are you seeing, and what weather is likely coming?',
      checkAnswer: 'Cirrostratus (creating the halo) followed by altostratus (sun dimming to a pale disc). This is the classic warm front approach sequence: Ci -> Cs -> As -> Ns. Within the next 6-12 hours, the altostratus will thicken into nimbostratus and steady rain will begin. This sequence gives 24-36 hours of warning before rain arrives.',
      codeIntro: 'Build a cloud classification chart showing altitude ranges, temperatures, and characteristics of each cloud type.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# Cloud data: name, base_km, top_km, color, shape_type
clouds = [
    # High clouds (ice crystals)
    ("Cirrus (Ci)", 7, 12, "#a5b4fc", "wispy"),
    ("Cirrostratus (Cs)", 6, 10, "#818cf8", "sheet"),
    ("Cirrocumulus (Cc)", 6, 8, "#c7d2fe", "puffs"),
    # Mid clouds
    ("Altostratus (As)", 2.5, 6, "#94a3b8", "sheet"),
    ("Altocumulus (Ac)", 2.5, 5.5, "#cbd5e1", "puffs"),
    # Low clouds
    ("Stratus (St)", 0.1, 1.5, "#9ca3af", "sheet"),
    ("Stratocumulus (Sc)", 0.3, 2, "#d1d5db", "puffs"),
    ("Nimbostratus (Ns)", 0.5, 4, "#4b5563", "sheet"),
    # Vertical development
    ("Cumulus (Cu)", 0.5, 3, "#fbbf24", "puffy"),
    ("Cumulonimbus (Cb)", 0.3, 14, "#f87171", "tower"),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 9), gridspec_kw={'width_ratios': [2, 1]})
fig.patch.set_facecolor('#1f2937')
for ax in [ax1, ax2]:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Altitude zones
ax1.axhspan(0, 2, alpha=0.08, color='#22c55e', label='Low (0-2 km)')
ax1.axhspan(2, 6, alpha=0.08, color='#3b82f6', label='Mid (2-6 km)')
ax1.axhspan(6, 16, alpha=0.08, color='#a855f7', label='High (6+ km)')

# Draw each cloud
x_positions = [1, 2.5, 4, 5.5, 7, 8.5, 10, 11.5, 13, 14.5]
for i, (name, base, top, color, shape) in enumerate(clouds):
    x = x_positions[i]
    width = 1.2 if shape != "tower" else 0.8
    rect = mpatches.FancyBboxPatch((x - width/2, base), width, top - base,
                                     boxstyle="round,pad=0.1",
                                     facecolor=color, alpha=0.6, edgecolor='white', linewidth=1)
    ax1.add_patch(rect)
    # Label
    mid_y = (base + top) / 2
    ax1.text(x, mid_y, name.split('(')[0].strip(), ha='center', va='center',
             fontsize=7, fontweight='bold', color='white', rotation=90 if (top-base) > 4 else 0)
    ax1.text(x, base - 0.3, name.split('(')[1].replace(')', '') if '(' in name else '',
             ha='center', va='top', fontsize=7, color=color)

ax1.set_xlim(0, 16)
ax1.set_ylim(-1, 16)
ax1.set_ylabel('Altitude (km)', color='white', fontsize=12)
ax1.set_title('Cloud Classification by Altitude and Type', color='white', fontsize=14)
ax1.set_xticks([])
ax1.legend(loc='upper right', fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Temperature vs altitude (standard atmosphere)
alt = np.linspace(0, 16, 100)
# Standard tropospheric lapse: 15°C at surface, -6.5°C/km
temp = 15 - 6.5 * alt
ax2.plot(temp, alt, color='#ef4444', linewidth=2.5)
ax2.axhline(y=11, color='#a855f7', linestyle='--', alpha=0.5)
ax2.text(-55, 11.3, 'Tropopause', color='#a855f7', fontsize=9)
ax2.axvline(x=0, color='#3b82f6', linestyle=':', alpha=0.3)
ax2.text(1, 0.5, '0°C', color='#3b82f6', fontsize=8)
# Mark freezing level
freeze_alt = 15 / 6.5
ax2.plot(0, freeze_alt, 'o', color='#3b82f6', markersize=8)
ax2.annotate(f'Freezing level\
{freeze_alt:.1f} km', xy=(0, freeze_alt),
             xytext=(10, freeze_alt+1), color='#3b82f6', fontsize=8,
             arrowprops=dict(arrowstyle='->', color='#3b82f6'))

ax2.set_xlabel('Temperature (°C)', color='white', fontsize=11)
ax2.set_ylabel('Altitude (km)', color='white', fontsize=11)
ax2.set_title('Standard Atmosphere', color='white', fontsize=13)
ax2.set_ylim(-1, 16)

plt.tight_layout()
plt.show()

print("Cloud Classification Summary")
print("=" * 65)
print(f"{'Cloud':<20} {'Base (km)':<12} {'Top (km)':<12} {'Rain?'}")
print("-" * 65)
rain_clouds = {"Nimbostratus (Ns)", "Cumulonimbus (Cb)"}
drizzle_clouds = {"Stratus (St)", "Stratocumulus (Sc)"}
for name, base, top, _, _ in clouds:
    rain = "Heavy" if name in rain_clouds else ("Drizzle" if name in drizzle_clouds else "No")
    print(f"{name:<20} {base:<12.1f} {top:<12.1f} {rain}")

print()
print("The boy's monsoon sky over Assam:")
print("  Pre-monsoon: Cu -> Cb (afternoon thunderstorms / bordoichila)")
print("  Monsoon peak: Ns + embedded Cb (days of rain)")
print("  Winter: St, Sc (low gray overcast, occasional drizzle)")`,
      challenge: 'Add a third panel showing how the cloud base temperature determines whether a cloud contains liquid water, ice crystals, or a mix of both. Mark the "mixed phase" zone between 0 °C and -40 °C where both liquid and ice coexist — this zone is critical for precipitation formation.',
      successHint: 'Every cloud you see in the sky now has a name, an altitude, a temperature, and a story. Luke Howard gave us the vocabulary; the physics of adiabatic cooling from lesson 1 explains why each type forms where it does.',
    },
    {
      title: 'Precipitation physics — why some clouds rain and others do not',
      concept: `A typical cloud droplet is about 10 micrometers (μm) in radius — roughly 100 times smaller than a raindrop (1000 μm = 1 mm). A raindrop contains about **one million** cloud droplets' worth of water. How does a tiny cloud droplet grow a million-fold?

**Warm rain process (collision-coalescence):**
In tropical/warm clouds (entirely above 0 °C), larger droplets fall faster than smaller ones. As they fall, they collide with and absorb smaller droplets — like a snowball rolling downhill. The collection efficiency depends on droplet size: drops below 20 μm barely collide at all (they follow the airflow around each other). Once a drop reaches ~20 μm, collisions accelerate rapidly. A 100 μm drop falls at ~70 cm/s and sweeps up everything in its path. Within 20-30 minutes, million-fold growth occurs and rain falls.

**Ice crystal process (Bergeron-Findeisen):**
In clouds colder than 0 °C (the "mixed phase" zone between 0 °C and -40 °C), ice crystals and supercooled liquid droplets coexist. The key physics: the saturation vapor pressure over ice is **lower** than over liquid water at the same temperature. This means the air can be saturated with respect to ice but unsaturated with respect to liquid. Result: ice crystals grow at the expense of liquid droplets, which evaporate. The ice crystals grow rapidly into snowflakes. If they fall through the freezing level, they melt into raindrops.

**Why some clouds do not rain:** Small cumulus clouds (fair-weather puffs) have weak updrafts and live only 15-20 minutes — not enough time for collision-coalescence to produce raindrop-sized drops. The droplets evaporate back into the atmosphere when the cloud dissipates.`,
      analogy: 'The collision-coalescence process is like traffic on a highway. Small cars (cloud droplets) all travel at similar speeds and rarely collide. But put a slow-moving truck (a large droplet) on the road, and it forces smaller cars to merge into it. The truck grows bigger, moves even slower relative to traffic, and absorbs even more cars. By the time it reaches the exit (cloud base), it is enormous — a raindrop.',
      storyConnection: 'Cherrapunji in Meghalaya receives nearly 12 meters of rain per year. The orographic lifting forces warm, moisture-laden Bay of Bengal air to rise rapidly over the Khasi Hills. The deep clouds have strong updrafts that keep droplets suspended long enough for both collision-coalescence and the Bergeron process to produce enormous raindrops. The boy who talked to clouds would have known which clouds were "ready to rain" by their darkness — optical thickness reveals how much liquid water a cloud holds.',
      checkQuestion: 'A shallow stratocumulus cloud at 1 km altitude has a top temperature of -5 °C. It contains both liquid droplets and a few ice crystals. Which precipitation process dominates, and why might this cloud produce drizzle but not heavy rain?',
      checkAnswer: 'The Bergeron process dominates because ice crystals coexist with supercooled liquid droplets. Ice crystals grow at the expense of the liquid droplets. However, the cloud is shallow (only ~1 km thick) with weak updrafts, so the ice crystals/droplets do not have enough vertical distance or time for extensive growth. Result: small ice particles or drizzle drops, not heavy rain. Deep cumulonimbus clouds (10+ km) allow much more growth time.',
      codeIntro: 'Simulate droplet growth by collision-coalescence and visualize the Bergeron process vapor pressure difference.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Part 1: Collision-coalescence droplet growth ---
def simulate_coalescence(r0_um=15, dt=1, total_time=1800, lwc=0.3e-3):
    """Simulate a collector drop growing by sweeping up cloud droplets.

    r0_um: initial collector drop radius in micrometers
    dt: time step in seconds
    total_time: simulation time in seconds
    lwc: liquid water content in kg/m^3
    """
    r = r0_um * 1e-6  # convert to meters
    rho_w = 1000  # water density kg/m^3
    times = [0]
    radii = [r0_um]

    for t in range(1, total_time + 1):
        # Terminal velocity (Stokes for small drops, empirical for larger)
        if r < 40e-6:
            v_t = (2/9) * rho_w * 9.81 * r**2 / (1.8e-5)  # Stokes law
        else:
            v_t = 8000 * r  # Empirical: v ~ 8 km/s * r for 40-500 um

        # Collection efficiency (increases with drop size)
        E = min(0.95, 0.5 * (r / (100e-6))**0.5) if r > 15e-6 else 0.01

        # Mass growth rate: dm/dt = pi * r^2 * v_t * E * lwc
        dm_dt = np.pi * r**2 * v_t * E * lwc

        # dr/dt from dm/dt = 4*pi*rho*r^2 * dr/dt
        dr_dt = dm_dt / (4 * np.pi * rho_w * r**2)
        r += dr_dt * dt

        if t % 60 == 0:  # record every minute
            times.append(t / 60)
            radii.append(r * 1e6)  # back to micrometers

    return np.array(times), np.array(radii)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Simulate for different initial sizes
for r0, color, label in [(10, '#3b82f6', '10 μm start'),
                          (20, '#22c55e', '20 μm start'),
                          (30, '#f59e0b', '30 μm start')]:
    t, r = simulate_coalescence(r0_um=r0)
    axes[0, 0].plot(t, r, color=color, linewidth=2, label=label)

axes[0, 0].axhline(y=100, color='#ef4444', linestyle='--', alpha=0.7, label='Drizzle (100 μm)')
axes[0, 0].axhline(y=1000, color='#ef4444', linestyle='-', alpha=0.7, label='Raindrop (1000 μm)')
axes[0, 0].set_xlabel('Time (minutes)', color='white')
axes[0, 0].set_ylabel('Drop radius (μm)', color='white')
axes[0, 0].set_title('Collision-coalescence growth', color='white', fontsize=12)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[0, 0].set_yscale('log')
axes[0, 0].set_ylim(5, 5000)

# --- Part 2: Bergeron process — vapor pressure difference ---
T_C = np.linspace(-40, 0, 200)  # Temperature in Celsius
T_K = T_C + 273.15

# Saturation vapor pressure over liquid water (Bolton 1980)
e_liquid = 6.112 * np.exp(17.67 * T_C / (T_C + 243.5))

# Saturation vapor pressure over ice (Murphy & Koop 2005 approx)
e_ice = 6.112 * np.exp(22.46 * T_C / (T_C + 272.62))

# Difference drives Bergeron process
diff = e_liquid - e_ice
supersaturation_pct = (e_liquid / e_ice - 1) * 100

axes[0, 1].plot(T_C, e_liquid, color='#3b82f6', linewidth=2, label='Over liquid water')
axes[0, 1].plot(T_C, e_ice, color='#a855f7', linewidth=2, label='Over ice')
axes[0, 1].fill_between(T_C, e_ice, e_liquid, alpha=0.15, color='#22c55e')
axes[0, 1].set_xlabel('Temperature (°C)', color='white')
axes[0, 1].set_ylabel('Saturation vapor pressure (hPa)', color='white')
axes[0, 1].set_title('Bergeron process: ice vs liquid saturation', color='white', fontsize=12)
axes[0, 1].legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Supersaturation over ice
axes[1, 0].plot(T_C, supersaturation_pct, color='#22c55e', linewidth=2.5)
axes[1, 0].axvline(x=-15, color='#ef4444', linestyle='--', alpha=0.7)
peak_idx = np.argmax(supersaturation_pct)
axes[1, 0].annotate(f'Peak: {supersaturation_pct[peak_idx]:.1f}% at {T_C[peak_idx]:.0f}°C',
                     xy=(T_C[peak_idx], supersaturation_pct[peak_idx]),
                     xytext=(T_C[peak_idx]+8, supersaturation_pct[peak_idx]),
                     color='#22c55e', fontsize=10,
                     arrowprops=dict(arrowstyle='->', color='#22c55e'))
axes[1, 0].set_xlabel('Temperature (°C)', color='white')
axes[1, 0].set_ylabel('Supersaturation over ice (%)', color='white')
axes[1, 0].set_title('Ice crystal growth rate peaks near -15°C', color='white', fontsize=12)

# Raindrop size distribution (Marshall-Palmer)
D_mm = np.linspace(0.1, 6, 100)  # diameter in mm
rain_rates = [2, 10, 50]  # mm/hr
colors_r = ['#3b82f6', '#22c55e', '#f59e0b']
for R, c in zip(rain_rates, colors_r):
    Lambda = 4.1 * R**(-0.21)  # 1/mm
    N_D = 8000 * np.exp(-Lambda * D_mm)  # drops per m^3 per mm
    axes[1, 1].semilogy(D_mm, N_D, color=c, linewidth=2, label=f'{R} mm/hr')

axes[1, 1].set_xlabel('Drop diameter (mm)', color='white')
axes[1, 1].set_ylabel('Number density (m⁻³ mm⁻¹)', color='white')
axes[1, 1].set_title('Marshall-Palmer raindrop distribution', color='white', fontsize=12)
axes[1, 1].legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Precipitation Physics Summary")
print("=" * 55)
print(f"Cloud droplet: ~10 μm radius, falls at ~1 cm/s")
print(f"Drizzle drop:  ~100 μm, falls at ~70 cm/s")
print(f"Raindrop:      ~1000 μm (1 mm), falls at ~6 m/s")
print(f"Large raindrop: ~3000 μm (3 mm), falls at ~8 m/s")
print()
print(f"Growth factor: 1 raindrop = ~1,000,000 cloud droplets")
print(f"Bergeron peak efficiency: {T_C[peak_idx]:.0f}°C (supersaturation {supersaturation_pct[peak_idx]:.1f}%)")
print()
print("Cherrapunji's extreme rain: orographic lifting creates deep")
print("clouds with BOTH processes active — collision-coalescence in")
print("the warm base and Bergeron process in the cold upper portions.")`,
      challenge: 'Modify the coalescence simulation to include a size limit: real raindrops break apart above ~6 mm diameter due to aerodynamic forces. Add breakup and see how it affects the maximum drop size and creates a bimodal size distribution.',
      successHint: 'You now understand why clouds are not all the same — the difference between a harmless puff and a monsoon deluge comes down to cloud depth, updraft strength, and the time available for droplet growth. The physics is elegant: just gravity, surface tension, and thermodynamics.',
    },
    {
      title: 'Weather fronts — where air masses collide',
      concept: `A weather front is the boundary between two air masses with different temperatures and moisture content. Fronts are where the most dramatic weather occurs.

**Cold front:** A cold, dense air mass advances and wedges under warmer air, forcing it upward rapidly. The slope is steep (1:50 to 1:100), so the lifting is vigorous. Effects: tall cumulonimbus clouds, heavy but brief rain/thunderstorms, sharp temperature drop (5-15 °C in an hour), wind shift, pressure trough. The cold front passes quickly (a few hours). After passage: clear skies, lower temperatures, lower humidity.

**Warm front:** Warm air advances and slides up and over the retreating cold air. The slope is gentle (1:200 to 1:300), so the lifting is gradual over hundreds of kilometers. Effects: the classic cloud sequence Ci -> Cs -> As -> Ns, with steady rain lasting 12-24 hours. Temperature rises gradually after passage.

**Occluded front:** When a faster-moving cold front catches up to a warm front, the warm air is lifted entirely off the ground. This creates a complex structure with precipitation from both frontal systems. Common in mature mid-latitude cyclones.

**Frontal precipitation:** The amount of rain depends on (1) how much moisture the warm air carries, (2) how fast and steeply it is lifted, and (3) how long the lifting persists. Cold fronts produce intense bursts; warm fronts produce steady, prolonged rain.`,
      analogy: 'A cold front is like a bulldozer pushing into a pile of sand. The blade (cold air) undercuts the sand (warm air) and forces it upward violently. A warm front is like pouring syrup over a cold plate — the warm, lighter syrup (warm air) slides gently over the cold surface (cold air mass), spreading out slowly over a wide area.',
      storyConnection: 'Assam experiences dramatic frontal weather during the pre-monsoon season (March-May). The nor-westers (bordoichila) are essentially cold fronts: cool, dry air from the northwest collides with the hot, humid air over the Brahmaputra Valley. The forced lifting triggers explosive cumulonimbus development, with violent thunderstorms, hail, and sudden temperature drops. The boy who talked to clouds would have learned to read the signs — a dark wall of cloud on the northwest horizon, a sudden cool breeze, the smell of rain.',
      checkQuestion: 'After a cold front passes through Guwahati, the temperature drops 10 °C in one hour and the sky clears. Twelve hours later, thin cirrus clouds appear from the west. What is likely happening and what weather should you expect in the next 24 hours?',
      checkAnswer: 'The cirrus clouds signal an approaching warm front from the west. The sequence will be: Ci -> Cs (halos around sun/moon) -> As (sun dimming) -> Ns (steady rain). Within 18-24 hours, steady rain will begin as the warm front arrives. After the warm front passes, temperatures will rise and humidity will increase. This is the classic mid-latitude cyclone pattern: cold front followed by warm front of the next system.',
      codeIntro: 'Model the structure of cold and warm fronts and simulate the temperature and precipitation patterns as they pass over a location.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# --- Cross-section of a cold front ---
ax = axes[0, 0]
x = np.linspace(-200, 200, 1000)  # km from front position

# Cold front slope ~1:50
front_height_cold = np.where(x < 0, -x / 50, 0)
front_height_cold = np.clip(front_height_cold, 0, 10)

# Cold air (blue region)
ax.fill_between(x, 0, front_height_cold, alpha=0.4, color='#3b82f6', label='Cold air')
# Warm air above and ahead
warm_base = np.where(x < 0, front_height_cold, 0)
ax.fill_between(x, warm_base, 12, alpha=0.2, color='#ef4444', label='Warm air')

# Clouds along the front
for cx, cy, s in [(-30, 7, 1200), (-50, 8, 1000), (-20, 5, 800), (-10, 3, 600)]:
    ax.scatter(cx, cy, s=s, color='white', alpha=0.5, marker='o')

# Arrows showing air motion
for xi in [-100, -60, -20]:
    ax.annotate('', xy=(xi+30, 0.5), xytext=(xi, 0.5),
                arrowprops=dict(arrowstyle='->', color='#3b82f6', lw=2))
for xi in [-50, -30, -10]:
    yi = -xi/50
    ax.annotate('', xy=(xi, yi+2), xytext=(xi, yi+0.5),
                arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2))

ax.axvline(x=0, color='#3b82f6', linewidth=3, label='Cold front')
ax.set_xlabel('Distance from front (km)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Cold Front Cross-Section', color='white', fontsize=13)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 13)

# --- Cross-section of a warm front ---
ax = axes[0, 1]

# Warm front slope ~1:200
front_height_warm = np.where(x > 0, x / 200, 0)
front_height_warm = np.clip(front_height_warm, 0, 8)

ax.fill_between(x, 0, np.where(x > 0, 0, 0.5), alpha=0.4, color='#3b82f6', label='Cold air')
ax.fill_between(x, 0, 8, alpha=0.1, color='#3b82f6')
ax.fill_between(x, front_height_warm, 12, alpha=0.2, color='#ef4444', label='Warm air (overriding)')

# Cloud sequence
cloud_labels = ['Ns', 'As', 'Cs', 'Ci']
cloud_positions = [(20, 2), (80, 4), (140, 6.5), (190, 8)]
for (cx, cy), label in zip(cloud_positions, cloud_labels):
    ax.scatter(cx, cy, s=800, color='white', alpha=0.4, marker='o')
    ax.text(cx, cy-0.6, label, ha='center', color='white', fontsize=8, fontweight='bold')

ax.axvline(x=0, color='#ef4444', linewidth=3, label='Warm front (surface)')
# Rain below
for rx in range(10, 60, 8):
    ax.plot([rx, rx-2], [1.5, 0.3], color='#3b82f6', linewidth=0.5, alpha=0.5)

ax.set_xlabel('Distance from front (km)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Warm Front Cross-Section', color='white', fontsize=13)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 13)

# --- Time series: cold front passage ---
ax = axes[1, 0]
hours = np.linspace(-12, 12, 200)
# Temperature: warm before, sharp drop at front, cool after
temp = 32 - 5 * (1 + np.tanh(hours * 2)) / 2  # sigmoid drop
temp += np.random.randn(len(hours)) * 0.3
# Pressure: dips at front
pressure = 1008 - 4 * np.exp(-hours**2 / 2) + 2 * np.tanh(hours)
# Rain: brief intense burst near front
rain = 15 * np.exp(-((hours + 0.5)**2) / 0.5) + 3 * np.exp(-((hours)**2) / 0.3)

ax_t = ax
ax_p = ax.twinx()
ax_t.plot(hours, temp, color='#ef4444', linewidth=2, label='Temperature (°C)')
ax_p.plot(hours, pressure, color='#3b82f6', linewidth=2, linestyle='--', label='Pressure (hPa)')
ax_t.fill_between(hours, 0, rain, alpha=0.3, color='#22c55e', label='Rain (mm/hr)')
ax_t.axvline(x=0, color='white', linewidth=2, alpha=0.5, label='Front passage')

ax_t.set_xlabel('Hours from front passage', color='white')
ax_t.set_ylabel('Temp (°C) / Rain (mm/hr)', color='#ef4444')
ax_p.set_ylabel('Pressure (hPa)', color='#3b82f6')
ax_p.tick_params(colors='#3b82f6')
ax_t.set_title('Cold Front Passage (Guwahati bordoichila)', color='white', fontsize=12)
lines_t, labels_t = ax_t.get_legend_handles_labels()
lines_p, labels_p = ax_p.get_legend_handles_labels()
ax_t.legend(lines_t + lines_p, labels_t + labels_p, fontsize=7,
            facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')

# --- Time series: warm front passage ---
ax = axes[1, 1]
# Temperature: gradual rise
temp_w = 22 + 4 * (1 + np.tanh((hours - 1) * 0.5)) / 2
temp_w += np.random.randn(len(hours)) * 0.2
# Pressure: steady fall then level
pressure_w = 1012 - 3 * (1 + np.tanh(-hours * 0.3)) / 2
# Rain: steady, prolonged, lighter
rain_w = 4 * np.exp(-((hours + 2)**2) / 20) * (hours < 3)
rain_w = np.clip(rain_w, 0, None)

ax_t2 = ax
ax_p2 = ax.twinx()
ax_t2.plot(hours, temp_w, color='#ef4444', linewidth=2, label='Temperature (°C)')
ax_p2.plot(hours, pressure_w, color='#3b82f6', linewidth=2, linestyle='--', label='Pressure (hPa)')
ax_t2.fill_between(hours, 0, rain_w, alpha=0.3, color='#22c55e', label='Rain (mm/hr)')
ax_t2.axvline(x=0, color='white', linewidth=2, alpha=0.5, label='Front passage')

ax_t2.set_xlabel('Hours from front passage', color='white')
ax_t2.set_ylabel('Temp (°C) / Rain (mm/hr)', color='#ef4444')
ax_p2.set_ylabel('Pressure (hPa)', color='#3b82f6')
ax_p2.tick_params(colors='#3b82f6')
ax_t2.set_title('Warm Front Passage', color='white', fontsize=12)
lines_t2, labels_t2 = ax_t2.get_legend_handles_labels()
lines_p2, labels_p2 = ax_p2.get_legend_handles_labels()
ax_t2.legend(lines_t2 + lines_p2, labels_t2 + labels_p2, fontsize=7,
             facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')

plt.tight_layout()
plt.show()

print("Weather Fronts Summary")
print("=" * 60)
print(f"{'Property':<25} {'Cold Front':<18} {'Warm Front'}")
print("-" * 60)
print(f"{'Slope':<25} {'1:50 (steep)':<18} {'1:200 (gentle)'}")
print(f"{'Speed':<25} {'30-50 km/hr':<18} {'15-30 km/hr'}")
print(f"{'Cloud type':<25} {'Cb (towering)':<18} {'Ci->Cs->As->Ns'}")
print(f"{'Rain style':<25} {'Heavy, brief':<18} {'Steady, prolonged'}")
print(f"{'Temp change':<25} {'Sharp drop':<18} {'Gradual rise'}")
print(f"{'Duration':<25} {'2-4 hours':<18} {'12-24 hours'}")
print()
print("Assam's bordoichila (nor'westers) are cold-front-like squall lines")
print("that produce the most violent pre-monsoon thunderstorms in India.")`,
      challenge: 'Add an occluded front model by combining the cold and warm front profiles. Show how the warm air gets lifted entirely off the surface when the cold front overtakes the warm front. What happens to the precipitation pattern?',
      successHint: 'Weather fronts are the engine of mid-latitude weather. Every forecast you see on TV showing approaching rain is tracking these boundaries between air masses. The frontal model was developed by the Bergen School in Norway around 1920 and remains the foundation of weather analysis.',
    },
    {
      title: 'The Indian monsoon — the greatest weather system on Earth',
      concept: `The Indian monsoon affects 1.4 billion people and is the most powerful seasonal wind reversal on Earth. Understanding it requires connecting all the physics from the previous lessons.

**Why it happens — differential heating:**
In summer, the Asian landmass heats up much faster than the Indian Ocean (land has lower heat capacity). The hot land creates a thermal low-pressure zone over northwest India/Pakistan (the monsoon trough). Meanwhile, the Indian Ocean remains relatively cool with higher pressure. Air flows from high pressure (ocean) to low pressure (land) — this is the monsoon wind. But the Coriolis effect deflects these south-to-north winds to the right, creating the southwest monsoon.

**The role of the Himalayas:**
Without the Himalayas, the monsoon would be weaker. The mountains do three critical things: (1) block cold, dry air from Central Asia from reaching India, (2) force the warm, moist monsoon air upward (orographic lifting), producing extreme rainfall on the southern slopes, and (3) create a thermal barrier that intensifies the land-sea temperature contrast.

**Monsoon onset and withdrawal:**
- Onset: Reaches Kerala around June 1 (±7 days), advances northward, covers all of India by mid-July
- Peak: July-August (Assam receives 60-70% of annual rainfall in these two months)
- Withdrawal: Begins retreating from northwest India in September, leaves Assam by mid-October

**Cherrapunji and Mawsynram:**
Mawsynram (11,871 mm/year) and Cherrapunji (11,777 mm/year) in Meghalaya receive the world's highest rainfall. The mechanism: the Khasi Hills form a funnel-shaped valley that channels and concentrates the monsoon flow, forcing it up a steep escarpment. The air rises 1300 m in just a few kilometers — extreme orographic lifting.`,
      analogy: 'The monsoon is like opening a refrigerator door on a hot day. The cool air (ocean) rushes toward the warm room (land), carrying moisture with it. The Himalayas are like a wall behind the room — the air has nowhere to go but up, and as it rises, it dumps its moisture as rain. Close the door in winter (land cools), and the flow reverses.',
      storyConnection: 'For the boy who talked to clouds, the monsoon was not an abstract weather system — it was his entire world for four months. The Brahmaputra rises 5-8 meters during peak monsoon, flooding vast areas of Assam. Majuli, the world\'s largest river island, shrinks every year as monsoon floods erode its banks. The boy would have watched the first monsoon clouds build over the southern horizon in late May, knowing that within weeks, the river would transform from a calm waterway to a roaring flood.',
      checkQuestion: 'If the Himalayas were removed, how would the Indian monsoon change? Consider both the blocking effect and the orographic lifting.',
      checkAnswer: 'Without the Himalayas: (1) Cold, dry Siberian air would flow into India year-round, weakening the land-sea thermal contrast that drives the monsoon. (2) Orographic rainfall along the Himalayan foothills (including Cherrapunji) would disappear. (3) The monsoon would still exist (differential heating remains) but would be much weaker — perhaps 40-60% of current rainfall. (4) Assam and northeast India would be drier. Climate models confirm this: removing Himalayan topography dramatically reduces South Asian monsoon rainfall.',
      codeIntro: 'Visualize the monsoon system: differential heating, wind patterns, and monthly rainfall distribution for Assam and Cherrapunji.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
month_nums = np.arange(12)

# --- Panel 1: Land vs Ocean temperature ---
ax = axes[0, 0]
# Approximate monthly mean temperatures
land_temp = np.array([15, 18, 24, 30, 34, 35, 33, 32, 31, 28, 22, 17])  # NW India
ocean_temp = np.array([26, 26.5, 27.5, 28.5, 29, 28.5, 27.5, 27, 27.5, 28, 27.5, 26.5])  # Arabian Sea

ax.plot(month_nums, land_temp, 'o-', color='#ef4444', linewidth=2.5, markersize=8, label='Land (NW India)')
ax.plot(month_nums, ocean_temp, 's-', color='#3b82f6', linewidth=2.5, markersize=8, label='Ocean (Arabian Sea)')
ax.fill_between(month_nums, ocean_temp, land_temp,
                where=land_temp > ocean_temp, alpha=0.15, color='#ef4444', label='Land warmer (SW monsoon)')
ax.fill_between(month_nums, ocean_temp, land_temp,
                where=land_temp <= ocean_temp, alpha=0.15, color='#3b82f6', label='Ocean warmer (NE monsoon)')
ax.set_xticks(month_nums)
ax.set_xticklabels(months, color='gray')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Differential Heating: Monsoon Engine', color='white', fontsize=13)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 2: Monthly rainfall comparison ---
ax = axes[0, 1]
# Approximate monthly rainfall (mm)
cherrapunji = np.array([15, 40, 150, 610, 1270, 2540, 2640, 1780, 1170, 430, 50, 15])
guwahati = np.array([8, 15, 40, 140, 270, 320, 370, 280, 220, 120, 18, 5])
delhi = np.array([18, 20, 15, 10, 25, 60, 210, 240, 130, 20, 5, 10])

x = np.arange(12)
w = 0.25
ax.bar(x - w, cherrapunji, w, color='#3b82f6', label='Cherrapunji', alpha=0.8)
ax.bar(x, guwahati, w, color='#22c55e', label='Guwahati', alpha=0.8)
ax.bar(x + w, delhi, w, color='#f59e0b', label='Delhi', alpha=0.8)

# Monsoon onset markers
ax.axvline(x=5, color='#ef4444', linestyle='--', alpha=0.5)
ax.text(5.1, 2500, 'Monsoon\
onset', color='#ef4444', fontsize=8)
ax.axvline(x=9, color='#a855f7', linestyle='--', alpha=0.5)
ax.text(9.1, 2500, 'Withdrawal', color='#a855f7', fontsize=8)

ax.set_xticks(month_nums)
ax.set_xticklabels(months, color='gray')
ax.set_ylabel('Rainfall (mm)', color='white')
ax.set_title('Monthly Rainfall: Three Indian Cities', color='white', fontsize=13)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 3: Orographic lifting profile (Meghalaya) ---
ax = axes[1, 0]
# Simplified terrain profile: Bangladesh floodplain -> Khasi Hills
distance = np.linspace(0, 80, 500)  # km from south
terrain = np.zeros_like(distance)
# Steep escarpment
mask = (distance > 20) & (distance < 35)
terrain[mask] = 1400 * (distance[mask] - 20) / 15  # steep rise
mask2 = distance >= 35
terrain[mask2] = 1400 + 100 * np.sin((distance[mask2] - 35) * 0.2)  # plateau

ax.fill_between(distance, 0, terrain, color='#854d0e', alpha=0.6, label='Terrain')
ax.fill_between(distance, 0, 10, color='#3b82f6', alpha=0.05)

# Wind arrows
for d in [5, 12, 18]:
    ax.annotate('', xy=(d+8, 300), xytext=(d, 200),
                arrowprops=dict(arrowstyle='->', color='#22c55e', lw=2.5))
# Lifting arrows
for d in [22, 26, 30]:
    y_base = 1400 * (d - 20) / 15
    ax.annotate('', xy=(d, y_base + 800), xytext=(d, y_base + 100),
                arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2))

# Rain
for d in np.arange(24, 38, 2):
    y_top = min(1400, 1400 * max(0, d-20) / 15) + 1200
    for y in np.arange(y_top, terrain[np.argmin(np.abs(distance-d))] + 50, -100):
        ax.plot([d, d-0.5], [y, y-80], color='#3b82f6', linewidth=0.8, alpha=0.5)

ax.text(10, 500, 'Moist monsoon\
wind from\
Bay of Bengal', color='#22c55e', fontsize=9, ha='center')
ax.text(30, 2200, 'Extreme\
orographic\
lifting', color='#ef4444', fontsize=9, ha='center')
ax.text(50, 1800, 'CHERRAPUNJI', color='white', fontsize=10, fontweight='bold', ha='center')

ax.set_xlabel('Distance from Bangladesh border (km)', color='white')
ax.set_ylabel('Altitude (m)', color='white')
ax.set_title('Orographic Rainfall: Meghalaya Cross-Section', color='white', fontsize=13)
ax.set_ylim(0, 3000)

# --- Panel 4: Cumulative rainfall and Brahmaputra water level ---
ax = axes[1, 1]
# Cumulative rainfall for Cherrapunji
cumulative = np.cumsum(cherrapunji)
ax.plot(month_nums, cumulative, 'o-', color='#3b82f6', linewidth=2.5, markersize=6, label='Cumulative rain (mm)')

ax2 = ax.twinx()
# Approximate Brahmaputra water level at Guwahati (m above low-water mark)
brahmaputra = np.array([0.5, 0.3, 0.5, 1.5, 3.5, 6.0, 7.5, 7.0, 5.5, 3.0, 1.5, 0.8])
ax2.plot(month_nums, brahmaputra, 's-', color='#ef4444', linewidth=2.5, markersize=6, label='Brahmaputra level (m)')
ax2.axhline(y=6.5, color='#f59e0b', linestyle='--', alpha=0.7)
ax2.text(0.5, 6.7, 'Danger level', color='#f59e0b', fontsize=8)

ax.set_xticks(month_nums)
ax.set_xticklabels(months, color='gray')
ax.set_ylabel('Cumulative rainfall (mm)', color='#3b82f6')
ax2.set_ylabel('River level above low-water (m)', color='#ef4444')
ax2.tick_params(colors='#ef4444')
ax.set_title('Monsoon Impact: Rainfall & Brahmaputra Floods', color='white', fontsize=12)

lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax.legend(lines1 + lines2, labels1 + labels2, fontsize=8,
          facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Indian Monsoon Summary")
print("=" * 55)
print(f"Cherrapunji annual rainfall: {sum(cherrapunji):,} mm ({sum(cherrapunji)/1000:.1f} m)")
print(f"Guwahati annual rainfall:    {sum(guwahati):,} mm")
print(f"Delhi annual rainfall:       {sum(delhi):,} mm")
print()
print(f"Monsoon contribution (Jun-Sep):")
print(f"  Cherrapunji: {sum(cherrapunji[5:9])/sum(cherrapunji)*100:.0f}% of annual total")
print(f"  Guwahati:    {sum(guwahati[5:9])/sum(guwahati)*100:.0f}% of annual total")
print(f"  Delhi:        {sum(delhi[5:9])/sum(delhi)*100:.0f}% of annual total")
print()
print(f"Brahmaputra peak level: {max(brahmaputra):.1f} m above low-water mark")
print(f"That is a {max(brahmaputra) - min(brahmaputra):.1f} m annual range — one of")
print(f"the largest river level fluctuations in the world.")`,
      challenge: 'Add a simple model of the Coriolis effect to show why surface winds approach India from the southwest during summer monsoon but from the northeast during winter. Use a vector field plot with latitude on the y-axis.',
      successHint: 'The monsoon is not random weather — it is a predictable, large-scale circulation driven by fundamental physics (differential heating + Earth\'s rotation + topography). Understanding this system is literally a matter of life and death for hundreds of millions of farmers across South Asia.',
    },
    {
      title: 'Weather prediction — from pattern recognition to chaos theory',
      concept: `Weather prediction is one of humanity's greatest scientific achievements. We have gone from folklore to physics-based forecasts that are accurate 7-10 days ahead. Here is how:

**Synoptic analysis (1860s-present):**
Plot weather observations (temperature, pressure, wind, clouds) on a map and identify patterns: highs, lows, fronts, troughs. Forecasters extrapolate these patterns forward in time. Still used today as a first check on computer models.

**Numerical Weather Prediction (NWP, 1950s-present):**
The atmosphere obeys the laws of physics: Newton's laws of motion, thermodynamics, conservation of mass and moisture. NWP discretizes the atmosphere into a 3D grid (currently ~10 km horizontal resolution for global models) and solves these equations forward in time using supercomputers. Major models:
- **GFS** (Global Forecast System, USA): ~13 km resolution, runs 4x daily
- **ECMWF** (European Centre): ~9 km resolution, consistently the world's best global model
- **IMD GFS** (India): India Meteorological Department's operational model for monsoon forecasting

**Ensemble forecasting (1990s-present):**
A single forecast is fragile — tiny errors in initial conditions grow exponentially (chaos theory). Solution: run the model 20-50 times with slightly different starting conditions. If all 50 runs agree, confidence is high. If they diverge, confidence is low. The "spread" of the ensemble quantifies forecast uncertainty.

**The butterfly effect (chaos):**
Edward Lorenz discovered in 1963 that deterministic atmospheric equations are highly sensitive to initial conditions. A butterfly flapping its wings in Brazil could, in principle, alter the trajectory of a tornado in Texas weeks later. This sets a fundamental limit on weather predictability: about 10-14 days. Beyond that, individual weather events are unpredictable (though climate averages remain predictable).`,
      analogy: 'Numerical weather prediction is like simulating a billiard game. If you know the exact position and velocity of every ball, you can predict the next few shots perfectly. But tiny measurement errors accumulate with each collision, so after 10-15 collisions, your prediction is useless. The atmosphere is a billiard table with 10^20 "balls" (molecules), making long-range prediction fundamentally limited.',
      storyConnection: 'The India Meteorological Department (IMD) issues monsoon onset forecasts for Kerala and long-range seasonal rainfall predictions for Assam. These forecasts determine when farmers plant rice, when the government pre-positions flood relief supplies, and when schools schedule holidays. The boy who talked to clouds was doing his own forecasting — reading cloud types, wind shifts, and humidity changes. Modern NWP does the same thing, but with physics equations running on supercomputers instead of intuition.',
      checkQuestion: 'An ensemble forecast for Guwahati shows 45 out of 50 runs predicting heavy rain in 3 days, but only 15 out of 50 runs predicting rain in 7 days. What does this tell you about forecast confidence at each time horizon?',
      checkAnswer: 'At 3 days: 90% of ensemble members agree on heavy rain — very high confidence. You should prepare for flooding. At 7 days: only 30% predict rain — low confidence, the outcome is uncertain. The ensemble spread has grown (chaos), and the atmosphere could evolve along many different paths. This is why weather forecasts include probability: "90% chance of rain Tuesday, 30% chance Sunday."',
      codeIntro: 'Demonstrate the Lorenz attractor (chaos), ensemble forecasting, and forecast skill degradation with lead time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure(figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# --- Panel 1: Lorenz attractor ---
ax1 = fig.add_subplot(221, projection='3d')
ax1.set_facecolor('#111827')

def lorenz(state, sigma=10, rho=28, beta=8/3):
    x, y, z = state
    return np.array([sigma*(y-x), x*(rho-z)-y, x*y-beta*z])

def integrate_lorenz(initial, dt=0.01, steps=5000):
    trajectory = np.zeros((steps, 3))
    trajectory[0] = initial
    for i in range(1, steps):
        trajectory[i] = trajectory[i-1] + lorenz(trajectory[i-1]) * dt
    return trajectory

# Two trajectories with tiny difference in initial conditions
traj1 = integrate_lorenz([1.0, 1.0, 1.0])
traj2 = integrate_lorenz([1.0, 1.0, 1.001])  # epsilon = 0.001

ax1.plot(traj1[:, 0], traj1[:, 1], traj1[:, 2], color='#3b82f6', linewidth=0.3, alpha=0.7)
ax1.plot(traj2[:, 0], traj2[:, 1], traj2[:, 2], color='#ef4444', linewidth=0.3, alpha=0.7)
ax1.set_title('Lorenz Attractor (chaos)', color='white', fontsize=11, pad=10)
ax1.tick_params(colors='gray', labelsize=6)
ax1.xaxis.pane.fill = False
ax1.yaxis.pane.fill = False
ax1.zaxis.pane.fill = False

# --- Panel 2: Divergence over time ---
ax2 = fig.add_subplot(222)
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')

# Distance between trajectories over time
dist = np.sqrt(np.sum((traj1 - traj2)**2, axis=1))
time = np.arange(len(dist)) * 0.01

ax2.semilogy(time, dist, color='#22c55e', linewidth=1.5)
ax2.axhline(y=0.001, color='#3b82f6', linestyle='--', alpha=0.5, label='Initial separation')
ax2.set_xlabel('Time (Lorenz units)', color='white')
ax2.set_ylabel('Distance between trajectories', color='white')
ax2.set_title('Butterfly Effect: Exponential Divergence', color='white', fontsize=11)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 3: Ensemble forecast simulation ---
ax3 = fig.add_subplot(223)
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')

np.random.seed(42)
n_members = 30
forecast_days = 14
dt_day = 1

# Simple chaotic temperature model
def forecast_temp(T0, days, noise_scale=0.1):
    """Toy model: temperature with chaotic drift."""
    temps = [T0]
    for d in range(1, days + 1):
        # Persistence + seasonal tendency + chaos
        dT = 0.1 * np.sin(d * 0.3) + noise_scale * np.random.randn() * np.sqrt(d)
        temps.append(temps[-1] + dT)
    return np.array(temps)

days = np.arange(forecast_days + 1)
T_obs = 28  # observed temperature today in Guwahati

# Generate ensemble
ensemble = []
for i in range(n_members):
    T0_perturbed = T_obs + np.random.randn() * 0.3  # perturb initial condition
    member = forecast_temp(T0_perturbed, forecast_days, noise_scale=0.8)
    ensemble.append(member)
    ax3.plot(days, member, color='#3b82f6', linewidth=0.5, alpha=0.3)

ensemble = np.array(ensemble)
mean_forecast = np.mean(ensemble, axis=0)
std_forecast = np.std(ensemble, axis=0)

ax3.plot(days, mean_forecast, color='#ef4444', linewidth=2.5, label='Ensemble mean')
ax3.fill_between(days, mean_forecast - 2*std_forecast, mean_forecast + 2*std_forecast,
                  alpha=0.15, color='#f59e0b', label='95% confidence')
ax3.plot(0, T_obs, 'o', color='#22c55e', markersize=10, zorder=5, label='Observation')
ax3.set_xlabel('Forecast day', color='white')
ax3.set_ylabel('Temperature (°C)', color='white')
ax3.set_title(f'Ensemble Forecast: {n_members} Members (Guwahati)', color='white', fontsize=11)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# --- Panel 4: Forecast skill vs lead time ---
ax4 = fig.add_subplot(224)
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')

lead_days = np.arange(1, 15)
# Approximate forecast skill (correlation with observations)
# Based on real NWP verification statistics
skill_ecmwf = 0.98 * np.exp(-lead_days * 0.12)
skill_gfs = 0.96 * np.exp(-lead_days * 0.14)
skill_persistence = 0.85 * np.exp(-lead_days * 0.25)
skill_climatology = np.full_like(lead_days, 0.3, dtype=float)

ax4.plot(lead_days, skill_ecmwf, 'o-', color='#3b82f6', linewidth=2, label='ECMWF (best global)')
ax4.plot(lead_days, skill_gfs, 's-', color='#22c55e', linewidth=2, label='GFS (USA)')
ax4.plot(lead_days, skill_persistence, '^-', color='#f59e0b', linewidth=2, label='Persistence (tomorrow=today)')
ax4.plot(lead_days, skill_climatology, '--', color='#9ca3af', linewidth=2, label='Climatology (average)')
ax4.axhline(y=0.5, color='#ef4444', linestyle=':', alpha=0.5)
ax4.text(12, 0.52, 'Useful skill threshold', color='#ef4444', fontsize=8)

ax4.set_xlabel('Forecast lead time (days)', color='white')
ax4.set_ylabel('Correlation skill', color='white')
ax4.set_title('Forecast Skill Degrades with Lead Time', color='white', fontsize=11)
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.set_ylim(0, 1.05)

plt.tight_layout()
plt.show()

print("Weather Prediction Summary")
print("=" * 55)
print(f"Lorenz system: initial separation of 0.001 grows to {dist[-1]:.1f}")
print(f"That is a {dist[-1]/0.001:.0f}x amplification — the butterfly effect.")
print()
print("Forecast skill (approximate days of useful prediction):")
print(f"  ECMWF:       ~{np.searchsorted(-skill_ecmwf, -0.5)+1} days")
print(f"  GFS:         ~{np.searchsorted(-skill_gfs, -0.5)+1} days")
print(f"  Persistence: ~{np.searchsorted(-skill_persistence, -0.5)+1} days")
print()
print("Ensemble spread at day 7: ±{:.1f}°C (95% confidence interval: {:.1f}°C wide)".format(
    std_forecast[7], 4*std_forecast[7]))
print("Ensemble spread at day 14: ±{:.1f}°C (nearly useless)".format(std_forecast[14]))
print()
print("Key insight: weather is predictable for ~10 days.")
print("Climate (30-year averages) is predictable indefinitely.")
print("The monsoon WILL come — we just cannot say the exact date.")`,
      challenge: 'Modify the Lorenz system to explore sensitivity: try sigma=10, rho=28, beta=8/3 (chaotic) vs sigma=10, rho=15, beta=8/3 (non-chaotic). Plot both and show that below a critical rho value, the system settles to a fixed point — no chaos. This is the bifurcation that Lorenz discovered.',
      successHint: 'You have traveled from the physics of a single cloud droplet to the limits of predictability imposed by chaos theory. Weather prediction is the most successful application of physics to a complex real-world system. Every forecast you check on your phone represents the work of thousands of scientists and the most powerful supercomputers on Earth.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Meteorology & Weather Science
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (data analysis fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real meteorology simulations. Click to start.</p>
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
