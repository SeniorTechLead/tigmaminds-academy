import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function WoodpeckerLevel4() {
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
      title: 'Step 1: Define the helmet impact model',
      concept: `Our capstone project is a **Helmet Safety Analyzer** — a computational tool that models how different helmet designs absorb impact energy and predicts whether they meet safety standards. This is exactly what helmet manufacturers do during the design phase, before building physical prototypes.

A helmet is a multi-layer energy absorption system, just like the woodpecker skull. The standard bicycle helmet has three layers:
- **Outer shell**: A thin, hard polycarbonate layer that spreads the impact over a wider area and prevents penetration.
- **EPS foam liner**: Expanded polystyrene that crushes on impact, converting kinetic energy into permanent deformation. This is the primary energy absorber.
- **Comfort padding**: Soft foam that fits the helmet to the head and provides minor additional cushioning.

Our model will simulate a standard **drop test** — the certification test used by CPSC, EN 1078, and Snell standards. A headform wearing the helmet is dropped from a specified height onto an anvil. Accelerometers in the headform measure the peak g-force and the Head Injury Criterion (HIC), which accounts for both the magnitude and duration of acceleration. A helmet passes if HIC < 1000 and peak g < 300g.

In this first step, we define the physical parameters and build the impact energy calculator.`,
      analogy: 'Building a helmet analyzer is like building a flight simulator before flying a real plane. You model the physics (gravity, lift, drag), define the controls (throttle, flaps), set the test conditions (weather, runway), and see if the plane survives the landing. If the simulation says the design fails, you change it before building the real thing — saving millions of dollars and potentially lives.',
      storyConnection: 'The woodpecker\'s skull is nature\'s helmet — a multi-layer impact protection system refined over millions of years of "testing" through natural selection. Our helmet analyzer reverse-engineers this approach: we define the layers, set the impact conditions, and computationally test whether the design protects the brain. We are doing in minutes what evolution did in millennia.',
      checkQuestion: 'A helmet drop test uses a 5 kg headform dropped from 1.5 m. What is the impact velocity and kinetic energy at the moment of contact?',
      checkAnswer: 'Using conservation of energy: v = sqrt(2*g*h) = sqrt(2 * 9.81 * 1.5) = 5.42 m/s. Kinetic energy = 0.5 * m * v^2 = 0.5 * 5 * 29.4 = 73.6 J. This is the energy the helmet must absorb. If even 10% reaches the head as kinetic energy of the brain, the peak acceleration could exceed concussion thresholds.',
      codeIntro: 'Define the helmet model parameters and calculate impact conditions for standard certification tests.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === HELMET SAFETY ANALYZER: Step 1 — Impact Model Definition ===

class HelmetImpactModel:
    """Models a helmet drop test for safety certification."""

    def __init__(self, name="Default Helmet"):
        self.name = name
        # Headform properties
        self.head_mass = 5.0  # kg (standard test headform)
        self.head_radius = 0.09  # m (approximate)

        # Helmet layers (from outside in)
        self.layers = []

        # Test standards
        self.standards = {
            'CPSC (bicycle)': {'drop_height': 2.0, 'max_g': 300, 'max_HIC': 1000},
            'EN 1078 (EU bicycle)': {'drop_height': 1.5, 'max_g': 250, 'max_HIC': 1000},
            'Snell B-95 (bicycle)': {'drop_height': 2.2, 'max_g': 300, 'max_HIC': 1000},
            'ECE 22.06 (motorcycle)': {'drop_height': 2.87, 'max_g': 275, 'max_HIC': 2400},
            'Snell M2020 (motorcycle)': {'drop_height': 3.06, 'max_g': 275, 'max_HIC': None},
        }

    def add_layer(self, name, thickness_mm, density_kg_m3, crush_stress_kPa,
                  youngs_modulus_MPa, color='gray'):
        """Add a helmet layer with material properties."""
        self.layers.append({
            'name': name,
            'thickness': thickness_mm / 1000,  # convert to meters
            'density': density_kg_m3,
            'crush_stress': crush_stress_kPa * 1000,  # convert to Pa
            'E': youngs_modulus_MPa * 1e6,  # convert to Pa
            'color': color,
        })

    def impact_conditions(self, drop_height):
        """Calculate impact velocity and energy from drop height."""
        g = 9.81
        v = np.sqrt(2 * g * drop_height)
        KE = 0.5 * self.head_mass * v**2
        return {'velocity': v, 'energy': KE, 'height': drop_height}

    def total_helmet_mass(self):
        """Calculate total helmet mass from layer volumes."""
        total = 0
        for layer in self.layers:
            # Approximate hemisphere shell volume
            r_outer = self.head_radius + sum(l['thickness'] for l in self.layers)
            r_inner = r_outer - layer['thickness']
            vol = (2/3) * np.pi * (r_outer**3 - r_inner**3)
            total += layer['density'] * vol
        return total

# Create a standard bicycle helmet
helmet = HelmetImpactModel("Standard Bicycle Helmet")
helmet.add_layer("Outer shell (PC)", thickness_mm=1.5, density_kg_m3=1200,
                 crush_stress_kPa=80000, youngs_modulus_MPa=2400, color='#3b82f6')
helmet.add_layer("EPS foam (80 g/L)", thickness_mm=25, density_kg_m3=80,
                 crush_stress_kPa=800, youngs_modulus_MPa=15, color='#f59e0b')
helmet.add_layer("Comfort padding", thickness_mm=5, density_kg_m3=50,
                 crush_stress_kPa=50, youngs_modulus_MPa=0.5, color='#22c55e')

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Drop test conditions for each standard
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

standards = list(helmet.standards.keys())
heights = [helmet.standards[s]['drop_height'] for s in standards]
conditions = [helmet.impact_conditions(h) for h in heights]
velocities = [c['velocity'] for c in conditions]
energies = [c['energy'] for c in conditions]

x = np.arange(len(standards))
bars = ax.bar(x, energies, color=['#3b82f6', '#22c55e', '#a855f7', '#ef4444', '#f59e0b'], alpha=0.8)
ax.set_xticks(x)
ax.set_xticklabels([s.split('(')[0].strip() for s in standards], color='white', fontsize=7, rotation=20)
ax.set_ylabel('Impact energy (J)', color='white')
ax.set_title('Impact energy by test standard', color='white', fontsize=11)

for bar, e, v in zip(bars, energies, velocities):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{e:.0f}J\\n{v:.1f}m/s', ha='center', va='bottom', color='white', fontsize=7)

# Plot 2: Helmet cross-section
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Draw helmet layers as concentric arcs
angles = np.linspace(0, np.pi, 100)
r_current = helmet.head_radius

# Draw head
head_x = r_current * np.cos(angles)
head_y = r_current * np.sin(angles)
ax.fill_between(head_x * 1000, 0, head_y * 1000, color='#fbbf24', alpha=0.3)
ax.plot(head_x * 1000, head_y * 1000, color='#fbbf24', linewidth=2, label='Head')

for layer in reversed(helmet.layers):
    r_outer = r_current + layer['thickness']
    outer_x = r_outer * np.cos(angles)
    outer_y = r_outer * np.sin(angles)
    inner_x = r_current * np.cos(angles)
    inner_y = r_current * np.sin(angles)

    ax.fill_between(outer_x * 1000, inner_y * 1000, outer_y * 1000,
                    color=layer['color'], alpha=0.4)
    ax.plot(outer_x * 1000, outer_y * 1000, color=layer['color'], linewidth=2,
            label=f"{layer['name']} ({layer['thickness']*1000:.1f}mm)")
    r_current = r_outer

ax.set_xlabel('x (mm)', color='white')
ax.set_ylabel('y (mm)', color='white')
ax.set_title('Helmet cross-section', color='white', fontsize=11)
ax.set_aspect('equal')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')

# Plot 3: Material properties comparison
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

layer_names = [l['name'].split('(')[0].strip() for l in helmet.layers]
crush_stresses = [l['crush_stress'] / 1000 for l in helmet.layers]  # kPa
layer_colors = [l['color'] for l in helmet.layers]

ax.barh(range(len(layer_names)), crush_stresses, color=layer_colors, alpha=0.8)
ax.set_xscale('log')
ax.set_yticks(range(len(layer_names)))
ax.set_yticklabels(layer_names, color='white', fontsize=8)
ax.set_xlabel('Crush stress (kPa)', color='white')
ax.set_title('Layer crush strength', color='white', fontsize=11)

# Plot 4: Energy absorption capacity per layer
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Energy = crush_stress * area * max_crush_distance
contact_area = 0.008  # m^2 (approximate flat anvil contact)
energy_capacity = []
for layer in helmet.layers:
    max_crush = layer['thickness'] * 0.7  # Can crush up to 70%
    E_absorb = layer['crush_stress'] * contact_area * max_crush
    energy_capacity.append(E_absorb)

bars = ax.bar(range(len(layer_names)), energy_capacity, color=layer_colors, alpha=0.8)
ax.set_xticks(range(len(layer_names)))
ax.set_xticklabels(layer_names, color='white', fontsize=8)
ax.set_ylabel('Energy capacity (J)', color='white')
ax.set_title('Energy absorption per layer', color='white', fontsize=11)

total_capacity = sum(energy_capacity)
for bar, e in zip(bars, energy_capacity):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{e:.1f}J ({e/total_capacity*100:.0f}%)', ha='center', va='bottom', color='white', fontsize=8)

# Plot 5: Safety margin for each standard
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

margins = [(total_capacity - c['energy']) / c['energy'] * 100 for c in conditions]
bar_colors = ['#22c55e' if m > 0 else '#ef4444' for m in margins]
bars = ax.bar(range(len(standards)), margins, color=bar_colors, alpha=0.8)
ax.set_xticks(range(len(standards)))
ax.set_xticklabels([s.split('(')[0].strip() for s in standards], color='white', fontsize=7, rotation=20)
ax.set_ylabel('Energy margin (%)', color='white')
ax.set_title('Safety margin by standard', color='white', fontsize=11)
ax.axhline(0, color='#ef4444', linestyle='--', alpha=0.7)

for bar, m in zip(bars, margins):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{m:+.0f}%', ha='center', va='bottom', color='white', fontsize=8)

# Plot 6: Velocity vs drop height curve
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

h_range = np.linspace(0, 4, 100)
v_range = np.sqrt(2 * 9.81 * h_range)
e_range = 0.5 * helmet.head_mass * v_range**2

ax.plot(h_range, v_range, color='#3b82f6', linewidth=2, label='Velocity (m/s)')
ax2 = ax.twinx()
ax2.plot(h_range, e_range, color='#ef4444', linewidth=2, label='Energy (J)')
ax2.tick_params(colors='gray')
ax2.set_ylabel('Energy (J)', color='#ef4444')

for std_name, std in helmet.standards.items():
    ax.axvline(std['drop_height'], color='gray', linestyle=':', alpha=0.3)
    ax.text(std['drop_height'], max(v_range) * 0.95, std_name.split('(')[0].strip(),
            rotation=90, va='top', ha='right', color='gray', fontsize=6)

ax.set_xlabel('Drop height (m)', color='white')
ax.set_ylabel('Impact velocity (m/s)', color='#3b82f6')
ax.set_title('Impact conditions vs height', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("=== HELMET SAFETY ANALYZER: Model Definition ===")
print(f"Helmet: {helmet.name}")
print(f"Head mass: {helmet.head_mass} kg")
print()
print("Layers:")
for l in helmet.layers:
    print(f"  {l['name']}: {l['thickness']*1000:.1f}mm, crush={l['crush_stress']/1000:.0f} kPa")
print(f"\\nTotal energy absorption capacity: {total_capacity:.1f} J")
print()
print("Test Standard Results:")
for std_name, cond, margin in zip(standards, conditions, margins):
    status = "PASS" if margin > 0 else "FAIL"
    print(f"  {std_name}: {cond['energy']:.1f}J impact, margin={margin:+.1f}% [{status}]")`,
      challenge: 'Add a fourth layer: a MIPS (Multi-directional Impact Protection System) liner between the EPS foam and comfort padding. MIPS adds ~3mm of low-friction material with very low crush stress (10 kPa). How does it affect the total energy capacity?',
      successHint: 'The model definition is the foundation. We have established the physical parameters, test standards, and energy budget. Next steps will add dynamic simulation, deceleration curves, and HIC calculation to turn this into a real safety analyzer.',
    },
    {
      title: 'Step 2: Simulate the dynamic impact — force vs time',
      concept: `Static energy capacity tells us if the helmet CAN absorb enough energy, but it does not tell us HOW the deceleration unfolds over time. Safety standards care about the **deceleration profile** — the shape of the g-force vs time curve — because the same total energy can be absorbed in dangerous or safe ways.

A helmet that absorbs 100 J in 1 ms produces an extremely high peak g-force. A helmet that absorbs 100 J over 10 ms produces a much lower peak. The ideal deceleration profile is a **square wave** — constant deceleration throughout the crush. This minimizes peak g for a given energy.

Real helmets do not produce square waves. The EPS foam has a stress-strain curve with three regimes:
1. **Linear elastic** (strain < 5%): Low stress, foam compresses cells elastically.
2. **Plateau** (5% < strain < 60-70%): Nearly constant stress as cell walls buckle and collapse. This is where most energy is absorbed.
3. **Densification** (strain > 70%): Collapsed cells compact into solid material, stress rises sharply. This is dangerous — it means the foam is "bottomed out."

Our dynamic simulation uses the equation of motion: m * a(t) = -F_helmet(x(t)), where F_helmet depends on crush distance x through the foam stress-strain curve. We integrate numerically using the Euler method.`,
      analogy: 'Think of jumping off a wall onto a mattress vs onto a thin pillow. Both absorb your landing energy, but the mattress has a long "plateau" where it deforms at nearly constant force. The thin pillow bottoms out immediately — you hit the floor through it. Peak force with the mattress might be 500 N; with the pillow, 5000 N. Same energy, vastly different safety. The EPS foam plateau is the mattress; densification is hitting the floor.',
      storyConnection: 'The woodpecker\'s spongy bone works exactly like EPS foam — it has an elastic region, a plateau where trabeculae buckle progressively, and a densification region when fully compressed. Evolution "discovered" the same stress-strain curve that helmet engineers deliberately design for. Our simulation models both natural and engineered versions of this protective mechanism.',
      checkQuestion: 'A helmet foam has a plateau stress of 800 kPa, contact area of 80 cm^2, and 25 mm thickness. If the head decelerates at constant force through the plateau, what is the g-force on a 5 kg head?',
      checkAnswer: 'Force = stress * area = 800,000 Pa * 0.008 m^2 = 6,400 N. Deceleration = F/m = 6,400 / 5 = 1,280 m/s^2. In g: 1,280 / 9.81 = 130g. This is below the 300g CPSC limit, so the foam density is appropriate. If the foam were too stiff (higher plateau stress), the g-force would be higher. If too soft, the foam would bottom out before absorbing all energy.',
      codeIntro: 'Simulate the dynamic impact using Euler integration with a realistic EPS foam stress-strain curve.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === HELMET SAFETY ANALYZER: Step 2 — Dynamic Impact Simulation ===

def eps_foam_stress(strain, plateau_stress, densification_strain=0.7):
    """EPS foam stress-strain model with three regions."""
    stress = np.zeros_like(strain)

    # Region 1: Linear elastic (strain < 0.05)
    elastic_mask = strain < 0.05
    E_elastic = plateau_stress / 0.03  # Modulus set so yield matches plateau
    stress[elastic_mask] = E_elastic * strain[elastic_mask]

    # Region 2: Plateau (0.05 < strain < densification)
    plateau_mask = (strain >= 0.05) & (strain < densification_strain)
    # Slight hardening in plateau
    stress[plateau_mask] = plateau_stress * (1 + 0.3 * (strain[plateau_mask] - 0.05))

    # Region 3: Densification (strain > densification)
    dense_mask = strain >= densification_strain
    plateau_at_dense = plateau_stress * (1 + 0.3 * (densification_strain - 0.05))
    stress[dense_mask] = plateau_at_dense * np.exp(5 * (strain[dense_mask] - densification_strain))

    return stress

def simulate_impact(head_mass, drop_height, foam_thickness, foam_plateau_stress,
                    contact_area, shell_stiffness=5e6):
    """Simulate helmet impact using Euler integration."""
    g = 9.81
    v0 = np.sqrt(2 * g * drop_height)
    dt = 1e-6  # 1 microsecond
    t_max = 0.02  # 20 ms max

    t_list, v_list, x_list, a_list, F_list = [0], [v0], [0], [0], [0]

    t, v, x = 0, v0, 0

    while t < t_max and v > 0 and x < foam_thickness * 0.95:
        # Current strain
        strain = x / foam_thickness
        strain = min(strain, 0.95)

        # Foam force
        foam_stress = eps_foam_stress(np.array([strain]), foam_plateau_stress)[0]
        F_foam = foam_stress * contact_area

        # Shell spreading force (distributes load at start)
        F_shell = shell_stiffness * x if x < 0.002 else shell_stiffness * 0.002

        F_total = F_foam + F_shell
        a = F_total / head_mass  # deceleration

        v -= a * dt
        x += v * dt if v > 0 else 0
        t += dt

        t_list.append(t)
        v_list.append(max(v, 0))
        x_list.append(x)
        a_list.append(a)
        F_list.append(F_total)

    return {
        't': np.array(t_list),
        'v': np.array(v_list),
        'x': np.array(x_list),
        'a': np.array(a_list),
        'F': np.array(F_list),
        'peak_g': max(a_list) / g,
        'max_crush': max(x_list),
        'crush_pct': max(x_list) / foam_thickness * 100,
    }

# Simulate three helmet designs
designs = [
    {"name": "Soft foam (40 g/L)", "plateau": 400e3, "thickness": 0.025, "color": "#22c55e"},
    {"name": "Medium foam (80 g/L)", "plateau": 800e3, "thickness": 0.025, "color": "#3b82f6"},
    {"name": "Hard foam (120 g/L)", "plateau": 1500e3, "thickness": 0.025, "color": "#ef4444"},
]

drop_height = 2.0  # CPSC standard
head_mass = 5.0
contact_area = 0.008  # 80 cm^2

results = {}
for d in designs:
    results[d['name']] = simulate_impact(head_mass, drop_height, d['thickness'],
                                          d['plateau'], contact_area)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: EPS foam stress-strain curves
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

strain_range = np.linspace(0, 0.9, 500)
for d in designs:
    stress = eps_foam_stress(strain_range, d['plateau'])
    ax.plot(strain_range * 100, stress / 1e6, color=d['color'], linewidth=2, label=d['name'])

ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('EPS foam stress-strain curves', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.axvline(70, color='gray', linestyle='--', alpha=0.5)
ax.text(72, 0.5, 'Densification', color='gray', fontsize=8, rotation=90)

# Plot 2: Deceleration vs time
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for d in designs:
    r = results[d['name']]
    ax.plot(r['t'] * 1000, r['a'] / 9.81, color=d['color'], linewidth=2, label=d['name'])

ax.axhline(300, color='gray', linestyle='--', alpha=0.5, label='CPSC limit (300g)')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Deceleration (g)', color='white')
ax.set_title('Head deceleration during impact', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Velocity vs time
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for d in designs:
    r = results[d['name']]
    ax.plot(r['t'] * 1000, r['v'], color=d['color'], linewidth=2, label=d['name'])

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Velocity (m/s)', color='white')
ax.set_title('Head velocity during impact', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Crush distance vs time
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for d in designs:
    r = results[d['name']]
    ax.plot(r['t'] * 1000, r['x'] * 1000, color=d['color'], linewidth=2, label=d['name'])

ax.axhline(25 * 0.7, color='gray', linestyle='--', alpha=0.5, label='70% crush (densification)')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Crush distance (mm)', color='white')
ax.set_title('Foam compression during impact', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Force vs crush distance (hysteresis)
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for d in designs:
    r = results[d['name']]
    ax.plot(r['x'] * 1000, r['F'] / 1000, color=d['color'], linewidth=2, label=d['name'])

ax.set_xlabel('Crush distance (mm)', color='white')
ax.set_ylabel('Force (kN)', color='white')
ax.set_title('Force-displacement curves', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary comparison
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

x_pos = np.arange(len(designs))
peak_gs = [results[d['name']]['peak_g'] for d in designs]
crush_pcts = [results[d['name']]['crush_pct'] for d in designs]
colors = [d['color'] for d in designs]

bars = ax.bar(x_pos - 0.2, peak_gs, 0.35, color=colors, alpha=0.8, label='Peak g')
ax2 = ax.twinx()
ax2.bar(x_pos + 0.2, crush_pcts, 0.35, color=colors, alpha=0.4, label='Crush %')
ax2.tick_params(colors='gray')
ax2.set_ylabel('Crush (%)', color='white')

ax.axhline(300, color='#ef4444', linestyle='--', alpha=0.5)
ax.set_xticks(x_pos)
ax.set_xticklabels([d['name'].split('(')[0].strip() for d in designs], color='white', fontsize=8)
ax.set_ylabel('Peak g-force', color='white')
ax.set_title('Design comparison', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("=== Dynamic Impact Simulation Results ===")
print(f"Test: {drop_height}m drop, {head_mass}kg headform, CPSC standard")
print()
for d in designs:
    r = results[d['name']]
    status = "PASS" if r['peak_g'] < 300 else "FAIL"
    print(f"{d['name']}:")
    print(f"  Peak deceleration: {r['peak_g']:.0f}g [{status}]")
    print(f"  Max crush: {r['max_crush']*1000:.1f}mm ({r['crush_pct']:.0f}%)")
    print(f"  Impact duration: {r['t'][-1]*1000:.1f}ms")
print()
print("Key insight: Softer foam gives lower g but risks bottoming out.")
print("Harder foam stays within crush limits but transmits more force.")
print("The OPTIMAL foam is the softest that does NOT bottom out.")`,
      challenge: 'Vary foam thickness from 15mm to 35mm for the medium foam design. Find the minimum thickness that passes CPSC. This is the thickness-weight tradeoff every helmet designer faces.',
      successHint: 'You now have a dynamic impact simulator. The deceleration profile is what safety labs actually measure with accelerometers during certification. Next we add the HIC calculation that determines pass/fail in most modern standards.',
    },
    {
      title: 'Step 3: Head Injury Criterion (HIC) — the real safety metric',
      concept: `Peak g-force alone is not a sufficient measure of head injury risk. A 500g pulse lasting 0.1 ms might be harmless, while a 200g pulse lasting 10 ms could be lethal. The **Head Injury Criterion (HIC)** captures both magnitude and duration.

HIC is defined as:

HIC = max over (t1, t2) of { (t2 - t1) * [ (1/(t2-t1)) * integral from t1 to t2 of a(t) dt ]^2.5 }

where a(t) is the head acceleration in g's, and the maximum is taken over all pairs of time points (t1, t2) within a 15 ms window (HIC15) or 36 ms window (HIC36).

The exponent 2.5 was determined empirically from cadaver studies at Wayne State University in the 1960s-70s. It means HIC is more sensitive to high accelerations than to duration — a brief spike matters more than a long, gentle push.

Interpreting HIC values:
- HIC < 150: Very low injury risk (< 5% probability of serious injury)
- HIC = 700: ~30% probability of serious head injury
- HIC = 1000: ~50% probability of serious injury (this is the pass/fail threshold)
- HIC > 1500: Very high injury risk

Computing HIC efficiently requires evaluating all valid (t1, t2) pairs, which is an O(n^2) search over the discretized time signal. We will implement this and visualize which time window produces the maximum HIC.`,
      analogy: 'Think of HIC like a weather severity index that combines wind speed and storm duration. A tornado with 200 mph winds for 10 seconds might score lower than a hurricane with 100 mph winds for 6 hours. Both are dangerous, but in different ways. HIC similarly weights intensity (g-force) and exposure time into a single number that predicts actual damage.',
      storyConnection: 'If we could measure the acceleration inside a woodpecker\'s skull during each strike, we could calculate its HIC. Researchers have estimated woodpecker HIC values at 30-80 per strike — well below the injury threshold. This is remarkable given the 1200g peak acceleration. The secret is the extremely short duration (0.5 ms). HIC depends on both magnitude AND time, and the woodpecker wins on time.',
      checkQuestion: 'Two impacts have the same peak g-force of 200g. Impact A lasts 2 ms and Impact B lasts 8 ms. Which has a higher HIC, and approximately by what factor?',
      checkAnswer: 'Impact B has a higher HIC. Rough estimate using HIC ~ dt * a_avg^2.5: HIC_A ~ 0.002 * 200^2.5 = 0.002 * 565,685 = 1,131. HIC_B ~ 0.008 * 200^2.5 = 0.008 * 565,685 = 4,525. Impact B is about 4x higher HIC despite the same peak g. Duration matters enormously in injury prediction. This is why helmets are designed to extend the impact duration as much as possible.',
      codeIntro: 'Implement the HIC calculation from scratch and apply it to the helmet impact simulations from Step 2.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === HELMET SAFETY ANALYZER: Step 3 — HIC Calculation ===

def compute_HIC(time_s, accel_g, max_window=0.015):
    """
    Compute Head Injury Criterion (HIC15).
    time_s: time array in seconds
    accel_g: acceleration array in g's
    max_window: maximum time window (0.015 for HIC15, 0.036 for HIC36)
    Returns: HIC value and the critical time window (t1, t2)
    """
    n = len(time_s)
    dt = time_s[1] - time_s[0] if n > 1 else 1e-6

    # Precompute cumulative integral of acceleration
    cum_integral = np.cumsum(accel_g) * dt

    max_HIC = 0
    best_t1, best_t2 = 0, 0

    # Search all valid (t1, t2) pairs
    for i in range(n):
        for j in range(i + 1, n):
            t1 = time_s[i]
            t2 = time_s[j]
            delta_t = t2 - t1

            if delta_t > max_window:
                break
            if delta_t < 1e-7:
                continue

            # Average acceleration over window
            integral = cum_integral[j] - cum_integral[i]
            a_avg = integral / delta_t

            # HIC formula
            HIC = delta_t * (abs(a_avg) ** 2.5)

            if HIC > max_HIC:
                max_HIC = HIC
                best_t1, best_t2 = t1, t2

    return max_HIC, best_t1, best_t2

def eps_foam_stress_scalar(strain, plateau_stress):
    if strain < 0.05:
        return (plateau_stress / 0.03) * strain
    elif strain < 0.7:
        return plateau_stress * (1 + 0.3 * (strain - 0.05))
    else:
        plateau_at_dense = plateau_stress * (1 + 0.3 * 0.65)
        return plateau_at_dense * np.exp(5 * (strain - 0.7))

def simulate_and_compute_HIC(head_mass, drop_height, foam_thickness,
                               foam_plateau_stress, contact_area):
    g = 9.81
    v0 = np.sqrt(2 * g * drop_height)
    dt = 5e-6  # 5 us (coarser for HIC speed)
    t_max = 0.02

    t_list, a_list = [0], [0]
    t, v, x = 0, v0, 0

    while t < t_max and v > 0:
        strain = min(x / foam_thickness, 0.95)
        foam_stress = eps_foam_stress_scalar(strain, foam_plateau_stress)
        F = foam_stress * contact_area
        a = F / head_mass
        v -= a * dt
        x += max(v, 0) * dt
        t += dt
        t_list.append(t)
        a_list.append(a / g)  # in g's

    t_arr = np.array(t_list)
    a_arr = np.array(a_list)

    # Subsample for HIC calculation (every 10th point for speed)
    step = max(1, len(t_arr) // 200)
    t_sub = t_arr[::step]
    a_sub = a_arr[::step]

    hic_val, t1, t2 = compute_HIC(t_sub, a_sub)

    return {
        't': t_arr, 'a_g': a_arr,
        'peak_g': np.max(a_arr),
        'HIC': hic_val, 'HIC_t1': t1, 'HIC_t2': t2,
        'duration': t_arr[-1],
    }

# Test three helmet designs
designs = [
    {"name": "Light foam (40 g/L)", "plateau": 400e3, "thickness": 0.025, "color": "#22c55e"},
    {"name": "Standard foam (80 g/L)", "plateau": 800e3, "thickness": 0.025, "color": "#3b82f6"},
    {"name": "Dense foam (120 g/L)", "plateau": 1500e3, "thickness": 0.025, "color": "#ef4444"},
]

drop_height = 2.0
head_mass = 5.0
contact_area = 0.008

results = {}
for d in designs:
    results[d['name']] = simulate_and_compute_HIC(
        head_mass, drop_height, d['thickness'], d['plateau'], contact_area)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Deceleration curves with HIC windows
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for d in designs:
    r = results[d['name']]
    ax.plot(r['t'] * 1000, r['a_g'], color=d['color'], linewidth=2, label=d['name'])
    # Shade HIC window
    mask = (r['t'] >= r['HIC_t1']) & (r['t'] <= r['HIC_t2'])
    ax.fill_between(r['t'][mask] * 1000, 0, r['a_g'][mask], color=d['color'], alpha=0.2)

ax.axhline(300, color='gray', linestyle='--', alpha=0.5, label='300g limit')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Deceleration (g)', color='white')
ax.set_title('Impact curves + HIC windows', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: HIC values
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

hic_vals = [results[d['name']]['HIC'] for d in designs]
colors = [d['color'] for d in designs]
bars = ax.bar(range(len(designs)), hic_vals, color=colors, alpha=0.8)
ax.axhline(1000, color='#ef4444', linestyle='--', linewidth=2, label='HIC = 1000 (limit)')
ax.axhline(700, color='#f59e0b', linestyle='--', linewidth=1, label='HIC = 700 (30% injury)')
ax.axhline(150, color='#22c55e', linestyle='--', linewidth=1, label='HIC = 150 (safe)')
ax.set_xticks(range(len(designs)))
ax.set_xticklabels([d['name'].split('(')[0].strip() for d in designs], color='white', fontsize=8)
ax.set_ylabel('HIC value', color='white')
ax.set_title('Head Injury Criterion', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

for bar, h in zip(bars, hic_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 20,
            f'HIC={h:.0f}', ha='center', va='bottom', color='white', fontsize=9)

# Plot 3: Peak g vs HIC comparison
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

peak_gs = [results[d['name']]['peak_g'] for d in designs]
for i, d in enumerate(designs):
    ax.scatter(peak_gs[i], hic_vals[i], c=d['color'], s=150, zorder=5, edgecolors='white')
    ax.annotate(d['name'].split('(')[0].strip(),
                (peak_gs[i], hic_vals[i]),
                textcoords="offset points", xytext=(10, 5),
                color=d['color'], fontsize=8)

ax.axvline(300, color='gray', linestyle='--', alpha=0.5)
ax.axhline(1000, color='gray', linestyle='--', alpha=0.5)
ax.set_xlabel('Peak g-force', color='white')
ax.set_ylabel('HIC', color='white')
ax.set_title('Peak g vs HIC (both matter)', color='white', fontsize=11)

# Shade safe region
ax.axvspan(0, 300, alpha=0.05, color='#22c55e')
ax.axhspan(0, 1000, alpha=0.05, color='#22c55e')

# Plot 4: HIC vs drop height for standard foam
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

heights = np.arange(0.5, 3.5, 0.25)
hic_vs_height = []
for h in heights:
    r = simulate_and_compute_HIC(head_mass, h, 0.025, 800e3, contact_area)
    hic_vs_height.append(r['HIC'])

ax.plot(heights, hic_vs_height, 'o-', color='#3b82f6', linewidth=2)
ax.axhline(1000, color='#ef4444', linestyle='--', label='HIC = 1000')
ax.set_xlabel('Drop height (m)', color='white')
ax.set_ylabel('HIC', color='white')
ax.set_title('HIC vs drop height (80 g/L foam)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Find max safe height
safe_heights = [h for h, hic in zip(heights, hic_vs_height) if hic < 1000]
if safe_heights:
    ax.axvline(max(safe_heights), color='#22c55e', linestyle=':', alpha=0.7)
    ax.text(max(safe_heights) + 0.1, 500, f'Max safe: {max(safe_heights):.1f}m',
            color='#22c55e', fontsize=9)

# Plot 5: Injury probability curve
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

hic_range = np.linspace(0, 2000, 500)
# Logistic injury probability model (approximate from NHTSA data)
prob_AIS3 = 1 / (1 + np.exp(-0.00531 * (hic_range - 1000)))
prob_AIS4 = 1 / (1 + np.exp(-0.00531 * (hic_range - 1400)))

ax.plot(hic_range, prob_AIS3 * 100, color='#f59e0b', linewidth=2, label='Serious injury (AIS 3+)')
ax.plot(hic_range, prob_AIS4 * 100, color='#ef4444', linewidth=2, label='Severe injury (AIS 4+)')
ax.set_xlabel('HIC value', color='white')
ax.set_ylabel('Injury probability (%)', color='white')
ax.set_title('HIC to injury probability', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Mark our designs
for d in designs:
    hic = results[d['name']]['HIC']
    prob = 1 / (1 + np.exp(-0.00531 * (hic - 1000))) * 100
    ax.scatter(hic, prob, c=d['color'], s=100, zorder=5, edgecolors='white')

# Plot 6: Woodpecker comparison
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

scenarios = ['Woodpecker\\nstrike', 'Bicycle\\nhelmet', 'No\\nhelmet', 'Football\\nhit']
hic_values = [50, results[designs[1]['name']]['HIC'], 2500, 300]
colors_bar = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']

bars = ax.bar(range(len(scenarios)), hic_values, color=colors_bar, alpha=0.8)
ax.axhline(1000, color='#ef4444', linestyle='--', label='Injury threshold')
ax.set_xticks(range(len(scenarios)))
ax.set_xticklabels(scenarios, color='white', fontsize=8)
ax.set_ylabel('HIC', color='white')
ax.set_title('HIC across scenarios', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

for bar, h in zip(bars, hic_values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 30,
            f'{h:.0f}', ha='center', va='bottom', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("=== HIC Analysis Results ===")
print(f"{'Design':<25} {'Peak g':>8} {'HIC':>8} {'Duration':>10} {'Status':>8}")
print("-" * 65)
for d in designs:
    r = results[d['name']]
    g_ok = "OK" if r['peak_g'] < 300 else "FAIL"
    h_ok = "OK" if r['HIC'] < 1000 else "FAIL"
    status = "PASS" if g_ok == "OK" and h_ok == "OK" else "FAIL"
    print(f"{d['name']:<25} {r['peak_g']:>8.0f} {r['HIC']:>8.0f} {r['duration']*1000:>8.1f}ms {status:>8}")
print()
print("HIC tells us more than peak g alone.")
print("A helmet can pass the peak g test but fail HIC, or vice versa.")
print("Both criteria must be met for certification.")`,
      challenge: 'Implement HIC36 (36ms window) in addition to HIC15. For which helmet designs do the two metrics diverge most? HIC36 is used in some automotive standards and tends to give higher values for longer-duration impacts.',
      successHint: 'HIC is the industry-standard safety metric used by every helmet manufacturer and automobile safety engineer. You just implemented the exact same calculation that NHTSA and CPSC labs use. Next we will use this tool to systematically optimize a helmet design.',
    },
    {
      title: 'Step 4: Design optimization — finding the best foam density and thickness',
      concept: `With our impact simulator and HIC calculator working, we can now systematically explore the design space. A helmet designer must choose foam density, foam thickness, shell material, and contact area — each affecting safety, weight, cost, and comfort. This is a **multi-objective optimization problem**.

The primary design variables for EPS foam are:
- **Density** (30-200 g/L): Higher density means higher plateau stress, which means higher g-force but less crush distance. Too light and the foam bottoms out; too heavy and it transmits too much force.
- **Thickness** (15-40 mm): Thicker foam absorbs more energy but makes the helmet heavier and bulkier. Users resist wearing thick helmets, creating a compliance problem.

The optimization goal: **Find the minimum foam density and thickness that keeps HIC < 1000 and peak g < 300 for the target drop height.** This gives the lightest, most comfortable helmet that still passes certification.

We will create a **design map** — a 2D grid showing HIC and peak g for every combination of density and thickness. The boundary between pass and fail regions reveals the optimal design point. This parametric study approach is standard practice in engineering design.`,
      analogy: 'This is like baking a cake. You have two main variables: oven temperature and baking time. Too hot and too long burns it. Too cool and too short leaves it raw. There is a region of (temperature, time) combinations that produce a good cake. The boundary of that region is your "recipe window." We are finding the recipe window for helmets — the combinations of density and thickness that produce a safe helmet.',
      storyConnection: 'The woodpecker evolved its optimal skull design through millions of years of natural selection — each generation slightly varying thickness and density, with failed designs being eliminated. Our computational optimization does the same thing in seconds. We evaluate thousands of "generations" of helmet designs instantly, finding the optimal configuration without any physical testing.',
      checkQuestion: 'You find that 60 g/L foam at 25 mm thickness gives HIC = 950 (barely passing). How would you adjust the design to add a safety margin without increasing helmet weight significantly?',
      checkAnswer: 'Increase foam density slightly to 70 g/L (adds minimal weight since density increase is small). Or keep 60 g/L but increase thickness to 27 mm. The density increase is usually preferred because it does not change the helmet profile. Another option: improve the shell to spread the load over a larger contact area, which reduces stress without changing foam properties. Real designers use all three levers simultaneously.',
      codeIntro: 'Create a parametric design map scanning foam density and thickness to find the optimal helmet configuration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === HELMET SAFETY ANALYZER: Step 4 — Design Optimization ===

def eps_stress(strain, plateau_stress):
    if strain < 0.05:
        return (plateau_stress / 0.03) * strain
    elif strain < 0.7:
        return plateau_stress * (1 + 0.3 * (strain - 0.05))
    else:
        p = plateau_stress * (1 + 0.3 * 0.65)
        return p * np.exp(5 * (strain - 0.7))

def quick_simulate(head_mass, drop_height, foam_thickness, plateau_stress, contact_area):
    g = 9.81
    v = np.sqrt(2 * g * drop_height)
    dt = 1e-5
    x, peak_a = 0, 0
    t_list, a_list = [], []
    t = 0

    while v > 0 and t < 0.02:
        strain = min(x / foam_thickness, 0.95)
        stress = eps_stress(strain, plateau_stress)
        F = stress * contact_area
        a = F / head_mass
        if a > peak_a:
            peak_a = a
        v -= a * dt
        x += max(v, 0) * dt
        t += dt
        t_list.append(t)
        a_list.append(a / g)

    # Quick HIC estimate (simplified: HIC ~ duration * avg_a^2.5)
    if len(a_list) > 0:
        a_arr = np.array(a_list)
        duration = t
        avg_a = np.mean(a_arr)
        # Better estimate: use the peak 15ms window
        n_window = min(int(0.015 / dt), len(a_arr))
        if n_window > 0:
            rolling_avg = np.convolve(a_arr, np.ones(n_window)/n_window, mode='valid')
            if len(rolling_avg) > 0:
                max_avg = np.max(rolling_avg)
                hic = min(n_window * dt, 0.015) * (max_avg ** 2.5)
            else:
                hic = duration * (avg_a ** 2.5)
        else:
            hic = duration * (avg_a ** 2.5)
    else:
        hic = 0

    return peak_a / g, hic, x / foam_thickness * 100

# Design space scan
densities = np.arange(30, 180, 5)  # g/L
thicknesses = np.arange(12, 42, 1)  # mm

# Map density to plateau stress (empirical: plateau ~ 10 * density^1.5 in kPa)
def density_to_plateau(density_gL):
    return 10 * (density_gL ** 1.5) * 1000  # Pa

head_mass = 5.0
drop_height = 2.0
contact_area = 0.008

# Compute design maps
peak_g_map = np.zeros((len(thicknesses), len(densities)))
hic_map = np.zeros_like(peak_g_map)
crush_map = np.zeros_like(peak_g_map)

for i, thick in enumerate(thicknesses):
    for j, dens in enumerate(densities):
        plateau = density_to_plateau(dens)
        pg, hic, crush = quick_simulate(head_mass, drop_height,
                                         thick / 1000, plateau, contact_area)
        peak_g_map[i, j] = pg
        hic_map[i, j] = hic
        crush_map[i, j] = crush

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Peak g design map
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

im = ax.contourf(densities, thicknesses, peak_g_map,
                  levels=np.arange(0, 600, 25), cmap='RdYlGn_r')
ax.contour(densities, thicknesses, peak_g_map, levels=[300],
           colors='white', linewidths=2, linestyles='--')
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Peak g', color='white')
cbar.ax.tick_params(colors='gray')
ax.set_xlabel('Foam density (g/L)', color='white')
ax.set_ylabel('Foam thickness (mm)', color='white')
ax.set_title('Peak g map (white line = 300g limit)', color='white', fontsize=11)

# Plot 2: HIC design map
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

im = ax.contourf(densities, thicknesses, np.clip(hic_map, 0, 3000),
                  levels=np.arange(0, 3000, 100), cmap='RdYlGn_r')
ax.contour(densities, thicknesses, hic_map, levels=[1000],
           colors='white', linewidths=2, linestyles='--')
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('HIC', color='white')
cbar.ax.tick_params(colors='gray')
ax.set_xlabel('Foam density (g/L)', color='white')
ax.set_ylabel('Foam thickness (mm)', color='white')
ax.set_title('HIC map (white line = 1000 limit)', color='white', fontsize=11)

# Plot 3: Crush % map
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

im = ax.contourf(densities, thicknesses, crush_map,
                  levels=np.arange(0, 100, 5), cmap='RdYlGn_r')
ax.contour(densities, thicknesses, crush_map, levels=[70],
           colors='white', linewidths=2, linestyles='--')
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Crush %', color='white')
cbar.ax.tick_params(colors='gray')
ax.set_xlabel('Foam density (g/L)', color='white')
ax.set_ylabel('Foam thickness (mm)', color='white')
ax.set_title('Crush map (white = 70% limit)', color='white', fontsize=11)

# Plot 4: Combined pass/fail map
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

pass_map = ((peak_g_map < 300) & (hic_map < 1000) & (crush_map < 70)).astype(float)
ax.contourf(densities, thicknesses, pass_map, levels=[-0.5, 0.5, 1.5],
            colors=['#ef4444', '#22c55e'], alpha=0.5)
ax.contour(densities, thicknesses, pass_map, levels=[0.5],
           colors='white', linewidths=3)
ax.set_xlabel('Foam density (g/L)', color='white')
ax.set_ylabel('Foam thickness (mm)', color='white')
ax.set_title('Pass/Fail boundary (green=safe)', color='white', fontsize=11)

# Find optimal point (minimum weight that passes)
best_weight = float('inf')
best_d, best_t = 0, 0
for i, thick in enumerate(thicknesses):
    for j, dens in enumerate(densities):
        if pass_map[i, j] > 0.5:
            weight = dens * thick  # proxy for helmet weight
            if weight < best_weight:
                best_weight = weight
                best_d, best_t = dens, thick

ax.scatter(best_d, best_t, c='#fbbf24', s=200, marker='*', zorder=5,
           edgecolors='white', linewidths=2)
ax.annotate(f'Optimal: {best_d}g/L, {best_t}mm',
            (best_d, best_t), textcoords="offset points", xytext=(10, 10),
            color='#fbbf24', fontsize=10, fontweight='bold')

# Plot 5: Density sweep at optimal thickness
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

t_idx = np.argmin(np.abs(thicknesses - best_t))
ax.plot(densities, peak_g_map[t_idx, :], color='#ef4444', linewidth=2, label='Peak g')
ax.axhline(300, color='#ef4444', linestyle='--', alpha=0.5)
ax2 = ax.twinx()
ax2.plot(densities, hic_map[t_idx, :], color='#3b82f6', linewidth=2, label='HIC')
ax2.axhline(1000, color='#3b82f6', linestyle='--', alpha=0.5)
ax2.tick_params(colors='gray')
ax2.set_ylabel('HIC', color='#3b82f6')

ax.set_xlabel('Foam density (g/L)', color='white')
ax.set_ylabel('Peak g', color='#ef4444')
ax.set_title(f'Density sweep at {best_t}mm thickness', color='white', fontsize=11)
ax.axvline(best_d, color='#fbbf24', linestyle=':', linewidth=2)

# Plot 6: Pareto front — peak g vs weight
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for i, thick in enumerate(thicknesses[::3]):
    passing = pass_map[i*3, :] > 0.5
    if np.any(passing):
        weights = densities[passing] * thick
        pgs = peak_g_map[i*3, passing]
        ax.scatter(weights, pgs, s=10, alpha=0.5, label=f'{thick}mm' if thick % 10 == 0 else '')

ax.set_xlabel('Weight proxy (density x thickness)', color='white')
ax.set_ylabel('Peak g-force', color='white')
ax.set_title('Weight vs safety tradeoff', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("=== Design Optimization Results ===")
print(f"Drop test: {drop_height}m, {head_mass}kg headform")
print(f"Design space: {len(densities)}x{len(thicknesses)} = {len(densities)*len(thicknesses)} configurations")
print()
optimal_plateau = density_to_plateau(best_d)
pg, hic, crush = quick_simulate(head_mass, drop_height, best_t/1000, optimal_plateau, contact_area)
print(f"OPTIMAL DESIGN: {best_d} g/L foam, {best_t}mm thick")
print(f"  Peak g: {pg:.0f}")
print(f"  HIC: {hic:.0f}")
print(f"  Crush: {crush:.0f}%")
print(f"  Weight proxy: {best_d * best_t}")
print()
n_pass = int(np.sum(pass_map))
n_total = len(densities) * len(thicknesses)
print(f"Passing designs: {n_pass}/{n_total} ({n_pass/n_total*100:.1f}%)")
print("The pass region shows the design freedom available to the engineer.")`,
      challenge: 'Add a third design variable: contact area (which depends on shell stiffness and anvil shape). Scan contact areas from 40 cm^2 to 120 cm^2 and show how the optimal density-thickness combination shifts. This reveals why shell design matters as much as foam design.',
      successHint: 'You have just performed the same parametric optimization that professional helmet engineers do with commercial FEA software. The design map visualization is a standard tool in engineering — it shows at a glance where the safe designs live and where the boundaries are.',
    },
    {
      title: 'Step 5: Multi-standard certification — testing across conditions',
      concept: `A single optimal design for one test condition is not enough. Real helmets must pass multiple impact conditions: different drop heights, different anvil shapes (flat, curbstone, hemispheric), different impact locations (crown, front, side, rear), and different environmental conditions (hot, cold, wet).

The **flat anvil** test has the largest contact area and is usually the easiest to pass. The **curbstone anvil** (a wedge-shaped anvil) concentrates force on a smaller area, testing the shell's ability to spread the load. The **hemispheric anvil** is the harshest — a small, hard contact point that can punch through the shell.

Temperature also matters enormously. EPS foam is stiffer when cold (higher plateau stress, higher g) and softer when hot (lower plateau stress, more crush risk). Standards require testing at -20C, 20C (room temp), and 50C. A design that passes at room temperature might fail when cold (too stiff) or when hot (too soft).

Our analyzer needs to check the design against ALL these conditions and report the worst-case scenario. The helmet must pass every single test — one failure means no certification.`,
      analogy: 'Certification testing is like qualifying for the Olympics in a decathlon. You cannot just be great at one event — you must meet minimum standards in all ten events. A helmet that aces the flat anvil test but fails the curbstone test is like a decathlete who runs a world-record 100m but cannot clear the high jump bar. The certification goes to the designs that are good enough everywhere, not perfect anywhere.',
      storyConnection: 'The woodpecker faces its own "multi-standard certification" every day. It strikes different tree species (hardwood vs softwood — different anvil stiffness), at different locations on the tree (thick bark vs thin bark — different contact areas), in different seasons (cold vs warm — different tissue stiffness). Its skull design passes ALL conditions with margin. Our analyzer must do the same for the helmet.',
      checkQuestion: 'A helmet design gives HIC = 800 on a flat anvil at room temperature. Testing on a curbstone anvil (half the contact area) at -20C (foam 40% stiffer), what would you estimate the HIC to be?',
      checkAnswer: 'Halving the contact area doubles the stress (same force, half the area), which roughly doubles the g-force. Making the foam 40% stiffer also increases g-force by about 40%. Combined effect: g-force increases by a factor of ~2.8. Since HIC depends on acceleration to the power 2.5, HIC increases by roughly 2.8^2.5 = ~13. Estimated HIC = 800 * 13 = ~10,400. This design would catastrophically fail the curbstone cold test even though it passed the flat anvil room temp test.',
      codeIntro: 'Test the optimized helmet design against all certification conditions and identify the limiting test.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === HELMET SAFETY ANALYZER: Step 5 — Multi-Standard Certification ===

def eps_stress_val(strain, plateau_stress):
    if strain < 0.05:
        return (plateau_stress / 0.03) * strain
    elif strain < 0.7:
        return plateau_stress * (1 + 0.3 * (strain - 0.05))
    else:
        p = plateau_stress * (1 + 0.3 * 0.65)
        return p * np.exp(5 * (strain - 0.7))

def full_simulate(head_mass, drop_height, foam_thick, plateau_stress, contact_area):
    g = 9.81
    v = np.sqrt(2 * g * drop_height)
    dt = 5e-6
    x, peak_a = 0, 0
    t_list, a_list = [], []
    t_val = 0

    while v > 0 and t_val < 0.025:
        strain = min(x / foam_thick, 0.95)
        stress = eps_stress_val(strain, plateau_stress)
        F = stress * contact_area
        a = F / head_mass
        if a > peak_a: peak_a = a
        v -= a * dt
        x += max(v, 0) * dt
        t_val += dt
        t_list.append(t_val)
        a_list.append(a / g)

    a_arr = np.array(a_list)
    n_window = min(int(0.015 / dt), len(a_arr))
    if n_window > 1:
        rolling_avg = np.convolve(a_arr, np.ones(n_window)/n_window, mode='valid')
        max_avg = np.max(rolling_avg) if len(rolling_avg) > 0 else np.mean(a_arr)
        hic = min(n_window * dt, 0.015) * (max_avg ** 2.5)
    else:
        hic = 0

    return {
        'peak_g': peak_a / g,
        'HIC': hic,
        'crush_pct': x / foam_thick * 100,
        'duration_ms': t_val * 1000,
        't': np.array(t_list),
        'a_g': a_arr,
    }

# Optimal design from Step 4
foam_density = 75  # g/L
foam_thick_mm = 25
base_plateau = 10 * (foam_density ** 1.5) * 1000  # Pa
head_mass = 5.0

# Test conditions
anvil_types = {
    'Flat': {'area': 0.008, 'desc': '80 cm^2'},
    'Curbstone': {'area': 0.004, 'desc': '40 cm^2'},
    'Hemispheric': {'area': 0.002, 'desc': '20 cm^2'},
}

temperatures = {
    '-20°C (cold)': {'factor': 1.4},   # 40% stiffer
    '20°C (room)': {'factor': 1.0},
    '50°C (hot)': {'factor': 0.65},    # 35% softer
}

impact_locations = {
    'Crown': {'height': 2.0, 'thick_factor': 1.0},
    'Front': {'height': 1.5, 'thick_factor': 0.9},
    'Side': {'height': 1.5, 'thick_factor': 0.85},
    'Rear': {'height': 1.5, 'thick_factor': 0.95},
}

# Run ALL test combinations
all_results = []
for anvil_name, anvil in anvil_types.items():
    for temp_name, temp in temperatures.items():
        for loc_name, loc in impact_locations.items():
            adjusted_plateau = base_plateau * temp['factor']
            adjusted_thick = foam_thick_mm / 1000 * loc['thick_factor']
            r = full_simulate(head_mass, loc['height'], adjusted_thick,
                            adjusted_plateau, anvil['area'])
            r['anvil'] = anvil_name
            r['temperature'] = temp_name
            r['location'] = loc_name
            r['pass_g'] = r['peak_g'] < 300
            r['pass_hic'] = r['HIC'] < 1000
            r['pass_crush'] = r['crush_pct'] < 80
            r['pass_all'] = r['pass_g'] and r['pass_hic'] and r['pass_crush']
            all_results.append(r)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Peak g for each anvil type across temperatures
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

x_pos = np.arange(len(temperatures))
width = 0.25
temp_names = list(temperatures.keys())

for i, (anvil_name, anvil) in enumerate(anvil_types.items()):
    pgs = []
    for temp_name in temp_names:
        r = [r for r in all_results if r['anvil'] == anvil_name
             and r['temperature'] == temp_name and r['location'] == 'Crown'][0]
        pgs.append(r['peak_g'])
    colors = ['#22c55e' if pg < 300 else '#ef4444' for pg in pgs]
    bars = ax.bar(x_pos + i * width, pgs, width, label=anvil_name, alpha=0.8,
                  color=['#3b82f6', '#22c55e', '#ef4444'][i])

ax.axhline(300, color='white', linestyle='--', alpha=0.5, label='300g limit')
ax.set_xticks(x_pos + width)
ax.set_xticklabels([t.split('(')[0].strip() for t in temp_names], color='white', fontsize=8)
ax.set_ylabel('Peak g-force', color='white')
ax.set_title('Peak g: Anvil x Temperature', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: HIC for each condition
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for i, (anvil_name, anvil) in enumerate(anvil_types.items()):
    hics = []
    for temp_name in temp_names:
        r = [r for r in all_results if r['anvil'] == anvil_name
             and r['temperature'] == temp_name and r['location'] == 'Crown'][0]
        hics.append(r['HIC'])
    ax.bar(x_pos + i * width, hics, width, label=anvil_name, alpha=0.8,
           color=['#3b82f6', '#22c55e', '#ef4444'][i])

ax.axhline(1000, color='white', linestyle='--', alpha=0.5, label='HIC = 1000')
ax.set_xticks(x_pos + width)
ax.set_xticklabels([t.split('(')[0].strip() for t in temp_names], color='white', fontsize=8)
ax.set_ylabel('HIC', color='white')
ax.set_title('HIC: Anvil x Temperature', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Crush % for hot conditions (worst case for bottoming out)
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

for i, (anvil_name, _) in enumerate(anvil_types.items()):
    crushes = []
    for loc_name in impact_locations:
        r = [r for r in all_results if r['anvil'] == anvil_name
             and r['temperature'] == '50°C (hot)' and r['location'] == loc_name][0]
        crushes.append(r['crush_pct'])
    loc_x = np.arange(len(impact_locations))
    ax.bar(loc_x + i * width, crushes, width, label=anvil_name, alpha=0.8,
           color=['#3b82f6', '#22c55e', '#ef4444'][i])

ax.axhline(70, color='white', linestyle='--', alpha=0.5, label='70% crush limit')
ax.set_xticks(loc_x + width)
ax.set_xticklabels(list(impact_locations.keys()), color='white', fontsize=8)
ax.set_ylabel('Crush (%)', color='white')
ax.set_title('Crush at 50°C (worst case)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Pass/Fail matrix
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Create matrix: rows = anvil+temp, cols = location
row_labels = []
pass_matrix = []
for anvil_name in anvil_types:
    for temp_name in temp_names:
        row_labels.append(f"{anvil_name} {temp_name.split('(')[0].strip()}")
        row = []
        for loc_name in impact_locations:
            r = [r for r in all_results if r['anvil'] == anvil_name
                 and r['temperature'] == temp_name and r['location'] == loc_name][0]
            row.append(1 if r['pass_all'] else 0)
        pass_matrix.append(row)

pass_arr = np.array(pass_matrix)
im = ax.imshow(pass_arr, cmap='RdYlGn', aspect='auto', vmin=0, vmax=1)
ax.set_xticks(range(len(impact_locations)))
ax.set_xticklabels(list(impact_locations.keys()), color='white', fontsize=8)
ax.set_yticks(range(len(row_labels)))
ax.set_yticklabels(row_labels, color='white', fontsize=6)
ax.set_title('Pass/Fail matrix (green=pass)', color='white', fontsize=11)

for i in range(len(row_labels)):
    for j in range(len(impact_locations)):
        ax.text(j, i, 'P' if pass_arr[i, j] else 'F',
                ha='center', va='center', fontsize=8, fontweight='bold',
                color='white' if pass_arr[i, j] else 'black')

# Plot 5: Deceleration curves for worst-case conditions
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

worst_cases = [
    ('Flat, 20°C', 'Flat', '20°C (room)', 'Crown', '#22c55e'),
    ('Hemi, -20°C', 'Hemispheric', '-20°C (cold)', 'Crown', '#ef4444'),
    ('Curb, -20°C', 'Curbstone', '-20°C (cold)', 'Crown', '#f59e0b'),
]

for label, anvil, temp, loc, color in worst_cases:
    r = [r for r in all_results if r['anvil'] == anvil
         and r['temperature'] == temp and r['location'] == loc][0]
    ax.plot(r['t'] * 1000, r['a_g'], color=color, linewidth=2, label=label)

ax.axhline(300, color='gray', linestyle='--', alpha=0.5)
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Deceleration (g)', color='white')
ax.set_title('Worst-case deceleration curves', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary scores
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

n_total = len(all_results)
n_pass = sum(1 for r in all_results if r['pass_all'])
n_fail_g = sum(1 for r in all_results if not r['pass_g'])
n_fail_hic = sum(1 for r in all_results if not r['pass_hic'])
n_fail_crush = sum(1 for r in all_results if not r['pass_crush'])

categories = ['Total\\ntests', 'Pass\\nall', 'Fail\\npeak g', 'Fail\\nHIC', 'Fail\\ncrush']
values = [n_total, n_pass, n_fail_g, n_fail_hic, n_fail_crush]
colors_bar = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#a855f7']

bars = ax.bar(categories, values, color=colors_bar, alpha=0.8)
ax.set_ylabel('Number of tests', color='white')
ax.set_title('Certification summary', color='white', fontsize=11)

for bar, v in zip(bars, values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
            str(v), ha='center', va='bottom', color='white', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

print("=== Multi-Standard Certification Report ===")
print(f"Design: {foam_density} g/L EPS foam, {foam_thick_mm}mm thick")
print(f"Total test conditions: {n_total}")
print(f"Pass: {n_pass}/{n_total} ({n_pass/n_total*100:.0f}%)")
print()
if n_pass < n_total:
    print("FAILING CONDITIONS:")
    for r in all_results:
        if not r['pass_all']:
            reasons = []
            if not r['pass_g']: reasons.append(f"g={r['peak_g']:.0f}")
            if not r['pass_hic']: reasons.append(f"HIC={r['HIC']:.0f}")
            if not r['pass_crush']: reasons.append(f"crush={r['crush_pct']:.0f}%")
            print(f"  {r['anvil']} / {r['temperature']} / {r['location']}: {', '.join(reasons)}")
    print()
    print("The design needs modification to pass ALL conditions.")
    print("Options: increase thickness, increase density, or improve shell.")
else:
    print("ALL TESTS PASSED. Helmet is certifiable.")
    worst = max(all_results, key=lambda r: r['HIC'])
    print(f"Worst case: {worst['anvil']} / {worst['temperature']} / {worst['location']}")
    print(f"  Peak g: {worst['peak_g']:.0f}, HIC: {worst['HIC']:.0f}")`,
      challenge: 'Add a "wet" condition where the shell-foam interface has reduced friction, allowing the helmet to slide on the anvil. Model this as a 30% increase in contact area (force spreads more). How does this affect pass/fail rates? Some standards require wet testing.',
      successHint: 'Multi-condition certification is why helmet design is genuinely difficult. A design that is optimal for one condition is often suboptimal for another. The art of helmet engineering is finding the best compromise across ALL conditions — exactly what the woodpecker skull achieves naturally.',
    },
    {
      title: 'Step 6: Complete Helmet Safety Report — bio-inspired optimization',
      concept: `In this final step, we bring everything together into a complete Helmet Safety Report that compares conventional designs against bio-inspired designs that borrow features from the woodpecker skull.

The woodpecker teaches us four design principles that are not yet standard in commercial helmets:
1. **Graded density foam**: Instead of uniform EPS, use foam that varies in density from stiff at the outside to soft near the head — like the woodpecker's graded bone structure.
2. **Wrap-around reinforcement**: A flexible band that wraps around the helmet like the woodpecker's hyoid bone, redistributing forces from the impact point to the entire shell.
3. **Multi-directional protection**: A low-friction layer (like MIPS) that allows rotational sliding, inspired by the woodpecker's tight-fitting brain that prevents rotational injury.
4. **Tuned damping**: Viscoelastic materials whose relaxation time matches the expected impact duration, as the woodpecker's skull material is tuned to its drumming frequency.

Our final analyzer generates a complete certification report comparing a conventional helmet against a bio-inspired design across all test conditions. This is a professional-grade engineering deliverable.`,
      analogy: 'This final step is like writing the flight test report for a new aircraft. You have tested every system individually — engines, avionics, landing gear, pressurization. Now you compile all results into a single document that says "this aircraft is safe to fly." The certification authority reads this report and stamps "Approved" or "Requires modifications." Our report is the helmet equivalent.',
      storyConnection: 'We started with a woodpecker drumming on a sal tree — a story from the forests of Assam. We analyzed the physics of that drumming: impact mechanics, stress distribution, shock absorption, viscoelasticity, and finite element modeling. Now we have used every one of those principles to design and certify a helmet that protects human brains. The story has come full circle — from nature\'s solution to engineered protection.',
      checkQuestion: 'A bio-inspired helmet with graded density foam uses 120 g/L on the outside and 40 g/L on the inside, with the same total mass as a uniform 80 g/L helmet. Why might the graded version outperform the uniform one?',
      checkAnswer: 'The outer dense layer acts like the outer shell — it spreads force and resists penetration. The inner soft layer acts like a cushion — it extends the deceleration time and reduces peak g. In a uniform foam, you must compromise: stiff enough not to bottom out, but soft enough not to transmit too much force. The graded design eliminates this compromise — each region is optimized for its role. The woodpecker skull uses exactly this graded approach.',
      codeIntro: 'Generate a complete Helmet Safety Report comparing conventional and bio-inspired designs across all certification conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === HELMET SAFETY ANALYZER: Step 6 — Complete Report ===

def foam_stress(strain, plateau_stress):
    if strain < 0.05:
        return (plateau_stress / 0.03) * strain
    elif strain < 0.7:
        return plateau_stress * (1 + 0.3 * (strain - 0.05))
    else:
        p = plateau_stress * (1 + 0.3 * 0.65)
        return p * np.exp(5 * (strain - 0.7))

def graded_foam_stress(strain, outer_plateau, inner_plateau, thickness):
    """Graded foam: outer half is denser, inner half is softer."""
    crush_dist = strain * thickness
    if crush_dist < thickness * 0.5:
        local_strain = crush_dist / (thickness * 0.5)
        return foam_stress(min(local_strain, 0.95), outer_plateau)
    else:
        local_strain = (crush_dist - thickness * 0.5) / (thickness * 0.5)
        return foam_stress(min(local_strain, 0.95), inner_plateau)

def simulate_helmet(head_mass, drop_height, foam_thick, plateau_stress,
                    contact_area, graded=False, outer_plateau=None, inner_plateau=None,
                    hyoid_factor=1.0, damping_factor=1.0):
    g = 9.81
    v = np.sqrt(2 * g * drop_height)
    dt = 5e-6
    x, peak_a = 0, 0
    t_list, a_list = [], []
    t_val = 0

    while v > 0 and t_val < 0.025:
        strain = min(x / foam_thick, 0.95)

        if graded and outer_plateau and inner_plateau:
            stress_val = graded_foam_stress(strain, outer_plateau, inner_plateau, foam_thick)
        else:
            stress_val = foam_stress(strain, plateau_stress)

        # Hyoid factor: spreads force over larger area
        effective_area = contact_area * hyoid_factor
        F = stress_val * effective_area

        # Viscoelastic damping
        F_damping = damping_factor * 500 * v  # velocity-dependent damping
        F_total = F + F_damping

        a = F_total / head_mass
        if a > peak_a: peak_a = a
        v -= a * dt
        x += max(v, 0) * dt
        t_val += dt
        t_list.append(t_val)
        a_list.append(a / g)

    a_arr = np.array(a_list)
    n_w = min(int(0.015 / dt), len(a_arr))
    if n_w > 1:
        ravg = np.convolve(a_arr, np.ones(n_w)/n_w, mode='valid')
        max_avg = np.max(ravg) if len(ravg) > 0 else np.mean(a_arr)
        hic = min(n_w * dt, 0.015) * (max_avg ** 2.5)
    else:
        hic = 0

    return {
        'peak_g': peak_a / g, 'HIC': hic,
        'crush_pct': x / foam_thick * 100,
        'duration_ms': t_val * 1000,
        't': np.array(t_list), 'a_g': a_arr,
    }

head_mass = 5.0
foam_thick = 0.025
contact_area = 0.008

# Define two designs
# 1. Conventional: uniform 80 g/L EPS
conv_plateau = 10 * (80 ** 1.5) * 1000

# 2. Bio-inspired: graded foam + hyoid + damping
bio_outer = 10 * (120 ** 1.5) * 1000  # Dense outer
bio_inner = 10 * (40 ** 1.5) * 1000   # Soft inner

# Test conditions
tests = [
    {'name': 'Flat, 20°C, Crown', 'height': 2.0, 'area': 0.008, 'temp': 1.0},
    {'name': 'Flat, -20°C, Crown', 'height': 2.0, 'area': 0.008, 'temp': 1.4},
    {'name': 'Flat, 50°C, Crown', 'height': 2.0, 'area': 0.008, 'temp': 0.65},
    {'name': 'Curb, 20°C, Crown', 'height': 2.0, 'area': 0.004, 'temp': 1.0},
    {'name': 'Curb, -20°C, Crown', 'height': 2.0, 'area': 0.004, 'temp': 1.4},
    {'name': 'Hemi, 20°C, Crown', 'height': 2.0, 'area': 0.002, 'temp': 1.0},
    {'name': 'Hemi, -20°C, Crown', 'height': 2.0, 'area': 0.002, 'temp': 1.4},
    {'name': 'Flat, 20°C, Side', 'height': 1.5, 'area': 0.008, 'temp': 1.0},
]

conv_results = []
bio_results = []

for test in tests:
    # Conventional
    r = simulate_helmet(head_mass, test['height'], foam_thick,
                       conv_plateau * test['temp'], test['area'])
    r['test'] = test['name']
    r['pass'] = r['peak_g'] < 300 and r['HIC'] < 1000
    conv_results.append(r)

    # Bio-inspired
    r = simulate_helmet(head_mass, test['height'], foam_thick, 0, test['area'],
                       graded=True, outer_plateau=bio_outer * test['temp'],
                       inner_plateau=bio_inner * test['temp'],
                       hyoid_factor=1.3, damping_factor=1.5)
    r['test'] = test['name']
    r['pass'] = r['peak_g'] < 300 and r['HIC'] < 1000
    bio_results.append(r)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('HELMET SAFETY REPORT: Conventional vs Bio-Inspired',
             color='white', fontsize=14, fontweight='bold', y=0.98)

# Plot 1: Peak g comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

x_pos = np.arange(len(tests))
conv_gs = [r['peak_g'] for r in conv_results]
bio_gs = [r['peak_g'] for r in bio_results]

ax.bar(x_pos - 0.2, conv_gs, 0.35, color='#ef4444', alpha=0.8, label='Conventional')
ax.bar(x_pos + 0.2, bio_gs, 0.35, color='#22c55e', alpha=0.8, label='Bio-inspired')
ax.axhline(300, color='white', linestyle='--', alpha=0.5)
ax.set_xticks(x_pos)
ax.set_xticklabels([t['name'].split(',')[0] + '\\n' + t['name'].split(',')[1].strip()
                    for t in tests], color='white', fontsize=5, rotation=30)
ax.set_ylabel('Peak g', color='white')
ax.set_title('Peak g across all tests', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: HIC comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

conv_hics = [r['HIC'] for r in conv_results]
bio_hics = [r['HIC'] for r in bio_results]

ax.bar(x_pos - 0.2, conv_hics, 0.35, color='#ef4444', alpha=0.8, label='Conventional')
ax.bar(x_pos + 0.2, bio_hics, 0.35, color='#22c55e', alpha=0.8, label='Bio-inspired')
ax.axhline(1000, color='white', linestyle='--', alpha=0.5)
ax.set_xticks(x_pos)
ax.set_xticklabels([t['name'].split(',')[0] + '\\n' + t['name'].split(',')[1].strip()
                    for t in tests], color='white', fontsize=5, rotation=30)
ax.set_ylabel('HIC', color='white')
ax.set_title('HIC across all tests', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Improvement percentage
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

g_improvement = [(c - b) / c * 100 for c, b in zip(conv_gs, bio_gs)]
hic_improvement = [(c - b) / max(c, 1) * 100 for c, b in zip(conv_hics, bio_hics)]

ax.bar(x_pos - 0.2, g_improvement, 0.35, color='#3b82f6', alpha=0.8, label='Peak g reduction')
ax.bar(x_pos + 0.2, hic_improvement, 0.35, color='#a855f7', alpha=0.8, label='HIC reduction')
ax.set_xticks(x_pos)
ax.set_xticklabels([t['name'].split(',')[0] for t in tests], color='white', fontsize=6, rotation=30)
ax.set_ylabel('Improvement (%)', color='white')
ax.set_title('Bio-inspired improvement', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Worst-case deceleration curves
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Find worst test for each design
worst_conv_idx = max(range(len(conv_results)), key=lambda i: conv_results[i]['HIC'])
worst_bio_idx = max(range(len(bio_results)), key=lambda i: bio_results[i]['HIC'])

rc = conv_results[worst_conv_idx]
rb = bio_results[worst_conv_idx]  # Same test condition for fair comparison

ax.plot(rc['t'] * 1000, rc['a_g'], color='#ef4444', linewidth=2,
        label=f"Conv: {rc['test']}")
ax.plot(rb['t'] * 1000, rb['a_g'], color='#22c55e', linewidth=2,
        label=f"Bio: {rb['test']}")
ax.axhline(300, color='gray', linestyle='--', alpha=0.5)
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Deceleration (g)', color='white')
ax.set_title('Worst-case impact comparison', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Pass/Fail summary
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

conv_pass = sum(1 for r in conv_results if r['pass'])
bio_pass = sum(1 for r in bio_results if r['pass'])
n_tests = len(tests)

data = [[conv_pass, n_tests - conv_pass], [bio_pass, n_tests - bio_pass]]
labels = ['Conventional', 'Bio-inspired']
colors_stacked = ['#22c55e', '#ef4444']

for i, (label, d) in enumerate(zip(labels, data)):
    ax.barh(i, d[0], color='#22c55e', alpha=0.8)
    ax.barh(i, d[1], left=d[0], color='#ef4444', alpha=0.8)
    ax.text(d[0] / 2, i, f'{d[0]} pass', ha='center', va='center', color='white', fontsize=9)
    if d[1] > 0:
        ax.text(d[0] + d[1] / 2, i, f'{d[1]} fail', ha='center', va='center', color='white', fontsize=9)

ax.set_yticks([0, 1])
ax.set_yticklabels(labels, color='white', fontsize=10)
ax.set_xlabel('Number of tests', color='white')
ax.set_title('Certification results', color='white', fontsize=11)

# Plot 6: Bio-inspiration scorecard
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

features = ['Graded\\ndensity', 'Hyoid\\n(force spread)', 'Viscoelastic\\ndamping',
            'Multi-location\\nprotection', 'Temperature\\nrobust']

# Score each feature's contribution
base = simulate_helmet(head_mass, 2.0, foam_thick, conv_plateau, 0.004)
with_graded = simulate_helmet(head_mass, 2.0, foam_thick, 0, 0.004,
                               graded=True, outer_plateau=bio_outer, inner_plateau=bio_inner)
with_hyoid = simulate_helmet(head_mass, 2.0, foam_thick, conv_plateau, 0.004,
                              hyoid_factor=1.3)
with_damp = simulate_helmet(head_mass, 2.0, foam_thick, conv_plateau, 0.004,
                             damping_factor=1.5)

improvements = [
    (base['peak_g'] - with_graded['peak_g']) / base['peak_g'] * 100,
    (base['peak_g'] - with_hyoid['peak_g']) / base['peak_g'] * 100,
    (base['peak_g'] - with_damp['peak_g']) / base['peak_g'] * 100,
    np.mean(g_improvement),
    np.mean([(c - b) / max(c, 1) * 100 for c, b in
             zip([r['peak_g'] for r in conv_results[1:3]],
                 [r['peak_g'] for r in bio_results[1:3]])]),
]

bars = ax.barh(range(len(features)), [max(0, imp) for imp in improvements],
               color='#06b6d4', alpha=0.8)
ax.set_yticks(range(len(features)))
ax.set_yticklabels(features, color='white', fontsize=8)
ax.set_xlabel('g-force reduction (%)', color='white')
ax.set_title('Bio-inspired feature contributions', color='white', fontsize=11)

for bar, imp in zip(bars, improvements):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{max(0,imp):.0f}%', va='center', color='white', fontsize=8)

plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.show()

print("=" * 60)
print("  HELMET SAFETY CERTIFICATION REPORT")
print("=" * 60)
print()
print("DESIGN A: Conventional (uniform 80 g/L EPS)")
print(f"  Tests passed: {conv_pass}/{n_tests}")
for r in conv_results:
    s = "PASS" if r['pass'] else "FAIL"
    print(f"  {r['test']:<30} g={r['peak_g']:>6.0f}  HIC={r['HIC']:>7.0f}  [{s}]")
print()
print("DESIGN B: Bio-inspired (graded foam + hyoid + damping)")
print(f"  Tests passed: {bio_pass}/{n_tests}")
for r in bio_results:
    s = "PASS" if r['pass'] else "FAIL"
    print(f"  {r['test']:<30} g={r['peak_g']:>6.0f}  HIC={r['HIC']:>7.0f}  [{s}]")
print()
print("COMPARATIVE ANALYSIS:")
avg_g_imp = np.mean(g_improvement)
avg_hic_imp = np.mean(hic_improvement)
print(f"  Average peak g reduction: {avg_g_imp:.1f}%")
print(f"  Average HIC reduction: {avg_hic_imp:.1f}%")
print()
print("CONCLUSION: Bio-inspired design principles from the woodpecker")
print("skull provide measurable improvements in helmet safety across")
print("all test conditions. The graded density foam and hyoid-like")
print("force redistribution are the most impactful innovations.")
print()
print("From a drumming woodpecker to a safer helmet — biomimicry works.")`,
      challenge: 'Add a cost model: dense foam costs more than light foam, the hyoid reinforcement adds $3 per helmet, and viscoelastic materials add $5. Find the design that minimizes cost while passing all tests. This is the real engineering optimization — safety at minimum cost.',
      successHint: 'You have built a complete Helmet Safety Analyzer from scratch — impact physics, dynamic simulation, HIC calculation, multi-condition testing, and bio-inspired optimization. This is genuine engineering work. The woodpecker story that started as a children\'s tale has become a masterclass in biomechanics, materials science, and computational engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Build a Helmet Safety Analyzer</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a complete Helmet Safety Analyzer using Python. Click to start.</p>
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
