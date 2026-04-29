import type { ReferenceGuide } from '../reference';
import { practiceSohCahToa, practiceUnitCircle, practiceTrigGraphs, practiceHeightDistance, practiceTrigIdentities } from '../practice-trigonometry';

export const guide: ReferenceGuide = {
  slug: 'trigonometry',
  title: 'Trigonometry',
  category: 'math',
  icon: '📐',
  tagline:
    'Triangles unlock the heights of mountains and the orbits of planets.',
  relatedStories: ['snow-leopards-promise', 'turtle-mountain', 'stars-ziro-valley'],
  understand: [
    // ─────────────────────────────────────────────────────────────
    // 1. SOH CAH TOA
    // ─────────────────────────────────────────────────────────────
    {
      title: 'SOH CAH TOA',
      beginnerContent:
        '**Meet Tara.** She is standing 50 paces from a tall tree, tilting her head up until she is looking right at the top.\n\n' +
        '[diagram:TreeGazeDiagram]\n\n' +
        'The angle her gaze makes with the ground (call it θ) is fixed by two things: how far away she stood, and how tall the tree is. If somebody told her the angle and the distance, could she figure out the height *without climbing*?\n\n' +
        'That is the entire job of trigonometry: turn an angle and one side of a right triangle into the other sides.\n\n' +
        '**Same picture, just the math.** Strip the tree, the grass, and Tara herself, and what remains is a right triangle with one acute angle marked θ:\n\n' +
        '[diagram:SOHCAHTOADiagram]\n\n' +
        '**Three names for three sides.** Pick one of the two non-right angles and call it θ (theta). Now look at the triangle from θ\'s point of view:\n\n' +
        '| Side | What it means | How to spot it |\n' +
        '|------|---------------|----------------|\n' +
        '| **Opposite** | The side directly across from θ | Stand at θ; the opposite side is the one you can\'t touch. |\n' +
        '| **Adjacent** | The side next to θ that is *not* the long slanted one | Stand at θ; one of your two arms touches it. |\n' +
        '| **Hypotenuse** | The longest side, always opposite the right angle | The slanted side. Always the same regardless of which θ you pick. |\n\n' +
        '**The three ratios — SOH CAH TOA.**\n\n' +
        '| Ratio | Spelled out | Mnemonic letter |\n' +
        '|-------|-------------|-----------------|\n' +
        '| **sin θ** | opposite / hypotenuse | **S**oh |\n' +
        '| **cos θ** | adjacent / hypotenuse | **C**ah |\n' +
        '| **tan θ** | opposite / adjacent | **T**oa |\n\n' +
        '**Why ratios and not lengths?** A photo of a triangle and the real triangle look different in size — but the *ratios* of their sides are identical. Two right triangles with the same angle θ are similar; their sides scale together. So sin 30° is the same number for a triangle the size of your hand and one the size of a building. Trig captures the shape, not the size.\n\n' +
        '**Walked example — the 30° triangle.** A right triangle has hypotenuse 10 cm and one of its angles is 30°. Find the other two sides.\n\n' +
        '| Step | What to do | Result |\n' +
        '|------|-----------|--------|\n' +
        '| 1 | We know the hypotenuse and want the side opposite the 30° angle. The ratio that connects them is sin: sin 30° = opposite / 10. | — |\n' +
        '| 2 | sin 30° = 0.5 (memorise this — it shows up everywhere). | — |\n' +
        '| 3 | Solve: opposite = 10 × 0.5 | **5 cm** |\n' +
        '| 4 | For the adjacent side use cos: cos 30° = adjacent / 10, and cos 30° ≈ 0.866. | — |\n' +
        '| 5 | adjacent = 10 × 0.866 | **≈ 8.66 cm** |\n' +
        '| 6 | Sanity check with Pythagoras: 5² + 8.66² should equal 10². | 25 + 75 = 100 ✓ |\n\n' +
        '**Check yourself — predict before you compute.** A right triangle has hypotenuse 12 m and θ = 45°. Without a calculator, are the other two sides going to be (a) both equal, (b) one bigger and one smaller, (c) impossible to say? *(Answer at the end of this section.)*\n\n' +
        '**Some special angles you should just know.**\n\n' +
        '| θ | sin θ | cos θ | tan θ |\n' +
        '|---|-------|-------|-------|\n' +
        '| 0° | 0 | 1 | 0 |\n' +
        '| 30° | 1/2 | √3/2 ≈ 0.866 | 1/√3 ≈ 0.577 |\n' +
        '| 45° | √2/2 ≈ 0.707 | √2/2 ≈ 0.707 | 1 |\n' +
        '| 60° | √3/2 ≈ 0.866 | 1/2 | √3 ≈ 1.732 |\n' +
        '| 90° | 1 | 0 | undefined |\n\n' +
        'Notice the sin column going 0 → 1/2 → √2/2 → √3/2 → 1, and the cos column going the same sequence in reverse. That symmetry is not a coincidence — we will see why in the unit-circle section.\n\n' +
        '**Answer to the predict-yourself question:** Both sides equal. At 45°, opposite = adjacent because sin 45° = cos 45°. The triangle is isosceles. Each side ≈ 12 × 0.707 ≈ **8.49 m**.',
      intermediateContent:
        '**Inverse functions: from a ratio back to an angle.** SOH CAH TOA gives you a side when you know the angle. Often you know two sides and need the angle. The inverse functions arcsin (sin⁻¹), arccos (cos⁻¹), arctan (tan⁻¹) reverse the process.\n\n' +
        '*Example.* A ramp rises 1.5 m over a horizontal distance of 6 m. What angle does it make with the ground?\n\n' +
        '`tan θ = opposite / adjacent = 1.5 / 6 = 0.25` → `θ = arctan(0.25) ≈ 14.04°`\n\n' +
        '**Reciprocal ratios.** Three more ratios fill out the family — they are just upside-down versions of sin, cos, tan:\n\n' +
        '| Name | Definition | Why it exists |\n' +
        '|------|-----------|---------------|\n' +
        '| **csc θ** (cosecant) | 1 / sin θ | Used when sin appears in the denominator of a formula |\n' +
        '| **sec θ** (secant) | 1 / cos θ | Appears in calculus integrals and projectile range formulas |\n' +
        '| **cot θ** (cotangent) | 1 / tan θ | Useful when the angle is small (cot ≈ 1/θ) |\n\n' +
        '**Worked example — surveyor finds tower height.** A surveyor stands 40 m from the base of a cell tower and measures the angle of elevation as 53°. The tower is on level ground.\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | Known: adjacent = 40 m, want height = opposite. The ratio is tan: tan 53° = h / 40. | — |\n' +
        '| 2 | tan 53° ≈ 1.327 (calculator) | — |\n' +
        '| 3 | h = 40 × 1.327 | **≈ 53.1 m** |\n' +
        '| 4 | If the surveyor\'s eye was 1.6 m off the ground, tower\'s actual height = 53.1 + 1.6. | **≈ 54.7 m** |\n\n' +
        '**Predicting the answer first.** When θ is between 0° and 45°, tan θ < 1, so the opposite side is *shorter* than the adjacent side. When θ > 45°, tan θ > 1 and the opposite side is *longer*. Here θ = 53° (just above 45°), so we expect h to be slightly larger than 40 m. The answer 53.1 m is consistent — useful sanity check.\n\n' +
        '**Pythagoras + trig together.** If you know the hypotenuse and one ratio, you can recover the other ratio without a calculator:\n\n' +
        '`sin²θ + cos²θ = 1` ⟹ `cos θ = √(1 − sin²θ)` (when cos θ ≥ 0)\n\n' +
        'Example: if sin θ = 3/5, then cos²θ = 1 − 9/25 = 16/25, so cos θ = 4/5 and tan θ = sin/cos = 3/4. This is the famous 3-4-5 right triangle.',
      advancedContent:
        '**Trig from exponentials — Euler\'s formula.** The seemingly innocent identity\n\n' +
        '`e^(iθ) = cos θ + i sin θ`\n\n' +
        'links the exponential function to circular motion. Setting θ = π gives **Euler\'s identity**, e^(iπ) + 1 = 0 — five fundamental constants in one sentence. Differentiating both sides and matching real/imaginary parts proves d(sin θ)/dθ = cos θ and d(cos θ)/dθ = −sin θ in two lines.\n\n' +
        '**Hyperbolic counterparts.** Replace the imaginary unit with 1 in the exponentials and you get **hyperbolic** sin and cos:\n\n' +
        '`sinh x = (eˣ − e⁻ˣ) / 2`,  `cosh x = (eˣ + e⁻ˣ) / 2`\n\n' +
        'These satisfy `cosh²x − sinh²x = 1` (note the minus sign) instead of the Pythagorean `sin² + cos² = 1`. They describe:\n\n' +
        '- The shape of a chain hanging under gravity (catenary curve, used in arch design and suspension cables).\n' +
        '- Velocity addition in special relativity: `tanh(α + β) = (tanh α + tanh β) / (1 + tanh α tanh β)` is the relativistic version of the addition formula.\n' +
        '- Voltage and current along long transmission lines (telegraph equation).\n\n' +
        '**Why "co" in cosine.** cos θ = sin(90° − θ). The "co" in cosine, cotangent, cosecant means "complementary" — referring to the complementary angle (90° − θ). This is not a coincidence of naming — it reflects the symmetry of right triangles: the sin of one acute angle equals the cos of the other.\n\n' +
        '**Numerical computation.** Calculators do not store sin tables — they compute via Taylor series:\n\n' +
        '`sin x = x − x³/3! + x⁵/5! − x⁷/7! + ...`\n\n' +
        'Convergence is fast for small x. For large x, calculators reduce the angle modulo 2π first (or modulo π/2 with sign flips), then apply the series. Modern hardware uses CORDIC (rotation-based bit-shift algorithms) on simple chips, and lookup tables with interpolation on faster processors.',
      diagram: 'SOHCAHTOADiagram',
      interactive: { type: 'python-playground', props: { starterCode: '# Find the missing sides of a right triangle\nimport math\n\nhypotenuse = 10  # cm\nangle_deg = 30\n\n# Convert to radians (Python\'s math functions use radians)\nangle_rad = math.radians(angle_deg)\n\nopposite = hypotenuse * math.sin(angle_rad)\nadjacent = hypotenuse * math.cos(angle_rad)\n\nprint(f"At {angle_deg}° with hypotenuse {hypotenuse} cm:")\nprint(f"  opposite = {opposite:.2f} cm")\nprint(f"  adjacent = {adjacent:.2f} cm")\n\n# Verify with Pythagoras\ncheck = opposite**2 + adjacent**2\nprint(f"\\nopp² + adj² = {check:.2f} (should equal hyp² = {hypotenuse**2})")\n\n# Now try changing angle_deg to 45 or 60 and re-run!\n', title: 'Try it — SOH CAH TOA in code' } },
      practice: practiceSohCahToa,
    },

    // ─────────────────────────────────────────────────────────────
    // 2. The Unit Circle
    // ─────────────────────────────────────────────────────────────
    {
      title: 'The Unit Circle',
      beginnerContent:
        '**The problem with SOH CAH TOA.** Look back at our right triangle. What is sin 120°? You can\'t form a right triangle with an angle bigger than 90° — the sides would have to bend backwards. SOH CAH TOA breaks down. We need a definition that works for *any* angle: 120°, 270°, 1000°, even negative angles.\n\n' +
        '**The fix — use a circle instead of a triangle.** Draw a circle of radius 1 centred at the origin. Pick any angle θ measured from the positive x-axis, going counter-clockwise. The point where your angle\'s ray crosses the circle has coordinates (x, y). We *define*:\n\n' +
        '`cos θ = x`,  `sin θ = y`\n\n' +
        'For acute angles this gives the same answer as SOH CAH TOA — but now it also works for any angle.\n\n' +
        '[diagram:UnitCircleDiagram]\n\n' +
        '**Why this matches the triangle definition.** Drop a vertical line from the point on the circle to the x-axis. You get a right triangle with hypotenuse 1, opposite = y, adjacent = x. Then sin θ = opp/hyp = y/1 = y. Same for cos θ = x. The unit circle is just SOH CAH TOA in disguise — but it keeps working as θ wraps around.\n\n' +
        '**Special angles you should be able to read off the circle.**\n\n' +
        '| θ | (cos θ, sin θ) | Memory hook |\n' +
        '|---|---------------|-------------|\n' +
        '| 0° | (1, 0) | Right side of circle. y = 0. |\n' +
        '| 30° | (√3/2, 1/2) | sin doubles to give a clean 1. |\n' +
        '| 45° | (√2/2, √2/2) | Diagonal. Both coords equal. |\n' +
        '| 60° | (1/2, √3/2) | Mirror of 30°. |\n' +
        '| 90° | (0, 1) | Top of circle. |\n' +
        '| 180° | (−1, 0) | Left side. |\n' +
        '| 270° | (0, −1) | Bottom. |\n' +
        '| 360° | (1, 0) | Back to start. |\n\n' +
        '**The pattern in the sin column.** Sine values at 0°, 30°, 45°, 60°, 90° are √0/2, √1/2, √2/2, √3/2, √4/2 — that simplifies to 0, 1/2, √2/2, √3/2, 1. Cosine is the same sequence in reverse. This means you only have to memorise *one* sequence and which way it goes.\n\n' +
        '**Sign in each quadrant.** Because cos θ is the x-coordinate and sin θ is the y-coordinate, the signs follow directly from the quadrant:\n\n' +
        '| Quadrant | Range | x sign (= cos) | y sign (= sin) | tan = sin/cos |\n' +
        '|----------|-------|----------------|----------------|---------------|\n' +
        '| I | 0°–90° | + | + | + |\n' +
        '| II | 90°–180° | − | + | − |\n' +
        '| III | 180°–270° | − | − | + |\n' +
        '| IV | 270°–360° | + | − | − |\n\n' +
        'Mnemonic: **A**ll **S**tudents **T**ake **C**alculus → **A**ll positive (I), **S**in positive (II), **T**an positive (III), **C**os positive (IV).\n\n' +
        '**Check yourself.** Without computing: is sin 200° positive or negative? *(200° is in Quadrant III — y is negative there — so **sin 200° is negative**.)*',
      intermediateContent:
        '**Radians — angles in the natural unit.** Degrees are arbitrary (why 360 and not 100?). The natural unit, used in calculus and physics, is the **radian**: the angle subtended by an arc of length equal to the radius. A full circle (circumference 2π × radius) is 2π radians. So:\n\n' +
        '| Degrees | Radians | Special because |\n' +
        '|---------|---------|-----------------|\n' +
        '| 0° | 0 | Start |\n' +
        '| 30° | π/6 | |\n' +
        '| 45° | π/4 | |\n' +
        '| 60° | π/3 | |\n' +
        '| 90° | π/2 | Quarter turn |\n' +
        '| 180° | π | Half turn |\n' +
        '| 360° | 2π | Full turn |\n\n' +
        'Conversion: degrees × π/180 = radians.\n\n' +
        '**Why radians matter.** Two reasons that show up later:\n\n' +
        '1. **Arc length and angular speed.** On a circle of radius r, an arc of θ radians has length s = rθ. No 360-versus-2π conversion factor floating around. A wheel of radius 0.3 m rotating at 10 rad/s has its rim moving at v = rω = 0.3 × 10 = 3 m/s.\n' +
        '2. **Calculus stays clean.** d(sin x)/dx = cos x is true *only when x is in radians*. In degrees there\'s an annoying π/180 factor in every derivative. Physicists never use degrees in equations — only when reporting results.\n\n' +
        '**Tan as a slope on the unit circle.** The point at angle θ is (cos θ, sin θ), so the line from the origin to that point has slope sin θ / cos θ = tan θ. This is why tan blows up at 90° — the radius becomes vertical and slope is infinite.\n\n' +
        '**Worked example — converting and using radians.** A bicycle wheel has radius 35 cm. The wheel rotates 240° per second. How fast is the bike moving forward?\n\n' +
        '| Step | Reasoning | Result |\n' +
        '|------|-----------|--------|\n' +
        '| 1 | Convert 240° to radians: 240 × π/180 | 4π/3 ≈ 4.19 rad/s |\n' +
        '| 2 | Linear speed v = rω, with r in metres | 0.35 × 4.19 |\n' +
        '| 3 | Multiply | **≈ 1.47 m/s** |',
      advancedContent:
        '**The unit circle in the complex plane.** Replace the (x, y) coordinate with the complex number z = x + iy. The unit circle becomes {z ∈ ℂ : |z| = 1}, a one-dimensional surface inside the complex plane. By Euler\'s formula, every point on it can be written as z = e^(iθ).\n\n' +
        '**nth roots of unity.** What complex numbers satisfy zⁿ = 1? Exactly n of them, equally spaced around the unit circle:\n\n' +
        '`zₖ = e^(2πik/n)` for k = 0, 1, ..., n − 1.\n\n' +
        'For n = 4: 1, i, −1, −i. For n = 6: 1, e^(iπ/3), e^(2iπ/3), −1, e^(4iπ/3), e^(5iπ/3) — the vertices of a regular hexagon. These roots form a cyclic group under multiplication, which is why they keep appearing in symmetry problems and crystallography.\n\n' +
        '**Connection to signal processing — DFT.** The Discrete Fourier Transform of a length-N sequence x[n] is\n\n' +
        '`X[k] = Σ x[n] · e^(−2πikn/N)`\n\n' +
        'where the e^(...) factors are exactly the Nth roots of unity. Each X[k] tells you "how much frequency k is in your signal." This is what your phone uses to identify which musical notes are in a recording, what an MRI machine uses to reconstruct an image from raw measurements, and what your video player uses to decode H.264.\n\n' +
        '**Why O(N²) becomes O(N log N) — the FFT.** Computing X[k] naively for all k takes N² operations. Cooley & Tukey (1965) noticed that the DFT of length N can be split into two DFTs of length N/2 — using the symmetry of the roots of unity. Recursing gives O(N log N). Without the FFT, real-time audio and video on a phone would be impossible. The unit circle\'s structure is *why* this speedup exists.',
      diagram: 'UnitCircleDiagram',
      practice: practiceUnitCircle,
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Graphs of Trig Functions
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Graphs of Trig Functions',
      beginnerContent:
        '**Trace the y-coordinate as θ goes around.** Stand at the unit circle. Walk counter-clockwise from 0° to 360°, watching the y-coordinate of your position. It starts at 0, climbs to 1 (at 90°), falls back to 0 (at 180°), goes down to −1 (at 270°), and returns to 0 (at 360°). Plot that y-coordinate against θ on a graph and you have drawn the **sine wave**.\n\n' +
        '[diagram:TrigGraphsDiagram]\n\n' +
        '**Three properties that define every sine wave.**\n\n' +
        '| Property | y = sin x | What it means physically |\n' +
        '|----------|-----------|-------------------------|\n' +
        '| **Amplitude** | 1 | Maximum height from the centre line |\n' +
        '| **Period** | 2π (≈ 6.28) | Length of one full cycle before it repeats |\n' +
        '| **Centre line** | 0 | The horizontal line the wave oscillates around |\n\n' +
        '**Cosine is just sine, shifted.** y = cos x has the same shape as y = sin x but starts at (0, 1) instead of (0, 0). It is sine shifted left by π/2 (or 90°). One identity captures this: cos x = sin(x + π/2).\n\n' +
        '**The tangent graph is wild.** y = tan x has period π (not 2π), passes through every multiple of π, and shoots to ±∞ at every odd multiple of π/2. Why? Because tan x = sin x / cos x, and at x = π/2, 3π/2, 5π/2, ..., cos x = 0 — division by zero. Calculator says "Error." The graph has vertical asymptotes there.\n\n' +
        '**Where you have already seen sine waves.**\n\n' +
        '| Phenomenon | Why it is sinusoidal |\n' +
        '|-----------|----------------------|\n' +
        '| Ocean tides | Earth-Moon-Sun geometry rotates uniformly; height ≈ projection on a circle |\n' +
        '| A pendulum swinging | For small angles, position ≈ A sin(2π·t / T) |\n' +
        '| Voltage from a wall socket | Generators rotate at constant speed; coil voltage is sinusoidal |\n' +
        '| Sound of a tuning fork | Vibration is simple harmonic motion |\n' +
        '| Daylight hours through the year | Earth\'s axial tilt + circular orbit |\n\n' +
        '**Check yourself.** Sketch (in your head) the graph of y = 2 sin x without computing values. What is its maximum height? What is its period? *(Maximum = 2. Period unchanged at 2π. Multiplying sin by 2 only stretches it vertically.)*',
      intermediateContent:
        '**The general sinusoid: y = A sin(Bx + C) + D.** Four knobs let you shape any sine wave to any rhythm:\n\n' +
        '| Parameter | Effect | Formula |\n' +
        '|-----------|--------|---------|\n' +
        '| **A** (amplitude) | Stretches vertically | Max = D + A, min = D − A |\n' +
        '| **B** (angular frequency) | Squeezes horizontally | Period = 2π / B |\n' +
        '| **C** (phase) | Slides left/right | Shift = −C / B (left if positive) |\n' +
        '| **D** (vertical shift) | Slides up/down | New centre line is y = D |\n\n' +
        '**Worked example — read off all four parameters.** y = 3 sin(2x − π/2) + 1.\n\n' +
        '| Step | Reasoning | Value |\n' +
        '|------|-----------|-------|\n' +
        '| 1 | A is the coefficient in front of sin | **A = 3** |\n' +
        '| 2 | B is the coefficient of x inside | **B = 2** → period = 2π / 2 = **π** |\n' +
        '| 3 | C is the constant added inside | C = −π/2 → phase shift = −(−π/2)/2 = **π/4 right** |\n' +
        '| 4 | D is the constant added outside | **D = 1** |\n' +
        '| 5 | Range: max = 1 + 3 = 4, min = 1 − 3 = −2 | **[−2, 4]** |\n\n' +
        '**Modelling tides — building a sinusoid from scratch.** A coastal harbour has high tide at 3.5 m and low tide at 0.5 m. The cycle takes 12.4 hours, with high tide at t = 0 hours.\n\n' +
        '| Step | Decision | Why |\n' +
        '|------|---------|-----|\n' +
        '| 1 | Centre line D = (3.5 + 0.5)/2 = **2** | Halfway between high and low |\n' +
        '| 2 | Amplitude A = (3.5 − 0.5)/2 = **1.5** | Half the total swing |\n' +
        '| 3 | Period 12.4 h, so B = 2π / 12.4 ≈ **0.507** | One full cycle in 12.4 hours |\n' +
        '| 4 | High tide at t = 0 means we want a cosine (which peaks at 0), or a sine shifted by π/2 left | Choose cos: simpler |\n' +
        '| 5 | Final model | **h(t) = 1.5 cos(0.507 t) + 2** |\n\n' +
        'Sanity-check: at t = 0, h = 1.5 + 2 = 3.5 ✓. At t = 6.2 (half period), h = 1.5 cos(π) + 2 = 0.5 ✓.',
      advancedContent:
        '**Fourier\'s theorem (1807).** Any reasonable periodic function can be written as an infinite sum of sines and cosines:\n\n' +
        '`f(x) = a₀/2 + Σ [aₙ cos(nx) + bₙ sin(nx)]`\n\n' +
        'where the coefficients aₙ, bₙ are calculated by integration. This converted music, images, and signals into "lists of amplitudes" — the foundation of audio compression, image compression, telecommunications, and quantum mechanics.\n\n' +
        '**Building a square wave from sines.** A square wave is the limit of\n\n' +
        '`(4/π) [sin x + sin(3x)/3 + sin(5x)/5 + sin(7x)/7 + ...]`\n\n' +
        '— odd harmonics with rapidly shrinking weights. Try just three terms: the result already looks square-ish. With ten terms it is sharper. With infinitely many it would be exact. **But not quite** — the partial sums always overshoot the corners by about 9% (the **Gibbs phenomenon**). Truncating a Fourier series introduces ringing artifacts at sharp edges. The faint "halos" around hard edges in low-quality JPEG images are exactly this — JPEG truncates the discrete cosine transform and the truncation rings.\n\n' +
        '**The Heisenberg uncertainty in signal processing.** A sharp pulse in time has a wide Fourier spectrum; a single pure frequency exists for all time. The product of "duration in time" and "spread in frequency" has a lower bound: Δt · Δω ≥ 1/2. This is not metaphorical; it is the same inequality as Heisenberg\'s uncertainty principle in quantum mechanics — both express the fact that a function and its Fourier transform cannot both be sharply localised.\n\n' +
        '**Why audio engineers think in terms of sine waves.** Any sound — a violin, a voice, a thunderclap — is a wave that can be decomposed into sine components. Equalisers boost or cut specific frequencies. Lossy compressors throw away components humans cannot hear. Synthesizers add components to build new sounds. The graph of y = sin x is the atomic unit of all of this.',
      diagram: 'TrigGraphsDiagram',
      interactive: { type: 'python-playground', props: { starterCode: '# Plot a sinusoid and see how A, B, C, D change its shape\nimport math\n\nA = 1.5     # amplitude\nB = 0.507   # angular frequency (period = 2π/B ≈ 12.4)\nC = 0       # phase shift\nD = 2       # vertical shift\n\nprint(f"Tide model: h(t) = {A} sin({B}t + {C}) + {D}")\nprint(f"Period: {2*math.pi/B:.2f} hours\\n")\n\n# Sample every 2 hours over one full period\nfor hours in range(0, 13, 2):\n    h = A * math.sin(B * hours + C) + D\n    bar = "▇" * int(h * 5)  # crude bar chart\n    print(f"t = {hours:>2}h:  h = {h:.2f} m  {bar}")\n\n# Try changing A or B and re-running.\n', title: 'Try it — Sinusoid playground' } },
      practice: practiceTrigGraphs,
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Heights and Distances
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Heights and Distances',
      beginnerContent:
        '**The original use of trigonometry.** Long before phones and lasers, surveyors needed to know how tall a mountain was, how wide a river ran, how far a ship sat offshore — without climbing, swimming, or sailing. Trigonometry was *invented* to solve those problems. Two thousand years later, GPS satellites still use the same principles.\n\n' +
        '[diagram:HeightDistanceDiagram]\n\n' +
        '**Two angles you need to know.**\n\n' +
        '| Term | Definition | When to use |\n' +
        '|------|-----------|-------------|\n' +
        '| **Angle of elevation** | Angle measured *upward* from horizontal | You are at the bottom looking up at something tall |\n' +
        '| **Angle of depression** | Angle measured *downward* from horizontal | You are on top looking down at something below |\n\n' +
        'Both are measured from a horizontal reference line — never from the ground if the ground is sloped, never from the vertical.\n\n' +
        '**Worked example 1 — height of a tree.** You stand 50 m from the base of a tree on level ground. Your eye is 1.6 m above the ground. You measure the angle of elevation to the top of the tree as 32°. How tall is the tree?\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | Right triangle: adjacent = 50 m (your distance from the tree), angle = 32°, opposite = h (height *above your eye*) | — |\n' +
        '| 2 | tan 32° = h / 50 → h = 50 × tan 32° | — |\n' +
        '| 3 | tan 32° ≈ 0.6249 | h ≈ 50 × 0.6249 |\n' +
        '| 4 | Add eye height to get tree height | **31.2 + 1.6 ≈ 32.8 m** |\n\n' +
        '**Worked example 2 — boat from a cliff.** From the top of an 80 m cliff you measure the angle of depression to a boat as 20°. How far offshore is the boat?\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | The angle of depression from the top equals the angle of elevation seen from the boat (alternate angles, parallel horizontal lines) | — |\n' +
        '| 2 | Right triangle: opposite = cliff height = 80 m, adjacent = horizontal distance d, angle = 20° | — |\n' +
        '| 3 | tan 20° = 80 / d → d = 80 / tan 20° | — |\n' +
        '| 4 | tan 20° ≈ 0.364 | d ≈ 80 / 0.364 |\n' +
        '| 5 | | **≈ 220 m** |\n\n' +
        '**Worked example 3 — width of a river without a boat.** You stand at point A on one bank, directly across from a tree (point B) on the opposite bank. Walk along your bank to point C, exactly 40 m from A. Now measure the angle ∠ACB = 55°.\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | In right triangle ABC, AB ⊥ AC (because B was directly across from A). Adjacent = AC = 40 m, opposite = AB = river width w | — |\n' +
        '| 2 | tan 55° = w / 40 → w = 40 × tan 55° | — |\n' +
        '| 3 | tan 55° ≈ 1.428 | w ≈ 40 × 1.428 |\n' +
        '| 4 | | **≈ 57 m** |\n\n' +
        '**Check yourself.** A surveyor 60 m from a tower measures elevation 41°. Is the tower roughly (a) 30 m, (b) 50 m, or (c) 80 m tall? *(tan 41° is close to but less than 1, since 45° gives exactly 1. So height < 60 m. The closest is **(b) 50 m**.)*',
      intermediateContent:
        '**Two-observation problems — when you cannot directly access the base.** Suppose the foot of a mountain is on the far side of a river you can\'t cross. Single-angle methods need the horizontal distance, which you don\'t have. Solution: take *two* readings from different positions along a line.\n\n' +
        '**Worked example.** From point A on flat ground, the angle of elevation to a tower top is 30°. You walk 50 m straight toward the tower to point B; now the angle is 60°. How tall is the tower, and how far were you from its base at A?\n\n' +
        '| Step | Reasoning | Equation |\n' +
        '|------|-----------|----------|\n' +
        '| 1 | Let h = tower height, d = distance from B to base. From B: tan 60° = h/d. tan 60° = √3. | h = d√3 |\n' +
        '| 2 | From A (50 m further away): tan 30° = h/(d + 50). tan 30° = 1/√3. | h = (d + 50)/√3 |\n' +
        '| 3 | Set the two expressions for h equal. | d√3 = (d + 50)/√3 |\n' +
        '| 4 | Multiply both sides by √3. | 3d = d + 50 |\n' +
        '| 5 | Solve for d. | **d = 25 m** |\n' +
        '| 6 | h = d√3 = 25 × 1.732 | **h ≈ 43.3 m** |\n' +
        '| 7 | Distance from A = d + 50 | **75 m** |\n\n' +
        '**Verification.** From 75 m, elevation should be arctan(43.3/75) = arctan(0.577) ≈ 30° ✓. From 25 m, arctan(43.3/25) = arctan(1.732) ≈ 60° ✓.\n\n' +
        '**Why this method matters.** This is exactly how you measure the height of a peak across a valley, the depth of a crater, or the altitude of a flying balloon you can\'t put a tape measure on. NASA used variants of this triangulation to measure the distance to the Moon (the **lunar parallax** — observed from two points on Earth simultaneously) and the same idea, scaled up, to measure the distance to nearby stars (**stellar parallax**, with the two points being Earth\'s position six months apart).',
      advancedContent:
        '**Spherical trigonometry — when the ground curves.** SOH CAH TOA assumes flat space. Once your distances exceed a few hundred kilometres, Earth\'s curvature matters. The flat-plane laws have spherical analogues:\n\n' +
        '| Flat plane | Sphere of radius R |\n' +
        '|-----------|---------------------|\n' +
        '| sin²θ + cos²θ = 1 | Replaces angle θ with arc s/R |\n' +
        '| Law of cosines: c² = a² + b² − 2ab cos C | cos(c/R) = cos(a/R) cos(b/R) + sin(a/R) sin(b/R) cos C |\n' +
        '| Triangle angles sum to 180° | Sum > 180°; excess equals area / R² |\n\n' +
        '**The haversine formula** (used by every flight tracker, every map app, every GPS unit) gives the great-circle distance between two points (φ₁, λ₁) and (φ₂, λ₂) on Earth (latitude φ, longitude λ):\n\n' +
        '`d = 2R · arcsin(√[sin²(Δφ/2) + cos φ₁ cos φ₂ sin²(Δλ/2)])`\n\n' +
        'It is just spherical Pythagoras dressed up. The "haversine" is a half-versine — half of (1 − cos θ) — chosen for numerical stability when distances are small.\n\n' +
        '**Worked numerical example — Mumbai to Guwahati.** Mumbai (19.07° N, 72.88° E), Guwahati (26.14° N, 91.74° E). Δφ = 7.07° = 0.123 rad; Δλ = 18.86° = 0.329 rad. Earth radius R ≈ 6371 km.\n\n' +
        '`a = sin²(0.0617) + cos(19.07°) cos(26.14°) sin²(0.165)`\n' +
        '`  = 0.00380 + 0.945 × 0.898 × 0.0271 = 0.0269`\n' +
        '`d = 2 × 6371 × arcsin(√0.0269) ≈ 2 × 6371 × 0.165 = 2103 km`\n\n' +
        'Aircraft flight-distance tables list Mumbai-Guwahati as ~2100 km. Match.\n\n' +
        '**The angular excess — Earth\'s triangles bulge.** A triangle with two equator-to-pole sides and an equator base has three right angles, summing to 270°. The excess (90°) divided by R² gives the area: (π/2) R² = πR²/2 — exactly one-eighth of Earth\'s surface area, which is correct (one of eight octants). This connects geometry directly to area without integrating.',
      practice: practiceHeightDistance,
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Trigonometric Identities
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Trigonometric Identities',
      beginnerContent:
        '**An identity is an equation that is always true** — for every value of the variable where both sides make sense. Compare with a regular equation like sin x = 0.5, which is only true for specific x values.\n\n' +
        '**The most important identity of all.** Look at any point (cos θ, sin θ) on the unit circle. The point lies on a circle of radius 1, so its coordinates satisfy x² + y² = 1. Therefore:\n\n' +
        '`sin²θ + cos²θ = 1`  *(Pythagorean identity)*\n\n' +
        'This is just the Pythagorean theorem applied to the right triangle inside the unit circle. It is true for every angle θ. From it, two more identities drop out by dividing through:\n\n' +
        '| Divide sin²θ + cos²θ = 1 by ... | Get |\n' +
        '|--------------------------------|-----|\n' +
        '| cos²θ | tan²θ + 1 = sec²θ |\n' +
        '| sin²θ | 1 + cot²θ = csc²θ |\n\n' +
        '**Why identities matter — they let you simplify.** Suppose you have to compute (sin²θ + cos²θ)/cos θ for θ = 37.4°. Without the identity you would compute sin 37.4°, square it, compute cos 37.4°, square it, add, divide. With the identity, the numerator is just 1 — you only need cos 37.4°. Identities cut work.\n\n' +
        '**Double angle formulas.** What is sin 2θ in terms of θ? You might hope sin 2θ = 2 sin θ — but that is wrong (sin 60° ≠ 2 sin 30°: 0.866 ≠ 1). The correct formula is\n\n' +
        '`sin 2θ = 2 sin θ cos θ`,\n`cos 2θ = cos²θ − sin²θ`\n\n' +
        'Verify with θ = 30°: 2 × 0.5 × (√3/2) = √3/2 ≈ 0.866 = sin 60° ✓.\n\n' +
        '**Why the cosine version has three forms.** Using sin² + cos² = 1, cos 2θ can be rewritten as:\n\n' +
        '`cos 2θ = cos²θ − sin²θ = 2cos²θ − 1 = 1 − 2sin²θ`\n\n' +
        'All three are equal. Use whichever has the variable you happen to know.\n\n' +
        '**Where you will encounter identities.**\n\n' +
        '| Setting | Identity in action |\n' +
        '|---------|--------------------|\n' +
        '| Solving trig equations | Replace cos²θ with 1 − sin²θ to make a quadratic in sin θ |\n' +
        '| Calculus integrals | ∫cos²x dx is hard; ∫(1 + cos 2x)/2 dx is one line |\n' +
        '| Sound synthesis | Multiplying two sine waves equals a sum of two sine waves (product-to-sum) — the basis of FM radio and AM modulation |\n' +
        '| Computer graphics | Rotating a vector by θ uses (cos θ, sin θ); composing two rotations uses double-angle |\n\n' +
        '**Check yourself.** If sin θ = 0.6, what is cos²θ? *(Use sin² + cos² = 1: cos²θ = 1 − 0.36 = **0.64**, so cos θ = ±0.8.)*',
      intermediateContent:
        '**The key identity families — when you need them.**\n\n' +
        '| Family | Formula | When useful |\n' +
        '|--------|---------|-------------|\n' +
        '| **Pythagorean** | sin²θ + cos²θ = 1 | Eliminate one of sin/cos in any equation |\n' +
        '| **Sum** | sin(A+B) = sin A cos B + cos A sin B | Combine waves of the same frequency |\n' +
        '| **Sum** | cos(A+B) = cos A cos B − sin A sin B | Same |\n' +
        '| **Double angle** | sin 2A = 2 sin A cos A | Replace 2A or simplify products |\n' +
        '| **Half angle** | sin²(A/2) = (1 − cos A)/2 | Integrate sin² or cos² |\n' +
        '| **Sum-to-product** | sin A + sin B = 2 sin((A+B)/2) cos((A−B)/2) | Combine same-amplitude waves |\n' +
        '| **Product-to-sum** | sin A cos B = ½[sin(A+B) + sin(A−B)] | Multiplication-modulation in radio |\n\n' +
        '**Worked example — simplify sin 75° + sin 15° without a calculator.**\n\n' +
        '| Step | Reasoning | Result |\n' +
        '|------|-----------|--------|\n' +
        '| 1 | Apply sum-to-product with A = 75°, B = 15° | 2 sin((75+15)/2) cos((75−15)/2) |\n' +
        '| 2 | Compute averages | 2 sin 45° cos 30° |\n' +
        '| 3 | sin 45° = √2/2, cos 30° = √3/2 | 2 × (√2/2) × (√3/2) |\n' +
        '| 4 | Multiply | **√6/2 ≈ 1.225** |\n\n' +
        '**Proving an identity — work one side at a time.** Show (1 − cos 2θ) / sin 2θ = tan θ.\n\n' +
        '| Step | Substitution | Result |\n' +
        '|------|--------------|--------|\n' +
        '| 1 | Use cos 2θ = 1 − 2sin²θ in numerator | (1 − (1 − 2sin²θ)) / sin 2θ = 2sin²θ / sin 2θ |\n' +
        '| 2 | Use sin 2θ = 2 sin θ cos θ in denominator | 2sin²θ / (2 sin θ cos θ) |\n' +
        '| 3 | Cancel 2 and one sin θ | sin θ / cos θ |\n' +
        '| 4 | Definition of tan | **tan θ ✓** |\n\n' +
        'Convention: when proving an identity, transform *only one side* until it equals the other. Don\'t move terms across the equals sign — that assumes what you are trying to prove.',
      advancedContent:
        '**Identities from Euler\'s formula — algebra replaces cleverness.** Once you have e^(iθ) = cos θ + i sin θ, every trig identity becomes a one-line consequence of exponential rules.\n\n' +
        'Multiply: e^(iA) · e^(iB) = e^(i(A+B)). Expand left side: (cos A + i sin A)(cos B + i sin B) = (cos A cos B − sin A sin B) + i(sin A cos B + cos A sin B). Compare real and imaginary parts to e^(i(A+B)) = cos(A+B) + i sin(A+B):\n\n' +
        '`cos(A+B) = cos A cos B − sin A sin B`\n`sin(A+B) = sin A cos B + cos A sin B`\n\n' +
        'Both sum formulas in two lines. No clever triangle decomposition needed.\n\n' +
        '**Chebyshev polynomials.** Define Tₙ(x) so that Tₙ(cos θ) = cos(nθ). Then T₀(x) = 1, T₁(x) = x, T₂(x) = 2x² − 1, T₃(x) = 4x³ − 3x, ... satisfying the recurrence Tₙ₊₁(x) = 2x Tₙ(x) − Tₙ₋₁(x). These polynomials minimise the worst-case approximation error among polynomials of fixed degree on [−1, 1] (the **minimax** property). Numerical libraries use them for high-accuracy computation of sin, cos, log, exp — a Chebyshev-fitted polynomial gives more uniform error than Taylor series.\n\n' +
        '**The Hilbert transform — a 90° phase shifter.** Defined by H(f)(t) = (1/π) PV ∫ f(τ) / (t − τ) dτ. It shifts every frequency component by exactly 90°. Combined with the original signal it produces the **analytic signal** f(t) + i H(f)(t), whose magnitude is the instantaneous amplitude and whose phase derivative is the instantaneous frequency. This is how SSB radio modulation works, how FM demodulators decode music, and how MRI scanners turn raw measurements into images.\n\n' +
        '**One identity that runs the world: Parseval\'s theorem.** For periodic f with Fourier coefficients (aₙ, bₙ):\n\n' +
        '`(1/T) ∫|f(t)|² dt = (a₀/2)² + (1/2) Σ(aₙ² + bₙ²)`\n\n' +
        'In words: the total energy of a signal in the time domain equals the sum of energies of its frequency components. This is why we can compress audio (drop low-energy frequencies, save storage), denoise images (drop frequencies dominated by noise), and analyse stars (decompose light spectra into emission lines). Every identity above feeds into this one.',
      practice: practiceTrigIdentities,
    },
  ],
};
