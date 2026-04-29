import type { ReferenceGuide } from '../reference';
import { practiceAngles, practiceTriangles, practiceCircles, practiceVolumes, practiceTransformations } from '../practice-geometry';

export const guide: ReferenceGuide = {
  slug: 'geometry-essentials',
  title: 'Geometry Essentials',
  category: 'math',
  icon: '📐',
  tagline:
    'Shapes, angles, and spatial reasoning — from bamboo huts to bridge arches.',
  relatedStories: ['the-magic-japi-hat', 'basket-weavers-song', 'bridge-that-grew'],
  understand: [
    // ─────────────────────────────────────────────────────────────
    // 1. Types of Angles
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Types of Angles',
      beginnerContent:
        '**Tara stands in her room, picking up a protractor.** Three things on her desk catch her eye: an open book, a partly-open laptop, and a folded piece of paper. Each makes an angle. They\'re all *different kinds* of angles.\n\n' +
        '[diagram:AngleProtractorDiagram]\n\n' +
        '**An angle forms where two rays meet at a common point — the vertex.** Angles are measured in degrees (°), with one full turn being 360°.\n\n' +
        '**Five families of angles, by size.**\n\n' +
        '| Family | Range | Everyday example |\n' +
        '|--------|-------|------------------|\n' +
        '| **Acute** | 0° < angle < 90° | Tip of a bamboo leaf, folded paper |\n' +
        '| **Right** | exactly 90° | Corner of a book, room corner |\n' +
        '| **Obtuse** | 90° < angle < 180° | Open laptop lid |\n' +
        '| **Straight** | exactly 180° | A flat line |\n' +
        '| **Reflex** | 180° < angle < 360° | More than halfway around (think clock hands at 4 o\'clock measured the long way) |\n\n' +
        '**Two angle pairs you\'ll meet everywhere.**\n\n' +
        '| Name | Definition | Example |\n' +
        '|------|-----------|---------|\n' +
        '| **Complementary** angles | Sum to **90°** | 30° and 60° fit together to make a right angle |\n' +
        '| **Supplementary** angles | Sum to **180°** | 110° and 70° fit on a straight line |\n' +
        '| **Vertical** angles | Form when two lines cross — opposite angles are *always equal* | The X-shape: opposite "wedges" are equal |\n\n' +
        '**Walked example.** A road meets a wall at 70°. What\'s the supplementary angle?\n\n' +
        '| Step | Reasoning | Result |\n' +
        '|------|-----------|--------|\n' +
        '| 1 | Supplementary angles add to 180° | a + 70° = 180° |\n' +
        '| 2 | Subtract | a = 110° |\n' +
        '| 3 | Done | **110° (an obtuse angle)** |\n\n' +
        '**Check yourself.** A right angle and a 35° angle — are they complementary or supplementary? *(Neither directly. 90 + 35 = 125, not 90 or 180. But 35° has complement **55°** and supplement **145°**.)*',
      intermediateContent:
        '**Parallel lines + a transversal — angle relationships everywhere.** When a single line ("transversal") crosses two parallel lines, eight angles form. They come in matched pairs:\n\n' +
        '| Pair name | Rule |\n' +
        '|-----------|------|\n' +
        '| **Vertical angles** (across a single intersection) | Equal |\n' +
        '| **Corresponding angles** (same position at each intersection) | Equal |\n' +
        '| **Alternate interior** (between the parallels, opposite sides of transversal) | Equal |\n' +
        '| **Co-interior** (same-side interior, sometimes "consecutive interior") | Sum to 180° |\n\n' +
        '**Worked example.** Two parallel railway tracks cut by a road that meets one at 65°. Find every angle in the figure.\n\n' +
        '| Angle | Reasoning | Value |\n' +
        '|-------|-----------|-------|\n' +
        '| Vertical to 65° at first intersection | Equal | 65° |\n' +
        '| Supplementary to 65° (linear pair) | 180° − 65° | 115° |\n' +
        '| Corresponding angle at the second track | Equal to 65° | 65° |\n' +
        '| Alternate interior on the other side | Equal to 65° | 65° |\n' +
        '| Co-interior angle | 180° − 65° | 115° |\n\n' +
        'From one measurement, the entire figure is determined. This is the engine of geometric proof.',
      advancedContent:
        '**Non-Euclidean geometry — when triangle angles don\'t sum to 180°.**\n\n' +
        'Euclid\'s parallel postulate (~300 BCE) said: through a point not on a given line, exactly *one* parallel can be drawn. For 2,000 years mathematicians tried to prove this from the other postulates. They couldn\'t. Why? Because different choices give different — perfectly valid — geometries:\n\n' +
        '| Geometry | Parallel postulate | Triangle angle sum |\n' +
        '|----------|---------------------|---------------------|\n' +
        '| **Euclidean** (flat plane) | Exactly one parallel | exactly 180° |\n' +
        '| **Spherical / elliptic** (sphere\'s surface) | No parallels | **More than 180°** |\n' +
        '| **Hyperbolic** (saddle surface) | Infinitely many parallels | **Less than 180°** |\n\n' +
        '**A spherical-triangle example.** Take three points on Earth: the North Pole, a point on the equator at 0° longitude, and a point on the equator at 90° east. Connect them with great-circle arcs. Each angle of this triangle is 90°. The sum is **270°** — far from Euclid\'s 180°.\n\n' +
        '**Gauss-Bonnet theorem** generalises this: the angular excess (or deficit) of a triangle equals its area divided by the curvature scale. The bigger the triangle on a curved surface, the more its angles deviate from 180°. **General relativity** uses exactly this language — gravity *is* curvature, and the angles of a triangle drawn near a star differ slightly from 180° because mass curves spacetime.',
      diagram: 'AngleExplorerDiagram',
      practice: practiceAngles,
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Triangles and Pythagoras
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Triangles and the Pythagorean Theorem',
      beginnerContent:
        '**Bipin leans a 5-metre ladder against a wall.** The foot of the ladder is exactly 3 metres out from the wall. *How high up the wall does the top of the ladder reach?*\n\n' +
        '[diagram:LadderPythagorasDiagram]\n\n' +
        'You don\'t need to climb up to find out. The ladder, the wall, and the ground form a **right triangle**. One of the oldest theorems in mathematics — the Pythagorean theorem — gives the answer.\n\n' +
        '**The triangle — three sides, three angles, always summing to 180°.**\n\n' +
        '| By sides | Look for | Angles |\n' +
        '|----------|----------|--------|\n' +
        '| **Equilateral** | All 3 sides equal | All 60° |\n' +
        '| **Isosceles** | Exactly 2 sides equal | 2 equal base angles |\n' +
        '| **Scalene** | No sides equal | All 3 different |\n\n' +
        '| By largest angle | Look for |\n' +
        '|------------------|----------|\n' +
        '| **Acute** triangle | All 3 angles < 90° |\n' +
        '| **Right** triangle | One angle = 90° (the others sum to 90°) |\n' +
        '| **Obtuse** triangle | One angle > 90° |\n\n' +
        '**The Pythagorean theorem.** For a *right* triangle with legs a and b and hypotenuse c (the side opposite the right angle):\n\n' +
        '`a² + b² = c²`\n\n' +
        '**Walked example — Bipin\'s ladder.**\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | Ladder is hypotenuse: c = 5 m | — |\n' +
        '| 2 | Base is one leg: a = 3 m | — |\n' +
        '| 3 | Want the height (other leg): b² = c² − a² | 25 − 9 = 16 |\n' +
        '| 4 | Take square root | b = √16 |\n' +
        '| 5 | Done | **b = 4 m** |\n\n' +
        '**The 3-4-5 triangle is famous because all three sides are whole numbers.** Builders have used it for thousands of years to lay out perfect right angles. Stretch a rope marked at 3, 4, and 5 metres into a triangle: the angle opposite the 5-metre side is exactly 90°. No protractor needed.\n\n' +
        '**Pythagorean triples — other right triangles with whole-number sides.**\n\n' +
        '| Triple | Verify |\n' +
        '|--------|--------|\n' +
        '| (3, 4, 5) | 9 + 16 = 25 ✓ |\n' +
        '| (5, 12, 13) | 25 + 144 = 169 ✓ |\n' +
        '| (8, 15, 17) | 64 + 225 = 289 ✓ |\n' +
        '| (7, 24, 25) | 49 + 576 = 625 ✓ |\n\n' +
        '**Check yourself.** A 13 m ladder leans on a wall, base 5 m out. How high does it reach? *(Pythagoras: √(169 − 25) = √144 = **12 m**. The 5-12-13 triple.)*',
      intermediateContent:
        '**Generating Pythagorean triples — every primitive triple comes from this formula.** Pick whole numbers m > n > 0 with GCD(m, n) = 1 and m − n odd. Then\n\n' +
        '`a = m² − n²,  b = 2mn,  c = m² + n²`\n\n' +
        'always gives a primitive Pythagorean triple (a, b, c). Examples:\n\n' +
        '| m, n | a = m² − n² | b = 2mn | c = m² + n² |\n' +
        '|------|-------------|---------|-------------|\n' +
        '| 2, 1 | 3 | 4 | 5 |\n' +
        '| 3, 2 | 5 | 12 | 13 |\n' +
        '| 4, 1 | 15 | 8 | 17 |\n' +
        '| 4, 3 | 7 | 24 | 25 |\n' +
        '| 5, 2 | 21 | 20 | 29 |\n\n' +
        '**The area of any triangle.** Three handy formulas, depending on what you know:\n\n' +
        '| Given | Area formula |\n' +
        '|-------|--------------|\n' +
        '| base b, height h | (1/2) × b × h |\n' +
        '| three sides a, b, c | Heron\'s formula: √[s(s−a)(s−b)(s−c)], where s = (a+b+c)/2 |\n' +
        '| two sides a, b and included angle C | (1/2) × a × b × sin C |\n\n' +
        '**Heron\'s formula example.** A triangular plot has sides 9, 12, 15 m. Area?\n\n' +
        '| Step | Calc |\n' +
        '|------|------|\n' +
        '| s = (9 + 12 + 15)/2 | 18 |\n' +
        '| s−a, s−b, s−c | 9, 6, 3 |\n' +
        '| Product s(s−a)(s−b)(s−c) | 18 × 9 × 6 × 3 = 2916 |\n' +
        '| Area = √2916 | **54 m²** |\n\n' +
        '(This is also a 9-12-15 right triangle, since 9² + 12² = 15². Quick check: ½ × 9 × 12 = 54 ✓.)',
      advancedContent:
        '**Generalisations of Pythagoras.**\n\n' +
        '**Law of cosines** — Pythagoras for *any* triangle:\n\n' +
        '`c² = a² + b² − 2ab·cos C`\n\n' +
        'where C is the angle opposite side c. Notice: if C = 90°, then cos C = 0, and this collapses back to the Pythagorean theorem.\n\n' +
        '**n-dimensional distance** — the same idea in higher dimensions:\n\n' +
        '`d² = (x₁−y₁)² + (x₂−y₂)² + ... + (xₙ−yₙ)²`\n\n' +
        'is exactly how a machine-learning algorithm computes "how similar are these two data points" using Euclidean distance in 100-dimensional feature space.\n\n' +
        '**Fermat\'s Last Theorem (1637 → 1995).** Pierre de Fermat scribbled in the margin of his copy of Diophantus\'s *Arithmetica*: "for n > 2, the equation aⁿ + bⁿ = cⁿ has no positive integer solutions. I have a truly marvellous proof of this proposition which this margin is too narrow to contain."\n\n' +
        'No proof of Fermat\'s. For n = 2, infinitely many solutions exist (every Pythagorean triple). For n ≥ 3, none. The conjecture stood for 358 years. Andrew Wiles announced a proof in 1993 using techniques (modular forms, elliptic curves, the Taniyama–Shimura conjecture) that did not exist in Fermat\'s lifetime — meaning either Fermat had a much more elementary argument no one has rediscovered, or his "marvellous proof" had a hole in it. Most mathematicians believe the latter.',
      diagram: 'TriangleExplorerDiagram',
      practice: practiceTriangles,
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Circles
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Circles',
      beginnerContent:
        '**Tara walks to the village pond.** It\'s perfectly round. She can stand at any point on the bank and the centre is always the same distance away. That property — *every point on the edge equally far from the centre* — is what makes a circle a circle.\n\n' +
        '[diagram:CircleVocabularyDiagram]\n\n' +
        '**The vocabulary of a circle.**\n\n' +
        '| Term | What it means |\n' +
        '|------|---------------|\n' +
        '| **Centre** | The middle point. Every other circle measurement is in relation to this. |\n' +
        '| **Radius** (r) | Distance from centre to any point on the circle. |\n' +
        '| **Diameter** (d) | A line through the centre, ending at both edges. **d = 2r**. The longest possible chord. |\n' +
        '| **Chord** | Any straight line connecting two points on the circle. |\n' +
        '| **Tangent** | A line touching the circle at exactly *one* point. Always perpendicular to the radius at that point. |\n' +
        '| **Arc** | A curved piece of the edge. |\n' +
        '| **Sector** | A "pie slice" — the region between two radii and the arc they enclose. |\n\n' +
        '**Three formulas to know.**\n\n' +
        '| Quantity | Formula |\n' +
        '|----------|---------|\n' +
        '| Diameter | d = 2r |\n' +
        '| **Circumference** (distance around) | C = 2πr (or πd) |\n' +
        '| **Area** (space enclosed) | A = πr² |\n\n' +
        'where **π ≈ 3.14159...** — the same number for *any* circle, the universal ratio of circumference to diameter.\n\n' +
        '**Walked example — pond perimeter and area.** Tara measures: from the centre to the bank is 8 m.\n\n' +
        '| Step | Calc | Result |\n' +
        '|------|------|--------|\n' +
        '| 1 | Diameter = 2 × 8 | 16 m |\n' +
        '| 2 | Circumference = 2π × 8 | ≈ 50.27 m |\n' +
        '| 3 | Area = π × 8² | ≈ 201.06 m² |\n\n' +
        'Walking around the pond is about 50 metres. Filling it up would take about 201 m³ of water per metre of depth.\n\n' +
        '**Sector area — what fraction of the pie?** A sector has area `(angle/360°) × πr²`. A 90° slice is a quarter of the full circle.\n\n' +
        '**Check yourself.** A bicycle wheel has diameter 70 cm. How far does it travel in one full rotation? *(C = π × 70 ≈ 220 cm = **2.2 m**.)*',
      intermediateContent:
        '**Arc length and sector area in radians.** When the central angle θ is measured in *radians* (rather than degrees), the formulas become beautifully simple:\n\n' +
        '`s = r · θ`  (arc length)\n`A = (1/2) r²θ`  (sector area)\n\n' +
        '**Worked example — pizza slice.** A 15 cm pizza is cut into 8 equal slices. Find the arc length and area of one slice.\n\n' +
        '| Step | Calc | Result |\n' +
        '|------|------|--------|\n' +
        '| 1 | One slice angle: 360°/8 = 45° | π/4 rad |\n' +
        '| 2 | Arc (crust) length: r × θ = 15 × π/4 | ≈ 11.78 cm |\n' +
        '| 3 | Sector area: ½ × 15² × π/4 | ≈ 88.36 cm² |\n\n' +
        '**Two beautiful theorems about angles in circles.**\n\n' +
        '**Inscribed angle theorem.** An angle inscribed in a circle (vertex on the edge, both sides chords) is *half* the central angle subtending the same arc.\n\n' +
        '**Thales\' theorem** (a special case): if you draw an angle inscribed in a *semicircle* (vertex on the arc, both sides ending at the diameter), it is *always* a right angle. This gave ancient builders a way to lay out a right angle with just a compass and a straightedge.',
      advancedContent:
        '**The equation of a circle in coordinates.** A circle of radius r centred at point (h, k) has equation\n\n' +
        '`(x − h)² + (y − k)² = r²`\n\n' +
        'This is just Pythagoras applied to the displacement (x − h, y − k) from the centre.\n\n' +
        '**In the complex plane**, a circle of radius r centred at z₀ is the set `|z − z₀| = r`.\n\n' +
        '**The isoperimetric inequality.** Among all closed curves of perimeter P, the circle encloses the maximum area:\n\n' +
        '`A ≤ P² / (4π)`,  with equality only for a circle.\n\n' +
        'This is why soap bubbles are spherical (a soap film minimises surface area for a given volume), why raindrops are nearly round, and why honeycombs use hexagons (the closest tessellating shape to circles).\n\n' +
        '**Apollonius circles.** Fix two points A and B in the plane. The set of all points P where the *ratio* `|PA| / |PB|` is constant is — surprisingly — *another circle*. This appears in:\n\n' +
        '- Electrostatics (equipotential surfaces around two point charges)\n' +
        '- Reflection-of-light problems\n' +
        '- The construction of conformal maps in complex analysis\n\n' +
        'Apollonius found this around 200 BCE. Modern physics keeps rediscovering reasons to care.',
      diagram: 'CirclePropertiesDiagram',
      practice: practiceCircles,
    },

    // ─────────────────────────────────────────────────────────────
    // 4. 3D Shapes
    // ─────────────────────────────────────────────────────────────
    {
      title: '3D Shapes: Volume and Surface Area',
      beginnerContent:
        '**Tara\'s family is buying a water drum for the village.** The shopkeeper says it\'s 1.2 metres tall and 1 metre across. Tara wants to know: *how many litres does it hold?* She isn\'t guessing — she\'s using geometry.\n\n' +
        '[diagram:WaterDrumVolumeDiagram]\n\n' +
        '**Two questions to ask about every 3D shape.**\n\n' +
        '| Question | What it tells you |\n' +
        '|----------|-------------------|\n' +
        '| **Volume** | How much *stuff* fits inside (water, air, sand) — measured in m³ or litres |\n' +
        '| **Surface area** | How much *material* covers the outside — measured in m² (e.g. how much sheet metal to make the drum) |\n\n' +
        '**The five shapes you\'ll meet most often.**\n\n' +
        '| Shape | Volume | Surface area |\n' +
        '|-------|--------|--------------|\n' +
        '| **Cube** (side s) | s³ | 6s² |\n' +
        '| **Box** (l × w × h) | l × w × h | 2(lw + lh + wh) |\n' +
        '| **Cylinder** (radius r, height h) | πr²h | 2πr² + 2πrh |\n' +
        '| **Sphere** (radius r) | (4/3)πr³ | 4πr² |\n' +
        '| **Cone** (radius r, height h) | (1/3)πr²h | πr√(r² + h²) + πr² |\n\n' +
        '**Walked example — Tara\'s water drum.** A cylinder, radius 0.5 m, height 1.2 m.\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | Volume = π × r² × h | π × 0.25 × 1.2 |\n' +
        '| 2 | Compute | ≈ 0.942 m³ |\n' +
        '| 3 | Convert to litres (1 m³ = 1,000 L) | **≈ 942 litres** |\n\n' +
        '| Step | Surface area | Calc |\n' +
        '|------|--------------|------|\n' +
        '| 1 | Two circular ends: 2πr² | 2 × π × 0.25 ≈ 1.57 m² |\n' +
        '| 2 | Curved side: 2πrh | 2 × π × 0.5 × 1.2 ≈ 3.77 m² |\n' +
        '| 3 | Total | **≈ 5.34 m²** |\n\n' +
        'So the drum holds 942 litres and needs 5.34 m² of metal sheeting to construct (ignoring overlap and seams).\n\n' +
        '**Check yourself.** A cubic box has side 30 cm. How much can it hold (in litres)? *(V = 0.3³ m³ = 0.027 m³ = **27 L**.)*',
      intermediateContent:
        '**Composite shapes — break them into pieces.** A grain silo might be a cylinder topped by a hemisphere. A pencil is a cylinder with a cone on the end. Most real-world objects are not pure shapes — they\'re combinations.\n\n' +
        '**Worked example — silo.** A grain silo: cylinder radius 3 m, height 8 m, with a hemispherical top of the same radius.\n\n' +
        '| Part | Formula | Volume |\n' +
        '|------|---------|--------|\n' +
        '| Cylinder | πr²h = π × 9 × 8 | 72π ≈ 226.2 m³ |\n' +
        '| Hemisphere | (1/2) × (4/3)πr³ = (2/3)π × 27 | 18π ≈ 56.5 m³ |\n' +
        '| **Total** | | **90π ≈ 282.7 m³** |\n\n' +
        '| Part | Surface area | Value |\n' +
        '|------|--------------|-------|\n' +
        '| Cylinder side (lateral) | 2πrh = 2π × 3 × 8 | 48π |\n' +
        '| Cylinder bottom | πr² = 9π | 9π |\n' +
        '| Hemisphere | (1/2) × 4πr² = 2π × 9 | 18π |\n' +
        '| **Total** | (no top circle — replaced by hemisphere) | **75π ≈ 235.6 m²** |\n\n' +
        'Notice: when joining parts, we *don\'t* count the surfaces that are now interior. The hemisphere replaces the cylinder\'s top — that area no longer exists as exterior.',
      advancedContent:
        '**Cavalieri\'s principle (1635) — a beautiful shortcut.** If two solids have the same cross-sectional area at every height, they have the same volume. Why? Because volume = sum of (area × tiny thickness) at each height — and if every slice matches, the total must match.\n\n' +
        '*Consequence.* A slanted (oblique) cylinder has the same volume as a right cylinder of the same height and base. The slant doesn\'t change anything because every horizontal slice is the same circle.\n\n' +
        'Cavalieri used this to derive volumes of cones, spheres, and pyramids without integration — 30 years before calculus existed.\n\n' +
        '**The volume of an n-dimensional sphere.** For a unit sphere (radius 1) in n dimensions:\n\n' +
        '`V_n = π^(n/2) / Γ(n/2 + 1)`\n\n' +
        '| n | V_n |\n' +
        '|---|-----|\n' +
        '| 1 | 2.000 (line segment of length 2) |\n' +
        '| 2 | 3.142 (disc, area π) |\n' +
        '| 3 | 4.189 ((4/3)π) |\n' +
        '| 4 | 4.935 |\n' +
        '| 5 | **5.264** ← peak |\n' +
        '| 6 | 5.168 |\n' +
        '| 10 | 2.550 |\n' +
        '| 20 | 0.026 |\n' +
        '| 100 | ~10⁻⁴⁰ |\n\n' +
        'The volume *peaks* at dimension n ≈ 5.26 then *shrinks*. A 100-dimensional unit sphere has essentially zero volume — and almost all the volume of a 100-dimensional cube sits in its corners.\n\n' +
        '**The "curse of dimensionality"** — this fact makes high-dimensional machine learning hard. Any dataset in 100-dimensional feature space is dominated by edge effects rather than interior structure. Algorithms designed for 2D or 3D intuition often fail badly above ~10 dimensions.',
      diagram: 'Volume3DDiagram',
      interactive: { type: 'python-playground', props: { starterCode: 'import math\n\n# Volumes and surface areas of common shapes\nprint("--- Cube (side = 0.5 m) ---")\ns = 0.5\nprint(f"Volume = {s**3:.4f} m³ = {s**3 * 1000:.1f} L")\nprint(f"Surface area = {6 * s**2:.4f} m²")\n\nprint("\\n--- Cylinder (r = 0.5, h = 1.2) ---")\nr, h = 0.5, 1.2\nprint(f"Volume = {math.pi * r**2 * h:.3f} m³ = {math.pi * r**2 * h * 1000:.0f} L")\nprint(f"Surface area = {2*math.pi*r**2 + 2*math.pi*r*h:.3f} m²")\n\nprint("\\n--- Sphere (r = 0.3) ---")\nr = 0.3\nprint(f"Volume = {(4/3) * math.pi * r**3:.4f} m³")\nprint(f"Surface area = {4 * math.pi * r**2:.4f} m²")\n', title: 'Try it — volumes & areas' } },
      practice: practiceVolumes,
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Transformations
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Transformations',
      beginnerContent:
        '**Tara picks up a traditional Assamese japi hat.** She holds it from above and slowly turns it. After every 45° rotation — *exactly* 45° — the woven pattern looks identical. Eight times around, the hat has done a full circle and shown the same image eight times.\n\n' +
        '[diagram:JapiRotationDiagram]\n\n' +
        '**A geometric transformation moves a shape to a new position, size, or orientation.** Three preserve shape and size (called **rigid** transformations); one changes size.\n\n' +
        '| Transformation | What it does | Real-world example |\n' +
        '|---------------|---------------|---------------------|\n' +
        '| **Translation** | Slide everything the same distance in the same direction | Pushing a book across a table |\n' +
        '| **Rotation** | Turn around a fixed point | A clock hand spinning |\n' +
        '| **Reflection** | Flip across a line (mirror) | Your face in a mirror |\n' +
        '| **Dilation** | Scale up or down (changes size, keeps shape) | Photo enlargement, photocopy reduction |\n\n' +
        '**Symmetry is a transformation that maps a shape onto itself.** Two main types:\n\n' +
        '| Type | Description | Examples |\n' +
        '|------|-------------|----------|\n' +
        '| **Line symmetry** (reflection symmetry) | One mirror axis; folding along it gives a perfect overlap | Butterfly (1 axis), human face (≈1 axis), letter A |\n' +
        '| **Rotational symmetry** | Looks the same after rotation by some angle less than 360° | Square (order 4: matches at 90°, 180°, 270°, 360°), starfish (order 5), japi hat (order 8) |\n\n' +
        'The "order" of rotational symmetry is how many distinct rotations leave the shape unchanged in 360°. A japi hat with 8-fold rotational symmetry has order 8 — turning by 45°, 90°, 135°, 180°, 225°, 270°, 315°, or 360° all leave it looking the same.\n\n' +
        '**Why this matters.** Recognising symmetry is a shortcut for builders, weavers, and engineers. To draw a snowflake, you only need to draw 1/6 of it — the symmetry handles the rest. Bridge engineers analyse half of a symmetric bridge and reflect the result. Tara\'s grandmother, who wove that japi, never thought "8-fold rotational symmetry" — but her hands followed a pattern that reduces work by a factor of 8.\n\n' +
        '**Check yourself.** What\'s the rotational symmetry order of an equilateral triangle? *(Three rotations leave it unchanged: 120°, 240°, 360°. Order **3**.)*',
      intermediateContent:
        '**Coordinate descriptions of each transformation.** Apply these rules to every point (x, y) of a shape:\n\n' +
        '| Transformation | Rule |\n' +
        '|---------------|------|\n' +
        '| Translate by (a, b) | (x, y) → (x + a, y + b) |\n' +
        '| Reflect across x-axis | (x, y) → (x, −y) |\n' +
        '| Reflect across y-axis | (x, y) → (−x, y) |\n' +
        '| Reflect across y = x | (x, y) → (y, x) |\n' +
        '| Rotate by θ about the origin | (x, y) → (x cos θ − y sin θ, x sin θ + y cos θ) |\n' +
        '| Dilation (scale) by k from origin | (x, y) → (kx, ky) |\n\n' +
        '**Worked example — rotate (3, 4) by 90° counterclockwise around the origin.**\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | cos 90° = 0, sin 90° = 1 | — |\n' +
        '| 2 | New x: 3 × 0 − 4 × 1 | −4 |\n' +
        '| 3 | New y: 3 × 1 + 4 × 0 | 3 |\n' +
        '| 4 | Result | **(−4, 3)** |\n\n' +
        '**Composition of transformations.** Applying two transformations in sequence is itself a transformation. Two reflections across parallel lines = a translation. Two reflections across intersecting lines = a rotation. This is why symmetry, in maths, is described by *groups* — closed sets of transformations under composition.',
      advancedContent:
        '**The 17 wallpaper groups.** A *wallpaper pattern* is a repeating pattern that fills a flat surface in two independent directions. Question: how many fundamentally different ways can you do this? Answer: **exactly 17**, no more.\n\n' +
        'This was proved by **Evgraf Stepanovich Fedorov (1891)**, before anyone could verify by computer. The 17 groups are distinguished by which symmetries they have — combinations of:\n\n' +
        '- Translations (forced by "wallpaper" definition — 2 independent ones)\n' +
        '- Rotations of order 1, 2, 3, 4, or 6 (no other order is possible — try a 5-fold rotational pattern that also tiles, and you\'ll fail; this is why the discovery of 5-fold quasicrystals shocked physics)\n' +
        '- Reflections and glide reflections\n\n' +
        '**The Alhambra palace in Granada, Spain (built ~13th–14th century).** Islamic geometric tiling adorns its walls. Decades after Fedorov\'s proof, mathematicians visited and confirmed: the Alhambra contains *all 17 wallpaper groups*. Master craftsmen working empirically, centuries before the proof, had found every distinct pattern type.\n\n' +
        '**3D crystal symmetry — 230 space groups.** Combining 3D translations with 3D rotations and reflections gives exactly **230** distinct space groups. This is the master classification of all possible *crystal structures* — the foundation of crystallography. Every mineral on Earth, every solid drug, every silicon chip\'s atomic lattice belongs to one of these 230 groups.\n\n' +
        '**Higher-dimensional generalisations.** In 4D, there are 4,894 space groups. In higher dimensions the count explodes. These classifications matter for theoretical physics — string theory and condensed-matter physics use 4D and higher symmetry groups regularly.',
      diagram: 'TransformationsDiagram',
      practice: practiceTransformations,
    },
  ],
};
