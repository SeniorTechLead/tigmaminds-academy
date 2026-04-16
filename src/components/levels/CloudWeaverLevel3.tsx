import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudWeaverLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'High-altitude meteorology — how Tawang\'s elevation shapes its weather',
      concept: `Tawang sits at approximately 3,048 meters (10,000 feet) in Arunachal Pradesh, near the border with Tibet. At this altitude, atmospheric pressure is about 700 hPa — 70% of sea-level pressure. This reduced pressure has profound effects on weather: air holds less moisture (lower absolute humidity), temperature lapse rate creates much colder conditions, UV radiation is 30-40% stronger, and wind speeds are typically higher due to the pressure gradient between the Tibetan Plateau and the plains.

The standard atmosphere model gives temperature at altitude: T(z) = T₀ - Γz, where T₀ is sea-level temperature (15°C standard) and Γ is the environmental lapse rate (6.5°C/km). At 3 km: T = 15 - 6.5×3 = -4.5°C. But Tawang's climate deviates from this simple model due to its position on the south-facing slopes of the Himalayas. During the Indian monsoon (June-September), moisture-laden winds from the Bay of Bengal are forced upward by the mountains, creating intense orographic precipitation. During winter, cold Tibetan air masses descend, bringing extreme cold and snow.

Pressure varies with altitude according to the barometric formula: P(z) = P₀ × (1 - Lz/T₀)^(gM/RL), where L is the lapse rate, g is gravity, M is molar mass of air, and R is the gas constant. This exponential decrease means that atmospheric processes at Tawang's altitude operate at fundamentally different thermodynamic conditions than at sea level.`,
      analogy: 'Living at high altitude is like being inside a pressure cooker in reverse. At sea level, the atmosphere pushes down with the full weight of the air column above. At Tawang, 30% of that air column is below you, so the pressure is lower. Water boils at a lower temperature (about 90°C instead of 100°C), your lungs must work harder to extract oxygen, and weather systems behave differently because the same physics operates with less atmosphere to work with.',
      storyConnection: 'The cloud weaver of Tawang works at the edge of the sky — where the atmosphere is thin enough to touch the clouds. At 3,000 meters, the monastery often sits inside the clouds themselves, not beneath them. The weaver does not just observe clouds; they inhabit them. This intimate relationship between land and cloud is unique to high-altitude settlements and shapes every aspect of Tawang\'s culture, agriculture, and water supply.',
      checkQuestion: 'Tawang is at 3,048m. Using the barometric formula (simple version: P = P₀ × e^(-z/H) where H = 8500m), what is the atmospheric pressure? At this pressure, what is the boiling point of water (approximately 1°C drop per 300m altitude)?',
      checkAnswer: 'P = 1013.25 × e^(-3048/8500) = 1013.25 × 0.698 = 707 hPa. Boiling point reduction: 3048/300 ≈ 10.2°C below 100°C → approximately 89.8°C. This has real consequences: cooking rice takes longer, sterilization by boiling is less effective, and the thermodynamics of cloud formation are different — less energy is needed to evaporate water at this altitude.',
      codeIntro: 'Model the altitude-dependent atmosphere over Tawang — pressure, temperature, density, and their effects on weather and daily life.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# High-altitude meteorology model for Tawang
g = 9.81         # m/s^2
M_air = 0.029    # kg/mol
R = 8.314        # J/(mol·K)
P0 = 101325      # Pa (sea level)
T0 = 288.15      # K (15°C standard)
L = 0.0065       # K/m (standard lapse rate)

def pressure_altitude(z):
    """Barometric formula for pressure vs altitude."""
    return P0 * (1 - L * z / T0) ** (g * M_air / (R * L))

def temperature_altitude(z, T_surface=288.15, lapse=6.5e-3):
    """Temperature at altitude."""
    return T_surface - lapse * z

def air_density(P, T):
    """Air density from ideal gas law."""
    return P * M_air / (R * T)

def boiling_point(P_pa):
    """Approximate boiling point of water at given pressure."""
    # Clausius-Clapeyron approximation
    return 100 - (101325 - P_pa) / 3386  # roughly 1°C per 300m

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Atmospheric profiles
ax = axes[0, 0]
ax.set_facecolor('#111827')
z = np.linspace(0, 9000, 500)
P = pressure_altitude(z)
T = temperature_altitude(z)
rho = air_density(P, T)

ax.plot(P / 100, z / 1000, color='#3b82f6', linewidth=2.5, label='Pressure (hPa)')
ax.axhline(3.048, color='#fbbf24', linewidth=2, linestyle='--', label='Tawang (3048m)')
ax.axhline(8.848, color='#ef4444', linewidth=1, linestyle=':', label='Everest (8848m)')
ax.set_xlabel('Pressure (hPa)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Atmospheric Pressure Profile', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Mark Tawang
P_tawang = pressure_altitude(3048)
ax.plot(P_tawang / 100, 3.048, 'o', color='#fbbf24', markersize=10, zorder=5)
ax.annotate(f'{P_tawang/100:.0f} hPa', xy=(P_tawang/100, 3.048),
           xytext=(P_tawang/100 + 80, 3.5), color='#fbbf24', fontsize=10,
           arrowprops=dict(arrowstyle='->', color='#fbbf24'))

# Plot 2: Temperature and effects
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
# Monthly temperatures at Tawang
months = np.arange(1, 13)
month_names = ['J','F','M','A','M','J','J','A','S','O','N','D']
T_tawang = np.array([-5, -2, 3, 8, 12, 15, 16, 15, 13, 8, 2, -3])
T_guwahati = np.array([17, 20, 24, 27, 28, 29, 29, 29, 28, 26, 22, 18])

ax2.plot(months, T_tawang, 'o-', color='#3b82f6', linewidth=2.5, label='Tawang (3048m)')
ax2.plot(months, T_guwahati, 's-', color='#ef4444', linewidth=2.5, label='Guwahati (55m)')
ax2.fill_between(months, T_tawang, T_guwahati, alpha=0.1, color='#f59e0b')
for m, tt, tg in zip(months, T_tawang, T_guwahati):
    if m in [1, 4, 7, 10]:
        ax2.annotate(f'Δ={tg-tt:.0f}°C', xy=(m, (tt+tg)/2), fontsize=8, color='#f59e0b',
                    ha='center')
ax2.set_xticks(months); ax2.set_xticklabels(month_names)
ax2.set_ylabel('Temperature (°C)', color='white')
ax2.set_title('Tawang vs Guwahati Monthly Temperature', color='white', fontsize=11)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.axhline(0, color='gray', linewidth=0.5, linestyle='--')

# Plot 3: UV radiation and oxygen at altitude
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
altitudes_km = np.linspace(0, 6, 100)
# UV increases ~10% per 1000m
uv_relative = 1 + 0.12 * altitudes_km
# Oxygen partial pressure decreases
P_alt = pressure_altitude(altitudes_km * 1000)
pO2 = 0.21 * P_alt / P0 * 100  # % of sea level

ax3.plot(altitudes_km, uv_relative * 100, color='#a855f7', linewidth=2.5, label='UV intensity')
ax3.plot(altitudes_km, pO2, color='#22c55e', linewidth=2.5, label='O₂ partial pressure')
ax3.axvline(3.048, color='#fbbf24', linewidth=1.5, linestyle='--', label='Tawang')
ax3.axhline(100, color='gray', linewidth=0.5, linestyle=':')
ax3.set_xlabel('Altitude (km)', color='white')
ax3.set_ylabel('% of sea level value', color='white')
ax3.set_title('UV Radiation and Oxygen at Altitude', color='white', fontsize=11)
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
# Mark values at Tawang
uv_tawang = (1 + 0.12 * 3.048) * 100
o2_tawang = 0.21 * pressure_altitude(3048) / P0 * 100 * 100 / 21
ax3.annotate(f'UV: {uv_tawang:.0f}%', xy=(3.048, uv_tawang), xytext=(4, uv_tawang),
            color='#a855f7', fontsize=9, arrowprops=dict(arrowstyle='->', color='#a855f7'))

# Plot 4: Boiling point and cooking effects
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
alt_range = np.linspace(0, 6000, 100)
P_range = pressure_altitude(alt_range)
bp_range = np.array([boiling_point(p) for p in P_range])

ax4.plot(alt_range / 1000, bp_range, color='#ef4444', linewidth=2.5)
ax4.fill_between(alt_range / 1000, bp_range, 100, alpha=0.1, color='#ef4444')
ax4.axvline(3.048, color='#fbbf24', linewidth=1.5, linestyle='--')
bp_tawang = boiling_point(pressure_altitude(3048))
ax4.plot(3.048, bp_tawang, 'o', color='#fbbf24', markersize=10)
ax4.annotate(f'Tawang: {bp_tawang:.1f}°C', xy=(3.048, bp_tawang),
            xytext=(4, bp_tawang + 2), color='#fbbf24', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#fbbf24'))
ax4.set_xlabel('Altitude (km)', color='white')
ax4.set_ylabel('Boiling point of water (°C)', color='white')
ax4.set_title('Water Boiling Point vs Altitude', color='white', fontsize=11)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("High-Altitude Meteorology — Tawang (3048m):")
print(f"  Atmospheric pressure: {P_tawang/100:.0f} hPa ({P_tawang/P0*100:.0f}% of sea level)")
print(f"  Standard temperature: {temperature_altitude(3048)-273.15:.1f}°C")
print(f"  Air density: {air_density(P_tawang, temperature_altitude(3048)):.3f} kg/m³")
print(f"  Water boiling point: {bp_tawang:.1f}°C")
print(f"  UV intensity: {uv_tawang:.0f}% of sea level")
print(f"  O₂ partial pressure: {0.21*P_tawang/P0*100:.1f}% of sea level O₂")
print(f"\
At Tawang, every aspect of atmospheric physics is different from the plains.")
print(f"The cloud weaver lives where the atmosphere is 30% thinner.")`,
      challenge: 'Add wind chill: model how wind speed at altitude makes effective temperature much colder than air temperature. Plot wind chill temperature as a function of altitude and wind speed, and show why Tawang\'s winters feel harsher than the thermometer suggests.',
      successHint: 'High-altitude meteorology is a complete atmospheric laboratory. At Tawang\'s elevation, every fundamental parameter — pressure, temperature, density, UV, oxygen — differs significantly from sea level, creating unique weather patterns and ecological conditions.',
    },
    {
      title: 'Orographic precipitation — mountains as rain machines',
      concept: `When moist air encounters a mountain range, it is forced to rise. As it ascends, it cools adiabatically, reaches the dew point, and forms clouds. If the air continues rising, the clouds produce precipitation on the windward side of the mountain. This is orographic precipitation — the mountains literally squeeze rain from the air. After crossing the ridge, the now-dry air descends the leeward side, warming adiabatically and creating a rain shadow.

The Himalayan front where Tawang sits is one of Earth\'s most dramatic orographic precipitation machines. Monsoon moisture from the Bay of Bengal hits the southern slopes at elevations from 500m to 5000m. Cherrapunji (elevation 1484m), just 200km southwest of Tawang, receives over 11,000 mm of annual rainfall — among the highest on Earth — almost entirely from orographic enhancement of the monsoon. Tawang itself receives about 1500-2000 mm, which is less because it sits partially in the rain shadow of the intervening Khasi-Jaintia Hills.

The orographic precipitation rate depends on the Froude number: Fr = U/(NH), where U is wind speed, N is the Brunt-Vaisala frequency (atmospheric stability), and H is mountain height. When Fr < 1 (stable atmosphere, slow wind, tall mountain), air is blocked and flows around the mountain. When Fr > 1, air flows over the top, producing orographic uplift and precipitation. The spatial distribution of rainfall on a mountain is a direct function of slope steepness, wind direction, and atmospheric moisture content.`,
      analogy: 'Orographic precipitation is like wringing a wet sponge. The monsoon air is a saturated sponge. The mountain is a hand that squeezes it as the air is forced upward. The windward slopes get soaked (the water wrung out), while the leeward side stays dry (the sponge is now wrung out). The taller and steeper the mountain, the harder the squeeze, and the more water is extracted.',
      storyConnection: 'The cloud weaver of Tawang understands intuitively what atmospheric science quantifies: the mountains create the clouds. The monsoon moisture that sustains the monastery\'s gardens and the valley\'s rivers is extracted from the air by the orographic effect of the Himalayas. The weaver\'s clouds are not random weather — they are the predictable result of topography and monsoon flow.',
      checkQuestion: 'Air with 15 g/kg moisture content approaches a 3000m mountain at 10 m/s. The air cools at the DALR (9.8°C/km) until saturation at 1500m, then at the SALR (5.5°C/km) above. If half the condensed water falls as rain on the windward side, how much precipitation (mm) does the windward slope receive per unit time?',
      checkAnswer: 'At 1500m: T drops by 9.8 × 1.5 = 14.7°C. From 1500m to 3000m (another 1.5 km at SALR): drops by 5.5 × 1.5 = 8.25°C more. The total cooling of ~23°C reduces moisture from 15 g/kg to approximately 5 g/kg (from the Clausius-Clapeyron relation). That is 10 g/kg of condensed water. At 10 m/s wind speed and air density ~1 kg/m³, the moisture flux is 10 g/m²/s × 0.5 (rain efficiency) = 5 g/m²/s = 5 mm/1000s ≈ 18 mm/hr. This is heavy rainfall — explaining why the Himalayan foothills are among the wettest places on Earth.',
      codeIntro: 'Model orographic precipitation along a mountain cross-section, computing how topography converts moisture-laden wind into rainfall.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Orographic precipitation model
g = 9.81
DALR = 9.8  # °C/km
SALR = 5.5  # °C/km

def mountain_profile(x, peak_height=3000, width=50):
    """Gaussian mountain profile."""
    return peak_height * np.exp(-0.5 * ((x - 50) / (width / 4))**2)

def saturation_mixing_ratio(T_celsius, P_hPa=700):
    """Approximate saturation mixing ratio (g/kg)."""
    es = 6.11 * np.exp(17.27 * T_celsius / (T_celsius + 237.3))  # hPa
    return 622 * es / (P_hPa - es)

# Mountain cross-section
x = np.linspace(0, 100, 500)  # km
terrain = mountain_profile(x)

# Air parcel trajectory
T_initial = 28  # °C at sea level
moisture_initial = 18  # g/kg
wind_speed = 8  # m/s

T_profile = np.zeros_like(x)
moisture_profile = np.zeros_like(x)
condensation_rate = np.zeros_like(x)
rain_rate = np.zeros_like(x)
cloud_base = np.zeros_like(x)

T_parcel = T_initial
moisture = moisture_initial
prev_alt = 0

for i in range(len(x)):
    alt = terrain[i] / 1000  # km
    dz = alt - prev_alt

    if dz > 0:  # ascending
        # Check if saturated
        q_sat = saturation_mixing_ratio(T_parcel)
        if moisture > q_sat:  # saturated: use SALR
            T_parcel -= SALR * dz
            q_sat_new = saturation_mixing_ratio(T_parcel)
            condensed = max(moisture - q_sat_new, 0)
            moisture = q_sat_new
            condensation_rate[i] = condensed * wind_speed * 1.0  # g/m^2/s
            rain_rate[i] = condensation_rate[i] * 0.5  # 50% rain efficiency
        else:  # unsaturated: use DALR
            T_parcel -= DALR * dz
            q_sat_new = saturation_mixing_ratio(T_parcel)
            if moisture > q_sat_new:
                cloud_base[i] = alt
    else:  # descending (leeward)
        T_parcel += DALR * abs(dz)  # foehn warming
        condensation_rate[i] = 0
        rain_rate[i] = 0

    T_profile[i] = T_parcel
    moisture_profile[i] = moisture
    prev_alt = alt

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Mountain profile with precipitation
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.fill_between(x, 0, terrain, color='#4a3728', alpha=0.6, label='Mountain')
ax.plot(x, terrain, color='#8B6914', linewidth=2)
# Rain on windward
rain_scaled = rain_rate / max(rain_rate.max(), 0.001) * 500
ax.fill_between(x, terrain, terrain + rain_scaled, color='#3b82f6', alpha=0.4, label='Rainfall')
# Wind direction
ax.annotate('', xy=(40, 3500), xytext=(20, 3500),
           arrowprops=dict(arrowstyle='->', color='white', lw=2))
ax.text(25, 3700, 'Monsoon wind', color='white', fontsize=10)
# Mark Tawang
ax.axvline(50, color='#fbbf24', linewidth=1, linestyle='--')
ax.text(51, 3200, 'Tawang', color='#fbbf24', fontsize=10)
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Elevation (m)', color='white')
ax.set_title('Orographic Precipitation Over the Himalayas', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Temperature and moisture profiles
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.plot(x, T_profile, color='#ef4444', linewidth=2.5, label='Air temperature')
ax2_twin = ax2.twinx()
ax2_twin.plot(x, moisture_profile, color='#3b82f6', linewidth=2.5, linestyle='--',
              label='Moisture (g/kg)')
ax2.axvline(50, color='#fbbf24', linewidth=1, linestyle=':', alpha=0.5)
ax2.set_xlabel('Distance (km)', color='white')
ax2.set_ylabel('Temperature (°C)', color='#ef4444')
ax2_twin.set_ylabel('Moisture content (g/kg)', color='#3b82f6')
ax2.set_title('Air Mass Transformation Over Mountain', color='white', fontsize=11)
lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1+lines2, labels1+labels2, fontsize=9, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray'); ax2_twin.tick_params(colors='gray')
# Mark foehn effect
ax2.annotate('Foehn warming\
(descending dry)', xy=(70, T_profile[350]),
            xytext=(75, T_profile[350]-5), color='#ef4444', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Plot 3: Rainfall distribution
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
rain_mm_hr = rain_rate * 3.6  # approximate mm/hr
ax3.fill_between(x, 0, rain_mm_hr, color='#3b82f6', alpha=0.6)
ax3.plot(x, rain_mm_hr, color='#3b82f6', linewidth=2)
ax3.axvline(50, color='#fbbf24', linewidth=1.5, linestyle='--')
# Add terrain outline on secondary axis
ax3_twin = ax3.twinx()
ax3_twin.plot(x, terrain / 1000, color='#8B6914', linewidth=1, alpha=0.5)
ax3_twin.set_ylabel('Elevation (km)', color='#8B6914')
ax3.set_xlabel('Distance (km)', color='white')
ax3.set_ylabel('Rainfall rate (mm/hr)', color='#3b82f6')
ax3.set_title('Rainfall Distribution Across Mountain', color='white', fontsize=11)
ax3.tick_params(colors='gray'); ax3_twin.tick_params(colors='gray')

# Plot 4: Precipitation vs mountain height
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
heights = np.linspace(500, 6000, 50)
total_rain = []
for h in heights:
    terrain_h = h * np.exp(-0.5 * ((x - 50) / 12.5)**2)
    rain_total = 0
    T_p = 28
    moist = 18
    prev_a = 0
    for i in range(len(x)):
        alt_km = terrain_h[i] / 1000
        dz_km = alt_km - prev_a
        if dz_km > 0:
            q_s = saturation_mixing_ratio(T_p)
            if moist > q_s:
                T_p -= SALR * dz_km
                q_new = saturation_mixing_ratio(T_p)
                rain_total += max(moist - q_new, 0) * 0.5
                moist = q_new
            else:
                T_p -= DALR * dz_km
        else:
            T_p += DALR * abs(dz_km)
        prev_a = alt_km
    total_rain.append(rain_total)

ax4.plot(heights / 1000, total_rain, color='#22c55e', linewidth=2.5)
ax4.fill_between(heights / 1000, 0, total_rain, color='#22c55e', alpha=0.15)
ax4.axvline(3.048, color='#fbbf24', linewidth=1.5, linestyle='--', label='Tawang height')
ax4.set_xlabel('Mountain peak height (km)', color='white')
ax4.set_ylabel('Total orographic precipitation (g/kg extracted)', color='white')
ax4.set_title('Precipitation vs Mountain Height', color='white', fontsize=11)
ax4.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Orographic Precipitation Model — Tawang:")
print(f"  Initial conditions: T={T_initial}°C, moisture={moisture_initial} g/kg, wind={wind_speed} m/s")
print(f"  Mountain height: 3000m")
print(f"  Cloud base: ~{1500:.0f}m (where air reaches saturation)")
print(f"  Peak rainfall: windward slope, ~{rain_mm_hr.max():.1f} mm/hr")
print(f"  Rain shadow: leeward side receives <1 mm/hr")
print(f"  Foehn effect: air arrives warmer and drier on leeward side")
print(f"\
The Himalayas extract ~{moisture_initial - moisture_profile[-1]:.0f} g/kg of moisture from monsoon air.")
print(f"This is why Cherrapunji/Mawsynram get >11,000 mm/year.")
print(f"Tawang's water supply depends entirely on orographic precipitation.")`,
      challenge: 'Add wind direction variability: model how shifting monsoon winds (from SE to SW over the season) change the rainfall distribution across the mountain. Show how Tawang\'s rainfall depends critically on wind direction relative to the terrain orientation.',
      successHint: 'Orographic precipitation is the dominant mechanism for water supply in mountainous regions worldwide. Understanding it quantitatively — how mountain shape, wind speed, and moisture content interact — is essential for water resource management, flood prediction, and climate adaptation in places like Tawang.',
    },
    {
      title: 'Fog harvesting technology — capturing water from clouds',
      concept: `In many high-altitude locations, fog is more abundant and reliable than rainfall. Fog harvesting technology uses fine mesh screens (typically polypropylene or Raschel mesh) to intercept fog droplets as wind-driven clouds pass through. Droplets (5-40 μm diameter) collide with mesh fibers, coalesce, and drip into collection troughs. A standard fog collector (1m × 1m mesh) can yield 3-10 liters of water per day in suitable locations.

The physics of fog collection involves aerosol impaction. A droplet carried by wind follows the air streamlines around a mesh fiber — but if the droplet has enough inertia, it cannot follow the curve and instead impacts the fiber. The collection efficiency depends on the Stokes number: Stk = ρ_w × d² × U / (18μ × D_fiber), where ρ_w is water density, d is droplet diameter, U is wind speed, μ is air viscosity, and D_fiber is fiber diameter. Higher Stk (larger droplets, faster wind, thinner fibers) means higher collection efficiency.

Mesh design involves a trade-off: finer mesh catches more droplets but also blocks more wind, reducing airflow through the collector. The aerodynamic shade coefficient (fraction of area blocked by mesh) optimizes around 50-60% — enough open area to let wind through while capturing a high fraction of droplets. Tawang, frequently enveloped in clouds and fog, is an ideal location for fog harvesting to supplement water supply during the dry season when monsoon rainfall ceases.`,
      analogy: 'Fog harvesting is like a baseball catcher\'s mitt for water droplets. The mesh is the mitt, and the fog droplets are the baseballs. Large, fast droplets (high Stokes number) are easy to catch — they cannot swerve around the fibers. Tiny, slow droplets follow the air around the fibers and escape. The mesh design is about finding the right "mitt size" — large enough to catch most droplets, open enough to let the air flow freely.',
      storyConnection: 'The cloud weaver of Tawang does not just observe clouds — the clouds provide water. In a region where piped water supply is limited and monsoon rainfall is seasonal, fog harvesting could transform cloud contact into a reliable water source. The weaver\'s intimate relationship with clouds becomes literal: the clouds touching the mountainside can be woven into drinking water through engineered mesh collectors.',
      checkQuestion: 'A fog collector mesh with 0.5mm fiber diameter operates in fog with 20μm droplets at 3 m/s wind speed. Calculate the Stokes number. If the collection efficiency is approximately Stk/(Stk+0.5) for this geometry, what percentage of droplets are captured?',
      checkAnswer: 'Stk = (1000 × (20e-6)² × 3) / (18 × 1.8e-5 × 0.5e-3) = (1000 × 4e-10 × 3) / (1.62e-7) = 1.2e-6 / 1.62e-7 = 7.4. Collection efficiency ≈ 7.4 / (7.4 + 0.5) = 93.7%. These large droplets at moderate wind speed are efficiently captured. For smaller 5μm droplets: Stk = 0.46, efficiency ≈ 48%. This is why droplet size distribution matters — fog with larger droplets yields more water.',
      codeIntro: 'Design and optimize a fog harvesting system for Tawang — model collection efficiency, mesh optimization, and expected water yield.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fog harvesting physics
rho_w = 1000      # water density (kg/m^3)
mu_air = 1.8e-5   # air viscosity (Pa·s)

def stokes_number(d_drop, U_wind, D_fiber):
    """Compute Stokes number for droplet impaction."""
    return rho_w * d_drop**2 * U_wind / (18 * mu_air * D_fiber)

def collection_efficiency(Stk, model='langmuir'):
    """Single-fiber collection efficiency."""
    if model == 'langmuir':
        return Stk / (Stk + 0.5)
    return np.clip(Stk / (Stk + 0.25), 0, 1)

def mesh_collection(shade_coeff, single_fiber_eff):
    """Overall mesh collection efficiency accounting for aerodynamics."""
    # Wind reduction through mesh
    wind_through = 1 - shade_coeff
    # Effective collection = shade * efficiency * wind_through
    return shade_coeff * single_fiber_eff * wind_through

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Collection efficiency vs droplet size
ax = axes[0, 0]
ax.set_facecolor('#111827')
d_range = np.linspace(1e-6, 50e-6, 200)
fiber_sizes = [(0.2e-3, '0.2mm fiber'), (0.5e-3, '0.5mm fiber'),
               (1.0e-3, '1.0mm fiber'), (2.0e-3, '2.0mm fiber')]
colors_f = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
U = 3.0  # m/s

for (D_f, label), color in zip(fiber_sizes, colors_f):
    Stk = stokes_number(d_range, U, D_f)
    eff = collection_efficiency(Stk)
    ax.plot(d_range * 1e6, eff * 100, color=color, linewidth=2, label=label)

ax.axvspan(5, 40, alpha=0.1, color='white', label='Typical fog droplets')
ax.set_xlabel('Droplet diameter (μm)', color='white')
ax.set_ylabel('Collection efficiency (%)', color='white')
ax.set_title('Single-Fiber Collection Efficiency', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Mesh optimization (shade coefficient)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
shade_range = np.linspace(0.1, 0.95, 100)
# For typical fog conditions
Stk_typical = stokes_number(20e-6, 3.0, 0.5e-3)
eff_fiber = collection_efficiency(Stk_typical)

mesh_eff = mesh_collection(shade_range, eff_fiber)
wind_penalty = 1 - shade_range
capture = shade_range * eff_fiber

ax2.plot(shade_range * 100, mesh_eff * 100, color='#22c55e', linewidth=2.5,
         label='Overall efficiency')
ax2.plot(shade_range * 100, capture * 100, color='#3b82f6', linewidth=1.5,
         linestyle='--', label='Capture (ignoring wind)')
ax2.plot(shade_range * 100, wind_penalty * 100, color='#ef4444', linewidth=1.5,
         linestyle='--', label='Wind throughput')
optimal_shade = shade_range[np.argmax(mesh_eff)]
ax2.axvline(optimal_shade * 100, color='#fbbf24', linewidth=1.5, linestyle=':',
            label=f'Optimal: {optimal_shade*100:.0f}%')
ax2.plot(optimal_shade * 100, np.max(mesh_eff) * 100, 'o', color='#fbbf24', markersize=10)
ax2.set_xlabel('Mesh shade coefficient (%)', color='white')
ax2.set_ylabel('Efficiency (%)', color='white')
ax2.set_title('Mesh Design Optimization', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Water yield vs wind speed
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
wind_speeds = np.linspace(0.5, 8, 100)
# Liquid water content of fog: typically 0.05-0.5 g/m^3
LWC_values = [0.05, 0.15, 0.3, 0.5]
collector_area = 1.0  # m^2

for lwc in LWC_values:
    Stk_v = stokes_number(20e-6, wind_speeds, 0.5e-3)
    eff_v = collection_efficiency(Stk_v) * optimal_shade * (1 - optimal_shade)
    # Water yield: LWC × wind × area × efficiency × time
    yield_L_day = lwc * wind_speeds * collector_area * eff_v * 3600 * 24 / 1000  # liters/day
    ax3.plot(wind_speeds, yield_L_day, linewidth=2, label=f'LWC = {lwc} g/m³')

ax3.set_xlabel('Wind speed (m/s)', color='white')
ax3.set_ylabel('Water yield (L/day per m² mesh)', color='white')
ax3.set_title('Expected Water Yield', color='white', fontsize=11)
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
ax3.set_ylim(0, 30)

# Plot 4: Annual fog frequency at Tawang
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
months = np.arange(1, 13)
month_names = ['J','F','M','A','M','J','J','A','S','O','N','D']
fog_days = [12, 10, 8, 10, 15, 22, 25, 24, 20, 12, 8, 10]
fog_hours = [h * 8 for h in fog_days]  # ~8 hours of fog per fog day
rainfall_mm = [20, 30, 60, 120, 200, 350, 400, 380, 280, 100, 25, 10]

ax4.bar(months - 0.15, fog_hours, 0.3, color='#3b82f6', alpha=0.7, label='Fog hours')
ax4_twin = ax4.twinx()
ax4_twin.bar(months + 0.15, rainfall_mm, 0.3, color='#22c55e', alpha=0.7, label='Rainfall (mm)')
ax4.set_xticks(months); ax4.set_xticklabels(month_names)
ax4.set_ylabel('Fog hours/month', color='#3b82f6')
ax4_twin.set_ylabel('Rainfall (mm/month)', color='#22c55e')
ax4.set_title('Tawang: Fog vs Rainfall Seasonality', color='white', fontsize=11)
lines1, labels1 = ax4.get_legend_handles_labels()
lines2, labels2 = ax4_twin.get_legend_handles_labels()
ax4.legend(lines1+lines2, labels1+labels2, fontsize=9, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray'); ax4_twin.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fog Harvesting Design for Tawang:")
print(f"  Optimal mesh shade coefficient: {optimal_shade*100:.0f}%")
print(f"  Fiber diameter: 0.5mm")
print(f"  Collection efficiency (20μm drops, 3 m/s): {collection_efficiency(Stk_typical)*100:.0f}%")
print(f"\
Expected yield (1m² collector):")
for lwc in [0.1, 0.2, 0.3]:
    y = lwc * 3.0 * 1.0 * 0.25 * 3600 * 8 / 1000
    print(f"  LWC={lwc} g/m³, 3 m/s, 8 hrs: {y:.1f} L/day")
print(f"\
Annual fog potential: ~{sum(fog_hours)} fog-hours")
print(f"A 10m² collector could yield 30-100 L/day during fog season.")
print(f"The cloud weaver's clouds become Tawang's water supply.")`,
      challenge: 'Design a complete fog harvesting installation for a Tawang monastery: specify the number and size of collectors needed to supply 500 liters/day for 50 people. Include seasonal variation and a storage tank design for rainless, foggy winter months.',
      successHint: 'Fog harvesting is a beautiful example of appropriate technology — using simple physics (aerosol impaction) to solve a real water supply challenge. The same clouds that the cloud weaver observes become a practical water resource when intercepted by optimized mesh collectors.',
    },
    {
      title: 'Montane cloud forest ecology — where clouds create forests',
      concept: `Montane cloud forests occur where persistent cloud contact provides moisture through direct interception (fog drip) in addition to rainfall. These forests are among the most biodiverse ecosystems on Earth, supporting dense epiphyte communities (orchids, mosses, ferns), unique endemic species, and extraordinary hydrological services. They typically occur between 1500m and 3500m altitude in tropical mountains — exactly Tawang's elevation range.

Cloud immersion provides water through two mechanisms. Canopy interception: cloud droplets deposit directly onto leaves, branches, and epiphytes. A single tree in a cloud forest can intercept 3-5 mm/day of cloud water — equivalent to light rainfall, but occurring even in the dry season. Ground-level fog: when fog fills the forest, it maintains near-100% humidity, reducing transpiration losses and supporting moisture-dependent organisms like mosses and lichens.

Montane cloud forests are among the most threatened ecosystems because they are extremely sensitive to changes in cloud base altitude. Climate warming lifts the cloud base upward (warmer air takes longer to reach saturation). A 1°C warming corresponds to a roughly 150-200m upward shift in cloud base. For a cloud forest at 2000m, this could mean losing cloud contact entirely — converting it from a moisture-rich ecosystem to a much drier one. Species that depend on cloud immersion (many endemic amphibians, epiphytes) would lose their habitat with no uphill migration possible at mountaintops.`,
      analogy: 'A cloud forest is like a building with a permanent fog machine running. The constant moisture supports lush growth on every surface — walls covered in moss, ceilings dripping with ferns. Turn off the fog machine (lift the cloud base) and the ecosystem collapses: the moss dries out, the ferns wilt, and the organisms that depended on constant moisture disappear. Cloud forests live in a narrow atmospheric window that climate change is threatening to close.',
      storyConnection: 'The cloud weaver of Tawang lives in a montane cloud forest, though the story may not name it as such. The moss-draped trees, the orchids clinging to branches, the constant mist — these are all signatures of cloud forest ecology. The weaver\'s world exists because clouds touch the mountains. If climate change lifts those clouds, the weaver\'s forest will become a fundamentally different place.',
      checkQuestion: 'A cloud forest at 2200m receives 1500 mm/year of rainfall plus 600 mm/year of fog drip. Climate warming raises the cloud base by 300m. If fog drip ceases entirely, what percentage of the forest\'s water supply is lost? What ecological consequences would you predict?',
      checkAnswer: 'Fog drip provides 600/(1500+600) = 28.6% of total water. Losing it entirely would reduce water input by nearly a third. Ecological consequences: (1) Epiphytes that depend on constant humidity would die first (many orchids, bromeliads). (2) Moss cover would decline, reducing the "sponge" that stores water between rain events. (3) Soil moisture would drop, stressing tree roots during dry periods. (4) Fire risk would increase as the forest floor dries. (5) Endemic cloud-forest species with no uphill habitat would face extinction. A 28% water loss could trigger a regime shift from cloud forest to drier montane forest.',
      codeIntro: 'Model the water budget of a cloud forest, show how cloud base altitude determines moisture supply, and simulate the effect of warming-induced cloud base lifting.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cloud forest ecology and hydrology model
def cloud_base_altitude(T_surface, RH, lapse_rate=6.5):
    """Estimate cloud base from surface conditions."""
    dew_point_depression = T_surface * (1 - RH / 100) * 5  # simplified
    return 125 * dew_point_depression  # meters

def fog_drip(cloud_base, forest_altitude, wind_speed=3, canopy_factor=1.0):
    """Fog drip depends on whether cloud base is at or below forest altitude."""
    if cloud_base > forest_altitude:
        return 0  # no cloud contact
    immersion_depth = forest_altitude - cloud_base
    # More immersion = more fog drip (saturates)
    drip = canopy_factor * 3 * (1 - np.exp(-immersion_depth / 500)) * wind_speed / 3
    return drip  # mm/day

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Cloud forest water budget
ax = axes[0, 0]
ax.set_facecolor('#111827')
months = np.arange(1, 13)
month_names = ['J','F','M','A','M','J','J','A','S','O','N','D']
rainfall = np.array([20, 30, 60, 120, 200, 350, 400, 380, 280, 100, 25, 10])  # mm
fog_input = np.array([60, 50, 40, 45, 55, 70, 75, 70, 60, 45, 40, 55])  # mm
et = np.array([15, 18, 25, 35, 40, 35, 30, 30, 32, 28, 18, 12])  # mm
streamflow = rainfall + fog_input - et

ax.bar(months - 0.2, rainfall, 0.35, color='#3b82f6', alpha=0.8, label='Rainfall')
ax.bar(months - 0.2, fog_input, 0.35, bottom=rainfall, color='#22c55e', alpha=0.8, label='Fog drip')
ax.bar(months + 0.2, -et, 0.35, color='#ef4444', alpha=0.8, label='Evapotranspiration')
ax.plot(months, streamflow, 'o-', color='#fbbf24', linewidth=2, label='Streamflow')
ax.axhline(0, color='white', linewidth=0.5)
ax.set_xticks(months); ax.set_xticklabels(month_names)
ax.set_ylabel('mm/month', color='white')
ax.set_title('Cloud Forest Water Budget — Tawang', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Fog drip vs cloud base altitude
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
forest_alt = 2200  # m
cloud_bases = np.linspace(1000, 3000, 200)
drip_rates = np.array([fog_drip(cb, forest_alt) for cb in cloud_bases])

ax2.plot(cloud_bases, drip_rates, color='#22c55e', linewidth=2.5)
ax2.fill_between(cloud_bases, 0, drip_rates, color='#22c55e', alpha=0.15)
ax2.axvline(forest_alt, color='#fbbf24', linewidth=2, linestyle='--',
            label=f'Forest altitude ({forest_alt}m)')
ax2.annotate('Cloud below forest\
= fog drip', xy=(1500, 2.5),
            color='#22c55e', fontsize=9, fontweight='bold')
ax2.annotate('Cloud above forest\
= no fog drip', xy=(2500, 0.3),
            color='#ef4444', fontsize=9, fontweight='bold')
ax2.set_xlabel('Cloud base altitude (m)', color='white')
ax2.set_ylabel('Fog drip rate (mm/day)', color='white')
ax2.set_title('Fog Drip Depends on Cloud Contact', color='white', fontsize=11)
ax2.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Climate warming scenario
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
warming = np.linspace(0, 4, 100)  # °C of warming
cloud_lift = 175 * warming  # m upward shift
current_cb = 1800  # current cloud base
new_cb = current_cb + cloud_lift

# Fog drip under warming
drip_future = np.array([fog_drip(cb, forest_alt) for cb in new_cb])
drip_current = fog_drip(current_cb, forest_alt)

ax3.plot(warming, drip_future / drip_current * 100, color='#22c55e', linewidth=2.5,
         label='Fog drip (% of current)')
ax3.plot(warming, (forest_alt - new_cb) / (forest_alt - current_cb) * 100, color='#3b82f6',
         linewidth=2, linestyle='--', label='Cloud immersion depth')
ax3.fill_between(warming, 0, drip_future / drip_current * 100, where=drip_future > 0,
                  color='#22c55e', alpha=0.1)
ax3.axhline(0, color='#ef4444', linewidth=1, linestyle=':')
ax3.axvline(warming[np.argmin(np.abs(new_cb - forest_alt))], color='#ef4444',
            linewidth=1.5, linestyle='--', label='Cloud contact lost')
ax3.set_xlabel('Warming (°C)', color='white')
ax3.set_ylabel('% of current value', color='white')
ax3.set_title('Climate Warming Impact on Cloud Forest', color='white', fontsize=11)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Biodiversity response
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Species richness declines as fog decreases
fog_fraction = np.linspace(1, 0, 100)
epiphytes = 100 * fog_fraction**0.5  # sensitive to fog loss
tree_species = 100 * (0.3 + 0.7 * fog_fraction**2)
endemic_amphibians = 100 * fog_fraction**3  # most sensitive

ax4.plot(fog_fraction * 100, epiphytes, color='#22c55e', linewidth=2.5, label='Epiphytes')
ax4.plot(fog_fraction * 100, tree_species, color='#3b82f6', linewidth=2.5, label='Trees')
ax4.plot(fog_fraction * 100, endemic_amphibians, color='#a855f7', linewidth=2.5,
         label='Endemic amphibians')
ax4.set_xlabel('Fog input (% of current)', color='white')
ax4.set_ylabel('Species richness (% of baseline)', color='white')
ax4.set_title('Biodiversity Response to Fog Loss', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')
ax4.annotate('Epiphytes decline first\
(direct fog dependence)',
            xy=(60, 77), xytext=(30, 50), color='#22c55e', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#22c55e'))

plt.tight_layout()
plt.show()

print("Cloud Forest Ecology — Tawang:")
print(f"  Annual rainfall: {rainfall.sum()} mm")
print(f"  Annual fog drip: {fog_input.sum()} mm ({fog_input.sum()/(rainfall.sum()+fog_input.sum())*100:.0f}% of total)")
print(f"  Annual ET: {et.sum()} mm")
print(f"  Annual streamflow: {streamflow.sum()} mm")
print()
critical_warming = (forest_alt - current_cb) / 175
print(f"  Current cloud base: {current_cb}m")
print(f"  Forest altitude: {forest_alt}m")
print(f"  Cloud contact lost at: +{critical_warming:.1f}°C warming")
print(f"  Cloud lift rate: ~175m per °C")
print(f"\
Cloud forests are climate change sentinels.")
print(f"A {critical_warming:.1f}°C warming could end fog input to Tawang's forests.")`,
      challenge: 'Model the interaction between deforestation and cloud formation: forests release moisture through transpiration, which contributes to cloud formation in a feedback loop. Show how removing the forest reduces cloud formation, which further dries the remaining forest — a deforestation-drought positive feedback.',
      successHint: 'Cloud forests are among Earth\'s most endangered ecosystems because they depend on a specific atmospheric condition — cloud contact at their altitude — that climate change is systematically shifting. Understanding the physics of this dependence is essential for conservation planning.',
    },
    {
      title: 'Moisture transport across the Himalayas — atmospheric rivers and monsoon dynamics',
      concept: `The moisture that sustains Tawang and all of northeastern India originates from the tropical Indian Ocean and Bay of Bengal. The Indian monsoon is one of the largest atmospheric circulation systems on Earth, transporting roughly 3 × 10¹⁷ kg of water vapor annually from ocean to land. This moisture travels in concentrated filaments called atmospheric rivers — narrow bands of high water vapor flux that can be 2000 km long but only 300-500 km wide.

The monsoon moisture transport is driven by the differential heating between the Indian subcontinent (warm) and the Indian Ocean (relatively cool). The thermal contrast creates a pressure gradient that draws moist air northward. The Somali Jet — a low-level wind maximum at 1-2 km altitude over the Arabian Sea — channels this moisture across the Indian Ocean at speeds up to 30 m/s. When this moisture-laden air encounters the Himalayas, it is forced to rise, producing the orographic precipitation that feeds all the rivers of northeast India.

The integrated vapor transport (IVT) quantifies the total moisture flux through a vertical column of atmosphere: IVT = (1/g) × ∫(q × V) dp, where q is specific humidity, V is wind velocity, and the integral is over the atmospheric column. IVT values exceeding 250 kg/m/s are associated with extreme precipitation events. During active monsoon phases, IVT values over northeast India can reach 500+ kg/m/s, producing the extreme rainfall events that cause floods in Assam and Arunachal Pradesh.`,
      analogy: 'Atmospheric rivers are like fire hoses spraying water from the ocean onto the mountains. The monsoon is the pump, the thermal contrast is the power source, and the Himalayas are the wall that the hose hits. When the hose is pointed directly at the mountains (active monsoon), the result is torrential rainfall. When it shifts away (break monsoon), rainfall drops dramatically. The total amount of water transported is staggering — equivalent to several Amazon Rivers flowing through the sky.',
      storyConnection: 'The cloud weaver of Tawang depends on moisture that has traveled thousands of kilometers from the Bay of Bengal. The clouds the weaver sees are the visible endpoints of invisible atmospheric rivers — vast streams of moisture flowing through the sky. Each cloud above Tawang carries water that began as ocean evaporation, was transported by the monsoon circulation, and was forced upward by the Himalayas. The cloud weaver\'s art is the final chapter of a journey that spans an ocean and a continent.',
      checkQuestion: 'An atmospheric river has IVT = 400 kg/m/s and is 400 km wide. If all its moisture precipitated out over a mountain range, how much rainfall (in mm) would fall per meter of mountain frontage per day? Assume the atmospheric river moves at 10 m/s.',
      checkAnswer: 'Total moisture flux through the cross-section: IVT × width = 400 × 400,000 = 1.6 × 10⁸ kg/s. This is 1.6 × 10⁵ m³/s of water — about 4× the Amazon River discharge. Per meter of mountain front: 400 kg/m/s of water. Over 24 hours: 400 × 86400 = 34,560,000 g/m = 34,560 kg/m. Spread over 1m width: 34.56 m of rain equivalent — but only a fraction (10-30%) actually precipitates out. At 20% efficiency: ~6,900 mm. This is why single events in Cherrapunji can dump 1,000+ mm in 24 hours.',
      codeIntro: 'Model monsoon moisture transport from the Bay of Bengal to Tawang, computing integrated vapor transport and showing how atmospheric rivers deliver water to the Himalayas.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Atmospheric moisture transport model
g = 9.81

def specific_humidity(T_celsius, RH, P_hPa):
    """Compute specific humidity (g/kg) from T, RH, pressure."""
    es = 6.112 * np.exp(17.67 * T_celsius / (T_celsius + 243.5))
    e = RH / 100 * es
    return 622 * e / (P_hPa - 0.378 * e)

def compute_IVT(q_profile, wind_profile, pressure_levels):
    """Integrated Vapor Transport (kg/m/s)."""
    ivt = 0
    for i in range(len(pressure_levels) - 1):
        dp = abs(pressure_levels[i+1] - pressure_levels[i]) * 100  # Pa
        q_mean = (q_profile[i] + q_profile[i+1]) / 2 / 1000  # kg/kg
        v_mean = (wind_profile[i] + wind_profile[i+1]) / 2
        ivt += q_mean * v_mean * dp / g
    return ivt

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Moisture transport path — Bay of Bengal to Tawang
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Simplified path: 1500 km from Bay of Bengal to Tawang
distances = np.linspace(0, 1500, 100)  # km
terrain = np.zeros_like(distances)
terrain[distances > 800] = 200 * (distances[distances > 800] - 800) / 100
terrain[distances > 1000] = 2000 + 1000 * np.sin(np.pi * (distances[distances > 1000] - 1000) / 500)
terrain = np.maximum(terrain, 0)
terrain = np.minimum(terrain, 3500)

# Moisture content decreases as air rises
initial_moisture = 18  # g/kg
moisture_along_path = initial_moisture * np.exp(-terrain / 5000)

ax.fill_between(distances, 0, terrain, color='#4a3728', alpha=0.6)
ax.plot(distances, terrain, color='#8B6914', linewidth=2)
ax_twin = ax.twinx()
ax_twin.plot(distances, moisture_along_path, color='#3b82f6', linewidth=2.5, linestyle='--')
ax_twin.fill_between(distances, 0, moisture_along_path, color='#3b82f6', alpha=0.1)

# Labels
ax.text(100, 200, 'Bay of\
Bengal', color='#3b82f6', fontsize=10, fontweight='bold')
ax.text(500, 200, 'Assam\
Plains', color='#22c55e', fontsize=10, fontweight='bold')
ax.text(1200, 3000, 'Tawang', color='#fbbf24', fontsize=10, fontweight='bold')
# Wind arrows
for x_pos in range(100, 1400, 200):
    idx = np.argmin(np.abs(distances - x_pos))
    y_pos = terrain[idx] + 500
    ax.annotate('', xy=(x_pos + 100, y_pos), xytext=(x_pos, y_pos),
               arrowprops=dict(arrowstyle='->', color='white', lw=1.5))
ax.set_xlabel('Distance from coast (km)', color='white')
ax.set_ylabel('Elevation (m)', color='white')
ax_twin.set_ylabel('Moisture content (g/kg)', color='#3b82f6')
ax.set_title('Monsoon Moisture Transport to Tawang', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray'); ax_twin.tick_params(colors='gray')

# Plot 2: IVT seasonal cycle
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
months = np.arange(1, 13)
month_names = ['J','F','M','A','M','J','J','A','S','O','N','D']
# Simulated IVT over Tawang
ivt_monthly = np.array([50, 60, 80, 150, 250, 400, 450, 420, 350, 200, 80, 40])
rainfall_monthly = np.array([20, 30, 60, 120, 200, 350, 400, 380, 280, 100, 25, 10])

ax2.bar(months - 0.15, ivt_monthly, 0.3, color='#a855f7', alpha=0.7, label='IVT (kg/m/s)')
ax2_twin = ax2.twinx()
ax2_twin.bar(months + 0.15, rainfall_monthly, 0.3, color='#3b82f6', alpha=0.7, label='Rainfall (mm)')
ax2.axhline(250, color='#ef4444', linewidth=1, linestyle='--', label='Extreme precip threshold')
ax2.set_xticks(months); ax2.set_xticklabels(month_names)
ax2.set_ylabel('IVT (kg/m/s)', color='#a855f7')
ax2_twin.set_ylabel('Rainfall (mm)', color='#3b82f6')
ax2.set_title('IVT and Rainfall — Seasonal Cycle', color='white', fontsize=11)
lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1+lines2, labels1+labels2, fontsize=8, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray'); ax2_twin.tick_params(colors='gray')

# Plot 3: Atmospheric river cross-section
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Vertical profile of moisture and wind
pressures = np.array([1000, 925, 850, 700, 500, 300, 200])  # hPa
heights_km = np.array([0, 0.75, 1.5, 3, 5.5, 9, 12])
# Active monsoon profile
q_active = np.array([18, 16, 14, 8, 3, 0.5, 0.1])  # g/kg
wind_active = np.array([5, 10, 15, 12, 8, 5, 3])  # m/s
# Break monsoon
q_break = np.array([12, 10, 7, 4, 2, 0.3, 0.05])
wind_break = np.array([3, 5, 6, 5, 4, 3, 2])

ax3.plot(q_active, heights_km, 'o-', color='#3b82f6', linewidth=2.5,
         label=f'Active (IVT={compute_IVT(q_active, wind_active, pressures):.0f})')
ax3.plot(q_break, heights_km, 's--', color='#f59e0b', linewidth=2.5,
         label=f'Break (IVT={compute_IVT(q_break, wind_break, pressures):.0f})')
ax3.fill_betweenx(heights_km, q_break, q_active, alpha=0.15, color='#3b82f6')
ax3.axhline(3.048, color='#fbbf24', linewidth=1, linestyle=':', label='Tawang altitude')
ax3.set_xlabel('Specific humidity (g/kg)', color='white')
ax3.set_ylabel('Altitude (km)', color='white')
ax3.set_title('Moisture Profile: Active vs Break Monsoon', color='white', fontsize=11)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Atmospheric river visualization (plan view)
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Simplified plan view of atmospheric river
np.random.seed(42)
y_grid = np.linspace(5, 30, 100)  # latitude (°N)
x_grid = np.linspace(80, 100, 100)  # longitude (°E)
Y, X = np.meshgrid(y_grid, x_grid)

# Atmospheric river: concentrated band of moisture
ar_center_lat = 15 + 0.3 * (X - 85)  # tilted NE
ar_width = 4  # degrees
IVT_field = 400 * np.exp(-0.5 * ((Y - ar_center_lat) / ar_width)**2)
IVT_field *= np.exp(-0.02 * (X - 85)**2)

im = ax4.contourf(x_grid, y_grid, IVT_field.T, levels=20, cmap='Blues')
plt.colorbar(im, ax=ax4, label='IVT (kg/m/s)')
ax4.plot(91.5, 27.5, '*', color='#fbbf24', markersize=15, markeredgecolor='white')
ax4.text(92, 27.5, 'Tawang', color='#fbbf24', fontsize=10, fontweight='bold')
# Add approximate coastline
ax4.plot([88, 90, 92, 95], [22, 21, 20, 18], color='#22c55e', linewidth=2)
ax4.set_xlabel('Longitude (°E)', color='white')
ax4.set_ylabel('Latitude (°N)', color='white')
ax4.set_title('Atmospheric River — Moisture Highway', color='white', fontsize=11)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Moisture Transport to Tawang:")
IVT_active = compute_IVT(q_active, wind_active, pressures)
IVT_break = compute_IVT(q_break, wind_break, pressures)
print(f"  Active monsoon IVT: {IVT_active:.0f} kg/m/s")
print(f"  Break monsoon IVT: {IVT_break:.0f} kg/m/s")
print(f"  Ratio: {IVT_active/IVT_break:.1f}× more moisture during active phase")
print()
print(f"  Annual rainfall at Tawang: ~{rainfall_monthly.sum()} mm")
print(f"  ~{sum(rainfall_monthly[5:9])/rainfall_monthly.sum()*100:.0f}% falls in Jun-Sep (monsoon)")
print()
print(f"  The atmospheric river delivers ~{IVT_active * 400e3:.1e} kg/s of water")
print(f"  across a 400km front — equivalent to {IVT_active * 400e3 / 1000:.0f} m³/s")
print(f"  That is {IVT_active * 400e3 / 1000 / 200000:.0f}× the Amazon River!")
print()
print(f"Every cloud the weaver sees arrived via an atmospheric river.")
print(f"Tawang's water, food, and forests all depend on this invisible highway.")`,
      challenge: 'Model how climate change affects the monsoon moisture transport: increase sea surface temperature by 2°C (more evaporation) but also shift the monsoon circulation pattern. Show that total IVT may increase (more extreme events) while monsoon reliability decreases (more variability).',
      successHint: 'Atmospheric moisture transport connects the global water cycle to local precipitation. Understanding IVT and atmospheric rivers explains why some places receive extreme rainfall while others nearby stay dry — and why changes in ocean temperatures thousands of kilometers away can alter the water supply of a mountain monastery.',
    },
    {
      title: 'Atmospheric rivers — extreme moisture transport events',
      concept: `Atmospheric rivers (ARs) are narrow corridors of concentrated water vapor transport in the lower troposphere. They are typically 300-500 km wide but extend 2000+ km in length, carrying water vapor equivalent to 7-15 times the average flow of the Mississippi River. ARs are responsible for 90% of poleward moisture transport and play a critical role in extreme precipitation events worldwide.

AR identification uses the IVT field from reanalysis data or weather models. An AR is defined as a connected region where IVT exceeds a threshold (typically 250 kg/m/s) that is at least 2000 km long and less than 1000 km wide. The AR scale (1-5, similar to hurricane categories) classifies intensity: AR1 is weak and beneficial (replenishing water supplies), while AR5 is extreme and hazardous (causing flooding and landslides).

In the Indian monsoon context, atmospheric rivers are the primary mechanism for extreme rainfall events over northeast India. When an AR is oriented perpendicular to the Himalayan front, orographic enhancement produces catastrophic rainfall. The 2022 Assam floods, which displaced millions of people, were associated with an AR event delivering IVT > 600 kg/m/s to the region for multiple days. Understanding AR dynamics is essential for flood forecasting and disaster preparedness in places like Tawang.`,
      analogy: 'An atmospheric river is like a conveyor belt at a factory, but carrying water instead of products. The belt runs from the warm ocean (the factory) across thousands of kilometers of sky to the mountains (the delivery point). On most days, the belt runs at normal speed. During an AR event, the belt runs at maximum speed, delivering enormous volumes of water that overwhelm the mountain\'s ability to absorb it — the result is flooding.',
      storyConnection: 'The cloud weaver of Tawang has seen days when the clouds are thicker, lower, and more persistent than usual — when rain falls without stopping for days and the mountain streams become torrents. These are atmospheric river events, when the invisible moisture highway delivers water at rates that overwhelm the landscape. The weaver\'s traditional knowledge of weather patterns encodes generational experience of these extreme moisture transport events.',
      checkQuestion: 'An atmospheric river delivers IVT = 500 kg/m/s to a 300 km-wide mountain front for 48 hours. If 25% of the transported moisture precipitates, what is the total rainfall over the mountain area (assume 50 km deep on the windward side)?',
      checkAnswer: 'Total moisture flux: 500 kg/m/s × 300,000 m × 48 × 3600 s = 2.59 × 10¹³ kg of water transported. At 25% precipitation efficiency: 6.48 × 10¹² kg = 6.48 × 10⁹ m³ of water. Area = 300 km × 50 km = 1.5 × 10¹⁰ m². Rainfall depth = 6.48 × 10⁹ / 1.5 × 10¹⁰ = 0.432 m = 432 mm in 48 hours. That is 216 mm/day — extreme rainfall that would trigger flooding and landslides. This is comparable to actual extreme events in northeast India.',
      codeIntro: 'Detect and characterize atmospheric rivers, compute their moisture flux, and model their impact when they hit the Himalayan front at Tawang.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Atmospheric River detection and impact model
np.random.seed(42)
g = 9.81

# Simulate a 10-day time series of IVT at Tawang
hours = np.arange(0, 240)  # 10 days in hours
days = hours / 24

# Normal monsoon baseline with an AR event on days 4-6
ivt_baseline = 150 + 50 * np.sin(2 * np.pi * hours / 24)  # diurnal variation
ar_signal = 400 * np.exp(-0.5 * ((hours - 120) / 20)**2)  # AR centered at day 5
ivt_total = ivt_baseline + ar_signal + np.random.normal(0, 20, len(hours))
ivt_total = np.maximum(ivt_total, 50)

# Rainfall response (delayed and filtered version of IVT)
rainfall_rate = np.zeros_like(ivt_total)
for i in range(2, len(ivt_total)):
    # Rainfall = orographic efficiency × IVT above threshold
    excess = max(ivt_total[i-2] - 150, 0)  # 2-hour lag, threshold
    rainfall_rate[i] = 0.05 * excess + np.random.normal(0, 1)
rainfall_rate = np.maximum(rainfall_rate, 0)

# Cumulative rainfall
cumulative_rain = np.cumsum(rainfall_rate)

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')

# Plot 1: IVT time series with AR detection
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(days, ivt_total, color='#3b82f6', linewidth=1.5)
ax.fill_between(days, 0, ivt_total, where=ivt_total > 250, color='#ef4444', alpha=0.3,
                label='AR event (IVT > 250)')
ax.fill_between(days, 0, ivt_total, where=ivt_total <= 250, color='#3b82f6', alpha=0.1)
ax.axhline(250, color='#ef4444', linewidth=1.5, linestyle='--', label='AR threshold')
ax.axhline(500, color='#dc2626', linewidth=1, linestyle=':', label='Extreme AR')
ax.set_xlabel('Days', color='white')
ax.set_ylabel('IVT (kg/m/s)', color='white')
ax.set_title('10-Day IVT Time Series — AR Detection', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Rainfall response
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.bar(days, rainfall_rate, width=1/24, color='#3b82f6', alpha=0.6)
ax2_twin = ax2.twinx()
ax2_twin.plot(days, cumulative_rain, color='#22c55e', linewidth=2.5, label='Cumulative')
ax2.set_xlabel('Days', color='white')
ax2.set_ylabel('Rainfall rate (mm/hr)', color='#3b82f6')
ax2_twin.set_ylabel('Cumulative rainfall (mm)', color='#22c55e')
ax2.set_title('Rainfall Response to AR Event', color='white', fontsize=11)
ax2_twin.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray'); ax2_twin.tick_params(colors='gray')

# Plot 3: AR scale classification
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# AR scale based on IVT and duration
ar_categories = {
    'AR1 (Weak)':    {'ivt': (250, 350), 'duration': (12, 24), 'color': '#22c55e', 'impact': 'Beneficial'},
    'AR2 (Moderate)': {'ivt': (350, 450), 'duration': (12, 36), 'color': '#3b82f6', 'impact': 'Mostly beneficial'},
    'AR3 (Strong)':  {'ivt': (450, 550), 'duration': (24, 48), 'color': '#f59e0b', 'impact': 'Balance benefit/hazard'},
    'AR4 (Extreme)': {'ivt': (550, 700), 'duration': (24, 72), 'color': '#ef4444', 'impact': 'Primarily hazardous'},
    'AR5 (Exceptional)': {'ivt': (700, 1000), 'duration': (48, 96), 'color': '#dc2626', 'impact': 'Catastrophic'},
}

for i, (name, props) in enumerate(ar_categories.items()):
    ivt_lo, ivt_hi = props['ivt']
    dur_lo, dur_hi = props['duration']
    rect = plt.Rectangle((dur_lo, ivt_lo), dur_hi-dur_lo, ivt_hi-ivt_lo,
                          facecolor=props['color'], alpha=0.4, edgecolor='white', linewidth=1)
    ax3.add_patch(rect)
    ax3.text((dur_lo+dur_hi)/2, (ivt_lo+ivt_hi)/2, name.split('(')[1].rstrip(')'),
            ha='center', va='center', color='white', fontsize=9, fontweight='bold')

# Mark current event
ar_peak = ivt_total.max()
ar_duration = np.sum(ivt_total > 250)  # hours
ax3.plot(ar_duration, ar_peak, '*', color='#fbbf24', markersize=15, markeredgecolor='white',
         label=f'Current: {ar_duration}h, {ar_peak:.0f} kg/m/s')
ax3.set_xlim(0, 100); ax3.set_ylim(200, 1000)
ax3.set_xlabel('AR duration (hours)', color='white')
ax3.set_ylabel('Peak IVT (kg/m/s)', color='white')
ax3.set_title('Atmospheric River Scale', color='white', fontsize=11)
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Historical AR frequency at Tawang
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
months_arr = np.arange(1, 13)
month_names = ['J','F','M','A','M','J','J','A','S','O','N','D']
# Simulated AR events per month (based on monsoon activity)
ar_events = [0.2, 0.3, 0.5, 1.2, 2.5, 4.0, 5.5, 5.0, 3.5, 1.5, 0.3, 0.1]
ar_rain_pct = [5, 8, 15, 25, 40, 55, 60, 58, 50, 30, 10, 3]

ax4.bar(months_arr - 0.15, ar_events, 0.3, color='#ef4444', alpha=0.7, label='AR events/month')
ax4_twin = ax4.twinx()
ax4_twin.plot(months_arr, ar_rain_pct, 'o-', color='#3b82f6', linewidth=2.5,
              label='% of rain from ARs')
ax4.set_xticks(months_arr); ax4.set_xticklabels(month_names)
ax4.set_ylabel('AR events per month', color='#ef4444')
ax4_twin.set_ylabel('% of total rainfall from ARs', color='#3b82f6')
ax4.set_title('AR Frequency and Rainfall Contribution', color='white', fontsize=11)
lines1, labels1 = ax4.get_legend_handles_labels()
lines2, labels2 = ax4_twin.get_legend_handles_labels()
ax4.legend(lines1+lines2, labels1+labels2, fontsize=8, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray'); ax4_twin.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# AR event analysis
ar_mask = ivt_total > 250
ar_hours = np.sum(ar_mask)
ar_rain = rainfall_rate[ar_mask].sum()
total_rain = rainfall_rate.sum()
print("Atmospheric River Event Analysis:")
print(f"  AR duration: {ar_hours} hours ({ar_hours/24:.1f} days)")
print(f"  Peak IVT: {ivt_total.max():.0f} kg/m/s")
print(f"  AR rainfall: {ar_rain:.0f} mm ({ar_rain/total_rain*100:.0f}% of 10-day total)")
print(f"  Total 10-day rainfall: {total_rain:.0f} mm")
print()
print("AR Scale Classification:")
for name, props in ar_categories.items():
    print(f"  {name:<25} IVT {props['ivt'][0]}-{props['ivt'][1]}, {props['impact']}")
print()
print(f"Annual AR statistics for Tawang region:")
print(f"  Total AR events: ~{sum(ar_events):.0f}")
print(f"  Peak month: July ({ar_events[6]:.1f} events)")
print(f"  ARs deliver ~{sum(e*r for e,r in zip(ar_events, ar_rain_pct))/sum(ar_events):.0f}% of monsoon rainfall")
print(f"\
ARs are both blessing (water supply) and curse (flood risk).")
print(f"The cloud weaver's heaviest clouds are atmospheric rivers made visible.")`,
      challenge: 'Build an AR early warning system: use the IVT time series and its rate of change to predict AR arrival 12-24 hours in advance. Implement a simple threshold-based warning system with green/yellow/orange/red alerts and estimate its false alarm rate from the simulated data.',
      successHint: 'Atmospheric rivers are one of the most important discoveries in modern meteorology. They explain why extreme rainfall events are concentrated in time and space, and why mountain regions like Tawang experience both devastating floods and essential water supply from the same atmospheric phenomenon.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (cloud and weather fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for high-altitude meteorology, fog physics, and atmospheric transport simulations. Click to start.</p>
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
