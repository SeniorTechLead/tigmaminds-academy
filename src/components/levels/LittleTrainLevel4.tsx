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
      title: 'Project Blueprint: Train Specification Database',
      concept: `Every engineering simulation begins with a clear specification of the system being modelled. For a mountain railway, the critical parameters are: **locomotive mass** (how heavy the train is, including passengers and cargo), **engine power output** (how many kilowatts the engine can sustain), **wheel configuration** (how many wheels drive the train vs carry weight), **friction coefficients** (steel-on-steel adhesion in dry, wet, and oily conditions), and **track gauge** (the distance between rails, which constrains curve radius).

The Darjeeling Himalayan Railway (DHR) is our reference case. It uses 610 mm narrow gauge, has a total train mass of roughly 40-50 tonnes, and its steam locomotives produce about 150 kW. But a single number for "mass" is not enough. Mass changes during the journey as coal and water are consumed. A DHR locomotive carries about 1,500 kg of coal and 3,400 litres of water at departure. Over the 7-hour climb, it consumes roughly 1,200 kg of coal and refills water at two intermediate stations. This means the train is lighter at the top than at the bottom, which affects adhesion and braking.

We will build a structured data model that holds all these specifications, compute derived quantities (like tractive effort from adhesion and weight on driving wheels), and validate our numbers against published railway engineering references. This database becomes the input to every calculation in the rest of the capstone.`,
      analogy: 'Building a specification database is like a doctor taking a patient history before surgery. You would never operate without knowing the patient\'s weight, blood type, allergies, and medication. Likewise, you cannot simulate a train without knowing its mass, power, friction limits, and fuel capacity. Every calculation downstream depends on getting these baseline numbers right.',
      storyConnection: 'The story tells us Bogi is old, patched, and small-wheeled. Those are qualitative descriptions. Our specification database turns them into numbers: mass = 40,000 kg, wheel diameter = 0.61 m, boiler pressure = 10 atm. The story gives us the character; the data gives us the physics.',
      checkQuestion: 'The DHR locomotive has 4 driving wheels and 2 carrying wheels. If total locomotive mass is 22 tonnes and it is evenly distributed across all 6 wheels, what is the weight on the driving wheels? Why does this matter?',
      checkAnswer: 'Weight on driving wheels = (4/6) * 22,000 kg * 9.81 m/s^2 = 143,748 N. This matters because tractive effort = adhesion coefficient * weight on driving wheels. With dry steel adhesion of 0.28, maximum TE = 0.28 * 143,748 = 40,249 N. If we assumed all weight was on driving wheels, we would overestimate TE by 50% and predict the train could climb gradients it actually cannot.',
      codeIntro: 'Build the specification database for the Darjeeling Himalayan Railway and compute all derived quantities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# MOUNTAIN RAILWAY SIMULATOR — Part 1: Specification Database
# ============================================================

class TrainSpec:
    """Complete specification for a narrow-gauge hill train."""
    def __init__(self, name):
        self.name = name
        self.params = {}

    def set(self, key, value, unit, description):
        self.params[key] = {
            'value': value, 'unit': unit, 'desc': description
        }

    def get(self, key):
        return self.params[key]['value']

    def summary(self):
        print(f"=== {self.name} ===")
        for key, p in self.params.items():
            print(f"  {p['desc']:<40} {p['value']:>10.2f} {p['unit']}")

# Build DHR specification
dhr = TrainSpec("Darjeeling Himalayan Railway (B-class)")

# Primary parameters
dhr.set('loco_mass',     22000,  'kg',   'Locomotive mass (empty)')
dhr.set('coal_mass',     1500,   'kg',   'Coal at departure')
dhr.set('water_mass',    3400,   'kg',   'Water at departure')
dhr.set('coach_mass',    18000,  'kg',   'Total coach mass (loaded)')
dhr.set('n_drive_wheels', 4,     '',     'Number of driving wheels')
dhr.set('n_total_wheels', 6,     '',     'Total locomotive wheels')
dhr.set('wheel_diam',    0.61,   'm',    'Driving wheel diameter')
dhr.set('gauge',         0.610,  'm',    'Track gauge')
dhr.set('engine_kw',     150,    'kW',   'Engine power output')
dhr.set('boiler_press',  10.5,   'atm',  'Boiler pressure')
dhr.set('mu_dry',        0.28,   '',     'Adhesion coeff (dry)')
dhr.set('mu_wet',        0.15,   '',     'Adhesion coeff (wet)')
dhr.set('mu_roll',       0.002,  '',     'Rolling resistance coeff')
dhr.set('frontal_area',  3.0,    'm^2',  'Frontal cross-section area')
dhr.set('coal_energy',   29.0,   'MJ/kg','Coal energy density')
dhr.set('boiler_eff',    0.08,   '',     'Thermal efficiency')

# Derived quantities
total_mass = (dhr.get('loco_mass') + dhr.get('coal_mass')
              + dhr.get('water_mass') + dhr.get('coach_mass'))
dhr.set('total_mass', total_mass, 'kg', 'Total train mass at departure')

drive_frac = dhr.get('n_drive_wheels') / dhr.get('n_total_wheels')
weight_drive = drive_frac * dhr.get('loco_mass') * 9.81
dhr.set('weight_drive', weight_drive, 'N', 'Weight on driving wheels')

te_dry = dhr.get('mu_dry') * weight_drive
te_wet = dhr.get('mu_wet') * weight_drive
dhr.set('te_max_dry', te_dry, 'N', 'Max tractive effort (dry)')
dhr.set('te_max_wet', te_wet, 'N', 'Max tractive effort (wet)')

# Maximum gradient from adhesion alone
max_grad_dry = te_dry / (total_mass * 9.81) * 100
max_grad_wet = te_wet / (total_mass * 9.81) * 100
dhr.set('max_grad_dry', max_grad_dry, '%', 'Max gradient (dry adhesion)')
dhr.set('max_grad_wet', max_grad_wet, '%', 'Max gradient (wet adhesion)')

dhr.summary()

# --- Visualize key relationships ---
fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('DHR Specification: Derived Performance Envelope',
             color='white', fontsize=14, fontweight='bold')

# 1. Mass breakdown
ax = axes[0, 0]; ax.set_facecolor('#111827')
labels = ['Locomotive', 'Coal', 'Water', 'Coaches']
masses = [dhr.get('loco_mass'), dhr.get('coal_mass'),
          dhr.get('water_mass'), dhr.get('coach_mass')]
colors = ['#3b82f6', '#f59e0b', '#22c55e', '#a855f7']
bars = ax.barh(labels, [m/1000 for m in masses], color=colors, height=0.6)
for bar, m in zip(bars, masses):
    ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2,
            f'{m:,.0f} kg', va='center', color='white', fontsize=10)
ax.set_xlabel('Mass (tonnes)', color='white')
ax.set_title('Mass Breakdown at Departure', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 2. Tractive effort vs conditions
ax = axes[0, 1]; ax.set_facecolor('#111827')
conditions = ['Dry steel', 'Damp rail', 'Wet rail', 'Oily/leaves']
mu_vals = [0.28, 0.20, 0.15, 0.08]
te_vals = [mu * weight_drive / 1000 for mu in mu_vals]
bar_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
bars = ax.bar(conditions, te_vals, color=bar_colors, width=0.6)
for bar, te in zip(bars, te_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
            f'{te:.1f} kN', ha='center', color='white', fontsize=10)
ax.set_ylabel('Max tractive effort (kN)', color='white')
ax.set_title('Adhesion Limits by Rail Condition', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 3. Mass change during journey
ax = axes[1, 0]; ax.set_facecolor('#111827')
journey_pct = np.linspace(0, 100, 100)
coal_remaining = 1500 * (1 - 0.8 * journey_pct / 100)
water_pattern = np.where(journey_pct < 45, 3400 * (1 - journey_pct/45),
                np.where(journey_pct < 50, 3400,  # refill at Kurseong
                3400 * (1 - (journey_pct - 50)/50)))
train_mass = (22000 + coal_remaining + water_pattern + 18000) / 1000

ax.plot(journey_pct, train_mass, color='#a855f7', linewidth=2.5)
ax.fill_between(journey_pct, train_mass, alpha=0.15, color='#a855f7')
ax.axvline(45, color='gray', linestyle='--', linewidth=1, alpha=0.5)
ax.text(46, train_mass.max() - 0.3, 'Water refill', color='gray', fontsize=9)
ax.set_xlabel('Journey progress (%)', color='white')
ax.set_ylabel('Total mass (tonnes)', color='white')
ax.set_title('Train Mass Changes During Climb', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 4. Power curve: TE vs speed
ax = axes[1, 1]; ax.set_facecolor('#111827')
speeds_kmh = np.linspace(1, 30, 100)
speeds_ms = speeds_kmh / 3.6
power_w = dhr.get('engine_kw') * 1000
te_from_power = power_w / speeds_ms  # TE = P / v
te_capped = np.minimum(te_from_power, te_dry)
ax.plot(speeds_kmh, te_capped / 1000, color='#ef4444', linewidth=2.5, label='Available TE')
ax.axhline(te_dry / 1000, color='#22c55e', linestyle='--', linewidth=1.5,
           label=f'Adhesion limit ({te_dry/1000:.1f} kN)')
ax.fill_between(speeds_kmh, te_capped / 1000, alpha=0.15, color='#ef4444')

# Mark transition speed
v_trans = power_w / te_dry
ax.axvline(v_trans * 3.6, color='#f59e0b', linestyle=':', linewidth=1.5)
ax.text(v_trans * 3.6 + 0.5, te_dry / 1000 * 0.5,
        f'Transition\\n{v_trans*3.6:.1f} km/h', color='#f59e0b', fontsize=9)

ax.set_xlabel('Speed (km/h)', color='white')
ax.set_ylabel('Tractive effort (kN)', color='white')
ax.set_title('Power Curve: TE vs Speed', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"\\nKey derived values:")
print(f"  Total mass: {total_mass:,.0f} kg ({total_mass/1000:.1f} tonnes)")
print(f"  Max TE (dry): {te_dry:,.0f} N ({te_dry/1000:.1f} kN)")
print(f"  Max TE (wet): {te_wet:,.0f} N ({te_wet/1000:.1f} kN)")
print(f"  Max gradient (dry): {max_grad_dry:.2f}%")
print(f"  Max gradient (wet): {max_grad_wet:.2f}%")
print(f"  Transition speed: {v_trans*3.6:.1f} km/h")`,
      challenge: 'Add a second train specification for the Nilgiri Mountain Railway (NMR): 1,000 mm gauge, 30-tonne locomotive, rack-and-pinion capable. Compare the two railways side by side. Which has better adhesion performance? Which needs rack assistance?',
      successHint: 'Every number in this database will feed directly into the physics calculations that follow. Getting the specification right is not glamorous, but it is the foundation of trustworthy engineering.',
    },
    {
      title: 'Gravity on a Slope: Grade Resistance Forces',
      concept: `When a train sits on flat track, gravity pulls straight down and the rail pushes straight up. Zero net force along the track. The moment the track tilts, gravity acquires a component **along the track** that tries to pull the train downhill. This component is the **grade resistance force**: F_grade = m * g * sin(theta), where theta is the angle of the slope.

For small angles (which all railways use), sin(theta) is approximately equal to the gradient expressed as a decimal. A 2% gradient means the track rises 2 metres for every 100 metres of horizontal distance, giving sin(theta) = 0.02. So F_grade = m * g * 0.02. For our 45-tonne train, that is 45,000 * 9.81 * 0.02 = 8,829 N. That is almost 9 kN of force the engine must overcome just to hold position on a 2% slope, before it can even begin to accelerate.

At 5% gradient, the force jumps to 22,073 N. At 8% (the steepest adhesion-only railways attempt), it reaches 35,316 N. Compare these to the maximum tractive effort we calculated: 40,249 N on dry rail. At 8% gradient, the engine barely has 5 kN of surplus force for acceleration and overcoming friction. This is why mountain railways are slow: nearly all engine force goes to fighting gravity, leaving almost nothing for speed.

The key insight is that grade resistance scales linearly with both mass and gradient. Lighter trains climb better. Gentler gradients require less force. Railway engineers use switchbacks and loops to reduce effective gradient, trading distance for slope.`,
      analogy: 'Imagine pushing a heavy shopping trolley up a ramp. On a gentle ramp you barely notice the effort. Steepen the ramp and suddenly you are straining with everything you have. The trolley has not changed weight. The ramp has not changed length. But the component of gravity pulling the trolley back along the ramp has increased dramatically. Grade resistance is that ramp-pulling force, and hill railways live at the edge of what their engines can overcome.',
      storyConnection: 'The story says Bogi "puffed up the steep gradient." That puffing is the steam engine working at maximum output to overcome grade resistance. The story also says "children on bicycles could keep up with her on the straight bits" because most engine power goes to fighting gravity, leaving little for speed.',
      checkQuestion: 'A 45-tonne train is on a 5% gradient. What is the grade resistance in Newtons? If the engine produces 22,000 N of tractive effort, can the train accelerate uphill?',
      checkAnswer: 'F_grade = 45,000 * 9.81 * 0.05 = 22,073 N. The engine produces 22,000 N. Since 22,000 < 22,073, the train CANNOT accelerate. It cannot even maintain position. It would slowly slide backward. This is why the DHR never attempts sustained 5% grades without significant momentum or reducing load.',
      codeIntro: 'Calculate grade resistance across a range of slopes and compare it to the tractive effort envelope.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Train parameters from Lesson 1
total_mass = 44900    # kg
g = 9.81
mu_dry = 0.28
mu_wet = 0.15
drive_weight = (4/6) * 22000 * g  # N (weight on driving wheels)
te_dry = mu_dry * drive_weight
te_wet = mu_wet * drive_weight
engine_kw = 150

# Grade resistance calculation
gradients_pct = np.linspace(0, 10, 200)
gradients_dec = gradients_pct / 100
f_grade = total_mass * g * gradients_dec

# Also compute at specific reference gradients
ref_grads = [1, 2, 3, 4, 5, 6, 7, 8]
ref_forces = [total_mass * g * (gr/100) for gr in ref_grads]

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Grade Resistance: Gravity vs Engine Force',
             color='white', fontsize=14, fontweight='bold')

# 1. Grade resistance vs gradient with TE limits
ax = axes[0, 0]; ax.set_facecolor('#111827')
ax.plot(gradients_pct, f_grade / 1000, color='#ef4444', linewidth=2.5,
        label='Grade resistance')
ax.axhline(te_dry / 1000, color='#22c55e', linewidth=2, linestyle='--',
           label=f'Max TE dry ({te_dry/1000:.1f} kN)')
ax.axhline(te_wet / 1000, color='#3b82f6', linewidth=2, linestyle='--',
           label=f'Max TE wet ({te_wet/1000:.1f} kN)')

# Shade zones
ax.fill_between(gradients_pct, f_grade/1000, te_dry/1000,
                where=f_grade < te_dry, alpha=0.1, color='#22c55e')
ax.fill_between(gradients_pct, f_grade/1000, te_dry/1000,
                where=f_grade > te_dry, alpha=0.1, color='#ef4444')

# Mark max gradient lines
dry_max_grad = te_dry / (total_mass * g) * 100
wet_max_grad = te_wet / (total_mass * g) * 100
ax.axvline(dry_max_grad, color='#22c55e', linestyle=':', linewidth=1)
ax.axvline(wet_max_grad, color='#3b82f6', linestyle=':', linewidth=1)
ax.text(dry_max_grad + 0.1, 5, f'{dry_max_grad:.1f}%', color='#22c55e', fontsize=9)
ax.text(wet_max_grad + 0.1, 3, f'{wet_max_grad:.1f}%', color='#3b82f6', fontsize=9)

ax.set_xlabel('Gradient (%)', color='white')
ax.set_ylabel('Force (kN)', color='white')
ax.set_title('Grade Resistance vs Tractive Effort', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 2. Surplus force (acceleration budget)
ax = axes[0, 1]; ax.set_facecolor('#111827')
surplus_dry = (te_dry - f_grade) / 1000
surplus_wet = (te_wet - f_grade) / 1000
ax.plot(gradients_pct, surplus_dry, color='#22c55e', linewidth=2, label='Dry rail')
ax.plot(gradients_pct, surplus_wet, color='#3b82f6', linewidth=2, label='Wet rail')
ax.axhline(0, color='white', linewidth=1, alpha=0.5)
ax.fill_between(gradients_pct, surplus_dry, 0,
                where=surplus_dry > 0, alpha=0.1, color='#22c55e')
ax.fill_between(gradients_pct, surplus_dry, 0,
                where=surplus_dry < 0, alpha=0.1, color='#ef4444')
ax.set_xlabel('Gradient (%)', color='white')
ax.set_ylabel('Surplus force (kN)', color='white')
ax.set_title('Acceleration Budget After Grade Resistance', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 3. Force breakdown at specific gradients
ax = axes[1, 0]; ax.set_facecolor('#111827')
x_pos = np.arange(len(ref_grads))
bar_width = 0.6
bars = ax.bar(x_pos, [f/1000 for f in ref_forces], bar_width,
              color=['#22c55e' if f < te_dry else '#f59e0b' if f < te_dry * 1.2
                     else '#ef4444' for f in ref_forces])
ax.axhline(te_dry / 1000, color='white', linewidth=1.5, linestyle='--',
           label=f'TE limit (dry): {te_dry/1000:.1f} kN')
for i, (gr, f) in enumerate(zip(ref_grads, ref_forces)):
    pct_of_te = f / te_dry * 100
    ax.text(i, f/1000 + 0.5, f'{pct_of_te:.0f}%', ha='center',
            color='white', fontsize=9)
ax.set_xticks(x_pos)
ax.set_xticklabels([f'{g}%' for g in ref_grads], color='white')
ax.set_xlabel('Gradient', color='white')
ax.set_ylabel('Grade resistance (kN)', color='white')
ax.set_title('Grade Force as % of Max TE', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 4. Effect of mass on max gradient
ax = axes[1, 1]; ax.set_facecolor('#111827')
masses = np.linspace(20000, 80000, 100)
for mu, color, label in [(0.28, '#22c55e', 'Dry'), (0.15, '#3b82f6', 'Wet')]:
    max_grads = mu * drive_weight / (masses * g) * 100
    ax.plot(masses / 1000, max_grads, color=color, linewidth=2, label=label)

ax.axvline(total_mass/1000, color='#f59e0b', linestyle=':', linewidth=1.5)
ax.text(total_mass/1000 + 0.5, 6, f'DHR: {total_mass/1000:.1f}t',
        color='#f59e0b', fontsize=9)
ax.set_xlabel('Total train mass (tonnes)', color='white')
ax.set_ylabel('Maximum climbable gradient (%)', color='white')
ax.set_title('Lighter Trains Climb Steeper Hills', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Grade resistance at reference gradients:")
print(f"{'Gradient':>10} {'F_grade (N)':>12} {'% of TE':>10} {'Can climb?':>12}")
print("-" * 48)
for gr, f in zip(ref_grads, ref_forces):
    pct = f / te_dry * 100
    can = "YES" if f < te_dry else "BARELY" if f < te_dry * 1.05 else "NO"
    print(f"{gr:>9}% {f:>12,.0f} {pct:>9.0f}% {can:>12}")`,
      challenge: 'Calculate how much lighter the train would need to be to climb a sustained 6% gradient with 20% surplus TE for acceleration. How many coaches would you need to remove?',
      successHint: 'Grade resistance is the single largest force a mountain railway must overcome. Every other force we add next sits on top of this. The fact that an 8% grade consumes nearly 100% of available TE explains why mountain railways are engineering at the limit.',
    },
    {
      title: 'Rolling Friction and Air Resistance: Total Force Model',
      concept: `Grade resistance is the dominant force, but two other forces oppose the train at all times. **Rolling resistance** acts even on flat track: F_roll = mu_roll * m * g, where mu_roll is about 0.002 for steel wheels on steel rails. For our 45-tonne train, this is a constant 882 N regardless of gradient. It sounds small compared to the grade forces, but on flat track it is the ONLY resistance, and over an 88 km journey it adds up to significant energy expenditure.

**Aerodynamic drag** is F_drag = 0.5 * rho * C_d * A * v^2, where rho is air density (about 1.225 kg/m^3 at sea level, but it decreases with altitude), C_d is the drag coefficient (about 1.0 for a blunt-fronted locomotive), A is the frontal area (about 3 m^2 for narrow gauge), and v is speed. At 18 km/h (5 m/s, typical hill railway speed), F_drag = 0.5 * 1.225 * 1.0 * 3.0 * 25 = 46 N. This is tiny compared to grade resistance. At 100 km/h (express train speed), F_drag = 5,104 N. This explains why aerodynamic drag barely matters for slow hill trains but dominates for high-speed trains.

The **total resistance** at any point is F_total = F_grade + F_roll + F_drag. The engine must exceed this total to accelerate. The maximum achievable speed on a given gradient is found by setting engine power equal to total resistance times speed: P = F_total * v. Solving for v gives the equilibrium speed where engine output exactly balances all resistance forces.`,
      analogy: 'Think of walking uphill on a sandy beach versus a paved road versus an icy slope. The hill is the same (grade resistance). The sand under your feet is rolling resistance, and the wind in your face is aerodynamic drag. On a steep hill, you barely notice the sand or wind. On flat ground, the sand makes all the difference. The relative importance of each force changes with the situation.',
      storyConnection: 'The story says Bogi was "slower than the Express." The Express runs on flat, straight track where grade resistance is zero and aerodynamic drag dominates. Bogi runs on steep gradients where grade resistance dominates and drag is negligible. Two completely different force regimes, two completely different engineering problems.',
      checkQuestion: 'At 18 km/h on a 4% gradient, what fraction of total resistance is grade resistance, rolling friction, and aerodynamic drag?',
      checkAnswer: 'F_grade = 44,900 * 9.81 * 0.04 = 17,619 N. F_roll = 0.002 * 44,900 * 9.81 = 881 N. F_drag = 0.5 * 1.225 * 1.0 * 3.0 * 5^2 = 46 N. Total = 18,546 N. Grade = 95.0%, rolling = 4.8%, drag = 0.2%. Aerodynamic drag is completely negligible for hill railways. This is why hill trains look like blunt boxes rather than sleek bullets.',
      codeIntro: 'Build the complete force model with all three resistance components and find equilibrium speed at each gradient.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Parameters
mass = 44900       # kg
g = 9.81
mu_roll = 0.002
rho_air = 1.225    # kg/m^3 at sea level
Cd = 1.0           # drag coefficient
A_front = 3.0      # m^2 frontal area
engine_kw = 150
te_max = 0.28 * (4/6) * 22000 * g  # adhesion limit

def total_resistance(gradient_pct, speed_ms, altitude_m=0):
    """Compute all resistance forces."""
    grad_dec = gradient_pct / 100
    f_grade = mass * g * grad_dec
    f_roll = mu_roll * mass * g
    # Air density decreases with altitude
    rho = rho_air * np.exp(-altitude_m / 8500)
    f_drag = 0.5 * rho * Cd * A_front * speed_ms**2
    return f_grade, f_roll, f_drag

def equilibrium_speed(gradient_pct, altitude_m=0):
    """Find speed where engine power = total resistance * speed."""
    power_w = engine_kw * 1000
    # Binary search for equilibrium speed
    v_low, v_high = 0.1, 40.0
    for _ in range(50):
        v_mid = (v_low + v_high) / 2
        fg, fr, fd = total_resistance(gradient_pct, v_mid, altitude_m)
        f_total = fg + fr + fd
        # TE available: min(P/v, adhesion limit)
        te = min(power_w / v_mid, te_max)
        if te > f_total:
            v_low = v_mid
        else:
            v_high = v_mid
    return (v_low + v_high) / 2

# Calculate across gradients
gradients = np.linspace(0, 8, 200)
eq_speeds = np.array([equilibrium_speed(gr) for gr in gradients])

# Force breakdown at typical hill speed (5 m/s = 18 km/h)
v_typical = 5.0
grades_ref = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8])
force_data = np.array([total_resistance(gr, v_typical) for gr in grades_ref])

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Complete Force Model: Grade + Rolling + Drag',
             color='white', fontsize=14, fontweight='bold')

# 1. Stacked force breakdown
ax = axes[0, 0]; ax.set_facecolor('#111827')
f_grades = force_data[:, 0] / 1000
f_rolls = force_data[:, 1] / 1000
f_drags = force_data[:, 2] / 1000
x_pos = np.arange(len(grades_ref))

ax.bar(x_pos, f_grades, 0.6, color='#ef4444', label='Grade resistance')
ax.bar(x_pos, f_rolls, 0.6, bottom=f_grades, color='#3b82f6', label='Rolling friction')
ax.bar(x_pos, f_drags, 0.6, bottom=f_grades + f_rolls, color='#22c55e', label='Aero drag')
ax.axhline(te_max / 1000, color='white', linewidth=1.5, linestyle='--', label='TE limit')
ax.set_xticks(x_pos)
ax.set_xticklabels([f'{g}%' for g in grades_ref], color='white')
ax.set_xlabel('Gradient', color='white')
ax.set_ylabel('Resistance force (kN)', color='white')
ax.set_title(f'Force Breakdown at {v_typical*3.6:.0f} km/h', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Equilibrium speed vs gradient
ax = axes[0, 1]; ax.set_facecolor('#111827')
ax.plot(gradients, eq_speeds * 3.6, color='#f59e0b', linewidth=2.5)
ax.fill_between(gradients, eq_speeds * 3.6, alpha=0.15, color='#f59e0b')
# Mark typical DHR speed
ax.axhline(18, color='gray', linestyle='--', linewidth=1, alpha=0.5)
ax.text(0.5, 19, 'Typical DHR speed: 18 km/h', color='gray', fontsize=9)

# Mark DHR gradients
for gr, name in [(2.0, 'Sukna'), (4.0, 'Tindharia'), (5.5, 'Batasia')]:
    v_eq = equilibrium_speed(gr)
    ax.plot(gr, v_eq * 3.6, 'o', color='#ef4444', markersize=8)
    ax.annotate(f'{name}\\n{gr}% = {v_eq*3.6:.0f} km/h',
                xy=(gr, v_eq * 3.6), xytext=(gr + 0.3, v_eq * 3.6 + 8),
                color='white', fontsize=8,
                arrowprops=dict(arrowstyle='->', color='gray'))

ax.set_xlabel('Gradient (%)', color='white')
ax.set_ylabel('Equilibrium speed (km/h)', color='white')
ax.set_title('Maximum Sustainable Speed vs Gradient', color='white', fontsize=12)
ax.tick_params(colors='gray')
ax.set_ylim(0)

# 3. Force proportions pie charts at two gradients
for idx, (gr, ax) in enumerate([(0, axes[1, 0]), (5, axes[1, 1])]):
    ax.set_facecolor('#111827')
    fg, fr, fd = total_resistance(gr, v_typical)
    total = fg + fr + fd
    if total < 1:
        total = fr + fd  # flat track: no grade
        fg = 0
    sizes = [fg, fr, fd]
    labels_pie = [f'Grade: {fg:.0f} N ({fg/total*100:.1f}%)',
                  f'Rolling: {fr:.0f} N ({fr/total*100:.1f}%)',
                  f'Drag: {fd:.0f} N ({fd/total*100:.1f}%)']
    colors_pie = ['#ef4444', '#3b82f6', '#22c55e']
    # Filter out zero values
    nonzero = [(s, l, c) for s, l, c in zip(sizes, labels_pie, colors_pie) if s > 0.1]
    if nonzero:
        sz, lb, cl = zip(*nonzero)
        wedges, texts = ax.pie(sz, labels=None, colors=cl, startangle=90,
                               wedgeprops=dict(edgecolor='#1f2937', linewidth=2))
        ax.legend(lb, loc='lower center', fontsize=8,
                  facecolor='#1f2937', edgecolor='gray', labelcolor='white')
    ax.set_title(f'Force Mix at {gr}% Gradient', color='white', fontsize=12)

plt.tight_layout()
plt.show()

print("Equilibrium speeds at key DHR sections:")
print(f"{'Section':<20} {'Gradient':>10} {'Max speed':>12}")
print("-" * 45)
for gr, name in [(0.5, 'Siliguri flat'), (2.0, 'Sukna climb'),
                 (3.5, 'Rangtong'), (5.0, 'Tindharia steep'),
                 (5.5, 'Batasia loop'), (3.0, 'Ghum approach')]:
    v = equilibrium_speed(gr)
    print(f"{name:<20} {gr:>9.1f}% {v*3.6:>10.1f} km/h")`,
      challenge: 'Add altitude-dependent air density (rho decreases as the train climbs from 100 m to 2,258 m). Recalculate equilibrium speeds. Does thinner air at altitude make a meaningful difference for a hill train?',
      successHint: 'The complete force model reveals a clear hierarchy: grade resistance dominates on slopes, rolling friction matters on flat sections, and aerodynamic drag is negligible at hill train speeds. This hierarchy shapes every design decision for mountain railways.',
    },
    {
      title: 'Speed vs Gradient: Why Switchbacks Exist',
      concept: `We can now answer a fundamental question in mountain railway design: at what gradient does the train become too slow to be practical, and what can engineers do about it?

A **switchback** (also called a zigzag or reversing station) lets the train climb a steep slope by going back and forth at a gentler angle, like hiking a mountain trail that zigzags rather than going straight up. The DHR has 5 switchbacks and 6 loops. At a switchback, the train climbs to the end of a siding, the driver walks to the other end, and the train reverses direction to climb the next section. Each reversal adds about 5-10 minutes but reduces the required gradient from, say, 8% to 3%.

A **loop** is even more elegant: the track spirals around in a full circle, gaining elevation with every revolution. The famous **Batasia Loop** spirals 360 degrees while gaining 42 metres of elevation over approximately 1 km of track. Without the loop, the same elevation gain would require either a 4.2% gradient over 1 km of straight track or a much shorter, impossibly steep section.

The trade-off is clear: **distance vs gradient**. To gain 100 metres of elevation at 2% gradient, you need 5 km of track. At 4%, you need 2.5 km. At 8%, just 1.25 km. But the train crawls at 8% and has barely any adhesion margin. The optimal gradient balances journey time (slower on steeper grades) against construction cost (longer track on gentler grades).`,
      analogy: 'Switchbacks are like staircases versus ladders. A ladder goes straight up and requires enormous effort per step. A staircase zigzags at a gentle angle, covering more horizontal distance but making each step easy. No one builds ladders in office buildings because humans cannot sustain the effort. Railways are the same: switchbacks are the staircases of the mountain.',
      storyConnection: 'The story says Bogi\'s route "wound through the hills like a ribbon dropped by a careless cloud." That winding is not careless at all. Every curve, every switchback, every loop was precisely calculated to keep the gradient within Bogi\'s adhesion limits. The ribbon is an engineer\'s masterpiece disguised as a meandering path.',
      checkQuestion: 'A hill railway needs to gain 500 m of elevation. Route A uses a direct 6% gradient. Route B uses switchbacks at 2.5% gradient. Calculate the track length and journey time for each (assume equilibrium speed at each gradient).',
      checkAnswer: 'Route A: track length = 500/0.06 = 8,333 m = 8.3 km. At 6% gradient, equilibrium speed is about 8 km/h, so time = 8.3/8 = 1.04 hours plus 0 reversal time. Route B: track length = 500/0.025 = 20,000 m = 20 km. At 2.5%, speed is about 22 km/h, so time = 20/22 = 0.91 hours plus maybe 20 min for reversals = 1.24 hours. Route B is actually SLOWER in total despite the gentler gradient, because the extra track distance outweighs the speed advantage. This is the core design trade-off.',
      codeIntro: 'Simulate different route strategies for the same elevation gain and find the optimal gradient.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Parameters from previous lessons
mass = 44900; g = 9.81; mu_roll = 0.002
rho = 1.225; Cd = 1.0; A_front = 3.0
engine_kw = 150
te_max = 0.28 * (4/6) * 22000 * g

def eq_speed(grad_pct):
    """Equilibrium speed at a given gradient."""
    power = engine_kw * 1000
    v_lo, v_hi = 0.1, 40.0
    for _ in range(50):
        v = (v_lo + v_hi) / 2
        f = mass*g*(grad_pct/100) + mu_roll*mass*g + 0.5*rho*Cd*A_front*v**2
        te = min(power / v, te_max)
        if te > f: v_lo = v
        else: v_hi = v
    return (v_lo + v_hi) / 2

# Route comparison: gain 2,000 m elevation (like NJP to Ghum)
elev_gain = 2000  # metres
reversal_time_min = 8  # minutes per switchback reversal

gradients_test = np.linspace(0.5, 8, 200)
track_lengths = elev_gain / (gradients_test / 100)  # metres
speeds = np.array([eq_speed(gr) for gr in gradients_test])
travel_times = track_lengths / speeds / 3600  # hours

# Switchbacks needed: assume each switchback section is 1 km long
# At low gradients: 0 switchbacks needed
# At high gradients: use switchbacks to split into manageable sections
n_switchbacks = np.zeros_like(gradients_test)
for i, gr in enumerate(gradients_test):
    if gr > 4.0:
        # Need switchbacks for sustained steep sections
        n_switchbacks[i] = max(0, int((gr - 4.0) * 3))

reversal_overhead = n_switchbacks * reversal_time_min / 60  # hours
total_time = travel_times + reversal_overhead

# Construction cost model (relative)
cost_per_km_base = 1.0  # flat track
curve_penalty = 1 + 0.1 * n_switchbacks  # switchbacks add cost
cost_total = track_lengths / 1000 * cost_per_km_base * curve_penalty

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Route Design: {elev_gain}m Elevation Gain',
             color='white', fontsize=14, fontweight='bold')

# 1. Speed vs gradient
ax = axes[0, 0]; ax.set_facecolor('#111827')
ax.plot(gradients_test, speeds * 3.6, color='#3b82f6', linewidth=2.5)
ax.fill_between(gradients_test, speeds * 3.6, alpha=0.15, color='#3b82f6')
ax.set_xlabel('Gradient (%)', color='white')
ax.set_ylabel('Equilibrium speed (km/h)', color='white')
ax.set_title('Speed Drops Sharply on Steep Grades', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Mark the "practical minimum" speed
ax.axhline(8, color='#ef4444', linestyle='--', linewidth=1)
ax.text(1, 9, 'Practical minimum: 8 km/h', color='#ef4444', fontsize=9)

# 2. Track length vs gradient
ax = axes[0, 1]; ax.set_facecolor('#111827')
ax.plot(gradients_test, track_lengths / 1000, color='#f59e0b', linewidth=2.5)
ax.fill_between(gradients_test, track_lengths / 1000, alpha=0.15, color='#f59e0b')
ax.set_xlabel('Gradient (%)', color='white')
ax.set_ylabel('Track length (km)', color='white')
ax.set_title('Gentler Slopes Need Longer Track', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Mark DHR actual length
ax.axhline(88, color='gray', linestyle='--', linewidth=1, alpha=0.5)
ax.text(5, 92, 'DHR actual: 88 km', color='gray', fontsize=9)

# 3. Journey time breakdown
ax = axes[1, 0]; ax.set_facecolor('#111827')
ax.plot(gradients_test, travel_times, color='#22c55e', linewidth=2,
        label='Travel time')
ax.plot(gradients_test, reversal_overhead, color='#ef4444', linewidth=2,
        label='Reversal overhead')
ax.plot(gradients_test, total_time, color='#a855f7', linewidth=2.5,
        label='Total time')
ax.fill_between(gradients_test, total_time, alpha=0.1, color='#a855f7')

# Find optimal
optimal_idx = np.argmin(total_time)
opt_grad = gradients_test[optimal_idx]
opt_time = total_time[optimal_idx]
ax.plot(opt_grad, opt_time, 'o', color='#f59e0b', markersize=10, zorder=5)
ax.annotate(f'Optimal: {opt_grad:.1f}% gradient\\n{opt_time:.1f} hours',
            xy=(opt_grad, opt_time), xytext=(opt_grad + 1.5, opt_time + 1),
            color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax.set_xlabel('Gradient (%)', color='white')
ax.set_ylabel('Time (hours)', color='white')
ax.set_title('Journey Time: Travel + Reversals', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 4. Compare three real routes
ax = axes[1, 1]; ax.set_facecolor('#111827')
routes = [
    ('DHR actual\\n(mixed 2-5.5%)', 88, 7.0, 5),
    ('Direct 3%\\n(no switchbacks)', elev_gain/0.03/1000, 0, 0),
    ('Direct 6%\\n(with switchbacks)', elev_gain/0.06/1000, 0, 12),
    ('Gentle 1.5%\\n(long route)', elev_gain/0.015/1000, 0, 0),
]
x_pos = np.arange(len(routes))
times = []
for name, length, preset_time, n_sb in routes:
    if preset_time > 0:
        times.append(preset_time)
    else:
        avg_grad = elev_gain / (length * 1000) * 100
        v = eq_speed(avg_grad)
        t = length / (v * 3.6) + n_sb * reversal_time_min / 60
        times.append(t)

colors_bar = ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6']
bars = ax.bar(x_pos, times, 0.6, color=colors_bar)
for bar, t, (name, length, _, _) in zip(bars, times, routes):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.15,
            f'{t:.1f}h\\n{length:.0f}km', ha='center', color='white', fontsize=9)

ax.set_xticks(x_pos)
ax.set_xticklabels([r[0] for r in routes], color='white', fontsize=8)
ax.set_ylabel('Journey time (hours)', color='white')
ax.set_title('Route Strategy Comparison', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Optimal gradient: {opt_grad:.1f}%")
print(f"  Track length: {elev_gain / (opt_grad/100) / 1000:.0f} km")
print(f"  Speed: {eq_speed(opt_grad)*3.6:.0f} km/h")
print(f"  Journey time: {opt_time:.1f} hours")
print(f"\\nDHR chose mixed gradients (2-5.5%) with switchbacks and loops,")
print(f"achieving a 7-hour journey over 88 km. This is close to optimal.")`,
      challenge: 'Add a fuel consumption dimension to the analysis. Steeper gradients consume more coal per km (higher force at lower speed means lower efficiency). Find the gradient that minimizes total fuel consumption for the 2,000 m climb.',
      successHint: 'Switchbacks and loops are not compromises; they are the optimal engineering solution for climbing mountains by rail. The DHR engineers in the 1880s solved this optimization problem empirically, arriving at almost exactly the same answer that our simulation finds computationally.',
    },
    {
      title: 'Speed-Gradient Plot and the Performance Envelope',
      concept: `We now bring everything together into a single visualization that railway engineers actually use: the **speed-gradient diagram**, also called the **performance envelope**. This plot shows, for any combination of gradient and speed, whether the train can accelerate, maintain speed, or must decelerate.

The envelope has three regions. In the **acceleration zone** (below the equilibrium curve), the engine produces more force than total resistance, so the train speeds up. On the **equilibrium curve** itself, forces balance exactly and speed is constant. Above the equilibrium curve is the **deceleration zone**, where resistance exceeds engine force and the train must slow down or brake.

The envelope shifts when conditions change. Wet rails lower the adhesion limit, compressing the acceleration zone from above. Lighter load (after burning coal and using water) expands it slightly. Headwind shifts the drag curve. By plotting multiple envelopes on the same axes, we can see how weather, loading, and track condition affect the train's capability.

We also compute the **energy budget** for the full DHR journey: how much chemical energy (coal) is converted to useful work (lifting the train against gravity and overcoming friction), heat in the boiler, heat in the brakes, and energy lost to the atmosphere. A steam locomotive converts only about 8% of coal energy into useful work. The rest is exhaust heat, radiation, and friction.`,
      analogy: 'The performance envelope is like a fitness test chart for athletes. For each combination of incline and treadmill speed, it tells you whether the athlete can maintain pace, speed up, or will slow down. The envelope boundary is the athlete\'s maximum sustainable effort. Everything inside the boundary is achievable; everything outside is unsustainable.',
      storyConnection: 'When the story says the Northeast Express "roared through in two hours flat," that Express has a completely different performance envelope: higher power, higher adhesion (heavier train on broader gauge), lower gradients (tunnels and viaducts cut through the hills). Its envelope is wider and higher. Bogi\'s envelope is narrow and low, constrained by her small engine and steep gradients. But Bogi\'s envelope includes the tiny villages that the Express cannot reach.',
      checkQuestion: 'On the performance envelope, what happens when the equilibrium speed at a given gradient drops below about 5 km/h? Why is this a practical problem even if the physics allows it?',
      checkAnswer: 'Below about 5 km/h, the train moves so slowly that (1) it takes impractically long to cover any distance, (2) the boiler cools faster than it generates steam at such low power output, (3) the train is vulnerable to slipping because even minor rail contamination can break adhesion at low speed, and (4) passengers will not tolerate it. There is an effective minimum speed below which the railway is not operationally viable, even though the physics would technically allow the train to crawl.',
      codeIntro: 'Build the complete performance envelope and energy budget for the DHR journey.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Full train specification
mass = 44900; g = 9.81; mu_roll = 0.002
rho_sea = 1.225; Cd = 1.0; A_front = 3.0
engine_kw = 150
drive_weight_n = (4/6) * 22000 * g

# Conditions to compare
conditions = {
    'Dry rail': {'mu': 0.28, 'color': '#22c55e'},
    'Damp rail': {'mu': 0.20, 'color': '#3b82f6'},
    'Wet rail': {'mu': 0.15, 'color': '#f59e0b'},
    'Leaves on rail': {'mu': 0.08, 'color': '#ef4444'},
}

def eq_speed_cond(grad_pct, mu_adhesion, mass_kg=mass):
    """Equilibrium speed under specific conditions."""
    power = engine_kw * 1000
    te_limit = mu_adhesion * drive_weight_n
    v_lo, v_hi = 0.1, 40.0
    for _ in range(50):
        v = (v_lo + v_hi) / 2
        f = mass_kg*g*(grad_pct/100) + mu_roll*mass_kg*g + 0.5*rho_sea*Cd*A_front*v**2
        te = min(power / max(v, 0.1), te_limit)
        if te > f: v_lo = v
        else: v_hi = v
    return max((v_lo + v_hi) / 2, 0)

gradients = np.linspace(0, 9, 200)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Mountain Railway Performance Envelope',
             color='white', fontsize=14, fontweight='bold')

# 1. Performance envelope — multi-condition
ax = axes[0, 0]; ax.set_facecolor('#111827')
for name, cond in conditions.items():
    speeds = np.array([eq_speed_cond(gr, cond['mu']) for gr in gradients])
    ax.plot(gradients, speeds * 3.6, color=cond['color'], linewidth=2, label=name)
    ax.fill_between(gradients, speeds * 3.6, alpha=0.05, color=cond['color'])

# Shade acceleration/deceleration zones for dry condition
dry_speeds = np.array([eq_speed_cond(gr, 0.28) for gr in gradients])
ax.fill_between(gradients, 0, dry_speeds * 3.6, alpha=0.08, color='#22c55e')
ax.text(1, 5, 'ACCELERATION\\nZONE', color='#22c55e', fontsize=10, alpha=0.7)
ax.text(5, 35, 'DECELERATION\\nZONE', color='#ef4444', fontsize=10, alpha=0.7)

ax.axhline(5, color='gray', linestyle=':', linewidth=1, alpha=0.5)
ax.text(7, 6, 'Min viable speed', color='gray', fontsize=8)
ax.set_xlabel('Gradient (%)', color='white')
ax.set_ylabel('Equilibrium speed (km/h)', color='white')
ax.set_title('Speed-Gradient Envelope by Rail Condition', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_ylim(0, 50)

# 2. Effect of train mass on envelope (dry only)
ax = axes[0, 1]; ax.set_facecolor('#111827')
masses_test = [30000, 40000, 50000, 60000]
mass_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for m, color in zip(masses_test, mass_colors):
    speeds = np.array([eq_speed_cond(gr, 0.28, m) for gr in gradients])
    ax.plot(gradients, speeds * 3.6, color=color, linewidth=2,
            label=f'{m/1000:.0f} tonnes')
ax.set_xlabel('Gradient (%)', color='white')
ax.set_ylabel('Equilibrium speed (km/h)', color='white')
ax.set_title('Envelope Shifts with Train Mass', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_ylim(0, 60)

# 3. DHR route simulation with energy budget
ax = axes[1, 0]; ax.set_facecolor('#111827')
# DHR route data
dist_km = np.array([0, 11, 18, 25, 32, 38, 44, 51, 55])
elev_m = np.array([100, 250, 530, 860, 1483, 1700, 1950, 2258, 2076])
stations = ['NJP', 'Sukna', 'Rangtong', 'Tindharia',
            'Kurseong', 'Tung', 'Sonada', 'Ghum', 'Darjeeling']

# Interpolate to fine resolution
x_fine = np.linspace(0, 55, 500)
e_fine = np.interp(x_fine, dist_km, elev_m)

# Compute local gradient
dx = x_fine[1] - x_fine[0]
local_grad = np.diff(e_fine) / (dx * 1000) * 100
local_grad = np.append(local_grad, local_grad[-1])

# Energy components
e_gravity = np.cumsum(np.maximum(np.diff(e_fine), 0)) * mass * g / 1e6
e_gravity = np.insert(e_gravity, 0, 0)
e_roll = np.cumsum(np.ones(len(x_fine)) * mu_roll * mass * g * dx * 1000 / 1e6)
local_speed = np.array([eq_speed_cond(abs(gr), 0.28) for gr in local_grad])
e_drag = np.cumsum(0.5 * rho_sea * Cd * A_front * local_speed**2 * dx * 1000 / 1e6)

ax.plot(x_fine, e_gravity, color='#ef4444', linewidth=2, label='Gravity work')
ax.plot(x_fine, e_roll, color='#3b82f6', linewidth=2, label='Rolling friction')
ax.plot(x_fine, e_drag, color='#22c55e', linewidth=2, label='Aero drag')
ax.plot(x_fine, e_gravity + e_roll + e_drag, color='white', linewidth=2.5,
        linestyle='--', label='Total useful work')

for d, name in zip(dist_km, stations):
    if name in ['NJP', 'Kurseong', 'Ghum', 'Darjeeling']:
        ax.axvline(d, color='gray', linewidth=0.5, linestyle=':', alpha=0.5)

ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Cumulative energy (MJ)', color='white')
ax.set_title('Energy Budget Along the Route', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 4. Overall energy Sankey-style breakdown
ax = axes[1, 1]; ax.set_facecolor('#111827')
total_useful = (e_gravity[-1] + e_roll[-1] + e_drag[-1])
coal_kg = 1200  # approximate coal consumed
coal_energy = coal_kg * 29  # MJ
boiler_eff = 0.08
mechanical_energy = coal_energy * boiler_eff
exhaust_heat = coal_energy * 0.70
radiation_heat = coal_energy * 0.12
friction_loss = coal_energy * 0.10 - total_useful

categories = ['Coal input', 'Exhaust\\nheat', 'Radiation', 'Mech.\\nfriction',
              'Gravity\\nwork', 'Rolling\\nfriction', 'Aero\\ndrag']
values = [coal_energy, exhaust_heat, radiation_heat * 1000 / 1000,
          max(friction_loss, 0), e_gravity[-1], e_roll[-1], e_drag[-1]]
bar_colors = ['#f59e0b', '#ef4444', '#ef4444', '#ef4444',
              '#22c55e', '#3b82f6', '#a855f7']

# Normalize to percentage of coal input
pcts = [v / coal_energy * 100 for v in values]
bars = ax.barh(categories, pcts, color=bar_colors, height=0.6)
for bar, pct, val in zip(bars, pcts, values):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{pct:.1f}% ({val:.0f} MJ)', va='center', color='white', fontsize=9)

ax.set_xlabel('Percentage of coal energy', color='white')
ax.set_title('Where Does the Coal Energy Go?', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

efficiency = total_useful / coal_energy * 100
print(f"Energy analysis:")
print(f"  Coal consumed: {coal_kg} kg = {coal_energy:,.0f} MJ")
print(f"  Useful work: {total_useful:.0f} MJ ({efficiency:.1f}% of coal)")
print(f"    Gravity: {e_gravity[-1]:.0f} MJ")
print(f"    Rolling: {e_roll[-1]:.0f} MJ")
print(f"    Drag:    {e_drag[-1]:.0f} MJ")
print(f"  Overall thermal efficiency: ~{boiler_eff*100:.0f}%")
print(f"  92% of coal energy is lost as heat.")`,
      challenge: 'Add a downhill section (Ghum to Darjeeling drops 182 m). Model regenerative braking: how much energy could be recovered if the train had electric motors? Compare steam (no recovery) vs hypothetical electric (70% recovery on downhill sections).',
      successHint: 'The performance envelope is the complete picture of what the train can do under any combination of gradient, speed, weather, and load. Railway engineers use exactly this type of diagram to plan schedules, set speed limits, and decide where switchbacks are needed.',
    },
    {
      title: 'Full Journey Simulation: Putting It All Together',
      concept: `This final lesson integrates every component into a complete simulation of Bogi's journey from New Jalpaiguri (100 m) to Darjeeling (2,076 m). The simulator tracks six quantities at 100-metre resolution along the 88 km route: **speed** (from the force balance), **fuel consumed** (from engine power output divided by thermal efficiency), **water used** (proportional to steam generated), **brake temperature** (from braking energy divided by brake mass and specific heat), **journey time** (cumulative), and **adhesion margin** (surplus TE as a percentage of grade resistance).

The simulation uses a simple control strategy that mimics a real driver. Below target speed on an uphill section, the engine produces maximum power. Above target speed (particularly on the downhill Ghum-to-Darjeeling section), brakes are applied to maintain safe speed. At stations, the train decelerates to a stop, waits for a scheduled time, then accelerates again. The Kurseong station includes a water refill that resets the water tank.

The output is a comprehensive dashboard showing the full journey profile. This is a simplified version of the **Train Performance Calculator (TPC)** software that real railway engineers use worldwide. Professional TPC software includes more detailed models (coupler forces between coaches, curve superelevation, wind profiles, driver reaction times), but the fundamental physics is identical to what we have built.`,
      analogy: 'This simulation is like a flight recorder playback for an entire journey. Every second of the trip is captured: where the engine was working hard, where it was coasting, where the brakes were heating up, where fuel was being burned fastest. A real railway would use this data to optimize schedules, train crews, and maintenance intervals.',
      storyConnection: 'This is Bogi\'s entire story, told in numbers. The first half of the journey, climbing from the plains to Ghum at 2,258 m, is the story\'s central struggle: the little train that goes where the big trains cannot. The final descent to Darjeeling at 2,076 m, where brakes must absorb the energy that gravity releases, is Bogi\'s quiet competence. Every data point in our simulation corresponds to a moment in Bogi\'s daily journey.',
      checkQuestion: 'The simulation shows brake temperature spiking on the descent from Ghum to Darjeeling. Why is this a safety concern, and what does the railway do about it in practice?',
      checkAnswer: 'Brake pads lose friction (called "brake fade") when they overheat, typically above 400 degrees C for cast iron. If brakes fade on a downhill section, the train accelerates uncontrollably. The DHR addresses this with: (1) multiple independent brake systems (air brakes, hand brakes, rail brakes), (2) strict speed limits on descents, (3) water-cooled brake blocks on some trains, and (4) catch sidings (uphill dead-end tracks) at the bottom of steep descents that can stop a runaway train.',
      codeIntro: 'Run the complete journey simulation and generate the final performance dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# COMPLETE JOURNEY SIMULATION: NJP to Darjeeling
# ============================================================

# Route data
stations = ['NJP', 'Sukna', 'Rangtong', 'Tindharia',
            'Kurseong', 'Tung', 'Sonada', 'Ghum', 'Darjeeling']
dist_km = np.array([0, 11, 18, 25, 32, 38, 44, 51, 55])
elev_m = np.array([100, 250, 530, 860, 1483, 1700, 1950, 2258, 2076])
stop_min = np.array([0, 5, 3, 5, 15, 3, 5, 10, 0])  # station dwell time

# Train parameters
mass_base = 40000  # kg (loco + coaches without consumables)
coal_start = 1500  # kg
water_start = 3400 # kg
g = 9.81
mu_roll = 0.002; mu_adhesion = 0.28
engine_kw = 150
drive_weight_n = (4/6) * 22000 * g
te_max = mu_adhesion * drive_weight_n
coal_energy_mj = 29; boiler_eff = 0.08
brake_mass = 400; brake_cp = 500  # J/(kg*K)
ambient_temp = 15; brake_cool_rate = 0.005

# Simulation grid: 100m resolution
dx = 100  # metres
total_dist = dist_km[-1] * 1000
x_pts = np.arange(0, total_dist, dx)
n = len(x_pts)

# Interpolate elevation
elev = np.interp(x_pts / 1000, dist_km, elev_m)
grad_pct = np.diff(elev) / dx * 100
grad_pct = np.append(grad_pct, grad_pct[-1])

# State arrays
speed = np.zeros(n)
coal_used = np.zeros(n)
water_used = np.zeros(n)
brake_temp = np.full(n, ambient_temp)
time_sec = np.zeros(n)
adhesion_margin = np.zeros(n)

target_speed = 5.0  # m/s (18 km/h)
coal_remaining = coal_start
water_remaining = water_start

for i in range(1, n):
    v = max(speed[i-1], 0.3)
    current_mass = mass_base + coal_remaining + water_remaining
    grad = grad_pct[i]

    # Forces
    f_grade = current_mass * g * grad / 100
    f_roll = mu_roll * current_mass * g
    f_drag = 0.5 * 1.225 * 1.0 * 3.0 * v**2
    f_total_resist = f_grade + f_roll + f_drag

    # Check if at a station (within 200m of station position)
    at_station = False
    for sd, st in zip(dist_km, stop_min):
        if abs(x_pts[i]/1000 - sd) < 0.2 and st > 0:
            at_station = True
            # Water refill at Kurseong
            if abs(sd - 32) < 1:
                water_remaining = water_start
            break

    # Driver control
    if at_station and v < 1.0:
        f_engine = 0; f_brake = 0
    elif grad > 0 and v < target_speed:
        # Climbing: full power
        f_engine = min(engine_kw * 1000 / max(v, 0.5), te_max)
        f_brake = 0
    elif grad < -1 and v > target_speed * 1.2:
        # Descending too fast: brake
        f_engine = 0
        f_brake = min(abs(v - target_speed) * current_mass / 8, te_max)
    elif v > target_speed * 1.3:
        # Over speed on any section
        f_engine = 0
        f_brake = (v - target_speed) * current_mass / 10
    else:
        # Coast or gentle power
        if f_total_resist > 0 and v < target_speed:
            f_engine = min(f_total_resist * 1.1, te_max)
        else:
            f_engine = 0
        f_brake = 0

    # Physics update
    f_net = f_engine - f_total_resist - f_brake
    accel = f_net / current_mass
    dt = dx / max(v, 0.3)

    speed[i] = max(0.3, v + accel * dt)
    time_sec[i] = time_sec[i-1] + dt

    # Fuel consumption
    if f_engine > 0:
        work_mj = f_engine * dx / 1e6
        coal_kg = work_mj / (coal_energy_mj * boiler_eff)
        coal_remaining = max(0, coal_remaining - coal_kg)
        water_kg = coal_kg * 6  # ~6 kg water per kg coal
        water_remaining = max(0, water_remaining - water_kg)
    coal_used[i] = coal_start - coal_remaining
    water_used[i] = water_start - (water_remaining if water_remaining < water_start else water_start)

    # Brake temperature
    if f_brake > 0:
        heat = f_brake * dx / (brake_mass * brake_cp)
        brake_temp[i] = brake_temp[i-1] + heat
    else:
        brake_temp[i] = brake_temp[i-1]
    brake_temp[i] -= brake_cool_rate * (brake_temp[i] - ambient_temp) * dt

    # Adhesion margin
    if abs(f_grade) > 0:
        adhesion_margin[i] = (te_max - abs(f_grade)) / te_max * 100
    else:
        adhesion_margin[i] = 100

# --- Dashboard ---
fig, axes = plt.subplots(3, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Darjeeling Himalayan Railway: Complete Journey Dashboard',
             color='white', fontsize=15, fontweight='bold')

# Station markers helper
def mark_stations(ax, y_data=None):
    for d, name in zip(dist_km, stations):
        if name in ['NJP', 'Kurseong', 'Ghum', 'Darjeeling']:
            ax.axvline(d, color='gray', linewidth=0.5, linestyle=':', alpha=0.4)

# 1. Elevation + Speed
ax = axes[0, 0]; ax.set_facecolor('#111827')
ax.plot(x_pts/1000, elev, color='#22c55e', linewidth=2, label='Elevation')
ax.fill_between(x_pts/1000, elev, alpha=0.1, color='#22c55e')
ax2 = ax.twinx()
ax2.plot(x_pts/1000, speed * 3.6, color='#3b82f6', linewidth=1.5, alpha=0.8, label='Speed')
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Elevation (m)', color='#22c55e')
ax2.set_ylabel('Speed (km/h)', color='#3b82f6')
ax.set_title('Elevation Profile & Speed', color='white', fontsize=12)
ax.tick_params(colors='gray'); ax2.tick_params(colors='gray')
mark_stations(ax)

# 2. Gradient profile
ax = axes[0, 1]; ax.set_facecolor('#111827')
ax.fill_between(x_pts/1000, grad_pct, color='#3b82f6', alpha=0.3)
ax.plot(x_pts/1000, grad_pct, color='#3b82f6', linewidth=1)
ax.axhline(0, color='gray', linewidth=0.5)
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Gradient (%)', color='white')
ax.set_title('Track Gradient', color='white', fontsize=12)
ax.tick_params(colors='gray')
mark_stations(ax)

# 3. Fuel consumption
ax = axes[1, 0]; ax.set_facecolor('#111827')
ax.plot(x_pts/1000, coal_used, color='#f59e0b', linewidth=2, label='Coal used')
ax.fill_between(x_pts/1000, coal_used, alpha=0.15, color='#f59e0b')
mark_stations(ax)
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Coal consumed (kg)', color='white')
ax.set_title('Cumulative Coal Consumption', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 4. Brake temperature
ax = axes[1, 1]; ax.set_facecolor('#111827')
ax.plot(x_pts/1000, brake_temp, color='#ef4444', linewidth=2)
ax.axhline(400, color='#f59e0b', linestyle='--', linewidth=1, label='Fade threshold')
ax.fill_between(x_pts/1000, brake_temp, ambient_temp, alpha=0.15, color='#ef4444')
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Brake temperature (C)', color='white')
ax.set_title('Brake Temperature', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')
mark_stations(ax)

# 5. Adhesion margin
ax = axes[2, 0]; ax.set_facecolor('#111827')
ax.plot(x_pts/1000, adhesion_margin, color='#a855f7', linewidth=1.5)
ax.fill_between(x_pts/1000, adhesion_margin, alpha=0.1, color='#a855f7')
ax.axhline(0, color='#ef4444', linewidth=1.5, linestyle='--', label='Zero margin (slip)')
ax.axhline(20, color='#f59e0b', linewidth=1, linestyle=':', label='20% safety buffer')
ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Adhesion margin (%)', color='white')
ax.set_title('Adhesion Safety Margin', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
mark_stations(ax)

# 6. Summary panel
ax = axes[2, 1]; ax.set_facecolor('#111827'); ax.axis('off')
hours = time_sec[-1] / 3600
avg_speed = total_dist / 1000 / hours
summary = f"""Journey Summary: NJP to Darjeeling

  Distance:          {total_dist/1000:.0f} km
  Elevation gain:    {max(elev) - elev[0]:.0f} m
  Max gradient:      {max(grad_pct):.1f}%

  Journey time:      {hours:.1f} hours
  Average speed:     {avg_speed:.1f} km/h
  Peak speed:        {max(speed)*3.6:.0f} km/h

  Coal consumed:     {coal_used[-1]:.0f} kg / {coal_start} kg
  Peak brake temp:   {max(brake_temp):.0f} C
  Brake fade:        {'YES' if max(brake_temp) > 400 else 'No'}
  Min adhesion:      {min(adhesion_margin):.0f}%

  Thermal efficiency: ~8%
  92% of coal energy lost as heat"""

ax.text(0.05, 0.95, summary, transform=ax.transAxes, fontsize=11,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print(f"Simulation complete: {n} data points at {dx}m resolution.")
print(f"Journey time: {hours:.1f} hours ({time_sec[-1]/60:.0f} minutes)")
print(f"Average speed: {avg_speed:.1f} km/h")
print(f"Coal consumed: {coal_used[-1]:.0f} kg")
print(f"Peak brake temp: {max(brake_temp):.0f} C")`,
      challenge: 'Add weather effects: simulate a monsoon journey where adhesion drops to 0.15 (wet rails), visibility limits speed to 12 km/h, and there is a 30-minute landslide delay between Tindharia and Kurseong. Compare the dry and monsoon dashboards side by side. This is the full reality of running a mountain railway.',
      successHint: 'You have built a complete Train Performance Calculator from first principles. Every component, from the specification database through grade resistance, friction, drag, switchback analysis, and the performance envelope, feeds into this final simulation. This is real railway engineering, inspired by the little train that goes where the big trains cannot.',
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
