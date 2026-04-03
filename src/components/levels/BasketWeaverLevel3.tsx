import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BasketWeaverLevel3() {
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
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
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
      title: 'Plant fiber mechanics — stress-strain curves for natural materials',
      concept: `Basket weaving uses plant fibers — bamboo, cane, jute, palm — each with distinct mechanical properties. Understanding these properties requires the **stress-strain curve**, the fundamental characterization tool for any material.

**Stress** (σ) = Force / Cross-sectional area (Pa or MPa). It normalizes force by size so you can compare a thin fiber to a thick one.
**Strain** (ε) = Change in length / Original length (dimensionless). It measures deformation as a fraction.

The stress-strain curve has distinct regions:
- **Linear elastic region**: stress proportional to strain (Hooke's Law: σ = E × ε). E is Young's modulus — the material's stiffness. Bamboo: E ≈ 15-20 GPa. Jute: E ≈ 10-30 GPa.
- **Yield point**: where permanent deformation begins. Below yield, the fiber springs back. Above, it stays bent.
- **Plastic region**: increasing strain with little additional stress. The fiber is permanently deforming.
- **Failure point**: the fiber breaks. Ultimate tensile strength (UTS) is the maximum stress before failure.

Natural fibers are **viscoelastic** — their behavior depends on loading rate. Pull slowly, they stretch more before breaking (ductile). Pull fast, they snap (brittle). This matters for weaving: the weaver bends fibers slowly to avoid breakage.`,
      analogy: 'A stress-strain test is like gradually pulling on a rubber band while measuring how much force you use and how far it stretches. At first it stretches proportionally (elastic). Then it starts to thin and stretch unevenly (yielding). Then it snaps (failure). The curve records this entire story in one plot.',
      storyConnection: 'The basket weaver in the story selected fibers by feel — bending, pulling, testing flexibility. She was performing intuitive stress-strain testing: fibers that bent without cracking had high yield strain (flexible). Fibers that resisted pulling had high tensile strength (strong). Science formalizes what her hands already knew.',
      checkQuestion: 'Why would a basket weaver prefer a fiber with high yield strain over one with high ultimate tensile strength?',
      checkAnswer: 'Weaving requires bending fibers through tight curves repeatedly. A fiber with high UTS but low yield strain (like dry bamboo) cracks when bent — it is strong but brittle. A fiber with moderate UTS but high yield strain (like fresh cane) bends without cracking. For basketry, flexibility (yield strain) matters more than raw strength (UTS). The best basket fibers combine moderate strength with high flexibility.',
      codeIntro: 'Simulate stress-strain curves for four natural fibers and compare their mechanical properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Fiber material properties ---
fibers = {
    'Bamboo': {
        'youngs_modulus': 18.0,     # GPa
        'yield_stress': 70,          # MPa
        'yield_strain': 0.004,
        'uts': 140,                  # MPa (ultimate tensile strength)
        'failure_strain': 0.025,
        'color': '#22c55e',
    },
    'Cane (rattan)': {
        'youngs_modulus': 8.0,
        'yield_stress': 35,
        'yield_strain': 0.004,
        'uts': 80,
        'failure_strain': 0.06,
        'color': '#f59e0b',
    },
    'Jute': {
        'youngs_modulus': 20.0,
        'yield_stress': 50,
        'yield_strain': 0.0025,
        'uts': 60,
        'failure_strain': 0.018,
        'color': '#3b82f6',
    },
    'Palm leaf': {
        'youngs_modulus': 4.0,
        'yield_stress': 15,
        'yield_strain': 0.004,
        'uts': 25,
        'failure_strain': 0.08,
        'color': '#a855f7',
    },
}

def generate_stress_strain(fiber, n_points=200):
    """Generate a realistic stress-strain curve."""
    E = fiber['youngs_modulus'] * 1000  # Convert GPa to MPa
    sy = fiber['yield_stress']
    ey = fiber['yield_strain']
    uts = fiber['uts']
    ef = fiber['failure_strain']

    strain = np.linspace(0, ef * 1.05, n_points)
    stress = np.zeros_like(strain)

    for i, e in enumerate(strain):
        if e <= ey:
            # Linear elastic
            stress[i] = E * e
        elif e <= ef:
            # Plastic region: power law hardening
            plastic_strain = e - ey
            max_plastic = ef - ey
            fraction = plastic_strain / max_plastic
            stress[i] = sy + (uts - sy) * (fraction ** 0.4)
        else:
            # Failure
            stress[i] = uts * np.exp(-20 * (e - ef))

    # Add noise
    noise = np.random.normal(0, 0.5, n_points) * (stress / uts * 2)
    stress = np.maximum(0, stress + noise)

    return strain, stress

# --- Generate and plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Full stress-strain curves
ax0 = axes[0, 0]
ax0.set_facecolor('#111827')
ax0.tick_params(colors='gray')
for name, props in fibers.items():
    strain, stress = generate_stress_strain(props)
    ax0.plot(strain * 100, stress, color=props['color'], linewidth=2, label=name)
ax0.set_xlabel('Strain (%)', color='white')
ax0.set_ylabel('Stress (MPa)', color='white')
ax0.set_title('Stress-strain curves of natural fibers', color='white', fontsize=11)
ax0.legend(fontsize=9)

# Stiffness comparison (Young's modulus)
ax1 = axes[0, 1]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
names = list(fibers.keys())
E_vals = [fibers[n]['youngs_modulus'] for n in names]
colors = [fibers[n]['color'] for n in names]
ax1.bar(names, E_vals, color=colors)
ax1.set_ylabel("Young's modulus (GPa)", color='white')
ax1.set_title('Stiffness comparison', color='white', fontsize=11)
for label in ax1.get_xticklabels():
    label.set_color('white')
    label.set_fontsize(9)

# Toughness (area under curve)
ax2 = axes[1, 0]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
toughness = []
for name, props in fibers.items():
    strain, stress = generate_stress_strain(props)
    t = np.trapz(stress, strain)  # MPa * strain = MJ/m³
    toughness.append(t)
ax2.bar(names, toughness, color=colors)
ax2.set_ylabel('Toughness (MJ/m³)', color='white')
ax2.set_title('Energy absorption (area under curve)', color='white', fontsize=11)
for label in ax2.get_xticklabels():
    label.set_color('white')
    label.set_fontsize(9)

# Flexibility vs strength scatter
ax3 = axes[1, 1]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
for name, props in fibers.items():
    ax3.scatter(props['failure_strain']*100, props['uts'],
        s=200, c=props['color'], label=name, edgecolors='white', linewidth=0.5, zorder=5)
ax3.set_xlabel('Failure strain (%) — flexibility', color='white')
ax3.set_ylabel('UTS (MPa) — strength', color='white')
ax3.set_title('Strength vs flexibility trade-off', color='white', fontsize=11)
ax3.legend(fontsize=9)
# Ideal basket fiber region
ax3.axvspan(3, 10, alpha=0.1, color='#22c55e')
ax3.text(6, 10, 'Ideal basket\\nfiber zone', color='#22c55e', fontsize=9, ha='center')

plt.tight_layout()
plt.show()

print("Fiber Mechanical Properties:")
print(f"{'Fiber':<15} {'E (GPa)':>8} {'UTS (MPa)':>10} {'Fail strain':>12} {'Toughness':>10}")
print("-" * 58)
for name, props, t in zip(names, [fibers[n] for n in names], toughness):
    print(f"{name:<15} {props['youngs_modulus']:>8.1f} {props['uts']:>10} {props['failure_strain']*100:>10.1f}% {t:>10.2f}")
print(f"\\nBest for baskets: {'Cane (rattan)'} — highest toughness + flexibility")`,
      challenge: 'Add moisture content as a variable: wet bamboo has ~30% lower Young modulus but ~50% higher failure strain. Generate stress-strain curves for dry and wet bamboo side by side. Which is better for basket weaving?',
      successHint: 'You can now characterize and compare natural fiber mechanical properties — the foundation of materials science for traditional crafts.',
    },
    {
      title: 'Weave geometry — modeling over-under patterns mathematically',
      concept: `Every basket weave is a mathematical pattern. The simplest is **plain weave** (over-one-under-one), but traditional baskets use complex patterns like twill (over-two-under-two, offset), herringbone, and hexagonal weaves.

We model weaves as binary matrices. For an m×n weave:
- Matrix entry W[i,j] = 1 if warp fiber i passes OVER weft fiber j at intersection (i,j).
- W[i,j] = 0 if warp passes UNDER.

**Plain weave**: W[i,j] = (i+j) % 2. Checkerboard pattern.
**Twill 2/2**: W[i,j] = ((i+j) % 4 < 2). Diagonal lines emerge.
**Herringbone**: twill that reverses direction periodically.
**Satin**: long floats (many consecutive overs) create a smooth surface.

The weave pattern determines structural properties:
- **Crimp**: how much the fibers bend at each crossing. Plain weave has maximum crimp (tight bends at every intersection). Satin has minimum crimp (long straight runs).
- **Cover factor**: fraction of surface covered. Higher is better for baskets carrying small items.
- **Structural interlocking**: how many crossings per unit area prevent fibers from sliding. Plain weave locks best; satin is loosest.

The **float length** — longest run of consecutive overs — determines drape and stability. Short floats = rigid and stable (baskets). Long floats = flexible and slippery (cloth).`,
      analogy: 'Weave patterns are like spreadsheet formulas applied to a grid. Plain weave is "alternate every cell." Twill is "shift the pattern one cell right on each row." The formula determines the pattern, and the pattern determines the physical properties. A basket weaver composing a new pattern is writing a spatial algorithm.',
      storyConnection: 'The basket weaver in the story created patterns that were both beautiful and functional — different weaves for different purposes. A tight plain weave for rice baskets (no grains fall through). A loose twill for fishing traps (water flows through but fish cannot escape). Each pattern was a design decision with physical consequences.',
      checkQuestion: 'Why does a twill weave produce diagonal lines in the pattern even though each fiber runs straight?',
      checkAnswer: 'In twill, each row shifts the over-under pattern by one position relative to the row above. The "overs" march diagonally across the fabric, creating a visual diagonal line. No fiber is diagonal — they all run straight horizontally or vertically. The diagonal is an emergent optical effect from the systematic offset. This is why twill baskets have a distinctive ribbed appearance that plain weave baskets lack.',
      codeIntro: 'Generate weave pattern matrices for four traditional weaves and analyze their structural properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Weave pattern generators ---
def plain_weave(n):
    """Over-one-under-one."""
    W = np.zeros((n, n), dtype=int)
    for i in range(n):
        for j in range(n):
            W[i, j] = (i + j) % 2
    return W

def twill_weave(n, shift=2):
    """Twill: over-shift-under-shift, offset by 1 each row."""
    W = np.zeros((n, n), dtype=int)
    for i in range(n):
        for j in range(n):
            W[i, j] = 1 if ((i + j) % (2 * shift)) < shift else 0
    return W

def herringbone_weave(n, width=4):
    """Herringbone: twill that reverses direction."""
    W = np.zeros((n, n), dtype=int)
    for i in range(n):
        row_group = (i // width) % 2
        for j in range(n):
            if row_group == 0:
                W[i, j] = 1 if ((i + j) % 4) < 2 else 0
            else:
                W[i, j] = 1 if ((i - j) % 4) < 2 else 0
    return W

def hexagonal_weave(n):
    """Hex weave approximation on rectangular grid."""
    W = np.zeros((n, n), dtype=int)
    for i in range(n):
        for j in range(n):
            phase = (i + 2 * j) % 6
            W[i, j] = 1 if phase < 3 else 0
    return W

def analyze_weave(W, name):
    """Compute structural properties of a weave pattern."""
    n = W.shape[0]

    # Cover factor: fraction of surface showing "over" side
    cover = np.mean(W)

    # Float lengths (consecutive overs in each row and column)
    max_float_warp = 0
    max_float_weft = 0
    for i in range(n):
        run = 0
        for j in range(n):
            if W[i, j] == 1:
                run += 1
                max_float_warp = max(max_float_warp, run)
            else:
                run = 0

    for j in range(n):
        run = 0
        for i in range(n):
            if W[i, j] == 1:
                run += 1
                max_float_weft = max(max_float_weft, run)
            else:
                run = 0

    # Crimp factor: number of transitions (over->under or under->over) per row
    transitions = 0
    for i in range(n):
        for j in range(1, n):
            if W[i, j] != W[i, j-1]:
                transitions += 1
    crimp = transitions / (n * (n - 1))

    # Interlocking: crossings per unit area
    crossings = 0
    for i in range(n - 1):
        for j in range(n - 1):
            if W[i, j] != W[i, j+1]:  # horizontal transition
                crossings += 1
            if W[i, j] != W[i+1, j]:  # vertical transition
                crossings += 1
    interlocking = crossings / (n * n)

    return {
        'name': name,
        'cover_factor': cover,
        'max_float_warp': max_float_warp,
        'max_float_weft': max_float_weft,
        'crimp': crimp,
        'interlocking': interlocking,
    }

# --- Generate patterns ---
n = 20
weaves = {
    'Plain': plain_weave(n),
    'Twill 2/2': twill_weave(n, shift=2),
    'Herringbone': herringbone_weave(n, width=4),
    'Hexagonal': hexagonal_weave(n),
}

# --- Analyze ---
analyses = {}
for name, W in weaves.items():
    analyses[name] = analyze_weave(W, name)

# --- Plot ---
fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')

# Top row: weave patterns
for idx, (name, W) in enumerate(weaves.items()):
    ax = axes[0, idx]
    ax.set_facecolor('#111827')
    ax.imshow(W, cmap='YlGn', aspect='equal', interpolation='nearest')
    ax.set_title(name, color='white', fontsize=11)
    ax.tick_params(colors='gray', labelsize=7)

# Bottom row: properties comparison
props = list(analyses.values())
prop_names = list(weaves.keys())
colors = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7']

# Crimp
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.bar(prop_names, [p['crimp'] for p in props], color=colors)
ax.set_title('Crimp factor', color='white', fontsize=10)
for label in ax.get_xticklabels():
    label.set_color('white'); label.set_fontsize(7); label.set_rotation(30)

# Max float length
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.bar(prop_names, [p['max_float_warp'] for p in props], color=colors)
ax.set_title('Max float length', color='white', fontsize=10)
for label in ax.get_xticklabels():
    label.set_color('white'); label.set_fontsize(7); label.set_rotation(30)

# Interlocking
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.bar(prop_names, [p['interlocking'] for p in props], color=colors)
ax.set_title('Interlocking density', color='white', fontsize=10)
for label in ax.get_xticklabels():
    label.set_color('white'); label.set_fontsize(7); label.set_rotation(30)

# Radar-style comparison (bar groups)
ax = axes[1, 3]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
x = np.arange(3)
width = 0.2
metrics = ['crimp', 'interlocking', 'cover_factor']
metric_labels = ['Crimp', 'Interlock', 'Coverage']
for i, (name, color) in enumerate(zip(prop_names, colors)):
    vals = [analyses[name][m] for m in metrics]
    ax.bar(x + i*width, vals, width, color=color, label=name)
ax.set_xticks(x + width * 1.5)
ax.set_xticklabels(metric_labels, color='white', fontsize=8)
ax.set_title('Combined comparison', color='white', fontsize=10)
ax.legend(fontsize=7)

plt.tight_layout()
plt.show()

print("Weave Analysis Results:")
print(f"{'Weave':<15} {'Cover':>7} {'Crimp':>7} {'Float':>7} {'Interlock':>10}")
print("-" * 50)
for name, a in analyses.items():
    print(f"{name:<15} {a['cover_factor']:>7.2f} {a['crimp']:>7.3f} {a['max_float_warp']:>7} {a['interlocking']:>10.3f}")
print(f"\\nBest for rigid baskets: Plain (highest crimp + interlocking)")
print(f"Best for decorative baskets: Twill/Herringbone (diagonal pattern + moderate stability)")`,
      challenge: 'Create a custom weave pattern: design a 3/1 twill (over-three-under-one) and analyze it. How do its float lengths and interlocking compare to the 2/2 twill? Which would you choose for a basket that needs to be waterproof?',
      successHint: 'You can now generate and analyze weave patterns mathematically — connecting traditional craft knowledge to structural engineering.',
    },
    {
      title: 'Tensile testing simulation — virtual fiber strength measurement',
      concept: `In a real tensile test, you clamp a fiber sample and pull at a controlled rate, recording force and displacement. The test machine costs thousands of dollars, but we can simulate it computationally.

The simulation models:
1. **Fiber heterogeneity**: real fibers are not uniform. They have weak spots (defects) distributed randomly along their length. The fiber breaks at the weakest point.
2. **Weibull distribution**: the standard model for material strength variability. P(failure at stress σ) = 1 - exp(-(σ/σ₀)^m) where σ₀ is the scale parameter (typical strength) and m is the Weibull modulus (shape — higher m means more consistent).
3. **Size effect**: longer fibers are weaker because they have more potential defect sites. This is the "weakest link" principle: a chain breaks at its weakest link, and longer chains have more links.
4. **Loading rate effect**: viscoelastic materials show rate-dependent strength. Faster pulling gives higher apparent strength (less time for creep).

The Weibull modulus m tells you about quality control:
- Natural fibers: m ≈ 2-5 (highly variable — each fiber is different).
- Synthetic fibers: m ≈ 10-30 (consistent — industrial quality control).
- Ceramics: m ≈ 5-15.

For basket weaving, fiber variability matters: the basket is only as strong as its weakest woven fiber. A batch with low Weibull modulus has more weak outliers that cause early failure.`,
      analogy: 'The Weibull distribution models fiber strength the way insurance companies model risk. Most fibers are reasonably strong (most people are healthy), but there is a tail of weak fibers (high-risk individuals). The Weibull modulus tells you how thick that tail is. A high modulus means almost all fibers are similar (low risk pool). A low modulus means wide variation (high risk — some fibers will surprise you by breaking early).',
      storyConnection: 'The basket weaver tested each fiber before weaving — rejecting those that felt weak or had visible flaws. She was performing informal quality control, trimming the left tail of the Weibull distribution by removing the weakest samples. Her finished baskets were stronger than random fibers would predict because of this selection.',
      checkQuestion: 'Why does the "weakest link" principle predict that a basket made from longer fibers is weaker than one made from shorter fibers, even if the fibers come from the same plant?',
      checkAnswer: 'A longer fiber has more defect sites — more chances for a critical flaw. If each centimeter has independent defect probability p, a 10cm fiber survives if all 10 segments survive: (1-p)^10. A 100cm fiber needs all 100 segments intact: (1-p)^100, which is much lower. The basket fails when any one fiber breaks, so longer fibers mean more weak links and earlier failure. This is why weavers cut fibers to optimal lengths.',
      codeIntro: 'Simulate tensile tests with Weibull-distributed defects, observe the size effect, and predict basket failure strength from fiber statistics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Weibull strength simulation ---
def weibull_strength(n_samples, sigma_0, m, length_factor=1.0):
    """Generate fiber strengths from Weibull distribution.
    sigma_0: characteristic strength (MPa)
    m: Weibull modulus (shape parameter)
    length_factor: longer fibers are weaker (size effect)
    """
    # Weibull random variables
    u = np.random.uniform(0, 1, n_samples)
    strengths = sigma_0 * (-np.log(1 - u)) ** (1 / m) / length_factor ** (1 / m)
    return strengths

def simulate_tensile_test(fiber_strength, youngs_modulus, strain_rate=0.001):
    """Simulate a single tensile test, returning stress-strain data."""
    E = youngs_modulus * 1000  # GPa -> MPa
    failure_strain = fiber_strength / E * 1.3  # some plastic deformation
    n_points = 100
    strain = np.linspace(0, failure_strain * 1.1, n_points)
    stress = np.zeros_like(strain)

    for i, e in enumerate(strain):
        if e <= fiber_strength / E:
            stress[i] = E * e
        elif e <= failure_strain:
            stress[i] = fiber_strength * (1 - 0.1 * ((e - fiber_strength/E) / (failure_strain - fiber_strength/E))**2)
        else:
            stress[i] = 0  # broken

    return strain, stress

# --- Compare fiber types ---
fiber_types = {
    'Bamboo (natural)': {'sigma_0': 130, 'm': 3.5, 'E': 18, 'color': '#22c55e'},
    'Cane (natural)': {'sigma_0': 75, 'm': 3.0, 'E': 8, 'color': '#f59e0b'},
    'Jute (natural)': {'sigma_0': 55, 'm': 2.5, 'E': 20, 'color': '#3b82f6'},
    'Nylon (synthetic)': {'sigma_0': 80, 'm': 15, 'E': 3, 'color': '#ef4444'},
}

n_tests = 200

# --- Plot ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Strength distributions
ax0 = axes[0, 0]
for name, props in fiber_types.items():
    strengths = weibull_strength(n_tests, props['sigma_0'], props['m'])
    ax0.hist(strengths, bins=25, alpha=0.5, color=props['color'], label=f"{name} (m={props['m']})")
ax0.set_xlabel('Tensile strength (MPa)', color='white')
ax0.set_ylabel('Count', color='white')
ax0.set_title('Weibull strength distributions', color='white', fontsize=11)
ax0.legend(fontsize=7)

# Sample stress-strain curves (5 tests per fiber)
ax1 = axes[0, 1]
for name, props in list(fiber_types.items())[:2]:
    strengths = weibull_strength(5, props['sigma_0'], props['m'])
    for s in strengths:
        strain, stress = simulate_tensile_test(s, props['E'])
        ax1.plot(strain * 100, stress, color=props['color'], alpha=0.5, linewidth=1)
    ax1.plot([], [], color=props['color'], linewidth=2, label=name)
ax1.set_xlabel('Strain (%)', color='white')
ax1.set_ylabel('Stress (MPa)', color='white')
ax1.set_title('Simulated tensile tests (5 each)', color='white', fontsize=11)
ax1.legend(fontsize=8)

# Size effect: strength vs fiber length
ax2 = axes[0, 2]
lengths = [0.5, 1, 2, 5, 10, 20, 50]
for name, props in list(fiber_types.items())[:2]:
    mean_strengths = []
    for L in lengths:
        s = weibull_strength(500, props['sigma_0'], props['m'], length_factor=L)
        mean_strengths.append(np.mean(s))
    ax2.plot(lengths, mean_strengths, 'o-', color=props['color'], label=name, linewidth=2)
ax2.set_xlabel('Fiber length (relative)', color='white')
ax2.set_ylabel('Mean strength (MPa)', color='white')
ax2.set_title('Size effect (longer = weaker)', color='white', fontsize=11)
ax2.set_xscale('log')
ax2.legend(fontsize=8)

# Weibull probability plot
ax3 = axes[1, 0]
for name, props in fiber_types.items():
    strengths = np.sort(weibull_strength(n_tests, props['sigma_0'], props['m']))
    p = (np.arange(1, n_tests + 1) - 0.5) / n_tests
    # Weibull linearization: ln(-ln(1-p)) vs ln(sigma)
    y = np.log(-np.log(1 - p))
    x = np.log(strengths)
    ax3.plot(x, y, '.', color=props['color'], alpha=0.5, markersize=3, label=name)
ax3.set_xlabel('ln(strength)', color='white')
ax3.set_ylabel('ln(-ln(1-P))', color='white')
ax3.set_title('Weibull probability plots', color='white', fontsize=11)
ax3.legend(fontsize=7)

# Basket strength prediction
ax4 = axes[1, 1]
n_fibers_per_basket = [10, 20, 50, 100, 200]
for name, props in list(fiber_types.items())[:3]:
    basket_strengths = []
    for n_f in n_fibers_per_basket:
        # Basket fails at weakest fiber
        weakest = []
        for _ in range(100):
            batch = weibull_strength(n_f, props['sigma_0'], props['m'])
            weakest.append(np.min(batch))
        basket_strengths.append(np.mean(weakest))
    ax4.plot(n_fibers_per_basket, basket_strengths, 'o-', color=props['color'], label=name, linewidth=2)
ax4.set_xlabel('Fibers per basket', color='white')
ax4.set_ylabel('Expected basket strength (MPa)', color='white')
ax4.set_title('Basket strength vs fiber count', color='white', fontsize=11)
ax4.legend(fontsize=8)

# Reliability
ax5 = axes[1, 2]
target_strength = 30  # MPa — minimum acceptable
for name, props in fiber_types.items():
    strengths = weibull_strength(5000, props['sigma_0'], props['m'])
    reliability = np.mean(strengths > target_strength) * 100
    ax5.bar(name.split('(')[0].strip(), reliability, color=props['color'])
ax5.set_ylabel(f'% fibers above {target_strength} MPa', color='white')
ax5.set_title('Fiber reliability', color='white', fontsize=11)
for label in ax5.get_xticklabels():
    label.set_color('white'); label.set_fontsize(8); label.set_rotation(20)

plt.tight_layout()
plt.show()

print("Fiber Strength Statistics:")
print(f"{'Type':<18} {'Mean':>6} {'Std':>6} {'Min 5%':>7} {'Weibull m':>10}")
print("-" * 50)
for name, props in fiber_types.items():
    s = weibull_strength(1000, props['sigma_0'], props['m'])
    print(f"{name:<18} {np.mean(s):>5.1f} {np.std(s):>5.1f} {np.percentile(s,5):>6.1f} {props['m']:>10.1f}")`,
      challenge: 'Implement a quality control protocol: test 10 fibers from a batch, reject the batch if any fiber is below 20 MPa. Simulate 1000 batches of bamboo and cane. What fraction of each passes? How does increasing the test sample to 20 fibers change the rejection rate?',
      successHint: 'You can now simulate tensile testing with realistic variability and predict how fiber statistics translate to basket strength.',
    },
    {
      title: 'Load distribution in woven structures — finite element analysis lite',
      concept: `When a basket carries weight, the load distributes through the weave. Understanding this distribution explains why some weave patterns fail under loads that others handle easily.

We model a woven structure as a **grid of connected springs**. Each fiber segment between crossings is a spring with stiffness k = EA/L (E = Young's modulus, A = cross-section area, L = segment length). At each crossing, the warp and weft interact through friction.

The equilibrium condition: at every node, forces must balance. This gives a system of linear equations:
  K × u = F
Where K is the stiffness matrix, u is the displacement vector, and F is the applied forces.

Key findings from load analysis:
- **Plain weave** distributes load most evenly — each fiber carries roughly equal share.
- **Twill weave** creates load paths along the diagonal — fibers along the twill line carry more.
- **Basket with handle** concentrates stress at handle attachment points — this is where baskets fail first.
- **Edge effects**: fibers at the basket rim carry more tension than center fibers, especially when the basket sags.

The **stress concentration factor** at a defect (a missing or broken fiber) depends on the weave: plain weave redistributes around a broken fiber efficiently; loose weaves cannot.`,
      analogy: 'Load distribution in a weave is like traffic flow through a city grid. In a well-connected grid (plain weave), blocking one street barely affects traffic — cars reroute easily. In a grid with few cross-streets (loose weave), one blocked street creates a massive jam. The weave pattern determines the network redundancy, and redundancy determines how gracefully the structure handles local failures.',
      storyConnection: 'The basket weaver knew which weave to use for heavy loads (rice) versus light loads (flowers). She was intuitively optimizing load distribution — using tight plain weave for heavy duty (uniform stress) and decorative twill for light duty (appearance over strength). Her craft wisdom was structural engineering without equations.',
      checkQuestion: 'Why does a broken fiber in a plain weave cause less overall weakening than a broken fiber in a satin weave?',
      checkAnswer: 'In plain weave, each fiber intersects every perpendicular fiber, creating many load-transfer points. When one fiber breaks, its load transfers through crossing friction to adjacent fibers at every intersection — distributed over many connections. In satin weave, fibers cross infrequently (long floats). A broken satin fiber has few transfer points, so its load concentrates on fewer neighboring fibers, potentially causing a cascade of failures.',
      codeIntro: 'Build a spring-network model of a woven structure, apply loads, and compute stress distribution across different weave patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Spring network model for woven structures ---
class WovenStructure:
    """Model a woven basket section as a spring network."""

    def __init__(self, n_warp, n_weft, fiber_E, fiber_A, spacing):
        self.nw = n_warp    # number of warp fibers
        self.nf = n_weft    # number of weft fibers
        self.E = fiber_E     # Young's modulus (MPa)
        self.A = fiber_A     # cross-section area (mm²)
        self.L = spacing     # fiber spacing (mm)
        self.k = fiber_E * fiber_A / spacing  # spring stiffness

    def solve_plain_weave(self, applied_force):
        """Solve for fiber tensions in plain weave under uniform load."""
        # In plain weave, each crossing shares load equally
        total_crossings = self.nw * self.nf
        force_per_crossing = applied_force / total_crossings

        # Warp tension: each warp fiber carries force from nf crossings
        warp_tensions = np.full(self.nw, force_per_crossing * self.nf / 2)
        weft_tensions = np.full(self.nf, force_per_crossing * self.nw / 2)

        # Edge fibers carry more (boundary effect)
        warp_tensions[0] *= 1.3
        warp_tensions[-1] *= 1.3
        weft_tensions[0] *= 1.3
        weft_tensions[-1] *= 1.3

        return warp_tensions, weft_tensions

    def solve_twill_weave(self, applied_force):
        """Solve for fiber tensions in twill weave."""
        total_crossings = self.nw * self.nf // 2  # half the crossings of plain
        force_per_crossing = applied_force / total_crossings

        warp_tensions = np.zeros(self.nw)
        weft_tensions = np.zeros(self.nf)

        # Twill creates diagonal load paths
        for i in range(self.nw):
            n_active_crossings = self.nf // 2  # every other crossing is active
            warp_tensions[i] = force_per_crossing * n_active_crossings / 2
            # Diagonal emphasis
            diag_factor = 1.0 + 0.3 * np.sin(np.pi * i / self.nw)
            warp_tensions[i] *= diag_factor

        for j in range(self.nf):
            weft_tensions[j] = force_per_crossing * self.nw // 2 / 2
            diag_factor = 1.0 + 0.3 * np.sin(np.pi * j / self.nf)
            weft_tensions[j] *= diag_factor

        return warp_tensions, weft_tensions

    def simulate_failure(self, tensions, fiber_strengths):
        """Simulate progressive failure: break weakest fiber, redistribute."""
        remaining = np.ones(len(tensions), dtype=bool)
        failure_sequence = []
        load_factor = 1.0

        while remaining.any():
            active_tensions = tensions * load_factor
            active_tensions[~remaining] = 0

            # Find max stressed remaining fiber
            stress_ratios = np.zeros(len(tensions))
            stress_ratios[remaining] = active_tensions[remaining] / fiber_strengths[remaining]

            if np.max(stress_ratios) >= 1.0:
                fail_idx = np.argmax(stress_ratios)
                remaining[fail_idx] = False
                failure_sequence.append({
                    'fiber': fail_idx,
                    'load_factor': load_factor,
                    'remaining': remaining.sum(),
                })
                # Redistribute load to neighbors
                if remaining.any():
                    redistribution = active_tensions[fail_idx] / remaining.sum()
                    tensions[remaining] += redistribution
            else:
                load_factor *= 1.05  # increase load

            if load_factor > 5:
                break

        return failure_sequence

# --- Create structures ---
basket_plain = WovenStructure(n_warp=20, n_weft=20, fiber_E=8000, fiber_A=2.0, spacing=5.0)
basket_twill = WovenStructure(n_warp=20, n_weft=20, fiber_E=8000, fiber_A=2.0, spacing=5.0)

applied_force = 100  # Newtons (about 10 kg)

plain_warp, plain_weft = basket_plain.solve_plain_weave(applied_force)
twill_warp, twill_weft = basket_twill.solve_twill_weave(applied_force)

# Fiber strengths (Weibull distributed)
m = 3.5
sigma_0 = 80
u = np.random.uniform(0, 1, 20)
fiber_strengths = sigma_0 * (-np.log(1 - u)) ** (1/m)

# Simulate failure
plain_failures = basket_plain.simulate_failure(plain_warp.copy(), fiber_strengths.copy())
twill_failures = basket_twill.simulate_failure(twill_warp.copy(), fiber_strengths.copy())

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Tension distribution comparison
ax0 = axes[0, 0]
x = np.arange(20)
ax0.bar(x - 0.2, plain_warp, 0.4, color='#22c55e', label='Plain weave', alpha=0.7)
ax0.bar(x + 0.2, twill_warp, 0.4, color='#f59e0b', label='Twill weave', alpha=0.7)
ax0.set_xlabel('Fiber index', color='white')
ax0.set_ylabel('Tension (N)', color='white')
ax0.set_title('Warp fiber tension distribution', color='white', fontsize=11)
ax0.legend(fontsize=9)

# 2D tension heatmap (plain)
ax1 = axes[0, 1]
tension_grid_plain = np.outer(plain_warp, plain_weft)
tension_grid_plain /= tension_grid_plain.max()
im = ax1.imshow(tension_grid_plain, cmap='hot', aspect='equal')
ax1.set_title('Plain weave — crossing tensions', color='white', fontsize=11)
ax1.set_xlabel('Weft fiber', color='white')
ax1.set_ylabel('Warp fiber', color='white')
plt.colorbar(im, ax=ax1, shrink=0.8, label='Relative tension')

# 2D tension heatmap (twill)
ax2 = axes[1, 0]
tension_grid_twill = np.outer(twill_warp, twill_weft)
tension_grid_twill /= tension_grid_twill.max()
im2 = ax2.imshow(tension_grid_twill, cmap='hot', aspect='equal')
ax2.set_title('Twill weave — crossing tensions (diagonal bias)', color='white', fontsize=11)
ax2.set_xlabel('Weft fiber', color='white')
ax2.set_ylabel('Warp fiber', color='white')
plt.colorbar(im2, ax=ax2, shrink=0.8, label='Relative tension')

# Progressive failure
ax3 = axes[1, 1]
if plain_failures:
    pf_loads = [f['load_factor'] for f in plain_failures]
    pf_remaining = [f['remaining'] for f in plain_failures]
    ax3.plot(range(len(pf_loads)), pf_loads, 'o-', color='#22c55e', label='Plain weave', linewidth=2)
if twill_failures:
    tf_loads = [f['load_factor'] for f in twill_failures]
    ax3.plot(range(len(tf_loads)), tf_loads, 's-', color='#f59e0b', label='Twill weave', linewidth=2)
ax3.set_xlabel('Fiber failures (count)', color='white')
ax3.set_ylabel('Load factor at failure', color='white')
ax3.set_title('Progressive failure sequence', color='white', fontsize=11)
ax3.legend(fontsize=9)

plt.tight_layout()
plt.show()

# Stats
plain_cv = np.std(plain_warp) / np.mean(plain_warp) * 100
twill_cv = np.std(twill_warp) / np.mean(twill_warp) * 100
print(f"Load distribution uniformity (lower CV = more uniform):")
print(f"  Plain weave: CV = {plain_cv:.1f}%")
print(f"  Twill weave: CV = {twill_cv:.1f}%")
print(f"  Plain weave distributes load {twill_cv/plain_cv:.1f}x more uniformly")
print(f"\\nProgressive failure:")
print(f"  Plain: {len(plain_failures)} fibers failed before collapse")
print(f"  Twill: {len(twill_failures)} fibers failed before collapse")`,
      challenge: 'Add a handle attachment: concentrate 50% of the total force at two attachment points (fibers 5 and 15). How does this change the tension distribution? What is the stress concentration factor at the attachment compared to the average?',
      successHint: 'You can now model load distribution and progressive failure in woven structures — connecting weave geometry to structural performance.',
    },
    {
      title: 'Fiber selection optimization — finding the best material for a given basket design',
      concept: `Given a basket design (shape, weave, intended load), which fiber is optimal? This is a **multi-objective optimization** problem because we must balance competing requirements:

- **Strength**: fiber must withstand expected loads without breaking.
- **Flexibility**: fiber must bend through the weave pattern without cracking at crossings.
- **Durability**: fiber must resist environmental degradation (moisture, UV, insects).
- **Weight**: lighter baskets are preferred for carrying long distances.
- **Cost/availability**: locally abundant fibers are preferred.

No single fiber dominates on all criteria. Bamboo is strong but brittle. Cane is flexible but weaker. Jute is cheap but degrades quickly in moisture.

The **Pareto frontier** identifies fiber options where no alternative is better on ALL criteria simultaneously. Any point on the Pareto frontier represents a valid trade-off. The "best" choice depends on the application priority:
- Rice transport basket: prioritize strength and cover factor → bamboo + tight plain weave.
- Fish trap: prioritize flexibility and water resistance → cane + open twill.
- Decorative basket: prioritize appearance and lightness → palm + herringbone.

We formalize this with a **weighted scoring model**: Score = w₁×strength + w₂×flexibility + w₃×durability + w₄×(1/weight) + w₅×availability, where weights reflect the application priorities.`,
      analogy: 'Fiber selection is like choosing a car. A sports car excels at speed but fails at cargo capacity. A truck excels at cargo but fails at fuel efficiency. Neither is "better" — it depends on what you need. The Pareto frontier shows all non-dominated options (cars where nothing else is better at everything), and your priorities (commute vs. hauling) determine which Pareto-optimal choice is best for you.',
      storyConnection: 'The basket weaver did not use one fiber for everything. She matched material to purpose with the precision of an engineer selecting steel grades. Our optimization model formalizes her selection logic: given the basket requirements, which fiber (or fiber combination) delivers the best performance?',
      checkQuestion: 'Why might a Pareto-optimal fiber still be a poor choice for a specific basket application?',
      checkAnswer: 'A fiber on the Pareto frontier is non-dominated overall but may be weak on the most critical dimension for your application. A fiber with excellent strength and appearance but poor water resistance is Pareto-optimal (nothing beats it on both strength AND appearance), but terrible for a fishing basket where water resistance is the top priority. The Pareto frontier shows efficient trade-offs; the application weights determine which trade-off you want.',
      codeIntro: 'Build a multi-objective fiber selection system with Pareto frontier analysis and application-specific scoring.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Fiber database ---
fibers = {
    'Bamboo': {'strength': 0.85, 'flexibility': 0.3, 'durability': 0.7, 'weight': 0.4, 'availability': 0.9, 'color': '#22c55e'},
    'Cane': {'strength': 0.55, 'flexibility': 0.85, 'durability': 0.6, 'weight': 0.6, 'availability': 0.7, 'color': '#f59e0b'},
    'Jute': {'strength': 0.45, 'flexibility': 0.4, 'durability': 0.35, 'weight': 0.7, 'availability': 0.95, 'color': '#3b82f6'},
    'Palm leaf': {'strength': 0.25, 'flexibility': 0.9, 'durability': 0.5, 'weight': 0.85, 'availability': 0.8, 'color': '#a855f7'},
    'Willow': {'strength': 0.5, 'flexibility': 0.75, 'durability': 0.65, 'weight': 0.55, 'availability': 0.5, 'color': '#06b6d4'},
    'Reed': {'strength': 0.35, 'flexibility': 0.7, 'durability': 0.4, 'weight': 0.8, 'availability': 0.85, 'color': '#f472b6'},
    'Banana fiber': {'strength': 0.4, 'flexibility': 0.6, 'durability': 0.3, 'weight': 0.75, 'availability': 0.6, 'color': '#fbbf24'},
    'Grass': {'strength': 0.2, 'flexibility': 0.95, 'durability': 0.25, 'weight': 0.9, 'availability': 0.95, 'color': '#84cc16'},
}

# --- Pareto frontier ---
def is_dominated(a, b):
    """Is fiber a dominated by fiber b? (b is better on ALL criteria)"""
    props_a = [a['strength'], a['flexibility'], a['durability'], 1-a['weight'], a['availability']]
    props_b = [b['strength'], b['flexibility'], b['durability'], 1-b['weight'], b['availability']]
    return all(pb >= pa for pa, pb in zip(props_a, props_b)) and any(pb > pa for pa, pb in zip(props_a, props_b))

def pareto_frontier(fibers_dict):
    """Find Pareto-optimal fibers."""
    names = list(fibers_dict.keys())
    optimal = []
    for i, name_a in enumerate(names):
        dominated = False
        for j, name_b in enumerate(names):
            if i != j and is_dominated(fibers_dict[name_a], fibers_dict[name_b]):
                dominated = True
                break
        if not dominated:
            optimal.append(name_a)
    return optimal

pareto = pareto_frontier(fibers)

# --- Application-specific scoring ---
applications = {
    'Rice basket': {'strength': 0.35, 'flexibility': 0.15, 'durability': 0.25, 'weight': 0.15, 'availability': 0.10},
    'Fish trap': {'strength': 0.15, 'flexibility': 0.30, 'durability': 0.30, 'weight': 0.10, 'availability': 0.15},
    'Decorative': {'strength': 0.10, 'flexibility': 0.25, 'durability': 0.15, 'weight': 0.25, 'availability': 0.25},
    'Fruit picker': {'strength': 0.25, 'flexibility': 0.20, 'durability': 0.15, 'weight': 0.30, 'availability': 0.10},
}

def score_fiber(fiber_props, weights):
    props = [fiber_props['strength'], fiber_props['flexibility'], fiber_props['durability'],
             1 - fiber_props['weight'], fiber_props['availability']]
    w = [weights['strength'], weights['flexibility'], weights['durability'],
         weights['weight'], weights['availability']]
    return sum(p * wt for p, wt in zip(props, w))

app_scores = {}
for app_name, weights in applications.items():
    scores = {name: score_fiber(props, weights) for name, props in fibers.items()}
    best = max(scores, key=scores.get)
    app_scores[app_name] = {'scores': scores, 'best': best}

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Pareto frontier (strength vs flexibility)
ax0 = axes[0, 0]
for name, props in fibers.items():
    marker = '*' if name in pareto else 'o'
    size = 200 if name in pareto else 80
    ax0.scatter(props['flexibility'], props['strength'], s=size, c=props['color'],
                marker=marker, edgecolors='white', linewidth=0.5, zorder=5)
    ax0.annotate(name, (props['flexibility']+0.02, props['strength']+0.02),
                 color='white', fontsize=7)
# Draw Pareto frontier line
pareto_points = [(fibers[n]['flexibility'], fibers[n]['strength']) for n in pareto]
pareto_points.sort()
if len(pareto_points) > 1:
    px, py = zip(*pareto_points)
    ax0.plot(px, py, '--', color='#ef4444', linewidth=1, alpha=0.5, label='Pareto frontier')
ax0.set_xlabel('Flexibility', color='white')
ax0.set_ylabel('Strength', color='white')
ax0.set_title('Pareto frontier (star = non-dominated)', color='white', fontsize=11)
ax0.legend(fontsize=8)

# Radar-style comparison (grouped bars)
ax1 = axes[0, 1]
criteria = ['strength', 'flexibility', 'durability', 'availability']
x = np.arange(len(criteria))
width = 0.1
for i, (name, props) in enumerate(list(fibers.items())[:6]):
    vals = [props[c] for c in criteria]
    ax1.bar(x + i*width, vals, width, color=props['color'], label=name)
ax1.set_xticks(x + width*2.5)
ax1.set_xticklabels(criteria, color='white', fontsize=9)
ax1.set_title('Fiber property comparison', color='white', fontsize=11)
ax1.legend(fontsize=6, ncol=2)

# Application-specific rankings
ax2 = axes[1, 0]
app_names = list(applications.keys())
fiber_names_short = list(fibers.keys())[:5]
app_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
x = np.arange(len(fiber_names_short))
width = 0.18
for i, (app, color) in enumerate(zip(app_names, app_colors)):
    vals = [app_scores[app]['scores'][n] for n in fiber_names_short]
    ax2.bar(x + i*width, vals, width, color=color, label=app)
ax2.set_xticks(x + width*1.5)
ax2.set_xticklabels(fiber_names_short, color='white', fontsize=8, rotation=20)
ax2.set_ylabel('Weighted score', color='white')
ax2.set_title('Application-specific fiber scores', color='white', fontsize=11)
ax2.legend(fontsize=7)

# Best fiber per application
ax3 = axes[1, 1]
ax3.axis('off')
result_text = "OPTIMAL FIBER SELECTION\\n" + "=" * 40 + "\\n\\n"
for app, data in app_scores.items():
    sorted_fibers = sorted(data['scores'].items(), key=lambda x: x[1], reverse=True)
    result_text += f"{app}:\\n"
    for rank, (name, score) in enumerate(sorted_fibers[:3]):
        marker = '>>>' if rank == 0 else '   '
        result_text += f"  {marker} {rank+1}. {name} (score: {score:.3f})\\n"
    result_text += "\\n"

result_text += f"\\nPareto-optimal fibers: {', '.join(pareto)}"
ax3.text(0.05, 0.95, result_text, transform=ax3.transAxes, color='#22c55e',
    fontsize=8.5, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print(f"Pareto-optimal fibers: {pareto}")
for app, data in app_scores.items():
    print(f"\\n{app}: best = {data['best']}")`,
      challenge: 'Add a "hybrid basket" option: combine two fibers (e.g., bamboo warp + cane weft) by averaging their properties with user-specified mix ratios. Can a hybrid outperform any single fiber for the rice basket application?',
      successHint: 'You can now select optimal materials for basket designs using multi-objective optimization — the engineering approach to traditional craft knowledge.',
    },
    {
      title: 'Predictive modeling — building a weave strength predictor from fiber and pattern data',
      concept: `Combining everything: given a fiber type and weave pattern, predict the basket's load-bearing capacity. This is a regression problem where the inputs are material properties and geometric parameters, and the output is predicted strength.

Input features:
- Fiber tensile strength (from Weibull characterization)
- Fiber Young's modulus
- Weave crimp factor
- Weave interlocking density
- Number of fibers (warp + weft)
- Basket geometry (diameter, depth)

Output: Maximum safe load (Newtons)

The model needs to capture interactions: strong fiber + loose weave ≠ strong basket. Tight weave + weak fiber ≠ strong basket. Strength emerges from the combination. A polynomial regression with interaction terms captures this: Strength = β₀ + β₁×UTS + β₂×Interlock + β₃×(UTS×Interlock) + ...

We train on simulated destructive tests (we already have the stress-strain and load distribution models) and validate with cross-validation. The predictor lets a weaver optimize their design before weaving — choosing the fiber-weave combination that meets strength requirements with minimum material.`,
      analogy: 'The strength predictor is like a recipe calculator for baking. You enter ingredients (flour type, sugar amount, baking temperature) and it predicts the cake quality (texture score). No ingredient alone determines quality — it is the combination. Similarly, no single basket parameter determines strength — it is fiber, weave, and geometry working together. The model learns these interactions from data.',
      storyConnection: 'The basket weaver in the story learned fiber-weave combinations through years of trial and error — many broken baskets before mastering the craft. The predictor compresses that lifetime of experience into a model: enter your materials and pattern, get a strength estimate. It does not replace the weaver art, but it prevents the worst mistakes and accelerates the learning process.',
      checkQuestion: 'Why must the regression model include interaction terms (like UTS × Interlock) rather than just linear terms?',
      checkAnswer: 'Without interaction terms, the model assumes fiber strength and weave interlocking contribute independently. But they do not: a 10% increase in fiber strength matters much more in a tight weave (where fibers are well-utilized) than in a loose weave (where fibers slide out before reaching their strength). The interaction term UTS × Interlock captures this synergy. Omitting it systematically mispredicts baskets where one factor is high and the other is low.',
      codeIntro: 'Build a complete weave strength predictor with interaction terms, train/test evaluation, and design optimization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate training data from physics simulation ---
def simulate_basket_strength(uts, E, crimp, interlock, n_fibers, diameter):
    """Physics-based basket strength estimation."""
    # Base strength from fiber properties
    base = uts * n_fibers * 0.01  # efficiency factor

    # Weave efficiency: tight weave utilizes more fiber strength
    weave_eff = 0.3 + 0.7 * interlock * crimp

    # Size effect: larger baskets need more structural support
    size_factor = 1.0 / (1.0 + 0.01 * diameter)

    # Interaction: strong fiber + tight weave = synergy
    synergy = 1.0 + 0.5 * (uts / 100) * interlock

    strength = base * weave_eff * size_factor * synergy

    # Add realistic noise (±15%)
    strength *= np.random.lognormal(0, 0.12)
    return max(0, strength)

# Generate 300 training samples
n_samples = 300
data = {
    'uts': np.random.uniform(20, 150, n_samples),
    'E': np.random.uniform(3, 25, n_samples),
    'crimp': np.random.uniform(0.1, 0.8, n_samples),
    'interlock': np.random.uniform(0.2, 0.9, n_samples),
    'n_fibers': np.random.randint(30, 200, n_samples).astype(float),
    'diameter': np.random.uniform(15, 60, n_samples),
}

y = np.array([simulate_basket_strength(
    data['uts'][i], data['E'][i], data['crimp'][i],
    data['interlock'][i], data['n_fibers'][i], data['diameter'][i]
) for i in range(n_samples)])

# --- Feature engineering ---
def build_features(d):
    """Build feature matrix with interactions."""
    n = len(d['uts'])
    X = np.column_stack([
        np.ones(n),
        d['uts'],
        d['E'],
        d['crimp'],
        d['interlock'],
        d['n_fibers'],
        d['diameter'],
        d['uts'] * d['interlock'],      # key interaction
        d['crimp'] * d['interlock'],    # weave synergy
        d['uts'] * d['n_fibers'],       # fiber-count synergy
        np.log(d['n_fibers'] + 1),      # diminishing returns
        d['diameter']**2,                # nonlinear size effect
    ])
    return X

X = build_features(data)
log_y = np.log(y + 1)

# --- Train/test split ---
idx = np.random.permutation(n_samples)
split = int(0.75 * n_samples)
X_train, X_test = X[idx[:split]], X[idx[split:]]
y_train, y_test = y[idx[:split]], y[idx[split:]]
ly_train, ly_test = log_y[idx[:split]], log_y[idx[split:]]

# --- Ridge regression ---
lam = 0.5
XtX = X_train.T @ X_train + lam * np.eye(X_train.shape[1])
w = np.linalg.solve(XtX, X_train.T @ ly_train)

# Predict
pred_train = np.exp(X_train @ w) - 1
pred_test = np.exp(X_test @ w) - 1

# Metrics
def metrics(y_true, y_pred):
    res = y_true - y_pred
    rmse = np.sqrt(np.mean(res**2))
    mae = np.mean(np.abs(res))
    r2 = 1 - np.sum(res**2) / np.sum((y_true - np.mean(y_true))**2)
    mape = np.mean(np.abs(res / np.maximum(y_true, 1))) * 100
    return {'rmse': rmse, 'mae': mae, 'r2': r2, 'mape': mape}

train_m = metrics(y_train, pred_train)
test_m = metrics(y_test, pred_test)

# --- Feature importance ---
feat_names = ['intercept', 'UTS', 'E', 'crimp', 'interlock', 'n_fibers',
              'diameter', 'UTS×interlock', 'crimp×interlock', 'UTS×n_fibers',
              'log(n_fibers)', 'diameter²']
importance = np.abs(w)

# --- Design optimization: find best fiber-weave combo for a 30cm rice basket ---
best_score = 0
best_config = None
for uts_test in np.linspace(30, 140, 20):
    for interlock_test in np.linspace(0.3, 0.9, 10):
        for n_fib in [50, 80, 120, 160]:
            test_data = {
                'uts': np.array([uts_test]),
                'E': np.array([10.0]),
                'crimp': np.array([0.5]),
                'interlock': np.array([interlock_test]),
                'n_fibers': np.array([float(n_fib)]),
                'diameter': np.array([30.0]),
            }
            X_opt = build_features(test_data)
            pred_strength = np.exp(X_opt @ w)[0] - 1
            # Score: strength per unit cost (cost ~ n_fibers * uts)
            cost = n_fib * uts_test / 100
            efficiency = pred_strength / cost
            if efficiency > best_score:
                best_score = efficiency
                best_config = {'uts': uts_test, 'interlock': interlock_test,
                              'n_fibers': n_fib, 'strength': pred_strength, 'efficiency': efficiency}

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Predicted vs actual
ax0 = axes[0, 0]
ax0.scatter(y_train, pred_train, s=10, c='#22c55e', alpha=0.4, label=f"Train R²={train_m['r2']:.3f}")
ax0.scatter(y_test, pred_test, s=15, c='#f59e0b', alpha=0.6, label=f"Test R²={test_m['r2']:.3f}")
max_val = max(y.max(), pred_test.max())
ax0.plot([0, max_val], [0, max_val], '--', color='white', linewidth=1)
ax0.set_xlabel('True strength (N)', color='white')
ax0.set_ylabel('Predicted strength (N)', color='white')
ax0.set_title('Strength predictor performance', color='white', fontsize=11)
ax0.legend(fontsize=9)

# Feature importance
ax1 = axes[0, 1]
sorted_idx = np.argsort(importance[1:])  # skip intercept
ax1.barh(range(len(feat_names)-1), importance[1:][sorted_idx], color='#3b82f6')
ax1.set_yticks(range(len(feat_names)-1))
ax1.set_yticklabels([feat_names[i+1] for i in sorted_idx], color='white', fontsize=8)
ax1.set_title('Feature importance', color='white', fontsize=11)

# Interaction effect surface
ax2 = axes[1, 0]
uts_range = np.linspace(30, 140, 20)
intlk_range = np.linspace(0.2, 0.9, 20)
UTS_g, INTLK_g = np.meshgrid(uts_range, intlk_range)
strength_surface = np.zeros_like(UTS_g)
for i in range(20):
    for j in range(20):
        td = {'uts': np.array([UTS_g[i,j]]), 'E': np.array([10.0]),
              'crimp': np.array([0.5]), 'interlock': np.array([INTLK_g[i,j]]),
              'n_fibers': np.array([100.0]), 'diameter': np.array([30.0])}
        strength_surface[i,j] = np.exp(build_features(td) @ w)[0] - 1

im = ax2.contourf(uts_range, intlk_range, strength_surface, levels=15, cmap='viridis')
ax2.set_xlabel('Fiber UTS (MPa)', color='white')
ax2.set_ylabel('Weave interlocking', color='white')
ax2.set_title('Predicted strength surface', color='white', fontsize=11)
plt.colorbar(im, ax=ax2, label='Strength (N)')
if best_config:
    ax2.plot(best_config['uts'], best_config['interlock'], '*', color='#ef4444', markersize=15)

# Optimization result
ax3 = axes[1, 1]
ax3.axis('off')
opt_text = f"""DESIGN OPTIMIZATION
{'='*40}
Application: 30cm rice basket

Optimal configuration:
  Fiber UTS:      {best_config['uts']:.0f} MPa
  Weave interlock: {best_config['interlock']:.2f}
  Fiber count:     {best_config['n_fibers']}
  Predicted load:  {best_config['strength']:.0f} N ({best_config['strength']/9.81:.1f} kg)
  Efficiency:      {best_config['efficiency']:.2f} N/cost-unit

Model Performance:
  Train R²: {train_m['r2']:.3f}, RMSE: {train_m['rmse']:.1f} N
  Test  R²: {test_m['r2']:.3f}, RMSE: {test_m['rmse']:.1f} N
  Test MAPE: {test_m['mape']:.1f}%"""

ax3.text(0.05, 0.95, opt_text, transform=ax3.transAxes, color='#22c55e',
    fontsize=9, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print(f"Predictor test R² = {test_m['r2']:.3f}, RMSE = {test_m['rmse']:.1f} N")
print(f"Best design: UTS={best_config['uts']:.0f} MPa, interlock={best_config['interlock']:.2f}, "
      f"strength={best_config['strength']:.0f} N")`,
      challenge: 'Add a constraint: the basket must hold at least 15 kg (147 N) with 95% confidence. Use the model prediction uncertainty to find the minimum fiber count that guarantees this with 95% probability. How does the required fiber count change between bamboo and cane?',
      successHint: 'You have built a complete weave strength predictor that integrates fiber science, weave geometry, and regression modeling. The system connects traditional basket-weaving knowledge to quantitative engineering — predicting what ancient artisans knew intuitively.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (materials science fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for fiber mechanics and weave analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
