import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CaneWeaversLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Visualising weave patterns with matplotlib',
      concept: `We can render weave patterns as coloured grids using matplotlib's \`imshow()\` function. Each cell represents a crossing point — black for "over" and white for "under".

By varying the algorithm that generates the grid, we can create and compare dozens of weave patterns visually. The grid is a 2D numpy array where 1 = over and 0 = under.

Key matplotlib techniques:
- \`np.zeros((rows, cols))\` creates the grid
- \`ax.imshow(grid, cmap='binary')\` renders it
- Multiple subplots let us compare patterns side by side

📚 *We will use numpy 2D arrays and matplotlib \`imshow()\` to render beautiful weave pattern visualisations.*`,
      analogy: 'A weave diagram is like a QR code — a grid of black and white squares that encodes information. QR codes encode URLs; weave diagrams encode textile structure.',
      storyConnection: 'Museum curators documenting Tripura\'s cane patterns use exactly these grid diagrams. Our matplotlib renderings are digital versions of the hand-drawn pattern charts that weavers have used for centuries.',
      checkQuestion: 'If a weave grid is 20×20, how many crossing points does it contain?',
      checkAnswer: '20 × 20 = 400 crossing points. Each is independently "over" or "under", giving 2^400 ≈ 10^120 possible patterns — more than the number of atoms in the observable universe.',
      codeIntro: 'Render weave patterns as visual grids using matplotlib.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def make_weave(rows, cols, rule):
    grid = np.zeros((rows, cols))
    for r in range(rows):
        for c in range(cols):
            grid[r, c] = rule(r, c)
    return grid

rules = {
    'Plain': lambda r, c: (r + c) % 2,
    'Twill 2/2': lambda r, c: 1 if (r + c) % 4 < 2 else 0,
    'Twill 3/1': lambda r, c: 1 if (r + c) % 4 < 3 else 0,
    'Diamond': lambda r, c: 1 if (abs(r-10) + abs(c-10)) % 6 < 3 else 0,
    'Herringbone': lambda r, c: 1 if ((r + c) if r % 4 < 2 else (r - c)) % 4 < 2 else 0,
    'Basket 2x2': lambda r, c: 1 if ((r//2) + (c//2)) % 2 == 0 else 0,
}

fig, axes = plt.subplots(2, 3, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

for ax, (name, rule) in zip(axes.flat, rules.items()):
    grid = make_weave(20, 20, rule)
    ax.imshow(grid, cmap='YlGn', interpolation='nearest', aspect='equal')
    ax.set_title(name, color='white', fontsize=11, fontweight='bold')
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white', labelsize=7)

plt.suptitle('Cane Weave Patterns of Tripura', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.savefig('weaves.png', dpi=100, facecolor='#1f2937')
plt.show()

for name, rule in rules.items():
    grid = make_weave(20, 20, rule)
    density = grid.mean() * 100
    print(f"{name:14s}: {density:.0f}% over-crossings")`,
      challenge: 'Create a custom rule that produces a pattern resembling the letter "T" (for Tripura) repeated in a grid. Hint: define a 5×5 tile and repeat it.',
      successHint: 'Matplotlib transforms abstract weave algorithms into visual patterns. This bridge between code and craft is exactly how computer-aided textile design works in industry.',
    },
    {
      title: 'Colour symmetry in weave patterns',
      concept: `Adding colour to weave patterns introduces **colour symmetry** — patterns where swapping colours is itself a symmetry operation.

A **dichromatic pattern** uses two colours. It has colour symmetry if swapping black↔white produces a pattern that looks the same (possibly shifted or rotated).

The plain weave is the simplest example: swapping warp and weft colours is equivalent to shifting by one row.

In cane weaving, colour symmetry emerges from using two colours of cane alternately:
- Natural (light) and dyed (dark)
- The pattern of overs/unders combined with the colour arrangement creates rich visual effects

📚 *We will create coloured weave patterns using RGB arrays in matplotlib and detect colour symmetry.*`,
      analogy: 'Colour symmetry is like a chessboard — swap black and white, and you get the same pattern shifted one square. The pattern is "symmetric under colour exchange plus translation."',
      storyConnection: 'Tripura\'s weavers use natural and dyed cane strips to create two-colour patterns. The interplay of weave structure and colour sequence produces patterns that appear far more complex than the underlying algorithm.',
      checkQuestion: 'If a weave has colour symmetry, can you tell which colour is the "original" and which is the "swap"?',
      checkAnswer: 'No — that is exactly what colour symmetry means. The pattern is indistinguishable under colour swap. There is no "original" colour. This is a deep symmetry that goes beyond geometry.',
      codeIntro: 'Create coloured weave patterns and detect colour symmetry operations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def coloured_weave(rows, cols, weave_rule, colour_rule):
    """Create RGB weave with colour pattern."""
    img = np.zeros((rows, cols, 3))
    colours = {
        (1, 'A'): [0.2, 0.6, 0.3],  # dark green (dyed cane)
        (1, 'B'): [0.8, 0.7, 0.3],  # gold (natural cane)
        (0, 'A'): [0.9, 0.85, 0.7], # light (background A)
        (0, 'B'): [0.6, 0.5, 0.3],  # brown (background B)
    }
    for r in range(rows):
        for c in range(cols):
            over = weave_rule(r, c)
            colour = colour_rule(r, c)
            img[r, c] = colours.get((over, colour), [0.5, 0.5, 0.5])
    return img

# Different colour arrangements
configs = [
    ('Plain + Alternate cols', lambda r,c: (r+c)%2, lambda r,c: 'A' if c%2==0 else 'B'),
    ('Twill + Alternate rows', lambda r,c: 1 if (r+c)%4<2 else 0, lambda r,c: 'A' if r%2==0 else 'B'),
    ('Diamond + Diagonal', lambda r,c: 1 if (abs(r-10)+abs(c-10))%6<3 else 0, lambda r,c: 'A' if (r+c)%2==0 else 'B'),
    ('Basket + Block', lambda r,c: 1 if ((r//2)+(c//2))%2==0 else 0, lambda r,c: 'A' if (r//3+c//3)%2==0 else 'B'),
]

fig, axes = plt.subplots(1, 4, figsize=(14, 3.5))
fig.patch.set_facecolor('#1f2937')

for ax, (name, wrule, crule) in zip(axes, configs):
    img = coloured_weave(20, 20, wrule, crule)
    ax.imshow(img, interpolation='nearest', aspect='equal')
    ax.set_title(name, color='white', fontsize=9)
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white', labelsize=6)

plt.suptitle('Coloured Cane Weave Patterns', color='white', fontsize=13, y=1.02)
plt.tight_layout()
plt.savefig('colour_weaves.png', dpi=100, facecolor='#1f2937')
plt.show()

# Colour symmetry check
print("COLOUR SYMMETRY ANALYSIS")
print("=" * 50)
for name, wrule, crule in configs:
    grid = np.array([[wrule(r,c) for c in range(20)] for r in range(20)])
    swapped = 1 - grid  # swap black/white
    # Check if swapped = shifted original
    has_cs = False
    for dr in range(20):
        for dc in range(20):
            shifted = np.roll(np.roll(grid, dr, axis=0), dc, axis=1)
            if np.array_equal(shifted, swapped):
                has_cs = True
                break
        if has_cs: break
    print(f"  {name:30s}: colour symmetry = {'Yes' if has_cs else 'No'}")`,
      challenge: 'Create a three-colour weave using natural, red-dyed, and blue-dyed cane. Can a 3-colour pattern have colour symmetry? Under what conditions?',
      successHint: 'Colour symmetry adds a new dimension to pattern analysis. The weavers of Tripura intuitively use colour symmetry to create patterns that appear complex from simple two-colour schemes.',
    },
    {
      title: 'Fourier analysis of periodic patterns',
      concept: `Every periodic pattern can be decomposed into a sum of **sine waves** of different frequencies — this is **Fourier analysis**.

For a weave pattern (a periodic 2D grid), the 2D Fourier transform reveals:
- **Dominant frequencies**: the repeat distances of the pattern
- **Symmetry**: symmetric patterns have symmetric Fourier transforms
- **Complexity**: more Fourier components = more complex pattern

The Fourier transform of a plain weave shows a single dot (one frequency). A twill shows two dots. A diamond shows four. Complex traditional patterns show many dots.

📚 *We will compute the 2D FFT of weave patterns and visualise their frequency content.*`,
      analogy: 'Fourier analysis is like a prism splitting white light into a rainbow. The white light (pattern) seems uniform, but the prism reveals the hidden colours (frequencies). Each weave pattern has a unique "rainbow" of spatial frequencies.',
      storyConnection: 'Textile engineers use Fourier analysis to verify pattern quality — defects show up as unexpected frequency components. This connects centuries-old weaving craft to modern signal processing.',
      checkQuestion: 'If a plain weave has a 2-unit repeat, what is the fundamental spatial frequency?',
      checkAnswer: 'Frequency = 1/repeat = 1/2 = 0.5 cycles per unit. This means the pattern oscillates once every 2 crossings. Higher harmonics at 1.0, 1.5, etc. are also present (square wave has odd harmonics).',
      codeIntro: 'Compute and visualise the 2D Fourier transform of weave patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def make_weave(n, rule):
    grid = np.array([[rule(r, c) for c in range(n)] for r in range(n)], dtype=float)
    return grid

rules = {
    'Plain': lambda r,c: (r+c)%2,
    'Twill 2/2': lambda r,c: 1 if (r+c)%4<2 else 0,
    'Diamond': lambda r,c: 1 if (abs(r-16)+abs(c-16))%8<4 else 0,
    'Complex': lambda r,c: 1 if ((r*3+c*2)%7<3) else 0,
}

fig, axes = plt.subplots(2, 4, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

for i, (name, rule) in enumerate(rules.items()):
    grid = make_weave(32, rule)
    fft = np.fft.fftshift(np.abs(np.fft.fft2(grid)))

    # Pattern
    axes[0, i].imshow(grid, cmap='YlGn', interpolation='nearest')
    axes[0, i].set_title(f'{name}\n(pattern)', color='white', fontsize=10)

    # FFT
    axes[1, i].imshow(np.log1p(fft), cmap='hot', interpolation='nearest')
    axes[1, i].set_title(f'{name}\n(Fourier)', color='white', fontsize=10)

for ax in axes.flat:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white', labelsize=6)

plt.suptitle('Weave Patterns & Their Fourier Transforms', color='white', fontsize=14)
plt.tight_layout()
plt.savefig('fourier_weaves.png', dpi=100, facecolor='#1f2937')
plt.show()

# Quantify complexity
print("PATTERN COMPLEXITY (Fourier components)")
print("=" * 45)
for name, rule in rules.items():
    grid = make_weave(32, rule)
    fft = np.abs(np.fft.fft2(grid))
    total_energy = np.sum(fft**2)
    # Count significant components (>5% of max)
    threshold = 0.05 * fft.max()
    n_components = np.sum(fft > threshold)
    print(f"  {name:12s}: {n_components:3d} significant frequencies")`,
      challenge: 'Introduce a "defect" (flip a few random cells) in a twill pattern and show how the defect appears in the Fourier transform as new frequency components.',
      successHint: 'Fourier analysis reveals the hidden structure of patterns. Simple weaves have few frequency components; complex traditional patterns have rich spectra — a mathematical measure of artistic complexity.',
    },
    {
      title: 'Structural analysis — weave strength and flexibility',
      concept: `The weave pattern affects the physical properties of the fabric/basket:

- **Plain weave**: most interlocking → stiffest, strongest, least flexible
- **Twill weave**: moderate interlocking → good balance of strength and drape
- **Satin weave**: least interlocking → smoothest, most flexible, weakest

The **float length** (longest run of overs or unders) determines flexibility:
- Short floats → more crimp → stiffer
- Long floats → less crimp → more flexible but weaker

We can compute the average float length directly from the binary pattern.

📚 *We will analyse weave patterns to compute structural properties like float length, interlacing density, and flexibility index.*`,
      analogy: 'A tightly woven basket (plain weave) is stiff like a board. A loosely woven one (satin-like) drapes like cloth. The weave pattern determines whether the product is a rigid container or a flexible fabric.',
      storyConnection: 'Tripura\'s weavers choose patterns based on the intended product: tight plain weaves for storage baskets that must hold weight, looser twills for mats that need flexibility, and decorative satins for items that prioritise beauty over strength.',
      checkQuestion: 'A satin weave has a float length of 5 (the weft goes over 5 warps before going under 1). Is this stronger or weaker than a plain weave float length of 1?',
      checkAnswer: 'Weaker. The long float (5 overs in a row) means the weft is barely held in place — it can slide and pull out. The plain weave (float=1) locks every crossing, making it much stronger but also stiffer.',
      codeIntro: 'Analyse weave patterns to compute structural properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def analyse_weave(grid, name):
    """Compute structural properties of a weave pattern."""
    rows, cols = grid.shape

    # Float length analysis (horizontal)
    floats = []
    for r in range(rows):
        current = grid[r, 0]
        length = 1
        for c in range(1, cols):
            if grid[r, c] == current:
                length += 1
            else:
                floats.append(length)
                current = grid[r, c]
                length = 1
        floats.append(length)

    avg_float = np.mean(floats)
    max_float = max(floats)
    interlacing = np.sum(np.diff(grid, axis=1) != 0) / (rows * (cols - 1))

    # Flexibility index (higher = more flexible)
    flexibility = avg_float / max_float * (1 - interlacing) * 100

    return {
        'avg_float': avg_float,
        'max_float': max_float,
        'interlacing': interlacing * 100,
        'flexibility': flexibility,
        'density': np.mean(grid) * 100,
    }

rules = {
    'Plain':      lambda r,c: (r+c)%2,
    'Twill 2/2':  lambda r,c: 1 if (r+c)%4<2 else 0,
    'Twill 3/1':  lambda r,c: 1 if (r+c)%4<3 else 0,
    'Satin 5':    lambda r,c: 1 if (r*2+c)%5==0 else 0,
    'Basket 2':   lambda r,c: 1 if ((r//2)+(c//2))%2==0 else 0,
    'Long float': lambda r,c: 1 if c%8<6 else 0,
}

results = {}
for name, rule in rules.items():
    grid = np.array([[rule(r,c) for c in range(24)] for r in range(24)], dtype=float)
    results[name] = analyse_weave(grid, name)

print("STRUCTURAL ANALYSIS OF WEAVE PATTERNS")
print("=" * 70)
print(f"{'Pattern':<12} | {'Avg float':>9} | {'Max float':>9} | {'Interlace%':>10} | {'Flex':>5}")
print("-" * 70)
for name, props in results.items():
    print(f"{name:<12} | {props['avg_float']:>9.1f} | {props['max_float']:>9d} | {props['interlacing']:>9.1f}% | {props['flexibility']:>5.1f}")

# Bar chart comparison
fig, axes = plt.subplots(1, 3, figsize=(14, 4))
fig.patch.set_facecolor('#1f2937')
names = list(results.keys())
metrics = ['avg_float', 'interlacing', 'flexibility']
titles = ['Average Float Length', 'Interlacing (%)', 'Flexibility Index']
colors_list = ['#34d399', '#f59e0b', '#60a5fa']

for ax, metric, title, color in zip(axes, metrics, titles, colors_list):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')
    values = [results[n][metric] for n in names]
    ax.barh(names, values, color=color, edgecolor='white', linewidth=0.5)
    ax.set_title(title, color='white', fontsize=11)

plt.tight_layout()
plt.savefig('weave_analysis.png', dpi=100, facecolor='#1f2937')
plt.show()`,
      challenge: 'Add a "strength index" based on the minimum number of continuous threads that must break for the weave to fail. Which pattern is strongest?',
      successHint: 'Structural analysis of weave patterns is real textile engineering. The same principles apply to carbon fibre composites, where weave pattern determines the strength of aircraft wings.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualising Weave Mathematics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
