import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MagicJapiLevel4() {
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
      title: 'Capstone Design: Pattern Generator Architecture',
      concept: `Our Pattern Generator will be a modular system that takes a **motif** (any closed polygon), a **symmetry group** (one of the 17 wallpaper groups), and a **surface** (flat plane or cone), then produces a complete pattern. The architecture has four layers: (1) Motif Editor — create and edit base shapes, (2) Symmetry Engine — apply group operations to replicate the motif, (3) Surface Mapper — project the flat pattern onto curved surfaces with distortion correction, (4) Renderer — output the final pattern with colors and styling.

The key design decision is the data representation. Each motif is a list of (x, y) vertices forming a closed polygon. Each transformation is a 3x3 affine matrix. A pattern is a list of (motif, transform, color) tuples. The symmetry engine generates the list of transforms from the group rules. The surface mapper modifies the transforms to account for curvature. The renderer iterates through the list and draws each transformed, colored motif.

This architecture separates concerns cleanly: changing the motif does not require changing the symmetry engine. Adding a new wallpaper group does not require modifying the renderer. Mapping to a different surface (sphere, cylinder, cone) only changes the surface mapper. This modularity is the hallmark of well-designed software — each component has a single responsibility and communicates with others through clean interfaces.`,
      analogy: 'The architecture is like a print shop. The motif editor is the artist creating the original design. The symmetry engine is the printing press that stamps copies in a pattern. The surface mapper is the operator who adjusts the press for curved surfaces (like printing on a mug vs flat paper). The renderer is the ink that makes the final visible product. Each person does their job independently.',
      storyConnection: 'The magic Japi in the story has patterns that seem alive — shifting and changing. Our pattern generator will let anyone design their own Japi patterns using the same mathematical principles that traditional weavers use intuitively. The capstone bridges centuries of craft tradition with modern computational geometry.',
      checkQuestion: 'Why is modularity important in the pattern generator architecture? What would go wrong without it?',
      checkAnswer: 'Without modularity, every change would ripple through the entire system. Changing the motif might break the symmetry calculations. Adding a new surface type would require rewriting the renderer. Testing would be difficult because you could not isolate individual components. With modularity, each component can be developed, tested, and modified independently. This is especially important for a pattern generator where users want to experiment freely with different combinations of motif, symmetry, and surface.',
      codeIntro: 'Build the core architecture: motif representation, transformation engine, and basic pattern assembly.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === LAYER 1: MOTIF EDITOR ===
class Motif:
    """A closed polygon motif defined by vertices."""
    def __init__(self, vertices, name="custom"):
        self.vertices = np.array(vertices, dtype=float)
        self.name = name

    @staticmethod
    def star(n_points, outer_r, inner_r):
        angles = np.linspace(0, 2*np.pi, 2*n_points, endpoint=False)
        radii = np.where(np.arange(2*n_points) % 2 == 0, outer_r, inner_r)
        return Motif(np.column_stack([radii*np.cos(angles), radii*np.sin(angles)]), f"star-{n_points}")

    @staticmethod
    def petal(length=0.3, width=0.1, n_pts=40):
        t = np.linspace(0, 2*np.pi, n_pts)
        x = width * np.sin(t) * np.abs(np.cos(t))**0.3
        y = length * np.cos(t) * (1 + 0.3*np.sin(2*t))
        return Motif(np.column_stack([x, y]), "petal")

    @staticmethod
    def diamond(w=0.15, h=0.3):
        return Motif(np.array([[0,h],[w,0],[0,-h],[-w,0]]), "diamond")

# === LAYER 2: SYMMETRY ENGINE ===
class SymmetryEngine:
    """Generate transformation matrices for wallpaper groups."""

    @staticmethod
    def _rot(theta):
        c, s = np.cos(theta), np.sin(theta)
        return np.array([[c,-s,0],[s,c,0],[0,0,1]])

    @staticmethod
    def _trans(tx, ty):
        return np.array([[1,0,tx],[0,1,ty],[0,0,1]])

    @staticmethod
    def _refl(angle):
        c, s = np.cos(2*angle), np.sin(2*angle)
        return np.array([[c,s,0],[s,-c,0],[0,0,1]])

    def generate(self, group, a1, a2, nx, ny):
        """Generate list of 3x3 affine matrices for the given group."""
        transforms = []
        if group == 'p1':
            for i in range(nx):
                for j in range(ny):
                    t = i*np.array(a1) + j*np.array(a2)
                    transforms.append(self._trans(t[0], t[1]))
        elif group == 'p6m':
            a1 = np.array(a1)
            a2 = np.array([a1[0]/2, a1[0]*np.sqrt(3)/2])
            for i in range(-1, nx+1):
                for j in range(-1, ny+1):
                    t = i*a1 + j*a2
                    T = self._trans(t[0], t[1])
                    for k in range(6):
                        R = self._rot(k*np.pi/3)
                        transforms.append(T @ R)
                        transforms.append(T @ self._refl(k*np.pi/6))
        elif group == 'p4m':
            for i in range(nx):
                for j in range(ny):
                    t = i*np.array(a1) + j*np.array(a2)
                    T = self._trans(t[0], t[1])
                    for k in range(4):
                        R = self._rot(k*np.pi/2)
                        transforms.append(T @ R)
                        transforms.append(T @ self._refl(k*np.pi/4))
        elif group == 'p3':
            a1v = np.array(a1)
            a2v = np.array([a1v[0]/2, a1v[0]*np.sqrt(3)/2])
            for i in range(-1, nx+1):
                for j in range(-1, ny+1):
                    t = i*a1v + j*a2v
                    T = self._trans(t[0], t[1])
                    for k in range(3):
                        transforms.append(T @ self._rot(k*2*np.pi/3))
        return transforms

# === LAYER 3: PATTERN ASSEMBLY ===
class Pattern:
    """Assembled pattern: motif + transforms + colors."""
    def __init__(self, motif, transforms, palette):
        self.motif = motif
        self.transforms = transforms
        self.palette = palette

    def render(self, ax, clip_rect=None):
        """Render pattern onto a matplotlib axes."""
        for i, T in enumerate(self.transforms):
            pts = np.column_stack([self.motif.vertices, np.ones(len(self.motif.vertices))])
            transformed = (T @ pts.T).T[:, :2]
            if clip_rect:
                cx = transformed[:, 0].mean()
                cy = transformed[:, 1].mean()
                if not (clip_rect[0] <= cx <= clip_rect[2] and clip_rect[1] <= cy <= clip_rect[3]):
                    continue
            color = self.palette[i % len(self.palette)]
            ax.fill(transformed[:, 0], transformed[:, 1], color=color, alpha=0.5,
                    edgecolor='white', linewidth=0.3)

# === DEMO ===
engine = SymmetryEngine()
motifs = [Motif.star(6, 0.15, 0.07), Motif.petal(), Motif.diamond()]
groups = ['p1', 'p4m', 'p6m']
palettes = [
    ['#3b82f6', '#22c55e', '#f59e0b'],
    ['#ef4444', '#a855f7', '#06b6d4', '#f59e0b'],
    ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7', '#06b6d4'],
]

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Pattern Generator: Motif + Symmetry = Pattern',
             color='white', fontsize=14, fontweight='bold')

for col, (motif, group, palette) in enumerate(zip(motifs, groups, palettes)):
    # Show motif
    ax = axes[0, col]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.fill(motif.vertices[:, 0], motif.vertices[:, 1], color=palette[0], alpha=0.7,
            edgecolor='white', linewidth=2)
    ax.set_title(f'Motif: {motif.name}', color='white', fontsize=10)
    ax.set_xlim(-0.5, 0.5); ax.set_ylim(-0.5, 0.5); ax.set_aspect('equal')

    # Show pattern
    ax = axes[1, col]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    transforms = engine.generate(group, (0.5, 0), (0, 0.5), 8, 8)
    pattern = Pattern(motif, transforms, palette)
    pattern.render(ax, clip_rect=(0, 0, 3, 3))
    ax.set_xlim(0, 3); ax.set_ylim(0, 3); ax.set_aspect('equal')
    ax.set_title(f'Group: {group} ({len(transforms)} copies)', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Pattern Generator Architecture")
print("=" * 50)
print("Layer 1: Motif Editor — create base shapes")
print("  Built-in: star, petal, diamond, custom polygon")
print("Layer 2: Symmetry Engine — generate transforms")
print("  Groups: p1, p3, p4m, p6m (expandable)")
print("Layer 3: Pattern Assembly — combine motif + transforms")
print("Layer 4: Renderer — draw with colors and clipping")
print()
for group in groups:
    ts = engine.generate(group, (0.5, 0), (0, 0.5), 8, 8)
    print(f"  {group}: {len(ts)} transforms for 8x8 grid")`,
      challenge: 'Add two more wallpaper groups to the SymmetryEngine: pg (glide reflection) and cmm (centered rectangular with mirrors). Verify each generates the correct number of copies per unit cell by comparing to the theoretical count.',
      successHint: 'The modular architecture means we can extend the pattern generator indefinitely — new motifs, new symmetry groups, new surfaces — without rewriting existing code. This is the power of good software design applied to mathematical art.',
    },
    {
      title: 'Motif Design & Parameterization',
      concept: `A versatile pattern generator needs motifs that are both visually appealing and mathematically tractable. We will build a **parametric motif library** where each motif is defined by a small number of parameters that control its shape. This allows users to explore a continuous space of designs by adjusting sliders, rather than being limited to a fixed set of shapes.

We use two approaches. **Polar curves** define motifs as r(theta) — the radius as a function of angle. A circle is r = constant. A rose curve is r = cos(n*theta). A limaçon is r = a + b*cos(theta). By combining these with Fourier harmonics, we can generate an enormous variety of organic, flower-like shapes with just 4-6 parameters. **Bézier curves** use control points to define smooth curves that can represent any shape. A cubic Bézier between endpoints P0 and P3 with control points P1, P2 is: B(t) = (1-t)^3*P0 + 3*(1-t)^2*t*P1 + 3*(1-t)*t^2*P2 + t^3*P3. Moving the control points reshapes the curve smoothly.

The key insight is that traditional Assamese motifs — lotus flowers, peacocks, elephants, geometric interlocks — can be approximated surprisingly well by low-parameter polar curves or short sequences of Bézier curves. This parametric representation enables both human exploration (adjusting parameters to taste) and algorithmic optimization (searching for motifs that satisfy aesthetic criteria).`,
      analogy: 'Parametric motifs are like a customizable recipe. A fixed recipe says "add 2 cups flour." A parametric recipe says "add X cups flour, where X controls how thick the bread is." By changing X from 1 to 3, you get everything from flatbread to a dense loaf. Our motif parameters are like recipe dials — each one controls an aspect of the shape, and turning them generates a continuous range of designs.',
      storyConnection: 'The Japi weaver does not work from a fixed catalog — she adjusts motifs by intuition, making each hat unique. Our parametric motif system captures this creative freedom mathematically. A "petal width" parameter is like the weaver deciding how wide to make each leaf. A "symmetry order" parameter is like choosing between a 6-petal and 8-petal flower.',
      checkQuestion: 'A rose curve r = cos(n*theta) has n petals when n is odd and 2n petals when n is even. How many petals does r = cos(5*theta) have? What about r = cos(4*theta)? Why the difference?',
      checkAnswer: 'r = cos(5*theta) has 5 petals (odd n). r = cos(4*theta) has 8 petals (even n). The difference: for odd n, the curve traces each petal once during theta in [0, pi]. For even n, the curve traces each petal once during theta in [0, 2*pi], but the negative values of cos(n*theta) create additional petals in the opposite direction. So even n effectively doubles the count.',
      codeIntro: 'Build a parametric motif library with polar curves, Bézier paths, and Fourier-based shapes, then demonstrate parameter sweeps.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class ParametricMotif:
    """Generate motifs from mathematical curves."""

    @staticmethod
    def rose(n_petals=6, amplitude=0.3, inner_r=0.05, n_pts=200):
        theta = np.linspace(0, 2*np.pi, n_pts)
        if n_petals % 2 == 0:
            r = inner_r + amplitude * np.abs(np.cos(n_petals/2 * theta))
        else:
            r = inner_r + amplitude * np.abs(np.cos(n_petals * theta))
        return np.column_stack([r*np.cos(theta), r*np.sin(theta)])

    @staticmethod
    def fourier_flower(harmonics=[1, 3, 5], amps=[0.3, 0.1, 0.05],
                       phases=[0, 0, 0], n_pts=200):
        theta = np.linspace(0, 2*np.pi, n_pts)
        r = 0.05  # base radius
        for h, a, p in zip(harmonics, amps, phases):
            r = r + a * np.cos(h * theta + p)
        r = np.maximum(r, 0.01)
        return np.column_stack([r*np.cos(theta), r*np.sin(theta)])

    @staticmethod
    def superellipse(a=0.3, b=0.2, n=2.5, n_pts=200):
        """n=2 is ellipse, n<2 is star-like, n>2 is rounded rectangle."""
        theta = np.linspace(0, 2*np.pi, n_pts)
        x = a * np.sign(np.cos(theta)) * np.abs(np.cos(theta))**(2/n)
        y = b * np.sign(np.sin(theta)) * np.abs(np.sin(theta))**(2/n)
        return np.column_stack([x, y])

    @staticmethod
    def bezier_curve(control_points, n_pts=50):
        """Cubic Bézier curve through control points."""
        P = np.array(control_points)
        n = len(P) - 1
        t = np.linspace(0, 1, n_pts)
        curve = np.zeros((n_pts, 2))
        for i, pi in enumerate(P):
            # Bernstein polynomial
            binom = np.math.factorial(n) / (np.math.factorial(i) * np.math.factorial(n-i))
            basis = binom * t**i * (1-t)**(n-i)
            curve += np.outer(basis, pi)
        return curve

    @staticmethod
    def spiral_motif(turns=2, growth=0.1, n_pts=200):
        theta = np.linspace(0, turns*2*np.pi, n_pts)
        r = growth * theta
        # Make it a closed shape by mirroring
        x = np.concatenate([r*np.cos(theta), (r*0.8)*np.cos(theta[::-1])])
        y = np.concatenate([r*np.sin(theta), (r*0.8)*np.sin(theta[::-1])])
        return np.column_stack([x, y])

pm = ParametricMotif()

fig, axes = plt.subplots(3, 4, figsize=(15, 11))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Parametric Motif Library: Infinite Design Space',
             color='white', fontsize=14, fontweight='bold')

# Row 1: Rose curves with varying petals
for i, n in enumerate([3, 5, 8, 12]):
    ax = axes[0, i]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    pts = pm.rose(n_petals=n, amplitude=0.25)
    ax.fill(pts[:, 0], pts[:, 1], color='#f59e0b', alpha=0.6, edgecolor='#f59e0b')
    ax.set_title(f'Rose: {n} petals', color='white', fontsize=9)
    ax.set_xlim(-0.4, 0.4); ax.set_ylim(-0.4, 0.4); ax.set_aspect('equal')

# Row 2: Fourier flowers with varying complexity
configs = [
    ([1, 3], [0.2, 0.1], [0, 0]),
    ([1, 5, 7], [0.2, 0.08, 0.04], [0, 0.5, 0]),
    ([2, 6, 10], [0.15, 0.1, 0.05], [0, 0, 0.3]),
    ([3, 5, 7, 11], [0.15, 0.1, 0.06, 0.03], [0, 0.5, 1.0, 0]),
]
colors_f = ['#3b82f6', '#22c55e', '#a855f7', '#ef4444']
for i, ((h, a, p), col) in enumerate(zip(configs, colors_f)):
    ax = axes[1, i]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    pts = pm.fourier_flower(h, a, p)
    ax.fill(pts[:, 0], pts[:, 1], color=col, alpha=0.6, edgecolor=col)
    ax.set_title(f'Fourier: harmonics {h}', color='white', fontsize=9)
    ax.set_xlim(-0.5, 0.5); ax.set_ylim(-0.5, 0.5); ax.set_aspect('equal')

# Row 3: Superellipses and Bézier
for i, n_exp in enumerate([0.5, 1.0, 2.0, 4.0]):
    ax = axes[2, i]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    if i < 3:
        pts = pm.superellipse(n=n_exp)
        ax.fill(pts[:, 0], pts[:, 1], color='#06b6d4', alpha=0.6, edgecolor='#06b6d4')
        ax.set_title(f'Superellipse: n={n_exp}', color='white', fontsize=9)
    else:
        # Bézier petal
        ctrl = [[0, 0], [0.1, 0.3], [-0.1, 0.3], [0, 0.4],
                [0.1, 0.3], [-0.1, 0.3], [0, 0]]
        pts = pm.bezier_curve(ctrl, 100)
        ax.fill(pts[:, 0], pts[:, 1], color='#f59e0b', alpha=0.6, edgecolor='#f59e0b')
        ax.set_title('Bézier petal', color='white', fontsize=9)
    ax.set_xlim(-0.5, 0.5); ax.set_ylim(-0.5, 0.5); ax.set_aspect('equal')

plt.tight_layout()
plt.show()

print("Parametric Motif Library")
print("=" * 50)
print("Available motif types:")
print("  Rose curve:      n_petals, amplitude, inner_r")
print("  Fourier flower:  harmonics[], amps[], phases[]")
print("  Superellipse:    a, b, n (exponent)")
print("  Bézier curve:    control_points[]")
print("  Spiral:          turns, growth_rate")
print()
print("Total parameter space is continuous and high-dimensional.")
print("Each parameter adjustment creates a unique motif.")`,
      challenge: 'Create a "motif morph" function that smoothly interpolates between two motifs by linearly interpolating their vertices (after ensuring both have the same number of points). Animate the morph as a sequence of frames showing the gradual transformation from a star to a petal to a diamond.',
      successHint: 'Parametric motifs give the pattern generator infinite creative range. By mapping cultural motifs to mathematical parameters, we preserve the essence of traditional design while enabling computational exploration and optimization.',
    },
    {
      title: 'Color Theory & Palette Generation',
      concept: `Color transforms a geometric pattern from a mathematical diagram into a visual experience. The choice of palette determines whether a pattern feels warm or cool, vibrant or subdued, traditional or modern. Color theory for pattern design operates in **perceptual color spaces** — spaces where equal numerical distances correspond to equal perceived color differences.

The most useful perceptual space is **CIELAB** (L*a*b*), where L* is lightness (0=black, 100=white), a* is green-red (-128 to +127), and b* is blue-yellow (-128 to +127). In CIELAB, a "distance" of 1 unit is roughly the smallest color difference a trained observer can see (called 1 **deltaE**). This makes it ideal for palette generation: colors that are evenly spaced in CIELAB will look evenly spaced to the eye.

For pattern design, we need palettes where (1) adjacent colors are distinguishable (deltaE > 10), (2) the overall palette has a coherent mood, and (3) the palette works for the symmetry group (a p6m pattern needs at least 6 distinguishable but harmonious colors). Three palette strategies work well: **analogous** (colors within 30 degrees on the hue wheel — harmonious but low contrast), **complementary** (colors 180 degrees apart — high contrast), and **triadic/hexadic** (evenly spaced on the hue wheel — balanced and vibrant). Traditional Assamese textiles favor warm analogous palettes: gold, red, orange, brown.`,
      analogy: 'Choosing a color palette is like choosing instruments for an orchestra. All strings (analogous) create a smooth, unified sound. Strings plus brass (complementary) create dramatic contrast. A full ensemble with all sections (triadic) creates rich, balanced texture. Each combination serves a different musical purpose, just as each palette serves a different visual purpose.',
      storyConnection: 'The Japi is traditionally decorated with natural dyes — turmeric gold, red lac, indigo blue, and undyed bamboo. These four colors form a specific color palette that is both culturally meaningful and mathematically effective: the gold-red pair is analogous (warm, harmonious), while the blue provides complementary contrast. Our palette generator can create digital equivalents of these traditional color relationships.',
      checkQuestion: 'Two colors have CIELAB values (50, 20, 30) and (50, 20, 35). Their deltaE is 5. Would most people see them as the same color or different? What deltaE would you need for a clear difference in a pattern?',
      checkAnswer: 'DeltaE = 5 is noticeable but subtle — most people would say "those are slightly different shades of the same color." For a pattern where adjacent tiles need to be clearly distinguishable, you need deltaE > 10-15. For maximum clarity (like a pie chart), deltaE > 25. In traditional Japi patterns, the color contrast between adjacent elements is typically very high (deltaE > 40) because the limited palette of natural dyes produces well-separated colors.',
      codeIntro: 'Build a palette generator with multiple strategies and visualize how palette choice transforms the same geometric pattern.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import hsv_to_rgb

def hsl_to_rgb(h, s, l):
    """Convert HSL to RGB. h in [0,360], s,l in [0,1]."""
    h = h / 360.0
    if s == 0: return [l, l, l]
    def hue2rgb(p, q, t):
        if t < 0: t += 1
        if t > 1: t -= 1
        if t < 1/6: return p + (q-p)*6*t
        if t < 1/2: return q
        if t < 2/3: return p + (q-p)*(2/3-t)*6
        return p
    q = l*(1+s) if l < 0.5 else l+s-l*s
    p = 2*l - q
    return [hue2rgb(p,q,h+1/3), hue2rgb(p,q,h), hue2rgb(p,q,h-1/3)]

class PaletteGenerator:
    @staticmethod
    def analogous(base_hue, n=6, spread=40, saturation=0.7, lightness=0.5):
        hues = np.linspace(base_hue - spread, base_hue + spread, n)
        return [hsl_to_rgb(h % 360, saturation, lightness) for h in hues]

    @staticmethod
    def complementary(base_hue, n=6, saturation=0.7, lightness=0.5):
        hues = [base_hue, base_hue + 180]
        palette = []
        for h in hues:
            for i in range(n//2):
                l = lightness - 0.15 + 0.3 * i / (n//2 - 1) if n > 2 else lightness
                palette.append(hsl_to_rgb(h % 360, saturation, l))
        return palette[:n]

    @staticmethod
    def triadic(base_hue, n=6, saturation=0.7, lightness=0.5):
        hues = [base_hue, base_hue + 120, base_hue + 240]
        palette = []
        for i, h in enumerate(hues):
            for j in range(max(1, n//3)):
                s = saturation - 0.1*j
                palette.append(hsl_to_rgb(h % 360, s, lightness))
        return palette[:n]

    @staticmethod
    def assamese_traditional():
        """Traditional Japi/textile colors."""
        return [
            [0.85, 0.65, 0.13],  # turmeric gold
            [0.80, 0.15, 0.15],  # lac red
            [0.20, 0.20, 0.60],  # indigo blue
            [0.82, 0.71, 0.55],  # undyed bamboo
            [0.55, 0.27, 0.07],  # brown
            [0.15, 0.45, 0.15],  # leaf green
        ]

    @staticmethod
    def gradient(color1, color2, n=6):
        return [np.array(color1)*(1-t) + np.array(color2)*t for t in np.linspace(0, 1, n)]

pg = PaletteGenerator()

# Generate a simple pattern to test palettes on
def draw_hex_pattern(ax, palette, title):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    r = 0.3
    for row in range(-1, 5):
        for col in range(-1, 7):
            x = col * r * 1.732
            y = row * r * 1.5
            if col % 2: y += r * 0.75
            angles = np.linspace(0, 2*np.pi, 7)
            hx = x + r*0.95*np.cos(angles)
            hy = y + r*0.95*np.sin(angles)
            c = palette[(row*7+col) % len(palette)]
            ax.fill(hx, hy, color=c, alpha=0.8, edgecolor='#1f2937', linewidth=1)
    ax.set_xlim(0, 3); ax.set_ylim(0, 2.5)
    ax.set_aspect('equal')
    ax.set_title(title, color='white', fontsize=10)

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Color Palettes Transform Pattern Character',
             color='white', fontsize=14, fontweight='bold')

palettes = [
    (pg.analogous(30, 6), 'Analogous (warm)'),
    (pg.complementary(210, 6), 'Complementary (blue-orange)'),
    (pg.triadic(0, 6), 'Triadic (red-green-blue)'),
    (pg.assamese_traditional(), 'Assamese Traditional'),
    (pg.gradient([0.1, 0.1, 0.5], [0.9, 0.7, 0.1], 6), 'Gradient (night to dawn)'),
    (pg.analogous(270, 6, saturation=0.8, lightness=0.4), 'Analogous (cool purple)'),
]

for ax, (palette, title) in zip(axes.flat, palettes):
    draw_hex_pattern(ax, palette, title)

plt.tight_layout()
plt.show()

# Palette swatch display
fig2, ax2 = plt.subplots(figsize=(14, 3))
fig2.patch.set_facecolor('#1f2937')
ax2.set_facecolor('#111827')
ax2.axis('off')
ax2.set_title('Palette Swatches', color='white', fontsize=12)
for row, (palette, title) in enumerate(palettes):
    for col, c in enumerate(palette):
        rect = plt.Rectangle((col*0.8+0.1, (5-row)*0.4+0.1), 0.7, 0.3,
                             facecolor=c, edgecolor='white', linewidth=0.5)
        ax2.add_patch(rect)
    ax2.text(-0.5, (5-row)*0.4+0.25, title[:20], color='white', fontsize=8, va='center')
ax2.set_xlim(-2, 6); ax2.set_ylim(0, 2.8)
plt.tight_layout()
plt.show()

print("Palette Generation Strategies")
print("=" * 50)
print("1. Analogous:    nearby hues, harmonious, subtle")
print("2. Complementary: opposite hues, high contrast")
print("3. Triadic:       120° apart, balanced, vibrant")
print("4. Traditional:   culturally meaningful, tested by time")
print("5. Gradient:      smooth transition, good for radial patterns")
print()
print("Assamese traditional palette:")
for i, (name, c) in enumerate(zip(
    ['Turmeric gold', 'Lac red', 'Indigo blue', 'Bamboo', 'Brown', 'Leaf green'],
    pg.assamese_traditional())):
    print(f"  {name:<15} RGB=({c[0]:.2f}, {c[1]:.2f}, {c[2]:.2f})")`,
      challenge: 'Implement a CIELAB-based palette optimizer that takes any 6 colors and adjusts them to maximize the minimum deltaE between any pair while preserving the overall hue distribution. This ensures every color in the palette is clearly distinguishable from every other.',
      successHint: 'Color is where mathematics meets human perception. A geometrically perfect pattern with a bad palette looks ugly, while a simple pattern with a great palette looks stunning. The palette generator bridges color science and aesthetic tradition.',
    },
    {
      title: 'Surface Mapping: Cone Projection',
      concept: `The final technical challenge is projecting our flat pattern onto the Japi\'s conical surface. This requires a **map projection** from the flat pattern plane to the developed (flattened) cone surface, accounting for the distortion that occurs when a cone is flattened into a sector.

The mapping works in three steps. First, convert the pattern\'s Cartesian coordinates (x, y) to polar coordinates (r, theta) relative to the cone apex. Second, scale theta by the ratio of sector angle to full circle: theta_sector = theta * (sector_angle / 2*pi). This compression accounts for the "missing" angle when the cone is formed. Third, scale r to map from the design radius to the slant height range.

The inverse mapping is equally important: given a point on the 3D cone surface, where does it correspond to in the flat pattern? This allows us to "texture map" the pattern onto a 3D rendering of the Japi. The 3D cone surface is parameterized as: x = (H - z) * tan(alpha) * cos(phi), y = (H - z) * tan(alpha) * sin(phi), z = z, where alpha is the half-angle and phi is the azimuthal angle. Each (phi, z) maps to a unique point in the flat pattern through the inverse projection.`,
      analogy: 'Cone projection is like wrapping a flat gift wrapping paper around a party hat. If the paper has vertical stripes, the stripes will converge toward the tip of the hat and fan out at the base. To make the stripes appear parallel on the finished hat, you have to pre-distort them on the flat paper — wider at the tip region, narrower at the base region. Our projection does this pre-distortion mathematically.',
      storyConnection: 'The Japi weaver solves the cone projection problem physically — she weaves on a conical form, so the bamboo strips naturally follow the cone\'s geometry. Our digital version must solve the same problem mathematically: ensure that patterns designed on a flat screen look correct when "wrapped" onto the conical hat. This is the bridge between digital design and physical craft.',
      checkQuestion: 'A pattern has a circle of radius 5 cm at height h on the flat design. When projected onto the Japi cone (sector angle 300 degrees), what shape does it become on the developed sector?',
      checkAnswer: 'A circle in the flat design becomes an ellipse on the developed sector because the circumferential direction is compressed by the factor sector_angle / 360 = 300/360 = 0.833. The radial direction is unchanged. So the circle becomes an ellipse with radial semi-axis 5 cm and circumferential semi-axis 5 * 0.833 = 4.17 cm. To make it appear circular on the actual cone, you would need to pre-stretch it in the circumferential direction by 1/0.833 = 1.2.',
      codeIntro: 'Implement the cone projection and inverse mapping, then demonstrate pattern application on a flattened cone sector and a 3D cone visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class ConeProjection:
    """Map between flat pattern plane and cone surface."""

    def __init__(self, base_radius, height):
        self.R = base_radius
        self.H = height
        self.slant = np.sqrt(self.R**2 + self.H**2)
        self.half_angle = np.arctan(self.R / self.H)
        self.sector_angle = 2 * np.pi * self.R / self.slant
        self.compression = self.sector_angle / (2 * np.pi)

    def flat_to_sector(self, x, y):
        """Map flat (x,y) to sector (r, theta)."""
        r = np.sqrt(x**2 + y**2)
        theta = np.arctan2(y, x)
        # Scale to sector
        r_sector = r / self.R * self.slant  # map design radius to slant
        theta_sector = theta * self.compression
        return r_sector, theta_sector

    def sector_to_3d(self, r_sector, theta_sector):
        """Map sector coords to 3D cone surface."""
        # r_sector is distance from apex on slant surface
        z = self.H * (1 - r_sector / self.slant)
        phi = theta_sector / self.compression  # unwrap to full angle
        cone_r = r_sector * np.sin(self.half_angle)
        x3d = cone_r * np.cos(phi)
        y3d = cone_r * np.sin(phi)
        return x3d, y3d, z

    def compensate(self, x, y):
        """Pre-distort flat coords to appear correct on cone."""
        r = np.sqrt(x**2 + y**2)
        theta = np.arctan2(y, x)
        # Stretch circumferentially to compensate for compression
        theta_comp = theta / self.compression
        return r * np.cos(theta_comp), r * np.sin(theta_comp)

cone = ConeProjection(base_radius=0.25, height=0.20)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Cone Projection: Flat Pattern to Japi Surface',
             color='white', fontsize=14, fontweight='bold')

# 1. Flat pattern (concentric rings with motifs)
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
colors6 = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#06b6d4']
n_rings = 5
for ring in range(1, n_rings+1):
    r = ring * 0.05
    n_motifs = 6 * ring
    for m in range(n_motifs):
        theta = m * 2*np.pi / n_motifs
        cx, cy = r*np.cos(theta), r*np.sin(theta)
        size = 0.015
        diamond = np.array([[0,size],[size*0.5,0],[0,-size],[-size*0.5,0]])
        c_a, s_a = np.cos(theta), np.sin(theta)
        R = np.array([[c_a,-s_a],[s_a,c_a]])
        rotated = diamond @ R.T + [cx, cy]
        ax.fill(rotated[:,0], rotated[:,1], color=colors6[ring%6], alpha=0.7, edgecolor='white', lw=0.2)
ax.set_xlim(-0.3, 0.3); ax.set_ylim(-0.3, 0.3)
ax.set_aspect('equal')
ax.set_title('1. Flat pattern (design space)', color='white', fontsize=10)

# 2. Projected onto sector
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Draw sector boundary
theta_range = np.linspace(-cone.sector_angle/2, cone.sector_angle/2, 200)
ax.plot(cone.slant*np.cos(theta_range), cone.slant*np.sin(theta_range), color='#f59e0b', lw=2)
for t in [-cone.sector_angle/2, cone.sector_angle/2]:
    ax.plot([0, cone.slant*np.cos(t)], [0, cone.slant*np.sin(t)], color='#f59e0b', lw=2)

for ring in range(1, n_rings+1):
    r_flat = ring * 0.05
    n_motifs = 6 * ring
    for m in range(n_motifs):
        theta_flat = m * 2*np.pi / n_motifs
        cx, cy = r_flat*np.cos(theta_flat), r_flat*np.sin(theta_flat)
        r_s, theta_s = cone.flat_to_sector(cx, cy)
        sx, sy = r_s*np.cos(theta_s), r_s*np.sin(theta_s)
        size = 0.01 * cone.slant / cone.R
        ax.plot(sx, sy, 'o', color=colors6[ring%6], markersize=3, alpha=0.8)
ax.set_aspect('equal')
ax.set_title(f'2. Sector projection ({np.degrees(cone.sector_angle):.0f}°)', color='white', fontsize=10)

# 3. 3D cone visualization (top view)
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for ring in range(1, n_rings+1):
    r_flat = ring * 0.05
    r_3d = r_flat / cone.R * cone.R  # stays the same for top view
    n_motifs = 6 * ring
    theta_full = np.linspace(0, 2*np.pi, 200)
    ax.plot(r_3d*np.cos(theta_full)*100, r_3d*np.sin(theta_full)*100,
            color=colors6[ring%6], lw=0.5, alpha=0.3)
    for m in range(n_motifs):
        theta = m * 2*np.pi / n_motifs
        x3d, y3d = r_3d*np.cos(theta)*100, r_3d*np.sin(theta)*100
        ax.plot(x3d, y3d, 'o', color=colors6[ring%6], markersize=3, alpha=0.8)
ax.set_xlim(-30, 30); ax.set_ylim(-30, 30)
ax.set_aspect('equal')
ax.set_title('3. Top view of 3D cone', color='white', fontsize=10)

# 4. Distortion map
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Draw grid on flat pattern and show how it distorts on sector
for r in np.linspace(0.02, 0.24, 8):
    for theta in np.linspace(0, 2*np.pi, 25):
        x, y = r*np.cos(theta), r*np.sin(theta)
        r_s, theta_s = cone.flat_to_sector(x, y)
        sx, sy = r_s*np.cos(theta_s), r_s*np.sin(theta_s)
        color = plt.cm.viridis(r / 0.24)
        ax.plot(sx, sy, '.', color=color, markersize=2)
# Draw sector
ax.plot(cone.slant*np.cos(theta_range), cone.slant*np.sin(theta_range), color='gray', lw=1)
ax.set_aspect('equal')
ax.set_title('4. Grid distortion on sector', color='white', fontsize=10)

# 5. Compensation demo: circle vs compensated circle
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# A circle in flat space
t = np.linspace(0, 2*np.pi, 100)
circle_r = 0.08
for cx, cy, label, col in [(0.15, 0, 'Direct', '#ef4444'), (0.15, 0, 'Compensated', '#22c55e')]:
    flat_x = cx + circle_r * np.cos(t)
    flat_y = cy + circle_r * np.sin(t)
    if label == 'Compensated':
        # Pre-distort
        flat_x_c, flat_y_c = [], []
        for fx, fy in zip(flat_x, flat_y):
            r_p = np.sqrt(fx**2 + fy**2)
            theta_p = np.arctan2(fy, fx)
            theta_comp = theta_p / cone.compression
            flat_x_c.append(r_p * np.cos(theta_comp))
            flat_y_c.append(r_p * np.sin(theta_comp))
        flat_x, flat_y = flat_x_c, flat_y_c
    # Project to sector
    sector_pts = []
    for fx, fy in zip(flat_x, flat_y):
        r_s, theta_s = cone.flat_to_sector(fx, fy)
        sector_pts.append([r_s*np.cos(theta_s), r_s*np.sin(theta_s)])
    pts = np.array(sector_pts)
    ax.plot(pts[:, 0], pts[:, 1], color=col, linewidth=2, label=label)
ax.set_aspect('equal')
ax.set_title('5. Circle: direct vs compensated', color='white', fontsize=10)
ax.legend(fontsize=8)

# 6. Complete Japi pattern on sector
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Fill sector with colored pattern
for ring in range(1, 8):
    r_inner = (ring-1) * cone.slant / 8
    r_outer = ring * cone.slant / 8
    n_seg = 6 * ring
    for seg in range(n_seg):
        t1 = -cone.sector_angle/2 + seg * cone.sector_angle / n_seg
        t2 = -cone.sector_angle/2 + (seg+1) * cone.sector_angle / n_seg
        thetas = np.linspace(t1, t2, 15)
        inner = np.column_stack([r_inner*np.cos(thetas), r_inner*np.sin(thetas)])
        outer = np.column_stack([r_outer*np.cos(thetas[::-1]), r_outer*np.sin(thetas[::-1])])
        verts = np.vstack([inner, outer])
        ax.fill(verts[:,0], verts[:,1], color=colors6[(ring+seg)%6], alpha=0.5, edgecolor='white', lw=0.2)
ax.plot(cone.slant*np.cos(theta_range), cone.slant*np.sin(theta_range), color='white', lw=2)
for t in [-cone.sector_angle/2, cone.sector_angle/2]:
    ax.plot([0, cone.slant*np.cos(t)], [0, cone.slant*np.sin(t)], color='white', lw=2)
ax.set_aspect('equal')
ax.set_title('6. Complete Japi pattern on sector', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Cone Projection Parameters")
print("=" * 45)
print(f"Base radius: {cone.R*100:.1f} cm")
print(f"Height: {cone.H*100:.1f} cm")
print(f"Slant height: {cone.slant*100:.1f} cm")
print(f"Sector angle: {np.degrees(cone.sector_angle):.1f}°")
print(f"Compression ratio: {cone.compression:.3f}")
print(f"Circumferential stretch needed: {1/cone.compression:.3f}x")`,
      challenge: 'Implement a full 3D rendering of the Japi cone using matplotlib\'s 3D axes. Texture-map the pattern onto the cone surface by computing the color at each (phi, z) point from the flat pattern through the inverse projection.',
      successHint: 'The cone projection is the bridge between the abstract mathematics of symmetry groups and the physical reality of the Japi hat. Every traditional craft that applies flat patterns to curved surfaces solves this same mathematical problem.',
    },
    {
      title: 'Interactive Pattern Explorer & Final Generator',
      concept: `The final capstone lesson integrates all components into a complete pattern generation pipeline: motif selection, symmetry group application, color palette assignment, and cone surface projection. The system takes a compact specification — a handful of parameters — and produces a complete, publishable Japi pattern design.

The pipeline works as follows. The user selects a motif type and adjusts its parameters (petal count, width, complexity). They choose a wallpaper group and lattice spacing. They pick a color palette (traditional, custom, or algorithmically generated). The system then: (1) generates the motif vertices, (2) computes all symmetry transformations, (3) assigns colors from the palette, (4) projects everything onto the cone sector, and (5) renders the final design with both a flat preview and a cone visualization.

The output includes a **pattern specification** — a compact JSON-like description that fully defines the pattern. This specification can be saved, shared, and used to exactly reproduce the pattern. It also enables algorithmic design: a genetic algorithm could evolve pattern specifications toward aesthetic goals, essentially automating the creative process while keeping humans in control of the evaluation criteria.`,
      analogy: 'The final generator is like a music synthesizer. You select the waveform (motif), the chord structure (symmetry group), the instrument sound (color palette), and the speaker shape (cone surface). Press play and the synthesizer produces a complete musical piece. Each knob controls one aspect independently, but the result is an integrated whole that is far more than the sum of its parts.',
      storyConnection: 'This capstone creates a digital loom for the 21st century. A Japi weaver in Assam could use this tool to explore new pattern designs before committing to bamboo, or a student could experiment with mathematical symmetries and see them come alive as traditional art. The tool bridges computational geometry and cultural heritage — exactly the vision of TigmaMinds Academy.',
      checkQuestion: 'A pattern specification includes: motif="rose-8", group="p6m", palette="assamese", cone=(25cm, 20cm). How many independent parameters define this pattern? How many motif copies will appear on the Japi?',
      checkAnswer: 'Motif parameters: n_petals=8, amplitude, inner_radius (3 parameters). Group: lattice spacing (1 parameter, since p6m constrains the lattice to hexagonal). Palette: 6 fixed colors (0 free parameters for "assamese" preset). Cone: 2 parameters. Total: about 6 free parameters define the entire pattern. Motif copies: for a typical Japi with 7 rings averaging 30 hexagonal cells each, with 12 symmetry operations per cell (p6m), that is roughly 7*30*12 = 2,520 motif copies — all from 6 parameters.',
      codeIntro: 'Build the complete pattern generator pipeline and generate multiple Japi designs by varying the input parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === COMPLETE JAPI PATTERN GENERATOR ===

class JapiPatternGenerator:
    """Complete pipeline: motif + symmetry + color + cone -> Japi pattern."""

    def __init__(self, base_radius=0.25, height=0.20):
        self.R = base_radius
        self.H = height
        self.slant = np.sqrt(self.R**2 + self.H**2)
        self.sector_angle = 2 * np.pi * self.R / self.slant

    def generate_motif(self, style='rose', **kwargs):
        t = np.linspace(0, 2*np.pi, 100)
        if style == 'rose':
            n = kwargs.get('petals', 6)
            amp = kwargs.get('amplitude', 0.01)
            r = 0.002 + amp * np.abs(np.cos(n * t))
            return np.column_stack([r*np.cos(t), r*np.sin(t)])
        elif style == 'diamond':
            s = kwargs.get('size', 0.01)
            return np.array([[0,s],[s*0.4,0],[0,-s],[-s*0.4,0]])
        elif style == 'star':
            n = kwargs.get('points', 6)
            angles = np.linspace(0, 2*np.pi, 2*n, endpoint=False)
            radii = np.where(np.arange(2*n)%2==0, kwargs.get('size',0.01),
                           kwargs.get('size',0.01)*0.4)
            return np.column_stack([radii*np.cos(angles), radii*np.sin(angles)])
        return np.column_stack([0.01*np.cos(t), 0.01*np.sin(t)])

    def generate_palette(self, style='assamese'):
        if style == 'assamese':
            return [[0.85,0.65,0.13],[0.80,0.15,0.15],[0.20,0.20,0.60],
                    [0.82,0.71,0.55],[0.55,0.27,0.07],[0.15,0.45,0.15]]
        elif style == 'cool':
            return [[0.1,0.3,0.7],[0.2,0.5,0.8],[0.1,0.6,0.5],
                    [0.5,0.2,0.7],[0.3,0.7,0.7],[0.15,0.4,0.6]]
        elif style == 'warm':
            return [[0.9,0.3,0.1],[0.95,0.6,0.1],[0.85,0.2,0.3],
                    [0.7,0.1,0.1],[0.95,0.8,0.3],[0.6,0.3,0.1]]
        return [[0.5]*3]*6

    def render_on_sector(self, ax, motif, palette, n_rings=7, symmetry=6):
        """Render pattern on the flattened cone sector."""
        theta_range = np.linspace(-self.sector_angle/2, self.sector_angle/2, 300)

        for ring in range(1, n_rings+1):
            r_inner = (ring-1) * self.slant / n_rings
            r_outer = ring * self.slant / n_rings
            r_mid = (r_inner + r_outer) / 2
            arc_len = r_mid * self.sector_angle
            n_motifs = max(symmetry, int(arc_len / (self.slant/n_rings * 1.2)))
            # Round to multiple of symmetry for clean repeats
            n_motifs = max(symmetry, (n_motifs // symmetry) * symmetry)

            for m in range(n_motifs):
                theta = -self.sector_angle/2 + (m+0.5) * self.sector_angle / n_motifs
                cx, cy = r_mid * np.cos(theta), r_mid * np.sin(theta)

                # Scale motif by ring position
                scale = ring / n_rings * 1.5
                scaled = motif * scale

                # Rotate to be tangent
                ca, sa = np.cos(theta+np.pi/2), np.sin(theta+np.pi/2)
                R = np.array([[ca,-sa],[sa,ca]])
                rotated = scaled @ R.T + [cx, cy]

                color = palette[(ring + m) % len(palette)]
                ax.fill(rotated[:,0], rotated[:,1], color=color, alpha=0.6,
                        edgecolor='white', linewidth=0.2)

        # Sector outline
        ax.plot(self.slant*np.cos(theta_range), self.slant*np.sin(theta_range), color='white', lw=2)
        for t in [-self.sector_angle/2, self.sector_angle/2]:
            ax.plot([0, self.slant*np.cos(t)], [0, self.slant*np.sin(t)], color='white', lw=2)

    def render_top_view(self, ax, motif, palette, n_rings=7, symmetry=6):
        """Render pattern as top view of 3D cone."""
        for ring in range(1, n_rings+1):
            r = self.R * ring / n_rings
            n_motifs = max(symmetry, int(2*np.pi*r / (self.R/n_rings * 1.2)))
            n_motifs = max(symmetry, (n_motifs // symmetry) * symmetry)
            for m in range(n_motifs):
                theta = m * 2*np.pi / n_motifs
                cx, cy = r*np.cos(theta)*100, r*np.sin(theta)*100
                scale = ring / n_rings * 1.2
                scaled = motif * scale * 100
                ca, sa = np.cos(theta+np.pi/2), np.sin(theta+np.pi/2)
                R = np.array([[ca,-sa],[sa,ca]])
                rotated = scaled @ R.T + [cx, cy]
                color = palette[(ring + m) % len(palette)]
                ax.fill(rotated[:,0], rotated[:,1], color=color, alpha=0.6,
                        edgecolor='white', linewidth=0.15)

# === GENERATE MULTIPLE DESIGNS ===
gen = JapiPatternGenerator()

designs = [
    {'motif': 'rose', 'motif_args': {'petals': 6, 'amplitude': 0.008},
     'palette': 'assamese', 'symmetry': 6, 'label': 'Traditional (6-fold, Assamese colors)'},
    {'motif': 'star', 'motif_args': {'points': 8, 'size': 0.008},
     'palette': 'cool', 'symmetry': 8, 'label': 'Modern (8-fold, cool palette)'},
    {'motif': 'diamond', 'motif_args': {'size': 0.008},
     'palette': 'warm', 'symmetry': 12, 'label': 'Geometric (12-fold, warm palette)'},
]

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('JAPI PATTERN GENERATOR — Three Design Variations',
             color='white', fontsize=14, fontweight='bold')

for col, design in enumerate(designs):
    motif = gen.generate_motif(design['motif'], **design['motif_args'])
    palette = gen.generate_palette(design['palette'])
    sym = design['symmetry']

    # Sector view
    ax = axes[0, col]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    gen.render_on_sector(ax, motif, palette, symmetry=sym)
    ax.set_aspect('equal')
    ax.set_title(design['label'], color='white', fontsize=9)

    # Top view
    ax = axes[1, col]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    gen.render_top_view(ax, motif, palette, symmetry=sym)
    ax.set_xlim(-30, 30); ax.set_ylim(-30, 30)
    ax.set_aspect('equal')
    ax.set_title('Top view (3D cone)', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("JAPI PATTERN GENERATOR — CAPSTONE COMPLETE")
print("=" * 55)
print()
for i, d in enumerate(designs):
    print(f"Design {i+1}: {d['label']}")
    print(f"  Motif: {d['motif']} ({d['motif_args']})")
    print(f"  Symmetry: {d['symmetry']}-fold")
    print(f"  Palette: {d['palette']}")
    print()
print("Pipeline: motif -> symmetry -> palette -> cone projection -> render")
print()
print("Skills demonstrated: group theory, tessellation,")
print("affine transformations, 17 wallpaper groups,")
print("conical geometry, fractal analysis, color theory,")
print("parametric design, software architecture.")`,
      challenge: 'Add a genetic algorithm that evolves pattern specifications toward an aesthetic fitness function. Define fitness as a combination of (1) fractal dimension in the sweet spot (1.3-1.5), (2) minimum deltaE between palette colors > 15, (3) good coverage of the cone surface (no large empty regions). Run for 50 generations and show the fittest pattern.',
      successHint: 'You have built a complete pattern generator that spans group theory, computational geometry, color science, and cultural heritage. The Japi is not just a hat — it is a canvas where mathematics and art have been intertwined for centuries. Your generator makes this intersection accessible, explorable, and extensible.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (geometric patterns & tessellation)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Japi Pattern Generator using geometric transformations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
