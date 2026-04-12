// ============================================================
// PRACTICE PROBLEMS — Matrices & Vectors
//
// 50 problems across 4 concept areas, difficulty 1/2/3, with
// step-by-step hand solutions, visuals, and Python code.
// No numpy — all solutions use only standard library.
// ============================================================

import type { PracticeSet } from './reference';

export const practiceMatrices: PracticeSet = {
  title: 'Practice — Matrices & Vectors',
  problems: [

    // ════════════════════════════════════════════════════════════
    // AREA 1: VECTORS (mat-01 to mat-12)
    // ════════════════════════════════════════════════════════════

    // ── Easy ──────────────────────────────────────────────────

    {
      id: 'mat-01', difficulty: 1,
      question: 'A drone flies from the origin to point **(3, 4)**. What is the **magnitude** of its displacement vector?',
      visual: { kind: 'scatter', points: [[0, 0], [3, 4]], showLine: true },
      hint: 'The magnitude of a vector is its length. Think of the vector as the hypotenuse of a right triangle — what theorem gives you the length of a hypotenuse?',
      steps: [
        { label: 'What is magnitude?', content: 'The **magnitude** (or length) of a vector is the straight-line distance from its tail to its tip. For a 2D vector (x, y), it is the hypotenuse of a right triangle with legs x and y.' },
        { label: 'Step 1: Identify the right triangle', content: 'The vector **v** = (3, 4) forms a right triangle:\n\n| Leg | Direction | Length |\n|-----|-----------|--------|\n| Horizontal | x-axis | 3 |\n| Vertical | y-axis | 4 |' },
        { label: 'Step 2: Apply the Pythagorean theorem', content: '|**v**| = √(v₁² + v₂²) = √(3² + 4²) = √(9 + 16) = √25' },
        { label: 'Result', content: '|**v**| = **5** — this is one of the classic 3-4-5 right triangles.' },
      ],
      answer: '5',
      code: 'import math\n\nv = (3, 4)\n\n# Your code here\n',
      codeSolution: 'import math\n\nv = (3, 4)\nmagnitude = math.sqrt(v[0]**2 + v[1]**2)\nprint(f"Magnitude = {magnitude}")',
    },
    {
      id: 'mat-02', difficulty: 1,
      question: 'A bird is at position **(2, 5)** and flies to **(7, 1)**. Find the **displacement vector** from start to end.',
      visual: { kind: 'scatter', points: [[2, 5], [7, 1]], showLine: true },
      hint: 'Displacement means "how far and in which direction did it move?" Subtract the starting position from the ending position, component by component.',
      steps: [
        { label: 'What is a displacement vector?', content: 'A **displacement vector** points from where you started to where you ended up. You find it by subtracting: **end − start**, component by component.' },
        { label: 'Step 1: Subtract each coordinate', content: '| Component | End | Start | End − Start |\n|-----------|-----|-------|-------------|\n| x | 7 | 2 | 7 − 2 = **5** |\n| y | 1 | 5 | 1 − 5 = **−4** |' },
        { label: 'Result', content: 'Displacement = **(5, −4)** — the bird moved 5 units right and 4 units down.' },
      ],
      answer: '(5, −4)',
      code: 'start = (2, 5)\nend = (7, 1)\n\n# Your code here\n',
      codeSolution: 'start = (2, 5)\nend = (7, 1)\ndisplacement = (end[0] - start[0], end[1] - start[1])\nprint(f"Displacement = {displacement}")',
    },
    {
      id: 'mat-03', difficulty: 1,
      question: 'Add the vectors **a** = (1, 3) and **b** = (4, 2). What is **a + b**?',
      visual: { kind: 'scatter', points: [[1, 3], [4, 2], [5, 5]], showLine: true },
      hint: 'Vector addition is done component by component — add the x-parts together, then the y-parts together.',
      steps: [
        { label: 'How does vector addition work?', content: 'To add two vectors, simply add the matching components. Geometrically, this is "tip-to-tail" placement — put the tail of **b** at the tip of **a**, and the result points from the start of **a** to the tip of **b**.' },
        { label: 'Step 1: Add component by component', content: '| Component | a | b | a + b |\n|-----------|---|---|-------|\n| x | 1 | 4 | 1 + 4 = **5** |\n| y | 3 | 2 | 3 + 2 = **5** |' },
        { label: 'Result', content: '**a + b** = **(5, 5)**' },
      ],
      answer: '(5, 5)',
      code: 'a = (1, 3)\nb = (4, 2)\n\n# Your code here\n',
      codeSolution: 'a = (1, 3)\nb = (4, 2)\nresult = (a[0] + b[0], a[1] + b[1])\nprint(f"a + b = {result}")',
    },
    {
      id: 'mat-04', difficulty: 1,
      question: 'Subtract vector **b** = (3, 7) from **a** = (8, 2). What is **a − b**?',
      visual: { kind: 'scatter', points: [[8, 2], [3, 7], [5, -5]], showLine: true },
      hint: 'Vector subtraction is also component by component. The result **a − b** is the vector that points from the tip of **b** to the tip of **a**.',
      steps: [
        { label: 'How does vector subtraction work?', content: 'Just like addition but with minus signs. **a − b** gives the vector that, when added to **b**, gives you **a**. Geometrically, it points from the tip of **b** to the tip of **a**.' },
        { label: 'Step 1: Subtract component by component', content: '| Component | a | b | a − b |\n|-----------|---|---|-------|\n| x | 8 | 3 | 8 − 3 = **5** |\n| y | 2 | 7 | 2 − 7 = **−5** |' },
        { label: 'Result', content: '**a − b** = **(5, −5)**' },
      ],
      answer: '(5, −5)',
      code: 'a = (8, 2)\nb = (3, 7)\n\n# Your code here\n',
      codeSolution: 'a = (8, 2)\nb = (3, 7)\nresult = (a[0] - b[0], a[1] - b[1])\nprint(f"a - b = {result}")',
    },
    {
      id: 'mat-05', difficulty: 1,
      question: 'A force vector is **F** = (2, −3). If we triple the force, what is **3F**?',
      visual: { kind: 'scatter', points: [[2, -3], [6, -9]], showLine: true },
      hint: 'Scalar multiplication means multiplying every component of the vector by the same number. The direction stays the same; only the length changes.',
      steps: [
        { label: 'What is scalar multiplication?', content: 'When you multiply a vector by a number (scalar), you scale every component by that number. The vector keeps pointing in the same direction but becomes longer (or shorter, or flipped if negative).' },
        { label: 'Step 1: Multiply each component by 3', content: '| Component | F | × 3 | 3F |\n|-----------|---|------|----|\n| x | 2 | 3 × 2 | **6** |\n| y | −3 | 3 × (−3) | **−9** |' },
        { label: 'Result', content: '**3F** = **(6, −9)** — same direction as F, but 3× longer.' },
      ],
      answer: '(6, −9)',
      code: 'F = (2, -3)\nscalar = 3\n\n# Your code here\n',
      codeSolution: 'F = (2, -3)\nscalar = 3\nresult = (scalar * F[0], scalar * F[1])\nprint(f"3F = {result}")',
    },

    // ── Medium ────────────────────────────────────────────────

    {
      id: 'mat-06', difficulty: 2,
      question: 'A boat aims due north at 5 m/s but a river current pushes east at 3 m/s. The boat\'s velocity is **v** = (3, 5). What is the **magnitude** and **direction** (angle from east) of the actual velocity?',
      visual: { kind: 'scatter', points: [[0, 0], [3, 5]], showLine: true },
      hint: 'Magnitude is the Pythagorean theorem. For the angle from the positive x-axis (east), use arctan(y/x) — or better yet, atan2(y, x) in code.',
      steps: [
        { label: 'Why combine magnitude and direction?', content: 'A velocity vector has both **speed** (how fast — the magnitude) and **heading** (which way — the angle). We need both to fully describe motion.' },
        { label: 'Step 1: Find the magnitude (speed)', content: '|**v**| = √(v_x² + v_y²) = √(3² + 5²) = √(9 + 25) = √34 ≈ **5.83 m/s**' },
        { label: 'Step 2: Find the direction (angle from east)', content: 'The angle from the positive x-axis (east) is found using the tangent ratio:\n\nθ = arctan(opposite / adjacent) = arctan(v_y / v_x) = arctan(5 / 3) ≈ arctan(1.667) ≈ **59.04°** from east\n\nThis makes sense — the boat is heading mostly north (5 m/s) with some eastward drift (3 m/s), so the angle from east is more than 45°.' },
      ],
      answer: '≈ 5.83 m/s at 59.04° from east',
      code: 'import math\n\nv = (3, 5)\n\n# Your code here\n',
      codeSolution: 'import math\n\nv = (3, 5)\nmagnitude = math.sqrt(v[0]**2 + v[1]**2)\nangle_rad = math.atan2(v[1], v[0])\nangle_deg = math.degrees(angle_rad)\nprint(f"Magnitude = {magnitude:.2f} m/s")\nprint(f"Direction = {angle_deg:.2f} degrees from east")',
    },
    {
      id: 'mat-07', difficulty: 2,
      question: 'Find the **unit vector** in the direction of **v** = (5, 12).',
      visual: { kind: 'scatter', points: [[0, 0], [5, 12]], showLine: true },
      hint: 'A unit vector has length 1 and points in the same direction as the original. Divide each component by the magnitude.',
      steps: [
        { label: 'What is a unit vector?', content: 'A **unit vector** is a vector with magnitude exactly 1. It preserves the direction of the original vector but normalizes its length. To get it, divide each component by the vector\'s magnitude.' },
        { label: 'Step 1: Find the magnitude', content: '|**v**| = √(5² + 12²) = √(25 + 144) = √169 = **13**\n\n(Another classic Pythagorean triple: 5-12-13.)' },
        { label: 'Step 2: Divide each component by 13', content: '| Component | Original | ÷ 13 | Unit vector |\n|-----------|----------|------|-------------|\n| x | 5 | 5/13 | **0.385** |\n| y | 12 | 12/13 | **0.923** |' },
        { label: 'Step 3: Verify the length is 1', content: '|u| = √(0.385² + 0.923²) ≈ √(0.148 + 0.852) = √1 = 1 ✓' },
      ],
      answer: '(5/13, 12/13) ≈ (0.385, 0.923)',
      code: 'import math\n\nv = (5, 12)\n\n# Your code here\n',
      codeSolution: 'import math\n\nv = (5, 12)\nmag = math.sqrt(v[0]**2 + v[1]**2)\nunit = (v[0] / mag, v[1] / mag)\nprint(f"Unit vector = ({unit[0]:.4f}, {unit[1]:.4f})")\nprint(f"Verification |u| = {math.sqrt(unit[0]**2 + unit[1]**2):.4f}")',
    },
    {
      id: 'mat-08', difficulty: 2,
      question: 'Two ropes pull a box: **F₁** = (4, 3) N and **F₂** = (−2, 5) N. Find the **resultant force** vector and its magnitude.',
      visual: { kind: 'scatter', points: [[4, 3], [-2, 5], [2, 8]], showLine: true },
      hint: 'The resultant force is the vector sum of all individual forces. Add component-wise, then find the magnitude of the total.',
      steps: [
        { label: 'What is a resultant force?', content: 'When multiple forces act on an object, their combined effect is the **resultant force** — found by vector addition. The object behaves as if this single force were acting on it.' },
        { label: 'Step 1: Add the force vectors component by component', content: '| Component | F₁ | F₂ | F₁ + F₂ |\n|-----------|----|----|----------|\n| x | 4 | −2 | 4 + (−2) = **2** |\n| y | 3 | 5 | 3 + 5 = **8** |\n\nResultant **F** = **(2, 8)**' },
        { label: 'Step 2: Find the magnitude of the resultant', content: '|**F**| = √(2² + 8²) = √(4 + 64) = √68 = 2√17 ≈ **8.25 N**' },
      ],
      answer: 'Resultant = (2, 8), magnitude ≈ 8.25 N',
      code: 'import math\n\nF1 = (4, 3)\nF2 = (-2, 5)\n\n# Your code here\n',
      codeSolution: 'import math\n\nF1 = (4, 3)\nF2 = (-2, 5)\nresultant = (F1[0] + F2[0], F1[1] + F2[1])\nmagnitude = math.sqrt(resultant[0]**2 + resultant[1]**2)\nprint(f"Resultant = {resultant}")\nprint(f"Magnitude = {magnitude:.2f} N")',
    },

    // ── Hard ──────────────────────────────────────────────────

    {
      id: 'mat-09', difficulty: 3,
      question: 'A 3D force has components **F** = (2, −1, 3). Find its magnitude. Then find the **direction cosines** (cos α, cos β, cos γ) where α, β, γ are the angles with the x, y, and z axes.',
      visual: { kind: 'scatter', points: [[2, -1], [2, 3]], showLine: true },
      hint: 'The magnitude formula extends to 3D: √(x² + y² + z²). Each direction cosine is the component in that axis divided by the total magnitude. They always satisfy cos²α + cos²β + cos²γ = 1.',
      steps: [
        { label: 'What are direction cosines?', content: 'In 3D, a vector makes an angle with each of the three axes. The **direction cosines** are the cosines of these angles. Each one equals that component divided by the total magnitude. Together they satisfy cos²α + cos²β + cos²γ = 1 (like a unit vector\'s components squared).' },
        { label: 'Step 1: Find the 3D magnitude', content: 'The 3D version of the Pythagorean theorem:\n\n|**F**| = √(2² + (−1)² + 3²) = √(4 + 1 + 9) = √14 ≈ **3.742**' },
        { label: 'Step 2: Compute each direction cosine', content: 'Each direction cosine = (component) / (magnitude):\n\n| Axis | Component | Formula | Value |\n|------|-----------|---------|-------|\n| x (α) | 2 | 2/√14 | **≈ 0.535** |\n| y (β) | −1 | −1/√14 | **≈ −0.267** |\n| z (γ) | 3 | 3/√14 | **≈ 0.802** |' },
        { label: 'Step 3: Verify the identity', content: 'cos²α + cos²β + cos²γ = 4/14 + 1/14 + 9/14 = 14/14 = **1** ✓\n\nThis always holds — it is equivalent to saying the unit vector has length 1.' },
      ],
      answer: '|F| = √14 ≈ 3.742; direction cosines ≈ (0.535, −0.267, 0.802)',
      code: 'import math\n\nF = (2, -1, 3)\n\n# Your code here\n',
      codeSolution: 'import math\n\nF = (2, -1, 3)\nmag = math.sqrt(sum(c**2 for c in F))\ncos_alpha = F[0] / mag\ncos_beta = F[1] / mag\ncos_gamma = F[2] / mag\nprint(f"|F| = {mag:.4f}")\nprint(f"Direction cosines: ({cos_alpha:.4f}, {cos_beta:.4f}, {cos_gamma:.4f})")\nprint(f"Verification: {cos_alpha**2 + cos_beta**2 + cos_gamma**2:.4f}")',
    },
    {
      id: 'mat-10', difficulty: 3,
      question: 'A plane flies at velocity **v₁** = (200, 100) km/h. A wind blows at **v₂** = (−50, 30) km/h. Find the ground velocity, its magnitude, and the **angle correction** needed (difference in direction between intended and actual).',
      visual: { kind: 'scatter', points: [[200, 100], [-50, 30], [150, 130]], showLine: true },
      hint: 'Ground velocity = plane velocity + wind velocity. The angle correction is the difference between the intended heading angle and the actual heading angle. Use arctan(y/x) for each.',
      steps: [
        { label: 'Why does the wind change the heading?', content: 'The plane\'s engine pushes it in one direction, but the wind pushes it in another. The actual path over the ground is the **vector sum** of both. If the pilot doesn\'t correct, they will drift off course.' },
        { label: 'Step 1: Find the ground velocity', content: '| Component | Plane (v₁) | Wind (v₂) | Ground (v₁ + v₂) |\n|-----------|------------|------------|-------------------|\n| x (east) | 200 | −50 | 200 − 50 = **150** |\n| y (north) | 100 | 30 | 100 + 30 = **130** |\n\nGround velocity = **(150, 130)** km/h' },
        { label: 'Step 2: Find the ground speed (magnitude)', content: '|**v**| = √(150² + 130²) = √(22500 + 16900) = √39400 ≈ **198.49 km/h**' },
        { label: 'Step 3: Find the intended vs actual heading', content: '| Heading | Formula | Calculation | Angle |\n|---------|---------|------------|-------|\n| Intended (v₁) | arctan(100/200) | arctan(0.5) | **26.57°** from east |\n| Actual (ground) | arctan(130/150) | arctan(0.867) | **40.91°** from east |' },
        { label: 'Step 4: Angle correction needed', content: 'Δθ = 40.91° − 26.57° = **14.34°**\n\nThe wind pushed the plane 14.34° further north than intended.' },
      ],
      answer: 'Ground velocity = (150, 130), speed ≈ 198.49 km/h, correction ≈ 14.34°',
      code: 'import math\n\nv1 = (200, 100)\nv2 = (-50, 30)\n\n# Your code here\n',
      codeSolution: 'import math\n\nv1 = (200, 100)\nv2 = (-50, 30)\nground = (v1[0] + v2[0], v1[1] + v2[1])\nspeed = math.sqrt(ground[0]**2 + ground[1]**2)\ntheta1 = math.degrees(math.atan2(v1[1], v1[0]))\ntheta2 = math.degrees(math.atan2(ground[1], ground[0]))\ncorrection = abs(theta2 - theta1)\nprint(f"Ground velocity = {ground}")\nprint(f"Ground speed = {speed:.2f} km/h")\nprint(f"Angle correction = {correction:.2f} degrees")',
    },
    {
      id: 'mat-11', difficulty: 3,
      question: 'Prove by direct computation that **(a + b) · (a − b) = |a|² − |b|²** for **a** = (3, 4) and **b** = (1, 2). Then explain why this identity holds in general.',
      visual: { kind: 'scatter', points: [[3, 4], [1, 2], [4, 6], [2, 2]], showLine: true },
      hint: 'First compute a + b and a − b as new vectors, then dot them. Separately compute |a|² and |b|² and check both sides match. For the general proof, expand the dot product using distributivity.',
      steps: [
        { label: 'Why does this identity look like algebra?', content: 'This is the vector version of the algebraic identity (x + y)(x − y) = x² − y². The dot product behaves like multiplication here because it distributes over addition and a · b = b · a (commutative).' },
        { label: 'Step 1: Compute the two intermediate vectors', content: '| Vector | Calculation | Result |\n|--------|------------|--------|\n| a + b | (3+1, 4+2) | **(4, 6)** |\n| a − b | (3−1, 4−2) | **(2, 2)** |' },
        { label: 'Step 2: Dot the two results (left side)', content: '(a + b) · (a − b) = 4×2 + 6×2 = 8 + 12 = **20**' },
        { label: 'Step 3: Compute |a|² − |b|² (right side)', content: '| Quantity | Calculation | Result |\n|----------|------------|--------|\n| |a|² | 3² + 4² = 9 + 16 | **25** |\n| |b|² | 1² + 2² = 1 + 4 | **5** |\n| Difference | 25 − 5 | **20** |\n\nBoth sides equal **20** ✓' },
        { label: 'Step 4: Why it always works (general proof)', content: 'Expand using the distributive property of the dot product:\n\n(a+b) · (a−b) = a·a − a·b + b·a − b·b\n\nSince the dot product is commutative (a·b = b·a), the middle terms cancel:\n\n= |a|² − |b|²' },
      ],
      answer: 'Both sides equal 20, confirming the identity',
      code: 'a = (3, 4)\nb = (1, 2)\n\n# Your code here\n',
      codeSolution: 'a = (3, 4)\nb = (1, 2)\n\na_plus_b = (a[0] + b[0], a[1] + b[1])\na_minus_b = (a[0] - b[0], a[1] - b[1])\n\ndot = a_plus_b[0] * a_minus_b[0] + a_plus_b[1] * a_minus_b[1]\nmag_a_sq = a[0]**2 + a[1]**2\nmag_b_sq = b[0]**2 + b[1]**2\ndiff = mag_a_sq - mag_b_sq\n\nprint(f"(a+b) . (a-b) = {dot}")\nprint(f"|a|^2 - |b|^2 = {diff}")\nprint(f"Identity holds: {dot == diff}")',
    },
    {
      id: 'mat-12', difficulty: 2,
      question: 'A hiker walks **a** = (3, 0) km east, then **b** = (0, 4) km north, then **c** = (−1, 2) km northwest. What is the total displacement and how far is the hiker from the start?',
      visual: { kind: 'scatter', points: [[0, 0], [3, 0], [3, 4], [2, 6]], showLine: true },
      hint: 'Total displacement is the sum of all leg vectors. The distance from the start is the magnitude of that total displacement vector.',
      steps: [
        { label: 'What is total displacement?', content: 'No matter how many legs a journey has, the **total displacement** is the single vector from start to finish. You find it by adding all the leg vectors together. The **distance from start** is then the magnitude of that total.' },
        { label: 'Step 1: Add all three leg vectors', content: '| Component | a (east) | b (north) | c (NW) | Total |\n|-----------|----------|-----------|--------|-------|\n| x | 3 | 0 | −1 | 3 + 0 + (−1) = **2** |\n| y | 0 | 4 | 2 | 0 + 4 + 2 = **6** |\n\nTotal displacement = **(2, 6)**' },
        { label: 'Step 2: Find the straight-line distance from start', content: '|Total| = √(2² + 6²) = √(4 + 36) = √40 = 2√10 ≈ **6.32 km**\n\nNote: the hiker walked 3 + 4 + √5 ≈ 9.24 km total path length, but is only 6.32 km from the start.' },
      ],
      answer: 'Displacement = (2, 6), distance ≈ 6.32 km',
      code: 'import math\n\na = (3, 0)\nb = (0, 4)\nc = (-1, 2)\n\n# Your code here\n',
      codeSolution: 'import math\n\na = (3, 0)\nb = (0, 4)\nc = (-1, 2)\ntotal = (a[0] + b[0] + c[0], a[1] + b[1] + c[1])\ndist = math.sqrt(total[0]**2 + total[1]**2)\nprint(f"Total displacement = {total}")\nprint(f"Distance from start = {dist:.2f} km")',
    },

    // ════════════════════════════════════════════════════════════
    // AREA 2: DOT PRODUCT & CROSS PRODUCT (mat-13 to mat-24)
    // ════════════════════════════════════════════════════════════

    // ── Easy ──────────────────────────────────────────────────

    {
      id: 'mat-13', difficulty: 1,
      question: 'Compute the **dot product** of **a** = (2, 5) and **b** = (3, −1).',
      visual: { kind: 'scatter', points: [[2, 5], [3, -1]], showLine: false },
      hint: 'The dot product multiplies matching components and sums them: a₁b₁ + a₂b₂. The result is a single number (scalar), not a vector.',
      steps: [
        { label: 'What is the dot product?', content: 'The **dot product** takes two vectors and returns a single number. It measures how much two vectors point in the same direction. Formula: **a · b = a₁b₁ + a₂b₂** (multiply matching components, then add).' },
        { label: 'Step 1: Multiply matching components and sum', content: '| Component | a | b | Product |\n|-----------|---|---|---------|\n| 1st | 2 | 3 | 2 × 3 = **6** |\n| 2nd | 5 | −1 | 5 × (−1) = **−5** |\n| | | **Sum** | 6 + (−5) = **1** |' },
        { label: 'Result', content: 'a · b = **1** — a small positive number, meaning the vectors point in vaguely the same direction but are nearly perpendicular.' },
      ],
      answer: '1',
      code: 'a = (2, 5)\nb = (3, -1)\n\n# Your code here\n',
      codeSolution: 'a = (2, 5)\nb = (3, -1)\ndot = a[0]*b[0] + a[1]*b[1]\nprint(f"Dot product = {dot}")',
    },
    {
      id: 'mat-14', difficulty: 1,
      question: 'Are vectors **a** = (4, 2) and **b** = (−1, 2) **orthogonal** (perpendicular)? Check using the dot product.',
      visual: { kind: 'scatter', points: [[4, 2], [-1, 2]], showLine: false },
      hint: 'Two vectors are orthogonal (perpendicular) if and only if their dot product equals zero. Compute a · b and check.',
      steps: [
        { label: 'The orthogonality test', content: 'Two vectors are **orthogonal** (perpendicular) if and only if their dot product is exactly **zero**. This is one of the most useful facts in linear algebra — it turns a geometric question into a simple calculation.' },
        { label: 'Step 1: Compute the dot product', content: '| Component | a | b | Product |\n|-----------|---|---|---------|\n| 1st | 4 | −1 | 4 × (−1) = **−4** |\n| 2nd | 2 | 2 | 2 × 2 = **4** |\n| | | **Sum** | −4 + 4 = **0** |' },
        { label: 'Result', content: 'a · b = 0, so the vectors **are orthogonal** ✓\n\nGeometrically, if you drew both vectors from the origin, they would form a perfect 90° angle.' },
      ],
      answer: 'Yes — dot product = 0, so the vectors are orthogonal',
      code: 'a = (4, 2)\nb = (-1, 2)\n\n# Your code here\n',
      codeSolution: 'a = (4, 2)\nb = (-1, 2)\ndot = a[0]*b[0] + a[1]*b[1]\nprint(f"Dot product = {dot}")\nprint(f"Orthogonal: {dot == 0}")',
    },
    {
      id: 'mat-15', difficulty: 1,
      question: 'Compute the **dot product** of **u** = (1, 0, 3) and **v** = (2, 4, −1) in 3D.',
      visual: { kind: 'scatter', points: [[1, 0], [2, 4]], showLine: false },
      hint: 'The dot product formula works the same in 3D — just add a third pair: u₁v₁ + u₂v₂ + u₃v₃.',
      steps: [
        { label: 'Dot product in 3D', content: 'The dot product extends naturally to any number of dimensions. For 3D: **u · v = u₁v₁ + u₂v₂ + u₃v₃**. Same idea — multiply matching components, then sum.' },
        { label: 'Step 1: Multiply each pair and sum', content: '| Component | u | v | Product |\n|-----------|---|---|---------|\n| 1st | 1 | 2 | 1 × 2 = **2** |\n| 2nd | 0 | 4 | 0 × 4 = **0** |\n| 3rd | 3 | −1 | 3 × (−1) = **−3** |\n| | | **Sum** | 2 + 0 + (−3) = **−1** |' },
        { label: 'Result', content: 'u · v = **−1** — slightly negative, meaning the vectors point in somewhat opposite directions (the angle between them is slightly more than 90°).' },
      ],
      answer: '−1',
      code: 'u = (1, 0, 3)\nv = (2, 4, -1)\n\n# Your code here\n',
      codeSolution: 'u = (1, 0, 3)\nv = (2, 4, -1)\ndot = sum(a*b for a, b in zip(u, v))\nprint(f"Dot product = {dot}")',
    },
    {
      id: 'mat-16', difficulty: 1,
      question: 'Compute the **2D cross product** (scalar) of **a** = (3, 1) and **b** = (2, 5). What does the sign tell you?',
      visual: { kind: 'scatter', points: [[3, 1], [2, 5]], showLine: false },
      hint: 'The 2D cross product is a single number: a₁b₂ − a₂b₁. Its sign tells you the rotational direction from a to b — positive = counter-clockwise, negative = clockwise.',
      steps: [
        { label: 'What is the 2D cross product?', content: 'In 2D, the "cross product" gives a **scalar** (not a vector). It measures the signed area of the parallelogram formed by the two vectors. The formula is: **a × b = a₁b₂ − a₂b₁**\n\n- Positive: **b** is counter-clockwise from **a**\n- Negative: **b** is clockwise from **a**\n- Zero: the vectors are parallel' },
        { label: 'Step 1: Apply the formula', content: '| Part | Values | Result |\n|------|--------|--------|\n| a₁ × b₂ | 3 × 5 | **15** |\n| a₂ × b₁ | 1 × 2 | **2** |\n| a₁b₂ − a₂b₁ | 15 − 2 | **13** |' },
        { label: 'Result', content: 'a × b = **13** (positive) → **b** is counter-clockwise from **a**.\n\nThe magnitude 13 also equals the area of the parallelogram formed by a and b.' },
      ],
      answer: '13 (positive → b is CCW from a)',
      code: 'a = (3, 1)\nb = (2, 5)\n\n# Your code here\n',
      codeSolution: 'a = (3, 1)\nb = (2, 5)\ncross = a[0]*b[1] - a[1]*b[0]\nprint(f"Cross product = {cross}")\nprint(f"b is {\'CCW\' if cross > 0 else \'CW\'} from a")',
    },

    // ── Medium ────────────────────────────────────────────────

    {
      id: 'mat-17', difficulty: 2,
      question: 'Find the **angle** (in degrees) between **a** = (1, 2) and **b** = (3, 1) using the dot product formula.',
      visual: { kind: 'scatter', points: [[1, 2], [3, 1]], showLine: false },
      hint: 'The angle formula comes from cos θ = (a · b) / (|a| × |b|). Compute the dot product, both magnitudes, divide, then take arccos.',
      steps: [
        { label: 'The angle formula', content: 'The dot product is related to the angle between two vectors by:\n\n**cos θ = (a · b) / (|a| × |b|)**\n\nSolve for θ by taking arccos of both sides. This works because the dot product "encodes" the angle.' },
        { label: 'Step 1: Compute the dot product', content: 'a · b = 1×3 + 2×1 = 3 + 2 = **5**' },
        { label: 'Step 2: Compute both magnitudes', content: '| Vector | Components² | Sum | Magnitude |\n|--------|------------|-----|-----------|\n| a | 1² + 2² | 5 | **√5** |\n| b | 3² + 1² | 10 | **√10** |' },
        { label: 'Step 3: Plug into the formula', content: 'cos θ = 5 / (√5 × √10) = 5 / √50 = 5 / (5√2) = 1/√2 ≈ 0.7071' },
        { label: 'Step 4: Take arccos to get the angle', content: 'θ = arccos(1/√2) = **45°**\n\n1/√2 is a well-known value — it corresponds to exactly 45°.' },
      ],
      answer: '45°',
      code: 'import math\n\na = (1, 2)\nb = (3, 1)\n\n# Your code here\n',
      codeSolution: 'import math\n\na = (1, 2)\nb = (3, 1)\ndot = a[0]*b[0] + a[1]*b[1]\nmag_a = math.sqrt(a[0]**2 + a[1]**2)\nmag_b = math.sqrt(b[0]**2 + b[1]**2)\ncos_theta = dot / (mag_a * mag_b)\ntheta = math.degrees(math.acos(cos_theta))\nprint(f"Angle = {theta:.2f} degrees")',
    },
    {
      id: 'mat-18', difficulty: 2,
      question: 'Compute the **3D cross product** of **a** = (1, 2, 3) and **b** = (4, 5, 6).',
      hint: 'The 3D cross product uses each component\'s "other two" coordinates. A memory trick: for the i-component, cover the first column and compute the 2×2 determinant of what remains. Alternate signs: +, −, +.',
      steps: [
        { label: 'How does the 3D cross product work?', content: 'The cross product **a × b** gives a new vector that is **perpendicular to both** a and b. Each component uses the "other two" coordinates in a pattern:\n\n- **i**: use y,z components\n- **j**: use x,z components (with a sign flip)\n- **k**: use x,y components' },
        { label: 'Step 1: Compute each component using the formula', content: '| Component | Formula | Calculation | Result |\n|-----------|---------|------------|--------|\n| i | a₂b₃ − a₃b₂ | 2×6 − 3×5 = 12 − 15 | **−3** |\n| j | −(a₁b₃ − a₃b₁) | −(1×6 − 3×4) = −(6 − 12) | **6** |\n| k | a₁b₂ − a₂b₁ | 1×5 − 2×4 = 5 − 8 | **−3** |' },
        { label: 'Result', content: '**a × b** = **(−3, 6, −3)**\n\nThis vector is perpendicular to both (1,2,3) and (4,5,6). You can verify by checking that (−3,6,−3) · (1,2,3) = −3+12−9 = 0 ✓' },
      ],
      answer: '(−3, 6, −3)',
      code: 'a = (1, 2, 3)\nb = (4, 5, 6)\n\n# Your code here\n',
      codeSolution: 'a = (1, 2, 3)\nb = (4, 5, 6)\ncross = (\n    a[1]*b[2] - a[2]*b[1],\n    a[2]*b[0] - a[0]*b[2],\n    a[0]*b[1] - a[1]*b[0]\n)\nprint(f"a x b = {cross}")',
    },
    {
      id: 'mat-19', difficulty: 2,
      question: 'Find the **area of the parallelogram** formed by **a** = (3, 0, 0) and **b** = (0, 4, 0). Use the cross product.',
      visual: { kind: 'scatter', points: [[3, 0], [0, 4], [3, 4]], showLine: true },
      hint: 'The magnitude of the cross product |a × b| equals the area of the parallelogram spanned by a and b. Compute a × b first, then find its magnitude.',
      steps: [
        { label: 'Why does the cross product give area?', content: 'A fundamental geometric fact: the **magnitude of a × b** equals the area of the parallelogram with sides a and b. This is because |a × b| = |a||b|sin θ, and |a||b|sin θ is the base × height formula for a parallelogram.' },
        { label: 'Step 1: Compute the cross product a × b', content: '| Component | Formula | Calculation | Result |\n|-----------|---------|------------|--------|\n| i | a₂b₃ − a₃b₂ | 0×0 − 0×4 | **0** |\n| j | −(a₁b₃ − a₃b₁) | −(3×0 − 0×0) | **0** |\n| k | a₁b₂ − a₂b₁ | 3×4 − 0×0 | **12** |\n\na × b = **(0, 0, 12)** — points straight up in the z-direction, as expected for vectors in the xy-plane.' },
        { label: 'Step 2: Find the magnitude (= area)', content: '|a × b| = √(0² + 0² + 12²) = √144 = **12** square units\n\nSanity check: a lies along x with length 3, b lies along y with length 4. The parallelogram is actually a 3×4 rectangle, so area = 12 ✓' },
      ],
      answer: '12 square units',
      code: 'import math\n\na = (3, 0, 0)\nb = (0, 4, 0)\n\n# Your code here\n',
      codeSolution: 'import math\n\na = (3, 0, 0)\nb = (0, 4, 0)\ncross = (\n    a[1]*b[2] - a[2]*b[1],\n    a[2]*b[0] - a[0]*b[2],\n    a[0]*b[1] - a[1]*b[0]\n)\narea = math.sqrt(sum(c**2 for c in cross))\nprint(f"Cross product = {cross}")\nprint(f"Area = {area}")',
    },
    {
      id: 'mat-20', difficulty: 2,
      question: 'Project vector **a** = (4, 3) onto **b** = (1, 0). What is the **scalar projection** and the **vector projection**?',
      visual: { kind: 'scatter', points: [[4, 3], [1, 0], [4, 0]], showLine: true },
      hint: 'The scalar projection is (a · b) / |b| — it tells you "how far a goes in the b direction." The vector projection is that scalar times the unit vector of b.',
      steps: [
        { label: 'What is projection?', content: 'Projecting **a** onto **b** answers: "If I shine a light straight down onto the line of b, where does a\'s shadow land?"\n\n- **Scalar projection**: the signed length of that shadow = (a · b) / |b|\n- **Vector projection**: the actual shadow vector = (scalar projection / |b|) × b' },
        { label: 'Step 1: Scalar projection', content: 'comp_b(a) = (a · b) / |b|\n\n| Part | Calculation | Value |\n|------|------------|-------|\n| a · b | 4×1 + 3×0 | **4** |\n| |b| | √(1² + 0²) | **1** |\n| Scalar proj. | 4 / 1 | **4** |\n\nThis means a extends 4 units in the direction of b.' },
        { label: 'Step 2: Vector projection', content: 'proj_b(a) = (a · b / |b|²) × b = (4/1) × (1, 0) = **(4, 0)**\n\nGeometrically, (4, 0) is the "shadow" of (4, 3) onto the x-axis — the y-component (3) is the part perpendicular to b and gets dropped.' },
      ],
      answer: 'Scalar projection = 4, vector projection = (4, 0)',
      code: 'a = (4, 3)\nb = (1, 0)\n\n# Your code here\n',
      codeSolution: 'import math\n\na = (4, 3)\nb = (1, 0)\ndot_ab = a[0]*b[0] + a[1]*b[1]\nmag_b = math.sqrt(b[0]**2 + b[1]**2)\nscalar_proj = dot_ab / mag_b\nscale = dot_ab / (mag_b**2)\nvec_proj = (scale * b[0], scale * b[1])\nprint(f"Scalar projection = {scalar_proj}")\nprint(f"Vector projection = {vec_proj}")',
    },

    // ── Hard ──────────────────────────────────────────────────

    {
      id: 'mat-21', difficulty: 3,
      question: 'Two ML feature vectors are **x** = (1, 3, −2, 4) and **y** = (2, −1, 0, 3). Compute their **cosine similarity**. Are the features pointing in roughly the same direction?',
      hint: 'Cosine similarity = dot product / (product of magnitudes). It ranges from −1 (opposite) through 0 (perpendicular) to +1 (same direction). In ML, it is used to compare feature vectors regardless of their scale.',
      steps: [
        { label: 'What is cosine similarity?', content: 'Cosine similarity measures the **angle** between two vectors, ignoring their lengths. It equals cos θ = (x · y) / (|x| × |y|).\n\n| Value | Meaning |\n|-------|--------|\n| +1 | Identical direction |\n| 0 | Perpendicular (unrelated) |\n| −1 | Opposite direction |\n\nIn ML, this tells you how "similar" two data points are in direction, regardless of magnitude.' },
        { label: 'Step 1: Compute the dot product', content: '| Dimension | x | y | x×y |\n|-----------|---|---|-----|\n| 1st | 1 | 2 | 2 |\n| 2nd | 3 | −1 | −3 |\n| 3rd | −2 | 0 | 0 |\n| 4th | 4 | 3 | 12 |\n| | | **Sum** | **11** |' },
        { label: 'Step 2: Compute both magnitudes', content: '| Vector | Components² | Sum | Magnitude |\n|--------|------------|-----|-----------|\n| x | 1+9+4+16 | 30 | √30 ≈ **5.477** |\n| y | 4+1+0+9 | 14 | √14 ≈ **3.742** |' },
        { label: 'Step 3: Compute cosine similarity', content: 'cos θ = 11 / (5.477 × 3.742) ≈ 11 / 20.494 ≈ **0.537**' },
        { label: 'Step 4: Interpret the result', content: 'cos θ ≈ 0.537 — **moderate positive similarity** (angle ≈ 57.5°). The vectors point in roughly the same general direction but are far from identical. In an ML context, these features share some signal but also have significant differences.' },
      ],
      answer: 'Cosine similarity ≈ 0.537 — moderately similar direction',
      code: 'import math\n\nx = (1, 3, -2, 4)\ny = (2, -1, 0, 3)\n\n# Your code here\n',
      codeSolution: 'import math\n\nx = (1, 3, -2, 4)\ny = (2, -1, 0, 3)\ndot = sum(a*b for a, b in zip(x, y))\nmag_x = math.sqrt(sum(a**2 for a in x))\nmag_y = math.sqrt(sum(a**2 for a in y))\ncos_sim = dot / (mag_x * mag_y)\nangle = math.degrees(math.acos(cos_sim))\nprint(f"Cosine similarity = {cos_sim:.4f}")\nprint(f"Angle = {angle:.1f} degrees")',
    },
    {
      id: 'mat-22', difficulty: 3,
      question: 'Verify the **Cauchy–Schwarz inequality** |**a** · **b**| ≤ |**a**| × |**b**| for **a** = (2, −3, 1) and **b** = (1, 4, −2). Compute both sides.',
      hint: 'Compute the dot product (and take its absolute value) for the left side. Compute both magnitudes and multiply them for the right side. The left should be less than or equal to the right.',
      steps: [
        { label: 'What is the Cauchy-Schwarz inequality?', content: 'One of the most important inequalities in mathematics:\n\n**|a · b| ≤ |a| × |b|**\n\nIn words: the absolute value of the dot product never exceeds the product of the magnitudes. Equality holds only when the vectors are parallel. This is equivalent to saying cos θ is always between −1 and 1.' },
        { label: 'Step 1: Compute the left side |a · b|', content: '| Dimension | a | b | a×b |\n|-----------|---|---|-----|\n| 1st | 2 | 1 | 2 |\n| 2nd | −3 | 4 | −12 |\n| 3rd | 1 | −2 | −2 |\n| | | **Sum** | **−12** |\n\n|a · b| = |−12| = **12**' },
        { label: 'Step 2: Compute the right side |a| × |b|', content: '| Vector | Components² | Sum | Magnitude |\n|--------|------------|-----|-----------|\n| a | 4+9+1 | 14 | √14 ≈ **3.742** |\n| b | 1+16+4 | 21 | √21 ≈ **4.583** |\n\n|a| × |b| = √14 × √21 = √294 ≈ **17.15**' },
        { label: 'Step 3: Compare', content: '12 ≤ 17.15 ✓ — the inequality holds.\n\nThe "gap" between 12 and 17.15 tells us the vectors are not parallel. If they were parallel, both sides would be equal.' },
      ],
      answer: '|a · b| = 12 ≤ 17.15 = |a||b| — inequality verified',
      code: 'import math\n\na = (2, -3, 1)\nb = (1, 4, -2)\n\n# Your code here\n',
      codeSolution: 'import math\n\na = (2, -3, 1)\nb = (1, 4, -2)\ndot = sum(x*y for x, y in zip(a, b))\nmag_a = math.sqrt(sum(x**2 for x in a))\nmag_b = math.sqrt(sum(x**2 for x in b))\nprint(f"|a . b| = {abs(dot)}")\nprint(f"|a| x |b| = {mag_a * mag_b:.4f}")\nprint(f"Cauchy-Schwarz holds: {abs(dot) <= mag_a * mag_b}")',
    },
    {
      id: 'mat-23', difficulty: 3,
      question: 'Verify that the **cross product is anti-commutative**: compute **a × b** and **b × a** for **a** = (2, 1, −1) and **b** = (3, −2, 4), and show that **a × b** = −(**b × a**).',
      hint: 'An anti-commutative operation means swapping the inputs flips the sign of the result. Compute both cross products separately using the formula, then check that each component of a × b is the negative of the corresponding component of b × a.',
      steps: [
        { label: 'What does anti-commutative mean?', content: 'If an operation is anti-commutative, swapping the inputs **flips the sign**: a × b = −(b × a). This is unlike the dot product, where a · b = b · a always. The cross product has this property because the direction of the perpendicular vector depends on the **order** of the inputs (right-hand rule).' },
        { label: 'Step 1: Compute a × b', content: 'Use the cross product formula — each component uses the "other two" coordinates:\n\n| Component | Formula | Calculation | Result |\n|-----------|---------|------------|--------|\n| i | a₂b₃ − a₃b₂ | 1×4 − (−1)×(−2) = 4 − 2 | **2** |\n| j | −(a₁b₃ − a₃b₁) | −(2×4 − (−1)×3) = −(8+3) | **−11** |\n| k | a₁b₂ − a₂b₁ | 2×(−2) − 1×3 = −4−3 | **−7** |\n\n**a × b = (2, −11, −7)**' },
        { label: 'Step 2: Compute b × a (swap the inputs)', content: 'Now use b as the first vector and a as the second:\n\n| Component | Formula | Calculation | Result |\n|-----------|---------|------------|--------|\n| i | b₂a₃ − b₃a₂ | (−2)×(−1) − 4×1 = 2−4 | **−2** |\n| j | −(b₁a₃ − b₃a₁) | −(3×(−1) − 4×2) = −(−3−8) | **11** |\n| k | b₁a₂ − b₂a₁ | 3×1 − (−2)×2 = 3+4 | **7** |\n\n**b × a = (−2, 11, 7)**' },
        { label: 'Step 3: Verify a × b = −(b × a)', content: '| Component | a × b | b × a | −(b × a) | Match? |\n|-----------|-------|-------|----------|--------|\n| i | 2 | −2 | 2 | ✓ |\n| j | −11 | 11 | −11 | ✓ |\n| k | −7 | 7 | −7 | ✓ |\n\nEvery component of a × b equals the negative of b × a — **anti-commutativity confirmed**.' },
      ],
      answer: 'a × b = (2, −11, −7) and b × a = (−2, 11, 7) — confirmed anti-commutative',
      code: 'a = (2, 1, -1)\nb = (3, -2, 4)\n\n# Your code here\n',
      codeSolution: 'a = (2, 1, -1)\nb = (3, -2, 4)\n\ndef cross(u, v):\n    return (\n        u[1]*v[2] - u[2]*v[1],\n        u[2]*v[0] - u[0]*v[2],\n        u[0]*v[1] - u[1]*v[0]\n    )\n\naxb = cross(a, b)\nbxa = cross(b, a)\nneg_bxa = (-bxa[0], -bxa[1], -bxa[2])\nprint(f"a x b = {axb}")\nprint(f"b x a = {bxa}")\nprint(f"a x b == -(b x a): {axb == neg_bxa}")',
    },
    {
      id: 'mat-24', difficulty: 3,
      question: 'Find a vector **orthogonal** to both **a** = (1, 0, 2) and **b** = (0, 1, −1) using the cross product. Then verify it is orthogonal to both by computing the dot products.',
      hint: 'The cross product a × b always gives a vector perpendicular to both a and b. After computing it, verify by checking that the dot product with each original vector is zero.',
      steps: [
        { label: 'Why does the cross product give an orthogonal vector?', content: 'This is one of the key properties of the 3D cross product: **a × b is always perpendicular to both a and b**. This is invaluable in physics (finding normals to surfaces) and computer graphics (computing face normals for lighting).' },
        { label: 'Step 1: Compute a × b', content: '| Component | Formula | Calculation | Result |\n|-----------|---------|------------|--------|\n| i | a₂b₃ − a₃b₂ | 0×(−1) − 2×1 | **−2** |\n| j | −(a₁b₃ − a₃b₁) | −(1×(−1) − 2×0) = −(−1) | **1** |\n| k | a₁b₂ − a₂b₁ | 1×1 − 0×0 | **1** |\n\n**n** = **(−2, 1, 1)**' },
        { label: 'Step 2: Verify n is orthogonal to a (dot product should be 0)', content: '| Component | n | a | Product |\n|-----------|---|---|---------|\n| 1st | −2 | 1 | −2 |\n| 2nd | 1 | 0 | 0 |\n| 3rd | 1 | 2 | 2 |\n| | | **Sum** | −2 + 0 + 2 = **0** ✓ |' },
        { label: 'Step 3: Verify n is orthogonal to b (dot product should be 0)', content: '| Component | n | b | Product |\n|-----------|---|---|---------|\n| 1st | −2 | 0 | 0 |\n| 2nd | 1 | 1 | 1 |\n| 3rd | 1 | −1 | −1 |\n| | | **Sum** | 0 + 1 + (−1) = **0** ✓ |\n\nBoth dot products are zero, confirming **n** is perpendicular to both original vectors.' },
      ],
      answer: 'Orthogonal vector = (−2, 1, 1)',
      code: 'a = (1, 0, 2)\nb = (0, 1, -1)\n\n# Your code here\n',
      codeSolution: 'a = (1, 0, 2)\nb = (0, 1, -1)\n\nn = (\n    a[1]*b[2] - a[2]*b[1],\n    a[2]*b[0] - a[0]*b[2],\n    a[0]*b[1] - a[1]*b[0]\n)\ndot_a = sum(x*y for x, y in zip(n, a))\ndot_b = sum(x*y for x, y in zip(n, b))\nprint(f"Orthogonal vector = {n}")\nprint(f"n . a = {dot_a}")\nprint(f"n . b = {dot_b}")',
    },

    // ════════════════════════════════════════════════════════════
    // AREA 3: MATRIX OPERATIONS (mat-25 to mat-37)
    // ════════════════════════════════════════════════════════════

    // ── Easy ──────────────────────────────────────────────────

    {
      id: 'mat-25', difficulty: 1,
      question: 'Add the matrices **A** = [[1, 2], [3, 4]] and **B** = [[5, 6], [7, 8]].',
      hint: 'Matrix addition works entry by entry — add each element in A to the element in the same position in B. Both matrices must be the same size.',
      steps: [
        { label: 'How does matrix addition work?', content: 'Matrix addition is straightforward: add the entries that are in the **same position**. Both matrices must have the same dimensions (here both are 2×2).' },
        { label: 'Step 1: Add each corresponding entry', content: '| Position | A | B | A + B |\n|----------|---|---|-------|\n| Row 1, Col 1 | 1 | 5 | **6** |\n| Row 1, Col 2 | 2 | 6 | **8** |\n| Row 2, Col 1 | 3 | 7 | **10** |\n| Row 2, Col 2 | 4 | 8 | **12** |' },
        { label: 'Result', content: '**A + B** = [[6, 8], [10, 12]]' },
      ],
      answer: '[[6, 8], [10, 12]]',
      code: 'A = [[1, 2], [3, 4]]\nB = [[5, 6], [7, 8]]\n\n# Your code here\n',
      codeSolution: 'A = [[1, 2], [3, 4]]\nB = [[5, 6], [7, 8]]\nC = [[A[i][j] + B[i][j] for j in range(2)] for i in range(2)]\nfor row in C:\n    print(row)',
    },
    {
      id: 'mat-26', difficulty: 1,
      question: 'Multiply the 2×2 matrix **A** = [[2, 0], [1, 3]] by the vector **v** = [4, 1]. What is **Av**?',
      visual: { kind: 'scatter', points: [[4, 1], [8, 7]], showLine: false },
      hint: 'Each row of the matrix "dots" with the vector to produce one entry of the result. Row 1 gives the first entry, row 2 gives the second.',
      steps: [
        { label: 'What is matrix-vector multiplication?', content: 'Each row of the matrix "dots" with the vector. Row 1 of A gives the first entry of the result, row 2 gives the second. This is how matrices **transform** vectors — they map one point to another.' },
        { label: 'Step 1: Row 1 dots with v', content: '| Row 1 of A | v | Multiply | Sum |\n|---|---|---|---|\n| [2, 0] | [4, 1] | 2×4 + 0×1 | **8** |' },
        { label: 'Step 2: Row 2 dots with v', content: '| Row 2 of A | v | Multiply | Sum |\n|---|---|---|---|\n| [1, 3] | [4, 1] | 1×4 + 3×1 | **7** |' },
        { label: 'Result', content: '**Av** = **[8, 7]** — the matrix transformed the point (4,1) to (8,7).' },
      ],
      answer: '[8, 7]',
      code: 'A = [[2, 0], [1, 3]]\nv = [4, 1]\n\n# Your code here\n',
      codeSolution: 'A = [[2, 0], [1, 3]]\nv = [4, 1]\nresult = [sum(A[i][j] * v[j] for j in range(2)) for i in range(2)]\nprint(f"Av = {result}")',
    },
    {
      id: 'mat-27', difficulty: 1,
      question: 'Find the **determinant** of A = [[3, 7], [1, 5]].',
      hint: 'For a 2×2 matrix [[a, b], [c, d]], the determinant is ad − bc. Multiply the diagonals: main diagonal minus off-diagonal.',
      steps: [
        { label: 'The 2×2 determinant formula', content: 'For a 2×2 matrix [[a, b], [c, d]]:\n\n**det = ad − bc**\n\nMultiply the main diagonal (top-left × bottom-right), then subtract the other diagonal (top-right × bottom-left). The determinant tells you how much the matrix scales areas.' },
        { label: 'Step 1: Identify and multiply the diagonals', content: '| Diagonal | Entries | Product |\n|----------|---------|--------|\n| Main (↘) | 3 × 5 | **15** |\n| Off (↗) | 7 × 1 | **7** |' },
        { label: 'Step 2: Subtract', content: 'det(A) = 15 − 7 = **8**\n\nSince det = 8 > 0, the matrix preserves orientation and scales areas by a factor of 8.' },
      ],
      answer: '8',
      code: 'A = [[3, 7], [1, 5]]\n\n# Your code here\n',
      codeSolution: 'A = [[3, 7], [1, 5]]\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\nprint(f"det(A) = {det}")',
    },
    {
      id: 'mat-28', difficulty: 1,
      question: 'Multiply matrices **A** = [[1, 2], [3, 4]] and **B** = [[2, 0], [1, 1]]. What is **AB**?',
      hint: 'Each entry C[i][j] is the dot product of row i of A with column j of B. For a 2×2 result, you need 4 such dot products.',
      steps: [
        { label: 'How does matrix multiplication work?', content: 'To get entry (i, j) of the result, take **row i of A** and **column j of B**, then compute their dot product. For two 2×2 matrices, the result has 4 entries = 4 dot products.' },
        { label: 'Step 1: Compute all four entries', content: '| Entry | Row of A | Col of B | Dot product | Result |\n|-------|----------|----------|------------|--------|\n| C₁₁ | [1, 2] | [2, 1] | 1×2 + 2×1 | **4** |\n| C₁₂ | [1, 2] | [0, 1] | 1×0 + 2×1 | **2** |\n| C₂₁ | [3, 4] | [2, 1] | 3×2 + 4×1 | **10** |\n| C₂₂ | [3, 4] | [0, 1] | 3×0 + 4×1 | **4** |' },
        { label: 'Result', content: '**AB** = [[4, 2], [10, 4]]' },
      ],
      answer: '[[4, 2], [10, 4]]',
      code: 'A = [[1, 2], [3, 4]]\nB = [[2, 0], [1, 1]]\n\n# Your code here\n',
      codeSolution: 'A = [[1, 2], [3, 4]]\nB = [[2, 0], [1, 1]]\nC = [[sum(A[i][k]*B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\nfor row in C:\n    print(row)',
    },
    {
      id: 'mat-29', difficulty: 1,
      question: 'Multiply the scalar **3** by the matrix **A** = [[1, −2], [4, 0]]. What is **3A**?',
      hint: 'Scalar-matrix multiplication means multiplying every single entry in the matrix by the scalar. The matrix keeps its shape.',
      steps: [
        { label: 'How does scalar-matrix multiplication work?', content: 'Multiply **every entry** in the matrix by the scalar. The matrix keeps its dimensions — only the values change. This scales the entire transformation by that factor.' },
        { label: 'Step 1: Multiply each entry by 3', content: '| Position | A entry | × 3 | 3A entry |\n|----------|---------|------|----------|\n| Row 1, Col 1 | 1 | 3×1 | **3** |\n| Row 1, Col 2 | −2 | 3×(−2) | **−6** |\n| Row 2, Col 1 | 4 | 3×4 | **12** |\n| Row 2, Col 2 | 0 | 3×0 | **0** |' },
        { label: 'Result', content: '**3A** = [[3, −6], [12, 0]]' },
      ],
      answer: '[[3, −6], [12, 0]]',
      code: 'A = [[1, -2], [4, 0]]\nscalar = 3\n\n# Your code here\n',
      codeSolution: 'A = [[1, -2], [4, 0]]\nscalar = 3\nresult = [[scalar * A[i][j] for j in range(2)] for i in range(2)]\nfor row in result:\n    print(row)',
    },

    // ── Medium ────────────────────────────────────────────────

    {
      id: 'mat-30', difficulty: 2,
      question: 'Find the **inverse** of A = [[4, 7], [2, 6]]. Verify by computing A × A⁻¹.',
      hint: 'The 2×2 inverse formula: swap the diagonal entries, negate the off-diagonal entries, then divide everything by the determinant. The result times A should give the identity matrix.',
      steps: [
        { label: 'The 2×2 inverse formula', content: 'For A = [[a, b], [c, d]], the inverse is:\n\nA⁻¹ = (1/det) × [[d, −b], [−c, a]]\n\nRecipe: **swap** the main diagonal (a↔d), **negate** the off-diagonal (b and c get minus signs), then **divide** by det(A). This only works when det ≠ 0.' },
        { label: 'Step 1: Find the determinant', content: 'det(A) = 4×6 − 7×2 = 24 − 14 = **10**\n\nSince det ≠ 0, the inverse exists.' },
        { label: 'Step 2: Apply the formula', content: '| Operation | Entry | Result |\n|-----------|-------|--------|\n| Swap diagonal: d → position of a | 6 | 6/10 = **0.6** |\n| Negate off-diag: −b | −7 | −7/10 = **−0.7** |\n| Negate off-diag: −c | −2 | −2/10 = **−0.2** |\n| Swap diagonal: a → position of d | 4 | 4/10 = **0.4** |\n\nA⁻¹ = [[0.6, −0.7], [−0.2, 0.4]]' },
        { label: 'Step 3: Verify AA⁻¹ = I (identity)', content: '| Entry | Row of A | Col of A⁻¹ | Dot product | Expected |\n|-------|----------|-----------|------------|----------|\n| (1,1) | [4, 7] | [0.6, −0.2] | 2.4 − 1.4 | **1** ✓ |\n| (1,2) | [4, 7] | [−0.7, 0.4] | −2.8 + 2.8 | **0** ✓ |\n| (2,1) | [2, 6] | [0.6, −0.2] | 1.2 − 1.2 | **0** ✓ |\n| (2,2) | [2, 6] | [−0.7, 0.4] | −1.4 + 2.4 | **1** ✓ |\n\nAA⁻¹ = [[1, 0], [0, 1]] = I ✓' },
      ],
      answer: 'A⁻¹ = [[0.6, −0.7], [−0.2, 0.4]]',
      code: 'A = [[4, 7], [2, 6]]\n\n# Your code here\n',
      codeSolution: 'A = [[4, 7], [2, 6]]\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\nA_inv = [\n    [A[1][1]/det, -A[0][1]/det],\n    [-A[1][0]/det, A[0][0]/det]\n]\nprint("A inverse:")\nfor row in A_inv:\n    print([round(x, 4) for x in row])\n\n# Verify\nI = [[sum(A[i][k]*A_inv[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\nprint("\\nA * A_inv:")\nfor row in I:\n    print([round(x, 4) for x in row])',
    },
    {
      id: 'mat-31', difficulty: 2,
      question: 'A shop sells apples at ₹50/kg and bananas at ₹30/kg. Customer A buys 2 kg apples and 3 kg bananas. Customer B buys 4 kg apples and 1 kg bananas. Express as a matrix multiplication and compute each bill.\n\n**Quantity matrix** Q = [[2, 3], [4, 1]], **Price vector** p = [50, 30].',
      hint: 'This is a matrix-vector multiplication: Q × p. Each row of Q represents one customer\'s purchases, and the dot product with the price vector gives their total bill.',
      steps: [
        { label: 'Why use matrices for this?', content: 'Each customer buys multiple items, each with a price. The total bill is a dot product: (quantities) · (prices). When you have multiple customers, stack their quantity rows into a matrix and multiply by the price vector — one operation gives all bills at once.' },
        { label: 'Step 1: Customer A\'s bill (Row 1 dots with prices)', content: '| Item | Quantity | Price | Cost |\n|------|----------|-------|------|\n| Apples | 2 kg | ₹50/kg | 2 × 50 = ₹100 |\n| Bananas | 3 kg | ₹30/kg | 3 × 30 = ₹90 |\n| | | **Total** | **₹190** |' },
        { label: 'Step 2: Customer B\'s bill (Row 2 dots with prices)', content: '| Item | Quantity | Price | Cost |\n|------|----------|-------|------|\n| Apples | 4 kg | ₹50/kg | 4 × 50 = ₹200 |\n| Bananas | 1 kg | ₹30/kg | 1 × 30 = ₹30 |\n| | | **Total** | **₹230** |' },
        { label: 'Matrix form', content: 'Qp = [[2,3],[4,1]] × [50,30] = **[190, 230]**\n\nOne matrix multiplication computed both bills simultaneously — this is why matrices are so powerful for batch calculations.' },
      ],
      answer: 'Customer A: ₹190, Customer B: ₹230',
      code: 'Q = [[2, 3], [4, 1]]\np = [50, 30]\n\n# Your code here\n',
      codeSolution: 'Q = [[2, 3], [4, 1]]\np = [50, 30]\nbills = [sum(Q[i][j] * p[j] for j in range(2)) for i in range(2)]\nprint(f"Customer A: Rs {bills[0]}")\nprint(f"Customer B: Rs {bills[1]}")',
    },
    {
      id: 'mat-32', difficulty: 2,
      question: 'Verify that matrix multiplication is **not commutative**: compute **AB** and **BA** for A = [[1, 2], [0, 1]] and B = [[0, 1], [1, 0]], and show they are different.',
      hint: 'Compute AB by taking rows of A dotted with columns of B. Then compute BA by taking rows of B dotted with columns of A. Compare the results — they should differ.',
      steps: [
        { label: 'Why is matrix multiplication not commutative?', content: 'With regular numbers, 3×5 = 5×3 always. But with matrices, **AB ≠ BA** in general. This is because matrix multiplication represents **composing transformations**, and the order you apply transformations matters. (Rotating then scaling is different from scaling then rotating.)' },
        { label: 'Step 1: Compute AB', content: '| Entry | Row of A | Col of B | Dot product | Result |\n|-------|----------|----------|------------|--------|\n| (1,1) | [1, 2] | [0, 1] | 0+2 | **2** |\n| (1,2) | [1, 2] | [1, 0] | 1+0 | **1** |\n| (2,1) | [0, 1] | [0, 1] | 0+1 | **1** |\n| (2,2) | [0, 1] | [1, 0] | 0+0 | **0** |\n\n**AB** = [[2, 1], [1, 0]]' },
        { label: 'Step 2: Compute BA', content: '| Entry | Row of B | Col of A | Dot product | Result |\n|-------|----------|----------|------------|--------|\n| (1,1) | [0, 1] | [1, 0] | 0+0 | **0** |\n| (1,2) | [0, 1] | [2, 1] | 0+1 | **1** |\n| (2,1) | [1, 0] | [1, 0] | 1+0 | **1** |\n| (2,2) | [1, 0] | [2, 1] | 2+0 | **2** |\n\n**BA** = [[0, 1], [1, 2]]' },
        { label: 'Step 3: Compare', content: '| Position | AB | BA | Same? |\n|----------|----|----|-------|\n| (1,1) | 2 | 0 | No |\n| (1,2) | 1 | 1 | Yes |\n| (2,1) | 1 | 1 | Yes |\n| (2,2) | 0 | 2 | No |\n\nAB ≠ BA — matrix multiplication is **not commutative** ✓' },
      ],
      answer: 'AB = [[2,1],[1,0]], BA = [[0,1],[1,2]] — they differ',
      code: 'A = [[1, 2], [0, 1]]\nB = [[0, 1], [1, 0]]\n\n# Your code here\n',
      codeSolution: 'def mat_mul(A, B):\n    n = len(A)\n    return [[sum(A[i][k]*B[k][j] for k in range(n)) for j in range(n)] for i in range(n)]\n\nA = [[1, 2], [0, 1]]\nB = [[0, 1], [1, 0]]\nAB = mat_mul(A, B)\nBA = mat_mul(B, A)\nprint(f"AB = {AB}")\nprint(f"BA = {BA}")\nprint(f"AB == BA: {AB == BA}")',
    },
    {
      id: 'mat-33', difficulty: 2,
      question: 'Compute the **determinant of a 3×3 matrix** A = [[2, 1, 3], [0, 4, 1], [1, 0, 2]] using cofactor expansion along the first row.',
      hint: 'Cofactor expansion: pick a row (here row 1), then for each entry, cross out its row and column to get a 2×2 minor. Multiply the entry by its minor\'s determinant, alternating signs (+, −, +).',
      steps: [
        { label: 'How does cofactor expansion work?', content: 'To find the determinant of a 3×3 matrix, **expand along any row or column**. For each entry in that row:\n\n1. Cross out the entry\'s row and column — the remaining 2×2 matrix is its **minor**\n2. Compute the minor\'s determinant\n3. Multiply by the entry, with **alternating signs**: +, −, +, −, ...\n\nThe sum of these products is the determinant.' },
        { label: 'Step 1: Cofactor of a₁₁ = 2 (sign: +)', content: 'Cross out row 1 and column 1:\n\nMinor = [[4, 1], [0, 2]]\ndet(minor) = 4×2 − 1×0 = **8**\n\nContribution = +2 × 8 = **16**' },
        { label: 'Step 2: Cofactor of a₁₂ = 1 (sign: −)', content: 'Cross out row 1 and column 2:\n\nMinor = [[0, 1], [1, 2]]\ndet(minor) = 0×2 − 1×1 = **−1**\n\nContribution = −1 × (−1) = **1**' },
        { label: 'Step 3: Cofactor of a₁₃ = 3 (sign: +)', content: 'Cross out row 1 and column 3:\n\nMinor = [[0, 4], [1, 0]]\ndet(minor) = 0×0 − 4×1 = **−4**\n\nContribution = +3 × (−4) = **−12**' },
        { label: 'Step 4: Sum all contributions', content: '| Entry | Value | Minor det | Sign | Contribution |\n|-------|-------|-----------|------|--------------|\n| a₁₁ | 2 | 8 | + | **16** |\n| a₁₂ | 1 | −1 | − | **1** |\n| a₁₃ | 3 | −4 | + | **−12** |\n| | | | **Total** | 16 + 1 + (−12) = **5** |' },
      ],
      answer: 'det(A) = 5',
      code: 'A = [[2, 1, 3], [0, 4, 1], [1, 0, 2]]\n\n# Your code here\n',
      codeSolution: 'A = [[2, 1, 3], [0, 4, 1], [1, 0, 2]]\n\ndef det3(M):\n    return (M[0][0] * (M[1][1]*M[2][2] - M[1][2]*M[2][1])\n          - M[0][1] * (M[1][0]*M[2][2] - M[1][2]*M[2][0])\n          + M[0][2] * (M[1][0]*M[2][1] - M[1][1]*M[2][0]))\n\nprint(f"det(A) = {det3(A)}")',
    },

    // ── Hard ──────────────────────────────────────────────────

    {
      id: 'mat-34', difficulty: 3,
      question: 'Solve the system of linear equations using matrix inversion:\n\n3x + 2y = 12\n\nx + 4y = 10\n\nExpress as **Ax = b** and find **x = A⁻¹b**.',
      visual: { kind: 'scatter', points: [[0, 6], [10, 0], [0, 2.5], [4, 0], [2, 3]], showLine: false },
      hint: 'First write the system as Ax = b where A holds the coefficients and b holds the right-hand side. Then find A⁻¹ using the 2×2 inverse formula (swap diagonal, negate off-diagonal, divide by det). Finally multiply A⁻¹ × b to get x and y.',
      steps: [
        { label: 'How does matrix inversion solve equations?', content: 'A system of linear equations can be written as **Ax = b**, where A is the coefficient matrix, x is the unknowns vector, and b is the constants vector. If A is invertible (det ≠ 0), then **x = A⁻¹b** gives the unique solution — just like solving ax = b gives x = b/a in regular algebra.' },
        { label: 'Step 1: Set up the matrix equation', content: '| Equation | Coefficients | Constant |\n|----------|-------------|----------|\n| 3x + 2y = 12 | [3, 2] | 12 |\n| x + 4y = 10 | [1, 4] | 10 |\n\nA = [[3, 2], [1, 4]], b = [12, 10]' },
        { label: 'Step 2: Find det(A)', content: 'det(A) = 3×4 − 2×1 = 12 − 2 = **10**\n\nSince det ≠ 0, a unique solution exists.' },
        { label: 'Step 3: Find A⁻¹ using the 2×2 formula', content: 'Swap diagonal, negate off-diagonal, divide by det:\n\nA⁻¹ = (1/10) × [[4, −2], [−1, 3]] = [[0.4, −0.2], [−0.1, 0.3]]' },
        { label: 'Step 4: Compute x = A⁻¹b', content: '| Unknown | Row of A⁻¹ | b | Dot product | Result |\n|---------|-----------|---|------------|--------|\n| x | [0.4, −0.2] | [12, 10] | 0.4×12 + (−0.2)×10 = 4.8 − 2 | **2.8** |\n| y | [−0.1, 0.3] | [12, 10] | (−0.1)×12 + 0.3×10 = −1.2 + 3 | **1.8** |' },
        { label: 'Step 5: Verify by plugging back in', content: '| Equation | Substitution | Result | Expected |\n|----------|-------------|--------|----------|\n| 3x + 2y | 3(2.8) + 2(1.8) = 8.4 + 3.6 | **12** | 12 ✓ |\n| x + 4y | 2.8 + 4(1.8) = 2.8 + 7.2 | **10** | 10 ✓ |' },
      ],
      answer: 'x = 2.8, y = 1.8',
      code: 'A = [[3, 2], [1, 4]]\nb = [12, 10]\n\n# Your code here\n',
      codeSolution: 'A = [[3, 2], [1, 4]]\nb = [12, 10]\n\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\nA_inv = [\n    [A[1][1]/det, -A[0][1]/det],\n    [-A[1][0]/det, A[0][0]/det]\n]\n\nx = A_inv[0][0]*b[0] + A_inv[0][1]*b[1]\ny = A_inv[1][0]*b[0] + A_inv[1][1]*b[1]\n\nprint(f"x = {x}")\nprint(f"y = {y}")\nprint(f"\\nVerify: 3*{x} + 2*{y} = {3*x + 2*y}")\nprint(f"Verify: 1*{x} + 4*{y} = {x + 4*y}")',
    },
    {
      id: 'mat-35', difficulty: 3,
      question: 'Verify that **det(AB) = det(A) × det(B)** for A = [[2, 1], [3, 4]] and B = [[1, 5], [0, 2]]. Compute all three determinants.',
      hint: 'Compute det(A) and det(B) separately, then multiply them. Also compute AB and find its determinant. The two results should match — this is the multiplicative property of determinants.',
      steps: [
        { label: 'Why does det(AB) = det(A) × det(B)?', content: 'Determinants measure **area scaling**. If A scales areas by factor det(A) and B scales by det(B), then applying both (AB) scales by det(A) × det(B). This is why the determinant of a product equals the product of the determinants.' },
        { label: 'Step 1: Compute det(A) and det(B)', content: '| Matrix | Formula | Calculation | det |\n|--------|---------|------------|-----|\n| A = [[2,1],[3,4]] | ad − bc | 2×4 − 1×3 | **5** |\n| B = [[1,5],[0,2]] | ad − bc | 1×2 − 5×0 | **2** |\n\ndet(A) × det(B) = 5 × 2 = **10**' },
        { label: 'Step 2: Compute AB', content: '| Entry | Row of A | Col of B | Dot product | Result |\n|-------|----------|----------|------------|--------|\n| (1,1) | [2, 1] | [1, 0] | 2+0 | **2** |\n| (1,2) | [2, 1] | [5, 2] | 10+2 | **12** |\n| (2,1) | [3, 4] | [1, 0] | 3+0 | **3** |\n| (2,2) | [3, 4] | [5, 2] | 15+8 | **23** |\n\n**AB** = [[2, 12], [3, 23]]' },
        { label: 'Step 3: Compute det(AB) and verify', content: 'det(AB) = 2×23 − 12×3 = 46 − 36 = **10**\n\ndet(A) × det(B) = 5 × 2 = **10** = det(AB) ✓\n\nThe property holds.' },
      ],
      answer: 'det(A)=5, det(B)=2, det(AB)=10 — property verified',
      code: 'A = [[2, 1], [3, 4]]\nB = [[1, 5], [0, 2]]\n\n# Your code here\n',
      codeSolution: 'def det2(M):\n    return M[0][0]*M[1][1] - M[0][1]*M[1][0]\n\ndef mat_mul(A, B):\n    return [[sum(A[i][k]*B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\n\nA = [[2, 1], [3, 4]]\nB = [[1, 5], [0, 2]]\nAB = mat_mul(A, B)\n\nprint(f"det(A) = {det2(A)}")\nprint(f"det(B) = {det2(B)}")\nprint(f"det(A)*det(B) = {det2(A)*det2(B)}")\nprint(f"det(AB) = {det2(AB)}")\nprint(f"Property holds: {det2(A)*det2(B) == det2(AB)}")',
    },
    {
      id: 'mat-36', difficulty: 3,
      question: 'An ML model has a weight matrix **W** = [[0.5, 0.3], [0.2, 0.8]] and applies it to feature vectors. If the input is **x** = [10, 20], compute **Wx**. Then apply **W** again to the result: what is **W²x**? (This models a 2-layer network with shared weights.)',
      hint: 'First compute Wx by dotting each row of W with x. Then take that result and multiply by W again to get W(Wx) = W²x. This shows how repeated matrix application transforms data through multiple layers.',
      steps: [
        { label: 'What does repeated matrix multiplication model?', content: 'In a neural network, each layer transforms the input by multiplying by a weight matrix (plus a bias and activation, simplified here). Applying W twice models a **2-layer network with shared weights** — the input gets transformed, then transformed again by the same matrix.' },
        { label: 'Step 1: Compute Wx (first layer)', content: '| Row of W | x | Dot product | Result |\n|----------|---|------------|--------|\n| [0.5, 0.3] | [10, 20] | 0.5×10 + 0.3×20 = 5 + 6 | **11** |\n| [0.2, 0.8] | [10, 20] | 0.2×10 + 0.8×20 = 2 + 16 | **18** |\n\n**Wx** = **[11, 18]**' },
        { label: 'Step 2: Compute W(Wx) = W²x (second layer)', content: 'Now use [11, 18] as the new input:\n\n| Row of W | Wx | Dot product | Result |\n|----------|-----|------------|--------|\n| [0.5, 0.3] | [11, 18] | 0.5×11 + 0.3×18 = 5.5 + 5.4 | **10.9** |\n| [0.2, 0.8] | [11, 18] | 0.2×11 + 0.8×18 = 2.2 + 14.4 | **16.6** |\n\n**W²x** = **[10.9, 16.6]**\n\nNotice the values are converging — repeated application of W is pulling the vector toward a steady state (related to W\'s dominant eigenvector).' },
      ],
      answer: 'Wx = [11, 18], W²x = [10.9, 16.6]',
      code: 'W = [[0.5, 0.3], [0.2, 0.8]]\nx = [10, 20]\n\n# Your code here\n',
      codeSolution: 'W = [[0.5, 0.3], [0.2, 0.8]]\nx = [10, 20]\n\ndef mat_vec(M, v):\n    return [sum(M[i][j]*v[j] for j in range(len(v))) for i in range(len(M))]\n\nwx = mat_vec(W, x)\nw2x = mat_vec(W, wx)\nprint(f"Wx = {wx}")\nprint(f"W^2 x = {w2x}")',
    },
    {
      id: 'mat-37', difficulty: 2,
      question: 'Find the **transpose** of A = [[1, 2, 3], [4, 5, 6]] and verify that **(Aᵀ)ᵀ = A**.',
      hint: 'The transpose flips a matrix over its diagonal — rows become columns and columns become rows. Entry (i, j) in A becomes entry (j, i) in Aᵀ.',
      steps: [
        { label: 'What is a transpose?', content: 'The **transpose** of a matrix flips it over its main diagonal: rows become columns, columns become rows. Formally, (Aᵀ)ᵢⱼ = Aⱼᵢ. A 2×3 matrix becomes a 3×2 matrix.' },
        { label: 'Step 1: Transpose A (rows become columns)', content: '| Original A (2×3) | Aᵀ (3×2) |\n|------|------|\n| Row 1: [1, 2, 3] → becomes Column 1 | [1, 4] |\n| Row 2: [4, 5, 6] → becomes Column 2 | [2, 5] |\n| | [3, 6] |\n\nAᵀ = [[1, 4], [2, 5], [3, 6]]' },
        { label: 'Step 2: Transpose again — (Aᵀ)ᵀ', content: 'Now Aᵀ is 3×2, so (Aᵀ)ᵀ will be 2×3:\n\nRows of Aᵀ become columns of (Aᵀ)ᵀ:\n\n(Aᵀ)ᵀ = [[1, 2, 3], [4, 5, 6]] = **A** ✓\n\nTransposing twice always gets you back to the original — this is a general property.' },
      ],
      answer: 'Aᵀ = [[1, 4], [2, 5], [3, 6]]',
      code: 'A = [[1, 2, 3], [4, 5, 6]]\n\n# Your code here\n',
      codeSolution: 'A = [[1, 2, 3], [4, 5, 6]]\nrows, cols = len(A), len(A[0])\nAt = [[A[i][j] for i in range(rows)] for j in range(cols)]\nAtt = [[At[i][j] for i in range(cols)] for j in range(rows)]\n\nprint("A =")\nfor row in A: print(row)\nprint("\\nA^T =")\nfor row in At: print(row)\nprint(f"\\n(A^T)^T == A: {Att == A}")',
    },

    // ════════════════════════════════════════════════════════════
    // AREA 4: TRANSFORMATIONS & EIGENVALUES (mat-38 to mat-50)
    // ════════════════════════════════════════════════════════════

    // ── Easy ──────────────────────────────────────────────────

    {
      id: 'mat-38', difficulty: 1,
      question: 'A **scaling matrix** S = [[2, 0], [0, 3]] stretches x by 2 and y by 3. Apply it to the point **(1, 1)**. Where does the point end up?',
      visual: { kind: 'scatter', points: [[1, 1], [2, 3]], showLine: true },
      hint: 'A diagonal matrix scales each axis independently. The top-left entry scales x, the bottom-right entry scales y. Multiply the matrix by the vector to see the effect.',
      steps: [
        { label: 'How do scaling matrices work?', content: 'A **diagonal matrix** (zeros off the diagonal) scales each axis independently. The entry at position (1,1) scales the x-component, and (2,2) scales the y-component. Here, x gets doubled and y gets tripled.' },
        { label: 'Step 1: Multiply S × v', content: '| Row of S | v | Dot product | Meaning |\n|----------|---|------------|--------|\n| [2, 0] | [1, 1] | 2×1 + 0×1 = **2** | x stretched by 2 |\n| [0, 3] | [1, 1] | 0×1 + 3×1 = **3** | y stretched by 3 |' },
        { label: 'Result', content: 'The point moves from (1, 1) to **(2, 3)** — stretched rightward and upward.' },
      ],
      answer: '(2, 3)',
      code: 'S = [[2, 0], [0, 3]]\nv = [1, 1]\n\n# Your code here\n',
      codeSolution: 'S = [[2, 0], [0, 3]]\nv = [1, 1]\nresult = [sum(S[i][j]*v[j] for j in range(2)) for i in range(2)]\nprint(f"Transformed point: ({result[0]}, {result[1]})")',
    },
    {
      id: 'mat-39', difficulty: 1,
      question: 'A **reflection matrix** across the x-axis is R = [[1, 0], [0, −1]]. Reflect the point **(3, 5)** across the x-axis.',
      visual: { kind: 'scatter', points: [[3, 5], [3, -5]], showLine: true },
      hint: 'This matrix keeps the x-component the same (multiplied by 1) but flips the y-component (multiplied by −1). That is a reflection across the x-axis.',
      steps: [
        { label: 'How do reflection matrices work?', content: 'Reflecting across the x-axis means: **keep x, flip y**. The matrix [[1, 0], [0, −1]] does exactly this — the 1 preserves x, and the −1 negates y. Every point above the x-axis maps to a mirror point below it, and vice versa.' },
        { label: 'Step 1: Multiply R × v', content: '| Row of R | v | Dot product | Effect |\n|----------|---|------------|--------|\n| [1, 0] | [3, 5] | 1×3 + 0×5 = **3** | x unchanged |\n| [0, −1] | [3, 5] | 0×3 + (−1)×5 = **−5** | y flipped |' },
        { label: 'Result', content: 'Reflected point = **(3, −5)** — same x-position, but now below the x-axis instead of above it.' },
      ],
      answer: '(3, −5)',
      code: 'R = [[1, 0], [0, -1]]\nv = [3, 5]\n\n# Your code here\n',
      codeSolution: 'R = [[1, 0], [0, -1]]\nv = [3, 5]\nresult = [sum(R[i][j]*v[j] for j in range(2)) for i in range(2)]\nprint(f"Reflected point: ({result[0]}, {result[1]})")',
    },
    {
      id: 'mat-40', difficulty: 1,
      question: 'Write the **90° counter-clockwise rotation matrix** and apply it to the point **(1, 0)**. Where does it end up?',
      visual: { kind: 'scatter', points: [[1, 0], [0, 1]], showLine: true },
      hint: 'The general 2D rotation matrix is [[cos θ, −sin θ], [sin θ, cos θ]]. Plug in θ = 90° (where cos 90° = 0 and sin 90° = 1) to get the specific matrix, then multiply.',
      steps: [
        { label: 'The rotation matrix formula', content: 'To rotate a point by angle θ counter-clockwise around the origin, multiply by:\n\nR(θ) = [[cos θ, −sin θ], [sin θ, cos θ]]\n\nThis formula comes from trigonometry — it maps (1,0) to (cos θ, sin θ) and (0,1) to (−sin θ, cos θ).' },
        { label: 'Step 1: Build R(90°)', content: '| Trig value | Result |\n|-----------|--------|\n| cos 90° | **0** |\n| sin 90° | **1** |\n\nR = [[0, −1], [1, 0]]' },
        { label: 'Step 2: Apply R to (1, 0)', content: '| Row of R | v | Dot product |\n|----------|---|------------|\n| [0, −1] | [1, 0] | 0×1 + (−1)×0 = **0** |\n| [1, 0] | [1, 0] | 1×1 + 0×0 = **1** |' },
        { label: 'Result', content: 'The point **(1, 0)** rotates to **(0, 1)** — it moved from the positive x-axis to the positive y-axis, which is exactly a 90° counter-clockwise rotation ✓' },
      ],
      answer: '(0, 1)',
      code: 'import math\n\ntheta = math.radians(90)\nR = [[round(math.cos(theta)), round(-math.sin(theta))],\n     [round(math.sin(theta)), round(math.cos(theta))]]\nv = [1, 0]\n\n# Your code here\n',
      codeSolution: 'import math\n\ntheta = math.radians(90)\nc, s = math.cos(theta), math.sin(theta)\nR = [[c, -s], [s, c]]\nv = [1, 0]\nresult = [sum(R[i][j]*v[j] for j in range(2)) for i in range(2)]\nprint(f"Rotation matrix:\\n{R[0]}\\n{R[1]}")\nprint(f"Rotated point: ({result[0]:.0f}, {result[1]:.0f})")',
    },

    // ── Medium ────────────────────────────────────────────────

    {
      id: 'mat-41', difficulty: 2,
      question: 'An image processing pipeline first **scales** by S = [[2, 0], [0, 2]] and then **rotates 45°**. The rotation matrix is R = [[cos45°, −sin45°], [sin45°, cos45°]]. What is the **combined transformation** matrix T = RS? Apply T to the point **(1, 0)**.',
      visual: { kind: 'scatter', points: [[1, 0], [2, 0], [1.414, 1.414]], showLine: true },
      hint: 'The combined transformation is T = RS (rotation after scaling = R × S). The order matters: S is applied first, then R. Multiply the two matrices, then multiply the result by the point.',
      steps: [
        { label: 'Why is the order T = RS, not SR?', content: 'When we write T = RS, the **rightmost** matrix (S) is applied **first**. The pipeline is: point → S (scale) → R (rotate). Reading right-to-left is standard in linear algebra because (RS)v = R(Sv) — v gets scaled first, then the result gets rotated.' },
        { label: 'Step 1: Write out R(45°)', content: 'cos 45° = sin 45° = √2/2 ≈ 0.7071\n\nR = [[0.7071, −0.7071], [0.7071, 0.7071]]' },
        { label: 'Step 2: Compute T = R × S', content: '| Entry | Row of R | Col of S | Dot product | Result |\n|-------|----------|----------|------------|--------|\n| T₁₁ | [0.7071, −0.7071] | [2, 0] | 0.7071×2 + (−0.7071)×0 | **1.4142** |\n| T₁₂ | [0.7071, −0.7071] | [0, 2] | 0.7071×0 + (−0.7071)×2 | **−1.4142** |\n| T₂₁ | [0.7071, 0.7071] | [2, 0] | 0.7071×2 + 0.7071×0 | **1.4142** |\n| T₂₂ | [0.7071, 0.7071] | [0, 2] | 0.7071×0 + 0.7071×2 | **1.4142** |\n\nT = [[√2, −√2], [√2, √2]] ≈ [[1.414, −1.414], [1.414, 1.414]]' },
        { label: 'Step 3: Apply T to (1, 0)', content: '| Row of T | v | Dot product |\n|----------|---|------------|\n| [1.4142, −1.4142] | [1, 0] | **1.4142** |\n| [1.4142, 1.4142] | [1, 0] | **1.4142** |\n\nT(1, 0) = **(1.414, 1.414)** — the point was scaled to (2, 0) then rotated 45° up.' },
      ],
      answer: 'T = [[√2, −√2], [√2, √2]]; T(1,0) ≈ (1.414, 1.414)',
      code: 'import math\n\ntheta = math.radians(45)\nR = [[math.cos(theta), -math.sin(theta)],\n     [math.sin(theta), math.cos(theta)]]\nS = [[2, 0], [0, 2]]\nv = [1, 0]\n\n# Your code here\n',
      codeSolution: 'import math\n\ndef mat_mul(A, B):\n    return [[sum(A[i][k]*B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\n\ndef mat_vec(M, v):\n    return [sum(M[i][j]*v[j] for j in range(2)) for i in range(2)]\n\ntheta = math.radians(45)\nR = [[math.cos(theta), -math.sin(theta)],\n     [math.sin(theta), math.cos(theta)]]\nS = [[2, 0], [0, 2]]\n\nT = mat_mul(R, S)\nresult = mat_vec(T, [1, 0])\n\nprint("T =")\nfor row in T: print([round(x, 4) for x in row])\nprint(f"\\nT(1,0) = ({result[0]:.4f}, {result[1]:.4f})")',
    },
    {
      id: 'mat-42', difficulty: 2,
      question: 'A **shear transformation** is given by H = [[1, 2], [0, 1]]. Apply it to the unit square corners (0,0), (1,0), (1,1), (0,1). What shape results?',
      visual: { kind: 'scatter', points: [[0, 0], [1, 0], [3, 1], [2, 1]], showLine: true },
      hint: 'A shear "slides" points sideways in proportion to their height (y-value). Apply H to each corner separately. Then check the determinant to see if area is preserved.',
      steps: [
        { label: 'What does a shear do?', content: 'A **shear** slides points parallel to one axis, with the amount of slide proportional to their distance from that axis. H = [[1, 2], [0, 1]] is a horizontal shear: x → x + 2y (shifted right by 2× the y-value), while y stays the same. Points on the x-axis don\'t move; points higher up slide further right.' },
        { label: 'Step 1: Transform each corner', content: '| Corner (x, y) | x\' = 1×x + 2×y | y\' = 0×x + 1×y | Result |\n|---------------|----------------|----------------|--------|\n| (0, 0) | 0 + 0 | 0 | **(0, 0)** |\n| (1, 0) | 1 + 0 | 0 | **(1, 0)** |\n| (1, 1) | 1 + 2 | 1 | **(3, 1)** |\n| (0, 1) | 0 + 2 | 1 | **(2, 1)** |\n\nThe bottom edge stayed put, but the top edge slid 2 units to the right.' },
        { label: 'Step 2: Identify the resulting shape', content: 'The unit square becomes a **parallelogram** with vertices (0,0), (1,0), (3,1), (2,1).' },
        { label: 'Step 3: Check if area changed', content: 'det(H) = 1×1 − 2×0 = **1**\n\nSince det = 1, the area is **preserved** — the parallelogram has the same area as the original unit square (1 square unit). Shears distort shape but not area.' },
      ],
      answer: 'Parallelogram with corners (0,0), (1,0), (3,1), (2,1); area = 1',
      code: 'H = [[1, 2], [0, 1]]\ncorners = [(0,0), (1,0), (1,1), (0,1)]\n\n# Your code here\n',
      codeSolution: 'H = [[1, 2], [0, 1]]\ncorners = [(0,0), (1,0), (1,1), (0,1)]\n\ntransformed = []\nfor v in corners:\n    tv = (H[0][0]*v[0] + H[0][1]*v[1], H[1][0]*v[0] + H[1][1]*v[1])\n    transformed.append(tv)\n    print(f"H{v} = {tv}")\n\ndet = H[0][0]*H[1][1] - H[0][1]*H[1][0]\nprint(f"\\ndet(H) = {det} (area is preserved)")',
    },
    {
      id: 'mat-43', difficulty: 2,
      question: 'Show that applying the **same rotation matrix** R(30°) **three times** is equivalent to a single rotation by **90°**. Verify by computing R(30°)³ and comparing to R(90°).',
      visual: { kind: 'scatter', points: [[1, 0], [0.866, 0.5], [0.5, 0.866], [0, 1]], showLine: true },
      hint: 'Compute R(30°), then multiply it by itself to get R(30°)². Then multiply that by R(30°) again to get R(30°)³. Compare the result to R(90°) — they should match, because three 30° rotations = one 90° rotation.',
      steps: [
        { label: 'Why does R(θ)ⁿ = R(nθ)?', content: 'Rotations have a beautiful property: **composing (multiplying) rotations adds their angles**. Rotating by 30° three times is the same as rotating by 90° once. This is because R(θ₁) × R(θ₂) = R(θ₁ + θ₂) — a fundamental property of rotation matrices.' },
        { label: 'Step 1: Build R(30°)', content: '| Value | Result |\n|-------|--------|\n| cos 30° | √3/2 ≈ **0.866** |\n| sin 30° | 1/2 = **0.5** |\n\nR(30°) = [[0.866, −0.5], [0.5, 0.866]]' },
        { label: 'Step 2: Compute R(30°)² = R(60°)', content: 'Multiply R(30°) × R(30°). If the property holds, we should get cos 60° = 0.5 and sin 60° ≈ 0.866:\n\nR(30°)² ≈ [[0.5, −0.866], [0.866, 0.5]] = R(60°) ✓' },
        { label: 'Step 3: Compute R(30°)³ = R(90°)', content: 'Multiply R(30°)² × R(30°). We should get cos 90° = 0 and sin 90° = 1:\n\nR(30°)³ ≈ [[0, −1], [1, 0]]\n\nCompare to R(90°) = [[cos 90°, −sin 90°], [sin 90°, cos 90°]] = [[0, −1], [1, 0]] ✓\n\n**Three 30° rotations = one 90° rotation**, confirmed numerically.' },
      ],
      answer: 'R(30°)³ ≈ [[0, −1], [1, 0]] = R(90°)',
      code: 'import math\n\ntheta = math.radians(30)\n\n# Your code here\n',
      codeSolution: 'import math\n\ndef mat_mul(A, B):\n    return [[sum(A[i][k]*B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\n\ndef rot(deg):\n    t = math.radians(deg)\n    return [[math.cos(t), -math.sin(t)], [math.sin(t), math.cos(t)]]\n\nR30 = rot(30)\nR30_sq = mat_mul(R30, R30)\nR30_cu = mat_mul(R30_sq, R30)\nR90 = rot(90)\n\nprint("R(30)^3:")\nfor row in R30_cu: print([round(x, 4) for x in row])\nprint("\\nR(90):")\nfor row in R90: print([round(x, 4) for x in row])\n\nclose = all(abs(R30_cu[i][j] - R90[i][j]) < 1e-10 for i in range(2) for j in range(2))\nprint(f"\\nR(30)^3 == R(90): {close}")',
    },
    {
      id: 'mat-44', difficulty: 2,
      question: 'Find the **eigenvalues** of A = [[5, 0], [0, 3]]. (Hint: diagonal matrices make this easy.)',
      hint: 'For a diagonal matrix, the eigenvalues are simply the entries on the diagonal. You can verify this using the characteristic equation det(A − λI) = 0.',
      steps: [
        { label: 'What are eigenvalues?', content: 'An **eigenvalue** λ of a matrix A is a number such that Av = λv for some nonzero vector v. In other words, the matrix just scales that special vector (called an eigenvector) without changing its direction. To find eigenvalues, solve **det(A − λI) = 0**.' },
        { label: 'Step 1: Set up the characteristic equation', content: 'A − λI = [[5−λ, 0], [0, 3−λ]]\n\ndet(A − λI) = (5−λ)(3−λ) − 0×0 = (5−λ)(3−λ) = 0' },
        { label: 'Step 2: Solve', content: '(5−λ)(3−λ) = 0\n\nThis gives λ₁ = **5** and λ₂ = **3**' },
        { label: 'Key insight for diagonal matrices', content: 'For any **diagonal matrix**, the eigenvalues are simply the diagonal entries. Why? A diagonal matrix scales each axis independently — the x-axis is scaled by the (1,1) entry and the y-axis by the (2,2) entry. The standard basis vectors e₁ = (1,0) and e₂ = (0,1) are the eigenvectors.' },
      ],
      answer: 'λ₁ = 5, λ₂ = 3',
      code: 'A = [[5, 0], [0, 3]]\n\n# Your code here\n',
      codeSolution: 'import math\n\nA = [[5, 0], [0, 3]]\n\n# For 2x2: lambda^2 - trace*lambda + det = 0\ntrace = A[0][0] + A[1][1]\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\ndisc = trace**2 - 4*det\n\nlam1 = (trace + math.sqrt(disc)) / 2\nlam2 = (trace - math.sqrt(disc)) / 2\nprint(f"Eigenvalues: lambda_1 = {lam1}, lambda_2 = {lam2}")',
    },

    // ── Hard ──────────────────────────────────────────────────

    {
      id: 'mat-45', difficulty: 3,
      question: 'Find the **eigenvalues and eigenvectors** of A = [[4, 1], [2, 3]].',
      hint: 'First find eigenvalues from det(A − λI) = 0, which gives a quadratic. Then for each eigenvalue, substitute back into (A − λI)v = 0 and solve for the eigenvector v.',
      steps: [
        { label: 'The full eigenvalue/eigenvector process', content: 'Two phases:\n1. **Find eigenvalues**: solve det(A − λI) = 0 (a quadratic for 2×2 matrices)\n2. **Find eigenvectors**: for each λ, solve (A − λI)v = 0 to find which vectors only get scaled by that λ' },
        { label: 'Step 1: Build the characteristic equation', content: 'A − λI = [[4−λ, 1], [2, 3−λ]]\n\ndet(A − λI) = (4−λ)(3−λ) − 1×2 = 12 − 7λ + λ² − 2 = **λ² − 7λ + 10 = 0**' },
        { label: 'Step 2: Solve the quadratic', content: 'Using the quadratic formula (or factoring):\n\nλ = (7 ± √(49 − 40)) / 2 = (7 ± √9) / 2 = (7 ± 3) / 2\n\n| Root | Calculation | Eigenvalue |\n|------|-----------|------------|\n| λ₁ | (7 + 3) / 2 | **5** |\n| λ₂ | (7 − 3) / 2 | **2** |' },
        { label: 'Step 3: Eigenvector for λ₁ = 5', content: 'Substitute λ = 5 into (A − λI)v = 0:\n\nA − 5I = [[−1, 1], [2, −2]]\n\nFrom row 1: −v₁ + v₂ = 0 → v₂ = v₁\n\nChoosing v₁ = 1: eigenvector v₁ = **(1, 1)**\n\nVerify: A(1,1) = (4+1, 2+3) = (5, 5) = 5×(1, 1) ✓' },
        { label: 'Step 4: Eigenvector for λ₂ = 2', content: 'Substitute λ = 2 into (A − λI)v = 0:\n\nA − 2I = [[2, 1], [2, 1]]\n\nFrom row 1: 2v₁ + v₂ = 0 → v₂ = −2v₁\n\nChoosing v₁ = 1: eigenvector v₂ = **(1, −2)**\n\nVerify: A(1,−2) = (4−2, 2−6) = (2, −4) = 2×(1, −2) ✓' },
      ],
      answer: 'λ₁=5 with eigenvector (1,1); λ₂=2 with eigenvector (1,−2)',
      code: 'import math\n\nA = [[4, 1], [2, 3]]\n\n# Your code here\n',
      codeSolution: 'import math\n\nA = [[4, 1], [2, 3]]\n\n# Characteristic equation: lambda^2 - trace*lambda + det = 0\ntrace = A[0][0] + A[1][1]\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\ndisc = trace**2 - 4*det\n\nlam1 = (trace + math.sqrt(disc)) / 2\nlam2 = (trace - math.sqrt(disc)) / 2\nprint(f"Eigenvalues: {lam1}, {lam2}")\n\n# Eigenvectors: solve (A - lambda*I)v = 0\nfor lam in [lam1, lam2]:\n    # First row of (A - lam*I): [A[0][0]-lam, A[0][1]]\n    a = A[0][0] - lam\n    b = A[0][1]\n    if abs(b) > 1e-10:\n        v = (1, -a/b)\n    elif abs(a) > 1e-10:\n        v = (0, 1)\n    else:\n        v = (1, 0)\n    print(f"lambda={lam}: eigenvector = {v}")',
    },
    {
      id: 'mat-46', difficulty: 3,
      question: 'A population model uses the **Leslie matrix** L = [[0, 4], [0.5, 0]] where the top row gives birth rates and the sub-diagonal gives survival rates. Starting with population vector **p₀** = [100, 50] (100 young, 50 adults), compute **p₁ = Lp₀** and **p₂ = Lp₁**. Find the eigenvalues of L to predict long-term growth.',
      hint: 'Multiply L × p₀ to get p₁ (next generation). Each adult produces 4 young (top row), and 50% of young survive to adulthood (sub-diagonal). Then multiply L × p₁ for p₂. For long-term growth, the dominant eigenvalue tells you the per-generation growth factor.',
      steps: [
        { label: 'What is a Leslie matrix?', content: 'A **Leslie matrix** models population dynamics by age group. The top row contains **birth rates** (how many offspring each age group produces), and the sub-diagonal contains **survival rates** (fraction that survives to the next age group). Multiplying by the population vector advances one generation.' },
        { label: 'Step 1: Compute p₁ = Lp₀ (generation 1)', content: '| Row of L | p₀ | Meaning | Calculation | Result |\n|----------|-----|---------|------------|--------|\n| [0, 4] | [100, 50] | New young = 0×young + 4×adults | 0×100 + 4×50 | **200** |\n| [0.5, 0] | [100, 50] | New adults = 0.5×young + 0×adults | 0.5×100 + 0×50 | **50** |\n\np₁ = **[200, 50]** — 200 young (each adult had 4 offspring), 50 adults (half the young survived)' },
        { label: 'Step 2: Compute p₂ = Lp₁ (generation 2)', content: '| Row of L | p₁ | Calculation | Result |\n|----------|-----|------------|--------|\n| [0, 4] | [200, 50] | 0×200 + 4×50 | **200** |\n| [0.5, 0] | [200, 50] | 0.5×200 + 0×50 | **100** |\n\np₂ = **[200, 100]** — young stayed at 200, adults doubled to 100' },
        { label: 'Step 3: Find eigenvalues for long-term prediction', content: 'det(L − λI) = (0−λ)(0−λ) − 4×0.5 = λ² − 2 = 0\n\nλ = ±√2 ≈ ±1.414' },
        { label: 'Step 4: Interpret the dominant eigenvalue', content: 'The **dominant eigenvalue** (largest in absolute value) is √2 ≈ 1.414.\n\nSince |λ| > 1, the population **grows** — specifically by about 41.4% per generation in the long run. The negative eigenvalue (−√2) creates oscillations that decay relative to the growth.' },
      ],
      answer: 'p₁=[200,50], p₂=[200,100]; eigenvalues ±√2 ≈ ±1.414 — population growing',
      code: 'import math\n\nL = [[0, 4], [0.5, 0]]\np0 = [100, 50]\n\n# Your code here\n',
      codeSolution: 'import math\n\nL = [[0, 4], [0.5, 0]]\np0 = [100, 50]\n\ndef mat_vec(M, v):\n    return [sum(M[i][j]*v[j] for j in range(len(v))) for i in range(len(M))]\n\np1 = mat_vec(L, p0)\np2 = mat_vec(L, p1)\nprint(f"p1 = {p1}")\nprint(f"p2 = {p2}")\n\n# Eigenvalues\ntrace = L[0][0] + L[1][1]\ndet = L[0][0]*L[1][1] - L[0][1]*L[1][0]\ndisc = trace**2 - 4*det\nlam1 = (trace + math.sqrt(abs(disc))) / 2\nlam2 = (trace - math.sqrt(abs(disc))) / 2\nprint(f"\\nEigenvalues: {lam1:.4f}, {lam2:.4f}")\nprint(f"Dominant eigenvalue > 1 => population grows")',
    },
    {
      id: 'mat-47', difficulty: 3,
      question: 'A **Markov chain** has transition matrix P = [[0.7, 0.3], [0.4, 0.6]]. Starting with state vector **s₀** = [1, 0] (100% in state 1), compute **s₁**, **s₂**, and **s₃**. Then find the **steady-state vector** by solving **πP = π** with π₁ + π₂ = 1.',
      hint: 'Each step: s_new = s × P (row vector times matrix). The steady state is the vector that doesn\'t change when multiplied by P. Set up πP = π as equations and use π₁ + π₂ = 1 to solve.',
      steps: [
        { label: 'What is a Markov chain?', content: 'A **Markov chain** models a system that moves between states with fixed probabilities. The transition matrix P has rows that sum to 1 — entry P[i][j] is the probability of going from state i to state j. The state vector tracks the probability of being in each state.' },
        { label: 'Step 1: Compute s₁ = s₀ × P', content: 'Multiply the row vector by the matrix:\n\n| Component | Formula | Calculation | Result |\n|-----------|---------|------------|--------|\n| s₁[1] | s₀[1]×P₁₁ + s₀[2]×P₂₁ | 1×0.7 + 0×0.4 | **0.7** |\n| s₁[2] | s₀[1]×P₁₂ + s₀[2]×P₂₂ | 1×0.3 + 0×0.6 | **0.3** |\n\ns₁ = **[0.7, 0.3]**' },
        { label: 'Step 2: Compute s₂ = s₁ × P', content: '| Component | Calculation | Result |\n|-----------|------------|--------|\n| s₂[1] | 0.7×0.7 + 0.3×0.4 = 0.49 + 0.12 | **0.61** |\n| s₂[2] | 0.7×0.3 + 0.3×0.6 = 0.21 + 0.18 | **0.39** |\n\ns₂ = **[0.61, 0.39]**' },
        { label: 'Step 3: Compute s₃ = s₂ × P', content: '| Component | Calculation | Result |\n|-----------|------------|--------|\n| s₃[1] | 0.61×0.7 + 0.39×0.4 = 0.427 + 0.156 | **0.583** |\n| s₃[2] | 0.61×0.3 + 0.39×0.6 = 0.183 + 0.234 | **0.417** |\n\ns₃ = **[0.583, 0.417]** — notice the values are converging toward something.' },
        { label: 'Step 4: Find the steady-state vector π', content: 'At steady state, πP = π (the distribution doesn\'t change). This gives:\n\nπ₁ = 0.7π₁ + 0.4π₂\n\nRearranging: 0.3π₁ = 0.4π₂ → π₁/π₂ = 4/3\n\nWith the constraint π₁ + π₂ = 1:\n\nπ₁ = **4/7 ≈ 0.571**, π₂ = **3/7 ≈ 0.429**\n\nThe state vectors s₁, s₂, s₃ are indeed converging toward [4/7, 3/7].' },
      ],
      answer: 's₁=[0.7,0.3], s₂=[0.61,0.39], s₃=[0.583,0.417]; steady state = [4/7, 3/7]',
      code: 'P = [[0.7, 0.3], [0.4, 0.6]]\ns0 = [1, 0]\n\n# Your code here\n',
      codeSolution: 'P = [[0.7, 0.3], [0.4, 0.6]]\ns = [1.0, 0.0]\n\nfor step in range(1, 4):\n    s_new = [\n        s[0]*P[0][0] + s[1]*P[1][0],\n        s[0]*P[0][1] + s[1]*P[1][1]\n    ]\n    s = s_new\n    print(f"s{step} = [{s[0]:.4f}, {s[1]:.4f}]")\n\n# Steady state: pi_1 / pi_2 = P[1][0] / P[0][1]\npi1 = P[1][0] / (P[0][1] + P[1][0])\npi2 = P[0][1] / (P[0][1] + P[1][0])\nprint(f"\\nSteady state: [{pi1:.4f}, {pi2:.4f}]")\nprint(f"As fractions: [4/7, 3/7]")',
    },
    {
      id: 'mat-48', difficulty: 3,
      question: 'A 2×2 matrix A = [[3, 1], [0, 2]] is **upper triangular**. Find its eigenvalues, then **diagonalize** it: find P and D such that A = PDP⁻¹. Verify by computing PDP⁻¹.',
      hint: 'For a triangular matrix, eigenvalues are the diagonal entries. Then find eigenvectors for each eigenvalue, form matrix P from the eigenvectors as columns, and D from eigenvalues on the diagonal. Verify PDP⁻¹ = A.',
      steps: [
        { label: 'What is diagonalization?', content: 'Diagonalization rewrites A as **PDP⁻¹** where D is diagonal (eigenvalues on the diagonal) and P\'s columns are the eigenvectors. This is powerful because D is trivial to work with — powers, exponentials, etc. become easy. Not all matrices can be diagonalized, but this one can.' },
        { label: 'Step 1: Find eigenvalues (easy for triangular matrices)', content: 'For any **triangular matrix** (upper or lower), the eigenvalues are the diagonal entries.\n\n| Diagonal entry | Eigenvalue |\n|---------------|------------|\n| A₁₁ = 3 | λ₁ = **3** |\n| A₂₂ = 2 | λ₂ = **2** |' },
        { label: 'Step 2: Eigenvector for λ₁ = 3', content: '(A − 3I)v = [[0, 1], [0, −1]]v = 0\n\nFrom row 1: v₂ = 0. Choose v₁ = 1.\n\nEigenvector v₁ = **(1, 0)**' },
        { label: 'Step 3: Eigenvector for λ₂ = 2', content: '(A − 2I)v = [[1, 1], [0, 0]]v = 0\n\nFrom row 1: v₁ + v₂ = 0 → v₂ = −v₁. Choose v₁ = −1, v₂ = 1 (or equivalently v₁ = 1, v₂ = −1).\n\nEigenvector v₂ = **(−1, 1)**' },
        { label: 'Step 4: Form P (eigenvectors as columns) and D', content: 'P = [[1, −1], [0, 1]] (columns are eigenvectors)\nD = [[3, 0], [0, 2]] (eigenvalues on diagonal)' },
        { label: 'Step 5: Verify PDP⁻¹ = A', content: 'First find P⁻¹ (using 2×2 formula, det(P) = 1):\n\nP⁻¹ = [[1, 1], [0, 1]]\n\nThen multiply:\n\n| Step | Result |\n|------|--------|\n| PD | [[3, −2], [0, 2]] |\n| PDP⁻¹ | [[3, 1], [0, 2]] |\n\nPDP⁻¹ = [[3, 1], [0, 2]] = A ✓' },
      ],
      answer: 'λ₁=3, λ₂=2; P=[[1,−1],[0,1]], D=[[3,0],[0,2]]',
      code: 'import math\n\nA = [[3, 1], [0, 2]]\n\n# Your code here\n',
      codeSolution: 'import math\n\nA = [[3, 1], [0, 2]]\n\n# Eigenvalues\ntrace = A[0][0] + A[1][1]\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\ndisc = trace**2 - 4*det\nlam1 = (trace + math.sqrt(disc)) / 2\nlam2 = (trace - math.sqrt(disc)) / 2\nprint(f"Eigenvalues: {lam1}, {lam2}")\n\n# P = eigenvectors as columns\nP = [[1, -1], [0, 1]]\nD = [[lam1, 0], [0, lam2]]\n\n# P inverse (2x2)\ndet_P = P[0][0]*P[1][1] - P[0][1]*P[1][0]\nP_inv = [[P[1][1]/det_P, -P[0][1]/det_P],\n         [-P[1][0]/det_P, P[0][0]/det_P]]\n\n# Verify PDP^-1\ndef mat_mul(A, B):\n    return [[sum(A[i][k]*B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\n\nresult = mat_mul(mat_mul(P, D), P_inv)\nprint("\\nPDP^-1 =")\nfor row in result:\n    print([round(x, 4) for x in row])\nprint(f"\\nEquals A: {all(abs(result[i][j]-A[i][j]) < 1e-10 for i in range(2) for j in range(2))}")',
    },
    {
      id: 'mat-49', difficulty: 3,
      question: 'A data matrix has **singular values** σ₁ = 5 and σ₂ = 1 for the matrix M = [[3, 2], [2, 3]]. Verify this by computing **MᵀM**, finding its eigenvalues, and taking square roots. What does the ratio σ₁/σ₂ tell you about the data?',
      hint: 'Singular values of M are the square roots of the eigenvalues of MᵀM. Compute MᵀM first, then use the 2×2 eigenvalue formula (trace and determinant), then take square roots. The ratio of largest to smallest singular value is the condition number.',
      steps: [
        { label: 'What are singular values?', content: 'Every matrix M has **singular values** — they measure how much M stretches space in each direction. They are found by:\n\n1. Compute MᵀM (a symmetric matrix)\n2. Find eigenvalues of MᵀM\n3. Take square roots\n\nThe ratio σ_max / σ_min is the **condition number** — it measures how "stretched" or "lopsided" the transformation is.' },
        { label: 'Step 1: Compute MᵀM', content: 'Since M is symmetric (M = Mᵀ), we have MᵀM = M²:\n\n| Entry | Row of Mᵀ | Col of M | Dot product | Result |\n|-------|----------|----------|------------|--------|\n| (1,1) | [3, 2] | [3, 2] | 9+4 | **13** |\n| (1,2) | [3, 2] | [2, 3] | 6+6 | **12** |\n| (2,1) | [2, 3] | [3, 2] | 6+6 | **12** |\n| (2,2) | [2, 3] | [2, 3] | 4+9 | **13** |\n\nMᵀM = [[13, 12], [12, 13]]' },
        { label: 'Step 2: Find eigenvalues of MᵀM', content: 'trace = 13 + 13 = **26**\ndet = 13×13 − 12×12 = 169 − 144 = **25**\n\nCharacteristic equation: λ² − 26λ + 25 = 0\n\nλ = (26 ± √(676 − 100)) / 2 = (26 ± √576) / 2 = (26 ± 24) / 2\n\n| Root | Calculation | λ |\n|------|-----------|---|\n| λ₁ | (26 + 24) / 2 | **25** |\n| λ₂ | (26 − 24) / 2 | **1** |' },
        { label: 'Step 3: Take square roots to get singular values', content: '| Eigenvalue of MᵀM | Square root = Singular value |\n|-------------------|-----------------------------|\n| 25 | σ₁ = **5** |\n| 1 | σ₂ = **1** |' },
        { label: 'Step 4: Interpret the condition number', content: 'Condition number = σ₁/σ₂ = 5/1 = **5**\n\nThis means the matrix stretches space **5× more** in one direction than the other. For data, this indicates moderate directional bias — the data is elongated along one axis. A condition number near 1 means uniform scaling; very large values indicate near-singularity.' },
      ],
      answer: 'σ₁=5, σ₂=1, condition number=5 — data has moderate directional bias',
      code: 'import math\n\nM = [[3, 2], [2, 3]]\n\n# Your code here\n',
      codeSolution: 'import math\n\nM = [[3, 2], [2, 3]]\n\n# Transpose (symmetric so Mt = M)\nMt = [[M[j][i] for j in range(2)] for i in range(2)]\n\n# MtM\nMtM = [[sum(Mt[i][k]*M[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\nprint("M^T M =")\nfor row in MtM: print(row)\n\n# Eigenvalues of MtM\ntrace = MtM[0][0] + MtM[1][1]\ndet = MtM[0][0]*MtM[1][1] - MtM[0][1]*MtM[1][0]\ndisc = trace**2 - 4*det\nlam1 = (trace + math.sqrt(disc)) / 2\nlam2 = (trace - math.sqrt(disc)) / 2\n\nsigma1 = math.sqrt(lam1)\nsigma2 = math.sqrt(lam2)\nprint(f"\\nSingular values: sigma1={sigma1:.4f}, sigma2={sigma2:.4f}")\nprint(f"Condition number: {sigma1/sigma2:.4f}")',
    },
    {
      id: 'mat-50', difficulty: 3,
      question: 'Solve the system **Ax = b** using Cramer\'s rule, where A = [[1, 3, −2], [3, 5, 6], [2, 4, 3]] and b = [5, 7, 8]. The system represents a pricing model: x, y, z are unknown unit prices.',
      hint: '**Cramer\'s rule** says: to find each unknown, replace the corresponding column in A with the answer vector **b**, compute the determinant of that new matrix, and divide by det(A).\n\nSo x = det(A₁)/det(A), where A₁ is A with column 1 replaced by b.',
      steps: [
        { label: 'What is Cramer\'s rule?', content: 'For a system **Ax = b** with 3 unknowns:\n\n• x = det(A₁) / det(A) — replace **column 1** of A with b\n• y = det(A₂) / det(A) — replace **column 2** of A with b\n• z = det(A₃) / det(A) — replace **column 3** of A with b\n\nThis only works when det(A) ≠ 0 (the system has a unique solution).' },
        { label: 'Step 1: Find det(A) using cofactor expansion', content: 'Expand along the first row. For each entry, cross out its row and column to get a 2×2 minor:\n\n| Entry | Value | Minor (cross out row 1 + that column) | Minor det | Sign | Contribution |\n|-------|-------|---------------------------------------|-----------|------|-------------|\n| a₁₁ | 1 | [[5, 6], [4, 3]] | 5×3 − 6×4 = −9 | + | 1 × (−9) = **−9** |\n| a₁₂ | 3 | [[3, 6], [2, 3]] | 3×3 − 6×2 = −3 | − | −3 × (−3) = **+9** |\n| a₁₃ | −2 | [[3, 5], [2, 4]] | 3×4 − 5×2 = 2 | + | (−2) × 2 = **−4** |\n\ndet(A) = −9 + 9 − 4 = **−4**\n\nSince det(A) ≠ 0, the system has a unique solution.' },
        { label: 'Step 2: det(A₁) — replace column 1 with b', content: 'A₁ = [[**5**, 3, −2], [**7**, 5, 6], [**8**, 4, 3]] (bold entries are from b)\n\n| Entry | Value | Minor det | Sign | Contribution |\n|-------|-------|-----------|------|-------------|\n| 5 | 5 | 5×3 − 6×4 = −9 | + | **−45** |\n| 3 | 3 | 7×3 − 6×8 = −27 | − | **+81** |\n| −2 | −2 | 7×4 − 5×8 = −12 | + | **+24** |\n\ndet(A₁) = −45 + 81 + 24 = **60**' },
        { label: 'Step 3: det(A₂) and det(A₃)', content: 'Same process — replace column 2 or 3 with b:\n\n| Matrix | Column replaced | Determinant |\n|--------|----------------|------------|\n| A₂ = [[1, **5**, −2], [3, **7**, 6], [2, **8**, 3]] | Column 2 → b | **−32** |\n| A₃ = [[1, 3, **5**], [3, 5, **7**], [2, 4, **8**]] | Column 3 → b | **−8** |' },
        { label: 'Step 4: Divide each by det(A)', content: '| Unknown | Formula | Calculation | Result |\n|---------|---------|------------|--------|\n| x | det(A₁) / det(A) | 60 / (−4) | **−15** |\n| y | det(A₂) / det(A) | −32 / (−4) | **8** |\n| z | det(A₃) / det(A) | −8 / (−4) | **2** |\n\n**Check:** Does x = −15 make sense as a "price"? No — a negative price means the model data is inconsistent for a pricing interpretation.' },
      ],
      answer: 'x = −15, y = 8, z = 2',
      code: 'A = [[1, 3, -2], [3, 5, 6], [2, 4, 3]]\nb = [5, 7, 8]\n\n# Your code here\n',
      codeSolution: 'def det3(M):\n    return (M[0][0]*(M[1][1]*M[2][2] - M[1][2]*M[2][1])\n          - M[0][1]*(M[1][0]*M[2][2] - M[1][2]*M[2][0])\n          + M[0][2]*(M[1][0]*M[2][1] - M[1][1]*M[2][0]))\n\nA = [[1, 3, -2], [3, 5, 6], [2, 4, 3]]\nb = [5, 7, 8]\n\ndet_A = det3(A)\nprint(f"det(A) = {det_A}")\n\nsolutions = []\nfor col in range(3):\n    A_mod = [row[:] for row in A]\n    for row in range(3):\n        A_mod[row][col] = b[row]\n    det_mod = det3(A_mod)\n    val = det_mod / det_A\n    solutions.append(val)\n    print(f"det(A{col+1}) = {det_mod}, x{col+1} = {val}")\n\nprint(f"\\nSolution: x={solutions[0]}, y={solutions[1]}, z={solutions[2]}")\n\n# Verify\nfor i in range(3):\n    check = sum(A[i][j]*solutions[j] for j in range(3))\n    print(f"Row {i+1} check: {check} = {b[i]} -> {abs(check - b[i]) < 1e-10}")',
    },
  ],
};
