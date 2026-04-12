import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'ratios-and-proportions',
  title: 'Ratios, Proportions & Percentages',
  category: 'math',
  icon: '📐',
  tagline: 'The mathematics of comparison — from recipe scaling to population growth rates.',
  relatedStories: ['little-chef', 'grandmothers-pitha', 'holi-tea-gardens'],
  understand: [
    {
      title: 'Ratios — Comparing Quantities',
      diagram: 'NumberLineDiagram',
      beginnerContent:
        'A **ratio** is a way of comparing two or more quantities by showing how many times one contains the other. If a recipe for Assamese *pitha* (rice cake) uses 2 cups of rice flour and 1 cup of jaggery, the ratio of flour to jaggery is 2:1 (read "two to one"). This means for every 1 unit of jaggery, you need 2 units of flour — regardless of whether you are making a small batch or a feast.\n\nRatios can be expressed in several ways: as a colon notation (2:1), as a fraction (2/1), or in words ("two to one"). They can compare parts to parts (flour to jaggery = 2:1) or parts to the whole (flour to total mixture = 2:3, since 2 cups flour out of 3 cups total). **Simplifying ratios** works just like simplifying fractions — divide all terms by their greatest common factor. A ratio of 12:8 simplifies to 3:2 (dividing both by 4). A ratio of 250:1000 simplifies to 1:4.\n\nRatios appear everywhere. In a tea garden, the ratio of tea pickers to supervisors might be 25:1. A map scale of 1:50,000 means 1 cm on the map represents 50,000 cm (500 m) in real life. In chemistry, the ratio of hydrogen to oxygen atoms in water is always 2:1 (H₂O). In cooking, getting the ratio wrong changes the result fundamentally — a 2:1 flour-to-jaggery ratio makes a firm pitha, while a 1:1 ratio makes something too sweet and crumbly. Understanding ratios means understanding the *relationship* between quantities, which is often more important than the quantities themselves.\n\nA key property of ratios: they are **unit-free**. A 2:1 ratio is the same whether you measure in cups, grams, or kilograms. This makes ratios powerful for scaling — double everything and the ratio stays 2:1.',
      intermediateContent:
        'To divide a quantity in a given ratio: split 750 g of flour in the ratio 2:3:5. Total parts = 2+3+5 = 10. Each part = 750/10 = 75 g. So the three portions are 150 g, 225 g, and 375 g (check: 150+225+375 = 750 ✓). Map scale problems: on a 1:50,000 map, a measured distance of 4.6 cm represents 4.6 × 50,000 = 230,000 cm = **2.3 km** on the ground. If two villages are 8.5 km apart, they are separated by 8,500 m ÷ 500 m/cm = **17 cm** on the map.',
      advancedContent:
        'Dimensional analysis uses ratios to convert between unit systems and check formula validity. Every physical formula must be dimensionally consistent — you cannot add meters to kilograms. Example: kinetic energy E = ½mv². Dimensions: [mass][length/time]² = [mass×length²/time²] = kg·m²/s² = Joules ✓. In pharmacology, dosage calculations use body surface area (BSA) rather than weight, because metabolic rate scales more closely with surface area. The Mosteller formula BSA = √(height×weight/3600) (in m²) is a ratio-based approximation used worldwide for chemotherapy dosing.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The golden ratio (approximately 1:1.618) appears in flower petal arrangements, spiral shells, the proportions of the Parthenon, and the layout of seeds in a sunflower head.',
            'In Assamese tea blending, the ratio of CTC tea to orthodox tea determines the strength and flavor of the final product — master blenders adjust ratios by fractions of a percent.',
            'Your body maintains precise chemical ratios: the ratio of sodium to potassium in your blood must stay near 28:1 for your nerves and heart to function properly.',
          ],
        },
      },
    },
    {
      title: 'Proportions — Scaling and Cross-Multiplication',
      diagram: 'LinearGraphDiagram',
      beginnerContent:
        'A **proportion** is an equation stating that two ratios are equal. If the flour-to-jaggery ratio is 2:1, and you want to use 6 cups of flour, you set up the proportion 2/1 = 6/x and solve for x to find you need 3 cups of jaggery. This process of **scaling** — increasing or decreasing all quantities by the same factor while maintaining the ratio — is one of the most practical mathematical skills you can learn.\n\nThe standard method for solving proportions is **cross-multiplication**. Given a/b = c/d, cross-multiply to get a × d = b × c, then solve for the unknown. For example: if 3 kg of tea leaves costs ₹900, how much do 7 kg cost? Set up the proportion: 3/900 = 7/x. Cross-multiply: 3x = 900 × 7 = 6,300. Divide: x = ₹2,100. This works because proportional relationships are **linear** — doubling the quantity exactly doubles the cost.\n\nScaling recipes is a real-world application that every cook performs intuitively. If a pitha recipe serves 4 people and you need to serve 10, your scaling factor is 10/4 = 2.5. Every ingredient gets multiplied by 2.5. But experienced cooks know that not everything scales linearly — cooking time does not double when you double a recipe, and some flavors (like salt and chili) need careful adjustment because taste perception is not linear.\n\n**Direct proportion** means as one quantity increases, the other increases by the same factor (more hours worked = more wages, at a fixed hourly rate). **Inverse proportion** means as one quantity increases, the other decreases proportionally (more workers on a job = less time to complete it, assuming equal productivity). If 4 workers can harvest a tea plot in 6 hours, then 8 workers (twice as many) can do it in 3 hours (half the time): workers × time = 24, a constant. Recognizing which type of proportion applies is the key to setting up the problem correctly.',
      intermediateContent:
        'Inverse proportion: if 6 workers complete a task in 10 days, how many days for 15 workers? Workers × days = constant: 6 × 10 = 60 worker-days. For 15 workers: 60/15 = **4 days**. Combined proportion: if 8 machines produce 240 units in 6 hours, how many machines are needed to produce 450 units in 5 hours? Rate per machine per hour = 240/(8×6) = 5 units. Needed: 450/(5×5) = **18 machines**. Key insight: identify which quantities are directly proportional and which are inversely proportional before setting up the equation.',
      advancedContent:
        'In physics, scaling laws describe how properties change with size. The square-cube law states that when an object scales by factor k, its surface area scales by k² but its volume (and mass) by k³. This is why an ant can carry 50× its body weight but an elephant cannot — the ant\'s muscle cross-section (scaling as k²) is large relative to its mass (k³). Allometric scaling in biology follows power laws: metabolic rate scales as mass^0.75 (Kleiber\'s law), explaining why a mouse\'s heart beats 600 times/minute while an elephant\'s beats only 30. These scaling laws connect simple ratios to the deepest patterns in biology and engineering.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'If 5 kg of rice costs ₹200, then 12 kg costs ₹480.', answer: true, explanation: 'Set up the proportion: 5/200 = 12/x. Cross-multiply: 5x = 2400. So x = ₹480.' },
            { text: 'If 6 painters can paint a school in 4 days, 12 painters can paint it in 8 days.', answer: false, explanation: 'This is an inverse proportion — doubling the workers halves the time. 12 painters would take 2 days, not 8.' },
            { text: 'When scaling a recipe by a factor of 3, cooking time also triples.', answer: false, explanation: 'Cooking time depends on heat transfer, not just quantity — a pot three times larger might need only 50% more time, not 200% more.' },
            { text: 'Cross-multiplication works because of the fundamental property that if a/b = c/d, then ad = bc.', answer: true, explanation: 'This property follows from multiplying both sides of the equation by bd, which eliminates both denominators.' },
          ],
        },
      },
    },
    {
      title: 'Percentages — Converting, Calculating, and Applying',
      beginnerContent:
        'A **percentage** is a ratio expressed as a fraction of 100. The word itself comes from Latin *per centum* — "per hundred." Saying "40% of Assam\'s land is forested" means 40 out of every 100 units of land area are forest. Percentages make it easy to compare quantities of different sizes on a common scale.\n\n**Converting** between fractions, decimals, and percentages is straightforward. To convert a fraction to a percentage: divide and multiply by 100. So 3/8 = 0.375 = 37.5%. To convert a percentage to a fraction: put it over 100 and simplify. So 60% = 60/100 = 3/5. To convert a percentage to a decimal: divide by 100 (move the decimal point two places left). So 7.5% = 0.075.\n\n**Calculating percentages** of quantities is essential for everyday life. What is 18% GST on a ₹500 item? 500 × 0.18 = ₹90, so the total price is ₹590. What percentage of students passed if 72 out of 90 passed? (72/90) × 100 = 80%. If a tea garden produced 12,000 kg last year and 13,800 kg this year, the percentage increase is: (13,800 − 12,000)/12,000 × 100 = 15%.\n\n**Percentage change** — increase or decrease — is one of the most common calculations in the real world. The formula is: Percentage Change = (New Value − Old Value) / Old Value × 100. A positive result means increase; negative means decrease. Important trap: a 50% increase followed by a 50% decrease does NOT bring you back to the original value. If 100 increases by 50% to 150, then decreases by 50%, you get 75, not 100. This is because the 50% decrease is applied to the new, larger number. Understanding this asymmetry is critical in finance, population studies, and any field dealing with growth and decline.\n\n**Compound percentages** build on this idea. If a savings account earns 8% interest per year, compounded annually, ₹1,000 becomes ₹1,080 after year 1, ₹1,166.40 after year 2, ₹1,259.71 after year 3, and so on. The formula is: Final = Principal × (1 + rate)^years. This exponential growth is why starting to save early makes such an enormous difference, and it is the same mathematics behind population growth, disease spread, and inflation.',
      intermediateContent:
        'Percentage increase and decrease traps: a 25% increase followed by a 20% decrease gives 100 × 1.25 × 0.80 = **100** — back to the original. But a 20% increase followed by a 20% decrease gives 100 × 1.20 × 0.80 = **96** — a net 4% loss. The general formula: (1+r)(1−r) = 1−r², so equal percentage increase and decrease always results in a net loss of r² × 100%. Compound interest: ₹10,000 at 8% per year for 5 years = 10,000 × (1.08)⁵ = 10,000 × 1.4693 = **₹14,693**.',
      advancedContent:
        'The Rule of 72 estimates doubling time: at r% annual growth, an investment doubles in approximately 72/r years. At 8%, doubling takes ~9 years; at 12%, ~6 years. This approximation works because ln(2) ≈ 0.693 and for small r, ln(1+r) ≈ r, giving t ≈ ln(2)/r ≈ 0.693/r. The factor 72 (instead of 69.3) is used because it has more divisors, making mental math easier. In population dynamics, India\'s 1.0% growth rate implies a doubling time of ~72 years. Exponential growth at constant percentages eventually overwhelms any linear process — this is the mathematical basis for the urgency of addressing compound problems like climate change, debt, and antibiotic resistance.',
    },
    {
      title: 'Real-World Applications',
      beginnerContent:
        'Ratios, proportions, and percentages are not abstract mathematics — they are tools you use (often without realizing it) every day, and they underpin critical analyses in science, economics, and public policy.\n\n**Tea blending and quality grading**: Assam produces about 700 million kg of tea per year — roughly 52% of India\'s total. Master tea blenders mix different grades and origins in precise ratios to achieve consistent flavor profiles. A blend might be 60% Assam CTC (strong, malty), 25% Darjeeling (light, floral), and 15% Nilgiri (smooth, aromatic). Changing the ratio by even 5 percentage points produces a noticeably different cup. At tea auctions, prices are quoted per kilogram, and buyers calculate cost-per-cup ratios: if 1 kg of CTC tea makes approximately 450 cups, and the tea costs ₹300/kg, each cup costs about ₹0.67 — less than the milk you put in it.\n\n**Population analysis**: India\'s population has grown from 361 million in 1951 to over 1.4 billion in 2023 — a percentage increase of about 288%. Assam\'s population grew from 8 million (1951) to 35 million (2023), a 338% increase. The decadal growth rate (percentage increase per decade) has been slowing: from 34.98% in 1951–1961 to 17.07% in 2001–2011. Understanding these percentage changes helps planners allocate resources for schools, hospitals, and infrastructure.\n\n**Sports statistics**: A cricket batting average is a ratio — total runs scored divided by the number of times dismissed. A bowling strike rate is the average number of balls bowled per wicket taken. A football team\'s win percentage = (wins / total games) × 100. If a team wins 14 out of 20 matches, their win percentage is 70%. These ratios allow comparison across different numbers of matches, seasons, and eras.\n\n**Health and nutrition**: The Body Mass Index (BMI) is a ratio of weight to height squared: BMI = weight(kg) / height(m)². Recommended daily nutrient percentages (e.g., "get 50–65% of calories from carbohydrates") are proportion guidelines. Medicine dosages for children are often calculated as proportions based on body weight: if the adult dose is 500 mg for a 70 kg adult, a 28 kg child gets (28/70) × 500 = 200 mg. Getting proportions wrong in medicine can be dangerous, which is why pharmacists and nurses train extensively in ratio calculations.',
      intermediateContent:
        'Unit pricing compares value: Brand A tea costs ₹450 for 500 g (₹0.90/g), Brand B costs ₹280 for 250 g (₹1.12/g). Brand A is cheaper per gram despite the higher total price. Batting averages: a cricketer with 2,400 runs in 45 innings has an average of 2400/45 = 53.33. To raise this to 55.00 after 50 innings, total runs needed = 55 × 50 = 2,750, so they need 350 more runs in 5 innings (70 per innings). These ratio-based analyses turn raw numbers into actionable insights.',
      advancedContent:
        'In epidemiology, the **incidence rate** (new cases per population per time period) and **prevalence** (total current cases per population) are ratios that guide public health decisions. During the COVID-19 pandemic, the **reproduction number R₀** (average number of people each infected person infects) determined whether outbreaks grew (R₀ > 1) or shrank (R₀ < 1). Herd immunity requires vaccinating a proportion 1 − 1/R₀ of the population. For R₀ = 5 (measles), this means 80% vaccination coverage. These life-and-death calculations are ultimately applications of ratios and proportions.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each real-world scenario to the mathematical concept it uses',
          pairs: [
            ['Tea blending (60% Assam, 25% Darjeeling, 15% Nilgiri)', 'Ratios and percentages — maintaining precise proportions'],
            ['Population grew from 8 million to 35 million (338% increase)', 'Percentage change — (new − old) / old × 100'],
            ['Medicine dosage scaled by body weight', 'Direct proportion — dose increases linearly with weight'],
            ['Compound interest at 8% per year', 'Exponential growth — Principal × (1 + rate)^years'],
          ],
        },
      },
    },
  ],
};
