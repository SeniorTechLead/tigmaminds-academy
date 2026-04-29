import type { ReferenceGuide } from '../reference';
import { practiceDistance, practiceMidpointSlope, practiceLineEquation, practiceConics } from '../practice-coordinate-geometry';

export const guide: ReferenceGuide = {
  slug: 'coordinate-geometry',
  title: 'Coordinate Geometry',
  category: 'math',
  icon: '📐',
  tagline: 'Where algebra meets geometry — equations become shapes on a plane.',
  relatedStories: ['map-makers-granddaughter', 'dragonfly-and-the-paddy-field'],
  understand: [
    // ─────────────────────────────────────────────────────────────
    // 1. Distance Between Two Points
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Distance Between Two Points',
      beginnerContent:
        '**Tara is in Guwahati. Bipin is across town.** Tara wants to know: in a *straight line* (as the crow flies), how far apart are we? Walking through the streets she\'d zig-zag — but the bird\'s-eye distance is shorter.\n\n' +
        '[diagram:CityMapDistanceDiagram]\n\n' +
        '**The Cartesian system** (René Descartes, 1637) labels every point on a flat surface using two numbers — **x** (horizontal) and **y** (vertical). Tara is at A = (1, 1). Bipin is at B = (8, 5). The distance between them comes from one of the oldest ideas in mathematics — the **Pythagorean theorem**.\n\n' +
        '**The distance formula.**\n\n' +
        '`d = √[(x₂ − x₁)² + (y₂ − y₁)²]`\n\n' +
        'It\'s just Pythagoras: the horizontal step Δx and the vertical step Δy form the legs of a right triangle, and d is the hypotenuse.\n\n' +
        '**Walked example — Tara to Bipin.**\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | Δx = x₂ − x₁ = 8 − 1 | 7 blocks |\n' +
        '| 2 | Δy = y₂ − y₁ = 5 − 1 | 4 blocks |\n' +
        '| 3 | Apply Pythagoras: d = √(Δx² + Δy²) = √(49 + 16) | √65 |\n' +
        '| 4 | Compute | **≈ 8.06 blocks** |\n\n' +
        'Walking the streets is 11 blocks (7 + 4). The crow flies 8.06 blocks. The shortcut saves about 27%.\n\n' +
        '**City-scale example — Guwahati to Jorhat.** Two cities in Assam, both on roughly flat ground:\n\n' +
        '| City | Approx. coordinates |\n' +
        '|------|---------------------|\n' +
        '| Guwahati | 91.7° E, 26.1° N |\n' +
        '| Jorhat | 94.2° E, 26.8° N |\n\n' +
        '| Step | Calc | Result |\n' +
        '|------|------|--------|\n' +
        '| 1 | Longitude diff: 2.5° × ~100 km/° | 250 km east |\n' +
        '| 2 | Latitude diff: 0.7° × 111 km/° | 78 km north |\n' +
        '| 3 | Distance = √(250² + 78²) | **≈ 262 km** |\n\n' +
        'Real road distance is closer to 305 km because roads bend. But for *as the crow flies*, this is correct.\n\n' +
        '**Where the formula shows up.**\n\n' +
        '| Setting | What is being measured |\n' +
        '|---------|------------------------|\n' +
        '| GPS (apps showing "1.4 km away") | Distance from your phone to a destination |\n' +
        '| Game development | Whether two characters are within attack range |\n' +
        '| Robotics | Distance to nearest obstacle |\n' +
        '| Astronomy | Apparent distance between two stars |\n' +
        '| Image recognition | Pixel-distance between feature points |\n\n' +
        '**Check yourself.** Two friends are at (0, 0) and (3, 4). What\'s the straight-line distance? *(Pythagoras: √(9 + 16) = √25 = **5**.)*',
      intermediateContent:
        '**Distance in 3D** — same idea, one more axis:\n\n' +
        '`d = √[(x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²]`\n\n' +
        'Used in 3D games, drone navigation, and any time altitude matters.\n\n' +
        '**Worked example — drone height matters.** A drone is currently at (50, 30, 20) metres (x, y, altitude). Its target is at (60, 40, 100) metres.\n\n' +
        '| Component | Difference | Squared |\n' +
        '|-----------|-----------|---------|\n' +
        '| Δx | 10 | 100 |\n' +
        '| Δy | 10 | 100 |\n' +
        '| Δz | 80 | 6400 |\n' +
        '| Sum | | **6600** |\n' +
        '| d = √6600 | | **≈ 81.2 m** |\n\n' +
        'The drone has to climb 80 m and fly only 14 m horizontally. Altitude dominates the distance.',
      advancedContent:
        '**The flat-plane approximation breaks down at scale.** When distances are large, Earth\'s curvature matters. The **haversine formula** computes great-circle distance between two latitude-longitude pairs:\n\n' +
        '`d = 2R · arcsin(√[sin²(Δφ/2) + cos φ₁ · cos φ₂ · sin²(Δλ/2)])`\n\n' +
        'where R = 6,371 km is Earth\'s radius.\n\n' +
        '**Errors of using flat-Earth distance.**\n\n' +
        '| Route | Length | Flat-plane error |\n' +
        '|-------|--------|------------------|\n' +
        '| Guwahati ↔ Jorhat (~260 km) | short | ~0.05% (negligible) |\n' +
        '| Mumbai ↔ Delhi (~1100 km) | medium | ~0.3% |\n' +
        '| London ↔ Sydney (~17,000 km) | long | several percent |\n\n' +
        '**Vincenty\'s formulae (1975)** improve haversine accuracy to millimetres by using an *ellipsoidal* (slightly oblate) Earth model. GPS receivers use Vincenty internally to give you that "1.4 km" reading on your phone.',
      diagram: 'CoordinatePlaneDiagram',
      interactive: { type: 'python-playground', props: { starterCode: 'import math\n\n# Distance between two points\nx1, y1 = 1, 1\nx2, y2 = 8, 5\n\ndx = x2 - x1\ndy = y2 - y1\nd = math.sqrt(dx**2 + dy**2)\n\nprint(f"From ({x1}, {y1}) to ({x2}, {y2})")\nprint(f"  Δx = {dx}, Δy = {dy}")\nprint(f"  Distance ≈ {d:.3f}")\n\n# Try your own points!\n', title: 'Try it — distance formula' } },
      practice: practiceDistance,
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Midpoint and Slope
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Midpoint and Slope',
      beginnerContent:
        '**Two villages, one river between them.** Tara is in Village A at (2, 5). Bipin is in Village B at (8, 11). They want to build a bridge connecting the two — and they need a central support pillar exactly halfway across. Where does the pillar go?\n\n' +
        '[diagram:BridgeMidpointDiagram]\n\n' +
        '**The midpoint formula — average the coordinates.**\n\n' +
        '`M = ((x₁ + x₂)/2, (y₁ + y₂)/2)`\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | Average the x-coords | (2 + 8)/2 = 5 |\n' +
        '| 2 | Average the y-coords | (5 + 11)/2 = 8 |\n' +
        '| 3 | Midpoint | **M = (5, 8)** |\n\n' +
        '**Slope — how steep is the line connecting them?**\n\n' +
        '`m = (y₂ − y₁) / (x₂ − x₁) = rise / run`\n\n' +
        '| Slope | What it looks like |\n' +
        '|-------|--------------------|\n' +
        '| Positive (m > 0) | Line rises as you go right (uphill) |\n' +
        '| Negative (m < 0) | Line falls as you go right (downhill) |\n' +
        '| Zero (m = 0) | Horizontal line — perfectly flat |\n' +
        '| Undefined | Vertical line — Δx = 0, division by zero |\n' +
        '| m = 1 | Exact 45° upward |\n' +
        '| m = −1 | Exact 45° downward |\n\n' +
        '**Walked example.** Slope from Village A (2, 5) to Village B (8, 11):\n\n' +
        '| Step | Calc | Result |\n' +
        '|------|------|--------|\n' +
        '| 1 | rise = 11 − 5 | 6 |\n' +
        '| 2 | run = 8 − 2 | 6 |\n' +
        '| 3 | slope = 6/6 | **1** |\n\n' +
        'A slope of 1 means the line rises one unit for every unit of horizontal travel — a 45° angle.\n\n' +
        '**Two important slope relationships.**\n\n' +
        '| Lines | Relation between their slopes |\n' +
        '|-------|--------------------------------|\n' +
        '| **Parallel** (never meet) | Equal slopes: m₁ = m₂ |\n' +
        '| **Perpendicular** (meet at 90°) | Slopes multiply to −1: m₁ · m₂ = −1, i.e. m₂ = −1/m₁ |\n\n' +
        'A line with slope 2 is perpendicular to a line with slope −½. (2 × −½ = −1 ✓)\n\n' +
        '**Check yourself.** What\'s the slope of the line through (1, 4) and (5, 12)? *(rise/run = 8/4 = **2**.)*',
      intermediateContent:
        '**Building a perpendicular line through a given point.**\n\n' +
        'Line L₁ passes through (1, 3) and (4, 9), so its slope is m₁ = (9 − 3)/(4 − 1) = **2**.\n\n' +
        '| Task | Reasoning | Result |\n' +
        '|------|-----------|--------|\n' +
        '| Slope of L₂ ⊥ L₁ | m₂ = −1/m₁ = −1/2 | −½ |\n' +
        '| L₂ passes through (4, 9) | Use point-slope: y − 9 = −½(x − 4) | y = −x/2 + 11 |\n' +
        '| Verify slopes multiply to −1 | 2 × (−½) | = −1 ✓ |\n\n' +
        '**Angle between two intersecting lines.** Given slopes m₁ and m₂:\n\n' +
        '`tan θ = |(m₁ − m₂) / (1 + m₁·m₂)|`\n\n' +
        'For m₁ = 2 and m₂ = −1: tan θ = |(2 − (−1)) / (1 + 2·(−1))| = |3 / −1| = 3, so θ = arctan(3) ≈ **71.57°**.\n\n' +
        '**Why the slope formula doesn\'t care about order.** Swap (x₁, y₁) and (x₂, y₂): both numerator and denominator change sign, the ratio doesn\'t. Slope of A→B equals slope of B→A.',
      advancedContent:
        '**From slope to calculus — the leap that built modern physics.** The slope of a line through two points is well-defined. But what\'s the slope of a *curve* at a single point?\n\n' +
        'Idea: pick two points (x, f(x)) and (x + h, f(x + h)) on the curve. The slope of the line connecting them — the **secant slope** — is\n\n' +
        '`(f(x + h) − f(x)) / h`\n\n' +
        'Now let h shrink toward 0. The secant line rotates and eventually becomes the *tangent* line at the single point x. The limit is the **derivative**:\n\n' +
        '`f\'(x) = lim_{h → 0} [f(x + h) − f(x)] / h`\n\n' +
        '**Worked example — y = x², instantaneous slope.**\n\n' +
        '`f(x + h) − f(x) = (x + h)² − x² = 2xh + h²`\n\n' +
        'Divide by h: `(2xh + h²)/h = 2x + h`. Take the limit as h → 0: **f\'(x) = 2x**.\n\n' +
        'So at x = 3, the slope of y = x² is 6 — meaning the tangent line at (3, 9) has equation y = 6x − 9.\n\n' +
        '**This is why coordinate geometry is also called *analytic geometry*.** Using algebra (coordinates and equations), we can compute properties of curves that pure Euclidean geometry could not. Newton\'s mechanics, Maxwell\'s electromagnetism, Einstein\'s relativity — every modern physical theory is built on this bridge.',
      practice: practiceMidpointSlope,
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Equation of a Line
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Equation of a Line',
      beginnerContent:
        '**Tara is at the bus station with a question.** A bus leaves Guwahati at 9 AM heading east at 60 km/h. A train leaves Jorhat (300 km east) at the same time, heading west at 90 km/h. *When and where do they meet?*\n\n' +
        '[diagram:TwoLinesIntersectDiagram]\n\n' +
        'Each vehicle\'s position over time is a *line* on a (time, distance) graph. Where the lines cross is the answer. Equations of lines turn this kind of question into algebra.\n\n' +
        '**Three ways to write a line.**\n\n' +
        '| Form | Equation | Best when... |\n' +
        '|------|----------|--------------|\n' +
        '| **Slope-intercept** | y = mx + b | You want to graph quickly (m = slope, b = where it crosses y-axis) |\n' +
        '| **Point-slope** | y − y₁ = m(x − x₁) | You know one point on the line and the slope |\n' +
        '| **Standard / general** | Ax + By + C = 0 | You\'re solving a system of equations (or it\'s a vertical line) |\n\n' +
        '**Walked example — slope-intercept form.** A line has slope 3 and crosses the y-axis at (0, −2):\n\n' +
        '`y = 3x − 2`\n\n' +
        'To find any y, plug in x. At x = 4: y = 12 − 2 = 10. The point (4, 10) is on this line.\n\n' +
        '**Walked example — point-slope form.** A drone at (4, 7) is descending at slope −0.5. Equation of its path?\n\n' +
        '| Step | Reasoning | Result |\n' +
        '|------|-----------|--------|\n' +
        '| 1 | Use y − y₁ = m(x − x₁) with point (4, 7), slope −0.5 | y − 7 = −0.5(x − 4) |\n' +
        '| 2 | Distribute | y − 7 = −0.5x + 2 |\n' +
        '| 3 | Add 7 | **y = −0.5x + 9** |\n\n' +
        '**Walked example — Tara\'s bus question.** Bus distance from Guwahati: y = 60t (line with slope 60, intercept 0). Train distance from Guwahati: y = 300 − 90t (slope −90, intercept 300). They meet when these are equal:\n\n' +
        '| Step | Action | Result |\n' +
        '|------|--------|--------|\n' +
        '| 1 | Set the two equal | 60t = 300 − 90t |\n' +
        '| 2 | Add 90t to both sides | 150t = 300 |\n' +
        '| 3 | Solve for t | **t = 2 hours** |\n' +
        '| 4 | Substitute back to find y | y = 60 × 2 = **120 km** |\n' +
        '| 5 | Final | They meet 2 hours later, 120 km east of Guwahati |\n\n' +
        'Setting two equations equal and solving — this is one of the most useful manoeuvres in all of maths. It\'s the foundation of linear algebra, and graphics chips do this kind of intersection-finding millions of times per second when rendering 3D scenes.\n\n' +
        '**Check yourself.** Two lines y = 2x + 3 and y = −x + 9 intersect where? *(Solve 2x + 3 = −x + 9 → 3x = 6 → x = 2 → y = 7. Intersection: **(2, 7)**.)*',
      intermediateContent:
        '**Converting between forms.** Each form has its own purpose, but they all describe the same line.\n\n' +
        '| Start | Goal | Action |\n' +
        '|-------|------|--------|\n' +
        '| 3x − 2y = 12 (standard) | y = mx + b (slope-int) | Solve for y: −2y = −3x + 12 → y = (3/2)x − 6 |\n' +
        '| y = 4x + 5 (slope-int) | Ax + By + C = 0 (standard) | Move all to LHS: 4x − y + 5 = 0 |\n' +
        '| Two points (1, 3), (5, 11) | y = mx + b | Slope = 8/4 = 2; through (1, 3): y − 3 = 2(x − 1) → y = 2x + 1 |\n\n' +
        '**Distance from a point to a line — formula.**\n\n' +
        'For line Ax + By + C = 0 and point (x₀, y₀):\n\n' +
        '`d = |A·x₀ + B·y₀ + C| / √(A² + B²)`\n\n' +
        '*Worked example.* Distance from point (3, 1) to line 4x − 3y + 2 = 0:\n\n' +
        '| Step | Calc | Result |\n' +
        '|------|------|--------|\n' +
        '| 1 | Numerator: |4·3 + (−3)·1 + 2| = |12 − 3 + 2| | 11 |\n' +
        '| 2 | Denominator: √(16 + 9) | 5 |\n' +
        '| 3 | d = 11/5 | **2.2 units** |\n\n' +
        'Used in everything from ruler-distance algorithms in CAD software to figuring out the closest a planet got to a passing comet.',
      advancedContent:
        '**Linear regression — fitting the "best" line to scattered data.** Given n data points (xᵢ, yᵢ), what straight line y = mx + b best summarises the trend?\n\n' +
        'Definition of "best": minimise the sum of squared vertical distances from each point to the line — the **least-squares** criterion. Calculus gives the closed-form:\n\n' +
        '`m = [n·Σ(xᵢyᵢ) − Σxᵢ · Σyᵢ] / [n·Σ(xᵢ²) − (Σxᵢ)²]`\n`b = ȳ − m·x̄`  (where x̄, ȳ are means)\n\n' +
        '**The correlation coefficient** r ∈ [−1, +1] measures how tightly data clusters around the line:\n\n' +
        '| r | Meaning |\n' +
        '|---|---------|\n' +
        '| +1 | Perfect positive linear relationship |\n' +
        '| 0 | No linear relationship at all |\n' +
        '| −1 | Perfect negative linear relationship |\n' +
        '| 0.7+ | Strong positive |\n' +
        '| 0.3 | Weak relationship |\n\n' +
        '**Multiple regression** generalises the line to a *hyperplane*: y = b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ. Same algebra, more dimensions. This is the core mechanic underlying:\n\n' +
        '- Predicting house prices from size, location, age (regression)\n' +
        '- Predicting calorie intake from various food groups\n' +
        '- Calibrating sensors against ground-truth measurements\n' +
        '- The first layer of every neural network (a weighted sum is a hyperplane)\n\n' +
        '**Why "y = mx + b" matters far beyond high school.** Solving systems of linear equations is the bread-and-butter of:\n\n' +
        '| Field | Use |\n' +
        '|-------|-----|\n' +
        '| Computer graphics | Every triangle on screen has its edges defined by line equations; rendering finds where rays hit them |\n' +
        '| GPS / surveying | Triangulation = solving for the point that satisfies multiple distance equations |\n' +
        '| Operations research | Linear programming optimises over thousands of linear constraints |\n' +
        '| Quantum mechanics | Schrödinger equation in matrix form is a system of linear equations |\n' +
        '| Machine learning | Logistic regression, linear regression, support vector machines — all linear at heart |',
      diagram: 'SlopeInterceptDiagram',
      practice: practiceLineEquation,
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Conic Sections
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Conic Sections',
      beginnerContent:
        '**Tara stares at a poster on the planetarium wall.** Earth orbits the Sun in an almost-perfect circle. Halley\'s Comet orbits in a long thin loop, swinging close to the Sun once every 76 years before disappearing into the outer solar system. Both paths are *ellipses* — but with very different "stretchiness."\n\n' +
        '[diagram:PlanetOrbitsDiagram]\n\n' +
        '**The remarkable fact.** Take an ice-cream cone. Slice through it with a flat knife. Depending on the angle of your cut, you get one of four shapes:\n\n' +
        '| Cut angle | Shape | Standard equation |\n' +
        '|-----------|-------|-------------------|\n' +
        '| Horizontal (perpendicular to cone axis) | **Circle** | x² + y² = r² |\n' +
        '| Tilted but not too steep | **Ellipse** | x²/a² + y²/b² = 1 |\n' +
        '| Parallel to the cone\'s side | **Parabola** | y = (1/4p)·x² |\n' +
        '| Steeper than the cone\'s side | **Hyperbola** | x²/a² − y²/b² = 1 |\n\n' +
        'These are the **conic sections**. They have appeared in human knowledge for 2,300 years (Apollonius of Perga, ~200 BCE).\n\n' +
        '**Where each conic shows up in the real world.**\n\n' +
        '| Conic | Example |\n' +
        '|-------|---------|\n' +
        '| **Circle** | Cross-section of a tree trunk. Wheels. The shape light travels in equal time from a flash bulb. |\n' +
        '| **Ellipse** | Every planet orbits the Sun in an ellipse (Kepler\'s First Law, 1609). Earth\'s eccentricity is just 0.017 — almost circular. |\n' +
        '| **Parabola** | The path a thrown cricket ball follows (ignoring air resistance). The cross-section of a satellite dish or car headlight reflector. |\n' +
        '| **Hyperbola** | The shape of a power-plant cooling tower. The orbital path of an interstellar object passing through our solar system. |\n\n' +
        '**A cricket ball example.** Throw a ball at 20 m/s at 45° above horizontal. Ignoring air drag, it traces a *perfect parabola*, reaching ≈ 10.2 m peak height and landing ≈ 40.8 m away. The maths is the same equation that describes a satellite-dish reflector.\n\n' +
        '**Check yourself.** A satellite dish points at the sky and focuses signals at one point — its **focus**. Why does the dish need to be a parabola, not a circle? *(All rays parallel to the dish\'s axis converge at the focus only for a parabola. A circular dish would send signals to many different points instead of focusing them.)*',
      intermediateContent:
        '**Eccentricity — the single number that tells you which conic.** Define it as the ratio of distances from any point on the curve to a fixed *focus* and a fixed *directrix* line:\n\n' +
        '`e = (distance to focus) / (distance to directrix)`\n\n' +
        '| Eccentricity | Conic |\n' +
        '|--------------|-------|\n' +
        '| e = 0 | Circle (focus collapses to centre) |\n' +
        '| 0 < e < 1 | Ellipse (more elongated as e → 1) |\n' +
        '| e = 1 | Parabola |\n' +
        '| e > 1 | Hyperbola |\n\n' +
        '**Real eccentricities, real worlds.**\n\n' +
        '| Object | e | Notes |\n' +
        '|--------|---|-------|\n' +
        '| Earth\'s orbit | 0.017 | Practically a circle |\n' +
        '| Mars | 0.093 | Slight ellipse |\n' +
        '| Mercury | 0.206 | Most elliptical of the planets |\n' +
        '| Halley\'s Comet | 0.967 | Very stretched ellipse — perihelion 0.6 AU, aphelion 35 AU |\n' +
        '| ʻOumuamua (2017) | 1.20 | Hyperbolic — first known interstellar visitor |\n\n' +
        '**Worked example — finding a parabolic dish\'s focus.** A cross-section of a satellite dish has equation y = x²/40. Where should the receiver go?\n\n' +
        '| Step | Reasoning | Result |\n' +
        '|------|-----------|--------|\n' +
        '| 1 | Compare to standard form y = (1/4p)x² | 1/(4p) = 1/40 |\n' +
        '| 2 | Solve for p | p = 10 |\n' +
        '| 3 | Focus is at (0, p) | **(0, 10) — 10 cm above the centre** |\n\n' +
        'Place the receiver 10 cm above the dish\'s lowest point and you\'ll catch every signal that arrives parallel to the axis.',
      advancedContent:
        '**The general second-degree equation in two variables.**\n\n' +
        '`Ax² + Bxy + Cy² + Dx + Ey + F = 0`\n\n' +
        'The shape this describes is determined by the **discriminant** Δ = B² − 4AC:\n\n' +
        '| Discriminant | Shape |\n' +
        '|--------------|-------|\n' +
        '| Δ < 0 | Ellipse (a circle if A = C and B = 0) |\n' +
        '| Δ = 0 | Parabola |\n' +
        '| Δ > 0 | Hyperbola |\n\n' +
        '**Kepler\'s laws — physics meets conics.** Johannes Kepler (1571–1630), analysing decades of Tycho Brahe\'s naked-eye planetary observations, discovered:\n\n' +
        '1. **Every planet orbits the Sun in an ellipse, with the Sun at one focus.** (Not the centre — a focus.)\n' +
        '2. **The line from Sun to planet sweeps equal areas in equal times.** A planet moves faster when closer to the Sun.\n' +
        '3. **The square of the orbital period is proportional to the cube of the semi-major axis: T² ∝ a³.**\n\n' +
        'Newton later derived all three from his law of universal gravitation. The fact that gravity follows an inverse-square law (F ∝ 1/r²) is exactly *why* orbits are conic sections — anything else would give different shapes.\n\n' +
        '**The vis-viva equation.** Orbital speed at distance r from the Sun, on an orbit with semi-major axis a:\n\n' +
        '`v² = G·M·(2/r − 1/a)`\n\n' +
        'where G is Newton\'s gravitational constant and M is the Sun\'s mass. This single formula handles circular, elliptical, parabolic, and hyperbolic orbits — pick the right value of a:\n\n' +
        '| Orbit | a |\n' +
        '|-------|---|\n' +
        '| Circular | radius (constant) |\n' +
        '| Ellipse | half the major axis |\n' +
        '| Parabola | infinity (1/a = 0) → v² = 2GM/r → escape velocity |\n' +
        '| Hyperbola | negative |\n\n' +
        'Spacecraft mission planners use vis-viva on the back of every napkin. To send a probe to Mars, you compute the speed needed at Earth-orbit radius for an ellipse with the right semi-major axis to reach Mars. The maths Kepler discovered to track planets is the same maths NASA uses for trajectory corrections today.',
      diagram: 'ConicSectionsDiagram',
      practice: practiceConics,
    },
  ],
};
