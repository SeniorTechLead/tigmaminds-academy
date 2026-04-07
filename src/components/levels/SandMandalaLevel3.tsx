import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import SymmetryOperationsDiagram from '../diagrams/SymmetryOperationsDiagram';
import TessellationDiagram from '../diagrams/TessellationDiagram';
import TessellationMandala from '../diagrams/TessellationMandala';
import FractalTreeDiagram from '../diagrams/FractalTreeDiagram';
import FibonacciSpiralDiagram from '../diagrams/FibonacciSpiralDiagram';
import SymmetryTypesMandala from '../diagrams/SymmetryTypesMandala';

export default function SandMandalaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Group theory intro — what makes a symmetry group',
      concept: `In Level 2, you computed all 8 symmetries of a square (D_4). Now we ask: what is the **mathematical structure** that makes D_4 a "group"?

A **group** is a set of elements with an operation (like composition) that satisfies four axioms:

1. **Closure**: composing any two symmetries gives another symmetry in the set
2. **Associativity**: (A ∘ B) ∘ C = A ∘ (B ∘ C)
3. **Identity**: there exists an element (the "do nothing" transformation) such that I ∘ A = A ∘ I = A
4. **Inverse**: every element has an inverse (an "undo" transformation)

For D_n (the dihedral group of a regular n-gon), the group has 2n elements: n rotations and n reflections. The rotation subgroup is **cyclic** — applying the smallest rotation repeatedly generates all rotations.

This matters because group theory classifies ALL possible symmetries. There are only a finite number of distinct symmetry groups in 2D. Every mandala, every crystal, every wallpaper pattern belongs to one of these groups.

The code below verifies the four group axioms for D_4 by exhaustive computation.`,
      analogy: 'A symmetry group is like a set of dance moves where every combination of two moves is also a valid move, every move has an "undo" move, and there is a "stand still" move. The group axioms guarantee that no matter how many moves you chain together, you never leave the dance floor — you always end up at a valid position.',
      storyConnection: 'Lobsang chalk grid defined the symmetry axes. The mandala four-fold repetition used exactly the operations of D_4. Group theory gives this intuitive "balance" a precise mathematical name and proves that D_4 is one of only a handful of possible plane symmetry types. The monks chose their symmetry from a finite menu dictated by mathematics.',
      checkQuestion: 'D_3 has 6 elements (symmetries of an equilateral triangle). D_4 has 8. What is the pattern for D_n?',
      checkAnswer: 'D_n has 2n elements: n rotations (by multiples of 360/n degrees, including the identity at 0) and n reflections (across n distinct axes of symmetry). For example, D_6 (hexagon) has 12 elements: 6 rotations and 6 reflections. The dihedral group grows linearly with n, even though the patterns they generate become visually much more complex.',
      codeIntro: 'Verify the four group axioms for D_4 by computing the full multiplication table.',
      code: `import numpy as np

def R(deg):
    r = np.radians(deg)
    return np.array([[np.cos(r), -np.sin(r)],
                     [np.sin(r),  np.cos(r)]])

def Mx():
    return np.array([[1, 0], [0, -1]])

# Generate all D_4 elements
elements = {}
for i in range(4):
    elements[f'r{i*90}'] = R(i * 90)
    elements[f'm{i*90}'] = Mx() @ R(i * 90)

names = list(elements.keys())
matrices = list(elements.values())

def find_match(M, matrices, names):
    for name, mat in zip(names, matrices):
        if np.allclose(M, mat, atol=1e-10):
            return name
    return '??'

# Axiom 1: CLOSURE — every product is in the group
print("=== Axiom 1: Closure ===")
closed = True
for a_name, A in elements.items():
    for b_name, B in elements.items():
        product = A @ B
        match = find_match(product, matrices, names)
        if match == '??':
            closed = False
print(f"All {len(names)**2} products land in the group: "
      f"{'YES' if closed else 'NO'}")

# Axiom 2: ASSOCIATIVITY (inherent for matrices)
print("\\n=== Axiom 2: Associativity ===")
print("Matrix multiplication is always associative.")

# Axiom 3: IDENTITY
print("\\n=== Axiom 3: Identity ===")
I = R(0)
identity_works = all(
    np.allclose(I @ M, M) and np.allclose(M @ I, M)
    for M in matrices)
print(f"r0 is identity for all elements: {identity_works}")

# Axiom 4: INVERSES
print("\\n=== Axiom 4: Inverses ===")
for name, M in elements.items():
    inv = np.linalg.inv(M)
    inv_name = find_match(inv, matrices, names)
    print(f"  {name:5s} inverse = {inv_name}")

print(f"\\nD_4 is a group with {len(names)} elements.")`,
      challenge: 'Build the full 8x8 multiplication table and print it as a grid. Verify two additional properties: (1) every row and column of the table contains each element exactly once (a Latin square), and (2) the rotation subgroup {r0, r90, r180, r270} is itself a group (a subgroup).',
      successHint: 'You have verified that D_4 satisfies all four group axioms by exhaustive computation. Group theory is the mathematical backbone of symmetry — it classifies what types of symmetry are possible and how they relate to each other.',
    },
    {
      title: 'Wallpaper group classification — the 17 types',
      concept: `A wallpaper pattern is a design that tiles the entire plane using translations in two directions, possibly combined with rotations and reflections. In 1891, Fedorov proved that there are exactly **17 distinct wallpaper groups** — 17 fundamentally different ways to tile a plane with symmetry.

Every tiling pattern ever created — Islamic geometric art, Escher's drawings, bathroom tiles, mandala floor patterns — belongs to one of these 17 groups.

The 17 groups are classified by their symmetry content:
- Which **rotation orders** are present (1, 2, 3, 4, or 6 — no 5 or 7!)
- Whether **reflections** are present
- Whether **glide reflections** are present (a reflection + a translation along the mirror line)

The notation uses symbols like p1, p2, pm, pg, cm, p4m, p6m, etc. For example:
- **p1**: only translations (no rotations or reflections)
- **p4m**: 4-fold rotations + reflections (the symmetry of a square grid)
- **p6m**: 6-fold rotations + reflections (the symmetry of a honeycomb)

The code generates representative tilings for several wallpaper groups and identifies their symmetry content.`,
      analogy: 'The 17 wallpaper groups are like the 17 possible card games you can play with a standard deck under certain rules. You might invent millions of specific patterns, just as you can invent millions of card games, but each one must follow one of 17 fundamental symmetry structures. The theorem says: "these 17 are ALL there are, and here is the proof that no 18th exists."',
      storyConnection: 'The monastery floor tiles, the mandala border patterns, the textile designs of Tawang — each is an instance of one of the 17 wallpaper groups. The monks who decorated the monastery over centuries unknowingly explored a finite mathematical classification. Some wallpaper groups appear across unconnected cultures (Islamic, Buddhist, Celtic) because mathematics, not culture, dictates the menu.',
      checkQuestion: 'Why is 5-fold rotational symmetry impossible in wallpaper groups?',
      checkAnswer: 'A wallpaper pattern must tile the plane with a repeating lattice. The lattice points form a regular grid. For a rotation to be compatible with a lattice, the rotation angle must produce lattice points that coincide with existing lattice points. Only rotations of order 1, 2, 3, 4, and 6 can do this (because only 1, 2, 3, 4, and 6 divide 360 in ways compatible with a parallelogram lattice). 5-fold rotations produce points that never align with any lattice — they are incompatible with translational periodicity. This is the crystallographic restriction theorem.',
      codeIntro: 'Generate examples of different wallpaper groups and analyse their symmetry content.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))

# --- p4m: square lattice with reflections ---
ax = axes[0]
for i in range(-4, 5):
    for j in range(-4, 5):
        # Small square with reflected triangle
        x0, y0 = i, j
        sq = np.array([[0,1,1,0,0], [0,0,1,1,0]])
        ax.plot(sq[0]+x0, sq[1]+y0, 'w-', linewidth=0.3)
        # Diagonal creates mirror symmetry
        if (i + j) % 2 == 0:
            tri = np.array([[0,1,0,0],[0,0,1,0]])
            ax.fill(tri[0]+x0, tri[1]+y0, color='#3498db',
                    alpha=0.5)
        else:
            tri = np.array([[0,1,1,0],[0,0,1,0]])
            ax.fill(tri[0]+x0, tri[1]+y0, color='#e74c3c',
                    alpha=0.5)
ax.set_xlim(-2, 4); ax.set_ylim(-2, 4)
ax.set_aspect('equal'); ax.axis('off')
ax.set_title('p4m\\n4-fold + mirrors', fontsize=10)

# --- p6m: hexagonal lattice ---
ax = axes[1]
for i in range(-4, 5):
    for j in range(-4, 5):
        cx = i + j * 0.5
        cy = j * np.sqrt(3) / 2
        angles = np.linspace(0, 2*np.pi, 7)
        hx = cx + 0.55 * np.cos(angles)
        hy = cy + 0.55 * np.sin(angles)
        c = plt.cm.Set2((i*3+j) % 8 / 8)
        ax.fill(hx, hy, color=c, alpha=0.5)
        ax.plot(hx, hy, 'w-', linewidth=0.3)
ax.set_xlim(-1.5, 4); ax.set_ylim(-1.5, 4)
ax.set_aspect('equal'); ax.axis('off')
ax.set_title('p6m\\n6-fold + mirrors', fontsize=10)

# --- pg: glide reflection ---
ax = axes[2]
motif_up = np.array([[0,0.3,0.5,0.2,0],
                      [0,0.4,1.0,0.6,0]])
motif_dn = np.array([[0,0.3,0.5,0.2,0],
                      [0,-0.4,-1.0,-0.6,0]])
for i in range(-4, 5):
    for j in range(-2, 5):
        x0 = i
        y0 = j * 1.0
        if j % 2 == 0:
            m = motif_up.copy()
            m[0] += x0; m[1] += y0
            ax.fill(m[0], m[1], color='#2ecc71', alpha=0.5)
        else:
            m = motif_dn.copy()
            m[0] += x0 + 0.5; m[1] += y0
            ax.fill(m[0], m[1], color='#f39c12', alpha=0.5)
ax.set_xlim(-1, 4); ax.set_ylim(-1, 4)
ax.set_aspect('equal'); ax.axis('off')
ax.set_title('pg\\nglide reflection', fontsize=10)

plt.suptitle('3 of the 17 Wallpaper Groups', fontsize=13)
plt.tight_layout()
plt.show()

print("Only 17 wallpaper groups exist in 2D.")
print("  p4m: 4-fold rotation + mirror lines (bathroom tiles)")
print("  p6m: 6-fold rotation + mirror lines (honeycomb)")
print("  pg:  glide reflection only (footprints in sand)")`,
      challenge: 'Implement a wallpaper group classifier: given a pattern, detect which rotational symmetries and reflections are present, and output the wallpaper group name. Test it on the three patterns above.',
      successHint: 'The 17 wallpaper groups theorem is one of the most beautiful results in mathematics: a complete, finite classification of all possible planar symmetries. Every decorative pattern in human history fits into this framework.',
    },
    {
      title: 'Penrose tilings — aperiodic tessellations',
      concept: `All the tessellations so far have been **periodic** — they repeat with a regular lattice. In 1974, Roger Penrose discovered tiles that cover the plane but **never repeat**. These are **aperiodic tilings**.

Penrose tilings use just two tile shapes (kites and darts, or thick and thin rhombi) with specific matching rules. The resulting pattern:
- Fills the entire plane with no gaps
- Has **5-fold rotational symmetry** locally (impossible in periodic tilings!)
- Never repeats — no finite patch appears at regular intervals
- Contains every finite patch infinitely often, but at irregular intervals

The ratio of kites to darts converges to the **golden ratio** φ = 1.618...

Penrose tilings connect to quasicrystals — real materials discovered in 1984 that have 5-fold symmetry in their diffraction patterns. Dan Shechtman won the 2011 Nobel Prize for this discovery, which was initially rejected as impossible.

The code generates a Penrose tiling using the deflation (subdivision) method.`,
      analogy: 'A Penrose tiling is like a conversation that never quite repeats. Periodic tiles are like a song chorus: same melody, same interval, predictable. Penrose tiles are like jazz improvisation: familiar themes recur, but the exact sequence never repeats. You recognise motifs, but you can never predict exactly what comes next.',
      storyConnection: 'The mandala was destroyed after completion — an act of impermanence. Penrose tilings embody a different kind of impermanence: they have no period, no cycle, no repetition. Every region is unique. Yet like the mandala, they possess deep internal order — not the rigid order of repetition, but the subtle order of self-similarity and the golden ratio.',
      checkQuestion: 'If Penrose tilings never repeat, how can they fill the infinite plane without gaps?',
      checkAnswer: 'The matching rules ensure that tiles always fit together locally, even though no global repeating unit exists. The subdivision method guarantees coverage: you can always subdivide any patch into a finer Penrose tiling, and this can continue to arbitrary size. The proof that no gaps arise comes from showing that the deflation rules are self-consistent — every configuration allowed by the matching rules can be extended indefinitely. It is like a jigsaw puzzle where every piece always has a valid neighbor.',
      codeIntro: 'Generate a Penrose tiling using rhombus deflation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

phi = (1 + np.sqrt(5)) / 2  # golden ratio

def subdivide_thin(A, B, C):
    """Subdivide a thin rhombus into smaller Penrose tiles."""
    P = A + (B - A) / phi
    return [('thick', C, P, B), ('thin', P, C, A)]

def subdivide_thick(A, B, C):
    """Subdivide a thick rhombus into smaller tiles."""
    Q = B + (A - B) / phi
    R = B + (C - B) / phi
    return [('thick', Q, R, B), ('thick', R, Q, A),
            ('thin', R, C, A)]

# Start with a ring of thick rhombi (decagon)
tiles = []
for i in range(10):
    a1 = (2*i - 1) * np.pi / 10
    a2 = (2*i + 1) * np.pi / 10
    A = np.array([0, 0])
    B = np.array([np.cos(a1), np.sin(a1)])
    C = np.array([np.cos(a2), np.sin(a2)])
    if i % 2 == 0:
        tiles.append(('thick', A, B, C))
    else:
        tiles.append(('thick', A, C, B))

# Subdivide 5 times
for _ in range(5):
    new_tiles = []
    for kind, A, B, C in tiles:
        if kind == 'thick':
            new_tiles.extend(subdivide_thick(A, B, C))
        else:
            new_tiles.extend(subdivide_thin(A, B, C))
    tiles = new_tiles

fig, ax = plt.subplots(1, 1, figsize=(8, 8))
for kind, A, B, C in tiles:
    tri = np.array([A, B, C, A]).T
    color = '#e74c3c' if kind == 'thick' else '#3498db'
    ax.fill(tri[0], tri[1], color=color, alpha=0.4,
            edgecolor='white', linewidth=0.2)

ax.set_xlim(-1.6, 1.6); ax.set_ylim(-1.6, 1.6)
ax.set_aspect('equal'); ax.axis('off')
ax.set_title('Penrose Tiling (5 subdivisions)', fontsize=13)
plt.show()

n_thick = sum(1 for k,_,_,_ in tiles if k == 'thick')
n_thin = len(tiles) - n_thick
print(f"Thick: {n_thick}, Thin: {n_thin}")
print(f"Ratio: {n_thick/max(1,n_thin):.4f}")
print(f"Golden ratio: {phi:.4f}")`,
      challenge: 'Colour the tiles based on their orientation angle instead of type. Use a colour map to visualise the angular distribution. Do certain orientations dominate, or are they uniformly distributed?',
      successHint: 'Penrose tilings shattered the assumption that order requires periodicity. They opened the door to quasicrystals, aperiodic order, and a deeper understanding of what "pattern" means in mathematics and nature.',
    },
    {
      title: 'L-systems — formal grammars for fractals',
      concept: `An **L-system** (Lindenmayer system) is a formal grammar that generates fractal patterns through string rewriting. Invented by biologist Aristid Lindenmayer in 1968 to model plant growth.

An L-system has:
- An **alphabet** of symbols (e.g., F, +, -)
- A **starting string** (axiom), e.g., "F"
- **Production rules**, e.g., F → F+F-F-F+F
- **Interpretation**: F = draw forward, + = turn left, - = turn right

At each iteration, every symbol in the string is replaced according to the rules. After n iterations, the string is interpreted as drawing instructions.

Examples:
- **Koch curve**: F → F+F--F+F (angle = 60)
- **Sierpinski triangle**: A → B-A-B, B → A+B+A (angle = 60)
- **Dragon curve**: X → X+YF+, Y → -FX-Y (angle = 90)

L-systems are powerful because a simple grammar generates enormous complexity. The Koch snowflake rule has 9 characters but produces a curve with fractal dimension 1.26 after just a few iterations.`,
      analogy: 'An L-system is like a recipe that refers to itself. "To make bread: make dough, fold it, make bread again with the folded dough." Each iteration produces a more complex result from the same instruction. After 5 iterations of "fold and repeat," you have 2^5 = 32 layers — a croissant. L-systems create fractal geometry the same way: simple rules, iterated, produce unbounded complexity.',
      storyConnection: 'The mandala pattern rules — "repeat this motif at each ring, scaled down" — are an L-system in spirit. The monks production rule was: "at each ring, draw the lotus motif, then move outward and repeat at a larger scale." L-systems formalise this intuitive construction into a precise grammar that a computer can execute.',
      checkQuestion: 'The Dragon curve L-system produces a curve that tiles the plane when four copies are arranged around a point. Why is this surprising?',
      checkAnswer: 'The Dragon curve is generated by a simple two-rule grammar, yet it fills space so efficiently that four rotated copies tile the plane perfectly with no gaps or overlaps. This is surprising because the curve itself looks irregular and chaotic — it does not obviously suggest a tiling. The connection between a string rewriting rule and a space-filling tiling is deep and non-obvious, linking formal language theory to geometry.',
      codeIntro: 'Implement an L-system engine and generate three classic fractals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def apply_rules(axiom, rules, iterations):
    """Apply L-system production rules n times."""
    s = axiom
    for _ in range(iterations):
        s = ''.join(rules.get(c, c) for c in s)
    return s

def draw_lsystem(instructions, angle_deg, step=1):
    """Interpret L-system string as turtle graphics."""
    x, y, heading = 0, 0, 90
    positions = [(x, y)]
    stack = []
    for c in instructions:
        if c == 'F' or c == 'A' or c == 'B':
            x += step * np.cos(np.radians(heading))
            y += step * np.sin(np.radians(heading))
            positions.append((x, y))
        elif c == '+':
            heading += angle_deg
        elif c == '-':
            heading -= angle_deg
        elif c == '[':
            stack.append((x, y, heading))
        elif c == ']':
            x, y, heading = stack.pop()
            positions.append((None, None))
            positions.append((x, y))
    return positions

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))

# Koch curve
s = apply_rules('F', {'F': 'F+F--F+F'}, 4)
pts = draw_lsystem(s, 60, step=0.5)
xs = [p[0] for p in pts if p[0] is not None]
ys = [p[1] for p in pts if p[1] is not None]
axes[0].plot(xs, ys, color='#3498db', linewidth=0.5)
axes[0].set_aspect('equal'); axes[0].axis('off')
axes[0].set_title('Koch Curve\\nF->F+F--F+F', fontsize=9)

# Sierpinski
s = apply_rules('A', {'A':'B-A-B', 'B':'A+B+A'}, 6)
pts = draw_lsystem(s, 60, step=0.5)
xs = [p[0] for p in pts if p[0] is not None]
ys = [p[1] for p in pts if p[1] is not None]
axes[1].plot(xs, ys, color='#2ecc71', linewidth=0.3)
axes[1].set_aspect('equal'); axes[1].axis('off')
axes[1].set_title('Sierpinski Triangle\\nA->B-A-B',
                   fontsize=9)

# Plant
s = apply_rules('X', {'X':'F+[[X]-X]-F[-FX]+X',
                       'F':'FF'}, 5)
pts = draw_lsystem(s, 25, step=0.8)
ax = axes[2]
px, py = [pts[0][0]], [pts[0][1]]
for p in pts[1:]:
    if p[0] is None:
        ax.plot(px, py, color='#2ecc71', linewidth=0.4)
        px, py = [], []
    else:
        px.append(p[0]); py.append(p[1])
if px: ax.plot(px, py, color='#2ecc71', linewidth=0.4)
ax.set_aspect('equal'); ax.axis('off')
ax.set_title('Plant\\nX->F+[[X]-X]-F[-FX]+X', fontsize=9)

plt.suptitle('L-Systems: Grammars That Draw', fontsize=13)
plt.tight_layout()
plt.show()

print("3 fractals from 3 short rules.")
print("L-systems: formal grammars -> geometry.")`,
      challenge: 'Design your own L-system rule that generates a mandala-like pattern. Hint: use a rule that creates rotational symmetry, like starting with "F+F+F+F" (a square) and replacing F with a more complex sequence.',
      successHint: 'L-systems bridge formal language theory and geometry. A handful of characters — a tiny grammar — generates infinite fractal complexity. This is the power of recursive production rules.',
    },
    {
      title: 'Iterated function systems — Sierpinski triangle, Barnsley fern',
      concept: `An **Iterated Function System** (IFS) generates fractals using a different approach: instead of subdivision rules, it uses **random selection** from a set of affine transformations.

The algorithm (the "chaos game"):
1. Start with a random point
2. Randomly choose one of the transformations (with specified probabilities)
3. Apply it to get a new point
4. Plot the new point
5. Repeat thousands of times

For the Sierpinski triangle, the three transformations are:
- f1: shrink toward vertex A (scale 0.5, translate to A)
- f2: shrink toward vertex B
- f3: shrink toward vertex C

Each is chosen with probability 1/3. After thousands of iterations, the plotted points converge to the Sierpinski triangle — a fractal with dimension log(3)/log(2) = 1.585.

The Barnsley fern uses 4 transformations with different probabilities, producing a remarkably realistic fern shape. The stem transformation has 1% probability, the leaflet transformations have high probability.

IFS fractals are **attractors** — regardless of starting point, the iteration converges to the same shape.`,
      analogy: 'The chaos game is like a blindfolded person taking steps toward randomly chosen landmarks. After thousands of steps, their path traces out a precise geometric shape — even though each individual step was random. The deterministic shape emerges from probabilistic choices because the contracting transformations pull all paths toward the same attractor.',
      storyConnection: 'The mandala emerges grain by grain, each grain placed according to a rule. An IFS fractal emerges point by point, each point placed according to a randomly chosen transformation. Both processes build complex patterns from simple, repeated local actions. The mandala is a finite IFS — a fixed number of transformations applied a fixed number of times.',
      checkQuestion: 'If you change the probabilities in the Barnsley fern IFS (e.g., make the stem 50% instead of 1%), does the shape change?',
      checkAnswer: 'The mathematical attractor (the set of points) does not change — it is determined by the transformations, not the probabilities. But the visual density changes dramatically. With 50% stem probability, you would see a thick stem and sparse leaves. The probabilities control how "filled in" each region appears, not what regions exist. This is the difference between the attractor (a mathematical set) and its visual rendering (a density map).',
      codeIntro: 'Generate Sierpinski triangle and Barnsley fern using the chaos game.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
np.random.seed(42)

# --- Sierpinski Triangle (chaos game) ---
vertices = np.array([[0, 0], [1, 0], [0.5, np.sqrt(3)/2]])
point = np.array([0.5, 0.25])
points = []

for _ in range(30000):
    v = vertices[np.random.randint(3)]
    point = (point + v) / 2  # midpoint
    points.append(point.copy())

pts = np.array(points)
ax1.scatter(pts[:, 0], pts[:, 1], s=0.1, c='#3498db',
            alpha=0.5)
ax1.set_aspect('equal'); ax1.axis('off')
ax1.set_title(f'Sierpinski Triangle\\n'
              f'D = log(3)/log(2) = {np.log(3)/np.log(2):.3f}',
              fontsize=10)

# --- Barnsley Fern ---
# 4 affine transforms: [a,b,c,d,e,f,prob]
fern = [
    [0, 0, 0, 0.16, 0, 0, 0.01],       # stem
    [0.85, 0.04, -0.04, 0.85, 0, 1.6, 0.85],  # main
    [0.2, -0.26, 0.23, 0.22, 0, 1.6, 0.07],   # left
    [-0.15, 0.28, 0.26, 0.24, 0, 0.44, 0.07],  # right
]

point = np.array([0.0, 0.0])
points = []
probs = [f[6] for f in fern]
cum_probs = np.cumsum(probs)

for _ in range(50000):
    r = np.random.random()
    for i, cp in enumerate(cum_probs):
        if r <= cp:
            a, b, c, d, e, f, _ = fern[i]
            x_new = a * point[0] + b * point[1] + e
            y_new = c * point[0] + d * point[1] + f
            point = np.array([x_new, y_new])
            break
    points.append(point.copy())

pts = np.array(points)
ax2.scatter(pts[:, 0], pts[:, 1], s=0.1, c='#2ecc71',
            alpha=0.3)
ax2.set_aspect('equal'); ax2.axis('off')
ax2.set_title('Barnsley Fern\\n4 affine transforms',
              fontsize=10)

plt.suptitle('Iterated Function Systems', fontsize=13)
plt.tight_layout()
plt.show()

print("Sierpinski: 3 transforms, equal probability.")
print("Fern: 4 transforms, unequal probability.")
print("Both converge to a fractal attractor.")`,
      challenge: 'Modify the Sierpinski chaos game to use 4 vertices (a square) with the midpoint rule. What shape emerges? Now change the ratio from 1/2 to 2/3 (move 2/3 of the way toward the vertex). How does the pattern change?',
      successHint: 'IFS fractals demonstrate that randomness and determinism are not opposites. Random choices from a fixed set of contracting transformations always converge to the same deterministic attractor. This principle underlies fractal image compression, procedural graphics, and models of natural growth.',
    },
    {
      title: 'Crystallographic restriction theorem',
      concept: `We have seen that wallpaper groups allow only rotational symmetries of order 1, 2, 3, 4, and 6. No 5, no 7, no 8. Why?

The **crystallographic restriction theorem** proves this. The argument:

1. A lattice is a set of points generated by two basis vectors: L = {m*v1 + n*v2} for all integers m, n.
2. If the lattice has a rotation of order k, then rotating any lattice point by 360/k degrees must land on another lattice point.
3. For this to work, 2*cos(360/k) must be an integer. (This comes from the rotation matrix having integer entries when acting on lattice vectors.)
4. The only solutions: cos(360/k) = {-1, -1/2, 0, 1/2, 1}, giving k = {1, 2, 3, 4, 6}.

This is why pentagons cannot tile periodically, why quasicrystals were shocking when discovered, and why the mandala monks chose 4-fold symmetry — it is one of only five options compatible with a regular lattice.

The code below verifies the theorem computationally: for each rotation order from 2 to 12, it checks whether a compatible lattice exists.`,
      analogy: 'Imagine arranging identical circular coins on a table so they form a repeating grid pattern. You can arrange them in rows (4-fold), or in a honeycomb (6-fold), or in triangular close-packing (3-fold). But try to arrange them in a 5-fold star pattern that repeats — it is impossible. The coins always leave gaps or overlaps. The crystallographic restriction is the mathematical proof of this physical impossibility.',
      storyConnection: 'The monks chose 4-fold symmetry for the mandala. They could have chosen 3-fold or 6-fold, but not 5-fold or 7-fold — not if they wanted the pattern to tile the table in a regular grid. The crystallographic restriction dictated their choices centuries before mathematicians proved the theorem. Sacred geometry and mathematical necessity converge.',
      checkQuestion: 'Quasicrystals have 5-fold symmetry but are real materials. Does this violate the theorem?',
      checkAnswer: 'No. The theorem applies to periodic crystals — materials with translational symmetry (a repeating unit cell). Quasicrystals have long-range order but NO translational periodicity. They are ordered but aperiodic, like Penrose tilings. The diffraction pattern shows sharp spots (indicating order) with 5-fold symmetry (forbidden for periodic lattices). The theorem is not violated because quasicrystals are not periodic. They exist in the gap between periodic and random that the theorem leaves open.',
      codeIntro: 'Verify the crystallographic restriction theorem computationally.',
      code: `import numpy as np
import matplotlib.pyplot as plt

print("=== Crystallographic Restriction Theorem ===")
print()
print("For a rotation of order k to be compatible with")
print("a 2D lattice, 2*cos(360/k) must be an integer.")
print()

allowed = []
for k in range(1, 13):
    angle = 360 / k
    val = 2 * np.cos(np.radians(angle))
    is_int = abs(val - round(val)) < 1e-10
    status = "ALLOWED" if is_int else "forbidden"
    if is_int:
        allowed.append(k)
    print(f"  k={k:2d}: 2*cos({angle:6.1f}) = {val:6.3f} "
          f"  -> {status}")

print(f"\\nAllowed rotation orders: {allowed}")
print("No others are possible in periodic lattices.")

# Visualise allowed vs forbidden
fig, axes = plt.subplots(1, 5, figsize=(14, 2.8))
for ax, k in zip(axes, [2, 3, 4, 5, 6]):
    angles = np.linspace(0, 2*np.pi, k+1)
    x = np.cos(angles); y = np.sin(angles)

    if k in allowed:
        ax.fill(x, y, color='#2ecc71', alpha=0.3)
        ax.plot(x, y, color='#2ecc71', linewidth=2)
        ax.set_title(f'{k}-fold\\nALLOWED', fontsize=9,
                     color='#2ecc71')
    else:
        ax.fill(x, y, color='#e74c3c', alpha=0.2)
        ax.plot(x, y, color='#e74c3c', linewidth=2,
                linestyle='--')
        ax.set_title(f'{k}-fold\\nFORBIDDEN', fontsize=9,
                     color='#e74c3c')

    ax.set_xlim(-1.3, 1.3); ax.set_ylim(-1.3, 1.3)
    ax.set_aspect('equal'); ax.axis('off')

plt.suptitle('Crystallographic Restriction', fontsize=13)
plt.tight_layout()
plt.show()

print("\\n5-fold and 7-fold are forbidden in periodic tilings.")
print("This is why Penrose tilings (5-fold) must be APERIODIC.")`,
      challenge: 'Extend the proof to 3D. In three dimensions, the crystallographic restriction allows the same orders (1, 2, 3, 4, 6). The argument uses the trace of a 3D rotation matrix, which must be an integer for lattice compatibility. Show that trace(R) = 1 + 2*cos(theta) and find the allowed values.',
      successHint: 'The crystallographic restriction theorem is a striking example of mathematical inevitability: the simple requirement of translational periodicity eliminates most rotational symmetries. It explains why crystals, tiles, and mandalas use the same small set of symmetry orders.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (transformation geometry and fractals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for group theory, tilings, and fractal analysis. Click to start.</p>
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
            diagram={[SymmetryOperationsDiagram, TessellationDiagram, TessellationMandala, FractalTreeDiagram, FibonacciSpiralDiagram, SymmetryTypesMandala][i] ? createElement([SymmetryOperationsDiagram, TessellationDiagram, TessellationMandala, FractalTreeDiagram, FibonacciSpiralDiagram, SymmetryTypesMandala][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
