import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BasketWeaverLevel1() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Patterns in mathematics — order in repetition',
      concept: `The basket weaver's song had a rhythm — a repeating pattern of notes and silences. Mathematics is the study of patterns, and patterns are everywhere:

- **Repeating patterns**: wallpaper, tiled floors, heartbeats (ABCABC...)
- **Growing patterns**: 1, 2, 4, 8, 16... (each term doubles)
- **Symmetry patterns**: butterfly wings, snowflakes, human faces
- **Spatial patterns**: spiral shells, honeycomb hexagons, river meanders

The power of recognizing patterns: once you identify the rule, you can **predict** what comes next. If you see 2, 4, 6, 8, you know the next number is 10 — because you recognized the rule "add 2."

Mathematics doesn't create patterns — it describes the patterns that already exist in nature, art, music, and human culture. The basket weaver knew these patterns intuitively. Mathematics gives them names and formulas.`,
      analogy: 'Patterns are like the grammar of a language. You don\'t need to know the grammar rules to speak — children learn language by hearing patterns. But knowing the rules lets you construct any sentence, even ones you\'ve never heard before. Math is the grammar of patterns.',
      storyConnection: 'The basket weaver\'s song repeated in cycles, and her weaving followed a strict pattern — over, under, over, under. Both the music and the craft are mathematical patterns: the song is a repeating sequence in time, the weave is a repeating sequence in space.',
      checkQuestion: 'What comes next in this pattern: 1, 1, 2, 3, 5, 8, 13, ...?',
      checkAnswer: '21. Each number is the sum of the two before it (8 + 13 = 21). This is the Fibonacci sequence — arguably the most famous pattern in mathematics. It appears in sunflower spirals, pine cones, and shell growth. We\'ll explore it in depth in Level 2.',
      codeIntro: 'Visualize different types of mathematical patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# 1. Repeating pattern
ax = axes[0, 0]
ax.set_facecolor('#111827')
pattern = [1, 3, 2, 1, 3, 2, 1, 3, 2, 1, 3, 2]
colors_p = ['#22c55e', '#3b82f6', '#f59e0b'] * 4
ax.bar(range(len(pattern)), pattern, color=colors_p, alpha=0.8)
ax.set_title('Repeating (ABC ABC...)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 2. Arithmetic sequence
ax = axes[0, 1]
ax.set_facecolor('#111827')
n = np.arange(1, 11)
arith = 3 + 5 * (n - 1)  # a=3, d=5
ax.plot(n, arith, 'o-', color='#22c55e', linewidth=2, markersize=8)
for i, v in enumerate(arith):
    ax.annotate(str(v), (n[i], v), textcoords="offset points", xytext=(0, 10),
                color='#22c55e', fontsize=8, ha='center')
ax.set_title('Arithmetic (+5 each time)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 3. Geometric sequence
ax = axes[0, 2]
ax.set_facecolor('#111827')
geom = 2 ** n
ax.plot(n, geom, 'o-', color='#3b82f6', linewidth=2, markersize=8)
ax.set_title('Geometric (×2 each time)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 4. Wave pattern (sinusoidal)
ax = axes[1, 0]
ax.set_facecolor('#111827')
t = np.linspace(0, 4 * np.pi, 200)
ax.plot(t, np.sin(t), color='#a855f7', linewidth=2)
ax.plot(t, np.sin(2*t) * 0.5, color='#f59e0b', linewidth=1.5, alpha=0.7)
ax.set_title('Wave patterns (sine)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 5. Spiral pattern
ax = axes[1, 1]
ax.set_facecolor('#111827')
theta = np.linspace(0, 6 * np.pi, 500)
r = 0.5 * theta
ax.plot(r * np.cos(theta), r * np.sin(theta), color='#ec4899', linewidth=2)
ax.set_aspect('equal')
ax.set_title('Spiral (r = 0.5θ)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 6. Checkerboard pattern
ax = axes[1, 2]
ax.set_facecolor('#111827')
board = np.zeros((8, 8))
board[1::2, ::2] = 1
board[::2, 1::2] = 1
ax.imshow(board, cmap='RdYlGn', alpha=0.7, extent=[0, 8, 0, 8])
ax.set_title('Spatial (checkerboard)', color='white', fontsize=10)
ax.tick_params(colors='gray')

plt.suptitle('Six Types of Mathematical Patterns', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Pattern types and where they appear:")
print("  Repeating: music rhythms, wallpaper, seasons")
print("  Arithmetic: saving $5/week, staircase heights")
print("  Geometric: population growth, compound interest")
print("  Wave: sound, light, ocean tides")
print("  Spiral: shells, galaxies, hurricanes")
print("  Spatial: honeycombs, crystals, weaving")`,
      challenge: 'Create a Fibonacci pattern: start with [1, 1] and plot the first 15 terms. How does it compare to the geometric sequence? (Hint: the ratio between consecutive Fibonacci numbers approaches a special constant.)',
      successHint: 'Recognizing patterns is the foundational skill of mathematics. Every formula, every theorem, every algorithm started with someone noticing a pattern and asking "why does this repeat?"',
    },
    {
      title: 'Sequences — arithmetic and geometric progressions',
      concept: `A **sequence** is an ordered list of numbers following a rule. The two most important types:

**Arithmetic sequence**: each term differs from the previous by a constant **d** (common difference).
- Formula: aₙ = a₁ + (n-1)d
- Example: 3, 7, 11, 15, 19... (d = 4)
- Sum of n terms: Sₙ = n(a₁ + aₙ)/2

**Geometric sequence**: each term is multiplied by a constant **r** (common ratio).
- Formula: aₙ = a₁ × r^(n-1)
- Example: 2, 6, 18, 54, 162... (r = 3)
- Sum of n terms: Sₙ = a₁(rⁿ - 1)/(r - 1)

The key difference: arithmetic sequences grow by addition (linear growth), geometric sequences grow by multiplication (exponential growth). This is why compound interest (geometric) always beats simple interest (arithmetic) over time.`,
      analogy: 'An arithmetic sequence is like walking up stairs — each step is the same height. A geometric sequence is like a chain reaction — each step doubles (or triples) the previous. Stairs get you upward steadily. Chain reactions get out of control fast. The weaver uses arithmetic patterns (evenly spaced threads) to create the fabric, but the value of her craft grows geometrically with skill.',
      storyConnection: 'The basket weaver\'s threads follow arithmetic spacing — each strand is evenly placed, creating the regular pattern of the weave. But the complexity of the patterns she can create grows geometrically with each new color or technique she adds.',
      checkQuestion: 'A geometric sequence has first term 1 and common ratio 2. What is the sum of the first 20 terms?',
      checkAnswer: 'S₂₀ = 1 × (2²⁰ - 1)/(2 - 1) = 2²⁰ - 1 = 1,048,575. That\'s over a million, from a sequence that starts at 1. This is the power of geometric growth — it starts slow and becomes enormous. It\'s why the legend of putting one grain of rice on the first chess square, two on the second, four on the third... ends with more rice than exists on Earth.',
      codeIntro: 'Visualize and compare arithmetic vs. geometric growth.',
      code: `import numpy as np
import matplotlib.pyplot as plt

n = np.arange(1, 21)

# Arithmetic: a=1, d=3
a1, d = 1, 3
arithmetic = a1 + (n - 1) * d
arith_sum = n * (a1 + arithmetic) / 2

# Geometric: a=1, r=1.5
r = 1.5
geometric = a1 * r ** (n - 1)
geo_sum = a1 * (r**n - 1) / (r - 1)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Terms comparison
ax1.set_facecolor('#111827')
ax1.plot(n, arithmetic, 'o-', color='#22c55e', linewidth=2, markersize=6, label=f'Arithmetic (d={d})')
ax1.plot(n, geometric, 's-', color='#3b82f6', linewidth=2, markersize=6, label=f'Geometric (r={r})')
ax1.set_xlabel('Term number (n)', color='white')
ax1.set_ylabel('Term value', color='white')
ax1.set_title('Term Values: Linear vs Exponential Growth', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Annotate crossover
cross_idx = np.argmax(geometric > arithmetic)
if cross_idx > 0:
    ax1.axvline(n[cross_idx], color='#f59e0b', linestyle=':', alpha=0.5)
    ax1.annotate(f'Crossover at n={n[cross_idx]}', xy=(n[cross_idx], arithmetic[cross_idx]),
                 xytext=(n[cross_idx]+2, arithmetic[cross_idx]+10),
                 color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Cumulative sums
ax2.set_facecolor('#111827')
ax2.fill_between(n, arith_sum, alpha=0.2, color='#22c55e')
ax2.plot(n, arith_sum, color='#22c55e', linewidth=2, label='Arithmetic sum')
ax2.fill_between(n, geo_sum, alpha=0.2, color='#3b82f6')
ax2.plot(n, geo_sum, color='#3b82f6', linewidth=2, label='Geometric sum')
ax2.set_xlabel('Number of terms (n)', color='white')
ax2.set_ylabel('Cumulative sum', color='white')
ax2.set_title('Cumulative Sums: The Gap Widens', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Arithmetic sequence (d=3): 1, 4, 7, 10, 13, 16, ...")
print(f"  Term 20: {arithmetic[-1]:.0f}")
print(f"  Sum of 20 terms: {arith_sum[-1]:.0f}")
print()
print(f"Geometric sequence (r={r}): 1, 1.5, 2.25, 3.375, ...")
print(f"  Term 20: {geometric[-1]:.1f}")
print(f"  Sum of 20 terms: {geo_sum[-1]:.1f}")
print()
print("Geometric growth always overtakes arithmetic growth eventually.")
print("This is why compound interest beats simple interest.")`,
      challenge: 'The rice-and-chessboard problem: a geometric sequence with a₁=1, r=2, for n=64 squares. Calculate the total grains. Compare to global annual rice production (~500 billion kg, ~25 trillion grains).',
      successHint: 'Arithmetic and geometric sequences are the two fundamental growth models. Everything in nature and economics follows one or the other (or a combination). Understanding which one you\'re dealing with is crucial for prediction.',
    },
    {
      title: 'Symmetry types — when shapes stay the same',
      concept: `**Symmetry** means a shape looks the same after a transformation. There are four types of symmetry:

1. **Reflective (mirror) symmetry**: flip across a line and the shape is unchanged. A butterfly has one line of reflective symmetry.

2. **Rotational symmetry**: rotate around a center point and the shape looks the same. A starfish has 5-fold rotational symmetry (72° rotations). A circle has infinite rotational symmetry.

3. **Translational symmetry**: slide (translate) the pattern and it looks the same. Wallpaper, brick walls, woven fabric all have translational symmetry.

4. **Glide reflection**: translate + reflect. Footprints in sand alternate left-right, creating a glide reflection pattern.

Symmetry isn't just beauty — it's information. In physics, symmetries correspond to conservation laws (Noether's theorem). In chemistry, molecular symmetry determines physical properties. In weaving, symmetry determines the pattern.`,
      analogy: 'Symmetry is like a password that unlocks the structure of a pattern. If you know a pattern has 6-fold rotational symmetry, you only need to describe 1/6 of it — the rest is generated by the symmetry. Symmetry is nature\'s data compression algorithm.',
      storyConnection: 'The basket weaver\'s patterns are built from symmetry: the over-under weave has translational symmetry (it repeats), reflective symmetry (flip it and it looks the same), and sometimes rotational symmetry (turn it 90° and the pattern matches). Every traditional textile pattern is a specific combination of symmetry operations.',
      checkQuestion: 'How many lines of symmetry does a regular hexagon have?',
      checkAnswer: 'Six. Three lines connect opposite vertices, three lines connect midpoints of opposite sides. A regular hexagon also has 6-fold rotational symmetry (60° rotations). This is why honeycombs are hexagonal — hexagons tile a plane with the least perimeter for a given area, and all that symmetry makes construction efficient for bees.',
      codeIntro: 'Visualize the four types of symmetry with geometric patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(12, 12))
fig.patch.set_facecolor('#1f2937')

# 1. Reflective symmetry — butterfly wing
ax = axes[0, 0]
ax.set_facecolor('#111827')
t = np.linspace(0, 2*np.pi, 100)
# Right wing
r_right = 3 + 2*np.sin(3*t) + np.sin(t)
x_right = r_right * np.cos(t) * (np.cos(t) > 0).astype(float)
y_right = r_right * np.sin(t) * (np.cos(t) > 0).astype(float)
ax.fill(x_right, y_right, color='#a855f7', alpha=0.4)
ax.fill(-x_right, y_right, color='#a855f7', alpha=0.4)
ax.plot(x_right, y_right, color='#a855f7', linewidth=1.5)
ax.plot(-x_right, y_right, color='#a855f7', linewidth=1.5)
ax.axvline(0, color='#f59e0b', linestyle='--', linewidth=1.5, label='Mirror line')
ax.set_title('Reflective Symmetry', color='white', fontsize=11)
ax.set_aspect('equal')
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Rotational symmetry — 5-fold (starfish)
ax = axes[0, 1]
ax.set_facecolor('#111827')
for k in range(5):
    angle = k * 2 * np.pi / 5
    # Star arm
    arm_x = [0, 0.3*np.cos(angle + 0.3), np.cos(angle), 0.3*np.cos(angle - 0.3), 0]
    arm_y = [0, 0.3*np.sin(angle + 0.3), np.sin(angle), 0.3*np.sin(angle - 0.3), 0]
    ax.fill(arm_x, arm_y, color='#22c55e', alpha=0.5, edgecolor='#22c55e', linewidth=1.5)
for k in range(5):
    angle = k * 2 * np.pi / 5
    ax.annotate(f'{k*72}°', xy=(0.5*np.cos(angle), 0.5*np.sin(angle)),
                color='#f59e0b', fontsize=8, ha='center')
ax.set_title('Rotational Symmetry (5-fold)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# 3. Translational symmetry — weave pattern
ax = axes[1, 0]
ax.set_facecolor('#111827')
for i in range(8):
    for j in range(8):
        color = '#3b82f6' if (i + j) % 2 == 0 else '#f59e0b'
        rect = plt.Rectangle((i, j), 0.9, 0.9, facecolor=color, alpha=0.6)
        ax.add_patch(rect)
# Show translation vector
ax.annotate('', xy=(3, 9.5), xytext=(1, 9.5),
            arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2))
ax.text(2, 9.8, 'Translation vector', color='#ef4444', fontsize=9, ha='center')
ax.set_xlim(-0.5, 8.5)
ax.set_ylim(-0.5, 10.5)
ax.set_title('Translational Symmetry', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# 4. Glide reflection — footprints
ax = axes[1, 1]
ax.set_facecolor('#111827')
for i in range(6):
    x = i * 1.5
    y = 0.4 if i % 2 == 0 else -0.4
    angle = 10 if i % 2 == 0 else -10
    # Simple footprint (ellipse)
    t_ell = np.linspace(0, 2*np.pi, 50)
    fx = x + 0.3*np.cos(t_ell)*np.cos(np.radians(angle)) - 0.6*np.sin(t_ell)*np.sin(np.radians(angle))
    fy = y + 0.3*np.cos(t_ell)*np.sin(np.radians(angle)) + 0.6*np.sin(t_ell)*np.cos(np.radians(angle))
    color = '#ec4899' if i % 2 == 0 else '#06b6d4'
    ax.fill(fx, fy, color=color, alpha=0.5)
ax.axhline(0, color='#f59e0b', linestyle='--', alpha=0.5, label='Glide axis')
ax.set_title('Glide Reflection', color='white', fontsize=11)
ax.set_xlim(-1, 9)
ax.set_ylim(-2, 2)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.suptitle('Four Types of Symmetry', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.show()

print("Symmetry types in the basket weaver's craft:")
print("  Reflective: pattern mirrors across the center stripe")
print("  Rotational: circular basket base has n-fold symmetry")
print("  Translational: repeating pattern along the weave")
print("  Glide reflection: alternating color rows shift by half a unit")`,
      challenge: 'Find the symmetries in the letters of the alphabet. Which letters have reflective symmetry? Rotational? Both? (e.g., "A" has vertical reflection, "S" has 180° rotation, "O" has both.)',
      successHint: 'Symmetry is one of the deepest concepts in all of science. It unifies mathematics, physics, chemistry, biology, and art. The basket weaver applies symmetry intuitively; mathematicians formalize it with group theory (Level 2).',
    },
    {
      title: 'Tessellations — tiling without gaps',
      concept: `A **tessellation** is a pattern of shapes that covers a flat surface with no gaps and no overlaps. Think of a tiled bathroom floor, a honeycomb, or a brick wall.

Rules of tessellation:
- The shapes must fit together perfectly at every vertex
- The angles meeting at each vertex must sum to exactly 360°
- The pattern must extend infinitely (in theory)

Only three regular polygons tessellate on their own:
- **Equilateral triangles** (60° × 6 = 360°)
- **Squares** (90° × 4 = 360°)
- **Regular hexagons** (120° × 3 = 360°)

No other regular polygon works alone (pentagons leave gaps, heptagons overlap). But combinations work: triangles + squares, hexagons + triangles, etc. And irregular shapes can tessellate too — M.C. Escher proved this spectacularly with his famous tessellation art.`,
      analogy: 'Tessellation is like packing a suitcase perfectly — no wasted space. Nature "packs" using tessellations for the same reason: efficiency. Honeycomb hexagons minimize wax for maximum honey storage. Basalt columns form hexagonal tessellations because hexagons minimize cooling stress. The weaver\'s grid is a square tessellation of over-under crossings.',
      storyConnection: 'The basket weaver\'s fabric is a tessellation — the interlocking over-under pattern tiles the surface with no gaps. Different weaving patterns (plain, twill, satin) create different tessellations, each with different structural properties.',
      checkQuestion: 'Why can\'t regular pentagons tessellate? Each interior angle is 108°.',
      checkAnswer: 'Because 360° is not evenly divisible by 108°. Three pentagons at a vertex give 324° (leaving a 36° gap). Four pentagons give 432° (overlapping by 72°). Since no integer number of 108° angles sums to exactly 360°, regular pentagons cannot tile a flat surface. This is why you never see pentagonal floor tiles.',
      codeIntro: 'Generate the three regular tessellations and show why they work.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# 1. Triangle tessellation
ax = axes[0]
ax.set_facecolor('#111827')
colors_t = ['#22c55e', '#3b82f6', '#f59e0b']
h = np.sqrt(3) / 2
for row in range(6):
    for col in range(8):
        x_offset = col + (0.5 if row % 2 else 0)
        y_offset = row * h
        # Upward triangle
        t_up = plt.Polygon([(x_offset, y_offset), (x_offset + 1, y_offset),
                             (x_offset + 0.5, y_offset + h)],
                            facecolor=colors_t[(row + col) % 3], alpha=0.5, edgecolor='white', linewidth=0.5)
        ax.add_patch(t_up)
        # Downward triangle
        t_down = plt.Polygon([(x_offset + 0.5, y_offset + h), (x_offset + 1, y_offset),
                               (x_offset + 1.5, y_offset + h)],
                              facecolor=colors_t[(row + col + 1) % 3], alpha=0.5, edgecolor='white', linewidth=0.5)
        ax.add_patch(t_down)
ax.set_xlim(0, 8)
ax.set_ylim(0, 5)
ax.set_title('Triangles (60° × 6 = 360°)', color='white', fontsize=10)
ax.set_aspect('equal')
ax.axis('off')

# 2. Square tessellation
ax = axes[1]
ax.set_facecolor('#111827')
for i in range(8):
    for j in range(6):
        color = colors_t[(i + j) % 3]
        rect = plt.Rectangle((i, j), 0.98, 0.98, facecolor=color, alpha=0.5, edgecolor='white', linewidth=0.5)
        ax.add_patch(rect)
ax.set_xlim(0, 8)
ax.set_ylim(0, 6)
ax.set_title('Squares (90° × 4 = 360°)', color='white', fontsize=10)
ax.set_aspect('equal')
ax.axis('off')

# 3. Hexagon tessellation
ax = axes[2]
ax.set_facecolor('#111827')
hex_r = 0.55
for row in range(7):
    for col in range(7):
        cx = col * 1.5 * hex_r + (0.75 * hex_r if row % 2 else 0)
        cy = row * np.sqrt(3) * hex_r / 1.15
        angles = np.linspace(0, 2*np.pi, 7)
        hx = cx + hex_r * np.cos(angles)
        hy = cy + hex_r * np.sin(angles)
        color = colors_t[(row + col) % 3]
        hex_patch = plt.Polygon(list(zip(hx, hy)), facecolor=color, alpha=0.5, edgecolor='white', linewidth=0.5)
        ax.add_patch(hex_patch)
ax.set_xlim(0, 6)
ax.set_ylim(0, 5)
ax.set_title('Hexagons (120° × 3 = 360°)', color='white', fontsize=10)
ax.set_aspect('equal')
ax.axis('off')

plt.suptitle('The Three Regular Tessellations', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Why these three and only these three?")
print("  Interior angles must divide evenly into 360°:")
print(f"  Triangle: 60° × 6 = 360° ✓")
print(f"  Square: 90° × 4 = 360° ✓")
print(f"  Hexagon: 120° × 3 = 360° ✓")
print(f"  Pentagon: 108° × ? = 360°? → 3.33... NOT an integer ✗")
print(f"  Heptagon: 128.57° × ? = 360°? → 2.8 NOT an integer ✗")
print()
print("Only 60°, 90°, and 120° divide evenly into 360°.")`,
      challenge: 'Try a semi-regular tessellation: alternate triangles and squares at each vertex. What angle constraint must be satisfied? Draw it.',
      successHint: 'Tessellations connect geometry to materials science, architecture, and nature. The basket weaver\'s plain weave is a square tessellation. Twill weave is a diagonal tessellation. Every fabric pattern is a tessellation.',
    },
    {
      title: 'Weaving as binary — the mathematics of over and under',
      concept: `A woven fabric is fundamentally **binary**: at every crossing point, one thread goes **over** (1) or **under** (0) another thread. This creates a grid of 0s and 1s — a binary matrix.

The simplest weave is **plain weave** (over-under-over-under):
\`\`\`
1 0 1 0 1 0
0 1 0 1 0 1
1 0 1 0 1 0
\`\`\`

**Twill weave** shifts the pattern by one each row:
\`\`\`
1 1 0 1 1 0
0 1 1 0 1 1
1 0 1 1 0 1
\`\`\`

**Satin weave** spreads the crossings far apart:
\`\`\`
1 0 0 0 0
0 0 1 0 0
0 0 0 0 1
0 1 0 0 0
\`\`\`

Each weave pattern has different properties: plain is strongest (most crossings), satin is smoothest (fewest crossings), twill is in between. The basket weaver's choice of pattern is literally a choice of binary matrix.`,
      analogy: 'Weaving is like computer memory. RAM stores data as a grid of 0s and 1s. A woven fabric stores its pattern as a grid of overs and unders. In the early days of computing, **magnetic core memory** was literally woven — tiny magnetic rings threaded onto wires in a grid pattern. Weaving and computing share the same mathematical structure.',
      storyConnection: 'The basket weaver\'s song guided her pattern: each note corresponded to an over or under, creating a binary rhythm. Traditional weavers often used songs or chants to remember complex patterns — essentially an oral encoding of a binary matrix, centuries before computers.',
      checkQuestion: 'In a plain weave, every other crossing is "over." What fraction of the surface shows warp threads vs. weft threads?',
      checkAnswer: 'Exactly 50/50. In plain weave, each thread goes over and under equally, so you see equal amounts of warp (vertical) and weft (horizontal) threads. In a 3/1 twill, 75% of the surface shows one set of threads. This ratio determines the fabric\'s appearance, texture, and drape.',
      codeIntro: 'Visualize the three fundamental weave patterns as binary matrices.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

def draw_weave(ax, pattern, title, warp_color='#3b82f6', weft_color='#f59e0b'):
    rows, cols = pattern.shape
    for i in range(rows):
        for j in range(cols):
            if pattern[i, j] == 1:  # warp on top
                # Draw warp thread (vertical) on top
                rect = plt.Rectangle((j, rows - 1 - i), 0.9, 0.9,
                                     facecolor=warp_color, alpha=0.8, edgecolor='white', linewidth=0.5)
            else:  # weft on top
                rect = plt.Rectangle((j, rows - 1 - i), 0.9, 0.9,
                                     facecolor=weft_color, alpha=0.8, edgecolor='white', linewidth=0.5)
            ax.add_patch(rect)
            # Show binary value
            ax.text(j + 0.45, rows - 1 - i + 0.45, str(pattern[i, j]),
                    ha='center', va='center', color='white', fontsize=8, fontweight='bold')
    ax.set_xlim(-0.1, cols + 0.1)
    ax.set_ylim(-0.1, rows + 0.1)
    ax.set_title(title, color='white', fontsize=11)
    ax.set_aspect('equal')
    ax.tick_params(colors='gray')

# Plain weave (1/1)
plain = np.array([[1,0,1,0,1,0,1,0],
                   [0,1,0,1,0,1,0,1],
                   [1,0,1,0,1,0,1,0],
                   [0,1,0,1,0,1,0,1],
                   [1,0,1,0,1,0,1,0],
                   [0,1,0,1,0,1,0,1],
                   [1,0,1,0,1,0,1,0],
                   [0,1,0,1,0,1,0,1]])

# Twill weave (2/2)
twill = np.array([[1,1,0,0,1,1,0,0],
                   [0,1,1,0,0,1,1,0],
                   [0,0,1,1,0,0,1,1],
                   [1,0,0,1,1,0,0,1],
                   [1,1,0,0,1,1,0,0],
                   [0,1,1,0,0,1,1,0],
                   [0,0,1,1,0,0,1,1],
                   [1,0,0,1,1,0,0,1]])

# Satin weave (5-shaft)
satin = np.zeros((8, 8), dtype=int)
positions = [(0,0),(1,3),(2,1),(3,4),(4,2),(5,5),(6,3),(7,6)]
for r, c in positions:
    satin[r, c % 8] = 1

draw_weave(axes[0], plain, 'Plain Weave (1/1)')
draw_weave(axes[1], twill, 'Twill Weave (2/2)')
draw_weave(axes[2], satin, 'Satin Weave')

plt.suptitle('Weave Patterns as Binary Matrices', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Weave pattern properties:")
print("  Plain (1/1): 50% crossings → strongest, stiffest, roughest")
print("  Twill (2/2): 25% crossings → diagonal lines, good drape")
print("  Satin:       ~12% crossings → smoothest, shiniest, weakest")
print()
print(f"Plain weave 1s: {plain.sum()}/{plain.size} = {plain.mean():.0%}")
print(f"Twill weave 1s: {twill.sum()}/{twill.size} = {twill.mean():.0%}")
print(f"Satin weave 1s: {satin.sum()}/{satin.size} = {satin.mean():.0%}")`,
      challenge: 'Create a 3/1 twill pattern (three overs, one under, shifting by one each row). What percentage of the surface shows warp threads? How would this feel compared to plain weave?',
      successHint: 'The connection between weaving and binary mathematics is deep and historical. Joseph Marie Jacquard\'s 1804 loom used punched cards (binary!) to control complex patterns — directly inspiring Charles Babbage\'s Analytical Engine, the precursor to modern computers.',
    },
    {
      title: 'Fractals in nature — patterns that repeat at every scale',
      concept: `A **fractal** is a pattern that looks similar at every scale. Zoom in on a fractal and you see smaller copies of the same shape. Nature is full of fractals:

- **Fern leaves**: each leaflet is a miniature version of the whole leaf
- **Tree branching**: trunk splits into branches, branches into twigs — same pattern at each level
- **River networks**: tributaries branch like the main river
- **Coastlines**: jagged at every scale, from satellite view to close-up
- **Broccoli** (Romanesco): each floret is a smaller version of the whole head

Fractals have a strange property: their **dimension** isn't a whole number. A fractal curve is "more than 1D" (a line) but "less than 2D" (a surface). The fractal dimension of the British coastline is about 1.25. The Koch snowflake is about 1.26.

The mathematical formula: **D = log(N) / log(S)** where N is the number of self-similar pieces and S is the scaling factor.`,
      analogy: 'A fractal is like a Russian nesting doll (matryoshka) — open one and there\'s a smaller version inside, which contains a smaller version, and so on. But unlike dolls, a fractal never ends. Every weaving tradition creates fractal-like patterns: small motifs combine into larger motifs, which combine into the overall design.',
      storyConnection: 'The basket weaver\'s patterns often have fractal qualities — small diamonds within larger diamonds, or repeating motifs at different scales. Many traditional textile patterns from Northeast India show fractal-like self-similarity, developed over generations of weavers building on each other\'s designs.',
      checkQuestion: 'The Koch snowflake starts as a triangle, then adds a smaller triangle to each side, then adds even smaller triangles to each new side. After infinite iterations, what is its perimeter? What is its area?',
      checkAnswer: 'The perimeter is INFINITE (it increases by 4/3 at each step, forever). But the area is FINITE (it converges to 8/5 of the original triangle\'s area). A fractal can enclose a finite area with an infinite boundary. This mind-bending property is what makes fractals fundamentally different from ordinary geometry.',
      codeIntro: 'Generate and visualize the Koch snowflake fractal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def koch_segment(p1, p2, depth):
    if depth == 0:
        return [p1, p2]
    # Divide segment into thirds
    d = (p2 - p1) / 3
    a = p1
    b = p1 + d
    # Equilateral triangle peak
    angle = np.pi / 3
    c = b + np.array([d[0]*np.cos(angle) - d[1]*np.sin(angle),
                       d[0]*np.sin(angle) + d[1]*np.cos(angle)])
    d_pt = p1 + 2 * d
    e = p2
    # Recursion
    points = koch_segment(a, b, depth-1)[:-1]
    points += koch_segment(b, c, depth-1)[:-1]
    points += koch_segment(c, d_pt, depth-1)[:-1]
    points += koch_segment(d_pt, e, depth-1)
    return points

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Koch snowflake at different iterations
for idx, depth in enumerate(range(6)):
    ax = axes[idx // 3][idx % 3]
    ax.set_facecolor('#111827')

    # Starting triangle
    angles_tri = np.array([np.pi/2, np.pi/2 + 2*np.pi/3, np.pi/2 + 4*np.pi/3])
    vertices = np.column_stack([np.cos(angles_tri), np.sin(angles_tri)])

    all_points = []
    for i in range(3):
        seg = koch_segment(vertices[i], vertices[(i+1) % 3], depth)
        all_points.extend(seg[:-1])
    all_points.append(all_points[0])
    pts = np.array(all_points)

    ax.fill(pts[:, 0], pts[:, 1], color='#3b82f6', alpha=0.3)
    ax.plot(pts[:, 0], pts[:, 1], color='#22c55e', linewidth=0.8 if depth > 3 else 1.5)

    n_segments = 3 * 4**depth
    perimeter = 3 * (4/3)**depth
    ax.set_title(f'Iteration {depth}: {n_segments} segments', color='white', fontsize=10)
    ax.set_aspect('equal')
    ax.axis('off')

plt.suptitle('Koch Snowflake — A Fractal at 6 Iterations', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Koch snowflake properties:")
for d in range(7):
    segments = 3 * 4**d
    perimeter = 3 * (4/3)**d
    print(f"  Iteration {d}: {segments:>6} segments, perimeter = {perimeter:.2f}")
print()
print("Perimeter grows without bound (→ infinity)")
print("Area converges to 8/5 × original triangle area (finite)")
print()
print(f"Fractal dimension: D = log(4)/log(3) = {np.log(4)/np.log(3):.4f}")
print("More than a line (D=1) but less than a surface (D=2)")`,
      challenge: 'Generate a Sierpinski triangle (start with a triangle, remove the center, repeat for each smaller triangle). Calculate its fractal dimension using D = log(N)/log(S) where N=3 self-similar pieces and S=2 scaling factor.',
      successHint: 'Fractals bridge the gap between simple rules and complex patterns. A fractal\'s infinite complexity arises from a simple rule repeated at every scale — just as the basket weaver\'s complex fabric arises from the simple rule of over-under, repeated thousands of times.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Mathematics of Weaving & Patterns — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for pattern and geometry simulations. Click to start.</p>
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}