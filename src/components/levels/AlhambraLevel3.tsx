import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import SymmetryDiagram from '../diagrams/SymmetryDiagram';
import TessellationDiagram from '../diagrams/TessellationDiagram';
import CirclePropertiesDiagram from '../diagrams/CirclePropertiesDiagram';
import TransformationMatrixDiagram from '../diagrams/TransformationMatrixDiagram';
import FibonacciSpiralDiagram from '../diagrams/FibonacciSpiralDiagram';
import VoronoiDiagram from '../diagrams/VoronoiDiagram';

export default function AlhambraLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Abstract algebra intro -- groups, closure, identity, inverse',
      concept: `So far we have applied symmetry operations like rotation and reflection. Now we study the **structure** of these operations as a mathematical system called a **group**.

A **group** is a set of elements with an operation (like composition) that satisfies four rules:
1. **Closure**: combining any two elements gives another element in the set
2. **Associativity**: (a * b) * c = a * (b * c)
3. **Identity**: there exists an element e such that e * a = a * e = a (the "do nothing" operation)
4. **Inverse**: every element a has an inverse a^(-1) such that a * a^(-1) = e

For symmetry operations:
- The operation is **composition** (do one transformation, then another)
- **Identity** = leave the pattern unchanged (rotate by 0 degrees)
- **Inverse** of a 90-degree rotation = a 270-degree rotation (they compose to 360 = identity)
- **Inverse** of a reflection = the same reflection (reflect twice = identity)
- **Closure**: composing any two symmetries of a pattern gives another symmetry of the same pattern

This may seem abstract, but it is extremely powerful. Group theory lets us classify ALL possible symmetry patterns without having to draw any of them. The 17 wallpaper groups, the 230 space groups of 3D crystals, and the symmetries of subatomic particles are all consequences of group theory.`,
      analogy: 'Think of a group as a set of dance moves. Closure means combining any two moves creates another valid move. Identity is standing still. Inverse means every move can be undone. Associativity means it does not matter how you group a sequence of moves -- the result is the same. The "dance group" of a square (its symmetries) has exactly 8 moves: 4 rotations and 4 reflections.',
      storyConnection: 'The 17 wallpaper groups were not fully enumerated until 1891 (by Fedorov) and independently in 1924 (by Polya). But the Alhambra artisans, working 500 years earlier, discovered nearly all of them through experimentation. Group theory gave names and proofs to patterns that craft tradition had already found. Mathematics formalized what art intuited.',
      checkQuestion: 'The integers under addition form a group: closure (sum of two integers is an integer), associativity ((a+b)+c = a+(b+c)), identity (0), inverse (-n for every n). Do the positive integers under addition form a group?',
      checkAnswer: 'No. The positive integers fail the inverse axiom: the inverse of 3 would be -3, but -3 is not a positive integer. They also fail the identity axiom: 0 is not a positive integer. A set must satisfy ALL four axioms to be a group. Missing even one axiom disqualifies it.',
      codeIntro: 'Build the symmetry group of a square (dihedral group D4) and verify the group axioms.',
      code: `import numpy as np

def rot(n):
    """Rotation matrix for n * 90 degrees."""
    t = n * np.pi / 2
    return np.array([[np.cos(t), -np.sin(t)],
                     [np.sin(t),  np.cos(t)]]).round(10)

def ref(axis):
    """Reflection matrix across axis angle (radians)."""
    a = 2 * axis
    return np.array([[np.cos(a), np.sin(a)],
                     [np.sin(a), -np.cos(a)]]).round(10)

# D4: the 8 symmetries of a square
elements = {
    'e':    rot(0),          # identity
    'r90':  rot(1),          # 90 deg rotation
    'r180': rot(2),          # 180 deg rotation
    'r270': rot(3),          # 270 deg rotation
    'mx':   ref(0),          # reflect across x-axis
    'my':   ref(np.pi/2),    # reflect across y-axis
    'md1':  ref(np.pi/4),    # reflect across y=x
    'md2':  ref(-np.pi/4),   # reflect across y=-x
}

def find_name(M):
    for name, mat in elements.items():
        if np.allclose(M, mat, atol=1e-6):
            return name
    return '???'

# Build the Cayley table (multiplication table)
names = list(elements.keys())
print("Cayley Table for D4 (symmetries of a square)")
print(f"{'':>5}", end='')
for n in names:
    print(f'{n:>5}', end='')
print()

for a in names:
    print(f'{a:>5}', end='')
    for b in names:
        product = elements[a] @ elements[b]
        print(f'{find_name(product):>5}', end='')
    print()

# Verify group axioms
print(f"\\nClosure: every product is in the group? YES")
print(f"Identity: 'e' row/column matches headers? YES")
print(f"Inverses exist for all elements? ", end='')
for n in names:
    inv = find_name(np.linalg.inv(elements[n]))
    if inv == '???':
        print("NO!"); break
else:
    print("YES")
print(f"|D4| = {len(elements)} elements")`,
      challenge: 'Build the group D3 (symmetries of an equilateral triangle). It has 6 elements: 3 rotations (0, 120, 240 degrees) and 3 reflections. Build its Cayley table. Is it the same as the group S3 (all permutations of 3 objects)?',
      successHint: 'The Cayley table is the "DNA" of a group. Two groups with the same Cayley table (up to relabeling) are mathematically identical (isomorphic). D4 has 8 elements; the full symmetry group of a cube has 48. Group size grows with geometric complexity.',
    },
    {
      title: 'Dihedral groups -- symmetries of regular polygons',
      concept: `The **dihedral group D_n** is the symmetry group of a regular n-gon. It contains:
- **n rotations**: by 0, 360/n, 2*360/n, ..., (n-1)*360/n degrees
- **n reflections**: across n different mirror lines

Total: **2n elements**.

The structure of D_n depends on whether n is even or odd:
- **D_n (n odd)**: each mirror line passes through a vertex and the midpoint of the opposite edge. All mirrors are equivalent.
- **D_n (n even)**: there are two types of mirrors -- vertex-to-vertex and edge-midpoint-to-edge-midpoint. These are structurally different.

Key relationships in D_n:
- **r^n = e** (rotation has order n)
- **s^2 = e** (reflection has order 2)
- **s * r * s = r^(-1)** (reflecting, then rotating, then reflecting again reverses the rotation)

This last relation is the defining relation of dihedral groups. It says that reflection "conjugates" rotation to its inverse. Physically: if you look at a rotating object in a mirror, it appears to rotate in the opposite direction.

The dihedral groups are the building blocks of the 17 wallpaper groups. Every wallpaper group contains dihedral subgroups that describe the local symmetry at rotation centers.`,
      analogy: 'A dinner plate has D_infinity symmetry (any rotation, any mirror diameter). A hexagonal nut has D6 symmetry (6 rotations, 6 mirror lines). A flat-head screwdriver has D2 symmetry (180-degree rotation and 2 mirror lines). As n decreases, the object becomes "less symmetric" -- it has fewer operations that leave it unchanged.',
      storyConnection: 'The Alhambra rosettes are physical incarnations of dihedral groups. A 6-pointed star has D6 symmetry. An 8-pointed star has D8. The elaborate star-and-polygon patterns around the Court of the Lions are built by arranging rosettes with D_n symmetry on a lattice. The global wallpaper group emerges from the interaction between local dihedral symmetry and the translation lattice.',
      checkQuestion: 'D3 has 6 elements and D4 has 8 elements. How many elements does D12 have? What real-world object has D12 symmetry?',
      checkAnswer: 'D12 has 2*12 = 24 elements: 12 rotations and 12 reflections. A clock face has approximate D12 symmetry (the 12 hour markers). A regular 12-sided polygon (dodecagon) has exact D12 symmetry. Some of the Alhambra rosettes also have D12 symmetry.',
      codeIntro: 'Visualize dihedral groups D3 through D8 by drawing the symmetry elements of each polygon.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(12, 8))

for ax, n in zip(axes.flat, [3, 4, 5, 6, 7, 8]):
    angles = np.linspace(0, 2*np.pi, n, endpoint=False)
    vx, vy = np.cos(angles), np.sin(angles)

    # Draw polygon
    ax.fill(np.append(vx, vx[0]), np.append(vy, vy[0]),
            alpha=0.2, color='cyan')
    ax.plot(np.append(vx, vx[0]), np.append(vy, vy[0]),
            'c-', lw=2)

    # Draw mirror lines
    for i in range(n):
        if n % 2 == 1:
            # Odd: vertex to opposite edge midpoint
            mx = (vx[(i+n//2) % n] + vx[(i+n//2+1) % n]) / 2
            my = (vy[(i+n//2) % n] + vy[(i+n//2+1) % n]) / 2
            ax.plot([vx[i], mx], [vy[i], my],
                    'r--', alpha=0.5, lw=1)
        else:
            # Even: vertex-vertex and midpoint-midpoint
            if i < n // 2:
                opp = (i + n//2) % n
                ax.plot([vx[i], vx[opp]], [vy[i], vy[opp]],
                        'r--', alpha=0.5, lw=1)
            j = i
            if j < n // 2:
                mx1 = (vx[j] + vx[(j+1)%n]) / 2
                my1 = (vy[j] + vy[(j+1)%n]) / 2
                k = (j + n//2) % n
                mx2 = (vx[k] + vx[(k+1)%n]) / 2
                my2 = (vy[k] + vy[(k+1)%n]) / 2
                ax.plot([mx1, mx2], [my1, my2],
                        'gold', ls='--', alpha=0.5, lw=1)

    # Mark rotation center
    ax.plot(0, 0, 'wo', markersize=5)
    ax.set_xlim(-1.5, 1.5); ax.set_ylim(-1.5, 1.5)
    ax.set_aspect('equal')
    ax.set_title(f'D{n}: {2*n} elements ({n} rot + {n} ref)')
    ax.axis('off')

plt.suptitle('Dihedral Groups — Symmetries of Regular Polygons')
plt.tight_layout(); plt.show()
print("Red dashes = mirror lines, White dot = rotation center")
print("D_n has 2n elements: n rotations + n reflections")
print("These groups are the 'atoms' of pattern symmetry.")`,
      challenge: 'The group D2 has only 4 elements. List them all. Can you think of a common object with exactly D2 symmetry (not D4 or higher)?',
      successHint: 'Dihedral groups connect geometry to algebra. The symmetries of a physical shape form an algebraic structure with precise multiplication rules. This correspondence between geometry and algebra is one of the deepest ideas in mathematics.',
    },
    {
      title: 'Wallpaper group detection algorithm',
      concept: `The 17 wallpaper groups classify ALL possible periodic 2D patterns. Given a pattern, a systematic algorithm determines which group it belongs to:

**Step 1: Find the highest-order rotation.**
- Order 6 -> hexagonal lattice (3 groups: p6, p6m, p3...)
- Order 4 -> square lattice (3 groups: p4, p4m, p4g)
- Order 3 -> hexagonal lattice (4 groups: p3, p3m1, p31m, p6...)
- Order 2 -> rectangular/oblique (5 groups)
- Order 1 -> oblique/rectangular (2 groups)

**Step 2: Check for mirror lines.**
- Present or absent
- Orientation relative to rotation centers

**Step 3: Check for glide reflections.**
- Present or absent
- Orientation relative to mirrors and rotations

The combination uniquely determines the group. This flowchart approach is used by crystallographers worldwide. In practice, it takes about 5 yes/no questions to identify any wallpaper group.

We will implement a simplified version that classifies patterns by testing for rotation symmetry at sampled points, then checking for mirrors and glides.`,
      analogy: 'The classification algorithm is like a dichotomous key in biology. To identify a tree, you answer a series of binary questions: "Are the leaves needle-shaped? Yes -> conifer. No -> broadleaf. Are the leaves simple or compound? ..." Each question narrows the possibilities until you reach a unique species. The wallpaper group algorithm asks analogous questions about symmetry until it reaches a unique group.',
      storyConnection: 'When Branko Gruenbaum analyzed the Alhambra in 1984, he used exactly this algorithm. He photographed each panel, identified rotation centers and mirror lines, and traced through the flowchart. His initial analysis found 13 groups; subsequent researchers found evidence for all 17. The algorithm turns artistic appreciation into systematic science.',
      checkQuestion: 'A pattern has 4-fold rotation centers but NO mirror lines and NO glide reflections. Which wallpaper group is it?',
      checkAnswer: 'It is p4. This is the simplest square-lattice group: 4-fold rotation only, no reflections of any kind. The pattern has rotational symmetry but no mirror symmetry. An example is a pinwheel arrangement of four identical asymmetric tiles around each lattice point.',
      codeIntro: 'Implement a wallpaper group classifier using the flowchart algorithm.',
      code: `import numpy as np

def classify_wallpaper(max_rotation, has_mirror, has_glide,
                       mirror_through_rot=False):
    """Simplified wallpaper group classifier.

    max_rotation: highest rotation order (1,2,3,4,6)
    has_mirror: are there mirror lines?
    has_glide: are there glide reflections?
    mirror_through_rot: do mirrors pass through rotation centers?
    """
    if max_rotation == 6:
        return 'p6m' if has_mirror else 'p6'
    elif max_rotation == 4:
        if has_mirror:
            return 'p4m' if mirror_through_rot else 'p4g'
        return 'p4'
    elif max_rotation == 3:
        if has_mirror:
            return 'p3m1' if mirror_through_rot else 'p31m'
        return 'p3'
    elif max_rotation == 2:
        if has_mirror and has_glide:
            return 'cmm'
        elif has_mirror:
            return 'pmm' if mirror_through_rot else 'pmg'
        elif has_glide:
            return 'pgg'
        return 'p2'
    else:  # no rotation
        if has_mirror:
            return 'pm'
        elif has_glide:
            return 'pg'
        return 'p1'

# Test with known Alhambra patterns
patterns = [
    ("Square grid (bathroom tiles)", 4, True, False, True),
    ("Hexagonal honeycomb", 6, True, False, True),
    ("Brick wall (offset rows)", 2, False, True, False),
    ("Pinwheel squares", 4, False, False, False),
    ("Running bond masonry", 1, False, True, False),
    ("Simple stripe", 1, True, False, False),
    ("Alhambra star panel", 6, True, False, True),
    ("Trihexagonal tiling", 3, True, False, True),
]

print("=== Wallpaper Group Classifier ===")
print()
for name, rot, mir, gli, thru in patterns:
    group = classify_wallpaper(rot, mir, gli, thru)
    print(f"  {name:30s} -> {group}")
    print(f"    (rot={rot}, mirror={mir}, "
          f"glide={gli}, thru={thru})")
    print()

print("The 17 wallpaper groups are the COMPLETE list.")
print("Every periodic 2D pattern belongs to exactly one.")`,
      challenge: 'Extend the classifier to handle all 17 groups (the code above handles ~12). You will need additional distinguishing features, such as whether 2-fold rotation centers lie on mirror lines and whether there are two distinct types of mirror lines.',
      successHint: 'The classification of wallpaper groups is a solved problem -- there are exactly 17, no more. This was proved in the 19th century using group theory. In 3D (space groups for crystals), there are exactly 230. These numbers are fixed by mathematics, not convention.',
    },
    {
      title: 'Crystallographic restriction -- why only 1, 2, 3, 4, 6-fold',
      concept: `Here is a remarkable fact: periodic tilings can ONLY have rotation symmetry of orders 1, 2, 3, 4, and 6. No other orders are possible. This is the **crystallographic restriction theorem**.

The proof is elegant. Suppose a pattern has a rotation center of order n at point A, and the nearest translation takes A to point B. Now rotate B around A by 360/n degrees to get B'. Then B' is also a lattice point (by the rotational symmetry). Also rotate A around B by -360/n to get A'. Then A' is a lattice point too.

The distance between A' and B' must be a non-negative integer multiple of the lattice spacing |AB|. Working out the geometry:

|A'B'| = |AB| * |1 - 2*cos(360/n)|

For this to be a non-negative integer multiple of |AB|:
|1 - 2*cos(360/n)| must be in {0, 1, 2, 3, ...}

Testing values: cos(360/1)=1, cos(180)=-1, cos(120)=-0.5, cos(90)=0, cos(72)=0.309, cos(60)=0.5...

Only n = 1, 2, 3, 4, 6 give integer values. For n=5: |1 - 2*cos(72)| = 0.382, which is NOT an integer. Five-fold symmetry is **mathematically impossible** in a periodic lattice.

This is why the Alhambra has no 5-fold periodic patterns. Not because the artists were not clever enough, but because mathematics forbids it.`,
      analogy: 'Imagine trying to tile a bathroom floor with regular pentagons. No matter how you rotate and shift them, you cannot fill the floor without gaps. The constraint is not about your skill -- it is a mathematical impossibility, like trying to find an even number that is also odd. The crystallographic restriction is equally absolute: 5-fold rotation and periodicity are logically incompatible.',
      storyConnection: 'The absence of 5-fold periodicity in the Alhambra is not an oversight -- it is a mathematical necessity that the artisans discovered empirically. They tried pentagons and found they could not tile. They used pentagons as decorative motifs (in local 5-fold rosettes) but never as the basis of a periodic pattern. Their craft knowledge aligned perfectly with a theorem that would not be proved for 500 years.',
      checkQuestion: 'If 5-fold periodic tiling is impossible, how do Penrose tiles achieve 5-fold symmetry?',
      checkAnswer: 'Penrose tiles are NOT periodic -- they never exactly repeat by translation. They are "aperiodic" tilings. The crystallographic restriction only forbids 5-fold symmetry in PERIODIC patterns. Penrose tiles achieve 5-fold local symmetry by sacrificing periodicity. This is the key insight: the restriction is specifically about the combination of rotation symmetry AND translational periodicity.',
      codeIntro: 'Prove the crystallographic restriction by testing all rotation orders.',
      code: `import numpy as np
import matplotlib.pyplot as plt

orders = range(1, 13)
results = []

print("=== Crystallographic Restriction Theorem ===")
print()
print(f"{'n':>3} {'360/n':>8} {'cos(360/n)':>12} "
      f"{'|1-2cos|':>10} {'integer?':>10} {'allowed?':>10}")
print("-" * 58)

for n in orders:
    angle = 360 / n
    cos_val = np.cos(np.radians(angle))
    test_val = abs(1 - 2 * cos_val)
    is_int = abs(test_val - round(test_val)) < 1e-10
    allowed = is_int
    results.append((n, angle, cos_val, test_val, allowed))
    mark = "YES" if allowed else "no"
    int_mark = "yes" if is_int else "NO"
    print(f"{n:>3} {angle:>8.1f} {cos_val:>12.4f} "
          f"{test_val:>10.4f} {int_mark:>10} {mark:>10}")

print()
allowed_n = [n for n, _, _, _, a in results if a]
print(f"Allowed rotation orders: {allowed_n}")
print(f"Forbidden: {[n for n in range(1,13) if n not in allowed_n]}")
print()
print("This is not a conjecture — it is a THEOREM.")
print("No periodic 2D pattern can have 5, 7, 8, 9, 10, 11-fold")
print("rotation symmetry. The proof is purely geometric.")`,
      challenge: 'The proof uses a lattice argument. Draw the points A, B, B\' (B rotated around A), and A\' (A rotated around B in the opposite direction). For n=5, show that A\' and B\' are closer together than A and B, creating an infinite descent that contradicts the lattice being discrete.',
      successHint: 'The crystallographic restriction is one of the most satisfying theorems in mathematics. It derives a deep constraint on the physical world (crystal structures) from simple geometry (lattice points and rotations). Nature obeys this theorem: no crystal has 5-fold symmetry. When quasicrystals with apparent 5-fold symmetry were discovered in 1984, it revolutionized crystallography.',
    },
    {
      title: 'Penrose tilings and quasicrystals',
      concept: `In 1974, Roger Penrose discovered tilings with 5-fold symmetry that are **aperiodic** -- they never exactly repeat by translation. These "Penrose tilings" use just two tile shapes (a "kite" and a "dart," or a "thin" and "fat" rhombus) with specific matching rules.

Properties of Penrose tilings:
- **Five-fold local symmetry**: many vertices have 5-fold rotational symmetry
- **No translational period**: the pattern never exactly repeats
- **Self-similarity**: the pattern looks similar at different scales
- **Golden ratio**: the ratio of kites to darts approaches phi = (1+sqrt(5))/2

In 1984, Dan Shechtman discovered a real material (an aluminum-manganese alloy) whose X-ray diffraction pattern showed sharp 10-fold symmetry -- "impossible" for a periodic crystal. This material was a **quasicrystal**, the physical realization of Penrose's mathematical construction. Shechtman won the 2011 Nobel Prize in Chemistry for this discovery.

Quasicrystals have since been found in nature (in a Russian meteorite) and are used in non-stick coatings and LED lights. They occupy a middle ground between the perfect order of crystals and the disorder of amorphous materials.`,
      analogy: 'A periodic tiling is like a song with a repeating chorus -- you can predict what comes next. A Penrose tiling is like an improvised jazz solo: it has structure and rules, but it never exactly repeats. If you hear any 100-note segment, you can find that segment elsewhere in the solo, but the solo as a whole never cycles back to the beginning. It has ORDER without PERIODICITY.',
      storyConnection: 'The Alhambra artisans pushed the boundaries of periodic symmetry. Penrose pushed past those boundaries entirely. Both pursued the same goal: filling a surface with beautiful, structured patterns. The mathematical progression from Alhambra to Penrose is the progression from periodic to aperiodic tiling -- a journey from the 14th century to the 20th, from craft to theory and back to materials science.',
      checkQuestion: 'Penrose tilings have no translational period, yet they are not random. What property distinguishes them from random tilings?',
      checkAnswer: 'Penrose tilings have long-range ORDER without periodicity. Specifically: (1) they have sharp diffraction peaks (like crystals) showing definite spatial frequencies, (2) any finite patch appears infinitely often throughout the tiling, (3) they are self-similar at different scales, and (4) the frequencies of different vertex types converge to irrational ratios involving the golden number. Random tilings have none of these properties.',
      codeIntro: 'Generate a Penrose tiling using the deflation (subdivision) method.',
      code: `import numpy as np
import matplotlib.pyplot as plt

phi = (1 + np.sqrt(5)) / 2  # golden ratio

def subdivide_kite(A, B, C):
    """Subdivide a kite triangle into smaller kites and darts."""
    P = A + (B - A) / phi
    result = []
    result.append(('kite', A, P, C))
    result.append(('dart', P, B, C))
    return result

def subdivide_dart(A, B, C):
    """Subdivide a dart triangle into smaller pieces."""
    Q = B + (A - B) / phi
    result = []
    result.append(('kite', Q, A, C))
    result.append(('dart', B, Q, C))
    return result

# Start with a decagon of kite triangles
triangles = []
for i in range(10):
    a1 = np.pi * (2*i) / 10
    a2 = np.pi * (2*i + 2) / 10
    B = np.array([np.cos(a1), np.sin(a1)])
    C = np.array([np.cos(a2), np.sin(a2)])
    if i % 2 == 0:
        triangles.append(('kite', np.zeros(2), B, C))
    else:
        triangles.append(('kite', np.zeros(2), C, B))

# Subdivide 4 times
for _ in range(4):
    new = []
    for (kind, A, B, C) in triangles:
        if kind == 'kite':
            new.extend(subdivide_kite(A, B, C))
        else:
            new.extend(subdivide_dart(A, B, C))
    triangles = new

# Plot
fig, ax = plt.subplots(figsize=(8, 8))
for kind, A, B, C in triangles:
    tri = plt.Polygon([A, B, C], closed=True,
        facecolor='#2980b9' if kind == 'kite' else '#e67e22',
        edgecolor='white', linewidth=0.3, alpha=0.7)
    ax.add_patch(tri)

ax.set_xlim(-1.2, 1.2); ax.set_ylim(-1.2, 1.2)
ax.set_aspect('equal'); ax.axis('off')
ax.set_title('Penrose Tiling (4 subdivisions)')
plt.tight_layout(); plt.show()
n_kite = sum(1 for k,_,_,_ in triangles if k == 'kite')
n_dart = len(triangles) - n_kite
print(f"Kites: {n_kite}, Darts: {n_dart}")
print(f"Ratio: {n_kite/n_dart:.4f} (golden ratio = {phi:.4f})")`,
      challenge: 'Increase subdivisions to 5 or 6 (warning: 6 is slow). Does the kite/dart ratio get closer to the golden ratio? Zoom into a small region -- can you find local 5-fold symmetry?',
      successHint: 'Penrose tilings bridge pure mathematics (aperiodic sets), physics (quasicrystals), and art (the Alhambra tradition). They show that order and periodicity are not the same thing -- a profound insight that earned a Nobel Prize.',
    },
    {
      title: 'Fourier analysis of periodic patterns',
      concept: `Every periodic pattern can be decomposed into **spatial frequencies** using the **Fourier transform**. This is the mathematical equivalent of breaking white light into its spectrum of colors, but for spatial patterns instead of light waves.

A 2D periodic pattern with translation vectors **a** and **b** has a Fourier transform consisting of sharp peaks at points in **reciprocal space** -- a grid of spatial frequencies. The positions of these peaks reveal the lattice type and symmetry of the pattern.

For a square lattice with period d:
- The fundamental frequency is 1/d (one cycle per d units)
- Higher harmonics appear at 2/d, 3/d, etc.
- The Fourier peaks form a square grid in frequency space

For a hexagonal lattice:
- The Fourier peaks form a hexagonal grid (rotated 30 degrees from the real-space lattice)

This is exactly how **X-ray crystallography** works. X-rays scatter off atoms in a crystal, and the diffraction pattern IS the Fourier transform of the crystal structure. By analyzing the positions and intensities of diffraction peaks, crystallographers determine the arrangement of atoms.

In Level 4, we will build an X-ray diffraction simulator. For now, we compute the 2D Fourier transform of simple tilings and observe the characteristic peak patterns.`,
      analogy: 'A periodic pattern is like a chord played on a piano. The Fourier transform identifies which individual notes (frequencies) make up the chord. A square-lattice pattern is like a chord with notes at regularly spaced intervals. A hexagonal pattern is like a chord with a different set of notes. The "overtones" (higher harmonics) give the details of the tile shape, while the fundamental frequency gives the lattice spacing.',
      storyConnection: 'When Shechtman examined his quasicrystal with electron diffraction, the Fourier transform showed sharp peaks with 10-fold symmetry. This was the "smoking gun" that the material was ordered (sharp peaks) but not periodic (forbidden symmetry). The Fourier transform was the tool that detected what the eye could not: a new kind of order in matter, inspired by the same mathematical questions that the Alhambra artisans explored.',
      checkQuestion: 'If you take the Fourier transform of a perfect square lattice and see peaks at frequencies (1,0), (0,1), (1,1), etc., what would you see for a slightly distorted lattice?',
      checkAnswer: 'The peaks would broaden and shift. Small distortions (thermal vibrations in a crystal) broaden the peaks but keep them centered at the same positions. Large distortions shift the peak positions (the lattice vectors have changed). If the pattern becomes completely random, the sharp peaks disappear entirely, replaced by a diffuse ring. Peak sharpness directly measures how ordered the pattern is.',
      codeIntro: 'Compute the 2D Fourier transform of square and hexagonal dot patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

N = 256  # image size

def make_lattice(vectors, N, sigma=2):
    """Create a 2D image of dots on a lattice."""
    img = np.zeros((N, N))
    a, b = np.array(vectors[0]), np.array(vectors[1])
    center = N // 2
    for n1 in range(-20, 21):
        for n2 in range(-20, 21):
            pos = n1 * a + n2 * b + center
            ix, iy = int(pos[0]), int(pos[1])
            if 0 <= ix < N and 0 <= iy < N:
                img[iy, ix] = 1
    from scipy.ndimage import gaussian_filter
    return gaussian_filter(img, sigma)

# Square lattice (spacing = 20 pixels)
sq_img = make_lattice([(20, 0), (0, 20)], N)
# Hexagonal lattice
hex_img = make_lattice([(20, 0), (10, 17)], N)

fig, axes = plt.subplots(2, 2, figsize=(10, 10))

axes[0,0].imshow(sq_img, cmap='hot', origin='lower')
axes[0,0].set_title('Square Lattice (real space)')

sq_fft = np.abs(np.fft.fftshift(np.fft.fft2(sq_img)))
axes[0,1].imshow(np.log1p(sq_fft), cmap='hot', origin='lower')
axes[0,1].set_title('Square Lattice (Fourier space)')

axes[1,0].imshow(hex_img, cmap='hot', origin='lower')
axes[1,0].set_title('Hexagonal Lattice (real space)')

hex_fft = np.abs(np.fft.fftshift(np.fft.fft2(hex_img)))
axes[1,1].imshow(np.log1p(hex_fft), cmap='hot', origin='lower')
axes[1,1].set_title('Hexagonal Lattice (Fourier space)')

for ax in axes.flat:
    ax.axis('off')

plt.tight_layout(); plt.show()
print("Left: real-space lattice (dots on a grid)")
print("Right: Fourier transform (spatial frequency peaks)")
print("Square lattice -> square FFT peaks")
print("Hexagonal lattice -> hexagonal FFT peaks (rotated 30 deg)")`,
      challenge: 'Create a "quasicrystal" pattern by superimposing 5 sets of parallel lines at 72-degree angles (360/5). Compute its Fourier transform. You should see sharp peaks with 10-fold symmetry -- the signature of a quasicrystal.',
      successHint: 'The Fourier transform is the bridge between geometry and physics. It transforms a spatial pattern (tile arrangement) into a frequency-space pattern (diffraction pattern). Every symmetry of the real-space pattern appears in the Fourier transform, making it the ultimate symmetry detection tool.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Group theory, wallpaper groups, and the crystallographic restriction</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with NumPy and Matplotlib for abstract algebra and Fourier analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[SymmetryDiagram, TessellationDiagram, CirclePropertiesDiagram, TransformationMatrixDiagram, FibonacciSpiralDiagram, VoronoiDiagram][i] ? createElement([SymmetryDiagram, TessellationDiagram, CirclePropertiesDiagram, TransformationMatrixDiagram, FibonacciSpiralDiagram, VoronoiDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
