import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PersianIceLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stefan-Boltzmann law — radiative heat exchange with the night sky',
      concept: `Every object radiates heat as infrared radiation. The **Stefan-Boltzmann law** tells you how much:

**P = epsilon * sigma * A * T^4**

Where P is the radiated power (watts), epsilon is the emissivity (0-1, how well the surface radiates), sigma is the Stefan-Boltzmann constant (5.67 x 10^-8 W/m^2 K^4), A is the surface area (m^2), and T is the absolute temperature in kelvin.

The key insight: radiation depends on **T to the fourth power**. A small temperature change produces a large change in radiated power. This is why surfaces cool rapidly on clear desert nights — they radiate heat to the cold sky (effective temperature ~-40 to -60 degrees C) much faster than they gain heat from the still air.

The **net radiative heat exchange** between a surface and the sky is:

**Q_net = epsilon * sigma * A * (T_surface^4 - T_sky^4)**

When T_sky is much lower than T_surface, the surface loses heat rapidly. This is precisely how the yakhchal works: shallow troughs of water radiate heat to the clear desert sky, cooling below the air temperature and freezing even when the air is above 0 degrees C.

📚 *Emissivity measures how close a surface is to a "perfect radiator." Water has emissivity ~0.96 — it radiates almost as well as a blackbody. Polished metal has emissivity ~0.05 — it barely radiates at all.*`,
      analogy: 'Stand outside on a clear winter night — you feel cold even if there is no wind. That chill is your body radiating infrared heat to the cold sky. Stand under a roof or tree canopy and the chill vanishes — the warm canopy radiates heat back at you, reducing net heat loss. The yakhchal builders exploited this same effect: expose water to the cold sky, shield it from warm objects.',
      storyConnection: 'Persian ice-makers built long, shallow troughs oriented to maximise sky exposure. On clear desert nights, the effective sky temperature drops to -40 degrees C or colder. Water in these troughs radiates heat so rapidly that it freezes even when the air temperature is +5 degrees C — a phenomenon that baffled European travellers for centuries.',
      checkQuestion: 'A 10 m^2 water surface at 5 degrees C (278 K) faces a clear sky at -50 degrees C (223 K). If emissivity is 0.96, what is the net radiative heat loss?',
      checkAnswer: 'Q_net = 0.96 * 5.67e-8 * 10 * (278^4 - 223^4) = 0.96 * 5.67e-8 * 10 * (5.97e9 - 2.47e9) = 0.96 * 5.67e-8 * 10 * 3.50e9 = about 1,906 W. Nearly 2 kW of cooling from a 10 m^2 trough — enough to freeze several centimetres of ice per night.',
      codeIntro: 'Calculate radiative heat exchange between water troughs and the night sky under varying conditions.',
      code: `import numpy as np

sigma = 5.67e-8  # Stefan-Boltzmann constant (W/m^2 K^4)

def net_radiative_flux(T_surface_C, T_sky_C, emissivity=0.96):
    """Net radiative heat flux from surface to sky (W/m^2)."""
    T_s = T_surface_C + 273.15
    T_sky = T_sky_C + 273.15
    return emissivity * sigma * (T_s**4 - T_sky**4)

def sky_temperature(T_air_C, cloud_fraction=0.0, humidity_pct=20):
    """Estimate effective sky temperature from air conditions."""
    # Clear sky depression depends on humidity
    depression = 30 + (100 - humidity_pct) * 0.3
    # Clouds raise effective sky temperature
    T_sky = T_air_C - depression * (1 - 0.8 * cloud_fraction)
    return T_sky

# Ice-making conditions in Isfahan (winter nights)
print("=== Radiative Cooling for Ice Production ===")
print(f"{'Air Temp':>9} {'Sky Temp':>9} {'Flux (W/m2)':>12} {'kW per 100m2':>14} {'Ice cm/hr':>10}")
print("-" * 56)

for T_air in [8, 5, 2, 0, -3, -5]:
    T_sky = sky_temperature(T_air, cloud_fraction=0.0, humidity_pct=15)
    flux = net_radiative_flux(0, T_sky)  # water at 0C (freezing point)
    power_100m2 = flux * 100 / 1000  # kW for 100 m^2 trough
    # Ice production: latent heat of fusion = 334 kJ/kg, ice density = 917 kg/m^3
    ice_rate = flux / (334000 * 917) * 3600 * 100  # cm/hr per m^2
    print(f"{T_air:>7.0f} C {T_sky:>7.1f} C {flux:>10.1f} {power_100m2:>12.1f} {ice_rate:>8.3f}")

# Effect of cloud cover
print("\\n=== Cloud Cover Destroys Ice Production ===")
T_air = 3  # mild winter night
for cloud in [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]:
    T_sky = sky_temperature(T_air, cloud_fraction=cloud)
    flux = net_radiative_flux(0, T_sky)
    status = "FREEZING" if flux > 100 else "MARGINAL" if flux > 50 else "NO ICE"
    print(f"  Cloud {cloud*100:>3.0f}%: sky {T_sky:>6.1f} C  flux {flux:>6.1f} W/m^2  {status}")

# Emissivity comparison
print("\\n=== Surface Emissivity Matters ===")
T_sky = sky_temperature(3, 0, 15)
for name, eps in [("Water", 0.96), ("Wet clay", 0.92), ("Dry earth", 0.90),
                  ("Polished metal", 0.05), ("White paint", 0.90), ("Black paint", 0.95)]:
    flux = eps * sigma * ((273.15)**4 - (T_sky + 273.15)**4)
    print(f"  {name:<18} eps={eps:.2f}  flux={flux:>6.1f} W/m^2")`,
      challenge: 'The builders added low mud walls on three sides of the troughs to block warm radiation from the ground while keeping the sky view open above. Model the effect: if the walls block 60% of the ground radiation (assume ground at T_air), how much does the net cooling increase? This is the origin of the yakhchal wall design.',
      successHint: 'The Stefan-Boltzmann law explains why clear desert nights are bitterly cold, why frost forms on car roofs but not under carports, and why the yakhchal ice troughs work. Radiative cooling to the night sky is now being researched as a zero-energy air conditioning technology — the ancient Persians were 2,000 years ahead.',
    },
    {
      title: 'Psychrometric charts — humidity and temperature relationships',
      concept: `Air holds water vapour, and the amount it can hold depends on temperature. **Psychrometrics** is the study of these air-moisture relationships.

Key quantities:
- **Dry-bulb temperature** (T_db): the ordinary air temperature
- **Wet-bulb temperature** (T_wb): the lowest temperature achievable by evaporative cooling — always <= T_db
- **Relative humidity** (RH): actual vapour / maximum vapour at that temperature (%)
- **Dew point** (T_dp): temperature at which condensation begins
- **Specific humidity** (w): mass of water vapour per kg of dry air

The **wet-bulb depression** (T_db - T_wb) tells you the evaporative cooling potential. In dry desert air (RH ~15%), the wet-bulb depression can be 15-20 degrees C. This means evaporating water can cool a surface by 15-20 degrees below the air temperature — a massive effect.

📚 *Psychrometric charts plot all these quantities on a single diagram. HVAC engineers use them to design every air conditioning and ventilation system in the world.*`,
      analogy: 'Step out of a swimming pool on a dry day — you feel freezing cold. Step out on a humid day — barely any cooling. The dry day has a large wet-bulb depression: evaporation removes lots of heat. The humid day has a small depression: the air is already saturated, evaporation is slow, cooling is minimal. Desert air is like the driest possible day — maximum evaporative cooling.',
      storyConnection: 'The yakhchal builders chose the desert precisely because of its psychrometric properties: hot days with extremely low humidity (RH ~10-20%). The large wet-bulb depression meant wind-catchers could cool incoming air by 15+ degrees C through evaporation. The entire yakhchal cooling system — troughs, wind-catchers, and underground vaults — is a psychrometric machine.',
      checkQuestion: 'Air at 35 degrees C and 15% RH has a wet-bulb temperature of about 18 degrees C. How much evaporative cooling is available?',
      checkAnswer: 'The wet-bulb depression is 35 - 18 = 17 degrees C. Evaporative cooling can lower the air temperature by up to 17 degrees C — from scorching 35 degrees C to a comfortable 18 degrees C. This is why desert wind-catchers with wetted surfaces are so effective.',
      codeIntro: 'Calculate psychrometric properties for desert air and model the evaporative cooling potential.',
      code: `import numpy as np

def saturation_pressure(T_C):
    """Antoine equation for water saturation pressure (Pa)."""
    return 610.78 * np.exp(17.27 * T_C / (T_C + 237.3))

def wet_bulb_temperature(T_db, RH_pct):
    """Estimate wet-bulb temperature using Stull's formula."""
    RH = RH_pct
    T = T_db
    Tw = (T * np.arctan(0.151977 * np.sqrt(RH + 8.313659))
          + np.arctan(T + RH) - np.arctan(RH - 1.676331)
          + 0.00391838 * RH**1.5 * np.arctan(0.023101 * RH)
          - 4.686035)
    return Tw

def dew_point(T_db, RH_pct):
    """Calculate dew point from temperature and RH."""
    a, b = 17.27, 237.3
    gamma = a * T_db / (b + T_db) + np.log(RH_pct / 100)
    return b * gamma / (a - gamma)

def specific_humidity(T_db, RH_pct, P_atm=101325):
    """Specific humidity (kg water / kg dry air)."""
    p_sat = saturation_pressure(T_db)
    p_v = RH_pct / 100 * p_sat
    return 0.622 * p_v / (P_atm - p_v)

# Isfahan climate conditions
print("=== Psychrometric Analysis: Isfahan Desert Climate ===\\n")
print(f"{'T_db (C)':>9} {'RH (%)':>7} {'T_wb (C)':>9} {'T_dp (C)':>9} {'w (g/kg)':>9} {'Cooling':>9}")
print("-" * 54)

conditions = [
    (40, 10), (35, 15), (30, 20), (25, 25),
    (15, 30), (5, 40), (0, 50), (-5, 60),
]

for T_db, RH in conditions:
    T_wb = wet_bulb_temperature(T_db, RH)
    T_dp_val = dew_point(T_db, RH)
    w = specific_humidity(T_db, RH) * 1000  # g/kg
    cooling = T_db - T_wb
    print(f"{T_db:>7.0f} {RH:>6.0f} {T_wb:>8.1f} {T_dp_val:>8.1f} {w:>8.2f} {cooling:>7.1f} C")

# Evaporative cooling in a wind-catcher
print("\\n=== Wind-Catcher Evaporative Cooling Performance ===")
print("Air enters at outdoor conditions, exits near wet-bulb temperature")
print(f"{'Season':<14} {'T_in':>5} {'RH_in':>6} {'T_out':>6} {'Cooling':>8} {'Comfort?':>9}")
print("-" * 50)

for season, T, RH in [("Summer noon", 42, 8), ("Summer eve", 35, 12),
                       ("Spring day", 28, 20), ("Winter day", 12, 35),
                       ("Winter night", 2, 50)]:
    T_wb = wet_bulb_temperature(T, RH)
    # Wind-catcher achieves ~85% of wet-bulb depression
    T_out = T - 0.85 * (T - T_wb)
    cooling = T - T_out
    comfort = "YES" if 18 <= T_out <= 28 else "COOL" if T_out < 18 else "WARM"
    print(f"{season:<14} {T:>4.0f}C {RH:>4.0f}% {T_out:>5.1f}C {cooling:>6.1f} C {comfort:>8}")`,
      challenge: 'Calculate the water consumption of the wind-catcher: if 500 m^3/hr of air passes through and is cooled by 15 degrees C, how many litres of water evaporate per hour? (Use: energy = mass_air * Cp_air * delta_T = mass_water * latent_heat.) This is why qanats were essential — they provided the water.',
      successHint: 'Psychrometrics is the foundation of every HVAC system in the world. You now understand why desert coolers (evaporative coolers) work brilliantly in dry climates but fail in humid ones — and why the Persian builders chose the arid plateau for their ice works. The wet-bulb depression is the single most important number in passive cooling design.',
    },
    {
      title: 'Fourier heat conduction — 1D thermal analysis through thick walls',
      concept: `Heat flows through solid materials by **conduction** — vibrating atoms pass energy to their neighbours. Fourier's law describes this:

**q = -k * dT/dx**

Where q is the heat flux (W/m^2), k is the thermal conductivity (W/m K), and dT/dx is the temperature gradient (degrees C per metre).

For a flat wall in steady state, the temperature profile is linear:

**T(x) = T_hot - (T_hot - T_cold) * x / L**

But the yakhchal is different. Its walls are **2 metres thick** and made of **sarooj** — a special mortar of sand, clay, lime, egg whites, and goat hair — with remarkably low thermal conductivity (~0.3-0.5 W/m K). This means the inside stays cold even when the outside bakes at 45 degrees C.

The **thermal time constant** tells you how long it takes for a temperature change on the outside to penetrate to the inside:

**tau = rho * Cp * L^2 / k**

For a 2 m sarooj wall, this can be 80-100 hours — meaning the inside temperature responds to outdoor conditions with a 3-4 day delay.

📚 *Thermal diffusivity (alpha = k / (rho * Cp)) determines how fast temperature changes propagate. Low diffusivity = slow propagation = good thermal buffer.*`,
      analogy: 'A thick castle wall is like a very slow messenger. News from outside (temperature changes) takes a long time to reach the inside. By the time the summer heat penetrates to the interior, autumn has arrived and the outside is cooling again. The thick sarooj wall of the yakhchal creates a permanent delay — the inside never catches up with the outside.',
      storyConnection: 'The yakhchal dome walls are typically 2 metres thick at the base. This extraordinary thickness is not for structural strength — it is a thermal buffer. The sarooj mortar has about one-third the thermal conductivity of ordinary brick. Combined with the thickness, the result is a wall that takes days to transmit heat, keeping the underground ice vault near freezing all summer.',
      checkQuestion: 'A 2 m sarooj wall has k = 0.4 W/m K. The outside is 45 degrees C and the inside is 2 degrees C. What is the heat flux through the wall?',
      checkAnswer: 'q = k * delta_T / L = 0.4 * (45 - 2) / 2 = 0.4 * 43 / 2 = 8.6 W/m^2. Compare this to a 0.3 m brick wall (k = 0.8): q = 0.8 * 43 / 0.3 = 114.7 W/m^2. The yakhchal wall admits 13 times less heat — that is the difference between ice surviving the summer and melting in a week.',
      codeIntro: 'Model 1D heat conduction through the yakhchal wall and calculate the transient temperature response.',
      code: `import numpy as np

def steady_state_profile(T_out, T_in, L, n_points=50):
    """Linear temperature profile through a wall in steady state."""
    x = np.linspace(0, L, n_points)
    T = T_out + (T_in - T_out) * x / L
    return x, T

def thermal_time_constant(rho, Cp, L, k):
    """Time constant for heat to penetrate the wall (seconds)."""
    return rho * Cp * L**2 / k

def transient_conduction(T_out_func, T_in, L, k, rho, Cp, hours=120, dx=0.05):
    """1D transient heat conduction using explicit finite difference."""
    alpha = k / (rho * Cp)
    nx = int(L / dx) + 1
    dt = 0.4 * dx**2 / alpha  # stability criterion
    x = np.linspace(0, L, nx)
    T = np.full(nx, T_in)
    T[0] = T_out_func(0)

    nt = int(hours * 3600 / dt)
    record_times = [0, 6, 12, 24, 48, 72, 96, 120]
    records = {}

    for step in range(nt):
        t_hr = step * dt / 3600
        T_new = T.copy()
        T_new[0] = T_out_func(t_hr)
        for i in range(1, nx - 1):
            T_new[i] = T[i] + alpha * dt / dx**2 * (T[i+1] - 2*T[i] + T[i-1])
        T_new[-1] = T_in  # ice vault boundary
        T = T_new
        for rt in record_times:
            if abs(t_hr - rt) < dt / 3600:
                records[rt] = T.copy()

    return x, records

# Wall properties
walls = [
    ("Sarooj (yakhchal)", 0.40, 1600, 900, 2.0),
    ("Fired brick",       0.80, 2000, 900, 0.5),
    ("Limestone",         1.50, 2500, 900, 0.5),
    ("Mud brick",         0.75, 1800, 900, 0.5),
]

print("=== Steady-State Heat Flux Through Walls ===")
print(f"Outside: 45 C | Inside: 2 C")
print(f"{'Wall':<22} {'k':>5} {'L (m)':>6} {'Flux (W/m2)':>12} {'Loss/day (kJ)':>14}")
print("-" * 61)

for name, k, rho, Cp, L in walls:
    flux = k * (45 - 2) / L
    daily_loss = flux * 3600 * 24 / 1000  # kJ per m^2 per day
    print(f"{name:<22} {k:>4.2f} {L:>5.1f} {flux:>10.1f} {daily_loss:>12.0f}")

# Time constants
print("\\n=== Thermal Time Constants ===")
for name, k, rho, Cp, L in walls:
    tau = thermal_time_constant(rho, Cp, L, k)
    print(f"{name:<22} tau = {tau/3600:>6.0f} hours ({tau/3600/24:.1f} days)")

# Transient response: sudden heat wave
print("\\n=== Transient Response: Heat Wave Hits Yakhchal ===")
print("Outside jumps from 30C to 45C at t=0. Inside held at 2C by ice.")

def heat_wave(t_hr):
    return 45 if t_hr >= 0 else 30

x, records = transient_conduction(heat_wave, 2, 2.0, 0.4, 1600, 900, hours=120)

print(f"{'Time':>6} {'Surface':>9} {'0.5m in':>9} {'1.0m in':>9} {'1.5m in':>9} {'Inside':>9}")
print("-" * 52)
for t in sorted(records.keys()):
    T = records[t]
    ix = [0, len(T)//4, len(T)//2, 3*len(T)//4, -1]
    vals = [T[i] for i in ix]
    print(f"{t:>4.0f}hr" + "".join(f"{v:>8.1f}C" for v in vals))`,
      challenge: 'Model a daily cycle where the outside temperature oscillates sinusoidally between 20 degrees C (night) and 45 degrees C (day). How deep into the wall does the daily oscillation penetrate? (Answer: the amplitude decays exponentially with depth — at about 0.5 m, the daily swing is nearly zero.) This is why thick walls create stable indoor temperatures.',
      successHint: 'Fourier heat conduction is the foundation of all building thermal analysis. The 1D finite difference method you just used is the simplest version of the numerical techniques that power modern building energy simulation software (EnergyPlus, TRNSYS). The yakhchal wall is a masterclass in passive thermal design — 2 metres of low-conductivity material creating a multi-day thermal buffer.',
    },
    {
      title: 'Qanat hydraulics — underground aqueduct flow',
      concept: `The yakhchal needs water — both for ice production in the troughs and for evaporative cooling in the wind-catchers. In the Iranian desert, this water comes from **qanats**: gently sloping underground tunnels that tap groundwater and deliver it by gravity over distances of 10-70 km.

Qanat flow follows the principles of **open channel hydraulics**. The tunnel is not pressurised — water flows by gravity down a slight slope. The flow rate depends on:

**Q = (1/n) * A * R_h^(2/3) * S^(1/2)** (Manning's equation)

Where Q is flow rate (m^3/s), n is Manning's roughness coefficient, A is the cross-sectional area of flow, R_h is the hydraulic radius (A / wetted perimeter), and S is the slope.

The design challenge: too steep a slope wastes elevation (the qanat runs out of fall). Too gentle a slope produces insufficient flow. The optimal slope depends on the tunnel roughness, size, and required delivery rate.

📚 *Manning's equation (1889) is the standard formula for open channel flow. It is used to design every irrigation canal, storm drain, and sewer in the world.*`,
      analogy: 'A qanat is like a very long, gently tilted drinking straw buried underground. Gravity pulls the water along the straw from the high end (the water table in the mountains) to the low end (the yakhchal in the desert). The slope must be perfect — too steep and the water arrives too fast (erosion), too gentle and it barely trickles.',
      storyConnection: 'The qanat system of Iran represents one of the greatest hydraulic engineering achievements in human history. Some qanats have operated continuously for over 2,700 years. The qanat feeding a yakhchal had to deliver a precise flow rate — enough water to fill the freezing troughs each night, plus supply the wind-catcher evaporative system, but not so much as to flood the ice vault.',
      checkQuestion: 'A qanat tunnel is 1.0 m wide and 0.8 m high with a flow depth of 0.3 m. The slope is 1:1000 (0.001) and Manning n = 0.025. What is the flow rate?',
      checkAnswer: 'A = 1.0 * 0.3 = 0.3 m^2. Wetted perimeter = 1.0 + 2*0.3 = 1.6 m. R_h = 0.3/1.6 = 0.1875 m. Q = (1/0.025) * 0.3 * 0.1875^(2/3) * 0.001^(1/2) = 40 * 0.3 * 0.329 * 0.0316 = 0.125 m^3/s = 125 litres/second — enough to fill a 10 m x 1 m x 0.1 m trough in 8 seconds.',
      codeIntro: 'Model qanat hydraulics and calculate the flow rates needed to supply a yakhchal ice-production facility.',
      code: `import numpy as np

def manning_flow(width, depth, slope, n=0.025):
    """Open-channel flow rate using Manning's equation."""
    A = width * depth
    P_wet = width + 2 * depth
    R_h = A / P_wet
    Q = (1 / n) * A * R_h**(2/3) * slope**0.5
    velocity = Q / A
    return Q, velocity

def qanat_head_loss(length_km, slope):
    """Total elevation drop over the qanat length."""
    return length_km * 1000 * slope

def trough_fill_time(trough_volume_m3, flow_rate_m3s):
    """Time to fill a trough in minutes."""
    return trough_volume_m3 / flow_rate_m3s / 60

# Qanat design parameters
print("=== Qanat Flow Analysis ===")
print(f"{'Width (m)':>10} {'Depth (m)':>10} {'Slope':>10} {'Q (L/s)':>10} {'V (m/s)':>10}")
print("-" * 52)

for width in [0.6, 0.8, 1.0, 1.2]:
    for slope in [0.0005, 0.001, 0.002, 0.005]:
        Q, V = manning_flow(width, 0.3, slope)
        print(f"{width:>9.1f} {0.3:>9.1f} {slope:>9.4f} {Q*1000:>9.1f} {V:>9.2f}")

# Qanat length vs elevation budget
print("\\n=== Elevation Budget for Different Qanat Lengths ===")
print("(Available head = mountain elevation - yakhchal elevation)")
available_head = 200  # metres
print(f"Available head: {available_head} m")
print(f"{'Length (km)':>12} {'Slope':>10} {'Q (L/s)':>10} {'Feasible?':>10}")
print("-" * 44)

for length_km in [5, 10, 20, 30, 50, 70]:
    slope = available_head / (length_km * 1000)
    Q, V = manning_flow(0.8, 0.3, slope)
    feasible = "YES" if Q * 1000 > 10 else "MARGINAL" if Q * 1000 > 2 else "NO"
    print(f"{length_km:>10.0f} {slope:>10.5f} {Q*1000:>9.1f} {feasible:>9}")

# Water budget for ice production
print("\\n=== Yakhchal Water Budget ===")
trough_area = 200  # m^2 (total trough area)
trough_depth = 0.10  # m (10 cm water depth per night)
nights_per_season = 90  # winter ice-making season

nightly_volume = trough_area * trough_depth  # m^3
season_volume = nightly_volume * nights_per_season

Q, _ = manning_flow(0.8, 0.3, 0.001)
fill_time = trough_fill_time(nightly_volume, Q)

print(f"Trough area: {trough_area} m^2")
print(f"Nightly water need: {nightly_volume:.0f} m^3 ({nightly_volume*1000:.0f} litres)")
print(f"Season total: {season_volume:.0f} m^3")
print(f"Qanat flow rate: {Q*1000:.1f} L/s")
print(f"Time to fill troughs: {fill_time:.1f} minutes")
print(f"Qanat runs {fill_time/60:.1f} hours per night for ice production")`,
      challenge: 'Qanats gradually silt up over time, increasing the Manning roughness coefficient from 0.025 (clean) to 0.040 (silted). Calculate how much the flow rate decreases and how often the qanat must be cleaned to maintain adequate water supply. This maintenance requirement is why qanat-cleaning was a specialized, well-paid profession in Persia.',
      successHint: 'Manning\'s equation governs the design of every open channel flow system: irrigation canals, storm drains, sewers, and ancient qanats alike. You now understand why qanats work — gravity-driven flow through carefully sloped tunnels — and why their slope must be precise. The Persians achieved slopes of 1:1000 to 1:1500 over distances of 50+ km, an extraordinary surveying achievement.',
    },
    {
      title: 'Thermal comfort modelling — PMV and PPD indices',
      concept: `Thermal comfort is not just about temperature — it depends on six variables: **air temperature**, **mean radiant temperature**, **air velocity**, **humidity**, **clothing insulation**, and **metabolic rate**. Fanger's **Predicted Mean Vote (PMV)** model combines all six into a single comfort index.

PMV ranges from -3 (cold) to +3 (hot), with 0 = neutral (comfortable). The **Predicted Percentage Dissatisfied (PPD)** converts PMV to the percentage of people who would find the conditions uncomfortable:

**PPD = 100 - 95 * exp(-0.03353 * PMV^4 - 0.2179 * PMV^2)**

Even at PMV = 0 (perfect neutral), PPD = 5% — some people are always uncomfortable. The minimum acceptable range is PMV between -0.5 and +0.5 (PPD < 10%).

The yakhchal's wind-catcher creates indoor conditions by manipulating four of these six variables: it lowers air temperature (evaporative cooling), increases air velocity (stack effect), lowers radiant temperature (cool walls), and adjusts humidity (evaporation adds moisture).

📚 *PMV/PPD is the international standard (ISO 7730) for thermal comfort assessment. Every modern HVAC system is designed to maintain PMV within the comfort zone.*`,
      analogy: 'Comfort is like a recipe — you cannot make a good dish by getting just one ingredient right. A room at 22 degrees C feels cold if there is a draught (high air velocity) and you are sitting still (low metabolic rate). The same room feels warm if the walls are radiating heat (high radiant temperature) and you are exercising (high metabolic rate). PMV is the recipe that balances all the ingredients.',
      storyConnection: 'The yakhchal served dual purposes: ice storage underground and cooling for occupied spaces above. The wind-catcher was the interface — it drew hot desert air through wetted surfaces, cooling and humidifying it before directing it through living spaces. The resulting conditions (25-28 degrees C, moderate humidity, gentle breeze) achieved PMV values near zero — remarkable comfort without any mechanical system.',
      checkQuestion: 'A person wearing light clothing (0.5 clo) sits quietly (1.0 met) in a room at 30 degrees C with no air movement. Is this comfortable?',
      checkAnswer: 'No — PMV would be about +1.5 to +2.0 (warm to hot), meaning 50-75% of people would be dissatisfied. Adding air movement of 1 m/s (a fan or wind-catcher) would drop PMV to about +0.5 — within the comfort zone. This is exactly what the wind-catcher provides.',
      codeIntro: 'Calculate thermal comfort indices for spaces cooled by a yakhchal wind-catcher system.',
      code: `import numpy as np

def pmv_simple(T_air, T_radiant, V_air, RH, met=1.0, clo=0.5):
    """
    Simplified PMV calculation (Fanger's model).
    met: metabolic rate (1.0 = seated quiet)
    clo: clothing insulation (0.5 = light summer)
    """
    M = met * 58.15          # metabolic rate W/m^2
    I_cl = clo * 0.155       # clothing insulation m^2 K/W
    f_cl = 1.05 + 0.645 * I_cl if I_cl > 0.078 else 1.0 + 1.29 * I_cl

    # Clothing surface temperature (iterative, simplified)
    T_cl = T_air + (35.7 - 0.028 * M) / (1 + f_cl * 3.96e-8 *
           ((T_radiant + 273)**4 - (T_air + 273)**4) * 0.01 + f_cl * 2.38 * 0.25)
    T_cl = min(max(T_cl, T_air - 5), 40)

    # Heat loss components
    h_c = max(2.38 * abs(T_cl - T_air)**0.25, 12.1 * np.sqrt(V_air))
    p_a = RH / 100 * 610.78 * np.exp(17.27 * T_air / (T_air + 237.3))

    # PMV calculation (simplified)
    L = (M * 0.42 - 1.7 * 0.00001 * M * (5867 - p_a)
         - 0.0014 * M * (34 - T_air)
         - f_cl * h_c * (T_cl - T_air)
         - f_cl * 3.96e-8 * ((T_cl + 273)**4 - (T_radiant + 273)**4))

    PMV = (0.303 * np.exp(-0.036 * M) + 0.028) * L
    return np.clip(PMV, -3, 3)

def ppd_from_pmv(pmv):
    """Predicted Percentage Dissatisfied."""
    return 100 - 95 * np.exp(-0.03353 * pmv**4 - 0.2179 * pmv**2)

def comfort_category(pmv):
    if abs(pmv) <= 0.5: return "COMFORTABLE"
    if abs(pmv) <= 1.0: return "ACCEPTABLE"
    if abs(pmv) <= 2.0: return "UNCOMFORTABLE"
    return "EXTREME"

# Compare conditions: outdoor vs wind-catcher cooled
print("=== Thermal Comfort: Outdoor vs Wind-Catcher Cooled ===\\n")
scenarios = [
    ("Desert noon (no shade)",    45, 55, 0.5, 10,  1.0, 0.3),
    ("Desert shade",              42, 40, 0.3, 12,  1.0, 0.5),
    ("Wind-catcher (dry mode)",   32, 28, 1.5, 20,  1.0, 0.5),
    ("Wind-catcher (wet mode)",   26, 22, 1.0, 45,  1.0, 0.5),
    ("Ice vault entrance",        18, 15, 0.5, 55,  1.0, 0.7),
    ("Underground vault",          5,  4, 0.2, 70,  1.5, 1.0),
    ("Modern AC office",          23, 23, 0.1, 50,  1.2, 0.6),
]

print(f"{'Scenario':<28} {'Ta':>4} {'Tr':>4} {'V':>4} {'RH':>4} {'PMV':>6} {'PPD%':>5} {'Rating':<14}")
print("-" * 73)
for name, Ta, Tr, V, RH, met, clo in scenarios:
    pmv = pmv_simple(Ta, Tr, V, RH, met, clo)
    ppd = ppd_from_pmv(pmv)
    cat = comfort_category(pmv)
    print(f"{name:<28} {Ta:>3.0f} {Tr:>3.0f} {V:>3.1f} {RH:>3.0f} {pmv:>+5.1f} {ppd:>4.0f}% {cat}")

# Effect of wind-catcher air velocity
print("\\n=== Air Velocity Effect (T=30C, RH=25%, light clothing) ===")
for v in [0.0, 0.3, 0.5, 1.0, 1.5, 2.0, 3.0]:
    pmv = pmv_simple(30, 28, v, 25)
    ppd = ppd_from_pmv(pmv)
    print(f"  V = {v:>3.1f} m/s: PMV = {pmv:>+5.2f}  PPD = {ppd:>4.0f}%  {comfort_category(pmv)}")`,
      challenge: 'The wind-catcher was adjustable: dampers could increase or decrease airflow. Find the optimal air velocity for comfort at 30 degrees C and 25% RH. Then find the optimal velocity at 35 degrees C. How does the "comfort velocity" change with temperature? This is the adaptive comfort model used in naturally ventilated building design.',
      successHint: 'You just applied the international standard for thermal comfort (ISO 7730) — the same model used to design HVAC systems in every modern building. The remarkable finding: Persian wind-catchers achieved PMV values comparable to modern air conditioning, using zero energy. This is why passive cooling is experiencing a renaissance in sustainable building design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Thermal physics and hydraulic engineering</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into radiative cooling, psychrometrics, Fourier conduction, qanat hydraulics, and thermal comfort modelling.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
