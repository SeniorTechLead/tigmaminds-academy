// ============================================================
// PRACTICE PROBLEMS — Algebra
// ============================================================
import type { PracticeSet } from './reference';

export const practiceVariables: PracticeSet = {
  title: 'Practice — Variables and Expressions',
  problems: [
    {
      id: 'av-01', difficulty: 1,
      question: 'Evaluate **3x + 2** when **x = 4**.',
      steps: [
        { label: 'Step 1: Substitute', content: '3(4) + 2' },
        { label: 'Step 2: Compute', content: '12 + 2 = **14**' },
      ],
      answer: '14',
    },
    {
      id: 'av-02', difficulty: 1,
      question: 'Evaluate **5x − 7** when **x = 3**.',
      steps: [
        { label: 'Step 1: Substitute', content: '5(3) − 7' },
        { label: 'Step 2: Compute', content: '15 − 7 = **8**' },
      ],
      answer: '8',
    },
    {
      id: 'av-03', difficulty: 2,
      question: 'Simplify by combining like terms: **4x + 3 − 2x + 7**.',
      steps: [
        { label: 'Step 1: Group like terms', content: '(4x − 2x) + (3 + 7)' },
        { label: 'Step 2: Combine', content: '**2x + 10**' },
      ],
      answer: '2x + 10',
    },
    {
      id: 'av-04', difficulty: 2,
      question: 'Evaluate **2(3x − 1)² + 5** when **x = 2**.',
      steps: [
        { label: 'Step 1: Inside parentheses', content: '3(2) − 1 = 5' },
        { label: 'Step 2: Square', content: '5² = 25' },
        { label: 'Step 3: Multiply', content: '2 × 25 = 50' },
        { label: 'Step 4: Add', content: '50 + 5 = **55**' },
      ],
      answer: '55',
      hint: 'Follow PEMDAS strictly: parentheses, then exponents, then multiplication, then addition.',
    },
    {
      id: 'av-05', difficulty: 3,
      question: 'Expand and simplify **(x + 3)(x − 5)**.',
      steps: [
        { label: 'Step 1: FOIL', content: 'x·x + x·(−5) + 3·x + 3·(−5)' },
        { label: 'Step 2: Multiply', content: 'x² − 5x + 3x − 15' },
        { label: 'Step 3: Combine like terms', content: '**x² − 2x − 15**' },
      ],
      answer: 'x² − 2x − 15',
    },
  ],
};

export const practiceLinearEquations: PracticeSet = {
  title: 'Practice — Linear Equations',
  problems: [
    {
      id: 'le-01', difficulty: 1,
      question: 'Solve: **x + 7 = 12**.',
      steps: [
        { label: 'Subtract 7 from both sides', content: 'x = 12 − 7 = **5**' },
      ],
      answer: '5',
    },
    {
      id: 'le-02', difficulty: 1,
      question: 'Solve: **3x = 21**.',
      steps: [
        { label: 'Divide both sides by 3', content: 'x = 21 / 3 = **7**' },
      ],
      answer: '7',
    },
    {
      id: 'le-03', difficulty: 2,
      question: 'Solve: **2x + 5 = 17**.',
      steps: [
        { label: 'Step 1: Subtract 5', content: '2x = 12' },
        { label: 'Step 2: Divide by 2', content: 'x = **6**' },
      ],
      answer: '6',
    },
    {
      id: 'le-04', difficulty: 2,
      question: 'Solve: **3(x − 4) = 2x + 1**.',
      steps: [
        { label: 'Step 1: Distribute', content: '3x − 12 = 2x + 1' },
        { label: 'Step 2: Subtract 2x', content: 'x − 12 = 1' },
        { label: 'Step 3: Add 12', content: 'x = **13**' },
      ],
      answer: '13',
    },
    {
      id: 'le-05', difficulty: 3,
      question: 'Solve the system: **x + y = 7** and **x − y = 3**.',
      steps: [
        { label: 'Step 1: Add the two equations', content: '2x = 10 → x = 5' },
        { label: 'Step 2: Substitute back', content: '5 + y = 7 → y = 2' },
        { label: 'Result', content: '**(x, y) = (5, 2)**' },
      ],
      answer: '(x, y) = (5, 2)',
    },
  ],
};

export const practiceInequalities: PracticeSet = {
  title: 'Practice — Inequalities',
  problems: [
    {
      id: 'in-01', difficulty: 1,
      question: 'Solve: **x + 4 > 9**.',
      steps: [
        { label: 'Subtract 4 from both sides', content: '**x > 5**' },
      ],
      answer: 'x > 5',
    },
    {
      id: 'in-02', difficulty: 2,
      question: 'Solve: **−2x ≤ 8**.',
      steps: [
        { label: 'Step 1: Divide by −2', content: '— ' },
        { label: 'Step 2: FLIP the inequality (negative divisor!)', content: '**x ≥ −4**' },
      ],
      answer: 'x ≥ −4',
      hint: 'Multiplying or dividing by a negative reverses the inequality.',
    },
    {
      id: 'in-03', difficulty: 2,
      question: 'Tara has ₹100. Each notebook costs ₹25. How many notebooks can she buy at most?',
      steps: [
        { label: 'Step 1: Set up the inequality', content: '25n ≤ 100' },
        { label: 'Step 2: Divide by 25', content: 'n ≤ 4' },
        { label: 'Step 3: Whole notebooks only', content: '**At most 4 notebooks**' },
      ],
      answer: 'At most 4',
    },
    {
      id: 'in-04', difficulty: 3,
      question: 'Solve: **|2x − 3| > 7**.',
      steps: [
        { label: 'Step 1: Two cases for absolute value', content: 'Either 2x − 3 > 7 OR 2x − 3 < −7' },
        { label: 'Step 2: Case 1: 2x > 10', content: 'x > 5' },
        { label: 'Step 3: Case 2: 2x < −4', content: 'x < −2' },
        { label: 'Step 4: Combined', content: '**x > 5 or x < −2**' },
      ],
      answer: 'x > 5 or x < −2',
    },
  ],
};

export const practiceCoordinatePlane: PracticeSet = {
  title: 'Practice — The Coordinate Plane',
  problems: [
    {
      id: 'cp-01', difficulty: 1,
      question: 'Which quadrant contains the point **(−2, 5)**?',
      steps: [
        { label: 'Step 1: x is negative, y is positive', content: 'Upper-left' },
        { label: 'Step 2: That\'s Quadrant', content: '**II**' },
      ],
      answer: 'Quadrant II',
    },
    {
      id: 'cp-02', difficulty: 1,
      question: 'Find the distance between **(1, 2)** and **(4, 6)**.',
      steps: [
        { label: 'Step 1: d = √((4−1)² + (6−2)²)', content: '√(9 + 16)' },
        { label: 'Step 2: √25', content: '**5**' },
      ],
      answer: '5',
    },
    {
      id: 'cp-03', difficulty: 2,
      question: 'Find the midpoint of **(−2, 4)** and **(6, −2)**.',
      steps: [
        { label: 'Average x', content: '(−2 + 6)/2 = 2' },
        { label: 'Average y', content: '(4 + (−2))/2 = 1' },
        { label: 'Midpoint', content: '**(2, 1)**' },
      ],
      answer: '(2, 1)',
    },
  ],
};

export const practiceLinearGraphs: PracticeSet = {
  title: 'Practice — Linear Graphs',
  problems: [
    {
      id: 'lg-01', difficulty: 1,
      question: 'For the line **y = 3x − 4**, what is the slope and what is the y-intercept?',
      steps: [
        { label: 'Compare to y = mx + b', content: '— ' },
        { label: 'Read off', content: 'Slope **m = 3**, y-intercept **b = −4**' },
      ],
      answer: 'Slope 3, y-intercept −4',
    },
    {
      id: 'lg-02', difficulty: 1,
      question: 'A tea stall charges ₹15 per cup. Write an equation for total cost y in terms of cups x.',
      steps: [
        { label: 'Each cup adds ₹15', content: '— ' },
        { label: 'Equation', content: '**y = 15x**' },
      ],
      answer: 'y = 15x',
    },
    {
      id: 'lg-03', difficulty: 2,
      question: 'Find the equation of the line passing through **(0, 5)** with slope **2**.',
      steps: [
        { label: 'y-intercept = 5 (the y-value when x = 0)', content: '— ' },
        { label: 'y = mx + b → y = 2x + 5', content: '**y = 2x + 5**' },
      ],
      answer: 'y = 2x + 5',
    },
    {
      id: 'lg-04', difficulty: 3,
      question: 'A taxi charges a base fare of ₹50 plus ₹15 per km. Write the cost equation, and find the cost for a 12 km ride.',
      steps: [
        { label: 'Step 1: Base fare = b = 50, per km = m = 15', content: '— ' },
        { label: 'Step 2: Equation', content: 'y = 15x + 50' },
        { label: 'Step 3: For x = 12', content: 'y = 15 × 12 + 50 = 180 + 50 = **₹230**' },
      ],
      answer: 'y = 15x + 50; cost = ₹230',
    },
  ],
};
