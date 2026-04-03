import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MountainEchoesLevel4() {
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
      title: 'Project design — the valley echo simulator',
      concept: `In this capstone you will build a complete **valley echo simulator**: a program that models sound propagation, reflection, and absorption in a mountain valley cross-section. By the end, you will have an interactive tool that lets you adjust the valley geometry and see how echoes change.

The simulator has four core subsystems:

**1. Geometry engine**: Define the valley as a set of line segments — left slope, right slope, valley floor, optional cave openings, boulders. Each segment has a position and a material (rock, forest, water, soil) with a known absorption coefficient.

**2. Ray tracer**: Launch sound rays from a source point in all directions. At each surface hit, apply the reflection law and reduce energy by the absorption coefficient. Track the full path of each ray.

**3. Time-delay calculator**: Convert each ray's total path length to a time delay (distance / speed_of_sound). Account for temperature variation with altitude. Optionally add Doppler shift for a moving source.

**4. Visualization**: Plot the ray paths overlaid on the valley geometry, and generate an **echogram** — a timeline showing when each echo arrives and how loud it is. This is the standard output of architectural acoustics software.

The design principle is **separation of concerns**: each subsystem is an independent module with a clean interface. The geometry engine knows nothing about rays; the ray tracer knows nothing about visualization. This makes the code testable, reusable, and extensible.`,
      analogy: 'Building the simulator is like designing a pinball machine. First you design the table layout (geometry), then figure out the physics of ball bouncing (ray tracing), then add scoring (time delays and energy), and finally the display (visualization). Each part works independently but they combine into a complete system.',
      storyConnection: 'The valley we model is inspired by the deep gorges of the Khasi and Jaintia Hills of Meghalaya, where rivers have carved steep-sided valleys into limestone over millions of years. The left wall is bare limestone (highly reflective), the right wall has patches of subtropical forest (absorptive), and the floor is a mix of river water and rocky banks. This asymmetry creates a distinctive echo signature: strong returns from the rock side, muffled returns from the forest side.',
      checkQuestion: 'Why is separation of concerns important in a simulator like this? What would go wrong if the ray tracer directly drew graphics instead of returning data?',
      checkAnswer: 'If the ray tracer drew graphics directly, you could not reuse it for different purposes (e.g., computing echo timing without any visualization, running automated tests, or switching to a 3D renderer). You also could not swap out the visualization without modifying the physics code. Separation of concerns means each module can be tested, debugged, and improved independently. A bug in the drawing code would not break the physics, and vice versa.',
      codeIntro: 'Define the data structures and geometry engine for the valley simulator. Build a configurable valley with different wall materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# Module 1: Geometry Engine — Valley definition
# ============================================================

class Material:
    """Acoustic material with absorption and color for rendering."""
    def __init__(self, name, absorption, color):
        self.name = name
        self.absorption = absorption
        self.color = color

    def __repr__(self):
        return f"Material({self.name}, α={self.absorption})"

# Standard materials
MATERIALS = {
    'limestone':  Material('Limestone',       0.02, '#94a3b8'),
    'granite':    Material('Granite',          0.05, '#64748b'),
    'forest':     Material('Dense forest',     0.50, '#22c55e'),
    'water':      Material('Water surface',    0.01, '#3b82f6'),
    'soil':       Material('Soil/grass',       0.25, '#a3763d'),
    'gravel':     Material('River gravel',     0.40, '#78716c'),
}

class WallSegment:
    """A line segment representing part of the valley boundary."""
    def __init__(self, x1, y1, x2, y2, material):
        self.x1, self.y1 = x1, y1
        self.x2, self.y2 = x2, y2
        self.material = material
        # Precompute normal (outward-facing)
        dx, dy = x2 - x1, y2 - y1
        length = np.sqrt(dx**2 + dy**2)
        self.nx, self.ny = -dy / length, dx / length

class Valley:
    """A valley cross-section defined by wall segments."""
    def __init__(self, name="Khasi Hills Valley"):
        self.name = name
        self.walls = []

    def add_wall(self, x1, y1, x2, y2, material_name):
        mat = MATERIALS[material_name]
        self.walls.append(WallSegment(x1, y1, x2, y2, mat))

    def build_default(self):
        """Build a valley inspired by Meghalaya gorges."""
        self.walls = []
        # Left slope — bare limestone (highly reflective)
        self.add_wall(-250, 0, -230, 100, 'limestone')
        self.add_wall(-230, 100, -200, 220, 'limestone')
        self.add_wall(-200, 220, -170, 350, 'granite')
        self.add_wall(-170, 350, -140, 450, 'limestone')

        # Right slope — mixed: rock below, forest in middle, rock above
        self.add_wall(250, 0, 230, 80, 'limestone')
        self.add_wall(230, 80, 210, 170, 'forest')
        self.add_wall(210, 170, 190, 280, 'forest')
        self.add_wall(190, 280, 165, 380, 'granite')
        self.add_wall(165, 380, 140, 450, 'limestone')

        # Valley floor — river in center, gravel banks
        self.add_wall(-250, 0, -80, 0, 'soil')
        self.add_wall(-80, 0, 80, 0, 'water')
        self.add_wall(80, 0, 250, 0, 'gravel')

    def build_narrow_gorge(self):
        """Narrow gorge variant — strong flutter echoes."""
        self.walls = []
        self.add_wall(-60, 0, -55, 150, 'limestone')
        self.add_wall(-55, 150, -50, 300, 'limestone')
        self.add_wall(-50, 300, -45, 400, 'limestone')
        self.add_wall(60, 0, 55, 150, 'limestone')
        self.add_wall(55, 150, 50, 300, 'limestone')
        self.add_wall(50, 300, 45, 400, 'limestone')
        self.add_wall(-60, 0, 60, 0, 'water')
        self.name = "Narrow Limestone Gorge"

    def plot(self, ax):
        """Render the valley geometry."""
        for wall in self.walls:
            ax.plot([wall.x1, wall.x2], [wall.y1, wall.y2],
                    color=wall.material.color, linewidth=3, solid_capstyle='round')
        ax.set_aspect('equal')

# Build and display both valley configurations
fig, axes = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Default valley
v1 = Valley()
v1.build_default()
v1.plot(axes[0])
axes[0].plot(0, 5, '*', color='#f59e0b', markersize=15, zorder=5)
axes[0].set_title('Khasi Hills Valley (wide, asymmetric)', color='white', fontsize=11)
axes[0].set_xlabel('Distance (m)', color='white')
axes[0].set_ylabel('Altitude (m)', color='white')

# Narrow gorge
v2 = Valley()
v2.build_narrow_gorge()
v2.plot(axes[1])
axes[1].plot(0, 5, '*', color='#f59e0b', markersize=15, zorder=5)
axes[1].set_title('Narrow Limestone Gorge (flutter echo)', color='white', fontsize=11)
axes[1].set_xlabel('Distance (m)', color='white')
axes[1].set_ylabel('Altitude (m)', color='white')

# Legend
from matplotlib.lines import Line2D
legend_elements = [Line2D([0], [0], color=m.color, linewidth=3, label=f"{m.name} (α={m.absorption})")
                   for m in MATERIALS.values()]
fig.legend(handles=legend_elements, loc='lower center', ncol=3,
           facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

plt.tight_layout(rect=[0, 0.08, 1, 1])
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("Valley Geometry Engine — Module 1 complete")
print(f"  Default valley: {len(v1.walls)} wall segments")
print(f"  Narrow gorge:   {len(v2.walls)} wall segments")
print()
print("Materials library:")
for name, mat in MATERIALS.items():
    reflected = (1 - mat.absorption) * 100
    print(f"  {mat.name:<16} α={mat.absorption:.2f}  reflects {reflected:.0f}%")
print()
print("The star marks the sound source position.")
print("Next step: build the ray tracer that bounces sound off these walls.")`,
      challenge: 'Add a third valley configuration: a U-shaped valley with a cave opening on the left wall (a gap in the cliff with interior walls forming a small chamber). This models the cave entrances found throughout the Jaintia Hills.',
      successHint: 'The geometry engine provides a clean interface for defining valleys. Each wall knows its material and pre-computed normal vector. Next we add the ray tracer.',
    },
    {
      title: '2D ray tracing for sound',
      concept: `The ray tracer is the physics engine of the simulator. For each ray:

1. **Launch**: Start from the source position with a direction angle.
2. **Propagate**: Travel in a straight line until hitting a wall.
3. **Intersect**: Find which wall segment the ray hits first. This requires solving the ray-line intersection equation for every wall and keeping the closest hit.
4. **Reflect**: Apply the law of reflection: the reflected direction is d - 2(d·n)n, where d is the incoming direction and n is the surface normal.
5. **Attenuate**: Multiply the ray's energy by (1 - α), where α is the wall's absorption coefficient.
6. **Repeat**: Continue from the hit point with the new direction until the energy drops below a threshold or the ray escapes.

The key numerical detail is the **ray-segment intersection test**. Given a ray origin O and direction D, and a segment from A to B:

- Parameterize the ray: P = O + tD (t > 0 means forward)
- Parameterize the segment: Q = A + u(B - A) (0 ≤ u ≤ 1 means on the segment)
- Set P = Q and solve for t and u
- If t > 0 and 0 ≤ u ≤ 1, the ray hits the segment at distance t

We use a small epsilon (t > 0.001) to avoid the ray immediately re-intersecting the surface it just bounced off of. This is a standard trick in ray tracing called the **shadow bias**.`,
      analogy: 'The ray tracer works like a laser pointer in a room of mirrors. Point it at a mirror, it bounces off at the reflection angle, hits another mirror, bounces again, gradually getting dimmer as each mirror absorbs a fraction of the light. The program does exactly this, thousands of times, for thousands of laser pointers aimed in different directions.',
      storyConnection: 'When you stand at the bottom of a gorge in the East Khasi Hills and clap your hands, the sound fans out in all directions — just like our ray tracer launching rays at many angles. Some rays hit the near rock face and bounce straight back (the first echo). Others bounce between the walls multiple times before returning (flutter echo). The ray tracer reproduces this natural behavior computationally.',
      checkQuestion: 'Why do we need a shadow bias (t > epsilon instead of t > 0)? What artifact would occur without it?',
      checkAnswer: 'Without the shadow bias, due to floating-point rounding errors, a ray that just reflected off a surface might detect that same surface at t ≈ 0 (or even a tiny negative t). The ray would immediately "re-hit" the wall it just left, getting stuck in an infinite loop of zero-distance reflections. The epsilon ensures the ray moves a tiny distance away before checking for new intersections.',
      codeIntro: 'Build the complete ray tracer module and test it on the default valley geometry.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Re-define geometry classes (in a real project these would be imported)
class Material:
    def __init__(self, name, absorption, color):
        self.name = name; self.absorption = absorption; self.color = color

MATERIALS = {
    'limestone': Material('Limestone', 0.02, '#94a3b8'),
    'granite':   Material('Granite',   0.05, '#64748b'),
    'forest':    Material('Forest',    0.50, '#22c55e'),
    'water':     Material('Water',     0.01, '#3b82f6'),
    'soil':      Material('Soil',      0.25, '#a3763d'),
    'gravel':    Material('Gravel',    0.40, '#78716c'),
}

class Wall:
    def __init__(self, x1, y1, x2, y2, material):
        self.x1, self.y1, self.x2, self.y2 = x1, y1, x2, y2
        self.material = material
        dx, dy = x2 - x1, y2 - y1
        length = np.sqrt(dx**2 + dy**2)
        self.nx, self.ny = -dy / length, dx / length

def build_valley():
    walls = []
    def add(x1, y1, x2, y2, mat):
        walls.append(Wall(x1, y1, x2, y2, MATERIALS[mat]))
    # Left slope (limestone)
    add(-250, 0, -230, 100, 'limestone')
    add(-230, 100, -200, 220, 'limestone')
    add(-200, 220, -170, 350, 'granite')
    add(-170, 350, -140, 450, 'limestone')
    # Right slope (mixed)
    add(250, 0, 230, 80, 'limestone')
    add(230, 80, 210, 170, 'forest')
    add(210, 170, 190, 280, 'forest')
    add(190, 280, 165, 380, 'granite')
    add(165, 380, 140, 450, 'limestone')
    # Floor
    add(-250, 0, -80, 0, 'soil')
    add(-80, 0, 80, 0, 'water')
    add(80, 0, 250, 0, 'gravel')
    return walls

# ============================================================
# Module 2: Ray Tracer
# ============================================================

class RayTracer:
    """2D acoustic ray tracer with reflection and absorption."""

    def __init__(self, walls, speed_of_sound=343.0):
        self.walls = walls
        self.v = speed_of_sound

    def _intersect(self, ox, oy, dx, dy, wall):
        """Ray-segment intersection. Returns (t, hit_x, hit_y) or (None, None, None)."""
        sx, sy = wall.x2 - wall.x1, wall.y2 - wall.y1
        denom = dx * sy - dy * sx
        if abs(denom) < 1e-12:
            return None, None, None
        t = ((wall.x1 - ox) * sy - (wall.y1 - oy) * sx) / denom
        u = ((wall.x1 - ox) * dy - (wall.y1 - oy) * dx) / denom
        if t > 0.001 and 0 <= u <= 1:
            return t, ox + t * dx, oy + t * dy
        return None, None, None

    def _reflect_dir(self, dx, dy, nx, ny):
        """Reflect direction vector off surface with given normal."""
        dot = dx * nx + dy * ny
        return dx - 2 * dot * nx, dy - 2 * dot * ny

    def trace(self, ox, oy, angle_deg, max_bounces=12, min_energy=0.01):
        """Trace one ray. Returns list of dicts with position, energy, time, wall hit."""
        dx = np.cos(np.radians(angle_deg))
        dy = np.sin(np.radians(angle_deg))
        energy = 1.0
        cumulative_dist = 0.0
        path = [{'x': ox, 'y': oy, 'energy': energy, 'time': 0.0,
                 'wall': None, 'bounce': 0}]

        for bounce in range(1, max_bounces + 1):
            best_t = float('inf')
            best_wall = None
            best_hx, best_hy = None, None

            for wall in self.walls:
                t, hx, hy = self._intersect(ox, oy, dx, dy, wall)
                if t is not None and t < best_t:
                    best_t = t
                    best_wall = wall
                    best_hx, best_hy = hx, hy

            if best_wall is None or best_t > 3000:
                # Ray escaped the scene
                escape_x = ox + dx * 600
                escape_y = oy + dy * 600
                cumulative_dist += 600
                path.append({'x': escape_x, 'y': escape_y, 'energy': energy,
                             'time': cumulative_dist / self.v,
                             'wall': None, 'bounce': bounce})
                break

            cumulative_dist += best_t
            energy *= (1 - best_wall.material.absorption)

            path.append({'x': best_hx, 'y': best_hy, 'energy': energy,
                         'time': cumulative_dist / self.v,
                         'wall': best_wall.material.name, 'bounce': bounce})

            if energy < min_energy:
                break

            # Ensure normal faces the incoming ray
            nx, ny = best_wall.nx, best_wall.ny
            if nx * (ox - best_hx) + ny * (oy - best_hy) < 0:
                nx, ny = -nx, -ny

            dx, dy = self._reflect_dir(dx, dy, nx, ny)
            ox, oy = best_hx, best_hy

        return path

    def trace_all(self, ox, oy, n_rays=72, **kwargs):
        """Trace n_rays evenly spaced from source. Returns list of paths."""
        angles = np.linspace(1, 179, n_rays)
        return [self.trace(ox, oy, a, **kwargs) for a in angles]

# Build and trace
walls = build_valley()
tracer = RayTracer(walls)
source = (0, 8)
all_paths = tracer.trace_all(*source, n_rays=60, max_bounces=10)

# Visualize
fig, axes = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

# Draw walls on both panels
for wall in walls:
    for ax in axes:
        ax.plot([wall.x1, wall.x2], [wall.y1, wall.y2],
                color=wall.material.color, linewidth=3, solid_capstyle='round')

# Panel 1: All rays colored by launch angle
cmap = plt.cm.plasma
for i, path in enumerate(all_paths):
    color = cmap(i / len(all_paths))
    xs = [p['x'] for p in path]
    ys = [p['y'] for p in path]
    for j in range(len(xs) - 1):
        axes[0].plot([xs[j], xs[j+1]], [ys[j], ys[j+1]],
                     color=color, linewidth=0.6, alpha=path[j]['energy'])

axes[0].plot(*source, '*', color='#f59e0b', markersize=15, zorder=5)
axes[0].set_title('Ray tracing — 60 rays, up to 10 bounces', color='white')
axes[0].set_xlabel('Distance (m)', color='white')
axes[0].set_ylabel('Altitude (m)', color='white')
axes[0].set_xlim(-280, 280)
axes[0].set_ylim(-20, 480)

# Panel 2: Rays colored by remaining energy
for path in all_paths:
    xs = [p['x'] for p in path]
    ys = [p['y'] for p in path]
    for j in range(len(xs) - 1):
        e = path[j]['energy']
        color = plt.cm.hot(e)
        axes[1].plot([xs[j], xs[j+1]], [ys[j], ys[j+1]],
                     color=color, linewidth=0.8, alpha=max(e, 0.1))

axes[1].plot(*source, '*', color='#f59e0b', markersize=15, zorder=5)
axes[1].set_title('Energy decay (bright = strong, dark = absorbed)', color='white')
axes[1].set_xlabel('Distance (m)', color='white')
axes[1].set_ylabel('Altitude (m)', color='white')
axes[1].set_xlim(-280, 280)
axes[1].set_ylim(-20, 480)

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
# Statistics
total_bounces = sum(len(p) - 1 for p in all_paths)
avg_bounces = total_bounces / len(all_paths)
forest_hits = sum(1 for p in all_paths for pt in p if pt['wall'] == 'Forest')
rock_hits = sum(1 for p in all_paths for pt in p if pt['wall'] in ('Limestone', 'Granite'))
print(f"Ray tracing statistics:")
print(f"  Rays launched:      {len(all_paths)}")
print(f"  Total bounces:      {total_bounces}")
print(f"  Avg bounces/ray:    {avg_bounces:.1f}")
print(f"  Rock surface hits:  {rock_hits}")
print(f"  Forest hits:        {forest_hits}")
print(f"  Energy lost to forest absorption is ~50% per hit vs ~2-5% for rock.")`,
      challenge: 'Add a random perturbation to the reflection angle (±5 degrees) to simulate surface roughness. Compare the ray patterns for smooth limestone versus rough granite. How does diffuse reflection change the echo pattern?',
      successHint: 'The ray tracer handles intersection, reflection, and energy tracking cleanly. Next we model how different surfaces absorb sound.',
    },
    {
      title: 'Reflection & absorption — material modeling',
      concept: `Not all surfaces treat sound the same way. When a sound wave hits a surface, three things happen:

1. **Reflection**: Some energy bounces back. The fraction reflected is (1 - α).
2. **Absorption**: Some energy is converted to heat in the material. The fraction absorbed is α.
3. **Transmission**: Some energy passes through the material to the other side (relevant for thin walls, not for solid cliff faces).

The **absorption coefficient α** depends on the material AND the frequency:

- **Hard surfaces** (limestone, concrete, glass): α = 0.01-0.05 at most frequencies. Almost perfect mirrors for sound. These create strong, clear echoes.
- **Porous materials** (forest canopy, carpet, acoustic foam): α = 0.3-0.9, especially at high frequencies. Air friction in the pores converts sound energy to heat.
- **Water**: α ≈ 0.01 for a flat surface (almost perfect reflector), but a turbulent river surface scatters sound, effectively increasing absorption.
- **Resonant absorbers**: Cavities and membrane panels absorb strongly at specific frequencies. Tree hollows in a forest act as natural Helmholtz resonators.

The frequency dependence matters: high-pitched sounds are absorbed more by vegetation than low-pitched sounds. This is why a distant thunderclap sounds like a low rumble — the high frequencies are stripped away by atmospheric absorption and surface interactions.`,
      analogy: 'Think of different surfaces like different types of walls in a handball game. A concrete wall (limestone) returns the ball with almost full speed — great for echoes. A curtain (forest) absorbs most of the impact and the ball barely comes back. A trampoline (water surface) returns the ball but changes its angle unpredictably. Each "wall" in the valley plays the sound back differently.',
      storyConnection: 'The Khasi Hills offer a natural experiment in acoustic absorption. Above the tree line, bare limestone cliffs ring with clean echoes. Below, where subtropical forest clothes the slopes, the same shout produces only a muffled, diffuse return. Waterfalls — common in Meghalaya, the "abode of clouds" with some of India\'s heaviest rainfall — create constant broadband noise that masks echoes. The interplay between rock, forest, and water gives each valley its unique acoustic character.',
      checkQuestion: 'If a sound ray bounces 5 times off limestone (α = 0.02) versus 5 times off forest (α = 0.50), what fraction of the original energy remains in each case?',
      checkAnswer: 'Limestone: (1 - 0.02)^5 = 0.98^5 = 0.904 — about 90% of the energy survives 5 bounces. Forest: (1 - 0.50)^5 = 0.50^5 = 0.031 — only 3.1% survives. This 29x difference explains why limestone valleys echo dramatically while forested valleys are acoustically "dead." After 5 bounces in a forested valley, the echo is essentially inaudible.',
      codeIntro: 'Model frequency-dependent absorption for different materials and show how multi-bounce echoes differ between valley types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Frequency-dependent absorption coefficients (measured data, simplified)
# Format: {frequency_Hz: absorption_coefficient}
ABSORPTION_DATA = {
    'Limestone': {
        125: 0.01, 250: 0.01, 500: 0.02, 1000: 0.02, 2000: 0.03, 4000: 0.04
    },
    'Dense forest': {
        125: 0.15, 250: 0.25, 500: 0.40, 1000: 0.55, 2000: 0.65, 4000: 0.70
    },
    'Water (calm)': {
        125: 0.008, 250: 0.008, 500: 0.01, 1000: 0.01, 2000: 0.02, 4000: 0.02
    },
    'Soil/grass': {
        125: 0.10, 250: 0.20, 500: 0.30, 1000: 0.35, 2000: 0.40, 4000: 0.45
    },
    'River gravel': {
        125: 0.20, 250: 0.30, 500: 0.40, 1000: 0.50, 2000: 0.55, 4000: 0.60
    },
}

freqs = np.array([125, 250, 500, 1000, 2000, 4000])

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Absorption coefficient vs frequency for all materials
colors_mat = {'Limestone': '#94a3b8', 'Dense forest': '#22c55e',
              'Water (calm)': '#3b82f6', 'Soil/grass': '#a3763d',
              'River gravel': '#78716c'}

for name, data in ABSORPTION_DATA.items():
    alphas = [data[f] for f in freqs]
    axes[0, 0].plot(freqs, alphas, 'o-', color=colors_mat[name], linewidth=2,
                     markersize=6, label=name)

axes[0, 0].set_xlabel('Frequency (Hz)', color='white')
axes[0, 0].set_ylabel('Absorption coefficient α', color='white')
axes[0, 0].set_title('Frequency-dependent absorption', color='white')
axes[0, 0].set_xscale('log')
axes[0, 0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[0, 0].set_ylim(0, 0.8)

# Panel 2: Energy remaining after N bounces (at 1000 Hz)
n_bounces = np.arange(0, 11)
for name, data in ABSORPTION_DATA.items():
    alpha_1k = data[1000]
    energy = (1 - alpha_1k) ** n_bounces
    axes[0, 1].plot(n_bounces, energy * 100, 'o-', color=colors_mat[name],
                     linewidth=2, markersize=5, label=name)

axes[0, 1].set_xlabel('Number of bounces', color='white')
axes[0, 1].set_ylabel('Energy remaining (%)', color='white')
axes[0, 1].set_title('Energy decay per bounce (1000 Hz)', color='white')
axes[0, 1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[0, 1].set_ylim(0, 105)

# Panel 3: Spectral content of echo after 3 bounces
# Start with flat spectrum (white noise shout)
source_spectrum = np.ones(len(freqs))

for name in ['Limestone', 'Dense forest']:
    data = ABSORPTION_DATA[name]
    for n in [1, 3, 5]:
        echo_spectrum = source_spectrum.copy()
        for f_idx, f in enumerate(freqs):
            echo_spectrum[f_idx] *= (1 - data[f]) ** n
        label = f'{name}, {n} bounces'
        style = '-' if name == 'Limestone' else '--'
        alpha_plot = 1.0 - 0.2 * n
        axes[1, 0].plot(freqs, echo_spectrum, style, color=colors_mat[name],
                         linewidth=2, alpha=max(alpha_plot, 0.3), label=label)

axes[1, 0].set_xlabel('Frequency (Hz)', color='white')
axes[1, 0].set_ylabel('Relative energy', color='white')
axes[1, 0].set_title('Echo spectrum after N bounces', color='white')
axes[1, 0].set_xscale('log')
axes[1, 0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

# Panel 4: Comparison — limestone valley vs forested valley echo timeline
# Simulate 8 bounces in each valley type, showing arrival energy at 1 kHz
bounce_dist = 150  # meters per bounce (average for a valley)
v_sound = 343.0

for name, color in [('Limestone', '#94a3b8'), ('Dense forest', '#22c55e')]:
    alpha = ABSORPTION_DATA[name][1000]
    times = []
    energies_db = []
    for n in range(1, 9):
        total_dist = n * bounce_dist * 2
        t = total_dist / v_sound
        e = (1 - alpha) ** n
        # Add inverse square law
        e *= 1.0 / (1 + (total_dist / 50) ** 2) * 5000
        db = 10 * np.log10(max(e, 1e-15))
        times.append(t)
        energies_db.append(db)

    axes[1, 1].bar([t + (0.02 if name == 'Dense forest' else -0.02) for t in times],
                    energies_db, width=0.03, color=color, alpha=0.8, label=name)

axes[1, 1].set_xlabel('Time after shout (s)', color='white')
axes[1, 1].set_ylabel('Echo energy (dB)', color='white')
axes[1, 1].set_title('Echo timeline: rock vs forest valley', color='white')
axes[1, 1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[1, 1].axhline(y=0, color='#ef4444', linestyle=':', linewidth=1, alpha=0.5, label='Hearing threshold')

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("Material absorption analysis (at 1000 Hz):")
for name, data in ABSORPTION_DATA.items():
    a = data[1000]
    after5 = (1 - a)**5 * 100
    print(f"  {name:<16} α={a:.3f}  after 5 bounces: {after5:.1f}% energy")
print()
print("Forest strips high frequencies faster than low frequencies.")
print("After 5 bounces in forest, a shout sounds like a low rumble —")
print("the high frequencies are gone. Limestone preserves the full spectrum.")`,
      challenge: 'Implement a Helmholtz resonator model: a cavity of volume V with a neck of area A and length L absorbs strongly at frequency f = (v/2π) × sqrt(A/(VL)). Add tree hollows as resonant absorbers at specific frequencies in the forested section.',
      successHint: 'Material modeling is complete. The simulator now knows how different surfaces affect sound at each frequency. Next we compute precise echo timing.',
    },
    {
      title: 'Time delay calculation — echo timing and Doppler',
      concept: `The echo timing system converts ray paths into the **echogram** — the core output of any acoustic simulation. For each ray path:

**Basic timing**: The delay for each reflection point is simply the cumulative path length divided by the speed of sound. But in a mountain environment, the speed of sound varies with altitude due to temperature gradients, so we must integrate:

**t = ∫ ds / v(s)**

where ds is a path element and v(s) is the local speed of sound. For a linear temperature gradient, this integral has an analytical solution, but in general we discretize the path into small steps and sum the time for each step.

**Doppler effect for a moving source**: If the source is moving at velocity v_s toward a reflecting wall, the frequency of the emitted sound is shifted:

**f_received = f_source × v_sound / (v_sound - v_s × cos(θ))**

where θ is the angle between the source velocity and the direction to the wall. A source moving toward the wall at 30 m/s (about 108 km/h — a speeding car in a valley) shifts a 1000 Hz tone to about 1096 Hz. The reflection doubles the effect: the echo returns at an even higher frequency because the source is now also moving toward the returning wavefront.

For an echo with Doppler:
**f_echo = f_source × (v_sound + v_s) / (v_sound - v_s)**

This double Doppler shift is used in speed cameras and weather radar.`,
      analogy: 'The Doppler effect is like a boat on a lake: waves in front of the moving boat are compressed (higher frequency), waves behind are stretched (lower frequency). If the boat is heading toward a cliff, its bow wave hits the cliff compressed, reflects, and returns to the approaching boat even more compressed — a double dose of compression. That is why a car honking in a valley hears its own echo at a higher pitch.',
      storyConnection: 'Vehicles traveling through the narrow gorges of the NH6 highway in Meghalaya experience a natural Doppler laboratory. A truck honking as it approaches a cliff face hears a higher-pitched echo; as it passes and moves away, the echo drops in pitch. Bus passengers riding through the Shillong-Cherrapunji road notice this effect at every cliff cut — the horn echo pitch-shifts as they pass. The effect is subtle at driving speeds (5-15% shift) but clearly audible.',
      checkQuestion: 'A car traveling at 25 m/s honks its horn (500 Hz) toward a cliff. What frequency does the driver hear in the echo? (v_sound = 343 m/s)',
      checkAnswer: 'Using the double Doppler formula: f_echo = 500 × (343 + 25) / (343 - 25) = 500 × 368/318 = 578.6 Hz. The echo is about 79 Hz higher than the original — roughly a musical interval of a minor third. This is a significant and clearly audible shift, equivalent to going from a B4 to a D5 on a piano.',
      codeIntro: 'Build the time-delay calculator with temperature-corrected timing and Doppler shift for moving sources.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# Module 3: Time Delay Calculator
# ============================================================

def speed_of_sound(T_celsius):
    return 331.3 + 0.606 * T_celsius

def temperature_at_altitude(alt, T_ground=20, lapse_rate=-6.5):
    """Temperature in °C at given altitude. Default: standard lapse rate."""
    return T_ground + lapse_rate * alt / 1000

def compute_echo_time(path_points, T_ground=20, lapse_rate=-6.5):
    """
    Compute echo arrival time accounting for temperature gradient.
    path_points: list of (x, y) tuples along the ray path.
    Returns: arrival time in seconds.
    """
    total_time = 0.0
    for i in range(len(path_points) - 1):
        x1, y1 = path_points[i]
        x2, y2 = path_points[i + 1]
        segment_len = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)

        # Discretize the segment for altitude-varying speed
        n_steps = max(int(segment_len / 5), 1)
        dt = 0.0
        for j in range(n_steps):
            frac = (j + 0.5) / n_steps
            alt = y1 + frac * (y2 - y1)
            T = temperature_at_altitude(alt, T_ground, lapse_rate)
            v = speed_of_sound(T)
            dt += (segment_len / n_steps) / v
        total_time += dt

    return total_time

def doppler_echo_freq(f_source, v_source, v_sound=343.0):
    """
    Frequency of echo heard by a moving source approaching a wall.
    Double Doppler: f_echo = f_source * (v + vs) / (v - vs)
    """
    return f_source * (v_sound + v_source) / (v_sound - v_source)

# Demo 1: Echo timing with and without temperature correction
distances = np.linspace(50, 500, 50)  # wall distance

# Flat temperature (no correction)
t_flat = 2 * distances / speed_of_sound(20)

# With altitude-dependent temperature (wall is a cliff at altitude = distance * 0.8)
t_corrected = []
for d in distances:
    alt = d * 0.8  # cliff rises at ~39 degree angle
    path = [(0, 0), (d, alt)]
    t_c = compute_echo_time(path, T_ground=25, lapse_rate=-6.5)
    t_corrected.append(2 * t_c)  # round trip

t_corrected = np.array(t_corrected)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Echo time comparison
axes[0, 0].plot(distances, t_flat * 1000, color='#3b82f6', linewidth=2,
                 label='Constant T (20°C)')
axes[0, 0].plot(distances, t_corrected * 1000, color='#ef4444', linewidth=2,
                 label='Temperature gradient')
axes[0, 0].fill_between(distances, t_flat * 1000, t_corrected * 1000,
                          alpha=0.2, color='#f59e0b')
axes[0, 0].set_xlabel('Wall distance (m)', color='white')
axes[0, 0].set_ylabel('Round-trip time (ms)', color='white')
axes[0, 0].set_title('Echo timing: flat vs gradient temperature', color='white')
axes[0, 0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 2: Timing error from ignoring temperature
error_ms = (t_corrected - t_flat) * 1000
error_m = error_ms / 1000 * speed_of_sound(20) / 2  # equivalent distance error
axes[0, 1].plot(distances, error_m, color='#f59e0b', linewidth=2)
axes[0, 1].set_xlabel('Wall distance (m)', color='white')
axes[0, 1].set_ylabel('Distance error (m)', color='white')
axes[0, 1].set_title('Error from ignoring temperature gradient', color='white')
axes[0, 1].axhline(y=1, color='#ef4444', linestyle=':', alpha=0.5)
axes[0, 1].text(100, 1.2, '1m error threshold', color='#ef4444', fontsize=9)

# Panel 3: Doppler shift for moving source
source_speeds = np.linspace(0, 50, 100)  # m/s
f_source = 500  # Hz

f_echo = f_source * (343 + source_speeds) / (343 - source_speeds)
shift = f_echo - f_source
shift_percent = shift / f_source * 100

axes[1, 0].plot(source_speeds * 3.6, f_echo, color='#ec4899', linewidth=2)
axes[1, 0].axhline(y=f_source, color='gray', linestyle=':', linewidth=1)
axes[1, 0].set_xlabel('Source speed (km/h)', color='white')
axes[1, 0].set_ylabel('Echo frequency (Hz)', color='white')
axes[1, 0].set_title(f'Doppler echo: {f_source} Hz source', color='white')

# Annotate key speeds
for v_kmh, label in [(30, 'Walking fast'), (60, 'Car in gorge'), (120, 'Highway')]:
    v_ms = v_kmh / 3.6
    f_e = doppler_echo_freq(f_source, v_ms)
    axes[1, 0].plot(v_kmh, f_e, 'o', color='#f59e0b', markersize=8)
    axes[1, 0].annotate(f'{label}\\n{f_e:.0f} Hz', xy=(v_kmh, f_e),
                          xytext=(v_kmh + 5, f_e + 15),
                          color='#f59e0b', fontsize=8,
                          arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Panel 4: Echogram — simulated echo arrivals at a listener position
# Simulate a valley with multiple reflectors at different distances and materials
reflectors = [
    {'name': 'Near rock (L)', 'dist': 80, 'alpha': 0.02, 'alt': 60},
    {'name': 'Forest (R)', 'dist': 120, 'alpha': 0.50, 'alt': 100},
    {'name': 'Far cliff (L)', 'dist': 250, 'alpha': 0.03, 'alt': 200},
    {'name': 'Distant ridge', 'dist': 400, 'alpha': 0.05, 'alt': 350},
]

echo_arrivals = []
for ref in reflectors:
    path = [(0, 0), (ref['dist'], ref['alt'])]
    t_one_way = compute_echo_time(path, T_ground=22, lapse_rate=-6.5)
    t_round = 2 * t_one_way
    # Energy: inverse square + absorption
    energy = (1 - ref['alpha']) / (4 * np.pi * (2 * ref['dist'])**2) * 1e6
    energy_db = 10 * np.log10(max(energy, 1e-15))
    echo_arrivals.append({
        'name': ref['name'], 'time': t_round, 'energy_db': energy_db
    })

# Also add second-order reflections (double bounces)
for i, r1 in enumerate(reflectors[:2]):
    for r2 in reflectors[2:]:
        combined_dist = r1['dist'] + r2['dist']
        t_combined = 2 * combined_dist / speed_of_sound(22)  # simplified
        energy = ((1-r1['alpha']) * (1-r2['alpha'])) / (4 * np.pi * (2*combined_dist)**2) * 1e6
        energy_db = 10 * np.log10(max(energy, 1e-15))
        echo_arrivals.append({
            'name': f"{r1['name']}→{r2['name']}", 'time': t_combined, 'energy_db': energy_db
        })

echo_arrivals.sort(key=lambda e: e['time'])

colors_echo = plt.cm.plasma(np.linspace(0.2, 0.9, len(echo_arrivals)))
for i, echo in enumerate(echo_arrivals):
    axes[1, 1].bar(echo['time'], max(echo['energy_db'], -50),
                    width=0.015, color=colors_echo[i], alpha=0.9)
    axes[1, 1].text(echo['time'], max(echo['energy_db'], -50) + 1,
                     echo['name'], color='white', fontsize=6,
                     ha='center', rotation=60)

axes[1, 1].set_xlabel('Time (s)', color='white')
axes[1, 1].set_ylabel('Energy (dB)', color='white')
axes[1, 1].set_title('Echogram — arrival timeline', color='white')
axes[1, 1].axhline(y=0, color='#ef4444', linestyle=':', linewidth=1, alpha=0.5)

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("Echo timing results:")
for echo in echo_arrivals:
    audible = "audible" if echo['energy_db'] > 0 else "below threshold"
    print(f"  {echo['time']*1000:>6.0f}ms  {echo['energy_db']:>6.1f} dB  {echo['name']:<30} [{audible}]")
print()
print(f"Doppler shift examples (500 Hz source):")
for v in [5, 15, 30]:
    f_e = doppler_echo_freq(500, v)
    print(f"  {v} m/s ({v*3.6:.0f} km/h): echo at {f_e:.1f} Hz (shift: +{f_e-500:.1f} Hz)")`,
      challenge: 'Implement a full Doppler echogram for a car driving through the valley at constant speed. At each time step, compute the echo from the nearest cliff, accounting for the changing distance and Doppler shift. Plot frequency vs time to show the characteristic Doppler "chirp" as the car passes the cliff.',
      successHint: 'The time-delay calculator accounts for temperature gradients and Doppler shifts. The echogram shows exactly when each echo arrives and how strong it is. Next we bring it all together visually.',
    },
    {
      title: 'Multi-echo visualization — the complete picture',
      concept: `The visualization module ties everything together. A professional acoustic simulation produces three types of output:

**1. Ray diagram**: The valley cross-section with all ray paths overlaid, colored by energy or bounce number. This shows *where* sound goes.

**2. Echogram (impulse response)**: A timeline plot showing the amplitude of each echo arrival. The direct sound arrives first (time 0), followed by early reflections (first bounces off nearby surfaces), then late reverberations (multiple bounces). The **RT60** — the time for the echo energy to drop by 60 dB — characterizes the space. Concert halls aim for RT60 ≈ 1.5-2.0 seconds. A mountain valley might have RT60 of 3-6 seconds.

**3. Energy decay curve**: The total sound energy in the space over time. It starts high, drops rapidly as early echoes dissipate, then decays exponentially during the reverberant tail. The slope of this curve gives the RT60.

For the valley simulator, we add a fourth output: the **echo spectrum** showing how the frequency content of each echo changes. Early echoes from limestone preserve the full spectrum. Late echoes that have bounced through forest lose their high frequencies, arriving as low-frequency rumbles.

This is exactly how real architectural acoustics software works — programs like ODEON, CATT-Acoustic, and Pachyderm compute and display these same four visualizations for designing concert halls, theaters, and noise barriers.`,
      analogy: 'The four visualizations are like four views of a football game. The ray diagram is the aerial camera showing player positions. The echogram is the play-by-play timeline. The energy curve is the momentum graph showing which team is dominating. The spectrum is the color commentary revealing the style of play. Each view tells part of the story; together they give the complete picture.',
      storyConnection: 'Acoustic researchers visiting the living root bridges of Meghalaya have measured impulse responses in the surrounding valleys by popping balloons and recording the result. The echogram reveals the valley signature: a sharp first reflection from the nearest rock face, a cluster of mid-range echoes as sound bounces between slopes, and a long reverberant tail as energy rattles around the forested lower slopes. Each valley has a unique acoustic fingerprint, as distinctive as a visual photograph.',
      checkQuestion: 'Why does the reverberant tail of a mountain valley echo sound lower in pitch than the initial echo? What physical process removes the high frequencies?',
      checkAnswer: 'Each time the sound bounces off a surface — especially forest canopy, soil, or gravel — high frequencies are absorbed more strongly than low frequencies (α increases with frequency for porous materials). After 5-10 bounces, the high-frequency content has been almost entirely absorbed while low frequencies persist. Additionally, atmospheric absorption (due to molecular relaxation in air) preferentially strips high frequencies over long path lengths. The late reverberant tail is dominated by low frequencies that have survived many bounces and long propagation distances.',
      codeIntro: 'Build the complete multi-echo visualization: ray diagram, echogram, energy decay curve, and frequency-dependent echo analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec

# ============================================================
# Full Valley Echo Simulator — Visualization Module
# ============================================================

# Materials with frequency-dependent absorption
class AcousticMaterial:
    def __init__(self, name, alpha_by_freq, color):
        self.name = name
        self.alpha_by_freq = alpha_by_freq  # {freq: alpha}
        self.color = color
    def alpha(self, freq=1000):
        freqs = sorted(self.alpha_by_freq.keys())
        alphas = [self.alpha_by_freq[f] for f in freqs]
        return np.interp(freq, freqs, alphas)

MATS = {
    'rock': AcousticMaterial('Limestone', {125:0.01,500:0.02,1000:0.02,4000:0.04}, '#94a3b8'),
    'forest': AcousticMaterial('Forest', {125:0.15,500:0.40,1000:0.55,4000:0.70}, '#22c55e'),
    'water': AcousticMaterial('Water', {125:0.008,500:0.01,1000:0.01,4000:0.02}, '#3b82f6'),
    'soil': AcousticMaterial('Soil', {125:0.10,500:0.30,1000:0.35,4000:0.45}, '#a3763d'),
}

class Segment:
    def __init__(self, x1, y1, x2, y2, mat):
        self.x1, self.y1, self.x2, self.y2 = x1, y1, x2, y2
        self.mat = mat
        dx, dy = x2-x1, y2-y1
        L = np.sqrt(dx**2+dy**2)
        self.nx, self.ny = -dy/L, dx/L

# Build valley
walls = []
def W(x1,y1,x2,y2,m): walls.append(Segment(x1,y1,x2,y2,MATS[m]))
W(-250,0,-230,100,'rock'); W(-230,100,-200,220,'rock')
W(-200,220,-170,350,'rock'); W(-170,350,-140,450,'rock')
W(250,0,230,80,'rock'); W(230,80,210,170,'forest')
W(210,170,190,280,'forest'); W(190,280,165,380,'rock')
W(165,380,140,450,'rock')
W(-250,0,-80,0,'soil'); W(-80,0,80,0,'water'); W(80,0,250,0,'soil')

def trace_ray(ox, oy, angle, walls, max_b=10, freq=1000):
    dx, dy = np.cos(np.radians(angle)), np.sin(np.radians(angle))
    energy = 1.0
    path = [(ox, oy, energy, 0.0, None)]
    cum_dist = 0.0
    for b in range(max_b):
        best_t, best_w, bx, by = 1e9, None, None, None
        for w in walls:
            sx, sy = w.x2-w.x1, w.y2-w.y1
            den = dx*sy - dy*sx
            if abs(den)<1e-12: continue
            t = ((w.x1-ox)*sy-(w.y1-oy)*sx)/den
            u = ((w.x1-ox)*dy-(w.y1-oy)*dx)/den
            if t>0.001 and 0<=u<=1 and t<best_t:
                best_t, best_w = t, w
                bx, by = ox+t*dx, oy+t*dy
        if best_w is None or best_t>3000: break
        cum_dist += best_t
        energy *= (1 - best_w.mat.alpha(freq))
        path.append((bx, by, energy, cum_dist/343.0, best_w.mat.name))
        if energy < 0.005: break
        nx, ny = best_w.nx, best_w.ny
        if nx*(ox-bx)+ny*(oy-by)<0: nx,ny=-nx,-ny
        dot = dx*nx+dy*ny
        dx, dy = dx-2*dot*nx, dy-2*dot*ny
        ox, oy = bx, by
    return path

# Trace rays at multiple frequencies
src = (0, 8)
n_rays = 80
angles = np.linspace(2, 178, n_rays)
freq_bands = [125, 500, 1000, 4000]

all_traces = {}
for freq in freq_bands:
    all_traces[freq] = [trace_ray(*src, a, walls, freq=freq) for a in angles]

# ============================================================
# Four-panel visualization
# ============================================================
fig = plt.figure(figsize=(15, 12))
fig.patch.set_facecolor('#1f2937')
gs = GridSpec(2, 2, figure=fig, hspace=0.3, wspace=0.3)

# --- Panel 1: Ray diagram (1000 Hz) ---
ax1 = fig.add_subplot(gs[0, 0])
ax1.set_facecolor('#111827'); ax1.tick_params(colors='gray')
for w in walls:
    ax1.plot([w.x1,w.x2],[w.y1,w.y2], color=w.mat.color, linewidth=3)
for i, path in enumerate(all_traces[1000]):
    c = plt.cm.plasma(i/n_rays)
    for j in range(len(path)-1):
        ax1.plot([path[j][0],path[j+1][0]], [path[j][1],path[j+1][1]],
                 color=c, linewidth=0.5, alpha=path[j][2])
ax1.plot(*src, '*', color='#f59e0b', markersize=15, zorder=5)
ax1.set_xlim(-270,270); ax1.set_ylim(-20,480); ax1.set_aspect('equal')
ax1.set_title('Ray diagram (1000 Hz)', color='white')
ax1.set_xlabel('Distance (m)', color='white')
ax1.set_ylabel('Altitude (m)', color='white')

# --- Panel 2: Echogram (impulse response at 1000 Hz) ---
ax2 = fig.add_subplot(gs[0, 1])
ax2.set_facecolor('#111827'); ax2.tick_params(colors='gray')

echo_data = []
for path in all_traces[1000]:
    for pt in path[1:]:  # skip source
        if pt[4] is not None:
            echo_data.append({'time': pt[3], 'energy': pt[2], 'surface': pt[4]})

echo_data.sort(key=lambda e: e['time'])
times = [e['time'] for e in echo_data]
energies_db = [10*np.log10(max(e['energy'],1e-15)) for e in echo_data]

# Color by surface type
surf_colors = {'Limestone':'#94a3b8', 'Forest':'#22c55e', 'Water':'#3b82f6', 'Soil':'#a3763d'}
colors = [surf_colors.get(e['surface'], 'white') for e in echo_data]

ax2.bar(times, [max(e, -60) for e in energies_db], width=0.008,
        color=colors, alpha=0.8)
ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Energy (dB)', color='white')
ax2.set_title('Echogram — impulse response', color='white')
ax2.set_xlim(0, max(times) * 1.1 if times else 5)
ax2.set_ylim(-60, 5)

# --- Panel 3: Energy decay curve ---
ax3 = fig.add_subplot(gs[1, 0])
ax3.set_facecolor('#111827'); ax3.tick_params(colors='gray')

for freq, color in zip(freq_bands, ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']):
    all_echoes = []
    for path in all_traces[freq]:
        for pt in path[1:]:
            if pt[4] is not None:
                all_echoes.append((pt[3], pt[2]))
    if not all_echoes: continue
    all_echoes.sort()
    t_arr = np.array([e[0] for e in all_echoes])
    e_arr = np.array([e[1] for e in all_echoes])

    # Cumulative energy decay (Schroeder integration)
    t_bins = np.linspace(0, max(t_arr)*1.1, 200)
    decay = np.zeros(len(t_bins))
    total = np.sum(e_arr**2)
    for i, tb in enumerate(t_bins):
        remaining = np.sum(e_arr[t_arr >= tb]**2)
        decay[i] = remaining / max(total, 1e-15)

    decay_db = 10 * np.log10(np.maximum(decay, 1e-15))
    ax3.plot(t_bins, decay_db, color=color, linewidth=2, label=f'{freq} Hz')

ax3.axhline(y=-60, color='white', linestyle=':', linewidth=1, alpha=0.5)
ax3.text(0.1, -58, 'RT60 threshold', color='white', fontsize=8)
ax3.set_xlabel('Time (s)', color='white')
ax3.set_ylabel('Energy (dB)', color='white')
ax3.set_title('Energy decay (Schroeder curve)', color='white')
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.set_ylim(-70, 5)

# --- Panel 4: Echo spectrum evolution ---
ax4 = fig.add_subplot(gs[1, 1])
ax4.set_facecolor('#111827'); ax4.tick_params(colors='gray')

time_windows = [(0, 0.5), (0.5, 1.5), (1.5, 3.0), (3.0, 6.0)]
window_colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

for (t_lo, t_hi), wcolor in zip(time_windows, window_colors):
    spectrum = []
    for freq in freq_bands:
        total_energy = 0
        for path in all_traces[freq]:
            for pt in path[1:]:
                if pt[4] is not None and t_lo <= pt[3] < t_hi:
                    total_energy += pt[2]
        spectrum.append(total_energy)

    if max(spectrum) > 0:
        spectrum = np.array(spectrum) / max(spectrum)
        ax4.plot(freq_bands, spectrum, 'o-', color=wcolor, linewidth=2,
                 markersize=8, label=f'{t_lo}-{t_hi}s')

ax4.set_xlabel('Frequency (Hz)', color='white')
ax4.set_ylabel('Relative energy', color='white')
ax4.set_title('Echo spectrum over time', color='white')
ax4.set_xscale('log')
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

plt.tight_layout()
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("Valley Echo Simulator — Visualization Module")
print(f"  Rays: {n_rays} per frequency band")
print(f"  Frequency bands: {freq_bands} Hz")
print(f"  Total echo events: {len(echo_data)}")
if times:
    print(f"  Earliest echo: {min(times)*1000:.0f} ms")
    print(f"  Latest echo:   {max(times)*1000:.0f} ms")
print()
print("The four panels show:")
print("  1. Ray diagram — where sound goes in the valley")
print("  2. Echogram — when each echo arrives and its strength")
print("  3. Energy decay — how quickly sound dies out (per frequency)")
print("  4. Spectrum — how echo color changes over time (high freqs decay faster)")`,
      challenge: 'Add an RT60 calculation. Find the time at which the energy decay curve crosses -60 dB for each frequency band. Compare the RT60 of the wide Khasi valley with the narrow limestone gorge. Which has longer reverberation and why?',
      successHint: 'The visualization module produces professional-quality acoustic analysis output. The final lesson wraps everything into a portfolio-ready simulator.',
    },
    {
      title: 'Portfolio — the complete valley echo simulator',
      concept: `In this final lesson, you combine all four modules into a single, configurable simulator. The portfolio piece should demonstrate:

**1. Configurable geometry**: Switch between valley presets (wide Khasi valley, narrow gorge, cave entrance) or define custom geometry. Each preset tells a different acoustic story.

**2. Complete physics**: Ray tracing with frequency-dependent absorption, temperature-corrected timing, and optional Doppler shift. The physics is correct enough to match real-world measurements to within 10-20%.

**3. Rich visualization**: All four analysis views (ray diagram, echogram, energy decay, spectrum) generated from a single simulation run. The outputs should be publication-quality.

**4. Quantitative analysis**: RT60 calculation, echo count, average absorption, dominant reflection paths. Numbers that an acoustics engineer would recognize and use.

**5. Comparison mode**: Run two valley configurations side by side to highlight how geometry and materials affect acoustics. This is the most powerful feature — it turns the simulator into an exploration tool.

This capstone project demonstrates skills in: object-oriented design, numerical computation, physics simulation, data visualization, and scientific analysis. It is a genuine engineering tool, not a toy example. The same principles scale directly to 3D room acoustics, outdoor noise modeling, and underwater sonar simulation.`,
      analogy: 'The final simulator is like a flight simulator for acoustics. A pilot uses a flight simulator to understand how different conditions (wind, altitude, weight) affect an aircraft. Your echo simulator lets you understand how different valley shapes, materials, and temperatures affect sound. Both turn complex physics into an interactive exploration tool that builds intuition faster than any textbook.',
      storyConnection: 'This simulator models the acoustic world of the Khasi Hills — the same physics that creates the dramatic echoes described in "Why Mountains Have Echoes." The narrow limestone gorges near Cherrapunji, the deep forested valleys of the East Khasi Hills, the cave systems of the Jaintia Hills — each is a natural acoustic laboratory with its own signature. Your simulator captures the essential physics of these environments and lets you explore how changing the valley shape, adding forest, or adjusting temperature transforms the echo pattern.',
      checkQuestion: 'If you were hired to design an outdoor amphitheater in a Meghalaya valley, which of the four analysis outputs would be most important for ensuring good audience experience, and why?',
      checkAnswer: 'The echogram and RT60 would be most critical. The echogram reveals whether early reflections from valley walls arrive within 50ms of the direct sound (beneficial — they reinforce clarity) or later (detrimental — they cause "slap-back" echoes that blur speech and music). The RT60 tells you if the natural reverberation is appropriate for the intended use: 0.8-1.2s for speech, 1.5-2.0s for orchestral music. Too long (> 3s) and everything becomes muddy. You would also check the energy decay for frequency balance — if low frequencies reverberate much longer than highs, the space will sound boomy.',
      codeIntro: 'The complete valley echo simulator: two valley configurations side by side, full analysis, comparison summary.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec

# ============================================================
# VALLEY ECHO SIMULATOR — Complete Capstone
# ============================================================

class AcMat:
    def __init__(self, name, alpha_data, color):
        self.name, self.color = name, color
        self._freqs = sorted(alpha_data.keys())
        self._alphas = [alpha_data[f] for f in self._freqs]
    def alpha(self, f=1000):
        return float(np.interp(f, self._freqs, self._alphas))

M = {
    'rock': AcMat('Limestone', {125:0.01,500:0.02,1000:0.02,4000:0.04}, '#94a3b8'),
    'forest': AcMat('Forest', {125:0.15,500:0.40,1000:0.55,4000:0.70}, '#22c55e'),
    'water': AcMat('Water', {125:0.008,500:0.01,1000:0.01,4000:0.02}, '#3b82f6'),
    'soil': AcMat('Soil', {125:0.10,500:0.30,1000:0.35,4000:0.45}, '#a3763d'),
}

class Seg:
    def __init__(s, x1, y1, x2, y2, mat):
        s.x1,s.y1,s.x2,s.y2,s.mat = x1,y1,x2,y2,mat
        dx,dy = x2-x1, y2-y1; L=np.sqrt(dx*dx+dy*dy)
        s.nx, s.ny = -dy/L, dx/L

class ValleySim:
    """Complete valley echo simulator."""

    def __init__(self, name, walls, T_ground=20):
        self.name = name
        self.walls = walls
        self.T_ground = T_ground
        self.v_sound = 331.3 + 0.606 * T_ground

    def trace(self, ox, oy, angle, freq=1000, max_b=10):
        dx, dy = np.cos(np.radians(angle)), np.sin(np.radians(angle))
        e = 1.0; cd = 0.0
        path = [(ox, oy, e, 0.0, None)]
        for _ in range(max_b):
            bt, bw, bx, by = 1e9, None, None, None
            for w in self.walls:
                sx,sy = w.x2-w.x1, w.y2-w.y1
                den = dx*sy - dy*sx
                if abs(den)<1e-12: continue
                t = ((w.x1-ox)*sy-(w.y1-oy)*sx)/den
                u = ((w.x1-ox)*dy-(w.y1-oy)*dx)/den
                if t>0.001 and 0<=u<=1 and t<bt:
                    bt,bw = t,w; bx,by = ox+t*dx, oy+t*dy
            if bw is None or bt>3000: break
            cd += bt
            e *= (1 - bw.mat.alpha(freq))
            path.append((bx, by, e, cd/self.v_sound, bw.mat.name))
            if e < 0.005: break
            nx,ny = bw.nx, bw.ny
            if nx*(ox-bx)+ny*(oy-by)<0: nx,ny=-nx,-ny
            dot = dx*nx+dy*ny
            dx, dy = dx-2*dot*nx, dy-2*dot*ny
            ox, oy = bx, by
        return path

    def simulate(self, sx, sy, n_rays=80, freqs=[125,500,1000,4000]):
        """Run full simulation. Returns dict of results."""
        angles = np.linspace(2, 178, n_rays)
        results = {'source': (sx, sy), 'n_rays': n_rays}
        traces = {}
        all_echoes = []
        for freq in freqs:
            traces[freq] = []
            for a in angles:
                path = self.trace(sx, sy, a, freq=freq)
                traces[freq].append(path)
                for pt in path[1:]:
                    if pt[4] is not None:
                        all_echoes.append({
                            'time': pt[3], 'energy': pt[2],
                            'surface': pt[4], 'freq': freq
                        })
        results['traces'] = traces
        results['echoes'] = sorted(all_echoes, key=lambda e: e['time'])
        results['freqs'] = freqs

        # Compute RT60 per frequency
        rt60 = {}
        for freq in freqs:
            freq_echoes = [e for e in all_echoes if e['freq'] == freq]
            if not freq_echoes: rt60[freq] = 0; continue
            t_arr = np.array([e['time'] for e in freq_echoes])
            e_arr = np.array([e['energy'] for e in freq_echoes])
            total = np.sum(e_arr**2)
            t_bins = np.linspace(0, max(t_arr)*1.1, 300)
            for tb in t_bins:
                remaining = np.sum(e_arr[t_arr >= tb]**2)
                if remaining / max(total,1e-15) < 1e-6:  # -60 dB
                    rt60[freq] = tb; break
            else:
                rt60[freq] = t_bins[-1]
        results['rt60'] = rt60
        return results

# Valley presets
def wide_valley():
    w = []
    def A(x1,y1,x2,y2,m): w.append(Seg(x1,y1,x2,y2,M[m]))
    A(-250,0,-230,100,'rock'); A(-230,100,-200,220,'rock')
    A(-200,220,-170,350,'rock'); A(-170,350,-140,450,'rock')
    A(250,0,230,80,'rock'); A(230,80,210,170,'forest')
    A(210,170,190,280,'forest'); A(190,280,165,380,'rock')
    A(165,380,140,450,'rock')
    A(-250,0,-80,0,'soil'); A(-80,0,80,0,'water'); A(80,0,250,0,'soil')
    return w

def narrow_gorge():
    w = []
    def A(x1,y1,x2,y2,m): w.append(Seg(x1,y1,x2,y2,M[m]))
    A(-60,0,-55,150,'rock'); A(-55,150,-50,300,'rock')
    A(-50,300,-45,400,'rock')
    A(60,0,55,150,'rock'); A(55,150,50,300,'rock')
    A(50,300,45,400,'rock')
    A(-60,0,60,0,'water')
    return w

# Run simulations
sim_wide = ValleySim("Khasi Hills Valley (wide, asymmetric)", wide_valley(), T_ground=22)
sim_narrow = ValleySim("Limestone Gorge (narrow, symmetric)", narrow_gorge(), T_ground=18)

res_wide = sim_wide.simulate(0, 8, n_rays=80)
res_narrow = sim_narrow.simulate(0, 8, n_rays=80)

# ============================================================
# Comparison Visualization
# ============================================================
fig = plt.figure(figsize=(16, 14))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Valley Echo Simulator — Comparison Analysis', color='white',
             fontsize=14, fontweight='bold', y=0.98)
gs = GridSpec(3, 2, figure=fig, hspace=0.35, wspace=0.3)

configs = [
    (sim_wide, res_wide, 'Wide Valley'),
    (sim_narrow, res_narrow, 'Narrow Gorge'),
]

for col, (sim, res, label) in enumerate(configs):
    # Row 1: Ray diagrams
    ax = fig.add_subplot(gs[0, col])
    ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
    for w in sim.walls:
        ax.plot([w.x1,w.x2],[w.y1,w.y2], color=w.mat.color, linewidth=3)
    for i, path in enumerate(res['traces'][1000]):
        c = plt.cm.plasma(i/res['n_rays'])
        for j in range(len(path)-1):
            ax.plot([path[j][0],path[j+1][0]], [path[j][1],path[j+1][1]],
                    color=c, linewidth=0.4, alpha=path[j][2])
    ax.plot(*res['source'], '*', color='#f59e0b', markersize=12, zorder=5)
    ax.set_aspect('equal')
    ax.set_title(f'{label} — Ray diagram', color='white', fontsize=10)
    ax.set_xlabel('Distance (m)', color='white', fontsize=8)
    ax.set_ylabel('Altitude (m)', color='white', fontsize=8)

    # Row 2: Echograms
    ax = fig.add_subplot(gs[1, col])
    ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
    surf_c = {'Limestone':'#94a3b8','Forest':'#22c55e','Water':'#3b82f6','Soil':'#a3763d'}
    e1k = [e for e in res['echoes'] if e['freq'] == 1000]
    if e1k:
        times = [e['time'] for e in e1k]
        dbs = [10*np.log10(max(e['energy'],1e-15)) for e in e1k]
        cols = [surf_c.get(e['surface'], 'white') for e in e1k]
        ax.bar(times, [max(d,-60) for d in dbs], width=0.008, color=cols, alpha=0.8)
    ax.set_xlabel('Time (s)', color='white', fontsize=8)
    ax.set_ylabel('Energy (dB)', color='white', fontsize=8)
    ax.set_title(f'{label} — Echogram (1 kHz)', color='white', fontsize=10)
    ax.set_ylim(-60, 5)

    # Row 3: Energy decay
    ax = fig.add_subplot(gs[2, col])
    ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
    freq_colors = {125:'#3b82f6', 500:'#22c55e', 1000:'#f59e0b', 4000:'#ef4444'}
    for freq in res['freqs']:
        fe = [e for e in res['echoes'] if e['freq'] == freq]
        if not fe: continue
        t_arr = np.array([e['time'] for e in fe])
        e_arr = np.array([e['energy'] for e in fe])
        total = np.sum(e_arr**2)
        t_bins = np.linspace(0, max(t_arr)*1.1, 200)
        decay = np.array([np.sum(e_arr[t_arr>=tb]**2)/max(total,1e-15) for tb in t_bins])
        decay_db = 10*np.log10(np.maximum(decay, 1e-15))
        ax.plot(t_bins, decay_db, color=freq_colors[freq], linewidth=2,
                label=f'{freq} Hz (RT60≈{res["rt60"][freq]:.1f}s)')
    ax.axhline(y=-60, color='white', linestyle=':', linewidth=0.8, alpha=0.4)
    ax.set_xlabel('Time (s)', color='white', fontsize=8)
    ax.set_ylabel('Energy (dB)', color='white', fontsize=8)
    ax.set_title(f'{label} — Energy decay', color='white', fontsize=10)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
    ax.set_ylim(-70, 5)

plt.tight_layout(rect=[0, 0, 1, 0.96])
img = _get_plot_as_base64()
print(f'<img src="data:image/png;base64,{img}" />')
print()
print("=" * 65)
print("  VALLEY ECHO SIMULATOR — COMPARISON REPORT")
print("=" * 65)
print()
for sim, res, label in configs:
    print(f"  {label}")
    print(f"  {'─' * 40}")
    n_echoes = len([e for e in res['echoes'] if e['freq']==1000])
    if res['echoes']:
        t_first = min(e['time'] for e in res['echoes'] if e['freq']==1000)
        t_last = max(e['time'] for e in res['echoes'] if e['freq']==1000)
    else:
        t_first = t_last = 0
    print(f"  Echo events (1 kHz):   {n_echoes}")
    print(f"  First echo:            {t_first*1000:.0f} ms")
    print(f"  Last echo:             {t_last*1000:.0f} ms")
    print(f"  RT60 by frequency:")
    for freq in res['freqs']:
        print(f"    {freq:>5d} Hz:  {res['rt60'][freq]:.2f} s")
    print()

print("Key findings:")
print("  - The narrow gorge has MUCH longer reverb (sound bounces between")
print("    parallel rock walls with minimal loss: 98% reflected each bounce)")
print("  - The wide valley has shorter RT60 because energy spreads out and")
print("    forest sections absorb ~50% per bounce")
print("  - High frequencies (4 kHz) decay fastest in both — forest and air")
print("    absorption strip them away")
print("  - The narrow gorge produces classic 'flutter echo' (rapid repeats)")
print("    while the wide valley produces a single clean echo then diffuse tail")
print()
print("This simulator captures the essential acoustics of Meghalaya's mountain")
print("valleys — the same physics that inspired 'Why Mountains Have Echoes.'")`,
      challenge: 'Add a third valley configuration: the wide valley with a temperature inversion (cold floor, warm air above). Modify the ray tracer to curve rays based on the local speed of sound gradient. Compare the echogram with and without the inversion to show how dawn-time inversions amplify echoes in Meghalaya valleys.',
      successHint: 'You have built a complete valley echo simulator from first principles — geometry, ray tracing, material modeling, time-delay computation, and multi-panel visualization. This is portfolio-level work that demonstrates real engineering skills in computational acoustics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Valley Echo Simulator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (acoustics engineering)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a complete echo simulator using Python with numpy and matplotlib. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
