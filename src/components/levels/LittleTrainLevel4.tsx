import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LittleTrainLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Capstone: Complete mountain railway simulator',
      concept: `This capstone integrates everything from Levels 1\u20133: friction and adhesion, grade/curve resistance, thermodynamics, braking, and scheduling into a single simulation of a mountain railway journey.

You will model the **Darjeeling Himalayan Railway** from New Jalpaiguri (100 m) to Darjeeling (2,076 m), simulating the train\u2019s speed, fuel consumption, brake temperature, and schedule adherence at every point along the 88 km route.`,
      analogy: 'Building a complete railway simulator is like building a flight simulator \u2014 every physical system must work together: engine, brakes, track, weather, schedule.',
      storyConnection: 'This is Bogi\u2019s full journey, modelled in code. Every hill, every curve, every tunnel, every switchback from the story becomes a data point in your simulation.',
      checkQuestion: 'Why is a full-route simulator harder than modelling individual physics problems?',
      checkAnswer: 'Because systems interact: braking heats the brakes (reducing their effectiveness), climbing consumes fuel (reducing weight, which changes adhesion), and speed on one section affects arrival time at the next (changing scheduling constraints). The challenge is capturing all these interactions simultaneously.',
      codeIntro: 'Build a route simulator that tracks speed, fuel, and brake temperature over the full journey.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Darjeeling Himalayan Railway route data
stations = ['NJP', 'Sukna', 'Rangtong', 'Tindharia', 'Kurseong', 'Tung', 'Sonada', 'Ghum', 'Darjeeling']
dist_km = np.array([0, 11, 18, 25, 32, 38, 44, 51, 55])
elev_m = np.array([100, 250, 530, 860, 1483, 1700, 1950, 2258, 2076])

# Train parameters
mass = 40000       # kg
g = 9.81
mu_roll = 0.002
engine_power_kw = 150  # kW
mu_adhesion = 0.28
driver_weight = 20000  # kg on driving wheels
max_te = mu_adhesion * driver_weight * g  # N
coal_energy_mj_per_kg = 29
boiler_efficiency = 0.08
brake_mass = 400       # kg brake material
brake_cp = 500         # J/(kg\u00B7K)
ambient_temp = 15      # \u00B0C
brake_cooling_rate = 0.005  # per second

# Simulate at 100m resolution
dx = 100  # metres
total_dist = dist_km[-1] * 1000  # metres
x_points = np.arange(0, total_dist, dx)
n = len(x_points)

# Interpolate elevation
elev_interp = np.interp(x_points / 1000, dist_km, elev_m)
gradient_pct = np.diff(elev_interp) / dx * 100
gradient_pct = np.append(gradient_pct, gradient_pct[-1])

# Simulation arrays
speed = np.zeros(n)      # m/s
fuel_used = np.zeros(n)  # kg cumulative
brake_temp = np.full(n, ambient_temp)  # \u00B0C
time_elapsed = np.zeros(n)  # seconds

speed[0] = 0
target_speed = 5.0  # m/s (~18 km/h) target cruising speed

for i in range(1, n):
    v = speed[i-1]
    grad = gradient_pct[i]

    # Forces
    f_grade = mass * g * grad / 100        # N (positive = uphill)
    f_roll = mu_roll * mass * g             # N
    f_drag = 0.5 * 1.2 * 3.0 * v**2        # N (simplified aero)
    f_resist = f_grade + f_roll + f_drag    # total resistance

    # Engine strategy: power if below target, coast if above
    if v < target_speed and f_resist > 0:
        # Apply power
        if v > 0.5:
            f_engine = min(engine_power_kw * 1000 / v, max_te)
        else:
            f_engine = max_te * 0.5
        f_brake = 0
    elif v > target_speed * 1.3:
        # Brake
        f_engine = 0
        f_brake = min((v - target_speed) * mass / 10, max_te)
    else:
        # Coast
        f_engine = 0
        f_brake = 0

    # Net force and acceleration
    f_net = f_engine - f_resist - f_brake
    accel = f_net / mass
    dt = dx / max(v, 0.5)  # time for this segment

    # Update state
    speed[i] = max(0.5, v + accel * dt)
    time_elapsed[i] = time_elapsed[i-1] + dt

    # Fuel consumption (only when engine is producing power)
    if f_engine > 0:
        power_used_mj = f_engine * dx / 1e6
        coal_kg = power_used_mj / (coal_energy_mj_per_kg * boiler_efficiency)
        fuel_used[i] = fuel_used[i-1] + coal_kg
    else:
        fuel_used[i] = fuel_used[i-1]

    # Brake temperature
    if f_brake > 0:
        heat_added = f_brake * dx / (brake_mass * brake_cp)
        brake_temp[i] = brake_temp[i-1] + heat_added
    else:
        brake_temp[i] = brake_temp[i-1]
    # Cooling
    brake_temp[i] -= brake_cooling_rate * (brake_temp[i] - ambient_temp) * dt

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Darjeeling Himalayan Railway: Full Journey Simulation', color='white', fontsize=14, fontweight='bold')

# Elevation + speed
ax = axes[0, 0]; ax.set_facecolor('#111827')
ax.plot(x_points/1000, elev_interp, color='#22c55e', linewidth=2, label='Elevation')
ax.fill_between(x_points/1000, elev_interp, alpha=0.1, color='#22c55e')
ax2 = ax.twinx()
ax2.plot(x_points/1000, speed * 3.6, color='#3b82f6', linewidth=1.5, alpha=0.7, label='Speed')
ax.set_xlabel('Distance (km)', color='white'); ax.set_ylabel('Elevation (m)', color='#22c55e')
ax2.set_ylabel('Speed (km/h)', color='#3b82f6')
ax.tick_params(colors='gray'); ax2.tick_params(colors='gray')
ax.set_title('Elevation Profile & Speed', color='white')

# Gradient
ax = axes[0, 1]; ax.set_facecolor('#111827')
colors_bar = ['#22c55e' if g >= 0 else '#ef4444' for g in gradient_pct]
ax.fill_between(x_points/1000, gradient_pct, color='#3b82f6', alpha=0.3)
ax.plot(x_points/1000, gradient_pct, color='#3b82f6', linewidth=1)
ax.axhline(0, color='gray', linewidth=0.5)
ax.set_xlabel('Distance (km)', color='white'); ax.set_ylabel('Gradient (%)', color='white')
ax.set_title('Track Gradient', color='white')
ax.tick_params(colors='gray')

# Fuel consumption
ax = axes[1, 0]; ax.set_facecolor('#111827')
ax.plot(x_points/1000, fuel_used, color='#f59e0b', linewidth=2)
ax.fill_between(x_points/1000, fuel_used, alpha=0.15, color='#f59e0b')
for d, name in zip(dist_km, stations):
    if name in ['NJP', 'Kurseong', 'Ghum', 'Darjeeling']:
        ax.axvline(d, color='gray', linewidth=0.5, linestyle='--')
        ax.text(d, fuel_used.max() * 0.95, name, color='gray', fontsize=7, rotation=90, va='top')
ax.set_xlabel('Distance (km)', color='white'); ax.set_ylabel('Coal consumed (kg)', color='white')
ax.set_title('Cumulative Fuel Consumption', color='white')
ax.tick_params(colors='gray')

# Brake temperature
ax = axes[1, 1]; ax.set_facecolor('#111827')
ax.plot(x_points/1000, brake_temp, color='#ef4444', linewidth=2)
ax.axhline(400, color='#f59e0b', linestyle='--', linewidth=1, label='Fade threshold')
ax.fill_between(x_points/1000, brake_temp, ambient_temp, alpha=0.15, color='#ef4444')
ax.set_xlabel('Distance (km)', color='white'); ax.set_ylabel('Brake temperature (\u00B0C)', color='white')
ax.set_title('Brake Temperature', color='white')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

hours = time_elapsed[-1] / 3600
print(f"\\nJourney Summary: New Jalpaiguri to Darjeeling")
print(f"  Distance: {total_dist/1000:.0f} km")
print(f"  Elevation gain: {max(elev_interp) - elev_interp[0]:.0f} m")
print(f"  Journey time: {hours:.1f} hours ({time_elapsed[-1]/60:.0f} minutes)")
print(f"  Average speed: {total_dist/1000/hours:.1f} km/h")
print(f"  Coal consumed: {fuel_used[-1]:.0f} kg")
print(f"  Peak brake temp: {max(brake_temp):.0f}\u00B0C")
print(f"  Brake fade: {'YES' if max(brake_temp) > 400 else 'No'}")`,
      challenge: 'Add weather effects: rain reduces \u03BC from 0.28 to 0.15 (affecting both adhesion and braking), and fog reduces the safe target speed to 10 km/h. Simulate a monsoon journey and compare fuel consumption, journey time, and brake temperatures to dry conditions.',
      successHint: 'You have just built a simplified version of the simulation tools that real railway engineers use to design mountain railways and train their drivers.',
    },
    {
      title: 'Rack-and-pinion section modelling',
      concept: `The Nilgiri Mountain Railway uses rack-and-pinion on its steepest section (8.33% gradient). In this section, a toothed pinion gear on the locomotive meshes with a toothed rack rail.

The rack eliminates the adhesion constraint entirely \u2014 the maximum force is now limited only by the gear and engine strength. But rack sections are slow (typically 8\u201312 km/h) because the gear teeth must mesh precisely.`,
      analogy: 'A rack railway is like climbing a ladder bolted to the cliff face instead of trying to walk up a smooth slope. You trade speed for absolute certainty of grip.',
      storyConnection: 'Bogi runs on adhesion only, but the Nilgiri railway that serves the same mountain tourism market chose rack-and-pinion for its steeper route. Two different engineering solutions to the same fundamental problem.',
      checkQuestion: 'Why not use rack-and-pinion everywhere on a mountain railway?',
      checkAnswer: 'Rack sections are expensive (the toothed rail costs 3\u20135\u00D7 more per km than plain rail), slow (8\u201312 km/h maximum), noisy, and require specialised locomotives. Use rack only where adhesion genuinely fails \u2014 above about 8% gradient.',
      codeIntro: 'Compare adhesion and rack-and-pinion performance on steep gradients.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Compare adhesion vs rack-and-pinion performance
gradients = np.linspace(0, 20, 200)  # percent
mass = 50000  # kg
g = 9.81

# Adhesion railway
mu_dry = 0.30
driver_frac = 0.5
adhesion_te = mu_dry * driver_frac * mass * g  # N (constant)
grade_force = mass * g * gradients / 100  # N
adhesion_margin = adhesion_te - grade_force  # surplus TE

# Rack railway
rack_te = mass * g * 0.25  # pinion gear can deliver ~25% of total weight as force
rack_margin = rack_te - grade_force

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Left: force comparison
ax1.set_facecolor('#111827')
ax1.plot(gradients, grade_force/1000, color='#ef4444', linewidth=2, label='Grade resistance')
ax1.axhline(adhesion_te/1000, color='#22c55e', linewidth=2, linestyle='--', label=f'Adhesion TE ({adhesion_te/1000:.0f} kN)')
ax1.axhline(rack_te/1000, color='#3b82f6', linewidth=2, linestyle='--', label=f'Rack TE ({rack_te/1000:.0f} kN)')

# Fill regions
ax1.fill_between(gradients, grade_force/1000, adhesion_te/1000,
                  where=grade_force < adhesion_te, alpha=0.15, color='#22c55e')
ax1.fill_between(gradients, adhesion_te/1000, rack_te/1000,
                  where=(grade_force > adhesion_te) & (grade_force < rack_te),
                  alpha=0.15, color='#3b82f6')

# Mark transitions
adh_max = mu_dry * driver_frac * 100  # max gradient percent
ax1.axvline(adh_max, color='#f59e0b', linewidth=1.5, linestyle=':')
ax1.text(adh_max + 0.3, 10, f'Adhesion limit\\n{adh_max:.0f}%', color='#f59e0b', fontsize=9)

ax1.set_xlabel('Gradient (%)', color='white')
ax1.set_ylabel('Force (kN)', color='white')
ax1.set_title('Adhesion vs Rack: Force Limits', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Right: maximum speed on gradient
ax2.set_facecolor('#111827')
engine_power = 150  # kW

for system, te_func, color, label in [
    ('adhesion', lambda g: min(adhesion_te, adhesion_te), '#22c55e', 'Adhesion railway'),
    ('rack', lambda g: rack_te, '#3b82f6', 'Rack railway'),
]:
    max_speeds = []
    for grad in gradients:
        f_resist = mass * g * grad / 100 + mu_dry * mass * g * 0.01  # grade + rolling
        te_avail = adhesion_te if system == 'adhesion' else rack_te
        surplus = te_avail - f_resist
        if surplus > 0:
            # Speed limited by power: P = F * v -> v = P / F_total
            v = engine_power * 1000 / f_resist if f_resist > 0 else 30
            v = min(v, 30 if system == 'adhesion' else 12)  # speed limits
            max_speeds.append(v * 3.6)
        else:
            max_speeds.append(0)
    ax2.plot(gradients, max_speeds, color=color, linewidth=2, label=label)

ax2.axhline(0, color='gray', linewidth=0.5)
ax2.set_xlabel('Gradient (%)', color='white')
ax2.set_ylabel('Maximum speed (km/h)', color='white')
ax2.set_title('Speed vs Gradient by System', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Adhesion vs Rack comparison:")
print(f"  Adhesion max gradient: {adh_max:.0f}%")
print(f"  Rack max gradient: {rack_te / (mass * g) * 100:.0f}%")
print(f"  Adhesion TE: {adhesion_te/1000:.0f} kN")
print(f"  Rack TE: {rack_te/1000:.0f} kN")
print(f"  Rack cost per km: 3-5x adhesion rail")
print(f"  Rack speed limit: 8-12 km/h (gear meshing constraint)")`,
      challenge: 'Model a hybrid railway: adhesion on sections below 6% and rack above 6%. Calculate the total journey time for a 20 km route with a profile that includes both gentle and steep sections. Compare to a pure adhesion railway (with switchbacks to reduce gradient) and a pure rack railway.',
      successHint: 'The choice between adhesion and rack is always an economic trade-off: rack is more capable but slower and more expensive per kilometre.',
    },
    {
      title: 'Reliability and failure analysis',
      concept: `Mountain railways operate in harsh conditions: monsoon rain, landslides, extreme temperature swings, and old infrastructure. **Reliability engineering** quantifies how often systems fail and how quickly they recover.

Key metrics: **MTBF** (Mean Time Between Failures) and **MTTR** (Mean Time To Repair). System availability = MTBF / (MTBF + MTTR).

Safety-critical systems (brakes, couplings) need redundancy. If one brake system has a failure probability of 1/1000 per journey, two independent systems give 1/1,000,000.`,
      analogy: 'Reliability analysis is a medical check-up for machines \u2014 you measure vital signs (wear, temperature, vibration), predict when things might fail, and fix them before they do.',
      storyConnection: 'Bogi\u2019s boiler was patched fourteen times. Each patch is a repair after a near-failure. A reliability engineer would ask: what is the MTBF for Bogi\u2019s boiler, and should we replace it entirely rather than patch it again?',
      checkQuestion: 'Main brake MTBF = 1,000 hours, backup brake MTBF = 500 hours. What is the probability both fail simultaneously?',
      checkAnswer: 'P(both fail in 1 hour) = (1/1000) \u00D7 (1/500) = 1/500,000. At 2,000 operating hours/year: P(both fail at least once) \u2248 2000/500,000 = 0.4% annual risk. Still needs a third mechanical backup for safety-critical operations.',
      codeIntro: 'Model system reliability and the benefit of redundancy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Reliability analysis for mountain railway braking system
operating_hours = np.linspace(0, 5000, 500)

# Component MTBFs (hours)
components = {
    'Primary brake': 2000,
    'Backup brake': 1500,
    'Handbrake': 5000,
    'Rail brake': 3000,
}

# Reliability function: R(t) = exp(-t/MTBF)
fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

# Individual component reliability
ax = axes[0, 0]; ax.set_facecolor('#111827')
colors_comp = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for (name, mtbf), color in zip(components.items(), colors_comp):
    R = np.exp(-operating_hours / mtbf)
    ax.plot(operating_hours, R * 100, color=color, linewidth=2, label=f'{name} (MTBF={mtbf}h)')

ax.set_xlabel('Operating hours', color='white')
ax.set_ylabel('Reliability (%)', color='white')
ax.set_title('Individual Component Reliability', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# System reliability with redundancy
ax = axes[0, 1]; ax.set_facecolor('#111827')
R_primary = np.exp(-operating_hours / 2000)
R_backup = np.exp(-operating_hours / 1500)
R_hand = np.exp(-operating_hours / 5000)

# Series (all must work): R_series = product of R_i
R_series = R_primary  # single brake system

# Parallel (at least one must work): R_parallel = 1 - product of (1-R_i)
R_dual = 1 - (1 - R_primary) * (1 - R_backup)
R_triple = 1 - (1 - R_primary) * (1 - R_backup) * (1 - R_hand)

ax.plot(operating_hours, R_series * 100, color='#ef4444', linewidth=2, label='Single brake')
ax.plot(operating_hours, R_dual * 100, color='#f59e0b', linewidth=2, label='Dual redundancy')
ax.plot(operating_hours, R_triple * 100, color='#22c55e', linewidth=2, label='Triple redundancy')
ax.axhline(99.9, color='gray', linestyle='--', linewidth=1, alpha=0.5)
ax.text(100, 99.5, '99.9% target', color='gray', fontsize=8)

ax.set_xlabel('Operating hours', color='white')
ax.set_ylabel('System reliability (%)', color='white')
ax.set_title('Effect of Redundancy on System Reliability', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_ylim(95, 100.5)

# Availability analysis
ax = axes[1, 0]; ax.set_facecolor('#111827')
mtbfs = np.linspace(100, 5000, 200)
mttrs = [1, 4, 8, 24, 48]  # hours to repair

for mttr, color in zip(mttrs, ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444']):
    availability = mtbfs / (mtbfs + mttr) * 100
    ax.plot(mtbfs, availability, color=color, linewidth=2, label=f'MTTR={mttr}h')

ax.axhline(99, color='gray', linestyle='--', linewidth=1, alpha=0.5)
ax.text(4000, 98.8, '99% target', color='gray', fontsize=8)

ax.set_xlabel('MTBF (hours)', color='white')
ax.set_ylabel('Availability (%)', color='white')
ax.set_title('Availability = MTBF / (MTBF + MTTR)', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_ylim(90, 100.5)

# Maintenance schedule optimisation
ax = axes[1, 1]; ax.set_facecolor('#111827')
# Cost model: preventive maintenance at interval T vs reactive repair
T_intervals = np.linspace(100, 3000, 200)
mtbf = 2000
cost_preventive = 100  # cost per scheduled maintenance
cost_failure = 5000    # cost per unexpected failure

# Expected failures if maintained at interval T
# If T < MTBF, few failures; if T > MTBF, many failures
expected_failures = 1 - np.exp(-T_intervals / mtbf)
total_cost_per_hour = cost_preventive / T_intervals + cost_failure * expected_failures / T_intervals

ax.plot(T_intervals, total_cost_per_hour, color='#a855f7', linewidth=2.5)
optimal_T = T_intervals[np.argmin(total_cost_per_hour)]
min_cost = min(total_cost_per_hour)
ax.plot(optimal_T, min_cost, 'o', color='#f59e0b', markersize=10)
ax.annotate(f'Optimal: every {optimal_T:.0f}h\\nCost: \u20B9{min_cost:.2f}/h',
            xy=(optimal_T, min_cost), xytext=(optimal_T + 400, min_cost + 0.3),
            color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax.set_xlabel('Maintenance interval (hours)', color='white')
ax.set_ylabel('Cost per operating hour (\u20B9)', color='white')
ax.set_title('Optimal Maintenance Schedule', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Reliability analysis summary:")
print(f"  Single brake at 2000h: {np.exp(-2000/2000)*100:.1f}% reliability")
print(f"  Dual redundancy at 2000h: {(1-(1-np.exp(-2000/2000))*(1-np.exp(-2000/1500)))*100:.1f}%")
print(f"  Triple redundancy at 2000h: {(1-(1-np.exp(-2000/2000))*(1-np.exp(-2000/1500))*(1-np.exp(-2000/5000)))*100:.1f}%")
print(f"  Optimal maintenance interval: every {optimal_T:.0f} hours")`,
      challenge: 'Add a wear model where MTBF decreases with age (e.g., MTBF(age) = MTBF_0 \u00D7 exp(-age/lifetime)). Recalculate the optimal maintenance interval. Should Bogi\u2019s boiler be replaced or patched for the fifteenth time?',
      successHint: 'Reliability engineering is the difference between a railway that runs safely for decades and one that has catastrophic failures. Every patch on Bogi\u2019s boiler is a data point in this analysis.',
    },
    {
      title: 'Heritage railway preservation and economics',
      concept: `India\u2019s three UNESCO mountain railways survive as both working transport and heritage sites. Preservation requires balancing authenticity (steam engines, original infrastructure) with modern safety and economics.

Key economic factors: **operating cost per passenger-km**, **tourism revenue**, **government subsidy**, and **heritage maintenance costs**. Steam operation costs 3\u20135\u00D7 more than diesel, but draws tourists willing to pay premium fares.`,
      analogy: 'Preserving a heritage railway is like running a working museum \u2014 the exhibits must function, not just look pretty. Every journey is both a transport service and a living history demonstration.',
      storyConnection: 'The story\u2019s central tension \u2014 the express vs the little train \u2014 is the real debate in Indian railway policy: should heritage lines be modernised (faster, cheaper) or preserved (authentic, cultural)?',
      checkQuestion: 'The railway is UNESCO heritage. How do you optimise operations without changing the passenger experience?',
      checkAnswer: 'Optimise behind the scenes: better maintenance scheduling (fewer breakdowns), driver training (fuel efficiency), digital monitoring (predict failures), and dynamic pricing (fill seats). The heritage charm is preserved; only the operations become modern.',
      codeIntro: 'Build an economic model of a heritage mountain railway.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Economic model: Darjeeling Himalayan Railway
# Compare steam heritage vs diesel conversion scenarios

years = np.arange(2024, 2044)  # 20-year analysis
n_years = len(years)

# Baseline: steam heritage operation
passengers_base = 200000  # per year
fare_steam = 1500  # INR per ticket (heritage premium)
fare_diesel = 500  # INR per ticket (standard)

# Revenue
tourist_growth = 1.04  # 4% annual growth in heritage tourism
passenger_counts_steam = passengers_base * tourist_growth ** np.arange(n_years)
passenger_counts_diesel = passengers_base * 1.5  # more capacity but no growth premium

revenue_steam = passenger_counts_steam * fare_steam / 1e7  # crore INR
revenue_diesel = np.full(n_years, passenger_counts_diesel * fare_diesel / 1e7)

# Operating costs
cost_steam_per_pass = 800  # INR (high: coal, maintenance, skilled crew)
cost_diesel_per_pass = 300  # INR (lower fuel and maintenance)
cost_steam = passenger_counts_steam * cost_steam_per_pass / 1e7
cost_diesel = np.full(n_years, passenger_counts_diesel * cost_diesel_per_pass / 1e7)

# Heritage maintenance fund (required for UNESCO status)
heritage_fund = np.full(n_years, 5.0)  # 5 crore/year

# Conversion cost (one-time, year 0)
conversion_cost = np.zeros(n_years)
conversion_cost[0] = 50  # 50 crore to convert to diesel

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

# Revenue comparison
ax = axes[0, 0]; ax.set_facecolor('#111827')
ax.plot(years, revenue_steam, color='#f59e0b', linewidth=2, label='Steam heritage')
ax.plot(years, revenue_diesel, color='#3b82f6', linewidth=2, label='Diesel conversion')
ax.fill_between(years, revenue_steam, revenue_diesel,
                 where=revenue_steam > revenue_diesel, alpha=0.15, color='#f59e0b')
ax.set_xlabel('Year', color='white'); ax.set_ylabel('Revenue (crore INR)', color='white')
ax.set_title('Annual Revenue', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Operating costs
ax = axes[0, 1]; ax.set_facecolor('#111827')
ax.plot(years, cost_steam + heritage_fund, color='#f59e0b', linewidth=2, label='Steam + heritage fund')
ax.plot(years, cost_diesel, color='#3b82f6', linewidth=2, label='Diesel (no heritage)')
ax.set_xlabel('Year', color='white'); ax.set_ylabel('Cost (crore INR)', color='white')
ax.set_title('Annual Operating Cost', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Net profit
ax = axes[1, 0]; ax.set_facecolor('#111827')
profit_steam = revenue_steam - cost_steam - heritage_fund
profit_diesel = revenue_diesel - cost_diesel - conversion_cost
ax.plot(years, profit_steam, color='#f59e0b', linewidth=2, label='Steam heritage')
ax.plot(years, profit_diesel, color='#3b82f6', linewidth=2, label='Diesel conversion')
ax.axhline(0, color='gray', linewidth=0.5)
ax.fill_between(years, profit_steam, 0, where=profit_steam > 0, alpha=0.15, color='#f59e0b')
ax.set_xlabel('Year', color='white'); ax.set_ylabel('Net profit (crore INR)', color='white')
ax.set_title('Annual Net Profit', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Cumulative NPV
ax = axes[1, 1]; ax.set_facecolor('#111827')
discount_rate = 0.08  # 8% discount rate
discount_factors = 1 / (1 + discount_rate) ** np.arange(n_years)

npv_steam = np.cumsum(profit_steam * discount_factors)
npv_diesel = np.cumsum(profit_diesel * discount_factors)

ax.plot(years, npv_steam, color='#f59e0b', linewidth=2.5, label='Steam heritage NPV')
ax.plot(years, npv_diesel, color='#3b82f6', linewidth=2.5, label='Diesel NPV')
ax.axhline(0, color='gray', linewidth=0.5)

# Highlight winner
winner = 'Steam' if npv_steam[-1] > npv_diesel[-1] else 'Diesel'
ax.text(2035, max(npv_steam[-1], npv_diesel[-1]) * 0.7,
        f'{winner} wins by\\n\\u20B9{abs(npv_steam[-1] - npv_diesel[-1]):.0f} crore',
        color='#22c55e', fontsize=11, fontweight='bold')

ax.set_xlabel('Year', color='white'); ax.set_ylabel('Cumulative NPV (crore INR)', color='white')
ax.set_title('20-Year Net Present Value', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("20-year economic analysis:")
print(f"  Steam heritage NPV: \\u20B9{npv_steam[-1]:.0f} crore")
print(f"  Diesel conversion NPV: \\u20B9{npv_diesel[-1]:.0f} crore")
print(f"  Winner: {winner} by \\u20B9{abs(npv_steam[-1] - npv_diesel[-1]):.0f} crore")
print(f"  Heritage tourism growth makes steam viable long-term")`,
      challenge: 'Add a climate change scenario: carbon pricing at INR 2,000 per tonne CO\u2082 (increasing 5% annually). Steam emits ~2 kg CO\u2082 per passenger-km, diesel ~0.5 kg. Does carbon pricing change the winner? At what carbon price does diesel become clearly better?',
      successHint: 'The economics of heritage railways show that cultural and tourism value can outweigh pure efficiency. This is a model for sustainable heritage preservation worldwide.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (railway engineering)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete mountain railway simulator. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
