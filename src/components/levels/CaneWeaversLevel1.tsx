import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CaneWeaversLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Binary patterns — the weaver\'s code',
      concept: `Every weave pattern is a sequence of **over** and **under** crossings. If we code "over" as **1** and "under" as **0**, any weave becomes a binary number.

A simple plain weave: \`1, 0, 1, 0, 1, 0...\`
A twill weave: \`1, 1, 0, 0, 1, 1, 0, 0...\`
A satin weave: \`1, 0, 0, 0, 0, 1, 0, 0, 0, 0...\`

In binary (base 2), these patterns can be represented as numbers:
- \`1010\` = 10 in decimal
- \`1100\` = 12 in decimal

The **repeat unit** (how many crossings before the pattern repeats) determines the weave character. A 2-unit repeat gives plain weave. A 4-unit repeat allows twills and satins.

📚 *We will use Python lists, loops, and the \`bin()\` function to explore binary weave patterns.*`,
      analogy: 'Binary is like Morse code — dots and dashes make letters. Zeros and ones make weave patterns. A skilled weaver "reads" a pattern the way a telegraph operator reads Morse, producing fabric from code.',
      storyConnection: 'The cane weavers of Tripura create intricate patterns by deciding, at each crossing, whether the horizontal cane goes over or under the vertical one. This is a binary decision — the simplest possible code — yet it creates stunning complexity.',
      checkQuestion: 'How many different weave patterns are possible with a 4-crossing repeat unit?',
      checkAnswer: '2⁴ = 16 patterns, from 0000 (all under) to 1111 (all over). But 0000 and 1111 are not real weaves (they would fall apart). So there are 14 valid patterns. The cane weavers of Tripura use dozens of distinct patterns, each with a traditional name.',
      codeIntro: 'Generate and display binary weave patterns.',
      code: `# Binary weave pattern generator
def weave_to_binary(pattern):
    """Convert a weave list to binary string and decimal."""
    binary = ''.join(str(b) for b in pattern)
    decimal = int(binary, 2)
    return binary, decimal

def display_weave(pattern, rows=6, name=""):
    """Display a weave pattern as a text grid."""
    n = len(pattern)
    print(f"  Pattern: {name}")
    for row in range(rows):
        line = ""
        for col in range(12):
            # Alternate pattern based on row parity
            idx = (col + row) % n
            if pattern[idx] == 1:
                line += "█ "  # over (visible)
            else:
                line += "░ "  # under (hidden)
        print(f"    {line}")
    print()

# Common weave patterns
patterns = {
    "Plain weave": [1, 0],
    "Twill 2/2":   [1, 1, 0, 0],
    "Twill 3/1":   [1, 1, 1, 0],
    "Satin 5":     [1, 0, 0, 0, 0],
    "Basket 2/2":  [1, 1, 0, 0],
    "Herringbone": [1, 1, 0, 0],
}

for name, pattern in patterns.items():
    binary, decimal = weave_to_binary(pattern)
    print(f"{name:16s} | Binary: {binary:>8s} | Decimal: {decimal:>3d} | Repeat: {len(pattern)}")
    display_weave(pattern, rows=4, name=name)

# Count all possible patterns for different repeat lengths
print("PATTERN DIVERSITY")
print("-" * 40)
for n in range(2, 9):
    total = 2**n
    valid = total - 2  # exclude all-0 and all-1
    print(f"  Repeat {n}: {total} total, {valid} valid patterns")`,
      challenge: 'Create a weave pattern where the binary represents your birth year. For example, if you were born in 2010, convert 2010 to binary (11111011010) and display it as a weave.',
      successHint: 'Every weave pattern is a binary code. The weavers of Tripura encode information — tradition, identity, beauty — in the simplest possible language: over and under, one and zero.',
    },
    {
      title: 'Symmetry operations — reflections and rotations',
      concept: `**Symmetry** means a pattern looks the same after some transformation. There are four types of symmetry in 2D:

1. **Rotation**: turn the pattern by some angle and it looks the same
2. **Reflection**: flip the pattern across a line (mirror)
3. **Translation**: slide the pattern by some distance
4. **Glide reflection**: slide + flip combined

A weave pattern might have:
- **2-fold rotation** (180°): looks the same upside down
- **4-fold rotation** (90°): looks the same rotated quarter turns
- **Horizontal reflection**: top matches bottom
- **Vertical reflection**: left matches right

The more symmetries a pattern has, the simpler and more "regular" it looks.

📚 *We will detect symmetry operations in weave patterns using lists and comparison.*`,
      analogy: 'A butterfly has reflection symmetry — left wing mirrors the right. A pinwheel has rotation symmetry — it looks the same after turning. Weave patterns can have both, neither, or combinations of these symmetries.',
      storyConnection: 'The cane weavers of Tripura use symmetry intentionally — a basket with 4-fold symmetry looks balanced from any angle. Asymmetric patterns are used decoratively, while symmetric patterns are structural. The choice of symmetry is a design decision.',
      checkQuestion: 'Does a plain weave (1,0,1,0) have reflection symmetry?',
      checkAnswer: 'Yes — reflecting it horizontally or vertically gives the same pattern. It also has 2-fold rotation symmetry (180° rotation). The plain weave is the most symmetric simple weave.',
      codeIntro: 'Detect symmetry operations in weave patterns.',
      code: `# Symmetry detector for weave patterns

def has_rotation_symmetry(pattern, angle_fraction):
    """Check if pattern has n-fold rotation symmetry.
    angle_fraction: 1/n (e.g., 1/2 for 180°, 1/4 for 90°)"""
    n = len(pattern)
    shift = int(n * angle_fraction)
    rotated = pattern[shift:] + pattern[:shift]
    return rotated == pattern

def has_reflection_symmetry(pattern):
    """Check if pattern reads the same forwards and backwards."""
    return pattern == pattern[::-1]

def has_complement_symmetry(pattern):
    """Check if flipping 0s and 1s gives a shifted version."""
    complement = [1 - b for b in pattern]
    n = len(pattern)
    for shift in range(n):
        shifted = complement[shift:] + complement[:shift]
        if shifted == pattern:
            return True, shift
    return False, 0

# Analyse various patterns
patterns = {
    "Plain (1,0)":         [1, 0],
    "Twill (1,1,0,0)":     [1, 1, 0, 0],
    "Satin (1,0,0,0,0)":   [1, 0, 0, 0, 0],
    "Custom (1,1,1,0)":    [1, 1, 1, 0],
    "Diamond (1,0,1,0,1)": [1, 0, 1, 0, 1],
    "Complex (1,1,0,1,0,0)":[1, 1, 0, 1, 0, 0],
    "Basket (1,1,0,0,1,1,0,0)": [1,1,0,0,1,1,0,0],
}

print("SYMMETRY ANALYSIS OF WEAVE PATTERNS")
print("=" * 65)
print(f"{'Pattern':<25} | {'Reflect':>7} | {'Rot-2':>5} | {'Rot-4':>5} | {'Compl':>5}")
print("-" * 65)

for name, pat in patterns.items():
    reflect = has_reflection_symmetry(pat)
    rot2 = has_rotation_symmetry(pat, 1/2)
    rot4 = has_rotation_symmetry(pat, 1/4) if len(pat) % 4 == 0 else False
    compl, _ = has_complement_symmetry(pat)

    r = "Yes" if reflect else "No"
    r2 = "Yes" if rot2 else "No"
    r4 = "Yes" if rot4 else "No"
    c = "Yes" if compl else "No"
    sym_count = sum([reflect, rot2, rot4, compl])
    print(f"{name:<25} | {r:>7} | {r2:>5} | {r4:>5} | {c:>5} | {sym_count} sym")

print()
print("More symmetries = more regular appearance")
print("Cane weavers balance symmetry (structure) with asymmetry (decoration)")`,
      challenge: 'Find a 6-element pattern that has reflection symmetry but NOT rotation symmetry. How many such patterns exist?',
      successHint: 'Symmetry detection is the foundation of crystallography, pattern recognition, and computer vision. The weavers of Tripura apply these principles through tradition; mathematicians formalised them in group theory.',
    },
    {
      title: 'Tessellations — patterns that tile the plane',
      concept: `A **tessellation** is a pattern of shapes that covers a flat surface with no gaps and no overlaps. Regular tessellations use a single regular polygon:

Only 3 regular polygons can tessellate alone:
- **Equilateral triangles** (6 meet at each vertex, angles sum to 360°)
- **Squares** (4 meet, 4 × 90° = 360°)
- **Regular hexagons** (3 meet, 3 × 120° = 360°)

The rule: at each vertex, the angles of the meeting polygons must sum to exactly 360°.

Pentagons (108° angles) cannot tile: 3 × 108 = 324° (gap) and 4 × 108 = 432° (overlap).

📚 *We will check which polygons can tessellate by calculating interior angles and testing the 360° rule.*`,
      analogy: 'Tessellation is like fitting puzzle pieces together so they fill the table perfectly. Some shapes fit perfectly (squares, hexagons). Others always leave gaps (regular pentagons, octagons alone). The 360° rule is the test.',
      storyConnection: 'The cane weavers of Tripura create tessellated patterns on basket surfaces. The weave naturally produces a square grid (the simplest tessellation), but by changing the pattern of overs and unders, they create the illusion of triangles, hexagons, and diamonds within the grid.',
      checkQuestion: 'Why can you tile a floor with square tiles but not regular pentagon tiles?',
      checkAnswer: 'A square has 90° corners. Four squares meet at a point: 4 × 90° = 360° (perfect fit). A regular pentagon has 108° corners. Three meet: 3 × 108° = 324° (12° gap). Four meet: 4 × 108° = 432° (72° overlap). No integer number of pentagons sums to 360°.',
      codeIntro: 'Determine which regular polygons can tessellate the plane.',
      code: `import math

# Interior angle of a regular n-gon: (n-2) * 180 / n
def interior_angle(n):
    return (n - 2) * 180 / n

print("REGULAR POLYGON TESSELLATION TEST")
print("=" * 60)
print(f"{'Polygon':<14} | {'Sides':>5} | {'Angle':>7} | {'At vertex':>10} | Tessellates?")
print("-" * 60)

polygon_names = {3: "Triangle", 4: "Square", 5: "Pentagon",
                 6: "Hexagon", 7: "Heptagon", 8: "Octagon",
                 9: "Nonagon", 10: "Decagon", 12: "Dodecagon"}

tessellating = []

for n in range(3, 13):
    angle = interior_angle(n)
    # How many fit at a vertex?
    k = 360 / angle
    name = polygon_names.get(n, f"{n}-gon")
    can_tile = abs(k - round(k)) < 0.001 and k >= 3
    if can_tile:
        tessellating.append((name, n, int(k)))
    marker = "YES" if can_tile else "no"
    print(f"{name:<14} | {n:>5} | {angle:>6.1f}° | {k:>8.2f}  | {marker}")

print(f"\
Only {len(tessellating)} regular polygons can tessellate:")
for name, n, k in tessellating:
    print(f"  {name}: {k} polygons meet at each vertex")

# Semi-regular tessellations (vertex-transitive with 2+ polygon types)
print("\
SEMI-REGULAR TESSELLATIONS (2 polygon types):")
print("-" * 50)
count = 0
for n1 in range(3, 13):
    for n2 in range(n1, 13):
        a1 = interior_angle(n1)
        a2 = interior_angle(n2)
        # Try combinations that sum to 360
        for k1 in range(1, 7):
            for k2 in range(1, 7):
                if abs(k1 * a1 + k2 * a2 - 360) < 0.1 and k1 + k2 >= 3:
                    count += 1
                    if count <= 6:
                        print(f"  {k1}×{polygon_names.get(n1,f'{n1}-gon')} + "
                              f"{k2}×{polygon_names.get(n2,f'{n2}-gon')} "
                              f"= {k1*a1 + k2*a2:.0f}°")`,
      challenge: 'The most famous semi-regular tessellation uses octagons and squares (the bathroom floor pattern). Verify that 2 octagons + 1 square = 360° at each vertex.',
      successHint: 'Tessellation theory explains why honeycombs are hexagonal, bathroom floors use specific tile shapes, and Islamic art features stunning geometric patterns. The 360° rule governs them all.',
    },
    {
      title: 'Describing patterns with algorithms',
      concept: `Complex weave patterns can be described by simple **algorithms** — step-by-step rules that generate the pattern.

A plain weave algorithm:
\`For each crossing (row, col): if (row + col) is even → over, else → under\`

A twill algorithm:
\`For each crossing: if (row + col) mod 4 < 2 → over, else → under\`

A diamond algorithm:
\`d = |row - center_row| + |col - center_col|; if d mod 4 < 2 → over\`

The beauty is that a short algorithm can describe an infinitely large pattern. This is **algorithmic compression** — the pattern has low information content despite looking complex.

📚 *We will implement pattern-generating algorithms and display the results as text grids.*`,
      analogy: 'An algorithm is like a recipe. Instead of drawing every crossing individually (which would take forever for a large basket), the weaver follows a rule: "over 2, under 2, shift right 1 each row." The rule is short; the pattern it creates is vast.',
      storyConnection: 'The cane weavers of Tripura do not draw patterns on paper — they follow rules passed down through generations. "Over 3, under 1, shift 1" is an algorithm. The mathematical description of their craft reveals that they are, in essence, programmers.',
      checkQuestion: 'If a pattern rule is "over when (row + 2*col) mod 5 == 0, else under", what fraction of crossings are "over"?',
      checkAnswer: 'The condition (row + 2*col) mod 5 == 0 is true for 1 out of every 5 values. So 20% of crossings are "over" and 80% are "under". This describes a sparse satin-like weave.',
      codeIntro: 'Generate weave patterns from algorithmic rules.',
      code: `# Algorithmic pattern generator
def generate_pattern(rows, cols, rule_fn, name):
    """Generate a weave pattern from a rule function."""
    print(f"  {name}:")
    grid = []
    for r in range(rows):
        row = []
        line = "    "
        for c in range(cols):
            val = rule_fn(r, c)
            row.append(val)
            line += "█ " if val else "░ "
        grid.append(row)
        print(line)
    print()
    return grid

# Different algorithmic rules
rules = {
    "Plain weave": lambda r, c: (r + c) % 2 == 0,
    "Twill 2/2": lambda r, c: (r + c) % 4 < 2,
    "Twill 3/1": lambda r, c: (r + c) % 4 < 3,
    "Diamond": lambda r, c: (abs(r - 6) + abs(c - 6)) % 4 < 2,
    "Zigzag": lambda r, c: (r + (c if r % 2 == 0 else -c)) % 4 < 2,
    "Checkerboard 2x2": lambda r, c: ((r // 2) + (c // 2)) % 2 == 0,
}

print("ALGORITHMIC WEAVE PATTERNS (12×12 grid)")
print("=" * 50)

for name, rule in rules.items():
    grid = generate_pattern(12, 12, rule, name)

# Pattern statistics
print("PATTERN STATISTICS")
print("-" * 45)
for name, rule in rules.items():
    overs = sum(1 for r in range(12) for c in range(12) if rule(r, c))
    total = 144
    print(f"  {name:<20}: {overs:>3}/{total} over ({overs/total*100:.0f}%)")

print()
print("Each pattern is defined by a single rule (one line of code).")
print("The rule generates an infinite pattern — the grid is just a window.")`,
      challenge: 'Invent your own rule that creates a pattern with exactly 50% overs and a visible spiral or wave shape. Test it on a 20x20 grid.',
      successHint: 'Algorithms compress complex patterns into simple rules. The weavers of Tripura carry these algorithms as cultural knowledge — mental programs that generate physical beauty.',
    },
    {
      title: 'Counting unique patterns — combinatorics',
      concept: `How many truly unique weave patterns can be created with an n×n repeat unit?

Naively: each cell is 0 or 1, so there are **2^(n²)** patterns. For a 4×4 repeat: 2¹⁶ = 65,536 patterns.

But many are equivalent (same pattern shifted, rotated, or reflected). We can count distinct patterns using **Burnside's lemma** from group theory:

\`|distinct| = (1/|G|) × Σ |Fix(g)|\`

where G is the symmetry group and Fix(g) is the number of patterns unchanged by symmetry operation g.

For simple translation equivalence: divide by n² (number of shift positions).

This counting problem connects weaving to abstract algebra — one of the deepest areas of mathematics.

📚 *We will count patterns for small repeat units and discover how symmetry reduces the count dramatically.*`,
      analogy: 'How many unique necklaces can you make with 4 beads, each black or white? There are 2⁴ = 16 colour arrangements, but rotating the necklace makes some look identical. The "truly different" count is smaller — and Burnside\'s lemma tells you exactly how many.',
      storyConnection: 'The cane weavers of Tripura have a finite repertoire of traditional patterns, each with a name and meaning. The mathematical count of possible patterns is vast, yet the culturally significant ones are few — selected by generations of aesthetic judgment.',
      checkQuestion: 'For a 2×2 repeat unit with 2 colours, how many naive patterns are there? How many are distinct under rotation?',
      checkAnswer: 'Naive: 2⁴ = 16. Under 4-fold rotation (0°, 90°, 180°, 270°), Burnside gives: (16 + 4 + 4 + 4)/4 = 28/4 = 7 distinct patterns. Rotation alone eliminates more than half the duplicates.',
      codeIntro: 'Count unique weave patterns for different repeat sizes, accounting for symmetry.',
      code: `import math
from itertools import product

def count_naive(n):
    """Total patterns without considering symmetry."""
    return 2 ** (n * n)

def count_shift_equivalent(n):
    """Approximate distinct patterns under translation."""
    return count_naive(n) // (n * n)

def count_with_rotation(n):
    """Count distinct patterns under 4-fold rotation (Burnside)."""
    total = count_naive(n)

    # Identity: all patterns fixed = 2^(n^2)
    fix_identity = total

    # 90° rotation: only patterns that map to themselves
    # Cells form orbits of size 4 (or 1 for center if n is odd)
    if n % 2 == 0:
        orbits_90 = n * n // 4
    else:
        orbits_90 = (n * n - 1) // 4 + 1  # center is fixed

    fix_90 = 2 ** orbits_90
    fix_270 = fix_90  # same count

    # 180° rotation: cells pair up
    if n % 2 == 0:
        orbits_180 = n * n // 2
    else:
        orbits_180 = (n * n - 1) // 2 + 1

    fix_180 = 2 ** orbits_180

    distinct = (fix_identity + fix_90 + fix_180 + fix_270) // 4
    return distinct

print("WEAVE PATTERN COUNTING")
print("=" * 65)
print(f"{'n×n':>4} | {'Naive (2^n²)':>14} | {'÷Translation':>14} | {'÷Rotation':>14}")
print("-" * 65)

for n in range(2, 7):
    naive = count_naive(n)
    trans = count_shift_equivalent(n)
    rot = count_with_rotation(n)
    print(f"{n}×{n:d}  | {naive:>14,} | {trans:>14,} | {rot:>14,}")

print()
print("Even a 6×6 repeat unit allows BILLIONS of patterns.")
print("Rotation symmetry eliminates ~75% of duplicates.")
print("Adding reflection would eliminate even more.")
print()

# For small grids, enumerate and count
print("ALL DISTINCT 2×2 PATTERNS (under rotation):")
print("-" * 40)
seen = set()
count = 0
for bits in product([0, 1], repeat=4):
    grid = [list(bits[:2]), list(bits[2:])]
    # Generate all rotations
    canonical = []
    g = [list(row) for row in grid]
    for _ in range(4):
        canonical.append(tuple(tuple(row) for row in g))
        # Rotate 90°
        g = [[g[1][0], g[0][0]], [g[1][1], g[0][1]]]
    key = min(canonical)
    if key not in seen:
        seen.add(key)
        count += 1
        visual = ''.join('█' if b else '░' for b in bits)
        print(f"  #{count}: {visual} = {bits}")

print(f"\
Total distinct 2×2 patterns: {count}")`,
      challenge: 'Extend the counting to include reflections (horizontal, vertical, and both diagonals). How many distinct 3×3 patterns exist under the full symmetry group?',
      successHint: 'Counting distinct patterns under symmetry is a deep mathematical problem solved by group theory. The cane weavers of Tripura explore this vast pattern space through centuries of creative experimentation.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Symmetry, Tessellations & Algorithms</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
