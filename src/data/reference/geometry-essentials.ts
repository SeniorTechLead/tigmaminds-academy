import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'geometry-essentials',
  title: 'Geometry Essentials',
  category: 'math',
  icon: '📐',
  tagline:
    'Shapes, angles, and spatial reasoning — from bamboo huts to bridge arches.',
  relatedStories: ['the-magic-japi-hat', 'basket-weavers-song', 'bridge-that-grew'],
  understand: [
    {
      title: 'Types of Angles',
      beginnerContent:
        '**What is an angle?**\n\n' +
        'An angle forms where two rays meet at a common point called the **vertex**. Angles are measured in degrees (°).\n\n' +
        '**Angle types by size:**\n\n' +
        '| Type | Range | Example |\n' +
        '|------|-------|---------|\n' +
        '| Acute | 0° < angle < 90° | Tip of a bamboo leaf |\n' +
        '| Right | exactly 90° | Corner of a book |\n' +
        '| Obtuse | 90° < angle < 180° | Open laptop lid |\n' +
        '| Straight | exactly 180° | A flat line |\n' +
        '| Reflex | 180° < angle < 360° | More than halfway around |\n\n' +
        '**How to measure:** Place a protractor\'s centre on the vertex, align one ray with 0°, and read where the other ray crosses.\n\n' +
        '**Key angle relationships:**\n\n' +
        '- **Complementary** — two angles that add to 90° (e.g. 30° + 60°)\n' +
        '- **Supplementary** — two angles that add to 180° (e.g. 110° + 70°)\n' +
        '- **Vertical angles** — opposite angles where two lines cross. Always equal\n\n' +
        'These relationships are the building blocks of every geometric proof.',
      intermediateContent:
        '**Angle relationships with parallel lines:**\n\n' +
        'When a transversal crosses two parallel lines, several angle pairs form:\n\n' +
        '| Relationship | Rule |\n' +
        '|-------------|------|\n' +
        '| Vertical angles | Always equal |\n' +
        '| Alternate interior angles | Equal |\n' +
        '| Co-interior (same-side) angles | Sum to 180° |\n' +
        '| Corresponding angles | Equal |\n\n' +
        '**Worked example:** Two parallel lines cut by a transversal, one angle = 65°:\n\n' +
        '| Angle type | Value | Why |\n' +
        '|-----------|-------|-----|\n' +
        '| Alternate interior | 65° | Equal to given |\n' +
        '| Co-interior | 115° | 180° − 65° |\n' +
        '| Corresponding | 65° | Equal to given |\n\n' +
        'With just **one known angle**, you can find every angle in the figure.',
      advancedContent:
        '**Non-Euclidean geometry changes the rules:**\n\n' +
        '- **Spherical (elliptic)** — triangle angles sum to MORE than 180°. A triangle with vertices at the North Pole, equator at 0°, and equator at 90°E has three 90° angles, totaling 270°\n' +
        '- **Hyperbolic (saddle)** — triangle angles sum to LESS than 180°\n' +
        '- The angular excess (or deficit) is proportional to the triangle\'s area — the **Gauss-Bonnet theorem** links local geometry to global topology\n\n' +
        'GPS satellites must account for non-Euclidean spacetime geometry (general relativity) to achieve metre-level accuracy.',
      diagram: 'AngleExplorerDiagram',
    },
    {
      title: 'Triangles and the Pythagorean Theorem',
      beginnerContent:
        '**The simplest polygon:** A triangle has three sides, three angles, always summing to exactly **180°**.\n\n' +
        '**Classification by sides:**\n\n' +
        '| Type | Sides | Angles |\n' +
        '|------|-------|--------|\n' +
        '| Equilateral | All 3 equal | All 60° |\n' +
        '| Isosceles | 2 equal | 2 equal base angles |\n' +
        '| Scalene | None equal | All different |\n\n' +
        '**Classification by angles:** acute (all < 90°), right (one = 90°), obtuse (one > 90°).\n\n' +
        '**The Pythagorean Theorem**\n\n' +
        'For any right triangle with legs `a` and `b` and hypotenuse `c`:\n\n' +
        '`a² + b² = c²`\n\n' +
        '**Example: Ladder against a wall**\n\n' +
        '| Step | Operation | Result |\n' +
        '|------|-----------|--------|\n' +
        '| Given | Ladder = 5 m, base = 3 m | |\n' +
        '| Formula | height = sqrt(5² − 3²) | |\n' +
        '| Compute | sqrt(25 − 9) = sqrt(16) | **4 metres** |\n\n' +
        '**The converse:** If three sides satisfy a² + b² = c², the triangle must be a right triangle. The classic **3-4-5 triple** (9 + 16 = 25) has been used by builders for thousands of years to create perfect right angles.',
      intermediateContent:
        '**Pythagorean triples** are integer solutions to a² + b² = c²:\n\n' +
        '| Triple | Check |\n' +
        '|--------|-------|\n' +
        '| (3, 4, 5) | 9 + 16 = 25 |\n' +
        '| (5, 12, 13) | 25 + 144 = 169 |\n' +
        '| (8, 15, 17) | 64 + 225 = 289 |\n' +
        '| (7, 24, 25) | 49 + 576 = 625 |\n\n' +
        '**Generating primitive triples:** `a = m²−n²`, `b = 2mn`, `c = m²+n²` where m > n > 0, GCD(m,n) = 1, and m−n is odd.\n\n' +
        '- m=2, n=1 gives (3, 4, 5)\n' +
        '- m=3, n=2 gives (5, 12, 13)\n\n' +
        '**Worked problem:** A 13 m ladder, base 5 m from wall. Height = sqrt(13² − 5²) = sqrt(169 − 25) = sqrt(144) = **12 metres**.',
      advancedContent:
        '**Generalizations of the Pythagorean theorem:**\n\n' +
        '- **Law of cosines:** `c² = a² + b² − 2ab·cos C` works for ANY triangle. When C = 90°, cos 90° = 0 and it reduces to the Pythagorean theorem\n' +
        '- **n-dimensional distance:** `d² = sum of (xi − yi)²` — the n-dimensional Pythagorean theorem\n' +
        '- **Fermat\'s Last Theorem** (proved by Andrew Wiles in 1995 after 358 years): `a^n + b^n = c^n` has no positive integer solutions for n > 2\n\n' +
        'The proof used deep connections between elliptic curves and modular forms — mathematics far beyond anything Fermat himself could have known.',
      diagram: 'TriangleExplorerDiagram',
    },
    {
      title: 'Circles',
      beginnerContent:
        '**What is a circle?**\n\n' +
        'A circle is the set of all points equidistant from a centre point. That distance is the **radius** (r).\n\n' +
        '**Key measurements:**\n\n' +
        '| Property | Formula | Notes |\n' +
        '|----------|---------|-------|\n' +
        '| Diameter | d = 2r | Longest line through centre |\n' +
        '| Circumference | C = 2 pi r | Distance around |\n' +
        '| Area | A = pi r² | Space enclosed |\n\n' +
        'The number **pi** is approximately 3.14159 — the ratio of any circle\'s circumference to its diameter.\n\n' +
        '**Circle vocabulary:**\n\n' +
        '- **Chord** — a line segment connecting two points on the circle (diameter = longest chord)\n' +
        '- **Tangent** — a line touching the circle at exactly one point, always perpendicular to the radius at that point\n' +
        '- **Arc** — a portion of the circumference\n' +
        '- **Sector** — the "pie slice" between two radii and the arc they enclose\n\n' +
        '**Sector area:** `(angle/360) x pi r²`\n\n' +
        'These properties appear everywhere — wheel design, gear ratios, clock faces, satellite orbits, and the circular cross-sections of bamboo used in traditional Assamese homes.',
      intermediateContent:
        '**Arc length and sector area (radians):**\n\n' +
        '- Arc length: `s = r x theta`\n' +
        '- Sector area: `A = (1/2) r² theta`\n\n' +
        '**Worked example:** A pizza slice with r = 15 cm and angle = 45° (= pi/4 radians):\n\n' +
        '| Quantity | Calculation | Result |\n' +
        '|----------|------------|--------|\n' +
        '| Arc length | 15 x pi/4 | **11.78 cm** |\n' +
        '| Sector area | (1/2)(225)(pi/4) | **88.36 cm²** |\n\n' +
        '**Key theorems:**\n\n' +
        '- **Inscribed angle theorem** — an inscribed angle is half the central angle subtending the same arc\n' +
        '- **Thales\' theorem** — an angle inscribed in a semicircle is always 90°',
      advancedContent:
        '**Circle equation:** `(x−h)² + (y−k)² = r²` for centre (h, k).\n\n' +
        'In the complex plane, a circle of radius r centred at z0 is `|z − z0| = r`.\n\n' +
        '- **Apollonius circles** — loci where the distance ratio to two fixed points is constant — appear in electromagnetic field theory and optics\n' +
        '- **Isoperimetric inequality** — among all closed curves of a given perimeter, the circle encloses maximum area: `A <= P²/(4 pi)`, with equality only for a circle\n\n' +
        'This is why soap bubbles are spherical — surface tension minimizes surface area for a given volume.',
      diagram: 'CirclePropertiesDiagram',
    },
    {
      title: '3D Shapes: Volume and Surface Area',
      beginnerContent:
        '**Why 3D matters:** Volume tells you how much space a shape occupies. Surface area tells you how much material covers it.\n\n' +
        '**Key formulas:**\n\n' +
        '| Shape | Volume | Surface Area |\n' +
        '|-------|--------|--------------|\n' +
        '| Cube (side s) | s³ | 6s² |\n' +
        '| Box (l, w, h) | lwh | 2(lw + lh + wh) |\n' +
        '| Cylinder (r, h) | pi r²h | 2 pi r² + 2 pi rh |\n' +
        '| Sphere (r) | (4/3) pi r³ | 4 pi r² |\n' +
        '| Cone (r, h) | (1/3) pi r²h | pi r sqrt(r²+h²) + pi r² |\n\n' +
        '**Worked example: Cylindrical water drum** (r = 0.5 m, h = 1.2 m)\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Volume | pi(0.25)(1.2) | 0.942 m³ (about 942 litres) |\n' +
        '| Surface area | 2 pi(0.25) + 2 pi(0.5)(1.2) | 5.34 m² |\n\n' +
        'Volume tells you how much water it holds; surface area tells you how much sheet metal you need to build it.',
      intermediateContent:
        '**Composite shapes:** Break them into simpler pieces.\n\n' +
        '**Example:** A silo = cylinder (r = 3 m, h = 8 m) + hemisphere (r = 3 m)\n\n' +
        '| Part | Volume |\n' +
        '|------|--------|\n' +
        '| Cylinder | pi(9)(8) = 72 pi = 226.2 m³ |\n' +
        '| Hemisphere | (2/3) pi(27) = 18 pi = 56.5 m³ |\n' +
        '| **Total** | **282.7 m³** |\n\n' +
        '| Part | Surface Area |\n' +
        '|------|-------------|\n' +
        '| Cylinder lateral | 2 pi(3)(8) = 48 pi |\n' +
        '| Base circle | pi(9) = 9 pi |\n' +
        '| Hemisphere | 2 pi(9) = 18 pi |\n' +
        '| **Total** | **75 pi = 235.6 m²** |\n\n' +
        'No top circle — the hemisphere replaces it.',
      advancedContent:
        '**Cavalieri\'s principle:** Two solids with equal cross-sectional areas at every height have equal volumes. A slanted (oblique) cylinder has the same volume as a right cylinder of the same height and base.\n\n' +
        'In higher dimensions, the volume of an n-dimensional sphere of radius r is `Vn = pi^(n/2) r^n / Gamma(n/2 + 1)`. Remarkably, this peaks at n = 5.26 and then decreases — a 100-dimensional unit sphere has essentially zero volume. This counterintuitive result is another manifestation of the **curse of dimensionality**.',
      diagram: 'Volume3DDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import math\n\n# Calculate area and perimeter of common shapes\nradius = 5\nprint("--- Circle (radius = 5) ---")\nprint(f"Area = {math.pi * radius**2:.2f}")\nprint(f"Circumference = {2 * math.pi * radius:.2f}")\n\nprint("\\n--- Right triangle (a=3, b=4) ---")\na, b = 3, 4\nc = math.sqrt(a**2 + b**2)\nprint(f"Hypotenuse = {c}")\nprint(f"Area = {0.5 * a * b}")\nprint(f"Perimeter = {a + b + c}")\n\nprint("\\n--- Cylinder (r=0.5, h=1.2) ---")\nr, h = 0.5, 1.2\nprint(f"Volume = {math.pi * r**2 * h:.3f} m^3")\nprint(f"  = {math.pi * r**2 * h * 1000:.0f} litres")', title: 'Try it — Areas & Volumes' } },
    },
    {
      title: 'Transformations',
      beginnerContent:
        '**What is a transformation?**\n\n' +
        'A geometric transformation changes the position, size, or orientation of a shape.\n\n' +
        '**Rigid transformations** (preserve shape and size):\n\n' +
        '| Transformation | What it does | Everyday example |\n' +
        '|---------------|-------------|------------------|\n' +
        '| Translation | Slides every point the same distance | Pushing a book across a table |\n' +
        '| Rotation | Turns around a fixed point | A clock hand spinning |\n' +
        '| Reflection | Flips across a mirror line | Your reflection in water |\n\n' +
        '**Symmetry** is a transformation that maps a shape onto itself:\n\n' +
        '- **Line symmetry** — fold along a line and both halves match (a butterfly has 1 line of symmetry)\n' +
        '- **Rotational symmetry** — rotate less than 360° and it looks the same (a square has order 4: it matches at 90°, 180°, 270°, 360°)\n\n' +
        'The traditional Assamese **japi hat** has beautiful rotational symmetry: its woven patterns repeat evenly around the central axis. Recognising symmetry simplifies calculations — analyse half the shape and mirror the result.',
      intermediateContent:
        '**Coordinate descriptions:**\n\n' +
        '| Transformation | Rule |\n' +
        '|---------------|------|\n' +
        '| Translation by (a, b) | (x, y) -> (x+a, y+b) |\n' +
        '| Reflect across x-axis | (x, y) -> (x, -y) |\n' +
        '| Rotate by theta about origin | (x, y) -> (x cos theta - y sin theta, x sin theta + y cos theta) |\n' +
        '| Dilation by factor k | (x, y) -> (kx, ky) |\n\n' +
        '**Example:** Rotate (3, 4) by 90° counterclockwise:\n\n' +
        '`(3 cos 90° - 4 sin 90°, 3 sin 90° + 4 cos 90°) = (0 - 4, 3 + 0) =` **(−4, 3)**\n\n' +
        'A dilation preserves shape but not size — it produces **similar** figures.',
      advancedContent:
        '**Symmetry groups:**\n\n' +
        'The set of all symmetries of a figure forms an algebraic structure called a **group**.\n\n' +
        '- A square has 8 symmetries (4 rotations + 4 reflections) forming the dihedral group **D4**\n' +
        '- The classification of all 2D repeating patterns (wallpaper groups) shows exactly **17 distinct symmetry groups** — proven in 1891 by Fedorov\n' +
        '- Islamic geometric art at the Alhambra palace contains all 17 groups, achieved empirically centuries before the mathematical proof\n' +
        '- In 3D, there are exactly **230 space groups**, classifying all possible crystal structures — the foundation of crystallography',
      diagram: 'TransformationsDiagram',
    },
  ],
};
