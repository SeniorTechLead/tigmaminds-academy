import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'scientific-method',
  title: 'The Scientific Method',
  category: 'physics',
  icon: '🔬',
  tagline: 'How scientists ask questions, test ideas, and build knowledge — the engine of all discovery.',
  relatedStories: ['boy-counted-butterflies', 'girl-who-spoke-to-elephants', 'witch-doctor'],
  understand: [
    // ── Section 1: Observation & Questioning ─────────────────
    {
      title: 'Observation and Questioning',
      beginnerContent:
        'Science starts the same way every time: someone **notices something** and asks **why**.\n\n' +
        'Think of a detective arriving at a scene. Before forming theories, they look. They measure. They record. That\'s **observation** — the foundation of all science.\n\n' +
        'Observations come in two flavours:\n\n' +
        '| Type | What you record | Example from NE India |\n' +
        '|------|----------------|----------------------|\n' +
        '| **Qualitative** | Qualities — colour, shape, behaviour | "The one-horned rhinos in Kaziranga prefer the western grasslands" |\n' +
        '| **Quantitative** | Numbers — measurements, counts | "Western grasslands have 3.2× more mineral-rich grass per hectare" |\n\n' +
        'Quantitative observations are more powerful because they can be compared, graphed, and tested statistically. But qualitative observations often come first — they tell you *where to look*.\n\n' +
        '**From observation to question:**\n\n' +
        '| Observation | Vague question ❌ | Focused, testable question ✅ |\n' +
        '|-------------|-------------------|-------------------------------|\n' +
        '| Tea on upper slopes looks yellower | "Why do plants grow differently?" | "Does soil pH affect *Camellia sinensis* growth rate in Jorhat?" |\n' +
        '| Cherrapunji gets extreme rain some months | "Why does it rain?" | "What is the relationship between wind direction and daily rainfall in the Khasi Hills?" |\n' +
        '| Majuli island is shrinking each year | "Why do rivers erode?" | "How many hectares does Majuli lose per monsoon cycle, and does upstream dam release timing affect it?" |\n\n' +
        'Notice the pattern: a good question names **specific variables**, can be **answered by measurement**, and could be **proven wrong** (falsifiable). If no result could ever disprove it, it\'s not a scientific question — it\'s an opinion.\n\n' +
        '**Analogy:** Observation is like tuning a radio. You scan through static (the world) until you pick up a signal (a pattern). The question is you asking: "What station is this, and why is it playing *this* song?"',
      intermediateContent:
        '**Precision vs accuracy — the two pillars of measurement:**\n\n' +
        'Imagine shooting arrows at a target.\n\n' +
        '| Scenario | Precision | Accuracy | What it means |\n' +
        '|----------|-----------|----------|---------------|\n' +
        '| Arrows clustered near bullseye | ✅ High | ✅ High | Instrument is calibrated and reliable |\n' +
        '| Arrows clustered but off-centre | ✅ High | ❌ Low | Systematic error (bias) — needs recalibration |\n' +
        '| Arrows scattered around bullseye | ❌ Low | ✅ High (on average) | Random error — need more readings |\n' +
        '| Arrows scattered and off-centre | ❌ Low | ❌ Low | Instrument is unreliable AND biased |\n\n' +
        '**Quantifying precision:**\n\n' +
        '| Concept | Symbol | What it tells you | Example |\n' +
        '|---------|--------|-------------------|---------|\n' +
        '| Standard deviation | σ | Spread of repeated measurements | σ = 0.3 cm means most readings fall within ±0.3 cm of the mean |\n' +
        '| Significant figures | — | How many digits are meaningful | 42.3 cm = 3 sig figs → uncertainty ±0.05 cm |\n' +
        '| Resolution | — | Smallest detectable change | A ruler marked in mm has 1 mm resolution |\n\n' +
        '**Worked example — significant figures in calculation:**\n\n' +
        'A tea seedling bed measures 42.3 cm × 3.1 cm.\n' +
        '- Raw calculation: 42.3 × 3.1 = 131.13 cm²\n' +
        '- 42.3 has 3 sig figs; 3.1 has 2 sig figs\n' +
        '- Rule: keep the **fewest** sig figs → **130 cm²** (2 sig figs)\n\n' +
        '**Instrument characterisation table:**\n\n' +
        '| Property | Definition | pH meter example |\n' +
        '|----------|-----------|------------------|\n' +
        '| Resolution | Smallest readable change | 0.01 pH units |\n' +
        '| Range | Min to max measurable value | 0–14 |\n' +
        '| Calibration | Comparison against known standards | Buffers at pH 4, 7, 10 |\n' +
        '| Uncertainty | Reliability after calibration | ±0.02 pH units |',
      advancedContent:
        '**The philosophy of observation is deeper than it looks.**\n\n' +
        '| Concept | Thinker | Core claim |\n' +
        '|---------|---------|------------|\n' +
        '| **Theory-ladenness** | Hanson (1958), Kuhn (1962) | What you *see* depends on what you *expect* — two scientists can observe the same phenomenon and "see" different things |\n' +
        '| **Operationalism** | Bridgman (1927) | Every scientific concept must be defined by the operations used to measure it — "temperature" *is* what a calibrated thermometer reads |\n' +
        '| **Duhem-Quine thesis** | Duhem (1906), Quine (1951) | No single observation can conclusively refute a hypothesis, because every test relies on auxiliary assumptions |\n\n' +
        'Modern philosophy distinguishes:\n\n' +
        '| Category | Definition | Examples |\n' +
        '|----------|-----------|----------|\n' +
        '| **Observables** | Directly measurable quantities | Mass, length, voltage, temperature |\n' +
        '| **Theoretical entities** | Inferred from observable effects | Electrons, genes, gravitational fields |\n\n' +
        '**Why does this matter practically?** Because it means *choosing what to measure* is itself a theoretical act. When Kaziranga researchers decided to track rhino movement with GPS collars rather than aerial photography, they embedded assumptions about what spatial resolution and temporal frequency would reveal meaningful patterns. The observation was shaped by theory before a single data point was recorded.\n\n' +
        'The Duhem-Quine thesis has real bite: if your pH meter gives unexpected readings, is the hypothesis wrong, or is the meter miscalibrated? Is the buffer expired? Is the temperature affecting the electrode? Any "failed" prediction could be blamed on a failed auxiliary assumption instead — making strict falsification impossible in practice.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each observation type to the correct example',
          pairs: [
            ['Qualitative observation', '"The rhinos prefer the western grassland area"'],
            ['Quantitative observation', '"Western grasslands have 3.2× more mineral-rich grass per hectare"'],
            ['Testable question', '"Does soil pH affect tea seedling growth rate?"'],
            ['Non-testable statement', '"Nature is beautiful and mysterious"'],
          ],
        },
      },
    },

    // ── Section 2: Forming Hypotheses ────────────────────────
    {
      title: 'Forming Hypotheses',
      beginnerContent:
        'A **hypothesis** is not a guess. It\'s an **educated prediction** based on what you already know, stated in a way that can be **tested and potentially proven wrong**.\n\n' +
        '**Analogy:** A hypothesis is like a GPS route. You don\'t just drive randomly and hope to arrive — you predict a path based on the map (prior knowledge), and if you hit a dead end (contradictory evidence), you recalculate.\n\n' +
        'The classic format: **"If [condition], then [predicted outcome], because [reasoning]."**\n\n' +
        '| Component | What it does | Tea example |\n' +
        '|-----------|-------------|-------------|\n' +
        '| **If** | States the condition you\'ll test | If tea plants are grown at higher elevations... |\n' +
        '| **Then** | Predicts the measurable outcome | ...then leaves will have higher L-theanine concentration... |\n' +
        '| **Because** | Explains the reasoning | ...because cooler temperatures slow growth, allowing more amino acid accumulation |\n\n' +
        'Every hypothesis needs a **null hypothesis (H₀)** — the boring default that says "nothing interesting is happening." For the tea example: *"Elevation has no effect on L-theanine concentration."* Scientists try to **reject** the null hypothesis, not prove their own. Why? Because it protects against **confirmation bias** — our natural tendency to see what we want to see.\n\n' +
        '**Multiple hypotheses are normal.** If tea plants on the upper slope look yellow, it could be:\n\n' +
        '| Hypothesis | Testable prediction |\n' +
        '|-----------|--------------------|\n' +
        '| Soil pH is too high | Plants in acidified soil will green up |\n' +
        '| Iron deficiency | Leaves will have low iron; iron supplement will restore colour |\n' +
        '| Fungal infection | Microscopy will reveal fungal hyphae in leaf tissue |\n' +
        '| Excess sunlight | Shaded plants will recover colour within 2 weeks |\n\n' +
        'A good scientist generates **multiple** plausible hypotheses and designs experiments to tell them apart.\n\n' +
        '**Quick check:** "Bihu dances bring good monsoons." Is this a scientific hypothesis? *No — it\'s not falsifiable. There\'s no measurement that could prove it wrong, because "good monsoon" is undefined and the mechanism is unspecified.*',
      intermediateContent:
        '**Hypothesis testing — the statistical framework:**\n\n' +
        '| Term | Symbol | Definition | Tea example |\n' +
        '|------|--------|-----------|-------------|\n' +
        '| Null hypothesis | H₀ | No effect / no difference | μ_high = μ_low (same L-theanine at both elevations) |\n' +
        '| Alternative hypothesis | H₁ | There IS an effect | μ_high > μ_low |\n' +
        '| Significance level | α | Threshold for rejecting H₀ | 0.05 (5% risk of false alarm) |\n' +
        '| p-value | p | Probability of seeing this data if H₀ is true | p = 0.003 → very unlikely under H₀ |\n' +
        '| Decision | — | Reject H₀ if p < α | 0.003 < 0.05 → reject H₀ |\n\n' +
        '**Two types of errors:**\n\n' +
        '| Error | Name | What happens | Analogy |\n' +
        '|-------|------|-------------|----------|\n' +
        '| **Type I** | False positive | Reject H₀ when it\'s actually true | Convicting an innocent person |\n' +
        '| **Type II** | False negative | Fail to reject H₀ when it\'s actually false | Letting a guilty person go free |\n\n' +
        '**Worked example — why sample size matters:**\n\n' +
        'With n = 10 plants per group and moderate effect size (Cohen\'s d = 0.8):\n' +
        '- Statistical power = ~50% (coin flip — you\'d miss the effect half the time!)\n\n' +
        'With n = 25 plants per group:\n' +
        '- Power = ~80% (acceptable minimum)\n\n' +
        'With n = 50 plants per group:\n' +
        '- Power = ~97% (very reliable)\n\n' +
        'This is why **sample size calculations must be done BEFORE the experiment** — not after.',
      advancedContent:
        '**Three philosophies of hypothesis testing:**\n\n' +
        '| Framework | Key idea | Strengths | Weaknesses |\n' +
        '|-----------|----------|-----------|------------|\n' +
        '| **Popperian falsificationism** (1934) | Science progresses by trying to *disprove* hypotheses | Clean logic (modus tollens); demarcates science from pseudoscience | Ignores how scientists actually work; strict falsification rarely possible |\n' +
        '| **Frequentist testing** (Neyman-Pearson) | Binary reject/accept based on p-value and pre-set α | Widely used; controls error rates over many experiments | Misunderstood (p ≠ probability H₀ is false); encourages binary thinking |\n' +
        '| **Bayesian inference** | Update belief using prior + data: P(H|D) = P(D|H) × P(H) / P(D) | Intuitive; handles accumulating evidence; no binary cutoff | Requires specifying a prior (subjective element) |\n\n' +
        '**Worked example — Bayesian update:**\n\n' +
        'Prior belief that elevation affects L-theanine: P(H₁) = 0.6 (based on literature).\n' +
        'Likelihood of our data if H₁ true: P(D|H₁) = 0.9.\n' +
        'Likelihood of our data if H₀ true: P(D|H₀) = 0.1.\n\n' +
        'P(D) = P(D|H₁)×P(H₁) + P(D|H₀)×P(H₀) = 0.9×0.6 + 0.1×0.4 = 0.54 + 0.04 = 0.58\n\n' +
        'P(H₁|D) = (0.9 × 0.6) / 0.58 = **0.93**\n\n' +
        'Our belief jumped from 60% to 93% — a substantial update. Unlike frequentist testing, this tells us the actual probability of the hypothesis being true (given our prior and data).\n\n' +
        '**The replication crisis:** Only ~36% of psychology studies replicate. Causes include p-hacking (trying multiple analyses until p < 0.05), small samples, and publication bias (journals prefer "significant" results). Remedies: pre-registration, Bayesian methods, effect-size reporting, and open data.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A hypothesis must be testable and falsifiable to be scientific.', answer: true, explanation: 'If a statement cannot be tested or if no possible evidence could prove it wrong, it is not a scientific hypothesis — it may be an opinion, belief, or philosophical claim.' },
            { text: 'If an experiment does not support your hypothesis, the experiment failed.', answer: false, explanation: 'Rejecting a hypothesis is a valid and valuable scientific result — it tells you something about the world and guides future research.' },
            { text: 'The null hypothesis states that there IS a relationship between the variables.', answer: false, explanation: 'The null hypothesis assumes NO relationship. Scientists try to reject the null hypothesis with evidence.' },
            { text: 'A p-value of 0.03 means there is a 3% chance the hypothesis is false.', answer: false, explanation: 'The p-value is the probability of seeing data this extreme IF H₀ is true — not the probability that H₀ is true. This is a very common misunderstanding.' },
            { text: 'Multiple hypotheses can explain the same observation.', answer: true, explanation: 'Yellow tea leaves could be caused by soil pH, nutrient deficiency, fungal infection, or excess sunlight. Good science generates multiple hypotheses and tests between them.' },
          ],
        },
      },
    },

    // ── Section 3: Designing Experiments ─────────────────────
    {
      title: 'Designing Experiments',
      beginnerContent:
        'An experiment is a **controlled test** of a hypothesis. The key word is *controlled* — you change **one thing** and measure its effect while keeping **everything else the same**.\n\n' +
        '**Analogy:** Imagine you\'re trying to find out why your *pitha* (rice cake) came out flat. You change the amount of baking soda and keep everything else identical — same rice flour, same water, same temperature, same cooking time. If the pitha rises with more baking soda, you\'ve found the cause. But if you also changed the flour and the oven temperature, you\'d never know which change mattered.\n\n' +
        '**The four essential components:**\n\n' +
        '| Component | What it means | Tea seedling experiment |\n' +
        '|-----------|-------------|------------------------|\n' +
        '| **Independent variable (IV)** | What you deliberately change | Soil pH (4, 5, 6, 7) |\n' +
        '| **Dependent variable (DV)** | What you measure | Seedling height after 8 weeks |\n' +
        '| **Controlled variables** | Everything you keep the same | Soil type, water amount, light, tea variety, temperature |\n' +
        '| **Control group** | Baseline — no treatment | Seedlings in unmodified local soil at natural pH |\n\n' +
        '**Why replication matters:**\n\n' +
        '| Plants per pH level | What could go wrong | Confidence |\n' +
        '|--------------------|--------------------|-----------|\n' +
        '| 1 | One sick plant ruins everything | ❌ None |\n' +
        '| 5 | Better, but one outlier still has big effect | ⚠️ Low |\n' +
        '| 20 | Random variation averages out | ✅ High |\n' +
        '| 50 | Very reliable — can detect even small effects | ✅✅ Very high |\n\n' +
        '**Three safeguards against bias:**\n\n' +
        '| Safeguard | What it prevents | How it works |\n' +
        '|-----------|-----------------|-------------|\n' +
        '| **Randomisation** | Selection bias | Randomly assign seedlings to pH groups (don\'t pick the tallest ones for your favourite group) |\n' +
        '| **Blinding** | Measurement bias | Measure seedling heights without knowing which pH group each belongs to |\n' +
        '| **Replication** | Fluke results | Use enough subjects that random variation averages out |\n\n' +
        '**NE India experiment idea:** In Cherrapunji, a student could test rainfall collection methods — comparing funnel diameters (10 cm, 20 cm, 30 cm), placement heights (ground level vs 1 m vs 2 m), and distances from buildings. The IV is funnel size, the DV is collected volume, and controlled variables include placement height, location, and collection duration. This is real meteorological science — not a textbook exercise.',
      intermediateContent:
        '**Power analysis — calculating sample size BEFORE you start:**\n\n' +
        'For a two-sample t-test: n = (z_α + z_β)² × 2σ² / δ²\n\n' +
        '| Symbol | Meaning | Typical value |\n' +
        '|--------|---------|---------------|\n' +
        '| z_α | Z-score for significance level | 1.96 (for α = 0.05, two-tailed) |\n' +
        '| z_β | Z-score for desired power | 0.84 (for power = 80%) |\n' +
        '| σ | Standard deviation of measurements | Estimated from pilot data |\n' +
        '| δ | Minimum meaningful difference | The smallest effect worth detecting |\n\n' +
        '**Worked example — tea seedling experiment:**\n\n' +
        'From a pilot study: σ = 3 cm. We want to detect a difference of δ = 4 cm.\n\n' +
        'n = (1.96 + 0.84)² × 2 × 9 / 16 = (2.80)² × 18/16 = 7.84 × 1.125 = **8.82 → 9 plants per group**\n\n' +
        'With 4 pH levels × 9 plants = **36 total plants** needed.\n\n' +
        '**ANOVA — comparing multiple groups at once:**\n\n' +
        'With 4 pH groups, you cannot just run 6 separate t-tests (4C2 = 6 pairs) — each test has a 5% false positive rate, so the overall error rate balloons to 1 − 0.95⁶ = **26%**.\n\n' +
        '| ANOVA component | Formula | Tea experiment |\n' +
        '|-----------------|---------|----------------|\n' +
        '| F-statistic | Variance between groups / Variance within groups | F = MS_between / MS_within |\n' +
        '| df_between | k − 1 | 4 − 1 = 3 |\n' +
        '| df_within | N − k | 36 − 4 = 32 |\n' +
        '| F_critical | From F-distribution table | ≈ 2.90 at α = 0.05 |\n' +
        '| Decision | Reject H₀ if F > F_critical | If F = 15.3 → reject (groups differ significantly) |\n\n' +
        'If ANOVA is significant, use **post-hoc tests** (Tukey HSD, Bonferroni) to identify *which* specific groups differ.',
      advancedContent:
        '**Advanced experimental designs — beyond one-factor-at-a-time:**\n\n' +
        '| Design | When to use | Key advantage | Example |\n' +
        '|--------|------------|---------------|--------|\n' +
        '| **Factorial** (e.g., 2×2) | Multiple factors to test simultaneously | Detects **interactions** between factors | Test pH (low/high) × water (low/high) in 4 groups |\n' +
        '| **Randomised Complete Block (RCBD)** | Known source of variability (e.g., greenhouse shelf) | Reduces within-group variance | Block by shelf, randomise treatments within each shelf |\n' +
        '| **Latin Square** | Two blocking factors | Controls two sources of variation simultaneously | Rows = shelf position, columns = week planted |\n' +
        '| **Split-plot** | Some factors hard to randomise | Practical for field experiments | Whole plot = irrigation method, sub-plot = fertiliser |\n' +
        '| **Repeated measures** | Same subjects measured over time | More powerful (each subject is its own control) | Measure same seedlings at weeks 2, 4, 6, 8 |\n' +
        '| **Adaptive** | Clinical trials, resource constraints | Modify experiment based on interim results | Stop arm early if treatment is clearly effective |\n\n' +
        '**Factorial interactions — worked example:**\n\n' +
        'A 2×2 factorial on tea growth with factors: pH (5 vs 7) and watering (500 mL vs 1000 mL/week)\n\n' +
        '| | pH 5 | pH 7 | Row mean |\n' +
        '|---|------|------|----------|\n' +
        '| Water 500 mL | 11.2 cm | 6.8 cm | 9.0 cm |\n' +
        '| Water 1000 mL | 14.1 cm | 7.1 cm | 10.6 cm |\n' +
        '| Column mean | 12.65 cm | 6.95 cm | |\n\n' +
        'Main effect of pH: 12.65 − 6.95 = **5.7 cm** (huge).\n' +
        'Main effect of water: 10.6 − 9.0 = **1.6 cm** (modest).\n' +
        '**Interaction:** Extra water boosted growth by 2.9 cm at pH 5 but only 0.3 cm at pH 7 → **the effect of water depends on pH**. This interaction would be invisible in a one-factor experiment.\n\n' +
        'R.A. Fisher (1935) established these principles at Rothamsted Experimental Station, founding modern experimental statistics. The philosophical foundation is **Mill\'s method of difference**: if two situations are identical except for one factor, any difference in outcome must be caused by that factor.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each experiment component to its role',
          pairs: [
            ['Independent variable', 'The factor you deliberately change (e.g., soil pH)'],
            ['Dependent variable', 'The factor you measure as the outcome (e.g., plant height)'],
            ['Controlled variables', 'Factors kept constant so they don\'t confound results'],
            ['Control group', 'The untreated baseline for comparison'],
            ['Randomisation', 'Assigning subjects to groups by chance to prevent selection bias'],
          ],
        },
      },
    },

    // ── Section 4: Analyzing Data ────────────────────────────
    {
      title: 'Analyzing Results',
      diagram: 'CorrelationDiagram',
      beginnerContent:
        'You\'ve collected your data. Now what? Raw numbers are like a pile of unsorted photos — useless until you organise them.\n\n' +
        '**Step 1: Descriptive statistics — summarise the pile.**\n\n' +
        '| Statistic | What it tells you | Tea experiment (pH 5 group) |\n' +
        '|-----------|------------------|----------------------------|\n' +
        '| **Mean** | Average value | (10 + 11 + 13 + 12 + 14) / 5 = **12.0 cm** |\n' +
        '| **Median** | Middle value (less affected by outliers) | Sort: 10, 11, 12, 13, 14 → **12 cm** |\n' +
        '| **Standard deviation (SD)** | How spread out the values are | SD = **1.58 cm** (tight cluster) |\n' +
        '| **Range** | Highest minus lowest | 14 − 10 = **4 cm** |\n\n' +
        '**Step 2: Visualise — make the patterns visible.**\n\n' +
        '| Graph type | Best for | Example |\n' +
        '|-----------|---------|--------|\n' +
        '| **Bar chart** | Comparing categories | Mean height at each pH level |\n' +
        '| **Line graph** | Showing change over time | Rainfall in Cherrapunji month by month |\n' +
        '| **Scatter plot** | Showing relationships between two variables | Elephant sightings vs distance from water (try the diagram above!) |\n' +
        '| **Histogram** | Showing distribution of one variable | Heights of all 80 tea seedlings |\n\n' +
        '**Step 3: Draw conclusions — but carefully.**\n\n' +
        'A good conclusion states:\n' +
        '- Whether the evidence **supports or contradicts** the hypothesis\n' +
        '- The **size** of the effect (not just "it worked")\n' +
        '- The **limitations** — what your experiment did NOT test\n' +
        '- **Next steps** — what should be investigated further\n\n' +
        '**Example conclusion (tea experiment):**\n\n' +
        '*"Tea seedlings grew significantly taller in pH 5 soil (mean 12.3 ± 1.2 cm) compared to pH 7 soil (mean 7.8 ± 1.5 cm), supporting the hypothesis that tea prefers acidic soil. However, this experiment tested only one tea variety over 8 weeks, and did not examine pH values below 4. Further research should test multiple varieties across a full growing season."*\n\n' +
        'Notice: never "we proved our hypothesis." In science, hypotheses are *supported by evidence*, never definitively proven — because future evidence might contradict them.',
      intermediateContent:
        '**The t-test — is the difference real?**\n\n' +
        'Formula: t = (x̄₁ − x̄₂) / √(s₁²/n₁ + s₂²/n₂)\n\n' +
        '**Worked example — pH 5 vs pH 7:**\n\n' +
        '| Group | Mean (x̄) | SD (s) | n |\n' +
        '|-------|----------|--------|---|\n' +
        '| pH 5 | 12.3 cm | 1.2 cm | 20 |\n' +
        '| pH 7 | 7.8 cm | 1.5 cm | 20 |\n\n' +
        't = (12.3 − 7.8) / √(1.44/20 + 2.25/20) = 4.5 / √(0.072 + 0.1125) = 4.5 / 0.4296 = **10.47**\n\n' +
        'With df ≈ 36, t_critical = 2.03 at α = 0.05. Since 10.47 >> 2.03 → **p << 0.001** — the difference is highly significant.\n\n' +
        '**Confidence intervals — expressing uncertainty:**\n\n' +
        '| Concept | Formula | pH 5 result |\n' +
        '|---------|---------|-------------|\n' +
        '| Standard error | SE = s / √n | 1.2 / √20 = 0.268 cm |\n' +
        '| 95% confidence interval | x̄ ± 1.96 × SE | 12.3 ± 0.53 = **(11.77, 12.83) cm** |\n\n' +
        'Interpretation: "We are 95% confident the true mean height of pH 5 tea seedlings lies between 11.77 and 12.83 cm."\n\n' +
        '**Key statistics summary:**\n\n' +
        '| Statistic | What it measures | When to use |\n' +
        '|-----------|-----------------|------------|\n' +
        '| **t-test** | Difference between 2 group means | pH 5 vs pH 7 |\n' +
        '| **ANOVA** | Difference among 3+ group means | pH 4 vs 5 vs 6 vs 7 |\n' +
        '| **R²** | % of variation explained by the IV | "85% of height variation is due to pH" |\n' +
        '| **Correlation (r)** | Strength and direction of linear relationship | r = 0.92 → strong positive |\n' +
        '| **Chi-squared (χ²)** | Association between categorical variables | Plant survival (alive/dead) vs pH group |',
      advancedContent:
        '**Regression — modelling relationships mathematically:**\n\n' +
        'Simple linear regression: y = β₀ + β₁x + ε\n\n' +
        '| Symbol | Meaning | Tea example |\n' +
        '|--------|---------|-------------|\n' +
        '| y | Dependent variable | Seedling height |\n' +
        '| x | Independent variable | Soil pH |\n' +
        '| β₀ | Intercept | Predicted height when pH = 0 (extrapolation) |\n' +
        '| β₁ | Slope | Change in height per unit pH |\n' +
        '| ε | Error term | Random variation |\n\n' +
        '**OLS assumptions and diagnostics:**\n\n' +
        '| Assumption | How to check | What to do if violated |\n' +
        '|------------|-------------|----------------------|\n' +
        '| Linearity | Residuals vs fitted plot (should be random) | Use polynomial or non-linear model |\n' +
        '| Independence | Study design (no nesting) | Use mixed-effects model |\n' +
        '| Homoscedasticity | Scale-location plot (flat line) | Use weighted least squares or robust SEs |\n' +
        '| Normal residuals | Q-Q plot (points on diagonal) | Use GLM or non-parametric tests |\n\n' +
        '**When OLS fails — alternatives:**\n\n' +
        '| Situation | Model | Example |\n' +
        '|-----------|-------|--------|\n' +
        '| Binary outcome (yes/no) | Logistic regression | Did the seedling survive? |\n' +
        '| Count data | Poisson regression | Number of leaves per plant |\n' +
        '| Hierarchical data (plants within pots within greenhouses) | Mixed-effects model | Random intercepts for each greenhouse |\n' +
        '| Non-normal data | Non-parametric tests (Mann-Whitney, Kruskal-Wallis) | When sample is small and skewed |\n\n' +
        '**The reproducibility movement:**\n\n' +
        '| Reform | Purpose | Status |\n' +
        '|--------|---------|--------|\n' +
        '| **Pre-registration** | Lock hypotheses + analysis plan before data collection | Required by many journals |\n' +
        '| **Effect sizes** (Cohen\'s d) | Report magnitude, not just significance | d = (x̄₁−x̄₂)/s_pooled; d > 0.8 = "large" |\n' +
        '| **Open data + open code** | Allow reanalysis and replication | Increasingly mandated by funders |\n' +
        '| **Meta-analysis** | Synthesise results across many studies | More reliable than any single experiment |',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each statistical concept to its purpose',
          pairs: [
            ['Mean (average)', 'Describes the central tendency of a data set'],
            ['Standard deviation', 'Measures how spread out the values are from the mean'],
            ['p-value', 'Probability of seeing this data if the null hypothesis is true'],
            ['Confidence interval', 'Range that likely contains the true population parameter'],
            ['R² (coefficient of determination)', 'Proportion of variance in the DV explained by the IV'],
          ],
        },
      },
    },

    // ── Section 5: Peer Review & Scientific Communication ────
    {
      title: 'Peer Review and the Self-Correcting Nature of Science',
      beginnerContent:
        'Science has a built-in error-correction system: **peer review**. Before any study is published, other experts read it, question it, and try to poke holes in it.\n\n' +
        '**Analogy:** Peer review is like having your homework checked by the three smartest students in class — except they\'re actively trying to find mistakes, not just reading politely.\n\n' +
        '**How peer review works:**\n\n' +
        '| Step | What happens | Who does it |\n' +
        '|------|-------------|-------------|\n' +
        '| 1. Submission | Scientist sends paper to a journal | The author |\n' +
        '| 2. Editor screening | Editor checks if paper fits the journal and has basic quality | Journal editor |\n' +
        '| 3. Peer review | 2–4 independent experts review methods, data, and conclusions | Anonymous reviewers |\n' +
        '| 4. Decision | Accept, revise, or reject | Editor (based on reviews) |\n' +
        '| 5. Revision | Author addresses all reviewer concerns | The author |\n' +
        '| 6. Publication | Paper becomes part of the scientific record | Journal |\n\n' +
        '**What reviewers look for:**\n\n' +
        '| Check | Question they ask |\n' +
        '|-------|------------------|\n' +
        '| Methods | Were the experiments properly controlled? Enough samples? |\n' +
        '| Statistics | Were the right tests used? Are p-values interpreted correctly? |\n' +
        '| Logic | Do the conclusions actually follow from the data? |\n' +
        '| Novelty | Does this add something new to what we already know? |\n' +
        '| Reproducibility | Could another lab repeat this experiment from the description? |\n\n' +
        'Researchers at IIT Guwahati, Tezpur University, and IASST publish peer-reviewed studies on Brahmaputra flood modelling, Kaziranga wildlife tracking, and Muga silk properties. Their work goes through the same global review process — a scientist\'s paper on rhino GPS tracking is reviewed by wildlife biologists in Kenya, Australia, or Brazil.\n\n' +
        '**Why does this matter?** Because peer review is why we can *trust* science more than random claims on the internet. It\'s not perfect — reviewers can miss errors, and the process is slow — but it\'s the best quality-control system humanity has developed for building reliable knowledge.',
      intermediateContent:
        '**Types of scientific publications:**\n\n' +
        '| Type | What it contains | Typical review |\n' +
        '|------|-----------------|----------------|\n' +
        '| **Original research article** | New data + analysis from experiments | Full peer review (2–12 months) |\n' +
        '| **Review article** | Summary and synthesis of many studies | Peer reviewed, invited |\n' +
        '| **Meta-analysis** | Statistical combination of multiple studies | Full peer review |\n' +
        '| **Preprint** | Research shared before peer review | NOT reviewed — preliminary |\n' +
        '| **Conference proceeding** | Short paper presented at a scientific meeting | Lightly reviewed |\n' +
        '| **Retraction** | A published paper found to have errors or fraud | Investigated + withdrawn |\n\n' +
        '**Evaluating scientific sources — a checklist:**\n\n' +
        '| Criterion | How to assess it |\n' +
        '|-----------|------------------|\n' +
        '| **Peer reviewed?** | Published in a recognised journal, not just a blog or news article |\n' +
        '| **Sample size?** | Larger = more reliable. Be sceptical of n < 30 |\n' +
        '| **Replicated?** | Has anyone else found the same result? |\n' +
        '| **Conflicts of interest?** | Who funded it? Does the author benefit from a particular result? |\n' +
        '| **Effect size?** | A "significant" result with tiny effect size may not matter practically |\n' +
        '| **Correlation ≠ causation?** | Just because two things co-occur doesn\'t mean one causes the other |\n\n' +
        '**Worked example — evaluating a claim:**\n\n' +
        'Claim: "Drinking Assam tea prevents cancer."\n\n' +
        '| Check | Evaluation |\n' +
        '|-------|------------|\n' +
        '| Source? | Newspaper article citing one study |\n' +
        '| Peer reviewed? | Yes, but in a low-impact journal |\n' +
        '| Study type? | Observational (not an experiment) — cannot prove causation |\n' +
        '| Sample size? | n = 200 (moderate) |\n' +
        '| Replicated? | No other study has confirmed this |\n' +
        '| Effect size? | 12% reduction — modest, could be confounded by diet/lifestyle |\n' +
        '| Conclusion? | **Interesting but far from proven** — need randomised controlled trials with larger samples |',
      advancedContent:
        '**The hierarchy of scientific evidence:**\n\n' +
        '| Level | Study type | Strength | Why |\n' +
        '|-------|-----------|----------|-----|\n' +
        '| 1 (strongest) | **Systematic review + meta-analysis** | ★★★★★ | Combines all available evidence statistically |\n' +
        '| 2 | **Randomised controlled trial (RCT)** | ★★★★ | Establishes causation through controlled manipulation |\n' +
        '| 3 | **Cohort study** (prospective observation) | ★★★ | Follows groups over time; good for long-term effects |\n' +
        '| 4 | **Case-control study** (retrospective) | ★★ | Compares people with/without outcome; cheaper but biased |\n' +
        '| 5 | **Case report / expert opinion** | ★ | Anecdotal; no control group; starting point only |\n\n' +
        '**Paradigm shifts and scientific revolutions:**\n\n' +
        'Thomas Kuhn (1962) argued science doesn\'t progress smoothly — it alternates between **normal science** (puzzle-solving within an accepted framework) and **revolutions** (the framework itself is replaced).\n\n' +
        '| Old paradigm | Anomalies accumulated | New paradigm | Key figure |\n' +
        '|-------------|----------------------|-------------|------------|\n' +
        '| Earth-centred universe | Planetary retrograde motion couldn\'t be explained simply | Sun-centred system | Copernicus, Galileo |\n' +
        '| Newtonian mechanics | Mercury\'s orbit precessed unexpectedly | General relativity | Einstein |\n' +
        '| Steady-state continents | Fossils, coastline fits, mid-ocean ridges | Plate tectonics | Wegener, Hess |\n' +
        '| Inheritance by blending | Traits reappeared after skipping generations | Mendelian genetics | Mendel, rediscovered 1900 |\n\n' +
        '**Demarcation problem — what IS science?**\n\n' +
        '| Criterion | Proposed by | Problem |\n' +
        '|-----------|------------|--------|\n' +
        '| Falsifiability | Popper | Some legitimate science (string theory) is hard to falsify |\n' +
        '| Puzzle-solving within a paradigm | Kuhn | Makes science a sociological, not logical, category |\n' +
        '| Progressive research programme | Lakatos | Requires hindsight to evaluate |\n' +
        '| No single criterion | Feyerabend ("anything goes") | Too permissive — would include astrology |\n\n' +
        'The consensus today: science is characterised by a **cluster of features** — empirical testing, falsifiability, peer review, replication, parsimony, and openness to revision — rather than any single defining criterion.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A preprint has been peer reviewed and can be trusted like a journal article.', answer: false, explanation: 'Preprints are shared BEFORE peer review. They may contain errors that reviewers would catch. Treat them as preliminary.' },
            { text: 'If a study is published in a peer-reviewed journal, its conclusions are definitely correct.', answer: false, explanation: 'Peer review reduces errors but doesn\'t eliminate them. Published papers can be wrong — that\'s why replication matters.' },
            { text: 'A correlation between tea drinking and health means tea causes better health.', answer: false, explanation: 'Correlation does not imply causation. Tea drinkers might also exercise more, eat better, or have higher income — confounding variables could explain the correlation.' },
            { text: 'Science is self-correcting because errors are eventually caught through replication and review.', answer: true, explanation: 'While individual studies can be wrong, the scientific process — peer review, replication, meta-analysis — eventually identifies and corrects errors.' },
          ],
        },
      },
    },

    // ── Section 6: The Full Cycle in Action ──────────────────
    {
      title: 'The Complete Scientific Method — A Worked Example',
      beginnerContent:
        'Let\'s walk through the **entire scientific method** with a real NE India scenario — from observation to conclusion.\n\n' +
        '**Scenario:** A student at Cotton University in Guwahati notices that the Deepor Beel (a Ramsar wetland on the edge of the city) has fewer migratory birds this winter compared to five years ago.\n\n' +
        '| Step | What the student does |\n' +
        '|------|---------------------|\n' +
        '| **1. Observation** | Counts only 12 species of migratory birds this December, compared to 23 species recorded in the same month 5 years ago |\n' +
        '| **2. Question** | "Is the decline in migratory bird species at Deepor Beel related to the increase in construction and noise around the wetland?" |\n' +
        '| **3. Hypothesis** | "If construction noise exceeds 65 dB within 500 m of the wetland, then fewer migratory species will be observed, because birds avoid high-noise zones" |\n' +
        '| **4. Null hypothesis** | "Noise levels have no effect on migratory bird species count" |\n' +
        '| **5. Experiment design** | Measure noise levels (IV) at 10 locations around the beel; count bird species within 200 m radius of each location (DV); control for water quality, vegetation, and human foot traffic |\n' +
        '| **6. Data collection** | 4 weekends × 10 locations = 40 data points (noise + species count per location) |\n' +
        '| **7. Analysis** | Scatter plot shows negative correlation (r = −0.78); as noise increases, bird count decreases |\n' +
        '| **8. Conclusion** | "Higher noise levels are significantly associated with fewer migratory species (r = −0.78, p = 0.002). However, this is correlational — noise may be a proxy for broader habitat disturbance. Controlled noise-reduction experiments would be needed to establish causation." |\n' +
        '| **9. Communication** | Presents findings at school science fair; submits to *Indian Journal of Ecology* student section |\n\n' +
        '**Key takeaway:** The scientific method is not a rigid recipe — it\'s a **cycle**. The conclusion raises new questions ("Would noise barriers increase bird counts?"), which lead to new hypotheses, new experiments, and new conclusions. Science spirals forward.\n\n' +
        '**The method also applies to everyday life:**\n\n' +
        '| Life situation | Scientific thinking |\n' +
        '|---------------|--------------------|\n' +
        '| Your phone battery drains fast | Observe → hypothesise (is it a specific app?) → test (disable apps one by one) → conclude |\n' +
        '| Rice takes longer to cook at higher altitudes | Observe → hypothesise (lower air pressure → lower boiling point) → test with pressure cooker → conclude |\n' +
        '| Garden plants die despite watering | Observe → hypothesise (overwatering? pests? soil?) → test each → conclude |',
      intermediateContent:
        '**Putting it all together — the Deepor Beel study in statistical detail:**\n\n' +
        '| Analysis step | Method | Result |\n' +
        '|--------------|--------|--------|\n' +
        '| Descriptive stats | Mean noise: 58.3 ± 12.1 dB; Mean species: 8.4 ± 4.2 | — |\n' +
        '| Correlation | Pearson r = −0.78 (strong negative) | p = 0.002 |\n' +
        '| Regression | Species = 22.1 − 0.23 × Noise_dB | R² = 0.61 |\n' +
        '| Interpretation | Each 10 dB increase → ~2.3 fewer species | 61% of variation explained |\n' +
        '| Confounders checked | Water quality (r = 0.12, ns), vegetation cover (r = 0.31, p = 0.08) | Not significant |\n\n' +
        '**The scientific paper structure (IMRaD):**\n\n' +
        '| Section | Content | Deepor Beel example |\n' +
        '|---------|---------|--------------------|\n' +
        '| **I**ntroduction | Background, question, hypothesis | Wetland importance, bird decline, noise hypothesis |\n' +
        '| **M**ethods | Exact procedures so others can replicate | 10 locations, dB meter model, bird ID protocol, dates, statistics |\n' +
        '| **R**esults | Data and analysis (no interpretation) | Tables, scatter plot, regression equation, p-values |\n' +
        '| **a**nd | — | — |\n' +
        '| **D**iscussion | Interpretation, limitations, implications, future work | Correlation ≠ causation, suggest noise barriers, need longitudinal study |\n\n' +
        '**Common logical errors in scientific reasoning:**\n\n' +
        '| Fallacy | What it looks like | Why it\'s wrong |\n' +
        '|---------|-------------------|---------------|\n' +
        '| **Affirming the consequent** | "If H then P. P observed. Therefore H." | Many hypotheses could predict P |\n' +
        '| **Post hoc ergo propter hoc** | "Rain came after the dance, so the dance caused rain" | Sequence ≠ causation |\n' +
        '| **Cherry-picking** | Reporting only the data points that support your hypothesis | Ignores contradictory evidence |\n' +
        '| **Appeal to authority** | "This scientist says so, therefore it\'s true" | Scientists can be wrong; evidence matters |',
      advancedContent:
        '**The scientific method in historical perspective:**\n\n' +
        '| Era | Contribution | Key figures |\n' +
        '|-----|-------------|-------------|\n' +
        '| Ancient Greece | Logical deduction, geometry, early empiricism | Aristotle, Archimedes |\n' +
        '| Islamic Golden Age | Systematic experimentation, optics, algebra | Ibn al-Haytham, Al-Khwarizmi |\n' +
        '| Renaissance | Controlled experiment, mathematical physics | Galileo, Bacon |\n' +
        '| Enlightenment | Hypothesis testing, taxonomy, chemistry | Newton, Linnaeus, Lavoisier |\n' +
        '| 19th century | Statistics, germ theory, evolution | Darwin, Pasteur, Galton |\n' +
        '| 20th century | Falsificationism, paradigm shifts, statistical testing | Popper, Kuhn, Fisher |\n' +
        '| 21st century | Big data, machine learning, reproducibility reform | Open science movement |\n\n' +
        '**How the method adapts to different sciences:**\n\n' +
        '| Science | Can you run controlled experiments? | What replaces experiments? |\n' +
        '|---------|-----------------------------------|---------------------------|\n' +
        '| Physics, chemistry | Yes — lab experiments | — |\n' +
        '| Ecology, field biology | Sometimes — natural experiments, mesocosms | Observational studies, modelling |\n' +
        '| Astronomy | No — can\'t manipulate stars | Observation + mathematical prediction |\n' +
        '| Geology, palaeontology | No — can\'t replay Earth\'s history | Comparative evidence, radiometric dating |\n' +
        '| Medicine | Yes — clinical trials | Epidemiology when trials are unethical |\n\n' +
        '**The Deepor Beel study — what a reviewer would ask:**\n\n' +
        '| Reviewer concern | Student\'s response |\n' +
        '|-----------------|-------------------|\n' +
        '| "Only 4 weekends of data — too little?" | "Agreed. A full-year study covering monsoon and post-monsoon would strengthen the findings." |\n' +
        '| "Did you control for time of day? Birds are more active at dawn." | "All counts were done 06:00–08:00. Added to methods." |\n' +
        '| "How do you know construction noise, specifically, is the issue vs general urbanisation?" | "We can\'t separate them with this design. Recommend a noise-barrier intervention study." |\n' +
        '| "Pearson r assumes linearity — did you check?" | "Residuals vs fitted plot showed no pattern. Added to supplementary materials." |\n\n' +
        'This back-and-forth IS the scientific method in action — not just the hypothesis-experiment-conclusion cycle taught in textbooks, but the messy, iterative, self-correcting process that actually builds reliable knowledge.',
    },
  ],
};
