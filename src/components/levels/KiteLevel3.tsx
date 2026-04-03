import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function KiteLevel3() {
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
      title: 'Lift force & angle of attack',
      concept: `A kite flies because of **lift** — an aerodynamic force perpendicular to the wind direction. Lift is generated when the kite deflects air downward; by Newton's third law, the air pushes the kite upward. The amount of lift depends critically on the **angle of attack** (alpha) — the angle between the kite surface and the incoming wind direction.

The lift equation is: L = 0.5 * rho * V^2 * A * C_L(alpha), where rho is air density (1.225 kg/m^3 at sea level), V is wind speed, A is the kite's surface area, and C_L is the lift coefficient — a dimensionless number that depends on the kite's shape and angle of attack. For a flat plate kite, C_L increases approximately linearly with alpha up to about 12-15 degrees: C_L ~ 2*pi*sin(alpha). Beyond this critical angle, the airflow separates from the surface and lift drops dramatically — this is **stall**.

The key insight is that lift scales with V^2 — doubling the wind speed quadruples the lift. This is why kites that fly easily in a moderate breeze become uncontrollable in strong wind. It also means that small changes in wind speed have large effects on kite behavior. A kite designer must choose an angle of attack that provides sufficient lift in light winds without producing dangerous forces in gusts.`,
      analogy: `Angle of attack is like tilting your hand out a car window. Hold it flat (0 degrees) — no force. Tilt it slightly up (10 degrees) — your hand lifts smoothly. Tilt it too much (45 degrees) — the air gets turbulent and your hand shakes violently rather than lifting cleanly. That turbulent shaking is stall. The sweet spot — enough tilt for lift, not enough for stall — is exactly what a kite's bridle angle is designed to maintain.`,
      storyConnection: `In "The Kite Festival," kites of different shapes compete for altitude and grace. The winning kites are not necessarily the biggest — they are the ones with the best angle of attack for the day's wind conditions. A skilled kite flyer adjusts the bridle point (which controls angle of attack) based on wind speed, just as our physics predicts.`,
      checkQuestion: 'A kite has area 0.5 m^2 and flies at 10 degrees angle of attack in 5 m/s wind. Using C_L = 2*pi*sin(alpha), calculate the lift force. What happens if wind doubles to 10 m/s?',
      checkAnswer: 'C_L = 2*pi*sin(10°) = 2*3.14*0.174 = 1.09. L = 0.5 * 1.225 * 25 * 0.5 * 1.09 = 8.35 N (about 850 g force). At 10 m/s: L = 0.5 * 1.225 * 100 * 0.5 * 1.09 = 33.4 N (about 3.4 kg). Quadrupled, as expected from the V^2 dependence. The line tension would be roughly 3.4 kg — very noticeable but manageable for a kite string.',
      codeIntro: 'Model the lift force as a function of angle of attack and wind speed, and identify the stall angle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

rho = 1.225  # air density (kg/m^3)
A = 0.5      # kite area (m^2)

def Cl_flat_plate(alpha_deg):
    """Lift coefficient for a flat plate (pre-stall approximation)."""
    alpha = np.radians(alpha_deg)
    # Pre-stall: linear thin airfoil theory
    Cl_linear = 2 * np.pi * np.sin(alpha)
    # Post-stall model: gradual decrease
    Cl_stall = 2 * np.sin(alpha) * np.cos(alpha)  # Newtonian
    # Transition around stall angle
    stall_angle = 15  # degrees
    blend = 1 / (1 + np.exp((alpha_deg - stall_angle) / 2))
    return Cl_linear * blend + Cl_stall * (1 - blend)

def Cd_flat_plate(alpha_deg):
    """Drag coefficient for a flat plate."""
    alpha = np.radians(alpha_deg)
    Cd0 = 0.04  # zero-lift drag
    return Cd0 + 2 * np.sin(alpha)**2

alpha_range = np.linspace(0, 90, 300)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Kite Aerodynamics: Lift, Drag & Angle of Attack',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Cl vs alpha
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
Cl = Cl_flat_plate(alpha_range)
Cd = Cd_flat_plate(alpha_range)
ax.plot(alpha_range, Cl, color='#3b82f6', linewidth=2.5, label='C_L (lift)')
ax.plot(alpha_range, Cd, color='#ef4444', linewidth=2, label='C_D (drag)')
max_cl_idx = np.argmax(Cl)
ax.axvline(alpha_range[max_cl_idx], color='#f59e0b', linewidth=1.5, linestyle='--',
           label=f'Max C_L at {alpha_range[max_cl_idx]:.0f}°')
ax.scatter([alpha_range[max_cl_idx]], [Cl[max_cl_idx]], color='#f59e0b', s=100, zorder=5)
ax.set_xlabel('Angle of attack (degrees)', color='white')
ax.set_ylabel('Coefficient', color='white')
ax.set_title('Lift and drag coefficients vs angle of attack', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 2: Lift force vs wind speed at different angles
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
V_range = np.linspace(0, 15, 200)
for alpha, col in [(5, '#22c55e'), (10, '#3b82f6'), (15, '#f59e0b'), (25, '#ef4444')]:
    cl = Cl_flat_plate(alpha)
    L = 0.5 * rho * V_range**2 * A * cl
    ax.plot(V_range, L, color=col, linewidth=2, label=f'α={alpha}°')
ax.set_xlabel('Wind speed (m/s)', color='white')
ax.set_ylabel('Lift force (N)', color='white')
ax.set_title('Lift force scales with V² (quadratic)', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 3: Lift-to-drag ratio
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
L_D = Cl / np.maximum(Cd, 0.001)
ax.plot(alpha_range, L_D, color='#a855f7', linewidth=2.5)
max_ld_idx = np.argmax(L_D)
ax.scatter([alpha_range[max_ld_idx]], [L_D[max_ld_idx]], color='#22c55e', s=100, zorder=5)
ax.annotate(f'Best L/D = {L_D[max_ld_idx]:.1f} at {alpha_range[max_ld_idx]:.0f}°',
            (alpha_range[max_ld_idx], L_D[max_ld_idx]), xytext=(30, -20),
            textcoords='offset points', color='white', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='white'))
ax.set_xlabel('Angle of attack (degrees)', color='white')
ax.set_ylabel('Lift/Drag ratio', color='white')
ax.set_title('L/D ratio determines kite efficiency', color='white', fontsize=11)

# Plot 4: Force diagram on kite
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
alpha_demo = 12
V_demo = 6
cl_d = Cl_flat_plate(alpha_demo)
cd_d = Cd_flat_plate(alpha_demo)
L_d = 0.5 * rho * V_demo**2 * A * cl_d
D_d = 0.5 * rho * V_demo**2 * A * cd_d
W = 0.15 * 9.81  # 150g kite

# Draw kite
alpha_r = np.radians(alpha_demo)
kite_pts = np.array([[0, 0], [0.4*np.cos(alpha_r), 0.4*np.sin(alpha_r)]])
ax.plot(kite_pts[:, 0], kite_pts[:, 1], color='#f59e0b', linewidth=4)
# Force arrows
scale = 0.03
# Wind
ax.annotate('', xy=(0.1, 0.2), xytext=(-0.15, 0.2),
            arrowprops=dict(arrowstyle='->', color='gray', lw=2))
ax.text(-0.15, 0.23, f'Wind {V_demo} m/s', color='gray', fontsize=9)
# Lift (perpendicular to wind)
ax.annotate('', xy=(0.2, 0.1 + L_d*scale), xytext=(0.2, 0.1),
            arrowprops=dict(arrowstyle='->', color='#3b82f6', lw=2.5))
ax.text(0.22, 0.1 + L_d*scale/2, f'Lift = {L_d:.1f}N', color='#3b82f6', fontsize=10)
# Drag (parallel to wind)
ax.annotate('', xy=(0.2 + D_d*scale, 0.1), xytext=(0.2, 0.1),
            arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2))
ax.text(0.2 + D_d*scale/2, 0.05, f'Drag = {D_d:.1f}N', color='#ef4444', fontsize=10)
# Weight
ax.annotate('', xy=(0.2, 0.1 - W*scale), xytext=(0.2, 0.1),
            arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2))
ax.text(0.22, 0.1 - W*scale/2, f'Weight = {W:.1f}N', color='#f59e0b', fontsize=10)
ax.set_xlim(-0.3, 0.6); ax.set_ylim(-0.1, 0.5)
ax.set_aspect('equal')
ax.set_title(f'Force diagram at α={alpha_demo}°, V={V_demo}m/s', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Kite Aerodynamics Summary")
print("=" * 50)
print(f"Kite area: {A} m²")
print(f"Best L/D ratio: {L_D[max_ld_idx]:.1f} at α = {alpha_range[max_ld_idx]:.0f}°")
print(f"Max C_L: {Cl[max_cl_idx]:.2f} at α = {alpha_range[max_cl_idx]:.0f}° (stall)")
print()
for V in [3, 5, 8, 12]:
    cl = Cl_flat_plate(10)
    L = 0.5 * rho * V**2 * A * cl
    print(f"  V={V:>2} m/s: Lift={L:.1f}N ({L/9.81*1000:.0f}g), Line tension ~ {L:.1f}N")`,
      challenge: 'Add a cambered airfoil model (like a bowed kite): C_L = 2*pi*(alpha + alpha_0), where alpha_0 is the zero-lift angle determined by camber. Compare lift performance of flat vs cambered kites and find the optimal camber for maximum lift-to-drag ratio.',
      successHint: 'Lift and angle of attack are the foundation of all aerodynamics — from kites to aircraft wings to wind turbines. The V^2 scaling law means small wind changes have large effects, which is why kite flying requires constant attention and adjustment.',
    },
    {
      title: 'Drag forces & kite stability',
      concept: `**Drag** is the aerodynamic force parallel to the wind direction, opposing the kite's presence in the airflow. Unlike lift (which is useful), drag is mostly parasitic — it increases the line tension needed to hold the kite and limits how high it can fly. Kite drag has three components: **form drag** (from the kite's shape pushing air aside), **friction drag** (from air viscosity along the surface), and **induced drag** (a consequence of generating lift, caused by wingtip vortices).

For a flat plate at angle alpha, the total drag coefficient is approximately: C_D = C_D0 + C_L^2 / (pi * AR * e), where C_D0 is the zero-lift drag (~0.04 for a smooth surface), AR is the aspect ratio (span^2 / area), and e is the Oswald efficiency factor (~0.7-0.9). The induced drag term C_L^2/(pi*AR*e) reveals a crucial tradeoff: more lift means more induced drag. High aspect ratio kites (long and narrow, like a Rokkaku) have less induced drag because they spread the lift over a longer span.

**Stability** requires that any disturbance (a gust of wind, a tug on the line) creates restoring forces that bring the kite back to equilibrium. A kite is stable if its center of pressure is behind its center of gravity — any tilt forward increases the restoring moment. The tail of a traditional kite provides this stability by adding drag behind the CG, creating a weather-vane effect. Tailless kites achieve stability through swept-back wings (like a delta) or dihedral angle (like a sled kite).`,
      analogy: `Drag is like running through water. The faster you go, the harder the water pushes back (V^2 dependence). Making yourself thinner (streamlined) reduces the push. But you cannot eliminate it entirely — as long as you are in the water, there is resistance. A kite's tail is like a rudder on a boat: it does not help you go forward, but it keeps you pointed the right way.`,
      storyConnection: `At the kite festival, competitors understand that a kite that flies high must overcome drag efficiently. Long-tailed kites are stable but draggy. Tailless designs are efficient but harder to control. The winning kite balances these tradeoffs — enough stability to stay aloft, low enough drag to reach maximum altitude.`,
      checkQuestion: 'A diamond kite (AR=1.5) and a Rokkaku kite (AR=3.0) both have the same area and C_L=1.0. Calculate the induced drag coefficient for each assuming e=0.8. Which has lower total drag and by how much?',
      checkAnswer: 'Diamond: C_Di = 1.0^2/(pi*1.5*0.8) = 0.265. Rokkaku: C_Di = 1.0^2/(pi*3.0*0.8) = 0.133. The Rokkaku has 50% less induced drag. With C_D0=0.04: Diamond C_D = 0.305, Rokkaku C_D = 0.173. The Rokkaku has 43% less total drag, which translates directly to higher flying angle and less line tension.',
      codeIntro: 'Compare drag and stability characteristics of different kite designs: diamond, delta, Rokkaku, and sled.',
      code: `import numpy as np
import matplotlib.pyplot as plt

rho = 1.225
V = 6.0  # wind speed

# Kite designs
kites = {
    'Diamond': {'area': 0.5, 'AR': 1.2, 'Cd0': 0.05, 'mass': 0.12, 'e': 0.7, 'tail_Cd': 0.15},
    'Delta': {'area': 0.6, 'AR': 2.5, 'Cd0': 0.04, 'mass': 0.15, 'e': 0.85, 'tail_Cd': 0.0},
    'Rokkaku': {'area': 0.8, 'AR': 3.0, 'Cd0': 0.04, 'mass': 0.20, 'e': 0.80, 'tail_Cd': 0.0},
    'Sled': {'area': 0.4, 'AR': 1.5, 'Cd0': 0.06, 'mass': 0.08, 'e': 0.65, 'tail_Cd': 0.0},
}
kite_colors = {'Diamond': '#f59e0b', 'Delta': '#3b82f6', 'Rokkaku': '#22c55e', 'Sled': '#ef4444'}

alpha_range = np.linspace(1, 40, 200)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Kite Design Comparison: Drag, Efficiency & Stability',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Total drag coefficient vs alpha
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for name, k in kites.items():
    alpha_rad = np.radians(alpha_range)
    Cl = 2 * np.pi * np.sin(alpha_rad) * np.minimum(1, 15/alpha_range)  # simplified stall
    Cdi = Cl**2 / (np.pi * k['AR'] * k['e'])
    Cd = k['Cd0'] + Cdi + k['tail_Cd']
    ax.plot(alpha_range, Cd, color=kite_colors[name], linewidth=2, label=name)
ax.set_xlabel('Angle of attack (degrees)', color='white')
ax.set_ylabel('Total C_D', color='white')
ax.set_title('Drag coefficient comparison', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 2: L/D ratio
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for name, k in kites.items():
    alpha_rad = np.radians(alpha_range)
    Cl = 2 * np.pi * np.sin(alpha_rad) * np.minimum(1, 15/alpha_range)
    Cdi = Cl**2 / (np.pi * k['AR'] * k['e'])
    Cd = k['Cd0'] + Cdi + k['tail_Cd']
    LD = Cl / np.maximum(Cd, 0.01)
    ax.plot(alpha_range, LD, color=kite_colors[name], linewidth=2, label=name)
ax.set_xlabel('Angle of attack (degrees)', color='white')
ax.set_ylabel('L/D ratio', color='white')
ax.set_title('Lift-to-drag ratio (higher = better)', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 3: Flying angle vs wind speed
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
V_range = np.linspace(2, 15, 200)
for name, k in kites.items():
    alpha_opt = 10  # operating angle
    alpha_rad = np.radians(alpha_opt)
    Cl = 2 * np.pi * np.sin(alpha_rad) * min(1, 15/alpha_opt)
    Cdi = Cl**2 / (np.pi * k['AR'] * k['e'])
    Cd = k['Cd0'] + Cdi + k['tail_Cd']
    L = 0.5 * rho * V_range**2 * k['area'] * Cl
    D = 0.5 * rho * V_range**2 * k['area'] * Cd
    W = k['mass'] * 9.81
    # Flying angle: theta = arctan((L - W) / D) approximately
    fly_angle = np.degrees(np.arctan2(np.maximum(L - W, 0), D))
    ax.plot(V_range, fly_angle, color=kite_colors[name], linewidth=2, label=name)
ax.set_xlabel('Wind speed (m/s)', color='white')
ax.set_ylabel('Line angle from horizontal (degrees)', color='white')
ax.set_title('Flying angle: higher angle = higher kite', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 4: Stability margin visualization
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Stability: restoring moment vs perturbation angle
perturbation = np.linspace(-20, 20, 200)
for name, k in kites.items():
    # Simplified stability model: restoring torque proportional to perturbation
    cp_offset = 0.05  # center of pressure behind CG (fraction of chord)
    tail_arm = k['tail_Cd'] * 3  # tail effectiveness
    stability = -(cp_offset + tail_arm) * perturbation / 10  # normalized restoring moment
    ax.plot(perturbation, stability, color=kite_colors[name], linewidth=2, label=name)
ax.axhline(0, color='white', linewidth=0.5)
ax.axvline(0, color='white', linewidth=0.5)
ax.set_xlabel('Perturbation angle (degrees)', color='white')
ax.set_ylabel('Restoring moment (normalized)', color='white')
ax.set_title('Stability: steeper slope = more stable', color='white', fontsize=11)
ax.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Kite Design Comparison")
print("=" * 60)
print(f"{'Kite':<10} {'Area':>5} {'AR':>4} {'Mass':>5} {'Best L/D':>9} {'Min Wind':>9}")
print("-" * 60)
for name, k in kites.items():
    # Find best L/D
    a = np.radians(np.linspace(2, 30, 100))
    cl = 2*np.pi*np.sin(a)*np.minimum(1, np.radians(15)/a)
    cd = k['Cd0'] + cl**2/(np.pi*k['AR']*k['e']) + k['tail_Cd']
    ld = cl/cd
    best_ld = np.max(ld)
    # Minimum wind to fly: L = W
    W = k['mass'] * 9.81
    cl_10 = 2*np.pi*np.sin(np.radians(10))*1.0
    V_min = np.sqrt(2*W/(rho*k['area']*cl_10))
    print(f"  {name:<10} {k['area']:>4.1f}m² {k['AR']:>4.1f} {k['mass']:>4.0f}g  {best_ld:>8.1f}   {V_min:>7.1f} m/s")`,
      challenge: 'Add a vortex lattice model: instead of using the flat plate approximation, model the kite as a distribution of horseshoe vortices along the span. This gives more accurate predictions of induced drag and allows modeling of non-rectangular planforms (tapered, swept). Compare with the simple model.',
      successHint: 'Drag and stability are the engineering constraints of kite design. A kite that minimizes drag but ignores stability is unflyable. A stable kite with too much drag cannot reach altitude. The art is in the balance — and the physics tells us exactly where that balance lies.',
    },
    {
      title: 'Bernoulli principle & pressure distribution',
      concept: `**Bernoulli\'s principle** states that in a steady flow, an increase in fluid velocity corresponds to a decrease in pressure: P + 0.5*rho*v^2 = constant along a streamline. For a kite, this means the air flowing over the curved upper surface (faster) creates lower pressure than the air flowing under the flatter lower surface (slower). The net pressure difference, integrated over the kite area, creates the lift force.

The pressure distribution on a kite surface is not uniform. At the leading edge, the air slams into the kite and creates a high-pressure **stagnation point** (where velocity is zero and all kinetic energy converts to pressure). Moving along the upper surface, the flow accelerates and pressure drops. Near the trailing edge, the flow decelerates and pressure partially recovers. The net effect is higher average pressure below than above — this is lift.

The **pressure coefficient** C_p = (P - P_inf) / (0.5*rho*V^2) quantifies the local pressure relative to the free-stream. At the stagnation point, C_p = 1. On the upper surface where flow is fast, C_p < 0 (suction). The integral of C_p over the surface gives the force coefficients: C_L = integral of (C_p_lower - C_p_upper) * cos(theta) and C_D = integral of (C_p_lower - C_p_upper) * sin(theta). This integral approach is how computational fluid dynamics (CFD) calculates forces on any aerodynamic body.`,
      analogy: `Bernoulli's principle is why a shower curtain blows inward when you turn on the hot water. The fast-moving water droplets create faster air motion on the inside of the curtain. Faster air means lower pressure. The higher pressure outside pushes the curtain in. The same thing happens on a kite — faster air on top, lower pressure on top, net upward push.`,
      storyConnection: `The curved shape of a well-made kite is not just aesthetics — it is Bernoulli engineering. A flat kite works but inefficiently. A kite with a slight curve (camber) or a bowed spine creates a larger speed difference between upper and lower surfaces, generating more lift for the same wind speed. Traditional kite makers discovered this empirically; Bernoulli explains why it works.`,
      checkQuestion: 'At a point on the upper surface of a kite, the air speed is 8 m/s while the free-stream is 5 m/s. What is the pressure coefficient? If the air speed on the lower surface at the same point is 4 m/s, what is the local pressure difference (in Pascals)?',
      checkAnswer: 'C_p_upper = 1 - (8/5)^2 = 1 - 2.56 = -1.56 (suction). C_p_lower = 1 - (4/5)^2 = 1 - 0.64 = 0.36 (positive pressure). Local pressure difference: Delta_P = 0.5 * rho * V^2 * (C_p_lower - C_p_upper) = 0.5 * 1.225 * 25 * (0.36 - (-1.56)) = 0.5 * 1.225 * 25 * 1.92 = 29.4 Pa. This is a small pressure, but integrated over the entire kite area, it produces significant force.',
      codeIntro: 'Model the pressure distribution on different kite profiles and calculate the resulting lift and drag forces from the pressure integral.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def panel_method_2d(x_surface, y_surface, V_inf, alpha_deg):
    """Simple 2D panel method for pressure distribution on an airfoil/kite profile."""
    alpha = np.radians(alpha_deg)
    n = len(x_surface) - 1

    # Panel midpoints, normals, tangents
    xm = 0.5 * (x_surface[:-1] + x_surface[1:])
    ym = 0.5 * (y_surface[:-1] + y_surface[1:])
    dx = x_surface[1:] - x_surface[:-1]
    dy = y_surface[1:] - y_surface[:-1]
    ds = np.sqrt(dx**2 + dy**2)
    nx = -dy / ds  # outward normal x
    ny = dx / ds   # outward normal y

    # Free-stream velocity components
    u_inf = V_inf * np.cos(alpha)
    v_inf = V_inf * np.sin(alpha)

    # Simplified: compute surface velocity using thin airfoil theory approximation
    # V_surface ~ V_inf * (1 + local_curvature_effect)
    # For a cambered surface, the upper surface is faster
    curvature = np.gradient(np.gradient(ym, xm), xm)

    # Velocity on surface (approximate)
    V_surface = V_inf * (1 + 0.5 * (ym - np.mean(ym)) / max(np.ptp(ym), 0.001) * np.sin(alpha))
    V_surface += V_inf * np.sin(alpha) * ny  # angle of attack effect
    V_surface = np.abs(V_surface)

    # Pressure coefficient
    Cp = 1 - (V_surface / V_inf)**2

    return xm, ym, Cp, V_surface, nx, ny, ds

V = 5.0
rho = 1.225

# Define kite cross-section profiles
def flat_plate(n_pts=50, chord=0.4):
    x = np.linspace(0, chord, n_pts)
    y = np.zeros(n_pts)
    return x, y

def cambered_kite(n_pts=50, chord=0.4, camber=0.05):
    x = np.linspace(0, chord, n_pts)
    y = camber * 4 * x/chord * (1 - x/chord)  # parabolic camber
    return x, y

def bowed_kite(n_pts=50, chord=0.4, bow=0.08):
    x = np.linspace(0, chord, n_pts)
    y = bow * np.sin(np.pi * x / chord)
    return x, y

profiles = {
    'Flat plate': flat_plate(),
    'Slight camber (5%)': cambered_kite(camber=0.02),
    'Strong camber (12%)': cambered_kite(camber=0.05),
    'Bowed spine': bowed_kite(),
}
profile_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle("Bernoulli Principle: Pressure Distribution on Kite Profiles",
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Profile shapes
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for (name, (x, y)), col in zip(profiles.items(), profile_colors):
    ax.plot(x*100, y*100, color=col, linewidth=2.5, label=name)
ax.set_xlabel('Chord position (cm)', color='white')
ax.set_ylabel('Height (cm)', color='white')
ax.set_title('Kite cross-section profiles', color='white', fontsize=11)
ax.legend(fontsize=8)
ax.set_aspect('equal')

# Plot 2: Pressure coefficient at alpha=10
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for (name, (x, y)), col in zip(profiles.items(), profile_colors):
    xm, ym, Cp, Vs, nx, ny, ds = panel_method_2d(x, y, V, 10)
    ax.plot(xm*100, Cp, color=col, linewidth=2, label=name)
ax.axhline(0, color='white', linewidth=0.5, linestyle='--')
ax.axhline(1, color='gray', linewidth=0.5, linestyle=':', alpha=0.5, label='Stagnation')
ax.set_xlabel('Chord position (cm)', color='white')
ax.set_ylabel('Pressure coefficient Cp', color='white')
ax.set_title('Pressure distribution at α=10°', color='white', fontsize=11)
ax.legend(fontsize=7)
ax.invert_yaxis()  # Convention: negative Cp (suction) up

# Plot 3: Lift vs alpha for each profile
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
alpha_range = np.linspace(0, 25, 100)
for (name, (x, y)), col in zip(profiles.items(), profile_colors):
    lifts = []
    for a in alpha_range:
        xm, ym, Cp, Vs, nx, ny, ds = panel_method_2d(x, y, V, a)
        # Lift ~ integral of -Cp * ny * ds
        L = -0.5 * rho * V**2 * np.sum(Cp * ny * ds)
        lifts.append(L)
    ax.plot(alpha_range, lifts, color=col, linewidth=2, label=name)
ax.set_xlabel('Angle of attack (degrees)', color='white')
ax.set_ylabel('Lift force (N)', color='white')
ax.set_title('Lift from pressure integration', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 4: Velocity field visualization (simplified)
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
x_k, y_k = cambered_kite(camber=0.03)
# Show streamlines (simplified)
y_levels = np.linspace(-0.2, 0.3, 12)
for yl in y_levels:
    x_stream = np.linspace(-0.1, 0.5, 100)
    y_stream = np.full_like(x_stream, yl)
    # Deflect streamlines around the kite
    for i, xs in enumerate(x_stream):
        if 0 < xs < 0.4:
            idx = int(xs / 0.4 * (len(y_k)-1))
            y_kite = y_k[min(idx, len(y_k)-1)] + 0.05 * np.sin(np.radians(10))
            if yl > 0:
                y_stream[i] = yl + 0.05 * np.exp(-((xs-0.2)/0.15)**2) * (0.3 - abs(yl)) / 0.3
            else:
                y_stream[i] = yl - 0.02 * np.exp(-((xs-0.2)/0.15)**2) * (0.2 - abs(yl)) / 0.2
    ax.plot(x_stream*100, y_stream*100, color='#60a5fa', linewidth=0.8, alpha=0.6)
# Draw kite
x_rot = x_k * np.cos(np.radians(10)) - y_k * np.sin(np.radians(10))
y_rot = x_k * np.sin(np.radians(10)) + y_k * np.cos(np.radians(10))
ax.fill(x_rot*100, y_rot*100, color='#f59e0b', alpha=0.8, edgecolor='white', linewidth=2)
ax.annotate('Low pressure\\n(fast flow)', xy=(20, 8), color='#3b82f6', fontsize=9, fontweight='bold')
ax.annotate('High pressure\\n(slow flow)', xy=(15, -5), color='#ef4444', fontsize=9, fontweight='bold')
ax.set_xlabel('Position (cm)', color='white')
ax.set_ylabel('Height (cm)', color='white')
ax.set_title('Airflow around cambered kite at 10°', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Bernoulli Analysis")
print("=" * 50)
print(f"Wind speed: {V} m/s, Air density: {rho} kg/m³")
print()
for (name, (x, y)) in profiles.items():
    xm, ym, Cp, Vs, nx, ny, ds = panel_method_2d(x, y, V, 10)
    L = -0.5 * rho * V**2 * np.sum(Cp * ny * ds)
    Cp_min = np.min(Cp)
    print(f"  {name:<22} Lift={L:.2f}N  Min Cp={Cp_min:.2f}  Max V_surface={np.max(Vs):.1f}m/s")`,
      challenge: 'Implement a vortex panel method: represent the kite surface as a series of vortex panels rather than using the simplified pressure approximation. This gives accurate pressure distributions including the Kutta condition at the trailing edge. Compare with experimental data for a flat plate at various angles.',
      successHint: 'Bernoulli\'s principle connects pressure, velocity, and lift in a single elegant equation. Understanding the pressure distribution on a kite reveals why shape matters — camber creates lift even at zero angle of attack, which is why bowed kites fly so much better than flat ones.',
    },
    {
      title: 'Wind profiles & atmospheric boundary layer',
      concept: `Kites do not fly in uniform wind — they fly in the **atmospheric boundary layer**, where wind speed increases with altitude. Near the ground, friction between air and the surface slows the wind. At the typical kite flying height of 50-200 meters, the wind can be 50-100% stronger than at ground level. This vertical wind profile follows a power law: V(h) = V_ref * (h/h_ref)^alpha_wind, where alpha_wind depends on terrain roughness (0.10 for open water, 0.15 for grassland, 0.25 for suburban, 0.35 for urban).

For a kite festival on open Assamese floodplains: alpha_wind ~ 0.14. If ground-level wind (at 2m) is 3 m/s, then at 100m: V = 3 * (100/2)^0.14 = 3 * 50^0.14 = 3 * 1.73 = 5.19 m/s. The kite experiences 73% more wind at altitude than the flyer feels on the ground. This has practical implications: a kite that barely flies in light ground breeze may fly strongly once it reaches altitude, because the wind up there is much stronger.

**Wind gusts** add another dimension. Real wind is not steady — it fluctuates with a characteristic **turbulence intensity** I = sigma_V / V_mean, typically 10-20% over flat terrain. Gusts create oscillating forces on the kite, challenging its stability. The **gust factor** G = V_peak / V_mean is typically 1.4-1.6 in moderate turbulence. Kite design must handle the peak forces from gusts without structural failure, while maintaining flight in the lulls between gusts.`,
      analogy: `The boundary layer is like a river flowing over rocks. Right next to the rocks (ground), the water barely moves. A few centimeters up, it flows moderately. At the surface, it flows fastest. A kite is like a fish — it works better where the current is strong (high altitude) than where it is weak (ground level). Launching a kite is like a fish swimming from the slow shallows into the fast main current.`,
      storyConnection: `The kite festival takes place on the open Brahmaputra floodplains — one of the best terrain types for kite flying because the boundary layer is thin (low roughness exponent). The flat terrain means strong wind reaches close to the ground, making kites easier to launch. The story's kites rise into increasingly strong winds at altitude, which is exactly what the boundary layer profile predicts.`,
      checkQuestion: 'At a kite festival on a grassy floodplain (alpha=0.14), the weather station at 10m height reports 6 m/s wind. What is the expected wind at kite altitude of 80m? If a kite needs minimum 4 m/s to fly, can it fly with only the 3 m/s measured at 2m?',
      checkAnswer: 'At 80m: V = 6 * (80/10)^0.14 = 6 * 8^0.14 = 6 * 1.33 = 7.98 m/s. At 2m from the 10m measurement: V = 6 * (2/10)^0.14 = 6 * 0.80 = 4.80 m/s. If measured at 2m as 3 m/s, at 80m: V = 3 * (80/2)^0.14 = 3 * 40^0.14 = 3 * 1.69 = 5.06 m/s. Yes, the kite can fly at altitude (5.06 > 4 m/s), even though the ground wind of 3 m/s might feel barely adequate to the flyer.',
      codeIntro: 'Model the atmospheric boundary layer, calculate wind profiles for different terrain types, and simulate the forces on a kite at different altitudes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def wind_profile(h, V_ref, h_ref, alpha):
    """Power law wind profile."""
    return V_ref * (h / h_ref) ** alpha

def generate_gusty_wind(V_mean, turbulence_intensity, duration, dt=0.01):
    """Generate a time series of gusty wind."""
    n = int(duration / dt)
    t = np.linspace(0, duration, n)
    sigma = V_mean * turbulence_intensity
    # Superposition of random frequency components
    np.random.seed(42)
    wind = V_mean * np.ones(n)
    for _ in range(20):
        freq = np.random.uniform(0.01, 2)
        phase = np.random.uniform(0, 2*np.pi)
        amp = sigma * np.random.uniform(0.1, 0.5)
        wind += amp * np.sin(2*np.pi*freq*t + phase)
    return t, np.maximum(wind, 0)

terrains = {
    'Open water': 0.10,
    'Floodplain (Assam)': 0.14,
    'Grassland': 0.16,
    'Suburban': 0.25,
    'Urban': 0.35,
}
terrain_colors = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444']

V_ref = 6.0  # m/s at reference height
h_ref = 10.0 # meters

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Wind Profiles & Atmospheric Boundary Layer for Kite Flying',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Wind profiles for different terrain
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
h = np.linspace(0.5, 200, 300)
for (name, alpha), col in zip(terrains.items(), terrain_colors):
    V = wind_profile(h, V_ref, h_ref, alpha)
    ax.plot(V, h, color=col, linewidth=2, label=f'{name} (α={alpha})')
ax.axhline(h_ref, color='white', linewidth=0.5, linestyle=':', alpha=0.5)
ax.axvline(V_ref, color='white', linewidth=0.5, linestyle=':', alpha=0.5)
ax.scatter([V_ref], [h_ref], color='white', s=80, zorder=5, label=f'Reference: {V_ref}m/s at {h_ref}m')
ax.set_xlabel('Wind speed (m/s)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Boundary layer wind profiles', color='white', fontsize=11)
ax.legend(fontsize=7)

# Plot 2: Kite forces vs altitude (Assam floodplain)
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
rho = 1.225
A_kite = 0.6
Cl = 1.0
Cd = 0.3
mass = 0.15
alpha_terrain = 0.14
V_h = wind_profile(h, V_ref, h_ref, alpha_terrain)
L = 0.5 * rho * V_h**2 * A_kite * Cl
D = 0.5 * rho * V_h**2 * A_kite * Cd
W = mass * 9.81
ax.plot(L, h, color='#3b82f6', linewidth=2.5, label='Lift')
ax.plot(D, h, color='#ef4444', linewidth=2, label='Drag')
ax.axvline(W, color='#f59e0b', linewidth=2, linestyle='--', label=f'Weight = {W:.2f}N')
ax.set_xlabel('Force (N)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Kite forces increase with altitude', color='white', fontsize=11)
ax.legend(fontsize=9)
# Mark where lift > weight (can fly)
h_fly = h[L > W]
if len(h_fly) > 0:
    ax.axhspan(0, h_fly[0], alpha=0.1, color='#ef4444')
    ax.text(W*1.5, h_fly[0]/2, 'Cannot fly\\n(lift < weight)', color='#ef4444', fontsize=8)

# Plot 3: Gusty wind time series
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
V_mean_altitude = wind_profile(80, V_ref, h_ref, 0.14)
t1, wind_low_turb = generate_gusty_wind(V_mean_altitude, 0.10, 60)
t2, wind_high_turb = generate_gusty_wind(V_mean_altitude, 0.25, 60)
ax.plot(t1, wind_low_turb, color='#22c55e', linewidth=1, alpha=0.8, label='Low turbulence (10%)')
ax.plot(t2, wind_high_turb, color='#ef4444', linewidth=1, alpha=0.8, label='High turbulence (25%)')
ax.axhline(V_mean_altitude, color='white', linewidth=1, linestyle='--',
           label=f'Mean: {V_mean_altitude:.1f} m/s')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Wind speed at 80m (m/s)', color='white')
ax.set_title('Gusty wind: turbulence matters for kite stability', color='white', fontsize=10)
ax.legend(fontsize=8)

# Plot 4: Line tension vs altitude and wind
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Line tension = sqrt(L² + D²) approximately
V_refs = [4, 6, 8, 10]
cols = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for Vr, col in zip(V_refs, cols):
    V_at_h = wind_profile(h, Vr, h_ref, 0.14)
    L_h = 0.5 * rho * V_at_h**2 * A_kite * Cl
    D_h = 0.5 * rho * V_at_h**2 * A_kite * Cd
    tension = np.sqrt(np.maximum(L_h - W, 0)**2 + D_h**2)
    ax.plot(tension, h, color=col, linewidth=2, label=f'V_10m = {Vr} m/s')
ax.set_xlabel('Line tension (N)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Line tension increases with altitude', color='white', fontsize=11)
ax.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Boundary Layer Analysis (Assam Floodplain)")
print("=" * 55)
print(f"Reference: {V_ref} m/s at {h_ref}m")
print(f"Roughness exponent: {alpha_terrain}")
print()
print(f"{'Height':>8} {'Wind':>8} {'Lift':>8} {'Tension':>8}")
for height in [2, 10, 30, 80, 150]:
    v = wind_profile(height, V_ref, h_ref, alpha_terrain)
    l = 0.5 * rho * v**2 * A_kite * Cl
    d = 0.5 * rho * v**2 * A_kite * Cd
    t = np.sqrt(max(l - W, 0)**2 + d**2)
    print(f"  {height:>5}m  {v:>6.1f}m/s  {l:>6.1f}N  {t:>6.1f}N")`,
      challenge: 'Add thermal effects: on a sunny day, the ground heats up and creates rising columns of warm air (thermals). Model thermals as Gaussian updrafts and calculate how they affect kite altitude and tension. Can a kite gain altitude by flying through a thermal, like a soaring bird?',
      successHint: 'The atmospheric boundary layer is the invisible playing field of kite flying. Understanding wind profiles explains why kites fly better at altitude, why terrain matters, and why experienced kite flyers launch upwind of obstacles. The physics is the same whether the kite is a festival toy or a wind energy harvesting system.',
    },
    {
      title: 'Line tension, catenary curves & structural loads',
      concept: `The kite line is not straight — it curves under its own weight and the distributed aerodynamic forces along its length. This curve is a **catenary** (or more precisely, a weighted catenary), described by the same mathematics that governs hanging cables, suspension bridges, and power lines.

For a kite line of mass per unit length m_l, the tension varies along the line. At the kite end, the tension equals the total aerodynamic force. At the ground end, the tension is the vector sum of the kite force minus the weight of the line. The line sag (the maximum horizontal deviation from a straight line) depends on the ratio of line weight to tension: sag = m_l * g * L^2 / (8 * T_horizontal), where L is the straight-line distance and T_horizontal is the horizontal component of tension.

For light kite lines (e.g., 50 kg test Dyneema at 0.1 g/m), the sag is negligible. For heavy lines (e.g., 200 kg test nylon at 2 g/m), the sag can be several meters over a 100m run, significantly reducing the effective flying height. The **breaking strength** of the line must exceed the maximum expected tension by a safety factor of at least 3. Maximum tension occurs during the strongest gust: T_max = T_mean * G^2, where G is the gust factor (since tension scales with V^2). A line rated for 50N tension with a gust factor of 1.5 experiences peak loads of 50 * 2.25 = 112.5N — requiring a line with breaking strength above 340N.`,
      analogy: `A kite line is like a rope in a tug-of-war that is also being weighed down by rain. The harder you pull (more wind), the straighter the rope gets. But the heavier the rope (thicker line), the more it sags in the middle. The best tug-of-war rope is the lightest one that will not break — and the best kite line follows the same principle.`,
      storyConnection: `At the kite festival, the line is the critical connection between flyer and kite. A broken line means a lost kite. A too-heavy line means a kite that cannot reach its potential altitude. The choice of line — material, thickness, length — is as important as the kite design itself. Traditional Assamese kite strings coated in powdered glass (for kite fighting) add weight and roughness that change the catenary shape.`,
      checkQuestion: 'A kite generates 20N of total aerodynamic force at 60 degrees from horizontal. The line is 150m long with mass 0.5 g/m. What is the total line weight? What is the ground-end tension (magnitude and angle)?',
      checkAnswer: 'Line weight = 0.0005 * 9.81 * 150 = 0.736 N. Kite force components: horizontal = 20*cos(60°) = 10N, vertical = 20*sin(60°) = 17.3N. Ground-end: horizontal same = 10N, vertical = 17.3 - 0.736 = 16.56N. Ground tension magnitude = sqrt(10² + 16.56²) = 19.3N. Ground angle = arctan(16.56/10) = 58.9° — slightly lower than the kite end because line weight pulls the lower end toward horizontal.',
      codeIntro: 'Model the kite line as a catenary, calculate tension distribution, and analyze structural safety margins for different line materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def catenary_line(T_kite, angle_kite_deg, L_line, mass_per_m, n_segments=100):
    """Compute catenary shape of kite line."""
    g = 9.81
    w = mass_per_m * g  # weight per meter

    # Kite end tension components
    T_h = T_kite * np.cos(np.radians(angle_kite_deg))
    T_v_kite = T_kite * np.sin(np.radians(angle_kite_deg))

    # Discretize line into segments
    ds = L_line / n_segments
    x = np.zeros(n_segments + 1)
    y = np.zeros(n_segments + 1)
    tension = np.zeros(n_segments + 1)

    # Start from kite end
    x[-1] = 0  # will be adjusted
    y[-1] = 0  # will be adjusted

    T_v = T_v_kite  # vertical tension at kite

    # Trace from kite end to ground
    for i in range(n_segments - 1, -1, -1):
        T_total = np.sqrt(T_h**2 + T_v**2)
        tension[i+1] = T_total
        dx = T_h / T_total * ds
        dy = T_v / T_total * ds
        x[i] = x[i+1] - dx
        y[i] = y[i+1] - dy
        T_v -= w * ds  # tension decreases going down

    tension[0] = np.sqrt(T_h**2 + T_v**2)

    # Normalize so ground end is at origin
    x -= x[0]
    y -= y[0]

    return x, y, tension

# Line materials
lines = {
    'Cotton (traditional)': {'mass_per_m': 0.003, 'breaking_N': 80, 'color': '#f59e0b'},
    'Nylon (standard)': {'mass_per_m': 0.001, 'breaking_N': 150, 'color': '#3b82f6'},
    'Dyneema (high-perf)': {'mass_per_m': 0.0003, 'breaking_N': 300, 'color': '#22c55e'},
    'Glass-coated (manja)': {'mass_per_m': 0.005, 'breaking_N': 60, 'color': '#ef4444'},
}

T_kite = 15  # N total aerodynamic force
angle_kite = 65  # degrees from horizontal
L_line = 120  # meters

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Kite Line Analysis: Catenary Shape, Tension & Safety',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Line shapes for different materials
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for name, props in lines.items():
    x, y, tension = catenary_line(T_kite, angle_kite, L_line, props['mass_per_m'])
    ax.plot(x, y, color=props['color'], linewidth=2, label=name)
ax.plot([0], [0], 'wo', markersize=8, label='Ground')
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Line shape: heavier lines sag more', color='white', fontsize=11)
ax.legend(fontsize=8)
ax.set_aspect('equal')

# Plot 2: Tension along line
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for name, props in lines.items():
    x, y, tension = catenary_line(T_kite, angle_kite, L_line, props['mass_per_m'])
    s = np.linspace(0, L_line, len(tension))
    ax.plot(s, tension, color=props['color'], linewidth=2, label=name)
    ax.axhline(props['breaking_N'], color=props['color'], linewidth=1, linestyle=':', alpha=0.5)
ax.set_xlabel('Distance along line from ground (m)', color='white')
ax.set_ylabel('Tension (N)', color='white')
ax.set_title('Tension distribution (dotted = breaking strength)', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 3: Safety factor vs gust factor
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
gust_factors = np.linspace(1.0, 2.0, 200)
for name, props in lines.items():
    x, y, tension = catenary_line(T_kite, angle_kite, L_line, props['mass_per_m'])
    T_max_line = np.max(tension)
    # Peak tension scales with gust_factor^2
    T_peak = T_max_line * gust_factors**2
    safety = props['breaking_N'] / T_peak
    ax.plot(gust_factors, safety, color=props['color'], linewidth=2, label=name)
ax.axhline(3, color='white', linewidth=1.5, linestyle='--', label='Safety factor = 3')
ax.axhline(1, color='#ef4444', linewidth=2, linestyle='--', label='FAILURE')
ax.set_xlabel('Gust factor (V_peak / V_mean)', color='white')
ax.set_ylabel('Safety factor', color='white')
ax.set_title('Safety margin vs gust conditions', color='white', fontsize=11)
ax.legend(fontsize=7)

# Plot 4: Effective altitude vs line length
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
line_lengths = np.linspace(20, 300, 100)
for name, props in lines.items():
    heights = []
    for L in line_lengths:
        x, y, _ = catenary_line(T_kite, angle_kite, L, props['mass_per_m'])
        heights.append(np.max(y))
    ax.plot(line_lengths, heights, color=props['color'], linewidth=2, label=name)
ax.plot(line_lengths, line_lengths * np.sin(np.radians(angle_kite)),
        color='gray', linewidth=1, linestyle=':', label='Straight line (no sag)')
ax.set_xlabel('Line length (m)', color='white')
ax.set_ylabel('Maximum height (m)', color='white')
ax.set_title('Achievable altitude vs line length', color='white', fontsize=11)
ax.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("Kite Line Analysis")
print("=" * 65)
print(f"Kite force: {T_kite}N at {angle_kite}° | Line length: {L_line}m")
print()
print(f"{'Line Type':<22} {'Mass':>7} {'Break':>6} {'Max T':>6} {'Safety':>7} {'Height':>7}")
print("-" * 65)
for name, props in lines.items():
    x, y, tension = catenary_line(T_kite, angle_kite, L_line, props['mass_per_m'])
    T_max = np.max(tension)
    sf = props['breaking_N'] / (T_max * 1.5**2)  # safety at G=1.5
    h = np.max(y)
    print(f"  {name:<22} {props['mass_per_m']*1000:>5.1f}g/m {props['breaking_N']:>5}N {T_max:>5.1f}N {sf:>6.1f}x {h:>6.1f}m")`,
      challenge: 'Model the dynamic behavior of the line: when a gust hits, the kite surges and the line stretches like a spring (due to material elasticity). Implement a simple mass-spring-damper model of the kite-line system and simulate the oscillation following a step increase in wind speed. How does line material (elastic nylon vs stiff Dyneema) affect the dynamic response?',
      successHint: 'The kite line is a structural element that must handle dynamic loads in a challenging environment. Understanding catenary mechanics, tension distribution, and safety factors is essential for safe kite flying — and the same mathematics applies to power kites, kiteboarding, and even kite-based wind energy systems.',
    },
    {
      title: 'Reynolds number effects & scale modeling',
      concept: `The aerodynamic performance of a kite depends on the **Reynolds number** Re = V * L / nu, where V is the air speed, L is a characteristic length (the kite's chord), and nu is the kinematic viscosity of air (1.5e-5 m^2/s). Reynolds number determines whether the flow is laminar (smooth, Re < 10^5 for a flat plate) or turbulent (chaotic, Re > 5x10^5). Most kites operate in the transition region (Re ~ 10^4 to 10^5), where performance is highly sensitive to surface roughness, leading edge shape, and flow separation behavior.

At low Re (small kites in light wind), viscous forces dominate and the boundary layer is thick. This means **laminar separation** occurs easily: the slow boundary layer cannot negotiate the pressure rise at the rear of the kite, so it separates early, creating a large wake and high drag. At higher Re, the boundary layer naturally transitions to turbulence, which has more momentum and can stay attached longer, resulting in less separation, less drag, and more lift.

This is why small kites are proportionally less efficient than large kites in the same wind — they operate at lower Re where the aerodynamics are worse. It also explains why model testing requires careful Re matching: a 1/10 scale kite model tested in the same wind as the full-size kite operates at 1/10 the Re, giving misleadingly different performance. To match Re, you would need to test at 10x the wind speed or in a denser fluid.`,
      analogy: `Reynolds number is like the difference between walking through honey and walking through air. At low Re (honey), everything is dominated by viscosity — you move slowly and smoothly, but it is hard to make quick changes. At high Re (air), inertia dominates — you can move quickly, but turbulent eddies form behind you. A kite at low Re is like pushing through honey: the air clings to the surface sluggishly and separates easily. At high Re, the air is more "lively" and follows the surface better.`,
      storyConnection: `The kite festival features kites of all sizes — from tiny paper kites flown by children to enormous Rokkaku fighting kites. The smallest kites struggle more in light wind not just because they are light, but because their Reynolds number is low, making their aerodynamics inherently less efficient. A skilled festival participant knows that small kites need faster wind to fly well — this is the Re effect in action.`,
      checkQuestion: 'A kite has a chord of 40 cm and flies in 5 m/s wind. Calculate the Reynolds number. A 1:4 scale model (10 cm chord) is tested in the same wind. What is its Re? By what factor must you increase the wind speed to match Re at model scale?',
      checkAnswer: 'Full kite: Re = 5 * 0.40 / 1.5e-5 = 133,000 — in the transition region. Model: Re = 5 * 0.10 / 1.5e-5 = 33,300 — lower, more laminar, different aerodynamic behavior. To match: V_model = Re_full * nu / L_model = 133,000 * 1.5e-5 / 0.10 = 20 m/s. You need 4x the wind speed at 1/4 scale, which is impractically fast. This is why Re-matched kite testing is difficult.',
      codeIntro: 'Analyze how Reynolds number affects kite performance, compare different kite sizes, and demonstrate why scale modeling is challenging.',
      code: `import numpy as np
import matplotlib.pyplot as plt

nu = 1.5e-5  # kinematic viscosity of air (m^2/s)

def reynolds(V, L):
    return V * L / nu

def Cl_vs_Re(alpha_deg, Re):
    """Lift coefficient accounting for Re effects."""
    alpha = np.radians(alpha_deg)
    # Base thin airfoil theory
    Cl_ideal = 2 * np.pi * np.sin(alpha)

    # Re correction: lower Re = earlier stall, lower max Cl
    stall_angle = 12 + 5 * np.log10(np.maximum(Re, 1e3)) / 5  # stall angle increases with Re
    stall_angle = np.minimum(stall_angle, 18)

    # Smooth stall transition
    stall_factor = 1 / (1 + np.exp((alpha_deg - stall_angle) / 2))
    Cl_post = 2 * np.sin(alpha) * np.cos(alpha)  # post-stall

    # Viscous reduction at low Re
    viscous_factor = np.minimum(1.0, 0.5 + 0.5 * np.log10(np.maximum(Re, 1e3)) / 5)

    return (Cl_ideal * stall_factor + Cl_post * (1 - stall_factor)) * viscous_factor

def Cd_vs_Re(alpha_deg, Re):
    """Drag coefficient accounting for Re effects."""
    alpha = np.radians(alpha_deg)
    # Skin friction decreases with Re
    Cf = 1.328 / np.sqrt(np.maximum(Re, 100)) if Re < 5e5 else 0.074 / Re**0.2
    Cd0 = 2 * Cf  # both sides
    Cdi = (2 * np.pi * np.sin(alpha))**2 / (np.pi * 2.0 * 0.8)  # simplified induced
    return Cd0 + 2 * np.sin(alpha)**2 + Cdi * 0.1

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Reynolds Number Effects on Kite Performance',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Re for different kite sizes and wind speeds
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
V_range = np.linspace(1, 15, 200)
chords = {'Tiny (10cm)': 0.10, 'Small (25cm)': 0.25, 'Medium (40cm)': 0.40,
          'Large (80cm)': 0.80, 'Giant (150cm)': 1.50}
chord_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for (name, chord), col in zip(chords.items(), chord_colors):
    Re = reynolds(V_range, chord)
    ax.semilogy(V_range, Re, color=col, linewidth=2, label=name)
ax.axhspan(1e4, 1e5, alpha=0.1, color='#f59e0b', label='Transition region')
ax.axhline(5e5, color='white', linewidth=1, linestyle=':', alpha=0.5)
ax.text(1.5, 6e5, 'Turbulent', color='white', fontsize=8)
ax.text(1.5, 5e3, 'Laminar', color='white', fontsize=8)
ax.set_xlabel('Wind speed (m/s)', color='white')
ax.set_ylabel('Reynolds number', color='white')
ax.set_title('Re depends on kite size and wind speed', color='white', fontsize=11)
ax.legend(fontsize=7)

# Plot 2: Cl vs alpha at different Re
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
alpha_range = np.linspace(0, 30, 200)
Re_values = [1e3, 1e4, 5e4, 1e5, 5e5]
Re_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for Re, col in zip(Re_values, Re_colors):
    Cl = [Cl_vs_Re(a, Re) for a in alpha_range]
    ax.plot(alpha_range, Cl, color=col, linewidth=2, label=f'Re = {Re:.0e}')
ax.set_xlabel('Angle of attack (degrees)', color='white')
ax.set_ylabel('Lift coefficient C_L', color='white')
ax.set_title('Higher Re = higher max C_L and later stall', color='white', fontsize=11)
ax.legend(fontsize=8)

# Plot 3: L/D vs Re at optimal alpha
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
Re_sweep = np.logspace(2, 6, 200)
best_LD = []
for Re in Re_sweep:
    LDs = []
    for a in np.linspace(2, 20, 50):
        cl = Cl_vs_Re(a, Re)
        cd = Cd_vs_Re(a, Re)
        LDs.append(cl / max(cd, 0.001))
    best_LD.append(max(LDs))
ax.semilogx(Re_sweep, best_LD, color='#22c55e', linewidth=2.5)
# Mark typical kite Re ranges
for (name, chord), col in zip(chords.items(), chord_colors):
    Re_typical = reynolds(6, chord)  # at 6 m/s
    idx = np.argmin(np.abs(Re_sweep - Re_typical))
    ax.scatter([Re_typical], [best_LD[idx]], color=col, s=80, zorder=5)
    ax.annotate(name.split('(')[1].rstrip(')'), (Re_typical, best_LD[idx]),
                xytext=(5, 5), textcoords='offset points', color='white', fontsize=7)
ax.set_xlabel('Reynolds number', color='white')
ax.set_ylabel('Best L/D ratio', color='white')
ax.set_title('Performance improves with Re (bigger kites win)', color='white', fontsize=11)

# Plot 4: Scale model testing challenge
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
scales = [1, 2, 4, 8, 16]  # 1:N scale
V_test = 6.0  # test wind speed
L_full = 0.40  # full-size chord
Re_full = reynolds(V_test, L_full)
for scale in scales:
    L_model = L_full / scale
    Re_model = reynolds(V_test, L_model)
    V_needed = Re_full * nu / L_model
    alpha_sweep = np.linspace(0, 25, 50)
    LD_full = [Cl_vs_Re(a, Re_full)/max(Cd_vs_Re(a, Re_full), 0.001) for a in alpha_sweep]
    LD_model = [Cl_vs_Re(a, Re_model)/max(Cd_vs_Re(a, Re_model), 0.001) for a in alpha_sweep]
    error = (max(LD_model) - max(LD_full)) / max(LD_full) * 100
    ax.bar(f'1:{scale}', abs(error), color='#ef4444' if abs(error) > 10 else '#22c55e', alpha=0.8)
    ax.text(scales.index(scale), abs(error)+1, f'{error:+.0f}%', ha='center', color='white', fontsize=9)
ax.set_xlabel('Model scale', color='white')
ax.set_ylabel('L/D error vs full size (%)', color='white')
ax.set_title(f'Scale model error at V={V_test}m/s (Re mismatch)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Reynolds Number Analysis")
print("=" * 55)
print(f"Air viscosity: {nu} m²/s")
for name, chord in chords.items():
    Re = reynolds(6, chord)
    regime = "laminar" if Re < 1e5 else "transition" if Re < 5e5 else "turbulent"
    print(f"  {name:<15} Re={Re:>8.0f} at 6 m/s  ({regime})")`,
      challenge: 'Implement a trip wire model: a thin wire placed near the leading edge forces the boundary layer to transition from laminar to turbulent at low Re, preventing laminar separation and improving performance. Calculate the optimal trip wire position and diameter for a small kite (chord=15cm) at Re=30,000. How much does L/D improve?',
      successHint: 'Reynolds number effects explain many puzzling observations in kite flying: why small kites need more wind, why rough surfaces sometimes fly better than smooth ones, and why scale models give misleading results. Re is the hidden variable that connects kite size, wind speed, and aerodynamic performance.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Kite Aerodynamics & Flight Physics
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (forces & flight basics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real aerodynamics, lift/drag analysis, and atmospheric physics. Click to start.</p>
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
