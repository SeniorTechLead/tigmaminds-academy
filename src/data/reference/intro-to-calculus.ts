import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'intro-to-calculus',
  title: 'Calculus',
  category: 'math',
  icon: '📐',
  tagline: 'The mathematics of change — how slopes and areas reveal the rules behind motion.',
  relatedStories: ['siang-river', 'bamboo-grows-fast'],
  understand: [
    {
      title: 'Limits — Approaching Without Arriving',
      beginnerContent:
        '**What is a limit?**\n\n' +
        'A limit describes what value a function **approaches** as its input gets closer to a point — even if the function never reaches that value.\n\n' +
        '**Example:** `f(x) = (x² - 1)/(x - 1)`\n\n' +
        '| x | f(x) |\n' +
        '|---|------|\n' +
        '| 0.9 | 1.9 |\n' +
        '| 0.99 | 1.99 |\n' +
        '| 0.999 | 1.999 |\n' +
        '| 1.0 | **undefined** (0/0) |\n\n' +
        'We write: `lim(x->1) (x²-1)/(x-1) = 2`\n\n' +
        '**Algebraically:** Factor the numerator: `(x+1)(x-1)/(x-1) = x+1`, which equals 2 at x = 1. The limit tells us the function "wants" to be 2, even though it has a hole there.\n\n' +
        '**Why limits matter:**\n\n' +
        '- Without limits, you cannot define derivatives or integrals\n' +
        '- `lim(x->0) sin(x)/x = 1` — essential for trig derivatives\n' +
        '- `lim(x->infinity) 1/x = 0` — captures the idea of infinity\n\n' +
        'Limits are the **foundation** upon which ALL of calculus is built.',
      intermediateContent:
        '**Techniques for evaluating limits:**\n\n' +
        '| Technique | Example | Result |\n' +
        '|-----------|---------|--------|\n' +
        '| Factoring | lim(x->4) (x²-16)/(x-4) = lim(x+4) | **8** |\n' +
        '| L\'Hopital\'s Rule (0/0 or inf/inf) | lim(x->0) sin(x)/x = cos(x)/1 | **1** |\n' +
        '| Divide by highest power | lim(x->inf) (3x²+1)/(5x²-2) | **3/5** |\n\n' +
        '**One-sided limits matter:**\n\n' +
        '- `lim(x->0+) 1/x = +infinity`\n' +
        '- `lim(x->0-) 1/x = -infinity`\n\n' +
        'If left and right limits disagree, the two-sided limit does not exist.',
      advancedContent:
        '**The Epsilon-Delta Definition — A Challenge Game**\n\n' +
        'Think of the rigorous definition of a limit as a two-player game:\n\n' +
        '1. **Your opponent** picks an epsilon (e) — a tiny tolerance. They say: "I want f(x) within e of L."\n' +
        '2. **You** must find a delta (d) — a range around the target point — so that whenever x is within d of c, f(x) is within e of L.\n' +
        '3. If you can **always win** no matter how small epsilon is, the limit exists and equals L.\n\n' +
        '**Formal statement:** `lim(x->c) f(x) = L` means: for every e > 0, there exists d > 0 such that `0 < |x - c| < d` implies `|f(x) - L| < e`.\n\n' +
        '**Concrete example:** Prove `lim(x->3) 2x + 1 = 7`.\n\n' +
        '| Step | Work |\n' +
        '|------|------|\n' +
        '| We need | \\|f(x) - 7\\| < e whenever \\|x - 3\\| < d |\n' +
        '| Simplify | \\|(2x+1) - 7\\| = \\|2x - 6\\| = 2\\|x - 3\\| |\n' +
        '| Choose d | Set d = e/2. Then 2\\|x - 3\\| < 2(e/2) = e |\n' +
        '| Result | No matter how small e is, d = e/2 works. The limit is proven. |\n\n' +
        '---\n\n' +
        '**Intermediate Value Theorem (IVT) — No Teleporting Allowed**\n\n' +
        'The intuition is simple: **continuous functions cannot skip values.** If you drive from 0 mph to 60 mph, at some point you were going exactly 30 mph. You cannot teleport from 0 to 60 without passing through every speed in between.\n\n' +
        '**Formal statement:** If f is continuous on [a, b] and k is any value between f(a) and f(b), then there exists some c in (a, b) where f(c) = k.\n\n' +
        '**Why should you care?** IVT is how we prove roots exist. If f(1) = -3 and f(2) = 5, and f is continuous, then f(c) = 0 for some c between 1 and 2. The root **must** be there, even before we find it. This is the theoretical foundation behind root-finding algorithms like bisection and Newton\'s method.\n\n' +
        '---\n\n' +
        '**Squeeze Theorem — Trapped Between Converging Walls**\n\n' +
        'Imagine walking down a narrowing corridor. The left wall and right wall are closing in toward the same point. You are between them. Where do you end up? At that same point. You have no choice.\n\n' +
        '**Formal statement:** If `g(x) <= f(x) <= h(x)` near a point, and `lim g(x) = lim h(x) = L`, then `lim f(x) = L`.\n\n' +
        '**Classic example:** Prove `lim(x->0) x²sin(1/x) = 0`.\n\n' +
        '| Piece | Reasoning |\n' +
        '|-------|-----------|\n' +
        '| sin(1/x) oscillates wildly | But it is always between -1 and 1 |\n' +
        '| So -x² <= x²sin(1/x) <= x² | f(x) is trapped between -x² and x² |\n' +
        '| lim(x->0) -x² = 0 | Left wall goes to 0 |\n' +
        '| lim(x->0) x² = 0 | Right wall goes to 0 |\n' +
        '| Conclusion | x²sin(1/x) is squeezed to 0 |\n\n' +
        'Developed by Cauchy and Weierstrass in the 19th century, these foundations replaced vague notions of "infinitely small" with precise, provable definitions — turning calculus from an intuitive tool into a rigorous branch of mathematics.',
      diagram: 'LimitDiagram',
    },
    {
      title: 'Derivatives — The Slope at a Point',
      beginnerContent:
        '**What is a derivative?**\n\n' +
        'The derivative measures the **instantaneous rate of change** — how fast the output changes relative to the input at one exact moment.\n\n' +
        'If you plot bamboo height over time, the derivative at any point tells you how fast it is growing **right then**.\n\n' +
        '**Formal definition:**\n\n' +
        '`f\'(x) = lim(h->0) [f(x+h) - f(x)] / h`\n\n' +
        '**Worked example:** f(x) = x²\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Expand | [(x+h)² - x²]/h |\n' +
        '| Simplify | [2xh + h²]/h = 2x + h |\n' +
        '| Take limit | h -> 0: **f\'(x) = 2x** |\n\n' +
        '**What the derivative tells you:**\n\n' +
        '| At x = | f\'(x) = 2x | Meaning |\n' +
        '|--------|-----------|--------|\n' +
        '| 3 | 6 | Rising steeply |\n' +
        '| 0 | 0 | Momentarily flat (bottom of parabola) |\n' +
        '| -2 | -4 | Falling |\n\n' +
        '- f\'(x) > 0 → function is **increasing**\n' +
        '- f\'(x) < 0 → function is **decreasing**\n' +
        '- f\'(x) = 0 → **peak, valley, or inflection point**\n\n' +
        'Finding where f\'(x) = 0 locates maxima and minima — the heart of **optimisation**.',
      intermediateContent:
        '**Derivatives to know:**\n\n' +
        '| Function | Derivative |\n' +
        '|----------|----------|\n' +
        '| x^n | n*x^(n-1) |\n' +
        '| sin x | cos x |\n' +
        '| cos x | -sin x |\n' +
        '| e^x | e^x |\n' +
        '| ln x | 1/x |\n' +
        '| tan x | sec²x |\n\n' +
        '**Worked optimisation:** Maximise area of a rectangle in a semicircle of radius r.\n\n' +
        '| Step | Work |\n' +
        '|------|------|\n' +
        '| Setup | A = 2x * sqrt(r²-x²) |\n' +
        '| Set dA/dx = 0 | x = r/sqrt(2) |\n' +
        '| Max area | **r²** |\n\n' +
        'Second derivative test confirms it is a maximum.',
      advancedContent:
        '**Physical meaning chain:** position -> velocity -> acceleration (successive derivatives). Each derivative peels back one layer of motion.\n\n' +
        '---\n\n' +
        '**Related Rates — Step by Step**\n\n' +
        'Related rates problems ask: "Two quantities are changing. I know the rate of one. What is the rate of the other?" The chain rule connects them.\n\n' +
        '**Example:** A balloon inflates at dV/dt = 100 cm³/s. How fast is the radius growing when r = 10 cm?\n\n' +
        '| Step | What you do | Work |\n' +
        '|------|-------------|------|\n' +
        '| 1. Write the relationship | V and r are related by geometry | V = (4/3)pi*r³ |\n' +
        '| 2. Differentiate both sides with respect to time | Chain rule — r depends on t | dV/dt = 4*pi*r² * dr/dt |\n' +
        '| 3. Plug in what you know | dV/dt = 100, r = 10 | 100 = 4*pi*(100) * dr/dt |\n' +
        '| 4. Solve for what you want | Isolate dr/dt | dr/dt = 100/(400*pi) ≈ **0.08 cm/s** |\n\n' +
        '**Key insight:** You never differentiate with respect to r or V directly. Everything is differentiated with respect to **time**, because time is the hidden variable driving both changes.\n\n' +
        '---\n\n' +
        '**Taylor Series — Approximating Curves with Polynomials**\n\n' +
        'The big idea: **any smooth function can be approximated by a polynomial**, and the more terms you keep, the better the approximation.\n\n' +
        'Why polynomials? Because they are trivially easy to compute — just addition and multiplication. This is literally how your calculator evaluates sin, cos, e^x, and ln.\n\n' +
        '**Formula:** `f(x) = f(a) + f\'(a)(x-a) + f\'\'(a)(x-a)²/2! + f\'\'\'(a)(x-a)³/3! + ...`\n\n' +
        'Each term captures one more "layer" of the function\'s behavior at the point a: its value, its slope, its curvature, the rate of change of curvature, and so on.\n\n' +
        '**Example: sin(x) around x = 0**\n\n' +
        '`sin(x) ≈ x - x³/6 + x⁵/120 - x⁷/5040 + ...`\n\n' +
        'Watch how adding terms improves accuracy:\n\n' +
        '| x = 0.5 | Approximation | Value | Error |\n' +
        '|---------|--------------|-------|-------|\n' +
        '| Just x | 0.5 | 0.500000 | 0.0206 |\n' +
        '| x - x³/6 | 0.5 - 0.0208 | 0.479167 | 0.0003 |\n' +
        '| x - x³/6 + x⁵/120 | + 0.000260 | 0.479427 | 0.000001 |\n' +
        '| Exact sin(0.5) | — | 0.479426 | — |\n\n' +
        'Three terms give **six decimal places of accuracy** at x = 0.5. This is why Taylor series are so powerful — a handful of simple arithmetic operations replaces a transcendental function.',
      diagram: 'DerivativeVisualizerDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Explore derivatives numerically\ndef f(x):\n    return x**3 - 3*x + 1\n\ndef derivative(f, x, h=0.0001):\n    return (f(x + h) - f(x)) / h\n\nprint("x     f(x)    f\'(x)")\nprint("-" * 28)\nfor x in [-2, -1, 0, 1, 2, 3]:\n    print(f"{x:>3}   {f(x):>6.1f}   {derivative(f, x):>6.1f}")\n\n# Where is f\'(x) = 0? (peaks/valleys)\n# Try changing f(x) above!', title: 'Try it — Derivatives' } },
    },
    {
      title: 'Rules of Differentiation',
      beginnerContent:
        '**Rather than computing limits every time, use these rules:**\n\n' +
        '**The power rule** (the workhorse):\n\n' +
        '`d/dx(x^n) = n*x^(n-1)`\n\n' +
        '| Function | Derivative |\n' +
        '|----------|----------|\n' +
        '| x³ | 3x² |\n' +
        '| x⁷ | 7x⁶ |\n' +
        '| sqrt(x) = x^(1/2) | (1/2)x^(-1/2) = 1/(2*sqrt(x)) |\n' +
        '| constant (e.g. 5) | 0 |\n\n' +
        '**Combining functions:**\n\n' +
        '| Rule | Formula | Example |\n' +
        '|------|---------|--------|\n' +
        '| Sum | (f+g)\' = f\' + g\' | (x² + 3x)\' = 2x + 3 |\n' +
        '| Constant multiple | (cf)\' = cf\' | (5x³)\' = 15x² |\n' +
        '| Product | (fg)\' = f\'g + fg\' | (x*sin x)\' = sin x + x*cos x |\n' +
        '| Quotient | (f/g)\' = (f\'g - fg\')/g² | |\n' +
        '| Chain | dy/dx = f\'(g(x)) * g\'(x) | |\n\n' +
        '**Chain rule example:** y = (3x + 1)⁵\n\n' +
        'Let u = 3x + 1, so y = u⁵. Then dy/du = 5u⁴, du/dx = 3.\n\n' +
        '`dy/dx = 5(3x+1)⁴ * 3 = 15(3x+1)⁴`\n\n' +
        '**Special derivatives:** d/dx(sin x) = cos x, d/dx(e^x) = e^x (the exponential is its own derivative!), d/dx(ln x) = 1/x.',
      intermediateContent:
        '**Chain rule in action:**\n\n' +
        '| Expression | Derivative |\n' +
        '|-----------|----------|\n' +
        '| sin(x³) | cos(x³) * 3x² |\n' +
        '| e^(2x+1) | e^(2x+1) * 2 |\n' +
        '| x² sin x (product) | 2x sin x + x² cos x |\n\n' +
        '**Implicit differentiation:** For x² + y² = 25, differentiate both sides:\n\n' +
        '2x + 2y(dy/dx) = 0, so dy/dx = -x/y. At (3, 4): dy/dx = **-3/4**.',
      advancedContent:
        '**Automatic Differentiation (AD) — How AI Learns**\n\n' +
        'Every time you train a neural network, the computer must compute derivatives of the loss function with respect to millions of parameters. Doing this by hand is impossible. Numerical approximation (finite differences) is too slow and too inaccurate. **Automatic differentiation** solves this by applying the chain rule systematically to a computational graph.\n\n' +
        '**The two modes:**\n\n' +
        '| Mode | Direction | Best when |\n' +
        '|------|-----------|----------|\n' +
        '| Forward-mode | Input -> Output | Few inputs, many outputs |\n' +
        '| Reverse-mode (backprop) | Output -> Input | Many inputs, few outputs (e.g., neural networks) |\n\n' +
        '**Concrete example:** `y = (a + b) * c`\n\n' +
        'The computational graph has two steps:\n' +
        '- Step 1: `p = a + b`\n' +
        '- Step 2: `y = p * c`\n\n' +
        '**Forward mode** (tracking da, the derivative with respect to a):\n\n' +
        '| Node | Value | Derivative w.r.t. a |\n' +
        '|------|-------|--------------------|\n' +
        '| a | a | da/da = 1 |\n' +
        '| b | b | db/da = 0 |\n' +
        '| p = a + b | a + b | dp/da = 1 + 0 = 1 |\n' +
        '| c | c | dc/da = 0 |\n' +
        '| y = p * c | (a+b)*c | dy/da = c*1 + (a+b)*0 = **c** |\n\n' +
        'One forward pass gives us dy/da. To get dy/db and dy/dc, we need two more passes.\n\n' +
        '**Reverse mode** (tracking dy, the derivative of the output):\n\n' +
        '| Node | dy/d(node) | How |\n' +
        '|------|-----------|-----|\n' +
        '| y | 1 | Start here |\n' +
        '| p | dy/dp = c | y = p*c, so dy/dp = c |\n' +
        '| c | dy/dc = p = a+b | y = p*c, so dy/dc = p |\n' +
        '| a | dy/da = dy/dp * dp/da = c*1 = **c** | Chain rule backward |\n' +
        '| b | dy/db = dy/dp * dp/db = c*1 = **c** | Chain rule backward |\n\n' +
        'One reverse pass gives dy/da, dy/db, AND dy/dc — all at once. For a neural network with millions of parameters and one scalar loss, reverse mode computes **all** gradients in roughly the same time as one forward evaluation. This is why backpropagation made deep learning feasible.',
    },
    {
      title: 'Integration — Area Under a Curve',
      beginnerContent:
        '**Integration is the reverse of differentiation.**\n\n' +
        'Where derivatives break a curve into slopes, integrals add up infinitely many thin slices to find the **total area** under a curve.\n\n' +
        '**The definite integral** from a to b of f(x) represents the signed area between f(x) and the x-axis. "Signed" means area above the axis is positive, below is negative.\n\n' +
        '**How it works:**\n\n' +
        '1. Divide [a, b] into n thin rectangles (width = (b-a)/n)\n' +
        '2. Sum all rectangle areas (Riemann sum)\n' +
        '3. As n approaches infinity, the sum converges to the exact integral\n\n' +
        '**Example:** Area under y = x² from x = 0 to x = 3:\n\n' +
        '| Step | Work |\n' +
        '|------|------|\n' +
        '| Antiderivative of x² | x³/3 |\n' +
        '| Evaluate at bounds | [3³/3] - [0³/3] |\n' +
        '| Result | 9 - 0 = **9 square units** |\n\n' +
        '`d/dx(x³/3) = x²` — integration and differentiation are **inverse operations**.\n\n' +
        '**Real-world uses:** Water flow rate in the Brahmaputra (integrate velocity), distance from velocity, energy from power output, probability from density functions.',
      intermediateContent:
        '**Basic antiderivatives:**\n\n' +
        '| Function | Antiderivative |\n' +
        '|----------|---------------|\n' +
        '| x^n | x^(n+1)/(n+1) + C (n != -1) |\n' +
        '| sin x | -cos x + C |\n' +
        '| cos x | sin x + C |\n' +
        '| e^x | e^x + C |\n' +
        '| 1/x | ln(|x|) + C |\n\n' +
        '**Worked integral:** integral from 0 to 2 of (3x² + 2x) dx = [x³ + x²] from 0 to 2 = (8 + 4) - 0 = **12**.\n\n' +
        '**Substitution:** integral of cos(3x) dx -> let u = 3x, du = 3dx -> (1/3) * sin(3x) + C.',
      advancedContent:
        '**Integration by Parts — Swapping a Hard Integral for an Easier One**\n\n' +
        'The idea: if a product of two functions is hard to integrate directly, shift the difficulty from one factor to the other.\n\n' +
        '**Formula:** `integral(u dv) = uv - integral(v du)`\n\n' +
        '**Worked example:** integral of x * e^x dx\n\n' +
        '| Step | Choice / Work |\n' +
        '|------|---------------|\n' +
        '| Pick u and dv | u = x (gets simpler when differentiated), dv = e^x dx |\n' +
        '| Compute du and v | du = dx, v = e^x |\n' +
        '| Apply formula | x*e^x - integral(e^x dx) |\n' +
        '| Evaluate remaining integral | x*e^x - e^x + C |\n' +
        '| Result | **e^x(x - 1) + C** |\n\n' +
        'The trick worked because differentiating u = x made it simpler (just 1), while integrating dv = e^x dx was easy (still e^x). Choose u to be the part that simplifies when differentiated.\n\n' +
        '**Other key techniques:**\n' +
        '- **Partial fractions** — break a complicated rational function like 1/((x-1)(x+2)) into simpler pieces: A/(x-1) + B/(x+2), each easy to integrate\n' +
        '- **Trig substitution** — for integrals with sqrt(a²-x²), substitute x = a*sin(t) to exploit the identity sin²+cos²=1\n\n' +
        '---\n\n' +
        '**The Gaussian Integral — Why It Matters**\n\n' +
        'The integral `integral from -inf to inf of e^(-x²) dx = sqrt(pi)` cannot be computed by any standard technique — there is no elementary antiderivative for e^(-x²).\n\n' +
        '**Why should you care?** This integral is everywhere:\n' +
        '- The **normal distribution** (bell curve) in statistics is built on e^(-x²)\n' +
        '- **Quantum mechanics** — the ground state of the harmonic oscillator is a Gaussian\n' +
        '- **Signal processing** — Gaussian filters are used in image smoothing\n\n' +
        '**The polar coordinates trick (brief sketch):**\n\n' +
        '| Step | Idea |\n' +
        '|------|------|\n' +
        '| 1. Call the integral I | I = integral of e^(-x²) dx from -inf to inf |\n' +
        '| 2. Square it | I² = integral of e^(-x²) dx * integral of e^(-y²) dy |\n' +
        '| 3. Combine into 2D | I² = double integral of e^(-(x²+y²)) dx dy |\n' +
        '| 4. Switch to polar | x²+y² = r², dx dy = r dr dtheta |\n' +
        '| 5. The 2D integral is now easy | integral of r*e^(-r²) dr is solvable by substitution u = r² |\n' +
        '| 6. Result | I² = pi, so I = **sqrt(pi)** |\n\n' +
        'The genius: a 1D integral that is impossible becomes a 2D integral that is easy, because circles have a simpler formula than lines in this context.\n\n' +
        '---\n\n' +
        '**Numerical Integration — When Formulas Fail**\n\n' +
        'Many real-world integrals have no closed-form solution. Numerical methods approximate the answer:\n\n' +
        '| Method | How it works | Accuracy | Best for |\n' +
        '|--------|-------------|----------|----------|\n' +
        '| **Simpson\'s rule** | Fits parabolas through groups of 3 points | Very good for smooth functions | 1D integrals where f is smooth |\n' +
        '| **Gaussian quadrature** | Chooses optimal evaluation points (not equally spaced) | Excellent — can be exact for polynomials | 1D integrals needing high precision |\n' +
        '| **Monte Carlo** | Throws random points and counts how many land under the curve | Accuracy scales as 1/sqrt(N) regardless of dimension | High-dimensional integrals (5D, 100D, ...) |\n\n' +
        'Monte Carlo\'s superpower: in 1D, Simpson\'s rule and Gaussian quadrature are far superior. But in 10 dimensions, traditional methods need an astronomical number of grid points (curse of dimensionality), while Monte Carlo\'s convergence rate stays the same. This is why Monte Carlo dominates in physics simulations, financial modeling, and Bayesian inference.',
      diagram: 'AreaUnderCurveDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import math\n\n# Numerical integration (trapezoidal rule)\ndef f(x):\n    return x**2\n\na, b = 0, 3\nn = 1000\ndx = (b - a) / n\ntotal = 0\nfor i in range(n):\n    x0 = a + i * dx\n    x1 = x0 + dx\n    total += (f(x0) + f(x1)) / 2 * dx\n\nprint(f"Integral of x^2 from {a} to {b}:")\nprint(f"  Numerical: {total:.4f}")\nprint(f"  Exact:     {b**3/3 - a**3/3:.4f}")\n\n# Try changing f(x) to x**3, math.sin(x), etc.', title: 'Try it — Integration' } },
    },
    {
      title: 'The Fundamental Theorem of Calculus',
      beginnerContent:
        '**The most important result in calculus** — it formally links differentiation and integration as inverse operations.\n\n' +
        '**Part 1:** If F(x) = integral from a to x of f(t) dt, then F\'(x) = f(x).\n\n' +
        'In plain language: the rate of change of the accumulated area under a curve equals the height of the curve at that point.\n\n' +
        '**Part 2:** integral from a to b of f(x) dx = F(b) - F(a)\n\n' +
        'where F is any antiderivative of f.\n\n' +
        '**This is the practical power:** evaluate integrals by finding an antiderivative and subtracting endpoint values — no need for Riemann sums.\n\n' +
        '**Example:**\n\n' +
        '| Step | Work |\n' +
        '|------|------|\n' +
        '| integral of x³ from 0 to 10 | Antiderivative: x⁴/4 |\n' +
        '| Evaluate | 10⁴/4 - 0⁴/4 = **2,500** |\n\n' +
        '**Historical note:** Developed independently by Newton ("method of fluxions") and Leibniz (integral notation we still use) in the late 1600s, triggering one of science\'s most bitter priority disputes.\n\n' +
        'The FTC unified two problems studied separately for centuries — finding tangent lines (differentiation) and finding areas (integration) — revealing them as two sides of the same coin.',
      intermediateContent:
        '**FTC in action:**\n\n' +
        '| Problem | Antiderivative | Evaluation | Result |\n' +
        '|---------|---------------|-----------|--------|\n' +
        '| integral of x³ from 1 to 4 | x⁴/4 | 256/4 - 1/4 | **63.75** sq units |\n' +
        '| Distance: v(t) = 3t²+2t, t=0..5 | t³+t² | 125+25 - 0 | **150 metres** |\n\n' +
        'The FTC also gives: `d/dx[integral from 0 to x of sin(t²) dt] = sin(x²)` — differentiation undoes integration.',
      advancedContent:
        '**The Big Idea: Boundaries Tell You About Interiors**\n\n' +
        'In 1D, the FTC says: the integral of f\'(x) over [a, b] equals f(b) - f(a). You integrate a "derivative" over a region and get something evaluated on the **boundary** (just the two endpoints).\n\n' +
        'This principle generalizes beautifully to higher dimensions. In every case, the pattern is the same: **integrating a "derivative-like thing" over a region = evaluating something on the boundary of that region.**\n\n' +
        '| Dimension | Theorem | "Derivative" integrated over... | Equals something on... |\n' +
        '|-----------|---------|-------------------------------|----------------------|\n' +
        '| 1D | **FTC** | f\'(x) over an interval [a, b] | f at the two endpoints a, b |\n' +
        '| 2D | **Green\'s theorem** | A curl-like quantity over a flat region | A line integral around the boundary curve |\n' +
        '| 3D (surfaces) | **Stokes\' theorem** | Curl of a vector field over a surface | A line integral around the edge of the surface |\n' +
        '| 3D (volumes) | **Divergence theorem** | Divergence of a vector field over a solid volume | A flux integral over the enclosing surface |\n\n' +
        'All four are really the **same theorem** at different levels of dimension. Stokes\' theorem in its most general form (using differential forms) unifies them all.\n\n' +
        '---\n\n' +
        '**Gauss\'s Law — Learning About the Inside from the Outside**\n\n' +
        'The divergence theorem has a famous physical application: **Gauss\'s law** in electromagnetism.\n\n' +
        'Imagine a closed surface (like a balloon) surrounding some electric charges. The divergence theorem says:\n\n' +
        '`Total electric flux leaving the surface = Total charge enclosed / epsilon-0`\n\n' +
        'In plain language: **you can figure out how much charge is inside a closed surface by only measuring the electric field on the surface.** You never need to look inside.\n\n' +
        'This is extraordinarily powerful. It means:\n' +
        '- A uniformly charged sphere looks identical (from outside) to a point charge at the center\n' +
        '- The electric field inside a hollow conducting shell is exactly zero, regardless of external charges\n' +
        '- Symmetry arguments that would be impossibly hard with direct calculation become simple one-line derivations\n\n' +
        '---\n\n' +
        '**Why should you care?** These theorems are not abstract curiosities. They form the mathematical backbone of:\n' +
        '- **Fluid dynamics** — how water and air flow\n' +
        '- **Electromagnetism** — Maxwell\'s equations are all divergence/curl theorems\n' +
        '- **General relativity** — Einstein\'s field equations involve the same boundary-interior relationships on curved spacetime\n\n' +
        'The unifying message: **the behavior inside a region is fully encoded in what happens at its boundary.** This is one of the deepest ideas in all of mathematics and physics.',
    },
  ],
};
