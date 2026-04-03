import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FlyingSquirrelLevel1() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Gliding vs powered flight — two strategies for the air',
      concept: `**Powered flight** uses muscles (or engines) to generate thrust — actively pushing air backward to move forward. Only four animal groups evolved it: insects, pterosaurs, birds, and bats. It's metabolically expensive but gives full control.

**Gliding** uses gravity as the energy source: the animal (or aircraft) trades altitude for forward distance. No engine needed — just a surface that generates lift. Many more animals glide than fly: flying squirrels, flying fish, flying snakes, flying frogs, gliding lizards, sugar gliders, and even some spiders.

The key metric: **glide ratio** (L/D ratio) — horizontal distance traveled per unit of altitude lost.
- Flying squirrel: ~2:1 (2m forward per 1m drop)
- Hang glider: ~15:1
- Albatross: ~20:1 (dynamic soaring)
- Modern sailplane: ~60:1
- Space Shuttle (on landing): ~4.5:1

Gliding is evolution's "cheap flight" — it doesn't require the massive muscular and skeletal changes needed for powered flight. A membrane between the legs is all it takes.`,
      analogy: 'Powered flight is like driving a car — you control speed and direction but burn fuel constantly. Gliding is like coasting downhill on a bicycle — free energy from gravity, but you can only go down (until you find the next hill). The flying squirrel is a cyclist on an endless series of tree-top hills.',
      storyConnection: 'The flying squirrel of Hollongapar doesn\'t really fly — it glides. From a high perch in the Hollongapar Gibbon Wildlife Sanctuary in Assam, it launches into the air, spreads its patagium (skin membrane), and glides to a lower tree up to 90 meters away. No engine, no flapping — just physics.',
      checkQuestion: 'A flying squirrel launches from a tree 20m high and lands on a tree 10m high, 40m away horizontally. What was its glide ratio?',
      checkAnswer: 'Altitude lost = 20 - 10 = 10m. Horizontal distance = 40m. Glide ratio = 40/10 = 4:1. This is better than the Space Shuttle\'s landing glide ratio! Flying squirrels are surprisingly efficient gliders, partly because they can adjust their body shape mid-flight to optimize the glide.',
      codeIntro: 'Compare glide paths for different animals and vehicles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Glide paths from 100m height
ax1.set_facecolor('#111827')
start_height = 100  # meters

gliders = [
    ('Flying squirrel', 2.5, '#22c55e'),
    ('Flying fish', 4, '#06b6d4'),
    ('Space Shuttle', 4.5, '#ef4444'),
    ('Hang glider', 15, '#f59e0b'),
    ('Albatross', 20, '#3b82f6'),
    ('Sailplane', 60, '#a855f7'),
]

for name, glide_ratio, color in gliders:
    max_dist = start_height * glide_ratio
    x = np.linspace(0, max_dist, 200)
    y = start_height - x / glide_ratio
    ax1.plot(x, y, color=color, linewidth=2, label=f'{name} (L/D={glide_ratio})')

ax1.set_xlabel('Horizontal distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Glide Paths from 100m Height', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 105)
ax1.set_xlim(0, 800)

# 2. Glide ratio vs body mass for animals
ax2.set_facecolor('#111827')
animals = {
    'Flying ant': (0.001, 1.5), 'Flying spider': (0.01, 1.2),
    'Flying frog': (0.01, 2.0), 'Flying snake': (0.1, 3.5),
    'Flying squirrel': (0.15, 2.5), 'Sugar glider': (0.12, 2.0),
    'Colugo': (1.5, 4.0), 'Flying fish': (0.5, 4.0),
    'Draco lizard': (0.02, 5.0),
}

masses = [v[0] for v in animals.values()]
ratios = [v[1] for v in animals.values()]
names = list(animals.keys())

colors_anim = plt.cm.viridis(np.linspace(0.2, 0.9, len(animals)))
for i, (name, (mass, ratio)) in enumerate(animals.items()):
    ax2.scatter(mass, ratio, s=100, color=colors_anim[i], edgecolors='white',
                linewidths=1, zorder=5)
    ax2.annotate(name, (mass, ratio), textcoords="offset points", xytext=(5, 5),
                 color='white', fontsize=7)

ax2.set_xscale('log')
ax2.set_xlabel('Body mass (kg)', color='white')
ax2.set_ylabel('Glide ratio (L/D)', color='white')
ax2.set_title('Glide Ratio vs Body Mass in Animals', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Gliding animals:")
print("  Gliding evolved independently 30+ times in vertebrates")
print("  All use some form of membrane or flattened body")
print()
for name, glide_ratio, _ in gliders:
    dist = start_height * glide_ratio
    print(f"  {name}: L/D={glide_ratio}, range from 100m = {dist:.0f}m")`,
      challenge: 'A flying squirrel needs to glide from Tree A (height 30m) to Tree B (height 20m), 25m away. Can it make it with a glide ratio of 2.5? What\'s the minimum launch height?',
      successHint: 'Gliding is the simplest form of flight — gravity does all the work. Understanding glide ratios is the foundation for all aerodynamics, from paper airplanes to Boeing 787s.',
    },
    {
      title: 'Lift-to-drag ratio — the efficiency of flight',
      concept: `Two forces act on a glider: **lift** (perpendicular to airflow, keeps it up) and **drag** (parallel to airflow, slows it down). The **lift-to-drag ratio** (L/D) is the glide ratio — it determines how far you go per unit of altitude lost.

**Lift** is generated by the shape of the wing/membrane: air flows faster over the curved top surface (lower pressure) than the flat bottom (higher pressure). The pressure difference creates an upward force. Formula: L = ½ρv²CₗA where ρ is air density, v is speed, Cₗ is lift coefficient, and A is wing area.

**Drag** comes from two sources:
- **Parasitic drag** (friction + form): increases with speed squared
- **Induced drag** (cost of generating lift): decreases with speed

At the **best glide speed**, total drag is minimized — this is where the L/D ratio is maximized. Faster or slower than this speed, efficiency drops.

The flying squirrel adjusts its L/D by changing body posture: spreading limbs wide for maximum lift (slow glide) or tucking them for speed (steep dive to gain velocity for a pull-up maneuver on landing).`,
      analogy: 'L/D ratio is like fuel efficiency in a car (km per liter). A higher L/D means you go farther on each "liter" of altitude. A sailplane with L/D=60 is like a car getting 60 km/liter — absurdly efficient. A flying squirrel at L/D=2.5 is like a monster truck — not efficient, but it gets the job done.',
      storyConnection: 'The flying squirrel of Hollongapar adjusts its body configuration mid-flight to control lift and drag. Spreading its limbs wide maximizes wing area (more lift, less speed). Tucking limbs reduces area (less lift, more speed). This real-time L/D adjustment is why squirrels can steer and control their landing point with precision.',
      checkQuestion: 'Why does induced drag decrease with speed while parasitic drag increases?',
      checkAnswer: 'At higher speed, the wings generate the same lift with a smaller angle of attack (the wing doesn\'t need to deflect air as much). Less deflection = less induced drag. But higher speed means more friction and pressure against the body = more parasitic drag. The crossover point is the best glide speed.',
      codeIntro: 'Model the forces on a glider and find the best glide speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Flying squirrel parameters
mass = 0.15  # kg
wing_area = 0.04  # m² (body + patagium spread)
rho = 1.225  # air density (kg/m³)
g = 9.81

# Drag components
speeds = np.linspace(3, 20, 200)  # m/s

# Parasitic drag coefficient
Cd0 = 0.05
# Induced drag: Cdi = CL² / (π × AR × e)
aspect_ratio = 1.5  # (wingspan² / area) - flying squirrel is low AR
e = 0.7  # efficiency factor

# Lift coefficient needed for level glide at each speed
CL_required = 2 * mass * g / (rho * speeds**2 * wing_area)

# Drag coefficients
Cd_parasitic = Cd0 * np.ones_like(speeds)
Cd_induced = CL_required**2 / (np.pi * aspect_ratio * e)
Cd_total = Cd_parasitic + Cd_induced

# Forces
drag_parasitic = 0.5 * rho * speeds**2 * Cd_parasitic * wing_area
drag_induced = 0.5 * rho * speeds**2 * Cd_induced * wing_area
drag_total = drag_parasitic + drag_induced
lift = 0.5 * rho * speeds**2 * CL_required * wing_area

# L/D ratio
LD_ratio = lift / drag_total

# Best glide speed
best_speed_idx = np.argmax(LD_ratio)
best_speed = speeds[best_speed_idx]
best_LD = LD_ratio[best_speed_idx]

ax1.set_facecolor('#111827')
ax1.plot(speeds, drag_parasitic, color='#ef4444', linewidth=2, label='Parasitic drag', linestyle='--')
ax1.plot(speeds, drag_induced, color='#3b82f6', linewidth=2, label='Induced drag', linestyle='--')
ax1.plot(speeds, drag_total, color='#f59e0b', linewidth=2.5, label='Total drag')
ax1.axvline(best_speed, color='#22c55e', linestyle=':', alpha=0.5)
ax1.plot(best_speed, drag_total[best_speed_idx], 'o', color='#22c55e', markersize=10,
         label=f'Minimum drag ({best_speed:.1f} m/s)')
ax1.set_xlabel('Airspeed (m/s)', color='white')
ax1.set_ylabel('Drag force (N)', color='white')
ax1.set_title('Drag Components vs Speed', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
ax2.plot(speeds, LD_ratio, color='#22c55e', linewidth=2.5)
ax2.fill_between(speeds, LD_ratio, alpha=0.1, color='#22c55e')
ax2.plot(best_speed, best_LD, 'o', color='#f59e0b', markersize=12, zorder=5)
ax2.annotate(f'Best L/D = {best_LD:.1f}\\nat {best_speed:.1f} m/s',
             xy=(best_speed, best_LD), xytext=(best_speed+3, best_LD-0.5),
             color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax2.set_xlabel('Airspeed (m/s)', color='white')
ax2.set_ylabel('Lift/Drag ratio (L/D)', color='white')
ax2.set_title('Glide Efficiency vs Speed', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Flying squirrel aerodynamics:")
print(f"  Mass: {mass} kg, Wing area: {wing_area} m²")
print(f"  Best glide speed: {best_speed:.1f} m/s ({best_speed*3.6:.0f} km/h)")
print(f"  Best L/D: {best_LD:.1f}")
print(f"  Glide angle: {np.degrees(np.arctan(1/best_LD)):.1f}°")
print(f"  From 20m height: range = {20 * best_LD:.0f}m")`,
      challenge: 'What if the flying squirrel could double its wing area (like a colugo/flying lemur)? Change wing_area from 0.04 to 0.08. How does the best L/D change? What about the best glide speed?',
      successHint: 'L/D ratio is the universal measure of flight efficiency. Every aircraft — from paper airplanes to space shuttles — is designed around maximizing L/D at its operating speed.',
    },
    {
      title: 'Wing loading — size matters in gliding',
      concept: `**Wing loading** is the weight per unit of wing area: W/S (in N/m² or kg/m²). It determines the gliding speed and how the animal maneuvers.

Low wing loading (large wing area, low weight):
- Slower glide speed (good for maneuverability)
- Lower sink rate (loses altitude slowly)
- More affected by turbulence
- Examples: butterflies, flying squirrels, paragliders

High wing loading (small wing area, high weight):
- Faster glide speed (good for covering distance)
- Higher sink rate
- More stable in turbulence
- Examples: falcons, swifts, fighter jets

Wing loading scales with body size: W/S ∝ mass^(1/3) for geometrically similar animals. This means larger animals have higher wing loading, which is why elephants can't glide and insects can hover.

The flying squirrel's wing loading (~37 N/m²) is similar to a large butterfly — very low, enabling slow, controlled flight through dense forest canopy.`,
      analogy: 'Wing loading is like tire pressure on a car. Low pressure (low wing loading) = soft ride, good traction on soft ground, but slow top speed. High pressure (high wing loading) = harder ride, faster, but skids on soft surfaces. The flying squirrel\'s "tires" are inflated very softly — perfect for the tight turns of the forest canopy.',
      storyConnection: 'The flying squirrel of Hollongapar glides through dense forest — between trees, under branches, around trunks. Its low wing loading allows the tight turns and slow speeds needed for this obstacle course. A falcon (high wing loading) could glide farther in the open but would crash in the forest canopy.',
      checkQuestion: 'A flying squirrel weighs 150g with 400 cm² of membrane. A peregrine falcon weighs 1kg with 1500 cm² of wing area. Calculate their wing loadings. Why can\'t the falcon glide as slowly?',
      checkAnswer: 'Squirrel: W/S = (0.15 × 9.81) / 0.04 = 36.8 N/m². Falcon: W/S = (1.0 × 9.81) / 0.15 = 65.4 N/m². The falcon\'s wing loading is 1.8× higher, so it must fly 1.8× faster (since L = ½ρv²CₗA) for the same lift coefficient. At low speed, the falcon stalls; the squirrel doesn\'t.',
      codeIntro: 'Compare wing loading across species and show how it determines flight characteristics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Wing loading across species
ax1.set_facecolor('#111827')

species = {
    'Butterfly': (0.0005, 0.002, '#a855f7'),
    'Flying squirrel': (0.15, 0.04, '#22c55e'),
    'Sugar glider': (0.12, 0.03, '#06b6d4'),
    'Colugo': (1.5, 0.25, '#3b82f6'),
    'Pigeon': (0.35, 0.065, '#f59e0b'),
    'Peregrine falcon': (1.0, 0.15, '#ef4444'),
    'Albatross': (8.5, 0.62, '#ec4899'),
    'Hang glider': (90, 15, '#84cc16'),
    'Boeing 747': (180000, 525, '#9ca3af'),
}

names = list(species.keys())
wing_loadings = [m * 9.81 / a for m, a, _ in species.values()]
masses = [m for m, _, _ in species.values()]
colors_sp = [c for _, _, c in species.values()]

ax1.scatter(masses, wing_loadings, c=colors_sp, s=100, edgecolors='white', linewidths=1, zorder=5)
for name, (m, a, c) in species.items():
    wl = m * 9.81 / a
    ax1.annotate(name, (m, wl), textcoords="offset points", xytext=(5, 5),
                 color='white', fontsize=7)

# Allometric trend line
m_range = np.logspace(-4, 6, 100)
wl_trend = 30 * m_range**(1/3)  # approximate scaling
ax1.plot(m_range, wl_trend, color='#4b5563', linestyle='--', alpha=0.5, label='W/S ∝ M^(1/3)')

ax1.set_xscale('log')
ax1.set_yscale('log')
ax1.set_xlabel('Body mass (kg)', color='white')
ax1.set_ylabel('Wing loading (N/m²)', color='white')
ax1.set_title('Wing Loading Across Species', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# 2. Stall speed vs wing loading
ax2.set_facecolor('#111827')
wl_range = np.linspace(1, 200, 200)
rho = 1.225
CL_max = 1.5  # typical max lift coefficient

# Stall speed: V_stall = sqrt(2 * W/S / (rho * CL_max))
v_stall = np.sqrt(2 * wl_range / (rho * CL_max))

ax2.plot(wl_range, v_stall, color='#22c55e', linewidth=2.5)
ax2.fill_between(wl_range, v_stall, alpha=0.1, color='#22c55e')

# Mark species
for name, (m, a, c) in species.items():
    wl = m * 9.81 / a
    vs = np.sqrt(2 * wl / (rho * CL_max))
    if wl < 200:
        ax2.plot(wl, vs, 'o', color=c, markersize=8, zorder=5)
        ax2.annotate(name, (wl, vs), textcoords="offset points", xytext=(5, 3),
                     color='white', fontsize=7)

ax2.set_xlabel('Wing loading (N/m²)', color='white')
ax2.set_ylabel('Minimum glide speed (m/s)', color='white')
ax2.set_title('Stall Speed vs Wing Loading', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 200)

plt.tight_layout()
plt.show()

print("Wing loading determines gliding characteristics:")
for name, (m, a, c) in species.items():
    wl = m * 9.81 / a
    vs = np.sqrt(2 * wl / (rho * 1.5))
    print(f"  {name:>20}: W/S={wl:>8.1f} N/m², stall speed={vs:.1f} m/s")`,
      challenge: 'Why can\'t scaling solve the flying human problem? If a human (70kg) wanted to glide like a flying squirrel (W/S ≈ 37 N/m²), how much wing area would they need? Is this physically practical?',
      successHint: 'Wing loading is the bridge between biology and engineering. It explains why insects hover, squirrels glide, and 747s need runways. Every flight system, natural or artificial, is constrained by the same relationship between weight, area, and speed.',
    },
    {
      title: 'Patagium anatomy — evolution\'s wing membrane',
      concept: `The **patagium** (plural: patagia) is the membrane that enables gliding. In flying squirrels, it's a fold of skin stretching from wrist to ankle on each side, supported by a cartilage rod (styliform cartilage) extending from the wrist.

Patagium structure:
- **Skin layers**: thin epidermis + dermis, minimizing weight
- **Elastic fibers**: allow the membrane to fold compactly when not in use
- **Blood vessels**: maintain tissue health and provide some thermal regulation
- **Muscle strands**: the squirrel can actively tension and shape the membrane
- **Fur**: thin fur on both surfaces, reducing boundary layer turbulence

Different gliding animals have different patagium configurations:
- **Flying squirrels**: wrist-to-ankle (propatagium)
- **Colugos**: wrist-to-ankle + finger webbing + tail membrane (most extensive)
- **Draco lizards**: elongated ribs support the membrane (no limb connection)
- **Flying frogs**: webbed feet act as tiny parachutes
- **Flying snakes**: flattened body creates a concave cross-section (no membrane at all!)`,
      analogy: 'The patagium is like a deployable wing — similar to how a hang glider pilot carries their wing folded and deploys it before launch. The flying squirrel\'s styliform cartilage is like the hang glider\'s control bar — it extends the wing forward, creating the shape needed for lift.',
      storyConnection: 'The flying squirrel of Hollongapar has evolved a patagium optimized for its specific forest habitat: tight canopy, short glide distances, lots of obstacles. Its membrane is smaller than a colugo\'s (which lives in more open forests with longer glides) but more controllable for the precision navigation needed in dense forest.',
      checkQuestion: 'Flying snakes (Chrysopelea) glide without any membrane at all. How?',
      checkAnswer: 'They flatten their body by spreading their ribs outward, creating a concave (U-shaped) cross-section. This concave shape generates lift — like an inverted airplane wing. They also undulate their body in mid-air, which helps maintain stability. Their glide ratio (~3:1) is actually better than many flying squirrels! Proof that you don\'t need a membrane to glide — just the right body shape.',
      codeIntro: 'Model the patagium as an airfoil and analyze its aerodynamic properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Patagium cross-section and airflow
ax1.set_facecolor('#111827')

# Patagium profile (cambered membrane)
x = np.linspace(0, 1, 100)
# Upper surface (slightly curved)
y_upper = 0.08 * np.sin(np.pi * x) + 0.02 * np.sin(2 * np.pi * x)
# Lower surface (membrane sag)
y_lower = -0.03 * np.sin(np.pi * x)

ax1.fill_between(x, y_lower, y_upper, color='#8b4513', alpha=0.6, label='Patagium membrane')
ax1.plot(x, y_upper, color='#d4a574', linewidth=2)
ax1.plot(x, y_lower, color='#d4a574', linewidth=2)

# Airflow streamlines (faster over top)
for y_offset in np.linspace(-0.15, 0.2, 8):
    streamline_x = np.linspace(-0.3, 1.3, 100)
    if y_offset > 0:  # above — faster, curved more
        deflection = 0.03 * np.exp(-((streamline_x - 0.4)/0.3)**2)
        streamline_y = y_offset + deflection
        color = '#22c55e'
        speed_label = 'Fast (low P)'
    else:  # below — slower, less curved
        deflection = -0.01 * np.exp(-((streamline_x - 0.4)/0.3)**2)
        streamline_y = y_offset + deflection
        color = '#3b82f6'
        speed_label = 'Slow (high P)'
    ax1.plot(streamline_x, streamline_y, color=color, linewidth=0.8, alpha=0.5)

# Arrows
ax1.annotate('', xy=(0.5, 0.15), xytext=(0.5, 0.25),
             arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2))
ax1.text(0.5, 0.27, 'LIFT', ha='center', color='#f59e0b', fontsize=11, fontweight='bold')

ax1.annotate('', xy=(-0.25, 0), xytext=(-0.4, 0),
             arrowprops=dict(arrowstyle='->', color='white', lw=2))
ax1.text(-0.45, 0.03, 'Airflow', color='white', fontsize=9)

ax1.text(0.7, 0.13, 'Fast (low P)', color='#22c55e', fontsize=8)
ax1.text(0.7, -0.1, 'Slow (high P)', color='#3b82f6', fontsize=8)

# Wrist and ankle
ax1.plot(0, 0, 'o', color='#ef4444', markersize=8)
ax1.text(0, -0.06, 'Wrist', color='#ef4444', fontsize=8, ha='center')
ax1.plot(1, 0, 'o', color='#ef4444', markersize=8)
ax1.text(1, -0.06, 'Ankle', color='#ef4444', fontsize=8, ha='center')

ax1.set_xlim(-0.5, 1.5)
ax1.set_ylim(-0.2, 0.35)
ax1.set_title('Patagium Cross-Section & Airflow', color='white', fontsize=13)
ax1.set_aspect('equal')
ax1.axis('off')

# 2. Lift coefficient vs angle of attack
ax2.set_facecolor('#111827')
alpha = np.linspace(-5, 25, 200)  # angle of attack in degrees

# CL for different configurations
# Flat membrane
CL_flat = 2 * np.pi * np.radians(alpha) * 0.7  # thin airfoil theory, reduced
CL_flat = np.where(alpha > 15, CL_flat[alpha <= 15][-1] * np.exp(-(alpha[alpha > 15] - 15)/5), CL_flat)

# Cambered membrane (better)
CL_cambered = 2 * np.pi * np.radians(alpha + 3) * 0.8  # 3° of camber offset
CL_cambered = np.where(alpha > 18, CL_cambered[alpha <= 18][-1] * np.exp(-(alpha[alpha > 18] - 18)/5), CL_cambered)

# Flat plate (worst)
CL_plate = 2 * np.pi * np.radians(alpha) * 0.5
CL_plate = np.where(alpha > 12, CL_plate[alpha <= 12][-1] * np.exp(-(alpha[alpha > 12] - 12)/3), CL_plate)

ax2.plot(alpha, CL_flat, color='#f59e0b', linewidth=2, label='Flat membrane')
ax2.plot(alpha, CL_cambered, color='#22c55e', linewidth=2, label='Cambered membrane (squirrel)')
ax2.plot(alpha, CL_plate, color='#ef4444', linewidth=2, label='Flat plate', linestyle='--')

ax2.axhline(0, color='#4b5563', linestyle=':', alpha=0.3)
ax2.axvline(0, color='#4b5563', linestyle=':', alpha=0.3)

# Stall region
ax2.axvspan(15, 25, alpha=0.1, color='#ef4444')
ax2.text(20, 0.5, 'Stall\\nregion', color='#ef4444', fontsize=9, ha='center')

ax2.set_xlabel('Angle of attack (degrees)', color='white')
ax2.set_ylabel('Lift coefficient (CL)', color='white')
ax2.set_title('Lift Coefficient vs Angle of Attack', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Patagium aerodynamics:")
print("  The membrane naturally forms a cambered (curved) airfoil")
print("  Camber increases lift at the same angle of attack")
print("  Active muscle control adjusts camber in flight")
print()
print("Key design features:")
print("  Styliform cartilage: extends wing area forward")
print("  Elastic fibers: compact folding when not gliding")
print("  Active tensioning: real-time shape control")
print("  Fur surface: reduces turbulence (like golf ball dimples)")`,
      challenge: 'The colugo (flying lemur) has the largest patagium relative to body size of any mammal — it even has webbed fingers and a tail membrane. Estimate its wing area and compare wing loading to the flying squirrel. Why might a larger membrane be better in some habitats?',
      successHint: 'The patagium is evolution\'s simplest wing: a skin fold that becomes an airfoil. Despite its simplicity, it generates enough lift for 90-meter glides. This minimal design philosophy inspires lightweight engineering — sometimes less material means more performance.',
    },
    {
      title: 'Angle of attack — controlling the glide',
      concept: `The **angle of attack** (α) is the angle between the wing (or body) and the oncoming airflow. It's the primary control variable for any flying object:

- **Low α (0-5°)**: moderate lift, low drag → fast, shallow glide
- **Medium α (5-12°)**: high lift, moderate drag → best glide efficiency
- **High α (12-20°)**: maximum lift but high drag → slow flight, steep descent
- **Beyond stall (~15-20°)**: flow separates from wing surface, lift drops catastrophically

The flying squirrel controls α by:
1. **Body posture**: tilting the body changes the membrane angle
2. **Tail position**: the bushy tail acts as an elevator (pitch control)
3. **Limb position**: extending or retracting legs changes membrane shape and tension
4. **Landing flare**: just before landing, the squirrel pitches up steeply, increasing drag to slow down (like an airplane landing flare)

The stall speed (minimum speed before lift collapses) depends on α_max, wing loading, and air density. For the flying squirrel, stall speed is about 4-5 m/s — slow enough for precise tree landings.`,
      analogy: 'Angle of attack is like the angle you hold your hand out a car window. Flat (low α) = your hand slices through the air smoothly. Tilted up (medium α) = you feel a strong lifting force. Too tilted (high α) = the air can\'t follow your hand\'s shape, it gets turbulent, and the lift disappears. That sudden loss of lift is a stall.',
      storyConnection: 'The flying squirrel of Hollongapar performs a remarkable landing maneuver: just before reaching the target tree, it pitches its body upward to a high angle of attack. This generates maximum drag (like applying brakes) and reduces forward speed enough for a gentle landing. The squirrel goes from 10+ m/s to nearly zero in less than a meter — all by controlling angle of attack.',
      checkQuestion: 'Fighter jets can fly at very high angles of attack (30-60°) using thrust vectoring. Why can\'t a glider do this?',
      checkAnswer: 'A glider has no engine to provide thrust. At high α, drag increases dramatically. Without thrust to overcome that drag, the glider decelerates. Below stall speed, lift collapses and the glider falls. Fighter jets push past stall because their engines provide enough thrust to maintain speed despite enormous drag. Gliders are limited to the pre-stall regime.',
      codeIntro: 'Simulate a flying squirrel glide with angle of attack control and landing flare.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Simulate glide trajectory with physics
dt = 0.01  # time step (seconds)
mass = 0.15  # kg
wing_area = 0.04  # m²
rho = 1.225  # kg/m³
g = 9.81

# Initial conditions
x, y = 0, 20  # start at 20m height
vx, vy = 8, 0  # initial horizontal velocity
alpha = 8  # initial angle of attack (degrees)

trajectory_x = [x]
trajectory_y = [y]
speeds = [np.sqrt(vx**2 + vy**2)]
alphas = [alpha]
times = [0]
t = 0

while y > 0 and x < 100:
    v = np.sqrt(vx**2 + vy**2)
    if v < 0.1: break

    # Flight path angle
    gamma = np.arctan2(-vy, vx)  # negative vy because y is up

    # Aerodynamic coefficients (angle of attack dependent)
    alpha_rad = np.radians(alpha)
    CL = min(2 * np.pi * alpha_rad * 0.6, 1.8)  # limit
    if alpha > 20: CL = max(1.8 * np.exp(-(alpha - 20)/5), 0.5)  # stall
    CD = 0.05 + CL**2 / (np.pi * 1.5 * 0.7)  # parasitic + induced

    # Forces
    q = 0.5 * rho * v**2 * wing_area  # dynamic pressure × area
    lift = q * CL
    drag = q * CD

    # Resolve forces (perpendicular and parallel to velocity)
    ax_aero = (-drag * np.cos(gamma) - lift * np.sin(gamma)) / mass
    ay_aero = (-drag * np.sin(gamma) + lift * np.cos(gamma)) / mass - g

    vx += ax_aero * dt
    vy += ay_aero * dt
    x += vx * dt
    y += vy * dt

    # Flight control: adjust alpha based on phase
    horizontal_dist = x
    if horizontal_dist > 35:  # approaching landing
        alpha = min(alpha + 0.5, 35)  # flare: increase alpha for braking
    elif y < 5:
        alpha = min(alpha + 0.3, 25)
    else:
        alpha = 8  # cruise alpha

    trajectory_x.append(x)
    trajectory_y.append(y)
    speeds.append(v)
    alphas.append(alpha)
    t += dt
    times.append(t)

# 1. Trajectory
ax1.set_facecolor('#111827')
ax1.plot(trajectory_x, trajectory_y, color='#22c55e', linewidth=2.5)

# Color by speed
for i in range(0, len(trajectory_x)-1, 5):
    speed_norm = speeds[i] / max(speeds)
    color = plt.cm.coolwarm(speed_norm)
    ax1.plot(trajectory_x[i:i+6], trajectory_y[i:i+6], color=color, linewidth=3, alpha=0.7)

# Trees
ax1.plot([0, 0], [0, 20], color='#8b4513', linewidth=4)
ax1.scatter(0, 20, s=200, color='#22c55e', marker='^', zorder=5)
land_x = trajectory_x[-1]
ax1.plot([land_x, land_x], [0, 8], color='#8b4513', linewidth=4)
ax1.scatter(land_x, 8, s=200, color='#22c55e', marker='^', zorder=5)

# Annotate phases
ax1.annotate('Launch', xy=(0, 20), xytext=(3, 22), color='white', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='white'))
ax1.annotate('Cruise (α=8°)', xy=(15, 14), color='#f59e0b', fontsize=9)
ax1.annotate('Flare (α→35°)', xy=(35, 5), color='#ef4444', fontsize=9)

ax1.set_xlabel('Horizontal distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Flying Squirrel Glide Trajectory with Landing Flare', color='white', fontsize=13)
ax1.set_ylim(-1, 25)
ax1.set_aspect('equal')
ax1.tick_params(colors='gray')

# 2. Speed and angle of attack over time
ax2.set_facecolor('#111827')
ax2_twin = ax2.twinx()

ax2.plot(times, speeds, color='#3b82f6', linewidth=2, label='Speed (m/s)')
ax2_twin.plot(times, alphas, color='#ef4444', linewidth=2, linestyle='--', label='α (degrees)')

ax2.set_xlabel('Time (seconds)', color='white')
ax2.set_ylabel('Speed (m/s)', color='#3b82f6')
ax2_twin.set_ylabel('Angle of attack (°)', color='#ef4444')
ax2.set_title('Speed and Angle of Attack During Glide', color='white', fontsize=13)

lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='gray')

plt.tight_layout()
plt.show()

final_speed = speeds[-1]
total_dist = trajectory_x[-1]
glide_ratio = total_dist / 20
print(f"Glide summary:")
print(f"  Launch height: 20m")
print(f"  Horizontal distance: {total_dist:.1f}m")
print(f"  Glide ratio: {glide_ratio:.1f}:1")
print(f"  Landing speed: {final_speed:.1f} m/s (flare reduced from {max(speeds):.1f})")
print(f"  Flight time: {times[-1]:.1f}s")`,
      challenge: 'Remove the landing flare (keep alpha=8° throughout). What is the landing speed now? Why is the flare critical for survival?',
      successHint: 'Angle of attack is the pilot\'s primary control. Whether it\'s a flying squirrel tilting its body or a 787 pilot pulling back on the yoke, the physics is identical: changing α trades speed for lift and vice versa.',
    },
    {
      title: 'Glide ratio optimization — nature\'s engineering trade-offs',
      concept: `The glide ratio is not a fixed number — it depends on speed, wing configuration, and environmental conditions. Optimizing the glide means finding the sweet spot:

**Factors that increase glide ratio**:
- Higher aspect ratio (longer, narrower wings) — reduces induced drag
- Smoother surfaces — reduces parasitic drag
- Optimal speed — the best L/D speed

**Factors that decrease glide ratio**:
- Turbulence — unpredictable forces waste energy
- Rain — adds weight and roughens surfaces
- Maneuvering — turning increases drag

The flying squirrel faces unique optimization constraints:
- **Forest canopy**: short distances, many obstacles → maneuverability matters more than pure efficiency
- **Predator avoidance**: unpredictable flight paths are survival advantages
- **Landing precision**: must hit a specific tree trunk at the right height and speed
- **Energy budget**: gliding is free (gravity-powered), but climbing back up the next tree costs energy

Evolution optimized the squirrel not for maximum glide ratio, but for **maximum survival** — which means good enough glide ratio with excellent control and maneuverability.`,
      analogy: 'The flying squirrel\'s glide ratio optimization is like a city car vs. a highway cruiser. A city car isn\'t the most fuel-efficient on the highway, but it excels at tight turns, quick stops, and parking — what actually matters in the city. The squirrel\'s "city car" membrane is optimized for the dense forest "city," not the open-air "highway" that sailplanes use.',
      storyConnection: 'The Hollongapar forest is dense and dark — giant dipterocarp trees with thick canopy. The flying squirrel doesn\'t need to glide 200 meters in a straight line. It needs to glide 30-50 meters through a maze of branches, landing precisely on a target tree trunk. Every aspect of its design reflects this specific challenge.',
      checkQuestion: 'An engineer wants to build a drone that glides through dense forest like a flying squirrel. Should they optimize for maximum glide ratio?',
      checkAnswer: 'No — they should optimize for maneuverability, obstacle avoidance, and precision landing. Maximum glide ratio means high aspect ratio wings (long and narrow), which are terrible for tight turns and prone to catching on branches. The drone should mimic the squirrel\'s design: low aspect ratio, high maneuverability, moderate glide ratio. This is the biomimicry lesson: copy the design goals, not just the shape.',
      codeIntro: 'Optimize glide parameters and visualize the trade-off between efficiency and maneuverability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Glide ratio vs aspect ratio
ax1.set_facecolor('#111827')
aspect_ratios = np.linspace(0.5, 15, 200)

# Max L/D ≈ 0.5 × sqrt(π × e × AR / CD0)
CD0 = 0.04
e = 0.7
max_LD = 0.5 * np.sqrt(np.pi * e * aspect_ratios / CD0)

# Turn radius (lower AR = tighter turns)
min_turn_radius = 2 * aspect_ratios  # approximate (meters)

ax1.plot(aspect_ratios, max_LD, color='#22c55e', linewidth=2.5, label='Max L/D (glide ratio)')
ax1_twin = ax1.twinx()
ax1_twin.plot(aspect_ratios, min_turn_radius, color='#ef4444', linewidth=2.5, linestyle='--', label='Min turn radius (m)')

# Mark animals
animals_ar = {
    'Flying squirrel': (1.5, '#f59e0b'),
    'Sugar glider': (1.8, '#06b6d4'),
    'Colugo': (2.5, '#3b82f6'),
    'Albatross': (12, '#a855f7'),
    'Sailplane': (15, '#9ca3af'),
}

for name, (ar, color) in animals_ar.items():
    ld = 0.5 * np.sqrt(np.pi * e * ar / CD0)
    ax1.plot(ar, ld, 'o', color=color, markersize=10, zorder=5)
    ax1.annotate(name, (ar, ld), textcoords="offset points", xytext=(5, 5),
                 color=color, fontsize=8)

ax1.set_xlabel('Aspect ratio (wingspan²/area)', color='white')
ax1.set_ylabel('Max glide ratio (L/D)', color='#22c55e')
ax1_twin.set_ylabel('Min turn radius (m)', color='#ef4444')
ax1.set_title('The L/D vs Maneuverability Trade-off', color='white', fontsize=13)

lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax1_twin.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1_twin.tick_params(colors='gray')

# 2. Mission success rate simulation
ax2.set_facecolor('#111827')
np.random.seed(42)

# Simulate 1000 forest glides for different aspect ratios
AR_test = [1.0, 1.5, 2.5, 5.0, 10.0]
success_rates = []

for ar in AR_test:
    successes = 0
    n_trials = 1000
    for _ in range(n_trials):
        # Random forest: obstacles at random positions
        glide_dist = 35  # target distance
        n_obstacles = np.random.randint(3, 8)
        obstacle_positions = np.random.uniform(5, 30, n_obstacles)

        # Can the glider turn to avoid obstacles?
        turn_radius = 2 * ar  # meters
        can_avoid = all(
            turn_radius < np.random.uniform(1, 5)  # gap width
            for _ in range(n_obstacles)
        )

        # Does it reach the target?
        ld = 0.5 * np.sqrt(np.pi * e * ar / CD0)
        height_needed = glide_dist / ld
        has_range = height_needed < 20  # launched from 20m

        if can_avoid and has_range:
            successes += 1

    success_rates.append(successes / n_trials * 100)

colors_ar = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
bars = ax2.bar([f'AR={ar}' for ar in AR_test], success_rates, color=colors_ar, alpha=0.8,
               edgecolor='white', linewidth=0.5)

for bar, rate, ar in zip(bars, success_rates, AR_test):
    ld = 0.5 * np.sqrt(np.pi * e * ar / CD0)
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'L/D={ld:.1f}', ha='center', color='white', fontsize=9)

ax2.set_ylabel('Mission success rate (%)', color='white')
ax2.set_title('Forest Glide Success: AR Trade-off', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Optimization results:")
for ar, rate in zip(AR_test, success_rates):
    ld = 0.5 * np.sqrt(np.pi * e * ar / CD0)
    tr = 2 * ar
    print(f"  AR={ar:>4.1f}: L/D={ld:.1f}, turn radius={tr:.0f}m, success={rate:.0f}%")
print()
print("The flying squirrel's AR≈1.5 is NOT the best glide ratio.")
print("But it IS the best SURVIVAL ratio in dense forest.")
print("Evolution optimizes for fitness, not any single parameter.")`,
      challenge: 'Add wind to the simulation: a random headwind or tailwind of 0-3 m/s. How does wind affect the optimal aspect ratio? Does the flying squirrel\'s AR become even more advantageous in gusty conditions?',
      successHint: 'The flying squirrel teaches a fundamental engineering lesson: optimal performance depends on the mission, not on maximizing a single metric. The "best" glider for a forest is very different from the "best" glider for open sky. Context determines design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Gliding & Aerodynamics — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for aerodynamics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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