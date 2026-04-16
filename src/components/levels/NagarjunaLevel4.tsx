import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NagarjunaLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Build a hydroelectric plant simulator — reservoir to grid',
      concept: `In this capstone, you will build a complete **hydroelectric plant simulator** that models the entire chain: reservoir inflow, water level, penstock flow, turbine power, generator output, and grid delivery. The simulator tracks reservoir storage over a year, accounting for monsoon inflows, irrigation withdrawals, evaporation, and power generation.

The core model is a **mass balance**: dV/dt = inflow - outflow - evaporation. The water level determines the available head, which determines the power output. This creates a feedback loop: generating more power lowers the reservoir, which reduces the head, which reduces the power per unit flow.

Real plant operators face optimization decisions every hour: how much water to release for power (maximizing revenue) vs how much to save for future use (managing drought risk) vs how much to release for irrigation (legal obligations). Your simulator will let you explore these tradeoffs.

📚 *Mass balance: the change in stored volume equals inflows minus outflows. This is conservation of mass applied to the reservoir. Combined with the power equation, it forms a coupled system that must be solved step by step over time.*`,
      analogy: 'Think of a bathtub with the tap running (inflow) and the drain open (outflow). The water level depends on the balance between the two. If the tap provides more than the drain takes, the level rises. If you also scoop water out for other uses (irrigation), the level drops faster. Your simulator is a sophisticated bathtub calculator.',
      storyConnection: 'Nagarjuna Sagar operators must balance power generation against irrigation needs for over 1 million hectares of farmland. During drought years, the reservoir may drop to dangerous levels, forcing power cuts. During floods, they must release water through spillways to prevent overtopping. Your simulator captures these real-world dynamics.',
      checkQuestion: 'A reservoir has 10 km^3 of water. Monthly inflow is 1.5 km^3 and outflow (power + irrigation) is 1.8 km^3. Evaporation is 0.1 km^3/month. What is the storage after 3 months?',
      checkAnswer: 'Monthly change: 1.5 - 1.8 - 0.1 = -0.4 km^3/month. After 3 months: 10 + 3*(-0.4) = 10 - 1.2 = 8.8 km^3.',
      codeIntro: 'Build a yearly hydroelectric plant simulator with reservoir dynamics and power output.',
      code: `import numpy as np

class HydroPlantSimulator:
    """Simulate a hydroelectric plant over one year."""

    def __init__(self, dam_height=124, max_volume_km3=11.5,
                 n_turbines=8, turbine_mw=102, rated_head=100,
                 rated_flow=800):
        self.dam_height = dam_height
        self.max_vol = max_volume_km3
        self.n_turbines = n_turbines
        self.turbine_mw = turbine_mw
        self.rated_head = rated_head
        self.rated_flow = rated_flow
        self.rho = 1000
        self.g = 9.81
        self.eta = 0.90

    def volume_to_level(self, volume_km3):
        """Convert volume to water level (simplified linear)."""
        fraction = volume_km3 / self.max_vol
        return self.dam_height * fraction ** 0.6  # nonlinear (valley shape)

    def level_to_head(self, level):
        """Net head from water level."""
        tailwater = 24  # m above sea level
        return max(0, level - tailwater) * 0.97  # 3% friction loss

    def power_output(self, head, flow):
        """Electrical power output in MW."""
        if head <= 0 or flow <= 0:
            return 0
        P = self.rho * flow * self.g * head * self.eta / 1e6
        return min(P, self.n_turbines * self.turbine_mw)

    def simulate_year(self, initial_volume, monthly_inflows,
                      monthly_irrigation, power_flow_fraction=0.7):
        """Simulate 12 months of operation."""
        volume = initial_volume
        results = []

        for month in range(12):
            level = self.volume_to_level(volume)
            head = self.level_to_head(level)

            # Available flow for power (after irrigation)
            avail_flow = max(0, monthly_inflows[month] * 1e9 / (30*86400)
                           - monthly_irrigation[month] * 1e9 / (30*86400))
            power_flow = min(avail_flow * power_flow_fraction, self.rated_flow)

            power = self.power_output(head, power_flow)
            energy_gwh = power * 730 / 1000  # 730 hours/month

            # Evaporation (proportional to surface area)
            surface_km2 = 285 * (volume / self.max_vol) ** 0.5
            evap = surface_km2 * 0.06  # 60 mm/month, in km^3

            # Update volume
            net_change = (monthly_inflows[month] - monthly_irrigation[month]
                         - power_flow * 30 * 86400 / 1e9 - evap)
            volume = max(0, min(self.max_vol, volume + net_change))

            results.append({
                "month": month, "volume": volume, "level": level,
                "head": head, "power_mw": power, "energy_gwh": energy_gwh,
                "inflow": monthly_inflows[month], "evap": evap,
            })

        return results

# Create simulator
sim = HydroPlantSimulator()

# Krishna River monthly inflows (km^3, typical year)
inflows = [0.3, 0.2, 0.15, 0.1, 0.1, 0.5, 1.8, 3.5, 4.0, 2.5, 1.0, 0.5]
irrigation = [0.8, 0.7, 0.6, 0.4, 0.3, 0.2, 0.1, 0.1, 0.2, 0.5, 0.7, 0.8]
months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

results = sim.simulate_year(8.0, inflows, irrigation)

print("=== Nagarjuna Sagar Annual Simulation ===")
print(f"{'Month':<5} {'Vol(km3)':>9} {'Level(m)':>9} {'Head(m)':>8} "
      f"{'Power':>8} {'Energy':>8} {'Inflow':>8}")
print("-" * 57)

total_energy = 0
for r, name in zip(results, months):
    total_energy += r["energy_gwh"]
    print(f"{name:<5} {r['volume']:>9.1f} {r['level']:>9.1f} {r['head']:>8.1f} "
          f"{r['power_mw']:>6.0f}MW {r['energy_gwh']:>6.1f} {r['inflow']:>6.1f}")

print(f"\
Total annual energy: {total_energy:,.0f} GWh")
cap_factor = total_energy / (816 * 8.76)
print(f"Capacity factor: {cap_factor:.1%}")
print(f"Year-end reservoir: {results[-1]['volume']:.1f} km^3 "
      f"({results[-1]['volume']/11.5*100:.0f}% full)")`,
      challenge: 'Simulate a drought year by reducing all monthly inflows by 40%. How does the capacity factor change? Does the reservoir recover by year end, or would a second drought year be catastrophic? This is the analysis water managers perform every monsoon season.',
      successHint: 'You built a complete hydroelectric plant simulator. Real-time versions of this model, with hourly resolution and weather forecasting, are used by power utilities worldwide to manage dam operations. The mass balance plus power equation framework is universal in water resource engineering.',
    },
    {
      title: 'Penstock and turbine optimization — finding peak efficiency',
      concept: `A real hydroelectric plant has many adjustable parameters: **number of turbines online**, **guide vane opening** (controls flow per turbine), and **generator excitation** (controls voltage). The optimal combination depends on the current head, available water, and electricity demand.

The key insight is that turbine efficiency varies with load. A Francis turbine peaks at about 85-95% of rated flow and drops at lower loads. Running 4 turbines at 80% load is often more efficient than running 8 at 40% load. The **unit commitment problem** — deciding how many turbines to run — is an optimization problem solved hourly at real plants.

Your optimizer will find the combination (number of turbines, flow per turbine) that maximizes power output for a given total available flow and head, accounting for the efficiency curve of each turbine.

📚 *The unit commitment problem: given N identical turbines with a known efficiency curve, find the optimal number to run and the flow through each to maximize total power output. This is a constrained optimization problem with a nonlinear objective function.*`,
      analogy: 'Imagine you have 8 delivery trucks and a variable amount of packages each day. Running all 8 trucks half-loaded is wasteful (low fuel efficiency). Running 4 trucks fully loaded is more efficient. But if you have too many packages for 4 trucks, you need 5 or 6. Finding the right number of trucks for each day amount is the unit commitment problem.',
      storyConnection: 'At Nagarjuna Sagar, operators decide each hour how many of the 8 turbines to run. During low-flow months (April-May), perhaps only 2-3 turbines are needed. During peak monsoon flow (September), all 8 run at full capacity. The decision impacts both power output and turbine longevity.',
      checkQuestion: 'A plant has 4 turbines, each rated at 100 m^3/s. Total available flow is 250 m^3/s. Should you run 3 turbines at 83% or 4 at 63%?',
      checkAnswer: 'If efficiency at 83% load is 92% and at 63% load is 87%: 3 turbines at 83% load: P = 3 * 92% * (83/100) = 2.29 units. 4 turbines at 63% load: P = 4 * 87% * (63/100) = 2.19 units. Running 3 turbines is more efficient despite one being idle.',
      codeIntro: 'Optimize turbine commitment to maximize power output at varying flow rates.',
      code: `import numpy as np

# Turbine unit commitment optimization

def turbine_efficiency(Q_fraction):
    """Francis turbine efficiency vs load fraction (0 to 1)."""
    if Q_fraction < 0.2:
        return 0.5 * Q_fraction / 0.2  # very low at minimal flow
    # Peak efficiency around 85% load
    peak = 0.93
    return peak * (1 - 0.3 * (Q_fraction - 0.85)**2 / 0.85**2)

def plant_power(n_active, Q_total, head, Q_rated_per_turbine=100):
    """Calculate total plant power for n_active turbines."""
    if n_active == 0 or Q_total <= 0:
        return 0, 0

    Q_per = Q_total / n_active
    Q_fraction = Q_per / Q_rated_per_turbine

    if Q_fraction > 1.1:  # can't exceed rated by much
        return 0, 0

    eta = turbine_efficiency(min(Q_fraction, 1.0))
    P_per = 1000 * Q_per * 9.81 * head * eta / 1e6  # MW
    return P_per * n_active, eta

# Optimization: find best number of turbines for each flow level
n_turbines = 8
Q_rated = 100  # per turbine
head = 100

print("=== Turbine Commitment Optimization ===")
print(f"Plant: {n_turbines} turbines, {Q_rated} m^3/s each, {head} m head")
print()

print(f"{'Total Q':>9} {'Best N':>7} {'Q/turb':>8} {'Load %':>8} "
      f"{'Efficiency':>11} {'Power':>10} {'vs all-on':>10}")
print("-" * 65)

for Q_total in [50, 100, 150, 200, 300, 400, 500, 600, 700, 800]:
    best_power = 0
    best_n = 0
    best_eta = 0
    all_on_power = 0

    for n in range(1, n_turbines + 1):
        Q_per = Q_total / n
        if Q_per > Q_rated * 1.1:
            continue
        power, eta = plant_power(n, Q_total, head, Q_rated)
        if power > best_power:
            best_power = power
            best_n = n
            best_eta = eta

    # Compare to running all turbines
    all_on_power, _ = plant_power(n_turbines, Q_total, head, Q_rated)
    improvement = (best_power - all_on_power) / all_on_power * 100 if all_on_power > 0 else 0

    Q_per_best = Q_total / best_n
    load_pct = Q_per_best / Q_rated * 100

    print(f"{Q_total:>7} m3/s {best_n:>5} {Q_per_best:>7.0f} {load_pct:>6.0f}% "
          f"{best_eta*100:>9.1f}% {best_power:>8.1f} MW {improvement:>+8.1f}%")

print()
# Efficiency curve
print("=== Turbine Efficiency Curve ===")
print(f"{'Load %':<10} {'Efficiency':>11} {'Curve'}")
print("-" * 45)
for pct in range(10, 110, 5):
    frac = pct / 100
    eta = turbine_efficiency(frac)
    bar = "#" * int(eta * 40)
    print(f"{pct:>5}%     {eta*100:>9.1f}%  {bar}")

print()
# Daily optimization example
print("=== 24-Hour Dispatch Optimization ===")
hourly_demand_frac = [
    0.4, 0.35, 0.3, 0.3, 0.35, 0.5,   # 0-5 (night)
    0.65, 0.8, 0.9, 0.95, 1.0, 1.0,    # 6-11 (morning peak)
    0.95, 0.9, 0.85, 0.85, 0.9, 1.0,   # 12-17 (afternoon)
    1.0, 0.95, 0.85, 0.7, 0.55, 0.45,  # 18-23 (evening)
]

Q_available = 600  # m^3/s total available

daily_energy = 0
print(f"{'Hour':>6} {'Demand%':>8} {'Flow':>8} {'Turbines':>9} {'Power':>10}")
for hour, demand in enumerate(hourly_demand_frac):
    Q = Q_available * demand
    best_p, best_n = 0, 0
    for n in range(1, 9):
        p, _ = plant_power(n, Q, head, Q_rated)
        if p > best_p:
            best_p, best_n = p, n
    daily_energy += best_p / 1000  # GWh
    print(f"{hour:>4}:00 {demand*100:>6.0f}% {Q:>6.0f} {best_n:>9} {best_p:>8.1f} MW")

print(f"\
Daily energy: {daily_energy:.1f} GWh")`,
      challenge: 'What if 2 turbines are shut for maintenance? Rerun the optimization with only 6 available turbines. At what total flow does the 6-turbine plant become bottlenecked (unable to pass all available water)? How much energy is lost per day during peak monsoon?',
      successHint: 'Unit commitment optimization is solved daily by every power plant in the world. The same mathematical framework applies to thermal plants (which turbines to fire up), wind farms (which turbines to curtail), and battery storage systems (when to charge and discharge).',
    },
    {
      title: 'Flood routing — managing extreme inflows',
      concept: `During extreme monsoon events, the inflow to the reservoir can exceed the combined capacity of all turbines and spillways. **Flood routing** is the process of predicting how the reservoir level changes during a flood and determining how much water must be released through spillways to prevent the dam from overtopping.

The governing equation is the **storage equation**: dS/dt = I(t) - O(t), where S is storage, I is inflow, and O is outflow. For a known inflow hydrograph (time series of inflow), we solve for the outflow that keeps the reservoir level below the maximum safe level.

The **spillway discharge** follows the weir equation: Q_spill = C * L * H^(3/2), where C is the discharge coefficient (~2.0), L is the spillway length, and H is the depth of water above the spillway crest. As the reservoir rises above the crest, spillway discharge increases rapidly.

📚 *A flood hydrograph shows the inflow rate vs time. It typically rises rapidly to a peak and then slowly recedes. The reservoir attenuates the peak — maximum outflow occurs after maximum inflow because the reservoir stores water during the rising limb and releases it gradually.*`,
      analogy: 'Imagine pouring water into a funnel. The funnel stores some water temporarily, and the outflow through the narrow end is slower than the rapid pour. The funnel "attenuates" the flood — spreading the peak over a longer time. A dam reservoir does the same thing, but the "funnel" holds billions of cubic metres.',
      storyConnection: 'Nagarjuna Sagar has 26 spillway gates, each 15 m wide. During the 2009 floods, the Krishna River inflow peaked at over 50,000 m^3/s — far beyond the turbine capacity of 800 m^3/s. All 26 spillway gates were opened, releasing over 30,000 m^3/s. The reservoir rose dangerously close to the dam crest. Flood routing calculations were critical for deciding when and how much to open the gates.',
      checkQuestion: 'A spillway is 100 m wide with C = 2.0 and the water is 3 m above the crest. What is the discharge?',
      checkAnswer: 'Q = 2.0 * 100 * 3^1.5 = 200 * 5.196 = 1,039 m^3/s. If the water rises to 5 m above the crest: Q = 2.0 * 100 * 5^1.5 = 200 * 11.18 = 2,236 m^3/s — more than double, because discharge scales with H^1.5.',
      codeIntro: 'Simulate flood routing through the reservoir and optimize spillway gate operation.',
      code: `import numpy as np

# Flood routing simulation

class FloodRouter:
    def __init__(self, max_volume_km3=11.5, spillway_length=390,
                 spillway_coeff=2.0, crest_level=118,
                 dam_height=124, area_at_crest=285):
        self.max_vol = max_volume_km3
        self.spill_L = spillway_length  # total spillway length (m)
        self.spill_C = spillway_coeff
        self.crest = crest_level  # spillway crest elevation (m)
        self.dam_top = dam_height
        self.area_crest = area_at_crest  # km^2

    def level_from_volume(self, vol_km3):
        return 124 * (vol_km3 / self.max_vol) ** 0.6

    def volume_from_level(self, level):
        return self.max_vol * (level / 124) ** (1/0.6)

    def spillway_discharge(self, level):
        """Weir equation: Q = C * L * H^1.5"""
        H = max(0, level - self.crest)
        return self.spill_C * self.spill_L * H ** 1.5

    def route_flood(self, initial_vol, inflows, dt_hours=6):
        """Route a flood through the reservoir.
        inflows: list of (time_hours, Q_m3s) tuples
        """
        dt = dt_hours * 3600  # seconds
        vol = initial_vol
        results = []

        for time_h, Q_in in inflows:
            level = self.level_from_volume(vol)
            Q_spill = self.spillway_discharge(level)
            Q_turbine = min(800, max(0, Q_in - Q_spill) * 0.2)
            Q_out = Q_spill + Q_turbine

            # Volume change (convert m^3/s to km^3 over dt)
            dV = (Q_in - Q_out) * dt / 1e9
            vol = max(0, min(self.max_vol * 1.05, vol + dV))  # allow slight overflow

            results.append({
                "time_h": time_h, "Q_in": Q_in, "Q_spill": Q_spill,
                "Q_turbine": Q_turbine, "Q_out": Q_out,
                "level": level, "volume": vol,
                "freeboard": self.dam_top - level,
            })

        return results

router = FloodRouter()

# Create flood hydrograph (extreme monsoon event)
times = list(range(0, 168, 6))  # 7 days, 6-hour steps
peak_time = 48  # peak at 48 hours
peak_flow = 45000  # m^3/s (extreme flood)

inflows = []
for t in times:
    if t <= peak_time:
        Q = 2000 + (peak_flow - 2000) * (t / peak_time) ** 2
    else:
        Q = peak_flow * np.exp(-0.02 * (t - peak_time))
    inflows.append((t, Q))

# Start with reservoir at 95% capacity
initial_vol = 11.5 * 0.95
results = router.route_flood(initial_vol, inflows)

print("=== Flood Routing Simulation ===")
print(f"Initial volume: {initial_vol:.1f} km^3 (95% full)")
print(f"Peak inflow: {peak_flow:,} m^3/s at t={peak_time}h")
print()

print(f"{'Time':>6} {'Inflow':>10} {'Spillway':>10} {'Turbine':>9} "
      f"{'Level':>8} {'Freeboard':>10}")
print("-" * 55)

peak_level = 0
min_freeboard = 999
for r in results:
    if r["level"] > peak_level:
        peak_level = r["level"]
    if r["freeboard"] < min_freeboard:
        min_freeboard = r["freeboard"]
    print(f"{r['time_h']:>4} h {r['Q_in']:>9,.0f} {r['Q_spill']:>9,.0f} "
          f"{r['Q_turbine']:>9,.0f} {r['level']:>6.1f} m {r['freeboard']:>8.1f} m")

print()
print(f"Peak reservoir level: {peak_level:.1f} m")
print(f"Minimum freeboard: {min_freeboard:.1f} m")
print(f"Dam crest: {router.dam_top} m")
status = "SAFE" if min_freeboard > 2 else "CRITICAL" if min_freeboard > 0 else "OVERTOPPED!"
print(f"Status: {status}")`,
      challenge: 'Increase the peak inflow to 55,000 m^3/s (a 1-in-1000-year flood). Does the dam overtop? If so, how much wider would the spillway need to be to handle this extreme flood safely (minimum 2 m freeboard)?',
      successHint: 'Flood routing is one of the most critical safety analyses for any dam. The 2009 Krishna floods and the 2018 Kerala floods both required emergency flood routing decisions that affected millions of people. You just built the same simulation tool used by dam safety engineers.',
    },
    {
      title: 'Pumped storage — using the dam as a giant battery',
      concept: `**Pumped-storage hydroelectricity** uses the dam as a giant battery. During periods of low electricity demand (night), cheap excess power from the grid runs the turbines in reverse as pumps, pushing water from a lower reservoir back up to the upper reservoir. During peak demand (evening), the water flows down through the turbines to generate expensive peak power.

The round-trip efficiency is typically 70-85%: you lose 15-30% of the energy in the pump-generate cycle. But this is economically viable because peak electricity prices can be 3-5x higher than off-peak prices. The revenue from selling peak power exceeds the cost of buying off-peak power to pump.

Pumped storage provides crucial **grid stability** services: frequency regulation, spinning reserve, and black-start capability. As solar and wind power grow, pumped storage becomes even more valuable because it can absorb excess renewable generation and release it when needed.

📚 *Round-trip efficiency = energy generated / energy consumed for pumping. At 80% efficiency, pumping 100 MWh up and generating 80 MWh coming down, the net "loss" of 20 MWh is the cost of energy storage. The economic value comes from time-shifting energy from cheap to expensive hours.*`,
      analogy: 'Think of buying groceries on sale and eating them later. You "store" the value by buying cheap and consuming when prices are high. Pumped storage does the same with electricity: pump water up when power is cheap, generate when power is expensive. The 20% energy loss is the "storage fee."',
      storyConnection: 'While Nagarjuna Sagar is not currently a pumped-storage facility, several pumped-storage projects have been proposed in Telangana to complement the growing solar power capacity. A pumped-storage addition to Nagarjuna Sagar could store excess midday solar energy and release it during the evening peak — turning the 1960s dam into a 21st-century grid stabilizer.',
      checkQuestion: 'A pumped-storage plant pumps 1000 MWh overnight at an electricity cost of $30/MWh. It generates 800 MWh during the day at a price of $60/MWh. What is the profit?',
      checkAnswer: 'Pumping cost: 1000 * $30 = $30,000. Revenue: 800 * $60 = $48,000. Profit: $48,000 - $30,000 = $18,000. Even though 200 MWh is lost, the price difference makes it profitable.',
      codeIntro: 'Simulate a pumped-storage hydroelectric system and optimize pump/generate scheduling.',
      code: `import numpy as np

class PumpedStorageSimulator:
    """Simulate a pumped-storage hydroelectric system."""

    def __init__(self, capacity_mw=500, reservoir_mwh=4000,
                 pump_efficiency=0.87, gen_efficiency=0.92):
        self.cap = capacity_mw
        self.max_storage = reservoir_mwh  # MWh equivalent
        self.eta_pump = pump_efficiency
        self.eta_gen = gen_efficiency
        self.eta_roundtrip = pump_efficiency * gen_efficiency

    def simulate_day(self, hourly_prices, initial_storage_pct=50):
        """Optimize pump/generate schedule for one day.
        Simple strategy: pump when price < median, generate when price > median.
        """
        median_price = np.median(hourly_prices)
        storage = self.max_storage * initial_storage_pct / 100
        results = []
        total_cost = 0
        total_revenue = 0

        for hour, price in enumerate(hourly_prices):
            if price < median_price * 0.8 and storage < self.max_storage * 0.95:
                # Pump (consume power to store water)
                pump_mw = min(self.cap, (self.max_storage - storage) / self.eta_pump)
                stored = pump_mw * self.eta_pump
                storage += stored
                cost = pump_mw * price
                total_cost += cost
                mode = "PUMP"
                net_power = -pump_mw
            elif price > median_price * 1.2 and storage > self.max_storage * 0.10:
                # Generate (release water for power)
                gen_mw = min(self.cap, storage * self.eta_gen)
                storage -= gen_mw / self.eta_gen
                revenue = gen_mw * price
                total_revenue += revenue
                mode = "GEN"
                net_power = gen_mw
            else:
                mode = "IDLE"
                net_power = 0

            results.append({
                "hour": hour, "price": price, "mode": mode,
                "power_mw": net_power, "storage_pct": storage / self.max_storage * 100,
            })

        return results, total_revenue, total_cost

# Create simulator
sim = PumpedStorageSimulator(capacity_mw=500, reservoir_mwh=4000)

# Typical daily electricity prices ($/MWh)
prices = [
    25, 22, 20, 18, 18, 22,     # 0-5 (night: low)
    30, 45, 55, 60, 65, 70,     # 6-11 (morning ramp)
    68, 62, 58, 55, 58, 70,     # 12-17 (afternoon)
    80, 85, 75, 55, 40, 30,     # 18-23 (evening peak + decline)
]

results, revenue, cost = sim.simulate_day(prices)

print("=== Pumped Storage Daily Operation ===")
print(f"Capacity: {sim.cap} MW | Storage: {sim.max_storage} MWh")
print(f"Round-trip efficiency: {sim.eta_roundtrip:.0%}")
print()

print(f"{'Hour':>6} {'Price':>8} {'Mode':<6} {'Power':>10} {'Storage':>10}")
print("-" * 42)

energy_pumped = 0
energy_generated = 0
for r in results:
    if r["power_mw"] < 0:
        energy_pumped += abs(r["power_mw"])
    elif r["power_mw"] > 0:
        energy_generated += r["power_mw"]
    print(f"{r['hour']:>4}:00 {r['price']:>5}/MWh {r['mode']:<6} "
          f"{r['power_mw']:>+8.0f} MW {r['storage_pct']:>8.0f}%")

print()
print("=== Financial Summary ===")
print(f"Energy pumped: {energy_pumped:,.0f} MWh (cost: \{cost:,.0f})")
print(f"Energy generated: {energy_generated:,.0f} MWh (revenue: \{revenue:,.0f})")
print(f"Energy lost: {energy_pumped - energy_generated:,.0f} MWh ({(1-sim.eta_roundtrip)*100:.0f}% loss)")
print(f"Net profit: {revenue - cost:,.0f}")
print(f"Avg purchase price: {cost/max(energy_pumped,1):.1f}/MWh")
print(f"Avg selling price: {revenue/max(energy_generated,1):.1f}/MWh")
print(f"Price ratio needed for profit: > {1/sim.eta_roundtrip:.2f}x")

print()
# Annual projection
daily_profit = revenue - cost
annual = daily_profit * 365
construction = 800e6  # $800 million
print("=== Annual Projection ===")
print(f"Daily profit: \{daily_profit:,.0f}")
print(f"Annual profit: \{annual:,.0f}")
print(f"Construction cost: {construction/1e6:,.0f} million")
print(f"Simple payback: {construction/annual:.0f} years")`,
      challenge: 'Add solar power to the mix: between 10 AM and 3 PM, excess solar drives electricity prices to $5/MWh (or even negative!). Redesign the price schedule and see how pumped storage profits increase. This is why pumped storage is booming alongside solar — it absorbs cheap midday solar and sells it during the expensive evening peak.',
      successHint: 'Pumped-storage hydroelectricity is the world largest form of grid energy storage — over 95% of all utility-scale storage globally. As renewable energy grows, pumped storage becomes increasingly valuable. You just built the economic model that investors use to evaluate pumped-storage projects worth hundreds of millions of dollars.',
    },
    {
      title: 'Complete dam system model — integrating all components',
      concept: `In this final capstone exercise, you will integrate everything into a complete dam system model: reservoir dynamics, multiple water uses (power, irrigation, flood control, environmental flow), turbine optimization, and economic analysis. This is the kind of integrated model that water resource engineers build for real dam management.

The model must balance competing objectives: maximize power revenue, meet irrigation obligations, maintain minimum environmental flows downstream, keep the reservoir above a minimum safety level, and manage flood risk during monsoon. These objectives often conflict — more power means less water for irrigation; flood control requires keeping reservoir low, but power generation wants it high.

This multi-objective optimization is one of the grand challenges in water resource engineering. There is no single "right" answer — only tradeoffs. Your model will help visualize these tradeoffs and make informed decisions.

📚 *Multi-objective optimization: when you cannot maximize all objectives simultaneously, you seek Pareto-optimal solutions — solutions where improving one objective necessarily worsens another. The set of all Pareto-optimal solutions is called the Pareto frontier.*`,
      analogy: 'Imagine managing a family budget with limited income. You want to maximize savings (reservoir level), spend on food (irrigation), enjoy entertainment (power generation), and keep an emergency fund (flood buffer). You cannot maximize all four — every dollar spent on entertainment is a dollar not saved. Finding the best balance is multi-objective optimization.',
      storyConnection: 'The Nagarjuna Sagar Dam management team faces exactly these tradeoffs every day. During drought years, they must choose between releasing water for desperately needed irrigation (feeding families) or saving it for power generation (keeping the lights on). These decisions affect millions of people and are informed by models like the one you will build.',
      checkQuestion: 'If irrigation needs 500 m^3/s, power turbines need 800 m^3/s, and environmental flow requires 100 m^3/s, what is the minimum total outflow? If the reservoir can only safely release 1000 m^3/s, which use gets cut?',
      checkAnswer: 'Minimum total: 500 + 800 + 100 = 1,400 m^3/s. With a 1,000 m^3/s limit, something must give. Typically environmental flow (legally mandated) and irrigation (contractual) take priority, leaving power at 1000 - 500 - 100 = 400 m^3/s — half the desired amount.',
      codeIntro: 'Build an integrated dam management model balancing power, irrigation, flood control, and environment.',
      code: `import numpy as np

class IntegratedDamModel:
    """Complete dam management model."""

    def __init__(self):
        self.max_vol = 11.5     # km^3
        self.min_vol = 2.0      # minimum safe level
        self.flood_vol = 10.0   # start flood releases above this
        self.dam_height = 124
        self.turbine_cap = 800  # m^3/s max turbine flow
        self.n_turbines = 8
        self.eta = 0.90

    def level(self, vol):
        return 124 * (vol / self.max_vol) ** 0.6

    def head(self, vol):
        return max(0, self.level(vol) - 24) * 0.97

    def power(self, Q, vol):
        h = self.head(vol)
        return 1000 * Q * 9.81 * h * self.eta / 1e6  # MW

    def allocate_water(self, vol, inflow, irrigation_need, env_flow=100):
        """Decide water allocation priorities."""
        available = inflow + (vol - self.min_vol) * 1e9 / (30 * 86400)  # m^3/s equivalent

        # Priority 1: environmental flow (mandatory)
        env = min(env_flow, available)
        remaining = available - env

        # Priority 2: irrigation (contractual)
        irrig = min(irrigation_need, remaining)
        remaining -= irrig

        # Priority 3: power generation
        power_flow = min(remaining, self.turbine_cap)

        # Priority 4: flood release (if above flood level)
        flood_release = 0
        if vol > self.flood_vol:
            flood_release = max(0, inflow - power_flow - irrig - env)

        return env, irrig, power_flow, flood_release

    def simulate_year(self, inflows, irrigation_needs):
        vol = 8.0  # start at ~70% full
        months = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"]
        results = []
        total_energy = 0
        total_revenue = 0

        for i in range(12):
            Q_in = inflows[i] * 1e9 / (30 * 86400)  # km^3/month to m^3/s
            irrig_need = irrigation_needs[i] * 1e9 / (30 * 86400)

            env, irrig, pwr_flow, flood = self.allocate_water(
                vol, Q_in, irrig_need
            )

            power_mw = self.power(pwr_flow, vol)
            energy = power_mw * 730 / 1000  # GWh
            total_energy += energy

            # Revenue (peak price $60/MWh, avg $40/MWh)
            revenue = energy * 1000 * 40  # $
            total_revenue += revenue

            # Update volume
            total_out = (env + irrig + pwr_flow + flood) * 30 * 86400 / 1e9
            evap = 285 * (vol / self.max_vol) ** 0.5 * 0.06 / 1e3
            vol = max(0, min(self.max_vol, vol + inflows[i] - total_out - evap))

            results.append({
                "month": months[i], "vol": vol, "level": self.level(vol),
                "inflow": inflows[i], "env": env, "irrig": irrig,
                "power_flow": pwr_flow, "flood": flood,
                "power_mw": power_mw, "energy": energy,
            })

        return results, total_energy, total_revenue

model = IntegratedDamModel()

# Scenario: Normal year
inflows_normal = [0.3, 0.2, 0.15, 0.1, 0.1, 0.5, 1.8, 3.5, 4.0, 2.5, 1.0, 0.5]
irrigation = [0.8, 0.7, 0.6, 0.4, 0.3, 0.2, 0.1, 0.1, 0.2, 0.5, 0.7, 0.8]

results, energy, revenue = model.simulate_year(inflows_normal, irrigation)

print("=" * 65)
print("  INTEGRATED DAM MANAGEMENT REPORT — NORMAL YEAR")
print("=" * 65)
print()
print(f"{'Month':<5} {'Vol':>5} {'Level':>6} {'Env':>6} {'Irrig':>7} "
      f"{'Power':>7} {'Flood':>7} {'MW':>6} {'GWh':>6}")
print("-" * 57)

for r in results:
    print(f"{r['month']:<5} {r['vol']:>4.1f} {r['level']:>5.0f}m "
          f"{r['env']:>5.0f} {r['irrig']:>6.0f} {r['power_flow']:>6.0f} "
          f"{r['flood']:>6.0f} {r['power_mw']:>5.0f} {r['energy']:>5.1f}")

print(f"\
Annual energy: {energy:,.0f} GWh")
print(f"Annual revenue: \{revenue:,.0f}")
print(f"Capacity factor: {energy / (816 * 8.76):.1%}")
print(f"Year-end storage: {results[-1]['vol']:.1f} km^3 ({results[-1]['vol']/11.5*100:.0f}%)")

# Drought comparison
print()
inflows_drought = [x * 0.5 for x in inflows_normal]
results_d, energy_d, revenue_d = model.simulate_year(inflows_drought, irrigation)

print("=== DROUGHT YEAR (50% inflow) ===")
print(f"Annual energy: {energy_d:,.0f} GWh (normal: {energy:,.0f})")
print(f"Revenue: \{revenue_d:,.0f} (normal: \{revenue:,.0f})")
print(f"Revenue loss: {revenue - revenue_d:,.0f} ({(1-revenue_d/revenue)*100:.0f}%)")
print(f"Year-end storage: {results_d[-1]['vol']:.1f} km^3")
min_vol = min(r["vol"] for r in results_d)
print(f"Minimum storage: {min_vol:.1f} km^3 "
      f"({'CRITICAL' if min_vol < 3 else 'Low' if min_vol < 5 else 'OK'})")`,
      challenge: 'Run three consecutive drought years (feed the year-end volume of each year as the starting volume of the next). Does the reservoir recover, or does it hit the minimum safe level? At what point must irrigation be rationed to keep the dam from running dry?',
      successHint: 'You have built an integrated water resource management model — the same kind of tool used by the Central Water Commission of India, the US Bureau of Reclamation, and dam operators worldwide. Balancing power, irrigation, flood control, and environmental needs is one of the most important and challenging problems in civil engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Simulate a complete hydroelectric power plant</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These capstone exercises build a complete hydroelectric plant simulation from reservoir to grid.
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
