// ============================================================
// PRACTICE PROBLEMS — Probability & Combinatorics
//
// 50 problems across 5 concept areas, difficulty 1/2/3, with
// step-by-step hand solutions, visuals, and Python code variants.
// ============================================================

import type { PracticeSet } from './reference';

export const practiceProbability: PracticeSet = {
  title: 'Practice — Probability & Combinatorics',
  problems: [

    // ════════════════════════════════════════════════════════════
    // 1. BASIC PROBABILITY (prob-01 → prob-10)
    // ════════════════════════════════════════════════════════════

    {
      id: 'prob-01', difficulty: 1,
      question: 'A standard die is rolled once. What is the probability of rolling a **5**?',
      visual: { kind: 'dice', count: 1, values: [5] },
      steps: [
        { label: 'Step 1: Count favorable outcomes', content: 'Only one face shows 5, so favorable = **1**' },
        { label: 'Step 2: Count total outcomes', content: 'A die has **6** faces' },
        { label: 'Step 3: Apply P = favorable / total', content: 'P(5) = 1/6 ≈ **0.1667**' },
      ],
      answer: '1/6 ≈ 0.1667',
      code: '# What is P(rolling a 5) on a fair die?\n\n# Your code here\n',
      codeSolution: 'favorable = 1\ntotal = 6\nprob = favorable / total\nprint(f"P(rolling a 5) = {favorable}/{total} = {prob:.4f}")',
    },
    {
      id: 'prob-02', difficulty: 1,
      question: 'A fair coin is flipped once. What is the probability of getting **heads**?',
      visual: { kind: 'coins', count: 1, heads: 1 },
      steps: [
        { label: 'Step 1: Count favorable outcomes', content: 'Heads is **1** outcome' },
        { label: 'Step 2: Count total outcomes', content: 'Coin has **2** sides: heads and tails' },
        { label: 'Step 3: Compute', content: 'P(H) = 1/2 = **0.5**' },
      ],
      answer: '1/2 = 0.5',
      code: '# What is P(heads) on a fair coin?\n\n# Your code here\n',
      codeSolution: 'prob = 1 / 2\nprint(f"P(heads) = 1/2 = {prob}")',
    },
    {
      id: 'prob-03', difficulty: 1,
      question: 'A card is drawn at random from a standard 52-card deck. What is the probability that it is a **heart**?',
      visual: { kind: 'cards', drawn: ['A♥'] },
      steps: [
        { label: 'Step 1: Count hearts', content: 'There are **13** hearts in a deck' },
        { label: 'Step 2: Total cards', content: '**52** cards total' },
        { label: 'Step 3: Compute', content: 'P(heart) = 13/52 = **1/4 = 0.25**' },
      ],
      answer: '1/4 = 0.25',
      code: '# P(drawing a heart from a 52-card deck)\n\n# Your code here\n',
      codeSolution: 'favorable = 13\ntotal = 52\nprob = favorable / total\nprint(f"P(heart) = {favorable}/{total} = {prob}")',
    },
    {
      id: 'prob-04', difficulty: 2,
      question: 'Two dice are rolled. What is the probability that the **sum is 7**?',
      visual: { kind: 'dice', count: 2, values: [3, 4] },
      steps: [
        { label: 'Step 1: Total outcomes', content: '6 × 6 = **36** possible outcomes' },
        { label: 'Step 2: List favorable pairs', content: '(1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → **6** pairs' },
        { label: 'Step 3: Compute', content: 'P(sum = 7) = 6/36 = **1/6 ≈ 0.1667**' },
      ],
      answer: '1/6 ≈ 0.1667',
      code: '# P(sum of two dice = 7)\n\n# Your code here\n',
      codeSolution: 'favorable = 0\nfor d1 in range(1, 7):\n    for d2 in range(1, 7):\n        if d1 + d2 == 7:\n            favorable += 1\ntotal = 36\nprint(f"P(sum=7) = {favorable}/{total} = {favorable/total:.4f}")',
    },
    {
      id: 'prob-05', difficulty: 1,
      question: 'A bag contains 3 red, 4 blue, and 5 green marbles. One marble is drawn at random. What is the probability that it is **not green**?',
      visual: { kind: 'bar-chart', labels: ['Red', 'Blue', 'Green'], values: [3, 4, 5] },
      steps: [
        { label: 'Step 1: Total marbles', content: '3 + 4 + 5 = **12**' },
        { label: 'Step 2: Use complement rule', content: 'P(not green) = 1 − P(green) = 1 − 5/12 = **7/12**' },
        { label: 'Alternative', content: 'Favorable (red + blue) = 3 + 4 = 7, so P = 7/12 ≈ **0.5833**' },
      ],
      answer: '7/12 ≈ 0.5833',
      code: '# P(not green) from a bag of 3 red, 4 blue, 5 green\n\n# Your code here\n',
      codeSolution: 'red, blue, green = 3, 4, 5\ntotal = red + blue + green\nprob = 1 - green / total\nprint(f"P(not green) = {red + blue}/{total} = {prob:.4f}")',
    },
    {
      id: 'prob-06', difficulty: 2,
      question: 'A fair coin is flipped **3 times**. What is the probability of getting **exactly 2 heads**?',
      visual: { kind: 'coins', count: 3, heads: 2 },
      steps: [
        { label: 'Step 1: Total outcomes', content: '2³ = **8** possible sequences' },
        { label: 'Step 2: Count sequences with exactly 2 heads', content: 'HHT, HTH, THH → **3** sequences' },
        { label: 'Step 3: Using combinations', content: 'C(3,2) = 3, so P = 3/8 = **0.375**' },
      ],
      answer: '3/8 = 0.375',
      code: '# P(exactly 2 heads in 3 coin flips)\n\n# Your code here\n',
      codeSolution: 'from math import comb\nfavorable = comb(3, 2)  # ways to choose which 2 flips are heads\ntotal = 2 ** 3\nprob = favorable / total\nprint(f"P(exactly 2H in 3 flips) = {favorable}/{total} = {prob}")',
    },
    {
      id: 'prob-07', difficulty: 2,
      question: 'What is the probability of drawing a **face card** (J, Q, K) from a standard deck?',
      visual: { kind: 'cards', drawn: ['J♠', 'Q♦', 'K♣'] },
      steps: [
        { label: 'Step 1: Count face cards', content: '3 face cards per suit × 4 suits = **12**' },
        { label: 'Step 2: Total cards', content: '**52**' },
        { label: 'Step 3: Compute', content: 'P = 12/52 = **3/13 ≈ 0.2308**' },
      ],
      answer: '3/13 ≈ 0.2308',
      code: '# P(drawing a face card from a standard deck)\n\n# Your code here\n',
      codeSolution: 'face_cards = 3 * 4  # J, Q, K in each of 4 suits\ntotal = 52\nprob = face_cards / total\nprint(f"P(face card) = {face_cards}/{total} = {prob:.4f}")',
    },
    {
      id: 'prob-08', difficulty: 3,
      question: 'Two dice are rolled. What is the probability that the sum is **at least 10**?',
      visual: { kind: 'dice', count: 2, values: [5, 6] },
      steps: [
        { label: 'Step 1: Total outcomes', content: '6 × 6 = **36**' },
        { label: 'Step 2: List sums ≥ 10', content: 'Sum 10: (4,6),(5,5),(6,4) → 3\nSum 11: (5,6),(6,5) → 2\nSum 12: (6,6) → 1\nTotal favorable = **6**' },
        { label: 'Step 3: Compute', content: 'P(sum ≥ 10) = 6/36 = **1/6 ≈ 0.1667**' },
      ],
      answer: '1/6 ≈ 0.1667',
      code: '# P(sum of two dice >= 10)\n\n# Your code here\n',
      codeSolution: 'favorable = 0\nfor d1 in range(1, 7):\n    for d2 in range(1, 7):\n        if d1 + d2 >= 10:\n            favorable += 1\ntotal = 36\nprint(f"P(sum >= 10) = {favorable}/{total} = {favorable/total:.4f}")',
    },
    {
      id: 'prob-09', difficulty: 3,
      question: 'A card is drawn from a standard 52-card deck. What is the probability that it is a **red card or an ace**?',
      visual: { kind: 'cards', drawn: ['A♠', '5♥', '8♦'] },
      steps: [
        { label: 'Step 1: Count red cards', content: '26 (13 hearts + 13 diamonds)' },
        { label: 'Step 2: Count aces', content: '4 aces total' },
        { label: 'Step 3: Subtract overlap (red aces)', content: '2 red aces (A♥, A♦)' },
        { label: 'Step 4: Inclusion-Exclusion', content: 'P = (26 + 4 − 2)/52 = 28/52 = **7/13 ≈ 0.5385**' },
      ],
      answer: '7/13 ≈ 0.5385',
      code: '# P(red card OR ace) using inclusion-exclusion\n\n# Your code here\n',
      codeSolution: 'red = 26\naces = 4\nred_aces = 2  # overlap\nfavorable = red + aces - red_aces\ntotal = 52\nprob = favorable / total\nprint(f"P(red or ace) = {favorable}/{total} = {prob:.4f}")',
    },
    {
      id: 'prob-10', difficulty: 3,
      question: 'Three dice are rolled. What is the probability that **all three show different numbers**?',
      visual: { kind: 'dice', count: 3, values: [2, 4, 6] },
      steps: [
        { label: 'Step 1: Total outcomes', content: '6³ = **216**' },
        { label: 'Step 2: Favorable — sequential counting', content: '1st die: 6 choices, 2nd die: 5 remaining, 3rd die: 4 remaining\nFavorable = 6 × 5 × 4 = **120**' },
        { label: 'Step 3: Compute', content: 'P = 120/216 = **5/9 ≈ 0.5556**' },
      ],
      answer: '5/9 ≈ 0.5556',
      code: '# P(all three dice show different numbers)\n\n# Your code here\n',
      codeSolution: 'favorable = 6 * 5 * 4\ntotal = 6 ** 3\nprob = favorable / total\nprint(f"P(all different) = {favorable}/{total} = {prob:.4f}")',
    },

    // ════════════════════════════════════════════════════════════
    // 2. PERMUTATIONS & COMBINATIONS (prob-11 → prob-20)
    // ════════════════════════════════════════════════════════════

    {
      id: 'prob-11', difficulty: 1,
      question: 'How many ways can you arrange **4 different books** on a shelf?',
      steps: [
        { label: 'Step 1: Recognize this is a permutation', content: 'Arranging all 4 books = **4!**' },
        { label: 'Step 2: Compute', content: '4! = 4 × 3 × 2 × 1 = **24**' },
      ],
      answer: '24',
      code: '# How many ways to arrange 4 books?\n\n# Your code here\n',
      codeSolution: 'from math import factorial\nresult = factorial(4)\nprint(f"4! = {result}")',
    },
    {
      id: 'prob-12', difficulty: 1,
      question: 'From a group of **10 students**, how many ways can you choose a **committee of 3**?',
      steps: [
        { label: 'Step 1: Order does not matter → combination', content: 'C(10, 3) = 10! / (3! × 7!)' },
        { label: 'Step 2: Compute', content: '(10 × 9 × 8) / (3 × 2 × 1) = 720/6 = **120**' },
      ],
      answer: '120',
      code: '# C(10, 3) — choosing 3 from 10\n\n# Your code here\n',
      codeSolution: 'from math import comb\nresult = comb(10, 3)\nprint(f"C(10,3) = {result}")',
    },
    {
      id: 'prob-13', difficulty: 1,
      question: 'How many 3-letter **arrangements** (permutations) can be made from the letters A, B, C, D, E (no repeats)?',
      steps: [
        { label: 'Step 1: This is P(5, 3)', content: 'Choose 3 from 5, order matters' },
        { label: 'Step 2: Compute', content: 'P(5, 3) = 5 × 4 × 3 = **60**' },
      ],
      answer: '60',
      code: '# P(5, 3) — 3-letter arrangements from 5 letters\n\n# Your code here\n',
      codeSolution: 'from math import perm\nresult = perm(5, 3)\nprint(f"P(5,3) = {result}")',
    },
    {
      id: 'prob-14', difficulty: 1,
      question: 'A pizza shop offers **8 toppings**. How many ways can you choose **2 toppings**?',
      steps: [
        { label: 'Step 1: Order does not matter', content: 'This is C(8, 2)' },
        { label: 'Step 2: Compute', content: 'C(8,2) = (8 × 7) / (2 × 1) = **28**' },
      ],
      answer: '28',
      code: '# C(8, 2) — choosing 2 toppings from 8\n\n# Your code here\n',
      codeSolution: 'from math import comb\nresult = comb(8, 2)\nprint(f"C(8,2) = {result}")',
    },
    {
      id: 'prob-15', difficulty: 2,
      question: 'How many distinct ways can the letters in **MISSISSIPPI** be arranged?',
      visual: { kind: 'bar-chart', labels: ['M', 'I', 'S', 'P'], values: [1, 4, 4, 2] },
      steps: [
        { label: 'Step 1: Count letters', content: 'M=1, I=4, S=4, P=2 → total = **11** letters' },
        { label: 'Step 2: Use multinomial formula', content: '11! / (1! × 4! × 4! × 2!)' },
        { label: 'Step 3: Compute', content: '39916800 / (1 × 24 × 24 × 2) = 39916800 / 1152 = **34,650**' },
      ],
      answer: '34,650',
      code: '# Distinct arrangements of MISSISSIPPI\n\n# Your code here\n',
      codeSolution: 'from math import factorial\nn = factorial(11)\nd = factorial(1) * factorial(4) * factorial(4) * factorial(2)\nresult = n // d\nprint(f"Arrangements = {result}")',
    },
    {
      id: 'prob-16', difficulty: 1,
      question: 'A lock has a **4-digit code** where each digit is 0–9 and **digits may repeat**. How many possible codes are there?',
      steps: [
        { label: 'Step 1: Each position has 10 choices', content: 'Digits 0–9, repetition allowed' },
        { label: 'Step 2: Multiplication principle', content: '10 × 10 × 10 × 10 = 10⁴ = **10,000**' },
      ],
      answer: '10,000',
      code: '# Total 4-digit codes with repetition\n\n# Your code here\n',
      codeSolution: 'codes = 10 ** 4\nprint(f"Total codes = {codes}")',
    },
    {
      id: 'prob-17', difficulty: 2,
      question: 'From a standard 52-card deck, how many **5-card poker hands** are possible?',
      visual: { kind: 'cards', drawn: ['A♠', 'K♠', 'Q♠', 'J♠', '10♠'] },
      steps: [
        { label: 'Step 1: Order does not matter in a hand', content: 'This is C(52, 5)' },
        { label: 'Step 2: Compute', content: 'C(52,5) = 52! / (5! × 47!) = **2,598,960**' },
      ],
      answer: '2,598,960',
      code: '# Number of 5-card poker hands from 52 cards\n\n# Your code here\n',
      codeSolution: 'from math import comb\nresult = comb(52, 5)\nprint(f"C(52,5) = {result:,}")',
    },
    {
      id: 'prob-18', difficulty: 3,
      question: 'A round table seats **8 people**. How many distinct **circular arrangements** are possible?',
      steps: [
        { label: 'Step 1: Circular permutation formula', content: 'Fix one person to remove rotational symmetry → (n−1)!' },
        { label: 'Step 2: Compute', content: '(8−1)! = 7! = **5,040**' },
      ],
      answer: '5,040',
      code: '# Circular arrangements of 8 people\n\n# Your code here\n',
      codeSolution: 'from math import factorial\nresult = factorial(8 - 1)\nprint(f"Circular arrangements = {result:,}")',
    },
    {
      id: 'prob-19', difficulty: 3,
      question: 'How many ways can you distribute **12 identical cookies** among **4 children** so each gets at least one?',
      steps: [
        { label: 'Step 1: Stars and bars with minimum 1 each', content: 'Give 1 cookie to each child first → 12 − 4 = 8 remaining' },
        { label: 'Step 2: Distribute 8 identical items into 4 bins', content: 'C(8 + 4 − 1, 4 − 1) = C(11, 3)' },
        { label: 'Step 3: Compute', content: 'C(11, 3) = (11 × 10 × 9) / 6 = **165**' },
      ],
      answer: '165',
      code: '# Stars and bars: 12 cookies, 4 children, each >= 1\n\n# Your code here\n',
      codeSolution: 'from math import comb\n# After giving 1 to each: 8 remaining into 4 bins\nresult = comb(12 - 4 + 4 - 1, 4 - 1)\nprint(f"Ways = C(11,3) = {result}")',
    },
    {
      id: 'prob-20', difficulty: 3,
      question: 'A committee of **5** is formed from **6 men and 4 women**. How many committees have **at least 2 women**?',
      visual: { kind: 'bar-chart', labels: ['2W 3M', '3W 2M', '4W 1M'], values: [120, 60, 6] },
      steps: [
        { label: 'Step 1: Break into cases', content: '2W+3M, 3W+2M, 4W+1M' },
        { label: 'Step 2: Count each case', content: 'C(4,2)×C(6,3) = 6×20 = 120\nC(4,3)×C(6,2) = 4×15 = 60\nC(4,4)×C(6,1) = 1×6 = 6' },
        { label: 'Step 3: Add', content: '120 + 60 + 6 = **186**' },
      ],
      answer: '186',
      code: '# Committees of 5 from 6M+4W with at least 2 women\n\n# Your code here\n',
      codeSolution: 'from math import comb\ntotal = 0\nfor w in range(2, 5):  # 2, 3, or 4 women\n    m = 5 - w\n    ways = comb(4, w) * comb(6, m)\n    total += ways\n    print(f"{w}W + {m}M: {ways}")\nprint(f"Total = {total}")',
    },

    // ════════════════════════════════════════════════════════════
    // 3. INDEPENDENT & DEPENDENT EVENTS (prob-21 → prob-30)
    // ════════════════════════════════════════════════════════════

    {
      id: 'prob-21', difficulty: 1,
      question: 'A coin is flipped and a die is rolled. What is the probability of getting **heads and a 6**?',
      visual: { kind: 'coins', count: 1, heads: 1 },
      steps: [
        { label: 'Step 1: Events are independent', content: 'Coin flip does not affect the die roll' },
        { label: 'Step 2: Multiply probabilities', content: 'P(H) × P(6) = 1/2 × 1/6 = **1/12 ≈ 0.0833**' },
      ],
      answer: '1/12 ≈ 0.0833',
      code: '# P(heads AND rolling a 6)\n\n# Your code here\n',
      codeSolution: 'prob = (1/2) * (1/6)\nprint(f"P(H and 6) = 1/12 = {prob:.4f}")',
    },
    {
      id: 'prob-22', difficulty: 2,
      question: 'Two fair coins are tossed. What is the probability that **both show tails**?',
      visual: { kind: 'coins', count: 2, heads: 0 },
      steps: [
        { label: 'Step 1: Independent events', content: 'P(T₁) = 1/2, P(T₂) = 1/2' },
        { label: 'Step 2: Multiply', content: 'P(both tails) = 1/2 × 1/2 = **1/4 = 0.25**' },
      ],
      answer: '1/4 = 0.25',
      code: '# P(both coins show tails)\n\n# Your code here\n',
      codeSolution: 'prob = (1/2) ** 2\nprint(f"P(TT) = {prob}")',
    },
    {
      id: 'prob-23', difficulty: 1,
      question: 'A jar has 5 red and 3 blue marbles. You draw one, **do not replace it**, then draw another. What is P(both red)?',
      visual: { kind: 'bar-chart', labels: ['Red', 'Blue'], values: [5, 3] },
      steps: [
        { label: 'Step 1: These are dependent events', content: 'The second draw depends on the first' },
        { label: 'Step 2: P(1st red)', content: '5/8' },
        { label: 'Step 3: P(2nd red | 1st red)', content: '4/7 (one red removed)' },
        { label: 'Step 4: Multiply', content: '(5/8) × (4/7) = 20/56 = **5/14 ≈ 0.3571**' },
      ],
      answer: '5/14 ≈ 0.3571',
      code: '# P(both red) without replacement from 5R, 3B\n\n# Your code here\n',
      codeSolution: 'p_first = 5 / 8\np_second = 4 / 7\nprob = p_first * p_second\nprint(f"P(both red) = 20/56 = 5/14 = {prob:.4f}")',
    },
    {
      id: 'prob-24', difficulty: 2,
      question: 'A die is rolled **twice**. What is the probability that **both rolls are even**?',
      visual: { kind: 'dice', count: 2, values: [2, 4] },
      steps: [
        { label: 'Step 1: P(even on one roll)', content: 'Even faces: 2, 4, 6 → P = 3/6 = 1/2' },
        { label: 'Step 2: Rolls are independent', content: 'P(both even) = 1/2 × 1/2 = **1/4 = 0.25**' },
      ],
      answer: '1/4 = 0.25',
      code: '# P(both rolls are even)\n\n# Your code here\n',
      codeSolution: 'p_even = 3 / 6\nprob = p_even ** 2\nprint(f"P(both even) = {prob}")',
    },
    {
      id: 'prob-25', difficulty: 2,
      question: 'A coin is flipped **5 times**. What is the probability of getting **at least 2 heads**?',
      visual: { kind: 'coins', count: 5, heads: 2 },
      steps: [
        { label: 'Step 1: Use complement', content: 'P(at least 2H) = 1 − P(0H) − P(1H)' },
        { label: 'Step 2: P(0 heads)', content: 'C(5,0) × (1/2)⁵ = 1/32' },
        { label: 'Step 3: P(1 head)', content: 'C(5,1) × (1/2)⁵ = 5/32' },
        { label: 'Step 4: Complement', content: '1 − 1/32 − 5/32 = 1 − 6/32 = **26/32 = 13/16 ≈ 0.8125**' },
      ],
      answer: '13/16 = 0.8125',
      code: '# P(at least 2 heads in 5 flips)\n\n# Your code here\n',
      codeSolution: 'from math import comb\np0 = comb(5, 0) / 2**5\np1 = comb(5, 1) / 2**5\nprob = 1 - p0 - p1\nprint(f"P(>= 2 heads) = {prob}")',
    },
    {
      id: 'prob-26', difficulty: 2,
      question: 'Two cards are drawn **without replacement** from a 52-card deck. What is the probability that **both are aces**?',
      visual: { kind: 'cards', drawn: ['A♠', 'A♥'] },
      steps: [
        { label: 'Step 1: P(1st ace)', content: '4/52' },
        { label: 'Step 2: P(2nd ace | 1st ace)', content: '3/51 (one ace and one card removed)' },
        { label: 'Step 3: Multiply', content: '(4/52) × (3/51) = 12/2652 = **1/221 ≈ 0.00452**' },
      ],
      answer: '1/221 ≈ 0.00452',
      code: '# P(both aces) drawn without replacement\n\n# Your code here\n',
      codeSolution: 'prob = (4/52) * (3/51)\nprint(f"P(both aces) = {prob:.5f}")\nprint(f"  = 1/{round(1/prob)}")',
    },
    {
      id: 'prob-27', difficulty: 2,
      question: 'A factory has 3 machines. Machine A produces 50% of items (2% defective), B produces 30% (3% defective), C produces 20% (5% defective). What is P(item is defective)?',
      visual: { kind: 'bar-chart', labels: ['Machine A', 'Machine B', 'Machine C'], values: [50, 30, 20] },
      steps: [
        { label: 'Step 1: Law of Total Probability', content: 'P(D) = P(D|A)P(A) + P(D|B)P(B) + P(D|C)P(C)' },
        { label: 'Step 2: Substitute', content: '= 0.02×0.50 + 0.03×0.30 + 0.05×0.20' },
        { label: 'Step 3: Compute', content: '= 0.010 + 0.009 + 0.010 = **0.029 = 2.9%**' },
      ],
      answer: '0.029 = 2.9%',
      code: '# P(defective) using Law of Total Probability\n\n# Your code here\n',
      codeSolution: 'p_d = 0.02*0.50 + 0.03*0.30 + 0.05*0.20\nprint(f"P(defective) = {p_d:.3f} = {p_d*100:.1f}%")',
    },
    {
      id: 'prob-28', difficulty: 2,
      question: 'A bag has 6 red and 4 white balls. Three balls are drawn **without replacement**. What is P(all 3 are red)?',
      visual: { kind: 'bar-chart', labels: ['Red', 'White'], values: [6, 4] },
      steps: [
        { label: 'Step 1: Sequential dependent draws', content: 'P = (6/10) × (5/9) × (4/8)' },
        { label: 'Step 2: Compute', content: '= 120/720 = **1/6 ≈ 0.1667**' },
        { label: 'Alternative (combinations)', content: 'C(6,3)/C(10,3) = 20/120 = 1/6' },
      ],
      answer: '1/6 ≈ 0.1667',
      code: '# P(all 3 red) from 6R, 4W without replacement\n\n# Your code here\n',
      codeSolution: 'from math import comb\nprob = comb(6, 3) / comb(10, 3)\nprint(f"P(all 3 red) = {prob:.4f}")',
    },
    {
      id: 'prob-29', difficulty: 3,
      question: 'In a group of **23 people**, what is the probability that **at least two share a birthday**? (Assume 365 days, uniform distribution.)',
      steps: [
        { label: 'Step 1: Use complement', content: 'P(at least one match) = 1 − P(all different)' },
        { label: 'Step 2: P(all different)', content: '(365/365) × (364/365) × (363/365) × ... × (343/365)' },
        { label: 'Step 3: Compute', content: 'P(all different) ≈ 0.4927\nP(match) ≈ 1 − 0.4927 = **0.5073 ≈ 50.7%**' },
      ],
      answer: '≈ 0.5073 (50.7%)',
      code: '# Birthday problem: P(at least 2 share a birthday) for n=23\n\n# Your code here\n',
      codeSolution: 'n = 23\np_all_diff = 1.0\nfor i in range(n):\n    p_all_diff *= (365 - i) / 365\nprob = 1 - p_all_diff\nprint(f"P(shared birthday, n={n}) = {prob:.4f}")',
    },
    {
      id: 'prob-30', difficulty: 3,
      question: 'You roll a fair die repeatedly until you get a 6. What is the probability that it takes **exactly 4 rolls**?',
      visual: { kind: 'dice', count: 4, values: [3, 1, 5, 6] },
      steps: [
        { label: 'Step 1: Geometric distribution', content: 'Must get non-6 three times, then 6 on 4th roll' },
        { label: 'Step 2: Compute', content: 'P = (5/6)³ × (1/6) = 125/1296 ≈ **0.0965**' },
      ],
      answer: '125/1296 ≈ 0.0965',
      code: '# P(first 6 appears on exactly the 4th roll)\n\n# Your code here\n',
      codeSolution: 'prob = (5/6)**3 * (1/6)\nprint(f"P(first 6 on roll 4) = {prob:.4f}")',
    },

    // ════════════════════════════════════════════════════════════
    // 4. CONDITIONAL PROBABILITY & BAYES' THEOREM (prob-31 → prob-40)
    // ════════════════════════════════════════════════════════════

    {
      id: 'prob-31', difficulty: 1,
      question: 'A die is rolled. Given that the result is **even**, what is P(it is a 4)?',
      visual: { kind: 'dice', count: 1, values: [4] },
      steps: [
        { label: 'Step 1: Reduced sample space', content: 'Even outcomes: {2, 4, 6} → 3 outcomes' },
        { label: 'Step 2: Favorable', content: '{4} → 1 outcome' },
        { label: 'Step 3: Conditional probability', content: 'P(4 | even) = 1/3 ≈ **0.3333**' },
      ],
      answer: '1/3 ≈ 0.3333',
      code: '# P(4 | even) on a fair die\n\n# Your code here\n',
      codeSolution: 'even = [2, 4, 6]\nfavorable = [x for x in even if x == 4]\nprob = len(favorable) / len(even)\nprint(f"P(4 | even) = {prob:.4f}")',
    },
    {
      id: 'prob-32', difficulty: 1,
      question: 'A card is drawn from a deck. Given that it is a **spade**, what is P(it is a face card)?',
      visual: { kind: 'cards', drawn: ['J♠', 'Q♠', 'K♠'] },
      steps: [
        { label: 'Step 1: Spades in deck', content: '13 spades' },
        { label: 'Step 2: Face cards among spades', content: 'J♠, Q♠, K♠ → 3' },
        { label: 'Step 3: Compute', content: 'P(face | spade) = 3/13 ≈ **0.2308**' },
      ],
      answer: '3/13 ≈ 0.2308',
      code: '# P(face card | spade)\n\n# Your code here\n',
      codeSolution: 'face_spades = 3  # J, Q, K of spades\ntotal_spades = 13\nprob = face_spades / total_spades\nprint(f"P(face | spade) = {prob:.4f}")',
    },
    {
      id: 'prob-33', difficulty: 1,
      question: 'Two dice are rolled. Given that the **sum is 8**, what is P(one of the dice shows a 3)?',
      visual: { kind: 'dice', count: 2, values: [3, 5] },
      steps: [
        { label: 'Step 1: Pairs summing to 8', content: '(2,6), (3,5), (4,4), (5,3), (6,2) → 5 pairs' },
        { label: 'Step 2: Pairs with a 3', content: '(3,5) and (5,3) → 2 pairs' },
        { label: 'Step 3: Compute', content: 'P(3 shown | sum=8) = 2/5 = **0.4**' },
      ],
      answer: '2/5 = 0.4',
      code: '# P(a die shows 3 | sum is 8)\n\n# Your code here\n',
      codeSolution: 'pairs_sum8 = [(a,b) for a in range(1,7) for b in range(1,7) if a+b == 8]\nwith_3 = [(a,b) for a,b in pairs_sum8 if a == 3 or b == 3]\nprob = len(with_3) / len(pairs_sum8)\nprint(f"P(3 shown | sum=8) = {len(with_3)}/{len(pairs_sum8)} = {prob}")',
    },
    {
      id: 'prob-34', difficulty: 2,
      question: 'A medical test has **sensitivity 99%** (P(+|disease) = 0.99) and **specificity 95%** (P(−|no disease) = 0.95). The disease prevalence is **1%**. If a person tests positive, what is the probability they actually have the disease?',
      visual: { kind: 'bar-chart', labels: ['True Pos', 'False Pos', 'True Neg', 'False Neg'], values: [99, 495, 9405, 1] },
      steps: [
        { label: 'Step 1: Define events', content: 'D = disease, + = positive test' },
        { label: 'Step 2: Bayes\' Theorem', content: 'P(D|+) = P(+|D)P(D) / P(+)' },
        { label: 'Step 3: Compute P(+)', content: 'P(+) = P(+|D)P(D) + P(+|¬D)P(¬D)\n= 0.99×0.01 + 0.05×0.99\n= 0.0099 + 0.0495 = 0.0594' },
        { label: 'Step 4: Apply Bayes', content: 'P(D|+) = 0.0099 / 0.0594 ≈ **0.1667 = 16.67%**' },
      ],
      answer: '≈ 16.67%',
      code: '# Bayes\' Theorem: medical test\n# sensitivity=0.99, specificity=0.95, prevalence=0.01\n\n# Your code here\n',
      codeSolution: 'sens = 0.99   # P(+|D)\nspec = 0.95   # P(-|~D)\nprev = 0.01   # P(D)\n\np_pos = sens * prev + (1 - spec) * (1 - prev)\np_disease_given_pos = (sens * prev) / p_pos\nprint(f"P(D|+) = {p_disease_given_pos:.4f} = {p_disease_given_pos*100:.2f}%")',
    },
    {
      id: 'prob-35', difficulty: 2,
      question: 'Box A has 3 red and 2 blue balls. Box B has 4 red and 6 blue balls. A box is chosen at random, then a ball is drawn. If the ball is **red**, what is the probability it came from **Box A**?',
      visual: { kind: 'bar-chart', labels: ['Box A Red', 'Box A Blue', 'Box B Red', 'Box B Blue'], values: [3, 2, 4, 6] },
      steps: [
        { label: 'Step 1: Priors', content: 'P(A) = P(B) = 1/2' },
        { label: 'Step 2: Likelihoods', content: 'P(R|A) = 3/5, P(R|B) = 4/10 = 2/5' },
        { label: 'Step 3: P(R)', content: 'P(R) = P(R|A)P(A) + P(R|B)P(B) = (3/5)(1/2) + (2/5)(1/2) = 3/10 + 2/10 = 1/2' },
        { label: 'Step 4: Bayes', content: 'P(A|R) = P(R|A)P(A) / P(R) = (3/10) / (1/2) = **3/5 = 0.6**' },
      ],
      answer: '3/5 = 0.6',
      code: '# Bayes: P(Box A | red ball drawn)\n\n# Your code here\n',
      codeSolution: 'p_r_a = 3/5\np_r_b = 4/10\np_a = p_b = 0.5\np_r = p_r_a * p_a + p_r_b * p_b\np_a_given_r = (p_r_a * p_a) / p_r\nprint(f"P(A | red) = {p_a_given_r}")',
    },
    {
      id: 'prob-36', difficulty: 2,
      question: 'In a class, 60% of students pass the midterm and 80% of those who pass the midterm also pass the final. Only 30% of those who fail the midterm pass the final. What is P(passed midterm | passed final)?',
      visual: { kind: 'bar-chart', labels: ['Pass Mid+Pass Fin', 'Pass Mid+Fail Fin', 'Fail Mid+Pass Fin', 'Fail Mid+Fail Fin'], values: [48, 12, 12, 28] },
      steps: [
        { label: 'Step 1: Given', content: 'P(M) = 0.6, P(F|M) = 0.8, P(F|¬M) = 0.3' },
        { label: 'Step 2: P(F)', content: 'P(F) = P(F|M)P(M) + P(F|¬M)P(¬M) = 0.8×0.6 + 0.3×0.4 = 0.48 + 0.12 = 0.60' },
        { label: 'Step 3: Bayes', content: 'P(M|F) = P(F|M)P(M) / P(F) = 0.48 / 0.60 = **0.8 = 80%**' },
      ],
      answer: '0.8 = 80%',
      code: '# P(passed midterm | passed final)\n\n# Your code here\n',
      codeSolution: 'p_m = 0.6\np_f_given_m = 0.8\np_f_given_not_m = 0.3\np_f = p_f_given_m * p_m + p_f_given_not_m * (1 - p_m)\np_m_given_f = (p_f_given_m * p_m) / p_f\nprint(f"P(M|F) = {p_m_given_f}")',
    },
    {
      id: 'prob-37', difficulty: 3,
      question: 'A spam filter flags 95% of spam and 3% of legitimate email. If 20% of all email is spam, what is P(email is spam | flagged)?',
      visual: { kind: 'bar-chart', labels: ['Spam (flagged)', 'Spam (not flagged)', 'Legit (flagged)', 'Legit (not flagged)'], values: [19, 1, 2, 78] },
      steps: [
        { label: 'Step 1: Define', content: 'P(S) = 0.20, P(F|S) = 0.95, P(F|¬S) = 0.03' },
        { label: 'Step 2: P(F)', content: '0.95×0.20 + 0.03×0.80 = 0.19 + 0.024 = 0.214' },
        { label: 'Step 3: Bayes', content: 'P(S|F) = 0.19 / 0.214 ≈ **0.8879 ≈ 88.8%**' },
      ],
      answer: '≈ 88.8%',
      code: '# P(spam | flagged) using Bayes\n\n# Your code here\n',
      codeSolution: 'p_s = 0.20\np_f_s = 0.95\np_f_ns = 0.03\np_f = p_f_s * p_s + p_f_ns * (1 - p_s)\np_s_f = (p_f_s * p_s) / p_f\nprint(f"P(spam | flagged) = {p_s_f:.4f} = {p_s_f*100:.1f}%")',
    },
    {
      id: 'prob-38', difficulty: 3,
      question: 'A rare disease affects 1 in 10,000 people. A test has 99.5% sensitivity and 99.9% specificity. You test positive. What is P(disease | positive)? Why is this counterintuitive?',
      visual: { kind: 'bar-chart', labels: ['True Pos', 'False Pos'], values: [1, 10] },
      steps: [
        { label: 'Step 1: Very low prior', content: 'P(D) = 0.0001, P(+|D) = 0.995, P(+|¬D) = 0.001' },
        { label: 'Step 2: P(+)', content: '0.995×0.0001 + 0.001×0.9999 = 0.0000995 + 0.0009999 = 0.0010994' },
        { label: 'Step 3: Bayes', content: 'P(D|+) = 0.0000995 / 0.0010994 ≈ **0.0905 ≈ 9.05%**' },
        { label: 'Insight', content: 'Despite 99.5% sensitivity and 99.9% specificity, a positive result only means ~9% chance of disease. The very low prevalence means false positives vastly outnumber true positives — the **base rate fallacy**.' },
      ],
      answer: '≈ 9.05% (base rate fallacy)',
      code: '# Rare disease Bayes: prevalence=1/10000\n\n# Your code here\n',
      codeSolution: 'prev = 1 / 10000\nsens = 0.995\nspec = 0.999\np_pos = sens * prev + (1 - spec) * (1 - prev)\np_d_pos = (sens * prev) / p_pos\nprint(f"P(D|+) = {p_d_pos:.4f} = {p_d_pos*100:.2f}%")\nprint("Despite excellent accuracy, low prevalence makes most positives false!")',
    },
    {
      id: 'prob-39', difficulty: 3,
      question: 'Three urns: Urn 1 has 2 gold, 1 silver. Urn 2 has 1 gold, 2 silver. Urn 3 has 0 gold, 3 silver. An urn is chosen at random and a coin is drawn. It is **gold**. What is P(Urn 1)?',
      visual: { kind: 'bar-chart', labels: ['Urn 1: 2G,1S', 'Urn 2: 1G,2S', 'Urn 3: 0G,3S'], values: [2, 1, 0] },
      steps: [
        { label: 'Step 1: Priors', content: 'P(U1) = P(U2) = P(U3) = 1/3' },
        { label: 'Step 2: Likelihoods', content: 'P(G|U1) = 2/3, P(G|U2) = 1/3, P(G|U3) = 0' },
        { label: 'Step 3: P(G)', content: '(2/3)(1/3) + (1/3)(1/3) + 0×(1/3) = 2/9 + 1/9 = 3/9 = 1/3' },
        { label: 'Step 4: Bayes', content: 'P(U1|G) = (2/9) / (1/3) = (2/9) × (3/1) = **2/3 ≈ 0.6667**' },
      ],
      answer: '2/3 ≈ 0.6667',
      code: '# P(Urn 1 | gold coin drawn)\n\n# Your code here\n',
      codeSolution: 'p_g_u = [2/3, 1/3, 0]  # P(G|Ui)\np_u = [1/3, 1/3, 1/3]   # priors\np_g = sum(g * u for g, u in zip(p_g_u, p_u))\np_u1_g = (p_g_u[0] * p_u[0]) / p_g\nprint(f"P(U1|G) = {p_u1_g:.4f}")',
    },
    {
      id: 'prob-40', difficulty: 2,
      question: 'At a school, 40% of students play football, 25% play basketball, and 10% play both. If a student plays **football**, what is the probability they also play **basketball**?',
      visual: { kind: 'bar-chart', labels: ['Football only', 'Both', 'Basketball only', 'Neither'], values: [30, 10, 15, 45] },
      steps: [
        { label: 'Step 1: Identify', content: 'P(F) = 0.40, P(B) = 0.25, P(F ∩ B) = 0.10' },
        { label: 'Step 2: Conditional probability', content: 'P(B|F) = P(F ∩ B) / P(F)' },
        { label: 'Step 3: Compute', content: 'P(B|F) = 0.10 / 0.40 = **0.25 = 25%**' },
      ],
      answer: '0.25 = 25%',
      code: '# P(basketball | football)\n\n# Your code here\n',
      codeSolution: 'p_f = 0.40\np_both = 0.10\np_b_given_f = p_both / p_f\nprint(f"P(B|F) = {p_b_given_f}")',
    },

    // ════════════════════════════════════════════════════════════
    // 5. EXPECTED VALUE (prob-41 → prob-50)
    // ════════════════════════════════════════════════════════════

    {
      id: 'prob-41', difficulty: 1,
      question: 'A fair die is rolled. What is the **expected value** of the outcome?',
      visual: { kind: 'dice', count: 1 },
      steps: [
        { label: 'Step 1: List outcomes and probabilities', content: 'Each face (1–6) has probability 1/6' },
        { label: 'Step 2: E[X] = Σ x·P(x)', content: '= (1+2+3+4+5+6) / 6 = 21/6 = **3.5**' },
      ],
      answer: '3.5',
      code: '# Expected value of a fair die roll\n\n# Your code here\n',
      codeSolution: 'ev = sum(range(1, 7)) / 6\nprint(f"E[X] = {ev}")',
    },
    {
      id: 'prob-42', difficulty: 1,
      question: 'A lottery ticket costs $2. You have a 1/100 chance of winning $50 and a 99/100 chance of winning nothing. What is the **expected profit**?',
      visual: { kind: 'bar-chart', labels: ['Win $50', 'Win $0'], values: [1, 99] },
      steps: [
        { label: 'Step 1: Expected winnings', content: 'E[win] = (1/100)(50) + (99/100)(0) = $0.50' },
        { label: 'Step 2: Expected profit', content: 'E[profit] = $0.50 − $2.00 = **−$1.50**' },
        { label: 'Insight', content: 'On average, you lose $1.50 per ticket — the lottery is not a fair game.' },
      ],
      answer: '−$1.50 (expected loss)',
      code: '# Expected profit from a lottery ticket\n\n# Your code here\n',
      codeSolution: 'cost = 2\nev_win = (1/100) * 50 + (99/100) * 0\nev_profit = ev_win - cost\nprint(f"E[profit] = ${ev_profit:.2f}")',
    },
    {
      id: 'prob-43', difficulty: 1,
      question: 'You flip a fair coin. Heads wins $10, tails loses $6. What is the **expected value** of this game?',
      visual: { kind: 'coins', count: 1, heads: 1 },
      steps: [
        { label: 'Step 1: List outcomes', content: 'Heads (+$10): P = 1/2\nTails (−$6): P = 1/2' },
        { label: 'Step 2: E[X]', content: '(1/2)(10) + (1/2)(−6) = 5 − 3 = **$2**' },
        { label: 'Insight', content: 'Positive EV means this game favors the player.' },
      ],
      answer: '$2',
      code: '# Expected value: heads=+10, tails=-6\n\n# Your code here\n',
      codeSolution: 'ev = 0.5 * 10 + 0.5 * (-6)\nprint(f"E[X] = ${ev:.2f}")',
    },
    {
      id: 'prob-44', difficulty: 2,
      question: 'A spinner has 4 equal sections labeled 1, 2, 3, and 4. What is the **expected value** of a spin?',
      steps: [
        { label: 'Step 1: Each section has P = 1/4', content: 'Outcomes: 1, 2, 3, 4' },
        { label: 'Step 2: E[X]', content: '(1+2+3+4) / 4 = 10/4 = **2.5**' },
      ],
      answer: '2.5',
      code: '# Expected value of spinning a 4-section spinner\n\n# Your code here\n',
      codeSolution: 'outcomes = [1, 2, 3, 4]\nev = sum(outcomes) / len(outcomes)\nprint(f"E[X] = {ev}")',
    },
    {
      id: 'prob-45', difficulty: 3,
      question: 'You roll two dice and win **$5 × (the sum)** but pay **$20 to play**. What is the expected profit?',
      visual: { kind: 'dice', count: 2, values: [3, 4] },
      steps: [
        { label: 'Step 1: E[sum of two dice]', content: 'E[X₁] + E[X₂] = 3.5 + 3.5 = 7' },
        { label: 'Step 2: E[winnings]', content: '5 × 7 = $35' },
        { label: 'Step 3: E[profit]', content: '$35 − $20 = **$15**' },
      ],
      answer: '$15',
      code: '# E[profit] from rolling two dice, winning $5*sum, paying $20\n\n# Your code here\n',
      codeSolution: 'e_sum = 3.5 + 3.5\ne_win = 5 * e_sum\ne_profit = e_win - 20\nprint(f"E[profit] = ${e_profit:.2f}")',
    },
    {
      id: 'prob-46', difficulty: 2,
      question: 'A game costs **$5** to play. You draw a card from a standard deck. If it is an **ace**, you win $50. If it is a **face card** (J, Q, K), you win $10. Otherwise, you win nothing. Is this a fair game?',
      visual: { kind: 'cards', drawn: ['A♠', 'K♥', '7♣'] },
      steps: [
        { label: 'Step 1: Probabilities', content: 'P(ace) = 4/52 = 1/13\nP(face) = 12/52 = 3/13\nP(other) = 36/52 = 9/13' },
        { label: 'Step 2: E[winnings]', content: '(1/13)(50) + (3/13)(10) + (9/13)(0)\n= 50/13 + 30/13 = 80/13 ≈ $6.15' },
        { label: 'Step 3: E[profit]', content: '$6.15 − $5 = **+$1.15**' },
        { label: 'Conclusion', content: 'Not fair — the game favors the player by about $1.15 per play.' },
      ],
      answer: 'E[profit] ≈ +$1.15 (favors player, not fair)',
      code: '# Is this card game fair? Cost=$5, Ace=$50, Face=$10\n\n# Your code here\n',
      codeSolution: 'e_win = (4/52)*50 + (12/52)*10 + (36/52)*0\ne_profit = e_win - 5\nprint(f"E[winnings] = ${e_win:.2f}")\nprint(f"E[profit] = ${e_profit:.2f}")\nprint(f"Fair game? {\'Yes\' if abs(e_profit) < 0.01 else \'No\'}")',
    },
    {
      id: 'prob-47', difficulty: 3,
      question: 'An insurance company charges **$500/year** for a policy. There is a 2% chance of a claim of **$20,000** and a 0.5% chance of a claim of **$50,000**. What is the company\'s expected profit per policy?',
      visual: { kind: 'bar-chart', labels: ['No claim', '$20K claim', '$50K claim'], values: [975, 20, 5] },
      steps: [
        { label: 'Step 1: E[payout]', content: '0.02 × 20000 + 0.005 × 50000 = 400 + 250 = $650' },
        { label: 'Step 2: E[profit]', content: 'Premium − E[payout] = $500 − $650 = **−$150**' },
        { label: 'Insight', content: 'The company loses $150 per policy on average — the premium is too low.' },
      ],
      answer: '−$150 (company loses money)',
      code: '# Insurance company expected profit\n\n# Your code here\n',
      codeSolution: 'premium = 500\ne_payout = 0.02 * 20000 + 0.005 * 50000\ne_profit = premium - e_payout\nprint(f"E[payout] = ${e_payout}")\nprint(f"E[profit] = ${e_profit}")',
    },
    {
      id: 'prob-48', difficulty: 3,
      question: 'In the **Monty Hall problem**, you pick a door. The host opens another door revealing a goat. Should you **switch**? Compute P(win | switch) and P(win | stay).',
      visual: { kind: 'bar-chart', labels: ['Stay wins', 'Switch wins'], values: [1, 2] },
      steps: [
        { label: 'Step 1: Setup', content: 'Car behind 1 of 3 doors. You pick door 1. Host opens a door with a goat.' },
        { label: 'Step 2: P(win | stay)', content: 'You win only if car was behind your initial pick → P = **1/3**' },
        { label: 'Step 3: P(win | switch)', content: 'You win if car was behind either unpicked door → P = **2/3**' },
        { label: 'Conclusion', content: 'Always switch! Switching doubles your probability of winning.' },
      ],
      answer: 'P(win|switch) = 2/3, P(win|stay) = 1/3 — always switch',
      code: '# Monty Hall simulation: verify switch vs stay\n\n# Your code here\n',
      codeSolution: 'import random\n\ndef monty_hall(switch, trials=100000):\n    wins = 0\n    for _ in range(trials):\n        car = random.randint(0, 2)\n        pick = random.randint(0, 2)\n        # Host opens a door with a goat (not car, not pick)\n        doors = [d for d in range(3) if d != pick and d != car]\n        host_opens = random.choice(doors)\n        if switch:\n            pick = [d for d in range(3) if d != pick and d != host_opens][0]\n        if pick == car:\n            wins += 1\n    return wins / trials\n\nprint(f"P(win | stay)   = {monty_hall(False):.4f}")\nprint(f"P(win | switch) = {monty_hall(True):.4f}")',
    },
    {
      id: 'prob-49', difficulty: 3,
      question: 'How many ways can **5 people** be seated so that **no one sits in their original seat**? (Count the derangements, D₅.)',
      visual: { kind: 'bar-chart', labels: ['D₁', 'D₂', 'D₃', 'D₄', 'D₅'], values: [0, 1, 2, 9, 44] },
      steps: [
        { label: 'Step 1: Derangement formula', content: 'Dₙ = n! × Σ(k=0 to n) (−1)ᵏ / k!' },
        { label: 'Step 2: Compute for n=5', content: 'D₅ = 5! × (1 − 1 + 1/2 − 1/6 + 1/24 − 1/120)\n= 120 × (1 − 1 + 0.5 − 0.16667 + 0.04167 − 0.00833)\n= 120 × 0.36667 = **44**' },
        { label: 'Verification', content: 'As n grows, Dₙ/n! → 1/e ≈ 0.3679. For n=5: 44/120 = 0.3667 ✓' },
      ],
      answer: '44 derangements',
      code: '# Count derangements D(5)\n\n# Your code here\n',
      codeSolution: 'from math import factorial\n\ndef derangements(n):\n    total = 0\n    for k in range(n + 1):\n        total += ((-1) ** k) * factorial(n) // factorial(k)\n    return total\n\nfor n in range(1, 6):\n    print(f"D({n}) = {derangements(n)}")',
    },
    {
      id: 'prob-50', difficulty: 3,
      question: 'You are collecting **all 6 different stickers** from cereal boxes (one random sticker per box). On average, how many boxes must you buy to collect all 6? (**Coupon Collector Problem**)',
      steps: [
        { label: 'Step 1: After collecting k stickers', content: 'P(new sticker) = (6−k)/6. Expected tries for the next new one = 6/(6−k).' },
        { label: 'Step 2: Sum over all stages', content: 'E = 6/6 + 6/5 + 6/4 + 6/3 + 6/2 + 6/1\n= 1 + 1.2 + 1.5 + 2 + 3 + 6 = **14.7**' },
        { label: 'General formula', content: 'E[T] = n × Hₙ where Hₙ is the n-th harmonic number.\nH₆ = 1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6 ≈ 2.45\nE = 6 × 2.45 = **14.7 boxes**' },
      ],
      answer: '14.7 boxes on average',
      code: '# Coupon Collector: expected boxes for 6 stickers\n\n# Your code here\n',
      codeSolution: 'n = 6\nexpected = sum(n / (n - k) for k in range(n))\nprint(f"E[boxes for {n} stickers] = {expected:.1f}")\n\n# Simulation verification\nimport random\ntrials = 100000\ntotal = 0\nfor _ in range(trials):\n    collected = set()\n    boxes = 0\n    while len(collected) < n:\n        collected.add(random.randint(1, n))\n        boxes += 1\n    total += boxes\nprint(f"Simulated average = {total/trials:.1f}")',
    },
  ],
};
