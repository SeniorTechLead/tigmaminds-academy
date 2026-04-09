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
      steps: [
        { label: 'Step 1: Identify components', content: 'The vector is **v** = (3, 4), so v₁ = 3 and v₂ = 4.' },
        { label: 'Step 2: Apply the formula', content: '|**v**| = √(v₁² + v₂²) = √(9 + 16) = √25' },
        { label: 'Step 3: Simplify', content: '|**v**| = **5**' },
      ],
      answer: '5',
      code: 'import math\n\nv = (3, 4)\n\n# Your code here\n',
      codeSolution: 'import math\n\nv = (3, 4)\nmagnitude = math.sqrt(v[0]**2 + v[1]**2)\nprint(f"Magnitude = {magnitude}")',
    },
    {
      id: 'mat-02', difficulty: 1,
      question: 'A bird is at position **(2, 5)** and flies to **(7, 1)**. Find the **displacement vector** from start to end.',
      visual: { kind: 'scatter', points: [[2, 5], [7, 1]], showLine: true },
      steps: [
        { label: 'Step 1: Subtract coordinates', content: 'Displacement = end − start = (7 − 2, 1 − 5)' },
        { label: 'Step 2: Compute', content: 'Displacement = **(5, −4)**' },
      ],
      answer: '(5, −4)',
      code: 'start = (2, 5)\nend = (7, 1)\n\n# Your code here\n',
      codeSolution: 'start = (2, 5)\nend = (7, 1)\ndisplacement = (end[0] - start[0], end[1] - start[1])\nprint(f"Displacement = {displacement}")',
    },
    {
      id: 'mat-03', difficulty: 1,
      question: 'Add the vectors **a** = (1, 3) and **b** = (4, 2). What is **a + b**?',
      visual: { kind: 'scatter', points: [[1, 3], [4, 2], [5, 5]], showLine: true },
      steps: [
        { label: 'Step 1: Add component-wise', content: '(1 + 4, 3 + 2)' },
        { label: 'Step 2: Compute', content: '**a + b** = **(5, 5)**' },
      ],
      answer: '(5, 5)',
      code: 'a = (1, 3)\nb = (4, 2)\n\n# Your code here\n',
      codeSolution: 'a = (1, 3)\nb = (4, 2)\nresult = (a[0] + b[0], a[1] + b[1])\nprint(f"a + b = {result}")',
    },
    {
      id: 'mat-04', difficulty: 1,
      question: 'Subtract vector **b** = (3, 7) from **a** = (8, 2). What is **a − b**?',
      visual: { kind: 'scatter', points: [[8, 2], [3, 7], [5, -5]], showLine: true },
      steps: [
        { label: 'Step 1: Subtract component-wise', content: '(8 − 3, 2 − 7)' },
        { label: 'Step 2: Compute', content: '**a − b** = **(5, −5)**' },
      ],
      answer: '(5, −5)',
      code: 'a = (8, 2)\nb = (3, 7)\n\n# Your code here\n',
      codeSolution: 'a = (8, 2)\nb = (3, 7)\nresult = (a[0] - b[0], a[1] - b[1])\nprint(f"a - b = {result}")',
    },
    {
      id: 'mat-05', difficulty: 1,
      question: 'A force vector is **F** = (2, −3). If we triple the force, what is **3F**?',
      visual: { kind: 'scatter', points: [[2, -3], [6, -9]], showLine: true },
      steps: [
        { label: 'Step 1: Multiply each component by 3', content: '3 × (2, −3) = (3×2, 3×(−3))' },
        { label: 'Step 2: Compute', content: '**3F** = **(6, −9)**' },
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
      steps: [
        { label: 'Step 1: Magnitude', content: '|**v**| = √(3² + 5²) = √(9 + 25) = √34 ≈ **5.83 m/s**' },
        { label: 'Step 2: Direction (angle from east/x-axis)', content: 'θ = arctan(5/3) ≈ arctan(1.667) ≈ **59.04°** from east' },
      ],
      answer: '≈ 5.83 m/s at 59.04° from east',
      code: 'import math\n\nv = (3, 5)\n\n# Your code here\n',
      codeSolution: 'import math\n\nv = (3, 5)\nmagnitude = math.sqrt(v[0]**2 + v[1]**2)\nangle_rad = math.atan2(v[1], v[0])\nangle_deg = math.degrees(angle_rad)\nprint(f"Magnitude = {magnitude:.2f} m/s")\nprint(f"Direction = {angle_deg:.2f} degrees from east")',
    },
    {
      id: 'mat-07', difficulty: 2,
      question: 'Find the **unit vector** in the direction of **v** = (5, 12).',
      visual: { kind: 'scatter', points: [[0, 0], [5, 12]], showLine: true },
      steps: [
        { label: 'Step 1: Find the magnitude', content: '|**v**| = √(25 + 144) = √169 = **13**' },
        { label: 'Step 2: Divide each component by the magnitude', content: 'u = (5/13, 12/13) ≈ **(0.385, 0.923)**' },
        { label: 'Step 3: Verify', content: '|u| = √(0.385² + 0.923²) ≈ √(0.148 + 0.852) = √1 = 1 ✓' },
      ],
      answer: '(5/13, 12/13) ≈ (0.385, 0.923)',
      code: 'import math\n\nv = (5, 12)\n\n# Your code here\n',
      codeSolution: 'import math\n\nv = (5, 12)\nmag = math.sqrt(v[0]**2 + v[1]**2)\nunit = (v[0] / mag, v[1] / mag)\nprint(f"Unit vector = ({unit[0]:.4f}, {unit[1]:.4f})")\nprint(f"Verification |u| = {math.sqrt(unit[0]**2 + unit[1]**2):.4f}")',
    },
    {
      id: 'mat-08', difficulty: 2,
      question: 'Two ropes pull a box: **F₁** = (4, 3) N and **F₂** = (−2, 5) N. Find the **resultant force** vector and its magnitude.',
      visual: { kind: 'scatter', points: [[4, 3], [-2, 5], [2, 8]], showLine: true },
      steps: [
        { label: 'Step 1: Add the vectors', content: '**F** = F₁ + F₂ = (4 + (−2), 3 + 5) = **(2, 8)**' },
        { label: 'Step 2: Find magnitude', content: '|**F**| = √(4 + 64) = √68 = 2√17 ≈ **8.25 N**' },
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
      steps: [
        { label: 'Step 1: Magnitude in 3D', content: '|**F**| = √(2² + (−1)² + 3²) = √(4 + 1 + 9) = √14 ≈ **3.742**' },
        { label: 'Step 2: Direction cosines', content: 'cos α = 2/√14 ≈ 0.535, cos β = −1/√14 ≈ −0.267, cos γ = 3/√14 ≈ 0.802' },
        { label: 'Step 3: Verify', content: 'cos²α + cos²β + cos²γ = 4/14 + 1/14 + 9/14 = 14/14 = 1 ✓' },
      ],
      answer: '|F| = √14 ≈ 3.742; direction cosines ≈ (0.535, −0.267, 0.802)',
      code: 'import math\n\nF = (2, -1, 3)\n\n# Your code here\n',
      codeSolution: 'import math\n\nF = (2, -1, 3)\nmag = math.sqrt(sum(c**2 for c in F))\ncos_alpha = F[0] / mag\ncos_beta = F[1] / mag\ncos_gamma = F[2] / mag\nprint(f"|F| = {mag:.4f}")\nprint(f"Direction cosines: ({cos_alpha:.4f}, {cos_beta:.4f}, {cos_gamma:.4f})")\nprint(f"Verification: {cos_alpha**2 + cos_beta**2 + cos_gamma**2:.4f}")',
    },
    {
      id: 'mat-10', difficulty: 3,
      question: 'A plane flies at velocity **v₁** = (200, 100) km/h. A wind blows at **v₂** = (−50, 30) km/h. Find the ground velocity, its magnitude, and the **angle correction** needed (difference in direction between intended and actual).',
      visual: { kind: 'scatter', points: [[200, 100], [-50, 30], [150, 130]], showLine: true },
      steps: [
        { label: 'Step 1: Ground velocity', content: '**v** = v₁ + v₂ = (200 − 50, 100 + 30) = **(150, 130)**' },
        { label: 'Step 2: Ground speed', content: '|**v**| = √(22500 + 16900) = √39400 ≈ **198.49 km/h**' },
        { label: 'Step 3: Intended direction', content: 'θ₁ = arctan(100/200) = arctan(0.5) ≈ 26.57°' },
        { label: 'Step 4: Actual direction', content: 'θ₂ = arctan(130/150) ≈ arctan(0.867) ≈ 40.91°' },
        { label: 'Step 5: Angle correction', content: 'Δθ = 40.91° − 26.57° ≈ **14.34°**' },
      ],
      answer: 'Ground velocity = (150, 130), speed ≈ 198.49 km/h, correction ≈ 14.34°',
      code: 'import math\n\nv1 = (200, 100)\nv2 = (-50, 30)\n\n# Your code here\n',
      codeSolution: 'import math\n\nv1 = (200, 100)\nv2 = (-50, 30)\nground = (v1[0] + v2[0], v1[1] + v2[1])\nspeed = math.sqrt(ground[0]**2 + ground[1]**2)\ntheta1 = math.degrees(math.atan2(v1[1], v1[0]))\ntheta2 = math.degrees(math.atan2(ground[1], ground[0]))\ncorrection = abs(theta2 - theta1)\nprint(f"Ground velocity = {ground}")\nprint(f"Ground speed = {speed:.2f} km/h")\nprint(f"Angle correction = {correction:.2f} degrees")',
    },
    {
      id: 'mat-11', difficulty: 3,
      question: 'Prove by direct computation that **(a + b) · (a − b) = |a|² − |b|²** for **a** = (3, 4) and **b** = (1, 2). Then explain why this identity holds in general.',
      visual: { kind: 'scatter', points: [[3, 4], [1, 2], [4, 6], [2, 2]], showLine: true },
      steps: [
        { label: 'Step 1: Compute a + b and a − b', content: 'a + b = (4, 6), a − b = (2, 2)' },
        { label: 'Step 2: Dot product', content: '(a + b) · (a − b) = 4×2 + 6×2 = 8 + 12 = **20**' },
        { label: 'Step 3: Compute |a|² − |b|²', content: '|a|² = 9 + 16 = 25, |b|² = 1 + 4 = 5, difference = 25 − 5 = **20** ✓' },
        { label: 'Step 4: General proof', content: '(a+b)·(a−b) = a·a − a·b + b·a − b·b = |a|² − |b|² (cross terms cancel because a·b = b·a)' },
      ],
      answer: 'Both sides equal 20, confirming the identity',
      code: 'a = (3, 4)\nb = (1, 2)\n\n# Your code here\n',
      codeSolution: 'a = (3, 4)\nb = (1, 2)\n\na_plus_b = (a[0] + b[0], a[1] + b[1])\na_minus_b = (a[0] - b[0], a[1] - b[1])\n\ndot = a_plus_b[0] * a_minus_b[0] + a_plus_b[1] * a_minus_b[1]\nmag_a_sq = a[0]**2 + a[1]**2\nmag_b_sq = b[0]**2 + b[1]**2\ndiff = mag_a_sq - mag_b_sq\n\nprint(f"(a+b) . (a-b) = {dot}")\nprint(f"|a|^2 - |b|^2 = {diff}")\nprint(f"Identity holds: {dot == diff}")',
    },
    {
      id: 'mat-12', difficulty: 2,
      question: 'A hiker walks **a** = (3, 0) km east, then **b** = (0, 4) km north, then **c** = (−1, 2) km northwest. What is the total displacement and how far is the hiker from the start?',
      visual: { kind: 'scatter', points: [[0, 0], [3, 0], [3, 4], [2, 6]], showLine: true },
      steps: [
        { label: 'Step 1: Sum the vectors', content: 'Total = a + b + c = (3 + 0 + (−1), 0 + 4 + 2) = **(2, 6)**' },
        { label: 'Step 2: Distance from start', content: '|Total| = √(4 + 36) = √40 = 2√10 ≈ **6.32 km**' },
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
      steps: [
        { label: 'Step 1: Multiply corresponding components', content: '2 × 3 = 6 and 5 × (−1) = −5' },
        { label: 'Step 2: Sum', content: '6 + (−5) = **1**' },
      ],
      answer: '1',
      code: 'a = (2, 5)\nb = (3, -1)\n\n# Your code here\n',
      codeSolution: 'a = (2, 5)\nb = (3, -1)\ndot = a[0]*b[0] + a[1]*b[1]\nprint(f"Dot product = {dot}")',
    },
    {
      id: 'mat-14', difficulty: 1,
      question: 'Are vectors **a** = (4, 2) and **b** = (−1, 2) **orthogonal** (perpendicular)? Check using the dot product.',
      visual: { kind: 'scatter', points: [[4, 2], [-1, 2]], showLine: false },
      steps: [
        { label: 'Step 1: Compute the dot product', content: 'a · b = 4×(−1) + 2×2 = −4 + 4 = **0**' },
        { label: 'Step 2: Interpret', content: 'Since a · b = 0, the vectors **are orthogonal** ✓' },
      ],
      answer: 'Yes — dot product = 0, so the vectors are orthogonal',
      code: 'a = (4, 2)\nb = (-1, 2)\n\n# Your code here\n',
      codeSolution: 'a = (4, 2)\nb = (-1, 2)\ndot = a[0]*b[0] + a[1]*b[1]\nprint(f"Dot product = {dot}")\nprint(f"Orthogonal: {dot == 0}")',
    },
    {
      id: 'mat-15', difficulty: 1,
      question: 'Compute the **dot product** of **u** = (1, 0, 3) and **v** = (2, 4, −1) in 3D.',
      visual: { kind: 'scatter', points: [[1, 0], [2, 4]], showLine: false },
      steps: [
        { label: 'Step 1: Multiply component-wise', content: '1×2 = 2, 0×4 = 0, 3×(−1) = −3' },
        { label: 'Step 2: Sum', content: '2 + 0 + (−3) = **−1**' },
      ],
      answer: '−1',
      code: 'u = (1, 0, 3)\nv = (2, 4, -1)\n\n# Your code here\n',
      codeSolution: 'u = (1, 0, 3)\nv = (2, 4, -1)\ndot = sum(a*b for a, b in zip(u, v))\nprint(f"Dot product = {dot}")',
    },
    {
      id: 'mat-16', difficulty: 1,
      question: 'Compute the **2D cross product** (scalar) of **a** = (3, 1) and **b** = (2, 5). What does the sign tell you?',
      visual: { kind: 'scatter', points: [[3, 1], [2, 5]], showLine: false },
      steps: [
        { label: 'Step 1: Apply formula a₁b₂ − a₂b₁', content: '3×5 − 1×2 = 15 − 2 = **13**' },
        { label: 'Step 2: Interpret sign', content: 'Positive → **b** is counter-clockwise from **a**' },
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
      steps: [
        { label: 'Step 1: Dot product', content: 'a · b = 1×3 + 2×1 = 3 + 2 = 5' },
        { label: 'Step 2: Magnitudes', content: '|a| = √(1 + 4) = √5, |b| = √(9 + 1) = √10' },
        { label: 'Step 3: cos θ', content: 'cos θ = 5 / (√5 × √10) = 5 / √50 = 5/(5√2) = 1/√2' },
        { label: 'Step 4: Angle', content: 'θ = arccos(1/√2) = **45°**' },
      ],
      answer: '45°',
      code: 'import math\n\na = (1, 2)\nb = (3, 1)\n\n# Your code here\n',
      codeSolution: 'import math\n\na = (1, 2)\nb = (3, 1)\ndot = a[0]*b[0] + a[1]*b[1]\nmag_a = math.sqrt(a[0]**2 + a[1]**2)\nmag_b = math.sqrt(b[0]**2 + b[1]**2)\ncos_theta = dot / (mag_a * mag_b)\ntheta = math.degrees(math.acos(cos_theta))\nprint(f"Angle = {theta:.2f} degrees")',
    },
    {
      id: 'mat-18', difficulty: 2,
      question: 'Compute the **3D cross product** of **a** = (1, 2, 3) and **b** = (4, 5, 6).',
      visual: { kind: 'bar-chart', labels: ['i', 'j', 'k'], values: [-3, 6, -3] },
      steps: [
        { label: 'Step 1: i component', content: 'a₂b₃ − a₃b₂ = 2×6 − 3×5 = 12 − 15 = **−3**' },
        { label: 'Step 2: j component', content: '−(a₁b₃ − a₃b₁) = −(1×6 − 3×4) = −(6 − 12) = **6**' },
        { label: 'Step 3: k component', content: 'a₁b₂ − a₂b₁ = 1×5 − 2×4 = 5 − 8 = **−3**' },
        { label: 'Result', content: '**a × b** = **(−3, 6, −3)**' },
      ],
      answer: '(−3, 6, −3)',
      code: 'a = (1, 2, 3)\nb = (4, 5, 6)\n\n# Your code here\n',
      codeSolution: 'a = (1, 2, 3)\nb = (4, 5, 6)\ncross = (\n    a[1]*b[2] - a[2]*b[1],\n    a[2]*b[0] - a[0]*b[2],\n    a[0]*b[1] - a[1]*b[0]\n)\nprint(f"a x b = {cross}")',
    },
    {
      id: 'mat-19', difficulty: 2,
      question: 'Find the **area of the parallelogram** formed by **a** = (3, 0, 0) and **b** = (0, 4, 0). Use the cross product.',
      visual: { kind: 'scatter', points: [[3, 0], [0, 4], [3, 4]], showLine: true },
      steps: [
        { label: 'Step 1: Cross product', content: 'a × b = (0×0 − 0×4, 0×0 − 3×0, 3×4 − 0×0) = (0, 0, 12)' },
        { label: 'Step 2: Magnitude of cross product = area', content: '|a × b| = √(0 + 0 + 144) = **12**' },
      ],
      answer: '12 square units',
      code: 'import math\n\na = (3, 0, 0)\nb = (0, 4, 0)\n\n# Your code here\n',
      codeSolution: 'import math\n\na = (3, 0, 0)\nb = (0, 4, 0)\ncross = (\n    a[1]*b[2] - a[2]*b[1],\n    a[2]*b[0] - a[0]*b[2],\n    a[0]*b[1] - a[1]*b[0]\n)\narea = math.sqrt(sum(c**2 for c in cross))\nprint(f"Cross product = {cross}")\nprint(f"Area = {area}")',
    },
    {
      id: 'mat-20', difficulty: 2,
      question: 'Project vector **a** = (4, 3) onto **b** = (1, 0). What is the **scalar projection** and the **vector projection**?',
      visual: { kind: 'scatter', points: [[4, 3], [1, 0], [4, 0]], showLine: true },
      steps: [
        { label: 'Step 1: Scalar projection', content: 'comp_b(a) = (a · b) / |b| = (4×1 + 3×0) / 1 = **4**' },
        { label: 'Step 2: Vector projection', content: 'proj_b(a) = (a · b / |b|²) × b = (4/1) × (1, 0) = **(4, 0)**' },
      ],
      answer: 'Scalar projection = 4, vector projection = (4, 0)',
      code: 'a = (4, 3)\nb = (1, 0)\n\n# Your code here\n',
      codeSolution: 'import math\n\na = (4, 3)\nb = (1, 0)\ndot_ab = a[0]*b[0] + a[1]*b[1]\nmag_b = math.sqrt(b[0]**2 + b[1]**2)\nscalar_proj = dot_ab / mag_b\nscale = dot_ab / (mag_b**2)\nvec_proj = (scale * b[0], scale * b[1])\nprint(f"Scalar projection = {scalar_proj}")\nprint(f"Vector projection = {vec_proj}")',
    },

    // ── Hard ──────────────────────────────────────────────────

    {
      id: 'mat-21', difficulty: 3,
      question: 'Two ML feature vectors are **x** = (1, 3, −2, 4) and **y** = (2, −1, 0, 3). Compute their **cosine similarity**. Are the features pointing in roughly the same direction?',
      visual: { kind: 'bar-chart', labels: ['x₁','x₂','x₃','x₄'], values: [1, 3, -2, 4] },
      steps: [
        { label: 'Step 1: Dot product', content: 'x · y = 1×2 + 3×(−1) + (−2)×0 + 4×3 = 2 − 3 + 0 + 12 = **11**' },
        { label: 'Step 2: Magnitudes', content: '|x| = √(1+9+4+16) = √30 ≈ 5.477, |y| = √(4+1+0+9) = √14 ≈ 3.742' },
        { label: 'Step 3: Cosine similarity', content: 'cos θ = 11 / (5.477 × 3.742) ≈ 11 / 20.494 ≈ **0.537**' },
        { label: 'Step 4: Interpret', content: 'cos θ ≈ 0.537 — moderate positive similarity (angle ≈ 57.5°)' },
      ],
      answer: 'Cosine similarity ≈ 0.537 — moderately similar direction',
      code: 'import math\n\nx = (1, 3, -2, 4)\ny = (2, -1, 0, 3)\n\n# Your code here\n',
      codeSolution: 'import math\n\nx = (1, 3, -2, 4)\ny = (2, -1, 0, 3)\ndot = sum(a*b for a, b in zip(x, y))\nmag_x = math.sqrt(sum(a**2 for a in x))\nmag_y = math.sqrt(sum(a**2 for a in y))\ncos_sim = dot / (mag_x * mag_y)\nangle = math.degrees(math.acos(cos_sim))\nprint(f"Cosine similarity = {cos_sim:.4f}")\nprint(f"Angle = {angle:.1f} degrees")',
    },
    {
      id: 'mat-22', difficulty: 3,
      question: 'Verify the **Cauchy–Schwarz inequality** |**a** · **b**| ≤ |**a**| × |**b**| for **a** = (2, −3, 1) and **b** = (1, 4, −2). Compute both sides.',
      visual: { kind: 'bar-chart', labels: ['|a·b|', '|a|×|b|'], values: [12, 17.15] },
      steps: [
        { label: 'Step 1: Dot product', content: 'a · b = 2×1 + (−3)×4 + 1×(−2) = 2 − 12 − 2 = −12, so |a · b| = **12**' },
        { label: 'Step 2: Magnitudes', content: '|a| = √(4+9+1) = √14 ≈ 3.742, |b| = √(1+16+4) = √21 ≈ 4.583' },
        { label: 'Step 3: Product of magnitudes', content: '|a| × |b| = √14 × √21 = √294 ≈ **17.15**' },
        { label: 'Step 4: Verify', content: '12 ≤ 17.15 ✓ — inequality holds' },
      ],
      answer: '|a · b| = 12 ≤ 17.15 = |a||b| — inequality verified',
      code: 'import math\n\na = (2, -3, 1)\nb = (1, 4, -2)\n\n# Your code here\n',
      codeSolution: 'import math\n\na = (2, -3, 1)\nb = (1, 4, -2)\ndot = sum(x*y for x, y in zip(a, b))\nmag_a = math.sqrt(sum(x**2 for x in a))\nmag_b = math.sqrt(sum(x**2 for x in b))\nprint(f"|a . b| = {abs(dot)}")\nprint(f"|a| x |b| = {mag_a * mag_b:.4f}")\nprint(f"Cauchy-Schwarz holds: {abs(dot) <= mag_a * mag_b}")',
    },
    {
      id: 'mat-23', difficulty: 3,
      question: 'Verify that the **cross product is anti-commutative**: compute **a × b** and **b × a** for **a** = (2, 1, −1) and **b** = (3, −2, 4), and show that **a × b** = −(**b × a**).',
      visual: { kind: 'bar-chart', labels: ['i', 'j', 'k'], values: [2, -11, -7] },
      steps: [
        { label: 'Step 1: a × b', content: 'i: 1×4 − (−1)×(−2) = 4 − 2 = 2\nj: −(2×4 − (−1)×3) = −(8+3) = −11\nk: 2×(−2) − 1×3 = −4 − 3 = −7\n**a × b = (2, −11, −7)**' },
        { label: 'Step 2: b × a', content: 'i: (−2)×(−1) − 4×1 = 2 − 4 = −2\nj: −(3×(−1) − 4×2) = −(−3−8) = 11\nk: 3×1 − (−2)×2 = 3 + 4 = 7\n**b × a = (−2, 11, 7)**' },
        { label: 'Step 3: Verify', content: 'a × b = (2, −11, −7) = −(−2, 11, 7) = −(b × a) ✓' },
      ],
      answer: 'a × b = (2, −11, −7) and b × a = (−2, 11, 7) — confirmed anti-commutative',
      code: 'a = (2, 1, -1)\nb = (3, -2, 4)\n\n# Your code here\n',
      codeSolution: 'a = (2, 1, -1)\nb = (3, -2, 4)\n\ndef cross(u, v):\n    return (\n        u[1]*v[2] - u[2]*v[1],\n        u[2]*v[0] - u[0]*v[2],\n        u[0]*v[1] - u[1]*v[0]\n    )\n\naxb = cross(a, b)\nbxa = cross(b, a)\nneg_bxa = (-bxa[0], -bxa[1], -bxa[2])\nprint(f"a x b = {axb}")\nprint(f"b x a = {bxa}")\nprint(f"a x b == -(b x a): {axb == neg_bxa}")',
    },
    {
      id: 'mat-24', difficulty: 3,
      question: 'Find a vector **orthogonal** to both **a** = (1, 0, 2) and **b** = (0, 1, −1) using the cross product. Then verify it is orthogonal to both by computing the dot products.',
      visual: { kind: 'bar-chart', labels: ['i', 'j', 'k'], values: [-2, 1, 1] },
      steps: [
        { label: 'Step 1: Cross product', content: 'i: 0×(−1) − 2×1 = −2\nj: −(1×(−1) − 2×0) = −(−1) = 1\nk: 1×1 − 0×0 = 1\n**n** = **(−2, 1, 1)**' },
        { label: 'Step 2: Verify n · a = 0', content: '(−2)×1 + 1×0 + 1×2 = −2 + 0 + 2 = **0** ✓' },
        { label: 'Step 3: Verify n · b = 0', content: '(−2)×0 + 1×1 + 1×(−1) = 0 + 1 − 1 = **0** ✓' },
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
      visual: { kind: 'bar-chart', labels: ['a₁₁','a₁₂','a₂₁','a₂₂'], values: [6, 8, 10, 12] },
      steps: [
        { label: 'Step 1: Add entry by entry', content: 'C₁₁ = 1+5 = 6, C₁₂ = 2+6 = 8\nC₂₁ = 3+7 = 10, C₂₂ = 4+8 = 12' },
        { label: 'Result', content: '**A + B** = [[6, 8], [10, 12]]' },
      ],
      answer: '[[6, 8], [10, 12]]',
      code: 'A = [[1, 2], [3, 4]]\nB = [[5, 6], [7, 8]]\n\n# Your code here\n',
      codeSolution: 'A = [[1, 2], [3, 4]]\nB = [[5, 6], [7, 8]]\nC = [[A[i][j] + B[i][j] for j in range(2)] for i in range(2)]\nfor row in C:\n    print(row)',
    },
    {
      id: 'mat-26', difficulty: 1,
      question: 'Multiply the 2×2 matrix **A** = [[2, 0], [1, 3]] by the vector **v** = [4, 1]. What is **Av**?',
      visual: { kind: 'bar-chart', labels: ['result₁', 'result₂'], values: [8, 7] },
      steps: [
        { label: 'Step 1: First component', content: '2×4 + 0×1 = 8' },
        { label: 'Step 2: Second component', content: '1×4 + 3×1 = 7' },
        { label: 'Result', content: '**Av** = **[8, 7]**' },
      ],
      answer: '[8, 7]',
      code: 'A = [[2, 0], [1, 3]]\nv = [4, 1]\n\n# Your code here\n',
      codeSolution: 'A = [[2, 0], [1, 3]]\nv = [4, 1]\nresult = [sum(A[i][j] * v[j] for j in range(2)) for i in range(2)]\nprint(f"Av = {result}")',
    },
    {
      id: 'mat-27', difficulty: 1,
      question: 'Find the **determinant** of A = [[3, 7], [1, 5]].',
      visual: { kind: 'bar-chart', labels: ['ad', 'bc', 'det'], values: [15, 7, 8] },
      steps: [
        { label: 'Step 1: Apply 2×2 determinant formula', content: 'det(A) = ad − bc = 3×5 − 7×1 = 15 − 7' },
        { label: 'Result', content: 'det(A) = **8**' },
      ],
      answer: '8',
      code: 'A = [[3, 7], [1, 5]]\n\n# Your code here\n',
      codeSolution: 'A = [[3, 7], [1, 5]]\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\nprint(f"det(A) = {det}")',
    },
    {
      id: 'mat-28', difficulty: 1,
      question: 'Multiply matrices **A** = [[1, 2], [3, 4]] and **B** = [[2, 0], [1, 1]]. What is **AB**?',
      visual: { kind: 'bar-chart', labels: ['c₁₁','c₁₂','c₂₁','c₂₂'], values: [4, 2, 10, 4] },
      steps: [
        { label: 'Step 1: C₁₁', content: '1×2 + 2×1 = 2 + 2 = 4' },
        { label: 'Step 2: C₁₂', content: '1×0 + 2×1 = 0 + 2 = 2' },
        { label: 'Step 3: C₂₁', content: '3×2 + 4×1 = 6 + 4 = 10' },
        { label: 'Step 4: C₂₂', content: '3×0 + 4×1 = 0 + 4 = 4' },
        { label: 'Result', content: '**AB** = [[4, 2], [10, 4]]' },
      ],
      answer: '[[4, 2], [10, 4]]',
      code: 'A = [[1, 2], [3, 4]]\nB = [[2, 0], [1, 1]]\n\n# Your code here\n',
      codeSolution: 'A = [[1, 2], [3, 4]]\nB = [[2, 0], [1, 1]]\nC = [[sum(A[i][k]*B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\nfor row in C:\n    print(row)',
    },
    {
      id: 'mat-29', difficulty: 1,
      question: 'Multiply the scalar **3** by the matrix **A** = [[1, −2], [4, 0]]. What is **3A**?',
      visual: { kind: 'bar-chart', labels: ['a₁₁','a₁₂','a₂₁','a₂₂'], values: [3, -6, 12, 0] },
      steps: [
        { label: 'Step 1: Multiply each entry by 3', content: '3×1 = 3, 3×(−2) = −6, 3×4 = 12, 3×0 = 0' },
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
      visual: { kind: 'bar-chart', labels: ['a','b','c','d'], values: [4, 7, 2, 6] },
      steps: [
        { label: 'Step 1: Determinant', content: 'det(A) = 4×6 − 7×2 = 24 − 14 = **10**' },
        { label: 'Step 2: Inverse formula', content: 'A⁻¹ = (1/det) × [[d, −b], [−c, a]] = (1/10) × [[6, −7], [−2, 4]]' },
        { label: 'Result', content: 'A⁻¹ = [[0.6, −0.7], [−0.2, 0.4]]' },
        { label: 'Step 3: Verify AA⁻¹', content: '[[4×0.6+7×(−0.2), 4×(−0.7)+7×0.4], [2×0.6+6×(−0.2), 2×(−0.7)+6×0.4]] = [[1,0],[0,1]] ✓' },
      ],
      answer: 'A⁻¹ = [[0.6, −0.7], [−0.2, 0.4]]',
      code: 'A = [[4, 7], [2, 6]]\n\n# Your code here\n',
      codeSolution: 'A = [[4, 7], [2, 6]]\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\nA_inv = [\n    [A[1][1]/det, -A[0][1]/det],\n    [-A[1][0]/det, A[0][0]/det]\n]\nprint("A inverse:")\nfor row in A_inv:\n    print([round(x, 4) for x in row])\n\n# Verify\nI = [[sum(A[i][k]*A_inv[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\nprint("\\nA * A_inv:")\nfor row in I:\n    print([round(x, 4) for x in row])',
    },
    {
      id: 'mat-31', difficulty: 2,
      question: 'A shop sells apples at ₹50/kg and bananas at ₹30/kg. Customer A buys 2 kg apples and 3 kg bananas. Customer B buys 4 kg apples and 1 kg bananas. Express as a matrix multiplication and compute each bill.\n\n**Quantity matrix** Q = [[2, 3], [4, 1]], **Price vector** p = [50, 30].',
      visual: { kind: 'bar-chart', labels: ['Customer A', 'Customer B'], values: [190, 230] },
      steps: [
        { label: 'Step 1: Customer A bill', content: '2×50 + 3×30 = 100 + 90 = **₹190**' },
        { label: 'Step 2: Customer B bill', content: '4×50 + 1×30 = 200 + 30 = **₹230**' },
        { label: 'Matrix form', content: 'Qp = [[2,3],[4,1]] × [50,30] = **[190, 230]**' },
      ],
      answer: 'Customer A: ₹190, Customer B: ₹230',
      code: 'Q = [[2, 3], [4, 1]]\np = [50, 30]\n\n# Your code here\n',
      codeSolution: 'Q = [[2, 3], [4, 1]]\np = [50, 30]\nbills = [sum(Q[i][j] * p[j] for j in range(2)) for i in range(2)]\nprint(f"Customer A: Rs {bills[0]}")\nprint(f"Customer B: Rs {bills[1]}")',
    },
    {
      id: 'mat-32', difficulty: 2,
      question: 'Verify that matrix multiplication is **not commutative**: compute **AB** and **BA** for A = [[1, 2], [0, 1]] and B = [[0, 1], [1, 0]], and show they are different.',
      visual: { kind: 'bar-chart', labels: ['AB₁₁','AB₁₂','AB₂₁','AB₂₂','BA₁₁','BA₁₂','BA₂₁','BA₂₂'], values: [2, 1, 1, 0, 0, 1, 1, 2] },
      steps: [
        { label: 'Step 1: AB', content: 'AB₁₁ = 0+2=2, AB₁₂ = 1+0=1, AB₂₁ = 0+1=1, AB₂₂ = 0+0=0\n**AB** = [[2,1],[1,0]]' },
        { label: 'Step 2: BA', content: 'BA₁₁ = 0+0=0, BA₁₂ = 0+1=1, BA₂₁ = 1+0=1, BA₂₂ = 2+0=2\n**BA** = [[0,1],[1,2]]' },
        { label: 'Step 3: Compare', content: 'AB ≠ BA — matrix multiplication is **not commutative** ✓' },
      ],
      answer: 'AB = [[2,1],[1,0]], BA = [[0,1],[1,2]] — they differ',
      code: 'A = [[1, 2], [0, 1]]\nB = [[0, 1], [1, 0]]\n\n# Your code here\n',
      codeSolution: 'def mat_mul(A, B):\n    n = len(A)\n    return [[sum(A[i][k]*B[k][j] for k in range(n)) for j in range(n)] for i in range(n)]\n\nA = [[1, 2], [0, 1]]\nB = [[0, 1], [1, 0]]\nAB = mat_mul(A, B)\nBA = mat_mul(B, A)\nprint(f"AB = {AB}")\nprint(f"BA = {BA}")\nprint(f"AB == BA: {AB == BA}")',
    },
    {
      id: 'mat-33', difficulty: 2,
      question: 'Compute the **determinant of a 3×3 matrix** A = [[2, 1, 3], [0, 4, 1], [1, 0, 2]] using cofactor expansion along the first row.',
      visual: { kind: 'bar-chart', labels: ['cofactor₁', 'cofactor₂', 'cofactor₃', 'det'], values: [16, -1, -12, 13] },
      steps: [
        { label: 'Step 1: Cofactor of a₁₁ = 2', content: 'Minor = [[4,1],[0,2]], det = 8−0 = 8. Cofactor = +2×8 = **16**' },
        { label: 'Step 2: Cofactor of a₁₂ = 1', content: 'Minor = [[0,1],[1,2]], det = 0−1 = −1. Cofactor = −1×(−1) = **1**' },
        { label: 'Step 3: Cofactor of a₁₃ = 3', content: 'Minor = [[0,4],[1,0]], det = 0−4 = −4. Cofactor = +3×(−4) = **−12**' },
        { label: 'Step 4: Sum', content: 'det(A) = 16 + 1 + (−12) = **5**' },
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
      steps: [
        { label: 'Step 1: Set up matrices', content: 'A = [[3,2],[1,4]], b = [12,10]' },
        { label: 'Step 2: Determinant', content: 'det(A) = 3×4 − 2×1 = 12 − 2 = **10**' },
        { label: 'Step 3: Inverse', content: 'A⁻¹ = (1/10) × [[4,−2],[−1,3]] = [[0.4, −0.2],[−0.1, 0.3]]' },
        { label: 'Step 4: x = A⁻¹b', content: 'x = 0.4×12 + (−0.2)×10 = 4.8 − 2 = **2.8**\ny = (−0.1)×12 + 0.3×10 = −1.2 + 3 = **1.8**' },
        { label: 'Step 5: Verify', content: '3(2.8) + 2(1.8) = 8.4 + 3.6 = 12 ✓\n1(2.8) + 4(1.8) = 2.8 + 7.2 = 10 ✓' },
      ],
      answer: 'x = 2.8, y = 1.8',
      code: 'A = [[3, 2], [1, 4]]\nb = [12, 10]\n\n# Your code here\n',
      codeSolution: 'A = [[3, 2], [1, 4]]\nb = [12, 10]\n\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\nA_inv = [\n    [A[1][1]/det, -A[0][1]/det],\n    [-A[1][0]/det, A[0][0]/det]\n]\n\nx = A_inv[0][0]*b[0] + A_inv[0][1]*b[1]\ny = A_inv[1][0]*b[0] + A_inv[1][1]*b[1]\n\nprint(f"x = {x}")\nprint(f"y = {y}")\nprint(f"\\nVerify: 3*{x} + 2*{y} = {3*x + 2*y}")\nprint(f"Verify: 1*{x} + 4*{y} = {x + 4*y}")',
    },
    {
      id: 'mat-35', difficulty: 3,
      question: 'Verify that **det(AB) = det(A) × det(B)** for A = [[2, 1], [3, 4]] and B = [[1, 5], [0, 2]]. Compute all three determinants.',
      visual: { kind: 'bar-chart', labels: ['det(A)', 'det(B)', 'det(A)det(B)', 'det(AB)'], values: [5, 2, 10, 10] },
      steps: [
        { label: 'Step 1: det(A)', content: 'det(A) = 2×4 − 1×3 = 8 − 3 = **5**' },
        { label: 'Step 2: det(B)', content: 'det(B) = 1×2 − 5×0 = 2 − 0 = **2**' },
        { label: 'Step 3: Compute AB', content: 'AB₁₁ = 2+0=2, AB₁₂ = 10+2=12\nAB₂₁ = 3+0=3, AB₂₂ = 15+8=23\n**AB** = [[2,12],[3,23]]' },
        { label: 'Step 4: det(AB)', content: 'det(AB) = 2×23 − 12×3 = 46 − 36 = **10**' },
        { label: 'Step 5: Verify', content: 'det(A) × det(B) = 5 × 2 = 10 = det(AB) ✓' },
      ],
      answer: 'det(A)=5, det(B)=2, det(AB)=10 — property verified',
      code: 'A = [[2, 1], [3, 4]]\nB = [[1, 5], [0, 2]]\n\n# Your code here\n',
      codeSolution: 'def det2(M):\n    return M[0][0]*M[1][1] - M[0][1]*M[1][0]\n\ndef mat_mul(A, B):\n    return [[sum(A[i][k]*B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\n\nA = [[2, 1], [3, 4]]\nB = [[1, 5], [0, 2]]\nAB = mat_mul(A, B)\n\nprint(f"det(A) = {det2(A)}")\nprint(f"det(B) = {det2(B)}")\nprint(f"det(A)*det(B) = {det2(A)*det2(B)}")\nprint(f"det(AB) = {det2(AB)}")\nprint(f"Property holds: {det2(A)*det2(B) == det2(AB)}")',
    },
    {
      id: 'mat-36', difficulty: 3,
      question: 'An ML model has a weight matrix **W** = [[0.5, 0.3], [0.2, 0.8]] and applies it to feature vectors. If the input is **x** = [10, 20], compute **Wx**. Then apply **W** again to the result: what is **W²x**? (This models a 2-layer network with shared weights.)',
      visual: { kind: 'bar-chart', labels: ['Wx₁', 'Wx₂', 'W²x₁', 'W²x₂'], values: [11, 18, 10.9, 16.6] },
      steps: [
        { label: 'Step 1: Wx', content: 'Wx₁ = 0.5×10 + 0.3×20 = 5 + 6 = **11**\nWx₂ = 0.2×10 + 0.8×20 = 2 + 16 = **18**' },
        { label: 'Step 2: W(Wx) = W²x', content: 'W²x₁ = 0.5×11 + 0.3×18 = 5.5 + 5.4 = **10.9**\nW²x₂ = 0.2×11 + 0.8×18 = 2.2 + 14.4 = **16.6**' },
      ],
      answer: 'Wx = [11, 18], W²x = [10.9, 16.6]',
      code: 'W = [[0.5, 0.3], [0.2, 0.8]]\nx = [10, 20]\n\n# Your code here\n',
      codeSolution: 'W = [[0.5, 0.3], [0.2, 0.8]]\nx = [10, 20]\n\ndef mat_vec(M, v):\n    return [sum(M[i][j]*v[j] for j in range(len(v))) for i in range(len(M))]\n\nwx = mat_vec(W, x)\nw2x = mat_vec(W, wx)\nprint(f"Wx = {wx}")\nprint(f"W^2 x = {w2x}")',
    },
    {
      id: 'mat-37', difficulty: 2,
      question: 'Find the **transpose** of A = [[1, 2, 3], [4, 5, 6]] and verify that **(Aᵀ)ᵀ = A**.',
      visual: { kind: 'bar-chart', labels: ['A rows','A cols','Aᵀ rows','Aᵀ cols'], values: [2, 3, 3, 2] },
      steps: [
        { label: 'Step 1: Transpose (swap rows and columns)', content: 'Aᵀ = [[1, 4], [2, 5], [3, 6]]' },
        { label: 'Step 2: Transpose again', content: '(Aᵀ)ᵀ = [[1, 2, 3], [4, 5, 6]] = A ✓' },
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
      steps: [
        { label: 'Step 1: Matrix-vector multiply', content: 'Sv = [2×1 + 0×1, 0×1 + 3×1] = [2, 3]' },
        { label: 'Result', content: 'The point moves to **(2, 3)**' },
      ],
      answer: '(2, 3)',
      code: 'S = [[2, 0], [0, 3]]\nv = [1, 1]\n\n# Your code here\n',
      codeSolution: 'S = [[2, 0], [0, 3]]\nv = [1, 1]\nresult = [sum(S[i][j]*v[j] for j in range(2)) for i in range(2)]\nprint(f"Transformed point: ({result[0]}, {result[1]})")',
    },
    {
      id: 'mat-39', difficulty: 1,
      question: 'A **reflection matrix** across the x-axis is R = [[1, 0], [0, −1]]. Reflect the point **(3, 5)** across the x-axis.',
      visual: { kind: 'scatter', points: [[3, 5], [3, -5]], showLine: true },
      steps: [
        { label: 'Step 1: Multiply', content: 'Rv = [1×3 + 0×5, 0×3 + (−1)×5] = [3, −5]' },
        { label: 'Result', content: 'Reflected point = **(3, −5)**' },
      ],
      answer: '(3, −5)',
      code: 'R = [[1, 0], [0, -1]]\nv = [3, 5]\n\n# Your code here\n',
      codeSolution: 'R = [[1, 0], [0, -1]]\nv = [3, 5]\nresult = [sum(R[i][j]*v[j] for j in range(2)) for i in range(2)]\nprint(f"Reflected point: ({result[0]}, {result[1]})")',
    },
    {
      id: 'mat-40', difficulty: 1,
      question: 'Write the **90° counter-clockwise rotation matrix** and apply it to the point **(1, 0)**. Where does it end up?',
      visual: { kind: 'scatter', points: [[1, 0], [0, 1]], showLine: true },
      steps: [
        { label: 'Step 1: Rotation matrix for 90°', content: 'R = [[cos90°, −sin90°], [sin90°, cos90°]] = [[0, −1], [1, 0]]' },
        { label: 'Step 2: Apply', content: 'Rv = [0×1 + (−1)×0, 1×1 + 0×0] = [0, 1]' },
        { label: 'Result', content: 'The point **(1, 0)** rotates to **(0, 1)** — the positive y-axis ✓' },
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
      steps: [
        { label: 'Step 1: R (45°)', content: 'cos45° = sin45° = √2/2 ≈ 0.7071\nR = [[0.7071, −0.7071], [0.7071, 0.7071]]' },
        { label: 'Step 2: T = RS', content: 'T₁₁ = 0.7071×2 + (−0.7071)×0 = 1.4142\nT₁₂ = 0.7071×0 + (−0.7071)×2 = −1.4142\nT₂₁ = 0.7071×2 + 0.7071×0 = 1.4142\nT₂₂ = 0.7071×0 + 0.7071×2 = 1.4142' },
        { label: 'Step 3: Apply T to (1,0)', content: 'Tv = [1.4142×1 + (−1.4142)×0, 1.4142×1 + 1.4142×0] = **(1.414, 1.414)**' },
      ],
      answer: 'T = [[√2, −√2], [√2, √2]]; T(1,0) ≈ (1.414, 1.414)',
      code: 'import math\n\ntheta = math.radians(45)\nR = [[math.cos(theta), -math.sin(theta)],\n     [math.sin(theta), math.cos(theta)]]\nS = [[2, 0], [0, 2]]\nv = [1, 0]\n\n# Your code here\n',
      codeSolution: 'import math\n\ndef mat_mul(A, B):\n    return [[sum(A[i][k]*B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\n\ndef mat_vec(M, v):\n    return [sum(M[i][j]*v[j] for j in range(2)) for i in range(2)]\n\ntheta = math.radians(45)\nR = [[math.cos(theta), -math.sin(theta)],\n     [math.sin(theta), math.cos(theta)]]\nS = [[2, 0], [0, 2]]\n\nT = mat_mul(R, S)\nresult = mat_vec(T, [1, 0])\n\nprint("T =")\nfor row in T: print([round(x, 4) for x in row])\nprint(f"\\nT(1,0) = ({result[0]:.4f}, {result[1]:.4f})")',
    },
    {
      id: 'mat-42', difficulty: 2,
      question: 'A **shear transformation** is given by H = [[1, 2], [0, 1]]. Apply it to the unit square corners (0,0), (1,0), (1,1), (0,1). What shape results?',
      visual: { kind: 'scatter', points: [[0, 0], [1, 0], [3, 1], [2, 1]], showLine: true },
      steps: [
        { label: 'Step 1: Transform each corner', content: 'H(0,0) = (0,0)\nH(1,0) = (1,0)\nH(1,1) = (1+2, 1) = (3,1)\nH(0,1) = (0+2, 1) = (2,1)' },
        { label: 'Step 2: Identify shape', content: 'The square becomes a **parallelogram** with vertices (0,0), (1,0), (3,1), (2,1)' },
        { label: 'Step 3: Area check', content: 'det(H) = 1×1 − 2×0 = 1, so area is preserved ✓' },
      ],
      answer: 'Parallelogram with corners (0,0), (1,0), (3,1), (2,1); area = 1',
      code: 'H = [[1, 2], [0, 1]]\ncorners = [(0,0), (1,0), (1,1), (0,1)]\n\n# Your code here\n',
      codeSolution: 'H = [[1, 2], [0, 1]]\ncorners = [(0,0), (1,0), (1,1), (0,1)]\n\ntransformed = []\nfor v in corners:\n    tv = (H[0][0]*v[0] + H[0][1]*v[1], H[1][0]*v[0] + H[1][1]*v[1])\n    transformed.append(tv)\n    print(f"H{v} = {tv}")\n\ndet = H[0][0]*H[1][1] - H[0][1]*H[1][0]\nprint(f"\\ndet(H) = {det} (area is preserved)")',
    },
    {
      id: 'mat-43', difficulty: 2,
      question: 'Show that applying the **same rotation matrix** R(30°) **three times** is equivalent to a single rotation by **90°**. Verify by computing R(30°)³ and comparing to R(90°).',
      visual: { kind: 'scatter', points: [[1, 0], [0.866, 0.5], [0.5, 0.866], [0, 1]], showLine: true },
      steps: [
        { label: 'Step 1: R(30°)', content: 'cos30° = √3/2 ≈ 0.866, sin30° = 0.5\nR₃₀ = [[0.866, −0.5], [0.5, 0.866]]' },
        { label: 'Step 2: R(30°)² = R(60°)', content: 'Expected: cos60° = 0.5, sin60° ≈ 0.866\nR₃₀² = [[0.5, −0.866], [0.866, 0.5]]' },
        { label: 'Step 3: R(30°)³ = R(90°)', content: 'Expected: cos90° = 0, sin90° = 1\nR₃₀³ ≈ [[0, −1], [1, 0]] = R(90°) ✓' },
      ],
      answer: 'R(30°)³ ≈ [[0, −1], [1, 0]] = R(90°)',
      code: 'import math\n\ntheta = math.radians(30)\n\n# Your code here\n',
      codeSolution: 'import math\n\ndef mat_mul(A, B):\n    return [[sum(A[i][k]*B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\n\ndef rot(deg):\n    t = math.radians(deg)\n    return [[math.cos(t), -math.sin(t)], [math.sin(t), math.cos(t)]]\n\nR30 = rot(30)\nR30_sq = mat_mul(R30, R30)\nR30_cu = mat_mul(R30_sq, R30)\nR90 = rot(90)\n\nprint("R(30)^3:")\nfor row in R30_cu: print([round(x, 4) for x in row])\nprint("\\nR(90):")\nfor row in R90: print([round(x, 4) for x in row])\n\nclose = all(abs(R30_cu[i][j] - R90[i][j]) < 1e-10 for i in range(2) for j in range(2))\nprint(f"\\nR(30)^3 == R(90): {close}")',
    },
    {
      id: 'mat-44', difficulty: 2,
      question: 'Find the **eigenvalues** of A = [[5, 0], [0, 3]]. (Hint: diagonal matrices make this easy.)',
      visual: { kind: 'bar-chart', labels: ['λ₁', 'λ₂'], values: [5, 3] },
      steps: [
        { label: 'Step 1: Characteristic equation', content: 'det(A − λI) = 0 → (5−λ)(3−λ) − 0 = 0' },
        { label: 'Step 2: Solve', content: '(5−λ)(3−λ) = 0 → λ₁ = **5**, λ₂ = **3**' },
        { label: 'Insight', content: 'For a diagonal matrix, the eigenvalues are simply the diagonal entries.' },
      ],
      answer: 'λ₁ = 5, λ₂ = 3',
      code: 'A = [[5, 0], [0, 3]]\n\n# Your code here\n',
      codeSolution: 'import math\n\nA = [[5, 0], [0, 3]]\n\n# For 2x2: lambda^2 - trace*lambda + det = 0\ntrace = A[0][0] + A[1][1]\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\ndisc = trace**2 - 4*det\n\nlam1 = (trace + math.sqrt(disc)) / 2\nlam2 = (trace - math.sqrt(disc)) / 2\nprint(f"Eigenvalues: lambda_1 = {lam1}, lambda_2 = {lam2}")',
    },

    // ── Hard ──────────────────────────────────────────────────

    {
      id: 'mat-45', difficulty: 3,
      question: 'Find the **eigenvalues and eigenvectors** of A = [[4, 1], [2, 3]].',
      visual: { kind: 'bar-chart', labels: ['λ₁', 'λ₂'], values: [5, 2] },
      steps: [
        { label: 'Step 1: Characteristic equation', content: 'det(A − λI) = (4−λ)(3−λ) − 1×2 = λ² − 7λ + 10 = 0' },
        { label: 'Step 2: Solve quadratic', content: 'λ = (7 ± √(49−40)) / 2 = (7 ± 3) / 2\nλ₁ = **5**, λ₂ = **2**' },
        { label: 'Step 3: Eigenvector for λ₁=5', content: '(A − 5I)v = 0 → [[-1,1],[2,-2]]v = 0 → v₁ = **[1, 1]** (or any scalar multiple)' },
        { label: 'Step 4: Eigenvector for λ₂=2', content: '(A − 2I)v = 0 → [[2,1],[2,1]]v = 0 → v₂ = **[1, −2]** (or any scalar multiple)' },
      ],
      answer: 'λ₁=5 with eigenvector (1,1); λ₂=2 with eigenvector (1,−2)',
      code: 'import math\n\nA = [[4, 1], [2, 3]]\n\n# Your code here\n',
      codeSolution: 'import math\n\nA = [[4, 1], [2, 3]]\n\n# Characteristic equation: lambda^2 - trace*lambda + det = 0\ntrace = A[0][0] + A[1][1]\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\ndisc = trace**2 - 4*det\n\nlam1 = (trace + math.sqrt(disc)) / 2\nlam2 = (trace - math.sqrt(disc)) / 2\nprint(f"Eigenvalues: {lam1}, {lam2}")\n\n# Eigenvectors: solve (A - lambda*I)v = 0\nfor lam in [lam1, lam2]:\n    # First row of (A - lam*I): [A[0][0]-lam, A[0][1]]\n    a = A[0][0] - lam\n    b = A[0][1]\n    if abs(b) > 1e-10:\n        v = (1, -a/b)\n    elif abs(a) > 1e-10:\n        v = (0, 1)\n    else:\n        v = (1, 0)\n    print(f"lambda={lam}: eigenvector = {v}")',
    },
    {
      id: 'mat-46', difficulty: 3,
      question: 'A population model uses the **Leslie matrix** L = [[0, 4], [0.5, 0]] where the top row gives birth rates and the sub-diagonal gives survival rates. Starting with population vector **p₀** = [100, 50] (100 young, 50 adults), compute **p₁ = Lp₀** and **p₂ = Lp₁**. Find the eigenvalues of L to predict long-term growth.',
      visual: { kind: 'bar-chart', labels: ['p₀ young','p₀ adult','p₁ young','p₁ adult','p₂ young','p₂ adult'], values: [100, 50, 200, 50, 200, 100] },
      steps: [
        { label: 'Step 1: p₁ = Lp₀', content: 'p₁[young] = 0×100 + 4×50 = **200**\np₁[adult] = 0.5×100 + 0×50 = **50**\np₁ = [200, 50]' },
        { label: 'Step 2: p₂ = Lp₁', content: 'p₂[young] = 0×200 + 4×50 = **200**\np₂[adult] = 0.5×200 + 0×50 = **100**\np₂ = [200, 100]' },
        { label: 'Step 3: Eigenvalues', content: 'det(L − λI) = (0−λ)(0−λ) − 4×0.5 = λ² − 2 = 0\nλ = ±√2 ≈ ±1.414' },
        { label: 'Step 4: Long-term', content: 'Dominant eigenvalue √2 ≈ 1.414 > 1, so the population **grows** by ~41.4% per generation.' },
      ],
      answer: 'p₁=[200,50], p₂=[200,100]; eigenvalues ±√2 ≈ ±1.414 — population growing',
      code: 'import math\n\nL = [[0, 4], [0.5, 0]]\np0 = [100, 50]\n\n# Your code here\n',
      codeSolution: 'import math\n\nL = [[0, 4], [0.5, 0]]\np0 = [100, 50]\n\ndef mat_vec(M, v):\n    return [sum(M[i][j]*v[j] for j in range(len(v))) for i in range(len(M))]\n\np1 = mat_vec(L, p0)\np2 = mat_vec(L, p1)\nprint(f"p1 = {p1}")\nprint(f"p2 = {p2}")\n\n# Eigenvalues\ntrace = L[0][0] + L[1][1]\ndet = L[0][0]*L[1][1] - L[0][1]*L[1][0]\ndisc = trace**2 - 4*det\nlam1 = (trace + math.sqrt(abs(disc))) / 2\nlam2 = (trace - math.sqrt(abs(disc))) / 2\nprint(f"\\nEigenvalues: {lam1:.4f}, {lam2:.4f}")\nprint(f"Dominant eigenvalue > 1 => population grows")',
    },
    {
      id: 'mat-47', difficulty: 3,
      question: 'A **Markov chain** has transition matrix P = [[0.7, 0.3], [0.4, 0.6]]. Starting with state vector **s₀** = [1, 0] (100% in state 1), compute **s₁**, **s₂**, and **s₃**. Then find the **steady-state vector** by solving **πP = π** with π₁ + π₂ = 1.',
      visual: { kind: 'bar-chart', labels: ['s₀₁','s₀₂','s₁₁','s₁₂','s₂₁','s₂₂'], values: [1, 0, 0.7, 0.3, 0.61, 0.39] },
      steps: [
        { label: 'Step 1: s₁ = s₀P', content: 's₁ = [1×0.7 + 0×0.4, 1×0.3 + 0×0.6] = **[0.7, 0.3]**' },
        { label: 'Step 2: s₂ = s₁P', content: 's₂ = [0.7×0.7 + 0.3×0.4, 0.7×0.3 + 0.3×0.6] = **[0.61, 0.39]**' },
        { label: 'Step 3: s₃ = s₂P', content: 's₃ = [0.61×0.7 + 0.39×0.4, 0.61×0.3 + 0.39×0.6] = **[0.583, 0.417]**' },
        { label: 'Step 4: Steady state', content: 'π₁ = 0.7π₁ + 0.4π₂ → 0.3π₁ = 0.4π₂ → π₁/π₂ = 4/3\nWith π₁+π₂=1: π₁ = **4/7 ≈ 0.571**, π₂ = **3/7 ≈ 0.429**' },
      ],
      answer: 's₁=[0.7,0.3], s₂=[0.61,0.39], s₃=[0.583,0.417]; steady state = [4/7, 3/7]',
      code: 'P = [[0.7, 0.3], [0.4, 0.6]]\ns0 = [1, 0]\n\n# Your code here\n',
      codeSolution: 'P = [[0.7, 0.3], [0.4, 0.6]]\ns = [1.0, 0.0]\n\nfor step in range(1, 4):\n    s_new = [\n        s[0]*P[0][0] + s[1]*P[1][0],\n        s[0]*P[0][1] + s[1]*P[1][1]\n    ]\n    s = s_new\n    print(f"s{step} = [{s[0]:.4f}, {s[1]:.4f}]")\n\n# Steady state: pi_1 / pi_2 = P[1][0] / P[0][1]\npi1 = P[1][0] / (P[0][1] + P[1][0])\npi2 = P[0][1] / (P[0][1] + P[1][0])\nprint(f"\\nSteady state: [{pi1:.4f}, {pi2:.4f}]")\nprint(f"As fractions: [4/7, 3/7]")',
    },
    {
      id: 'mat-48', difficulty: 3,
      question: 'A 2×2 matrix A = [[3, 1], [0, 2]] is **upper triangular**. Find its eigenvalues, then **diagonalize** it: find P and D such that A = PDP⁻¹. Verify by computing PDP⁻¹.',
      visual: { kind: 'bar-chart', labels: ['λ₁', 'λ₂', 'D₁₁', 'D₂₂'], values: [3, 2, 3, 2] },
      steps: [
        { label: 'Step 1: Eigenvalues', content: 'For triangular matrices, eigenvalues = diagonal entries: λ₁ = **3**, λ₂ = **2**' },
        { label: 'Step 2: Eigenvector for λ₁=3', content: '(A−3I)v = [[0,1],[0,−1]]v = 0 → v₁ = **(1, 0)**' },
        { label: 'Step 3: Eigenvector for λ₂=2', content: '(A−2I)v = [[1,1],[0,0]]v = 0 → v₂ = **(−1, 1)** (or (1,−1))' },
        { label: 'Step 4: Form P and D', content: 'P = [[1, −1], [0, 1]], D = [[3, 0], [0, 2]]' },
        { label: 'Step 5: Verify PDP⁻¹', content: 'P⁻¹ = [[1, 1], [0, 1]]\nPD = [[3, −2], [0, 2]]\nPDP⁻¹ = [[3, 1], [0, 2]] = A ✓' },
      ],
      answer: 'λ₁=3, λ₂=2; P=[[1,−1],[0,1]], D=[[3,0],[0,2]]',
      code: 'import math\n\nA = [[3, 1], [0, 2]]\n\n# Your code here\n',
      codeSolution: 'import math\n\nA = [[3, 1], [0, 2]]\n\n# Eigenvalues\ntrace = A[0][0] + A[1][1]\ndet = A[0][0]*A[1][1] - A[0][1]*A[1][0]\ndisc = trace**2 - 4*det\nlam1 = (trace + math.sqrt(disc)) / 2\nlam2 = (trace - math.sqrt(disc)) / 2\nprint(f"Eigenvalues: {lam1}, {lam2}")\n\n# P = eigenvectors as columns\nP = [[1, -1], [0, 1]]\nD = [[lam1, 0], [0, lam2]]\n\n# P inverse (2x2)\ndet_P = P[0][0]*P[1][1] - P[0][1]*P[1][0]\nP_inv = [[P[1][1]/det_P, -P[0][1]/det_P],\n         [-P[1][0]/det_P, P[0][0]/det_P]]\n\n# Verify PDP^-1\ndef mat_mul(A, B):\n    return [[sum(A[i][k]*B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\n\nresult = mat_mul(mat_mul(P, D), P_inv)\nprint("\\nPDP^-1 =")\nfor row in result:\n    print([round(x, 4) for x in row])\nprint(f"\\nEquals A: {all(abs(result[i][j]-A[i][j]) < 1e-10 for i in range(2) for j in range(2))}")',
    },
    {
      id: 'mat-49', difficulty: 3,
      question: 'A data matrix has **singular values** σ₁ = 5 and σ₂ = 1 for the matrix M = [[3, 2], [2, 3]]. Verify this by computing **MᵀM**, finding its eigenvalues, and taking square roots. What does the ratio σ₁/σ₂ tell you about the data?',
      visual: { kind: 'bar-chart', labels: ['σ₁', 'σ₂', 'σ₁/σ₂'], values: [5, 1, 5] },
      steps: [
        { label: 'Step 1: Compute MᵀM', content: 'Mᵀ = [[3,2],[2,3]]\nMᵀM = [[3×3+2×2, 3×2+2×3], [2×3+3×2, 2×2+3×3]] = [[13, 12], [12, 13]]' },
        { label: 'Step 2: Eigenvalues of MᵀM', content: 'trace = 26, det = 169 − 144 = 25\nλ = (26 ± √(676−100))/2 = (26 ± √576)/2 = (26 ± 24)/2\nλ₁ = **25**, λ₂ = **1**' },
        { label: 'Step 3: Singular values', content: 'σ₁ = √25 = **5**, σ₂ = √1 = **1**' },
        { label: 'Step 4: Condition number', content: 'σ₁/σ₂ = 5/1 = **5** — moderate spread. The data is stretched 5× more in one direction than the other.' },
      ],
      answer: 'σ₁=5, σ₂=1, condition number=5 — data has moderate directional bias',
      code: 'import math\n\nM = [[3, 2], [2, 3]]\n\n# Your code here\n',
      codeSolution: 'import math\n\nM = [[3, 2], [2, 3]]\n\n# Transpose (symmetric so Mt = M)\nMt = [[M[j][i] for j in range(2)] for i in range(2)]\n\n# MtM\nMtM = [[sum(Mt[i][k]*M[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\nprint("M^T M =")\nfor row in MtM: print(row)\n\n# Eigenvalues of MtM\ntrace = MtM[0][0] + MtM[1][1]\ndet = MtM[0][0]*MtM[1][1] - MtM[0][1]*MtM[1][0]\ndisc = trace**2 - 4*det\nlam1 = (trace + math.sqrt(disc)) / 2\nlam2 = (trace - math.sqrt(disc)) / 2\n\nsigma1 = math.sqrt(lam1)\nsigma2 = math.sqrt(lam2)\nprint(f"\\nSingular values: sigma1={sigma1:.4f}, sigma2={sigma2:.4f}")\nprint(f"Condition number: {sigma1/sigma2:.4f}")',
    },
    {
      id: 'mat-50', difficulty: 3,
      question: 'Solve the system **Ax = b** using Cramer\'s rule, where A = [[1, 3, −2], [3, 5, 6], [2, 4, 3]] and b = [5, 7, 8]. The system represents a pricing model: x, y, z are unknown unit prices.',
      visual: { kind: 'bar-chart', labels: ['det(A)', 'det(A₁)', 'det(A₂)', 'det(A₃)'], values: [-20, 36, -38, -16] },
      steps: [
        { label: 'Step 1: det(A)', content: '1(5×3 − 6×4) − 3(3×3 − 6×2) + (−2)(3×4 − 5×2)\n= 1(15−24) − 3(9−12) + (−2)(12−10)\n= 1(−9) − 3(−3) + (−2)(2)\n= −9 + 9 − 4 = **−4**' },
        { label: 'Step 2: det(A₁) — replace col 1 with b', content: 'A₁ = [[5,3,−2],[7,5,6],[8,4,3]]\ndet(A₁) = 5(15−24) − 3(21−48) + (−2)(28−40)\n= 5(−9) − 3(−27) + (−2)(−12)\n= −45 + 81 + 24 = **60**' },
        { label: 'Step 3: det(A₂) — replace col 2 with b', content: 'A₂ = [[1,5,−2],[3,7,6],[2,8,3]]\ndet(A₂) = 1(21−48) − 5(9−12) + (−2)(24−14)\n= 1(−27) − 5(−3) + (−2)(10)\n= −27 + 15 − 20 = **−32**' },
        { label: 'Step 4: det(A₃) — replace col 3 with b', content: 'A₃ = [[1,3,5],[3,5,7],[2,4,8]]\ndet(A₃) = 1(40−28) − 3(24−14) + 5(12−10)\n= 12 − 30 + 10 = **−8**' },
        { label: 'Step 5: Solutions', content: 'x = det(A₁)/det(A) = 60/(−4) = **−15**\ny = det(A₂)/det(A) = −32/(−4) = **8**\nz = det(A₃)/det(A) = −8/(−4) = **2**' },
      ],
      answer: 'x = −15, y = 8, z = 2',
      code: 'A = [[1, 3, -2], [3, 5, 6], [2, 4, 3]]\nb = [5, 7, 8]\n\n# Your code here\n',
      codeSolution: 'def det3(M):\n    return (M[0][0]*(M[1][1]*M[2][2] - M[1][2]*M[2][1])\n          - M[0][1]*(M[1][0]*M[2][2] - M[1][2]*M[2][0])\n          + M[0][2]*(M[1][0]*M[2][1] - M[1][1]*M[2][0]))\n\nA = [[1, 3, -2], [3, 5, 6], [2, 4, 3]]\nb = [5, 7, 8]\n\ndet_A = det3(A)\nprint(f"det(A) = {det_A}")\n\nsolutions = []\nfor col in range(3):\n    A_mod = [row[:] for row in A]\n    for row in range(3):\n        A_mod[row][col] = b[row]\n    det_mod = det3(A_mod)\n    val = det_mod / det_A\n    solutions.append(val)\n    print(f"det(A{col+1}) = {det_mod}, x{col+1} = {val}")\n\nprint(f"\\nSolution: x={solutions[0]}, y={solutions[1]}, z={solutions[2]}")\n\n# Verify\nfor i in range(3):\n    check = sum(A[i][j]*solutions[j] for j in range(3))\n    print(f"Row {i+1} check: {check} = {b[i]} -> {abs(check - b[i]) < 1e-10}")',
    },
  ],
};
