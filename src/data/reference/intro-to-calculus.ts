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
        '**Tara stands by the railway tracks watching a train pass.** She wants to know: *how fast is it moving right now?* Not "how far in 1 second" — that\'s an average. The exact speed *at this instant*. To get it, she has to imagine a smaller and smaller time window. 1 second. 0.1 second. 0.01 second. Closer and closer to a single moment. That\'s a **limit** — getting infinitely close without quite arriving.\n\n' +
        '[diagram:MovingTrainCalculusScene]\n\n' +
        '**A weirder limit example.** Look at `f(x) = (x² − 1)/(x − 1)`. At x = 1, you\'d divide by zero — undefined. But as x creeps toward 1 from either side, f(x) marches toward 2. The function never *reaches* that value — but it clearly *wants* to be 2. That "wants to be" is the limit.\n\n' +
        'A limit describes what value a function **approaches** as its input gets closer to a point — even if the function never reaches that value.\n\n' +
        '**The example above:** `f(x) = (x² − 1)/(x − 1)`\n\n' +
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
        'Sliding a slider to see a limit is intuitive — but you can\'t always slide. Every serious use of calculus needs techniques for *computing* limits algebraically when direct substitution gives you the dreaded 0/0 or ∞/∞.\n\n' +
        '**Three techniques that handle almost everything:**\n\n' +
        '| Technique | When to use it | Example | Result |\n' +
        '|-----------|----------------|---------|--------|\n' +
        '| **Factoring** | 0/0 forms with polynomials — the hole cancels | lim(x→4) (x²−16)/(x−4) = lim(x+4) | **8** |\n' +
        '| **L\'Hôpital\'s Rule** | Any 0/0 or ∞/∞ — take derivative of top and bottom | lim(x→0) sin(x)/x = cos(0)/1 | **1** |\n' +
        '| **Divide by highest power** | ∞/∞ in rational functions — compare growth rates | lim(x→∞) (3x²+1)/(5x²−2) | **3/5** |\n\n' +
        'The function from the diagram — (x²−1)/(x−1) — is a factoring case in disguise. Factor the top, cancel, evaluate: `(x+1)(x−1)/(x−1) = x+1`, which equals 2 at x = 1. The hole doesn\'t change the limit because once the common factor cancels, what remains *is* defined there.\n\n' +
        '**One more subtlety: direction matters.** You can approach a point from the left or the right, and the two sides don\'t always agree:\n\n' +
        '- `lim(x→0⁺) 1/x = +∞` — approach from the right (positive side)\n' +
        '- `lim(x→0⁻) 1/x = −∞` — approach from the left (negative side)\n\n' +
        'When the two sides disagree, the two-sided limit simply doesn\'t exist. Calculus is picky about this — and next up you\'ll see why. Getting this rigorously right is what makes the whole edifice stand up.',
      advancedContent:
        '**The intuition is great. But "gets closer" is not a proof.** For 150 years after Newton and Leibniz, mathematicians used limits productively while philosophers and rival mathematicians (Bishop Berkeley famously called them "ghosts of departed quantities") kept asking: *what exactly is an "infinitely small" number?* The whole edifice of calculus rested on a concept no one could define precisely.\n\n' +
        'Cauchy and Weierstrass fixed it in the 1800s with a definition so precise it looks like a game:\n\n' +
        '**The ε-δ definition — a two-player challenge**\n\n' +
        'A skeptic hands you any tolerance they want — call it ε (epsilon), as small as they please. Their challenge: *"prove f(x) can get within ε of L."*\n\n' +
        'You must respond with a δ (delta) — a range around the target point — such that whenever x is within δ of c, f(x) is guaranteed within ε of L. If you can **always win**, no matter how cruelly small the ε, the limit exists.\n\n' +
        'Formally: `lim(x→c) f(x) = L` means: for every ε > 0, there exists δ > 0 such that `0 < |x − c| < δ` implies `|f(x) − L| < ε`.\n\n' +
        'Look at the diagram above. The skeptic says "give me f(x) within 0.01 of 2." You slide x to within 0.01 of 1 — done. They say "within 0.0001 of 2." You slide x to within 0.0001 of 1 — done. Forever. That\'s what makes the limit real: **you can always win.**\n\n' +
        '**Worked proof** that `lim(x→3) 2x + 1 = 7`:\n\n' +
        '| Step | Work |\n' +
        '|------|------|\n' +
        '| We need | \\|(2x+1) − 7\\| < ε whenever \\|x − 3\\| < δ |\n' +
        '| Simplify the left side | \\|2x − 6\\| = 2·\\|x − 3\\| |\n' +
        '| Pick δ so the left side is forced under ε | δ = ε/2 works: 2·\\|x − 3\\| < 2·(ε/2) = ε ✓ |\n\n' +
        'One rule — δ = ε/2 — answers *every possible challenge*. The limit is proven.\n\n' +
        '**Why the rigor matters: it unlocks deep results.**\n\n' +
        'Once limits are rigorously defined, strange-looking claims about continuous functions become provable. Here are two that calculus leans on constantly:\n\n' +
        '**Intermediate Value Theorem.** If f is continuous on [a, b] and k is between f(a) and f(b), then f(c) = k for some c in (a, b). In plain English: **continuous functions cannot teleport.** Drive from 0 to 60 mph — at some instant, you were going exactly 30.\n\n' +
        'This is why we know roots *exist* before we find them. If f(1) = −3 and f(2) = +5, and f is continuous, somewhere between 1 and 2 the function must cross zero. Bisection, Newton\'s method, every root-finding algorithm you\'ve ever used — they all depend on IVT being true.\n\n' +
        '**Squeeze Theorem.** If g(x) ≤ f(x) ≤ h(x) near a point and g and h both converge to L, then f is trapped and must also converge to L. In plain English: **if you\'re pinched between two walls that close to the same point, you end up at that point too.**\n\n' +
        'This tames functions that oscillate badly. Consider `f(x) = x² · sin(1/x)` near x = 0. The `sin(1/x)` factor oscillates infinitely fast and won\'t let us use normal techniques. But sin of anything is between −1 and +1, so `−x² ≤ f(x) ≤ +x²`. Both walls go to 0 as x → 0. The wild middle function has nowhere to go. **Limit is 0** — proven without ever computing the function directly.\n\n' +
        'These aren\'t abstract curiosities. Every derivative formula you\'ll meet next (including the entire chain rule) secretly relies on ε-δ rigor underneath — it\'s the floor the whole building stands on.',
      diagram: 'LimitDiagram',
    },
    {
      title: 'Derivatives — The Slope at a Point',
      beginnerContent:
        'Pick a function in the diagram above and drag the point along the curve. Watch the tangent line pivot — at any moment, its slope tells you how fast the function is rising or falling *right there*, at that exact instant. That instantaneous slope is the derivative.\n\n' +
        'The derivative measures the **instantaneous rate of change** — how fast the output changes relative to the input at one exact moment. If you plot bamboo height over time, the derivative at any point tells you how fast it\'s growing *right then*. Not the average rate over an hour. The rate at one instant.\n\n' +
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
        'Computing every derivative from the limit definition is tedious. Fortunately, a small table of rules covers almost everything you\'ll ever meet:\n\n' +
        '| Function | Derivative | Memory tip |\n' +
        '|----------|-----------|------------|\n' +
        '| xⁿ | n · xⁿ⁻¹ | Power rule — the workhorse |\n' +
        '| sin x | cos x | Cycle: sin → cos → −sin → −cos → sin |\n' +
        '| cos x | −sin x | Same cycle, one step back |\n' +
        '| eˣ | eˣ | The magical self-derivative |\n' +
        '| ln x | 1/x | Derivative of log is the reciprocal |\n' +
        '| tan x | sec²x | Follows from quotient rule on sin/cos |\n\n' +
        '**Where derivatives earn their keep: optimisation.** If `f′(x) = 0` marks peaks and valleys, then finding those zeros finds the best-possible value of whatever f measures — shortest path, maximum area, minimum cost, highest profit.\n\n' +
        '**Classic example:** fit the largest possible rectangle inside a semicircle of radius r.\n\n' +
        '| Step | Work |\n' +
        '|------|------|\n' +
        '| Set up the area as a function of one variable | A(x) = 2x · √(r² − x²) |\n' +
        '| Find the derivative and set it to zero | dA/dx = 0 when x = r/√2 |\n' +
        '| Plug back in | Max area = **r²** (the rectangle is a square tilted into the half-circle) |\n' +
        '| Confirm it\'s a max, not a min | Second derivative test: A″ < 0 ✓ |\n\n' +
        'Every engineering design decision — the shape of a soup can that uses the least metal for a given volume, the launch angle that maximises rocket range, the shutter speed that balances motion blur and noise — comes out of this exact pattern: *write the thing you want as a function, differentiate, set to zero, solve.*\n\n' +
        'And notice something: we just took a derivative of a derivative (the "second derivative test"). That\'s not an accident — it\'s the tip of a much deeper iceberg, as you\'ll see next.',
      advancedContent:
        'The derivative is a rate. That\'s the whole concept. But once you really believe it — once you let that single idea do the work — it unlocks a startling amount.\n\n' +
        '**Layer 1: derivatives stack.** Take the derivative of position and you get velocity. Take the derivative of velocity and you get acceleration. Take the derivative of acceleration and you get *jerk* (yes, real physics term — why poorly-designed elevators make you queasy). Each successive derivative peels back one layer of motion:\n\n' +
        '| Quantity | Symbol | What it measures |\n' +
        '|----------|--------|------------------|\n' +
        '| Position | s(t) | Where you are |\n' +
        '| Velocity | s′(t) | How fast position changes |\n' +
        '| Acceleration | s″(t) | How fast velocity changes |\n' +
        '| Jerk | s‴(t) | How fast acceleration changes |\n\n' +
        'The same "rate" idea, applied recursively, gives you the entire vocabulary of motion. Ballistics, orbits, spring dynamics, every Newtonian physics problem — all of it is tracking one derivative deeper.\n\n' +
        '**Layer 2: rates of one thing drive rates of another.** Derivatives aren\'t just about time. They can chain between *any* two changing quantities via the chain rule. This is the entire domain of **related rates problems**.\n\n' +
        'A balloon inflates at `dV/dt = 100 cm³/s`. How fast does its radius grow when r = 10 cm?\n\n' +
        '| Step | Work |\n' +
        '|------|------|\n' +
        '| Geometric relationship | V = (4/3)π r³ |\n' +
        '| Differentiate both sides w.r.t. time | dV/dt = 4π r² · dr/dt |\n' +
        '| Plug in the knowns | 100 = 4π(100) · dr/dt |\n' +
        '| Solve | **dr/dt ≈ 0.08 cm/s** |\n\n' +
        'The key move is *differentiate w.r.t. time* — not w.r.t. V or r directly. Time is the hidden variable driving both, so differentiating the equation w.r.t. time exposes how their rates relate. This trick powers everything from ladder-sliding-down-a-wall problems to epidemiology models: given dI/dt for infections, what is dR/dt for hospital bed demand?\n\n' +
        '**Layer 3: derivatives determine entire functions.** If derivatives tell you how functions change, maybe they can tell you the whole function. They can — that\'s **Taylor series**.\n\n' +
        'The Taylor series of f at point a is a polynomial built entirely from derivatives of f at that one point:\n\n' +
        '`f(x) = f(a) + f′(a)(x−a) + f″(a)(x−a)²/2! + f‴(a)(x−a)³/3! + ...`\n\n' +
        'Read that term by term. The value, plus a correction using the slope, plus a correction using the curvature, plus a correction using the change-in-curvature... each new derivative adds one more layer of fidelity.\n\n' +
        'Watch it converge for sin(x) at x = 0.5:\n\n' +
        '| Approximation | Value | Error |\n' +
        '|---------------|-------|-------|\n' +
        '| Just x | 0.500000 | 0.0206 |\n' +
        '| x − x³/6 | 0.479167 | 0.0003 |\n' +
        '| x − x³/6 + x⁵/120 | 0.479427 | 0.000001 |\n' +
        '| Exact sin(0.5) | 0.479426 | — |\n\n' +
        'Three terms — value, slope, curvature, change-in-curvature — give you **six decimal places**. This is literally how your phone\'s calculator computes sin, cos, eˣ, ln: it doesn\'t have a sine chip, it has a Taylor expansion.\n\n' +
        '**Where this all lands: AI.** The same rate-of-change machinery — stacked derivatives, chained rates, polynomial approximations — is what runs inside every neural network you\'ve heard of. Training a language model with 100 billion parameters means asking: *how does the loss change when I nudge this parameter?* Derivative. For every parameter. Simultaneously. That\'s **backpropagation** — and it\'s just the chain rule, applied at inhuman scale. The derivative you\'re learning to compute by hand on x² is the same operation that powers GPT.',
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
        'Pick a function in the diagram above and drag the `n` slider. Watch the rectangles fill the space under the curve — few and crude at first, then more and more until they paint the area perfectly. The count on the left (the Riemann sum) closes in on the exact area. **That\'s integration: adding up infinitely many infinitely thin rectangles.**\n\n' +
        'Integration is the **reverse of differentiation**. Where derivatives break a curve into slopes, integrals add up infinitely many thin slices to find the **total area** under the curve.\n\n' +
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
