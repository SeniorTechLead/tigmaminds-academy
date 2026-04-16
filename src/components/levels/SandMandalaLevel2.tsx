import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import TransformationMatrixDiagram from '../diagrams/TransformationMatrixDiagram';
import TransformationsDiagram from '../diagrams/TransformationsDiagram';
import TessellationDiagram from '../diagrams/TessellationDiagram';
import FractalTreeDiagram from '../diagrams/FractalTreeDiagram';
import FibonacciSpiralDiagram from '../diagrams/FibonacciSpiralDiagram';
import TessellationMandala from '../diagrams/TessellationMandala';

export default function SandMandalaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Transformation matrices — translate, rotate, reflect as math',
      concept: `In Level 1, you used a rotate() function with cos and sin. Now we formalise this: every geometric transformation (rotation, reflection, scaling) can be written as a **matrix multiplication**.

A 2D rotation by angle θ is the matrix:

\`\`\`
R = | cosθ  -sinθ |
    | sinθ   cosθ |
\`\`\`

To rotate a point (x, y), you compute R × [x, y]^T. This is **linear algebra** — the language of all geometric transformations.

A reflection across the x-axis:
\`\`\`
M_x = | 1   0 |
      | 0  -1 |
\`\`\`

A scaling by factor s:
\`\`\`
S = | s  0 |
    | 0  s |
\`\`\`

Why use matrices instead of functions? Because matrices **compose**: to rotate then reflect, you multiply R × M. The result is a single matrix that does both operations at once. This makes complex symmetry operations fast and elegant.

The code below implements all three transformations as NumPy matrix operations and applies them to a petal shape.`,
      analogy: 'A transformation matrix is like a recipe card for rearranging furniture. "Rotate 90 degrees" is one card. "Mirror left-right" is another. You can combine cards by stacking them: "rotate then mirror" becomes a single combined instruction. Matrices let you stack any number of transformations into one operation.',
      storyConnection: 'The monks built the mandala with precise symmetry operations — rotating a petal design to fill each quadrant, reflecting motifs across the cardinal axes. Each of these hand operations corresponds exactly to a 2x2 matrix. The mathematics formalises what the monks did intuitively with string and compass.',
      checkQuestion: 'What happens if you rotate by 90 degrees and then rotate by 90 degrees again? What single matrix is equivalent?',
      checkAnswer: 'Two 90-degree rotations equal one 180-degree rotation. In matrix terms: R(90) x R(90) = R(180). The 180-degree rotation matrix is [[-1, 0], [0, -1]], which simply negates both coordinates: (x, y) becomes (-x, -y). This is the same as reflecting through the origin.',
      codeIntro: 'Apply rotation, reflection, and scaling as matrix multiplications.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Define a petal shape as a set of points (2 x N matrix)
t = np.linspace(0, np.pi, 50)
petal = np.array([
    0.4 * np.sin(t),           # x
    1.0 + 0.8 * np.sin(t)      # y
])

# Transformation matrices
def rotation_matrix(deg):
    r = np.radians(deg)
    return np.array([[np.cos(r), -np.sin(r)],
                     [np.sin(r),  np.cos(r)]])

def reflection_x():
    return np.array([[1, 0], [0, -1]])

def scale_matrix(s):
    return np.array([[s, 0], [0, s]])

fig, axes = plt.subplots(1, 3, figsize=(12, 4))

# 1. Rotation
ax = axes[0]
for angle in range(0, 360, 60):
    rotated = rotation_matrix(angle) @ petal
    ax.fill(rotated[0], rotated[1], alpha=0.4)
    ax.plot(rotated[0], rotated[1], 'w-', linewidth=0.5)
ax.set_title('Rotation (60 steps)', fontsize=10)
ax.set_aspect('equal'); ax.axis('off')

# 2. Reflection
ax = axes[1]
ax.fill(petal[0], petal[1], color='#3498db', alpha=0.5)
reflected = reflection_x() @ petal
ax.fill(reflected[0], reflected[1], color='#e74c3c', alpha=0.5)
ax.axhline(0, color='white', linewidth=0.5, alpha=0.5)
ax.set_title('Reflection (across x-axis)', fontsize=10)
ax.set_aspect('equal'); ax.axis('off')

# 3. Scaling
ax = axes[2]
for s in [0.5, 0.75, 1.0, 1.25, 1.5]:
    scaled = scale_matrix(s) @ petal
    ax.plot(scaled[0], scaled[1], linewidth=1.5, alpha=0.7)
ax.set_title('Scaling (0.5x to 1.5x)', fontsize=10)
ax.set_aspect('equal'); ax.axis('off')

plt.suptitle('Transformation Matrices', fontsize=13)
plt.tight_layout()
plt.show()

print("Every transformation = a 2x2 matrix multiplication.")
print("Rotation: [[cos, -sin], [sin, cos]]")
print("Reflection: [[1, 0], [0, -1]]")
print("Scaling: [[s, 0], [0, s]]")`,
      challenge: 'Create a shear matrix [[1, k], [0, 1]] where k = 0.5. Apply it to the petal. What does shearing do to the shape? Is shearing a symmetry operation? (Hint: does it preserve distances?)',
      successHint: 'Transformation matrices are the foundation of computer graphics, robotics, and physics. Every game engine, CAD tool, and animation package represents transformations as matrices.',
    },
    {
      title: 'Composing transformations — combining operations',
      concept: `The real power of matrices emerges when you **compose** them. To rotate by 45 degrees then reflect across the x-axis, you multiply:

  combined = M_reflect @ R(45)

The result is a single matrix that performs both operations. Order matters: rotating then reflecting is different from reflecting then rotating.

For the mandala, this is crucial. A **dihedral group** D_n describes all symmetries of a regular n-gon: n rotations and n reflections. For a square (D_4), there are 8 symmetry operations:
- 4 rotations: 0, 90, 180, 270 degrees
- 4 reflections: across horizontal, vertical, and both diagonals

By composing any two of these operations, you always get another operation in the group. This **closure** property is what makes it a mathematical group.

The code below generates all 8 symmetries of a square (D_4) by composing rotation and reflection matrices, then applies them to a motif.`,
      analogy: 'Composing transformations is like giving directions. "Turn right, then go forward, then turn left" can be simplified to "go diagonally." Each step is a transformation; the composite is a shortcut. Matrix multiplication finds the shortcut automatically.',
      storyConnection: 'The monks did not draw each of the 8 repetitions of a motif independently. They drew one, then applied the 8 symmetry operations of the square. Lobsang chalk grid — with its horizontal, vertical, and diagonal lines — marks exactly the reflection axes of D_4. The grid IS the symmetry group made visible.',
      checkQuestion: 'If you compose a rotation R(90) with itself 4 times, what do you get?',
      checkAnswer: 'R(90)^4 = R(360) = the identity matrix [[1,0],[0,1]]. Rotating 4 times by 90 degrees brings you back to the start. This is why D_4 has exactly 4 rotational symmetries: after 4 steps you cycle back. The identity matrix does nothing — it is the "do nothing" transformation, and every symmetry group includes it.',
      codeIntro: 'Generate all 8 symmetries of a square (dihedral group D_4).',
      code: `import numpy as np
import matplotlib.pyplot as plt

def R(deg):
    r = np.radians(deg)
    return np.array([[np.cos(r), -np.sin(r)],
                     [np.sin(r),  np.cos(r)]])

def reflect_x():
    return np.array([[1, 0], [0, -1]])

# All 8 symmetries of D_4
symmetries = []
for angle in [0, 90, 180, 270]:
    symmetries.append(('R' + str(angle), R(angle)))
for angle in [0, 90, 180, 270]:
    symmetries.append(('M+R' + str(angle),
                       reflect_x() @ R(angle)))

# Define an asymmetric motif (so we can see the effect)
motif = np.array([
    [0, 0.8, 1.2, 0.6, 0],
    [0, 0.3, 1.0, 1.4, 0.8]
])

fig, axes = plt.subplots(2, 4, figsize=(12, 6))
colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12',
          '#9b59b6', '#1abc9c', '#e67e22', '#34495e']

for ax, (name, M), color in zip(axes.flat, symmetries,
                                 colors):
    transformed = M @ motif
    ax.fill(transformed[0], transformed[1], color=color,
            alpha=0.5)
    ax.plot(transformed[0], transformed[1], 'w-',
            linewidth=1)
    ax.plot([0], [0], 'wo', markersize=4)
    ax.set_xlim(-2, 2); ax.set_ylim(-2, 2)
    ax.set_aspect('equal'); ax.axis('off')
    ax.set_title(name, fontsize=9)

plt.suptitle('D_4: All 8 Symmetries of a Square',
             fontsize=13)
plt.tight_layout()
plt.show()

print("D_4 has 8 elements: 4 rotations + 4 reflections.")
print("Top row: pure rotations.")
print("Bottom row: reflection composed with rotation.")`,
      challenge: 'Build the composition table: for each pair of symmetries A and B, compute A @ B and identify which of the 8 symmetries the result matches. Print a full 8x8 table. Verify that the table has the group property: every row and column contains each symmetry exactly once.',
      successHint: 'You have just computed a group multiplication table — one of the most important structures in abstract algebra. Every crystal, every tiling, every mandala is governed by one of these finite symmetry groups.',
    },
    {
      title: 'Tessellation generator — automated tiling',
      concept: `In Level 1, you checked which regular polygons tessellate. Now we automate the process: given a base tile and a set of translation vectors, fill a region of the plane.

A tessellation is defined by:
1. A **base tile** — any shape (need not be regular)
2. **Translation vectors** — two independent directions that, when applied repeatedly, cover the plane

For a square tiling, the vectors are (1, 0) and (0, 1). For a hexagonal tiling, they are (1, 0) and (0.5, √3/2). The base tile is copied to every lattice point defined by integer combinations of these vectors.

The mathematical structure is a **lattice** — an infinite grid of points generated by two basis vectors. There are exactly 5 distinct lattice types in 2D (the Bravais lattices): square, rectangular, centered rectangular, hexagonal, and oblique.

The code generates tessellations from custom tiles using lattice translations.`,
      analogy: 'A tessellation generator is like a wallpaper printing roller. The roller has one tile carved into it (the base tile). As it rolls across the wall in two directions, it stamps identical copies at regular intervals (the lattice vectors). Different rollers and rolling directions produce different wallpaper patterns — but the mechanism is always the same: one tile plus two directions.',
      storyConnection: 'The monastery floor where the mandala was built was itself a tessellation — tiles fitted together seamlessly. The monks worked on top of one geometric pattern (the floor) while creating another (the mandala). Both are tessellations; they differ only in the base tile and the lattice structure.',
      checkQuestion: 'Can any triangle tessellate the plane?',
      checkAnswer: 'Yes. Any triangle — not just equilateral — can tessellate. Rotate a triangle 180 degrees and place it next to the original; the two form a parallelogram. Parallelograms always tessellate (they have a natural 2-vector lattice). Since any triangle pairs into a parallelogram, any triangle tessellates. This is one of the most surprising results in tiling theory.',
      codeIntro: 'Generate tessellations using lattice vectors and a custom base tile.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# --- Square lattice tessellation ---
# Base tile: a simple arrow shape
tile = np.array([[0,0], [0.8,0], [1,0.5],
                 [0.8,1], [0,1], [0.2,0.5], [0,0]]).T

v1 = np.array([1, 0])   # lattice vector 1
v2 = np.array([0, 1])   # lattice vector 2

for i in range(-3, 4):
    for j in range(-3, 4):
        offset = i * v1 + j * v2
        shifted = tile + offset.reshape(2, 1)
        c = plt.cm.Set3((i + j) % 8 / 8)
        ax1.fill(shifted[0], shifted[1], color=c, alpha=0.6)
        ax1.plot(shifted[0], shifted[1], 'w-', linewidth=0.5)

ax1.set_xlim(-2.5, 3.5); ax1.set_ylim(-2.5, 3.5)
ax1.set_aspect('equal'); ax1.axis('off')
ax1.set_title('Square Lattice Tiling', fontsize=11)

# --- Hexagonal lattice tessellation ---
# Base tile: hexagon
angles = np.linspace(0, 2 * np.pi, 7)
hex_tile = np.array([np.cos(angles), np.sin(angles)]) * 0.58

hv1 = np.array([1, 0])
hv2 = np.array([0.5, np.sqrt(3)/2])

for i in range(-3, 4):
    for j in range(-3, 4):
        offset = i * hv1 + j * hv2
        shifted = hex_tile + offset.reshape(2, 1)
        c = plt.cm.Pastel1((i * 3 + j) % 9 / 9)
        ax2.fill(shifted[0], shifted[1], color=c, alpha=0.6)
        ax2.plot(shifted[0], shifted[1], 'w-', linewidth=0.5)

ax2.set_xlim(-2.5, 3.5); ax2.set_ylim(-2.5, 3.5)
ax2.set_aspect('equal'); ax2.axis('off')
ax2.set_title('Hexagonal Lattice Tiling', fontsize=11)

plt.suptitle('Lattice-Based Tessellation', fontsize=13)
plt.tight_layout()
plt.show()

print("Any tile + 2 lattice vectors = tessellation.")
print("Square lattice: v1=(1,0), v2=(0,1)")
print("Hex lattice: v1=(1,0), v2=(0.5, sqrt(3)/2)")`,
      challenge: 'Create a custom tile shaped like the letter L. Define appropriate lattice vectors so the L-tiles interlock without gaps. Hint: pairs of L-tiles can form a rectangle, and rectangles always tile.',
      successHint: 'You can now generate any lattice tessellation automatically. The 5 Bravais lattice types and their associated tilings underlie crystallography, materials science, and the decorative arts across every culture.',
    },
    {
      title: 'Fractal trees — recursive branching',
      concept: `Tenzin saw that the mandala patterns repeated at different sizes: "a branch looks like a small copy of the whole tree." This is the essence of a **fractal** — a shape that contains smaller copies of itself.

A fractal tree is the simplest example. The algorithm:
1. Draw a trunk (a line segment)
2. At the tip, split into two branches, each shorter by a ratio (e.g. 0.7x)
3. Each branch splits again, and again, recursively

This is **recursion** — a function that calls itself. In code:
\`\`\`
def branch(length, angle, depth):
    draw the segment
    if depth > 0:
        branch(length * 0.7, angle + 30, depth - 1)
        branch(length * 0.7, angle - 30, depth - 1)
\`\`\`

Each call to \`branch()\` creates two more calls. At depth 10, you get 2^10 = 1024 branch tips. The tree is **self-similar** — zoom into any fork and it looks like a smaller copy of the whole tree.

The branching angle and shrink ratio control the tree shape. Real trees follow similar rules, tuned by species-specific growth patterns.`,
      analogy: 'Recursion is like a story within a story within a story. "Once upon a time, a monk told a story about a monk who told a story about a monk..." Each level is a smaller copy of the one above. A fractal tree is a branch that grows branches that grow branches — the same instruction at every scale.',
      storyConnection: '"It is like a tree," Tenzin said. "A branch looks like a small copy of the whole tree." Lobsang smiled: "You are learning to see." Tenzin had discovered self-similarity — the defining property of fractals. The mandala lotus petals echoing at three scales are a finite version of this infinite recursive pattern.',
      checkQuestion: 'If a fractal tree has branching ratio 0.5 (each branch is half the parent) and depth 8, how long is the smallest branch compared to the trunk?',
      checkAnswer: '0.5^8 = 1/256 of the trunk length. If the trunk is 256 pixels, the smallest branches are 1 pixel. This exponential shrinkage is why fractals can encode enormous complexity in a simple rule: 8 levels of branching produce 256 branch tips from one trunk, and the rule is just "split and shrink."',
      codeIntro: 'Generate a fractal tree using recursive branching.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(1, 1, figsize=(7, 7))

def draw_branch(x, y, length, angle, depth, ax):
    """Recursively draw a fractal tree branch."""
    if depth == 0 or length < 0.5:
        return
    # End point of this branch
    x2 = x + length * np.cos(np.radians(angle))
    y2 = y + length * np.sin(np.radians(angle))

    # Color: brown trunk fading to green tips
    green = min(1.0, depth / 10)
    color = (0.4 * green, 0.3 + 0.5 * (1 - green),
             0.2 * green)
    width = max(0.5, depth * 0.5)

    ax.plot([x, x2], [y, y2], color=color,
            linewidth=width, solid_capstyle='round')

    # Branch into two sub-branches
    shrink = 0.7
    spread = 25
    draw_branch(x2, y2, length * shrink,
                angle + spread, depth - 1, ax)
    draw_branch(x2, y2, length * shrink,
                angle - spread, depth - 1, ax)

# Grow the tree from the bottom centre
draw_branch(0, 0, 8, 90, 9, ax)

ax.set_xlim(-15, 15); ax.set_ylim(-2, 22)
ax.set_aspect('equal'); ax.axis('off')
ax.set_title('Fractal Tree — 9 Levels of Recursion',
             fontsize=13)
plt.show()

print("Rule: split into 2 branches, each 0.7x shorter.")
print(f"Total branch tips: 2^9 = {2**9}")
print("One simple rule creates organic complexity.")`,
      challenge: 'Change the branching from 2-way to 3-way (add a middle branch going straight). Adjust the shrink factor to 0.6 so it does not get too dense. How does the tree shape change?',
      successHint: 'You have written your first recursive algorithm. Recursion is one of the most powerful ideas in computer science — it lets a simple rule generate unbounded complexity. Fractal trees, snowflakes, and mandala patterns all emerge from recursive self-similarity.',
    },
    {
      title: 'Koch snowflake — fractal dimension',
      concept: `The Koch snowflake starts with an equilateral triangle. For each side:
1. Divide it into 3 equal parts
2. Replace the middle third with an outward-pointing equilateral triangle (without its base)
3. Repeat on every new side

After infinite iterations, the Koch snowflake has:
- **Infinite perimeter** — the boundary gets 4/3 longer at each step, so it grows without bound
- **Finite area** — it fits inside a circle

This paradox is captured by its **fractal dimension**. Normal curves have dimension 1, surfaces have dimension 2. The Koch snowflake has dimension:

  D = log(4) / log(3) = 1.262...

It is "more than a line but less than a surface." Fractal dimension measures how much space a curve fills — the Koch curve fills more space than a straight line but less than a solid area.

The code generates the Koch snowflake at multiple iteration levels.`,
      analogy: 'Imagine crumpling a piece of string into a ball. The string is 1-dimensional, but the crumpled ball occupies 3D space. Its effective dimension is somewhere between 1 and 3. The Koch snowflake is the mathematical version of this: a curve so convoluted that it fills more space than a simple line, giving it a fractional dimension.',
      storyConnection: 'The mandala diamond patterns within diamond patterns — "like looking into a mirror reflected in another mirror" — describe a finite version of the Koch construction. Each ring of the mandala adds detail at a smaller scale, just as each Koch iteration adds triangular bumps at a smaller scale. The mandala is a bounded fractal.',
      checkQuestion: 'The Koch snowflake has infinite perimeter but finite area. Is that possible with physical objects?',
      checkAnswer: 'No physical object has truly infinite perimeter — atoms have finite size, so detail cannot continue below ~0.1 nanometers. But coastlines approximate this: measuring Britain coastline with a 100km ruler gives ~2400km; with a 1km ruler, ~12,400km. Shorter rulers find more detail, and the measured length keeps growing. Richardson discovered this in 1961; Mandelbrot used it to define fractal dimension. The Koch snowflake is the idealised version of this real phenomenon.',
      codeIntro: 'Generate the Koch snowflake at increasing levels of detail.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def koch_segment(p1, p2, depth):
    """Recursively subdivide a segment into Koch curve."""
    if depth == 0:
        return [p1, p2]

    # Divide into thirds
    a = p1
    b = p1 + (p2 - p1) / 3
    d = p1 + (p2 - p1) * 2 / 3
    e = p2

    # Peak of the equilateral triangle on the middle third
    mid = (b + d) / 2
    perp = np.array([-(d[1]-b[1]), d[0]-b[0]])
    c = mid + perp * np.sqrt(3) / 2

    # Recurse on each of the 4 sub-segments
    pts = []
    for seg in [(a, b), (b, c), (c, d), (d, e)]:
        pts.extend(koch_segment(seg[0], seg[1], depth-1))
    return pts

# Starting triangle
angles = [np.pi/2, np.pi/2 + 2*np.pi/3,
          np.pi/2 + 4*np.pi/3, np.pi/2]
tri = [np.array([np.cos(a), np.sin(a)]) for a in angles]

fig, axes = plt.subplots(1, 4, figsize=(14, 3.5))
for ax, depth in zip(axes, [0, 1, 3, 5]):
    pts = []
    for i in range(3):
        seg = koch_segment(tri[i], tri[i+1], depth)
        pts.extend(seg)
    pts = np.array(pts)
    ax.fill(pts[:, 0], pts[:, 1], color='#3498db',
            alpha=0.3)
    ax.plot(pts[:, 0], pts[:, 1], color='#3498db',
            linewidth=0.8)
    n_sides = 3 * 4**depth
    ax.set_title(f'Depth {depth}\
{n_sides} sides',
                 fontsize=9)
    ax.set_aspect('equal'); ax.axis('off')

plt.suptitle('Koch Snowflake — Fractal Dimension 1.26',
             fontsize=13)
plt.tight_layout()
plt.show()

print(f"Fractal dimension = log(4)/log(3) = "
      f"{np.log(4)/np.log(3):.4f}")
print("More than a line (1), less than a surface (2).")`,
      challenge: 'Compute the perimeter and area at each depth level (0 through 6). The perimeter formula is P_n = P_0 * (4/3)^n. The area converges to 8/5 of the original triangle area. Plot both on the same chart with dual y-axes. Which grows and which converges?',
      successHint: 'Fractal dimension is one of the most counterintuitive ideas in mathematics — a curve with infinite length enclosing finite area. This concept revolutionised how we measure coastlines, clouds, blood vessels, and any natural boundary with detail at every scale.',
    },
    {
      title: 'Mandala with layers — multi-ring symmetric pattern',
      concept: `Time to combine everything from Level 2 into a rich, multi-layered mandala using transformation matrices, tessellation logic, and fractal detail.

The architecture:
1. **Centre motif**: a small symmetric flower using rotation matrices
2. **Inner ring**: polygon tiles arranged in a circle
3. **Middle ring**: fractal-like recursive petals (2 levels of self-similarity)
4. **Outer ring**: a Koch-style border

Each ring uses a different symmetry order, but they are all multiples of a common base (e.g., 4-fold inner, 8-fold middle, 16-fold outer). This ensures visual coherence — the symmetry axes of inner rings align with outer rings.

The code constructs this layered mandala entirely from matrix transformations applied to simple base shapes.`,
      analogy: 'A layered mandala is like a musical composition with multiple instruments. The bass plays a simple 4-beat pattern (inner ring). The melody plays an 8-note pattern over the same time (middle ring). The harmony adds 16-note flourishes (outer ring). Different rhythms, but all multiples of the base beat, so they synchronise perfectly. Visual symmetry works the same way.',
      storyConnection: 'Over five days, the monks built the mandala ring by ring, from centre outward. Each ring added complexity but maintained the underlying symmetry. Our code does the same in seconds: define the base shapes, apply transformation matrices for each ring, and watch a complete mandala emerge from pure mathematics.',
      checkQuestion: 'If the inner ring has 6-fold symmetry and the outer ring has 8-fold, will the axes align?',
      checkAnswer: 'No. 6 and 8 share a common factor of 2 (GCD = 2), so only 2 of the 6 inner axes align with outer axes. For perfect alignment, the outer order should be a multiple of the inner: 6 inner with 12 or 18 outer. Or use 8 inner with 16 outer. The mandala appears harmonious when all ring orders share a large common factor.',
      codeIntro: 'Build a layered mandala using transformation matrices.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(1, 1, figsize=(8, 8))

def R(deg):
    r = np.radians(deg)
    return np.array([[np.cos(r), -np.sin(r)],
                     [np.sin(r),  np.cos(r)]])

# Centre: 8-fold star
for i in range(8):
    star = np.array([[0, 0.2, 0, -0.2, 0],
                     [0, 0.3, 0.8, 0.3, 0]])
    transformed = R(i * 45) @ star
    ax.fill(transformed[0], transformed[1],
            color='#e74c3c', alpha=0.6)

# Inner ring: 8 diamonds at radius 1.5
for i in range(8):
    d = np.array([[0, 0.25, 0, -0.25, 0],
                  [1.2, 1.5, 2.0, 1.5, 1.2]])
    transformed = R(i * 45) @ d
    ax.fill(transformed[0], transformed[1],
            color='#9b59b6', alpha=0.5)

# Middle ring: 16 petals at radius 3
t = np.linspace(0, 1, 30)
for i in range(16):
    px = 0.3 * np.sin(t * np.pi)
    py = 2.3 + t * 1.2
    petal = np.array([px, py])
    transformed = R(i * 22.5) @ petal
    ax.fill(transformed[0], transformed[1],
            color='#3498db', alpha=0.4)

# Outer ring: 32 small spikes at radius 4.5
for i in range(32):
    spike = np.array([[0, 0.12, 0, -0.12, 0],
                      [4.0, 4.3, 4.8, 4.3, 4.0]])
    transformed = R(i * 11.25) @ spike
    ax.fill(transformed[0], transformed[1],
            color='#f39c12', alpha=0.5)

# Guide circles
tc = np.linspace(0, 2 * np.pi, 200)
for r in [1, 2, 3.5, 5]:
    ax.plot(r*np.cos(tc), r*np.sin(tc), 'w-',
            linewidth=0.3, alpha=0.2)

ax.set_xlim(-6, 6); ax.set_ylim(-6, 6)
ax.set_aspect('equal'); ax.axis('off')
ax.set_title('Layered Mandala — 8/16/32-Fold Symmetry',
             fontsize=13)
plt.show()

print("4 layers: 8-fold centre, 8 diamonds, 16 petals, 32 spikes.")
print("All orders are multiples of 8 -> perfect axis alignment.")`,
      challenge: 'Add colour gradients: make petals transition from red at the centre to blue at the edge using a colour interpolation. Then add a fractal Koch border around the outer circle (depth 2 or 3).',
      successHint: 'You have built a complete mandala using transformation matrices, nested symmetry orders, and layered construction. This is the same mathematical framework used in computer graphics to render complex symmetric patterns in games, films, and architectural design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for transformation geometry and fractal generation. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[TransformationMatrixDiagram, TransformationsDiagram, TessellationDiagram, FractalTreeDiagram, FibonacciSpiralDiagram, TessellationMandala][i] ? createElement([TransformationMatrixDiagram, TransformationsDiagram, TessellationDiagram, FractalTreeDiagram, FibonacciSpiralDiagram, TessellationMandala][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
