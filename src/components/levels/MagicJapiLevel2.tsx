import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MagicJapiLevel2() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Coordinate geometry — placing the Japi on a grid',
      concept: `To work with geometry computationally, we need to place shapes on a coordinate system. **Coordinate geometry** (analytic geometry) was invented by René Descartes in 1637 and it bridges algebra and geometry.

The Japi's base circle, centered at the origin, is described by: **x² + y² = r²**

Any point on the circle can be written as: **(r·cos(θ), r·sin(θ))** where θ is the angle from the positive x-axis.

The Japi's cone, with apex at (0, 0, h) and base circle at z=0:
- **x² + y² = (r/h)² · (h - z)²** (in 3D coordinates)
- At z=0 (base): x² + y² = r²
- At z=h (apex): x² + y² = 0 (a single point)

Key formulas in coordinate geometry:
- **Distance**: d = √((x₂-x₁)² + (y₂-y₁)²)
- **Midpoint**: ((x₁+x₂)/2, (y₁+y₂)/2)
- **Slope**: m = (y₂-y₁)/(x₂-x₁)
- **Line equation**: y - y₁ = m(x - x₁)

With coordinates, we can compute intersections, distances, and areas using algebra instead of rulers and compasses. This is the foundation of computer graphics, robotics, and GPS.`,
      analogy: 'Coordinate geometry is like giving every location a unique address. Without coordinates, you say "the Japi is over there." With coordinates, you say "the apex is at (0, 0, 15) and the base edge at angle 45° is at (21.2, 21.2, 0)." Computers can\'t point — they need addresses. Coordinates are the addresses of geometry.',
      storyConnection: 'To digitally model the magic Japi — for 3D printing, animation, or engineering analysis — every point on its surface needs coordinates. The craftsman works by eye and hand; the computer works by numbers. Coordinate geometry translates one into the other.',
      checkQuestion: 'A Japi has radius 30 and height 15. What are the 3D coordinates of the point on the surface directly above the point (30, 0, 0) on the base edge?',
      checkAnswer: 'Trick question — (30, 0, 0) IS on the base edge (z=0, at the maximum radius). The point "directly above" it on the surface is... itself. Points on the base edge are on the surface. If you meant the point on the cone surface at radius 15 (halfway), that would be at z = h(1 - 15/30) = 7.5, so the point is (15, 0, 7.5).',
      codeIntro: 'Plot the Japi in coordinate space and compute key geometric properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

radius, height = 30, 15

# --- 2D cross-section with coordinate grid ---
ax1.set_facecolor('#111827')
ax1.grid(True, alpha=0.15, color='gray')

# Cone cross-section
ax1.plot([-radius, 0, radius], [0, height, 0], color='#f59e0b', linewidth=2.5)
ax1.plot([-radius, radius], [0, 0], color='#f59e0b', linewidth=2.5)

# Key points
points = {
    'Apex (0, 15)': (0, height),
    'Base left (-30, 0)': (-radius, 0),
    'Base right (30, 0)': (radius, 0),
    'Mid-surface (15, 7.5)': (15, 7.5),
    'Center (0, 0)': (0, 0),
}
for label, (px, py) in points.items():
    ax1.plot(px, py, 'o', color='#ef4444', markersize=8)
    ax1.annotate(label, xy=(px, py), xytext=(px+2, py+1.5),
                color='white', fontsize=8, fontweight='bold')

# Distance computation
x1, y1 = 0, height
x2, y2 = radius, 0
dist = np.sqrt((x2-x1)**2 + (y2-y1)**2)
ax1.plot([x1, x2], [y1, y2], color='#22c55e', linewidth=1.5, linestyle='--')
ax1.text(18, 10, f'd = {dist:.1f}', color='#22c55e', fontsize=10)

ax1.set_xlabel('x (cm)', color='white')
ax1.set_ylabel('z (cm)', color='white')
ax1.set_title('Japi Cross-Section in Coordinates', color='white', fontsize=12)
ax1.set_aspect('equal')
ax1.tick_params(colors='gray')

# --- 3D-ish wireframe (top view + height contours) ---
ax2.set_facecolor('#111827')
theta = np.linspace(0, 2*np.pi, 100)

# Height contour lines (circles at different z)
for z in np.linspace(0, height, 8):
    r_at_z = radius * (1 - z/height)
    alpha = 0.3 + 0.5 * (1 - z/height)
    ax2.plot(r_at_z * np.cos(theta), r_at_z * np.sin(theta),
             color='#f59e0b', linewidth=1, alpha=alpha)
    if r_at_z > 2:
        ax2.text(r_at_z + 1, 0, f'z={z:.0f}', color='gray', fontsize=7)

# Radial lines
for angle in np.linspace(0, 2*np.pi, 8, endpoint=False):
    ax2.plot([0, radius*np.cos(angle)], [0, radius*np.sin(angle)],
             color='gray', linewidth=0.5, alpha=0.3)

# Mark specific point
angle_p = np.pi/4
r_p = 20
z_p = height * (1 - r_p/radius)
ax2.plot(r_p * np.cos(angle_p), r_p * np.sin(angle_p), 'o', color='#ef4444', markersize=8)
ax2.annotate(f'({r_p*np.cos(angle_p):.1f}, {r_p*np.sin(angle_p):.1f}, {z_p:.1f})',
             xy=(r_p*np.cos(angle_p), r_p*np.sin(angle_p)),
             xytext=(r_p*np.cos(angle_p)+3, r_p*np.sin(angle_p)+3),
             color='#ef4444', fontsize=9, fontweight='bold')

ax2.set_xlabel('x (cm)', color='white')
ax2.set_ylabel('y (cm)', color='white')
ax2.set_title('Top View with Height Contours', color='white', fontsize=12)
ax2.set_aspect('equal')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Coordinate geometry of the Japi:")
print(f"  Base circle: x² + y² = {radius}² = {radius**2}")
print(f"  Cone equation: x² + y² = {radius}²·(1 - z/{height})²")
print(f"  Slant height (distance formula): {dist:.1f} cm")
print(f"  Any point at radius r, angle θ, height z = {height}·(1 - r/{radius})")
print(f"  Surface point at r=20, θ=45°: ({20*np.cos(np.pi/4):.1f}, {20*np.sin(np.pi/4):.1f}, {height*(1-20/radius):.1f})")`,
      challenge: 'Find the coordinates of the point on the Japi surface that is closest to the external point (40, 0, 10). This is a constrained optimization problem — the point must lie ON the cone surface.',
      successHint: 'Coordinate geometry transforms visual intuition into computation. Every CAD program, game engine, and robotics system uses these exact techniques to represent and manipulate shapes.',
    },
    {
      title: 'Parametric curves — drawing patterns with equations',
      concept: `The decorative bands on a Japi follow curves that can be described **parametrically** — with x and y as functions of a single parameter t:

**x(t) = f(t), y(t) = g(t)**

This is more powerful than y = f(x) because parametric curves can loop, spiral, and cross themselves.

Important parametric curves:
- **Circle**: x = r·cos(t), y = r·sin(t) — the Japi's base
- **Ellipse**: x = a·cos(t), y = b·sin(t) — stretched circle
- **Lissajous figures**: x = A·sin(at + δ), y = B·sin(bt) — the beautiful patterns from two vibrations
- **Spirals**: x = t·cos(t), y = t·sin(t) (Archimedean) or x = e^(bt)·cos(t), y = e^(bt)·sin(t) (logarithmic)
- **Epicycloids**: circles rolling on circles — the geometry behind spirograph toys
- **Bézier curves**: used in every font, every vector illustration, every CAD program

The Japi's bands, which wrap around the cone surface, are parametric curves on a 3D surface. When the cone is unrolled flat, these circular bands become arcs of circles — demonstrating how 3D and 2D parametric representations are connected.`,
      analogy: 'A parametric curve is like giving someone walking directions over time: "at t=0 be at (0,0), at t=1 be at (1, 2), at t=2 be at (3, 1)..." The path they trace IS the curve. Time is the parameter. This is more natural than saying "y = f(x)" — people walk through time, not along x-coordinates.',
      storyConnection: 'The spiraling patterns on the magic Japi — curves that wound from base to apex — are naturally described as parametric curves. As the parameter increases, the curve spirals upward, with the radius decreasing linearly (because the cone narrows). The craftsman traces these curves by hand; the mathematician writes them as equations.',
      checkQuestion: 'A Lissajous figure with frequencies (3, 2) looks like a pretzel. What determines whether a Lissajous figure is a closed loop or eventually fills the plane?',
      checkAnswer: 'If the frequency ratio a/b is rational (a fraction of integers), the curve is closed — it eventually retraces itself. If a/b is irrational (like √2), the curve never closes and eventually fills a rectangle densely. The number of lobes in a closed Lissajous figure equals max(a, b) horizontally and min(a, b) vertically (approximately).',
      codeIntro: 'Generate beautiful parametric curves inspired by Japi patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Parametric Curves: From Mathematics to Art', color='white', fontsize=14, y=1.02)

t = np.linspace(0, 2*np.pi, 1000)
t_long = np.linspace(0, 20*np.pi, 10000)

curves = [
    ('Lissajous (3:2)', np.sin(3*t), np.sin(2*t + np.pi/4), '#f59e0b'),
    ('Lissajous (5:4)', np.sin(5*t), np.sin(4*t + np.pi/6), '#3b82f6'),
    ('Rose Curve (k=5)', np.cos(5*t)*np.cos(t), np.cos(5*t)*np.sin(t), '#ef4444'),
    ('Spirograph', (5-2)*np.cos(t_long[:len(t)]) + 1*np.cos((5-2)*t_long[:len(t)]/2),
     (5-2)*np.sin(t_long[:len(t)]) - 1*np.sin((5-2)*t_long[:len(t)]/2), '#22c55e'),
    ('Logarithmic Spiral', np.exp(0.1*t_long[:len(t)])*np.cos(t_long[:len(t)]),
     np.exp(0.1*t_long[:len(t)])*np.sin(t_long[:len(t)]), '#a855f7'),
    ('Japi Spiral (on cone)', None, None, '#f59e0b'),  # special case
]

for ax, (title, x, y, color) in zip(axes.flatten(), curves):
    ax.set_facecolor('#111827')

    if title == 'Japi Spiral (on cone)':
        # Spiral on a cone, projected to 2D (unrolled)
        t_spiral = np.linspace(0, 6*np.pi, 2000)
        r_spiral = 30 * (1 - t_spiral / (6*np.pi))  # decreasing radius
        x_spiral = r_spiral * np.cos(t_spiral)
        y_spiral = r_spiral * np.sin(t_spiral)
        ax.plot(x_spiral, y_spiral, color=color, linewidth=1.5)
        # Base circle
        theta_c = np.linspace(0, 2*np.pi, 100)
        ax.plot(30*np.cos(theta_c), 30*np.sin(theta_c), color='gray', linewidth=0.5, alpha=0.3)
    else:
        ax.plot(x, y, color=color, linewidth=1.5)

    ax.set_title(title, color='white', fontsize=10)
    ax.set_aspect('equal')
    ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Parametric curves: x(t), y(t)")
print()
print("Circle:    x = r·cos(t), y = r·sin(t)")
print("Lissajous: x = sin(at + δ), y = sin(bt)")
print("Rose:      r = cos(kθ) in polar → x = cos(kθ)cos(θ)")
print("Spiral:    r = e^(bθ) in polar (logarithmic)")
print("Bézier:    weighted sum of control points")
print()
print("The Japi spiral is a curve on a cone surface:")
print("  r(t) = R·(1 - t/T)  — radius decreases linearly")
print("  θ(t) = t             — angle increases steadily")
print("  z(t) = h·t/T         — height increases linearly")`,
      challenge: 'Create a rose curve with k = 7/3 (a rational non-integer). How many petals does it have? The formula: if k = p/q (reduced), the rose has p petals if p is odd, 2p petals if p is even. Verify this visually.',
      successHint: 'Parametric curves are the mathematical language of computer graphics, animation, and industrial design. Every smooth curve on your screen — every font letter, every car body panel, every animated motion path — is a parametric curve.',
    },
    {
      title: 'Fractal patterns — infinite detail from simple rules',
      concept: `Some of the most stunning patterns in nature and traditional art share a property called **self-similarity**: the pattern looks the same at different scales. A branch of a tree looks like a smaller tree. A section of coastline looks like the whole coast. This is the defining property of **fractals**.

Famous fractals:
- **Koch snowflake**: start with a triangle, add smaller triangles to every edge, repeat forever. Infinite perimeter, finite area.
- **Sierpinski triangle**: start with a triangle, remove the middle quarter, repeat on each remaining triangle. Infinite holes, zero area.
- **Mandelbrot set**: the "thumbprint of God" — generated by iterating z → z² + c for complex numbers.
- **Barnsley fern**: four simple transformations produce a realistic fern leaf.

Fractals have a **fractal dimension** (D) — a non-integer dimension:
- Koch curve: D = log(4)/log(3) ≈ 1.26 (more than a line, less than a plane)
- Sierpinski triangle: D = log(3)/log(2) ≈ 1.58
- Coastline of Britain: D ≈ 1.25

Traditional Assamese patterns contain fractal-like elements: the motifs on a Japi band repeat at smaller scales within larger motifs. This is not true mathematical fractal (which requires infinite recursion) but it demonstrates the same aesthetic principle: detail at every scale.`,
      analogy: 'A fractal is like a Russian nesting doll (matryoshka) that goes infinitely inward. Open the big doll, find a smaller copy. Open that, find an even smaller copy. Fractals do this with shapes: zoom into a fractal and you find the same pattern, forever. Nature uses this trick because it\'s efficient: one simple rule, repeated, creates enormous complexity.',
      storyConnection: 'The magic Japi\'s patterns were described as "patterns within patterns" — each band contained smaller versions of the same motif. This fractal-like quality gave the Japi its magical appearance: no matter how closely you looked, there was more detail. In mathematics, this is self-similarity — the hallmark of fractal geometry.',
      checkQuestion: 'The Koch snowflake has infinite perimeter but finite area. How is this possible?',
      checkAnswer: 'Each iteration multiplies the perimeter by 4/3 (it grows by a third each time). After infinite iterations, 4/3 × 4/3 × 4/3... = infinity. But the area is bounded because each added triangle is smaller than the last. The total area converges to 8/5 of the original triangle — a finite sum of an infinite series (geometric series with ratio < 1). Infinite perimeter enclosing finite area is counterintuitive but mathematically rigorous.',
      codeIntro: 'Generate fractal patterns: Koch snowflake, Sierpinski triangle, and a Japi-inspired fractal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def koch_curve(p1, p2, depth):
    """Generate Koch curve points between p1 and p2."""
    if depth == 0:
        return [p1, p2]
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    a = (p1[0] + dx/3, p1[1] + dy/3)
    b = (p1[0] + 2*dx/3, p1[1] + 2*dy/3)
    # Peak point (equilateral triangle)
    px = (p1[0] + p2[0])/2 + np.sqrt(3)/6 * (p1[1] - p2[1])
    py = (p1[1] + p2[1])/2 + np.sqrt(3)/6 * (p2[0] - p1[0])
    peak = (px, py)
    points = []
    points.extend(koch_curve(p1, a, depth-1)[:-1])
    points.extend(koch_curve(a, peak, depth-1)[:-1])
    points.extend(koch_curve(peak, b, depth-1)[:-1])
    points.extend(koch_curve(b, p2, depth-1))
    return points

def sierpinski(ax, p1, p2, p3, depth, color):
    """Draw Sierpinski triangle."""
    if depth == 0:
        tri = plt.Polygon([p1, p2, p3], facecolor=color, edgecolor='none', alpha=0.7)
        ax.add_patch(tri)
        return
    # Midpoints
    m12 = ((p1[0]+p2[0])/2, (p1[1]+p2[1])/2)
    m23 = ((p2[0]+p3[0])/2, (p2[1]+p3[1])/2)
    m13 = ((p1[0]+p3[0])/2, (p1[1]+p3[1])/2)
    sierpinski(ax, p1, m12, m13, depth-1, color)
    sierpinski(ax, m12, p2, m23, depth-1, color)
    sierpinski(ax, m13, m23, p3, depth-1, color)

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

# --- Koch Snowflake ---
ax = axes[0]
ax.set_facecolor('#111827')
# Start with equilateral triangle
angle_offsets = [np.pi/2, np.pi/2 - 2*np.pi/3, np.pi/2 - 4*np.pi/3]
vertices = [(np.cos(a), np.sin(a)) for a in angle_offsets]
for depth, alpha in [(0, 0.2), (1, 0.3), (4, 1.0)]:
    all_points = []
    for i in range(3):
        pts = koch_curve(vertices[i], vertices[(i+1)%3], depth)
        all_points.extend(pts[:-1])
    all_points.append(all_points[0])
    xs, ys = zip(*all_points)
    ax.plot(xs, ys, color='#06b6d4', linewidth=0.8 if depth > 2 else 1.5, alpha=alpha)
ax.set_title(f'Koch Snowflake (depth 4)', color='white', fontsize=11)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- Sierpinski Triangle ---
ax = axes[1]
ax.set_facecolor('#111827')
p1, p2, p3 = (0, 0), (4, 0), (2, 3.46)
sierpinski(ax, p1, p2, p3, 6, '#22c55e')
ax.set_xlim(-0.5, 4.5); ax.set_ylim(-0.5, 4)
ax.set_title('Sierpinski Triangle (depth 6)', color='white', fontsize=11)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- Japi-inspired spiral fractal ---
ax = axes[2]
ax.set_facecolor('#111827')
theta = np.linspace(0, 8*np.pi, 2000)
# Main spiral
r_main = 3 * (1 - theta / (8*np.pi))
ax.plot(r_main * np.cos(theta), r_main * np.sin(theta), color='#f59e0b', linewidth=1.5)

# Smaller spirals branching off at intervals
for t_branch in np.linspace(np.pi, 7*np.pi, 8):
    r_b = 3 * (1 - t_branch / (8*np.pi))
    cx = r_b * np.cos(t_branch)
    cy = r_b * np.sin(t_branch)
    # Mini spiral at this point
    t_mini = np.linspace(0, 4*np.pi, 300)
    r_mini = 0.5 * (1 - t_mini / (4*np.pi))
    ax.plot(cx + r_mini * np.cos(t_mini + t_branch),
            cy + r_mini * np.sin(t_mini + t_branch),
            color='#f59e0b', linewidth=0.5, alpha=0.6)

ax.set_title('Japi-Inspired Spiral Fractal', color='white', fontsize=11)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Fractal dimensions:")
print(f"  Koch snowflake: D = log(4)/log(3) = {np.log(4)/np.log(3):.3f}")
print(f"  Sierpinski triangle: D = log(3)/log(2) = {np.log(3)/np.log(2):.3f}")
print(f"  Coastline of Britain: D ≈ 1.25")
print()
print("Key insight: simple rules + iteration = infinite complexity.")
print("Fractals appear in: trees, lungs, rivers, lightning, snowflakes,")
print("stock markets, antenna design, and traditional art patterns.")`,
      challenge: 'Modify the Koch snowflake to use a square instead of a triangle as the starting shape (Koch island). How does the shape change? What is the fractal dimension of this variant?',
      successHint: 'Fractal geometry, developed by Benoit Mandelbrot in the 1970s, gave us the mathematical tools to describe the irregular shapes of nature. Clouds, mountains, trees, and coastlines are all fractal — and now you can generate them with code.',
    },
    {
      title: 'Algorithmic art — generating beauty with code',
      concept: `**Algorithmic art** (generative art) is art created by algorithms — sets of rules that produce visual output. The artist designs the rules; the computer executes them millions of times.

Key techniques:
- **Random walks**: each step is in a random direction → organic, wandering lines
- **L-systems**: string rewriting rules that generate plant-like structures (invented by Aristid Lindenmayer in 1968)
- **Voronoi diagrams**: divide space into regions based on proximity to seed points → looks like cell structures, cracked earth, giraffe patterns
- **Perlin noise**: smooth, natural-looking random variation (used in every video game for terrain, clouds, water)
- **Cellular automata**: simple rules on a grid produce complex behavior (Conway's Game of Life)

L-systems are especially relevant to the Japi. An L-system rule like:
- Axiom: "F"
- Rule: F → "F[+F]F[-F]F"
This produces branching patterns that look like the branching bamboo structure of a Japi frame.

The beauty of algorithmic art is that small changes in parameters produce dramatically different results. Changing one number can turn a tree into a snowflake.`,
      analogy: 'Algorithmic art is like a recipe where the chef (computer) follows instructions precisely but the ingredients have some randomness. "Add a pinch of salt" means a different amount each time → each dish is unique but recognizably from the same recipe. The artist writes the recipe; the computer cooks a different dish every time you run it.',
      storyConnection: 'The magic Japi\'s patterns were "different each time you looked, yet always the same" — this is exactly what algorithmic art achieves. The underlying rules (the algorithm) are fixed, but randomness or parameter variation creates unique instances. A Japi pattern generator could produce infinite unique Japies that all feel authentically Assamese.',
      checkQuestion: 'Conway\'s Game of Life uses only 4 simple rules on a grid of cells. Yet it can produce spaceships, oscillators, and even a universal computer. How can complex behavior emerge from simple rules?',
      checkAnswer: 'This is the concept of emergence — complex global behavior arising from simple local interactions. Each cell only looks at its immediate neighbors, but the collective behavior of millions of cells following the same simple rules creates patterns that are impossible to predict from the rules alone. This is also how ant colonies, brain neurons, and economies work — simple agents, complex systems.',
      codeIntro: 'Generate algorithmic art: L-system plant, Voronoi pattern, and a generative Japi motif.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(16, 6))
fig.patch.set_facecolor('#1f2937')

# --- L-system plant ---
ax = axes[0]
ax.set_facecolor('#111827')

def l_system(axiom, rules, iterations):
    s = axiom
    for _ in range(iterations):
        s = ''.join(rules.get(c, c) for c in s)
    return s

def draw_l_system(ax, instructions, angle_deg, length, start_pos=(0, 0), start_angle=90):
    x, y, a = start_pos[0], start_pos[1], np.radians(start_angle)
    stack = []
    da = np.radians(angle_deg)
    for cmd in instructions:
        if cmd == 'F':
            nx, ny = x + length * np.cos(a), y + length * np.sin(a)
            ax.plot([x, nx], [y, ny], color='#22c55e', linewidth=0.5, alpha=0.7)
            x, y = nx, ny
        elif cmd == '+': a += da
        elif cmd == '-': a -= da
        elif cmd == '[': stack.append((x, y, a))
        elif cmd == ']': x, y, a = stack.pop()

rules = {'F': 'FF+[+F-F-F]-[-F+F+F]'}
instructions = l_system('F', rules, 4)
draw_l_system(ax, instructions, 22.5, 0.8)
ax.set_title('L-System Plant', color='white', fontsize=11)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- Voronoi-like pattern ---
ax = axes[1]
ax.set_facecolor('#111827')
np.random.seed(42)
n_points = 30
px = np.random.rand(n_points) * 10
py = np.random.rand(n_points) * 10

# Simple Voronoi via nearest-point coloring
xx, yy = np.meshgrid(np.linspace(0, 10, 300), np.linspace(0, 10, 300))
distances = np.array([np.sqrt((xx - x)**2 + (yy - y)**2) for x, y in zip(px, py)])
nearest = np.argmin(distances, axis=0)

ax.imshow(nearest, extent=[0, 10, 0, 10], origin='lower', cmap='Set3', alpha=0.6)
ax.plot(px, py, 'o', color='#ef4444', markersize=4)
ax.set_title('Voronoi Diagram', color='white', fontsize=11)
ax.set_xlim(0, 10); ax.set_ylim(0, 10)
ax.set_xticks([]); ax.set_yticks([])

# --- Generative Japi motif ---
ax = axes[2]
ax.set_facecolor('#111827')
np.random.seed(7)

theta = np.linspace(0, 2*np.pi, 100)
n_rings = 8
colors_japi = ['#f59e0b', '#d97706', '#92400e', '#f59e0b', '#d97706', '#92400e', '#f59e0b', '#d97706']

for i in range(n_rings):
    r_inner = 3 + i * 2.5
    r_outer = r_inner + 2.0
    # Add wave perturbation
    n_waves = np.random.randint(8, 20)
    amplitude = 0.3 + np.random.random() * 0.4
    perturbation = amplitude * np.sin(n_waves * theta)

    r_in = r_inner + perturbation
    r_out = r_outer + perturbation * 0.5

    ax.fill_between(theta * r_inner / (2*np.pi) * 10 / n_rings + i * 10 / n_rings,
                    [0]*len(theta), [1]*len(theta), alpha=0.3)

    # Draw as annular band
    x_in = r_in * np.cos(theta)
    y_in = r_in * np.sin(theta)
    x_out = r_out * np.cos(theta)
    y_out = r_out * np.sin(theta)

    ax.fill(np.concatenate([x_in, x_out[::-1]]),
            np.concatenate([y_in, y_out[::-1]]),
            color=colors_japi[i], alpha=0.4)
    ax.plot(x_in, y_in, color=colors_japi[i], linewidth=0.5)
    ax.plot(x_out, y_out, color=colors_japi[i], linewidth=0.5)

ax.set_title('Generative Japi Motif', color='white', fontsize=11)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Algorithmic art techniques:")
print("  L-systems: string rewriting → plant structures")
print("  Voronoi: proximity partitioning → cell patterns")
print("  Perlin noise: smooth randomness → natural textures")
print("  Generative design: parameterized rules → infinite variations")
print()
print("Each run of the Japi motif generator creates a unique pattern")
print("while maintaining the recognizable Japi aesthetic. Change the")
print("random seed to get a different Japi every time.")`,
      challenge: 'Modify the L-system rules to create a different plant shape. Try: axiom="X", rules={"X": "F+[[X]-X]-F[-FX]+X", "F": "FF"}. Experiment with different angles (15°, 25°, 30°). Which looks most like bamboo?',
      successHint: 'Algorithmic art is a growing field at the intersection of mathematics, computer science, and aesthetics. NFTs, procedural game worlds, and architectural facades all use these techniques. The rules are simple; the output is infinite.',
    },
    {
      title: '3D geometry basics — from flat to spatial',
      concept: `The Japi exists in three-dimensional space. To work with it computationally, we need **3D geometry** — extending our 2D tools into the third dimension.

Key 3D concepts:
- **Points**: (x, y, z) — three coordinates instead of two
- **Vectors**: direction + magnitude in 3D. Used for surface normals, light direction, forces.
- **Dot product**: a·b = |a||b|cos(θ) — tells you the angle between two vectors
- **Cross product**: a×b — gives a vector perpendicular to both a and b (the surface normal)
- **Surface normal**: the direction a surface "faces" at a point. Crucial for lighting, shading, and collision detection.

For the Japi cone:
- Surface normal at any point tilts outward at the cone's half-angle from vertical
- The normal direction changes around the circumference but maintains the same tilt angle
- This is why rain hits every part of the Japi at the same angle — the symmetry of the surface normals

3D transformations:
- **Translation**: move an object (add to coordinates)
- **Rotation**: spin around an axis (multiply by rotation matrix)
- **Scaling**: resize (multiply coordinates)

These three operations, combined with **projection** (mapping 3D to 2D for display), are the foundation of all 3D computer graphics.`,
      analogy: '3D geometry is like going from a flat map to a globe. On a flat map (2D), you need two numbers to locate a city. On a globe (3D), you need three: latitude, longitude, and altitude. Everything gets harder — distance calculations, area calculations, rotations — but the underlying logic is the same, just with one more dimension.',
      storyConnection: 'The magic Japi was a 3D object that the craftsman shaped by hand. To recreate it digitally — for a 3D-printed replica, a virtual museum exhibit, or a game asset — we need to represent every point on its surface in (x, y, z) coordinates and compute surface normals for realistic lighting. The physical craft becomes digital through 3D geometry.',
      checkQuestion: 'A Japi has circular symmetry — you can rotate it around its vertical axis and it looks the same. How many unique numbers do you need to describe a point on the Japi\'s surface?',
      checkAnswer: 'Just two: the height z (from 0 to h) and the angle θ (from 0 to 2π). Because of the circular symmetry, the radius r is determined by z: r = R(1 - z/h). So any point is fully specified by (z, θ). This is why cones are called "surfaces of revolution" — they are 2D curves (the slant line) spun around an axis.',
      codeIntro: 'Generate a 3D wireframe model of the Japi with surface normals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Japi dimensions
R, H = 30, 15

# Create 3D mesh
theta = np.linspace(0, 2*np.pi, 40)
z_vals = np.linspace(0, H, 20)
Theta, Z = np.meshgrid(theta, z_vals)
R_mesh = R * (1 - Z / H)
X = R_mesh * np.cos(Theta)
Y = R_mesh * np.sin(Theta)

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

# --- View 1: Front ---
ax = axes[0]
ax.set_facecolor('#111827')
# Project 3D to 2D (front view: x vs z)
for i in range(len(z_vals)):
    ax.plot(X[i, :], Z[i, :], color='#f59e0b', linewidth=0.5, alpha=0.5)
for j in range(0, len(theta), 4):
    ax.plot(X[:, j], Z[:, j], color='#f59e0b', linewidth=0.5, alpha=0.5)
ax.set_title('Front View (X-Z)', color='white', fontsize=11)
ax.set_xlabel('X', color='white'); ax.set_ylabel('Z', color='white')
ax.set_aspect('equal'); ax.tick_params(colors='gray')

# --- View 2: Top ---
ax = axes[1]
ax.set_facecolor('#111827')
for i in range(0, len(z_vals), 2):
    ax.plot(X[i, :], Y[i, :], color='#f59e0b', linewidth=0.5, alpha=0.3 + 0.5*(1-i/len(z_vals)))
for j in range(0, len(theta), 4):
    ax.plot(X[:, j], Y[:, j], color='#f59e0b', linewidth=0.3, alpha=0.3)
ax.set_title('Top View (X-Y)', color='white', fontsize=11)
ax.set_xlabel('X', color='white'); ax.set_ylabel('Y', color='white')
ax.set_aspect('equal'); ax.tick_params(colors='gray')

# --- View 3: Isometric projection ---
ax = axes[2]
ax.set_facecolor('#111827')
# Simple isometric: x_proj = x - y*0.5, y_proj = z + y*0.25
iso_scale = 0.35
X_iso = X - Y * iso_scale * np.cos(np.pi/6)
Z_iso = Z + Y * iso_scale * np.sin(np.pi/6)

# Draw back half first (Y < 0), then front half
for half, alpha in [(Y < 0, 0.2), (Y >= 0, 0.6)]:
    for i in range(len(z_vals)):
        mask = half[i, :]
        # Find contiguous segments
        x_line = np.where(mask, X_iso[i, :], np.nan)
        z_line = np.where(mask, Z_iso[i, :], np.nan)
        ax.plot(x_line, z_line, color='#f59e0b', linewidth=0.5, alpha=alpha)
    for j in range(0, len(theta), 4):
        mask = half[:, j]
        x_line = np.where(mask, X_iso[:, j], np.nan)
        z_line = np.where(mask, Z_iso[:, j], np.nan)
        ax.plot(x_line, z_line, color='#f59e0b', linewidth=0.5, alpha=alpha)

# Surface normal arrows at a few points
for z_n in [3, 7, 12]:
    for theta_n in [0, np.pi/2, np.pi, 3*np.pi/2]:
        r_n = R * (1 - z_n / H)
        x_n = r_n * np.cos(theta_n)
        y_n = r_n * np.sin(theta_n)
        # Normal direction (outward + upward)
        half_angle = np.arctan(R / H)
        nx = np.cos(theta_n) * np.cos(half_angle)
        ny = np.sin(theta_n) * np.cos(half_angle)
        nz = np.sin(half_angle)
        # Project to iso
        x1 = x_n - y_n * iso_scale * np.cos(np.pi/6)
        z1 = z_n + y_n * iso_scale * np.sin(np.pi/6)
        x2 = (x_n + nx*5) - (y_n + ny*5) * iso_scale * np.cos(np.pi/6)
        z2 = (z_n + nz*5) + (y_n + ny*5) * iso_scale * np.sin(np.pi/6)
        if y_n >= 0:  # front half only
            ax.annotate('', xy=(x2, z2), xytext=(x1, z1),
                       arrowprops=dict(arrowstyle='->', color='#22c55e', lw=1.5))

ax.set_title('Isometric View + Surface Normals', color='white', fontsize=11)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("3D Japi mesh: {} vertices".format(len(z_vals) * len(theta)))
print(f"  {len(z_vals)} rings × {len(theta)} segments = {len(z_vals)*len(theta)} points")
print()
print("Surface normal direction (constant tilt angle):")
half_angle_deg = np.degrees(np.arctan(R / H))
print(f"  Tilt from vertical: {half_angle_deg:.1f}°")
print(f"  n = (cos(θ)·cos({half_angle_deg:.0f}°), sin(θ)·cos({half_angle_deg:.0f}°), sin({half_angle_deg:.0f}°))")
print()
print("3 views (front, top, isometric) fully describe the 3D shape.")
print("This is the basis of engineering drawings and CAD.")`,
      challenge: 'Add a decorative band to the Japi: highlight all mesh points where z is between 5 and 7 (a horizontal stripe). In a real 3D model, you would assign a different material or texture to this band.',
      successHint: 'From the Japi to skyscrapers to spacecraft, every 3D object designed on a computer starts with the same fundamentals: points in space, surface meshes, normals, and projections. Master these and you can model anything.',
    },
    {
      title: 'CAD and digital design — from craft to computation',
      concept: `**Computer-Aided Design (CAD)** is the modern evolution of the craftsman's tools. Where the Japi-maker uses bamboo strips, a sharp dao, and decades of experience, CAD software uses mathematical surfaces, boolean operations, and parametric constraints.

Key CAD concepts:
- **Parametric modeling**: define shapes using parameters (radius=30, height=15) so that changing one number updates the entire model
- **Boolean operations**: union (combine shapes), subtraction (cut holes), intersection (keep only overlap)
- **Extrusion**: push a 2D shape along a path to create a 3D solid
- **Revolution**: spin a 2D profile around an axis → the Japi is a revolved triangle
- **Fillets and chamfers**: round or bevel sharp edges
- **Assembly**: combine multiple parts into a complete model

To model a Japi in CAD:
1. Draw the cross-section triangle (radius 30, height 15)
2. Revolve it 360° around the vertical axis → cone
3. Shell it (make it hollow with a wall thickness of ~5mm)
4. Add decorative bands using offset surfaces and boolean cuts
5. Add the bamboo frame structure as separate solid bodies

This exact workflow applies to designing anything: cups, phone cases, car bodies, airplane wings. The geometry is always the same — profiles, revolutions, extrusions, booleans.`,
      analogy: 'CAD is like LEGO for grown-ups, but with infinite brick shapes. You combine simple primitives (cubes, cylinders, cones) using boolean operations (glue them together, cut holes) to build any shape. The difference from physical LEGO: every dimension is a number you can change, and the computer recomputes the entire model instantly.',
      storyConnection: 'If the magic Japi needed to be mass-produced — for a cultural festival, a museum gift shop, or a heritage preservation project — CAD would be the bridge from traditional craft to modern manufacturing. The craftsman\'s knowledge (proportions, weave patterns, material thickness) would become parametric values in a CAD model. The geometry travels intact from hand to computer.',
      checkQuestion: 'A 3D-printed Japi and a hand-woven Japi look similar. What fundamental structural difference makes the hand-woven version superior for actual rain protection?',
      checkAnswer: 'The hand-woven Japi uses interlocking bamboo strips — a woven structure where each strip supports its neighbors. This creates a flexible, resilient shell that can absorb impact and bend without breaking. A 3D-printed Japi is a monolithic shell — rigid, brittle, and prone to cracking. The weave pattern provides structural redundancy: if one strip breaks, the others hold. This is why woven structures (baskets, textiles, carbon fiber) are used wherever flexibility and toughness are needed.',
      codeIntro: 'Simulate CAD operations: create a Japi through revolution and boolean operations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('CAD Workflow: Building a Japi Digitally', color='white', fontsize=14, y=1.02)

# --- Step 1: 2D Profile ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot([0, 30, 0], [15, 0, 0], color='#f59e0b', linewidth=2.5)
ax.plot([0, 30], [0, 0], color='#f59e0b', linewidth=2.5, linestyle='--')
ax.axvline(0, color='gray', linewidth=0.5, linestyle=':')
ax.fill([0, 30, 0], [15, 0, 0], color='#f59e0b', alpha=0.1)
ax.annotate('Revolution axis', xy=(0, 7), xytext=(-8, 7),
            color='gray', fontsize=8, arrowprops=dict(arrowstyle='->', color='gray'))
ax.set_title('Step 1: 2D Profile', color='white', fontsize=10)
ax.set_aspect('equal'); ax.tick_params(colors='gray')

# --- Step 2: Revolve ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
theta = np.linspace(0, 2*np.pi, 80)
z_vals = np.linspace(0, 15, 30)
for z in z_vals[::3]:
    r = 30 * (1 - z/15)
    ax.plot(r * np.cos(theta), r * np.sin(theta), color='#f59e0b', linewidth=0.5, alpha=0.4)
ax.set_title('Step 2: Revolve 360°', color='white', fontsize=10)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- Step 3: Shell (hollow out) ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
wall = 2  # mm wall thickness (in cm scale = 0.5)
for z in z_vals[::3]:
    r_out = 30 * (1 - z/15)
    r_in = max(0, r_out - 0.5)
    ax.plot(r_out * np.cos(theta), r_out * np.sin(theta), color='#f59e0b', linewidth=0.5, alpha=0.4)
    if r_in > 0.5:
        ax.plot(r_in * np.cos(theta), r_in * np.sin(theta), color='#22c55e', linewidth=0.3, alpha=0.3)
ax.set_title('Step 3: Shell (hollow)', color='white', fontsize=10)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- Step 4: Add decorative bands ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
for z in z_vals[::3]:
    r = 30 * (1 - z/15)
    color = '#ef4444' if 4 < z < 6 or 9 < z < 11 else '#f59e0b'
    lw = 1.5 if 4 < z < 6 or 9 < z < 11 else 0.5
    ax.plot(r * np.cos(theta), r * np.sin(theta), color=color, linewidth=lw, alpha=0.6)
ax.set_title('Step 4: Decorative Bands', color='white', fontsize=10)
ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])

# --- Step 5: Parametric exploration ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
configs = [
    (30, 15, '#f59e0b', 'Standard (30, 15)'),
    (30, 30, '#3b82f6', 'Tall (30, 30)'),
    (40, 10, '#22c55e', 'Wide (40, 10)'),
    (20, 20, '#ef4444', 'Narrow (20, 20)'),
]
x_offset = 0
for r_c, h_c, col, label in configs:
    # Cross-section
    ax.plot([x_offset, x_offset + r_c, x_offset], [h_c, 0, 0],
            color=col, linewidth=2, label=label)
    ax.fill([x_offset, x_offset + r_c, x_offset], [h_c, 0, 0],
            color=col, alpha=0.1)
    x_offset += r_c + 5
ax.set_title('Step 5: Parametric Variations', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper right')
ax.tick_params(colors='gray')

# --- Step 6: Manufacturing data ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
params = ['Radius', 'Height', 'Slant', 'Wall thick.', 'Surface area', 'Volume']
values = [30, 15, 33.5, 0.5, 3157, 14137]
units = ['cm', 'cm', 'cm', 'cm', 'cm²', 'cm³']
y_pos = np.arange(len(params))
bars = ax.barh(y_pos, values, color=['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#a855f7', '#06b6d4'], height=0.6)
ax.set_yticks(y_pos)
ax.set_yticklabels(params, color='white', fontsize=9)
for bar, val, unit in zip(bars, values, units):
    ax.text(bar.get_width() + 50, bar.get_y() + bar.get_height()/2,
            f'{val} {unit}', va='center', color='white', fontsize=9)
ax.set_title('Step 6: Manufacturing Data', color='white', fontsize=10)
ax.tick_params(colors='gray')
ax.set_xlim(0, max(values) * 1.3)

plt.tight_layout()
plt.show()

print("CAD workflow for the Japi:")
print("  1. Draw 2D cross-section (triangle)")
print("  2. Revolve around axis → solid cone")
print("  3. Shell → hollow cone with wall thickness")
print("  4. Add decorative bands (offset surfaces)")
print("  5. Explore parametric variations")
print("  6. Export manufacturing data")
print()
print("The same workflow builds anything:")
print("  Cup = revolve a rectangle")
print("  Pipe = extrude a circle along a path")
print("  Phone case = complex boolean operations")`,
      challenge: 'If you change the Japi\'s radius from 30 to 40 cm but keep the height at 15 cm, how does the surface area change? How does the half-angle change? Compute both and explain which design is better for heavy monsoon rain.',
      successHint: 'CAD bridges traditional craft and modern manufacturing. The geometric knowledge encoded in a Japi-maker\'s hands — proportions, angles, curvatures — can be preserved digitally and shared globally. This is how traditional design enters the modern world without losing its mathematical soul.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Comfortable with basic geometry and coordinates</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for computational geometry. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
