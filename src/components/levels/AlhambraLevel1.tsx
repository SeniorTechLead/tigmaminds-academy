import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import AngleTypesDiagram from '../diagrams/AngleTypesDiagram';
import TessellationDiagram from '../diagrams/TessellationDiagram';
import SymmetryDiagram from '../diagrams/SymmetryDiagram';
import CirclePropertiesDiagram from '../diagrams/CirclePropertiesDiagram';
import TransformationsDiagram from '../diagrams/TransformationsDiagram';
import TileAnglesDiagram from '../diagrams/TileAnglesDiagram';

export default function AlhambraLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Interior angles of polygons',
      concept: `The Alhambra palace in Granada, Spain is covered with tiles in dozens of geometric patterns. The Moorish artists who created them 700 years ago discovered something mathematicians would later prove: only certain shapes can tile a flat surface with no gaps and no overlaps.

The key is **interior angles**. A regular polygon with n sides has each interior angle equal to:

**angle = (n - 2) * 180 / n**

For a triangle (n=3): (3-2) * 180 / 3 = **60 degrees**
For a square (n=4): (4-2) * 180 / 4 = **90 degrees**
For a hexagon (n=6): (6-2) * 180 / 6 = **120 degrees**

This formula comes from a simple fact: the sum of all interior angles of any polygon is (n-2) * 180 degrees. A triangle has 180 degrees total, a quadrilateral has 360, a pentagon has 540, and so on. For regular polygons (all sides equal), each angle is the total divided by n.

Why does this matter for tiling? Because at every vertex where tiles meet, the angles must add up to exactly 360 degrees. If they add to less, there is a gap. If more, the tiles overlap. This is the **360-degree rule** and it governs every tiling pattern in the Alhambra.`,
      analogy: 'Think of fitting pie slices around a plate. If each slice has an angle that divides evenly into 360 degrees, you can fill the plate perfectly. If not, you will have a gap or an overlap. Regular polygons are like pie slices with fixed angles, and tiling a floor is like filling an infinite plate.',
      storyConnection: 'The artisans of the Alhambra did not know the formula (n-2)*180/n, but they understood the principle intuitively through centuries of craft. They tested shapes by cutting and fitting them. The geometry was discovered through practice before it was proved through mathematics.',
      checkQuestion: 'What is the interior angle of a regular pentagon (n=5)? Can pentagons tile a flat surface by themselves?',
      checkAnswer: 'Interior angle = (5-2) * 180 / 5 = 108 degrees. Can they tile? 360 / 108 = 3.33... This is not a whole number, so pentagons cannot meet at a vertex without gaps. Three pentagons give 324 degrees (gap of 36 degrees). Four give 432 degrees (overlap). Pentagons CANNOT tile the plane alone. This is why you never see regular pentagon floor tiles.',
      codeIntro: 'Compute and visualize interior angles for polygons from triangles to dodecagons.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sides = np.arange(3, 13)  # triangle to dodecagon
angles = (sides - 2) * 180 / sides
can_tile = [360 % a == 0 for a in angles]

names = ['tri','sq','pent','hex','hept','oct',
         'non','dec','hendec','dodec']

plt.figure(figsize=(10, 5))
colors = ['green' if t else 'salmon' for t in can_tile]
plt.bar(names, angles, color=colors, edgecolor='white')
plt.axhline(120, color='cyan', ls='--', alpha=0.5, label='120 (hex)')
plt.axhline(90, color='cyan', ls=':', alpha=0.5, label='90 (square)')
plt.ylabel('Interior angle (degrees)')
plt.title('Which Regular Polygons Can Tile? (green = yes)')
plt.legend()
plt.grid(axis='y', alpha=0.3)
plt.show()

for n, a, t in zip(sides, angles, can_tile):
    fits = 360 / a
    mark = "YES" if t else "no"
    print(f"  {n}-gon: {a:.1f} deg, 360/angle = {fits:.2f}  [{mark}]")`,
      challenge: 'Extend the range to n=20. Do any polygons with more than 6 sides tile the plane alone? Why does the angle approach 180 degrees as n grows?',
      successHint: 'Only three regular polygons tile the plane: triangles (60 degrees), squares (90 degrees), and hexagons (120 degrees). Every other regular polygon fails the 360-degree test.',
    },
    {
      title: 'The 360-degree rule at a vertex',
      concept: `We now know the interior angles of regular polygons. The **tiling rule** is: at every point (vertex) where tiles meet, the angles must sum to exactly **360 degrees**.

For squares: 360 / 90 = **4 squares** meet at each vertex.
For triangles: 360 / 60 = **6 triangles** meet at each vertex.
For hexagons: 360 / 120 = **3 hexagons** meet at each vertex.

These are the only three **regular tessellations** (using a single regular polygon). But the 360-degree rule also allows **combinations** of different shapes. For example: at a vertex, one square (90) + two triangles (60+60) + one hexagon (120) = 330 degrees. That does not work. But two squares (90+90) + three triangles (60+60+60) = 360. That works!

The Alhambra artists exploited this freedom. They mixed shapes in intricate combinations, always respecting the 360-degree constraint. In Level 2 we will explore these semi-regular tessellations systematically. For now, the key insight is: **360 degrees is the gatekeeper**.`,
      analogy: 'Imagine a clock face. The angles around the center add up to 360 degrees. If you divide the clock into equal slices, each slice must be 360/n degrees for n slices. If the slice angle does not divide 360 evenly, you cannot fill the clock face. Tiling a floor is the same rule applied at every meeting point.',
      storyConnection: 'Walk through the Alhambra and look at any vertex where tiles meet. Count the shapes and add up the angles: it always totals 360. The Moorish geometers encoded this rule into their craft tradition. Every apprentice learned it by practice: if the tiles gap or buckle, the angles are wrong.',
      checkQuestion: 'Can you tile using only regular octagons (135 degrees each)?',
      checkAnswer: 'No. 360 / 135 = 2.67, which is not a whole number. Two octagons give 270 degrees, leaving a 90-degree gap. But if you fill that gap with a square (90 degrees), it works! This is the classic octagon-and-square tiling you see in many bathrooms. Two octagons (270) + one square (90) = 360.',
      codeIntro: 'Test all combinations of 2-3 regular polygons that satisfy the 360-degree rule.',
      code: `import numpy as np

def angle(n):
    return (n - 2) * 180 / n

# Find vertex configurations that sum to 360
# Try all combos of 3-6 polygons from {3,4,5,6,8,10,12}
shapes = [3, 4, 5, 6, 8, 10, 12]
valid = []

from itertools import combinations_with_replacement
for count in range(3, 7):
    for combo in combinations_with_replacement(shapes, count):
        total = sum(angle(n) for n in combo)
        if abs(total - 360) < 0.01:
            valid.append(combo)

print("=== Vertex configurations that tile (sum = 360) ===")
print()
for combo in valid:
    angles_str = ' + '.join(f'{angle(n):.0f}' for n in combo)
    names = ', '.join(f'{n}-gon' for n in combo)
    print(f"  {combo}  ->  {angles_str} = 360")
    print(f"    ({names})")
    print()

print(f"Total valid configurations found: {len(valid)}")
print("Not all of these produce actual tilings — some")
print("pass the vertex test but fail to extend globally.")`,
      challenge: 'Add n=7 (heptagon, 128.57 degrees) to the shapes list. Does it appear in any valid combination? Why are 5-gon and 7-gon so rare in tilings?',
      successHint: 'The 360-degree vertex rule is necessary but not sufficient for a tiling to exist. It filters out most combinations. The ones that survive still need to be tested for global consistency, which is a harder problem.',
    },
    {
      title: 'Drawing tessellations with Python turtle',
      concept: `Now let us draw an actual tessellation. We will use matplotlib to simulate **turtle graphics** -- a method where you move a "pen" forward, turn, and repeat.

A square tessellation is the simplest: draw a square, move to the next position, repeat. The algorithm:
1. Pick a starting point
2. Draw a square (forward, turn 90, forward, turn 90, forward, turn 90, forward, turn 90)
3. Move one square-width to the right
4. Repeat across the row
5. Move down one row and repeat

For a hexagonal tessellation, the same idea applies but the offsets are trickier: each row is shifted half a hex-width, and the vertical spacing involves sqrt(3).

The code below draws both patterns. The key insight is that **every tessellation is just a simple shape plus a rule for where to place the next copy**. That placement rule involves **translation** -- sliding the shape without rotating it. Translation is the simplest symmetry operation, and every tessellation uses it.`,
      analogy: 'Think of a rubber stamp. You ink the stamp (the tile shape), press it down (draw at position), lift it, move it exactly one tile-width to the right, and press again. If you do this perfectly, the stamps tile the paper with no gaps. Tessellation is stamping with mathematical precision.',
      storyConnection: 'The Alhambra craftsmen used physical stamps and molds to press plaster patterns onto walls. Each stamp was a single tile unit. They placed the stamps in precise grids, exactly like the code below places polygon patches. The tools changed from plaster to Python, but the geometry is identical.',
      checkQuestion: 'Why does the hexagonal grid need each row offset by half a hexagon width?',
      checkAnswer: 'In a hexagonal tessellation, each hexagon has flat edges on top and bottom, and the hexagons in the next row nestle into the gaps. If you did not offset, the flat edges would stack directly on top of each other, leaving diamond-shaped gaps. The half-width offset lets each hexagon sit in the "valley" between two hexagons above it -- like stacking oranges.',
      codeIntro: 'Draw square and hexagonal tessellation grids using matplotlib patches.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import RegularPolygon
from matplotlib.collections import PatchCollection

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Square tessellation
patches = []
for row in range(6):
    for col in range(8):
        sq = RegularPolygon((col, row), 4, radius=0.707,
                            orientation=np.pi/4)
        patches.append(sq)
colors = [(0.2, 0.6, 0.9, 0.6) if (r+c)%2==0
          else (0.9, 0.4, 0.2, 0.6)
          for r in range(6) for c in range(8)]
pc = PatchCollection(patches, facecolors=colors, edgecolors='white')
ax1.add_collection(pc)
ax1.set_xlim(-1, 8); ax1.set_ylim(-1, 6)
ax1.set_aspect('equal'); ax1.set_title('Square Tiling (4.4.4.4)')
ax1.axis('off')

# Hexagonal tessellation
patches2 = []
s = 0.6
for row in range(7):
    for col in range(7):
        x = col * s * np.sqrt(3) + (row % 2) * s * np.sqrt(3)/2
        y = row * s * 1.5
        h = RegularPolygon((x, y), 6, radius=s)
        patches2.append(h)
colors2 = [(0.2, 0.8, 0.4, 0.6) if (r+c)%3==0
           else (0.9, 0.8, 0.2, 0.6) if (r+c)%3==1
           else (0.3, 0.5, 0.9, 0.6)
           for r in range(7) for c in range(7)]
pc2 = PatchCollection(patches2, facecolors=colors2, edgecolors='white')
ax2.add_collection(pc2)
ax2.set_xlim(-1, 7); ax2.set_ylim(-1, 8)
ax2.set_aspect('equal'); ax2.set_title('Hexagonal Tiling (6.6.6)')
ax2.axis('off')

plt.tight_layout(); plt.show()
print("Left: 4 squares meet at each vertex (90*4=360)")
print("Right: 3 hexagons meet at each vertex (120*3=360)")`,
      challenge: 'Add a third subplot showing a triangular tessellation (6 triangles at each vertex). Use RegularPolygon with numVertices=3. You will need to alternate the orientation of triangles (pointing up vs. down) in each row.',
      successHint: 'Every tessellation is built from a tile shape plus translation vectors. The shape determines the vertex angles; the vectors determine the grid layout. This decomposition into shape + placement is the foundation of all pattern analysis.',
    },
    {
      title: 'Mirror symmetry -- reflection in code',
      concept: `Look at a butterfly. Its left wing is a mirror image of its right wing. This is **reflection symmetry** (also called mirror symmetry or bilateral symmetry). The mirror line is called the **axis of symmetry**.

To reflect a point across the y-axis: flip the x-coordinate.
- Point (3, 2) becomes (-3, 2)
- Point (-1, 5) becomes (1, 5)

To reflect across the x-axis: flip the y-coordinate.
- Point (3, 2) becomes (3, -2)

To reflect across a general line, the math is more involved (we will cover it in Level 2 with matrices). For now, the key idea is: **reflection preserves shape and size but reverses orientation**. If you write the letter "R" and reflect it, you get a backwards "R". A reflected clock runs counterclockwise.

The Alhambra uses reflection symmetry extensively. Many of its patterns have a vertical or horizontal mirror line. Some have both, creating four-fold symmetry. Identifying mirror lines is the first step in classifying a pattern's symmetry group.`,
      analogy: 'Hold a piece of paper up to a mirror. The reflection preserves distances (nothing stretches or shrinks) and angles (squares stay square), but left becomes right. Reflection is a "rigid motion" -- it moves every point but preserves the shape. In math, we call these distance-preserving transformations "isometries."',
      storyConnection: 'Many Alhambra panels have a vertical axis of symmetry running through the center. The craftsmen would design one half, then mirror it to complete the pattern. This halved their design work while ensuring perfect balance. Nature uses the same trick: bilateral symmetry in animals reduces the genetic information needed to build a body.',
      checkQuestion: 'The letter "A" has a vertical mirror line. The letter "B" has a horizontal mirror line. Which uppercase letters have BOTH vertical and horizontal mirror lines?',
      checkAnswer: 'H, I, O, and X have both vertical and horizontal mirror lines. These letters look the same when reflected in either direction. In symmetry language, they have the symmetry group of a rectangle (the Klein four-group). The letter O, being circular, actually has infinite mirror lines through its center.',
      codeIntro: 'Reflect a polygon across different axes and visualize the symmetry.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Define an L-shaped polygon (asymmetric, so reflection is visible)
shape = np.array([[0,0],[2,0],[2,1],[1,1],[1,3],[0,3],[0,0]])

def reflect_x(pts):
    """Reflect across x-axis: flip y"""
    return pts * np.array([1, -1])

def reflect_y(pts):
    """Reflect across y-axis: flip x"""
    return pts * np.array([-1, 1])

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

for ax, (title, shapes) in zip(axes, [
    ('Vertical mirror (y-axis)',
     [(shape, 'royalblue'), (reflect_y(shape), 'coral')]),
    ('Horizontal mirror (x-axis)',
     [(shape, 'royalblue'), (reflect_x(shape), 'coral')]),
    ('Both mirrors',
     [(shape, 'royalblue'), (reflect_y(shape), 'coral'),
      (reflect_x(shape), 'green'),
      (reflect_x(reflect_y(shape)), 'gold')]),
]):
    for pts, c in shapes:
        ax.fill(pts[:,0], pts[:,1], alpha=0.5, color=c, edgecolor='white')
    ax.axhline(0, color='white', ls='--', alpha=0.4)
    ax.axvline(0, color='white', ls='--', alpha=0.4)
    ax.set_xlim(-3.5, 3.5); ax.set_ylim(-4, 4)
    ax.set_aspect('equal'); ax.set_title(title)
    ax.grid(alpha=0.2)

plt.tight_layout(); plt.show()
print("Blue = original, Coral = reflected across one axis")
print("Green/Gold = reflected across the other axis or both")
print("Reflecting twice (both axes) = 180-degree rotation!")`,
      challenge: 'Reflect the shape across the line y=x (swap x and y coordinates). What happens? Can you combine this with a y-axis reflection to get a 90-degree rotation?',
      successHint: 'Reflection is one of the four fundamental symmetry operations (along with rotation, translation, and glide reflection). Every pattern in the Alhambra can be described as combinations of these four operations.',
    },
    {
      title: 'Rotation symmetry -- spinning shapes around a point',
      concept: `A square looks the same after a **90-degree rotation**. A regular hexagon looks the same after a **60-degree rotation**. This is **rotational symmetry**.

The **order** of rotation symmetry is how many times the shape maps onto itself in a full 360-degree turn:
- Equilateral triangle: order 3 (120-degree rotations)
- Square: order 4 (90-degree rotations)
- Regular hexagon: order 6 (60-degree rotations)
- Circle: infinite order (any rotation)

To rotate a point (x, y) by angle theta around the origin:
- new_x = x * cos(theta) - y * sin(theta)
- new_y = x * sin(theta) + y * cos(theta)

This formula comes from the **rotation matrix**, which we will study in Level 2. For now, notice that rotation preserves distances (nothing stretches) and preserves orientation (a clockwise spiral stays clockwise, unlike reflection).

The Alhambra patterns use rotation symmetry of orders 2, 3, 4, and 6. Order 5 is strikingly absent -- and for deep mathematical reasons that we will explore in Level 3 (the crystallographic restriction theorem).`,
      analogy: 'Put a book on a table and spin it 90 degrees. If the book is square, it looks the same. If it is rectangular, it only looks the same after 180 degrees (order 2). Rotation symmetry is about how many "snapshots" during a full spin look identical to the starting position.',
      storyConnection: 'The star patterns in the Alhambra often have 6-fold or 8-fold rotational symmetry. The central rosettes radiate outward like the petals of a flower. The artists achieved this by carefully dividing the circle into equal sectors and repeating the design in each sector. The rotation angle is always 360/n for some integer n.',
      checkQuestion: 'A five-pointed star has 5-fold rotational symmetry (order 5). But we said order 5 is absent from the Alhambra tilings. How can a star have 5-fold symmetry if pentagons cannot tile?',
      checkAnswer: 'A single star or polygon can have any rotational symmetry. The restriction applies to PERIODIC tilings (patterns that repeat by translation). A pattern that repeats in a grid cannot have 5-fold rotational symmetry because 72-degree rotations are incompatible with the translation lattice. Individual motifs can have 5-fold symmetry, but the tiling itself cannot. This distinction between local and global symmetry is crucial.',
      codeIntro: 'Rotate a triangle to create star patterns with different symmetry orders.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def rotate(pts, theta):
    """Rotate points by theta radians around origin."""
    c, s = np.cos(theta), np.sin(theta)
    R = np.array([[c, -s], [s, c]])
    return pts @ R.T

# A thin triangle (one "petal")
petal = np.array([[0, 0], [0.3, 1.5], [-0.3, 1.5], [0, 0]])

fig, axes = plt.subplots(1, 4, figsize=(14, 4))
orders = [3, 4, 6, 8]
colors_list = [
    ['#e74c3c','#3498db','#2ecc71'],
    ['#e74c3c','#f39c12','#3498db','#2ecc71'],
    ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3498db','#9b59b6'],
    ['#e74c3c','#e67e22','#f1c40f','#2ecc71',
     '#1abc9c','#3498db','#9b59b6','#e91e8f'],
]

for ax, n, cols in zip(axes, orders, colors_list):
    for i in range(n):
        theta = 2 * np.pi * i / n
        rotated = rotate(petal, theta)
        ax.fill(rotated[:,0], rotated[:,1], color=cols[i], alpha=0.7)
    ax.set_xlim(-2, 2); ax.set_ylim(-2, 2)
    ax.set_aspect('equal')
    ax.set_title(f'Order {n} ({360//n} deg)')
    ax.axis('off')

plt.suptitle('Rotational Symmetry: Repeat a Petal n Times')
plt.tight_layout(); plt.show()
print("Order 3: triangle star (120 deg rotation)")
print("Order 4: cross/plus pattern (90 deg rotation)")
print("Order 6: hexagonal star (60 deg rotation)")
print("Order 8: octagonal star (45 deg rotation)")`,
      challenge: 'Create order-5 and order-7 star patterns. They look beautiful, but remember: these symmetries CANNOT produce periodic tilings. Can you see why from the picture? (Hint: try to imagine copying and translating the pattern to fill a plane.)',
      successHint: 'Rotation symmetry is the second fundamental operation. Combined with reflection, it generates the dihedral groups -- the symmetry groups of regular polygons. These groups are the building blocks of all pattern classification.',
    },
    {
      title: 'Your first tile pattern -- combining operations',
      concept: `Now let us combine everything. A tiling pattern uses:
1. A **tile shape** (whose angles must satisfy the 360-degree rule)
2. **Translation** (to repeat the tile across the plane)
3. **Rotation** and/or **reflection** (to create visual richness within the repeating unit)

The simplest Alhambra-style pattern starts with a square tile, adds a motif inside it, and then tiles the plane by translation. But the Alhambra artists went further: they applied rotation and reflection to the motif within the tile, creating elaborate star patterns from simple starting shapes.

In the code below, we build a pattern step by step:
1. Create a simple motif (a quarter of a design)
2. Reflect it to fill half the tile
3. Rotate it to fill the whole tile
4. Translate the tile across a grid

This process -- start small, apply symmetry operations to build up complexity -- is how every pattern in the Alhambra was designed. It is also how crystallographers describe crystal structures, and how computer graphics engines generate procedural textures.`,
      analogy: 'Think of making a paper snowflake. You fold the paper (creating mirror lines), cut a small shape, then unfold. The small cut gets reflected and rotated into a complex symmetric pattern. The Alhambra artists did the same thing: design a small piece, then let symmetry operations multiply it into an intricate pattern.',
      storyConnection: 'The Alhambra contains at least 13 of the 17 possible wallpaper groups -- more than any other single building on Earth. Each group is a unique recipe of symmetry operations. The artists, working centuries before group theory was formalized, found nearly all possible combinations through geometric intuition and trial and error.',
      checkQuestion: 'If you design a motif and apply 4-fold rotation (order 4) plus two mirror lines, how many copies of the motif appear in one tile?',
      checkAnswer: 'Eight copies. The 4-fold rotation gives 4 copies, and reflecting across the mirror line doubles each one: 4 * 2 = 8. This is the dihedral group D4, the full symmetry group of a square. It has 8 elements: 4 rotations (0, 90, 180, 270 degrees) and 4 reflections (horizontal, vertical, and two diagonals). Each element produces one copy of the motif.',
      codeIntro: 'Build an Alhambra-style pattern: design a motif, apply symmetry, tile the plane.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def rotate(pts, theta):
    c, s = np.cos(theta), np.sin(theta)
    return pts @ np.array([[c, s], [-s, c]])

# Step 1: A small motif (quarter of a tile)
t = np.linspace(0, 1, 30)
motif_x = t * 0.5
motif_y = 0.15 * np.sin(t * np.pi) + t * 0.5
motif = np.column_stack([motif_x, motif_y])

fig, ax = plt.subplots(figsize=(8, 8))

# Tile the grid
for tx in range(-2, 5):
    for ty in range(-2, 5):
        offset = np.array([tx, ty])
        # Apply 4-fold rotation + reflection for each tile
        for k in range(4):
            theta = k * np.pi / 2
            rotated = rotate(motif, theta)
            reflected = rotated * np.array([1, -1])
            ax.plot(*(rotated + offset).T, color='#e74c3c',
                    lw=1.2, alpha=0.8)
            ax.plot(*(reflected + offset).T, color='#3498db',
                    lw=1.2, alpha=0.8)

ax.set_xlim(-0.5, 4.5); ax.set_ylim(-0.5, 4.5)
ax.set_aspect('equal')
ax.set_title('Alhambra-Style Pattern: Motif + Symmetry + Tiling')
ax.set_facecolor('#1a1a2e')
ax.grid(alpha=0.1)
plt.tight_layout(); plt.show()
print("One small curved motif, multiplied by symmetry:")
print("  4 rotations x 2 (reflection) = 8 copies per tile")
print("  Tiled across a 5x5 grid = 200 copies total")
print("  This is how the Alhambra achieves complexity from simplicity.")`,
      challenge: 'Change the motif shape (try a zigzag or a spiral instead of a sine curve). How does the overall pattern change? Try 6-fold rotation instead of 4-fold by changing the angle to pi/3 and placing tiles on a hexagonal grid.',
      successHint: 'You have now used all three fundamental operations: translation (grid), rotation (4-fold), and reflection (mirror). Every Alhambra pattern is built from these same ingredients in different combinations. In Level 2, we will formalize these operations using matrices and classify patterns systematically.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Angles, symmetry, and your first tessellations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for geometry and pattern visualization. Click to start.</p>
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
            diagram={[AngleTypesDiagram, TileAnglesDiagram, TessellationDiagram, SymmetryDiagram, CirclePropertiesDiagram, TransformationsDiagram][i] ? createElement([AngleTypesDiagram, TileAnglesDiagram, TessellationDiagram, SymmetryDiagram, CirclePropertiesDiagram, TransformationsDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
