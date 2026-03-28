import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LittleBoatLevel3() {
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
      title: 'Archimedes\' principle & buoyancy',
      concept: `When you place an object in water, the water pushes back. This upward force is called **buoyancy**, and Archimedes discovered its precise law over 2,000 years ago: the buoyant force on a submerged object equals the weight of the fluid it displaces. Mathematically, F_b = rho_water * g * V_displaced, where rho_water is the density of water (about 1000 kg/m^3 for fresh water), g is gravitational acceleration (9.81 m/s^2), and V_displaced is the volume of water pushed aside by the object.

A boat floats when the buoyant force equals its weight. This happens when the boat displaces a volume of water whose weight matches the boat's total weight. A solid block of steel sinks because its density (7800 kg/m^3) is much greater than water's. But shape a thin sheet of steel into a hollow hull, and the enclosed air makes the average density of the hull-plus-air system less than water. The boat displaces a large volume of water while keeping its total mass modest.

The **waterline** — where the water surface meets the hull — rises as you add cargo and falls as you unload. Naval architects call the mass of water displaced at the design waterline the **displacement** of the vessel. A small bamboo boat on the Brahmaputra might displace 50 kg; a cargo ferry displaces thousands of tonnes. The physics is identical at every scale.`,
      analogy: 'Imagine standing in a crowded elevator. The more people who squeeze in, the harder the floor pushes up on everyone (the floor is like buoyancy). If the total weight exceeds what the cable can hold, the elevator drops — just like a boat sinks when overloaded. The boat "negotiates" with the water: it sinks just deep enough that the displaced water weighs exactly as much as the boat.',
      storyConnection: 'In "The Little Boat That Learned to Float," the boat discovers that floating is not magic but a precise balance of forces. Every river boat on the Brahmaputra, from a bamboo raft to a steel ferry, obeys Archimedes\' principle. The boat\'s shape — wide and hollow — is an engineering solution to the density problem: make the average density less than water.',
      checkQuestion: 'A wooden boat has a mass of 200 kg and a hull volume below the waterline of 0.25 m^3. Is it floating, sinking, or at equilibrium? What happens if you add 50 kg of cargo?',
      checkAnswer: 'Buoyant force = 1000 * 9.81 * 0.25 = 2452.5 N. Boat weight = 200 * 9.81 = 1962 N. Since buoyancy > weight, the boat is floating with reserve buoyancy (it could carry more). Adding 50 kg makes total weight = 250 * 9.81 = 2452.5 N, exactly matching buoyancy — the boat is at its maximum load at this waterline. Any more cargo and it must sink deeper, displacing more water.',
      codeIntro: 'Simulate how a boat\'s draft (depth below waterline) changes as cargo is added, and visualize the force balance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Boat parameters
hull_length = 4.0   # meters
hull_beam = 1.2     # meters (width)
hull_depth = 0.6    # meters (total depth of hull)
hull_mass = 80.0    # kg (empty boat)
rho_water = 1000.0  # kg/m^3 (fresh river water)
g = 9.81            # m/s^2

# Simplified rectangular hull: V_displaced = length * beam * draft
cargo_range = np.linspace(0, 400, 200)  # kg of cargo
total_mass = hull_mass + cargo_range

# Draft = total_mass / (rho_water * length * beam)
draft = total_mass / (rho_water * hull_length * hull_beam)

# Freeboard = hull_depth - draft (must be > 0 or boat sinks)
freeboard = hull_depth - draft
safe_mask = freeboard > 0.05  # minimum 5cm freeboard for safety

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle("Archimedes' Principle: Boat Loading Analysis",
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Draft vs cargo
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.plot(cargo_range, draft * 100, color='#3b82f6', linewidth=2.5)
ax.axhline(hull_depth * 100, color='#ef4444', linestyle='--', linewidth=2, label=f'Hull depth = {hull_depth*100:.0f} cm')
ax.fill_between(cargo_range, draft * 100, hull_depth * 100,
                where=safe_mask, alpha=0.15, color='#22c55e', label='Safe freeboard')
ax.set_xlabel('Cargo mass (kg)', color='white')
ax.set_ylabel('Draft (cm)', color='white')
ax.set_title('Draft increases linearly with load', color='white', fontsize=11)
ax.legend(fontsize=9)

# Plot 2: Force balance
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
weight = total_mass * g
buoyancy = rho_water * g * hull_length * hull_beam * np.minimum(draft, hull_depth)
ax2.plot(cargo_range, weight, color='#ef4444', linewidth=2, label='Weight (down)')
ax2.plot(cargo_range, buoyancy, color='#3b82f6', linewidth=2, label='Buoyancy (up)')
ax2.set_xlabel('Cargo mass (kg)', color='white')
ax2.set_ylabel('Force (N)', color='white')
ax2.set_title('Force balance: weight vs buoyancy', color='white', fontsize=11)
ax2.legend(fontsize=9)

# Plot 3: Freeboard vs cargo
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
ax3.plot(cargo_range, freeboard * 100, color='#22c55e', linewidth=2.5)
ax3.axhline(5, color='#f59e0b', linestyle='--', linewidth=1.5, label='Safety minimum (5 cm)')
ax3.axhline(0, color='#ef4444', linewidth=2, label='Sinking line')
ax3.fill_between(cargo_range, freeboard * 100, 0,
                 where=freeboard * 100 < 5, alpha=0.2, color='#ef4444')
ax3.set_xlabel('Cargo mass (kg)', color='white')
ax3.set_ylabel('Freeboard (cm)', color='white')
ax3.set_title('Freeboard decreases as load increases', color='white', fontsize=11)
ax3.legend(fontsize=9)

# Plot 4: Cross-section visualization at different loads
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
loads = [0, 100, 200, 350]
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for i, (load, col) in enumerate(zip(loads, colors)):
    d = (hull_mass + load) / (rho_water * hull_length * hull_beam)
    # Draw hull cross-section
    y_offset = i * 1.5
    # Water level
    ax4.axhline(y_offset, color='#60a5fa', alpha=0.3, linewidth=0.5)
    # Hull rectangle
    hw = hull_beam / 2
    hull_bottom = y_offset - d
    hull_top = y_offset + (hull_depth - d)
    ax4.fill([0-hw, 0+hw, 0+hw, 0-hw], [hull_bottom, hull_bottom, hull_top, hull_top],
             color=col, alpha=0.4, edgecolor=col, linewidth=2)
    # Water shading
    ax4.fill([-1, 1, 1, -1], [hull_bottom, hull_bottom, y_offset, y_offset],
             color='#3b82f6', alpha=0.1)
    ax4.text(0.8, y_offset + 0.1, f'{load} kg\ndraft={d*100:.1f}cm',
             color=col, fontsize=8, fontweight='bold')
ax4.set_xlim(-1.2, 1.8)
ax4.set_title('Hull cross-sections at different loads', color='white', fontsize=11)
ax4.set_xlabel('Width (m)', color='white')
ax4.set_ylabel('Relative position', color='white')

plt.tight_layout()
plt.show()

max_cargo = rho_water * hull_length * hull_beam * hull_depth - hull_mass
safe_cargo = rho_water * hull_length * hull_beam * (hull_depth - 0.05) - hull_mass
print(f"Hull: {hull_length}m x {hull_beam}m x {hull_depth}m, mass={hull_mass} kg")
print(f"Maximum theoretical cargo: {max_cargo:.1f} kg (zero freeboard)")
print(f"Safe cargo (5cm freeboard): {safe_cargo:.1f} kg")
print(f"Displacement at full load: {hull_mass + max_cargo:.1f} kg")`,
      challenge: 'Modify the code to model a V-shaped hull instead of rectangular. For a V-hull, the cross-sectional area at depth d is proportional to d^2, not d. How does this change the draft-vs-cargo relationship? Is it still linear?',
      successHint: 'Archimedes\' principle is the foundation of all naval architecture. Every vessel ever built — from bamboo rafts to aircraft carriers — obeys this single law: float by displacing your weight in water.',
    },
    {
      title: 'Density, displacement, and hull volume',
      concept: `A boat\'s ability to carry cargo depends on the relationship between its **hull volume** and its **structural mass**. The hull volume determines how much water can be displaced (and therefore the maximum buoyant force), while the structural mass is "dead weight" that contributes nothing to cargo capacity. The ratio of useful cargo capacity to total displacement is called the **deadweight ratio**, and maximizing it is a central goal of naval architecture.

For a simple hull shape, the displaced volume at draft d can be calculated from the hull geometry. For a rectangular barge: V = L * B * d (length times beam times draft). For a more realistic hull with a curved cross-section described by a function y(z) giving the half-breadth at height z above the keel: V = L * integral from 0 to d of 2*y(z) dz. The **block coefficient** C_b is the ratio of the actual hull volume to the volume of the smallest rectangular box that encloses it: C_b = V_hull / (L * B * d). A rectangular barge has C_b = 1.0; a sleek canoe might have C_b = 0.4.

Different hull shapes serve different purposes. River boats on the Brahmaputra need shallow draft (to navigate sandbars) and high stability (to handle cross-currents). This favors wide, flat-bottomed designs with high block coefficients (0.8-0.9). Ocean racing yachts need low drag and can tolerate deep draft, favoring narrow hulls with low block coefficients (0.35-0.45). The physics of buoyancy is universal, but the engineering tradeoffs are always context-specific.`,
      analogy: 'Think of hull volume like a water bottle. A tall, narrow bottle and a short, wide bottle can hold the same volume, but they behave differently: the wide bottle is stable but hard to carry; the narrow bottle tips easily but fits in a bag. Similarly, two hulls with the same displaced volume can have wildly different performance characteristics depending on their shape.',
      storyConnection: 'The little boat in the story learns that shape matters as much as size. A narrow boat might cut through waves gracefully but tip in a crosswind. A wide boat is stable but slow. Brahmaputra river boats have evolved wide, flat-bottomed shapes over centuries because the river demands stability over speed — sandbars, changing channels, and heavy cargo are the reality of river transport in Assam.',
      checkQuestion: 'Two boats have identical displacement (500 kg) and length (5 m). Boat A has beam 2.0 m and draft 0.10 m; Boat B has beam 0.8 m and draft 0.25 m. Calculate the block coefficient assuming rectangular hulls. Which is better suited for a shallow river?',
      checkAnswer: 'Both displace 500 kg = 0.5 m^3. Boat A: V_box = 5 * 2.0 * 0.10 = 1.0 m^3, C_b = 0.5/1.0 = 0.5. Boat B: V_box = 5 * 0.8 * 0.25 = 1.0 m^3, C_b = 0.5/1.0 = 0.5. Same C_b, but Boat A with 10 cm draft is far better for a shallow river — it can cross sandbars that would ground Boat B at 25 cm draft.',
      codeIntro: 'Compare hull shapes — rectangular, V-shaped, and parabolic — and calculate their block coefficients, displaced volumes, and cargo capacities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hull parameters
L = 5.0   # length (m)
B = 1.5   # max beam (m)
D = 0.5   # hull depth (m)

# Define hull cross-section shapes: half-breadth y(z) at height z above keel
def rect_hull(z, B=B): return np.full_like(z, B/2)
def v_hull(z, B=B, D=D): return (B/2) * (z / D)
def parabolic_hull(z, B=B, D=D): return (B/2) * np.sqrt(z / D)
def round_hull(z, B=B, D=D): return (B/2) * np.sqrt(1 - ((z - D)/D)**2)

hulls = {
    'Rectangular (barge)': rect_hull,
    'V-shaped (speedboat)': v_hull,
    'Parabolic (canoe)': parabolic_hull,
    'Semicircular (yacht)': round_hull,
}
colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b']

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Hull Shape Comparison: Cross-Sections & Performance',
             color='white', fontsize=14, fontweight='bold')

z = np.linspace(0.001, D, 500)

# Plot 1: Cross-sections
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
for (name, func), col in zip(hulls.items(), colors):
    y = func(z)
    ax1.plot(y, z, color=col, linewidth=2.5, label=name)
    ax1.plot(-y, z, color=col, linewidth=2.5)
ax1.axhline(0, color='white', linewidth=0.5)
ax1.set_xlabel('Half-breadth (m)', color='white')
ax1.set_ylabel('Height above keel (m)', color='white')
ax1.set_title('Hull cross-sections', color='white', fontsize=11)
ax1.legend(fontsize=8, loc='upper left')

# Plot 2: Displaced volume vs draft
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
drafts = np.linspace(0.01, D, 200)
for (name, func), col in zip(hulls.items(), colors):
    volumes = []
    for d in drafts:
        zz = np.linspace(0.001, d, 200)
        y = func(zz)
        vol = L * 2 * np.trapz(y, zz)
        volumes.append(vol)
    ax2.plot(drafts * 100, volumes, color=col, linewidth=2.5, label=name.split('(')[0])
ax2.set_xlabel('Draft (cm)', color='white')
ax2.set_ylabel('Displaced volume (m³)', color='white')
ax2.set_title('Volume vs draft by hull shape', color='white', fontsize=11)
ax2.legend(fontsize=8)

# Plot 3: Block coefficient vs draft
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
for (name, func), col in zip(hulls.items(), colors):
    cbs = []
    for d in drafts:
        zz = np.linspace(0.001, d, 200)
        y = func(zz)
        vol = L * 2 * np.trapz(y, zz)
        box = L * B * d
        cbs.append(vol / box if box > 0 else 0)
    ax3.plot(drafts * 100, cbs, color=col, linewidth=2.5, label=name.split('(')[0])
ax3.set_xlabel('Draft (cm)', color='white')
ax3.set_ylabel('Block coefficient C_b', color='white')
ax3.set_title('Block coefficient vs draft', color='white', fontsize=11)
ax3.legend(fontsize=8)

# Plot 4: Cargo capacity at different structural masses
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
struct_mass = np.linspace(50, 300, 100)
rho = 1000.0
for (name, func), col in zip(hulls.items(), colors):
    zz = np.linspace(0.001, D, 500)
    y = func(zz)
    max_vol = L * 2 * np.trapz(y, zz)
    max_disp = rho * max_vol
    cargo = max_disp - struct_mass
    ax4.plot(struct_mass, cargo, color=col, linewidth=2.5, label=name.split('(')[0])
ax4.axhline(0, color='white', linewidth=0.5, linestyle='--')
ax4.set_xlabel('Structural mass (kg)', color='white')
ax4.set_ylabel('Max cargo capacity (kg)', color='white')
ax4.set_title('Cargo capacity vs hull weight', color='white', fontsize=11)
ax4.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("Hull Shape Comparison (full draft = {:.0f} cm)".format(D*100))
print("=" * 60)
print(f"{'Shape':<22} {'Volume':>8} {'C_b':>6} {'Max Disp':>10} {'Cargo*':>8}")
print("-" * 60)
for (name, func) in hulls.items():
    zz = np.linspace(0.001, D, 500)
    y = func(zz)
    vol = L * 2 * np.trapz(y, zz)
    cb = vol / (L * B * D)
    disp = rho * vol
    cargo = disp - 100  # assuming 100 kg hull
    print(f"{name.split('(')[0]:<22} {vol:>7.3f}m³ {cb:>5.3f} {disp:>9.1f}kg {cargo:>7.1f}kg")
print("* Cargo assuming 100 kg hull mass")`,
      challenge: 'Design a hull cross-section that maximizes cargo capacity while keeping draft under 15 cm (for sandbar navigation). You can combine shapes — e.g., flat bottom with curved sides. Calculate the optimal beam-to-depth ratio.',
      successHint: 'Hull shape is where physics meets engineering tradeoffs. Every boat is a compromise between stability, speed, cargo capacity, and draft. The "best" shape depends entirely on what the boat needs to do and where it operates.',
    },
    {
      title: 'Hydrostatic stability & metacentric height',
      concept: `A boat that floats is not necessarily safe — it also needs to be **stable**, meaning it returns to upright after being tilted. The physics of stability involves a subtle interplay between three points. The **center of gravity** (G) is where the boat's total weight effectively acts. The **center of buoyancy** (B) is the centroid of the displaced water volume. When the boat tilts by an angle theta, the center of buoyancy shifts to the side, creating a **righting moment** that pushes the boat back upright.

The key parameter is the **metacentric height** (GM), defined as the distance from G to the **metacenter** M — the point where a vertical line through the tilted center of buoyancy intersects the boat's centerline. If GM > 0, the boat is stable: tilting creates a restoring force. If GM < 0, the boat is unstable: tilting creates a capsizing force. For small angles, the righting moment is approximately W * GM * sin(theta), where W is the boat's weight.

The metacentric height depends on the hull geometry through the formula: BM = I / V, where I is the **second moment of area** of the waterplane (the hull's cross-section at the waterline) and V is the displaced volume. For a rectangular waterplane: I = (L * B^3) / 12. So GM = KB + BM - KG, where KB is the height of the center of buoyancy above the keel and KG is the height of the center of gravity above the keel. Wide, flat boats have large I (and therefore large BM), making them inherently more stable — which is exactly why Brahmaputra river boats are built wide.`,
      analogy: 'Stability is like balancing on a seesaw. If your center of gravity is below the pivot, you naturally swing back to center (stable — like a pendulum). If above the pivot, any small push sends you toppling (unstable — like balancing a broomstick on your palm). The metacenter is the "pivot point" of the boat. As long as the center of gravity stays below the metacenter, the boat self-rights.',
      storyConnection: 'The little boat must navigate the Brahmaputra — a river with strong currents, waves from passing ferries, and sudden wind gusts. Stability is not academic here; it is survival. The traditional wide, flat-bottomed design of Brahmaputra boats is a centuries-old engineering solution that maximizes metacentric height, keeping passengers and cargo safe in turbulent water.',
      checkQuestion: 'A rectangular barge is 8 m long, 3 m wide, with a draft of 0.5 m and center of gravity 0.4 m above the keel. Calculate the metacentric height GM and determine if the barge is stable.',
      checkAnswer: 'V = 8 * 3 * 0.5 = 12 m^3. KB = 0.5/2 = 0.25 m (center of buoyancy at half-draft for rectangular hull). I = 8 * 3^3 / 12 = 18 m^4. BM = I/V = 18/12 = 1.5 m. GM = KB + BM - KG = 0.25 + 1.5 - 0.4 = 1.35 m. GM > 0, so the barge is stable. In fact, GM = 1.35 m is quite high — this barge will feel very "stiff" and snap back quickly when tilted.',
      codeIntro: 'Calculate and visualize metacentric height for different hull shapes, beam widths, and loading conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Rectangular barge stability analysis
L = 6.0   # length (m)
D = 0.6   # hull depth (m)
rho = 1000.0
g = 9.81

beams = np.linspace(0.5, 4.0, 200)  # varying beam width
hull_mass = 120.0  # kg
cargo_mass = 300.0 # kg
total_mass = hull_mass + cargo_mass
KG = 0.35  # center of gravity height above keel (m)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Hydrostatic Stability: Metacentric Height Analysis',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: GM vs beam width
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
drafts = total_mass / (rho * L * beams)
KB = drafts / 2
I_wp = L * beams**3 / 12
V_disp = L * beams * drafts
BM = I_wp / V_disp
GM = KB + BM - KG

ax1.plot(beams, GM, color='#3b82f6', linewidth=2.5, label='GM')
ax1.plot(beams, BM, color='#22c55e', linewidth=2, linestyle='--', label='BM')
ax1.plot(beams, KB, color='#f59e0b', linewidth=2, linestyle=':', label='KB')
ax1.axhline(0, color='#ef4444', linewidth=2, label='Capsize threshold')
ax1.fill_between(beams, GM, 0, where=GM > 0, alpha=0.1, color='#22c55e')
ax1.fill_between(beams, GM, 0, where=GM < 0, alpha=0.2, color='#ef4444')
ax1.set_xlabel('Beam width (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Metacentric height vs beam width', color='white', fontsize=11)
ax1.legend(fontsize=9)

# Plot 2: GM vs center of gravity height
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
B_fixed = 2.0
draft_fixed = total_mass / (rho * L * B_fixed)
KB_f = draft_fixed / 2
I_f = L * B_fixed**3 / 12
V_f = L * B_fixed * draft_fixed
BM_f = I_f / V_f

KG_range = np.linspace(0.1, 1.5, 200)
GM_vs_KG = KB_f + BM_f - KG_range
ax2.plot(KG_range, GM_vs_KG, color='#a855f7', linewidth=2.5)
ax2.axhline(0, color='#ef4444', linewidth=2, linestyle='--')
ax2.axvline(KB_f + BM_f, color='#ef4444', linewidth=1, linestyle=':', alpha=0.7,
            label=f'Capsize at KG={KB_f+BM_f:.2f}m')
ax2.fill_between(KG_range, GM_vs_KG, 0, where=GM_vs_KG > 0, alpha=0.1, color='#22c55e')
ax2.fill_between(KG_range, GM_vs_KG, 0, where=GM_vs_KG < 0, alpha=0.2, color='#ef4444')
ax2.set_xlabel('Center of gravity KG (m)', color='white')
ax2.set_ylabel('GM (m)', color='white')
ax2.set_title(f'GM vs loading height (beam={B_fixed}m)', color='white', fontsize=11)
ax2.legend(fontsize=9)

# Plot 3: Righting moment curve
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
B_boat = 2.0
d_boat = total_mass / (rho * L * B_boat)
KB_b = d_boat / 2
BM_b = (L * B_boat**3 / 12) / (L * B_boat * d_boat)
GM_b = KB_b + BM_b - KG

angles = np.linspace(0, 90, 200)
# For small angles: righting arm = GM * sin(theta)
# For larger angles: use wall-sided formula: GZ = sin(theta) * (GM + BM * tan^2(theta) / 2)
righting_arm_small = GM_b * np.sin(np.radians(angles))
righting_arm_wall = np.sin(np.radians(angles)) * (GM_b + 0.5 * BM_b * np.tan(np.radians(np.minimum(angles, 80)))**2)

ax3.plot(angles, righting_arm_small * total_mass * g, color='#3b82f6', linewidth=2,
         label='Small angle approx', linestyle='--')
ax3.plot(angles, righting_arm_wall * total_mass * g, color='#22c55e', linewidth=2.5,
         label='Wall-sided formula')
ax3.axhline(0, color='#ef4444', linewidth=1)
ax3.set_xlabel('Heel angle (degrees)', color='white')
ax3.set_ylabel('Righting moment (N·m)', color='white')
ax3.set_title('Righting moment vs heel angle', color='white', fontsize=11)
ax3.set_xlim(0, 60)
ax3.legend(fontsize=9)

# Plot 4: Stability comparison — narrow vs wide boat
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
boat_configs = [
    ('Narrow (B=1.0m)', 1.0, '#ef4444'),
    ('Medium (B=1.5m)', 1.5, '#f59e0b'),
    ('Wide (B=2.0m)', 2.0, '#22c55e'),
    ('Barge (B=3.0m)', 3.0, '#3b82f6'),
]
for label, beam, col in boat_configs:
    d = total_mass / (rho * L * beam)
    kb = d / 2
    bm = (L * beam**3 / 12) / (L * beam * d)
    gm = kb + bm - KG
    gz = gm * np.sin(np.radians(angles))
    ax4.plot(angles, gz, color=col, linewidth=2, label=f'{label}, GM={gm:.2f}m')
ax4.axhline(0, color='white', linewidth=0.5)
ax4.set_xlabel('Heel angle (degrees)', color='white')
ax4.set_ylabel('Righting arm GZ (m)', color='white')
ax4.set_title('Stability comparison: beam width matters', color='white', fontsize=11)
ax4.set_xlim(0, 45)
ax4.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("Stability Analysis Results")
print("=" * 55)
for label, beam, _ in boat_configs:
    d = total_mass / (rho * L * beam)
    kb = d / 2
    bm = (L * beam**3 / 12) / (L * beam * d)
    gm = kb + bm - KG
    status = "STABLE" if gm > 0 else "UNSTABLE"
    print(f"  {label:<20} draft={d:.3f}m  GM={gm:+.3f}m  [{status}]")
print()
print("Key insight: BM is proportional to B^2/draft.")
print("Doubling beam width quadruples BM — stability scales dramatically with width.")`,
      challenge: 'Add a passenger who stands up (raising KG from 0.35 m to 0.80 m) versus sits down (KG = 0.35 m). For each boat width, calculate the maximum number of standing passengers before GM goes negative. This is why river boat operators tell passengers to sit down in rough water.',
      successHint: 'Metacentric height is why boats are shaped the way they are. Wide river boats, deep-keeled sailboats, and ballasted ships all achieve stability through different mechanisms — but the GM formula governs them all.',
    },
    {
      title: 'Hull resistance & drag forces',
      concept: `A moving boat must overcome **drag** — the resistance of water to being pushed aside. Hull resistance has three major components. **Frictional resistance** comes from water molecules sliding along the hull surface. It depends on the hull's wetted surface area, the water's viscosity, and the boat's speed. For turbulent flow (which dominates at practical speeds), frictional drag is proportional to speed squared: F_f ~ 0.5 * rho * V^2 * S * C_f, where S is wetted area and C_f is the friction coefficient (typically 0.002-0.004).

**Wave-making resistance** is caused by the hull creating waves as it moves. The boat pushes water up at the bow and stern, creating a wave pattern that radiates energy outward. This energy comes from the boat's forward motion and acts as resistance. Wave-making resistance increases dramatically with speed — roughly proportional to V^4 at moderate speeds and even faster near the **hull speed**, defined as V_hull = 1.34 * sqrt(LWL) in knots, where LWL is the waterline length in feet. At hull speed, the bow wave and stern wave constructively interfere to create a single wave as long as the boat, and the boat is essentially trapped in its own wave trough.

**Pressure (form) drag** results from the hull's shape forcing water to accelerate around it. A blunt bow creates high pressure at the front and low pressure at the rear, resulting in a net rearward force. Streamlined shapes reduce form drag by allowing water to flow smoothly from bow to stern without separation. The total resistance is the sum of all three components, and their relative importance changes with speed.`,
      analogy: 'Imagine running through a swimming pool. At walking speed, you feel the water\'s viscosity dragging on your skin (friction). At jogging speed, you start pushing waves ahead of you that fight back (wave-making). At sprinting speed, the water can\'t get out of your way fast enough, and you hit a "wall" of your own waves (hull speed). Streamlining your body position (tucking elbows in) reduces form drag — same principle as a streamlined hull.',
      storyConnection: 'The little boat wants to travel faster on the Brahmaputra, but discovers that water fights back harder the faster you go. Traditional Brahmaputra boats have evolved long, narrow hull forms not by accident but by centuries of practical optimization — longer hulls have higher hull speeds, and narrower hulls have less frictional drag per unit of displacement.',
      checkQuestion: 'A boat is 6 m long at the waterline. Calculate its hull speed in m/s. If the boat is currently doing 2 m/s, estimate whether frictional or wave-making resistance dominates.',
      checkAnswer: 'LWL = 6 m = 19.7 ft. Hull speed = 1.34 * sqrt(19.7) = 5.95 knots = 3.06 m/s. At 2 m/s, the boat is at 65% of hull speed — a moderate Froude number (Fn = V/sqrt(g*L) = 2/sqrt(9.81*6) = 0.26). At Fn < 0.3, frictional resistance typically dominates (60-70% of total), with wave-making resistance growing but not yet dominant.',
      codeIntro: 'Model and visualize the three components of hull resistance as a function of speed, and identify the hull speed barrier.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Boat parameters
LWL = 6.0    # waterline length (m)
B = 1.5      # beam (m)
T = 0.3      # draft (m)
S = 12.0     # wetted surface area (m^2) — approximate
disp = 420.0 # displacement (kg)
rho = 1000.0 # water density
g = 9.81
nu = 1.14e-6 # kinematic viscosity of water at 15°C

speeds = np.linspace(0.1, 5.0, 300)  # m/s
Fn = speeds / np.sqrt(g * LWL)  # Froude number

# 1. Frictional resistance (ITTC 1957 correlation)
Re = speeds * LWL / nu  # Reynolds number
Cf = 0.075 / (np.log10(Re) - 2)**2
R_friction = 0.5 * rho * speeds**2 * S * Cf

# 2. Wave-making resistance (Michell's theory approximation)
# Increases dramatically near hull speed (Fn ~ 0.4)
Cw = 0.001 * np.exp(10 * (Fn - 0.35)**2) * Fn**4
Cw = np.where(Fn < 0.15, Cw * 0.1, Cw)  # very small at low Fn
R_wave = 0.5 * rho * speeds**2 * S * Cw

# 3. Form (pressure) drag
Cb = disp / (rho * LWL * B * T)
Cf_form = 0.002 * (1 + 0.5 * Cb)  # higher block coeff = more form drag
R_form = 0.5 * rho * speeds**2 * S * Cf_form

R_total = R_friction + R_wave + R_form

# Hull speed
hull_speed = 1.34 * np.sqrt(LWL / 0.3048) * 0.5144  # convert from knots to m/s

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Hull Resistance Analysis: The Physics of Drag',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Resistance components vs speed
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
ax1.plot(speeds, R_friction, color='#3b82f6', linewidth=2, label='Friction')
ax1.plot(speeds, R_wave, color='#ef4444', linewidth=2, label='Wave-making')
ax1.plot(speeds, R_form, color='#f59e0b', linewidth=2, label='Form drag')
ax1.plot(speeds, R_total, color='white', linewidth=2.5, label='Total')
ax1.axvline(hull_speed, color='#a855f7', linewidth=2, linestyle='--',
            label=f'Hull speed = {hull_speed:.2f} m/s')
ax1.set_xlabel('Speed (m/s)', color='white')
ax1.set_ylabel('Resistance (N)', color='white')
ax1.set_title('Drag components vs speed', color='white', fontsize=11)
ax1.legend(fontsize=8)
ax1.set_ylim(0, min(R_total.max() * 1.1, 5000))

# Plot 2: Power required
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
power = R_total * speeds  # Watts
power_hp = power / 745.7  # horsepower
ax2.plot(speeds, power, color='#22c55e', linewidth=2.5, label='Power (W)')
ax2.axvline(hull_speed, color='#a855f7', linewidth=2, linestyle='--')
ax2_hp = ax2.twinx()
ax2_hp.plot(speeds, power_hp, color='#22c55e', linewidth=0)  # invisible, just for axis
ax2_hp.set_ylabel('Power (hp)', color='#f59e0b')
ax2_hp.tick_params(colors='#f59e0b')
ax2.set_xlabel('Speed (m/s)', color='white')
ax2.set_ylabel('Power (W)', color='white')
ax2.set_title('Power required to overcome drag', color='white', fontsize=11)

# Plot 3: Resistance fractions
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
frac_friction = R_friction / R_total * 100
frac_wave = R_wave / R_total * 100
frac_form = R_form / R_total * 100
ax3.stackplot(speeds, frac_friction, frac_wave, frac_form,
              colors=['#3b82f6', '#ef4444', '#f59e0b'], alpha=0.7,
              labels=['Friction', 'Wave-making', 'Form'])
ax3.axvline(hull_speed, color='white', linewidth=2, linestyle='--')
ax3.set_xlabel('Speed (m/s)', color='white')
ax3.set_ylabel('Fraction of total (%)', color='white')
ax3.set_title('Resistance breakdown by type', color='white', fontsize=11)
ax3.legend(fontsize=8, loc='center right')
ax3.set_ylim(0, 100)

# Plot 4: Effect of hull length on hull speed
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
lengths = np.linspace(2, 20, 100)
hull_speeds = 1.34 * np.sqrt(lengths / 0.3048) * 0.5144
ax4.plot(lengths, hull_speeds, color='#a855f7', linewidth=2.5)
ax4.plot(lengths, hull_speeds * 3.6, color='#06b6d4', linewidth=2, linestyle='--',
         label='km/h')
ax4.scatter([LWL], [hull_speed], color='#ef4444', s=100, zorder=5,
            label=f'Our boat ({LWL}m)')
ax4.set_xlabel('Waterline length (m)', color='white')
ax4.set_ylabel('Hull speed (m/s)', color='white')
ax4.set_title('Hull speed scales with sqrt(length)', color='white', fontsize=11)
ax4.legend(fontsize=9)

plt.tight_layout()
plt.show()

print(f"Boat: {LWL}m x {B}m, draft={T}m, displacement={disp}kg")
print(f"Hull speed: {hull_speed:.2f} m/s ({hull_speed*3.6:.1f} km/h)")
print()
for spd in [1.0, 2.0, hull_speed, 4.0]:
    idx = np.argmin(np.abs(speeds - spd))
    fn = Fn[idx]
    p = R_total[idx] * spd
    print(f"  V={spd:.1f} m/s (Fn={fn:.3f}): R_total={R_total[idx]:.0f} N, "
          f"Power={p:.0f} W ({p/745.7:.1f} hp)")`,
      challenge: 'Compare two boats with identical displacement but different length-to-beam ratios: a "long and narrow" boat (L=8m, B=1m) and a "short and wide" boat (L=4m, B=2m). Calculate and plot total resistance for each. Which requires less power at 2 m/s? At 4 m/s?',
      successHint: 'Hull resistance explains why all fast boats are long and narrow, and why there is a fundamental speed limit for displacement hulls. Breaking the hull speed barrier requires either enormous power or a completely different approach — planing, hydrofoils, or multihulls.',
    },
    {
      title: 'Bernoulli\'s equation & water flow around hulls',
      concept: `**Bernoulli\'s equation** relates pressure, velocity, and height in a flowing fluid: P + 0.5*rho*v^2 + rho*g*h = constant along a streamline. This equation is the key to understanding why water behaves the way it does around a moving hull. Where water speeds up (narrowing of flow), pressure drops. Where water slows down (widening of flow), pressure rises.

At the bow of a boat, water must accelerate to flow around the hull. The streamlines compress together, velocity increases, and — by Bernoulli — pressure drops. This creates a low-pressure zone along the sides of the hull. At the stern, the flow must decelerate back to the free-stream velocity. If the hull shape changes too abruptly, the flow cannot follow the surface — it **separates**, creating a turbulent wake and high drag. Smooth, gradually tapering hull shapes prevent separation and minimize drag.

The **pressure distribution** around the hull determines both the drag force and the dynamic trim (the boat's angle in the water while moving). High pressure at the bow pushes the boat backward; low pressure along the sides and the pressure recovery at the stern partially cancel this. The net imbalance is the form drag. Understanding Bernoulli's equation allows naval architects to design hull shapes that minimize this imbalance — long, slender bows that accelerate water gradually and gentle sterns that decelerate it smoothly.`,
      analogy: 'Think of water flow like traffic on a highway. When the road narrows (like water squeezing past a hull), cars speed up and spread out — but they are under pressure to merge. When the road widens again, cars slow down and bunch up. If the narrowing is too sudden, you get a traffic jam (flow separation). A well-designed highway gradually tapers — just like a well-designed hull gradually narrows at bow and stern.',
      storyConnection: 'The little boat discovers that the water flowing around its hull tells a story of pressure and velocity. A skilled boat builder on the Brahmaputra shapes the bow to part water smoothly and the stern to release it gently — even without knowing Bernoulli\'s name, generations of builders have empirically optimized for the same physics.',
      checkQuestion: 'Water flows past a hull at 2 m/s far from the boat. At the widest point of the hull, the flow accelerates to 3 m/s. What is the pressure difference between these two points? (rho_water = 1000 kg/m^3)',
      checkAnswer: 'By Bernoulli (ignoring height change): P1 + 0.5*1000*2^2 = P2 + 0.5*1000*3^2. So P1 - P2 = 0.5*1000*(9 - 4) = 2500 Pa. The pressure at the hull side is 2500 Pa lower than in the undisturbed flow. This pressure difference creates a force — the hull effectively "sucks" water toward it, which is why two boats passing close together are pulled toward each other.',
      codeIntro: 'Simulate potential flow around a hull cross-section using the method of sources and sinks, and visualize streamlines and pressure distributions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate 2D potential flow around an elliptical hull cross-section
# Using a doublet (source + sink) in uniform flow

U_inf = 2.0  # free-stream velocity (m/s)
a = 0.75     # semi-major axis (half-length scale)
b = 0.3      # semi-minor axis (half-beam)
rho = 1000.0

# Grid
x = np.linspace(-3, 3, 400)
y = np.linspace(-2, 2, 300)
X, Y = np.meshgrid(x, y)

# For flow around an ellipse, use conformal mapping
# Approximate with a Rankine oval (source + sink in uniform flow)
d = 0.6  # half-distance between source and sink
m = U_inf * np.pi * b * (a + b) / (2)  # source strength

# Velocity potential for source at (-d, 0) and sink at (d, 0) + uniform flow
r1 = np.sqrt((X + d)**2 + Y**2)
r2 = np.sqrt((X - d)**2 + Y**2)
theta1 = np.arctan2(Y, X + d)
theta2 = np.arctan2(Y, X - d)

# Stream function
psi = U_inf * Y + (m / (2 * np.pi)) * (theta1 - theta2)

# Velocity components
u = U_inf + (m / (2 * np.pi)) * ((X + d) / r1**2 - (X - d) / r2**2)
v = (m / (2 * np.pi)) * (Y / r1**2 - Y / r2**2)

speed = np.sqrt(u**2 + v**2)

# Find the body streamline (psi = 0 on the body)
# Pressure coefficient: Cp = 1 - (V/U_inf)^2
Cp = 1 - (speed / U_inf)**2

# Mask interior of body (approximate)
body_mask = (X / a)**2 + (Y / b)**2 < 1.0

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle("Bernoulli's Equation: Flow & Pressure Around a Hull",
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Streamlines
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
speed_masked = np.ma.array(speed, mask=body_mask)
ax1.contour(X, Y, psi, levels=30, colors='#60a5fa', linewidths=0.8, alpha=0.6)
ellipse = plt.matplotlib.patches.Ellipse((0, 0), 2*a, 2*b, color='#f59e0b', alpha=0.8)
ax1.add_patch(ellipse)
ax1.set_xlim(-2.5, 2.5)
ax1.set_ylim(-1.5, 1.5)
ax1.set_aspect('equal')
ax1.set_title('Streamlines around hull cross-section', color='white', fontsize=11)
ax1.set_xlabel('x (m)', color='white')
ax1.set_ylabel('y (m)', color='white')
ax1.annotate('BOW', xy=(-a, 0), xytext=(-a-0.6, 0.5), color='white', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='white'))
ax1.annotate('STERN', xy=(a, 0), xytext=(a+0.2, 0.5), color='white', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='white'))

# Plot 2: Pressure coefficient contour
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
Cp_masked = np.ma.array(Cp, mask=body_mask)
cs = ax2.contourf(X, Y, Cp_masked, levels=np.linspace(-2, 1, 30), cmap='RdBu_r', alpha=0.8)
ellipse2 = plt.matplotlib.patches.Ellipse((0, 0), 2*a, 2*b, color='gray', alpha=0.9)
ax2.add_patch(ellipse2)
ax2.set_xlim(-2.5, 2.5)
ax2.set_ylim(-1.5, 1.5)
ax2.set_aspect('equal')
ax2.set_title('Pressure coefficient Cp (blue=low, red=high)', color='white', fontsize=11)
plt.colorbar(cs, ax=ax2, shrink=0.7, label='Cp')

# Plot 3: Pressure along hull surface
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
theta_surf = np.linspace(0, 2 * np.pi, 500)
x_surf = a * np.cos(theta_surf)
y_surf = b * np.sin(theta_surf)
# Interpolate speed at surface points
from scipy import interpolate  # available in pyodide
speed_interp = interpolate.RegularGridInterpolator((y, x), speed, method='linear',
                                                     bounds_error=False, fill_value=U_inf)
surface_speeds = np.array([speed_interp([ys, xs])[0] for xs, ys in zip(x_surf, y_surf)])
Cp_surface = 1 - (surface_speeds / U_inf)**2

# Use angle from bow (0 = bow, 180 = stern)
angle_from_bow = np.degrees(theta_surf)
ax3.plot(angle_from_bow, Cp_surface, color='#22c55e', linewidth=2.5)
ax3.axhline(0, color='white', linewidth=0.5, linestyle='--')
ax3.axhline(1, color='#ef4444', linewidth=1, linestyle=':', alpha=0.5, label='Stagnation (Cp=1)')
ax3.set_xlabel('Angle from bow (degrees)', color='white')
ax3.set_ylabel('Pressure coefficient Cp', color='white')
ax3.set_title('Pressure distribution along hull surface', color='white', fontsize=11)
ax3.legend(fontsize=9)

# Plot 4: Bernoulli demonstration — velocity vs pressure
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
v_range = np.linspace(0, 4, 200)
P_static = 101325 + 0.5 * rho * U_inf**2 - 0.5 * rho * v_range**2  # Pa
P_dynamic = 0.5 * rho * v_range**2
P_total = np.full_like(v_range, 101325 + 0.5 * rho * U_inf**2)

ax4.plot(v_range, P_static / 1000, color='#3b82f6', linewidth=2.5, label='Static pressure')
ax4.plot(v_range, P_dynamic / 1000, color='#ef4444', linewidth=2, label='Dynamic pressure')
ax4.plot(v_range, P_total / 1000, color='white', linewidth=2, linestyle='--', label='Total (constant)')
ax4.axvline(U_inf, color='#f59e0b', linewidth=1.5, linestyle=':', label=f'Free stream = {U_inf} m/s')
ax4.set_xlabel('Flow velocity (m/s)', color='white')
ax4.set_ylabel('Pressure (kPa)', color='white')
ax4.set_title("Bernoulli's equation: P + ½ρv² = const", color='white', fontsize=11)
ax4.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("Bernoulli Analysis Results")
print("=" * 50)
print(f"Free-stream velocity: {U_inf} m/s")
print(f"Hull dimensions: {2*a}m x {2*b}m (length x beam)")
print(f"Stagnation pressure: {0.5*rho*U_inf**2:.0f} Pa above ambient")
print(f"At widest point: flow accelerates, pressure drops")
print(f"At bow/stern: flow stagnates, pressure is maximum")
print()
print("Bernoulli's equation connects velocity and pressure:")
print("  Fast flow = low pressure (sides of hull)")
print("  Slow flow = high pressure (bow and stern)")
print("  This pressure imbalance creates form drag.")`,
      challenge: 'Add a second hull (catamaran) at a spacing of 2 meters and analyze how the flow between the two hulls accelerates (Venturi effect). Calculate the pressure drop between the hulls and the resulting attractive force.',
      successHint: 'Bernoulli\'s equation is the link between water speed and water pressure. It explains why hull shape matters, why boats are pulled toward each other when passing close, and why a well-designed hull can slip through water with minimal resistance.',
    },
    {
      title: 'Froude number, Reynolds number & dimensional analysis',
      concept: `Naval architects do not test full-size boats in laboratories — they test scale models in towing tanks and use **dimensional analysis** to scale results up. Two dimensionless numbers govern this scaling. The **Froude number** Fn = V / sqrt(g * L) captures wave-making behavior. Two geometrically similar hulls at the same Froude number create the same wave pattern (relative to their size). This means a 1-meter model at 1 m/s (Fn = 0.32) produces waves dynamically similar to a 100-meter ship at 10 m/s (Fn = 0.32).

The **Reynolds number** Re = V * L / nu captures viscous (frictional) behavior. High Re means inertia dominates viscosity (turbulent flow); low Re means viscosity dominates (laminar flow). Unfortunately, matching both Fn and Re simultaneously at model scale is impossible — matching Fn requires reducing speed by sqrt(scale), but matching Re requires increasing speed by the scale factor. Since these are contradictory, naval architects match Fn (for wave resistance) and use empirical correlations to correct for the Re mismatch (for friction).

This is the power of **dimensional analysis**: it identifies which physical parameters matter and how they combine. The Buckingham Pi theorem states that any physical relationship involving n variables and k fundamental dimensions can be expressed as n-k dimensionless groups. For ship resistance with variables (force, speed, length, density, viscosity, gravity), we get exactly two independent groups: Fn and Re. All of ship hydrodynamics reduces to understanding how resistance coefficients vary with these two numbers.`,
      analogy: 'Dimensional analysis is like recognizing that a photograph and the scene it depicts have the same proportions even though they differ in absolute size. A 10 cm photo of a 10 m building has a scale of 1:100. If everything in the photo is scaled consistently, you can measure proportions in the photo and know them for the real building. Froude and Reynolds numbers are the "consistent scaling rules" for fluid mechanics — they tell you when a model accurately represents reality.',
      storyConnection: 'The little boat\'s builder could test a small model in a bucket before building the real thing. If the model is tested at the right Froude number, the wave patterns will be identical (scaled). This is exactly what professional shipbuilders do in towing tanks — the same science that designs supertankers can be applied to a Brahmaputra river boat, just at a different scale.',
      checkQuestion: 'A ship is 100 m long and travels at 10 m/s. You build a 1:25 scale model (4 m long). At what speed must you tow the model to match the Froude number? What are the Froude and Reynolds numbers for both?',
      checkAnswer: 'Fn = V / sqrt(g * L). For the ship: Fn = 10 / sqrt(9.81 * 100) = 0.319. For the model at the same Fn: V_model = Fn * sqrt(9.81 * 4) = 0.319 * 6.26 = 2.0 m/s. Re_ship = 10 * 100 / 1.14e-6 = 8.77 x 10^8. Re_model = 2.0 * 4 / 1.14e-6 = 7.02 x 10^6. The Re differs by a factor of 125 — this is the Re mismatch that must be corrected empirically.',
      codeIntro: 'Explore how Froude and Reynolds numbers govern hull resistance scaling, and demonstrate the model-to-ship extrapolation process.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.81
nu = 1.14e-6  # kinematic viscosity of water

# Ship parameters
L_ship = 50.0   # m (medium river ferry)
V_ship = np.linspace(0.5, 8.0, 200)
Fn_ship = V_ship / np.sqrt(g * L_ship)
Re_ship = V_ship * L_ship / nu

# Model parameters (1:10 scale)
scale = 10
L_model = L_ship / scale
V_model = V_ship / np.sqrt(scale)  # Froude scaling
Fn_model = V_model / np.sqrt(g * L_model)
Re_model = V_model * L_model / nu

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Dimensional Analysis: Froude & Reynolds Number Scaling',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Froude number comparison
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
ax1.plot(V_ship, Fn_ship, color='#3b82f6', linewidth=2.5, label=f'Ship ({L_ship}m)')
ax1.plot(V_model, Fn_model, color='#22c55e', linewidth=2.5, linestyle='--',
         label=f'Model ({L_model}m)')
ax1.axhline(0.4, color='#ef4444', linewidth=1, linestyle=':', label='Hull speed (Fn~0.4)')
ax1.set_xlabel('Velocity (m/s)', color='white')
ax1.set_ylabel('Froude number', color='white')
ax1.set_title('Froude numbers match at scaled velocities', color='white', fontsize=11)
ax1.legend(fontsize=9)

# Plot 2: Reynolds number mismatch
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
ax2.semilogy(Fn_ship, Re_ship, color='#3b82f6', linewidth=2.5, label='Ship Re')
ax2.semilogy(Fn_model, Re_model, color='#22c55e', linewidth=2.5, linestyle='--', label='Model Re')
ax2.fill_between(Fn_ship, Re_model, Re_ship, alpha=0.1, color='#f59e0b')
ax2.set_xlabel('Froude number', color='white')
ax2.set_ylabel('Reynolds number', color='white')
ax2.set_title(f'Reynolds number mismatch (factor ~{scale**1.5:.0f}x)', color='white', fontsize=11)
ax2.legend(fontsize=9)

# Plot 3: Resistance coefficient vs Froude number
# Typical Cr (residuary/wave resistance coefficient) curve
Fn_range = np.linspace(0.05, 0.6, 300)
# Empirical wave resistance hump at Fn ~ 0.5
Cr = 0.001 * (1 + 15 * np.exp(-((Fn_range - 0.50) / 0.05)**2) +
              3 * np.exp(-((Fn_range - 0.35) / 0.04)**2))

# Friction coefficient for ship and model
Re_s = Fn_range * np.sqrt(g * L_ship) * L_ship / nu
Re_m = Fn_range * np.sqrt(g * L_model) * L_model / nu
Cf_s = 0.075 / (np.log10(Re_s) - 2)**2
Cf_m = 0.075 / (np.log10(Re_m) - 2)**2

ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
ax3.plot(Fn_range, Cr * 1000, color='#ef4444', linewidth=2.5, label='Wave Cr (same for both)')
ax3.plot(Fn_range, Cf_s * 1000, color='#3b82f6', linewidth=2, label='Friction Cf (ship)')
ax3.plot(Fn_range, Cf_m * 1000, color='#22c55e', linewidth=2, linestyle='--',
         label='Friction Cf (model)')
ax3.set_xlabel('Froude number', color='white')
ax3.set_ylabel('Coefficient x 1000', color='white')
ax3.set_title('Resistance coefficients: wave + friction', color='white', fontsize=11)
ax3.legend(fontsize=8)

# Plot 4: Model-to-ship extrapolation
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
# Total resistance coefficients
Ct_model = Cr + Cf_m  # measured in towing tank
Ct_ship = Cr + Cf_s   # extrapolated to full scale

# Resistance in Newtons
V_s = Fn_range * np.sqrt(g * L_ship)
S_ship = 200  # wetted surface (m^2)
R_ship = 0.5 * 1000 * V_s**2 * S_ship * Ct_ship

ax4.plot(V_s, R_ship / 1000, color='#a855f7', linewidth=2.5)
ax4.set_xlabel('Ship speed (m/s)', color='white')
ax4.set_ylabel('Total resistance (kN)', color='white')
ax4.set_title('Predicted ship resistance from model test', color='white', fontsize=11)
# Mark hull speed
hs = 0.4 * np.sqrt(g * L_ship)
ax4.axvline(hs, color='#f59e0b', linewidth=1.5, linestyle='--', label=f'Hull speed = {hs:.1f} m/s')
ax4.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Dimensional Analysis Summary")
print("=" * 55)
print(f"Ship: L = {L_ship}m")
print(f"Model: L = {L_model}m (1:{scale} scale)")
print(f"Froude scaling: V_model = V_ship / sqrt({scale})")
print()
print(f"{'Ship V (m/s)':<14} {'Model V (m/s)':<14} {'Fn':<8} {'Re_ship':<12} {'Re_model':<12}")
print("-" * 55)
for vs in [2.0, 4.0, 6.0, 8.0]:
    vm = vs / np.sqrt(scale)
    fn = vs / np.sqrt(g * L_ship)
    res = vs * L_ship / nu
    rem = vm * L_model / nu
    print(f"{vs:<14.1f} {vm:<14.2f} {fn:<8.3f} {res:<12.2e} {rem:<12.2e}")`,
      challenge: 'The same model is now tested in a wind tunnel with air (nu = 1.5e-5 m^2/s) instead of water. At what air speed would you need to test to match both Fn AND Re of the ship at 5 m/s? Is it physically possible? This demonstrates why Fn-Re simultaneous matching is generally impossible.',
      successHint: 'Dimensional analysis is arguably the most powerful tool in all of fluid mechanics. It tells you which experiments to run, how to scale results, and which variables matter. Every ship ever built was tested as a model first, with Froude scaling bridging the gap from lab to ocean.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Boat Physics & Hydrodynamics
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (buoyancy fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real naval architecture and hydrodynamics calculations. Click to start.</p>
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
