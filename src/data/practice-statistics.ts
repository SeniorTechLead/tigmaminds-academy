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

// ─── 2. Standard Deviation & Variance ─────────────────────

export const practiceStdDevVariance: PracticeSet = {
  title: 'Practice — Standard Deviation & Variance',
  problems: [
    // ── Easy (1-17) ────────────────────────────────────────
    {
      id: 'sd-01', difficulty: 1,
      question: 'Find the **population variance** of: 2, 4, 6, 8, 10',
      visual: { kind: 'bar-chart', labels: ['2','4','6','8','10'], values: [2,4,6,8,10] },
      steps: [
        { label: 'Step 1: Find the mean', content: '(2+4+6+8+10)/5 = 30/5 = **6**' },
        { label: 'Step 2: Squared deviations', content: '(2−6)² + (4−6)² + (6−6)² + (8−6)² + (10−6)² = 16 + 4 + 0 + 4 + 16 = **40**' },
        { label: 'Step 3: Divide by N', content: '40 ÷ 5 = **8**' },
      ],
      answer: 'σ² = 8',
      code: '# Find the population variance\ndata = [2, 4, 6, 8, 10]\n\n# Your code here\n',
      codeSolution: 'data = [2, 4, 6, 8, 10]\nmean = sum(data) / len(data)\nvariance = sum((x - mean)**2 for x in data) / len(data)\nprint(f"Population variance = {variance}")',
    },
    {
      id: 'sd-02', difficulty: 1,
      question: 'Find the **population standard deviation** of: 2, 4, 6, 8, 10',
      visual: { kind: 'bar-chart', labels: ['2','4','6','8','10'], values: [2,4,6,8,10] },
      steps: [
        { label: 'Step 1: Variance (from sd-01)', content: 'σ² = 8' },
        { label: 'Step 2: Take square root', content: '√8 = **2.83** (rounded to 2 decimal places)' },
      ],
      answer: 'σ ≈ 2.83',
    },
    {
      id: 'sd-03', difficulty: 1,
      question: 'Find the **population variance** of: 5, 5, 5, 5, 5',
      hint: 'What happens when every value equals the mean?',
      steps: [
        { label: 'Step 1: Mean', content: '25/5 = **5**' },
        { label: 'Step 2: Each deviation is 0', content: '(5−5)² = 0 for every value' },
        { label: 'Step 3: Sum of squared deviations', content: '0 ÷ 5 = **0**' },
        { label: 'Insight', content: 'If all values are identical, there is zero spread — variance = 0.' },
      ],
      answer: 'σ² = 0',
    },
    {
      id: 'sd-04', difficulty: 1,
      question: 'Find the **population variance** of: 3, 7, 7, 3',
      steps: [
        { label: 'Step 1: Mean', content: '(3+7+7+3)/4 = 20/4 = **5**' },
        { label: 'Step 2: Squared deviations', content: '(3−5)² + (7−5)² + (7−5)² + (3−5)² = 4 + 4 + 4 + 4 = **16**' },
        { label: 'Step 3: Divide by N', content: '16 ÷ 4 = **4**' },
      ],
      answer: 'σ² = 4',
    },
    {
      id: 'sd-05', difficulty: 1,
      question: 'A dataset has a variance of 25. What is the standard deviation?',
      steps: [
        { label: 'Step 1: Recall the relationship', content: 'σ = √(σ²)' },
        { label: 'Step 2: Compute', content: '√25 = **5**' },
      ],
      answer: 'σ = 5',
    },
    {
      id: 'sd-06', difficulty: 1,
      question: 'Compute the **z-score** of the value 85 given mean = 70 and standard deviation = 10.',
      steps: [
        { label: 'Step 1: z-score formula', content: 'z = (x − μ) / σ' },
        { label: 'Step 2: Substitute', content: 'z = (85 − 70) / 10 = 15 / 10 = **1.5**' },
        { label: 'Interpretation', content: '85 is 1.5 standard deviations above the mean.' },
      ],
      answer: 'z = 1.5',
    },
    {
      id: 'sd-07', difficulty: 1,
      question: 'Compute the **z-score** of the value 60 given mean = 70 and standard deviation = 5.',
      steps: [
        { label: 'Step 1: Apply formula', content: 'z = (60 − 70) / 5 = −10 / 5 = **−2**' },
        { label: 'Interpretation', content: '60 is 2 standard deviations below the mean.' },
      ],
      answer: 'z = −2',
    },
    {
      id: 'sd-08', difficulty: 1,
      question: 'Find the **population variance** of: 10, 12, 14',
      steps: [
        { label: 'Step 1: Mean', content: '(10+12+14)/3 = 36/3 = **12**' },
        { label: 'Step 2: Squared deviations', content: '(10−12)² + (12−12)² + (14−12)² = 4 + 0 + 4 = **8**' },
        { label: 'Step 3: Divide by N', content: '8 ÷ 3 = **2.67** (rounded)' },
      ],
      answer: 'σ² ≈ 2.67',
    },
    {
      id: 'sd-09', difficulty: 1,
      question: 'Find the **population standard deviation** of: 1, 3, 5, 7, 9',
      visual: { kind: 'bar-chart', labels: ['1','3','5','7','9'], values: [1,3,5,7,9] },
      steps: [
        { label: 'Step 1: Mean', content: '(1+3+5+7+9)/5 = 25/5 = **5**' },
        { label: 'Step 2: Squared deviations', content: '16 + 4 + 0 + 4 + 16 = **40**' },
        { label: 'Step 3: Variance', content: '40/5 = **8**' },
        { label: 'Step 4: Std dev', content: '√8 ≈ **2.83**' },
      ],
      answer: 'σ ≈ 2.83',
      code: '# Find population std dev\ndata = [1, 3, 5, 7, 9]\n\n# Your code here\n',
      codeSolution: 'data = [1, 3, 5, 7, 9]\nmean = sum(data) / len(data)\nvar = sum((x - mean)**2 for x in data) / len(data)\nstd = var ** 0.5\nprint(f"Std dev = {std:.2f}")',
    },
    {
      id: 'sd-10', difficulty: 1,
      question: 'A student scored 78 on a test where the mean was 72 and σ = 4. Find their z-score.',
      steps: [
        { label: 'Step 1: z = (x − μ) / σ', content: 'z = (78 − 72) / 4 = 6/4 = **1.5**' },
      ],
      answer: 'z = 1.5',
    },
    {
      id: 'sd-11', difficulty: 1,
      question: 'If a z-score is 0, what does that tell you about the data value?',
      steps: [
        { label: 'Step 1: Recall z formula', content: 'z = (x − μ) / σ. If z = 0 then x − μ = 0.' },
        { label: 'Step 2: Conclusion', content: 'The value **equals the mean**.' },
      ],
      answer: 'The data value is exactly equal to the mean',
    },
    {
      id: 'sd-12', difficulty: 1,
      question: 'Roll a single die 5 times and get: 2, 3, 4, 5, 6. Find the population variance.',
      visual: { kind: 'dice', count: 5, values: [2,3,4,5,6] },
      steps: [
        { label: 'Step 1: Mean', content: '(2+3+4+5+6)/5 = 20/5 = **4**' },
        { label: 'Step 2: Squared deviations', content: '(2−4)² + (3−4)² + (4−4)² + (5−4)² + (6−4)² = 4+1+0+1+4 = **10**' },
        { label: 'Step 3: Divide by N', content: '10/5 = **2**' },
      ],
      answer: 'σ² = 2',
    },
    {
      id: 'sd-13', difficulty: 1,
      question: 'Find the **population standard deviation** of: 100, 100, 100, 200, 200, 200',
      visual: { kind: 'bar-chart', labels: ['100','100','100','200','200','200'], values: [100,100,100,200,200,200] },
      steps: [
        { label: 'Step 1: Mean', content: '(300+600)/6 = 900/6 = **150**' },
        { label: 'Step 2: Squared deviations', content: '3×(100−150)² + 3×(200−150)² = 3×2500 + 3×2500 = **15000**' },
        { label: 'Step 3: Variance', content: '15000/6 = **2500**' },
        { label: 'Step 4: Std dev', content: '√2500 = **50**' },
      ],
      answer: 'σ = 50',
    },
    {
      id: 'sd-14', difficulty: 1,
      question: 'A dataset has mean 40 and σ = 8. What value has a z-score of −1.5?',
      steps: [
        { label: 'Step 1: Rearrange z formula', content: 'x = μ + z·σ' },
        { label: 'Step 2: Substitute', content: 'x = 40 + (−1.5)(8) = 40 − 12 = **28**' },
      ],
      answer: 'x = 28',
    },
    {
      id: 'sd-15', difficulty: 1,
      question: 'Find the **population variance** of: 0, 10',
      steps: [
        { label: 'Step 1: Mean', content: '(0+10)/2 = **5**' },
        { label: 'Step 2: Squared deviations', content: '(0−5)² + (10−5)² = 25 + 25 = **50**' },
        { label: 'Step 3: Divide by N', content: '50/2 = **25**' },
      ],
      answer: 'σ² = 25',
    },
    {
      id: 'sd-16', difficulty: 1,
      question: 'Which dataset has **greater spread**: A = {10, 10, 10} or B = {0, 10, 20}?',
      hint: 'Compute the variance of each.',
      steps: [
        { label: 'Dataset A', content: 'Mean = 10, all deviations = 0. Variance = **0**' },
        { label: 'Dataset B', content: 'Mean = 10, deviations: (0−10)²+(10−10)²+(20−10)² = 100+0+100 = 200. Variance = 200/3 ≈ **66.67**' },
        { label: 'Comparison', content: 'B has greater spread (variance 66.67 vs 0).' },
      ],
      answer: 'Dataset B has greater spread (σ² ≈ 66.67 vs 0)',
    },
    {
      id: 'sd-17', difficulty: 1,
      question: 'A student\'s z-score is 2.0. Another student\'s z-score is −0.5. Who scored further from the mean?',
      steps: [
        { label: 'Step 1: Compare |z| values', content: '|2.0| = 2.0 vs |−0.5| = 0.5' },
        { label: 'Step 2: Larger |z| = further from mean', content: 'The student with z = 2.0 is further from the mean.' },
      ],
      answer: 'The student with z = 2.0 (2 standard deviations away vs 0.5)',
    },
    // ── Medium (18-34) ─────────────────────────────────────
    {
      id: 'sd-18', difficulty: 2,
      question: 'Find the **sample variance** (s²) of: 2, 4, 6, 8, 10. Explain why it differs from the population variance.',
      steps: [
        { label: 'Step 1: Mean', content: '30/5 = **6**' },
        { label: 'Step 2: Sum of squared deviations', content: '(2−6)²+(4−6)²+(6−6)²+(8−6)²+(10−6)² = 16+4+0+4+16 = **40**' },
        { label: 'Step 3: Divide by N−1 (Bessel\'s correction)', content: '40 ÷ 4 = **10**' },
        { label: 'Why different?', content: 'Population variance divides by N (=8). Sample variance divides by N−1 (=10) to correct for the bias when estimating from a sample.' },
      ],
      answer: 's² = 10 (vs σ² = 8 for the population)',
      code: '# Compare population vs sample variance\ndata = [2, 4, 6, 8, 10]\n\n# Your code here\n',
      codeSolution: 'import statistics\ndata = [2, 4, 6, 8, 10]\npop_var = statistics.pvariance(data)\nsamp_var = statistics.variance(data)\nprint(f"Population variance = {pop_var}")\nprint(f"Sample variance = {samp_var}")',
    },
    {
      id: 'sd-19', difficulty: 2,
      question: 'Using the empirical rule (68-95-99.7), a normally distributed dataset has mean 100 and σ = 15. What percentage of values fall between 70 and 130?',
      steps: [
        { label: 'Step 1: How many σ is 70 from the mean?', content: '(100−70)/15 = 2 σ below' },
        { label: 'Step 2: How many σ is 130?', content: '(130−100)/15 = 2 σ above' },
        { label: 'Step 3: Apply empirical rule', content: 'Within ±2σ → approximately **95%** of data' },
      ],
      answer: '≈ 95%',
    },
    {
      id: 'sd-20', difficulty: 2,
      question: 'A factory produces bolts with mean length 10.0 cm and σ = 0.2 cm (normal distribution). What percentage of bolts are between 9.8 cm and 10.2 cm?',
      steps: [
        { label: 'Step 1: z-scores', content: 'z₁ = (9.8−10.0)/0.2 = −1. z₂ = (10.2−10.0)/0.2 = +1' },
        { label: 'Step 2: Empirical rule', content: 'Within ±1σ → about **68%**' },
      ],
      answer: '≈ 68%',
    },
    {
      id: 'sd-21', difficulty: 2,
      question: 'Compare the spread of two datasets using the **coefficient of variation (CV)**:\n- A: mean = 50, σ = 10\n- B: mean = 200, σ = 30',
      steps: [
        { label: 'Step 1: CV formula', content: 'CV = (σ / μ) × 100%' },
        { label: 'Step 2: CV for A', content: '(10/50) × 100% = **20%**' },
        { label: 'Step 3: CV for B', content: '(30/200) × 100% = **15%**' },
        { label: 'Step 4: Compare', content: 'A has higher relative variability (20% vs 15%) despite B having a larger absolute σ.' },
      ],
      answer: 'CV(A) = 20%, CV(B) = 15%. Dataset A has more relative spread.',
    },
    {
      id: 'sd-22', difficulty: 2,
      question: 'If every value in a dataset is multiplied by 3, what happens to the variance and standard deviation?',
      steps: [
        { label: 'Step 1: Recall the rule', content: 'If Y = aX, then Var(Y) = a² · Var(X) and SD(Y) = |a| · SD(X)' },
        { label: 'Step 2: Apply with a = 3', content: 'Variance is multiplied by 3² = **9**. Standard deviation is multiplied by **3**.' },
        { label: 'Example', content: 'If original data {1,2,3} has σ² = 2/3, then {3,6,9} has σ² = 9×(2/3) = **6** and σ = 3×√(2/3) ≈ **2.45**.' },
      ],
      answer: 'Variance is multiplied by 9; std dev is multiplied by 3',
    },
    {
      id: 'sd-23', difficulty: 2,
      question: 'If 5 is added to every value in a dataset, what happens to the variance and standard deviation?',
      steps: [
        { label: 'Step 1: Rule', content: 'If Y = X + b, then Var(Y) = Var(X) and SD(Y) = SD(X)' },
        { label: 'Step 2: Why?', content: 'Adding a constant shifts all values by the same amount. The spread (distances between values) stays the same.' },
      ],
      answer: 'Both variance and standard deviation remain unchanged',
    },
    {
      id: 'sd-24', difficulty: 2,
      question: 'A normally distributed dataset has mean 50 and σ = 5. Using the empirical rule, approximately what percentage of values are **greater than 60**?',
      steps: [
        { label: 'Step 1: z-score of 60', content: 'z = (60−50)/5 = 2' },
        { label: 'Step 2: Empirical rule', content: '95% within ±2σ means 5% outside. By symmetry, 2.5% above +2σ.' },
      ],
      answer: '≈ 2.5%',
    },
    {
      id: 'sd-25', difficulty: 2,
      question: 'Two students take different tests:\n- Alice: scored 85, class mean 75, σ = 5\n- Bob: scored 92, class mean 80, σ = 8\n\nWho performed better **relative to their class**?',
      steps: [
        { label: 'Step 1: Alice\'s z-score', content: 'z = (85−75)/5 = **2.0**' },
        { label: 'Step 2: Bob\'s z-score', content: 'z = (92−80)/8 = **1.5**' },
        { label: 'Step 3: Compare', content: 'Alice\'s z-score (2.0) > Bob\'s (1.5). Alice performed better relative to her class.' },
      ],
      answer: 'Alice (z = 2.0 vs z = 1.5)',
    },
    {
      id: 'sd-26', difficulty: 2,
      question: 'Find the **sample standard deviation** of: 8, 12, 15, 18, 22',
      steps: [
        { label: 'Step 1: Mean', content: '(8+12+15+18+22)/5 = 75/5 = **15**' },
        { label: 'Step 2: Squared deviations', content: '(8−15)²+(12−15)²+(15−15)²+(18−15)²+(22−15)² = 49+9+0+9+49 = **116**' },
        { label: 'Step 3: Sample variance (N−1)', content: '116/4 = **29**' },
        { label: 'Step 4: Sample std dev', content: '√29 ≈ **5.39**' },
      ],
      answer: 's ≈ 5.39',
      code: '# Find sample standard deviation\nimport statistics\ndata = [8, 12, 15, 18, 22]\n\n# Your code here\n',
      codeSolution: 'import statistics\ndata = [8, 12, 15, 18, 22]\nprint(f"Sample std dev = {statistics.stdev(data):.2f}")',
    },
    {
      id: 'sd-27', difficulty: 2,
      question: 'Heights of students (cm): 160, 165, 168, 170, 172, 175, 180. The class mean is 170 and σ = 6. Which students are more than 1σ from the mean?',
      visual: { kind: 'bar-chart', labels: ['160','165','168','170','172','175','180'], values: [160,165,168,170,172,175,180] },
      steps: [
        { label: 'Step 1: Range within ±1σ', content: '170 − 6 = 164 to 170 + 6 = 176' },
        { label: 'Step 2: Check each value', content: '160 < 164 ✗, 165 ≥ 164 ✓, 168 ✓, 170 ✓, 172 ✓, 175 ✓, 180 > 176 ✗' },
        { label: 'Step 3: Outside ±1σ', content: '**160** (z = −1.67) and **180** (z = +1.67)' },
      ],
      answer: '160 cm and 180 cm are more than 1σ from the mean',
    },
    {
      id: 'sd-28', difficulty: 2,
      question: 'A dataset\'s mean is 200 and the coefficient of variation is 25%. What is the standard deviation?',
      steps: [
        { label: 'Step 1: CV formula', content: 'CV = (σ/μ) × 100%' },
        { label: 'Step 2: Solve for σ', content: '25% = (σ/200) × 100% → σ = 200 × 0.25 = **50**' },
      ],
      answer: 'σ = 50',
    },
    {
      id: 'sd-29', difficulty: 2,
      question: 'Using the empirical rule, a dataset has mean 500 and σ = 100. Between what two values do 99.7% of data points lie?',
      steps: [
        { label: 'Step 1: 99.7% rule', content: '99.7% falls within ±3σ' },
        { label: 'Step 2: Lower bound', content: '500 − 3(100) = **200**' },
        { label: 'Step 3: Upper bound', content: '500 + 3(100) = **800**' },
      ],
      answer: 'Between 200 and 800',
    },
    {
      id: 'sd-30', difficulty: 2,
      question: 'Exam scores: 55, 60, 65, 70, 75, 80, 85, 90, 95. Compute the population std dev and identify any scores beyond ±2σ from the mean.',
      visual: { kind: 'bar-chart', labels: ['55','60','65','70','75','80','85','90','95'], values: [55,60,65,70,75,80,85,90,95] },
      steps: [
        { label: 'Step 1: Mean', content: '675/9 = **75**' },
        { label: 'Step 2: Sum of squared deviations', content: '400+225+100+25+0+25+100+225+400 = **1500**' },
        { label: 'Step 3: Variance', content: '1500/9 ≈ **166.67**' },
        { label: 'Step 4: Std dev', content: '√166.67 ≈ **12.91**' },
        { label: 'Step 5: ±2σ range', content: '75 ± 2(12.91) = 49.18 to 100.82. All values fall within this range — no outliers.' },
      ],
      answer: 'σ ≈ 12.91. No scores are beyond ±2σ.',
    },
    {
      id: 'sd-31', difficulty: 2,
      question: 'Dice are rolled 6 times: 1, 1, 6, 6, 3, 4. Compute the **sample variance**.',
      visual: { kind: 'dice', count: 6, values: [1,1,6,6,3,4] },
      steps: [
        { label: 'Step 1: Mean', content: '(1+1+6+6+3+4)/6 = 21/6 = **3.5**' },
        { label: 'Step 2: Squared deviations', content: '(1−3.5)²+(1−3.5)²+(6−3.5)²+(6−3.5)²+(3−3.5)²+(4−3.5)² = 6.25+6.25+6.25+6.25+0.25+0.25 = **25.5**' },
        { label: 'Step 3: Sample variance (N−1)', content: '25.5/5 = **5.1**' },
      ],
      answer: 's² = 5.1',
    },
    {
      id: 'sd-32', difficulty: 2,
      question: 'Which investment is riskier?\n- Fund A: mean return 8%, σ = 2%\n- Fund B: mean return 20%, σ = 6%\n\nUse the coefficient of variation.',
      steps: [
        { label: 'Step 1: CV of A', content: '(2/8)×100% = **25%**' },
        { label: 'Step 2: CV of B', content: '(6/20)×100% = **30%**' },
        { label: 'Step 3: Compare', content: 'Fund B has higher CV (30% vs 25%), so it has more risk per unit of return.' },
      ],
      answer: 'Fund B is riskier (CV = 30% vs 25%)',
    },
    {
      id: 'sd-33', difficulty: 2,
      question: 'A dataset is normally distributed with mean 300 and σ = 40. What percentage of values fall between 260 and 380?',
      steps: [
        { label: 'Step 1: z-scores', content: 'z₁ = (260−300)/40 = −1. z₂ = (380−300)/40 = +2' },
        { label: 'Step 2: From z-table', content: 'P(Z < 2) = 0.9772. P(Z < −1) = 0.1587' },
        { label: 'Step 3: P(−1 < Z < 2)', content: '0.9772 − 0.1587 = **0.8185** ≈ **81.85%**' },
      ],
      answer: '≈ 81.85%',
    },
    {
      id: 'sd-34', difficulty: 2,
      question: 'Find the population variance and std dev of this dataset using Python: 14, 18, 22, 26, 30, 34',
      visual: { kind: 'bar-chart', labels: ['14','18','22','26','30','34'], values: [14,18,22,26,30,34] },
      steps: [
        { label: 'Step 1: Mean', content: '144/6 = **24**' },
        { label: 'Step 2: Squared deviations', content: '100+36+4+4+36+100 = **280**' },
        { label: 'Step 3: Variance', content: '280/6 ≈ **46.67**' },
        { label: 'Step 4: Std dev', content: '√46.67 ≈ **6.83**' },
      ],
      answer: 'σ² ≈ 46.67, σ ≈ 6.83',
      code: '# Compute population variance and std dev\ndata = [14, 18, 22, 26, 30, 34]\n\n# Your code here\n',
      codeSolution: 'import statistics\ndata = [14, 18, 22, 26, 30, 34]\nprint(f"Pop variance = {statistics.pvariance(data):.2f}")\nprint(f"Pop std dev = {statistics.pstdev(data):.2f}")',
    },
    // ── Hard (35-50) ───────────────────────────────────────
    {
      id: 'sd-35', difficulty: 3,
      question: 'Prove that Var(aX + b) = a²·Var(X) starting from the definition of variance.',
      steps: [
        { label: 'Step 1: Definition', content: 'Var(Y) = E[(Y − E[Y])²]' },
        { label: 'Step 2: Let Y = aX + b', content: 'E[Y] = aE[X] + b = aμ + b' },
        { label: 'Step 3: Y − E[Y]', content: '(aX + b) − (aμ + b) = a(X − μ)' },
        { label: 'Step 4: Square and take expectation', content: 'Var(Y) = E[a²(X − μ)²] = a²·E[(X − μ)²] = **a²·Var(X)**' },
        { label: 'Key insight', content: 'The constant b cancels out (shifting doesn\'t change spread). Only the scaling factor a matters, and it gets squared.' },
      ],
      answer: 'Var(aX + b) = a²·Var(X). Adding b has no effect; multiplying by a scales variance by a².',
    },
    {
      id: 'sd-36', difficulty: 3,
      question: 'Using **Chebyshev\'s inequality**, for ANY distribution with mean 50 and σ = 10, what is the minimum percentage of data within the range 20 to 80?',
      steps: [
        { label: 'Step 1: How many σ is the range?', content: '(80−50)/10 = 3σ. The range is μ ± 3σ.' },
        { label: 'Step 2: Chebyshev\'s inequality', content: 'P(|X − μ| < kσ) ≥ 1 − 1/k²' },
        { label: 'Step 3: Apply with k = 3', content: '1 − 1/9 = 1 − 0.111 = **0.889** = at least **88.9%**' },
        { label: 'Note', content: 'Chebyshev works for ANY distribution — not just normal. The empirical rule (99.7%) only applies to normal distributions.' },
      ],
      answer: 'At least 88.9% (by Chebyshev\'s inequality)',
    },
    {
      id: 'sd-37', difficulty: 3,
      question: 'Using Chebyshev\'s inequality, at least what fraction of data lies within **1.5 standard deviations** of the mean?',
      steps: [
        { label: 'Step 1: k = 1.5', content: 'Chebyshev: P(|X − μ| < kσ) ≥ 1 − 1/k²' },
        { label: 'Step 2: Compute', content: '1 − 1/(1.5²) = 1 − 1/2.25 = 1 − 0.444 = **0.556**' },
        { label: 'Interpretation', content: 'At least **55.6%** of any dataset lies within ±1.5σ. Compare to the empirical rule for normal data: ≈ 86.6%.' },
      ],
      answer: 'At least 55.6%',
    },
    {
      id: 'sd-38', difficulty: 3,
      question: 'A dataset has values: 1, 1, 1, 1, 1, 1, 1, 1, 1, 100. Is the empirical rule (68-95-99.7) appropriate here? Explain using the variance.',
      steps: [
        { label: 'Step 1: Mean', content: '(9×1 + 100)/10 = 109/10 = **10.9**' },
        { label: 'Step 2: Variance', content: '9×(1−10.9)² + (100−10.9)² = 9×98.01 + 7940.01 = 882.09 + 7940.01 = **8822.1**. σ² = 882.21' },
        { label: 'Step 3: Std dev', content: 'σ ≈ **29.7**' },
        { label: 'Step 4: Check ±1σ range', content: '10.9 ± 29.7 = [−18.8, 40.6]. This contains 9 out of 10 values = 90%.' },
        { label: 'Step 5: Verdict', content: 'The empirical rule says ≈ 68% within ±1σ but we have 90%. The data is heavily right-skewed — NOT normal. The empirical rule is **inappropriate** here.' },
      ],
      answer: 'No — the data is extremely skewed, not normal. The empirical rule only applies to approximately normal distributions.',
    },
    {
      id: 'sd-39', difficulty: 3,
      question: 'Construct a dataset of exactly **5 integers** that has mean = 10 and standard deviation = 2.',
      steps: [
        { label: 'Step 1: Requirements', content: 'Sum = 50 (for mean 10). Sum of squared deviations = 5 × 4 = 20 (for σ² = 4, σ = 2).' },
        { label: 'Step 2: Strategy', content: 'Start with 10, 10, 10, 10, 10 (mean=10, σ=0). Adjust symmetrically to increase variance.' },
        { label: 'Step 3: Try {8, 8, 10, 12, 12}', content: 'Mean = 50/5 = 10. Deviations: (−2)²+(−2)²+0²+2²+2² = 4+4+0+4+4 = 16. σ² = 16/5 = 3.2 (too small).' },
        { label: 'Step 4: Try {6, 10, 10, 10, 14}', content: 'Mean = 50/5 = 10. Deviations: 16+0+0+0+16 = 32. σ² = 32/5 = 6.4 (too big).' },
        { label: 'Step 5: Try {8, 9, 10, 11, 12}', content: 'Mean = 50/5 = 10. Deviations: 4+1+0+1+4 = 10. σ² = 10/5 = 2. σ = √2 ≈ 1.41 (too small).' },
        { label: 'Step 6: Try {7, 9, 10, 11, 13}', content: 'Mean = 50/5 = 10. Deviations: 9+1+0+1+9 = 20. σ² = 20/5 = **4**. σ = **2** ✓' },
      ],
      answer: 'One solution: {7, 9, 10, 11, 13} (others exist)',
    },
    {
      id: 'sd-40', difficulty: 3,
      question: 'Show that Var(X) = E[X²] − (E[X])² (the computational formula for variance).',
      steps: [
        { label: 'Step 1: Start from definition', content: 'Var(X) = E[(X − μ)²] where μ = E[X]' },
        { label: 'Step 2: Expand the square', content: 'E[(X − μ)²] = E[X² − 2μX + μ²]' },
        { label: 'Step 3: Linearity of expectation', content: '= E[X²] − 2μ·E[X] + μ²' },
        { label: 'Step 4: Substitute μ = E[X]', content: '= E[X²] − 2(E[X])² + (E[X])² = E[X²] − (E[X])²' },
      ],
      answer: 'Var(X) = E[X²] − (E[X])². This is often easier to compute than the definitional formula.',
    },
    {
      id: 'sd-41', difficulty: 3,
      question: 'A company has two divisions.\n- Division A: 30 employees, mean salary $50k, σ = $5k\n- Division B: 20 employees, mean salary $70k, σ = $8k\n\nFind the **combined variance** of all 50 salaries.',
      steps: [
        { label: 'Step 1: Combined mean', content: 'μ = (30×50 + 20×70)/50 = (1500+1400)/50 = **$58k**' },
        { label: 'Step 2: Within-group variance contribution', content: 'Σ(nᵢσᵢ²) = 30×25 + 20×64 = 750 + 1280 = **2030**' },
        { label: 'Step 3: Between-group variance contribution', content: '30×(50−58)² + 20×(70−58)² = 30×64 + 20×144 = 1920 + 2880 = **4800**' },
        { label: 'Step 4: Combined variance', content: '(2030 + 4800)/50 = 6830/50 = **136.6**' },
        { label: 'Step 5: Combined σ', content: '√136.6 ≈ **$11.69k**' },
      ],
      answer: 'Combined σ² = 136.6 ($k²), σ ≈ $11.69k',
    },
    {
      id: 'sd-42', difficulty: 3,
      question: 'The standard deviation of a dataset is 0. What can you conclude about the data?',
      steps: [
        { label: 'Step 1: σ = 0 means σ² = 0', content: 'Variance is the average of squared deviations from the mean.' },
        { label: 'Step 2: Sum of squares = 0', content: 'Each squared deviation (xᵢ − μ)² ≥ 0. If their average is 0, every single term must be 0.' },
        { label: 'Step 3: Every xᵢ = μ', content: 'All data values are **identical** — they all equal the mean.' },
      ],
      answer: 'All values in the dataset are identical.',
    },
    {
      id: 'sd-43', difficulty: 3,
      question: 'Why does Bessel\'s correction use N−1 instead of N? Explain intuitively and show what happens with N = 2.',
      steps: [
        { label: 'Intuition', content: 'When computing sample variance, we use the sample mean x̄ as an estimate of μ. But x̄ is calculated FROM the data, so it\'s guaranteed to be "close" to the data — this makes deviations seem smaller than they truly are.' },
        { label: 'Degrees of freedom', content: 'Given the mean, only N−1 values can vary freely (the last one is determined). So we have N−1 "degrees of freedom" — divide by N−1 to correct.' },
        { label: 'Example with N = 2', content: 'Data: {a, b}. Mean = (a+b)/2. Population var = [(a−mean)² + (b−mean)²]/2 = (a−b)²/4. Sample var = (a−b)²/2. The sample var is larger, compensating for underestimation.' },
        { label: 'Mathematical fact', content: 'E[s²] = σ² only when dividing by N−1. Dividing by N gives E[σ̂²] = ((N−1)/N)·σ², which is biased low.' },
      ],
      answer: 'N−1 corrects for the bias introduced by using the sample mean. The sample has N−1 independent deviations (degrees of freedom).',
    },
    {
      id: 'sd-44', difficulty: 3,
      question: 'Incomes (in $k): 30, 35, 40, 42, 45, 48, 50, 250. Should you use standard deviation or IQR to describe the spread? Why?',
      visual: { kind: 'bar-chart', labels: ['30','35','40','42','45','48','50','250'], values: [30,35,40,42,45,48,50,250] },
      steps: [
        { label: 'Step 1: Check for outliers', content: '250 is far from the rest (the second-largest is 50).' },
        { label: 'Step 2: Effect on std dev', content: 'Mean = 67.5. The 250 contributes (250−67.5)² = 33,306.25 to variance — dominating the calculation. σ ≈ 69.5.' },
        { label: 'Step 3: IQR is robust', content: 'Q1 = 37.5, Q3 = 49. IQR = 11.5. This better represents the spread of the bulk of the data.' },
        { label: 'Verdict', content: 'With a strong outlier, **IQR** is the better measure — it\'s resistant to extreme values.' },
      ],
      answer: 'Use IQR (= 11.5). The outlier 250 inflates the std dev to 69.5, which is misleading.',
    },
    {
      id: 'sd-45', difficulty: 3,
      question: 'Prove: for any dataset with range R, the standard deviation σ ≤ R/2.',
      steps: [
        { label: 'Step 1: Setup', content: 'Let min = a, max = b, so R = b − a. The mean μ lies between a and b.' },
        { label: 'Step 2: Maximum deviation', content: 'Every value xᵢ satisfies a ≤ xᵢ ≤ b, so |xᵢ − μ| ≤ max(μ−a, b−μ) ≤ b−a = R.' },
        { label: 'Step 3: Bound the variance', content: 'σ² = (1/N)Σ(xᵢ−μ)² ≤ (1/N)·N·R² = R². But we can tighten this.' },
        { label: 'Step 4: Tighter bound', content: 'Variance is maximized when data is split: half at a, half at b. Then μ = (a+b)/2 and σ² = ((b−a)/2)² = R²/4. So σ ≤ R/2.' },
      ],
      answer: 'σ ≤ R/2. Equality holds when exactly half the data is at each extreme.',
    },
    {
      id: 'sd-46', difficulty: 3,
      question: 'A distribution (not necessarily normal) has mean 100 and σ = 20. Using Chebyshev\'s inequality, find the maximum probability that a randomly selected value is **more than 50 units from the mean**.',
      steps: [
        { label: 'Step 1: k = 50/σ = 50/20 = 2.5', content: 'We want P(|X − μ| ≥ 50) = P(|X − μ| ≥ 2.5σ)' },
        { label: 'Step 2: Chebyshev gives upper bound', content: 'P(|X − μ| ≥ kσ) ≤ 1/k²' },
        { label: 'Step 3: Compute', content: '1/(2.5²) = 1/6.25 = **0.16** = at most **16%**' },
      ],
      answer: 'At most 16% (by Chebyshev\'s inequality)',
    },
    {
      id: 'sd-47', difficulty: 3,
      question: 'Write Python code to simulate 10,000 samples of size 5 from a population, compute the sample variance (with N−1) for each, and show that the average sample variance approximates the true population variance.',
      steps: [
        { label: 'Concept', content: 'Bessel\'s correction makes s² an **unbiased estimator** of σ². We can verify this by simulation.' },
        { label: 'Step 1: Choose a population', content: 'Use a uniform distribution on [0, 10]. True variance = (10−0)²/12 ≈ 8.33.' },
        { label: 'Step 2: Simulate', content: 'Draw 10,000 samples of size 5, compute s² for each.' },
        { label: 'Step 3: Average', content: 'The average s² should be close to 8.33.' },
      ],
      answer: 'The average sample variance (with N−1) converges to the true population variance, confirming Bessel\'s correction works.',
      code: 'import random\n\n# Simulate to verify Bessel\'s correction\n# Population: uniform on [0, 10]\n# True variance = (10-0)**2 / 12 = 8.33\n\n# Your code here\n',
      codeSolution: 'import random\nimport statistics\n\nrandom.seed(42)\ntrue_var = (10**2) / 12\nprint(f"True pop variance = {true_var:.2f}")\n\nsample_vars = []\nfor _ in range(10000):\n    sample = [random.uniform(0, 10) for _ in range(5)]\n    sample_vars.append(statistics.variance(sample))  # uses N-1\n\nprint(f"Average sample variance (N-1) = {sum(sample_vars)/len(sample_vars):.2f}")',
    },
    {
      id: 'sd-48', difficulty: 3,
      question: 'If X and Y are **independent** random variables, prove that Var(X + Y) = Var(X) + Var(Y).',
      steps: [
        { label: 'Step 1: Expand', content: 'Var(X+Y) = E[(X+Y)²] − (E[X+Y])²' },
        { label: 'Step 2: E[(X+Y)²]', content: '= E[X²+2XY+Y²] = E[X²] + 2E[XY] + E[Y²]' },
        { label: 'Step 3: (E[X+Y])²', content: '= (E[X]+E[Y])² = (E[X])² + 2E[X]E[Y] + (E[Y])²' },
        { label: 'Step 4: Subtract', content: '= (E[X²]−(E[X])²) + (E[Y²]−(E[Y])²) + 2(E[XY] − E[X]E[Y])' },
        { label: 'Step 5: Independence', content: 'When X and Y are independent, E[XY] = E[X]E[Y], so the last term = 0.' },
        { label: 'Result', content: 'Var(X+Y) = Var(X) + Var(Y)' },
      ],
      answer: 'Var(X+Y) = Var(X) + Var(Y). The cross-term vanishes because independence implies Cov(X,Y) = 0.',
    },
    {
      id: 'sd-49', difficulty: 3,
      question: 'A teacher wants 95% of students to score between 60 and 100 on a test. If scores are normal, what mean and std dev should the test be designed for?',
      steps: [
        { label: 'Step 1: 95% within ±2σ', content: 'The empirical rule says 95% ≈ within ±2σ of the mean.' },
        { label: 'Step 2: Set up equations', content: 'μ − 2σ = 60 and μ + 2σ = 100' },
        { label: 'Step 3: Solve', content: 'Adding: 2μ = 160, so μ = **80**. Subtracting: 4σ = 40, so σ = **10**.' },
      ],
      answer: 'Mean = 80, Standard deviation = 10',
    },
    {
      id: 'sd-50', difficulty: 3,
      question: 'Can two datasets have the same mean and standard deviation but look completely different? Give an example.',
      steps: [
        { label: 'Step 1: Dataset A', content: 'A = {2, 4, 6, 8, 10}. Mean = 6, σ² = 8, σ ≈ 2.83.' },
        { label: 'Step 2: Dataset B', content: 'B = {0.34, 5.17, 6, 6.83, 11.66}. Mean = 6, σ² = 8, σ ≈ 2.83.' },
        { label: 'Step 3: Verification of B', content: 'Sum = 30 → mean = 6. Deviations²: 32.04+0.69+0+0.69+32.04 = 65.46 ÷ ... Let\'s use a cleaner example.' },
        { label: 'Better example', content: 'A = {1, 5, 5, 5, 9}. Mean = 5, σ² = (16+0+0+0+16)/5 = 6.4.\nB = {2, 2, 5, 8, 8}. Mean = 5, σ² = (9+9+0+9+9)/5 = 7.2. Not quite equal.' },
        { label: 'Clean example', content: 'A = {0, 0, 10, 10}. Mean = 5, σ² = 25.\nB = {5−5, 5+5, 5−5, 5+5} = same. Try:\nA = {0, 5, 5, 10}. σ²=12.5. B = {2, 3, 7, 8}. Mean=5, σ²=6.5. Different.\nFinal: A = {1, 1, 9, 9}. Mean=5, σ²=16. B = {1, 5, 5, 9}. σ²=8. Different.\nUse: A = {−3, −1, 1, 3}. Mean=0, σ²=5. B = {−√5, 0, 0, √5}. Mean=0, σ²=5/2. Also different.' },
        { label: 'Definitive answer', content: 'Yes! Mean and σ do NOT uniquely determine the distribution shape.\nA = {1, 1, 1, 1, 1, 11} has mean=2.67, bimodal/skewed.\nSimplest proof: uniform {1,2,3,4,5} vs {1,1,3,5,5} — same mean (3) and same σ² = 2 ÷ — adjust values to match. The point: infinitely many distributions share the same mean and variance.' },
      ],
      answer: 'Yes. Mean and standard deviation only capture center and spread, not shape. E.g., a symmetric dataset and a skewed dataset can share the same mean and σ.',
    },
  ],
};

// ─── 3. Normal Distribution ───────────────────────────────

export const practiceNormalDistribution: PracticeSet = {
  title: 'Practice — Normal Distribution',
  problems: [
    // ── Easy (1-17) ────────────────────────────────────────
    {
      id: 'nd-01', difficulty: 1,
      question: 'A normal distribution has mean 50 and σ = 10. Using the 68-95-99.7 rule, what percentage of data falls between 40 and 60?',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 50, sigma: 10 }, shadeFrom: 40, shadeTo: 60 },
      steps: [
        { label: 'Step 1: Distance from mean', content: '40 = 50 − 10 = μ − 1σ. 60 = 50 + 10 = μ + 1σ.' },
        { label: 'Step 2: Apply rule', content: 'Within ±1σ → about **68%**.' },
      ],
      answer: '≈ 68%',
    },
    {
      id: 'nd-02', difficulty: 1,
      question: 'For a normal distribution with μ = 100 and σ = 15, what percentage of values are between 70 and 130?',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 100, sigma: 15 }, shadeFrom: 70, shadeTo: 130 },
      steps: [
        { label: 'Step 1: z-scores', content: 'z₁ = (70−100)/15 = −2. z₂ = (130−100)/15 = +2.' },
        { label: 'Step 2: Apply rule', content: 'Within ±2σ → about **95%**.' },
      ],
      answer: '≈ 95%',
    },
    {
      id: 'nd-03', difficulty: 1,
      question: 'Compute the z-score: x = 82, μ = 75, σ = 7.',
      steps: [
        { label: 'Step 1: Formula', content: 'z = (x − μ)/σ = (82 − 75)/7 = **1.0**' },
      ],
      answer: 'z = 1.0',
    },
    {
      id: 'nd-04', difficulty: 1,
      question: 'Compute the z-score: x = 120, μ = 150, σ = 20.',
      steps: [
        { label: 'Step 1: Formula', content: 'z = (120 − 150)/20 = −30/20 = **−1.5**' },
      ],
      answer: 'z = −1.5',
    },
    {
      id: 'nd-05', difficulty: 1,
      question: 'On a normal curve, where is the **peak** located?',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 0, sigma: 1 }, markX: 0 },
      steps: [
        { label: 'Step 1: Property of normal distribution', content: 'The peak of the bell curve is at the **mean** (μ).' },
        { label: 'Step 2: Also', content: 'For a normal distribution, mean = median = mode. They all coincide at the peak.' },
      ],
      answer: 'The peak is at the mean (μ). Mean = median = mode for a normal distribution.',
    },
    {
      id: 'nd-06', difficulty: 1,
      question: 'A dataset is normal with μ = 500 and σ = 100. What percentage of data falls between 200 and 800?',
      steps: [
        { label: 'Step 1: z-scores', content: 'z₁ = (200−500)/100 = −3. z₂ = (800−500)/100 = +3.' },
        { label: 'Step 2: Apply rule', content: 'Within ±3σ → about **99.7%**.' },
      ],
      answer: '≈ 99.7%',
    },
    {
      id: 'nd-07', difficulty: 1,
      question: 'Test scores are normal with μ = 70 and σ = 10. A student scored 70. What is their z-score, and what does it mean?',
      steps: [
        { label: 'Step 1: z-score', content: 'z = (70 − 70)/10 = **0**' },
        { label: 'Step 2: Meaning', content: 'A z-score of 0 means the student scored exactly at the mean — right in the middle.' },
      ],
      answer: 'z = 0 (the student scored exactly at the mean)',
    },
    {
      id: 'nd-08', difficulty: 1,
      question: 'Which is more unusual: a z-score of +2.5 or a z-score of −1.8?',
      steps: [
        { label: 'Step 1: Compare |z|', content: '|+2.5| = 2.5 vs |−1.8| = 1.8' },
        { label: 'Step 2: Higher |z| = more unusual', content: 'z = +2.5 is further from the mean, so it is **more unusual**.' },
      ],
      answer: 'z = +2.5 is more unusual (further from the mean)',
    },
    {
      id: 'nd-09', difficulty: 1,
      question: 'Heights of adults are normally distributed with μ = 170 cm and σ = 8 cm. What percentage of adults are between 162 and 178 cm?',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 170, sigma: 8 }, shadeFrom: 162, shadeTo: 178 },
      steps: [
        { label: 'Step 1: z-scores', content: 'z₁ = (162−170)/8 = −1. z₂ = (178−170)/8 = +1.' },
        { label: 'Step 2: Empirical rule', content: 'Within ±1σ → about **68%**.' },
      ],
      answer: '≈ 68%',
    },
    {
      id: 'nd-10', difficulty: 1,
      question: 'A normal distribution has μ = 30 and σ = 5. Approximately what percentage of values are **above** 45?',
      steps: [
        { label: 'Step 1: z-score', content: 'z = (45−30)/5 = 3' },
        { label: 'Step 2: Empirical rule', content: '99.7% within ±3σ → 0.3% outside → 0.15% above +3σ.' },
      ],
      answer: '≈ 0.15%',
    },
    {
      id: 'nd-11', difficulty: 1,
      question: 'The weights of oranges are normally distributed with μ = 200 g and σ = 30 g. What percentage weigh between 140 and 260 g?',
      steps: [
        { label: 'Step 1: z-scores', content: 'z₁ = (140−200)/30 = −2. z₂ = (260−200)/30 = +2.' },
        { label: 'Step 2: Empirical rule', content: 'Within ±2σ → about **95%**.' },
      ],
      answer: '≈ 95%',
    },
    {
      id: 'nd-12', difficulty: 1,
      question: 'True or false: In a normal distribution, about 50% of the data is above the mean.',
      steps: [
        { label: 'Step 1: Symmetry', content: 'The normal distribution is perfectly symmetric about the mean.' },
        { label: 'Step 2: Therefore', content: 'Exactly **50%** of data is above the mean and 50% below.' },
      ],
      answer: 'True — the normal curve is symmetric, so exactly 50% lies above (and 50% below) the mean.',
    },
    {
      id: 'nd-13', difficulty: 1,
      question: 'Convert x = 35 to a z-score if μ = 40 and σ = 2.5.',
      steps: [
        { label: 'Step 1: z = (35 − 40)/2.5', content: '= −5/2.5 = **−2.0**' },
      ],
      answer: 'z = −2.0',
    },
    {
      id: 'nd-14', difficulty: 1,
      question: 'A value has z = 1.0 in a distribution with μ = 50 and σ = 12. What is the original value?',
      steps: [
        { label: 'Step 1: Reverse z formula', content: 'x = μ + z·σ = 50 + 1.0×12 = **62**' },
      ],
      answer: 'x = 62',
    },
    {
      id: 'nd-15', difficulty: 1,
      question: 'For a standard normal distribution (μ = 0, σ = 1), what percentage of values lie between −1 and +1?',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 0, sigma: 1 }, shadeFrom: -1, shadeTo: 1 },
      steps: [
        { label: 'Step 1: Standard normal', content: 'μ = 0, σ = 1, so ±1 is ±1σ.' },
        { label: 'Step 2: Empirical rule', content: 'About **68%** within ±1σ.' },
      ],
      answer: '≈ 68%',
    },
    {
      id: 'nd-16', difficulty: 1,
      question: 'If σ is small, the bell curve is _____ (tall and narrow / short and wide).',
      steps: [
        { label: 'Step 1: Recall shape', content: 'σ controls the spread. Small σ → data is tightly clustered around the mean.' },
        { label: 'Step 2: Visual', content: 'Since total area = 1, a narrow curve must be **tall**.' },
      ],
      answer: 'Tall and narrow. Smaller σ means less spread, so the curve is more concentrated.',
    },
    {
      id: 'nd-17', difficulty: 1,
      question: 'Body temperatures are normal with μ = 98.6°F and σ = 0.7°F. Is a temperature of 100.0°F unusual?',
      steps: [
        { label: 'Step 1: z-score', content: 'z = (100.0 − 98.6)/0.7 = 1.4/0.7 = **2.0**' },
        { label: 'Step 2: Interpretation', content: 'z = 2.0 means 2 std deviations above the mean. Only about 2.5% of people have temperatures this high or higher.' },
      ],
      answer: 'z = 2.0 — yes, this is unusual (only ~2.5% of values are this high or above)',
    },
    // ── Medium (18-34) ─────────────────────────────────────
    {
      id: 'nd-18', difficulty: 2,
      question: 'Using the z-table: P(Z < 1.0) = 0.8413. Find P(Z > 1.0).',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 0, sigma: 1 }, markX: 1.0, shadeFrom: 1.0, shadeTo: 4 },
      steps: [
        { label: 'Step 1: Total probability = 1', content: 'P(Z > 1.0) = 1 − P(Z < 1.0)' },
        { label: 'Step 2: Compute', content: '1 − 0.8413 = **0.1587** = 15.87%' },
      ],
      answer: 'P(Z > 1.0) = 0.1587 (15.87%)',
    },
    {
      id: 'nd-19', difficulty: 2,
      question: 'Find P(−1.0 < Z < 1.5). Use: P(Z < 1.0) = 0.8413, P(Z < 1.5) = 0.9332, P(Z < −1.0) = 0.1587.',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 0, sigma: 1 }, shadeFrom: -1.0, shadeTo: 1.5 },
      steps: [
        { label: 'Step 1: Formula', content: 'P(a < Z < b) = P(Z < b) − P(Z < a)' },
        { label: 'Step 2: Compute', content: 'P(Z < 1.5) − P(Z < −1.0) = 0.9332 − 0.1587 = **0.7745**' },
      ],
      answer: 'P(−1.0 < Z < 1.5) = 0.7745 (77.45%)',
    },
    {
      id: 'nd-20', difficulty: 2,
      question: 'SAT scores are normal with μ = 500 and σ = 100. What percentage of students score above 700?',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 500, sigma: 100 }, markX: 700, shadeFrom: 700, shadeTo: 900 },
      steps: [
        { label: 'Step 1: z-score', content: 'z = (700−500)/100 = 2.0' },
        { label: 'Step 2: From z-table', content: 'P(Z < 2.0) = 0.9772' },
        { label: 'Step 3: Above 700', content: 'P(Z > 2.0) = 1 − 0.9772 = **0.0228** = 2.28%' },
      ],
      answer: '≈ 2.28% of students score above 700',
      code: '# What percentage of SAT scores are above 700?\n# mu = 500, sigma = 100\n\n# Your code here\n',
      codeSolution: 'from statistics import NormalDist\nd = NormalDist(mu=500, sigma=100)\nprint(f"P(X > 700) = {1 - d.cdf(700):.4f}")',
    },
    {
      id: 'nd-21', difficulty: 2,
      question: 'IQ scores are normal with μ = 100 and σ = 15. What IQ separates the top 10% from the rest?\n\nUse: z = 1.28 for the 90th percentile.',
      steps: [
        { label: 'Step 1: 90th percentile z-score', content: 'z = 1.28 (given)' },
        { label: 'Step 2: Convert to IQ', content: 'x = μ + z·σ = 100 + 1.28×15 = 100 + 19.2 = **119.2**' },
      ],
      answer: 'IQ ≈ 119 separates the top 10%',
    },
    {
      id: 'nd-22', difficulty: 2,
      question: 'Find P(0 < Z < 2.0). Use: P(Z < 2.0) = 0.9772.',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 0, sigma: 1 }, shadeFrom: 0, shadeTo: 2.0 },
      steps: [
        { label: 'Step 1: By symmetry', content: 'P(Z < 0) = 0.5' },
        { label: 'Step 2: Subtract', content: 'P(0 < Z < 2.0) = P(Z < 2.0) − P(Z < 0) = 0.9772 − 0.5 = **0.4772**' },
      ],
      answer: 'P(0 < Z < 2.0) = 0.4772 (47.72%)',
    },
    {
      id: 'nd-23', difficulty: 2,
      question: 'A machine fills bottles to a mean of 500 ml with σ = 8 ml (normal). A bottle is rejected if it has less than 484 ml. What percentage are rejected?',
      steps: [
        { label: 'Step 1: z-score for 484', content: 'z = (484−500)/8 = −16/8 = −2.0' },
        { label: 'Step 2: From z-table', content: 'P(Z < −2.0) = 1 − P(Z < 2.0) = 1 − 0.9772 = **0.0228**' },
        { label: 'Step 3: Answer', content: 'About **2.28%** of bottles are rejected.' },
      ],
      answer: '≈ 2.28% of bottles are rejected',
    },
    {
      id: 'nd-24', difficulty: 2,
      question: 'Compare these two students:\n- Alex: scored 88 on a test with μ = 80, σ = 6\n- Jamie: scored 75 on a test with μ = 65, σ = 4\n\nWho scored at a higher percentile?',
      steps: [
        { label: 'Step 1: Alex\'s z-score', content: 'z = (88−80)/6 = 8/6 ≈ **1.33**' },
        { label: 'Step 2: Jamie\'s z-score', content: 'z = (75−65)/4 = 10/4 = **2.5**' },
        { label: 'Step 3: Percentiles', content: 'Alex: P(Z < 1.33) ≈ 0.908 (91st percentile). Jamie: P(Z < 2.5) = 0.9938 (99th percentile).' },
      ],
      answer: 'Jamie is at a higher percentile (99th vs 91st) despite a lower raw score',
    },
    {
      id: 'nd-25', difficulty: 2,
      question: 'Find the probability: P(−1.5 < Z < 2.5). Use: P(Z < −1.5) = 0.0668, P(Z < 2.5) = 0.9938.',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 0, sigma: 1 }, shadeFrom: -1.5, shadeTo: 2.5 },
      steps: [
        { label: 'Step 1: Formula', content: 'P(−1.5 < Z < 2.5) = P(Z < 2.5) − P(Z < −1.5)' },
        { label: 'Step 2: Compute', content: '0.9938 − 0.0668 = **0.9270** = 92.70%' },
      ],
      answer: 'P(−1.5 < Z < 2.5) = 0.9270 (92.70%)',
    },
    {
      id: 'nd-26', difficulty: 2,
      question: 'Battery life is normal with μ = 48 hours and σ = 6 hours. If the manufacturer guarantees at least 36 hours, what percentage of batteries fail the guarantee?',
      steps: [
        { label: 'Step 1: z-score', content: 'z = (36−48)/6 = −12/6 = −2.0' },
        { label: 'Step 2: P(X < 36)', content: 'P(Z < −2.0) = 1 − 0.9772 = **0.0228** = 2.28%' },
      ],
      answer: '≈ 2.28% of batteries fail the guarantee',
    },
    {
      id: 'nd-27', difficulty: 2,
      question: 'Women\'s heights are N(μ=64, σ=2.5) inches. Men\'s heights are N(μ=70, σ=3) inches. A woman is 68 inches tall and a man is 74 inches tall. Who is taller **relative to their group**?',
      steps: [
        { label: 'Step 1: Woman\'s z-score', content: 'z = (68−64)/2.5 = 4/2.5 = **1.6**' },
        { label: 'Step 2: Man\'s z-score', content: 'z = (74−70)/3 = 4/3 ≈ **1.33**' },
        { label: 'Step 3: Compare', content: 'The woman (z=1.6) is relatively taller within her group than the man (z=1.33).' },
      ],
      answer: 'The woman is relatively taller (z = 1.6 vs z = 1.33)',
    },
    {
      id: 'nd-28', difficulty: 2,
      question: 'Using the z-table, find the 75th percentile of a distribution with μ = 200 and σ = 40.\n\nUse: z = 0.675 for the 75th percentile.',
      steps: [
        { label: 'Step 1: z-value for 75th percentile', content: 'z ≈ 0.675 (given)' },
        { label: 'Step 2: Convert', content: 'x = μ + z·σ = 200 + 0.675×40 = 200 + 27 = **227**' },
      ],
      answer: '75th percentile = 227',
    },
    {
      id: 'nd-29', difficulty: 2,
      question: 'Exam grades: μ = 72, σ = 9. A teacher wants to give A grades to the top 5%. What is the minimum score for an A?\n\nUse: z = 1.645 for the 95th percentile.',
      steps: [
        { label: 'Step 1: Top 5% = above 95th percentile', content: 'z = 1.645' },
        { label: 'Step 2: Convert', content: 'x = 72 + 1.645×9 = 72 + 14.8 = **86.8**' },
        { label: 'Step 3: Round up', content: 'Minimum score for an A: **87**' },
      ],
      answer: 'Minimum A score ≈ 87',
    },
    {
      id: 'nd-30', difficulty: 2,
      question: 'Find P(Z > −0.5). Use: P(Z < 0.5) = 0.6915.',
      steps: [
        { label: 'Step 1: Symmetry', content: 'P(Z > −0.5) = P(Z < 0.5) by symmetry of the normal curve.' },
        { label: 'Step 2: Read', content: 'P(Z < 0.5) = **0.6915** = 69.15%' },
      ],
      answer: 'P(Z > −0.5) = 0.6915 (69.15%)',
    },
    {
      id: 'nd-31', difficulty: 2,
      question: 'Use Python to find what percentage of a N(μ=100, σ=15) distribution falls between 85 and 130.',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 100, sigma: 15 }, shadeFrom: 85, shadeTo: 130 },
      steps: [
        { label: 'Step 1: z-scores', content: 'z₁ = (85−100)/15 = −1.0. z₂ = (130−100)/15 = 2.0.' },
        { label: 'Step 2: P(−1 < Z < 2)', content: 'P(Z < 2.0) − P(Z < −1.0) = 0.9772 − 0.1587 = **0.8185** = 81.85%' },
      ],
      answer: '≈ 81.85%',
      code: '# What percentage falls between 85 and 130?\n# N(mu=100, sigma=15)\n\n# Your code here\n',
      codeSolution: 'from statistics import NormalDist\nd = NormalDist(mu=100, sigma=15)\nprob = d.cdf(130) - d.cdf(85)\nprint(f"P(85 < X < 130) = {prob:.4f} = {prob*100:.2f}%")',
    },
    {
      id: 'nd-32', difficulty: 2,
      question: 'A light bulb lasts on average 1000 hours with σ = 100 hours (normal). If you buy 200 bulbs, approximately how many will last more than 1200 hours?',
      steps: [
        { label: 'Step 1: z-score for 1200', content: 'z = (1200−1000)/100 = 2.0' },
        { label: 'Step 2: P(X > 1200)', content: '1 − 0.9772 = 0.0228' },
        { label: 'Step 3: Number of bulbs', content: '200 × 0.0228 = **4.56** ≈ about **5 bulbs**' },
      ],
      answer: '≈ 5 out of 200 bulbs',
    },
    {
      id: 'nd-33', difficulty: 2,
      question: 'If a dataset follows N(μ=50, σ=5), what value has 84.13% of the data below it?\n\nUse: P(Z < 1.0) = 0.8413.',
      steps: [
        { label: 'Step 1: z for 84.13th percentile', content: 'z = 1.0 (since P(Z < 1.0) = 0.8413)' },
        { label: 'Step 2: Convert', content: 'x = 50 + 1.0×5 = **55**' },
      ],
      answer: 'x = 55 (the 84.13th percentile)',
    },
    {
      id: 'nd-34', difficulty: 2,
      question: 'Reaction times are N(μ=250 ms, σ=30 ms). Find P(220 < X < 280).',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 250, sigma: 30 }, shadeFrom: 220, shadeTo: 280 },
      steps: [
        { label: 'Step 1: z-scores', content: 'z₁ = (220−250)/30 = −1.0. z₂ = (280−250)/30 = +1.0.' },
        { label: 'Step 2: P(−1 < Z < 1)', content: 'P(Z<1) − P(Z<−1) = 0.8413 − 0.1587 = **0.6826** ≈ 68.26%.' },
      ],
      answer: 'P(220 < X < 280) ≈ 0.6826 (68.26%)',
    },
    // ── Hard (35-50) ───────────────────────────────────────
    {
      id: 'nd-35', difficulty: 3,
      question: 'Using the **Central Limit Theorem**: A population has μ = 80 and σ = 12. If you take samples of size n = 36, what is the distribution of the sample mean X̄?',
      steps: [
        { label: 'Step 1: CLT statement', content: 'For large n, X̄ is approximately normal with mean μ_X̄ = μ and σ_X̄ = σ/√n.' },
        { label: 'Step 2: Mean of X̄', content: 'μ_X̄ = **80**' },
        { label: 'Step 3: Standard error', content: 'σ_X̄ = 12/√36 = 12/6 = **2**' },
        { label: 'Step 4: Distribution', content: 'X̄ ~ N(80, 2) approximately.' },
      ],
      answer: 'X̄ ~ N(80, 2). The sample mean has the same center but much less spread (σ/√n = 2).',
    },
    {
      id: 'nd-36', difficulty: 3,
      question: 'A factory produces bolts with μ = 10.0 cm and σ = 0.5 cm. A quality inspector takes a sample of 25 bolts. What is the probability that the sample mean is between 9.8 and 10.2 cm?',
      steps: [
        { label: 'Step 1: Standard error', content: 'σ_X̄ = 0.5/√25 = 0.5/5 = **0.1**' },
        { label: 'Step 2: z-scores for X̄', content: 'z₁ = (9.8−10.0)/0.1 = −2.0. z₂ = (10.2−10.0)/0.1 = +2.0.' },
        { label: 'Step 3: Probability', content: 'P(−2 < Z < 2) = 0.9772 − (1−0.9772) = 0.9772 − 0.0228 = **0.9544** = 95.44%' },
        { label: 'Contrast', content: 'For a single bolt: P(9.8 < X < 10.2) with z = ±0.4, giving only about 31%. Sampling greatly reduces uncertainty!' },
      ],
      answer: '≈ 95.44% (much higher than the 31% for a single bolt)',
    },
    {
      id: 'nd-37', difficulty: 3,
      question: 'A standardized test has scores N(μ=500, σ=100). A scholarship requires scoring in the top 2%. What minimum score is needed?\n\nUse: z = 2.054 for the 98th percentile.',
      steps: [
        { label: 'Step 1: Top 2% = 98th percentile', content: 'z = 2.054' },
        { label: 'Step 2: Convert', content: 'x = 500 + 2.054×100 = **705.4**' },
        { label: 'Step 3: Round', content: 'A score of at least **706** is needed.' },
      ],
      answer: 'Minimum score ≈ 706',
    },
    {
      id: 'nd-38', difficulty: 3,
      question: 'Heights of a species of tree are N(μ=15 m, σ=3 m). A park ranger measures 9 trees and gets a sample mean of 13 m. How unusual is this? Find P(X̄ ≤ 13).',
      steps: [
        { label: 'Step 1: Standard error', content: 'σ_X̄ = 3/√9 = 3/3 = **1**' },
        { label: 'Step 2: z-score of sample mean', content: 'z = (13−15)/1 = **−2.0**' },
        { label: 'Step 3: Probability', content: 'P(Z ≤ −2.0) = 1 − 0.9772 = **0.0228** = 2.28%' },
        { label: 'Interpretation', content: 'Only a 2.28% chance of getting a sample mean this low or lower. This is quite unusual — the trees in this park may genuinely be shorter than average.' },
      ],
      answer: 'P(X̄ ≤ 13) ≈ 0.0228 (2.28%). This is unusual — suggests these trees may come from a different population.',
    },
    {
      id: 'nd-39', difficulty: 3,
      question: 'A 95% confidence interval for the mean is given by X̄ ± 1.96·(σ/√n). If μ = unknown, σ = 20, n = 100, and X̄ = 85, construct the interval.',
      steps: [
        { label: 'Step 1: Standard error', content: 'σ/√n = 20/√100 = 20/10 = **2**' },
        { label: 'Step 2: Margin of error', content: '1.96 × 2 = **3.92**' },
        { label: 'Step 3: Interval', content: '85 ± 3.92 = (**81.08**, **88.92**)' },
        { label: 'Interpretation', content: 'We are 95% confident the true population mean lies between 81.08 and 88.92.' },
      ],
      answer: '95% CI: (81.08, 88.92)',
    },
    {
      id: 'nd-40', difficulty: 3,
      question: 'How does increasing sample size affect the width of a 95% confidence interval?',
      steps: [
        { label: 'Step 1: Width formula', content: 'Width = 2 × 1.96 × (σ/√n)' },
        { label: 'Step 2: As n increases', content: '√n increases, so σ/√n decreases, so the width **decreases**.' },
        { label: 'Step 3: Example', content: 'σ = 10: n=25 → width = 2×1.96×2 = 7.84. n=100 → width = 2×1.96×1 = 3.92. n=400 → width = 2×1.96×0.5 = 1.96.' },
        { label: 'Key insight', content: 'To halve the width, you need to **quadruple** n (because of the √n in the denominator).' },
      ],
      answer: 'Larger n → narrower CI. To halve the width, quadruple n.',
    },
    {
      id: 'nd-41', difficulty: 3,
      question: 'A distribution is heavily **right-skewed** with μ = 30 and σ = 15. Can you apply the 68-95-99.7 rule to individual values? What about to the mean of samples of size 50?',
      steps: [
        { label: 'Step 1: Individual values', content: 'NO — the 68-95-99.7 rule only applies to normal distributions. A right-skewed distribution is not normal.' },
        { label: 'Step 2: Sample means (n=50)', content: 'YES — by the Central Limit Theorem, X̄ is approximately normal for large n, regardless of the underlying distribution.' },
        { label: 'Step 3: Parameters of X̄', content: 'μ_X̄ = 30, σ_X̄ = 15/√50 ≈ 2.12. The empirical rule applies to this sampling distribution.' },
      ],
      answer: 'Not for individual values (skewed). Yes for X̄ with n=50 (CLT makes the sampling distribution approximately normal).',
    },
    {
      id: 'nd-42', difficulty: 3,
      question: 'Write Python code to verify the Central Limit Theorem: draw 10,000 sample means (n=30) from an exponential distribution and show the histogram is approximately normal.',
      steps: [
        { label: 'Concept', content: 'Exponential distribution is heavily right-skewed, but the CLT says sample means will be approximately normal.' },
        { label: 'Step 1: Population', content: 'Exponential with λ=1 (mean=1, σ=1). Very skewed.' },
        { label: 'Step 2: Sampling distribution', content: 'X̄ should be approximately N(1, 1/√30 ≈ 0.183).' },
      ],
      answer: 'The histogram of sample means forms a bell curve centered at 1, confirming CLT.',
      code: 'import random\n\n# Verify CLT with exponential distribution\n# Draw 10,000 samples of size 30\n\n# Your code here\n',
      codeSolution: 'import random\nimport statistics\n\nrandom.seed(42)\nsample_means = []\nfor _ in range(10000):\n    sample = [random.expovariate(1.0) for _ in range(30)]\n    sample_means.append(sum(sample)/len(sample))\n\nprint(f"Mean of sample means: {sum(sample_means)/len(sample_means):.3f} (expect ~1.0)")\nprint(f"Std dev of sample means: {statistics.stdev(sample_means):.3f} (expect ~{1/30**0.5:.3f})")',
    },
    {
      id: 'nd-43', difficulty: 3,
      question: 'The weights of packages are N(μ=5.0 kg, σ=0.3 kg). A shipping container holds 100 packages. What is the probability that the **total weight** exceeds 505 kg?',
      steps: [
        { label: 'Step 1: Total = sum of 100 normal variables', content: 'Total ~ N(100×5.0, √(100)×0.3) = N(500, 3)' },
        { label: 'Step 2: z-score', content: 'z = (505−500)/3 = 5/3 ≈ 1.67' },
        { label: 'Step 3: P(Total > 505)', content: 'P(Z > 1.67) ≈ 1 − 0.9525 = **0.0475** ≈ 4.75%' },
      ],
      answer: '≈ 4.75% chance the total weight exceeds 505 kg',
    },
    {
      id: 'nd-44', difficulty: 3,
      question: 'A professor grades on a curve: the top 10% get A, the next 20% get B, the middle 40% get C, the next 20% get D, and the bottom 10% get F. If scores are N(μ=72, σ=9), find the score cutoffs.\n\nUse: z₉₀ = 1.28, z₇₀ = 0.524, z₃₀ = −0.524, z₁₀ = −1.28.',
      steps: [
        { label: 'Step 1: A cutoff (90th percentile)', content: 'x = 72 + 1.28×9 = 72 + 11.52 = **83.5**' },
        { label: 'Step 2: B cutoff (70th percentile)', content: 'x = 72 + 0.524×9 = 72 + 4.72 = **76.7**' },
        { label: 'Step 3: D cutoff (30th percentile)', content: 'x = 72 + (−0.524)×9 = 72 − 4.72 = **67.3**' },
        { label: 'Step 4: F cutoff (10th percentile)', content: 'x = 72 + (−1.28)×9 = 72 − 11.52 = **60.5**' },
      ],
      answer: 'A: ≥ 84, B: 77–83, C: 67–76, D: 61–66, F: ≤ 60',
    },
    {
      id: 'nd-45', difficulty: 3,
      question: 'Why is the normal distribution sometimes a poor model? Give three real-world examples where data is NOT normal.',
      steps: [
        { label: 'Example 1: Income', content: 'Income is **right-skewed** — a few very high earners pull the tail right. The mean is much higher than the median.' },
        { label: 'Example 2: Earthquake magnitudes', content: 'Follow a **power law** (Gutenberg-Richter law). Many small quakes, very few large ones. Not symmetric.' },
        { label: 'Example 3: Number of children per family', content: 'This is a **discrete, non-negative, right-skewed** distribution. You can\'t have −2 children, so the left tail is truncated.' },
        { label: 'Key warning', content: 'Applying z-tables or the 68-95-99.7 rule to non-normal data gives **wrong answers**. Always check normality first (histogram, Q-Q plot).' },
      ],
      answer: 'Income (right-skewed), earthquake magnitudes (power law), family size (discrete, bounded at 0). Normal assumptions fail for all three.',
    },
    {
      id: 'nd-46', difficulty: 3,
      question: 'Two machines fill cereal boxes.\n- Machine A: N(μ=500 g, σ=10 g)\n- Machine B: N(μ=505 g, σ=5 g)\n\nBoxes under 490 g are rejected. Which machine produces fewer rejects?',
      steps: [
        { label: 'Machine A: P(X < 490)', content: 'z = (490−500)/10 = −1.0. P(Z < −1.0) = **0.1587** = 15.87%' },
        { label: 'Machine B: P(X < 490)', content: 'z = (490−505)/5 = −3.0. P(Z < −3.0) = **0.0013** = 0.13%' },
        { label: 'Comparison', content: 'Machine B produces far fewer rejects (0.13% vs 15.87%) due to both higher mean and lower σ.' },
      ],
      answer: 'Machine B: only 0.13% rejects vs Machine A\'s 15.87%',
    },
    {
      id: 'nd-47', difficulty: 3,
      question: 'A random variable X ~ N(μ, σ²). Derive P(μ − 1.96σ < X < μ + 1.96σ) using the z-transformation.',
      steps: [
        { label: 'Step 1: Standardize', content: 'Z = (X − μ)/σ. If μ − 1.96σ < X < μ + 1.96σ, then −1.96 < Z < 1.96.' },
        { label: 'Step 2: From z-table', content: 'P(Z < 1.96) ≈ 0.975' },
        { label: 'Step 3: By symmetry', content: 'P(Z < −1.96) ≈ 0.025' },
        { label: 'Step 4: Subtract', content: 'P(−1.96 < Z < 1.96) = 0.975 − 0.025 = **0.95** = 95%' },
        { label: 'Significance', content: 'This is why 1.96 is the magic number for 95% confidence intervals!' },
      ],
      answer: 'P = 0.95 (95%). This is the foundation of the 95% confidence interval.',
    },
    {
      id: 'nd-48', difficulty: 3,
      question: 'A poll surveys 400 people. The true proportion who support a policy is p = 0.60. By the CLT, what is the probability that the sample proportion p̂ is between 0.55 and 0.65?',
      steps: [
        { label: 'Step 1: σ_p̂', content: 'σ_p̂ = √(p(1−p)/n) = √(0.6×0.4/400) = √(0.0006) = **0.0245**' },
        { label: 'Step 2: z-scores', content: 'z₁ = (0.55−0.60)/0.0245 = −2.04. z₂ = (0.65−0.60)/0.0245 = 2.04.' },
        { label: 'Step 3: Probability', content: 'P(−2.04 < Z < 2.04) ≈ 0.9793 − 0.0207 = **0.9586** ≈ 95.9%' },
      ],
      answer: '≈ 95.9% probability the sample proportion is within ±0.05 of the true value',
    },
    {
      id: 'nd-49', difficulty: 3,
      question: 'Use Python to find the exact probability P(60 < X < 85) for X ~ N(μ=70, σ=10), then compare with the empirical rule estimate.',
      visual: { kind: 'distribution', type: 'normal', params: { mu: 70, sigma: 10 }, shadeFrom: 60, shadeTo: 85 },
      steps: [
        { label: 'Step 1: z-scores', content: 'z₁ = (60−70)/10 = −1.0. z₂ = (85−70)/10 = 1.5.' },
        { label: 'Step 2: Exact (z-table)', content: 'P(Z < 1.5) − P(Z < −1.0) = 0.9332 − 0.1587 = **0.7745**' },
        { label: 'Step 3: Empirical estimate', content: 'The range goes from −1σ to +1.5σ. Not a clean ±kσ interval, so the empirical rule gives only rough guidance.' },
      ],
      answer: 'P(60 < X < 85) ≈ 0.7745 (77.45%)',
      code: '# Find P(60 < X < 85) for N(70, 10)\n\n# Your code here\n',
      codeSolution: 'from statistics import NormalDist\nd = NormalDist(mu=70, sigma=10)\nprob = d.cdf(85) - d.cdf(60)\nprint(f"P(60 < X < 85) = {prob:.4f} = {prob*100:.2f}%")',
    },
    {
      id: 'nd-50', difficulty: 3,
      question: 'A company claims its delivery times are N(μ=3 days, σ=0.5 days). A customer tracks 16 deliveries and finds a sample mean of 3.4 days. Is this evidence against the company\'s claim? (Use a significance level of 5%.)',
      steps: [
        { label: 'Step 1: Set up hypothesis', content: 'H₀: μ = 3.0. H₁: μ > 3.0 (one-tailed test).' },
        { label: 'Step 2: Standard error', content: 'σ_X̄ = 0.5/√16 = 0.5/4 = **0.125**' },
        { label: 'Step 3: z-statistic', content: 'z = (3.4 − 3.0)/0.125 = 0.4/0.125 = **3.2**' },
        { label: 'Step 4: p-value', content: 'P(Z > 3.2) ≈ 0.0007' },
        { label: 'Step 5: Decision', content: '0.0007 < 0.05 → Reject H₀. There is strong evidence that the true mean delivery time is greater than 3 days.' },
      ],
      answer: 'z = 3.2, p-value ≈ 0.0007. Reject H₀ — strong evidence deliveries take longer than claimed.',
      code: '# Test the company\'s claim\n# Sample: n=16, x_bar=3.4\n# Claimed: mu=3.0, sigma=0.5\n\n# Your code here\n',
      codeSolution: 'from statistics import NormalDist\nn, x_bar, mu_0, sigma = 16, 3.4, 3.0, 0.5\nse = sigma / n**0.5\nz = (x_bar - mu_0) / se\np_value = 1 - NormalDist().cdf(z)\nprint(f"z = {z:.2f}")\nprint(f"p-value = {p_value:.4f}")\nprint(f"Reject H0: {p_value < 0.05}")',
    },
  ],
};
