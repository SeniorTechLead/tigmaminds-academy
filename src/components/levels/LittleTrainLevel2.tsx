import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LittleTrainLevel2() {
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
      title: 'Tractive effort calculations — the math of pulling power',
      concept: `**Tractive effort (TE)** is the force a locomotive exerts at the wheel-rail interface to move the train. It is the single most important performance metric of any locomotive.

For a steam locomotive, TE is calculated from cylinder dimensions:
**TE = (c × P × d² × s) / D**
- c: constant (~0.85 for simple expansion)
- P: boiler pressure (psi or kPa)
- d: cylinder diameter
- s: piston stroke
- D: driving wheel diameter

For a diesel or electric, TE depends on motor torque and gear ratio:
**TE = (Motor torque × gear ratio × efficiency) / wheel radius**

TE must overcome the **train resistance**, which has components:
1. **Rolling resistance**: Fr = μr × W (weight × coefficient)
2. **Grade resistance**: Fg = W × sin(θ) ≈ W × gradient
3. **Curve resistance**: Fc ≈ W × 700/R (R = curve radius in metres)
4. **Air resistance**: Fa = 0.5 × Cd × A × ρ × v² (negligible at low speed)

The train accelerates when TE > total resistance. It maintains speed when TE = resistance. It decelerates when TE < resistance.

For the hill train: at 15 km/h on a 1-in-25 grade with a 200 m radius curve, the resistance is dominated by grade (~40 kN) and curve (~28 kN) forces, with rolling resistance (~1.6 kN) and air resistance (~0.1 kN) being minor.`,
      analogy: 'Tractive effort vs train resistance is like a tug-of-war. The engine pulls (TE) and gravity, friction, and curves pull back (resistance). If the engine is stronger, the train accelerates. If they balance, speed is constant. If resistance wins, the train slows and eventually stalls. The engineer must constantly judge this balance, adjusting power to the terrain.',
      storyConnection: 'The little train\'s driver knows every curve, every gradient, every stretch where the engine needs full power and every downhill where the brakes must be applied. On the steepest grades, the driver opens the regulator wide, the fireman stokes the boiler to maximum pressure, and every Newton of tractive effort is deployed. It is a battle of physics — engine power against gravity.',
      checkQuestion: 'A locomotive has a TE of 80 kN. The train weighs 200 tonnes on a 1-in-50 grade. Can it pull the train up the hill? (Assume rolling resistance coefficient of 0.002.)',
      checkAnswer: 'Grade resistance = 200,000 × 9.81 × (1/50) = 39,240 N = 39.2 kN. Rolling resistance = 0.002 × 200,000 × 9.81 = 3,924 N = 3.9 kN. Total resistance ≈ 43.1 kN. TE (80 kN) > resistance (43.1 kN), so yes — the train can climb. Surplus TE of 36.9 kN provides acceleration: a = F/m = 36,900/200,000 = 0.18 m/s². It will reach a steady speed where air + curve resistance equal the surplus.',
      codeIntro: 'Calculate tractive effort and train resistance to determine maximum speed on different gradients.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Locomotive: diesel-hydraulic hill engine
engine_power = 400  # kW
wheel_radius = 0.45  # m
engine_efficiency = 0.85

# Train properties
train_mass = 120000  # kg (120 tonnes total)
g = 9.81

# Speed range
speeds_ms = np.linspace(0.5, 15, 200)  # m/s
speeds_kmh = speeds_ms * 3.6

# Tractive effort (power-limited)
te_power = engine_power * 1000 * engine_efficiency / speeds_ms / 1000  # kN

# Adhesion limit
mu = 0.30
adhesion_mass = 50000  # kg on driving wheels
te_adhesion = mu * adhesion_mass * g / 1000  # kN
te = np.minimum(te_power, te_adhesion)

# Resistance components at various gradients
gradients = [0, 1/80, 1/40, 1/25]
gradient_labels = ['Flat', '1-in-80', '1-in-40', '1-in-25']
colors_grad = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# TE vs speed with resistance lines
ax1.set_facecolor('#111827')
ax1.plot(speeds_kmh, te, color='white', linewidth=3, label='Available TE')
ax1.axhline(te_adhesion, color='#94a3b8', linestyle=':', linewidth=1, label=f'Adhesion limit ({te_adhesion:.0f} kN)')

max_speeds = []
for grad, label, color in zip(gradients, gradient_labels, colors_grad):
    # Total resistance
    roll = 0.002 * train_mass * g / 1000  # kN
    grade = train_mass * g * grad / 1000  # kN
    air = 0.5 * 1.0 * 8 * 1.225 * speeds_ms**2 / 1000  # kN (Cd=1, A=8m²)
    total_r = roll + grade + air

    ax1.plot(speeds_kmh, total_r, color=color, linewidth=2, label=f'{label}: {roll+grade:.1f}+ kN')

    # Find max speed (where TE = resistance)
    diff = te - total_r
    cross_idx = np.where(diff[:-1] * diff[1:] < 0)[0]
    if len(cross_idx) > 0:
        max_speed = speeds_kmh[cross_idx[0]]
        max_speeds.append((label, max_speed))
        ax1.plot(max_speed, te[cross_idx[0]], 'o', color=color, markersize=10)
    else:
        max_speeds.append((label, 0 if diff[0] < 0 else speeds_kmh[-1]))

ax1.set_xlabel('Speed (km/h)', color='white')
ax1.set_ylabel('Force (kN)', color='white')
ax1.set_title('Tractive Effort vs Train Resistance', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')

# Acceleration at 10 km/h for each gradient
ax2.set_facecolor('#111827')
speed_10 = 10 / 3.6  # m/s
te_at_10 = min(engine_power * 1000 * engine_efficiency / speed_10, te_adhesion * 1000)

accels = []
for grad, label, color in zip(gradients, gradient_labels, colors_grad):
    resistance = (0.002 * train_mass * g) + (train_mass * g * grad) + (0.5 * 1.0 * 8 * 1.225 * speed_10**2)
    net_force = te_at_10 - resistance
    accel = net_force / train_mass
    accels.append(accel)

bars = ax2.bar(gradient_labels, accels, color=colors_grad, alpha=0.8, width=0.5)
ax2.axhline(0, color='white', linewidth=1)
ax2.set_ylabel('Acceleration (m/s²)', color='white')
ax2.set_title('Acceleration at 10 km/h', color='white', fontsize=13)
ax2.tick_params(colors='gray')
for bar, acc in zip(bars, accels):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
             f'{acc:.2f}', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(f"Hill train performance (120t, 400kW, μ={mu}):")
print(f"  Adhesion limit: {te_adhesion:.0f} kN")
for label, speed in max_speeds:
    print(f"  {label}: max speed {speed:.0f} km/h")
print()
print("Key: the steeper the grade, the slower the train must go.")
print("At 1-in-25, the train crawls at walking pace — but it climbs!")`,
      challenge: 'The train approaches a 1-in-25 grade that is also on a 200 m radius curve. Add curve resistance (Fc = W × 700/R in Newtons) to the grade resistance. Can the train still climb? What is the new max speed?',
      successHint: 'Tractive effort calculations are the bread and butter of railway engineering. Every new locomotive is designed around these numbers, and every timetable is built on the speed limits they impose.',
    },
    {
      title: 'Braking physics — the science of stopping safely',
      concept: `Climbing a hill is hard. Coming down is dangerous. A 120-tonne train descending a 1-in-25 grade has gravity pulling it forward with ~47 kN of force. Without brakes, it accelerates at ~0.4 m/s² — reaching 100 km/h in about 70 seconds.

**Braking systems**:
1. **Friction brakes**: brake shoes pressed against wheels or discs. Convert kinetic energy to heat.
   - Brake force = μ_brake × normal force on brake
   - Steel-on-steel brake: μ ≈ 0.15-0.25
   - Composite brake: μ ≈ 0.30-0.45
   - Heat is the enemy — overheated brakes fade (μ drops)

2. **Dynamic braking**: diesel engine or electric motors used in reverse as generators, converting kinetic energy to electrical energy (dissipated as heat in resistors or fed back to the grid)

3. **Regenerative braking**: like dynamic braking but the electricity is fed back to the power supply (used in electric trains)

**Braking distance** = v²/(2×a) where a = deceleration
- At 30 km/h with 0.5 m/s² deceleration: d = 69 m
- At 60 km/h with same deceleration: d = 278 m (4× longer for 2× speed!)

**Braking distance scales with the square of speed** — this is why speed limits on mountain descents are strictly enforced.`,
      analogy: 'Braking on a mountain descent is like trying to walk slowly down a steep staircase while someone pushes you from behind (gravity). You must resist the push with every step (friction brakes). If you go too fast, you cannot resist enough (brake fade) and you tumble. The faster you go, the harder it is to slow down — and the consequences of failure are catastrophic.',
      storyConnection: 'The story mentions the little train\'s brakes squealing as it descends — a sound every hill railway passenger knows. That squeal is the vibration of brake shoes against the wheel tread, converting kinetic energy into sound and heat. On the Darjeeling railway, the brakeman on each coach manually tightens hand brakes on the descent. A mechanical safety system from the 1880s, still in use because it is reliable, simple, and understood by every crew member.',
      checkQuestion: 'Why does braking distance increase with the square of speed (doubling speed quadruples braking distance)?',
      checkAnswer: 'Kinetic energy = ½mv². Doubling speed quadruples kinetic energy. The brakes apply a roughly constant force, doing a constant amount of work per metre (work = force × distance). To remove 4× the energy at the same rate, you need 4× the distance. This is why speed kills — not because of the speed itself, but because the energy that must be dissipated grows as the square of speed.',
      codeIntro: 'Model braking on a mountain descent: friction brakes, dynamic braking, and the danger of brake fade.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Train descending a 1-in-25 grade
train_mass = 120000  # kg
g = 9.81
gradient = 1/25
grade_force = train_mass * g * gradient  # N (~47 kN pulling train downhill)

# Speed simulation
dt = 0.1  # seconds
time = np.arange(0, 300, dt)

# Scenario 1: Good brakes (brake force > grade force)
brake_force_good = 60000  # N (60 kN — exceeds grade force)
speed_good = np.zeros_like(time)
speed_good[0] = 30 / 3.6  # start at 30 km/h

# Scenario 2: Brake fade (brake force drops with temperature)
speed_fade = np.zeros_like(time)
speed_fade[0] = 30 / 3.6
brake_temp = np.zeros_like(time)
brake_temp[0] = 50  # starting temp °C

# Scenario 3: No brakes (runaway)
speed_runaway = np.zeros_like(time)
speed_runaway[0] = 30 / 3.6

for i in range(1, len(time)):
    # Rolling resistance
    roll_r = 0.002 * train_mass * g

    # Good brakes: constant brake force
    net_good = grade_force - brake_force_good - roll_r
    accel_good = net_good / train_mass
    speed_good[i] = max(0, speed_good[i-1] + accel_good * dt)

    # Brake fade: force decreases with temperature
    if brake_temp[i-1] < 400:
        fade_factor = 1.0 - 0.5 * (brake_temp[i-1] - 50) / 350  # linear fade
    else:
        fade_factor = 0.3  # severe fade
    brake_force_fade = 60000 * max(0.2, fade_factor)
    # Temperature rises with braking, cools with air
    heat_input = brake_force_fade * abs(speed_fade[i-1]) * dt / 5000  # simplified
    heat_loss = (brake_temp[i-1] - 20) * 0.01 * dt  # cooling
    brake_temp[i] = brake_temp[i-1] + heat_input - heat_loss

    net_fade = grade_force - brake_force_fade - roll_r
    accel_fade = net_fade / train_mass
    speed_fade[i] = max(0, speed_fade[i-1] + accel_fade * dt)

    # Runaway: no brakes
    net_runaway = grade_force - roll_r - 0.5 * 1.0 * 8 * 1.225 * speed_runaway[i-1]**2
    accel_runaway = net_runaway / train_mass
    speed_runaway[i] = speed_runaway[i-1] + accel_runaway * dt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Speed vs time
ax1.set_facecolor('#111827')
ax1.plot(time, speed_good * 3.6, color='#22c55e', linewidth=2, label='Good brakes (stops safely)')
ax1.plot(time, speed_fade * 3.6, color='#f59e0b', linewidth=2, label='Brake fade (overheating)')
ax1.plot(time, speed_runaway * 3.6, color='#ef4444', linewidth=2, label='Runaway (no brakes!)')
ax1.axhline(30, color='gray', linestyle=':', linewidth=1, label='Speed limit (30 km/h)')
ax1.set_xlabel('Time (seconds)', color='white')
ax1.set_ylabel('Speed (km/h)', color='white')
ax1.set_title('Mountain Descent: Three Braking Scenarios', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 120)

# Brake temperature
ax2.set_facecolor('#111827')
ax2.plot(time, brake_temp, color='#ef4444', linewidth=2, label='Brake temperature')
ax2.axhline(300, color='#f59e0b', linestyle='--', linewidth=1, label='Fade onset (300°C)')
ax2.axhline(500, color='#ef4444', linestyle='--', linewidth=1, label='Danger zone (500°C)')
ax2.fill_between(time, 300, 500, alpha=0.1, color='#f59e0b')
ax2.fill_between(time, 500, brake_temp.max(), alpha=0.1, color='#ef4444')
ax2.set_xlabel('Time (seconds)', color='white')
ax2.set_ylabel('Temperature (°C)', color='white')
ax2.set_title('Brake Temperature During Descent', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Braking distance at different speeds
print("Braking distance (emergency stop, 0.5 m/s² deceleration):")
for v_kmh in [10, 20, 30, 40, 60]:
    v = v_kmh / 3.6
    d = v**2 / (2 * 0.5)
    print(f"  {v_kmh} km/h: {d:.0f} m")
print()
print(f"Runaway train after 5 min: {speed_runaway[-1]*3.6:.0f} km/h")
print("This is why mountain railways have catch sidings,")
print("sand drags, and derailing switches as last-resort safety.")`,
      challenge: 'Add dynamic braking (electric motor as generator) that provides 20 kN of braking force independent of temperature. Combined with friction brakes, how does this change the fade scenario?',
      successHint: 'Braking is the most safety-critical system on any railway. Understanding braking physics — energy, heat, fade, distance — is essential for anyone involved in rail engineering, vehicle design, or transport safety.',
    },
    {
      title: 'Bridge loading for trains — structures under stress',
      concept: `Mountain railways cross gorges, ravines, and rivers on bridges. Every bridge must carry the train's weight plus dynamic forces — and do so safely for decades.

**Types of loads**:
- **Dead load**: weight of the bridge structure itself
- **Live load**: weight of the train (varies with traffic)
- **Impact load**: dynamic amplification when wheels hit joints/irregularities (typically 1.5-2× the static live load)
- **Wind load**: lateral force, especially critical on exposed mountain bridges
- **Thermal load**: expansion/contraction with temperature changes

**Bending moment**: a bridge beam bends under load. The maximum bending moment for a point load P at the centre of a simply supported beam:
**M = P × L / 4** (L = span length)

For a distributed load (train spread across the bridge):
**M = w × L² / 8** (w = load per metre)

**Bridge types on hill railways**:
- **Stone arch**: excellent in compression, no maintenance, the oldest surviving bridges
- **Steel truss**: lightweight, strong, spans up to 100+ m
- **Steel plate girder**: simple, economical for short-medium spans
- **Suspension**: for very long spans (not typical on hill railways)

The Darjeeling railway has over 500 bridges, most steel plate girders on stone piers. The most famous, Bridge 541, spans a deep gorge at Tindharia.`,
      analogy: 'A bridge under a train load is like a see-saw with a heavy child walking across it. As the child walks from one end to the middle, the bending force (moment) increases — it peaks when the child is at the exact centre. The bridge must be strong enough to handle that maximum moment without breaking. Engineers design for the worst case: the heaviest train, at the centre of the bridge, with impact forces and wind.',
      storyConnection: 'In the story, the little train crosses a bridge high above a gorge, and the passengers look down at the river far below. That bridge was designed by an engineer who calculated exactly how much bending moment, shear force, and deflection the structure would experience under every possible loading condition. The passengers\' trust is ultimately trust in mathematics.',
      checkQuestion: 'Why do many old stone arch bridges outlast modern steel bridges, even though steel is "stronger" than stone?',
      checkAnswer: 'Stone arches work entirely in compression — stone is very strong in compression and the arch shape converts all loads into compressive forces. Steel bridges work in tension, compression, and bending, and steel corrodes over time. A stone arch with good foundations can last 1,000+ years (Roman bridges still stand). Steel bridges need repainting every 10-20 years, and bolt/rivet connections can fatigue. The lesson: choosing the right structural form matters as much as choosing the right material.',
      codeIntro: 'Calculate and visualise bending moments and deflection of a railway bridge under a moving train.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bridge: simply supported beam, 20 m span
L = 20  # metres
E = 200e9  # Young's modulus of steel (Pa)
I = 0.02  # second moment of area (m⁴, typical for railway girder)

# Train: locomotive with 4 axles
axle_loads = [100000, 100000, 80000, 80000]  # N per axle
axle_spacing = [0, 2.5, 5.0, 7.5]  # metres from front

# Move train across bridge
positions = np.linspace(-8, 28, 300)  # front axle position
x_bridge = np.linspace(0, L, 200)  # points along bridge

max_moment_at_x = np.zeros_like(x_bridge)
max_deflection_at_x = np.zeros_like(x_bridge)

# Track max moment at each point as train moves
moment_envelope = np.zeros_like(x_bridge)
moment_at_midspan = []

for pos in positions:
    # Bending moment at each bridge point
    M = np.zeros_like(x_bridge)
    for load, spacing in zip(axle_loads, axle_spacing):
        axle_pos = pos + spacing
        if 0 <= axle_pos <= L:
            # Reaction at left: RL = P * (L - a) / L
            a = axle_pos
            RL = load * (L - a) / L
            # Moment at x: M(x) = RL*x for x < a, = RL*x - P*(x-a) for x > a
            for j, x in enumerate(x_bridge):
                if x <= a:
                    M[j] += RL * x
                else:
                    M[j] += RL * x - load * (x - a)

    moment_envelope = np.maximum(moment_envelope, M)
    midspan_idx = len(x_bridge) // 2
    moment_at_midspan.append(M[midspan_idx])

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Bridge diagram
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot([0, L], [0, 0], color='white', linewidth=4)
ax1.plot(0, 0, '^', color='#22c55e', markersize=15)
ax1.plot(L, 0, 'o', color='#22c55e', markersize=12)
# Show train at midspan
train_pos = L/2 - 3.75
for load, spacing in zip(axle_loads, axle_spacing):
    ax_pos = train_pos + spacing
    if 0 <= ax_pos <= L:
        ax1.annotate('', xy=(ax_pos, 0), xytext=(ax_pos, 2),
                     arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2))
        ax1.text(ax_pos, 2.2, f'{load/1000:.0f}kN', ha='center', color='#ef4444', fontsize=8)
ax1.set_xlim(-2, L+2)
ax1.set_ylim(-1, 4)
ax1.set_title('Bridge Loading Diagram', color='white', fontsize=12)
ax1.set_xlabel('Position (m)', color='white')
ax1.tick_params(colors='gray')
ax1.set_yticks([])

# Moment envelope
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.fill_between(x_bridge, moment_envelope / 1000, alpha=0.3, color='#f59e0b')
ax2.plot(x_bridge, moment_envelope / 1000, color='#f59e0b', linewidth=2)
ax2.set_xlabel('Position along bridge (m)', color='white')
ax2.set_ylabel('Bending moment (kN·m)', color='white')
ax2.set_title('Bending Moment Envelope (Maximum at Each Point)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

max_M = np.max(moment_envelope)
max_M_pos = x_bridge[np.argmax(moment_envelope)]
ax2.plot(max_M_pos, max_M/1000, 'o', color='#ef4444', markersize=10)
ax2.annotate(f'Max: {max_M/1000:.0f} kN·m\\nat {max_M_pos:.1f} m',
             xy=(max_M_pos, max_M/1000), xytext=(max_M_pos + 3, max_M/1000 - 50),
             color='#ef4444', fontsize=10, arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Midspan moment as train crosses
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.plot(positions, np.array(moment_at_midspan) / 1000, color='#3b82f6', linewidth=2)
ax3.fill_between(positions, np.array(moment_at_midspan) / 1000, alpha=0.15, color='#3b82f6')
ax3.axvspan(0, L, alpha=0.05, color='white')
ax3.set_xlabel('Train front axle position (m)', color='white')
ax3.set_ylabel('Midspan moment (kN·m)', color='white')
ax3.set_title('Midspan Moment as Train Crosses', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# Deflection under max loading
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Simplified: total load at centre
total_load = sum(axle_loads)
# Deflection = 5wL⁴/(384EI) for distributed load
w = total_load / 7.5  # load per metre of train length
deflection = np.zeros_like(x_bridge)
for j, x in enumerate(x_bridge):
    # EI * y'' = M(x), integrate twice
    # For simply supported beam with central load
    deflection[j] = -(total_load * x * (L**2 - x**2) / (48 * E * I)) if x <= L/2 \
                     else -(total_load * (L-x) * (L**2 - (L-x)**2) / (48 * E * I))

ax4.plot(x_bridge, deflection * 1000, color='#a855f7', linewidth=2)
ax4.plot([0, L], [0, 0], color='gray', linewidth=1, linestyle=':')
ax4.set_xlabel('Position (m)', color='white')
ax4.set_ylabel('Deflection (mm)', color='white')
ax4.set_title('Bridge Deflection Under Load', color='white', fontsize=11)
ax4.tick_params(colors='gray')

max_defl = np.min(deflection) * 1000
ax4.annotate(f'Max deflection: {abs(max_defl):.1f} mm\\n(L/{L/(abs(max_defl/1000)):.0f})',
             xy=(L/2, max_defl), xytext=(L/2 + 3, max_defl * 0.5),
             color='#a855f7', fontsize=10, arrowprops=dict(arrowstyle='->', color='#a855f7'))

plt.tight_layout()
plt.show()

print(f"20m railway bridge analysis:")
print(f"  Total train load: {total_load/1000:.0f} kN ({total_load/9810:.0f} tonnes)")
print(f"  Max bending moment: {max_M/1000:.0f} kN·m")
print(f"  Max deflection: {abs(max_defl):.1f} mm (L/{L/(abs(max_defl/1000)):.0f})")
print(f"  Typical limit: L/600 = {L/600*1000:.1f} mm")
print(f"  {'PASS' if abs(max_defl) < L/600*1000 else 'FAIL'}: deflection {'within' if abs(max_defl) < L/600*1000 else 'exceeds'} limit")`,
      challenge: 'Apply an impact factor of 1.5 to all axle loads (multiply by 1.5). How does this change the maximum moment and deflection? Is the bridge still within the L/600 deflection limit?',
      successHint: 'Bridge engineering combines physics (forces, moments), materials science (steel properties), and safety factors (designing for worst-case loads). Every bridge you cross was designed by someone who calculated these numbers.',
    },
    {
      title: 'Tunnel engineering — boring through mountains',
      concept: `When a railway cannot go over or around a mountain, it goes through it. **Tunnel engineering** is one of the most challenging branches of civil engineering.

**Tunnel construction methods**:
1. **Drill and blast**: drill holes in the rock face, fill with explosives, blast, remove debris, repeat. Used in hard rock.
2. **Tunnel boring machine (TBM)**: a massive rotating cutting head that grinds through rock. Faster and safer for long tunnels, but extremely expensive.
3. **Cut and cover**: dig a trench from the surface, build the tunnel structure, cover it back. Only works near the surface.
4. **New Austrian Tunnelling Method (NATM)**: excavate in small sections, install rock bolts and shotcrete immediately, let the rock itself be the primary support. Used in soft or variable ground.

**Key engineering challenges**:
- **Rock pressure**: overburden (rock above) exerts enormous pressure. A tunnel 500 m below the surface must resist ~12 MPa of rock pressure.
- **Water ingress**: mountains are full of groundwater. Water must be continuously pumped out during construction and permanently drained afterward.
- **Ventilation**: fresh air must be supplied (especially in long tunnels). The Shimla-Kalka railway solved this by having many short tunnels with gaps between them.
- **Heat**: deep tunnels can be very hot (geothermal gradient ~25°C/km of depth).

The **Sevoke-Rangpo railway** (currently under construction in Sikkim) includes 44 tunnels in 45 km — more tunnel than open track. The longest is 5.3 km through the Himalayan foothills.`,
      analogy: 'Tunnel engineering is like surgery on a mountain. You must cut through the body (rock mass) without causing collapse (structural failure), manage the bleeding (water ingress), maintain vital functions (ventilation, stability), and leave the patient stable (permanent lining). The surgeon (engineer) uses imaging (geological surveys) to plan the operation, but always encounters surprises once inside.',
      storyConnection: 'The little train enters a tunnel and the world goes dark except for the engine\'s lamp. Inside, the walls drip with water, the air smells of damp rock, and the sound of the wheels changes — echoing off the close walls. Every sensation in that moment is a physics phenomenon: the darkness (light absorption by rock), the dripping (groundwater pressure), the echo (sound reflection in a confined space), the dampness (humidity at 100% in underground spaces).',
      checkQuestion: 'The Channel Tunnel (50.5 km) runs under the English Channel at up to 75 m below the seabed. What happens if water breaches the tunnel wall?',
      checkAnswer: 'The Channel Tunnel has a comprehensive safety system: cross-passages every 375 m connect the two running tunnels to a central service tunnel. Pumping stations can handle 30 tonnes of water per minute. Fireproof doors seal sections. But the biggest defence is the tunnel\'s location: it runs through a layer of chalk marl, which is relatively impermeable. The rock itself is the primary water barrier. The lining provides secondary protection. Redundancy upon redundancy.',
      codeIntro: 'Model the forces on a tunnel and the effect of depth and rock type on tunnel design.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Tunnel cross-section analysis
# Circular tunnel, radius 3m, at various depths

tunnel_radius = 3.0  # metres
rock_density = 2600  # kg/m³
g = 9.81
poisson = 0.3  # Poisson's ratio

# Depths
depths = np.linspace(10, 500, 100)  # metres of overburden

# Vertical stress: σv = ρgh
sigma_v = rock_density * g * depths / 1e6  # MPa

# Horizontal stress: σh = K₀ × σv where K₀ = ν/(1-ν)
K0 = poisson / (1 - poisson)
sigma_h = K0 * sigma_v

# Tangential stress at tunnel crown (max stress concentration)
# For circular tunnel: σ_max = 3σv - σh (at crown in vertical stress field)
sigma_crown = 3 * sigma_h - sigma_v  # simplified Kirsch solution for horizontal
sigma_wall = 3 * sigma_v - sigma_h   # at tunnel wall

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Stresses vs depth
ax1.set_facecolor('#111827')
ax1.plot(sigma_v, depths, color='#3b82f6', linewidth=2, label='Vertical stress (σv)')
ax1.plot(sigma_h, depths, color='#22c55e', linewidth=2, label='Horizontal stress (σh)')
ax1.plot(sigma_wall, depths, color='#ef4444', linewidth=2, label='Max wall stress')

# Rock strength zones
rock_strengths = [
    (5, 'Soft rock (shale)', '#f59e0b'),
    (25, 'Medium rock (sandstone)', '#94a3b8'),
    (100, 'Hard rock (granite)', '#22c55e'),
]
for strength, label, color in rock_strengths:
    ax1.axvline(strength, color=color, linestyle=':', linewidth=1.5)
    ax1.annotate(label, xy=(strength, 50), rotation=90, color=color, fontsize=8)

ax1.set_xlabel('Stress (MPa)', color='white')
ax1.set_ylabel('Depth (m)', color='white')
ax1.set_title('Tunnel Stress vs Depth', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.invert_yaxis()

# Tunnel cross-section stress distribution
ax2.set_facecolor('#111827')
theta = np.linspace(0, 2 * np.pi, 200)

# Stress distribution around tunnel at 200m depth
depth = 200
sv = rock_density * g * depth / 1e6
sh = K0 * sv

# Kirsch solution for stresses around circular opening
# σ_θ = (σv + σh)/2 * (1 + R²/r²) - (σv - σh)/2 * (1 + 3R⁴/r⁴) * cos(2θ)
# At r = R (tunnel wall):
sigma_theta = (sv + sh) - 2 * (sv - sh) * np.cos(2 * theta)  # tangential stress

# Normalise for plotting
r_plot = tunnel_radius + sigma_theta / np.max(sigma_theta) * 2
x_plot = r_plot * np.cos(theta)
y_plot = r_plot * np.sin(theta)

# Tunnel outline
x_tunnel = tunnel_radius * np.cos(theta)
y_tunnel = tunnel_radius * np.sin(theta)

ax2.fill(x_tunnel, y_tunnel, color='#111827')
ax2.plot(x_tunnel, y_tunnel, color='white', linewidth=2, label='Tunnel wall')
ax2.plot(x_plot, y_plot, color='#ef4444', linewidth=2, label='Stress magnitude')
ax2.fill_between(x_plot, y_plot, alpha=0.1, color='#ef4444')

ax2.annotate(f'Max stress\\n{np.max(sigma_theta):.1f} MPa', xy=(0, np.max(r_plot)),
             xytext=(2, np.max(r_plot) + 1), color='#ef4444', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax2.annotate(f'Min stress\\n{np.min(sigma_theta):.1f} MPa', xy=(np.min(r_plot), 0),
             xytext=(np.min(r_plot) - 3, -2), color='#3b82f6', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#3b82f6'))

ax2.set_xlim(-7, 7)
ax2.set_ylim(-7, 7)
ax2.set_aspect('equal')
ax2.set_title(f'Stress Distribution at {depth}m Depth', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Tunnel analysis (R={tunnel_radius}m, circular):")
for d in [50, 100, 200, 500]:
    sv = rock_density * g * d / 1e6
    wall_max = 3 * sv - K0 * sv
    print(f"  Depth {d}m: σv={sv:.1f} MPa, max wall stress={wall_max:.1f} MPa")
print()
print("Sevoke-Rangpo railway (Sikkim):")
print("  45 km route, 44 tunnels")
print("  Total tunnel length: ~38 km (84% underground)")
print("  Longest tunnel: 5.3 km")
print("  Method: NATM + TBM combination")`,
      challenge: 'A tunnel must pass through three rock types: granite (hard, strong), sandstone (medium), and shale (soft, weak). The shale section needs heavy steel lining while granite needs only rock bolts. Model the support cost per metre for each rock type.',
      successHint: 'Tunnel engineering pushes the limits of geology, materials science, and structural engineering. Every tunnel is unique because no two rock formations are identical. This is why geological surveys are as important as structural calculations.',
    },
    {
      title: 'Diesel vs electric traction — choosing the right power for the track',
      concept: `Modern hill railways face a choice: diesel or electric traction? Each has fundamental advantages rooted in physics.

**Diesel traction**:
- Engine burns diesel fuel → drives a generator → electric motors turn wheels
- Self-contained: no external power supply needed
- Power-to-weight: ~15-20 W/kg
- Efficiency: ~35% (diesel engine) × 90% (electrical transmission) ≈ 32%
- Pollutes: CO₂, NOx, particulates
- Good for: remote areas without electrification, flexible operations

**Electric traction**:
- Power from overhead wire (catenary) or third rail → motors turn wheels
- Not self-contained: requires electrified infrastructure ($1-5 million/km)
- Power-to-weight: ~25-40 W/kg (no heavy engine, just motors)
- Efficiency: ~90% (motor) × ~92% (transmission) × ~90% (power grid) ≈ 75%
- Can regenerate: braking sends energy back to the grid (saves 20-30% on mountain routes)
- Clean at point of use (but depends on power source)
- Good for: high-traffic routes, mountains (regeneration), urban areas (emissions)

For mountain railways, electric traction has a special advantage: **regenerative braking** recovers energy on descents. A train descending a 1-in-25 grade can feed back 30-40% of the energy it used climbing. Diesel brakes convert that energy to waste heat.`,
      analogy: 'Diesel traction is like carrying your own water bottle on a hike — self-sufficient but heavy. Electric traction is like drinking from taps along the trail — lighter and more efficient, but you need taps (infrastructure) at every step. On a mountain trail with taps, you carry less, walk faster, and can even pour excess water back into the system (regenerative braking). But building taps along every trail is expensive.',
      storyConnection: 'The little train of the story might have started as a steam engine, transitioned to diesel, and could one day become electric. The Darjeeling Himalayan Railway still runs heritage steam locomotives for tourists, but uses diesel for regular service. Electrification would transform the railway: quieter, cleaner, more powerful on steep grades, and capable of recovering energy on every descent. The mountain railway\'s future is electric.',
      checkQuestion: 'If electrifying a mountain railway costs ₹3 crore per km and the route is 90 km, but electric trains save ₹50 lakh per year in fuel costs, how many years until the investment pays for itself?',
      checkAnswer: 'Total electrification cost: 90 × 3 = ₹270 crore. Annual savings: ₹50 lakh = ₹0.5 crore. Payback period: 270 / 0.5 = 540 years. This is why mountain railways are rarely electrified just for fuel savings — the traffic volume is too low. Electrification makes economic sense on high-traffic mainlines where the savings are ₹100+ crore per year and payback is 5-10 years.',
      codeIntro: 'Compare diesel and electric traction performance on a mountain railway profile.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Route profile: 50 km mountain railway
distance = np.linspace(0, 50, 500)
altitude = 200 + 1500 * (distance / 50) + 200 * np.sin(distance / 5)
gradient = np.gradient(altitude, distance * 1000)  # rise per metre

# Train: 100 tonnes
mass = 100000  # kg
g = 9.81

# Diesel locomotive
diesel_power = 1500  # kW
diesel_eff = 0.32
diesel_fuel_rate = diesel_power / (diesel_eff * 43e3)  # kg/s (diesel energy density ~43 MJ/kg)

# Electric locomotive
electric_power = 2000  # kW (higher power-to-weight)
electric_eff = 0.88
regen_eff = 0.75  # regenerative braking efficiency

# Energy consumption calculation
diesel_energy = np.zeros(len(distance))
electric_energy = np.zeros(len(distance))
electric_regen = np.zeros(len(distance))

for i in range(1, len(distance)):
    dx = (distance[i] - distance[i-1]) * 1000  # metres
    grade = gradient[i]

    # Forces
    grade_force = mass * g * grade
    rolling = 0.002 * mass * g
    total_force = grade_force + rolling  # positive = uphill

    # Energy for this segment
    energy = total_force * dx  # Joules

    if energy > 0:  # climbing
        diesel_energy[i] = diesel_energy[i-1] + energy / diesel_eff
        electric_energy[i] = electric_energy[i-1] + energy / electric_eff
        electric_regen[i] = electric_regen[i-1]
    else:  # descending
        diesel_energy[i] = diesel_energy[i-1]  # diesel brakes waste energy as heat
        regen_recovered = abs(energy) * regen_eff
        electric_energy[i] = electric_energy[i-1] - regen_recovered  # energy recovered!
        electric_regen[i] = electric_regen[i-1] + regen_recovered

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Route profile with energy overlay
ax1.set_facecolor('#111827')
ax1.fill_between(distance, 0, altitude, alpha=0.2, color='#6b7280')
ax1.plot(distance, altitude, color='white', linewidth=1.5)
ax1.set_ylabel('Altitude (m)', color='white')
ax1.set_title('Mountain Railway Route Profile', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Colour the gradient
for i in range(1, len(distance)):
    color = '#ef4444' if gradient[i] > 0.02 else '#f59e0b' if gradient[i] > 0 else '#22c55e'
    ax1.plot(distance[i-1:i+1], altitude[i-1:i+1], color=color, linewidth=3)

# Energy comparison
ax2.set_facecolor('#111827')
ax2.plot(distance, diesel_energy / 1e9, color='#ef4444', linewidth=2, label='Diesel (total fuel energy)')
ax2.plot(distance, electric_energy / 1e9, color='#3b82f6', linewidth=2, label='Electric (net, after regen)')
ax2.plot(distance, electric_regen / 1e9, color='#22c55e', linewidth=2, linestyle='--', label='Energy recovered (regen)')

ax2.set_xlabel('Distance (km)', color='white')
ax2.set_ylabel('Cumulative energy (GJ)', color='white')
ax2.set_title('Energy Consumption: Diesel vs Electric', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

diesel_total = diesel_energy[-1] / 1e9
electric_total = electric_energy[-1] / 1e9
regen_total = electric_regen[-1] / 1e9
savings = (1 - electric_total / diesel_total) * 100

diesel_fuel_litres = diesel_total * 1e9 / (43e6 * 0.85)  # diesel density ~0.85 kg/L
electric_kwh = electric_total * 1e9 / 3.6e6

print(f"50 km mountain railway energy comparison:")
print(f"  Diesel: {diesel_total:.2f} GJ ({diesel_fuel_litres:.0f} litres of fuel)")
print(f"  Electric: {electric_total:.2f} GJ ({electric_kwh:.0f} kWh)")
print(f"  Regenerated: {regen_total:.2f} GJ")
print(f"  Electric saves: {savings:.0f}%")
print()
print("On mountain railways, regenerative braking is a game-changer:")
print(f"  Energy recovered on descents: {regen_total/diesel_total*100:.0f}% of diesel consumption")
print("  The train that goes down pays for part of the next one going up.")`,
      challenge: 'Add a "high-speed rail" scenario: a 250 km/h train on a flat, straight route (no gradients). Compare diesel and electric at high speed, where air resistance (proportional to v²) dominates. How does the efficiency comparison change?',
      successHint: 'From tractive effort to braking to bridges to tunnels to traction choice — you have covered the complete engineering of mountain railways. These are not just historical curiosities; they are engineering achievements that continue to connect remote communities to the wider world, and the lessons they teach apply to all transport engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Transportation Engineering</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for transportation engineering simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
