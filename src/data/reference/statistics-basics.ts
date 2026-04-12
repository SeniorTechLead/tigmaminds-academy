import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'statistics-basics',
  title: 'Statistical Thinking',
  category: 'data-science',
  icon: '📐',
  tagline: 'Sampling, confidence intervals, p-values, and the replication crisis — thinking critically about data.',
  relatedStories: ['girl-who-spoke-to-elephants', 'why-the-muga-silk-is-golden', 'boy-who-talked-to-clouds', 'dancing-deer-of-loktak-lake'],

  understand: [
    {
      title: 'What Statistics Does',
      beginnerContent:
        'Statistics is the art of finding patterns in messy data. Imagine you measure the height ' +
        'of every student in your class. Just looking at 30 numbers is overwhelming. Statistics ' +
        'gives you tools to summarize those numbers into a few meaningful values: the average ' +
        'height, how spread out the values are, and whether there is a real difference between ' +
        'groups. Scientists use statistics to decide if a medicine works. Sports analysts use it ' +
        'to compare players. Weather forecasters use it to predict tomorrow\'s temperature. ' +
        'Whenever you have data and want answers, statistics is the toolkit.',
      intermediateContent:
        'Descriptive statistics: **center** (mean, median, mode) and **spread** (range, IQR, variance, std dev). For elephant weights [3200, 3800, 4500, 4800, 5100]: mean = 4280, median = 4500, range = 1900, IQR = 1000, σ ≈ 716. The median is more robust to outliers — adding a 10,000 kg outlier shifts mean to 5233 but median only to 4650. **Correlation** (r = -1 to +1) measures linear association but NOT causation: ice cream sales and drownings both rise in summer, but ice cream doesn\'t cause drowning.',
      advancedContent:
        '**The Central Limit Theorem (CLT) — why it works:**\n\n' +
        'Take ANY population (skewed, bimodal, uniform — it does not matter). Draw samples of size n and compute each sample\'s mean. ' +
        'As n grows, those sample means form a normal distribution centered on the true population mean μ, with standard error SE = σ/√n.\n\n' +
        '**Worked example:** Elephant weights in Kaziranga are right-skewed (many small juveniles, few large bulls), with μ = 3200 kg, σ = 1400 kg. ' +
        'You weigh n = 49 randomly chosen elephants. The sampling distribution of the mean has SE = 1400/√49 = 200 kg. ' +
        'A 95% confidence interval: x̄ ± 1.96 × 200 = x̄ ± 392 kg. If your sample mean is 3350, the interval is [2958, 3742] — ' +
        'you are 95% confident the true population mean lies in this range.\n\n' +
        '**What a p-value actually means:** Suppose you test whether a new elephant diet increases weight. Null hypothesis H₀: no effect (mean difference = 0). ' +
        'You measure a mean increase of 150 kg. The p-value = P(seeing ≥150 kg increase | H₀ is true). If p = 0.03, that means: ' +
        'IF the diet has zero effect, there is only a 3% chance of seeing this large a difference by random sampling alone. ' +
        'It does NOT mean "3% chance the diet doesn\'t work."\n\n' +
        '**The replication crisis:** In 2015, the Open Science Collaboration tried to reproduce 100 published psychology studies. Only 36% replicated. ' +
        'Root causes: small sample sizes (low statistical power), p-hacking (testing many hypotheses and reporting only the significant one), ' +
        'publication bias (journals only publish positive results). Fixes: pre-registration (declare your hypothesis before collecting data), ' +
        'report effect sizes (HOW BIG is the difference, not just "is it nonzero"), and use confidence intervals alongside p-values.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Statistics can only be used by scientists and mathematicians.', answer: false, explanation: 'Anyone who works with data uses statistics: sports analysts, weather forecasters, doctors, marketers, and students.' },
            { text: 'Statistics helps you find patterns and make decisions from messy, real-world data.', answer: true, explanation: 'That is the core purpose of statistics — summarize data, detect patterns, and support evidence-based decisions.' },
          ],
        },
      },
    },
    {
      title: 'Mean, Median, and Mode',
      beginnerContent:
        'These three values each try to answer "what is a typical value?" but in different ways. ' +
        'The *mean* (average) adds everything up and divides by the count. For scores 70, 80, 80, ' +
        '90, 100, the mean is (70+80+80+90+100)/5 = 84. The *median* is the middle value when you ' +
        'sort the numbers — here it\'s 80. The *mode* is the most frequent value — also 80. ' +
        'Why have three? Because they disagree when data is lopsided. If one student scored 500 ' +
        '(maybe a different grading system), the mean would jump to 166, but the median would stay ' +
        'at 80. The median resists extreme values, which makes it more useful for things like ' +
        'household income where a few billionaires would skew the mean.',
      intermediateContent:
        'Weighted mean accounts for unequal importance: if three exams are weighted 20%, 30%, 50% with scores 75, 80, 90: weighted mean = 0.20(75) + 0.30(80) + 0.50(90) = 15 + 24 + 45 = **84** (vs simple mean of 81.7). The geometric mean is appropriate for multiplicative quantities: investment returns of +20%, −10%, +15% over 3 years → geometric mean = (1.20 × 0.90 × 1.15)^(1/3) − 1 = (1.242)^(1/3) − 1 ≈ **7.5%** per year. The harmonic mean applies to rates: driving 60 km at 40 km/h and 60 km at 60 km/h → harmonic mean speed = 2/(1/40 + 1/60) = **48 km/h** (not 50).',
      advancedContent:
        '**Z-scores — standardizing any distribution:**\n\n' +
        'A z-score tells you how many standard deviations a value is from the mean: **z = (x − μ) / σ**. ' +
        'This converts ANY normal distribution to the standard normal (μ=0, σ=1), so you can use one universal table.\n\n' +
        '**Step-by-step:** Elephant weights: μ = 4280 kg, σ = 716 kg. An elephant weighs 5700 kg.\n' +
        '1. z = (5700 − 4280) / 716 = 1420 / 716 = **1.98**\n' +
        '2. From the z-table: P(Z < 1.98) = 0.9761\n' +
        '3. Interpretation: this elephant is heavier than **97.6%** of the population\n\n' +
        '**The 68-95-99.7 rule (empirical rule):**\n' +
        '| Range | % of data | Elephant weights (μ=4280, σ=716) |\n' +
        '|---|---|---|\n' +
        '| μ ± 1σ | ~68% | 3564 – 4996 kg |\n' +
        '| μ ± 2σ | ~95% | 2848 – 5712 kg |\n' +
        '| μ ± 3σ | ~99.7% | 2132 – 6428 kg |\n\n' +
        'An elephant below 2132 kg or above 6428 kg is a 1-in-370 event — investigate (calf? measurement error?).\n\n' +
        '**When the normal model fails:** Income, city populations, and earthquake magnitudes are right-skewed — the mean is pulled ' +
        'higher than the median by extreme values. For these, either use median + IQR (non-parametric), or log-transform the data ' +
        '(log-income IS approximately normal) and apply z-scores to the transformed values.',
      diagram: 'MeanMedianModeDiagram',
    },
    {
      title: 'Standard Deviation — How Spread Out?',
      beginnerContent:
        'Knowing the average is not enough. Two classes can have the same average score of 80, ' +
        'but one class might have everyone between 75 and 85, while the other has scores from 40 ' +
        'to 100. Standard deviation (SD) measures this spread. A small SD means values cluster ' +
        'tightly around the mean. A large SD means they are scattered. Think of throwing darts: ' +
        'a small SD means all darts land near the bullseye; a large SD means they are all over ' +
        'the board. In the first class (75-85), SD might be about 3. In the second (40-100), ' +
        'SD might be 20. This single number tells you how much variation to expect.',
      intermediateContent:
        'Variance = average of squared deviations from the mean: σ² = Σ(xᵢ - x̄)² / n. Standard deviation σ = √(variance) — in the same units as the data. For weights [3200, 3800, 4500, 4800, 5100], mean = 4280: deviations = [-1080, -480, 220, 520, 820], squared = [1166400, 230400, 48400, 270400, 672400], mean of squares = 477600, σ = √477600 ≈ **691 kg**. Small σ means data clusters tightly around the mean; large σ means wide spread. Rule of thumb: ~68% of data falls within ±1σ of the mean for normal distributions.',
      advancedContent:
        '**Bessel\'s correction — why divide by n-1:**\n\n' +
        'When you compute variance from a sample, you already used the sample to estimate the mean x̄. That "uses up" one degree of freedom — ' +
        'the deviations from x̄ are constrained (they must sum to zero). Dividing by n would systematically underestimate the true population variance. ' +
        'Dividing by n-1 corrects this bias.\n\n' +
        '**Worked example:** Population [2, 4, 6, 8, 10] has μ = 6, σ² = Σ(xᵢ-6)²/5 = 8.0. ' +
        'Take sample [2, 6, 10]: x̄ = 6, Σ(xᵢ-6)² = 32. Biased: 32/3 = 10.67. Corrected: 32/2 = **16.0**. ' +
        'The corrected value (s² = 16.0) overshoots this particular sample, but on average across all possible samples of size 3, ' +
        's² = Σ(xᵢ-x̄)²/(n-1) gives exactly σ² = 8.0. That is what "unbiased" means.\n\n' +
        '**Coefficient of variation (CV)** — comparing apples to elephants:\n' +
        'CV = (σ/μ) × 100% normalizes spread by the mean. Elephant weights: σ=700 kg, μ=4300 kg → CV = 16%. ' +
        'Mouse weights: σ=3 g, μ=25 g → CV = 12%. Despite 700 kg vs 3 g variation, mice are relatively MORE consistent.\n\n' +
        '**Chebyshev\'s inequality** — works for ANY distribution:\n' +
        'At least (1 - 1/k²) of data falls within k standard deviations of the mean. ' +
        'At k=2: ≥ 75%. At k=3: ≥ 89%. At k=10: ≥ 99%. ' +
        'Unlike the 68-95-99.7 rule (which requires normality), Chebyshev holds for skewed, multimodal, or any distribution whatsoever. ' +
        'This is why quality control\'s Six Sigma (k=6, ≥ 97.2%) is meaningful even when the process distribution is unknown.',
      diagram: 'StdDevDiagram',
    },
    {
      title: 'Histograms — Seeing the Shape of Data',
      beginnerContent:
        'A histogram groups numbers into bins (ranges) and shows how many values fall into each bin. ' +
        'Imagine sorting 100 exam scores into bins: 0-10, 10-20, ..., 90-100. Then you draw a bar ' +
        'for each bin, where the bar height equals the count. The shape tells a story: a bell shape ' +
        'means most values are near the middle; a shape skewed to the left means most students scored ' +
        'high with a few low outliers; two peaks might mean two distinct groups. Histograms are the ' +
        'first chart a data scientist makes because they reveal the distribution — the overall ' +
        'pattern of where values tend to land.',
      intermediateContent:
        'A histogram groups data into bins (ranges) and counts how many values fall in each bin. More bins = more detail but noisier; fewer bins = smoother but lose detail. Sturges\' rule: bins ≈ 1 + 3.322 × log₂(n). For n=100: ~8 bins. Distribution shapes: **symmetric** (bell-shaped normal), **right-skewed** (long tail to the right — income, house prices), **left-skewed** (long tail to the left — age at death in developed countries), **bimodal** (two peaks — mixed populations). Always check the histogram before computing mean/std — a bimodal distribution\'s mean falls between the peaks where few data points actually exist.',
      advancedContent:
        '**Kernel Density Estimation (KDE) — replacing histograms with smooth curves:**\n\n' +
        'A histogram\'s shape depends on arbitrary choices: bin width and bin edges. Shift the bins by half a width and the shape changes. ' +
        'KDE eliminates this by placing a small bell curve (kernel) at each data point, then summing them all.\n\n' +
        '**How it works:** For n data points x₁…xₙ, the density estimate at any point x is:\n' +
        'f̂(x) = (1/nh) Σ K((x − xᵢ)/h), where K is the kernel function (usually Gaussian) and h is the **bandwidth**.\n\n' +
        '**Bandwidth h controls everything:**\n' +
        '- h too small → every data point creates its own spike (overfitting, noisy)\n' +
        '- h too large → real features (bimodality, skewness) get smoothed away\n' +
        '- Silverman\'s rule of thumb: h ≈ 1.06 × σ × n^(-1/5) — good starting point for normal-ish data\n\n' +
        '**Q-Q plots — testing normality visually:**\n' +
        'Sort your n data values. For each, compute the theoretical quantile: where WOULD the kth-smallest value be if the data were perfectly normal? ' +
        'Plot observed vs theoretical. A straight diagonal line = normal distribution. Deviations tell you exactly what is wrong:\n' +
        '- S-curve bending up at both ends → **heavy tails** (more extreme values than normal)\n' +
        '- Curve below the line at the right → **right skew** (long tail to the right)\n' +
        '- Staircase pattern → **discrete data** (few unique values)\n' +
        '- Single point far from the line → **outlier**\n\n' +
        'A Q-Q plot is more informative than any normality test (Shapiro-Wilk, Anderson-Darling) because it shows WHERE the distribution deviates, not just whether it does.',
      diagram: 'HistogramDiagram',
    },
    {
      title: 'Outliers — The Odd Ones Out',
      beginnerContent:
        'An outlier is a value that is far from the rest. In heights of 12-year-olds ' +
        '(130-160 cm), a value of 195 cm is suspicious — maybe it was measured wrong, or maybe ' +
        'that student is exceptionally tall. Outliers matter because they can distort your mean ' +
        'and make your conclusions wrong. A common rule: if a value is more than 1.5 times the ' +
        'interquartile range (IQR) beyond the quartiles, flag it as a potential outlier. Always ' +
        'investigate outliers before removing them — sometimes the outlier is the most interesting ' +
        'data point (like discovering a new species).',
      intermediateContent:
        'An outlier is a data point far from the others. Detection methods: **IQR method** — compute Q1 (25th percentile), Q3 (75th), IQR = Q3 - Q1. Points below Q1 - 1.5×IQR or above Q3 + 1.5×IQR are outliers. For elephant weights: Q1=3800, Q3=4800, IQR=1000. Outlier thresholds: below 2300 or above 6300. **Z-score method**: |z| > 3 (more than 3 standard deviations from mean) flags outliers. Always investigate before removing — outliers might be errors (sensor malfunction) or genuine discoveries (unusually large elephant).',
      advancedContent:
        '**Robust statistics — measures that resist outliers:**\n\n' +
        '| Fragile measure | Robust alternative | How it works |\n' +
        '|---|---|---|\n' +
        '| Mean | **Trimmed mean** | Discard top/bottom 5-25% of data, then average the rest |\n' +
        '| Standard deviation | **MAD** (Median Absolute Deviation) | median(|xᵢ − median(x)|) × 1.4826 |\n' +
        '| Mean | **Winsorized mean** | Replace extremes with boundary values instead of discarding |\n\n' +
        '**Worked example (MAD):** Data: [12, 14, 13, 15, 14, 100, 13, 11]. Median = 13.5. ' +
        'Absolute deviations from median: [1.5, 0.5, 0.5, 1.5, 0.5, 86.5, 0.5, 2.5]. ' +
        'MAD = median of deviations = 1.0. Scaled MAD = 1.0 × 1.4826 = **1.48**. ' +
        'Compare to SD = 29.6 — the outlier (100) inflated SD by 20×, but MAD barely noticed.\n\n' +
        '**Mahalanobis distance — catching multivariate outliers:**\n' +
        'A student with height 175 cm is normal. Weight 90 kg is normal. But 175 cm AND 90 kg might be unusual IF those two variables are correlated. ' +
        'Mahalanobis distance accounts for correlations: D² = (x - μ)ᵀ Σ⁻¹ (x - μ), where Σ is the covariance matrix. ' +
        'Points with D² exceeding the chi-squared critical value (df = number of variables) are multivariate outliers. ' +
        'This is the foundation of Isolation Forest and Local Outlier Factor in ML-based fraud detection — ' +
        'fraudulent transactions look normal on each feature alone but are unusual in combination.',
      diagram: 'StdDevDiagram',
    },
    {
      title: 'Sampling — You Can\'t Measure Everyone',
      beginnerContent:
        'If you want to know the average height of all 14-year-olds in India, you cannot measure ' +
        'every single one. Instead, you pick a *sample* — say, 1,000 students from different ' +
        'regions — and measure them. If your sample is chosen fairly (random sampling), the ' +
        'statistics you calculate from it will be close to the true values for the whole population. ' +
        'Bigger samples give more reliable estimates. This is why election polls survey a few ' +
        'thousand people and can still predict results for millions of voters.',
      intermediateContent:
        'Sampling methods: **random sampling** gives every member an equal chance. **Stratified sampling** divides into subgroups and samples each proportionally. **Systematic sampling** selects every kth member. Margin of error for proportions: MoE ≈ 1/√n for 95% confidence. A poll of n=1000 has MoE ≈ ±3.2%. To halve the margin, quadruple the sample. **Convenience sampling** (surveying whoever is easiest to reach) introduces bias. **Cluster sampling** randomly selects groups (villages, schools) then surveys everyone within — practical when populations are geographically dispersed.',
      advancedContent:
        '**Statistical power — the probability of detecting a real effect:**\n\n' +
        'You design an experiment to test whether a new teaching method improves test scores. Power = P(correctly rejecting H₀ when the effect is real) = 1 − β.\n\n' +
        '**The four knobs of power:**\n' +
        '| Factor | Increase it → power… | Practical implication |\n' +
        '|---|---|---|\n' +
        '| Sample size n | Goes up | More students in your study |\n' +
        '| Effect size d | Goes up | The method truly makes a big difference |\n' +
        '| Significance level α | Goes up | Accept more false positives (risky) |\n' +
        '| Variability σ | Goes DOWN | Less noise in measurements |\n\n' +
        '**Rule of thumb:** For α = 0.05, 80% power, and a "medium" effect (d = 0.5), you need n ≈ 64 per group. ' +
        'Most published studies use n = 20-30 — grossly underpowered. An underpowered study that finds p < 0.05 likely ' +
        'overestimates the true effect size (winner\'s curse).\n\n' +
        '**Bootstrap resampling — confidence intervals without assumptions:**\n' +
        'You have data: [23, 45, 67, 12, 89, 34, 56]. You want a confidence interval for the median but don\'t know the population distribution.\n' +
        '1. Resample WITH replacement: draw 7 values randomly from your data (e.g., [45, 12, 89, 89, 34, 23, 45])\n' +
        '2. Compute the median of this resample: 45\n' +
        '3. Repeat 10,000 times, collecting 10,000 medians\n' +
        '4. Sort them. The 250th and 9750th values give the 95% confidence interval\n\n' +
        'No assumptions about normality. Works for ANY statistic (median, trimmed mean, ratio, correlation). ' +
        'This is why bootstrap is the default tool in modern data science when theoretical distributions are unknown.\n\n' +
        '**Survivorship bias:** Studying only successful startups (the "survivors") overestimates the importance of their strategies. ' +
        'The 1936 Literary Digest poll predicted Landon over Roosevelt by surveying telephone/car owners — a biased sample that missed lower-income voters who overwhelmingly supported Roosevelt.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A random sample of 1,000 people can give a reliable estimate for a population of millions.', answer: true, explanation: 'If the sample is chosen randomly, the law of large numbers ensures the sample statistics will approximate the population parameters.' },
            { text: 'A bigger sample always guarantees a perfectly accurate result.', answer: false, explanation: 'Bigger samples improve reliability but never guarantee perfection. Bias in how you select the sample matters more than size.' },
          ],
        },
      },
    },
    {
      title: 'Correlation — When Two Things Move Together',
      beginnerContent:
        'Correlation measures whether two variables increase or decrease together. It ranges from ' +
        '-1 to +1. A correlation of +1 means they move perfectly together (more study hours = ' +
        'higher scores). A correlation of -1 means one goes up as the other goes down (more ' +
        'screen time = lower sleep hours). A correlation near 0 means no relationship. The critical ' +
        'warning: correlation does not mean causation. Ice cream sales and drowning deaths both ' +
        'increase in summer, but ice cream does not cause drowning — hot weather causes both.',
      intermediateContent:
        'Pearson r measures linear association: r = +1 (perfect positive line), 0 (no linear pattern), -1 (perfect negative). Compute from paired data: r = Σ[(xᵢ-x̄)(yᵢ-ȳ)] / √[Σ(xᵢ-x̄)² × Σ(yᵢ-ȳ)²]. **Correlation ≠ causation**: ice cream sales and drowning deaths correlate (confounding variable: temperature). r² (coefficient of determination) tells you what fraction of variation in y is explained by x: r = 0.9 means r² = 0.81, so 81% of the variation is explained. Always visualize with a scatter plot — non-linear relationships, outliers, and clusters can hide behind a single number.',
      advancedContent:
        '**Spearman rank correlation — when the relationship is monotonic but not linear:**\n\n' +
        'Pearson r only catches linear relationships. If study hours vs score follows a curve (diminishing returns), ' +
        'Pearson r might be 0.7 even though the relationship is nearly perfect. Spearman replaces each value with its rank, ' +
        'then computes Pearson r on the ranks.\n\n' +
        '**Worked example:** Study hours: [1, 2, 3, 4, 5]. Scores: [50, 70, 82, 88, 90]. The relationship curves (diminishing returns). ' +
        'Pearson r = 0.96. Spearman rₛ = 1.0 (perfect monotonic — every rank increase in hours gives a rank increase in score). ' +
        'Spearman correctly identifies the perfect monotonic relationship that Pearson underestimates.\n\n' +
        '**Partial correlation — unmasking confounders:**\n' +
        'Ice cream sales and drowning deaths correlate at r = 0.85. But both are caused by hot weather. ' +
        'Partial correlation controls for temperature: r(ice cream, drowning | temperature) ≈ 0.02. ' +
        'The formula: r₁₂.₃ = (r₁₂ − r₁₃ × r₂₃) / √((1−r₁₃²)(1−r₂₃²)). ' +
        'If r(ice cream, temp) = 0.90 and r(drowning, temp) = 0.88: ' +
        'r₁₂.₃ = (0.85 − 0.90 × 0.88) / √((1−0.81)(1−0.77)) = (0.85 − 0.792) / √(0.19 × 0.23) = 0.058 / 0.209 ≈ **0.28** — ' +
        'the apparent strong correlation nearly vanishes once temperature is controlled.\n\n' +
        '**Multiple regression** extends this to many variables simultaneously: ' +
        'y = b₀ + b₁x₁ + b₂x₂ + … Each coefficient bᵢ represents the effect of xᵢ AFTER controlling for all other variables. ' +
        'This is the workhorse of observational science — when you cannot run experiments, regression is the next best tool for disentangling causes.',
      diagram: 'CorrelationDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the statistics term to its meaning',
          pairs: [
            ['Mean', 'The sum of all values divided by the count'],
            ['Median', 'The middle value when data is sorted'],
            ['Standard deviation', 'A measure of how spread out values are'],
            ['Outlier', 'A data point far from the rest'],
            ['Correlation', 'How strongly two variables move together (-1 to +1)'],
            ['Sample', 'A subset chosen to represent a larger population'],
          ],
        },
      },
    },
    {
      title: 'Contour Plots — Reading 3D Data on a Flat Page',
      beginnerContent:
        'A contour plot is a top-down view of a 3D surface — exactly like a topographic hiking map. ' +
        'If you can read elevation lines on a trail map, you already know how to read a statistical ' +
        'contour plot. Close-together lines mean a steep slope (values change rapidly). Far-apart ' +
        'lines mean a gentle slope. In statistics, the "mountain" is a probability distribution: ' +
        'the peak is where data is most likely, the edges are where data is rare. When two variables ' +
        'are correlated, the contour circles stretch into tilted ellipses — the tilt IS the correlation.',
      intermediateContent:
        'A contour line connects all points at the same value of a function f(x,y). For a bivariate Gaussian, contour lines are ellipses defined by (x-μ)ᵀΣ⁻¹(x-μ) = c for constant c. The **eigenvalues** of the covariance matrix Σ determine the lengths of the ellipse axes, and the **eigenvectors** determine the tilt angle. When ρ=0, the eigenvalues are σₓ² and σᵧ² and the axes are aligned with x and y. When ρ≠0, the major axis tilts at angle θ = ½ arctan(2ρσₓσᵧ/(σₓ²-σᵧ²)). The Mahalanobis distance from the center to any contour line determines the probability enclosed within that contour.',
      advancedContent:
        '**Gaussian Mixture Models (GMMs) — when one bell curve isn\'t enough:**\n\n' +
        'Real data often has multiple clusters. Heights of "all adults" is bimodal (male and female peaks). ' +
        'A GMM models this as a weighted sum of K Gaussians: p(x) = Σ wₖ × N(x | μₖ, Σₖ), where each component has its own mean, covariance, and weight wₖ (with Σwₖ = 1).\n\n' +
        '**The EM algorithm finds the components:**\n' +
        '1. **E-step:** For each data point, compute the probability it belongs to each cluster (soft assignment)\n' +
        '2. **M-step:** Update each cluster\'s mean, covariance, and weight using those probabilities\n' +
        '3. Repeat until convergence. Each iteration increases the likelihood — guaranteed.\n\n' +
        '**Reading the contour plot:** Each Gaussian component produces elliptical contours. ' +
        'Overlapping ellipses show where clusters blend. The contour where two components\' densities are equal is the decision boundary.\n\n' +
        '**Bayesian credible regions on contour plots:**\n' +
        'When estimating two parameters (e.g., mean μ and variance σ² of elephant weights), the posterior distribution ' +
        'is a 2D surface. The 95% credible region — the smallest contour enclosing 95% of the posterior mass — is the Bayesian analog of a confidence region. ' +
        'Unlike frequentist confidence regions, the Bayesian credible region has a direct probability interpretation: ' +
        '"there is a 95% probability the true parameters lie inside this ellipse."',
      interactive: { type: 'contour-explainer' as const, props: {} },
    },
    {
      title: 'Dose-Response Curves',
      diagram: 'DoseResponseDiagram',
      beginnerContent:
        'How much medicine do you need before it actually works? Give too little and nothing happens. ' +
        'Give too much and you get dangerous side effects. Somewhere in between is the sweet spot. A ' +
        'dose-response curve maps this relationship on a graph: the x-axis shows the dose (how much ' +
        'drug you give) and the y-axis shows the response (how strong the effect is).\n\n' +
        'Most dose-response curves have a characteristic S-shape called a *sigmoidal curve*. At low ' +
        'doses the curve is flat — the drug has little effect. Then there is a steep rise where small ' +
        'increases in dose produce large increases in effect. Finally the curve flattens again at high ' +
        'doses — the receptors are saturated and more drug does not help. The dose that produces 50% ' +
        'of the maximum effect is called the EC50 (half-maximal effective concentration). A lower EC50 ' +
        'means the drug is more potent.\n\n' +
        'In microbiology, the Minimum Inhibitory Concentration (MIC) is the lowest dose that stops ' +
        'bacteria from growing. The *therapeutic window* is the range between the dose that works and ' +
        'the dose that becomes toxic. A wide therapeutic window means the drug is safer; a narrow one ' +
        'means doctors must dose very carefully. Understanding these curves is essential for pharmacology, ' +
        'toxicology, and even pesticide science.',
      intermediateContent:
        'The standard sigmoidal model is the Hill equation: E = Emax × Dⁿ / (EC50ⁿ + Dⁿ), where E is ' +
        'effect, D is dose, Emax is maximum effect, EC50 is the half-maximal dose, and n is the Hill ' +
        'coefficient controlling steepness. When n=1 the curve is a standard hyperbola (Michaelis-Menten ' +
        'kinetics). When n>1 the curve is steeper, indicating cooperative binding — one molecule binding ' +
        'makes the next more likely. The **therapeutic index** = TD50/ED50 (toxic dose / effective dose). ' +
        'Drugs like warfarin have a narrow therapeutic index (~2), while penicillin\'s is very wide (~100). ' +
        'Log-dose plots spread out the low-dose region, making EC50 easier to read visually.',
      advancedContent:
        '**The 4-parameter logistic (4PL) model — fitting real dose-response data:**\n\n' +
        'E = bottom + (top − bottom) / (1 + (EC50/D)ⁿ)\n\n' +
        '| Parameter | What it controls | Example value |\n' +
        '|---|---|---|\n' +
        '| bottom | Baseline response (no drug) | 5% cell survival |\n' +
        '| top | Maximum response (saturating dose) | 95% cell survival |\n' +
        '| EC50 | Dose for half-maximal effect | 0.3 μg/mL |\n' +
        '| n (Hill coefficient) | Steepness of the curve | n=1 (gradual), n=4 (switch-like) |\n\n' +
        '**Fitting the curve:** Nonlinear least squares (Levenberg-Marquardt algorithm) minimizes Σ(observed − predicted)². ' +
        'You supply data points (dose, response) and initial guesses for the 4 parameters. The algorithm iteratively adjusts them. ' +
        'R² > 0.95 indicates a good fit. If the residuals show a pattern, the 4PL model may be wrong.\n\n' +
        '**Drug combinations — synergy or antagonism?**\n' +
        'The Bliss independence model predicts the expected combined effect if two drugs act independently: ' +
        'E_AB = E_A + E_B − E_A × E_B. Worked example: Drug A kills 40% of cells. Drug B kills 30%. ' +
        'Expected combined (independent): 0.4 + 0.3 − 0.4×0.3 = **58%**. ' +
        'If the actual combined effect is 80% → **synergy** (the drugs help each other). ' +
        'If it is 45% → **antagonism** (they interfere). ' +
        'The isobologram plots dose pairs that achieve a fixed effect (e.g., 50% kill): concave = synergy, convex = antagonism, straight line = independence.',
    },
    {
      title: 'Monte Carlo Simulation',
      beginnerContent:
        'Imagine you want to know the probability of winning a board game, but the rules are too ' +
        'complicated to calculate mathematically. What if you just played the game 10,000 times and ' +
        'counted how often you won? That is the core idea behind **Monte Carlo simulation** — using ' +
        'random sampling to estimate answers that are too complex for exact calculation.\n\n' +
        'The method is named after the Monte Carlo casino in Monaco, because it relies on randomness ' +
        'just like gambling does. Here is how it works: you build a simple model of the situation, then ' +
        'run it thousands or millions of times with **random inputs** drawn from realistic distributions. ' +
        'Each run is called a **trial** or **iteration**. After all trials, you look at the distribution ' +
        'of results to estimate probabilities, averages, and ranges.\n\n' +
        'A classic example: estimating the value of **pi**. Draw a square with a quarter-circle inside ' +
        'it. Randomly throw darts at the square. The fraction that land inside the quarter-circle is ' +
        'approximately π/4. Throw 10 darts and your estimate is rough. Throw 1,000,000 and it converges ' +
        'to 3.14159. The more trials you run, the more **confident** you can be in the answer.\n\n' +
        'Monte Carlo is used everywhere: predicting weather, pricing stock options, planning traffic ' +
        'flow, simulating nuclear reactions, and designing bridges. Whenever the real system is too ' +
        'complex for a neat formula, scientists let randomness do the heavy lifting.',
      intermediateContent:
        'A Monte Carlo estimate of a quantity θ uses N random samples x₁…xₙ to compute θ̂ = (1/N)Σf(xᵢ). ' +
        'The **standard error** of the estimate is σ/√N, where σ is the standard deviation of f(x). ' +
        'Halving the error requires 4× as many samples. For the pi estimation: generate N points (x,y) ' +
        'uniformly in [0,1]². Count hits where x²+y² ≤ 1. Then π ≈ 4 × hits/N. With N = 10⁶, the ' +
        'standard error is about 0.002. **Variance reduction** techniques — importance sampling, ' +
        'stratified sampling, antithetic variates — can dramatically reduce the number of samples ' +
        'needed for a given accuracy. In finance, the Black-Scholes model prices options analytically, ' +
        'but Monte Carlo handles path-dependent options (Asian, barrier) where no closed-form exists.',
      advancedContent:
        '**MCMC — Markov Chain Monte Carlo, step by step:**\n\n' +
        'Problem: You need to sample from a complex probability distribution p(x) that you can evaluate but can\'t directly sample from ' +
        '(e.g., a Bayesian posterior with 50 parameters).\n\n' +
        '**Metropolis-Hastings algorithm:**\n' +
        '1. Start at some position x₀\n' +
        '2. Propose a random step: x* = x₀ + noise (e.g., Gaussian noise)\n' +
        '3. Compute acceptance ratio: α = p(x*) / p(x₀)\n' +
        '4. If α ≥ 1: ACCEPT (move to x*) — we moved to a higher-probability region\n' +
        '5. If α < 1: Accept with probability α (flip a biased coin). Otherwise STAY at x₀\n' +
        '6. Repeat thousands of times. The visited positions form samples from p(x)\n\n' +
        '**Why this works:** Steps 4-5 ensure the chain spends more time in high-probability regions ' +
        '(it always accepts uphill moves, sometimes accepts downhill). Over time, the histogram of visited positions converges to p(x).\n\n' +
        '**Convergence diagnostics:**\n' +
        '- **Burn-in:** Discard the first ~1000 samples (the chain hasn\'t found the high-probability region yet)\n' +
        '- **Gelman-Rubin R̂:** Run multiple chains from different starting points. If they all converge to the same distribution, R̂ ≈ 1.0. If R̂ > 1.1, the chains haven\'t mixed — run longer\n' +
        '- **Effective sample size:** Consecutive MCMC samples are correlated (each step is small). 10,000 samples might contain only ~500 effectively independent samples\n\n' +
        '**The curse of dimensionality:** In 100 dimensions, a grid with 10 points per dimension needs 10¹⁰⁰ evaluations. ' +
        'Monte Carlo needs only O(1/ε²) samples regardless of dimension — this is why MCMC is the standard tool for Bayesian inference ' +
        'in climate models (millions of parameters), genomics (thousands of genes), and astrophysics (galaxy formation models).',
    },
    {
      title: 'Bayesian Inference',
      beginnerContent:
        'Suppose a friend tells you they saw a tiger in Assam. How much should you believe them? ' +
        'It depends on what you already knew. If they were visiting Kaziranga National Park, tigers ' +
        'are common — you would believe them easily. If they said they saw a tiger in Guwahati city ' +
        'centre, you would be much more skeptical. **Bayesian inference** is a mathematical framework ' +
        'for updating your beliefs when you receive new evidence.\n\n' +
        'The process has three parts. First, your **prior** — what you believed before seeing any ' +
        'new data. This captures your existing knowledge or assumptions. Second, the **likelihood** — ' +
        'how probable the new evidence would be if your belief were true. Third, the **posterior** — ' +
        'your updated belief after combining the prior with the evidence.\n\n' +
        'The magic formula is **Bayes\' theorem**: P(hypothesis | data) = P(data | hypothesis) × ' +
        'P(hypothesis) / P(data). In words: the probability of your hypothesis given the data equals ' +
        'the probability of the data given your hypothesis, times your prior belief, divided by the ' +
        'overall probability of the data.\n\n' +
        'Example: A medical test is 99% accurate. You test positive for a rare disease that affects ' +
        '1 in 10,000 people. What is the probability you actually have the disease? Most people guess ' +
        '99%, but Bayes\' theorem shows it is only about 1%. The prior (the disease is extremely rare) ' +
        'overwhelms the likelihood (the test is accurate). This is why doctors order confirmatory tests.',
      intermediateContent:
        'Bayes\' theorem: **P(H|D) = P(D|H) × P(H) / P(D)**. For the medical test: P(H) = 0.0001 ' +
        '(prior — disease prevalence). P(D|H) = 0.99 (sensitivity — true positive rate). P(D|¬H) = ' +
        '0.01 (false positive rate). P(D) = P(D|H)P(H) + P(D|¬H)P(¬H) = 0.99×0.0001 + 0.01×0.9999 ' +
        '= 0.010098. So P(H|D) = 0.99 × 0.0001 / 0.010098 = **0.0098 ≈ 1%**. After a second ' +
        'independent positive test, the new prior becomes 0.0098 and the posterior jumps to about 50%. ' +
        'A third positive test brings it to ~99%. Each piece of evidence updates the prior iteratively.',
      advancedContent:
        '**Conjugate priors — when Bayesian updating has a closed-form solution:**\n\n' +
        'A conjugate prior is a prior distribution that, when combined with a specific likelihood, produces a posterior in the same family. ' +
        'This gives you an exact answer without MCMC.\n\n' +
        '**Worked example (Beta-Binomial):** You want to estimate the probability p that an elephant calf survives its first year in Kaziranga.\n' +
        '- **Prior:** You believe p is around 0.7 but aren\'t sure. Use Beta(7, 3) — this encodes "roughly 7 successes out of 10 trials" worth of prior belief.\n' +
        '- **Data:** You observe 18 surviving calves out of 22 births.\n' +
        '- **Posterior:** Beta(7 + 18, 3 + 4) = Beta(25, 7). The posterior mean = 25/(25+7) = **0.78**.\n' +
        '- **95% credible interval:** [0.62, 0.90] — there is a 95% probability the true survival rate lies in this range.\n\n' +
        'The prior "pulled" the estimate from the raw data proportion (18/22 = 0.82) toward the prior mean (0.70). ' +
        'With more data, the prior matters less — after 200 observations, the posterior is dominated by the data.\n\n' +
        '**Common conjugate pairs:**\n' +
        '| Data type | Likelihood | Conjugate prior | Posterior |\n' +
        '|---|---|---|---|\n' +
        '| Coin flips, survival | Binomial | Beta(a, b) | Beta(a + successes, b + failures) |\n' +
        '| Measurements | Normal (known σ) | Normal(μ₀, σ₀²) | Normal(weighted avg, smaller variance) |\n' +
        '| Event counts (per year) | Poisson | Gamma(α, β) | Gamma(α + Σxᵢ, β + n) |\n\n' +
        '**When conjugacy fails:** Most real problems (multivariate, hierarchical models with 50+ parameters) have no conjugate solution. ' +
        'Then you use MCMC to sample from the posterior (see Monte Carlo section above) or **variational inference** — ' +
        'which approximates the posterior with a simpler distribution by minimizing KL divergence. ' +
        'Variational inference is faster but less accurate; MCMC is exact but slower. Modern tools (Stan, PyMC, NumPyro) handle both.',
    },
  ],

  build: [
    {
      id: 'stats-central',
      title: 'Central Tendency: Mean, Median, Mode',
      beginnerContent:
        'Calculate the three measures of center and see how they differ when outliers are present.',
      code: `import numpy as np
from scipy import stats

scores = np.array([72, 85, 90, 68, 95, 88, 76, 82, 91, 79])

print("=== Normal data ===")
print(f"Mean:   {np.mean(scores):.1f}")     # 82.6
print(f"Median: {np.median(scores):.1f}")   # 83.5
print(f"Mode:   {stats.mode(scores).mode}") # most frequent value

# Now add an outlier
scores_with_outlier = np.append(scores, 200)
print("\\n=== With outlier (200) ===")
print(f"Mean:   {np.mean(scores_with_outlier):.1f}")   # jumps to 93.3
print(f"Median: {np.median(scores_with_outlier):.1f}") # stays at 85.0
# The median barely moved — that's why it's called "robust"`,
    },
    {
      id: 'stats-stddev',
      title: 'Standard Deviation and Variance',
      beginnerContent:
        'Standard deviation tells you how far values typically are from the mean. Variance is its square.',
      code: `import numpy as np

# Two classes with the same mean but different spread
class_a = np.array([78, 80, 82, 79, 81, 80, 83, 77, 81, 79])
class_b = np.array([55, 95, 60, 100, 70, 90, 65, 98, 75, 92])

print(f"Class A — Mean: {np.mean(class_a):.1f}, SD: {np.std(class_a):.1f}")
# Mean: 80.0, SD: 1.7 (very tight cluster)

print(f"Class B — Mean: {np.mean(class_b):.1f}, SD: {np.std(class_b):.1f}")
# Mean: 80.0, SD: 16.0 (widely spread)

# Variance is SD squared
print(f"\\nClass A variance: {np.var(class_a):.1f}")
print(f"Class B variance: {np.var(class_b):.1f}")

# The 68-95-99.7 rule for bell-shaped data:
# ~68% of values fall within 1 SD of the mean
# ~95% fall within 2 SDs
# ~99.7% fall within 3 SDs`,
    },
    {
      id: 'stats-histograms',
      title: 'Histograms and Distribution Shapes',
      beginnerContent:
        'Visualize how data is distributed using histograms. The shape reveals patterns words cannot.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate three different distributions
np.random.seed(42)
normal = np.random.normal(70, 10, 500)       # bell-shaped
skewed = np.random.exponential(20, 500) + 40  # right-skewed
bimodal = np.concatenate([
  np.random.normal(55, 5, 250),
  np.random.normal(85, 5, 250),
])  # two peaks

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

axes[0].hist(normal, bins=25, color="steelblue", edgecolor="black")
axes[0].set_title("Bell-Shaped (Normal)")
axes[0].axvline(np.mean(normal), color="red", linestyle="--", label="Mean")
axes[0].legend()

axes[1].hist(skewed, bins=25, color="coral", edgecolor="black")
axes[1].set_title("Right-Skewed")
axes[1].axvline(np.mean(skewed), color="red", linestyle="--", label="Mean")
axes[1].axvline(np.median(skewed), color="green", linestyle="--", label="Median")
axes[1].legend()

axes[2].hist(bimodal, bins=25, color="mediumpurple", edgecolor="black")
axes[2].set_title("Bimodal (Two Groups)")

plt.tight_layout()
plt.show()`,
    },
    {
      id: 'stats-outliers',
      title: 'Detecting Outliers with IQR',
      beginnerContent:
        'The interquartile range method flags values that are unusually far from the middle 50% of the data.',
      code: `import numpy as np

data = np.array([12, 15, 14, 10, 13, 15, 100, 14, 11, 13, 16, 12])

q1 = np.percentile(data, 25)
q3 = np.percentile(data, 75)
iqr = q3 - q1

lower_fence = q1 - 1.5 * iqr
upper_fence = q3 + 1.5 * iqr

print(f"Q1: {q1}, Q3: {q3}, IQR: {iqr}")
print(f"Fences: [{lower_fence:.1f}, {upper_fence:.1f}]")

outliers = data[(data < lower_fence) | (data > upper_fence)]
clean = data[(data >= lower_fence) & (data <= upper_fence)]

print(f"Outliers: {outliers}")   # [100]
print(f"Clean data: {clean}")

print(f"\\nMean with outlier:    {np.mean(data):.1f}")
print(f"Mean without outlier: {np.mean(clean):.1f}")`,
    },
    {
      id: 'stats-correlation',
      title: 'Correlation and Scatter Plots',
      beginnerContent:
        'Visualize the relationship between two variables and compute the correlation coefficient.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Study hours vs exam scores for 10 students
hours = np.array([2, 3, 1, 5, 4, 6, 3, 7, 5, 8])
scores = np.array([65, 70, 55, 85, 78, 90, 72, 95, 80, 98])

# Correlation coefficient
r = np.corrcoef(hours, scores)[0, 1]

# Scatter plot with trend line
plt.figure(figsize=(8, 5))
plt.scatter(hours, scores, s=80, color="steelblue", zorder=5)

# Add a best-fit line
m, b = np.polyfit(hours, scores, 1)  # slope, intercept
x_line = np.linspace(0, 9, 100)
plt.plot(x_line, m * x_line + b, "r--", label=f"Trend (r={r:.2f})")

plt.xlabel("Study Hours")
plt.ylabel("Exam Score")
plt.title("Study Hours vs Exam Scores")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print(f"Correlation: {r:.3f}")
print(f"Each extra hour ≈ +{m:.1f} points on the exam")`,
    },
  ],
};
