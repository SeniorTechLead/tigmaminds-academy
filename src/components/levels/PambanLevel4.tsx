import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PambanLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Load combination engine — combining dead, live, wind, and seismic loads',
      concept: `A bridge must resist multiple loads simultaneously, but not all loads occur at full intensity at the same time. **Load combinations** define how to add loads together with safety factors. For example: 1.2 x Dead + 1.6 x Live + 0.5 x Wind is one combination; 1.2 x Dead + 1.0 x Seismic + 0.5 x Live is another. The bridge must be safe under ALL combinations.

The engineer calculates internal forces for each combination and designs members for the worst case. Typically 5-10 load combinations are checked, and different members are critical under different combinations.

In this capstone, you build a load combination engine that automatically generates all required combinations and finds the critical case for each member.

*Load combination codes (like IS 875, ASCE 7, Eurocode) are developed from probability theory. The factors reflect the likelihood of two extreme events occurring simultaneously. Full dead load is always present (factor 1.2-1.4), but full wind and full earthquake rarely coincide (so they are not combined at full value).*`,
      analogy: 'Imagine packing for a trip where you might face rain, cold, and hiking. You pack for the worst combinations: heavy rain + cold (bring waterproof jacket), cold + hiking (bring warm layers), but you do not pack for all three at maximum intensity simultaneously (that would require too much luggage). Load combinations apply the same logic to structural loads.',
      storyConnection: 'The Pamban Bridge must handle trains (live load) during cyclone winds (wind load), and both during an earthquake (seismic). But the code does not require designing for maximum train load + maximum cyclone + maximum earthquake all at once — the probability is negligibly small. Instead, specific combinations are defined with reduced factors for secondary loads.',
      checkQuestion: 'Why is the wind load factor 0.5 when combined with full seismic? Both are horizontal forces.',
      checkAnswer: 'The probability of a maximum cyclone and a major earthquake occurring simultaneously is extremely small. A 500-year cyclone and a 475-year earthquake in the same hour has a probability of about 1 in 100 million. So the code uses reduced factors: full seismic + reduced wind, or full wind + reduced seismic — but never both at full intensity.',
      codeIntro: 'Build a load combination engine for the Pamban Bridge structural analysis.',
      code: `import numpy as np

class LoadCombinationEngine:
    def __init__(self):
        self.load_cases = {}
        self.combinations = []

    def add_load_case(self, name, forces):
        """Add a load case: dict of member_name: force_kN."""
        self.load_cases[name] = forces

    def add_combination(self, name, factors):
        """Add a combination: dict of load_case_name: factor."""
        self.combinations.append({"name": name, "factors": factors})

    def evaluate(self):
        """Calculate forces for all combinations."""
        results = {}
        all_members = set()
        for forces in self.load_cases.values():
            all_members.update(forces.keys())

        for combo in self.combinations:
            combo_forces = {}
            for member in all_members:
                total = 0
                for case_name, factor in combo["factors"].items():
                    if case_name in self.load_cases:
                        total += self.load_cases[case_name].get(member, 0) * factor
                combo_forces[member] = total
            results[combo["name"]] = combo_forces

        return results

    def find_critical(self, results):
        """Find the critical combination for each member."""
        all_members = set()
        for forces in results.values():
            all_members.update(forces.keys())

        critical = {}
        for member in all_members:
            max_force = 0
            max_combo = None
            for combo_name, forces in results.items():
                f = abs(forces.get(member, 0))
                if f > max_force:
                    max_force = f
                    max_combo = combo_name
            critical[member] = {"force": max_force, "combination": max_combo}

        return critical

# Set up Pamban Bridge load cases
engine = LoadCombinationEngine()

# Dead load (self-weight, always present)
engine.add_load_case("Dead", {
    "top_chord": -800, "bottom_chord": 700, "vertical": -400,
    "diagonal": 350, "pier_axial": -2000, "pier_moment": 100,
})

# Live load (train)
engine.add_load_case("Live", {
    "top_chord": -600, "bottom_chord": 500, "vertical": -300,
    "diagonal": 250, "pier_axial": -1000, "pier_moment": 50,
})

# Wind load
engine.add_load_case("Wind", {
    "top_chord": -100, "bottom_chord": -80, "vertical": 50,
    "diagonal": 200, "pier_axial": -50, "pier_moment": 800,
})

# Seismic load
engine.add_load_case("Seismic", {
    "top_chord": -150, "bottom_chord": -120, "vertical": 80,
    "diagonal": 300, "pier_axial": -100, "pier_moment": 1200,
})

# IS code load combinations
engine.add_combination("1: 1.5D + 1.5L", {"Dead": 1.5, "Live": 1.5})
engine.add_combination("2: 1.2D + 1.2L + 1.2W", {"Dead": 1.2, "Live": 1.2, "Wind": 1.2})
engine.add_combination("3: 1.5D + 1.5W", {"Dead": 1.5, "Wind": 1.5})
engine.add_combination("4: 0.9D + 1.5W", {"Dead": 0.9, "Wind": 1.5})
engine.add_combination("5: 1.2D + 1.2L + 1.2E", {"Dead": 1.2, "Live": 1.2, "Seismic": 1.2})
engine.add_combination("6: 1.5D + 1.5E", {"Dead": 1.5, "Seismic": 1.5})
engine.add_combination("7: 0.9D + 1.5E", {"Dead": 0.9, "Seismic": 1.5})

results = engine.evaluate()
critical = engine.find_critical(results)

print("=== Load Combination Results (kN) ===")
print()

members = ["top_chord", "bottom_chord", "vertical", "diagonal", "pier_axial", "pier_moment"]
combos = list(results.keys())

# Print header
header = "Member          " + "  ".join(f"{c[:8]:>10}" for c in combos[:5])
print(header)
print("-" * len(header))

for member in members:
    values = [results[c].get(member, 0) for c in combos[:5]]
    row = f"{member:<16}" + "  ".join(f"{v:>10.0f}" for v in values)
    print(row)

print()
print("=== Critical Load Combination per Member ===")
print()

header2 = "Member            Critical Force(kN)   Governing Combination"
print(header2)
print("-" * len(header2))

for member in members:
    c = critical[member]
    print(f"{member:<18} {c['force']:>16.0f}     {c['combination']}")`,
      challenge: 'Add a "sensitivity analysis": for each member, determine which load case contributes the most to the critical force. This tells the engineer where to focus design effort — if the pier moment is dominated by seismic, invest in seismic resistance; if by wind, invest in wind bracing.',
      successHint: 'You built a load combination engine used by every structural engineer in the world. Building codes in every country define specific load combinations, and software tools like STAAD, SAP2000, and ETABS automate exactly this process for complex structures.',
    },
    {
      title: 'Structural health monitoring — sensors for a living bridge',
      concept: `Modern bridges are instrumented with **structural health monitoring** (SHM) systems — networks of sensors that continuously measure strain, vibration, temperature, tilt, and corrosion. The data feeds into algorithms that detect damage, predict remaining life, and trigger maintenance alerts.

Key sensor types include: **strain gauges** (measure deformation), **accelerometers** (measure vibration for modal analysis), **thermocouples** (track temperature for thermal stress), **corrosion probes** (measure metal loss rate), and **GPS** (measure global movement for long bridges).

In this exercise, you build a simplified SHM data analysis system that processes sensor data from the Pamban Bridge and detects anomalies indicating potential damage.

*SHM is transforming infrastructure management from scheduled inspection to continuous monitoring. Instead of checking a bridge every 2 years and hoping nothing breaks between inspections, sensors watch 24/7 and alert engineers to developing problems.*`,
      analogy: 'SHM for a bridge is like a fitness tracker for your body. Instead of visiting the doctor once a year, you monitor heart rate, steps, and sleep continuously. If your heart rate suddenly spikes, the tracker alerts you immediately. Similarly, if a bridge strain gauge shows an unexpected increase, the SHM system flags it for investigation.',
      storyConnection: 'The new Pamban Bridge (currently under construction as a replacement for the 1914 bridge) will incorporate a comprehensive SHM system with over 200 sensors. This will be one of India\'s first fully instrumented sea bridges, providing real-time data on structural health to railway engineers.',
      checkQuestion: 'If a strain gauge on a bridge member normally reads 500 microstrain under a standard train, and suddenly reads 700 microstrain under the same train, what might have happened?',
      checkAnswer: 'The member is carrying 40% more strain than normal (700/500 = 1.4). This could mean: a neighbouring member has failed (redistributing load), a crack has formed (reducing the effective cross-section), or a connection has loosened (changing the force path). All three require immediate investigation.',
      codeIntro: 'Build a structural health monitoring system that processes sensor data and detects anomalies.',
      code: `import numpy as np

np.random.seed(42)

class SHMSystem:
    def __init__(self, n_sensors):
        self.n_sensors = n_sensors
        self.baselines = {}
        self.alerts = []

    def set_baseline(self, sensor_id, mean, std):
        """Set normal operating range for a sensor."""
        self.baselines[sensor_id] = {"mean": mean, "std": std}

    def generate_normal_data(self, sensor_id, n_points=100):
        """Simulate normal sensor readings."""
        b = self.baselines[sensor_id]
        return np.random.normal(b["mean"], b["std"], n_points)

    def inject_anomaly(self, data, start_idx, anomaly_type="shift", magnitude=2):
        """Inject an anomaly into sensor data."""
        anomalous = data.copy()
        if anomaly_type == "shift":
            anomalous[start_idx:] += magnitude * np.std(data)
        elif anomaly_type == "spike":
            anomalous[start_idx] += magnitude * 5 * np.std(data)
        elif anomaly_type == "drift":
            n = len(data) - start_idx
            anomalous[start_idx:] += np.linspace(0, magnitude * np.std(data), n)
        return anomalous

    def detect_anomalies(self, sensor_id, data, threshold_sigma=3):
        """Detect readings outside normal range."""
        b = self.baselines[sensor_id]
        z_scores = (data - b["mean"]) / b["std"]
        anomalies = np.where(np.abs(z_scores) > threshold_sigma)[0]
        return anomalies, z_scores

    def moving_average_detector(self, data, window=10, threshold=2):
        """Detect shifts using moving average comparison."""
        ma = np.convolve(data, np.ones(window)/window, mode='valid')
        overall_mean = np.mean(data[:window*3])
        deviations = (ma - overall_mean) / np.std(data[:window*3])
        shifts = np.where(np.abs(deviations) > threshold)[0]
        return shifts

# Set up SHM for Pamban Bridge
shm = SHMSystem(8)

sensors = [
    ("strain_girder_1", 500, 30),    # microstrain
    ("strain_girder_2", 480, 25),
    ("accel_pier_1", 0.05, 0.02),    # g
    ("temp_deck", 35, 8),             # degrees C
    ("tilt_pier_1", 0.001, 0.0005),  # radians
    ("corrosion_probe_1", 0.15, 0.03), # mm/year
]

for name, mean, std in sensors:
    shm.set_baseline(name, mean, std)

# Generate data with anomalies
print("=== Structural Health Monitoring: Pamban Bridge ===")
print()

# Normal operations
data_normal = shm.generate_normal_data("strain_girder_1", 200)

# Simulate a developing crack (gradual drift)
data_crack = shm.inject_anomaly(data_normal.copy(), 120, "drift", 3)

# Simulate a sudden connection failure (shift)
data_failure = shm.inject_anomaly(data_normal.copy(), 80, "shift", 4)

# Analyse each scenario
scenarios = [
    ("Normal operation", data_normal),
    ("Developing crack (drift)", data_crack),
    ("Connection failure (shift)", data_failure),
]

for name, data in scenarios:
    anomalies, z_scores = shm.detect_anomalies("strain_girder_1", data)
    shifts = shm.moving_average_detector(data)
    max_z = np.max(np.abs(z_scores))

    print(f"--- {name} ---")
    print(f"  Mean: {np.mean(data):.1f} | Std: {np.std(data):.1f}")
    print(f"  Max z-score: {max_z:.2f}")
    print(f"  Point anomalies: {len(anomalies)}")
    print(f"  Shift detections: {len(shifts)}")

    if len(anomalies) > 5 or len(shifts) > 3:
        print(f"  >>> ALERT: Abnormal behaviour detected!")
        if len(shifts) > 3:
            first_shift = shifts[0]
            print(f"  >>> Shift starts at reading #{first_shift}")
    else:
        print(f"  Status: Normal")
    print()

# Multi-sensor correlation
print("=== Multi-Sensor Correlation Analysis ===")
print("(Correlated changes across sensors indicate global damage)")
print()

# Simulate correlated damage: girder strain increases + tilt increases
strain_data = shm.generate_normal_data("strain_girder_1", 100)
tilt_data = shm.generate_normal_data("tilt_pier_1", 100)

# Add correlated anomaly
strain_damaged = strain_data.copy()
tilt_damaged = tilt_data.copy()
strain_damaged[60:] += 80  # strain increases
tilt_damaged[60:] += 0.002  # tilt increases (correlated)

corr_normal = np.corrcoef(strain_data, tilt_data)[0, 1]
corr_damaged = np.corrcoef(strain_damaged, tilt_damaged)[0, 1]

print(f"Strain-Tilt correlation (normal): {corr_normal:.3f}")
print(f"Strain-Tilt correlation (damaged): {corr_damaged:.3f}")
print(f"Correlation increase: {corr_damaged - corr_normal:.3f}")
print()
if corr_damaged > 0.5:
    print("HIGH CORRELATION DETECTED: suggests global structural change!")`,
      challenge: 'Add a machine learning anomaly detector: train a simple threshold on 100 readings of normal data, then test on new data with injected anomalies. Calculate the detection rate (sensitivity) and false alarm rate (specificity). Find the optimal threshold that maximizes detection while keeping false alarms below 5%.',
      successHint: 'You built a structural health monitoring analysis system. SHM is one of the fastest-growing fields in civil engineering, combining sensor technology, signal processing, and machine learning to keep infrastructure safe. The same techniques are used for aircraft, wind turbines, dams, and nuclear reactors.',
    },
    {
      title: 'Bridge lifespan simulator — predicting when to replace the Pamban Bridge',
      concept: `Bridges do not last forever. The decision to repair, strengthen, or replace a bridge depends on its remaining **structural capacity** (reduced by corrosion and fatigue), **maintenance cost** (increasing with age), **traffic demand** (increasing over time), and **risk of failure** (increasing as capacity decreases).

A **lifecycle cost analysis** compares the total cost of maintaining the existing bridge versus building a new one. The optimal replacement time is when the annual maintenance cost of the old bridge exceeds the annualized cost of a new bridge.

In this final capstone, you build a complete bridge lifecycle simulator that models degradation, maintenance, traffic growth, and cost to predict the optimal replacement year for the Pamban Bridge.

*Lifecycle cost analysis (LCCA) is the standard method for infrastructure investment decisions. Governments use it to decide when to build new bridges, repair highways, or replace water mains. The analysis considers not just construction cost but 50-100 years of maintenance, operation, and eventual demolition.*`,
      analogy: 'Think of an old car. Each year, the repair bills get larger. At some point, the annual repair cost exceeds the cost of car payments on a new car. That is the optimal replacement year. Bridges follow the same logic, but on a 100-year timescale and a billion-dollar cost scale.',
      storyConnection: 'India is currently building a new Pamban Bridge alongside the 1914 original. The decision was driven by lifecycle cost analysis: the old bridge requires increasingly expensive maintenance (corrosion repair, member replacement, speed restrictions) and cannot carry modern traffic loads. The new bridge will have a 120-year design life, lower maintenance cost, and higher capacity — eventually paying for itself through reduced maintenance and increased service.',
      checkQuestion: 'If maintaining the old bridge costs $5 million/year and increasing 10% annually, and a new bridge costs $200 million with $1 million/year maintenance, when does replacement become cheaper?',
      checkAnswer: 'Old bridge cost in year n: 5 x 1.1^n million/year. New bridge annualized: 200/50 + 1 = 5 million/year (over 50-year life). Setting equal: 5 x 1.1^n = 5, so 1.1^n = 1, n = 0 — they are equal right now! In practice, the new bridge becomes cheaper as soon as old bridge costs exceed about 5 million/year.',
      codeIntro: 'Build a complete bridge lifecycle cost simulator.',
      code: `import numpy as np

class BridgeLifecycleSimulator:
    def __init__(self, name, construction_cost, design_life_years,
                 base_maintenance_cost, capacity_rating=100):
        self.name = name
        self.cost = construction_cost
        self.design_life = design_life_years
        self.base_maint = base_maintenance_cost
        self.capacity = capacity_rating
        self.age = 0
        self.history = []

    def annual_maintenance_cost(self):
        """Maintenance cost increases exponentially with age."""
        age_factor = 1 + 0.05 * max(0, self.age - self.design_life * 0.5)
        condition_factor = (100 / max(self.capacity, 10)) ** 1.5
        return self.base_maint * age_factor * condition_factor

    def annual_degradation(self, environment="marine"):
        """Reduce capacity due to corrosion and fatigue."""
        base_rate = {"inland": 0.3, "coastal": 0.6, "marine": 0.8}
        rate = base_rate.get(environment, 0.5)
        age_acceleration = 1 + 0.01 * max(0, self.age - 50)
        self.capacity -= rate * age_acceleration
        self.capacity = max(self.capacity, 5)

    def simulate_year(self, environment="marine"):
        self.age += 1
        self.annual_degradation(environment)
        maint_cost = self.annual_maintenance_cost()
        self.history.append({
            "age": self.age,
            "capacity": self.capacity,
            "maint_cost": maint_cost,
            "cumulative_cost": sum(h["maint_cost"] for h in self.history) + maint_cost,
        })
        return maint_cost

def lifecycle_comparison(old_bridge_age, old_capacity, old_maint,
                         new_cost, new_maint, years=50):
    """Compare keeping old bridge vs building new one."""
    old = BridgeLifecycleSimulator("Old Pamban", 0, 80, old_maint, old_capacity)
    old.age = old_bridge_age

    new = BridgeLifecycleSimulator("New Pamban", new_cost, 120, new_maint, 100)

    old_cumulative = 0
    new_cumulative = new_cost  # includes construction cost
    crossover_year = None

    results = []
    for year in range(1, years + 1):
        old_annual = old.simulate_year("marine")
        new_annual = new.simulate_year("marine")

        old_cumulative += old_annual
        new_cumulative += new_annual

        if crossover_year is None and old_cumulative > new_cumulative:
            crossover_year = year

        results.append({
            "year": year,
            "old_annual": old_annual,
            "new_annual": new_annual,
            "old_cumulative": old_cumulative,
            "new_cumulative": new_cumulative,
            "old_capacity": old.capacity,
            "new_capacity": new.capacity,
        })

    return results, crossover_year

# Run lifecycle analysis
results, crossover = lifecycle_comparison(
    old_bridge_age=110,
    old_capacity=45,        # current estimated capacity %
    old_maint=3_000_000,    # current annual maintenance $
    new_cost=250_000_000,   # new bridge construction cost $
    new_maint=500_000,      # new bridge annual maintenance $
    years=50,
)

print("=== Pamban Bridge Lifecycle Cost Analysis ===")
print(f"Old bridge: 110 years old, ~45% capacity remaining")
print(f"New bridge: $250M construction, 120-year design life")
print()

header = "Year   Old Annual($M)  New Annual($M)  Old Cumul($M)  New Cumul($M)  Old Cap%"
print(header)
print("-" * len(header))

for r in results:
    if r["year"] % 5 == 0 or r["year"] <= 3 or r["year"] == crossover:
        marker = " <-- CROSSOVER" if r["year"] == crossover else ""
        print(f"{r['year']:>4}   {r['old_annual']/1e6:>12.1f}    {r['new_annual']/1e6:>12.1f}    "
              f"{r['old_cumulative']/1e6:>11.0f}    {r['new_cumulative']/1e6:>11.0f}    "
              f"{r['old_capacity']:>5.0f}%{marker}")

print()
if crossover:
    print(f"Replacement pays for itself in {crossover} years.")
    savings_50yr = results[-1]["old_cumulative"] - results[-1]["new_cumulative"]
    print(f"50-year savings from replacing now: USD {savings_50yr/1e6:.0f} million")
else:
    print("New bridge does not pay for itself within 50 years at current costs.")

# Risk analysis
print()
print("=== Failure Risk Over Time (Old Bridge) ===")
print()
for r in results:
    if r["year"] % 5 == 0:
        risk_pct = max(0, 100 - r["old_capacity"] * 2)
        bar = "#" * int(risk_pct / 2)
        print(f"  Year {r['year']:>2}: capacity {r['old_capacity']:>4.0f}%  "
              f"risk index {risk_pct:>3.0f}%  {bar}")`,
      challenge: 'Add a Monte Carlo simulation: run the lifecycle comparison 1000 times with random variations in corrosion rate (plus or minus 30%), maintenance cost growth (plus or minus 20%), and construction cost of new bridge (plus or minus 15%). Find the probability distribution of the crossover year. What is the 90% confidence interval?',
      successHint: 'You have built a complete infrastructure lifecycle cost model — the same tool used by governments and engineering firms to make billion-dollar investment decisions about bridges, highways, railways, and buildings. The analysis integrates structural degradation, maintenance economics, risk assessment, and financial analysis into a single decision-support framework.',
    },
    {
      title: 'Complete bridge simulator — all forces, all conditions, one model',
      concept: `In this final exercise, you integrate everything from all four levels into a single bridge structural analysis simulator. Given the bridge geometry, material properties, loading conditions, and environmental factors, it calculates: static forces under all load combinations, dynamic response to train loading, fatigue life, corrosion-adjusted capacity, thermal effects, seismic response, and overall structural adequacy.

This is a simplified version of what commercial bridge analysis software (SAP2000, MIDAS, LUSAS) does — a digital twin of the physical bridge that engineers use to make safety-critical decisions.

*A digital twin is a computational model that mirrors a physical structure, updated with real sensor data. The Pamban Bridge digital twin would incorporate SHM sensor data, traffic counts, weather data, and inspection reports to continuously assess the bridge's condition and predict future maintenance needs.*`,
      analogy: 'Think of this simulator as a flight simulator for the bridge. A pilot uses a flight simulator to test how the aircraft responds to different conditions (turbulence, engine failure, crosswinds). Similarly, bridge engineers use structural simulators to test how the bridge responds to different loading scenarios (heavy train + cyclone + earthquake + corrosion) without risking the real structure.',
      storyConnection: 'The complete simulator represents the accumulated engineering knowledge of over a century of Pamban Bridge operation. Every cyclone, every heavy train, every corrosion inspection has added to the understanding of how this bridge behaves. The simulator distils that century of experience into a computational tool that can predict the bridge\'s response to any future scenario.',
      checkQuestion: 'What is the single most important output of a complete bridge simulator?',
      checkAnswer: 'The **safety factor** under the critical load combination for the most vulnerable member. If this is above the required minimum (typically 1.5-2.0), the bridge is safe. If it falls below, the bridge needs strengthening or traffic restrictions. Everything else — deflection, vibration, fatigue, corrosion — feeds into this single critical number.',
      codeIntro: 'Run a complete structural analysis of the Pamban Bridge under multiple scenarios.',
      code: `import numpy as np

class PambanBridgeSimulator:
    def __init__(self):
        self.span = 56  # m
        self.n_spans = 143
        self.steel_yield = 250  # MPa
        self.E = 200  # GPa
        self.I = 2500000  # cm^4

        self.members = {
            "top_chord":     {"area_cm2": 300, "capacity_kN": 7500},
            "bottom_chord":  {"area_cm2": 280, "capacity_kN": 7000},
            "vertical":      {"area_cm2": 150, "capacity_kN": 3750},
            "diagonal":      {"area_cm2": 120, "capacity_kN": 3000},
            "pier":          {"area_cm2": 5000, "capacity_kN": 50000},
        }

    def static_analysis(self, train_mass_kg, wind_speed_kmh):
        forces = {}
        train_weight = train_mass_kg * 9.81 / 1000  # kN

        # Simplified force distribution
        forces["top_chord"] = -(800 + train_weight * 0.6)
        forces["bottom_chord"] = 700 + train_weight * 0.5
        forces["vertical"] = -(400 + train_weight * 0.3)
        forces["diagonal"] = 350 + train_weight * 0.25

        # Wind adds to pier moment
        v = wind_speed_kmh / 3.6
        wind_force = 0.5 * 1.225 * v**2 * 1.5 * 36  # kN (simplified)
        forces["pier"] = -(2000 + train_weight + wind_force * 0.5)

        return forces, wind_force

    def fatigue_check(self, stress_range_mpa, age_years, trains_per_day):
        if stress_range_mpa < 125:  # below endurance limit
            return {"life_remaining": "infinite", "status": "OK"}
        N_total = 10 ** (20 - 6 * np.log10(stress_range_mpa))
        cycles_used = age_years * trains_per_day * 365
        remaining = max(0, N_total - cycles_used)
        years_remaining = remaining / (trains_per_day * 365)
        status = "OK" if years_remaining > 30 else "MONITOR" if years_remaining > 10 else "CRITICAL"
        return {"life_remaining": f"{years_remaining:.0f} years", "status": status}

    def corrosion_check(self, age_years, has_protection=True):
        rate = 0.25 if not has_protection else 0.05  # mm/year per surface
        loss = rate * age_years * 2  # both surfaces
        original = 12  # mm
        remaining_pct = max(0, (original - loss) / original * 100)
        return {"thickness_loss_mm": loss, "remaining_pct": remaining_pct}

    def thermal_check(self, delta_T):
        expansion_mm = self.span * 12e-6 * delta_T * 1000
        stress_if_locked = self.E * 1000 * 12e-6 * delta_T
        return {"expansion_mm": expansion_mm, "stress_if_locked_mpa": stress_if_locked}

    def seismic_check(self, pier_mass_kg, zone_factor=0.16):
        Ah = zone_factor * 1.5 / (2 * 3.0)
        F_seismic = pier_mass_kg * 9.81 * Ah / 1000  # kN
        return {"seismic_force_kN": F_seismic}

    def full_assessment(self, scenario):
        print(f"\\n{'='*60}")
        print(f"  SCENARIO: {scenario['name']}")
        print(f"{'='*60}")

        # 1. Static
        forces, wind_f = self.static_analysis(
            scenario["train_mass_kg"], scenario["wind_kmh"])

        print("\\n  STATIC ANALYSIS:")
        min_fos = float('inf')
        crit_member = ""
        for member, force in forces.items():
            cap = self.members[member]["capacity_kN"]
            fos = cap / abs(force)
            if fos < min_fos:
                min_fos = fos
                crit_member = member
            print(f"    {member:<16} Force: {force:>8.0f} kN  Capacity: {cap:>6} kN  FOS: {fos:.2f}")

        # 2. Fatigue
        fatigue = self.fatigue_check(
            scenario["stress_range_mpa"], scenario["age"], scenario["trains_per_day"])
        print(f"\\n  FATIGUE: {fatigue['life_remaining']} [{fatigue['status']}]")

        # 3. Corrosion
        corrosion = self.corrosion_check(
            scenario["age"], scenario.get("has_protection", True))
        print(f"  CORROSION: {corrosion['thickness_loss_mm']:.1f}mm lost, "
              f"{corrosion['remaining_pct']:.0f}% remaining")

        # Adjust capacity for corrosion
        corr_factor = corrosion["remaining_pct"] / 100
        adjusted_fos = min_fos * corr_factor

        # 4. Thermal
        thermal = self.thermal_check(scenario["delta_T"])
        print(f"  THERMAL: {thermal['expansion_mm']:.1f}mm expansion, "
              f"{thermal['stress_if_locked_mpa']:.0f} MPa if locked")

        # 5. Seismic
        seismic = self.seismic_check(scenario.get("pier_mass_kg", 400000))
        print(f"  SEISMIC: {seismic['seismic_force_kN']:.0f} kN on pier")

        # Overall verdict
        print(f"\\n  OVERALL ASSESSMENT:")
        print(f"    Critical member: {crit_member}")
        print(f"    Raw FOS: {min_fos:.2f}")
        print(f"    Corrosion-adjusted FOS: {adjusted_fos:.2f}")

        if adjusted_fos < 1.0:
            verdict = "UNSAFE - Immediate action required"
        elif adjusted_fos < 1.5:
            verdict = "MARGINAL - Restrictions needed"
        elif adjusted_fos < 2.0:
            verdict = "ADEQUATE - Monitor closely"
        else:
            verdict = "SAFE - Normal operation"

        print(f"    VERDICT: {verdict}")
        return adjusted_fos

# Run scenarios
sim = PambanBridgeSimulator()

scenarios = [
    {"name": "Normal operation (today)",
     "train_mass_kg": 100000, "wind_kmh": 30, "stress_range_mpa": 100,
     "age": 110, "trains_per_day": 12, "delta_T": 25, "has_protection": True},
    {"name": "Heavy train + strong wind",
     "train_mass_kg": 150000, "wind_kmh": 80, "stress_range_mpa": 140,
     "age": 110, "trains_per_day": 20, "delta_T": 30},
    {"name": "Cyclone conditions",
     "train_mass_kg": 0, "wind_kmh": 180, "stress_range_mpa": 80,
     "age": 110, "trains_per_day": 0, "delta_T": 10},
]

for scenario in scenarios:
    sim.full_assessment(scenario)`,
      challenge: 'Add a "what-if" mode: if the bridge is strengthened (new members, cathodic protection), recalculate all checks with improved parameters. Determine the minimum strengthening needed to achieve FOS > 2.0 under all scenarios. Compare the strengthening cost to replacement cost.',
      successHint: 'You have built a complete bridge structural assessment system — a digital twin of the Pamban Bridge. This integrates static analysis, fatigue, corrosion, thermal effects, and seismic loading into a single decision-support tool. Real bridge engineering software does exactly this, with more sophisticated models but the same fundamental approach. You have bridged 110 years of Pamban Bridge engineering history with modern computational structural analysis.',
    },
    {
      title: 'Bridge replacement decision engine — repair, strengthen, or replace?',
      concept: `The ultimate engineering decision for an aging bridge is: **repair** (fix specific defects), **strengthen** (increase capacity of existing members), or **replace** (build a new bridge). Each option has different costs, timelines, and risk profiles. The decision depends on the current condition, future traffic demand, remaining life, and available budget.

A **decision matrix** scores each option against multiple criteria (cost, time, safety, capacity, disruption) and identifies the best overall choice. This is a real-world multi-criteria decision analysis (MCDA) — the same framework used for infrastructure investment decisions worldwide.

In this final exercise, you build a decision engine that takes the Pamban Bridge's current condition data and recommends the optimal course of action.

*Multi-criteria decision analysis is used by governments, corporations, and NGOs to make complex decisions. The World Bank uses MCDA for infrastructure investments. Transport agencies use it for bridge management. The method ensures decisions are systematic, transparent, and defensible.*`,
      analogy: 'Imagine choosing between repairing your old car, upgrading it, or buying a new one. You compare cost (repair is cheapest), reliability (new car is best), time without a car (repair is fastest), and future expenses (new car has lowest maintenance). The decision depends on your priorities. A decision matrix makes this comparison systematic.',
      storyConnection: 'India is currently replacing the Pamban Bridge — the decision was made after decades of increasing maintenance costs and the realisation that strengthening the 110-year-old structure would cost nearly as much as a new bridge while providing fewer benefits. The new cable-stayed bridge will have a 120-year design life, higher load capacity, and lower maintenance cost.',
      checkQuestion: 'If repairing the bridge costs 30 million dollars and lasts 15 years, while replacing costs 250 million dollars and lasts 120 years, which has the lower annualized cost?',
      checkAnswer: 'Repair: 30M / 15 = 2.0M per year. Replace: 250M / 120 = 2.08M per year. They are nearly identical in annualized cost. But the new bridge also has higher capacity, lower maintenance, and eliminates the risk of sudden failure. When non-cost factors are included, replacement often wins despite the higher upfront cost.',
      codeIntro: 'Build a bridge repair/strengthen/replace decision engine.',
      code: `import numpy as np

class BridgeDecisionEngine:
    def __init__(self, bridge_condition):
        self.condition = bridge_condition

    def score_option(self, option):
        """Score a decision option on multiple criteria (0-10 scale)."""
        scores = {}

        if option == "repair":
            scores["upfront_cost"] = 8      # low cost = high score
            scores["time_to_complete"] = 9   # fast
            scores["safety_improvement"] = 4 # limited
            scores["capacity_increase"] = 2  # none
            scores["remaining_life"] = 3     # 10-15 years
            scores["maintenance_cost"] = 3   # still high
            scores["disruption"] = 8         # minimal
        elif option == "strengthen":
            scores["upfront_cost"] = 5
            scores["time_to_complete"] = 6
            scores["safety_improvement"] = 7
            scores["capacity_increase"] = 5
            scores["remaining_life"] = 5     # 25-30 years
            scores["maintenance_cost"] = 5
            scores["disruption"] = 5
        elif option == "replace":
            scores["upfront_cost"] = 2       # very expensive
            scores["time_to_complete"] = 3   # slow (5-7 years)
            scores["safety_improvement"] = 10
            scores["capacity_increase"] = 10
            scores["remaining_life"] = 10    # 120 years
            scores["maintenance_cost"] = 9   # very low
            scores["disruption"] = 3         # major disruption

        return scores

    def weighted_score(self, scores, weights):
        total = sum(scores[k] * weights.get(k, 1) for k in scores)
        max_possible = sum(10 * weights.get(k, 1) for k in scores)
        return total / max_possible * 100

    def analyse(self):
        options = ["repair", "strengthen", "replace"]

        # Weight sets for different priorities
        weight_sets = {
            "Cost-focused": {
                "upfront_cost": 3, "time_to_complete": 2, "safety_improvement": 1,
                "capacity_increase": 1, "remaining_life": 1, "maintenance_cost": 2, "disruption": 2,
            },
            "Safety-focused": {
                "upfront_cost": 1, "time_to_complete": 1, "safety_improvement": 3,
                "capacity_increase": 2, "remaining_life": 3, "maintenance_cost": 1, "disruption": 1,
            },
            "Balanced": {
                "upfront_cost": 2, "time_to_complete": 1, "safety_improvement": 2,
                "capacity_increase": 2, "remaining_life": 2, "maintenance_cost": 2, "disruption": 1,
            },
        }

        print("=== Bridge Decision Analysis ===")
        print(f"Current condition: {self.condition}% capacity")
        print()

        # Score each option
        all_scores = {}
        for opt in options:
            all_scores[opt] = self.score_option(opt)

        # Raw scores
        print("--- Raw Scores (0-10) ---")
        criteria = list(all_scores["repair"].keys())
        header = "Criterion              Repair  Strengthen  Replace"
        print(header)
        print("-" * len(header))
        for c in criteria:
            print(f"{c:<23} {all_scores['repair'][c]:>5}  "
                  f"{all_scores['strengthen'][c]:>10}  {all_scores['replace'][c]:>7}")

        # Weighted analysis
        print()
        print("--- Weighted Scores by Priority (%) ---")
        header2 = "Priority              Repair  Strengthen  Replace  Winner"
        print(header2)
        print("-" * len(header2))

        for priority_name, weights in weight_sets.items():
            weighted = {}
            for opt in options:
                weighted[opt] = self.weighted_score(all_scores[opt], weights)
            winner = max(weighted, key=weighted.get)
            print(f"{priority_name:<22} {weighted['repair']:>5.0f}%  "
                  f"{weighted['strengthen']:>10.0f}%  {weighted['replace']:>6.0f}%  "
                  f"{winner.upper()}")

        # Lifecycle cost comparison
        print()
        print("--- 50-Year Lifecycle Cost ---")
        costs = {
            "repair": {"upfront": 30, "annual_maint": 5, "replacement_at_year": 15, "replacement_cost": 30},
            "strengthen": {"upfront": 80, "annual_maint": 3, "replacement_at_year": 30, "replacement_cost": 250},
            "replace": {"upfront": 250, "annual_maint": 1, "replacement_at_year": 120, "replacement_cost": 0},
        }

        for opt in options:
            c = costs[opt]
            total = c["upfront"]
            for year in range(1, 51):
                total += c["annual_maint"]
                if year == c["replacement_at_year"] and c["replacement_cost"] > 0:
                    total += c["replacement_cost"]
            print(f"  {opt.capitalize():<12} 50-year total: {total:>5}M "
                  f"(" + "$" + f"{total/50:.1f}M/year)")

# Run analysis
condition = 45  # current capacity percentage
engine = BridgeDecisionEngine(condition)
engine.analyse()`,
      challenge: 'Add uncertainty: each score has a range (e.g., replace upfront cost scores 1-3 depending on construction market conditions). Run a Monte Carlo simulation with 1000 random score variations and calculate the probability that each option wins under each priority set.',
      successHint: 'You have built a multi-criteria decision analysis system for infrastructure investment. This same framework is used by governments worldwide to make billion-dollar decisions about bridges, highways, railways, and buildings. You have transformed the Pamban Bridge story into a complete engineering decision-support system.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Simulate bridge structural analysis under load</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These capstone exercises build a complete bridge analysis system from load combinations to lifecycle cost.
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
