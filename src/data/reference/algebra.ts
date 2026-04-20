import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'algebra',
  title: 'Algebra',
  category: 'math',
  icon: '📊',
  tagline:
    'The language of patterns — using letters to describe relationships that numbers alone cannot.',
  relatedStories: ['basket-weavers-song', 'postman-hills', 'boy-counted-butterflies'],
  understand: [
    {
      title: 'Variables and Expressions',
      beginnerContent:
        'Drag the slider in the diagram above. Watch three different expressions evaluate in real time as x changes. **One letter, infinitely many calculations** — that\'s the trick variables pull. You stop thinking about one specific number and start thinking about *every possible number at once*.\n\n' +
        '**What is a variable?**\n\n' +
        'A variable is a letter (like `x`, `y`, or `n`) that stands for a number you don\'t know yet. Think of it as an **empty box** waiting to be filled.\n\n' +
        '**What is an expression?**\n\n' +
        'When you write `3x + 2`, you\'re saying:\n\n' +
        '- Take some number\n' +
        '- Multiply it by 3\n' +
        '- Add 2\n\n' +
        'One expression describes **infinitely many** calculations:\n\n' +
        '- If x = 1 → result is **5**\n' +
        '- If x = 10 → result is **32**\n' +
        '- If x = −4 → result is **−10**\n\n' +
        '**Key vocabulary:**\n\n' +
        '- **Coefficient** — the number attached to a variable. In `7y`, the coefficient is 7\n' +
        '- **Term** — a piece of an expression. `4x² − 3x + 9` has **three terms**\n' +
        '- **Like terms** — same variable, same power. `5x` and `−2x` are like terms (combine to `3x`). `5x` and `5x²` are NOT\n\n' +
        '**Try it: Evaluate 3x + 2 when x = 5**\n\n' +
        '1. Replace x with 5: `3(5) + 2`\n' +
        '2. Multiply: `15 + 2`\n' +
        '3. Add: **17** ✓\n\n' +
        'Every formula in science — `distance = speed × time`, `E = mc²` — is an algebraic expression waiting for values.',
      intermediateContent:
        '**Order of operations (PEMDAS/BODMAS):**\n\n' +
        '1. **P**arentheses / **B**rackets\n' +
        '2. **E**xponents / **O**rders\n' +
        '3. **M**ultiplication and **D**ivision (left to right)\n' +
        '4. **A**ddition and **S**ubtraction (left to right)\n\n' +
        '**Worked example:** Evaluate `2(3x − 1)² + 5` when x = 2\n\n' +
        '| Step | Operation | Result |\n' +
        '|------|-----------|--------|\n' +
        '| 1 | Inner parentheses: 3(2) − 1 | 5 |\n' +
        '| 2 | Exponent: 5² | 25 |\n' +
        '| 3 | Multiply: 2 × 25 | 50 |\n' +
        '| 4 | Add: 50 + 5 | **55** |\n\n' +
        '⚠️ **Common mistake:** `2(3x − 1)² ≠ (6x − 2)²` — the exponent applies before the coefficient.',
      advancedContent:
        'A variable starts as a simple idea — a letter standing in for a number. Push it a little further and it becomes the most powerful abstraction in mathematics.\n\n' +
        '**Expressions as objects in their own right.** In beginner, you treated `3x + 2` as *instructions waiting for a value of x*. Once x = 5 came along, the expression evaluated to 17 and was done. But mathematicians realized: why not treat the expression **itself** as a thing? Forget about plugging in values — study the rules for adding, multiplying, and comparing expressions like they were numbers.\n\n' +
        'This shift gives us **polynomials as objects**. The set of all polynomials with, say, real-number coefficients forms a system called a **polynomial ring** (written `ℝ[x]`). You can add two polynomials to get another, multiply them to get another, and the familiar rules of arithmetic still apply. Polynomials become numbers in a bigger number system.\n\n' +
        '**Why care?** Because suddenly powerful statements about "all polynomials" become possible. The most celebrated is the **Fundamental Theorem of Algebra**:\n\n' +
        '> Every non-constant polynomial of degree n has exactly n complex roots (counted with multiplicity).\n\n' +
        'Think about what this claims. Pick *any* polynomial — `x² + 1` which has no real roots, `x⁵ − 7x + 1` with messy irrational roots, anything. The theorem guarantees you\'ll always find exactly n solutions if you\'re willing to include complex numbers. This is not obvious; it took until 1799 (Gauss) to prove properly, and the proof uses tools far beyond algebra.\n\n' +
        '**Even further abstraction — groups, rings, and fields.** Once you have the idea that polynomials form a system with their own "addition" and "multiplication," the natural question is: *what other systems behave the same way?*\n\n' +
        '| System | What it is | Everyday example |\n' +
        '|--------|-----------|------------------|\n' +
        '| **Group** | A set with one operation and an "undo" for every element | Rotations of a square (compose, every one has a reverse) |\n' +
        '| **Ring** | A set with two operations (add + multiply) satisfying the familiar rules, except division may not exist | The integers; polynomials |\n' +
        '| **Field** | A ring where division works (except by 0) | The rationals, the reals, the complex numbers |\n\n' +
        'This move — strip away the specific *values* and study the *rules* — is what modern mathematicians mean by "abstract algebra." The same abstract machinery that describes integer arithmetic describes the symmetries of a molecule, the rotations of a Rubik\'s cube, and the error-correction scheme on your phone.\n\n' +
        '**The payoff:** RSA encryption, QR-code error correction, quantum computing, and much of modern cryptography are built on finite fields — sets of numbers where arithmetic "wraps around." `x + y` where x and y are two-digit binary numbers follows the same algebraic rules you learned with integers, except `1 + 1 = 0`. That single shift turns arithmetic into error-correcting codes. **The variable in `3x + 2` and the variable powering WhatsApp encryption are the same idea, one pushed much further than the other.**',
      diagram: 'ExpressionEvaluatorDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Try evaluating expressions yourself\nx = 5\nprint(f"3x + 2 = {3*x + 2}")\nprint(f"x² - 4 = {x**2 - 4}")\nprint(f"(x + 1)(x - 1) = {(x+1)*(x-1)}")\n\n# Change x and run again!', title: 'Try it — Expressions' } },
    },
    {
      title: 'Solving Linear Equations',
      beginnerContent:
        'Step through the balance scale above. Every time you do something to one side, the diagram forces you to do the same to the other — because that\'s the entire rule of algebra. Break the rule and the equation breaks. Follow the rule and the variable marches toward its answer.\n\n' +
        '**The golden rule:** Whatever you do to one side, you must do to the other.\n\n' +
        'Think of it as a **seesaw** — both sides must stay balanced.\n\n' +
        '**Example: Solve 2x + 3 = 11**\n\n' +
        '| Step | What we do | Left side | Right side |\n' +
        '|------|-----------|-----------|------------|\n' +
        '| Start | | 2x + 3 | 11 |\n' +
        '| 1 | Subtract 3 | 2x | 8 |\n' +
        '| 2 | Divide by 2 | x | **4** |\n' +
        '| Check | Plug back in | 2(4) + 3 = 11 | ✓ |\n\n' +
        '**More complex example: 3(x − 2) + 4 = 2x + 5**\n\n' +
        '1. **Distribute:** 3x − 6 + 4 = 2x + 5\n' +
        '2. **Combine like terms:** 3x − 2 = 2x + 5\n' +
        '3. **Subtract 2x:** x − 2 = 5\n' +
        '4. **Add 2:** x = **7** ✓\n\n' +
        'The strategy is always the same: use **inverse operations** to peel away layers until the variable stands alone.',
      intermediateContent:
        '**Systems of equations** — two equations, two unknowns:\n\n' +
        '`2x + 3y = 12` and `x − y = 1`\n\n' +
        '**Method 1: Substitution**\n\n' +
        '1. From equation 2: `x = y + 1`\n' +
        '2. Substitute: `2(y + 1) + 3y = 12`\n' +
        '3. Solve: `5y = 10` → `y = 2`, then `x = 3`\n\n' +
        '**Method 2: Elimination**\n\n' +
        '1. Multiply equation 2 by 3: `3x − 3y = 3`\n' +
        '2. Add to equation 1: `5x = 15` → `x = 3`\n\n' +
        '**Check:** 2(3) + 3(2) = 12 ✓ and 3 − 2 = 1 ✓',
      advancedContent:
        'A system of m equations in n unknowns → matrix equation **Ax = b**\n\n' +
        '- Solved via **Gaussian elimination** (row echelon form)\n' +
        '- Unique solution when `rank(A) = n`\n' +
        '- Infinite solutions when `rank(A) < n` (consistent)\n' +
        '- No solution when inconsistent\n\n' +
        '**Cramer\'s Rule:** `xᵢ = det(Aᵢ)/det(A)` — elegant but `O(n!)`, impractical for large systems.\n\n' +
        'For millions of equations (engineering simulations), use iterative methods like **Gauss-Seidel**.',
      diagram: 'EquationBalanceScaleDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Solve equations with Python\n# 2x + 3 = 11\nx = (11 - 3) / 2\nprint(f"2x + 3 = 11  →  x = {x}")\n\n# Check: does it work?\nprint(f"Check: 2({x}) + 3 = {2*x + 3}")\n\n# Try solving: 5x - 7 = 18\nx2 = (18 + 7) / 5\nprint(f"\\n5x - 7 = 18  →  x = {x2}")', title: 'Try it — Equations' } },
    },
    {
      title: 'Inequalities',
      beginnerContent:
        'Play with the number line above — change the operator, move the boundary. The shaded region is every number that satisfies your inequality. Notice: unlike an equation, an inequality never has one answer. It has *a range* of answers — sometimes a huge one.\n\n' +
        '**Inequality symbols:**\n\n' +
        '| Symbol | Meaning | Example |\n' +
        '|--------|---------|--------|\n' +
        '| `<` | less than | x < 5 |\n' +
        '| `>` | greater than | x > 3 |\n' +
        '| `≤` | less than or equal | x ≤ 10 |\n' +
        '| `≥` | greater than or equal | x ≥ 0 |\n\n' +
        'Unlike equations (one answer), inequalities have **infinitely many** solutions. `x > 3` is satisfied by 3.1, 4, 100, and every number greater than 3.\n\n' +
        '**Solving:** Same rules as equations, with one exception:\n\n' +
        '⚠️ **Multiply or divide by a negative → FLIP the sign**\n\n' +
        '- Solve `−2x > 6`\n' +
        '- Divide by −2 and flip: `x < −3`\n\n' +
        '**Number line notation:**\n\n' +
        '- **Open circle** ○ = not included (`<` or `>`)\n' +
        '- **Filled circle** ● = included (`≤` or `≥`)\n' +
        '- Arrow shows the direction of solutions',
      intermediateContent:
        '**Compound inequalities** define intervals:\n\n' +
        '- `−2 < x ≤ 5` → interval notation: `(−2, 5]`\n' +
        '- Means: x is between −2 (exclusive) and 5 (inclusive)\n\n' +
        '**Absolute value inequalities** split into two cases:\n\n' +
        '- `|expr| < k` means `−k < expr < k`\n' +
        '- `|expr| > k` means `expr < −k OR expr > k`\n\n' +
        '**Example:** Solve `|2x − 3| > 7`\n\n' +
        '- Case 1: `2x − 3 > 7` → `x > 5`\n' +
        '- Case 2: `2x − 3 < −7` → `x < −2`\n' +
        '- Solution: `(−∞, −2) ∪ (5, ∞)`',
      advancedContent:
        'Equations pin down points. Inequalities pin down *regions*. And once you notice that, a whole kind of real-world problem opens up.\n\n' +
        '**From one variable to many.** A single inequality like `x > 3` carves up the number line. Two inequalities in two variables carve up the 2D plane. For example:\n\n' +
        '- `x + y ≤ 10` (budget constraint: you can\'t spend more than ₹10)\n' +
        '- `x ≥ 0, y ≥ 0` (you can\'t buy negative amounts)\n' +
        '- `2x + y ≤ 14` (shelf space constraint)\n\n' +
        'Each inequality carves the plane with a straight-line boundary. Overlay all of them and you get a **feasible region** — a convex polygon containing every solution that satisfies all constraints simultaneously. Every point inside this polygon represents a valid choice; every point outside violates at least one rule.\n\n' +
        '**The big question: given the region of valid choices, which one is best?** This is **linear programming**, and it\'s one of the most-used mathematical techniques ever invented.\n\n' +
        'George Dantzig in 1947 proved a remarkable fact: **if you\'re maximizing a linear function over a convex polygon, the maximum always occurs at a vertex (corner).** You don\'t need to check the interior or the edges — just the corners. His **Simplex algorithm** walks from vertex to vertex, climbing uphill in the objective function, until it can\'t climb any further. That\'s the optimum.\n\n' +
        'Why this matters:\n\n' +
        '| Industry | What LP optimizes |\n' +
        '|----------|-------------------|\n' +
        '| Airlines | Assign crews to flights subject to rest and licence constraints |\n' +
        '| Oil refineries | Mix crude grades to maximize gasoline yield subject to emissions limits |\n' +
        '| Hospitals | Schedule surgeries subject to OR availability, staff hours, equipment |\n' +
        '| Power grids | Dispatch generators to meet demand at minimum cost |\n\n' +
        'The global economy runs on optimization over inequality-defined regions. Every major company has LP solvers built into its supply chain.\n\n' +
        '**When the constraints aren\'t linear: convex optimization.** Swap the straight-line boundaries for curved ones (while keeping the region *convex* — no dents or holes) and you get a richer class of problems that still have a guaranteed single best answer. This is where modern machine learning lives.\n\n' +
        'The classic example: a **support vector machine** is trained by finding the separating hyperplane that maximizes the margin between two classes of data points — subject to the constraint that no point is on the wrong side. Constraints are inequalities. The objective is quadratic. The solution is unique. Train a spam filter, a medical diagnostic, or a face-detection model and underneath, convex optimization is quietly solving a high-dimensional version of "maximize this subject to those inequalities."\n\n' +
        '**The through-line:** beginner-level inequalities ask *"what values of x work?"* Advanced inequalities ask *"which allowed configuration is best?"* Same grammar, vastly more powerful question.',
      diagram: 'InequalityNumberLineDiagram',
    },
    {
      title: 'The Coordinate Plane',
      beginnerContent:
        'Click anywhere in the plane above to plot a point. Watch its coordinates and the quadrant label update. Every pixel on your screen, every GPS location, every pixel in every photo ever taken — all addressed by this same two-number scheme.\n\n' +
        '**Two perpendicular number lines create a map for numbers:**\n\n' +
        '- **x-axis** — horizontal (left/right)\n' +
        '- **y-axis** — vertical (up/down)\n' +
        '- **Origin** — where they cross: `(0, 0)`\n\n' +
        'Every point is an **ordered pair** `(x, y)`:\n\n' +
        '1. Move x units right (or left if negative)\n' +
        '2. Move y units up (or down if negative)\n\n' +
        '**Four quadrants:**\n\n' +
        '| Quadrant | x | y | Location |\n' +
        '|----------|---|---|----------|\n' +
        '| I | + | + | Upper right |\n' +
        '| II | − | + | Upper left |\n' +
        '| III | − | − | Lower left |\n' +
        '| IV | + | − | Lower right |\n\n' +
        '**Why it matters:** Every pixel on your screen has coordinates. Every map is a coordinate system. Every graph in science plots data on this plane.',
      intermediateContent:
        '**Distance formula** (Pythagorean theorem on coordinates):\n\n' +
        '`d = √[(x₂−x₁)² + (y₂−y₁)²]`\n\n' +
        '**Example:** Distance from (1, 2) to (4, 6):\n\n' +
        '`d = √[(4−1)² + (6−2)²] = √[9 + 16] = √25 = 5 units`\n\n' +
        '**Midpoint formula:**\n\n' +
        '`M = ((x₁+x₂)/2, (y₁+y₂)/2)`\n\n' +
        'Example: M = ((1+4)/2, (2+6)/2) = **(2.5, 4)**\n\n' +
        '**Right triangle test:** If AB² + BC² = AC², the angle at B is 90°.',
      advancedContent:
        'The coordinate plane extends to **n dimensions**:\n\n' +
        '- 3D: `d = √[(x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²]`\n' +
        '- nD: `d = √[Σ(xᵢ − yᵢ)²]` — the Euclidean norm\n\n' +
        'Machine learning operates in **high-dimensional spaces** where each feature is a dimension. A 100×100 image = 10,000 dimensions.\n\n' +
        '**Curse of dimensionality:** In high dimensions, nearly all points are equidistant. 2D/3D intuition breaks down. **PCA** projects high-D data onto meaningful lower-D subspaces.',
      diagram: 'CoordinatePlaneDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import numpy as np\n\n# Distance between two points\np1 = np.array([1, 2])\np2 = np.array([4, 6])\n\ndistance = np.sqrt(np.sum((p2 - p1)**2))\nmidpoint = (p1 + p2) / 2\n\nprint(f"Point 1: {p1}")\nprint(f"Point 2: {p2}")\nprint(f"Distance: {distance}")\nprint(f"Midpoint: {midpoint}")', title: 'Try it — Coordinates' } },
    },
    {
      title: 'Linear Equations and Graphs',
      beginnerContent:
        'Drag the m and b sliders above. Watch the line tilt (m) and slide up/down (b). **Two numbers, every possible straight line.** That\'s the economy of the equation: y = mx + b can describe literally any line in the plane — which is why it shows up in every graph you\'ll ever draw.\n\n' +
        '**Every linear equation graphs as a straight line:**\n\n' +
        '`y = mx + b`\n\n' +
        'Two parameters control the line:\n\n' +
        '- **m (slope)** — how steep. Positive = rises, negative = falls\n' +
        '- **b (y-intercept)** — where the line crosses the y-axis\n\n' +
        '**What is slope?**\n\n' +
        'Slope = **rise ÷ run** = `(y₂ − y₁) / (x₂ − x₁)`\n\n' +
        '- Slope of 2 → go 1 right, go 2 up\n' +
        '- Slope of −1 → go 1 right, go 1 down\n' +
        '- Slope of 0 → flat horizontal line\n\n' +
        '**How to graph y = 3x − 1:**\n\n' +
        '1. Start at the y-intercept: `(0, −1)`\n' +
        '2. Use slope (3): go 1 right, 3 up → `(1, 2)`\n' +
        '3. Draw a straight line through both points\n\n' +
        '**Two lines can:**\n\n' +
        '- **Intersect** at one point (different slopes)\n' +
        '- Be **parallel** (same slope, different b)\n' +
        '- Be the **same line** (same slope AND same b)',
      intermediateContent:
        '**Key relationships:**\n\n' +
        '- **Parallel lines:** equal slopes (`m₁ = m₂`)\n' +
        '- **Perpendicular lines:** slopes multiply to −1 (`m₁ × m₂ = −1`)\n\n' +
        '**Point-slope form:** Given point `(2, 5)` and slope `4`:\n\n' +
        '`y − 5 = 4(x − 2)` → `y = 4x − 3`\n\n' +
        '**x-intercept** (where y = 0): set y = 0 and solve for x.\n\n' +
        'For `y = 4x − 3`: `0 = 4x − 3` → `x = 0.75`',
      advancedContent:
        '`y = mx + b` describes one relationship between two things: x and y. What happens when you have thousands of relationships between thousands of things?\n\n' +
        '**From one line to a system of lines.** In intermediate, you saw systems like:\n\n' +
        '`2x + 3y = 12`\n' +
        '`x − y = 1`\n\n' +
        'Two linear equations, two unknowns — graphically, two lines intersecting at a single point (3, 2). Scale this up: real-world models often have *thousands* of linear relationships among *thousands* of variables. A single Amazon delivery route plans dozens of constraints (truck capacity, driver hours, time windows, fuel economy) across hundreds of delivery points. Every constraint is a linear equation; solving the whole system together is how routes get planned.\n\n' +
        'Once you\'re past three variables, pictures stop helping. So mathematicians did what they always do when problems get big: **invent better notation**. A system of many linear equations becomes a single matrix equation, `Ax = b`. The familiar slope-intercept idea extends: each row of A is one linear relationship; the whole system is solved at once.\n\n' +
        '**And here\'s where it gets beautiful.** Once you package a bunch of linear equations into one matrix, A starts behaving like its own kind of "number":\n\n' +
        '| Property | What it tells you |\n' +
        '|----------|-------------------|\n' +
        '| **Determinant** | Does the system have a unique solution? (Nonzero = yes; zero = lines collapse onto each other) |\n' +
        '| **Inverse** | The "reciprocal" of the matrix — exists when det ≠ 0 — lets you solve for x in one step |\n' +
        '| **Eigenvectors** | Special directions that the matrix *only stretches* without rotating — the "natural axes" of whatever system the matrix describes |\n\n' +
        'That last one is extraordinary. An eigenvector `v` satisfies `Av = λv` — the matrix acts on it like a scalar multiplication. Most matrices have just a few eigenvectors, and those few directions encode almost everything about how the system behaves.\n\n' +
        '**Why should you care? Because eigenvectors show up *everywhere*.**\n\n' +
        '- **Google PageRank** models the web as a giant matrix of links. The dominant eigenvector tells you how "important" each page is. That single calculation ranks 500 billion web pages.\n' +
        '- **Quantum mechanics** describes every state of every particle as an eigenvector of some operator. The measurable outcomes of any experiment are the corresponding eigenvalues.\n' +
        '- **Vibration analysis** finds the "natural frequencies" of a bridge by computing eigenvalues. Miss the wrong frequency from crosswind and you get the Tacoma Narrows collapse.\n' +
        '- **PCA in machine learning** uses eigenvectors to compress high-dimensional data by finding its most important directions of variation.\n\n' +
        'The road from y = mx + b to PageRank is surprisingly short: one line → many lines in a system → matrix equation → eigenvectors → the structure behind half of modern computation. **Linear algebra is what you get when you take y = mx + b seriously.**',
      diagram: 'SlopeExplorerDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import numpy as np\n\n# Explore y = mx + b\nm = 2    # slope\nb = -1   # y-intercept\n\nx_vals = np.array([-3, -2, -1, 0, 1, 2, 3])\ny_vals = m * x_vals + b\n\nprint(f"y = {m}x + {b}")\nprint("  x  |   y")\nprint("-" * 14)\nfor xi, yi in zip(x_vals, y_vals):\n    print(f"  {xi:>2} | {yi:>4}")\n\n# Try changing m and b!', title: 'Try it — Linear Graphs' } },
    },
  ],
};
