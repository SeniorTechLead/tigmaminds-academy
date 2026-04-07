import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NagarjunaLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Turbine types — Francis vs Pelton vs Kaplan',
      concept: `Different dam configurations need different turbine designs. The three main types are: **Francis turbines** (best for medium head, 30-700 m — the most common worldwide), **Pelton turbines** (best for high head, >300 m — uses water jets hitting buckets), and **Kaplan turbines** (best for low head, <80 m — like a ship propeller in reverse).

A Francis turbine is a **reaction turbine**: water flows radially inward through guide vanes, pushes spiral-shaped runner blades, and exits axially downward. Both pressure and velocity change across the runner. A Pelton turbine is an **impulse turbine**: a high-velocity jet hits cup-shaped buckets, and only velocity changes (pressure is atmospheric throughout).

The key parameter for selecting a turbine type is **specific speed** Ns = N * sqrt(P) / H^(5/4), where N is rotational speed (rpm), P is power (kW), and H is head (m). Low Ns favors Pelton, medium Ns favors Francis, and high Ns favors Kaplan.

📚 *Specific speed Ns is a dimensionless parameter that characterizes the turbine shape for optimal efficiency. Each turbine type has a range of Ns where it operates best.*`,
      analogy: 'Think of three ways to use a water hose. A Pelton turbine is like directing a narrow jet at a waterwheel — the jet pushes the cups. A Francis turbine is like water spiraling down a drain, spinning a pinwheel placed in the drain. A Kaplan turbine is like an underwater windmill — the water flows straight through, spinning the blades.',
      storyConnection: 'Nagarjuna Sagar uses Francis turbines — the ideal choice for its medium head of about 100 m. Each of the 8 turbines generates about 102 MW. The Francis design was chosen because it offers 90-95% efficiency at medium head and can handle variable flow rates by adjusting the guide vanes.',
      checkQuestion: 'A dam has a head of 500 m and generates 200 MW. Would you choose a Francis or Pelton turbine? Why?',
      checkAnswer: 'Pelton turbine. At 500 m head, the water velocity is v = sqrt(2*9.81*500) = 99 m/s — too fast for a Francis turbine runner. A Pelton turbine converts this high-velocity jet into rotational energy efficiently using impulse buckets.',
      codeIntro: 'Compare turbine types and select the optimal turbine for different dam configurations.',
      code: `import numpy as np

# Turbine type selection and performance comparison

def specific_speed(rpm, power_kw, head_m):
    """Calculate specific speed Ns."""
    return rpm * np.sqrt(power_kw) / head_m ** 1.25

def recommend_turbine(head):
    """Recommend turbine type based on head."""
    if head > 300:
        return "Pelton"
    elif head > 60:
        return "Francis"
    else:
        return "Kaplan"

def turbine_efficiency(turbine_type, load_fraction):
    """Approximate efficiency vs load (fraction of rated capacity)."""
    if turbine_type == "Francis":
        # Good efficiency 60-100% load, drops at low load
        peak = 0.93
        if load_fraction < 0.3:
            return peak * load_fraction / 0.3 * 0.7
        return peak * (1 - 0.1 * (1 - load_fraction)**2)
    elif turbine_type == "Pelton":
        # Maintains efficiency well at partial load
        peak = 0.91
        return peak * (1 - 0.05 * (1 - load_fraction)**2)
    else:  # Kaplan
        # Adjustable blades maintain efficiency
        peak = 0.92
        return peak * (1 - 0.08 * (1 - load_fraction)**2)

# Famous dams and their turbines
dams = [
    ("Nagarjuna Sagar", 100, 816, 8, "Francis"),
    ("Three Gorges", 80, 22500, 32, "Francis"),
    ("Itaipu", 118, 14000, 20, "Francis"),
    ("Hoover Dam", 180, 2080, 17, "Francis"),
    ("Grand Coulee", 100, 6809, 33, "Francis/Kaplan"),
    ("Bieudron (Swiss)", 1869, 1200, 3, "Pelton"),
]

print("=== World Dam Turbine Comparison ===")
print(f"{'Dam':<22} {'Head':>6} {'Power':>8} {'Turbines':>9} {'Type':<15}")
print("-" * 62)
for name, head, power, n, t_type in dams:
    print(f"{name:<22} {head:>4} m {power:>6} MW {n:>9} {t_type}")

print()
# Turbine selection guide
print("=== Turbine Selection Guide ===")
print(f"{'Head (m)':<12} {'Recommended':<12} {'Max velocity':>12} {'Reason'}")
print("-" * 55)

for head in [10, 30, 60, 100, 200, 500, 1000, 1869]:
    v_max = np.sqrt(2 * 9.81 * head)
    rec = recommend_turbine(head)
    reason = "low v, high Q" if head < 60 else "medium v & Q" if head < 300 else "high v jet"
    print(f"{head:<12} {rec:<12} {v_max:>10.1f} m/s {reason}")

print()
# Efficiency at different loads
print("=== Partial Load Efficiency ===")
print(f"{'Load %':<10}", end="")
for t_type in ["Francis", "Pelton", "Kaplan"]:
    print(f" {t_type:>10}", end="")
print()
print("-" * 42)

for load_pct in [20, 40, 60, 80, 100]:
    load_frac = load_pct / 100
    print(f"{load_pct:<10}", end="")
    for t_type in ["Francis", "Pelton", "Kaplan"]:
        eff = turbine_efficiency(t_type, load_frac)
        print(f" {eff*100:>9.1f}%", end="")
    print()

print()
print("Pelton maintains efficiency best at partial load — ideal for")
print("variable demand. Francis has highest peak efficiency but drops")
print("at low load. Kaplan adjustable blades help at partial load.")`,
      challenge: 'A pumped-storage plant needs turbines that can also work as pumps (reversible Francis turbines). If the head is 400 m and the power is 1000 MW, calculate the specific speed. Is this in the Francis or Pelton range? (This is why pumped-storage plants at very high head are challenging.)',
      successHint: 'Turbine selection is one of the most important decisions in hydroelectric engineering. The wrong turbine type can cost 10-20% efficiency — billions of dollars over the dam lifetime. You just used the same decision framework that turbine manufacturers use.',
    },
    {
      title: 'Turbine efficiency — the Euler turbomachinery equation',
      concept: `The **Euler turbomachinery equation** gives the theoretical power extracted by a turbine: **P = rho * Q * (u1*c_theta1 - u2*c_theta2)**, where u is the blade tip speed and c_theta is the tangential component of the water velocity at the inlet (1) and outlet (2).

For maximum efficiency, the water should leave the runner with **zero swirl** — all the angular momentum has been transferred to the runner. This means c_theta2 = 0, and the power simplifies to P = rho * Q * u1 * c_theta1.

Real turbines achieve 88-95% efficiency. Losses come from: (1) **hydraulic losses** (friction in the runner, draft tube, and casing), (2) **volumetric losses** (water leaking past seals), and (3) **mechanical losses** (bearing friction, windage). The total efficiency is the product: eta_total = eta_hydraulic * eta_volumetric * eta_mechanical.

📚 *The Euler equation is derived from Newton second law applied to angular momentum: torque = rate of change of angular momentum. For steady flow through a turbine, this gives the elegant result P = rho * Q * (u1*c_theta1 - u2*c_theta2).*`,
      analogy: 'Imagine a revolving door. People push the door panels as they enter (giving angular momentum). The door spins (absorbing that momentum). If people exit without pushing back (zero exit swirl), all their push energy went into spinning the door. That is maximum efficiency — extracting all the fluid angular momentum.',
      storyConnection: 'The Francis turbines at Nagarjuna Sagar have precisely curved runner blades designed to extract maximum angular momentum from the water. The guide vanes (wicket gates) upstream of the runner create the initial swirl (c_theta1). The draft tube downstream recovers residual kinetic energy. Together, these components achieve about 93% efficiency.',
      checkQuestion: 'A turbine has blade tip speed u1 = 30 m/s and the water enters with tangential velocity c_theta1 = 25 m/s. The flow rate is 50 m^3/s. What is the theoretical power?',
      checkAnswer: 'P = 1000 * 50 * 30 * 25 = 37,500,000 W = 37.5 MW. If the water exits with c_theta2 = 5 m/s instead of zero: P = 1000 * 50 * (30*25 - 30*5) = 1000 * 50 * 600 = 30 MW — a 20% loss from imperfect exit conditions.',
      codeIntro: 'Apply the Euler turbomachinery equation and compute turbine efficiency breakdown.',
      code: `import numpy as np

# Euler turbomachinery equation and efficiency analysis

rho = 1000  # kg/m^3
g = 9.81

def euler_power(Q, u1, c_theta1, u2=None, c_theta2=0):
    """Theoretical power from Euler turbomachinery equation.
    P = rho * Q * (u1 * c_theta1 - u2 * c_theta2)
    """
    if u2 is None:
        u2 = u1  # same radius (simplified)
    return rho * Q * (u1 * c_theta1 - u2 * c_theta2)

def available_power(Q, head, efficiency=1.0):
    """Maximum available power from potential energy."""
    return rho * Q * g * head * efficiency

# Nagarjuna Sagar turbine analysis
print("=== Euler Turbomachinery Analysis ===")
print("Nagarjuna Sagar Francis Turbine")
print()

Q = 100  # m^3/s per turbine
head = 100  # m
rpm = 136.4  # rotational speed

# Runner dimensions (typical for this size)
D1 = 4.5  # inlet diameter (m)
D2 = 2.5  # outlet diameter (m)

# Blade tip speeds
u1 = np.pi * D1 * rpm / 60
u2 = np.pi * D2 * rpm / 60

# Available power
P_available = available_power(Q, head)

# For maximum efficiency, design c_theta1 such that all energy is extracted
# P_euler = rho * Q * u1 * c_theta1 = P_available
c_theta1_ideal = P_available / (rho * Q * u1)

print(f"Flow rate: {Q} m^3/s | Head: {head} m | RPM: {rpm}")
print(f"Runner inlet diameter: {D1} m | Outlet: {D2} m")
print(f"Blade tip speed (inlet): {u1:.1f} m/s")
print(f"Blade tip speed (outlet): {u2:.1f} m/s")
print(f"Available power: {P_available/1e6:.1f} MW")
print(f"Ideal inlet swirl velocity: {c_theta1_ideal:.1f} m/s")
print()

# Effect of exit swirl on efficiency
print("=== Exit Swirl vs Efficiency ===")
print(f"{'c_theta2 (m/s)':<16} {'Power (MW)':>11} {'Efficiency':>11}")
print("-" * 40)

for c_t2 in [0, 2, 5, 8, 10, 15]:
    P = euler_power(Q, u1, c_theta1_ideal, u2, c_t2)
    eff = P / P_available * 100
    print(f"{c_t2:<16} {P/1e6:>11.1f} {eff:>9.1f}%")

print()
# Efficiency breakdown
print("=== Efficiency Breakdown ===")
eta_hydraulic = 0.94
eta_volumetric = 0.98
eta_mechanical = 0.99
eta_generator = 0.97
eta_total = eta_hydraulic * eta_volumetric * eta_mechanical * eta_generator

components = [
    ("Hydraulic (runner+draft tube)", eta_hydraulic),
    ("Volumetric (seal leakage)", eta_volumetric),
    ("Mechanical (bearings)", eta_mechanical),
    ("Generator", eta_generator),
    ("TOTAL", eta_total),
]

cumulative = 1.0
print(f"{'Component':<35} {'Efficiency':>10} {'Cumulative':>11} {'Loss (MW)':>10}")
print("-" * 68)

for name, eta in components:
    if name == "TOTAL":
        loss = P_available * (1 - eta_total) / 1e6
        print(f"{'─'*35} {'─'*10} {'─'*11} {'─'*10}")
        print(f"{name:<35} {eta_total*100:>9.1f}% {eta_total*100:>10.1f}% {loss:>8.1f}")
    else:
        loss = P_available * cumulative * (1 - eta) / 1e6
        cumulative *= eta
        print(f"{name:<35} {eta*100:>9.1f}% {cumulative*100:>10.1f}% {loss:>8.1f}")

print(f"\\nNet power output: {P_available * eta_total / 1e6:.1f} MW per turbine")
print(f"Total plant ({8} turbines): {8 * P_available * eta_total / 1e6:.0f} MW")`,
      challenge: 'If the guide vane angle is misset, c_theta1 is 10% less than ideal. How much power is lost? Now calculate: if bearing friction doubles (eta_mechanical drops to 0.98), how does total efficiency change? Which loss has bigger impact?',
      successHint: 'The Euler turbomachinery equation governs every rotating fluid machine: turbines, pumps, compressors, fans, and jet engines. The efficiency breakdown analysis you performed is how power plant operators monitor turbine health — a drop in any component signals a maintenance need.',
    },
    {
      title: 'Francis turbine design — blade angles and velocity triangles',
      concept: `Designing a Francis turbine runner requires **velocity triangles** — vector diagrams showing the water velocity relative to the stationary guide vanes and the rotating runner blades. The velocity at any point has three components: **absolute velocity c** (seen by a stationary observer), **blade velocity u** (due to rotation), and **relative velocity w** (seen by someone riding on the blade).

These are related by the vector equation: **c = u + w**. At the inlet, the guide vanes set the absolute velocity direction. The runner blade inlet angle must match the relative velocity direction — otherwise the water slams into the blade edge, causing losses and cavitation.

The **blade angle beta** at the inlet and outlet determines how the water interacts with the runner. The inlet angle controls how much angular momentum the water enters with. The outlet angle controls how much remains — ideally zero (no exit swirl).

📚 *Velocity triangles: c (absolute) = u (blade) + w (relative). The tangential component of c determines power transfer. The radial component determines flow rate. Good turbine design aligns the blade angle with the relative velocity to avoid shock losses.*`,
      analogy: 'Imagine running alongside a moving walkway at an airport while someone on the walkway throws a ball to you. The ball velocity you see (relative) is different from its actual velocity (absolute) because you are moving. The blade angle of a turbine must account for this same relative motion — the blade must be angled to match the water direction as seen by the spinning blade.',
      storyConnection: 'The 8 Francis turbines at Nagarjuna Sagar each have precisely machined runner blades with inlet and outlet angles computed using velocity triangle analysis. The guide vanes (wicket gates) can be adjusted to change the inlet velocity triangle, allowing the turbine to operate efficiently over a range of flow rates — essential for matching varying electricity demand.',
      checkQuestion: 'A turbine blade tip moves at u = 30 m/s. Water enters with absolute velocity c = 35 m/s at 30 degrees from radial. What is the tangential component of c?',
      checkAnswer: 'c_theta = c * sin(30) = 35 * 0.5 = 17.5 m/s. c_radial = c * cos(30) = 35 * 0.866 = 30.3 m/s. The relative tangential velocity is w_theta = c_theta - u = 17.5 - 30 = -12.5 m/s (the blade is moving faster than the water tangentially).',
      codeIntro: 'Compute velocity triangles and optimize blade angles for a Francis turbine.',
      code: `import numpy as np

# Francis turbine velocity triangles and blade design

def velocity_triangle_inlet(Q, D1, b1, u1, alpha1):
    """
    Compute inlet velocity triangle.
    Q: flow rate (m^3/s)
    D1: runner inlet diameter (m)
    b1: runner inlet height (m)
    u1: blade tip speed (m/s)
    alpha1: guide vane angle from radial (degrees)
    """
    # Flow area
    A1 = np.pi * D1 * b1

    # Radial (meridional) velocity
    c_m1 = Q / A1

    # Absolute velocity components
    c_theta1 = c_m1 * np.tan(np.radians(alpha1))
    c1 = np.sqrt(c_m1**2 + c_theta1**2)

    # Relative velocity
    w_theta1 = c_theta1 - u1
    w_m1 = c_m1
    w1 = np.sqrt(w_m1**2 + w_theta1**2)

    # Blade angle at inlet
    beta1 = np.degrees(np.arctan2(w_theta1, w_m1))

    return {
        "c_m1": c_m1, "c_theta1": c_theta1, "c1": c1,
        "w_theta1": w_theta1, "w1": w1, "beta1": beta1,
        "u1": u1,
    }

def velocity_triangle_outlet(Q, D2, b2, u2, beta2):
    """
    Compute outlet velocity triangle.
    beta2: runner blade outlet angle from radial (degrees)
    """
    A2 = np.pi * D2 * b2
    c_m2 = Q / A2
    w_theta2 = c_m2 * np.tan(np.radians(beta2))
    c_theta2 = u2 + w_theta2
    c2 = np.sqrt(c_m2**2 + c_theta2**2)
    w2 = np.sqrt(c_m2**2 + w_theta2**2)

    return {
        "c_m2": c_m2, "c_theta2": c_theta2, "c2": c2,
        "w_theta2": w_theta2, "w2": w2, "beta2": beta2,
        "u2": u2,
    }

# Nagarjuna Sagar turbine parameters
Q = 100        # m^3/s
rpm = 136.4
D1 = 4.5       # inlet diameter (m)
D2 = 2.5       # outlet diameter (m)
b1 = 1.2       # inlet height (m)
b2 = 1.5       # outlet height (m)

u1 = np.pi * D1 * rpm / 60
u2 = np.pi * D2 * rpm / 60

print("=== Francis Turbine Velocity Triangles ===")
print(f"Q = {Q} m^3/s | RPM = {rpm} | D1 = {D1} m | D2 = {D2} m")
print(f"Blade tip speed: u1 = {u1:.1f} m/s, u2 = {u2:.1f} m/s")
print()

# Sweep guide vane angle to find optimal
print("=== Inlet Triangle vs Guide Vane Angle ===")
print(f"{'Alpha1':>8} {'c_m1':>8} {'c_th1':>8} {'c1':>8} {'w1':>8} {'Beta1':>8} {'Power':>10}")
print("-" * 62)

rho = 1000
g = 9.81
head = 100

for alpha in range(10, 55, 5):
    inlet = velocity_triangle_inlet(Q, D1, b1, u1, alpha)
    # Assume zero exit swirl for max efficiency
    power = rho * Q * u1 * inlet["c_theta1"] / 1e6
    eff = power / (rho * Q * g * head / 1e6) * 100
    print(f"{alpha:>6} deg {inlet['c_m1']:>7.1f} {inlet['c_theta1']:>7.1f} "
          f"{inlet['c1']:>7.1f} {inlet['w1']:>7.1f} {inlet['beta1']:>6.1f} deg "
          f"{power:>7.1f} MW")

print()
# Design point: choose alpha1 for 100% head utilization
target_power = rho * Q * g * head  # W
c_theta1_needed = target_power / (rho * Q * u1)
c_m1 = Q / (np.pi * D1 * b1)
alpha1_design = np.degrees(np.arctan2(c_theta1_needed, c_m1))

print(f"=== Design Point ===")
print(f"Required c_theta1: {c_theta1_needed:.1f} m/s")
print(f"Design guide vane angle: {alpha1_design:.1f} degrees")

inlet = velocity_triangle_inlet(Q, D1, b1, u1, alpha1_design)
print(f"Inlet blade angle: {inlet['beta1']:.1f} degrees")

# Outlet for zero swirl
outlet = velocity_triangle_outlet(Q, D2, b2, u2, -20)
print(f"\\nOutlet exit swirl: {outlet['c_theta2']:.1f} m/s")
print(f"Outlet blade angle: {outlet['beta2']:.1f} degrees")`,
      challenge: 'At partial load (Q = 50 m^3/s instead of 100), the guide vane angle changes. What alpha1 is needed to maintain the same blade inlet angle beta1? (The blade angle is fixed — you can only adjust the guide vanes.) This is how turbines maintain efficiency at partial load.',
      successHint: 'Velocity triangle analysis is the core tool of turbomachinery design. Every jet engine, gas turbine, pump, and hydroelectric turbine is designed using velocity triangles. You just performed the same analysis that GE, Siemens, and Andritz engineers use when designing turbines.',
    },
    {
      title: 'Power output calculation — from water to watts',
      concept: `The complete power calculation chain for a hydroelectric plant is: **P_electrical = rho * Q * g * H_net * eta_turbine * eta_generator**, where H_net is the net head (gross head minus friction losses) and the efficiencies account for all losses.

The **capacity factor** is the ratio of actual annual energy production to the theoretical maximum (rated power * 8760 hours). Hydroelectric plants typically have capacity factors of 30-60%, depending on water availability. A plant with 816 MW rated capacity and 40% capacity factor produces 816 * 0.40 * 8760 = 2,860,000 MWh per year.

The **levelized cost of energy (LCOE)** divides the total lifetime cost (construction + maintenance) by total lifetime energy production. Hydroelectric LCOE is typically $30-80/MWh — competitive with fossil fuels and cheaper than most renewables.

📚 *Capacity factor = actual energy produced / (rated power * time period). A 40% capacity factor means the plant produces, on average, 40% of its maximum possible output — limited by water availability, maintenance downtime, and demand patterns.*`,
      analogy: 'Think of a car engine rated at 200 horsepower. You rarely use full power — mostly cruising at 50 hp, sometimes accelerating at 150 hp. Your average power usage divided by the maximum is your engine capacity factor. A dam is the same: it rarely runs at full power, and its capacity factor depends on how much water is available and how much electricity is needed.',
      storyConnection: 'Nagarjuna Sagar Dam has a rated capacity of 816 MW but its annual generation varies dramatically with monsoon rainfall. In a good monsoon year, generation can exceed 3,500 GWh. In a drought year, it might drop to 1,500 GWh. The capacity factor ranges from 20% to 50%, making revenue planning challenging for the Telangana State power utility.',
      checkQuestion: 'A dam produces 2,000 GWh per year with a rated capacity of 500 MW. What is its capacity factor?',
      checkAnswer: 'Maximum possible: 500 MW * 8760 hours = 4,380,000 MWh = 4,380 GWh. Capacity factor = 2,000 / 4,380 = 45.7%.',
      codeIntro: 'Calculate complete power output, annual energy, capacity factor, and economics for a hydroelectric plant.',
      code: `import numpy as np

# Complete hydroelectric power calculation

rho = 1000
g = 9.81

def hydro_plant_output(
    gross_head, flow_rate, n_turbines,
    friction_loss_pct=3, eta_turbine=0.93,
    eta_generator=0.97
):
    """Calculate power output for a hydroelectric plant."""
    net_head = gross_head * (1 - friction_loss_pct / 100)
    Q_per_turbine = flow_rate / n_turbines
    P_per_turbine = rho * Q_per_turbine * g * net_head * eta_turbine * eta_generator
    P_total = P_per_turbine * n_turbines

    return {
        "net_head": net_head,
        "Q_per_turbine": Q_per_turbine,
        "P_per_turbine_MW": P_per_turbine / 1e6,
        "P_total_MW": P_total / 1e6,
        "eta_overall": eta_turbine * eta_generator * (1 - friction_loss_pct / 100),
    }

# Nagarjuna Sagar
print("=== Nagarjuna Sagar Power Calculation ===")
result = hydro_plant_output(
    gross_head=100, flow_rate=800, n_turbines=8,
    friction_loss_pct=3, eta_turbine=0.93, eta_generator=0.97
)

print(f"Gross head: 100 m | Net head: {result['net_head']:.0f} m")
print(f"Total flow: 800 m^3/s ({result['Q_per_turbine']:.0f} per turbine)")
print(f"Per turbine: {result['P_per_turbine_MW']:.1f} MW")
print(f"Total plant: {result['P_total_MW']:.0f} MW")
print(f"Overall efficiency: {result['eta_overall']*100:.1f}%")
print()

# Monthly generation with varying water availability
print("=== Monthly Generation Estimate ===")
# Monsoon pattern for Krishna River basin
monthly_flow_fraction = [
    0.15, 0.10, 0.08, 0.05, 0.05, 0.20,  # Jan-Jun (dry season)
    0.60, 0.90, 1.00, 0.80, 0.50, 0.25,  # Jul-Dec (monsoon)
]
months = ["Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"]
rated_flow = 800  # m^3/s

print(f"{'Month':<6} {'Flow %':>7} {'Flow (m3/s)':>12} {'Power (MW)':>11} {'Energy (GWh)':>13}")
print("-" * 51)

annual_energy = 0
for i, (month, frac) in enumerate(zip(months, monthly_flow_fraction)):
    flow = rated_flow * frac
    out = hydro_plant_output(100, flow, 8)
    hours = 730  # avg hours per month
    energy_gwh = out["P_total_MW"] * hours / 1000
    annual_energy += energy_gwh
    print(f"{month:<6} {frac*100:>6.0f}% {flow:>12.0f} {out['P_total_MW']:>11.0f} {energy_gwh:>13.1f}")

print(f"\\nAnnual generation: {annual_energy:,.0f} GWh")
capacity_factor = annual_energy / (result["P_total_MW"] * 8.76)
print(f"Capacity factor: {capacity_factor:.1%}")

print()
# Economics
print("=== Economic Analysis ===")
construction_cost = 5e9  # $5 billion (approximate)
annual_om = 50e6         # $50 million O&M per year
lifetime_years = 100
electricity_price = 0.04  # $/kWh

annual_revenue = annual_energy * 1e6 * electricity_price  # GWh to kWh
lifetime_energy = annual_energy * lifetime_years
lcoe = (construction_cost + annual_om * lifetime_years) / (lifetime_energy * 1e6)

print(f"Construction cost: {construction_cost/1e9:.0f} billion")
print(f"Annual O&M: {annual_om/1e6:.0f} million")
print(f"Annual energy: {annual_energy:,.0f} GWh")
print(f"Annual revenue: {annual_revenue/1e6:,.0f} million")
print(f"Simple payback: {construction_cost/annual_revenue:.0f} years")
print(f"LCOE: {lcoe*1000:.1f}/MWh")
print(f"Plant lifetime: {lifetime_years} years")`,
      challenge: 'Climate change may reduce Krishna River flow by 15% over the next 50 years. Recalculate the capacity factor and LCOE with 15% less water. How does this affect the economic viability? Should new dams be designed with climate change in mind?',
      successHint: 'You just performed a complete techno-economic analysis of a hydroelectric plant — the same analysis that investment banks, utilities, and government agencies use when deciding whether to build a dam. The interplay of engineering (efficiency, head, flow) and economics (LCOE, capacity factor, revenue) determines whether a project gets built.',
    },
    {
      title: 'Cavitation — the destructive power of vapor bubbles',
      concept: `**Cavitation** occurs when the local pressure in a fluid drops below the **vapor pressure** — the pressure at which water boils at that temperature. Tiny vapor bubbles form, travel to higher-pressure regions, and violently **collapse**. Each collapse creates a microscopic shock wave and a jet of water hitting the surface at up to 500 m/s.

Over time, millions of these micro-explosions erode metal surfaces — pitting, cratering, and eventually destroying turbine blades. Cavitation damage is one of the most serious problems in hydroelectric engineering, costing millions of dollars in turbine repairs.

Cavitation is most likely where velocity is highest and pressure is lowest: at the turbine blade tips, on the suction side of blades, and in the draft tube. The **Thoma cavitation parameter** sigma = (P_atm - P_vapor) / (rho * g * H) - h_s / H determines whether cavitation will occur, where h_s is the height of the turbine above the tailwater.

📚 *Vapor pressure of water at 20°C is about 2,340 Pa. At 40°C it rises to 7,380 Pa. Warmer water cavitates more easily because its vapor pressure is higher, so it takes less pressure drop to form bubbles.*`,
      analogy: 'Shake a bottle of carbonated water vigorously. When you open the cap, the pressure drops and bubbles form violently — that is essentially cavitation. In a turbine, fast-moving water creates low-pressure zones where bubbles form. When these bubbles hit higher-pressure areas, they collapse violently — like millions of tiny hammers hitting the blade surface.',
      storyConnection: 'The Francis turbines at Nagarjuna Sagar must be carefully designed to avoid cavitation. The turbines are set below the tailwater level (submerged) to maintain positive pressure everywhere. During the monsoon when flow is maximum, operators must be careful not to exceed the cavitation limit — running too much water through the turbines creates dangerously low pressures.',
      checkQuestion: 'Water temperature is 25°C (vapor pressure 3,170 Pa). Atmospheric pressure is 101,325 Pa. If the local pressure at a turbine blade drops to 5,000 Pa, will cavitation occur?',
      checkAnswer: 'Yes! The local pressure (5,000 Pa) is above the vapor pressure (3,170 Pa), so technically no cavitation yet. But the margin is only 1,830 Pa — very close. In practice, engineers want a much larger margin because of turbulent pressure fluctuations.',
      codeIntro: 'Calculate cavitation risk for different turbine operating conditions and water temperatures.',
      code: `import numpy as np

# Cavitation analysis for hydroelectric turbines

g = 9.81
rho = 1000
P_atm = 101325  # Pa

# Water vapor pressure vs temperature
def vapor_pressure(temp_C):
    """Antoine equation approximation for water vapor pressure (Pa)."""
    # Simplified: P_v roughly doubles every 10°C
    return 610.8 * np.exp(17.27 * temp_C / (temp_C + 237.3))

print("=== Water Vapor Pressure vs Temperature ===")
print(f"{'Temp (C)':<10} {'P_vapor (Pa)':>13} {'P_vapor (kPa)':>14}")
print("-" * 39)
for T in range(5, 50, 5):
    Pv = vapor_pressure(T)
    print(f"{T:<10} {Pv:>13.0f} {Pv/1000:>14.2f}")

print()
# Thoma cavitation parameter
def thoma_sigma(head, h_s, temp_C):
    """
    Thoma cavitation parameter.
    head: net head (m)
    h_s: turbine setting above tailwater (m)
    temp_C: water temperature
    sigma = (P_atm - P_v)/(rho*g*H) - h_s/H
    """
    P_v = vapor_pressure(temp_C)
    return (P_atm - P_v) / (rho * g * head) - h_s / head

# Critical sigma for Francis turbines (depends on specific speed)
def critical_sigma_francis(Ns):
    """Approximate critical sigma for Francis turbines."""
    return 0.0432 * (Ns / 100) ** 1.46

print("=== Cavitation Risk Analysis ===")
head = 100  # m
Ns = 200    # specific speed

sigma_critical = critical_sigma_francis(Ns)
print(f"Head: {head} m | Specific speed: {Ns}")
print(f"Critical sigma: {sigma_critical:.4f}")
print()

print(f"{'Turbine setting':>16} {'Temp':>6} {'Sigma':>8} {'Critical':>9} {'Status'}")
print("-" * 50)

for h_s in [-2, 0, 2, 4, 6, 8]:
    for temp in [15, 25, 35]:
        sigma = thoma_sigma(head, h_s, temp)
        status = "SAFE" if sigma > sigma_critical * 1.2 else "MARGINAL" if sigma > sigma_critical else "CAVITATION!"
        print(f"{h_s:>14} m {temp:>4} C {sigma:>8.4f} {sigma_critical:>9.4f} {status}")
    print()

# Recommend turbine setting
print("=== Recommended Turbine Setting ===")
for temp in [15, 20, 25, 30, 35]:
    # Find h_s where sigma = 1.3 * sigma_critical (30% safety margin)
    target_sigma = sigma_critical * 1.3
    P_v = vapor_pressure(temp)
    # target = (P_atm - P_v)/(rho*g*H) - h_s/H
    # h_s = H * ((P_atm - P_v)/(rho*g*H) - target)
    h_s_max = head * ((P_atm - P_v) / (rho * g * head) - target_sigma)
    print(f"  At {temp}C: turbine must be set at or below {h_s_max:.1f} m "
          f"above tailwater")

print()
print("Negative values mean the turbine should be BELOW tailwater level.")
print("This is why many Francis turbines are submerged — to prevent cavitation.")`,
      challenge: 'At high altitude (e.g., 2000 m), atmospheric pressure drops to about 80,000 Pa. Recalculate the maximum turbine setting for head = 100 m at 25 degrees C. By how many metres must the turbine be lowered compared to sea level? This is a real constraint for mountain hydroelectric projects.',
      successHint: 'Cavitation analysis is critical for every hydraulic machine: turbines, pumps, ship propellers, and even medical devices (ultrasonic cleaners use controlled cavitation). You just performed the same analysis that prevents multi-million-dollar turbine damage at real power plants.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Turbine design, efficiency, and power calculation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises model turbine selection, blade design, power output, and cavitation.
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
