import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BasketWeaverLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The Fibonacci sequence — nature\'s favorite number',
      concept: `The **Fibonacci sequence** starts with 1, 1, and each subsequent number is the sum of the two before it:

1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...

This sequence appears in nature with stunning regularity:
- **Sunflower spirals**: 34 clockwise, 55 counterclockwise (both Fibonacci numbers)
- **Pine cone scales**: 8 and 13 spirals
- **Pineapple hexagons**: 8, 13, and 21 spirals
- **Flower petals**: lilies have 3, buttercups 5, daisies 34 or 55

Why? Because Fibonacci spirals are the most efficient way to pack elements around a central point. Each new seed (or scale, or petal) is placed at the **golden angle** (~137.5°) from the previous one, which prevents alignment and maximizes space usage.`,
      analogy: 'The Fibonacci sequence is like a rabbit population (which is actually how Fibonacci originally described it in 1202). Each pair of rabbits produces a new pair after one month. The monthly population follows: 1, 1, 2, 3, 5, 8... The math is simple. The consequences are everywhere.',
      storyConnection: 'Traditional basket patterns often incorporate Fibonacci-like proportions without the weaver knowing the math. The intervals between motifs, the ratio of border to field, the progression of color bands — many follow Fibonacci ratios because they naturally look "right" to the human eye.',
      checkQuestion: 'The ratio of consecutive Fibonacci numbers (e.g., 8/5, 13/8, 21/13) approaches a specific constant. What is it, and why does it matter?',
      checkAnswer: 'It approaches the golden ratio, φ (phi) ≈ 1.618033... This number has the unique property that φ = 1 + 1/φ. It appears in art, architecture, and nature because it represents the most "irrational" number — the hardest to approximate by simple fractions — which makes it optimal for avoiding periodic alignments.',
      codeIntro: 'Generate the Fibonacci sequence and visualize its connection to the golden spiral.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate Fibonacci numbers
fib = [1, 1]
for i in range(18):
    fib.append(fib[-1] + fib[-2])

# Ratios approaching golden ratio
ratios = [fib[i+1]/fib[i] for i in range(len(fib)-1)]
phi = (1 + np.sqrt(5)) / 2

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Fibonacci spiral using golden rectangles
ax1.set_facecolor('#111827')
x, y = 0, 0
directions = [(1, 0), (0, 1), (-1, 0), (0, -1)]  # right, up, left, down

for i in range(10):
    size = fib[i]
    dx, dy = directions[i % 4]
    # Draw rectangle
    rect_x = x if dx >= 0 else x - size
    rect_y = y if dy >= 0 else y - size
    if i % 4 == 0: rect_x, rect_y = x, y
    elif i % 4 == 1: rect_x, rect_y = x - fib[i-1], y
    elif i % 4 == 2: rect_x, rect_y = x - size, y - fib[i-1]
    elif i % 4 == 3: rect_x, rect_y = x, y - size

    colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
    rect = plt.Rectangle((rect_x, rect_y), size if i % 4 in [0, 2] else fib[i-1] if i > 0 else size,
                          fib[i-1] if i > 0 and i % 4 in [0, 2] else size,
                          facecolor=colors[i % 4], alpha=0.2, edgecolor=colors[i % 4], linewidth=1)
    ax1.add_patch(rect)

    # Update position
    if i % 4 == 0: x += size
    elif i % 4 == 1: y += size
    elif i % 4 == 2: x -= size
    elif i % 4 == 3: y -= size

# Draw golden spiral
theta = np.linspace(0, 4*np.pi, 500)
r = phi ** (theta * 2 / np.pi)
spiral_x = r * np.cos(theta) * 0.3
spiral_y = r * np.sin(theta) * 0.3
ax1.plot(spiral_x, spiral_y, color='#ef4444', linewidth=2)
ax1.set_title('Fibonacci Golden Rectangles & Spiral', color='white', fontsize=11)
ax1.set_aspect('equal')
ax1.tick_params(colors='gray')

# Ratio convergence to phi
ax2.set_facecolor('#111827')
ax2.plot(range(1, len(ratios)+1), ratios, 'o-', color='#22c55e', linewidth=2, markersize=5)
ax2.axhline(phi, color='#f59e0b', linestyle='--', linewidth=1.5, label=f'φ = {phi:.6f}')
ax2.set_xlabel('n', color='white')
ax2.set_ylabel('F(n+1) / F(n)', color='white')
ax2.set_title('Ratio Convergence to Golden Ratio', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fibonacci sequence: ", fib[:15])
print(f"\\nGolden ratio φ = (1 + √5) / 2 = {phi:.10f}")
print(f"\\nRatio convergence:")
for i in range(8):
    print(f"  F({i+2})/F({i+1}) = {fib[i+1]}/{fib[i]} = {fib[i+1]/fib[i]:.6f}")`,
      challenge: 'Generate a Fibonacci sunflower: plot 500 points where each point is at angle n × 137.5° and radius √n. Why do Fibonacci spirals appear?',
      successHint: 'The Fibonacci sequence is where discrete mathematics meets continuous nature. It appears in growth patterns because it optimizes packing efficiency — the same principle the basket weaver uses when spacing her threads.',
    },
    {
      title: 'The golden ratio — the most irrational number',
      concept: `The **golden ratio** φ = (1 + √5)/2 ≈ 1.618033988749... has fascinated mathematicians for over 2,000 years. It has unique algebraic properties:

- φ² = φ + 1 (the only positive number where this is true)
- 1/φ = φ - 1 (its reciprocal is itself minus 1)
- φ = 1 + 1/(1 + 1/(1 + 1/(1 + ...))) (infinite continued fraction of all 1s)

Why does φ appear in nature? Because it's the **most irrational** number — the hardest to approximate by fractions. In phyllotaxis (leaf arrangement), each new leaf grows at the golden angle (360°/φ² ≈ 137.5°) from the previous one. This angle ensures that no two leaves ever line up exactly, maximizing sunlight exposure.

If the angle were rational (like 120° = 1/3 of a turn), leaves would stack directly above each other. The golden angle spreads them as evenly as possible.`,
      analogy: 'The golden ratio is like a perfect shuffle of a deck of cards. A rational number (like 1/3) would put cards in predictable, repeating positions. The golden ratio is like a shuffle that never repeats, distributing cards as evenly as possible across all positions. Nature uses φ for the same reason casinos shuffle decks — to avoid patterns.',
      storyConnection: 'The basket weaver\'s most harmonious patterns intuitively approach golden ratio proportions. When the border is about 1/φ of the total width, or when color bands alternate in roughly Fibonacci-length intervals, the result looks balanced — not because of magic, but because φ optimizes visual distribution.',
      checkQuestion: 'The golden ratio appears in the regular pentagon — the ratio of diagonal to side is φ. Why is this geometrically significant?',
      checkAnswer: 'It means the pentagon is self-similar in a specific way: the diagonal of a pentagon creates a smaller pentagon inside, whose diagonal creates an even smaller one, recursively. This self-similar structure is what connects φ to fractals. The pentagram (five-pointed star inside a pentagon) contains φ in every ratio of its line segments.',
      codeIntro: 'Explore the golden ratio\'s unique properties and its appearance in geometry.',
      code: `import numpy as np
import matplotlib.pyplot as plt

phi = (1 + np.sqrt(5)) / 2

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Golden rectangle subdivision
ax = axes[0, 0]
ax.set_facecolor('#111827')
x, y, w, h = 0, 0, phi, 1
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#ec4899']
for i in range(8):
    if w > h:  # split vertically
        square_size = h
        rect = plt.Rectangle((x, y), square_size, square_size,
                              facecolor=colors[i % 6], alpha=0.3, edgecolor='white', linewidth=1)
        ax.add_patch(rect)
        x += square_size
        w -= square_size
    else:  # split horizontally
        square_size = w
        rect = plt.Rectangle((x, y), square_size, square_size,
                              facecolor=colors[i % 6], alpha=0.3, edgecolor='white', linewidth=1)
        ax.add_patch(rect)
        y += square_size
        h -= square_size
ax.set_xlim(-0.05, phi + 0.05)
ax.set_ylim(-0.05, 1.05)
ax.set_title('Golden Rectangle Subdivision', color='white', fontsize=10)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# 2. Continued fraction convergence
ax = axes[0, 1]
ax.set_facecolor('#111827')
# Compute convergents of φ's continued fraction [1; 1, 1, 1, ...]
p = [1, 2]
q = [1, 1]
for i in range(15):
    p.append(p[-1] + p[-2])
    q.append(q[-1] + q[-2])
convergents = [p[i]/q[i] for i in range(len(p))]
ax.plot(range(len(convergents)), convergents, 'o-', color='#22c55e', linewidth=2, markersize=5)
ax.axhline(phi, color='#f59e0b', linestyle='--', label=f'φ = {phi:.6f}')
ax.set_xlabel('Convergent index', color='white')
ax.set_ylabel('Value', color='white')
ax.set_title('Continued Fraction Convergents', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Phyllotaxis — golden angle packing
ax = axes[1, 0]
ax.set_facecolor('#111827')
golden_angle = 2 * np.pi / phi**2
n_points = 300
for i in range(n_points):
    r = np.sqrt(i)
    theta = i * golden_angle
    size = 15 + 10 * (1 - i/n_points)
    color_val = i / n_points
    ax.scatter(r * np.cos(theta), r * np.sin(theta), s=size,
               c=plt.cm.viridis(color_val), alpha=0.8)
ax.set_title('Phyllotaxis (golden angle)', color='white', fontsize=10)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# 4. Compare rational vs golden angle
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_pts = 100
# Rational angle (1/6 turn = 60°)
for i in range(n_pts):
    r = np.sqrt(i)
    theta = i * 2 * np.pi / 6
    ax.scatter(r * np.cos(theta) - 12, r * np.sin(theta),
               s=10, c='#ef4444', alpha=0.5)
# Golden angle
for i in range(n_pts):
    r = np.sqrt(i)
    theta = i * golden_angle
    ax.scatter(r * np.cos(theta) + 12, r * np.sin(theta),
               s=10, c='#22c55e', alpha=0.5)
ax.text(-12, -12, 'Rational (60°)\\nSpokes form!', ha='center', color='#ef4444', fontsize=9)
ax.text(12, -12, 'Golden (137.5°)\\nNo spokes!', ha='center', color='#22c55e', fontsize=9)
ax.set_title('Rational vs Golden Angle Packing', color='white', fontsize=10)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Golden ratio properties:")
print(f"  φ = {phi:.10f}")
print(f"  φ² = {phi**2:.10f} = φ + 1 = {phi + 1:.10f} ✓")
print(f"  1/φ = {1/phi:.10f} = φ - 1 = {phi - 1:.10f} ✓")
print(f"  Golden angle = 360°/φ² = {360/phi**2:.4f}°")`,
      challenge: 'Try different angles for phyllotaxis: 90°, 120°, 137.3°, 137.5° (golden), and 137.7°. Only the golden angle avoids visible spokes. Why?',
      successHint: 'The golden ratio sits at the intersection of number theory, geometry, and biology. It appears in nature not because of mysticism, but because of a deep mathematical fact: φ is the hardest number to approximate rationally, making it the optimal angle for packing.',
    },
    {
      title: 'Group theory of symmetry — the algebra of transformations',
      concept: `In Level 1, we described symmetry visually. In mathematics, symmetries form **groups** — algebraic structures with precise rules.

A **symmetry group** is the set of all transformations that leave a shape unchanged, together with a composition operation. For example, the symmetries of a square form the **dihedral group D₄** with 8 elements:
- Identity (do nothing)
- 3 rotations (90°, 180°, 270°)
- 4 reflections (horizontal, vertical, 2 diagonals)

Group axioms:
1. **Closure**: combining two symmetries gives another symmetry
2. **Associativity**: (a∘b)∘c = a∘(b∘c)
3. **Identity**: there's a "do nothing" transformation
4. **Inverse**: every transformation can be undone

The **wallpaper groups** classify ALL possible repeating 2D patterns. There are exactly **17** — no more, no less. Every tiled floor, every woven fabric, every wallpaper pattern belongs to one of these 17 groups.`,
      analogy: 'Group theory is like understanding a language by studying its grammar. Individual symmetries are words. The group axioms are grammar rules. Just as English grammar constrains what sentences are possible, group theory constrains what symmetry patterns are possible. The fact that there are exactly 17 wallpaper groups is like discovering that a language has exactly 17 sentence structures.',
      storyConnection: 'Every traditional weaving pattern belongs to one of the 17 wallpaper groups. The basket weaver, without knowing group theory, was constrained by the same mathematical rules. Her loom could only produce patterns with translational symmetry — and the specific symmetries of her motifs determined which of the 17 groups her pattern fell into.',
      checkQuestion: 'The symmetry group of an equilateral triangle has 6 elements (3 rotations + 3 reflections). The symmetry group of a square has 8. How many elements does the symmetry group of a regular pentagon have?',
      checkAnswer: '10 elements (5 rotations + 5 reflections). The pattern: a regular n-gon has 2n symmetries — n rotations and n reflections. This is the dihedral group Dₙ. A circle has infinitely many symmetries — it can be rotated by any angle.',
      codeIntro: 'Visualize the symmetry group of a square and the composition table.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Symmetries of a square
ax1.set_facecolor('#111827')

def transform_square(corners, name):
    """Apply named transformation to square corners."""
    if name == 'e': return corners  # identity
    if name == 'r90': return np.array([[-c[1], c[0]] for c in corners])  # 90° rotation
    if name == 'r180': return -corners
    if name == 'r270': return np.array([[c[1], -c[0]] for c in corners])
    if name == 'mh': return corners * [1, -1]  # horizontal reflection
    if name == 'mv': return corners * [-1, 1]  # vertical reflection
    if name == 'md1': return np.array([[c[1], c[0]] for c in corners])  # diagonal reflection
    if name == 'md2': return np.array([[-c[1], -c[0]] for c in corners])  # anti-diagonal
    return corners

base = np.array([[1, 1], [-1, 1], [-1, -1], [1, -1]], dtype=float)
labels_list = ['1', '2', '3', '4']
transforms = ['e', 'r90', 'r180', 'r270', 'mh', 'mv', 'md1', 'md2']
names = ['Identity', 'Rot 90°', 'Rot 180°', 'Rot 270°',
         'Reflect H', 'Reflect V', 'Reflect D1', 'Reflect D2']

colors_sq = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7',
             '#ef4444', '#ec4899', '#06b6d4', '#84cc16']

for idx, (t, name, color) in enumerate(zip(transforms, names, colors_sq)):
    corners = transform_square(base, t)
    row, col = idx // 4, idx % 4
    offset = np.array([col * 3.5, -row * 3.5])
    sq = corners + offset
    poly = plt.Polygon(sq, facecolor=color, alpha=0.2, edgecolor=color, linewidth=1.5)
    ax1.add_patch(poly)
    for i, (cx, cy) in enumerate(sq):
        ax1.text(cx, cy, labels_list[i], ha='center', va='center', color='white', fontsize=8, fontweight='bold')
    ax1.text(offset[0], offset[1], name, ha='center', va='center', color=color, fontsize=7)

ax1.set_xlim(-2, 12)
ax1.set_ylim(-5.5, 2.5)
ax1.set_title('8 Symmetries of a Square (D₄)', color='white', fontsize=12)
ax1.set_aspect('equal')
ax1.axis('off')

# Cayley table (multiplication table of D4)
ax2.set_facecolor('#111827')
# Simplified: just show the structure
short_names = ['e', 'r', 'r²', 'r³', 'h', 'v', 'd', "d'"]
table_data = np.array([
    [0,1,2,3,4,5,6,7],
    [1,2,3,0,6,7,5,4],
    [2,3,0,1,5,4,7,6],
    [3,0,1,2,7,6,4,5],
    [4,7,5,6,0,2,3,1],
    [5,6,4,7,2,0,1,3],
    [6,4,7,5,1,3,0,2],
    [7,5,6,4,3,1,2,0],
])

im = ax2.imshow(table_data, cmap='Set3', aspect='equal')
for i in range(8):
    for j in range(8):
        ax2.text(j, i, short_names[table_data[i,j]], ha='center', va='center',
                 color='black', fontsize=9, fontweight='bold')
ax2.set_xticks(range(8))
ax2.set_yticks(range(8))
ax2.set_xticklabels(short_names, color='white', fontsize=9)
ax2.set_yticklabels(short_names, color='white', fontsize=9)
ax2.set_xlabel('Second operation', color='white')
ax2.set_ylabel('First operation', color='white')
ax2.set_title('Cayley Table (Group Multiplication)', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Dihedral group D₄ (symmetries of a square):")
print(f"  Order: 8 elements")
print(f"  Generators: one rotation (r) + one reflection (h)")
print(f"  All 8 elements can be built from r and h:")
print(f"    e, r, r², r³, h, rh, r²h, r³h")
print()
print("Key property: group is NON-ABELIAN (order matters!)")
print(f"  r ∘ h ≠ h ∘ r (rotation then reflection ≠ reflection then rotation)")`,
      challenge: 'Build the Cayley table for the symmetry group of an equilateral triangle (D₃, 6 elements). Is this group also non-abelian?',
      successHint: 'Group theory transforms symmetry from visual intuition to precise algebra. It\'s the language of modern physics (particle physics uses symmetry groups extensively) and the mathematical foundation for understanding all repeating patterns.',
    },
    {
      title: 'Algorithmic pattern generation — code as loom',
      concept: `Computers can generate patterns that would take a human weaver lifetimes to create. **Algorithmic pattern generation** uses mathematical rules to produce visual designs:

- **Cellular automata**: simple rules applied to a grid produce complex patterns (Rule 30, Rule 110)
- **Reaction-diffusion**: simulating chemical reactions produces animal-like patterns (spots, stripes)
- **Voronoi diagrams**: dividing space by nearest points creates natural-looking cell patterns
- **Wave function collapse**: a constraint-satisfaction algorithm that generates tile-based patterns

Stephen Wolfram's **Rule 30** is a famous 1D cellular automaton:
- Each cell is 0 or 1
- Next generation: each cell looks at itself and its two neighbors (3 cells = 8 possible combinations)
- Rule 30 assigns: 000→0, 001→1, 010→1, 011→1, 100→1, 101→0, 110→0, 111→0

From this trivially simple rule emerges a pattern so complex it's been used for random number generation.`,
      analogy: 'Algorithmic pattern generation is like DNA for design. A tiny set of rules (the "genome") generates an entire complex pattern (the "organism"). Just as a small genome can produce a complex organism, a short algorithm can produce intricate visual designs. The code IS the loom.',
      storyConnection: 'The basket weaver follows rules: "over two, under one, shift right." These rules ARE an algorithm. A computer executing the same rules can generate the same pattern — and then explore variations the weaver never imagined. Algorithmic generation is traditional weaving accelerated to millions of patterns per second.',
      checkQuestion: 'Rule 30 is a deterministic rule — given the same initial state, it always produces the same pattern. Yet its output appears random. How can deterministic rules produce apparent randomness?',
      checkAnswer: 'It\'s called "deterministic chaos." The system is so sensitive to initial conditions that tiny differences in starting state produce vastly different outputs. The pattern doesn\'t repeat (it\'s not periodic), and no short formula can predict the nth row without computing all previous rows. Determinism doesn\'t imply predictability.',
      codeIntro: 'Generate patterns using cellular automata Rule 30 and Rule 110.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def cellular_automaton(rule_number, width=201, steps=100):
    rule = np.array([int(b) for b in format(rule_number, '08b')][::-1])
    grid = np.zeros((steps, width), dtype=int)
    grid[0, width // 2] = 1  # single cell in center

    for t in range(1, steps):
        for i in range(1, width - 1):
            neighborhood = grid[t-1, i-1] * 4 + grid[t-1, i] * 2 + grid[t-1, i+1]
            grid[t, i] = rule[neighborhood]
    return grid

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

rules = [30, 110, 90, 184]
titles = ['Rule 30 (Chaos)', 'Rule 110 (Turing complete)', 'Rule 90 (Sierpinski)', 'Rule 184 (Traffic)']
cmaps = ['YlGn', 'Blues', 'Purples', 'Oranges']

for ax, rule_num, title, cmap in zip(axes.flat, rules, titles, cmaps):
    ax.set_facecolor('#111827')
    grid = cellular_automaton(rule_num)
    ax.imshow(grid, cmap=cmap, aspect='auto', interpolation='nearest')
    ax.set_title(title, color='white', fontsize=11)
    ax.set_xlabel('Cell position', color='white', fontsize=9)
    ax.set_ylabel('Time step', color='white', fontsize=9)
    ax.tick_params(colors='gray', labelsize=7)

plt.suptitle('1D Cellular Automata — Simple Rules, Complex Patterns', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Cellular automata rules:")
for rule_num in rules:
    rule_bin = format(rule_num, '08b')
    print(f"  Rule {rule_num}: {rule_bin}")
print()
print("Rule 30: appears random, used for Mathematica's random number generator")
print("Rule 110: proven to be Turing complete (can compute anything!)")
print("Rule 90: produces Sierpinski triangle (fractal)")
print("Rule 184: models traffic flow (cars moving right)")`,
      challenge: 'Try Rule 45, Rule 73, and Rule 150. Which produces the most visually interesting pattern? Can you find a rule that produces a pattern resembling a traditional weave?',
      successHint: 'Cellular automata prove that complexity doesn\'t require complex rules — it emerges from simple rules applied repeatedly. This is the deepest connection between weaving and computation: both transform simple repetition into complex structure.',
    },
    {
      title: 'L-systems — growing patterns with grammar',
      concept: `**L-systems** (Lindenmayer systems) generate fractal-like patterns using string rewriting rules — a formal grammar. Invented in 1968 by botanist Aristid Lindenmayer to model plant growth.

An L-system has:
- **Alphabet**: symbols (e.g., F, +, -)
- **Axiom**: starting string (e.g., "F")
- **Rules**: replacement rules (e.g., F → F+F-F-F+F)

Interpretation for drawing (turtle graphics):
- F: move forward and draw
- +: turn left by angle
- -: turn right by angle
- [: save position (push)
- ]: restore position (pop)

Example — Koch curve: Axiom: F, Rule: F→F+F-F-F+F, Angle: 90°
After 1 iteration: F+F-F-F+F
After 2 iterations: F+F-F-F+F + F+F-F-F+F - F+F-F-F+F - F+F-F-F+F + F+F-F-F+F

Each iteration makes the string ~4× longer, and the resulting drawing increasingly complex.`,
      analogy: 'L-systems are like a recipe that references itself. "To make a tree: make a trunk, then make two smaller trees at the top." Each "smaller tree" follows the same recipe, creating branches of branches of branches. L-systems formalize this self-referential growth into precise grammar rules.',
      storyConnection: 'The basket weaver\'s pattern-building process is remarkably like an L-system: start with a simple motif (axiom), apply a transformation rule (repeat the motif with variation), and iterate (each row builds on the previous). L-systems reveal the mathematical structure hidden in traditional pattern-making.',
      checkQuestion: 'An L-system with rule F→FF doubles the string length at each iteration. After 10 iterations starting from "F", how long is the string?',
      checkAnswer: '2¹⁰ = 1,024 characters. After 20 iterations: 1,048,576. After 30: over 1 billion. L-systems grow exponentially — which is why they\'re perfect for modeling plant growth (also exponential). But it also means you need to be careful about computational limits.',
      codeIntro: 'Generate L-system fractals: Koch curve, dragon curve, and a plant.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def l_system(axiom, rules, iterations):
    current = axiom
    for _ in range(iterations):
        next_str = ''
        for ch in current:
            next_str += rules.get(ch, ch)
        current = next_str
    return current

def draw_l_system(commands, angle_deg, step=1):
    x, y, heading = 0, 0, 90
    positions = [(x, y)]
    stack = []
    angle = np.radians(angle_deg)

    for cmd in commands:
        if cmd == 'F' or cmd == 'G':
            x += step * np.cos(np.radians(heading))
            y += step * np.sin(np.radians(heading))
            positions.append((x, y))
        elif cmd == '+':
            heading += angle_deg
        elif cmd == '-':
            heading -= angle_deg
        elif cmd == '[':
            stack.append((x, y, heading))
        elif cmd == ']':
            if stack:
                x, y, heading = stack.pop()
                positions.append((None, None))  # break
                positions.append((x, y))
    return positions

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# 1. Koch curve
ax = axes[0]
ax.set_facecolor('#111827')
koch = l_system('F', {'F': 'F+F-F-F+F'}, 4)
pts = draw_l_system(koch, 90, step=1)
xs = [p[0] for p in pts if p[0] is not None]
ys = [p[1] for p in pts if p[1] is not None]
ax.plot(xs, ys, color='#22c55e', linewidth=0.5)
ax.set_title('Koch Curve (4 iterations)', color='white', fontsize=10)
ax.set_aspect('equal')
ax.axis('off')

# 2. Dragon curve
ax = axes[1]
ax.set_facecolor('#111827')
dragon = l_system('F', {'F': 'F+G', 'G': 'F-G'}, 12)
pts = draw_l_system(dragon, 90, step=1)
xs = [p[0] for p in pts if p[0] is not None]
ys = [p[1] for p in pts if p[1] is not None]
ax.plot(xs, ys, color='#3b82f6', linewidth=0.3)
ax.set_title('Dragon Curve (12 iterations)', color='white', fontsize=10)
ax.set_aspect('equal')
ax.axis('off')

# 3. Plant
ax = axes[2]
ax.set_facecolor('#111827')
plant = l_system('F', {'F': 'FF+[+F-F-F]-[-F+F+F]'}, 3)
pts = draw_l_system(plant, 22.5, step=2)

# Draw with breaks
segment_x, segment_y = [], []
for p in pts:
    if p[0] is None:
        if segment_x:
            ax.plot(segment_x, segment_y, color='#22c55e', linewidth=0.5)
        segment_x, segment_y = [], []
    else:
        segment_x.append(p[0])
        segment_y.append(p[1])
if segment_x:
    ax.plot(segment_x, segment_y, color='#22c55e', linewidth=0.5)

ax.set_title('L-system Plant (3 iterations)', color='white', fontsize=10)
ax.set_aspect('equal')
ax.axis('off')

plt.suptitle('L-systems: Grammar-Generated Fractals', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("L-system specifications:")
print("  Koch: F→F+F-F-F+F, angle=90°")
print("  Dragon: F→F+G, G→F-G, angle=90°")
print("  Plant: F→FF+[+F-F-F]-[-F+F+F], angle=22.5°")
print()
print(f"Koch curve after 4 iterations: {len(koch)} characters")
print(f"Dragon curve after 12 iterations: {len(dragon)} characters")
print(f"Plant after 3 iterations: {len(plant)} characters")`,
      challenge: 'Create a Sierpinski triangle L-system: Axiom="F-G-G", Rules: F→F-G+F+G-F, G→GG, Angle=120°. How many iterations before it looks like the fractal from Level 1?',
      successHint: 'L-systems unify botany, computer graphics, and formal language theory. The same grammar framework that describes plant growth also generates the fractals, curves, and patterns that computer graphics engines use today.',
    },
    {
      title: 'Generative art with code — the computer as weaver',
      concept: `**Generative art** uses algorithms to create visual art — the artist writes the rules, and the computer executes them (often with randomness). Key techniques:

- **Perlin noise**: smooth random gradients that create organic-looking terrain, clouds, and textures
- **Flow fields**: vector fields that guide particles along curved paths
- **Recursive subdivision**: repeatedly dividing shapes creates fractal-like compositions
- **Stochastic processes**: controlled randomness creates natural variation

The philosophy: the artist designs the **system**, not the final image. Each run produces a unique variation — like a weaver following the same pattern but with slightly different thread tension each time.

Notable generative artists:
- **Vera Molnár** (pioneer, 1968): geometric variations
- **Tyler Hobbs** (Fidenza, 2021): flow field NFTs
- **Casey Reas** (Processing co-creator): organic simulations`,
      analogy: 'Generative art is like composing music rather than playing a recording. The composer sets the rules (key, tempo, chord progression), but each performance is unique. The code is the score; the output is the performance. Traditional weaving is also generative — the pattern rules are the score, each basket is a unique performance.',
      storyConnection: 'The basket weaver is the original generative artist: she follows a pattern (algorithm) but introduces human variation (randomness). No two baskets are identical, yet all follow the same rules. Generative art formalizes this creative process in code, producing infinite variations of a single design concept.',
      checkQuestion: 'Can a computer create "real" art, or is generative art just math pretending to be art?',
      checkAnswer: 'The creativity is in the algorithm design — choosing rules that produce aesthetically compelling results. The artist\'s skill shifts from manual execution to system design. A weaver who designs a pattern is an artist even if a loom executes it. A programmer who designs an algorithm is an artist even if a CPU executes it. The medium changes; the creative act doesn\'t.',
      codeIntro: 'Create generative art: a flow field and a stochastic weave pattern.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# 1. Flow field art
ax1.set_facecolor('#111827')

# Create a vector field using sine waves
resolution = 20
x_grid = np.linspace(0, 4*np.pi, resolution)
y_grid = np.linspace(0, 4*np.pi, resolution)
X, Y = np.meshgrid(x_grid, y_grid)
U = np.sin(Y * 0.5) * np.cos(X * 0.3)
V = np.cos(X * 0.5) * np.sin(Y * 0.3)

# Trace particles through the field
colors_flow = plt.cm.plasma(np.linspace(0.1, 0.9, 80))
for i in range(80):
    px = np.random.uniform(0, 4*np.pi)
    py = np.random.uniform(0, 4*np.pi)
    path_x, path_y = [px], [py]

    for _ in range(150):
        # Interpolate field at current position
        ix = int(np.clip(px / (4*np.pi) * (resolution-1), 0, resolution-2))
        iy = int(np.clip(py / (4*np.pi) * (resolution-1), 0, resolution-2))
        dx = U[iy, ix] * 0.08
        dy = V[iy, ix] * 0.08
        px += dx + np.random.normal(0, 0.01)
        py += dy + np.random.normal(0, 0.01)
        if 0 <= px <= 4*np.pi and 0 <= py <= 4*np.pi:
            path_x.append(px)
            path_y.append(py)
        else:
            break

    ax1.plot(path_x, path_y, color=colors_flow[i], linewidth=0.5, alpha=0.7)

ax1.set_xlim(0, 4*np.pi)
ax1.set_ylim(0, 4*np.pi)
ax1.set_title('Flow Field Art', color='white', fontsize=12)
ax1.axis('off')

# 2. Generative weave pattern
ax2.set_facecolor('#111827')

rows, cols = 40, 40
weave = np.zeros((rows, cols, 3))

palette = np.array([
    [0.13, 0.78, 0.37],  # green
    [0.23, 0.51, 0.96],  # blue
    [0.96, 0.62, 0.04],  # amber
    [0.66, 0.33, 0.97],  # purple
    [0.93, 0.24, 0.24],  # red
])

# Generate pattern with controlled randomness
base_pattern = np.zeros((rows, cols), dtype=int)
for i in range(rows):
    for j in range(cols):
        # Rule: mostly follow a twill-like pattern, but occasionally deviate
        base = (i + j) % len(palette)
        if np.random.rand() < 0.15:  # 15% chance of random variation
            base = np.random.randint(len(palette))
        base_pattern[i, j] = base
        weave[i, j] = palette[base]

ax2.imshow(weave, aspect='equal', interpolation='nearest')
ax2.set_title('Generative Weave Pattern', color='white', fontsize=12)
ax2.axis('off')

plt.suptitle('Generative Art — The Computer as Weaver', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Generative art parameters:")
print("  Flow field: sine-based vector field, 80 particles, 150 steps")
print("  Weave: 5-color palette, twill base, 15% random deviation")
print()
print("Each run with a different random seed produces a unique artwork.")
print("The artist controls the system; the computer explores the space.")
print()
print("Try changing np.random.seed(42) to any other number for a new variation.")`,
      challenge: 'Modify the weave pattern: change the base rule from (i+j)%5 to something more complex, like (i*i + j*j)%5 or a Fibonacci-based rule. How does the pattern change?',
      successHint: 'From Fibonacci sequences to group theory to L-systems to generative art — mathematics provides an infinite loom. The basket weaver\'s ancient craft and the programmer\'s generative code are two expressions of the same creative impulse: using rules to create beauty from repetition.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Mathematical Patterns — some math and coding experience helpful</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced pattern generation. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}