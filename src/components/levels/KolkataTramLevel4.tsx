import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KolkataTramLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Tram dynamics simulator — acceleration, cruise, coast, brake',
      concept: `A complete tram simulator models the vehicle as a dynamic system: at each time step, calculate the net force (motor thrust minus all resistances), compute acceleration (F=ma), update velocity, and update position. The driver chooses between four modes: **accelerate** (motor on, full power), **cruise** (motor on, reduced power to maintain speed), **coast** (motor off, rolling on momentum), and **brake** (motor off or regenerating, mechanical brakes assist).

The equations of motion: **m*a = F_motor - F_rolling - F_aero - F_grade - F_brake**, where each force depends on velocity and/or position. The simulation runs in small time steps (0.1 seconds) to capture the dynamics accurately.`,
      analogy: 'The simulator is like a very detailed driving game. At each frame (time step), the game calculates all forces, updates speed, and moves the tram. But instead of rendering graphics, we track energy, current, and temperature — turning the game into an engineering tool.',
      storyConnection: 'CTC uses simple spreadsheet models to estimate energy consumption for route planning. A full dynamic simulator like this one could predict energy consumption 10x more accurately, identify optimal driving strategies, and evaluate the benefit of infrastructure upgrades (new substations, energy storage) before spending money.',
      checkQuestion: 'A tram simulation uses dt = 0.1 seconds for a 20-minute trip. How many time steps are calculated?',
      checkAnswer: '20 minutes = 1200 seconds. 1200 / 0.1 = 12,000 time steps. At each step, about 10 calculations are needed (forces, acceleration, velocity, position, energy, etc.), so about 120,000 total operations — trivial for a modern computer.',
      codeIntro: 'Build a complete tram dynamics simulator for a Kolkata tram route.',
      code: `import numpy as np

class TramSimulator:
    def __init__(self, mass_kg=18000, Cd=0.8, A_front=8, f_roll=0.005,
                 wheel_r=0.5, gear_ratio=5, motor_R=2.0, motor_k=3.0,
                 V_supply=550):
        self.m = mass_kg
        self.Cd = Cd
        self.A = A_front
        self.f_roll = f_roll
        self.r_w = wheel_r
        self.gr = gear_ratio
        self.R = motor_R
        self.k = motor_k
        self.V = V_supply

    def forces(self, v, grade, mode, notch=10):
        g = 9.81
        F_roll = self.f_roll * self.m * g
        F_aero = 0.5 * 1.225 * v**2 * self.Cd * self.A
        F_grade = self.m * g * grade

        if mode == "accel":
            omega = v / self.r_w * self.gr
            I = self.V / (self.R + self.k * max(omega, 0.1))
            R_extra = (10 - notch) * 0.5
            I = self.V / (self.R + R_extra + self.k * max(omega, 0.1))
            T_motor = self.k * I**2
            F_motor = T_motor * self.gr / self.r_w
            P_elec = self.V * I
        elif mode == "cruise":
            F_resist = F_roll + F_aero + F_grade
            F_motor = F_resist
            P_elec = F_motor * v / 0.75 if v > 0 else 0
        elif mode == "coast":
            F_motor = 0
            P_elec = 0
        else:  # brake
            F_motor = -1.2 * self.m * g * 0.1  # braking force
            P_elec = 0

        F_net = F_motor - F_roll - F_aero - F_grade
        return F_net, P_elec, F_motor

    def simulate_route(self, stops_m, speed_limit_ms, grades, dt=0.1):
        v = 0
        x = 0
        t = 0
        E_total = 0
        stop_idx = 0
        mode = "accel"
        log = []

        while stop_idx < len(stops_m):
            target_stop = stops_m[stop_idx]
            dist_to_stop = target_stop - x
            grade = grades[min(stop_idx, len(grades)-1)]

            # Decide mode
            braking_dist = v**2 / (2 * 1.2) + 5  # with margin
            if dist_to_stop <= braking_dist:
                mode = "brake"
            elif v >= speed_limit_ms:
                mode = "coast"
            elif v < speed_limit_ms * 0.6:
                mode = "accel"
            else:
                mode = "cruise"

            F_net, P_elec, F_motor = self.forces(v, grade, mode)
            a = F_net / self.m
            a = max(-2.0, min(a, 1.5))

            v += a * dt
            v = max(0, v)
            x += v * dt
            E_total += P_elec * dt / 1000  # kJ

            if int(t * 10) % 50 == 0:
                log.append({"t": t, "x": x, "v_kmh": v*3.6, "mode": mode,
                           "E_kJ": E_total, "P_kW": P_elec/1000})

            t += dt

            if x >= target_stop and v < 0.5:
                stop_idx += 1
                v = 0
                t += 15  # dwell time

        return log, E_total, t

sim = TramSimulator()

# Route: 5 stops, 400m apart
stops = [400, 800, 1200, 1600, 2000]
grades = [0, 0.005, 0, -0.003, 0.01]
speed_limit = 30 / 3.6

log, total_E, total_t = sim.simulate_route(stops, speed_limit, grades)

print("=== Tram Route Simulation ===")
print(f"Route: {stops[-1]}m, {len(stops)} stops")
print()
print(f"{'Time':>6} {'Pos':>6} {'Speed':>8} {'Mode':>7} {'P (kW)':>8} {'E (kJ)':>8}")
print("-" * 46)

for l in log[::3]:
    print(f"{l['t']:>6.1f} {l['x']:>5.0f}m {l['v_kmh']:>6.1f} {l['mode']:>7} "
          f"{l['P_kW']:>6.1f} {l['E_kJ']:>6.0f}")

print(f"\nTotal time: {total_t:.0f} s ({total_t/60:.1f} min)")
print(f"Total energy: {total_E:.0f} kJ ({total_E/3600:.2f} kWh)")
print(f"Energy per km: {total_E/(stops[-1]/1000):.0f} kJ/km")

# Compare driving strategies
print()
print("=== Driving Strategy Comparison ===")
for limit_kmh, label in [(20, "Conservative"), (30, "Normal"), (40, "Aggressive")]:
    _, E, T = sim.simulate_route(stops, limit_kmh/3.6, grades)
    print(f"{label:<14} Speed limit: {limit_kmh} km/h | "
          f"Time: {T:.0f}s | Energy: {E:.0f} kJ | kJ/km: {E/(stops[-1]/1000):.0f}")`,
      challenge: 'Add a "eco-driving" mode that coasts for the maximum possible distance before each stop. Compare energy consumption to the normal strategy. How much time does eco-driving add? Is the energy saving worth the extra time?',
      successHint: 'Dynamic simulation is how every modern vehicle is designed and tested before building a prototype. Tesla, Boeing, and railway companies all use simulators like this — just with more detail. You built the core: forces, acceleration, and energy tracking over time.',
    },
    {
      title: 'Electrical network simulation — voltage across the whole route',
      concept: `The overhead wire is not a perfect conductor — it has resistance that causes voltage drops proportional to current and distance. When multiple trams draw power on the same section, the voltages interact: each tram's current causes additional voltage drop for its neighbours.

The network is modelled as a **resistor ladder**: each segment of wire has resistance proportional to its length, and each tram is a variable load (current sink) attached at its position. Solving this network requires **Kirchhoff's laws** — the sum of currents at each node equals zero, and the sum of voltages around each loop equals zero.`,
      analogy: 'Think of a garden hose with multiple sprinklers. The first sprinkler gets full pressure. The second gets less (pressure drops along the hose). The third gets even less. If all sprinklers open simultaneously, each one gets less water than if only one were open. The tram overhead wire works the same way — multiple trams sharing a wire reduce each other\'s available voltage.',
      storyConnection: 'Kolkata tram drivers on the Esplanade-to-Gariahat route sometimes notice their tram slowing when another tram on the same section accelerates simultaneously. This is the voltage drop effect — the accelerating tram draws heavy current, dropping the wire voltage for all trams on that section. Substations are spaced to limit this effect, but it still occurs during rush hour.',
      checkQuestion: 'A 2 km overhead wire has resistance 0.15 ohm. Two trams are on it: one at 0.5 km drawing 200 A, another at 1.5 km drawing 150 A. What voltage does the farther tram receive?',
      checkAnswer: 'Wire resistance per km = 0.075 ohm/km. Voltage drop to first tram: 0.5 * 0.075 * (200+150) = 13.1 V. Between trams: 1.0 * 0.075 * 150 = 11.25 V. Far tram voltage = 600 - 13.1 - 11.25 = 575.6 V. Both trams contribute to the voltage drop seen by the far tram.',
      codeIntro: 'Simulate the electrical network of a tram route section with multiple trams and substations.',
      code: `import numpy as np

class OverheadNetwork:
    def __init__(self, section_length_km, R_per_km, V_substation,
                 substation_positions_km):
        self.L = section_length_km
        self.R_km = R_per_km
        self.V_sub = V_substation
        self.subs = substation_positions_km

    def solve(self, tram_positions_km, tram_currents_A):
        """Solve for voltage at each tram position"""
        n_trams = len(tram_positions_km)
        voltages = []

        for i, pos in enumerate(tram_positions_km):
            # Find nearest substation
            min_V = 0
            for sub_pos in self.subs:
                dist = abs(pos - sub_pos)
                R_wire = dist * self.R_km

                # Current in wire from this substation to this tram
                I_total = tram_currents_A[i]
                # Add current from other trams between substation and this tram
                for j, other_pos in enumerate(tram_positions_km):
                    if j != i:
                        if (sub_pos <= other_pos <= pos) or (pos <= other_pos <= sub_pos):
                            I_total += tram_currents_A[j]

                V_at_tram = self.V_sub - I_total * R_wire
                min_V = max(min_V, V_at_tram)  # best substation wins

            voltages.append(min_V)

        return voltages

network = OverheadNetwork(
    section_length_km=5.0,
    R_per_km=0.075,
    V_substation=620,  # slightly above 600 to compensate for drops
    substation_positions_km=[0, 2.5, 5.0],
)

# Scenario 1: Single tram at different positions
print("=== Single Tram Voltage vs Position ===")
print(f"Substations at: {network.subs} km")
print(f"Wire: {network.R_km} ohm/km | Substation: {network.V_sub} V")
print()
print(f"{'Position (km)':>14} {'V_tram (V)':>10} {'V_drop (V)':>10}")
print("-" * 36)

for pos in np.arange(0, 5.1, 0.5):
    V = network.solve([pos], [200])[0]
    drop = network.V_sub - V
    print(f"{pos:>14.1f} {V:>8.1f} {drop:>8.1f}")

# Scenario 2: Multiple trams
print()
print("=== Rush Hour: 5 Trams on Section ===")
positions = [0.5, 1.2, 2.0, 3.3, 4.5]
currents = [200, 150, 80, 200, 150]  # different operating modes

print(f"{'Tram':>4} {'Position':>10} {'Current':>8} {'Voltage':>10} {'Power':>10}")
print("-" * 44)

voltages = network.solve(positions, currents)
for i in range(len(positions)):
    P = voltages[i] * currents[i] / 1000
    print(f"{i+1:>4} {positions[i]:>8.1f} km {currents[i]:>6} A {voltages[i]:>8.1f} V {P:>8.1f} kW")

min_V = min(voltages)
print(f"\nMinimum voltage: {min_V:.1f} V (limit: 500 V)")
print(f"Status: {'OK' if min_V > 500 else 'UNDERVOLTAGE!'}")

# Scenario 3: What if a substation fails?
print()
print("=== Substation Failure Analysis ===")
for failed_sub in [0, 1, 2]:
    active_subs = [s for i, s in enumerate(network.subs) if i != failed_sub]
    net_degraded = OverheadNetwork(5.0, 0.075, 620, active_subs)
    V_deg = net_degraded.solve(positions, currents)
    min_V_deg = min(V_deg)
    print(f"Sub at {network.subs[failed_sub]} km failed: min voltage = {min_V_deg:.1f} V "
          f"({'OK' if min_V_deg > 500 else 'UNDERVOLTAGE!'})")

# Time-varying simulation
print()
print("=== Dynamic Scenario (trams moving) ===")
print(f"{'Time':>4} {'Tram positions':>30} {'Min V':>8} {'Status':<12}")
print("-" * 56)

for t_min in range(0, 10):
    pos = [(0.5 + t_min * 0.3 + i * 0.8) % 5 for i in range(4)]
    cur = [200 if t_min % 2 == 0 else 80 for _ in range(4)]
    V_t = network.solve(pos, cur)
    pos_str = ", ".join(f"{p:.1f}" for p in pos)
    print(f"{t_min:>4} [{pos_str:>26}] {min(V_t):>6.1f} "
          f"{'OK' if min(V_t) > 500 else 'LOW!':<12}")`,
      challenge: 'Add a fourth substation at 1.25 km and re-run the rush hour scenario. By how much does the minimum voltage improve? Calculate the cost of a new substation (Rs 2 crore) vs the benefit of reduced voltage drop (less motor heating, more reliable operation). Is the investment justified?',
      successHint: 'Electrical network analysis is fundamental to power engineering. The same methods solve problems in power grids, telecommunications networks, and even neural networks. Kirchhoff\'s laws, applied systematically, can solve any network no matter how complex.',
    },
    {
      title: 'Complete tram system simulator — route, motor, grid, and economics',
      concept: `Now we combine everything into a single integrated simulation: the tram moves along the route (dynamics), the motor draws current (electrical), the wire drops voltage (network), and energy is consumed (economics). Each subsystem affects the others: low voltage reduces motor torque, which slows the tram, which increases trip time, which increases energy cost.

This **coupled simulation** represents how real engineering systems work — nothing operates in isolation. A change in one subsystem ripples through all the others.`,
      analogy: 'A coupled simulation is like a full-body health check versus checking one organ at a time. High blood pressure (low voltage) affects the heart (motor), which affects exercise capacity (tram speed), which affects overall fitness (system performance). You need to see the whole picture to understand the system.',
      storyConnection: 'CTC is evaluating whether to modernise the tram fleet or shut it down. A complete system simulation can answer: if we upgrade motors, install choppers, add regenerative braking, and optimise scheduling, what is the total cost and benefit? Without this analysis, the decision is made on politics rather than engineering.',
      checkQuestion: 'If upgrading the motor saves 15% energy, adding regen saves 20%, and installing choppers saves 25%, is the total saving 60%?',
      checkAnswer: 'No! The savings interact. With chopper: 75% of original. With regen: 80% of that = 60%. With better motor: 85% of that = 51% of original. Total saving = 49%, not 60%. Each upgrade reduces the base that the next upgrade applies to. Coupled simulation captures this correctly.',
      codeIntro: 'Build the complete integrated tram system simulator and evaluate modernisation scenarios.',
      code: `import numpy as np

class IntegratedTramSim:
    def __init__(self, mass=18000, V_nominal=600, motor_R=2.0,
                 motor_k=3.0, controller_eff=0.55, regen_eff=0):
        self.m = mass
        self.V_nom = V_nominal
        self.R = motor_R
        self.k = motor_k
        self.ctrl_eff = controller_eff
        self.regen_eff = regen_eff
        self.f_roll = 0.005

    def run_trip(self, route_km, n_stops, speed_limit_kmh=30):
        """Simulate a complete one-way trip"""
        g = 9.81
        v_max = speed_limit_kmh / 3.6
        stop_spacing = route_km * 1000 / n_stops

        E_consumed = 0  # kJ consumed from grid
        E_regen = 0     # kJ recovered
        total_time = 0  # seconds

        for stop in range(n_stops):
            # Phase 1: Accelerate to v_max
            v = 0
            dt = 0.5
            while v < v_max:
                F_motor = self.m * 1.0  # 1 m/s2 acceleration
                F_resist = self.f_roll * self.m * g + 0.5 * 1.225 * v**2 * 0.8 * 8
                F_net = F_motor + F_resist  # total force needed
                P_mech = F_net * max(v, 0.1)
                P_elec = P_mech / (self.ctrl_eff * 0.85)  # controller * motor eff
                E_consumed += P_elec * dt / 1000
                v += 1.0 * dt
                v = min(v, v_max)
                total_time += dt

            # Phase 2: Cruise
            cruise_dist = stop_spacing * 0.5
            cruise_time = cruise_dist / v_max
            F_cruise = self.f_roll * self.m * g + 0.5 * 1.225 * v_max**2 * 0.8 * 8
            P_cruise = F_cruise * v_max / (self.ctrl_eff * 0.85)
            E_consumed += P_cruise * cruise_time / 1000
            total_time += cruise_time

            # Phase 3: Brake (with optional regen)
            KE = 0.5 * self.m * v_max**2
            E_regen += KE * self.regen_eff / 1000
            total_time += v_max / 1.2  # braking time

            # Dwell time
            total_time += 20  # seconds at stop

        net_energy = E_consumed - E_regen
        return {
            "E_consumed": E_consumed,
            "E_regen": E_regen,
            "E_net": net_energy,
            "time_min": total_time / 60,
            "E_per_km": net_energy / route_km,
        }

# Define scenarios
scenarios = [
    ("Current fleet (resistor ctrl)", 18000, 0.55, 0),
    ("Chopper controller only", 18000, 0.95, 0),
    ("Chopper + regen braking", 18000, 0.95, 0.60),
    ("Full modernisation", 14000, 0.97, 0.70),
    ("Lightweight + supercaps", 12000, 0.97, 0.80),
]

route_km = 8
n_stops = 15

print("=== Integrated System Comparison ===")
print(f"Route: {route_km} km, {n_stops} stops")
print()
print(f"{'Scenario':<32} {'E_net':>8} {'Time':>8} {'kJ/km':>8} {'kWh/km':>8}")
print("-" * 66)

baseline = None
for name, mass, ctrl_eff, regen in scenarios:
    sim = IntegratedTramSim(mass=mass, controller_eff=ctrl_eff, regen_eff=regen)
    result = sim.run_trip(route_km, n_stops)
    if baseline is None:
        baseline = result["E_net"]
    saving = (1 - result["E_net"] / baseline) * 100
    print(f"{name:<32} {result['E_net']:>6.0f} {result['time_min']:>6.1f} "
          f"{result['E_per_km']:>6.0f} {result['E_per_km']/3600:>6.3f} ({saving:+.0f}%)")

# Economic analysis
print()
print("=== 10-Year Economic Analysis (fleet of 100 trams) ===")
fleet = 100
trips_per_day = 8
days_per_year = 300
cost_per_kWh = 8  # Rs
years = 10

upgrade_costs = {
    "Current fleet (resistor ctrl)": 0,
    "Chopper controller only": 100 * 300000,
    "Chopper + regen braking": 100 * 500000,
    "Full modernisation": 100 * 1500000,
    "Lightweight + supercaps": 100 * 3000000,
}

print(f"{'Scenario':<32} {'Upgrade':>10} {'Annual E':>10} {'10yr net':>12}")
print(f"{'':32} {'(Rs lakh)':>10} {'(Rs lakh)':>10} {'(Rs lakh)':>12}")
print("-" * 66)

for name, mass, ctrl_eff, regen in scenarios:
    sim = IntegratedTramSim(mass=mass, controller_eff=ctrl_eff, regen_eff=regen)
    result = sim.run_trip(route_km, n_stops)

    annual_kWh = result["E_net"] / 3600 * trips_per_day * days_per_year * fleet * 2
    annual_cost = annual_kWh * cost_per_kWh
    upgrade = upgrade_costs[name]
    ten_year = upgrade + annual_cost * years

    print(f"{name:<32} {upgrade/1e5:>8.0f} {annual_cost/1e5:>8.0f} {ten_year/1e5:>10.0f}")

print()
print("Lowest 10-year total cost = best investment!")
print("Full modernisation often wins despite high upfront cost.")`,
      challenge: 'Add a "do nothing and shut down" scenario: annual operating loss of Rs 20 crore, replaced by diesel buses. Compare the 10-year cost of bus replacement vs tram modernisation. Include carbon emissions: trams use grid electricity (0.8 kg CO2/kWh in India), buses emit 2.7 kg CO2/litre of diesel. Which option is better for the city and the climate?',
      successHint: 'You just built an integrated system simulation that combines physics, engineering, and economics — the same approach used to evaluate billion-dollar infrastructure investments worldwide. The ability to model coupled systems and compare scenarios is one of the most valuable skills in engineering and policy analysis.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Simulate complete tram electrical system</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises build a complete tram system simulator integrating dynamics, electrical networks, and economic analysis.
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
