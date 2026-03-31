import { useState, useRef, useCallback } from 'react';
import { Loader2, Wrench } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FishJumpLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Temperature–oxygen curve: modelling the relationship',
      concept: `In Level 1 you learned that warm water holds less dissolved oxygen. Now let’s quantify it. The relationship between water temperature and dissolved oxygen saturation follows a well-known empirical curve. At sea level, the maximum dissolved oxygen (in mg/L) at a given temperature T (°C) can be approximated by:

DO_max ≈ 14.6 – 0.394×T + 0.00714×T² – 0.0000646×T³

This is a cubic polynomial fitted to measured data. The equation tells us:
- At 0°C: DO_max ≈ 14.6 mg/L (ice-cold water holds a lot of oxygen)
- At 20°C: DO_max ≈ 9.1 mg/L (room temperature, decent but declining)
- At 35°C: DO_max ≈ 6.9 mg/L (hot day in the Barak valley — dangerously low)

The fish stress threshold is around 4 mg/L. But actual dissolved oxygen in a river is often *below* the maximum because:
1. Bacterial decomposition of organic matter consumes O₂
2. Algal blooms consume O₂ at night (photosynthesis reverses)
3. Stagnant water has poor mixing with the atmosphere
4. Industrial/agricultural discharge adds biological oxygen demand (BOD)

In this lesson, you will plot the theoretical curve, overlay real-world stress thresholds, and calculate the “safety margin” for fish at different temperatures.`,
      analogy: 'Think of dissolved oxygen like fizz in a cold soda. A cold can of soda stays fizzy because cold liquid holds gas well. Leave it in the sun and the gas escapes — the soda goes flat. Water works the same way with oxygen: cold river water is “fizzy” with O₂, and warm water goes “flat”. Fish in flat water are like you trying to breathe in a stuffy room — the air is there, but there is not enough oxygen in it.',
      storyConnection: 'Barak River fishermen know that fish are harder to catch on hot afternoons. The fish become lethargic and move to deeper, cooler pools. They are following the oxygen — and you can now calculate exactly why.',
      checkQuestion: 'Using the polynomial DO_max ≈ 14.6 – 0.394T + 0.00714T² – 0.0000646T³, calculate DO_max at 25°C. How much safety margin above the 4 mg/L stress zone is that?',
      checkAnswer: 'DO_max = 14.6 – 0.394(25) + 0.00714(625) – 0.0000646(15625) = 14.6 – 9.85 + 4.46 – 1.01 = 8.2 mg/L. Safety margin = 8.2 – 4.0 = 4.2 mg/L. That sounds safe, but if pollution removes half the oxygen, you are at 4.1 mg/L — right at the edge.',
      codeIntro: 'Plot the temperature–oxygen curve and visualise the fish stress zone.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Temperature range
T = np.linspace(0, 40, 200)

# Empirical dissolved oxygen saturation (mg/L) at sea level
DO_max = 14.6 - 0.394*T + 0.00714*T**2 - 0.0000646*T**3

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Plot the curve
ax.plot(T, DO_max, color='#3b82f6', linewidth=2.5, label='Max dissolved O₂ (saturation)')

# Stress zone
ax.axhline(y=4, color='#ef4444', linestyle='--', linewidth=1.5, label='Fish stress threshold (4 mg/L)')
ax.fill_between(T, 0, 4, color='#ef4444', alpha=0.1)
ax.text(35, 2, 'DANGER\\nZONE', color='#ef4444', fontsize=12, fontweight='bold', ha='center')

# Comfortable zone
ax.fill_between(T, 4, DO_max, where=(DO_max > 4), color='#22c55e', alpha=0.08)
ax.text(10, 10, 'Comfortable\\nfor most fish', color='#22c55e', fontsize=10, ha='center')

# Mark Barak River summer temperature
ax.axvline(x=30, color='#f59e0b', linestyle=':', linewidth=1.5)
ax.annotate('Barak River\\nsummer (~30°C)', xy=(30, 7.5), xytext=(33, 10),
            arrowprops=dict(arrowstyle='->', color='#f59e0b'),
            color='#f59e0b', fontsize=9)

# Mark specific temperatures
for temp, do_val, name in [(5, 12.8, 'Winter stream'), (20, 9.1, 'Spring'), (30, 7.5, 'Summer'), (35, 6.9, 'Heat wave')]:
    ax.plot(temp, do_val, 'o', color='#f59e0b', markersize=8)
    ax.annotate(f'{name}\\n{do_val} mg/L', xy=(temp, do_val), xytext=(temp, do_val + 0.8),
                ha='center', fontsize=7, color='white')

ax.set_xlabel('Water Temperature (°C)', color='white', fontsize=12)
ax.set_ylabel('Dissolved Oxygen (mg/L)', color='white', fontsize=12)
ax.set_title('How Temperature Controls Dissolved Oxygen', color='white', fontsize=14)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=10)
ax.set_xlim(0, 40)
ax.set_ylim(0, 16)
ax.tick_params(colors='gray')
ax.grid(True, alpha=0.15)

plt.tight_layout()
plt.show()

print("Key insight: As temperature rises, the oxygen ceiling drops.")
print("At 30°C the max is only 7.5 mg/L — and real rivers often have LESS than the max.")
print("A 50% reduction from pollution puts you at 3.75 mg/L — below the stress threshold.")`,
      challenge: 'Add a second curve showing what happens at 1000m altitude (where atmospheric pressure is ~90% of sea level). Hint: multiply DO_max by 0.9. At what temperature does the altitude curve cross the 4 mg/L stress threshold?',
      successHint: 'You have built the core model that fisheries scientists use to predict fish stress. The temperature–DO curve is the starting point for every water quality assessment.',
    },
    {
      title: 'Projectile motion: calculating jump height and range',
      concept: `A fish leaving the water is a projectile, governed by the same equations as a cannonball or a thrown ball. Let’s build the full model.

At the moment of launch, the fish has:
- Speed v₀ (m/s) at angle θ from horizontal
- Horizontal velocity: v_x = v₀ cosθ
- Vertical velocity: v_y = v₀ sinθ

In the air (ignoring air resistance, which is small for a fish-sized object at these speeds):
- x(t) = v_x × t
- y(t) = v_y × t – ½gt²

Maximum height: h_max = v₀² sin²θ / (2g)
Time of flight: t_flight = 2v₀ sinθ / g
Range: R = v₀² sin(2θ) / g

For a waterfall jump, the fish needs h_max ≥ waterfall height. The optimal angle for maximum height is 90° (straight up), but fish rarely launch vertically because they also need horizontal distance to clear the lip of the falls. Real salmon typically jump at 60–80° — a compromise between height and forward motion.

The fish’s launch speed depends on its muscle power and body mass. Larger fish can generate more force, but also have more mass to accelerate. The key metric is **specific power**: watts per kilogram of body mass. Salmon can produce about 200 W/kg in a burst — comparable to a world-class sprinter.`,
      analogy: 'A fish jumping a waterfall is solving the same problem as a basketball player doing a layup: you need enough vertical speed to reach the rim (height), but also enough horizontal speed to reach the basket (forward distance). The angle of takeoff is the trade-off. Jump straight up and you reach maximum height but go nowhere sideways. Jump at 45° and you maximise range but only reach half the height.',
      storyConnection: 'Borali’s first jump was about curiosity, but real Barak River mahseer jump waterfalls to reach spawning grounds upstream. The fishermen say the biggest mahseer always find the right spot in the current to launch from. They are reading the water physics instinctively.',
      checkQuestion: 'A mahseer launches at 5 m/s at 75° from horizontal. Calculate (a) maximum height and (b) horizontal range. (Use g = 9.81 m/s²)',
      checkAnswer: '(a) h_max = 5² × sin²(75°) / (2 × 9.81) = 25 × 0.933 / 19.62 = 1.19 m. (b) Range = 5² × sin(150°) / 9.81 = 25 × 0.5 / 9.81 = 1.27 m. The fish clears a 1-metre falls but needs to land 1.27 m forward — enough to clear most lips.',
      codeIntro: 'Simulate fish jumps at different angles and speeds, and find the minimum speed to clear a waterfall.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.81  # m/s^2

def fish_trajectory(v0, angle_deg, dt=0.001):
    """Calculate the full trajectory of a fish jump."""
    theta = np.radians(angle_deg)
    vx = v0 * np.cos(theta)
    vy = v0 * np.sin(theta)

    xs, ys = [0], [0]
    t = 0
    while True:
        t += dt
        x = vx * t
        y = vy * t - 0.5 * g * t**2
        if y < 0 and t > 0.01:
            break
        xs.append(x)
        ys.append(y)
    return np.array(xs), np.array(ys)

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in [ax1, ax2, ax3, ax4]:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Different angles at fixed speed
v0 = 6  # m/s (typical salmon)
angles = [30, 45, 60, 70, 80, 90]
colors = plt.cm.viridis(np.linspace(0.2, 0.9, len(angles)))

for angle, c in zip(angles, colors):
    x, y = fish_trajectory(v0, angle)
    ax1.plot(x, y, color=c, linewidth=2, label=f'{angle}°')

ax1.set_xlabel('Horizontal distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title(f'Trajectories at v₀ = {v0} m/s', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, title='Launch angle', title_fontsize=8)
ax1.set_ylim(0, 2.2)
ax1.grid(True, alpha=0.15)

# Plot 2: Max height vs angle
angles_range = np.linspace(10, 90, 100)
h_max = v0**2 * np.sin(np.radians(angles_range))**2 / (2 * g)
ranges = v0**2 * np.sin(np.radians(2 * angles_range)) / g

ax2.plot(angles_range, h_max, color='#22c55e', linewidth=2, label='Max height')
ax2.plot(angles_range, ranges, color='#3b82f6', linewidth=2, label='Range')
ax2.axhline(y=1.5, color='#ef4444', linestyle='--', linewidth=1, label='1.5m waterfall')
ax2.set_xlabel('Launch angle (°)', color='white')
ax2.set_ylabel('Distance (m)', color='white')
ax2.set_title('Height vs Range Trade-off', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.grid(True, alpha=0.15)

# Plot 3: Minimum speed to clear different waterfall heights
waterfall_heights = np.linspace(0.5, 4, 50)
# At 70 degrees (typical salmon angle):
angle_opt = 70
v_min = np.sqrt(2 * g * waterfall_heights / np.sin(np.radians(angle_opt))**2)

ax3.plot(waterfall_heights, v_min, color='#f59e0b', linewidth=2.5)
ax3.fill_between(waterfall_heights, v_min, 12, color='#22c55e', alpha=0.1, label='Jump succeeds')
ax3.fill_between(waterfall_heights, 0, v_min, color='#ef4444', alpha=0.1, label='Jump fails')

# Mark known fish speeds
fish_data = [('Salmon', 6, '#3b82f6'), ('Mahseer', 4.5, '#f59e0b'), ('Carp', 2.5, '#a855f7')]
for name, speed, fc in fish_data:
    max_h = speed**2 * np.sin(np.radians(angle_opt))**2 / (2 * g)
    ax3.plot(max_h, speed, 'o', color=fc, markersize=10, zorder=5)
    ax3.annotate(f'{name} ({speed} m/s)', xy=(max_h, speed), xytext=(max_h + 0.3, speed + 0.3),
                color=fc, fontsize=8)

ax3.set_xlabel('Waterfall height (m)', color='white')
ax3.set_ylabel('Min launch speed (m/s)', color='white')
ax3.set_title(f'Speed Needed vs Waterfall Height (at {angle_opt}°)', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.grid(True, alpha=0.15)

# Plot 4: Energy budget
masses = np.linspace(0.5, 10, 50)  # kg
v_launch = 6  # m/s
KE = 0.5 * masses * v_launch**2  # Joules
h_achieved = v_launch**2 * np.sin(np.radians(70))**2 / (2 * g)
PE = masses * g * h_achieved

ax4.plot(masses, KE, color='#ef4444', linewidth=2, label='Kinetic energy at launch')
ax4.plot(masses, PE, color='#22c55e', linewidth=2, label='Potential energy at peak')
ax4.fill_between(masses, PE, KE, color='#f59e0b', alpha=0.15, label='Lost to horizontal motion + drag')
ax4.set_xlabel('Fish mass (kg)', color='white')
ax4.set_ylabel('Energy (Joules)', color='white')
ax4.set_title('Energy Budget of a Fish Jump', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax4.grid(True, alpha=0.15)

plt.tight_layout()
plt.show()

print(f"At {v0} m/s and 70°, a salmon reaches {v0**2 * np.sin(np.radians(70))**2 / (2*g):.2f} m height")
print(f"A 3 kg salmon needs {0.5 * 3 * v0**2:.1f} J of kinetic energy to launch")
print("That is equivalent to lifting a 3 kg weight 1.6 m — done in a fraction of a second!")`,
      challenge: 'Add air resistance to the model. Use F_drag = 0.5 * C_d * A * rho_air * v², where C_d = 0.4, A = 0.01 m² (cross-section of a salmon), rho_air = 1.2 kg/m³. Does drag significantly reduce the jump height at 6 m/s? (Hint: it barely matters at these low speeds.)',
      successHint: 'You have built a complete projectile motion simulator customised for fish biomechanics. This same model is used by engineers designing fish ladders at hydroelectric dams.',
    },
    {
      title: 'Building a dissolved oxygen monitor: data analysis',
      concept: `Now we connect the physics to ecology. Fisheries scientists measure dissolved oxygen (DO) at regular intervals throughout the year to track river health. The data typically shows:

- **Seasonal pattern**: DO is highest in winter (cold water) and lowest in late summer (warm water + algal blooms)
- **Diel (24-hour) pattern**: DO rises during the day (photosynthesis by aquatic plants produces O₂) and drops at night (respiration consumes O₂ without replacement)
- **Event spikes**: Heavy rain can temporarily increase DO (aeration) or decrease it (runoff carrying organic pollutants)

A fisheries scientist’s job is to:
1. Collect time-series DO data
2. Identify the seasonal and diel patterns
3. Detect anomalies (sudden drops below the stress threshold)
4. Correlate DO changes with fish behaviour (jumping frequency, species shifts, fish kills)

You will simulate a year of DO data with realistic seasonal variation, add noise, and build a simple anomaly detector that flags periods when fish would be stressed.`,
      analogy: 'Monitoring dissolved oxygen is like monitoring a patient’s blood oxygen with a pulse oximeter. Normal SpO₂ is 95–100%. Below 90% is concerning. Below 80% is dangerous. You watch for trends (gradual decline = worsening condition) and spikes (sudden drop = acute event). The river’s DO is the patient’s SpO₂, and the fish are the patient.',
      storyConnection: 'Borali jumped because the sky was beautiful. But real fish in the Barak River jump because their environment changes. If someone tracked DO in the Barak year-round, they could predict exactly when fish would start jumping more — and intervene before a fish kill.',
      checkQuestion: 'A river’s DO reading at 3pm is 9.5 mg/L. At 4am the next morning, it reads 5.2 mg/L. What is the most likely explanation for this large drop?',
      checkAnswer: 'The diel cycle. During the day, aquatic plants photosynthesise and produce O₂, boosting DO. At night, photosynthesis stops but respiration continues, consuming O₂. The 4am reading reflects the overnight oxygen drawdown. If the river has significant algal growth, this swing can be extreme — high DO during the day but dangerously low before dawn.',
      codeIntro: 'Simulate a year of dissolved oxygen data and build an anomaly detector.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 365 days of DO data
days = np.arange(365)

# Seasonal cycle: DO peaks in winter (day ~0 = Jan), lowest in summer (day ~180 = July)
seasonal = 10.5 + 2.5 * np.cos(2 * np.pi * days / 365)

# Diel variation: +/- 1 mg/L (simplified as random daily variation)
diel_noise = 0.8 * np.sin(2 * np.pi * days / 1 + np.random.uniform(0, 2*np.pi, 365)) + np.random.normal(0, 0.3, 365)

# Pollution events: 3 random events that drop DO by 3-5 mg/L for 5-15 days
pollution = np.zeros(365)
events = [(120, 10, 4.5), (195, 15, 5.0), (250, 8, 3.5)]  # (start_day, duration, severity)
for start, dur, sev in events:
    pollution[start:start+dur] = -sev * np.exp(-np.arange(dur) / (dur/3))

DO = seasonal + diel_noise + pollution
DO = np.clip(DO, 0, 15)  # Physical limits

# Fish stress threshold
stress_threshold = 4.0
stressed_days = DO < stress_threshold

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(14, 12), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Plot 1: Full year DO data
ax1.set_facecolor('#111827')
ax1.plot(days, DO, color='#3b82f6', linewidth=0.8, alpha=0.7, label='Daily DO reading')
ax1.plot(days, seasonal, color='#22c55e', linewidth=2, linestyle='--', label='Seasonal trend')
ax1.axhline(y=stress_threshold, color='#ef4444', linewidth=1.5, linestyle='--', label=f'Stress threshold ({stress_threshold} mg/L)')
ax1.fill_between(days, 0, stress_threshold, color='#ef4444', alpha=0.1)

# Highlight stressed periods
for i in range(len(days)):
    if stressed_days[i]:
        ax1.axvspan(days[i]-0.5, days[i]+0.5, color='#ef4444', alpha=0.3)

ax1.set_ylabel('Dissolved O₂ (mg/L)', color='white', fontsize=11)
ax1.set_title('Year-Round Dissolved Oxygen Monitoring — Barak River (Simulated)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 15)
ax1.grid(True, alpha=0.1)

# Plot 2: Temperature (inverse of DO pattern)
ax2.set_facecolor('#111827')
temp = 22 - 8 * np.cos(2 * np.pi * days / 365) + np.random.normal(0, 1, 365)
ax2.plot(days, temp, color='#f59e0b', linewidth=0.8)
ax2.set_ylabel('Water Temp (°C)', color='white', fontsize=11)
ax2.set_title('Water Temperature (drives the DO pattern)', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.grid(True, alpha=0.1)

# Plot 3: Fish jump frequency (increases when DO is low)
ax3.set_facecolor('#111827')
# Model: jump frequency inversely proportional to DO
jump_freq = np.where(DO > 6, np.random.poisson(2, 365),
            np.where(DO > 4, np.random.poisson(8, 365),
            np.random.poisson(25, 365)))
ax3.bar(days, jump_freq, color=np.where(stressed_days, '#ef4444', '#3b82f6'), width=1, alpha=0.7)
ax3.set_ylabel('Jumps per hour', color='white', fontsize=11)
ax3.set_xlabel('Day of Year', color='white', fontsize=11)
ax3.set_title('Predicted Fish Jumping Frequency', color='white', fontsize=12)
ax3.tick_params(colors='gray')
ax3.grid(True, alpha=0.1)

# Month labels
month_starts = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
ax3.set_xticks(month_starts)
ax3.set_xticklabels(month_names, color='gray')

plt.tight_layout()
plt.show()

n_stressed = stressed_days.sum()
print(f"\\nANOMALY REPORT:")
print(f"  Days below stress threshold: {n_stressed} / 365 ({n_stressed/365*100:.1f}%)")
print(f"  Pollution events detected: {len(events)}")
print(f"  Lowest DO recorded: {DO.min():.1f} mg/L on day {DO.argmin()}")
print(f"  Average jump frequency on stressed days: {jump_freq[stressed_days].mean():.1f} / hour")
print(f"  Average jump frequency on normal days: {jump_freq[~stressed_days].mean():.1f} / hour")`,
      challenge: 'Add a 7-day rolling average line to the DO plot. Then write code that automatically detects and lists every pollution event (defined as any period where the 7-day average drops more than 2 mg/L below the seasonal trend). Print the start date, duration, and severity of each event.',
      successHint: 'You built a fisheries monitoring dashboard. Real scientists use exactly this approach — time-series analysis with anomaly detection — to manage river health and predict fish kills before they happen.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Level 2: Builder</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Model dissolved oxygen, projectile trajectories, and river health data</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You know the concepts from Level 0 and 1. Now build the computational tools: temperature–oxygen curves, jump trajectory simulators, and a dissolved oxygen monitoring dashboard.
        </p>
      </div>

      {!pyReady && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
            This level uses Python for data analysis and simulation. Click below to load the Python runtime.
          </p>
          <button
            onClick={loadPyodide}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 mx-auto"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{loadProgress}</> : 'Load Python Runtime'}
          </button>
        </div>
      )}

      {miniLessons.map((lesson, i) => (
        <MiniLesson
          key={i}
          index={i + 1}
          total={miniLessons.length}
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
          pyodideRef={pyodideRef}
          pyReady={pyReady}
          loadPyodide={loadPyodide}
        />
      ))}
    </div>
  );
}
