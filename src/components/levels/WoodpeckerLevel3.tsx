import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function WoodpeckerLevel3() {
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
      title: 'Impact mechanics — what happens when a beak hits wood',
      concept: `When a woodpecker strikes a tree, its beak decelerates from roughly 7 m/s to 0 in under half a millisecond. That produces peak decelerations exceeding 1200 g — forces that would cause severe brain injury in a human. Understanding this requires the physics of **impact mechanics**.

An impact is a rapid transfer of momentum. Newton's second law in impulse form says F * dt = m * dv. The shorter the impact duration (dt), the higher the peak force (F). A woodpecker's beak contacts wood for about 0.5 ms, while a human head hitting a dashboard in a car crash might decelerate over 10-20 ms. Both involve similar velocities, but the woodpecker experiences far higher g-forces because the contact time is shorter.

The key quantity is **impact energy**: E = 0.5 * m * v^2. For a 50-gram woodpecker head moving at 7 m/s, that is about 1.2 joules per strike. The woodpecker does this 20 times per second, 12,000 times per day. The cumulative energy is enormous. Yet the bird suffers no concussions. The secret lies not in avoiding the force, but in how the force is distributed and absorbed through specialized biological structures.`,
      analogy: 'Think of catching a cricket ball. If you hold your hands rigid, the ball stops instantly and the impact stings badly — the force is huge because the time is tiny. But if you pull your hands back as you catch, extending the deceleration over a longer time, the same momentum change produces a much smaller peak force. The woodpecker skull does something similar, but with structural engineering instead of arm movement.',
      storyConnection: 'The woodpecker in the story drums on the oldest sal tree in the forest without ever showing signs of injury. The villagers wondered if it had a magical skull. The real magic is biomechanical engineering — millions of years of evolution produced a head that manages impact forces better than any helmet humans have designed.',
      checkQuestion: 'If a woodpecker and a human head experience the same velocity change on impact, but the woodpecker decelerates in 0.5 ms and the human in 15 ms, how many times greater is the peak force on the woodpecker (assuming equal mass)?',
      checkAnswer: 'The force ratio equals the inverse ratio of deceleration times: 15 ms / 0.5 ms = 30 times greater peak force on the woodpecker. Since F = m * dv / dt, a shorter dt means proportionally larger F. This is precisely why the woodpecker needs such extraordinary protection mechanisms — it routinely experiences forces 30x what would injure a human brain.',
      codeIntro: 'Model the impact mechanics of a woodpecker strike and compare force profiles for different deceleration times.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Impact parameters
mass = 0.050  # 50 grams head mass (kg)
v_impact = 7.0  # m/s at impact
dt_woodpecker = 0.5e-3  # 0.5 ms
dt_human_crash = 15e-3  # 15 ms typical car crash
dt_helmet = 50e-3  # 50 ms with good helmet

g = 9.81  # m/s^2

# Calculate peak forces and g-forces
scenarios = [
    ("Woodpecker strike", dt_woodpecker, '#ef4444'),
    ("Human head (no helmet)", dt_human_crash, '#f59e0b'),
    ("Human head (with helmet)", dt_helmet, '#22c55e'),
]

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Force-time profiles (half-sine pulse model)
ax = axes[0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for name, dt, color in scenarios:
    # Model impact as half-sine pulse
    t = np.linspace(0, dt, 500)
    # Peak force from impulse: integral of F*dt = m*v
    # For half-sine: F_peak * (2*dt/pi) = m*v => F_peak = pi*m*v/(2*dt)
    F_peak = np.pi * mass * v_impact / (2 * dt)
    F = F_peak * np.sin(np.pi * t / dt)
    g_peak = F_peak / (mass * g)
    ax.plot(t * 1000, F, color=color, linewidth=2,
            label=f'{name}\\n  peak={F_peak:.0f}N ({g_peak:.0f}g)')

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Force (N)', color='white')
ax.set_title('Impact force profiles', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper right')
ax.set_xlim(0, 60)

# Plot 2: G-force vs deceleration time
ax = axes[1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

dt_range = np.linspace(0.1e-3, 100e-3, 500)
g_forces = (v_impact / dt_range) / g
ax.semilogy(dt_range * 1000, g_forces, color='#8b5cf6', linewidth=2)
ax.axhline(1200, color='#ef4444', linestyle='--', alpha=0.7, label='Woodpecker (~1200g)')
ax.axhline(100, color='#f59e0b', linestyle='--', alpha=0.7, label='Concussion threshold (~100g)')
ax.axhline(50, color='#22c55e', linestyle='--', alpha=0.7, label='Helmet standard (~50g)')
ax.set_xlabel('Deceleration time (ms)', color='white')
ax.set_ylabel('Peak g-force', color='white')
ax.set_title('G-force vs impact duration', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Cumulative energy over a day
ax = axes[2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

E_per_strike = 0.5 * mass * v_impact**2  # Joules
strikes_per_sec = 20
hours = np.linspace(0, 8, 500)  # 8-hour day
total_strikes = strikes_per_sec * hours * 3600
total_energy = total_strikes * E_per_strike

ax.plot(hours, total_energy / 1000, color='#06b6d4', linewidth=2)
ax.fill_between(hours, 0, total_energy / 1000, alpha=0.2, color='#06b6d4')
ax.set_xlabel('Hours of drumming', color='white')
ax.set_ylabel('Cumulative energy (kJ)', color='white')
ax.set_title('Energy absorbed per day', color='white', fontsize=11)
ax.text(4, total_energy[250] / 1000 * 0.7,
        f'{E_per_strike:.2f} J/strike\\n{int(strikes_per_sec * 3600 * 8):,} strikes/day\\n{total_energy[-1]/1000:.1f} kJ total',
        color='white', fontsize=8, ha='center',
        bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#06b6d4', alpha=0.8))

plt.tight_layout()
plt.show()

print("Impact Mechanics Summary:")
print(f"{'Scenario':<30} {'dt (ms)':>10} {'Peak F (N)':>12} {'Peak g':>10}")
print("-" * 65)
for name, dt, _ in scenarios:
    F_peak = np.pi * mass * v_impact / (2 * dt)
    g_peak = F_peak / (mass * g)
    print(f"{name:<30} {dt*1000:>10.1f} {F_peak:>12.0f} {g_peak:>10.0f}")
print()
print(f"Energy per strike: {E_per_strike:.3f} J")
print(f"Strikes per day (8 hrs): {int(strikes_per_sec * 3600 * 8):,}")
print(f"Total daily energy: {total_energy[-1]:.0f} J = {total_energy[-1]/1000:.1f} kJ")
print()
print("The woodpecker experiences 1200g but suffers no brain damage.")
print("Understanding HOW requires stress, strain, and shock absorption — next lessons.")`,
      challenge: 'Modify the impact model to use a triangular pulse instead of a half-sine. How does the peak force change for the same impulse (momentum change)? Which pulse shape is more realistic for a beak hitting wood?',
      successHint: 'Impact mechanics is the foundation of protective equipment design — helmets, car bumpers, phone cases. The woodpecker solved this problem millions of years before engineers did. Next we explore the material properties that make absorption possible.',
    },
    {
      title: 'Stress and strain — how materials respond to force',
      concept: `Force alone does not determine whether something breaks. A 100 N force on a toothpick snaps it. The same 100 N on a steel beam does nothing. The difference is **stress** — force per unit area.

**Stress (sigma)** = Force / Area, measured in Pascals (Pa). A toothpick has a cross-section of maybe 4 mm^2, so 100 N creates 25 MPa of stress. A steel beam with a 10,000 mm^2 cross-section experiences only 0.01 MPa from the same force. The material "feels" stress, not force.

**Strain (epsilon)** is the resulting deformation: change in length divided by original length. It is dimensionless. A rubber band stretched from 10 cm to 12 cm has a strain of 0.2 (20%). A steel rod under the same stress might strain only 0.001 (0.1%).

The relationship between stress and strain defines material behavior. In the **elastic region**, stress = E * strain, where E is **Young's modulus** — the stiffness of the material. Steel has E ~ 200 GPa (very stiff). Bone has E ~ 10-20 GPa. The woodpecker's hyoid bone has a graded modulus that varies along its length, creating a natural shock-absorbing gradient.`,
      analogy: 'Imagine standing on a wooden floor versus standing on a trampoline. Your weight (force) is the same, but the trampoline stretches a lot (high strain) while the floor barely deforms (low strain). The trampoline has a low Young\'s modulus — it is compliant. The floor has a high modulus — it is stiff. The woodpecker skull cleverly combines stiff and compliant materials, like a floor with trampolines built into it.',
      storyConnection: 'The woodpecker\'s beak never chips despite thousands of daily impacts. The story describes it as "harder than iron." In reality, the beak is made of keratin — the same protein as your fingernails. It survives not because it is the hardest material, but because stress is distributed across the entire skull structure. The beak, bone, and muscle work as an integrated stress-management system.',
      checkQuestion: 'Two bones have the same cross-sectional area. Bone A has Young\'s modulus of 20 GPa and Bone B has 5 GPa. Under the same applied force, which bone deforms more, and by what factor?',
      checkAnswer: 'Bone B deforms 4 times more than Bone A. Since stress is the same (same force, same area), and strain = stress / E, the bone with the lower modulus (B, at 5 GPa) has 4x the strain of the stiffer bone (A, at 20 GPa). This is why the woodpecker has different modulus values at different locations — stiff where rigidity matters, compliant where absorption matters.',
      codeIntro: 'Plot stress-strain curves for different biological materials found in a woodpecker skull and calculate deformation under impact loading.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material properties (biological tissues in woodpecker skull)
materials = {
    'Beak keratin': {'E': 6e9, 'yield_stress': 120e6, 'color': '#ef4444'},
    'Cranial bone': {'E': 15e9, 'yield_stress': 150e6, 'color': '#f59e0b'},
    'Hyoid bone': {'E': 8e9, 'yield_stress': 80e6, 'color': '#22c55e'},
    'Spongy bone': {'E': 1e9, 'yield_stress': 20e6, 'color': '#3b82f6'},
    'Brain tissue': {'E': 3e3, 'yield_stress': 10e3, 'color': '#a855f7'},
    'Muscle/tendon': {'E': 0.5e9, 'yield_stress': 30e6, 'color': '#06b6d4'},
}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Stress-strain curves (elastic region)
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for name, props in materials.items():
    if name == 'Brain tissue':
        continue  # Too soft to show on same scale
    E = props['E']
    yield_s = props['yield_stress']
    max_strain = yield_s / E * 1.5
    strain = np.linspace(0, max_strain, 200)
    # Elastic region
    elastic_mask = strain <= yield_s / E
    stress_elastic = E * strain[elastic_mask]
    ax.plot(strain[elastic_mask] * 100, stress_elastic / 1e6,
            color=props['color'], linewidth=2, label=f"{name} (E={E/1e9:.1f} GPa)")

ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Stress-strain: woodpecker skull materials', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Young's modulus comparison (log scale)
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

names = list(materials.keys())
E_values = [materials[n]['E'] for n in names]
colors = [materials[n]['color'] for n in names]
bars = ax.barh(range(len(names)), E_values, color=colors, alpha=0.8)
ax.set_xscale('log')
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, color='white', fontsize=8)
ax.set_xlabel("Young's modulus (Pa)", color='white')
ax.set_title('Stiffness spans 7 orders of magnitude', color='white', fontsize=11)

for i, (bar, val) in enumerate(zip(bars, E_values)):
    ax.text(val * 1.5, i, f'{val:.0e} Pa', va='center', color='white', fontsize=7)

# Plot 3: Deformation under impact
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

F_impact = 50  # N (approximate per-strike force spread over area)
area = 1e-4  # 1 cm^2 cross-section
stress_applied = F_impact / area  # Pa
L0 = 0.01  # 1 cm thickness

deformations_um = []
for name in names:
    E = materials[name]['E']
    strain_val = stress_applied / E
    deform = strain_val * L0 * 1e6  # micrometers
    deformations_um.append(deform)

bars = ax.barh(range(len(names)), deformations_um, color=colors, alpha=0.8)
ax.set_xscale('log')
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, color='white', fontsize=8)
ax.set_xlabel('Deformation (micrometers)', color='white')
ax.set_title(f'Deformation at {stress_applied/1e6:.1f} MPa stress', color='white', fontsize=11)

for i, (bar, val) in enumerate(zip(bars, deformations_um)):
    ax.text(val * 1.5, i, f'{val:.1f} um', va='center', color='white', fontsize=7)

# Plot 4: Layered skull model — stress distribution
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

layers = ['Beak keratin', 'Spongy bone', 'Cranial bone', 'Spongy bone', 'Brain tissue']
layer_E = [materials[l]['E'] for l in layers]
layer_thickness = [0.003, 0.002, 0.004, 0.002, 0.015]  # meters
layer_colors = [materials[l]['color'] for l in layers]

positions = np.cumsum([0] + layer_thickness[:-1])
for i, (pos, thick, color, name) in enumerate(zip(positions, layer_thickness, layer_colors, layers)):
    ax.barh(0, thick * 1000, left=pos * 1000, height=0.5, color=color, alpha=0.8, edgecolor='white', linewidth=0.5)
    ax.text(pos * 1000 + thick * 500, 0, f'{name}\\n{thick*1000:.0f}mm',
            ha='center', va='center', color='white', fontsize=6, fontweight='bold')

ax.set_xlim(-1, sum(layer_thickness) * 1000 + 1)
ax.set_ylim(-0.5, 0.5)
ax.set_xlabel('Depth from beak tip (mm)', color='white')
ax.set_title('Layered skull cross-section', color='white', fontsize=11)
ax.set_yticks([])

# Add arrow showing force direction
ax.annotate('Impact\\nforce', xy=(-0.5, 0), fontsize=8, color='#ef4444',
            ha='center', va='center', fontweight='bold')

plt.tight_layout()
plt.show()

print("Stress-Strain Analysis of Woodpecker Skull:")
print(f"Applied stress: {stress_applied/1e6:.1f} MPa (from {F_impact}N over {area*1e4:.0f} cm^2)")
print()
print(f"{'Material':<20} {'E (GPa)':>10} {'Strain':>12} {'Deform (um)':>14}")
print("-" * 60)
for name, deform in zip(names, deformations_um):
    E = materials[name]['E']
    strain_val = stress_applied / E
    print(f"{name:<20} {E/1e9:>10.3f} {strain_val:>12.6f} {deform:>14.1f}")
print()
print("Brain tissue deforms 5 MILLION times more than cranial bone!")
print("The layered structure acts as a series of mechanical filters,")
print("each absorbing energy before it reaches the brain.")`,
      challenge: 'Add a "steel" material (E = 200 GPa, yield = 250 MPa) and a "rubber" material (E = 0.01 GPa, yield = 10 MPa) to the comparison. Where would an ideal helmet material sit on this spectrum?',
      successHint: 'Stress and strain are the language of materials engineering. Every protective device — from bike helmets to spacecraft shields — is designed by optimizing how stress distributes through layered materials. The woodpecker skull is a masterclass in this design.',
    },
    {
      title: 'Shock absorption — dissipating energy before it reaches the brain',
      concept: `The woodpecker skull does not simply resist impact forces — it **absorbs** them. The distinction is critical. A rigid structure transmits force directly. An absorbing structure converts kinetic energy into heat, sound, or permanent deformation, so less energy reaches the protected interior.

There are three main shock absorption mechanisms at work in the woodpecker:

1. **Spongy bone (trabecular bone)**: The skull contains pockets of porous bone that crush on impact, converting kinetic energy into permanent deformation energy. After each strike, the bone partially reforms. This is exactly how crumple zones in cars work.

2. **Hyoid bone**: A long, flexible bone that wraps around the entire skull like a seatbelt. It redistributes impact forces from the point of contact to a larger area, reducing peak stress. The hyoid acts as a force-spreading network.

3. **Cerebrospinal fluid (CSF)**: The brain floats in a thin layer of fluid. This fluid provides **viscous damping** — it resists rapid motion more than slow motion, preferentially attenuating the high-frequency shock components that cause the most damage. The damping force is proportional to velocity: F_damp = c * v, where c is the damping coefficient.

Together, these systems form a **multi-stage energy absorber** — each layer removes a fraction of the impact energy before it reaches the next layer.`,
      analogy: 'Think of a package shipped through the mail. The outer cardboard box takes the first hit (like the beak). Inside, foam peanuts crush and absorb energy (like spongy bone). The item is wrapped in bubble wrap that distributes remaining forces evenly (like the hyoid). Finally, the item sits in a molded cradle that holds it snugly (like CSF). No single layer is sufficient — the protection comes from the cascade.',
      storyConnection: 'The story describes the woodpecker drumming for hours without pause. The villagers tried wrapping cloth around a stick to drum the same tree — the stick shattered within minutes. The woodpecker has what the stick lacks: a multi-stage absorption system. Each component alone would fail; together, they make 12,000 daily impacts survivable.',
      checkQuestion: 'A shock absorber with damping coefficient c = 500 Ns/m encounters an impact velocity of 7 m/s. What is the initial damping force? If the impact duration is 0.5 ms, roughly how much energy does viscous damping remove?',
      checkAnswer: 'Initial damping force = c * v = 500 * 7 = 3500 N. Energy removed by damping over the impact is approximately integral of F * v * dt. Using a simple estimate: E_damp ~ c * v^2 * dt / 2 = 500 * 49 * 0.0005 / 2 = 6.1 J. The actual impact energy is 0.5 * 0.05 * 49 = 1.225 J, so the damping coefficient would need to be much smaller in reality. This shows why modeling requires careful parameter fitting — which is exactly what engineers do.',
      codeIntro: 'Simulate a multi-layer shock absorber inspired by the woodpecker skull, showing how each layer attenuates the impact.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate multi-layer shock absorption
# Model each layer as a spring-damper system (Kelvin-Voigt model)
# m * a = -k * x - c * v + F_input

dt = 1e-6  # 1 microsecond timestep
t_total = 5e-3  # 5 ms simulation
t = np.arange(0, t_total, dt)
n_steps = len(t)

# Impact pulse (half-sine, 0.5 ms duration)
pulse_duration = 0.5e-3
F_peak = 1000  # N
F_input = np.zeros(n_steps)
pulse_mask = t < pulse_duration
F_input[pulse_mask] = F_peak * np.sin(np.pi * t[pulse_mask] / pulse_duration)

# Define layers (from outside to inside)
layers = [
    {'name': 'Beak (stiff)', 'k': 5e6, 'c': 200, 'm': 0.005, 'color': '#ef4444'},
    {'name': 'Spongy bone (crushable)', 'k': 5e5, 'c': 800, 'm': 0.003, 'color': '#f59e0b'},
    {'name': 'Hyoid (flexible)', 'k': 2e5, 'c': 500, 'm': 0.008, 'color': '#22c55e'},
    {'name': 'CSF (viscous)', 'k': 1e4, 'c': 1500, 'm': 0.002, 'color': '#3b82f6'},
    {'name': 'Brain', 'k': 1e3, 'c': 300, 'm': 0.030, 'color': '#a855f7'},
]

n_layers = len(layers)

# State: position and velocity for each layer
x = np.zeros((n_layers, n_steps))
v = np.zeros((n_layers, n_steps))
F_transmitted = np.zeros((n_layers, n_steps))

for i in range(1, n_steps):
    for j in range(n_layers):
        layer = layers[j]
        k, c, m = layer['k'], layer['c'], layer['m']

        if j == 0:
            # First layer: driven by external impact
            F_ext = F_input[i]
        else:
            # Driven by force transmitted from previous layer
            dx = x[j-1, i-1] - x[j, i-1]
            dv = v[j-1, i-1] - v[j, i-1]
            F_ext = layers[j-1]['k'] * dx + layers[j-1]['c'] * dv

        F_transmitted[j, i] = F_ext

        # Spring-damper restoring force (grounded)
        F_restore = -k * x[j, i-1] - c * v[j, i-1]

        a = (F_ext + F_restore) / m
        v[j, i] = v[j, i-1] + a * dt
        x[j, i] = x[j, i-1] + v[j, i] * dt

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Force transmitted through each layer
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(t * 1000, F_input, color='white', linewidth=2, linestyle='--', label='Input pulse', alpha=0.5)
for j, layer in enumerate(layers):
    ax.plot(t * 1000, F_transmitted[j], color=layer['color'], linewidth=1.5, label=layer['name'])

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Force (N)', color='white')
ax.set_title('Force attenuation through layers', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Peak force reduction
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

peak_forces = [np.max(np.abs(F_transmitted[j])) for j in range(n_layers)]
peak_forces_pct = [pf / F_peak * 100 for pf in peak_forces]
layer_names = [l['name'] for l in layers]
layer_colors = [l['color'] for l in layers]

bars = ax.bar(range(n_layers), peak_forces_pct, color=layer_colors, alpha=0.8)
ax.set_xticks(range(n_layers))
ax.set_xticklabels([l['name'].split('(')[0].strip() for l in layers], color='white', fontsize=8, rotation=15)
ax.set_ylabel('Peak force (% of input)', color='white')
ax.set_title('Peak force at each layer', color='white', fontsize=11)

for bar, pct in zip(bars, peak_forces_pct):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{pct:.1f}%', ha='center', va='bottom', color='white', fontsize=8)

# Plot 3: Displacement of each layer
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for j, layer in enumerate(layers):
    ax.plot(t * 1000, x[j] * 1e6, color=layer['color'], linewidth=1.5, label=layer['name'])

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Displacement (micrometers)', color='white')
ax.set_title('Layer displacements during impact', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Energy budget
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Calculate energy absorbed by each layer's damper
energy_damped = []
for j in range(n_layers):
    c = layers[j]['c']
    power = c * v[j] ** 2
    E = np.trapz(power, t)
    energy_damped.append(E)

E_input = np.trapz(F_input * v[0], t)
energy_total_damped = sum(energy_damped)

bars = ax.bar(range(n_layers), [e * 1000 for e in energy_damped], color=layer_colors, alpha=0.8)
ax.set_xticks(range(n_layers))
ax.set_xticklabels([l['name'].split('(')[0].strip() for l in layers], color='white', fontsize=8, rotation=15)
ax.set_ylabel('Energy absorbed (mJ)', color='white')
ax.set_title('Energy dissipated per layer', color='white', fontsize=11)

for bar, e in zip(bars, energy_damped):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
            f'{e*1000:.2f} mJ', ha='center', va='bottom', color='white', fontsize=7)

plt.tight_layout()
plt.show()

print("Multi-Layer Shock Absorption Summary:")
print(f"Input peak force: {F_peak:.0f} N")
print(f"Force reaching brain: {peak_forces[-1]:.1f} N ({peak_forces_pct[-1]:.1f}% of input)")
print(f"Total attenuation: {100 - peak_forces_pct[-1]:.1f}%")
print()
print(f"{'Layer':<25} {'Peak F (N)':>12} {'% of input':>12} {'E absorbed (mJ)':>16}")
print("-" * 68)
for j in range(n_layers):
    print(f"{layers[j]['name']:<25} {peak_forces[j]:>12.1f} {peak_forces_pct[j]:>12.1f} {energy_damped[j]*1000:>16.3f}")
print()
print("Key insight: the spongy bone and CSF layers do the most absorption.")
print("This matches real woodpecker CT scans — these are the thickest layers.")`,
      challenge: 'Remove the spongy bone layer from the simulation (set its damping to near zero). How much more force reaches the brain? This models what happens with a concussion — when the absorption system fails.',
      successHint: 'Multi-stage energy absorption is the core principle behind all protective equipment. Motorcycle helmets use the same layered approach: hard shell, EPS foam, comfort liner, and a gap for the skull. The woodpecker invented this design millions of years ago.',
    },
    {
      title: 'Skull biomechanics — the geometry of protection',
      concept: `The woodpecker's skull is not just made of special materials — it has a special **shape**. The geometry of the skull plays a critical role in distributing impact forces away from the brain.

Three geometric features stand out:

1. **Beak-skull alignment**: The upper beak is slightly longer than the lower beak, and the beak is perfectly aligned with the center of mass of the skull. This means the impact force vector passes through the skull's center of mass, minimizing rotational acceleration. In human head injuries, **rotational acceleration** causes more damage than linear acceleration because the brain is more vulnerable to shear forces.

2. **Skull thickness asymmetry**: The skull is thicker at the front (where impacts occur) and thinner at the back. This is not uniform armor — it is optimized armor. Material is concentrated where it is needed most. The frontal bone is 2-3x thicker than the occipital bone.

3. **Smooth brain surface**: Unlike the human brain, which has deep folds (sulci and gyri), the woodpecker brain fits tightly in the skull with minimal CSF gap. This tight fit prevents the brain from sloshing forward on impact — the "coup-contrecoup" injury mechanism that causes many human concussions.

These geometric optimizations can be quantified using **moment of inertia** calculations and **stress concentration factor** analysis.`,
      analogy: 'Consider an egg. Drop it on its side and it cracks easily — the flat surface creates stress concentrations. But if you squeeze an egg between your palms (along its long axis), it is surprisingly strong because the curved shape distributes force evenly. The woodpecker skull is shaped so that impact forces travel along the strongest axis, like squeezing the egg end-to-end.',
      storyConnection: 'The story mentions that the woodpecker always strikes the tree with its beak perfectly straight — never at an angle. The villagers thought this was just habit. In fact, the straight strike is biomechanically essential. An angled strike would create rotational forces that the skull is not designed to handle. The woodpecker\'s drumming posture is as engineered as its skull.',
      checkQuestion: 'Why would a glancing (angled) blow to the head be more dangerous than a direct frontal impact of the same force magnitude?',
      checkAnswer: 'A glancing blow creates rotational (angular) acceleration, which subjects brain tissue to shear strain. Brain tissue is much weaker in shear than in compression. The brain can tolerate ~100g of linear acceleration but only ~5,000 rad/s^2 of angular acceleration before injury. The woodpecker avoids this by ensuring perfectly linear impacts — the beak acts as a guide rail that eliminates rotation.',
      codeIntro: 'Model skull geometry effects on stress distribution, comparing the woodpecker\'s optimized shape to a spherical skull.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Model 2D skull cross-sections and stress distribution
theta = np.linspace(0, 2 * np.pi, 360)

# Skull shape 1: Spherical (like human skull, simplified)
r_sphere = 0.03  # 3 cm radius
x_sphere = r_sphere * np.cos(theta)
y_sphere = r_sphere * np.sin(theta)

# Skull shape 2: Woodpecker (elongated, thicker at front)
# Parametric egg shape: r = a * (1 + b*cos(theta))
a_wp = 0.025
b_wp = 0.3  # asymmetry parameter
r_wp = a_wp * (1 + b_wp * np.cos(theta))
x_wp = r_wp * np.cos(theta)
y_wp = r_wp * np.sin(theta)

# Thickness profile: woodpecker has variable thickness
thickness_sphere = np.ones_like(theta) * 2.0  # uniform 2 mm
thickness_wp = 2.0 + 2.0 * np.cos(theta / 2) ** 4  # thicker at front (theta=0)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Skull shapes comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.plot(x_sphere * 1000, y_sphere * 1000, color='#3b82f6', linewidth=2, label='Spherical (human-like)')
ax.plot(x_wp * 1000, y_wp * 1000, color='#22c55e', linewidth=2, label='Elongated (woodpecker)')
ax.set_xlabel('x (mm)', color='white')
ax.set_ylabel('y (mm)', color='white')
ax.set_title('Skull cross-section shapes', color='white', fontsize=11)
ax.set_aspect('equal')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate('Impact', xy=(35, 0), fontsize=9, color='#ef4444', ha='center',
            arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2),
            xytext=(45, 0))

# Plot 2: Thickness profiles
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
angle_deg = np.degrees(theta)
ax.plot(angle_deg, thickness_sphere, color='#3b82f6', linewidth=2, label='Spherical (uniform)')
ax.plot(angle_deg, thickness_wp, color='#22c55e', linewidth=2, label='Woodpecker (graded)')
ax.set_xlabel('Angle from impact point (degrees)', color='white')
ax.set_ylabel('Skull thickness (mm)', color='white')
ax.set_title('Thickness distribution', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.axvline(0, color='#ef4444', linestyle='--', alpha=0.5, label='Impact point')
ax.axvline(180, color='gray', linestyle='--', alpha=0.3)

# Plot 3: Stress distribution on skull surface
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Simplified stress model: stress ~ F/(thickness * local_radius_of_curvature)
F_impact = 50  # N

# Curvature for sphere
curvature_sphere = 1.0 / r_sphere * np.ones_like(theta)

# Curvature for woodpecker (approximate from parametric)
dx = np.gradient(x_wp, theta)
dy = np.gradient(y_wp, theta)
ddx = np.gradient(dx, theta)
ddy = np.gradient(dy, theta)
curvature_wp = np.abs(dx * ddy - dy * ddx) / (dx**2 + dy**2)**1.5

# Stress proportional to curvature / thickness (simplified)
# Add cosine weighting for distance from impact point
weight = np.maximum(np.cos(theta), 0)  # only front hemisphere loaded

stress_sphere = F_impact * curvature_sphere * weight / (thickness_sphere * 1e-3)
stress_wp = F_impact * curvature_wp * weight / (thickness_wp * 1e-3)

# Normalize
stress_sphere /= np.max(stress_sphere) if np.max(stress_sphere) > 0 else 1
stress_wp /= np.max(stress_wp) if np.max(stress_wp) > 0 else 1

ax.plot(angle_deg, stress_sphere, color='#3b82f6', linewidth=2, label='Spherical')
ax.plot(angle_deg, stress_wp, color='#22c55e', linewidth=2, label='Woodpecker')
ax.set_xlabel('Angle from impact (degrees)', color='white')
ax.set_ylabel('Normalized stress', color='white')
ax.set_title('Stress distribution on skull', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Rotational vs linear acceleration comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

angles_of_impact = np.linspace(0, 45, 100)  # degrees off-center
linear_g = 1200 * np.cos(np.radians(angles_of_impact))
rotational = 1200 * np.sin(np.radians(angles_of_impact))

ax.plot(angles_of_impact, linear_g, color='#22c55e', linewidth=2, label='Linear acceleration (g)')
ax.plot(angles_of_impact, rotational, color='#ef4444', linewidth=2, label='Rotational component (g-equiv)')
ax.axhline(100, color='#f59e0b', linestyle='--', alpha=0.7, label='Concussion threshold (linear)')
ax.fill_between(angles_of_impact, 0, rotational, alpha=0.1, color='#ef4444')
ax.set_xlabel('Impact angle off-center (degrees)', color='white')
ax.set_ylabel('Acceleration (g)', color='white')
ax.set_title('Why straight strikes matter', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Moment of inertia comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Brain fit comparison: loose (human-like) vs tight (woodpecker)
brain_radii = np.linspace(0, 0.025, 100)
csf_gap_human = 0.003  # 3mm gap
csf_gap_woodpecker = 0.001  # 1mm gap

# Brain displacement for given impact (simplified spring model)
k_csf = 1e4  # N/m spring constant of CSF
displacement_human = F_impact / k_csf * (csf_gap_human / 0.003)
displacement_wp = F_impact / k_csf * (csf_gap_woodpecker / 0.003)

categories = ['Human-like\\n(3mm CSF gap)', 'Woodpecker\\n(1mm CSF gap)']
displacements = [displacement_human * 1e3, displacement_wp * 1e3]
colors_bar = ['#3b82f6', '#22c55e']

bars = ax.bar(categories, displacements, color=colors_bar, alpha=0.8, width=0.5)
ax.set_ylabel('Brain displacement (mm)', color='white')
ax.set_title('Brain slosh during impact', color='white', fontsize=11)

for bar, d in zip(bars, displacements):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
            f'{d:.2f} mm', ha='center', va='bottom', color='white', fontsize=9)

# Plot 6: Combined protection score
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

features = ['Beak\\nalignment', 'Skull\\nthickness', 'Brain\\nfit', 'Hyoid\\nwrap', 'Spongy\\nbone']
human_scores = [0.3, 0.5, 0.4, 0.0, 0.3]
wp_scores = [0.95, 0.9, 0.9, 1.0, 0.85]

x_pos = np.arange(len(features))
width = 0.35
ax.bar(x_pos - width/2, human_scores, width, color='#3b82f6', alpha=0.8, label='Human')
ax.bar(x_pos + width/2, wp_scores, width, color='#22c55e', alpha=0.8, label='Woodpecker')
ax.set_xticks(x_pos)
ax.set_xticklabels(features, color='white', fontsize=7)
ax.set_ylabel('Protection score', color='white')
ax.set_title('Geometric protection features', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 1.15)

plt.tight_layout()
plt.show()

print("Skull Biomechanics Summary:")
print()
print("Geometric optimizations in the woodpecker skull:")
print("1. Elongated shape reduces stress concentration at impact point")
print("2. Graded thickness: 4mm at front vs 2mm at back")
print("3. Tight brain fit: 1mm CSF gap vs ~3mm in humans")
print("4. Perfect beak alignment eliminates rotational acceleration")
print("5. Hyoid bone wraps entire skull for force redistribution")
print()
print(f"Peak stress ratio (woodpecker/spherical): {np.max(stress_wp)/np.max(stress_sphere):.2f}")
print(f"A 15-degree off-center strike creates {np.sin(np.radians(15))*1200:.0f}g rotational component")
print("This is why woodpeckers NEVER strike at an angle.")`,
      challenge: 'Modify the skull shape to be more extreme — use b_wp = 0.6 for a very elongated skull. Does the stress distribution improve or worsen? Find the optimal asymmetry parameter that minimizes peak stress at the impact point.',
      successHint: 'Geometry is often more important than material choice in engineering design. The woodpecker teaches us that shape optimization — placing material where stress is highest and removing it where it is not needed — is the foundation of efficient structural design.',
    },
    {
      title: 'Viscoelastic materials — time-dependent mechanical behavior',
      concept: `The materials in a woodpecker skull are not simple elastic solids. They are **viscoelastic** — their mechanical response depends on how fast the force is applied. Pull slowly on a tendon and it stretches easily. Yank it quickly and it resists much more. This rate-dependent behavior is crucial for impact protection.

A purely elastic material (like a steel spring) stores all energy and returns it: stress = E * strain, with no time dependence. A purely viscous material (like honey) dissipates all energy: stress = eta * strain_rate. **Viscoelastic materials do both** — they store some energy elastically and dissipate the rest viscously.

The simplest viscoelastic model is the **Standard Linear Solid (SLS)**, which combines a spring and a dashpot in series (Maxwell element) in parallel with another spring. The key equation is:

sigma + tau_r * d(sigma)/dt = E_R * (epsilon + tau_c * d(epsilon)/dt)

where tau_r is the **relaxation time** (how fast stress decays at constant strain) and tau_c is the **creep time** (how fast strain increases at constant stress). E_R is the relaxed (long-time) modulus.

For woodpecker skull materials, the relaxation time is tuned to the drumming frequency. At 20 Hz (50 ms between strikes), the material has just enough time to partially recover before the next impact. This prevents accumulated damage — the material "resets" between strikes.`,
      analogy: 'Think of memory foam. Press your hand into it slowly and it deforms easily, conforming to your shape — that is the viscous response. Push quickly and it feels firmer — the elastic response dominates at high rates. Now imagine a pillow that is firm during the impact of your head hitting it (absorbing the fall) but soft once you settle in (comfortable for sleeping). Woodpecker skull materials do exactly this: stiff during the 0.5 ms impact, compliant during the 50 ms recovery.',
      storyConnection: 'The story describes the woodpecker drumming in a steady rhythm — tap, tap, tap, tap. This rhythm is not musical expression. It is mechanically optimized. The 50 ms gap between strikes allows the viscoelastic skull materials to recover to about 90% of their original state. A faster rhythm would cause cumulative damage; a slower rhythm would waste foraging time. Evolution tuned the drumming frequency to match the material properties.',
      checkQuestion: 'A viscoelastic material has a relaxation time of 30 ms. The woodpecker drums at 20 Hz (50 ms period). What fraction of the stress has relaxed before the next strike? (Hint: stress decays as exp(-t/tau)).',
      checkAnswer: 'Stress fraction remaining = exp(-50/30) = exp(-1.67) = 0.189. So about 81% of the stress has relaxed before the next strike. The material recovers most of its capacity between impacts. If the woodpecker drummed at 50 Hz (20 ms period), only exp(-20/30) = 0.513 or 49% would relax — stress would accumulate dangerously. The 20 Hz frequency is optimized for the material\'s relaxation time.',
      codeIntro: 'Implement a Standard Linear Solid viscoelastic model and simulate the woodpecker\'s repeated impact loading to show stress recovery between strikes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Standard Linear Solid (SLS) viscoelastic model
# sigma + tau_r * dsigma/dt = E_R * (epsilon + tau_c * depsilon/dt)

# Material parameters (woodpecker spongy bone, approximate)
E1 = 1e9      # Pa - spring in Maxwell element (instantaneous stiffness)
E2 = 0.3e9    # Pa - parallel spring (equilibrium stiffness)
eta = 30e6    # Pa*s - dashpot viscosity

tau_r = eta / E1  # relaxation time
tau_c = eta * (E1 + E2) / (E1 * E2)  # creep time
E_R = E2  # relaxed modulus
E_inst = E1 + E2  # instantaneous modulus

print(f"Relaxation time: {tau_r*1000:.1f} ms")
print(f"Creep time: {tau_c*1000:.1f} ms")

# Time-domain simulation
dt_sim = 1e-5  # 10 us timestep
t_total = 0.3  # 300 ms (about 6 strikes at 20 Hz)
t = np.arange(0, t_total, dt_sim)
n = len(t)

# Generate repeated impact strain pulses (20 Hz)
strike_period = 0.05  # 50 ms
strike_duration = 0.5e-3  # 0.5 ms
max_strain = 0.01  # 1% strain

strain = np.zeros(n)
for strike_start in np.arange(0.01, t_total, strike_period):
    mask = (t >= strike_start) & (t < strike_start + strike_duration)
    local_t = t[mask] - strike_start
    strain[mask] = max_strain * np.sin(np.pi * local_t / strike_duration)

# Compute stress using SLS model (numerical integration)
# sigma_dot = (E_R * (epsilon + tau_c * epsilon_dot) - sigma) / tau_r
strain_dot = np.gradient(strain, dt_sim)
stress = np.zeros(n)

for i in range(1, n):
    dsigma = (E_R * (strain[i] + tau_c * strain_dot[i]) - stress[i-1]) / tau_r
    stress[i] = stress[i-1] + dsigma * dt_sim

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Strain input (repeated impacts)
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.plot(t * 1000, strain * 100, color='#3b82f6', linewidth=1)
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Strain (%)', color='white')
ax.set_title('Repeated impact strain pulses', color='white', fontsize=11)

# Plot 2: Stress response
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.plot(t * 1000, stress / 1e6, color='#ef4444', linewidth=1)
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Viscoelastic stress response', color='white', fontsize=11)

# Plot 3: Stress relaxation test
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

t_relax = np.linspace(0, 0.2, 1000)
# SLS relaxation: E(t) = E_R + (E_inst - E_R) * exp(-t/tau_r)
E_t = E_R + (E_inst - E_R) * np.exp(-t_relax / tau_r)
ax.plot(t_relax * 1000, E_t / 1e9, color='#a855f7', linewidth=2)
ax.axhline(E_R / 1e9, color='gray', linestyle='--', alpha=0.5, label=f'E_relaxed = {E_R/1e9:.2f} GPa')
ax.axhline(E_inst / 1e9, color='gray', linestyle=':', alpha=0.5, label=f'E_instant = {E_inst/1e9:.2f} GPa')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Relaxation modulus (GPa)', color='white')
ax.set_title('Stress relaxation function', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Effect of drumming frequency
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

frequencies = [10, 15, 20, 25, 30, 40, 50]
residual_stress_pct = []
for freq in frequencies:
    period = 1.0 / freq
    recovery_time = period - strike_duration
    residual = np.exp(-recovery_time / tau_r)
    # After many strikes, stress accumulates: sum of geometric series
    n_strikes = 20
    accumulated = sum(residual**k for k in range(n_strikes))
    residual_stress_pct.append(residual * 100)

ax.bar(range(len(frequencies)), residual_stress_pct,
       color=['#22c55e' if f <= 25 else '#f59e0b' if f <= 35 else '#ef4444' for f in frequencies],
       alpha=0.8)
ax.set_xticks(range(len(frequencies)))
ax.set_xticklabels([f'{f} Hz' for f in frequencies], color='white', fontsize=8)
ax.set_ylabel('Residual stress before next strike (%)', color='white')
ax.set_title('Recovery vs drumming frequency', color='white', fontsize=11)
ax.axvline(2, color='#22c55e', linestyle='--', alpha=0.5)
ax.text(2, max(residual_stress_pct) * 0.9, 'Actual\\nfrequency', ha='center', color='#22c55e', fontsize=8)

# Plot 5: Elastic vs viscoelastic comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Zoom into one strike
strike_idx = (t >= 0.06) & (t <= 0.08)
t_strike = (t[strike_idx] - 0.06) * 1000
s_strike = strain[strike_idx]
stress_ve = stress[strike_idx]
stress_elastic = E_inst * s_strike  # purely elastic response

ax.plot(t_strike, stress_elastic / 1e6, color='#3b82f6', linewidth=2, label='Elastic (no damping)')
ax.plot(t_strike, stress_ve / 1e6, color='#ef4444', linewidth=2, label='Viscoelastic (SLS)')
ax.fill_between(t_strike, stress_elastic / 1e6, stress_ve / 1e6, alpha=0.2, color='#f59e0b',
                label='Energy dissipated')
ax.set_xlabel('Time within strike (ms)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Energy dissipation per strike', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Hysteresis loop (stress-strain during one cycle)
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.plot(s_strike * 100, stress_ve / 1e6, color='#a855f7', linewidth=2)
ax.fill(s_strike * 100, stress_ve / 1e6, alpha=0.2, color='#a855f7')
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Hysteresis loop (energy loss)', color='white', fontsize=11)
ax.text(0.5, max(stress_ve / 1e6) * 0.5, 'Area = energy\\ndissipated as heat',
        color='white', fontsize=9, ha='center',
        bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#a855f7'))

plt.tight_layout()
plt.show()

print()
print("Viscoelastic Material Summary:")
print(f"Instantaneous modulus: {E_inst/1e9:.2f} GPa (stiff during impact)")
print(f"Relaxed modulus: {E_R/1e9:.2f} GPa (soft at equilibrium)")
print(f"Ratio: {E_inst/E_R:.1f}x stiffer during impact than at rest")
print(f"Relaxation time: {tau_r*1000:.1f} ms")
print()
print(f"At 20 Hz drumming: {np.exp(-0.05/tau_r)*100:.1f}% residual stress before next strike")
print(f"At 50 Hz drumming: {np.exp(-0.02/tau_r)*100:.1f}% residual stress (DANGER)")
print()
print("The drumming frequency is tuned to the material relaxation time.")
print("This is co-evolution of behavior and biomechanics.")`,
      challenge: 'Modify the viscosity (eta) to find the relaxation time that would make 50 Hz drumming safe (less than 20% residual stress). How does this change the instantaneous stiffness of the material?',
      successHint: 'Viscoelasticity is everywhere in biology — skin, cartilage, tendons, blood vessel walls. It is also the basis of engineered materials like memory foam, polymer dashpots in buildings, and the EPS foam in bicycle helmets. Understanding rate-dependent behavior is essential for any impact protection design.',
    },
    {
      title: 'Finite element analysis — simulating complex structures computationally',
      concept: `Real woodpecker skulls cannot be analyzed with simple equations. The geometry is complex, the materials are nonlinear and inhomogeneous, and the loading is dynamic. Engineers solve such problems using **Finite Element Analysis (FEA)** — a numerical method that breaks a complex structure into thousands of small, simple elements.

The core idea of FEA:

1. **Discretize**: Divide the structure into a mesh of small elements (triangles in 2D, tetrahedra in 3D). Each element is simple enough to solve analytically.
2. **Formulate**: For each element, write the relationship between nodal forces and displacements: [K]{u} = {F}, where [K] is the stiffness matrix, {u} is displacement, and {F} is force.
3. **Assemble**: Combine all element equations into one large system: [K_global]{u_global} = {F_global}. Adjacent elements share nodes, so their equations are coupled.
4. **Solve**: Apply boundary conditions (which nodes are fixed, where forces are applied) and solve the linear system. For a mesh with 10,000 nodes in 2D, this is a system of 20,000 equations.
5. **Post-process**: From the displacements, calculate strains (spatial derivatives of displacement) and stresses (strain * material properties) everywhere.

For a woodpecker skull FEA model, researchers use CT scans to get the geometry, material testing to get properties at each location, and high-speed video to get loading conditions. The result is a detailed map of stress throughout the skull during an impact.`,
      analogy: 'FEA is like predicting weather by dividing the atmosphere into a grid. You cannot write one equation for the whole atmosphere, but you can write simple equations for each grid cell (temperature, pressure, wind) and let the cells interact with their neighbors. Given enough cells and enough computing power, the simulation converges to reality. FEA does the same for mechanical structures — divide, conquer, assemble.',
      storyConnection: 'When scientists wanted to understand exactly how the woodpecker survives, they could not open up a live skull during drumming. Instead, they CT-scanned woodpecker skulls, built 3D digital models, assigned material properties to each tissue type, and ran FEA simulations of the impact. The computational model revealed stress distributions that no physical experiment could measure — including the discovery that the hyoid bone reduces peak brain stress by 40%.',
      checkQuestion: 'A 2D FEA mesh has 500 triangular elements and 300 nodes. How many equations are in the global system (assuming 2 degrees of freedom per node: x and y displacement)?',
      checkAnswer: '300 nodes x 2 DOF = 600 equations. The stiffness matrix [K_global] is 600x600. Each triangular element contributes a 6x6 local stiffness matrix (3 nodes x 2 DOF). The assembly process maps these local matrices into the global matrix at the correct positions. Modern FEA models of skulls use millions of elements, producing millions of equations that require parallel computing.',
      codeIntro: 'Build a simplified 2D finite element analysis of a skull cross-section under impact loading, visualizing stress distribution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified 2D FEA: bar elements forming a skull-like arch
# Each bar element has stiffness k = E*A/L

# Create skull arch geometry (semicircular with variable thickness)
n_nodes = 25
angles = np.linspace(0, np.pi, n_nodes)
radius = 0.03  # 30 mm radius

# Node positions (skull arch)
nodes_x = radius * np.cos(angles)
nodes_y = radius * np.sin(angles)
nodes = np.column_stack([nodes_x, nodes_y])

n_elements = n_nodes - 1

# Material properties vary along arch (thicker at front)
# Front = angle near pi/2, sides = 0 and pi
E_base = 10e9  # Pa (bone)
thickness_profile = 0.002 + 0.003 * np.sin(angles[:-1] + np.pi/4)  # mm, thicker at top-front
width = 0.01  # 10 mm depth (out of plane)
areas = thickness_profile * width

# Young's modulus varies too (spongy near front, dense on sides)
E_profile = E_base * (0.5 + 0.5 * np.cos(angles[:-1] - np.pi/4)**2)

# Assemble global stiffness matrix
n_dof = 2 * n_nodes  # 2 DOF per node (x, y)
K_global = np.zeros((n_dof, n_dof))

element_lengths = []
element_angles_local = []

for e in range(n_elements):
    n1, n2 = e, e + 1
    dx = nodes[n2, 0] - nodes[n1, 0]
    dy = nodes[n2, 1] - nodes[n1, 1]
    L = np.sqrt(dx**2 + dy**2)
    c = dx / L  # cos
    s = dy / L  # sin
    element_lengths.append(L)
    element_angles_local.append(np.arctan2(dy, dx))

    # Local stiffness for bar element
    k = E_profile[e] * areas[e] / L

    # Transformation to global coordinates
    T = np.array([
        [ c*c,  c*s, -c*c, -c*s],
        [ c*s,  s*s, -c*s, -s*s],
        [-c*c, -c*s,  c*c,  c*s],
        [-c*s, -s*s,  c*s,  s*s]
    ])

    k_global = k * T

    # DOF mapping
    dofs = [2*n1, 2*n1+1, 2*n2, 2*n2+1]
    for i in range(4):
        for j in range(4):
            K_global[dofs[i], dofs[j]] += k_global[i, j]

# Apply boundary conditions
# Fix both ends (where skull meets neck)
fixed_dofs = [0, 1, 2*(n_nodes-1), 2*(n_nodes-1)+1]

# Apply impact force at top of arch
impact_node = n_nodes // 2
F_global = np.zeros(n_dof)
F_global[2 * impact_node + 1] = -500  # 500 N downward

# Remove fixed DOFs and solve
free_dofs = [d for d in range(n_dof) if d not in fixed_dofs]
K_free = K_global[np.ix_(free_dofs, free_dofs)]
F_free = F_global[free_dofs]

u_free = np.linalg.solve(K_free, F_free)

# Reconstruct full displacement vector
u_global = np.zeros(n_dof)
for i, dof in enumerate(free_dofs):
    u_global[dof] = u_free[i]

# Calculate element stresses
stresses = np.zeros(n_elements)
for e in range(n_elements):
    n1, n2 = e, e + 1
    dx = nodes[n2, 0] - nodes[n1, 0]
    dy = nodes[n2, 1] - nodes[n1, 1]
    L = np.sqrt(dx**2 + dy**2)
    c = dx / L
    s = dy / L

    u1x, u1y = u_global[2*n1], u_global[2*n1+1]
    u2x, u2y = u_global[2*n2], u_global[2*n2+1]

    # Axial strain
    delta_L = (u2x - u1x) * c + (u2y - u1y) * s
    strain_e = delta_L / L
    stresses[e] = E_profile[e] * strain_e

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Mesh and deformed shape
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

scale = 500  # amplify deformation for visibility
deformed_x = nodes[:, 0] + u_global[0::2] * scale
deformed_y = nodes[:, 1] + u_global[1::2] * scale

ax.plot(nodes[:, 0] * 1000, nodes[:, 1] * 1000, 'o-', color='#3b82f6', linewidth=1.5,
        markersize=4, label='Original', alpha=0.5)
ax.plot(deformed_x * 1000, deformed_y * 1000, 'o-', color='#ef4444', linewidth=1.5,
        markersize=4, label=f'Deformed (x{scale})')
ax.annotate('F = 500N', xy=(nodes[impact_node, 0]*1000, nodes[impact_node, 1]*1000 + 2),
            color='#f59e0b', fontsize=9, ha='center',
            arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2))
ax.set_xlabel('x (mm)', color='white')
ax.set_ylabel('y (mm)', color='white')
ax.set_title('FEA mesh + deformed shape', color='white', fontsize=11)
ax.set_aspect('equal')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Stress distribution along arch
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

element_positions = np.degrees(angles[:-1] + np.diff(angles) / 2)
colors_stress = ['#ef4444' if s < 0 else '#22c55e' for s in stresses]
ax.bar(range(n_elements), stresses / 1e6, color=colors_stress, alpha=0.8)
ax.set_xlabel('Element index (0=left, 12=top, 24=right)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Stress in each element', color='white', fontsize=11)
ax.axhline(0, color='gray', linestyle='-', alpha=0.3)

# Plot 3: Stress mapped onto geometry (color map)
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

stress_norm = np.abs(stresses) / np.max(np.abs(stresses))
for e in range(n_elements):
    n1, n2 = e, e + 1
    color_val = plt.cm.hot(stress_norm[e])
    ax.plot([nodes[n1, 0]*1000, nodes[n2, 0]*1000],
            [nodes[n1, 1]*1000, nodes[n2, 1]*1000],
            color=color_val, linewidth=3 + thickness_profile[e] * 2000)

sm = plt.cm.ScalarMappable(cmap='hot', norm=plt.Normalize(0, np.max(np.abs(stresses))/1e6))
cbar = plt.colorbar(sm, ax=ax, label='|Stress| (MPa)')
cbar.ax.yaxis.label.set_color('white')
cbar.ax.tick_params(colors='gray')
ax.set_xlabel('x (mm)', color='white')
ax.set_ylabel('y (mm)', color='white')
ax.set_title('Stress heat map on skull', color='white', fontsize=11)
ax.set_aspect('equal')

# Plot 4: Displacement magnitude
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

disp_mag = np.sqrt(u_global[0::2]**2 + u_global[1::2]**2) * 1e6  # micrometers
ax.plot(np.degrees(angles), disp_mag, 'o-', color='#a855f7', linewidth=2, markersize=4)
ax.set_xlabel('Angle along arch (degrees)', color='white')
ax.set_ylabel('Displacement (micrometers)', color='white')
ax.set_title('Nodal displacement magnitude', color='white', fontsize=11)

# Plot 5: Stiffness matrix sparsity pattern
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

ax.spy(K_global, markersize=1, color='#06b6d4')
ax.set_xlabel('DOF index', color='white')
ax.set_ylabel('DOF index', color='white')
ax.set_title(f'Stiffness matrix ({n_dof}x{n_dof})', color='white', fontsize=11)

# Plot 6: Effect of variable vs uniform properties
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Solve again with uniform properties
K_uniform = np.zeros((n_dof, n_dof))
E_uniform = np.mean(E_profile)
A_uniform = np.mean(areas)

for e in range(n_elements):
    n1, n2 = e, e + 1
    dx = nodes[n2, 0] - nodes[n1, 0]
    dy = nodes[n2, 1] - nodes[n1, 1]
    L = np.sqrt(dx**2 + dy**2)
    c, s = dx / L, dy / L
    k = E_uniform * A_uniform / L
    T = np.array([[c*c, c*s, -c*c, -c*s], [c*s, s*s, -c*s, -s*s],
                  [-c*c, -c*s, c*c, c*s], [-c*s, -s*s, c*s, s*s]])
    dofs = [2*n1, 2*n1+1, 2*n2, 2*n2+1]
    for i in range(4):
        for j in range(4):
            K_uniform[dofs[i], dofs[j]] += k * T[i, j]

K_u_free = K_uniform[np.ix_(free_dofs, free_dofs)]
u_u_free = np.linalg.solve(K_u_free, F_free)
u_uniform = np.zeros(n_dof)
for i, dof in enumerate(free_dofs):
    u_uniform[dof] = u_u_free[i]

stresses_uniform = np.zeros(n_elements)
for e in range(n_elements):
    n1, n2 = e, e + 1
    dx = nodes[n2, 0] - nodes[n1, 0]
    dy = nodes[n2, 1] - nodes[n1, 1]
    L = np.sqrt(dx**2 + dy**2)
    c, s = dx / L, dy / L
    delta_L = (u_uniform[2*n2] - u_uniform[2*n1]) * c + (u_uniform[2*n2+1] - u_uniform[2*n1+1]) * s
    stresses_uniform[e] = E_uniform * delta_L / L

ax.plot(range(n_elements), np.abs(stresses) / 1e6, 'o-', color='#22c55e', linewidth=2,
        markersize=3, label='Variable (woodpecker)')
ax.plot(range(n_elements), np.abs(stresses_uniform) / 1e6, 'o-', color='#ef4444', linewidth=2,
        markersize=3, label='Uniform (naive)')
ax.set_xlabel('Element index', color='white')
ax.set_ylabel('|Stress| (MPa)', color='white')
ax.set_title('Graded vs uniform material', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("FEA Summary:")
print(f"Mesh: {n_nodes} nodes, {n_elements} elements, {n_dof} DOFs")
print(f"Stiffness matrix: {n_dof}x{n_dof} = {n_dof**2} entries")
print(f"Non-zero entries: {np.count_nonzero(K_global)} (sparse!)")
print()
print(f"Peak stress (variable properties): {np.max(np.abs(stresses))/1e6:.1f} MPa")
print(f"Peak stress (uniform properties): {np.max(np.abs(stresses_uniform))/1e6:.1f} MPa")
print(f"Stress reduction from graded design: {(1 - np.max(np.abs(stresses))/np.max(np.abs(stresses_uniform)))*100:.1f}%")
print()
print(f"Max displacement at impact: {disp_mag[impact_node]:.2f} micrometers")
print()
print("The graded material design reduces peak stress significantly.")
print("This is the same principle used in modern helmet design: vary")
print("material properties spatially to optimize stress distribution.")`,
      challenge: 'Add more nodes to the mesh (try n_nodes = 50 and 100). How does the stress distribution change? Does the solution converge? Plot stress vs mesh refinement to demonstrate FEA convergence.',
      successHint: 'You just built a finite element solver from scratch. Commercial FEA software like ANSYS, Abaqus, and COMSOL do exactly this, but with millions of 3D elements, nonlinear materials, and dynamic loading. The principles are identical — discretize, assemble, solve. You now understand the engine behind every structural simulation in engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Impact biomechanics and protective engineering</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for biomechanics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
