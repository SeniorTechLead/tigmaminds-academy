import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CaneWeaversLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Wallpaper groups — classifying all 2D symmetries',
      concept: `Mathematicians have proven that there are exactly **17 wallpaper groups** — 17 distinct ways to tile the plane with a repeating pattern. Every periodic 2D pattern (including every weave) belongs to one of these 17 groups.

Each group is defined by its combination of:
- **Translations**: how the pattern repeats
- **Rotations**: 2-fold (180°), 3-fold (120°), 4-fold (90°), 6-fold (60°)
- **Reflections**: mirror lines
- **Glide reflections**: slide + mirror

The notation uses symbols like p1, p2, pm, pg, cm, p4m, p6m, etc.

A plain weave has symmetry group **p4m** (the most symmetric square pattern). A twill has **p2** (only 180° rotation).

📚 *We will implement a symmetry classifier that determines which wallpaper group a given weave pattern belongs to.*`,
      analogy: 'Just as there are exactly 5 Platonic solids in 3D (no more, no fewer), there are exactly 17 wallpaper groups in 2D. This is a mathematical certainty — every periodic pattern ever created or yet to be created belongs to one of these 17 families.',
      storyConnection: 'The cane weavers of Tripura, through centuries of experimentation, have independently discovered patterns from multiple wallpaper groups. Their traditional repertoire spans many of the 17 groups — a remarkable achievement of intuitive mathematics.',
      checkQuestion: 'Why exactly 17? Why not 16 or 18?',
      checkAnswer: 'The proof (by Fedorov in 1891) shows that the constraints of 2D periodicity, combined with the crystallographic restriction (only 2, 3, 4, and 6-fold rotations are compatible with periodicity), limit the possibilities to exactly 17 combinations. Five-fold rotations cannot tile periodically, eliminating many potential groups.',
      codeIntro: 'Classify weave patterns into wallpaper groups based on their symmetry operations.',
      code: `import numpy as np

def detect_symmetries(grid):
    """Detect symmetry operations in a periodic 2D pattern."""
    rows, cols = grid.shape
    results = {}

    # 2-fold rotation (180°)
    rotated_180 = np.rot90(grid, 2)
    results['rot_180'] = np.array_equal(grid, rotated_180)

    # 4-fold rotation (90°)
    if rows == cols:
        rotated_90 = np.rot90(grid, 1)
        results['rot_90'] = np.array_equal(grid, rotated_90)
    else:
        results['rot_90'] = False

    # Horizontal reflection
    results['reflect_h'] = np.array_equal(grid, grid[::-1, :])

    # Vertical reflection
    results['reflect_v'] = np.array_equal(grid, grid[:, ::-1])

    # Diagonal reflection
    if rows == cols:
        results['reflect_diag'] = np.array_equal(grid, grid.T)
    else:
        results['reflect_diag'] = False

    # Glide reflection (shift + reflect)
    half_shift = np.roll(grid, rows // 2, axis=0)
    results['glide_h'] = np.array_equal(half_shift, grid[::-1, :])

    return results

def classify_wallpaper(sym):
    """Classify into wallpaper group based on detected symmetries."""
    if sym['rot_90'] and sym['reflect_h'] and sym['reflect_diag']:
        return 'p4m'
    if sym['rot_90'] and not sym['reflect_h']:
        return 'p4'
    if sym['rot_180'] and sym['reflect_h'] and sym['reflect_v']:
        return 'pmm'
    if sym['rot_180'] and sym['glide_h']:
        return 'pgg'
    if sym['rot_180'] and not sym['reflect_h']:
        return 'p2'
    if sym['reflect_h'] and sym['reflect_v']:
        return 'pmm'
    if sym['reflect_h'] or sym['reflect_v']:
        return 'pm'
    if sym['glide_h']:
        return 'pg'
    return 'p1'

# Test weave patterns
patterns = {
    'Plain': lambda r,c: (r+c) % 2,
    'Twill 2/2': lambda r,c: 1 if (r+c)%4<2 else 0,
    'Twill 3/1': lambda r,c: 1 if (r+c)%4<3 else 0,
    'Satin 5': lambda r,c: 1 if (r*2+c)%5==0 else 0,
    'Diamond': lambda r,c: 1 if (abs(r-8)+abs(c-8))%4<2 else 0,
    'Basket': lambda r,c: 1 if ((r//2)+(c//2))%2==0 else 0,
    'Random-ish': lambda r,c: 1 if (r*3+c*7)%11<5 else 0,
}

print("WALLPAPER GROUP CLASSIFICATION")
print("=" * 65)
print(f"{'Pattern':<14} | {'Group':>5} | {'Rot180':>6} | {'Rot90':>5} | {'RefH':>4} | {'RefV':>4} | {'Glide':>5}")
print("-" * 65)

for name, rule in patterns.items():
    grid = np.array([[rule(r,c) for c in range(16)] for r in range(16)], dtype=float)
    sym = detect_symmetries(grid)
    group = classify_wallpaper(sym)
    r180 = "Y" if sym['rot_180'] else "."
    r90 = "Y" if sym['rot_90'] else "."
    rh = "Y" if sym['reflect_h'] else "."
    rv = "Y" if sym['reflect_v'] else "."
    gl = "Y" if sym['glide_h'] else "."
    print(f"{name:<14} | {group:>5} | {r180:>6} | {r90:>5} | {rh:>4} | {rv:>4} | {gl:>5}")

print()
print("The 17 wallpaper groups classify ALL possible periodic 2D patterns.")
print("Tripura's weavers explore multiple groups through tradition.")`,
      challenge: 'Create a weave pattern for each of the groups p1, p2, pm, and p4m. Verify the classification with the detector.',
      successHint: 'The wallpaper groups are one of the great achievements of 19th-century mathematics. Every tile floor, every fabric pattern, every wallpaper — all belong to one of exactly 17 families.',
    },
    {
      title: 'Cellular automata — patterns from simple rules',
      concept: `A **cellular automaton** (CA) generates patterns by applying a local rule to each cell based on its neighbours. This connects to weaving: each crossing decision can depend on nearby crossings.

**Rule 110** (one of the most famous 1D cellular automata):
- Look at each cell and its two neighbours (3 cells = 8 possible states)
- Apply a lookup table to determine the next generation
- The rule number (0-255) encodes the lookup table in binary

Rule 110 is **Turing-complete** — it can compute anything a computer can. Complex behaviour emerges from a trivially simple rule.

Many weave patterns can be generated by 2D cellular automata rules.

📚 *We will implement 1D and 2D cellular automata and show how they generate weave-like patterns.*`,
      analogy: 'A cellular automaton is like a row of dominoes that decide whether to stand or fall based on their neighbours. Each generation cascades from the previous one, creating complex patterns from a simple local rule.',
      storyConnection: 'The cane weavers of Tripura make each crossing decision based on the pattern of nearby crossings — this is exactly a cellular automaton rule. The weaver IS a biological cellular automaton, executing a traditional rule set.',
      checkQuestion: 'Why can simple rules create complex patterns?',
      checkAnswer: 'Because each cell influences its neighbours, which influence THEIR neighbours. After many generations, the effects cascade and interact, creating complexity from simplicity. This is called "emergence" — the whole is more than the sum of its parts.',
      codeIntro: 'Generate weave-like patterns using cellular automata rules.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def cellular_automaton_1d(rule_num, width=80, generations=40):
    """Generate a 1D cellular automaton pattern."""
    # Convert rule number to lookup table
    rule = [(rule_num >> i) & 1 for i in range(8)]

    grid = np.zeros((generations, width), dtype=int)
    grid[0, width // 2] = 1  # single seed

    for g in range(1, generations):
        for i in range(width):
            left = grid[g-1, (i-1) % width]
            center = grid[g-1, i]
            right = grid[g-1, (i+1) % width]
            idx = left * 4 + center * 2 + right
            grid[g, i] = rule[idx]

    return grid

# Generate patterns for famous rules
rules = [30, 90, 110, 150]

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

for ax, rule_num in zip(axes.flat, rules):
    grid = cellular_automaton_1d(rule_num)
    ax.imshow(grid, cmap='YlGn', interpolation='nearest', aspect='auto')
    ax.set_title(f'Rule {rule_num}', color='white', fontsize=12, fontweight='bold')
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white', labelsize=7)
    ax.set_xlabel('Cell', color='white', fontsize=9)
    ax.set_ylabel('Generation', color='white', fontsize=9)

plt.suptitle('1D Cellular Automata → Weave Patterns', color='white', fontsize=14)
plt.tight_layout()
plt.savefig('ca_patterns.png', dpi=100, facecolor='#1f2937')
plt.show()

# Analyse pattern properties
print("CELLULAR AUTOMATON PATTERN ANALYSIS")
print("=" * 55)
for rule_num in rules:
    grid = cellular_automaton_1d(rule_num)
    density = grid.mean() * 100
    # Compute entropy (measure of randomness)
    p = grid.mean()
    if 0 < p < 1:
        entropy = -(p * np.log2(p) + (1-p) * np.log2(1-p))
    else:
        entropy = 0
    # Symmetry
    is_symmetric = np.array_equal(grid, grid[:, ::-1])
    print(f"  Rule {rule_num:>3}: density={density:.1f}%, entropy={entropy:.3f}, symmetric={'Yes' if is_symmetric else 'No'}")

print("\\nRule 30: chaotic (used for randomness)")
print("Rule 90: fractal (Sierpinski triangle)")
print("Rule 110: Turing-complete (can compute anything)")
print("Rule 150: quasi-periodic (good for weaves)")`,
      challenge: 'Implement a 2D cellular automaton (like Conway\'s Game of Life) and use it as a weave pattern generator. Does the pattern stabilise or keep evolving?',
      successHint: 'Cellular automata show that complexity does not require complex rules. The most intricate patterns emerge from the simplest local interactions — a profound insight that applies to weaving, biology, and computation.',
    },
    {
      title: 'Information theory — measuring pattern complexity',
      concept: `**Shannon entropy** measures the information content of a pattern:

\`H = -Σ p_i × log₂(p_i)\`

For a binary weave pattern:
- All zeros (uniform): H = 0 (no information)
- 50/50 random: H = 1 (maximum information per cell)
- Structured pattern: 0 < H < 1 (some information, some predictability)

But raw entropy does not capture **structure**. A random pattern and a structured pattern can have the same entropy. To measure structural complexity, we use:

- **Block entropy**: entropy of 2×2, 3×3, etc. blocks
- **Mutual information**: how much one part of the pattern tells you about another
- **Kolmogorov complexity**: length of the shortest program that generates the pattern

📚 *We will compute various complexity measures for weave patterns and rank them from simple to complex.*`,
      analogy: 'A phone book has high entropy (lots of data) but low complexity (it is just a sorted list). A novel has moderate entropy but high complexity (structured information). Weave patterns work the same way — entropy and complexity are different things.',
      storyConnection: 'The traditional patterns of Tripura represent centuries of "information design" — maximising visual interest (complexity) within the constraints of the weaving process. The most admired patterns balance structure with surprise.',
      checkQuestion: 'Which has higher entropy: a plain weave or a random pattern?',
      checkAnswer: 'A random 50/50 pattern has maximum entropy (H=1). A plain weave alternates perfectly, so it has lower entropy — it is highly predictable. But the plain weave has MORE structure (it is a perfect crystal). Entropy measures unpredictability, not complexity.',
      codeIntro: 'Compute information-theoretic measures of weave pattern complexity.',
      code: `import numpy as np

def shannon_entropy(grid):
    """Compute Shannon entropy of a binary grid."""
    p = grid.mean()
    if p == 0 or p == 1:
        return 0
    return -(p * np.log2(p) + (1-p) * np.log2(1-p))

def block_entropy(grid, block_size=2):
    """Compute entropy of block patterns."""
    rows, cols = grid.shape
    blocks = []
    for r in range(0, rows - block_size + 1):
        for c in range(0, cols - block_size + 1):
            block = tuple(grid[r:r+block_size, c:c+block_size].flatten())
            blocks.append(block)

    # Count unique blocks
    from collections import Counter
    counts = Counter(blocks)
    total = len(blocks)
    probs = [c / total for c in counts.values()]
    H = -sum(p * np.log2(p) for p in probs if p > 0)
    return H

def compression_ratio(grid):
    """Estimate Kolmogorov complexity via compression ratio."""
    flat = grid.flatten().astype(np.uint8).tobytes()
    import zlib
    compressed = zlib.compress(flat, 9)
    return len(compressed) / len(flat)

# Generate patterns
patterns = {
    'Uniform (all 1)':  np.ones((32, 32)),
    'Plain weave':      np.array([[(r+c)%2 for c in range(32)] for r in range(32)], dtype=float),
    'Twill 2/2':        np.array([[1 if (r+c)%4<2 else 0 for c in range(32)] for r in range(32)], dtype=float),
    'Diamond':          np.array([[1 if (abs(r-16)+abs(c-16))%8<4 else 0 for c in range(32)] for r in range(32)], dtype=float),
    'Complex rule':     np.array([[1 if (r*3+c*7+r*c)%11<5 else 0 for c in range(32)] for r in range(32)], dtype=float),
    'Random':           np.random.randint(0, 2, (32, 32)).astype(float),
}

print("INFORMATION-THEORETIC ANALYSIS OF WEAVE PATTERNS")
print("=" * 70)
print(f"{'Pattern':<18} | {'H(cell)':>7} | {'H(2x2)':>7} | {'H(3x3)':>7} | {'Compress':>8}")
print("-" * 70)

for name, grid in patterns.items():
    h1 = shannon_entropy(grid)
    h2 = block_entropy(grid, 2)
    h3 = block_entropy(grid, 3)
    cr = compression_ratio(grid)
    print(f"{name:<18} | {h1:>7.3f} | {h2:>7.3f} | {h3:>7.3f} | {cr:>7.3f}")

print()
print("Low cell entropy + low block entropy = simple (plain weave)")
print("High cell entropy + high block entropy = random")
print("Medium entropy + high block entropy = structured complexity")
print("Compression ratio ≈ Kolmogorov complexity (shorter = simpler)")`,
      challenge: 'Find a weave pattern that maximises block entropy while keeping cell entropy at exactly 0.5 (50% fill). This is the "most complex balanced pattern."',
      successHint: 'Information theory provides a rigorous language for measuring pattern complexity. The most beautiful traditional patterns often lie at the sweet spot between order and randomness.',
    },
    {
      title: 'Genetic algorithm — evolving optimal weave patterns',
      concept: `A **genetic algorithm** (GA) evolves solutions by mimicking natural selection:

1. **Population**: start with random weave patterns
2. **Fitness**: score each pattern on desired properties (symmetry, strength, beauty)
3. **Selection**: keep the best patterns
4. **Crossover**: combine parts of two good patterns to make offspring
5. **Mutation**: randomly flip some cells
6. **Repeat**: iterate until fitness converges

This is how nature "designs" — not by planning, but by trying, selecting, and iterating. The same process can discover weave patterns that optimise multiple objectives simultaneously.

📚 *We will implement a GA that evolves weave patterns to maximise a fitness function combining symmetry, structural strength, and visual complexity.*`,
      analogy: 'A genetic algorithm is like breeding dogs: you start with variety, keep the ones with desired traits, breed them, and repeat. Over generations, you get dogs perfectly suited to a purpose. GA does the same with weave patterns.',
      storyConnection: 'The traditional patterns of Tripura evolved over centuries through a cultural "genetic algorithm" — weavers tried variations, communities selected the best, and successful patterns were passed down. Our computational GA compresses centuries of evolution into seconds.',
      checkQuestion: 'Why use a genetic algorithm instead of checking every possible pattern?',
      checkAnswer: 'A 10×10 binary grid has 2^100 ≈ 10^30 possible patterns. Checking all of them would take longer than the age of the universe. The GA intelligently samples the space by evolving toward good solutions, finding near-optimal patterns in thousands of evaluations instead of 10^30.',
      codeIntro: 'Evolve optimal weave patterns using a genetic algorithm.',
      code: `import numpy as np

np.random.seed(42)

def create_pattern(size=8):
    return np.random.randint(0, 2, (size, size))

def fitness(pattern):
    """Score a weave pattern on multiple criteria."""
    score = 0
    n = pattern.shape[0]

    # 1. Symmetry bonus (rotation)
    rot180 = np.rot90(pattern, 2)
    sym_score = np.mean(pattern == rot180) * 30
    score += sym_score

    # 2. Balance (close to 50% fill)
    balance = 1 - abs(pattern.mean() - 0.5) * 2
    score += balance * 20

    # 3. Interlacing (no long floats)
    max_float = 1
    for r in range(n):
        run = 1
        for c in range(1, n):
            if pattern[r,c] == pattern[r,c-1]:
                run += 1
                max_float = max(max_float, run)
            else:
                run = 1
    float_penalty = min(max_float, 6) / 6
    score += (1 - float_penalty) * 25

    # 4. Complexity (block variety)
    blocks = set()
    for r in range(n-1):
        for c in range(n-1):
            blocks.add(tuple(pattern[r:r+2, c:c+2].flatten()))
    complexity = len(blocks) / 16 * 25
    score += complexity

    return score

def crossover(p1, p2):
    """Single-point crossover."""
    child = p1.copy()
    cut = np.random.randint(1, p1.shape[0])
    child[cut:] = p2[cut:]
    return child

def mutate(pattern, rate=0.05):
    """Flip random cells."""
    mask = np.random.random(pattern.shape) < rate
    pattern[mask] = 1 - pattern[mask]
    return pattern

# GA parameters
pop_size = 50
generations = 100
grid_size = 8

# Initialise population
population = [create_pattern(grid_size) for _ in range(pop_size)]

best_history = []

for gen in range(generations):
    # Evaluate fitness
    scores = [(fitness(p), p) for p in population]
    scores.sort(key=lambda x: -x[0])

    best_history.append(scores[0][0])

    # Selection (top 50%)
    survivors = [p for _, p in scores[:pop_size // 2]]

    # Create next generation
    next_gen = survivors.copy()
    while len(next_gen) < pop_size:
        p1, p2 = survivors[np.random.randint(len(survivors))], survivors[np.random.randint(len(survivors))]
        child = crossover(p1, p2)
        child = mutate(child)
        next_gen.append(child)

    population = next_gen

# Results
best_pattern = scores[0][1]
print("GENETIC ALGORITHM — EVOLVED WEAVE PATTERN")
print("=" * 50)
print(f"Generations: {generations}, Population: {pop_size}")
print(f"Best fitness: {scores[0][0]:.1f} / 100")
print(f"Worst in top 5: {scores[4][0]:.1f}")
print()

print("Best pattern:")
for row in best_pattern:
    print("  " + " ".join("█" if c else "░" for c in row))

print(f"\\nFill: {best_pattern.mean()*100:.0f}%")
sym = np.mean(best_pattern == np.rot90(best_pattern, 2)) * 100
print(f"180° symmetry: {sym:.0f}%")
print(f"\\nFitness progression: {best_history[0]:.1f} → {best_history[-1]:.1f}")
print(f"Improvement: {(best_history[-1]-best_history[0])/best_history[0]*100:.0f}%")`,
      challenge: 'Add an "aesthetic" fitness component that rewards patterns similar to known Tripura traditional patterns. Does the GA rediscover traditional designs?',
      successHint: 'Genetic algorithms show that design does not require a designer — selection pressure alone can create sophisticated, optimised patterns. The cane weavers of Tripura have been running this algorithm for generations.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Pattern Mathematics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
