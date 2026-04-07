import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PersianIceLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Coupled heat and mass transfer — simultaneous evaporation and conduction',
      concept: `In the real yakhchal, heat does not transfer by a single mechanism — **radiation**, **convection**, **conduction**, and **evaporation** all happen simultaneously. The challenge is modelling their **coupling**: evaporation cools the surface, which changes the conduction gradient, which changes the rate of heat flow through the wall, which changes the surface temperature, which changes the evaporation rate.

This is a **coupled system** — changing one variable changes all the others. The solution requires solving the equations simultaneously at each time step.

The energy balance at the water surface:

**q_rad + q_conv + q_cond + q_evap = rho_water * Cp_water * d * dT/dt**

Where q_rad is net radiation to the sky (cooling), q_conv is convective heat gain from warm air, q_cond is conduction from the ground below, and q_evap is latent heat removal by evaporation (cooling). The sign of each term determines whether it heats or cools the water.

For ice to form, the cooling terms (radiation + evaporation) must exceed the heating terms (convection + ground conduction).

📚 *Coupled systems are the norm in engineering, not the exception. Weather, climate, building energy, and biological systems all involve multiple interacting physical processes.*`,
      analogy: 'Imagine trying to fill a bathtub while someone else is draining it and a third person is adding hot water. The final water level and temperature depend on all three taps simultaneously — you cannot predict the result by considering each tap independently. The yakhchal water surface is the same: multiple heat flows compete, and the outcome (freezing or not) depends on their balance.',
      storyConnection: 'The Persian ice-makers understood coupling intuitively. They built shade walls to reduce convective heating, oriented troughs to maximise radiative cooling, and ensured wind flow to enhance evaporation — simultaneously optimising three of the four heat transfer modes. This holistic approach is what made ice production possible even when the air temperature was above freezing.',
      checkQuestion: 'On a clear desert night, radiative cooling provides 150 W/m^2 and evaporation provides 80 W/m^2 of cooling. Convection adds 100 W/m^2 and ground conduction adds 30 W/m^2 of heating. Will the water freeze?',
      checkAnswer: 'Net cooling = (150 + 80) - (100 + 30) = 100 W/m^2 net cooling. Yes — this is enough to freeze a thin layer of water. At 100 W/m^2, the water loses 100 J/m^2 per second. To freeze 1 cm of ice (latent heat = 334 kJ/kg, mass = 9.17 kg/m^2), you need 3,063 kJ/m^2, which takes about 8.5 hours — one desert night.',
      codeIntro: 'Build a coupled heat transfer model for the yakhchal ice-trough surface.',
      code: `import numpy as np

sigma = 5.67e-8  # Stefan-Boltzmann constant

class IceTroughModel:
    """Coupled heat/mass transfer model for yakhchal ice production."""

    def __init__(self, trough_area=200, water_depth=0.10):
        self.area = trough_area        # m^2
        self.depth = water_depth        # m
        self.water_mass = trough_area * water_depth * 1000  # kg

    def sky_temperature(self, T_air, cloud=0.0, RH=15):
        depression = 30 + (100 - RH) * 0.3
        return T_air - depression * (1 - 0.8 * cloud)

    def q_radiation(self, T_surface, T_sky, emissivity=0.96):
        """Net radiative heat loss (negative = cooling)."""
        Ts = T_surface + 273.15
        Tsk = T_sky + 273.15
        return -emissivity * sigma * (Ts**4 - Tsk**4)

    def q_convection(self, T_surface, T_air, wind_speed=1.0):
        """Convective heat transfer (positive = heating if air is warmer)."""
        h = 5.7 + 3.8 * wind_speed  # convection coefficient
        return h * (T_air - T_surface)

    def q_evaporation(self, T_surface, T_air, RH=15, wind_speed=1.0):
        """Evaporative cooling (negative = cooling)."""
        p_sat_surface = 610.78 * np.exp(17.27 * T_surface / (T_surface + 237.3))
        p_air = RH / 100 * 610.78 * np.exp(17.27 * T_air / (T_air + 237.3))
        # Mass transfer coefficient (simplified)
        h_m = (5.7 + 3.8 * wind_speed) / (1005 * 1.2) * 0.622 * 101325
        evap_rate = h_m * (p_sat_surface - p_air) / 101325  # kg/m^2/s
        evap_rate = max(evap_rate, 0)
        return -evap_rate * 2.45e6  # latent heat of vaporisation

    def q_ground(self, T_surface, T_ground=8):
        """Ground conduction (positive = heating if ground is warmer)."""
        k_ground = 1.5  # W/m K
        depth = 0.3     # depth to constant temperature
        return k_ground * (T_ground - T_surface) / depth

    def simulate_night(self, T_air, RH=15, wind=1.0, cloud=0.0, hours=12):
        """Simulate one night of ice production."""
        dt = 30  # seconds
        T_water = T_air  # start at air temperature
        T_sky = self.sky_temperature(T_air, cloud, RH)
        ice_thickness = 0  # metres
        frozen = False
        history = []

        for step in range(int(hours * 3600 / dt)):
            t_hr = step * dt / 3600
            qr = self.q_radiation(T_water, T_sky)
            qc = self.q_convection(T_water, T_air, wind)
            qe = self.q_evaporation(T_water, T_air, RH, wind)
            qg = self.q_ground(T_water)
            q_net = qr + qc + qe + qg  # W/m^2

            if T_water > 0:
                # Liquid water: temperature changes
                dT = q_net * dt / (1000 * self.depth * 4186)
                T_water += dT
                if T_water <= 0:
                    T_water = 0
                    frozen = True
            else:
                # At freezing: latent heat produces ice
                T_water = 0
                if q_net < 0:
                    ice_rate = -q_net * dt / (334000 * 917)  # m of ice
                    ice_thickness += ice_rate

            if step % (1800 // dt) == 0:  # record every 30 min
                history.append((t_hr, T_water, ice_thickness * 100, qr, qc, qe, qg))

        return history, ice_thickness * 100  # cm

# Simulate ice production under varying conditions
model = IceTroughModel()

print("=== Coupled Heat Transfer: Nightly Ice Production ===\\n")

conditions = [
    ("Clear, cold, dry",    2, 10, 0.5, 0.0),
    ("Clear, mild, dry",    5, 15, 1.0, 0.0),
    ("Clear, warm, dry",    8, 12, 1.0, 0.0),
    ("Partly cloudy",       5, 15, 1.0, 0.3),
    ("Overcast",            5, 15, 1.0, 0.8),
    ("Clear, humid",        5, 50, 1.0, 0.0),
    ("Windy, clear, dry",   5, 10, 3.0, 0.0),
]

print(f"{'Condition':<22} {'T_air':>6} {'RH%':>4} {'Wind':>5} {'Ice (cm)':>9} {'Result':<10}")
print("-" * 58)

for name, T, RH, wind, cloud in conditions:
    hist, ice_cm = model.simulate_night(T, RH, wind, cloud)
    result = f"{ice_cm:.1f} cm" if ice_cm > 0.1 else "NO ICE"
    status = "SUCCESS" if ice_cm > 0.5 else "MARGINAL" if ice_cm > 0.1 else "FAILED"
    print(f"{name:<22} {T:>4.0f}C {RH:>3.0f} {wind:>4.1f} {ice_cm:>8.2f} {status}")

# Detailed hourly breakdown for best case
print("\\n=== Hourly Breakdown: Clear, Cold, Dry Night ===")
hist, _ = model.simulate_night(2, 10, 0.5, 0.0)
print(f"{'Hour':>5} {'T_water':>8} {'Ice cm':>7} {'q_rad':>7} {'q_conv':>7} {'q_evap':>7} {'q_gnd':>7}")
print("-" * 52)
for t, Tw, ice, qr, qc, qe, qg in hist[::2]:
    print(f"{t:>4.1f}h {Tw:>7.1f}C {ice:>6.2f} {qr:>6.0f} {qc:>6.0f} {qe:>6.0f} {qg:>6.0f}")`,
      challenge: 'Add a shade wall effect: the wall blocks 50% of convective heating (halve q_conv) and 30% of ground radiation reaching the water. How much more ice is produced? This quantifies the engineering value of the yakhchal shade walls that puzzled early European visitors.',
      successHint: 'Coupled heat and mass transfer is how real building energy models work. You just simulated the physics that powered a 2,400-year-old refrigeration technology — the same coupled equations are used today in EnergyPlus, TRNSYS, and every serious building simulation tool.',
    },
    {
      title: 'Seasonal ice production optimisation',
      concept: `Ice production does not happen on a single night — it is a **seasonal process** spanning 90-120 winter nights. The total ice stored depends on the distribution of weather conditions across the season.

Key optimisation questions:
- **When to start and stop**: nights must be cold and clear enough for net cooling
- **Trough depth**: thinner layers freeze faster but produce less ice per night
- **Harvest schedule**: frozen ice must be moved to the vault before sunrise, or it melts
- **Vault capacity**: the underground dome has a maximum volume

The seasonal production model tracks cumulative ice production night by night, using actual climate statistics for Iranian plateau cities (Isfahan, Yazd, Kerman). The result is a **production curve** showing ice accumulation over the season.

📚 *Seasonal optimisation balances throughput (ice per night) against reliability (probability of successful freezing). Thin troughs freeze more reliably but produce less ice. The optimal depth depends on the local climate.*`,
      analogy: 'Farming is seasonal optimisation: you plant when the soil is warm enough, harvest before frost, and adjust planting depth based on expected rainfall. Ice farming follows the same logic: you produce when nights are cold and clear, store before sunrise, and adjust trough depth based on expected temperatures. Both are weather-dependent production systems.',
      storyConnection: 'Historical records suggest that a well-managed yakhchal could produce and store enough ice to supply a town of several thousand people through the entire summer. The ice-makers were skilled professionals who understood their local climate intimately — they knew which nights would produce ice and which would not, often outperforming modern weather forecasts.',
      checkQuestion: 'If a 200 m^2 trough produces 1.5 cm of ice on an average successful night, and the season has 70 successful nights, how much ice is stored?',
      checkAnswer: 'Volume = 200 * 0.015 * 70 = 210 m^3. At ice density 917 kg/m^3, that is 192,570 kg = about 193 tonnes. A yakhchal dome 10 m in diameter and 8 m deep holds about 628 m^3 — so 210 m^3 fills about one-third. Multiple troughs or a longer season would fill it completely.',
      codeIntro: 'Simulate an entire ice production season using real climate statistics for the Iranian plateau.',
      code: `import numpy as np

np.random.seed(42)

sigma = 5.67e-8

def simulate_night_simple(T_air, RH, cloud, wind=1.0, trough_depth_cm=8):
    """Quick ice production estimate for one night (cm of ice)."""
    T_sky = T_air - (30 + (100 - RH) * 0.3) * (1 - 0.8 * cloud)
    T_surface = 0  # freezing point

    qr = 0.96 * sigma * ((T_surface + 273.15)**4 - (T_sky + 273.15)**4)
    h_conv = 5.7 + 3.8 * wind
    qc = h_conv * (T_air - T_surface)
    p_sat = 610.78 * np.exp(17.27 * T_surface / (T_surface + 237.3))
    p_air = RH/100 * 610.78 * np.exp(17.27 * T_air / (T_air + 237.3))
    evap_flux = max(0, (p_sat - p_air) / 101325 * h_conv / 1005 * 0.622 * 101325)
    qe = evap_flux * 2.45e6

    q_net_cooling = qr + qe - qc  # positive = net cooling
    if q_net_cooling <= 0:
        return 0

    # Hours of effective freezing (10 hr night, minus cooling time)
    cooling_hours = trough_depth_cm * 10 * 4186 * T_air / q_net_cooling / 3600
    freeze_hours = max(0, 10 - max(cooling_hours, 0))
    ice_cm = q_net_cooling * freeze_hours * 3600 / (334000 * 917) * 100
    return min(ice_cm, trough_depth_cm)  # can't freeze more than trough depth

def generate_winter_climate(city="Isfahan", n_nights=120):
    """Generate realistic winter night conditions."""
    climate = {
        "Isfahan": {"T_mean": 2, "T_std": 4, "RH_mean": 25, "RH_std": 10,
                    "cloud_mean": 0.15, "clear_prob": 0.70},
        "Yazd":    {"T_mean": 4, "T_std": 3, "RH_mean": 18, "RH_std": 8,
                    "cloud_mean": 0.10, "clear_prob": 0.80},
        "Kerman":  {"T_mean": 0, "T_std": 5, "RH_mean": 22, "RH_std": 12,
                    "cloud_mean": 0.12, "clear_prob": 0.75},
    }
    c = climate[city]
    nights = []
    for i in range(n_nights):
        # Seasonal variation: coldest in mid-winter
        seasonal = -3 * np.cos(2 * np.pi * i / n_nights)
        T = np.random.normal(c["T_mean"] + seasonal, c["T_std"])
        RH = np.clip(np.random.normal(c["RH_mean"], c["RH_std"]), 5, 80)
        cloud = np.random.beta(2, 10) if np.random.random() < c["clear_prob"] else np.random.beta(5, 3)
        nights.append((T, RH, cloud))
    return nights

# Simulate full season for each city
trough_area_m2 = 200
print("=== Seasonal Ice Production Simulation ===\\n")

for city in ["Isfahan", "Yazd", "Kerman"]:
    nights = generate_winter_climate(city)
    cumulative_ice_m3 = 0
    success_nights = 0
    monthly_ice = [0, 0, 0, 0]  # Dec, Jan, Feb, Mar

    for i, (T, RH, cloud) in enumerate(nights):
        ice_cm = simulate_night_simple(T, RH, cloud)
        if ice_cm > 0.2:
            volume = trough_area_m2 * ice_cm / 100  # m^3
            cumulative_ice_m3 += volume
            success_nights += 1
            monthly_ice[i // 30] += volume

    ice_tonnes = cumulative_ice_m3 * 917 / 1000
    print(f"{city}:")
    print(f"  Successful nights: {success_nights}/{len(nights)}")
    print(f"  Total ice: {cumulative_ice_m3:.0f} m^3 ({ice_tonnes:.0f} tonnes)")
    print(f"  Monthly: Dec={monthly_ice[0]:.0f} Jan={monthly_ice[1]:.0f} "
          f"Feb={monthly_ice[2]:.0f} Mar={monthly_ice[3]:.0f} m^3")
    print()

# Optimise trough depth
print("=== Trough Depth Optimisation (Isfahan) ===")
nights = generate_winter_climate("Isfahan")
print(f"{'Depth (cm)':>11} {'Ice (m3)':>9} {'Nights':>7} {'Avg/night':>10}")
print("-" * 39)

for depth in [3, 5, 8, 10, 15, 20]:
    total = 0
    count = 0
    for T, RH, cloud in nights:
        ice_cm = simulate_night_simple(T, RH, cloud, trough_depth_cm=depth)
        if ice_cm > 0.2:
            total += trough_area_m2 * ice_cm / 100
            count += 1
    avg = total / max(count, 1)
    print(f"{depth:>9} cm {total:>8.0f} {count:>6} {avg:>8.1f} m^3")`,
      challenge: 'Add a "vault capacity" constraint (e.g., 400 m^3). Once the vault is full, production stops. Find the optimal trough depth that fills the vault in the fewest nights — maximising production rate to ensure the vault is full before winter ends. This is throughput optimisation under capacity constraints.',
      successHint: 'Seasonal production optimisation combines weather modelling, process physics, and resource constraints — the same framework used in agricultural planning, solar energy forecasting, and hydroelectric dam management. You simulated an ancient production system using modern computational methods.',
    },
    {
      title: 'Building energy simulation — the degree-day method',
      concept: `How much energy does it take to keep the yakhchal's stored ice from melting all summer? The **degree-day method** provides a simple but powerful answer.

A **cooling degree-day (CDD)** measures how much and how long the outdoor temperature exceeds a base temperature. If the base is 0 degrees C (the ice melting point) and the outdoor temperature is 35 degrees C for one day, that is 35 CDDs.

The total heat gain over a season:

**Q_total = U * A * SUM(CDD) * 86400**

Where U is the wall's thermal transmittance (W/m^2 K), A is the total surface area, and 86400 converts degree-days to degree-seconds.

The ice melt rate:

**m_melt = Q_total / L_f**

Where L_f is the latent heat of fusion (334 kJ/kg). This tells you how many tonnes of ice melt over the summer — and therefore how much you need to produce in winter.

📚 *Degree-days are used worldwide for building energy calculations. Heating degree-days (HDD) predict heating fuel consumption. Cooling degree-days (CDD) predict air conditioning electricity use. The method is simple, accurate, and requires only temperature data.*`,
      analogy: 'Degree-days are like a running tab at a restaurant. Each day the temperature exceeds 0 degrees C, you add the excess to the tab. A scorching 45 degrees C day adds 45 to the tab. A mild 10 degrees C day adds 10. At the end of summer, the total tab tells you how much "thermal attack" the ice vault endured — and therefore how much ice melted.',
      storyConnection: 'Isfahan summers accumulate roughly 4,000-5,000 CDDs above 0 degrees C. The yakhchal builders did not know degree-day arithmetic, but they knew from experience how thick to build the walls and how much ice to store. Their designs reflect an empirical understanding of seasonal heat load that matches the degree-day prediction remarkably well.',
      checkQuestion: 'A summer month averages 32 degrees C. How many degree-days above 0 degrees C accumulate?',
      checkAnswer: '32 degrees C * 30 days = 960 CDDs. If the yakhchal has U = 0.2 W/m^2 K and surface area = 300 m^2, the monthly heat gain is 0.2 * 300 * 960 * 86400 = 4,976,640,000 J = 4,977 MJ. This melts 4,977,000 / 334 = 14,900 kg = 14.9 tonnes of ice per month.',
      codeIntro: 'Calculate seasonal ice melt using degree-day analysis for a yakhchal in Isfahan.',
      code: `import numpy as np

def monthly_temperatures(city="Isfahan"):
    """Average monthly temperatures (C) for Iranian cities."""
    data = {
        "Isfahan": [3, 6, 11, 17, 22, 28, 31, 30, 25, 18, 11, 5],
        "Yazd":    [5, 8, 14, 20, 26, 32, 35, 33, 28, 21, 13, 7],
        "Kerman":  [3, 6, 12, 17, 23, 28, 30, 28, 24, 17, 10, 5],
    }
    return data[city]

def degree_days(monthly_temps, base_temp=0):
    """Calculate monthly degree-days above base temperature."""
    days_per_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    dd = []
    for T, d in zip(monthly_temps, days_per_month):
        dd.append(max(0, T - base_temp) * d)
    return dd

def ice_melt_analysis(U_value, area, dd_annual, latent_heat=334000):
    """Calculate annual ice melt from degree-day data."""
    Q_total = U_value * area * sum(dd_annual) * 86400  # Joules
    mass_melt = Q_total / latent_heat  # kg
    return Q_total, mass_melt

# Yakhchal geometry
dome_radius = 6     # m
dome_height = 8     # m
pit_depth = 5       # m
pit_radius = 5      # m

# Surface areas
dome_area = 2 * np.pi * dome_radius * dome_height  # lateral dome surface
pit_area = 2 * np.pi * pit_radius * pit_depth      # underground pit walls
floor_area = np.pi * pit_radius**2                  # floor
total_area = dome_area + pit_area + floor_area

print("=== Yakhchal Geometry ===")
print(f"Dome: radius={dome_radius}m, height={dome_height}m, area={dome_area:.0f} m^2")
print(f"Pit: radius={pit_radius}m, depth={pit_depth}m, area={pit_area:.0f} m^2")
print(f"Floor: area={floor_area:.0f} m^2")
print(f"Total surface: {total_area:.0f} m^2")

# Degree-day analysis
print("\\n=== Degree-Day Analysis ===")
months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

for city in ["Isfahan", "Yazd", "Kerman"]:
    temps = monthly_temperatures(city)
    dd = degree_days(temps, base_temp=0)
    annual_dd = sum(dd)

    print(f"\\n{city}:")
    print(f"  {'Month':<5} {'Temp C':>7} {'DD':>7}")
    for m, t, d in zip(months, temps, dd):
        bar = "#" * int(d / 30)
        print(f"  {m:<5} {t:>5.0f} {d:>7.0f} {bar}")
    print(f"  Annual total: {annual_dd:.0f} degree-days")

# Ice melt for different wall constructions
print("\\n=== Annual Ice Melt by Wall Type ===")
temps_isf = monthly_temperatures("Isfahan")
dd_isf = degree_days(temps_isf)
storage_m3 = np.pi * pit_radius**2 * pit_depth * 0.8  # 80% fill
storage_kg = storage_m3 * 917
print(f"Ice stored: {storage_m3:.0f} m^3 ({storage_kg/1000:.0f} tonnes)")
print(f"{'Wall type':<28} {'U':>5} {'Melt (t)':>9} {'Survives?':>10} {'Pct left':>9}")
print("-" * 63)

for name, U in [("2m sarooj (yakhchal)", 0.20), ("1m sarooj", 0.40),
                ("0.5m brick", 1.60), ("0.3m brick", 2.67),
                ("2m brick", 0.40), ("Modern insulated (0.15)", 0.15)]:
    Q, melt_kg = ice_melt_analysis(U, total_area, dd_isf)
    pct_left = max(0, (storage_kg - melt_kg) / storage_kg * 100)
    survives = "YES" if pct_left > 10 else "BARELY" if pct_left > 0 else "NO"
    print(f"{name:<28} {U:>4.2f} {melt_kg/1000:>8.0f} {survives:>9} {pct_left:>7.0f}%")`,
      challenge: 'Add the effect of the underground pit: the ground surrounding the pit is at a constant ~15 degrees C year-round. This means the pit walls experience a smaller temperature difference than the dome. Recalculate with separate U*A*DD for the dome (exposed to air) and pit (exposed to ground). How much does being underground help?',
      successHint: 'The degree-day method is the industry standard for quick building energy calculations. You just proved what the Persian builders knew empirically: 2 m of sarooj is the minimum wall thickness to keep ice through an Isfahan summer. Thinner walls or different materials fail. The ancient design specification was thermally optimal.',
    },
    {
      title: 'Lifecycle cost analysis — yakhchal vs modern refrigeration',
      concept: `Is a yakhchal actually cost-effective compared to modern refrigeration? **Lifecycle cost analysis (LCA)** compares the total cost of ownership over the full lifespan of each option, including:

- **Capital cost**: construction (yakhchal) or purchase (refrigerator/cold room)
- **Operating cost**: zero energy (yakhchal) vs electricity (modern)
- **Maintenance cost**: periodic sarooj repair vs compressor replacement
- **Replacement cost**: yakhchal lasts centuries; modern equipment lasts 15-20 years
- **Discount rate**: future costs are worth less than present costs (time value of money)

The **net present value (NPV)** converts all future costs to today's currency:

**NPV = SUM( Cost_t / (1 + r)^t )**

Where r is the annual discount rate. A low discount rate (2-3%) favours long-lived investments like the yakhchal. A high discount rate (10%+) favours cheap, short-lived equipment.

📚 *Lifecycle cost analysis is used to make every major infrastructure decision: build a bridge or run a ferry? Solar panels or grid power? The cheapest option over 1 year is often the most expensive over 30 years.*`,
      analogy: 'Buying a cheap pair of shoes that wears out every year costs more over a decade than buying one expensive pair that lasts 10 years. Lifecycle cost analysis does this calculation rigorously — accounting for inflation, the time value of money, and all hidden costs like maintenance and disposal.',
      storyConnection: 'A yakhchal costs the equivalent of tens of thousands of dollars to build (materials, labour, qanat connection). But it requires zero energy, minimal maintenance, and lasts for centuries. Modern cold storage costs less to build but consumes electricity continuously. The lifecycle comparison reveals the yakhchal as remarkably cost-effective — especially in regions with expensive or unreliable electricity.',
      checkQuestion: 'Option A costs 100,000 now and lasts 100 years with zero operating cost. Option B costs 10,000 now and 2,000/year in electricity, lasting 20 years. Which is cheaper over 100 years at a 3% discount rate?',
      checkAnswer: 'Option A: NPV = 100,000. Option B over 100 years requires 5 replacements (every 20 years) plus annual electricity. NPV of electricity alone at 3% = 2,000 * (1 - 1.03^-100) / 0.03 = about 63,000. Plus 5 purchases of 10,000 discounted = about 35,000. Total B NPV = about 98,000. They are nearly equal — but A has zero carbon emissions.',
      codeIntro: 'Compare the lifecycle costs of a yakhchal vs modern cold storage over different time horizons.',
      code: `import numpy as np

def npv_stream(annual_costs, discount_rate):
    """Net present value of a stream of annual costs."""
    return sum(c / (1 + discount_rate)**t for t, c in enumerate(annual_costs))

def yakkchal_lifecycle(years, discount_rate=0.03):
    """Lifecycle cost of a yakhchal."""
    capital = 50000          # construction cost (equivalent $)
    annual_maint = 500       # mortar repair, channel cleaning
    major_repair_interval = 50
    major_repair_cost = 8000

    costs = [capital]  # year 0
    for y in range(1, years + 1):
        annual = annual_maint
        if y % major_repair_interval == 0:
            annual += major_repair_cost
        costs.append(annual)

    return npv_stream(costs, discount_rate)

def modern_cold_room(years, discount_rate=0.03):
    """Lifecycle cost of modern refrigerated cold room (same capacity)."""
    capital = 15000           # purchase + installation
    annual_electricity = 3600 # 30,000 kWh * $0.12/kWh
    annual_maint = 800        # filters, compressor service
    replacement_interval = 18 # years before replacement
    replacement_cost = 15000

    costs = [capital]  # year 0
    for y in range(1, years + 1):
        annual = annual_electricity + annual_maint
        if y % replacement_interval == 0:
            annual += replacement_cost
        costs.append(annual)

    return npv_stream(costs, discount_rate)

# Compare over different horizons
print("=== Lifecycle Cost Analysis: Yakhchal vs Modern Cold Room ===\\n")
print(f"{'Horizon':>10} {'Yakhchal':>12} {'Modern':>12} {'Savings':>10} {'Winner':<10}")
print("-" * 56)

for years in [10, 20, 30, 50, 100, 200, 500]:
    y_cost = yakkchal_lifecycle(years)
    m_cost = modern_cold_room(years)
    savings = m_cost - y_cost
    winner = "YAKHCHAL" if savings > 0 else "MODERN"
    print(f"{years:>7} yr {y_cost:>10,.0f} {m_cost:>10,.0f} {savings:>+9,.0f} {winner}")

# Sensitivity to discount rate
print("\\n=== Sensitivity to Discount Rate (100-year horizon) ===")
print(f"{'Rate':>6} {'Yakhchal':>12} {'Modern':>12} {'Winner':<10}")
print("-" * 42)

for rate in [0.01, 0.02, 0.03, 0.05, 0.07, 0.10]:
    y = yakkchal_lifecycle(100, rate)
    m = modern_cold_room(100, rate)
    winner = "YAKHCHAL" if m > y else "MODERN"
    print(f"{rate*100:>4.0f}% {y:>10,.0f} {m:>10,.0f} {winner}")

# Carbon analysis
print("\\n=== Carbon Footprint Comparison (100 years) ===")
# Yakhchal: embodied carbon in construction only
y_carbon = 50  # tonnes CO2 (lime production, transport)
# Modern: electricity carbon + embodied in equipment
m_annual_kwh = 30000
carbon_intensity = 0.5  # kg CO2/kWh (Iran grid)
m_carbon = 100 * m_annual_kwh * carbon_intensity / 1000 + 5 * 2  # equipment replacements

print(f"Yakhchal (100 yr):  {y_carbon:>6.0f} tonnes CO2")
print(f"Modern (100 yr):    {m_carbon:>6.0f} tonnes CO2")
print(f"Carbon savings:     {m_carbon - y_carbon:>6.0f} tonnes CO2")
print(f"That's {(m_carbon - y_carbon) / m_carbon * 100:.0f}% reduction")`,
      challenge: 'Add increasing electricity costs (2% per year real increase) and a carbon tax ($50/tonne CO2, rising 3% per year). How do these future costs change the breakeven point? This analysis is exactly what policymakers use to evaluate renewable energy and passive building investments.',
      successHint: 'Lifecycle cost analysis is how every major infrastructure and energy decision is made. You proved that the yakhchal — despite its high upfront cost — becomes cheaper than modern refrigeration within 30-50 years and saves over 95% of carbon emissions. This is the economic argument for passive building design and why ancient technologies are being reconsidered for climate adaptation.',
    },
    {
      title: 'Climate adaptation — passive cooling in a warming world',
      concept: `As global temperatures rise, the demand for cooling is exploding. By 2050, air conditioning is projected to consume **more electricity than heating worldwide**. Most of this cooling uses vapour-compression systems powered by fossil fuels — which emit CO2, which causes more warming, which demands more cooling. This is a **positive feedback loop**.

Passive cooling — the yakhchal principle — breaks this loop. It uses **radiative cooling**, **evaporative cooling**, **thermal mass**, and **natural ventilation** to cool buildings with zero or minimal energy.

Modern radiative cooling materials can achieve surface temperatures 5-10 degrees C below ambient even in direct sunlight — by reflecting solar radiation and emitting strongly in the 8-13 micrometer "atmospheric window" where the atmosphere is transparent to infrared.

The question for climate adaptation: **at what global warming level does the yakhchal principle stop working?** If nights get too warm or humidity increases, radiative ice production fails. Understanding these limits is critical for planning passive cooling in a changing climate.

📚 *The atmospheric window (8-13 micrometers) allows infrared radiation to pass directly from the surface to space without being absorbed by greenhouse gases. Passive radiative cooling exploits this window — it works best under clear, dry skies.*`,
      analogy: 'Air conditioning is like using a petrol-powered pump to bail water from a sinking boat — it works, but the exhaust makes the hole bigger. Passive cooling is like plugging the hole: it addresses the root cause (heat gain) rather than fighting the symptom (high temperature). In a warming world, we need to plug more holes and bail less.',
      storyConnection: 'The yakhchal worked in a specific climate window: cold enough winter nights for ice production, dry enough for radiative and evaporative cooling. Climate change is shifting this window. Some traditional yakhchal sites are already too warm to produce ice reliably. Understanding where the yakhchal principle still works — and how to adapt it — is an active area of research in sustainable building design.',
      checkQuestion: 'If climate change raises winter night temperatures by 3 degrees C and increases humidity by 10%, what happens to ice production?',
      checkAnswer: 'Both changes reduce production: warmer nights mean more convective heating and a warmer sky temperature, while higher humidity reduces evaporative cooling and raises the dew point. A 3 degrees C warming might reduce ice production by 30-50%, and a 10% humidity increase could reduce it by another 15-25%. Combined, some sites would stop producing ice entirely.',
      codeIntro: 'Model the impact of climate change on yakhchal ice production and passive cooling effectiveness.',
      code: `import numpy as np

np.random.seed(42)

sigma = 5.67e-8

def ice_production_rate(T_air, RH, cloud=0.0, wind=1.0):
    """Estimate ice production rate (cm/night) under given conditions."""
    T_sky = T_air - (30 + (100 - RH) * 0.3) * (1 - 0.8 * cloud)
    qr = 0.96 * sigma * (273.15**4 - (T_sky + 273.15)**4)
    h_c = 5.7 + 3.8 * wind
    qc = h_c * T_air  # heating from air above 0C
    p_sat = 610.78
    p_air = RH/100 * 610.78 * np.exp(17.27 * T_air / (T_air + 237.3))
    evap = max(0, (p_sat - p_air) / 101325 * h_c / 1005 * 0.622 * 101325)
    qe = evap * 2.45e6
    q_net = qr + qe - qc
    if q_net <= 0:
        return 0
    hours = 10
    return q_net * hours * 3600 / (334000 * 917) * 100

def seasonal_production(T_offset=0, RH_offset=0, n_nights=100):
    """Simulate season with climate offsets."""
    total_ice_m3 = 0
    success = 0
    for i in range(n_nights):
        seasonal = -3 * np.cos(2 * np.pi * i / n_nights)
        T = np.random.normal(2 + seasonal + T_offset, 4)
        RH = np.clip(np.random.normal(25 + RH_offset, 10), 5, 80)
        cloud = np.random.beta(2, 10) if np.random.random() < 0.7 else np.random.beta(5, 3)
        ice_cm = ice_production_rate(T, RH, cloud)
        if ice_cm > 0.2:
            total_ice_m3 += 200 * ice_cm / 100
            success += 1
    return total_ice_m3, success

# Climate change scenarios
print("=== Impact of Climate Change on Ice Production ===")
print("(Isfahan baseline: mean winter night 2 C, RH 25%)\\n")

scenarios = [
    ("Pre-industrial (-1C)",      -1,  -5),
    ("Baseline (today)",           0,   0),
    ("2030s (+1.5C, +5% RH)",     1.5, 5),
    ("2050s (+2.5C, +8% RH)",     2.5, 8),
    ("2070s (+3.5C, +12% RH)",    3.5, 12),
    ("2100 worst (+5C, +15% RH)", 5.0, 15),
]

print(f"{'Scenario':<32} {'Ice (m3)':>9} {'Nights':>7} {'vs Base':>8}")
print("-" * 58)
baseline_ice = None

for name, dT, dRH in scenarios:
    ice, nights = seasonal_production(dT, dRH)
    if baseline_ice is None:
        baseline_ice = ice
    pct = (ice / baseline_ice - 1) * 100 if baseline_ice > 0 else 0
    status = "OK" if ice > 150 else "RISK" if ice > 50 else "FAIL"
    print(f"{name:<32} {ice:>7.0f} {nights:>6} {pct:>+6.0f}% {status}")

# Passive cooling effectiveness
print("\\n=== Passive Cooling Effectiveness vs Climate Change ===")
print("Wind-catcher evaporative cooling (peak summer conditions)")
print(f"{'Scenario':<28} {'T_out':>6} {'RH':>5} {'T_cooled':>9} {'Cooling':>8} {'Comfort?':>9}")
print("-" * 67)

for name, dT, dRH in [("Today", 0, 0), ("2030s", 1.5, 5),
                        ("2050s", 2.5, 8), ("2100 worst", 5.0, 15)]:
    T = 42 + dT
    RH = 8 + dRH
    # Stull's approximation for wet-bulb
    Tw = (T * np.arctan(0.151977 * np.sqrt(RH + 8.313659))
          + np.arctan(T + RH) - np.arctan(RH - 1.676331)
          + 0.00391838 * RH**1.5 * np.arctan(0.023101 * RH) - 4.686035)
    T_cooled = T - 0.85 * (T - Tw)
    cooling = T - T_cooled
    comfort = "YES" if T_cooled < 28 else "MARGINAL" if T_cooled < 32 else "NO"
    print(f"{name:<28} {T:>4.0f}C {RH:>3.0f}% {T_cooled:>7.1f}C {cooling:>6.1f}C {comfort:>8}")

# Modern radiative cooling materials
print("\\n=== Modern Radiative Cooling Technology ===")
print("Spectrally selective surfaces: high solar reflectance + high IR emittance")
for name, solar_refl, ir_emiss in [("Traditional whitewash", 0.80, 0.90),
                                     ("Modern white paint", 0.87, 0.90),
                                     ("Radiative cooling film", 0.97, 0.95),
                                     ("Metamaterial surface", 0.97, 0.97)]:
    solar_gain = (1 - solar_refl) * 1000  # W/m^2 (peak solar)
    ir_loss = ir_emiss * sigma * (300**4 - 250**4)  # net IR to sky
    net = ir_loss - solar_gain
    print(f"  {name:<28} Net: {net:>+6.0f} W/m^2 ({'COOLING' if net > 0 else 'heating'})")`,
      challenge: 'Design a "climate-adapted yakhchal" for 2050 conditions: add a radiative cooling film (emissivity 0.97, solar reflectance 0.97) to the trough covers used during daytime. How much does this extend the climate viability window? Could passive ice production work at +3 degrees C warming with modern materials? This is active research at MIT and Stanford.',
      successHint: 'You modelled the intersection of ancient technology and climate change — one of the most important areas in sustainable building design. Passive cooling is not nostalgia; it is a critical climate adaptation strategy. The yakhchal principle, updated with modern materials and engineering analysis, could reduce cooling energy demand by 30-50% in hot, dry climates.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling and sustainability analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers coupled heat transfer, seasonal optimisation, building energy simulation, lifecycle cost analysis, and climate adaptation.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
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
