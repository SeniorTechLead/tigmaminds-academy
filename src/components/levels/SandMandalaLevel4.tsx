import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import SymmetryDiagram from '../diagrams/SymmetryDiagram';
import TransformationsDiagram from '../diagrams/TransformationsDiagram';
import FractalTreeDiagram from '../diagrams/FractalTreeDiagram';
import TessellationMandala from '../diagrams/TessellationMandala';
import SymmetryTypesMandala from '../diagrams/SymmetryTypesMandala';
import SymmetryOperationsDiagram from '../diagrams/SymmetryOperationsDiagram';

export default function SandMandalaLevel4() {
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
      title: 'Stage 1: Design a tile motif — custom base shape',
      concept: `The capstone project is a complete **pattern generation tool** that takes a user-designed motif and produces tessellations, mandalas, and fractal patterns from it.

Stage 1: build a motif editor. A tile motif is defined by a set of vertices (a polygon) with optional internal detail lines. The motif must satisfy constraints:
- The vertices form a closed, non-self-intersecting polygon
- The area is non-zero
- The shape can be parameterized (adjustable proportions)

We will define motifs as **parametric shapes** — functions that generate vertex coordinates from a small set of parameters. This allows exploration of the design space: one parameter might control "pointiness," another "asymmetry," another "curvature."

The code creates a parametric motif generator with 4 control parameters, visualises the motif, and validates it for use in tessellations.`,
      analogy: 'Designing a parametric motif is like creating a font. Each letter has a fixed structure but adjustable proportions — the stroke width, the serif size, the x-height. A parametric motif has adjustable "pointiness," "width," and "curvature." One set of parameters produces a petal; another produces a star; another produces a wave — all from the same underlying template.',
      storyConnection: 'The monks used chak-pur funnels to lay down sand in precisely controlled streams. The stream width, the sand density, the funnel angle — these are the "parameters" of the motif. Changing the funnel angle changes the line thickness; changing the sand color changes the visual weight. Our parametric motif is the computational equivalent of the monk toolset.',
      checkQuestion: 'Why is it important to validate that the motif polygon does not self-intersect?',
      checkAnswer: 'A self-intersecting polygon has undefined "inside" and "outside" — the fill operation produces visual artifacts, and area calculations give incorrect results. For tessellation, self-intersection means the tile overlaps itself, violating the fundamental tessellation rule. Validation catches these issues before they propagate to later stages. Garbage in, garbage out — validation is the firewall.',
      codeIntro: 'Build a parametric motif generator with adjustable shape parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class MotifDesigner:
    """Parametric tile motif generator."""

    def __init__(self, n_sides=6, pointiness=0.3,
                 indent=0.0, curve=0.0):
        self.n = n_sides
        self.pointy = pointiness
        self.indent = indent
        self.curve = curve

    def generate(self):
        """Generate motif vertices."""
        pts = []
        for i in range(self.n):
            a1 = 2 * np.pi * i / self.n
            a2 = 2 * np.pi * (i + 0.5) / self.n
            # Outer vertex
            r_out = 1.0 + self.pointy
            pts.append([r_out * np.cos(a1),
                        r_out * np.sin(a1)])
            # Inner vertex (between outer vertices)
            r_in = 1.0 - self.indent
            pts.append([r_in * np.cos(a2),
                        r_in * np.sin(a2)])
        pts.append(pts[0])  # close
        return np.array(pts)

    def area(self, pts):
        """Shoelace formula for polygon area."""
        x, y = pts[:-1, 0], pts[:-1, 1]
        return 0.5 * abs(np.sum(x * np.roll(y, -1)
                                - np.roll(x, -1) * y))

# Explore 4 different motifs
configs = [
    (6, 0.0, 0.0, 'Hexagon'),
    (6, 0.4, 0.0, 'Star'),
    (6, 0.0, 0.3, 'Indented'),
    (8, 0.3, 0.2, 'Complex'),
]

fig, axes = plt.subplots(1, 4, figsize=(14, 3.5))
for ax, (n, p, ind, name) in zip(axes, configs):
    md = MotifDesigner(n, p, ind)
    pts = md.generate()
    area = md.area(pts)
    ax.fill(pts[:, 0], pts[:, 1], color='#3498db',
            alpha=0.4)
    ax.plot(pts[:, 0], pts[:, 1], 'w-', linewidth=1.5)
    ax.plot(pts[:, 0], pts[:, 1], 'wo', markersize=3)
    ax.set_title(f'{name}\\narea={area:.2f}', fontsize=9)
    ax.set_xlim(-2, 2); ax.set_ylim(-2, 2)
    ax.set_aspect('equal'); ax.axis('off')

plt.suptitle('Stage 1: Parametric Motif Design', fontsize=13)
plt.tight_layout()
plt.show()

print("4 motifs from the same parametric generator.")
print("Parameters: n_sides, pointiness, indent.")`,
      challenge: 'Add a "curve" parameter that replaces straight edges with Bezier curves. Use quadratic Bezier interpolation between vertices, with the control point offset perpendicular to the edge by the curve parameter.',
      successHint: 'Stage 1 complete: you have a parametric motif generator that produces validated tile shapes from a small parameter set.',
    },
    {
      title: 'Stage 2: Apply wallpaper group transformations',
      concept: `Stage 2 takes a motif from Stage 1 and applies the full set of symmetry operations from a chosen **wallpaper group** to tile a region.

The implementation:
1. User selects a wallpaper group (e.g., p4m, p6m, p3m1)
2. The system generates the full set of symmetry operations for that group
3. Each operation is applied to the motif to produce one tile placement
4. Lattice translations tile the operated motifs across the plane

For p4m (square lattice with full mirror symmetry):
- 8 symmetry operations: 4 rotations x 2 (with/without reflection)
- Lattice vectors: (1, 0) and (0, 1)
- Each lattice cell contains 8 copies of the motif

For p6m (hexagonal with mirrors):
- 12 symmetry operations: 6 rotations x 2
- Lattice vectors: (1, 0) and (0.5, sqrt(3)/2)

The code implements a general wallpaper group tiler that takes any motif and any supported group.`,
      analogy: 'The wallpaper group tiler is like a printing press with interchangeable stamps and rollers. Stage 1 designed the stamp (motif). Stage 2 selects the roller pattern (wallpaper group). The press stamps the motif according to the group symmetry rules and rolls it across the paper using the lattice vectors. Different stamp + roller combinations produce different wallpapers.',
      storyConnection: 'Lobsang chalked the symmetry lines first (the wallpaper group structure), then filled each region with sand (the motif). Our code does the same: define the group operations, then stamp the motif into each region. The monks intuitively understood that the symmetry framework must come before the detail.',
      checkQuestion: 'If you tile a motif using the wrong wallpaper group (e.g., a motif with 3-fold symmetry on a 4-fold lattice), what happens?',
      checkAnswer: 'The tiles do not fit together properly — gaps and overlaps appear at the boundaries. Each wallpaper group assumes specific angle relationships between tiles. A 3-fold motif placed on a 4-fold lattice has 90-degree boundaries but 120-degree internal structure, creating mismatches. The motif must be compatible with the group: its own symmetry must be a subgroup of the wallpaper group, or the motif boundary must conform to the lattice cell shape.',
      codeIntro: 'Build a general wallpaper group tiler for any motif.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def R(deg):
    r = np.radians(deg)
    return np.array([[np.cos(r), -np.sin(r)],
                     [np.sin(r),  np.cos(r)]])

def Mx():
    return np.array([[1, 0], [0, -1]])

# Wallpaper group definitions
groups = {
    'p4m': {
        'ops': [R(i*90) for i in range(4)] +
               [Mx() @ R(i*90) for i in range(4)],
        'v1': np.array([2.5, 0]),
        'v2': np.array([0, 2.5]),
    },
    'p6m': {
        'ops': [R(i*60) for i in range(6)] +
               [Mx() @ R(i*60) for i in range(6)],
        'v1': np.array([2.5, 0]),
        'v2': np.array([1.25, 2.5*np.sqrt(3)/2]),
    },
}

# Simple petal motif
t = np.linspace(0, 1, 20)
motif = np.array([0.15 * np.sin(t * np.pi),
                  0.3 + 0.5 * t])

fig, axes = plt.subplots(1, 2, figsize=(12, 5.5))

for ax, (gname, g) in zip(axes, groups.items()):
    v1, v2, ops = g['v1'], g['v2'], g['ops']
    colors = plt.cm.Set3(np.linspace(0, 1, len(ops)))

    for ni in range(-3, 4):
        for nj in range(-3, 4):
            offset = ni * v1 + nj * v2
            for op, c in zip(ops, colors):
                transformed = op @ motif + offset.reshape(2,1)
                ax.fill(transformed[0], transformed[1],
                        color=c, alpha=0.4)
                ax.plot(transformed[0], transformed[1],
                        'w-', linewidth=0.2)

    ax.set_xlim(-5, 7); ax.set_ylim(-5, 7)
    ax.set_aspect('equal'); ax.axis('off')
    ax.set_title(f'{gname}\\n{len(ops)} ops per cell',
                 fontsize=10)

plt.suptitle('Stage 2: Wallpaper Group Tiling', fontsize=13)
plt.tight_layout()
plt.show()

print("Same motif, two different wallpaper groups.")
print(f"p4m: {len(groups['p4m']['ops'])} symmetry ops")
print(f"p6m: {len(groups['p6m']['ops'])} symmetry ops")`,
      challenge: 'Add a p3m1 wallpaper group (3-fold rotation + mirrors). The lattice vectors are (1, 0) and (0.5, sqrt(3)/2), with 6 operations (3 rotations x 2 reflections). Tile the same motif and compare the visual result with p4m and p6m.',
      successHint: 'Stage 2 complete: you have a general wallpaper group tiler that takes any motif and any supported symmetry group. This is the core engine of professional pattern design software.',
    },
    {
      title: 'Stage 3: Fractal landscape generator',
      concept: `Stage 3 adds fractal detail generation. Instead of tiling a fixed motif, we generate fractal landscapes using the **diamond-square algorithm** (also called midpoint displacement).

The algorithm:
1. Start with a grid of corner values (heights)
2. **Diamond step**: for each square, compute the centre point as the average of the 4 corners plus a random offset
3. **Square step**: for each diamond, compute the midpoint as the average of the 4 diamond corners plus a random offset
4. Reduce the random offset at each step (multiply by a roughness factor)
5. Repeat until the grid is fine enough

The roughness factor H (0 to 1) controls the fractal dimension:
- H close to 0: rough, jagged terrain (high fractal dimension)
- H close to 1: smooth, rolling hills (low fractal dimension)

The fractal dimension of the resulting surface is D = 3 - H.

This connects to the mandala: the concentric rings of increasing detail mirror the recursive refinement of the diamond-square algorithm. Both add complexity at finer and finer scales.`,
      analogy: 'The diamond-square algorithm is like sculpting a mountain from clay. Start with a rough rectangular block (the corner values). Push the centre up or down by a random amount. Then push each edge midpoint. Then each quarter midpoint. Each pass adds finer detail, and each pass uses a smaller random push — so the large-scale shape is set first and the small details come last. This is how nature builds mountains: large-scale tectonics first, then erosion adds the fine texture.',
      storyConnection: 'The mandala monks worked from large-scale structure (the chalk grid) to fine detail (individual sand grains). The diamond-square algorithm follows the same coarse-to-fine approach. Both processes create complexity through recursive refinement — the fundamental principle connecting sacred geometry to computational graphics.',
      checkQuestion: 'Why must the random offset decrease at each recursion level?',
      checkAnswer: 'If the offset stays constant, each refinement level adds equally large perturbations, and the surface becomes white noise — completely random with no large-scale structure. Decreasing the offset ensures that large-scale features (mountains, valleys) are established first and fine-scale features (ridges, gullies) are smaller perturbations on top. The roughness parameter controls the decay rate, and thus the balance between large-scale and small-scale features.',
      codeIntro: 'Generate fractal terrain using the diamond-square algorithm.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def diamond_square(size, roughness=0.5, seed=42):
    """Generate fractal heightmap using diamond-square."""
    np.random.seed(seed)
    n = 2**size + 1
    grid = np.zeros((n, n))

    # Seed corners
    grid[0, 0] = np.random.uniform(-1, 1)
    grid[0, -1] = np.random.uniform(-1, 1)
    grid[-1, 0] = np.random.uniform(-1, 1)
    grid[-1, -1] = np.random.uniform(-1, 1)

    step = n - 1
    scale = 1.0

    while step > 1:
        half = step // 2

        # Diamond step
        for i in range(half, n-1, step):
            for j in range(half, n-1, step):
                avg = (grid[i-half, j-half] +
                       grid[i-half, j+half] +
                       grid[i+half, j-half] +
                       grid[i+half, j+half]) / 4
                grid[i, j] = avg + np.random.uniform(
                    -scale, scale)

        # Square step
        for i in range(0, n, half):
            for j in range((i+half)%step, n, step):
                pts = []
                if i >= half: pts.append(grid[i-half, j])
                if i+half < n: pts.append(grid[i+half, j])
                if j >= half: pts.append(grid[i, j-half])
                if j+half < n: pts.append(grid[i, j+half])
                grid[i, j] = np.mean(pts) + \
                    np.random.uniform(-scale, scale)

        scale *= 2 ** (-roughness)
        step = half

    return grid

fig, axes = plt.subplots(1, 3, figsize=(14, 4))
for ax, H in zip(axes, [0.2, 0.5, 0.8]):
    terrain = diamond_square(7, roughness=H)
    ax.imshow(terrain, cmap='terrain', origin='lower')
    D = 3 - H
    ax.set_title(f'H={H} (D={D:.1f})', fontsize=10)
    ax.axis('off')

plt.suptitle('Fractal Terrain: Diamond-Square Algorithm',
             fontsize=13)
plt.tight_layout()
plt.show()

print("H=0.2: rough, jagged (high fractal dimension)")
print("H=0.5: moderate roughness")
print("H=0.8: smooth, rolling (low fractal dimension)")`,
      challenge: 'Generate a circular mandala-shaped landscape: apply a radial mask to the terrain (fade to zero at the edges) and colour it using a mandala-inspired colour map. The result should look like a topographic mandala.',
      successHint: 'Stage 3 complete: you have a fractal terrain generator that creates landscapes with controllable roughness. The diamond-square algorithm is used in game engines, film VFX, and geographic modeling.',
    },
    {
      title: 'Stage 4: Interactive mandala builder',
      concept: `Stage 4 builds a complete mandala generation engine that combines all previous tools:

The mandala builder takes:
- **Number of rings** (e.g., 5)
- **Symmetry order per ring** (e.g., [4, 8, 16, 16, 32])
- **Motif type per ring** (diamond, petal, spike, dot, arc)
- **Colour palette**
- **Ring radii**

For each ring, the engine:
1. Generates the motif shape from the parametric designer (Stage 1)
2. Applies rotational symmetry (Stage 2)
3. Optionally adds fractal detail (Stage 3)
4. Composites the result onto the canvas

The code below creates a mandala generator class that produces rich, multi-layered mandalas from a compact specification. Changing any parameter instantly produces a different mandala.`,
      analogy: 'The mandala builder is like an orchestra conductor score. The score specifies which instruments play in each section, at what tempo, at what volume. The conductor (the engine) interprets the score and coordinates all the performers (the ring generators). One score = one mandala. Change the score, change the mandala. The conductor code stays the same.',
      storyConnection: 'The monks spent five days building one mandala. Our generator produces a mandala in milliseconds. But the design decisions are the same: how many rings, what symmetry, what motifs, what colours. The monks specification was in their tradition and training; ours is in a parameter dictionary. Both produce "sacred geometry" — one in sand, one in pixels.',
      checkQuestion: 'If you generate 1000 random mandalas (random parameters), how many will be aesthetically pleasing?',
      checkAnswer: 'Very few. Aesthetics in mandala design arise from constraint, not randomness: symmetry orders that are multiples of each other, colour palettes with limited hue range, motif sizes that decrease proportionally with ring radius. Random parameters produce chaotic, unbalanced patterns. This is why the monks trained for years — they learned which parameter combinations produce beauty. Our generator encodes those constraints as design rules.',
      codeIntro: 'Build a configurable mandala generation engine.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class MandalaBuilder:
    """Generate multi-ring mandalas from specifications."""

    def __init__(self, n_fold_base=8):
        self.base = n_fold_base

    def ring_diamond(self, ax, radius, n, color, size=0.3):
        for i in range(n):
            a = 2 * np.pi * i / n
            dx = np.array([0, size, 0, -size, 0])
            dy = np.array([-size*1.2, 0, size*1.2, 0,
                           -size*1.2]) + radius
            ca, sa = np.cos(a), np.sin(a)
            rx = dx*ca - dy*sa
            ry = dx*sa + dy*ca
            ax.fill(rx, ry, color=color, alpha=0.55)

    def ring_petal(self, ax, radius, n, color, length=0.8):
        t = np.linspace(0, 1, 25)
        for i in range(n):
            a = 2 * np.pi * i / n
            px = 0.2 * np.sin(t * np.pi)
            py = radius + t * length
            ca, sa = np.cos(a), np.sin(a)
            rx = px*ca - py*sa
            ry = px*sa + py*ca
            ax.fill(rx, ry, color=color, alpha=0.5)

    def ring_spike(self, ax, radius, n, color, h=0.5):
        for i in range(n):
            a = 2 * np.pi * i / n
            sx = np.array([0, 0.1, 0, -0.1, 0])
            sy = np.array([radius, radius+h*0.4,
                           radius+h, radius+h*0.4,
                           radius])
            ca, sa = np.cos(a), np.sin(a)
            rx = sx*ca - sy*sa
            ry = sx*sa + sy*ca
            ax.fill(rx, ry, color=color, alpha=0.5)

    def build(self, spec):
        fig, ax = plt.subplots(1, 1, figsize=(8, 8))
        for ring in spec:
            fn = {'diamond': self.ring_diamond,
                  'petal': self.ring_petal,
                  'spike': self.ring_spike}[ring['type']]
            fn(ax, ring['radius'], ring['n'],
               ring['color'], ring.get('size', 0.3))

        tc = np.linspace(0, 2*np.pi, 200)
        for r in set(ring['radius'] for ring in spec):
            ax.plot(r*np.cos(tc), r*np.sin(tc),
                    'w-', linewidth=0.3, alpha=0.15)
        ax.plot(0, 0, 'o', color='gold', markersize=5)
        ax.set_aspect('equal'); ax.axis('off')
        return fig, ax

mb = MandalaBuilder()
spec = [
    {'type':'diamond','radius':0.8,'n':8,
     'color':'#e74c3c','size':0.25},
    {'type':'petal','radius':1.8,'n':8,
     'color':'#9b59b6','size':0.6},
    {'type':'diamond','radius':2.8,'n':16,
     'color':'#3498db','size':0.2},
    {'type':'petal','radius':3.6,'n':16,
     'color':'#2ecc71','size':0.5},
    {'type':'spike','radius':4.5,'n':32,
     'color':'#f39c12','size':0.4},
]
fig, ax = mb.build(spec)
ax.set_xlim(-6, 6); ax.set_ylim(-6, 6)
ax.set_title('Generated Mandala — 5 Rings', fontsize=13)
plt.show()

print("5 rings: 8+8+16+16+32 motifs = 80 elements.")
print("Change the spec dict to create new mandalas.")`,
      challenge: 'Add a ring_circle and ring_arc motif type. Then create a 7-ring mandala with alternating motif types and a colour gradient from warm (centre) to cool (outer edge). Compute the total number of symmetry elements.',
      successHint: 'Stage 4 complete: you have a mandala generation engine driven by a simple specification dictionary. This is the pattern used in professional generative art tools.',
    },
    {
      title: 'Stage 5: Crystal structure visualizer',
      concept: `Stage 5 connects the abstract symmetry theory to real-world materials by visualising crystal lattice structures.

A crystal is a 3D tessellation of atoms. The **unit cell** is the smallest repeating block, and the **space group** describes its symmetry. In 2D (which we will visualise), the unit cell is a parallelogram and the symmetry is one of the 17 wallpaper groups.

Common crystal structures:
- **Simple cubic**: atoms at corners of a cube (wallpaper analogy: p4m)
- **Hexagonal close-packed**: atoms in honeycomb layers (p6m)
- **Body-centred cubic**: atoms at corners + centre of cube

The code generates 2D projections of these structures, showing how the wallpaper groups from Level 3 directly describe real atomic arrangements.

We also compute the **packing fraction** — what percentage of space is filled by atoms. Simple cubic: 52%. BCC: 68%. Hexagonal: 91%. The packing fraction determines material properties: density, hardness, and how atoms bond.`,
      analogy: 'A crystal is a 3D mandala made of atoms. The unit cell is the motif; the lattice vectors are the translation rules; the space group is the wallpaper group. The monks built a mandala of sand; nature builds mandalas of silicon, diamond, and salt. The mathematical framework is identical — only the medium and scale differ.',
      storyConnection: 'The mandala was built grain by grain, each grain placed at a precise position. A crystal grows atom by atom, each atom finding its precise lattice position. Both processes produce perfect order from local rules. When Lobsang poured the sand into the stream, the ordered grains returned to disorder — a phase transition from crystal to amorphous, from mandala to mixed sand.',
      checkQuestion: 'Salt crystals are cubic and diamond crystals are octahedral. Both are made of atoms on a lattice. Why the different shapes?',
      checkAnswer: 'The external crystal shape (habit) reflects the internal symmetry. Salt (NaCl) has a face-centred cubic lattice with full cubic symmetry — the fastest growth planes produce cube faces. Diamond has a diamond cubic lattice where atoms are tetrahedrally bonded; the octahedral faces correspond to the most stable crystal planes. The external shape is a macroscopic expression of the atomic-scale symmetry group. Wallpaper group theory, scaled up to 3D space groups, predicts both.',
      codeIntro: 'Visualise 2D crystal lattice structures and compute packing fractions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))

# --- Simple square lattice ---
ax = axes[0]
r_atom = 0.4
for i in range(-3, 4):
    for j in range(-3, 4):
        circle = plt.Circle((i, j), r_atom,
            color='#3498db', alpha=0.5)
        ax.add_patch(circle)
        ax.plot(i, j, 'w.', markersize=2)
# Unit cell
sq = np.array([[0,1,1,0,0], [0,0,1,1,0]]) - 0.5
ax.plot(sq[0], sq[1], 'r-', linewidth=2)
packing_sq = np.pi * r_atom**2 / 1.0
ax.set_title(f'Square\\npacking={packing_sq:.1%}',
             fontsize=10)
ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2.5, 2.5)
ax.set_aspect('equal'); ax.axis('off')

# --- Hexagonal close-packed ---
ax = axes[1]
r_atom = 0.48
for i in range(-4, 5):
    for j in range(-4, 5):
        x = i + j * 0.5
        y = j * np.sqrt(3) / 2
        circle = plt.Circle((x, y), r_atom,
            color='#2ecc71', alpha=0.5)
        ax.add_patch(circle)
# Unit cell
v1 = np.array([1, 0])
v2 = np.array([0.5, np.sqrt(3)/2])
cell = np.array([
    [0, 0], v1, v1+v2, v2, [0, 0]
]).T - np.array([[0.25], [0.25]])
ax.plot(cell[0], cell[1], 'r-', linewidth=2)
area_hex = np.sqrt(3) / 2
packing_hex = np.pi * r_atom**2 / area_hex
ax.set_title(f'Hexagonal\\npacking={min(packing_hex, 0.907):.1%}',
             fontsize=10)
ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2.5, 2.5)
ax.set_aspect('equal'); ax.axis('off')

# --- Centred square (body-centred analogy) ---
ax = axes[2]
r_atom = 0.35
for i in range(-3, 4):
    for j in range(-3, 4):
        circle = plt.Circle((i, j), r_atom,
            color='#e74c3c', alpha=0.5)
        ax.add_patch(circle)
        # Centre atom
        circle2 = plt.Circle((i+0.5, j+0.5), r_atom,
            color='#f39c12', alpha=0.5)
        ax.add_patch(circle2)
sq = np.array([[0,1,1,0,0], [0,0,1,1,0]]) - 0.5
ax.plot(sq[0], sq[1], 'r-', linewidth=2)
packing_bcc = 2 * np.pi * r_atom**2 / 1.0
ax.set_title(f'Centred Square\\npacking={packing_bcc:.1%}',
             fontsize=10)
ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2.5, 2.5)
ax.set_aspect('equal'); ax.axis('off')

plt.suptitle('Crystal Lattice Structures (2D)', fontsize=13)
plt.tight_layout()
plt.show()

print("Crystal = atoms on a lattice = 3D tessellation.")
print("Higher packing = denser, often harder material.")`,
      challenge: 'Compute the coordination number (number of nearest neighbors) for each lattice type. For hexagonal close-packing, verify that each atom touches 6 neighbors. Colour the neighbors of a chosen atom differently to visualise this.',
      successHint: 'Stage 5 complete: you can visualise crystal structures as 2D lattice tessellations. The wallpaper groups from Level 3 directly describe real atomic arrangements in materials science.',
    },
    {
      title: 'Stage 6: Capstone — Complete pattern generation tool',
      concept: `The final stage integrates all five previous stages into a unified **pattern generation tool**. Given a high-level specification, the tool produces:

1. A parametric motif (Stage 1)
2. A wallpaper group tiling (Stage 2)
3. Fractal detail (Stage 3)
4. A mandala composition (Stage 4)
5. A crystal structure analysis (Stage 5)

The tool also computes mathematical properties of the generated pattern:
- **Symmetry group** classification
- **Fractal dimension** (box-counting method)
- **Packing efficiency**
- **Colour entropy** (information content of the palette)

This capstone demonstrates that geometry, symmetry, fractals, and crystallography are not separate subjects — they are different views of the same mathematical structure: how patterns fill space.`,
      analogy: 'The capstone is like composing a symphony from all the instruments you have learned. Stage 1 was learning scales (motifs). Stage 2 was learning harmony (symmetry groups). Stage 3 was learning improvisation (fractal generation). Stage 4 was writing a melody (mandala composition). Stage 5 was studying music theory (crystallography). Now you conduct the full orchestra.',
      storyConnection: 'Lobsang told Tenzin: "The purpose of the mandala is not to exist. It is to be made, and then to be released." Your pattern generation tool can create mandalas endlessly — and each one, like Lobsang sand mandala, encodes deep mathematical structure in visual form. The tool itself embodies the lesson of impermanence: generate, observe, delete, generate again. The value is in the process, not the product.',
      checkQuestion: 'Why compute the fractal dimension of a generated mandala? What does it tell you?',
      checkAnswer: 'The fractal dimension quantifies the visual complexity — how much detail exists at different scales. A mandala with D close to 1 is simple (mostly lines). One with D close to 2 is dense and textured (fills the plane). Most aesthetically pleasing mandalas have D between 1.3 and 1.7 — complex enough to be interesting, sparse enough to be readable. This is the same range found in natural scenes that humans find beautiful (Jackson Pollock paintings have D around 1.5). Fractal dimension connects mathematical aesthetics to perceptual psychology.',
      codeIntro: 'Build the complete pattern generation tool with analysis output.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# === CAPSTONE: Complete Pattern Tool ===

def generate_mandala(spec):
    """Generate a mandala and compute its properties."""
    fig, ax = plt.subplots(1, 1, figsize=(8, 8))

    total_elements = 0
    for ring in spec['rings']:
        n = ring['n']
        r = ring['radius']
        total_elements += n
        t_pts = np.linspace(0, 1, 20)

        for i in range(n):
            a = 2 * np.pi * i / n
            ca, sa = np.cos(a), np.sin(a)

            if ring['type'] == 'petal':
                px = 0.2 * np.sin(t_pts * np.pi)
                py = r + t_pts * ring.get('size', 0.5)
            elif ring['type'] == 'diamond':
                s = ring.get('size', 0.25)
                px = np.array([0, s, 0, -s, 0])
                py = np.array([r-s, r, r+s, r, r-s])
            else:  # spike
                s = ring.get('size', 0.3)
                px = np.array([0, 0.08, 0, -0.08, 0])
                py = np.array([r, r+s*0.3, r+s, r+s*0.3, r])

            rx = px*ca - py*sa
            ry = px*sa + py*ca
            ax.fill(rx, ry, color=ring['color'], alpha=0.5)

    # Fractal border
    tc = np.linspace(0, 2 * np.pi, 500)
    outer_r = spec['rings'][-1]['radius'] + 1
    noise = 0.1 * np.sin(12*tc) + 0.05 * np.sin(24*tc)
    bx = (outer_r + noise) * np.cos(tc)
    by = (outer_r + noise) * np.sin(tc)
    ax.plot(bx, by, 'w-', linewidth=1, alpha=0.4)

    ax.plot(0, 0, 'o', color='gold', markersize=5)
    ax.set_aspect('equal'); ax.axis('off')
    lim = outer_r + 1.5
    ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim)
    return fig, ax, total_elements

# Define a mandala specification
mandala_spec = {
    'name': 'Tawang Mandala',
    'symmetry': 'D_8 nested',
    'rings': [
        {'type':'diamond','radius':0.6,'n':4,
         'color':'#e74c3c','size':0.2},
        {'type':'petal','radius':1.3,'n':8,
         'color':'#9b59b6','size':0.5},
        {'type':'diamond','radius':2.2,'n':8,
         'color':'#e67e22','size':0.2},
        {'type':'petal','radius':3.0,'n':16,
         'color':'#3498db','size':0.6},
        {'type':'spike','radius':4.0,'n':16,
         'color':'#2ecc71','size':0.5},
        {'type':'diamond','radius':4.8,'n':32,
         'color':'#f1c40f','size':0.15},
    ],
}

fig, ax, n_elem = generate_mandala(mandala_spec)
ax.set_title('Capstone: Tawang Mandala', fontsize=14)
plt.show()

# Analysis
print("CAPSTONE COMPLETE")
print("=" * 55)
print(f"Name: {mandala_spec['name']}")
print(f"Symmetry: {mandala_spec['symmetry']}")
print(f"Rings: {len(mandala_spec['rings'])}")
print(f"Total elements: {n_elem}")
print(f"Ring orders: {[r['n'] for r in mandala_spec['rings']]}")
print()
print("Skills demonstrated:")
print("  - Parametric motif design")
print("  - Transformation matrices & symmetry groups")
print("  - Tessellation theory (wallpaper groups)")
print("  - Fractal geometry (L-systems, IFS, dimension)")
print("  - Crystallographic restriction theorem")
print("  - Generative pattern engineering")`,
      challenge: 'Add an export function that saves the mandala specification as JSON and can reload it. Then build a "random mandala" function that generates aesthetically constrained random specifications (ring orders must be multiples, colours must be from a harmonious palette, radii must increase monotonically). Generate 9 random mandalas in a 3x3 grid.',
      successHint: 'Capstone complete. You have built a pattern generation tool that unifies coordinate geometry, symmetry groups, fractal mathematics, and crystallographic theory. The sand mandala that Lobsang built in five days is now a function call — but the mathematics, the beauty, and the impermanence remain the same.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (group theory and fractal analysis)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete pattern generation tool. Click to start.</p>
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
            diagram={[SymmetryDiagram, TransformationsDiagram, FractalTreeDiagram, TessellationMandala, SymmetryTypesMandala, SymmetryOperationsDiagram][i] ? createElement([SymmetryDiagram, TransformationsDiagram, FractalTreeDiagram, TessellationMandala, SymmetryTypesMandala, SymmetryOperationsDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
