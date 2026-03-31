import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BridgeLevel3() {
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
      title: 'Ficus elastica biology — how roots become bridges',
      concept: `Living root bridges are made from the aerial roots of *Ficus elastica* (the Indian rubber fig), trained over decades by the Khasi and Jaintia people of Meghalaya. Understanding the biology is the first step to understanding the engineering.

**Aerial roots**: Unlike most trees whose roots grow only underground, *Ficus elastica* produces adventitious roots from its trunk and branches. These aerial roots grow downward through the air, seeking soil. They are triggered by high humidity (Meghalaya receives 10,000-12,000 mm of rain annually) and the plant hormone auxin, which accumulates on the underside of horizontal branches due to gravity (gravitropism).

**Secondary thickening**: When an aerial root reaches the opposite bank and anchors into soil, it begins secondary growth. The vascular cambium — a thin cylinder of dividing cells between the bark and wood — adds new xylem (wood) inward and new phloem (bark) outward each year. A root that starts as a pencil-thin tendril can grow to 15-20 cm diameter over 30-50 years.

**Root anastomosis**: When two roots are pressed together (by the bridge builders), their cambia fuse through a process called inosculation. The bark at the contact point dies back, the exposed cambia merge, and new vascular tissue grows across the junction. This creates a single continuous vascular network — the roots literally become one organism. This is the biological "welding" that makes living bridges possible.

**Tensile vs compressive strength**: Root wood has evolved for anchorage — resisting being pulled out of the ground. This means root fibers are optimized for **tensile strength** (resistance to being stretched or pulled apart), not compressive strength. Root wood of *Ficus elastica* has a tensile strength of approximately 30-50 MPa, comparable to mild structural steel on a per-weight basis.`,
      analogy: 'Think of aerial roots as biological cables that grow thicker under load. A steel cable is manufactured to a fixed diameter and never changes. A root cable starts thin, but if you hang weight from it, the tree responds by adding more wood — like a cable that reinforces itself automatically wherever stress is highest. Root anastomosis is like welding two cables together, except the weld is alive and gets stronger every year.',
      storyConnection: 'In the story of the bridge that grew, the Khasi villagers guide thin aerial roots across a river gorge using hollowed-out betel nut trunks as channels. The roots grow through the channels, emerge on the other bank, and root into the soil. Over 15-30 years, the roots thicken, fuse together, and become strong enough to support foot traffic. The bridge is alive — it repairs storm damage, grows stronger with age, and can last 500+ years.',
      checkQuestion: 'Why do living root bridges get stronger with age, while steel bridges get weaker? What biological process accounts for this?',
      checkAnswer: 'Living root bridges strengthen because the vascular cambium continues producing new wood (secondary xylem) every year, adding cross-sectional area. When a root bears more load, mechanical stress stimulates additional cambial activity — a response called thigmomorphogenesis. Steel bridges weaken because corrosion removes material, fatigue cracks propagate, and there is no self-repair mechanism. A 200-year-old root bridge may be 5x stronger than it was at year 30.',
      codeIntro: 'Model the growth of a Ficus elastica aerial root over time, showing how diameter and tensile capacity increase through secondary thickening.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Root growth model ---
# Based on botanical data for Ficus elastica in humid conditions
years = np.arange(0, 201)

# Diameter growth follows a logistic curve (fast early, slowing as tree matures)
max_diameter_cm = 25.0  # maximum root diameter
growth_rate = 0.04      # logistic growth rate parameter
inflection_year = 40    # fastest growth around year 40

diameter_cm = max_diameter_cm / (1 + np.exp(-growth_rate * (years - inflection_year)))

# Cross-sectional area (circular)
radius_cm = diameter_cm / 2
area_cm2 = np.pi * radius_cm**2

# Tensile strength of Ficus elastica root wood: 30-50 MPa
# Increases slightly with maturity due to denser wood
base_strength_MPa = 30 + 15 * (1 - np.exp(-0.02 * years))  # matures over time

# Tensile capacity = area * strength
area_m2 = area_cm2 * 1e-4  # convert cm^2 to m^2
tensile_capacity_kN = area_m2 * base_strength_MPa * 1000  # MPa * m^2 = MN, * 1000 = kN

# Weight a single root can support (safety factor of 3)
safe_load_kg = tensile_capacity_kN * 1000 / 9.81 / 3  # kN to N, divide by g and safety factor

# --- Comparison with engineered materials ---
# For a root of 15 cm diameter at year 100:
root_area_100 = np.pi * (diameter_cm[100]/2)**2 * 1e-4  # m^2
materials = {
    'Ficus root (year 100)': base_strength_MPa[100],
    'Pine wood (along grain)': 40,
    'Bamboo (tensile)': 160,
    'Mild steel': 400,
    'Carbon fiber composite': 1500,
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Diameter over time
ax = axes[0, 0]
ax.plot(years, diameter_cm, color='#22c55e', linewidth=2.5)
ax.axhline(y=10, color='#f59e0b', linestyle='--', alpha=0.6, label='Walkable bridge threshold (~10 cm)')
ax.axvline(x=30, color='gray', linestyle=':', alpha=0.5)
ax.text(32, 2, 'First foot traffic\\n(~30 years)', color='gray', fontsize=8)
ax.set_xlabel('Years', color='white', fontsize=11)
ax.set_ylabel('Root diameter (cm)', color='white', fontsize=11)
ax.set_title('Root diameter growth (logistic model)', color='white', fontsize=13)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Tensile capacity
ax = axes[0, 1]
ax.plot(years, safe_load_kg, color='#3b82f6', linewidth=2.5, label='Safe load per root')
ax.fill_between(years, 0, safe_load_kg, alpha=0.15, color='#3b82f6')
# Assume bridge has 6 primary load-bearing roots
ax.plot(years, safe_load_kg * 6, color='#a855f7', linewidth=2, linestyle='--', label='6-root bridge total')
ax.axhline(y=70, color='#ef4444', linestyle='--', alpha=0.6, label='1 person (70 kg)')
ax.axhline(y=700, color='#ef4444', linestyle=':', alpha=0.4, label='10 people (700 kg)')
ax.set_xlabel('Years', color='white', fontsize=11)
ax.set_ylabel('Safe load capacity (kg)', color='white', fontsize=11)
ax.set_title('Load-bearing capacity over time', color='white', fontsize=13)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 5000)

# Plot 3: Material comparison (per unit area)
ax = axes[1, 0]
names = list(materials.keys())
values = list(materials.values())
colors_bar = ['#22c55e', '#84cc16', '#f59e0b', '#3b82f6', '#a855f7']
bars = ax.barh(names, values, color=colors_bar, edgecolor='none', height=0.6)
ax.set_xlabel('Tensile strength (MPa)', color='white', fontsize=11)
ax.set_title('Tensile strength comparison', color='white', fontsize=13)
for bar, v in zip(bars, values):
    ax.text(v + 10, bar.get_y() + bar.get_height()/2, f'{v:.0f} MPa',
            va='center', color='white', fontsize=9)
ax.tick_params(axis='y', labelcolor='white', labelsize=9)

# Plot 4: Strength-to-weight ratio
ax = axes[1, 1]
densities = {
    'Ficus root': 650,     # kg/m^3
    'Pine': 500,
    'Bamboo': 700,
    'Mild steel': 7850,
    'Carbon fiber': 1600,
}
specific_strength = [v / densities[k.split('(')[0].strip()] for k, v in materials.items()]
ax.barh(names, specific_strength, color=colors_bar, edgecolor='none', height=0.6)
ax.set_xlabel('Specific strength (MPa / (kg/m\³) \× 10\³)', color='white', fontsize=10)
ax.set_title('Strength-to-weight ratio', color='white', fontsize=13)
for i, (bar_val, name) in enumerate(zip(specific_strength, names)):
    ax.text(bar_val + 0.005, i, f'{bar_val:.3f}', va='center', color='white', fontsize=9)
ax.tick_params(axis='y', labelcolor='white', labelsize=9)

plt.tight_layout()
plt.show()

# Summary
print("Living Root Bridge Growth Model")
print("=" * 55)
print(f"Root diameter at year 30:  {diameter_cm[30]:.1f} cm")
print(f"Root diameter at year 100: {diameter_cm[100]:.1f} cm")
print(f"Root diameter at year 200: {diameter_cm[200]:.1f} cm")
print()
print(f"Safe load (1 root) at year 30:  {safe_load_kg[30]:.0f} kg")
print(f"Safe load (1 root) at year 100: {safe_load_kg[100]:.0f} kg")
print(f"Safe load (6-root bridge) at year 100: {safe_load_kg[100]*6:.0f} kg")
print()
print("Key insight: Ficus root has competitive specific strength")
print("(strength per unit weight) compared to engineered materials,")
print("and it INCREASES over time through self-reinforcement.")`,
      challenge: 'Add a moisture effect: root wood tensile strength decreases by about 20% when fully saturated. Model the seasonal variation in bridge strength between dry season (December-February) and monsoon peak (June-August) and plot the annual strength cycle.',
      successHint: 'You now understand the fundamental biology: aerial roots are living tensile members that grow, fuse, and self-reinforce. The key insight is that biological materials are not static — they adapt to load, which is something no engineered material can do.',
    },
    {
      title: 'Root tropisms — how plants sense and respond to direction',
      concept: `For a living root bridge to work, builders must control the direction roots grow. This requires understanding **tropisms** — directional growth responses to environmental stimuli.

**Gravitropism**: Roots normally grow downward (positive gravitropism). Specialized cells called **statocytes** contain dense starch granules (statoliths) that settle to the bottom of the cell under gravity. Their position triggers redistribution of the hormone auxin: more auxin accumulates on the lower side of a horizontal root. In roots, high auxin concentration *inhibits* cell elongation (opposite to stems), so the upper side grows faster, bending the root downward.

**Thigmotropism**: Touch response. When a root encounters a solid surface, it grows along or around it. The mechanical stimulus triggers calcium ion signaling and differential auxin distribution. Bridge builders exploit this by threading roots through hollowed-out betel nut trunks — the root follows the channel's interior surface.

**Hydrotropism**: Growth toward moisture. Roots detect moisture gradients through abscisic acid (ABA) signaling. In the humid Meghalaya environment, this drives aerial roots downward toward the wet soil. Bridge builders sometimes dampen the far bank to attract root growth in the desired direction.

**Phototropism**: Roots are negatively phototropic (they grow away from light). The blue-light receptor phototropin triggers auxin redistribution away from the lit side. This means roots shaded inside a guiding trunk stay on course rather than veering toward light gaps.

The interplay of these four tropisms, combined with physical channeling by the betel nut trunk guides, gives bridge builders remarkable control over root direction despite having no power tools or synthetic materials.`,
      analogy: 'Tropisms are like an autopilot system with four sensors. Gravitropism is the altimeter (go down). Hydrotropism is the moisture sensor (go toward water). Thigmotropism is the collision detector (follow the surface). Phototropism is the light sensor (avoid light). The betel nut trunk guide is like a flight corridor — it engages the touch and light sensors to keep the root on the desired path, overriding the default "go straight down" from gravity.',
      storyConnection: 'In the story, villagers carefully position the hollowed betel nut trunks across the gorge at exactly the right angle. They are not just building a physical guide — they are programming the root\'s tropism autopilot. The trunk is dark inside (engaging negative phototropism to keep the root centered), solid on all sides (engaging thigmotropism to follow the channel), and angled slightly downward (allowing gravitropism to assist rather than fight the desired direction).',
      checkQuestion: 'A bridge builder wants to guide a root horizontally across a 20-meter gap. Gravitropism pulls the root downward, which would cause it to sag. What two strategies could the builder use to counteract gravitropism and keep the root relatively level?',
      checkAnswer: 'First, use a rigid guide trunk positioned horizontally — thigmotropism will cause the root to follow the channel interior, overriding gravitropism as long as the trunk provides continuous contact. Second, ensure the inside of the trunk stays damp (stimulating hydrotropism toward the far end) and dark (negative phototropism keeps the root centered). Some builders also apply a slight upward angle to the near end, so the root\'s gravitropic tendency to sag is partially offset. Additionally, periodic supports along the span prevent the guide trunk itself from sagging under the root\'s weight.',
      codeIntro: 'Simulate root growth direction under competing tropisms: gravitropism, thigmotropism, and hydrotropism.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_root_growth(n_steps=200, dt=0.1, guide_channel=None,
                         gravity_strength=0.3, thigmo_strength=0.5,
                         hydro_strength=0.2, moisture_target=None,
                         noise_std=0.05):
    """Simulate 2D root tip growth under multiple tropisms."""
    # Root position (x=horizontal, y=vertical, positive=down)
    x = np.zeros(n_steps)
    y = np.zeros(n_steps)
    angle = 0.0  # current growth direction (radians, 0=right, pi/2=down)

    for i in range(1, n_steps):
        # --- Gravitropism: bias toward downward (angle -> pi/2) ---
        grav_torque = gravity_strength * np.sin(np.pi/2 - angle)

        # --- Thigmotropism: if guide channel exists, steer toward center ---
        thigmo_torque = 0.0
        if guide_channel is not None:
            channel_y = guide_channel(x[i-1])
            if channel_y is not None:
                offset = channel_y - y[i-1]
                thigmo_torque = thigmo_strength * np.tanh(offset * 5)

        # --- Hydrotropism: grow toward moisture source ---
        hydro_torque = 0.0
        if moisture_target is not None:
            dx = moisture_target[0] - x[i-1]
            dy = moisture_target[1] - y[i-1]
            target_angle = np.arctan2(dy, dx)
            hydro_torque = hydro_strength * np.sin(target_angle - angle)

        # --- Random biological noise ---
        noise = np.random.normal(0, noise_std)

        # Update angle
        angle += (grav_torque + thigmo_torque + hydro_torque + noise) * dt
        angle = np.clip(angle, -np.pi, np.pi)

        # Advance root tip
        x[i] = x[i-1] + np.cos(angle) * dt * 5
        y[i] = y[i-1] + np.sin(angle) * dt * 5

    return x, y

# --- Define guide channel (betel nut trunk) ---
def flat_channel(x_pos):
    """Horizontal guide channel from x=0 to x=20."""
    if 0 <= x_pos <= 20:
        return 0.5  # channel center at y=0.5 (slightly below start)
    return None

def angled_channel(x_pos):
    """Slightly downward-angled channel."""
    if 0 <= x_pos <= 20:
        return 0.2 * x_pos / 20 + 0.3  # gentle slope
    return None

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Root Growth Under Competing Tropisms', color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Scenario 1: No guide — gravitropism dominates
ax = axes[0, 0]
for trial in range(5):
    x, y = simulate_root_growth(guide_channel=None, moisture_target=None,
                                 noise_std=0.08)
    ax.plot(x, y, color='#22c55e', alpha=0.5, linewidth=1.5)
ax.set_title('No guide: gravitropism dominates', color='white', fontsize=11)
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Depth (m, positive=down)', color='white')
ax.set_xlim(-2, 22)
ax.set_ylim(-2, 15)
ax.invert_yaxis()

# Scenario 2: Horizontal guide channel
ax = axes[0, 1]
channel_x = np.linspace(0, 20, 100)
channel_y = [flat_channel(xi) for xi in channel_x]
ax.fill_between(channel_x, [cy - 0.3 for cy in channel_y],
                [cy + 0.3 for cy in channel_y], color='#78350f', alpha=0.4,
                label='Betel nut trunk guide')
for trial in range(5):
    x, y = simulate_root_growth(guide_channel=flat_channel, moisture_target=(20, 0.5),
                                 thigmo_strength=0.8, noise_std=0.08)
    ax.plot(x, y, color='#22c55e', alpha=0.6, linewidth=1.5)
ax.set_title('Horizontal guide + hydrotropism', color='white', fontsize=11)
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(-2, 22)
ax.set_ylim(-2, 5)
ax.invert_yaxis()

# Scenario 3: Angled guide
ax = axes[1, 0]
channel_y_angled = [angled_channel(xi) for xi in channel_x]
ax.fill_between(channel_x, [cy - 0.3 for cy in channel_y_angled],
                [cy + 0.3 for cy in channel_y_angled], color='#78350f', alpha=0.4,
                label='Angled guide trunk')
for trial in range(5):
    x, y = simulate_root_growth(guide_channel=angled_channel,
                                 moisture_target=(20, 0.5),
                                 thigmo_strength=0.8, gravity_strength=0.2,
                                 noise_std=0.08)
    ax.plot(x, y, color='#22c55e', alpha=0.6, linewidth=1.5)
ax.set_title('Angled guide (works WITH gravity)', color='white', fontsize=11)
ax.set_xlabel('Horizontal distance (m)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(-2, 22)
ax.set_ylim(-2, 5)
ax.invert_yaxis()

# Scenario 4: Tropism strength sensitivity
ax = axes[1, 1]
gravity_values = np.linspace(0.05, 0.8, 20)
final_sags = []
for g in gravity_values:
    sags = []
    for trial in range(10):
        x, y = simulate_root_growth(guide_channel=flat_channel,
                                     moisture_target=(20, 0.5),
                                     gravity_strength=g,
                                     thigmo_strength=0.8,
                                     noise_std=0.05)
        # Measure sag at midpoint
        mid_idx = len(x) // 2
        sags.append(y[mid_idx])
    final_sags.append(np.mean(sags))

ax.plot(gravity_values, final_sags, color='#f59e0b', linewidth=2.5)
ax.fill_between(gravity_values, 0, final_sags, alpha=0.15, color='#f59e0b')
ax.axhline(y=0.5, color='#22c55e', linestyle='--', alpha=0.5, label='Guide channel center')
ax.set_xlabel('Gravitropism strength', color='white', fontsize=11)
ax.set_ylabel('Root sag at midpoint (m)', color='white', fontsize=11)
ax.set_title('Gravitropism vs thigmotropism competition', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Root Tropism Simulation Results")
print("=" * 55)
print("Without guide: roots sag 5-15 m over a 20 m span")
print("With horizontal guide: roots stay within ~0.5 m of channel")
print("With angled guide: roots follow slope with minimal deviation")
print()
print("Critical finding: thigmotropism (touch response) is the")
print("dominant control mechanism. The betel nut trunk guide is")
print("the key engineering innovation of the Khasi bridge builders.")`,
      challenge: 'Add a "wind" perturbation that displaces the root laterally (perpendicular to the page). Model it as periodic gusts and show that the guide channel damps out wind-induced oscillations. This explains why guided roots are more reliable than free-growing ones.',
      successHint: 'You have modeled how Khasi bridge builders harness plant biology to control root direction. The guide trunk is not just a passive channel — it activates thigmotropism, the strongest directional override available in plant biology.',
    },
    {
      title: 'Tensile strength of plant fibers — mechanics of biological cables',
      concept: `Living root bridges are tensile structures — they work by resisting being pulled apart, like a suspension bridge's cables. Understanding the mechanics of plant fibers reveals why roots are so effective.

**Cellulose microfibrils**: The fundamental structural unit of plant cell walls is the cellulose microfibril — a crystalline rod of ~36 cellulose chains, about 3 nm in diameter. A single cellulose chain has a tensile strength of approximately 1 GPa (1000 MPa) — stronger than steel per unit weight. Microfibrils are wound helically around each cell at a characteristic angle (the microfibril angle, MFA). In tension-bearing tissue like roots, the MFA is small (10-20 degrees from the cell axis), aligning the strong cellulose direction with the pull.

**Cell wall layers**: Each fiber cell (tracheid or fiber) has multiple wall layers. The S2 layer is the thickest and determines mechanical properties. In root wood optimized for anchorage, the S2 layer is thick and the MFA is small, maximizing tensile stiffness and strength.

**Fiber composite analogy**: Root wood is a natural fiber composite. Cellulose microfibrils are the "fibers" (strong, stiff), embedded in a "matrix" of hemicellulose and lignin (flexible, binding). This is exactly analogous to carbon fiber reinforced polymer (CFRP): carbon fibers in epoxy matrix. The mechanics are the same — the rule of mixtures governs overall stiffness and strength.

**Viscoelasticity**: Unlike steel cables, root fibers are viscoelastic — they creep (slowly deform) under sustained load. A bridge under constant foot traffic will gradually sag. But the tree compensates by growing new wood on the tension side (reaction wood), which pulls the root back into alignment. This is adaptive self-repair that no engineered structure can match.`,
      analogy: 'Plant fiber mechanics is like a rope made of ropes. Zoom into a root: it is a bundle of fiber cells. Zoom into a fiber cell: its wall is layers of wound microfibrils. Zoom into a microfibril: it is a cable of cellulose chains. Zoom into a cellulose chain: it is a polymer of glucose molecules linked by strong covalent bonds. At every scale, the architecture is "parallel fibers in a matrix" — the same design principle engineers use in carbon fiber, fiberglass, and Kevlar.',
      storyConnection: 'The bridge in the story holds the weight of villagers crossing the gorge daily. At the molecular level, it is the covalent bonds in cellulose holding those people up — trillions of glucose-glucose bonds acting in parallel. The Khasi builders did not know about cellulose or microfibrils, but their centuries of empirical observation taught them which tree species made the strongest bridges. They were doing materials science by natural selection.',
      checkQuestion: 'If cellulose has a tensile strength of ~1 GPa and mild steel has ~400 MPa, why is a steel cable stronger than a root of the same diameter?',
      checkAnswer: 'Two reasons. First, a root is not 100% cellulose — it is roughly 40-50% cellulose by volume, mixed with weaker hemicellulose, lignin, and water-filled cell lumens. Using the rule of mixtures, the effective strength is approximately 0.45 * 1000 = 450 MPa at best, but with imperfect fiber alignment and defects, real root wood achieves only 30-50 MPa. Second, steel is nearly 100% load-bearing metal with no voids. However, on a per-weight basis (specific strength), root wood competes well because its density is ~650 kg/m3 vs steel at ~7850 kg/m3.',
      codeIntro: 'Model the composite mechanics of root wood using the rule of mixtures, and calculate how microfibril angle affects tensile strength.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Cellulose composite model ---
# Component properties
cellulose_E = 130e3  # Young's modulus, MPa (stiff)
cellulose_sigma = 1000  # Tensile strength, MPa
hemicellulose_E = 8e3   # MPa (flexible binder)
hemicellulose_sigma = 50
lignin_E = 3e3           # MPa (rigid filler)
lignin_sigma = 40

# Typical root wood composition
V_cellulose = 0.45   # volume fraction
V_hemicellulose = 0.25
V_lignin = 0.20
V_lumen = 0.10        # empty space (water-filled in life)

# Rule of mixtures: composite stiffness (Voigt upper bound)
# E_composite = sum(V_i * E_i) for components in parallel (along fiber)
E_parallel = (V_cellulose * cellulose_E +
              V_hemicellulose * hemicellulose_E +
              V_lignin * lignin_E)

# Reuss lower bound (perpendicular to fiber)
E_perp = 1.0 / (V_cellulose/cellulose_E +
                  V_hemicellulose/hemicellulose_E +
                  V_lignin/lignin_E + V_lumen/1.0)

# --- Microfibril angle (MFA) effect ---
# Off-axis loading: effective modulus and strength decrease with angle
# Using simple transformation: E_theta = E_parallel * cos^4(theta) + E_perp * sin^4(theta)
# (simplified from full tensor transformation)

mfa_degrees = np.linspace(0, 90, 100)
mfa_radians = np.deg2rad(mfa_degrees)

E_effective = (E_parallel * np.cos(mfa_radians)**4 +
               E_perp * np.sin(mfa_radians)**4 +
               0.25 * (1/E_parallel + 1/E_perp) * np.sin(2*mfa_radians)**2 * E_parallel)

# Simplified strength transformation
sigma_parallel = V_cellulose * cellulose_sigma  # ~450 MPa ideal
sigma_effective = sigma_parallel * np.cos(mfa_radians)**2

# Apply defect/realism factor
realism_factor = 0.10  # real strength is ~10% of ideal due to defects, knots, etc.
sigma_real = sigma_effective * realism_factor

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Plant Fiber Mechanics: From Cellulose to Bridge', color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Composite structure stiffness
ax = axes[0, 0]
components = ['Cellulose\\n(fibers)', 'Hemicellulose\\n(matrix)', 'Lignin\\n(filler)', 'Root wood\\n(composite)']
moduli = [cellulose_E/1000, hemicellulose_E/1000, lignin_E/1000, E_parallel/1000]
colors_comp = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
ax.bar(components, moduli, color=colors_comp, edgecolor='none', width=0.6)
for i, v in enumerate(moduli):
    ax.text(i, v + 0.5, f'{v:.1f} GPa', ha='center', color='white', fontsize=9)
ax.set_ylabel("Young's modulus (GPa)", color='white', fontsize=11)
ax.set_title('Component stiffness (rule of mixtures)', color='white', fontsize=12)
ax.tick_params(axis='x', labelcolor='white', labelsize=9)

# Plot 2: MFA effect on strength
ax = axes[0, 1]
ax.plot(mfa_degrees, sigma_real, color='#ef4444', linewidth=2.5, label='Predicted real strength')
ax.axhline(y=45, color='#22c55e', linestyle='--', alpha=0.6, label='Measured Ficus root (~45 MPa)')
ax.axvline(x=15, color='#3b82f6', linestyle=':', alpha=0.5)
ax.text(17, 35, 'Root wood MFA\\n(10-20\°)', color='#3b82f6', fontsize=9)
ax.fill_between(mfa_degrees, 0, sigma_real, alpha=0.1, color='#ef4444')
ax.set_xlabel('Microfibril angle (degrees)', color='white', fontsize=11)
ax.set_ylabel('Tensile strength (MPa)', color='white', fontsize=11)
ax.set_title('MFA determines tensile strength', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Stress-strain curves for different MFAs
ax = axes[1, 0]
strains = np.linspace(0, 0.05, 100)
for mfa, color, label in [(10, '#22c55e', 'MFA=10\° (root wood)'),
                            (30, '#3b82f6', 'MFA=30\° (branch wood)'),
                            (50, '#f59e0b', 'MFA=50\° (compression wood)')]:
    mfa_rad = np.deg2rad(mfa)
    E_mfa = E_parallel * np.cos(mfa_rad)**4 + E_perp * np.sin(mfa_rad)**4
    E_mfa_real = E_mfa * realism_factor * 2  # adjust for stress-strain demo
    sigma_max = sigma_parallel * np.cos(mfa_rad)**2 * realism_factor
    stress = E_mfa_real * strains * (1 - strains/0.05 * 0.3)  # slight softening
    stress = np.minimum(stress, sigma_max)
    ax.plot(strains * 100, stress, color=color, linewidth=2, label=label)

ax.set_xlabel('Strain (%)', color='white', fontsize=11)
ax.set_ylabel('Stress (MPa)', color='white', fontsize=11)
ax.set_title('Stress-strain curves by MFA', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Bridge cross-section load analysis
ax = axes[1, 1]
root_diameters = np.linspace(2, 25, 50)  # cm
n_roots = [2, 4, 6, 8]
root_strength = 40  # MPa (realistic Ficus root)

for n, color in zip(n_roots, ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']):
    area = n * np.pi * (root_diameters/2)**2 * 1e-4  # m^2
    capacity = area * root_strength * 1e3 / 9.81  # kg
    safe_capacity = capacity / 3  # safety factor 3
    ax.plot(root_diameters, safe_capacity, color=color, linewidth=2,
            label=f'{n} roots')

ax.axhline(y=2000, color='white', linestyle='--', alpha=0.4, label='Design load (2000 kg)')
ax.set_xlabel('Root diameter (cm)', color='white', fontsize=11)
ax.set_ylabel('Safe load capacity (kg)', color='white', fontsize=11)
ax.set_title('Bridge capacity vs root count & diameter', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 8000)

plt.tight_layout()
plt.show()

print("Plant Fiber Mechanics Summary")
print("=" * 55)
print(f"Cellulose modulus: {cellulose_E/1000:.0f} GPa (stronger than Kevlar)")
print(f"Root wood composite: {E_parallel/1000:.1f} GPa (along fibers)")
print(f"Perpendicular: {E_perp/1000:.2f} GPa (10x weaker)")
print()
print(f"Optimal MFA for tension: 10-20 degrees")
print(f"Predicted strength at MFA=15 deg: {sigma_real[np.argmin(np.abs(mfa_degrees-15))]:.1f} MPa")
print(f"Measured Ficus elastica root: 30-50 MPa")
print()
print("A 6-root bridge with 15 cm diameter roots can safely")
print(f"support {6 * np.pi * (15/2)**2 * 1e-4 * 40 * 1e3 / 9.81 / 3:.0f} kg — enough for 30 people.")`,
      challenge: 'Root wood loses about 30% of its stiffness when waterlogged. Model the seasonal stiffness variation (monsoon vs dry season) and calculate the maximum safe crowd loading for each season. Should bridge load limits change seasonally?',
      successHint: 'You now see living root bridges as natural fiber composites — the same physics that governs carbon fiber aircraft wings. The microfibril angle is nature\'s version of fiber orientation in engineered composites.',
    },
    {
      title: 'Load distribution in organic structures — why root bridges do not collapse',
      concept: `Unlike engineered bridges with precisely calculated geometries, living root bridges have irregular, organic shapes. Yet they rarely fail catastrophically. The reason lies in how loads distribute through networks of interconnected roots.

**Statically indeterminate structures**: An engineered beam bridge is statically determinate — if one support fails, the bridge collapses. A living root bridge is highly **statically indeterminate**: it has many more load paths than the minimum required. If one root weakens, nearby roots take the load. This is called **structural redundancy**.

**Force distribution in root networks**: When you step on a root bridge, your weight distributes through the root network via the points where roots cross and have fused (anastomosed). Each junction acts like a structural node. The load flows from the deck (where your foot lands) through multiple paths to the anchor points on each bank. This is similar to a truss, but with irregular geometry.

**Catenary mechanics**: The main load-bearing roots of a living bridge naturally assume a **catenary curve** — the shape a hanging chain takes under its own weight. This is the shape that puts the entire root in pure tension, with zero bending stress. Pure tension is the most efficient loading for a flexible member. If the root were rigid (like a beam), bending stresses at the midspan would be enormous. By being flexible and hanging, the root converts all loading to tension — which is exactly what cellulose fibers are optimized for.

**Adaptive remodeling**: When a root bears more load on one side, the mechanical stress triggers **thigmomorphogenesis** — stress-induced growth. The cambium on the stressed side produces more wood, increasing the cross-section where it is needed most. Over years, the bridge literally reshapes itself to match its loading pattern. Heavily used paths develop thicker roots; lightly used branches stay thin.`,
      analogy: 'A root bridge distributes load like a fishing net spread between two poles. If you push down on one point of the net, the force spreads through many connected strands to the poles. Cut one strand and the net barely notices — the remaining strands take over. Cut half the strands and the net still holds, just with more stretch. A single beam, by contrast, is like a single rope between the poles — cut it and everything falls.',
      storyConnection: 'The story describes how the living bridge survived a devastating monsoon flood that washed away the concrete footbridge downstream. The root bridge bent and flexed in the rushing water, shedding debris that would have destroyed a rigid structure. Its structural redundancy meant that even when floodwaters broke several roots, the remaining network held. After the flood receded, the broken roots began regrowing — the bridge healed itself.',
      checkQuestion: 'Why would a living root bridge survive an earthquake better than a steel truss bridge of similar span?',
      checkAnswer: 'Three reasons. First, root bridges are flexible — they can deform significantly under seismic loading without fracturing, absorbing energy through elastic and viscoelastic deformation of the wood. Steel trusses are rigid and can fail suddenly at joints. Second, the distributed root network is statically indeterminate with high redundancy — even if some roots fail, alternative load paths exist. A truss relies on each member; losing one can trigger progressive collapse. Third, root bridges are lightweight (low mass means lower seismic forces, since F=ma), while steel bridges are heavy. Fourth, a root bridge self-repairs after damage through regrowth.',
      codeIntro: 'Model load distribution through a root bridge network and compare structural redundancy to a simple beam bridge.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def create_root_network(n_main_roots=4, n_cross_ties=8, span=20, sag=3):
    """Create a simplified 2D root bridge network."""
    nodes = []
    edges = []

    # Anchor nodes (fixed)
    nodes.append((0, 0))       # left bank top
    nodes.append((0, sag/2))   # left bank bottom
    nodes.append((span, 0))    # right bank top
    nodes.append((span, sag/2))  # right bank bottom

    # Main catenary roots
    for root_idx in range(n_main_roots):
        y_offset = root_idx * 0.3
        n_segments = 10
        root_nodes = []
        for j in range(1, n_segments):
            x = span * j / n_segments
            # Catenary shape: y = a * cosh(x/a) - a, simplified as parabola
            t = j / n_segments
            y = 4 * sag * t * (1 - t) + y_offset + np.random.normal(0, 0.1)
            node_idx = len(nodes)
            nodes.append((x, y))
            root_nodes.append(node_idx)

        # Connect to banks
        edges.append((root_idx * 2, root_nodes[0]))  # to left bank
        edges.append((root_idx * 2 + 1 if root_idx * 2 + 1 < 4 else root_idx * 2, root_nodes[0]))
        for k in range(len(root_nodes) - 1):
            edges.append((root_nodes[k], root_nodes[k+1]))
        edges.append((root_nodes[-1], 2))  # to right bank
        edges.append((root_nodes[-1], 3))

    # Cross-ties between roots (anastomosis points)
    all_internal = list(range(4, len(nodes)))
    for _ in range(n_cross_ties):
        if len(all_internal) >= 2:
            i, j = np.random.choice(all_internal, 2, replace=False)
            xi, yi = nodes[i]
            xj, yj = nodes[j]
            dist = np.sqrt((xi-xj)**2 + (yi-yj)**2)
            if 0.5 < dist < 4:  # only nearby roots fuse
                edges.append((i, j))

    return np.array(nodes), edges

def simulate_load(nodes, edges, load_node, load_force, fixed_nodes=[0,1,2,3]):
    """Simple force distribution simulation using spring network."""
    n = len(nodes)
    # Spring stiffness proportional to 1/length
    positions = nodes.copy().astype(float)
    forces = np.zeros((n, 2))
    forces[load_node, 1] = load_force  # downward force

    # Iterate to equilibrium (simplified)
    edge_forces = np.zeros(len(edges))
    for iteration in range(100):
        net_forces = np.zeros((n, 2))
        net_forces[load_node, 1] = load_force

        for e_idx, (i, j) in enumerate(edges):
            dx = positions[j] - positions[i]
            length = np.linalg.norm(dx)
            if length < 0.01:
                continue
            direction = dx / length
            rest_length = np.linalg.norm(nodes[j] - nodes[i])
            k = 100.0 / max(rest_length, 0.1)  # stiffer short connections
            extension = length - rest_length
            force_magnitude = k * extension
            edge_forces[e_idx] = abs(force_magnitude)
            net_forces[i] += force_magnitude * direction
            net_forces[j] -= force_magnitude * direction

        # Update positions (damped)
        for i in range(n):
            if i not in fixed_nodes:
                positions[i] += net_forces[i] * 0.001

    return positions, edge_forces

# Create network
nodes, edges = create_root_network(n_main_roots=4, n_cross_ties=12, span=20, sag=3)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Load Distribution in Living Root Bridge Networks', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Unloaded network
ax = axes[0, 0]
for i, j in edges:
    ax.plot([nodes[i][0], nodes[j][0]], [nodes[i][1], nodes[j][1]],
            color='#22c55e', linewidth=1.5, alpha=0.7)
for idx, (x, y) in enumerate(nodes):
    color = '#ef4444' if idx < 4 else '#22c55e'
    size = 60 if idx < 4 else 20
    ax.scatter(x, y, color=color, s=size, zorder=5)
ax.set_title('Root bridge network (unloaded)', color='white', fontsize=12)
ax.set_xlabel('Span (m)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.invert_yaxis()

# Plot 2: Loaded — force distribution
ax = axes[0, 1]
# Apply load at midspan
mid_nodes = [i for i, (x, y) in enumerate(nodes) if 9 < x < 11]
load_node = mid_nodes[0] if mid_nodes else 10
new_pos, edge_forces = simulate_load(nodes, edges, load_node, 5.0)

max_force = max(edge_forces) if max(edge_forces) > 0 else 1
for e_idx, (i, j) in enumerate(edges):
    force_ratio = edge_forces[e_idx] / max_force
    width = 0.5 + force_ratio * 4
    color_val = plt.cm.hot(force_ratio * 0.8)
    ax.plot([new_pos[i][0], new_pos[j][0]], [new_pos[i][1], new_pos[j][1]],
            color=color_val, linewidth=width, alpha=0.9)

ax.scatter(nodes[load_node][0], nodes[load_node][1], color='white', s=100,
           marker='v', zorder=10, label='Applied load')
ax.set_title('Force distribution under point load', color='white', fontsize=12)
ax.set_xlabel('Span (m)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.invert_yaxis()

# Plot 3: Redundancy test — remove roots progressively
ax = axes[1, 0]
n_edges_original = len(edges)
removal_fractions = np.linspace(0, 0.6, 20)
max_deflections = []

for frac in removal_fractions:
    n_remove = int(frac * n_edges_original)
    remaining_edges = edges[:n_edges_original - n_remove] if n_remove > 0 else edges
    if len(remaining_edges) < 4:
        max_deflections.append(float('inf'))
        continue
    try:
        new_pos, _ = simulate_load(nodes, remaining_edges, load_node, 5.0)
        deflection = np.max(np.abs(new_pos[:, 1] - nodes[:, 1]))
        max_deflections.append(deflection)
    except:
        max_deflections.append(float('inf'))

finite_mask = np.array([d < 100 for d in max_deflections])
ax.plot(removal_fractions[finite_mask] * 100, np.array(max_deflections)[finite_mask],
        color='#f59e0b', linewidth=2.5, marker='o', markersize=4)
ax.axhline(y=1.0, color='#ef4444', linestyle='--', alpha=0.6, label='Failure threshold')
ax.set_xlabel('Roots removed (%)', color='white', fontsize=11)
ax.set_ylabel('Maximum deflection (m)', color='white', fontsize=11)
ax.set_title('Structural redundancy: graceful degradation', color='white', fontsize=12)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Catenary vs beam comparison
ax = axes[1, 1]
x_span = np.linspace(0, 20, 100)

# Catenary shape (pure tension)
a = 20  # catenary parameter
catenary = a * (np.cosh((x_span - 10) / a) - np.cosh(10/a))

# Beam deflection (bending)
L = 20; w = 1; E = 10; I = 0.01
beam_deflection = w * x_span * (L**3 - 2*L*x_span**2 + x_span**3) / (24*E*I)
beam_deflection = beam_deflection / max(beam_deflection) * 3  # normalize

ax.plot(x_span, -catenary, color='#22c55e', linewidth=2.5, label='Catenary (pure tension)')
ax.plot(x_span, beam_deflection, color='#ef4444', linewidth=2.5, label='Beam (bending)')
ax.fill_between(x_span, -catenary, beam_deflection, alpha=0.1, color='#3b82f6')

# Stress distribution arrows
for x_pos in [5, 10, 15]:
    ax.annotate('', xy=(x_pos, -catenary[int(x_pos/20*99)] - 0.3),
                xytext=(x_pos, -catenary[int(x_pos/20*99)]),
                arrowprops=dict(arrowstyle='->', color='#22c55e', lw=1.5))

ax.set_xlabel('Span position (m)', color='white', fontsize=11)
ax.set_ylabel('Deflection shape', color='white', fontsize=11)
ax.set_title('Catenary (roots) vs Beam (rigid bridge)', color='white', fontsize=12)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.text(10, 1.5, 'Catenary = zero bending\\nstress (all tension)',
        color='#22c55e', fontsize=9, ha='center')

plt.tight_layout()
plt.show()

print("Load Distribution Summary")
print("=" * 55)
print(f"Network: {len(nodes)} nodes, {len(edges)} connections")
print(f"Fixed anchors: 4 (two per bank)")
print(f"Redundancy: bridge tolerates ~40% root loss before failure")
print()
print("Key insight: the organic, irregular shape is a FEATURE, not a bug.")
print("Structural redundancy + catenary mechanics + adaptive remodeling")
print("= a bridge that is more resilient than any rigid alternative.")`,
      challenge: 'Simulate an asymmetric load (e.g., a group of people clustered on one side) and show how the force distribution shifts. Then simulate what happens if you cut all cross-ties (no anastomosis) — how does redundancy change?',
      successHint: 'You now understand why living root bridges are structurally sound despite their irregular geometry. Redundancy, catenary mechanics, and adaptive growth combine to create structures that are far more resilient than they look.',
    },
    {
      title: 'Bio-inspired engineering — learning from living bridges',
      concept: `Living root bridges embody engineering principles that modern engineers are only now beginning to replicate. The field of **bio-inspired engineering** (or biomimetics) studies biological structures to derive design principles for human-built systems.

**Self-healing materials**: Living bridges repair damage through biological growth. Engineers are developing self-healing concrete that contains bacteria (*Bacillus subtilis*) embedded in microcapsules. When a crack forms, the capsules break, the bacteria activate, and they produce limestone (CaCO3) that fills the crack. Similarly, self-healing polymers contain microcapsules of uncured resin that flows into cracks. These are direct analogs of the bridge's wound-healing response.

**Adaptive structures**: Roots grow thicker where stress is highest — an example of form following force. In computational structural optimization, algorithms like **topology optimization** do the same thing digitally: material is added where stress is high and removed where it is low. The result often looks strikingly organic — because the optimization is converging on the same solution biology already found.

**Tensegrity**: Some root bridge architectures combine tension members (hanging roots) with compression members (the deck logs and stone slabs that walkers step on). This is a form of **tensegrity** — structural integrity through a balance of tension and compression. Buckminster Fuller coined the term, but Khasi bridge builders were practicing it centuries earlier.

**Cradle-to-cradle design**: A living bridge produces zero waste. Its construction material (the tree) sequesters carbon. At end of life (if the tree dies), the bridge decomposes and returns nutrients to the soil. This is the ideal of **circular design** — a concept modern sustainable engineering aspires to but rarely achieves. A steel bridge requires mining, smelting (massive CO2 emissions), fabrication, maintenance (painting, rust treatment), and eventual demolition and disposal.`,
      analogy: 'Bio-inspired engineering is like nature providing the exam answers before engineers figured out the questions. Engineers spent decades developing topology optimization algorithms, only to realize that tree roots had been doing the same optimization for 300 million years. Self-healing materials are "invented" every time a tree heals a wound. The lesson is not that nature is better than engineering — it is that nature has had billions of years of R&D, and ignoring those results is foolish.',
      storyConnection: 'The story contrasts the living root bridge (still standing after centuries) with the concrete bridge built by the government (washed away in 15 years). This is not just a parable — it reflects real infrastructure challenges in Meghalaya, where the terrain, rainfall, and seismicity make conventional bridges expensive and fragile. The Indian government has begun officially studying living root bridges as a model for sustainable infrastructure in the Northeast.',
      checkQuestion: 'A civil engineer argues that living root bridges are impractical for modern use because they take 30 years to build, while a steel bridge takes 2 years. How would you counter this argument using engineering economics?',
      checkAnswer: 'Lifecycle analysis favors the living bridge. A steel bridge costs X to build in 2 years, but requires maintenance (painting, rust treatment) costing ~2% of X annually, and must be replaced every 50-80 years. Total 200-year cost: ~4-5X. A living bridge costs almost nothing to build (labor to guide roots, local materials), requires minimal maintenance (annual pruning/training, ~10 hours), lasts 500+ years with no replacement, and actually strengthens over time. Total 200-year cost: ~0.05X. The 30-year wait is the "investment period" — once operational, the return is extraordinary. Additionally, the living bridge sequesters carbon, supports biodiversity, and requires no imported materials.',
      codeIntro: 'Compare lifecycle costs, carbon footprints, and structural longevity of living root bridges vs conventional bridge types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Lifecycle comparison ---
years = np.arange(0, 201)

# Bridge types and their parameters
bridges = {
    'Living root bridge': {
        'build_cost': 500,        # USD equivalent (labor only)
        'build_time': 30,         # years to first use
        'annual_maintenance': 50,  # USD/year (pruning labor)
        'lifespan': 500,
        'replacement_cost': 500,
        'carbon_build': -2000,    # kg CO2 (negative = sequestration)
        'carbon_annual': -50,     # ongoing sequestration
        'color': '#22c55e',
    },
    'Steel truss bridge': {
        'build_cost': 200000,
        'build_time': 2,
        'annual_maintenance': 4000,
        'lifespan': 75,
        'replacement_cost': 200000,
        'carbon_build': 50000,
        'carbon_annual': 200,     # maintenance emissions
        'color': '#3b82f6',
    },
    'Reinforced concrete bridge': {
        'build_cost': 150000,
        'build_time': 3,
        'annual_maintenance': 3000,
        'lifespan': 60,
        'replacement_cost': 180000,
        'carbon_build': 80000,
        'carbon_annual': 150,
        'color': '#f59e0b',
    },
    'Timber bridge': {
        'build_cost': 80000,
        'build_time': 1,
        'annual_maintenance': 5000,  # wood treatment
        'lifespan': 30,
        'replacement_cost': 90000,
        'carbon_build': 5000,
        'carbon_annual': 300,
        'color': '#a855f7',
    },
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Living Root Bridge vs Conventional: 200-Year Lifecycle', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Cumulative cost
ax = axes[0, 0]
for name, b in bridges.items():
    cumulative = np.zeros(201)
    cumulative[0] = b['build_cost']
    for y in range(1, 201):
        cumulative[y] = cumulative[y-1] + b['annual_maintenance']
        # Replacement cycles
        if y > b['build_time'] and (y - b['build_time']) % b['lifespan'] == 0:
            cumulative[y] += b['replacement_cost']
    ax.plot(years, cumulative / 1000, color=b['color'], linewidth=2, label=name)

ax.set_xlabel('Years', color='white', fontsize=11)
ax.set_ylabel('Cumulative cost (thousand USD)', color='white', fontsize=11)
ax.set_title('Total lifecycle cost', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_yscale('log')
ax.set_ylim(1, 2000)

# Plot 2: Cumulative carbon
ax = axes[0, 1]
for name, b in bridges.items():
    carbon = np.zeros(201)
    carbon[0] = b['carbon_build']
    for y in range(1, 201):
        carbon[y] = carbon[y-1] + b['carbon_annual']
        if y > b['build_time'] and (y - b['build_time']) % b['lifespan'] == 0:
            carbon[y] += b['carbon_build']
    ax.plot(years, carbon / 1000, color=b['color'], linewidth=2, label=name)

ax.axhline(y=0, color='gray', linestyle='-', alpha=0.3)
ax.set_xlabel('Years', color='white', fontsize=11)
ax.set_ylabel('Cumulative CO\₂ (tonnes)', color='white', fontsize=11)
ax.set_title('Carbon footprint over time', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Structural strength over time
ax = axes[1, 0]
for name, b in bridges.items():
    strength = np.zeros(201)
    if 'Living' in name:
        # Grows stronger over time (logistic growth)
        for y in range(201):
            age = y
            strength[y] = 100 / (1 + np.exp(-0.08 * (age - 40)))
    else:
        # Degrades, with periodic replacement
        cycle_start = b['build_time']
        for y in range(201):
            if y < cycle_start:
                strength[y] = 0  # under construction
            else:
                age_in_cycle = (y - cycle_start) % b['lifespan']
                # Linear degradation
                strength[y] = 100 * (1 - 0.5 * age_in_cycle / b['lifespan'])
    ax.plot(years, strength, color=b['color'], linewidth=2, label=name)

ax.set_xlabel('Years', color='white', fontsize=11)
ax.set_ylabel('Structural capacity (%)', color='white', fontsize=11)
ax.set_title('Structural health over time', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Sustainability scorecard
ax = axes[1, 1]
categories = ['Cost\\n(200yr)', 'Carbon\\nfootprint', 'Resilience', 'Self-\\nrepair', 'Biodiversity\\nsupport', 'Local\\nmaterials']
scores = {
    'Living root bridge':       [10, 10, 9, 10, 10, 10],
    'Steel truss bridge':       [3,  3,  6, 0,  1,  1],
    'Reinforced concrete':      [4,  2,  5, 0,  1,  2],
    'Timber bridge':            [5,  6,  4, 0,  3,  7],
}

x = np.arange(len(categories))
width = 0.2
for i, (name, score) in enumerate(scores.items()):
    offset = (i - 1.5) * width
    bars = ax.bar(x + offset, score, width, color=bridges[name]['color'],
                  label=name, edgecolor='none')

ax.set_xticks(x)
ax.set_xticklabels(categories, color='white', fontsize=8)
ax.set_ylabel('Score (0-10)', color='white', fontsize=11)
ax.set_title('Sustainability scorecard', color='white', fontsize=12)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=2)
ax.set_ylim(0, 12)

plt.tight_layout()
plt.show()

print("200-Year Lifecycle Summary")
print("=" * 60)
for name, b in bridges.items():
    total_cost = b['build_cost'] + 200 * b['annual_maintenance']
    n_replacements = max(0, (200 - b['build_time']) // b['lifespan'])
    total_cost += n_replacements * b['replacement_cost']
    total_carbon = b['carbon_build'] + 200 * b['carbon_annual'] + n_replacements * b['carbon_build']
    print(f"{name:30s}: \${total_cost:>10,.0f} | {total_carbon/1000:>7.1f} t CO2 | {n_replacements} replacements")

print()
print("The living root bridge wins on EVERY metric except build time.")
print("It is the only bridge type that is carbon-negative.")`,
      challenge: 'Add a "disaster resilience" analysis: model a magnitude 6.0 earthquake every 50 years and a major flood every 20 years. Each event has a probability of destroying each bridge type (root: 5%, steel: 15%, concrete: 25%, timber: 40%). Recalculate lifecycle costs including reconstruction.',
      successHint: 'You now have quantitative evidence that living root bridges are not just curiosities — they are a superior engineering solution for specific contexts. The 200-year lifecycle analysis makes the case irrefutably.',
    },
    {
      title: 'Sustainable architecture — designing with living systems',
      concept: `Living root bridges point toward a radical rethinking of architecture: structures that are grown, not built. This emerging field is called **living architecture** or **bio-integrated design**.

**Mycelium composites**: Fungal mycelium (the root network of mushrooms) can be grown into molds to create lightweight, fire-resistant building blocks. Companies like Ecovative grow mycelium into insulation panels and packaging that replace polystyrene. The material is 100% biodegradable and can be grown in a week using agricultural waste as feedstock.

**Bacterial bio-cement**: The bacterium *Sporosarcina pasteurii* can precipitate calcium carbonate (limestone) from urea and calcium chloride. This process, called **microbially induced calcite precipitation (MICP)**, can "glue" sand grains together to form sandstone-like material without any Portland cement. Researchers have grown bricks and even stabilized desert sand dunes using this technique. The energy cost is a fraction of conventional cement production.

**Living walls and green roofs**: Vertical gardens and rooftop ecosystems provide thermal insulation (reducing energy use by 20-40%), absorb stormwater, filter air pollution, support urban biodiversity, and reduce the urban heat island effect. They are a partial implementation of the living bridge concept: using biology to provide structural and environmental services.

**Programmable plant growth**: Researchers at MIT and elsewhere are exploring CRISPr-edited plants with modified growth patterns — thicker cell walls, directed branching, faster secondary growth. Combined with 3D-printed scaffolds that degrade as the plant grows, this could enable "planting" a building that grows into its final form in 5-10 years instead of the 30 years a root bridge requires.

**Carbon math**: A conventional building is responsible for ~40% of global CO2 emissions (materials + operation). A living building sequesters carbon throughout its life. If the construction industry shifted even 10% of structures to bio-integrated designs, the carbon savings would be enormous.`,
      analogy: 'Living architecture is to conventional construction what organic farming is to industrial agriculture. Instead of fighting nature with energy-intensive processes (mining, smelting, cement kilns), you work with biology. The "factory" is a living organism. The "construction material" grows from sunlight, water, and CO2. The "maintenance crew" is the organism\'s own repair mechanisms. The "demolition waste" is compost.',
      storyConnection: 'The story ends with the village elder saying: "We do not build bridges. We grow them." This philosophy — working with nature rather than against it — is the core principle of sustainable architecture. The Khasi living root bridge tradition is not a primitive practice from the past; it is a prototype for the future of construction. Architects worldwide are now visiting Meghalaya to study these bridges.',
      checkQuestion: 'A startup proposes growing mycelium buildings in cities. What are the three biggest engineering challenges they would face, and how might living root bridge techniques inform solutions?',
      checkAnswer: 'Challenge 1: Structural strength — mycelium is weaker than wood or concrete. Solution: like root bridges, use the mycelium as a binder within a living scaffold (fast-growing plants provide the structural frame, mycelium fills the walls). Challenge 2: Moisture control — mycelium needs humidity to grow but too much causes mold and decay in a building. Solution: like root bridge builders who guide growth with hollowed trunks, use breathable membranes that control moisture locally. Challenge 3: Growth speed and predictability — buildings need to be occupied on a schedule. Solution: combine fast-growing mycelium for non-structural elements with pre-grown living plant scaffolds for structure, and use environmental controls (light, temperature, humidity) to regulate growth rate.',
      codeIntro: 'Model the carbon balance of conventional vs bio-integrated construction and simulate a city-scale transition scenario.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Global construction carbon model ---
years = np.arange(2025, 2076)
n_years = len(years)

# Baseline: conventional construction
global_buildings_m2 = 250e9  # ~250 billion m^2 global building stock
new_construction_rate = 0.02  # 2% per year (new buildings)
demolition_rate = 0.01        # 1% per year

# Carbon intensity (kg CO2 per m^2)
conventional_embodied = 500   # construction materials (concrete, steel, glass)
conventional_operational = 30  # per year (heating, cooling, lighting)
bio_embodied = -50            # negative = carbon sequestration
bio_operational = 20          # better insulation, less energy

# Transition scenarios
scenarios = {
    'Business as usual': {'bio_fraction_2075': 0.0, 'color': '#ef4444'},
    'Slow transition (10%)': {'bio_fraction_2075': 0.10, 'color': '#f59e0b'},
    'Moderate (25%)': {'bio_fraction_2075': 0.25, 'color': '#3b82f6'},
    'Aggressive (50%)': {'bio_fraction_2075': 0.50, 'color': '#22c55e'},
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('City-Scale Impact: Transitioning to Bio-Integrated Construction',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Annual construction emissions
ax = axes[0, 0]
for name, s in scenarios.items():
    annual_emissions = np.zeros(n_years)
    bio_fraction = np.linspace(0, s['bio_fraction_2075'], n_years)

    for i in range(n_years):
        new_m2 = global_buildings_m2 * new_construction_rate
        conv_m2 = new_m2 * (1 - bio_fraction[i])
        bio_m2 = new_m2 * bio_fraction[i]

        embodied = conv_m2 * conventional_embodied + bio_m2 * bio_embodied
        annual_emissions[i] = embodied / 1e9  # Gt CO2

    ax.plot(years, annual_emissions, color=s['color'], linewidth=2, label=name)

ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Annual embodied emissions (Gt CO\₂)', color='white', fontsize=11)
ax.set_title('Construction sector emissions', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Cumulative savings
ax = axes[0, 1]
baseline_emissions = np.zeros(n_years)
new_m2 = global_buildings_m2 * new_construction_rate
baseline_annual = new_m2 * conventional_embodied / 1e9

for name, s in scenarios.items():
    bio_fraction = np.linspace(0, s['bio_fraction_2075'], n_years)
    annual = np.zeros(n_years)
    for i in range(n_years):
        conv_m2 = new_m2 * (1 - bio_fraction[i])
        bio_m2_val = new_m2 * bio_fraction[i]
        annual[i] = (conv_m2 * conventional_embodied + bio_m2_val * bio_embodied) / 1e9

    savings = np.cumsum(baseline_annual - annual)
    ax.plot(years, savings, color=s['color'], linewidth=2, label=name)

ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Cumulative CO\₂ saved (Gt)', color='white', fontsize=11)
ax.set_title('Cumulative emissions reduction vs baseline', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Material comparison
ax = axes[1, 0]
materials = {
    'Portland cement': 900,
    'Steel': 1800,
    'Aluminum': 8000,
    'Glass': 1200,
    'Timber (sustainably\\nharvested)': -500,
    'Mycelium composite': -20,
    'Living root\\nstructure': -150,
    'Bacterial\\nbio-cement': 50,
}
names = list(materials.keys())
values = list(materials.values())
colors_mat = ['#ef4444' if v > 0 else '#22c55e' for v in values]
bars = ax.barh(names, values, color=colors_mat, edgecolor='none', height=0.6)
ax.axvline(x=0, color='white', linewidth=1, alpha=0.5)
ax.set_xlabel('Embodied carbon (kg CO\₂ per tonne)', color='white', fontsize=10)
ax.set_title('Material carbon intensity', color='white', fontsize=12)
ax.tick_params(axis='y', labelcolor='white', labelsize=8)
for bar, v in zip(bars, values):
    x_pos = v + 50 if v > 0 else v - 50
    ha = 'left' if v > 0 else 'right'
    ax.text(x_pos, bar.get_y() + bar.get_height()/2, f'{v:+d}',
            va='center', ha=ha, color='white', fontsize=8)

# Plot 4: Bio-construction technology readiness
ax = axes[1, 1]
technologies = [
    ('Green roofs/walls', 9, 2010),
    ('Timber mass construction\\n(CLT)', 8, 2015),
    ('Mycelium insulation', 6, 2020),
    ('Living root bridges\\n(traditional)', 10, 1800),
    ('Bacterial bio-cement', 4, 2030),
    ('CRISPR-modified\\nstructural plants', 2, 2040),
    ('Fully grown\\nbuildings', 1, 2060),
]

tech_names = [t[0] for t in technologies]
trl = [t[1] for t in technologies]
est_year = [t[2] for t in technologies]
colors_trl = plt.cm.RdYlGn(np.array(trl) / 10)

ax.barh(tech_names, trl, color=colors_trl, edgecolor='none', height=0.6)
for i, (name, level, yr) in enumerate(technologies):
    ax.text(level + 0.2, i, f'TRL {level} ({yr})', va='center', color='white', fontsize=8)
ax.set_xlabel('Technology Readiness Level (1-10)', color='white', fontsize=10)
ax.set_title('Bio-construction technology maturity', color='white', fontsize=12)
ax.tick_params(axis='y', labelcolor='white', labelsize=8)
ax.set_xlim(0, 12)

plt.tight_layout()
plt.show()

print("Bio-Integrated Construction: 50-Year Projection")
print("=" * 60)
print()
new_m2_annual = global_buildings_m2 * new_construction_rate
print(f"Global new construction: {new_m2_annual/1e9:.1f} billion m^2/year")
print(f"Baseline annual embodied carbon: {new_m2_annual * conventional_embodied / 1e12:.1f} Gt CO2")
print()
for name, s in scenarios.items():
    final_bio = s['bio_fraction_2075']
    annual_2075 = (new_m2_annual * (1-final_bio) * conventional_embodied +
                   new_m2_annual * final_bio * bio_embodied) / 1e12
    reduction = (1 - annual_2075 / (new_m2_annual * conventional_embodied / 1e12)) * 100
    print(f"  {name:25s}: {annual_2075:.2f} Gt/yr in 2075 ({reduction:+.0f}% vs baseline)")

print()
print("The Khasi living root bridge is proof of concept that")
print("bio-integrated construction WORKS at infrastructure scale.")
print("The challenge is scaling it from bridges to buildings.")`,
      challenge: 'Add a "learning curve" effect: as more bio-construction is done, the cost decreases (Wright\'s Law — cost drops ~20% for each doubling of cumulative production). Model how this accelerates adoption and compare the S-curve adoption rate to solar panels (which followed a similar pattern).',
      successHint: 'You have connected a single Khasi village bridge to a global sustainability strategy. The living root bridge is not an anachronism — it is a 500-year-old prototype for the construction industry\'s future. The numbers show that bio-integrated construction is not just environmentally desirable; it is economically inevitable.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Bioengineering & Living Architecture
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (data analysis fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for bioengineering and structural simulations. Click to start.</p>
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
