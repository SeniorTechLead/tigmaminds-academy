import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PersianIceLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Radiative cooling — freezing water when the air is above 0°C',
      concept: `Every object radiates infrared energy proportional to the **fourth power** of its temperature. This is the **Stefan-Boltzmann law**:

**P = ε σ A T⁴**

where ε is emissivity (0–1), σ = 5.67 × 10⁻⁸ W/m²K⁴ is the Stefan-Boltzmann constant, A is area, and T is absolute temperature in Kelvin. A water surface (ε ≈ 0.96) radiates strongly in the infrared.

At night, the water surface radiates heat upward toward the sky. If the sky is **clear and dry** (low humidity), very little of that radiation is absorbed and re-emitted back — the infrared radiation escapes into space, which has an effective temperature around **-50°C to -20°C** (the "sky temperature"). The water loses heat faster than the surrounding air can resupply it, and the surface temperature drops **below the air temperature**.

In the Iranian desert, where Persian ice houses (yakhchāl) were built, the air is extremely dry (relative humidity often below 15%). Under these conditions, the sky temperature can be **30–40°C below** the air temperature. If the air is at +5°C on a winter night, the effective sky is at -30°C. The water surface cools to 0°C and **freezes** — even though the air never reaches freezing.

📚 *This is not magic — it is the same physics that causes frost on your car windshield on nights when the air temperature stays above 0°C. The car roof radiates heat to the cold sky and drops below freezing locally. Persian engineers exploited this effect on an industrial scale over 2,400 years ago.*`,
      analogy: 'Imagine standing in a large room at 20°C, facing a wall of ice at -40°C. Even though the room air is warm, the side of your body facing the ice feels cold — you are radiating your heat toward the ice faster than the room air can warm you. The night sky is that ice wall. Water in a shallow pool "sees" the -30°C sky above and radiates its heat away, cooling below the surrounding air.',
      storyConnection: 'Persian engineers built shallow pools, only 10–30 cm deep, exposed to the clear desert sky. They shaded the pools from the south with tall walls (up to 10 m high) to block any daytime sun from warming the water. On cold winter nights, the radiative cooling froze these shallow layers of water into sheets of ice — harvested at dawn before the sun could melt them.',
      checkQuestion: 'A 10 m × 10 m pool of water at 5°C radiates to a clear sky at an effective temperature of -25°C. What is the net radiative heat loss from the water surface? (Use ε = 0.96 for water.)',
      checkAnswer: 'P_water = 0.96 × 5.67e-8 × 100 × (278.15)⁴ = 325.4 W/m² × 100 = 32,540 W total radiated. P_sky = 0.96 × 5.67e-8 × 100 × (248.15)⁴ = 206.4 W/m² × 100 = 20,640 W received back from sky. Net loss = 32,540 - 20,640 ≈ 11,900 W. That is nearly 12 kW of cooling power from a single pool — enough to freeze a significant layer of water overnight.',
      codeIntro: 'Calculate radiative heat loss from a water pool to the night sky and determine whether the water freezes.',
      code: `import numpy as np

# Stefan-Boltzmann constant
SIGMA = 5.67e-8  # W / m^2 K^4

def radiative_heat_flux(T_surface_C, T_sky_C, emissivity=0.96):
    """Net radiative heat loss from surface to sky (W/m^2)."""
    T_s = T_surface_C + 273.15
    T_sky = T_sky_C + 273.15
    q_out = emissivity * SIGMA * T_s**4
    q_in  = emissivity * SIGMA * T_sky**4
    return q_out - q_in  # positive = net loss

def sky_temperature(T_air_C, relative_humidity):
    """Approximate clear-sky effective temperature."""
    T_air_K = T_air_C + 273.15
    # Berdahl-Martin model (empirical)
    dew_depression = (1 - relative_humidity) * 20  # simplified
    T_dp = T_air_C - dew_depression
    eps_sky = 0.741 + 0.0062 * T_dp
    T_sky_K = T_air_K * eps_sky**0.25
    return T_sky_K - 273.15

# Desert conditions: cold winter night, very dry
print("=== Radiative Cooling in the Persian Desert ===\\n")
print(f"{'Air T (°C)':<12} {'RH %':<8} {'Sky T (°C)':<12} {'Net Loss (W/m²)':<17} {'Freezes?'}")
print("-" * 62)

for T_air in [8, 5, 3, 0, -2]:
    for rh in [0.10, 0.30, 0.60]:
        T_sky = sky_temperature(T_air, rh)
        q_net = radiative_heat_flux(T_air, T_sky)
        freezes = "YES" if q_net > 60 and T_air < 8 else "Maybe" if q_net > 40 else "No"
        print(f"{T_air:<12} {rh*100:<8.0f} {T_sky:<12.1f} {q_net:<17.1f} {freezes}")

# Simulate freezing overnight
print(f"\\n=== Overnight Freezing Simulation ===")
print(f"Pool: 10 m × 10 m × 0.15 m deep")
print(f"Air temperature: 5°C, RH: 10%\\n")

pool_area = 100        # m^2
depth = 0.15           # m
water_mass = pool_area * depth * 1000  # kg
c_water = 4186         # J/kg K
latent_heat = 334000   # J/kg (heat of fusion)

T_water = 5.0
T_air = 5.0
rh = 0.10
T_sky = sky_temperature(T_air, rh)
dt = 60  # 1-minute time steps
ice_formed = 0

print(f"Sky temperature: {T_sky:.1f}°C")
print(f"\\n{'Hour':<6} {'Water T (°C)':<14} {'Heat Loss (kW)':<16} {'Ice (kg)'}")
print("-" * 52)

for minute in range(720):  # 12-hour night
    q_rad = radiative_heat_flux(T_water, T_sky) * pool_area
    q_conv = 5.0 * pool_area * (T_water - T_air)  # convective exchange
    q_net = q_rad - q_conv  # net cooling

    if T_water > 0:
        dT = q_net * dt / (water_mass * c_water)
        T_water -= dT
        if T_water < 0:
            T_water = 0
    else:
        dm = q_net * dt / latent_heat
        ice_formed += dm

    if minute % 60 == 0:
        print(f"{minute//60:<6} {T_water:<14.2f} {q_net/1000:<16.2f} {ice_formed:<.0f}")

print(f"\\nFinal: {ice_formed:.0f} kg of ice formed ({ice_formed/water_mass*100:.1f}% of pool)")
print(f"Ice thickness: {ice_formed / (pool_area * 917) * 100:.1f} cm")
print(f"\\nThis is how Persian engineers froze water in the desert —")
print(f"no electricity, no chemicals, just physics and clear skies.")`,
      challenge: 'What happens on a humid night (RH = 70%)? Modify the simulation. You will find the sky temperature rises dramatically, the radiative loss drops, and the water may not freeze. This explains why yakhchāl work in arid Iran but would fail in tropical climates.',
      successHint: 'You modeled the Stefan-Boltzmann law — the same physics that governs Earth\'s energy balance, star luminosity, and spacecraft thermal design. Persian engineers exploited this physics 2,400 years before Stefan formalized the equation in 1879. The desert climate was not a disadvantage — it was the key ingredient.',
    },
    {
      title: 'Evaporative cooling — wet-bulb temperature and desert dryness',
      concept: `When water evaporates, it absorbs **latent heat** from its surroundings — approximately **2,450 kJ per kg** of water evaporated. This is the same physics behind sweating: your body cools because evaporating sweat draws energy from your skin.

The lowest temperature achievable by evaporation alone is the **wet-bulb temperature** (Twb). This depends on both the air temperature and the **relative humidity**. In dry air, water evaporates quickly and the cooling is substantial. In humid air, evaporation slows and cooling is minimal.

The wet-bulb temperature can be approximated by:

**Twb ≈ T × arctan(0.151977(RH + 8.313659)^0.5) + arctan(T + RH) - arctan(RH - 1.676331) + 0.00391838 × RH^1.5 × arctan(0.023101 × RH) - 4.686035**

(Stull's empirical formula, where T is in °C and RH is in percent.)

In the Iranian desert on a summer day — 40°C air, 10% relative humidity — the wet-bulb temperature drops to about **19°C**. That is a **21°C cooling effect** from evaporation alone. Persian engineers used this by draping wet cloths over ventilation shafts (bādgirs) and channeling wind through underground water channels (qanāts).

📚 *Wet-bulb temperature is now a critical climate metric. When the wet-bulb temperature exceeds 35°C, the human body cannot cool itself by sweating — even in the shade. Climate scientists track wet-bulb extremes as a measure of deadly heat. The same physics that cooled Persian ice houses defines the limit of human survival.*`,
      analogy: 'Hold your hand under a running tap, then wave it in the air. Your hand feels cold — not because the air is cold, but because the water is evaporating and drawing heat from your skin. Now imagine doing this in a bone-dry desert: the evaporation is furious, and the cooling is extreme. Persian engineers harnessed this "waving wet hand" effect at building scale.',
      storyConnection: 'Yakhchāl buildings often included bādgirs — wind-catching towers that funneled desert breezes down into the storage chamber. The air passed over shallow pools or wet surfaces, cooling by evaporation before entering the ice vault. This created a natural air-conditioning system that kept the interior cool even on 40°C summer days, reducing ice melt rates dramatically.',
      checkQuestion: 'On a 35°C day with 15% relative humidity, what is the approximate wet-bulb temperature? How much cooling does evaporation provide?',
      checkAnswer: 'Using Stull\'s formula, Twb ≈ 16.5°C. The evaporative cooling provides 35 - 16.5 = 18.5°C of temperature drop. In the yakhchāl context, this means air entering through a bādgir at 35°C could be cooled to about 17°C before reaching the ice chamber — a remarkable natural air conditioning effect.',
      codeIntro: 'Calculate wet-bulb temperatures and evaporative cooling potential across different climates.',
      code: `import numpy as np

def wet_bulb_stull(T_C, RH_pct):
    """Wet-bulb temperature using Stull (2011) empirical formula."""
    T = T_C
    RH = RH_pct
    Twb = (T * np.arctan(0.151977 * (RH + 8.313659)**0.5)
           + np.arctan(T + RH)
           - np.arctan(RH - 1.676331)
           + 0.00391838 * RH**1.5 * np.arctan(0.023101 * RH)
           - 4.686035)
    return Twb

def evaporative_cooling_rate(T_air_C, RH_pct, wind_speed_ms, area_m2):
    """Estimate evaporative heat removal rate in watts."""
    Twb = wet_bulb_stull(T_air_C, RH_pct)
    dT = T_air_C - Twb
    # Convective mass transfer coefficient (simplified)
    h_conv = 5.7 + 3.8 * wind_speed_ms  # W/m^2 K
    # Evaporative cooling ≈ convective × Lewis ratio
    q_evap = h_conv * area_m2 * dT * 1.5  # Lewis ratio ~1.5 for evap
    return q_evap, Twb

# Compare climates
print("=== Wet-Bulb Temperature Across Climates ===\\n")
print(f"{'Location':<22} {'T (°C)':<8} {'RH %':<7} {'Twb (°C)':<10} {'Cooling (°C)'}")
print("-" * 55)

climates = [
    ("Isfahan, Iran (summer)", 38, 12),
    ("Yazd, Iran (summer)", 40, 8),
    ("Tehran (summer)", 35, 20),
    ("Mumbai (monsoon)", 32, 85),
    ("Phoenix, USA", 42, 10),
    ("Houston, USA", 35, 70),
    ("London, UK", 25, 65),
    ("Riyadh, Saudi", 45, 8),
    ("Singapore", 32, 80),
]

for name, T, rh in climates:
    Twb = wet_bulb_stull(T, rh)
    cooling = T - Twb
    print(f"{name:<22} {T:<8} {rh:<7} {Twb:<10.1f} {cooling:<.1f}")

# Yakhchal badgir (wind tower) analysis
print(f"\\n=== Bādgir Evaporative Cooling for a Yakhchāl ===")
print(f"Wind tower cross-section: 2 m × 2 m")
print(f"Wind speed through tower: 3 m/s\\n")

tower_area = 4.0  # m^2
wind = 3.0  # m/s
air_density = 1.2  # kg/m^3
c_air = 1005  # J/kg K
airflow = air_density * tower_area * wind  # kg/s

print(f"Air mass flow: {airflow:.1f} kg/s\\n")
print(f"{'Condition':<25} {'T_in (°C)':<11} {'T_out (°C)':<12} {'Cooling (kW)'}")
print("-" * 58)

for label, T, rh in [("Summer day (dry)", 40, 10),
                       ("Summer day (moderate)", 35, 25),
                       ("Spring evening", 25, 15),
                       ("Winter night", 5, 20)]:
    Twb = wet_bulb_stull(T, rh)
    T_out = Twb + 2  # imperfect evaporation
    q = airflow * c_air * (T - T_out) / 1000
    print(f"{label:<25} {T:<11} {T_out:<12.1f} {q:<.1f}")

# Water consumption
print(f"\\n=== Water Cost of Evaporative Cooling ===")
latent_heat = 2450  # kJ/kg
for q_kw in [10, 30, 60]:
    water_rate = q_kw / latent_heat  # kg/s
    liters_per_hour = water_rate * 3600
    print(f"  {q_kw} kW cooling requires {liters_per_hour:.1f} L/hour evaporation")

print(f"\\nPersian qanats (underground water channels) supplied this water.")
print(f"The qanat system is itself an engineering marvel — gravity-fed")
print(f"tunnels up to 70 km long, maintaining a gentle slope underground.")`,
      challenge: 'Calculate the wet-bulb temperature for a worst-case scenario: 50°C with 50% humidity. This represents a wet-bulb value near 35°C — the threshold for human survival. How does this connect to modern climate change concerns?',
      successHint: 'You modeled evaporative cooling — the same physics behind cooling towers in power plants, swamp coolers in homes, and human sweating. Persian engineers combined this with radiative cooling and insulation to create a complete thermal system. Modern HVAC engineers are rediscovering these passive techniques as energy costs rise.',
    },
    {
      title: 'Thermal insulation — the U-value and sārooj walls',
      concept: `Heat flows through a wall at a rate proportional to the **temperature difference** and inversely proportional to the wall's **thermal resistance**. The standard measure is the **U-value** (overall heat transfer coefficient):

**q = U × A × ΔT**

where q is heat flow in watts, A is wall area in m², and ΔT is the temperature difference across the wall. A **lower U-value means better insulation**.

The U-value depends on the wall's thickness and thermal conductivity (k):

**U = k / d** (for a single homogeneous layer)

where k is in W/(m·K) and d is thickness in metres. For multi-layer walls, resistances add in series:

**R_total = d₁/k₁ + d₂/k₂ + ... + 1/h_inside + 1/h_outside**
**U = 1/R_total**

Persian ice houses used **sārooj** — a mortar made from sand, clay, lime, egg whites, and goat hair. This composite material has a thermal conductivity of approximately **0.3–0.5 W/(m·K)**, comparable to modern clay brick. But the walls were built **2 metres thick**, giving them an extremely low U-value.

For a 2 m thick sārooj wall: U = 0.4 / 2.0 = 0.2 W/(m²·K). A modern insulated wall achieves about U = 0.15–0.25 W/(m²·K) using foam and air gaps — the Persians matched modern performance with sheer mass.

📚 *The egg whites and goat hair in sārooj are not random additions. Egg whites provide protein-based binding (similar to modern polymer adhesives), and goat hair provides tensile reinforcement (similar to fiberglass in modern composites). Ancient engineers were materials scientists.*`,
      analogy: 'Wrap a cup of hot coffee in a thin napkin — it cools quickly. Now wrap it in a thick sleeping bag — it stays warm for hours. The sleeping bag is not generating heat; it is resisting heat flow. The 2-metre sārooj wall is the sleeping bag around the ice: it cannot stop heat flow entirely, but it slows it to a trickle.',
      storyConnection: 'The dome of a yakhchāl was typically 2 metres thick at the base and over a metre thick at the apex. The dome shape was structurally efficient — it distributed compressive forces evenly, allowing thick walls without collapse. The builders shaped the dome using wooden formwork, removing it once the sārooj had cured. Some yakhchāl domes still stand after 2,000 years.',
      checkQuestion: 'A yakhchāl has 2 m thick sārooj walls (k = 0.4 W/m·K) and a total surface area of 500 m². If the outside is 35°C and the inside is 2°C, how much heat leaks in per hour?',
      checkAnswer: 'U = 0.4 / 2.0 = 0.2 W/(m²·K). q = 0.2 × 500 × (35 - 2) = 0.2 × 500 × 33 = 3,300 W = 3.3 kW. Over one hour: 3.3 kW × 3600 s = 11.88 MJ. To melt ice: 334 kJ/kg, so this melts 11,880 / 334 ≈ 35.6 kg of ice per hour. A yakhchāl storing 5,000 kg of ice loses about 0.7% per hour — survivable over a full summer with a large enough store.',
      codeIntro: 'Model heat flow through yakhchāl walls and compare with modern insulation materials.',
      code: `import numpy as np

def u_value(layers):
    """
    Calculate U-value for a multi-layer wall.
    layers: list of (name, thickness_m, k_W_mK)
    Includes internal and external surface resistances.
    """
    R_si = 0.13   # internal surface resistance (m^2 K/W)
    R_se = 0.04   # external surface resistance
    R_total = R_si + R_se
    for name, d, k in layers:
        R_total += d / k
    return 1.0 / R_total

def heat_flow(U, area, T_out, T_in):
    """Heat flow through wall in watts."""
    return U * area * (T_out - T_in)

# Compare wall constructions
print("=== U-Value Comparison: Ancient vs Modern ===\\n")
print(f"{'Wall Type':<35} {'U (W/m²K)':<12} {'Rating'}")
print("-" * 55)

walls = [
    ("Yakhchal sarooj (2.0 m)", [("sarooj", 2.0, 0.40)]),
    ("Yakhchal sarooj (1.5 m)", [("sarooj", 1.5, 0.40)]),
    ("Modern brick (0.23 m)", [("brick", 0.23, 0.77)]),
    ("Brick + cavity + brick", [("brick", 0.10, 0.77),
                                  ("air gap", 0.05, 0.025),
                                  ("brick", 0.10, 0.77)]),
    ("Brick + 100mm foam + brick", [("brick", 0.10, 0.77),
                                      ("EPS foam", 0.10, 0.035),
                                      ("brick", 0.10, 0.77)]),
    ("Modern Passivhaus wall", [("render", 0.02, 0.80),
                                  ("block", 0.15, 0.15),
                                  ("mineral wool", 0.30, 0.035),
                                  ("board", 0.01, 0.16)]),
    ("Straw bale wall (0.45 m)", [("straw", 0.45, 0.065)]),
]

u_results = []
for name, layers in walls:
    U = u_value(layers)
    if U < 0.15:
        rating = "Excellent"
    elif U < 0.30:
        rating = "Good"
    elif U < 0.60:
        rating = "Moderate"
    else:
        rating = "Poor"
    u_results.append((name, U, rating))
    print(f"{name:<35} {U:<12.3f} {rating}")

# Yakhchal ice melt analysis
print(f"\\n=== Yakhchal Ice Survival Over Summer ===")
print(f"Storage: dome, 12 m diameter, 8 m high")
print(f"Wall: 2 m thick sarooj (k = 0.4 W/m·K)")
print(f"Initial ice: 5,000 kg at 0°C\\n")

r_outer = 6.0  # m
height = 8.0
surface_area = 2 * np.pi * r_outer * height + np.pi * r_outer**2  # cylinder + top
surface_area *= 0.7  # dome correction factor

U_wall = u_value([("sarooj", 2.0, 0.40)])
latent_heat = 334000  # J/kg
ice_mass = 5000  # kg

print(f"Surface area: {surface_area:.0f} m²")
print(f"U-value: {U_wall:.3f} W/(m²·K)\\n")

# Monthly average temperatures in Yazd, Iran
months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]
T_outside = [22, 28, 34, 37, 35, 30]

print(f"{'Month':<6} {'T_out (°C)':<12} {'Heat In (W)':<13} {'Ice Melt (kg/day)':<19} {'Ice Left (kg)'}")
print("-" * 65)

for i, (month, T_out) in enumerate(zip(months, T_outside)):
    T_in = 2.0  # maintained near 0 by ice
    q = heat_flow(U_wall, surface_area, T_out, T_in)
    melt_per_day = q * 86400 / latent_heat
    ice_mass -= melt_per_day * 30
    if ice_mass < 0:
        ice_mass = 0
    print(f"{month:<6} {T_out:<12} {q:<13.0f} {melt_per_day:<19.1f} {ice_mass:<.0f}")

if ice_mass > 0:
    print(f"\\nIce survives the summer! {ice_mass:.0f} kg remain in September.")
else:
    print(f"\\nIce ran out — a larger initial store or thicker walls needed.")

print(f"\\nThe 2 m sarooj wall achieves U = {U_wall:.3f} W/(m²K) —")
print(f"comparable to a modern insulated cavity wall, using only")
print(f"sand, clay, lime, egg whites, and goat hair.")`,
      challenge: 'Add a ground floor to the model. The yakhchāl was dug several metres below ground level, where the soil temperature stays around 15°C year-round. How does the underground portion change the total heat gain? (Hint: the ground acts as a thermal buffer, reducing heat flow through the floor.)',
      successHint: 'You analyzed thermal resistance — the same concept used in building energy ratings, electronics heat sink design, and spacecraft thermal shielding. The Persians achieved modern insulation performance through massive thickness. Modern engineers achieve it through clever materials. Both approaches obey the same equation: R = d/k.',
    },
    {
      title: 'Thermal mass — the day/night cycle and temperature damping',
      concept: `A thick, heavy wall does not just resist steady-state heat flow — it also **delays and dampens** temperature fluctuations. When the outside temperature swings between 40°C (day) and 5°C (night), a massive wall acts as a **thermal flywheel**, smoothing out the extremes.

Two key quantities describe this:

**Time lag (φ)**: how many hours the peak heat takes to penetrate the wall. For a homogeneous wall: **φ = d² / (2α)** where d is thickness and **α = k/(ρc)** is thermal diffusivity (k = conductivity, ρ = density, c = specific heat capacity).

**Decrement factor (f)**: how much the temperature swing is reduced. **f = exp(-d × √(π / (α × P)))** where P is the period (86400 seconds for a daily cycle).

For a 2 m sārooj wall (k = 0.4, ρ = 1800 kg/m³, c = 900 J/kg·K):
- α = 0.4 / (1800 × 900) = 2.47 × 10⁻⁷ m²/s
- Time lag: φ ≈ **56 hours** — the temperature peak takes over two days to cross the wall
- Decrement factor: f ≈ **0.0002** — the 35°C daily swing is reduced to 0.007°C inside

This means the interior temperature barely fluctuates at all. The ice experiences an almost **perfectly constant** temperature — the ideal storage condition.

📚 *This is why traditional desert buildings feel cool inside during the day and warm at night. The thermal mass absorbs daytime heat (cooling the interior) and releases it at night (warming the interior). The thick yakhchāl walls take this to an extreme — essentially eliminating the day/night cycle inside.*`,
      analogy: 'A small boat rocks violently in ocean waves, but an aircraft carrier barely moves. The carrier\'s mass smooths out the wave energy — it has too much inertia to follow each wave. A thick wall does the same with temperature waves: the massive sārooj has so much thermal inertia that daily temperature swings pass over it like ocean swells over an aircraft carrier.',
      storyConnection: 'The yakhchāl dome was not just thick for insulation — its mass served the equally important role of thermal flywheel. Even if the outside temperature reached 45°C at midday, the interior would not feel that heat for over two days. By then, the nighttime cold had already cancelled it out. The wall was perpetually "behind" — always averaging past temperatures rather than tracking current ones.',
      checkQuestion: 'If a wall has a time lag of 56 hours and the outside temperature peaks at noon, when does the inside wall surface reach its peak temperature?',
      checkAnswer: 'The inside surface peaks 56 hours after the outside peak — that is 2 days and 8 hours later. But by then, the outside has gone through two full day/night cycles. The inside peak corresponds to a temperature that was already "averaged" over multiple cycles. Combined with the decrement factor of 0.0002, the inside peak is virtually identical to the average outside temperature.',
      codeIntro: 'Simulate how a thick wall transforms the wild desert temperature swing into a nearly flat interior temperature.',
      code: `import numpy as np

def thermal_properties(k, rho, c):
    """Calculate thermal diffusivity and related properties."""
    alpha = k / (rho * c)
    return alpha

def time_lag_hours(thickness_m, alpha):
    """Time lag for temperature wave to cross the wall."""
    period = 86400  # seconds (24-hour cycle)
    lag_s = thickness_m * np.sqrt(period / (2 * np.pi * alpha))
    return lag_s / 3600

def decrement_factor(thickness_m, alpha, period_s=86400):
    """How much the temperature amplitude is reduced."""
    return np.exp(-thickness_m * np.sqrt(np.pi / (alpha * period_s)))

# Sarooj properties
k_sar = 0.40      # W/(m K)
rho_sar = 1800    # kg/m^3
c_sar = 900       # J/(kg K)
alpha_sar = thermal_properties(k_sar, rho_sar, c_sar)

print("=== Thermal Mass Properties ===\\n")

materials = [
    ("Sarooj (2.0 m)", 2.0, 0.40, 1800, 900),
    ("Sarooj (1.0 m)", 1.0, 0.40, 1800, 900),
    ("Concrete (0.3 m)", 0.3, 1.40, 2300, 880),
    ("Brick (0.23 m)", 0.23, 0.77, 1700, 800),
    ("Adobe (0.4 m)", 0.4, 0.52, 1500, 900),
    ("Rammed earth (0.6 m)", 0.6, 0.60, 1900, 880),
    ("EPS foam (0.1 m)", 0.1, 0.035, 25, 1400),
]

print(f"{'Material':<22} {'Lag (hr)':<10} {'Decrement':<12} {'Swing In (°C)'}")
print("-" * 56)
T_swing = 35  # outside day/night swing in degrees

for name, d, k, rho, c in materials:
    alpha = thermal_properties(k, rho, c)
    lag = time_lag_hours(d, alpha)
    dec = decrement_factor(d, alpha)
    inside_swing = T_swing * dec
    print(f"{name:<22} {lag:<10.1f} {dec:<12.6f} {inside_swing:<.4f}")

# Simulate temperature wave through sarooj wall
print(f"\\n=== 72-Hour Temperature Simulation ===")
print(f"Outside: 22.5°C mean, ±17.5°C swing (5°C night, 40°C day)")
print(f"Wall: 2.0 m sarooj\\n")

T_mean = 22.5
T_amp = 17.5
hours = np.arange(0, 72, 1)

T_outside = T_mean + T_amp * np.sin(2 * np.pi * hours / 24 - np.pi/2)

lag = time_lag_hours(2.0, alpha_sar)
dec = decrement_factor(2.0, alpha_sar)
T_inside = T_mean + T_amp * dec * np.sin(2 * np.pi * (hours - lag) / 24 - np.pi/2)

print(f"{'Hour':<6} {'Outside (°C)':<14} {'Inside (°C)':<14} {'Difference'}")
print("-" * 48)

for h in range(0, 72, 6):
    diff = T_outside[h] - T_inside[h]
    print(f"{h:<6} {T_outside[h]:<14.1f} {T_inside[h]:<14.4f} {diff:<+.1f}")

print(f"\\nOutside range: {T_outside.min():.1f}°C to {T_outside.max():.1f}°C")
print(f"Inside range:  {T_inside.min():.4f}°C to {T_inside.max():.4f}°C")
print(f"Time lag: {lag:.1f} hours")
print(f"Decrement: {dec:.6f}")
print(f"\\nThe interior is essentially isothermal — the 35°C outside")
print(f"swing is reduced to {T_amp*dec*2:.4f}°C inside. The ice")
print(f"experiences a nearly constant temperature environment.")`,
      challenge: 'Model a wall made of two layers: 0.5 m brick on the outside and 1.5 m sārooj on the inside. How do the time lag and decrement factor compare to 2.0 m of pure sārooj? (Hint: you need to compute each layer\'s resistance and time constant separately, then combine them.)',
      successHint: 'You modeled thermal mass dynamics — the same physics used in passive solar building design, thermal energy storage systems, and even planetary science (why deserts are hot by day and cold at night, but oceans stay moderate). The yakhchāl wall is a masterpiece of thermal engineering — simultaneously an insulator, a thermal flywheel, and a structural dome.',
    },
    {
      title: 'The complete yakhchāl — ice production, storage, and survival',
      concept: `A yakhchāl is a **complete thermodynamic system** integrating three mechanisms:

**1. Ice production** (winter): Shallow pools exposed to the clear night sky lose heat by radiation. Tall south-facing walls shade the pools during the day. On nights when the air temperature drops to 5°C or below, the radiative loss to the cold sky freezes the top layer of water. Workers harvest the ice sheets at dawn.

**2. Ice transport**: The harvested ice is carried into the underground dome and stacked in layers, with straw separating the blocks to prevent them from fusing into a solid mass (which would make it impossible to extract individual pieces later).

**3. Ice storage** (summer): The dome's 2 m thick sārooj walls provide insulation (low U-value) and thermal mass (extreme time lag). The underground location uses the earth's stable ~15°C temperature as a buffer. Evaporative cooling via bādgir towers reduces the air temperature inside. Drainage channels remove meltwater before it can warm the remaining ice.

The system must produce **more ice in winter than melts in summer**. A typical yakhchāl stored **5,000–30,000 kg** of ice, supplying a village through the hottest months. The ice was used to cool drinks, preserve food, and make **faloodeh** — an ancient Persian frozen dessert (one of the world's oldest ice cream recipes).

📚 *The yakhchāl system is a net-zero energy refrigeration system — it uses no fuel, no electricity, no chemicals. Every joule of cooling comes from radiative loss to space, evaporative cooling from water, and thermal resistance from earth and sārooj. Modern engineers call this "passive cooling" — the Persians perfected it 2,400 years ago.*`,
      analogy: 'Think of a bank account. In winter, you "deposit" ice (cold energy) through radiative freezing. In summer, the heat "withdraws" ice through melting. The thick walls are like a low-fee account — they minimize the rate of withdrawal. The system works as long as winter deposits exceed summer withdrawals. The yakhchāl is a thermal bank, saving winter cold for summer use.',
      storyConnection: 'The largest yakhchāl structures, found near Yazd and Kerman in Iran, could store enough ice to serve entire towns. Some had multiple production pools, each with its own shading wall, feeding into a single central dome. The system required community coordination — ice harvesting was a communal winter activity, and ice distribution was managed through the summer. Several yakhchāl domes still stand after centuries, testament to the durability of sārooj construction.',
      checkQuestion: 'If a yakhchāl produces 200 kg of ice per cold night, and there are 60 suitable nights per winter, how much ice is available? If summer melting averages 40 kg/day over 180 days, does the ice survive?',
      checkAnswer: 'Production: 200 × 60 = 12,000 kg. Summer loss: 40 × 180 = 7,200 kg. Surplus: 12,000 - 7,200 = 4,800 kg. Yes, the ice survives — with 4,800 kg to spare. This surplus accounts for distribution to the community. A well-designed yakhchāl produces roughly 1.5–2× what it needs for summer survival.',
      codeIntro: 'Simulate a complete yakhchāl system over a full year — production in winter, storage and melting in summer.',
      code: `import numpy as np

SIGMA = 5.67e-8
LATENT_ICE = 334000  # J/kg

def monthly_temps_yazd():
    """Monthly average temperatures in Yazd, Iran (°C)."""
    return {
        "Jan": (3, 12, -3), "Feb": (6, 15, -1),
        "Mar": (12, 21, 4),  "Apr": (18, 27, 10),
        "May": (24, 33, 15), "Jun": (29, 38, 20),
        "Jul": (31, 40, 22), "Aug": (29, 38, 20),
        "Sep": (25, 34, 16), "Oct": (18, 27, 10),
        "Nov": (11, 19, 3),  "Dec": (5, 14, -1),
    }

def nightly_ice_production(T_air_C, rh, pool_area, pool_depth):
    """Estimate ice produced in one night (kg)."""
    T_sky = T_air_C - (1 - rh) * 25  # simplified sky temp
    q_rad = 0.96 * SIGMA * ((T_air_C+273)**4 - (T_sky+273)**4)
    q_net = q_rad * pool_area
    hours = 10  # hours of darkness
    energy = q_net * hours * 3600  # Joules

    # Must first cool water to 0°C
    water_mass = pool_area * pool_depth * 1000
    c_water = 4186
    cool_energy = water_mass * c_water * max(0, T_air_C)
    freeze_energy = max(0, energy - cool_energy)
    ice = freeze_energy / LATENT_ICE
    return min(ice, water_mass)  # can't freeze more than exists

def daily_melt(T_outside_C, ice_mass, U, surface_area, T_inside=1.0):
    """Ice melted per day from heat infiltration."""
    if ice_mass <= 0:
        return 0
    q = U * surface_area * max(0, T_outside_C - T_inside)
    q_evap_reduction = 0.85  # badgir reduces effective temperature
    return (q * q_evap_reduction * 86400) / LATENT_ICE

# Yakhchal system parameters
pool_area = 200    # m^2 total freezing pool area
pool_depth = 0.12  # m
dome_U = 0.20      # W/(m^2 K)
dome_area = 400    # m^2 total surface
rh_winter = 0.20
rh_summer = 0.10

temps = monthly_temps_yazd()
ice_stored = 0
max_ice = 0

print("=== Complete Yakhchal Annual Simulation ===")
print(f"Location: Yazd, Iran")
print(f"Pool area: {pool_area} m², Dome U-value: {dome_U} W/(m²K)\\n")
print(f"{'Month':<6} {'Avg T':<7} {'Production':<13} {'Melt':<11} {'Stored (kg)':<13} {'Status'}")
print("-" * 62)

for month, (T_avg, T_max, T_min) in temps.items():
    # Ice production (only on cold nights)
    produced = 0
    if T_min < 5:
        cold_nights = 20 if T_avg < 8 else 10 if T_avg < 15 else 3
        per_night = nightly_ice_production(T_min, rh_winter, pool_area, pool_depth)
        produced = per_night * cold_nights

    # Melting (every day, proportional to temperature)
    melted = daily_melt(T_avg, ice_stored + produced, dome_U, dome_area) * 30

    ice_stored += produced - melted
    ice_stored = max(0, ice_stored)
    max_ice = max(max_ice, ice_stored)

    status = "Producing" if produced > melted else "Stable" if melted < 100 else "Melting"
    print(f"{month:<6} {T_avg:<7} {produced:<13.0f} {melted:<11.0f} {ice_stored:<13.0f} {status}")

print(f"\\nPeak ice stored: {max_ice:.0f} kg")
if ice_stored > 0:
    print(f"Ice surviving to December: {ice_stored:.0f} kg — SUCCESS")
else:
    print(f"Ice depleted during summer — need more production capacity")

# System efficiency
print(f"\\n=== System Analysis ===")
total_produced = sum(
    nightly_ice_production(T_min, rh_winter, pool_area, pool_depth) *
    (20 if T_avg < 8 else 10 if T_avg < 15 else 3)
    for T_avg, T_max, T_min in temps.values() if T_min < 5
)
total_melted = sum(
    daily_melt(T_avg, 10000, dome_U, dome_area) * 30
    for T_avg, T_max, T_min in temps.values() if T_avg > 10
)
print(f"Total annual production: {total_produced:.0f} kg")
print(f"Total summer melt: {total_melted:.0f} kg")
print(f"Net surplus: {total_produced - total_melted:.0f} kg")
print(f"Efficiency: {(1 - total_melted/total_produced)*100:.0f}%")
print(f"\\nA well-designed yakhchal is a self-sustaining cold storage")
print(f"system — zero energy input, zero carbon emissions, reliable")
print(f"ice supply through 40°C summers. 2,400 years old.")`,
      challenge: 'Modify the simulation to model a bad year — a warm winter with only 30 cold nights instead of 60. At what point does the system fail? How much larger would the pools need to be to compensate?',
      successHint: 'You built a complete systems simulation — the same approach used in engineering feasibility studies, climate modeling, and supply chain analysis. The yakhchāl succeeds because it balances production against loss across an entire year. This is systems thinking: no single component matters in isolation; what matters is whether the whole system is in surplus or deficit.',
    },
    {
      title: 'Modern passive cooling — ancient wisdom meets net-zero buildings',
      concept: `The three cooling mechanisms of the yakhchāl — **radiative**, **evaporative**, and **massive insulation** — are now central to modern **net-zero** and **passive building design**. As energy costs rise and climate targets tighten, engineers are rediscovering what Persian builders knew 2,400 years ago.

**Radiative sky cooling** is now an active research field. In 2014, Stanford researchers developed a multilayer photonic film that radiates heat at the exact infrared wavelength where Earth's atmosphere is transparent (8–13 μm). This film cools to **5°C below ambient** even in direct sunlight — achieving what Persian pools achieved only at night, but 24 hours a day.

**Evaporative cooling** is used in modern "swamp coolers" in dry climates and in cooling towers for power plants. New designs use indirect evaporative cooling — the evaporating water cools a heat exchanger without adding humidity to the building air.

**Thermal mass** is a core principle of Passivhaus design. Concrete floors, masonry walls, and phase-change materials absorb daytime heat and release it at night, stabilizing interior temperatures.

The energy savings are enormous. A conventional air-conditioned building in a hot climate uses **100–200 kWh/m²/year** for cooling. A well-designed passive building achieves the same comfort at **15–30 kWh/m²/year** — an 80–85% reduction.

📚 *The International Energy Agency estimates that cooling accounts for 10% of global electricity consumption and is the fastest-growing energy use. By 2050, the number of air conditioners worldwide will triple from 2 billion to 5.6 billion. Passive cooling is not nostalgia — it is an urgent engineering necessity.*`,
      analogy: 'Modern passive cooling is like a chef rediscovering grandmother\'s recipe. Grandmother cooked without thermometers or timers, relying on experience. The modern chef adds precision instruments — thermocouples, sous vide controllers — but the fundamental recipe is the same. Persian builders were the grandmother; modern engineers are the chefs adding precision to ancient wisdom.',
      storyConnection: 'In modern Iran, some architects are explicitly incorporating yakhchāl principles into new buildings. The Eastgate Centre in Harare, Zimbabwe, was inspired by termite mound ventilation — another ancient biological "passive cooling" system. The building uses 90% less energy for cooling than conventional buildings of the same size. The yakhchāl and the termite mound are convergent solutions to the same problem: keeping a space cool without external energy.',
      checkQuestion: 'A city has 100,000 buildings each using 150 kWh/m² per year for cooling (average 200 m² floor area). If passive cooling reduces this to 25 kWh/m², how much energy is saved? How many power plants does this replace?',
      checkAnswer: 'Current: 100,000 × 200 × 150 = 3,000 GWh/year. Passive: 100,000 × 200 × 25 = 500 GWh/year. Savings: 2,500 GWh/year. A typical gas power plant produces about 4,000 GWh/year. So passive cooling in one city saves roughly 63% of a power plant\'s output — or eliminates the need for one entirely if combined with other efficiency measures.',
      codeIntro: 'Calculate the energy savings and carbon reduction from replacing active cooling with passive techniques inspired by yakhchāl design.',
      code: `import numpy as np

def active_cooling_energy(floor_area, cooling_load_kWh_m2, COP=3.0):
    """Electricity for conventional AC (kWh/year)."""
    return floor_area * cooling_load_kWh_m2 / COP

def passive_cooling_energy(floor_area, passive_load_kWh_m2):
    """Electricity for fans and pumps in passive system (kWh/year)."""
    return floor_area * passive_load_kWh_m2 * 0.15  # fans only

def carbon_emissions(energy_kWh, grid_factor_kgCO2_per_kWh=0.5):
    """CO2 emissions from electricity use."""
    return energy_kWh * grid_factor_kgCO2_per_kWh

# Compare cooling strategies for a 500 m^2 building in a hot climate
print("=== Cooling Strategy Comparison ===")
print(f"Building: 500 m² in a hot-dry climate (like Yazd)\\n")

strategies = [
    ("Conventional AC", 150, 3.0, False),
    ("High-efficiency AC", 150, 5.0, False),
    ("Evaporative cooler", 80, None, True),
    ("Radiative + evaporative", 40, None, True),
    ("Full yakhchal-inspired passive", 25, None, True),
    ("Passivhaus standard", 15, None, True),
]

floor = 500  # m^2
print(f"{'Strategy':<30} {'Load':<8} {'Elec (kWh)':<12} {'CO2 (kg)':<10} {'Saving %'}")
print("-" * 68)

baseline = active_cooling_energy(floor, 150, 3.0)

for name, load, cop, passive in strategies:
    if passive:
        elec = passive_cooling_energy(floor, load)
    else:
        elec = active_cooling_energy(floor, load, cop)
    co2 = carbon_emissions(elec)
    saving = (1 - elec / baseline) * 100
    print(f"{name:<30} {load:<8} {elec:<12.0f} {co2:<10.0f} {saving:<.0f}")

# City-scale analysis
print(f"\\n=== City-Scale Impact: 100,000 Buildings ===\\n")

n_buildings = 100000
avg_floor = 200  # m^2

scenarios = [
    ("Status quo (all AC)", 1.0, 0.0),
    ("20% adopt passive", 0.8, 0.2),
    ("50% adopt passive", 0.5, 0.5),
    ("80% adopt passive", 0.2, 0.8),
    ("100% passive", 0.0, 1.0),
]

print(f"{'Scenario':<28} {'GWh/year':<12} {'CO2 (kt)':<10} {'Savings'}")
print("-" * 58)

for name, frac_ac, frac_passive in scenarios:
    e_ac = frac_ac * n_buildings * active_cooling_energy(avg_floor, 150) / 1e6
    e_pas = frac_passive * n_buildings * passive_cooling_energy(avg_floor, 25) / 1e6
    total_gwh = e_ac + e_pas
    co2_kt = carbon_emissions(total_gwh * 1e6) / 1e6
    saving = (1 - total_gwh / (n_buildings * active_cooling_energy(avg_floor, 150) / 1e6)) * 100
    print(f"{name:<28} {total_gwh:<12.0f} {co2_kt:<10.0f} {saving:<.0f}%")

# Yakhchal techniques mapped to modern equivalents
print(f"\\n=== Ancient to Modern Technology Map ===\\n")
mappings = [
    ("Shallow freezing pools", "Radiative sky-cooling panels",
     "Stanford photonic film cools 5°C below ambient 24/7"),
    ("Badgir wind towers", "Natural ventilation + evaporative coolers",
     "Eastgate Centre (Harare): 90% less cooling energy"),
    ("2 m sarooj walls", "Insulated concrete + phase-change materials",
     "Passivhaus walls: U < 0.15 W/m²K"),
    ("Underground storage", "Earth-coupled heat exchangers",
     "Ground-source heat pumps use 15°C earth temperature"),
    ("Qanat water supply", "Recycled greywater systems",
     "Closed-loop evaporative cooling, zero fresh water waste"),
    ("Community ice sharing", "District cooling networks",
     "Dubai: world's largest district cooling, 75% less energy"),
]

for ancient, modern, detail in mappings:
    print(f"  Ancient: {ancient}")
    print(f"  Modern:  {modern}")
    print(f"  Detail:  {detail}\\n")

# Final perspective
print(f"=== The 2,400-Year-Old Solution ===")
print(f"Persian yakhchal builders solved the same problem that modern")
print(f"engineers face: keeping things cold without burning fuel.")
print(f"Their solution — radiative cooling, evaporative cooling, and")
print(f"massive thermal insulation — is the foundation of modern")
print(f"passive building design.")
print(f"\\nThe physics hasn't changed. The Stefan-Boltzmann law, the")
print(f"wet-bulb equation, and Fourier's law of heat conduction are")
print(f"the same equations the Persians used intuitively. What has")
print(f"changed is our ability to optimize — and our urgent need to,")
print(f"as 3 billion more air conditioners come online by 2050.")`,
      challenge: 'Pick a city you know and calculate: (1) the cooling energy demand using conventional AC, (2) how much could be saved with passive techniques, and (3) the equivalent CO2 reduction. Is the climate dry enough for evaporative cooling? Humid climates need different passive strategies — what would you propose?',
      successHint: 'You connected 2,400-year-old Persian engineering to cutting-edge net-zero building design. The yakhchāl is not a historical curiosity — it is a proof of concept for passive cooling at scale. Every modern passive building owes an intellectual debt to the engineers who first demonstrated that you can store ice through a desert summer using nothing but physics, geometry, and clever materials.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Thermodynamics and passive cooling through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model radiative cooling, evaporative cooling, thermal insulation, thermal mass, complete yakhchāl systems, and modern passive building design.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
