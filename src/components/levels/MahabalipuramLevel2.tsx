import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MahabalipuramLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Symmetry operations — reflection, rotation, and translation',
      concept: `A tessellation pattern has **symmetry** — you can transform it and it looks the same. There are three fundamental symmetry operations: **translation** (slide the pattern without rotating), **rotation** (spin around a point), and **reflection** (mirror flip across a line).

Every tessellation pattern can be described by its symmetry group — the set of all transformations that leave the pattern unchanged. For a simple square grid, you can translate by any number of squares in x or y, rotate by 90/180/270 degrees, or reflect across horizontal, vertical, or diagonal lines.

In the code below, you will implement these three symmetry operations as coordinate transformations and apply them to polygon vertices. This gives you the mathematical tools to generate any tessellation pattern from a single "seed" tile.

*A symmetry operation is a transformation that maps a figure onto itself. The set of all such operations for a figure forms a mathematical "group" — a concept that connects geometry to abstract algebra.*`,
      analogy: 'Think of a rubber stamp with a pattern. Translation is stamping in a straight line. Rotation is turning the stamp before pressing. Reflection is flipping the stamp over (mirror image). By combining these three operations, you can cover an entire surface with copies of the original stamp pattern.',
      storyConnection: 'The Mahabalipuram carvers used all three symmetry operations, though they did not have mathematical names for them. A single carved motif was repeated by translating (sliding along a ruler), rotating (turning a template), and reflecting (flipping a template face-down). Their symmetry was precise enough that modern measurements find errors of less than 2 millimetres over an entire panel.',
      checkQuestion: 'If you rotate a square by 90 degrees around its centre, it looks the same. How many distinct rotation symmetries does a square have?',
      checkAnswer: 'Four: 0 degrees (identity), 90 degrees, 180 degrees, and 270 degrees. Any other rotation (say 45 degrees) maps the square onto a different orientation, so it is not a symmetry. A regular hexagon has six rotation symmetries (0, 60, 120, 180, 240, 300 degrees).',
      codeIntro: 'Implement and apply the three fundamental symmetry operations.',
      code: `import numpy as np

def translate(points, dx, dy):
    """Translate points by (dx, dy)."""
    return [(x + dx, y + dy) for x, y in points]

def rotate(points, angle_deg, cx=0, cy=0):
    """Rotate points around (cx, cy) by angle_deg degrees."""
    theta = np.radians(angle_deg)
    cos_t, sin_t = np.cos(theta), np.sin(theta)
    result = []
    for x, y in points:
        dx, dy = x - cx, y - cy
        new_x = cx + dx * cos_t - dy * sin_t
        new_y = cy + dx * sin_t + dy * cos_t
        result.append((new_x, new_y))
    return result

def reflect(points, axis='x', line_pos=0):
    """Reflect points across a horizontal (x) or vertical (y) line."""
    result = []
    for x, y in points:
        if axis == 'x':
            result.append((x, 2 * line_pos - y))
        elif axis == 'y':
            result.append((2 * line_pos - x, y))
    return result

# Start with a triangle seed
seed = [(0, 0), (1, 0), (0.5, 0.866)]

print("=== Symmetry Operations on a Triangle ===")
print()
print("Original triangle:")
for i, (x, y) in enumerate(seed):
    print(f"  V{i}: ({x:.3f}, {y:.3f})")

# Apply each operation
operations = [
    ("Translate by (2, 0)", lambda p: translate(p, 2, 0)),
    ("Rotate 120 deg around centroid", lambda p: rotate(p, 120, 0.5, 0.289)),
    ("Reflect across x-axis", lambda p: reflect(p, 'x', 0)),
    ("Rotate 60 + Translate", lambda p: translate(rotate(p, 60, 0.5, 0.289), 1.5, 0)),
]

for name, op in operations:
    result = op(seed)
    print(f"\\\n{name}:")
    for i, (x, y) in enumerate(result):
        print(f"  V{i}: ({x:.3f}, {y:.3f})")

# Generate a triangular tessellation using symmetry
print("\\\n=== Generating Triangular Tessellation ===")
print()

all_triangles = []
base = [(0, 0), (1, 0), (0.5, 0.866)]

for row in range(4):
    for col in range(6):
        # Upward triangle
        dx = col * 1.0 + row * 0.5
        dy = row * 0.866
        tri_up = translate(base, dx, dy)
        all_triangles.append(("up", tri_up))

        # Downward triangle (rotated 180)
        tri_down = rotate(base, 180, 0.5 + dx, 0.289 + dy)
        all_triangles.append(("down", tri_down))

print(f"Total triangles generated: {len(all_triangles)}")
print(f"  Upward: {sum(1 for t, _ in all_triangles if t == 'up')}")
print(f"  Downward: {sum(1 for t, _ in all_triangles if t == 'down')}")
print()

# Verify edge sharing
print("Sample shared edges (adjacent triangles):")
t1 = all_triangles[0][1]
t2 = all_triangles[1][1]
print(f"  Triangle 0: {[(round(x,2),round(y,2)) for x,y in t1]}")
print(f"  Triangle 1: {[(round(x,2),round(y,2)) for x,y in t2]}")`,
      challenge: 'Implement a glide reflection — a reflection followed by a translation along the reflection axis. This is the fourth type of symmetry operation in 2D. Apply it to generate a brick-like pattern where alternating rows are offset by half a brick width.',
      successHint: 'You just implemented the fundamental symmetry operations used in crystallography, computer graphics, and pattern design. Every wallpaper pattern, fabric design, and tiled floor in the world can be generated by combining these operations.',
    },
    {
      title: 'Wallpaper groups — the 17 possible symmetry types',
      concept: `In 1891, Russian crystallographer Evgraf Fedorov proved that there are exactly **17 distinct symmetry groups** for two-dimensional repeating patterns. These are called the **wallpaper groups**, and every tessellation pattern — from Mahabalipuram stone screens to Islamic mosaics to modern wallpaper — belongs to one of these 17 types.

The groups are classified by which symmetry operations they contain: translations only (p1), translations plus 2-fold rotation (p2), translations plus reflections (pm, pg), and so on up to the most symmetric group (p6mm, which has 6-fold rotation, reflections, and glide reflections).

In the code below, you will classify several tessellation patterns by identifying their symmetry operations and matching them to the corresponding wallpaper group. This is the mathematical framework behind all repeating 2D patterns.

*The fact that there are exactly 17 wallpaper groups is a theorem — it is mathematically impossible to create an 18th type. This is analogous to there being exactly 5 Platonic solids.*`,
      analogy: 'Think of the 17 wallpaper groups as 17 "recipes" for making repeating patterns. Each recipe specifies which ingredients (symmetry operations) to use. Just as you cannot invent a new primary colour, you cannot invent a new wallpaper group — there are exactly 17, and every repeating 2D pattern in the universe uses one of them.',
      storyConnection: 'A study of Mahabalipuram stone screens found examples of at least 12 of the 17 wallpaper groups. The Pallava carvers explored most of the possible symmetry types centuries before Fedorov proved how many there are. Each screen is a physical proof of a mathematical theorem.',
      checkQuestion: 'A brick wall pattern has translation symmetry and glide reflection (alternating rows are offset by half a brick). Which wallpaper group is it?',
      checkAnswer: 'The pg group — it has translations and a glide reflection but no pure reflections or rotations beyond the trivial identity. This is one of the simpler wallpaper groups but produces the familiar and aesthetically pleasing running bond brick pattern.',
      codeIntro: 'Classify tessellation patterns by their symmetry groups.',
      code: `import numpy as np

# Wallpaper group classifier
# Each group is defined by its symmetry content

wallpaper_groups = {
    "p1":   {"rotations": [1],        "reflections": False, "glide": False},
    "p2":   {"rotations": [1, 2],     "reflections": False, "glide": False},
    "pm":   {"rotations": [1],        "reflections": True,  "glide": False},
    "pg":   {"rotations": [1],        "reflections": False, "glide": True},
    "cm":   {"rotations": [1],        "reflections": True,  "glide": True},
    "p2mm": {"rotations": [1, 2],     "reflections": True,  "glide": False},
    "p2mg": {"rotations": [1, 2],     "reflections": True,  "glide": True},
    "p2gg": {"rotations": [1, 2],     "reflections": False, "glide": True},
    "c2mm": {"rotations": [1, 2],     "reflections": True,  "glide": True},
    "p4":   {"rotations": [1, 2, 4],  "reflections": False, "glide": False},
    "p4mm": {"rotations": [1, 2, 4],  "reflections": True,  "glide": False},
    "p4gm": {"rotations": [1, 2, 4],  "reflections": True,  "glide": True},
    "p3":   {"rotations": [1, 3],     "reflections": False, "glide": False},
    "p3m1": {"rotations": [1, 3],     "reflections": True,  "glide": False},
    "p31m": {"rotations": [1, 3],     "reflections": True,  "glide": True},
    "p6":   {"rotations": [1, 2, 3, 6], "reflections": False, "glide": False},
    "p6mm": {"rotations": [1, 2, 3, 6], "reflections": True,  "glide": True},
}

print("=== The 17 Wallpaper Groups ===")
print()

header = "Group   Max Rotation  Reflections  Glide Refl"
print(header)
print("-" * len(header))

for name, props in wallpaper_groups.items():
    max_rot = max(props["rotations"])
    ref = "Yes" if props["reflections"] else "No"
    glide = "Yes" if props["glide"] else "No"
    print(f"{name:<8} {max_rot:>11}-fold  {ref:>11}  {glide:>10}")

# Classify some real patterns
print()
print("=== Classifying Mahabalipuram Patterns ===")
print()

patterns = [
    ("Simple square grid", [1, 2, 4], True, False, "p4mm"),
    ("Honeycomb (hexagonal)", [1, 2, 3, 6], True, True, "p6mm"),
    ("Brick wall (running bond)", [1], False, True, "pg"),
    ("Herringbone", [1, 2], False, True, "p2gg"),
    ("Triangular grid", [1, 2, 3, 6], True, True, "p6mm"),
    ("Pinwheel pattern", [1, 2, 4], False, False, "p4"),
    ("Diamond lattice", [1, 2], True, True, "c2mm"),
]

header2 = "Pattern                  Max Rot  Reflect  Glide  Group"
print(header2)
print("-" * len(header2))

for name, rots, ref, glide, group in patterns:
    max_rot = max(rots)
    ref_str = "Yes" if ref else "No"
    glide_str = "Yes" if glide else "No"
    print(f"{name:<25} {max_rot:>5}-fold  {ref_str:>7}  {glide_str:>5}  {group}")

print()
# Count by rotation order
print("=== Distribution by Maximum Rotation Order ===")
for order in [1, 2, 3, 4, 6]:
    count = sum(1 for g in wallpaper_groups.values() if max(g["rotations"]) == order)
    print(f"  {order}-fold rotation: {count} groups")`,
      challenge: 'Notice that 5-fold rotation is missing from the wallpaper groups. Prove why: show that a regular pentagon cannot tile the plane (360 / 108 is not an integer), and therefore 5-fold rotation symmetry is impossible in a repeating 2D pattern. This is connected to the discovery of quasicrystals.',
      successHint: 'You just surveyed all 17 wallpaper groups — the complete classification of 2D repeating symmetry. This classification is used in crystallography (to identify crystal structures), in art history (to analyse decorative patterns), and in materials science (to understand surface structures).',
    },
    {
      title: 'Transformation matrices — symmetry as linear algebra',
      concept: `Every symmetry operation (translation, rotation, reflection) can be represented as a **matrix multiplication**. This is powerful because it lets us chain operations together by multiplying matrices, and it lets computers apply symmetry operations extremely efficiently.

A 2D rotation by angle theta is the matrix: [[cos(theta), -sin(theta)], [sin(theta), cos(theta)]]. A reflection across the x-axis is: [[1, 0], [0, -1]]. To transform a point, you multiply the matrix by the point's coordinate vector.

In the code below, you will build a transformation engine using matrices and use it to generate tessellation patterns by composing multiple transformations. This is the approach used in computer graphics and CNC machining software.

*Matrix multiplication is the foundation of computer graphics. Every rotation, scaling, and translation in a video game, CAD program, or CNC machine is computed as a matrix multiplication.*`,
      analogy: 'Think of a transformation matrix as a set of instructions: "take the x-coordinate, multiply by this, add that much of y-coordinate; take the y-coordinate, multiply by this, add that much of x-coordinate." It is a compact recipe that can be applied to millions of points in milliseconds.',
      storyConnection: 'Modern CNC machines that carve stone jali screens use exactly these transformation matrices. The operator defines one unit cell of the pattern, specifies the symmetry operations as matrices, and the software generates the cutting path for the entire panel. What took a Mahabalipuram carver weeks of careful manual work now takes minutes of computation.',
      checkQuestion: 'What is the rotation matrix for 60 degrees? (cos 60 = 0.5, sin 60 = 0.866)',
      checkAnswer: 'The matrix is [[0.5, -0.866], [0.866, 0.5]]. If you multiply this by the point (1, 0), you get (0.5, 0.866) — the point has been rotated 60 degrees counterclockwise around the origin, landing on the first vertex of a hexagon.',
      codeIntro: 'Build a matrix-based transformation engine for tessellation generation.',
      code: `import numpy as np

def rotation_matrix(angle_deg):
    """2D rotation matrix."""
    theta = np.radians(angle_deg)
    return np.array([
        [np.cos(theta), -np.sin(theta)],
        [np.sin(theta),  np.cos(theta)]
    ])

def reflection_matrix(axis_angle_deg):
    """2D reflection matrix across a line through the origin at given angle."""
    theta = np.radians(2 * axis_angle_deg)
    return np.array([
        [np.cos(theta),  np.sin(theta)],
        [np.sin(theta), -np.cos(theta)]
    ])

def apply_transform(matrix, points, translation=(0, 0)):
    """Apply a transformation matrix + translation to a list of points."""
    result = []
    tx, ty = translation
    for x, y in points:
        new = matrix @ np.array([x, y])
        result.append((new[0] + tx, new[1] + ty))
    return result

# Demonstrate with a unit triangle
seed = [(0, 0), (1, 0), (0.5, 0.866)]

print("=== Transformation Matrices ===")
print()

# Show key matrices
matrices = [
    ("Rotation 90 deg", rotation_matrix(90)),
    ("Rotation 60 deg", rotation_matrix(60)),
    ("Rotation 120 deg", rotation_matrix(120)),
    ("Reflect across x", reflection_matrix(0)),
    ("Reflect across y", reflection_matrix(90)),
    ("Reflect across y=x", reflection_matrix(45)),
]

for name, mat in matrices:
    print(f"{name}:")
    print(f"  [{mat[0,0]:>7.3f}  {mat[0,1]:>7.3f}]")
    print(f"  [{mat[1,0]:>7.3f}  {mat[1,1]:>7.3f}]")
    result = apply_transform(mat, [seed[1]])  # transform point (1,0)
    print(f"  (1,0) -> ({result[0][0]:.3f}, {result[0][1]:.3f})")
    print()

# Generate hexagonal pattern using rotation matrix
print("=== Hexagonal Pattern via Rotation Matrix ===")
print()

R60 = rotation_matrix(60)
hex_triangles = [seed]
current = seed

for i in range(5):
    current = apply_transform(R60, current)
    hex_triangles.append(current)

print(f"6 triangles forming a hexagon:")
for i, tri in enumerate(hex_triangles):
    coords = [(round(x, 3), round(y, 3)) for x, y in tri]
    print(f"  Triangle {i}: {coords}")

# Compose transformations
print()
print("=== Composing Transformations ===")
R90 = rotation_matrix(90)
Reflect_x = reflection_matrix(0)
composed = R90 @ Reflect_x  # rotation after reflection
print("Rotation(90) after Reflect(x-axis):")
print(f"  [{composed[0,0]:>7.3f}  {composed[0,1]:>7.3f}]")
print(f"  [{composed[1,0]:>7.3f}  {composed[1,1]:>7.3f}]")
result = apply_transform(composed, [(1, 0)])
print(f"  (1,0) -> ({result[0][0]:.3f}, {result[0][1]:.3f})")`,
      challenge: 'Implement a "symmetry detector": given a set of polygon vertices, test all rotation angles (30, 60, 90, 120, 180 degrees) and reflection axes to determine which operations leave the shape unchanged. Use this to automatically classify simple patterns by their wallpaper group.',
      successHint: 'Transformation matrices are the language of computer graphics, robotics, and crystallography. Every 3D game, every robot arm, and every crystal structure analysis uses matrices to represent and compose geometric transformations. You just built the core engine.',
    },
    {
      title: 'Pattern generation — building tilings from a unit cell',
      concept: `Every tessellation can be generated from a **unit cell** — the smallest region that, when repeated by the pattern's symmetry operations, fills the entire plane. The unit cell contains all the information needed to reconstruct the full pattern.

For a square tiling, the unit cell is a single square. For a hexagonal tiling, it is a single hexagon (or equivalently, two triangles). For more complex patterns like the 4.8.8 tiling, the unit cell contains one octagon and a portion of the surrounding squares.

In the code below, you will define unit cells for several tessellation patterns and generate the full tiling by applying translation vectors. The two translation vectors define a **lattice** — a regular grid of points at which copies of the unit cell are placed.

*A lattice is defined by two vectors (a, b) that are not parallel. Every lattice point is at position n x a + m x b where n and m are integers. The unit cell is placed at each lattice point to create the tiling.*`,
      analogy: 'Think of a unit cell as a tile mould and the lattice as a grid of positions where you press the mould. The mould contains the pattern; the lattice determines the spacing. Change the mould and you change the pattern. Change the lattice and you change the spacing. Together, they define the entire tiling.',
      storyConnection: 'The Mahabalipuram carvers first carved a template (the unit cell) from wood or metal, then traced it repeatedly across the stone panel following a grid of chalk marks (the lattice). The precision of the lattice determined whether the pattern aligned perfectly at the panel edges or showed visible mismatches.',
      checkQuestion: 'A hexagonal lattice has vectors a = (1, 0) and b = (0.5, 0.866). What is the area of the unit cell?',
      checkAnswer: 'The area of a parallelogram defined by two vectors is the absolute value of the cross product: |a x b| = |1 * 0.866 - 0 * 0.5| = 0.866. This is the area of one unit cell, which equals the area of one equilateral triangle with side length 1 (which is sqrt(3)/4 x 2 = 0.866).',
      codeIntro: 'Generate complete tessellation patterns from unit cells and lattice vectors.',
      code: `import numpy as np

class TessellationGenerator:
    def __init__(self, unit_cell_polygons, lattice_a, lattice_b):
        """
        unit_cell_polygons: list of (n_sides, centre_x, centre_y, radius, rotation)
        lattice_a: (ax, ay) first translation vector
        lattice_b: (bx, by) second translation vector
        """
        self.polygons = unit_cell_polygons
        self.a = np.array(lattice_a)
        self.b = np.array(lattice_b)

    def generate(self, n_a=4, n_b=4):
        """Generate the tiling over n_a x n_b unit cells."""
        all_shapes = []
        for i in range(n_a):
            for j in range(n_b):
                offset = i * self.a + j * self.b
                for n_sides, cx, cy, r, rot in self.polygons:
                    centre = (cx + offset[0], cy + offset[1])
                    all_shapes.append({
                        "sides": n_sides,
                        "centre": centre,
                        "radius": r,
                        "cell": (i, j),
                    })
        return all_shapes

    def cell_area(self):
        """Area of the unit cell (parallelogram)."""
        return abs(self.a[0] * self.b[1] - self.a[1] * self.b[0])

# Define three tessellation patterns

# 1. Square tiling (4.4.4.4)
square_tiling = TessellationGenerator(
    unit_cell_polygons=[(4, 0.5, 0.5, 0.707, 45)],
    lattice_a=(1, 0),
    lattice_b=(0, 1),
)

# 2. Hexagonal tiling (6.6.6)
s3 = np.sqrt(3)
hex_tiling = TessellationGenerator(
    unit_cell_polygons=[(6, 0, 0, 1, 30)],
    lattice_a=(1.5, s3/2),
    lattice_b=(1.5, -s3/2),
)

# 3. Square-octagon tiling (4.8.8)
oct_sq_tiling = TessellationGenerator(
    unit_cell_polygons=[
        (8, 0, 0, 1.307, 22.5),     # octagon
        (4, 1.207, 1.207, 0.5, 45), # small square in gap
    ],
    lattice_a=(2.414, 0),
    lattice_b=(0, 2.414),
)

tilings = [
    ("Square (4.4.4.4)", square_tiling),
    ("Hexagonal (6.6.6)", hex_tiling),
    ("Oct-Square (4.8.8)", oct_sq_tiling),
]

for name, tiling in tilings:
    shapes = tiling.generate(3, 3)
    area = tiling.cell_area()
    print(f"=== {name} ===")
    print(f"  Unit cell area: {area:.3f}")
    print(f"  Lattice vectors: a={tuple(tiling.a)}, b={tuple(tiling.b)}")
    print(f"  Total shapes generated (3x3): {len(shapes)}")

    # Show first few shapes
    for s in shapes[:4]:
        cx, cy = s["centre"]
        print(f"    {s['sides']}-gon at ({cx:.2f}, {cy:.2f}) [cell {s['cell']}]")
    print()

# Compare tiling efficiency
print("=== Tiling Efficiency Comparison ===")
print("(Polygon area / unit cell area = fill fraction)")
print()
for name, tiling in tilings:
    cell_area = tiling.cell_area()
    total_poly_area = 0
    for n, cx, cy, r, rot in tiling.polygons:
        poly_area = (n / 2) * r ** 2 * np.sin(2 * np.pi / n)
        total_poly_area += poly_area
    fill = total_poly_area / cell_area
    print(f"  {name:<25} Fill fraction: {fill:.3f}")`,
      challenge: 'Add a new tiling: the 3.3.3.3.6 pattern (snub hexagonal). The unit cell contains one hexagon surrounded by triangles. Define appropriate lattice vectors and generate the pattern. Verify that the fill fraction is 1.0 (no gaps).',
      successHint: 'You just built a tessellation generator that works with any unit cell and any lattice. This is the computational approach used in crystallography software, textile design systems, and architectural pattern generators. The Mahabalipuram carvers\' patterns are now reproducible with mathematical precision.',
    },
    {
      title: 'Colour symmetry — patterns with coloured tiles',
      concept: `Adding colour to a tessellation introduces a new dimension of symmetry. A **colour symmetry** exists when a geometric symmetry operation (rotation, reflection) also systematically permutes the colours. For example, a checkerboard has a colour symmetry: translating by one square both moves the pattern and swaps black and white.

The study of colour symmetry was pioneered by crystallographers in the 1960s and has since found applications in magnetic structures, modular arithmetic, and even music theory. For a 2-colour pattern, there are 46 colour symmetry groups (compared to 17 for uncoloured patterns).

In the code below, you will implement colour assignment rules for tessellation patterns and verify colour symmetry properties. The Mahabalipuram carvers used alternating light and dark stone to create colour symmetry in some of their screens.

*A colour symmetry operation changes the geometry and the colour simultaneously. A black square translated by one unit becomes a white square — the position changes AND the colour changes, but the overall pattern looks the same.*`,
      analogy: 'Imagine a chess tournament where every player moves simultaneously. After every round, the board pattern shifts by one square — every black square becomes white and vice versa. The pattern looks exactly the same, but every individual square has changed colour. This is colour symmetry: the pattern is preserved even though individual elements are swapped.',
      storyConnection: 'Some Mahabalipuram panels use two types of stone — dark granite and lighter sandstone — arranged in alternating patterns. When a dark hexagon is surrounded by light hexagons and vice versa, the result is a colour-symmetric pattern that adds visual depth without changing the geometric structure.',
      checkQuestion: 'A triangular tessellation is coloured with 3 colours so that no two adjacent triangles share a colour. Is this a colour symmetry?',
      checkAnswer: 'It can be. If every 120-degree rotation at a vertex cycles the three colours (red becomes blue, blue becomes green, green becomes red), then the rotation is a colour symmetry operation. The pattern looks the same overall, but each triangle has changed colour in a consistent way.',
      codeIntro: 'Implement colour assignment rules and verify colour symmetry in tessellations.',
      code: `import numpy as np

def assign_checkerboard(row, col):
    """2-colour checkerboard: alternating black/white."""
    return "dark" if (row + col) % 2 == 0 else "light"

def assign_3colour_hex(row, col):
    """3-colour hexagonal: no adjacent hexagons share a colour."""
    return ["red", "green", "blue"][(row + 2 * col) % 3]

def assign_4colour_square(row, col):
    """4-colour square: no adjacent squares share a colour."""
    colours = [["A", "B"], ["C", "D"]]
    return colours[row % 2][col % 2]

# Generate and display coloured patterns
print("=== Checkerboard Colour Symmetry ===")
print()
for row in range(5):
    line = ""
    for col in range(8):
        c = assign_checkerboard(row, col)
        line += " #" if c == "dark" else " ."
    print(f"  Row {row}: {line}")

print()
print("Translation by (1,0): every dark becomes light and vice versa.")
print("This is a colour symmetry operation.")

print()
print("=== 3-Colour Hexagonal Pattern ===")
print()
for row in range(5):
    offset = "  " if row % 2 == 1 else ""
    line = offset
    for col in range(6):
        c = assign_3colour_hex(row, col)
        symbol = {"red": "R", "green": "G", "blue": "B"}[c]
        line += f" {symbol}"
    print(f"  Row {row}: {line}")

print()
print("120-degree rotation cycles R->G->B->R (colour symmetry).")

# Verify colour symmetry properties
print()
print("=== Colour Symmetry Verification ===")
print()

# Check: does translation (1,0) swap all colours consistently?
print("Checkerboard: translate by (1,0)")
swaps = {}
for row in range(4):
    for col in range(7):
        c1 = assign_checkerboard(row, col)
        c2 = assign_checkerboard(row, col + 1)
        pair = (c1, c2)
        swaps[pair] = swaps.get(pair, 0) + 1

print("  Colour transitions:")
for (c1, c2), count in sorted(swaps.items()):
    print(f"    {c1} -> {c2}: {count} times")

consistent = all(c1 != c2 for c1, c2 in swaps.keys())
print(f"  Consistent colour swap: {consistent}")

print()
print("3-colour hex: translate by (1,0)")
swaps3 = {}
for row in range(4):
    for col in range(5):
        c1 = assign_3colour_hex(row, col)
        c2 = assign_3colour_hex(row, col + 1)
        pair = (c1, c2)
        swaps3[pair] = swaps3.get(pair, 0) + 1

print("  Colour transitions:")
for (c1, c2), count in sorted(swaps3.items()):
    print(f"    {c1} -> {c2}: {count} times")`,
      challenge: 'Implement a "colour symmetry group detector": given a coloured pattern, check all geometric symmetry operations and determine which ones also preserve the colour structure. Count the total number of colour symmetry operations for each pattern.',
      successHint: 'Colour symmetry connects geometry to group theory in a deep way. The same mathematics describes magnetic domain structures in physics, modular arithmetic in number theory, and counterpoint rules in music composition. You have glimpsed one of the most beautiful areas of abstract mathematics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Symmetry groups, transformations, and pattern generation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to implement symmetry operations and generate tessellation patterns.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
