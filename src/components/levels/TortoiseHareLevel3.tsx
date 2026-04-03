import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TortoiseHareLevel3() {
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
      title: 'Metabolic scaling — Kleiber\'s law and the 3/4 power rule',
      concept: `One of the most remarkable patterns in biology: metabolic rate scales with body mass to the **3/4 power** across nearly all organisms, from bacteria to whales. This is **Kleiber's law**: BMR = B0 * M^(3/4), where B0 is a normalization constant.

Why 3/4 and not 1 (linear)? If metabolism scaled linearly, a 1000 kg cow would burn 1000x more energy than a 1 kg rabbit. In reality, it burns only about 178x more (1000^0.75 = 177.8). Larger animals are metabolically more efficient per unit mass.

The leading explanation involves **fractal supply networks**. Geoffrey West and colleagues showed that organisms distribute nutrients through branching networks (blood vessels, tracheal tubes) that are space-filling fractals. The mathematical constraints of these networks — minimizing transport costs while reaching every cell — produce the 3/4 scaling exponent.

This law connects directly to our story: the hare has a higher mass-specific metabolic rate than the tortoise. It burns energy faster, runs faster, but also ages faster. The tortoise's lower metabolic rate per gram means slower everything — slower movement, slower aging, slower life.

Per-gram metabolic rates:
- **Hare** (~3 kg): ~10 W/kg
- **Tortoise** (~5 kg): ~0.5 W/kg (as an ectotherm, much lower)
- **Mouse** (~0.03 kg): ~20 W/kg
- **Elephant** (~5000 kg): ~1 W/kg`,
      analogy: 'Kleiber\'s law is like fuel efficiency in vehicles. A motorcycle (small) burns more fuel per kg than a freight train (large). The train has optimized its engine, tracks, and logistics to move each kilogram of cargo with less wasted energy. Biology does the same through optimized supply networks.',
      storyConnection: 'The hare sprinted — its high metabolic rate giving it explosive speed. The tortoise plodded — its low metabolic rate making every calorie count over a long distance. Kleiber\'s law explains WHY these two animals have such different speeds: their metabolic engines are fundamentally different.',
      checkQuestion: 'If Kleiber\'s law gives BMR = 70 * M^0.75 (in kcal/day, M in kg), calculate the total BMR and per-kg BMR for a 3 kg hare and a 5000 kg elephant. Which burns more energy total? Which burns more per kilogram?',
      checkAnswer: 'Hare: BMR = 70 * 3^0.75 = 70 * 2.28 = 159.6 kcal/day. Per kg: 53.2 kcal/kg/day. Elephant: BMR = 70 * 5000^0.75 = 70 * 594.6 = 41,622 kcal/day. Per kg: 8.3 kcal/kg/day. The elephant burns 261x more total energy but only 0.16x per kilogram. This is why large animals move slowly and live long — they are metabolically efficient.',
      codeIntro: 'Visualize Kleiber\'s law across the animal kingdom and explore how metabolic rate dictates life tempo.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Kleiber's law: BMR = B0 * M^0.75
# B0 = 70 kcal/day for mammals, ~10 for reptiles (ectotherms)
B0_mammal = 70  # kcal/day
B0_reptile = 10  # kcal/day (ectotherms have ~7-10x lower metabolic rates)

# Animal data: (name, mass_kg, is_mammal, color)
animals = [
    ('Mouse', 0.03, True, '#ef4444'),
    ('Rat', 0.3, True, '#f59e0b'),
    ('Hare', 3, True, '#22c55e'),
    ('Cat', 4, True, '#3b82f6'),
    ('Dog', 15, True, '#a855f7'),
    ('Human', 70, True, '#ec4899'),
    ('Horse', 500, True, '#6b7280'),
    ('Elephant', 5000, True, '#14b8a6'),
    ('Whale', 80000, True, '#8b5cf6'),
    ('Tortoise', 5, False, '#f97316'),
    ('Iguana', 2, False, '#84cc16'),
    ('Crocodile', 200, False, '#06b6d4'),
]

masses = np.logspace(-2, 5, 500)
bmr_mammal = B0_mammal * masses**0.75
bmr_reptile = B0_reptile * masses**0.75
bmr_per_kg_mammal = B0_mammal * masses**(0.75 - 1)
bmr_per_kg_reptile = B0_reptile * masses**(0.75 - 1)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Kleiber's law (log-log)
ax = axes[0, 0]
ax.loglog(masses, bmr_mammal, color='#22c55e', linewidth=2, label='Mammals (BMR = 70·M^0.75)')
ax.loglog(masses, bmr_reptile, color='#f59e0b', linewidth=2, label='Reptiles (BMR = 10·M^0.75)')
# If it were linear
ax.loglog(masses, B0_mammal * masses, color='gray', linewidth=1, linestyle=':', alpha=0.5, label='Linear scaling (M^1.0)')
for name, m, is_mam, color in animals:
    b0 = B0_mammal if is_mam else B0_reptile
    bmr = b0 * m**0.75
    ax.plot(m, bmr, 'o', color=color, markersize=8, zorder=5)
    ax.annotate(name, (m, bmr), textcoords='offset points', xytext=(5, 5),
                color=color, fontsize=7)
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('BMR (kcal/day)', color='white')
ax.set_title("Kleiber's Law: Metabolic Scaling", color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Per-kg metabolic rate
ax = axes[0, 1]
ax.loglog(masses, bmr_per_kg_mammal, color='#22c55e', linewidth=2, label='Mammals per kg')
ax.loglog(masses, bmr_per_kg_reptile, color='#f59e0b', linewidth=2, label='Reptiles per kg')
for name, m, is_mam, color in animals:
    b0 = B0_mammal if is_mam else B0_reptile
    bmr_pk = b0 * m**(0.75 - 1)
    ax.plot(m, bmr_pk, 'o', color=color, markersize=8, zorder=5)
    ax.annotate(name, (m, bmr_pk), textcoords='offset points', xytext=(5, 5),
                color=color, fontsize=7)
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('BMR per kg (kcal/kg/day)', color='white')
ax.set_title('Mass-Specific Metabolic Rate', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Why 3/4? Comparing exponents
ax = axes[1, 0]
exponents = [0.5, 0.67, 0.75, 0.85, 1.0]
exp_labels = ['Surface area\\n(2/3)', 'Geometric\\n(2/3)', "Kleiber's\\n(3/4)", 'Empirical\\n(0.85)', 'Linear\\n(1.0)']
exp_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#6b7280']

# Compare: 5000 kg elephant vs 3 kg hare
m_large, m_small = 5000, 3
for exp, label, color in zip(exponents, exp_labels, exp_colors):
    ratio = (m_large / m_small)**exp
    ax.bar(label, ratio, color=color, edgecolor='none', width=0.6)
    ax.text(label, ratio + 20, f'{ratio:.0f}x', ha='center', color='white', fontsize=9)

ax.set_ylabel('BMR ratio (elephant / hare)', color='white')
ax.set_title('Scaling Exponent Matters', color='white', fontsize=11)
ax.tick_params(axis='x', labelsize=8)

# Plot 4: Hare vs Tortoise energy budget
ax = axes[1, 1]
hours = np.arange(0, 25)
hare_bmr = B0_mammal * 3**0.75  # kcal/day
tortoise_bmr = B0_reptile * 5**0.75  # kcal/day
hare_cumulative = hare_bmr * hours / 24
tortoise_cumulative = tortoise_bmr * hours / 24

# Hare with sprint (10x BMR for 1 hour)
hare_with_sprint = hare_cumulative.copy()
hare_with_sprint[5:] += hare_bmr * 10 / 24  # sprint at hour 5

ax.plot(hours, hare_cumulative, color='#22c55e', linewidth=2, label=f'Hare resting ({hare_bmr:.0f} kcal/day)')
ax.plot(hours, hare_with_sprint, color='#22c55e', linewidth=2, linestyle='--', label='Hare + 1h sprint')
ax.plot(hours, tortoise_cumulative, color='#f59e0b', linewidth=2, label=f'Tortoise ({tortoise_bmr:.0f} kcal/day)')
ax.fill_between(hours, hare_cumulative, hare_with_sprint, alpha=0.15, color='#22c55e')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Cumulative energy (kcal)', color='white')
ax.set_title('Daily Energy Budget: Hare vs Tortoise', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Kleiber's Law Summary:")
print(f"  Hare (3 kg, mammal):     BMR = {B0_mammal * 3**0.75:.1f} kcal/day ({B0_mammal * 3**(0.75-1):.1f} kcal/kg/day)")
print(f"  Tortoise (5 kg, reptile): BMR = {B0_reptile * 5**0.75:.1f} kcal/day ({B0_reptile * 5**(0.75-1):.1f} kcal/kg/day)")
print(f"  The hare burns {B0_mammal * 3**0.75 / (B0_reptile * 5**0.75):.1f}x more energy per day")
print(f"  This 3/4 power law holds across 20+ orders of magnitude in body mass")`,
      challenge: 'Add birds to the plot (B0 ≈ 130 for birds — they have even higher metabolic rates than mammals). Include a hummingbird (0.003 kg), sparrow (0.03 kg), and ostrich (100 kg). Why do birds have higher metabolic rates than mammals of the same size?',
      successHint: 'Kleiber\'s law is one of the most universal patterns in biology. It connects a mouse to a whale through a single equation. The 3/4 exponent emerges from the physics of fractal supply networks — one of the deepest results in theoretical biology.',
    },
    {
      title: 'Locomotion energetics — the cost of transport',
      concept: `Different forms of locomotion have vastly different energy costs. The **cost of transport (COT)** measures energy per unit mass per unit distance: COT = energy / (mass * distance), in J/(kg·m).

Running is expensive — it requires repeatedly fighting gravity with each stride. Swimming is cheap for aquatic animals — water supports body weight. Flying is in between. But the most important factor is **body size**:

- **Running COT** scales as M^(-0.25) — larger runners are more efficient per kg
- **Swimming COT** scales similarly but is ~10x cheaper than running at any given size
- **Walking** is cheaper than running due to pendulum-like energy recovery

For our tortoise vs hare comparison:
- **Hare running** (~3 kg, ~15 m/s): COT ≈ 10 J/(kg·m)
- **Tortoise walking** (~5 kg, ~0.1 m/s): COT ≈ 15 J/(kg·m) — actually MORE expensive per meter!

Wait — the tortoise is LESS efficient per meter? Yes. But the tortoise wins the efficiency game because it moves SLOWLY. Its total power output (COT * mass * speed) is tiny: 0.1 m/s * 5 kg * 15 J/(kg·m) = 7.5 W vs the hare's 15 m/s * 3 kg * 10 J/(kg·m) = 450 W. The tortoise uses 60x less power, which is why it can sustain movement all day on minimal food.`,
      analogy: 'Cost of transport is like fuel cost per mile. A sports car (hare) might actually get better miles-per-gallon at cruising speed than a bicycle (tortoise). But the bicycle uses almost zero fuel total because it goes slowly. The hare is more efficient per meter but burns through its fuel tank in minutes.',
      storyConnection: 'The hare blazed ahead because it could convert food energy into speed efficiently. The tortoise plodded because its cost per meter was actually higher. But the tortoise won because the race was about total distance on a limited energy budget — and slow-but-sustained beats fast-but-exhausted.',
      checkQuestion: 'A 3 kg hare with COT = 10 J/(kg·m) runs at 15 m/s. A 5 kg tortoise with COT = 15 J/(kg·m) walks at 0.1 m/s. If both have 100 kJ of energy, how far can each go?',
      checkAnswer: 'Hare: distance = energy / (mass * COT) = 100,000 / (3 * 10) = 3,333 meters. Tortoise: 100,000 / (5 * 15) = 1,333 meters. The hare actually goes farther on the same energy! But the hare exhausts its 100 kJ in 3,333/15 = 222 seconds (3.7 minutes), while the tortoise takes 1,333/0.1 = 13,330 seconds (3.7 hours). The real advantage is that the tortoise can eat and replenish along the way — the race is really about power management, not efficiency.',
      codeIntro: 'Model locomotion energetics across body sizes and compare the tortoise and hare strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

masses = np.logspace(-3, 4, 200)  # 1g to 10,000 kg

# Cost of Transport scaling (empirical fits from Tucker 1970, Full 1989)
# COT in J/(kg·m)
cot_running = 10.7 * masses**(-0.32)
cot_swimming = 0.6 * masses**(-0.30)
cot_flying = 3.0 * masses**(-0.23)

# Maximum speed scaling
# v_max ∝ M^0.17 (approximately) for runners
v_max_running = 10 * masses**0.17
v_max_running = np.clip(v_max_running, 0.1, 30)

# Endurance speed (sustainable): much lower, about 30% of max
v_endurance = 0.3 * v_max_running

# Power = COT * mass * speed
power_max = cot_running * masses * v_max_running
power_endurance = cot_running * masses * v_endurance

# Specific animals
animals = [
    ('Ant', 0.001, 0.05, 'running'),
    ('Mouse', 0.03, 3, 'running'),
    ('Tortoise', 5, 0.1, 'running'),
    ('Hare', 3, 15, 'running'),
    ('Human', 70, 10, 'running'),
    ('Horse', 500, 18, 'running'),
    ('Cheetah', 50, 30, 'running'),
    ('Salmon', 5, 2, 'swimming'),
    ('Pigeon', 0.3, 20, 'flying'),
]

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: COT vs body mass
ax = axes[0, 0]
ax.loglog(masses, cot_running, color='#22c55e', linewidth=2, label='Running')
ax.loglog(masses, cot_swimming, color='#3b82f6', linewidth=2, label='Swimming')
ax.loglog(masses, cot_flying, color='#f59e0b', linewidth=2, label='Flying')
for name, m, v, mode in animals:
    if mode == 'running':
        cot = 10.7 * m**(-0.32)
        color = '#22c55e'
    elif mode == 'swimming':
        cot = 0.6 * m**(-0.30)
        color = '#3b82f6'
    else:
        cot = 3.0 * m**(-0.23)
        color = '#f59e0b'
    ax.plot(m, cot, 'o', color=color, markersize=7, zorder=5)
    ax.annotate(name, (m, cot), textcoords='offset points', xytext=(5, 3),
                color='white', fontsize=7)
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('COT (J/kg/m)', color='white')
ax.set_title('Cost of Transport', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Power vs body mass at max speed
ax = axes[0, 1]
ax.loglog(masses, power_max, color='#ef4444', linewidth=2, label='At max speed')
ax.loglog(masses, power_endurance, color='#22c55e', linewidth=2, label='At endurance speed')
for name, m, v, mode in animals:
    if mode == 'running':
        cot = 10.7 * m**(-0.32)
        power = cot * m * v
        ax.plot(m, power, 'o', color='#f59e0b', markersize=7, zorder=5)
        ax.annotate(name, (m, power), textcoords='offset points', xytext=(5, 3),
                    color='white', fontsize=7)
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Power (W)', color='white')
ax.set_title('Locomotion Power Output', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Tortoise vs Hare race simulation
ax = axes[0, 2]
time = np.linspace(0, 3600, 1000)  # 1 hour

# Hare: sprints at 15 m/s for 3 minutes, then exhausted (rests)
hare_speed = np.where(time < 180, 15, 0)  # sprint then stop
hare_distance = np.cumsum(hare_speed) * (time[1] - time[0])

# Tortoise: steady 0.1 m/s the whole time
tortoise_speed = np.full_like(time, 0.1)
tortoise_distance = 0.1 * time

# Hare catches up after rest
hare_speed_v2 = np.where(time < 180, 15, np.where(time > 2400, 15, 0))
hare_distance_v2 = np.cumsum(hare_speed_v2) * (time[1] - time[0])

ax.plot(time / 60, hare_distance, color='#22c55e', linewidth=2, label='Hare (sprint-rest)')
ax.plot(time / 60, tortoise_distance, color='#f59e0b', linewidth=2, label='Tortoise (steady)')
ax.plot(time / 60, hare_distance_v2, color='#22c55e', linewidth=2, linestyle='--', label='Hare (sprint-rest-sprint)')
ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Distance (m)', color='white')
ax.set_title('The Race: Sprint vs Steady', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Energy budget over time
ax = axes[1, 0]
hare_cot = 10.7 * 3**(-0.32)
tortoise_cot = 10.7 * 5**(-0.32)
hare_energy = np.cumsum(hare_speed * 3 * hare_cot) * (time[1] - time[0]) / 1000  # kJ
tortoise_energy = tortoise_cot * 5 * 0.1 * time / 1000  # kJ

hare_reserve = 50 - hare_energy  # 50 kJ initial reserve
tortoise_reserve = 20 - tortoise_energy  # 20 kJ (lower, ectotherm)

ax.plot(time / 60, hare_reserve, color='#22c55e', linewidth=2, label='Hare energy reserve')
ax.plot(time / 60, tortoise_reserve, color='#f59e0b', linewidth=2, label='Tortoise energy reserve')
ax.axhline(0, color='#ef4444', linestyle='--', linewidth=1, label='Exhaustion')
ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Energy reserve (kJ)', color='white')
ax.set_title('Energy Depletion', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Stride efficiency — pendulum model
ax = axes[1, 1]
# Walking uses inverted pendulum: KE <-> PE exchange
leg_length = np.linspace(0.05, 1.5, 100)
# Froude number: Fr = v^2 / (g * L) — walk-run transition at Fr ≈ 0.5
walk_max_speed = np.sqrt(0.5 * 9.81 * leg_length)
# Energy recovery in walking: ~60-70% via pendulum
recovery = 0.65 * np.ones_like(leg_length)  # walking
recovery_run = 0.05 * np.ones_like(leg_length)  # running (elastic only)

ax.plot(leg_length, walk_max_speed, color='#3b82f6', linewidth=2, label='Max walking speed')
ax.axhline(0.1, color='#f59e0b', linestyle=':', label='Tortoise speed (0.1 m/s)')
ax.axhline(2.0, color='gray', linestyle=':', label='Human walk (2 m/s)')
# Mark tortoise and hare leg lengths
ax.axvline(0.05, color='#f59e0b', linestyle='--', alpha=0.5, label='Tortoise leg (5cm)')
ax.axvline(0.15, color='#22c55e', linestyle='--', alpha=0.5, label='Hare leg (15cm)')
ax.set_xlabel('Leg length (m)', color='white')
ax.set_ylabel('Max walking speed (m/s)', color='white')
ax.set_title('Pendulum Walking: Speed vs Leg Length', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary table
ax = axes[1, 2]
ax.axis('off')
text = """Locomotion Energetics Summary
==================================

               Hare        Tortoise
Mass:          3 kg         5 kg
Max speed:     15 m/s       0.1 m/s
COT:           %.1f J/kg/m  %.1f J/kg/m
Power (sprint): %.0f W      %.1f W
Energy/hour:   %.0f kJ      %.1f kJ

The tortoise is LESS efficient per meter
but uses 60x less POWER.

In a limited-energy race, the hare
sprints farther faster — but the tortoise
can sustain movement indefinitely.

Strategy beats speed.""" % (
    hare_cot, tortoise_cot,
    hare_cot * 3 * 15, tortoise_cot * 5 * 0.1,
    hare_cot * 3 * 15 * 3.6, tortoise_cot * 5 * 0.1 * 3.6
)
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("The tortoise and hare represent two fundamental locomotion strategies:")
print("  High-power sprinting (anaerobic, fast exhaustion)")
print("  Low-power endurance (aerobic, sustainable indefinitely)")
print("Neither is universally better — the right strategy depends on the race.")`,
      challenge: 'Add a "marathon runner" strategy for the hare: instead of sprinting at 15 m/s, it runs at 5 m/s (sustainable pace). Plot the new race and energy curves. At what speed does the hare optimally balance distance per hour vs energy expenditure?',
      successHint: 'Locomotion energetics reveals a deep trade-off between speed and sustainability. The tortoise and hare fable captured a biological truth: the optimal strategy depends on the length and nature of the challenge.',
    },
    {
      title: 'Life history trade-offs — why the fast live short',
      concept: `Every organism faces a fundamental allocation problem: energy is finite, and it must be divided among **growth**, **reproduction**, and **maintenance** (damage repair, immune function). This creates **life history trade-offs** — you cannot maximize everything simultaneously.

The **rate of living theory** (originally from Raymond Pearl, 1928) proposes that organisms have a fixed "lifetime energy budget." Those that burn it quickly (high metabolic rate) die young; those that burn it slowly live long.

While oversimplified, the pattern holds broadly:
- **Mouse**: lifespan ~2 years, heart rate ~600 bpm
- **Hare**: lifespan ~8 years, heart rate ~200 bpm
- **Tortoise**: lifespan ~100+ years, heart rate ~10 bpm
- **Human**: lifespan ~80 years, heart rate ~70 bpm

Total heartbeats in a lifetime:
- Mouse: 600 * 60 * 24 * 365 * 2 ≈ 630 million
- Elephant: 30 * 60 * 24 * 365 * 65 ≈ 1.0 billion
- Human: 70 * 60 * 24 * 365 * 80 ≈ 2.9 billion (we are outliers!)

The key trade-offs:
1. **Speed vs lifespan**: fast metabolism → more oxidative damage → shorter life
2. **Reproduction vs maintenance**: reproduce early and often → less energy for repair → shorter life
3. **Growth vs reproduction**: grow large first → delay reproduction → fewer generations
4. **Current vs future reproduction**: invest in this litter → less energy for next → boom-bust strategy`,
      analogy: 'Life history trade-offs are like managing a budget. You can spend lavishly now (high reproduction = the hare strategy) or invest conservatively for the long term (slow reproduction, long life = the tortoise strategy). Neither is wrong — they are different financial plans optimized for different market conditions (environments).',
      storyConnection: 'The hare lives fast — reproducing prolifically in its short 8-year life. The tortoise lives slowly — taking decades to mature but potentially living over a century. The race between them is not just about speed — it is about two fundamentally different life strategies competing across evolutionary time.',
      checkQuestion: 'A hare produces 12 offspring per year for 8 years (96 total). A tortoise produces 4 offspring per year for 80 years (320 total). If only 5% of hare offspring survive to adulthood vs 20% of tortoise offspring, which strategy produces more surviving adults?',
      checkAnswer: 'Hare: 96 * 0.05 = 4.8 surviving adults. Tortoise: 320 * 0.20 = 64 surviving adults. The tortoise strategy wins by a huge margin here. But if predation on young tortoises suddenly increased (survival drops to 2%), tortoise output drops to 6.4 — barely more than the hare. Life history strategies are tuned to specific ecological conditions.',
      codeIntro: 'Model life history trade-offs and simulate how different allocation strategies affect lifetime fitness.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Life history model: an organism allocates energy each year among:
# - Growth (increases body size and future reproduction capacity)
# - Reproduction (produces offspring now)
# - Maintenance (reduces mortality risk)

def simulate_life_history(strategy, max_years=150):
    """Simulate lifetime of an organism with given allocation strategy.
    strategy: dict with keys 'growth_frac', 'repro_frac', 'maint_frac'
    """
    body_size = 1.0  # relative
    age = 0
    alive = True
    total_offspring = 0
    surviving_offspring = 0
    yearly_data = []

    growth_frac = strategy['growth_frac']
    repro_frac = strategy['repro_frac']
    maint_frac = strategy['maint_frac']

    while alive and age < max_years:
        # Metabolic rate scales with body size
        metabolic_rate = body_size**0.75

        # Growth: increases body size (diminishing returns)
        body_size += growth_frac * 0.1 / (1 + body_size * 0.2)

        # Reproduction: offspring proportional to body size and allocation
        if age >= strategy.get('maturity_age', 1):
            offspring = repro_frac * body_size * 2
            offspring = max(0, int(offspring + np.random.randn() * 0.5))
        else:
            offspring = 0

        # Offspring survival depends on parental investment (inverse of litter size)
        if offspring > 0:
            survival_rate = min(0.5, 0.8 / offspring)
        else:
            survival_rate = 0

        survived = np.random.binomial(offspring, survival_rate)
        total_offspring += offspring
        surviving_offspring += survived

        # Mortality: base rate modified by maintenance and age
        base_mortality = 0.005 + 0.0005 * age**1.5  # Gompertz-like aging
        mortality_reduction = maint_frac * 0.8
        death_prob = base_mortality * (1 - mortality_reduction)
        death_prob = np.clip(death_prob, 0.001, 0.99)

        if np.random.random() < death_prob:
            alive = False

        yearly_data.append({
            'age': age,
            'body_size': body_size,
            'offspring': offspring,
            'survived': survived,
            'death_prob': death_prob,
            'metabolic_rate': metabolic_rate,
        })
        age += 1

    return age, total_offspring, surviving_offspring, yearly_data

# Define strategies
strategies = [
    {'name': 'Hare (fast)', 'growth_frac': 0.1, 'repro_frac': 0.7, 'maint_frac': 0.2,
     'maturity_age': 1, 'color': '#22c55e'},
    {'name': 'Tortoise (slow)', 'growth_frac': 0.3, 'repro_frac': 0.2, 'maint_frac': 0.5,
     'maturity_age': 15, 'color': '#f59e0b'},
    {'name': 'Balanced', 'growth_frac': 0.33, 'repro_frac': 0.34, 'maint_frac': 0.33,
     'maturity_age': 5, 'color': '#3b82f6'},
    {'name': 'All maintenance', 'growth_frac': 0.1, 'repro_frac': 0.1, 'maint_frac': 0.8,
     'maturity_age': 10, 'color': '#a855f7'},
]

# Run Monte Carlo simulations
n_trials = 200
fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

all_results = {}
for strat in strategies:
    lifespans = []
    total_offs = []
    surviving_offs = []
    for _ in range(n_trials):
        age, total, survived, _ = simulate_life_history(strat)
        lifespans.append(age)
        total_offs.append(total)
        surviving_offs.append(survived)
    all_results[strat['name']] = {
        'lifespans': lifespans,
        'total': total_offs,
        'survived': surviving_offs,
    }

# Plot 1: Lifespan distribution
ax = axes[0, 0]
for strat in strategies:
    data = all_results[strat['name']]['lifespans']
    ax.hist(data, bins=30, alpha=0.5, color=strat['color'],
            label=f"{strat['name']} (μ={np.mean(data):.0f}yr)")
ax.set_xlabel('Lifespan (years)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Lifespan Distribution', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Surviving offspring distribution
ax = axes[0, 1]
for strat in strategies:
    data = all_results[strat['name']]['survived']
    ax.hist(data, bins=30, alpha=0.5, color=strat['color'],
            label=f"{strat['name']} (μ={np.mean(data):.0f})")
ax.set_xlabel('Surviving offspring (lifetime)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Fitness (Surviving Offspring)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Lifespan vs fitness scatter
ax = axes[0, 2]
for strat in strategies:
    ls = all_results[strat['name']]['lifespans']
    so = all_results[strat['name']]['survived']
    ax.scatter(ls, so, alpha=0.3, s=15, color=strat['color'], label=strat['name'])
ax.set_xlabel('Lifespan (years)', color='white')
ax.set_ylabel('Surviving offspring', color='white')
ax.set_title('Lifespan vs Fitness', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Single representative life trajectory
ax = axes[1, 0]
for strat in strategies:
    _, _, _, data = simulate_life_history(strat, max_years=100)
    ages = [d['age'] for d in data]
    cumulative = np.cumsum([d['survived'] for d in data])
    ax.plot(ages, cumulative, color=strat['color'], linewidth=2, label=strat['name'])
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Cumulative surviving offspring', color='white')
ax.set_title('Reproductive Success Over Time', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Heart rate and lifespan
ax = axes[1, 1]
hr_animals = [
    ('Hummingbird', 1200, 5, '#ef4444'),
    ('Mouse', 600, 2, '#f59e0b'),
    ('Hare', 200, 8, '#22c55e'),
    ('Cat', 150, 15, '#3b82f6'),
    ('Human', 70, 80, '#a855f7'),
    ('Elephant', 30, 65, '#14b8a6'),
    ('Tortoise', 10, 150, '#f97316'),
    ('Whale', 8, 90, '#8b5cf6'),
]
for name, hr, ls, color in hr_animals:
    total_beats = hr * 60 * 24 * 365 * ls / 1e9
    ax.scatter(hr, ls, s=total_beats * 50 + 50, color=color, alpha=0.7, zorder=5)
    ax.annotate(name, (hr, ls), textcoords='offset points', xytext=(8, 3),
                color=color, fontsize=8)
ax.set_xscale('log')
ax.set_yscale('log')
ax.set_xlabel('Heart rate (bpm)', color='white')
ax.set_ylabel('Lifespan (years)', color='white')
ax.set_title('Heart Rate vs Lifespan (size = total beats)', color='white', fontsize=10)

# Plot 6: Strategy summary
ax = axes[1, 2]
strat_names = [s['name'] for s in strategies]
mean_lifespan = [np.mean(all_results[s['name']]['lifespans']) for s in strategies]
mean_fitness = [np.mean(all_results[s['name']]['survived']) for s in strategies]
x_pos = np.arange(len(strat_names))
ax.bar(x_pos - 0.2, [l/max(mean_lifespan) for l in mean_lifespan], 0.35,
       color='#3b82f6', label='Lifespan (norm)')
ax.bar(x_pos + 0.2, [f/max(mean_fitness) if max(mean_fitness) > 0 else 0 for f in mean_fitness], 0.35,
       color='#22c55e', label='Fitness (norm)')
ax.set_xticks(x_pos)
ax.set_xticklabels([s.split('(')[0].strip() for s in strat_names], color='white', fontsize=8)
ax.set_ylabel('Normalized value', color='white')
ax.set_title('Strategy Comparison', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Life history trade-off results (averaged over", n_trials, "simulations):")
for strat in strategies:
    r = all_results[strat['name']]
    print(f"  {strat['name']:20s}: lifespan={np.mean(r['lifespans']):.0f}yr, "
          f"offspring={np.mean(r['total']):.0f}, survived={np.mean(r['survived']):.0f}")`,
      challenge: 'Add environmental variability: in "good years" (random 50% of years), food is abundant and reproduction doubles. In "bad years," mortality doubles. Which strategy (hare or tortoise) performs better in variable environments? This connects to r-selection vs K-selection theory.',
      successHint: 'Life history theory reveals that the tortoise and hare represent two endpoints of a fundamental biological spectrum. Neither is universally better — the optimal strategy depends on environmental stability, predation, and resource availability.',
    },
    {
      title: 'Ectotherm vs endotherm efficiency — cold-blooded advantage',
      concept: `The tortoise is an **ectotherm** (cold-blooded) — it gets body heat from the environment. The hare is an **endotherm** (warm-blooded) — it generates body heat internally. This fundamental difference explains much of their biology.

Endotherms spend 80-90% of their metabolic energy on **thermoregulation** — maintaining body temperature. A resting mammal burns 10x more energy than a resting reptile of the same size, mostly just to stay warm.

This seems wasteful, but endothermy has a massive advantage: **temperature independence**. An endotherm can hunt at night, in winter, at high altitude — any condition where an ectotherm would be sluggish or inactive.

The efficiency trade-off:
- **Ectotherm (tortoise)**: needs ~10% of the food an endotherm needs. Can survive months without eating. But performance drops sharply in cold temperatures.
- **Endotherm (hare)**: needs constant food intake. Can die within days without eating. But performs consistently across temperatures.

The **Q10 rule**: for every 10°C drop in body temperature, enzymatic reaction rates roughly halve. An ectotherm at 15°C operates at about 50% the speed of one at 25°C. An endotherm at 37°C operates at full speed regardless of ambient temperature.

This is why reptiles dominate deserts and tropics (stable warmth = free heating) but mammals dominate temperate and arctic zones (variable temperatures require internal heating).`,
      analogy: 'An endotherm is like a house with central heating — comfortable in any weather but expensive to run. An ectotherm is like a tent — nearly free to maintain in summer but useless in winter. The hare pays a huge energy bill for temperature independence. The tortoise pays nothing for heating but is at the mercy of the weather.',
      storyConnection: 'On a cool morning, the hare was already running at full speed while the tortoise was barely moving, its muscles cold and sluggish. But by midday under the hot sun, the tortoise was warmed up and moving steadily while the hare was overheating from its own metabolic furnace. Temperature shaped the race.',
      checkQuestion: 'A 5 kg tortoise and a 5 kg mammal both need to cross a 10 km desert. The tortoise can go 30 days without food. The mammal needs to eat daily. Which is more likely to survive? What if the desert is in Antarctica?',
      checkAnswer: 'In a hot desert, the tortoise wins easily — it needs almost no food, can slow down or become dormant during the hottest hours, and its ectothermy is an advantage where solar heat is free. In Antarctica, the tortoise loses completely — it would become immobile at sub-zero temperatures. The mammal\'s endothermy, though energy-expensive, is essential for function in the cold. No strategy wins everywhere.',
      codeIntro: 'Model the metabolic efficiency of ectotherms vs endotherms across temperature ranges.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Temperature range
temps = np.linspace(-10, 45, 200)  # ambient temperature (°C)

# Endotherm metabolic rate: constant + thermoregulation cost
# Below thermoneutral zone (TNZ), must generate heat
# Above TNZ, must cool (panting, etc.)
def endotherm_bmr(T_ambient, body_temp=37, mass_kg=5, tnz_low=25, tnz_high=35):
    """Total metabolic rate for an endotherm."""
    base_bmr = 70 * mass_kg**0.75  # kcal/day (Kleiber)
    if T_ambient < tnz_low:
        # Must generate heat proportional to temperature difference
        heating_cost = base_bmr * 0.05 * (tnz_low - T_ambient)
    elif T_ambient > tnz_high:
        # Cooling is expensive
        cooling_cost = base_bmr * 0.08 * (T_ambient - tnz_high)
        return base_bmr + cooling_cost
    else:
        heating_cost = 0
    return base_bmr + heating_cost

# Ectotherm metabolic rate: depends directly on temperature
def ectotherm_bmr(T_ambient, mass_kg=5, T_ref=25, Q10=2.5):
    """Total metabolic rate for an ectotherm."""
    base_bmr = 10 * mass_kg**0.75  # kcal/day (much lower baseline)
    if T_ambient < 5:
        return base_bmr * 0.05  # dormant below 5°C
    # Q10 scaling
    temp_factor = Q10**((T_ambient - T_ref) / 10)
    return base_bmr * temp_factor

# Ectotherm performance (speed, etc.) — peaks at optimal temp
def ectotherm_performance(T_ambient, T_opt=30, T_min=5, T_max=42):
    """Normalized performance (0-1) of an ectotherm."""
    if T_ambient <= T_min or T_ambient >= T_max:
        return 0.0
    if T_ambient <= T_opt:
        return (T_ambient - T_min) / (T_opt - T_min)
    else:
        return (T_max - T_ambient) / (T_max - T_opt)

endo_bmrs = np.array([endotherm_bmr(t) for t in temps])
ecto_bmrs = np.array([ectotherm_bmr(t) for t in temps])
ecto_perf = np.array([ectotherm_performance(t) for t in temps])
endo_perf = np.ones_like(temps) * 0.95  # nearly constant performance
endo_perf[temps < -5] = 0.7  # slight cold penalty
endo_perf[temps > 40] = 0.5  # heat stress

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Metabolic rate vs temperature
ax = axes[0, 0]
ax.plot(temps, endo_bmrs, color='#22c55e', linewidth=2, label='Hare (endotherm)')
ax.plot(temps, ecto_bmrs, color='#f59e0b', linewidth=2, label='Tortoise (ectotherm)')
ax.fill_between(temps, ecto_bmrs, endo_bmrs, alpha=0.1, color='#ef4444')
ax.set_xlabel('Ambient temperature (°C)', color='white')
ax.set_ylabel('Metabolic rate (kcal/day)', color='white')
ax.set_title('Metabolic Rate vs Temperature', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Performance vs temperature
ax = axes[0, 1]
ax.plot(temps, endo_perf, color='#22c55e', linewidth=2, label='Hare (endotherm)')
ax.plot(temps, ecto_perf, color='#f59e0b', linewidth=2, label='Tortoise (ectotherm)')
ax.fill_between(temps, ecto_perf, alpha=0.15, color='#f59e0b')
ax.set_xlabel('Ambient temperature (°C)', color='white')
ax.set_ylabel('Performance (normalized)', color='white')
ax.set_title('Performance vs Temperature', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Efficiency = performance / metabolic rate
ax = axes[0, 2]
endo_eff = endo_perf / (endo_bmrs / np.max(endo_bmrs))
ecto_eff = ecto_perf / np.where(ecto_bmrs > 0, ecto_bmrs / np.max(ecto_bmrs), 0.01)
ax.plot(temps, endo_eff, color='#22c55e', linewidth=2, label='Hare efficiency')
ax.plot(temps, ecto_eff, color='#f59e0b', linewidth=2, label='Tortoise efficiency')
ax.set_xlabel('Ambient temperature (°C)', color='white')
ax.set_ylabel('Efficiency (perf / metabolic cost)', color='white')
ax.set_title('Energy Efficiency', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Daily temperature cycle — race simulation
ax = axes[1, 0]
hours = np.linspace(0, 24, 200)
temp_cycle = 20 + 10 * np.sin(np.pi * (hours - 6) / 12)
temp_cycle = np.where(hours < 6, 12 + 3 * hours / 6, temp_cycle)
temp_cycle = np.where(hours > 18, 30 - 18 * (hours - 18) / 6, temp_cycle)

hare_speed = 2.0 * np.ones_like(hours)  # constant pace
tortoise_speed = np.array([0.1 * ectotherm_performance(t, T_opt=28) for t in temp_cycle])

ax.plot(hours, temp_cycle, color='#ef4444', linewidth=1, linestyle='--', label='Temperature')
ax2 = ax.twinx()
ax2.plot(hours, hare_speed, color='#22c55e', linewidth=2, label='Hare speed')
ax2.plot(hours, tortoise_speed, color='#f59e0b', linewidth=2, label='Tortoise speed')
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Temperature (°C)', color='#ef4444')
ax2.set_ylabel('Speed (m/s)', color='white')
ax.set_title('Daily Speed Profile', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')
ax2.tick_params(colors='gray')

# Plot 5: Food requirement comparison
ax = axes[1, 1]
food_categories = ['Resting\\n(per day)', 'Active\\n(per day)', 'Per year', 'Fasting\\ntolerance']
hare_food = [160, 400, 365 * 280, 3]  # kcal, kcal, kcal, days
tortoise_food = [33, 60, 365 * 46, 180]  # kcal, kcal, kcal, days

x_pos = np.arange(len(food_categories))
ax.bar(x_pos - 0.2, [np.log10(max(v, 1)) for v in hare_food], 0.35,
       color='#22c55e', label='Hare')
ax.bar(x_pos + 0.2, [np.log10(max(v, 1)) for v in tortoise_food], 0.35,
       color='#f59e0b', label='Tortoise')
ax.set_xticks(x_pos)
ax.set_xticklabels(food_categories, color='white', fontsize=8)
ax.set_ylabel('log10(kcal or days)', color='white')
ax.set_title('Food & Fasting Comparison', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Climate zone dominance
ax = axes[1, 2]
climate_zones = ['Arctic', 'Temperate', 'Subtropical', 'Tropical', 'Desert']
endo_dominance = [0.95, 0.7, 0.5, 0.4, 0.4]
ecto_dominance = [0.05, 0.3, 0.5, 0.6, 0.6]
x_pos = np.arange(len(climate_zones))
ax.bar(x_pos, endo_dominance, 0.6, color='#22c55e', label='Endotherms')
ax.bar(x_pos, ecto_dominance, 0.6, bottom=endo_dominance, color='#f59e0b', label='Ectotherms')
ax.set_xticks(x_pos)
ax.set_xticklabels(climate_zones, color='white', fontsize=9)
ax.set_ylabel('Relative species dominance', color='white')
ax.set_title('Ecto vs Endo by Climate Zone', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Ectotherm vs Endotherm Summary:")
print(f"  Hare (endotherm, 5 kg):   BMR at 25°C = {endotherm_bmr(25):.0f} kcal/day")
print(f"  Tortoise (ectotherm, 5 kg): BMR at 25°C = {ectotherm_bmr(25):.0f} kcal/day")
print(f"  The tortoise needs {endotherm_bmr(25)/ectotherm_bmr(25):.0f}x LESS food at 25°C")
print(f"  But at 10°C, tortoise performance drops to {ectotherm_performance(10):.0%}")
print(f"  Ectothermy is the energy-efficient strategy — IF your environment cooperates.")`,
      challenge: 'Climate change is warming habitats by 2-4°C. Model how this shifts the ectotherm/endotherm balance. For a currently cool (15°C average) habitat, does warming help or hurt the tortoise relative to the hare? What about an already hot (35°C) habitat?',
      successHint: 'The ectotherm-endotherm divide is one of the most consequential evolutionary transitions. It shapes where animals live, how much they eat, how fast they move, and how long they live. The tortoise\'s cold-bloodedness is not a weakness — it is a supremely efficient strategy.',
    },
    {
      title: 'Shell biomechanics — engineering a portable fortress',
      concept: `The tortoise shell is one of evolution's greatest engineering achievements. It is not just armor — it is a **structural masterpiece** that provides protection, thermal regulation, water retention, and even sound resonance.

The shell consists of two layers:
- **Carapace** (top): fused ribs and vertebrae covered by keratinous scutes
- **Plastron** (bottom): fused dermal bones

The shell's dome shape is biomechanically brilliant. A dome distributes compressive loads across its entire surface — the same principle used in Roman arches and modern stadiums. When a predator bites the top, the force is distributed radially through the shell, preventing localized failure.

**Stress analysis**: The dome acts like a thin-walled pressure vessel in reverse — under external compression rather than internal pressure. The stress in a hemispherical shell under a point load P is approximately: sigma = P / (2 * pi * r * t), where r is the radius and t is the shell thickness.

For a 5 kg tortoise: shell radius ≈ 0.12 m, thickness ≈ 5 mm. Under a 500 N predator bite: sigma ≈ 500 / (2 * pi * 0.12 * 0.005) ≈ 133 kPa. Bone has a compressive strength of ~130-190 MPa — giving a safety factor of about 1000x. The shell is massively over-engineered.

But the shell has a cost: it comprises 30-40% of body mass. This is the trade-off — armor vs mobility, protection vs speed. The hare chose speed; the tortoise chose armor.`,
      analogy: 'A tortoise shell is like a motorcycle helmet — a dome-shaped structure that distributes impact forces over a large area rather than concentrating them at the point of impact. The helmet (and the shell) is heavy and restrictive, but when you need it, nothing else will save you.',
      storyConnection: 'While the hare relied on speed to escape predators, the tortoise relied on its shell. When threatened, it simply retracted and waited. Its shell could withstand forces that would crush the hare. Two survival strategies, both successful, both with trade-offs.',
      checkQuestion: 'The tortoise shell is a dome shape. Would a flat plate of the same mass provide better or worse protection? Why?',
      checkAnswer: 'Much worse. A flat plate concentrates stress at the point of impact and is prone to bending failure. A dome distributes the load through membrane stress (compression across the surface), which is far more efficient. This is why eggs, skulls, and hard hats are all dome-shaped — it is the optimal geometry for resisting external loads with minimum material.',
      codeIntro: 'Analyze shell biomechanics: dome vs flat, stress distribution, and the weight-protection trade-off.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Shell parameters
R = 0.12  # shell radius (m)
t = 0.005  # shell thickness (m)
bone_strength = 150e6  # compressive strength of bone (Pa)
keratin_strength = 50e6  # tensile strength of keratin (Pa)

# 1. Stress distribution in dome shell under point load
theta = np.linspace(0, np.pi/2, 100)  # angle from apex
P = 500  # applied load (N) — predator bite force

# Membrane stress in a hemispherical shell under apex load
# sigma_meridional and sigma_circumferential
sigma_meridional = P / (2 * np.pi * R * t * np.sin(theta)**2 + 1e-10)
sigma_meridional = np.clip(sigma_meridional, 0, 5e6)
sigma_circumferential = P / (2 * np.pi * R * t) * (1 / (np.sin(theta)**2 + 1e-10) - 1)
sigma_circumferential = np.clip(sigma_circumferential, -5e6, 5e6)

# 2. Flat plate comparison — bending stress
# For a circular plate under central point load:
# sigma_max = 3*P*(1+nu)/(2*pi*t^2) * ln(R/r_contact)
r_contact = 0.005  # contact radius of bite (m)
nu = 0.3  # Poisson's ratio
sigma_flat = 3 * P * (1 + nu) / (2 * np.pi * t**2) * np.log(R / r_contact)

# 3. Safety factors
sf_dome_apex = bone_strength / (P / (2 * np.pi * R * t))
sf_flat = bone_strength / sigma_flat

# 4. Weight-protection optimization
thicknesses = np.linspace(0.001, 0.015, 100)
shell_density = 2000  # kg/m^3 (bone)
shell_masses = 4/3 * np.pi * ((R + thicknesses)**3 - R**3) * shell_density  # hollow hemisphere
# Simplified: shell_mass ≈ 2*pi*R^2*t*density
shell_masses_approx = 2 * np.pi * R**2 * thicknesses * shell_density
# Protection = inverse of stress at apex
protection = bone_strength / (P / (2 * np.pi * R * thicknesses + 1e-10))
# Speed reduction: assume speed inversely proportional to (total_mass)
base_mass = 3.0  # body mass without shell
total_mass = base_mass + shell_masses_approx
speed_factor = base_mass / total_mass  # relative speed

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Stress distribution in dome
ax = axes[0, 0]
ax.plot(np.degrees(theta), sigma_meridional / 1e6, color='#22c55e', linewidth=2, label='Meridional stress')
ax.plot(np.degrees(theta), sigma_circumferential / 1e6, color='#3b82f6', linewidth=2, label='Circumferential stress')
ax.axhline(bone_strength / 1e6, color='#ef4444', linestyle='--', linewidth=1, label=f'Bone strength ({bone_strength/1e6:.0f} MPa)')
ax.set_xlabel('Angle from apex (degrees)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title(f'Dome Shell Stress ({P}N Load)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Dome vs Flat plate
ax = axes[0, 1]
comparison = ['Dome\\n(apex)', 'Dome\\n(45°)', 'Flat\\nplate']
stresses = [
    P / (2 * np.pi * R * t) / 1e6,
    sigma_meridional[50] / 1e6,
    sigma_flat / 1e6
]
colors = ['#22c55e', '#3b82f6', '#ef4444']
bars = ax.bar(comparison, stresses, color=colors, edgecolor='none', width=0.5)
ax.axhline(bone_strength / 1e6, color='white', linestyle='--', linewidth=1, label='Bone strength')
for bar, s in zip(bars, stresses):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{s:.1f} MPa', ha='center', color='white', fontsize=9)
ax.set_ylabel('Max stress (MPa)', color='white')
ax.set_title('Dome vs Flat Plate', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Safety factor vs thickness
ax = axes[1, 0]
safety_factors = bone_strength / (P / (2 * np.pi * R * thicknesses + 1e-10))
ax.semilogy(thicknesses * 1000, safety_factors, color='#22c55e', linewidth=2)
ax.axhline(1, color='#ef4444', linestyle='--', label='Failure threshold')
ax.axhline(10, color='#f59e0b', linestyle='--', label='Engineering minimum (10x)')
ax.axvline(5, color='gray', linestyle=':', alpha=0.5, label='Actual tortoise (5mm)')
ax.set_xlabel('Shell thickness (mm)', color='white')
ax.set_ylabel('Safety factor', color='white')
ax.set_title('Safety Factor vs Thickness', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Weight-speed-protection trade-off
ax = axes[0, 2]
ax.plot(thicknesses * 1000, speed_factor, color='#22c55e', linewidth=2, label='Speed factor')
ax.plot(thicknesses * 1000, np.clip(protection / np.max(protection), 0, 1),
        color='#3b82f6', linewidth=2, label='Protection (norm)')
# Fitness = geometric mean of speed and protection
fitness = np.sqrt(speed_factor * np.clip(protection / np.max(protection), 0, 1))
ax.plot(thicknesses * 1000, fitness, color='#f59e0b', linewidth=2, linestyle='--', label='Fitness')
best_t = thicknesses[np.argmax(fitness)] * 1000
ax.axvline(best_t, color='#f59e0b', linestyle=':', alpha=0.5)
ax.axvline(5, color='gray', linestyle=':', alpha=0.5, label='Actual (5mm)')
ax.set_xlabel('Shell thickness (mm)', color='white')
ax.set_ylabel('Normalized value', color='white')
ax.set_title('Optimal Shell Thickness', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Predator bite forces vs shell resistance
ax = axes[1, 1]
predators = ['Fox', 'Hyena', 'Jaguar', 'Crocodile', 'Alligator']
bite_forces = [300, 1100, 1500, 3700, 2900]  # Newtons
shell_capacity = bone_strength * 2 * np.pi * R * t  # simplified
colors_pred = ['#22c55e' if f < shell_capacity else '#ef4444' for f in bite_forces]
bars = ax.barh(predators, bite_forces, color=colors_pred, edgecolor='none')
ax.axvline(shell_capacity, color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Shell capacity ({shell_capacity:.0f}N)')
ax.set_xlabel('Bite force (N)', color='white')
ax.set_title('Predator Bite Force vs Shell Strength', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Shell cross-section visualization
ax = axes[1, 2]
theta_full = np.linspace(0, np.pi, 100)
x_outer = R * np.cos(theta_full)
y_outer = R * np.sin(theta_full)
x_inner = (R - t) * np.cos(theta_full)
y_inner = (R - t) * np.sin(theta_full)
ax.fill_between(x_outer, y_outer, color='#f59e0b', alpha=0.3, label='Shell (bone + keratin)')
ax.fill_between(x_inner, y_inner, color='#111827')
ax.plot(x_outer, y_outer, color='#f59e0b', linewidth=2)
ax.plot(x_inner, y_inner, color='#f59e0b', linewidth=1, linestyle='--')
# Show force arrows
ax.annotate('', xy=(0, R + 0.01), xytext=(0, R + 0.04),
            arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2))
ax.text(0, R + 0.045, 'Bite force', ha='center', color='#ef4444', fontsize=9)
# Show stress distribution arrows (radial)
for ang in [30, 60, 90, 120, 150]:
    a = np.radians(ang)
    ax.annotate('', xy=(R*0.85*np.cos(a), R*0.85*np.sin(a)),
                xytext=((R-t)*0.7*np.cos(a), (R-t)*0.7*np.sin(a)),
                arrowprops=dict(arrowstyle='->', color='#22c55e', lw=1))
ax.text(0, -0.02, 'Force distribution', ha='center', color='#22c55e', fontsize=8)
ax.set_xlim(-0.18, 0.18)
ax.set_ylim(-0.03, 0.18)
ax.set_aspect('equal')
ax.set_title('Shell Cross-Section', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')

plt.tight_layout()
plt.show()

print(f"Shell Biomechanics Summary:")
print(f"  Dome stress under {P}N: {P/(2*np.pi*R*t)/1e6:.2f} MPa (safety factor = {sf_dome_apex:.0f}x)")
print(f"  Flat plate stress:      {sigma_flat/1e6:.2f} MPa (safety factor = {sf_flat:.1f}x)")
print(f"  The dome is {sigma_flat/(P/(2*np.pi*R*t)):.0f}x better than a flat plate of the same mass")
print(f"  Shell mass: ~{2*np.pi*R**2*t*2000:.2f} kg ({2*np.pi*R**2*t*2000/5*100:.0f}% of body mass)")
print(f"  Optimal thickness: {best_t:.1f}mm (actual: 5mm)")`,
      challenge: 'Some tortoises have hinged plastrons that can close completely. Model the difference in protection between a fixed shell with a gap (10% of circumference is unprotected) vs a hinged shell with no gap. How much does the hinge improve survival?',
      successHint: 'The tortoise shell is a masterclass in structural engineering — achieving massive safety factors with a dome geometry that distributes loads efficiently. Evolution arrived at the same solution as human architects: domes beat flat plates.',
    },
    {
      title: 'Longevity research — what tortoises teach us about aging',
      concept: `Tortoises are among the longest-lived vertebrates. Giant tortoises regularly exceed 100 years; some Aldabra and Galapagos tortoises have reached 180+ years. Understanding WHY they live so long is one of the hottest topics in aging research.

Key factors in tortoise longevity:

1. **Low metabolic rate**: As ectotherms, tortoises generate fewer **reactive oxygen species (ROS)** — the byproducts of mitochondrial metabolism that damage DNA, proteins, and cell membranes. Less ROS = slower aging.

2. **Telomere maintenance**: Tortoise cells show slower telomere shortening than mammalian cells. Telomeres are the protective caps on chromosome ends; when they get too short, cells stop dividing (senescence) or die.

3. **Negligible senescence**: Some tortoise species show no measurable increase in mortality rate or decrease in reproductive output with age — a phenomenon called **negligible senescence**. Unlike humans (where death rate doubles every 8 years after age 30), tortoises maintain roughly constant mortality across their lifespan.

4. **Cancer resistance**: Despite having trillions of cells and living for centuries, tortoises have remarkably low cancer rates. This may relate to enhanced DNA repair, cellular senescence pathways, or immune surveillance.

The **Gompertz law** describes aging in most species: mortality rate increases exponentially with age (m(t) = A * e^(B*t)). Tortoises may violate this law — their mortality curves are nearly flat, suggesting fundamentally different aging biology.`,
      analogy: 'Most organisms are like cars — they age, rust, and eventually break down because wear accumulates faster than repairs. Tortoises are like a self-repairing spacecraft — damage still occurs, but the repair mechanisms keep pace with degradation for an extraordinarily long time. Understanding HOW they do this could revolutionize human medicine.',
      storyConnection: 'The tortoise was old — older than any other animal in the forest. While generations of hares came and went, the tortoise endured. Its slow metabolism, robust shell, and mysterious resistance to aging made it a living monument to the power of the slow-and-steady strategy.',
      checkQuestion: 'If tortoise mortality is roughly constant at 2% per year (no Gompertz aging), what is the expected lifespan? How does this compare to a Gompertz-aging species with 2% initial mortality that doubles every 10 years?',
      checkAnswer: 'Constant mortality: expected lifespan = 1/0.02 = 50 years (geometric distribution). Some individuals reach 150-200 by chance. Gompertz aging: mortality at age t is 0.02 * 2^(t/10). By age 50, mortality is 0.02 * 2^5 = 64% per year — virtually certain death. By age 70, mortality exceeds 100%. The Gompertz species has a hard upper limit; the constant-mortality species has a long tail of exceptionally old individuals.',
      codeIntro: 'Model aging curves, survival analysis, and the tortoise longevity paradox.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Gompertz mortality model: m(t) = A * exp(B * t)
# A = initial mortality rate, B = rate of aging
def gompertz_mortality(age, A, B):
    return A * np.exp(B * age)

# Survival probability: S(t) = exp(-integral of m(t) from 0 to t)
def gompertz_survival(ages, A, B):
    # Integral of A*exp(B*t) = (A/B)*(exp(B*t) - 1)
    return np.exp(-(A / B) * (np.exp(B * ages) - 1))

def constant_survival(ages, m):
    """Constant mortality (negligible senescence)."""
    return np.exp(-m * ages)

# Species parameters
species = {
    'Mouse':     {'A': 0.01, 'B': 0.5,  'max_age': 5,   'color': '#ef4444'},
    'Hare':      {'A': 0.03, 'B': 0.15, 'max_age': 15,  'color': '#22c55e'},
    'Human':     {'A': 0.0001, 'B': 0.085, 'max_age': 110, 'color': '#3b82f6'},
    'Elephant':  {'A': 0.005, 'B': 0.04, 'max_age': 80,  'color': '#a855f7'},
}
# Tortoise: constant mortality (negligible senescence)
tortoise_mortality_rate = 0.015

ages_full = np.linspace(0, 200, 1000)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Mortality rate vs age
ax = axes[0, 0]
for name, params in species.items():
    ages = np.linspace(0, params['max_age'], 200)
    mortality = gompertz_mortality(ages, params['A'], params['B'])
    ax.semilogy(ages, mortality, color=params['color'], linewidth=2, label=name)
ax.axhline(tortoise_mortality_rate, color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Tortoise (constant {tortoise_mortality_rate})')
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Mortality rate (per year)', color='white')
ax.set_title('Mortality Rate vs Age (Gompertz)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(1e-4, 10)

# Plot 2: Survival curves
ax = axes[0, 1]
for name, params in species.items():
    ages = np.linspace(0, params['max_age'] * 1.2, 200)
    survival = gompertz_survival(ages, params['A'], params['B'])
    ax.plot(ages, survival * 100, color=params['color'], linewidth=2, label=name)
# Tortoise
ages_tort = np.linspace(0, 200, 200)
survival_tort = constant_survival(ages_tort, tortoise_mortality_rate)
ax.plot(ages_tort, survival_tort * 100, color='#f59e0b', linewidth=2, linestyle='--', label='Tortoise')
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Survival (%)', color='white')
ax.set_title('Survival Curves', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Life expectancy comparison
ax = axes[0, 2]
# Simulate cohort of 10000 individuals
n_cohort = 10000
life_expectancies = {}

for name, params in species.items():
    ages_sim = np.arange(0, params['max_age'] * 2, 0.1)
    survival = gompertz_survival(ages_sim, params['A'], params['B'])
    # Life expectancy = integral of survival curve
    le = np.trapz(survival, ages_sim)
    life_expectancies[name] = le

# Tortoise
ages_sim = np.arange(0, 300, 0.1)
survival = constant_survival(ages_sim, tortoise_mortality_rate)
life_expectancies['Tortoise'] = np.trapz(survival, ages_sim)

names = list(life_expectancies.keys())
les = [life_expectancies[n] for n in names]
colors = [species.get(n, {'color': '#f59e0b'})['color'] for n in names]
bars = ax.barh(names, les, color=colors, edgecolor='none')
for bar, le in zip(bars, les):
    ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            f'{le:.0f} yr', va='center', color='white', fontsize=9)
ax.set_xlabel('Life expectancy (years)', color='white')
ax.set_title('Expected Lifespan', color='white', fontsize=11)

# Plot 4: Telomere length over age
ax = axes[1, 0]
# Telomere shortening model: length = L0 - rate * age + noise
ages_hare = np.linspace(0, 12, 100)
ages_tortoise = np.linspace(0, 150, 100)
hare_telomere = 15 - 0.8 * ages_hare + np.random.randn(100) * 0.5  # kb
tortoise_telomere = 20 - 0.05 * ages_tortoise + np.random.randn(100) * 0.3  # kb
senescence_threshold = 5  # kb — below this, cells stop dividing

ax.plot(ages_hare, hare_telomere, color='#22c55e', linewidth=2, label='Hare')
ax.plot(ages_tortoise, tortoise_telomere, color='#f59e0b', linewidth=2, label='Tortoise')
ax.axhline(senescence_threshold, color='#ef4444', linestyle='--', label='Senescence threshold')
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Telomere length (kb)', color='white')
ax.set_title('Telomere Shortening', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: ROS production vs metabolic rate
ax = axes[1, 1]
met_rates = np.linspace(1, 500, 100)  # relative
ros_production = 0.5 * met_rates**0.8  # ROS scales sublinearly with metabolism
repair_capacity = np.full_like(met_rates, 50)  # assume constant repair
damage_rate = ros_production - repair_capacity
damage_rate = np.maximum(damage_rate, 0)

ax.plot(met_rates, ros_production, color='#ef4444', linewidth=2, label='ROS production')
ax.plot(met_rates, repair_capacity, color='#22c55e', linewidth=2, label='Repair capacity')
ax.fill_between(met_rates, ros_production, repair_capacity,
                where=ros_production > repair_capacity, alpha=0.2, color='#ef4444',
                label='Net damage (aging)')
# Mark tortoise and hare
tort_met = 30; hare_met = 200
ax.axvline(tort_met, color='#f59e0b', linestyle=':', label=f'Tortoise (met={tort_met})')
ax.axvline(hare_met, color='#22c55e', linestyle=':', label=f'Hare (met={hare_met})')
ax.set_xlabel('Metabolic rate (relative)', color='white')
ax.set_ylabel('ROS / Repair rate', color='white')
ax.set_title('Oxidative Damage Model', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Population simulation — fast vs slow
ax = axes[1, 2]
years = 200
# Hare population: high reproduction, high mortality
hare_pop = [100]
# Tortoise population: low reproduction, low mortality
tort_pop = [100]

for y in range(1, years):
    # Hare: 50% reproduce, 4 offspring each, 30% annual mortality
    new_hares = hare_pop[-1] * 0.5 * 4 * 0.1  # 10% offspring survive
    deaths = hare_pop[-1] * 0.3
    hare_pop.append(max(0, hare_pop[-1] + new_hares - deaths + np.random.randn() * 5))

    # Tortoise: 20% reproduce, 3 offspring each, 2% annual mortality
    new_torts = tort_pop[-1] * 0.2 * 3 * 0.2  # 20% offspring survive
    deaths = tort_pop[-1] * 0.015
    tort_pop.append(max(0, tort_pop[-1] + new_torts - deaths + np.random.randn() * 3))

ax.plot(range(years), hare_pop[:years], color='#22c55e', linewidth=2, label='Hare population')
ax.plot(range(years), tort_pop[:years], color='#f59e0b', linewidth=2, label='Tortoise population')
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Population Growth: Fast vs Slow Life History', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Longevity Research Insights:")
print(f"  Tortoise life expectancy: {life_expectancies['Tortoise']:.0f} years (constant mortality)")
print(f"  Hare life expectancy:     {life_expectancies['Hare']:.0f} years (Gompertz aging)")
print(f"  Human life expectancy:    {life_expectancies['Human']:.0f} years (Gompertz aging)")
print()
print("Key tortoise longevity mechanisms:")
print("  1. Low ROS from low metabolic rate")
print("  2. Slow telomere shortening")
print("  3. Enhanced DNA repair")
print("  4. Negligible senescence (no aging acceleration)")
print("  Understanding these could revolutionize human longevity research.")`,
      challenge: 'Add a "caloric restriction" scenario for the hare: reduce metabolic rate by 30% (which reduces ROS production and slows Gompertz aging parameter B). How much does this extend the hare\'s lifespan? Caloric restriction is one of the most robust life-extension interventions in mammals.',
      successHint: 'The tortoise is a living demonstration that aging is not inevitable — it is a tunable parameter that evolution adjusts based on life history strategy. Understanding tortoise longevity is not just academic curiosity — it could lead to breakthroughs in human aging research.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Metabolic Science & Life History
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (biology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for metabolic and biomechanical modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
