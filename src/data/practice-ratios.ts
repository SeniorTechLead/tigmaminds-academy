// ============================================================
// PRACTICE PROBLEMS — Ratios, Proportions & Percentages
// ============================================================
import type { PracticeSet } from './reference';

// ─── 1. Ratios ──────────────────────────────────────────────

export const practiceRatios: PracticeSet = {
  title: 'Practice — Ratios',
  problems: [
    {
      id: 'rt-01', difficulty: 1,
      question: 'Simplify the ratio **18 : 24** to its lowest form.',
      steps: [
        { label: 'Step 1: GCD(18, 24)', content: '6' },
        { label: 'Step 2: Divide both by 6', content: '18 ÷ 6 = 3, 24 ÷ 6 = 4' },
        { label: 'Step 3: Result', content: '**3 : 4**' },
      ],
      answer: '3 : 4',
    },
    {
      id: 'rt-02', difficulty: 1,
      question: 'A class has 30 students. The boys-to-girls ratio is **2 : 3**. How many boys are there?',
      steps: [
        { label: 'Step 1: Total parts', content: '2 + 3 = 5 parts' },
        { label: 'Step 2: Each part', content: '30 ÷ 5 = 6 students per part' },
        { label: 'Step 3: Boys', content: '2 × 6 = **12 boys**' },
      ],
      answer: '12 boys',
    },
    {
      id: 'rt-03', difficulty: 2,
      question: 'A pitha mix has 4 cups of flour, 2 cups of jaggery and 1 cup of coconut. What is the ratio of **flour : jaggery : coconut** in lowest form?',
      steps: [
        { label: 'Step 1: Write the ratio', content: '4 : 2 : 1' },
        { label: 'Step 2: GCD of 4, 2, 1', content: '1 — already lowest form' },
        { label: 'Step 3: Result', content: '**4 : 2 : 1**' },
      ],
      answer: '4 : 2 : 1',
    },
    {
      id: 'rt-04', difficulty: 2,
      question: 'On a 1 : 25,000 map, two villages are **6 cm** apart. How far apart are they in real life?',
      steps: [
        { label: 'Step 1: 1 cm on map = 25,000 cm in reality', content: '= 250 m per cm' },
        { label: 'Step 2: 6 cm on map', content: '6 × 250 = 1,500 m' },
        { label: 'Step 3: Convert to km', content: '**1.5 km**' },
      ],
      answer: '1.5 km',
    },
    {
      id: 'rt-05', difficulty: 3,
      question: 'A sum of ₹4,800 is to be divided among Tara, Bipin, and a third friend in the ratio **5 : 3 : 4**. How much does each get?',
      steps: [
        { label: 'Step 1: Total parts', content: '5 + 3 + 4 = 12 parts' },
        { label: 'Step 2: Each part', content: '4800 ÷ 12 = ₹400' },
        { label: 'Step 3: Shares', content: 'Tara: 5 × 400 = **₹2,000**. Bipin: 3 × 400 = **₹1,200**. Third: 4 × 400 = **₹1,600**.' },
        { label: 'Step 4: Check', content: '2000 + 1200 + 1600 = 4800 ✓' },
      ],
      answer: 'Tara ₹2,000, Bipin ₹1,200, third ₹1,600',
      code: 'total = 4800\nratio = [5, 3, 4]\n# Compute each share\n',
      codeSolution: 'total = 4800\nratio = [5, 3, 4]\nunit = total / sum(ratio)\nshares = [r * unit for r in ratio]\nprint(shares)',
    },
  ],
};

// ─── 2. Proportions ─────────────────────────────────────────

export const practiceProportions: PracticeSet = {
  title: 'Practice — Proportions',
  problems: [
    {
      id: 'pp-01', difficulty: 1,
      question: 'If **5 mangoes cost ₹100**, how much do **8 mangoes** cost (at the same rate)?',
      steps: [
        { label: 'Step 1: Set up the proportion', content: '5/100 = 8/x' },
        { label: 'Step 2: Cross-multiply', content: '5x = 800' },
        { label: 'Step 3: Solve', content: 'x = **₹160**' },
      ],
      answer: '₹160',
    },
    {
      id: 'pp-02', difficulty: 2,
      question: 'A pitha recipe for **4 people** uses **800 g** of rice flour. How much flour for **15 people**?',
      steps: [
        { label: 'Step 1: Scaling factor', content: '15 ÷ 4 = 3.75' },
        { label: 'Step 2: Multiply flour by 3.75', content: '800 × 3.75 = **3,000 g** = 3 kg' },
      ],
      answer: '3,000 g (3 kg)',
    },
    {
      id: 'pp-03', difficulty: 2,
      question: 'If **6 workers** can build a wall in **15 days**, how many days for **9 workers** (assuming equal output)?',
      steps: [
        { label: 'Step 1: Recognise inverse proportion', content: 'workers × days = constant' },
        { label: 'Step 2: Constant = 6 × 15', content: '90 worker-days' },
        { label: 'Step 3: For 9 workers', content: '90 ÷ 9 = **10 days**' },
      ],
      answer: '10 days',
      hint: 'Inverse proportion: more workers, less time. The product worker × time stays the same.',
    },
    {
      id: 'pp-04', difficulty: 3,
      question: 'If a car travels **240 km** on **20 litres** of petrol, how far on **35 litres**?',
      steps: [
        { label: 'Step 1: Direct proportion (km ∝ litres)', content: '240/20 = x/35' },
        { label: 'Step 2: Simplify', content: 'Mileage = 12 km/litre' },
        { label: 'Step 3: For 35 litres', content: '35 × 12 = **420 km**' },
      ],
      answer: '420 km',
    },
    {
      id: 'pp-05', difficulty: 3,
      question: 'If 8 machines produce 240 units in 6 hours, how many machines are needed to produce **450 units in 5 hours**?',
      steps: [
        { label: 'Step 1: Rate per machine per hour', content: '240 / (8 × 6) = 5 units/machine/hour' },
        { label: 'Step 2: Total machine-hours needed', content: '450 / 5 = 90 machine-hours' },
        { label: 'Step 3: For 5 hours', content: '90 ÷ 5 = **18 machines**' },
      ],
      answer: '18 machines',
    },
  ],
};

// ─── 3. Percentages ─────────────────────────────────────────

export const practicePercentages: PracticeSet = {
  title: 'Practice — Percentages',
  problems: [
    {
      id: 'pc-01', difficulty: 1,
      question: 'What is **15% of 80**?',
      steps: [
        { label: 'Step 1: Convert 15% to decimal', content: '0.15' },
        { label: 'Step 2: Multiply', content: '0.15 × 80 = **12**' },
      ],
      answer: '12',
    },
    {
      id: 'pc-02', difficulty: 1,
      question: 'A book costs ₹250 with **18% GST** added. What is the total bill?',
      steps: [
        { label: 'Step 1: GST amount', content: '0.18 × 250 = ₹45' },
        { label: 'Step 2: Total', content: '250 + 45 = **₹295**' },
      ],
      answer: '₹295',
    },
    {
      id: 'pc-03', difficulty: 2,
      question: '72 students out of 90 passed an exam. What percentage **failed**?',
      steps: [
        { label: 'Step 1: Number who failed', content: '90 − 72 = 18' },
        { label: 'Step 2: Fraction', content: '18/90 = 0.20' },
        { label: 'Step 3: Convert to percentage', content: '**20%**' },
      ],
      answer: '20%',
    },
    {
      id: 'pc-04', difficulty: 2,
      question: 'A quantity is increased by **25%** and then decreased by **20%**. Is the result more, less, or equal to the original?',
      steps: [
        { label: 'Step 1: Express as decimal multipliers', content: '× 1.25, then × 0.80' },
        { label: 'Step 2: Combined', content: '1.25 × 0.80 = 1.00' },
        { label: 'Step 3: Result', content: '**Equal to the original.**' },
      ],
      answer: 'Equal — back to the original',
      hint: 'Special case: a 25% increase exactly cancels a 20% decrease.',
    },
    {
      id: 'pc-05', difficulty: 3,
      question: 'A savings account has **₹10,000** at **6% per year**, compounded annually. Balance after **5 years**?',
      steps: [
        { label: 'Step 1: Formula', content: 'Final = P × (1 + r)ⁿ = 10,000 × 1.06⁵' },
        { label: 'Step 2: Compute 1.06⁵', content: '1.3382...' },
        { label: 'Step 3: Multiply', content: '10,000 × 1.3382 ≈ **₹13,382**' },
      ],
      answer: '≈ ₹13,382',
      code: 'principal = 10000\nrate = 0.06\nyears = 5\n# Compute balance after 5 years\n',
      codeSolution: 'principal = 10000\nrate = 0.06\nyears = 5\nfinal = principal * (1 + rate) ** years\nprint(f"₹{final:,.2f}")',
    },
    {
      id: 'pc-06', difficulty: 3,
      question: 'Use the **Rule of 72** to estimate how long ₹5,000 takes to **double** at **9%** annual interest.',
      steps: [
        { label: 'Step 1: Rule of 72', content: 'Doubling time ≈ 72 / r' },
        { label: 'Step 2: Plug in', content: '72 / 9 = **8 years**' },
        { label: 'Step 3: Verify', content: '1.09⁸ = 1.99 ≈ 2 ✓' },
      ],
      answer: '~8 years',
    },
  ],
};

// ─── 4. Real-World Applications ────────────────────────────

export const practiceRealWorld: PracticeSet = {
  title: 'Practice — Real-World Applications',
  problems: [
    {
      id: 'rw-01', difficulty: 1,
      question: 'A football team plays **25 matches** and wins **17**. What is the win percentage?',
      steps: [
        { label: 'Step 1: Fraction', content: '17 / 25' },
        { label: 'Step 2: Multiply by 100', content: '(17/25) × 100 = **68%**' },
      ],
      answer: '68%',
    },
    {
      id: 'rw-02', difficulty: 2,
      question: 'Brand A: **400 g** for **₹360**. Brand B: **500 g** for ₹**425**. Which is cheaper per gram?',
      steps: [
        { label: 'Step 1: A per gram', content: '360 / 400 = ₹0.90/g' },
        { label: 'Step 2: B per gram', content: '425 / 500 = ₹0.85/g' },
        { label: 'Step 3: Compare', content: '**B is cheaper** (₹0.05/g less)' },
      ],
      answer: 'Brand B (₹0.85/g vs ₹0.90/g)',
    },
    {
      id: 'rw-03', difficulty: 2,
      question: 'Bipin\'s tea blend: **60% Assam, 25% Darjeeling, 15% Nilgiri**. He makes **2.5 kg** of blend. How many grams of each?',
      steps: [
        { label: 'Step 1: 2.5 kg = 2,500 g', content: '— ' },
        { label: 'Step 2: Assam', content: '0.60 × 2500 = **1,500 g**' },
        { label: 'Step 3: Darjeeling', content: '0.25 × 2500 = **625 g**' },
        { label: 'Step 4: Nilgiri', content: '0.15 × 2500 = **375 g**' },
        { label: 'Step 5: Check sum', content: '1500 + 625 + 375 = 2500 ✓' },
      ],
      answer: '1,500 g Assam, 625 g Darjeeling, 375 g Nilgiri',
    },
    {
      id: 'rw-04', difficulty: 3,
      question: 'A disease has **R₀ = 4**. What fraction of the population must be immune to stop the spread?',
      steps: [
        { label: 'Step 1: Herd immunity formula', content: '1 − 1/R₀' },
        { label: 'Step 2: Plug in', content: '1 − 1/4 = 3/4' },
        { label: 'Step 3: As percentage', content: '**75%**' },
      ],
      answer: '75% must be immune',
    },
    {
      id: 'rw-05', difficulty: 3,
      question: 'A cricket batter has **2,400 runs in 45 innings** (average 53.33). She wants to raise her average to **55** over the next **5 innings**. What is the **minimum total runs** needed in those 5 innings?',
      steps: [
        { label: 'Step 1: Target career runs', content: '55 × 50 = 2,750' },
        { label: 'Step 2: Runs already scored', content: '2,400' },
        { label: 'Step 3: Runs needed in next 5 innings', content: '2,750 − 2,400 = **350 runs**' },
        { label: 'Step 4: Per innings (average)', content: '350 / 5 = 70 runs/innings' },
      ],
      answer: '350 runs (an average of 70 per innings)',
    },
  ],
};
