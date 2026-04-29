import type { ReferenceGuide } from '../reference';
import { practiceRatios, practiceProportions, practicePercentages, practiceRealWorld } from '../practice-ratios';

export const guide: ReferenceGuide = {
  slug: 'ratios-and-proportions',
  title: 'Ratios, Proportions & Percentages',
  category: 'math',
  icon: '📐',
  tagline: 'The mathematics of comparison — from recipe scaling to population growth rates.',
  relatedStories: ['little-chef', 'grandmothers-pitha', 'holi-tea-gardens'],
  understand: [
    // ─────────────────────────────────────────────────────────────
    // 1. Ratios — Comparing Quantities
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Ratios — Comparing Quantities',
      beginnerContent:
        '**Tara is making *pitha*** — the rice cake her grandmother taught her. The recipe is simple: **2 cups of rice flour for every 1 cup of jaggery**. That "for every" is the key word.\n\n' +
        '[diagram:PithaRatioDiagram]\n\n' +
        'Whether she\'s making one pitha or fifty, the rule stays the same: twice as much flour as jaggery. We say the **ratio** of flour to jaggery is **2 : 1** (read "two to one").\n\n' +
        '**Three ways to write the same ratio.**\n\n' +
        '| Notation | Looks like | Read aloud |\n' +
        '|----------|-----------|-----------|\n' +
        '| Colon | 2 : 1 | "two to one" |\n' +
        '| Fraction | 2/1 or just 2 | "two to one" |\n' +
        '| Words | "2 parts to 1 part" | as is |\n\n' +
        'All three say exactly the same thing. The colon notation is the friendliest for ratios with more than two parts (3 : 4 : 7).\n\n' +
        '**Part-to-part vs part-to-whole.** Tara\'s pitha mix has 2 cups of flour, 1 cup of jaggery — 3 cups total.\n\n' +
        '| Comparison | Ratio |\n' +
        '|------------|-------|\n' +
        '| Flour to jaggery (part : part) | 2 : 1 |\n' +
        '| Flour to total mix (part : whole) | 2 : 3 |\n' +
        '| Jaggery to total mix (part : whole) | 1 : 3 |\n\n' +
        'Always check which question you\'re answering. "How much flour do I need *out of the mix*?" wants part-to-whole. "How much flour for each cup of jaggery?" wants part-to-part.\n\n' +
        '**Simplifying a ratio works just like simplifying a fraction.** Divide every term by the same number.\n\n' +
        '| Ratio | Common factor | Simplified |\n' +
        '|-------|---------------|------------|\n' +
        '| 12 : 8 | 4 | 3 : 2 |\n' +
        '| 250 : 1000 | 250 | 1 : 4 |\n' +
        '| 18 : 24 : 30 | 6 | 3 : 4 : 5 |\n\n' +
        '**Walked example — sharing 30 sweets in the ratio 2 : 3.**\n\n' +
        '| Step | Action | Result |\n' +
        '|------|--------|--------|\n' +
        '| 1 | Add the parts: 2 + 3 | 5 parts total |\n' +
        '| 2 | Each part = 30 ÷ 5 | 6 sweets per part |\n' +
        '| 3 | First share = 2 parts | 2 × 6 = **12 sweets** |\n' +
        '| 4 | Second share = 3 parts | 3 × 6 = **18 sweets** |\n' +
        '| 5 | Check: 12 + 18 | = 30 ✓ |\n\n' +
        '**Where ratios appear that you might not notice.**\n\n' +
        '| Place | Ratio in action |\n' +
        '|-------|-----------------|\n' +
        '| Map scale 1 : 50,000 | 1 cm on the map = 50,000 cm (500 m) on the ground |\n' +
        '| Water (H₂O) | Hydrogen to oxygen atoms = 2 : 1, always |\n' +
        '| Tea garden | 25 pickers per supervisor → 25 : 1 |\n' +
        '| Aspect ratios of screens | 16 : 9 (widescreen TV), 4 : 3 (older monitors), 21 : 9 (cinema) |\n' +
        '| Cricket strike rate | Runs per 100 balls — a ratio in disguise |\n\n' +
        '**Ratios are unit-free.** A 2 : 1 ratio is the same in cups, in grams, in tonnes. That is what makes ratios so portable — they describe a *relationship*, not a quantity. Scale everything by 10 and the ratio doesn\'t budge.\n\n' +
        '**Check yourself.** A class has 24 students. The boys-to-girls ratio is 5 : 3. How many boys, how many girls? *(Total parts = 5+3 = 8; each part = 24÷8 = 3 students; **15 boys, 9 girls**.)*',
      intermediateContent:
        '**Three-part ratios — splitting in proportion.** Splitting 750 g of dry mix in the ratio 2 : 3 : 5.\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|-------------|--------|\n' +
        '| 1 | Total parts: 2 + 3 + 5 | 10 |\n' +
        '| 2 | Each part: 750 ÷ 10 | 75 g |\n' +
        '| 3 | First portion: 2 × 75 | **150 g** |\n' +
        '| 4 | Second: 3 × 75 | **225 g** |\n' +
        '| 5 | Third: 5 × 75 | **375 g** |\n' +
        '| 6 | Check sum | 150 + 225 + 375 = 750 ✓ |\n\n' +
        '**Map scale problems.** A 1 : 50,000 map says: "1 cm on paper = 50,000 cm in real life." 50,000 cm = 500 m, so 1 cm on the map = 500 m on the ground.\n\n' +
        '*Q: A trail measured 4.6 cm on the map. How long is the actual trail?*\n\n' +
        '`actual = 4.6 × 50,000 cm = 230,000 cm = 2.3 km`\n\n' +
        '*Q: Two villages 8.5 km apart. How far apart on the map?*\n\n' +
        '`map distance = 8500 m / (500 m per cm) = 17 cm`\n\n' +
        '**Equivalent ratios.** 6 : 9 simplifies to 2 : 3. Multiply or divide every term by the same number to get an equivalent ratio. This is the key for proportion problems in the next section.',
      advancedContent:
        '**Dimensional analysis — ratios checking your physics homework.** Every formula in physics has units. A correct formula must have *consistent* units on both sides.\n\n' +
        'Kinetic energy: `E = ½ m v²`. Units: `[kg] × [m/s]² = kg·m²/s² = Joules` ✓.\n\n' +
        'If you mistakenly wrote `E = ½ m v` (forgetting the square), units become `kg·m/s` — that is *momentum*, not energy. Dimensional analysis catches the error before any numbers go in.\n\n' +
        '**Allometric scaling — biology in ratios.** Animals don\'t follow simple proportions. A mouse\'s heart beats ~600 times/min; an elephant\'s ~30 times/min. Their masses differ by a factor of ~250,000, but heart rate differs by only ~20×. Why?\n\n' +
        'Kleiber\'s law (1932): metabolic rate scales as `M^0.75`, where M is body mass. Bigger animals burn proportionally less energy per kilogram than smaller ones. The 0.75 exponent isn\'t magic — it falls out of how heat dissipates from a fractal-like circulatory network. Allometric ratios connect simple maths to deep biology.\n\n' +
        '**Why an ant can lift 50× its weight but an elephant cannot lift its own weight.** The square-cube law. Scale an animal by factor k:\n\n' +
        '| Quantity | Scales as |\n' +
        '|----------|-----------|\n' +
        '| Length | k |\n' +
        '| Cross-section of a muscle | k² |\n' +
        '| Body mass (volume × density) | k³ |\n\n' +
        'Strength ÷ weight scales as k² / k³ = 1/k. Double the size → halve the strength-to-weight ratio. An ant with k = 0.001 of human size has a k³/k² = 0.001 disadvantage in mass-per-cross-section, so its tiny legs can carry many times its tiny weight.',
      diagram: 'PithaRatioDiagram',
      practice: practiceRatios,
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Proportions — Scaling and Cross-Multiplication
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Proportions — Scaling and Cross-Multiplication',
      beginnerContent:
        '**Tara\'s pitha recipe feeds 4. Today she is cooking for 10 people.** What does she do? Multiply every ingredient by the same factor. Not just the flour. Not just the jaggery. *Every* ingredient, by the same number, so the ratios stay locked in.\n\n' +
        '[diagram:ScalingRecipeDiagram]\n\n' +
        'The factor is 10 ÷ 4 = **2.5**. Every quantity gets multiplied by 2.5. The flour-to-jaggery ratio stays 2 : 1 because both got the same treatment.\n\n' +
        '**A proportion is two ratios that are equal.** Tara\'s recipe gives the proportion `2 : 1 = 5 : 2.5`. Reading it: "two cups flour to one cup jaggery is the *same* relationship as five cups flour to 2.5 cups jaggery." Same recipe, different scale.\n\n' +
        '**Cross-multiplication — a shortcut for solving any proportion.** Given `a / b = c / d`:\n\n' +
        '`a × d = b × c`\n\n' +
        'Same equation, just multiplied through. If three of the four numbers are known, you can solve for the fourth.\n\n' +
        '**Walked example — buying tea.** Tara knows that 3 kg of tea costs ₹900. How much do 7 kg cost?\n\n' +
        '| Step | Reasoning | Equation |\n' +
        '|------|-----------|----------|\n' +
        '| 1 | Set up the proportion: cost is in fixed proportion to weight | 3 / 900 = 7 / x |\n' +
        '| 2 | Cross-multiply | 3x = 900 × 7 |\n' +
        '| 3 | Compute | 3x = 6300 |\n' +
        '| 4 | Solve | **x = ₹2,100** |\n\n' +
        '**Direct vs. inverse — which kind of proportion is this?**\n\n' +
        '| Direct proportion | Inverse proportion |\n' +
        '|-------------------|---------------------|\n' +
        '| When one quantity goes up, the other goes up by the **same factor** | When one quantity goes up, the other goes **down** by the same factor |\n' +
        '| Equation: `y = k · x` | Equation: `x · y = k` (constant product) |\n' +
        '| Hours worked vs. wages | Number of workers vs. days to finish a job |\n' +
        '| km driven vs. fuel used | Speed vs. travel time for a fixed distance |\n' +
        '| Cost of tea vs. weight bought | Number of taps filling a tank vs. time required |\n\n' +
        '**The inverse-proportion trick.** If 4 workers harvest a tea plot in 6 hours, how long for 8 workers?\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | Total work in worker-hours | 4 × 6 = 24 worker-hours |\n' +
        '| 2 | Same work, more workers | 24 / 8 |\n' +
        '| 3 | Time | **3 hours** |\n\n' +
        'Notice: doubling the workers halved the time. That is inverse proportion in action — the *product* (workers × time) stays constant.\n\n' +
        '**Check yourself.** If 5 kg of rice costs ₹200, how much for 12 kg? *(Direct proportion. 5/200 = 12/x → 5x = 2400 → **x = ₹480**.)*',
      intermediateContent:
        '**Inverse proportion — worked example.** If 6 workers complete a wall in 10 days, how many days for 15 workers (assuming equal output)?\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | Total work | 6 × 10 = 60 worker-days |\n' +
        '| 2 | Same work, 15 workers | 60 ÷ 15 |\n' +
        '| 3 | Days | **4 days** |\n\n' +
        '**Combined — direct AND inverse together.** If 8 machines produce 240 units in 6 hours, how many machines are needed to produce 450 units in 5 hours?\n\n' +
        '| Step | Reasoning | Result |\n' +
        '|------|-----------|--------|\n' +
        '| 1 | Find rate per machine per hour | 240 / (8 × 6) = 5 units/machine/hour |\n' +
        '| 2 | Want: 450 units in 5 hours | Total machine-hours needed = 450 / 5 = 90 |\n' +
        '| 3 | Machines needed in 5 hours | 90 / 5 = **18 machines** |\n\n' +
        '**Recipe scaling has limits in real life.** Cooking time does *not* scale linearly with quantity — heat penetrates a 5x batch much like a 1x batch (until it gets too thick). Salt and chili intensities also don\'t scale 1:1 because human taste is logarithmic, not linear. The math is correct; the kitchen has its own rules.',
      advancedContent:
        '**Square-cube law — when proportions break.** Scaling an animal by factor k:\n\n' +
        '- Length scales as k\n' +
        '- Surface area as k²\n' +
        '- Volume (and mass) as k³\n\n' +
        'For an ant scaled to human size, mass would multiply by ~10⁹ but its leg cross-section by only 10⁶. Result: legs that were strong enough at ant-scale would buckle at human-scale. This is why ants can carry 50× their body weight (cross-section dominant) but elephants struggle to lift their own (mass dominant).\n\n' +
        '**Allometric scaling in biology.** Empirically, body parts and rates do not scale linearly with mass. **Kleiber\'s law** (1932): basal metabolic rate ∝ mass^0.75. Heart rate ∝ mass^(−0.25). Lifespan ∝ mass^0.20. Why these particular exponents? They emerge from how blood vessels branch fractally to deliver oxygen efficiently, derived in the West-Brown-Enquist model.\n\n' +
        '**Pharmacology — why dosage by body surface area.** Many drugs are dosed per **body surface area** (BSA), not per kilogram. The Mosteller formula: `BSA = √(height × weight / 3600)` in m². Why surface area? Because metabolic clearance (the rate the liver/kidneys process the drug) scales with BSA more closely than with weight. Chemotherapy doses worldwide are calculated this way — a single proportional reasoning error can be lethal.',
      practice: practiceProportions,
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Percentages
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Percentages — Converting, Calculating, and Applying',
      beginnerContent:
        '**Tara walks into a tea shop. The sign says "Assam Tea — ₹500 / 500g".** She buys it. The shopkeeper rings up the bill: ₹500, plus 18% GST. The receipt totals ₹590. Where did the ₹90 come from?\n\n' +
        '[diagram:TeaShopGSTDiagram]\n\n' +
        '**A percentage is just a fraction with denominator 100.** "Per cent" comes from Latin *per centum* — "per hundred." Saying "18% GST" means 18 rupees of tax for every 100 rupees of price.\n\n' +
        '| Percentage | As a fraction | As a decimal |\n' +
        '|-----------|---------------|--------------|\n' +
        '| 50% | 50/100 = 1/2 | 0.5 |\n' +
        '| 25% | 25/100 = 1/4 | 0.25 |\n' +
        '| 10% | 10/100 = 1/10 | 0.10 |\n' +
        '| 18% | 18/100 = 9/50 | 0.18 |\n' +
        '| 7.5% | 75/1000 = 3/40 | 0.075 |\n\n' +
        '**Conversion shortcuts.**\n\n' +
        '| To go from | To | Do this |\n' +
        '|-----------|-----|---------|\n' +
        '| Percentage | Decimal | Move decimal point 2 places left (18% → 0.18) |\n' +
        '| Decimal | Percentage | Move decimal point 2 places right (0.075 → 7.5%) |\n' +
        '| Fraction | Percentage | Divide numerator by denominator, then multiply by 100 (3/8 = 0.375 = 37.5%) |\n' +
        '| Percentage | Fraction | Put over 100 and simplify (60% = 60/100 = 3/5) |\n\n' +
        '**Walked example — Tara\'s GST.**\n\n' +
        '| Step | Action | Result |\n' +
        '|------|--------|--------|\n' +
        '| 1 | 18% as a decimal | 0.18 |\n' +
        '| 2 | GST = 18% of 500 = 0.18 × 500 | ₹90 |\n' +
        '| 3 | Total = 500 + 90 | **₹590** |\n\n' +
        '**Walked example — pass percentage.** 72 students passed out of 90 who took the exam. What percent passed?\n\n' +
        '| Step | Action | Result |\n' +
        '|------|--------|--------|\n' +
        '| 1 | Fraction passing | 72/90 |\n' +
        '| 2 | Convert to decimal | 0.80 |\n' +
        '| 3 | Multiply by 100 | **80%** |\n\n' +
        '**Percentage change — increase or decrease.**\n\n' +
        '`Percent change = (New − Old) / Old × 100`\n\n' +
        '*Tea garden produced 12,000 kg last year, 13,800 kg this year. Percent increase?*\n\n' +
        '`(13,800 − 12,000) / 12,000 × 100 = 1800 / 12,000 × 100 = 15%`\n\n' +
        '**A trap that catches everyone.** A 50% increase followed by a 50% decrease does **not** return you to the original.\n\n' +
        '| Step | Calculation | Value |\n' +
        '|------|-------------|-------|\n' +
        '| Start | — | 100 |\n' +
        '| +50% | 100 × 1.50 | 150 |\n' +
        '| −50% | 150 × 0.50 | **75** (not 100!) |\n\n' +
        'Why? The 50% decrease is taken from 150, not from 100. You lose 75 (half of 150), not 50 (half of 100). Equal-percentage up-then-down always nets you a small loss.\n\n' +
        '**Check yourself.** A book costs ₹200 with 5% GST. What\'s the total? *(0.05 × 200 = 10. **₹210**.)*',
      intermediateContent:
        '**The percentage-trap formula.** A `+r%` increase followed by a `−r%` decrease changes the original value by\n\n' +
        '`(1 + r)(1 − r) = 1 − r²`\n\n' +
        'So a 20% up-and-down loses 0.04 = **4%** of the original. A 50% up-and-down loses 0.25 = **25%**. The bigger r, the bigger the loss.\n\n' +
        'But a `+25%` up followed by `−20%` down? `1.25 × 0.80 = 1.00` — back to original exactly. The percentages must be different (and one specific pair of values) to round-trip.\n\n' +
        '**Compound interest.** ₹10,000 at 8% per year for 5 years, compounded annually:\n\n' +
        '| Year | Balance |\n' +
        '|------|---------|\n' +
        '| 0 | ₹10,000.00 |\n' +
        '| 1 | 10,000 × 1.08 = ₹10,800.00 |\n' +
        '| 2 | 10,800 × 1.08 = ₹11,664.00 |\n' +
        '| 3 | 11,664 × 1.08 = ₹12,597.12 |\n' +
        '| 4 | 12,597.12 × 1.08 = ₹13,604.89 |\n' +
        '| 5 | 13,604.89 × 1.08 = **₹14,693.28** |\n\n' +
        'Formula: `Final = Principal × (1 + r)ⁿ`. The exponent is what makes compounding so powerful — and why starting to save early matters far more than saving more later.',
      advancedContent:
        '**The Rule of 72 — mental compounding.** At r% annual growth, money roughly doubles every `72/r` years.\n\n' +
        '| Rate r | Doubling time |\n' +
        '|--------|---------------|\n' +
        '| 6% | 12 years |\n' +
        '| 8% | 9 years |\n' +
        '| 12% | 6 years |\n' +
        '| 36% | 2 years |\n\n' +
        'Why 72? The exact formula is `t = ln(2) / ln(1 + r) ≈ 0.693 / r` (using ln(1+r) ≈ r for small r). Multiply numerator and denominator by 100: `t ≈ 69.3 / r%`. Why use 72 instead? It has more divisors (1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72) — easier to do mental arithmetic.\n\n' +
        '**Where the rule fails.** For r = 50% the rule says 1.44 years; the true answer is `ln 2 / ln 1.5 = 1.71` years. The approximation breaks down for big rates because `ln(1 + r) ≈ r` only when r is small.\n\n' +
        '**Why exponential thinking matters.** India\'s population growth at ~1% per year doubles in ~70 years. A bacterial colony at 100% per hour doubles every hour — within a day, one bacterium becomes 16 million. Climate carbon emissions, antibiotic-resistant bacteria, debt at usurious rates — all compound exponentially. Linear thinking ("a little each year is fine") underestimates the long-run impact every time.',
      practice: practicePercentages,
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Real-World Applications
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Real-World Applications',
      beginnerContent:
        '**Bipin\'s aunt runs a tea shop, and Bipin spends Saturdays helping her blend.** A signature blend is 60% Assam (strong, malty), 25% Darjeeling (light, floral), and 15% Nilgiri (smooth, aromatic). For every kilogram he packs, that\'s 600 g of Assam, 250 g of Darjeeling, 150 g of Nilgiri.\n\n' +
        '[diagram:TeaBlendingDiagram]\n\n' +
        'Get the percentages off by even 5 points and customers notice the next day. This is real-world ratio and percentage work — and it shows up in every field that mixes, measures, or compares.\n\n' +
        '**Tea industry numbers — the math behind every cup.**\n\n' +
        '| Quantity | Number | What it tells you |\n' +
        '|----------|--------|-------------------|\n' +
        '| Assam\'s share of India\'s tea | ~52% | India\'s biggest tea state — ratio of state output to national |\n' +
        '| Cups from 1 kg of CTC tea | ~450 | Cost-per-cup = price ÷ 450 |\n' +
        '| Cost per cup at ₹300/kg | ₹0.67 | Cheaper than the milk you add |\n' +
        '| Bipin\'s blend ratio | 60 : 25 : 15 | Adds to 100% — every part accounted for |\n\n' +
        '**Population analysis — percent change at scale.** India went from 361 million (1951) to 1.4 billion (2023).\n\n' +
        '| Step | Calc |\n' +
        '|------|------|\n' +
        '| Change | 1,400 − 361 = 1,039 million |\n' +
        '| As percentage | (1,039 / 361) × 100 = **288% increase** |\n\n' +
        'Assam grew 8 → 35 million, a 338% increase — faster than the national average. Decadal growth rate has been *slowing*: 35% in 1951–61, down to 17% in 2001–11. Government planners use these numbers to allocate schools, hospitals, water, electricity. Get the ratios wrong and a city is built without enough drains.\n\n' +
        '**Sports statistics — ratios disguised as performance.**\n\n' +
        '| Stat | What it is | Formula |\n' +
        '|------|-----------|---------|\n' +
        '| Cricket batting average | runs per dismissal | total runs / dismissals |\n' +
        '| Cricket strike rate | runs per 100 balls | (runs / balls) × 100 |\n' +
        '| Bowling strike rate | balls per wicket | balls / wickets |\n' +
        '| Football win % | (wins / total games) × 100 | — |\n\n' +
        'These let you compare a player who batted 50 times to one who batted 200 times — the absolute totals are misleading; the ratios are not.\n\n' +
        '**Health and dosing — when ratios save lives.**\n\n' +
        '| Setting | Ratio in action |\n' +
        '|---------|-----------------|\n' +
        '| BMI | weight (kg) / height (m)² — ratio of mass to area |\n' +
        '| Blood sodium-to-potassium | should sit near 28 : 1 — your nerves and heart depend on it |\n' +
        '| Pediatric drug dosing | adult dose × (child weight / 70 kg) |\n' +
        '| Hydration solution | 1 packet of ORS in 1 litre of water — get the ratio wrong and dehydration worsens |\n\n' +
        '**Check yourself.** A football team plays 25 matches and wins 17. What is their win percentage? *((17/25) × 100 = **68%**.)*',
      intermediateContent:
        '**Unit pricing — comparing value across different quantities.**\n\n' +
        '| Brand | Pack size | Price | Per gram |\n' +
        '|-------|-----------|-------|----------|\n' +
        '| A | 500 g | ₹450 | 450/500 = **₹0.90 / g** |\n' +
        '| B | 250 g | ₹280 | 280/250 = ₹1.12 / g |\n\n' +
        'Brand A is cheaper *per gram* despite costing more in absolute terms. Always divide to compare.\n\n' +
        '**Improving an average — the cricket conundrum.** A batter has 2,400 runs in 45 innings. What does she need to score in her next 5 innings to raise her average to 55.00?\n\n' +
        '| Step | Reasoning | Result |\n' +
        '|------|-----------|--------|\n' +
        '| 1 | New target total | 55 × 50 = 2,750 runs |\n' +
        '| 2 | Runs still needed | 2,750 − 2,400 = 350 |\n' +
        '| 3 | Per innings (over 5) | 350 / 5 = **70 runs per innings** |\n\n' +
        'A current average of 53.33 plus 350 runs in 5 innings raises her career average to 55. Simple division — but the strategic implication ("I need *centuries*, not fifties") changes the player\'s mindset.',
      advancedContent:
        '**Epidemiology — ratios that decide policy.**\n\n' +
        '| Term | Definition | Example |\n' +
        '|------|-----------|---------|\n' +
        '| Incidence rate | new cases / population / time | 50 new flu cases per 10,000 people per week |\n' +
        '| Prevalence | total current cases / population | 6% of adults have diabetes (a stock) |\n' +
        '| Reproduction number R₀ | avg new infections per infected person | R₀ = 2 → outbreak grows; R₀ < 1 → it shrinks |\n' +
        '| Case fatality rate | deaths / cases | 1.2% — a percentage of severity |\n\n' +
        '**Herd immunity threshold.** To stop an outbreak with reproduction number R₀, a fraction `1 − 1/R₀` of the population must be immune (vaccinated or recovered).\n\n' +
        '| Disease | Typical R₀ | Required immunity |\n' +
        '|---------|-----------|-------------------|\n' +
        '| Measles | 12–18 | 92–94% |\n' +
        '| Polio | 5–7 | 80–86% |\n' +
        '| Smallpox | 5–7 | 80–86% |\n' +
        '| Influenza | 1.3–1.8 | 23–44% |\n' +
        '| COVID-19 (Omicron) | ~10 | ~90% |\n\n' +
        'These percentages are *life-and-death policy numbers*. The reason measles vaccination targets 95%+ is the math: at 90% coverage, R₀ × (1 − 0.90) = 12 × 0.10 = 1.2 > 1, so outbreaks still spread.',
      practice: practiceRealWorld,
    },
  ],
};
