import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BankuraLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Heat transfer modes — conduction, convection, and radiation',
      concept: `Heat moves through a kiln by three mechanisms: **conduction** (heat flows through solid materials from hot to cold), **convection** (hot air rises and circulates), and **radiation** (electromagnetic waves carry energy from hot surfaces to cooler ones).

In a Bankura terracotta kiln, all three act simultaneously: conduction carries heat through the kiln walls and into the clay, convection circulates hot gases from the fire around the pottery, and radiation from the glowing walls heats surfaces directly.

The equations: conduction **Q = k*A*dT/dx**, convection **Q = h*A*dT**, radiation **Q = epsilon*sigma*A*(T_hot^4 - T_cold^4)**, where k is thermal conductivity, h is the convection coefficient, epsilon is emissivity, and sigma is the Stefan-Boltzmann constant.`,
      analogy: 'Touch a metal spoon in hot soup — that is conduction (heat through the solid). Feel warmth rising from the soup — that is convection (hot fluid moving). Stand near a campfire and feel warmth on your face — that is radiation (invisible light carrying energy). All three happen whenever something is hot.',
      storyConnection: 'Bankura potters fire their terracotta horses in traditional updraft kilns. The fire burns at the bottom (conduction heats the kiln floor), hot gases rise through the pottery chamber (convection heats the surfaces), and the glowing walls radiate heat uniformly to all surfaces. The potter controls all three by adjusting the fire intensity, air inlet, and kiln loading pattern.',
      checkQuestion: 'A kiln wall is 20 cm thick with thermal conductivity k = 0.5 W/(m K). The inner surface is 900 C and the outer is 100 C. What is the heat flow per square metre?',
      checkAnswer: 'Q/A = k * dT / dx = 0.5 * (900 - 100) / 0.20 = 0.5 * 800 / 0.2 = 2000 W/m2 = 2 kW/m2. A 2 m2 kiln wall loses 4 kW of heat — this is why kilns need thick, insulating walls to keep heat inside.',
      codeIntro: 'Calculate heat transfer by all three modes in a Bankura terracotta kiln.',
      code: `import numpy as np

# Heat transfer in a terracotta kiln

sigma = 5.67e-8  # Stefan-Boltzmann constant (W/m2/K4)

def conduction(k, A, T_hot, T_cold, thickness):
    """Heat flow through a solid wall (W)"""
    return k * A * (T_hot - T_cold) / thickness

def convection(h, A, T_surface, T_fluid):
    """Heat flow from surface to fluid (W)"""
    return h * A * (T_surface - T_fluid)

def radiation(epsilon, A, T_hot_K, T_cold_K):
    """Radiative heat transfer (W)"""
    return epsilon * sigma * A * (T_hot_K**4 - T_cold_K**4)

# Kiln parameters
kiln_inner_T = 900   # C
kiln_outer_T = 100   # C
ambient_T = 30       # C
kiln_gas_T = 850     # C (hot gas inside)
pottery_T = 400      # C (pottery being heated)

# Kiln wall: 20 cm brick
wall_k = 0.5         # W/(m*K) for firebrick
wall_thick = 0.20    # m
wall_area = 8        # m2 (total kiln wall area)

# Convection inside kiln
h_inside = 25        # W/(m2*K) (forced convection from gas flow)
pottery_area = 1.5   # m2 (total pottery surface area)

# Radiation
emissivity = 0.85    # clay surface emissivity

print("=== Bankura Kiln Heat Transfer Analysis ===")
print(f"Kiln temp: {kiln_inner_T} C | Pottery temp: {pottery_T} C")
print()

# 1. Conduction through kiln walls (heat loss)
Q_cond = conduction(wall_k, wall_area, kiln_inner_T, kiln_outer_T, wall_thick)
print(f"1. Conduction through walls: {Q_cond:.0f} W ({Q_cond/1000:.1f} kW)")
print(f"   (This is heat LOST through the kiln walls)")

# 2. Convection from hot gas to pottery
Q_conv = convection(h_inside, pottery_area, kiln_gas_T, pottery_T)
print(f"\n2. Convection (gas to pottery): {Q_conv:.0f} W ({Q_conv/1000:.1f} kW)")
print(f"   (This HEATS the pottery)")

# 3. Radiation from kiln walls to pottery
T_wall_K = kiln_inner_T + 273
T_pot_K = pottery_T + 273
Q_rad = radiation(emissivity, pottery_area, T_wall_K, T_pot_K)
print(f"\n3. Radiation (walls to pottery): {Q_rad:.0f} W ({Q_rad/1000:.1f} kW)")
print(f"   (This also HEATS the pottery)")

# Total heat to pottery
Q_to_pottery = Q_conv + Q_rad
print(f"\nTotal heat to pottery: {Q_to_pottery:.0f} W ({Q_to_pottery/1000:.1f} kW)")
print(f"  Convection: {Q_conv/Q_to_pottery*100:.0f}%")
print(f"  Radiation:  {Q_rad/Q_to_pottery*100:.0f}%")

# Heat balance: fire must provide heat to pottery + losses
Q_fire = Q_to_pottery + Q_cond
print(f"\nFire must produce: {Q_fire:.0f} W ({Q_fire/1000:.1f} kW)")

# How radiation dominates at high temperature
print()
print("=== Radiation vs Temperature (T^4 scaling!) ===")
print(f"{'Kiln Temp (C)':>14} {'Convection (W)':>16} {'Radiation (W)':>16} {'Rad %':>8}")
print("-" * 56)

for T_kiln in [200, 400, 600, 800, 900, 1000, 1100]:
    Q_c = convection(h_inside, pottery_area, T_kiln, pottery_T)
    Q_r = radiation(emissivity, pottery_area, T_kiln+273, T_pot_K)
    Q_total = Q_c + Q_r
    rad_pct = Q_r / Q_total * 100 if Q_total > 0 else 0
    print(f"{T_kiln:>14} {Q_c:>14.0f} {Q_r:>14.0f} {rad_pct:>6.0f}%")

print()
print("Radiation dominates above 600 C (T^4 scaling).")
print("This is why kiln walls glow — the glow IS the heat transfer!")`,
      challenge: 'Calculate the heat loss if the kiln wall thickness doubles to 40 cm. Then calculate the fuel savings (wood at 15 MJ/kg). How many kg of wood per firing are saved? This is why Bankura potters carefully maintain thick, well-insulated kilns.',
      successHint: 'Heat transfer is the foundation of all thermal engineering: kilns, furnaces, engines, power plants, HVAC systems, electronics cooling, and even cooking. The three modes (conduction, convection, radiation) appear in every thermal problem. At high temperatures, radiation dominates — this is the key insight for kiln design.',
    },
    {
      title: 'Temperature vs heat — understanding thermal energy',
      concept: `**Temperature** is the intensity of heat (how hot something is). **Heat** (or thermal energy) is the total amount of energy stored. A small object at high temperature can have less heat than a large object at low temperature.

The heat stored in an object is: **Q = m * c * dT**, where m is mass, c is specific heat capacity (J/(kg*C)), and dT is the temperature change. Different materials store different amounts of heat: water (c = 4186) stores much more than clay (c = 900) or iron (c = 450).

In a kiln, understanding this distinction is critical. A large terracotta horse (5 kg) at 900 C stores Q = 5 * 900 * (900-25) = **3,937 kJ**. This enormous stored energy is why pottery must cool slowly — rapid cooling causes thermal shock and cracking.`,
      analogy: 'A cup of boiling coffee (small mass, high temperature) will cool your burn faster than a swimming pool at 30 C (huge mass, low temperature). But the pool stores far more total heat energy. Temperature tells you the intensity; mass times specific heat tells you the capacity.',
      storyConnection: 'When a Bankura potter opens the kiln after firing, the air inside is hot but the pottery itself holds much more heat. The potter knows to leave the kiln door slightly ajar for 24 hours, allowing the massive thermal energy in the clay to dissipate slowly. Opening the door fully would cool the surface rapidly while the interior stays hot — the resulting thermal stress cracks the terracotta.',
      checkQuestion: 'A 3 kg terracotta horse at 900 C (c = 900 J/kg/C, ambient 25 C) stores how much thermal energy above ambient?',
      checkAnswer: 'Q = 3 * 900 * (900 - 25) = 3 * 900 * 875 = 2,362,500 J = 2362.5 kJ. That is enough energy to heat 5.6 litres of water from 25 C to boiling. This explains why fired pottery stays hot for hours after the kiln stops.',
      codeIntro: 'Calculate thermal energy storage in different kiln materials and pottery pieces.',
      code: `import numpy as np

# Thermal energy calculations for kiln and pottery

# Specific heat capacities (J/kg/C)
materials = {
    "Terracotta clay": {"c": 900, "density": 1800},
    "Firebrick (kiln wall)": {"c": 880, "density": 2100},
    "Iron (kiln grate)": {"c": 450, "density": 7800},
    "Water (for comparison)": {"c": 4186, "density": 1000},
    "Air (in kiln)": {"c": 1005, "density": 0.4},  # hot air density
    "Wood (fuel)": {"c": 1700, "density": 600},
}

T_firing = 900  # C
T_ambient = 25  # C
dT = T_firing - T_ambient

print("=== Thermal Energy Storage by Material ===")
print(f"Temperature change: {T_ambient} C -> {T_firing} C (dT = {dT} C)")
print()
print(f"{'Material':<24} {'c (J/kg/C)':>10} {'E per kg (kJ)':>14} {'E per L (kJ)':>12}")
print("-" * 62)

for name, props in materials.items():
    E_per_kg = props["c"] * dT / 1000  # kJ
    E_per_L = E_per_kg * props["density"] / 1000  # kJ per litre
    print(f"{name:<24} {props['c']:>10} {E_per_kg:>12.0f} {E_per_L:>10.0f}")

# Specific pottery pieces
print()
print("=== Energy in Bankura Pottery Pieces ===")

pieces = [
    ("Small horse (15 cm)", 0.8),
    ("Medium horse (30 cm)", 3.0),
    ("Large horse (60 cm)", 12.0),
    ("Decorative plate", 0.5),
    ("Water pot (handi)", 2.0),
    ("Temple panel", 8.0),
]

c_clay = 900
print(f"{'Piece':<24} {'Mass (kg)':>10} {'Energy (kJ)':>12} {'Cool time (h)':>14}")
print("-" * 62)

for name, mass in pieces:
    E = mass * c_clay * dT / 1000  # kJ
    # Cooling time (rough: natural convection, h~10 W/m2K)
    # Assume surface area ~ 6 * (mass/1800)^(2/3) m2
    A_surface = 6 * (mass / 1800) ** (2/3)
    h_cool = 10  # natural convection
    tau = mass * c_clay / (h_cool * A_surface) / 3600  # hours
    print(f"{name:<24} {mass:>8.1f} {E:>10.0f} {tau:>12.1f}")

# Kiln thermal mass
print()
print("=== Total Kiln Thermal Energy Budget ===")

kiln_components = [
    ("Kiln walls (firebrick)", 500, 880),
    ("Kiln floor", 200, 880),
    ("Pottery load", 50, 900),
    ("Air inside kiln", 2, 1005),
    ("Iron grate/supports", 30, 450),
]

total_E = 0
print(f"{'Component':<28} {'Mass (kg)':>10} {'Energy (kJ)':>12}")
print("-" * 52)

for name, mass, c in kiln_components:
    E = mass * c * dT / 1000
    total_E += E
    print(f"{name:<28} {mass:>10} {E:>10.0f}")

print(f"{'TOTAL':<28} {'':>10} {total_E:>10.0f}")
print(f"\nTotal: {total_E/1000:.1f} MJ ({total_E/3600:.1f} kWh)")

# Wood fuel needed
wood_energy = 15000  # kJ/kg (air-dried wood)
kiln_eff = 0.15  # 15% of wood energy reaches pottery (traditional kiln)
wood_needed = total_E / (wood_energy * kiln_eff)
print(f"\nWood fuel needed: {wood_needed:.0f} kg (at {kiln_eff*100:.0f}% kiln efficiency)")
print(f"That is about {wood_needed/20:.0f} bundles of firewood!")`,
      challenge: 'If the kiln uses 300 kg of wood (each kg releases 15 MJ), total fuel energy is 4,500 MJ. The kiln needs 340 MJ (the total we calculated). What is the kiln efficiency? Where does the other 92% of fuel energy go? (Hint: exhaust gases, wall losses, incomplete combustion.)',
      successHint: 'The distinction between temperature and heat (thermal energy) is one of the most important concepts in thermodynamics. It governs everything from cooking to industrial furnaces to climate science. The Q = mcT equation is deceptively simple but incredibly powerful.',
    },
    {
      title: 'Firing curves — temperature profiles for perfect terracotta',
      concept: `A **firing curve** (or firing schedule) specifies the kiln temperature at every point during the firing process. The schedule has distinct phases: **water smoking** (slow ramp to 200 C, driving off absorbed water), **quartz inversion** (careful passage through 573 C), **sintering** (hold at 900-1100 C), and **cooling** (controlled slow descent).

Each phase has a critical **ramp rate** (degrees per hour). Too fast during water smoking and steam pressure cracks the pottery. Too fast through quartz inversion and the crystal structure change causes fractures. Too fast during cooling and thermal stress shatters the piece.

Typical ramp rates: 50-80 C/hour during water smoking, 30-50 C/hour through quartz inversion, 80-150 C/hour to peak temperature, hold 1-4 hours, then cool at 50-100 C/hour initially, faster below 573 C.`,
      analogy: 'A firing curve is like a flight plan. The takeoff (heating) must be slow and careful. Cruising altitude (peak temperature) must be held long enough. Landing (cooling) must be gentle. Rush any phase and you crash — in ceramics, crashing means cracked pottery.',
      storyConnection: 'Bankura potters learn firing curves through apprenticeship, not textbooks. A master potter reads the fire\'s colour (red at 700 C, orange at 900 C, white at 1100 C) and adjusts fuel accordingly. This colour-based temperature estimation is remarkably accurate — experienced potters can judge kiln temperature within 20 C by eye.',
      checkQuestion: 'A kiln heats from 25 C to 900 C over 12 hours, then holds for 2 hours, then cools over 18 hours. What is the average heating rate? What is the average cooling rate?',
      checkAnswer: 'Heating: (900-25)/12 = 72.9 C/hour average. Cooling: (900-25)/18 = 48.6 C/hour average. But these are averages — the actual rate varies by phase. The critical phases (water smoking, quartz inversion) must be much slower than average.',
      codeIntro: 'Design and simulate a firing curve for Bankura terracotta, tracking temperature at every phase.',
      code: `import numpy as np

# Firing curve designer and simulator

def design_firing_curve(peak_temp_C=900, total_hours=36):
    """Design a multi-phase firing curve for terracotta"""
    phases = [
        {"name": "Initial heating", "T_start": 25, "T_end": 120,
         "rate": 50, "reason": "Drive off surface moisture"},
        {"name": "Water smoking", "T_start": 120, "T_end": 250,
         "rate": 40, "reason": "Remove chemically bound water (steam risk)"},
        {"name": "Organic burnout", "T_start": 250, "T_end": 500,
         "rate": 80, "reason": "Burn out organic matter in clay"},
        {"name": "Quartz inversion", "T_start": 500, "T_end": 600,
         "rate": 30, "reason": "Quartz crystal structure change at 573 C"},
        {"name": "Fast ramp to peak", "T_start": 600, "T_end": peak_temp_C,
         "rate": 120, "reason": "Reach sintering temperature efficiently"},
        {"name": "Soak at peak", "T_start": peak_temp_C, "T_end": peak_temp_C,
         "rate": 0, "reason": "Hold for uniform heat penetration"},
        {"name": "Initial cooling", "T_start": peak_temp_C, "T_end": 600,
         "rate": -60, "reason": "Slow cooling above quartz inversion"},
        {"name": "Quartz cool-down", "T_start": 600, "T_end": 500,
         "rate": -25, "reason": "Very slow through reverse quartz inversion"},
        {"name": "Final cooling", "T_start": 500, "T_end": 50,
         "rate": -80, "reason": "Can cool faster below critical zone"},
    ]

    # Calculate time for each phase
    schedule = []
    cumulative_hours = 0

    for phase in phases:
        dT = abs(phase["T_end"] - phase["T_start"])
        if phase["rate"] == 0:
            hours = 2  # soak duration
        else:
            hours = dT / abs(phase["rate"])

        schedule.append({
            "name": phase["name"],
            "T_start": phase["T_start"],
            "T_end": phase["T_end"],
            "rate": phase["rate"],
            "hours": hours,
            "start_hour": cumulative_hours,
            "reason": phase["reason"],
        })
        cumulative_hours += hours

    return schedule, cumulative_hours

schedule, total_h = design_firing_curve(900)

print("=== Bankura Terracotta Firing Schedule ===")
print(f"Peak temperature: 900 C | Total time: {total_h:.1f} hours")
print()
print(f"{'Phase':<22} {'T range':>12} {'Rate':>8} {'Time':>6} {'Hour':>6} {'Risk':<20}")
print("-" * 76)

for s in schedule:
    rate_str = f"{s['rate']:+.0f}" if s["rate"] != 0 else "hold"
    risk = "HIGH" if abs(s["rate"]) < 40 and s["rate"] != 0 else "LOW"
    print(f"{s['name']:<22} {s['T_start']:>4}-{s['T_end']:>4} C {rate_str:>6}/h "
          f"{s['hours']:>4.1f}h {s['start_hour']:>5.1f} {risk:<20}")

# Generate hour-by-hour temperature profile
print()
print("=== Hour-by-Hour Temperature Profile ===")
print(f"{'Hour':>5} {'Temp (C)':>10} {'Phase':<24} {'Fire color':<14}")
print("-" * 55)

for hour in np.arange(0, total_h + 0.5, 1):
    # Find which phase we're in
    T = 25
    current_phase = schedule[0]["name"]
    for s in schedule:
        if hour >= s["start_hour"] and hour < s["start_hour"] + s["hours"]:
            fraction = (hour - s["start_hour"]) / max(s["hours"], 0.01)
            T = s["T_start"] + (s["T_end"] - s["T_start"]) * fraction
            current_phase = s["name"]
            break
        elif hour >= s["start_hour"] + s["hours"]:
            T = s["T_end"]
            current_phase = s["name"]

    # Fire color based on temperature
    if T < 400:
        color = "No glow"
    elif T < 500:
        color = "Faint red"
    elif T < 700:
        color = "Dark red"
    elif T < 800:
        color = "Cherry red"
    elif T < 900:
        color = "Bright red"
    elif T < 1000:
        color = "Orange"
    else:
        color = "Yellow-white"

    if int(hour) % 2 == 0:
        print(f"{hour:>5.0f} {T:>8.0f} {current_phase:<24} {color:<14}")

# Energy consumption during firing
print()
print("=== Fuel Consumption by Phase ===")
total_fuel_kg = 0
wood_energy_kJ = 15000  # per kg
kiln_eff = 0.12

for s in schedule:
    if s["rate"] > 0:  # heating phases only
        # Rough energy needed
        dT = s["T_end"] - s["T_start"]
        E_needed = 800 * 900 * dT / 1000  # kJ (kiln mass * c * dT)
        fuel_kg = E_needed / (wood_energy_kJ * kiln_eff)
        total_fuel_kg += fuel_kg
        print(f"  {s['name']:<22} dT={dT:>4} C  Fuel: {fuel_kg:>5.1f} kg wood")

print(f"\nTotal fuel: {total_fuel_kg:.0f} kg wood")`,
      challenge: 'Design a firing curve for stoneware (peak 1200 C instead of 900 C). How much longer does the firing take? How much more fuel is needed? What new phases might be required (e.g., vitrification soak)?',
      successHint: 'Firing curves are used in every ceramic process: bricks, tiles, porcelain, glass, and even semiconductor manufacturing (thermal processing of silicon chips). The principle is universal: control the rate of temperature change to manage phase transitions and thermal stress.',
    },
    {
      title: 'Thermal stress — why pottery cracks during firing and cooling',
      concept: `When a pottery piece is heated or cooled, the outside changes temperature faster than the inside. This temperature difference creates a **thermal stress**: the hotter surface wants to expand but is constrained by the cooler interior. If the stress exceeds the clay's strength, the piece cracks.

The thermal stress is approximately: **sigma = E * alpha * dT / (1 - nu)**, where E is Young's modulus, alpha is the coefficient of thermal expansion, dT is the temperature difference between surface and centre, and nu is Poisson's ratio.

The key factor is the **Biot number**: **Bi = h*L/k**, where h is the heat transfer coefficient, L is the characteristic dimension (half-thickness), and k is thermal conductivity. A high Biot number means the surface heats much faster than the interior — creating large temperature gradients and high stress.`,
      analogy: 'Pour boiling water into a cold glass — it might shatter. The inside surface heats and expands, but the outside stays cold and rigid. The expanding inside pushes against the rigid outside, and the glass cracks under the stress. Pottery faces the same risk, but over hours instead of seconds.',
      storyConnection: 'Bankura potters know that thick pieces need much slower firing than thin pieces. A 2 cm thick plate can handle 100 C/hour ramp rate, but a 10 cm thick horse needs 30 C/hour or slower. This traditional knowledge maps perfectly to the Biot number analysis — thick pieces have higher Bi numbers and need gentler heating.',
      checkQuestion: 'A terracotta horse has wall thickness 3 cm (L = 0.015 m), k = 0.8 W/(m K), and h = 25 W/(m2 K). What is the Biot number? Is it susceptible to thermal cracking?',
      checkAnswer: 'Bi = h*L/k = 25 * 0.015 / 0.8 = 0.47. A Biot number above 0.1 means significant temperature gradients — the centre lags behind the surface. At Bi = 0.47, the centre-to-surface temperature difference can be 30-50% of the total temperature change — enough to cause cracking if the ramp rate is too fast.',
      codeIntro: 'Calculate thermal stress in pottery pieces of different sizes during kiln firing.',
      code: `import numpy as np

# Thermal stress analysis for pottery

def thermal_stress(E_GPa, alpha_per_C, dT_surface_center, poisson=0.2):
    """Calculate thermal stress in MPa"""
    E = E_GPa * 1e3  # convert to MPa
    return E * alpha_per_C * dT_surface_center / (1 - poisson)

def biot_number(h, L, k):
    """Biot number: ratio of internal to surface thermal resistance"""
    return h * L / k

def temp_gradient(ramp_rate_Ch, thickness_m, k, rho, c, h_conv):
    """Approximate surface-centre temperature difference during ramp"""
    L = thickness_m / 2  # half-thickness
    Bi = biot_number(h_conv, L, k)
    # For Bi < 1: dT ~ ramp_rate * L^2 / (2 * alpha_thermal)
    alpha_thermal = k / (rho * c)
    dT = ramp_rate_Ch / 3600 * L**2 / (2 * alpha_thermal)
    return dT, Bi

# Clay properties
clay_E = 5.0       # GPa (unfired clay, increases with temperature)
clay_alpha = 7e-6  # /C
clay_k = 0.8       # W/(m*K)
clay_rho = 1800    # kg/m3
clay_c = 900       # J/(kg*C)
clay_strength = 3.0  # MPa (tensile strength of unfired clay)
h_kiln = 25        # W/(m2*K) convection coefficient

# Different pottery pieces
pieces = [
    ("Thin plate (1 cm)", 0.01),
    ("Small horse (2 cm wall)", 0.02),
    ("Medium horse (4 cm wall)", 0.04),
    ("Large horse (6 cm wall)", 0.06),
    ("Temple panel (8 cm)", 0.08),
    ("Massive idol (12 cm)", 0.12),
]

print("=== Thermal Stress vs Piece Thickness ===")
print(f"Ramp rate: 80 C/hour | Clay tensile strength: {clay_strength} MPa")
print()

ramp_rate = 80  # C/hour

print(f"{'Piece':<28} {'Thick':>6} {'Bi':>6} {'dT (C)':>8} {'Stress':>8} {'Safe?':>6}")
print("-" * 64)

for name, thick in pieces:
    dT, Bi = temp_gradient(ramp_rate, thick, clay_k, clay_rho, clay_c, h_kiln)
    stress = thermal_stress(clay_E, clay_alpha, dT)
    safe = "YES" if stress < clay_strength * 0.5 else "RISKY" if stress < clay_strength else "NO"
    print(f"{name:<28} {thick*100:>4.0f} cm {Bi:>5.2f} {dT:>6.1f} {stress:>6.2f} {safe:>6}")

# Maximum safe ramp rate for each piece
print()
print("=== Maximum Safe Ramp Rate ===")
print(f"{'Piece':<28} {'Max rate (C/h)':>14} {'Min firing time (h)':>20}")
print("-" * 64)

for name, thick in pieces:
    # Find max ramp rate where stress < 0.5 * strength
    for rate in range(200, 5, -5):
        dT, _ = temp_gradient(rate, thick, clay_k, clay_rho, clay_c, h_kiln)
        stress = thermal_stress(clay_E, clay_alpha, dT)
        if stress < clay_strength * 0.5:
            # Heating time to 900 C
            heat_time = 875 / rate
            print(f"{name:<28} {rate:>12} {heat_time:>18.1f}")
            break

# Temperature distribution through a thick piece
print()
print("=== Temperature Through a 6 cm Horse Wall ===")
print("(During 80 C/hour ramp, at kiln temp = 500 C)")

thick = 0.06
L = thick / 2
n_pts = 10
x = np.linspace(0, thick, n_pts)

# Approximate temperature profile (parabolic for small Bi)
T_surface = 500
dT_max, _ = temp_gradient(80, thick, clay_k, clay_rho, clay_c, h_kiln)

print(f"\n{'Position':>10} {'Depth (mm)':>12} {'Temp (C)':>10}")
print("-" * 34)

for xi in x:
    depth = xi
    # Parabolic profile
    norm_pos = (xi - L) / L  # -1 to +1
    T = T_surface - dT_max * (1 - norm_pos**2)
    print(f"{'surface' if xi < 0.001 else 'centre' if abs(xi-L) < 0.001 else '':>10} "
          f"{xi*1000:>10.1f} {T:>8.1f}")

print(f"\nSurface-centre difference: {dT_max:.1f} C")
print("This gradient creates the thermal stress that cracks pottery!")`,
      challenge: 'A Bankura potter wants to fire a 10 cm thick temple panel. What maximum ramp rate is safe? How long will the firing take? Design a modified firing schedule that includes a "soak" at 400 C (hold temperature for 2 hours to let the centre catch up to the surface). How does this reduce thermal stress?',
      successHint: 'Thermal stress analysis applies to every situation where materials are heated or cooled: engine blocks, reactor vessels, glass tempering, semiconductor processing, and even the re-entry of spacecraft. The Biot number and thermal stress equations are universal tools.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Heat transfer, temperature, and firing curves</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model heat transfer, thermal energy, and firing schedules for Bankura terracotta pottery.
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
