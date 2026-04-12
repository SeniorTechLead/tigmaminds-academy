import type { ReferenceGuide } from '../reference';
import { practiceMeanMedianMode, practiceStdDevVariance, practiceNormalDistribution } from '../practice-statistics';
import { practiceBinomialDistribution, practiceCorrelationRegression } from '../practice-statistics-2';
import { practicePoissonDistribution, practiceExponentialDistribution, practiceChiSquared } from '../practice-statistics-3';

export const guide: ReferenceGuide = {
  slug: 'statistics-and-distributions',
  title: 'Statistics & Distributions',
  category: 'math',
  icon: '📈',
  tagline: 'From averages to bell curves — the math that describes uncertainty and variation.',
  relatedStories: ['fishermans-daughter-storm', 'snow-leopards-promise', 'honey-hunters-lesson'],
  understand: [
    {
      title: 'Mean, Median, Mode & Range',
      beginnerContent:
        '**Four ways to summarise a dataset:**\n\n' +
        '| Measure | Definition | Example (data: 2, 3, 5, 5, 8, 12) |\n' +
        '|---------|-----------|-------------------------------------|\n' +
        '| Mean | Sum of all values / count | (2+3+5+5+8+12)/6 = **5.83** |\n' +
        '| Median | Middle value (sorted) | (5+5)/2 = **5** |\n' +
        '| Mode | Most frequent value | **5** (appears twice) |\n' +
        '| Range | Highest - lowest | 12 - 2 = **10** |\n\n' +
        '**When to use which:**\n\n' +
        '- **Mean** — best for symmetric data without outliers\n' +
        '- **Median** — best when outliers exist (e.g. income data: a few billionaires skew the mean)\n' +
        '- **Mode** — best for categorical data (e.g. most popular tea flavour in Assam)\n\n' +
        '**Example: Exam scores** 45, 67, 72, 72, 78, 81, 95\n\n' +
        '- Mean = 72.9, Median = 72, Mode = 72\n' +
        '- All three agree here because the data is roughly symmetric\n\n' +
        'Now add one outlier (a student scoring 5): Mean drops to 64.4, but Median only shifts to 72. The median is **robust** to outliers.',
      intermediateContent:
        '**Weighted mean:**\n\n' +
        '`weighted mean = sum(wi * xi) / sum(wi)`\n\n' +
        'Used when values have different importance. If your final grade is 30% homework, 30% midterm, 40% final:\n\n' +
        '| Component | Score | Weight |\n' +
        '|-----------|-------|--------|\n' +
        '| Homework | 85 | 0.30 |\n' +
        '| Midterm | 70 | 0.30 |\n' +
        '| Final | 90 | 0.40 |\n' +
        '| **Weighted mean** | | **82.5** |\n\n' +
        '[diagram:WeightedMeanDiagram]\n\n' +
        '**Percentiles and quartiles:**\n\n' +
        '| Measure | What it means |\n' +
        '|---------|---------------|\n' +
        '| **Q1** (25th percentile) | 25% of data falls below this value |\n' +
        '| **Q2** (50th percentile) | The median — the middle value |\n' +
        '| **Q3** (75th percentile) | 75% of data falls below this value |\n' +
        '| **IQR** = Q3 − Q1 | The range of the middle 50% of the data |\n' +
        '| **Outlier fences** | Values beyond Q1 − 1.5×IQR or Q3 + 1.5×IQR are flagged as outliers |\n\n' +
        '**Try it — switch datasets and watch the box plot change:**\n\n' +
        '[diagram:BoxPlotDiagram]',
      advancedContent:
        '**Robust statistics — worked example with MAD:**\n\n' +
        'Data: 12, 14, 13, 15, 14, **100**, 13, 11 (one outlier at 100)\n\n' +
        '| Measure | Calculation | Result | Affected by outlier? |\n' +
        '|---------|------------|--------|---------------------|\n' +
        '| Mean | (12+14+13+15+14+100+13+11)/8 | **24.0** | Yes — dragged up by 16 |\n' +
        '| Median | sort → middle of 12,13,13,14,14,15,100 | **13.5** | No |\n' +
        '| Std dev | | **29.2** | Yes — massively inflated |\n' +
        '| MAD | median of |12−13.5|, |14−13.5|, ..., |100−13.5| | **1.0** | No |\n\n' +
        '**MAD step by step:**\n\n' +
        '**Step 1:** Median of data = **13.5**\n\n' +
        '**Step 2:** Compute absolute deviations from the median:\n\n' +
        '| Value | |Value − 13.5| | Deviation |\n' +
        '|-------|---------------|----------|\n' +
        '| 11 | |11 − 13.5| | 2.5 |\n' +
        '| 12 | |12 − 13.5| | 1.5 |\n' +
        '| 13 | |13 − 13.5| | 0.5 |\n' +
        '| 13 | |13 − 13.5| | 0.5 |\n' +
        '| 14 | |14 − 13.5| | 0.5 |\n' +
        '| 14 | |14 − 13.5| | 0.5 |\n' +
        '| 15 | |15 − 13.5| | 1.5 |\n' +
        '| **100** | |100 − 13.5| | **86.5** |\n\n' +
        '**Step 3:** Sort the deviations and find their median:\n\n' +
        '0.5, 0.5, 0.5, 0.5, **1.0**, 1.5, 1.5, 2.5, 86.5 → MAD = **1.0**\n\n' +
        'The outlier\'s huge deviation (86.5) doesn\'t affect the median — it\'s just one value at the end.\n\n' +
        '**Step 4:** Scale to compare with standard deviation:\n\n' +
        'Scaled MAD = 1.0 × 1.4826 = **1.48** (the 1.4826 factor makes MAD match std dev for normally distributed data)\n\n' +
        'Compare: std dev = 29.2 (wrecked by outlier) vs. scaled MAD = 1.48 (ignores it).\n\n' +
        '**Trimmed mean (10% trim):**\n\n' +
        '| Step | Action | Values |\n' +
        '|------|--------|--------|\n' +
        '| Sort | Arrange in order | 11, 12, 13, 13, 14, 14, 15, 100 |\n' +
        '| Trim | Discard lowest 10% and highest 10% (1 value each) | ~~11~~, 12, 13, 13, 14, 14, 15, ~~100~~ |\n' +
        '| Average | Mean of remaining 6 values | (12+13+13+14+14+15)/6 = **13.5** |\n\n' +
        'The outlier is gone. The trimmed mean matches the median — both robust.\n\n' +
        '**M-estimators — iterative reweighting:**\n\n' +
        'Huber\'s method down-weights points far from the centre. Watch it converge:\n\n' +
        '[diagram:HuberEstimatorDiagram]\n\n' +
        '| Distance from centre | Treatment |\n' +
        '|---------------------|----------|\n' +
        '| Within 1.345σ (green zone) | Full weight — treated normally |\n' +
        '| Beyond 1.345σ | Weight = 1.345σ / distance — shrinks with distance |\n\n' +
        'The estimate starts at the mean (24.0, pulled by the outlier). Each iteration recalculates weights — ' +
        'the outlier at 100 gets progressively less influence until the estimate converges near **13.5**.',
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Compute summary statistics\ndata = [45, 67, 72, 72, 78, 81, 95]\n\nmean = sum(data) / len(data)\nsorted_d = sorted(data)\nn = len(sorted_d)\nmedian = sorted_d[n//2] if n % 2 else (sorted_d[n//2-1] + sorted_d[n//2]) / 2\n\n# Mode: most common value\nfrom collections import Counter\nmode = Counter(data).most_common(1)[0][0]\n\nprint(f"Data: {data}")\nprint(f"Mean:   {mean:.1f}")\nprint(f"Median: {median}")\nprint(f"Mode:   {mode}")\nprint(f"Range:  {max(data) - min(data)}")\n\n# Add an outlier and watch the mean shift!\ndata2 = data + [5]\nmean2 = sum(data2) / len(data2)\nprint(f"\\nWith outlier 5: mean = {mean2:.1f}")', title: 'Try it — Summary Statistics' } },
      practice: practiceMeanMedianMode,
    },
    {
      title: 'Standard Deviation & Variance',
      beginnerContent:
        '[diagram:StdDevBellCurveDiagram]\n\n' +
        '**The mean tells you the centre. Standard deviation tells you the spread.**\n\n' +
        'Two classes can have the same mean test score (75) but very different spreads:\n\n' +
        '- Class A: 70, 73, 75, 77, 80 — scores clustered tightly\n' +
        '- Class B: 50, 60, 75, 90, 100 — scores spread widely\n\n' +
        'How do we measure "how spread out"? Here is the idea, built step by step.\n\n' +
        '[diagram:StdDevStepsDiagram]\n\n' +
        '**Step 1 — Find the mean.** Data = {2, 4, 4, 4, 5, 5, 7, 9}. Mean = (2+4+4+4+5+5+7+9)/8 = 40/8 = **5**.\n\n' +
        '**Step 2 — How far is each value from the mean?**\n\n' +
        '| Value | Distance from mean (value − 5) |\n' +
        '|-------|-------------------------------|\n' +
        '| 2 | 2 − 5 = **−3** |\n' +
        '| 4 | 4 − 5 = **−1** |\n' +
        '| 4 | 4 − 5 = **−1** |\n' +
        '| 4 | 4 − 5 = **−1** |\n' +
        '| 5 | 5 − 5 = **0** |\n' +
        '| 5 | 5 − 5 = **0** |\n' +
        '| 7 | 7 − 5 = **+2** |\n' +
        '| 9 | 9 − 5 = **+4** |\n\n' +
        'Problem: if we add these up, the negatives cancel the positives (−3 −1 −1 −1 +0 +0 +2 +4 = 0). The average distance appears to be zero, even though the data is clearly spread out.\n\n' +
        '**Step 3 — Square each distance to make them all positive:**\n\n' +
        '| Value | Distance | Distance² |\n' +
        '|-------|----------|----------|\n' +
        '| 2 | −3 | 9 |\n' +
        '| 4 | −1 | 1 |\n' +
        '| 4 | −1 | 1 |\n' +
        '| 4 | −1 | 1 |\n' +
        '| 5 | 0 | 0 |\n' +
        '| 5 | 0 | 0 |\n' +
        '| 7 | +2 | 4 |\n' +
        '| 9 | +4 | 16 |\n' +
        '| **Sum** | | **32** |\n\n' +
        '**Step 4 — Variance** = average of squared distances = 32/8 = **4**.\n\n' +
        '**Step 5 — Standard deviation** = square root of variance = √4 = **2**.\n\n' +
        'Why take the square root? Because we squared the distances in Step 3, and the square root brings us back to the original units. ' +
        'Variance is in "squared units" (if data is in kg, variance is in kg²). Standard deviation is back in kg — much easier to interpret.\n\n' +
        'A standard deviation of 2 means: most values are within about 2 units of the mean.',
      intermediateContent:
        '**Why divide by (n−1) instead of n for samples?**\n\n' +
        'When you compute the mean from a sample, you used the data to estimate the centre. ' +
        'The deviations from THAT estimated mean are systematically smaller than the deviations from the TRUE population mean ' +
        '(because x̄ is the value that minimises the sum of squared deviations — that is literally what the mean does). ' +
        'Dividing by (n−1) instead of n compensates for this underestimate.\n\n' +
        'Concrete example: True population = {1, 2, 3, 4, 5}. True mean = 3. True variance = ((−2)² + (−1)² + 0² + 1² + 2²)/5 = 10/5 = **2.0**.\n\n' +
        'Take a sample: {1, 3, 5}. Sample mean = 3. Deviations: (−2)² + 0² + 2² = 8.\n' +
        '- Divide by n=3: 8/3 = 2.67 (too high this time, but on average across many samples, dividing by n underestimates)\n' +
        '- Divide by n−1=2: 8/2 = **4.0** (this is the unbiased sample variance — on average it equals the true value)\n\n' +
        '**The empirical rule — what "within 1σ" means concretely:**\n\n' +
        'For bell-shaped data with mean = 75, σ = 10:\n\n' +
        '| Range | Scores | % of students |\n' +
        '|-------|--------|---------------|\n' +
        '| μ ± 1σ | 65 to 85 | ~68% (about 2 out of 3) |\n' +
        '| μ ± 2σ | 55 to 95 | ~95% (nearly everyone) |\n' +
        '| μ ± 3σ | 45 to 105 | ~99.7% (all but 3 in 1000) |\n\n' +
        '**Z-scores — "how many standard deviations from the mean?"**\n\n' +
        '[diagram:ZScoreDiagram]\n\n' +
        'z = (your value − mean) / σ. A student scoring 95 on the exam above: z = (95−75)/10 = **+2.0**. ' +
        'They are 2 standard deviations above average — better than about 97.7% of students.\n\n' +
        'A student scoring 60: z = (60−75)/10 = **−1.5**. They are 1.5σ below average — better than about 6.7% of students.\n\n' +
        'Z-scores let you compare across different scales. A z=+1.5 in maths and z=+1.5 in science mean equally good performance, even if the raw scores and spreads are different.',
      advancedContent:
        '**Variance rules — derived, not memorised:**\n\n' +
        '**Rule 1: Var(aX + b) = a² Var(X)**\n\n' +
        'Adding a constant b shifts all values but doesn\'t change spread → Var unchanged. ' +
        'Multiplying by a scales every deviation by a → squared deviations scale by a².\n\n' +
        'Example: Convert temperatures from °C to °F: F = 1.8C + 32. If Var(C) = 25, then Var(F) = 1.8² × 25 = **81**.\n\n' +
        '**Rule 2: Var(X + Y) = Var(X) + Var(Y) (if independent)**\n\n' +
        'Your exam has two sections. Section A has σ = 5 points, Section B has σ = 8 points. ' +
        'Total variance = 25 + 64 = 89. Total σ = √89 ≈ **9.4 points** (NOT 5 + 8 = 13!).\n\n' +
        'Standard deviations don\'t add directly — variances do. This is why portfolio diversification works: ' +
        'combining uncorrelated investments reduces total risk (σ of portfolio < sum of individual σs).\n\n' +
        '**Chebyshev\'s inequality — proof sketch:**\n\n' +
        'For ANY distribution: P(|X − μ| ≥ kσ) ≤ 1/k²\n\n' +
        'Proof: Var(X) = E[(X−μ)²] ≥ E[(X−μ)² × 1(|X−μ| ≥ kσ)] ≥ k²σ² × P(|X−μ| ≥ kσ). ' +
        'Divide both sides by k²σ²: P(|X−μ| ≥ kσ) ≤ σ²/(k²σ²) = 1/k². ∎\n\n' +
        '| k | At least this fraction within kσ | Normal distribution (actual) |\n' +
        '|---|---|---|\n' +
        '| 2 | 75% | 95.4% |\n' +
        '| 3 | 88.9% | 99.7% |\n' +
        '| 4 | 93.8% | 99.99% |\n\n' +
        'Chebyshev is weak but universal — it works for skewed, multimodal, ANY shape. The normal rule (68-95-99.7) is tighter but only works for bell curves.',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import math\n\ndata = [2, 4, 4, 4, 5, 5, 7, 9]\nn = len(data)\nmean = sum(data) / n\n\n# Variance and standard deviation\nvar_pop = sum((x - mean)**2 for x in data) / n\nvar_sample = sum((x - mean)**2 for x in data) / (n - 1)\nsd = math.sqrt(var_pop)\n\nprint(f"Data: {data}")\nprint(f"Mean: {mean}")\nprint(f"Population variance: {var_pop}")\nprint(f"Sample variance: {var_sample:.2f}")\nprint(f"Std deviation: {sd:.2f}")\n\n# Z-scores\nprint("\\nZ-scores:")\nfor x in data:\n    z = (x - mean) / sd\n    print(f"  x={x}  z={z:+.2f}")', title: 'Try it — Variance & Std Dev' } },
      practice: practiceStdDevVariance,
    },
    {
      title: 'The Normal (Gaussian) Distribution',
      beginnerContent:
        '**Why does the bell curve keep appearing everywhere?**\n\n' +
        'Measure the height of 1000 women. Most cluster around 152 cm. A few are very short (135 cm), a few very tall (170 cm), ' +
        'but the further from the centre, the rarer the values. Plot a histogram and it looks like a bell.\n\n' +
        'Measure 1000 exam scores. Same bell shape. Measure 1000 rice grain weights. Same bell. Why?\n\n' +
        '**Because each measurement is the sum of many tiny random effects.** A woman\'s height depends on hundreds of genes, nutrition, sleep, illness, exercise — ' +
        'each nudging her height slightly up or slightly down. Most of those random nudges cancel out (some up, some down), ' +
        'so most women end up near the average. Occasionally all the nudges align in the same direction — producing a very tall or very short person. But that is rare.\n\n' +
        'This is the **Central Limit Theorem** in plain language: add up many independent random effects, and the total forms a bell curve. ' +
        'It works regardless of what each individual effect looks like.\n\n' +
        '**The bell curve is described by just two numbers:**\n\n' +
        '- **μ (mean)** — the centre of the bell. Where most values cluster.\n' +
        '- **σ (standard deviation)** — the width. Small σ = narrow bell (values are tight). Large σ = wide bell (values are spread).\n\n' +
        '**How to use the 68-95-99.7 rule:**\n\n' +
        'Heights of adult women in India: μ = 152 cm, σ = 6 cm.\n\n' +
        '| Range | Heights | What it means |\n' +
        '|-------|---------|---------------|\n' +
        '| μ ± 1σ | 146 to 158 cm | **68%** of women (about 2 out of 3) |\n' +
        '| μ ± 2σ | 140 to 164 cm | **95%** of women (nearly all) |\n' +
        '| μ ± 3σ | 134 to 170 cm | **99.7%** of women (all but 3 in 1000) |\n\n' +
        'A woman who is 170 cm tall: how unusual is she? She is (170 − 152)/6 = **3σ above the mean** — taller than 99.85% of women. ' +
        'Only about 1.5 in 1000 women are that tall.',
      intermediateContent:
        '**The standard normal distribution** has mean = 0 and sigma = 1.\n\n' +
        'Any normal distribution can be standardised using: `z = (x - mu) / sigma`\n\n' +
        '**Using z-scores to find probabilities:**\n\n' +
        '| z-score | Area to the left | Meaning |\n' +
        '|---------|-----------------|--------|\n' +
        '| -2.0 | 0.0228 | Bottom 2.3% |\n' +
        '| -1.0 | 0.1587 | Bottom 15.9% |\n' +
        '| 0.0 | 0.5000 | Exactly at the mean |\n' +
        '| +1.0 | 0.8413 | Top 15.9% |\n' +
        '| +2.0 | 0.9772 | Top 2.3% |\n\n' +
        '**Example:** IQ scores are normally distributed with mean = 100, sigma = 15. What percentage score above 130?\n\n' +
        'z = (130-100)/15 = 2.0. Area to the left of z=2 is 0.9772, so area to the right is 1 - 0.9772 = **2.28%**.\n\n' +
        '*See also: The Gaussian distribution in Machine Learning — how it is used in classification, anomaly detection, and Bayesian inference.*',
      advancedContent:
        '**Building the bell curve formula from scratch:**\n\n' +
        '[diagram:BellCurveBuilderDiagram]\n\n' +
        'We want a function f(x) that:\n' +
        '- Is highest at the centre (x = μ)\n' +
        '- Falls off symmetrically on both sides\n' +
        '- Falls off FASTER the further you go (not linearly — exponentially)\n' +
        '- Has total area under the curve = 1 (it\'s a probability distribution)\n\n' +
        '**Step 1 — Start with the simplest bell shape:** f(x) = e^(−x²)\n\n' +
        'Why e^(−x²)? Because:\n' +
        '- At x = 0: e⁰ = 1 (the peak)\n' +
        '- At x = 1: e⁻¹ ≈ 0.37\n' +
        '- At x = 2: e⁻⁴ ≈ 0.018\n' +
        '- At x = 3: e⁻⁹ ≈ 0.00012\n' +
        'It drops fast and is always positive — a bell shape.\n\n' +
        '**Step 2 — Centre it at μ:** Replace x with (x − μ): f(x) = e^(−(x−μ)²)\n\n' +
        '**Step 3 — Control the width with σ:** Replace (x−μ)² with (x−μ)²/(2σ²). ' +
        'Larger σ → denominator grows → exponent shrinks → the bell is wider.\n\n' +
        'Now: f(x) = e^(−(x−μ)² / (2σ²))\n\n' +
        '**Step 4 — Make the total area = 1:** The area under e^(−(x−μ)²/(2σ²)) turns out to be σ√(2π). ' +
        'Divide by this to normalise:\n\n' +
        '**f(x) = (1 / (σ√(2π))) × e^(−(x−μ)² / (2σ²))**\n\n' +
        'Every piece has a purpose. Nothing is arbitrary.\n\n' +
        '**Why does the area equal σ√(2π)?**\n\n' +
        'Let I = ∫₋∞^∞ e^(−x²) dx. We cannot solve this integral directly (it has no formula in terms of elementary functions). ' +
        'But here is a trick: compute I² instead.\n\n' +
        'I² = (∫e^(−x²) dx)(∫e^(−y²) dy) = ∫∫ e^(−x²−y²) dx dy\n\n' +
        'Now switch to polar coordinates (r, θ): x² + y² = r², and the area element dx dy becomes r dr dθ.\n\n' +
        'I² = ∫₀^(2π) ∫₀^∞ e^(−r²) r dr dθ = 2π × ∫₀^∞ r e^(−r²) dr\n\n' +
        'The inner integral: let u = r², du = 2r dr → ∫₀^∞ r e^(−r²) dr = ½ ∫₀^∞ e^(−u) du = ½\n\n' +
        'So I² = 2π × ½ = π. Therefore **I = √π**.\n\n' +
        'Substituting back: ∫₋∞^∞ e^(−(x−μ)²/(2σ²)) dx = σ√(2π), confirming our normalising constant. ∎\n\n' +
        '**The Central Limit Theorem — why the bell curve is everywhere:**\n\n' +
        'A person\'s height is the sum of many tiny independent effects: hundreds of genes, nutrition, sleep, exercise. ' +
        'The CLT says: when you add many independent random contributions, the sum tends toward a normal distribution — ' +
        'regardless of how each individual contribution is distributed. This is why heights, test score averages, measurement errors, ' +
        'and manufacturing tolerances are all approximately normal.',
      diagram: 'GaussianExplorerDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import math\n\ndef normal_pdf(x, mu, sigma):\n    coeff = 1 / (sigma * math.sqrt(2 * math.pi))\n    exponent = -((x - mu) ** 2) / (2 * sigma ** 2)\n    return coeff * math.exp(exponent)\n\nmu, sigma = 152, 6  # Women\'s heights in cm\n\nprint(f"Normal distribution: mu={mu}, sigma={sigma}")\nprint(f"\\nHeight  PDF value")\nprint("-" * 22)\nfor h in range(136, 170, 2):\n    pdf = normal_pdf(h, mu, sigma)\n    bar = "#" * int(pdf * 300)\n    print(f"  {h} cm  {bar}")\n\nprint(f"\\n68% range: {mu-sigma} to {mu+sigma} cm")\nprint(f"95% range: {mu-2*sigma} to {mu+2*sigma} cm")', title: 'Try it — Normal Distribution' } },
      practice: practiceNormalDistribution,
    },
    {
      title: 'Binomial Distribution',
      beginnerContent:
        '[diagram:BinomialDistDiagram]\n\n' +
        '**Building the formula piece by piece — not memorising it.**\n\n' +
        'Suppose you flip a coin 3 times. What is the probability of getting exactly 2 heads?\n\n' +
        '[diagram:CoinFlipBinomialDiagram]\n\n' +
        '**Step 1 — List the ways to get 2 heads out of 3 flips:**\n' +
        'HHT, HTH, THH — there are **3 ways**. (This is C(3,2) = 3.)\n\n' +
        '**Step 2 — What is the probability of any ONE of these sequences?**\n' +
        'Each flip is independent. P(HHT) = P(H) × P(H) × P(T) = 0.5 × 0.5 × 0.5 = 0.125.\n' +
        'Notice: that is p² × (1−p)¹ — two heads and one tail.\n\n' +
        '**Step 3 — Combine:** 3 ways × 0.125 each = **0.375**.\n\n' +
        'Now generalise: for n flips, k heads:\n' +
        '- Number of ways to arrange k heads in n positions = **C(n, k)**\n' +
        '- Probability of any one arrangement = **pᵏ × (1−p)ⁿ⁻ᵏ**\n' +
        '- Total: **P(X = k) = C(n, k) × pᵏ × (1−p)ⁿ⁻ᵏ**\n\n' +
        'Each piece has a reason. C(n,k) counts arrangements. pᵏ is the probability of k successes. (1−p)ⁿ⁻ᵏ is the probability of the remaining failures.\n\n' +
        '**Check yourself:** P(exactly 2 heads in 3 fair coin flips) = C(3,2) × 0.5² × 0.5¹ = 3 × 0.25 × 0.5 = **0.375** ✓\n\n' +
        '**Mean = n × p** (10 flips of a fair coin → expect 5 heads). **Std dev = √(np(1−p))** (= √2.5 ≈ 1.58 for this example).',
      intermediateContent:
        '**Conditions for binomial distribution:**\n\n' +
        '1. Fixed number of trials (n)\n' +
        '2. Each trial has exactly two outcomes (success/failure)\n' +
        '3. Probability p is constant across trials\n' +
        '4. Trials are independent\n\n' +
        '**Normal approximation:** When n is large and p is not extreme, the binomial approximates a normal distribution with mu = np and sigma = sqrt(np(1-p)). Rule of thumb: use when np >= 5 AND n(1-p) >= 5.\n\n' +
        '**Example:** A vaccine is 80% effective. In a group of 100 people, what is the probability that 85 or more are protected?\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| mu = np | 100 * 0.8 = 80 |\n' +
        '| sigma | sqrt(100 * 0.8 * 0.2) = 4 |\n' +
        '| z-score for 85 | (85 - 80) / 4 = 1.25 |\n' +
        '| P(X >= 85) | 1 - 0.8944 = **~10.6%** |',
      advancedContent:
        '**Deriving the mean — why is the average number of heads = np?**\n\n' +
        'Think of each flip as its own mini-variable: Xᵢ = 1 if heads, 0 if tails.\n\n' +
        'Total heads X = X₁ + X₂ + ... + Xₙ (just add up the 1s).\n\n' +
        'The average value of one flip:\n' +
        'E[Xᵢ] = (value if heads) × P(heads) + (value if tails) × P(tails) = 1 × p + 0 × (1−p) = **p**\n\n' +
        'For a fair coin: E[Xᵢ] = 0.5. Makes sense — half the time you get 1, half you get 0.\n\n' +
        'The average total = sum of individual averages:\n' +
        'E[X] = E[X₁] + E[X₂] + ... + E[Xₙ] = p + p + ... + p = **np** ∎\n\n' +
        'For 10 fair flips: E[X] = 10 × 0.5 = **5 heads**.\n' +
        'For 100 flips of a biased coin (p = 0.7): E[X] = 100 × 0.7 = **70 heads**.\n\n' +
        '**Deriving the variance — why Var = np(1−p):**\n\n' +
        'The variance of ONE flip (Xᵢ is 0 or 1):\n\n' +
        'E[Xᵢ²] = 1² × p + 0² × (1−p) = p. (Squaring 0 or 1 gives 0 or 1 — no change.)\n\n' +
        'Var(Xᵢ) = E[Xᵢ²] − (E[Xᵢ])² = p − p² = **p(1−p)**\n\n' +
        'For a fair coin: 0.5 × 0.5 = 0.25 — maximum uncertainty.\n' +
        'For p = 0.99: 0.99 × 0.01 = 0.0099 — almost no uncertainty (you nearly always get heads).\n\n' +
        'Since flips are independent, variances add:\n' +
        'Var(X) = n × p(1−p) = **np(1−p)** ∎\n\n' +
        'For 10 fair flips: Var = 10 × 0.25 = 2.5. Std dev = √2.5 ≈ **1.58** heads.\n\n' +
        '**The geometric distribution — derived from binomial thinking:**\n\n' +
        '[diagram:GeometricDistDiagram]\n\n' +
        '"How many trials until the first success?" If each trial has probability p:\n' +
        '- Success on trial 1: P = p\n' +
        '- Success on trial 2 (fail then succeed): P = (1−p)×p\n' +
        '- Success on trial k: P = (1−p)^(k−1) × p\n\n' +
        'Mean waiting time = 1/p. If a bus comes with probability 0.1 each minute, you wait on average 10 minutes.\n\n' +
        '**The Poisson limit — why rare events follow Poisson:**\n\n' +
        '**Scenario:** 10,000 emails arrive. Each has a 0.02% chance of being phishing.\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| n (trials) | 10,000 emails |\n' +
        '| p (probability each) | 0.0002 (0.02%) |\n' +
        '| λ = np (expected count) | **2** phishing emails |\n\n' +
        '**The problem:** Computing Binomial(10000, 0.0002) requires factorials of 10,000 — impractical.\n\n' +
        '**The shortcut:** When n is large and p is tiny, Binomial ≈ Poisson:\n\n' +
        '| Binomial (exact, impractical) | Poisson (approximation, easy) |\n' +
        '|------|------|\n' +
        '| P(X=k) = C(10000, k) × 0.0002ᵏ × 0.9998^(10000−k) | P(X=k) = 2ᵏ × e⁻² / k! |\n' +
        '| Needs factorial of 10,000 | Needs a pocket calculator |\n\n' +
        'The derivation replaces C(n,k)pᵏ(1−p)ⁿ⁻ᵏ with λᵏe⁻λ/k! as n → ∞. See the Poisson section for the full proof.',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import math\n\ndef binomial_pmf(n, k, p):\n    comb = math.factorial(n) // (math.factorial(k) * math.factorial(n - k))\n    return comb * p**k * (1 - p)**(n - k)\n\nn, p = 10, 0.5  # 10 coin flips, fair coin\nprint(f"Binomial(n={n}, p={p})")\nprint(f"Mean = {n*p}, SD = {math.sqrt(n*p*(1-p)):.2f}")\nprint()\nfor k in range(n + 1):\n    prob = binomial_pmf(n, k, p)\n    bar = "#" * int(prob * 80)\n    print(f"  k={k:>2}  P={prob:.4f}  {bar}")', title: 'Try it — Binomial Distribution' } },
      practice: practiceBinomialDistribution,
    },
    {
      title: 'Correlation & Regression',
      beginnerContent:
        '**Do two variables move together?**\n\n' +
        '[diagram:CorrelationRegressionDiagram]\n\n' +
        'Correlation measures the **strength and direction** of the linear relationship between two variables.\n\n' +
        '**Correlation coefficient r** ranges from -1 to +1:\n\n' +
        '| r value | Meaning |\n' +
        '|---------|--------|\n' +
        '| +1 | Perfect positive (both rise together) |\n' +
        '| +0.8 | Strong positive |\n' +
        '| 0 | No linear relationship |\n' +
        '| -0.6 | Moderate negative |\n' +
        '| -1 | Perfect negative (one rises as the other falls) |\n\n' +
        '**Examples:**\n\n' +
        '- Study hours vs exam score: strong positive (r = 0.85)\n' +
        '- Temperature vs hot tea sales: negative (r = -0.7)\n' +
        '- Shoe size vs IQ: no correlation (r = 0.02)\n\n' +
        '**The critical warning:**\n\n' +
        'Correlation does NOT imply causation. Ice cream sales and drowning deaths are positively correlated — but ice cream does not cause drowning. Both increase in summer (the **confounding variable**).\n\n' +
        '[diagram:ConfoundingVariableDiagram]\n\n' +
        '**Linear regression** draws the straight line that best fits the data — the one that comes as close as possible to all the points at once. ' +
        'Once you have that line, you can use it to predict: "if x increases by 10, how much does y change?" The intermediate and advanced sections show exactly how to compute it.',
      intermediateContent:
        '**What "best-fit" means — and why we square the errors:**\n\n' +
        '[diagram:LeastSquaresDiagram]\n\n' +
        'You draw a line through your data. Some points are above the line (positive error), some below (negative error). ' +
        'If you just add the errors, positives and negatives cancel — even a terrible line can have total error = 0.\n\n' +
        'Fix: **square** each error first. Then all errors are positive. The best line minimises the total of these squared errors. ' +
        'That is "least squares."\n\n' +
        '**Computing the slope — what the formula actually does:**\n\n' +
        '[diagram:SlopeDeviationDiagram]\n\n' +
        'The slope measures: "when x goes up by 1, how much does y go up?" To find this:\n' +
        '1. For each point, ask: is x above or below average? Is y above or below average?\n' +
        '2. Multiply those two deviations together\n' +
        '3. If x is above average AND y is above average (both positive), the product is positive → they move together\n' +
        '4. If x is above average but y is below (opposite signs), the product is negative → they move apart\n' +
        '5. The slope = (sum of these products) / (sum of x-deviations squared)\n\n' +
        'The advanced section computes this for a real rainfall/yield dataset.\n\n' +
        '**Example data — does rainfall predict rice yield?**\n\n' +
        '| Year | Rain (cm) | Yield (tonnes/ha) |\n' +
        '|------|-----------|------------------|\n' +
        '| 2020 | 180 | 3.2 |\n' +
        '| 2021 | 210 | 3.8 |\n' +
        '| 2022 | 160 | 2.9 |\n' +
        '| 2023 | 195 | 3.5 |\n\n' +
        'More rain → more yield in every row. That is strong positive correlation.\n\n' +
        '**r² (r-squared)** tells you what fraction of y\'s variation is explained by x. ' +
        'r² = 0.92 means rainfall explains 92% of yield variation. The other 8% comes from soil, fertiliser, pests, etc.',
      advancedContent:
        '**Computing the best-fit line from scratch — every step shown.**\n\n' +
        'Using our rainfall/yield data. First, compute the means:\n\n' +
        'x̄ = (180 + 210 + 160 + 195) / 4 = 745/4 = **186.25 cm**\n' +
        'ȳ = (3.2 + 3.8 + 2.9 + 3.5) / 4 = 13.4/4 = **3.35 tonnes/ha**\n\n' +
        '**Step 1 — For each data point, compute how far it is from the mean:**\n\n' +
        '| Year | Rainfall xᵢ | xᵢ − x̄ | Yield yᵢ | yᵢ − ȳ |\n' +
        '|------|------------|---------|----------|--------|\n' +
        '| 2020 | 180 | −6.25 | 3.2 | −0.15 |\n' +
        '| 2021 | 210 | +23.75 | 3.8 | +0.45 |\n' +
        '| 2022 | 160 | −26.25 | 2.9 | −0.45 |\n' +
        '| 2023 | 195 | +8.75 | 3.5 | +0.15 |\n\n' +
        'Notice: when rainfall is below average (negative), yield is also below average (negative). They move together — that is positive correlation.\n\n' +
        '**Step 2 — Multiply each pair of deviations, and square the x-deviations:**\n\n' +
        '| xᵢ − x̄ | yᵢ − ȳ | Product (xᵢ−x̄)(yᵢ−ȳ) | Squared (xᵢ−x̄)² |\n' +
        '|---------|--------|----------------------|------------------|\n' +
        '| −6.25 | −0.15 | (−6.25)(−0.15) = +0.94 | 39.06 |\n' +
        '| +23.75 | +0.45 | (+23.75)(+0.45) = +10.69 | 564.06 |\n' +
        '| −26.25 | −0.45 | (−26.25)(−0.45) = +11.81 | 689.06 |\n' +
        '| +8.75 | +0.15 | (+8.75)(+0.15) = +1.31 | 76.56 |\n' +
        '| | | **Sum = 24.75** | **Sum = 1368.75** |\n\n' +
        'All products are positive (when both deviations have the same sign, the product is positive). Strong positive correlation.\n\n' +
        '**Step 3 — The slope:** m = sum of products / sum of squares = 24.75 / 1368.75 = **0.0181**\n\n' +
        'This means: every extra centimetre of rainfall adds 0.0181 tonnes/ha of yield.\n\n' +
        '**Step 4 — The intercept:** The line must pass through the point (x̄, ȳ).\n\n' +
        'b = ȳ − m × x̄ = 3.35 − 0.0181 × 186.25 = 3.35 − 3.37 = **−0.02**\n\n' +
        '**The line:** yield = 0.0181 × rainfall − 0.02\n\n' +
        '**Step 5 — Predict:** If rainfall next year is 200 cm:\n\n' +
        'yield = 0.0181 × 200 − 0.02 = **3.60 tonnes/ha**\n\n' +
        'Sanity check: our closest data point is 195 cm → 3.5 tonnes. 5 more cm of rain → 0.0181 × 5 = 0.09 more yield → 3.59. Close to our prediction of 3.60 ✓\n\n' +
        '**Step 6 — How good is the line? Computing r²:**\n\n' +
        'We need one more column: Σ(yᵢ−ȳ)² = (−0.15)² + (0.45)² + (−0.45)² + (0.15)² = 0.0225 + 0.2025 + 0.2025 + 0.0225 = **0.45**\n\n' +
        'r² = (sum of products)² / (sum of x-squares × sum of y-squares) = 24.75² / (1368.75 × 0.45) = 612.56 / 615.94 = **0.995**\n\n' +
        'Rainfall explains **99.5%** of the variation in yield. Only 0.5% is unexplained (noise, measurement error, other factors).',
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Simple linear regression from scratch\nrain = [180, 210, 160, 195, 220, 175, 200]\nyield_t = [3.2, 3.8, 2.9, 3.5, 4.1, 3.0, 3.6]\nn = len(rain)\n\n# Calculate means\nx_bar = sum(rain) / n\ny_bar = sum(yield_t) / n\n\n# Slope and intercept\nnum = sum(rain[i]*yield_t[i] for i in range(n)) - n*x_bar*y_bar\nden = sum(rain[i]**2 for i in range(n)) - n*x_bar**2\nm = num / den\nb = y_bar - m * x_bar\n\n# Correlation coefficient\nss_xy = num\nss_xx = den\nss_yy = sum(yield_t[i]**2 for i in range(n)) - n*y_bar**2\nr = ss_xy / (ss_xx * ss_yy) ** 0.5\n\nprint(f"Best-fit line: y = {m:.4f}x + {b:.2f}")\nprint(f"Correlation r = {r:.3f}")\nprint(f"R-squared = {r**2:.3f}")\nprint(f"\\nPredicted yield at 190cm rain: {m*190+b:.2f} tonnes/ha")', title: 'Try it — Regression' } },
      practice: practiceCorrelationRegression,
    },
    {
      title: 'The Poisson Distribution',
      beginnerContent:
        '[diagram:PoissonDistDiagram]\n\n' +
        '**Where the Poisson formula comes from — step by step.**\n\n' +
        'A shop averages 3 customers per hour. What is the probability that exactly 0 customers arrive in an hour? Exactly 1? Exactly 5?\n\n' +
        '**The idea:** Divide the hour into tiny slices. If you split 1 hour into n = 1000 tiny intervals (each 3.6 seconds), ' +
        'each slice either has a customer (probability p = 3/1000 = 0.003) or doesn\'t. This is a binomial problem: n = 1000 trials, p = 0.003.\n\n' +
        'But computing C(1000, k) × 0.003ᵏ × 0.997¹⁰⁰⁰⁻ᵏ is painful. As n → ∞ and p → 0 (with np = λ = 3 held constant), the binomial simplifies:\n\n' +
        '- C(n,k) ≈ nᵏ/k! (when n is huge and k is small)\n' +
        '- pᵏ = (λ/n)ᵏ = λᵏ/nᵏ\n' +
        '- (1−λ/n)ⁿ⁻ᵏ → e⁻λ (the definition of e)\n\n' +
        'Multiply: (nᵏ/k!) × (λᵏ/nᵏ) × e⁻λ = **λᵏ e⁻λ / k!**\n\n' +
        'That is the Poisson formula. It is not dropped from the sky — it is the binomial formula for many trials with rare events.\n\n' +
        '**Computing by hand for λ = 3:**\n\n' +
        '| k | λᵏ | k! | e⁻³ ≈ 0.0498 | P(X=k) = λᵏe⁻λ/k! |\n' +
        '|---|-----|-----|---------------|--------------------|\n' +
        '| 0 | 1 | 1 | 0.0498 | **5.0%** |\n' +
        '| 1 | 3 | 1 | 0.0498 | **14.9%** |\n' +
        '| 2 | 9 | 2 | 0.0498 | **22.4%** |\n' +
        '| 3 | 27 | 6 | 0.0498 | **22.4%** |\n' +
        '| 4 | 81 | 24 | 0.0498 | **16.8%** |\n' +
        '| 5 | 243 | 120 | 0.0498 | **10.1%** |\n\n' +
        '**Unique property:** Mean = λ = 3, Variance = λ = 3. The mean and variance are ALWAYS equal for Poisson. If you observe data where the variance is much larger than the mean, the Poisson model does not fit (look at negative binomial instead).',
      intermediateContent:
        '**Poisson as a limit of Binomial:**\n\n' +
        'When n is large, p is small, and λ = np is moderate:\n\n' +
        '`Binomial(n, p) → Poisson(λ)` as n → ∞, p → 0\n\n' +
        '**Example:** 1000 emails, each has 0.2% chance of being spam. Expected spam = 1000 × 0.002 = 2.\n\n' +
        '- Binomial: P(X=3) = C(1000,3) × 0.002³ × 0.998⁹⁹⁷ ≈ 0.1804\n' +
        '- Poisson: P(X=3) = (2³ × e⁻²) / 3! = 0.1804 ✓\n\n' +
        '**Sum property:** If X ~ Poisson(λ₁) and Y ~ Poisson(λ₂), then X + Y ~ Poisson(λ₁ + λ₂)\n\n' +
        '**When to use Poisson vs Binomial:**\n\n' +
        '- Binomial: fixed number of trials, known probability\n' +
        '- Poisson: counting events in continuous time/space, known rate',
      advancedContent:
        '**The Binomial → Poisson limit — showing every algebra step.**\n\n' +
        'Start with binomial: P(X=k) = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ. Substitute p = λ/n.\n\n' +
        '**Piece 1 — What happens to C(n,k)?**\n\n' +
        'C(n,k) = n! / (k!(n−k)!) = [n × (n−1) × (n−2) × ... × (n−k+1)] / k!\n\n' +
        'That is k terms in the numerator. When n is huge and k is small (say k=3, n=1,000,000):\n' +
        'n × (n−1) × (n−2) ≈ n × n × n = n³ = nᵏ\n\n' +
        'So C(n,k) ≈ nᵏ / k!\n\n' +
        '**Piece 2 — What happens to pᵏ?**\n\n' +
        'p = λ/n, so pᵏ = (λ/n)ᵏ = λᵏ/nᵏ\n\n' +
        '**Piece 3 — What happens to (1−p)ⁿ⁻ᵏ?**\n\n' +
        '(1 − λ/n)ⁿ⁻ᵏ. As n → ∞, the (−k) in the exponent doesn\'t matter (it is tiny compared to n).\n' +
        'So this becomes (1 − λ/n)ⁿ, which is the definition of e⁻λ.\n\n' +
        '(Why? Because eˣ = lim_{n→∞} (1 + x/n)ⁿ. Set x = −λ and you get e⁻λ.)\n\n' +
        '**Multiply the three pieces:**\n\n' +
        '(nᵏ/k!) × (λᵏ/nᵏ) × e⁻λ\n\n' +
        'The nᵏ in the numerator and denominator cancel:\n\n' +
        '= **λᵏ × e⁻λ / k!** ∎\n\n' +
        '**Verify with numbers.** λ = 3, k = 2:\n' +
        'P(X=2) = 3² × e⁻³ / 2! = 9 × 0.0498 / 2 = 0.4482 / 2 = **0.224**\n\n' +
        'From the table in the beginner section: P(X=2) = 22.4% ✓\n\n' +
        '**Connection to the Exponential distribution:**\n\n' +
        'If customers arrive at a Poisson rate of λ = 3 per hour, how long do you wait for the NEXT customer? ' +
        'That waiting time is Exponential(λ). The Poisson counts events; the Exponential measures the gap between them. ' +
        'They are two sides of the same process — see the Exponential section for the full derivation.',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import numpy as np\n\n# Poisson distribution\nlam = 3  # average rate\n\ndef poisson_pmf(k, lam):\n    return (lam**k * np.exp(-lam)) / np.math.factorial(k)\n\nprint(f"Poisson(lambda={lam})")\nprint(f"Mean = {lam}, Variance = {lam}")\nprint()\nprint("k  | P(X=k)  | Cumulative")\nprint("-" * 30)\ncum = 0\nfor k in range(11):\n    p = poisson_pmf(k, lam)\n    cum += p\n    bar = "#" * int(p * 50)\n    print(f"{k:>2} | {p:.4f}  | {cum:.4f}  {bar}")', title: 'Try it — Poisson' } },
      practice: practicePoissonDistribution,
    },
    {
      title: 'The Exponential Distribution',
      beginnerContent:
        '[diagram:ExponentialDistDiagram]\n\n' +
        '**How long until the next event? Building the formula from a question.**\n\n' +
        'Buses arrive at a rate of about 6 per hour (one every 10 minutes on average). You just arrived at the stop. How long will you wait?\n\n' +
        'The waiting time is NOT fixed at 10 minutes. Sometimes a bus comes in 2 minutes, sometimes you wait 20. The exponential distribution describes this randomness.\n\n' +
        '**Deriving the formula from common sense:**\n\n' +
        'What is the probability of waiting MORE than t minutes? That means zero buses in t minutes. ' +
        'If buses arrive randomly at rate λ per minute (λ = 1/10 = 0.1), the Poisson probability of zero events in time t is:\n\n' +
        'P(zero buses in t min) = e⁻λᵗ\n\n' +
        'So P(wait > t) = e⁻λᵗ, which means:\n' +
        '**P(wait ≤ t) = 1 − e⁻λᵗ**\n\n' +
        'That is the entire formula, and it came from the question "what does zero events look like?"\n\n' +
        '**Calculating by hand:**\n\n' +
        '| Wait time | P(wait ≤ t) = 1 − e⁻⁰·¹ᵗ | In words |\n' +
        '|-----------|---------------------------|----------|\n' +
        '| 5 min | 1 − e⁻⁰·⁵ = 1 − 0.607 = **39%** | Only a 39% chance in the first 5 min |\n' +
        '| 10 min | 1 − e⁻¹ = 1 − 0.368 = **63%** | Even at the "average" time, 37% still waiting |\n' +
        '| 20 min | 1 − e⁻² = 1 − 0.135 = **86%** | Need twice the average for 86% confidence |\n' +
        '| 30 min | 1 − e⁻³ = 1 − 0.050 = **95%** | Three times the average for 95% |\n\n' +
        'Notice: even at the "average" waiting time (10 min), there is still a **37% chance** you are still waiting. That feels counterintuitive — but the distribution is skewed right (long tail).\n\n' +
        '**The memoryless property — the strangest fact:**\n\n' +
        '[diagram:MemorylessDiagram]\n\n' +
        'You have already waited 15 minutes. What is the probability of waiting 5 MORE minutes?\n\n' +
        '| Scenario | Probability of waiting > 5 min |\n' +
        '|----------|-------------------------------|\n' +
        '| Just arrived | e^(−0.1×5) = e^(−0.5) = **39%** |\n' +
        '| Already waited 15 min | e^(−0.1×5) = e^(−0.5) = **39%** |\n\n' +
        'Exactly the same! The bus does not "owe" you anything for your past wait. The exponential distribution is the ONLY continuous distribution with this property.',
      intermediateContent:
        '**From CDF to PDF — what "density" means:**\n\n' +
        'We already know the CDF: P(wait ≤ t) = 1 − e⁻λᵗ. The PDF is the slope of the CDF — it tells you how likely you are to get a bus at EXACTLY time t (per unit time).\n\n' +
        'Slope of CDF = derivative: f(t) = d/dt [1 − e⁻λᵗ] = λe⁻λᵗ\n\n' +
        'At t = 0: f(0) = λ = 0.1 per minute. Buses are most likely to arrive right away (the rate is highest at the start).\n' +
        'At t = 10: f(10) = 0.1 × e⁻¹ = 0.037 per minute. Still possible, but much less likely.\n' +
        'At t = 30: f(30) = 0.1 × e⁻³ = 0.005 per minute. Very unlikely you are still waiting.\n\n' +
        'The PDF drops off exponentially — hence the name.\n\n' +
        '**Mean and variance:**\n\n' +
        '- Mean waiting time = 1/λ. If λ = 0.1 buses/min, average wait = 10 min.\n' +
        '- Variance = 1/λ² = 100 min². Std dev = 1/λ = 10 min.\n' +
        '- Notice: the std dev equals the mean! This means the spread is as wide as the average — lots of variability.\n\n' +
        '**Proving memoryless — the algebra is one line:**\n\n' +
        'P(wait > 15+5 | already waited > 15) = P(wait > 20) / P(wait > 15) = e⁻²·⁰ / e⁻¹·⁵ = e⁻⁰·⁵ = P(wait > 5) ✓\n\n' +
        'The e⁻λˢ in the numerator and denominator partially cancel because e^(a+b) = e^a × e^b. This is the ONLY function where that cancellation works perfectly — which is why exponential is the ONLY memoryless continuous distribution.\n\n' +
        '**A practical consequence:** Two bus routes pass your stop. Route A comes every 10 min (λ₁ = 0.1), Route B every 15 min (λ₂ = 0.067). ' +
        'How long until ANY bus arrives? The combined rate is λ₁ + λ₂ = 0.167 per min, so you wait on average 1/0.167 = **6 minutes** — faster than either route alone.',
      advancedContent:
        '**Derivation from Poisson — step by step:**\n\n' +
        'T = time until first event. If events follow a Poisson process with rate λ:\n\n' +
        '1. P(T > t) = P(zero events in interval [0, t])\n' +
        '2. From Poisson: P(N(t) = 0) = (λt)⁰ × e⁻λᵗ / 0! = e⁻λᵗ\n' +
        '3. CDF: P(T ≤ t) = 1 − P(T > t) = 1 − e⁻λᵗ\n' +
        '4. Differentiate to get PDF: f(t) = d/dt [1 − e⁻λᵗ] = **λe⁻λᵗ** ∎\n\n' +
        '**Deriving the mean by integration:**\n\n' +
        'E[T] = ∫₀^∞ t × λe⁻λᵗ dt. Integrate by parts (u = t, dv = λe⁻λᵗdt):\n\n' +
        '= [−te⁻λᵗ]₀^∞ + ∫₀^∞ e⁻λᵗ dt = 0 + [−(1/λ)e⁻λᵗ]₀^∞ = **1/λ** ∎\n\n' +
        '**Proving the memoryless property:**\n\n' +
        'P(T > s+t | T > s) = P(T > s+t) / P(T > s) = e⁻λ⁽ˢ⁺ᵗ⁾ / e⁻λˢ = e⁻λᵗ = P(T > t) ∎\n\n' +
        'The exponential is the ONLY continuous distribution with this property. It follows directly from the exponent rule e^(a+b) = e^a × e^b.\n\n' +
        '**Maximum likelihood estimation — deriving the estimator:**\n\n' +
        'Given data t₁, t₂, ..., tₙ from Exp(λ):\n' +
        '1. Likelihood: L(λ) = Π λe⁻λtᵢ = λⁿ e⁻λΣtᵢ\n' +
        '2. Log-likelihood: l(λ) = n ln(λ) − λΣtᵢ\n' +
        '3. Set derivative to zero: dl/dλ = n/λ − Σtᵢ = 0\n' +
        '4. Solve: **λ̂ = n / Σtᵢ = 1/t̄** — the reciprocal of the sample mean ∎',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import numpy as np\n\n# Exponential distribution: waiting times\nlam = 0.1  # rate: 1 bus per 10 minutes\nmean_wait = 1 / lam\n\nprint(f"Rate: {lam} per minute")\nprint(f"Mean wait: {mean_wait} minutes")\nprint()\n\n# Probability of waiting at most t minutes\nfor t in [5, 10, 15, 20, 30]:\n    p = 1 - np.exp(-lam * t)\n    print(f"P(wait <= {t:>2} min) = {p:.1%}")\n\n# Simulate 1000 waits\nwaits = np.random.exponential(mean_wait, 1000)\nprint(f"\\nSimulated mean wait: {waits.mean():.1f} min")\nprint(f"Simulated std dev:   {waits.std():.1f} min")', title: 'Try it — Exponential' } },
      practice: practiceExponentialDistribution,
    },
    {
      title: 'Chi-Squared & Hypothesis Testing',
      beginnerContent:
        '[diagram:ChiSquaredDiagram]\n\n' +
        '**Is the difference real, or just random chance?**\n\n' +
        'You flip a coin 100 times and get 60 heads. Is the coin unfair, or did you just get lucky? A fair coin COULD give 60 heads — it is unlikely but not impossible. How do we decide?\n\n' +
        '**The idea: measure how far the results are from what we expected.**\n\n' +
        'If the coin is fair, we expect 50 heads and 50 tails. We got 60 heads and 40 tails. The differences are:\n\n' +
        '| | Observed | Expected | Difference |\n' +
        '|--|----------|----------|------------|\n' +
        '| Heads | 60 | 50 | +10 |\n' +
        '| Tails | 40 | 50 | −10 |\n\n' +
        'But how big is "10 off"? If we expected 50, being 10 off is a 20% deviation. If we expected 500, being 10 off is only 2%. ' +
        'The size of the discrepancy depends on what you expected.\n\n' +
        '**Building the χ² statistic step by step:**\n\n' +
        '[diagram:ChiSquaredStepsDiagram]\n\n' +
        'For each category: square the difference (to make negatives positive), then divide by expected (to scale by what was expected):\n\n' +
        '| | (Observed − Expected)² | ÷ Expected | Contribution |\n' +
        '|--|----------------------|------------|-------------|\n' +
        '| Heads | (60 − 50)² = 100 | ÷ 50 | **2.0** |\n' +
        '| Tails | (40 − 50)² = 100 | ÷ 50 | **2.0** |\n' +
        '| | | **Total χ²** | **4.0** |\n\n' +
        'The bigger χ² is, the more the data deviates from expectation.\n\n' +
        '**Is 4.0 big enough to conclude the coin is unfair?**\n\n' +
        'We compare χ² to a threshold. For this test (2 categories − 1 = 1 degree of freedom), the threshold at the 5% significance level is **3.84**.\n\n' +
        'Our χ² = 4.0 > 3.84 → the probability of getting this result from a fair coin is less than 5%. We reject the fair-coin hypothesis — this coin appears biased.\n\n' +
        'If we had gotten 55 heads: χ² = (55−50)²/50 + (45−50)²/50 = 0.5 + 0.5 = **1.0**. Since 1.0 < 3.84, we would NOT reject — 55 heads is well within the range of normal luck.',
      intermediateContent:
        '**Degrees of freedom — why "categories minus 1"?**\n\n' +
        'With 100 coin flips and 2 categories (heads, tails), if you know heads = 60, you automatically know tails = 40. ' +
        'Only ONE number is free to vary — the other is forced. So df = 2 − 1 = **1**.\n\n' +
        'With 4 blood types and 100 people: if you know A=30, B=20, C=25, then D must be 25. Three numbers are free, one is forced. df = 4 − 1 = **3**.\n\n' +
        '**More degrees of freedom → higher threshold.** A bigger χ² is needed to be "significant" because more categories naturally produce more variation.\n\n' +
        '| df | Critical value (α=0.05) |\n' +
        '|----|------------------------|\n' +
        '| 1 | 3.84 |\n' +
        '| 2 | 5.99 |\n' +
        '| 3 | 7.81 |\n' +
        '| 5 | 11.07 |\n' +
        '| 10 | 18.31 |\n\n' +
        '**Goodness-of-fit worked example: are blood types equally distributed?**\n\n' +
        'Test 100 people. If all four types are equally likely, expect 25 each.\n\n' +
        '| Type | Observed | Expected | (O−E)² | (O−E)²/E |\n' +
        '|------|----------|----------|--------|----------|\n' +
        '| A | 30 | 25 | 25 | 1.00 |\n' +
        '| B | 20 | 25 | 25 | 1.00 |\n' +
        '| AB | 25 | 25 | 0 | 0.00 |\n' +
        '| O | 25 | 25 | 0 | 0.00 |\n' +
        '| | | | **χ²** | **2.00** |\n\n' +
        'df = 4 − 1 = 3. Threshold = 7.81. Since 2.00 < 7.81 → **fail to reject**. The observed counts are consistent with equal distribution. ' +
        'The differences (30 vs 25, 20 vs 25) are small enough to be explained by random chance.\n\n' +
        '**Test of independence — is gender related to tea preference?**\n\n' +
        '| Gender | Chai | Green Tea | Coffee | Total |\n' +
        '|--------|------|-----------|--------|-------|\n' +
        '| Male | 40 | 15 | 25 | 80 |\n' +
        '| Female | 30 | 25 | 15 | 70 |\n' +
        '| Total | 70 | 40 | 40 | 150 |\n\n' +
        'If gender and preference are independent, the expected count for any cell = (row total × column total) / grand total.\n\n' +
        'Expected Male + Chai = (80 × 70) / 150 = **37.3**. But we observed 40. Is that difference meaningful?\n\n' +
        'Compute (O−E)²/E for all 6 data cells (not the totals) and sum them. Compare to the threshold for df = (rows−1) × (columns−1) = (2−1)(3−1) = 2. Threshold at α=0.05 is 5.99.',
      advancedContent:
        '**Where the chi-squared distribution comes from — built from normals:**\n\n' +
        'If Z ~ N(0,1), then Z² has a new distribution. What is it?\n\n' +
        '1. Z is symmetric around 0 → Z² is always positive\n' +
        '2. Small values of |Z| are common → Z² is right-skewed\n' +
        '3. This distribution is χ² with 1 degree of freedom\n\n' +
        'Add k independent copies: χ²ₖ = Z₁² + Z₂² + ... + Zₖ². The mean = k, variance = 2k.\n\n' +
        '**Why it appears in variance estimation:**\n\n' +
        'The sample variance s² = Σ(xᵢ − x̄)²/(n−1). Each (xᵢ − x̄)/σ is approximately standard normal, ' +
        'so Σ((xᵢ − x̄)/σ)² is a sum of squared normals → chi-squared. The mean x̄ "uses up" one degree of freedom, ' +
        'leaving n−1. Therefore (n−1)s²/σ² ~ χ²ₙ₋₁.\n\n' +
        '**This gives us a confidence interval for the variance:**\n\n' +
        'If sample s² = 16 with n = 25 (so df = 24):\n' +
        '- χ²₀.₀₂₅ = 39.36 (upper), χ²₀.₉₇₅ = 12.40 (lower) — from tables\n' +
        '- 95% CI for σ²: [(n−1)s²/χ²_upper, (n−1)s²/χ²_lower] = [24×16/39.36, 24×16/12.40] = [**9.76, 30.97**]\n\n' +
        '**The family of distributions built from chi-squared:**\n\n' +
        '| Distribution | Definition | Used for |\n' +
        '|---|---|---|\n' +
        '| **t(k)** | Z / √(χ²ₖ/k) | Small-sample means (n < 30). Wider tails than normal. |\n' +
        '| **F(m,n)** | (χ²ₘ/m) / (χ²ₙ/n) | Comparing two variances (ANOVA, regression overall F-test) |\n\n' +
        'The t-distribution with k → ∞ converges to the normal. This is why z-tests and t-tests give the same answer for large samples.',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import numpy as np\n\n# Chi-squared test: is this coin fair?\nobserved = [60, 40]  # 60 heads, 40 tails\nexpected = [50, 50]  # fair coin\n\nchi2 = sum((o - e)**2 / e for o, e in zip(observed, expected))\ndf = len(observed) - 1\n\nprint("Chi-squared goodness of fit")\nprint(f"Observed: {observed}")\nprint(f"Expected: {expected}")\nprint(f"Chi-squared = {chi2:.2f}")\nprint(f"Degrees of freedom = {df}")\nprint()\n\n# Critical values (alpha = 0.05)\ncritical = {1: 3.84, 2: 5.99, 3: 7.81, 4: 9.49}\ncv = critical.get(df, 3.84)\nprint(f"Critical value (df={df}, alpha=0.05) = {cv}")\nprint(f"Result: {\"REJECT H0 - significant!\" if chi2 > cv else \"Fail to reject H0\"}")', title: 'Try it — Chi-Squared' } },
      practice: practiceChiSquared,
    },
  ],
};
