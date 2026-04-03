import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import TransformationMatrixDiagram from '../diagrams/TransformationMatrixDiagram';
import TransformationsDiagram from '../diagrams/TransformationsDiagram';
import SymmetryDiagram from '../diagrams/SymmetryDiagram';
import TessellationDiagram from '../diagrams/TessellationDiagram';
import TileAnglesDiagram from '../diagrams/TileAnglesDiagram';
import AngleTypesDiagram from '../diagrams/AngleTypesDiagram';

export default function AlhambraLevel2() {
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
      title: 'Transformation matrices -- rotation and reflection in 2D',
      concept: `In Level 1 we rotated and reflected points using formulas. Now we formalize this with **matrices**. Every 2D rotation and reflection can be written as a 2x2 matrix that multiplies the coordinate vector.

**Rotation by angle theta:**
\`R = [[cos(theta), -sin(theta)], [sin(theta), cos(theta)]]\`

**Reflection across the x-axis:**
\`M_x = [[1, 0], [0, -1]]\`

**Reflection across the y-axis:**
\`M_y = [[-1, 0], [0, 1]]\`

**Reflection across the line y = x*tan(alpha):**
\`M_alpha = [[cos(2*alpha), sin(2*alpha)], [sin(2*alpha), -cos(2*alpha)]]\`

Why matrices? Because they **compose**. If you want to rotate by 90 degrees and then reflect, you just multiply the two matrices: M * R. The result is another 2x2 matrix -- a single operation that does both at once. This is the power of linear algebra: complex sequences of transformations reduce to single matrix multiplications.

Every symmetry of an Alhambra pattern can be expressed as a matrix. The set of all such matrices forms a **group** -- a concept we will formalize in Level 3.`,
      analogy: 'A matrix is a machine with one input slot and one output slot. You feed in a point (x, y), the machine transforms it, and out comes a new point (x\', y\'). Rotation matrices are "spinning machines," reflection matrices are "mirror machines." Multiplying two matrices builds a pipeline: the output of the first machine feeds into the second.',
      storyConnection: 'The Alhambra geometers did not know matrix algebra, but they understood the equivalent operations with compass and straightedge. Every rotation they performed with a compass corresponds to multiplying by a rotation matrix. Every mirror line they drew corresponds to a reflection matrix. Modern crystallography simply encoded their intuitions in linear algebra.',
      checkQuestion: 'What happens if you apply a reflection matrix twice? What is M_x * M_x?',
      checkAnswer: 'M_x * M_x = [[1,0],[0,-1]] * [[1,0],[0,-1]] = [[1,0],[0,1]] = the identity matrix. Reflecting twice returns every point to its original position. This is a fundamental property of reflections: they are their own inverse. In group theory, we say reflections have order 2.',
      codeIntro: 'Build rotation and reflection matrices and apply them to a shape.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def rot_matrix(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, -s], [s, c]])

def ref_matrix(alpha):
    """Reflect across line at angle alpha from x-axis."""
    c, s = np.cos(2*alpha), np.sin(2*alpha)
    return np.array([[c, s], [s, -c]])

# An arrow shape (asymmetric to show orientation)
arrow = np.array([[0,0],[1,0],[1,0.3],[1.5,0],[1,-.3],[1,0],
                  [0,0],[0,0.2],[0.8,0.2]]).T  # 2xN

fig, axes = plt.subplots(2, 3, figsize=(12, 8))
transforms = [
    ('Original', np.eye(2)),
    ('Rotate 90 deg', rot_matrix(np.pi/2)),
    ('Rotate 180 deg', rot_matrix(np.pi)),
    ('Reflect x-axis', ref_matrix(0)),
    ('Reflect y=x', ref_matrix(np.pi/4)),
    ('Rot 90 + Ref x', ref_matrix(0) @ rot_matrix(np.pi/2)),
]

for ax, (title, M) in zip(axes.flat, transforms):
    transformed = M @ arrow
    ax.plot(*arrow, 'b-', lw=2, alpha=0.3, label='original')
    ax.plot(*transformed, 'r-', lw=2, label='transformed')
    ax.set_xlim(-2, 2); ax.set_ylim(-2, 2)
    ax.set_aspect('equal'); ax.set_title(title)
    ax.grid(alpha=0.2); ax.axhline(0, color='w', lw=0.5, alpha=0.3)
    ax.axvline(0, color='w', lw=0.5, alpha=0.3)

plt.suptitle('2D Transformation Matrices')
plt.tight_layout(); plt.show()
det_rot = np.linalg.det(rot_matrix(np.pi/2))
det_ref = np.linalg.det(ref_matrix(0))
print(f"Rotation matrix determinant: {det_rot:.0f} (preserves orientation)")
print(f"Reflection matrix determinant: {det_ref:.0f} (reverses orientation)")
print("det = +1: rotation/translation  |  det = -1: reflection/glide")`,
      challenge: 'Compute rot_matrix(pi/6) @ ref_matrix(0). Is the result a rotation or a reflection? Check its determinant. What transformation is it?',
      successHint: 'Every isometry of the plane (distance-preserving transformation) is either a rotation (det=+1) or a reflection (det=-1). There are no other options in 2D. This dichotomy is the foundation of symmetry classification.',
    },
    {
      title: 'Translation vectors -- shifting patterns across the plane',
      concept: `Rotation and reflection operate around a point. **Translation** slides the entire pattern without rotating or reflecting it. In a tiling, translation is what repeats the basic unit cell across the plane.

A translation is defined by a **vector** (tx, ty). Every point (x, y) moves to (x + tx, y + ty). Unlike rotation and reflection, translation cannot be expressed as a 2x2 matrix multiplication (it is addition, not multiplication). However, we can use **homogeneous coordinates** -- representing (x, y) as (x, y, 1) -- to express translation as a 3x3 matrix.

Every periodic tiling has exactly **two independent translation vectors**, called **a** and **b**. These vectors define the **lattice** -- the grid of points where the pattern repeats. The shape of the lattice (the angle between a and b, and their relative lengths) constrains which symmetries are possible:

- **Square lattice**: |a| = |b|, angle = 90 degrees
- **Hexagonal lattice**: |a| = |b|, angle = 60 degrees
- **Rectangular lattice**: |a| =/= |b|, angle = 90 degrees
- **Oblique lattice**: |a| =/= |b|, angle =/= 90 degrees

The lattice type is the first thing a crystallographer identifies when analyzing a pattern.`,
      analogy: 'Translation vectors are like the spacing between posts in a fence. The posts are identical (the tile), and the vector between adjacent posts (the translation) is always the same. Two fence directions (a and b) create a grid, like latitude and longitude lines. Every point in the grid is reached by some combination n*a + m*b where n and m are integers.',
      storyConnection: 'The Alhambra walls are finite, but the patterns are designed to extend infinitely in principle. The two translation vectors define the "DNA" of the pattern -- given any tile, you can predict exactly where every other tile sits. The craftsmen maintained this precision over walls spanning tens of meters, using stretched strings and plumb lines as physical translation vectors.',
      checkQuestion: 'A square tiling has translation vectors a = (1, 0) and b = (0, 1). What vectors would describe a hexagonal tiling?',
      checkAnswer: 'For a hexagonal tiling with unit side length: a = (1, 0) and b = (0.5, sqrt(3)/2). The angle between them is 60 degrees, and both have length 1. Any lattice point is at position n*a + m*b = (n + 0.5*m, m*sqrt(3)/2) for integers n, m. This generates the hexagonal grid.',
      codeIntro: 'Visualize the five lattice types and see how translation vectors define tiling grids.',
      code: `import numpy as np
import matplotlib.pyplot as plt

lattices = {
    'Square': ((1, 0), (0, 1)),
    'Rectangular': ((1.5, 0), (0, 1)),
    'Hexagonal': ((1, 0), (0.5, np.sqrt(3)/2)),
    'Centered rect.': ((1.5, 0), (0.75, 1)),
    'Oblique': ((1, 0), (0.4, 0.9)),
}

fig, axes = plt.subplots(1, 5, figsize=(16, 3.5))

for ax, (name, (a, b)) in zip(axes, lattices.items()):
    a, b = np.array(a), np.array(b)
    pts = []
    for n in range(-3, 4):
        for m in range(-3, 4):
            pts.append(n * a + m * b)
    pts = np.array(pts)
    ax.scatter(pts[:,0], pts[:,1], s=25, c='cyan', zorder=3)
    # Draw translation vectors from origin
    ax.annotate('', xy=a, xytext=(0,0),
        arrowprops=dict(arrowstyle='->', color='red', lw=2))
    ax.annotate('', xy=b, xytext=(0,0),
        arrowprops=dict(arrowstyle='->', color='gold', lw=2))
    # Draw unit cell
    cell = np.array([(0,0), a, a+b, b, (0,0)])
    ax.plot(cell[:,0], cell[:,1], 'w--', alpha=0.5, lw=1)
    ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2.5, 2.5)
    ax.set_aspect('equal'); ax.set_title(name, fontsize=10)
    ax.axis('off')

plt.suptitle('Five 2D Lattice Types (Bravais Lattices)')
plt.tight_layout(); plt.show()
print("Red arrow = vector a, Gold arrow = vector b")
print("Dashed = unit cell (the repeating parallelogram)")
print("Every lattice point = n*a + m*b for integers n, m")`,
      challenge: 'For the hexagonal lattice, compute the area of the unit cell using the cross product |a x b|. How does it compare to the area of a regular hexagon with the same side length?',
      successHint: 'The five Bravais lattices are the five fundamentally different ways to tile the plane with parallelograms. Every periodic pattern has one of these lattice types as its skeleton. The lattice constrains which rotational symmetries are possible.',
    },
    {
      title: 'Glide reflection -- the hidden symmetry',
      concept: `There is a fourth symmetry operation that most people overlook: **glide reflection**. It combines a translation (slide) with a reflection (flip) across a line parallel to the translation direction.

Think of footprints in sand: left, right, left, right. Each footprint is a reflected version of the previous one, shifted forward. No single rotation or reflection produces this pattern -- you need BOTH a slide and a flip done together.

Mathematically, a glide reflection along the x-axis with glide distance d is:
- Reflect across x-axis: (x, y) -> (x, -y)
- Then translate by d: (x, -y) -> (x + d, -y)

Glide reflections are important because they appear in 7 of the 17 wallpaper groups. Many Alhambra patterns have glide reflection symmetry that is not obvious at first glance. Spotting glide reflections is often the key to correctly classifying a pattern.

A key property: applying a glide reflection twice gives a pure translation (slide by 2d). This means the glide distance must be exactly half the translation vector in that direction, or the pattern would not be periodic.`,
      analogy: 'Imagine walking and looking at your wet footprints on a tiled floor. Your left foot and right foot are mirror images, and each step moves you forward. The pattern of footprints has glide reflection symmetry: each print is a reflected, shifted copy of the one before it. Neither translation alone nor reflection alone produces the footprint pattern -- only the combination does.',
      storyConnection: 'Several Alhambra border patterns (the narrow decorative bands between large panels) use glide reflection. The motif alternates between "right-side-up" and "upside-down" as it moves along the border. The craftsmen may not have had a name for it, but they understood the visual rhythm it creates -- a flowing, directional pattern that is more dynamic than simple translation.',
      checkQuestion: 'If you apply a glide reflection twice (glide, reflect, glide, reflect), what single operation is the result?',
      checkAnswer: 'Two glide reflections along the same axis give a pure translation by twice the glide distance. First glide: (x,y) -> (x+d, -y). Second glide: (x+d, -y) -> (x+2d, y). The y-coordinate returns to its original value, and x has shifted by 2d. This is why glide distance must be half the lattice translation: two glides must equal one lattice translation for periodicity.',
      codeIntro: 'Animate the four symmetry operations: translation, rotation, reflection, glide reflection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# A foot-shaped motif
foot = np.array([[0,0],[0.2,0.8],[0.1,1.2],[0,1.0],
                 [-0.1,1.2],[-0.2,0.8],[0,0]])

def reflect_x(pts):
    return pts * [1, -1]

fig, axes = plt.subplots(1, 4, figsize=(16, 4))

# 1. Translation
ax = axes[0]
for i in range(5):
    shifted = foot + [i * 0.8, 0]
    ax.fill(shifted[:,0], shifted[:,1], alpha=0.6,
            color='royalblue')
ax.set_title('Translation'); ax.set_ylim(-1.5, 1.5)

# 2. Rotation (order 4)
ax = axes[1]
for i in range(4):
    theta = i * np.pi / 2
    c, s = np.cos(theta), np.sin(theta)
    R = np.array([[c, -s], [s, c]])
    rotated = (foot + [0.3, 0]) @ R.T
    ax.fill(rotated[:,0], rotated[:,1], alpha=0.6,
            color=['#e74c3c','#f39c12','#2ecc71','#3498db'][i])
ax.set_title('Rotation (order 4)')

# 3. Reflection
ax = axes[2]
for i in range(4):
    shifted = foot + [i * 0.8, 0.3]
    reflected = reflect_x(foot) + [i * 0.8, -0.3]
    ax.fill(shifted[:,0], shifted[:,1], alpha=0.6, color='royalblue')
    ax.fill(reflected[:,0], reflected[:,1], alpha=0.6, color='coral')
ax.axhline(0, color='white', ls='--', alpha=0.4)
ax.set_title('Reflection'); ax.set_ylim(-1.5, 1.5)

# 4. Glide reflection
ax = axes[3]
for i in range(5):
    if i % 2 == 0:
        shifted = foot + [i * 0.6, 0.3]
        ax.fill(shifted[:,0], shifted[:,1], alpha=0.6, color='royalblue')
    else:
        reflected = reflect_x(foot) + [i * 0.6, -0.3]
        ax.fill(reflected[:,0], reflected[:,1], alpha=0.6, color='coral')
ax.axhline(0, color='white', ls='--', alpha=0.4)
ax.set_title('Glide Reflection'); ax.set_ylim(-1.5, 1.5)

for ax in axes:
    ax.set_aspect('equal'); ax.axis('off')

plt.suptitle('The Four Symmetry Operations of the Plane')
plt.tight_layout(); plt.show()
print("Every pattern in the Alhambra uses some combination")
print("of these four operations. No other isometries exist in 2D.")`,
      challenge: 'Create a pattern that uses glide reflection with a glide distance of 1 unit along a diagonal line (y = x). You will need to combine a diagonal reflection with a diagonal translation.',
      successHint: 'These four operations -- translation, rotation, reflection, glide reflection -- are the complete toolkit for 2D symmetry. There are no others. Every pattern ever created, from the Alhambra to modern wallpaper, uses only these four ingredients.',
    },
    {
      title: 'Semi-regular tessellations -- mixing different shapes',
      concept: `In Level 1 we found the three regular tessellations (using one shape). Now we explore **semi-regular tessellations** (also called Archimedean tilings): patterns using two or more regular polygon types, with the same vertex configuration at every vertex.

There are exactly **8 semi-regular tessellations**. Each is identified by its **vertex configuration** -- the sequence of polygon sizes around each vertex. For example:
- **3.3.3.3.6**: four triangles and one hexagon at each vertex (60+60+60+60+120=360)
- **3.3.3.4.4**: three triangles and two squares (60+60+60+90+90=360)
- **3.4.6.4**: triangle, square, hexagon, square (60+90+120+90=360)
- **3.6.3.6**: alternating triangles and hexagons (60+120+60+120=360)
- **3.12.12**: triangle and two dodecagons (60+150+150=360)
- **4.6.12**: square, hexagon, dodecagon (90+120+150=360)
- **4.8.8**: square and two octagons (90+135+135=360)
- **3.3.4.3.4**: three triangles and two squares in another arrangement

The Alhambra features several of these, particularly 4.8.8 (the octagon-square pattern) and 3.6.3.6 (the trihexagonal pattern).`,
      analogy: 'If regular tessellations are meals made from one ingredient (all rice, all bread, all pasta), semi-regular tessellations are recipes with multiple ingredients in a fixed ratio. The "recipe" (vertex configuration) is the same at every serving. You cannot randomly mix shapes and get a semi-regular tiling -- the proportions must be exact.',
      storyConnection: 'The Alhambra is famous for its use of the 4.8.8 (octagon-and-square) pattern, which appears in several rooms. This pattern creates an elegant visual rhythm: the large octagons draw the eye while the small squares provide structure. The variety of semi-regular tilings gave the artists a rich palette beyond the three simple regular tilings.',
      checkQuestion: 'Why are there exactly 8 semi-regular tessellations and not more? What constraint limits them?',
      checkAnswer: 'Two constraints work together: (1) the vertex angles must sum to exactly 360 degrees, and (2) the same vertex configuration must work consistently when extended across the entire plane. Many angle combinations pass test 1 but fail test 2 -- they create contradictions when you try to tile beyond a single vertex. The proof involves checking all angle-sum solutions and verifying which ones extend globally. Only 8 survive both tests.',
      codeIntro: 'Draw two classic semi-regular tessellations: 4.8.8 and 3.6.3.6.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import RegularPolygon
from matplotlib.collections import PatchCollection

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))

# 4.8.8: Octagon and square
patches, colors = [], []
s = 0.5  # half-side
d = s * (1 + np.sqrt(2))  # center-to-center distance
for row in range(5):
    for col in range(5):
        cx, cy = col * d, row * d
        # Octagon
        oct_p = RegularPolygon((cx, cy), 8, radius=s*1.31,
                               orientation=np.pi/8)
        patches.append(oct_p)
        colors.append((0.2, 0.6, 0.9, 0.6))
        # Small square in the gap (offset)
        if col < 4 and row < 4:
            sx, sy = cx + d/2, cy + d/2
            sq = RegularPolygon((sx, sy), 4, radius=s*0.54,
                                orientation=np.pi/4)
            patches.append(sq)
            colors.append((0.9, 0.4, 0.2, 0.6))
pc = PatchCollection(patches, facecolors=colors, edgecolors='white', lw=1)
ax1.add_collection(pc)
ax1.set_xlim(-1, 5.5); ax1.set_ylim(-1, 5.5)
ax1.set_aspect('equal'); ax1.set_title('4.8.8 (Octagon + Square)')
ax1.axis('off')

# 3.6.3.6: Trihexagonal (kagome)
patches2, colors2 = [], []
hr = 0.55
for row in range(6):
    for col in range(6):
        x = col * hr * np.sqrt(3) + (row % 2) * hr * np.sqrt(3) / 2
        y = row * hr * 1.5
        h = RegularPolygon((x, y), 6, radius=hr)
        patches2.append(h)
        colors2.append((0.2, 0.8, 0.5, 0.5))

pc2 = PatchCollection(patches2, facecolors=colors2, edgecolors='white', lw=1.5)
ax2.add_collection(pc2)
ax2.set_xlim(-1, 6); ax2.set_ylim(-1, 7)
ax2.set_aspect('equal'); ax2.set_title('3.6.3.6 (Trihexagonal / Kagome)')
ax2.axis('off')

plt.tight_layout(); plt.show()
print("4.8.8: each vertex has one square + two octagons")
print("  90 + 135 + 135 = 360 degrees")
print("3.6.3.6: each vertex has two triangles + two hexagons")
print("  60 + 120 + 60 + 120 = 360 degrees")`,
      challenge: 'Try to draw the 3.12.12 tessellation (one triangle + two dodecagons at each vertex). The dodecagons are large and the triangles fill the small gaps. This is one of the most beautiful semi-regular tilings.',
      successHint: 'The 8 semi-regular tessellations, plus the 3 regular ones, give 11 vertex-transitive tilings total. These 11 patterns are the "alphabet" of periodic tiling. Every complex pattern in the Alhambra builds on one of these fundamental structures.',
    },
    {
      title: 'Escher-style tiles -- modifying edges',
      concept: `M.C. Escher, the Dutch artist famous for his impossible geometries, created tessellations using birds, fish, and lizards instead of geometric shapes. His secret? **Edge modification**.

Start with a simple tile that tessellates (like a square or hexagon). Then modify one edge with a curve or zigzag. The key rule: **whatever you add to one edge, you must subtract from the opposite edge** (for translation-based tilings) or from the **adjacent edge** (for rotation-based tilings).

For a square with translation symmetry:
1. Modify the top edge with a curve
2. Copy that same curve to the bottom edge
3. Modify the left edge with a different curve
4. Copy that curve to the right edge

The result still tiles perfectly because the bumps and dents match up. But instead of boring squares, you now have shapes that could look like animals, leaves, or abstract forms.

The Alhambra artists used this technique centuries before Escher. Their tiles often have interlocking curved edges that appear organic while maintaining mathematical precision. The curve modifications are always paired to preserve the tiling property.`,
      analogy: 'Imagine a jigsaw puzzle where every piece is the same shape. Each bump on one edge fits into an identical dent on the neighboring piece. If you modify the bump (making it look like a bird\'s head), you must modify the dent to match (making it the shape of the space around a bird\'s head). The pieces still fit together, but now they look like birds instead of generic puzzle shapes.',
      storyConnection: 'The Alhambra\'s interlocking tile designs prefigured Escher by 600 years. When Escher visited the Alhambra in 1922 and 1936, he filled notebooks with sketches of the patterns. He later wrote that the visit was "the richest source of inspiration I have ever tapped." The Alhambra directly inspired his life\'s work in tessellation art.',
      checkQuestion: 'If you modify the top edge of a square tile with a curve that goes 0.5 units upward, can you still tile the plane? What happens to the bottom edge of the tile above?',
      checkAnswer: 'Yes, you can tile if the bottom edge has the matching 0.5-unit indent. The tile above it places its modified top edge where the dent is, and the curves interlock. The total area of each tile stays the same as the original square (what you add on top, you remove from bottom). This area conservation is guaranteed by the edge-pairing rule.',
      codeIntro: 'Create Escher-style tiles by modifying the edges of a square.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Define edge modifications
t = np.linspace(0, 1, 50)
# Top/bottom edge: a wavy bump
bump_y = 0.15 * np.sin(2 * np.pi * t)
# Left/right edge: a zigzag
zig_x = 0.1 * np.sin(3 * np.pi * t)

def escher_tile(ox, oy):
    """Generate an Escher-modified square tile at offset (ox, oy)."""
    # Bottom edge (left to right): y = bump
    bottom = np.column_stack([t + ox, bump_y + oy])
    # Right edge (bottom to top): x = 1 + zig
    right = np.column_stack([1 + zig_x + ox, t + oy])
    # Top edge (right to left): y = 1 + bump (reversed)
    top = np.column_stack([t[::-1] + ox, 1 + bump_y[::-1] + oy])
    # Left edge (top to bottom): x = zig (reversed)
    left = np.column_stack([zig_x[::-1] + ox, t[::-1] + oy])
    return np.vstack([bottom, right, top, left])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))

# Show one tile
tile = escher_tile(0, 0)
ax1.fill(tile[:,0], tile[:,1], alpha=0.4, color='royalblue')
ax1.plot(tile[:,0], tile[:,1], 'w-', lw=1.5)
ax1.plot(t, np.zeros_like(t), 'r--', alpha=0.3, label='original edge')
ax1.plot(t, bump_y, 'r-', lw=2, label='modified edge')
ax1.set_xlim(-0.3, 1.5); ax1.set_ylim(-0.3, 1.3)
ax1.set_aspect('equal'); ax1.set_title('Single Escher Tile')
ax1.legend(fontsize=8); ax1.grid(alpha=0.2)

# Tile the plane
cmap = plt.cm.Set3
for row in range(5):
    for col in range(6):
        tile = escher_tile(col, row)
        color = cmap((row * 6 + col) % 12 / 12)
        ax2.fill(tile[:,0], tile[:,1], alpha=0.6, color=color)
        ax2.plot(tile[:,0], tile[:,1], 'w-', lw=0.5)
ax2.set_xlim(-0.5, 6.5); ax2.set_ylim(-0.5, 5.5)
ax2.set_aspect('equal'); ax2.set_title('Escher-Style Tiling')
ax2.axis('off')

plt.tight_layout(); plt.show()
print("The bumps on each tile fit into the dents of its neighbor.")
print("Rule: modify top edge -> copy to bottom edge (translation)")
print("Rule: modify left edge -> copy to right edge (translation)")`,
      challenge: 'Make the bump larger (try amplitude 0.3 or 0.5). At what point does the tile start to look like a recognizable shape? Can you make it resemble a bird or fish by adjusting the edge curves?',
      successHint: 'Escher-style edge modification preserves the tiling property while transforming geometric tiles into organic shapes. This is the bridge between mathematical tessellation and artistic expression -- exactly what the Alhambra represents.',
    },
    {
      title: 'Pattern classifier -- identify the symmetry operations',
      concept: `Given an unknown pattern, how do you determine its symmetry? This is the **classification problem**, and it is the central task of crystallography.

The algorithm for classifying a 2D pattern:
1. **Find the lattice**: identify the two shortest translation vectors
2. **Find rotation centers**: look for points where the pattern maps to itself under rotation (and determine the order: 2, 3, 4, or 6)
3. **Find mirror lines**: look for lines of reflection symmetry
4. **Find glide reflections**: look for lines where slide+flip maps the pattern to itself
5. **Match to a wallpaper group**: the combination of lattice type + rotations + reflections + glides uniquely identifies one of the 17 wallpaper groups

In practice, steps 2-4 are done by checking specific symmetry elements. For a computer algorithm, you test each operation by computing the difference between the original and transformed patterns. If the difference is below a threshold, the symmetry is present.

This is exactly what scientists do when analyzing crystal structures from X-ray diffraction data, and what art historians do when cataloguing the patterns of the Alhambra.`,
      analogy: 'Classifying symmetry is like identifying a song by its musical structure. You listen for the beat (lattice), the recurring melody (rotation), whether the melody is ever played backwards (reflection), and whether there are off-beat echoes (glide reflection). Each combination of these features identifies a unique musical form. Patterns work the same way: the combination of symmetry operations is the pattern\'s "fingerprint."',
      storyConnection: 'In the 1980s, mathematicians Branko Gruenbaum and Rafael Perez-Gomez systematically analyzed every pattern in the Alhambra and identified at least 13 of the 17 wallpaper groups. Later studies found evidence for all 17. The Alhambra is the only medieval building known to contain (nearly) all possible periodic symmetry types.',
      checkQuestion: 'A pattern has 4-fold rotation symmetry and mirror lines. Which wallpaper group is it?',
      checkAnswer: 'It depends on whether the mirror lines pass through the 4-fold rotation centers or between them. If mirrors pass through: p4m (the most symmetric square-lattice group). If mirrors are at 45 degrees to the lattice vectors: p4g. These two groups have the same rotation and reflection types but differ in how mirrors and rotations relate to each other. The distinction is subtle but mathematically precise.',
      codeIntro: 'Build a symmetry detector that tests a pattern for rotation and reflection symmetry.',
      code: `import numpy as np

def test_rotation(pattern, center, angle, tol=0.1):
    """Test if pattern has rotation symmetry about center."""
    c, s = np.cos(angle), np.sin(angle)
    R = np.array([[c, -s], [s, c]])
    rotated = (pattern - center) @ R.T + center
    # Check if rotated points match original
    dists = []
    for pt in rotated:
        d = np.min(np.linalg.norm(pattern - pt, axis=1))
        dists.append(d)
    return np.mean(dists) < tol

def test_reflection(pattern, line_angle, tol=0.1):
    """Test if pattern has mirror symmetry across a line."""
    a = 2 * line_angle
    M = np.array([[np.cos(a), np.sin(a)],
                   [np.sin(a), -np.cos(a)]])
    reflected = pattern @ M.T
    dists = []
    for pt in reflected:
        d = np.min(np.linalg.norm(pattern - pt, axis=1))
        dists.append(d)
    return np.mean(dists) < tol

# Test pattern: vertices of a regular hexagon
n = 6
angles = np.linspace(0, 2*np.pi, n, endpoint=False)
hexagon = np.column_stack([np.cos(angles), np.sin(angles)])

center = np.array([0, 0])
print("=== Symmetry Analysis of a Regular Hexagon ===")
print()
for order in [2, 3, 4, 5, 6]:
    angle = 2 * np.pi / order
    has_sym = test_rotation(hexagon, center, angle)
    mark = "YES" if has_sym else "no"
    print(f"  {order}-fold rotation ({360//order} deg): {mark}")

print()
for deg in [0, 30, 45, 60, 90]:
    rad = np.radians(deg)
    has_mirror = test_reflection(hexagon, rad)
    mark = "YES" if has_mirror else "no"
    print(f"  Mirror at {deg} deg: {mark}")

print()
print("Hexagon: 6-fold rotation + 6 mirror lines")
print("This is the dihedral group D6 with 12 elements.")
print("Wallpaper group for hex tiling: p6m")`,
      challenge: 'Test a square (n=4) and a regular pentagon (n=5). Which rotation orders and mirror angles does each have? Modify the hexagon by moving one vertex slightly. How does this break the symmetry?',
      successHint: 'Symmetry detection is the foundation of crystallography, materials science, and art analysis. The algorithm you just built is a simplified version of what software like PLATON and FindSym use to analyze crystal structures from diffraction data.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Matrices, transformations, and pattern classification</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with NumPy and Matplotlib for transformation geometry. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[TransformationMatrixDiagram, TransformationsDiagram, SymmetryDiagram, TessellationDiagram, TileAnglesDiagram, AngleTypesDiagram][i] ? createElement([TransformationMatrixDiagram, TransformationsDiagram, SymmetryDiagram, TessellationDiagram, TileAnglesDiagram, AngleTypesDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
