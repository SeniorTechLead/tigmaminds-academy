// ============================================================
// PRACTICE PROBLEMS — Geometry Essentials
// ============================================================
import type { PracticeSet } from './reference';

export const practiceAngles: PracticeSet = {
  title: 'Practice — Angles',
  problems: [
    {
      id: 'ag-01', difficulty: 1,
      question: 'Classify the angle: **62°**.',
      steps: [
        { label: 'Step 1: Compare to 90° and 180°', content: 'Less than 90°' },
        { label: 'Step 2: Type', content: '**Acute**' },
      ],
      answer: 'Acute',
    },
    {
      id: 'ag-02', difficulty: 1,
      question: 'What is the **complement** of 35°? What is its **supplement**?',
      steps: [
        { label: 'Complement: 90° − 35°', content: '55°' },
        { label: 'Supplement: 180° − 35°', content: '145°' },
      ],
      answer: 'Complement = 55°, supplement = 145°',
    },
    {
      id: 'ag-03', difficulty: 2,
      question: 'Two parallel railway tracks are crossed by a road making one angle of 70° with the first track. What is the **alternate interior** angle on the second track?',
      steps: [
        { label: 'Alternate interior angles between parallel lines are equal', content: '— ' },
        { label: 'Result', content: '**70°**' },
      ],
      answer: '70°',
    },
    {
      id: 'ag-04', difficulty: 2,
      question: 'Two angles are **supplementary** and one is **3 times** the other. Find both.',
      steps: [
        { label: 'Step 1: Let the smaller be x', content: '— ' },
        { label: 'Step 2: x + 3x = 180°', content: '4x = 180°' },
        { label: 'Step 3: Solve', content: 'x = 45°' },
        { label: 'Step 4: Both', content: '**45° and 135°**' },
      ],
      answer: '45° and 135°',
    },
    {
      id: 'ag-05', difficulty: 3,
      question: 'On a sphere, a triangle has three 90° angles. What is its angle sum, and what does this tell us about the geometry?',
      steps: [
        { label: 'Sum = 270°', content: '— ' },
        { label: 'In Euclidean (flat) geometry, the sum is always 180°', content: '— ' },
        { label: 'Conclusion', content: 'Sphere geometry is **non-Euclidean**; angles depend on the surface\'s curvature.' },
      ],
      answer: '270°; geometry is non-Euclidean (curvature)',
    },
  ],
};

export const practiceTriangles: PracticeSet = {
  title: 'Practice — Triangles & Pythagoras',
  problems: [
    {
      id: 'tr-01', difficulty: 1,
      question: 'A right triangle has legs **6 cm** and **8 cm**. Find the hypotenuse.',
      steps: [
        { label: 'Step 1: Pythagoras', content: 'c² = 6² + 8² = 36 + 64 = 100' },
        { label: 'Step 2: c = √100', content: '**10 cm**' },
      ],
      answer: '10 cm',
    },
    {
      id: 'tr-02', difficulty: 1,
      question: 'Two angles of a triangle are 50° and 70°. What is the third?',
      steps: [
        { label: 'Step 1: Triangle angles sum to 180°', content: '— ' },
        { label: 'Step 2: 180 − 50 − 70', content: '**60°**' },
      ],
      answer: '60°',
    },
    {
      id: 'tr-03', difficulty: 2,
      question: 'A 13 m ladder leans against a wall with its base 5 m from the wall. How high does it reach?',
      steps: [
        { label: 'Step 1: h² = 13² − 5²', content: '169 − 25 = 144' },
        { label: 'Step 2: h = √144', content: '**12 m**' },
      ],
      answer: '12 m',
      hint: 'The 5-12-13 Pythagorean triple.',
    },
    {
      id: 'tr-04', difficulty: 2,
      question: 'A triangle has sides 7, 24, 25. Is it a right triangle?',
      steps: [
        { label: 'Step 1: Check 7² + 24²', content: '49 + 576 = 625' },
        { label: 'Step 2: 25² = 625 ✓', content: '— ' },
        { label: 'Step 3: Conclusion', content: '**Yes — it is a right triangle.**' },
      ],
      answer: 'Yes, right triangle (7-24-25 triple)',
    },
    {
      id: 'tr-05', difficulty: 3,
      question: 'Use Heron\'s formula to find the area of a triangle with sides **6, 8, 10**.',
      steps: [
        { label: 'Step 1: Semi-perimeter s = (6+8+10)/2', content: '12' },
        { label: 'Step 2: Plug into √[s(s−a)(s−b)(s−c)]', content: '√[12 × 6 × 4 × 2] = √576' },
        { label: 'Step 3: Result', content: '**24 sq units**' },
        { label: 'Cross-check', content: '6² + 8² = 100 = 10² → right triangle. ½ × 6 × 8 = 24 ✓' },
      ],
      answer: '24 sq units',
    },
  ],
};

export const practiceCircles: PracticeSet = {
  title: 'Practice — Circles',
  problems: [
    {
      id: 'cr-01', difficulty: 1,
      question: 'A circle has radius **5 cm**. Find its diameter, circumference, and area.',
      steps: [
        { label: 'Diameter = 2r', content: '10 cm' },
        { label: 'Circumference = 2πr', content: '≈ 31.42 cm' },
        { label: 'Area = πr²', content: '≈ 78.54 cm²' },
      ],
      answer: 'd = 10 cm; C ≈ 31.42 cm; A ≈ 78.54 cm²',
    },
    {
      id: 'cr-02', difficulty: 1,
      question: 'A bicycle wheel has diameter **70 cm**. How far does it travel in **one full rotation**?',
      steps: [
        { label: 'Distance = circumference = π × d', content: 'π × 70 ≈ 219.91 cm' },
        { label: 'Result', content: '**≈ 220 cm = 2.2 m**' },
      ],
      answer: '≈ 2.2 m',
    },
    {
      id: 'cr-03', difficulty: 2,
      question: 'Find the area of a sector of radius **12 cm** with central angle **60°**.',
      steps: [
        { label: 'Step 1: Fraction of full circle: 60°/360° = 1/6', content: '— ' },
        { label: 'Step 2: Full area: π × 12² = 144π', content: '— ' },
        { label: 'Step 3: Sector area: 144π / 6', content: '24π ≈ **75.4 cm²**' },
      ],
      answer: '24π ≈ 75.4 cm²',
    },
    {
      id: 'cr-04', difficulty: 3,
      question: 'A pizza of radius 15 cm is cut into 8 equal slices. Find (a) the arc length (crust) of one slice, and (b) the area of one slice.',
      steps: [
        { label: 'Step 1: Slice angle = 360°/8 = 45° = π/4 radians', content: '— ' },
        { label: 'Step 2: Arc s = r × θ = 15 × π/4', content: '≈ 11.78 cm' },
        { label: 'Step 3: Sector area = ½ r² θ = ½ × 225 × π/4', content: '≈ 88.36 cm²' },
      ],
      answer: 'Arc ≈ 11.78 cm; area ≈ 88.36 cm²',
    },
  ],
};

export const practiceVolumes: PracticeSet = {
  title: 'Practice — Volume and Surface Area',
  problems: [
    {
      id: 'vo-01', difficulty: 1,
      question: 'A cube has side **4 cm**. Find its volume and surface area.',
      steps: [
        { label: 'Volume = s³', content: '4³ = **64 cm³**' },
        { label: 'Surface area = 6 × s²', content: '6 × 16 = **96 cm²**' },
      ],
      answer: 'V = 64 cm³, SA = 96 cm²',
    },
    {
      id: 'vo-02', difficulty: 2,
      question: 'A cylindrical water tank has radius **0.3 m** and height **1 m**. How many litres does it hold?',
      steps: [
        { label: 'Step 1: V = πr²h = π × 0.09 × 1', content: '≈ 0.283 m³' },
        { label: 'Step 2: 1 m³ = 1000 L', content: '**≈ 283 L**' },
      ],
      answer: '≈ 283 L',
    },
    {
      id: 'vo-03', difficulty: 2,
      question: 'A sphere has radius **6 cm**. Find its volume.',
      steps: [
        { label: 'V = (4/3)πr³', content: '(4/3) × π × 216' },
        { label: 'Compute', content: '≈ **904.78 cm³**' },
      ],
      answer: '≈ 904.78 cm³',
    },
    {
      id: 'vo-04', difficulty: 3,
      question: 'A grain silo is a cylinder (r = 2 m, h = 5 m) topped by a hemisphere (r = 2 m). What is the **total volume**?',
      steps: [
        { label: 'Step 1: Cylinder = πr²h = π × 4 × 5', content: '20π ≈ 62.83 m³' },
        { label: 'Step 2: Hemisphere = (2/3)πr³ = (2/3)π × 8', content: '(16/3)π ≈ 16.76 m³' },
        { label: 'Step 3: Total', content: '**≈ 79.59 m³**' },
      ],
      answer: '≈ 79.59 m³',
    },
  ],
};

export const practiceTransformations: PracticeSet = {
  title: 'Practice — Transformations',
  problems: [
    {
      id: 'tx-01', difficulty: 1,
      question: 'Reflect the point **(3, 4)** across the **x-axis**.',
      steps: [
        { label: 'Rule: (x, y) → (x, −y)', content: '— ' },
        { label: 'Result', content: '**(3, −4)**' },
      ],
      answer: '(3, −4)',
    },
    {
      id: 'tx-02', difficulty: 1,
      question: 'A square has rotational symmetry of what order?',
      steps: [
        { label: 'Look for distinct rotations < 360° leaving it unchanged', content: '90°, 180°, 270°, 360° — 4 of them' },
        { label: 'Order', content: '**4**' },
      ],
      answer: '4',
    },
    {
      id: 'tx-03', difficulty: 2,
      question: 'Translate the triangle with vertices (1,1), (3,1), (2,4) by **(+2, −3)**. Give the new vertices.',
      steps: [
        { label: 'Add (2, −3) to each vertex', content: '(3, −2), (5, −2), (4, 1)' },
        { label: 'Result', content: '**(3, −2), (5, −2), (4, 1)**' },
      ],
      answer: '(3, −2), (5, −2), (4, 1)',
    },
    {
      id: 'tx-04', difficulty: 2,
      question: 'Rotate the point **(2, 0)** by **90° counterclockwise** about the origin.',
      steps: [
        { label: 'Rule: (x, y) → (−y, x)', content: '— ' },
        { label: 'Apply: (2, 0) → (−0, 2)', content: '**(0, 2)**' },
      ],
      answer: '(0, 2)',
    },
    {
      id: 'tx-05', difficulty: 3,
      question: 'A regular hexagon has what order of rotational symmetry, and how many lines of mirror symmetry?',
      steps: [
        { label: 'Step 1: Rotations: 60°, 120°, 180°, 240°, 300°, 360°', content: '6 rotations → **order 6**' },
        { label: 'Step 2: Mirror lines: 3 through opposite vertices + 3 through opposite edge midpoints', content: '**6 mirror lines**' },
        { label: 'Step 3: Total symmetries', content: '6 + 6 = 12 (the dihedral group D₆)' },
      ],
      answer: 'Order 6; 6 mirror lines (D₆ has 12 symmetries)',
    },
  ],
};
