import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KolkataTramLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Voltage, current, and resistance — the tram\'s electrical foundation',
      concept: `Kolkata's tram runs on **600 volts DC** supplied through overhead wires. This high voltage pushes **current** (flow of electrons) through the tram's motor, and the motor converts electrical energy into mechanical motion. The relationship is governed by **Ohm's law**: **V = I * R**, where V is voltage (volts), I is current (amperes), and R is resistance (ohms).

The tram circuit is: power station generates 600V, overhead wire carries it to the tram, current flows through the motor (doing useful work), and returns through the rails to the power station. Every component in this circuit has resistance, and each resistance causes a voltage drop and energy loss as heat.

In the code below, you will build a complete tram circuit model and calculate voltage drops, currents, and power losses at every point.`,
      analogy: 'Think of the electrical circuit like a water system. Voltage is the water pressure (pushes the flow). Current is the flow rate (litres per second). Resistance is a narrow pipe (restricts flow). A motor is like a water wheel — the flowing water does useful work turning the wheel, losing pressure in the process.',
      storyConnection: 'Kolkata\'s tramway, established in 1902, is the oldest operating electric tram system in Asia. The original system used 500V DC; it was upgraded to 600V in the 1960s. The overhead wire network spans 60 km of track, requiring substations every 2-3 km to maintain adequate voltage as dozens of trams draw current simultaneously.',
      checkQuestion: 'A tram motor draws 200 A at 600 V. What is the motor\'s apparent resistance? How much electrical power does it consume?',
      checkAnswer: 'R = V/I = 600/200 = 3 ohms. Power = V * I = 600 * 200 = 120,000 W = 120 kW. That is enough power to run about 40 household air conditioners — all concentrated in one tram motor.',
      codeIntro: 'Build a complete tram electrical circuit model with Ohm\'s law calculations.',
      code: `import numpy as np

# Tram electrical circuit model
# V = I * R (Ohm's law)
# P = V * I = I^2 * R = V^2 / R (Power)

class CircuitElement:
    def __init__(self, name, resistance_ohm):
        self.name = name
        self.R = resistance_ohm

    def voltage_drop(self, current):
        return current * self.R

    def power_loss(self, current):
        return current**2 * self.R

# Tram circuit elements
elements = [
    CircuitElement("Overhead wire (2 km)", 0.15),
    CircuitElement("Pantograph contact", 0.02),
    CircuitElement("Controller/resistors", 0.5),
    CircuitElement("Motor windings", 2.0),
    CircuitElement("Rail return (2 km)", 0.10),
    CircuitElement("Substation cable", 0.05),
]

supply_voltage = 600  # V DC

print("=== Kolkata Tram Circuit Analysis ===")
print(f"Supply voltage: {supply_voltage} V DC")
print()

# Total resistance determines current
total_R = sum(e.R for e in elements)
current = supply_voltage / total_R

print(f"Total circuit resistance: {total_R:.2f} ohms")
print(f"Circuit current: {current:.1f} A")
print()

print(f"{'Component':<28} {'R (ohms)':>8} {'V drop':>8} {'Power (W)':>10} {'Loss %':>8}")
print("-" * 64)

total_power = supply_voltage * current
motor_power = 0

for e in elements:
    v_drop = e.voltage_drop(current)
    p_loss = e.power_loss(current)
    pct = p_loss / total_power * 100
    if "Motor" in e.name:
        motor_power = p_loss
    print(f"{e.name:<28} {e.R:>6.2f} {v_drop:>6.1f} V {p_loss:>8.0f} {pct:>6.1f}%")

efficiency = motor_power / total_power * 100
print(f"\\nTotal power from supply: {total_power:.0f} W ({total_power/1000:.1f} kW)")
print(f"Power delivered to motor: {motor_power:.0f} W ({motor_power/1000:.1f} kW)")
print(f"Electrical efficiency: {efficiency:.1f}%")

# Effect of distance from substation
print()
print("=== Voltage at Tram vs Distance from Substation ===")
print(f"{'Distance (km)':>14} {'Wire R':>8} {'V at tram':>10} {'Current':>10} {'Motor kW':>10}")
print("-" * 54)

for dist in [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0]:
    wire_R = dist * 0.075  # 0.075 ohm/km for overhead wire
    rail_R = dist * 0.05   # 0.05 ohm/km for rail return
    total = wire_R + 0.02 + 0.5 + 2.0 + rail_R + 0.05
    I = supply_voltage / total
    V_tram = supply_voltage - I * (wire_R + rail_R + 0.05)
    P_motor = I**2 * 2.0 / 1000
    print(f"{dist:>14.1f} {wire_R:>6.3f} {V_tram:>8.1f} V {I:>8.1f} A {P_motor:>8.1f}")

print()
print("Voltage drops significantly at 3+ km from substation.")
print("This is why Kolkata needs substations every 2-3 km!")`,
      challenge: 'Two trams are on the same 2 km section, each drawing 200 A. The overhead wire must carry 400 A total. Calculate the voltage drop in the wire and the voltage each tram receives. Why does adding more trams to a section cause problems? This is why tram dispatchers space trams carefully.',
      successHint: 'You just applied Ohm\'s law to a real-world system. The same circuit analysis applies to every electrical system — house wiring, power grids, electric vehicles, and data centres. The key insight: resistance causes voltage drops and energy losses, and these scale with distance.',
    },
    {
      title: 'Series and parallel circuits — the tram\'s resistor grid',
      concept: `The tram's speed controller uses a grid of **resistors** arranged in series and parallel combinations. At startup, all resistors are in the circuit (maximum resistance, low current, slow speed). As the driver advances the controller, resistors are switched out, reducing total resistance and increasing current and speed.

**Series**: R_total = R1 + R2 + R3 (resistances add). **Parallel**: 1/R_total = 1/R1 + 1/R2 + 1/R3 (reciprocals add). Series increases total resistance; parallel decreases it.

This resistor-switching method is simple and robust but wastes energy as heat in the resistors. Modern trams use electronic controllers (choppers) that waste far less energy, but Kolkata's heritage fleet still uses the classic resistor grid.`,
      analogy: 'Series resistors are like narrow pipes connected end to end — the water must pass through all of them, and total resistance is the sum. Parallel resistors are like pipes side by side — water can take any path, and total resistance decreases because there are more paths available.',
      storyConnection: 'The tram driver\'s controller handle has 10-15 notches. Notch 1 puts all resistors in the circuit (slowest, safest for starting). Each subsequent notch shorts out one or more resistors, allowing more current to flow. At the highest notch, all starting resistors are bypassed and the motor receives nearly full voltage. Drivers learn to advance smoothly — jerky transitions cause sparks and jolts for passengers.',
      checkQuestion: 'Three 2-ohm resistors in series have total R = 6 ohms. The same three in parallel have R = 2/3 ohm. What is the current from a 600V supply in each case?',
      checkAnswer: 'Series: I = 600/6 = 100 A. Parallel: I = 600/0.667 = 899 A. The parallel arrangement draws 9 times more current! This is why the controller starts with series (safe, low current) and progressively switches to parallel (high current, full speed).',
      codeIntro: 'Model the tram\'s resistor grid controller and calculate speed at each notch position.',
      code: `import numpy as np

# Tram controller resistor grid model

class TramController:
    def __init__(self, supply_V, motor_R, grid_resistors):
        self.V_supply = supply_V
        self.R_motor = motor_R
        self.grid = grid_resistors  # list of resistor values

    def notch_resistance(self, notch):
        """Calculate total resistance at a given notch position"""
        # Notch 0: all resistors in series with motor
        # Higher notches: progressively short out resistors
        active = self.grid[notch:]  # resistors still in circuit
        R_grid = sum(active)
        return R_grid + self.R_motor

    def calculate_notch(self, notch):
        """Full electrical analysis at a controller notch"""
        R_total = self.notch_resistance(notch)
        I = self.V_supply / R_total
        V_motor = I * self.R_motor
        P_motor = V_motor * I
        R_grid = R_total - self.R_motor
        P_waste = I**2 * R_grid
        P_total = self.V_supply * I
        eff = P_motor / P_total * 100 if P_total > 0 else 0

        return {
            "R_total": R_total, "I": I, "V_motor": V_motor,
            "P_motor": P_motor, "P_waste": P_waste, "eff": eff,
        }

# Kolkata tram: 10 starting resistors
grid_resistors = [1.5, 1.2, 1.0, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
motor_R = 2.0
supply_V = 600

controller = TramController(supply_V, motor_R, grid_resistors)

print("=== Tram Controller Notch Analysis ===")
print(f"Supply: {supply_V} V | Motor: {motor_R} ohm")
print(f"Grid resistors: {len(grid_resistors)} stages")
print()

print(f"{'Notch':>6} {'R_total':>8} {'Current':>8} {'V_motor':>8} {'P_motor':>10} "
      f"{'P_waste':>10} {'Eff':>6}")
print("-" * 58)

for notch in range(len(grid_resistors) + 1):
    r = controller.calculate_notch(notch)
    print(f"{notch:>6} {r['R_total']:>6.2f} {r['I']:>6.1f} A {r['V_motor']:>6.1f} V "
          f"{r['P_motor']/1000:>7.1f} kW {r['P_waste']/1000:>7.1f} kW {r['eff']:>4.0f}%")

# Startup sequence analysis
print()
print("=== Startup Energy Analysis ===")
print("Time to accelerate from notch 0 to full speed (notch 10)")
print("Assume 3 seconds per notch")

total_waste_kJ = 0
total_useful_kJ = 0
time_per_notch = 3  # seconds

for notch in range(len(grid_resistors) + 1):
    r = controller.calculate_notch(notch)
    waste_kJ = r["P_waste"] * time_per_notch / 1000
    useful_kJ = r["P_motor"] * time_per_notch / 1000
    total_waste_kJ += waste_kJ
    total_useful_kJ += useful_kJ

total_kJ = total_waste_kJ + total_useful_kJ
print(f"Total energy during startup: {total_kJ:.1f} kJ")
print(f"Useful (to motor): {total_useful_kJ:.1f} kJ ({total_useful_kJ/total_kJ*100:.0f}%)")
print(f"Wasted (as heat): {total_waste_kJ:.1f} kJ ({total_waste_kJ/total_kJ*100:.0f}%)")
print()
print("The resistor grid wastes significant energy as heat during")
print("every startup. This is why modern trams use electronic controllers!")`,
      challenge: 'Design a 5-notch controller (instead of 10) that reaches full speed with fewer stages. Calculate the current jump at each notch transition. A large current jump creates a jolt — keep the jump below 50 A per notch for passenger comfort. What resistor values achieve this?',
      successHint: 'Series-parallel circuit analysis is fundamental to all electronics. Every circuit board, power system, and electronic device uses these same principles. The tram\'s resistor grid is one of the simplest and most intuitive demonstrations of how resistance, current, and power relate.',
    },
    {
      title: 'Power and energy — how much electricity does a tram use?',
      concept: `**Power** is the rate of energy use: **P = V * I** (watts). **Energy** is power integrated over time: **E = P * t** (joules or watt-hours). A Kolkata tram consumes about 50-150 kW depending on speed and whether it is accelerating, cruising, or braking.

The tram's energy consumption varies dramatically through a typical trip: **0 kW** when stopped, **150 kW** when accelerating (motor at full power plus resistor losses), **50 kW** when cruising at constant speed, and **~0 kW** when coasting (motor disconnected, tram rolling on momentum).

Skilled drivers minimise energy by maximising coasting time — they accelerate to speed, disconnect the motor, and coast as far as possible before the next stop. This technique can reduce energy consumption by 20-30%.`,
      analogy: 'Power is like the rate you spend money — dollars per hour. Energy is the total bill. A short taxi ride at a high rate might cost less than a long ride at a low rate. Similarly, a brief burst of high power (acceleration) uses less energy than a long period of moderate power (fighting a headwind).',
      storyConnection: 'Kolkata tram drivers are paid partly based on the electricity their tram consumes. Experienced drivers have learned to use "notch-and-coast" technique: accelerate to 30 km/h on notch 8-10, then coast on momentum until speed drops to 15 km/h, then accelerate again. New drivers who keep the motor running continuously use 30-40% more electricity for the same route.',
      checkQuestion: 'A tram accelerates for 30 seconds at 120 kW, cruises for 60 seconds at 50 kW, and coasts for 90 seconds at 0 kW. What is the total energy used?',
      checkAnswer: 'E = 120*30 + 50*60 + 0*90 = 3600 + 3000 + 0 = 6600 kJ = 6.6 MJ = 1.83 kWh. The 30-second acceleration uses more energy than the 60-second cruise because power is much higher. This is why frequent stops (requiring frequent accelerations) waste so much energy.',
      codeIntro: 'Model a tram\'s energy consumption over a complete route with multiple stops.',
      code: `import numpy as np

# Tram energy consumption model for a route

def simulate_tram_trip(stops_km, speed_limit_kmh, tram_mass_kg):
    """Simulate a tram trip with multiple stops"""
    g = 9.81
    rho_air = 1.225
    Cd = 0.8       # tram drag coefficient
    A_front = 8    # frontal area (m2)
    f_roll = 0.005 # rolling resistance coefficient
    motor_eff = 0.85
    max_accel = 1.0  # m/s2
    max_brake = 1.2  # m/s2
    max_power_W = 150000

    v_max = speed_limit_kmh / 3.6
    total_energy_kJ = 0
    total_time_s = 0
    total_distance_m = 0
    segments = []

    for i in range(len(stops_km) - 1):
        segment_m = (stops_km[i+1] - stops_km[i]) * 1000
        stop_time = 20  # seconds at stop

        # Phase 1: Accelerate to v_max
        t_accel = v_max / max_accel
        d_accel = 0.5 * max_accel * t_accel**2

        # Phase 3: Brake from v_max to 0
        t_brake = v_max / max_brake
        d_brake = 0.5 * max_brake * t_brake**2

        # Phase 2: Cruise/coast for remaining distance
        d_cruise = segment_m - d_accel - d_brake
        if d_cruise < 0:
            # Not enough room to reach full speed
            v_peak = np.sqrt(max_accel * segment_m * max_brake / (max_accel + max_brake))
            t_accel = v_peak / max_accel
            d_accel = 0.5 * max_accel * t_accel**2
            t_brake = v_peak / max_brake
            d_brake = segment_m - d_accel
            d_cruise = 0
            t_cruise = 0
        else:
            v_peak = v_max
            t_cruise = d_cruise / v_max

        # Energy calculations
        # Acceleration: KE + drag + rolling resistance
        KE = 0.5 * tram_mass_kg * v_peak**2
        F_drag = 0.5 * rho_air * (v_peak/2)**2 * Cd * A_front  # avg speed
        F_roll = f_roll * tram_mass_kg * g
        E_accel = KE + (F_drag + F_roll) * d_accel
        E_accel_elec = E_accel / motor_eff

        # Cruise: only drag + rolling
        F_cruise_drag = 0.5 * rho_air * v_peak**2 * Cd * A_front
        E_cruise = (F_cruise_drag + F_roll) * d_cruise
        E_cruise_elec = E_cruise / motor_eff

        # Braking: kinetic energy converted to heat (wasted)
        E_brake_wasted = KE  # conventional braking

        segment_energy = (E_accel_elec + E_cruise_elec) / 1000  # kJ
        segment_time = t_accel + t_cruise + t_brake + stop_time

        segments.append({
            "from": stops_km[i], "to": stops_km[i+1],
            "distance": segment_m, "time": segment_time,
            "energy_kJ": segment_energy,
            "accel_kJ": E_accel_elec/1000,
            "cruise_kJ": E_cruise_elec/1000,
            "brake_waste_kJ": E_brake_wasted/1000,
        })

        total_energy_kJ += segment_energy
        total_time_s += segment_time
        total_distance_m += segment_m

    return segments, total_energy_kJ, total_time_s

# Kolkata Route 5: Esplanade to Gariahat (simplified)
stops = [0, 0.6, 1.1, 1.5, 2.0, 2.6, 3.2, 3.8, 4.3, 5.0]
stop_names = ["Esplanade", "Park St", "Camac St", "Elgin Rd",
              "Lansdowne", "Rashbehari", "Deshapriya", "Gariahat Rd",
              "Golpark", "Gariahat"]

speed_limit = 30  # km/h
tram_mass = 18000  # kg (loaded)

segs, total_E, total_T = simulate_tram_trip(stops, speed_limit, tram_mass)

print("=== Kolkata Tram Route 5 Energy Analysis ===")
print(f"Route: {stop_names[0]} to {stop_names[-1]} ({stops[-1]} km)")
print(f"Stops: {len(stops)} | Speed limit: {speed_limit} km/h")
print()

print(f"{'From-To':<20} {'Dist':>6} {'Accel':>8} {'Cruise':>8} {'Total':>8}")
print(f"{'':20} {'(m)':>6} {'(kJ)':>8} {'(kJ)':>8} {'(kJ)':>8}")
print("-" * 52)

for seg in segs:
    print(f"{seg['from']:.1f}-{seg['to']:.1f} km {'':8} "
          f"{seg['distance']:>4.0f} {seg['accel_kJ']:>6.1f} {seg['cruise_kJ']:>6.1f} "
          f"{seg['energy_kJ']:>6.1f}")

print(f"\\nTotal energy: {total_E:.0f} kJ ({total_E/3600:.2f} kWh)")
print(f"Total time: {total_T:.0f} s ({total_T/60:.1f} min)")
print(f"Energy per km: {total_E/stops[-1]:.0f} kJ/km ({total_E/3600/stops[-1]:.2f} kWh/km)")

# Braking energy wasted
brake_waste = sum(s["brake_waste_kJ"] for s in segs)
print(f"\\nEnergy wasted in braking: {brake_waste:.0f} kJ ({brake_waste/total_E*100:.0f}% of total)")
print("This energy could be recovered with regenerative braking!")`,
      challenge: 'Simulate the same route with only 5 stops (every other stop removed). How much energy is saved by fewer stops? Calculate energy per passenger-km if the tram carries 100 passengers. Compare to a diesel bus (0.5 MJ per passenger-km).',
      successHint: 'Energy analysis of transportation is how cities decide between trams, buses, metro, and BRT. The energy per passenger-km metric you calculated is the universal comparison tool. Trams typically use 0.1-0.3 MJ per passenger-km — far less than cars (2-4 MJ) or buses (0.5-1.0 MJ).',
    },
    {
      title: 'Ohm\'s law in practice — measuring and troubleshooting circuits',
      concept: `In practice, Ohm's law is the primary troubleshooting tool for electrical systems. If you know any two of V, I, R, you can calculate the third. A voltmeter measures voltage across a component. An ammeter measures current through it. The ratio gives resistance.

Common tram electrical faults: (1) **high resistance joint** — a corroded connection increases R, causing a hot spot and voltage drop. (2) **partial short circuit** — insulation breakdown reduces R, causing excessive current. (3) **open circuit** — a break in the wire means R = infinity and current = 0.

In the code below, you will build a tram electrical diagnostic tool that identifies faults from voltage and current measurements.`,
      analogy: 'Troubleshooting with Ohm\'s law is like being a detective. You measure clues (voltage, current) at different points in the circuit. If the current is lower than expected, something is adding resistance (a corroded joint). If it is higher, something is reducing resistance (a short circuit). Each measurement narrows down where the problem is.',
      storyConnection: 'Kolkata tram maintenance crews carry simple multimeters and know the expected voltage at every point in the circuit. A tram reporting "low power" gets a quick voltage check: if the overhead wire voltage is low, the problem is the supply (substation or feeder). If the wire voltage is normal but motor voltage is low, the problem is in the tram (bad controller, corroded connections).',
      checkQuestion: 'A tram normally draws 200 A from 600 V (R = 3 ohms). Today it draws only 150 A. Assuming supply voltage is still 600 V, what is the new total resistance? Where might the extra resistance be?',
      checkAnswer: 'R_new = 600/150 = 4 ohms. Extra resistance = 4 - 3 = 1 ohm. At 150 A, this extra ohm wastes 150^2 * 1 = 22,500 W = 22.5 kW as heat! Common locations: corroded pantograph contact, worn controller contacts, or a partially disconnected motor winding.',
      codeIntro: 'Build a tram electrical diagnostic system that identifies faults from measurements.',
      code: `import numpy as np

# Tram electrical diagnostic system

class TramDiagnostic:
    def __init__(self):
        # Normal operating values
        self.normal = {
            "V_supply": 600,
            "I_motor": 200,
            "R_wire": 0.15,
            "R_pantograph": 0.02,
            "R_controller": 0.50,
            "R_motor": 2.00,
            "R_rail": 0.10,
        }
        self.R_total_normal = sum(v for k, v in self.normal.items() if k.startswith("R_"))

    def diagnose(self, V_supply, V_pantograph, V_motor_in, V_motor_out, I_measured):
        """Diagnose faults from voltage measurements"""
        faults = []

        # Check supply voltage
        if V_supply < 550:
            faults.append(("LOW SUPPLY", f"V_supply = {V_supply}V (normal: 600V)",
                          "Check substation or feeder"))

        # Pantograph contact resistance
        R_panto = (V_supply - V_pantograph) / I_measured if I_measured > 0 else 999
        R_panto_expected = self.normal["R_wire"] + self.normal["R_pantograph"]
        if R_panto > R_panto_expected * 2:
            faults.append(("HIGH PANTO R", f"R = {R_panto:.3f} ohm (normal: {R_panto_expected:.3f})",
                          "Clean or replace pantograph carbon strip"))

        # Controller resistance
        R_ctrl = (V_pantograph - V_motor_in) / I_measured if I_measured > 0 else 999
        if R_ctrl > self.normal["R_controller"] * 1.5:
            faults.append(("HIGH CTRL R", f"R = {R_ctrl:.3f} ohm (normal: {self.normal['R_controller']:.3f})",
                          "Check controller contacts for arcing damage"))

        # Motor resistance
        R_motor = (V_motor_in - V_motor_out) / I_measured if I_measured > 0 else 999
        if R_motor > self.normal["R_motor"] * 1.3:
            faults.append(("HIGH MOTOR R", f"R = {R_motor:.3f} ohm (normal: {self.normal['R_motor']:.3f})",
                          "Check motor brushes and commutator"))
        if R_motor < self.normal["R_motor"] * 0.7:
            faults.append(("LOW MOTOR R", f"R = {R_motor:.3f} ohm — possible short",
                          "Inspect motor windings for insulation breakdown"))

        # Current check
        I_expected = V_supply / self.R_total_normal
        if I_measured > I_expected * 1.3:
            faults.append(("OVER CURRENT", f"I = {I_measured}A (expected: {I_expected:.0f}A)",
                          "Check for short circuits"))

        return faults

diag = TramDiagnostic()

# Test cases
test_cases = [
    ("Normal operation", 600, 574, 474, 74, 200),
    ("Worn pantograph", 600, 540, 440, 40, 160),
    ("Bad controller", 600, 574, 374, 74, 150),
    ("Motor brush wear", 600, 574, 474, 24, 180),
    ("Low supply voltage", 540, 514, 414, 14, 175),
    ("Short in motor", 600, 574, 474, 174, 260),
]

print("=== Tram Electrical Diagnostic Report ===")
print()

for name, V_s, V_p, V_mi, V_mo, I in test_cases:
    print(f"--- {name} ---")
    print(f"  V_supply={V_s}V  V_panto={V_p}V  V_motor_in={V_mi}V  "
          f"V_motor_out={V_mo}V  I={I}A")

    faults = diag.diagnose(V_s, V_p, V_mi, V_mo, I)
    if faults:
        for code, detail, action in faults:
            print(f"  FAULT: {code}")
            print(f"    {detail}")
            print(f"    Action: {action}")
    else:
        print(f"  STATUS: All parameters normal")

    # Power analysis
    P_total = V_s * I
    P_motor = (V_mi - V_mo) * I
    eff = P_motor / P_total * 100 if P_total > 0 else 0
    print(f"  Power: {P_total/1000:.1f} kW total, {P_motor/1000:.1f} kW to motor ({eff:.0f}% eff)")
    print()`,
      challenge: 'A tram reports intermittent power loss — sometimes normal, sometimes weak. The measurements fluctuate between normal and abnormal readings. What fault causes intermittent symptoms? (Hint: loose connection that makes and breaks contact.) Design a diagnostic test that catches intermittent faults by sampling multiple readings.',
      successHint: 'Electrical troubleshooting with Ohm\'s law is a universal skill. Electricians, automotive mechanics, electronics engineers, and even medical device technicians all use the same V = IR approach to isolate faults. The measurement-diagnosis-action workflow you just followed is standard in every maintenance field.',
    },
    {
      title: 'DC motor fundamentals — converting electricity to motion',
      concept: `The tram's DC motor converts electrical energy into rotational motion using the **motor effect**: a current-carrying conductor in a magnetic field experiences a force (**F = BIL**, where B is magnetic field strength, I is current, and L is conductor length).

The motor has two key relationships: **Torque = k * I** (torque is proportional to current) and **Back-EMF = k * omega** (the spinning motor generates a voltage that opposes the supply). At steady speed, the back-EMF nearly equals the supply voltage, and only a small current flows (just enough to overcome friction).

During startup, the motor is stationary (no back-EMF), so a huge current would flow without the starting resistors. This is why the controller progressively reduces resistance as the motor speeds up — matching the decreasing current demand as back-EMF builds up.`,
      analogy: 'A DC motor is like a revolving door with magnets. The magnets (field) pull on the current-carrying "door panels" (armature), making them spin. As the door spins faster, it generates a "wind" (back-EMF) that pushes back. At full speed, the magnetic pull and the wind push nearly balance, and the door spins freely with little effort.',
      storyConnection: 'Kolkata trams use classic DC series motors — the same basic design since the 1900s. The series motor has a useful property: torque is very high at low speed (when you need it most for starting) and decreases at high speed. This is perfect for tram operation: powerful starts from rest and efficient cruising at speed.',
      checkQuestion: 'A tram motor has back-EMF constant k = 2 V/(rad/s). At 100 rad/s (about 30 km/h), what is the back-EMF? If supply is 550 V, what current flows through a 2-ohm motor?',
      checkAnswer: 'Back-EMF = k * omega = 2 * 100 = 200 V. Net voltage across motor resistance = 550 - 200 = 350 V. Current = 350 / 2 = 175 A. The back-EMF reduces the current — without it (at startup), I = 550/2 = 275 A — dangerously high.',
      codeIntro: 'Model a DC tram motor\'s speed, torque, current, and back-EMF characteristics.',
      code: `import numpy as np

# DC motor model for Kolkata tram

class DCMotor:
    def __init__(self, V_supply, R_armature, k_torque, k_emf,
                 J_inertia, friction_Nm):
        self.V = V_supply
        self.R = R_armature
        self.kt = k_torque      # Nm/A
        self.ke = k_emf          # V/(rad/s)
        self.J = J_inertia       # kg*m2
        self.friction = friction_Nm

    def steady_state(self, load_torque_Nm):
        """Calculate steady-state speed for a given load"""
        # At steady state: V = ke*w + I*R, T = kt*I = load + friction
        I = (load_torque_Nm + self.friction) / self.kt
        back_emf = self.V - I * self.R
        omega = back_emf / self.ke  # rad/s
        speed_rpm = omega * 60 / (2 * np.pi)
        speed_kmh = omega * 0.5 * 3.6  # assume 0.5m wheel radius
        P_elec = self.V * I
        P_mech = load_torque_Nm * omega
        eff = P_mech / P_elec * 100 if P_elec > 0 else 0

        return {
            "omega": omega, "rpm": speed_rpm, "kmh": speed_kmh,
            "I": I, "back_emf": back_emf,
            "torque": load_torque_Nm, "P_elec": P_elec,
            "P_mech": P_mech, "eff": eff,
        }

    def startup_simulation(self, load_torque, dt=0.1, max_time=30):
        """Simulate motor startup from rest"""
        omega = 0
        t = 0
        history = []

        while t < max_time:
            back_emf = self.ke * omega
            I = (self.V - back_emf) / self.R
            torque = self.kt * I
            net_torque = torque - load_torque - self.friction
            alpha = net_torque / self.J  # angular acceleration

            history.append({
                "t": t, "omega": omega, "rpm": omega * 60 / (2*np.pi),
                "I": I, "back_emf": back_emf, "torque": torque,
            })

            omega += alpha * dt
            t += dt

            if alpha < 0.01 and t > 1:  # reached steady state
                break

        return history

# Kolkata tram motor parameters
motor = DCMotor(
    V_supply=550,       # V (after line losses)
    R_armature=2.0,     # ohms
    k_torque=3.0,       # Nm/A
    k_emf=3.0,          # V/(rad/s) (same as kt for ideal motor)
    J_inertia=50,       # kg*m2 (motor + gearbox + wheels)
    friction_Nm=20,     # Nm constant friction
)

# Steady-state characteristics at different loads
print("=== DC Motor Steady-State Characteristics ===")
print(f"{'Load (Nm)':>10} {'Speed':>8} {'Current':>8} {'Back-EMF':>10} {'P_mech':>8} {'Eff':>6}")
print("-" * 52)

for load in [0, 50, 100, 150, 200, 300, 400]:
    ss = motor.steady_state(load)
    if ss["omega"] > 0:
        print(f"{load:>10} {ss['kmh']:>5.1f} km/h {ss['I']:>6.0f} A "
              f"{ss['back_emf']:>7.0f} V {ss['P_mech']/1000:>5.1f} kW {ss['eff']:>4.0f}%")

# Startup simulation
print()
print("=== Motor Startup Simulation ===")
hist = motor.startup_simulation(100)  # 100 Nm load

print(f"{'Time (s)':>8} {'Speed (km/h)':>12} {'Current (A)':>12} {'Torque (Nm)':>12}")
print("-" * 46)

for h in hist:
    if h["t"] % 2.0 < 0.15 or h == hist[-1]:
        kmh = h["omega"] * 0.5 * 3.6
        print(f"{h['t']:>8.1f} {kmh:>10.1f} {h['I']:>10.0f} {h['torque']:>10.0f}")

print(f"\\nStartup current (t=0): {hist[0]['I']:.0f} A")
print(f"Steady current: {hist[-1]['I']:.0f} A")
print(f"Current ratio: {hist[0]['I']/hist[-1]['I']:.1f}x")
print("This high startup current is why starting resistors are essential!")`,
      challenge: 'Simulate the motor with starting resistors: at t=0, add 4 ohms of resistance (total R = 6). Every 3 seconds, remove 1 ohm. Track how the current changes. Does the starting current stay below a safe limit of 300 A? This is exactly how the real tram controller works.',
      successHint: 'DC motor physics governs everything from toy cars to industrial machinery to electric vehicle drivetrains. The back-EMF concept is key: a spinning motor naturally limits its own current. Understanding this feedback loop is essential for motor control, robotics, and electric vehicle design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Voltage, current, resistance, and basic circuits</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model electrical circuits, Ohm's law, and DC motor fundamentals for the Kolkata tram system.
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
