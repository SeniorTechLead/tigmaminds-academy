// ============================================================
// PRACTICE PROBLEMS — Number Theory & Sequences
// 5 sets matching the 5 sections of the guide.
// ============================================================

import type { PracticeSet } from './reference';

// ─── 1. Factors and Multiples ──────────────────────────────

export const practiceFactorsMultiples: PracticeSet = {
  title: 'Practice — Factors and Multiples',
  problems: [
    {
      id: 'fm-01', difficulty: 1,
      question: 'List all the factors of **18**.',
      steps: [
        { label: 'Step 1: Test each integer from 1 up to 18', content: 'Which divide 18 evenly?' },
        { label: 'Step 2: List them', content: '1 (yes), 2 (yes), 3 (yes), 6 (yes), 9 (yes), 18 (yes); 4, 5, 7, 8, 10–17 → no.' },
        { label: 'Step 3: Final', content: 'Factors of 18: **1, 2, 3, 6, 9, 18**' },
      ],
      answer: '1, 2, 3, 6, 9, 18',
      code: 'n = 18\n# Print all factors of n\n',
      codeSolution: 'n = 18\nfactors = [d for d in range(1, n + 1) if n % d == 0]\nprint(factors)',
    },
    {
      id: 'fm-02', difficulty: 1,
      question: 'Find the **prime factorisation** of **84**.',
      steps: [
        { label: 'Step 1: Divide by 2 repeatedly', content: '84 = 2 × 42 = 2 × 2 × 21' },
        { label: 'Step 2: 21 is divisible by 3', content: '21 = 3 × 7' },
        { label: 'Step 3: 7 is prime — done', content: '**84 = 2² × 3 × 7**' },
      ],
      answer: '2² × 3 × 7',
    },
    {
      id: 'fm-03', difficulty: 1,
      question: 'How many factors does **72** have? (Don\'t list them — use the prime-factorisation rule.)',
      steps: [
        { label: 'Step 1: Prime factorisation', content: '72 = 2³ × 3²' },
        { label: 'Step 2: Apply (a+1)(b+1)... rule', content: '(3+1)(2+1) = 4 × 3' },
        { label: 'Step 3: Total', content: '**12 factors**' },
      ],
      answer: '12',
    },
    {
      id: 'fm-04', difficulty: 2,
      question: 'List the first 5 multiples of **15**, then the first 5 multiples of **25**. What is the smallest number that appears in both lists?',
      steps: [
        { label: 'Step 1: Multiples of 15', content: '15, 30, 45, 60, 75' },
        { label: 'Step 2: Multiples of 25', content: '25, 50, 75, 100, 125' },
        { label: 'Step 3: First common', content: '**75** (appears in both)' },
      ],
      answer: '75',
      hint: '75 is LCM(15, 25). The first overlap of two multiple lists IS the LCM.',
    },
    {
      id: 'fm-05', difficulty: 2,
      question: 'A 36 m × 24 m field is being divided into the largest possible identical **square** plots, with no leftover. What is the side length of each plot, and how many plots fit?',
      steps: [
        { label: 'Step 1: The side must divide both 36 and 24', content: 'It is a common factor of 36 and 24.' },
        { label: 'Step 2: Largest common factor', content: 'Factors of 36: 1, 2, 3, 4, 6, **12**, 18, 36. Factors of 24: 1, 2, 3, 4, 6, 8, **12**, 24. GCD = 12.' },
        { label: 'Step 3: Plots fit', content: '(36/12) × (24/12) = 3 × 2 = **6 plots of 12 × 12 m**' },
      ],
      answer: '12 m sides, 6 plots',
    },
    {
      id: 'fm-06', difficulty: 3,
      question: 'A number n has prime factorisation **n = 2⁴ × 3² × 5 × 7**. How many factors does n have, and what is their **sum**?',
      steps: [
        { label: 'Step 1: Number of factors', content: '(4+1)(2+1)(1+1)(1+1) = 5 × 3 × 2 × 2 = **60**' },
        { label: 'Step 2: Sum of factors using product expansion', content: '(1+2+4+8+16)(1+3+9)(1+5)(1+7) = 31 × 13 × 6 × 8' },
        { label: 'Step 3: Compute', content: '31 × 13 = 403; 403 × 6 = 2418; 2418 × 8 = **19,344**' },
      ],
      answer: '60 factors, sum = 19,344',
      hint: 'The sum-of-factors formula uses the same prime-factorisation expansion as the count.',
    },
  ],
};

// ─── 2. Prime Numbers ───────────────────────────────────────

export const practicePrimes: PracticeSet = {
  title: 'Practice — Prime Numbers',
  problems: [
    {
      id: 'pr-01', difficulty: 1,
      question: 'Which of these are prime? **9, 11, 15, 23, 27, 29**',
      steps: [
        { label: 'Step 1: Check each', content: '9 = 3 × 3 (no). 11 (yes). 15 = 3 × 5 (no). 23 (yes). 27 = 3³ (no). 29 (yes).' },
        { label: 'Step 2: Final', content: 'Primes: **11, 23, 29**' },
      ],
      answer: '11, 23, 29',
    },
    {
      id: 'pr-02', difficulty: 1,
      question: 'Why is **2** the only even prime?',
      steps: [
        { label: 'Reason', content: 'Every even number > 2 has 2 as a factor *in addition to* 1 and itself, so it has more than two factors and cannot be prime. 2 is the only even number that escapes — it has just 1 and 2 as factors.' },
      ],
      answer: 'Every other even number is divisible by 2, so it has at least three factors (1, 2, itself).',
    },
    {
      id: 'pr-03', difficulty: 2,
      question: 'Use the divisibility-test idea: to check if **97** is prime, you only need to test prime divisors up to **√97**. What primes do you actually need to test, and is 97 prime?',
      steps: [
        { label: 'Step 1: √97 ≈ 9.85', content: 'So test primes ≤ 9: **2, 3, 5, 7**' },
        { label: 'Step 2: 97 ÷ 2', content: '97 is odd — no' },
        { label: 'Step 3: 97 ÷ 3', content: 'Digit sum 9+7 = 16, not divisible by 3 — no' },
        { label: 'Step 4: 97 ÷ 5', content: 'Doesn\'t end in 0 or 5 — no' },
        { label: 'Step 5: 97 ÷ 7', content: '7 × 13 = 91, 7 × 14 = 98 — no' },
        { label: 'Step 6: Conclusion', content: '**97 is prime** ✓' },
      ],
      answer: '97 is prime; only need to test 2, 3, 5, 7.',
    },
    {
      id: 'pr-04', difficulty: 2,
      question: 'How many primes are there between **20 and 40**?',
      steps: [
        { label: 'Step 1: Test odd numbers', content: '21 = 3×7, 23 ✓, 25 = 5², 27 = 3³, 29 ✓, 31 ✓, 33 = 3×11, 35 = 5×7, 37 ✓, 39 = 3×13' },
        { label: 'Step 2: Count', content: '23, 29, 31, 37 → **4 primes**' },
      ],
      answer: '4 primes (23, 29, 31, 37)',
    },
    {
      id: 'pr-05', difficulty: 3,
      question: 'A **twin prime** is a pair of primes p, p+2 (e.g., 11 and 13). Find all twin-prime pairs with both primes ≤ 50.',
      steps: [
        { label: 'Step 1: Primes ≤ 50', content: '2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47' },
        { label: 'Step 2: Look for consecutive pairs differing by 2', content: '(3,5), (5,7), (11,13), (17,19), (29,31), (41,43)' },
        { label: 'Step 3: Final', content: '**6 twin-prime pairs**' },
      ],
      answer: '(3,5), (5,7), (11,13), (17,19), (29,31), (41,43) — 6 pairs',
    },
  ],
};

// ─── 3. GCD and LCM ────────────────────────────────────────

export const practiceGcdLcm: PracticeSet = {
  title: 'Practice — GCD and LCM',
  problems: [
    {
      id: 'gl-01', difficulty: 1,
      question: 'Find **GCD(24, 36)**.',
      steps: [
        { label: 'Step 1: Common factors', content: 'Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36.' },
        { label: 'Step 2: Largest common', content: '**GCD = 12**' },
      ],
      answer: '12',
    },
    {
      id: 'gl-02', difficulty: 1,
      question: 'Find **LCM(8, 12)**.',
      steps: [
        { label: 'Step 1: Multiples', content: 'Multiples of 8: 8, 16, **24**, 32, 40. Multiples of 12: 12, **24**, 36, 48.' },
        { label: 'Step 2: Smallest common', content: '**LCM = 24**' },
      ],
      answer: '24',
    },
    {
      id: 'gl-03', difficulty: 2,
      question: 'Use the Euclidean algorithm to find **GCD(78, 30)**.',
      steps: [
        { label: 'Step 1', content: '78 = 2 × 30 + 18' },
        { label: 'Step 2', content: '30 = 1 × 18 + 12' },
        { label: 'Step 3', content: '18 = 1 × 12 + 6' },
        { label: 'Step 4', content: '12 = 2 × 6 + 0 → stop' },
        { label: 'Step 5: Last non-zero remainder', content: '**GCD = 6**' },
      ],
      answer: '6',
      code: 'a, b = 78, 30\n# Compute GCD using the Euclidean algorithm\n',
      codeSolution: 'a, b = 78, 30\nwhile b:\n    a, b = b, a % b\nprint(f"GCD = {a}")',
    },
    {
      id: 'gl-04', difficulty: 2,
      question: 'Two clocks chime every **6 seconds** and **8 seconds** respectively. They both chime together at noon. When will they next chime together?',
      steps: [
        { label: 'Step 1: We want LCM(6, 8)', content: 'Smallest time when both have completed whole cycles.' },
        { label: 'Step 2: GCD(6, 8) = 2', content: 'Then LCM = 6 × 8 / 2 = **24 s**' },
        { label: 'Step 3: Answer', content: '**24 seconds after noon**' },
      ],
      answer: '24 seconds (at 12:00:24)',
    },
    {
      id: 'gl-05', difficulty: 3,
      question: 'Reduce the fraction **84/126** to lowest terms.',
      steps: [
        { label: 'Step 1: Find GCD(84, 126) using Euclidean', content: '126 = 1 × 84 + 42; 84 = 2 × 42 + 0 → GCD = 42' },
        { label: 'Step 2: Divide top and bottom', content: '84/42 = 2; 126/42 = 3' },
        { label: 'Step 3: Reduced form', content: '**2/3**' },
      ],
      answer: '2/3',
    },
    {
      id: 'gl-06', difficulty: 3,
      question: 'Find integers x, y such that **15x + 10y = GCD(15, 10)** (Bézout coefficients).',
      steps: [
        { label: 'Step 1: GCD(15, 10) using Euclidean', content: '15 = 1 × 10 + 5; 10 = 2 × 5 + 0 → GCD = 5' },
        { label: 'Step 2: Express 5 in terms of 15 and 10', content: 'From step 1: 5 = 15 − 1 × 10' },
        { label: 'Step 3: Read off coefficients', content: 'x = 1, y = −1. Check: 15(1) + 10(−1) = 5 ✓' },
        { label: 'Step 4: Final', content: '**x = 1, y = −1**' },
      ],
      answer: 'x = 1, y = −1',
    },
  ],
};

// ─── 4. Sequences ──────────────────────────────────────────

export const practiceSequences: PracticeSet = {
  title: 'Practice — Sequences',
  problems: [
    {
      id: 'sq-01', difficulty: 1,
      question: 'Is **4, 7, 10, 13, 16** arithmetic, geometric, or neither? What is the next term?',
      steps: [
        { label: 'Step 1: Check differences', content: '7−4 = 3, 10−7 = 3, 13−10 = 3, 16−13 = 3. Constant.' },
        { label: 'Step 2: Arithmetic with d = 3', content: 'Next term = 16 + 3 = **19**' },
      ],
      answer: 'Arithmetic, d = 3; next = 19',
    },
    {
      id: 'sq-02', difficulty: 1,
      question: 'Is **3, 6, 12, 24, 48** arithmetic, geometric, or neither? What is the next term?',
      steps: [
        { label: 'Step 1: Check ratios', content: '6/3 = 2, 12/6 = 2, 24/12 = 2, 48/24 = 2.' },
        { label: 'Step 2: Geometric with r = 2', content: 'Next term = 48 × 2 = **96**' },
      ],
      answer: 'Geometric, r = 2; next = 96',
    },
    {
      id: 'sq-03', difficulty: 2,
      question: 'Find the **20th term** of the arithmetic sequence **5, 9, 13, 17, ...**',
      steps: [
        { label: 'Step 1: a₁ = 5, d = 4', content: '— ' },
        { label: 'Step 2: Apply aₙ = a₁ + (n−1)d', content: 'a₂₀ = 5 + 19 × 4' },
        { label: 'Step 3: Compute', content: '5 + 76 = **81**' },
      ],
      answer: '81',
    },
    {
      id: 'sq-04', difficulty: 2,
      question: 'Find the **sum of the first 50 even numbers** (2, 4, 6, ..., 100).',
      steps: [
        { label: 'Step 1: a₁ = 2, d = 2, n = 50, a₅₀ = 100', content: '— ' },
        { label: 'Step 2: S = n/2 × (a₁ + aₙ)', content: 'S = 50/2 × (2 + 100) = 25 × 102' },
        { label: 'Step 3: Final', content: '**S = 2,550**' },
      ],
      answer: '2,550',
      code: 'n = 50\n# Sum of first 50 even numbers\n',
      codeSolution: 'n = 50\ntotal = sum(2 * k for k in range(1, n + 1))\nprint(total)',
    },
    {
      id: 'sq-05', difficulty: 3,
      question: 'A ball is dropped from 20 m and rebounds to **40%** of its previous height each time. Find the **total vertical distance** travelled before it comes to rest.',
      steps: [
        { label: 'Step 1: Initial drop', content: '20 m down' },
        { label: 'Step 2: Each bounce contributes up + down = 2 × bounce height', content: '2 × 20 × (0.4 + 0.4² + 0.4³ + ...)' },
        { label: 'Step 3: Geometric sum', content: '0.4 + 0.4² + ... = 0.4 / (1 − 0.4) = 0.4 / 0.6 = 2/3' },
        { label: 'Step 4: Total', content: '20 + 2 × 20 × 2/3 = 20 + 80/3 ≈ **46.67 m**' },
      ],
      answer: '≈ 46.67 m',
    },
    {
      id: 'sq-06', difficulty: 3,
      question: 'Find the sum of the **infinite series** 1 + 1/3 + 1/9 + 1/27 + 1/81 + ...',
      steps: [
        { label: 'Step 1: Recognise geometric', content: 'a₁ = 1, r = 1/3. |r| < 1 so converges.' },
        { label: 'Step 2: S∞ = a₁ / (1 − r)', content: 'S∞ = 1 / (1 − 1/3) = 1 / (2/3)' },
        { label: 'Step 3: Final', content: '**S∞ = 3/2**' },
      ],
      answer: '3/2',
    },
  ],
};

// ─── 5. Modular Arithmetic ─────────────────────────────────

export const practiceModular: PracticeSet = {
  title: 'Practice — Modular Arithmetic',
  problems: [
    {
      id: 'md-01', difficulty: 1,
      question: 'Compute **23 mod 5**.',
      steps: [
        { label: 'Step 1: Divide 23 by 5', content: '23 = 4 × 5 + 3' },
        { label: 'Step 2: Remainder', content: '**3**' },
      ],
      answer: '3',
    },
    {
      id: 'md-02', difficulty: 1,
      question: 'It is **3 PM** now. What time will it be **20 hours** later? (Use a 12-hour clock.)',
      steps: [
        { label: 'Step 1: Add the hours', content: '3 + 20 = 23' },
        { label: 'Step 2: Reduce mod 12', content: '23 mod 12 = 11' },
        { label: 'Step 3: Result', content: '**11 o\'clock** (next day)' },
      ],
      answer: '11 o\'clock',
    },
    {
      id: 'md-03', difficulty: 2,
      question: 'Today is **Friday**. What day of the week will it be in **100 days**?',
      steps: [
        { label: 'Step 1: Reduce 100 mod 7', content: '100 = 14 × 7 + 2 → 2' },
        { label: 'Step 2: Friday + 2 days', content: '**Sunday**' },
      ],
      answer: 'Sunday',
      code: 'days_ahead = 100\nstart = "Friday"\n# Compute the day of the week 100 days from now\n',
      codeSolution: 'days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]\nstart_idx = days.index("Friday")\nresult = days[(start_idx + 100) % 7]\nprint(result)',
    },
    {
      id: 'md-04', difficulty: 2,
      question: 'Use the divisibility-by-9 trick: is **8,452,917** divisible by 9?',
      steps: [
        { label: 'Step 1: Digit sum', content: '8+4+5+2+9+1+7 = 36' },
        { label: 'Step 2: Is 36 divisible by 9?', content: 'Yes — 36 = 4 × 9' },
        { label: 'Step 3: Conclusion', content: '**Yes, 8,452,917 is divisible by 9.**' },
      ],
      answer: 'Yes (digit sum 36)',
    },
    {
      id: 'md-05', difficulty: 3,
      question: 'Compute **3¹⁰⁰ mod 7** efficiently.',
      steps: [
        { label: 'Step 1: Find the cycle of 3 mod 7', content: '3¹=3, 3²=2, 3³=6, 3⁴=4, 3⁵=5, 3⁶=1 — cycle length 6' },
        { label: 'Step 2: Reduce exponent mod cycle length', content: '100 mod 6 = 4' },
        { label: 'Step 3: Therefore 3¹⁰⁰ ≡ 3⁴', content: '3⁴ = 81; 81 mod 7 = **4**' },
      ],
      answer: '4',
      hint: 'Fermat\'s Little Theorem says 3⁶ ≡ 1 (mod 7) since 7 is prime.',
    },
    {
      id: 'md-06', difficulty: 3,
      question: 'Find the **modular inverse** of **7 mod 26** (i.e., a number x such that 7x ≡ 1 mod 26).',
      steps: [
        { label: 'Step 1: We need 7x ≡ 1 (mod 26)', content: 'Equivalent to 7x − 26k = 1 for some integer k.' },
        { label: 'Step 2: Try x = 1, 2, 3, ...', content: '7(15) = 105 = 4 × 26 + 1, so 7 × 15 ≡ 1 (mod 26).' },
        { label: 'Step 3: Final', content: '**x = 15**' },
      ],
      answer: '15',
      hint: 'You can find this systematically with the extended Euclidean algorithm.',
    },
  ],
};
