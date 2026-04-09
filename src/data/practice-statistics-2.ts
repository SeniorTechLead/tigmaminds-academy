// ============================================================
// PRACTICE PROBLEMS — Binomial Distribution & Correlation/Regression
//
// 50 problems per section, difficulty 1/2/3, with step-by-step
// hand solutions, visuals, and Python code variants.
// ============================================================

import type { PracticeSet } from './reference';

// ─── 1. Binomial Distribution ─────────────────────────────────

export const practiceBinomialDistribution: PracticeSet = {
  title: 'Practice — Binomial Distribution',
  problems: [
    // ── Easy (1-17) ────────────────────────────────────────
    {
      id: 'bin-01', difficulty: 1,
      question: 'A fair coin is flipped **5 times**. What is P(exactly 3 heads)?',
      visual: { kind: 'coins', count: 5, heads: 3 },
      steps: [
        { label: 'Step 1: Identify parameters', content: 'n = 5, k = 3, p = 0.5' },
        { label: 'Step 2: Compute C(5,3)', content: 'C(5,3) = 5! / (3! × 2!) = 10' },
        { label: 'Step 3: Apply formula', content: 'P(X=3) = C(5,3) × 0.5³ × 0.5² = 10 × 0.125 × 0.25 = **0.3125**' },
      ],
      answer: '0.3125',
      code: '# Compute P(X=3) for 5 fair coin flips\nfrom math import comb\n\nn, k, p = 5, 3, 0.5\n# Your code here\n',
      codeSolution: 'from math import comb\n\nn, k, p = 5, 3, 0.5\nprob = comb(n, k) * p**k * (1-p)**(n-k)\nprint(f"P(X={k}) = {prob}")',
    },
    {
      id: 'bin-02', difficulty: 1,
      question: 'Compute **C(8, 2)**.',
      steps: [
        { label: 'Step 1: Formula', content: 'C(n,k) = n! / (k! × (n−k)!)' },
        { label: 'Step 2: Substitute', content: 'C(8,2) = 8! / (2! × 6!) = (8 × 7) / (2 × 1) = **28**' },
      ],
      answer: '28',
    },
    {
      id: 'bin-03', difficulty: 1,
      question: 'Compute **C(6, 0)** and **C(6, 6)**.',
      hint: 'How many ways can you choose nothing? Everything?',
      steps: [
        { label: 'Step 1: C(6,0)', content: 'C(6,0) = 1 (there is exactly one way to choose nothing)' },
        { label: 'Step 2: C(6,6)', content: 'C(6,6) = 1 (there is exactly one way to choose everything)' },
      ],
      answer: 'Both equal 1',
    },
    {
      id: 'bin-04', difficulty: 1,
      question: 'A fair coin is flipped **4 times**. What is P(exactly 0 heads)?',
      visual: { kind: 'coins', count: 4, heads: 0 },
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 4, k = 0, p = 0.5' },
        { label: 'Step 2: Compute', content: 'P(X=0) = C(4,0) × 0.5⁰ × 0.5⁴ = 1 × 1 × 0.0625 = **0.0625**' },
      ],
      answer: '0.0625',
    },
    {
      id: 'bin-05', difficulty: 1,
      question: 'A binomial experiment has n = 20 and p = 0.3. Find the **mean**.',
      steps: [
        { label: 'Step 1: Formula', content: 'Mean = n × p' },
        { label: 'Step 2: Substitute', content: 'Mean = 20 × 0.3 = **6**' },
      ],
      answer: '6',
    },
    {
      id: 'bin-06', difficulty: 1,
      question: 'A binomial experiment has n = 50 and p = 0.4. Find the **standard deviation**.',
      steps: [
        { label: 'Step 1: Formula', content: 'σ = √(n × p × (1 − p))' },
        { label: 'Step 2: Substitute', content: 'σ = √(50 × 0.4 × 0.6) = √12 ≈ **3.464**' },
      ],
      answer: '≈ 3.464',
    },
    {
      id: 'bin-07', difficulty: 1,
      question: 'A fair die is rolled **3 times**. What is P(exactly 1 six)?',
      visual: { kind: 'dice', count: 3, values: [6] },
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 3, k = 1, p = 1/6 ≈ 0.1667' },
        { label: 'Step 2: Compute C(3,1)', content: 'C(3,1) = 3' },
        { label: 'Step 3: Apply formula', content: 'P(X=1) = 3 × (1/6)¹ × (5/6)² = 3 × (1/6) × (25/36) = 75/216 ≈ **0.3472**' },
      ],
      answer: '75/216 ≈ 0.347',
    },
    {
      id: 'bin-08', difficulty: 1,
      question: 'Compute **C(10, 3)**.',
      steps: [
        { label: 'Step 1: Formula', content: 'C(10,3) = 10! / (3! × 7!)' },
        { label: 'Step 2: Simplify', content: '(10 × 9 × 8) / (3 × 2 × 1) = 720 / 6 = **120**' },
      ],
      answer: '120',
    },
    {
      id: 'bin-09', difficulty: 1,
      question: 'A multiple-choice test has **6 questions**, each with 4 options. If you guess randomly, what is P(getting exactly 2 correct)?',
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 6, k = 2, p = 1/4 = 0.25' },
        { label: 'Step 2: C(6,2)', content: 'C(6,2) = 15' },
        { label: 'Step 3: Compute', content: 'P(X=2) = 15 × 0.25² × 0.75⁴ = 15 × 0.0625 × 0.3164 ≈ **0.2966**' },
      ],
      answer: '≈ 0.297',
    },
    {
      id: 'bin-10', difficulty: 1,
      question: 'A fair coin is flipped **6 times**. What is P(all heads)?',
      visual: { kind: 'coins', count: 6, heads: 6 },
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 6, k = 6, p = 0.5' },
        { label: 'Step 2: Compute', content: 'P(X=6) = C(6,6) × 0.5⁶ = 1 × 0.015625 = **0.015625**' },
      ],
      answer: '1/64 ≈ 0.0156',
    },
    {
      id: 'bin-11', difficulty: 1,
      question: 'A binomial experiment has n = 100 and p = 0.5. What are the **mean** and **standard deviation**?',
      steps: [
        { label: 'Step 1: Mean', content: 'μ = np = 100 × 0.5 = **50**' },
        { label: 'Step 2: Std dev', content: 'σ = √(npq) = √(100 × 0.5 × 0.5) = √25 = **5**' },
      ],
      answer: 'Mean = 50, SD = 5',
      code: '# Compute mean and std dev for Binomial(100, 0.5)\nn, p = 100, 0.5\n# Your code here\n',
      codeSolution: 'import math\nn, p = 100, 0.5\nmean = n * p\nstd = math.sqrt(n * p * (1 - p))\nprint(f"Mean = {mean}, SD = {std}")',
    },
    {
      id: 'bin-12', difficulty: 1,
      question: 'True or false: In a binomial experiment, the trials must be **independent**.',
      steps: [
        { label: 'Step 1: Recall conditions', content: 'A binomial experiment requires: (1) fixed number of trials, (2) two outcomes per trial, (3) constant probability, (4) **independent trials**.' },
      ],
      answer: 'True',
    },
    {
      id: 'bin-13', difficulty: 1,
      question: 'A fair coin is flipped **5 times**. What is P(exactly 5 heads) + P(exactly 0 heads)?',
      visual: { kind: 'coins', count: 5 },
      steps: [
        { label: 'Step 1: P(5 heads)', content: 'C(5,5) × 0.5⁵ = 1/32' },
        { label: 'Step 2: P(0 heads)', content: 'C(5,0) × 0.5⁵ = 1/32' },
        { label: 'Step 3: Add', content: '1/32 + 1/32 = 2/32 = **1/16 = 0.0625**' },
      ],
      answer: '1/16 = 0.0625',
    },
    {
      id: 'bin-14', difficulty: 1,
      question: 'Compute **C(7, 4)**.',
      steps: [
        { label: 'Step 1: Formula', content: 'C(7,4) = 7! / (4! × 3!) = (7 × 6 × 5) / (3 × 2 × 1) = 210 / 6 = **35**' },
      ],
      answer: '35',
    },
    {
      id: 'bin-15', difficulty: 1,
      question: 'A binomial distribution has n = 10, p = 0.7. Find the **mean** and **variance**.',
      steps: [
        { label: 'Step 1: Mean', content: 'μ = np = 10 × 0.7 = **7**' },
        { label: 'Step 2: Variance', content: 'σ² = np(1−p) = 10 × 0.7 × 0.3 = **2.1**' },
      ],
      answer: 'Mean = 7, Variance = 2.1',
    },
    {
      id: 'bin-16', difficulty: 1,
      question: 'If X ~ Binomial(8, 0.5), what is P(X = 4)?',
      visual: { kind: 'bar-chart', labels: ['0','1','2','3','4','5','6','7','8'], values: [0.004,0.031,0.109,0.219,0.273,0.219,0.109,0.031,0.004], highlight: 4 },
      steps: [
        { label: 'Step 1: C(8,4)', content: 'C(8,4) = 70' },
        { label: 'Step 2: Compute', content: 'P(X=4) = 70 × 0.5⁴ × 0.5⁴ = 70 × (1/256) = 70/256 ≈ **0.2734**' },
      ],
      answer: '70/256 ≈ 0.273',
    },
    {
      id: 'bin-17', difficulty: 1,
      question: 'A basketball player makes 60% of free throws. In **5 attempts**, what is P(exactly 3 makes)?',
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 5, k = 3, p = 0.6' },
        { label: 'Step 2: C(5,3)', content: 'C(5,3) = 10' },
        { label: 'Step 3: Compute', content: 'P(X=3) = 10 × 0.6³ × 0.4² = 10 × 0.216 × 0.16 = **0.3456**' },
      ],
      answer: '≈ 0.346',
    },

    // ── Medium (18-34) ─────────────────────────────────────
    {
      id: 'bin-18', difficulty: 2,
      question: 'A drug is effective for 80% of patients. In a trial of **10 patients**, what is P(at least 8 respond)?',
      steps: [
        { label: 'Step 1: "At least 8" means P(X≥8)', content: 'P(X≥8) = P(X=8) + P(X=9) + P(X=10)' },
        { label: 'Step 2: P(X=8)', content: 'C(10,8) × 0.8⁸ × 0.2² = 45 × 0.1678 × 0.04 ≈ 0.3020' },
        { label: 'Step 3: P(X=9)', content: 'C(10,9) × 0.8⁹ × 0.2¹ = 10 × 0.1342 × 0.2 ≈ 0.2684' },
        { label: 'Step 4: P(X=10)', content: 'C(10,10) × 0.8¹⁰ = 0.1074' },
        { label: 'Step 5: Add', content: '0.3020 + 0.2684 + 0.1074 ≈ **0.6778**' },
      ],
      answer: '≈ 0.678',
      code: '# P(at least 8 respond) in a trial of 10, p=0.8\nfrom math import comb\n\nn, p = 10, 0.8\n# Your code here\n',
      codeSolution: 'from math import comb\n\nn, p = 10, 0.8\nprob = sum(comb(n, k) * p**k * (1-p)**(n-k) for k in range(8, 11))\nprint(f"P(X >= 8) = {prob:.4f}")',
    },
    {
      id: 'bin-19', difficulty: 2,
      question: 'A factory produces items with a **5% defect rate**. In a batch of 20, what is P(exactly 0 defectives)?',
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 20, k = 0, p = 0.05' },
        { label: 'Step 2: Compute', content: 'P(X=0) = C(20,0) × 0.05⁰ × 0.95²⁰ = 1 × 1 × 0.95²⁰' },
        { label: 'Step 3: Evaluate', content: '0.95²⁰ ≈ **0.3585**' },
      ],
      answer: '≈ 0.359',
    },
    {
      id: 'bin-20', difficulty: 2,
      question: 'In the same factory (5% defect rate, batch of 20), what is P(**at most 1** defective)?',
      steps: [
        { label: 'Step 1: P(X≤1) = P(X=0) + P(X=1)', content: 'P(X=0) = 0.95²⁰ ≈ 0.3585' },
        { label: 'Step 2: P(X=1)', content: 'C(20,1) × 0.05 × 0.95¹⁹ = 20 × 0.05 × 0.3774 ≈ 0.3774' },
        { label: 'Step 3: Add', content: '0.3585 + 0.3774 ≈ **0.7359**' },
      ],
      answer: '≈ 0.736',
    },
    {
      id: 'bin-21', difficulty: 2,
      question: 'An election poll shows 55% support for a candidate. In a random sample of **15 voters**, what is P(exactly 10 support)?',
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 15, k = 10, p = 0.55' },
        { label: 'Step 2: C(15,10)', content: 'C(15,10) = C(15,5) = 3003' },
        { label: 'Step 3: Compute', content: 'P(X=10) = 3003 × 0.55¹⁰ × 0.45⁵ = 3003 × 0.002533 × 0.01845 ≈ **0.1404**' },
      ],
      answer: '≈ 0.140',
    },
    {
      id: 'bin-22', difficulty: 2,
      question: 'Use the **normal approximation** to find P(X ≥ 55) when X ~ Binomial(100, 0.5).',
      visual: { kind: 'distribution', type: 'normal', params: { mean: 50, std: 5 }, markX: 55, shadeFrom: 55, shadeTo: 75 },
      hint: 'Apply continuity correction: use 54.5 instead of 55.',
      steps: [
        { label: 'Step 1: Mean and SD', content: 'μ = 50, σ = 5' },
        { label: 'Step 2: Continuity correction', content: 'P(X ≥ 55) ≈ P(Z ≥ (54.5 − 50)/5) = P(Z ≥ 0.9)' },
        { label: 'Step 3: Look up z-table', content: 'P(Z ≥ 0.9) = 1 − 0.8159 = **0.1841**' },
      ],
      answer: '≈ 0.184',
    },
    {
      id: 'bin-23', difficulty: 2,
      question: 'A fair die is rolled **12 times**. What is the expected number of sixes, and the standard deviation?',
      visual: { kind: 'dice', count: 12 },
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 12, p = 1/6' },
        { label: 'Step 2: Mean', content: 'μ = 12 × (1/6) = **2**' },
        { label: 'Step 3: Std dev', content: 'σ = √(12 × 1/6 × 5/6) = √(10/6) ≈ **1.291**' },
      ],
      answer: 'Mean = 2, SD ≈ 1.291',
    },
    {
      id: 'bin-24', difficulty: 2,
      question: '70% of seeds germinate. You plant **8 seeds**. What is P(at least 6 germinate)?',
      steps: [
        { label: 'Step 1: P(X≥6) = P(6) + P(7) + P(8)', content: 'n = 8, p = 0.7' },
        { label: 'Step 2: P(X=6)', content: 'C(8,6) × 0.7⁶ × 0.3² = 28 × 0.1176 × 0.09 ≈ 0.2965' },
        { label: 'Step 3: P(X=7)', content: 'C(8,7) × 0.7⁷ × 0.3¹ = 8 × 0.0824 × 0.3 ≈ 0.1977' },
        { label: 'Step 4: P(X=8)', content: '0.7⁸ ≈ 0.0576' },
        { label: 'Step 5: Sum', content: '0.2965 + 0.1977 + 0.0576 ≈ **0.5518**' },
      ],
      answer: '≈ 0.552',
    },
    {
      id: 'bin-25', difficulty: 2,
      question: 'A vaccine has a 90% effectiveness rate. In a group of **15 vaccinated people** exposed to a virus, what is P(all 15 are protected)?',
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 15, k = 15, p = 0.9' },
        { label: 'Step 2: Compute', content: 'P(X=15) = 0.9¹⁵ ≈ **0.2059**' },
      ],
      answer: '≈ 0.206',
    },
    {
      id: 'bin-26', difficulty: 2,
      question: 'A student guesses on a 10-question true/false quiz. What is P(passing with at least 7 correct)?',
      visual: { kind: 'coins', count: 10, heads: 7 },
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 10, p = 0.5, need P(X ≥ 7)' },
        { label: 'Step 2: P(X=7)', content: 'C(10,7) × 0.5¹⁰ = 120 / 1024 ≈ 0.1172' },
        { label: 'Step 3: P(X=8)', content: 'C(10,8) × 0.5¹⁰ = 45 / 1024 ≈ 0.0439' },
        { label: 'Step 4: P(X=9)', content: '10 / 1024 ≈ 0.0098' },
        { label: 'Step 5: P(X=10)', content: '1 / 1024 ≈ 0.0010' },
        { label: 'Step 6: Sum', content: '0.1172 + 0.0439 + 0.0098 + 0.0010 ≈ **0.1719**' },
      ],
      answer: '≈ 0.172',
      code: '# P(at least 7 correct) on a 10-question T/F quiz by guessing\nfrom math import comb\n\nn, p = 10, 0.5\n# Your code here\n',
      codeSolution: 'from math import comb\n\nn, p = 10, 0.5\nprob = sum(comb(n, k) * p**k * (1-p)**(n-k) for k in range(7, 11))\nprint(f"P(X >= 7) = {prob:.4f}")',
    },
    {
      id: 'bin-27', difficulty: 2,
      question: 'Show that the binomial probabilities **sum to 1** for n = 3, p = 0.5.',
      steps: [
        { label: 'Step 1: List all probabilities', content: 'P(0) = 1×0.125 = 0.125, P(1) = 3×0.125 = 0.375, P(2) = 3×0.125 = 0.375, P(3) = 1×0.125 = 0.125' },
        { label: 'Step 2: Sum', content: '0.125 + 0.375 + 0.375 + 0.125 = **1.000** ✓' },
      ],
      answer: '1.000 (verified)',
      visual: { kind: 'bar-chart', labels: ['0','1','2','3'], values: [0.125,0.375,0.375,0.125] },
    },
    {
      id: 'bin-28', difficulty: 2,
      question: 'A quality inspector selects **25 items** from a production line with a 2% defect rate. What is P(at least 1 defective)?',
      hint: 'Use the complement: P(at least 1) = 1 − P(0).',
      steps: [
        { label: 'Step 1: Complement', content: 'P(X ≥ 1) = 1 − P(X = 0)' },
        { label: 'Step 2: P(X=0)', content: '0.98²⁵ ≈ 0.6035' },
        { label: 'Step 3: Subtract', content: '1 − 0.6035 ≈ **0.3965**' },
      ],
      answer: '≈ 0.397',
    },
    {
      id: 'bin-29', difficulty: 2,
      question: 'Use the **normal approximation** to estimate P(40 ≤ X ≤ 60) when X ~ Binomial(100, 0.5).',
      visual: { kind: 'distribution', type: 'normal', params: { mean: 50, std: 5 }, shadeFrom: 40, shadeTo: 60 },
      steps: [
        { label: 'Step 1: μ = 50, σ = 5', content: 'With continuity correction: P(39.5 ≤ X ≤ 60.5)' },
        { label: 'Step 2: Z-scores', content: 'z₁ = (39.5−50)/5 = −2.1, z₂ = (60.5−50)/5 = 2.1' },
        { label: 'Step 3: From z-table', content: 'P(−2.1 ≤ Z ≤ 2.1) = 2 × 0.4821 ≈ **0.9643**' },
      ],
      answer: '≈ 0.964',
    },
    {
      id: 'bin-30', difficulty: 2,
      question: 'A basketball player has a 40% three-point shooting rate. In **10 attempts**, what is P(making 5 or more)?',
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 10, p = 0.4, need P(X ≥ 5)' },
        { label: 'Step 2: Compute each', content: 'P(5) ≈ 0.2007, P(6) ≈ 0.1115, P(7) ≈ 0.0425, P(8) ≈ 0.0106, P(9) ≈ 0.0016, P(10) ≈ 0.0001' },
        { label: 'Step 3: Sum', content: '≈ **0.3669**' },
      ],
      answer: '≈ 0.367',
      code: '# P(X >= 5) for Binomial(10, 0.4)\nfrom math import comb\n\nn, p = 10, 0.4\n# Your code here\n',
      codeSolution: 'from math import comb\n\nn, p = 10, 0.4\nprob = sum(comb(n, k) * p**k * (1-p)**(n-k) for k in range(5, 11))\nprint(f"P(X >= 5) = {prob:.4f}")',
    },
    {
      id: 'bin-31', difficulty: 2,
      question: 'In a binomial experiment with n = 30 and p = 0.2, is the **normal approximation** appropriate? If yes, state the approximate distribution.',
      steps: [
        { label: 'Step 1: Check np and n(1−p)', content: 'np = 30 × 0.2 = 6, n(1−p) = 30 × 0.8 = 24' },
        { label: 'Step 2: Rule of thumb', content: 'Both np ≥ 5 and n(1−p) ≥ 5 → **Yes**, the normal approximation is appropriate' },
        { label: 'Step 3: Parameters', content: 'X ≈ N(6, √4.8) = N(6, 2.19)' },
      ],
      answer: 'Yes; approximately N(6, 2.19)',
    },
    {
      id: 'bin-32', difficulty: 2,
      question: '5 cards are drawn **with replacement** from a standard deck. What is P(exactly 2 hearts)?',
      visual: { kind: 'cards', drawn: ['3♥','7♥','A♠','K♦','5♣'] },
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 5, k = 2, p = 13/52 = 0.25 (drawing with replacement → binomial)' },
        { label: 'Step 2: C(5,2)', content: 'C(5,2) = 10' },
        { label: 'Step 3: Compute', content: 'P(X=2) = 10 × 0.25² × 0.75³ = 10 × 0.0625 × 0.4219 ≈ **0.2637**' },
      ],
      answer: '≈ 0.264',
    },
    {
      id: 'bin-33', difficulty: 2,
      question: 'A weather forecast says 30% chance of rain each day. In a **7-day** week, what is P(rain on exactly 3 days)?',
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 7, k = 3, p = 0.3' },
        { label: 'Step 2: C(7,3)', content: 'C(7,3) = 35' },
        { label: 'Step 3: Compute', content: 'P(X=3) = 35 × 0.3³ × 0.7⁴ = 35 × 0.027 × 0.2401 ≈ **0.2269**' },
      ],
      answer: '≈ 0.227',
    },
    {
      id: 'bin-34', difficulty: 2,
      question: 'A biased coin has P(heads) = 0.7. It is flipped **8 times**. Find the probability the number of heads is within one standard deviation of the mean.',
      steps: [
        { label: 'Step 1: Mean and SD', content: 'μ = 8 × 0.7 = 5.6, σ = √(8 × 0.7 × 0.3) = √1.68 ≈ 1.296' },
        { label: 'Step 2: Range', content: 'μ − σ ≈ 4.3, μ + σ ≈ 6.9 → whole values 5 and 6' },
        { label: 'Step 3: P(X=5) + P(X=6)', content: 'P(5) = C(8,5)×0.7⁵×0.3³ ≈ 0.2541, P(6) = C(8,6)×0.7⁶×0.3² ≈ 0.2965' },
        { label: 'Step 4: Sum', content: '0.2541 + 0.2965 ≈ **0.5506**' },
      ],
      answer: '≈ 0.551',
    },

    // ── Hard (35-50) ───────────────────────────────────────
    {
      id: 'bin-35', difficulty: 3,
      question: '**Derive** the mean of a Binomial(n, p) distribution using indicator random variables.',
      steps: [
        { label: 'Step 1: Define indicators', content: 'Let Xᵢ = 1 if trial i is a success, 0 otherwise. Then X = X₁ + X₂ + … + Xₙ.' },
        { label: 'Step 2: E[Xᵢ]', content: 'E[Xᵢ] = 1 × p + 0 × (1−p) = p' },
        { label: 'Step 3: Linearity of expectation', content: 'E[X] = E[X₁] + E[X₂] + … + E[Xₙ] = **np** ∎' },
      ],
      answer: 'E[X] = np',
    },
    {
      id: 'bin-36', difficulty: 3,
      question: '**Derive** the variance of Binomial(n, p) using indicator random variables.',
      steps: [
        { label: 'Step 1: Var(Xᵢ)', content: 'Var(Xᵢ) = E[Xᵢ²] − (E[Xᵢ])² = p − p² = p(1−p)' },
        { label: 'Step 2: Independence', content: 'Since trials are independent, Var(X) = Var(X₁) + … + Var(Xₙ)' },
        { label: 'Step 3: Conclusion', content: 'Var(X) = np(1−p), so σ = **√(np(1−p))** ∎' },
      ],
      answer: 'Var(X) = np(1−p)',
    },
    {
      id: 'bin-37', difficulty: 3,
      question: 'Show that as n → ∞ and p → 0 with np = λ fixed, Binomial(n, p) approaches **Poisson(λ)**. Demonstrate with n = 1000, p = 0.003 (λ = 3): compare P(X = 2) under both distributions.',
      steps: [
        { label: 'Step 1: Binomial P(X=2)', content: 'C(1000,2) × 0.003² × 0.997⁹⁹⁸ = 499500 × 0.000009 × 0.0498 ≈ 0.2240' },
        { label: 'Step 2: Poisson P(X=2)', content: 'e⁻³ × 3² / 2! = 0.0498 × 9 / 2 = 0.2240' },
        { label: 'Step 3: Compare', content: 'Both give ≈ **0.224**, confirming the Poisson limit theorem.' },
      ],
      answer: 'Both ≈ 0.224; Poisson is the limiting case',
      code: '# Compare Binomial(1000, 0.003) vs Poisson(3) for P(X=2)\nfrom math import comb, exp, factorial\n\n# Your code here\n',
      codeSolution: 'from math import comb, exp, factorial\n\nn, p, lam, k = 1000, 0.003, 3, 2\nbinom_p = comb(n, k) * p**k * (1-p)**(n-k)\npoisson_p = exp(-lam) * lam**k / factorial(k)\nprint(f"Binomial: {binom_p:.6f}")\nprint(f"Poisson:  {poisson_p:.6f}")',
    },
    {
      id: 'bin-38', difficulty: 3,
      question: 'A clinical trial tests a new drug on **200 patients**. The drug is expected to work for 65% of patients. Using the normal approximation, what is P(fewer than 120 patients respond)?',
      visual: { kind: 'distribution', type: 'normal', params: { mean: 130, std: 6.745 }, markX: 120, shadeFrom: 80, shadeTo: 120 },
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 200, p = 0.65, μ = 130, σ = √(200 × 0.65 × 0.35) = √45.5 ≈ 6.745' },
        { label: 'Step 2: Continuity correction', content: 'P(X < 120) ≈ P(X ≤ 119.5), z = (119.5 − 130)/6.745 ≈ −1.557' },
        { label: 'Step 3: z-table', content: 'P(Z < −1.56) ≈ **0.0594**' },
      ],
      answer: '≈ 0.059',
    },
    {
      id: 'bin-39', difficulty: 3,
      question: 'An airline overbooks a 200-seat flight, selling **215 tickets**, knowing that each passenger has a 95% chance of showing up. What is the approximate probability of overbooking (more than 200 show up)?',
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 215, p = 0.95, μ = 204.25, σ = √(215 × 0.95 × 0.05) ≈ 3.196' },
        { label: 'Step 2: Need P(X > 200)', content: 'With continuity correction: P(X ≥ 201) ≈ P(Z ≥ (200.5 − 204.25)/3.196)' },
        { label: 'Step 3: z-score', content: 'z = −1.174' },
        { label: 'Step 4: Probability', content: 'P(Z ≥ −1.174) ≈ 1 − 0.1203 ≈ **0.880**' },
      ],
      answer: '≈ 0.880',
      code: '# Probability of overbooking: more than 200 show up from 215 tickets\nfrom math import comb\n\nn, p = 215, 0.95\n# Compute P(X > 200) exactly\n# Your code here\n',
      codeSolution: 'from math import comb\n\nn, p = 215, 0.95\nprob = sum(comb(n, k) * p**k * (1-p)**(n-k) for k in range(201, 216))\nprint(f"P(overbooking) = {prob:.4f}")',
    },
    {
      id: 'bin-40', difficulty: 3,
      question: 'Prove that C(n, k) = C(n, n−k) algebraically.',
      steps: [
        { label: 'Step 1: Write definitions', content: 'C(n,k) = n! / (k!(n−k)!)' },
        { label: 'Step 2: C(n, n−k)', content: 'C(n, n−k) = n! / ((n−k)!(n−(n−k))!) = n! / ((n−k)! k!)' },
        { label: 'Step 3: Compare', content: 'Both equal n! / (k!(n−k)!), so **C(n,k) = C(n, n−k)** ∎' },
      ],
      answer: 'C(n,k) = C(n, n−k) (proven)',
    },
    {
      id: 'bin-41', difficulty: 3,
      question: 'A manufacturer wants P(0 defectives in a batch) to be **at least 0.90**. If the defect rate is 1%, what is the **maximum batch size**?',
      steps: [
        { label: 'Step 1: Set up inequality', content: 'P(X=0) = 0.99ⁿ ≥ 0.90' },
        { label: 'Step 2: Take logarithm', content: 'n × ln(0.99) ≥ ln(0.90)' },
        { label: 'Step 3: Solve', content: 'n ≤ ln(0.90) / ln(0.99) = (−0.10536) / (−0.01005) ≈ 10.48' },
        { label: 'Step 4: Round down', content: 'n ≤ **10** (since n must be a whole number)' },
      ],
      answer: 'Maximum batch size = 10',
    },
    {
      id: 'bin-42', difficulty: 3,
      question: 'A researcher wants to estimate a proportion p using a binomial experiment. How large must n be so that the **standard deviation** of the sample proportion p̂ = X/n is at most 0.02, assuming p ≈ 0.5?',
      steps: [
        { label: 'Step 1: Formula for SD of p̂', content: 'SD(p̂) = √(p(1−p)/n)' },
        { label: 'Step 2: Set up inequality', content: '√(0.5 × 0.5 / n) ≤ 0.02' },
        { label: 'Step 3: Solve', content: '0.25/n ≤ 0.0004 → n ≥ 0.25/0.0004 = **625**' },
      ],
      answer: 'n ≥ 625',
    },
    {
      id: 'bin-43', difficulty: 3,
      question: 'Prove that the **mode** of Binomial(n, p) is either ⌊(n+1)p⌋ or ⌊(n+1)p⌋ − 1.',
      hint: 'Consider the ratio P(X=k+1)/P(X=k) and find where it crosses 1.',
      steps: [
        { label: 'Step 1: Ratio of consecutive terms', content: 'P(X=k+1)/P(X=k) = [C(n,k+1)/C(n,k)] × [p/(1−p)] = [(n−k)/(k+1)] × [p/(1−p)]' },
        { label: 'Step 2: Set ratio ≥ 1', content: '(n−k)p ≥ (k+1)(1−p) → k ≤ (n+1)p − 1' },
        { label: 'Step 3: Conclusion', content: 'Probabilities increase up to k = ⌊(n+1)p − 1⌋ = ⌊(n+1)p⌋ − 1, so the mode is at **⌊(n+1)p⌋** or **⌊(n+1)p⌋ − 1** (tie when (n+1)p is an integer). ∎' },
      ],
      answer: 'Mode is at ⌊(n+1)p⌋ or ⌊(n+1)p⌋ − 1',
    },
    {
      id: 'bin-44', difficulty: 3,
      question: 'A spam filter correctly identifies spam 98% of the time and correctly identifies non-spam 95% of the time. If 20% of emails are spam, and the filter processes **50 emails**, what is the expected number of **misclassified** emails?',
      steps: [
        { label: 'Step 1: Misclassification rates', content: 'P(miss spam) = 0.02, P(miss non-spam) = 0.05' },
        { label: 'Step 2: Expected spam emails', content: '50 × 0.20 = 10 spam, 50 × 0.80 = 40 non-spam' },
        { label: 'Step 3: Expected misclassifications', content: 'E[missed spam] = 10 × 0.02 = 0.2, E[missed non-spam] = 40 × 0.05 = 2.0' },
        { label: 'Step 4: Total', content: '0.2 + 2.0 = **2.2** misclassified emails' },
      ],
      answer: '2.2 emails expected misclassified',
    },
    {
      id: 'bin-45', difficulty: 3,
      question: 'You flip a coin until you get **3 heads**. This is NOT binomial — explain why. Then identify the correct distribution and find P(it takes exactly 5 flips).',
      steps: [
        { label: 'Step 1: Why not binomial', content: 'The number of trials is NOT fixed — it varies. Binomial requires a fixed n.' },
        { label: 'Step 2: Correct distribution', content: 'This is the **Negative Binomial** distribution: waiting for the r-th success.' },
        { label: 'Step 3: P(5 flips for 3rd head)', content: 'Need exactly 2 heads in first 4 flips AND heads on flip 5: C(4,2) × 0.5⁴ × 0.5 = 6 × 0.5⁵ = 6/32 = **3/16 = 0.1875**' },
      ],
      answer: 'Negative Binomial; P = 3/16 = 0.1875',
    },
    {
      id: 'bin-46', difficulty: 3,
      question: 'Two factories supply widgets. Factory A (60% of supply) has 3% defect rate; Factory B (40%) has 5% defect rate. A random widget is defective. What is P(it came from Factory A)? Then: in a batch of **10** from Factory A, what is P(exactly 1 defective)?',
      steps: [
        { label: 'Step 1: Bayes\' theorem', content: 'P(A|D) = P(D|A)P(A) / P(D) = (0.03 × 0.60) / (0.03 × 0.60 + 0.05 × 0.40)' },
        { label: 'Step 2: Compute', content: 'P(A|D) = 0.018 / (0.018 + 0.020) = 0.018 / 0.038 ≈ **0.4737**' },
        { label: 'Step 3: Binomial part', content: 'P(X=1) from Binomial(10, 0.03) = C(10,1) × 0.03 × 0.97⁹ = 10 × 0.03 × 0.7602 ≈ **0.2281**' },
      ],
      answer: 'P(from A | defective) ≈ 0.474; P(1 defective in 10) ≈ 0.228',
    },
    {
      id: 'bin-47', difficulty: 3,
      question: 'Generate and plot the **full probability distribution** for X ~ Binomial(12, 0.3). Verify the probabilities sum to 1.',
      visual: { kind: 'distribution', type: 'binomial', params: { n: 12, p: 0.3 } },
      steps: [
        { label: 'Step 1: Compute each P(X=k)', content: 'For k = 0 to 12, use C(12,k) × 0.3ᵏ × 0.7¹²⁻ᵏ' },
        { label: 'Step 2: Key values', content: 'P(0)≈0.0138, P(1)≈0.0712, P(2)≈0.1678, P(3)≈0.2397, P(4)≈0.2311, P(5)≈0.1585, ...' },
        { label: 'Step 3: Sum', content: 'All 13 probabilities sum to **1.0000** ✓' },
      ],
      answer: 'Distribution peaks at k=3–4 (mode); sum = 1',
      code: '# Generate and display Binomial(12, 0.3) distribution\nfrom math import comb\n\nn, p = 12, 0.3\n# Your code here: compute and print all P(X=k)\n',
      codeSolution: 'from math import comb\n\nn, p = 12, 0.3\ntotal = 0\nfor k in range(n + 1):\n    prob = comb(n, k) * p**k * (1-p)**(n-k)\n    total += prob\n    print(f"P(X={k:2d}) = {prob:.6f}")\nprint(f"\\nSum = {total:.6f}")',
    },
    {
      id: 'bin-48', difficulty: 3,
      question: 'A polling firm interviews **500 people**. The true support is 52%. What is the probability the poll shows support **below 50%** (i.e., the poll gets the wrong winner)?',
      visual: { kind: 'distribution', type: 'normal', params: { mean: 260, std: 11.17 }, markX: 250, shadeFrom: 200, shadeTo: 250 },
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 500, p = 0.52, μ = 260, σ = √(500 × 0.52 × 0.48) ≈ 11.17' },
        { label: 'Step 2: Threshold', content: 'Below 50% means X < 250. With CC: P(X ≤ 249.5)' },
        { label: 'Step 3: z-score', content: 'z = (249.5 − 260) / 11.17 ≈ −0.940' },
        { label: 'Step 4: Probability', content: 'P(Z < −0.94) ≈ **0.174**' },
      ],
      answer: '≈ 0.174 (about 17.4% chance the poll gets it wrong)',
    },
    {
      id: 'bin-49', difficulty: 3,
      question: 'The **moment generating function** (MGF) of X ~ Binomial(n, p) is M(t) = (1 − p + peᵗ)ⁿ. Use it to derive E[X] and E[X²].',
      steps: [
        { label: 'Step 1: E[X] = M\'(0)', content: 'M\'(t) = n(1−p+peᵗ)ⁿ⁻¹ × peᵗ. At t=0: M\'(0) = n × 1ⁿ⁻¹ × p = **np**' },
        { label: 'Step 2: M\'\'(t)', content: 'M\'\'(t) = n(n−1)(peᵗ)²(1−p+peᵗ)ⁿ⁻² + n × peᵗ(1−p+peᵗ)ⁿ⁻¹' },
        { label: 'Step 3: E[X²] = M\'\'(0)', content: 'M\'\'(0) = n(n−1)p² + np = **n²p² − np² + np**' },
        { label: 'Step 4: Verify variance', content: 'Var(X) = E[X²] − (E[X])² = n²p² − np² + np − n²p² = np(1−p) ✓' },
      ],
      answer: 'E[X] = np, E[X²] = n²p² − np² + np',
    },
    {
      id: 'bin-50', difficulty: 3,
      question: 'A fair die is rolled **60 times**. Estimate P(getting a six **between 8 and 12 times inclusive**) using both the exact binomial and the normal approximation. Compare the results.',
      visual: { kind: 'distribution', type: 'normal', params: { mean: 10, std: 2.887 }, shadeFrom: 8, shadeTo: 12 },
      steps: [
        { label: 'Step 1: Parameters', content: 'n = 60, p = 1/6, μ = 10, σ = √(60 × 1/6 × 5/6) ≈ 2.887' },
        { label: 'Step 2: Normal approximation', content: 'P(7.5 ≤ X ≤ 12.5) → z₁ = (7.5−10)/2.887 ≈ −0.866, z₂ = (12.5−10)/2.887 ≈ 0.866' },
        { label: 'Step 3: From z-table', content: 'P(−0.866 ≤ Z ≤ 0.866) ≈ 2 × 0.3068 ≈ **0.614**' },
        { label: 'Step 4: Exact (by code)', content: 'Exact sum P(8) + P(9) + P(10) + P(11) + P(12) ≈ **0.611**' },
        { label: 'Step 5: Compare', content: 'Normal approximation (0.614) is very close to exact (0.611) — good agreement.' },
      ],
      answer: 'Exact ≈ 0.611, Normal approx ≈ 0.614',
      code: '# Compare exact binomial vs normal approximation\nfrom math import comb, sqrt, erf\n\nn, p = 60, 1/6\n# Compute both exact and normal approximation for P(8 <= X <= 12)\n# Your code here\n',
      codeSolution: 'from math import comb, sqrt, erf\n\nn, p = 60, 1/6\n\n# Exact\nexact = sum(comb(n,k) * p**k * (1-p)**(n-k) for k in range(8,13))\n\n# Normal approximation with continuity correction\nmu = n * p\nsigma = sqrt(n * p * (1 - p))\ndef phi(x):\n    return 0.5 * (1 + erf(x / sqrt(2)))\nnormal = phi((12.5 - mu)/sigma) - phi((7.5 - mu)/sigma)\n\nprint(f"Exact:  {exact:.4f}")\nprint(f"Normal: {normal:.4f}")',
    },
  ],
};


// ─── 2. Correlation & Regression ──────────────────────────────

export const practiceCorrelationRegression: PracticeSet = {
  title: 'Practice — Correlation & Regression',
  problems: [
    // ── Easy (1-17) ────────────────────────────────────────
    {
      id: 'cor-01', difficulty: 1,
      question: 'As study hours increase, test scores increase. Is this a **positive**, **negative**, or **no** correlation?',
      steps: [
        { label: 'Step 1: Direction', content: 'Both variables increase together.' },
        { label: 'Step 2: Classify', content: 'This is a **positive correlation**.' },
      ],
      answer: 'Positive correlation',
    },
    {
      id: 'cor-02', difficulty: 1,
      question: 'As the temperature outside increases, the amount of hot chocolate sold decreases. What type of correlation is this?',
      steps: [
        { label: 'Step 1: Direction', content: 'One variable increases while the other decreases.' },
        { label: 'Step 2: Classify', content: 'This is a **negative correlation**.' },
      ],
      answer: 'Negative correlation',
    },
    {
      id: 'cor-03', difficulty: 1,
      question: 'A student\'s shoe size and their IQ. What type of correlation would you expect?',
      steps: [
        { label: 'Step 1: Think about connection', content: 'Shoe size has no logical relationship to intelligence.' },
        { label: 'Step 2: Classify', content: 'This is **no correlation** (r ≈ 0).' },
      ],
      answer: 'No correlation',
    },
    {
      id: 'cor-04', difficulty: 1,
      question: 'An r value of **−0.85** indicates what kind of correlation?',
      steps: [
        { label: 'Step 1: Sign', content: 'Negative sign → variables move in opposite directions.' },
        { label: 'Step 2: Magnitude', content: '|−0.85| = 0.85, which is close to 1 → strong.' },
      ],
      answer: 'Strong negative correlation',
    },
    {
      id: 'cor-05', difficulty: 1,
      question: 'An r value of **0.12** indicates what kind of correlation?',
      steps: [
        { label: 'Step 1: Sign', content: 'Positive.' },
        { label: 'Step 2: Magnitude', content: '0.12 is close to 0 → very weak.' },
      ],
      answer: 'Weak positive correlation (nearly none)',
    },
    {
      id: 'cor-06', difficulty: 1,
      question: 'The regression equation is ŷ = 2.5x + 10. Predict ŷ when x = 4.',
      steps: [
        { label: 'Step 1: Substitute', content: 'ŷ = 2.5(4) + 10 = 10 + 10 = **20**' },
      ],
      answer: '20',
    },
    {
      id: 'cor-07', difficulty: 1,
      question: 'The regression equation is ŷ = −3x + 50. Predict ŷ when x = 12.',
      steps: [
        { label: 'Step 1: Substitute', content: 'ŷ = −3(12) + 50 = −36 + 50 = **14**' },
      ],
      answer: '14',
    },
    {
      id: 'cor-08', difficulty: 1,
      question: 'If r² = 0.81, what percentage of the variation in y is explained by the regression on x?',
      steps: [
        { label: 'Step 1: Convert', content: 'r² = 0.81 → **81%** of the variation in y is explained by x.' },
      ],
      answer: '81%',
    },
    {
      id: 'cor-09', difficulty: 1,
      question: 'If r = 0.6, what is r²?',
      steps: [
        { label: 'Step 1: Square it', content: 'r² = 0.6² = **0.36**' },
        { label: 'Step 2: Interpret', content: '36% of the variation in y is explained by x.' },
      ],
      answer: 'r² = 0.36 (36%)',
    },
    {
      id: 'cor-10', difficulty: 1,
      question: 'Can the correlation coefficient r ever be greater than 1 or less than −1?',
      steps: [
        { label: 'Step 1: Definition', content: 'By definition, r ranges from −1 to +1.' },
        { label: 'Step 2: Answer', content: '**No**, r is always between −1 and +1 inclusive.' },
      ],
      answer: 'No, −1 ≤ r ≤ 1',
    },
    {
      id: 'cor-11', difficulty: 1,
      question: 'What does it mean when r = 1?',
      steps: [
        { label: 'Step 1: Perfect positive', content: 'All data points lie exactly on a straight line with positive slope.' },
        { label: 'Step 2: Implication', content: 'r² = 1 → 100% of the variation in y is explained by x.' },
      ],
      answer: 'Perfect positive linear relationship',
    },
    {
      id: 'cor-12', difficulty: 1,
      question: 'Given the regression line ŷ = 1.5x + 3, what is the **slope** and what does it mean?',
      steps: [
        { label: 'Step 1: Identify slope', content: 'Slope = **1.5**' },
        { label: 'Step 2: Interpretation', content: 'For each unit increase in x, ŷ increases by 1.5 units on average.' },
      ],
      answer: 'Slope = 1.5; y increases by 1.5 for each unit increase in x',
    },
    {
      id: 'cor-13', difficulty: 1,
      question: 'Given the regression line ŷ = 1.5x + 3, what is the **y-intercept** and what does it mean?',
      steps: [
        { label: 'Step 1: Identify intercept', content: 'y-intercept = **3**' },
        { label: 'Step 2: Interpretation', content: 'When x = 0, the predicted value of y is 3.' },
      ],
      answer: 'y-intercept = 3; predicted y when x = 0',
    },
    {
      id: 'cor-14', difficulty: 1,
      question: 'A study finds that ice cream sales and drowning rates are positively correlated. Does eating ice cream **cause** drowning?',
      hint: 'Think about what other variable might affect both.',
      steps: [
        { label: 'Step 1: Correlation ≠ Causation', content: 'A positive correlation does not imply causation.' },
        { label: 'Step 2: Confounding variable', content: '**Hot weather** is a lurking variable — it increases both ice cream sales and swimming (hence drowning).' },
      ],
      answer: 'No — confounding variable (hot weather) explains both',
    },
    {
      id: 'cor-15', difficulty: 1,
      question: 'If the actual value is y = 25 and the predicted value is ŷ = 22, what is the **residual**?',
      steps: [
        { label: 'Step 1: Formula', content: 'Residual = y − ŷ' },
        { label: 'Step 2: Compute', content: '25 − 22 = **3**' },
        { label: 'Step 3: Interpret', content: 'Positive residual → the actual value is above the regression line.' },
      ],
      answer: 'Residual = 3',
    },
    {
      id: 'cor-16', difficulty: 1,
      question: 'The regression equation is ŷ = 0.8x + 5. If x̄ = 10 and ȳ = 13, does the regression line pass through the point (x̄, ȳ)?',
      steps: [
        { label: 'Step 1: Check', content: 'ŷ at x̄ = 0.8(10) + 5 = 8 + 5 = 13 = ȳ ✓' },
        { label: 'Step 2: Property', content: 'The least-squares regression line **always** passes through (x̄, ȳ).' },
      ],
      answer: 'Yes — the regression line always passes through (x̄, ȳ)',
    },
    {
      id: 'cor-17', difficulty: 1,
      question: 'Which is stronger: r = −0.75 or r = 0.60?',
      steps: [
        { label: 'Step 1: Compare magnitudes', content: '|−0.75| = 0.75 vs |0.60| = 0.60' },
        { label: 'Step 2: Conclusion', content: 'r = −0.75 indicates a **stronger** linear relationship (sign indicates direction, not strength).' },
      ],
      answer: 'r = −0.75 is stronger',
    },

    // ── Medium (18-34) ─────────────────────────────────────
    {
      id: 'cor-18', difficulty: 2,
      question: 'Compute the correlation coefficient r for the data: x = [1, 2, 3, 4, 5], y = [2, 4, 5, 4, 5].',
      visual: { kind: 'scatter', points: [[1,2],[2,4],[3,5],[4,4],[5,5]], showLine: true },
      steps: [
        { label: 'Step 1: Compute means', content: 'x̄ = 3, ȳ = 4' },
        { label: 'Step 2: Deviations', content: 'x−x̄: −2,−1,0,1,2; y−ȳ: −2,0,1,0,1' },
        { label: 'Step 3: Products (x−x̄)(y−ȳ)', content: '4, 0, 0, 0, 2 → Σ = 6' },
        { label: 'Step 4: Sum of squares', content: 'Σ(x−x̄)² = 10, Σ(y−ȳ)² = 6' },
        { label: 'Step 5: r = Σ(x−x̄)(y−ȳ) / √(Σ(x−x̄)² × Σ(y−ȳ)²)', content: 'r = 6 / √(10 × 6) = 6 / √60 = 6/7.746 ≈ **0.775**' },
      ],
      answer: 'r ≈ 0.775',
      code: '# Compute correlation coefficient by hand\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\n\n# Your code here\n',
      codeSolution: 'x = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\nn = len(x)\nx_bar = sum(x) / n\ny_bar = sum(y) / n\nnum = sum((xi - x_bar) * (yi - y_bar) for xi, yi in zip(x, y))\nden_x = sum((xi - x_bar)**2 for xi in x)\nden_y = sum((yi - y_bar)**2 for yi in y)\nr = num / (den_x * den_y) ** 0.5\nprint(f"r = {r:.4f}")',
    },
    {
      id: 'cor-19', difficulty: 2,
      question: 'Using the data x = [1, 2, 3, 4, 5], y = [2, 4, 5, 4, 5], find the **regression line** ŷ = bx + a.',
      visual: { kind: 'scatter', points: [[1,2],[2,4],[3,5],[4,4],[5,5]], showLine: true },
      steps: [
        { label: 'Step 1: Slope b', content: 'b = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)² = 6/10 = **0.6**' },
        { label: 'Step 2: Intercept a', content: 'a = ȳ − b × x̄ = 4 − 0.6 × 3 = 4 − 1.8 = **2.2**' },
        { label: 'Step 3: Equation', content: 'ŷ = **0.6x + 2.2**' },
      ],
      answer: 'ŷ = 0.6x + 2.2',
    },
    {
      id: 'cor-20', difficulty: 2,
      question: 'Using ŷ = 0.6x + 2.2, compute the **residuals** for each point in x = [1,2,3,4,5], y = [2,4,5,4,5].',
      visual: { kind: 'bar-chart', labels: ['x=1','x=2','x=3','x=4','x=5'], values: [-0.8,0.4,0.8,-0.6,0.2] },
      steps: [
        { label: 'Step 1: Predictions', content: 'ŷ: 2.8, 3.4, 4.0, 4.6, 5.2' },
        { label: 'Step 2: Residuals (y − ŷ)', content: '2−2.8=−0.8, 4−3.4=0.6, 5−4.0=1.0, 4−4.6=−0.6, 5−5.2=−0.2' },
        { label: 'Step 3: Sum check', content: '−0.8 + 0.6 + 1.0 + (−0.6) + (−0.2) = **0** ✓ (residuals always sum to 0)' },
      ],
      answer: 'Residuals: −0.8, 0.6, 1.0, −0.6, −0.2 (sum = 0)',
    },
    {
      id: 'cor-21', difficulty: 2,
      question: 'Compute r for: x = [10, 20, 30, 40], y = [25, 20, 15, 10].',
      visual: { kind: 'scatter', points: [[10,25],[20,20],[30,15],[40,10]], showLine: true },
      steps: [
        { label: 'Step 1: Means', content: 'x̄ = 25, ȳ = 17.5' },
        { label: 'Step 2: Deviations', content: 'x−x̄: −15,−5,5,15; y−ȳ: 7.5, 2.5, −2.5, −7.5' },
        { label: 'Step 3: Products', content: '−112.5, −12.5, −12.5, −112.5 → Σ = −250' },
        { label: 'Step 4: SS', content: 'Σ(x−x̄)² = 500, Σ(y−ȳ)² = 125' },
        { label: 'Step 5: r', content: 'r = −250 / √(500 × 125) = −250/250 = **−1.000**' },
      ],
      answer: 'r = −1 (perfect negative linear relationship)',
    },
    {
      id: 'cor-22', difficulty: 2,
      question: 'The data are x = [2, 4, 6, 8, 10], y = [3, 7, 5, 11, 9]. Find the regression line and predict y when x = 7.',
      visual: { kind: 'scatter', points: [[2,3],[4,7],[6,5],[8,11],[10,9]] },
      steps: [
        { label: 'Step 1: Means', content: 'x̄ = 6, ȳ = 7' },
        { label: 'Step 2: Σ(x−x̄)(y−ȳ)', content: '(−4)(−4)+(−2)(0)+(0)(−2)+(2)(4)+(4)(2) = 16+0+0+8+8 = 32' },
        { label: 'Step 3: Σ(x−x̄)²', content: '16+4+0+4+16 = 40' },
        { label: 'Step 4: Slope', content: 'b = 32/40 = 0.8' },
        { label: 'Step 5: Intercept', content: 'a = 7 − 0.8(6) = 2.2' },
        { label: 'Step 6: Predict', content: 'ŷ(7) = 0.8(7) + 2.2 = 5.6 + 2.2 = **7.8**' },
      ],
      answer: 'ŷ = 0.8x + 2.2; prediction at x=7 is 7.8',
    },
    {
      id: 'cor-23', difficulty: 2,
      question: 'A researcher finds r = 0.95 between hours of TV watched and GPA. A reporter writes: "TV watching destroys grades." What is wrong with this conclusion?',
      steps: [
        { label: 'Step 1: Correlation ≠ Causation', content: 'r = 0.95 shows a strong positive correlation, but does NOT prove causation.' },
        { label: 'Step 2: Possible issues', content: '(1) Reverse causation: students with low GPAs might watch more TV. (2) Confounding variables: socioeconomic background, study habits, etc.' },
        { label: 'Step 3: Correct statement', content: 'There is a strong positive association, but a controlled experiment would be needed to establish causation.' },
      ],
      answer: 'Correlation does not imply causation; confounders and reverse causality are possible',
    },
    {
      id: 'cor-24', difficulty: 2,
      question: 'If r = −0.9 for the relationship between exercise (hours/week) and body fat percentage, what is r²? Interpret both.',
      steps: [
        { label: 'Step 1: r²', content: 'r² = (−0.9)² = **0.81**' },
        { label: 'Step 2: Interpret r', content: 'Strong negative relationship: more exercise is associated with lower body fat.' },
        { label: 'Step 3: Interpret r²', content: '81% of the variation in body fat is explained by exercise hours.' },
      ],
      answer: 'r² = 0.81; 81% of body fat variation explained by exercise',
    },
    {
      id: 'cor-25', difficulty: 2,
      question: 'Data: x = [1, 3, 5, 7, 9], y = [10, 8, 7, 4, 1]. Compute the slope b of the regression line.',
      visual: { kind: 'scatter', points: [[1,10],[3,8],[5,7],[7,4],[9,1]], showLine: true },
      steps: [
        { label: 'Step 1: Means', content: 'x̄ = 5, ȳ = 6' },
        { label: 'Step 2: Σ(x−x̄)(y−ȳ)', content: '(−4)(4)+(−2)(2)+(0)(1)+(2)(−2)+(4)(−5) = −16−4+0−4−20 = −44' },
        { label: 'Step 3: Σ(x−x̄)²', content: '16+4+0+4+16 = 40' },
        { label: 'Step 4: Slope', content: 'b = −44/40 = **−1.1**' },
      ],
      answer: 'b = −1.1',
      code: '# Compute slope of regression line\nx = [1, 3, 5, 7, 9]\ny = [10, 8, 7, 4, 1]\n\n# Your code here\n',
      codeSolution: 'x = [1, 3, 5, 7, 9]\ny = [10, 8, 7, 4, 1]\nn = len(x)\nx_bar = sum(x) / n\ny_bar = sum(y) / n\nnum = sum((xi - x_bar) * (yi - y_bar) for xi, yi in zip(x, y))\nden = sum((xi - x_bar)**2 for xi in x)\nb = num / den\na = y_bar - b * x_bar\nprint(f"Slope b = {b:.2f}")\nprint(f"Intercept a = {a:.2f}")\nprint(f"Equation: y = {b:.1f}x + {a:.1f}")',
    },
    {
      id: 'cor-26', difficulty: 2,
      question: 'A dataset has r = 0.7. A new data point that is an **outlier** is added. Can this single point change r to near 0? Explain.',
      steps: [
        { label: 'Step 1: Yes, it can', content: 'A single outlier can dramatically change r, especially in small datasets.' },
        { label: 'Step 2: Example', content: 'If x = [1,2,3,4,5], y = [2,4,6,8,10] gives r = 1.0, adding (3, 100) would pull r toward 0.' },
        { label: 'Step 3: Lesson', content: 'Always check for outliers before relying on r. A **scatter plot** is essential.' },
      ],
      answer: 'Yes — a single outlier can drastically change r',
    },
    {
      id: 'cor-27', difficulty: 2,
      question: 'Given r = 0.775 and the regression line ŷ = 0.6x + 2.2 for the data x = [1,2,3,4,5], y = [2,4,5,4,5], compute **r²** and interpret the fit.',
      steps: [
        { label: 'Step 1: r²', content: 'r² = 0.775² ≈ **0.601**' },
        { label: 'Step 2: Interpretation', content: 'About 60% of the variation in y is explained by the linear relationship with x.' },
        { label: 'Step 3: Assessment', content: 'Moderate fit — some of the variation remains unexplained.' },
      ],
      answer: 'r² ≈ 0.60; moderate fit, 60% of variation explained',
    },
    {
      id: 'cor-28', difficulty: 2,
      question: 'If you swap x and y (predicting x from y), does r change?',
      steps: [
        { label: 'Step 1: r is symmetric', content: 'The formula for r treats x and y symmetrically: r(x,y) = r(y,x).' },
        { label: 'Step 2: Regression line changes', content: 'The slope and intercept of the regression line **do** change, but r stays the same.' },
      ],
      answer: 'No, r stays the same (it is symmetric)',
    },
    {
      id: 'cor-29', difficulty: 2,
      question: 'Data: x = [2, 3, 5, 7, 9], y = [1, 3, 3, 6, 8]. Compute r and the regression equation.',
      visual: { kind: 'scatter', points: [[2,1],[3,3],[5,3],[7,6],[9,8]], showLine: true },
      steps: [
        { label: 'Step 1: Means', content: 'x̄ = 5.2, ȳ = 4.2' },
        { label: 'Step 2: Σ(x−x̄)(y−ȳ)', content: '(−3.2)(−3.2)+(−2.2)(−1.2)+(−0.2)(−1.2)+(1.8)(1.8)+(3.8)(3.8) = 10.24+2.64+0.24+3.24+14.44 = 30.8' },
        { label: 'Step 3: Σ(x−x̄)²', content: '10.24+4.84+0.04+3.24+14.44 = 32.8' },
        { label: 'Step 4: Σ(y−ȳ)²', content: '10.24+1.44+1.44+3.24+14.44 = 30.8' },
        { label: 'Step 5: r', content: 'r = 30.8 / √(32.8 × 30.8) = 30.8 / 31.78 ≈ **0.969**' },
        { label: 'Step 6: Regression', content: 'b = 30.8/32.8 ≈ 0.939, a = 4.2 − 0.939(5.2) ≈ −0.68. ŷ ≈ **0.94x − 0.68**' },
      ],
      answer: 'r ≈ 0.969; ŷ ≈ 0.94x − 0.68',
      code: '# Compute r and regression line\nx = [2, 3, 5, 7, 9]\ny = [1, 3, 3, 6, 8]\n\n# Your code here\n',
      codeSolution: 'x = [2, 3, 5, 7, 9]\ny = [1, 3, 3, 6, 8]\nn = len(x)\nx_bar = sum(x) / n\ny_bar = sum(y) / n\nnum = sum((xi-x_bar)*(yi-y_bar) for xi,yi in zip(x,y))\nsx = sum((xi-x_bar)**2 for xi in x)\nsy = sum((yi-y_bar)**2 for yi in y)\nr = num / (sx*sy)**0.5\nb = num / sx\na = y_bar - b * x_bar\nprint(f"r = {r:.4f}")\nprint(f"y = {b:.3f}x + {a:.3f}")',
    },
    {
      id: 'cor-30', difficulty: 2,
      question: 'A researcher measures height (cm) and weight (kg) for 5 people: heights = [160, 165, 170, 175, 180], weights = [55, 62, 68, 72, 80]. Find the regression equation for predicting weight from height.',
      visual: { kind: 'scatter', points: [[160,55],[165,62],[170,68],[175,72],[180,80]], showLine: true },
      steps: [
        { label: 'Step 1: Means', content: 'x̄ = 170, ȳ = 67.4' },
        { label: 'Step 2: Σ(x−x̄)(y−ȳ)', content: '(−10)(−12.4)+(−5)(−5.4)+(0)(0.6)+(5)(4.6)+(10)(12.6) = 124+27+0+23+126 = 300' },
        { label: 'Step 3: Σ(x−x̄)²', content: '100+25+0+25+100 = 250' },
        { label: 'Step 4: Slope', content: 'b = 300/250 = 1.2' },
        { label: 'Step 5: Intercept', content: 'a = 67.4 − 1.2(170) = 67.4 − 204 = −136.6' },
        { label: 'Step 6: Equation', content: 'Weight = **1.2 × Height − 136.6**' },
      ],
      answer: 'Weight = 1.2 × Height − 136.6',
    },
    {
      id: 'cor-31', difficulty: 2,
      question: 'Identify the **confounding variable**: Cities with more fire stations tend to have more fires. Does building more fire stations cause fires?',
      steps: [
        { label: 'Step 1: No', content: 'Building fire stations does not cause fires.' },
        { label: 'Step 2: Confounding variable', content: '**City size (population)** is the confounding variable. Larger cities have more fire stations AND more fires.' },
      ],
      answer: 'No — city size is the confounding variable',
    },
    {
      id: 'cor-32', difficulty: 2,
      question: 'A dataset has the regression equation ŷ = 2x + 1. The data range for x is [5, 25]. Is it appropriate to predict ŷ at x = 50?',
      steps: [
        { label: 'Step 1: Extrapolation', content: 'x = 50 is far outside the data range [5, 25].' },
        { label: 'Step 2: Danger', content: 'This is **extrapolation** — the linear relationship may not hold beyond the observed range.' },
        { label: 'Step 3: Conclusion', content: 'It is **not appropriate** to predict at x = 50 with confidence.' },
      ],
      answer: 'No — extrapolation beyond data range is unreliable',
    },
    {
      id: 'cor-33', difficulty: 2,
      question: 'If you multiply all x-values by 2, what happens to the correlation r?',
      steps: [
        { label: 'Step 1: Scaling property', content: 'r is unitless and invariant under positive linear transformations.' },
        { label: 'Step 2: Multiplying by 2', content: 'Multiplying x by a positive constant does not change r.' },
        { label: 'Step 3: Note', content: 'Multiplying by a negative constant would flip the sign of r.' },
      ],
      answer: 'r stays the same (multiplying by a positive constant does not change r)',
    },
    {
      id: 'cor-34', difficulty: 2,
      question: 'Data: x = [1, 2, 3, 4, 5], y = [1, 4, 9, 16, 25]. Compute r. Is a linear model appropriate?',
      visual: { kind: 'scatter', points: [[1,1],[2,4],[3,9],[4,16],[5,25]] },
      steps: [
        { label: 'Step 1: Note the pattern', content: 'y = x², which is a perfect quadratic relationship.' },
        { label: 'Step 2: Compute r', content: 'x̄=3, ȳ=11. Σ(x−x̄)(y−ȳ)=(-2)(-10)+(-1)(-7)+(0)(-2)+(1)(5)+(2)(14) = 20+7+0+5+28 = 60. Σ(x−x̄)²=10. Σ(y−ȳ)²=100+49+4+25+196=374. r = 60/√(3740) ≈ **0.981**' },
        { label: 'Step 3: Assessment', content: 'Despite r ≈ 0.98, the relationship is quadratic, not linear. A linear model would systematically mispredict. **A high r does not guarantee linearity.**' },
      ],
      answer: 'r ≈ 0.981 but the relationship is quadratic — linear model is inappropriate',
    },

    // ── Hard (35-50) ───────────────────────────────────────
    {
      id: 'cor-35', difficulty: 3,
      question: 'Compute the **full deviation table** and correlation r for: x = [3, 5, 8, 10, 12, 14], y = [20, 18, 12, 10, 8, 4].',
      visual: { kind: 'scatter', points: [[3,20],[5,18],[8,12],[10,10],[12,8],[14,4]], showLine: true },
      steps: [
        { label: 'Step 1: Means', content: 'x̄ = 52/6 ≈ 8.667, ȳ = 72/6 = 12' },
        { label: 'Step 2: Deviation table', content: '| x | y | x−x̄ | y−ȳ | (x−x̄)(y−ȳ) | (x−x̄)² | (y−ȳ)² |\n|---|---|------|------|-------------|---------|--------|\n| 3 | 20 | −5.667 | 8 | −45.33 | 32.11 | 64 |\n| 5 | 18 | −3.667 | 6 | −22.00 | 13.44 | 36 |\n| 8 | 12 | −0.667 | 0 | 0 | 0.44 | 0 |\n| 10 | 10 | 1.333 | −2 | −2.67 | 1.78 | 4 |\n| 12 | 8 | 3.333 | −4 | −13.33 | 11.11 | 16 |\n| 14 | 4 | 5.333 | −8 | −42.67 | 28.44 | 64 |' },
        { label: 'Step 3: Sums', content: 'Σ(x−x̄)(y−ȳ) = −126, Σ(x−x̄)² = 87.33, Σ(y−ȳ)² = 184' },
        { label: 'Step 4: r', content: 'r = −126 / √(87.33 × 184) = −126 / √16069 = −126/126.77 ≈ **−0.994**' },
      ],
      answer: 'r ≈ −0.994 (very strong negative linear relationship)',
      code: '# Full deviation table and r computation\nx = [3, 5, 8, 10, 12, 14]\ny = [20, 18, 12, 10, 8, 4]\n\n# Your code: print the full deviation table and r\n',
      codeSolution: 'x = [3, 5, 8, 10, 12, 14]\ny = [20, 18, 12, 10, 8, 4]\nn = len(x)\nx_bar = sum(x)/n\ny_bar = sum(y)/n\nprint(f"x̄ = {x_bar:.3f}, ȳ = {y_bar:.3f}\\n")\nprint(f"{\"x\":>4} {\"y\":>4} {\"x-x̄\":>8} {\"y-ȳ\":>8} {\"prod\":>10} {\"(x-x̄)²\":>10} {\"(y-ȳ)²\":>10}")\nsp = sx = sy = 0\nfor xi, yi in zip(x, y):\n    dx, dy = xi - x_bar, yi - y_bar\n    sp += dx*dy; sx += dx**2; sy += dy**2\n    print(f"{xi:4} {yi:4} {dx:8.3f} {dy:8.3f} {dx*dy:10.3f} {dx**2:10.3f} {dy**2:10.3f}")\nr = sp / (sx*sy)**0.5\nprint(f"\\nr = {r:.4f}")',
    },
    {
      id: 'cor-36', difficulty: 3,
      question: 'Prove that the least-squares regression line **always passes through the point (x̄, ȳ)**.',
      steps: [
        { label: 'Step 1: The regression line', content: 'ŷ = bx + a, where b = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)² and a = ȳ − bx̄' },
        { label: 'Step 2: Evaluate at x = x̄', content: 'ŷ = b(x̄) + a = bx̄ + (ȳ − bx̄) = **ȳ**' },
        { label: 'Step 3: Conclusion', content: 'When x = x̄, the predicted value is ȳ, so the line passes through (x̄, ȳ). ∎' },
      ],
      answer: 'Proven: substituting x̄ gives ŷ = ȳ',
    },
    {
      id: 'cor-37', difficulty: 3,
      question: 'Prove that **−1 ≤ r ≤ 1** using the Cauchy-Schwarz inequality.',
      steps: [
        { label: 'Step 1: Cauchy-Schwarz', content: '[Σ(aᵢbᵢ)]² ≤ [Σaᵢ²][Σbᵢ²] for any real sequences a, b.' },
        { label: 'Step 2: Apply', content: 'Let aᵢ = xᵢ − x̄, bᵢ = yᵢ − ȳ. Then [Σ(xᵢ−x̄)(yᵢ−ȳ)]² ≤ [Σ(xᵢ−x̄)²][Σ(yᵢ−ȳ)²]' },
        { label: 'Step 3: Divide', content: 'r² = [Σ(xᵢ−x̄)(yᵢ−ȳ)]² / [Σ(xᵢ−x̄)²·Σ(yᵢ−ȳ)²] ≤ 1' },
        { label: 'Step 4: Conclude', content: 'Since r² ≤ 1, we have **−1 ≤ r ≤ 1**. ∎' },
      ],
      answer: 'Proven via Cauchy-Schwarz: r² ≤ 1 implies −1 ≤ r ≤ 1',
    },
    {
      id: 'cor-38', difficulty: 3,
      question: '**Simpson\'s Paradox**: Group A has r = 0.8, Group B has r = 0.7. When combined, r = −0.3. Explain how this is possible with an example.',
      steps: [
        { label: 'Step 1: Setup', content: 'Suppose Group A: x = [1,2,3], y = [10,12,14] (positive trend, high values). Group B: x = [7,8,9], y = [2,4,6] (positive trend, low values).' },
        { label: 'Step 2: Within groups', content: 'Both groups show positive correlation.' },
        { label: 'Step 3: Combined', content: 'Combined data: x = [1,2,3,7,8,9], y = [10,12,14,2,4,6]. Now x increases while y generally decreases → **negative correlation**.' },
        { label: 'Step 4: Key insight', content: 'The grouping variable (which group) acts as a confounding variable that reverses the apparent relationship.' },
      ],
      answer: 'Subgroups can show opposite trends from the combined data when a confounding variable creates different clusters',
    },
    {
      id: 'cor-39', difficulty: 3,
      question: 'Show that the sum of squared residuals is minimized by the least-squares slope b = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)².',
      steps: [
        { label: 'Step 1: Define SSR', content: 'SSR(b,a) = Σ(yᵢ − bxᵢ − a)². Since a = ȳ − bx̄, substitute: SSR(b) = Σ((yᵢ−ȳ) − b(xᵢ−x̄))²' },
        { label: 'Step 2: Expand', content: 'SSR = Σ(yᵢ−ȳ)² − 2bΣ(xᵢ−x̄)(yᵢ−ȳ) + b²Σ(xᵢ−x̄)²' },
        { label: 'Step 3: Differentiate', content: 'dSSR/db = −2Σ(xᵢ−x̄)(yᵢ−ȳ) + 2bΣ(xᵢ−x̄)² = 0' },
        { label: 'Step 4: Solve', content: 'b = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)². Second derivative = 2Σ(xᵢ−x̄)² > 0 → minimum. ∎' },
      ],
      answer: 'Proven by calculus: setting dSSR/db = 0 gives the OLS formula',
    },
    {
      id: 'cor-40', difficulty: 3,
      question: 'Prove that r² equals the proportion of total variation explained: r² = 1 − SSR/SST, where SST = Σ(yᵢ−ȳ)² and SSR = Σ(yᵢ−ŷᵢ)².',
      steps: [
        { label: 'Step 1: Decomposition', content: 'SST = SSR + SSE, where SSE (regression sum of squares) = Σ(ŷᵢ−ȳ)²' },
        { label: 'Step 2: Express SSE', content: 'ŷᵢ − ȳ = b(xᵢ − x̄), so SSE = b²Σ(xᵢ−x̄)²' },
        { label: 'Step 3: Ratio', content: 'SSE/SST = b²Σ(xᵢ−x̄)² / Σ(yᵢ−ȳ)²' },
        { label: 'Step 4: Substitute b', content: 'b = Sxy/Sxx, so b² = Sxy²/Sxx². Then SSE/SST = Sxy²/(Sxx × Syy) = r²' },
        { label: 'Step 5: Conclude', content: '1 − SSR/SST = SSE/SST = r². ∎' },
      ],
      answer: 'Proven: r² = SSE/SST = 1 − SSR/SST',
    },
    {
      id: 'cor-41', difficulty: 3,
      question: 'An Anscombe-like dataset has 4 different scatterplots, all with r ≈ 0.82 and the same regression line ŷ = 0.5x + 3. Why is this a problem?',
      steps: [
        { label: 'Step 1: Anscombe\'s Quartet', content: 'Four datasets with identical statistical summaries but very different visual patterns.' },
        { label: 'Step 2: Patterns', content: '(1) Normal linear, (2) Curved relationship, (3) Perfect line + one outlier, (4) Vertical cluster + one point defining slope.' },
        { label: 'Step 3: Lesson', content: 'r and the regression equation alone are insufficient. **Always visualize data** — summary statistics can mask non-linearity, outliers, and clustering.' },
      ],
      answer: 'Summary statistics hide data structure; always visualize before fitting',
    },
    {
      id: 'cor-42', difficulty: 3,
      question: 'Compute the regression line and r for: x = [1, 2, 3, 4, 5, 100], y = [2, 4, 6, 8, 10, 12]. Discuss the effect of the outlier at x = 100.',
      visual: { kind: 'scatter', points: [[1,2],[2,4],[3,6],[4,8],[5,10],[100,12]] },
      steps: [
        { label: 'Step 1: Without outlier', content: 'x = [1,2,3,4,5], y = [2,4,6,8,10]: r = 1.0, ŷ = 2x (perfect line)' },
        { label: 'Step 2: With outlier', content: 'x̄ = 115/6 ≈ 19.17, ȳ = 42/6 = 7' },
        { label: 'Step 3: Compute r with outlier', content: 'The outlier at (100, 12) pulls the line nearly flat. r drops significantly because the point is far from the pattern.' },
        { label: 'Step 4: Impact', content: 'b ≈ 0.098, a ≈ 5.12. The slope drops from 2.0 to 0.098 — one outlier destroyed the regression. r drops from 1.0 to about **0.56**.' },
      ],
      answer: 'Outlier at x=100 pulls slope from 2.0 to ~0.1 and r from 1.0 to ~0.56',
      code: '# Show the effect of an outlier on regression\nx_clean = [1, 2, 3, 4, 5]\ny_clean = [2, 4, 6, 8, 10]\nx_outlier = [1, 2, 3, 4, 5, 100]\ny_outlier = [2, 4, 6, 8, 10, 12]\n\n# Compute r and regression for both datasets\n# Your code here\n',
      codeSolution: 'def regress(x, y):\n    n = len(x)\n    xb = sum(x)/n\n    yb = sum(y)/n\n    sp = sum((xi-xb)*(yi-yb) for xi,yi in zip(x,y))\n    sx = sum((xi-xb)**2 for xi in x)\n    sy = sum((yi-yb)**2 for yi in y)\n    r = sp / (sx*sy)**0.5\n    b = sp / sx\n    a = yb - b * xb\n    return r, b, a\n\nfor label, x, y in [("Clean", [1,2,3,4,5], [2,4,6,8,10]),\n                     ("With outlier", [1,2,3,4,5,100], [2,4,6,8,10,12])]:\n    r, b, a = regress(x, y)\n    print(f"{label}: r={r:.3f}, y = {b:.3f}x + {a:.3f}")',
    },
    {
      id: 'cor-43', difficulty: 3,
      question: 'Show that the Pearson correlation r does not capture **nonlinear** relationships. Compute r for x = [−3,−2,−1,0,1,2,3] and y = [9,4,1,0,1,4,9] (a perfect parabola).',
      visual: { kind: 'scatter', points: [[-3,9],[-2,4],[-1,1],[0,0],[1,1],[2,4],[3,9]] },
      steps: [
        { label: 'Step 1: Means', content: 'x̄ = 0, ȳ = 4' },
        { label: 'Step 2: Σ(x−x̄)(y−ȳ)', content: '(−3)(5)+(−2)(0)+(−1)(−3)+(0)(−4)+(1)(−3)+(2)(0)+(3)(5) = −15+0+3+0−3+0+15 = **0**' },
        { label: 'Step 3: r = 0', content: 'r = 0/√(anything) = **0**, even though y is perfectly determined by x (y = x²).' },
        { label: 'Step 4: Lesson', content: 'r only measures LINEAR relationships. A perfect nonlinear relationship can give r = 0.' },
      ],
      answer: 'r = 0 despite a perfect quadratic relationship',
    },
    {
      id: 'cor-44', difficulty: 3,
      question: 'Derive the relationship between the **two regression lines** (y on x and x on y) and show they coincide only when |r| = 1.',
      steps: [
        { label: 'Step 1: Line 1 (y on x)', content: '(y − ȳ) = r(σy/σx)(x − x̄)' },
        { label: 'Step 2: Line 2 (x on y)', content: '(x − x̄) = r(σx/σy)(y − ȳ)' },
        { label: 'Step 3: Rearrange Line 2', content: '(y − ȳ) = (1/r)(σy/σx)(x − x̄)' },
        { label: 'Step 4: Compare slopes', content: 'Slopes are r(σy/σx) and (1/r)(σy/σx). Equal iff r = 1/r → r² = 1 → **|r| = 1**. ∎' },
      ],
      answer: 'The two regression lines coincide iff |r| = 1',
    },
    {
      id: 'cor-45', difficulty: 3,
      question: 'A researcher collects data on advertising spend (x, in thousands $) and revenue (y, in thousands $): x = [10, 15, 20, 25, 30, 35, 40], y = [100, 120, 150, 200, 250, 310, 400]. Compute the regression line and assess whether the linear model is appropriate by examining residuals.',
      visual: { kind: 'scatter', points: [[10,100],[15,120],[20,150],[25,200],[30,250],[35,310],[40,400]], showLine: true },
      steps: [
        { label: 'Step 1: Means', content: 'x̄ = 25, ȳ ≈ 218.57' },
        { label: 'Step 2: Compute sums', content: 'Σ(x−x̄)(y−ȳ) = (−15)(−118.57)+(−10)(−98.57)+(−5)(−68.57)+(0)(−18.57)+(5)(31.43)+(10)(91.43)+(15)(181.43) ≈ 1778.6+985.7+342.9+0+157.1+914.3+2721.4 = 6900' },
        { label: 'Step 3: Σ(x−x̄)²', content: '225+100+25+0+25+100+225 = 700' },
        { label: 'Step 4: Regression', content: 'b = 6900/700 ≈ 9.857, a = 218.57 − 9.857(25) ≈ −27.86. ŷ ≈ 9.86x − 27.86' },
        { label: 'Step 5: Residuals', content: 'Residuals: 100−70.7=29.3, 120−119.9=0.1, 150−169.3=−19.3, 200−218.6=−18.6, 250−267.9=−17.9, 310−317.1=−7.1, 400−366.6=33.4' },
        { label: 'Step 6: Pattern', content: 'Residuals show a U-shape (positive, negative, negative, negative, negative, negative, positive) suggesting the relationship is **curvilinear**, not linear. An exponential or quadratic model would be more appropriate.' },
      ],
      answer: 'ŷ ≈ 9.86x − 27.86; U-shaped residuals suggest nonlinearity',
    },
    {
      id: 'cor-46', difficulty: 3,
      question: 'Given the data x = [2, 4, 6, 8], y = [5, 9, 13, 17], show algebraically that r = 1 and explain why.',
      visual: { kind: 'scatter', points: [[2,5],[4,9],[6,13],[8,17]], showLine: true },
      steps: [
        { label: 'Step 1: Check the pattern', content: 'y = 2x + 1 for each point: 2(2)+1=5 ✓, 2(4)+1=9 ✓, 2(6)+1=13 ✓, 2(8)+1=17 ✓' },
        { label: 'Step 2: Since all points are on a line', content: 'Means: x̄=5, ȳ=11. Deviations: x−x̄ = [−3,−1,1,3], y−ȳ = [−6,−2,2,6]' },
        { label: 'Step 3: Note y−ȳ = 2(x−x̄)', content: 'Σ(x−x̄)(y−ȳ) = 2Σ(x−x̄)² = 2(20) = 40. Σ(y−ȳ)² = 4Σ(x−x̄)² = 4(20) = 80' },
        { label: 'Step 4: r', content: 'r = 40/√(20×80) = 40/√1600 = 40/40 = **1** ∎' },
      ],
      answer: 'r = 1 because all points lie exactly on y = 2x + 1',
    },
    {
      id: 'cor-47', difficulty: 3,
      question: 'Explain the concept of **leverage** in regression. Given x = [1, 2, 3, 4, 20] and y = [3, 5, 7, 9, 11], how does the point (20, 11) affect the regression compared to (20, 50)?',
      steps: [
        { label: 'Step 1: Leverage', content: 'A point has high leverage if its x-value is far from x̄. High-leverage points strongly influence the slope.' },
        { label: 'Step 2: With (20, 11)', content: 'x̄ = 6, so (20, 11) has high leverage. Without it, slope ≈ 2, intercept ≈ 1. With it, the slope is pulled toward the flat line connecting (6, 7) to (20, 11), giving b ≈ 0.52.' },
        { label: 'Step 3: With (20, 50)', content: 'Now the outlier pulls the slope UP dramatically (toward the steep line connecting the mean to (20, 50)), giving b ≈ 2.7.' },
        { label: 'Step 4: Key point', content: 'High-leverage points can either reinforce or distort the trend, depending on their y-value.' },
      ],
      answer: 'High leverage (extreme x) amplifies influence; (20,11) flattens the line while (20,50) steepens it',
    },
    {
      id: 'cor-48', difficulty: 3,
      question: 'Prove that the residuals from a least-squares regression sum to zero, i.e., Σ(yᵢ − ŷᵢ) = 0.',
      steps: [
        { label: 'Step 1: Write residuals', content: 'Σ(yᵢ − ŷᵢ) = Σyᵢ − Σ(bxᵢ + a) = Σyᵢ − bΣxᵢ − na' },
        { label: 'Step 2: Recall a = ȳ − bx̄', content: 'na = n(ȳ − bx̄) = Σyᵢ − bΣxᵢ' },
        { label: 'Step 3: Substitute', content: 'Σyᵢ − bΣxᵢ − (Σyᵢ − bΣxᵢ) = **0** ∎' },
      ],
      answer: 'Proven: residuals sum to 0 by the definition of the intercept',
    },
    {
      id: 'cor-49', difficulty: 3,
      question: 'Two variables X and Y have r = 0. Does this mean X and Y are **independent**? Provide a counterexample.',
      steps: [
        { label: 'Step 1: No', content: 'r = 0 means no **linear** relationship, but there could be a nonlinear one.' },
        { label: 'Step 2: Counterexample', content: 'Let X ~ Uniform(−1, 1) and Y = X². Then E[XY] = E[X³] = 0 and E[X]E[Y] = 0, so Cov(X,Y) = 0 and r = 0. But Y is completely determined by X — they are maximally dependent.' },
        { label: 'Step 3: Independence', content: 'Independence implies r = 0, but r = 0 does NOT imply independence (converse is false).' },
      ],
      answer: 'No; r = 0 only means no linear relationship. Y = X² gives r = 0 but total dependence.',
    },
    {
      id: 'cor-50', difficulty: 3,
      question: 'Compute the **Spearman rank correlation** for x = [10, 20, 30, 40, 50] and y = [1, 4, 9, 16, 25]. Compare to Pearson r and explain when Spearman is preferred.',
      visual: { kind: 'scatter', points: [[10,1],[20,4],[30,9],[40,16],[50,25]], showLine: false },
      steps: [
        { label: 'Step 1: Assign ranks', content: 'Ranks of x: [1,2,3,4,5]. Ranks of y: [1,2,3,4,5].' },
        { label: 'Step 2: Spearman rₛ', content: 'Since ranks are identical, rₛ = **1.0** (perfect monotonic relationship).' },
        { label: 'Step 3: Pearson r', content: 'The Pearson r for the original data (x vs y = (x/10)²) would be less than 1 because the relationship is nonlinear (quadratic). Pearson r ≈ 0.981.' },
        { label: 'Step 4: When to use Spearman', content: 'Use Spearman when: (1) the relationship is monotonic but not linear, (2) data has outliers, (3) data is ordinal. It captures any monotonic trend, not just linear.' },
      ],
      answer: 'Spearman rₛ = 1.0 (perfect monotonic); Pearson r ≈ 0.981; Spearman preferred for nonlinear monotonic relationships',
      code: '# Compare Pearson and Spearman correlations\nx = [10, 20, 30, 40, 50]\ny = [1, 4, 9, 16, 25]\n\n# Compute both Pearson r and Spearman rank correlation\n# Your code here\n',
      codeSolution: 'x = [10, 20, 30, 40, 50]\ny = [1, 4, 9, 16, 25]\nn = len(x)\n\n# Pearson\nxb = sum(x)/n\nyb = sum(y)/n\nsp = sum((xi-xb)*(yi-yb) for xi,yi in zip(x,y))\nsx = sum((xi-xb)**2 for xi in x)\nsy = sum((yi-yb)**2 for yi in y)\npearson = sp / (sx*sy)**0.5\n\n# Spearman (rank then Pearson on ranks)\ndef rank(vals):\n    s = sorted(range(n), key=lambda i: vals[i])\n    r = [0]*n\n    for i, idx in enumerate(s): r[idx] = i + 1\n    return r\n\nrx = rank(x)\nry = rank(y)\nrxb = sum(rx)/n\nryb = sum(ry)/n\nsp2 = sum((a-rxb)*(b-ryb) for a,b in zip(rx,ry))\nsx2 = sum((a-rxb)**2 for a in rx)\nsy2 = sum((b-ryb)**2 for b in ry)\nspearman = sp2 / (sx2*sy2)**0.5\n\nprint(f"Pearson r  = {pearson:.4f}")\nprint(f"Spearman rₛ = {spearman:.4f}")',
    },
  ],
};
