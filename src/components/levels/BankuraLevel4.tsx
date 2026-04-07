import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BankuraLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Kiln thermal model — simulating heat flow through the entire system',
      concept: `A complete kiln simulation must track heat flow through every component simultaneously: fuel combustion generates heat, convection and radiation transfer heat to the pottery, conduction moves heat through kiln walls (loss), and the pottery absorbs heat and rises in temperature.

This is a **coupled differential equation** system: dT_pottery/dt depends on the kiln gas temperature, which depends on fuel input and heat losses, which depend on wall temperature, which depends on everything else. We solve it numerically using Euler's method: advance each variable by a small time step, then use the updated values for the next step.

In the code below, you will build a complete thermal model of a Bankura kiln, tracking temperatures of the gas, pottery, walls, and exterior simultaneously.`,
      analogy: 'A kiln thermal model is like a weather simulation. The sun (fire) heats the ground (kiln floor), which heats the air (kiln gas), which rises (convection), and the heat gradually spreads to everything inside. Each part affects the others, and the simulation must track all of them simultaneously to be accurate.',
      storyConnection: 'Modern ceramics factories use computational kiln models to optimise firing schedules, saving 15-30% fuel. For Bankura potters, even a simple model could identify the optimal fuel feeding rate and damper settings — potentially saving hundreds of kilograms of wood per firing and improving product quality consistency.',
      checkQuestion: 'A kiln has gas at 900 C, pottery at 700 C, and walls at 800 C. In which direction does heat flow between each pair?',
      checkAnswer: 'Gas (900) to pottery (700): gas heats pottery. Gas (900) to walls (800): gas heats walls slightly. Walls (800) to pottery (700): walls heat pottery by radiation. Walls (800) to exterior: walls lose heat. Heat flows from hot to cold, always. The pottery is the coldest — it receives heat from all directions.',
      codeIntro: 'Build a complete multi-zone kiln thermal simulation.',
      code: `import numpy as np

class KilnSimulation:
    def __init__(self):
        # Kiln geometry
        self.vol = 2.0        # m3 internal volume
        self.wall_area = 10   # m2 total wall area
        self.wall_thick = 0.20  # m

        # Material properties
        self.wall_mass = 800    # kg
        self.wall_c = 880       # J/(kg*C)
        self.wall_k = 0.5       # W/(m*K)

        self.pot_mass = 50      # kg pottery
        self.pot_c = 900        # J/(kg*C)
        self.pot_area = 3.0     # m2 pottery surface

        self.gas_mass = 1.5     # kg (hot air in kiln)
        self.gas_c = 1100       # J/(kg*C)

        # Heat transfer coefficients
        self.h_gas_pot = 25     # W/(m2*K) convection
        self.h_gas_wall = 15    # W/(m2*K)
        self.h_wall_ext = 10    # W/(m2*K) external
        self.emissivity = 0.85
        self.sigma = 5.67e-8

    def radiation_flux(self, T1_C, T2_C, A):
        T1_K = T1_C + 273.15
        T2_K = T2_C + 273.15
        return self.emissivity * self.sigma * A * (T1_K**4 - T2_K**4)

    def simulate(self, fuel_profile, T_ambient=30, duration_h=36, dt_h=0.01):
        T_gas = T_ambient
        T_pot = T_ambient
        T_wall = T_ambient
        t = 0
        log = []

        while t < duration_h:
            # Fuel heat input
            fuel_kg_h = fuel_profile(t)
            Q_fuel = fuel_kg_h * 15000 * 1000 / 3600 * 0.12  # W (12% efficiency)

            # Gas-to-pottery: convection + radiation
            Q_gas_pot_conv = self.h_gas_pot * self.pot_area * (T_gas - T_pot)
            Q_gas_pot_rad = self.radiation_flux(T_gas, T_pot, self.pot_area) if T_gas > T_pot else 0
            Q_gas_pot = Q_gas_pot_conv + Q_gas_pot_rad

            # Gas-to-wall: convection
            Q_gas_wall = self.h_gas_wall * self.wall_area * (T_gas - T_wall)

            # Wall-to-pottery: radiation
            Q_wall_pot = self.radiation_flux(T_wall, T_pot, self.pot_area * 0.5) if T_wall > T_pot else 0

            # Wall to exterior: conduction + external convection
            Q_wall_ext = self.wall_k * self.wall_area * (T_wall - T_ambient) / self.wall_thick
            Q_ext_conv = self.h_wall_ext * self.wall_area * (T_wall - T_ambient) * 0.3

            # Temperature updates (Euler method)
            dt_s = dt_h * 3600
            dT_gas = (Q_fuel - Q_gas_pot - Q_gas_wall) / (self.gas_mass * self.gas_c) * dt_s
            dT_pot = (Q_gas_pot + Q_wall_pot) / (self.pot_mass * self.pot_c) * dt_s
            dT_wall = (Q_gas_wall - Q_wall_ext - Q_ext_conv - Q_wall_pot) / (self.wall_mass * self.wall_c) * dt_s

            T_gas += dT_gas
            T_pot += dT_pot
            T_wall += dT_wall

            T_gas = max(T_ambient, T_gas)
            T_pot = max(T_ambient, T_pot)
            T_wall = max(T_ambient, T_wall)

            if int(t / dt_h) % int(0.5 / dt_h) == 0:
                log.append({"t_h": t, "T_gas": T_gas, "T_pot": T_pot,
                           "T_wall": T_wall, "fuel": fuel_kg_h,
                           "Q_fuel_kW": Q_fuel/1000})

            t += dt_h

        return log

# Fuel profile for a Bankura firing
def bankura_fuel(t):
    if t < 3:
        return 3 + t * 2        # gradual start
    elif t < 6:
        return 9 + (t-3) * 2    # building heat
    elif t < 12:
        return 15                # full fire
    elif t < 14:
        return 15                # hold at peak
    elif t < 16:
        return 5                 # reducing/cooling
    else:
        return max(0, 3 - (t-16) * 0.2)  # dying fire

kiln = KilnSimulation()
log = kiln.simulate(bankura_fuel, duration_h=36)

print("=== Complete Kiln Thermal Simulation ===")
print(f"{'Hour':>5} {'Fuel':>6} {'T_gas':>8} {'T_pottery':>10} {'T_wall':>8} {'Q_in':>8}")
print(f"{'':>5} {'kg/h':>6} {'(C)':>8} {'(C)':>10} {'(C)':>8} {'(kW)':>8}")
print("-" * 48)

for l in log:
    if int(l["t_h"] * 2) % 2 == 0:
        print(f"{l['t_h']:>5.1f} {l['fuel']:>4.0f} {l['T_gas']:>6.0f} "
              f"{l['T_pot']:>8.0f} {l['T_wall']:>6.0f} {l['Q_fuel_kW']:>6.1f}")

# Key metrics
peak_pot = max(l["T_pot"] for l in log)
peak_gas = max(l["T_gas"] for l in log)
total_fuel = sum(bankura_fuel(l["t_h"]) * 0.5 for l in log)

print(f"\nPeak pottery temperature: {peak_pot:.0f} C")
print(f"Peak gas temperature:    {peak_gas:.0f} C")
print(f"Total fuel consumed: {total_fuel:.0f} kg wood")

# Lag analysis
for l in log:
    if l["T_pot"] >= peak_pot * 0.95:
        print(f"Pottery reaches 95% of peak at hour {l['t_h']:.1f}")
        break
for l in log:
    if l["T_gas"] >= peak_gas * 0.95:
        gas_peak_time = l["t_h"]
        break

print(f"Gas reaches 95% of peak at hour {gas_peak_time:.1f}")
print(f"Pottery lags gas by {l['t_h'] - gas_peak_time:.1f} hours — thermal inertia!")`,
      challenge: 'Double the pottery load from 50 kg to 100 kg. How does this affect peak pottery temperature and lag time? Does the kiln need more fuel or more time? This is why Bankura potters carefully calculate how much pottery to load — too much and the kiln cannot reach temperature.',
      successHint: 'Multi-zone thermal simulation is how every industrial furnace, kiln, and oven is designed. Steel reheating furnaces, glass annealing lehrs, and semiconductor diffusion furnaces all use the same coupled differential equation approach. You just built a simplified version of commercial kiln simulation software.',
    },
    {
      title: 'Firing schedule optimiser — minimising fuel while maximising quality',
      concept: `The optimal firing schedule minimises fuel consumption while ensuring: (1) pottery reaches target temperature, (2) ramp rates stay within safe limits for each phase, (3) adequate soak time at peak temperature, and (4) cooling rates do not cause cracking.

This is a **constrained optimisation** problem: minimise the objective function (total fuel) subject to constraints (temperature limits, ramp rates, soak time). We can solve it by parametrising the schedule (ramp rates and soak times as variables) and searching for the combination that uses the least fuel while meeting all constraints.`,
      analogy: 'Optimising a firing schedule is like planning the fastest route through a city with speed limits on each road. You want to minimise total travel time (fuel) while obeying the limits (ramp rates) and making required stops (soak times). Going too fast on any segment causes a penalty (cracked pottery).',
      storyConnection: 'Traditional Bankura firings use about 300-400 kg of wood per batch. With an optimised schedule, potters in nearby Khurja (UP) have reduced fuel by 25% using simple timing improvements. If Bankura potters could achieve similar savings, it would reduce both cost and deforestation pressure — a win for the artisan and the environment.',
      checkQuestion: 'A firing uses 350 kg of wood. If optimisation saves 20%, how much wood is saved? If wood costs Rs 5/kg, what is the saving per firing?',
      checkAnswer: 'Wood saved = 350 * 0.20 = 70 kg. Cost saving = 70 * 5 = Rs 350 per firing. With 100 firings per year, annual saving = Rs 35,000 — significant for a village potter earning Rs 2-3 lakh per year.',
      codeIntro: 'Build a firing schedule optimiser that finds the minimum-fuel schedule meeting all quality constraints.',
      code: `import numpy as np

# Firing schedule optimiser

def evaluate_schedule(ramp_rates, soak_time_h, peak_T):
    """
    Evaluate a firing schedule.
    ramp_rates: [rate_water, rate_quartz, rate_fast, rate_cool_slow, rate_cool_fast]
    """
    r_water, r_quartz, r_fast, r_cool_slow, r_cool_fast = ramp_rates

    # Phase durations
    t_water = 225 / max(r_water, 10)     # 25 to 250 C
    t_quartz = 100 / max(r_quartz, 10)   # 500 to 600 C
    t_mid = 250 / 80                      # 250 to 500 C (fixed moderate rate)
    t_fast = (peak_T - 600) / max(r_fast, 20)
    t_soak = soak_time_h
    t_cool_slow = 300 / max(abs(r_cool_slow), 10)  # 900 to 600
    t_cool_quartz = 100 / max(abs(r_quartz), 10)    # 600 to 500
    t_cool_fast = 450 / max(abs(r_cool_fast), 10)   # 500 to 50

    total_time = (t_water + t_mid + t_quartz + t_fast +
                  t_soak + t_cool_slow + t_cool_quartz + t_cool_fast)

    # Fuel consumption (proportional to time at high temperature)
    fuel_heating = (t_water * 5 + t_mid * 10 + t_quartz * 12 +
                   t_fast * 15)  # kg
    fuel_soak = t_soak * 12  # kg (maintaining temperature)
    fuel_cooling = t_cool_slow * 2  # some fuel during slow cool
    total_fuel = fuel_heating + fuel_soak + fuel_cooling

    # Quality penalties
    penalties = []
    if r_water > 80:
        penalties.append("Water smoking too fast (steam risk)")
    if r_quartz > 50:
        penalties.append("Quartz zone too fast (cracking risk)")
    if r_fast > 150:
        penalties.append("Fast ramp too aggressive")
    if abs(r_cool_slow) > 80:
        penalties.append("Initial cooling too fast")
    if soak_time_h < 1:
        penalties.append("Soak time too short (uneven heating)")

    return {
        "total_time": total_time,
        "total_fuel": total_fuel,
        "fuel_heating": fuel_heating,
        "fuel_soak": fuel_soak,
        "penalties": penalties,
        "feasible": len(penalties) == 0,
    }

# Search for optimal schedule
print("=== Firing Schedule Optimisation ===")
print(f"Target: 900 C peak temperature")
print()

# Grid search over key parameters
best_fuel = float('inf')
best_params = None
best_result = None

results = []

for r_water in [40, 50, 60, 70, 80]:
    for r_quartz in [20, 30, 40, 50]:
        for r_fast in [80, 100, 120, 150]:
            for soak in [1.0, 1.5, 2.0, 3.0]:
                for r_cool in [40, 60, 80]:
                    rates = [r_water, r_quartz, r_fast, r_cool, 100]
                    result = evaluate_schedule(rates, soak, 900)

                    if result["feasible"]:
                        results.append((rates, soak, result))
                        if result["total_fuel"] < best_fuel:
                            best_fuel = result["total_fuel"]
                            best_params = (rates, soak)
                            best_result = result

print(f"Explored {len(results)} feasible schedules")
print()

if best_result:
    rates, soak = best_params
    print("=== Optimal Schedule ===")
    print(f"Water smoking rate:  {rates[0]} C/h")
    print(f"Quartz zone rate:    {rates[1]} C/h")
    print(f"Fast ramp rate:      {rates[2]} C/h")
    print(f"Soak time:           {soak} hours")
    print(f"Initial cool rate:   {rates[3]} C/h")
    print(f"Total time:          {best_result['total_time']:.1f} hours")
    print(f"Total fuel:          {best_result['total_fuel']:.0f} kg wood")

# Compare with traditional schedule
print()
print("=== Traditional vs Optimised ===")
trad_rates = [50, 30, 80, 50, 80]
trad_soak = 3.0
trad_result = evaluate_schedule(trad_rates, trad_soak, 900)

print(f"{'Metric':<20} {'Traditional':>12} {'Optimised':>12} {'Savings':>10}")
print("-" * 56)
print(f"{'Total time (h)':<20} {trad_result['total_time']:>10.1f} {best_result['total_time']:>10.1f} "
      f"{(1-best_result['total_time']/trad_result['total_time'])*100:>8.0f}%")
print(f"{'Total fuel (kg)':<20} {trad_result['total_fuel']:>10.0f} {best_result['total_fuel']:>10.0f} "
      f"{(1-best_result['total_fuel']/trad_result['total_fuel'])*100:>8.0f}%")

fuel_saved = trad_result['total_fuel'] - best_result['total_fuel']
cost_saved = fuel_saved * 5
print(f"\nFuel saved per firing: {fuel_saved:.0f} kg")
print(f"Cost saved per firing: Rs {cost_saved:.0f}")
print(f"Annual savings (100 firings): Rs {cost_saved * 100:,.0f}")

# Top 5 schedules
print()
print("=== Top 5 Fuel-Efficient Feasible Schedules ===")
sorted_results = sorted(results, key=lambda x: x[2]["total_fuel"])[:5]
print(f"{'Rank':>4} {'Fuel (kg)':>10} {'Time (h)':>10} {'Water':>6} {'Quartz':>8} {'Fast':>6} {'Soak':>6}")
print("-" * 52)

for rank, (rates, soak, result) in enumerate(sorted_results, 1):
    print(f"{rank:>4} {result['total_fuel']:>8.0f} {result['total_time']:>8.1f} "
          f"{rates[0]:>4} {rates[1]:>6} {rates[2]:>4} {soak:>4.1f}")`,
      challenge: 'Add a "thick piece constraint": for pieces thicker than 5 cm, the maximum quartz zone rate drops to 25 C/h. Re-optimise. How much more fuel does a thick piece batch require compared to a thin piece batch? This is the quantitative reason why potters sort pieces by thickness before loading the kiln.',
      successHint: 'Constrained optimisation is one of the most widely used tools in engineering and business: airlines optimise flight schedules, factories optimise production lines, power plants optimise fuel mix, and financial firms optimise investment portfolios. The same mathematical framework applies to firing schedules, rocket trajectories, and chip fabrication.',
    },
    {
      title: 'Kiln efficiency analysis — where does all the fuel energy go?',
      concept: `A traditional Bankura kiln converts only **10-15%** of fuel energy into useful heating of pottery. The rest is lost to: exhaust gases (50-60%), kiln wall conduction (15-20%), radiation from the kiln surface (5-10%), and heat stored in the kiln structure that is wasted during cooling (10-15%).

Improving efficiency requires addressing the largest losses first. The **Sankey diagram** of energy flow shows that exhaust gas loss is the dominant factor — all that hot gas going up the chimney carries enormous energy. Heat recovery from exhaust (preheating incoming air) could save 20-30% of fuel.`,
      analogy: 'A traditional kiln is like a house in winter with all the windows open. The furnace (fire) runs full blast, but most of the heat escapes through the windows (chimney), walls (conduction), and cracks (radiation). Closing the windows (exhaust heat recovery) and insulating the walls save far more energy than turning up the furnace.',
      storyConnection: 'A collaborative project between IIT Kharagpur and Bankura potters in 2018 tested an improved kiln design with 10 cm of additional insulation and a simple exhaust heat recovery system (preheating incoming air). The modified kiln reduced fuel consumption by 35% and improved temperature uniformity, leading to fewer cracked pieces. The entire modification cost Rs 25,000 — paid back in 15 firings.',
      checkQuestion: 'A kiln uses 300 kg of wood (energy = 300 * 15 = 4,500 MJ). Only 500 MJ goes to heating pottery. What is the efficiency? Where does the other 4,000 MJ go?',
      checkAnswer: 'Efficiency = 500/4500 = 11.1%. The lost 4,000 MJ: about 2,500 MJ exits as hot exhaust gas, 750 MJ conducts through walls, 350 MJ radiates from the kiln surface, 400 MJ remains in the kiln structure after firing (wasted during cooling).',
      codeIntro: 'Build a complete energy audit of a Bankura kiln and identify the top improvement opportunities.',
      code: `import numpy as np

# Kiln energy audit and improvement analysis

class KilnEnergyAudit:
    def __init__(self, fuel_kg, fuel_energy_MJ_kg=15):
        self.fuel = fuel_kg
        self.fuel_e = fuel_energy_MJ_kg
        self.total_input = fuel_kg * fuel_energy_MJ_kg

    def calculate_losses(self, T_peak, T_ambient, firing_hours,
                        wall_area, wall_thick, wall_k,
                        chimney_flow_kg_h, exhaust_T,
                        pottery_mass, pottery_c):
        # Useful energy: heating pottery
        E_useful = pottery_mass * pottery_c * (T_peak - T_ambient) / 1e6  # MJ

        # Exhaust gas loss
        gas_c = 1100  # J/(kg*K)
        E_exhaust = chimney_flow_kg_h * firing_hours * gas_c * (exhaust_T - T_ambient) / 1e6

        # Wall conduction loss
        avg_dT = (T_peak * 0.6)  # average inside-outside difference
        E_wall = wall_k * wall_area * avg_dT / wall_thick * firing_hours * 3600 / 1e6

        # Radiation from exterior
        sigma = 5.67e-8
        T_ext = T_ambient + avg_dT * 0.2  # external wall temp
        E_rad = 0.8 * sigma * wall_area * ((T_ext+273)**4 - (T_ambient+273)**4) * firing_hours * 3600 / 1e6

        # Stored heat in kiln structure
        kiln_mass = 800  # kg walls
        E_stored = kiln_mass * 880 * (T_peak * 0.7 - T_ambient) / 1e6

        # Incomplete combustion
        E_incomplete = self.total_input * 0.05  # 5% unburnt fuel

        losses = {
            "Useful (pottery)": E_useful,
            "Exhaust gas": E_exhaust,
            "Wall conduction": E_wall,
            "Surface radiation": E_rad,
            "Stored in structure": E_stored,
            "Incomplete combustion": E_incomplete,
        }

        return losses

audit = KilnEnergyAudit(fuel_kg=300)

losses = audit.calculate_losses(
    T_peak=900, T_ambient=30, firing_hours=14,
    wall_area=10, wall_thick=0.20, wall_k=0.5,
    chimney_flow_kg_h=200, exhaust_T=600,
    pottery_mass=50, pottery_c=900,
)

print("=== Bankura Kiln Energy Audit ===")
print(f"Total fuel input: {audit.total_input:.0f} MJ ({audit.fuel} kg wood)")
print()
print(f"{'Energy Destination':<28} {'MJ':>8} {'%':>6}")
print("-" * 44)

total_accounted = sum(losses.values())
for name, E in sorted(losses.items(), key=lambda x: -x[1]):
    pct = E / audit.total_input * 100
    bar = "#" * int(pct / 2)
    print(f"{name:<28} {E:>6.0f} {pct:>4.0f}% {bar}")

unaccounted = audit.total_input - total_accounted
print(f"{'Unaccounted':<28} {unaccounted:>6.0f} {unaccounted/audit.total_input*100:>4.0f}%")
print(f"{'TOTAL':<28} {audit.total_input:>6.0f}")

efficiency = losses["Useful (pottery)"] / audit.total_input * 100
print(f"\nKiln efficiency: {efficiency:.1f}%")

# Improvement opportunities
print()
print("=== Improvement Opportunities ===")
improvements = [
    ("Add 10cm extra insulation", "Wall conduction", 0.50, 25000),
    ("Exhaust heat recovery", "Exhaust gas", 0.30, 40000),
    ("Better fuel (dry wood)", "Incomplete combustion", 0.60, 0),
    ("Kiln door seal improvement", "Exhaust gas", 0.05, 5000),
    ("Reflective inner coating", "Surface radiation", 0.40, 15000),
]

print(f"{'Improvement':<30} {'Saves':>8} {'Cost (Rs)':>10} {'Payback':>10}")
print("-" * 60)

fuel_cost_per_kg = 5  # Rs

for name, loss_type, reduction, cost in improvements:
    original_loss = losses.get(loss_type, 0)
    energy_saved = original_loss * reduction
    fuel_saved_kg = energy_saved / audit.fuel_e
    cost_saved_per_firing = fuel_saved_kg * fuel_cost_per_kg
    payback = cost / cost_saved_per_firing if cost_saved_per_firing > 0 else 0

    print(f"{name:<30} {fuel_saved_kg:>5.0f} kg {cost:>8,} "
          f"{payback:>7.0f} firings")

# Combined improvement
print()
print("=== Combined Improvement Analysis ===")
total_saved = 0
total_invest = 0
for name, loss_type, reduction, cost in improvements:
    original_loss = losses.get(loss_type, 0)
    saved = original_loss * reduction / audit.fuel_e
    total_saved += saved
    total_invest += cost

new_fuel = audit.fuel - total_saved
new_eff = losses["Useful (pottery)"] / (new_fuel * audit.fuel_e) * 100

print(f"Original fuel: {audit.fuel} kg/firing (efficiency: {efficiency:.1f}%)")
print(f"Improved fuel: {new_fuel:.0f} kg/firing (efficiency: {new_eff:.1f}%)")
print(f"Fuel saved: {total_saved:.0f} kg/firing ({total_saved/audit.fuel*100:.0f}%)")
print(f"Total investment: Rs {total_invest:,}")
print(f"Annual savings (100 firings): Rs {total_saved * fuel_cost_per_kg * 100:,.0f}")
print(f"Simple payback: {total_invest / (total_saved * fuel_cost_per_kg * 100):.1f} years")`,
      challenge: 'Calculate the CO2 emissions saved by the improvements. Wood combustion emits about 1.8 kg CO2 per kg of wood. If 500 Bankura kilns all adopt the improvements, what is the total annual CO2 reduction? Express in terms of equivalent car-kilometres avoided (a car emits about 0.2 kg CO2 per km).',
      successHint: 'Energy auditing is one of the most impactful applications of engineering. Industrial energy audits in India have identified 20-40% savings in factories, kilns, and furnaces — often with payback periods under 2 years. You just performed the same analysis that energy consultants charge lakhs of rupees for.',
    },
    {
      title: 'Quality prediction model — from clay to finished product',
      concept: `The final quality of a Bankura terracotta horse depends on a chain of factors: clay composition, forming technique, drying conditions, firing schedule, and kiln atmosphere. A **quality prediction model** takes all these inputs and predicts the outputs: colour, strength, porosity, and dimensional accuracy.

This is a form of **process modelling**: given the process parameters (inputs), predict the product properties (outputs). In manufacturing, such models enable: quality prediction before firing (reject defective pieces early), process optimisation (find the best parameters), and troubleshooting (if quality drops, identify the cause).

In the code below, you will build a complete quality prediction model and use it to optimise the Bankura firing process.`,
      analogy: 'A quality prediction model is like a recipe that predicts how the cake will taste based on ingredients and baking conditions. Too much sugar (iron oxide) = too sweet (too red). Too high temperature = burnt (over-fired). The model captures these relationships mathematically, letting you "bake" virtually before committing real ingredients.',
      storyConnection: 'A Bankura cooperative could use this model as a smartphone app: input the clay source, piece thickness, and target quality grade, and the app outputs the optimal firing schedule. This would democratise the master potter\'s expertise, allowing less experienced potters to achieve consistent quality — expanding the number of artisans who can produce export-grade work.',
      checkQuestion: 'A model predicts that firing Panchmura clay at 900 C for 2 hours in an oxidising atmosphere produces strength of 25 MPa, porosity of 12%, and colour "medium red." If the potter wants strength > 30 MPa, what should they change?',
      checkAnswer: 'Options: (1) Increase peak temperature to 950-1000 C (more sintering). (2) Increase soak time to 3-4 hours (more complete sintering). (3) Add flux mineral to the clay (promotes densification). Option 1 uses more fuel; option 2 uses more time but similar fuel; option 3 changes the clay recipe. The model helps choose the best option.',
      codeIntro: 'Build a complete quality prediction model for Bankura terracotta production.',
      code: `import numpy as np

# Quality prediction model for Bankura terracotta

class QualityPredictor:
    def __init__(self, clay_fe2o3, clay_al2o3, clay_flux, thickness_cm):
        self.fe = clay_fe2o3
        self.al = clay_al2o3
        self.flux = clay_flux
        self.thick = thickness_cm

    def predict(self, peak_T, soak_hours, ramp_rate_quartz, atmosphere, cooling_rate):
        """Predict all quality metrics from process parameters"""

        # Porosity: decreases with temperature and soak time
        porosity = 35 - 0.025 * peak_T - 2 * soak_hours - self.flux * 0.8
        porosity = max(2, min(35, porosity))

        # Strength: increases with temperature, soak, and lower porosity
        strength = 2 + 0.03 * peak_T + 5 * soak_hours - 0.5 * porosity + self.al * 0.3
        strength = max(2, min(60, strength))

        # Water absorption (closely tied to porosity)
        absorption = porosity * 0.7 + 1

        # Colour (depends on iron content and atmosphere)
        if atmosphere == "oxidising":
            if self.fe > 8:
                colour = "Dark red"
            elif self.fe > 5:
                colour = "Medium red"
            elif self.fe > 3:
                colour = "Light red"
            else:
                colour = "Buff"
        elif atmosphere == "reducing":
            colour = "Black/grey"
        else:
            colour = "Mottled"

        # Crack risk (depends on ramp rate vs thickness)
        safe_rate = 200 / self.thick  # thicker = slower needed
        crack_risk = min(1.0, (ramp_rate_quartz / safe_rate) ** 2)

        # Dimensional accuracy (shrinkage increases with temperature)
        shrinkage_pct = 1 + 0.01 * (peak_T - 600)

        # Grade assignment
        if crack_risk > 0.5:
            grade = "CRACKED"
        elif absorption < 5:
            grade = "Premium"
        elif absorption < 10:
            grade = "Grade A"
        elif absorption < 15:
            grade = "Grade B"
        elif absorption < 20:
            grade = "Grade C"
        else:
            grade = "Under-fired"

        return {
            "porosity": porosity, "strength": strength,
            "absorption": absorption, "colour": colour,
            "crack_risk": crack_risk, "shrinkage": shrinkage_pct,
            "grade": grade,
        }

# Predict for standard Bankura conditions
predictor = QualityPredictor(
    clay_fe2o3=7.0, clay_al2o3=25, clay_flux=3, thickness_cm=4
)

# Sweep peak temperature
print("=== Quality vs Peak Temperature ===")
print(f"Clay: Fe2O3={predictor.fe}%, Al2O3={predictor.al}%, Flux={predictor.flux}%")
print(f"Piece: {predictor.thick} cm thick | Soak: 2h | Oxidising")
print()
print(f"{'T (C)':>6} {'Porosity':>10} {'Strength':>10} {'Absorption':>12} {'Grade':<14}")
print("-" * 54)

for T in range(700, 1150, 50):
    q = predictor.predict(T, 2, 30, "oxidising", 60)
    print(f"{T:>6} {q['porosity']:>8.1f}% {q['strength']:>8.1f} MPa "
          f"{q['absorption']:>10.1f}% {q['grade']:<14}")

# Optimisation: find best parameters for Grade A at minimum fuel
print()
print("=== Optimise for Grade A at Minimum Cost ===")

best_cost = float('inf')
best_config = None

for T in range(800, 1100, 10):
    for soak in np.arange(0.5, 4.0, 0.5):
        q = predictor.predict(T, soak, 30, "oxidising", 60)
        if q["grade"] == "Grade A" and q["crack_risk"] < 0.3:
            # Estimate fuel cost (proportional to T and soak)
            fuel = T * 0.3 + soak * 12
            if fuel < best_cost:
                best_cost = fuel
                best_config = {"T": T, "soak": soak, "quality": q}

if best_config:
    print(f"Optimal: {best_config['T']} C, {best_config['soak']} h soak")
    q = best_config["quality"]
    print(f"Strength: {q['strength']:.0f} MPa | Absorption: {q['absorption']:.1f}%")
    print(f"Crack risk: {q['crack_risk']:.0%} | Grade: {q['grade']}")
    print(f"Fuel index: {best_cost:.0f}")

# Batch simulation: predict outcomes for a mixed load
print()
print("=== Batch Prediction (mixed piece sizes) ===")
np.random.seed(42)
batch = [
    ("Small horse (2cm)", 2, 7.0),
    ("Medium horse (4cm)", 4, 7.0),
    ("Large horse (6cm)", 6, 7.0),
    ("Plate (1cm)", 1, 7.0),
    ("Panel (8cm)", 8, 7.0),
]

T_firing = 900
soak = 2.0
ramp = 40  # C/h through quartz zone

print(f"Firing: {T_firing} C, {soak}h soak, {ramp} C/h quartz ramp")
print()
print(f"{'Piece':<22} {'Thick':>6} {'Grade':<10} {'Crack':>8} {'Strength':>10}")
print("-" * 58)

grades_ok = 0
for name, thick, fe in batch:
    pred = QualityPredictor(fe, 25, 3, thick)
    q = pred.predict(T_firing, soak, ramp, "oxidising", 60)
    if q["grade"] != "CRACKED":
        grades_ok += 1
    print(f"{name:<22} {thick:>4} cm {q['grade']:<10} {q['crack_risk']:>6.0%} "
          f"{q['strength']:>8.1f} MPa")

yield_pct = grades_ok / len(batch) * 100
print(f"\nBatch yield: {grades_ok}/{len(batch)} pieces OK ({yield_pct:.0f}%)")
print("The thick panel is at highest risk — consider a slower ramp rate.")`,
      challenge: 'The potter receives a rush order for 20 "Grade A" horses (4 cm thick) and 5 large panels (8 cm thick) in the same batch. Design a firing schedule that achieves Grade A for the horses while keeping crack risk below 20% for the panels. What compromise in ramp rate is needed? Does the longer firing time eat into the profit?',
      successHint: 'Quality prediction models are the backbone of modern manufacturing. Semiconductor fabs, pharmaceutical plants, food processing, and automotive factories all use similar models to predict product quality from process parameters. The ability to simulate before manufacturing — "virtual prototyping" — saves enormous time and resources. You just built this capability for Bankura terracotta.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Simulate complete firing schedule optimisation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises build a complete kiln simulation and quality prediction system for optimising Bankura terracotta production.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
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
