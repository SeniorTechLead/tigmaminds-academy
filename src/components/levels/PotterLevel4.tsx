import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function PotterLevel4() {
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
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Capstone overview — Kiln Temperature Optimizer',
      concept: `In this capstone you will build a **Kiln Temperature Optimizer** that designs the ideal firing schedule for a given clay body and desired ceramic type. The optimizer must balance competing constraints: fire hot enough to achieve the target density, but slowly enough to avoid thermal shock, while minimizing fuel consumption and total firing time.

Real kiln optimization is a **constrained optimization problem**. The objective function is total fuel cost (proportional to temperature × time), subject to constraints: (1) final porosity must be below a target threshold, (2) thermal stress at no point exceeds the material's tensile strength, (3) the quartz inversion at 573°C must be traversed at less than 50°C/hour, and (4) the cooling rate must not cause thermal shock.

Your optimizer will combine:
1. **Heat transfer model** — predicting temperature distribution through the clay wall at each time step
2. **Sintering kinetics** — calculating porosity reduction as a function of temperature history
3. **Thermal stress calculator** — checking that the temperature gradient never exceeds the failure threshold
4. **Cost function** — integrating fuel consumption over the entire schedule
5. **Gradient-free optimization** — using a search algorithm to find the best heating rates for each phase

This is the same class of problem solved in industrial process control, where engineers optimize manufacturing schedules subject to physical and economic constraints.`,
      analogy: 'Designing a firing schedule is like planning a road trip with constraints. You want to minimize travel time (fuel cost), but speed limits exist on certain roads (thermal stress limits), you must slow down through school zones (quartz inversion), and you need to arrive at the destination (target porosity). A GPS navigator solves this by evaluating many possible routes — your optimizer does the same for temperature paths.',
      storyConnection: 'Master potters in Assam know their firing schedules by heart — when to add more wood, when to partially close the air intake, when to let the fire die slowly. This knowledge, accumulated over generations, represents an empirical optimization. Your capstone formalizes this wisdom into equations that can be solved computationally, potentially discovering schedules that even experienced potters have not tried.',
      checkQuestion: 'If a kiln uses 5 kg of wood per hour at 800°C and fuel consumption scales linearly with temperature, how much wood is needed for a schedule that holds at 600°C for 2 hours, ramps to 1100°C over 3 hours (average 850°C), and holds at 1100°C for 2 hours?',
      checkAnswer: 'Fuel rate at temperature T: rate = 5 × T/800 kg/hour. Phase 1: 5 × 600/800 × 2 = 7.5 kg. Phase 2: 5 × 850/800 × 3 = 15.9 kg. Phase 3: 5 × 1100/800 × 2 = 13.75 kg. Total = 37.2 kg. The high-temperature hold is disproportionately expensive — 60% of fuel for 29% of time. This is why optimizers often find that slightly lower peak temperatures with longer holds are more economical.',
      codeIntro: 'Build the thermal model and sintering kinetics that form the foundation of the optimizer.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === KILN TEMPERATURE OPTIMIZER: Module 1 ===
# Thermal model + sintering kinetics

class KilnModel:
    """Physics-based kiln firing model."""

    def __init__(self, wall_thickness=0.008, clay_type='kaolinite'):
        # Clay properties
        self.props = {
            'kaolinite': {'k': 1.0, 'rho': 1800, 'cp': 900, 'alpha_th': 7e-6,
                          'E': 70e9, 'sigma_t': 60e6, 'nu': 0.25, 'sinter_E': 250e3},
            'stoneware': {'k': 1.2, 'rho': 2000, 'cp': 850, 'alpha_th': 6e-6,
                          'E': 80e9, 'sigma_t': 80e6, 'nu': 0.22, 'sinter_E': 280e3},
            'porcelain': {'k': 1.5, 'rho': 2200, 'cp': 800, 'alpha_th': 5e-6,
                          'E': 100e9, 'sigma_t': 100e6, 'nu': 0.20, 'sinter_E': 300e3},
        }[clay_type]
        self.wall = wall_thickness
        self.nx = 30
        self.dx = wall_thickness / self.nx

    def thermal_diffusivity(self):
        return self.props['k'] / (self.props['rho'] * self.props['cp'])

    def max_thermal_stress(self, delta_T):
        """Thermal stress from surface-center temperature difference."""
        E, alpha, nu = self.props['E'], self.props['alpha_th'], self.props['nu']
        return E * alpha * delta_T / (1 - nu)

    def sintering_rate(self, T_celsius):
        """Porosity reduction rate at given temperature."""
        R = 8.314
        T_K = T_celsius + 273.15
        E_act = self.props['sinter_E']
        return 5e8 * np.exp(-E_act / (R * T_K))

    def simulate(self, schedule, dt_minutes=1):
        """Run full firing simulation with given temperature schedule.
        schedule: list of (duration_hours, target_temp_C) tuples
        Returns: dict of time series data
        """
        alpha = self.thermal_diffusivity()
        dt = dt_minutes * 60  # seconds
        cfl = alpha * dt / self.dx**2

        # Build temperature-vs-time from schedule
        total_hours = sum(d for d, _ in schedule)
        n_steps = int(total_hours * 60 / dt_minutes)
        kiln_temp = np.zeros(n_steps)

        step = 0
        current_temp = 25.0
        for duration, target in schedule:
            n = int(duration * 60 / dt_minutes)
            for i in range(n):
                if step + i < n_steps:
                    frac = i / max(n - 1, 1)
                    kiln_temp[step + i] = current_temp + (target - current_temp) * frac
            step += n
            current_temp = target

        # Simulation arrays
        T = np.ones(self.nx) * 25.0
        time_hrs = np.arange(n_steps) * dt_minutes / 60
        surface_T = np.zeros(n_steps)
        center_T = np.zeros(n_steps)
        max_stress = np.zeros(n_steps)
        porosity = np.zeros(n_steps)
        porosity[0] = 0.40

        for n in range(n_steps):
            T[0] = kiln_temp[n]
            T[-1] = T[-2]

            T_new = T.copy()
            for i in range(1, self.nx - 1):
                T_new[i] = T[i] + alpha * dt / self.dx**2 * (T[i+1] - 2*T[i] + T[i-1])
            T = T_new

            surface_T[n] = T[0]
            center_T[n] = T[self.nx // 2]
            delta_T = abs(T[0] - T[self.nx // 2])
            max_stress[n] = self.max_thermal_stress(delta_T)

            # Sintering
            if n > 0:
                avg_T = (T[0] + T[self.nx//2]) / 2
                rate = self.sintering_rate(avg_T)
                porosity[n] = porosity[n-1] * np.exp(-rate * dt / 3600)
                porosity[n] = max(porosity[n], 0.005)
            else:
                porosity[n] = 0.40

        # Fuel consumption (proportional to kiln temp)
        fuel_rate = kiln_temp / 800 * 5  # kg/hr baseline
        total_fuel = np.trapz(fuel_rate, time_hrs)

        return {
            'time': time_hrs, 'kiln_temp': kiln_temp,
            'surface_T': surface_T, 'center_T': center_T,
            'stress': max_stress, 'porosity': porosity,
            'fuel_rate': fuel_rate, 'total_fuel': total_fuel,
            'sigma_t': self.props['sigma_t']
        }

# Test with a standard earthenware schedule
model = KilnModel(wall_thickness=0.008, clay_type='kaolinite')
schedule = [
    (1.0, 200),    # slow start
    (2.0, 573),    # approach quartz inversion
    (0.5, 600),    # through inversion slowly
    (2.0, 1000),   # main ramp
    (2.0, 1000),   # soak
    (1.0, 800),    # begin cooling
    (2.0, 573),    # approach inversion from above
    (0.5, 550),    # through inversion
    (2.0, 200),    # cool to safe
]

result = model.simulate(schedule)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Kiln Firing Simulation — Earthenware Schedule', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Temperature
axes[0, 0].plot(result['time'], result['kiln_temp'], color='#ef4444', linewidth=2, label='Kiln')
axes[0, 0].plot(result['time'], result['surface_T'], color='#f59e0b', linewidth=1.5, label='Surface')
axes[0, 0].plot(result['time'], result['center_T'], color='#3b82f6', linewidth=1.5, label='Center')
axes[0, 0].axhline(573, color='gray', linestyle='--', alpha=0.5)
axes[0, 0].annotate('Quartz inversion', xy=(1, 580), color='gray', fontsize=8)
axes[0, 0].set_xlabel('Time (hours)', color='white')
axes[0, 0].set_ylabel('Temperature (°C)', color='white')
axes[0, 0].set_title('Temperature profiles', color='white', fontsize=11)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Thermal stress
stress_mpa = result['stress'] / 1e6
safe = result['sigma_t'] / 1e6
axes[0, 1].plot(result['time'], stress_mpa, color='#f59e0b', linewidth=2)
axes[0, 1].axhline(safe, color='#ef4444', linestyle='--', linewidth=1.5, label=f'Failure: {safe:.0f} MPa')
axes[0, 1].fill_between(result['time'], stress_mpa, safe,
                         where=stress_mpa > safe, alpha=0.3, color='#ef4444')
axes[0, 1].set_xlabel('Time (hours)', color='white')
axes[0, 1].set_ylabel('Thermal stress (MPa)', color='white')
axes[0, 1].set_title('Stress vs failure threshold', color='white', fontsize=11)
axes[0, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Porosity
axes[1, 0].plot(result['time'], result['porosity'] * 100, color='#22c55e', linewidth=2)
axes[1, 0].fill_between(result['time'], result['porosity'] * 100, alpha=0.2, color='#22c55e')
axes[1, 0].set_xlabel('Time (hours)', color='white')
axes[1, 0].set_ylabel('Porosity (%)', color='white')
axes[1, 0].set_title(f'Densification (final: {result["porosity"][-1]*100:.1f}%)', color='white', fontsize=11)

# Fuel consumption
axes[1, 1].plot(result['time'], result['fuel_rate'], color='#a78bfa', linewidth=2)
axes[1, 1].fill_between(result['time'], result['fuel_rate'], alpha=0.2, color='#a78bfa')
axes[1, 1].set_xlabel('Time (hours)', color='white')
axes[1, 1].set_ylabel('Fuel rate (kg/hr)', color='white')
axes[1, 1].set_title(f'Fuel consumption (total: {result["total_fuel"]:.1f} kg)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Simulation results:")
print(f"  Total time: {result['time'][-1]:.1f} hours")
print(f"  Peak stress: {max(stress_mpa):.1f} MPa (limit: {safe:.0f} MPa)")
print(f"  Final porosity: {result['porosity'][-1]*100:.1f}%")
print(f"  Total fuel: {result['total_fuel']:.1f} kg")
exceeded = stress_mpa > safe
if np.any(exceeded):
    print(f"  WARNING: Stress exceeded at {np.sum(exceeded)} time steps!")
else:
    print(f"  All stress values within safe limits.")`,
      challenge: 'Try changing wall_thickness to 0.015 (15mm). Does the schedule still stay within stress limits? What adjustments are needed?',
      successHint: 'The model captures the fundamental tradeoff: thicker walls need slower heating, which costs more fuel. This is why potters make thin walls for delicate pieces — it is not just aesthetics, it is thermal engineering.',
    },
    {
      title: 'Firing schedule parameterization and search space',
      concept: `To optimize a firing schedule, we need to represent it mathematically. A schedule is a sequence of **ramp rates** (°C per hour) and **hold times** at specific temperatures. We parameterize it as a vector of decision variables that the optimizer can adjust.

A typical firing schedule has 5-7 phases: initial heating, water smoking (100-200°C), pre-inversion ramp, quartz inversion passage (around 573°C), main firing ramp, peak temperature hold, and controlled cooling. Each phase has two parameters: the heating rate and the duration. With 7 phases × 2 parameters = 14 decision variables, the search space is 14-dimensional.

Not all combinations are valid. Physical constraints eliminate large portions of the search space: heating rates cannot be negative during ramp-up phases (unless cooling), temperatures must be monotonically increasing during heating, and the quartz inversion must be traversed slowly. These constraints form a **feasible region** within the full parameter space — the optimizer must stay within this region while finding the minimum-cost point.

The objective function we minimize is a weighted combination: Cost = w₁ × fuel + w₂ × time + w₃ × max(0, porosity - target) + w₄ × max(0, stress - limit). The first two terms are what we want to minimize; the last two are **penalty terms** that become large when constraints are violated. This is called the **penalty method** for constrained optimization.`,
      analogy: 'Parameterizing a firing schedule is like describing a hiking route using waypoints. Instead of specifying every step, you list key checkpoints (temperatures) and how fast you travel between them (ramp rates). The optimizer is a hiker trying to minimize effort (fuel) while hitting all checkpoints and never exceeding safe speeds on steep terrain (stress limits).',
      storyConnection: 'Traditional Assamese potters describe their schedules in terms of fire intensity and timing: "feed the fire gently at first, then strongly after midday, then let it die by evening." These verbal instructions map directly onto our parameterization: "gently" is a low ramp rate, "strongly" is a high ramp rate, and the timing defines phase durations.',
      checkQuestion: 'If the optimizer has 14 decision variables and we discretize each into 10 possible values, how many possible schedules exist? Why is exhaustive search impractical?',
      checkAnswer: '10¹⁴ = 100 trillion possible schedules. If each simulation takes 0.01 seconds, exhaustive evaluation would take 100 trillion × 0.01 = 1 trillion seconds = about 31,700 years. This is why we need smart optimization algorithms that explore the space efficiently instead of testing every combination.',
      codeIntro: 'Define the schedule parameterization and build a cost function that the optimizer will minimize.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === KILN OPTIMIZER: Module 2 ===
# Schedule parameterization and cost function

class FiringSchedule:
    """Parameterized firing schedule with constraints."""

    # Phase definitions: (name, temp_range, max_rate)
    PHASES = [
        ('Initial heat', (25, 200), 200),       # max 200°C/hr
        ('Water smoking', (200, 400), 100),       # slow through moisture loss
        ('Pre-inversion', (400, 560), 150),       # approach quartz carefully
        ('Quartz zone', (560, 590), 50),          # MUST be slow
        ('Main ramp', (590, None), 300),          # target temp varies
        ('Peak hold', (None, None), 0),           # hold at peak
        ('Cooling', (None, 200), -200),           # controlled descent
    ]

    def __init__(self, params):
        """params: [rate1, rate2, rate3, rate4, rate5, peak_temp, hold_hours, cool_rate]"""
        self.rates = params[:5]       # °C/hr for phases 0-4
        self.peak_temp = params[5]    # target peak temperature
        self.hold_hours = params[6]   # hours at peak
        self.cool_rate = params[7]    # °C/hr cooling (negative)

    def to_schedule(self):
        """Convert parameters to (duration, target_temp) list."""
        schedule = []
        temps = [200, 400, 560, 590, self.peak_temp]

        # Heating phases
        current = 25
        for i, target in enumerate(temps):
            rate = max(abs(self.rates[i]), 10)  # minimum 10°C/hr
            dt_range = target - current
            duration = dt_range / rate
            schedule.append((duration, target))
            current = target

        # Hold at peak
        schedule.append((self.hold_hours, self.peak_temp))

        # Cooling
        cool_rate = max(abs(self.cool_rate), 20)
        # Slow through quartz inversion on way down
        if self.peak_temp > 600:
            dt1 = (self.peak_temp - 600) / cool_rate
            schedule.append((dt1, 600))
            schedule.append((60 / 40, 550))  # slow through 573
            dt2 = (550 - 200) / cool_rate
            schedule.append((dt2, 200))
        else:
            dt = (self.peak_temp - 200) / cool_rate
            schedule.append((dt, 200))

        return schedule

    def total_time(self):
        return sum(d for d, _ in self.to_schedule())

def cost_function(params, model, target_porosity=0.10, w_fuel=1.0, w_time=0.5, w_porosity=100, w_stress=200):
    """Evaluate a firing schedule. Lower is better."""
    try:
        sched = FiringSchedule(params)
        schedule = sched.to_schedule()

        # Reject obviously invalid
        if sched.peak_temp < 600 or sched.peak_temp > 1400:
            return 1e6
        if sched.hold_hours < 0.5 or sched.hold_hours > 12:
            return 1e6

        result = model.simulate(schedule)

        fuel_cost = result['total_fuel']
        time_cost = result['time'][-1]
        porosity_penalty = max(0, result['porosity'][-1] - target_porosity) * 1000
        stress_max = np.max(result['stress'])
        stress_penalty = max(0, stress_max - result['sigma_t']) / 1e6

        total = w_fuel * fuel_cost + w_time * time_cost + w_porosity * porosity_penalty + w_stress * stress_penalty
        return total
    except Exception:
        return 1e6

# Visualize the search space: vary two parameters, fix others
model_cls = type('M', (), {
    '__init__': lambda s: None,
    'thermal_diffusivity': lambda s: 1.0/(1800*900),
    'max_thermal_stress': lambda s, dT: 70e9 * 7e-6 * dT / 0.75,
    'sintering_rate': lambda s, T: 5e8 * np.exp(-250e3/(8.314*(T+273.15))),
    'props': {'k':1.0, 'rho':1800, 'cp':900, 'alpha_th':7e-6, 'E':70e9, 'sigma_t':60e6, 'nu':0.25, 'sinter_E':250e3},
    'wall': 0.008, 'nx': 15, 'dx': 0.008/15,
    'simulate': lambda s, sched, dt_minutes=2: _quick_sim(s, sched, dt_minutes)
})

# Quick simulation for parameter sweep
def _quick_sim(model, schedule, dt_minutes=2):
    alpha = model.props['k'] / (model.props['rho'] * model.props['cp'])
    dt = dt_minutes * 60
    total_hours = sum(d for d, _ in schedule)
    n_steps = max(int(total_hours * 60 / dt_minutes), 10)
    kiln_temp = np.zeros(n_steps)

    step = 0; current = 25.0
    for dur, target in schedule:
        n = max(int(dur * 60 / dt_minutes), 1)
        for i in range(n):
            if step + i < n_steps:
                kiln_temp[step + i] = current + (target - current) * i / max(n-1, 1)
        step += n; current = target
    kiln_temp[step:] = current

    porosity = 0.40
    max_stress = 0
    for n in range(n_steps):
        T = kiln_temp[n]
        rate = 5e8 * np.exp(-250e3 / (8.314 * (T + 273.15)))
        porosity *= np.exp(-rate * dt / 3600)
        porosity = max(porosity, 0.005)
        if n > 0:
            dT = abs(kiln_temp[n] - kiln_temp[max(n-5,0)]) * 0.3
            stress = 70e9 * 7e-6 * dT / 0.75
            max_stress = max(max_stress, stress)

    time_hrs = np.arange(n_steps) * dt_minutes / 60
    fuel = np.trapz(kiln_temp / 800 * 5, time_hrs)

    return {
        'time': time_hrs, 'kiln_temp': kiln_temp,
        'surface_T': kiln_temp, 'center_T': kiln_temp * 0.9,
        'stress': np.ones(n_steps) * max_stress,
        'porosity': np.ones(n_steps) * porosity,
        'fuel_rate': kiln_temp / 800 * 5, 'total_fuel': fuel,
        'sigma_t': 60e6
    }

# Parameter sweep: peak temperature vs hold time
peak_temps = np.linspace(800, 1300, 25)
hold_times = np.linspace(0.5, 8, 25)
cost_map = np.zeros((len(hold_times), len(peak_temps)))

m = model_cls()
base_params = [100, 80, 100, 40, 200, 1000, 2, 100]

for i, ht in enumerate(hold_times):
    for j, pt in enumerate(peak_temps):
        params = base_params.copy()
        params[5] = pt
        params[6] = ht
        cost_map[i, j] = cost_function(params, m, target_porosity=0.10)

# Clip for display
cost_map = np.clip(cost_map, 0, 500)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Firing Schedule Optimization Landscape', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Cost landscape
im = axes[0, 0].contourf(peak_temps, hold_times, cost_map, levels=20, cmap='viridis_r')
axes[0, 0].contour(peak_temps, hold_times, cost_map, levels=[100, 150, 200], colors='white', linewidths=0.5)
plt.colorbar(im, ax=axes[0, 0], label='Total cost')
min_idx = np.unravel_index(np.argmin(cost_map), cost_map.shape)
axes[0, 0].plot(peak_temps[min_idx[1]], hold_times[min_idx[0]], 'r*', markersize=15)
axes[0, 0].set_xlabel('Peak temperature (°C)', color='white')
axes[0, 0].set_ylabel('Hold time (hours)', color='white')
axes[0, 0].set_title('Cost landscape (peak temp vs hold time)', color='white', fontsize=11)

# Porosity achieved at each point
por_map = np.zeros_like(cost_map)
for i, ht in enumerate(hold_times):
    for j, pt in enumerate(peak_temps):
        params = base_params.copy()
        params[5] = pt; params[6] = ht
        try:
            sched = FiringSchedule(params)
            result = _quick_sim(m, sched.to_schedule())
            por_map[i, j] = result['porosity'][-1] * 100
        except:
            por_map[i, j] = 40

im2 = axes[0, 1].contourf(peak_temps, hold_times, por_map, levels=20, cmap='RdYlGn_r')
axes[0, 1].contour(peak_temps, hold_times, por_map, levels=[5, 10, 20], colors='white', linewidths=1)
plt.colorbar(im2, ax=axes[0, 1], label='Porosity (%)')
axes[0, 1].set_xlabel('Peak temperature (°C)', color='white')
axes[0, 1].set_ylabel('Hold time (hours)', color='white')
axes[0, 1].set_title('Final porosity achieved', color='white', fontsize=11)

# Cost breakdown for best point
best_peak = peak_temps[min_idx[1]]
best_hold = hold_times[min_idx[0]]
params = base_params.copy()
params[5] = best_peak; params[6] = best_hold
sched = FiringSchedule(params)
result = _quick_sim(m, sched.to_schedule())

components = ['Fuel', 'Time', 'Porosity\\npenalty', 'Stress\\npenalty']
values = [result['total_fuel'], result['time'][-1] * 0.5,
          max(0, result['porosity'][-1] - 0.10) * 1000,
          max(0, np.max(result['stress']) - 60e6) / 1e6 * 200]
colors_bar = ['#a78bfa', '#3b82f6', '#22c55e', '#ef4444']
axes[1, 0].bar(components, values, color=colors_bar, alpha=0.8)
axes[1, 0].set_ylabel('Cost contribution', color='white')
axes[1, 0].set_title(f'Cost breakdown (best: {best_peak:.0f}°C, {best_hold:.1f}h)', color='white', fontsize=11)

# Pareto front: fuel vs porosity
fuels = []
porosities = []
for pt in np.linspace(800, 1300, 40):
    for ht in np.linspace(1, 6, 20):
        params = base_params.copy()
        params[5] = pt; params[6] = ht
        try:
            sched = FiringSchedule(params)
            result = _quick_sim(m, sched.to_schedule())
            fuels.append(result['total_fuel'])
            porosities.append(result['porosity'][-1] * 100)
        except:
            pass

axes[1, 1].scatter(fuels, porosities, c=porosities, cmap='RdYlGn_r', s=10, alpha=0.5)
axes[1, 1].set_xlabel('Total fuel (kg)', color='white')
axes[1, 1].set_ylabel('Final porosity (%)', color='white')
axes[1, 1].set_title('Pareto front: fuel vs porosity', color='white', fontsize=11)
axes[1, 1].axhline(10, color='#22c55e', linestyle='--', alpha=0.5)
axes[1, 1].annotate('Target: 10%', xy=(min(fuels)+5, 11), color='#22c55e', fontsize=8)

plt.tight_layout()
plt.show()

print(f"Optimization landscape analysis:")
print(f"  Best point: peak={best_peak:.0f}°C, hold={best_hold:.1f}h")
print(f"  Final porosity: {por_map[min_idx]:.1f}%")
print(f"  Total fuel: {result['total_fuel']:.1f} kg")
print(f"  Total time: {result['time'][-1]:.1f} hours")`,
      challenge: 'Add a third dimension: main ramp rate. Create a 3D search by also varying rates[4] from 50 to 300 °C/hr. Which combination of peak temp, hold time, and ramp rate gives the lowest cost?',
      successHint: 'The search space grows exponentially with each new parameter. This is the "curse of dimensionality" — and it is why smart search algorithms are essential for real-world optimization.',
    },
    {
      title: 'Random search and hill climbing optimizer',
      concept: `With the cost function defined, we need an algorithm to find the minimum. The simplest approach is **random search** — generate many random schedules, evaluate each, and keep the best. This is surprisingly effective in low dimensions and serves as a baseline.

A smarter approach is **hill climbing** (also called greedy local search). Starting from a random point, we test small perturbations in each parameter direction. If a perturbation reduces the cost, we accept it. We repeat until no perturbation improves the cost — we have reached a **local minimum**. The risk is that a local minimum might not be the global minimum. The cost landscape has hills and valleys, and hill climbing can get trapped in a shallow valley when a much deeper valley exists elsewhere.

To escape local minima, we use **random restarts**: run hill climbing from many random starting points and keep the overall best result. Another technique is **simulated annealing**, which occasionally accepts moves that increase cost (with probability that decreases over time), allowing the search to escape shallow traps. The name comes from metallurgy — annealing metal involves heating and slowly cooling it to reach a low-energy crystalline state, exactly analogous to what the algorithm does in parameter space.

The convergence behavior tells us about the landscape: if many random restarts find the same minimum, the landscape is likely convex (one valley). If different restarts find different minima, the landscape is multimodal (many valleys), and we need more sophisticated methods.`,
      analogy: 'Random search is like dropping balls from random positions on a hilly landscape and measuring where each one rests. Hill climbing is like placing a ball and nudging it downhill until it stops. Neither guarantees finding the deepest valley, but doing both many times gives you a good chance. Simulated annealing is like shaking the landscape — small shakes let balls escape shallow dips and roll into deeper ones.',
      storyConnection: 'A potter optimizing a firing schedule by trial and error is essentially doing hill climbing with random restarts. Each firing is an experiment: if a slight change in timing or temperature produces a better result, the potter adopts it. Over many firings (restarts), the potter converges on an excellent schedule — though not necessarily the mathematically optimal one.',
      checkQuestion: 'If hill climbing with 50 random restarts takes 2 seconds per restart, and the global optimum is found by 3 out of 50 restarts, what is the probability that at least one of 50 restarts finds it if each has a 6% chance?',
      checkAnswer: 'P(at least one finds it) = 1 - P(none find it) = 1 - (1 - 0.06)^50 = 1 - 0.94^50 = 1 - 0.045 = 95.5%. With 50 restarts, we have a 95.5% chance of finding the global optimum. Doubling to 100 restarts gives 99.8%. This is the power of random restarts — each one is independent, so probabilities compound favorably.',
      codeIntro: 'Implement random search and hill climbing to optimize the firing schedule.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === KILN OPTIMIZER: Module 3 ===
# Random search + hill climbing

np.random.seed(42)

# Simplified cost function for fast evaluation
def quick_cost(params):
    """Fast approximate cost function."""
    rates = params[:5]
    peak_temp = params[5]
    hold_time = params[6]
    cool_rate = params[7]

    # Feasibility checks
    if peak_temp < 600 or peak_temp > 1400: return 1e6
    if hold_time < 0.5 or hold_time > 10: return 1e6
    if any(r < 5 for r in rates[:4]): return 1e6
    if rates[3] > 50: return 1e6  # quartz zone must be slow
    if cool_rate < 20 or cool_rate > 300: return 1e6

    # Time calculation
    temps = [200, 400, 560, 590, peak_temp]
    current = 25
    total_time = 0
    for i, target in enumerate(temps):
        total_time += (target - current) / max(rates[i], 10)
        current = target
    total_time += hold_time
    total_time += (peak_temp - 200) / cool_rate

    # Fuel (proportional to integral of temperature)
    avg_temp = (25 + peak_temp) / 2
    heating_fuel = avg_temp / 800 * 5 * (total_time - hold_time - (peak_temp-200)/cool_rate)
    hold_fuel = peak_temp / 800 * 5 * hold_time
    cool_fuel = (peak_temp + 200) / 2 / 800 * 5 * (peak_temp - 200) / cool_rate
    total_fuel = heating_fuel + hold_fuel + cool_fuel

    # Sintering estimate
    T_K = peak_temp + 273.15
    rate = 5e8 * np.exp(-250e3 / (8.314 * T_K))
    porosity = 0.40 * np.exp(-rate * hold_time)

    # Stress estimate (from max ramp rate)
    max_rate = max(rates)
    delta_T_est = max_rate * 0.008 / (1.0 / (1800 * 900)) * 0.001
    stress = 70e9 * 7e-6 * min(delta_T_est, 200) / 0.75

    # Cost
    fuel_cost = total_fuel
    time_cost = total_time * 0.5
    porosity_penalty = max(0, porosity - 0.10) * 1000
    stress_penalty = max(0, stress - 60e6) / 1e6 * 200

    return fuel_cost + time_cost + porosity_penalty + stress_penalty

# Parameter bounds
bounds = [
    (30, 200),   # rate 0: initial
    (30, 100),   # rate 1: water smoking
    (30, 150),   # rate 2: pre-inversion
    (10, 50),    # rate 3: quartz zone
    (50, 300),   # rate 4: main ramp
    (800, 1300), # peak temperature
    (1, 8),      # hold time
    (30, 200),   # cooling rate
]

def random_params():
    return np.array([np.random.uniform(lo, hi) for lo, hi in bounds])

# 1. Random search
n_random = 2000
random_costs = []
best_random_cost = 1e6
best_random_params = None

for _ in range(n_random):
    p = random_params()
    c = quick_cost(p)
    random_costs.append(c)
    if c < best_random_cost:
        best_random_cost = c
        best_random_params = p.copy()

# 2. Hill climbing with random restarts
def hill_climb(start_params, step_sizes=None, max_iter=200):
    if step_sizes is None:
        step_sizes = np.array([(hi-lo)*0.05 for lo, hi in bounds])

    params = start_params.copy()
    cost = quick_cost(params)
    history = [cost]

    for iteration in range(max_iter):
        improved = False
        for dim in range(len(params)):
            for direction in [1, -1]:
                new_params = params.copy()
                new_params[dim] += direction * step_sizes[dim]
                # Clamp to bounds
                new_params[dim] = np.clip(new_params[dim], bounds[dim][0], bounds[dim][1])
                new_cost = quick_cost(new_params)
                if new_cost < cost:
                    params = new_params
                    cost = new_cost
                    improved = True
                    break
            if improved:
                break

        history.append(cost)
        if not improved:
            step_sizes *= 0.7  # shrink steps
            if np.max(step_sizes) < 0.01:
                break

    return params, cost, history

# Run hill climbing from multiple starts
n_restarts = 30
hc_results = []
all_histories = []

for i in range(n_restarts):
    start = random_params()
    params, cost, history = hill_climb(start)
    hc_results.append((cost, params))
    all_histories.append(history)

hc_results.sort(key=lambda x: x[0])
best_hc_cost, best_hc_params = hc_results[0]

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Optimization: Random Search vs Hill Climbing', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Random search convergence
valid_costs = [c for c in random_costs if c < 1e5]
running_best = np.minimum.accumulate(valid_costs) if valid_costs else []
axes[0, 0].plot(running_best, color='#3b82f6', linewidth=1.5)
axes[0, 0].set_xlabel('Evaluations', color='white')
axes[0, 0].set_ylabel('Best cost found', color='white')
axes[0, 0].set_title(f'Random search (best: {best_random_cost:.1f})', color='white', fontsize=11)

# Hill climbing convergence (all restarts)
for i, hist in enumerate(all_histories[:15]):
    alpha = 0.3 if hc_results[i][0] > hc_results[0][0] * 1.5 else 0.8
    color = '#22c55e' if i == 0 else '#60a5fa'
    axes[0, 1].plot(hist, color=color, linewidth=1.5 if i == 0 else 0.8, alpha=alpha)

axes[0, 1].set_xlabel('Iterations', color='white')
axes[0, 1].set_ylabel('Cost', color='white')
axes[0, 1].set_title(f'Hill climbing ({n_restarts} restarts, best: {best_hc_cost:.1f})', color='white', fontsize=11)

# Distribution of final costs from restarts
final_costs = [c for c, _ in hc_results if c < 1e5]
axes[1, 0].hist(final_costs, bins=15, color='#a78bfa', alpha=0.8, edgecolor='white', linewidth=0.5)
axes[1, 0].axvline(best_hc_cost, color='#22c55e', linestyle='--', linewidth=2, label=f'Best: {best_hc_cost:.1f}')
axes[1, 0].set_xlabel('Final cost', color='white')
axes[1, 0].set_ylabel('Count', color='white')
axes[1, 0].set_title('Local minima distribution', color='white', fontsize=11)
axes[1, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Best schedule parameters comparison
param_names = ['Rate 1', 'Rate 2', 'Rate 3', 'Rate QZ', 'Rate Main', 'Peak T', 'Hold', 'Cool']
x = np.arange(len(param_names))
# Normalize to [0,1] for display
norm_random = [(best_random_params[i] - bounds[i][0]) / (bounds[i][1] - bounds[i][0]) for i in range(8)]
norm_hc = [(best_hc_params[i] - bounds[i][0]) / (bounds[i][1] - bounds[i][0]) for i in range(8)]

width = 0.35
axes[1, 1].bar(x - width/2, norm_random, width, color='#3b82f6', alpha=0.8, label='Random search')
axes[1, 1].bar(x + width/2, norm_hc, width, color='#22c55e', alpha=0.8, label='Hill climbing')
axes[1, 1].set_xticks(x)
axes[1, 1].set_xticklabels(param_names, color='white', fontsize=7, rotation=30)
axes[1, 1].set_ylabel('Normalized value (0=min, 1=max)', color='white')
axes[1, 1].set_title('Best parameters comparison', color='white', fontsize=11)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Optimization comparison:")
print(f"  Random search: cost = {best_random_cost:.1f}")
print(f"  Hill climbing:  cost = {best_hc_cost:.1f}")
print(f"  Improvement: {(best_random_cost - best_hc_cost) / best_random_cost * 100:.1f}%")
print(f"\\nBest schedule (hill climbing):")
for name, val, (lo, hi) in zip(param_names, best_hc_params, bounds):
    print(f"  {name:>12s}: {val:8.1f}  (range: {lo}-{hi})")`,
      challenge: 'Implement simulated annealing: start with a "temperature" of 100 that decays by 0.99 each iteration. Accept worse solutions with probability exp(-delta_cost / temperature). Does it find better solutions than pure hill climbing?',
      successHint: 'Hill climbing consistently beats random search because it uses gradient information (which direction improves cost). But it can get stuck. The distribution of local minima tells you how "rugged" the landscape is — and how much you need stochastic methods.',
    },
    {
      title: 'Multi-objective optimization — fuel, time, and quality tradeoffs',
      concept: `Real kiln optimization involves multiple competing objectives that cannot all be minimized simultaneously. Firing at a higher temperature produces stronger ceramics (lower porosity) but uses more fuel. Firing longer at a moderate temperature uses less peak fuel but more total time. These tradeoffs form a **Pareto front** — the set of solutions where improving one objective necessarily worsens another.

A solution is **Pareto optimal** (or non-dominated) if no other solution is better in all objectives simultaneously. The collection of all Pareto optimal solutions forms the Pareto front, which is a curve (in 2D) or surface (in higher dimensions). Decision-makers choose a point on this front based on their priorities: a village potter who gathers free firewood cares less about fuel cost but more about time. An industrial kiln operator cares about both fuel cost and throughput.

To find the Pareto front, we use the **weighted sum method** — solve the optimization problem multiple times with different weight combinations. Each weight combination produces a different Pareto optimal point. Alternatively, we can use **multi-objective evolutionary algorithms** like NSGA-II, which maintain a population of solutions and evolve them to spread across the Pareto front.

The concept of Pareto optimality extends far beyond kilns: it applies to any engineering design problem (aircraft: speed vs. fuel vs. range), economic policy (growth vs. equality vs. sustainability), and even personal decisions (salary vs. commute vs. job satisfaction).`,
      analogy: 'A Pareto front is like a menu at a restaurant where every dish is the best at something. The cheapest dish is not the tastiest, and the tastiest is not the cheapest. Every dish on the menu is "Pareto optimal" — you cannot find a dish that is both cheaper AND tastier. The dishes NOT on the menu are dominated — there exists something better in every way. Choosing from the menu is a matter of personal preference, not optimization.',
      storyConnection: 'Traditional potters in Assam implicitly navigate Pareto tradeoffs. A potter making water jugs fires at lower temperatures (less fuel) accepting higher porosity (which actually helps — the porous walls allow evaporative cooling). A potter making storage vessels fires hotter for impermeability. Each product sits at a different point on the Pareto front of fuel cost vs. ceramic density.',
      checkQuestion: 'If you have 3 objectives (fuel, time, porosity) and find 20 Pareto optimal solutions, does adding a fourth objective (maximum stress) typically increase or decrease the number of Pareto optimal solutions? Why?',
      checkAnswer: 'Adding a fourth objective INCREASES the number of Pareto optimal solutions. With more objectives, it becomes harder for one solution to dominate another (it must be better in ALL dimensions). In the extreme, with many objectives, almost every solution becomes Pareto optimal — a phenomenon called the "curse of dimensionality in multi-objective optimization." This is why real-world decisions with many criteria are so difficult.',
      codeIntro: 'Find and visualize the Pareto front for the kiln optimization problem across fuel, time, and quality objectives.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === KILN OPTIMIZER: Module 4 ===
# Multi-objective Pareto optimization

np.random.seed(42)

def evaluate_schedule(params):
    """Return (fuel, time, porosity) for a schedule."""
    rates = params[:5]
    peak_temp = params[5]
    hold_time = params[6]
    cool_rate = params[7]

    if peak_temp < 600 or peak_temp > 1400: return None
    if hold_time < 0.5 or hold_time > 10: return None
    if any(r < 5 for r in rates): return None

    # Time
    temps = [200, 400, 560, 590, peak_temp]
    current = 25; total_time = 0
    for i, target in enumerate(temps):
        total_time += (target - current) / max(rates[i], 10)
        current = target
    total_time += hold_time
    total_time += (peak_temp - 200) / max(cool_rate, 20)

    # Fuel
    avg_temp = (25 + peak_temp) / 2
    total_fuel = avg_temp / 800 * 5 * total_time

    # Porosity
    T_K = peak_temp + 273.15
    rate = 5e8 * np.exp(-250e3 / (8.314 * T_K))
    porosity = 0.40 * np.exp(-rate * hold_time)

    # Stress check
    max_rate = max(rates)
    if max_rate > 250:
        return None  # would crack

    return (total_fuel, total_time, porosity * 100)

# Generate large sample
bounds = [(30, 200), (30, 100), (30, 150), (10, 50), (50, 300), (800, 1300), (1, 8), (30, 200)]
n_samples = 10000
results = []
param_store = []

for _ in range(n_samples):
    p = np.array([np.random.uniform(lo, hi) for lo, hi in bounds])
    r = evaluate_schedule(p)
    if r is not None:
        results.append(r)
        param_store.append(p)

results = np.array(results)
param_store = np.array(param_store)
print(f"Valid schedules: {len(results)} out of {n_samples}")

# Find Pareto front
def is_dominated(point, others):
    """Check if point is dominated by any solution in others."""
    for other in others:
        if all(other[i] <= point[i] for i in range(len(point))) and any(other[i] < point[i] for i in range(len(point))):
            return True
    return False

# Fast Pareto: sort by first objective, then check
sorted_idx = np.argsort(results[:, 0])
pareto_mask = np.zeros(len(results), dtype=bool)

# Approximate: check against nearby solutions only
for i in range(len(results)):
    idx = sorted_idx[i]
    # Check against solutions with lower fuel
    dominated = False
    for j in range(max(0, i-100), i):
        jdx = sorted_idx[j]
        if (results[jdx, 0] <= results[idx, 0] and
            results[jdx, 1] <= results[idx, 1] and
            results[jdx, 2] <= results[idx, 2] and
            (results[jdx, 0] < results[idx, 0] or
             results[jdx, 1] < results[idx, 1] or
             results[jdx, 2] < results[idx, 2])):
            dominated = True
            break
    if not dominated:
        pareto_mask[idx] = True

pareto_points = results[pareto_mask]
pareto_params = param_store[pareto_mask]
print(f"Pareto optimal solutions: {len(pareto_points)}")

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Multi-Objective Kiln Optimization — Pareto Analysis', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Fuel vs Time, colored by porosity
sc1 = axes[0, 0].scatter(results[:, 0], results[:, 1], c=results[:, 2],
                          cmap='RdYlGn_r', s=5, alpha=0.3)
axes[0, 0].scatter(pareto_points[:, 0], pareto_points[:, 1], c='white',
                    s=30, edgecolors='#ef4444', linewidths=1.5, zorder=5, label='Pareto front')
plt.colorbar(sc1, ax=axes[0, 0], label='Porosity (%)')
axes[0, 0].set_xlabel('Total fuel (kg)', color='white')
axes[0, 0].set_ylabel('Total time (hours)', color='white')
axes[0, 0].set_title('Fuel vs Time (color = porosity)', color='white', fontsize=11)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Fuel vs Porosity
axes[0, 1].scatter(results[:, 0], results[:, 2], c=results[:, 1],
                    cmap='viridis', s=5, alpha=0.3)
axes[0, 1].scatter(pareto_points[:, 0], pareto_points[:, 2], c='white',
                    s=30, edgecolors='#ef4444', linewidths=1.5, zorder=5)
axes[0, 1].set_xlabel('Total fuel (kg)', color='white')
axes[0, 1].set_ylabel('Final porosity (%)', color='white')
axes[0, 1].set_title('Fuel vs Porosity', color='white', fontsize=11)

# Pareto front characteristics
if len(pareto_points) > 0:
    # Sort Pareto points by fuel for plotting
    sort_idx = np.argsort(pareto_points[:, 0])
    pf = pareto_points[sort_idx]
    axes[1, 0].plot(pf[:, 0], pf[:, 2], 'o-', color='#ef4444', linewidth=2, markersize=4)
    axes[1, 0].set_xlabel('Total fuel (kg)', color='white')
    axes[1, 0].set_ylabel('Final porosity (%)', color='white')
    axes[1, 0].set_title('Pareto front: fuel-porosity tradeoff', color='white', fontsize=11)

    # Annotate key points
    if len(pf) >= 3:
        # Lowest fuel
        axes[1, 0].annotate(f'Cheapest\\n({pf[0,0]:.0f}kg, {pf[0,2]:.1f}%)',
                            xy=(pf[0,0], pf[0,2]), color='#3b82f6', fontsize=8)
        # Best quality (lowest porosity)
        best_q = np.argmin(pf[:, 2])
        axes[1, 0].annotate(f'Best quality\\n({pf[best_q,0]:.0f}kg, {pf[best_q,2]:.1f}%)',
                            xy=(pf[best_q,0], pf[best_q,2]), color='#22c55e', fontsize=8)

# Parameter distributions along Pareto front
if len(pareto_params) > 0:
    pp = pareto_params[np.argsort(pareto_points[:, 0])]
    param_labels = ['Peak T (°C)', 'Hold (h)']
    param_idx = [5, 6]
    for i, (label, idx) in enumerate(zip(param_labels, param_idx)):
        color = '#f59e0b' if i == 0 else '#a78bfa'
        ax_twin = axes[1, 1] if i == 0 else axes[1, 1].twinx()
        vals = pp[:, idx]
        fuel_vals = pareto_points[np.argsort(pareto_points[:, 0]), 0]
        ax_twin.scatter(fuel_vals, vals, c=color, s=20, alpha=0.7, label=label)
        ax_twin.set_ylabel(label, color=color)
        ax_twin.tick_params(colors=color)

    axes[1, 1].set_xlabel('Fuel cost (along Pareto front)', color='white')
    axes[1, 1].set_title('How parameters change along Pareto front', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"\\nPareto analysis summary:")
print(f"  Total solutions evaluated: {len(results)}")
print(f"  Pareto optimal: {len(pareto_points)} ({len(pareto_points)/len(results)*100:.1f}%)")
if len(pareto_points) > 0:
    print(f"  Fuel range on front: {pareto_points[:,0].min():.0f} - {pareto_points[:,0].max():.0f} kg")
    print(f"  Porosity range: {pareto_points[:,2].min():.1f} - {pareto_points[:,2].max():.1f}%")
    print(f"  Time range: {pareto_points[:,1].min():.1f} - {pareto_points[:,1].max():.1f} hours")`,
      challenge: 'Add a fourth objective: maximum thermal stress (lower is better). How does the Pareto front change? With 4 objectives, what percentage of solutions become non-dominated?',
      successHint: 'Multi-objective optimization reveals that there is no single "best" firing schedule — only tradeoffs. This insight applies to every engineering design: the best solution depends on what you value most.',
    },
    {
      title: 'Sensitivity analysis and robustness — building reliable schedules',
      concept: `An optimized schedule that works perfectly under ideal conditions may fail catastrophically in practice. Real kilns have **uncertainty**: temperature control is imprecise (±20°C), clay composition varies between batches, wall thickness is not perfectly uniform, and ambient conditions (wind, humidity) affect heat loss. A schedule that sits exactly at the stress limit will fail 50% of the time if temperature fluctuates.

**Sensitivity analysis** quantifies how much the output (cost, porosity, stress) changes when each input varies. The **sensitivity coefficient** S_i = (ΔOutput/Output) / (ΔInput_i/Input_i) measures the fractional change in output per fractional change in input. A coefficient of 2 means a 1% change in that input causes a 2% change in output — that input is critical and must be controlled tightly.

**Robustness** means performing well despite uncertainty. A robust schedule has two properties: (1) the expected cost is low, and (2) the variance of cost under input perturbations is small. We can find robust schedules by optimizing the **mean + penalty × standard deviation** of cost across many Monte Carlo samples of uncertain inputs. This shifts the solution away from the theoretical optimum toward a design that works reliably in practice.

This is the difference between academic optimization and engineering: academics find the minimum of a perfect model; engineers find solutions that work when the model is wrong. The most robust schedule is rarely the most efficient — it trades a small amount of efficiency for a large amount of reliability.`,
      analogy: 'Sensitivity analysis is like earthquake-proofing a building. An architect could design the lightest possible structure that exactly meets code requirements — but if the earthquake is 5% stronger than expected, it collapses. Instead, they over-engineer: heavier beams, redundant supports, wider margins. The building costs 10% more but survives earthquakes 99.9% of the time instead of 50%.',
      storyConnection: 'The master potter in the story does not fire every load identically — adjustments are made for weather, clay moisture, kiln condition. This adaptive approach is robust optimization in action. A schedule that works only under perfect conditions is like a recipe that works only with one specific brand of flour — useful in a lab, useless in a village.',
      checkQuestion: 'If the optimal schedule has a cost of 100 with zero margin, and a robust schedule has a cost of 112 with 3-sigma margin against all uncertainties, which would you choose for a kiln load worth 500 in pottery value? Why?',
      checkAnswer: 'The robust schedule (cost 112) is clearly better. The optimal schedule (cost 100) saves 12 in fuel but has ~50% chance of failure at the stress boundary. A failed kiln load loses 500 in pottery. Expected cost: optimal = 100 + 0.5×500 = 350. Robust = 112 + 0.001×500 = 112.5. The robust schedule has expected cost of 112.5 vs 350 for the "optimal" one — a 68% improvement in expected outcome.',
      codeIntro: 'Perform sensitivity analysis on the optimized schedule and find a robust design that tolerates real-world uncertainty.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === KILN OPTIMIZER: Module 5 ===
# Sensitivity analysis and robust optimization

np.random.seed(42)

def simulate_with_uncertainty(base_params, uncertainties, n_monte_carlo=500):
    """Run Monte Carlo simulation with parameter uncertainty."""
    rates = base_params[:5]
    peak_temp = base_params[5]
    hold_time = base_params[6]
    cool_rate = base_params[7]

    results = {'fuel': [], 'time': [], 'porosity': [], 'stress': [], 'survived': []}

    for _ in range(n_monte_carlo):
        # Perturb parameters
        p_rates = rates * (1 + np.random.randn(5) * uncertainties['rate'])
        p_peak = peak_temp + np.random.randn() * uncertainties['temp']
        p_hold = hold_time * (1 + np.random.randn() * uncertainties['time'])
        p_cool = cool_rate * (1 + np.random.randn() * uncertainties['rate'])
        p_wall = 0.008 * (1 + np.random.randn() * uncertainties['thickness'])
        p_strength = 60e6 * (1 + np.random.randn() * uncertainties['strength'])

        # Clamp
        p_peak = np.clip(p_peak, 600, 1400)
        p_hold = np.clip(p_hold, 0.5, 12)
        p_rates = np.clip(p_rates, 10, 300)
        p_strength = np.clip(p_strength, 30e6, 100e6)

        # Calculate outputs
        temps = [200, 400, 560, 590, p_peak]
        current = 25; total_time = 0
        for i, target in enumerate(temps):
            total_time += (target - current) / max(p_rates[i], 10)
            current = target
        total_time += p_hold
        total_time += (p_peak - 200) / max(p_cool, 20)

        avg_temp = (25 + p_peak) / 2
        total_fuel = avg_temp / 800 * 5 * total_time

        T_K = p_peak + 273.15
        rate = 5e8 * np.exp(-250e3 / (8.314 * T_K))
        porosity = 0.40 * np.exp(-rate * p_hold) * 100

        max_rate = max(p_rates)
        delta_T = max_rate * p_wall / (1.0 / (1800 * 900)) * 0.0005
        stress = 70e9 * 7e-6 * min(delta_T, 200) / 0.75

        survived = stress < p_strength

        results['fuel'].append(total_fuel)
        results['time'].append(total_time)
        results['porosity'].append(porosity)
        results['stress'].append(stress / 1e6)
        results['survived'].append(survived)

    return {k: np.array(v) for k, v in results.items()}

# Nominal optimized schedule
nominal = np.array([120, 70, 100, 35, 180, 1050, 3.0, 120])

# Uncertainty levels
uncertainties = {
    'rate': 0.10,      # 10% uncertainty in heating rate control
    'temp': 25,        # 25°C uncertainty in peak temp
    'time': 0.08,      # 8% uncertainty in timing
    'thickness': 0.05, # 5% variation in wall thickness
    'strength': 0.15,  # 15% variation in material strength
}

# Run Monte Carlo
mc_results = simulate_with_uncertainty(nominal, uncertainties)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Kiln Schedule Sensitivity & Robustness Analysis', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Distribution of outcomes
for i, (key, color, title) in enumerate([
    ('fuel', '#a78bfa', 'Fuel consumption (kg)'),
    ('porosity', '#22c55e', 'Final porosity (%)'),
    ('stress', '#ef4444', 'Max stress (MPa)')
]):
    data = mc_results[key]
    axes[0, i].hist(data, bins=30, color=color, alpha=0.8, edgecolor='white', linewidth=0.3)
    axes[0, i].axvline(np.mean(data), color='white', linestyle='--', linewidth=2,
                        label=f'Mean: {np.mean(data):.1f}')
    axes[0, i].axvline(np.percentile(data, 95), color='#f59e0b', linestyle='--',
                        label=f'95th: {np.percentile(data, 95):.1f}')
    axes[0, i].set_xlabel(title, color='white')
    axes[0, i].set_ylabel('Count', color='white')
    axes[0, i].set_title(title, color='white', fontsize=11)
    axes[0, i].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

if key == 'stress':
    axes[0, 2].axvline(60, color='#ef4444', linestyle='-', linewidth=2, alpha=0.5, label='Nominal limit')

# Sensitivity tornado chart
base_fuel = np.mean(mc_results['fuel'])
param_names = ['Heating rate', 'Peak temp', 'Hold time', 'Wall thickness', 'Material strength']
sensitivities = []

for param, unc_key in [('rate', 'rate'), ('temp', 'temp'), ('time', 'time'),
                        ('thickness', 'thickness'), ('strength', 'strength')]:
    # Perturb only this parameter
    partial_unc = {k: 0 for k in uncertainties}
    partial_unc[unc_key] = uncertainties[unc_key]
    partial_result = simulate_with_uncertainty(nominal, partial_unc, n_monte_carlo=200)
    sensitivity = np.std(partial_result['fuel']) / base_fuel * 100
    sensitivities.append(sensitivity)

sorted_idx = np.argsort(sensitivities)
axes[1, 0].barh([param_names[i] for i in sorted_idx],
                 [sensitivities[i] for i in sorted_idx],
                 color='#f59e0b', alpha=0.8)
axes[1, 0].set_xlabel('Sensitivity (% std / mean fuel)', color='white')
axes[1, 0].set_title('Tornado chart: parameter sensitivity', color='white', fontsize=11)

# Survival rate as function of safety margin
margins = np.linspace(0.5, 2.0, 20)  # multiplier on nominal rates (slower = more margin)
survival_rates = []

for margin in margins:
    safe_params = nominal.copy()
    safe_params[:5] = nominal[:5] / margin  # slower heating
    mc = simulate_with_uncertainty(safe_params, uncertainties, n_monte_carlo=300)
    survival = np.mean(mc['survived']) * 100
    survival_rates.append(survival)

axes[1, 1].plot(margins, survival_rates, 'o-', color='#22c55e', linewidth=2, markersize=5)
axes[1, 1].axhline(99, color='#f59e0b', linestyle='--', alpha=0.7, label='99% target')
axes[1, 1].set_xlabel('Safety margin (slowdown factor)', color='white')
axes[1, 1].set_ylabel('Survival rate (%)', color='white')
axes[1, 1].set_title('Reliability vs safety margin', color='white', fontsize=11)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Find the margin needed for 99% survival
target_99 = margins[np.argmin(np.abs(np.array(survival_rates) - 99))]

# Cost of robustness
costs_at_margins = []
for margin in margins:
    safe_params = nominal.copy()
    safe_params[:5] = nominal[:5] / margin
    mc = simulate_with_uncertainty(safe_params, uncertainties, n_monte_carlo=200)
    costs_at_margins.append(np.mean(mc['fuel']))

axes[1, 2].plot(survival_rates, costs_at_margins, 'o-', color='#a78bfa', linewidth=2, markersize=5)
axes[1, 2].set_xlabel('Survival rate (%)', color='white')
axes[1, 2].set_ylabel('Average fuel cost (kg)', color='white')
axes[1, 2].set_title('Cost of robustness', color='white', fontsize=11)
axes[1, 2].axvline(99, color='#f59e0b', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()

survival_pct = np.mean(mc_results['survived']) * 100
print(f"Robustness analysis:")
print(f"  Nominal survival rate: {survival_pct:.1f}%")
print(f"  Safety margin for 99% survival: {target_99:.2f}x slowdown")
print(f"  Fuel cost at 99% survival: {costs_at_margins[np.argmin(np.abs(np.array(survival_rates)-99))]:.0f} kg")
print(f"\\nMost sensitive parameter: {param_names[sorted_idx[-1]]}")
print(f"Least sensitive parameter: {param_names[sorted_idx[0]]}")`,
      challenge: 'Implement a robust optimizer that minimizes mean + 2×std of cost across 100 Monte Carlo samples. How does the robust optimum differ from the nominal optimum?',
      successHint: 'Sensitivity analysis is the bridge between theory and practice. A model that ignores uncertainty is a toy; a model that quantifies uncertainty is a tool. This capstone taught you to build tools.',
    },
    {
      title: 'Complete Kiln Temperature Optimizer — integration and dashboard',
      concept: `In this final lesson, you integrate all components into a complete **Kiln Temperature Optimizer** with a dashboard that accepts user inputs (clay type, desired ceramic type, wall thickness) and outputs the recommended firing schedule with full analysis.

The integrated system works as follows: (1) The user specifies the clay composition and desired final properties (target porosity, minimum strength). (2) The optimizer generates candidate schedules using hill climbing with random restarts. (3) Each candidate is evaluated using the thermal model (heat transfer + sintering kinetics) and scored by the multi-objective cost function. (4) The best schedules are subjected to Monte Carlo sensitivity analysis to verify robustness. (5) The dashboard displays the recommended schedule, predicted outcomes, risk analysis, and Pareto alternatives.

This architecture — **specify → optimize → verify → present** — is the standard pattern for any engineering design automation system. The same flow applies to designing aircraft wings, drug dosages, supply chains, or financial portfolios. The domain-specific knowledge lives in the models (thermal physics, sintering kinetics); the optimization and uncertainty analysis are general-purpose tools.

What you have built is a genuine decision support system. It does not replace the potter's judgment — it augments it. The potter provides knowledge that the model cannot capture (aesthetic goals, market preferences, available fuel types), while the model provides quantitative analysis that human intuition cannot compute (exact stress distributions, sintering trajectories, Pareto tradeoffs).`,
      analogy: 'The complete optimizer is like a GPS navigation system. The driver (potter) sets the destination (desired ceramic) and constraints (fuel budget, time). The GPS (optimizer) calculates routes (schedules), evaluates traffic (uncertainties), and recommends the best path. But the driver makes the final call — maybe they want to stop for coffee (aesthetic choice) or avoid a highway (tradition). The tool informs; the human decides.',
      storyConnection: 'The little potter at the end of the story does not just follow tradition blindly — they understand why each step matters and can adapt when conditions change. Your optimizer encodes the same understanding in mathematical form: not rigid rules, but flexible principles that respond to any input. This is the deepest lesson of the story — mastery is not memorizing steps, it is understanding the reasons behind them.',
      checkQuestion: 'If your optimizer recommends a schedule that saves 15% fuel compared to the traditional method but requires temperature control within ±10°C (versus the traditional ±30°C), is the recommendation practical for a village potter? What additional information would you need?',
      checkAnswer: 'It depends on the kiln technology. A traditional wood-fired kiln has ±30-50°C natural variation; a gas kiln achieves ±10°C easily; an electric kiln can hold ±2°C. The recommendation is practical only if the potter has (or can afford) equipment that meets the control requirement. Additional information needed: kiln type, available fuel, temperature monitoring equipment, and the potter willingness to change established practices. Engineering optimization must always consider implementation context.',
      codeIntro: 'Build the integrated optimizer dashboard that ties together all previous modules.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === KILN TEMPERATURE OPTIMIZER: Complete Dashboard ===

np.random.seed(42)

class CeramicOptimizer:
    """Complete kiln firing optimization system."""

    CLAY_TYPES = {
        'Earthenware (Assam red)': {'k': 0.9, 'rho': 1750, 'cp': 920, 'alpha_th': 8e-6,
                                      'E': 60e9, 'sigma_t': 50e6, 'sinter_E': 230e3},
        'Stoneware blend': {'k': 1.1, 'rho': 1900, 'cp': 880, 'alpha_th': 6.5e-6,
                            'E': 75e9, 'sigma_t': 70e6, 'sinter_E': 270e3},
        'Porcelain (kaolin-rich)': {'k': 1.4, 'rho': 2100, 'cp': 820, 'alpha_th': 5.5e-6,
                                      'E': 95e9, 'sigma_t': 90e6, 'sinter_E': 290e3},
    }

    TARGETS = {
        'Cooking pot': {'porosity': 20, 'min_strength': 30, 'budget': 'low'},
        'Water jug': {'porosity': 15, 'min_strength': 40, 'budget': 'low'},
        'Storage vessel': {'porosity': 5, 'min_strength': 80, 'budget': 'medium'},
        'Decorative piece': {'porosity': 2, 'min_strength': 100, 'budget': 'high'},
        'Porcelain ware': {'porosity': 0.5, 'min_strength': 150, 'budget': 'high'},
    }

    def __init__(self, clay_type, target_product, wall_mm=8):
        self.clay = self.CLAY_TYPES[clay_type]
        self.target = self.TARGETS[target_product]
        self.wall = wall_mm / 1000
        self.clay_name = clay_type
        self.product_name = target_product

    def cost(self, params):
        rates, peak, hold, cool = params[:5], params[5], params[6], params[7]
        if peak < 600 or peak > 1400 or hold < 0.5 or hold > 10: return 1e6
        if any(r < 5 for r in rates) or rates[3] > 50: return 1e6

        temps = [200, 400, 560, 590, peak]
        current = 25; total_time = 0
        for i, t in enumerate(temps):
            total_time += (t - current) / max(rates[i], 10)
            current = t
        total_time += hold + (peak - 200) / max(cool, 20)

        fuel = (25 + peak) / 2 / 800 * 5 * total_time
        T_K = peak + 273.15
        rate = 5e8 * np.exp(-self.clay['sinter_E'] / (8.314 * T_K))
        porosity = 0.40 * np.exp(-rate * hold) * 100
        strength = 200 * np.exp(-5 * porosity / 100)

        # Stress
        max_rate = max(rates)
        dT = max_rate * self.wall * self.clay['rho'] * self.clay['cp'] / self.clay['k'] * 0.0003
        stress = self.clay['E'] * self.clay['alpha_th'] * min(dT, 200) / (1 - 0.25)

        por_pen = max(0, porosity - self.target['porosity']) * 50
        str_pen = max(0, self.target['min_strength'] - strength) * 10
        crack_pen = max(0, stress - self.clay['sigma_t']) / 1e6 * 500

        return fuel + total_time * 0.5 + por_pen + str_pen + crack_pen

    def optimize(self, n_restarts=40, max_iter=150):
        bounds = [(30,200),(30,100),(30,150),(10,50),(50,300),(800,1300),(1,8),(30,200)]
        best_cost = 1e6; best_params = None

        for _ in range(n_restarts):
            p = np.array([np.random.uniform(lo, hi) for lo, hi in bounds])
            c = self.cost(p)
            steps = np.array([(hi-lo)*0.05 for lo, hi in bounds])

            for _ in range(max_iter):
                improved = False
                for d in range(8):
                    for sign in [1, -1]:
                        pn = p.copy(); pn[d] += sign * steps[d]
                        pn[d] = np.clip(pn[d], bounds[d][0], bounds[d][1])
                        cn = self.cost(pn)
                        if cn < c: p, c = pn, cn; improved = True; break
                    if improved: break
                if not improved: steps *= 0.7
                if np.max(steps) < 0.01: break

            if c < best_cost: best_cost = c; best_params = p.copy()

        return best_params, best_cost

    def analyze(self, params, n_mc=300):
        rates, peak, hold, cool = params[:5], params[5], params[6], params[7]
        fuels, porosities, stresses, survivals = [], [], [], []

        for _ in range(n_mc):
            pr = rates * (1 + np.random.randn(5) * 0.10)
            pp = peak + np.random.randn() * 20
            ph = hold * (1 + np.random.randn() * 0.08)
            pc = cool * (1 + np.random.randn() * 0.10)
            ps = self.clay['sigma_t'] * (1 + np.random.randn() * 0.15)

            pr = np.clip(pr, 10, 300); pp = np.clip(pp, 600, 1400)
            ph = np.clip(ph, 0.5, 12); ps = np.clip(ps, 20e6, 150e6)

            temps = [200, 400, 560, 590, pp]
            cur = 25; tt = 0
            for i, t in enumerate(temps):
                tt += (t - cur) / max(pr[i], 10); cur = t
            tt += ph + (pp - 200) / max(pc, 20)

            fuel = (25 + pp) / 2 / 800 * 5 * tt
            T_K = pp + 273.15
            r = 5e8 * np.exp(-self.clay['sinter_E'] / (8.314 * T_K))
            por = 0.40 * np.exp(-r * ph) * 100
            mr = max(pr)
            dT = mr * self.wall * self.clay['rho'] * self.clay['cp'] / self.clay['k'] * 0.0003
            stress = self.clay['E'] * self.clay['alpha_th'] * min(dT, 200) / 0.75

            fuels.append(fuel); porosities.append(por)
            stresses.append(stress/1e6); survivals.append(stress < ps)

        return {k: np.array(v) for k, v in
                {'fuel': fuels, 'porosity': porosities, 'stress': stresses, 'survived': survivals}.items()}

# === RUN THE OPTIMIZER ===
print("=" * 60)
print("  KILN TEMPERATURE OPTIMIZER")
print("=" * 60)

configs = [
    ('Earthenware (Assam red)', 'Cooking pot'),
    ('Stoneware blend', 'Storage vessel'),
    ('Porcelain (kaolin-rich)', 'Decorative piece'),
]

all_results = {}
for clay, product in configs:
    opt = CeramicOptimizer(clay, product)
    params, cost = opt.optimize()
    analysis = opt.analyze(params)
    all_results[(clay, product)] = {'params': params, 'cost': cost, 'analysis': analysis, 'opt': opt}
    print(f"\\n{clay} → {product}:")
    print(f"  Peak temp: {params[5]:.0f}°C, Hold: {params[6]:.1f}h")
    print(f"  Survival rate: {np.mean(analysis['survived'])*100:.1f}%")
    print(f"  Mean porosity: {np.mean(analysis['porosity']):.1f}%")

# Dashboard visualization
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Kiln Temperature Optimizer — Dashboard', color='white', fontsize=16, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = ['#ef4444', '#3b82f6', '#22c55e']

# 1. Optimized schedules overlay
for i, ((clay, product), data) in enumerate(all_results.items()):
    p = data['params']
    temps = [25, 200, 400, 560, 590, p[5], p[5]]
    times = [0]
    current = 25
    for j, t in enumerate(temps[1:6]):
        times.append(times[-1] + (t - current) / max(p[j] if j < 5 else 100, 10))
        current = t
    times.append(times[-1] + p[6])

    axes[0, 0].plot(times, temps, color=colors[i], linewidth=2, label=f'{product}')
    axes[0, 0].scatter([times[-1]], [temps[-1]], color=colors[i], s=80, zorder=5)

axes[0, 0].axhline(573, color='gray', linestyle='--', alpha=0.3)
axes[0, 0].set_xlabel('Time (hours)', color='white')
axes[0, 0].set_ylabel('Temperature (°C)', color='white')
axes[0, 0].set_title('Optimized firing schedules', color='white', fontsize=11)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2. Porosity distributions
for i, ((clay, product), data) in enumerate(all_results.items()):
    axes[0, 1].hist(data['analysis']['porosity'], bins=25, color=colors[i],
                     alpha=0.5, label=product, edgecolor='white', linewidth=0.3)
    target = data['opt'].target['porosity']
    axes[0, 1].axvline(target, color=colors[i], linestyle='--', linewidth=1.5)

axes[0, 1].set_xlabel('Final porosity (%)', color='white')
axes[0, 1].set_title('Porosity distributions', color='white', fontsize=11)
axes[0, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3. Survival rates
products = [p for _, p in configs]
survival_rates = [np.mean(all_results[c]['analysis']['survived'])*100 for c in all_results]
bar_colors = [c if s > 95 else '#f59e0b' for c, s in zip(colors, survival_rates)]
axes[0, 2].bar(products, survival_rates, color=bar_colors, alpha=0.8, edgecolor='white', linewidth=0.5)
axes[0, 2].axhline(95, color='#22c55e', linestyle='--', alpha=0.7, label='95% target')
axes[0, 2].set_ylabel('Survival rate (%)', color='white')
axes[0, 2].set_title('Reliability analysis', color='white', fontsize=11)
axes[0, 2].set_ylim(80, 102)
axes[0, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4. Parameter comparison
param_names = ['Rate1', 'Rate2', 'Rate3', 'RateQZ', 'RateMain', 'Peak', 'Hold', 'Cool']
x = np.arange(len(param_names))
width = 0.25
for i, ((clay, product), data) in enumerate(all_results.items()):
    p = data['params']
    bounds = [(30,200),(30,100),(30,150),(10,50),(50,300),(800,1300),(1,8),(30,200)]
    normed = [(p[j] - bounds[j][0]) / (bounds[j][1] - bounds[j][0]) for j in range(8)]
    axes[1, 0].bar(x + i*width - width, normed, width, color=colors[i], alpha=0.8, label=product)

axes[1, 0].set_xticks(x)
axes[1, 0].set_xticklabels(param_names, color='white', fontsize=7, rotation=30)
axes[1, 0].set_ylabel('Normalized parameter', color='white')
axes[1, 0].set_title('Schedule parameters', color='white', fontsize=11)
axes[1, 0].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5. Cost breakdown
categories = ['Fuel', 'Time', 'Quality', 'Safety']
for i, ((clay, product), data) in enumerate(all_results.items()):
    a = data['analysis']
    vals = [np.mean(a['fuel']), data['params'][6] * 2,
            np.mean(a['porosity']), (1-np.mean(a['survived']))*100]
    angles = np.linspace(0, 2*np.pi, len(categories), endpoint=False)
    vals_norm = [v / max(v, 1) for v in vals]  # crude normalize
    axes[1, 1].plot(np.append(angles, angles[0]), np.append(vals_norm, vals_norm[0]),
                     color=colors[i], linewidth=2, label=product)

axes[1, 1].set_title('Multi-dimensional comparison', color='white', fontsize=11)
axes[1, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6. Summary table
cell_text = []
for (clay, product), data in all_results.items():
    p = data['params']
    a = data['analysis']
    cell_text.append([
        product[:12],
        f"{p[5]:.0f}°C",
        f"{p[6]:.1f}h",
        f"{np.mean(a['fuel']):.0f}kg",
        f"{np.mean(a['porosity']):.1f}%",
        f"{np.mean(a['survived'])*100:.0f}%"
    ])

axes[1, 2].axis('off')
table = axes[1, 2].table(cellText=cell_text,
    colLabels=['Product', 'Peak T', 'Hold', 'Fuel', 'Porosity', 'Survival'],
    cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for cell in table.get_celld().values():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
axes[1, 2].set_title('Optimization summary', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("\\n" + "=" * 60)
print("  OPTIMIZATION COMPLETE")
print("=" * 60)
print("\\nThe Kiln Temperature Optimizer combines:")
print("  1. Thermal physics (heat transfer, sintering)")
print("  2. Optimization algorithms (hill climbing, random restarts)")
print("  3. Multi-objective analysis (Pareto fronts)")
print("  4. Uncertainty quantification (Monte Carlo)")
print("  5. Decision support (dashboard visualization)")
print("\\nThis is the same architecture used in industrial process control.")`,
      challenge: 'Add a fourth configuration: "Porcelain (kaolin-rich)" making "Porcelain ware". This requires the highest firing temperature and lowest porosity. Does the optimizer find a viable schedule, or are the constraints too tight for the given clay properties?',
      successHint: 'You built a complete engineering design tool from first principles. The little potter shaped clay by hand; you shaped a kiln schedule by mathematics. Both require understanding the material — the difference is that your understanding scales to any clay, any kiln, any product.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Kiln Temperature Optimizer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Optimize firing schedules using physics and algorithms</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete kiln optimization system. Click to load Python.</p>
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
