import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudNamerLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Atmospheric thermodynamics — the adiabatic lapse rate',
      concept: `When air rises, it expands because atmospheric pressure decreases with altitude. This expansion cools the air — without any heat being exchanged with the surroundings. This is adiabatic cooling, and it is the fundamental mechanism behind cloud formation.

The dry adiabatic lapse rate (DALR) is approximately 9.8°C per kilometer of ascent. This comes directly from the first law of thermodynamics applied to a rising air parcel: dT/dz = -g/cp, where g is gravitational acceleration (9.81 m/s²) and cp is the specific heat of dry air at constant pressure (1005 J/kg/K). As long as the air is unsaturated (relative humidity < 100%), it cools at this rate.

Once the rising air cools to its dew point, water vapor begins condensing. Condensation releases latent heat (2.5 × 10⁶ J/kg), which partially offsets the adiabatic cooling. The saturated adiabatic lapse rate (SALR) is therefore less than the DALR — typically 5-6°C/km, though it depends on temperature (warmer air holds more moisture, so more latent heat is released). The altitude where condensation begins is the lifting condensation level (LCL) — this is the cloud base altitude. You can estimate it: LCL ≈ 125 × (T - Td) meters, where T is surface temperature and Td is dew point.`,
      analogy: 'Imagine pumping up a bicycle tire. The pump gets hot because compressing air heats it (adiabatic heating). Now reverse the process: when you release compressed air from the tire, it feels cold. That is adiabatic cooling. A rising air parcel is like air being released from a compressed state — as it ascends into lower pressure, it expands and cools. No external cooling is needed; the expansion itself does the work.',
      storyConnection: 'The cloud namer watches clouds form and dissipate across Assam\'s skies. Every cloud begins the same way: air rises, cools adiabatically, and reaches its dew point. The altitude at which a specific cloud forms tells you the temperature and humidity of the air that created it. The cloud namer\'s skill is reading these atmospheric signals — each cloud type is a fingerprint of the thermodynamic conditions that produced it.',
      checkQuestion: 'Surface temperature is 30°C and dew point is 18°C. At what altitude will clouds form? If air continues rising, what is its cooling rate above the cloud base?',
      checkAnswer: 'LCL ≈ 125 × (30 - 18) = 1500 meters. Below cloud base, air cools at the DALR (9.8°C/km). At 1500m, temperature = 30 - 9.8 × 1.5 = 15.3°C ≈ dew point (the air has cooled to saturation). Above cloud base, it cools at the SALR (~5.5°C/km) because latent heat release partially offsets the cooling. The transition from DALR to SALR at the LCL is what makes cloud base altitude so predictable.',
      codeIntro: 'Model atmospheric temperature profiles, compute the LCL, and visualize how air parcels cool as they rise through the atmosphere.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Atmospheric thermodynamics
g = 9.81        # m/s^2
cp = 1005       # J/(kg·K) specific heat of dry air
L = 2.5e6       # J/kg latent heat of vaporization
Rv = 461.5      # J/(kg·K) gas constant for water vapor
Rd = 287.05     # J/(kg·K) gas constant for dry air

DALR = g / cp * 1000  # °C per km

def saturation_vapor_pressure(T_celsius):
    """Magnus formula for saturation vapor pressure (Pa)."""
    return 611.2 * np.exp(17.67 * T_celsius / (T_celsius + 243.5))

def dew_point(T, RH):
    """Compute dew point from temperature and relative humidity."""
    es = saturation_vapor_pressure(T)
    e = RH / 100 * es
    return 243.5 * np.log(e / 611.2) / (17.67 - np.log(e / 611.2))

def compute_LCL(T_surface, Td_surface):
    """Lifting condensation level in meters."""
    return 125 * (T_surface - Td_surface)

def saturated_lapse_rate(T_celsius):
    """Temperature-dependent saturated adiabatic lapse rate (°C/km)."""
    T_K = T_celsius + 273.15
    es = saturation_vapor_pressure(T_celsius)
    ws = 0.622 * es / (101325 - es)  # mixing ratio
    num = g * (1 + L * ws / (Rd * T_K))
    den = cp + L**2 * ws / (Rv * T_K**2)
    return num / den * 1000  # °C/km

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Temperature profile of rising air parcel
ax = axes[0, 0]
ax.set_facecolor('#111827')
T_surface = 30  # °C
RH = 60  # %
Td = dew_point(T_surface, RH)
LCL = compute_LCL(T_surface, Td)

altitudes = np.linspace(0, 8000, 1000)  # meters
T_parcel = np.zeros_like(altitudes)
T_parcel[0] = T_surface

for i in range(1, len(altitudes)):
    dz = (altitudes[i] - altitudes[i-1]) / 1000  # km
    if altitudes[i] < LCL:
        T_parcel[i] = T_parcel[i-1] - DALR * dz
    else:
        slr = saturated_lapse_rate(T_parcel[i-1])
        T_parcel[i] = T_parcel[i-1] - slr * dz

# Environmental lapse rate (typical atmosphere)
ELR = 6.5  # °C/km
T_env = T_surface - ELR * altitudes / 1000

ax.plot(T_parcel, altitudes / 1000, color='#ef4444', linewidth=2.5, label='Rising parcel')
ax.plot(T_env, altitudes / 1000, color='#3b82f6', linewidth=2.5, label='Environment (ELR=6.5°C/km)')
ax.axhline(LCL / 1000, color='#fbbf24', linewidth=1.5, linestyle='--',
           label=f'Cloud base (LCL = {LCL:.0f}m)')
ax.fill_betweenx(altitudes / 1000, T_parcel, T_env,
                  where=T_parcel > T_env, alpha=0.1, color='#ef4444', label='Unstable (parcel warmer)')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Adiabatic Cooling of Rising Air', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.annotate(f'DALR: {DALR:.1f}°C/km', xy=(25, 0.5), color='#ef4444', fontsize=9)
ax.annotate(f'SALR: ~{saturated_lapse_rate(15):.1f}°C/km', xy=(10, 3), color='#ef4444', fontsize=9)

# Plot 2: LCL for different conditions
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
temps = np.linspace(15, 40, 6)
RH_range = np.linspace(30, 95, 100)
for T in temps:
    LCLs = []
    for rh in RH_range:
        td = dew_point(T, rh)
        LCLs.append(compute_LCL(T, td))
    ax2.plot(RH_range, np.array(LCLs) / 1000, linewidth=2, label=f'T={T:.0f}°C')
ax2.set_xlabel('Relative humidity (%)', color='white')
ax2.set_ylabel('Cloud base altitude (km)', color='white')
ax2.set_title('Cloud Base Height vs Humidity & Temperature', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: SALR variation with temperature
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
temp_range = np.linspace(-30, 40, 200)
salr_values = np.array([saturated_lapse_rate(t) for t in temp_range])
ax3.plot(temp_range, salr_values, color='#22c55e', linewidth=2.5, label='SALR')
ax3.axhline(DALR, color='#ef4444', linewidth=2, linestyle='--', label=f'DALR = {DALR:.1f}°C/km')
ax3.fill_between(temp_range, salr_values, DALR, alpha=0.15, color='#f59e0b',
                  label='Latent heat offset')
ax3.set_xlabel('Temperature (°C)', color='white')
ax3.set_ylabel('Lapse rate (°C/km)', color='white')
ax3.set_title('Saturated vs Dry Adiabatic Lapse Rate', color='white', fontsize=11)
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
ax3.annotate('Warm air: more moisture\\n→ more latent heat\\n→ lower SALR',
            xy=(30, salr_values[np.argmin(np.abs(temp_range - 30))]),
            xytext=(10, 4), color='#fbbf24', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#fbbf24'))

# Plot 4: Stability analysis
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Three atmospheric profiles
alt_km = np.linspace(0, 5, 100)
stable_env = 30 - 4 * alt_km       # ELR < SALR (stable)
conditional = 30 - 7 * alt_km      # SALR < ELR < DALR (conditionally unstable)
unstable_env = 30 - 11 * alt_km    # ELR > DALR (absolutely unstable)

parcel_dry = 30 - DALR * alt_km
parcel_sat = 30 - (DALR * np.minimum(alt_km, 1.5) + 5.5 * np.maximum(alt_km - 1.5, 0))

ax4.plot(stable_env, alt_km, color='#3b82f6', linewidth=2.5, label='Stable (ELR=4°C/km)')
ax4.plot(conditional, alt_km, color='#f59e0b', linewidth=2.5, label='Conditional (ELR=7°C/km)')
ax4.plot(unstable_env, alt_km, color='#ef4444', linewidth=2.5, label='Unstable (ELR=11°C/km)')
ax4.plot(parcel_dry, alt_km, 'k--', linewidth=1.5, label='DALR')
ax4.plot(parcel_sat, alt_km, 'k:', linewidth=1.5, label='DALR→SALR')
ax4.set_xlabel('Temperature (°C)', color='white')
ax4.set_ylabel('Altitude (km)', color='white')
ax4.set_title('Atmospheric Stability Classification', color='white', fontsize=11)
ax4.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Atmospheric Thermodynamics Summary:")
print(f"  DALR = g/cp = {g}/{cp} × 1000 = {DALR:.1f}°C/km")
print(f"  SALR at 0°C:  {saturated_lapse_rate(0):.1f}°C/km")
print(f"  SALR at 20°C: {saturated_lapse_rate(20):.1f}°C/km")
print(f"  SALR at 35°C: {saturated_lapse_rate(35):.1f}°C/km")
print(f"\\nFor today's conditions (T={T_surface}°C, RH={RH}%):")
print(f"  Dew point: {Td:.1f}°C")
print(f"  Cloud base (LCL): {LCL:.0f}m ({LCL/1000:.1f}km)")
print(f"  Cloud base temperature: {T_surface - DALR * LCL/1000:.1f}°C")
print(f"\\nStability:")
print(f"  If ELR < SALR → Absolutely stable (no convection)")
print(f"  If SALR < ELR < DALR → Conditionally unstable")
print(f"  If ELR > DALR → Absolutely unstable (strong convection)")`,
      challenge: 'Add a virtual sounding: model a specific atmospheric profile with an inversion layer (temperature increase with altitude) at 2km. Show how the inversion caps cloud growth, creating a flat-topped stratocumulus deck typical of Assam\'s winter skies.',
      successHint: 'The adiabatic lapse rate is the Rosetta Stone of atmospheric science. Once you understand why rising air cools and what happens when it reaches saturation, you can explain every cloud, every thunderstorm, and every weather pattern on Earth.',
    },
    {
      title: 'Cloud microphysics — how water droplets and ice crystals form',
      concept: `Reaching the dew point is necessary but not sufficient for cloud formation. Water vapor does not spontaneously condense into droplets in clean air — it needs a surface to condense on. These surfaces are provided by cloud condensation nuclei (CCN): tiny aerosol particles (0.1-1 μm) of sea salt, sulfate, dust, or organic compounds. Without CCN, air can become supersaturated well past 100% humidity without forming clouds.

The Kohler equation describes the competition between two effects on a growing droplet. The Kelvin effect: the curved surface of a small droplet has higher vapor pressure than a flat surface, making tiny droplets tend to evaporate. The Raoult effect: dissolved solute (from the CCN) lowers the vapor pressure, encouraging condensation. The critical supersaturation — the minimum supersaturation needed to activate a CCN into a growing cloud droplet — depends on the nucleus size and composition.

Once activated, cloud droplets grow by diffusion of water vapor but can only reach about 10-20 μm this way. Rain-sized drops (1-5 mm) are 100× larger and contain 10⁶ times more water. To make rain, additional processes are needed. In warm clouds, collision-coalescence dominates: larger droplets fall faster and sweep up smaller ones. In cold clouds, the Bergeron process exploits the difference in saturation vapor pressure over ice vs liquid water: ice crystals grow at the expense of supercooled water droplets, eventually becoming heavy enough to fall as precipitation.`,
      analogy: 'Cloud formation is like making rock candy. You dissolve sugar (water vapor) in hot water (warm air). As the solution cools (air rises), it becomes supersaturated. But crystals do not form without a seed — you need a string or stick (CCN) for the sugar to crystallize on. Once started, the crystal grows rapidly. Cloud droplets forming on CCN are exactly like sugar crystals growing on a string.',
      storyConnection: 'The cloud namer knows that cumulus clouds have different textures depending on the aerosols that seeded them. Marine clouds (seeded by sea salt) have more, smaller droplets than continental clouds (seeded by dust). Assam sits at the intersection of maritime moisture from the Bay of Bengal and continental dust from the Indo-Gangetic plain — its clouds carry the microphysical signature of both sources.',
      checkQuestion: 'Why do clouds forming over clean oceans tend to produce rain more easily than clouds forming over polluted cities, even with the same total water content?',
      checkAnswer: 'Clean ocean air has fewer CCN, so the same amount of water condenses onto fewer droplets, making each droplet larger. Larger droplets collide and coalesce more efficiently, producing rain faster. Polluted city air has many more CCN, distributing the same water across many tiny droplets. These small droplets have low collision efficiency and may never reach rain size — the cloud persists longer but rains less. This is the Twomey effect, and it is a key mechanism in aerosol-cloud interactions and climate.',
      codeIntro: 'Model the Kohler curve, CCN activation, and droplet growth by diffusion and collision-coalescence.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cloud microphysics model
# Kohler equation: supersaturation = Kelvin_term - Raoult_term

def kohler_curve(r, r_dry, kappa=0.6):
    """Kohler curve: supersaturation as function of droplet radius."""
    # r: wet radius (m), r_dry: dry CCN radius (m)
    # kappa: hygroscopicity parameter
    sigma = 0.072       # surface tension of water (N/m)
    rho_w = 997          # water density (kg/m^3)
    Rv = 461.5           # water vapor gas constant
    T = 293              # temperature (K)
    Mw = 0.018           # molar mass water (kg/mol)

    # Kelvin term (curvature effect)
    A = 2 * sigma * Mw / (rho_w * 8.314 * T)
    kelvin = np.exp(A / r) - 1

    # Raoult term (solute effect, simplified kappa-Kohler)
    raoult = kappa * (r_dry**3) / (r**3 - r_dry**3 + 1e-30)

    return kelvin - raoult

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Kohler curves for different CCN sizes
ax = axes[0, 0]
ax.set_facecolor('#111827')
r = np.linspace(0.01e-6, 5e-6, 1000)  # droplet radius in meters
ccn_sizes = [(0.02e-6, 'r=20nm'), (0.05e-6, 'r=50nm'),
             (0.1e-6, 'r=100nm'), (0.2e-6, 'r=200nm')]
colors_ccn = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

for (r_dry, label), color in zip(ccn_sizes, colors_ccn):
    S = kohler_curve(r, r_dry) * 100  # convert to %
    # Clip for display
    S = np.clip(S, -5, 3)
    ax.plot(r * 1e6, S, color=color, linewidth=2, label=label)
    # Mark critical supersaturation
    valid = r > r_dry * 3
    if np.any(valid):
        S_valid = kohler_curve(r[valid], r_dry) * 100
        if len(S_valid) > 0 and np.max(S_valid) > 0:
            r_crit = r[valid][np.argmax(S_valid)]
            S_crit = np.max(S_valid)
            ax.plot(r_crit * 1e6, S_crit, 'o', color=color, markersize=8)

ax.axhline(0, color='white', linewidth=0.5, linestyle='--')
ax.set_xlabel('Droplet radius (μm)', color='white')
ax.set_ylabel('Supersaturation (%)', color='white')
ax.set_title('Kohler Curves — CCN Activation', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 3)
ax.set_ylim(-2, 2)
ax.tick_params(colors='gray')

# Plot 2: Droplet growth by diffusion
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
# Growth law: r^2 = r0^2 + 2*G*S*t
# G ≈ 1e-10 m^2/s for typical conditions
G = 1e-10  # diffusion growth parameter
S_env = 0.005  # 0.5% supersaturation
time_sec = np.linspace(0, 3600, 500)  # 1 hour
r0_vals = [0.5e-6, 1e-6, 2e-6, 5e-6]
for r0 in r0_vals:
    r_t = np.sqrt(r0**2 + 2 * G * S_env * time_sec)
    ax2.plot(time_sec / 60, r_t * 1e6, linewidth=2,
             label=f'r₀ = {r0*1e6:.1f} μm')
ax2.axhline(20, color='#ef4444', linewidth=1, linestyle='--', label='Max diffusion growth (~20μm)')
ax2.axhline(1000, color='#fbbf24', linewidth=1, linestyle='--')
ax2.set_xlabel('Time (minutes)', color='white')
ax2.set_ylabel('Droplet radius (μm)', color='white')
ax2.set_title('Droplet Growth by Vapor Diffusion', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 30)

# Plot 3: Collision-coalescence
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Terminal velocity of droplets
def terminal_velocity(r_um):
    """Terminal velocity (m/s) for cloud/rain drops."""
    r_m = r_um * 1e-6
    if r_um < 40:  # Stokes regime
        return 1.2e8 * r_m**2  # simplified
    else:  # larger drops
        return 8e3 * r_m**0.5

r_range = np.linspace(1, 3000, 1000)  # μm
v_term = np.array([terminal_velocity(r) for r in r_range])

ax3.loglog(r_range, v_term, color='#3b82f6', linewidth=2.5)
ax3.axvline(10, color='gray', linewidth=0.5, linestyle=':')
ax3.axvline(100, color='gray', linewidth=0.5, linestyle=':')
ax3.axvline(1000, color='gray', linewidth=0.5, linestyle=':')
ax3.text(5, 0.001, 'Cloud\\ndroplet', color='#22c55e', fontsize=9, ha='center')
ax3.text(50, 0.001, 'Drizzle', color='#f59e0b', fontsize=9, ha='center')
ax3.text(500, 0.001, 'Rain', color='#ef4444', fontsize=9, ha='center')
ax3.set_xlabel('Drop radius (μm)', color='white')
ax3.set_ylabel('Terminal velocity (m/s)', color='white')
ax3.set_title('Drop Size vs Fall Speed', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# Plot 4: Clean vs polluted cloud comparison
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
np.random.seed(42)
# Clean cloud: fewer, larger drops
n_clean = 100
r_clean = np.random.lognormal(np.log(15), 0.4, n_clean)
# Polluted cloud: many, smaller drops
n_polluted = 500
r_polluted = np.random.lognormal(np.log(6), 0.3, n_polluted)

bins = np.linspace(0, 40, 50)
ax4.hist(r_clean, bins=bins, alpha=0.6, color='#3b82f6', density=True,
         label=f'Clean (N={n_clean}/cm³, r̄={np.mean(r_clean):.1f}μm)')
ax4.hist(r_polluted, bins=bins, alpha=0.6, color='#ef4444', density=True,
         label=f'Polluted (N={n_polluted}/cm³, r̄={np.mean(r_polluted):.1f}μm)')
ax4.axvline(20, color='#fbbf24', linewidth=1.5, linestyle='--',
            label='Collision threshold (~20μm)')
ax4.set_xlabel('Droplet radius (μm)', color='white')
ax4.set_ylabel('Probability density', color='white')
ax4.set_title('Clean vs Polluted Cloud — Twomey Effect', color='white', fontsize=11)
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cloud Microphysics Summary:")
print(f"  CCN activation: larger nuclei activate at lower supersaturation")
print(f"  Diffusion growth: slow, max ~20μm radius in ~1 hour")
print(f"  Rain formation requires collision-coalescence or Bergeron process")
print(f"\\nClean vs Polluted clouds (Twomey effect):")
print(f"  Clean: ~100 drops/cm³, mean radius ~15μm → rains easily")
print(f"  Polluted: ~500 drops/cm³, mean radius ~6μm → suppressed rain")
print(f"  Same water content, different microphysics, different climate effect")`,
      challenge: 'Simulate the collision-coalescence process: start with a population of cloud droplets and model how large collector drops sweep up smaller drops as they fall. Track the time required for the first raindrop (r > 500μm) to form.',
      successHint: 'Cloud microphysics sits at the intersection of thermodynamics, surface chemistry, and fluid dynamics. The remarkable fact that tiny aerosol particles control cloud properties — and through them, Earth\'s energy balance — makes aerosol-cloud interactions one of the largest uncertainties in climate science.',
    },
    {
      title: 'Satellite cloud classification — reading clouds from space',
      concept: `Weather satellites observe clouds in multiple wavelength bands, and each band reveals different information. Visible channels (0.6 μm) see reflected sunlight — thick clouds appear bright, thin clouds dim, and clear sky dark. Infrared channels (10-12 μm) measure thermal emission — cold cloud tops (high altitude) appear bright in IR, warm surfaces appear dark. Water vapor channels (6.7 μm) detect moisture in the mid-troposphere.

Cloud classification from satellite data uses the relationship between visible reflectance (optical depth proxy) and IR brightness temperature (cloud top height proxy). On a scatter plot of these two variables, distinct cloud types cluster in different regions: cirrus (cold but thin), deep convective (cold and thick), stratocumulus (warm but moderately thick), and clear sky (warm and dark in visible). This ISCCP (International Satellite Cloud Climatology Project) framework classifies clouds into 9 types using only two parameters.

Machine learning has enhanced satellite cloud classification. Convolutional neural networks (CNNs) trained on millions of labeled satellite images can classify cloud types with >90% accuracy, distinguish overlapping cloud layers, and detect cloud changes over time. For weather forecasting, automated cloud classification from geostationary satellites (INSAT-3D over India) provides near-real-time cloud type maps every 15 minutes — essential for tracking convective development over Assam during monsoon season.`,
      analogy: 'Satellite cloud classification is like reading a book written in two ink colors. The visible channel is one color (tells you how thick the pages are), and the infrared channel is another (tells you how high the pages are stacked). By reading both simultaneously, you can classify every cloud type just as a librarian classifies books by size and shelf height.',
      storyConnection: 'The cloud namer looked up and named clouds by their appearance. Modern satellites do the same thing from 36,000 km altitude. INSAT-3D watches over Assam continuously, classifying the same clouds the story\'s character names. But the satellite sees in wavelengths the human eye cannot — infrared reveals cloud top temperatures, distinguishing a cold, towering cumulonimbus from a warm, low stratus even when they look similar from below.',
      checkQuestion: 'A satellite pixel has visible reflectance = 0.8 (very bright) and IR brightness temperature = 210 K (-63°C). What cloud type is this? What about reflectance = 0.3 and temperature = 250 K?',
      checkAnswer: 'High reflectance + very cold top (210K ≈ -63°C, corresponding to ~14km altitude) = deep convective cumulonimbus — a thunderstorm cloud. This is the most dramatic cloud type: optically thick AND extending to the tropopause. The second pixel (moderate reflectance + cold top at 250K ≈ -23°C, ~8km) = thick cirrus or alto-cumulus. It is moderately thick but at high altitude — likely ice cloud from remnant convection.',
      codeIntro: 'Build an ISCCP-style cloud classification scheme using visible reflectance and IR brightness temperature, and visualize the classification space.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ISCCP Cloud Classification
# Based on two parameters:
# 1. Optical depth (tau) — proxy for visible reflectance
# 2. Cloud top pressure (CTP) — from IR brightness temperature

# Cloud type definitions (ISCCP 9 types)
cloud_types = {
    'Cirrus':        {'tau': (0, 3.6),    'ctp': (0, 440),    'color': '#818cf8'},
    'Cirrostratus':  {'tau': (3.6, 23),   'ctp': (0, 440),    'color': '#6366f1'},
    'Deep convective':{'tau': (23, 100),  'ctp': (0, 440),    'color': '#ef4444'},
    'Altocumulus':   {'tau': (0, 3.6),    'ctp': (440, 680),  'color': '#22c55e'},
    'Altostratus':   {'tau': (3.6, 23),   'ctp': (440, 680),  'color': '#16a34a'},
    'Nimbostratus':  {'tau': (23, 100),   'ctp': (440, 680),  'color': '#f59e0b'},
    'Cumulus':       {'tau': (0, 3.6),    'ctp': (680, 1000), 'color': '#93c5fd'},
    'Stratocumulus': {'tau': (3.6, 23),   'ctp': (680, 1000), 'color': '#3b82f6'},
    'Stratus':       {'tau': (23, 100),   'ctp': (680, 1000), 'color': '#1d4ed8'},
}

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: ISCCP classification grid
ax = axes[0, 0]
ax.set_facecolor('#111827')
for name, props in cloud_types.items():
    tau_lo, tau_hi = props['tau']
    ctp_lo, ctp_hi = props['ctp']
    rect = plt.Rectangle((tau_lo, ctp_lo), tau_hi - tau_lo, ctp_hi - ctp_lo,
                          facecolor=props['color'], alpha=0.5, edgecolor='white', linewidth=1)
    ax.add_patch(rect)
    ax.text((tau_lo + tau_hi) / 2, (ctp_lo + ctp_hi) / 2, name,
            ha='center', va='center', color='white', fontsize=7, fontweight='bold')

ax.set_xlim(0, 100); ax.set_ylim(0, 1000)
ax.invert_yaxis()  # pressure decreases upward
ax.set_xlabel('Optical depth (τ)', color='white')
ax.set_ylabel('Cloud top pressure (hPa)', color='white')
ax.set_title('ISCCP Cloud Classification', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')
# Add altitude scale on right
ax_alt = ax.twinx()
ax_alt.set_ylim(0, 1000)
ax_alt.invert_yaxis()
alt_ticks = [1000, 800, 600, 400, 200]
alt_labels = ['0', '2', '4', '8', '12']
ax_alt.set_yticks(alt_ticks)
ax_alt.set_yticklabels([f'{a} km' for a in alt_labels])
ax_alt.set_ylabel('Approximate altitude', color='white')
ax_alt.tick_params(colors='gray')

# Plot 2: Simulated satellite scene classification
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
np.random.seed(42)
n_pixels = 1000
# Generate random cloud pixels
pixel_tau = np.random.lognormal(1.5, 1.0, n_pixels)
pixel_ctp = np.random.uniform(100, 1000, n_pixels)
# Classify each pixel
pixel_colors = []
pixel_types = []
for tau, ctp in zip(pixel_tau, pixel_ctp):
    classified = False
    for name, props in cloud_types.items():
        if (props['tau'][0] <= tau < props['tau'][1] and
            props['ctp'][0] <= ctp < props['ctp'][1]):
            pixel_colors.append(props['color'])
            pixel_types.append(name)
            classified = True
            break
    if not classified:
        pixel_colors.append('#6b7280')
        pixel_types.append('Unclassified')

ax2.scatter(pixel_tau, pixel_ctp, c=pixel_colors, s=8, alpha=0.6)
ax2.set_xlim(0, 100); ax2.set_ylim(0, 1000)
ax2.invert_yaxis()
ax2.set_xlabel('Optical depth (τ)', color='white')
ax2.set_ylabel('Cloud top pressure (hPa)', color='white')
ax2.set_title('Classified Satellite Pixels', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Plot 3: Cloud type frequency for Assam monsoon
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Typical monsoon cloud distribution over Assam
assam_freq = {
    'Deep convective': 25,
    'Nimbostratus': 20,
    'Stratocumulus': 15,
    'Cirrus': 15,
    'Cirrostratus': 10,
    'Altostratus': 8,
    'Cumulus': 4,
    'Altocumulus': 2,
    'Stratus': 1,
}
names_sorted = sorted(assam_freq.keys(), key=lambda x: assam_freq[x], reverse=True)
freqs = [assam_freq[n] for n in names_sorted]
bar_colors = [cloud_types[n]['color'] for n in names_sorted]
bars = ax3.barh(names_sorted, freqs, color=bar_colors, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, f in zip(bars, freqs):
    ax3.text(f + 0.5, bar.get_y() + bar.get_height()/2, f'{f}%',
            va='center', color='white', fontsize=9)
ax3.set_xlabel('Frequency (%)', color='white')
ax3.set_title('Cloud Types Over Assam (Monsoon)', color='white', fontsize=11)
ax3.tick_params(colors='gray')
ax3.invert_yaxis()

# Plot 4: Diurnal cycle of cloud types
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
hours = np.arange(0, 24)
# Convective clouds peak in afternoon, stratus in morning
convective = 5 + 20 * np.exp(-0.5 * ((hours - 15) / 3)**2)
stratiform = 15 + 10 * np.exp(-0.5 * ((hours - 6) / 4)**2)
cirrus = 10 + 5 * np.sin(2 * np.pi * hours / 24)
clear = 100 - convective - stratiform - cirrus
clear = np.clip(clear, 0, 100)

ax4.stackplot(hours, convective, stratiform, cirrus, clear,
              colors=['#ef4444', '#3b82f6', '#818cf8', '#111827'],
              labels=['Convective', 'Stratiform', 'Cirrus', 'Clear'],
              alpha=0.7)
ax4.set_xlabel('Hour (local time)', color='white')
ax4.set_ylabel('Sky fraction (%)', color='white')
ax4.set_title('Diurnal Cloud Cycle Over Assam', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')
ax4.set_xlim(0, 23)

plt.tight_layout()
plt.show()

print("Satellite Cloud Classification Summary:")
print(f"  ISCCP uses 2 parameters: optical depth + cloud top pressure")
print(f"  9 cloud types arranged in a 3×3 grid")
print()
print("Cloud type frequencies (Assam monsoon season):")
for name in names_sorted:
    print(f"  {name:<20} {assam_freq[name]:>3}%")
print()
print("The cloud namer's craft, quantified:")
print("  What the eye sees in shape and color,")
print("  the satellite measures in reflectance and temperature.")`,
      challenge: 'Implement a simple k-nearest-neighbors (k-NN) classifier that takes (optical depth, cloud top pressure) as input and classifies cloud type. Train it on the generated data and measure accuracy. Compare against the grid-based ISCCP method.',
      successHint: 'Satellite cloud classification transforms subjective visual observation into quantitative measurement. The same cloud the story\'s character names by looking up is classified by INSAT-3D using reflectance and brightness temperature — the science of cloud naming made global and automatic.',
    },
    {
      title: 'Machine learning in weather forecasting — from rules to neural networks',
      concept: `Traditional weather forecasting uses numerical weather prediction (NWP): solving the Navier-Stokes equations for atmospheric flow on a global grid. This requires enormous computing power and still struggles with convective-scale events (thunderstorms, tropical cyclones). Machine learning offers a complementary approach: learn the mapping from current atmospheric state to future state directly from data, bypassing the explicit physics.

The simplest ML approach is persistence forecasting: tomorrow's weather equals today's. Surprisingly, this beats many complex models for short lead times. Next is analog forecasting: find historical days with similar atmospheric patterns and use their outcomes as forecasts. Modern ML goes further: deep learning models like Google's GraphCast and DeepMind's GenCast can produce global 10-day forecasts in seconds that rival traditional NWP accuracy at a fraction of the computational cost.

For cloud classification specifically, convolutional neural networks (CNNs) process satellite images as pixel arrays. The network learns hierarchical features: edge detection in early layers, texture patterns in middle layers, and cloud type recognition in deep layers. A CNN trained on labeled ISCCP data can classify cloud types from satellite images with >90% accuracy. The key insight is that the model learns not just the two ISCCP parameters but also spatial context — the shape, texture, and neighborhood of each cloud pixel.`,
      analogy: 'Traditional weather forecasting is like predicting traffic by solving every car\'s equation of motion individually. Machine learning is like predicting traffic by learning patterns from years of historical traffic data. The physics approach is more principled but computationally expensive. The ML approach is faster and can capture patterns that the physics model misses — but it cannot extrapolate to conditions never seen in the training data.',
      storyConnection: 'The cloud namer learned to predict weather by observing patterns over years — a human version of machine learning. Modern ML weather models do the same thing with millions of observations and billions of parameters. The cloud namer\'s skill — pattern recognition from experience — is the same principle that powers neural network weather forecasts. The story\'s traditional knowledge and cutting-edge AI are separated by technology but united by approach.',
      checkQuestion: 'A CNN cloud classifier achieves 95% accuracy on its training data but only 78% on new satellite images from a different season. What is happening and how would you fix it?',
      checkAnswer: 'The model is overfitting — it learned training-specific patterns rather than general cloud physics. The accuracy gap (95% vs 78%) indicates poor generalization. Fixes: (1) Train on data spanning all seasons to capture seasonal variation. (2) Use data augmentation (rotation, flipping, brightness changes). (3) Add regularization (dropout, weight decay) to prevent memorizing training samples. (4) Use a validation set during training to detect overfitting early. (5) Consider transfer learning from a model pretrained on a larger dataset.',
      codeIntro: 'Build a simple cloud type classifier from features, visualize the decision boundaries, and compare against a basic decision tree.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate synthetic cloud observation data
# Features: optical_depth, cloud_top_temp (K), cloud_thickness (km)
n_samples = 600

def generate_cloud_data():
    """Generate labeled cloud observation data."""
    data = []
    labels = []

    # Cirrus: thin, cold
    n = 80
    data.append(np.column_stack([
        np.random.uniform(0.5, 3, n),     # low optical depth
        np.random.uniform(200, 240, n),    # very cold tops
        np.random.uniform(0.5, 2, n),      # thin
    ]))
    labels.extend(['Cirrus'] * n)

    # Cumulus: moderate, warm
    n = 80
    data.append(np.column_stack([
        np.random.uniform(2, 15, n),
        np.random.uniform(260, 285, n),
        np.random.uniform(1, 4, n),
    ]))
    labels.extend(['Cumulus'] * n)

    # Cumulonimbus: very thick, very cold
    n = 80
    data.append(np.column_stack([
        np.random.uniform(30, 80, n),
        np.random.uniform(195, 225, n),
        np.random.uniform(8, 15, n),
    ]))
    labels.extend(['Cumulonimbus'] * n)

    # Stratus: moderate thickness, warm
    n = 80
    data.append(np.column_stack([
        np.random.uniform(5, 25, n),
        np.random.uniform(270, 290, n),
        np.random.uniform(0.5, 2, n),
    ]))
    labels.extend(['Stratus'] * n)

    # Stratocumulus: moderate everything
    n = 80
    data.append(np.column_stack([
        np.random.uniform(3, 20, n),
        np.random.uniform(265, 285, n),
        np.random.uniform(1, 3, n),
    ]))
    labels.extend(['Stratocumulus'] * n)

    return np.vstack(data), np.array(labels)

X, y = generate_cloud_data()
classes = np.unique(y)
class_colors = {'Cirrus': '#818cf8', 'Cumulus': '#22c55e', 'Cumulonimbus': '#ef4444',
                'Stratus': '#3b82f6', 'Stratocumulus': '#f59e0b'}

# Simple k-NN classifier (from scratch)
def knn_predict(X_train, y_train, X_test, k=5):
    predictions = []
    for x in X_test:
        distances = np.sqrt(np.sum((X_train - x)**2, axis=1))
        nearest = np.argsort(distances)[:k]
        nearest_labels = y_train[nearest]
        unique, counts = np.unique(nearest_labels, return_counts=True)
        predictions.append(unique[np.argmax(counts)])
    return np.array(predictions)

# Simple decision tree (1-level, from scratch)
def decision_stump(X, y, feature_idx):
    """Find best threshold for a single feature."""
    thresholds = np.percentile(X[:, feature_idx], np.arange(10, 100, 10))
    best_acc = 0
    best_thresh = 0
    for thresh in thresholds:
        left = y[X[:, feature_idx] <= thresh]
        right = y[X[:, feature_idx] > thresh]
        if len(left) == 0 or len(right) == 0:
            continue
        left_pred = max(set(left), key=list(left).count) if len(left) > 0 else classes[0]
        right_pred = max(set(right), key=list(right).count) if len(right) > 0 else classes[0]
        correct = sum(left == left_pred) + sum(right == right_pred)
        acc = correct / len(y)
        if acc > best_acc:
            best_acc = acc
            best_thresh = thresh
    return best_thresh, best_acc

# Train-test split
n_train = int(0.7 * len(X))
idx = np.random.permutation(len(X))
X_train, X_test = X[idx[:n_train]], X[idx[n_train:]]
y_train, y_test = y[idx[:n_train]], y[idx[n_train:]]

# Normalize features for k-NN
X_mean = X_train.mean(axis=0)
X_std = X_train.std(axis=0)
X_train_norm = (X_train - X_mean) / X_std
X_test_norm = (X_test - X_mean) / X_std

# Evaluate k-NN
y_pred_knn = knn_predict(X_train_norm, y_train, X_test_norm, k=5)
knn_acc = np.mean(y_pred_knn == y_test)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Feature space (optical depth vs cloud top temp)
ax = axes[0, 0]
ax.set_facecolor('#111827')
for cls in classes:
    mask = y == cls
    ax.scatter(X[mask, 0], X[mask, 1], c=class_colors[cls], s=15, alpha=0.6,
              label=cls, edgecolors='none')
ax.set_xlabel('Optical depth (τ)', color='white')
ax.set_ylabel('Cloud top temperature (K)', color='white')
ax.set_title('Cloud Types in Feature Space', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: k-NN decision boundary (2D projection)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
# Create grid for decision boundary
xx, yy = np.meshgrid(np.linspace(X[:, 0].min()-5, X[:, 0].max()+5, 100),
                      np.linspace(X[:, 1].min()-5, X[:, 1].max()+5, 100))
grid = np.column_stack([xx.ravel(), yy.ravel(), np.full(xx.size, X[:, 2].mean())])
grid_norm = (grid - X_mean) / X_std
grid_pred = knn_predict(X_train_norm, y_train, grid_norm, k=5)

# Color map
class_to_num = {c: i for i, c in enumerate(classes)}
grid_nums = np.array([class_to_num[p] for p in grid_pred]).reshape(xx.shape)
from matplotlib.colors import ListedColormap
cmap = ListedColormap([class_colors[c] for c in classes])
ax2.contourf(xx, yy, grid_nums, alpha=0.3, cmap=cmap, levels=np.arange(-0.5, len(classes)))
for cls in classes:
    mask = y_test == cls
    ax2.scatter(X_test[mask, 0], X_test[mask, 1], c=class_colors[cls], s=30,
              edgecolors='white', linewidth=0.5)
ax2.set_xlabel('Optical depth (τ)', color='white')
ax2.set_ylabel('Cloud top temperature (K)', color='white')
ax2.set_title(f'k-NN Decision Boundary (acc={knn_acc:.1%})', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Plot 3: Confusion matrix
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
conf_matrix = np.zeros((len(classes), len(classes)), dtype=int)
for true, pred in zip(y_test, y_pred_knn):
    conf_matrix[class_to_num[true], class_to_num[pred]] += 1
im = ax3.imshow(conf_matrix, cmap='Blues', aspect='auto')
ax3.set_xticks(range(len(classes)))
ax3.set_yticks(range(len(classes)))
ax3.set_xticklabels([c[:5] for c in classes], fontsize=8, rotation=45)
ax3.set_yticklabels([c[:5] for c in classes], fontsize=8)
for i in range(len(classes)):
    for j in range(len(classes)):
        ax3.text(j, i, str(conf_matrix[i, j]), ha='center', va='center',
                color='white' if conf_matrix[i, j] > conf_matrix.max()/2 else 'gray',
                fontsize=10, fontweight='bold')
ax3.set_xlabel('Predicted', color='white')
ax3.set_ylabel('True', color='white')
ax3.set_title('Confusion Matrix', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# Plot 4: Accuracy vs k
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
k_values = range(1, 21)
accuracies = []
for k in k_values:
    pred = knn_predict(X_train_norm, y_train, X_test_norm, k=k)
    accuracies.append(np.mean(pred == y_test))
ax4.plot(list(k_values), accuracies, 'o-', color='#22c55e', linewidth=2, markersize=6)
best_k = list(k_values)[np.argmax(accuracies)]
ax4.axvline(best_k, color='#fbbf24', linewidth=1.5, linestyle='--',
            label=f'Best k={best_k} ({max(accuracies):.1%})')
ax4.set_xlabel('k (number of neighbors)', color='white')
ax4.set_ylabel('Test accuracy', color='white')
ax4.set_title('k-NN Accuracy vs k', color='white', fontsize=11)
ax4.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("ML Cloud Classification Results:")
print(f"  Training samples: {n_train}")
print(f"  Test samples: {len(X_test)}")
print(f"  k-NN accuracy (k=5): {knn_acc:.1%}")
print(f"  Best k: {best_k} (accuracy: {max(accuracies):.1%})")
print()
print("Per-class accuracy:")
for cls in classes:
    mask = y_test == cls
    if mask.sum() > 0:
        cls_acc = np.mean(y_pred_knn[mask] == cls)
        print(f"  {cls:<18} {cls_acc:.0%}")
print()
print("From human cloud naming to automated ML classification —")
print("the principle is the same: learn patterns from features.")`,
      challenge: 'Implement a simple neural network (single hidden layer, sigmoid activation) from scratch using only numpy. Train it on the cloud data and compare accuracy against k-NN. Visualize the learned decision boundary.',
      successHint: 'Machine learning in meteorology is not replacing physical understanding — it is augmenting it. The best modern weather models combine physics-based NWP with ML post-processing. Understanding both approaches gives you the full picture of how modern weather forecasting works.',
    },
    {
      title: 'Climate feedback loops — how clouds control Earth\'s temperature',
      concept: `Clouds play a dual role in Earth\'s energy balance. They reflect incoming solar radiation back to space (albedo effect, cooling), and they trap outgoing longwave radiation (greenhouse effect, warming). The net effect depends on cloud type, altitude, and optical thickness. Low, thick clouds (stratocumulus) have a strong albedo effect and weak greenhouse effect — net cooling. High, thin clouds (cirrus) have a weak albedo effect but strong greenhouse effect — net warming.

This makes cloud feedback the single largest uncertainty in climate projections. If global warming causes more low clouds, it creates a negative feedback (more cooling, dampening warming). If it causes more high clouds, it creates a positive feedback (more warming, amplifying warming). Current climate models disagree on which effect dominates, leading to a range of predicted warming from 1.5°C to 4.5°C per CO₂ doubling.

Cloud radiative forcing (CRF) quantifies the effect. CRF = (clear-sky radiation) - (all-sky radiation). Globally, clouds currently have a net cooling effect of about -20 W/m² (albedo cooling of -50 W/m² partially offset by greenhouse warming of +30 W/m²). But even a 10% change in this balance would cause a forcing comparable to doubling CO₂ (+3.7 W/m²). Understanding how clouds respond to warming — the cloud feedback — is the holy grail of climate science.`,
      analogy: 'Clouds are like a thermostat with two competing settings. Low clouds are air conditioning units — they reflect sunlight and cool the room. High clouds are space heaters — they trap heat and warm the room. Earth\'s temperature depends on the balance between these two settings. Climate change is like someone nudging the thermostat — the question is whether the system responds by turning up the AC (negative feedback) or the heater (positive feedback).',
      storyConnection: 'The cloud namer watches clouds that collectively control Earth\'s temperature. Every cumulus cloud over Assam reflects sunlight that would otherwise warm the surface. Every cirrus cloud traps heat that would otherwise escape to space. The balance between these effects over Assam — and over every patch of Earth — determines our planet\'s future temperature. Cloud naming is climate science.',
      checkQuestion: 'A warming climate reduces low cloud cover by 5% and increases high cloud cover by 3%. If low clouds have CRF = -60 W/m² and high clouds have CRF = +20 W/m², what is the net change in cloud radiative forcing? Is this a positive or negative feedback?',
      checkAnswer: 'Change from low clouds: -60 × (-0.05) = +3.0 W/m² (less cooling = warming). Change from high clouds: +20 × (+0.03) = +0.6 W/m² (more warming). Net ΔCRF = +3.0 + 0.6 = +3.6 W/m². This is a POSITIVE feedback — warming reduces cooling clouds and increases warming clouds, amplifying the original warming. +3.6 W/m² is nearly equivalent to doubling CO₂, making cloud feedback potentially the most important amplifier of climate change.',
      codeIntro: 'Model cloud radiative forcing, compare cloud types, and simulate how cloud feedback amplifies or dampens warming.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cloud Radiative Forcing model
# CRF = shortwave (cooling) + longwave (warming)

def cloud_shortwave_forcing(albedo, solar_const=1361, cos_sza=0.5):
    """Shortwave (solar) forcing: negative (cooling)."""
    return -albedo * solar_const * cos_sza / 4  # W/m^2

def cloud_longwave_forcing(cloud_top_temp, emissivity=0.9, surface_temp=288):
    """Longwave (thermal) forcing: positive (warming)."""
    sigma = 5.67e-8  # Stefan-Boltzmann
    surface_emission = sigma * surface_temp**4
    cloud_emission = emissivity * sigma * cloud_top_temp**4
    return surface_emission - cloud_emission  # trapped radiation

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: CRF by cloud type
ax = axes[0, 0]
ax.set_facecolor('#111827')
cloud_data = {
    'Cirrus':        {'albedo': 0.15, 'T_top': 220, 'color': '#818cf8'},
    'Cirrostratus':  {'albedo': 0.30, 'T_top': 225, 'color': '#6366f1'},
    'Altostratus':   {'albedo': 0.40, 'T_top': 250, 'color': '#22c55e'},
    'Cumulus':       {'albedo': 0.35, 'T_top': 270, 'color': '#93c5fd'},
    'Stratocumulus': {'albedo': 0.60, 'T_top': 280, 'color': '#3b82f6'},
    'Stratus':       {'albedo': 0.65, 'T_top': 283, 'color': '#1d4ed8'},
    'Cumulonimbus':  {'albedo': 0.70, 'T_top': 210, 'color': '#ef4444'},
}

names = list(cloud_data.keys())
sw_crf = [cloud_shortwave_forcing(d['albedo']) for d in cloud_data.values()]
lw_crf = [cloud_longwave_forcing(d['T_top']) for d in cloud_data.values()]
net_crf = [s + l for s, l in zip(sw_crf, lw_crf)]
bar_colors = [d['color'] for d in cloud_data.values()]

x = np.arange(len(names))
w = 0.25
ax.bar(x - w, sw_crf, w, color='#3b82f6', alpha=0.8, label='SW (cooling)')
ax.bar(x, lw_crf, w, color='#ef4444', alpha=0.8, label='LW (warming)')
ax.bar(x + w, net_crf, w, color=bar_colors, alpha=0.8, edgecolor='white', linewidth=1,
       label='Net CRF')
ax.axhline(0, color='white', linewidth=0.5)
ax.set_xticks(x); ax.set_xticklabels(names, rotation=40, fontsize=7)
ax.set_ylabel('Radiative forcing (W/m²)', color='white')
ax.set_title('Cloud Radiative Forcing by Type', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Net CRF as function of albedo and cloud top temp
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
albedo_range = np.linspace(0.05, 0.8, 100)
temp_range = np.linspace(200, 290, 100)
A, T = np.meshgrid(albedo_range, temp_range)
SW = cloud_shortwave_forcing(A)
LW = cloud_longwave_forcing(T)
NET = SW + LW

contour = ax2.contourf(A, T, NET, levels=20, cmap='RdBu_r')
ax2.contour(A, T, NET, levels=[0], colors='white', linewidths=2)
plt.colorbar(contour, ax=ax2, label='Net CRF (W/m²)')
# Plot cloud types
for name, d in cloud_data.items():
    ax2.plot(d['albedo'], d['T_top'], 'o', color='white', markersize=8, markeredgecolor='black')
    ax2.annotate(name[:4], xy=(d['albedo'], d['T_top']), xytext=(5, 5),
                textcoords='offset points', color='white', fontsize=7, fontweight='bold')
ax2.set_xlabel('Cloud albedo', color='white')
ax2.set_ylabel('Cloud top temperature (K)', color='white')
ax2.set_title('Net CRF: Albedo vs Cloud Height', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Plot 3: Cloud feedback simulation
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Simple feedback model: ΔT = ΔF / (λ₀ - λ_cloud)
# λ₀ = Planck feedback ≈ 3.2 W/m²/K
# λ_cloud ranges from -1 to +1 W/m²/K
lambda_0 = 3.2  # Planck feedback
delta_F = 3.7   # CO2 doubling forcing

lambda_cloud = np.linspace(-1.5, 1.5, 200)
delta_T = delta_F / (lambda_0 - lambda_cloud)
delta_T = np.clip(delta_T, 0, 8)

ax3.plot(lambda_cloud, delta_T, color='#f59e0b', linewidth=2.5)
ax3.fill_between(lambda_cloud, 0, delta_T, where=lambda_cloud < 0, color='#3b82f6', alpha=0.15,
                  label='Negative feedback (less warming)')
ax3.fill_between(lambda_cloud, 0, delta_T, where=lambda_cloud > 0, color='#ef4444', alpha=0.15,
                  label='Positive feedback (more warming)')
ax3.axvspan(-0.5, 1.0, alpha=0.1, color='#f59e0b', label='IPCC likely range')
ax3.axhline(3.0, color='gray', linewidth=0.5, linestyle='--')
ax3.set_xlabel('Cloud feedback parameter (W/m²/K)', color='white')
ax3.set_ylabel('Equilibrium warming for 2×CO₂ (°C)', color='white')
ax3.set_title('Cloud Feedback Controls Climate Sensitivity', color='white', fontsize=11)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
ax3.set_ylim(0, 7)

# Plot 4: Global CRF budget
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
components = ['SW cooling\\n(albedo)', 'LW warming\\n(greenhouse)', 'Net cloud\\neffect']
values = [-50, 30, -20]
colors_budget = ['#3b82f6', '#ef4444', '#a855f7']
bars = ax4.bar(components, values, color=colors_budget, alpha=0.8, edgecolor='white', linewidth=1)
ax4.axhline(0, color='white', linewidth=0.5)
for bar, val in zip(bars, values):
    ax4.text(bar.get_x() + bar.get_width()/2, val + (2 if val > 0 else -3),
            f'{val:+.0f} W/m²', ha='center', color='white', fontsize=12, fontweight='bold')
ax4.axhline(-3.7, color='#fbbf24', linewidth=1.5, linestyle='--')
ax4.text(2.3, -5, '2×CO₂ forcing\\n(+3.7 W/m²)', color='#fbbf24', fontsize=9)
ax4.set_ylabel('Radiative forcing (W/m²)', color='white')
ax4.set_title('Global Cloud Radiative Forcing Budget', color='white', fontsize=11)
ax4.tick_params(colors='gray')
ax4.set_ylim(-60, 40)

plt.tight_layout()
plt.show()

print("Cloud Radiative Forcing Summary:")
print(f"  Global SW cooling:  -50 W/m²")
print(f"  Global LW warming:  +30 W/m²")
print(f"  Net cloud effect:   -20 W/m² (net cooling)")
print(f"\\nA 10% change in net CRF = ±2 W/m² — comparable to 2×CO₂ forcing")
print(f"\\nEquilibrium Climate Sensitivity (ECS) for 2×CO₂:")
for lc in [-0.5, 0.0, 0.5, 1.0]:
    ecs = delta_F / (lambda_0 - lc)
    print(f"  Cloud feedback = {lc:+.1f} W/m²/K → ECS = {ecs:.1f}°C")
print(f"\\nCloud feedback is THE largest uncertainty in climate projections.")
print(f"The cloud namer's science has planetary consequences.")`,
      challenge: 'Model the marine stratocumulus cloud deck specifically: how does warming affect the boundary layer inversion that maintains it? Simulate a scenario where low cloud cover decreases by 5% per degree of warming and compute the resulting amplification of climate sensitivity.',
      successHint: 'Cloud-climate feedbacks represent the frontier of atmospheric science. The simple observation that clouds both cool and warm Earth, depending on type, leads to the most consequential uncertainty in climate prediction. Every cloud the cloud namer identifies is a data point in this planetary-scale calculation.',
    },
    {
      title: 'Cloud radiative forcing — measuring the energy balance',
      concept: `Cloud radiative forcing is measured directly by comparing radiation fluxes at the top of the atmosphere (TOA) between cloudy and clear conditions. The CERES (Clouds and the Earth\'s Radiant Energy System) instrument on NASA satellites measures both reflected shortwave and emitted longwave radiation globally. By subtracting clear-sky fluxes from all-sky fluxes, CERES provides a direct measurement of CRF.

The shortwave CRF is always negative (cooling): CRF_SW = F_SW(clear) - F_SW(all-sky). Clouds reflect more shortwave than clear sky, so the all-sky outgoing SW is larger, meaning less reaches the surface. The longwave CRF is always positive (warming): CRF_LW = F_LW(clear) - F_LW(all-sky). Clouds trap outgoing longwave radiation, so less escapes to space in the all-sky case.

The net CRF varies geographically and seasonally. Over the tropical warm pool, deep convection produces net cooling (strong reflection offsets greenhouse warming). Over the Southern Ocean, persistent stratocumulus creates Earth\'s strongest cooling. Over the Arctic in winter, thin cirrus produces net warming. The global average net CRF of about -20 W/m² masks enormous regional variation that drives weather patterns and ocean circulation. Understanding CRF at regional scales is essential for climate adaptation planning in places like Assam, where monsoon cloud patterns directly control agricultural water supply.`,
      analogy: 'Measuring CRF is like comparing your electricity bill in a month with and without window blinds. The shortwave CRF is the reduction in solar heating from closing the blinds (cooling). The longwave CRF is the reduction in heat escaping through the windows when blinds are closed (warming). Your net energy bill depends on which effect is larger — and this changes with the season, just like CRF changes with cloud type.',
      storyConnection: 'Every cloud the cloud namer observes has a measurable energy effect. A single cumulus cloud might be reflecting 200 W/m² of sunlight while trapping 80 W/m² of longwave radiation — a net cooling of 120 W/m² under its shadow. Over Assam during monsoon, the collective CRF of all clouds determines how much energy reaches the surface to drive evaporation, plant growth, and river flow. The cloud namer is unconsciously reading Earth\'s energy budget.',
      checkQuestion: 'CERES measures outgoing SW of 100 W/m² on a clear day and 200 W/m² on a cloudy day over the same location. It measures outgoing LW of 240 W/m² clear and 210 W/m² cloudy. Compute the SW, LW, and net CRF.',
      checkAnswer: 'CRF_SW = F_SW(clear) - F_SW(all-sky) = 100 - 200 = -100 W/m² (clouds reflect 100 W/m² extra). CRF_LW = F_LW(clear) - F_LW(all-sky) = 240 - 210 = +30 W/m² (clouds trap 30 W/m²). Net CRF = -100 + 30 = -70 W/m² (strong net cooling). These clouds are thick and relatively warm-topped (strong albedo, moderate greenhouse) — likely stratocumulus or cumulonimbus.',
      codeIntro: 'Compute and visualize cloud radiative forcing from simulated satellite observations, map regional CRF patterns, and analyze seasonal variations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cloud Radiative Forcing measurement model
# Simulating CERES-like satellite observations

np.random.seed(42)

# Global grid (simplified)
lats = np.linspace(-90, 90, 36)
lons = np.linspace(-180, 180, 72)
LAT, LON = np.meshgrid(lats, lons)

# Solar insolation varies with latitude
cos_sza = np.maximum(np.cos(np.radians(LAT)), 0.05)
solar_in = 1361 * cos_sza / 4  # W/m^2 (time-averaged)

# Cloud properties vary with region
# Cloud fraction
cloud_frac = 0.5 + 0.2 * np.cos(np.radians(LAT)) + 0.1 * np.sin(np.radians(2 * LAT))
cloud_frac = np.clip(cloud_frac + np.random.normal(0, 0.05, LAT.shape), 0.1, 0.95)

# Cloud albedo (higher in storm tracks)
cloud_albedo = 0.3 + 0.15 * np.cos(np.radians(LAT)) + 0.1 * np.sin(np.radians(3 * LAT))
cloud_albedo = np.clip(cloud_albedo, 0.1, 0.8)

# Cloud top temperature (colder at tropics due to deep convection)
surface_temp = 300 - 40 * np.abs(np.sin(np.radians(LAT)))
cloud_top_temp = surface_temp - 30 * cloud_frac - 10 * np.cos(np.radians(LAT))
cloud_top_temp = np.clip(cloud_top_temp, 200, 285)

# Compute CRF
sigma = 5.67e-8
surface_albedo = 0.12 + 0.3 * (np.abs(LAT) > 60)  # ice caps

# Clear-sky fluxes
SW_clear = solar_in * surface_albedo  # reflected SW (clear)
LW_clear = sigma * surface_temp**4    # emitted LW (clear)

# All-sky fluxes
effective_albedo = (1 - cloud_frac) * surface_albedo + cloud_frac * cloud_albedo
SW_allsky = solar_in * effective_albedo
LW_allsky = (1 - cloud_frac) * sigma * surface_temp**4 + cloud_frac * 0.9 * sigma * cloud_top_temp**4

# CRF
CRF_SW = SW_clear - SW_allsky   # negative = cooling
CRF_LW = LW_clear - LW_allsky  # positive = warming
CRF_net = CRF_SW + CRF_LW

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Shortwave CRF (cooling)
ax = axes[0, 0]
ax.set_facecolor('#111827')
im1 = ax.contourf(lons, lats, CRF_SW.T, levels=20, cmap='Blues_r')
plt.colorbar(im1, ax=ax, label='W/m²')
ax.set_xlabel('Longitude', color='white')
ax.set_ylabel('Latitude', color='white')
ax.set_title('Shortwave CRF (cooling)', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 2: Longwave CRF (warming)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
im2 = ax2.contourf(lons, lats, CRF_LW.T, levels=20, cmap='Reds')
plt.colorbar(im2, ax=ax2, label='W/m²')
ax2.set_xlabel('Longitude', color='white')
ax2.set_ylabel('Latitude', color='white')
ax2.set_title('Longwave CRF (warming)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Plot 3: Net CRF
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
im3 = ax3.contourf(lons, lats, CRF_net.T, levels=20, cmap='RdBu_r')
plt.colorbar(im3, ax=ax3, label='W/m²')
ax3.set_xlabel('Longitude', color='white')
ax3.set_ylabel('Latitude', color='white')
ax3.set_title('Net CRF (blue=cooling, red=warming)', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# Plot 4: Zonal mean CRF
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
zonal_sw = np.mean(CRF_SW, axis=0)
zonal_lw = np.mean(CRF_LW, axis=0)
zonal_net = np.mean(CRF_net, axis=0)

ax4.plot(lats, zonal_sw, color='#3b82f6', linewidth=2.5, label='SW (cooling)')
ax4.plot(lats, zonal_lw, color='#ef4444', linewidth=2.5, label='LW (warming)')
ax4.plot(lats, zonal_net, color='#a855f7', linewidth=3, label='Net')
ax4.fill_between(lats, 0, zonal_net, where=zonal_net < 0, color='#3b82f6', alpha=0.15)
ax4.fill_between(lats, 0, zonal_net, where=zonal_net > 0, color='#ef4444', alpha=0.15)
ax4.axhline(0, color='white', linewidth=0.5)
# Mark Assam latitude
ax4.axvline(26, color='#fbbf24', linewidth=1.5, linestyle='--')
ax4.text(27, zonal_net[np.argmin(np.abs(lats - 26))] + 3, 'Assam', color='#fbbf24', fontsize=10)
ax4.set_xlabel('Latitude', color='white')
ax4.set_ylabel('CRF (W/m²)', color='white')
ax4.set_title('Zonal Mean Cloud Radiative Forcing', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Summary statistics
print("Cloud Radiative Forcing — Global Summary:")
print(f"  Global mean SW CRF:  {np.mean(CRF_SW):+.1f} W/m²")
print(f"  Global mean LW CRF:  {np.mean(CRF_LW):+.1f} W/m²")
print(f"  Global mean Net CRF: {np.mean(CRF_net):+.1f} W/m²")
print()
assam_idx = np.argmin(np.abs(lats - 26))
assam_lon_idx = np.argmin(np.abs(lons - 92))
print(f"Over Assam (26°N, 92°E):")
print(f"  SW CRF: {CRF_SW[assam_lon_idx, assam_idx]:+.1f} W/m²")
print(f"  LW CRF: {CRF_LW[assam_lon_idx, assam_idx]:+.1f} W/m²")
print(f"  Net CRF: {CRF_net[assam_lon_idx, assam_idx]:+.1f} W/m²")
print()
print("Clouds currently cool Earth by ~20 W/m² on average.")
print("A 10% change = ±2 W/m² — comparable to doubling CO₂.")
print("The cloud namer watches Earth\'s most powerful thermostat.")`,
      challenge: 'Simulate a seasonal analysis: compute CRF for June-August (monsoon) vs December-February (winter) over the Indian subcontinent. Show how the monsoon cloud regime changes the regional energy budget.',
      successHint: 'Cloud radiative forcing is directly measurable from space, making it one of the most important observational constraints on climate models. The CERES dataset has transformed our understanding of Earth\'s energy balance and revealed the outsized role that clouds play in determining our planet\'s temperature.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (atmospheric science fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for atmospheric thermodynamics, cloud physics, and machine learning. Click to start.</p>
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
