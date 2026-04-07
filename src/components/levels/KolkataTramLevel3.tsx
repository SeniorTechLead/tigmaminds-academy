import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KolkataTramLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Power efficiency — where does the energy actually go?',
      concept: `A tram's overall efficiency is the product of many individual efficiencies: **eta_total = eta_supply * eta_wire * eta_controller * eta_motor * eta_gearbox * eta_wheel**. Each stage loses some energy, mainly as heat. Typical values: supply 95%, wire 97%, controller 50-98% (resistor vs chopper), motor 85%, gearbox 95%, wheel-rail 98%.

With resistor control: 0.95 * 0.97 * 0.55 * 0.85 * 0.95 * 0.98 = **40%**. With chopper control: 0.95 * 0.97 * 0.97 * 0.85 * 0.95 * 0.98 = **71%**. The controller is the dominant loss in the resistor system.

The **Sankey diagram** visualises energy flow through the system, showing where energy enters, where it is lost, and how much reaches the wheels.`,
      analogy: 'Think of a bucket brigade passing water from a well to a fire. Each person spills a little. If 10 people each spill 5%, only 60% of the water arrives. Efficiency multiplies — even small losses at each stage compound into large overall losses.',
      storyConnection: 'Kolkata tram engineers have measured the overall efficiency of their fleet at 35-45% — meaning over half the electricity purchased from the grid is wasted as heat. Upgrading just the controller (from resistor to chopper) would boost efficiency to 65-70%, saving approximately Rs 5-8 crore per year across the fleet.',
      checkQuestion: 'If each of 6 stages has 90% efficiency, what is the overall efficiency?',
      checkAnswer: '0.90^6 = 0.531 = 53.1%. Even though each stage is "90% efficient" (sounds good), the system loses nearly half its energy. This compounding effect is why every stage matters — improving any single stage benefits the whole system.',
      codeIntro: 'Build a complete energy flow model for the Kolkata tram and identify the biggest losses.',
      code: `import numpy as np

# Tram energy flow (Sankey) analysis

class EnergyStage:
    def __init__(self, name, efficiency):
        self.name = name
        self.eff = efficiency

    def process(self, energy_in):
        energy_out = energy_in * self.eff
        loss = energy_in - energy_out
        return energy_out, loss

# Two configurations: classic and modernised
classic_stages = [
    EnergyStage("Substation transformer", 0.95),
    EnergyStage("Feeder cable (2km)", 0.97),
    EnergyStage("Overhead wire", 0.98),
    EnergyStage("Pantograph contact", 0.99),
    EnergyStage("Resistor controller", 0.55),
    EnergyStage("DC series motor", 0.85),
    EnergyStage("Gearbox", 0.95),
    EnergyStage("Wheel-rail interface", 0.98),
]

modern_stages = [
    EnergyStage("Substation transformer", 0.96),
    EnergyStage("Feeder cable (2km)", 0.97),
    EnergyStage("Overhead wire", 0.98),
    EnergyStage("Pantograph contact", 0.99),
    EnergyStage("Chopper controller", 0.97),
    EnergyStage("DC motor (improved)", 0.90),
    EnergyStage("Gearbox (sealed)", 0.97),
    EnergyStage("Wheel-rail interface", 0.98),
]

def analyse_system(stages, input_kW, label):
    print(f"=== {label} ===")
    print(f"Input power: {input_kW:.1f} kW")
    print()
    print(f"{'Stage':<26} {'Eff':>5} {'In (kW)':>8} {'Out (kW)':>9} {'Loss (kW)':>10}")
    print("-" * 60)

    energy = input_kW
    total_loss = 0

    for stage in stages:
        energy_out, loss = stage.process(energy)
        total_loss += loss
        print(f"{stage.name:<26} {stage.eff:>4.0%} {energy:>6.1f} {energy_out:>7.1f} {loss:>8.1f}")
        energy = energy_out

    overall = energy / input_kW
    print(f"\n{'TOTAL':<26} {overall:>4.0%} {input_kW:>6.1f} {energy:>7.1f} {total_loss:>8.1f}")
    print(f"Power at wheels: {energy:.1f} kW ({overall*100:.1f}% of input)")
    return energy, overall

input_power = 150  # kW from substation

p_classic, e_classic = analyse_system(classic_stages, input_power, "Classic Resistor Tram")
print()
p_modern, e_modern = analyse_system(modern_stages, input_power, "Modernised Chopper Tram")

# Comparison
print()
print("=== Comparison ===")
print(f"Classic: {p_classic:.1f} kW at wheels ({e_classic*100:.1f}% efficient)")
print(f"Modern:  {p_modern:.1f} kW at wheels ({e_modern*100:.1f}% efficient)")
print(f"Improvement: {(p_modern - p_classic):.1f} kW more at wheels (+{(e_modern/e_classic-1)*100:.0f}%)")

# Annual cost impact
daily_kWh = input_power * 14  # 14 hours operation
annual_kWh = daily_kWh * 300
fleet = 100
cost = 8  # Rs/kWh

classic_annual = annual_kWh * fleet * (1 - e_classic) * cost
modern_annual = annual_kWh * fleet * (1 - e_modern) * cost
savings = classic_annual - modern_annual

print(f"\nAnnual electricity wasted (fleet of {fleet}):")
print(f"  Classic: Rs {classic_annual/1e7:.1f} crore")
print(f"  Modern:  Rs {modern_annual/1e7:.1f} crore")
print(f"  Savings: Rs {savings/1e7:.1f} crore per year")`,
      challenge: 'Add regenerative braking (recovers 25% of total input energy) to the modern system. What is the effective overall efficiency? At what point does the tram become more efficient than a diesel bus (35% tank-to-wheel)?',
      successHint: 'Energy flow analysis is the foundation of energy engineering. Power plants, factories, vehicles, and buildings all benefit from this same approach: trace energy from source to end use, identify the biggest losses, and target improvements where they have the most impact.',
    },
    {
      title: 'Regenerative braking energy recovery — detailed physics',
      concept: `During regenerative braking, the DC motor runs as a **generator**: the spinning armature cuts through the magnetic field, inducing a voltage (back-EMF) that exceeds the supply voltage. This drives current *backward* through the circuit, pumping energy back into the overhead wire.

The generator voltage is: **E_gen = k * omega**. For current to flow backward: **E_gen > V_supply**. The regenerated power is: **P_regen = (E_gen - V_supply) * I_regen / R_total**. The braking torque is: **T_brake = k * I_regen**.

The energy flows back through the overhead wire to other trams on the same section. If no other tram is consuming power, the regenerated energy has nowhere to go — it must either be dissipated in a braking resistor or stored in a battery. This "receptivity" problem limits regeneration effectiveness.`,
      analogy: 'Regenerative braking is like a water pump running in reverse. Normally, the pump (motor) uses electricity to push water (the tram) uphill. In reverse, the tram rolling downhill pushes water back through the pump, generating electricity. But if there is no tank (another tram) to receive the water, it has nowhere to go and the pump must dump it.',
      storyConnection: 'Kolkata\'s dense tram network actually makes regeneration more effective: when one tram brakes, there is usually another tram accelerating on the same overhead wire section, ready to absorb the regenerated energy. The short stop spacing (300-500 m) means trams are constantly accelerating and braking in alternation — an ideal pattern for energy sharing.',
      checkQuestion: 'A tram generates 500 V back-EMF while braking. The overhead wire is at 600 V. Can it regenerate?',
      checkAnswer: 'No! E_gen (500 V) < V_supply (600 V), so current cannot flow backward. The tram must be going fast enough for E_gen > 600 V to regenerate. This means regeneration only works above a minimum speed — below that, conventional brakes must be used.',
      codeIntro: 'Model the detailed physics of regenerative braking including the receptivity problem.',
      code: `import numpy as np

# Detailed regenerative braking model

class RegenSystem:
    def __init__(self, V_line, R_motor, R_line, k_motor, mass, wheel_r, gear_ratio):
        self.V_line = V_line
        self.R_m = R_motor
        self.R_l = R_line
        self.k = k_motor
        self.m = mass
        self.r_w = wheel_r
        self.gr = gear_ratio

    def regen_at_speed(self, v_kmh):
        """Calculate regeneration parameters at a given speed"""
        v = v_kmh / 3.6
        omega_wheel = v / self.r_w
        omega_motor = omega_wheel * self.gr
        E_gen = self.k * omega_motor

        if E_gen <= self.V_line:
            return {"can_regen": False, "E_gen": E_gen, "v_kmh": v_kmh}

        # Regenerative current
        I_regen = (E_gen - self.V_line) / (self.R_m + self.R_l)
        P_regen = self.V_line * I_regen  # power returned to line
        P_loss = I_regen**2 * (self.R_m + self.R_l)
        T_brake = self.k * I_regen * self.gr  # braking torque at wheel
        F_brake = T_brake / self.r_w
        decel = F_brake / self.m

        return {
            "can_regen": True, "v_kmh": v_kmh,
            "E_gen": E_gen, "I_regen": I_regen,
            "P_regen": P_regen / 1000, "P_loss": P_loss / 1000,
            "T_brake": T_brake, "decel": decel,
        }

regen = RegenSystem(
    V_line=600, R_motor=2.0, R_line=0.3,
    k_motor=3.0, mass=18000, wheel_r=0.5, gear_ratio=5.0
)

print("=== Regenerative Braking vs Speed ===")
print(f"{'Speed':>6} {'E_gen':>8} {'Can regen':>10} {'I_regen':>8} {'P_regen':>10} {'Decel':>8}")
print(f"{'km/h':>6} {'(V)':>8} {'':>10} {'(A)':>8} {'(kW)':>10} {'(m/s2)':>8}")
print("-" * 52)

for v in range(5, 50, 3):
    r = regen.regen_at_speed(v)
    if r["can_regen"]:
        print(f"{v:>6} {r['E_gen']:>6.0f} {'YES':>10} {r['I_regen']:>6.0f} "
              f"{r['P_regen']:>8.1f} {r['decel']:>6.3f}")
    else:
        print(f"{v:>6} {r['E_gen']:>6.0f} {'NO':>10} {'---':>8} {'---':>10} {'---':>8}")

# Simulate a complete braking event with regen
print()
print("=== Complete Braking Event (35 km/h to 0) ===")

v = 35 / 3.6  # m/s
dt = 0.1
E_recovered = 0
E_mech_brake = 0
time_log = []
t = 0

while v > 0.1:
    v_kmh = v * 3.6
    r = regen.regen_at_speed(v_kmh)

    if r["can_regen"]:
        decel = r["decel"]
        E_step = r["P_regen"] * dt  # kJ
        E_recovered += E_step
        brake_type = "REGEN"
    else:
        decel = 1.0  # mechanical brake deceleration
        E_step = 0.5 * regen.m * v * decel * dt / 1000
        E_mech_brake += E_step
        brake_type = "MECH"

    if int(t * 10) % 20 == 0:
        time_log.append({"t": t, "v_kmh": v_kmh, "decel": decel,
                        "type": brake_type, "E_rec": E_recovered})

    v -= decel * dt
    t += dt

KE_initial = 0.5 * regen.m * (35/3.6)**2 / 1000
print(f"{'Time':>5} {'Speed':>8} {'Decel':>8} {'Type':>6} {'Recovered':>10}")
print("-" * 40)
for log in time_log:
    print(f"{log['t']:>5.1f} {log['v_kmh']:>6.1f} {log['decel']:>6.3f} "
          f"{log['type']:>6} {log['E_rec']:>8.1f} kJ")

regen_pct = E_recovered / KE_initial * 100
print(f"\nInitial KE: {KE_initial:.1f} kJ")
print(f"Recovered: {E_recovered:.1f} kJ ({regen_pct:.1f}%)")
print(f"Mech brakes: {E_mech_brake:.1f} kJ")

# Receptivity analysis
print()
print("=== Line Receptivity Analysis ===")
print("Can the overhead wire absorb regenerated power?")
print()
scenarios = [
    ("Another tram accelerating nearby", 0.95),
    ("Light load on section", 0.60),
    ("No other trams (battery needed)", 0.30),
    ("No other trams, no battery", 0.00),
]
for name, receptivity in scenarios:
    effective = E_recovered * receptivity
    print(f"{name:<40} {receptivity:>4.0%} -> {effective:.1f} kJ recovered")`,
      challenge: 'Design an onboard supercapacitor bank to store regenerated energy when the line is not receptive. If a supercapacitor stores 1 Wh per kg, how heavy a bank is needed to capture all the energy from one stop? Is the weight penalty worth the energy savings?',
      successHint: 'The receptivity problem is one of the biggest challenges in railway electrification. Solutions include onboard energy storage (supercapacitors, batteries), wayside energy storage (substations with batteries), and smart scheduling (ensure a consuming tram is always near a braking tram). You just identified a real engineering challenge faced by every electric railway in the world.',
    },
    {
      title: 'Thermal management — heat dissipation from motors and resistors',
      concept: `Energy losses in the tram appear as **heat**. The resistor grid can reach 300-400 C during heavy use. The motor windings must stay below 155 C (Class F insulation) or the insulation degrades. Managing this heat is critical for reliability.

Heat transfer follows: **Q = h * A * (T_surface - T_ambient)**, where h is the heat transfer coefficient (5-25 W/m2K for natural convection, 50-200 for forced air), A is surface area, and delta_T is the temperature difference.

The thermal time constant (how fast things heat up) is: **tau = m * c / (h * A)**, where m is mass and c is specific heat capacity. Heavy components (motor) heat slowly but cool slowly. Light components (resistors) heat fast and cool fast.`,
      analogy: 'A hot cup of coffee cools slowly (large mass, small surface area). A thin cookie sheet cools quickly (small mass, large surface area). The motor is like the coffee cup — it accumulates heat slowly during operation. The resistors are like the cookie sheet — they heat up and cool down quickly with each speed change.',
      storyConnection: 'During Kolkata summers (40+ C ambient), tram motors run dangerously hot. CTC maintenance schedules include thermal inspections — a hand-held infrared thermometer pointed at the motor housing. If the temperature exceeds 120 C, the tram is pulled from service for cooling. On the hottest days, some routes operate with reduced frequency to allow motor cooling time between trips.',
      checkQuestion: 'A resistor dissipates 20 kW. Its surface area is 2 m2. With forced-air cooling (h = 100 W/m2K) in 35 C air, what is the surface temperature?',
      checkAnswer: 'Q = h * A * delta_T => delta_T = Q / (h * A) = 20000 / (100 * 2) = 100 C. Surface temperature = 35 + 100 = 135 C. This is manageable for a metal resistor (melting point > 1000 C) but would be dangerous for motor windings (max 155 C).',
      codeIntro: 'Model thermal behaviour of tram motors and resistors during operation.',
      code: `import numpy as np

# Thermal model of tram electrical components

class ThermalComponent:
    def __init__(self, name, mass_kg, specific_heat, surface_area_m2,
                 h_convection, max_temp_C):
        self.name = name
        self.m = mass_kg
        self.c = specific_heat  # J/(kg*C)
        self.A = surface_area_m2
        self.h = h_convection  # W/(m2*C)
        self.T_max = max_temp_C
        self.tau = mass_kg * specific_heat / (h_convection * surface_area_m2)

    def simulate(self, power_profile, T_ambient, dt=1.0, duration=3600):
        """Simulate temperature over time given power input profile"""
        T = T_ambient
        history = []

        for t_sec in range(0, int(duration), int(dt)):
            P_in = power_profile(t_sec)
            P_out = self.h * self.A * (T - T_ambient)
            dT = (P_in - P_out) * dt / (self.m * self.c)
            T += dT

            if t_sec % 60 == 0:
                history.append({"t_min": t_sec/60, "T": T, "P_in": P_in/1000,
                               "status": "OK" if T < self.T_max else "OVER TEMP"})

        return history

# Tram components
motor = ThermalComponent("DC Motor", mass_kg=500, specific_heat=450,
                         surface_area_m2=3.0, h_convection=50, max_temp_C=155)

resistor_grid = ThermalComponent("Resistor Grid", mass_kg=80, specific_heat=500,
                                 surface_area_m2=4.0, h_convection=30, max_temp_C=400)

print("=== Thermal Properties ===")
for comp in [motor, resistor_grid]:
    print(f"{comp.name}: tau = {comp.tau:.0f} s ({comp.tau/60:.1f} min), T_max = {comp.T_max} C")
print()

# Motor power profile: cycles of acceleration and cruise
def motor_power(t):
    cycle = t % 120  # 2-minute stop-to-stop cycle
    if cycle < 20:
        return 15000    # accelerating: 15 kW loss in motor
    elif cycle < 80:
        return 5000     # cruising: 5 kW loss
    elif cycle < 100:
        return 1000     # coasting: 1 kW loss
    else:
        return 500      # stopped: minimal loss

# Resistor power profile
def resistor_power(t):
    cycle = t % 120
    if cycle < 20:
        return 25000    # heavy loss during acceleration
    else:
        return 0        # zero when not starting

T_ambient = 35  # C (Kolkata summer)

print(f"=== Motor Temperature (T_ambient = {T_ambient} C) ===")
motor_hist = motor.simulate(motor_power, T_ambient, duration=3600)
print(f"{'Time (min)':>10} {'Temp (C)':>10} {'P_loss (kW)':>12} {'Status':<10}")
print("-" * 44)
for h in motor_hist:
    if int(h["t_min"]) % 5 == 0:
        print(f"{h['t_min']:>10.0f} {h['T']:>8.1f} {h['P_in']:>10.1f} {h['status']:<10}")

print()
print(f"=== Resistor Grid Temperature ===")
res_hist = resistor_grid.simulate(resistor_power, T_ambient, duration=3600)
print(f"{'Time (min)':>10} {'Temp (C)':>10} {'P_loss (kW)':>12} {'Status':<10}")
print("-" * 44)
for h in res_hist:
    if int(h["t_min"]) % 5 == 0:
        print(f"{h['t_min']:>10.0f} {h['T']:>8.1f} {h['P_in']:>10.1f} {h['status']:<10}")

# Summer vs winter
print()
print("=== Seasonal Temperature Comparison (after 1 hour) ===")
for T_amb, season in [(20, "Winter"), (35, "Summer"), (42, "Heat wave")]:
    m_hist = motor.simulate(motor_power, T_amb, duration=3600)
    final_T = m_hist[-1]["T"]
    margin = motor.T_max - final_T
    print(f"{season:<12} Ambient: {T_amb} C | Motor: {final_T:.1f} C | "
          f"Margin: {margin:.1f} C {'OK' if margin > 10 else 'DANGER'}")`,
      challenge: 'Add a fan-cooled scenario: increase h from 50 to 150 W/m2K when the motor temperature exceeds 120 C. How much does forced cooling reduce the steady-state temperature? What size fan motor (in watts) would be needed to move enough air?',
      successHint: 'Thermal management is a critical constraint in every electrical system — from smartphone processors to power plant generators. The thermal time constant concept (how fast things heat up) governs design decisions in electronics cooling, building HVAC, and industrial process control.',
    },
    {
      title: 'Power grid interaction — the tram and the city\'s electricity',
      concept: `Kolkata's trams draw power from the city's electrical grid through dedicated substations. Each substation converts 11 kV AC to 600 V DC using a rectifier. When many trams accelerate simultaneously (rush hour), the demand spikes and can stress the grid.

The power demand is: **P_grid = N_trams * P_per_tram / eta_substation**. During morning rush, 60+ trams might be running, each drawing up to 150 kW — a total demand of **9 MW** from the grid. This is the equivalent of powering 3,000 households.

Grid-friendly design includes: staggering tram departures (avoid simultaneous acceleration), onboard energy storage (reduce peak demand), and regenerative braking (reduce net consumption). These strategies reduce the **peak-to-average ratio** of power demand, which is what the grid struggles with.`,
      analogy: 'The tram fleet is like a neighborhood of houses. If everyone turns on their air conditioner at the same time (rush hour), the electrical grid strains. If they stagger their use (smart scheduling), the total energy is the same but the peak demand is lower. Utilities charge industrial customers for peak demand, not just total energy.',
      storyConnection: 'CTC pays a significant demand charge to CESC (Calcutta Electric Supply Corporation) based on peak demand, not just energy consumed. A 10% reduction in peak demand could save Rs 50 lakh per year in demand charges alone — more than the energy savings. This financial incentive drives the interest in energy storage and smart scheduling.',
      checkQuestion: 'If 40 trams each draw 100 kW average but peak at 150 kW simultaneously, what is the peak-to-average ratio? What total peak demand does the grid see?',
      checkAnswer: 'Peak per tram = 150 kW, average = 100 kW. Peak-to-average ratio = 1.5. Total average = 40 * 100 = 4 MW. Total peak = 40 * 150 = 6 MW. The grid must be sized for 6 MW even though average demand is only 4 MW. Demand charges penalize this 2 MW of "waste capacity."',
      codeIntro: 'Simulate the tram fleet\'s aggregate power demand on the city grid across a full day.',
      code: `import numpy as np

# Fleet power demand simulation

class TramFleet:
    def __init__(self, n_trams, P_accel_kW, P_cruise_kW, P_stop_kW):
        self.n = n_trams
        self.P_accel = P_accel_kW
        self.P_cruise = P_cruise_kW
        self.P_stop = P_stop_kW

    def single_tram_power(self, t_in_cycle):
        """Power draw at point in stop-to-stop cycle (120s total)"""
        if t_in_cycle < 20:
            return self.P_accel
        elif t_in_cycle < 80:
            return self.P_cruise
        elif t_in_cycle < 100:
            return self.P_stop * 0.5  # coasting
        else:
            return self.P_stop  # stopped

    def fleet_demand(self, time_s, schedule_offsets):
        """Total fleet demand at a given time"""
        total = 0
        for offset in schedule_offsets:
            cycle_pos = (time_s + offset) % 120
            total += self.single_tram_power(cycle_pos)
        return total

fleet = TramFleet(n_trams=60, P_accel_kW=150, P_cruise_kW=50, P_stop_kW=5)

# Scenario 1: Random offsets (no coordination)
np.random.seed(42)
random_offsets = np.random.uniform(0, 120, 60)

# Scenario 2: Evenly staggered (coordinated)
staggered_offsets = np.linspace(0, 120, 60, endpoint=False)

# Simulate one hour
duration = 3600
dt = 1
times = np.arange(0, duration, dt)

demand_random = [fleet.fleet_demand(t, random_offsets) for t in times]
demand_staggered = [fleet.fleet_demand(t, staggered_offsets) for t in times]

print("=== Fleet Power Demand Analysis (60 trams) ===")
print()

for label, demand in [("Random scheduling", demand_random),
                       ("Staggered scheduling", demand_staggered)]:
    avg = np.mean(demand)
    peak = np.max(demand)
    min_d = np.min(demand)
    par = peak / avg

    print(f"--- {label} ---")
    print(f"  Average demand: {avg:.0f} kW ({avg/1000:.1f} MW)")
    print(f"  Peak demand:    {peak:.0f} kW ({peak/1000:.1f} MW)")
    print(f"  Minimum demand: {min_d:.0f} kW")
    print(f"  Peak/Average:   {par:.2f}")
    print()

# Time-of-day demand profile
print("=== 24-Hour Demand Profile ===")
print(f"{'Hour':>4} {'Trams':>6} {'Avg (MW)':>10} {'Peak (MW)':>10}")
print("-" * 32)

hourly_trams = [
    5, 3, 2, 2, 5, 15, 40, 55, 60, 50,  # 0-9
    45, 45, 50, 45, 40, 45, 55, 60, 55, 45,  # 10-19
    30, 20, 12, 8  # 20-23
]

daily_energy = 0
peak_demand = 0

for hour, n_active in enumerate(hourly_trams):
    offsets = np.linspace(0, 120, max(1, n_active), endpoint=False)
    hourly_demand = [fleet.fleet_demand(t, offsets[:n_active])
                     for t in range(0, 3600, 10)]
    avg_mw = np.mean(hourly_demand) / 1000
    peak_mw = np.max(hourly_demand) / 1000
    daily_energy += avg_mw  # MWh (1 hour)
    peak_demand = max(peak_demand, peak_mw)
    if 5 <= hour <= 22:
        print(f"{hour:>4} {n_active:>6} {avg_mw:>8.2f} {peak_mw:>8.2f}")

print(f"\nDaily energy: {daily_energy:.1f} MWh")
print(f"Peak demand:  {peak_demand:.2f} MW")

# Cost analysis
energy_rate = 8    # Rs per kWh
demand_rate = 500  # Rs per kW of peak demand per month

monthly_energy_cost = daily_energy * 1000 * 30 * energy_rate
monthly_demand_cost = peak_demand * 1000 * demand_rate
total_monthly = monthly_energy_cost + monthly_demand_cost

print(f"\n=== Monthly Electricity Bill ===")
print(f"Energy charge: Rs {monthly_energy_cost/1e5:.1f} lakh")
print(f"Demand charge: Rs {monthly_demand_cost/1e5:.1f} lakh")
print(f"Total:         Rs {total_monthly/1e5:.1f} lakh")
print(f"\nDemand charge is {monthly_demand_cost/total_monthly*100:.0f}% of total!")
print("Reducing peak demand saves more than reducing total energy.")`,
      challenge: 'Add a 2 MW battery at each of the 5 substations. The battery absorbs excess regenerated energy and releases it during peak demand, shaving the peak by up to 2 MW. Calculate the new demand charge and the battery payback period (assume Rs 1 crore per MW of battery capacity).',
      successHint: 'Grid interaction and demand management are among the most important topics in modern energy engineering. Smart grids, electric vehicle charging, and renewable energy integration all face the same challenge: matching time-varying supply with time-varying demand while minimising peak stress on the grid.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Power efficiency, regenerative braking, and grid interaction</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to analyse energy efficiency, thermal management, and power grid interaction for the Kolkata tram system.
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
