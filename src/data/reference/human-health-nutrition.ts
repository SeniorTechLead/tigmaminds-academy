import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'human-health-nutrition',
  title: 'Human Health & Nutrition',
  category: 'health-medicine',
  icon: '🍎',
  tagline: 'What your body needs, how diseases spread, and why sleep matters more than you think.',
  relatedStories: ['grandmothers-pitha', 'little-chef', 'holi-tea-gardens'],
  understand: [
    // ── Section 1: The Big Picture ──────────────────────────────
    {
      title: 'Your Body\'s Three Fuels',
      diagram: 'MacronutrientPlateDiagram',
      beginnerContent:
        'Imagine your body as a machine. Every machine needs fuel. Your body runs on **three types of fuel** — and each one does a completely different job:\n\n' +
        '| Fuel | What it does | Energy per gram | Think of it as... |\n' +
        '|------|-------------|-----------------|--------------------|\n' +
        '| **Carbohydrates** | Instant and sustained energy | 4 kcal/g | Petrol in a car |\n' +
        '| **Proteins** | Build and repair | 4 kcal/g | Bricks and cement |\n' +
        '| **Fats** | Long-term storage, insulation, hormones | 9 kcal/g | A backup battery |\n\n' +
        'Your body **cannot substitute** one for another. You can\'t build muscle out of rice, and you can\'t run on protein alone. Each fuel has a role.\n\n' +
        '**Try the diagram above** — switch between an *Assamese meal*, a *balanced meal*, and an *athlete\'s meal* to see how the proportions change.\n\n' +
        '**Quick check:** If fats give 9 kcal per gram but carbs only give 4, why doesn\'t your body just burn fat all the time?\n\n' +
        '*Because fat is harder to break down. Carbohydrates are fast fuel — ready in minutes. Fat is slow fuel — your body saves it for when carbs run out.*',
      intermediateContent:
        '**How much of each do you need?**\n\n' +
        'The Indian Council of Medical Research (ICMR) recommends:\n\n' +
        '| Macronutrient | % of daily calories | For a 2,000 kcal diet |\n' +
        '|---------------|--------------------|-----------------------|\n' +
        '| Carbohydrates | 55–65% | 275–325 g |\n' +
        '| Proteins | 10–15% | 50–75 g |\n' +
        '| Fats | 20–30% | 44–67 g |\n\n' +
        'A typical Assamese *bhaat-dail-maas* (rice-dal-fish) meal:\n\n' +
        '| Food | Serving | Carbs | Protein | Fat | Calories |\n' +
        '|------|---------|-------|---------|-----|----------|\n' +
        '| Steamed rice | 300 g | 78 g | 6 g | 1 g | 345 |\n' +
        '| Masoor dal | 150 g | 15 g | 12 g | 1 g | 117 |\n' +
        '| Rohu fish curry | 100 g | 2 g | 20 g | 5 g | 133 |\n' +
        '| Mustard oil | 1 tbsp | 0 g | 0 g | 14 g | 126 |\n' +
        '| **Total** | | **95 g** | **38 g** | **21 g** | **721** |\n\n' +
        'This single meal provides ~36% of daily calories. The carb:protein:fat ratio is roughly 53:21:26 — close to balanced, though carb-heavy (typical for rice-based diets).',
      advancedContent:
        '**Why 4-4-9?** The energy content of macronutrients comes from their chemical bonds.\n\n' +
        '| Macronutrient | Bond type | Oxidation pathway | ATP yield |\n' +
        '|---------------|-----------|-------------------|-----------|\n' +
        '| Glucose (C₆H₁₂O₆) | C-H, C-O | Glycolysis → Krebs → ETC | ~36-38 ATP |\n' +
        '| Palmitate (C₁₆H₃₂O₂) | Many C-H | β-oxidation → Krebs → ETC | **129 ATP** |\n' +
        '| Alanine (amino acid) | C-H, C-N, C-O | Deamination → Krebs | ~15 ATP |\n\n' +
        'Fats yield more ATP per gram because they have more C-H bonds (high hydrogen:oxygen ratio). Each C-H bond releases energy when oxidised. Glucose is already partially oxidised (it contains oxygen atoms), so it yields less.\n\n' +
        'The **Atwater factors** (4-4-9) are averages. Real values vary: alcohol yields 7 kcal/g, soluble fiber ~2 kcal/g (fermented by gut bacteria into short-chain fatty acids).',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each macronutrient to its primary role',
          pairs: [
            ['Carbohydrates', 'Primary energy source — rice, potatoes, bread (4 kcal/g)'],
            ['Proteins', 'Building and repair — muscles, enzymes, antibodies (4 kcal/g)'],
            ['Fats', 'Energy storage, insulation, cell membranes, hormones (9 kcal/g)'],
            ['Fiber', 'Indigestible carbohydrate — supports digestion and gut bacteria'],
          ],
        },
      },
    },

    // ── Section 2: Carbohydrates Deep Dive ─────────────────────
    {
      title: 'Carbohydrates: Quick vs Slow Energy',
      diagram: 'GlycaemicIndexDiagram',
      beginnerContent:
        'Not all carbohydrates are equal. Some hit your bloodstream like a fire hose. Others trickle in steadily.\n\n' +
        '**Simple carbohydrates** (sugars) are small molecules — glucose, fructose, sucrose. Your body absorbs them almost immediately. Eating a spoonful of sugar is like throwing paper on a fire: intense flame, quick burnout.\n\n' +
        '**Complex carbohydrates** (starches) are long chains of sugar molecules linked together. Your body must break them down link by link before absorbing them. Eating rice is like feeding logs to a fire: steady heat over hours.\n\n' +
        '**The Glycaemic Index (GI)** measures this speed on a scale of 0–100:\n\n' +
        '| Food | GI | Speed | What happens in your blood |\n' +
        '|------|-----|-------|---------------------------|\n' +
        '| Pure glucose | 100 | ⚡ Instant | Sharp spike, then crash |\n' +
        '| White rice | 73 | 🔥 Fast | High spike, drops within 2 hours |\n' +
        '| Brown rice | 50 | 🕐 Medium | Moderate rise, gradual decline |\n' +
        '| Lentils (dal) | 30 | 🐢 Slow | Gentle rise, sustained for hours |\n\n' +
        '**Try it above** — select different foods and watch how the blood glucose curve changes.\n\n' +
        '**Why does this matter?** When blood sugar spikes, your pancreas releases a burst of **insulin** to push the sugar into cells. Frequent spikes → your cells start ignoring insulin → **insulin resistance** → risk of Type 2 diabetes. Low-GI foods avoid the spike entirely.\n\n' +
        '**Fiber** is a special carbohydrate your body *cannot* digest. That sounds useless, but it\'s essential:\n' +
        '- It slows down sugar absorption (lowers GI of a meal)\n' +
        '- It feeds beneficial gut bacteria\n' +
        '- It adds bulk that keeps your digestive system moving\n\n' +
        'Vegetables, fruits, whole grains, and dal are rich in fiber. Polished white rice has most of its fiber removed — one reason brown rice has a lower GI.',
      intermediateContent:
        '**From mouth to cell — how carbohydrates are digested:**\n\n' +
        '| Stage | What happens | Enzyme | Product |\n' +
        '|-------|-------------|--------|--------|\n' +
        '| **Mouth** | Starch chains start breaking | Salivary amylase | Maltose (2-unit sugar) |\n' +
        '| **Stomach** | Amylase deactivated by acid | — | — |\n' +
        '| **Small intestine** | Starch breakdown resumes | Pancreatic amylase | Maltose, maltotriose |\n' +
        '| **Brush border** | Final split into single sugars | Maltase, sucrase, lactase | **Glucose**, fructose, galactose |\n' +
        '| **Absorption** | Sugars cross intestinal wall | SGLT1 (active), GLUT2 (passive) | Into blood → liver |\n' +
        '| **Cells** | Glucose enters via GLUT4 (insulin-dependent) | Insulin unlocks the gate | Fuel for glycolysis |\n\n' +
        '**Lactose intolerance** happens when the brush border enzyme **lactase** is absent. Undigested lactose reaches the colon, where bacteria ferment it → gas, bloating, diarrhea. ~65% of humans lose lactase activity after childhood; rates are high in East and South Asia.',
      advancedContent:
        '**Glycolysis — the universal sugar pathway (10 steps):**\n\n' +
        '`Glucose (6C) → 2 Pyruvate (3C) + 2 ATP + 2 NADH`\n\n' +
        '| Phase | Steps | Key enzymes | Energy |\n' +
        '|-------|-------|------------|--------|\n' +
        '| Investment | 1–5 | Hexokinase, PFK-1 (rate-limiting) | −2 ATP |\n' +
        '| Payoff | 6–10 | GAPDH, pyruvate kinase | +4 ATP, +2 NADH |\n' +
        '| **Net** | | | **+2 ATP, +2 NADH** |\n\n' +
        '**PFK-1** is the master switch: activated by AMP (cell is low on energy), inhibited by ATP and citrate (cell has enough). This is **allosteric feedback regulation** — the pathway automatically speeds up when energy is needed and slows when it\'s not.\n\n' +
        '**Gluconeogenesis** is glycolysis run in reverse (mostly) — the liver makes new glucose from lactate, amino acids, or glycerol during fasting. Three irreversible glycolysis steps are bypassed by different enzymes (pyruvate carboxylase, fructose-1,6-bisphosphatase, glucose-6-phosphatase). Cost: 4 ATP + 2 GTP per glucose — expensive, which is why your body prefers to store glycogen.',
    },

    // ── Section 3: Proteins ────────────────────────────────────
    {
      title: 'Proteins: The Body\'s Building Blocks',
      diagram: 'ProteinComplementDiagram',
      beginnerContent:
        'If carbohydrates are fuel, **proteins are the construction crew**. They build everything:\n\n' +
        '| Protein | Job | Where you find it |\n' +
        '|---------|-----|-------------------|\n' +
        '| **Collagen** | Structural — holds skin, bones, tendons together | Everywhere |\n' +
        '| **Hemoglobin** | Carries oxygen in red blood cells | Blood |\n' +
        '| **Antibodies** | Fight infections | Immune system |\n' +
        '| **Enzymes** (amylase, pepsin...) | Speed up chemical reactions | Digestive system, every cell |\n' +
        '| **Insulin** | Hormone — controls blood sugar | Pancreas |\n' +
        '| **Actin & Myosin** | Muscle contraction | Muscles |\n\n' +
        'Proteins are chains of **amino acids** — 20 different types, like letters in an alphabet. Your body can make 11 of them, but **9 must come from food** (essential amino acids).\n\n' +
        '**The problem with rice:** Rice is low in the amino acid **lysine**. If rice is your only protein source, you can\'t build complete proteins — like trying to write with a missing letter.\n\n' +
        '**The solution: protein complementation.** Dal (lentils) is rich in lysine but low in **methionine** — which rice has plenty of. **Rice + dal together = complete protein.** This is not a coincidence — it\'s why rice-and-dal is a staple across India.\n\n' +
        '**Try it above** — click "Combine" to see how rice and dal fill each other\'s amino acid gaps.\n\n' +
        'Other complete protein sources (all 9 essential amino acids): eggs, fish, meat, milk, soy.',
      intermediateContent:
        '**Protein quality — how do we measure it?**\n\n' +
        '| Score | Full name | Scale | Best use |\n' +
        '|-------|-----------|-------|----------|\n' +
        '| **PDCAAS** | Protein Digestibility Corrected Amino Acid Score | 0–1.0 | Standard (WHO/FAO) |\n' +
        '| **DIAAS** | Digestible Indispensable Amino Acid Score | 0–∞ | Newer, more accurate |\n\n' +
        '| Food | PDCAAS | Limiting amino acid |\n' +
        '|------|--------|--------------------|\n' +
        '| Egg | **1.00** | None — reference protein |\n' +
        '| Milk | **1.00** | None |\n' +
        '| Soy | **0.91** | Methionine (slightly low) |\n' +
        '| Rice | **0.50** | **Lysine** |\n' +
        '| Dal (lentils) | **0.52** | **Methionine** |\n' +
        '| Rice + Dal | **~0.80** | Gaps filled by complementation |\n\n' +
        '**Worked example — daily protein needs:**\n\n' +
        'A 50 kg teenager needs ~1.0 g protein/kg/day = **50 g protein**.\n\n' +
        '| Meal | Food | Protein (g) |\n' +
        '|------|------|-------------|\n' +
        '| Breakfast | 2 eggs + 1 roti | 14 + 3 = 17 |\n' +
        '| Lunch | Rice + dal + fish curry | 6 + 12 + 18 = 36 |\n' +
        '| Snack | Glass of milk | 8 |\n' +
        '| **Total** | | **61 g** ✓ |\n\n' +
        'This exceeds the minimum. The traditional NE Indian diet, with fish, eggs, dal, and fermented soy (*akhuni*), is naturally protein-rich.',
      advancedContent:
        '**Protein structure determines function — four levels:**\n\n' +
        '| Level | What it describes | Held together by |\n' +
        '|-------|------------------|------------------|\n' +
        '| **Primary** | Amino acid sequence (like a sentence) | Peptide bonds (covalent) |\n' +
        '| **Secondary** | Local folding — α-helices and β-sheets | Hydrogen bonds (backbone) |\n' +
        '| **Tertiary** | 3D shape of the whole chain | H-bonds, disulfide bridges, hydrophobic packing |\n' +
        '| **Quaternary** | Multiple chains assembled together | Same as tertiary |\n\n' +
        '**Denaturation** = unfolding. Heat (cooking an egg), acid (ceviche), or heavy metals disrupt the weak bonds holding tertiary structure. The amino acid chain is intact but loses its shape — and therefore its function.\n\n' +
        '**Amino acid metabolism:**\n\n' +
        'When proteins are consumed in excess of building needs, amino acids are **deaminated** (the -NH₂ group is removed as ammonia → converted to urea in the liver\'s **urea cycle** → excreted by kidneys). The remaining carbon skeleton enters the Krebs cycle at various points:\n\n' +
        '| Entry point | Amino acids |\n' +
        '|------------|-------------|\n' +
        '| Pyruvate | Alanine, serine, glycine |\n' +
        '| Acetyl-CoA | Leucine, isoleucine, lysine |\n' +
        '| α-ketoglutarate | Glutamate, glutamine, proline |\n' +
        '| Oxaloacetate | Aspartate, asparagine |\n\n' +
        'This is why excess protein calories still contribute to weight gain — the carbon skeletons are oxidised for energy or converted to fat.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Rice alone provides all 9 essential amino acids.', answer: false, explanation: 'Rice is low in lysine. Combining rice with dal (which is rich in lysine) provides all 9 essential amino acids.' },
            { text: 'Cooking an egg changes the protein\'s amino acid sequence.', answer: false, explanation: 'Cooking denatures the protein (unfolds its 3D shape) but the amino acid sequence stays the same. Only the shape and function change.' },
            { text: 'Your body can convert excess protein into stored fat.', answer: true, explanation: 'After deamination, the carbon skeleton of amino acids can enter the Krebs cycle and, if energy is already sufficient, be converted to fatty acids for storage.' },
            { text: 'Antibodies are a type of protein.', answer: true, explanation: 'Antibodies (immunoglobulins) are Y-shaped proteins made by B lymphocytes. They bind to specific antigens on pathogens and mark them for destruction.' },
          ],
        },
      },
    },

    // ── Section 4: Fats ────────────────────────────────────────
    {
      title: 'Fats: Not the Enemy',
      diagram: 'DigestiveSystemDiagram',
      beginnerContent:
        'Fat has a bad reputation. But your body *needs* it:\n\n' +
        '- **Energy reserve** — 1 kg of fat stores 7,700 kcal (enough to survive ~3 days without food)\n' +
        '- **Insulation** — keeps your organs warm and cushioned\n' +
        '- **Cell membranes** — every cell in your body is wrapped in a fat layer (phospholipid bilayer)\n' +
        '- **Vitamin absorption** — vitamins A, D, E, K dissolve only in fat\n' +
        '- **Hormones** — testosterone, estrogen, and cortisol are all made from cholesterol (a fat)\n\n' +
        'The key is **which type** of fat you eat:\n\n' +
        '| Type | Structure | Found in | Effect on health |\n' +
        '|------|-----------|----------|------------------|\n' +
        '| **Unsaturated** | Bent chains (liquid at room temp) | Mustard oil, fish, nuts, avocado | ✅ Heart-healthy |\n' +
        '| **Saturated** | Straight chains (solid at room temp) | Butter, ghee, red meat, coconut oil | ⚠️ OK in moderation |\n' +
        '| **Trans** | Artificially straightened | Vanaspati, fried fast food, packaged snacks | ❌ Harmful — avoid |\n\n' +
        '**Why is traditional Assamese cooking healthy?** Mustard oil (*sariyoh tel*) is rich in **omega-3** and **omega-6** fatty acids — unsaturated fats that lower inflammation and protect the heart. When industrial vanaspati (hydrogenated vegetable oil containing trans fats) replaced mustard oil in some kitchens, heart disease rates rose.\n\n' +
        '**Rule of thumb:** If a fat is liquid at room temperature (oils), it\'s mostly unsaturated. If it\'s solid (butter, ghee), it\'s mostly saturated.',
      intermediateContent:
        '**Fat digestion is unique** — fats don\'t dissolve in water, so they need special handling:\n\n' +
        '| Step | What happens | Why it\'s needed |\n' +
        '|------|-------------|----------------|\n' +
        '| **Bile salts** (from liver) emulsify fat | Break large fat globules into tiny droplets | Increases surface area for enzymes |\n' +
        '| **Pancreatic lipase** digests droplets | Breaks triglycerides → 2 fatty acids + 1 monoglyceride | These are small enough to absorb |\n' +
        '| **Micelles** carry products to intestinal wall | Tiny bile-coated packages ferry fat through the watery intestine | Fats can\'t travel alone in water |\n' +
        '| **Chylomicrons** transport fat in blood | Absorbed fats are packaged into protein-coated particles | Blood is water-based — fat needs a carrier |\n\n' +
        '**Cholesterol — two types:**\n\n' +
        '| Type | Full name | Role | Target |\n' +
        '|------|-----------|------|--------|\n' +
        '| **LDL** | Low-density lipoprotein | Delivers cholesterol TO arteries | < 100 mg/dL |\n' +
        '| **HDL** | High-density lipoprotein | Removes cholesterol FROM arteries | > 40 mg/dL |\n\n' +
        'LDL is "bad" because excess LDL deposits cholesterol in artery walls → plaque → atherosclerosis → heart attack. HDL is "good" because it carries cholesterol back to the liver for disposal. Unsaturated fats raise HDL; trans fats lower HDL *and* raise LDL — the worst combination.',
      advancedContent:
        '**β-oxidation — how your body burns fat for energy:**\n\n' +
        'Each cycle of β-oxidation clips a 2-carbon unit off the fatty acid chain as acetyl-CoA:\n\n' +
        '`Fatty acid (Cn) → Cn-2 + acetyl-CoA + 1 FADH₂ + 1 NADH`\n\n' +
        '**Worked example — palmitic acid (16 carbons):**\n\n' +
        '| Step | What happens | Energy produced |\n' +
        '|------|-------------|----------------|\n' +
        '| Activation | Fatty acid → fatty acyl-CoA | −2 ATP (investment) |\n' +
        '| β-oxidation | 7 cycles → 8 acetyl-CoA | 7 FADH₂ (= 10.5 ATP) + 7 NADH (= 17.5 ATP) |\n' +
        '| Krebs cycle | 8 acetyl-CoA oxidised | 8 × 10 = 80 ATP |\n' +
        '| ETC | NADH + FADH₂ from Krebs | 8 × 2.5 = 20 ATP (from 8 NADH) |\n' +
        '| **Total** | | **129 ATP** (net ~106 after activation) |\n\n' +
        'Compare: glucose yields ~36 ATP. Per gram, fat produces **2.5× more ATP** than carbohydrate — explaining the 9 vs 4 kcal/g difference.\n\n' +
        '**Ketogenesis** occurs when carbs are severely restricted (fasting, keto diet). The liver converts excess acetyl-CoA into **ketone bodies** (acetoacetate → β-hydroxybutyrate + acetone). The brain, which normally runs exclusively on glucose, can adapt to use ketone bodies for ~75% of its energy. However, prolonged ketosis lowers blood pH → **ketoacidosis** (dangerous in diabetics whose insulin can\'t regulate the process).\n\n' +
        '[diagram:MetabolicPathwayDiagram]',
    },

    // ── Section 5: Energy Balance ──────────────────────────────
    {
      title: 'Energy Balance & Your Metabolism',
      diagram: 'EnergyBalanceDiagram',
      beginnerContent:
        'Your body weight follows one simple equation:\n\n' +
        '> **Energy In − Energy Out = Change in Stored Energy**\n\n' +
        '- **Energy in** = everything you eat and drink (measured in kilocalories)\n' +
        '- **Energy out** = everything your body burns\n\n' +
        'If you eat more than you burn → surplus stored as fat → weight gain.\n' +
        'If you burn more than you eat → body uses stored fat → weight loss.\n' +
        'If they match → weight stays the same.\n\n' +
        'But "energy out" isn\'t just exercise. It has three parts:\n\n' +
        '| Component | % of total | What it is |\n' +
        '|-----------|-----------|------------|\n' +
        '| **BMR** (Basal Metabolic Rate) | 60–70% | Energy to keep you alive at complete rest — heartbeat, breathing, brain, temperature |\n' +
        '| **Physical activity** | 20–30% | Walking, playing, exercising |\n' +
        '| **Thermic effect of food** | ~10% | Energy to digest and absorb food |\n\n' +
        '**Surprising fact:** Most of your daily calories are burned just keeping you alive — not by exercise. A one-hour run burns ~400 kcal, but your BMR burns ~1,500 kcal while you sleep.\n\n' +
        '**Try the scale above** — move the activity slider and watch the energy balance tip.',
      intermediateContent:
        '**Calculate your own BMR:**\n\n' +
        '[diagram:BMRCalculatorDiagram]\n\n' +
        'The **Harris-Benedict equation**:\n\n' +
        '| Sex | Formula |\n' +
        '|-----|--------|\n' +
        '| Male | BMR = 88.36 + 13.4 × weight(kg) + 4.8 × height(cm) − 5.7 × age(yr) |\n' +
        '| Female | BMR = 447.6 + 9.25 × weight(kg) + 3.1 × height(cm) − 4.3 × age(yr) |\n\n' +
        '**Worked example:** A 15-year-old boy, 55 kg, 165 cm:\n\n' +
        '`BMR = 88.36 + (13.4 × 55) + (4.8 × 165) − (5.7 × 15)`\n' +
        '`    = 88.36 + 737 + 792 − 85.5`\n' +
        '`    = **1,532 kcal/day**`\n\n' +
        'For total daily expenditure, multiply by an activity factor:\n\n' +
        '| Activity level | Factor | Example | TDEE |\n' +
        '|----------------|--------|---------|------|\n' +
        '| Sedentary | × 1.2 | Desk/school all day | 1,838 |\n' +
        '| Light activity | × 1.375 | Walking to school, light chores | 2,107 |\n' +
        '| Moderate | × 1.55 | Sports 3–5 days/week | 2,374 |\n' +
        '| Very active | × 1.725 | Daily training | 2,643 |\n\n' +
        'This boy, if moderately active, burns ~2,374 kcal/day. If he eats 2,374 kcal → weight stays stable.',
      advancedContent:
        '**Why do metabolic rates differ between people?**\n\n' +
        '| Factor | Effect on BMR | Why |\n' +
        '|--------|-------------|-----|\n' +
        '| Muscle mass | ↑ BMR | Muscle burns ~6 kcal/kg/day at rest; fat burns ~2 |\n' +
        '| Age | ↓ BMR ~2%/decade | Muscle loss, lower hormone levels |\n' +
        '| Thyroid hormones | T₃/T₄ set the metabolic "thermostat" | Hyperthyroidism = high BMR, hypothyroidism = low |\n' +
        '| Body surface area | Taller people have higher BMR | More surface = more heat loss to maintain 37°C |\n' +
        '| Genetics | ±200 kcal variation | Polymorphisms in UCP1 (uncoupling protein) affect thermogenesis |\n\n' +
        '**Adaptive thermogenesis:** When you chronically under-eat, your BMR drops by 10–15% beyond what weight loss alone predicts. This is the "metabolic adaptation" that makes sustained weight loss difficult — your body actively resists starvation by becoming more efficient. The mechanism involves decreased leptin → reduced thyroid hormone conversion (T₄→T₃) → lower sympathetic nervous system tone.\n\n' +
        '**The FTO gene:** The most studied "obesity gene." The risk allele (carried by ~45% of South Asians) increases appetite and preference for high-calorie foods by affecting hypothalamic circuits. It does NOT make weight gain inevitable — it shifts the default. Carriers can fully compensate with diet and exercise.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each component of daily energy expenditure',
          pairs: [
            ['BMR', 'Energy burned at complete rest — breathing, heartbeat, brain (60-70%)'],
            ['Physical activity', 'Walking, exercise, sports (20-30%)'],
            ['Thermic effect of food', 'Energy used to digest and absorb food (~10%)'],
            ['TDEE', 'BMR × activity factor — total calories burned per day'],
          ],
        },
      },
    },

    // ── Section 6: Immune System ───────────────────────────────
    {
      title: 'Your Immune System: Two Lines of Defence',
      diagram: 'ImmuneResponseDiagram',
      beginnerContent:
        'Your body is under constant attack — bacteria, viruses, fungi, and parasites try to invade every day. Your **immune system** is a layered defence that stops them.\n\n' +
        '**Layer 1 — Innate immunity (fast, general)**\n\n' +
        'These defences don\'t need to "learn" — they work against any invader:\n\n' +
        '| Barrier | How it works |\n' +
        '|---------|-------------|\n' +
        '| Skin | Physical wall — nothing gets through intact skin |\n' +
        '| Mucus | Traps particles in nose, throat, lungs |\n' +
        '| Stomach acid | pH 1.5–3.5 — kills most bacteria you swallow |\n' +
        '| Tears & saliva | Contain lysozyme — an enzyme that breaks bacterial cell walls |\n' +
        '| **Neutrophils** | White blood cells that eat invaders (60% of all white cells) |\n' +
        '| **Macrophages** | "Big eaters" — engulf pathogens and signal for backup |\n\n' +
        '**Layer 2 — Adaptive immunity (slow, precise, remembers)**\n\n' +
        'If innate defences fail, the adaptive system activates:\n\n' +
        '| Cell | Job | Speed |\n' +
        '|------|-----|-------|\n' +
        '| **B cells** | Produce **antibodies** — Y-shaped proteins that lock onto specific pathogens | 5–7 days (first time) |\n' +
        '| **T cells** | Kill infected cells directly, or help B cells | 5–7 days |\n' +
        '| **Memory cells** | Remember the pathogen for decades | 1–2 days on re-exposure |\n\n' +
        '**Why you only get chickenpox once:** After the first infection, memory B and T cells remain. When the same virus returns, they respond in 1–2 days (instead of 5–7) — so fast you don\'t even feel sick.\n\n' +
        '**Vaccination** exploits this: a harmless version of the pathogen trains your memory cells *without* making you ill. When the real pathogen arrives, your immune system is already prepared.',
      intermediateContent:
        '**Primary vs secondary immune response:**\n\n' +
        '| Feature | Primary (first exposure) | Secondary (re-exposure) |\n' +
        '|---------|------------------------|------------------------|\n' +
        '| Delay | 5–7 days | 1–2 days |\n' +
        '| Antibody type | Mostly IgM (large, low affinity) | Mostly IgG (small, high affinity) |\n' +
        '| Peak antibody level | Low | **10–100× higher** |\n' +
        '| Duration | Weeks | Months to years |\n\n' +
        '**Herd immunity — protecting those who can\'t be vaccinated:**\n\n' +
        'The threshold for herd immunity: **H = 1 − 1/R₀**\n\n' +
        '| Disease | R₀ | Herd immunity threshold | What this means |\n' +
        '|---------|-----|------------------------|-----------------|\n' +
        '| Measles | 12–18 | **92–95%** | Nearly everyone must be vaccinated |\n' +
        '| COVID-19 | 2.5–3.5 | 60–71% | Majority needed |\n' +
        '| Seasonal flu | 1.3 | 23% | Low threshold |\n\n' +
        '**Worked example — measles:** R₀ = 15 means one infected person infects 15 others. Herd immunity = 1 − 1/15 = **93%**. If 93% of the population is immune, each infected person infects 15 × 0.07 = ~1 person → the outbreak doesn\'t grow.\n\n' +
        'India\'s Universal Immunization Programme provides free vaccines against TB, polio, hepatitis B, measles, and more. COVID-19 vaccination: 2.2+ billion doses administered — the world\'s largest campaign.',
      advancedContent:
        '**How does your body generate 10¹¹ different antibodies from only ~20,000 genes?**\n\n' +
        '**V(D)J recombination** — a controlled DNA rearrangement:\n\n' +
        '| Step | What happens |\n' +
        '|------|-------------|\n' +
        '| Gene segments | Each antibody gene has multiple V, D, and J segments |\n' +
        '| Random selection | RAG1/RAG2 recombinase picks one V, one D, one J |\n' +
        '| Junctional diversity | Random nucleotides added at the joins (by TdT enzyme) |\n' +
        '| Combinatorial | Heavy chain × light chain pairing |\n' +
        '| **Result** | >10¹¹ unique antibodies from ~20,000 genes |\n\n' +
        '**Affinity maturation** in germinal centres: After initial antibody production, B cells undergo **somatic hypermutation** (AID enzyme introduces ~10⁻³ mutations/bp/division in the variable region — 10⁶× the normal mutation rate). B cells with improved binding survive; the rest die. This is Darwinian natural selection happening *within your body* over days.\n\n' +
        '**mRNA vaccines** (Pfizer, Moderna): Lipid nanoparticle delivers mRNA → dendritic cells translate it → spike protein displayed on MHC-I (→ CD8⁺ killer T cells) and secreted for MHC-II presentation (→ CD4⁺ helper T cells + B cells). All arms of adaptive immunity activated simultaneously — elegant engineering.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Innate immunity is specific to particular pathogens.', answer: false, explanation: 'Innate immunity is non-specific — it attacks any foreign invader using general-purpose defences like skin, mucus, and neutrophils.' },
            { text: 'Memory B and T cells allow your immune system to respond faster to a pathogen it has seen before.', answer: true, explanation: 'Memory cells persist for years and mount a rapid, powerful response upon re-exposure — the basis of long-term immunity.' },
            { text: 'Vaccines work by giving you a mild case of the disease.', answer: false, explanation: 'Vaccines use harmless versions of pathogens (killed, weakened, or just key proteins) to train immunity without causing disease.' },
            { text: 'If 50% of people are vaccinated against measles (R₀=15), the outbreak will stop.', answer: false, explanation: 'Measles needs 93% immunity for herd protection (H = 1 − 1/15 = 93%). At 50%, outbreaks will still spread rapidly.' },
          ],
        },
      },
    },

    // ── Section 7: Sleep ───────────────────────────────────────
    {
      title: 'Sleep: Your Brain\'s Maintenance Shift',
      diagram: 'SleepCycleDiagram',
      beginnerContent:
        'Sleep is **not** your brain shutting down. It\'s your brain\'s *most active maintenance period*.\n\n' +
        '**What happens while you sleep:**\n\n' +
        '| Stage | Duration per cycle | What your brain does |\n' +
        '|-------|-------------------|-----------------------|\n' +
        '| **N1** (light sleep) | 1–5 min | Transition — easy to wake |\n' +
        '| **N2** (true sleep) | 10–25 min | Sorts and files short-term memories |\n' +
        '| **N3** (deep sleep) | 20–40 min | Physical repair, growth hormone release, **waste clearance** |\n' +
        '| **REM** (dream sleep) | 10–60 min | Processes emotions, strengthens learned skills |\n\n' +
        'You cycle through all four stages **every ~90 minutes**, repeating 4–6 times per night.\n\n' +
        '**Hover over each stage in the diagram above** to see what happens during it.\n\n' +
        '**The glymphatic system — your brain\'s cleaning crew:**\n\n' +
        'During deep sleep (N3), your brain\'s glial cells *shrink*, opening channels between them. Cerebrospinal fluid rushes through these channels, flushing out toxic waste — including **amyloid-β**, the protein linked to Alzheimer\'s disease. This cleaning is **60% more efficient during sleep** than when you\'re awake. Skipping sleep = skipping the cleanup.\n\n' +
        '**How much sleep do you need?**\n\n' +
        '| Age | Recommended hours |\n' +
        '|-----|------------------|\n' +
        '| 6–12 years | 9–12 hours |\n' +
        '| 13–18 years | 8–10 hours |\n' +
        '| Adults | 7–9 hours |\n\n' +
        '**The study-sleep irony:** Students who sacrifice sleep to study perform *worse* than those who sleep well. Why? The sleep-deprived brain cannot consolidate what it learned. You\'re studying twice and remembering half.',
      intermediateContent:
        '**Why are teenagers always sleepy in the morning?**\n\n' +
        'Puberty shifts the **circadian clock** later. Melatonin (the sleep hormone) starts rising at ~11 PM in teens vs ~9 PM in children. This is biological, not laziness.\n\n' +
        '**Melatonin and blue light:**\n\n' +
        '| Time | What happens | Why |\n' +
        '|------|-------------|-----|\n' +
        '| Sunset | Darkness detected by retinal ganglion cells | melanopsin → SCN → pineal gland |\n' +
        '| Pineal gland | Releases melatonin | Signals "time to sleep" |\n' +
        '| Phone screen | **Blue light (460–480 nm)** suppresses melatonin | Brain thinks it\'s still daytime |\n' +
        '| Result | Delayed sleep onset by 30–60 min | Less total sleep |\n\n' +
        '**Sleep architecture across the night:**\n\n' +
        '- **First half:** Dominated by deep sleep (N3) — physical repair priority\n' +
        '- **Second half:** Dominated by REM — learning and emotional processing priority\n\n' +
        'If you sleep only 5 hours, you get most of your deep sleep but lose a huge portion of REM. This is why short sleepers can feel physically OK but struggle with concentration, mood, and memory.\n\n' +
        '**The adenosine story:** Every hour you\'re awake, **adenosine** builds up in your brain. Adenosine makes you feel sleepy. Sleep clears it. **Caffeine** works by blocking adenosine receptors — it doesn\'t remove the adenosine, just masks it. When caffeine wears off, all the accumulated adenosine hits at once → "caffeine crash."',
      advancedContent:
        '**The two-process model of sleep regulation (Borbely, 1982):**\n\n' +
        '| Process | Driver | Mechanism |\n' +
        '|---------|--------|----------|\n' +
        '| **Process S** (homeostatic) | Adenosine accumulation | Rises linearly during wakefulness, drops during sleep |\n' +
        '| **Process C** (circadian) | SCN molecular clock | ~24.2-hour oscillation: CLOCK/BMAL1 → PER/CRY → feedback loop |\n\n' +
        'You fall asleep when Process S (rising sleepiness) intersects with Process C (circadian dip). You wake when Process S has been cleared and Process C hits its alertness peak.\n\n' +
        '**The molecular clock — transcriptional oscillation:**\n\n' +
        '1. CLOCK + BMAL1 (transcription factors) bind E-box promoters\n' +
        '2. Drive expression of PER and CRY genes\n' +
        '3. PER/CRY proteins accumulate in cytoplasm\n' +
        '4. PER/CRY translocate to nucleus and **inhibit CLOCK/BMAL1**\n' +
        '5. PER/CRY proteins are degraded (CK1ε phosphorylation → ubiquitination)\n' +
        '6. CLOCK/BMAL1 reactivate → cycle repeats every ~24.2 hours\n\n' +
        'Light resets this clock via melanopsin → SCN → PER gene induction.\n\n' +
        '**Depression and sleep — neurocircuitry:**\n\n' +
        'fMRI studies show depression involves hyperactivity of the **default mode network** (self-referential rumination) and hypoactivity of the **dorsolateral prefrontal cortex** (executive control). SSRIs increase synaptic serotonin within hours, but clinical improvement takes 2–4 weeks — suggesting the real mechanism is downstream **neuroplasticity** (BDNF upregulation, hippocampal neurogenesis).',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'During deep sleep, your brain\'s glymphatic system flushes out toxic waste products — including proteins linked to Alzheimer\'s disease — at a rate 10× faster than during waking hours.',
            'Teenagers\' biological clocks naturally shift later, making them feel sleepy around 11 PM and alert around 8 AM — school start times that ignore this biology hurt academic performance.',
            'Just one week of sleeping 6 hours per night (instead of 8) alters the expression of over 700 genes involved in immunity, stress response, and metabolism.',
            'Caffeine doesn\'t give you energy — it blocks adenosine receptors, masking your sleepiness. The adenosine is still building up behind the dam.',
          ],
        },
      },
    },
  ],
};
