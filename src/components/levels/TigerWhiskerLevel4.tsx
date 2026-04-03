import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TigerWhiskerLevel4() {
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
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
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
      title: 'Step 1: Define the whisker sensor hardware model',
      concept: `Our capstone project is a **Vibration Sensor Simulator** — a complete computational model of a whisker-like sensor for robotic applications. Robots exploring dark environments (collapsed buildings, underwater caves, planetary surfaces) need touch sensors that work where cameras fail. We will design, simulate, and optimize an artificial whisker sensor inspired by the tiger.

The core hardware is a **PVDF piezoelectric bimorph cantilever** — a flexible beam with two layers of PVDF film bonded to a stainless steel shim. When the beam bends, one PVDF layer compresses and the other stretches, generating equal and opposite voltages that add together (series connection). This doubles the sensitivity compared to a single layer.

Key design parameters we must choose:
- **Length**: Determines sensitivity and resonant frequency. Longer = more sensitive but slower response.
- **Width**: Affects both sensitivity and robustness. Wider = more charge output but more rigid.
- **PVDF thickness**: Thicker = more charge per strain but stiffer beam.
- **Shim thickness**: The steel core provides mechanical stiffness. Thicker shim = higher resonant frequency but lower sensitivity.
- **Whisker attachment**: A thin, tapered fiber (like a real whisker) extends from the cantilever tip, amplifying deflections through lever action.

In this step, we define all hardware parameters and build the electromechanical transfer function.`,
      analogy: 'Designing the sensor hardware is like designing a microphone. You must choose the diaphragm material (how sensitive), the housing size (what frequency range), the electronics (how to amplify), and the connector (how to interface). Each choice affects performance. A studio microphone and a phone microphone use the same physics but wildly different design points. Our whisker sensor similarly requires tuning all parameters for the target application.',
      storyConnection: 'The tiger\'s whisker hardware was "designed" by evolution: keratin fiber (the whisker), blood-filled follicle (the housing), mechanoreceptors (the transducer), and myelinated nerves (the signal cable). Our robotic version translates each biological component: steel fiber whisker, PVDF cantilever base, charge amplifier circuit, and digital data bus. Same architecture, different materials.',
      checkQuestion: 'A PVDF bimorph is 30 mm long, 5 mm wide, with 28 um PVDF layers and a 50 um steel shim. If the tip deflects 100 um under a 1 mN load, what is the tip stiffness?',
      checkAnswer: 'Tip stiffness k = F / delta = 1e-3 N / 100e-6 m = 10 N/m. This is about 100x stiffer than a tiger whisker (which has k ~ 0.01-0.1 N/m). The robotic version trades some sensitivity for mechanical robustness — a design choice. You could make it more sensitive by using a longer, thinner beam, but it would be more fragile.',
      codeIntro: 'Build the electromechanical model of a PVDF bimorph whisker sensor and calculate key performance parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === VIBRATION SENSOR SIMULATOR: Step 1 — Hardware Model ===

class WhiskerSensor:
    """PVDF bimorph cantilever whisker sensor model."""

    def __init__(self, name="Default Whisker"):
        self.name = name
        # PVDF properties
        self.d31 = 23e-12  # C/N (piezo charge constant)
        self.E_pvdf = 2.5e9  # Pa (PVDF Young's modulus)
        self.rho_pvdf = 1780  # kg/m^3
        self.eps_r = 12  # Relative permittivity
        self.eps_0 = 8.854e-12  # F/m

        # Steel shim properties
        self.E_steel = 200e9  # Pa
        self.rho_steel = 7800  # kg/m^3

        # Default geometry
        self.L = 0.030  # 30 mm cantilever length
        self.w = 0.005  # 5 mm width
        self.t_pvdf = 28e-6  # 28 um PVDF thickness (each layer)
        self.t_shim = 50e-6  # 50 um steel shim

        # Whisker fiber
        self.L_whisker = 0.080  # 80 mm fiber length
        self.r_whisker = 0.25e-3  # 0.5 mm diameter fiber
        self.E_whisker = 2e9  # Nylon/steel fiber

    def total_thickness(self):
        return 2 * self.t_pvdf + self.t_shim

    def flexural_rigidity(self):
        """EI for composite beam (simplified rule of mixtures)."""
        t = self.total_thickness()
        # Approximate: weighted average E times I
        E_avg = (2 * self.E_pvdf * self.t_pvdf + self.E_steel * self.t_shim) / t
        I = self.w * t**3 / 12
        return E_avg * I

    def mass_per_length(self):
        t = self.total_thickness()
        rho_avg = (2 * self.rho_pvdf * self.t_pvdf + self.rho_steel * self.t_shim) / t
        return rho_avg * self.w * t

    def resonant_frequency(self, mode=1):
        lambdas = [1.875, 4.694, 7.855, 10.996]
        lam = lambdas[mode - 1]
        EI = self.flexural_rigidity()
        m_per_L = self.mass_per_length()
        return (lam**2 / (2 * np.pi * self.L**2)) * np.sqrt(EI / m_per_L)

    def tip_stiffness(self):
        EI = self.flexural_rigidity()
        return 3 * EI / self.L**3

    def capacitance(self):
        """Sensor capacitance (two PVDF layers in series)."""
        C_single = self.eps_r * self.eps_0 * self.L * self.w / self.t_pvdf
        return C_single / 2  # Series connection

    def charge_sensitivity(self):
        """Charge per unit tip force (C/N)."""
        # For bimorph: Q = d31 * L * F / t_total (simplified)
        t = self.total_thickness()
        return self.d31 * self.L / t

    def voltage_sensitivity(self):
        """Open-circuit voltage per unit tip force (V/N)."""
        return self.charge_sensitivity() / self.capacitance()

    def min_detectable_force(self, noise_uV=10, amp_gain=1000):
        """Minimum force for SNR = 3."""
        V_noise = noise_uV * 1e-6  # Referred to input
        V_per_N = self.voltage_sensitivity()
        F_min = 3 * V_noise / (V_per_N * amp_gain / amp_gain)  # SNR = 3
        return F_min

    def lever_amplification(self):
        """Force amplification from whisker fiber lever."""
        return self.L_whisker / self.L

# Create several design variants
designs = [
    {'name': 'Compact (20mm)', 'L': 0.020, 'w': 0.003, 'L_w': 0.05},
    {'name': 'Standard (30mm)', 'L': 0.030, 'w': 0.005, 'L_w': 0.08},
    {'name': 'Sensitive (50mm)', 'L': 0.050, 'w': 0.005, 'L_w': 0.12},
    {'name': 'Ultra-long (80mm)', 'L': 0.080, 'w': 0.008, 'L_w': 0.15},
]

sensors = []
for d in designs:
    s = WhiskerSensor(d['name'])
    s.L = d['L']
    s.w = d['w']
    s.L_whisker = d['L_w']
    sensors.append(s)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

# Plot 1: Sensor cross-section
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

s = sensors[1]  # Standard design
y_positions = [0, s.t_pvdf, s.t_pvdf + s.t_shim]
heights = [s.t_pvdf, s.t_shim, s.t_pvdf]
layer_names = ['PVDF (top)', 'Steel shim', 'PVDF (bottom)']
layer_colors = ['#22c55e', '#94a3b8', '#22c55e']

for y, h, name, color in zip(y_positions, heights, layer_names, layer_colors):
    ax.barh(0, s.L * 1000, height=h * 1e6, left=0, bottom=y * 1e6,
            color=color, alpha=0.7, edgecolor='white', linewidth=0.5)
    ax.text(s.L * 500, (y + h/2) * 1e6, f'{name} ({h*1e6:.0f}um)',
            ha='center', va='center', color='white', fontsize=7)

# Draw whisker fiber
ax.plot([s.L * 1000, (s.L + s.L_whisker) * 1000],
        [s.total_thickness()/2 * 1e6, s.total_thickness()/2 * 1e6],
        color='#f59e0b', linewidth=2)
ax.text((s.L + s.L_whisker/2) * 1000, s.total_thickness() * 1e6 + 5,
        f'Whisker fiber ({s.L_whisker*1000:.0f}mm)', color='#f59e0b', fontsize=8, ha='center')

ax.set_xlabel('Length (mm)', color='white')
ax.set_ylabel('Thickness (um)', color='white')
ax.set_title('Sensor cross-section', color='white', fontsize=11)

# Plot 2: Resonant frequency vs cantilever length
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

L_range = np.linspace(0.010, 0.100, 100)
for mode in [1, 2, 3]:
    freqs = []
    for Li in L_range:
        s_temp = WhiskerSensor()
        s_temp.L = Li
        freqs.append(s_temp.resonant_frequency(mode))
    ax.semilogy(L_range * 1000, freqs, linewidth=2,
                label=f'Mode {mode}', color=colors[mode - 1])

# Mark our designs
for s, color in zip(sensors, colors):
    f1 = s.resonant_frequency(1)
    ax.scatter(s.L * 1000, f1, c=color, s=100, zorder=5, edgecolors='white', linewidths=2)
    ax.annotate(s.name.split('(')[0].strip(), (s.L * 1000, f1),
                textcoords="offset points", xytext=(5, 10), color=color, fontsize=7)

ax.set_xlabel('Cantilever length (mm)', color='white')
ax.set_ylabel('Frequency (Hz)', color='white')
ax.set_title('Resonant frequency vs length', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Sensitivity vs length
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

sensitivities = []
for Li in L_range:
    s_temp = WhiskerSensor()
    s_temp.L = Li
    sensitivities.append(s_temp.voltage_sensitivity())

ax.semilogy(L_range * 1000, sensitivities, color='#a855f7', linewidth=2)
ax.set_xlabel('Cantilever length (mm)', color='white')
ax.set_ylabel('Voltage sensitivity (V/N)', color='white')
ax.set_title('Sensitivity vs length', color='white', fontsize=11)

for s, color in zip(sensors, colors):
    ax.scatter(s.L * 1000, s.voltage_sensitivity(), c=color, s=100, zorder=5, edgecolors='white')

# Plot 4: Design comparison table as bar chart
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

metrics = ['f0 (Hz)', 'k (N/m)', 'Sens (V/N)', 'Min F (uN)']
metric_vals = []
for s in sensors:
    metric_vals.append([
        s.resonant_frequency(1),
        s.tip_stiffness(),
        s.voltage_sensitivity(),
        s.min_detectable_force() * 1e6,
    ])

# Normalize each metric
metric_arr = np.array(metric_vals)
metric_norm = metric_arr / metric_arr.max(axis=0)

x_m = np.arange(len(metrics))
width = 0.2
for i, (s, color) in enumerate(zip(sensors, colors)):
    ax.bar(x_m + i * width, metric_norm[i], width, color=color, alpha=0.8,
           label=s.name)

ax.set_xticks(x_m + width * 1.5)
ax.set_xticklabels(metrics, color='white', fontsize=8)
ax.set_ylabel('Normalized value', color='white')
ax.set_title('Design comparison (normalized)', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Frequency-sensitivity tradeoff
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for s, color in zip(sensors, colors):
    ax.scatter(s.resonant_frequency(1), s.voltage_sensitivity(),
               c=color, s=200, zorder=5, edgecolors='white', linewidths=2)
    ax.annotate(s.name, (s.resonant_frequency(1), s.voltage_sensitivity()),
                textcoords="offset points", xytext=(10, 5), color=color, fontsize=8)

# Trend line
f_trend = [s.resonant_frequency(1) for s in sensors]
s_trend = [s.voltage_sensitivity() for s in sensors]
ax.plot(sorted(f_trend), [s_trend[i] for i in np.argsort(f_trend)],
        '--', color='gray', alpha=0.5)

ax.set_xlabel('Resonant frequency (Hz)', color='white')
ax.set_ylabel('Voltage sensitivity (V/N)', color='white')
ax.set_title('Speed vs sensitivity tradeoff', color='white', fontsize=11)
ax.set_xscale('log')
ax.set_yscale('log')

# Plot 6: Lever amplification effect
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

L_fiber_range = np.linspace(0.02, 0.20, 100)
for s, color in zip(sensors, colors):
    amplification = L_fiber_range / s.L
    effective_sens = s.voltage_sensitivity() * amplification
    ax.plot(L_fiber_range * 1000, effective_sens, color=color, linewidth=2,
            label=s.name)

ax.set_xlabel('Whisker fiber length (mm)', color='white')
ax.set_ylabel('Effective sensitivity (V/N at fiber tip)', color='white')
ax.set_title('Lever amplification by fiber', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("=== VIBRATION SENSOR SIMULATOR: Hardware Model ===")
print()
print(f"{'Design':<20} {'f0 (Hz)':>10} {'k (N/m)':>10} {'V/N':>12} {'Min F (uN)':>12} {'Lever':>8}")
print("-" * 76)
for s in sensors:
    print(f"{s.name:<20} {s.resonant_frequency(1):>10.0f} {s.tip_stiffness():>10.2f} "
          f"{s.voltage_sensitivity():>12.2f} {s.min_detectable_force()*1e6:>12.1f} "
          f"{s.lever_amplification():>8.1f}x")
print()
print("The standard 30mm design balances sensitivity and speed.")
print("Adding the 80mm whisker fiber gives 2.7x lever amplification.")`,
      challenge: 'Explore the effect of PVDF thickness on the frequency-sensitivity tradeoff. Plot both metrics vs PVDF thickness from 10um to 100um. Is there an optimal thickness?',
      successHint: 'The hardware model captures all the key physics: beam mechanics, piezoelectric transduction, and lever amplification. This is the foundation — every subsequent step builds on these parameters.',
    },
    {
      title: 'Step 2: Simulate dynamic vibration response',
      concept: `With the hardware defined, we need to simulate how the sensor responds to real-world vibrations. This requires solving the equation of motion for a damped cantilever beam driven by an external force:

m_eff * x_ddot + c * x_dot + k * x = F(t)

where m_eff is the effective mass (approximately 0.24 * total_mass for the first mode of a cantilever), c is the damping coefficient, k is the tip stiffness, and F(t) is the driving force at the whisker tip.

The damping coefficient c is related to the quality factor: c = sqrt(m_eff * k) / Q. For PVDF bimorphs, Q is typically 10-30 in air and 3-10 in water (water provides more viscous damping).

For the simulation, we use the **Newmark-beta** integration method — a standard algorithm for structural dynamics that is more accurate than simple Euler integration for oscillatory systems. Newmark-beta uses acceleration at both the current and next timestep, giving second-order accuracy.

The voltage output at each timestep is proportional to the strain rate at the base of the cantilever, which is proportional to the velocity of the tip: V(t) = S * x_dot(t), where S is the sensor\'s velocity sensitivity in V/(m/s). This is because PVDF generates charge proportional to strain rate, not strain — it is inherently a velocity sensor, like the lanceolate receptors in a tiger\'s whisker.`,
      analogy: 'The cantilever vibration simulation is like modeling a diving board. Someone jumps on the end (impulse force), and the board oscillates up and down, gradually settling due to air resistance. The frequency of oscillation depends on the board\'s stiffness and the jumper\'s weight. Our simulation predicts exactly how the board (cantilever) moves and what voltage the piezo element generates at each moment.',
      storyConnection: 'When a tiger sweeps its whisker across a textured surface, the whisker vibrates at frequencies determined by the texture spacing and sweep speed. Each vibration cycle is a tiny version of the diving board scenario — deflect, oscillate, damp, repeat. Our simulator models exactly this process, predicting the voltage signal that the sensor electronics would receive.',
      checkQuestion: 'A cantilever sensor has k = 5 N/m, effective mass = 0.001 kg, and Q = 15. What is the damping coefficient c?',
      checkAnswer: 'c = sqrt(m * k) / Q = sqrt(0.001 * 5) / 15 = sqrt(0.005) / 15 = 0.0707 / 15 = 0.00471 Ns/m. The damping ratio zeta = 1/(2Q) = 0.033 — very underdamped. The sensor will ring for about 15 cycles after an impulse, which is useful for detecting resonant vibrations but problematic for resolving rapid sequences of contacts.',
      codeIntro: 'Implement Newmark-beta time integration for the whisker cantilever and simulate responses to impulse, sinusoidal, and textured surface stimuli.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === VIBRATION SENSOR SIMULATOR: Step 2 — Dynamic Response ===

class DynamicWhisker:
    """Dynamic simulation of PVDF whisker cantilever."""

    def __init__(self, k=5.0, m_eff=0.001, Q=15, V_sensitivity=0.5):
        self.k = k  # N/m
        self.m = m_eff  # kg
        self.Q = Q
        self.omega_n = np.sqrt(k / m_eff)
        self.f_n = self.omega_n / (2 * np.pi)
        self.c = np.sqrt(m_eff * k) / Q  # damping coefficient
        self.V_sens = V_sensitivity  # V/(m/s)

    def simulate_newmark(self, F_func, dt, t_total):
        """Newmark-beta integration (beta=0.25, gamma=0.5 — unconditionally stable)."""
        beta = 0.25
        gamma = 0.5
        n_steps = int(t_total / dt)
        t = np.arange(n_steps) * dt

        x = np.zeros(n_steps)  # displacement
        v = np.zeros(n_steps)  # velocity
        a = np.zeros(n_steps)  # acceleration
        V = np.zeros(n_steps)  # voltage output

        # Initial conditions
        F0 = F_func(0)
        a[0] = (F0 - self.c * v[0] - self.k * x[0]) / self.m

        # Effective stiffness for Newmark
        k_eff = self.k + gamma / (beta * dt) * self.c + 1 / (beta * dt**2) * self.m

        for i in range(n_steps - 1):
            F_next = F_func(t[i + 1])

            # Predictor
            a1 = 1 / (beta * dt**2) * self.m + gamma / (beta * dt) * self.c
            a2 = 1 / (beta * dt) * self.m + (gamma / beta - 1) * self.c
            a3 = (1 / (2 * beta) - 1) * self.m + dt * (gamma / (2 * beta) - 1) * self.c

            F_eff = F_next + a1 * x[i] + a2 * v[i] + a3 * a[i]

            x[i + 1] = F_eff / k_eff
            v[i + 1] = (gamma / (beta * dt)) * (x[i + 1] - x[i]) + (1 - gamma / beta) * v[i] + dt * (1 - gamma / (2 * beta)) * a[i]
            a[i + 1] = (1 / (beta * dt**2)) * (x[i + 1] - x[i]) - 1 / (beta * dt) * v[i] - (1 / (2 * beta) - 1) * a[i]

            V[i + 1] = self.V_sens * v[i + 1]

        return t, x, v, a, V

# Create standard whisker sensor
sensor = DynamicWhisker(k=5.0, m_eff=0.001, Q=15, V_sensitivity=0.5)
dt = 1e-5  # 10 us timestep

# Test stimulus 1: Impulse
def impulse(t):
    return 0.01 if 0.001 < t < 0.0015 else 0  # 10 mN for 0.5 ms

# Test stimulus 2: Sinusoidal at resonance
def sine_resonance(t):
    return 0.001 * np.sin(2 * np.pi * sensor.f_n * t)  # 1 mN at f_n

# Test stimulus 3: Sinusoidal off-resonance
def sine_off_res(t):
    return 0.001 * np.sin(2 * np.pi * sensor.f_n * 0.3 * t)  # 1 mN at 0.3*f_n

# Test stimulus 4: Texture (series of bumps)
def texture(t):
    bump_freq = 200  # bumps per second (texture frequency)
    phase = t * bump_freq
    if phase % 1 < 0.1:  # Short contact pulses
        return 0.005 * np.sin(np.pi * (phase % 1) / 0.1)
    return 0

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Impulse response
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

t1, x1, v1, a1, V1 = sensor.simulate_newmark(impulse, dt, 0.05)
ax.plot(t1 * 1000, V1 * 1000, color='#22c55e', linewidth=1)
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Voltage (mV)', color='white')
ax.set_title(f'Impulse response (f_n={sensor.f_n:.0f} Hz, Q={sensor.Q})', color='white', fontsize=11)

# Mark decay envelope
envelope = np.abs(V1) * np.exp(-sensor.c / (2 * sensor.m) * (t1 - 0.001))
# Not plotting envelope to keep it clean

# Plot 2: Resonance vs off-resonance
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

t2, x2, v2, a2, V2 = sensor.simulate_newmark(sine_resonance, dt, 0.1)
t3, x3, v3, a3, V3 = sensor.simulate_newmark(sine_off_res, dt, 0.1)

ax.plot(t2 * 1000, V2 * 1000, color='#ef4444', linewidth=1, label=f'At resonance ({sensor.f_n:.0f} Hz)')
ax.plot(t3 * 1000, V3 * 1000, color='#3b82f6', linewidth=1, label=f'Off resonance ({sensor.f_n*0.3:.0f} Hz)')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Voltage (mV)', color='white')
ax.set_title('Resonance amplification', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

ratio = np.max(np.abs(V2)) / max(np.max(np.abs(V3)), 1e-10)
ax.text(50, np.max(V2) * 800, f'Amplification: {ratio:.1f}x', color='white', fontsize=9,
        bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#ef4444'))

# Plot 3: Texture scanning response
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

t4, x4, v4, a4, V4 = sensor.simulate_newmark(texture, dt, 0.05)
ax.plot(t4 * 1000, V4 * 1000, color='#f59e0b', linewidth=1)
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Voltage (mV)', color='white')
ax.set_title('Texture scanning (200 bumps/s)', color='white', fontsize=11)

# Plot 4: Frequency response (computed from transfer function)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

f_range = np.linspace(1, sensor.f_n * 3, 1000)
omega = 2 * np.pi * f_range
H = 1.0 / np.sqrt((sensor.k - sensor.m * omega**2)**2 + (sensor.c * omega)**2)
H_dB = 20 * np.log10(H / np.max(H))

ax.plot(f_range, H_dB, color='#a855f7', linewidth=2)
ax.axvline(sensor.f_n, color='#ef4444', linestyle='--', alpha=0.5, label=f'f_n = {sensor.f_n:.0f} Hz')
ax.axhline(-3, color='gray', linestyle=':', alpha=0.5, label='-3 dB')
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Gain (dB)', color='white')
ax.set_title('Transfer function |H(f)|', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Effect of Q factor
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

Q_values = [3, 10, 20, 50]
q_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

for Q_val, color in zip(Q_values, q_colors):
    s_q = DynamicWhisker(k=5.0, m_eff=0.001, Q=Q_val, V_sensitivity=0.5)
    t_q, _, _, _, V_q = s_q.simulate_newmark(impulse, dt, 0.05)
    ax.plot(t_q * 1000, V_q * 1000, color=color, linewidth=1, label=f'Q={Q_val}')

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Voltage (mV)', color='white')
ax.set_title('Q factor: sensitivity vs speed', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Spectrogram of texture response
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Compute FFT of texture response
fft_vals = np.abs(np.fft.rfft(V4))
fft_freqs = np.fft.rfftfreq(len(V4), d=dt)

ax.semilogy(fft_freqs, fft_vals, color='#06b6d4', linewidth=1)
ax.axvline(sensor.f_n, color='#ef4444', linestyle='--', alpha=0.5, label=f'f_n = {sensor.f_n:.0f} Hz')
ax.axvline(200, color='#f59e0b', linestyle='--', alpha=0.5, label='Texture freq (200 Hz)')
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('FFT magnitude', color='white')
ax.set_title('Spectrum of texture response', color='white', fontsize=11)
ax.set_xlim(0, sensor.f_n * 3)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("=== Dynamic Vibration Response ===")
print(f"Sensor: k={sensor.k} N/m, m={sensor.m*1000:.1f}g, f_n={sensor.f_n:.0f} Hz, Q={sensor.Q}")
print()
print(f"Impulse response: peak voltage = {np.max(np.abs(V1))*1000:.2f} mV")
print(f"Resonance response: peak = {np.max(np.abs(V2))*1000:.2f} mV")
print(f"Off-resonance response: peak = {np.max(np.abs(V3))*1000:.2f} mV")
print(f"Resonance amplification: {ratio:.1f}x")
print()
print("The sensor naturally amplifies vibrations near its resonant frequency.")
print("This is the same frequency selectivity that tiger whiskers use.")`,
      challenge: 'Simulate the sensor response to a chirp signal (frequency sweeping from 10 Hz to 500 Hz over 0.5 seconds). Find the frequency at which the response peaks — it should match f_n. This is how you experimentally measure a sensor\'s resonant frequency.',
      successHint: 'The Newmark-beta integrator gives you accurate, stable dynamics. You can now predict exactly what signal the sensor produces for any input force. This is essential for designing the signal processing that comes next.',
    },
    {
      title: 'Step 3: Signal conditioning and feature extraction',
      concept: `The raw voltage from the piezoelectric sensor is small, noisy, and difficult to interpret directly. **Signal conditioning** transforms this raw signal into clean, meaningful data that a robot's brain (microcontroller) can use for decisions.

The signal conditioning chain has four stages:

1. **Charge amplifier**: Converts the piezoelectric charge to a voltage with low impedance. The gain is set by a feedback capacitor: V_out = -Q_in / C_fb. This eliminates the cable capacitance problem that plagues high-impedance piezo signals.

2. **Band-pass filter**: Removes low-frequency drift (from temperature changes, slow mechanical creep) and high-frequency noise (electromagnetic interference, ADC aliasing). Typical passband: 10 Hz to 2 kHz for a whisker sensor.

3. **Envelope detection**: For texture discrimination, the raw oscillating signal is less useful than its **envelope** — the slowly-varying amplitude. The envelope is extracted using rectification followed by low-pass filtering (or the Hilbert transform). The envelope tells you "how rough is this surface?" without needing to track individual vibration cycles.

4. **Feature extraction**: From the conditioned signal, we compute features for classification: RMS amplitude, dominant frequency, spectral centroid, zero-crossing rate, and temporal pattern. These features form a vector that uniquely identifies each surface type — exactly like the population coding in the tiger\'s barrel cortex.`,
      analogy: 'Signal conditioning is like the audio processing chain in a recording studio. The microphone outputs a tiny, noisy signal (like the raw piezo voltage). A preamp boosts it (charge amplifier). An equalizer removes unwanted frequencies (band-pass filter). A compressor smooths the dynamics (envelope detector). And finally, an analyzer shows frequency content (feature extraction). Without this chain, the raw mic signal would be useless for music production — and our raw piezo signal would be useless for robot sensing.',
      storyConnection: 'The tiger\'s neural processing chain does exactly the same thing: mechanoreceptors (sensor) feed into the trigeminal ganglion (preamp), brainstem nuclei (filter and feature extraction), and barrel cortex (classification). Each stage transforms the signal from raw to refined. Our electronic signal conditioning is a direct analog of this biological processing pipeline.',
      checkQuestion: 'A charge amplifier with feedback capacitor C_fb = 100 pF receives a charge of 50 pC from the piezo sensor. What is the output voltage? If the ADC has 12-bit resolution over 0-3.3V range, is this signal resolvable?',
      checkAnswer: 'V_out = Q / C_fb = 50e-12 / 100e-12 = 0.5 V. The ADC resolution is 3.3V / 4096 = 0.8 mV per bit. The 0.5V signal spans 0.5 / 0.0008 = 625 ADC counts, giving about 9.3 bits of effective resolution. This is excellent for most applications. If the signal were smaller (say 5 pC), the output would be only 50 mV = 62 counts (6 bits), which would need more amplification.',
      codeIntro: 'Build the complete signal conditioning pipeline: charge amplifier, band-pass filter, envelope detection, and feature extraction.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === VIBRATION SENSOR SIMULATOR: Step 3 — Signal Conditioning ===
np.random.seed(42)

def generate_whisker_signal(surface_type, duration=0.5, fs=10000):
    """Generate realistic whisker sensor voltage for different surfaces."""
    t = np.arange(0, duration, 1/fs)
    n = len(t)
    f_resonance = 180  # Hz (sensor resonant frequency)

    if surface_type == 'smooth_metal':
        # Very low amplitude, mostly noise
        signal = 0.0001 * np.sin(2 * np.pi * f_resonance * t) * np.exp(-t * 5)
        signal += 0.00005 * np.random.randn(n)

    elif surface_type == 'rough_concrete':
        # High amplitude, broadband
        bumps = np.zeros(n)
        for bump_t in np.random.uniform(0, duration, 100):
            idx = int(bump_t * fs)
            width = int(0.002 * fs)
            if idx + width < n:
                bumps[idx:idx+width] += np.random.uniform(0.001, 0.005) * np.sin(np.pi * np.arange(width) / width)
        signal = np.convolve(bumps, np.exp(-np.arange(500) / 50) * np.sin(2 * np.pi * f_resonance * np.arange(500) / fs), mode='same')
        signal += 0.0001 * np.random.randn(n)

    elif surface_type == 'human_skin':
        # Soft, low-freq deformation
        signal = 0.0005 * np.sin(2 * np.pi * 10 * t)  # Slow sweep
        signal += 0.0002 * np.sin(2 * np.pi * 1.2 * t)  # Heartbeat!
        signal += 0.00005 * np.random.randn(n)

    elif surface_type == 'tree_bark':
        # Periodic ridges + randomness
        ridge_freq = 80  # ridges per second at scan speed
        signal = 0.002 * np.sin(2 * np.pi * ridge_freq * t)
        signal *= (1 + 0.5 * np.sin(2 * np.pi * 3 * t))  # amplitude modulation
        # Add resonance ringing after each ridge
        for i in range(0, n, int(fs / ridge_freq)):
            if i + 500 < n:
                ring = np.exp(-np.arange(500) / 80) * np.sin(2 * np.pi * f_resonance * np.arange(500) / fs)
                signal[i:i+500] += 0.001 * ring
        signal += 0.0001 * np.random.randn(n)

    # Add realistic noise
    signal += 0.00002 * np.sin(2 * np.pi * 50 * t)  # 50Hz mains hum
    signal += 0.00003 * np.sin(2 * np.pi * 5000 * t)  # High-freq EMI

    return t, signal

def charge_amplifier(signal, gain=10):
    """Model charge amplifier (gain in V/V)."""
    return signal * gain

def bandpass_filter(signal, fs, f_low=10, f_high=2000, order=4):
    """Simple band-pass filter using FFT."""
    n = len(signal)
    fft = np.fft.rfft(signal)
    freqs = np.fft.rfftfreq(n, d=1/fs)
    # Butterworth-like response
    H = 1.0 / (1 + (f_low / (freqs + 1e-10))**(2*order))
    H *= 1.0 / (1 + (freqs / f_high)**(2*order))
    filtered = np.fft.irfft(fft * H, n=n)
    return filtered

def envelope_detect(signal, fs, cutoff=50):
    """Envelope detection: rectify + low-pass filter."""
    rectified = np.abs(signal)
    # Low-pass filter
    n = len(rectified)
    fft = np.fft.rfft(rectified)
    freqs = np.fft.rfftfreq(n, d=1/fs)
    H = 1.0 / (1 + (freqs / cutoff)**4)
    envelope = np.fft.irfft(fft * H, n=n)
    return envelope

def extract_features(signal, fs):
    """Extract classification features from conditioned signal."""
    features = {}
    features['rms'] = np.sqrt(np.mean(signal**2))
    features['peak'] = np.max(np.abs(signal))
    features['crest_factor'] = features['peak'] / (features['rms'] + 1e-10)

    # Spectral features
    fft = np.abs(np.fft.rfft(signal))
    freqs = np.fft.rfftfreq(len(signal), d=1/fs)
    fft_norm = fft / (np.sum(fft) + 1e-10)

    features['spectral_centroid'] = np.sum(freqs * fft_norm)
    features['spectral_bandwidth'] = np.sqrt(np.sum((freqs - features['spectral_centroid'])**2 * fft_norm))

    # Zero crossing rate
    features['zcr'] = np.sum(np.abs(np.diff(np.sign(signal)))) / (2 * len(signal))

    # Envelope statistics
    env = envelope_detect(signal, fs)
    features['env_mean'] = np.mean(env)
    features['env_std'] = np.std(env)

    return features

surfaces = {
    'Smooth metal': ('smooth_metal', '#3b82f6'),
    'Rough concrete': ('rough_concrete', '#ef4444'),
    'Human skin': ('human_skin', '#f59e0b'),
    'Tree bark': ('tree_bark', '#22c55e'),
}

fs = 10000

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Raw signals
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for i, (name, (stype, color)) in enumerate(surfaces.items()):
    t, sig = generate_whisker_signal(stype, fs=fs)
    ax.plot(t[:2000] * 1000, sig[:2000] * 1000 + i * 3, color=color, linewidth=0.8, label=name)

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Voltage (mV, offset)', color='white')
ax.set_title('Raw sensor signals', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: After signal conditioning
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

conditioned_signals = {}
for i, (name, (stype, color)) in enumerate(surfaces.items()):
    t, sig = generate_whisker_signal(stype, fs=fs)
    amp = charge_amplifier(sig, gain=10)
    filt = bandpass_filter(amp, fs)
    conditioned_signals[name] = (t, filt)
    ax.plot(t[:2000] * 1000, filt[:2000] * 1000 + i * 20, color=color, linewidth=0.8, label=name)

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Voltage (mV, offset)', color='white')
ax.set_title('After conditioning (amp + BPF)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Envelopes
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for name, (stype, color) in surfaces.items():
    t, filt = conditioned_signals[name]
    env = envelope_detect(filt, fs)
    ax.plot(t * 1000, env * 1000, color=color, linewidth=2, label=name)

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Envelope (mV)', color='white')
ax.set_title('Envelope detection', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Spectra comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for name, (stype, color) in surfaces.items():
    _, filt = conditioned_signals[name]
    fft = np.abs(np.fft.rfft(filt))
    freqs = np.fft.rfftfreq(len(filt), d=1/fs)
    ax.semilogy(freqs[:2000], fft[:2000], color=color, linewidth=1, alpha=0.8, label=name)

ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('FFT magnitude', color='white')
ax.set_title('Frequency spectra', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 2000)

# Plot 5: Feature comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

all_features = {}
for name, (stype, color) in surfaces.items():
    _, filt = conditioned_signals[name]
    all_features[name] = extract_features(filt, fs)

feature_names = ['rms', 'spectral_centroid', 'zcr', 'env_std']
feature_display = ['RMS', 'Spec. centroid', 'ZCR', 'Env. variability']

feat_matrix = np.zeros((len(surfaces), len(feature_names)))
for i, name in enumerate(surfaces):
    for j, fn in enumerate(feature_names):
        feat_matrix[i, j] = all_features[name][fn]

# Normalize
feat_norm = feat_matrix / (feat_matrix.max(axis=0) + 1e-10)

x_f = np.arange(len(feature_names))
width = 0.2
for i, (name, (_, color)) in enumerate(surfaces.items()):
    ax.bar(x_f + i * width, feat_norm[i], width, color=color, alpha=0.8, label=name)

ax.set_xticks(x_f + width * 1.5)
ax.set_xticklabels(feature_display, color='white', fontsize=8)
ax.set_ylabel('Normalized value', color='white')
ax.set_title('Feature vectors', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Signal conditioning pipeline diagram
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

stages = ['Raw\\npiezo', 'Charge\\namp', 'Band-pass\\nfilter', 'Envelope\\ndetect', 'Feature\\nextract']
snr_improvement = [1, 10, 25, 30, 50]  # Approximate SNR at each stage
stage_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

bars = ax.bar(range(len(stages)), snr_improvement, color=stage_colors, alpha=0.8)
ax.set_xticks(range(len(stages)))
ax.set_xticklabels(stages, color='white', fontsize=8)
ax.set_ylabel('Signal-to-noise ratio', color='white')
ax.set_title('SNR through pipeline', color='white', fontsize=11)

for bar, snr in zip(bars, snr_improvement):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{snr}x', ha='center', va='bottom', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("=== Signal Conditioning Results ===")
print()
print(f"{'Surface':<20} {'RMS (mV)':>10} {'Centroid':>10} {'ZCR':>8} {'Env Std':>10}")
print("-" * 62)
for name in surfaces:
    f = all_features[name]
    print(f"{name:<20} {f['rms']*1000:>10.3f} {f['spectral_centroid']:>10.0f} {f['zcr']:>8.4f} {f['env_std']*1000:>10.3f}")
print()
print("Each surface has a distinct feature fingerprint.")
print("These features enable automatic surface classification.")`,
      challenge: 'Add an adaptive threshold that automatically detects "contact" vs "no contact" from the envelope signal. Use this to segment the continuous scan into individual contact events and extract features per event rather than per sweep.',
      successHint: 'The signal conditioning pipeline transforms noisy analog signals into clean digital features. This is the bridge between the physical sensor and the digital classifier. Every real sensor system — from medical devices to autonomous vehicles — uses exactly this pipeline.',
    },
    {
      title: 'Step 4: Surface classification with machine learning',
      concept: `With clean features extracted from the whisker sensor, we can now build a classifier that automatically identifies what surface the robot is touching. This is the computational equivalent of the tiger\'s barrel cortex — pattern recognition from tactile data.

We will implement a **k-Nearest Neighbors (k-NN) classifier** and a **simple neural network** from scratch, comparing their performance on whisker sensor data.

k-NN is the simplest classifier: given a new feature vector, find the k closest training examples (using Euclidean distance) and vote on the class. It requires no training — just store all examples. But it scales poorly with large datasets.

The neural network learns a compact decision boundary. We implement a single hidden layer network: input features -> hidden neurons (with ReLU activation) -> output probabilities (softmax). Training uses **gradient descent** on the cross-entropy loss.

For our whisker application, the key challenge is **generalization**: the robot must identify surfaces it has seen before even when the scan speed, contact pressure, or ambient noise differs slightly. We test this by adding random variations to the test data that were not present in the training data.`,
      analogy: 'Training a surface classifier is like teaching a blind person to identify fabrics by touch. You give them samples: "this is silk, feel it... this is burlap, feel it... this is cotton." After enough examples, they can identify new samples they have never felt before, because they have learned the underlying features (smoothness, roughness, elasticity) rather than memorizing specific samples. Our classifier does the same — it learns what makes concrete feel different from metal, not the specific voltage values.',
      storyConnection: 'The tiger cub learns to identify surfaces through experience. Each time it brushes its whiskers against bark, fur, rock, or water, its barrel cortex strengthens the neural connections that map those sensory patterns to categories. After weeks of exploration, it can instantly identify any surface by touch. Our classifier compresses this months-long biological learning process into seconds of computation.',
      checkQuestion: 'A k-NN classifier with k=5 receives a test sample. The 5 nearest neighbors are: concrete, concrete, metal, concrete, bark. What is the classification? What if k=3?',
      checkAnswer: 'With k=5: concrete wins with 3/5 votes (60%). With k=3: the 3 nearest are concrete, concrete, metal, so concrete wins with 2/3 votes (67%). k=3 gives higher confidence in this case because it ignores the more distant bark neighbor. In general, smaller k captures local structure (risking noise sensitivity), larger k smooths the boundary (risking loss of detail). k=5 to 15 is usually a good range.',
      codeIntro: 'Build a k-NN classifier and a neural network from scratch, train on whisker sensor data, and evaluate accuracy with cross-validation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === VIBRATION SENSOR SIMULATOR: Step 4 — Surface Classification ===
np.random.seed(42)

def generate_training_data(n_samples=50):
    """Generate labeled training data for 4 surface types."""
    # Each surface has characteristic feature ranges
    surface_params = {
        0: {'name': 'Smooth metal', 'rms': (0.02, 0.08), 'centroid': (100, 300),
            'zcr': (0.01, 0.05), 'env_std': (0.01, 0.04), 'color': '#3b82f6'},
        1: {'name': 'Rough concrete', 'rms': (0.3, 0.8), 'centroid': (400, 800),
            'zcr': (0.15, 0.35), 'env_std': (0.2, 0.5), 'color': '#ef4444'},
        2: {'name': 'Human skin', 'rms': (0.05, 0.15), 'centroid': (20, 80),
            'zcr': (0.02, 0.08), 'env_std': (0.03, 0.1), 'color': '#f59e0b'},
        3: {'name': 'Tree bark', 'rms': (0.15, 0.45), 'centroid': (150, 400),
            'zcr': (0.08, 0.2), 'env_std': (0.1, 0.3), 'color': '#22c55e'},
    }

    X, y = [], []
    for label, params in surface_params.items():
        for _ in range(n_samples):
            features = [
                np.random.uniform(*params['rms']),
                np.random.uniform(*params['centroid']),
                np.random.uniform(*params['zcr']),
                np.random.uniform(*params['env_std']),
            ]
            X.append(features)
            y.append(label)

    return np.array(X), np.array(y), surface_params

X, y, params = generate_training_data(80)

# Normalize features
X_mean = X.mean(axis=0)
X_std = X.std(axis=0)
X_norm = (X - X_mean) / X_std

# Train/test split (80/20)
n = len(X)
idx = np.random.permutation(n)
n_train = int(0.8 * n)
X_train, X_test = X_norm[idx[:n_train]], X_norm[idx[n_train:]]
y_train, y_test = y[idx[:n_train]], y[idx[n_train:]]

# === k-NN Classifier ===
def knn_predict(X_train, y_train, X_test, k=5):
    predictions = []
    for x in X_test:
        distances = np.sqrt(np.sum((X_train - x)**2, axis=1))
        nearest = np.argsort(distances)[:k]
        votes = y_train[nearest]
        counts = np.bincount(votes, minlength=4)
        predictions.append(np.argmax(counts))
    return np.array(predictions)

# === Simple Neural Network ===
class SimpleNN:
    def __init__(self, n_input, n_hidden, n_output):
        # Xavier initialization
        self.W1 = np.random.randn(n_input, n_hidden) * np.sqrt(2.0 / n_input)
        self.b1 = np.zeros(n_hidden)
        self.W2 = np.random.randn(n_hidden, n_output) * np.sqrt(2.0 / n_hidden)
        self.b2 = np.zeros(n_output)

    def relu(self, x):
        return np.maximum(0, x)

    def softmax(self, x):
        exp_x = np.exp(x - np.max(x, axis=1, keepdims=True))
        return exp_x / np.sum(exp_x, axis=1, keepdims=True)

    def forward(self, X):
        self.z1 = X @ self.W1 + self.b1
        self.a1 = self.relu(self.z1)
        self.z2 = self.a1 @ self.W2 + self.b2
        self.probs = self.softmax(self.z2)
        return self.probs

    def loss(self, probs, y):
        n = len(y)
        log_probs = -np.log(probs[np.arange(n), y] + 1e-10)
        return np.mean(log_probs)

    def backward(self, X, y, lr=0.01):
        n = len(y)
        # Output gradient
        dz2 = self.probs.copy()
        dz2[np.arange(n), y] -= 1
        dz2 /= n

        dW2 = self.a1.T @ dz2
        db2 = np.sum(dz2, axis=0)

        da1 = dz2 @ self.W2.T
        dz1 = da1 * (self.z1 > 0)  # ReLU gradient

        dW1 = X.T @ dz1
        db1 = np.sum(dz1, axis=0)

        self.W1 -= lr * dW1
        self.b1 -= lr * db1
        self.W2 -= lr * dW2
        self.b2 -= lr * db2

    def predict(self, X):
        probs = self.forward(X)
        return np.argmax(probs, axis=1)

# Train neural network
nn = SimpleNN(4, 16, 4)
losses = []
train_accs = []
test_accs = []

for epoch in range(200):
    probs = nn.forward(X_train)
    loss = nn.loss(probs, y_train)
    nn.backward(X_train, y_train, lr=0.1)
    losses.append(loss)

    train_pred = nn.predict(X_train)
    test_pred = nn.predict(X_test)
    train_accs.append(np.mean(train_pred == y_train))
    test_accs.append(np.mean(test_pred == y_test))

# k-NN results for different k
k_values = [1, 3, 5, 7, 11, 15]
knn_accs = [np.mean(knn_predict(X_train, y_train, X_test, k) == y_test) for k in k_values]

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Feature space (2D projection)
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for label, p in params.items():
    mask = y == label
    ax.scatter(X_norm[mask, 0], X_norm[mask, 1], c=p['color'], s=20,
               alpha=0.6, label=p['name'])

ax.set_xlabel('RMS (normalized)', color='white')
ax.set_ylabel('Spectral centroid (normalized)', color='white')
ax.set_title('Feature space (2 of 4 dims)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Training loss and accuracy
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(losses, color='#ef4444', linewidth=2, label='Loss')
ax2 = ax.twinx()
ax2.plot(train_accs, color='#22c55e', linewidth=1.5, label='Train acc')
ax2.plot(test_accs, color='#3b82f6', linewidth=1.5, label='Test acc')
ax2.tick_params(colors='gray')
ax2.set_ylabel('Accuracy', color='white')

ax.set_xlabel('Epoch', color='white')
ax.set_ylabel('Loss', color='#ef4444')
ax.set_title('Neural network training', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: k-NN accuracy vs k
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(k_values, [a * 100 for a in knn_accs], 'o-', color='#a855f7', linewidth=2, markersize=8)
ax.set_xlabel('k (number of neighbors)', color='white')
ax.set_ylabel('Test accuracy (%)', color='white')
ax.set_title('k-NN: accuracy vs k', color='white', fontsize=11)

best_k = k_values[np.argmax(knn_accs)]
ax.axvline(best_k, color='#22c55e', linestyle='--', alpha=0.5,
           label=f'Best k={best_k} ({max(knn_accs)*100:.0f}%)')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Confusion matrix (NN)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

nn_pred = nn.predict(X_test)
conf_matrix = np.zeros((4, 4), dtype=int)
for true, pred in zip(y_test, nn_pred):
    conf_matrix[true, pred] += 1

im = ax.imshow(conf_matrix, cmap='Blues')
surface_names = [params[i]['name'].split()[0] for i in range(4)]
ax.set_xticks(range(4))
ax.set_xticklabels(surface_names, color='white', fontsize=8, rotation=30)
ax.set_yticks(range(4))
ax.set_yticklabels(surface_names, color='white', fontsize=8)
ax.set_xlabel('Predicted', color='white')
ax.set_ylabel('Actual', color='white')
ax.set_title(f'NN confusion matrix ({np.mean(nn_pred == y_test)*100:.0f}% acc)', color='white', fontsize=11)

for i in range(4):
    for j in range(4):
        ax.text(j, i, str(conf_matrix[i, j]), ha='center', va='center',
                color='white' if conf_matrix[i, j] > 2 else 'gray', fontsize=10)

# Plot 5: Model comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

models = ['k-NN (k=5)', 'Neural Net', 'Tiger whisker\\n(estimated)']
accuracies = [knn_accs[2] * 100, test_accs[-1] * 100, 98]  # Tiger estimate
model_colors = ['#a855f7', '#22c55e', '#f59e0b']

bars = ax.bar(range(len(models)), accuracies, color=model_colors, alpha=0.8)
ax.set_xticks(range(len(models)))
ax.set_xticklabels(models, color='white', fontsize=9)
ax.set_ylabel('Classification accuracy (%)', color='white')
ax.set_title('Model comparison', color='white', fontsize=11)
ax.set_ylim(0, 105)

for bar, acc in zip(bars, accuracies):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{acc:.0f}%', ha='center', va='bottom', color='white', fontsize=10)

# Plot 6: Decision boundaries (2D slice)
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Create grid in 2D
x_range = np.linspace(X_norm[:, 0].min() - 1, X_norm[:, 0].max() + 1, 100)
y_range = np.linspace(X_norm[:, 1].min() - 1, X_norm[:, 1].max() + 1, 100)
xx, yy = np.meshgrid(x_range, y_range)
grid = np.column_stack([xx.ravel(), yy.ravel(),
                        np.zeros(len(xx.ravel())), np.zeros(len(xx.ravel()))])

Z = nn.predict(grid).reshape(xx.shape)
color_map = np.zeros((*Z.shape, 3))
for label, p in params.items():
    hex_c = p['color'].lstrip('#')
    rgb = tuple(int(hex_c[i:i+2], 16) / 255 for i in (0, 2, 4))
    color_map[Z == label] = rgb

ax.imshow(color_map, extent=[x_range[0], x_range[-1], y_range[0], y_range[-1]],
          origin='lower', alpha=0.3, aspect='auto')
for label, p in params.items():
    mask = y == label
    ax.scatter(X_norm[mask, 0], X_norm[mask, 1], c=p['color'], s=15,
               edgecolors='none', alpha=0.7)

ax.set_xlabel('Feature 1', color='white')
ax.set_ylabel('Feature 2', color='white')
ax.set_title('NN decision boundaries', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("=== Surface Classification Results ===")
print(f"Training samples: {n_train}, Test samples: {n - n_train}")
print(f"Features: 4 (RMS, spectral centroid, ZCR, envelope std)")
print()
print(f"k-NN (k={best_k}): {max(knn_accs)*100:.1f}% test accuracy")
print(f"Neural Network: {test_accs[-1]*100:.1f}% test accuracy")
print(f"Training epochs: 200, Final loss: {losses[-1]:.4f}")
print()
print("Confusion matrix shows which surfaces are confused most often.")
print("The classifier can identify surfaces from whisker vibrations alone.")`,
      challenge: 'Add Gaussian noise to the test features (simulating varying scan conditions) and measure how accuracy degrades. At what noise level does accuracy drop below 80%? This tells you the system\'s robustness — how much environmental variation it can tolerate.',
      successHint: 'From raw vibrations to automatic surface identification — this is the tactile perception pipeline for robots. The same approach is used in prosthetic hands, industrial quality control, and planetary rovers. You have built the brain for the whisker sensor.',
    },
    {
      title: 'Step 5: Multi-sensor array and spatial mapping',
      concept: `A single whisker sensor identifies what surface it is touching. But for a robot navigating an environment, we need **spatial mapping** — knowing where different surfaces are in 3D space. This requires an array of whiskers working together, exactly like the tiger's 200-whisker array.

The spatial mapping problem has three components:

1. **Contact localization**: When a whisker contacts an object, we need to know WHERE the contact occurred. For a single whisker, the contact point along the whisker can be estimated from the vibration frequency — a contact near the base produces higher frequencies than one near the tip (because the effective cantilever length is shorter).

2. **Object geometry reconstruction**: Multiple whiskers touching the same object at different points allow us to reconstruct its shape. This is **tactile shape sensing** — building a 3D model from touch data, like a blind person feeling an object.

3. **Occupancy mapping**: As the robot moves through an environment, whisker contacts are logged with their positions, building a map of where obstacles are. This is the tactile analog of LIDAR-based SLAM (Simultaneous Localization and Mapping).

The processing draws heavily on the tiger\'s barrel cortex: topographic mapping (each whisker has a known position), temporal integration (combining contacts over time), and Bayesian estimation (each new contact updates the probability map of the environment).`,
      analogy: 'Spatial mapping with whiskers is like exploring a dark room by reaching out with your hands. Each time you touch something — a wall, a chair, a table edge — you update your mental map. After enough touches, you can navigate the room confidently without seeing. The robot does the same thing with its whisker array, except it uses a computational map instead of a mental one.',
      storyConnection: 'The tiger navigates through dense undergrowth at full speed in darkness, its whisker array constantly updating a spatial map of branches, vines, and ground obstacles. The barrel cortex integrates contacts from all whiskers into a real-time 3D model of the immediate environment. Our array processing system replicates this capability for robots in search-and-rescue, underwater exploration, or mine clearance.',
      checkQuestion: 'A robot has 8 whiskers arranged in a semicircle, each 10 cm long. An object is 15 cm away and 20 cm wide. How many whiskers can potentially contact the object, and what determines the spatial resolution of the resulting "image"?',
      checkAnswer: 'The whiskers are 10 cm long so they can only reach objects within 10 cm. If the object is 15 cm away, NO whiskers contact it — the robot needs to move closer. Once within range, the resolution depends on whisker spacing. If 8 whiskers span a 180-degree semicircle, the angular spacing is ~22.5 degrees. At 8 cm range, this gives ~3 cm spacing between contact points. Objects smaller than 3 cm might be missed. Active whisking helps by scanning between static positions.',
      codeIntro: 'Simulate a multi-whisker array mapping an environment with obstacles and reconstructing a spatial occupancy map.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === VIBRATION SENSOR SIMULATOR: Step 5 — Array Mapping ===
np.random.seed(42)

class WhiskerArray:
    """Multi-whisker sensor array for spatial mapping."""

    def __init__(self, n_whiskers=12, whisker_length=0.10, spread_angle=180):
        self.n = n_whiskers
        self.L = whisker_length
        self.angles = np.linspace(-spread_angle/2, spread_angle/2, n_whiskers)
        self.angles_rad = np.radians(self.angles)
        # Whisker tip positions relative to base (forward = 0 degrees)
        self.tip_x = self.L * np.cos(self.angles_rad)
        self.tip_y = self.L * np.sin(self.angles_rad)

    def scan(self, robot_x, robot_y, robot_theta, obstacles):
        """Check which whiskers contact obstacles. Returns contact data."""
        contacts = []
        for i in range(self.n):
            # Whisker angle in world frame
            angle = robot_theta + self.angles_rad[i]
            # Check along whisker for contact
            for dist in np.linspace(0, self.L, 50):
                wx = robot_x + dist * np.cos(angle)
                wy = robot_y + dist * np.sin(angle)
                for obs in obstacles:
                    if obs['type'] == 'circle':
                        d = np.sqrt((wx - obs['x'])**2 + (wy - obs['y'])**2)
                        if d < obs['r']:
                            contacts.append({
                                'whisker': i, 'distance': dist,
                                'world_x': wx, 'world_y': wy,
                                'surface': obs.get('surface', 'unknown'),
                            })
                            break
                    elif obs['type'] == 'wall':
                        # Wall defined by two points
                        x1, y1, x2, y2 = obs['x1'], obs['y1'], obs['x2'], obs['y2']
                        # Point-to-line distance
                        dx, dy = x2 - x1, y2 - y1
                        t = max(0, min(1, ((wx-x1)*dx + (wy-y1)*dy) / (dx*dx + dy*dy + 1e-10)))
                        closest_x = x1 + t * dx
                        closest_y = y1 + t * dy
                        d = np.sqrt((wx - closest_x)**2 + (wy - closest_y)**2)
                        if d < 0.005:  # 5mm contact threshold
                            contacts.append({
                                'whisker': i, 'distance': dist,
                                'world_x': wx, 'world_y': wy,
                                'surface': obs.get('surface', 'wall'),
                            })
                            break
                else:
                    continue
                break
        return contacts

# Create environment
obstacles = [
    {'type': 'circle', 'x': 0.3, 'y': 0.1, 'r': 0.05, 'surface': 'metal'},
    {'type': 'circle', 'x': 0.5, 'y': -0.1, 'r': 0.08, 'surface': 'concrete'},
    {'type': 'circle', 'x': 0.2, 'y': -0.15, 'r': 0.04, 'surface': 'skin'},
    {'type': 'wall', 'x1': 0.6, 'y1': -0.3, 'x2': 0.6, 'y2': 0.3, 'surface': 'wall'},
    {'type': 'wall', 'x1': -0.1, 'y1': 0.25, 'x2': 0.7, 'y2': 0.25, 'surface': 'wall'},
    {'type': 'wall', 'x1': -0.1, 'y1': -0.25, 'x2': 0.7, 'y2': -0.25, 'surface': 'wall'},
]

array = WhiskerArray(n_whiskers=16, whisker_length=0.12, spread_angle=200)

# Robot path through environment
n_poses = 50
robot_path_x = np.linspace(0, 0.45, n_poses)
robot_path_y = 0.05 * np.sin(2 * np.pi * robot_path_x / 0.5)
robot_theta = np.zeros(n_poses)  # Facing forward

# Collect all contacts
all_contacts = []
occupancy_map = np.zeros((50, 60))  # Grid map
grid_res = 0.01  # 1 cm resolution
grid_x_offset = -0.1
grid_y_offset = -0.3

surface_colors = {'metal': '#3b82f6', 'concrete': '#ef4444', 'skin': '#f59e0b',
                  'wall': '#94a3b8', 'unknown': '#666666'}

for i in range(n_poses):
    contacts = array.scan(robot_path_x[i], robot_path_y[i], robot_theta[i], obstacles)
    for c in contacts:
        c['robot_pose'] = i
        all_contacts.append(c)
        # Update occupancy grid
        gx = int((c['world_x'] - grid_x_offset) / grid_res)
        gy = int((c['world_y'] - grid_y_offset) / grid_res)
        if 0 <= gx < 60 and 0 <= gy < 50:
            occupancy_map[gy, gx] = min(occupancy_map[gy, gx] + 1, 10)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Environment with robot path and contacts
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Draw obstacles
for obs in obstacles:
    if obs['type'] == 'circle':
        circle = plt.Circle((obs['x'], obs['y']), obs['r'],
                            color=surface_colors.get(obs['surface'], 'gray'), alpha=0.4)
        ax.add_patch(circle)
        ax.text(obs['x'], obs['y'], obs['surface'], ha='center', va='center',
                color='white', fontsize=7)
    elif obs['type'] == 'wall':
        ax.plot([obs['x1'], obs['x2']], [obs['y1'], obs['y2']],
                color=surface_colors.get(obs['surface'], 'gray'), linewidth=3, alpha=0.7)

# Draw robot path
ax.plot(robot_path_x, robot_path_y, 'o-', color='#22c55e', markersize=2, linewidth=1, label='Robot path')

# Draw contacts
for c in all_contacts:
    ax.plot(c['world_x'], c['world_y'], '.', color=surface_colors.get(c['surface'], 'gray'),
            markersize=3, alpha=0.6)

ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.set_title('Environment + contacts', color='white', fontsize=11)
ax.set_aspect('equal')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Single pose whisker visualization
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

pose_idx = 25
rx, ry = robot_path_x[pose_idx], robot_path_y[pose_idx]

# Draw whiskers
for i in range(array.n):
    angle = robot_theta[pose_idx] + array.angles_rad[i]
    wx = rx + array.L * np.cos(angle)
    wy = ry + array.L * np.sin(angle)
    ax.plot([rx, wx], [ry, wy], color='#f59e0b', linewidth=0.5, alpha=0.5)

# Draw contacts for this pose
pose_contacts = [c for c in all_contacts if c['robot_pose'] == pose_idx]
for c in pose_contacts:
    ax.plot(c['world_x'], c['world_y'], 'o', color='#ef4444', markersize=6)

# Draw obstacles
for obs in obstacles:
    if obs['type'] == 'circle':
        circle = plt.Circle((obs['x'], obs['y']), obs['r'],
                            color=surface_colors.get(obs['surface'], 'gray'), alpha=0.3)
        ax.add_patch(circle)

ax.plot(rx, ry, 's', color='#22c55e', markersize=10, label='Robot')
ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.set_title(f'Whisker array at pose {pose_idx}', color='white', fontsize=11)
ax.set_aspect('equal')
ax.set_xlim(rx - 0.15, rx + 0.2)
ax.set_ylim(ry - 0.15, ry + 0.15)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Occupancy map
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

extent = [grid_x_offset, grid_x_offset + 60 * grid_res,
          grid_y_offset, grid_y_offset + 50 * grid_res]
im = ax.imshow(occupancy_map, cmap='hot', origin='lower', extent=extent, aspect='auto')
ax.plot(robot_path_x, robot_path_y, '--', color='#22c55e', linewidth=1, alpha=0.5)
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Contact count', color='white')
cbar.ax.tick_params(colors='gray')
ax.set_xlabel('x (m)', color='white')
ax.set_ylabel('y (m)', color='white')
ax.set_title('Occupancy map (from contacts)', color='white', fontsize=11)

# Plot 4: Contacts per whisker
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

contacts_per_whisker = [sum(1 for c in all_contacts if c['whisker'] == i) for i in range(array.n)]
ax.bar(range(array.n), contacts_per_whisker, color='#06b6d4', alpha=0.8)
ax.set_xlabel('Whisker index', color='white')
ax.set_ylabel('Number of contacts', color='white')
ax.set_title('Contacts per whisker', color='white', fontsize=11)

# Plot 5: Surface classification from contacts
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

surface_counts = {}
for c in all_contacts:
    s = c['surface']
    surface_counts[s] = surface_counts.get(s, 0) + 1

names = list(surface_counts.keys())
counts = list(surface_counts.values())
sc_colors = [surface_colors.get(n, 'gray') for n in names]
ax.pie(counts, labels=names, colors=sc_colors, autopct='%1.0f%%',
       textprops={'color': 'white', 'fontsize': 9})
ax.set_title('Surface types encountered', color='white', fontsize=11)

# Plot 6: Contact distance histogram
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

distances = [c['distance'] for c in all_contacts]
ax.hist(distances, bins=20, color='#a855f7', alpha=0.8, edgecolor='white', linewidth=0.5)
ax.set_xlabel('Contact distance along whisker (m)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Where contacts occur on whiskers', color='white', fontsize=11)
ax.axvline(np.mean(distances), color='#f59e0b', linestyle='--',
           label=f'Mean: {np.mean(distances)*100:.1f} cm')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("=== Spatial Mapping Results ===")
print(f"Array: {array.n} whiskers, {array.L*100:.0f} cm each, {200}° spread")
print(f"Robot poses: {n_poses}")
print(f"Total contacts: {len(all_contacts)}")
print()
print("Contacts per surface:")
for name, count in sorted(surface_counts.items(), key=lambda x: -x[1]):
    print(f"  {name}: {count}")
print()
print(f"Average contact distance: {np.mean(distances)*100:.1f} cm from base")
print(f"Occupancy map: {occupancy_map.shape[0]}x{occupancy_map.shape[1]} grid at {grid_res*100:.0f} cm resolution")
print(f"Occupied cells: {np.sum(occupancy_map > 0)}")
print()
print("The whisker array builds a spatial map through touch alone.")
print("Combined with surface classification, the robot knows WHAT is WHERE.")`,
      challenge: 'Add a Bayesian occupancy update: instead of just counting contacts, compute P(occupied | contact_history) using log-odds. Free space (whisker passes through without contact) should decrease occupancy probability. This is how real robot mapping works.',
      successHint: 'Spatial mapping from touch data is an active research area in robotics. Your implementation captures the core concepts: contact detection, world-frame coordinate transformation, and occupancy grid mapping. Combined with the surface classifier from Step 4, the robot now has tactile perception.',
    },
    {
      title: 'Step 6: Complete Vibration Sensor Report — design for a rescue robot',
      concept: `In this final step, we bring everything together into a complete design report for a whisker sensor system on a **search-and-rescue robot**. The scenario: a small robot must navigate a collapsed building — no light, thick dust blocking cameras, unstable rubble. It needs to find survivors by touch alone.

The requirements:
- Detect human skin vs concrete vs metal debris vs wood at contact
- Map obstacle positions to plan a path through the rubble
- Detect human heartbeat vibrations through contact (1-2 Hz at ~100 um displacement)
- Operate in dusty, wet conditions where optical sensors fail
- Fit on a 20 cm wide robot with 360-degree sensing

Our complete system integrates all the components we built:
- **Hardware**: 24 PVDF bimorph whiskers (6 per quadrant), each 8-12 cm long with tapered nylon fibers
- **Electronics**: 24 charge amplifiers, 4 quad-channel ADCs, one ARM Cortex-M4 microcontroller
- **Signal processing**: Band-pass filtering, envelope detection, feature extraction (all running in real-time)
- **Classification**: Neural network trained on 5 surface types (concrete, metal, wood, skin, air)
- **Mapping**: Occupancy grid with Bayesian updates, contact-based path planning

This is a professional engineering design — the same level of analysis that would appear in a conference paper or product specification.`,
      analogy: 'The complete system design is like designing a self-driving car, but for touch instead of vision. A self-driving car has cameras (our whisker sensors), a neural network for object detection (our surface classifier), a map (our occupancy grid), and a path planner. We are building the touch equivalent — a "self-navigating" robot that uses tactile sensing instead of optical sensing.',
      storyConnection: 'The tiger that inspired this entire project navigates through the jungle at night using touch. Our search-and-rescue robot navigates through a collapsed building using the same principles — tapered cantilevers, resonant tuning, array processing, and spatial mapping. The tiger\'s whisker system, understood through physics and implemented through engineering, could save human lives in disaster scenarios. This is the ultimate promise of bio-inspired engineering.',
      checkQuestion: 'The rescue robot needs to detect a human heartbeat (1.2 Hz, ~100 um surface displacement) through a whisker contact. Given our sensor has f_n = 180 Hz and sensitivity of 0.5 V/(m/s), can it detect this signal? What is the expected voltage?',
      checkAnswer: 'Surface velocity = 2*pi*f*displacement = 2*pi*1.2*100e-6 = 7.54e-4 m/s. Voltage = 0.5 * 7.54e-4 = 0.377 mV. This is above the noise floor (50 uV) with SNR = 7.5. However, at 1.2 Hz the sensor response is attenuated (well below resonance). The actual voltage is reduced by the frequency response: at 1.2 Hz, the response is approximately f/f_n = 1.2/180 = 0.0067 of the resonant response. Effective voltage: 0.377 * 0.0067 = 2.5 uV — BELOW the noise floor. Solution: use a longer, softer whisker with f_n < 10 Hz for heartbeat detection, or use DC-coupled strain measurement instead of AC-coupled piezo.',
      codeIntro: 'Generate the complete design report for a rescue robot whisker system with performance analysis across all requirements.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === VIBRATION SENSOR SIMULATOR: Step 6 — Complete Design Report ===
np.random.seed(42)

# System specifications
system = {
    'name': 'TigerSense Rescue Whisker Array',
    'n_whiskers': 24,
    'n_quadrants': 4,
    'whiskers_per_quadrant': 6,
    'whisker_lengths_cm': [4, 6, 8, 10, 12, 14],
    'robot_width_cm': 20,
    'sensing_range_cm': 14,
    'power_per_channel_mW': 5,
    'processor': 'ARM Cortex-M4 (168 MHz)',
    'adc_bits': 12,
    'sample_rate_kHz': 10,
}

# Performance metrics for each requirement
requirements = [
    {
        'name': 'Surface discrimination',
        'description': 'Classify concrete, metal, wood, skin, air',
        'metric': 'Accuracy',
        'target': 90,
        'achieved': 94,
        'unit': '%',
    },
    {
        'name': 'Obstacle mapping',
        'description': 'Build occupancy grid from contacts',
        'metric': 'Map completeness',
        'target': 80,
        'achieved': 87,
        'unit': '%',
    },
    {
        'name': 'Heartbeat detection',
        'description': 'Detect human through whisker contact',
        'metric': 'Detection range',
        'target': 5,
        'achieved': 3,
        'unit': 'cm',
    },
    {
        'name': 'Dust/water tolerance',
        'description': 'Operate in debris environments',
        'metric': 'Performance in dust',
        'target': 85,
        'achieved': 92,
        'unit': '% of clean',
    },
    {
        'name': 'Response time',
        'description': 'Contact to classification',
        'metric': 'Latency',
        'target': 50,
        'achieved': 12,
        'unit': 'ms',
    },
    {
        'name': '360° coverage',
        'description': 'Sensing in all directions',
        'metric': 'Angular coverage',
        'target': 350,
        'achieved': 360,
        'unit': 'degrees',
    },
]

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('TigerSense Rescue Whisker Array — Design Report',
             color='white', fontsize=14, fontweight='bold', y=0.98)

# Plot 1: System layout (top view)
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Draw robot body
robot_r = system['robot_width_cm'] / 2 / 100
theta_body = np.linspace(0, 2 * np.pi, 100)
ax.fill(robot_r * np.cos(theta_body) * 100, robot_r * np.sin(theta_body) * 100,
        color='#374151', alpha=0.8)
ax.text(0, 0, 'ROBOT', ha='center', va='center', color='white', fontsize=8, fontweight='bold')

# Draw whiskers in 4 quadrants
quadrant_angles = [0, 90, 180, 270]
quadrant_colors = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b']
whisker_lengths = system['whisker_lengths_cm']

for q, (base_angle, color) in enumerate(zip(quadrant_angles, quadrant_colors)):
    for i, L in enumerate(whisker_lengths):
        angle = np.radians(base_angle + (i - 2.5) * 12)
        bx = robot_r * 100 * np.cos(angle)
        by = robot_r * 100 * np.sin(angle)
        tx = (robot_r * 100 + L) * np.cos(angle)
        ty = (robot_r * 100 + L) * np.sin(angle)
        ax.plot([bx, tx], [by, ty], color=color, linewidth=1, alpha=0.7)
        ax.plot(bx, by, 'o', color=color, markersize=2)

# Sensing range circle
sense_r = system['sensing_range_cm']
ax.plot(sense_r * np.cos(theta_body), sense_r * np.sin(theta_body),
        '--', color='white', alpha=0.3, linewidth=1)
ax.text(sense_r + 1, 0, f'{sense_r}cm range', color='white', fontsize=7)

ax.set_xlabel('x (cm)', color='white')
ax.set_ylabel('y (cm)', color='white')
ax.set_title('System layout (top view)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.set_xlim(-20, 20)
ax.set_ylim(-20, 20)

# Plot 2: Requirements pass/fail
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

req_names = [r['name'] for r in requirements]
targets = [r['target'] for r in requirements]
achieved = [r['achieved'] for r in requirements]

# Normalize: target = 1.0
target_norm = [1.0] * len(requirements)
achieved_norm = [a / t for a, t in zip(achieved, targets)]

x_r = np.arange(len(requirements))
ax.barh(x_r, achieved_norm, color=['#22c55e' if a >= t else '#ef4444'
        for a, t in zip(achieved, targets)], alpha=0.8)
ax.axvline(1.0, color='white', linestyle='--', alpha=0.5, label='Target')
ax.set_yticks(x_r)
ax.set_yticklabels(req_names, color='white', fontsize=8)
ax.set_xlabel('Achievement / Target', color='white')
ax.set_title('Requirements compliance', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

for i, r in enumerate(requirements):
    status = 'PASS' if r['achieved'] >= r['target'] else 'FAIL'
    color = '#22c55e' if status == 'PASS' else '#ef4444'
    ax.text(achieved_norm[i] + 0.05, i,
            f"{r['achieved']}{r['unit']} [{status}]",
            va='center', color=color, fontsize=7)

# Plot 3: Frequency coverage
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

lengths_m = [l / 100 for l in whisker_lengths]
for L in lengths_m:
    # Approximate f_n
    r = 0.3e-3
    I = np.pi * r**4 / 4
    m_per_L = 1780 * np.pi * r**2
    f_n = (1.875**2 / (2 * np.pi * L**2)) * np.sqrt(2.5e9 * I / m_per_L)
    Q = 12
    bandwidth = f_n / Q

    ax.barh(L * 100, bandwidth * 2, left=f_n - bandwidth, height=0.8,
            color='#06b6d4', alpha=0.6)
    ax.plot(f_n, L * 100, 'o', color='#06b6d4', markersize=6)
    ax.text(f_n + bandwidth + 10, L * 100, f'{f_n:.0f} Hz', va='center',
            color='white', fontsize=7)

# Annotate target signals
signals = [
    ('Heartbeat', 1.5, '#ef4444'),
    ('Footstep', 30, '#f59e0b'),
    ('Voice', 200, '#22c55e'),
    ('Texture', 100, '#a855f7'),
]
for name, freq, color in signals:
    ax.axvline(freq, color=color, linestyle='--', alpha=0.5)
    ax.text(freq, max(whisker_lengths) + 1, name, color=color, fontsize=7,
            ha='center', rotation=45)

ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Whisker length (cm)', color='white')
ax.set_title('Frequency coverage per whisker', color='white', fontsize=11)

# Plot 4: Power budget
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

power_items = {
    'Charge amps (24x)': 24 * 2,
    'ADC (4x quad)': 4 * 10,
    'Processor': 50,
    'Wireless TX': 30,
    'Misc': 10,
}

colors_pie = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
total_power = sum(power_items.values())
ax.pie(power_items.values(), labels=[f'{k}\\n{v}mW' for k, v in power_items.items()],
       colors=colors_pie, autopct='%1.0f%%',
       textprops={'color': 'white', 'fontsize': 7})
ax.set_title(f'Power budget ({total_power}mW total)', color='white', fontsize=11)

# Plot 5: Comparison with other sensor modalities
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

modalities = ['Camera', 'LIDAR', 'Sonar', 'Whiskers\\n(ours)', 'Tiger\\nwhiskers']
metrics_radar = {
    'Dust tolerance': [1, 2, 7, 9, 10],
    'Dark operation': [1, 8, 9, 10, 10],
    'Surface ID': [7, 2, 1, 8, 10],
    'Power (low=good)': [3, 4, 6, 8, 10],
    'Cost (low=good)': [4, 2, 7, 7, 10],
}

x_mod = np.arange(len(modalities))
width = 0.15
metric_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

for i, (metric_name, scores) in enumerate(metrics_radar.items()):
    ax.bar(x_mod + i * width, scores, width, color=metric_colors[i],
           alpha=0.8, label=metric_name)

ax.set_xticks(x_mod + width * 2)
ax.set_xticklabels(modalities, color='white', fontsize=7)
ax.set_ylabel('Score (0-10)', color='white')
ax.set_title('Sensor modality comparison', color='white', fontsize=11)
ax.legend(fontsize=5, facecolor='#1f2937', edgecolor='gray', labelcolor='white',
          ncol=2, loc='upper left')

# Plot 6: Bill of materials cost
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

bom = {
    'PVDF film (24 sensors)': 36,
    'Steel shim stock': 8,
    'Nylon whisker fibers': 12,
    'Charge amplifier ICs': 24,
    'ADC chips (4x)': 16,
    'ARM Cortex-M4 board': 15,
    'PCB fabrication': 20,
    'Connectors & wiring': 10,
    'Assembly labor': 40,
}

items = list(bom.keys())
costs = list(bom.values())
total_cost = sum(costs)
cumulative = np.cumsum(costs)

bars = ax.barh(range(len(items)), costs, color='#06b6d4', alpha=0.8)
ax.set_yticks(range(len(items)))
ax.set_yticklabels(items, color='white', fontsize=7)
ax.set_xlabel('Cost ($)', color='white')
ax.set_title(f'Bill of Materials (\${total_cost} total)', color='white', fontsize=11)

for bar, cost in zip(bars, costs):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'\${cost}', va='center', color='white', fontsize=7)

plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.show()

print("=" * 60)
print("  TIGERSENSE RESCUE WHISKER ARRAY — DESIGN REPORT")
print("=" * 60)
print()
print(f"System: {system['n_whiskers']} whiskers, {system['n_quadrants']} quadrants")
print(f"Whisker lengths: {system['whisker_lengths_cm']} cm")
print(f"Sensing range: {system['sensing_range_cm']} cm (360 degrees)")
print(f"Processor: {system['processor']}")
print(f"Total power: {total_power} mW")
print(f"Total cost: \${total_cost}")
print()
print("REQUIREMENTS COMPLIANCE:")
n_pass = 0
for r in requirements:
    status = "PASS" if r['achieved'] >= r['target'] else "NEEDS WORK"
    if r['achieved'] >= r['target']:
        n_pass += 1
    print(f"  {r['name']:<25} target={r['target']}{r['unit']:>4} "
          f"achieved={r['achieved']}{r['unit']:>4} [{status}]")
print(f"\\nOverall: {n_pass}/{len(requirements)} requirements met")
print()
print("KEY FINDING: Heartbeat detection requires a dedicated low-frequency")
print("whisker (f_n < 5 Hz) — the standard whiskers are too stiff.")
print("Recommendation: Add 4 extra-long (20cm) silicone whiskers for")
print("heartbeat detection, bringing the total to 28 whiskers.")
print()
print("CONCLUSION:")
print("The TigerSense whisker array provides tactile sensing where cameras")
print("and LIDAR fail. Inspired by the tiger's whisker system, it combines")
print("cantilever mechanics, piezoelectric transduction, array processing,")
print("and machine learning into a complete sensory system.")
print()
print("From a tiger's whisker to a rescue robot's sensor —")
print("bio-inspired engineering bridging nature and technology.")`,
      challenge: 'Design the signal processing pipeline that runs on the ARM Cortex-M4 in real-time. Calculate the computational budget: how many multiply-accumulate operations per second are needed for filtering, envelope detection, feature extraction, and neural network inference for all 24 channels at 10 kHz sample rate? Does the 168 MHz processor have enough throughput?',
      successHint: 'You have designed a complete bio-inspired sensor system from first principles: whisker mechanics, piezoelectric transduction, signal conditioning, machine learning classification, spatial mapping, and system integration. This is genuine engineering — the same process used to design real robotic sensing systems. The tiger\'s whisker, understood through physics, has become a tool that could save human lives.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Build a Vibration Sensor Simulator</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a complete robotic whisker sensor system using Python. Click to start.</p>
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
