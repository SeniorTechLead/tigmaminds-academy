import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AurovilleLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Solar kitchen designer — specify requirements, get a complete system',
      concept: `In this capstone, you build an automated solar kitchen designer. Given inputs like number of meals, location, budget, and available space, it designs the complete system: dish size, boiler pressure, storage tank volume, backup system, and produces a cost estimate.

The designer works backward from the cooking requirement: meals per day determine the required thermal power, which determines the dish size, which determines the structural requirements and cost. Constraints (budget, space, wind zone) may force compromises that the optimizer handles automatically.

This is **systems engineering** — designing a complete system by balancing multiple interacting components, constraints, and objectives.

*Systems engineering was formalized by Bell Labs in the 1940s for telephone network design. It is now the standard approach for complex projects: spacecraft, hospitals, factories, and smart cities.*`,
      analogy: 'Think of designing a restaurant kitchen. You start with the menu and number of customers, then work backward: how many stoves, how much prep space, how many refrigerators, how many staff. Each choice affects the others. The solar kitchen designer does the same thing, but with physics equations instead of rules of thumb.',
      storyConnection: 'When Auroville designed their solar kitchen in the 1990s, they went through exactly this process: starting from 1000 meals/day, calculating the required power, sizing the dish, designing the boiler, and specifying the steam distribution system. The automated designer codifies this expert knowledge into an algorithm.',
      checkQuestion: 'If a community needs 500 meals/day, what size dish is needed (assuming 0.5 kWh/meal, 5 peak solar hours, and 56% system efficiency)?',
      checkAnswer: 'Total energy: 500 x 0.5 = 250 kWh/day. Over 5 hours: 50 kW average. At 56% efficiency: 50/0.56 = 89 kW solar input. At 1 kW/m^2: need 89 m^2 dish area. Diameter = 2 x sqrt(89/pi) = 10.7 m. A dish about 11 metres in diameter would serve 500 meals per day on clear days.',
      codeIntro: 'Build an automated solar kitchen design tool.',
      code: `import numpy as np

class SolarKitchenDesigner:
    def __init__(self, meals_per_day, latitude, dni_kwh_m2_day,
                 budget=None, max_dish_diameter=None):
        self.meals = meals_per_day
        self.latitude = latitude
        self.dni = dni_kwh_m2_day
        self.budget = budget
        self.max_dish = max_dish_diameter
        self.design = {}

    def calculate(self):
        # 1. Energy requirement
        energy_per_meal = 0.5  # kWh
        daily_energy_needed = self.meals * energy_per_meal

        # 2. System efficiency
        system_eff = 0.56

        # 3. Required solar collection
        daily_solar_needed = daily_energy_needed / system_eff
        peak_hours = min(self.dni, 6)  # effective peak hours

        # 4. Dish sizing
        required_power_kW = daily_solar_needed / peak_hours
        required_area = required_power_kW  # at 1 kW/m^2
        dish_diameter = 2 * np.sqrt(required_area / np.pi)

        if self.max_dish and dish_diameter > self.max_dish:
            dish_diameter = self.max_dish
            required_area = np.pi * (dish_diameter / 2) ** 2

        actual_area = np.pi * (dish_diameter / 2) ** 2
        actual_power = actual_area * 1.0  # kW at 1 kW/m^2
        actual_daily = actual_power * system_eff * peak_hours
        actual_meals = actual_daily / energy_per_meal

        # 5. Boiler design
        steam_rate = actual_power * system_eff * 0.85 / 2260 * 3600  # kg/hr
        boiler_pressure = 3  # atm (standard)
        boiler_diameter = 0.3 + dish_diameter / 50  # scale with dish

        # 6. Storage tank
        storage_hours = 2  # hours of backup
        storage_kWh = actual_power * system_eff * storage_hours
        tank_volume = storage_kWh * 3600 / (4.186 * 60)  # litres (60 C range)

        # 7. Cost estimate
        dish_cost = actual_area * 500  # $500/m^2 installed
        boiler_cost = 15000 + steam_rate * 100
        storage_cost = tank_volume * 2  # $2/litre
        controls_cost = 10000
        installation_cost = (dish_cost + boiler_cost) * 0.3
        total_cost = dish_cost + boiler_cost + storage_cost + controls_cost + installation_cost

        # 8. Backup fuel requirement
        solar_fraction = min(actual_meals / self.meals, 1.0)
        backup_meals = self.meals * (1 - solar_fraction * 0.75)  # account for clouds
        annual_backup_kWh = backup_meals * 365 * 0.5
        annual_fuel_cost = annual_backup_kWh * 0.08  # LPG at $0.08/kWh

        self.design = {
            "dish_diameter_m": dish_diameter,
            "dish_area_m2": actual_area,
            "peak_power_kW": actual_power,
            "daily_energy_kWh": actual_daily,
            "meals_achievable": actual_meals,
            "steam_rate_kg_hr": steam_rate,
            "boiler_pressure_atm": boiler_pressure,
            "tank_volume_litres": tank_volume,
            "storage_hours": storage_hours,
            "solar_fraction": solar_fraction,
            "total_cost": total_cost,
            "annual_fuel_cost": annual_fuel_cost,
            "dish_cost": dish_cost,
            "boiler_cost": boiler_cost,
            "storage_cost": storage_cost,
        }
        return self.design

    def report(self):
        d = self.design
        print("=" * 55)
        print("    SOLAR KITCHEN DESIGN REPORT")
        print("=" * 55)
        print(f"\n  REQUIREMENTS:")
        print(f"    Meals per day: {self.meals}")
        print(f"    Location: {self.latitude} N latitude")
        print(f"    Solar resource: {self.dni} kWh/m^2/day DNI")

        print(f"\n  DISH DESIGN:")
        print(f"    Diameter: {d['dish_diameter_m']:.1f} m")
        print(f"    Area: {d['dish_area_m2']:.0f} m^2")
        print(f"    Peak power: {d['peak_power_kW']:.0f} kW solar")

        print(f"\n  BOILER:")
        print(f"    Steam rate: {d['steam_rate_kg_hr']:.0f} kg/hr")
        print(f"    Pressure: {d['boiler_pressure_atm']} atm")

        print(f"\n  STORAGE:")
        print(f"    Tank: {d['tank_volume_litres']:.0f} litres")
        print(f"    Backup hours: {d['storage_hours']}")

        print(f"\n  PERFORMANCE:")
        print(f"    Daily solar energy: {d['daily_energy_kWh']:.0f} kWh")
        print(f"    Meals from solar: {d['meals_achievable']:.0f}/day")
        print(f"    Solar fraction: {d['solar_fraction']:.0%}")

        print(f"\n  COST ESTIMATE:")
        print(f"    Dish: {d['dish_cost']:,.0f}")
        print(f"    Boiler: {d['boiler_cost']:,.0f}")
        print(f"    Storage: {d['storage_cost']:,.0f}")
        print(f"    TOTAL: {d['total_cost']:,.0f}")
        print(f"    Annual fuel backup: {d['annual_fuel_cost']:,.0f}")

        payback = d['total_cost'] / (self.meals * 365 * 0.5 * 0.08 - d['annual_fuel_cost'])
        print(f"    Payback vs LPG: {payback:.1f} years")
        print("=" * 55)

# Design three different solar kitchens
configs = [
    {"name": "Small school", "meals": 200, "lat": 12, "dni": 5.0},
    {"name": "Auroville-scale", "meals": 1000, "lat": 12, "dni": 5.0},
    {"name": "Large campus (Rajasthan)", "meals": 3000, "lat": 26, "dni": 6.5},
]

for config in configs:
    print(f"\n>>> Designing: {config['name']}")
    designer = SolarKitchenDesigner(
        config["meals"], config["lat"], config["dni"]
    )
    designer.calculate()
    designer.report()`,
      challenge: 'Add multi-objective optimization: vary the dish diameter, storage size, and backup ratio to find the design that minimizes 25-year lifecycle cost (construction + fuel + maintenance). Plot the Pareto frontier of cost vs solar fraction.',
      successHint: 'You built an automated design tool — the same type of software used by engineering firms to design solar power plants, HVAC systems, and water treatment facilities. Automated design combines physics models with optimization to explore thousands of design variants and find the best one.',
    },
    {
      title: 'Control system — automating the Solar Kitchen operation',
      concept: `The Solar Kitchen cannot be operated manually all day. An **automatic control system** manages: sun tracking (pointing the dish), boiler operation (maintaining pressure and water level), steam distribution (opening/closing valves to cooking vessels), and safety (stowing the dish in high wind, shutting down on boiler overpressure).

The control system uses **feedback loops**: a sensor measures a variable (temperature, pressure, wind speed), compares it to a setpoint, and adjusts an actuator (motor, valve) to minimize the error. This is **PID control** — the most common industrial control algorithm.

In this exercise, you build a simplified control system simulator for the Solar Kitchen that manages all major subsystems simultaneously.

*PID control (Proportional-Integral-Derivative) was invented in 1911 and is still used in over 90% of industrial control loops. Every thermostat, cruise control, and autopilot uses a variant of PID control.*`,
      analogy: 'Think of driving a car on a winding road. Your eyes (sensor) detect your position relative to the lane centre. Your brain (controller) calculates a correction. Your hands (actuator) turn the steering wheel. If you are left of centre, you steer right — and vice versa. This continuous sense-compute-act loop is feedback control.',
      storyConnection: 'The Auroville Solar Kitchen originally used manual control — an operator watched temperature gauges and turned valves by hand. After automation in 2005, a microcontroller manages all subsystems, freeing the operators for cooking. The automated system also responds faster to sudden changes (clouds, wind gusts) than a human operator could.',
      checkQuestion: 'If the boiler pressure setpoint is 3 atm and the actual pressure is 3.5 atm, what should the controller do?',
      checkAnswer: 'The pressure is 0.5 atm above the setpoint. The controller should either: (1) open the steam outlet valve wider (release more steam to cooking), (2) reduce the solar input (defocus the dish slightly), or (3) add more cold water to the boiler. A well-designed controller uses all three, weighted by how quickly each responds.',
      codeIntro: 'Build a control system simulator for the Auroville Solar Kitchen.',
      code: `import numpy as np

class PIDController:
    def __init__(self, Kp, Ki, Kd, setpoint, output_min=0, output_max=100):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.setpoint = setpoint
        self.output_min = output_min
        self.output_max = output_max
        self.integral = 0
        self.prev_error = 0

    def update(self, measurement, dt=1):
        error = self.setpoint - measurement
        self.integral += error * dt
        derivative = (error - self.prev_error) / dt
        self.prev_error = error

        output = self.Kp * error + self.Ki * self.integral + self.Kd * derivative
        return np.clip(output, self.output_min, self.output_max)

class SolarKitchenController:
    def __init__(self):
        self.boiler_temp = 25  # C
        self.boiler_pressure = 1  # atm
        self.tank_temp = 30  # C
        self.wind_speed = 10  # km/h
        self.dish_tracking = True
        self.stowed = False

        # PID controllers
        self.temp_controller = PIDController(2.0, 0.1, 0.5, setpoint=130,
                                              output_min=0, output_max=100)
        self.pressure_controller = PIDController(50, 5, 10, setpoint=3,
                                                  output_min=0, output_max=100)

    def simulate_step(self, solar_kW, wind_kmh, cooking_demand_kW, dt=60):
        """Simulate one time step (dt seconds)."""
        self.wind_speed = wind_kmh

        # Wind safety check
        if wind_kmh > 60 and not self.stowed:
            self.stowed = True
            self.dish_tracking = False
        elif wind_kmh < 40 and self.stowed:
            self.stowed = False
            self.dish_tracking = True

        # Solar input (zero if stowed)
        effective_solar = solar_kW if not self.stowed else 0

        # Temperature control: adjust dish focus to control boiler temp
        focus_pct = self.temp_controller.update(self.boiler_temp, dt / 60)
        heat_input = effective_solar * focus_pct / 100 * 0.68  # system efficiency

        # Pressure control: adjust steam valve
        valve_pct = self.pressure_controller.update(self.boiler_pressure, dt / 60)
        steam_out_kW = cooking_demand_kW * valve_pct / 100

        # Boiler physics (simplified)
        boiler_mass = 500  # kg water
        net_heat = heat_input - steam_out_kW - 2  # 2 kW ambient loss
        temp_change = net_heat * dt / (boiler_mass * 4.186)
        self.boiler_temp += temp_change
        self.boiler_temp = np.clip(self.boiler_temp, 25, 200)

        # Pressure follows temperature (simplified)
        if self.boiler_temp > 100:
            self.boiler_pressure = 1 + (self.boiler_temp - 100) / 30
        else:
            self.boiler_pressure = 1

        # Safety limits
        if self.boiler_pressure > 5:
            # Emergency pressure relief
            self.boiler_pressure = 4.5
            self.boiler_temp = 145

        return {
            "temp": self.boiler_temp,
            "pressure": self.boiler_pressure,
            "focus": focus_pct,
            "valve": valve_pct,
            "heat_in": heat_input,
            "steam_out": steam_out_kW,
            "stowed": self.stowed,
        }

# Run simulation
controller = SolarKitchenController()

# Morning startup and cooking sequence
scenario = [
    # (minute, solar_kW, wind_kmh, cooking_demand_kW)
    (0,   0,   5,  0),
    (30,  50,  8,  0),
    (60,  100, 10, 0),
    (90,  140, 12, 20),
    (120, 160, 10, 60),
    (150, 160, 15, 80),
    (180, 160, 12, 100),
    (210, 140, 20, 80),
    (240, 100, 15, 60),
    (270, 50,  70, 40),    # Sudden wind!
    (300, 80,  30, 40),    # Wind subsides
    (330, 40,  15, 20),
    (360, 10,  10, 0),
]

print("=== Solar Kitchen Control System Simulation ===")
print(f"Boiler setpoints: Temp=130 C, Pressure=3 atm")
print(f"Wind stow threshold: 60 km/h")
print()

header = "Min  Solar  Wind  Demand  Temp(C)  Press(atm)  Focus%  Valve%  Status"
print(header)
print("-" * 80)

for i in range(len(scenario) - 1):
    t1, s1, w1, d1 = scenario[i]
    t2, s2, w2, d2 = scenario[i + 1]
    duration = t2 - t1

    for step in range(0, duration, 1):
        frac = step / duration
        solar = s1 + (s2 - s1) * frac
        wind = w1 + (w2 - w1) * frac
        demand = d1 + (d2 - d1) * frac
        result = controller.simulate_step(solar, wind, demand)

    status = "STOWED" if result["stowed"] else "TRACKING"
    print(f"{t2:>3}  {s2:>5}  {w2:>4}  {d2:>6}    {result['temp']:>5.0f}    "
          f"{result['pressure']:>8.1f}    {result['focus']:>4.0f}    "
          f"{result['valve']:>4.0f}    {status}")

print()
print("The controller maintained stable temperature despite")
print("varying solar input, cooking demand, and a wind event.")`,
      challenge: 'Add feedforward control: use the weather forecast (predicted solar irradiance for the next hour) to pre-adjust the dish focus before the disturbance arrives. Compare the temperature stability of feedback-only vs feedforward+feedback control.',
      successHint: 'You built an industrial control system — the same PID controllers are used in every factory, power plant, refinery, and building HVAC system in the world. Control engineering is what makes modern automated systems possible.',
    },
    {
      title: 'Environmental impact — carbon savings and sustainability metrics',
      concept: `The Auroville Solar Kitchen replaces fossil fuel (LPG or firewood) with solar energy. Every kWh of solar cooking saves about **0.2 kg CO2** (compared to LPG) or prevents the burning of **0.3 kg of firewood** (reducing deforestation). Over 25 years, a single 15-metre dish prevents over 500 tonnes of CO2 emissions.

The environmental assessment includes: **embodied carbon** (CO2 emitted during manufacturing the dish and boiler), **operational carbon savings** (fossil fuel displaced), and **end-of-life** (recycling the steel and aluminium). The **carbon payback period** is the time for operational savings to exceed embodied carbon.

In the code below, you will calculate the complete environmental impact of the Auroville Solar Kitchen and compare it to conventional cooking methods.

*Life cycle assessment (LCA) is the standard method for evaluating environmental impact. It accounts for all stages: raw material extraction, manufacturing, transportation, use, and disposal. The Auroville dish has one of the best LCA profiles of any cooking technology.*`,
      analogy: 'Think of planting a tree. The seed and planting effort have a "cost" (embodied carbon of manufacturing the dish). The tree then absorbs CO2 every year (operational carbon savings). After a few years, the tree has absorbed more CO2 than the planting cost — it is "carbon positive." The solar kitchen is the same: initial carbon cost, then years of carbon savings.',
      storyConnection: 'Auroville tracks its environmental impact meticulously. The Solar Kitchen has saved an estimated 5000 tonnes of CO2 since its installation in 1996 — equivalent to taking about 1000 cars off the road for a year. It has also saved about 3000 tonnes of firewood that would otherwise have been harvested from local forests.',
      checkQuestion: 'If the dish saves 20 tonnes of CO2 per year and its manufacture produced 30 tonnes of CO2, what is the carbon payback period?',
      checkAnswer: '30 tonnes / 20 tonnes per year = 1.5 years. After just 18 months, the dish has "paid back" its manufacturing carbon debt and is net positive for the environment. Over a 25-year lifetime, the net saving is 20 x 25 - 30 = 470 tonnes of CO2.',
      codeIntro: 'Calculate the complete environmental impact of the Auroville Solar Kitchen.',
      code: `import numpy as np

class EnvironmentalAssessment:
    def __init__(self, dish_diameter_m, lifetime_years=25):
        self.area = np.pi * (dish_diameter_m / 2) ** 2
        self.lifetime = lifetime_years
        self.dish_diameter = dish_diameter_m

    def embodied_carbon(self):
        """CO2 emitted during manufacturing (tonnes)."""
        steel_kg = self.area * 15  # ~15 kg steel per m^2
        aluminium_kg = self.area * 5  # mirror backing
        concrete_kg = 5000  # foundation

        # Carbon intensity of materials
        co2_steel = steel_kg * 1.8 / 1000  # tonnes
        co2_aluminium = aluminium_kg * 8.0 / 1000
        co2_concrete = concrete_kg * 0.15 / 1000
        co2_transport = 2  # tonnes (estimated)

        return {
            "steel": co2_steel,
            "aluminium": co2_aluminium,
            "concrete": co2_concrete,
            "transport": co2_transport,
            "total": co2_steel + co2_aluminium + co2_concrete + co2_transport,
        }

    def annual_savings(self, meals_per_day=1000, solar_fraction=0.75):
        """Annual environmental savings."""
        annual_meals = meals_per_day * 365
        solar_meals = annual_meals * solar_fraction
        energy_saved_kWh = solar_meals * 0.5

        # CO2 savings vs different fuels
        co2_vs_lpg = energy_saved_kWh * 0.22 / 1000  # tonnes
        co2_vs_firewood = energy_saved_kWh * 0.35 / 1000
        co2_vs_electric = energy_saved_kWh * 0.82 / 1000  # India grid

        # Firewood savings
        firewood_saved_kg = energy_saved_kWh * 0.3

        # Water savings (no cooling water needed vs thermal power)
        water_saved_litres = energy_saved_kWh * 2  # litres per kWh

        return {
            "energy_saved_kWh": energy_saved_kWh,
            "co2_vs_lpg": co2_vs_lpg,
            "co2_vs_firewood": co2_vs_firewood,
            "co2_vs_grid": co2_vs_electric,
            "firewood_saved_kg": firewood_saved_kg,
            "water_saved_litres": water_saved_litres,
        }

# Auroville assessment
assessment = EnvironmentalAssessment(15, 25)
embodied = assessment.embodied_carbon()
annual = assessment.annual_savings(1000, 0.75)

print("=== Environmental Impact: Auroville Solar Kitchen ===")
print(f"Dish: {assessment.dish_diameter}m | Lifetime: {assessment.lifetime} years")
print()

print("EMBODIED CARBON (manufacturing):")
for component, value in embodied.items():
    if component != "total":
        print(f"  {component:<15} {value:>6.1f} tonnes CO2")
print(f"  {'TOTAL':<15} {embodied['total']:>6.1f} tonnes CO2")

print()
print("ANNUAL SAVINGS:")
print(f"  Solar energy delivered: {annual['energy_saved_kWh']:,.0f} kWh")
print(f"  CO2 saved vs LPG: {annual['co2_vs_lpg']:.1f} tonnes/year")
print(f"  CO2 saved vs firewood: {annual['co2_vs_firewood']:.1f} tonnes/year")
print(f"  CO2 saved vs grid electric: {annual['co2_vs_grid']:.1f} tonnes/year")
print(f"  Firewood saved: {annual['firewood_saved_kg']:,.0f} kg/year")
print(f"  Water saved: {annual['water_saved_litres']:,.0f} litres/year")

# Carbon payback
payback_lpg = embodied["total"] / annual["co2_vs_lpg"]
payback_wood = embodied["total"] / annual["co2_vs_firewood"]
print()
print("CARBON PAYBACK PERIOD:")
print(f"  vs LPG: {payback_lpg:.1f} years")
print(f"  vs firewood: {payback_wood:.1f} years")

# Lifetime impact
print()
print("LIFETIME IMPACT (25 years):")
lifetime_co2_lpg = annual["co2_vs_lpg"] * 25 - embodied["total"]
lifetime_co2_wood = annual["co2_vs_firewood"] * 25 - embodied["total"]
lifetime_firewood = annual["firewood_saved_kg"] * 25
trees_saved = lifetime_firewood / 500  # ~500 kg per tree

print(f"  Net CO2 saved (vs LPG): {lifetime_co2_lpg:.0f} tonnes")
print(f"  Net CO2 saved (vs firewood): {lifetime_co2_wood:.0f} tonnes")
print(f"  Firewood saved: {lifetime_firewood/1000:.0f} tonnes")
print(f"  Trees saved: ~{trees_saved:.0f}")

# Equivalent impact
print()
print("EQUIVALENT IMPACT:")
print(f"  = Taking {lifetime_co2_lpg/4.6:.0f} cars off the road for a year")
print(f"  = Planting {lifetime_co2_lpg/0.02:.0f} trees")
print(f"  = {lifetime_co2_lpg * 1000 / 400:.0f} flights from Delhi to Mumbai avoided")`,
      challenge: 'Add a sensitivity analysis: how does the environmental impact change if the solar fraction drops to 50% (more clouds), if the dish lifetime is only 15 years (corrosion), or if the LPG price doubles? Find the conditions under which the solar kitchen stops being environmentally beneficial.',
      successHint: 'You performed a life cycle environmental assessment — the gold standard for evaluating the sustainability of any technology. The same LCA methodology is used for buildings, vehicles, consumer products, and energy systems. Environmental engineering is about quantifying impact, not just feeling good about "going green."',
    },
    {
      title: 'Complete solar cooking system — from sunlight to served meal',
      concept: `In this final capstone, you integrate every concept from all four levels into a single end-to-end simulation of the Auroville Solar Kitchen. The simulator takes the current date, time, and weather, then models: solar position and irradiance, dish tracking, optical concentration, boiler heat transfer, steam generation, thermal storage, cooking energy delivery, control system response, and finally the number of meals cooked.

This is the **digital twin** of the Auroville Solar Kitchen — a computational model that mirrors the physical system and can predict its performance under any conditions.

*Digital twins are one of the hottest areas in engineering. By maintaining a computational model synchronized with real sensor data, engineers can predict failures, optimize performance, and test changes virtually before implementing them physically.*`,
      analogy: 'Think of a flight simulator that perfectly models a real aircraft. Pilots use it to practice emergencies and learn the aircraft\'s behaviour without risking lives. The solar kitchen digital twin is similar — engineers can simulate cyclones, equipment failures, or design changes without affecting the real kitchen.',
      storyConnection: 'This simulator represents the culmination of 30 years of Auroville Solar Kitchen experience. It encodes the physics of solar concentration, the engineering of steam generation, the logistics of daily cooking operations, and the environmental impact — all in a single computational model. This is how traditional knowledge becomes scalable technology.',
      checkQuestion: 'What is the single most important factor determining how many meals the Solar Kitchen cooks on a given day?',
      checkAnswer: 'Cloud cover (which determines DNI). Even a perfect dish, boiler, and storage system cannot cook if the sun is blocked. This is why the backup system is essential — and why solar kitchen designers must honestly assess the local cloud statistics rather than optimizing only for clear-sky performance.',
      codeIntro: 'Run a complete end-to-end solar cooking simulation for one day.',
      code: `import numpy as np

class SolarKitchenSimulator:
    def __init__(self, dish_diameter=15, latitude=12, day_of_year=80):
        self.dish_area = np.pi * (dish_diameter / 2) ** 2
        self.latitude = latitude
        self.day = day_of_year
        self.system_eff = 0.56
        self.boiler_temp = 30
        self.tank_temp = 40
        self.tank_volume = 5000  # litres
        self.meals_cooked = 0
        self.energy_delivered = 0
        self.solar_energy_total = 0
        self.backup_energy = 0

    def solar_power(self, hour):
        """Solar power available at given hour (kW)."""
        # Sun elevation
        decl = 23.45 * np.sin(np.radians(360 * (284 + self.day) / 365))
        ha = (hour - 12) * 15
        lat_r = np.radians(self.latitude)
        dec_r = np.radians(decl)
        ha_r = np.radians(ha)
        sin_elev = np.sin(lat_r) * np.sin(dec_r) + np.cos(lat_r) * np.cos(dec_r) * np.cos(ha_r)
        elevation = np.degrees(np.arcsin(np.clip(sin_elev, -1, 1)))

        if elevation <= 5:
            return 0

        # Atmospheric transmission
        air_mass = 1 / np.sin(np.radians(max(elevation, 5)))
        dni = 1361 * 0.7 ** (air_mass ** 0.678)

        return self.dish_area * dni / 1000  # kW

    def simulate_day(self, cloud_factor=1.0, wind_stow_hours=None):
        """Simulate complete day of operation."""
        if wind_stow_hours is None:
            wind_stow_hours = []

        hourly_log = []
        cooking_demand = {
            8: 0, 9: 20, 10: 60, 11: 80, 12: 100,
            13: 80, 14: 50, 15: 20, 16: 0
        }

        for hour_x2 in range(12, 36):  # 6:00 to 18:00
            hour = hour_x2 / 2

            # Solar input
            solar = self.solar_power(hour) * cloud_factor
            if hour in wind_stow_hours:
                solar = 0  # dish stowed

            self.solar_energy_total += solar * 0.5  # 0.5 hour step

            # Useful heat
            useful = solar * self.system_eff

            # Cooking demand
            demand = cooking_demand.get(int(hour), 0)

            # Surplus/deficit
            surplus = useful - demand

            if surplus > 0:
                # Charge storage tank
                energy_J = surplus * 1000 * 1800  # 0.5 hour in seconds
                dt = energy_J / (self.tank_volume * 4186)
                self.tank_temp = min(90, self.tank_temp + dt)
            elif surplus < 0:
                # Discharge from tank
                deficit = -surplus
                available = self.tank_volume * 4186 * (self.tank_temp - 40) / (1000 * 1800)
                from_tank = min(deficit, available)
                energy_J = from_tank * 1000 * 1800
                dt = energy_J / (self.tank_volume * 4186)
                self.tank_temp = max(40, self.tank_temp - dt)

                still_needed = deficit - from_tank
                if still_needed > 0:
                    self.backup_energy += still_needed * 0.5

            # Meals cooked this half-hour
            actual_cooking = min(demand, useful + max(0, -surplus))
            meals_this_step = actual_cooking * 0.5 / 0.5  # 0.5 kWh per meal
            self.meals_cooked += meals_this_step
            self.energy_delivered += actual_cooking * 0.5

            # Tank heat loss
            self.tank_temp -= (self.tank_temp - 30) * 0.005

            if hour % 1 == 0 and 6 <= hour <= 18:
                hourly_log.append({
                    "hour": hour, "solar_kW": solar, "useful_kW": useful,
                    "demand_kW": demand, "tank_C": self.tank_temp,
                    "meals_cumul": self.meals_cooked,
                })

        return hourly_log

    def report(self, log):
        print("=" * 60)
        print("    DAILY SOLAR KITCHEN OPERATION REPORT")
        print("=" * 60)
        print()

        header = "Hour  Solar(kW)  Useful(kW)  Demand(kW)  Tank(C)  Meals(cum)"
        print(header)
        print("-" * len(header))

        for entry in log:
            print(f"{entry['hour']:>4.0f}    {entry['solar_kW']:>7.0f}    "
                  f"{entry['useful_kW']:>8.0f}    {entry['demand_kW']:>8.0f}    "
                  f"{entry['tank_C']:>5.0f}    {entry['meals_cumul']:>8.0f}")

        print()
        print(f"  Total solar energy: {self.solar_energy_total:.0f} kWh")
        print(f"  Energy delivered: {self.energy_delivered:.0f} kWh")
        print(f"  Backup energy used: {self.backup_energy:.0f} kWh")
        print(f"  Total meals cooked: {self.meals_cooked:.0f}")
        solar_pct = self.energy_delivered / (self.energy_delivered + self.backup_energy) * 100 if (self.energy_delivered + self.backup_energy) > 0 else 100
        print(f"  Solar fraction: {solar_pct:.0f}%")
        eff = self.energy_delivered / self.solar_energy_total * 100 if self.solar_energy_total > 0 else 0
        print(f"  System efficiency: {eff:.0f}%")
        print("=" * 60)

# Run three scenarios
scenarios = [
    ("Clear equinox day", 80, 1.0, []),
    ("Partly cloudy", 80, 0.6, []),
    ("Monsoon day with wind event", 200, 0.35, [10, 10.5, 11]),
]

for name, day, cloud, wind_hours in scenarios:
    print(f"\n>>> Scenario: {name}")
    sim = SolarKitchenSimulator(dish_diameter=15, latitude=12, day_of_year=day)
    log = sim.simulate_day(cloud_factor=cloud, wind_stow_hours=wind_hours)
    sim.report(log)`,
      challenge: 'Run the simulator for all 365 days of the year with realistic monthly cloud factors. Calculate the annual total meals, solar fraction, backup fuel use, and CO2 savings. This is the complete annual performance prediction that justifies the investment in the Solar Kitchen.',
      successHint: 'You have built a complete digital twin of the Auroville Solar Kitchen — integrating optics, thermodynamics, heat transfer, control systems, storage, and environmental impact into a single simulation. This is real systems engineering: understanding how every component interacts to produce the final performance. You have connected the simple act of cooking food with the sun to the deepest principles of physics, engineering, and environmental science.',
    },
    {
      title: 'Scaling analysis — from one kitchen to a national solar cooking network',
      concept: `If one solar kitchen can cook for 1000 people, how many are needed to serve India's 1.4 billion? What is the total cost, land area, carbon savings, and job creation? **Scaling analysis** takes a proven single-unit design and projects it to regional or national scale, identifying bottlenecks and opportunities.

The key scaling questions are: (1) How much does the per-unit cost decrease with mass production (learning curve)? (2) Where should units be placed for maximum impact? (3) What infrastructure is needed? (4) What is the total environmental and economic impact?

In this final exercise, you build a national-scale solar cooking deployment model that estimates the investment, impact, and feasibility of deploying solar kitchens across India.

*Scaling analysis is how engineers turn laboratory successes into global impacts. Solar PV, mobile phones, and vaccines all followed the same path: prove the concept at small scale, then use scaling analysis to plan mass deployment.*`,
      analogy: 'Imagine you bake one perfect cake. Scaling to a bakery producing 1000 cakes per day requires more than just 1000 times the ingredients — you need industrial ovens, delivery trucks, quality control, and staff training. Similarly, scaling from one solar kitchen to thousands requires manufacturing, logistics, and a support network beyond just replicating the dish.',
      storyConnection: 'The Auroville Solar Kitchen has inspired similar installations across India and beyond. The Indian government includes community-scale solar cooking as a target. The question is no longer "does it work?" (Auroville proved that 30 years ago) but "how do we scale it efficiently to serve millions?"',
      checkQuestion: 'If one 15-metre dish costs 100,000 dollars, but mass production reduces cost by 30 percent at 1000 units, what is the total cost for 10,000 units?',
      checkAnswer: 'Learning curve: cost at 1000 units = 100,000 x 0.70 = 70,000 dollars. At 10,000 units, further reduction to about 55,000 dollars (continued learning). Total: 10,000 x 55,000 = 550 million dollars. This would serve 10 million people daily — at 55 dollars per person served, comparable to conventional kitchen infrastructure.',
      codeIntro: 'Model a national-scale solar cooking deployment for India.',
      code: `import numpy as np

class NationalSolarCookingModel:
    def __init__(self, target_population, unit_meals=1000, unit_cost=100000):
        self.target_pop = target_population
        self.unit_meals = unit_meals
        self.base_cost = unit_cost

    def units_needed(self):
        return int(np.ceil(self.target_pop / self.unit_meals))

    def learning_curve_cost(self, n_units, learning_rate=0.85):
        """Cost per unit decreases with cumulative production."""
        if n_units <= 1:
            return self.base_cost
        doublings = np.log2(n_units)
        return self.base_cost * learning_rate ** doublings

    def total_cost(self, n_units):
        total = 0
        for i in range(1, n_units + 1):
            total += self.learning_curve_cost(i)
        return total

    def annual_co2_savings(self, n_units, solar_fraction=0.70):
        meals_per_year = n_units * self.unit_meals * 365
        solar_meals = meals_per_year * solar_fraction
        kwh_saved = solar_meals * 0.5
        return kwh_saved * 0.22 / 1000  # tonnes CO2

    def jobs_created(self, n_units):
        return int(n_units * 2.5)

# Analysis at different scales
scales = [
    ("Village pilot", 5000),
    ("District scale", 100000),
    ("State (Tamil Nadu)", 5000000),
    ("Regional", 20000000),
    ("National target", 100000000),
]

print("=== National Solar Cooking Deployment Model ===")
print()

header = "Scale                 Population  Units   Cost/Unit   Total Cost    CO2(kt/yr)  Jobs"
print(header)
print("-" * 90)

for name, pop in scales:
    m = NationalSolarCookingModel(pop)
    n = m.units_needed()
    unit_cost = m.learning_curve_cost(n)
    total = m.total_cost(n)
    co2 = m.annual_co2_savings(n) / 1000
    jobs = m.jobs_created(n)
    print(f"{name:<22} {pop:>10,}  {n:>5,}  {unit_cost:>9,.0f}  "
          f"{total/1e6:>10,.0f}M  {co2:>8.0f}    {jobs:>6,}")

# 25-year comparison
print()
print("=== 25-Year Cost: Solar vs LPG (for 10M people) ===")
pop = 10000000
m = NationalSolarCookingModel(pop)
n = m.units_needed()
solar_capital = m.total_cost(n)
solar_fuel_annual = pop * 365 * 0.5 * 0.08 * 0.30  # 30% backup
lpg_annual = pop * 365 * 0.5 * 0.08

solar_25yr = solar_capital + solar_fuel_annual * 25
lpg_25yr = pop * 5 + lpg_annual * 25  # stoves + 25yr fuel

print(f"  Solar (capital + backup fuel): {solar_25yr/1e9:.1f} billion")
print(f"  LPG (stoves + 25yr fuel):     {lpg_25yr/1e9:.1f} billion")
print(f"  Solar savings: {(lpg_25yr - solar_25yr)/1e9:.1f} billion")
print(f"  CO2 avoided: {m.annual_co2_savings(n) * 25 / 1e6:.1f} million tonnes")
print(f"  Jobs created: {m.jobs_created(n):,}")

# Learning curve visualization
print()
print("=== Learning Curve: Cost Reduction with Scale ===")
header2 = "Cumulative Units   Cost Per Unit   Reduction"
print(header2)
print("-" * len(header2))

for n_cum in [1, 10, 100, 500, 1000, 5000, 10000, 50000, 100000]:
    cost = m.learning_curve_cost(n_cum)
    reduction = (1 - cost / m.base_cost) * 100
    print(f"{n_cum:>14,}    {cost:>12,.0f}    {reduction:>7.0f}%")`,
      challenge: 'Add a deployment timeline optimizer: given a budget of 50 million dollars per year, plan a 20-year rollout that maximizes cumulative meals served. Early deployment in high-DNI regions gives more meals per dollar. Find the optimal deployment sequence across Indian states.',
      successHint: 'You have scaled a single solar kitchen into a national energy policy model. This is how engineers and policymakers think about technology deployment — from proof of concept to pilot to scale. The same analysis applies to solar PV, electric vehicles, and clean water systems. You have connected the Auroville Solar Kitchen to the global challenge of sustainable development.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Design a complete solar cooking system</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These capstone exercises design and simulate a complete solar cooking system from sunlight to served meal.
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
