import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MahabalipuramLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Regular polygons — shapes with equal sides and equal angles',
      concept: `A **regular polygon** is a shape where every side has the same length and every interior angle is equal. The simplest is the equilateral triangle (3 sides, 60 degree angles), then the square (4 sides, 90 degrees), the regular pentagon (5 sides, 108 degrees), and so on.

The **interior angle** of a regular polygon with n sides is given by the formula: **(n - 2) x 180 / n** degrees. As n increases, the angle approaches 180 degrees and the polygon looks more and more like a circle. This formula is the key to understanding which shapes can tile a surface (tessellate) and which cannot.

In the code below, you will calculate interior angles for polygons from 3 to 20 sides and visualize how the angle increases. The Mahabalipuram stone carvers needed to know these angles intuitively to create their intricate lattice screens.

*A polygon's interior angles always sum to (n-2) x 180 degrees. For a triangle, that is 180 degrees. For a square, 360 degrees. For a hexagon, 720 degrees.*`,
      analogy: 'Imagine a clock face. The angle between each hour mark is 30 degrees (360/12). Now imagine a clock with only 3 marks (triangle) — each angle is 120 degrees of the full circle. With 6 marks (hexagon), each is 60 degrees. The more marks, the smaller each slice, but the interior angle of the polygon at each vertex gets larger.',
      storyConnection: 'The stone carvers of Mahabalipuram created jali screens — perforated stone panels with repeating geometric patterns. Each pattern starts with a choice of polygon. The carvers discovered through generations of practice that only certain polygons fit together without gaps — a mathematical truth they encoded in stone centuries before mathematicians proved it formally.',
      checkQuestion: 'What is the interior angle of a regular octagon (8 sides)?',
      checkAnswer: '(8 - 2) x 180 / 8 = 6 x 180 / 8 = 1080 / 8 = 135 degrees. Each corner of a regular octagon is 135 degrees. You see this shape on stop signs — and in the floor tiles of many ancient Indian temples.',
      codeIntro: 'Calculate interior angles and properties of regular polygons.',
      code: `import numpy as np

# Regular polygon properties calculator

def polygon_properties(n_sides):
    """Calculate properties of a regular polygon with n sides."""
    interior_angle = (n_sides - 2) * 180 / n_sides
    exterior_angle = 360 / n_sides
    angle_sum = (n_sides - 2) * 180

    # Area of regular polygon with side length 1
    area = (n_sides / 4) * (1 / np.tan(np.pi / n_sides))

    # Perimeter for side length 1
    perimeter = n_sides * 1.0

    # How many fit around a point? (360 / interior_angle)
    fit_at_vertex = 360 / interior_angle

    return {
        "sides": n_sides,
        "interior_angle": interior_angle,
        "exterior_angle": exterior_angle,
        "angle_sum": angle_sum,
        "area": area,
        "perimeter": perimeter,
        "fit_at_vertex": fit_at_vertex,
    }

print("=== Regular Polygon Properties (side length = 1) ===")
print()

names = {3: "Triangle", 4: "Square", 5: "Pentagon", 6: "Hexagon",
         7: "Heptagon", 8: "Octagon", 9: "Nonagon", 10: "Decagon",
         12: "Dodecagon", 15: "15-gon", 20: "20-gon"}

header = "Shape         Sides  Int.Angle  Ext.Angle  Fit@Vertex  Area"
print(header)
print("-" * len(header))

for n in [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]:
    p = polygon_properties(n)
    name = names.get(n, str(n) + "-gon")
    fit = p["fit_at_vertex"]
    fit_str = f"{fit:.0f}" if fit == int(fit) else f"{fit:.2f}"
    print(f"{name:<14} {n:>4}  {p['interior_angle']:>9.1f}  "
          f"{p['exterior_angle']:>9.1f}  {fit_str:>10}  {p['area']:>6.3f}")

print()
print("=== Which shapes tessellate? ===")
print("A shape tessellates if an integer number fit around a vertex.")
print("That means 360 / interior_angle must be a whole number.")
print()
for n in [3, 4, 5, 6, 7, 8]:
    p = polygon_properties(n)
    fit = p["fit_at_vertex"]
    is_integer = abs(fit - round(fit)) < 0.001
    tessellates = "YES" if is_integer else "NO"
    name = names.get(n, str(n) + "-gon")
    print(f"  {name:<10} {p['interior_angle']:>6.1f} deg  {fit:.3f} at vertex  --> {tessellates}")`,
      challenge: 'Calculate the area efficiency of each polygon (area / bounding circle area). Which regular polygon has the highest area efficiency? How does this relate to why hexagons appear so often in nature (honeycombs, basalt columns)?',
      successHint: 'You just proved mathematically that only three regular polygons tile the plane: triangles, squares, and hexagons. The Mahabalipuram carvers discovered this empirically. This is one of the oldest results in geometry, connecting ancient craft to modern mathematics.',
    },
    {
      title: 'Vertex configurations — combining different polygons at a point',
      concept: `While only three regular polygons tessellate alone, you can combine different polygons to tile a surface if the angles at each vertex sum to exactly **360 degrees**. For example, a regular octagon (135 degrees) plus a square (90 degrees) fits: 135 + 135 + 90 = 360. This is called a **semi-regular tessellation** or **Archimedean tiling**.

A **vertex configuration** describes which polygons meet at each vertex. The notation "4.8.8" means a square and two octagons meet at each vertex. There are exactly 11 possible vertex configurations (including the 3 regular tilings), and each produces a unique, beautiful pattern.

In the code below, you will systematically find all valid vertex configurations by testing which combinations of polygon angles sum to 360 degrees. This is the mathematical foundation behind the variety of patterns seen in Mahabalipuram stone screens.

*A vertex configuration is valid if: (1) the angles sum to exactly 360 degrees, (2) the polygons can physically fit together (not all angle-valid combinations work geometrically), and (3) the pattern can extend to fill the whole plane.*`,
      analogy: 'Imagine fitting pie slices around a plate. Each polygon is a "slice" with a specific angle. You need slices that add up to exactly 360 degrees (the full plate). Too little and there is a gap. Too much and slices overlap. Only certain combinations of slice sizes make a perfect fit.',
      storyConnection: 'The Mahabalipuram carvers used many of these vertex configurations in their jali screens. The most common is 3.3.3.3.6 (four triangles and a hexagon at each vertex) — it creates a pattern with large hexagonal openings surrounded by smaller triangular details. Different configurations give different ratios of open space to stone, affecting both light transmission and structural strength.',
      checkQuestion: 'Can three regular pentagons meet at a vertex? (Each pentagon has an interior angle of 108 degrees.)',
      checkAnswer: '3 x 108 = 324 degrees. This is less than 360, so three pentagons leave a gap of 36 degrees. But four pentagons would be 432 degrees — too much. No integer number of regular pentagons fits exactly around a point, which is why pentagons cannot tessellate.',
      codeIntro: 'Systematically find all valid vertex configurations for semi-regular tessellations.',
      code: `import numpy as np
from itertools import combinations_with_replacement

def interior_angle(n):
    """Interior angle of a regular n-gon in degrees."""
    return (n - 2) * 180 / n

def find_vertex_configs(max_sides=12, max_polygons=6):
    """Find all combinations of regular polygons whose angles sum to 360."""
    valid = []
    polygons = range(3, max_sides + 1)

    for count in range(3, max_polygons + 1):
        for combo in combinations_with_replacement(polygons, count):
            angle_sum = sum(interior_angle(n) for n in combo)
            if abs(angle_sum - 360) < 0.01:
                valid.append(combo)
    return valid

configs = find_vertex_configs()

print("=== All Valid Vertex Configurations ===")
print("(Regular polygons meeting at a vertex with angles summing to 360)")
print()

header = "Config          Polygons                      Angles                    Sum"
print(header)
print("-" * len(header))

for i, combo in enumerate(configs):
    config_str = ".".join(str(n) for n in combo)
    polygon_names = {3: "tri", 4: "sq", 5: "pent", 6: "hex",
                     8: "oct", 10: "dec", 12: "dodec"}
    names = [polygon_names.get(n, str(n) + "-gon") for n in combo]
    name_str = " + ".join(names)
    angles = [interior_angle(n) for n in combo]
    angle_str = " + ".join(f"{a:.0f}" for a in angles)
    total = sum(angles)
    print(f"{config_str:<16} {name_str:<30} {angle_str:<25} {total:.0f}")

print(f"\\\nTotal valid configurations found: {len(configs)}")
print()

# Classify by type
regular = [c for c in configs if len(set(c)) == 1]
semi_regular = [c for c in configs if len(set(c)) > 1]
print(f"Regular tilings (one polygon type): {len(regular)}")
for c in regular:
    print(f"  {'.'.join(str(n) for n in c)}")
print(f"\\\nSemi-regular configurations: {len(semi_regular)}")
print("(Not all of these produce valid tilings that extend infinitely)")`,
      challenge: 'For each valid vertex configuration, calculate the "openness ratio" — the fraction of area covered by the largest polygon type. Jali screens need high openness (light transmission). Which configurations have the highest ratio of large-polygon area?',
      successHint: 'You just enumerated the Archimedean tilings — a result that Archimedes himself studied around 200 BCE. The fact that there are only 11 possible semi-regular tilings is a deep result in geometry. The Mahabalipuram carvers explored many of these independently.',
    },
    {
      title: 'Angles at a vertex — why 360 degrees is the magic number',
      concept: `For polygons to fit around a point without gaps or overlaps, their interior angles at that point must sum to exactly **360 degrees**. Less than 360 leaves a gap (the surface curves upward into a cone or dome). More than 360 causes overlap (the surface curves downward like a saddle).

This 360-degree rule connects flat tiling (tessellation) to three-dimensional geometry. If the angles at every vertex sum to less than 360 degrees, you get a **polyhedron** (3D solid) instead of a flat tiling. For example, if you put three pentagons at each vertex (324 degrees < 360), you get a dodecahedron. Three squares and a triangle at each vertex (90+90+90+60 = 330 < 360) gives a certain polyhedron.

In the code below, you will explore the relationship between vertex angle sum and surface curvature, connecting flat Mahabalipuram tiles to three-dimensional temple architecture.

*The connection between angle sum and curvature is called the Gauss-Bonnet theorem — one of the most beautiful results in mathematics. A flat surface has zero curvature (angles sum to 360). A sphere has positive curvature (angles sum to less than 360). A saddle has negative curvature (angles sum to more than 360).*`,
      analogy: 'Imagine building with flexible cardboard polygons and tape. If the angles at a vertex add up to exactly 360 degrees, the surface lies flat. If less than 360, the surface pops up into a dome (like a soccer ball). If you could somehow force more than 360 degrees, the surface would ripple like a lettuce leaf. The angle sum controls the shape of the surface.',
      storyConnection: 'The Pallava architects at Mahabalipuram understood this intuitively. Their flat jali screens use configurations summing to exactly 360 degrees. Their temple domes (vimanas) use configurations summing to less than 360 degrees at each vertex, creating the curved surface. Same mathematical principle, different applications.',
      checkQuestion: 'Five equilateral triangles meet at a vertex: 5 x 60 = 300 degrees. What 3D shape uses this vertex configuration?',
      checkAnswer: 'An icosahedron — the 20-faced regular polyhedron. The 60-degree deficit (360 - 300 = 60) at each vertex creates the curvature needed to close into a sphere-like shape. This is the same shape as many virus capsids and geodesic domes.',
      codeIntro: 'Explore the relationship between vertex angle sums and surface curvature.',
      code: `import numpy as np

def interior_angle(n):
    return (n - 2) * 180 / n

# Famous vertex configurations and their geometry
configs = [
    # (name, polygon list, expected geometry)
    ("3.3.3 (tetrahedron vertex)", [3,3,3], "3D solid"),
    ("3.3.3.3 (octahedron vertex)", [3,3,3,3], "3D solid"),
    ("3.3.3.3.3 (icosahedron vertex)", [3,3,3,3,3], "3D solid"),
    ("3.3.3.3.3.3 (flat tiling)", [3,3,3,3,3,3], "Flat"),
    ("4.4.4 (cube vertex)", [4,4,4], "3D solid"),
    ("4.4.4.4 (flat tiling)", [4,4,4,4], "Flat"),
    ("5.5.5 (dodecahedron vertex)", [5,5,5], "3D solid"),
    ("6.6.6 (flat tiling)", [6,6,6], "Flat"),
    ("3.6.3.6 (flat tiling)", [3,6,3,6], "Flat"),
    ("4.8.8 (flat tiling)", [4,8,8], "Flat"),
    ("3.3.3.3.6 (flat tiling)", [3,3,3,3,6], "Flat"),
    ("7.7.7 (hyperbolic)", [7,7,7], "Hyperbolic"),
]

print("=== Vertex Angle Sum and Surface Curvature ===")
print()
header = "Configuration               Angle Sum  Deficit   Curvature"
print(header)
print("-" * len(header))

for name, polys, geometry in configs:
    total = sum(interior_angle(n) for n in polys)
    deficit = 360 - total
    if abs(deficit) < 0.01:
        curvature = "Zero (flat)"
    elif deficit > 0:
        curvature = f"Positive (+{deficit:.0f} deg)"
    else:
        curvature = f"Negative ({deficit:.0f} deg)"
    print(f"{name:<30} {total:>7.0f}    {deficit:>+6.0f}    {curvature}")

print()
print("=== The Five Platonic Solids ===")
print("(Only 5 possible configurations with angle sum < 360)")
print()

platonic = [
    ("Tetrahedron",  3, 3, 4, 6, 4),
    ("Cube",         4, 3, 8, 12, 6),
    ("Octahedron",   3, 4, 6, 12, 8),
    ("Dodecahedron", 5, 3, 20, 30, 12),
    ("Icosahedron",  3, 5, 12, 30, 20),
]

header2 = "Solid           Face  @Vertex  Vertices  Edges  Faces  V-E+F"
print(header2)
print("-" * len(header2))

for name, face_n, at_vertex, V, E, F in platonic:
    euler = V - E + F  # should always be 2
    angle = interior_angle(face_n) * at_vertex
    print(f"{name:<16} {face_n:>4}  {at_vertex:>7}  {V:>8}  {E:>5}  {F:>5}  {euler:>5}")

print()
print("Euler's formula: V - E + F = 2 for all convex polyhedra.")
print("This connects vertex angles to topology — the deepest")
print("link between geometry and algebra.")`,
      challenge: 'Calculate the angle deficit for each Platonic solid vertex and verify that the total deficit over all vertices equals 720 degrees (which is 4 x pi radians — a consequence of the Gauss-Bonnet theorem for a sphere).',
      successHint: 'You just connected flat tessellations to 3D polyhedra to curved surfaces — a journey from the Mahabalipuram stone screens to the Gauss-Bonnet theorem, one of the most profound results in all of mathematics. Geometry is not just about shapes; it is about the curvature of space itself.',
    },
    {
      title: 'Area and efficiency — how much stone versus open space',
      concept: `A jali screen must balance two competing needs: **structural strength** (enough stone to hold the panel together) and **light transmission** (enough open space for ventilation and illumination). The ratio of open area to total area is the **porosity** or **openness fraction** of the screen.

Different tessellation patterns give different openness fractions even with the same "bar width" (the width of stone between openings). A hexagonal grid with thin bars has more open area than a square grid with the same bar width, because hexagons pack more efficiently.

In the code below, you will calculate the openness fraction for different tessellation patterns as a function of bar width. This is a practical engineering calculation that the Mahabalipuram carvers solved by eye but we can solve precisely with geometry.

*Openness fraction = open area / total area. A value of 0.5 means half the panel is stone and half is open. Most jali screens have openness fractions between 0.3 and 0.7.*`,
      analogy: 'Think of a chain-link fence versus a wooden fence with gaps. The chain-link fence has thin wires and high openness (you can see through easily). The wooden fence has thick slats and low openness. A jali screen is somewhere in between — enough stone for strength, enough openness for light and air.',
      storyConnection: 'The Mahabalipuram carvers adjusted the bar width depending on the screen location. Exterior screens exposed to monsoon winds had thicker bars (lower openness, higher strength). Interior screens separating rooms had thinner bars (higher openness, more light). The pattern choice also mattered — some patterns are inherently stronger than others for the same openness.',
      checkQuestion: 'A square jali screen is 1 metre by 1 metre with a 10x10 grid of square openings, each 8 cm wide, separated by 2 cm bars. What is the openness fraction?',
      checkAnswer: 'Each cell is 10 cm (8 cm opening + 2 cm bar). 10 cells fit in 1 metre. Each opening area = 8 x 8 = 64 cm squared. Total opening area = 100 x 64 = 6400 cm squared. Total panel area = 10000 cm squared. Openness = 6400 / 10000 = 0.64 or 64%.',
      codeIntro: 'Calculate openness fraction for different tessellation patterns and bar widths.',
      code: `import numpy as np

def square_openness(cell_size_cm, bar_width_cm):
    """Openness of a square grid pattern."""
    opening = cell_size_cm - bar_width_cm
    if opening <= 0:
        return 0
    return (opening / cell_size_cm) ** 2

def hexagonal_openness(cell_size_cm, bar_width_cm):
    """Openness of a hexagonal grid pattern (honeycomb)."""
    # Hexagon side = cell_size / sqrt(3)
    inner_size = cell_size_cm - bar_width_cm
    if inner_size <= 0:
        return 0
    # Approximate: hexagonal packing is more efficient
    return (inner_size / cell_size_cm) ** 2 * 1.1

def triangular_openness(cell_size_cm, bar_width_cm):
    """Openness of a triangular grid pattern."""
    inner_size = cell_size_cm - bar_width_cm * 1.5  # bars overlap at vertices
    if inner_size <= 0:
        return 0
    return (inner_size / cell_size_cm) ** 2 * 0.9

print("=== Jali Screen Openness Calculator ===")
print()

cell_size = 5.0  # cm between centres
bar_widths = np.arange(0.3, 3.1, 0.3)

print(f"Cell spacing: {cell_size} cm")
print()
header = "Bar Width(cm)  Square(%)  Hexagonal(%)  Triangular(%)"
print(header)
print("-" * len(header))

for bw in bar_widths:
    sq = square_openness(cell_size, bw) * 100
    hx = hexagonal_openness(cell_size, bw) * 100
    tr = triangular_openness(cell_size, bw) * 100
    print(f"{bw:>11.1f}    {sq:>7.1f}    {hx:>10.1f}    {tr:>12.1f}")

print()
print("=== Structural Strength vs Openness Trade-off ===")
print()

# Simplified strength model: relative strength proportional to stone fraction
header2 = "Openness(%)  Stone(%)  Relative Strength  Light Transmission"
print(header2)
print("-" * len(header2))

for openness in range(20, 85, 5):
    stone = 100 - openness
    # Strength scales roughly with stone fraction squared
    strength = (stone / 100) ** 2
    # Light transmission scales with openness
    light = openness / 100
    grade = "Strong" if strength > 0.3 else "Medium" if strength > 0.1 else "Fragile"
    print(f"{openness:>9}    {stone:>5}    {strength:>15.3f}    {light:>16.2f}    {grade}")

print()
print("The Mahabalipuram carvers found the sweet spot: ~50-60%")
print("openness gives good light with adequate structural strength.")`,
      challenge: 'Design a "graded jali" where the bar width varies from 3 cm at the bottom (structural support) to 1 cm at the top (maximum light). Calculate the average openness and the structural safety factor at top and bottom.',
      successHint: 'You just performed a design optimization — balancing competing requirements (strength vs light) with a single parameter (bar width). This is the essence of engineering design, whether for ancient stone screens or modern building facades.',
    },
    {
      title: 'Coordinate geometry — plotting polygon vertices with math',
      concept: `To generate tessellation patterns computationally, we need to place polygon vertices at exact coordinates. A regular polygon with n sides, centred at the origin with radius r, has vertices at: **x = r x cos(2 x pi x k / n)** and **y = r x sin(2 x pi x k / n)** for k = 0, 1, ..., n-1.

This parameterisation uses **trigonometry** — the sine and cosine functions convert an angle into x and y coordinates on a circle. By varying k from 0 to n-1, we step around the circle in equal increments, placing vertices at each step.

In the code below, you will generate vertices for various regular polygons and then arrange multiple polygons into tessellation patterns. This is the computational foundation for the tessellation generator you will build in Level 4.

*Sine and cosine take an angle and return coordinates on a unit circle: cos gives the x-coordinate, sin gives the y-coordinate. Any point on a circle of radius r at angle theta is at (r cos theta, r sin theta).*`,
      analogy: 'Imagine walking around a circular track. At each step, your position can be described by how far east (cosine) and how far north (sine) you are from the centre. If you take n equally-spaced steps, you trace out a regular polygon. The track is the circumscribed circle, and your positions are the vertices.',
      storyConnection: 'While the Mahabalipuram carvers worked by eye and ruler, the mathematics of coordinate geometry allows us to recreate their patterns with perfect precision. Modern CNC (Computer Numerical Control) machines that carve stone screens use exactly these equations to position the cutting tool along polygon edges.',
      checkQuestion: 'What are the coordinates of the vertices of a regular hexagon centred at the origin with radius 1?',
      checkAnswer: 'For k=0 to 5: (1, 0), (0.5, 0.866), (-0.5, 0.866), (-1, 0), (-0.5, -0.866), (0.5, -0.866). These are cos(k x 60 degrees) and sin(k x 60 degrees) for k = 0 to 5.',
      codeIntro: 'Generate polygon vertex coordinates and arrange them into tessellation patterns.',
      code: `import numpy as np

def polygon_vertices(n_sides, centre_x=0, centre_y=0, radius=1, rotation_deg=0):
    """Generate vertices of a regular polygon."""
    angles = np.array([2 * np.pi * k / n_sides + np.radians(rotation_deg)
                       for k in range(n_sides)])
    xs = centre_x + radius * np.cos(angles)
    ys = centre_y + radius * np.sin(angles)
    return list(zip(xs, ys))

# Generate and display vertices for key polygons
print("=== Regular Polygon Vertices (radius = 1) ===")
print()

for n in [3, 4, 6, 8]:
    names = {3: "Triangle", 4: "Square", 6: "Hexagon", 8: "Octagon"}
    verts = polygon_vertices(n)
    print(f"{names[n]} ({n} vertices):")
    for i, (x, y) in enumerate(verts):
        print(f"  V{i}: ({x:>7.4f}, {y:>7.4f})")
    print()

# Generate a row of hexagons (honeycomb pattern)
print("=== Honeycomb Pattern: Hexagon Centres ===")
print()

hex_radius = 1.0
row_spacing = hex_radius * np.sqrt(3)
col_spacing = hex_radius * 1.5

centres = []
for row in range(4):
    for col in range(5):
        x = col * col_spacing * 2
        y = row * row_spacing
        if col % 2 == 1:
            y += row_spacing / 2  # offset odd columns
        centres.append((x, y))

print(f"{'Hex #':<8} {'Centre X':>10} {'Centre Y':>10}   Vertices (first 3)")
print("-" * 60)

for i, (cx, cy) in enumerate(centres[:12]):
    verts = polygon_vertices(6, cx, cy, hex_radius, rotation_deg=30)
    v_str = "  ".join(f"({x:.1f},{y:.1f})" for x, y in verts[:3])
    print(f"{i:<8} {cx:>10.2f} {cy:>10.2f}   {v_str}...")

print()
print(f"Total hexagons placed: {len(centres)}")
print("Each hexagon shares edges with its neighbours,")
print("creating a seamless honeycomb tessellation.")`,
      challenge: 'Generate a square-octagon (4.8.8) tessellation pattern. Place octagons at grid points and fill the gaps with squares. Print the centre coordinates and verify that the octagons and squares share vertices exactly.',
      successHint: 'You just built the coordinate engine for a tessellation generator. The same trigonometric approach is used in computer graphics, CNC machining, robotics, and any field that needs to compute precise geometric shapes from mathematical parameters.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Regular polygons and tessellation fundamentals</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to explore polygon geometry and the mathematics of tessellation.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
