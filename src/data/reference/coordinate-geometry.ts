import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'coordinate-geometry',
  title: 'Coordinate Geometry',
  category: 'math',
  icon: '📐',
  tagline: 'Where algebra meets geometry — equations become shapes on a plane.',
  relatedStories: ['map-makers-granddaughter', 'dragonfly-and-the-paddy-field'],
  understand: [
    {
      title: 'Distance Between Two Points',
      beginnerContent:
        '**The Cartesian coordinate system** (Descartes, 1637) places every point on a plane using two numbers: **x** (horizontal) and **y** (vertical).\n\n' +
        '**Distance formula** (from the Pythagorean theorem):\n\n' +
        '`d = sqrt[(x2 - x1)² + (y2 - y1)²]`\n\n' +
        'The horizontal and vertical differences form the legs of a right triangle; the distance is the hypotenuse.\n\n' +
        '**Example: Guwahati to Jorhat**\n\n' +
        '| City | Approx. coordinates |\n' +
        '|------|--------------------|\n' +
        '| Guwahati | (91.7°E, 26.1°N) |\n' +
        '| Jorhat | (94.2°E, 26.8°N) |\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Longitude diff | 2.5° x 100 km/° | 250 km |\n' +
        '| Latitude diff | 0.7° x 111 km/° | 78 km |\n' +
        '| Distance | sqrt(250² + 78²) | **~262 km** |\n\n' +
        'GPS uses the spherical **haversine formula** for curved-surface accuracy, but for short distances within Assam the flat approximation works well.',
      intermediateContent:
        '**3D distance formula:**\n\n' +
        '`d = sqrt[(x2-x1)² + (y2-y1)² + (z2-z1)²]`\n\n' +
        '**Worked example:** Two GPS points including altitude:\n\n' +
        '| Component | Difference |\n' +
        '|-----------|----------|\n' +
        '| dx | 2.5° x 100 km = 250 km |\n' +
        '| dy | 0.7° x 111 km = 78 km |\n' +
        '| dz | 0.05 km |\n' +
        '| **Distance** | **~261.9 km** |\n\n' +
        'The altitude contribution is negligible — horizontal distances dominate for surface navigation.',
      advancedContent:
        '**Why flat-plane breaks down at scale:**\n\n' +
        'The **haversine formula** accounts for Earth\'s curvature:\n\n' +
        '`d = 2R * arcsin(sqrt[sin²(dphi/2) + cos(phi1) cos(phi2) sin²(dlambda/2)])`\n\n' +
        'where R = 6,371 km.\n\n' +
        '| Route | Flat approx | Great circle | Error |\n' +
        '|-------|-----------|-------------|-------|\n' +
        '| Guwahati-Delhi (~1,800 km) | ~0.3% | baseline | small |\n' +
        '| London-Sydney | ~16,500 km | ~16,983 km | significant |\n\n' +
        '**Vincenty\'s formulae** improve accuracy to millimetres using an ellipsoidal Earth model.',
      diagram: 'CoordinatePlaneDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import math\n\n# Distance and midpoint calculator\nx1, y1 = 1, 2\nx2, y2 = 4, 6\n\ndist = math.sqrt((x2-x1)**2 + (y2-y1)**2)\nmid_x = (x1 + x2) / 2\nmid_y = (y1 + y2) / 2\nslope = (y2 - y1) / (x2 - x1)\n\nprint(f"Point A: ({x1}, {y1})")\nprint(f"Point B: ({x2}, {y2})")\nprint(f"Distance: {dist:.2f}")\nprint(f"Midpoint: ({mid_x}, {mid_y})")\nprint(f"Slope: {slope:.2f}")\n\n# Try your own points!\n# Change x1,y1 and x2,y2 above', title: 'Try it — Distance & Midpoint' } },
    },
    {
      title: 'Midpoint and Slope',
      beginnerContent:
        '**Midpoint formula — the average of the coordinates:**\n\n' +
        '`M = ((x1 + x2)/2, (y1 + y2)/2)`\n\n' +
        '**Example:** Bridge between villages at (2, 5) and (8, 11).\n\n' +
        'Midpoint = ((2+8)/2, (5+11)/2) = **(5, 8)** — where the central support pillar stands.\n\n' +
        '**Slope — the steepness of a line:**\n\n' +
        '`m = (y2 - y1) / (x2 - x1) = rise / run`\n\n' +
        '| Slope value | Meaning |\n' +
        '|------------|--------|\n' +
        '| Positive | Line rises left to right |\n' +
        '| Negative | Line falls left to right |\n' +
        '| Zero | Horizontal line |\n' +
        '| Undefined | Vertical line (run = 0) |\n' +
        '| 1 | 45° angle |\n\n' +
        '**Key relationships:**\n\n' +
        '- **Parallel lines** have equal slopes\n' +
        '- **Perpendicular lines** have slopes that multiply to -1: if one has slope m, the other has slope -1/m\n\n' +
        'A line with slope 2 is perpendicular to a line with slope -1/2.',
      intermediateContent:
        '**Worked example:**\n\n' +
        'Line L1 passes through (1, 3) and (4, 9), so m1 = (9-3)/(4-1) = 2.\n\n' +
        '| Task | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Perpendicular slope | m2 = -1/m1 | -1/2 |\n' +
        '| Line through (4, 9) | y - 9 = -1/2(x - 4) | y = -x/2 + 11 |\n\n' +
        '**Angle between two lines:** `theta = arctan(|(m1 - m2) / (1 + m1*m2)|)`',
      advancedContent:
        '**From slope to calculus:**\n\n' +
        'The slope of the secant line between (x, f(x)) and (x+h, f(x+h)) is `[f(x+h) - f(x)]/h`. As h approaches 0, this becomes the **derivative** f\'(x) — the instantaneous slope.\n\n' +
        '**Example:** For y = x², the derivative is 2x:\n\n' +
        '- At x = 3: slope = 6\n' +
        '- At x = -1: slope = -2\n' +
        '- Tangent line at (3, 9): y = 6x - 9\n\n' +
        'This bridge between algebra and calculus is why coordinate geometry is called **analytic geometry**.',
    },
    {
      title: 'Equation of a Line',
      beginnerContent:
        '**Three forms of a line equation:**\n\n' +
        '| Form | Equation | Best for |\n' +
        '|------|---------|----------|\n' +
        '| Slope-intercept | y = mx + b | Graphing (m = slope, b = y-intercept) |\n' +
        '| Point-slope | y - y1 = m(x - x1) | When you know slope + one point |\n' +
        '| General | Ax + By + C = 0 | Any line, including vertical |\n\n' +
        '**Example:** A line with slope 3 and y-intercept -2 is `y = 3x - 2`. Plug in any x to get y.\n\n' +
        '**Point-slope example:** A drone passes through (4, 7) descending at slope -0.5:\n\n' +
        '`y - 7 = -0.5(x - 4)` which simplifies to `y = -0.5x + 9`\n\n' +
        '**Finding where two lines meet:**\n\n' +
        'Line 1: y = 2x + 1, Line 2: y = -x + 7\n\n' +
        '| Step | Operation | Result |\n' +
        '|------|-----------|--------|\n' +
        '| Set equal | 2x + 1 = -x + 7 | |\n' +
        '| Solve | 3x = 6 | x = 2 |\n' +
        '| Substitute | y = 2(2) + 1 | y = 5 |\n' +
        '| **Intersection** | | **(2, 5)** |\n\n' +
        'This technique — solving systems of linear equations — is the foundation of linear algebra and is used millions of times per second in computer graphics and GPS.',
      intermediateContent:
        '**Choosing the right form:**\n\n' +
        '| Form | Best use case |\n' +
        '|------|-------------|\n' +
        '| Slope-intercept | Quick graphing |\n' +
        '| Point-slope | Given a point and slope |\n' +
        '| Standard (Ax + By = C) | Systems of equations |\n\n' +
        '**Converting:** 3x - 2y = 12 becomes y = (3/2)x - 6 in slope-intercept form.\n\n' +
        '**Distance from a point to a line:**\n\n' +
        '`d = |Ax0 + By0 + C| / sqrt(A² + B²)`\n\n' +
        'Example: distance from (3, 1) to 4x - 3y + 2 = 0 is |12 - 3 + 2|/sqrt(16+9) = 11/5 = **2.2 units**.',
      advancedContent:
        '**Linear regression — fitting the "best" line:**\n\n' +
        'Minimize the sum of squared vertical distances (least squares).\n\n' +
        '- Best-fit slope: `m = [n*sum(xi*yi) - sum(xi)*sum(yi)] / [n*sum(xi²) - (sum(xi))²]`\n' +
        '- Intercept: `b = y_bar - m*x_bar`\n' +
        '- **Correlation coefficient** r (from -1 to +1) measures how tightly data clusters around the line\n\n' +
        'In **multiple regression**, y = b0 + b1*x1 + b2*x2 + ... + bn*xn — the "line" becomes a hyperplane. This is the mathematical foundation of predictive modeling in science, economics, and machine learning.',
      diagram: 'SlopeInterceptDiagram',
    },
    {
      title: 'Conic Sections',
      beginnerContent:
        '**Slicing a cone at different angles produces four curves:**\n\n' +
        '| Cut angle | Shape | Standard equation |\n' +
        '|-----------|-------|------------------|\n' +
        '| Horizontal | Circle | x² + y² = r² |\n' +
        '| Tilted | Ellipse | x²/a² + y²/b² = 1 |\n' +
        '| Parallel to side | Parabola | y = (1/4p)x² |\n' +
        '| Steeper than side | Hyperbola | x²/a² - y²/b² = 1 |\n\n' +
        '**Where conics appear in the real world:**\n\n' +
        '- **Ellipses** — every planet orbits the Sun in an ellipse (Kepler\'s First Law). Earth\'s orbit has eccentricity 0.017, nearly circular\n' +
        '- **Parabolas** — satellite dishes and headlights use parabolic reflectors (all parallel rays focus to one point)\n' +
        '- **Hyperbolas** — power plant cooling towers use the shape for structural strength with minimal material\n\n' +
        'Even a cricket ball thrown at 45° follows a parabolic path (neglecting air resistance) — reaching ~10.2 m high and landing ~40.8 m away at 20 m/s.',
      intermediateContent:
        '**Focus-directrix definition:** The ratio of distance-to-focus over distance-to-directrix equals the **eccentricity** e.\n\n' +
        '| Conic | Eccentricity | Example |\n' +
        '|-------|-----------|---------|\n' +
        '| Circle | e = 0 | Perfect circle |\n' +
        '| Ellipse | 0 < e < 1 | Earth orbit (e = 0.017) |\n' +
        '| Parabola | e = 1 | Projectile path |\n' +
        '| Hyperbola | e > 1 | Escape trajectory |\n\n' +
        'Halley\'s Comet has e = 0.967 — an extremely elongated ellipse.\n\n' +
        '**Worked example:** A parabolic satellite dish y = x²/40 has focus at (0, 10). The receiver should be placed **10 cm above the centre**.',
      advancedContent:
        '**General second-degree equation:** `Ax² + Bxy + Cy² + Dx + Ey + F = 0`\n\n' +
        'The discriminant B² - 4AC determines the type:\n\n' +
        '| Discriminant | Conic |\n' +
        '|-------------|-------|\n' +
        '| Negative | Ellipse (circle if A=C, B=0) |\n' +
        '| Zero | Parabola |\n' +
        '| Positive | Hyperbola |\n\n' +
        'In **projective geometry**, all conics are equivalent — a circle viewed at an angle becomes an ellipse. Kepler\'s laws state orbits are conics with the Sun at one focus. The **vis-viva equation** `v² = GM(2/r - 1/a)` relates orbital speed to position — used for spacecraft trajectory corrections.',
      diagram: 'ConicSectionsDiagram',
    },
  ],
};
