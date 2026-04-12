import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'algebra-fundamentals',
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
        'In abstract algebra, variables generalize beyond numbers:\n\n' +
        '- A **polynomial ring** `R[x]` consists of all polynomials with coefficients from R\n' +
        '- The **Fundamental Theorem of Algebra** states every degree-n polynomial has exactly n complex roots\n' +
        '- **Groups, rings, and fields** generalize arithmetic — addition and multiplication become abstract operations satisfying axioms (associativity, commutativity, distributivity)\n\n' +
        'This abstraction powers modern **cryptography**, **coding theory**, and **quantum computing**.',
      diagram: 'ExpressionEvaluatorDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Try evaluating expressions yourself\nx = 5\nprint(f"3x + 2 = {3*x + 2}")\nprint(f"x² - 4 = {x**2 - 4}")\nprint(f"(x + 1)(x - 1) = {(x+1)*(x-1)}")\n\n# Change x and run again!', title: 'Try it — Expressions' } },
    },
    {
      title: 'Solving Linear Equations',
      beginnerContent:
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
        '**Linear programming** optimizes a linear function subject to inequality constraints:\n\n' +
        '- The feasible region is a **convex polygon**\n' +
        '- The **Simplex algorithm** (Dantzig, 1947) proves the optimum occurs at a vertex\n' +
        '- Powers logistics, scheduling, and resource allocation\n\n' +
        '**Convex optimization** (non-linear inequalities) underpins modern ML — support vector machines find the optimal separating hyperplane via quadratic programming.',
      diagram: 'InequalityNumberLineDiagram',
    },
    {
      title: 'The Coordinate Plane',
      beginnerContent:
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
        'Linear equations generalize to **linear algebra:**\n\n' +
        '- n equations in n unknowns → linear transformation from Rⁿ to Rⁿ\n' +
        '- **Determinant** tells if the inverse exists and how areas/volumes scale\n' +
        '- **Eigenvalues/eigenvectors** (solutions to `Ax = λx`) reveal fundamental modes\n\n' +
        'Applications: Google\'s **PageRank**, **quantum mechanics**, vibration analysis, computer graphics.',
      diagram: 'SlopeExplorerDiagram',
      interactive: { type: 'python-playground' as const, props: { starterCode: 'import numpy as np\n\n# Explore y = mx + b\nm = 2    # slope\nb = -1   # y-intercept\n\nx_vals = np.array([-3, -2, -1, 0, 1, 2, 3])\ny_vals = m * x_vals + b\n\nprint(f"y = {m}x + {b}")\nprint("  x  |   y")\nprint("-" * 14)\nfor xi, yi in zip(x_vals, y_vals):\n    print(f"  {xi:>2} | {yi:>4}")\n\n# Try changing m and b!', title: 'Try it — Linear Graphs' } },
    },
  ],
};
