import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import SymmetryDiagram from '../diagrams/SymmetryDiagram';
import SymmetryTypesMandala from '../diagrams/SymmetryTypesMandala';
import CirclePropertiesDiagram from '../diagrams/CirclePropertiesDiagram';
import TessellationDiagram from '../diagrams/TessellationDiagram';
import FibonacciSpiralDiagram from '../diagrams/FibonacciSpiralDiagram';
import TessellationMandala from '../diagrams/TessellationMandala';

export default function SandMandalaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Drawing with coordinates — Python turtle basics',
      concept: `In the story, Lobsang snapped chalk lines to create a precise grid before placing a single grain of sand. Every mandala begins with **coordinates** — a way to say exactly where each point belongs.

In Python, we use **Matplotlib** to draw on an x-y coordinate plane. The centre of a mandala sits at (0, 0). A point 3 units to the right and 2 units up is (3, 2). To draw a line, you give Python a list of x-values and a list of y-values.

The code below draws a simple cross and circle — the first marks a monk would make on the mandala table. \`plt.plot()\` connects points with lines, and \`np.cos()\` / \`np.sin()\` trace out a circle using angles from 0 to 2π.

**Key idea:** Every complex pattern is built from simple coordinates. The monks' chalk grid is a coordinate system.`,
      analogy: 'Coordinates are like a postal address for every point on the page. "3 units right, 2 units up" tells Python exactly where to place a dot, just as "House 3, Lane 2" tells a postman exactly where to deliver a letter. The grid is the map; coordinates are the addresses.',
      storyConnection: 'Lobsang stretched a chalk string from corner to corner of the table and snapped it to create lines. He did this again and again until the surface was covered in a precise grid. That grid IS a coordinate system — every intersection has an (x, y) address where sand will later be placed.',
      checkQuestion: 'If you plot a circle using np.cos(t) and np.sin(t) with t going from 0 to pi (instead of 0 to 2*pi), what shape do you get?',
      checkAnswer: 'You get a semicircle — the top half. The angle t from 0 to pi covers 0 to 180 degrees, which traces the upper arc. The full circle needs 0 to 2*pi (360 degrees). This is why trigonometric functions are essential for drawing curves: the angle range controls how much of the shape you draw.',
      codeIntro: 'Draw a centred cross and circle — the foundation lines of a mandala.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(1, 1, figsize=(6, 6))

# Draw the central cross (axis lines)
ax.plot([-5, 5], [0, 0], 'w-', linewidth=1, alpha=0.5)
ax.plot([0, 0], [-5, 5], 'w-', linewidth=1, alpha=0.5)

# Draw diagonal lines
ax.plot([-5, 5], [-5, 5], 'w-', linewidth=0.5, alpha=0.3)
ax.plot([-5, 5], [5, -5], 'w-', linewidth=0.5, alpha=0.3)

# Draw concentric circles using cos and sin
t = np.linspace(0, 2 * np.pi, 100)
for radius in [1, 2, 3, 4]:
    x = radius * np.cos(t)
    y = radius * np.sin(t)
    ax.plot(x, y, linewidth=1.5, alpha=0.7)

# Mark the centre
ax.plot(0, 0, 'o', color='gold', markersize=8)

ax.set_xlim(-5.5, 5.5)
ax.set_ylim(-5.5, 5.5)
ax.set_aspect('equal')
ax.set_title('Mandala Foundation: Grid + Circles', fontsize=13)
ax.grid(alpha=0.15)
plt.show()

print("4 concentric circles on a centred grid.")
print("np.cos(t), np.sin(t) trace circles.")
print("Every mandala starts with these guide lines.")`,
      challenge: 'Add 8 evenly spaced radial lines (every 45 degrees) instead of just 4. Hint: for each angle a in [0, 45, 90, ...], plot a line from (0,0) to (5*cos(a), 5*sin(a)). Remember to convert degrees to radians with np.radians().',
      successHint: 'You just created the skeleton of a mandala using coordinates. Every complex sacred pattern starts with this grid of lines and circles — the same geometry that Lobsang chalked onto the table.',
    },
    {
      title: 'Symmetry by code — mirror and rotate functions',
      concept: `Tenzin noticed that whatever appeared on the north side of the mandala appeared identically on the south, east, and west. This is **rotational symmetry** — the pattern looks the same after rotation by 90 degrees.

There are two basic symmetry operations:
- **Reflection** (mirror): flip a point across a line. Reflecting (x, y) across the y-axis gives (-x, y). Across the x-axis gives (x, -y).
- **Rotation**: spin a point around the centre by an angle. The formula is:
  x' = x*cos(θ) - y*sin(θ)
  y' = x*sin(θ) + y*cos(θ)

A mandala with **4-fold rotational symmetry** means: draw one quarter, then rotate it by 90, 180, and 270 degrees to fill the rest. You only need to design 1/4 of the pattern — the math generates the other three.

The code below draws a petal shape in one quadrant and then rotates it to create a 4-fold symmetric flower.`,
      analogy: 'Symmetry is like using a photocopier with a rotating tray. You draw one petal, place it on the copier, and print copies at 90, 180, and 270 degrees. Four copies of one design make a complete flower. The monks do not draw four identical petals — they draw one and the geometry of the mandala ensures the others match.',
      storyConnection: '"Why is everything the same on all four sides?" Tenzin asked. "Because the mandala represents the universe," said Lobsang. "And the universe has balance. Turn it any direction — it should look the same." The mathematical name for this balance is rotational symmetry, and we can build it with two lines of code: cos and sin.',
      checkQuestion: 'If you apply 6-fold rotational symmetry (rotating by 60 degrees each time), how many copies of the original motif do you need to draw?',
      checkAnswer: 'Just 1. You draw the original, then rotate it by 60, 120, 180, 240, and 300 degrees — that gives 6 copies total (including the original). 360/60 = 6. This is the symmetry of a snowflake. The more fold-symmetry you use, the smaller the piece you need to design by hand.',
      codeIntro: 'Draw one petal and rotate it to create a 4-fold symmetric pattern.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(1, 1, figsize=(6, 6))

# Define one petal shape (a curved wedge)
t = np.linspace(0, np.pi / 2, 50)
petal_x = np.sin(t) * np.cos(t) * 3
petal_y = np.sin(t) ** 2 * 3

def rotate(x, y, angle_deg):
    """Rotate points by angle (degrees) around origin."""
    a = np.radians(angle_deg)
    xr = x * np.cos(a) - y * np.sin(a)
    yr = x * np.sin(a) + y * np.cos(a)
    return xr, yr

# Draw the petal at 4 rotations (4-fold symmetry)
colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12']
for i, angle in enumerate([0, 90, 180, 270]):
    rx, ry = rotate(petal_x, petal_y, angle)
    ax.fill(rx, ry, color=colors[i], alpha=0.6)
    ax.plot(rx, ry, color='white', linewidth=1)

# Add concentric guide circles
tc = np.linspace(0, 2 * np.pi, 100)
for r in [1, 2, 3]:
    ax.plot(r * np.cos(tc), r * np.sin(tc),
            'w-', linewidth=0.5, alpha=0.3)

ax.set_xlim(-4, 4); ax.set_ylim(-4, 4)
ax.set_aspect('equal')
ax.set_title('4-Fold Rotational Symmetry', fontsize=13)
plt.show()

print("One petal shape, rotated 4 times.")
print("The rotate() function uses cos/sin to spin points.")`,
      challenge: 'Change the symmetry from 4-fold to 8-fold. You will need angles [0, 45, 90, 135, 180, 225, 270, 315]. Also make the petal thinner by changing the angular range to pi/4 instead of pi/2.',
      successHint: 'You now have a rotate() function that takes any shape and spins it to any angle. This single function is the engine behind every rotationally symmetric pattern — from mandalas to snowflakes to turbine blades.',
    },
    {
      title: 'Regular polygons — computing interior angles',
      concept: `The mandala contains squares, hexagons, and other regular polygons nested inside its circles. A **regular polygon** has all sides equal and all angles equal.

The key formula: the **interior angle** of a regular polygon with n sides is:

  interior angle = (n - 2) * 180 / n

- Triangle (n=3): (3-2)*180/3 = 60 degrees
- Square (n=4): (4-2)*180/4 = 90 degrees
- Hexagon (n=6): (6-2)*180/6 = 120 degrees

To draw a regular polygon in code, place n points equally spaced around a circle. The angle between consecutive vertices is 360/n degrees. This connects polygons to circles — a polygon is just a circle sampled at n evenly spaced points.

As n increases, the polygon looks more and more like a circle. A 100-sided polygon is visually indistinguishable from a circle. This is why mandalas blend polygons and circles seamlessly — they are the same geometry at different resolutions.`,
      analogy: 'Drawing a regular polygon is like placing guests equally spaced around a circular dinner table. With 4 guests you get a square arrangement, with 6 a hexagon. The table is the circle; the guests are the vertices. More guests means a closer approximation to the round table itself.',
      storyConnection: 'The mandala had diamond patterns within diamond patterns, gates at the four cardinal directions (a square), and lotus petals arranged in rings. Each of these is a regular polygon inscribed in a circle. The monks did not freehand these shapes — they placed points at precise angles around guide circles.',
      checkQuestion: 'Why can you tile a floor with regular triangles, squares, and hexagons, but not regular pentagons?',
      checkAnswer: 'For tiles to fill a floor without gaps, the angles meeting at each vertex must add up to exactly 360 degrees. Triangles: 6 x 60 = 360. Squares: 4 x 90 = 360. Hexagons: 3 x 120 = 360. But pentagons have interior angles of 108 degrees, and 360/108 = 3.33... — not a whole number. You cannot fit a whole number of pentagons around a point, so gaps are inevitable.',
      codeIntro: 'Draw regular polygons inscribed in circles and compute their interior angles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 4, figsize=(12, 3))

polygons = [
    (3, 'Triangle', '#e74c3c'),
    (4, 'Square', '#3498db'),
    (6, 'Hexagon', '#2ecc71'),
    (8, 'Octagon', '#f39c12'),
]

for ax, (n, name, color) in zip(axes, polygons):
    # Vertices equally spaced around a unit circle
    angles = np.linspace(0, 2 * np.pi, n + 1)
    x = np.cos(angles)
    y = np.sin(angles)

    # Draw the polygon
    ax.fill(x, y, color=color, alpha=0.3)
    ax.plot(x, y, color=color, linewidth=2)

    # Draw inscribing circle
    t = np.linspace(0, 2 * np.pi, 100)
    ax.plot(np.cos(t), np.sin(t), 'w--', linewidth=0.5,
            alpha=0.4)

    interior = (n - 2) * 180 / n
    ax.set_title(f'{name}\\\n{interior:.0f} per angle',
                 fontsize=10)
    ax.set_xlim(-1.3, 1.3); ax.set_ylim(-1.3, 1.3)
    ax.set_aspect('equal'); ax.axis('off')

plt.suptitle('Regular Polygons Inscribed in Circles',
             fontsize=13, y=1.02)
plt.tight_layout()
plt.show()

print("Interior angle = (n-2) * 180 / n")
for n, name, _ in polygons:
    print(f"  {name} ({n} sides): {(n-2)*180/n:.1f} degrees")`,
      challenge: 'Draw a 12-sided polygon (dodecagon) and a 36-sided polygon on the same plot. At what value of n can you no longer distinguish the polygon from a perfect circle by eye?',
      successHint: 'Regular polygons are circles with finite resolution. Every mandala ring is built from polygons — and the monks chose the number of sides to match the symbolic meaning of each ring.',
    },
    {
      title: 'Tessellation checker — does this shape tile?',
      concept: `The mandala floor at Tawang monastery was covered with tiles — patterns that fit together with no gaps and no overlaps. This is called a **tessellation**.

For regular polygons, the tiling rule is simple: the interior angles meeting at each vertex must sum to exactly 360 degrees.

Only three regular polygons tessellate on their own:
- **Equilateral triangle** (60 degrees): 6 x 60 = 360
- **Square** (90 degrees): 4 x 90 = 360
- **Regular hexagon** (120 degrees): 3 x 120 = 360

No other regular polygon can tile by itself. But **combinations** work: octagons (135 degrees) paired with squares (90 degrees) give 135 + 135 + 90 = 360.

The code below checks which regular polygons tile and visualises a tessellation. The check is pure arithmetic: does 360 divide evenly by the interior angle?`,
      analogy: 'Tessellation is like fitting puzzle pieces together on an infinite table. Some shapes snap together perfectly (squares, hexagons). Others always leave awkward gaps (pentagons). The test is simple: can you fit a whole number of pieces around every corner point? If the angles do not add up to exactly 360, you will always have gaps or overlaps.',
      storyConnection: 'The monastery floor tiles, the diamond patterns within diamond patterns, the interlocking gate designs — all are tessellations. The monks understood intuitively what mathematicians proved formally: only certain shapes tile perfectly. The mandala itself is a finite tessellation within a circle.',
      checkQuestion: 'A soccer ball uses pentagons and hexagons together. Is that a tessellation?',
      checkAnswer: 'Not of a flat plane — pentagons and hexagons cannot tile a flat surface together. But they DO tile a sphere. A soccer ball is a spherical tessellation (a truncated icosahedron): 12 pentagons and 20 hexagons. The curvature of the sphere absorbs the angle deficit that would cause gaps on a flat surface. This is a deep connection between geometry and topology.',
      codeIntro: 'Check which regular polygons tessellate and visualise a square tiling.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Check which regular polygons tessellate
print("=== Tessellation Check for Regular Polygons ===")
print()
for n in range(3, 13):
    angle = (n - 2) * 180 / n
    tiles_at_vertex = 360 / angle
    tiles = "YES" if abs(tiles_at_vertex - round(tiles_at_vertex)) < 0.001 else "no"
    print(f"  {n}-gon: interior angle = {angle:.1f}, "
          f"fit at vertex = {tiles_at_vertex:.2f} -> {tiles}")

# Visualise a hexagonal tessellation
fig, ax = plt.subplots(1, 1, figsize=(7, 6))
colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12',
          '#9b59b6', '#1abc9c']

def draw_hexagon(cx, cy, size, color, ax):
    angles = np.linspace(0, 2 * np.pi, 7)
    x = cx + size * np.cos(angles)
    y = cy + size * np.sin(angles)
    ax.fill(x, y, color=color, alpha=0.4)
    ax.plot(x, y, color='white', linewidth=1)

size = 1
dx = size * 1.5
dy = size * np.sqrt(3)
ci = 0
for row in range(-3, 4):
    for col in range(-3, 4):
        cx = col * dx
        cy = row * dy + (col % 2) * dy / 2
        draw_hexagon(cx, cy, size * 0.98,
                     colors[ci % len(colors)], ax)
        ci += 1

ax.set_xlim(-5, 5); ax.set_ylim(-5, 5)
ax.set_aspect('equal'); ax.axis('off')
ax.set_title('Hexagonal Tessellation', fontsize=13)
plt.show()

print("\\\nOnly 3 regular polygons tile alone: 3, 4, 6 sides.")`,
      challenge: 'Create a tessellation using octagons and squares together. Place octagons on a grid and fill the gaps with small squares. Hint: an octagon has interior angle 135 degrees. Two octagons plus one square at a vertex: 135 + 135 + 90 = 360.',
      successHint: 'Tessellation is where art meets arithmetic. The 360-degree rule is a simple but powerful constraint that determines which patterns can fill space — from monastery floors to honeycombs to crystal structures.',
    },
    {
      title: 'Spiral patterns — golden angle and Fibonacci',
      concept: `Look at the centre of a sunflower, the arrangement of seeds in a pine cone, or the spiral of a nautilus shell. These all follow the **Fibonacci sequence**: 1, 1, 2, 3, 5, 8, 13, 21, ...

Each number is the sum of the two before it. The ratio between consecutive Fibonacci numbers converges to the **golden ratio** φ = 1.618...

The **golden angle** is 360 / φ² = 137.5 degrees. If you place each new point by rotating 137.5 degrees from the last one and moving slightly outward, you get the most efficient packing — no two points line up in a straight row, and the pattern fills space evenly.

This appears in the mandala too. The lotus petals spiral outward following similar angular spacing. Nature and sacred geometry converge on the same mathematics because both solve the same problem: how to fill circular space efficiently.

The code below generates a Fibonacci spiral pattern and a golden-angle phyllotaxis pattern.`,
      analogy: 'The golden angle is like the most democratic seating arrangement at a round table. If each new guest sits 137.5 degrees from the last, no one blocks anyone else view. Any other angle eventually creates clusters and gaps. Nature discovered this optimal angle billions of years before mathematicians named it.',
      storyConnection: 'Tenzin noticed that "a small lotus at the centre was echoed by a larger lotus at the second ring, echoed by an even larger one at the outer edge." This self-similar spiral growth follows the same golden-ratio scaling that governs sunflower seeds and nautilus shells. The mandala encodes natural mathematics.',
      checkQuestion: 'If you use 137.0 degrees instead of 137.5, does the pattern still look uniform?',
      checkAnswer: 'No. Even a 0.5-degree difference ruins the pattern. At 137.0 degrees, visible radial lines appear (seeds clump into rows). At exactly 137.507... degrees (the true golden angle), the pattern is perfectly uniform with no preferred direction. This extreme sensitivity is why the golden angle is special — it is the most irrational angle, meaning it avoids all rational alignments.',
      codeIntro: 'Generate a phyllotaxis pattern using the golden angle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# --- Golden angle phyllotaxis ---
golden_angle = 137.508  # degrees
n_points = 300

angles = np.arange(n_points) * np.radians(golden_angle)
radii = np.sqrt(np.arange(n_points))  # sqrt spacing

x = radii * np.cos(angles)
y = radii * np.sin(angles)

ax1.scatter(x, y, c=np.arange(n_points), cmap='plasma',
            s=15, alpha=0.8)
ax1.set_aspect('equal'); ax1.axis('off')
ax1.set_title('Golden Angle (137.5) — Uniform', fontsize=11)

# --- Compare with 137.0 degrees (NOT golden) ---
bad_angle = 137.0
angles2 = np.arange(n_points) * np.radians(bad_angle)
x2 = radii * np.cos(angles2)
y2 = radii * np.sin(angles2)

ax2.scatter(x2, y2, c=np.arange(n_points), cmap='plasma',
            s=15, alpha=0.8)
ax2.set_aspect('equal'); ax2.axis('off')
ax2.set_title('137.0 — Visible Lines', fontsize=11)

plt.suptitle('Phyllotaxis: The Golden Angle', fontsize=13)
plt.tight_layout()
plt.show()

print("Left: golden angle 137.5 — perfectly uniform fill.")
print("Right: 137.0 — visible radial lines appear.")
print()
print("The 0.5 degree difference is dramatic!")`,
      challenge: 'Try angles of 90, 120, and 180 degrees. What patterns do they create? Why do they form straight lines or stars instead of uniform spirals? What makes 137.5 special compared to all other angles?',
      successHint: 'The golden angle creates the most efficient packing in circular space. From sunflower seeds to mandala lotus rings, this angle appears wherever nature or art needs to fill a circle evenly.',
    },
    {
      title: 'Your first mandala — combining rotational symmetry',
      concept: `Now you have all the tools: coordinates, rotation, polygons, and spirals. Time to combine them into a complete mandala.

A mandala is built in **concentric rings**, each ring containing a repeated motif. The construction process:

1. Draw guide circles at specific radii
2. For each ring, design one motif (petal, gate, diamond)
3. Rotate the motif n times around the centre
4. Move to the next ring and repeat with a different motif

The **order of symmetry** (how many times you rotate) can differ per ring. The inner ring might have 4-fold symmetry (square gates), while the outer ring has 8-fold (lotus petals). As long as the outer order is a multiple of the inner order, the symmetry nests cleanly.

The code below builds a 3-ring mandala: an inner diamond ring, a middle petal ring, and an outer pointed ring — all with 8-fold rotational symmetry.`,
      analogy: 'Building a mandala in code is like making a layered cake on a turntable. You pipe one decoration, rotate the turntable 45 degrees, pipe again, and repeat 8 times. Then you move to a wider ring and do the same with a different piping tip. Each ring is a rotated repetition of one design.',
      storyConnection: 'Over five days, Tenzin watched the mandala emerge. It grew outward from the centre in perfect symmetry. This is exactly our algorithm: start at the centre, build ring by ring outward, rotating each motif to fill the circle. The monks algorithm and our code algorithm are the same — only the medium differs (sand vs pixels).',
      checkQuestion: 'Why do traditional mandalas usually have 4-fold or 8-fold symmetry rather than, say, 7-fold?',
      checkAnswer: 'Practical and symbolic reasons. 4-fold aligns with the four cardinal directions (NSEW) which have deep significance in Buddhist cosmology. 8-fold adds the diagonal directions and relates to the Eightfold Path. Mathematically, 4 and 8 divide 360 into neat integer angles (90 and 45 degrees), making construction with a compass and straightedge easier. 7-fold symmetry requires irrational angles (360/7 = 51.43...) which are harder to construct by hand.',
      codeIntro: 'Build a complete 3-ring mandala with 8-fold rotational symmetry.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(1, 1, figsize=(7, 7))

def rotate(x, y, angle_deg):
    a = np.radians(angle_deg)
    return x*np.cos(a) - y*np.sin(a), x*np.sin(a) + y*np.cos(a)

n_fold = 8  # 8-fold rotational symmetry
base_angles = [i * 360 / n_fold for i in range(n_fold)]

# Ring 1 (inner): small diamonds at radius 1.2
for angle in base_angles:
    dx = np.array([0, 0.3, 0, -0.3, 0])
    dy = np.array([1.0, 1.2, 1.5, 1.2, 1.0])
    rx, ry = rotate(dx, dy, angle)
    ax.fill(rx, ry, color='#e74c3c', alpha=0.6)
    ax.plot(rx, ry, 'w-', linewidth=0.8)

# Ring 2 (middle): petals at radius 2.5
t = np.linspace(0, 1, 30)
for angle in base_angles:
    px = 0.5 * np.sin(t * np.pi)
    py = 2.0 + t * 1.2
    rx, ry = rotate(px, py, angle)
    ax.fill(rx, ry, color='#3498db', alpha=0.5)
    ax.plot(rx, ry, 'w-', linewidth=0.8)

# Ring 3 (outer): pointed arcs at radius 4
for angle in base_angles:
    ox = np.array([0, 0.4, 0, -0.4, 0])
    oy = np.array([3.5, 4.0, 4.8, 4.0, 3.5])
    rx, ry = rotate(ox, oy, angle)
    ax.fill(rx, ry, color='#f39c12', alpha=0.5)
    ax.plot(rx, ry, 'w-', linewidth=0.8)

# Guide circles
tc = np.linspace(0, 2 * np.pi, 100)
for r in [1, 2, 3.5, 5]:
    ax.plot(r*np.cos(tc), r*np.sin(tc), 'w-',
            linewidth=0.5, alpha=0.25)

ax.plot(0, 0, 'o', color='gold', markersize=6)
ax.set_xlim(-6, 6); ax.set_ylim(-6, 6)
ax.set_aspect('equal'); ax.axis('off')
ax.set_title('Your First Mandala — 8-Fold Symmetry',
             fontsize=13)
plt.show()

print("3 rings, 8-fold symmetry, 24 motifs total.")
print("You designed 3 shapes; rotation created the rest.")`,
      challenge: 'Add a 4th ring with a different motif — perhaps small circles or triangles at radius 5.5. Try changing n_fold to 12 for 12-fold symmetry. How does the visual density change?',
      successHint: 'You have built a complete mandala from scratch using coordinates, rotation, and concentric rings. The same three tools — coordinates, symmetry operations, and layered construction — underlie every sacred geometric pattern in the world.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior math or coding experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for geometry and pattern generation. Click to start.</p>
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
            diagram={[SymmetryDiagram, SymmetryTypesMandala, CirclePropertiesDiagram, TessellationDiagram, FibonacciSpiralDiagram, TessellationMandala][i] ? createElement([SymmetryDiagram, SymmetryTypesMandala, CirclePropertiesDiagram, TessellationDiagram, FibonacciSpiralDiagram, TessellationMandala][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
