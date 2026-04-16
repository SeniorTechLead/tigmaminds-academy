import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NagarjunaLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Potential energy — the stored power of elevated water',
      concept: `Water held behind a dam has **gravitational potential energy** — energy stored by virtue of its elevation. The formula is: **PE = m * g * h**, where m is the mass of water, g is gravitational acceleration, and h is the height the water can fall.

For a hydroelectric dam, this potential energy is converted to kinetic energy as water falls, then to electrical energy in a generator. The power available depends on two factors: the **head** (height of water above the turbine) and the **flow rate** (volume of water per second). More head or more flow means more power.

At Nagarjuna Sagar, with a maximum head of about 100 metres and a flow rate through the turbines of several hundred cubic metres per second, the potential energy conversion produces 816 MW of electricity — enough to power several million homes.

📚 *Potential energy PE = mgh. For water: m = rho * V (density times volume). So PE = rho * V * g * h. Power is energy per unit time: P = rho * Q * g * h, where Q is the volumetric flow rate (m^3/s).*`,
      analogy: 'Hold a ball at shoulder height. It has potential energy. Drop it, and that energy converts to kinetic energy (motion). The higher you hold the ball, the faster it hits the ground. A dam is the same: water held at height has potential energy, and the higher the dam, the more energy each litre of water releases when it falls through the turbines.',
      storyConnection: 'Nagarjuna Sagar Dam stores an enormous amount of potential energy. When electricity demand peaks (typically in the evening), gates open and water rushes through the turbines. During low demand (late night), flow is reduced to conserve water. The dam acts like a giant battery — storing energy as elevated water and releasing it on demand.',
      checkQuestion: 'One cubic metre of water (1000 kg) falls 100 m through a turbine. How much potential energy is released?',
      checkAnswer: 'PE = 1000 * 9.81 * 100 = 981,000 J = 981 kJ = about 0.27 kWh. So 1 cubic metre falling 100 m releases enough energy to run a 100W light bulb for 2.7 hours.',
      codeIntro: 'Calculate the potential energy and power available from water at different heights.',
      code: `import numpy as np

# Potential energy and hydroelectric power

rho = 1000  # kg/m^3
g = 9.81    # m/s^2

def potential_energy(volume_m3, height_m):
    """Potential energy of a volume of water at a given height (Joules)."""
    mass = rho * volume_m3
    return mass * g * height_m

def hydro_power(flow_rate_m3s, head_m, efficiency=1.0):
    """Hydroelectric power output (Watts).
    P = rho * Q * g * h * eta
    """
    return rho * flow_rate_m3s * g * head_m * efficiency

print("=== Potential Energy Calculator ===")
print(f"{'Volume (m^3)':<15} {'Height (m)':>11} {'Energy (MJ)':>12} {'Energy (kWh)':>13}")
print("-" * 53)

for vol, height in [(1, 10), (1, 50), (1, 100), (100, 100), (1000, 100), (1000, 124)]:
    pe = potential_energy(vol, height)
    kwh = pe / 3.6e6
    print(f"{vol:<15} {height:>11} {pe/1e6:>12.2f} {kwh:>13.3f}")

print()
print("=== Hydroelectric Power Output ===")
print("Nagarjuna Sagar: head = 100 m")
print()

head = 100  # m
efficiency = 0.90  # typical turbine + generator efficiency

print(f"{'Flow (m^3/s)':<14} {'Gross (MW)':>11} {'Net (MW)':>10} {'Daily (MWh)':>12} {'Homes*':>10}")
print("-" * 59)

for Q in [10, 50, 100, 200, 400, 600, 800]:
    gross = hydro_power(Q, head) / 1e6
    net = hydro_power(Q, head, efficiency) / 1e6
    daily = net * 24  # MWh per day
    homes = int(net * 1000 / 1.5)  # avg home uses ~1.5 kW
    print(f"{Q:<14} {gross:>11.1f} {net:>10.1f} {daily:>12,.0f} {homes:>10,}")

print()
print("* Assuming average household consumption of 1.5 kW")
print()

# Nagarjuna Sagar actual capacity
print("=== Nagarjuna Sagar Dam ===")
installed_capacity_mw = 816
turbines = 8
per_turbine = installed_capacity_mw / turbines
print(f"Installed capacity: {installed_capacity_mw} MW")
print(f"Turbines: {turbines} x {per_turbine:.0f} MW each")

# Back-calculate the flow rate
net_flow = installed_capacity_mw * 1e6 / (rho * g * head * efficiency)
print(f"Required flow rate: {net_flow:.0f} m^3/s")
print(f"  = {net_flow * 3600:,.0f} m^3/hour")
print(f"  = {net_flow * 86400 / 1e6:,.1f} million m^3/day")`,
      challenge: 'If the reservoir level drops 20 m (head decreases from 100 m to 80 m), by what percentage does the power output drop, assuming the same flow rate? Calculate for each flow rate. This is why drought reduces hydroelectric output — less head means less power per unit of water.',
      successHint: 'The power equation P = rho * Q * g * h * efficiency is the master equation of hydroelectric engineering. Every dam, every pumped-storage facility, and every micro-hydro system is designed using this formula. You just used the same tool that powers 16% of the world electricity.',
    },
    {
      title: 'Flow rate and continuity — what goes in must come out',
      concept: `The **continuity equation** states that for an incompressible fluid in a closed system, the flow rate must be the same at every point: **A1 * v1 = A2 * v2**, where A is the cross-sectional area of the pipe and v is the fluid velocity.

This means: when a pipe narrows, the water speeds up. When it widens, the water slows down. A pipe that is half the area must have twice the velocity. This is why you can make a garden hose spray faster by putting your thumb over the end — reducing the area increases the velocity.

In a dam, water flows from the wide reservoir through progressively narrower channels (penstocks) to the turbines. The continuity equation tells us exactly how fast the water moves at each point. At the turbine, the water velocity determines the force on the blades and therefore the power generated.

📚 *Volumetric flow rate Q = A * v (area times velocity). Continuity: Q is constant along a pipe. If the pipe area halves, the velocity doubles. Mass is conserved: what enters must exit.*`,
      analogy: 'Think of cars on a highway. When 3 lanes merge to 1, the traffic must move faster (or back up). If 100 cars per minute enter the 3-lane section, 100 cars per minute must exit the 1-lane section — they just move faster. Water in a pipe follows the same rule: narrower pipe means faster flow.',
      storyConnection: 'The penstocks at Nagarjuna Sagar — the massive pipes that carry water from the reservoir to the turbines — are carefully sized. Too narrow and the water velocity is too high, causing excessive friction losses. Too wide and they are unnecessarily expensive. The optimal diameter balances flow velocity, friction, and cost.',
      checkQuestion: 'Water flows through a pipe at 2 m/s with area 4 m^2. The pipe narrows to 1 m^2. What is the new velocity?',
      checkAnswer: 'A1 * v1 = A2 * v2. So v2 = (A1 * v1) / A2 = (4 * 2) / 1 = 8 m/s. The water speeds up by 4x when the pipe area reduces by 4x.',
      codeIntro: 'Apply the continuity equation to model water flow through a dam penstock system.',
      code: `import numpy as np

# Continuity equation and flow through penstocks

def continuity(area1, velocity1, area2):
    """Given upstream conditions and downstream area, find downstream velocity."""
    Q = area1 * velocity1  # flow rate (m^3/s)
    velocity2 = Q / area2
    return velocity2, Q

def pipe_area(diameter):
    """Cross-sectional area of a circular pipe."""
    return np.pi * (diameter / 2) ** 2

print("=== Continuity Equation Demo ===")
print()

# Penstock system: reservoir -> intake -> penstock -> turbine
sections = [
    ("Reservoir approach", 50.0),   # wide channel diameter equivalent
    ("Intake structure", 10.0),
    ("Upper penstock", 6.0),
    ("Lower penstock", 4.5),
    ("Turbine inlet", 3.0),
    ("Turbine runner", 2.0),
]

initial_velocity = 0.5  # m/s at reservoir approach
prev_area = pipe_area(sections[0][1])
prev_vel = initial_velocity

print(f"{'Section':<22} {'Diameter':>9} {'Area (m^2)':>11} {'Velocity':>10} {'Q (m^3/s)':>10}")
print("-" * 64)

for name, diameter in sections:
    area = pipe_area(diameter)
    velocity, Q = continuity(prev_area, prev_vel, area)
    print(f"{name:<22} {diameter:>7.1f} m {area:>11.1f} {velocity:>8.1f} m/s {Q:>10.1f}")
    prev_area = area
    prev_vel = velocity

print()

# Flow rate and power relationship
print("=== Flow Rate vs Power ===")
head = 100  # m
efficiency = 0.90
rho = 1000
g = 9.81

penstock_diameter = 4.5  # m
area = pipe_area(penstock_diameter)

print(f"Penstock diameter: {penstock_diameter} m (area = {area:.1f} m^2)")
print()
print(f"{'Velocity (m/s)':<16} {'Q (m^3/s)':>11} {'Power (MW)':>11} {'Status'}")
print("-" * 50)

for v in [1, 2, 3, 4, 5, 6, 8, 10]:
    Q = area * v
    power = rho * Q * g * head * efficiency / 1e6
    status = "optimal" if 3 <= v <= 5 else "slow" if v < 3 else "high friction"
    print(f"{v:<16} {Q:>11.1f} {power:>11.1f} {status}")

print()
# Multiple penstocks
print("=== Multiple Penstock Configuration ===")
num_turbines = 8
total_Q = 800  # m^3/s total
Q_per_turbine = total_Q / num_turbines

for d in [3.0, 3.5, 4.0, 4.5, 5.0]:
    a = pipe_area(d)
    v = Q_per_turbine / a
    print(f"  Diameter {d:.1f} m: velocity = {v:.1f} m/s "
          f"({'good' if 2 <= v <= 5 else 'too fast' if v > 5 else 'slow'})")`,
      challenge: 'If one of 8 penstocks is shut for maintenance, the remaining 7 must carry the same total flow. How does the velocity in each penstock change? At what point does the velocity become dangerously high (above 8 m/s, causing cavitation)?',
      successHint: 'The continuity equation is one of the three pillars of fluid mechanics (along with Bernoulli equation and Navier-Stokes equations). It is used in every hydraulic system design, from household plumbing to city water networks to rocket engine fuel systems.',
    },
    {
      title: "Bernoulli's equation — trading pressure for velocity",
      concept: `**Bernoulli's equation** states that in a steady, inviscid flow, the total energy per unit volume is constant along a streamline: **P + 0.5 * rho * v^2 + rho * g * h = constant**.

This means: if water speeds up (v increases), its pressure must decrease. If water rises (h increases), its pressure or velocity must decrease. Energy is conserved — it simply converts between pressure, kinetic, and potential forms.

For a dam penstock, Bernoulli's equation connects the reservoir surface (high pressure, zero velocity, high elevation) to the turbine inlet (lower elevation, high velocity, lower pressure). The equation predicts exactly how fast water will move through the turbine and how much energy can be extracted.

📚 *Bernoulli's equation components: P (static pressure), 0.5*rho*v^2 (dynamic pressure, from motion), rho*g*h (hydrostatic pressure, from elevation). Their sum is constant along a streamline.*`,
      analogy: 'Think of a roller coaster. At the top of a hill, the car is high (lots of potential energy) and moving slowly. At the bottom, it is low (less potential energy) but moving fast (lots of kinetic energy). The total energy is constant — it just converts between forms. Bernoulli equation describes the same conservation for flowing water.',
      storyConnection: 'At Nagarjuna Sagar, water in the reservoir is essentially still (low velocity) at high elevation (high potential energy). As it flows through the penstock and drops 100 metres, it accelerates to high velocity (high kinetic energy). Bernoulli equation tells engineers exactly how fast the water will be moving when it hits the turbine blades.',
      checkQuestion: 'Water at the reservoir surface is at rest at elevation 124 m. At the turbine (elevation 24 m), what is the theoretical maximum velocity? (Assume no friction.)',
      checkAnswer: 'Using Bernoulli: 0.5*v^2 = g*delta_h. v = sqrt(2 * 9.81 * 100) = sqrt(1962) = 44.3 m/s. This is the theoretical maximum — friction and turbine extraction reduce the actual velocity.',
      codeIntro: "Apply Bernoulli's equation to calculate velocities and pressures through a dam system.",
      code: `import numpy as np

# Bernoulli's equation: P + 0.5*rho*v^2 + rho*g*h = constant

rho = 1000  # kg/m^3
g = 9.81    # m/s^2
atm = 101325  # Pa

def bernoulli_solve_velocity(h1, v1, P1, h2, P2):
    """Solve for v2 given conditions at points 1 and 2."""
    # P1 + 0.5*rho*v1^2 + rho*g*h1 = P2 + 0.5*rho*v2^2 + rho*g*h2
    total_1 = P1 + 0.5 * rho * v1**2 + rho * g * h1
    # v2^2 = 2 * (total_1 - P2 - rho*g*h2) / rho
    v2_squared = 2 * (total_1 - P2 - rho * g * h2) / rho
    if v2_squared < 0:
        return 0  # physically impossible
    return np.sqrt(v2_squared)

def bernoulli_solve_pressure(h1, v1, P1, h2, v2):
    """Solve for P2 given conditions at points 1 and 2."""
    total_1 = P1 + 0.5 * rho * v1**2 + rho * g * h1
    P2 = total_1 - 0.5 * rho * v2**2 - rho * g * h2
    return P2

# Dam system: trace water from reservoir to turbine
print("=== Bernoulli Analysis: Reservoir to Turbine ===")
print()

points = [
    ("Reservoir surface", 124, 0, atm),          # h, v, P
    ("Intake (120 m)", 120, None, None),
    ("Penstock top (100 m)", 100, None, None),
    ("Penstock mid (60 m)", 60, None, None),
    ("Turbine inlet (24 m)", 24, None, None),
]

# Solve using Bernoulli (no friction, ideal case)
print(f"{'Location':<25} {'Height':>8} {'Velocity':>10} {'Pressure':>12} {'P (atm)':>8}")
print("-" * 65)

h1, v1, P1 = 124, 0, atm

for name, h2, v_given, P_given in points:
    if v_given is not None and P_given is not None:
        v2, P2 = v_given, P_given
    else:
        # At each point, assume pipe constrains flow
        # For free fall: P2 = atm, solve for v
        v2 = bernoulli_solve_velocity(h1, v1, P1, h2, atm)
        P2 = atm

    p_atm = P2 / atm
    print(f"{name:<25} {h2:>6.0f} m {v2:>8.1f} m/s {P2:>10,.0f} Pa {p_atm:>7.2f}")

print()
print("=== Energy Budget at Each Point ===")
print(f"{'Location':<25} {'KE (kJ/m3)':>11} {'PE (kJ/m3)':>11} {'Press (kJ/m3)':>13} {'Total':>10}")
print("-" * 72)

h0, v0, P0 = 124, 0, atm
total_0 = P0 + 0.5 * rho * v0**2 + rho * g * h0

for name, h, _, _ in points:
    v = bernoulli_solve_velocity(h0, v0, P0, h, atm)
    ke = 0.5 * rho * v**2
    pe = rho * g * h
    total = ke + pe + atm
    print(f"{name:<25} {ke/1000:>11.1f} {pe/1000:>11.1f} {atm/1000:>13.1f} {total/1000:>10.1f}")

print()
# Maximum theoretical velocity (free fall from 124m to 24m)
delta_h = 124 - 24
v_max = np.sqrt(2 * g * delta_h)
print(f"Maximum theoretical velocity (100 m drop): {v_max:.1f} m/s")
print(f"  = {v_max * 3.6:.0f} km/h")
print(f"This is the speed water would reach in free fall from the reservoir to the turbine.")`,
      challenge: 'Real penstocks have friction that reduces the available energy. If friction losses are 10% of the total energy, recalculate the velocity at the turbine. Then try 20% losses. At what friction loss percentage does the velocity drop below 30 m/s?',
      successHint: 'Bernoulli equation is one of the most powerful tools in fluid mechanics. It explains why airplane wings generate lift (fast air over the wing has lower pressure), why a curveball curves, and why a shower curtain blows inward when you turn on the water. You just applied it to real dam engineering.',
    },
    {
      title: 'Pipe friction and head loss — real-world flow',
      concept: `In reality, water flowing through pipes loses energy to **friction** — the resistance between the water and the pipe walls. This energy loss is called **head loss** and is measured in metres of water head lost.

The **Darcy-Weisbach equation** gives the head loss: **h_f = f * (L/D) * (v^2 / (2g))**, where f is the friction factor, L is the pipe length, D is the pipe diameter, and v is the flow velocity. The friction factor depends on the pipe roughness and the Reynolds number (flow regime).

For smooth pipes at moderate velocities, the Moody chart gives f between 0.01 and 0.05. For a 4 m diameter penstock that is 200 m long with water flowing at 5 m/s, the head loss is approximately f * (200/4) * (25/19.62) = f * 50 * 1.27 = 63.7 * f metres. With f = 0.015, head loss is about 1.0 m — only 1% of the 100 m head. But with a longer or rougher pipe, losses can be significant.

📚 *The Darcy-Weisbach equation: h_f = f * (L/D) * (v^2/(2g)). The friction factor f depends on Reynolds number Re = v*D/nu (where nu is kinematic viscosity) and relative roughness e/D. The Moody diagram relates these.*`,
      analogy: 'Imagine sliding a heavy box across different surfaces. On smooth ice, the box slides easily (low friction). On rough carpet, it takes much more effort (high friction). The energy you lose to friction is wasted as heat. Water in a pipe experiences the same thing — rougher pipes and faster flow mean more energy lost to friction.',
      storyConnection: 'The penstocks at Nagarjuna Sagar are steel-lined to minimize friction. Even so, the 200+ metre journey from reservoir to turbine involves measurable energy loss. Engineers carefully calculated the optimal pipe diameter: too small increases friction (energy loss), too large increases material and construction costs.',
      checkQuestion: 'A penstock is 300 m long, 5 m diameter, with water at 4 m/s and friction factor 0.012. What is the head loss?',
      checkAnswer: 'h_f = 0.012 * (300/5) * (16/(2*9.81)) = 0.012 * 60 * 0.815 = 0.587 m. Less than 1% of a 100 m head. This is why large-diameter penstocks are used — the large diameter keeps friction low.',
      codeIntro: 'Calculate head loss through penstocks and optimize pipe diameter for minimum total cost.',
      code: `import numpy as np

# Pipe friction and head loss (Darcy-Weisbach)

g = 9.81
rho = 1000
nu = 1.0e-6  # kinematic viscosity of water at 20C (m^2/s)

def reynolds_number(velocity, diameter):
    return velocity * diameter / nu

def friction_factor_smooth(Re):
    """Approximate friction factor for smooth pipes (Blasius correlation)."""
    if Re < 2300:
        return 64 / Re  # laminar flow
    else:
        return 0.316 / Re**0.25  # turbulent (Blasius, Re < 100000)

def head_loss(f, length, diameter, velocity):
    """Darcy-Weisbach head loss in metres."""
    return f * (length / diameter) * (velocity**2 / (2 * g))

def power_loss(h_loss, flow_rate):
    """Power lost to friction (Watts)."""
    return rho * g * h_loss * flow_rate

# Nagarjuna Sagar penstock analysis
print("=== Penstock Head Loss Analysis ===")
Q_total = 800  # m^3/s total
n_penstocks = 8
Q = Q_total / n_penstocks  # per penstock
L = 250  # penstock length (m)

print(f"Total flow: {Q_total} m^3/s in {n_penstocks} penstocks")
print(f"Flow per penstock: {Q:.0f} m^3/s | Length: {L} m")
print()

print(f"{'Diameter':>9} {'Velocity':>10} {'Reynolds':>12} {'f':>8} "
      f"{'Head loss':>10} {'Power loss':>11} {'% of head'}")
print("-" * 73)

for D in [3.0, 3.5, 4.0, 4.5, 5.0, 6.0, 7.0]:
    A = np.pi * (D/2)**2
    v = Q / A
    Re = reynolds_number(v, D)
    f = friction_factor_smooth(Re)
    hL = head_loss(f, L, D, v)
    pL = power_loss(hL, Q) / 1e6  # MW
    head = 100
    pct = hL / head * 100
    print(f"{D:>7.1f} m {v:>8.1f} m/s {Re:>12,.0f} {f:>8.4f} "
          f"{hL:>8.2f} m {pL:>9.2f} MW {pct:>7.1f}%")

print()
# Optimization: balance pipe cost vs energy loss
print("=== Cost Optimization ===")
head = 100
efficiency = 0.90
electricity_price = 0.05  # $/kWh
hours_per_year = 4000  # operating hours

print(f"{'Diameter':>9} {'Pipe cost*':>11} {'Annual loss':>12} {'Total 20yr':>12} {'Optimal?':>9}")
print("-" * 55)

min_total = float('inf')
best_D = 0

for D_cm in range(300, 750, 25):
    D = D_cm / 100
    A = np.pi * (D/2)**2
    v = Q / A
    Re = reynolds_number(v, D)
    f = friction_factor_smooth(Re)
    hL = head_loss(f, L, D, v)

    # Pipe cost proportional to diameter^2 * length (material volume)
    pipe_cost = 5000 * D**2 * L  # $/penstock (rough estimate)

    # Annual energy loss
    annual_loss_mwh = power_loss(hL, Q) / 1e6 * hours_per_year
    annual_cost = annual_loss_mwh * 1000 * electricity_price

    total_20yr = pipe_cost + annual_cost * 20
    if total_20yr < min_total:
        min_total = total_20yr
        best_D = D

    optimal = " <-- " if D == best_D else ""
    print(f"{D:>7.1f} m {pipe_cost/1e6:>8.1f}M {annual_cost/1e3:>9.0f}k "
          f"{total_20yr/1e6:>9.1f}M{optimal}")

print(f"\
* Pipe cost is a simplified estimate (proportional to D^2 * L)")
print(f"Optimal diameter: {best_D:.1f} m (minimizes 20-year total cost)")`,
      challenge: 'What if the pipe surface becomes rougher over 30 years (friction factor doubles from corrosion)? Recalculate the optimal diameter accounting for degradation. Should engineers oversize the pipe initially to account for future roughness?',
      successHint: 'Pipe friction analysis is essential for every fluid system — from the water supply to your house to the cooling systems of nuclear reactors. The Darcy-Weisbach equation and the economic optimization you performed are exactly what hydraulic engineers do when designing pipelines.',
    },
    {
      title: "Torricelli's theorem — how fast water exits a dam",
      concept: `**Torricelli's theorem** is a special case of Bernoulli equation: the velocity of water exiting a hole at depth h below the surface is **v = sqrt(2 * g * h)**. This is the same speed an object would reach if it fell freely from height h.

This elegant result means that the exit velocity depends ONLY on the depth — not on the pipe diameter, the shape of the opening, or the size of the reservoir (as long as the reservoir is large enough that the surface level doesn't change significantly).

For Nagarjuna Sagar with outlets at 100 m depth, the theoretical exit velocity is sqrt(2 * 9.81 * 100) = 44.3 m/s = about 160 km/h. In practice, friction and contraction effects reduce this by 10-20%, but it is still an impressively fast flow.

📚 *Torricelli's theorem: v = sqrt(2gh). This is derived from Bernoulli equation by setting the surface pressure equal to the exit pressure (both atmospheric) and the surface velocity to approximately zero (large reservoir).*`,
      analogy: 'Poke a hole in the side of a tall water bottle. Water near the bottom squirts out much farther than water near the top — because the deeper water is under more pressure and exits faster. Torricelli proved that the exit speed follows exactly the free-fall formula: the deeper the hole, the faster the water.',
      storyConnection: 'When Nagarjuna Sagar dam spillway gates open during monsoon floods, the water exits at speeds exceeding 40 m/s. The downstream channel (stilling basin) is specially designed to dissipate this enormous kinetic energy safely — if the fast water hit the riverbed directly, it would erode the foundation and eventually undermine the dam.',
      checkQuestion: 'A reservoir is 80 m deep. Water exits from an outlet at the base. What is the exit velocity? How far would a horizontal jet travel before dropping 5 m?',
      checkAnswer: 'Exit velocity: v = sqrt(2 * 9.81 * 80) = 39.6 m/s. Time to fall 5 m: t = sqrt(2 * 5 / 9.81) = 1.01 s. Horizontal distance: 39.6 * 1.01 = 40.0 m. The jet travels 40 metres before dropping just 5 metres.',
      codeIntro: "Apply Torricelli's theorem to calculate exit velocities and jet trajectories from a dam.",
      code: `import numpy as np

# Torricelli's theorem: v = sqrt(2 * g * h)

g = 9.81

def torricelli_velocity(depth):
    """Exit velocity at a given depth below the surface."""
    return np.sqrt(2 * g * depth)

def jet_trajectory(v_exit, exit_height, num_points=50):
    """Calculate the trajectory of a horizontal water jet.
    Assumes jet exits horizontally at exit_height above ground.
    """
    # Time to hit ground: h = 0.5*g*t^2, so t = sqrt(2h/g)
    t_total = np.sqrt(2 * exit_height / g)
    t = np.linspace(0, t_total, num_points)

    x = v_exit * t  # horizontal: constant velocity
    y = exit_height - 0.5 * g * t**2  # vertical: free fall

    return x, y, t_total

print("=== Torricelli's Theorem ===")
print(f"{'Depth (m)':<12} {'Velocity (m/s)':>15} {'km/h':>8} {'Like...'}")
print("-" * 55)

comparisons = [
    (1, "garden hose"),
    (5, "fire hydrant"),
    (10, "slow car"),
    (30, "highway speed"),
    (60, "high-speed train"),
    (100, "light aircraft"),
    (124, "Nagarjuna base"),
    (200, "bullet train"),
]

for depth, like in comparisons:
    v = torricelli_velocity(depth)
    kmh = v * 3.6
    print(f"{depth:<12} {v:>15.1f} {kmh:>8.0f} {like}")

print()
# Jet trajectory from spillway
print("=== Spillway Jet Trajectory ===")
dam_height = 124
spillway_depth = 20  # water exits 20m below reservoir surface
exit_height = dam_height - spillway_depth  # height above base

v_exit = torricelli_velocity(spillway_depth)
x, y, t_total = jet_trajectory(v_exit, exit_height)

print(f"Spillway at {spillway_depth} m depth")
print(f"Exit velocity: {v_exit:.1f} m/s")
print(f"Exit height above base: {exit_height} m")
print(f"Time to reach ground: {t_total:.2f} s")
print(f"Horizontal distance: {x[-1]:.0f} m")
print()

# Show trajectory
print(f"{'Time (s)':>9} {'X (m)':>8} {'Y (m)':>8}")
print("-" * 27)
for i in range(0, len(x), len(x) // 10):
    print(f"{t_total * i / len(x):>9.2f} {x[i]:>8.1f} {y[i]:>8.1f}")

print()
# Flow rate through an orifice
print("=== Flow Rate Through Dam Outlet ===")
for diameter in [1, 2, 3, 4, 5]:
    area = np.pi * (diameter / 2)**2
    v = torricelli_velocity(100)  # at 100m depth
    Cd = 0.62  # discharge coefficient for sharp-edged orifice
    Q = Cd * area * v
    print(f"  Outlet diameter {diameter} m: Q = {Q:,.0f} m^3/s = {Q*1000:,.0f} litres/s")`,
      challenge: 'If the reservoir is draining (water level dropping), Torricelli velocity changes over time. Starting from 100 m depth with a 3 m diameter outlet, simulate how long it takes for the level to drop to 50 m. (Hint: dh/dt = -Q/A_reservoir. Use a simple time-stepping loop.)',
      successHint: 'Torricelli theorem, published in 1643, was one of the first results in fluid mechanics. It is still used today in engineering: designing dam spillways, calculating fire hose flow, sizing drainage systems, and even in medicine (blood flow from wounds). The simple formula v = sqrt(2gh) is remarkably powerful.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Energy, flow, and Bernoulli equation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises model potential energy, flow rate, Bernoulli equation, and pipe friction.
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
