import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KolkataTramLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'DC motor torque and speed — the fundamental trade-off',
      concept: `A DC motor's torque-speed characteristic defines its personality. For the series motor used in trams: **T = k * I** and **V = I*R + k*omega**, combining to give **T = k*(V - k*omega)/R**. This means torque decreases linearly as speed increases.

At stall (omega = 0), torque is maximum: **T_stall = kV/R**. At no-load, speed is maximum and torque is just enough to overcome friction. The motor naturally finds the operating point where its torque equals the load torque.

Series motors are ideal for trams because they produce enormous torque at low speed (for starting a heavy tram from rest) and moderate torque at high speed (for maintaining cruise). No other motor type matches this characteristic as naturally.`,
      analogy: 'A series motor is like a weightlifter who can lift 500 kg very slowly or 50 kg very quickly, but not both at once. At the start (heavy tram, zero speed), the motor gives maximum effort. As the tram picks up speed, the effort decreases but is still enough to maintain motion.',
      storyConnection: 'Kolkata\'s 18-tonne trams must start on streets shared with cars, pedestrians, and the occasional cow. The series motor\'s high starting torque allows smooth departure without blocking traffic. At stops on slight inclines, the motor must generate enough torque to hold the tram against gravity — about 1,800 Nm for a 1% grade.',
      checkQuestion: 'A motor has k = 3 Nm/A, R = 2 ohms, V = 550 V. What is the stall torque? At what speed (omega) does torque drop to 100 Nm?',
      checkAnswer: 'Stall: I = V/R = 550/2 = 275 A. T = 3 * 275 = 825 Nm. For T = 100 Nm: I = 100/3 = 33.3 A. V = IR + k*omega, so omega = (V - IR)/k = (550 - 33.3*2)/3 = (550-66.7)/3 = 161 rad/s (about 55 km/h).',
      codeIntro: 'Map the complete torque-speed characteristic of a tram DC series motor.',
      code: `import numpy as np

# DC series motor torque-speed characteristic

class SeriesMotor:
    def __init__(self, V, R_arm, R_field, k):
        self.V = V
        self.R = R_arm + R_field  # total series resistance
        self.k = k  # motor constant

    def torque_speed_curve(self, n_points=50):
        """Generate torque vs speed characteristic"""
        # At any speed omega: V = I*(R) + k*I*omega (series motor: flux ~ I)
        # For series motor: back-EMF = k*I*omega
        # V = I*R + k*I*omega => I = V/(R + k*omega)
        # T = k*I^2 (series motor torque is proportional to I^2)
        omegas = np.linspace(0.1, 200, n_points)
        results = []
        for w in omegas:
            I = self.V / (self.R + self.k * w)
            T = self.k * I**2
            P_mech = T * w
            P_elec = self.V * I
            eff = P_mech / P_elec * 100 if P_elec > 0 else 0
            speed_kmh = w * 0.5 * 3.6  # 0.5m wheel radius
            results.append({"omega": w, "kmh": speed_kmh, "I": I,
                           "T": T, "P_mech": P_mech, "eff": eff})
        return results

motor = SeriesMotor(V=550, R_arm=1.0, R_field=1.0, k=0.15)

print("=== Tram Series Motor Characteristic ===")
print(f"Supply: {motor.V} V | Total R: {motor.R} ohm | k: {motor.k}")
print()

curve = motor.torque_speed_curve()

print(f"{'Speed':>8} {'Torque':>10} {'Current':>10} {'Power':>10} {'Eff':>6}")
print(f"{'(km/h)':>8} {'(Nm)':>10} {'(A)':>10} {'(kW)':>10}")
print("-" * 46)

for r in curve[::5]:
    print(f"{r['kmh']:>8.1f} {r['T']:>8.0f} {r['I']:>8.0f} {r['P_mech']/1000:>8.1f} {r['eff']:>4.0f}%")

# Operating point for different conditions
print()
print("=== Operating Points ===")

tram_mass = 18000  # kg
wheel_radius = 0.5  # m
g = 9.81

conditions = [
    ("Level road, no wind", 0, 0),
    ("1% uphill grade", 0.01, 0),
    ("2% uphill grade", 0.02, 0),
    ("Level + headwind 30 km/h", 0, 30),
    ("1% downhill", -0.01, 0),
]

print(f"{'Condition':<28} {'Load (Nm)':>10} {'Speed':>8} {'Current':>8}")
print("-" * 56)

for name, grade, headwind_kmh in conditions:
    # Resistance forces
    F_grade = tram_mass * g * grade
    F_rolling = 0.005 * tram_mass * g
    F_drag = 0.5 * 1.225 * (headwind_kmh/3.6)**2 * 0.8 * 8
    F_total = F_grade + F_rolling + F_drag
    T_load = F_total * wheel_radius

    # Find operating point where motor torque = load torque
    for r in curve:
        motor_T = r["T"]
        if motor_T <= T_load:
            print(f"{name:<28} {T_load:>8.0f} {r['kmh']:>6.1f} {r['I']:>6.0f}")
            break
    else:
        print(f"{name:<28} {T_load:>8.0f} {'N/A':>6} {'stall':>6}")

# Parallel vs series motor operation (for 2 motors)
print()
print("=== Two Motors: Series vs Parallel Connection ===")
print("Series: both motors on 550V together (275V each)")
print("Parallel: each motor gets full 550V")
print()
print(f"{'Config':<12} {'V/motor':>8} {'Speed':>8} {'Total T':>10} {'Total P':>10}")
print("-" * 50)

# Series: each motor sees V/2
I_series = 550 / (2 * motor.R + 2 * motor.k * 50)
T_series = 2 * motor.k * I_series**2
P_series = T_series * 50

# Parallel: each motor sees full V
I_par = 550 / (motor.R + motor.k * 100)
T_par = 2 * motor.k * I_par**2
P_par = T_par * 100

print(f"{'Series':<12} {275:>8} {50*0.5*3.6:>6.1f} {T_series:>8.0f} {P_series/1000:>8.1f} kW")
print(f"{'Parallel':<12} {550:>8} {100*0.5*3.6:>6.1f} {T_par:>8.0f} {P_par/1000:>8.1f} kW")`,
      challenge: 'A tram needs to start on a 3% grade carrying a full load of passengers (20 tonnes total). What minimum torque is needed? Does the motor provide enough stall torque? If not, what gear ratio would bridge the gap?',
      successHint: 'The torque-speed characteristic is the most important specification of any motor. Electric vehicle designers, robotics engineers, and industrial machine designers all start with this curve. Understanding it lets you match a motor to any application.',
    },
    {
      title: 'Back-EMF and speed regulation — the motor\'s self-balancing act',
      concept: `**Back-EMF** (electromotive force) is the voltage generated by a spinning motor that opposes the supply voltage. It is nature's speed regulator: as the motor speeds up, back-EMF increases, reducing the current and therefore the torque. The motor accelerates until torque equals the load — then it runs at constant speed.

For a DC motor: **V_supply = I*R + E_back**, where E_back = k*omega. The current is: **I = (V_supply - E_back) / R**. At full speed, E_back is close to V_supply, and only a small current flows — just enough to overcome friction and load.

This self-regulation is elegant: increase the load and the motor briefly slows, reducing E_back, increasing current, increasing torque — automatically compensating. Decrease the load and the motor briefly speeds up, increasing E_back, reducing current — again, automatic compensation.`,
      analogy: 'Back-EMF is like cruise control built into the physics. Drive uphill — the car slows, the engine works harder (more current). Drive downhill — the car speeds up, the engine backs off (less current). The motor does this automatically through the back-EMF mechanism, no electronics required.',
      storyConnection: 'When a Kolkata tram encounters a slight uphill section, the driver does not need to adjust the controller. The motor automatically responds: speed drops slightly, back-EMF drops, more current flows, more torque is generated, and the tram maintains nearly constant speed. This self-regulating behaviour is why series motors have been reliable workhorses for over a century.',
      checkQuestion: 'A motor runs at 100 rad/s with back-EMF of 500 V from a 550 V supply (R = 2 ohms). The load suddenly doubles. Describe what happens in the first few seconds.',
      checkAnswer: 'The motor slows (load exceeds torque). As omega decreases, E_back drops below 500 V. The voltage across R increases (550 - E_back), so current increases. Higher current means higher torque. The motor settles at a new, slightly lower speed where the increased torque matches the doubled load.',
      codeIntro: 'Simulate the back-EMF response of a tram motor to changing load conditions.',
      code: `import numpy as np

# Back-EMF dynamic simulation

def simulate_motor_response(V, R, k, J, friction, load_profile, dt=0.01, duration=20):
    """
    Simulate motor response to time-varying load.
    load_profile: function(time) -> load_torque_Nm
    """
    t = 0
    omega = 50  # start at some speed (rad/s)
    history = []

    while t < duration:
        # Back-EMF
        E_back = k * omega

        # Current
        I = (V - E_back) / R
        I = max(0, I)  # motor can't generate negative current passively

        # Motor torque (series motor: T ~ k*I^2)
        T_motor = k * I * I / max(I, 1)  # simplified: use T = k*I for stability

        # Load torque
        T_load = load_profile(t) + friction

        # Net torque and acceleration
        T_net = T_motor - T_load
        alpha = T_net / J

        # Update speed
        omega += alpha * dt
        omega = max(0, omega)

        history.append({
            "t": t, "omega": omega, "kmh": omega * 0.5 * 3.6,
            "E_back": E_back, "I": I, "T_motor": T_motor,
            "T_load": load_profile(t),
        })

        t += dt

    return history

# Scenario: load changes during the trip
def load_scenario(t):
    """Varying load: flat, then uphill, then flat, then downhill"""
    if t < 5:
        return 200    # flat road
    elif t < 10:
        return 500    # uphill grade
    elif t < 15:
        return 200    # flat again
    else:
        return 50     # downhill

V = 550
R = 2.0
k = 3.0
J = 50
friction = 20

hist = simulate_motor_response(V, R, k, J, friction, load_scenario, duration=20)

print("=== Motor Response to Load Changes ===")
print(f"{'Time':>5} {'Speed':>8} {'Back-EMF':>10} {'Current':>8} {'T_motor':>10} {'Load':>8}")
print(f"{'(s)':>5} {'(km/h)':>8} {'(V)':>10} {'(A)':>8} {'(Nm)':>10} {'(Nm)':>8}")
print("-" * 52)

for h in hist:
    if abs(h["t"] % 1.0) < 0.015 or abs(h["t"] - 5) < 0.015 or abs(h["t"] - 10) < 0.015:
        print(f"{h['t']:>5.1f} {h['kmh']:>6.1f} {h['E_back']:>8.0f} {h['I']:>6.0f} "
              f"{h['T_motor']:>8.0f} {h['T_load']:>6.0f}")

# Key observations
print()
speeds_flat1 = [h["kmh"] for h in hist if 3 < h["t"] < 5]
speeds_hill = [h["kmh"] for h in hist if 8 < h["t"] < 10]
speeds_flat2 = [h["kmh"] for h in hist if 13 < h["t"] < 15]
speeds_down = [h["kmh"] for h in hist if 18 < h["t"] < 20]

print("=== Speed Regulation Summary ===")
if speeds_flat1:
    print(f"Flat road:   {np.mean(speeds_flat1):.1f} km/h")
if speeds_hill:
    print(f"Uphill:      {np.mean(speeds_hill):.1f} km/h (auto-slowed, more torque)")
if speeds_flat2:
    print(f"Flat again:  {np.mean(speeds_flat2):.1f} km/h (recovering)")
if speeds_down:
    print(f"Downhill:    {np.mean(speeds_down):.1f} km/h (auto-accelerated)")

print()
print("The motor automatically compensates for load changes!")
print("No driver intervention needed — back-EMF does the work.")

# Energy analysis
total_E_elec = sum(h["I"] * V * 0.01 for h in hist) / 1000
total_E_mech = sum(h["T_motor"] * h["omega"] * 0.01 for h in hist) / 1000
print(f"\nElectrical energy consumed: {total_E_elec:.1f} kJ")
print(f"Mechanical energy delivered: {total_E_mech:.1f} kJ")
print(f"Overall efficiency: {total_E_mech/total_E_elec*100:.1f}%")`,
      challenge: 'Simulate a sudden load spike (passenger surge at a stop, load jumps from 200 to 800 Nm in 0.1 seconds). How quickly does the motor respond? What is the maximum current during the transient? Does it exceed the safe limit of 400 A?',
      successHint: 'The back-EMF feedback loop is a natural control system — no electronics needed. The same principle governs generators, alternators, and even electromagnetic braking. Understanding this feedback is the foundation for all motor control theory.',
    },
    {
      title: 'Speed control methods — from resistors to choppers',
      concept: `Kolkata's classic trams control speed by adding or removing **series resistance** (the resistor grid). This wastes energy as heat. Modern trams use **chopper control**: a transistor switches the voltage on and off rapidly, and the **duty cycle** (fraction of time the switch is on) controls the average voltage to the motor.

Chopper efficiency is nearly 100% because the transistor is either fully on (zero voltage drop) or fully off (zero current) — no resistive heating. Average motor voltage = duty_cycle * V_supply. A 50% duty cycle gives 300 V average from a 600 V supply.

The chopper switches at 1-10 kHz — fast enough that the motor's inductance smooths out the current pulses into a nearly steady flow.`,
      analogy: 'The resistor grid is like dimming a light bulb by putting a blanket over it — the light dims but the blanket gets hot (wasted energy). The chopper is like dimming by turning the light on and off very rapidly — your eye sees an average brightness, but no energy is wasted as heat.',
      storyConnection: 'Kolkata Transport Corporation (CTC) experimented with chopper-controlled trams in the 2000s. The energy savings were 25-30% compared to resistor control. However, the cost of retrofitting the entire fleet and training mechanics in semiconductor technology delayed full adoption. As of today, most Kolkata trams still use the heritage resistor grid.',
      checkQuestion: 'A chopper operates at 50% duty cycle from 600 V supply. What is the average voltage to the motor? If motor R = 2 ohms, what is the average current?',
      checkAnswer: 'Average voltage = 0.50 * 600 = 300 V. Average current = 300 / 2 = 150 A (approximately — inductance smoothing affects the exact value). Compare to resistor method: to get 300 V at the motor from 600 V, you need 300 V across the resistor, wasting 150 A * 300 V = 45 kW as heat. The chopper wastes nearly zero.',
      codeIntro: 'Compare resistor control, chopper control, and hybrid approaches for tram speed regulation.',
      code: `import numpy as np

# Speed control comparison: resistor vs chopper

class ResistorControl:
    def __init__(self, V_supply, R_motor):
        self.V = V_supply
        self.R_m = R_motor

    def at_speed(self, target_V_motor):
        """Calculate parameters to achieve target motor voltage"""
        R_series = (self.V - target_V_motor) / (target_V_motor / self.R_m)
        I = target_V_motor / self.R_m
        P_motor = target_V_motor * I
        P_waste = I**2 * R_series
        P_total = self.V * I
        eff = P_motor / P_total * 100
        return {"R_series": R_series, "I": I, "P_motor": P_motor,
                "P_waste": P_waste, "P_total": P_total, "eff": eff}

class ChopperControl:
    def __init__(self, V_supply, R_motor, switching_loss_pct=2):
        self.V = V_supply
        self.R_m = R_motor
        self.loss = switching_loss_pct / 100

    def at_speed(self, target_V_motor):
        """Calculate parameters with chopper control"""
        duty = target_V_motor / self.V
        I = target_V_motor / self.R_m
        P_motor = target_V_motor * I
        P_switch = P_motor * self.loss  # small switching losses
        P_total = P_motor + P_switch
        eff = P_motor / P_total * 100
        return {"duty": duty, "I": I, "P_motor": P_motor,
                "P_waste": P_switch, "P_total": P_total, "eff": eff}

V = 600
R_m = 2.0
resistor = ResistorControl(V, R_m)
chopper = ChopperControl(V, R_m)

print("=== Speed Control Comparison ===")
print(f"Supply: {V} V | Motor R: {R_m} ohm")
print()

print(f"{'V_motor':>8} {'Method':>10} {'Current':>8} {'P_motor':>10} {'P_waste':>10} {'Eff':>6}")
print("-" * 54)

for V_target in [100, 200, 300, 400, 500, 580]:
    # Resistor
    r = resistor.at_speed(V_target)
    print(f"{V_target:>8} {'Resistor':>10} {r['I']:>6.0f} A {r['P_motor']/1000:>7.1f} kW "
          f"{r['P_waste']/1000:>7.1f} kW {r['eff']:>4.0f}%")
    # Chopper
    c = chopper.at_speed(V_target)
    print(f"{'':>8} {'Chopper':>10} {c['I']:>6.0f} A {c['P_motor']/1000:>7.1f} kW "
          f"{c['P_waste']/1000:>7.1f} kW {c['eff']:>4.0f}%")
    print()

# Daily energy comparison
print("=== Daily Energy & Cost Comparison ===")
# Typical speed profile: 40% of time at 200V, 30% at 400V, 30% at 550V
profile = [(0.40, 200), (0.30, 400), (0.30, 550)]
operating_hours = 14

total_E_resistor = 0
total_E_chopper = 0

for fraction, V_m in profile:
    hours = operating_hours * fraction
    r = resistor.at_speed(V_m)
    c = chopper.at_speed(V_m)
    total_E_resistor += r["P_total"] * hours / 1000  # kWh
    total_E_chopper += c["P_total"] * hours / 1000

savings_kWh = total_E_resistor - total_E_chopper
cost_per_kWh = 8  # INR

print(f"Resistor control: {total_E_resistor:.0f} kWh/day")
print(f"Chopper control:  {total_E_chopper:.0f} kWh/day")
print(f"Daily savings:    {savings_kWh:.0f} kWh ({savings_kWh/total_E_resistor*100:.0f}%)")
print(f"Daily cost saving: Rs {savings_kWh * cost_per_kWh:.0f}")
print(f"Annual saving:    Rs {savings_kWh * cost_per_kWh * 300:.0f}")

# Chopper retrofit payback
chopper_cost = 500000  # INR per tram
annual_saving = savings_kWh * cost_per_kWh * 300
payback = chopper_cost / annual_saving
print(f"\nChopper retrofit cost: Rs {chopper_cost:,}")
print(f"Payback period: {payback:.1f} years")`,
      challenge: 'A "regenerative chopper" not only saves energy during motoring but also recovers energy during braking. If 30% of a tram\'s daily energy can be regenerated, calculate the total annual savings. Does the payback period justify the 20% higher cost of a regenerative chopper?',
      successHint: 'Power electronics — the field of semiconductor switching for power control — has revolutionised transportation. Every electric vehicle, from Tesla to modern trams to electric trains, uses chopper or inverter control. The principle is always the same: control average voltage by rapid switching, not by resistive waste.',
    },
    {
      title: 'Motor torque curves — matching motor to traction demand',
      concept: `A tram motor must produce torque that matches the **traction demand curve** — the torque needed at the wheel to overcome all resistance forces at every speed. The demand curve has three components:

1. **Rolling resistance**: constant force, torque = F_roll * r_wheel
2. **Aerodynamic drag**: increases with v^2, so torque = 0.5*rho*v^2*Cd*A * r_wheel
3. **Grade resistance**: constant for a given slope, torque = m*g*sin(theta) * r_wheel

The motor must provide torque above the demand curve at every speed. Where motor torque equals demand, the tram reaches **equilibrium speed**. If demand exceeds motor torque at any speed, the tram cannot reach or maintain that speed.`,
      analogy: 'Think of a cyclist. At low speed, the main resistance is the hill (grade). At high speed, it is the wind (aero drag). The cyclist must pedal hard enough to beat both — the traction demand is the sum. If the cyclist\'s leg torque falls below the demand, they slow down until the reduced demand matches their reduced output.',
      storyConnection: 'Kolkata\'s tram routes include the flat stretch along Maidan (easy) and the approach to Howrah Bridge (slight grade with heavy traffic requiring frequent stops). The motor must provide enough torque for the worst case: starting from rest on the Howrah approach grade with a full passenger load, in monsoon rain that increases rolling resistance.',
      checkQuestion: 'A tram on a 2% grade has rolling resistance of 900 N and aero drag of 200 N at 20 km/h. Total resistance = 900 + 200 + 18000*9.81*0.02 = 4632 N. With 0.5 m wheel radius, what torque is needed?',
      checkAnswer: 'T = F * r = 4632 * 0.5 = 2316 Nm. The motor (through gearing) must provide at least this torque at 20 km/h. If the gear ratio is 5:1, the motor must produce 2316/5 = 463 Nm at the motor shaft.',
      codeIntro: 'Plot motor torque vs traction demand curves and find the tram\'s performance envelope.',
      code: `import numpy as np

# Traction demand vs motor torque matching

g = 9.81
rho = 1.225

class TramTraction:
    def __init__(self, mass_kg, Cd, A_front, f_roll, wheel_r, gear_ratio):
        self.m = mass_kg
        self.Cd = Cd
        self.A = A_front
        self.f_roll = f_roll
        self.r_w = wheel_r
        self.gr = gear_ratio

    def demand_torque(self, v_kmh, grade_pct):
        """Traction torque demand at wheel"""
        v = v_kmh / 3.6
        F_roll = self.f_roll * self.m * g
        F_aero = 0.5 * rho * v**2 * self.Cd * self.A
        F_grade = self.m * g * grade_pct / 100
        F_total = F_roll + F_aero + F_grade
        T_wheel = F_total * self.r_w
        T_motor = T_wheel / self.gr  # torque at motor shaft
        return T_motor, F_total

    def motor_torque(self, v_kmh, V_supply=550, R=2.0, k=0.15):
        """Series motor torque at given tram speed"""
        v = v_kmh / 3.6
        omega_wheel = v / self.r_w
        omega_motor = omega_wheel * self.gr
        I = V_supply / (R + k * omega_motor)
        T = k * I**2
        return T, I

tram = TramTraction(
    mass_kg=18000, Cd=0.8, A_front=8, f_roll=0.005,
    wheel_r=0.5, gear_ratio=5.0
)

print("=== Traction Demand vs Motor Torque ===")
print(f"Tram: {tram.m} kg, Cd={tram.Cd}, gear ratio {tram.gr}:1")
print()

speeds = np.arange(0, 50, 2)

print(f"{'Speed':>6} {'Demand 0%':>10} {'Demand 1%':>10} {'Demand 2%':>10} "
      f"{'Motor T':>10} {'Surplus':>10}")
print(f"{'km/h':>6} {'(Nm)':>10} {'(Nm)':>10} {'(Nm)':>10} {'(Nm)':>10} {'(Nm)':>10}")
print("-" * 58)

max_speed_flat = 0
max_speed_1pct = 0
max_speed_2pct = 0

for v in speeds:
    if v == 0:
        v = 0.1
    T_d0, _ = tram.demand_torque(v, 0)
    T_d1, _ = tram.demand_torque(v, 1)
    T_d2, _ = tram.demand_torque(v, 2)
    T_m, I = tram.motor_torque(v)
    surplus = T_m - T_d0

    if T_m >= T_d0 and v > max_speed_flat:
        max_speed_flat = v
    if T_m >= T_d1 and v > max_speed_1pct:
        max_speed_1pct = v
    if T_m >= T_d2 and v > max_speed_2pct:
        max_speed_2pct = v

    if v < 1 or int(v) % 5 == 0:
        print(f"{v:>6.0f} {T_d0:>8.0f} {T_d1:>8.0f} {T_d2:>8.0f} {T_m:>8.0f} {surplus:>8.0f}")

print()
print("=== Maximum Speed by Grade ===")
print(f"Flat road (0%): {max_speed_flat} km/h")
print(f"1% grade:       {max_speed_1pct} km/h")
print(f"2% grade:       {max_speed_2pct} km/h")

# Acceleration performance
print()
print("=== Acceleration Performance (flat road) ===")
print(f"{'Speed':>8} {'Motor T':>10} {'Demand T':>10} {'Surplus T':>10} {'Accel':>10}")
print("-" * 50)

for v in [0.1, 5, 10, 15, 20, 25, 30]:
    T_d, F_d = tram.demand_torque(v, 0)
    T_m, _ = tram.motor_torque(v)
    T_surplus = T_m - T_d
    F_surplus = T_surplus * tram.gr / tram.r_w
    accel = F_surplus / tram.m
    print(f"{v:>8.0f} {T_m:>8.0f} {T_d:>8.0f} {T_surplus:>8.0f} {accel:>8.2f} m/s2")

v_test = 0.1
T_d, _ = tram.demand_torque(v_test, 0)
T_m, _ = tram.motor_torque(v_test)
F_net = (T_m - T_d) * tram.gr / tram.r_w
a0 = F_net / tram.m
t_to_30 = (30/3.6) / (a0 * 0.5)  # approximate with halving acceleration
print(f"\nApprox time to 30 km/h: {t_to_30:.0f} seconds")`,
      challenge: 'The tram is redesigned as a lightweight modern vehicle: 12 tonnes (instead of 18), Cd = 0.5 (instead of 0.8), better bearings (f_roll = 0.003). Calculate the new maximum speed and acceleration. How much does modernisation improve performance without changing the motor?',
      successHint: 'Traction demand matching is the core task of powertrain engineering for every vehicle: cars, trucks, trains, ships, and aircraft. The curves you just plotted are identical in concept to those used by Tesla, Toyota, and Boeing. The motor must exceed the demand at every operating point.',
    },
    {
      title: 'Regenerative braking — turning kinetic energy back into electricity',
      concept: `When a tram brakes conventionally, its kinetic energy (0.5*m*v^2) is converted to heat in the brake pads — wasted. **Regenerative braking** reverses the motor: instead of consuming electricity to drive the wheels, the wheels drive the motor, which acts as a generator, converting kinetic energy back into electricity.

The recovered energy is: **E_regen = eta_regen * 0.5 * m * v^2**, where eta_regen is the regeneration efficiency (typically 60-80%). For an 18-tonne tram stopping from 30 km/h: E = 0.7 * 0.5 * 18000 * (30/3.6)^2 = **437 kJ** per stop.

With 50 stops per day, that is **21,850 kJ = 6.1 kWh** recovered per day per tram. Over a fleet of 100 trams operating 300 days per year, this totals **183,000 kWh** — enough to power 50 households for a year.`,
      analogy: 'Conventional braking is like going downhill and dragging your feet to slow down — the energy goes into heating your shoes. Regenerative braking is like going downhill and using a dynamo to charge your phone — the same slowing effect, but the energy is captured instead of wasted.',
      storyConnection: 'Kolkata\'s tram routes have frequent stops (every 300-500 metres) in the congested city centre. Each stop wastes kinetic energy. With regenerative braking, the tram could recover 20-30% of its total energy consumption. For a fleet struggling with high electricity costs, this could make the difference between financial viability and closure.',
      checkQuestion: 'An 18-tonne tram travelling at 30 km/h has kinetic energy 0.5 * 18000 * 8.33^2 = 625 kJ. If regenerative braking recovers 70%, how much energy per stop?',
      checkAnswer: '625 * 0.7 = 437.5 kJ per stop. Over 50 stops per day = 21,875 kJ = 6.08 kWh. At Rs 8 per kWh, that saves Rs 48.6 per day per tram, or Rs 14,580 per year per tram.',
      codeIntro: 'Simulate regenerative braking and calculate energy recovery for the Kolkata tram fleet.',
      code: `import numpy as np

# Regenerative braking simulation

g = 9.81

class RegenBrake:
    def __init__(self, mass_kg, motor_eff, regen_eff, wheel_r=0.5):
        self.m = mass_kg
        self.motor_eff = motor_eff
        self.regen_eff = regen_eff
        self.r_w = wheel_r

    def braking_energy(self, v_initial_kmh, v_final_kmh=0):
        """Calculate kinetic energy and recoverable energy"""
        v_i = v_initial_kmh / 3.6
        v_f = v_final_kmh / 3.6
        KE = 0.5 * self.m * (v_i**2 - v_f**2)
        E_regen = KE * self.regen_eff
        return KE, E_regen

    def simulate_stop(self, v_initial_kmh, decel_ms2, dt=0.1):
        """Simulate a braking event with regeneration"""
        v = v_initial_kmh / 3.6
        distance = 0
        E_recovered = 0
        E_friction = 0
        time = 0
        log = []

        while v > 0.1:
            # Regenerative power depends on speed (generator output)
            P_regen = 0.5 * 1000 * v**2 * 0.06 * 0.005  # simplified
            # At low speed, regen becomes ineffective
            regen_fraction = min(0.8, v / (v_initial_kmh/3.6))
            decel_regen = decel_ms2 * regen_fraction
            decel_mech = decel_ms2 - decel_regen

            E_step_regen = self.m * decel_regen * v * dt * self.regen_eff
            E_step_mech = self.m * decel_mech * v * dt  # wasted as heat

            E_recovered += E_step_regen
            E_friction += E_step_mech
            distance += v * dt
            v -= decel_ms2 * dt
            time += dt

            if int(time * 10) % 5 == 0:
                log.append({"t": time, "v_kmh": v*3.6, "E_regen": E_recovered,
                           "E_friction": E_friction})

        return E_recovered, E_friction, distance, time, log

tram = RegenBrake(mass_kg=18000, motor_eff=0.85, regen_eff=0.70)

# Single stop analysis
KE, E_regen = tram.braking_energy(30)
print("=== Single Braking Event (30 km/h to 0) ===")
print(f"Tram mass: {tram.m} kg")
print(f"Kinetic energy: {KE/1000:.1f} kJ")
print(f"Recoverable (70% eff): {E_regen/1000:.1f} kJ")
print(f"Wasted as heat: {(KE - E_regen)/1000:.1f} kJ")

# Detailed simulation
E_rec, E_fric, dist, time, log = tram.simulate_stop(30, 1.2)
print(f"\nBraking distance: {dist:.1f} m")
print(f"Braking time: {time:.1f} s")
print(f"Energy recovered: {E_rec/1000:.1f} kJ")
print(f"Energy to friction: {E_fric/1000:.1f} kJ")

# Daily fleet analysis
print()
print("=== Daily Fleet Analysis ===")
stops_per_trip = 10
trips_per_day = 8
fleet_size = 100

speeds = [10, 15, 20, 25, 30]
weights = [0.1, 0.2, 0.3, 0.25, 0.15]  # fraction of stops at each speed

daily_regen_per_tram = 0
daily_KE_per_tram = 0

print(f"{'Speed':>6} {'Frequency':>10} {'KE (kJ)':>8} {'Regen (kJ)':>12}")
print("-" * 38)

for v, w in zip(speeds, weights):
    n_stops = stops_per_trip * trips_per_day * w
    KE_per_stop, E_per_stop = tram.braking_energy(v)
    daily_KE = KE_per_stop * n_stops / 1000
    daily_regen = E_per_stop * n_stops / 1000
    daily_regen_per_tram += daily_regen
    daily_KE_per_tram += daily_KE
    print(f"{v:>6} {n_stops:>8.0f} {KE_per_stop/1000:>6.1f} {daily_regen:>10.1f}")

print(f"\nDaily per tram: {daily_regen_per_tram:.1f} kJ ({daily_regen_per_tram/3600:.2f} kWh)")
print(f"Daily fleet total: {daily_regen_per_tram * fleet_size / 3600:.0f} kWh")

annual = daily_regen_per_tram * fleet_size * 300 / 3600
cost_rate = 8  # INR per kWh
annual_savings = annual * cost_rate

print(f"\nAnnual fleet recovery: {annual:,.0f} kWh")
print(f"Annual cost savings: Rs {annual_savings:,.0f}")
print(f"  = " + f"USD {annual_savings/80:,.0f}")

# Break-even analysis
regen_retrofit_cost = fleet_size * 300000  # Rs 3 lakh per tram
payback_years = regen_retrofit_cost / annual_savings
print(f"\nRetrofit cost (fleet): Rs {regen_retrofit_cost:,.0f}")
print(f"Payback period: {payback_years:.1f} years")`,
      challenge: 'Not all regenerated energy can be used immediately — it must either go to another tram on the same section (consuming power) or be stored in a battery. If only 60% of regenerated energy finds a consumer, recalculate the savings. Design a 100 kWh battery storage system at each substation — what does it cost, and does it pay for itself?',
      successHint: 'Regenerative braking is now standard in every electric and hybrid vehicle. Tesla cars recover 60-70% of braking energy. Electric trains in Japan recover enough energy to power station lighting. The Kolkata tram fleet represents an untapped opportunity — the same technology could save crores of rupees annually.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">DC motor torque, back-EMF, and speed control</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model motor characteristics, speed control, and regenerative braking for the Kolkata tram.
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
