// ============================================================
// PRACTICE PROBLEMS — Coordinate Geometry
// ============================================================
import type { PracticeSet } from './reference';

export const practiceDistance: PracticeSet = {
  title: 'Practice — Distance Between Two Points',
  problems: [
    {
      id: 'cd-01', difficulty: 1,
      question: 'Find the distance between **(0, 0)** and **(3, 4)**.',
      steps: [
        { label: 'Step 1: Δx = 3, Δy = 4', content: '— ' },
        { label: 'Step 2: d = √(3² + 4²) = √25', content: '**d = 5**' },
      ],
      answer: '5',
    },
    {
      id: 'cd-02', difficulty: 1,
      question: 'Find the distance between **(2, 1)** and **(5, 5)**.',
      steps: [
        { label: 'Step 1: Δx = 3, Δy = 4', content: '— ' },
        { label: 'Step 2: d = √(9 + 16) = √25', content: '**d = 5**' },
      ],
      answer: '5',
    },
    {
      id: 'cd-03', difficulty: 2,
      question: 'A drone is at **(10, 20, 5)** metres. Its target is at **(13, 24, 11)**. How far is the target?',
      steps: [
        { label: 'Step 1: Δx = 3, Δy = 4, Δz = 6', content: '— ' },
        { label: 'Step 2: d = √(9 + 16 + 36)', content: '√61 ≈ **7.81 m**' },
      ],
      answer: '≈ 7.81 m',
      code: 'import math\np1 = (10, 20, 5)\np2 = (13, 24, 11)\n# Compute 3D distance\n',
      codeSolution: 'import math\np1 = (10, 20, 5)\np2 = (13, 24, 11)\nd = math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\nprint(f"d = {d:.2f} m")',
    },
    {
      id: 'cd-04', difficulty: 2,
      question: 'A boat at **(−2, 3)** travels to **(6, 9)** in a straight line. How many units did it travel?',
      steps: [
        { label: 'Step 1: Δx = 6 − (−2) = 8, Δy = 9 − 3 = 6', content: '— ' },
        { label: 'Step 2: d = √(64 + 36)', content: '√100 = **10**' },
      ],
      answer: '10',
    },
    {
      id: 'cd-05', difficulty: 3,
      question: 'Three points A(1, 2), B(4, 6), C(8, 9). Which two are closest?',
      steps: [
        { label: 'Step 1: AB', content: '√(9+16) = √25 = 5' },
        { label: 'Step 2: BC', content: '√(16+9) = √25 = 5' },
        { label: 'Step 3: AC', content: '√(49+49) = √98 ≈ 9.9' },
        { label: 'Step 4: A-B and B-C are tied at 5', content: '**A and B (or B and C) — both 5 units apart**' },
      ],
      answer: 'A↔B and B↔C are both 5; A↔C is 9.9',
    },
  ],
};

export const practiceMidpointSlope: PracticeSet = {
  title: 'Practice — Midpoint and Slope',
  problems: [
    {
      id: 'cms-01', difficulty: 1,
      question: 'Find the midpoint of **(2, 4)** and **(8, 10)**.',
      steps: [
        { label: 'Step 1: Average x: (2+8)/2', content: '5' },
        { label: 'Step 2: Average y: (4+10)/2', content: '7' },
        { label: 'Step 3: Midpoint', content: '**(5, 7)**' },
      ],
      answer: '(5, 7)',
    },
    {
      id: 'cms-02', difficulty: 1,
      question: 'Find the slope of the line through **(1, 2)** and **(5, 10)**.',
      steps: [
        { label: 'Step 1: rise = 10 − 2 = 8', content: '— ' },
        { label: 'Step 2: run = 5 − 1 = 4', content: '— ' },
        { label: 'Step 3: m = 8/4', content: '**m = 2**' },
      ],
      answer: '2',
    },
    {
      id: 'cms-03', difficulty: 2,
      question: 'A line has slope **3**. What is the slope of any line **perpendicular** to it?',
      steps: [
        { label: 'Step 1: Perpendicular slopes multiply to −1', content: '— ' },
        { label: 'Step 2: m₂ = −1/m₁ = −1/3', content: '**−1/3**' },
      ],
      answer: '−1/3',
    },
    {
      id: 'cms-04', difficulty: 2,
      question: 'Are the lines through **(1, 2)–(4, 8)** and **(3, 1)–(0, 7)** parallel, perpendicular, or neither?',
      steps: [
        { label: 'Step 1: Slope 1: (8−2)/(4−1) = 6/3 = 2', content: '— ' },
        { label: 'Step 2: Slope 2: (7−1)/(0−3) = 6/(−3) = −2', content: '— ' },
        { label: 'Step 3: 2 × (−2) = −4 ≠ −1; 2 ≠ −2', content: '**Neither**' },
      ],
      answer: 'Neither',
    },
    {
      id: 'cms-05', difficulty: 3,
      question: 'A bridge between two villages is being built. Village A is at (3, 7) and Village B is at (11, 19). Find (a) the location of the central pillar (midpoint), and (b) the bridge\'s slope.',
      steps: [
        { label: 'Step 1: Midpoint', content: '((3+11)/2, (7+19)/2) = (7, 13)' },
        { label: 'Step 2: Slope', content: '(19−7)/(11−3) = 12/8 = 1.5' },
        { label: 'Step 3: Both', content: '**Pillar at (7, 13); slope = 1.5**' },
      ],
      answer: 'Midpoint (7, 13); slope 1.5',
    },
  ],
};

export const practiceLineEquation: PracticeSet = {
  title: 'Practice — Equation of a Line',
  problems: [
    {
      id: 'cl-01', difficulty: 1,
      question: 'Write the equation of the line with slope **2** and y-intercept **5**.',
      steps: [
        { label: 'Use slope-intercept form y = mx + b', content: '— ' },
        { label: 'Plug in m = 2, b = 5', content: '**y = 2x + 5**' },
      ],
      answer: 'y = 2x + 5',
    },
    {
      id: 'cl-02', difficulty: 1,
      question: 'Where does the line **y = 3x − 6** cross the x-axis?',
      steps: [
        { label: 'Step 1: x-axis means y = 0', content: '0 = 3x − 6' },
        { label: 'Step 2: Solve', content: '3x = 6 → x = 2' },
        { label: 'Step 3: Point', content: '**(2, 0)**' },
      ],
      answer: '(2, 0)',
    },
    {
      id: 'cl-03', difficulty: 2,
      question: 'Find the equation of the line passing through **(1, 4)** and **(5, 12)**.',
      steps: [
        { label: 'Step 1: Slope = (12−4)/(5−1) = 8/4 = 2', content: '— ' },
        { label: 'Step 2: Use point-slope through (1, 4)', content: 'y − 4 = 2(x − 1)' },
        { label: 'Step 3: Simplify', content: 'y = 2x + 2' },
      ],
      answer: 'y = 2x + 2',
    },
    {
      id: 'cl-04', difficulty: 2,
      question: 'Where do the lines **y = 2x + 1** and **y = −x + 7** intersect?',
      steps: [
        { label: 'Step 1: Set equal', content: '2x + 1 = −x + 7' },
        { label: 'Step 2: Solve', content: '3x = 6 → x = 2' },
        { label: 'Step 3: Substitute', content: 'y = 2(2) + 1 = 5' },
        { label: 'Step 4: Intersection', content: '**(2, 5)**' },
      ],
      answer: '(2, 5)',
    },
    {
      id: 'cl-05', difficulty: 3,
      question: 'A bus leaves Guwahati at 9 AM at 50 km/h east. A car leaves the same place at 10 AM at 80 km/h east. When does the car overtake the bus?',
      steps: [
        { label: 'Step 1: Bus distance at time t (hours past 9 AM)', content: '50t' },
        { label: 'Step 2: Car distance at time t', content: '80(t − 1) (since it left 1 h later)' },
        { label: 'Step 3: Set equal', content: '50t = 80t − 80' },
        { label: 'Step 4: Solve', content: '30t = 80 → t ≈ 2.67 h after 9 AM = **11:40 AM**' },
        { label: 'Step 5: Distance', content: '50 × 2.67 ≈ 133.3 km from Guwahati' },
      ],
      answer: '~11:40 AM, ~133 km east of Guwahati',
    },
  ],
};

export const practiceConics: PracticeSet = {
  title: 'Practice — Conic Sections',
  problems: [
    {
      id: 'cc-01', difficulty: 1,
      question: 'Identify the conic: **x² + y² = 25**.',
      steps: [
        { label: 'Step 1: Form x² + y² = r²', content: '— ' },
        { label: 'Step 2: r² = 25 → r = 5', content: '**Circle of radius 5 centred at the origin**' },
      ],
      answer: 'Circle, radius 5',
    },
    {
      id: 'cc-02', difficulty: 1,
      question: 'Identify the conic: **y = x²**.',
      steps: [
        { label: 'Quadratic in x, linear in y', content: '**Parabola** opening upward' },
      ],
      answer: 'Parabola',
    },
    {
      id: 'cc-03', difficulty: 2,
      question: 'A planet has orbital eccentricity **0.4**. Is the orbit a circle, ellipse, parabola, or hyperbola?',
      steps: [
        { label: '0 < e < 1 → ellipse', content: 'Eccentricity 0.4 is between 0 and 1 → **ellipse**' },
      ],
      answer: 'Ellipse (moderately elongated)',
    },
    {
      id: 'cc-04', difficulty: 2,
      question: 'A satellite dish has cross-section y = x²/12. Where is the focus?',
      steps: [
        { label: 'Step 1: Compare to y = x² / (4p)', content: '4p = 12 → p = 3' },
        { label: 'Step 2: Focus at (0, p)', content: '**(0, 3)** — 3 units above the dish vertex' },
      ],
      answer: '(0, 3)',
    },
    {
      id: 'cc-05', difficulty: 3,
      question: 'A cricket ball is thrown at 20 m/s at 45° above horizontal. Take g = 10 m/s². Find (a) max height and (b) horizontal range. (Assume no air resistance.)',
      steps: [
        { label: 'Step 1: Vertical velocity', content: 'v_y = 20 sin 45° = 20·(√2/2) ≈ 14.14 m/s' },
        { label: 'Step 2: Time to peak', content: 't = v_y / g = 14.14 / 10 = 1.414 s' },
        { label: 'Step 3: Max height', content: 'h = v_y · t − ½gt² = 14.14 × 1.414 − 5 × 2 = 20 − 10 = **10 m** (the simple form is v_y² / (2g) = 200/20 = 10 m)' },
        { label: 'Step 4: Horizontal range', content: 'R = v² sin(2θ) / g = 400 sin 90° / 10 = **40 m**' },
      ],
      answer: 'Peak ≈ 10 m, range = 40 m',
      hint: 'A projectile traces a parabola; quadratic equations describe both height and horizontal motion.',
    },
  ],
};
