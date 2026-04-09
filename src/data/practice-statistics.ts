// ============================================================
// PRACTICE PROBLEMS — Statistics & Distributions
//
// 50 problems per section, difficulty 1/2/3, with step-by-step
// hand solutions, visuals, and Python code variants.
// ============================================================

import type { PracticeSet } from './reference';

// ─── 1. Mean, Median, Mode & Range ─────────────────────────

export const practiceMeanMedianMode: PracticeSet = {
  title: 'Practice — Mean, Median, Mode & Range',
  problems: [
    // ── Easy (1-17) ────────────────────────────────────────
    {
      id: 'mmm-01', difficulty: 1,
      question: 'Find the **mean** of: 4, 7, 10, 13, 16',
      visual: { kind: 'bar-chart', labels: ['4','7','10','13','16'], values: [4,7,10,13,16], highlight: 2 },
      steps: [
        { label: 'Step 1: Add all values', content: '4 + 7 + 10 + 13 + 16 = **50**' },
        { label: 'Step 2: Count the values', content: 'There are **5** values' },
        { label: 'Step 3: Divide', content: '50 ÷ 5 = **10**' },
      ],
      answer: '10',
      code: '# Find the mean of this data\ndata = [4, 7, 10, 13, 16]\n\n# Your code here\n',
      codeSolution: 'data = [4, 7, 10, 13, 16]\nmean = sum(data) / len(data)\nprint(f"Mean = {mean}")',
    },
    {
      id: 'mmm-02', difficulty: 1,
      question: 'Find the **median** of: 3, 8, 1, 5, 9',
      steps: [
        { label: 'Step 1: Sort the values', content: '1, 3, 5, 8, 9' },
        { label: 'Step 2: Find the middle', content: '5 values → the middle is the 3rd value' },
        { label: 'Step 3: Read it', content: 'Median = **5**' },
      ],
      answer: '5',
    },
    {
      id: 'mmm-03', difficulty: 1,
      question: 'Find the **mode** of: 2, 5, 3, 5, 7, 5, 1',
      steps: [
        { label: 'Step 1: Count each value', content: '1 appears 1 time, 2 appears 1 time, 3 appears 1 time, **5 appears 3 times**, 7 appears 1 time' },
        { label: 'Step 2: Most frequent wins', content: 'Mode = **5** (appears 3 times)' },
      ],
      answer: '5',
    },
    {
      id: 'mmm-04', difficulty: 1,
      question: 'Find the **range** of: 12, 45, 23, 8, 31',
      steps: [
        { label: 'Step 1: Find the largest', content: 'Max = **45**' },
        { label: 'Step 2: Find the smallest', content: 'Min = **8**' },
        { label: 'Step 3: Subtract', content: 'Range = 45 − 8 = **37**' },
      ],
      answer: '37',
    },
    {
      id: 'mmm-05', difficulty: 1,
      question: 'Find the **mean** of: 20, 20, 20, 20, 20',
      hint: 'What happens when all values are the same?',
      steps: [
        { label: 'Step 1: Add', content: '20 + 20 + 20 + 20 + 20 = 100' },
        { label: 'Step 2: Divide', content: '100 ÷ 5 = **20**' },
        { label: 'Insight', content: 'When all values are equal, the mean equals that value.' },
      ],
      answer: '20',
    },
    {
      id: 'mmm-06', difficulty: 1,
      question: 'Find the **median** of: 10, 20, 30, 40',
      hint: 'With an even number of values, average the two middle ones.',
      steps: [
        { label: 'Step 1: Already sorted', content: '10, 20, 30, 40' },
        { label: 'Step 2: Find middle two', content: '4 values → middle two are 20 and 30' },
        { label: 'Step 3: Average them', content: '(20 + 30) ÷ 2 = **25**' },
      ],
      answer: '25',
    },
    {
      id: 'mmm-07', difficulty: 1,
      question: 'A student scores 70, 85, 90 on three tests. What is their **mean** score?',
      steps: [
        { label: 'Step 1: Add', content: '70 + 85 + 90 = 245' },
        { label: 'Step 2: Divide by 3', content: '245 ÷ 3 = **81.7**' },
      ],
      answer: '81.7',
      code: '# Calculate the mean test score\nscores = [70, 85, 90]\n\n# Your code here\n',
      codeSolution: 'scores = [70, 85, 90]\nmean = sum(scores) / len(scores)\nprint(f"Mean score = {mean:.1f}")',
    },
    {
      id: 'mmm-08', difficulty: 1,
      question: 'Find the **mode** of: 1, 2, 3, 4, 5 (each appears once)',
      steps: [
        { label: 'Step 1: Count frequencies', content: 'Every value appears exactly once' },
        { label: 'Step 2: No value repeats', content: 'There is **no mode** — all values are equally common' },
      ],
      answer: 'No mode',
    },
    {
      id: 'mmm-09', difficulty: 1,
      question: 'You roll a die 5 times and get: 3, 5, 2, 5, 1. Find the mean.',
      visual: { kind: 'dice', count: 5, values: [3,5,2,5,1] },
      steps: [
        { label: 'Step 1: Add', content: '3 + 5 + 2 + 5 + 1 = 16' },
        { label: 'Step 2: Divide by 5', content: '16 ÷ 5 = **3.2**' },
      ],
      answer: '3.2',
    },
    {
      id: 'mmm-10', difficulty: 1,
      question: 'Find the median of: 100, 200, 300, 400, 500, 600, 700',
      steps: [
        { label: 'Step 1: Count', content: '7 values (odd → one exact middle)' },
        { label: 'Step 2: Middle position', content: 'Position (7+1)/2 = 4th value' },
        { label: 'Step 3: Read', content: 'Median = **400**' },
      ],
      answer: '400',
    },
    {
      id: 'mmm-11', difficulty: 1,
      question: 'Temperatures this week: 28, 31, 27, 33, 29, 30, 32. Find the range.',
      steps: [
        { label: 'Step 1: Max', content: '33' },
        { label: 'Step 2: Min', content: '27' },
        { label: 'Step 3: Range', content: '33 − 27 = **6°C**' },
      ],
      answer: '6',
    },
    {
      id: 'mmm-12', difficulty: 1,
      question: 'Find the mean and median of: 1, 1, 1, 1, 100',
      visual: { kind: 'bar-chart', labels: ['1','1','1','1','100'], values: [1,1,1,1,100] },
      hint: 'The 100 is an outlier. How does it affect each measure?',
      steps: [
        { label: 'Mean', content: '(1+1+1+1+100) ÷ 5 = 104 ÷ 5 = **20.8**' },
        { label: 'Median', content: 'Sorted: 1, 1, **1**, 1, 100 → Median = **1**' },
        { label: 'Insight', content: 'The outlier (100) dragged the mean up to 20.8, but the median stayed at 1. The median is robust to outliers.' },
      ],
      answer: 'Mean = 20.8, Median = 1',
    },
    {
      id: 'mmm-13', difficulty: 1,
      question: 'You flip 10 coins and get 6 heads, 4 tails. What fraction is heads?',
      visual: { kind: 'coins', count: 10, heads: 6 },
      steps: [
        { label: 'Step 1', content: '6 heads out of 10 flips' },
        { label: 'Step 2', content: '6/10 = **0.6** or **60%**' },
      ],
      answer: '0.6 (60%)',
    },
    {
      id: 'mmm-14', difficulty: 1,
      question: 'Find the mode of: red, blue, red, green, red, blue',
      steps: [
        { label: 'Step 1: Count', content: 'red = 3, blue = 2, green = 1' },
        { label: 'Step 2: Most frequent', content: 'Mode = **red**' },
      ],
      answer: 'red',
    },
    {
      id: 'mmm-15', difficulty: 1,
      question: 'Data: 5, 10, 15. A new value of 10 is added. How does the mean change?',
      steps: [
        { label: 'Original mean', content: '(5+10+15)/3 = 30/3 = **10**' },
        { label: 'New mean', content: '(5+10+15+10)/4 = 40/4 = **10**' },
        { label: 'Insight', content: 'Adding a value equal to the mean does not change the mean.' },
      ],
      answer: 'Mean stays at 10',
    },
    {
      id: 'mmm-16', difficulty: 1,
      question: 'Draw 3 cards: A♠, K♥, 7♦. Find the mean of their numeric values (A=1, K=13).',
      visual: { kind: 'cards', drawn: ['A♠','K♥','7♦'] },
      steps: [
        { label: 'Step 1: Values', content: 'A = 1, K = 13, 7 = 7' },
        { label: 'Step 2: Mean', content: '(1+13+7)/3 = 21/3 = **7**' },
      ],
      answer: '7',
    },
    {
      id: 'mmm-17', difficulty: 1,
      question: 'Is it possible for the mean, median, and mode to all be the same number?',
      hint: 'Think of a dataset where all values are equal, or a perfectly symmetric dataset.',
      steps: [
        { label: 'Example 1', content: 'Data: 5, 5, 5, 5, 5. Mean = 5, Median = 5, Mode = 5. All same.' },
        { label: 'Example 2', content: 'Data: 1, 2, 3, 3, 3, 4, 5. Mean = 3, Median = 3, Mode = 3. All same.' },
        { label: 'Answer', content: '**Yes.** It happens when data is symmetric around its most common value.' },
      ],
      answer: 'Yes — when data is symmetric',
    },

    // ── Medium (18-34) ─────────────────────────────────────
    {
      id: 'mmm-18', difficulty: 2,
      question: 'A class of 5 students has a mean score of 72. A 6th student joins with a score of 90. What is the new mean?',
      steps: [
        { label: 'Step 1: Original total', content: '5 students × 72 = **360**' },
        { label: 'Step 2: Add new student', content: '360 + 90 = **450**' },
        { label: 'Step 3: New mean', content: '450 ÷ 6 = **75**' },
      ],
      answer: '75',
      code: '# A class of 5 has mean 72. A 6th student scores 90. New mean?\noriginal_count = 5\noriginal_mean = 72\nnew_score = 90\n\n# Your code here\n',
      codeSolution: 'original_count = 5\noriginal_mean = 72\nnew_score = 90\n\ntotal = original_count * original_mean + new_score\nnew_mean = total / (original_count + 1)\nprint(f"New mean = {new_mean}")',
    },
    {
      id: 'mmm-19', difficulty: 2,
      question: 'The median of 5 numbers is 12. The numbers in sorted order are: 3, 8, ?, 15, 20. What is the missing number?',
      steps: [
        { label: 'Step 1: Median of 5 numbers', content: 'The median is the 3rd value (middle)' },
        { label: 'Step 2: The 3rd value is the ?', content: '3, 8, **?**, 15, 20 — the ? IS the median' },
        { label: 'Step 3', content: '? = **12**' },
      ],
      answer: '12',
    },
    {
      id: 'mmm-20', difficulty: 2,
      question: 'Monthly rainfall (mm): 45, 120, 89, 200, 150, 78, 95, 110, 130, 55, 40, 180. Find the mean and median.',
      visual: { kind: 'bar-chart', labels: ['J','F','M','A','M','J','J','A','S','O','N','D'], values: [45,120,89,200,150,78,95,110,130,55,40,180] },
      steps: [
        { label: 'Step 1: Sum', content: '45+120+89+200+150+78+95+110+130+55+40+180 = **1292**' },
        { label: 'Step 2: Mean', content: '1292 ÷ 12 = **107.7 mm**' },
        { label: 'Step 3: Sort for median', content: '40, 45, 55, 78, 89, 95, 110, 120, 130, 150, 180, 200' },
        { label: 'Step 4: Median (even count)', content: '12 values → average of 6th and 7th: (95 + 110) ÷ 2 = **102.5 mm**' },
      ],
      answer: 'Mean = 107.7 mm, Median = 102.5 mm',
      code: '# Monthly rainfall data\nrain = [45, 120, 89, 200, 150, 78, 95, 110, 130, 55, 40, 180]\n\n# Calculate mean and median\n',
      codeSolution: 'rain = [45, 120, 89, 200, 150, 78, 95, 110, 130, 55, 40, 180]\n\nmean = sum(rain) / len(rain)\nsorted_rain = sorted(rain)\nn = len(sorted_rain)\nmedian = (sorted_rain[n//2 - 1] + sorted_rain[n//2]) / 2\n\nprint(f"Mean = {mean:.1f} mm")\nprint(f"Median = {median:.1f} mm")',
    },
    {
      id: 'mmm-21', difficulty: 2,
      question: 'Your exam has 4 sections weighted differently. Compute your **weighted mean**:\n\n| Section | Score | Weight |\n|---------|-------|--------|\n| Maths | 80 | 40% |\n| Science | 70 | 30% |\n| English | 90 | 20% |\n| Hindi | 75 | 10% |',
      steps: [
        { label: 'Step 1: Multiply each score by its weight', content: '80×0.4 = 32, 70×0.3 = 21, 90×0.2 = 18, 75×0.1 = 7.5' },
        { label: 'Step 2: Sum', content: '32 + 21 + 18 + 7.5 = **78.5**' },
        { label: 'Step 3: Check weights', content: '0.4 + 0.3 + 0.2 + 0.1 = 1.0 ✓ (weights sum to 1)' },
      ],
      answer: '78.5',
    },
    {
      id: 'mmm-22', difficulty: 2,
      question: 'A dataset has mode = 15 and median = 20. Is it possible for the mean to be 25?',
      steps: [
        { label: 'Step 1: Think about shape', content: 'Mode < Median < Mean indicates **right-skewed** data (long tail to the right)' },
        { label: 'Step 2: Example', content: 'Data: 15, 15, 20, 25, 50 → Mode=15, Median=20, Mean=25. ✓' },
        { label: 'Answer', content: '**Yes.** This is common in income data, where a few high earners pull the mean above the median.' },
      ],
      answer: 'Yes — the data is right-skewed',
    },
    {
      id: 'mmm-23', difficulty: 2,
      question: 'Roll two dice and find the mean, median, and mode of ALL possible sums (2 through 12).',
      visual: { kind: 'dice', count: 2, values: [3, 4] },
      hint: 'The sum 7 can be made the most ways (1+6, 2+5, 3+4, 4+3, 5+2, 6+1 = 6 ways).',
      steps: [
        { label: 'Step 1: Possible sums', content: 'Min = 1+1 = 2. Max = 6+6 = 12. There are 36 equally likely outcomes.' },
        { label: 'Step 2: Frequency of each sum', content: '| Sum | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |\n|-----|---|---|---|---|---|---|---|---|----|----|----|\n| Ways | 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 | 3 | 2 | 1 |' },
        { label: 'Step 3: Mean', content: 'Sum of all 36 outcomes = 252. Mean = 252/36 = **7**' },
        { label: 'Step 4: Median', content: 'The 18th and 19th values (of 36) are both 7. Median = **7**' },
        { label: 'Step 5: Mode', content: '7 appears most (6 ways). Mode = **7**' },
      ],
      answer: 'Mean = 7, Median = 7, Mode = 7',
    },
    {
      id: 'mmm-24', difficulty: 2,
      question: 'The mean of 10 numbers is 15. If one number (50) is removed, what is the mean of the remaining 9?',
      steps: [
        { label: 'Step 1: Total of 10 numbers', content: '10 × 15 = **150**' },
        { label: 'Step 2: Remove 50', content: '150 − 50 = **100**' },
        { label: 'Step 3: New mean', content: '100 ÷ 9 = **11.1**' },
      ],
      answer: '11.1',
    },
    {
      id: 'mmm-25', difficulty: 2,
      question: 'Find the **IQR** (Interquartile Range) of: 5, 8, 12, 15, 18, 22, 25, 30',
      steps: [
        { label: 'Step 1: Data is already sorted', content: '5, 8, 12, 15, 18, 22, 25, 30 (8 values)' },
        { label: 'Step 2: Find Q1 (median of lower half)', content: 'Lower half: 5, 8, 12, 15 → Q1 = (8+12)/2 = **10**' },
        { label: 'Step 3: Find Q3 (median of upper half)', content: 'Upper half: 18, 22, 25, 30 → Q3 = (22+25)/2 = **23.5**' },
        { label: 'Step 4: IQR = Q3 − Q1', content: '23.5 − 10 = **13.5**' },
      ],
      answer: 'IQR = 13.5',
    },
    {
      id: 'mmm-26', difficulty: 2,
      question: 'A shop tracks daily customers: 45, 52, 48, 51, 47, 200, 50. The 200 was a festival day. Report both the mean and the **trimmed mean** (remove the highest and lowest).',
      steps: [
        { label: 'Regular mean', content: '(45+52+48+51+47+200+50)/7 = 493/7 = **70.4**' },
        { label: 'Sorted', content: '45, 47, 48, 50, 51, 52, 200' },
        { label: 'Trimmed mean (remove 45 and 200)', content: '(47+48+50+51+52)/5 = 248/5 = **49.6**' },
        { label: 'Insight', content: 'The festival day inflated the regular mean by 20. The trimmed mean (49.6) better represents a "normal" day.' },
      ],
      answer: 'Mean = 70.4, Trimmed mean = 49.6',
    },
    {
      id: 'mmm-27', difficulty: 2,
      question: 'Two datasets have the same mean (50) but dataset A has range 10 and dataset B has range 80. Which is more consistent?',
      steps: [
        { label: 'Step 1: Think about range', content: 'Range = max − min. Small range = values are close together.' },
        { label: 'Step 2: Compare', content: 'A: range 10 → values are between ~45 and ~55. Very consistent.' },
        { label: 'Step 3', content: 'B: range 80 → values are between ~10 and ~90. Very spread out.' },
      ],
      answer: 'Dataset A is more consistent (range = 10)',
    },
    {
      id: 'mmm-28', difficulty: 2,
      question: 'Can a dataset have two modes? Give an example.',
      steps: [
        { label: 'Answer', content: '**Yes.** This is called **bimodal** data.' },
        { label: 'Example', content: 'Data: 2, 2, 2, 5, 5, 5, 8 → Mode = 2 AND 5 (both appear 3 times)' },
        { label: 'Real-world example', content: 'Heights of all adults: two peaks (one for men, one for women) → bimodal distribution.' },
      ],
      answer: 'Yes — called bimodal',
    },
    {
      id: 'mmm-29', difficulty: 2,
      question: 'A cricket team scores: 45, 120, 32, 88, 155, 12, 67, 95, 200, 78, 44. Find the mean, median, and identify any outliers using the IQR method.',
      steps: [
        { label: 'Step 1: Sort', content: '12, 32, 44, 45, 67, 78, 88, 95, 120, 155, 200' },
        { label: 'Step 2: Mean', content: 'Sum = 936. Mean = 936/11 = **85.1**' },
        { label: 'Step 3: Median', content: '11 values → 6th value = **78**' },
        { label: 'Step 4: Q1 and Q3', content: 'Lower half (12,32,44,45,67): Q1 = 44. Upper half (88,95,120,155,200): Q3 = 120' },
        { label: 'Step 5: IQR', content: '120 − 44 = 76' },
        { label: 'Step 6: Outlier fences', content: 'Lower: 44 − 1.5×76 = −70. Upper: 120 + 1.5×76 = 234. No values outside → **no outliers**.' },
      ],
      answer: 'Mean = 85.1, Median = 78, No outliers',
    },
    {
      id: 'mmm-30', difficulty: 2,
      question: 'In a class of 30 students, the mean height is 155 cm. If 10 boys have mean height 162 cm, what is the mean height of the 20 girls?',
      steps: [
        { label: 'Step 1: Total height of all 30', content: '30 × 155 = 4650 cm' },
        { label: 'Step 2: Total height of boys', content: '10 × 162 = 1620 cm' },
        { label: 'Step 3: Total height of girls', content: '4650 − 1620 = 3030 cm' },
        { label: 'Step 4: Mean height of girls', content: '3030 ÷ 20 = **151.5 cm**' },
      ],
      answer: '151.5 cm',
    },
    {
      id: 'mmm-31', difficulty: 2,
      question: 'You draw 5 cards from a standard deck: 3♠, 7♥, 7♦, J♣, K♠. Find the mean, median, and mode (J=11, Q=12, K=13).',
      visual: { kind: 'cards', drawn: ['3♠', '7♥', '7♦', 'J♣', 'K♠'] },
      steps: [
        { label: 'Step 1: Convert to numbers', content: '3, 7, 7, 11, 13' },
        { label: 'Step 2: Mean', content: '(3+7+7+11+13)/5 = 41/5 = **8.2**' },
        { label: 'Step 3: Median', content: 'Sorted: 3, 7, **7**, 11, 13 → Median = **7**' },
        { label: 'Step 4: Mode', content: '7 appears twice → Mode = **7**' },
      ],
      answer: 'Mean = 8.2, Median = 7, Mode = 7',
    },
    {
      id: 'mmm-32', difficulty: 2,
      question: 'You wait for buses at different times this week (minutes): 3, 8, 2, 15, 4, 6, 1. Find the mean and median wait time.',
      visual: { kind: 'waiting', avgMinutes: 5.6, markTime: 4 },
      steps: [
        { label: 'Step 1: Mean', content: '(3+8+2+15+4+6+1)/7 = 39/7 = **5.6 min**' },
        { label: 'Step 2: Sort', content: '1, 2, 3, 4, 6, 8, 15' },
        { label: 'Step 3: Median', content: '7 values → 4th value = **4 min**' },
        { label: 'Insight', content: 'The one long wait (15 min) pulled the mean up. The median (4 min) is more typical.' },
      ],
      answer: 'Mean = 5.6 min, Median = 4 min',
    },
    {
      id: 'mmm-33', difficulty: 2,
      question: 'If the mean of {a, b, c} is 10, what is the mean of {a+5, b+5, c+5}?',
      hint: 'What happens to the mean when you add the same number to every value?',
      steps: [
        { label: 'Step 1: Original mean', content: '(a+b+c)/3 = 10, so a+b+c = 30' },
        { label: 'Step 2: New sum', content: '(a+5) + (b+5) + (c+5) = a+b+c + 15 = 30 + 15 = 45' },
        { label: 'Step 3: New mean', content: '45/3 = **15**' },
        { label: 'Rule', content: 'Adding k to every value increases the mean by k.' },
      ],
      answer: '15',
    },
    {
      id: 'mmm-34', difficulty: 2,
      question: 'If the mean of {a, b, c} is 10, what is the mean of {2a, 2b, 2c}?',
      steps: [
        { label: 'Step 1: Original', content: '(a+b+c)/3 = 10, so a+b+c = 30' },
        { label: 'Step 2: New sum', content: '2a + 2b + 2c = 2(a+b+c) = 2 × 30 = 60' },
        { label: 'Step 3: New mean', content: '60/3 = **20**' },
        { label: 'Rule', content: 'Multiplying every value by k multiplies the mean by k.' },
      ],
      answer: '20',
    },

    // ── Hard (35-50) ───────────────────────────────────────
    {
      id: 'mmm-35', difficulty: 3,
      question: 'In a company, 8 employees earn ₹25,000/month and 2 managers earn ₹1,00,000/month. The company reports "average salary = ₹40,000." Is this misleading? What measure would be more honest?',
      steps: [
        { label: 'Step 1: Verify the mean', content: '(8×25000 + 2×100000)/10 = (200000+200000)/10 = 400000/10 = **₹40,000** ✓' },
        { label: 'Step 2: Find the median', content: 'Sorted: 25k, 25k, 25k, 25k, 25k, 25k, 25k, 25k, 100k, 100k. Median = (25000+25000)/2 = **₹25,000**' },
        { label: 'Step 3: Assessment', content: '**Yes, it is misleading.** 80% of employees earn ₹25,000 but the "average" suggests they earn ₹40,000. The median (₹25,000) honestly represents what a typical employee earns.' },
      ],
      answer: 'Yes — the median (₹25,000) is more honest than the mean (₹40,000)',
      code: '# 8 employees at 25000, 2 managers at 100000\nsalaries = [25000]*8 + [100000]*2\n\n# Find mean, median, and explain which is better\n',
      codeSolution: 'salaries = [25000]*8 + [100000]*2\n\nmean = sum(salaries) / len(salaries)\nsorted_s = sorted(salaries)\nn = len(sorted_s)\nmedian = (sorted_s[n//2-1] + sorted_s[n//2]) / 2\n\nprint(f"Mean salary: {mean:,.0f}")\nprint(f"Median salary: {median:,.0f}")\nprint(f"\\n80% earn {salaries[0]:,} but the mean suggests {mean:,.0f}")\nprint("The median is more representative.")',
    },
    {
      id: 'mmm-36', difficulty: 3,
      question: 'A teacher wants the class mean to be exactly 75. The 9 existing students have scores: 60, 65, 70, 72, 75, 78, 80, 85, 90. What must the 10th student score?',
      steps: [
        { label: 'Step 1: Target total', content: '10 students × 75 = 750' },
        { label: 'Step 2: Existing total', content: '60+65+70+72+75+78+80+85+90 = 675' },
        { label: 'Step 3: Missing score', content: '750 − 675 = **75**' },
      ],
      answer: '75',
    },
    {
      id: 'mmm-37', difficulty: 3,
      question: 'Prove that the sum of deviations from the mean always equals zero. Use data: 3, 7, 5.',
      steps: [
        { label: 'Step 1: Mean', content: '(3+7+5)/3 = 15/3 = 5' },
        { label: 'Step 2: Deviations', content: '(3−5) + (7−5) + (5−5) = −2 + 2 + 0 = **0** ✓' },
        { label: 'Step 3: General proof', content: 'Σ(xᵢ − x̄) = Σxᵢ − Σx̄ = Σxᵢ − n×x̄ = Σxᵢ − n×(Σxᵢ/n) = Σxᵢ − Σxᵢ = **0** ∎' },
        { label: 'Why this matters', content: 'This is exactly why we cannot use "average deviation" to measure spread — it is always zero. We must square the deviations first (→ variance).' },
      ],
      answer: '0 (always)',
    },
    {
      id: 'mmm-38', difficulty: 3,
      question: 'India\'s GDP per capita is about ₹1,72,000. The median household income is about ₹1,20,000. Explain why they differ and which better represents a "typical" Indian.',
      steps: [
        { label: 'Step 1: Why mean > median', content: 'A small number of very wealthy individuals (billionaires, top executives) pull the mean upward. The median is not affected by extreme wealth.' },
        { label: 'Step 2: Which is more representative?', content: 'The **median** better represents a typical Indian. More than half the population earns less than ₹1,72,000, so the mean overstates what most people experience.' },
        { label: 'Step 3: The shape', content: 'Income is **right-skewed** (long tail of high earners). For skewed data: mean > median > mode (for right skew). Use the median.' },
      ],
      answer: 'Median (₹1,20,000) — right-skewed data makes the mean misleading',
    },
    {
      id: 'mmm-39', difficulty: 3,
      question: 'Find a dataset of exactly 5 whole numbers where: mean = 6, median = 5, mode = 5, range = 8.',
      hint: 'Start with the median and mode: at least two 5s in the middle. Then adjust the ends to get the right mean and range.',
      steps: [
        { label: 'Step 1: Median = 5', content: 'The 3rd value (sorted) must be 5' },
        { label: 'Step 2: Mode = 5', content: 'At least two values are 5. Put 5 in positions 2 and 3: _, 5, 5, _, _' },
        { label: 'Step 3: Range = 8', content: 'Max − Min = 8. If Min = 2, then Max = 10: 2, 5, 5, _, 10' },
        { label: 'Step 4: Mean = 6', content: 'Sum must be 5 × 6 = 30. Current sum: 2+5+5+10 = 22. Missing value: 30 − 22 = **8**' },
        { label: 'Step 5: Check', content: 'Data: 2, 5, 5, 8, 10. Mean = 30/5 = 6 ✓ Median = 5 ✓ Mode = 5 ✓ Range = 8 ✓' },
      ],
      answer: '{2, 5, 5, 8, 10}',
    },
    {
      id: 'mmm-40', difficulty: 3,
      question: 'The mean of 100 values is 50. You discover one value was recorded as 90 instead of the correct 40. What is the corrected mean?',
      steps: [
        { label: 'Step 1: Original total', content: '100 × 50 = 5000' },
        { label: 'Step 2: Fix the error', content: 'Remove 90, add 40: 5000 − 90 + 40 = **4950**' },
        { label: 'Step 3: Corrected mean', content: '4950 ÷ 100 = **49.5**' },
      ],
      answer: '49.5',
    },
    {
      id: 'mmm-41', difficulty: 3,
      question: 'Combine two groups. Group A: 20 students, mean = 80. Group B: 30 students, mean = 70. What is the combined mean?',
      hint: 'You cannot just average 80 and 70 — the groups have different sizes.',
      steps: [
        { label: 'Step 1: Total for A', content: '20 × 80 = 1600' },
        { label: 'Step 2: Total for B', content: '30 × 70 = 2100' },
        { label: 'Step 3: Combined', content: '(1600 + 2100) / (20 + 30) = 3700 / 50 = **74**' },
        { label: 'Insight', content: 'The combined mean (74) is closer to Group B\'s mean (70) because Group B has more students. This is the **weighted mean**: (20×80 + 30×70) / 50.' },
      ],
      answer: '74',
      code: '# Group A: 20 students, mean 80\n# Group B: 30 students, mean 70\n# Find combined mean\n',
      codeSolution: 'n_a, mean_a = 20, 80\nn_b, mean_b = 30, 70\n\ncombined_mean = (n_a * mean_a + n_b * mean_b) / (n_a + n_b)\nprint(f"Combined mean = {combined_mean}")\nprint(f"Note: closer to {mean_b} because group B is larger")',
    },
    {
      id: 'mmm-42', difficulty: 3,
      question: 'A runner\'s 5 km split times are: 5:20, 4:50, 5:10, 4:40, 5:00 (in minutes:seconds). Find the mean split time.',
      steps: [
        { label: 'Step 1: Convert to seconds', content: '5:20 = 320s, 4:50 = 290s, 5:10 = 310s, 4:40 = 280s, 5:00 = 300s' },
        { label: 'Step 2: Mean in seconds', content: '(320+290+310+280+300)/5 = 1500/5 = **300 seconds**' },
        { label: 'Step 3: Convert back', content: '300 seconds = **5:00** (5 minutes exactly)' },
      ],
      answer: '5:00 (300 seconds)',
    },
    {
      id: 'mmm-43', difficulty: 3,
      question: 'Show that the mean minimises the sum of squared deviations. That is: for any constant c, Σ(xᵢ − c)² is smallest when c = x̄. Use data {1, 5, 6}.',
      steps: [
        { label: 'Step 1: Mean', content: 'x̄ = (1+5+6)/3 = 4' },
        { label: 'Step 2: Try c = 4 (the mean)', content: 'Σ(xᵢ−4)² = (1−4)² + (5−4)² + (6−4)² = 9 + 1 + 4 = **14**' },
        { label: 'Step 3: Try c = 3', content: 'Σ(xᵢ−3)² = 4 + 4 + 9 = **17** (bigger)' },
        { label: 'Step 4: Try c = 5', content: 'Σ(xᵢ−5)² = 16 + 0 + 1 = **17** (bigger)' },
        { label: 'Step 5: Try c = 4.5', content: 'Σ(xᵢ−4.5)² = 12.25 + 0.25 + 2.25 = **14.75** (bigger)' },
        { label: 'Conclusion', content: 'c = 4 (the mean) gives the smallest total: **14**. This is always true — the mean is the unique minimiser of squared deviations.' },
      ],
      answer: 'Minimum = 14 at c = 4 (the mean)',
      code: '# Verify: the mean minimizes sum of squared deviations\ndata = [1, 5, 6]\nmean = sum(data) / len(data)\n\nfor c in [2, 3, 3.5, 4, 4.5, 5, 6]:\n    ssd = sum((x - c)**2 for x in data)\n    marker = " <-- MINIMUM" if abs(c - mean) < 0.01 else ""\n    print(f"c = {c}: sum of squared deviations = {ssd}{marker}")\n',
      codeSolution: 'data = [1, 5, 6]\nmean = sum(data) / len(data)\n\nprint(f"Mean = {mean}\\n")\nfor c in [2, 3, 3.5, 4, 4.5, 5, 6]:\n    ssd = sum((x - c)**2 for x in data)\n    marker = " <-- MINIMUM" if abs(c - mean) < 0.01 else ""\n    print(f"c = {c}: sum of squared deviations = {ssd}{marker}")',
    },
    {
      id: 'mmm-44', difficulty: 3,
      question: 'A median is considered better than the mean for skewed data. But can you construct a dataset where the median is MORE misleading than the mean?',
      steps: [
        { label: 'Step 1: Think of bimodal data', content: 'Data: 10, 10, 10, 10, 50, 90, 90, 90, 90' },
        { label: 'Step 2: Mean = 40, Median = 50', content: 'The data clusters around 10 and 90. Neither the mean (40) nor the median (50) represents a "typical" value — nobody is near 50!' },
        { label: 'Step 3: The mode is more informative', content: 'Modes are 10 and 90. This bimodal data is best described by two modes, not one center measure.' },
      ],
      answer: 'Bimodal data — the median falls between two clusters where no data exists',
    },
    {
      id: 'mmm-45', difficulty: 3,
      question: 'Your batting average this season is 45.0 (10 innings). You need your average to reach 50.0 by the end of 12 innings. What must you score in the next 2 innings combined?',
      steps: [
        { label: 'Step 1: Current total', content: '10 × 45 = 450 runs' },
        { label: 'Step 2: Target total', content: '12 × 50 = 600 runs' },
        { label: 'Step 3: Needed in 2 innings', content: '600 − 450 = **150 runs** (average 75 per innings)' },
      ],
      answer: '150 runs total (75 per innings)',
    },
    {
      id: 'mmm-46', difficulty: 3,
      question: 'A dataset of 1000 values has mean = 100 and median = 100. A new value of 1,000,000 is added. Estimate the new mean and new median.',
      steps: [
        { label: 'Step 1: New mean', content: 'Old total = 1000 × 100 = 100,000. New total = 100,000 + 1,000,000 = 1,100,000. New mean = 1,100,000/1001 ≈ **1099**' },
        { label: 'Step 2: New median', content: '1001 values → median is the 501st. Adding one extreme value shifts the median by at most one position. New median ≈ **100** (barely changes)' },
        { label: 'Insight', content: 'One outlier changed the mean from 100 to 1099 (11× increase!) but the median barely moved. This is why the median is robust.' },
      ],
      answer: 'Mean ≈ 1099, Median ≈ 100',
    },
    {
      id: 'mmm-47', difficulty: 3,
      question: 'The harmonic mean of speeds. You drive 60 km at 30 km/h and 60 km at 60 km/h. What is your average speed for the whole trip? (It is NOT 45 km/h.)',
      hint: 'Average speed = total distance / total time. The arithmetic mean of speeds is WRONG when distances are equal.',
      steps: [
        { label: 'Step 1: Time for leg 1', content: '60 km ÷ 30 km/h = 2 hours' },
        { label: 'Step 2: Time for leg 2', content: '60 km ÷ 60 km/h = 1 hour' },
        { label: 'Step 3: Total', content: '120 km in 3 hours = **40 km/h**' },
        { label: 'Step 4: Harmonic mean formula', content: 'H = 2 / (1/30 + 1/60) = 2 / (0.0333 + 0.0167) = 2 / 0.05 = **40** ✓' },
        { label: 'Why not 45?', content: 'You spent MORE TIME at the slower speed (2 hrs vs 1 hr), so the average is pulled toward 30. The arithmetic mean (45) wrongly assumes equal time at each speed.' },
      ],
      answer: '40 km/h (harmonic mean)',
    },
    {
      id: 'mmm-48', difficulty: 3,
      question: 'An investment grows: Year 1: +20%, Year 2: −10%, Year 3: +15%. The arithmetic mean return is 8.3%. But what is your ACTUAL average annual return? (Use the geometric mean.)',
      steps: [
        { label: 'Step 1: Growth factors', content: '1.20, 0.90, 1.15' },
        { label: 'Step 2: Total growth', content: '1.20 × 0.90 × 1.15 = **1.242**' },
        { label: 'Step 3: Geometric mean', content: '(1.242)^(1/3) − 1 = 1.0749 − 1 = **7.5%**' },
        { label: 'Why not 8.3%?', content: 'The arithmetic mean (8.3%) overstates the return. If you invested ₹100: after 3 years you have ₹124.20, not ₹127.60. The geometric mean (7.5%) gives the correct compound growth.' },
      ],
      answer: '7.5% per year (geometric mean)',
      code: '# Investment returns: +20%, -10%, +15%\n# Calculate arithmetic mean vs geometric mean\n',
      codeSolution: 'returns = [0.20, -0.10, 0.15]\n\narith_mean = sum(returns) / len(returns)\n\nimport math\ngrowth_factors = [1 + r for r in returns]\nproduct = math.prod(growth_factors)\ngeo_mean = product ** (1/len(returns)) - 1\n\nprint(f"Arithmetic mean: {arith_mean:.1%}")\nprint(f"Geometric mean:  {geo_mean:.1%}")\nprint(f"\\n₹100 invested becomes: ₹{100 * product:.2f}")\nprint(f"At arithmetic mean: ₹{100 * (1 + arith_mean)**3:.2f} (wrong!)")\nprint(f"At geometric mean:  ₹{100 * (1 + geo_mean)**3:.2f} (correct)")',
    },
    {
      id: 'mmm-49', difficulty: 3,
      question: 'You have 50 exam scores with mean 68 and standard deviation 12. Without seeing the data, what can you say about how many students scored between 44 and 92?',
      hint: 'Use Chebyshev\'s inequality: at least 1 − 1/k² of data is within k standard deviations.',
      steps: [
        { label: 'Step 1: Express the range in σ', content: '44 = 68 − 24 = 68 − 2×12 → 2σ below. 92 = 68 + 24 = 68 + 2×12 → 2σ above.' },
        { label: 'Step 2: k = 2', content: 'The range 44–92 is "within 2σ of the mean."' },
        { label: 'Step 3: Chebyshev', content: 'At least 1 − 1/2² = 1 − 0.25 = **75%** of data is within 2σ' },
        { label: 'Step 4: Apply', content: '75% of 50 = at least **37.5 → at least 38 students** scored between 44 and 92' },
        { label: 'Note', content: 'If the data is bell-shaped (normal), ~95% (about 47–48 students) would be in this range. Chebyshev gives a weaker but guaranteed bound.' },
      ],
      answer: 'At least 38 students (75% by Chebyshev)',
    },
    {
      id: 'mmm-50', difficulty: 3,
      question: 'A student claims: "I scored above the class median, so I scored above average." Is this always true?',
      steps: [
        { label: 'Step 1: When it IS true', content: 'For symmetric (bell-shaped) data, mean ≈ median. Scoring above the median means scoring above the mean.' },
        { label: 'Step 2: When it is NOT true', content: 'For **left-skewed** data (mean < median), the mean is BELOW the median. You can score above the median but below the mean.' },
        { label: 'Step 3: Example', content: 'Scores: 10, 85, 90, 92, 95. Median = 90, Mean = 74.4. A student scoring 88 is above the median but above the mean too. A student scoring 80 is below the median and also above the mean.' },
        { label: 'Better example', content: 'Scores: 20, 25, 30, 90, 95. Median = 30, Mean = 52. Scoring 35 is above the median (30) but below the mean (52). The claim is FALSE.' },
      ],
      answer: 'No — in skewed data, mean and median differ, so above-median does not guarantee above-mean',
    },
  ],
};
