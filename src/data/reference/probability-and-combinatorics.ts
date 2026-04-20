import type { ReferenceGuide } from '../reference';
import { practiceProbability } from '../practice-probability';

export const guide: ReferenceGuide = {
  slug: 'probability-and-combinatorics',
  title: 'Probability & Combinatorics',
  category: 'math',
  icon: '🎲',
  tagline:
    'The mathematics of chance — from coin flips to predicting monsoon rainfall.',
  relatedStories: ['fishermans-daughter-storm', 'golden-hilsa', 'mishing-fish'],
  understand: [
    {
      title: 'What Is Probability?',
      beginnerContent:
        'Roll the dice in the diagram above. Run a few hundred trials. Watch the empirical frequencies settle toward the theoretical probabilities — 1/6 for each face. That convergence isn\'t magic; it\'s the simple-but-deep rule the whole subject rests on.\n\n' +
        '**The basics:**\n\n' +
        'Probability measures how likely an event is, as a number between **0** (impossible) and **1** (certain).\n\n' +
        '`P(event) = favourable outcomes / total outcomes`\n\n' +
        '**Examples:**\n\n' +
        '| Experiment | Favourable | Total | Probability |\n' +
        '|-----------|-----------|-------|-------------|\n' +
        '| Coin flip: heads | 1 | 2 | 1/2 = 0.5 |\n' +
        '| Die roll: a 4 | 1 | 6 | 1/6 = 0.167 |\n' +
        '| Die roll: even | 3 | 6 | 1/2 = 0.5 |\n\n' +
        'The set of all possible outcomes is the **sample space** — for a coin it is {H, T}, for a die it is {1, 2, 3, 4, 5, 6}.\n\n' +
        '**Key rules:**\n\n' +
        '- Probabilities can be expressed as fractions, decimals, or percentages\n' +
        '- **Complement:** P(NOT event) = 1 − P(event). If P(rain) = 0.3, then P(no rain) = 0.7\n' +
        '- All probabilities in a sample space sum to exactly **1**\n\n' +
        'This framework underpins weather forecasting, medical diagnosis, insurance pricing, and every machine learning algorithm.',
      intermediateContent:
        '**Addition rules:**\n\n' +
        '- **Mutually exclusive:** `P(A or B) = P(A) + P(B)`\n' +
        '- **Non-exclusive:** `P(A or B) = P(A) + P(B) - P(A and B)`\n\n' +
        '**Example:** Drawing from a standard deck, P(heart or queen):\n\n' +
        '| Part | Count | Probability |\n' +
        '|------|-------|-------------|\n' +
        '| Hearts | 13 | 13/52 |\n' +
        '| Queens | 4 | 4/52 |\n' +
        '| Queen of hearts (overlap) | 1 | -1/52 |\n' +
        '| **Total** | **16** | **16/52 = 4/13** |\n\n' +
        '**Complementary counting trick:** P(at least one heads in 3 flips) = 1 - P(no heads) = 1 - (1/2)³ = **7/8**. Often easier than computing the event directly.',
      advancedContent:
        'The addition rule from intermediate — P(A or B) with overlap — is useful. But in practice, most interesting probability questions aren\'t about "A or B" at all. They\'re about **"at least one"**, which lives at the edge of where direct counting breaks down.\n\n' +
        '**The complement flip — the single most useful trick in probability.** What\'s the probability of rolling **at least one 6** in four rolls of a die?\n\n' +
        'Try it the direct way: P(exactly one 6) + P(exactly two 6s) + P(three 6s) + P(four 6s). Four separate cases, each with its own multiplication. Painful.\n\n' +
        'Now flip it. **P(at least one 6) = 1 − P(zero 6s).** "Zero 6s" is one clean case — every roll is a non-6, and the rolls are independent, so just multiply:\n\n' +
        '| Step | Work |\n' +
        '|------|------|\n' +
        '| P(not 6 on one roll) | 5/6 |\n' +
        '| P(not 6 on four rolls) | (5/6)⁴ = 625/1296 ≈ 0.482 |\n' +
        '| P(at least one 6) | 1 − 0.482 = **0.518** |\n\n' +
        'Just over half — slightly surprising on its own. But the real power of the complement shows up on a problem that looks impossibly hard.\n\n' +
        '**The Birthday Problem — everyone guesses wrong.** In a room of 23 people, what\'s the probability at least two share a birthday?\n\n' +
        'Most people guess near 5%. The actual answer: **just over 50%**.\n\n' +
        'Flip to the complement. P(all different) is a straight product: first person can be any of 365, second must avoid 1 (so 364/365), third avoids 2 (so 363/365), and so on:\n\n' +
        '`P(all different) = (365/365) × (364/365) × (363/365) × ... × (343/365)`\n\n' +
        '| People | P(all different) | P(at least one match) |\n' +
        '|--------|-----------------|----------------------|\n' +
        '| 10 | 0.883 | 11.7% |\n' +
        '| 23 | 0.493 | **50.7%** |\n' +
        '| 30 | 0.294 | 70.6% |\n' +
        '| 50 | 0.030 | 97.0% |\n\n' +
        'Why does intuition fail so badly? Because people mentally substitute a different question: *"what\'s the chance someone shares **my** birthday?"* That\'s the question that needs ~253 people for 50-50. The actual question — *"do **any two** people share **any** birthday?"* — involves C(23, 2) = 253 possible pairs of people, which is why 23 turns out to be enough.\n\n' +
        'Once you\'ve seen the birthday problem, you start noticing that *most* surprising probability results — quality control statistics, hash collisions, password cracking, why your phone keeps offering the same "random" song — all hinge on the same idea: **when you have many chances, "something unusual happens" becomes almost certain.** And the complement flip is almost always how you actually calculate it.',
      diagram: 'ProbabilityDiceDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import random\n\n# Simulate rolling two dice 10,000 times\ntrials = 10000\ncount_seven = 0\nfor _ in range(trials):\n    d1 = random.randint(1, 6)\n    d2 = random.randint(1, 6)\n    if d1 + d2 == 7:\n        count_seven += 1\n\ntheory = 6/36  # 6 ways to make 7 out of 36\nprint(f"P(sum = 7) theory:  {theory:.4f}")\nprint(f"P(sum = 7) simulated: {count_seven/trials:.4f}")\nprint(f"Trials: {trials}")', title: 'Try it — Dice Probability' } },
    },
    {
      title: 'Permutations and Combinations',
      beginnerContent:
        'Try the counter in the diagram above. Move n and r. Toggle between "order matters" (permutations) and "order doesn\'t" (combinations). For small n and r, every arrangement or group is actually listed out — so you can *see* why P(5,3) = 60 and C(5,3) = 10. Once the visual lands, the formulas stop being mysterious.\n\n' +
        '**Building the counting formulas from a simple question.**\n\n' +
        'You have 5 friends: Anu, Bina, Charu, Deepa, Eka. You need to pick 3 to form a team.\n\n' +
        '**First question: does the ORDER matter?**\n\n' +
        '**If order matters** (say, picking captain, vice-captain, treasurer):\n\n' +
        '- For captain: 5 choices\n' +
        '- For vice-captain: 4 remaining\n' +
        '- For treasurer: 3 remaining\n' +
        '- Total: 5 × 4 × 3 = **60** arrangements\n\n' +
        'This is a **permutation**: pick r items from n, order matters. The formula is just "multiply the countdown":\n' +
        'nPr = n × (n−1) × (n−2) × ... (r terms) = **n! / (n−r)!**\n\n' +
        '5P3 = 5! / 2! = 120/2 = **60** ✓\n\n' +
        '**If order does NOT matter** (just picking a team of 3, no roles):\n\n' +
        'The team {Anu, Bina, Charu} is the same as {Charu, Anu, Bina}. How many times did we overcount?\n\n' +
        'Each group of 3 can be rearranged in 3! = 3 × 2 × 1 = **6** ways. So we overcounted by 6.\n\n' +
        'Divide: 60 ÷ 6 = **10** teams\n\n' +
        'This is a **combination**: nCr = nPr / r! = **n! / (r! × (n−r)!)**\n\n' +
        '5C3 = 5! / (3! × 2!) = 120 / (6 × 2) = **10** ✓\n\n' +
        '**Check by listing:** ABC, ABD, ABE, ACD, ACE, ADE, BCD, BCE, BDE, CDE — exactly **10**.\n\n' +
        '**The key insight:** Combination = Permutation ÷ (ways to rearrange the chosen items). Every counting formula comes from this one idea.',
      intermediateContent:
        '**With repetition:**\n\n' +
        '| Type | Formula | Example |\n' +
        '|------|---------|--------|\n' +
        '| Permutations w/ repetition | n^r | 4-digit PIN from 0-9: 10^4 = **10,000** |\n' +
        '| Combinations w/ repetition (stars & bars) | C(n+r-1, r) | 10 chocolates among 3 kids: C(12,10) = **66** |\n\n' +
        '**Pascal\'s triangle** encodes combinations: row n contains C(n,0), C(n,1), ..., C(n,n). Each entry is the sum of the two above it:\n\n' +
        '`C(n, r) = C(n-1, r-1) + C(n-1, r)`',
      advancedContent:
        'Combinations aren\'t just for counting teams. They hide inside algebra too — and that connection turns out to be deep.\n\n' +
        '**The Binomial Theorem — combinations as algebra.** Expand (a + b)³ the long way: (a+b)(a+b)(a+b). When you multiply three brackets together, each term in the result is a choice — from each bracket, pick either a or b. The product a²b means "pick a from 2 brackets, pick b from 1." How many ways can you choose which 1 bracket gives you b? **C(3,1) = 3.** So the coefficient of a²b is 3:\n\n' +
        '`(a + b)³ = C(3,0)·a³ + C(3,1)·a²b + C(3,2)·ab² + C(3,3)·b³ = a³ + 3a²b + 3ab² + b³`\n\n' +
        'This isn\'t a coincidence. The general formula is:\n\n' +
        '`(a + b)ⁿ = Σ C(n,k) · aⁿ⁻ᵏ · bᵏ` (summed for k from 0 to n)\n\n' +
        'Every coefficient in any binomial expansion is a combination. The rows of Pascal\'s triangle you saw in intermediate are *literally* these coefficients.\n\n' +
        '**Worked example:** find the coefficient of x³ in (2x + 3)⁵. We need three brackets to contribute 2x, two to contribute 3: C(5,3) · (2x)³ · (3)² = 10 · 8x³ · 9 = **720x³**. One formula, answer in seconds.\n\n' +
        '**From counting to certainty — the Pigeonhole Principle.** Here\'s one more combinatorial idea that looks so obvious it barely seems worth stating:\n\n' +
        '*If you put n+1 pigeons into n holes, at least one hole must contain 2 or more pigeons.*\n\n' +
        'Proof: one line. If every hole had ≤ 1 pigeon, the total would be ≤ n < n+1. Contradiction. ∎\n\n' +
        'Trivial, right? But it\'s one of the sharpest tools in combinatorics precisely because it converts *"some configuration exists"* into *absolute certainty*. No probability, no maybe — a mathematical guarantee. Examples:\n\n' +
        '| Claim | Why Pigeonhole proves it |\n' +
        '|-------|--------------------------|\n' +
        'In any group of **13 people**, at least 2 share a birth month | 13 pigeons, 12 holes (months) |\n' +
        'In any group of **367 people**, at least 2 share a birthday | 367 pigeons, 366 holes (days, including Feb 29) |\n' +
        'Among any 5 integers, at least 2 have the same remainder mod 4 | 5 pigeons, 4 holes (remainders 0,1,2,3) |\n' +
        'If you hash 10 items into 8 buckets, at least one bucket has a collision | 10 pigeons, 8 holes |\n\n' +
        'That last one connects to computer science: hash tables, cryptographic collision attacks, memory allocation schemes — all have Pigeonhole sitting underneath. And together with the Birthday Problem from section 1, it captures both sides of the same story: **Pigeonhole tells you when collisions are certain, the Birthday calculation tells you when they become likely.** Combinations sit at the heart of both.',
      diagram: 'CombinatoricsGridDiagram',
    },
    {
      title: 'Independent vs Dependent Events',
      beginnerContent:
        'Play with the tree above. Toggle between "with replacement" (independent) and "without replacement" (dependent). Watch the second-level probabilities update. Click any leaf to see its path probability calculated. **The visible difference between the two modes is exactly what "independent vs dependent" means.**\n\n' +
        '**Independent events:** One event does NOT affect the other.\n\n' +
        '`P(A and B) = P(A) x P(B)`\n\n' +
        '| Scenario | Calculation | Result |\n' +
        '|----------|-----------|--------|\n' +
        '| Heads twice in a row | 1/2 x 1/2 | 1/4 |\n' +
        '| Roll 6 three times | (1/6)³ | 1/216 |\n\n' +
        'Flipping a coin twice: the first flip has zero effect on the second.\n\n' +
        '**Dependent events:** The first outcome changes the second\'s probability.\n\n' +
        '**Example: Drawing aces without replacement**\n\n' +
        '| Draw | Aces left | Cards left | Probability |\n' +
        '|------|----------|-----------|-------------|\n' +
        '| 1st ace | 4 | 52 | 4/52 |\n' +
        '| 2nd ace | 3 | 51 | 3/51 |\n' +
        '| **Both** | | | **(4/52)(3/51) = 1/221** |\n\n' +
        'With replacement it would be (4/52)² = 1/169. The distinction matters in real-world situations — the probability of a second monsoon storm depends heavily on whether a first already formed.',
      intermediateContent:
        '**Multiplication rule for many events:**\n\n' +
        '- **Independent:** `P(A1 and A2 and ... An) = P(A1) x P(A2) x ... x P(An)`\n' +
        '- Rolling a 6 five times: (1/6)^5 = 1/7776 = 0.000129\n\n' +
        '**Dependent (chain rule):** `P(A and B and C) = P(A) x P(B|A) x P(C|A and B)`\n\n' +
        'Drawing 3 aces without replacement: (4/52)(3/51)(2/50) = 24/132,600 = **1 in 5,525**.',
      advancedContent:
        '"Two events are independent if P(A and B) = P(A) × P(B)." Straightforward. But when you have **three or more** events, the definition of independence gets slippery in a way that catches even trained mathematicians.\n\n' +
        '**Pairwise independence is not the same as mutual independence.** Here\'s a minimal example that shows the trap.\n\n' +
        'Toss two fair coins. Define three events:\n\n' +
        '- **A** = "first coin is heads"\n' +
        '- **B** = "second coin is heads"\n' +
        '- **C** = "both coins show the same face"\n\n' +
        'Check each pair:\n\n' +
        '| Pair | P(both) | P × P | Independent? |\n' +
        '|------|---------|-------|--------------|\n' +
        '| A and B | P(HH) = 1/4 | (1/2)(1/2) = 1/4 | ✓ |\n' +
        '| A and C | P(HH) = 1/4 | (1/2)(1/2) = 1/4 | ✓ |\n' +
        '| B and C | P(HH) = 1/4 | (1/2)(1/2) = 1/4 | ✓ |\n\n' +
        'Every pair is independent. But are they **jointly** independent?\n\n' +
        '`P(A ∧ B ∧ C) = P(HH) = 1/4`\n' +
        '`P(A) × P(B) × P(C) = (1/2)(1/2)(1/2) = 1/8`\n\n' +
        '**Not equal.** The three events are pairwise independent but NOT mutually independent. And you can see why intuitively: if I tell you A happened (first coin is heads) AND B happened (second coin is heads), I\'ve completely determined C (both faces match). The third event carries no independent information, even though it looks independent from any single other.\n\n' +
        'This matters whenever you\'re reasoning about multiple pieces of evidence. "My smoke alarm went off" and "I smelled something burning" might look independent if you only check pairs — but together they both point at the same fire, and treating them as triply independent will give wrong answers.\n\n' +
        '**Why conditional probability is the honest way to handle dependence.** Instead of squinting at whether "pairs look independent," just write the **chain rule** from intermediate and use conditionals throughout:\n\n' +
        '`P(A ∧ B ∧ C) = P(A) · P(B | A) · P(C | A ∧ B)`\n\n' +
        'In the coin example, `P(C | A ∧ B) = 1` (because A and B determine C). Plug that in:\n\n' +
        '`P(A ∧ B ∧ C) = (1/2) · (1/2) · 1 = 1/4` ✓\n\n' +
        'The chain rule always gives the right answer because it never assumes independence — it *measures* the dependence directly.\n\n' +
        '**A longer worked example — drawing 3 aces from a deck without replacement:**\n\n' +
        '| Draw | Aces left | Cards left | Conditional P |\n' +
        '|------|----------|-----------|---------------|\n' +
        '| 1st ace | 4 | 52 | 4/52 |\n' +
        '| 2nd ace (given 1st was ace) | 3 | 51 | 3/51 |\n' +
        '| 3rd ace (given first two were aces) | 2 | 50 | 2/50 |\n\n' +
        '`P(3 aces) = (4/52) × (3/51) × (2/50) = 24 / 132,600 ≈ **1 in 5,525**`\n\n' +
        'Every step updates the conditional probability based on what already happened. **This chain of conditionals is exactly the machinery that Bayesian inference runs on** — which is the whole next section.',
      diagram: 'TreeDiagramProbability',
    },
    {
      title: 'Conditional Probability',
      beginnerContent:
        '[diagram:ConditionalProbDiagram]\n\n' +
        '**The question:** Given that B happened, what is the chance of A?\n\n' +
        '`P(A|B) = P(A and B) / P(B)`\n\n' +
        '**Example:** 60% of students pass maths, 40% pass both maths and science.\n\n' +
        'P(science | passed maths) = 0.40 / 0.60 = **2/3**\n\n' +
        '**Bayes\' Theorem — reversing the condition:**\n\n' +
        '[diagram:BayesTreeDiagram]\n\n' +
        '`P(A|B) = P(B|A) x P(A) / P(B)`\n\n' +
        '**Famous example: Medical testing**\n\n' +
        '| Given | Value |\n' +
        '|-------|-------|\n' +
        '| Disease prevalence | 1 in 1000 (0.001) |\n' +
        '| Test accuracy (true positive) | 99% |\n' +
        '| False positive rate | 1% |\n\n' +
        '**If you test positive, what is the chance you actually have it?**\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| True positives | 0.99 x 0.001 = 0.00099 |\n' +
        '| False positives | 0.01 x 0.999 = 0.00999 |\n' +
        '| P(disease given positive) | 0.00099 / 0.01098 = **~9%** |\n\n' +
        'A 99%-accurate test yields only a 9% chance of actually having the disease. The disease is so rare that false positives vastly outnumber true positives.\n\n' +
        'This is why doctors require confirmatory tests and why understanding conditional probability is essential for interpreting data.',
      intermediateContent:
        '**Bayes\' theorem in odds form:**\n\n' +
        '`posterior odds = prior odds x likelihood ratio`\n\n' +
        '| Step | Value |\n' +
        '|------|-------|\n' +
        '| Prior odds (disease) | 1 : 999 |\n' +
        '| Likelihood ratio | 0.99 / 0.01 = 99 |\n' +
        '| Posterior odds | (1/999) x 99 = 99:999 = ~1:10 |\n' +
        '| P(disease given positive) | ~1/11 = **~9%** |\n\n' +
        'The test "updates" your belief by a factor of 99, but the low base rate still dominates.',
      advancedContent:
        '**Applying Bayes\' theorem iteratively — updating beliefs with new evidence:**\n\n' +
        '[diagram:BayesUpdatingDiagram]\n\n' +
        'Return to the medical test. You tested positive, giving P(disease) = 9%. The doctor orders a second, independent test. You test positive again. What now?\n\n' +
        '| Round | Prior | Test result | Calculation | Posterior |\n' +
        '|-------|-------|-------------|-------------|----------|\n' +
        '| 1 | 0.001 (1 in 1000) | Positive | (0.99 × 0.001) / 0.01098 | **0.09** (9%) |\n' +
        '| 2 | 0.09 (from round 1) | Positive | (0.99 × 0.09) / (0.99×0.09 + 0.01×0.91) | **0.907** (91%) |\n\n' +
        '**Step by step for round 2:**\n\n' +
        'New prior = 0.09 (last round\'s result). Now:\n' +
        '- P(positive | disease) = 0.99, and prior P(disease) = 0.09 → true positives: 0.99 × 0.09 = 0.0891\n' +
        '- P(positive | no disease) = 0.01, and P(no disease) = 0.91 → false positives: 0.01 × 0.91 = 0.0091\n' +
        '- P(positive) = 0.0891 + 0.0091 = 0.0982\n' +
        '- P(disease | positive) = 0.0891 / 0.0982 = **0.907 (91%)**\n\n' +
        'Two positive tests took us from 0.1% to 91%. Each test multiplied the odds by 99 (the likelihood ratio).\n\n' +
        '**This is Bayesian updating:** Start with a belief (prior). See evidence. Compute new belief (posterior). The posterior becomes the prior for the next round.\n\n' +
        '**Why this matters beyond medicine:**\n\n' +
        '- **Spam filters:** Prior = 30% of emails are spam. Evidence = email contains "free money." P(spam | "free money") is much higher.\n' +
        '- **Weather forecasting:** Prior = 20% chance of rain. Evidence = barometer dropping. Updated P(rain) = 60%.\n' +
        '- **Criminal trials:** Prior = presumption of innocence. Evidence = DNA match. How much should the jury update?\n\n' +
        'Every time you update a belief based on evidence, you are doing Bayes\' theorem — whether you know it or not.',
    },
    {
      title: 'Expected Value',
      beginnerContent:
        'Play the game in the diagram above. Roll once and you could win nothing, ₹1, or ₹5. But hit "Roll 1000" and watch the running average march toward the dashed line — the **expected value**. The game\'s EV is built into the math; individual rolls scatter around it wildly, but enough rolls and the two lines must meet. Edit the payouts and see the EV shift in real time.\n\n' +
        '**What is expected value?**\n\n' +
        'The long-run average outcome: sum each outcome times its probability.\n\n' +
        '**Example: Fair die**\n\n' +
        '`EV = 1(1/6) + 2(1/6) + 3(1/6) + 4(1/6) + 5(1/6) + 6(1/6) = 3.5`\n\n' +
        'You never roll 3.5, but over thousands of rolls the average converges there (the **law of large numbers**).\n\n' +
        '**Should you play this game?**\n\n' +
        'Roll a 6 = win 100 rupees. Anything else = pay 20 rupees.\n\n' +
        '| Outcome | Probability | Payout |\n' +
        '|---------|-----------|--------|\n' +
        '| Roll 6 | 1/6 | +100 |\n' +
        '| Not 6 | 5/6 | -20 |\n' +
        '| **EV** | | **(1/6)(100) + (5/6)(-20) = 0** |\n\n' +
        'EV = 0 means the game is **fair**. If the payout were 150, EV = +8.33 per game — play it!\n\n' +
        'Insurance companies, casinos, and stock traders all build strategies around EV, always seeking positive expected value.',
      intermediateContent:
        '**Variance and standard deviation:**\n\n' +
        '`Var(X) = E[(X - mu)²] = E[X²] - (E[X])²`\n\n' +
        '`sigma = sqrt(Var(X))`\n\n' +
        '**Example: Fair die**\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| E[X²] | (1+4+9+16+25+36)/6 | 91/6 |\n' +
        '| Var(X) | 91/6 - (3.5)² | 2.917 |\n' +
        '| sigma | sqrt(2.917) | **1.71** |\n\n' +
        '**Chebyshev inequality:** `P(|X - mu| >= k*sigma) <= 1/k²` — at least 75% of data lies within 2 sigma of the mean, for ANY distribution.',
      advancedContent:
        '**The Law of Large Numbers — seeing it work:**\n\n' +
        'Roll a die 10 times. Your average might be 4.2 (not 3.5). Roll 100 times: maybe 3.6. Roll 10,000 times: very close to 3.5.\n\n' +
        '| Rolls | Typical average | How far from 3.5? |\n' +
        '|-------|----------------|-------------------|\n' +
        '| 10 | 2.8 to 4.2 | ± 0.7 (far off) |\n' +
        '| 100 | 3.3 to 3.7 | ± 0.2 |\n' +
        '| 1,000 | 3.45 to 3.55 | ± 0.05 |\n' +
        '| 10,000 | 3.49 to 3.51 | ± 0.01 (very close) |\n\n' +
        'The LLN says: the sample average **must** converge to the expected value as the sample grows. Not "probably converges" — MUST.\n\n' +
        'This is why casinos always win. Each bet is random, but over millions of bets, the house\'s average profit converges to the house edge — guaranteed.\n\n' +
        '**Linearity of expectation — the most useful property:**\n\n' +
        'E[X + Y] = E[X] + E[Y]. **Always.** Even if X and Y are dependent.\n\n' +
        '**Example:** You roll 10 dice. What is the expected total?\n\n' +
        'E[one die] = 3.5. E[10 dice] = 10 × 3.5 = **35**. Done.\n\n' +
        'No need to enumerate 6¹⁰ = 60 million outcomes. Linearity makes it trivial.\n\n' +
        '**Harder example:** In a random arrangement of 52 cards, how many cards are in their "correct" position (card 1 in position 1, card 2 in position 2, etc.)?\n\n' +
        'Let Xᵢ = 1 if card i is in position i, else 0. P(Xᵢ = 1) = 1/52.\n' +
        'E[total matches] = E[X₁] + E[X₂] + ... + E[X₅₂] = 52 × (1/52) = **1**.\n\n' +
        'On average, exactly 1 card is in the right position — no matter how many cards there are! (For n cards, the answer is always 1.)',
      diagram: 'ExpectedValueDiagram',
      practice: practiceProbability,
    },
  ],
};
