import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function DharmaWheelLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Capstone: Flywheel grid storage simulator — system architecture',
      concept: `In Levels 1–3 you mastered friction, torque, angular momentum, gyroscopic effects, gear trains, materials limits, and numerical simulation. Now you build the **Flywheel Grid Storage Simulator** — a complete model of a flywheel energy storage system connected to a power grid.

The system has five subsystems:
1. **Rotor**: carbon fibre flywheel, stores energy as KE = ½Iω²
2. **Motor/Generator**: converts between electrical power and mechanical torque
3. **Bearing system**: magnetic levitation with minimal friction losses
4. **Power electronics**: controls charge/discharge rate, frequency matching
5. **Grid interface**: responds to grid demand, smooths renewable energy output

The simulation pipeline:
- Grid sends power demand signal (positive = deliver, negative = absorb)
- Power electronics convert demand to motor/generator torque command
- Motor/generator applies torque: τ = Iα changes ω
- Rotor energy state updates: KE = ½Iω²
- Losses calculated: bearing friction, windage, electrical conversion
- State of charge reported: SOC = (KE - KE_min) / (KE_max - KE_min)`,
      analogy: 'The flywheel grid system is like a reservoir dam for electricity. Solar panels are the rain (energy in during sunny hours). The grid is the city downstream (constant demand). The flywheel is the reservoir (storing excess, releasing during shortage). Your simulator models the dam’s water level (KE), inflow (charging), outflow (discharging), and evaporation (losses).',
      storyConnection: 'The capstone project embodies the Dharma Wheel’s deepest teaching: energy, like wisdom, must be stored, transmitted, and released at the right time. The flywheel stores excess solar energy during the day and releases it at night — the physics of impermanence put to practical use.',
      checkQuestion: 'Why are flywheels better than batteries for rapid grid stabilisation (seconds), while batteries are better for long-duration storage (hours)?',
      checkAnswer: 'Flywheels respond in milliseconds (mechanical inertia is instant), have unlimited charge/discharge cycles, and deliver high power for short bursts. But they self-discharge (bearing friction) and are expensive per kWh. Batteries respond in seconds (electrochemistry is slower), degrade with cycling, but self-discharge slowly and are cheaper per kWh for large capacities. The ideal grid uses both: flywheels for seconds-to-minutes stabilisation, batteries for hours-to-days storage.',
      codeIntro: 'Build the rotor and motor/generator subsystems.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# CAPSTONE: Flywheel Grid Storage Simulator
# Stage 1: Rotor and Motor/Generator
# ============================================================

class FlywheelRotor:
    def __init__(self, mass=100, r_outer=0.35, r_inner=0.25,
                 material='carbon_fibre'):
        materials = {
            'steel': {'rho': 7800, 'sigma': 500e6},
            'carbon_fibre': {'rho': 1600, 'sigma': 2000e6},
        }
        mat = materials[material]
        self.mass = mass
        self.r_outer = r_outer
        self.r_inner = r_inner
        self.I = 0.5 * mass * (r_outer**2 + r_inner**2)

        # Speed limits
        self.omega_max = np.sqrt(mat['sigma'] / (mat['rho'] * r_outer**2)) * 0.7  # 70% safety
        self.omega_min = self.omega_max / 2  # 2:1 speed range

        # Current state
        self.omega = self.omega_min  # start at minimum

    def energy(self):
        return 0.5 * self.I * self.omega**2

    def usable_energy(self):
        return self.energy() - 0.5 * self.I * self.omega_min**2

    def max_usable(self):
        return 0.5 * self.I * (self.omega_max**2 - self.omega_min**2)

    def soc(self):  # state of charge (0-1)
        return self.usable_energy() / self.max_usable()

class MotorGenerator:
    def __init__(self, max_power=50000, efficiency=0.93):
        self.max_power = max_power  # Watts
        self.efficiency = efficiency

    def charge(self, rotor, power, dt):
        """Apply electrical power to spin up rotor."""
        power = min(power, self.max_power)
        mechanical_power = power * self.efficiency
        # P = tau * omega, so tau = P / omega
        if rotor.omega > 1:
            tau = mechanical_power / rotor.omega
            alpha = tau / rotor.I
            rotor.omega = min(rotor.omega + alpha * dt, rotor.omega_max)
        return power

    def discharge(self, rotor, power, dt):
        """Extract electrical power by slowing rotor."""
        power = min(power, self.max_power)
        mechanical_needed = power / self.efficiency
        if rotor.omega > rotor.omega_min + 1:
            tau = mechanical_needed / rotor.omega
            alpha = -tau / rotor.I
            rotor.omega = max(rotor.omega + alpha * dt, rotor.omega_min)
            return power
        return 0  # empty

# Create system
rotor = FlywheelRotor(mass=100, material='carbon_fibre')
motor = MotorGenerator(max_power=50000)

print("Flywheel Grid Storage: System Specs")
print("=" * 55)
print(f"Rotor: {rotor.mass} kg carbon fibre")
print(f"  I = {rotor.I:.2f} kg.m^2")
print(f"  Speed range: {rotor.omega_min*60/(2*np.pi):.0f} - {rotor.omega_max*60/(2*np.pi):.0f} RPM")
print(f"  Max usable energy: {rotor.max_usable()/3.6e6:.3f} kWh")
print(f"  Motor/gen: {motor.max_power/1000:.0f} kW, {motor.efficiency*100:.0f}% efficient")
print()

# Charge cycle
print("Charging at 50 kW:")
dt = 1.0
for t in range(0, 301, 30):
    motor.charge(rotor, 50000, dt)
    rpm = rotor.omega * 60 / (2 * np.pi)
    print(f"  t={t:>3}s: {rpm:>8.0f} RPM, SOC={rotor.soc()*100:>5.1f}%, E={rotor.energy()/3.6e6:.3f} kWh")
    for _ in range(29):
        motor.charge(rotor, 50000, dt)`,
      challenge: 'Add bearing friction (0.1% of KE per second) and windage losses. How do these affect the charge time and round-trip efficiency?',
      successHint: 'The rotor and motor/generator are the core of any flywheel system. Understanding their physics — KE = ½Iω², P = τω, and material stress limits — is the foundation for the complete grid storage simulator.',
    },
    {
      title: 'Grid demand response — matching supply to demand in real time',
      concept: `A power grid must balance supply and demand at every instant. If demand exceeds supply, frequency drops below 50 Hz (or 60 Hz in the US). If supply exceeds demand, frequency rises.

Flywheels are ideal for **frequency regulation** because they respond in milliseconds:
- Grid frequency drops → flywheel discharges, injecting power
- Grid frequency rises → flywheel charges, absorbing power

The control algorithm:
1. Measure grid frequency: f_grid
2. Calculate error: Δf = f_grid - f_target
3. Calculate power response: P = K_p × Δf (proportional control)
4. Command motor/generator: positive P = discharge, negative P = charge
5. Respect limits: SOC_min < SOC < SOC_max

Real grid frequency deviations are small (typically ±0.1 Hz), but they happen constantly. A flywheel’s instant response keeps the grid stable during the seconds before slower generators (gas turbines) can ramp up.`,
      analogy: 'Grid frequency regulation is like balancing on a tightrope. Every moment, the wind (demand changes) pushes you. Your balance pole (flywheel) shifts weight instantly to keep you centred. If you had to wait for a helper to bring you a new pole (gas turbine ramping up), you would fall long before it arrived.',
      storyConnection: 'The Middle Way in Buddhism teaches balance — neither excess nor deficiency. Grid frequency regulation is the engineering embodiment: the system must maintain perfect balance between generation and consumption, moment by moment. The flywheel is the physical manifestation of the Middle Way, absorbing excess and supplying deficiency.',
      checkQuestion: 'Grid frequency drops from 50.00 Hz to 49.95 Hz. If the flywheel’s proportional gain is K_p = 1 MW/Hz, how much power does it inject?',
      checkAnswer: 'P = K_p × Δf = 1,000,000 × (50.00 - 49.95) = 1,000,000 × 0.05 = 50,000 W = 50 kW. This happens within milliseconds of detecting the frequency drop. A gas turbine would take 30–60 seconds to deliver the same response. The flywheel bridges that gap.',
      codeIntro: 'Simulate 24 hours of grid demand with solar generation and flywheel stabilisation.',
      code: `import numpy as np

np.random.seed(42)

# Grid Demand Response Simulation
print("24-Hour Grid + Solar + Flywheel Simulation")
print("=" * 60)

# Time: 24 hours in 1-minute steps
hours = np.linspace(0, 24, 1440)

# Base demand (MW): peaks morning and evening
demand = 100 + 30 * np.sin(2 * np.pi * (hours - 6) / 24) + \\
         20 * np.sin(2 * np.pi * (hours - 18) / 12)
demand += np.random.normal(0, 3, len(hours))  # noise

# Solar generation (MW): peaks at noon
solar = np.maximum(0, 50 * np.sin(np.pi * (hours - 6) / 12))
solar *= (1 + np.random.normal(0, 0.1, len(hours)))  # cloud noise
solar = np.maximum(0, solar)

# Base generation (always on)
base_gen = 80  # MW

# Gap = demand - base - solar
gap = demand - base_gen - solar

# Flywheel system
fw_capacity_kWh = 500   # kWh
fw_max_power = 20000    # kW = 20 MW
fw_soc = 0.5            # start at 50%
fw_efficiency = 0.9

soc_log = []
fw_power_log = []

for i in range(len(hours)):
    gap_kw = gap[i] * 1000  # convert MW to kW

    # Proportional response
    fw_power = np.clip(gap_kw * 0.3, -fw_max_power, fw_max_power)

    # Update SOC
    dt_hours = 24 / 1440  # 1 minute in hours
    if fw_power > 0:  # discharging
        energy_out = fw_power * dt_hours / 1000  # kWh
        fw_soc -= energy_out / fw_capacity_kWh
    else:  # charging
        energy_in = abs(fw_power) * dt_hours * fw_efficiency / 1000
        fw_soc += energy_in / fw_capacity_kWh

    fw_soc = np.clip(fw_soc, 0.05, 0.95)
    soc_log.append(fw_soc)
    fw_power_log.append(fw_power / 1000)  # back to MW

# Summary
print(f"{'Hour':>5} | {'Demand':>8} | {'Solar':>7} | {'Gap':>7} | {'FW Power':>9} | {'SOC':>6}")
print("-" * 50)
for h in [0, 3, 6, 9, 12, 15, 18, 21]:
    i = h * 60
    print(f"{h:>4}:00 | {demand[i]:>7.1f} | {solar[i]:>6.1f} | {gap[i]:>6.1f} | {fw_power_log[i]:>8.2f} | {soc_log[i]*100:>5.1f}%")

print()
print(f"Flywheel stats:")
print(f"  Max discharge: {max(fw_power_log):.1f} MW")
print(f"  Max charge:    {min(fw_power_log):.1f} MW")
print(f"  SOC range:     {min(soc_log)*100:.0f}% - {max(soc_log)*100:.0f}%")
print(f"  Cycles:        ~{sum(1 for i in range(1,len(soc_log)) if (soc_log[i]-soc_log[i-1])*(soc_log[i-1]-soc_log[max(0,i-2)]) < 0) // 2}")`,
      challenge: 'Add a battery system (100 MWh, 10 MW max, 85% efficient but slower response: 30-second ramp time). How do the flywheel and battery complement each other?',
      successHint: 'Grid stabilisation is where flywheel physics meets energy policy. Every country transitioning to renewable energy needs storage solutions that can handle both the millisecond-to-second fluctuations (flywheels) and the hour-to-day imbalances (batteries).',
    },
    {
      title: 'Safety engineering — when flywheels fail',
      concept: `A flywheel spinning at 50,000 RPM stores enormous energy. If the rotor fails (crack, manufacturing defect, bearing seizure), that energy is released in milliseconds — an explosion.

**Failure modes**:
1. **Rim burst**: centripetal stress exceeds tensile strength. Fragments fly outward at rim speed (can exceed Mach 1)
2. **Bearing failure**: rotor contacts housing, decelerates violently. Energy converts to heat and deformation
3. **Shaft fracture**: rotor separates from motor. Uncontrolled spinning mass in a confined space

**Containment design**:
- Steel containment vessels thick enough to absorb fragment energy
- Vacuum chamber (eliminates air friction and prevents fire)
- Underground burial for large systems
- Fragment trajectory analysis (where do pieces go if containment fails?)

**Safety margin**: operate at 70% of theoretical burst speed

**Energy comparison**:
- 500 kWh flywheel at full speed: 1.8 GJ = energy of ~430 kg of TNT
- That is why flywheel facilities have exclusion zones and blast walls

**Monitoring**:
- Vibration sensors detect imbalance (precursor to failure)
- Temperature sensors detect bearing degradation
- Crack detection using acoustic emission sensors
- Automated shutdown if any parameter exceeds threshold`,
      analogy: 'A spinning flywheel is a loaded spring — energy is stored and can be released violently. A bullet stores about 1800 J. A 500 kWh flywheel stores 1.8 billion joules — a million bullets worth of energy in a single spinning disc. The containment vessel is the equivalent of the gun barrel: it must direct the energy safely if things go wrong.',
      storyConnection: 'The Dharma Wheel is depicted as indestructible, but engineering teaches humility: every real wheel has a failure mode. Understanding failure — predicting it, containing it, preventing it — is what separates a working flywheel from a bomb. The Buddhist teaching of impermanence applies even to the machines we build.',
      checkQuestion: 'A 50 kg carbon fibre rotor (radius 0.3 m) at 50,000 RPM bursts. What is the kinetic energy of the fragments? What thickness of steel containment vessel is needed?',
      checkAnswer: 'I = ½mr² = ½(50)(0.09) = 2.25 kg·m². ω = 50000 × 2π/60 = 5236 rad/s. KE = ½(2.25)(5236²) = 30.8 MJ = 7.4 kg TNT equivalent. For containment, empirical rules suggest ~2 cm of high-strength steel per 10 MJ for carbon fibre fragments (which are less penetrating than steel fragments). So ~6 cm minimum, plus safety factor = ~10 cm of steel. This adds significant mass and cost to the system.',
      codeIntro: 'Model flywheel failure and containment requirements.',
      code: `import numpy as np

# Flywheel Safety Analysis
print("FLYWHEEL FAILURE AND CONTAINMENT ANALYSIS")
print("=" * 60)

def failure_analysis(mass, radius, rpm, material='carbon_fibre'):
    """Analyse flywheel burst and containment needs."""
    I = 0.5 * mass * radius**2
    omega = rpm * 2 * np.pi / 60
    KE = 0.5 * I * omega**2

    # Fragment speed (rim speed)
    v_rim = omega * radius

    # TNT equivalent (4.184 MJ per kg TNT)
    tnt_equiv = KE / 4.184e6

    # Containment thickness (empirical: ~2cm steel per 10 MJ)
    steel_cm = 2 * KE / 10e6
    steel_cm_with_sf = steel_cm * 1.5  # 50% safety factor

    return {
        'KE_MJ': KE / 1e6,
        'v_rim': v_rim,
        'mach': v_rim / 343,
        'tnt_kg': tnt_equiv,
        'steel_cm': steel_cm_with_sf,
    }

# Analyse different systems
systems = [
    ("Toy gyroscope",     0.1,  0.03, 10000),
    ("F1 KERS",           5,    0.12, 40000),
    ("Grid flywheel",     100,  0.35, 30000),
    ("Industrial (large)", 500, 0.5,  16000),
    ("NASA G2",           100,  0.3,  60000),
]

print(f"{'System':>22} | {'KE (MJ)':>8} | {'Rim (m/s)':>10} | {'Mach':>5} | {'TNT (kg)':>9} | {'Steel (cm)':>10}")
print("-" * 75)

for name, m, r, rpm in systems:
    fa = failure_analysis(m, r, rpm)
    print(f"{name:>22} | {fa['KE_MJ']:>8.2f} | {fa['v_rim']:>10.0f} | {fa['mach']:>5.2f} | {fa['tnt_kg']:>9.2f} | {fa['steel_cm']:>10.1f}")

print()

# Vibration monitoring
print("Vibration Monitoring Simulation:")
print("-" * 50)
print("Healthy rotor vs developing crack:")
t = np.linspace(0, 1, 1000)
rpm = 30000
freq = rpm / 60  # Hz

healthy = 0.01 * np.sin(2 * np.pi * freq * t)  # tiny baseline
cracked = 0.01 * np.sin(2 * np.pi * freq * t) + \\
          0.005 * np.sin(2 * np.pi * 2 * freq * t) + \\
          0.1 * np.exp(t * 3 - 3)  # growing harmonic + exponential growth

vib_h = np.max(np.abs(healthy))
vib_c = np.max(np.abs(cracked))

print(f"  Healthy vibration amplitude: {vib_h:.4f} mm")
print(f"  Cracked vibration amplitude: {vib_c:.4f} mm")
print(f"  Alarm threshold: 0.05 mm")
print(f"  Shutdown threshold: 0.1 mm")
print(f"  Healthy: {'PASS' if vib_h < 0.05 else 'ALARM'}")
print(f"  Cracked: {'PASS' if vib_c < 0.05 else ('ALARM' if vib_c < 0.1 else 'SHUTDOWN')}")`,
      challenge: 'Model a cascading failure: bearing starts heating, friction increases exponentially, rotor vibration grows. At what point should the emergency brake engage to prevent burst? Plot the timeline from first warning to potential failure.',
      successHint: 'Safety engineering is not optional — it is the difference between a useful machine and a disaster. Every high-energy rotating system requires failure analysis, containment design, and real-time monitoring. Engineers who ignore failure modes endanger lives.',
    },
    {
      title: 'Renewable energy integration — solar + flywheel hybrid',
      concept: `Solar power is intermittent: it varies with clouds, time of day, and season. Flywheels smooth this intermittency:

**Short-term smoothing** (seconds to minutes):
- Cloud passes over solar farm → output drops 50% in 10 seconds
- Flywheel delivers stored energy during the dip
- Cloud passes → solar output recovers → flywheel recharges
- Grid sees smooth, steady power

**Ramp rate control**:
- Utility rules often limit how fast power can change (e.g., 10 MW/min max)
- Solar can change at 100 MW/min during cloud events
- Flywheel absorbs the difference, limiting ramp rate to acceptable levels

**Peak shifting** (minutes to hours):
- Store excess solar at noon
- Release during evening demand peak (4–8 PM)
- Reduces need for gas "peaker" plants

**System sizing**:
- For cloud smoothing: 5–10 minutes of storage at rated power
- For peak shifting: 2–4 hours (better suited to batteries)
- Hybrid: flywheel for fast response + battery for long duration`,
      analogy: 'A flywheel paired with solar panels is like a shock absorber on a car. The road (solar output) is bumpy (clouds). Without the shock absorber, every bump jolts the passengers (grid). With it, the ride is smooth. The shock absorber doesn’t change the road — it just filters out the bumps.',
      storyConnection: 'The Dharma Wheel’s eightfold path is a system — no single spoke works alone. Similarly, a renewable energy system needs generation (solar), storage (flywheel), distribution (grid), and control (power electronics) working together. The capstone integrates all four.',
      checkQuestion: 'A 100 MW solar farm experiences a 30-second cloud event where output drops to 40 MW. If the flywheel has 50 MWh capacity and 20 MW maximum power, can it fully compensate?',
      checkAnswer: 'The deficit is 100 - 40 = 60 MW for 30 seconds. Energy needed: 60 MW × 30s = 1800 MJ = 0.5 MWh. The flywheel has 50 MWh capacity (plenty). But the max power is 20 MW, not 60 MW. So the flywheel can only compensate 20/60 = 33% of the deficit. The grid would still see a 40 MW dip. Solution: size the flywheel for 60 MW peak power, even though the energy requirement is small.',
      codeIntro: 'Simulate a solar farm + flywheel system handling real cloud events.',
      code: `import numpy as np

np.random.seed(42)

# Solar + Flywheel Integration Simulator
print("SOLAR FARM + FLYWHEEL INTEGRATION")
print("=" * 60)

# 1 hour simulation at 1-second resolution
t = np.arange(0, 3600, 1)  # seconds
hours = t / 3600

# Solar output (100 MW base, with cloud events)
solar_base = 100  # MW
solar = np.ones(len(t)) * solar_base

# Add cloud events
clouds = [(300, 60, 0.4), (900, 120, 0.5), (1500, 30, 0.3),
          (2100, 90, 0.6), (2700, 45, 0.35)]
for start, duration, depth in clouds:
    cloud_shape = 1 - (1 - depth) * np.exp(-((t - start - duration/2)**2) / (duration/3)**2)
    solar *= np.where((t >= start) & (t <= start + duration), depth + (1-depth)*0.5, 1.0)

# Add noise
solar += np.random.normal(0, 1, len(t))
solar = np.clip(solar, 0, 120)

# Grid demand (constant for simplicity)
demand = 95  # MW

# Flywheel system
fw_capacity = 5 * 3.6e3  # 5 kWh in kJ (small, for smoothing only)
fw_max_power = 30  # MW
fw_energy = fw_capacity * 0.5  # start at 50%
fw_eff = 0.92

grid_power = []
fw_power_log = []
soc_log = []

for i in range(len(t)):
    gap = demand - solar[i]  # MW (positive = need more)

    # Flywheel responds to gap
    fw_cmd = np.clip(gap, -fw_max_power, fw_max_power)

    # Check SOC limits
    soc = fw_energy / fw_capacity
    if fw_cmd > 0 and soc < 0.05:
        fw_cmd = 0  # empty
    if fw_cmd < 0 and soc > 0.95:
        fw_cmd = 0  # full

    # Update flywheel energy
    if fw_cmd > 0:  # discharging
        fw_energy -= fw_cmd * 1 / 1000  # MW * 1s -> kJ
    else:  # charging
        fw_energy -= fw_cmd * fw_eff * 1 / 1000

    fw_energy = np.clip(fw_energy, 0, fw_capacity)

    # Grid sees: solar + flywheel
    grid_out = solar[i] + fw_cmd
    grid_power.append(grid_out)
    fw_power_log.append(fw_cmd)
    soc_log.append(fw_energy / fw_capacity)

grid_power = np.array(grid_power)

# Performance metrics
solar_var = np.std(solar)
grid_var = np.std(grid_power)
smoothing = (1 - grid_var / solar_var) * 100

print(f"Solar variability (std): {solar_var:.2f} MW")
print(f"Grid variability (std):  {grid_var:.2f} MW")
print(f"Smoothing effectiveness: {smoothing:.1f}%")
print()

# Show key moments
print(f"{'Time':>6} | {'Solar':>7} | {'FW':>7} | {'Grid':>7} | {'SOC':>6}")
print("-" * 42)
for sec in [0, 300, 330, 360, 900, 960, 1020, 1500, 1530, 2700, 3599]:
    i = min(sec, len(t)-1)
    print(f"{sec//60:>3}:{sec%60:02d} | {solar[i]:>6.1f} | {fw_power_log[i]:>+6.1f} | {grid_power[i]:>6.1f} | {soc_log[i]*100:>5.1f}%")

print()
print(f"Without flywheel: grid sees {solar_var:.1f} MW swings")
print(f"With flywheel: grid sees {grid_var:.1f} MW swings")
print(f"The flywheel smooths {smoothing:.0f}% of solar variability.")`,
      challenge: 'Add ramp rate limiting: the grid output cannot change by more than 10 MW per minute. How does the flywheel help enforce this? What happens during a sudden 60% solar drop?',
      successHint: 'Solar + flywheel integration is one of the most active areas of energy engineering. Every large solar farm needs some form of fast energy storage to smooth output. Flywheels are increasingly being deployed for this role.',
    },
    {
      title: 'Control systems — PID controller for flywheel speed',
      concept: `Maintaining precise flywheel speed requires a **PID controller** — the most widely used control algorithm in engineering.

**P** (Proportional): response proportional to error
- correction = K_p × error
- Big error → big correction. But P alone overshoots.

**I** (Integral): response proportional to accumulated error
- correction = K_i × ∫(error) dt
- Eliminates steady-state error. But I alone is slow and oscillatory.

**D** (Derivative): response proportional to rate of change of error
- correction = K_d × d(error)/dt
- Damps oscillations. Anticipates where the error is going.

Combined: **u(t) = K_p × e(t) + K_i × ∫e dt + K_d × de/dt**

Tuning K_p, K_i, K_d is both art and science:
- Start with P only, increase until oscillation begins
- Add D to damp oscillation
- Add I to eliminate steady-state offset
- Or use Ziegler-Nichols method for systematic tuning

PID controllers run in everything: thermostats, cruise control, quadcopters, satellite pointing, industrial processes.`,
      analogy: 'Driving a car is PID control. **P**: you are drifting right, so you steer left (proportional to how far off you are). **D**: you are drifting right AND the drift is getting worse, so you steer left harder (proportional to the rate of drift). **I**: you have been slightly right of centre for the last minute, so you add a small constant left correction (proportional to the accumulated error). Good drivers use all three intuitively.',
      storyConnection: 'The Middle Way is a control system: the Buddha taught neither extreme asceticism (undershoot) nor extreme indulgence (overshoot), but a balanced path that self-corrects. The PID controller formalises this: P responds to the current deviation, I corrects for past drift, D anticipates future change. Balance through feedback.',
      checkQuestion: 'A flywheel PID controller has K_p = 100, K_i = 10, K_d = 50. The target speed is 5000 RPM. Current speed is 4900 RPM. The speed was 4850 RPM one second ago. Accumulated error over the last 10 seconds = 500 RPM·s. What torque does the controller command?',
      checkAnswer: 'Error = 5000 - 4900 = 100 RPM. Rate of change = (4900 - 4850)/1 = 50 RPM/s (improving). ∫e = 500 RPM·s. u = K_p(100) + K_i(500) + K_d(50) = 10000 + 5000 + 2500 = 17,500 (arbitrary torque units). The P term dominates (large error), I corrects for sustained offset, and D adds extra push because the error is still decreasing (positive rate = good, adds to correction).',
      codeIntro: 'Implement a PID controller for flywheel speed regulation and tune the gains.',
      code: `import numpy as np

# PID Controller for Flywheel Speed Regulation
print("PID Speed Controller: Flywheel Regulation")
print("=" * 55)

class PIDController:
    def __init__(self, Kp, Ki, Kd, setpoint, output_limits=(-100, 100)):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.setpoint = setpoint
        self.integral = 0
        self.prev_error = 0
        self.limits = output_limits

    def update(self, measurement, dt):
        error = self.setpoint - measurement
        self.integral += error * dt
        # Anti-windup: clamp integral
        self.integral = np.clip(self.integral, -1000, 1000)
        derivative = (error - self.prev_error) / dt if dt > 0 else 0
        self.prev_error = error
        output = self.Kp * error + self.Ki * self.integral + self.Kd * derivative
        return np.clip(output, *self.limits)

# Flywheel model
I = 2.0  # kg.m^2
omega = 0  # start from rest
target_rpm = 3000
target_omega = target_rpm * 2 * np.pi / 60
friction = 0.05

# Create PID controller
pid = PIDController(Kp=5.0, Ki=0.5, Kd=1.0, setpoint=target_omega,
                    output_limits=(-50, 50))

dt = 0.1
time = 0
log = []

# Simulation: spin up, then apply disturbance
for step in range(500):
    # Disturbance at t=25s (sudden load)
    disturbance = -20 if 25 <= time < 28 else 0

    # PID output (torque command)
    tau_cmd = pid.update(omega, dt)

    # Physics
    tau_net = tau_cmd + disturbance - friction * omega
    alpha = tau_net / I
    omega += alpha * dt
    omega = max(0, omega)
    time += dt

    rpm = omega * 60 / (2 * np.pi)
    if step % 10 == 0:
        log.append((time, rpm, tau_cmd, disturbance))

# Print results
print(f"Target: {target_rpm} RPM")
print(f"PID gains: Kp={pid.Kp}, Ki={pid.Ki}, Kd={pid.Kd}")
print()
print(f"{'Time':>6} | {'RPM':>8} | {'Torque cmd':>11} | {'Disturb':>8}")
print("-" * 40)
for t, rpm, tau, dist in log:
    marker = " <-- LOAD" if dist != 0 else ""
    print(f"{t:>5.1f}s | {rpm:>8.1f} | {tau:>11.2f} | {dist:>8.1f}{marker}")

# Performance metrics
rpms = [r for _, r, _, _ in log]
print(f"\\nRise time (to 90%): ~{next((t for t, r, _, _ in log if r > 0.9*target_rpm), 'N/A')}s")
print(f"Overshoot: {(max(rpms) - target_rpm)/target_rpm*100:.1f}%")
print(f"Steady-state error: {abs(rpms[-1] - target_rpm):.1f} RPM")`,
      challenge: 'Try three PID tunings: aggressive (Kp=20, Ki=2, Kd=5), moderate (Kp=5, Ki=0.5, Kd=1), conservative (Kp=1, Ki=0.1, Kd=0.5). Compare rise time, overshoot, and disturbance rejection. Which is best for a flywheel?',
      successHint: 'PID control is the workhorse of engineering. Once you understand it, you can regulate temperature, speed, position, pressure, flow, pH, or any other measurable quantity. This one algorithm runs in billions of devices worldwide.',
    },
    {
      title: 'Complete integration — the Wheel of Dharma as engineering system',
      concept: `You have now built every component of a flywheel energy storage system:

1. **Rotor physics** (Level 1): KE = ½Iω², angular momentum, gyroscopic stability
2. **Rotational dynamics** (Level 2): τ = Iα, gear trains, rolling physics, engine power
3. **System design** (Level 3): navigation gyroscopes, reaction wheels, Earth’s precession, numerical simulation, flywheel battery design
4. **Control and integration** (Level 4): grid demand response, safety engineering, solar integration, PID control

The complete system:
- Solar panels generate DC power
- Inverter converts to AC at grid frequency
- Flywheel absorbs excess, releases during shortfall
- PID controller maintains target speed / state of charge
- Safety system monitors vibration, temperature, and SOC
- Grid interface ensures smooth, ramp-rate-limited power output

This is not a toy model — it is the architecture of real commercial flywheel installations (Beacon Power, Amber Kinetics, OXTO Energy).

The Dharma Wheel’s eight spokes map to eight engineering disciplines that make this work: mechanics, materials science, electrical engineering, control theory, power electronics, safety engineering, systems integration, and software.`,
      analogy: 'Building the complete flywheel system is like building a clock. Each gear (concept) must mesh perfectly with the next. The escapement (PID controller) regulates the speed. The mainspring (motor) provides energy. The display (grid interface) shows the output. No single part works alone — the system is the product.',
      storyConnection: 'The Wheel of Dharma turns because all eight spokes work together. Remove one spoke and the wheel collapses. The flywheel grid system is the same: remove the controller and it oscillates wildly. Remove the safety system and it risks explosion. Remove the power electronics and it cannot connect to the grid. The lesson of the Dharma Wheel is the lesson of systems engineering: every part matters.',
      checkQuestion: 'You are designing a flywheel system for a remote village with a 50 kW solar array. What capacity, power rating, and control strategy would you choose?',
      checkAnswer: 'For a 50 kW solar array serving a village: Capacity ≈ 25 kWh (30 min of peak solar, covers typical cloud events). Power rating ≈ 50 kW (match solar peak to handle full dropout). Control: PID on bus voltage (maintain 48V DC bus) with SOC management (keep between 20-80% for longevity). Safety: underground installation, vibration monitoring, remote shutdown. Cost: ~$50-100k for the flywheel, competitive with lithium batteries at this cycling rate.',
      codeIntro: 'Assemble the complete flywheel grid system with all subsystems working together.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# CAPSTONE: Complete Flywheel Grid Storage System
# All subsystems integrated
# ============================================================

print("COMPLETE FLYWHEEL GRID STORAGE SYSTEM")
print("=" * 60)

class CompleteFlywheel:
    def __init__(self):
        # Rotor
        self.I = 5.0              # kg.m^2
        self.omega = 2000 * 2 * np.pi / 60  # start at 2000 RPM
        self.omega_max = 5000 * 2 * np.pi / 60
        self.omega_min = 1500 * 2 * np.pi / 60
        self.friction = 0.02       # N.m per rad/s

        # Motor/generator
        self.motor_eff = 0.93
        self.max_power = 50000     # 50 kW

        # PID controller
        self.Kp = 3.0
        self.Ki = 0.3
        self.Kd = 0.8
        self.integral = 0
        self.prev_error = 0
        self.target_soc = 0.5

        # Safety
        self.vib_threshold = 0.05
        self.temp_limit = 80       # degrees C
        self.temp = 25             # current temp
        self.shutdown = False

    def soc(self):
        ke = 0.5 * self.I * self.omega**2
        ke_min = 0.5 * self.I * self.omega_min**2
        ke_max = 0.5 * self.I * self.omega_max**2
        return (ke - ke_min) / (ke_max - ke_min)

    def energy_kwh(self):
        return 0.5 * self.I * self.omega**2 / 3.6e6

    def step(self, power_demand, dt=1.0):
        """One timestep. power_demand > 0 means grid needs power."""
        if self.shutdown:
            return 0

        # PID on SOC (maintain target)
        soc_error = self.target_soc - self.soc()

        # But grid demand overrides
        if abs(power_demand) > 100:  # significant demand
            # Direct response to grid
            fw_power = np.clip(power_demand, -self.max_power, self.max_power)
        else:
            # Idle: PID maintains SOC
            self.integral += soc_error * dt
            self.integral = np.clip(self.integral, -100, 100)
            derivative = (soc_error - self.prev_error) / dt
            self.prev_error = soc_error
            fw_power = self.Kp * soc_error * 10000 + self.Ki * self.integral * 1000

        # Apply to rotor
        if fw_power > 0:  # discharge
            tau = min(fw_power, self.max_power) / max(self.omega, 1) / self.motor_eff
        else:  # charge
            tau = fw_power * self.motor_eff / max(self.omega, 1)

        # Physics
        tau_friction = -self.friction * self.omega
        alpha = (tau + tau_friction) / self.I
        self.omega += alpha * dt
        self.omega = np.clip(self.omega, self.omega_min * 0.9, self.omega_max * 1.05)

        # Safety check
        self.temp += 0.001 * abs(fw_power) / 1000 * dt  # heating
        self.temp -= 0.01 * (self.temp - 25) * dt         # cooling
        vibration = 0.001 + 0.01 * np.random.random()
        if self.omega > self.omega_max:
            self.shutdown = True
            return 0

        actual_power = fw_power if self.omega > self.omega_min else 0
        return actual_power

# Create system
fw = CompleteFlywheel()

# Simulate 1 hour with realistic demand
t = np.arange(0, 3600, 1)
solar = 40000 * np.maximum(0, np.sin(np.pi * t / 3600))  # 40 kW peak
demand = 20000 + 5000 * np.sin(2 * np.pi * t / 1800)     # 20 kW avg
demand += np.random.normal(0, 2000, len(t))

grid_gap = demand - solar
log = []

for i in range(len(t)):
    actual = fw.step(grid_gap[i], dt=1.0)
    if i % 60 == 0:
        rpm = fw.omega * 60 / (2 * np.pi)
        log.append((t[i]/60, solar[i]/1000, demand[i]/1000,
                    grid_gap[i]/1000, actual/1000, fw.soc()*100, fw.temp))

print(f"{'Min':>4} | {'Solar kW':>9} | {'Demand kW':>10} | {'Gap kW':>7} | {'FW kW':>6} | {'SOC%':>5} | {'Temp':>5}")
print("-" * 60)
for m, s, d, g, f, soc, temp in log:
    print(f"{m:>4.0f} | {s:>9.1f} | {d:>10.1f} | {g:>7.1f} | {f:>+5.1f} | {soc:>5.1f} | {temp:>4.1f}°")

print()
print(f"System status: {'SHUTDOWN' if fw.shutdown else 'RUNNING'}")
print(f"Final SOC: {fw.soc()*100:.1f}%")
print(f"Temperature: {fw.temp:.1f}°C")
print()
print("The Wheel of Dharma turns: energy stored, energy released,")
print("balance maintained. Physics and philosophy, unified.")`,
      challenge: 'Add a 24-hour simulation with realistic solar + demand patterns, weather events (clouds), and equipment degradation (bearing friction increases 0.1% per day). How long before the system needs maintenance?',
      successHint: 'You have built a complete flywheel energy storage system from first principles. Every equation, every concept, every simulation traces back to the physics of the wheel — friction, torque, angular momentum, and energy. The Dharma Wheel turns, and the physics endures.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Grid storage, safety engineering, solar integration, and PID control</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises build a complete flywheel grid storage system. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
