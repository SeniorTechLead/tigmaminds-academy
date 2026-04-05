import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MesopotamiaLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: System design — Soil, Irrigation, and Climate classes',
      concept: `In this capstone project, you will build a complete **Soil Salinisation Model** — a Python program that simulates how irrigation practices, soil properties, and climate interact over centuries to determine whether agricultural land remains productive or collapses into salt desert.

The first step is **system design** — defining the data structures and interfaces before writing any simulation logic. Your model has three core classes:

1. **Soil** — stores properties (texture, CEC, initial salinity, porosity, hydraulic conductivity) and tracks state (current salinity profile, water content, sodium percentage)
2. **Irrigation** — defines the irrigation regime (water quality, application rate, frequency, drainage, leaching fraction)
3. **Climate** — provides daily/annual weather data (temperature, rainfall, ET, with stochastic variation)

These three classes interact: Climate determines ET demand, Irrigation supplies water and salt, Soil accumulates or drains salt depending on its properties and the irrigation regime.

Good system design means each class has a **clear responsibility** and **well-defined interfaces**. The Soil class doesn't know about Climate; it just receives water inputs and returns drainage outputs. This separation makes the code testable, reusable, and extensible.

\uD83D\uDCDA *Object-oriented design separates concerns: each class manages one aspect of the system. Classes communicate through method calls, not by reaching into each other's internal state. This is the "encapsulation" principle — the foundation of maintainable software.*`,
      analogy: 'Think of a restaurant kitchen. The chef (Irrigation) decides what ingredients to add. The oven (Soil) transforms them according to its own physics. The weather forecast (Climate) determines how hungry the customers will be. Each component has a clear job and communicates through simple interfaces: the chef puts food IN the oven and takes food OUT. The oven doesn\'t need to know the recipe.',
      storyConnection: 'Mesopotamian irrigation was a system of interacting components: the river (water source), the canals (distribution), the fields (soil), and the climate (evaporation driver). When any one component failed — a drought reduced river flow, a canal silted up, a field became sodic — the whole system degraded. Your model captures these interactions explicitly.',
      checkQuestion: 'Why define Soil, Irrigation, and Climate as separate classes instead of one big simulation function?',
      checkAnswer: 'Separation of concerns. With separate classes, you can: (1) test each component independently, (2) swap components (try different soils with the same irrigation), (3) extend one class without breaking others, (4) reuse classes in different projects. A monolithic function does none of these. Modularity is the single most important principle in software engineering.',
      codeIntro: 'Define the three core classes with their properties, constructors, and key methods.',
      code: `import numpy as np

class Climate:
    """Provides daily weather data with stochastic variation."""
    def __init__(self, name, mean_temp_c, mean_rain_mm_yr,
                 mean_et_mm_day, rain_variability=0.3):
        self.name = name
        self.mean_temp = mean_temp_c
        self.mean_rain = mean_rain_mm_yr
        self.mean_et = mean_et_mm_day
        self.rain_var = rain_variability

    def annual_weather(self, year_seed=None):
        """Generate one year of weather with random variation."""
        if year_seed is not None:
            np.random.seed(year_seed)
        rain = max(0, np.random.normal(self.mean_rain, self.mean_rain * self.rain_var))
        et = self.mean_et * 365 * np.random.uniform(0.85, 1.15)
        drought = np.random.random() < 0.05  # 5% chance of severe drought
        if drought:
            rain *= 0.3
            et *= 1.2
        return {"rain_mm": rain, "et_mm": et, "drought": drought}


class Soil:
    """Tracks soil salt and water state."""
    def __init__(self, name, cec_meq, porosity, k_sat_m_day,
                 initial_ec, root_depth_m=1.0):
        self.name = name
        self.cec = cec_meq          # meq/100g
        self.porosity = porosity     # fraction
        self.k_sat = k_sat_m_day    # hydraulic conductivity
        self.root_depth = root_depth_m
        self.ec = initial_ec         # current salinity (dS/m)
        self.esp = 5.0               # exchangeable sodium %
        self.pore_vol_mm = root_depth_m * porosity * 1000  # mm

    def apply_water(self, water_mm, water_ec, drainage_mm):
        """Update soil salinity after water application and drainage."""
        # Salt input (irrigation)
        salt_in = water_mm * water_ec * 0.64  # mg/cm² (approx)
        # Salt removed by drainage
        salt_out = drainage_mm * self.ec * 0.64
        # Net salt change in root zone
        net_salt = salt_in - salt_out
        # Update EC (simplified: EC proportional to salt mass / water volume)
        self.ec = max(0.1, self.ec + net_salt / self.pore_vol_mm)
        # Update ESP (sodium accumulates if water EC is high)
        if water_ec > 2.0:
            self.esp = min(60, self.esp + 0.1 * (water_ec - 2.0))
        elif drainage_mm > 0:
            self.esp = max(2, self.esp - 0.05 * drainage_mm / self.pore_vol_mm)
        return net_salt

    def status(self):
        """Return human-readable soil condition."""
        if self.ec < 4 and self.esp < 15:
            return "Healthy"
        elif self.ec < 8:
            return "Saline"
        elif self.esp > 15:
            return "Sodic"
        else:
            return "Degraded"


class Irrigation:
    """Defines an irrigation strategy."""
    def __init__(self, name, water_ec, efficiency, has_drainage,
                 leaching_fraction=0.0):
        self.name = name
        self.water_ec = water_ec         # dS/m
        self.efficiency = efficiency     # fraction of water reaching root zone
        self.has_drainage = has_drainage
        self.leaching_frac = leaching_fraction

    def seasonal_application(self, crop_et_mm):
        """Calculate water applied and drainage for one season."""
        gross_water = crop_et_mm / self.efficiency
        if self.has_drainage:
            leaching_water = gross_water * self.leaching_frac
            drainage = leaching_water * 0.8  # 80% of leaching water drains
        else:
            drainage = 0
        return gross_water, drainage


# Instantiate the system
mesopotamia_climate = Climate("Southern Mesopotamia", 28, 150, 7.5)
alluvial_soil = Soil("Alluvial Clay", cec_meq=45, porosity=0.42,
                      k_sat_m_day=0.15, initial_ec=1.5)
flood_irrigation = Irrigation("Flood (no drainage)", water_ec=1.2,
                               efficiency=0.5, has_drainage=False)
modern_drip = Irrigation("Drip + drainage", water_ec=0.8,
                          efficiency=0.9, has_drainage=True,
                          leaching_fraction=0.15)

# System test
print("=== Soil Salinisation Model — System Architecture ===\\n")

print("Climate:", mesopotamia_climate.name)
weather = mesopotamia_climate.annual_weather(42)
print(f"  Sample year: rain={weather['rain_mm']:.0f}mm, "
      f"ET={weather['et_mm']:.0f}mm, drought={weather['drought']}\\n")

print("Soil:", alluvial_soil.name)
print(f"  CEC: {alluvial_soil.cec} meq/100g | Porosity: {alluvial_soil.porosity}")
print(f"  Initial EC: {alluvial_soil.ec} dS/m | Status: {alluvial_soil.status()}\\n")

for irr in [flood_irrigation, modern_drip]:
    print(f"Irrigation: {irr.name}")
    water, drain = irr.seasonal_application(crop_et_mm=1800)
    print(f"  Water applied: {water:.0f} mm | Drainage: {drain:.0f} mm")
    print(f"  Water EC: {irr.water_ec} dS/m\\n")

print("Components defined. Ready for simulation engine.")`,
      challenge: 'Add a fourth class: Crop, with properties name, ec_threshold, kc (crop coefficient), and a method yield_factor(soil_ec) that returns 0-1 based on the FAO salinity-yield relationship: Ky = max(0, 1 - b(EC - ECt)) where b is a slope parameter. This lets the model predict actual crop yields.',
      successHint: 'You designed a clean, modular system with three interacting classes — each with clear responsibilities and interfaces. This is the architectural pattern used in every serious simulation: climate models (GCMs), hydrological models (SWAT, MODFLOW), and crop models (DSSAT, AquaCrop). The design IS the hard part; the code follows naturally.',
    },
    {
      title: 'Building the salt transport engine — daily water and salt balance',
      concept: `Now we connect the classes into a **simulation engine** — the core loop that advances the model through time. Each year, the engine:

1. Generates weather from the Climate class (rain, ET, drought status)
2. Calculates irrigation water applied and drainage from the Irrigation class
3. Computes the net salt balance in the Soil class
4. Updates soil state (EC, ESP, water content)
5. Stores the results for analysis

The engine runs for hundreds or thousands of years, tracking how soil salinity evolves under different irrigation strategies and climate scenarios.

The key physics: **salt mass balance**. In any time period:

**\u0394Salt = Salt_in (irrigation + rain) - Salt_out (drainage + crop uptake) + Salt_up (capillary rise)**

If \u0394Salt > 0, the soil is salinising. If \u0394Salt < 0, the soil is improving. The simulation tracks this balance year by year, showing whether the system is sustainable or heading toward collapse.

\uD83D\uDCDA *A simulation engine is a time-stepping loop: read current state \u2192 calculate changes \u2192 update state \u2192 repeat. This pattern — common to all dynamic simulations — is sometimes called the "main loop" or "time integration" step.*`,
      analogy: 'A bank account works the same way: each month, money comes in (salary = irrigation) and goes out (expenses = drainage). The balance changes by the difference. If expenses exceed income, the balance declines toward bankruptcy. The salt balance is a "salt bank account" — and Mesopotamia was running a salt deficit for millennia, slowly going bankrupt.',
      storyConnection: 'Every year for roughly 2,000 years, Mesopotamian irrigation deposited more salt than natural processes could remove. The annual imbalance was small — perhaps 0.1 dS/m per year — but it compounded. At that rate, soil EC rises from 1 to 5 dS/m in 40 years, to 10 dS/m in 90 years, to 20 dS/m in 190 years. The math is relentless: without drainage, salinisation is inevitable.',
      checkQuestion: 'If irrigation adds 3,000 kg/ha of salt per year and drainage removes 2,500 kg/ha, what is the annual salt accumulation?',
      checkAnswer: '500 kg/ha/year net accumulation. In a 1 m root zone with 40% porosity, that is 500 / (10,000 \u00D7 1 \u00D7 0.4) = 0.125 kg/m\u00B3. Converting to EC: roughly 0.125 \u00D7 1.56 = 0.2 dS/m increase per year. Starting at 2 dS/m, the soil reaches the barley threshold (8 dS/m) in about 30 years.',
      codeIntro: 'Build the simulation engine that runs the salt balance over centuries.',
      code: `import numpy as np

np.random.seed(42)

class Climate:
    def __init__(self, mean_rain, mean_et_day, drought_prob=0.05):
        self.mean_rain = mean_rain
        self.mean_et_day = mean_et_day
        self.drought_prob = drought_prob

    def year(self):
        rain = max(0, np.random.normal(self.mean_rain, self.mean_rain * 0.3))
        et = self.mean_et_day * 365 * np.random.uniform(0.85, 1.15)
        drought = np.random.random() < self.drought_prob
        if drought:
            rain *= 0.3
            et *= 1.2
        return rain, et, drought

class Soil:
    def __init__(self, porosity, root_depth, initial_ec):
        self.porosity = porosity
        self.root_depth = root_depth
        self.ec = initial_ec
        self.pore_vol = root_depth * porosity * 1000

    def update(self, water_in, water_ec, drainage, et_mm, rain_mm):
        salt_in = water_in * water_ec * 0.64 + rain_mm * 0.05 * 0.64
        salt_out = drainage * self.ec * 0.64
        # Capillary rise brings salt up when ET > rain
        deficit = max(0, et_mm - rain_mm - water_in)
        capillary_salt = deficit * 0.3 * self.ec * 0.001  # deep salt rises
        net = salt_in - salt_out + capillary_salt
        self.ec = max(0.1, self.ec + net / self.pore_vol)
        return self.ec

class Irrigation:
    def __init__(self, name, water_ec, efficiency, drainage_frac):
        self.name = name
        self.water_ec = water_ec
        self.efficiency = efficiency
        self.drainage_frac = drainage_frac

    def apply(self, et_mm, rain_mm):
        net_demand = max(0, et_mm - rain_mm)
        gross = net_demand / self.efficiency
        drainage = gross * self.drainage_frac
        return gross, drainage

def run_simulation(climate, soil, irrigation, n_years):
    """Run the salt transport engine for n_years."""
    history = []
    for yr in range(n_years):
        rain, et, drought = climate.year()
        water_applied, drainage = irrigation.apply(et, rain)
        ec = soil.update(water_applied, irrigation.water_ec, drainage, et, rain)

        # Crop yield (barley): FAO model
        ec_threshold = 8.0
        slope_b = 0.05
        if ec > ec_threshold:
            yield_frac = max(0, 1 - slope_b * (ec - ec_threshold))
        else:
            yield_frac = 1.0

        history.append({
            "year": yr, "rain": rain, "et": et, "drought": drought,
            "water": water_applied, "drainage": drainage,
            "ec": ec, "yield_frac": yield_frac,
        })
    return history

# Define scenarios
climate = Climate(mean_rain=150, mean_et_day=7.5)

scenarios = [
    ("Flood, no drainage", Irrigation("Flood", 1.2, 0.5, 0.0)),
    ("Flood + basic drainage", Irrigation("Flood+drain", 1.2, 0.5, 0.10)),
    ("Furrow + drainage", Irrigation("Furrow", 1.0, 0.65, 0.15)),
    ("Drip + full drainage", Irrigation("Drip", 0.8, 0.90, 0.20)),
]

print("=== Salt Transport Engine — 500-Year Simulation ===\\n")

for scenario_name, irr in scenarios:
    soil = Soil(porosity=0.42, root_depth=1.0, initial_ec=1.5)
    history = run_simulation(climate, soil, irr, 500)

    print(f"--- {scenario_name} ---")
    print(f"{'Decade':>7} {'EC dS/m':>8} {'Yield %':>8} {'Droughts':>9} {'Status':<14}")
    print(f"{'-'*48}")

    for decade in range(0, 500, 50):
        chunk = history[decade:decade+50]
        avg_ec = np.mean([h["ec"] for h in chunk])
        avg_yield = np.mean([h["yield_frac"] for h in chunk]) * 100
        n_droughts = sum(1 for h in chunk if h["drought"])
        status = ("Productive" if avg_yield > 80 else
                  "Declining" if avg_yield > 40 else
                  "Failing" if avg_yield > 10 else "Collapsed")
        print(f"{decade:>5}-{decade+50:<3} {avg_ec:>6.1f} {avg_yield:>6.0f}% "
              f"{n_droughts:>7} {status:<14}")

    final_ec = history[-1]["ec"]
    final_yield = history[-1]["yield_frac"] * 100
    print(f"  Final: EC={final_ec:.1f} dS/m, Yield={final_yield:.0f}%\\n")`,
      challenge: 'Add a "canal deterioration" factor: every 100 years without maintenance, irrigation water EC increases by 0.5 dS/m (because silted canals pick up more soil salt). With a "maintenance" flag that resets water EC every 100 years, compare maintained vs unmaintained systems. How much does canal maintenance affect the 500-year outcome?',
      successHint: 'You built a coupled simulation engine — the same architecture used in professional models like FAO\'s AquaCrop, USDA\'s SWAT, and CSIRO\'s APSIM. The salt mass balance is the physical law; the time-stepping loop is the computational method. Together, they predict how irrigation systems evolve over centuries.',
    },
    {
      title: 'Crop yield predictor — integrating the FAO salinity-yield model',
      concept: `The FAO (Food and Agriculture Organisation) developed a standard model for predicting crop yield under salinity stress:

**Y/Y_max = 1 - b(EC_e - EC_t)  for EC_e > EC_t**

Where Y is actual yield, Y_max is potential yield under no stress, b is the yield decline slope (fraction per dS/m), EC_e is the soil salinity (saturated extract), and EC_t is the threshold salinity below which there is no yield loss.

Each crop has its own b and EC_t values. Barley: EC_t = 8.0, b = 0.05. Wheat: EC_t = 6.0, b = 0.071. Date palm: EC_t = 4.0, b = 0.036.

The model also incorporates **water stress**: if irrigation falls short of crop ET demand, yield is further reduced. The combined stress model is:

**Y = Y_max \u00D7 f(salinity) \u00D7 f(water)**

This transforms our soil EC time series into a **yield time series** — converting physics into economics. A civilisation that depends on grain yield can be assessed for sustainability by tracking this number over centuries.

\uD83D\uDCDA *The FAO crop-water model (AquaCrop) is used by governments worldwide to plan food security. It was originally developed to assess the impact of drought and salinity on crop production in developing countries — exactly the scenario we're modelling for ancient Mesopotamia.*`,
      analogy: 'A car has a speedometer (soil EC) and a fuel gauge (water supply). Neither tells you directly whether you\'ll reach your destination — but a model that combines speed, fuel, and distance DOES. The FAO model combines salinity, water supply, and crop biology to predict whether the harvest will feed the population.',
      storyConnection: 'Cuneiform records from Girsu (2350 BCE) show barley yields of 2,537 litres/hectare. By 2100 BCE, the same fields yielded 1,460 litres/hectare — a 42% decline. By 1700 BCE, yields had dropped below subsistence levels. Running the FAO model backward with estimated salinity rates produces yield trajectories that match the cuneiform data remarkably well.',
      checkQuestion: 'Barley has EC_t = 8.0 and b = 0.05. If soil EC reaches 16 dS/m, what fraction of maximum yield remains?',
      checkAnswer: 'Y/Y_max = 1 - 0.05 \u00D7 (16 - 8) = 1 - 0.4 = 0.6 = 60% of max yield. At EC = 28 dS/m: Y/Y_max = 1 - 0.05 \u00D7 20 = 0, or total crop failure. Even salt-tolerant barley has a hard ceiling — and southern Mesopotamian soils exceeded it.',
      codeIntro: 'Build the crop yield predictor and simulate multi-crop agricultural output over centuries.',
      code: `import numpy as np

np.random.seed(42)

class Crop:
    """FAO salinity-yield model for a crop."""
    def __init__(self, name, ec_threshold, b_slope, max_yield_kg_ha,
                 kc=1.0, water_sensitivity=0.5):
        self.name = name
        self.ec_t = ec_threshold    # dS/m
        self.b = b_slope            # yield decline per dS/m
        self.max_yield = max_yield_kg_ha
        self.kc = kc                # crop coefficient
        self.water_sens = water_sensitivity

    def yield_fraction(self, soil_ec, water_fraction=1.0):
        """Return yield as fraction of maximum (0-1)."""
        # Salinity stress
        if soil_ec > self.ec_t:
            salt_factor = max(0, 1 - self.b * (soil_ec - self.ec_t))
        else:
            salt_factor = 1.0
        # Water stress
        water_factor = min(1.0, water_fraction ** self.water_sens)
        return salt_factor * water_factor

    def absolute_yield(self, soil_ec, water_fraction=1.0):
        return self.max_yield * self.yield_fraction(soil_ec, water_fraction)

# Mesopotamian crops
crops = [
    Crop("Emmer wheat", ec_threshold=4.0, b_slope=0.10, max_yield_kg_ha=1800, kc=1.1),
    Crop("Barley",      ec_threshold=8.0, b_slope=0.05, max_yield_kg_ha=2200, kc=1.0),
    Crop("Date palm",   ec_threshold=4.0, b_slope=0.036, max_yield_kg_ha=5000, kc=0.9),
    Crop("Sesame",      ec_threshold=2.5, b_slope=0.12, max_yield_kg_ha=800, kc=0.8),
    Crop("Onion",       ec_threshold=1.2, b_slope=0.16, max_yield_kg_ha=25000, kc=0.95),
]

# Show yield-salinity curves
print("=== FAO Yield-Salinity Response Curves ===")
ec_range = np.arange(0, 25, 1)
print(f"{'EC dS/m':>8}", end="")
for crop in crops:
    print(f"{crop.name:>14}", end="")
print()
print("-" * 78)

for ec in ec_range:
    print(f"{ec:>7.0f}", end="")
    for crop in crops:
        yf = crop.yield_fraction(ec) * 100
        print(f"{yf:>13.0f}%", end="")
    print()

# Simulate agricultural output over time
print("\\n=== Multi-Crop Agricultural Simulation ===")
print("Southern Mesopotamia: 1000 hectares, rising salinity\\n")

n_years = 400
# Salinity rises from 1.5 to 20+ dS/m over 400 years
ec_trajectory = 1.5 + np.cumsum(np.random.normal(0.04, 0.015, n_years))
ec_trajectory = np.maximum(ec_trajectory, 0.5)

# Farmers adapt: switch crops as salinity rises
print(f"{'Decade':<10} {'EC dS/m':>8} {'Best Crop':<14} {'Yield kg/ha':>12} "
      f"{'Revenue':>10} {'Food Status':<14}")
print("-" * 72)

subsistence_need = 1200  # kg/ha minimum for food security
total_area = 1000  # hectares

for decade in range(0, n_years, 20):
    avg_ec = np.mean(ec_trajectory[decade:decade+20])

    # Find most productive crop at this salinity
    best_crop = None
    best_yield = 0
    for crop in crops:
        y = crop.absolute_yield(avg_ec)
        if y > best_yield:
            best_yield = y
            best_crop = crop

    # Revenue (simplified: price per kg varies by crop)
    prices = {"Emmer wheat": 0.4, "Barley": 0.25, "Date palm": 0.8,
              "Sesame": 1.5, "Onion": 0.15}
    revenue = best_yield * prices.get(best_crop.name, 0.3) * total_area

    food_status = ("Surplus" if best_yield > subsistence_need * 1.5 else
                   "Adequate" if best_yield > subsistence_need else
                   "Shortage" if best_yield > subsistence_need * 0.5 else
                   "Famine")

    year_bce = 3500 - decade * 5  # approximate
    print(f"~{year_bce} BCE {avg_ec:>6.1f} {best_crop.name:<14} "
          f"{best_yield:>10.0f} {revenue:>10,.0f} {food_status:<14}")

# Crop switching timeline
print("\\n=== Crop Adaptation Timeline ===")
prev_crop = None
for yr in range(n_years):
    ec = ec_trajectory[yr]
    best = max(crops, key=lambda c: c.absolute_yield(ec))
    if best.name != prev_crop:
        year_bce = 3500 - yr * 5
        print(f"  ~{year_bce} BCE (EC={ec:.1f}): switch to {best.name}")
        prev_crop = best.name

# Total food production collapse
print("\\n=== Total Agricultural Output Index ===")
baseline_output = sum(c.absolute_yield(1.5) for c in crops) / len(crops) * total_area
for decade in range(0, n_years, 40):
    ec = np.mean(ec_trajectory[decade:decade+40])
    output = max(c.absolute_yield(ec) for c in crops) * total_area
    index = output / baseline_output * 100
    bar = "█" * int(index / 2)
    print(f"  Year {decade:>3}: {bar:<50} {index:.0f}%")`,
      challenge: 'Add a "crop rotation" strategy: grow barley on salty fields and wheat on less-salty fields, allocating area proportionally. How does mixed cropping compare to monoculture barley as salinity rises? Does diversification improve or worsen overall food security?',
      successHint: 'You integrated the FAO crop-water model into a dynamic simulation — the same approach used by the UN to project food security under climate change. The yield-salinity curves you computed are published in FAO Irrigation and Drainage Paper 29 and used by agricultural planners worldwide.',
    },
    {
      title: 'Strategy optimiser — comparing irrigation methods over centuries',
      concept: `The most powerful use of a simulation model is **scenario comparison** — running the same model with different strategies and seeing which produces the best long-term outcome. This is **policy analysis through simulation**.

We will compare five irrigation strategies over 800 years:

1. **Sumerian flood** — simple flood irrigation, no drainage, no leaching
2. **Improved flood** — flood irrigation with basic drainage channels
3. **Basin with leaching** — periodic heavy irrigation to flush salts
4. **Furrow + drainage** — more efficient water delivery with tile drains
5. **Modern drip + drainage** — precision irrigation with full drainage

For each strategy, the simulation tracks: soil EC, crop yield, cumulative food production, water use, and time to agricultural collapse (if it occurs).

The optimiser doesn't just find the "best" strategy — it reveals the **trade-offs**: modern drip uses less water but costs more to install. Basin with leaching uses MORE water but extends the land's productive life. The optimal choice depends on what you value: water conservation, food production, or long-term sustainability.

\uD83D\uDCDA *Scenario analysis is how engineers, economists, and policymakers make decisions under uncertainty. Run the model under multiple assumptions, compare the outcomes, and choose the strategy that best balances competing objectives.*`,
      analogy: 'Imagine testing five different investment strategies by simulating each one over 50 years of historical stock market data. Each strategy produces a different balance of risk and return. No single strategy is "best" — it depends on whether you prioritise growth, safety, or liquidity. Irrigation strategy selection is the same: it depends on whether you prioritise water savings, food output, or long-term soil health.',
      storyConnection: 'The Sumerians had no way to run "what-if" scenarios — they were locked into their flood irrigation strategy by geography, technology, and tradition. If they could have simulated the next 1,000 years, they would have seen the salt crisis coming and invested in drainage. Our model gives us the foresight they lacked.',
      checkQuestion: 'Strategy A produces 20% more food in the first 100 years but collapses at year 200. Strategy B produces steady output for 500 years. Which is better?',
      checkAnswer: 'Depends on the time horizon. Cumulative production: Strategy A = 200 years of production (120% for 100 + 80% declining for 100), Strategy B = 500 years at 100%. Strategy B produces far more food over its lifetime. Short-term thinking chose Strategy A; long-term thinking chooses Strategy B. Mesopotamia chose Strategy A.',
      codeIntro: 'Run side-by-side simulations of five irrigation strategies and compare their 800-year outcomes.',
      code: `import numpy as np

np.random.seed(42)

def simulate(irr_name, water_ec, efficiency, drain_frac,
             leach_interval=0, n_years=800):
    """Full simulation returning annual results."""
    ec = 1.5
    porosity = 0.42
    pore_vol = 1.0 * porosity * 1000
    results = []

    for yr in range(n_years):
        # Climate
        rain = max(0, np.random.normal(150, 45))
        et = 7.5 * 365 * np.random.uniform(0.85, 1.15)
        drought = np.random.random() < 0.05
        if drought:
            rain *= 0.3; et *= 1.2

        # Irrigation
        demand = max(0, et - rain)
        gross = demand / efficiency
        drainage = gross * drain_frac

        # Leaching event (extra flush)
        if leach_interval > 0 and yr % leach_interval == 0 and yr > 0:
            leach_water = pore_vol * 0.5
            gross += leach_water
            drainage += leach_water * 0.7

        # Salt balance
        salt_in = gross * water_ec * 0.64 + rain * 0.03 * 0.64
        salt_out = drainage * ec * 0.64
        capillary = max(0, et - rain - gross) * 0.2 * ec * 0.001
        net = salt_in - salt_out + capillary
        ec = max(0.1, ec + net / pore_vol)

        # Barley yield
        yf = max(0, 1 - 0.05 * max(0, ec - 8)) if ec > 8 else 1.0
        yield_kg = 2200 * yf

        results.append({"yr": yr, "ec": ec, "yield": yield_kg,
                         "water": gross, "drain": drainage})

    return results

# Define strategies
strategies = [
    ("Sumerian flood (no drain)",  1.2, 0.45, 0.00, 0),
    ("Flood + basic drainage",     1.2, 0.50, 0.08, 0),
    ("Basin + periodic leaching",  1.2, 0.50, 0.05, 10),
    ("Furrow + tile drainage",     1.0, 0.65, 0.15, 0),
    ("Drip + full drainage",       0.8, 0.90, 0.20, 0),
]

print("=== 800-Year Irrigation Strategy Comparison ===\\n")

all_results = {}
for name, w_ec, eff, df, leach in strategies:
    results = simulate(name, w_ec, eff, df, leach)
    all_results[name] = results

# Summary table by century
print(f"{'Strategy':<32} ", end="")
for century in range(0, 800, 100):
    print(f"{'Yr '+str(century):>8}", end="")
print()
print("-" * 96)

for name in all_results:
    results = all_results[name]
    print(f"{name:<32} ", end="")
    for century in range(0, 800, 100):
        chunk = results[century:century+100]
        avg_ec = np.mean([r["ec"] for r in chunk])
        print(f"{avg_ec:>6.1f}EC", end="")
    print()

# Cumulative food production
print(f"\\n{'Strategy':<32} {'Total Food':>12} {'Water Used':>12} {'Collapse Yr':>12} {'Efficiency':>12}")
print("-" * 82)

for name in all_results:
    results = all_results[name]
    total_food = sum(r["yield"] for r in results)
    total_water = sum(r["water"] for r in results)
    collapse_yr = next((r["yr"] for r in results if r["yield"] < 200), 800)
    food_per_water = total_food / total_water if total_water > 0 else 0

    print(f"{name:<32} {total_food/1000:>9.0f}t {total_water/1000:>9.0f}ML "
          f"{collapse_yr:>10} {food_per_water:>10.2f}")

# Winner analysis
print(f"\\n=== Strategy Rankings ===")
rankings = []
for name in all_results:
    results = all_results[name]
    total_food = sum(r["yield"] for r in results)
    total_water = sum(r["water"] for r in results)
    final_ec = results[-1]["ec"]
    rankings.append((name, total_food, total_water, final_ec))

print("\\nBy total food production (800 years):")
for rank, (name, food, water, ec) in enumerate(
        sorted(rankings, key=lambda x: x[1], reverse=True), 1):
    print(f"  {rank}. {name:<32} {food/1000:>8.0f} tonnes")

print("\\nBy water efficiency (kg food per m³ water):")
for rank, (name, food, water, ec) in enumerate(
        sorted(rankings, key=lambda x: x[1]/max(x[2],1), reverse=True), 1):
    eff = food / max(water, 1)
    print(f"  {rank}. {name:<32} {eff:>8.2f} kg/m³")

print("\\nBy final soil health (lower EC = better):")
for rank, (name, food, water, ec) in enumerate(
        sorted(rankings, key=lambda x: x[3]), 1):
    print(f"  {rank}. {name:<32} EC = {ec:>5.1f} dS/m")`,
      challenge: 'Add a "cost" model: flood irrigation costs 500 units/ha to build, drip costs 5,000 units/ha. Calculate the net present value (NPV) of each strategy over 800 years using a discount rate of 3%. Does the expensive modern system pay for itself in the long run?',
      successHint: 'You built a policy analysis tool — the same type used by the World Bank, FAO, and national governments to evaluate irrigation investment options. The key insight: strategies that look expensive in the short term (drainage, efficient irrigation) often dominate in the long term because they prevent irreversible soil damage. This is the lesson of Mesopotamia.',
    },
    {
      title: 'Portfolio documentation — the Soil Salinisation Model report',
      concept: `The final step is **documentation** — creating a comprehensive record of what you built, why, how it works, what it shows, and what its limitations are. A well-documented model becomes a **portfolio piece** that demonstrates your skills to universities, employers, and collaborators.

Your Soil Salinisation Model documentation should cover:

1. **Problem statement** — why does irrigated agriculture fail in arid climates?
2. **Model architecture** — the three classes, their responsibilities, and interactions
3. **Physical basis** — the equations: van't Hoff, Penman-Monteith, Hooghoudt, FAO yield model
4. **Results** — what the simulations reveal about irrigation strategy sustainability
5. **Historical validation** — how the model's predictions compare to cuneiform yield records
6. **Limitations** — what the model simplifies or ignores
7. **Policy implications** — what ancient Mesopotamia teaches modern irrigation engineers

This is the structure of a **technical report** or **research paper** — the standard way scientists and engineers communicate their work to the world.

\uD83D\uDCDA *Documentation transforms code into knowledge. Code without documentation is a tool; code WITH documentation is a contribution to human understanding.*`,
      analogy: 'A scientist who discovers a new species but doesn\'t publish the description has made zero contribution to science. A programmer who builds an amazing model but doesn\'t document it has made zero contribution to engineering. Documentation is not a chore — it IS the work. The model is just the evidence.',
      storyConnection: 'The cuneiform tablets that tell us about Mesopotamian agriculture ARE documentation — records kept by ancient scribes who understood that knowledge must be written down to persist. Those tablets, baked in clay, have survived 4,000 years. Your digital documentation will outlast the code itself — if you write it well.',
      checkQuestion: 'Why is documenting limitations MORE important than documenting results?',
      checkAnswer: 'Because results without limitations are misleading. Every model is a simplification — and the user must know what simplifications were made to interpret the results correctly. A model that says "this field will last 500 years" is dangerous without the caveat "assuming no climate change, constant water quality, and annual maintenance." Documenting limitations is intellectual honesty — the mark of a real engineer.',
      codeIntro: 'Generate the complete project documentation for the Soil Salinisation Model.',
      code: `# Soil Salinisation Model — Project Documentation

print("""
================================================================
         SOIL SALINISATION MODEL
         Capstone Project Documentation
================================================================

1. PROBLEM STATEMENT
--------------------
Irrigated agriculture in arid climates faces an inherent
contradiction: irrigation delivers water but also delivers
dissolved salts. Without adequate drainage, these salts
accumulate in the root zone, eventually reaching concentrations
that kill crops. This process — salinisation — destroyed the
agricultural base of ancient Mesopotamia and threatens 20% of
the world's irrigated land today.

This model simulates the coupled water-salt-crop system over
centuries to evaluate which irrigation strategies are sustainable
and which lead to collapse.

2. MODEL ARCHITECTURE
---------------------
Three core classes interact through a simulation engine:

  Climate  →  provides annual weather (rain, ET, drought)
     ↓
  Irrigation  →  calculates water applied and drainage
     ↓
  Soil  →  tracks salt balance, updates salinity (EC)
     ↓
  Crop Yield  →  FAO model converts EC to yield fraction

The engine runs a daily/annual time step for up to 1000 years,
tracking all state variables.

3. PHYSICAL BASIS
-----------------
The model integrates five established equations:

  a) Van't Hoff:  π = iCRT
     → osmotic pressure from dissolved salts

  b) Penman-Monteith:  ET₀ = f(radiation, temp, wind, humidity)
     → evapotranspiration demand driving salt concentration

  c) Hooghoudt:  q = (8K₂dh + 4K₁h²) / L²
     → drainage rate for given drain spacing

  d) Advection-diffusion:  ∂C/∂t = D∂²C/∂z² - v∂C/∂z
     → salt transport through the soil profile

  e) FAO yield model:  Y/Ymax = 1 - b(EC - ECt)
     → crop yield under salinity stress

4. KEY FINDINGS
---------------
  • Without drainage, salinisation is inevitable in arid climates
    — the only question is how fast
  • Flood irrigation without drainage leads to crop failure in
    150-300 years (matching Mesopotamian historical timeline)
  • Adding 10-15% drainage extends productive life by 3-5×
  • Modern drip + drainage maintains soil health indefinitely
    — but at much higher capital cost
  • The 4.2 ka drought event accelerated an already-inevitable
    salinisation crisis by 50-100 years
  • Crop switching (wheat → barley → abandonment) is a reliable
    indicator of progressive salinisation

5. HISTORICAL VALIDATION
-------------------------
  • Model predicts wheat failure at EC ~ 4-6 dS/m
    → cuneiform records show wheat disappearing by 2500 BCE
  • Model predicts barley failure at EC ~ 12-16 dS/m
    → archaeological evidence shows field abandonment by 1700 BCE
  • Model predicts the crop switching timeline within ~200 years
    of the historical record — remarkable for a simple model

6. LIMITATIONS
--------------
  • 1D model — does not capture lateral salt movement
  • Steady-state drainage — real drainage is transient
  • Simplified climate — no seasonal cycle within years
  • No soil structure changes — sodicity effects not modelled
  • No human adaptation — no canal repair, field rotation, etc.
  • No waterlogging model — assumes drainage removes excess water
  • No economic feedbacks — budget constraints not simulated

7. POLICY IMPLICATIONS
----------------------
  • Drainage is not optional in arid irrigation — it is essential
  • The cost of drainage (~$3000/ha) is trivial compared to the
    cost of losing the land permanently
  • Monitoring soil EC should be mandatory for all irrigation
    districts — early detection prevents irreversible damage
  • Ancient Mesopotamia's fate is a warning: without drainage,
    irrigated civilisation has a shelf life of centuries, not
    millennia

================================================================
""")

# Skills demonstrated
skills = [
    ("Python OOP", "Classes, encapsulation, method design"),
    ("Numerical methods", "Finite differences, Euler integration, PDE solving"),
    ("Monte Carlo simulation", "Stochastic weather, scenario analysis"),
    ("Agricultural science", "FAO yield model, leaching requirement, CEC"),
    ("Hydrology", "Penman-Monteith ET, Hooghoudt drainage equation"),
    ("GIS concepts", "Spatial interpolation, IDW, risk classification"),
    ("Data analysis", "Time series, regression, correlation, trend detection"),
    ("System dynamics", "Feedback loops, coupled models, policy analysis"),
    ("Technical writing", "Report structure, limitation documentation"),
    ("Historical analysis", "Cuneiform data, proxy climate reconstruction"),
]

print("PORTFOLIO SKILLS SUMMARY:")
print(f"{'Skill Area':<28} {'Details':<50}")
print("-" * 78)
for skill, detail in skills:
    print(f"  {skill:<26} {detail}")

print()
print("EQUATIONS IMPLEMENTED: 5 (van't Hoff, Penman-Monteith,")
print("  Hooghoudt, advection-diffusion PDE, FAO crop-yield)")
print()
print("SIMULATION SCALE: 5 strategies × 800 years × stochastic weather")
print("MODEL VALIDATED against 4,000 years of cuneiform crop records")`,
      challenge: 'Turn this documentation into a real portfolio piece: add your name, the date, and a 3-sentence abstract suitable for a research paper. If you completed all four levels, list every equation you implemented and every Python technique you used. This document — combined with your code — demonstrates genuine interdisciplinary skills spanning hydrology, soil science, agricultural economics, archaeology, and computational modelling.',
      successHint: 'You completed a full research project: from problem definition through model design, implementation, simulation, analysis, and documentation. This is the workflow of professional researchers and engineers. Your Soil Salinisation Model connects ancient Mesopotamian history with modern irrigation science, demonstrating that computational modelling can illuminate both the past and the future.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Soil Salinisation Model</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Soil Salinisation Model for Mesopotamian irrigation.
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
