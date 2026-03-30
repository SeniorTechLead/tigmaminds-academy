import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import SymmetryDiagram from '../diagrams/SymmetryDiagram';
import TessellationDiagram from '../diagrams/TessellationDiagram';
import TransformationMatrixDiagram from '../diagrams/TransformationMatrixDiagram';
import TransformationsDiagram from '../diagrams/TransformationsDiagram';
import VoronoiDiagram from '../diagrams/VoronoiDiagram';
import CirclePropertiesDiagram from '../diagrams/CirclePropertiesDiagram';

export default function AlhambraLevel4() {
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
      title: 'Step 1: Design a base tile with constraints',
      concept: `Our capstone project is an **Alhambra Pattern Explorer** -- a tool that lets you design a tile motif, apply symmetry operations, and generate full wallpaper patterns. We build it in 6 steps.

In this first step, we create a **constrained tile designer**. The tile must satisfy two requirements:
1. **Area constraint**: the tile area must equal the unit cell area (no gaps, no overlaps)
2. **Edge matching**: opposite edges must match for the pattern to tile seamlessly

We use a parametric approach: start with a square unit cell, then deform the edges using Bezier curves controlled by a few parameters. The parameters are the "design space" -- each combination produces a different tile shape, but all of them tile the plane correctly.

This is how modern computational design works: define constraints first, then explore the space of valid solutions. It is far more powerful than drawing tiles by hand, because the constraints are enforced automatically.

The code defines a tile as four Bezier curves (one per edge), with opposite edges forced to match. You can adjust the control points to create organic, Alhambra-like shapes.`,
      analogy: 'Think of a cookie cutter that must tile a sheet of dough with no wasted dough. The shape can be elaborate, but the edges must interlock. Our parametric system generates cookie cutters that are guaranteed to interlock. The parameters are like adjustment knobs on the cutter: each setting produces a different shape, but all settings produce valid shapes.',
      storyConnection: 'The Alhambra craftsmen had physical templates (carved wooden or plaster molds) that they pressed into wet plaster. Each template was carefully shaped so that copies would interlock. Our parametric tile designer is the digital equivalent of their workshop -- a system for generating interlocking shapes, constrained by the same geometric rules.',
      checkQuestion: 'If a tile has area equal to the unit cell and edges that match, is it guaranteed to tile the plane?',
      checkAnswer: 'For translation-only tilings (wallpaper group p1), yes: matching edges and correct area are sufficient. But for tilings with rotation or reflection symmetry, additional constraints apply. The tile must also be compatible with the rotation/reflection operations of the target wallpaper group. We will add these constraints in Step 2.',
      codeIntro: 'Build a parametric tile designer with Bezier curve edges.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def bezier(P, t):
    """Cubic Bezier curve from 4 control points."""
    return ((1-t)**3 * P[0] + 3*(1-t)**2*t * P[1]
            + 3*(1-t)*t**2 * P[2] + t**3 * P[3])

def make_tile(params):
    """Create a tile with matched opposite edges.
    params: 4 values controlling the edge deformations."""
    p1, p2, p3, p4 = params
    t = np.linspace(0, 1, 50)

    # Bottom edge: deformed
    bottom_ctrl = np.array([[0,0],[0.3,p1],[0.7,p2],[1,0]])
    bottom = np.array([bezier(bottom_ctrl, ti) for ti in t])
    # Top edge: SAME deformation shifted up (ensures matching)
    top_ctrl = bottom_ctrl + [0, 1]
    top = np.array([bezier(top_ctrl, ti) for ti in t])[::-1]

    # Right edge: deformed
    right_ctrl = np.array([[1,0],[1+p3,0.3],[1+p4,0.7],[1,1]])
    right = np.array([bezier(right_ctrl, ti) for ti in t])
    # Left edge: SAME deformation shifted left
    left_ctrl = right_ctrl - [1, 0]
    left = np.array([bezier(left_ctrl, ti) for ti in t])[::-1]

    return bottom, right, top, left

# Try different parameter sets
fig, axes = plt.subplots(2, 3, figsize=(14, 9))
param_sets = [
    ([0, 0, 0, 0], 'Square (no deformation)'),
    ([0.2, -0.2, 0, 0], 'Wavy top/bottom'),
    ([0, 0, 0.15, -0.15], 'Wavy left/right'),
    ([0.2, -0.1, 0.1, -0.2], 'Both edges deformed'),
    ([0.3, 0.3, -0.2, -0.2], 'Bulging tile'),
    ([0.15, -0.25, 0.2, -0.1], 'Alhambra-style'),
]

for ax, (params, title) in zip(axes.flat, param_sets):
    edges = make_tile(params)
    # Draw 3x3 tiling
    for dx in range(-1, 2):
        for dy in range(-1, 2):
            off = np.array([dx, dy])
            for edge in edges:
                shifted = edge + off
                ax.plot(shifted[:,0], shifted[:,1],
                        color='cyan', lw=1)
            # Fill center tile
            if dx == 0 and dy == 0:
                outline = np.vstack(edges)
                ax.fill(outline[:,0], outline[:,1],
                        alpha=0.3, color='gold')
    ax.set_xlim(-0.5, 2.5); ax.set_ylim(-0.5, 2.5)
    ax.set_aspect('equal'); ax.set_title(title, fontsize=10)
    ax.axis('off')

plt.suptitle('Parametric Tile Designer — Matched Edges Guarantee Tiling')
plt.tight_layout(); plt.show()
print("Gold = one tile, Cyan = its periodic copies")
print("Opposite edges always match: no gaps, no overlaps.")`,
      challenge: 'Create a tile where the bottom edge has a pronounced peak (p1=0.5) and a deep valley (p2=-0.5). Does it still tile? Can you make a tile that looks like a jigsaw piece?',
      successHint: 'Parametric design with built-in constraints is the foundation of modern computational geometry. The constraints guarantee validity; the parameters provide creative freedom. This is the same approach used in industrial tile design, architectural panels, and 3D printing.',
    },
    {
      title: 'Step 2: Apply wallpaper group p4m transformations',
      concept: `Now we apply the symmetry operations of a specific wallpaper group to our base tile. We will use **p4m**, the most symmetric square-lattice group, which has:
- 4-fold rotation (90 degrees)
- Mirror lines through rotation centers (horizontal, vertical, diagonal)
- Glide reflections along diagonal directions

The **fundamental domain** of p4m is a right isosceles triangle -- 1/8 of the unit cell. Everything in the full pattern is generated by applying the 8 symmetry operations of D4 to this triangle, then tiling the result across the lattice.

The algorithm:
1. Design a motif within the fundamental domain (the triangle)
2. Apply the 8 elements of D4 to fill one unit cell
3. Translate the unit cell across the lattice

This is computationally elegant: you only need to store 1/8 of the information. The symmetry operations generate the rest. This is exactly how crystallographic data is stored: only the **asymmetric unit** (the fundamental domain) plus the space group operations.`,
      analogy: 'The fundamental domain is like a stencil. You paint the stencil, then stamp it in 8 orientations (4 rotations x 2 mirror images) to fill one tile. Then you repeat the tile across the wall. From one small stencil, you generate an enormous pattern. This is extreme information compression: the entire Alhambra wall is encoded in a tiny stencil plus a symmetry recipe.',
      storyConnection: 'The p4m group is one of the most common in the Alhambra. The intricate 8-pointed star patterns in the Hall of the Ambassadors are p4m: start with one small wedge of the star, apply 4-fold rotation and mirrors, and the full star emerges. The craftsmen worked with physical wedge-shaped stencils that they rotated and flipped to build the complete design.',
      checkQuestion: 'The fundamental domain of p4m is 1/8 of the unit cell. For p6m (hexagonal, 6-fold + mirrors), what fraction of the unit cell is the fundamental domain?',
      checkAnswer: '1/12. The group p6m has |D6| = 12 symmetry operations (6 rotations x 2 for reflection). The fundamental domain is a 30-60-90 triangle, 1/12 of the hexagonal unit cell. Only 1/12 of the pattern information is independent; the rest is generated by symmetry.',
      codeIntro: 'Generate a p4m wallpaper pattern from a small fundamental domain motif.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def rot90(pts, k):
    """Rotate points by k * 90 degrees."""
    for _ in range(k % 4):
        pts = np.column_stack([-pts[:,1], pts[:,0]])
    return pts

def reflect_y(pts):
    """Reflect across the y-axis."""
    return pts * [-1, 1]

# Fundamental domain: a curve in the triangle (0,0)-(0.5,0)-(0.5,0.5)
t = np.linspace(0, 1, 40)
motif = np.column_stack([
    0.1 + 0.35 * t,
    0.05 + 0.15 * np.sin(np.pi * t) * t
])

fig, ax = plt.subplots(figsize=(9, 9))
colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
          '#1abc9c', '#3498db', '#9b59b6', '#e91e8f']

for tx in range(-2, 4):
    for ty in range(-2, 4):
        offset = np.array([tx, ty])
        idx = 0
        for k in range(4):
            # Rotation
            r = rot90(motif, k)
            ax.plot(*(r + offset).T, color=colors[idx], lw=0.8)
            idx += 1
            # Rotation + reflection
            rf = rot90(reflect_y(motif), k)
            ax.plot(*(rf + offset).T, color=colors[idx], lw=0.8)
            idx += 1

# Highlight one unit cell
cell = np.array([[0,0],[1,0],[1,1],[0,1],[0,0]])
ax.plot(cell[:,0], cell[:,1], 'w--', lw=1.5, alpha=0.5)
ax.plot(0.5, 0.5, 'wo', markersize=8, label='4-fold center')

ax.set_xlim(-0.5, 4.5); ax.set_ylim(-0.5, 4.5)
ax.set_aspect('equal')
ax.set_title('Wallpaper Group p4m — 8 Copies per Unit Cell')
ax.set_facecolor('#1a1a2e')
ax.legend(fontsize=9); ax.axis('off')
plt.tight_layout(); plt.show()
print("8 colored curves per unit cell = 8 elements of D4")
print("p4m is the richest square-lattice wallpaper group:")
print("  4-fold rotation + 4 mirror lines + glide reflections")`,
      challenge: 'Implement p6m by using 6-fold rotation (60 degrees) and reflection on a hexagonal grid. The fundamental domain is a 30-60-90 triangle. You will need 12 copies per unit cell.',
      successHint: 'Wallpaper group operations are the DNA of patterns. Given the group and the fundamental domain, the entire infinite pattern is determined. This is how Nature encodes crystals (space group + asymmetric unit) and how the Alhambra encodes its art (stencil + symmetry rules).',
    },
    {
      title: 'Step 3: Build an interactive pattern editor',
      concept: `Now we build a **pattern editor** -- a tool where you can modify the motif and immediately see the full wallpaper pattern update. This is the core of our Alhambra Pattern Explorer.

The editor works in three panels:
1. **Motif editor**: a small canvas showing the fundamental domain, where you set control points
2. **Unit cell preview**: shows how the motif is replicated by the wallpaper group operations
3. **Full pattern view**: tiles the unit cell across a larger area

The key technical challenge is **real-time feedback**. When you change a control point, the entire pipeline (motif -> symmetry -> tiling) must re-execute instantly. We achieve this by keeping the computation lightweight: Bezier curves with few control points, matrix operations for symmetry, and simple loops for tiling.

In a production tool, you would use GPU shaders for the tiling step (each pixel independently computes which copy of the motif it falls within). But for our educational version, CPU computation with NumPy is sufficient for patterns up to ~20x20 tiles.`,
      analogy: 'The pattern editor is like a music synthesizer. You play one note (draw one motif), and the synthesizer applies effects (symmetry operations) and generates a full chord (unit cell), then loops it into a continuous song (tiling). Changing the note instantly changes the entire piece. The symmetry operations are the "effects chain" that transforms simple input into rich output.',
      storyConnection: 'If the Alhambra craftsmen had access to this tool, they could have explored the design space in hours instead of months. Our editor digitizes their workflow: design a small motif in the fundamental domain, let the algorithm apply the group operations, and evaluate the result. The same creative process, accelerated by computation.',
      checkQuestion: 'Why is the fundamental domain the right level of abstraction for the editor, rather than editing the full unit cell directly?',
      checkAnswer: 'Editing the fundamental domain guarantees that the result has the correct symmetry. If you edit the full unit cell directly, you might accidentally break a mirror line or rotation center, producing a pattern that falls into a lower-symmetry wallpaper group. The fundamental domain approach makes symmetry violations impossible by construction. It is a constraint that enables creativity, not one that limits it.',
      codeIntro: 'Build a pattern editor with adjustable control points.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def bezier(P, t):
    return ((1-t)**3*P[0] + 3*(1-t)**2*t*P[1]
            + 3*(1-t)*t**2*P[2] + t**3*P[3])

def apply_p4m(motif):
    """Apply p4m symmetry (8 operations) to a motif."""
    copies = [motif]
    # 3 more rotations
    for k in range(1, 4):
        angle = k * np.pi / 2
        c, s = np.cos(angle), np.sin(angle)
        R = np.array([[c, -s], [s, c]])
        copies.append(motif @ R.T)
    # Reflect all 4 across y-axis
    for k in range(4):
        copies.append(copies[k] * [-1, 1])
    return copies

# Adjustable control points (try changing these!)
cp1 = [0.15, 0.05]  # inner curve
cp2 = [0.3, 0.2]    # mid curve
cp3 = [0.1, 0.35]   # outer curve

# Build motif from control points
t = np.linspace(0, 1, 60)
P = np.array([[0, 0], cp1, cp2, [0.45, 0.45]])
curve1 = np.array([bezier(P, ti) for ti in t])
P2 = np.array([[0.45, 0.45], cp3, [0.05, 0.15], [0, 0]])
curve2 = np.array([bezier(P2, ti) for ti in t])
motif = np.vstack([curve1, curve2])

# Apply symmetry and tile
fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 5))

# Panel 1: Fundamental domain
ax1.plot(motif[:,0], motif[:,1], 'cyan', lw=2)
ax1.plot(*np.array([cp1, cp2, cp3]).T, 'ro', ms=8)
ax1.fill([0, 0.5, 0.5, 0], [0, 0, 0.5, 0],
         alpha=0.1, color='yellow')
ax1.set_xlim(-0.1, 0.6); ax1.set_ylim(-0.1, 0.6)
ax1.set_aspect('equal'); ax1.set_title('1. Motif (edit here)')
ax1.grid(alpha=0.2)

# Panel 2: Unit cell
copies = apply_p4m(motif)
for i, c in enumerate(copies):
    ax2.plot(c[:,0], c[:,1],
             color=plt.cm.tab10(i/10), lw=1.5)
ax2.plot([-.5,.5,.5,-.5,-.5], [-.5,-.5,.5,.5,-.5],
         'w--', alpha=0.4)
ax2.set_xlim(-0.6, 0.6); ax2.set_ylim(-0.6, 0.6)
ax2.set_aspect('equal'); ax2.set_title('2. Unit Cell (p4m)')
ax2.axis('off')

# Panel 3: Full tiling
for tx in range(-3, 4):
    for ty in range(-3, 4):
        for c in copies:
            shifted = c + [tx, ty]
            ax3.plot(shifted[:,0], shifted[:,1],
                     color='cyan', lw=0.4, alpha=0.7)
ax3.set_xlim(-3.5, 3.5); ax3.set_ylim(-3.5, 3.5)
ax3.set_aspect('equal'); ax3.set_title('3. Full Pattern')
ax3.set_facecolor('#0d1117'); ax3.axis('off')

plt.tight_layout(); plt.show()
print("Change cp1, cp2, cp3 to edit the motif shape.")
print("The symmetry (p4m) and tiling update automatically.")`,
      challenge: 'Try extreme control points like cp2=[0.5, 0.5] or cp1=[-0.1, 0.3]. What happens to the pattern? Can you create a motif that looks like an Alhambra star? (Hint: make the curves form pointed petals.)',
      successHint: 'The pattern editor demonstrates the power of the fundamental domain approach. All the visual complexity emerges from a few control points and a symmetry recipe. This is computational geometry at its most elegant: maximum output from minimal input.',
    },
    {
      title: 'Step 4: X-ray diffraction simulator',
      concept: `When X-rays hit a crystal, they scatter off atoms and create a **diffraction pattern** on a detector screen. This pattern is the **Fourier transform** of the crystal structure. By analyzing the diffraction pattern, scientists can determine where atoms are located.

The key equation is **Bragg's law**: constructive interference occurs when:
**2d * sin(theta) = n * lambda**

Where d is the spacing between lattice planes, theta is the scattering angle, lambda is the X-ray wavelength, and n is an integer. Only certain angles produce bright spots (diffraction peaks).

For a 2D pattern (like an Alhambra tiling), the diffraction pattern is a 2D array of spots. The **positions** of the spots reveal the lattice type and spacing. The **intensities** of the spots reveal the motif (what is inside each unit cell). This separation of lattice information (spot positions) from motif information (spot brightness) is one of the most powerful ideas in crystallography.

Our simulator creates a 2D "crystal" from a tiling pattern, computes its Fourier transform, and displays the simulated diffraction pattern. You can see how different tilings produce qualitatively different diffraction signatures.`,
      analogy: 'Imagine shining a flashlight through a piece of fabric. The weave pattern (the crystal) scatters the light, creating a pattern of bright and dark spots on the wall behind (the diffraction pattern). A plain weave and a twill weave produce different spot patterns. By studying the spots, you can determine the weave type without examining the fabric directly. X-ray diffraction does the same thing at the atomic scale.',
      storyConnection: 'The Alhambra patterns are macroscopic analogs of crystal structures. If you could shrink an Alhambra wall to atomic scale and shoot X-rays at it, the diffraction pattern would reveal the wallpaper group. Our simulator lets you "diffract" the Alhambra patterns and see their crystallographic fingerprints -- connecting 14th-century Islamic art to 20th-century materials science.',
      checkQuestion: 'A diffraction pattern shows a hexagonal array of spots. What can you conclude about the crystal structure?',
      checkAnswer: 'The crystal has a hexagonal lattice (translation vectors at 60 degrees with equal length). The positions of the diffraction spots are determined by the reciprocal lattice, which for a hexagonal real-space lattice is also hexagonal (rotated by 30 degrees). The intensities of the spots will further reveal the motif: what atoms are in each unit cell and where they sit.',
      codeIntro: 'Build an X-ray diffraction simulator for 2D tiling patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def make_pattern(lattice, motif_pts, N=256):
    """Create a 2D density map from lattice + motif."""
    img = np.zeros((N, N))
    a, b = np.array(lattice[0]), np.array(lattice[1])
    c = N // 2
    for n1 in range(-15, 16):
        for n2 in range(-15, 16):
            base = n1 * a + n2 * b
            for mx, my in motif_pts:
                pos = base + np.array([mx, my]) + c
                ix, iy = int(pos[0]), int(pos[1])
                if 0 <= ix < N and 0 <= iy < N:
                    img[iy, ix] = 1
    return img

N = 256
# Square lattice with 2-atom motif
sq_pattern = make_pattern(
    [(20, 0), (0, 20)],
    [(0, 0), (7, 7)],  # two "atoms" per cell
    N
)
# Hexagonal lattice with 1-atom motif
hex_pattern = make_pattern(
    [(20, 0), (10, 17)],
    [(0, 0)],
    N
)

fig, axes = plt.subplots(2, 2, figsize=(10, 10))

axes[0,0].imshow(sq_pattern, cmap='hot', origin='lower')
axes[0,0].set_title('Square + 2-atom motif (real space)')

sq_fft = np.abs(np.fft.fftshift(np.fft.fft2(sq_pattern)))**2
axes[0,1].imshow(np.log1p(sq_fft[N//4:3*N//4, N//4:3*N//4]),
                 cmap='inferno', origin='lower')
axes[0,1].set_title('Diffraction pattern (square)')

axes[1,0].imshow(hex_pattern, cmap='hot', origin='lower')
axes[1,0].set_title('Hexagonal lattice (real space)')

hex_fft = np.abs(np.fft.fftshift(np.fft.fft2(hex_pattern)))**2
axes[1,1].imshow(np.log1p(hex_fft[N//4:3*N//4, N//4:3*N//4]),
                 cmap='inferno', origin='lower')
axes[1,1].set_title('Diffraction pattern (hexagonal)')

for ax in axes.flat:
    ax.axis('off')

plt.suptitle('X-Ray Diffraction Simulator')
plt.tight_layout(); plt.show()
print("Square lattice: square array of diffraction spots")
print("  Spot intensities vary due to 2-atom motif")
print("Hexagonal lattice: hexagonal spots (rotated 30 deg)")
print("Spot POSITIONS = lattice type, INTENSITIES = motif")`,
      challenge: 'Add a third atom to the square lattice motif at position (10, 0). How does the diffraction pattern change? Some spots should get brighter and others dimmer. This is how crystallographers locate atoms.',
      successHint: 'X-ray diffraction is arguably the most important experimental technique in science. It determined the structure of DNA, proteins, metals, minerals, and drugs. Our 2D simulator captures the essential physics: Fourier transform of a periodic structure produces discrete diffraction peaks whose pattern encodes the structure.',
    },
    {
      title: 'Step 5: 3D crystal lattice viewer',
      concept: `Real crystals are three-dimensional. The 17 wallpaper groups in 2D become **230 space groups** in 3D. While we cannot fully explore 3D crystallography here, we can build a **3D lattice viewer** that shows how 2D tilings extend into the third dimension.

The 14 **Bravais lattices** in 3D are defined by three translation vectors **a**, **b**, **c** and the angles between them. The simplest are:
- **Simple cubic** (SC): all vectors equal length, all angles 90 degrees
- **Face-centered cubic** (FCC): atoms at cube corners and face centers -- this is the structure of copper, aluminum, and gold
- **Body-centered cubic** (BCC): atoms at cube corners and cube center -- this is iron and chromium
- **Hexagonal close-packed** (HCP): hexagonal layers stacked in ABAB pattern

We project the 3D lattice onto 2D using an **isometric projection** -- a simple linear transformation that preserves relative sizes. This lets us visualize 3D structures on a 2D screen.

The connection to the Alhambra: the 2D tiling patterns on the walls are literally cross-sections of potential 3D crystal structures. A hexagonal tiling, extended vertically, gives a hexagonal prism lattice. The mathematics scales from art to atoms.`,
      analogy: 'A 3D crystal lattice is like a parking garage. Each floor has a pattern of parking spots (the 2D lattice), and the floors are stacked with a vertical spacing. Different stacking rules (directly above, offset, rotated) produce different crystal types. Our viewer shows the parking garage from a bird\'s-eye angle so you can see both the floor pattern and the stacking.',
      storyConnection: 'The Alhambra tiles are two-dimensional art. Real crystals are three-dimensional structures. But the mathematics is the same: symmetry operations, lattice vectors, and group theory. A crystallographer analyzing a diamond crystal uses the exact same mathematical framework that an art historian uses to classify an Alhambra panel. Our 3D viewer bridges the two.',
      checkQuestion: 'FCC has 4 atoms per unit cell (8 corners shared with 8 cells, 6 faces shared with 2 cells: 8*(1/8) + 6*(1/2) = 4). How many atoms per unit cell does BCC have?',
      checkAnswer: 'BCC has 2 atoms per unit cell: 8 corner atoms each shared among 8 cells (8 * 1/8 = 1) plus 1 center atom entirely within the cell (1). Total: 1 + 1 = 2. SC has just 1 atom per unit cell (8 * 1/8 = 1). FCC is the densest cubic packing at 74%; BCC packs at 68%; SC at just 52%.',
      codeIntro: 'Build an isometric 3D crystal lattice viewer for SC, BCC, and FCC.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def iso_project(x, y, z):
    """Isometric projection from 3D to 2D."""
    px = (x - y) * np.cos(np.pi/6)
    py = (x + y) * np.sin(np.pi/6) + z
    return px, py

def draw_lattice(ax, atoms, bonds, title, color):
    """Draw a 3D lattice with isometric projection."""
    atoms = np.array(atoms)
    px, py = iso_project(atoms[:,0], atoms[:,1], atoms[:,2])
    # Draw bonds
    for i, j in bonds:
        bx = [px[i], px[j]]
        by = [py[i], py[j]]
        ax.plot(bx, by, color='gray', lw=0.5, alpha=0.4)
    # Draw atoms (larger = closer)
    sizes = 80 + 20 * (atoms[:,2] - atoms[:,2].min())
    ax.scatter(px, py, s=sizes, c=color, edgecolors='white',
               lw=0.5, zorder=5)
    ax.set_title(title); ax.set_aspect('equal'); ax.axis('off')

# Simple Cubic
sc_atoms = [(i,j,k) for i in range(3) for j in range(3)
            for k in range(3)]
sc_bonds = []
for i, a in enumerate(sc_atoms):
    for j, b in enumerate(sc_atoms):
        if j > i:
            d = sum((ai-bi)**2 for ai,bi in zip(a,b))
            if abs(d - 1) < 0.01:
                sc_bonds.append((i, j))

# BCC: add body centers
bcc_atoms = list(sc_atoms)
for i in range(2):
    for j in range(2):
        for k in range(2):
            bcc_atoms.append((i+0.5, j+0.5, k+0.5))
bcc_bonds = []
for i, a in enumerate(bcc_atoms):
    for j, b in enumerate(bcc_atoms):
        if j > i:
            d = sum((ai-bi)**2 for ai,bi in zip(a,b))
            if d < 1.01:
                bcc_bonds.append((i, j))

# FCC: add face centers
fcc_atoms = list(sc_atoms)
for i in range(2):
    for j in range(3):
        for k in range(3):
            fcc_atoms.append((i+0.5, j, k+0.5))
            fcc_atoms.append((i, j+0.5, k+0.5))
            fcc_atoms.append((i+0.5, j+0.5, k))
fcc_bonds = []
for i, a in enumerate(fcc_atoms):
    for j, b in enumerate(fcc_atoms):
        if j > i:
            d = sum((ai-bi)**2 for ai,bi in zip(a,b))
            if d < 0.52:
                fcc_bonds.append((i, j))

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
draw_lattice(axes[0], sc_atoms, sc_bonds,
             'Simple Cubic (SC)\n1 atom/cell, 52% packing', '#3498db')
draw_lattice(axes[1], bcc_atoms, bcc_bonds,
             'Body-Centered Cubic (BCC)\n2 atoms/cell, 68% packing', '#e74c3c')
draw_lattice(axes[2], fcc_atoms, fcc_bonds,
             'Face-Centered Cubic (FCC)\n4 atoms/cell, 74% packing', '#2ecc71')
plt.suptitle('3D Crystal Lattices (Isometric Projection)')
plt.tight_layout(); plt.show()
print("SC: iron (alpha), polonium")
print("BCC: iron (alpha), chromium, tungsten")
print("FCC: copper, aluminum, gold, silver")`,
      challenge: 'Add a hexagonal close-packed (HCP) lattice. Layer A has atoms at hexagonal positions; layer B is offset. The stacking is ABAB... (unlike FCC which is ABCABC...). Draw 3 layers.',
      successHint: 'The 3D lattice viewer shows how 2D tiling mathematics extends into the third dimension. The Alhambra patterns are 2D cross-sections of the same mathematical structures that describe metals, minerals, and biological crystals. From Islamic art to materials science, the same group theory applies.',
    },
    {
      title: 'Step 6: Capstone -- Alhambra pattern explorer',
      concept: `We now assemble everything into a complete **Alhambra Pattern Explorer**. The tool combines all our components:

1. **Motif designer** (Step 1): draw a curve in the fundamental domain
2. **Symmetry engine** (Step 2): apply wallpaper group operations
3. **Pattern tiler** (Step 3): repeat across the lattice
4. **Diffraction analyzer** (Step 4): compute the Fourier signature
5. **Classification** (Level 3): identify the wallpaper group

The explorer generates a pattern from parameters, tiles it, computes its diffraction pattern, and classifies its symmetry. You can then vary the parameters and see how all three representations (real-space pattern, diffraction pattern, symmetry classification) change together.

This is the workflow of a modern crystallographer, art historian, or materials scientist. It unifies the geometry of the Alhambra with the physics of X-ray diffraction and the algebra of group theory. One pattern, three perspectives, one underlying mathematics.

The capstone demonstrates the deep connection between art and science that has been our theme throughout all four levels: from computing interior angles to Fourier-analyzing crystal structures, the same mathematics of symmetry runs through everything.`,
      analogy: 'Our explorer is like a control room with multiple monitors showing different views of the same thing: a security camera (real-space pattern), a radar screen (diffraction pattern), and a classification readout (wallpaper group). Change the subject and all monitors update. This multi-view approach is exactly how scientists study crystals: real-space microscopy + diffraction + group theory, all describing the same structure.',
      storyConnection: 'The Alhambra Pattern Explorer completes the arc from the 14th-century artisan workshop to the modern research lab. The artisans designed by hand, tested by eye, and classified by tradition. We design by code, test by Fourier transform, and classify by algorithm. But the patterns are the same, the mathematics is the same, and the quest for beauty in structure is the same. Seven hundred years apart, the human impulse to find and create order in geometry endures.',
      checkQuestion: 'Our explorer combines five components. Which single component is the most computationally expensive, and why?',
      checkAnswer: 'The Fourier transform (Step 4) is the most expensive: it operates on an N x N pixel image using the FFT algorithm, which takes O(N^2 * log N) operations. For N=512, that is about 2.4 million operations. The symmetry operations (Step 2) are O(k) where k is the group order (at most 12 for p6m), and the tiling (Step 3) is O(n^2) where n is the number of tiles per side. The FFT dominates for any reasonably sized image.',
      codeIntro: 'Build the complete Alhambra Pattern Explorer with real-space, diffraction, and classification views.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === ALHAMBRA PATTERN EXPLORER ===
def make_motif(amp1=0.15, amp2=0.1, freq=2):
    t = np.linspace(0, 1, 80)
    x = 0.45 * t
    y = amp1 * np.sin(freq * np.pi * t) + amp2 * t
    return np.column_stack([x, y])

def apply_group(motif, group='p4m'):
    copies = [motif]
    if group in ('p4m', 'p4'):
        for k in range(1, 4):
            a = k * np.pi / 2
            R = np.array([[np.cos(a),-np.sin(a)],
                          [np.sin(a), np.cos(a)]])
            copies.append(motif @ R.T)
        if 'm' in group:
            n = len(copies)
            for i in range(n):
                copies.append(copies[i] * [-1, 1])
    elif group == 'p6m':
        for k in range(1, 6):
            a = k * np.pi / 3
            R = np.array([[np.cos(a),-np.sin(a)],
                          [np.sin(a), np.cos(a)]])
            copies.append(motif @ R.T)
        n = len(copies)
        for i in range(n):
            copies.append(copies[i] * [-1, 1])
    return copies

# Generate pattern
motif = make_motif(amp1=0.18, amp2=0.12, freq=3)
copies = apply_group(motif, 'p4m')

fig, axes = plt.subplots(1, 3, figsize=(16, 5))

# Panel 1: Real-space tiling
ax = axes[0]
for tx in range(-4, 5):
    for ty in range(-4, 5):
        for c in copies:
            ax.plot(*(c + [tx, ty]).T, color='cyan', lw=0.3)
ax.set_xlim(-4, 4); ax.set_ylim(-4, 4)
ax.set_facecolor('#0d1117')
ax.set_title('Real-Space Pattern (p4m)')
ax.set_aspect('equal'); ax.axis('off')

# Panel 2: Diffraction pattern
N = 256
img = np.zeros((N, N))
for tx in range(-10, 11):
    for ty in range(-10, 11):
        for c in copies:
            for pt in c[::4]:
                px = int((pt[0]+tx)*12 + N//2)
                py = int((pt[1]+ty)*12 + N//2)
                if 0 <= px < N and 0 <= py < N:
                    img[py, px] = 1
fft = np.abs(np.fft.fftshift(np.fft.fft2(img)))**2
q = N // 4
axes[1].imshow(np.log1p(fft[q:3*q, q:3*q]),
               cmap='inferno', origin='lower')
axes[1].set_title('Diffraction Pattern')
axes[1].axis('off')

# Panel 3: Classification summary
ax = axes[2]
ax.text(0.5, 0.9, 'Pattern Analysis', fontsize=16,
        ha='center', va='top', color='white', weight='bold',
        transform=ax.transAxes)
info = [
    'Wallpaper group: p4m',
    'Lattice: square',
    'Rotation order: 4',
    'Mirror lines: 4',
    'Glide reflections: yes',
    f'Copies per cell: {len(copies)}',
    f'Motif points: {len(motif)}',
    f'Total curves: {len(copies)*81*81}',
]
for i, line in enumerate(info):
    ax.text(0.1, 0.75 - i*0.09, line, fontsize=11,
            color='cyan', transform=ax.transAxes,
            family='monospace')
ax.set_facecolor('#0d1117')
ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis('off')
ax.set_title('Classification')

plt.tight_layout(); plt.show()
print("=== Alhambra Pattern Explorer ===")
print("Three views of one pattern:")
print("  Left: real-space tiling (what the eye sees)")
print("  Center: diffraction (what X-rays reveal)")
print("  Right: classification (what math describes)")
print()
print("Try: change group to 'p6m', adjust amp1/amp2/freq")`,
      challenge: 'Add a dropdown-style parameter sweep: generate a 3x3 grid of patterns with different (amp1, freq) combinations, all using p4m symmetry. This shows how the design space maps to visual variety while maintaining the same underlying symmetry.',
      successHint: 'You have built a tool that connects 14th-century Islamic art to 21st-century crystallography. The Alhambra Pattern Explorer demonstrates the deep unity of mathematics: the same group theory that classifies wall patterns classifies crystal structures. From art to atoms, symmetry is the common language.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Build an Alhambra Pattern Explorer</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a complete Alhambra Pattern Explorer using Python. Click to start.</p>
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
            diagram={[SymmetryDiagram, TessellationDiagram, TransformationMatrixDiagram, TransformationsDiagram, VoronoiDiagram, CirclePropertiesDiagram][i] ? createElement([SymmetryDiagram, TessellationDiagram, TransformationMatrixDiagram, TransformationsDiagram, VoronoiDiagram, CirclePropertiesDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
