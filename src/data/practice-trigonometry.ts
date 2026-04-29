// ============================================================
// PRACTICE PROBLEMS — Trigonometry
//
// 5 sets matching the 5 sections of the trigonometry guide.
// Each set has a mix of difficulty 1/2/3 problems with
// step-by-step hand solutions and Python code variants.
// ============================================================

import type { PracticeSet } from './reference';

// ─── 1. SOH CAH TOA ─────────────────────────────────────────

export const practiceSohCahToa: PracticeSet = {
  title: 'Practice — SOH CAH TOA',
  problems: [
    {
      id: 'soh-01', difficulty: 1,
      question: 'In a right triangle, the angle θ has **opposite = 3** and **hypotenuse = 5**. Find **sin θ**.',
      steps: [
        { label: 'Step 1: Recall the ratio', content: 'sin θ = opposite / hypotenuse (the **S** in SOH)' },
        { label: 'Step 2: Substitute', content: 'sin θ = 3 / 5' },
        { label: 'Step 3: Simplify', content: 'sin θ = **0.6**' },
      ],
      answer: '0.6',
      code: 'opposite = 3\nhypotenuse = 5\n\n# Compute sin theta\n',
      codeSolution: 'opposite = 3\nhypotenuse = 5\nsin_theta = opposite / hypotenuse\nprint(f"sin θ = {sin_theta}")',
    },
    {
      id: 'soh-02', difficulty: 1,
      question: 'For the same triangle (opposite = 3, hypotenuse = 5), find the **adjacent** side and then **cos θ** and **tan θ**.',
      steps: [
        { label: 'Step 1: Pythagoras', content: 'adjacent² = hypotenuse² − opposite² = 25 − 9 = 16, so **adjacent = 4**' },
        { label: 'Step 2: cos θ', content: 'cos θ = adjacent / hypotenuse = 4/5 = **0.8**' },
        { label: 'Step 3: tan θ', content: 'tan θ = opposite / adjacent = 3/4 = **0.75**' },
      ],
      answer: 'adjacent = 4, cos θ = 0.8, tan θ = 0.75',
      hint: 'This is the famous 3-4-5 right triangle.',
      code: 'import math\nopposite = 3\nhypotenuse = 5\n\n# Find adjacent, cos, tan\n',
      codeSolution: 'import math\nopposite = 3\nhypotenuse = 5\nadjacent = math.sqrt(hypotenuse**2 - opposite**2)\nprint(f"adjacent = {adjacent}")\nprint(f"cos θ = {adjacent/hypotenuse}")\nprint(f"tan θ = {opposite/adjacent}")',
    },
    {
      id: 'soh-03', difficulty: 1,
      question: 'A right triangle has hypotenuse **20 cm** and one acute angle **30°**. Find the side **opposite** the 30° angle.',
      steps: [
        { label: 'Step 1: Pick the right ratio', content: 'We know the hypotenuse and the angle. We want the opposite side. Use sin: sin 30° = opp / 20.' },
        { label: 'Step 2: Plug in sin 30°', content: 'sin 30° = 1/2' },
        { label: 'Step 3: Solve', content: 'opp = 20 × (1/2) = **10 cm**' },
      ],
      answer: '10 cm',
      code: 'import math\nhyp = 20\nangle_deg = 30\n\n# Find the opposite side\n',
      codeSolution: 'import math\nhyp = 20\nangle = math.radians(30)\nopp = hyp * math.sin(angle)\nprint(f"opposite = {opp:.2f} cm")',
    },
    {
      id: 'soh-04', difficulty: 1,
      question: 'A right triangle has hypotenuse **10 m** and one angle **60°**. Find the **adjacent** side.',
      steps: [
        { label: 'Step 1: cos relates adjacent to hypotenuse', content: 'cos 60° = adj / 10' },
        { label: 'Step 2: cos 60° = 1/2', content: '— a value to memorise' },
        { label: 'Step 3: Solve', content: 'adj = 10 × (1/2) = **5 m**' },
      ],
      answer: '5 m',
    },
    {
      id: 'soh-05', difficulty: 2,
      question: 'A ramp is built so that it rises **2 m** vertically over a horizontal run of **8 m**. What angle does it make with the ground?',
      steps: [
        { label: 'Step 1: Identify the right ratio', content: 'Rise = opposite = 2 m, run = adjacent = 8 m. Use tan: tan θ = 2/8 = 0.25' },
        { label: 'Step 2: Take the inverse tan', content: 'θ = arctan(0.25)' },
        { label: 'Step 3: Compute', content: 'θ ≈ **14.04°**' },
      ],
      answer: '≈ 14.04°',
      hint: 'When you know two sides and want the angle, use the inverse function arctan.',
      code: 'import math\n\nrise = 2\nrun = 8\n\n# Find the angle in degrees\n',
      codeSolution: 'import math\nrise = 2\nrun = 8\nangle_rad = math.atan(rise / run)\nangle_deg = math.degrees(angle_rad)\nprint(f"angle = {angle_deg:.2f}°")',
    },
    {
      id: 'soh-06', difficulty: 2,
      question: 'In a right triangle, sin θ = **0.6**. Without using a calculator, find **cos θ** and **tan θ**.',
      steps: [
        { label: 'Step 1: Pythagorean identity', content: 'sin²θ + cos²θ = 1 → cos²θ = 1 − 0.36 = 0.64' },
        { label: 'Step 2: Take the square root', content: 'cos θ = ±0.8. Since θ is acute (in a right triangle), cos θ > 0, so cos θ = **0.8**' },
        { label: 'Step 3: tan θ = sin/cos', content: 'tan θ = 0.6 / 0.8 = **0.75**' },
      ],
      answer: 'cos θ = 0.8, tan θ = 0.75',
    },
    {
      id: 'soh-07', difficulty: 2,
      question: 'A 13 m ladder leans against a wall. The foot of the ladder is **5 m** from the wall. Find the angle the ladder makes with the **ground**, and how high it reaches up the wall.',
      steps: [
        { label: 'Step 1: Identify the triangle', content: 'Hypotenuse = ladder = 13 m. Adjacent (along ground) = 5 m. We want angle θ with ground, and vertical reach h.' },
        { label: 'Step 2: Find the angle', content: 'cos θ = 5/13 → θ = arccos(5/13) ≈ **67.4°**' },
        { label: 'Step 3: Find h with Pythagoras', content: 'h = √(13² − 5²) = √(169 − 25) = √144 = **12 m**' },
      ],
      answer: 'angle ≈ 67.4°, height = 12 m',
      hint: 'The 5-12-13 right triangle is one of the standard Pythagorean triples.',
    },
    {
      id: 'soh-08', difficulty: 3,
      question: 'A drone takes off and flies at a constant **30°** angle of climb. After flying **200 m** along its path (the slant distance), how high above the ground is it, and how far has it travelled horizontally?',
      steps: [
        { label: 'Step 1: Identify the triangle', content: 'Hypotenuse (slant distance) = 200 m. Angle with ground = 30°. Want vertical (opp) and horizontal (adj).' },
        { label: 'Step 2: Vertical', content: 'h = 200 × sin 30° = 200 × 0.5 = **100 m**' },
        { label: 'Step 3: Horizontal', content: 'd = 200 × cos 30° = 200 × (√3/2) ≈ **173.2 m**' },
      ],
      answer: 'altitude = 100 m, horizontal = 173.2 m',
    },
  ],
};

// ─── 2. The Unit Circle ─────────────────────────────────────

export const practiceUnitCircle: PracticeSet = {
  title: 'Practice — The Unit Circle',
  problems: [
    {
      id: 'uc-01', difficulty: 1,
      question: 'On the unit circle, the point at angle **90°** has coordinates (cos 90°, sin 90°). What are these coordinates?',
      steps: [
        { label: 'Step 1: Picture the circle', content: '90° is straight up — the top of the circle.' },
        { label: 'Step 2: Read the coordinates', content: 'Top of the unit circle is (0, 1). So **cos 90° = 0** and **sin 90° = 1**.' },
      ],
      answer: '(0, 1)',
    },
    {
      id: 'uc-02', difficulty: 1,
      question: 'What are the coordinates of the point at **180°** on the unit circle?',
      steps: [
        { label: 'Step 1: 180° points along the negative x-axis', content: '— the leftmost point of the circle.' },
        { label: 'Step 2: Read off', content: '**(−1, 0)**. So cos 180° = −1, sin 180° = 0.' },
      ],
      answer: '(−1, 0)',
    },
    {
      id: 'uc-03', difficulty: 1,
      question: 'Convert **45°** to radians.',
      steps: [
        { label: 'Step 1: Conversion', content: 'radians = degrees × π / 180' },
        { label: 'Step 2: Plug in', content: '45 × π / 180 = π/4' },
        { label: 'Step 3: Decimal value', content: 'π/4 ≈ **0.785 radians**' },
      ],
      answer: 'π/4 ≈ 0.785 rad',
    },
    {
      id: 'uc-04', difficulty: 2,
      question: 'In which **quadrant** is the angle **210°**? What are the **signs** of sin 210°, cos 210°, tan 210°?',
      steps: [
        { label: 'Step 1: Locate', content: '210° = 180° + 30°. Past the negative x-axis, before pointing down. **Quadrant III**.' },
        { label: 'Step 2: Signs in Quadrant III', content: 'In Q3, x < 0 and y < 0. So **cos 210° < 0**, **sin 210° < 0**.' },
        { label: 'Step 3: Tan in Q3', content: 'tan = sin/cos = (negative)/(negative) = **positive**.' },
      ],
      answer: 'Q3; sin negative, cos negative, tan positive',
      hint: 'Use ASTC: All-Students-Take-Calculus to remember which functions are positive in each quadrant.',
    },
    {
      id: 'uc-05', difficulty: 2,
      question: 'Without using a calculator, find **sin 150°**.',
      steps: [
        { label: 'Step 1: Reference angle', content: '150° = 180° − 30°. The reference angle is 30°.' },
        { label: 'Step 2: Sign', content: '150° is in Quadrant II, where sin is positive.' },
        { label: 'Step 3: Value', content: 'sin 150° = +sin 30° = **1/2**' },
      ],
      answer: '1/2',
    },
    {
      id: 'uc-06', difficulty: 2,
      question: 'A wheel of radius **0.4 m** rotates at **5 radians per second**. How fast is the rim moving?',
      steps: [
        { label: 'Step 1: Linear speed = radius × angular speed', content: 'v = r ω' },
        { label: 'Step 2: Substitute', content: 'v = 0.4 × 5' },
        { label: 'Step 3: Result', content: '**v = 2 m/s**' },
      ],
      answer: '2 m/s',
      code: 'r = 0.4   # metres\nomega = 5  # rad/s\n\n# Compute rim speed\n',
      codeSolution: 'r = 0.4\nomega = 5\nv = r * omega\nprint(f"v = {v} m/s")',
    },
    {
      id: 'uc-07', difficulty: 3,
      question: 'Find all angles θ in [0°, 360°) such that **sin θ = √3/2**.',
      steps: [
        { label: 'Step 1: Reference angle', content: 'sin 60° = √3/2, so the reference angle is 60°.' },
        { label: 'Step 2: Find quadrants where sin is positive', content: 'Sin is positive in Q1 and Q2.' },
        { label: 'Step 3: List solutions', content: 'Q1: θ = 60°. Q2: θ = 180° − 60° = 120°.' },
        { label: 'Step 4: Final', content: 'θ = **60° or 120°**.' },
      ],
      answer: '60°, 120°',
    },
    {
      id: 'uc-08', difficulty: 3,
      question: 'Find the **6th roots of unity** (complex numbers z with z⁶ = 1) and their positions on the unit circle.',
      steps: [
        { label: 'Step 1: Formula', content: 'zₖ = e^(2πi k/6) for k = 0, 1, 2, 3, 4, 5' },
        { label: 'Step 2: List', content: 'Angles are 0, 60°, 120°, 180°, 240°, 300° — equally spaced.' },
        { label: 'Step 3: Real form', content: '1, ½ + i√3/2, −½ + i√3/2, −1, −½ − i√3/2, ½ − i√3/2' },
        { label: 'Step 4: Geometric meaning', content: 'They form the **vertices of a regular hexagon** inscribed in the unit circle.' },
      ],
      answer: 'Six points at 0°, 60°, 120°, 180°, 240°, 300° — vertices of a regular hexagon',
    },
  ],
};

// ─── 3. Graphs of Trig Functions ────────────────────────────

export const practiceTrigGraphs: PracticeSet = {
  title: 'Practice — Graphs of Trig Functions',
  problems: [
    {
      id: 'tg-01', difficulty: 1,
      question: 'What is the **amplitude** of y = 4 sin x?',
      steps: [
        { label: 'Step 1: Read off the coefficient', content: 'In y = A sin x, amplitude = |A|.' },
        { label: 'Step 2: Identify', content: '|4| = **4**' },
      ],
      answer: '4',
    },
    {
      id: 'tg-02', difficulty: 1,
      question: 'What is the **period** of y = sin(2x)?',
      steps: [
        { label: 'Step 1: Formula', content: 'For y = sin(Bx), period = 2π / B.' },
        { label: 'Step 2: Plug in', content: '2π / 2 = **π**' },
      ],
      answer: 'π',
    },
    {
      id: 'tg-03', difficulty: 2,
      question: 'For y = 3 sin(2x) + 1, find the **maximum** and **minimum** values.',
      steps: [
        { label: 'Step 1: A = 3, D = 1', content: 'Amplitude is 3, vertical shift is 1.' },
        { label: 'Step 2: Max', content: 'D + |A| = 1 + 3 = **4**' },
        { label: 'Step 3: Min', content: 'D − |A| = 1 − 3 = **−2**' },
      ],
      answer: 'max = 4, min = −2',
    },
    {
      id: 'tg-04', difficulty: 2,
      question: 'A Ferris wheel has diameter **40 m** and its axle is **25 m** above the ground. It completes one rotation every **4 minutes**. Write a sinusoidal model for the height h(t) of a passenger boarding at the bottom at t = 0.',
      steps: [
        { label: 'Step 1: Vertical shift D', content: 'D = axle height = 25' },
        { label: 'Step 2: Amplitude A', content: 'A = radius = 20' },
        { label: 'Step 3: Period and B', content: 'Period = 4 minutes → B = 2π/4 = π/2' },
        { label: 'Step 4: Phase', content: 'At t = 0, h = 5 (bottom). Use −cos so that at t = 0 the term is at minimum: h(t) = 25 − 20 cos(πt/2)' },
        { label: 'Step 5: Verify', content: 'At t = 0: 25 − 20 = 5 ✓. At t = 2 (top): 25 − 20·cos(π) = 25 + 20 = 45 ✓.' },
      ],
      answer: 'h(t) = 25 − 20 cos(πt/2)',
      hint: 'Boarding at the bottom means the function should equal its minimum at t = 0.',
    },
    {
      id: 'tg-05', difficulty: 2,
      question: 'For y = 2 sin(πx − π/2), find the amplitude, period, and phase shift.',
      steps: [
        { label: 'Step 1: Amplitude', content: 'A = **2**' },
        { label: 'Step 2: Period', content: '2π / B = 2π / π = **2**' },
        { label: 'Step 3: Phase shift', content: 'Phase shift = −C/B = −(−π/2)/π = **1/2 (right)**' },
      ],
      answer: 'A = 2, period = 2, phase shift = 1/2 right',
    },
    {
      id: 'tg-06', difficulty: 3,
      question: 'Daylight in a town varies between **8 hours** (winter solstice) and **16 hours** (summer solstice). Write a sinusoidal function for the daylight hours D(t) where t is months from the winter solstice (t = 0 = Dec 21).',
      steps: [
        { label: 'Step 1: Centre line', content: 'D = (16 + 8)/2 = **12** hours' },
        { label: 'Step 2: Amplitude', content: 'A = (16 − 8)/2 = **4**' },
        { label: 'Step 3: Period', content: '12 months → B = 2π/12 = π/6' },
        { label: 'Step 4: Phase', content: 'At t = 0, D = 8 (minimum). Use −cos: D(t) = 12 − 4 cos(πt/6)' },
        { label: 'Step 5: Verify', content: 't = 6 (summer): 12 + 4 = 16 ✓' },
      ],
      answer: 'D(t) = 12 − 4 cos(πt/6)',
    },
    {
      id: 'tg-07', difficulty: 3,
      question: 'Why does y = tan x have **vertical asymptotes** at x = π/2 + nπ for any integer n?',
      steps: [
        { label: 'Step 1: Definition', content: 'tan x = sin x / cos x' },
        { label: 'Step 2: When is the denominator zero?', content: 'cos x = 0 at x = π/2, 3π/2, 5π/2, ... = π/2 + nπ for integer n.' },
        { label: 'Step 3: Behaviour near these points', content: 'Near these x, sin x ≠ 0 (it equals ±1), so the ratio sin/cos diverges. **Vertical asymptote.**' },
      ],
      answer: 'Because cos x = 0 there and tan = sin/cos has a non-zero numerator.',
    },
  ],
};

// ─── 4. Heights and Distances ───────────────────────────────

export const practiceHeightDistance: PracticeSet = {
  title: 'Practice — Heights and Distances',
  problems: [
    {
      id: 'hd-01', difficulty: 1,
      question: 'You stand **30 m** from the foot of a flagpole and measure the **angle of elevation** to its top as **40°**. How tall is the flagpole? (Ignore your eye height.)',
      steps: [
        { label: 'Step 1: Right triangle', content: 'Adjacent = 30 m, want opposite = h. Use tan.' },
        { label: 'Step 2: Set up', content: 'tan 40° = h / 30 → h = 30 × tan 40°' },
        { label: 'Step 3: Compute', content: 'tan 40° ≈ 0.839, so h ≈ 30 × 0.839 = **≈ 25.2 m**' },
      ],
      answer: '≈ 25.2 m',
      code: 'import math\n\ndistance = 30\nangle_deg = 40\n\n# Find the height\n',
      codeSolution: 'import math\ndistance = 30\nangle = math.radians(40)\nheight = distance * math.tan(angle)\nprint(f"height ≈ {height:.2f} m")',
    },
    {
      id: 'hd-02', difficulty: 1,
      question: 'From the top of a **50 m** lighthouse, the angle of depression to a ship is **15°**. How far offshore is the ship?',
      steps: [
        { label: 'Step 1: Set up', content: 'Opposite = lighthouse height = 50 m. Adjacent = horizontal distance d. Angle = 15°.' },
        { label: 'Step 2: Use tan', content: 'tan 15° = 50 / d → d = 50 / tan 15°' },
        { label: 'Step 3: Compute', content: 'tan 15° ≈ 0.268, so d ≈ 50 / 0.268 ≈ **186.6 m**' },
      ],
      answer: '≈ 186.6 m',
      hint: 'Angle of depression from above = angle of elevation from below.',
    },
    {
      id: 'hd-03', difficulty: 2,
      question: 'You measure the **width of a river** as follows: from point A on one bank, sight a tree directly across (point B) on the other bank. Walk **30 m** along your bank to point C and measure ∠ACB = **62°**. Find the width AB.',
      steps: [
        { label: 'Step 1: Identify the triangle', content: 'In right triangle ABC: AB ⊥ AC. Adjacent to 62° (at C) is AC = 30 m. Opposite is AB = w.' },
        { label: 'Step 2: Use tan', content: 'tan 62° = w / 30 → w = 30 × tan 62°' },
        { label: 'Step 3: Compute', content: 'tan 62° ≈ 1.881, so w ≈ 30 × 1.881 = **≈ 56.4 m**' },
      ],
      answer: '≈ 56.4 m',
    },
    {
      id: 'hd-04', difficulty: 2,
      question: 'A **kite string** of length **80 m** makes an angle of **55°** with the ground. How **high** is the kite (assume the string is straight)?',
      steps: [
        { label: 'Step 1: String is the hypotenuse', content: 'h = opposite, hypotenuse = 80 m, angle = 55°.' },
        { label: 'Step 2: Use sin', content: 'sin 55° = h / 80 → h = 80 × sin 55°' },
        { label: 'Step 3: Compute', content: 'sin 55° ≈ 0.819, so h ≈ 80 × 0.819 = **≈ 65.5 m**' },
      ],
      answer: '≈ 65.5 m',
    },
    {
      id: 'hd-05', difficulty: 3,
      question: 'From point A, the angle of elevation to the top of a hill is **25°**. You walk **100 m** straight toward the hill to point B; now the angle is **40°**. How tall is the hill?',
      steps: [
        { label: 'Step 1: Two equations', content: 'Let h = hill height, d = distance from B to base. From B: tan 40° = h/d. From A: tan 25° = h/(d + 100).' },
        { label: 'Step 2: Express h two ways', content: 'h = d tan 40° = (d + 100) tan 25°' },
        { label: 'Step 3: Solve for d', content: 'd × 0.839 = (d + 100) × 0.466 → 0.839d = 0.466d + 46.6 → 0.373d = 46.6 → **d ≈ 124.9 m**' },
        { label: 'Step 4: Find h', content: 'h = 124.9 × 0.839 ≈ **104.8 m**' },
      ],
      answer: '≈ 104.8 m',
      hint: 'Set up two tan equations, eliminate the unknown distance d.',
    },
    {
      id: 'hd-06', difficulty: 3,
      question: 'Two cities are at the same longitude. City A is at latitude **20° N**, City B at **35° N**. Earth\'s radius is **6371 km**. Find the great-circle distance between them.',
      steps: [
        { label: 'Step 1: Angular separation', content: 'Same longitude → arc lies on a meridian. Δφ = 35° − 20° = 15°.' },
        { label: 'Step 2: Convert to radians', content: '15° × π/180 ≈ 0.2618 rad' },
        { label: 'Step 3: Arc length', content: 's = R × Δφ (in radians) = 6371 × 0.2618' },
        { label: 'Step 4: Compute', content: 's ≈ **1668 km**' },
      ],
      answer: '≈ 1668 km',
    },
  ],
};

// ─── 5. Trigonometric Identities ────────────────────────────

export const practiceTrigIdentities: PracticeSet = {
  title: 'Practice — Trigonometric Identities',
  problems: [
    {
      id: 'ti-01', difficulty: 1,
      question: 'If sin θ = **0.6** and θ is acute, find **cos θ**.',
      steps: [
        { label: 'Step 1: Pythagorean identity', content: 'sin²θ + cos²θ = 1' },
        { label: 'Step 2: Substitute', content: '0.36 + cos²θ = 1 → cos²θ = 0.64' },
        { label: 'Step 3: Take positive root (acute)', content: 'cos θ = **0.8**' },
      ],
      answer: '0.8',
    },
    {
      id: 'ti-02', difficulty: 1,
      question: 'Use the double-angle formula to find **sin 60°** given sin 30° = 1/2 and cos 30° = √3/2.',
      steps: [
        { label: 'Step 1: Formula', content: 'sin 2θ = 2 sin θ cos θ' },
        { label: 'Step 2: Substitute θ = 30°', content: 'sin 60° = 2 × (1/2) × (√3/2)' },
        { label: 'Step 3: Simplify', content: 'sin 60° = **√3/2 ≈ 0.866**' },
      ],
      answer: '√3/2 ≈ 0.866',
    },
    {
      id: 'ti-03', difficulty: 2,
      question: 'Simplify **sin²x + sin²x · tan²x** to a single function of x.',
      steps: [
        { label: 'Step 1: Factor', content: 'sin²x (1 + tan²x)' },
        { label: 'Step 2: Use 1 + tan²x = sec²x', content: 'sin²x × sec²x' },
        { label: 'Step 3: Definition of sec', content: 'sec²x = 1/cos²x, so the expression = sin²x / cos²x = **tan²x**' },
      ],
      answer: 'tan²x',
    },
    {
      id: 'ti-04', difficulty: 2,
      question: 'Use sum-to-product to evaluate **cos 75° + cos 15°** in exact form.',
      steps: [
        { label: 'Step 1: Formula', content: 'cos A + cos B = 2 cos((A+B)/2) cos((A−B)/2)' },
        { label: 'Step 2: Plug in', content: '2 cos((75+15)/2) cos((75−15)/2) = 2 cos 45° cos 30°' },
        { label: 'Step 3: Substitute exact values', content: '2 × (√2/2) × (√3/2) = **√6/2 ≈ 1.225**' },
      ],
      answer: '√6/2',
    },
    {
      id: 'ti-05', difficulty: 2,
      question: 'Prove that **(1 + cos 2θ) / sin 2θ = cot θ**.',
      steps: [
        { label: 'Step 1: Numerator with double-angle', content: 'cos 2θ = 2 cos²θ − 1, so 1 + cos 2θ = 2 cos²θ' },
        { label: 'Step 2: Denominator with double-angle', content: 'sin 2θ = 2 sin θ cos θ' },
        { label: 'Step 3: Form the ratio', content: '2 cos²θ / (2 sin θ cos θ)' },
        { label: 'Step 4: Cancel', content: 'cos θ / sin θ = **cot θ ✓**' },
      ],
      answer: 'cot θ (proof above)',
    },
    {
      id: 'ti-06', difficulty: 3,
      question: 'Solve for x in [0°, 360°): **2 sin²x − 1 = 0**.',
      steps: [
        { label: 'Step 1: Isolate sin²x', content: 'sin²x = 1/2' },
        { label: 'Step 2: Take square root', content: 'sin x = ±√2/2' },
        { label: 'Step 3: All solutions in [0°, 360°)', content: 'sin x = √2/2: x = 45°, 135°. sin x = −√2/2: x = 225°, 315°.' },
        { label: 'Step 4: Combine', content: 'x = **45°, 135°, 225°, 315°**' },
      ],
      answer: '45°, 135°, 225°, 315°',
    },
    {
      id: 'ti-07', difficulty: 3,
      question: 'Use Euler\'s formula to derive **cos(A + B) = cos A cos B − sin A sin B**.',
      steps: [
        { label: 'Step 1: Multiply two complex exponentials', content: 'e^(iA) · e^(iB) = e^(i(A+B))' },
        { label: 'Step 2: Expand left side', content: '(cos A + i sin A)(cos B + i sin B) = (cos A cos B − sin A sin B) + i(sin A cos B + cos A sin B)' },
        { label: 'Step 3: Right side via Euler', content: 'e^(i(A+B)) = cos(A+B) + i sin(A+B)' },
        { label: 'Step 4: Match real parts', content: 'cos(A+B) = **cos A cos B − sin A sin B ✓**' },
      ],
      answer: 'cos A cos B − sin A sin B (derivation above)',
    },
  ],
};
