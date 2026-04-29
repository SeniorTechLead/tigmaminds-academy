// ============================================================
// PRACTICE PROBLEMS — Patterns in Nature
// ============================================================
import type { PracticeSet } from './reference';

export const practiceFibonacci: PracticeSet = {
  title: 'Practice — Fibonacci & Golden Ratio',
  problems: [
    {
      id: 'fb-01', difficulty: 1,
      question: 'Write out the first **10** Fibonacci numbers (starting F₁ = 0, F₂ = 1).',
      steps: [
        { label: 'Step 1: Apply F(n) = F(n-1) + F(n-2)', content: '0, 1, then 1, 2, 3, 5, 8, 13, 21, 34' },
        { label: 'Step 2: First 10', content: '**0, 1, 1, 2, 3, 5, 8, 13, 21, 34**' },
      ],
      answer: '0, 1, 1, 2, 3, 5, 8, 13, 21, 34',
    },
    {
      id: 'fb-02', difficulty: 1,
      question: 'A flower has **8 petals**. Is 8 a Fibonacci number? Which other low Fibonacci numbers might petal counts have?',
      steps: [
        { label: 'Step 1: Is 8 in the list?', content: 'Fibonacci sequence: 1, 1, 2, 3, 5, 8 — yes, 8 is the 6th Fibonacci number' },
        { label: 'Step 2: Other common petal counts', content: '**3, 5, 8, 13, 21, 34, 55** are all common in flowers' },
      ],
      answer: 'Yes; 3, 5, 8, 13, 21, 34, 55 are typical',
    },
    {
      id: 'fb-03', difficulty: 2,
      question: 'Compute F(15) using the Fibonacci recurrence.',
      steps: [
        { label: 'Step 1: Build up', content: '...F(11) = 55, F(12) = 89, F(13) = 144, F(14) = 233, F(15) = 144 + 233 = 377' },
        { label: 'Step 2: F(15)', content: '**377**' },
      ],
      answer: '377',
      code: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n# What is fib(15)?\n',
      codeSolution: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\nprint(fib(15))',
    },
    {
      id: 'fb-04', difficulty: 2,
      question: 'Compute the ratio **F(13) / F(12)**. How close is it to φ ≈ 1.6180?',
      steps: [
        { label: 'Step 1: F(13) and F(12)', content: 'F(13) = 144, F(12) = 89' },
        { label: 'Step 2: Ratio', content: '144 / 89 ≈ 1.6180' },
        { label: 'Step 3: Difference from φ', content: 'Off by less than 0.0001 — essentially exact at 4 decimal places' },
      ],
      answer: '≈ 1.6180 (matches φ to 4 decimals)',
    },
    {
      id: 'fb-05', difficulty: 3,
      question: 'Use Binet\'s formula F(n) = (φⁿ − ψⁿ) / √5 (where ψ = (1−√5)/2 ≈ −0.618) to estimate F(20). Round to the nearest integer.',
      steps: [
        { label: 'Step 1: φ²⁰', content: '1.618²⁰ ≈ 15,127' },
        { label: 'Step 2: ψ²⁰', content: '(−0.618)²⁰ ≈ 0.0000656 — negligible' },
        { label: 'Step 3: Divide by √5', content: '15,127 / 2.236 ≈ **6,765**' },
        { label: 'Step 4: Verify', content: 'F(20) = 6765 ✓' },
      ],
      answer: '6,765',
    },
  ],
};

export const practiceTessellations: PracticeSet = {
  title: 'Practice — Tessellations',
  problems: [
    {
      id: 'ts-01', difficulty: 1,
      question: 'Three regular polygons tessellate. Which **three**?',
      steps: [
        { label: 'Step 1: Each must have 360° divisible by its interior angle', content: 'Triangle 60°: 360/60 = 6 ✓. Square 90°: 360/90 = 4 ✓. Pentagon 108°: 360/108 = 3.33 ✗. Hexagon 120°: 360/120 = 3 ✓.' },
        { label: 'Step 2: List', content: '**Equilateral triangle, square, regular hexagon**' },
      ],
      answer: 'Triangle, square, hexagon',
    },
    {
      id: 'ts-02', difficulty: 2,
      question: 'A regular polygon has interior angle **140°**. How many sides does it have, and does it tessellate?',
      steps: [
        { label: 'Step 1: Angle formula', content: '(n−2) × 180° / n = 140° → n = 9 (nonagon)' },
        { label: 'Step 2: 360 / 140', content: '= 2.57 — not a whole number' },
        { label: 'Step 3: Tessellate?', content: '**Nonagons do not tessellate.**' },
      ],
      answer: 'Nonagon (9 sides); no tessellation',
    },
    {
      id: 'ts-03', difficulty: 2,
      question: 'In a tessellation of triangles, squares and hexagons meeting at a single vertex (3, 4, 6, 4 configuration), do the angles sum to 360°?',
      steps: [
        { label: 'Step 1: Add the angles', content: '60° + 90° + 120° + 90° = 360° ✓' },
        { label: 'Step 2: Conclude', content: '**Yes — this is a valid semi-regular tessellation.**' },
      ],
      answer: 'Yes — sums to exactly 360°',
    },
    {
      id: 'ts-04', difficulty: 3,
      question: 'Bees use hexagons. Compare the **perimeter** to enclose 1 m² of area for a hexagon vs a square. Which uses less wax, and by how much?',
      steps: [
        { label: 'Step 1: Square — side = 1 m', content: 'Perimeter = 4 m' },
        { label: 'Step 2: Hexagon — area = (3√3/2)·s² = 1 → s = √(2 / (3√3)) ≈ 0.620 m', content: 'Perimeter = 6 × 0.620 = 3.72 m' },
        { label: 'Step 3: Saving', content: '4 − 3.72 = 0.28 m, or **7%** less perimeter' },
      ],
      answer: 'Hexagon saves ~7% of wax',
    },
  ],
};

export const practiceFractals: PracticeSet = {
  title: 'Practice — Fractals',
  problems: [
    {
      id: 'fr-01', difficulty: 1,
      question: 'In one sentence, what is **self-similarity**?',
      steps: [
        { label: 'Definition', content: 'A pattern looks like itself when you zoom in or out.' },
      ],
      answer: 'A pattern that looks like itself at every scale',
    },
    {
      id: 'fr-02', difficulty: 2,
      question: 'For the **Koch snowflake**: each segment is replaced by 4 segments, each 1/3 the length. Compute the fractal dimension D.',
      steps: [
        { label: 'Step 1: D = log(N) / log(s)', content: 'where N = number of copies, s = scale factor' },
        { label: 'Step 2: N = 4, s = 3', content: 'D = log 4 / log 3' },
        { label: 'Step 3: Compute', content: 'D ≈ 1.386 / 1.099 = **≈ 1.262**' },
      ],
      answer: '≈ 1.262',
    },
    {
      id: 'fr-03', difficulty: 2,
      question: 'For the **Sierpinski triangle**: each triangle is replaced by 3 triangles, each 1/2 the size. Compute D.',
      steps: [
        { label: 'Step 1: N = 3, s = 2', content: 'D = log 3 / log 2' },
        { label: 'Step 2: Compute', content: 'D ≈ 1.585' },
      ],
      answer: '≈ 1.585',
    },
    {
      id: 'fr-04', difficulty: 3,
      question: 'Why are fractal antennas useful in mobile phones?',
      steps: [
        { label: 'Reason', content: 'A fractal\'s self-similar structure resonates at multiple wavelengths simultaneously, so one antenna handles multiple frequency bands (4G, Wi-Fi, GPS, Bluetooth) without needing separate antennas.' },
      ],
      answer: 'Multi-band reception in a single element',
    },
  ],
};

export const practiceSymmetry: PracticeSet = {
  title: 'Practice — Symmetry',
  problems: [
    {
      id: 'sy-01', difficulty: 1,
      question: 'A starfish has **5-fold radial symmetry**. How many distinct rotation angles map it onto itself?',
      steps: [
        { label: 'Step 1: 5-fold means 5 rotations', content: 'including the identity (0°)' },
        { label: 'Step 2: Angles', content: '0°, 72°, 144°, 216°, 288° — **5 angles**' },
      ],
      answer: '5 (including 0°)',
    },
    {
      id: 'sy-02', difficulty: 1,
      question: 'A regular hexagon (snowflake) has the symmetry group **D₆**. How many total symmetry operations does it have?',
      steps: [
        { label: 'Step 1: D₆ = 6 rotations + 6 reflections', content: '— ' },
        { label: 'Step 2: Total', content: '**12 operations**' },
      ],
      answer: '12',
    },
    {
      id: 'sy-03', difficulty: 2,
      question: 'Why do most moving animals have **bilateral** symmetry rather than radial?',
      steps: [
        { label: 'Reason', content: 'Forward motion creates a meaningful front-back axis; bilateral symmetry gives balanced left/right pairs of eyes, ears, and limbs for stable, coordinated movement. Radial symmetry suits sit-and-wait predators with no defined "front."' },
      ],
      answer: 'Bilateral suits forward motion; radial suits stationary feeders',
    },
    {
      id: 'sy-04', difficulty: 3,
      question: '**Noether\'s theorem** says every continuous symmetry corresponds to a conservation law. What conservation law does **time-translation** symmetry give?',
      steps: [
        { label: 'Step 1: Time-translation symmetry', content: 'Laws of physics are the same yesterday, today, tomorrow' },
        { label: 'Step 2: Corresponding conserved quantity', content: '**Energy**' },
      ],
      answer: 'Conservation of energy',
    },
  ],
};
