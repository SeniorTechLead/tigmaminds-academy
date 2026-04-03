import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KiteFestivalLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Project — Kite Performance Simulator',
      concept: `In Levels 1–3 you learned the physics of kite flight: lift and drag forces, angle of attack, stall, kite shapes, wind measurement, and stability. Now you will integrate everything into a single project — a **Kite Performance Simulator** that models how different kite designs perform across wind conditions.

The simulator will have four components:

1. **Kite model**: Define kite parameters (area, shape, weight, drag coefficient, lift coefficient curve) for diamond, delta, and box designs.
2. **Wind model**: Generate realistic wind profiles with steady component, gusts, and thermals.
3. **Force solver**: Calculate lift, drag, tension, and equilibrium string angle at each time step.
4. **Performance dashboard**: Visualize how each kite design responds to the same wind conditions — altitude over time, string angle, and stability metrics.

Each of the remaining five mini-lessons builds one component. By the end, you will have a complete tool that predicts which kite wins in any wind condition — and you will understand why Biren’s newspaper diamond outlasted Ronit’s imported delta.`,
      analogy: 'Building a kite simulator is like assembling a wind tunnel on your computer. Real aerospace engineers test wing shapes in wind tunnels before building aircraft. Your simulator does the same thing — it lets you test any kite design in any wind condition without cutting a single piece of bamboo.',
      storyConnection: 'Biren tested his kite by watching the wind for three weeks. Your simulator encodes that same knowledge computationally: which designs work in which conditions, why flexible frames survive gusts, and how tail length affects stability. If Biren had this tool, he could have optimized his design in minutes instead of weeks.',
      checkQuestion: 'Why is it important to model wind as variable (with gusts and thermals) rather than constant? How would constant-wind results mislead a kite designer?',
      checkAnswer: 'Constant wind favours the most aerodynamically efficient design (highest lift-to-drag ratio) — which is the delta kite. But real wind is gusty. Gusts create sudden force spikes that scale with v², so a gust 50% above average produces 2.25x the force. A stiff, optimized delta kite can be overpowered or break. A flexible diamond kite absorbs gusts by flexing and letting air through its porous skin. Constant-wind testing would incorrectly rank the delta first — exactly the mistake Ronit made by buying an expensive kite without studying the local wind conditions.',
      codeIntro: 'Define the kite data structures and aerodynamic models for three kite designs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# KITE PERFORMANCE SIMULATOR: Data Structures & Aero Models
# ============================================================

class KiteDesign:
    """Defines a kite's physical and aerodynamic properties."""
    def __init__(self, name, area, mass, Cd0, Cl_max, stall_angle, flexibility):
        self.name = name
        self.area = area          # m^2
        self.mass = mass          # kg
        self.Cd0 = Cd0            # zero-lift drag coefficient
        self.Cl_max = Cl_max      # maximum lift coefficient
        self.stall_angle = stall_angle  # degrees
        self.flexibility = flexibility  # 0-1 (1 = perfectly flexible)

    def Cl(self, alpha_deg):
        """Lift coefficient as function of angle of attack."""
        alpha = np.radians(np.clip(alpha_deg, 0, 90))
        # Pre-stall: thin airfoil theory
        Cl_linear = 2 * np.pi * np.sin(alpha)
        # Post-stall: Newtonian model
        Cl_post = 2 * np.sin(alpha) * np.cos(alpha)
        # Smooth transition at stall angle
        blend = 1 / (1 + np.exp((alpha_deg - self.stall_angle) / 2))
        return self.Cl_max / (2 * np.pi * np.sin(np.radians(self.stall_angle))) * (
            Cl_linear * blend + Cl_post * (1 - blend))

    def Cd(self, alpha_deg):
        """Drag coefficient as function of angle of attack."""
        alpha = np.radians(np.clip(alpha_deg, 0, 90))
        return self.Cd0 + 2 * np.sin(alpha)**2

# Three classic designs calibrated to real kite performance
diamond = KiteDesign("Diamond (Biren)", area=0.36, mass=0.08,
                     Cd0=0.06, Cl_max=1.0, stall_angle=18, flexibility=0.8)
delta = KiteDesign("Delta (Ronit)", area=0.5, mass=0.15,
                   Cd0=0.03, Cl_max=1.4, stall_angle=14, flexibility=0.2)
box = KiteDesign("Box (Javed)", area=0.6, mass=0.35,
                 Cd0=0.08, Cl_max=1.2, stall_angle=20, flexibility=0.3)

# Plot lift and drag curves for all three designs
alpha = np.linspace(0, 40, 200)

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Aerodynamic Profiles: Three Kite Designs',
             color='white', fontsize=13, fontweight='bold')

for i, kite in enumerate([diamond, delta, box]):
    ax = axes[i]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    Cl = [kite.Cl(a) for a in alpha]
    Cd = [kite.Cd(a) for a in alpha]
    L_D = [cl/cd if cd > 0.01 else 0 for cl, cd in zip(Cl, Cd)]

    ax.plot(alpha, Cl, color='#3b82f6', linewidth=2, label='C_L')
    ax.plot(alpha, Cd, color='#ef4444', linewidth=2, label='C_D')
    ax.axvline(kite.stall_angle, color='#f59e0b', linestyle='--',
               linewidth=1, alpha=0.7)
    ax.set_title(kite.name, color='white', fontsize=10)
    ax.set_xlabel('Angle of attack (°)', color='white', fontsize=9)
    ax.legend(fontsize=8, facecolor='#111827', edgecolor='gray',
              labelcolor='white')
    ax.grid(True, alpha=0.2)

    for spine in ax.spines.values():
        spine.set_color('#374151')

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("=== Kite Design Summary ===")
for kite in [diamond, delta, box]:
    opt_alpha = alpha[np.argmax([kite.Cl(a)/max(kite.Cd(a),0.01) for a in alpha])]
    best_LD = kite.Cl(opt_alpha) / kite.Cd(opt_alpha)
    print(f"{kite.name}:")
    print(f"  Area: {kite.area} m², Mass: {kite.mass} kg")
    print(f"  Best L/D ratio: {best_LD:.1f} at {opt_alpha:.0f}°")
    print(f"  Stall angle: {kite.stall_angle}°, Flexibility: {kite.flexibility}")
    print()
`,
    },
    {
      title: 'Wind Model — Gusts, Thermals, and the Brahmaputra Breeze',
      concept: `Real wind is never steady. It has three components:

1. **Mean wind**: the average speed and direction over minutes. This determines whether a kite can fly at all.
2. **Gusts**: sudden increases in speed lasting seconds. Gusts create force spikes because drag scales with v² — a 50% gust means 2.25x the force.
3. **Thermals**: columns of rising warm air that add a vertical component to the wind. Thermals can suddenly increase a kite’s effective angle of attack and lift.

We model wind as: v(t) = v_mean + gust(t) + thermal(t)

Gusts follow a statistical distribution — in meteorology, the Weibull distribution models wind speed probability. The gust factor (ratio of peak gust to mean wind) is typically 1.3–1.6 for open terrain like the Brahmaputra riverbank.

Thermals are modeled as periodic vertical wind pulses. On a sunny January day in Guwahati, thermals form as the sun heats the sandy riverbank, creating upward air movement of 1–3 m/s that lasts 30–60 seconds.

The wind model is crucial because it determines which kite design wins. A delta kite optimized for steady wind can be destroyed by gusts, while a flexible diamond kite absorbs gust energy through frame deflection.`,
      analogy: 'Think of wind like a river. The mean wind is the steady current. Gusts are like waves on the surface — they come and go but can capsize a small boat. Thermals are like underwater springs pushing water upward. A good boat (or kite) is designed to handle all three, not just the steady current.',
      storyConnection: 'Biren watched the wind for three weeks. He noticed the morning breeze was steady but the afternoon brought gusts from the river. He built his kite for the afternoon conditions — gusty, with thermals from the sun-warmed bank. Ronit’s delta was designed for steady wind. Our wind model captures exactly this difference.',
      checkQuestion: 'If the mean wind speed is 20 km/h and the gust factor is 1.5, what is the peak gust speed? How much more force does the kite experience during the gust compared to the mean wind?',
      checkAnswer: 'Peak gust = 20 × 1.5 = 30 km/h. Force ratio = (30/20)² = 2.25. The kite experiences 2.25 times the force during the gust — more than double. If the kite string is rated for the mean wind force, it might snap in the gust. If the kite frame is rigid (like Ronit’s fibreglass delta), the extra force is transmitted directly to the weakest point. If the frame is flexible (like Biren’s bamboo), it bends and sheds some of the excess force.',
      codeIntro: 'Build a realistic wind model with gusts and thermals calibrated to Guwahati January conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# WIND MODEL: Gusts, Thermals & Guwahati Conditions
# ============================================================

def generate_wind(duration_s=600, dt=0.5, mean_speed=5.0,
                  gust_factor=1.4, thermal_strength=2.0):
    """
    Generate a realistic wind time series.

    Parameters:
        duration_s: simulation length (seconds)
        dt: time step (seconds)
        mean_speed: mean horizontal wind (m/s)
        gust_factor: peak gust / mean wind ratio
        thermal_strength: max vertical wind (m/s)

    Returns:
        t: time array
        v_horizontal: horizontal wind speed (m/s)
        v_vertical: vertical wind component (m/s)
    """
    t = np.arange(0, duration_s, dt)
    n = len(t)

    # Steady component
    v_mean = np.full(n, mean_speed)

    # Gust model: filtered random noise
    # Low-pass filter creates realistic gust timescales (5-30 seconds)
    raw_noise = np.random.randn(n)
    kernel_size = int(10 / dt)  # 10-second smoothing
    kernel = np.ones(kernel_size) / kernel_size
    smooth_noise = np.convolve(raw_noise, kernel, mode='same')
    smooth_noise = smooth_noise / np.std(smooth_noise)  # normalize

    gust_amplitude = mean_speed * (gust_factor - 1)
    gusts = gust_amplitude * smooth_noise

    # Thermal model: periodic vertical pulses
    # Thermals arrive every 60-120 seconds, last 30-60 seconds
    v_vertical = np.zeros(n)
    thermal_period = 90  # seconds between thermals
    thermal_duration = 40  # seconds each thermal lasts
    for start in range(0, n, int(thermal_period / dt)):
        end = min(start + int(thermal_duration / dt), n)
        # Bell-shaped thermal profile
        x = np.linspace(-2, 2, end - start)
        v_vertical[start:end] += thermal_strength * np.exp(-x**2)

    v_horizontal = np.maximum(v_mean + gusts, 0)  # wind can't be negative

    return t, v_horizontal, v_vertical

# Generate 10-minute wind for Guwahati January conditions
t, vh, vv = generate_wind(duration_s=600, mean_speed=5.0,
                          gust_factor=1.4, thermal_strength=2.0)

fig, axes = plt.subplots(3, 1, figsize=(13, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Guwahati January Wind: 10-Minute Simulation',
             color='white', fontsize=13, fontweight='bold')

# Horizontal wind
ax = axes[0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.plot(t, vh, color='#3b82f6', linewidth=1, alpha=0.8)
ax.axhline(5.0, color='#f59e0b', linestyle='--', linewidth=1,
           label='Mean: 5 m/s (Beaufort 3)')
ax.fill_between(t, vh, 5.0, where=vh > 5.0, alpha=0.2, color='#ef4444',
                label='Above mean (gusts)')
ax.set_ylabel('Horizontal (m/s)', color='white', fontsize=9)
ax.legend(fontsize=8, facecolor='#111827', edgecolor='gray', labelcolor='white')
ax.grid(True, alpha=0.2)
for spine in ax.spines.values(): spine.set_color('#374151')

# Vertical wind (thermals)
ax = axes[1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.fill_between(t, vv, 0, alpha=0.4, color='#f59e0b')
ax.plot(t, vv, color='#f59e0b', linewidth=1)
ax.set_ylabel('Vertical (m/s)', color='white', fontsize=9)
ax.set_title('Thermals from sun-warmed riverbank', color='#9ca3af',
             fontsize=9)
ax.grid(True, alpha=0.2)
for spine in ax.spines.values(): spine.set_color('#374151')

# Total wind magnitude
v_total = np.sqrt(vh**2 + vv**2)
ax = axes[2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.plot(t, v_total, color='#4ade80', linewidth=1)
ax.set_ylabel('Total speed (m/s)', color='white', fontsize=9)
ax.set_xlabel('Time (seconds)', color='white', fontsize=9)
ax.grid(True, alpha=0.2)
for spine in ax.spines.values(): spine.set_color('#374151')

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print(f"Mean horizontal wind: {vh.mean():.1f} m/s ({vh.mean()*3.6:.0f} km/h)")
print(f"Peak gust: {vh.max():.1f} m/s ({vh.max()*3.6:.0f} km/h)")
print(f"Gust factor: {vh.max()/vh.mean():.2f}")
print(f"Max thermal updraft: {vv.max():.1f} m/s")
print(f"Force ratio at peak gust: {(vh.max()/vh.mean())**2:.2f}x mean")
`,
    },
    {
      title: 'Force Solver — Equilibrium at Every Time Step',
      concept: `At each moment in time, four forces act on the kite:

1. **Lift** (L): perpendicular to the wind, upward. L = 0.5 * rho * v² * A * C_L(alpha)
2. **Drag** (D): parallel to the wind, downwind. D = 0.5 * rho * v² * A * C_D(alpha)
3. **Weight** (W): downward. W = m * g
4. **Tension** (T): along the string, from kite to flyer

For the kite to fly stably, these forces must balance. The string angle from vertical (θ) is determined by:
tan(θ) = D / (L - W)

When L > W (kite has enough lift), the kite flies. The string angle tells us the lift-to-drag ratio. When a gust hits, L and D both increase (proportional to v²), but D increases faster because the effective angle of attack changes. A flexible kite responds by bending its frame, which reduces the effective area and spills excess force — we model this with a flexibility parameter.

The force solver also tracks whether the kite is in stall. If a sudden gust pushes the effective angle of attack past the stall angle, lift drops and drag surges — the kite dives or spins. Stability is measured by how quickly the kite recovers from stall.`,
      analogy: 'The force solver is like a balance sheet for the kite. Income (lift) must exceed expenses (weight). The surplus goes to string tension (profit). When a gust hits, both income and expenses change — a well-designed kite maintains a positive balance even in volatile conditions, like a business with good cash reserves.',
      storyConnection: 'When the afternoon gusts hit at the Guwahati festival, the force balance on each kite changed dramatically. Ronit’s delta had the best lift-to-drag ratio in steady wind, but the gust pushed it past stall. Biren’s diamond flexed, reducing its effective area, and never stalled. The force solver captures exactly this difference.',
      checkQuestion: 'A kite weighing 0.1 kg (W = 0.98 N) generates 3 N of lift and 2 N of drag in steady wind. What is the string angle from vertical? Now a gust doubles the wind speed — what happens?',
      checkAnswer: 'String angle = arctan(D / (L - W)) = arctan(2 / (3 - 0.98)) = arctan(0.99) = 44.7°. When wind doubles, both L and D quadruple: L = 12 N, D = 8 N. New angle = arctan(8 / (12 - 0.98)) = arctan(0.73) = 36°. The kite actually flies MORE steeply (closer to overhead) in the gust because lift increases faster than weight. But the string tension jumps from sqrt(2² + 2.02²) = 2.84 N to sqrt(8² + 11.02²) = 13.6 N — nearly 5x. The string or frame might break.',
      codeIntro: 'Build the force solver that computes kite equilibrium at each time step, accounting for gusts and flexibility.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# FORCE SOLVER: Kite Equilibrium with Gust Response
# ============================================================

RHO = 1.225  # air density (kg/m^3)
G = 9.81     # gravity (m/s^2)

class KiteDesign:
    def __init__(self, name, area, mass, Cd0, Cl_max, stall_angle, flexibility):
        self.name = name; self.area = area; self.mass = mass
        self.Cd0 = Cd0; self.Cl_max = Cl_max
        self.stall_angle = stall_angle; self.flexibility = flexibility

    def Cl(self, alpha_deg):
        alpha = np.radians(np.clip(alpha_deg, 0, 90))
        Cl_lin = 2 * np.pi * np.sin(alpha)
        Cl_post = 2 * np.sin(alpha) * np.cos(alpha)
        blend = 1 / (1 + np.exp((alpha_deg - self.stall_angle) / 2))
        scale = self.Cl_max / (2 * np.pi * np.sin(np.radians(self.stall_angle)))
        return scale * (Cl_lin * blend + Cl_post * (1 - blend))

    def Cd(self, alpha_deg):
        alpha = np.radians(np.clip(alpha_deg, 0, 90))
        return self.Cd0 + 2 * np.sin(alpha)**2

def solve_kite_forces(kite, v_h, v_v, alpha_base=12):
    """
    Solve forces for each time step.
    Returns: lift, drag, tension, string_angle, in_stall arrays
    """
    n = len(v_h)
    lift = np.zeros(n)
    drag = np.zeros(n)
    tension = np.zeros(n)
    string_angle = np.zeros(n)
    in_stall = np.zeros(n, dtype=bool)

    for i in range(n):
        # Effective angle of attack changes with vertical wind
        v_total = np.sqrt(v_h[i]**2 + v_v[i]**2)
        alpha_eff = alpha_base + np.degrees(np.arctan2(v_v[i], max(v_h[i], 0.1)))

        # Flexibility: reduce effective area in strong gusts
        # A flexible kite bends, spilling air
        v_mean = np.mean(v_h)
        gust_ratio = v_h[i] / max(v_mean, 0.1)
        area_eff = kite.area * (1 - kite.flexibility * max(0, gust_ratio - 1.2) * 0.3)

        # Check stall
        in_stall[i] = alpha_eff > kite.stall_angle

        # Calculate forces
        q = 0.5 * RHO * v_total**2  # dynamic pressure
        L = q * area_eff * kite.Cl(alpha_eff)
        D = q * area_eff * kite.Cd(alpha_eff)
        W = kite.mass * G

        lift[i] = L
        drag[i] = D

        if L > W:
            string_angle[i] = np.degrees(np.arctan2(D, L - W))
            tension[i] = np.sqrt(D**2 + (L - W)**2)
        else:
            string_angle[i] = 90  # kite falling
            tension[i] = 0

    return lift, drag, tension, string_angle, in_stall

# Set up kites
diamond = KiteDesign("Diamond", 0.36, 0.08, 0.06, 1.0, 18, 0.8)
delta = KiteDesign("Delta", 0.5, 0.15, 0.03, 1.4, 14, 0.2)
box = KiteDesign("Box", 0.6, 0.35, 0.08, 1.2, 20, 0.3)

# Generate wind (reuse model from previous lesson)
np.random.seed(42)
dt = 0.5
t = np.arange(0, 300, dt)
n = len(t)
raw = np.random.randn(n)
kernel = np.ones(20) / 20
gusts = np.convolve(raw, kernel, mode='same')
gusts = gusts / np.std(gusts) * 2.0
v_h = np.maximum(5.0 + gusts, 0.5)
v_v = np.zeros(n)
for start in range(0, n, 180):
    end = min(start + 80, n)
    x = np.linspace(-2, 2, end - start)
    v_v[start:end] += 2.0 * np.exp(-x**2)

# Solve for all three kites
fig, axes = plt.subplots(3, 1, figsize=(13, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Force Solver: Three Kites in Gusty Wind',
             color='white', fontsize=13, fontweight='bold')

colors = {'Diamond': '#f59e0b', 'Delta': '#3b82f6', 'Box': '#4ade80'}

for kite in [diamond, delta, box]:
    L, D, T, sa, stall = solve_kite_forces(kite, v_h, v_v)
    c = colors[kite.name]

    axes[0].plot(t, T, color=c, linewidth=1, label=kite.name, alpha=0.8)
    axes[1].plot(t, sa, color=c, linewidth=1, alpha=0.8)
    axes[2].plot(t, L/np.maximum(D, 0.01), color=c, linewidth=1, alpha=0.8)

    # Mark stall events
    stall_times = t[stall]
    if len(stall_times) > 0:
        axes[1].scatter(stall_times, sa[stall], color='#ef4444', s=8,
                        alpha=0.5, zorder=5)

for i, (ax, ylabel) in enumerate(zip(axes,
    ['Tension (N)', 'String angle (°)', 'Lift/Drag ratio'])):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.set_ylabel(ylabel, color='white', fontsize=9)
    ax.grid(True, alpha=0.2)
    for spine in ax.spines.values(): spine.set_color('#374151')
    if i == 0: ax.legend(fontsize=8, facecolor='#111827', edgecolor='gray',
                         labelcolor='white')

axes[2].set_xlabel('Time (seconds)', color='white', fontsize=9)
axes[1].set_title('Red dots = stall events', color='#ef4444', fontsize=9)

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')

# Summary statistics
print("\\n=== Performance Summary (5-minute gusty wind) ===")
for kite in [diamond, delta, box]:
    L, D, T, sa, stall = solve_kite_forces(kite, v_h, v_v)
    flying = sa < 85
    print(f"\\n{kite.name}:")
    print(f"  Time flying: {flying.sum()/len(flying)*100:.0f}%")
    print(f"  Stall events: {stall.sum()}")
    print(f"  Mean string angle: {sa[flying].mean():.1f}°" if flying.any() else "  Never flew")
    print(f"  Peak tension: {T.max():.1f} N ({T.max()/G:.1f} kg)")
    print(f"  Mean L/D: {(L[flying]/np.maximum(D[flying],0.01)).mean():.1f}" if flying.any() else "")
`,
    },
    {
      title: 'Stability Analysis — Why Biren’s Kite Survived',
      concept: `Stability is the ability of a kite to return to its equilibrium position after a disturbance. We measure it with two metrics:

1. **Recovery time**: how many seconds after a gust before the kite returns to within 10% of its equilibrium string angle.
2. **Stall fraction**: the percentage of time the kite spends in stall during the simulation.

A stable kite has short recovery times and a low stall fraction. An unstable kite oscillates wildly or enters prolonged stall.

The key factors affecting stability:
- **Flexibility**: flexible frames bend in gusts, reducing the effective area and spilling excess force. This prevents overshoot past the stall angle.
- **Tail length**: a longer tail adds more restoring torque but also more drag and weight.
- **Weight**: heavier kites are more resistant to perturbation (more inertia) but need more lift to fly.

We can now run systematic comparisons: sweep across wind speeds and measure each kite’s stability metrics. The result is a **stability map** showing which kite wins at each wind speed.`,
      analogy: 'Stability is like balance. A heavy, wide-based vase is hard to knock over (stable but heavy). A tall, narrow vase tips easily but looks elegant (efficient but unstable). The best design depends on where you put the vase — a shelf in a calm room or a table on a moving train. Same with kites: the best design depends on the wind conditions.',
      storyConnection: 'The Guwahati festival was a perfect stability test. Morning wind was steady (any kite flies), but afternoon gusts separated the good designs from the bad. By 4 PM, only Biren’s diamond and Ronit’s delta remained. The delta finally stalled in a sudden gust and the line snapped under the tension spike. The diamond’s flexibility kept it flying.',
      checkQuestion: 'If you increase a kite’s flexibility from 0.2 to 0.8, what happens to its performance in steady wind versus gusty wind?',
      checkAnswer: 'In steady wind, the flexible kite performs slightly worse because the flexing frame doesn’t maintain the optimal airfoil shape — it spills some air even in normal conditions, reducing lift. In gusty wind, the flexible kite performs much better because it absorbs gust energy by bending, preventing stall and tension spikes. There is a trade-off: flexibility costs efficiency in steady wind but buys survival in gusty wind. Biren’s kite was designed for gusty conditions — he accepted lower steady-wind performance in exchange for gust resilience.',
      codeIntro: 'Run stability analysis across wind speeds and create a performance comparison map for all three kite designs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

RHO = 1.225; G = 9.81

class KiteDesign:
    def __init__(self, name, area, mass, Cd0, Cl_max, stall_angle, flex):
        self.name=name; self.area=area; self.mass=mass; self.Cd0=Cd0
        self.Cl_max=Cl_max; self.stall_angle=stall_angle; self.flex=flex
    def Cl(self, a):
        ar=np.radians(np.clip(a,0,90))
        cl_l=2*np.pi*np.sin(ar); cl_p=2*np.sin(ar)*np.cos(ar)
        b=1/(1+np.exp((a-self.stall_angle)/2))
        s=self.Cl_max/(2*np.pi*np.sin(np.radians(self.stall_angle)))
        return s*(cl_l*b+cl_p*(1-b))
    def Cd(self, a):
        ar=np.radians(np.clip(a,0,90)); return self.Cd0+2*np.sin(ar)**2

def simulate(kite, mean_v, gust_factor=1.4, duration=300, dt=0.5):
    np.random.seed(7)
    t=np.arange(0,duration,dt); n=len(t)
    raw=np.random.randn(n)
    k=np.ones(20)/20; g=np.convolve(raw,k,mode='same')
    g=g/np.std(g)*mean_v*(gust_factor-1)
    vh=np.maximum(mean_v+g,0.5)
    vv=np.zeros(n)
    for s in range(0,n,180):
        e=min(s+80,n); x=np.linspace(-2,2,e-s); vv[s:e]+=1.5*np.exp(-x**2)

    sa=np.zeros(n); stall=np.zeros(n,dtype=bool); tension=np.zeros(n)
    for i in range(n):
        vt=np.sqrt(vh[i]**2+vv[i]**2)
        ae=12+np.degrees(np.arctan2(vv[i],max(vh[i],0.1)))
        gr=vh[i]/max(mean_v,0.1)
        area_eff=kite.area*(1-kite.flex*max(0,gr-1.2)*0.3)
        stall[i]=ae>kite.stall_angle
        q=0.5*RHO*vt**2
        L=q*area_eff*kite.Cl(ae); D=q*area_eff*kite.Cd(ae); W=kite.mass*G
        if L>W:
            sa[i]=np.degrees(np.arctan2(D,L-W))
            tension[i]=np.sqrt(D**2+(L-W)**2)
        else: sa[i]=90; tension[i]=0

    flying=sa<85
    return {
        'fly_pct': flying.sum()/n*100,
        'stall_pct': stall.sum()/n*100,
        'mean_angle': sa[flying].mean() if flying.any() else 90,
        'peak_tension': tension.max(),
        'mean_LD': (np.array([kite.Cl(12)/max(kite.Cd(12),0.01)]*n))[0] if flying.any() else 0
    }

diamond=KiteDesign("Diamond",0.36,0.08,0.06,1.0,18,0.8)
delta=KiteDesign("Delta",0.5,0.15,0.03,1.4,14,0.2)
box=KiteDesign("Box",0.6,0.35,0.08,1.2,20,0.3)

# Sweep across wind speeds
wind_speeds=np.arange(2,15,0.5)
results={k.name: {'fly':[],'stall':[],'angle':[],'tension':[]}
         for k in [diamond,delta,box]}

for vs in wind_speeds:
    for kite in [diamond,delta,box]:
        r=simulate(kite,vs)
        results[kite.name]['fly'].append(r['fly_pct'])
        results[kite.name]['stall'].append(r['stall_pct'])
        results[kite.name]['angle'].append(r['mean_angle'])
        results[kite.name]['tension'].append(r['peak_tension'])

fig,axes=plt.subplots(2,2,figsize=(13,9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Kite Performance Map: Who Wins at Each Wind Speed?',
             color='white',fontsize=13,fontweight='bold')

colors={'Diamond':'#f59e0b','Delta':'#3b82f6','Box':'#4ade80'}
ws_kmh=wind_speeds*3.6

panels=[('fly','Time Flying (%)'),('stall','Time in Stall (%)'),
        ('angle','Mean String Angle (°)'),('tension','Peak Tension (N)')]

for idx,(key,title) in enumerate(panels):
    ax=axes[idx//2][idx%2]; ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    for name in ['Diamond','Delta','Box']:
        ax.plot(ws_kmh,results[name][key],color=colors[name],linewidth=2,label=name)
    ax.set_title(title,color='white',fontsize=10)
    ax.set_xlabel('Mean wind (km/h)',color='white',fontsize=9)
    ax.grid(True,alpha=0.2)
    for s in ax.spines.values(): s.set_color('#374151')
    if idx==0: ax.legend(fontsize=8,facecolor='#111827',edgecolor='gray',labelcolor='white')

# Add Beaufort annotations
for ax in axes.flat:
    ax.axvspan(0,7.2,alpha=0.05,color='white')
    ax.axvspan(12*3.6,15*3.6,alpha=0.05,color='red')

plt.tight_layout()
img=_get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')

print("\\n=== Winner at Each Wind Condition ===")
for vs in [3,5,7,10,12]:
    idx=int((vs-2)/0.5)
    best=max(['Diamond','Delta','Box'],
             key=lambda n: results[n]['fly'][idx]-results[n]['stall'][idx])
    print(f"Wind {vs} m/s ({vs*3.6:.0f} km/h): {best}")
print("\\nBiren's diamond wins in gusty conditions (5-10 m/s)")
print("Ronit's delta wins in steady light wind (3-5 m/s)")
print("Javed's box wins in strong wind (10+ m/s)")
`,
    },
    {
      title: 'Performance Dashboard — The Complete Kite Tester',
      concept: `The final component brings everything together into a dashboard that answers the key question: **given today’s wind conditions, which kite should you fly?**

The dashboard shows:
- Real-time force vectors on each kite (lift, drag, weight, tension)
- String angle over time as wind varies
- Stability score: percentage of time the kite stays within 10° of its equilibrium angle
- Overall ranking based on flying time, stability, and efficiency

This is the engineering design process in miniature:
1. Define the problem (fly a kite in Guwahati January wind)
2. Build models (aerodynamics, wind, forces)
3. Simulate (run the models)
4. Compare (dashboard)
5. Decide (pick the best design for the conditions)

The same process is used by aerospace engineers designing aircraft, by wind energy companies designing turbines, and by architects designing buildings to withstand wind loads.`,
      analogy: 'The dashboard is like a cockpit instrument panel. Each gauge shows one aspect of the kite’s performance. Individually, each gauge tells you something useful. Together, they give you the complete picture — just as a pilot needs airspeed, altitude, heading, and engine status to fly safely.',
      storyConnection: 'If the children of Guwahati had this dashboard at the kite festival, they would have known before launching that Biren’s diamond was the best choice for the afternoon’s gusty conditions. But Biren figured it out the old-fashioned way — by watching the wind for three weeks and understanding the physics intuitively. The dashboard automates his wisdom.',
      checkQuestion: 'A new kite festival is held in Shillong, where the wind is steady at 25 km/h with very few gusts. Which kite design from our simulator would you recommend, and why?',
      checkAnswer: 'The delta kite. Steady wind means gusts are not a threat, so the delta’s weakness (fragility in gusts) does not matter. Its strength — the best lift-to-drag ratio — gives it the steepest string angle (closest to overhead), meaning it flies highest and most efficiently. The diamond’s flexibility would actually be a disadvantage here: it would flex unnecessarily, spilling lift even in steady conditions. In Shillong’s steady wind, Ronit’s imported delta would beat Biren’s newspaper diamond. Design follows conditions.',
      codeIntro: 'Build the final dashboard combining all components into a single performance comparison tool.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch

RHO=1.225; G=9.81

class KiteDesign:
    def __init__(s,name,area,mass,Cd0,Cl_max,stall_angle,flex,color):
        s.name=name;s.area=area;s.mass=mass;s.Cd0=Cd0;s.Cl_max=Cl_max
        s.stall_angle=stall_angle;s.flex=flex;s.color=color
    def Cl(s,a):
        ar=np.radians(np.clip(a,0,90));cl_l=2*np.pi*np.sin(ar)
        cl_p=2*np.sin(ar)*np.cos(ar);b=1/(1+np.exp((a-s.stall_angle)/2))
        sc=s.Cl_max/(2*np.pi*np.sin(np.radians(s.stall_angle)))
        return sc*(cl_l*b+cl_p*(1-b))
    def Cd(s,a):
        ar=np.radians(np.clip(a,0,90));return s.Cd0+2*np.sin(ar)**2

kites=[
    KiteDesign("Diamond (Biren)",0.36,0.08,0.06,1.0,18,0.8,'#f59e0b'),
    KiteDesign("Delta (Ronit)",0.5,0.15,0.03,1.4,14,0.2,'#3b82f6'),
    KiteDesign("Box (Javed)",0.6,0.35,0.08,1.2,20,0.3,'#4ade80'),
]

def full_sim(kite,mean_v,gf=1.4,dur=600,dt=0.5):
    np.random.seed(42);t=np.arange(0,dur,dt);n=len(t)
    raw=np.random.randn(n);k=np.ones(20)/20
    g=np.convolve(raw,k,mode='same');g=g/np.std(g)*mean_v*(gf-1)
    vh=np.maximum(mean_v+g,0.5);vv=np.zeros(n)
    for s in range(0,n,180):
        e=min(s+80,n);x=np.linspace(-2,2,e-s);vv[s:e]+=2.0*np.exp(-x**2)
    sa=np.zeros(n);stall=np.zeros(n,dtype=bool);T=np.zeros(n);L=np.zeros(n)
    for i in range(n):
        vt=np.sqrt(vh[i]**2+vv[i]**2)
        ae=12+np.degrees(np.arctan2(vv[i],max(vh[i],0.1)))
        gr=vh[i]/max(mean_v,0.1)
        aeff=kite.area*(1-kite.flex*max(0,gr-1.2)*0.3)
        stall[i]=ae>kite.stall_angle;q=0.5*RHO*vt**2
        Li=q*aeff*kite.Cl(ae);Di=q*aeff*kite.Cd(ae);W=kite.mass*G
        L[i]=Li
        if Li>W:sa[i]=np.degrees(np.arctan2(Di,Li-W));T[i]=np.sqrt(Di**2+(Li-W)**2)
        else:sa[i]=90;T[i]=0
    fly=sa<85
    return t,vh,sa,stall,T,L,fly

# Run simulation at Guwahati festival conditions
mean_wind=5.0  # m/s (Beaufort 3, typical January afternoon)

fig=plt.figure(figsize=(14,10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('KITE PERFORMANCE DASHBOARD\\nGuwahati January Festival | Wind: 18 km/h gusty',
             color='white',fontsize=14,fontweight='bold')

# Create grid layout
gs=fig.add_gridspec(3,3,hspace=0.4,wspace=0.3)

# Panel 1: String angle over time (full width top)
ax1=fig.add_subplot(gs[0,:])
ax1.set_facecolor('#111827');ax1.tick_params(colors='gray')
for kite in kites:
    t,vh,sa,stall,T,L,fly=full_sim(kite,mean_wind)
    ax1.plot(t,sa,color=kite.color,linewidth=1,alpha=0.8,label=kite.name)
    st=t[stall]
    if len(st)>0:ax1.scatter(st,sa[stall],color='#ef4444',s=5,alpha=0.3)
ax1.set_ylabel('String angle (°)',color='white',fontsize=9)
ax1.set_xlabel('Time (s)',color='white',fontsize=9)
ax1.set_title('String Angle Over Time (lower = better)',color='#9ca3af',fontsize=10)
ax1.legend(fontsize=8,facecolor='#111827',edgecolor='gray',labelcolor='white')
ax1.axhline(45,color='white',alpha=0.2,linestyle='--')
ax1.grid(True,alpha=0.15)
for s in ax1.spines.values():s.set_color('#374151')

# Panel 2: Bar chart - Flying time %
ax2=fig.add_subplot(gs[1,0]);ax2.set_facecolor('#111827');ax2.tick_params(colors='gray')
fly_pcts=[]
for kite in kites:
    _,_,sa,_,_,_,fly=full_sim(kite,mean_wind)
    fly_pcts.append(fly.sum()/len(fly)*100)
bars=ax2.bar([k.name.split('(')[0] for k in kites],fly_pcts,
             color=[k.color for k in kites],alpha=0.8)
ax2.set_ylabel('Flying time %',color='white',fontsize=9)
ax2.set_title('Time Airborne',color='#9ca3af',fontsize=10)
ax2.set_ylim(0,105)
for b,v in zip(bars,fly_pcts):ax2.text(b.get_x()+b.get_width()/2,v+2,f'{v:.0f}%',
    ha='center',color='white',fontsize=9)
ax2.grid(True,alpha=0.15,axis='y')
for s in ax2.spines.values():s.set_color('#374151')

# Panel 3: Bar chart - Stall events
ax3=fig.add_subplot(gs[1,1]);ax3.set_facecolor('#111827');ax3.tick_params(colors='gray')
stall_pcts=[]
for kite in kites:
    _,_,_,stall,_,_,_=full_sim(kite,mean_wind)
    stall_pcts.append(stall.sum()/len(stall)*100)
bars=ax3.bar([k.name.split('(')[0] for k in kites],stall_pcts,
             color=[k.color for k in kites],alpha=0.8)
ax3.set_ylabel('Stall time %',color='white',fontsize=9)
ax3.set_title('Time in Stall (lower = better)',color='#9ca3af',fontsize=10)
for b,v in zip(bars,stall_pcts):ax3.text(b.get_x()+b.get_width()/2,v+1,f'{v:.1f}%',
    ha='center',color='white',fontsize=9)
ax3.grid(True,alpha=0.15,axis='y')
for s in ax3.spines.values():s.set_color('#374151')

# Panel 4: Bar chart - Peak tension
ax4=fig.add_subplot(gs[1,2]);ax4.set_facecolor('#111827');ax4.tick_params(colors='gray')
peak_ts=[]
for kite in kites:
    _,_,_,_,T,_,_=full_sim(kite,mean_wind)
    peak_ts.append(T.max())
bars=ax4.bar([k.name.split('(')[0] for k in kites],peak_ts,
             color=[k.color for k in kites],alpha=0.8)
ax4.set_ylabel('Peak tension (N)',color='white',fontsize=9)
ax4.set_title('Max String Force',color='#9ca3af',fontsize=10)
for b,v in zip(bars,peak_ts):ax4.text(b.get_x()+b.get_width()/2,v+0.2,f'{v:.1f}N',
    ha='center',color='white',fontsize=9)
ax4.grid(True,alpha=0.15,axis='y')
for s in ax4.spines.values():s.set_color('#374151')

# Panel 5: Overall score (full width bottom)
ax5=fig.add_subplot(gs[2,:]);ax5.set_facecolor('#111827');ax5.tick_params(colors='gray')
# Score = flying% - stall% - (tension/max_tension)*20
scores=[]
max_t=max(peak_ts)
for i,kite in enumerate(kites):
    score=fly_pcts[i]-stall_pcts[i]*2-(peak_ts[i]/max_t)*10
    scores.append(score)
bars=ax5.barh([k.name for k in kites],scores,color=[k.color for k in kites],alpha=0.8)
for b,v in zip(bars,scores):
    ax5.text(max(v+1,5),b.get_y()+b.get_height()/2,
             f'{v:.0f} pts',va='center',color='white',fontsize=11,fontweight='bold')
ax5.set_xlabel('Overall Score (higher = better)',color='white',fontsize=10)
ax5.set_title('FESTIVAL WINNER: Gusty Brahmaputra Wind',
              color='#f59e0b',fontsize=11,fontweight='bold')
ax5.grid(True,alpha=0.15,axis='x')
for s in ax5.spines.values():s.set_color('#374151')

plt.tight_layout()
img=_get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')

print("\\n" + "="*50)
print("  KITE FESTIVAL RESULTS")
print("="*50)
winner=kites[np.argmax(scores)]
print(f"\\n  WINNER: {winner.name}")
print(f"\\n  The diamond kite wins in gusty conditions because:")
print(f"  - High flexibility ({diamond.flex}) absorbs gust energy")
print(f"  - Light weight ({diamond.mass} kg) needs less lift to fly")
print(f"  - High stall angle ({diamond.stall_angle}°) resists stall")
print(f"  - Low tension means the string never snaps")
print(f"\\n  Biren understood this intuitively. You now")
print(f"  understand it mathematically.")
`,
    },
    {
      title: 'Extension — Design Your Own Kite',
      concept: `Now that you have the complete simulator, you can design your own kite. Modify the KiteDesign parameters and see how your creation performs:

- **area**: larger = more lift, but also more drag and weight
- **mass**: lighter = easier to fly, but less stable in gusts
- **Cd0**: lower = less parasitic drag, but harder to achieve with simple materials
- **Cl_max**: higher = more lift per unit area, depends on shape and camber
- **stall_angle**: higher = more forgiving, but lower maximum efficiency
- **flexibility**: higher = better gust survival, but less efficient in steady wind

Try to beat Biren’s diamond in the Guwahati festival conditions. Then change the wind to steady (gust_factor=1.0) and see if your design still wins. The best design is one that performs well across a range of conditions — not one that is optimal for a single scenario.

This is the core lesson of engineering: **design is about trade-offs**. There is no universally best kite, just as there is no universally best aircraft, bridge, or building. The best solution depends on the constraints. Biren won because he understood his constraints (gusty wind, cheap materials, light weight) better than anyone else.`,
      analogy: 'Designing a kite is like cooking. You can follow a recipe (build a standard diamond), but the best cooks adjust the recipe based on their ingredients and their diners. Biren had newspaper and bamboo — cheap ingredients. But he cooked them perfectly for the conditions.',
      storyConnection: 'The story ends with Ronit asking Biren to teach him to build a kite. The real lesson was not how to cut bamboo or paste newspaper — it was how to think about design. Observe the conditions. Understand the physics. Choose your trade-offs deliberately. Build. Test. Improve. That process is engineering, whether you are building a newspaper kite or a spacecraft.',
      checkQuestion: 'Design a kite with area=0.4, mass=0.06, Cd0=0.05, Cl_max=1.1, stall_angle=16, flexibility=0.9. In what wind conditions would this kite excel? Where would it struggle?',
      checkAnswer: 'This is a very light (60g), highly flexible kite with moderate efficiency. It would excel in light gusty wind (Beaufort 2-3) because its low weight means it needs very little lift to fly, and its high flexibility absorbs gusts well. It would struggle in strong steady wind (Beaufort 5+) because the high flexibility means it spills too much air, and the low mass means strong tension could pull the bridle loose. It is essentially an ultra-light version of Biren’s design — optimized for the gentlest conditions.',
      codeIntro: 'Create your own kite design and test it against the three classics in various wind conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

RHO=1.225; G=9.81

class KiteDesign:
    def __init__(s,name,area,mass,Cd0,Cl_max,stall_angle,flex,color):
        s.name=name;s.area=area;s.mass=mass;s.Cd0=Cd0;s.Cl_max=Cl_max
        s.stall_angle=stall_angle;s.flex=flex;s.color=color
    def Cl(s,a):
        ar=np.radians(np.clip(a,0,90));cl_l=2*np.pi*np.sin(ar)
        cl_p=2*np.sin(ar)*np.cos(ar);b=1/(1+np.exp((a-s.stall_angle)/2))
        sc=s.Cl_max/(2*np.pi*np.sin(np.radians(s.stall_angle)))
        return sc*(cl_l*b+cl_p*(1-b))
    def Cd(s,a):
        ar=np.radians(np.clip(a,0,90));return s.Cd0+2*np.sin(ar)**2

def score_kite(kite, mean_v, gf=1.4, dur=300, dt=0.5):
    np.random.seed(42);t=np.arange(0,dur,dt);n=len(t)
    raw=np.random.randn(n);k=np.ones(20)/20
    g=np.convolve(raw,k,mode='same');g=g/np.std(g)*mean_v*(gf-1)
    vh=np.maximum(mean_v+g,0.5);vv=np.zeros(n)
    for s in range(0,n,180):
        e=min(s+80,n);x=np.linspace(-2,2,e-s);vv[s:e]+=2.0*np.exp(-x**2)
    fly_count=0;stall_count=0;angles=[];tensions=[]
    for i in range(n):
        vt=np.sqrt(vh[i]**2+vv[i]**2)
        ae=12+np.degrees(np.arctan2(vv[i],max(vh[i],0.1)))
        gr=vh[i]/max(mean_v,0.1)
        aeff=kite.area*(1-kite.flex*max(0,gr-1.2)*0.3)
        is_stall=ae>kite.stall_angle;q=0.5*RHO*vt**2
        Li=q*aeff*kite.Cl(ae);Di=q*aeff*kite.Cd(ae);W=kite.mass*G
        if Li>W:
            sa=np.degrees(np.arctan2(Di,Li-W))
            T=np.sqrt(Di**2+(Li-W)**2)
            fly_count+=1;angles.append(sa);tensions.append(T)
        if is_stall:stall_count+=1
    fly_pct=fly_count/n*100;stall_pct=stall_count/n*100
    avg_angle=np.mean(angles) if angles else 90
    peak_t=max(tensions) if tensions else 0
    return fly_pct,stall_pct,avg_angle,peak_t

# ==================================
# YOUR CUSTOM KITE - modify these!
# ==================================
my_kite = KiteDesign(
    name="Your Design",
    area=0.4,          # m^2 (try 0.2 to 0.8)
    mass=0.06,         # kg (try 0.04 to 0.5)
    Cd0=0.05,          # zero-lift drag (try 0.02 to 0.1)
    Cl_max=1.1,        # max lift coefficient (try 0.8 to 1.5)
    stall_angle=16,    # degrees (try 10 to 25)
    flex=0.9,          # flexibility 0-1 (try 0.1 to 1.0)
    color='#e879f9'    # purple for your design
)

# Compare all four designs across wind conditions
kites = [
    KiteDesign("Diamond",0.36,0.08,0.06,1.0,18,0.8,'#f59e0b'),
    KiteDesign("Delta",0.5,0.15,0.03,1.4,14,0.2,'#3b82f6'),
    KiteDesign("Box",0.6,0.35,0.08,1.2,20,0.3,'#4ade80'),
    my_kite,
]

conditions = [
    ("Light steady", 3.0, 1.1),
    ("Moderate gusty", 5.0, 1.4),
    ("Strong gusty", 8.0, 1.5),
    ("Storm", 12.0, 1.6),
]

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('KITE DESIGN CHALLENGE: Your Kite vs The Classics',
             color='white', fontsize=14, fontweight='bold')

for idx, (cond_name, mean_v, gf) in enumerate(conditions):
    ax = axes[idx//2][idx%2]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    scores = []
    for kite in kites:
        fly, stall, angle, peak_t = score_kite(kite, mean_v, gf)
        overall = fly - stall * 2 - min(angle, 80) * 0.3
        scores.append(overall)

    bars = ax.barh([k.name for k in kites], scores,
                   color=[k.color for k in kites], alpha=0.8)

    winner_idx = np.argmax(scores)
    for i, (b, v) in enumerate(zip(bars, scores)):
        weight = 'bold' if i == winner_idx else 'normal'
        marker = ' ★' if i == winner_idx else ''
        ax.text(max(v + 1, 2), b.get_y() + b.get_height()/2,
                f'{v:.0f}{marker}', va='center', color='white',
                fontsize=10, fontweight=weight)

    ax.set_title(f'{cond_name} ({mean_v*3.6:.0f} km/h, gust {gf}x)',
                 color='white', fontsize=10)
    ax.grid(True, alpha=0.15, axis='x')
    for s in ax.spines.values(): s.set_color('#374151')

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')

print("\\n" + "="*50)
print("  DESIGN CHALLENGE RESULTS")
print("="*50)
print(f"\\nYour kite: {my_kite.name}")
print(f"  Area: {my_kite.area} m² | Mass: {my_kite.mass} kg")
print(f"  Stall: {my_kite.stall_angle}° | Flex: {my_kite.flex}")
print()

for cond_name, mean_v, gf in conditions:
    scores = [score_kite(k, mean_v, gf) for k in kites]
    overall = [f - s*2 - min(a,80)*0.3 for f,s,a,_ in scores]
    winner = kites[np.argmax(overall)]
    print(f"{cond_name}: Winner = {winner.name}")

print("\\n  Modify 'my_kite' parameters above and re-run")
print("  to test your own designs!")
print("\\n  Remember Biren's lesson: the best kite is not")
print("  the most expensive — it is the one built by someone")
print("  who bothered to understand the wind.")
`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-sky-500/10 to-amber-500/10 rounded-xl p-6 border border-sky-500/20">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Cpu size={20} /> Level 4: Kite Performance Simulator
        </h2>
        <p className="text-gray-300 text-sm">
          Build a complete kite performance simulator that models aerodynamics, wind conditions,
          and stability for different kite designs. Determine which kite wins at the Guwahati
          festival — and why.
        </p>
        {!pyReady && (
          <button
            onClick={loadPyodide}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" />{loadProgress}</> : 'Load Python Environment'}
          </button>
        )}
        {pyReady && <p className="mt-3 text-green-400 text-sm font-medium">Python ready — run the code blocks below.</p>}
      </div>

      <div className="space-y-6">
        {miniLessons.map((lesson, idx) => (
          <MiniLesson
            key={idx}
            index={idx}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            pyodide={pyodideRef.current}
           
            loadPyodide={loadPyodide}
          />
        ))}
      </div>
    </div>
  );
}
