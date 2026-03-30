import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import WoodpeckerStressDistributionDiagram from '../diagrams/WoodpeckerStressDistributionDiagram';
import WoodpeckerImpulseTheoryDiagram from '../diagrams/WoodpeckerImpulseTheoryDiagram';
import WoodpeckerResonanceDiagram from '../diagrams/WoodpeckerResonanceDiagram';
import WoodpeckerEnergyAbsorptionDiagram from '../diagrams/WoodpeckerEnergyAbsorptionDiagram';
import WoodpeckerRotationalForceDiagram from '../diagrams/WoodpeckerRotationalForceDiagram';
import WoodpeckerFatigueAnalysisDiagram from '../diagrams/WoodpeckerFatigueAnalysisDiagram';

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

# Material properties (biological tissues in woodpecker skull)
materials = {
    'Beak keratin': {'E': 6e9, 'yield_stress': 120e6, 'color': '#ef4444'},
    'Cranial bone': {'E': 15e9, 'yield_stress': 150e6, 'color': '#f59e0b'},
    'Hyoid bone': {'E': 8e9, 'yield_stress': 80e6, 'color': '#22c55e'},
    'Spongy bone': {'E': 1e9, 'yield_stress': 20e6, 'color': '#3b82f6'},
    'Brain tissue': {'E': 3e3, 'yield_stress': 10e3, 'color': '#a855f7'},
    'Muscle/tendon': {'E': 0.5e9, 'yield_stress': 30e6, 'color': '#06b6d4'},
}


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


print("\n[Full visualization in playground]")`,
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


print()
print("Viscoelastic Material Summary:")
print(f"Instantaneous modulus: {E_inst/1e9:.2f} GPa (stiff during impact)")
print(f"Relaxed modulus: {E_R/1e9:.2f} GPa (soft at equilibrium)")
print(f"Ratio: {E_inst/E_R:.1f}x stiffer during impact than at rest")

print("\n[Full visualization in playground]")`,
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

print("\n[Full visualization in playground]")`,
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
            diagram={[WoodpeckerStressDistributionDiagram, WoodpeckerImpulseTheoryDiagram, WoodpeckerResonanceDiagram, WoodpeckerEnergyAbsorptionDiagram, WoodpeckerRotationalForceDiagram, WoodpeckerFatigueAnalysisDiagram][i] ? createElement([WoodpeckerStressDistributionDiagram, WoodpeckerImpulseTheoryDiagram, WoodpeckerResonanceDiagram, WoodpeckerEnergyAbsorptionDiagram, WoodpeckerRotationalForceDiagram, WoodpeckerFatigueAnalysisDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
