import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PersianIceLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Passive Cooling Simulator',
      concept: `In this capstone project, you will build a complete **Passive Cooling Simulator** — a Python program that models the yakhchal system from first principles:

1. **Surface** — a radiating/evaporating surface (water trough or roof) that exchanges heat with the sky
2. **Wall** — a thick sarooj wall that resists heat conduction from outside to inside
3. **WindCatcher** — a tower that drives airflow through evaporative cooling channels
4. **IcePit** — an underground vault that stores ice and tracks melt over time

These four classes interact: the Surface produces ice, the Wall protects the IcePit, the WindCatcher cools occupied spaces, and the IcePit stores the season's production.

The first step is **system design** — defining the classes, their properties, and how they communicate. A good architecture makes the simulation modular: you can swap in different wall materials, change the climate, or add new features without rewriting everything.

📚 *Object-oriented design decomposes a complex system into interacting components. Each component has clear responsibilities and a well-defined interface. This is how all serious simulation software is built.*`,
      analogy: 'A car has an engine, transmission, wheels, and body — each is designed separately but they work together through defined interfaces (the engine connects to the transmission via a specific shaft). The yakhchal has the same modularity: surface, wall, wind-catcher, and pit are separate subsystems connected by heat and mass flows.',
      storyConnection: 'The yakhchal is not a single invention — it is a **system** of integrated technologies: radiative troughs, thick sarooj walls, underground vaults, wind-catchers, and qanat water supply. Each component was optimised over centuries, but the real genius was their integration. Your simulator models this integrated system.',
      checkQuestion: 'Why is it better to build separate classes for Surface, Wall, WindCatcher, and IcePit rather than one monolithic simulation?',
      checkAnswer: 'Modularity: you can test each component independently, swap materials or designs without affecting other components, and reason about each subsystem separately. A monolithic simulation with all physics in one loop would be impossible to debug, test, or extend. Modularity is the key to managing complexity.',
      codeIntro: 'Design the architecture of the Passive Cooling Simulator — define all four classes and their interfaces.',
      code: `import numpy as np

sigma = 5.67e-8  # Stefan-Boltzmann constant

class Surface:
    """Radiating/evaporating surface (water trough or roof)."""
    def __init__(self, area=200, emissivity=0.96, albedo=0.06):
        self.area = area              # m^2
        self.emissivity = emissivity  # infrared emissivity
        self.albedo = albedo          # solar reflectance

    def radiative_flux(self, T_surface_C, T_sky_C):
        Ts = T_surface_C + 273.15
        Tsk = T_sky_C + 273.15
        return self.emissivity * sigma * (Ts**4 - Tsk**4)

    def evaporative_flux(self, T_surface_C, T_air_C, RH, wind=1.0):
        h = 5.7 + 3.8 * wind
        p_sat_s = 610.78 * np.exp(17.27 * T_surface_C / (T_surface_C + 237.3))
        p_air = RH/100 * 610.78 * np.exp(17.27 * T_air_C / (T_air_C + 237.3))
        evap = max(0, (p_sat_s - p_air) / 101325 * h / 1005 * 0.622 * 101325)
        return evap * 2.45e6  # W/m^2


class Wall:
    """Thick insulating wall (sarooj, brick, or modern materials)."""
    def __init__(self, thickness=2.0, k=0.4, rho=1600, Cp=900):
        self.thickness = thickness  # m
        self.k = k                  # W/(m K)
        self.rho = rho              # kg/m^3
        self.Cp = Cp                # J/(kg K)

    def u_value(self):
        return self.k / self.thickness

    def time_constant_hours(self):
        return self.rho * self.Cp * self.thickness**2 / self.k / 3600

    def steady_flux(self, T_outside, T_inside):
        return self.u_value() * (T_outside - T_inside)


class WindCatcher:
    """Evaporative cooling tower."""
    def __init__(self, height=8, cross_section=4, efficiency=0.85):
        self.height = height            # m
        self.cross_section = cross_section  # m^2
        self.efficiency = efficiency    # fraction of wet-bulb depression achieved

    def stack_velocity(self, T_inside, T_outside):
        dT = max(T_outside - T_inside, 0.5)
        return 0.5 * np.sqrt(2 * 9.81 * self.height * dT / (T_outside + 273.15))

    def cooled_temperature(self, T_air, RH):
        Tw = (T_air * np.arctan(0.151977 * np.sqrt(RH + 8.313659))
              + np.arctan(T_air + RH) - np.arctan(RH - 1.676331)
              + 0.00391838 * RH**1.5 * np.arctan(0.023101 * RH) - 4.686035)
        return T_air - self.efficiency * (T_air - Tw)


class IcePit:
    """Underground ice storage vault."""
    def __init__(self, radius=5, depth=5, fill_fraction=0.0):
        self.radius = radius          # m
        self.depth = depth            # m
        self.max_volume = np.pi * radius**2 * depth  # m^3
        self.ice_volume = fill_fraction * self.max_volume  # m^3
        self.ice_mass = self.ice_volume * 917  # kg

    def add_ice(self, volume_m3):
        self.ice_volume = min(self.ice_volume + volume_m3, self.max_volume)
        self.ice_mass = self.ice_volume * 917

    def melt(self, heat_watts, duration_seconds):
        energy = heat_watts * duration_seconds
        mass_melted = energy / 334000  # kg
        self.ice_mass = max(0, self.ice_mass - mass_melted)
        self.ice_volume = self.ice_mass / 917

    def fill_percentage(self):
        return self.ice_volume / self.max_volume * 100

# Test the architecture
print("=== Passive Cooling Simulator: Architecture Test ===\\n")

surface = Surface(area=200)
wall = Wall(thickness=2.0, k=0.4)
catcher = WindCatcher(height=8)
pit = IcePit(radius=5, depth=5)

print(f"Surface: {surface.area} m^2, emissivity={surface.emissivity}")
print(f"Wall: {wall.thickness}m sarooj, U={wall.u_value():.2f} W/m^2K, "
      f"tau={wall.time_constant_hours():.0f} hr")
print(f"WindCatcher: {catcher.height}m tall, {catcher.cross_section} m^2")
print(f"IcePit: {pit.radius}m radius, {pit.depth}m deep, "
      f"capacity={pit.max_volume:.0f} m^3")

# Quick integration test
T_sky = -45
print(f"\\nRadiative flux (0C surface, {T_sky}C sky): "
      f"{surface.radiative_flux(0, T_sky):.1f} W/m^2")
print(f"Wall flux (45C outside, 2C inside): "
      f"{wall.steady_flux(45, 2):.1f} W/m^2")
print(f"Wind-catcher output (42C, 10% RH): "
      f"{catcher.cooled_temperature(42, 10):.1f} C")
print(f"\\nArchitecture verified. Ready for simulation engine.")`,
      challenge: 'Add a Qanat class with flow_rate(slope, roughness) using Manning\'s equation. Connect it to the Surface: the qanat supplies water to refill troughs each night. If the qanat silts up (roughness increases), ice production drops. This adds a fifth subsystem to the simulator.',
      successHint: 'Good system design makes everything else easier. You defined four interacting classes with clear responsibilities and interfaces — the same architecture used in professional building simulation tools. The key insight: each component can be tested independently, then integrated into the full system.',
    },
    {
      title: 'Heat transfer engine — radiation, evaporation, and conduction combined',
      concept: `The heat transfer engine is the core of the simulator. It calculates the **energy balance** at every surface and through every wall at each time step, using the classes you designed.

For the ice trough surface, the energy balance at each time step is:

**dE/dt = -q_rad * A + q_conv * A - q_evap * A + q_ground * A**

The engine must handle **phase change**: when water reaches 0 degrees C, it does not cool further until all the water has frozen (latent heat). Similarly, when ice reaches 0 degrees C, it does not warm until all ice has melted.

The engine uses **explicit time-stepping**: at each time step, calculate all heat flows based on current temperatures, then update temperatures for the next step. The time step must be small enough for stability (Courant condition).

📚 *Explicit time-stepping is the simplest numerical method: calculate forces now, update positions for the next step. It is used in weather models, structural dynamics, and game physics. The trade-off: it is simple but requires small time steps for stability.*`,
      analogy: 'A bank balance works the same way: at the end of each day, add income and subtract expenses to get the new balance. The heat transfer engine does this for thermal energy: at each time step, add heat gains and subtract heat losses to get the new temperature. Phase change is like a minimum balance — the temperature cannot drop below 0 degrees C until the "freezing account" is fully spent.',
      storyConnection: 'The yakhchal surface experiences all four heat transfer modes simultaneously every night: radiation to the sky (cooling), convection from the air (heating), evaporation (cooling), and ground conduction (heating). The net balance determines whether ice forms. Your engine calculates this balance at every time step — the computational equivalent of what the water surface "experiences" physically.',
      checkQuestion: 'If the time step is too large, the simulation becomes unstable (temperatures oscillate wildly). What determines the maximum stable time step?',
      checkAnswer: 'The Courant-Friedrichs-Lewy (CFL) condition: dt < dx^2 / (2 * alpha), where alpha is the thermal diffusivity. For sarooj (alpha ~ 2.8e-7 m^2/s) with dx = 0.05 m, dt < 0.05^2 / (2 * 2.8e-7) = 4,464 seconds. Using dt = 30 seconds gives a large safety margin.',
      codeIntro: 'Build the heat transfer engine that combines all four heat transfer modes into a single time-stepping simulation.',
      code: `import numpy as np

sigma = 5.67e-8

class HeatTransferEngine:
    """Combined radiation + evaporation + conduction engine."""

    def __init__(self, surface_area=200, wall_thickness=2.0, wall_k=0.4,
                 wall_rho=1600, wall_Cp=900):
        self.area = surface_area
        self.wall_L = wall_thickness
        self.wall_k = wall_k
        self.wall_rho = wall_rho
        self.wall_Cp = wall_Cp
        self.wall_U = wall_k / wall_thickness

    def sky_temp(self, T_air, cloud=0.0, RH=15):
        depression = 30 + (100 - RH) * 0.3
        return T_air - depression * (1 - 0.8 * cloud)

    def compute_fluxes(self, T_water, T_air, T_sky, RH, wind=1.0, T_ground=8):
        """Compute all heat fluxes at the water/ice surface (W/m^2).
           Negative = cooling, Positive = heating."""
        # Radiation to sky (cooling)
        Ts = T_water + 273.15
        Tsk = T_sky + 273.15
        q_rad = -0.96 * sigma * (Ts**4 - Tsk**4)

        # Convection from air
        h_c = 5.7 + 3.8 * wind
        q_conv = h_c * (T_air - T_water)

        # Evaporation (cooling) — only when liquid water present
        p_sat = 610.78 * np.exp(17.27 * max(T_water, 0) / (max(T_water, 0) + 237.3))
        p_air = RH/100 * 610.78 * np.exp(17.27 * T_air / (T_air + 237.3))
        evap_rate = max(0, (p_sat - p_air) / 101325 * h_c / 1005 * 0.622 * 101325)
        q_evap = -evap_rate * 2.45e6

        # Ground conduction
        q_ground = 1.5 * (T_ground - T_water) / 0.3

        return q_rad, q_conv, q_evap, q_ground

    def simulate_night(self, T_air, RH=15, wind=1.0, cloud=0.0,
                       water_depth=0.10, hours=11):
        """Simulate one night: returns (ice_thickness_cm, history)."""
        dt = 30  # seconds
        T_water = max(T_air, 0.5)  # start at air temp or just above freezing
        T_sky = self.sky_temp(T_air, cloud, RH)
        ice_thickness = 0.0  # metres
        history = []

        for step in range(int(hours * 3600 / dt)):
            t_hr = step * dt / 3600
            q_rad, q_conv, q_evap, q_ground = self.compute_fluxes(
                T_water, T_air, T_sky, RH, wind)
            q_net = q_rad + q_conv + q_evap + q_ground  # W/m^2

            if T_water > 0.001:
                # Cooling liquid water
                dT = q_net * dt / (1000 * water_depth * 4186)
                T_water += dT
                T_water = max(T_water, 0.0)
            elif q_net < 0:
                # Freezing: remove latent heat
                T_water = 0.0
                d_ice = -q_net * dt / (334000 * 917)
                ice_thickness += d_ice
                ice_thickness = min(ice_thickness, water_depth)

            if step % (1800 // dt) == 0:
                history.append({
                    "t_hr": t_hr, "T_water": T_water,
                    "ice_cm": ice_thickness * 100,
                    "q_rad": q_rad, "q_conv": q_conv,
                    "q_evap": q_evap, "q_ground": q_ground,
                    "q_net": q_net,
                })

        return ice_thickness * 100, history

# Run the engine
engine = HeatTransferEngine()

print("=== Heat Transfer Engine: Nightly Simulation ===\\n")

# Test across conditions
tests = [
    ("Ideal: cold, dry, clear",  0, 10, 0.5, 0.0),
    ("Good: cool, dry, clear",   3, 15, 1.0, 0.0),
    ("Marginal: mild, dry",      6, 18, 1.0, 0.0),
    ("Humid: cool but wet",      3, 55, 1.0, 0.0),
    ("Cloudy: cool but overcast", 3, 15, 1.0, 0.7),
    ("Windy: cool, dry, breezy", 3, 12, 4.0, 0.0),
]

print(f"{'Condition':<28} {'Ice cm':>7} {'Result':<10}")
print("-" * 47)
for name, T, RH, w, c in tests:
    ice_cm, _ = engine.simulate_night(T, RH, w, c)
    result = "SUCCESS" if ice_cm > 1.0 else "MARGINAL" if ice_cm > 0.2 else "FAILED"
    print(f"{name:<28} {ice_cm:>6.2f} {result}")

# Detailed breakdown for the ideal case
print("\\n=== Detailed Hourly Breakdown: Ideal Night ===")
ice, hist = engine.simulate_night(0, 10, 0.5, 0.0)
print(f"{'Hour':>5} {'T_w':>6} {'Ice':>6} {'q_rad':>7} {'q_conv':>7} "
      f"{'q_evap':>7} {'q_gnd':>7} {'q_net':>7}")
print("-" * 57)
for h in hist:
    print(f"{h['t_hr']:>4.1f}h {h['T_water']:>5.1f}C {h['ice_cm']:>5.2f} "
          f"{h['q_rad']:>6.0f} {h['q_conv']:>6.0f} {h['q_evap']:>6.0f} "
          f"{h['q_ground']:>6.0f} {h['q_net']:>6.0f}")

print(f"\\nTotal ice produced: {ice:.2f} cm")`,
      challenge: 'The engine currently uses constant T_air through the night. In reality, air temperature drops during the night and rises before dawn. Modify T_air to follow a sinusoidal curve: coldest at 4 AM, warmest at sunset. How does this affect total ice production compared to using the mean night temperature?',
      successHint: 'You built a multi-physics simulation engine combining four heat transfer modes into a single time-stepping loop. This is exactly how professional tools like EnergyPlus work internally — just with more sophisticated models for each mode. The engine correctly handles phase change (latent heat at 0 degrees C), which is the trickiest part of thermal simulation.',
    },
    {
      title: 'Ice production simulator — nightly freezing cycle across a full season',
      concept: `With the heat transfer engine built, you can now simulate an **entire ice-production season**: 100+ nights of variable weather, each producing a different amount of ice. The seasonal simulator:

1. Generates **random weather** for each night (temperature, humidity, cloud cover) based on climate statistics
2. Runs the **heat transfer engine** for each night
3. **Harvests ice**: transfers frozen ice from troughs to the underground pit each morning
4. Tracks **cumulative storage** in the pit
5. Accounts for **melt losses**: even during winter, some ice melts during warm days

The result is a **production curve** — cumulative ice stored versus time — and statistics on the season's output: total ice, success rate, and vault fill percentage.

📚 *Seasonal simulation combines physics (heat transfer), statistics (random weather), and logistics (harvest scheduling). Real agricultural and energy production models use the same framework.*`,
      analogy: 'A farmer does not plant one seed and watch it — they plant an entire field and track the total harvest across the growing season, accounting for rain, frost, and pest damage. The ice production simulator is the same: it tracks total production across the freezing season, accounting for weather variability and melt losses.',
      storyConnection: 'Historical accounts describe yakhchal operators as skilled professionals who decided each evening whether conditions were favourable for ice production. Some nights they would not fill the troughs at all — saving water and labour when clouds or humidity made freezing unlikely. Your simulator makes the same decision based on weather forecasts.',
      checkQuestion: 'If 10% of harvested ice melts during daytime transport from the troughs to the pit, how does this affect seasonal production?',
      checkAnswer: 'A 10% transport loss means you need to produce 11.1% more ice to achieve the same storage. Over a season producing 300 m^3, that is 30 m^3 of wasted ice — equivalent to about 20 successful production nights. This is why the troughs were built adjacent to the pit, minimising transport distance and exposure to sun.',
      codeIntro: 'Run a full-season ice production simulation with weather generation, nightly freezing, and cumulative storage tracking.',
      code: `import numpy as np

np.random.seed(42)

sigma = 5.67e-8

def quick_night_ice(T_air, RH, cloud, wind=1.0, depth_cm=8):
    """Fast ice production estimate (cm) for seasonal simulation."""
    T_sky = T_air - (30 + (100 - RH) * 0.3) * (1 - 0.8 * cloud)
    qr = 0.96 * sigma * (273.15**4 - (T_sky + 273.15)**4)
    h_c = 5.7 + 3.8 * wind
    qc = h_c * max(T_air, 0)
    p_sat = 610.78
    p_air = RH/100 * 610.78 * np.exp(17.27 * T_air / (T_air + 237.3))
    evap = max(0, (p_sat - p_air) / 101325 * h_c / 1005 * 0.622 * 101325)
    qe = evap * 2.45e6
    q_cool = qr + qe - qc
    if q_cool <= 0:
        return 0.0
    cool_time = max(0, depth_cm / 100 * 4186 * 1000 * max(T_air, 0.1) / q_cool)
    freeze_time = max(0, 10 * 3600 - cool_time)
    return min(q_cool * freeze_time / (334000 * 917) * 100, depth_cm)

class SeasonSimulator:
    """Full-season ice production and storage simulator."""

    def __init__(self, trough_area=200, pit_radius=5, pit_depth=5,
                 wall_U=0.20, dome_area=300, transport_loss=0.08):
        self.trough_area = trough_area
        self.pit_capacity = np.pi * pit_radius**2 * pit_depth  # m^3
        self.wall_U = wall_U
        self.dome_area = dome_area
        self.transport_loss = transport_loss
        self.ice_stored = 0  # m^3

    def generate_weather(self, n_nights=110, T_mean=2, T_std=4, RH_mean=22):
        """Generate winter weather sequence."""
        nights = []
        for i in range(n_nights):
            seasonal = -3 * np.cos(2 * np.pi * i / n_nights)
            T = np.random.normal(T_mean + seasonal, T_std)
            RH = np.clip(np.random.normal(RH_mean, 10), 5, 75)
            cloud = np.random.beta(2, 10) if np.random.random() < 0.72 else np.random.beta(5, 3)
            wind = np.clip(np.random.normal(1.2, 0.8), 0.1, 5)
            # Daytime temperature for melt calculation
            T_day = T + np.random.uniform(10, 20)
            nights.append({"T": T, "RH": RH, "cloud": cloud, "wind": wind, "T_day": T_day})
        return nights

    def simulate_season(self, weather):
        """Run full season. Returns daily records."""
        self.ice_stored = 0
        records = []
        total_produced = 0
        success_count = 0

        for day, w in enumerate(weather):
            # Nightly production
            ice_cm = quick_night_ice(w["T"], w["RH"], w["cloud"], w["wind"])
            produced_m3 = self.trough_area * ice_cm / 100

            # Harvest with transport loss
            harvested = produced_m3 * (1 - self.transport_loss)
            if harvested > 0.5:
                space = self.pit_capacity - self.ice_stored
                added = min(harvested, space)
                self.ice_stored += added
                total_produced += added
                success_count += 1

            # Daytime melt loss (heat through dome walls)
            if self.ice_stored > 0:
                T_day = max(w["T_day"], 0)
                heat_gain = self.wall_U * self.dome_area * T_day  # W
                melt_energy = heat_gain * 10 * 3600  # 10 hours of daylight
                melt_kg = melt_energy / 334000
                melt_m3 = melt_kg / 917
                self.ice_stored = max(0, self.ice_stored - melt_m3)

            records.append({
                "day": day + 1,
                "T_night": w["T"], "cloud": w["cloud"],
                "produced_cm": ice_cm,
                "stored_m3": self.ice_stored,
                "fill_pct": self.ice_stored / self.pit_capacity * 100,
            })

        return records, total_produced, success_count

# Run simulation
sim = SeasonSimulator()
weather = sim.generate_weather()
records, total_prod, successes = sim.simulate_season(weather)

print("=== Full-Season Ice Production Simulation ===")
print(f"Trough area: {sim.trough_area} m^2 | Pit capacity: {sim.pit_capacity:.0f} m^3")
print(f"Season: {len(weather)} nights\\n")

# Weekly summary
print(f"{'Week':>5} {'Prod nights':>12} {'Ice stored':>11} {'Fill %':>7}")
print("-" * 37)
for week in range(0, len(records), 7):
    chunk = records[week:week+7]
    prod_nights = sum(1 for r in chunk if r["produced_cm"] > 0.5)
    last = chunk[-1]
    print(f"{week//7 + 1:>4} {prod_nights:>10} {last['stored_m3']:>9.0f} m^3 "
          f"{last['fill_pct']:>5.0f}%")

final = records[-1]
print(f"\\n=== Season Summary ===")
print(f"Successful production nights: {successes}/{len(weather)}")
print(f"Total ice produced: {total_prod:.0f} m^3 ({total_prod * 917 / 1000:.0f} tonnes)")
print(f"Final storage: {final['stored_m3']:.0f} m^3 ({final['fill_pct']:.0f}% full)")
print(f"Melt losses during production season: "
      f"{total_prod - final['stored_m3']:.0f} m^3 ({(total_prod - final['stored_m3'])/total_prod*100:.0f}%)")

# Compare trough sizes
print("\\n=== Trough Area Optimisation ===")
print(f"{'Area (m2)':>10} {'Produced':>9} {'Stored':>8} {'Fill%':>6} {'Nights':>7}")
print("-" * 42)
for area in [50, 100, 200, 300, 500]:
    sim_test = SeasonSimulator(trough_area=area)
    recs, prod, succ = sim_test.simulate_season(weather)
    final_r = recs[-1]
    print(f"{area:>8} {prod:>8.0f} {final_r['stored_m3']:>7.0f} "
          f"{final_r['fill_pct']:>4.0f}% {succ:>6}")`,
      challenge: 'Add a "smart operator" mode: the operator checks the weather forecast and only fills troughs when conditions predict > 1 cm of ice production. Compare water consumption (total trough fills) between the smart operator and filling every night. This is the value of forecasting in production planning.',
      successHint: 'You built a complete production simulator that combines physics (heat transfer), statistics (weather generation), and logistics (harvest, storage, melt losses). The same framework — stochastic production simulation — is used in solar energy yield assessment, agricultural planning, and manufacturing.',
    },
    {
      title: 'Annual performance calculator — summer melt and year-round supply',
      concept: `The seasonal production simulator tells you how much ice is stored by the end of winter. The **annual performance calculator** extends the model through summer to answer the key question: **does the ice last until next winter?**

The summer simulation tracks daily melt using the same degree-day framework, with heat gain through the dome walls driving ice loss. The performance metric is the **supply duration** — the number of days after winter when ice is still available.

A well-designed yakhchal in Isfahan should supply ice from April through September — about 180 days. If the ice runs out in July, the design is undersized. If ice survives into November, the design is oversized (wasted construction cost).

The annual performance calculator runs both the winter production and summer melt simulations to give a complete picture of the system's viability.

📚 *Annual performance analysis is used for every seasonal energy system: solar panels (produce in summer, need in winter), hydroelectric dams (fill in spring, drain in summer), and heating fuel (buy in summer, burn in winter). The yakhchal is an ice "battery" — charged in winter, discharged in summer.*`,
      analogy: 'A squirrel stores nuts in autumn and eats them through winter. If it stores too few, it starves in February. If it stores too many, it wasted foraging time. The yakhchal faces the same balance: produce enough ice in winter to last through summer, but do not over-build the vault. The annual calculator tells you if the "ice squirrel" has stored enough.',
      storyConnection: 'Historical records suggest that a yakhchal serving a town of 5,000 people needed approximately 300-500 tonnes of ice to last the summer. The size of the vault, the thickness of the walls, and the extent of the freezing troughs were all calibrated to this annual cycle. Yakhchal builders who miscalculated left their town without ice in August — a serious failure in a desert climate.',
      checkQuestion: 'If a yakhchal stores 400 m^3 of ice at the end of winter and the average daily melt is 2.5 m^3 during summer, how many days does the ice last?',
      checkAnswer: '400 / 2.5 = 160 days. Starting in late March, that takes you to early September — nearly through the whole summer. But melt rate increases in peak summer (June-August), so the actual duration would be somewhat less. A detailed monthly calculation is needed for accuracy.',
      codeIntro: 'Build the annual performance calculator — winter production followed by summer melt analysis.',
      code: `import numpy as np

np.random.seed(42)

sigma = 5.67e-8

def quick_ice(T, RH, cloud, area=200):
    T_sky = T - (30 + (100 - RH) * 0.3) * (1 - 0.8 * cloud)
    qr = 0.96 * sigma * (273.15**4 - (T_sky + 273.15)**4)
    qc = (5.7 + 3.8) * max(T, 0)
    p_air = RH/100 * 610.78 * np.exp(17.27 * T / (T + 237.3))
    evap = max(0, (610.78 - p_air) / 101325 * 9.5 / 1005 * 0.622 * 101325)
    qe = evap * 2.45e6
    q = qr + qe - qc
    if q <= 0: return 0
    return min(q * 10 * 3600 / (334000 * 917) * 100, 8)

class AnnualPerformance:
    """Year-round yakhchal performance model."""

    def __init__(self, trough_area=200, pit_capacity_m3=393,
                 wall_U=0.20, total_wall_area=450):
        self.trough_area = trough_area
        self.pit_capacity = pit_capacity_m3
        self.wall_U = wall_U
        self.wall_area = total_wall_area

    def monthly_temps(self):
        """Isfahan monthly average temperatures."""
        return [3, 6, 11, 17, 22, 28, 31, 30, 25, 18, 11, 5]

    def winter_production(self, n_nights=110):
        ice_stored = 0
        successes = 0
        for i in range(n_nights):
            seasonal = -3 * np.cos(2 * np.pi * i / n_nights)
            T = np.random.normal(2 + seasonal, 4)
            RH = np.clip(np.random.normal(22, 10), 5, 75)
            cloud = np.random.beta(2, 10) if np.random.random() < 0.72 else np.random.beta(5, 3)
            ice_cm = quick_ice(T, RH, cloud, self.trough_area)
            vol = self.trough_area * ice_cm / 100 * 0.92  # 8% transport loss
            if vol > 0.5:
                ice_stored = min(ice_stored + vol, self.pit_capacity)
                successes += 1
            # Daytime melt during winter
            T_day = T + np.random.uniform(10, 18)
            if ice_stored > 0 and T_day > 0:
                melt = self.wall_U * self.wall_area * T_day * 10 * 3600 / 334000 / 917
                ice_stored = max(0, ice_stored - melt)
        return ice_stored, successes

    def summer_melt(self, initial_ice_m3):
        """Track daily melt from April through October (210 days)."""
        months_temps = self.monthly_temps()
        ice = initial_ice_m3
        daily_record = []
        month_names = ["Apr","May","Jun","Jul","Aug","Sep","Oct"]
        month_indices = [3, 4, 5, 6, 7, 8, 9]  # April=3 through October=9
        days_in_month = [30, 31, 30, 31, 31, 30, 31]

        day_count = 0
        for mi, midx in enumerate(month_indices):
            T_avg = months_temps[midx]
            for d in range(days_in_month[mi]):
                T_daily = T_avg + np.random.normal(0, 3)
                heat_gain = self.wall_U * self.wall_area * max(T_daily, 0)
                melt_kg = heat_gain * 24 * 3600 / 334000
                melt_m3 = melt_kg / 917
                ice = max(0, ice - melt_m3)
                day_count += 1
                daily_record.append({
                    "day": day_count, "month": month_names[mi],
                    "T": T_daily, "ice_m3": ice,
                    "pct": ice / self.pit_capacity * 100,
                    "melt_m3": melt_m3,
                })
                if ice <= 0:
                    break
            if ice <= 0:
                break

        return daily_record

# Run annual simulation
perf = AnnualPerformance()

print("=== Annual Performance Calculator ===\\n")

# Winter production
ice_end_winter, prod_nights = perf.winter_production()
print(f"Winter production: {prod_nights} successful nights")
print(f"Ice stored at end of winter: {ice_end_winter:.0f} m^3 "
      f"({ice_end_winter/perf.pit_capacity*100:.0f}% full)")
print(f"({ice_end_winter * 917 / 1000:.0f} tonnes)\\n")

# Summer melt
records = perf.summer_melt(ice_end_winter)

print("=== Monthly Summer Melt Profile ===")
print(f"{'Month':>5} {'Avg Melt':>10} {'Ice End':>9} {'Fill%':>6}")
print("-" * 32)

current_month = None
month_melts = []
for r in records:
    if r["month"] != current_month:
        if current_month and month_melts:
            avg_melt = np.mean(month_melts)
            print(f"{current_month:>5} {avg_melt:>8.1f} {last_ice:>8.0f} {last_pct:>5.0f}%")
        current_month = r["month"]
        month_melts = []
    month_melts.append(r["melt_m3"])
    last_ice = r["ice_m3"]
    last_pct = r["pct"]
if month_melts:
    print(f"{current_month:>5} {np.mean(month_melts):>8.1f} {last_ice:>8.0f} {last_pct:>5.0f}%")

# Supply duration
days_with_ice = len([r for r in records if r["ice_m3"] > 0])
last_month = records[days_with_ice - 1]["month"] if days_with_ice > 0 else "N/A"
print(f"\\nIce supply lasts: {days_with_ice} days (through {last_month})")
print(f"{'SUFFICIENT' if days_with_ice >= 150 else 'INSUFFICIENT'} for summer supply")

# Sensitivity: wall thickness
print("\\n=== Wall Thickness Sensitivity (same ice stored) ===")
for U in [0.10, 0.15, 0.20, 0.30, 0.40, 0.60]:
    perf_test = AnnualPerformance(wall_U=U)
    recs_t = perf_test.summer_melt(ice_end_winter)
    days_t = len([r for r in recs_t if r["ice_m3"] > 0])
    print(f"  U={U:.2f}: ice lasts {days_t} days "
          f"({'OK' if days_t >= 150 else 'SHORT'})")`,
      challenge: 'Add a "daily demand" parameter: the town consumes 1.5 m^3 of ice per day during summer. Now ice depletes both from melt AND from consumption. What is the minimum winter production needed to meet demand through September? This is capacity planning — the same problem faced by water utilities, power grid operators, and supply chain managers.',
      successHint: 'You built a complete annual energy storage model — winter charging, summer discharging, with weather variability and thermal losses. The same framework applies to seasonal thermal energy storage (STES), pumped hydro, and hydrogen storage. The yakhchal is a 2,400-year-old battery, and you just built its digital twin.',
    },
    {
      title: 'Portfolio presentation — documenting your Passive Cooling Simulator',
      concept: `The final step is **documentation** — recording what you built, how it works, and what it reveals. Your Passive Cooling Simulator documentation should include:

1. **System architecture** — the four classes and their interactions
2. **Physics models** — radiation, evaporation, conduction, and their coupling
3. **Simulation results** — seasonal production, summer melt, annual performance
4. **Design insights** — what makes the yakhchal work (and what makes it fail)
5. **Climate analysis** — how robust is passive cooling under climate change
6. **Limitations and future work** — what the model does not capture

This is a **technical portfolio piece** that demonstrates skills in thermal physics, numerical simulation, object-oriented programming, and data analysis — the core competencies of a building energy engineer.

📚 *Documentation is the bridge between doing the work and communicating its value. A simulation without documentation is a black box — nobody can trust, reproduce, or build upon it.*`,
      analogy: 'A scientific paper does not just present results — it explains the method in enough detail that someone else could reproduce the experiment. Your simulator documentation serves the same purpose: it turns your code from a personal tool into a shareable, credible piece of engineering.',
      storyConnection: 'The yakhchal builders left no written documentation — their knowledge was transmitted orally and through apprenticeship. When the ice trade declined in the 20th century, much of this knowledge was lost. Your simulator, with its documentation, preserves and formalises the engineering principles they developed empirically over millennia.',
      checkQuestion: 'Why is documenting limitations more valuable than hiding them?',
      checkAnswer: 'Because every model is a simplification of reality. Documenting what the model does NOT capture — non-uniform wall thickness, wind-driven rain, soil moisture variation — tells the reader exactly how far they can trust the results. An undocumented limitation is a hidden trap. A documented one is a signpost that says "improve here next."',
      codeIntro: 'Generate the complete project documentation for the Passive Cooling Simulator.',
      code: `# Passive Cooling Simulator — Project Documentation

print("""
================================================================
         PASSIVE COOLING SIMULATOR
           Project Documentation
================================================================

1. INTRODUCTION
---------------
This simulator models the Persian yakhchal (ice house) — a
passive refrigeration system that has operated in the Iranian
desert for over 2,400 years. It produces ice in winter using
radiative cooling and stores it underground through summer
using thick insulating walls.

The simulator was built to answer: How does the yakhchal work
quantitatively? What are its performance limits? And can its
principles be applied to modern passive cooling?

2. SYSTEM ARCHITECTURE
----------------------
Four interacting classes model the complete system:

  Surface (200 m^2 water troughs)
    - Stefan-Boltzmann radiative exchange with night sky
    - Evaporative cooling (psychrometric model)
    - Convective heat transfer from air
    - Ground conduction

  Wall (2m sarooj, k=0.4 W/mK)
    - Fourier 1D heat conduction
    - Thermal time constant: ~100 hours
    - Steady-state and transient modes

  WindCatcher (8m tower)
    - Stack-effect driven airflow
    - Evaporative cooling (85% wet-bulb efficiency)
    - Supplies cooled air to occupied spaces

  IcePit (5m radius, 5m deep)
    - 393 m^3 storage capacity (~360 tonnes ice)
    - Tracks cumulative storage and melt losses
    - Phase-change energy balance

3. PHYSICS MODELS
-----------------
  a) Radiation: q = eps * sigma * (Ts^4 - Tsky^4)
     - Sky temperature from air temp, humidity, cloud cover
     - Water emissivity: 0.96

  b) Evaporation: psychrometric model using Stull's formula
     - Wet-bulb depression determines cooling potential
     - Most effective in dry desert air (RH < 20%)

  c) Conduction: q = k * dT/dx (Fourier's law)
     - Sarooj mortar: k = 0.4 W/mK (1/3 of brick)
     - 2m wall = ~100 hour thermal time constant

  d) Convection: q = h * (T_air - T_surface)
     - h = 5.7 + 3.8 * wind_speed (W/m^2K)

4. KEY FINDINGS
---------------
  - A 200 m^2 trough produces 1-3 cm of ice per clear night
  - ~70 successful production nights per Isfahan winter
  - Seasonal production: 200-350 m^3 depending on weather
  - 2m sarooj wall loses only 8.6 W/m^2 at peak summer
  - Ice supply lasts 150-200 days (April through September)
  - Cloud cover and humidity are the main production killers
  - Climate change (+3C) could reduce production by 40-60%

5. LIMITATIONS
--------------
  - Simplified 1D conduction (no 2D/3D effects)
  - Constant ground temperature assumption
  - No wind-driven rain or snow modelling
  - Simplified evaporation model
  - No structural analysis of the dome
  - Weather generator uses Gaussian distributions
    (real weather has fat tails and autocorrelation)
  - No economic optimisation of trough/pit sizing

6. FUTURE IMPROVEMENTS
----------------------
  - 2D/3D finite element thermal model of the dome
  - Real weather data from Iranian meteorological stations
  - Coupled qanat flow + ice production model
  - Multi-year simulation with climate change projections
  - Cost optimisation: trough area vs pit size trade-off
  - Modern materials: radiative cooling films, aerogel insulation

7. SKILLS DEMONSTRATED
----------------------
  * Object-oriented programming (4 interacting classes)
  * Thermal physics (radiation, conduction, convection, evaporation)
  * Numerical methods (explicit time-stepping, finite difference)
  * Monte Carlo simulation (seasonal weather generation)
  * Psychrometrics (humidity, wet-bulb, dew point)
  * Building energy analysis (degree-days, U-values)
  * Lifecycle cost analysis (NPV, discount rates)
  * Climate science (warming scenarios, adaptation limits)
  * Data analysis (seasonal statistics, sensitivity analysis)
  * Technical documentation

================================================================
""")

# Skills matrix
skills = [
    ("Thermal physics",         "Stefan-Boltzmann, Fourier, Newton's cooling law"),
    ("Numerical simulation",    "Explicit time-stepping, phase-change handling"),
    ("Psychrometrics",          "Wet-bulb, dew point, evaporative cooling"),
    ("Monte Carlo methods",     "Stochastic weather, seasonal variability"),
    ("Building energy",         "Degree-days, U-values, thermal mass"),
    ("Object-oriented design",  "Surface, Wall, WindCatcher, IcePit classes"),
    ("Lifecycle cost analysis", "NPV, discount rates, carbon accounting"),
    ("Climate adaptation",      "Warming scenarios, passive cooling limits"),
    ("Data communication",      "Tables, sensitivity analysis, clear reporting"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  * {skill}: {detail}")

print()
print("This project demonstrates the ability to model a complex")
print("multi-physics system from first principles, simulate its")
print("performance under realistic conditions, and communicate")
print("results clearly — the core skills of a building energy")
print("engineer or sustainable design researcher.")`,
      challenge: 'Write a one-paragraph "executive summary" for a non-technical audience (a city mayor considering passive cooling for public buildings). Explain what the simulator found in plain language: how much cooling the yakhchal principle provides, how much energy it saves, and why it matters for climate adaptation. The ability to communicate technical results to non-technical stakeholders is the most valuable skill in engineering.',
      successHint: 'You have completed a full engineering project cycle for the Passive Cooling Simulator: architecture design, physics engine, seasonal simulation, annual performance analysis, and documentation. This is a genuine portfolio project that demonstrates thermal physics, numerical methods, object-oriented programming, and sustainability analysis — skills directly applicable to building energy engineering, climate adaptation research, and sustainable design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Passive Cooling Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Passive Cooling Simulator for the Persian yakhchal.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
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
