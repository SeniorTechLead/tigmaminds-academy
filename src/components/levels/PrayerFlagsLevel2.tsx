import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PrayerFlagsLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plotting the fading curve — color loss over time',
      concept: `Color fading follows a characteristic curve: rapid initial loss, then slower continued fading. This is **first-order kinetics** — the rate of color loss is proportional to the remaining color:

**C(t) = C₀ × e^(-kt)**

Where C = color intensity (0-100%), k = fading rate constant, t = time.

Different colors fade at different rates because their dye molecules have different UV sensitivities. For traditional prayer flag dyes:
- **Yellow** (turmeric-based): fastest fading (k ≈ 0.15/month)
- **Red** (lac/alizarin): medium (k ≈ 0.10/month)
- **Green** (indigo + turmeric mix): medium-fast (k ≈ 0.12/month)
- **Blue** (indigo): slowest (k ≈ 0.06/month)
- **White**: no fading (no dye)

The fading constants also depend on season — monsoon accelerates fading 2-3× due to moisture synergy.

📚 *We will use matplotlib to plot fading curves and compare dye stability.*`,
      analogy: 'Color fading is like ice melting on a warm day. The more ice you have (more color), the faster it melts (more UV-absorbing molecules to degrade). As the ice shrinks, the melting slows. That is why fading is rapid at first and gradual later — the exponential decay curve.',
      storyConnection: 'Visitors to Sikkim notice that prayer flags progress through a beautiful gradient: fresh vibrant flags near new ones that are almost translucent white. This gradient IS the fading curve — each flag is at a different point on the exponential, creating a visual timeline of UV exposure.',
      checkQuestion: 'If yellow has k = 0.15/month, how long until it loses 90% of its color?',
      checkAnswer: 'C/C₀ = 0.10 = e^(-0.15t), so -0.15t = ln(0.10) = -2.30, t = 2.30/0.15 = 15.3 months. Yellow loses 90% of its color in about 15 months. Blue (k = 0.06) takes 2.30/0.06 = 38 months — 2.5× longer. This is why old prayer flags appear blue-ish — the yellow and red have faded, leaving the slowest-fading blue.',
      codeIntro: 'Plot fading curves for all five prayer flag colors with seasonal variation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fading model for each color
colors_data = {
    'Yellow': {'k_dry': 0.12, 'k_monsoon': 0.30, 'initial': 100, 'color': '#f59e0b'},
    'Red':    {'k_dry': 0.08, 'k_monsoon': 0.20, 'initial': 100, 'color': '#ef4444'},
    'Green':  {'k_dry': 0.10, 'k_monsoon': 0.25, 'initial': 100, 'color': '#22c55e'},
    'Blue':   {'k_dry': 0.05, 'k_monsoon': 0.12, 'initial': 100, 'color': '#3b82f6'},
}

# Simulate 24 months with seasonal variation
months = np.arange(0, 25)
month_names_cycle = ['J','F','M','A','M','J','J','A','S','O','N','D'] * 3
monsoon_months = [5, 6, 7, 8]  # June-September (0-indexed)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Prayer Flag Color Fading — Sikkim', color='white', fontsize=14, fontweight='bold')

# Panel 1: Constant rate (theoretical)
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
t_cont = np.linspace(0, 24, 200)
for name, data in colors_data.items():
    C = data['initial'] * np.exp(-data['k_dry'] * t_cont)
    ax.plot(t_cont, C, color=data['color'], linewidth=2.5, label=name)
ax.set_xlabel('Months', color='white', fontsize=11)
ax.set_ylabel('Color Intensity (%)', color='white', fontsize=11)
ax.set_title('Theoretical Fading (constant UV)', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Realistic (seasonal variation)
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
# Add monsoon bands
for year in range(2):
    start = 5 + year * 12
    ax.axvspan(start, start + 4, alpha=0.15, color='#3b82f6')

for name, data in colors_data.items():
    C = data['initial']
    C_history = [C]
    for m in range(24):
        month_of_year = m % 12
        if month_of_year in monsoon_months:
            k = data['k_monsoon']
        else:
            k = data['k_dry']
        C = C * np.exp(-k)
        C_history.append(C)
    ax.plot(range(25), C_history, color=data['color'], linewidth=2.5, label=name)

ax.set_xlabel('Months', color='white', fontsize=11)
ax.set_title('Realistic Fading (monsoon = blue bands)', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Half-life comparison
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
half_lives = {}
for name, data in colors_data.items():
    # Effective k (weighted average: 4 months monsoon, 8 months dry)
    k_eff = (8 * data['k_dry'] + 4 * data['k_monsoon']) / 12
    t_half = np.log(2) / k_eff
    half_lives[name] = t_half

names = list(half_lives.keys())
values = list(half_lives.values())
bars = ax.barh(names, values, color=[colors_data[n]['color'] for n in names], alpha=0.8)
for bar, val in zip(bars, values):
    ax.text(bar.get_width() + 0.2, bar.get_y() + bar.get_height()/2,
            f'{val:.1f} mo', va='center', color='white', fontsize=10)
ax.set_xlabel('Half-life (months)', color='white', fontsize=11)
ax.set_title('Color Half-life (50% fading)', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='x')

# Panel 4: Visual flag representation at different ages
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
ages = [0, 3, 6, 12, 18, 24]
flag_order = ['Blue', 'White', 'Red', 'Green', 'Yellow']
white_base = np.array([240, 240, 240])

for i, age in enumerate(ages):
    for j, name in enumerate(flag_order):
        if name == 'White':
            rgb = white_base / 255
        else:
            data = colors_data[name]
            k_eff = (8 * data['k_dry'] + 4 * data['k_monsoon']) / 12
            fade = np.exp(-k_eff * age)
            # Blend toward white as color fades
            orig_rgb = np.array([int(data['color'][k:k+2], 16) for k in (1,3,5)])
            faded_rgb = orig_rgb * fade + white_base * (1 - fade)
            rgb = faded_rgb / 255

        ax.add_patch(plt.Rectangle((i*1.2, j*0.6), 1, 0.5, facecolor=rgb, edgecolor='gray', linewidth=0.5))

    ax.text(i*1.2 + 0.5, -0.3, f'{age}mo', ha='center', color='white', fontsize=9)

ax.set_xlim(-0.2, len(ages)*1.2)
ax.set_ylim(-0.6, len(flag_order)*0.6 + 0.1)
ax.set_title('Visual Fading Progression', color='white', fontsize=12, fontweight='bold')
ax.set_yticks([j*0.6+0.25 for j in range(len(flag_order))])
ax.set_yticklabels(flag_order, fontsize=9, color='white')
ax.set_xticks([])
ax.tick_params(colors='white')

plt.tight_layout()
plt.savefig('fading.png', dpi=100, facecolor='#1f2937')
plt.show()

for name, hl in half_lives.items():
    print(f"{name:8s}: half-life = {hl:.1f} months")
print(f"\\nYellow fades {half_lives['Yellow']/half_lives['Blue']:.1f}x faster than Blue")
print("This is why old flags look blue — it's the last color standing!")`,
      challenge: 'If flags are strung in October (post-monsoon), they get 8 dry months before their first monsoon. If strung in April, they get only 2. Plot both scenarios — when is the best time to hang new flags?',
      successHint: 'You have created a multi-panel fading analysis with seasonal variation and visual simulation. The flag color progression panel is an intuitive way to communicate the science — showing exactly how the five sacred colors evolve over time.',
    },
    {
      title: 'UV dose mapping — altitude and angle matter',
      concept: `The total UV energy received by a prayer flag depends on:

1. **Altitude**: UV increases ~10-12% per 1,000 m elevation
2. **Latitude**: closer to equator = more UV year-round
3. **Orientation**: flags facing south (in Northern Hemisphere) get more sun
4. **Tilt angle**: flags tilted toward the sun absorb more UV per unit area
5. **Cloud cover**: reduces UV by 20-80% depending on thickness
6. **Ozone layer**: varies seasonally, especially in spring

The UV dose is measured in **MED/day** (Minimal Erythemal Dose) or **kJ/m²/day**.

At Sikkim locations:
- **Gangtok (1,650 m)**: ~4 MED/day average
- **Pelling (2,150 m)**: ~5 MED/day
- **Dzongri (4,020 m)**: ~7 MED/day
- **Goecha La (4,940 m)**: ~8 MED/day

A south-facing, steeply tilted flag receives up to 40% more UV than a north-facing flat flag at the same location.

📚 *We will use numpy and matplotlib to create UV dose maps and predict location-specific fading rates.*`,
      analogy: 'UV dose mapping is like mapping rainfall across a landscape. Some spots get more rain (UV) because of exposure, angle, and altitude. A valley floor (sheltered) stays drier (less UV) than a hilltop (exposed). The prayer flag on an exposed ridgeline at 4,000 m is in a UV "rainstorm" compared to one in a sheltered courtyard at 1,600 m.',
      storyConnection: 'Prayer flags strung across a mountain pass at Goecha La receive nearly twice the UV of those in a Gangtok monastery courtyard. The flags at high passes fade in months; those in sheltered valleys last much longer. The geography of Sikkim creates a UV landscape that determines each flag\'s lifespan.',
      checkQuestion: 'Why does UV intensity increase with altitude even though you are farther from the sun?',
      checkAnswer: 'The extra distance is negligible (a few km vs. 150 million km to the sun). What matters is the atmosphere: at higher altitude, there is less air above you. Less air means less UV absorption and scattering. The atmosphere absorbs about 50% of UV at sea level — at 5,000 m, only about 35% is absorbed. The reduction in atmospheric filtering is the dominant effect.',
      codeIntro: 'Create UV dose maps for different Sikkim locations and predict flag fading at each site.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# UV model for Sikkim locations
def uv_dose(altitude_m, month, latitude=27.3, cloud_fraction=0.3):
    """Calculate daily UV dose in kJ/m²."""
    # Base UV at sea level
    day_of_year = month * 30 + 15
    solar_declination = 23.45 * np.sin(np.radians(360/365 * (day_of_year - 81)))
    cos_zenith = np.cos(np.radians(latitude - solar_declination))
    cos_zenith = max(0.3, cos_zenith)

    base_uv = 30 * cos_zenith  # kJ/m² at sea level, clear sky

    # Altitude correction (+12% per 1000m)
    alt_factor = 1 + 0.12 * altitude_m / 1000

    # Cloud correction
    cloud_factor = 1 - 0.7 * cloud_fraction

    return base_uv * alt_factor * cloud_factor

# Sikkim locations
locations = {
    'Gangtok':    {'alt': 1650, 'clouds': [0.2,0.2,0.3,0.4,0.5,0.7,0.8,0.8,0.6,0.3,0.2,0.2]},
    'Pelling':    {'alt': 2150, 'clouds': [0.2,0.2,0.3,0.4,0.5,0.7,0.8,0.8,0.6,0.3,0.2,0.2]},
    'Dzongri':    {'alt': 4020, 'clouds': [0.1,0.1,0.2,0.3,0.4,0.6,0.7,0.7,0.5,0.2,0.1,0.1]},
    'Goecha La':  {'alt': 4940, 'clouds': [0.1,0.1,0.2,0.3,0.4,0.5,0.6,0.6,0.4,0.2,0.1,0.1]},
}

months = np.arange(1, 13)
month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
loc_colors = {'Gangtok': '#22c55e', 'Pelling': '#3b82f6', 'Dzongri': '#f59e0b', 'Goecha La': '#ef4444'}

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('UV Dose Mapping — Sikkim Prayer Flag Sites', color='white', fontsize=14, fontweight='bold')

# Panel 1: Monthly UV dose
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
annual_doses = {}
for loc, data in locations.items():
    doses = [uv_dose(data['alt'], m, cloud_fraction=data['clouds'][m-1]) for m in months]
    annual_doses[loc] = sum(doses) * 30  # monthly dose × 30 days
    ax.plot(months, doses, 'o-', color=loc_colors[loc], linewidth=2, markersize=5, label=f"{loc} ({data['alt']}m)")

ax.set_xticks(months)
ax.set_xticklabels(month_names, fontsize=8, color='white')
ax.set_ylabel('Daily UV Dose (kJ/m²)', color='white')
ax.set_title('Monthly UV Intensity', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Annual UV dose comparison
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
locs = list(annual_doses.keys())
doses = list(annual_doses.values())
bars = ax.bar(locs, [d/1000 for d in doses], color=[loc_colors[l] for l in locs], alpha=0.8)
for bar, d in zip(bars, doses):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
            f'{d/1000:.0f}', ha='center', color='white', fontsize=10)
ax.set_ylabel('Annual UV Dose (MJ/m²)', color='white')
ax.set_title('Total Annual UV Exposure', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

# Panel 3: Fading prediction at each location
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
# Use UV dose to modify fading rate
base_k_red = 0.08
for loc, data in locations.items():
    # k scales with UV dose
    uv_ratio = annual_doses[loc] / annual_doses['Gangtok']
    t = np.linspace(0, 24, 100)
    C = 100 * np.exp(-base_k_red * uv_ratio * t)
    ax.plot(t, C, color=loc_colors[loc], linewidth=2, label=f"{loc}")

ax.axhline(y=50, color='gray', linestyle='--', alpha=0.5, label='50% faded')
ax.set_xlabel('Months', color='white')
ax.set_ylabel('Red Dye Remaining (%)', color='white')
ax.set_title('Red Flag Fading by Location', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Orientation effect
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
orientations = {'South-facing': 1.4, 'East/West': 1.0, 'North-facing': 0.65, 'Sheltered': 0.3}
t = np.linspace(0, 24, 100)
for orient, factor in orientations.items():
    k = base_k_red * factor
    C = 100 * np.exp(-k * t)
    ax.plot(t, C, linewidth=2, label=f'{orient} ({factor}×)')

ax.set_xlabel('Months', color='white')
ax.set_ylabel('Color Remaining (%)', color='white')
ax.set_title('Effect of Flag Orientation (at Dzongri)', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('uv_map.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== UV Dose Summary ===")
for loc, dose in annual_doses.items():
    half_life_red = np.log(2) / (base_k_red * dose / annual_doses['Gangtok'])
    print(f"{loc:15s}: {dose/1000:.0f} MJ/m²/yr, red half-life: {half_life_red:.1f} months")`,
      challenge: 'Add a "UV index" calculation (0-11+ scale used in weather reports). At what altitude in Sikkim does the UV index exceed 11 (extreme)?',
      successHint: 'You have created a location-specific UV model that accounts for altitude, season, clouds, and orientation. The fading prediction by location is directly actionable — it tells monks and visitors exactly how long flags will last at each site.',
    },
    {
      title: 'Textile tensile testing — stress-strain curves for flag fabric',
      concept: `**Tensile testing** measures how fabric responds to pulling forces. The **stress-strain curve** reveals:

- **Elastic region**: fabric stretches and returns to original length (Hooke\'s Law)
- **Yield point**: permanent deformation begins
- **Plastic region**: fabric stretches but does not recover
- **Failure point**: fabric tears

Key measurements:
- **Tensile strength**: maximum stress before failure (MPa)
- **Elongation at break**: how much it stretches (%)
- **Young\'s modulus**: stiffness (stress/strain in elastic region)
- **Toughness**: total energy absorbed (area under curve)

For cotton prayer flag fabric:
- New: tensile strength ~350 MPa, elongation ~8%
- After 6 months UV: ~220 MPa, elongation ~5%
- After 12 months UV: ~120 MPa, elongation ~3%
- After 18 months: ~60 MPa, elongation ~1.5%

UV exposure reduces both strength AND ductility — the fabric becomes weak AND brittle. This is the worst combination.

📚 *We will simulate and plot stress-strain curves at different weathering stages.*`,
      analogy: 'A stress-strain test is like pulling on a rubber band. At first it stretches easily (elastic). Pull harder and it starts to deform permanently (plastic). Pull even harder and it snaps (failure). Weathered cotton is like an old, dried-out rubber band — it barely stretches before snapping. UV has turned flexible fabric into brittle paper.',
      storyConnection: 'The physical tearing of prayer flags is not random — it follows predictable materials science. Flags tear at stress concentrations: the holes where the string passes through, the printed block-stamp impressions (thinner fabric), and the edges where fibers fray. Each tear follows a stress-strain curve modified by months of weathering.',
      checkQuestion: 'Why does UV exposure reduce elongation at break (make fabric brittle)?',
      checkAnswer: 'UV breaks cellulose polymer chains at random points. Shorter chains have less ability to slide past each other when stretched. In new cotton, long chains can rearrange and accommodate stretching (plastic deformation). In UV-degraded cotton, the short chains reach their limit quickly and break. Less chain mobility = less elongation = more brittle. It is like the difference between fresh spaghetti (flexible) and broken spaghetti pieces (snap easily).',
      codeIntro: 'Simulate stress-strain curves for prayer flag fabric at different stages of weathering.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def stress_strain_curve(tensile_strength, elongation_pct, youngs_modulus, n_points=200):
    """Generate a realistic stress-strain curve."""
    max_strain = elongation_pct / 100
    strain = np.linspace(0, max_strain * 1.1, n_points)
    stress = np.zeros_like(strain)

    # Elastic region (up to yield ~60% of tensile strength)
    yield_strain = 0.6 * tensile_strength / youngs_modulus
    elastic_mask = strain <= yield_strain
    stress[elastic_mask] = youngs_modulus * strain[elastic_mask]

    # Plastic region (strain hardening)
    plastic_mask = (strain > yield_strain) & (strain <= max_strain)
    for i in np.where(plastic_mask)[0]:
        plastic_strain = strain[i] - yield_strain
        stress[i] = 0.6 * tensile_strength + 0.4 * tensile_strength * (plastic_strain / (max_strain - yield_strain))**0.5

    # Beyond failure
    fail_mask = strain > max_strain
    stress[fail_mask] = 0

    return strain * 100, stress  # strain in %, stress in MPa

# Weathering stages
stages = [
    {'label': 'New fabric', 'months': 0, 'ts': 350, 'elong': 8.0, 'E': 8000, 'color': '#22c55e'},
    {'label': '3 months', 'months': 3, 'ts': 280, 'elong': 6.5, 'E': 9000, 'color': '#3b82f6'},
    {'label': '6 months', 'months': 6, 'ts': 220, 'elong': 5.0, 'E': 9500, 'color': '#f59e0b'},
    {'label': '12 months', 'months': 12, 'ts': 120, 'elong': 3.0, 'E': 10000, 'color': '#ef4444'},
    {'label': '18 months', 'months': 18, 'ts': 60, 'elong': 1.5, 'E': 10500, 'color': '#ec4899'},
]

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Textile Mechanical Testing — Prayer Flag Cotton', color='white', fontsize=14, fontweight='bold')

# Panel 1: Stress-strain curves
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
for stage in stages:
    strain, stress = stress_strain_curve(stage['ts'], stage['elong'], stage['E'])
    ax.plot(strain, stress, color=stage['color'], linewidth=2.5, label=stage['label'])
    # Mark failure point
    fail_idx = np.argmax(stress)
    ax.plot(strain[fail_idx], stress[fail_idx], 'x', color=stage['color'], markersize=10, markeredgewidth=2)

ax.set_xlabel('Strain (%)', color='white', fontsize=11)
ax.set_ylabel('Stress (MPa)', color='white', fontsize=11)
ax.set_title('Stress-Strain Curves', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Property degradation over time
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
months_arr = [s['months'] for s in stages]
ts_arr = [s['ts'] for s in stages]
elong_arr = [s['elong'] for s in stages]

ax.plot(months_arr, [t/350*100 for t in ts_arr], '#ef4444', 'o-', linewidth=2.5, label='Tensile Strength')
ax.plot(months_arr, [e/8*100 for e in elong_arr], '#3b82f6', 'o-', linewidth=2.5, label='Elongation')
ax.axhline(y=30, color='gold', linestyle='--', alpha=0.7, label='Failure threshold (30%)')
ax.set_xlabel('Months of Exposure', color='white', fontsize=11)
ax.set_ylabel('% of Original Value', color='white', fontsize=11)
ax.set_title('Mechanical Property Degradation', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Toughness (area under curve)
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
toughness = []
for stage in stages:
    strain, stress = stress_strain_curve(stage['ts'], stage['elong'], stage['E'])
    # Area under curve (up to failure)
    fail_idx = np.argmax(stress)
    area = np.trapz(stress[:fail_idx+1], strain[:fail_idx+1] / 100)  # MPa
    toughness.append(area)

bars = ax.bar([s['label'] for s in stages], toughness,
              color=[s['color'] for s in stages], alpha=0.8)
for bar, t in zip(bars, toughness):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
            f'{t:.1f}', ha='center', color='white', fontsize=9)
ax.set_ylabel('Toughness (MJ/m³)', color='white', fontsize=11)
ax.set_title('Energy Absorption Capacity', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

# Panel 4: Wind gust survival
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
wind_speeds = np.arange(10, 100, 5)  # km/h
# Stress from wind: proportional to v²
stress_from_wind = 0.01 * wind_speeds**2  # rough MPa estimate for flag

for stage in stages:
    survives = stress_from_wind < stage['ts']
    max_wind = wind_speeds[np.argmax(~survives)] if not all(survives) else wind_speeds[-1]
    ax.barh(stage['label'], max_wind, color=stage['color'], alpha=0.8)
    ax.text(max_wind + 1, list(reversed(range(len(stages)))).index(stages.index(stage)),
            f'{max_wind} km/h', va='center', color='white', fontsize=9)

ax.set_xlabel('Maximum Survivable Gust (km/h)', color='white', fontsize=11)
ax.set_title('Wind Gust Tolerance', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='x')

plt.tight_layout()
plt.savefig('tensile.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Mechanical Summary ===")
for s, t in zip(stages, toughness):
    print(f"{s['label']:15s}: {s['ts']:4d} MPa, {s['elong']:.1f}% elong, toughness {t:.1f} MJ/m³")
print(f"\\nToughness drops {toughness[0]/toughness[-1]:.0f}x from new to 18-month fabric")
print("Brittle + weak = tears in moderate wind")`,
      challenge: 'Compare cotton (prayer flag) with polyester (synthetic flag) at the same UV exposure. Polyester loses strength slower (k = 0.04 vs 0.08 per month) but starts at similar strength. Plot both on the same axes.',
      successHint: 'You have created a complete tensile testing analysis with stress-strain curves, property degradation tracking, toughness computation, and wind tolerance assessment. This is exactly how textile engineers evaluate fabric durability for outdoor applications.',
    },
    {
      title: 'Dye lightfastness — comparing natural vs synthetic dyes',
      concept: `**Lightfastness** is a dye\'s resistance to fading under light exposure. It is measured on the **Blue Wool Scale** (BWS): 1 = very poor (fades in hours) to 8 = excellent (resists years of sun).

Traditional prayer flag dyes:
- **Indigo** (blue): BWS 4-5 (moderate — the best natural dye)
- **Alizarin/lac** (red): BWS 3-4 (fair)
- **Turmeric** (yellow): BWS 1-2 (very poor — fades extremely fast)
- **Indigo + turmeric** (green): BWS 2-3 (limited by weaker component)

Modern synthetic alternatives:
- **Reactive dyes**: BWS 5-7 (good to very good)
- **Vat dyes** (synthetic indigo): BWS 7-8 (excellent)
- **Pigment prints**: BWS 6-7 (good, sits on surface)

The fading mechanism differs:
- **Natural dyes**: direct bond breaking by UV
- **Synthetic reactive dyes**: cross-linked to fiber, harder to remove
- **Vat dyes**: insoluble crystals trapped in fiber, very stable

The tension: traditional natural dyes fade beautifully (fulfilling the spiritual purpose), but synthetic dyes last longer (reducing replacement frequency and cost).

📚 *We will use matplotlib to create comparative lightfastness analyses including accelerated exposure testing.*`,
      analogy: 'Lightfastness is like sunscreen for dye molecules. A BWS 1 dye has no sunscreen — it burns immediately. A BWS 8 dye has SPF 50+ — it resists hours of intense UV. Natural dyes are like fair skin (sensitive), while synthetic dyes are like dark skin (naturally resistant). Both eventually fade, but the timeline differs dramatically.',
      storyConnection: 'The debate between natural and synthetic dyes for prayer flags is a real conversation in Sikkim. Purists insist on traditional natural dyes for spiritual authenticity. Pragmatists argue that synthetic dyes reduce waste and cost. The lightfastness data quantifies the trade-off, letting communities make informed choices.',
      checkQuestion: 'If turmeric (BWS 2) is so poor, why do prayer flag makers still use it for yellow?',
      checkAnswer: 'Several reasons: (1) Tradition — turmeric has been used for centuries and has cultural significance. (2) Availability — it grows abundantly in Sikkim. (3) Cost — virtually free compared to synthetic dyes. (4) Spiritual meaning — the rapid fading of yellow is seen as the quickest release of prayers. (5) Safety — turmeric is non-toxic, unlike some synthetic yellow dyes. The "flaw" is actually a feature in the spiritual context.',
      codeIntro: 'Compare lightfastness of natural and synthetic dyes through simulated accelerated exposure testing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Blue Wool Scale to fading rate conversion
# BWS 1: fades in ~20 hours of UV, BWS 8: ~1280 hours
def bws_to_k(bws):
    """Convert Blue Wool Scale to fading rate constant (per 100 hours UV)."""
    hours_to_50pct = 20 * (2 ** (bws - 1))
    k = np.log(2) / hours_to_50pct * 100  # per 100 hours
    return k

# Dye database
dyes = {
    'Natural': {
        'Turmeric (yellow)':    {'bws': 1.5, 'color': '#f59e0b'},
        'Lac (red)':            {'bws': 3.5, 'color': '#ef4444'},
        'Indigo (blue)':        {'bws': 4.5, 'color': '#3b82f6'},
        'Pomegranate (yellow)': {'bws': 2.5, 'color': '#fbbf24'},
        'Madder (red)':         {'bws': 3.0, 'color': '#dc2626'},
    },
    'Synthetic': {
        'Reactive Yellow':   {'bws': 6.0, 'color': '#eab308'},
        'Reactive Red':      {'bws': 6.5, 'color': '#f87171'},
        'Vat Indigo':        {'bws': 7.5, 'color': '#60a5fa'},
        'Pigment Green':     {'bws': 6.0, 'color': '#4ade80'},
        'Disperse Blue':     {'bws': 5.5, 'color': '#818cf8'},
    }
}

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Dye Lightfastness — Natural vs. Synthetic', color='white', fontsize=14, fontweight='bold')

# Panel 1: Fading curves comparison
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
hours = np.linspace(0, 1000, 200)

for category, dye_list in dyes.items():
    ls = '-' if category == 'Natural' else '--'
    for name, data in dye_list.items():
        k = bws_to_k(data['bws'])
        C = 100 * np.exp(-k * hours / 100)
        label = name if category == 'Natural' else None  # avoid legend clutter
        ax.plot(hours, C, color=data['color'], linewidth=2, linestyle=ls, label=name)

ax.axhline(y=50, color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('UV Exposure (hours)', color='white', fontsize=11)
ax.set_ylabel('Color Remaining (%)', color='white', fontsize=11)
ax.set_title('Fading Curves (solid=natural, dashed=synthetic)', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=6, ncol=2)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: BWS comparison bars
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
all_names = []
all_bws = []
all_colors = []
all_types = []

for category, dye_list in dyes.items():
    for name, data in dye_list.items():
        all_names.append(name)
        all_bws.append(data['bws'])
        all_colors.append(data['color'])
        all_types.append(category)

y_pos = range(len(all_names))
bars = ax.barh(y_pos, all_bws, color=all_colors, alpha=0.8,
               edgecolor=['white' if t == 'Natural' else 'gray' for t in all_types])
ax.set_yticks(y_pos)
ax.set_yticklabels(all_names, fontsize=7, color='white')
ax.set_xlabel('Blue Wool Scale (1-8)', color='white', fontsize=11)
ax.set_title('Lightfastness Rating', color='white', fontsize=11, fontweight='bold')
ax.axvline(x=4, color='gold', linestyle='--', alpha=0.5, label='Minimum for outdoor use')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='x')

# Panel 3: Time to 50% fade (in Sikkim outdoor conditions)
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
# Assume 6 hours effective UV per day in Sikkim
uv_hours_per_month = 6 * 30

t50_natural = []
t50_synthetic = []
name_natural = []
name_synthetic = []

for category, dye_list in dyes.items():
    for name, data in dye_list.items():
        k = bws_to_k(data['bws'])
        hours_to_50 = np.log(2) / (k / 100)
        months = hours_to_50 / uv_hours_per_month
        if category == 'Natural':
            t50_natural.append(months)
            name_natural.append(name[:12])
        else:
            t50_synthetic.append(months)
            name_synthetic.append(name[:12])

x = np.arange(max(len(t50_natural), len(t50_synthetic)))
width = 0.35
if t50_natural:
    ax.bar(x[:len(t50_natural)] - width/2, t50_natural, width, color='#f59e0b', alpha=0.8, label='Natural')
if t50_synthetic:
    ax.bar(x[:len(t50_synthetic)] + width/2, t50_synthetic, width, color='#3b82f6', alpha=0.8, label='Synthetic')
ax.set_xticks(x[:max(len(name_natural), len(name_synthetic))])
labels = [f'{n}\n{s}' if i < len(name_synthetic) else n
          for i, (n, s) in enumerate(zip(name_natural + ['']*(5-len(name_natural)),
                                          name_synthetic + ['']*(5-len(name_synthetic))))]
ax.set_xticklabels(name_natural, fontsize=7, rotation=30, ha='right', color='white')
ax.set_ylabel('Months to 50% Fade', color='white', fontsize=11)
ax.set_title('Outdoor Lifespan in Sikkim', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

# Panel 4: Cost-effectiveness
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
# Cost per month of visible color
natural_costs = [5, 15, 20, 8, 12]   # Rs per flag (natural dyes)
synthetic_costs = [25, 30, 35, 28, 30]  # Rs per flag (synthetic dyes)

cost_per_month_nat = [c / max(0.5, t) for c, t in zip(natural_costs, t50_natural)]
cost_per_month_syn = [c / max(0.5, t) for c, t in zip(synthetic_costs, t50_synthetic)]

for i, (n_name, n_cost, s_name, s_cost) in enumerate(zip(
        name_natural, cost_per_month_nat, name_synthetic, cost_per_month_syn)):
    ax.scatter(n_cost, i, color='#f59e0b', s=100, marker='o', zorder=5)
    ax.scatter(s_cost, i, color='#3b82f6', s=100, marker='s', zorder=5)

ax.set_yticks(range(min(len(name_natural), len(name_synthetic))))
ax.set_yticklabels(name_natural[:min(len(name_natural), len(name_synthetic))], fontsize=8, color='white')
ax.set_xlabel('Cost per Month of Color (Rs)', color='white', fontsize=11)
ax.set_title('Cost-Effectiveness (●natural ■synthetic)', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='x')

plt.tight_layout()
plt.savefig('lightfastness.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Lightfastness Summary ===")
print("\\nNatural dyes:")
for name, months in zip(name_natural, t50_natural):
    print(f"  {name:20s}: {months:.1f} months to 50% fade")
print("\\nSynthetic dyes:")
for name, months in zip(name_synthetic, t50_synthetic):
    print(f"  {name:20s}: {months:.1f} months to 50% fade")
print(f"\\nSynthetic dyes last {np.mean(t50_synthetic)/np.mean(t50_natural):.1f}x longer on average")`,
      challenge: 'Calculate the environmental impact: if natural flags are replaced 3× more often, but synthetic dyes create chemical waste, which is more sustainable? Estimate the total waste per year for a monastery with 100 flags.',
      successHint: 'You have built a comprehensive dye lightfastness analysis using the Blue Wool Scale, outdoor lifetime prediction, and cost-effectiveness comparison. The data clearly shows the trade-off between tradition (natural dyes, faster fading) and durability (synthetic dyes, longer lasting).',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Materials data visualization with matplotlib</span>
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
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
