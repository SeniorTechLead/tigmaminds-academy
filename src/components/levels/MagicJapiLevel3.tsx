import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MagicJapiLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Symmetry groups & geometric transformations',
      concept: `Every pattern you see on a Japi hat — or any decorative surface — is built from a small set of **geometric transformations**: translation, rotation, reflection, and glide reflection. A **symmetry** of a pattern is a transformation that maps the pattern onto itself. The set of all symmetries of a pattern forms a mathematical structure called a **group**, and understanding these groups is the key to classifying and generating patterns systematically.

A **translation** shifts every point by the same vector: (x, y) -> (x + dx, y + dy). A **rotation** turns every point around a center by an angle theta: (x, y) -> (x*cos(theta) - y*sin(theta), x*sin(theta) + y*cos(theta)). A **reflection** flips across a line (mirror axis). A **glide reflection** is a reflection followed by a translation along the mirror axis — like footprints in sand, alternating left and right.

These transformations can be represented as **matrices**. A 2D rotation by angle theta is the matrix [[cos(theta), -sin(theta)], [sin(theta), cos(theta)]]. A reflection across the x-axis is [[1, 0], [0, -1]]. Using **homogeneous coordinates** (adding a third coordinate), we can represent translations as matrices too: a translation by (dx, dy) becomes [[1, 0, dx], [0, 1, dy], [0, 0, 1]]. This unification means every geometric transformation is a matrix multiplication, making it easy to compose transformations and analyze their properties.`,
      analogy: 'Think of transformations like dance moves. A translation is sliding across the floor. A rotation is spinning. A reflection is doing the move in a mirror. A glide reflection is a sideways step followed by a mirror flip. Any complex dance routine (pattern) is just a sequence of these basic moves. The "symmetry group" is the complete choreography that brings you back to where you started.',
      storyConnection: 'The Japi — the iconic conical hat of Assam — is decorated with intricate geometric patterns. These patterns are not random; they follow precise symmetry rules developed over centuries of craft tradition. When a weaver creates a Japi pattern, she is unconsciously applying group theory — repeating a motif through specific transformations to fill the surface with beauty and mathematical order.',
      checkQuestion: 'A pattern has 6-fold rotational symmetry (invariant under 60-degree rotations) and 6 mirror lines. How many distinct symmetries does this pattern have? What symmetry group is this?',
      checkAnswer: 'The 6 rotations (0, 60, 120, 180, 240, 300 degrees) plus 6 reflections give 12 symmetries total. This is the dihedral group D6, the symmetry group of a regular hexagon. It is the most common symmetry group in traditional weaving because hexagonal tiling is natural for bamboo strip weaving on the Japi\'s conical surface.',
      codeIntro: 'Implement the four basic geometric transformations as matrix operations and visualize how a simple motif is transformed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def rotation_matrix(theta):
    """2D rotation matrix for angle theta (radians)."""
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, -s], [s, c]])

def reflection_matrix(axis_angle):
    """Reflection across a line at angle axis_angle from x-axis."""
    c, s = np.cos(2 * axis_angle), np.sin(2 * axis_angle)
    return np.array([[c, s], [s, -c]])

def apply_transform(points, matrix, translation=(0, 0)):
    """Apply a 2D transformation matrix + translation to a set of points."""
    transformed = points @ matrix.T
    return transformed + np.array(translation)

# Define a simple motif: a leaf-like shape (Assamese pattern element)
t = np.linspace(0, 2*np.pi, 100)
leaf_x = 0.3 * np.sin(t) * np.abs(np.cos(t))**0.5
leaf_y = 0.5 * np.cos(t) * (1 + 0.3 * np.sin(2*t))
motif = np.column_stack([leaf_x, leaf_y])

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Geometric Transformations: Building Blocks of Pattern',
             color='white', fontsize=14, fontweight='bold')

# Original
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.fill(motif[:, 0], motif[:, 1], color='#f59e0b', alpha=0.6, edgecolor='#f59e0b')
ax.set_title('Original motif', color='white', fontsize=11)
ax.set_xlim(-1.5, 1.5); ax.set_ylim(-1.5, 1.5); ax.set_aspect('equal')
ax.axhline(0, color='gray', lw=0.5); ax.axvline(0, color='gray', lw=0.5)

# Translation
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for dx in [0, 0.8, 1.6]:
    shifted = apply_transform(motif, np.eye(2), (dx, 0))
    ax.fill(shifted[:, 0], shifted[:, 1], color='#3b82f6', alpha=0.5, edgecolor='#3b82f6')
ax.set_title('Translation (dx = 0.8)', color='white', fontsize=11)
ax.set_xlim(-0.5, 2.5); ax.set_ylim(-1.5, 1.5); ax.set_aspect('equal')

# Rotation
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
colors_rot = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7', '#06b6d4']
for i in range(6):
    theta = i * np.pi / 3  # 60 degrees
    rotated = apply_transform(motif, rotation_matrix(theta))
    ax.fill(rotated[:, 0], rotated[:, 1], color=colors_rot[i], alpha=0.5, edgecolor=colors_rot[i])
ax.set_title('Rotation (6-fold, 60°)', color='white', fontsize=11)
ax.set_xlim(-1.5, 1.5); ax.set_ylim(-1.5, 1.5); ax.set_aspect('equal')

# Reflection
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ax.fill(motif[:, 0], motif[:, 1], color='#f59e0b', alpha=0.5, edgecolor='#f59e0b', label='Original')
reflected = apply_transform(motif, reflection_matrix(0))
ax.fill(reflected[:, 0], reflected[:, 1], color='#a855f7', alpha=0.5, edgecolor='#a855f7', label='Reflected')
ax.axhline(0, color='white', lw=2, linestyle='--', label='Mirror axis')
ax.set_title('Reflection (across x-axis)', color='white', fontsize=11)
ax.set_xlim(-1.5, 1.5); ax.set_ylim(-1.5, 1.5); ax.set_aspect('equal')
ax.legend(fontsize=8)

# Glide reflection
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for i in range(4):
    if i % 2 == 0:
        m = apply_transform(motif, np.eye(2), (i * 0.6, 0))
    else:
        m = apply_transform(motif, reflection_matrix(0), (i * 0.6, 0))
    col = '#22c55e' if i % 2 == 0 else '#ef4444'
    ax.fill(m[:, 0], m[:, 1], color=col, alpha=0.5, edgecolor=col)
ax.axhline(0, color='white', lw=1, linestyle='--')
ax.set_title('Glide reflection', color='white', fontsize=11)
ax.set_xlim(-0.5, 2.5); ax.set_ylim(-1.5, 1.5); ax.set_aspect('equal')

# Combined: D6 symmetry
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for i in range(6):
    theta = i * np.pi / 3
    # Rotation
    rot = apply_transform(motif * 0.6, rotation_matrix(theta), (0, 0))
    ax.fill(rot[:, 0], rot[:, 1], color=colors_rot[i], alpha=0.4, edgecolor=colors_rot[i])
    # Rotation + reflection
    ref = apply_transform(motif * 0.6, reflection_matrix(0) @ rotation_matrix(theta), (0, 0))
    ax.fill(ref[:, 0], ref[:, 1], color=colors_rot[i], alpha=0.2, edgecolor=colors_rot[i], linestyle='--')
ax.set_title('Full D6 symmetry (12 copies)', color='white', fontsize=11)
ax.set_xlim(-1.5, 1.5); ax.set_ylim(-1.5, 1.5); ax.set_aspect('equal')

plt.tight_layout()
plt.show()

print("Geometric Transformations Summary")
print("=" * 50)
print("Translation: shift by vector (dx, dy)")
print("Rotation:    rotate by angle theta around origin")
print("Reflection:  flip across a mirror axis")
print("Glide refl:  reflect + translate along mirror")
print()
print("Matrix representations:")
print(f"  Rotation 60°:\\\n{rotation_matrix(np.pi/3).round(3)}")
print(f"  Reflection (x-axis):\\\n{reflection_matrix(0).round(3)}")
print(f"  D6 group: 6 rotations + 6 reflections = 12 symmetries")`,
      challenge: 'Implement all 7 frieze groups (the only possible symmetry groups for a 1D repeating strip pattern). Generate a visual example of each using the leaf motif. Label each with its crystallographic notation (p1, p11m, p11g, p2, p2mm, p2mg, p2gm).',
      successHint: 'Every repeating pattern in every culture — from Assamese Japi weaving to Islamic tile work to Celtic knots — belongs to one of a finite number of symmetry groups. Mathematics does not constrain art; it reveals the hidden structure that makes art beautiful.',
    },
    {
      title: 'Tessellations & tiling theory',
      concept: `A **tessellation** is a covering of the plane by shapes with no gaps and no overlaps. The study of which shapes can tessellate, and how, is one of the oldest and most beautiful branches of mathematics. Any triangle tessellates the plane. Any quadrilateral tessellates the plane. But only three regular polygons tessellate by themselves: equilateral triangles, squares, and regular hexagons. This is because the interior angles must sum to exactly 360 degrees at each vertex.

For regular n-gons, the interior angle is (n-2)*180/n degrees. For triangles: 60 degrees (6 fit around a vertex: 6*60=360). For squares: 90 degrees (4 fit: 4*90=360). For hexagons: 120 degrees (3 fit: 3*120=360). For pentagons: 108 degrees, and 360/108 = 3.33 — not an integer, so regular pentagons cannot tessellate. The same argument rules out all regular n-gons with n >= 7.

**Semi-regular tessellations** (Archimedean tilings) use two or more types of regular polygon, with the same arrangement at every vertex. There are exactly 8 such tilings. The Japi's conical surface introduces an additional constraint: when you flatten a cone, you get a sector of a circle, and tessellations must be adapted to this curved geometry. This is why Japi patterns often use radial symmetry (patterns that radiate from the apex) combined with circumferential repetition.`,
      analogy: 'Tessellation is like tiling a bathroom floor. You go to the store and find tiles in different shapes. Square tiles are easy — they always fit. Hexagonal tiles work too. But pentagonal tiles leave frustrating gaps no matter how you arrange them. The mathematics of tessellation tells you before you buy tiles which shapes will work and which will waste your money (and your afternoon).',
      storyConnection: 'The Japi weaver works with bamboo strips, which naturally create a woven grid. The weaving pattern determines which tessellation appears on the surface. Traditional Japi patterns use variations of the hexagonal tessellation because the three-way weave of bamboo strips naturally creates a triangular/hexagonal grid — the weaving technology and the mathematics align perfectly.',
      checkQuestion: 'At a vertex of a tessellation, you find one regular hexagon, one square, and one triangle. Is this valid? What is the angle sum? What if you replace the triangle with a pentagon?',
      checkAnswer: 'Hexagon: 120°, square: 90°, triangle: 60°. Sum: 120+90+60=270° < 360°. Not valid by itself — there is a 90° gap. You would need another shape. With a pentagon instead: 120+90+108=318° — still a gap of 42°. No single regular polygon has a 42° angle. This vertex configuration cannot work with regular polygons alone, demonstrating the tight constraints on Archimedean tilings.',
      codeIntro: 'Generate and visualize the three regular tessellations and several semi-regular tessellations, analyzing their symmetry properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import RegularPolygon, Polygon
from matplotlib.collections import PatchCollection

def regular_polygon_vertices(n, center, radius, start_angle=0):
    """Get vertices of a regular n-gon."""
    angles = np.linspace(start_angle, start_angle + 2*np.pi, n, endpoint=False)
    return np.column_stack([center[0] + radius*np.cos(angles),
                           center[1] + radius*np.sin(angles)])

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Tessellations: The Mathematics of Tiling',
             color='white', fontsize=14, fontweight='bold')

# 1. Triangular tessellation
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
colors_tri = ['#3b82f6', '#22c55e']
s = 1.0  # side length
h = s * np.sqrt(3) / 2
for row in range(-2, 6):
    for col in range(-2, 8):
        x0 = col * s + (row % 2) * s/2
        y0 = row * h
        # Upward triangle
        tri_up = np.array([[x0, y0], [x0+s, y0], [x0+s/2, y0+h]])
        c_idx = (row + col) % 2
        ax.fill(tri_up[:, 0], tri_up[:, 1], color=colors_tri[c_idx], alpha=0.6,
                edgecolor='white', linewidth=0.5)
        # Downward triangle
        tri_dn = np.array([[x0+s/2, y0+h], [x0+s, y0], [x0+s+s/2, y0+h]])
        ax.fill(tri_dn[:, 0], tri_dn[:, 1], color=colors_tri[1-c_idx], alpha=0.6,
                edgecolor='white', linewidth=0.5)
ax.set_xlim(0, 5); ax.set_ylim(0, 4)
ax.set_title('Triangular (6 at vertex, 360°)', color='white', fontsize=10)
ax.set_aspect('equal')

# 2. Square tessellation
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
colors_sq = ['#f59e0b', '#ef4444']
for row in range(5):
    for col in range(6):
        c = colors_sq[(row + col) % 2]
        rect = plt.Rectangle((col, row), 1, 1, facecolor=c, alpha=0.6,
                             edgecolor='white', linewidth=0.5)
        ax.add_patch(rect)
ax.set_xlim(0, 5); ax.set_ylim(0, 4)
ax.set_title('Square (4 at vertex, 360°)', color='white', fontsize=10)
ax.set_aspect('equal')

# 3. Hexagonal tessellation
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
hex_colors = ['#a855f7', '#06b6d4', '#22c55e']
r = 0.55
for row in range(-1, 5):
    for col in range(-1, 6):
        x = col * r * 1.732
        y = row * r * 1.5
        if col % 2: y += r * 0.75
        c = hex_colors[(row + col) % 3]
        hex_patch = RegularPolygon((x, y), 6, radius=r, facecolor=c, alpha=0.6,
                                   edgecolor='white', linewidth=0.5, orientation=0)
        ax.add_patch(hex_patch)
ax.set_xlim(0, 5); ax.set_ylim(0, 4)
ax.set_title('Hexagonal (3 at vertex, 360°)', color='white', fontsize=10)
ax.set_aspect('equal')

# 4. Why pentagons fail
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
center = (2.5, 2)
r_p = 0.8
# Place 3 pentagons around a point
for i in range(3):
    angle = i * 2*np.pi/3 + np.pi/2
    cx = center[0] + r_p * 0.7 * np.cos(angle)
    cy = center[1] + r_p * 0.7 * np.sin(angle)
    verts = regular_polygon_vertices(5, (cx, cy), r_p, start_angle=angle - np.pi/5)
    ax.fill(verts[:, 0], verts[:, 1], color='#ef4444', alpha=0.4, edgecolor='white', linewidth=1.5)
# Highlight gap
ax.annotate('GAP!\\\n36° missing', xy=center, fontsize=11, color='#f59e0b',
            fontweight='bold', ha='center', va='center',
            bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#f59e0b'))
ax.set_xlim(0, 5); ax.set_ylim(0, 4)
ax.set_title('Pentagons: 3×108°=324° (gap!)', color='white', fontsize=10)
ax.set_aspect('equal')

# 5. Angle analysis chart
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
n_gons = range(3, 13)
angles = [(n-2)*180/n for n in n_gons]
fits = [360/a for a in angles]
colors_bar = ['#22c55e' if f == int(f) else '#ef4444' for f in fits]
bars = ax.bar([str(n) for n in n_gons], fits, color=colors_bar, alpha=0.8)
ax.axhline(3, color='white', linewidth=0.5, linestyle=':', alpha=0.5)
ax.axhline(4, color='white', linewidth=0.5, linestyle=':', alpha=0.5)
ax.axhline(6, color='white', linewidth=0.5, linestyle=':', alpha=0.5)
ax.set_xlabel('Number of sides (n)', color='white')
ax.set_ylabel('360° / interior angle', color='white')
ax.set_title('Green = integer = tessellates', color='white', fontsize=10)
for bar, f in zip(bars, fits):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
            f'{f:.1f}', ha='center', color='white', fontsize=8)

# 6. Japi conical pattern
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Radial tessellation on a circular surface (flattened cone)
n_rings = 6
n_segments = 12
japi_colors = ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#06b6d4']
for ring in range(n_rings):
    r_inner = ring * 0.3
    r_outer = (ring + 1) * 0.3
    n_seg = n_segments * (ring + 1) // 2 if ring > 0 else 6
    for seg in range(n_seg):
        theta1 = seg * 2*np.pi / n_seg
        theta2 = (seg + 1) * 2*np.pi / n_seg
        thetas = np.linspace(theta1, theta2, 20)
        inner_arc = np.column_stack([r_inner*np.cos(thetas), r_inner*np.sin(thetas)])
        outer_arc = np.column_stack([r_outer*np.cos(thetas[::-1]), r_outer*np.sin(thetas[::-1])])
        verts = np.vstack([inner_arc, outer_arc])
        c = japi_colors[(ring + seg) % len(japi_colors)]
        ax.fill(verts[:, 0], verts[:, 1], color=c, alpha=0.5, edgecolor='white', linewidth=0.3)
ax.set_xlim(-2, 2); ax.set_ylim(-2, 2)
ax.set_title('Japi: radial tessellation on cone', color='white', fontsize=10)
ax.set_aspect('equal')

plt.tight_layout()
plt.show()

print("Tessellation Analysis")
print("=" * 50)
print(f"{'n-gon':<8} {'Interior°':<12} {'360°/angle':<12} {'Tessellates?'}")
print("-" * 50)
for n in range(3, 10):
    a = (n-2)*180/n
    f = 360/a
    tess = "YES" if abs(f - round(f)) < 0.001 else "no"
    print(f"{n:<8} {a:<12.1f} {f:<12.2f} {tess}")
print()
print("Only 3 regular tessellations exist (triangle, square, hexagon).")
print("The Japi uses radial adaptations of hexagonal patterns.")`,
      challenge: 'Generate all 8 semi-regular (Archimedean) tessellations. For each, specify the vertex configuration (e.g., 3.3.3.3.6 means three triangles and a hexagon meet at each vertex) and verify that the angle sum is exactly 360 degrees.',
      successHint: 'Tessellation theory explains why certain patterns appear across cultures worldwide — not because of cultural contact, but because mathematics permits only a finite number of regular and semi-regular tilings. The Japi weaver and the Islamic tile-maker discover the same tessellations independently because the geometry demands it.',
    },
    {
      title: 'Affine transformations & homogeneous coordinates',
      concept: `To build a pattern generator, we need a unified framework for composing transformations. **Affine transformations** include all combinations of linear transformations (rotation, scaling, reflection, shear) and translation. They preserve parallel lines and ratios of distances along lines, but not necessarily angles or distances themselves.

In standard 2D coordinates, a linear transformation is a matrix multiplication: [x', y'] = M * [x, y]. But translation cannot be expressed as matrix multiplication in 2D — it requires addition: [x', y'] = M * [x, y] + [tx, ty]. This asymmetry is inconvenient because we cannot simply multiply matrices to compose transformations. **Homogeneous coordinates** solve this by adding a third coordinate: we represent (x, y) as (x, y, 1). Now all affine transformations are 3x3 matrices.

Rotation by theta: [[cos, -sin, 0], [sin, cos, 0], [0, 0, 1]]. Translation by (tx, ty): [[1, 0, tx], [0, 1, ty], [0, 0, 1]]. Scaling by (sx, sy): [[sx, 0, 0], [0, sy, 0], [0, 0, 1]]. The beauty is that composing transformations is just matrix multiplication: applying rotation then translation is T_translate @ T_rotate. Order matters — rotation then translation gives a different result than translation then rotation. This is because matrix multiplication is not commutative.`,
      analogy: 'Homogeneous coordinates are like using a universal adapter for electrical plugs. Without it, you need different methods for different transformations (multiplication for rotation, addition for translation). With the adapter (the extra coordinate), everything plugs into the same socket (matrix multiplication). The adapter itself adds no information — the third coordinate is always 1 — but it makes everything compatible.',
      storyConnection: 'To generate the Japi\'s patterns computationally, we need to express the weaver\'s operations (shift the motif, rotate it, mirror it) as a sequence of matrix multiplications. Each bamboo strip crossing on the Japi can be described as the original motif transformed by a specific affine matrix — and the entire pattern is the set of all such matrices applied to the base motif.',
      checkQuestion: 'You want to rotate a motif 45 degrees around the point (3, 2) — not the origin. What sequence of three affine transformations achieves this?',
      checkAnswer: 'Step 1: Translate so (3, 2) moves to the origin: T1 with (tx, ty) = (-3, -2). Step 2: Rotate 45 degrees: R. Step 3: Translate back: T2 with (tx, ty) = (3, 2). The combined matrix is T2 @ R @ T1. This "translate-rotate-translate" pattern is fundamental — rotation around any point reduces to rotation around the origin with translations bookending it.',
      codeIntro: 'Build a complete affine transformation library and demonstrate composition of transformations to create complex patterns from simple motifs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class AffineTransform:
    """Affine transformation using 3x3 homogeneous matrices."""
    def __init__(self, matrix=None):
        self.M = matrix if matrix is not None else np.eye(3)

    @staticmethod
    def identity():
        return AffineTransform(np.eye(3))

    @staticmethod
    def translate(tx, ty):
        return AffineTransform(np.array([[1, 0, tx], [0, 1, ty], [0, 0, 1]], dtype=float))

    @staticmethod
    def rotate(theta, cx=0, cy=0):
        """Rotate by theta radians around (cx, cy)."""
        c, s = np.cos(theta), np.sin(theta)
        R = np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], dtype=float)
        if cx == 0 and cy == 0:
            return AffineTransform(R)
        T1 = AffineTransform.translate(-cx, -cy)
        T2 = AffineTransform.translate(cx, cy)
        return T2.compose(AffineTransform(R)).compose(T1)

    @staticmethod
    def scale(sx, sy=None, cx=0, cy=0):
        if sy is None: sy = sx
        S = np.array([[sx, 0, 0], [0, sy, 0], [0, 0, 1]], dtype=float)
        if cx == 0 and cy == 0:
            return AffineTransform(S)
        T1 = AffineTransform.translate(-cx, -cy)
        T2 = AffineTransform.translate(cx, cy)
        return T2.compose(AffineTransform(S)).compose(T1)

    @staticmethod
    def reflect(axis_angle):
        c, s = np.cos(2*axis_angle), np.sin(2*axis_angle)
        return AffineTransform(np.array([[c, s, 0], [s, -c, 0], [0, 0, 1]], dtype=float))

    def compose(self, other):
        """self after other: first apply other, then self."""
        return AffineTransform(self.M @ other.M)

    def apply(self, points):
        """Apply to Nx2 array of points."""
        homo = np.column_stack([points, np.ones(len(points))])
        result = (self.M @ homo.T).T
        return result[:, :2]

# Define a motif: Assamese floral element
t = np.linspace(0, 2*np.pi, 80)
petal_x = 0.15 * np.sin(t) * (1 + 0.5*np.cos(3*t))
petal_y = 0.3 * np.cos(t) + 0.15
motif = np.column_stack([petal_x, petal_y])

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Affine Transformations: Composing Patterns',
             color='white', fontsize=14, fontweight='bold')

# 1. Rotation around origin vs around point
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
colors6 = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#06b6d4']
# Flower from 6 rotated petals
for i in range(6):
    T = AffineTransform.rotate(i * np.pi/3)
    petal = T.apply(motif)
    ax.fill(petal[:, 0], petal[:, 1], color=colors6[i], alpha=0.6, edgecolor='white', lw=0.5)
ax.set_title('6-fold rotation (flower)', color='white', fontsize=10)
ax.set_xlim(-0.6, 0.6); ax.set_ylim(-0.6, 0.6); ax.set_aspect('equal')

# 2. Translation lattice
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for row in range(4):
    for col in range(5):
        T = AffineTransform.translate(col * 0.7, row * 0.8)
        flower_pts = []
        for i in range(6):
            R = AffineTransform.rotate(i * np.pi/3)
            petal = T.compose(R).apply(motif * 0.5)
            ax.fill(petal[:, 0], petal[:, 1], color=colors6[i], alpha=0.4, edgecolor='none')
ax.set_title('Translation lattice of flowers', color='white', fontsize=10)
ax.set_xlim(-0.3, 3.3); ax.set_ylim(-0.3, 3)
ax.set_aspect('equal')

# 3. Scaling series
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for j, s in enumerate([0.5, 1.0, 1.5, 2.0, 2.5]):
    for i in range(6):
        T = AffineTransform.scale(s).compose(AffineTransform.rotate(i*np.pi/3))
        petal = T.apply(motif)
        ax.fill(petal[:, 0], petal[:, 1], color=colors6[i], alpha=0.3, edgecolor=colors6[i], lw=0.3)
ax.set_title('Nested scaling (fractal-like)', color='white', fontsize=10)
ax.set_xlim(-1, 1); ax.set_ylim(-1, 1); ax.set_aspect('equal')

# 4. Composition demo: order matters
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Rotate then translate
T_rt = AffineTransform.translate(1, 0).compose(AffineTransform.rotate(np.pi/4))
pts_rt = T_rt.apply(motif)
ax.fill(pts_rt[:, 0], pts_rt[:, 1], color='#22c55e', alpha=0.6, label='Rotate then translate')
# Translate then rotate
T_tr = AffineTransform.rotate(np.pi/4).compose(AffineTransform.translate(1, 0))
pts_tr = T_tr.apply(motif)
ax.fill(pts_tr[:, 0], pts_tr[:, 1], color='#ef4444', alpha=0.6, label='Translate then rotate')
ax.fill(motif[:, 0], motif[:, 1], color='gray', alpha=0.3, label='Original')
ax.set_title('Order matters! (A@B != B@A)', color='white', fontsize=10)
ax.set_xlim(-1.5, 1.5); ax.set_ylim(-1, 1.5); ax.set_aspect('equal')
ax.legend(fontsize=7)

# 5. Wallpaper pattern using composed transforms
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# p6m wallpaper group (hexagonal with mirrors)
for row in range(-2, 3):
    for col in range(-2, 4):
        cx = col * 0.9 + (row % 2) * 0.45
        cy = row * 0.78
        for i in range(6):
            T = AffineTransform.translate(cx, cy).compose(
                AffineTransform.rotate(i*np.pi/3))
            p = T.apply(motif * 0.4)
            ax.fill(p[:, 0], p[:, 1], color=colors6[i], alpha=0.4, edgecolor='none')
            # Mirror
            T2 = AffineTransform.translate(cx, cy).compose(
                AffineTransform.reflect(i*np.pi/6)).compose(
                AffineTransform.rotate(i*np.pi/3))
            p2 = T2.apply(motif * 0.4)
            ax.fill(p2[:, 0], p2[:, 1], color=colors6[i], alpha=0.2, edgecolor='none')
ax.set_xlim(-0.5, 3); ax.set_ylim(-1, 2)
ax.set_title('p6m wallpaper group', color='white', fontsize=10)
ax.set_aspect('equal')

# 6. Matrix composition chain
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Show how a single complex transform decomposes
T_complex = (AffineTransform.translate(1.5, 1)
    .compose(AffineTransform.rotate(np.pi/6, 1.5, 1))
    .compose(AffineTransform.scale(1.5, 1.5, 1.5, 1)))
for step, (label, T) in enumerate([
    ('Original', AffineTransform.identity()),
    ('Scale 1.5x', AffineTransform.scale(1.5)),
    ('+ Rotate 30°', AffineTransform.rotate(np.pi/6).compose(AffineTransform.scale(1.5))),
    ('+ Translate', T_complex),
]):
    pts = T.apply(motif)
    ax.fill(pts[:, 0], pts[:, 1], color=colors6[step], alpha=0.5,
            edgecolor=colors6[step], label=label)
ax.set_title('Transform composition chain', color='white', fontsize=10)
ax.set_xlim(-0.5, 3); ax.set_ylim(-0.5, 2.5); ax.set_aspect('equal')
ax.legend(fontsize=7, loc='lower right')

plt.tight_layout()
plt.show()

print("Affine Transform Library Demonstrated")
print("=" * 50)
print("Supported transforms: translate, rotate, scale, reflect")
print("All represented as 3x3 homogeneous matrices")
print("Composition: A.compose(B) = apply B first, then A")
print("Key insight: order of composition matters!")
print()
T_example = AffineTransform.rotate(np.pi/4).compose(AffineTransform.translate(1, 0))
print(f"Example composed matrix (translate then rotate 45°):")
print(T_example.M.round(3))`,
      challenge: 'Implement shear transformations (shear_x and shear_y) as additional methods of the AffineTransform class. Show that shear preserves area but not angles. Combine shear with rotation to create an oblique lattice pattern (like a parallelogram tiling).',
      successHint: 'Homogeneous coordinates and affine transformations are the foundation of all computer graphics. Every time you zoom, pan, or rotate an image, these exact matrices are being multiplied behind the scenes. The Japi pattern generator we are building uses the same mathematics as Photoshop and video game engines.',
    },
    {
      title: 'The 17 wallpaper groups',
      concept: `In 1891, the Russian crystallographer Evgraf Fedorov proved one of the most elegant results in mathematics: there are exactly **17 distinct wallpaper groups** — 17 fundamentally different ways to repeat a 2D pattern. Every repeating pattern ever created, in any culture, in any medium, belongs to one of these 17 groups. This is not an approximation or a convention — it is a mathematical theorem.

Each wallpaper group is defined by its set of symmetries: which rotations (2-fold, 3-fold, 4-fold, or 6-fold), reflections, and glide reflections it contains, combined with a translation lattice (oblique, rectangular, rhombic, square, or hexagonal). The notation encodes these symmetries: **p1** has only translations (the simplest group). **p6m** has 6-fold rotations, mirror lines, and glide reflections (the most complex, with 12 symmetry operations per unit cell). **p4g** has 4-fold rotation with glide reflections but some mirrors missing.

To classify a pattern, you ask a series of questions: What is the highest order of rotational symmetry? Are there reflections? Are all rotation centers on reflection axes? Are there glide reflections that are not reflections? This decision tree uniquely identifies the wallpaper group. Remarkably, all 17 groups appear in the Alhambra palace in Granada, Spain — Islamic artists discovered them all empirically, centuries before the mathematical proof of completeness.`,
      analogy: 'The 17 wallpaper groups are like the 17 possible rhythmic signatures for a repeating drum beat. You can combine quarter notes, eighth notes, and rests in infinitely many ways within a measure, but if the measure must repeat identically, there are only 17 fundamentally different metric structures. A drummer might not know music theory, but every beat she plays falls into one of these 17 categories.',
      storyConnection: 'Traditional Assamese textile patterns — mekhela sadors, gamosas, and Japi decorations — use a subset of the 17 wallpaper groups. The most common are p1 (simple translation), pm (mirror symmetry), p6m (hexagonal with mirrors), and p31m (3-fold with some mirrors). A mathematical analysis of Assamese crafts would reveal which wallpaper groups are culturally preferred and which are absent.',
      checkQuestion: 'A pattern has 3-fold rotational symmetry and mirror lines, with all rotation centers lying on mirror lines. Which wallpaper group is this? If the rotation centers were NOT on mirror lines, which group would it be instead?',
      checkAnswer: 'With 3-fold rotation and all rotation centers on mirrors: p3m1. With 3-fold rotation and rotation centers NOT on mirrors: p31m. These two groups look similar but have a subtle structural difference: in p3m1, every rotation is also a symmetry of the mirror pattern. In p31m, some rotations map mirrors to non-mirror positions. The distinction matters for pattern generation because the unit cell has different constraints in each case.',
      codeIntro: 'Implement pattern generators for several wallpaper groups and visualize the differences between them.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class PatternGenerator:
    """Generate wallpaper patterns from a motif and symmetry group."""

    def __init__(self, motif):
        self.motif = motif  # Nx2 array

    def _apply(self, M, t=(0,0)):
        pts = self.motif @ M[:2,:2].T + np.array(t)
        return pts

    def p1(self, a1, a2, nx, ny):
        """Simplest group: translation only."""
        all_pts = []
        for i in range(nx):
            for j in range(ny):
                t = i * np.array(a1) + j * np.array(a2)
                all_pts.append(self.motif + t)
        return all_pts

    def p2(self, a1, a2, nx, ny):
        """2-fold rotation."""
        all_pts = []
        R180 = np.array([[-1, 0], [0, -1]])
        for i in range(nx):
            for j in range(ny):
                t = i * np.array(a1) + j * np.array(a2)
                all_pts.append(self.motif + t)
                all_pts.append(self.motif @ R180.T + t + np.array(a1)/2 + np.array(a2)/2)
        return all_pts

    def pm(self, a1, a2, nx, ny):
        """Mirror symmetry along a2 direction."""
        all_pts = []
        Mx = np.array([[-1, 0], [0, 1]])
        for i in range(nx):
            for j in range(ny):
                t = i * np.array(a1) + j * np.array(a2)
                all_pts.append(self.motif + t)
                all_pts.append(self.motif @ Mx.T + t + np.array(a1)/2)
        return all_pts

    def p4(self, a, nx, ny):
        """4-fold rotation on square lattice."""
        all_pts = []
        for k in range(4):
            theta = k * np.pi / 2
            R = np.array([[np.cos(theta), -np.sin(theta)],
                         [np.sin(theta), np.cos(theta)]])
            for i in range(nx):
                for j in range(ny):
                    t = np.array([i * a, j * a])
                    all_pts.append(self.motif @ R.T + t)
        return all_pts

    def p6(self, a, nx, ny):
        """6-fold rotation on hexagonal lattice."""
        all_pts = []
        a1 = np.array([a, 0])
        a2 = np.array([a/2, a*np.sqrt(3)/2])
        for k in range(6):
            theta = k * np.pi / 3
            R = np.array([[np.cos(theta), -np.sin(theta)],
                         [np.sin(theta), np.cos(theta)]])
            for i in range(-1, nx+1):
                for j in range(-1, ny+1):
                    t = i * a1 + j * a2
                    all_pts.append(self.motif @ R.T + t)
        return all_pts

# Create asymmetric motif (to show symmetries clearly)
t = np.linspace(0, 1, 40)
mx = 0.08 * np.sin(2*np.pi*t) + 0.05 * t
my = 0.15 * t * (1 - t) * 4
motif = np.column_stack([mx, my])

gen = PatternGenerator(motif)

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Wallpaper Groups: 6 of the 17 Possible Symmetries',
             color='white', fontsize=14, fontweight='bold')

groups = [
    ('p1 — translation only', gen.p1((0.3, 0), (0, 0.3), 10, 10)),
    ('p2 — 2-fold rotation', gen.p2((0.3, 0), (0, 0.3), 8, 8)),
    ('pm — mirror', gen.pm((0.3, 0), (0, 0.3), 8, 8)),
    ('p4 — 4-fold rotation', gen.p4(0.3, 8, 8)),
    ('p6 — 6-fold rotation', gen.p6(0.5, 5, 5)),
]

group_colors = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444']

for idx, ((name, patches), col) in enumerate(zip(groups, group_colors)):
    ax = axes.flat[idx]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    for pts in patches:
        ax.fill(pts[:, 0], pts[:, 1], color=col, alpha=0.5, edgecolor=col, linewidth=0.3)
    ax.set_xlim(0, 2.5)
    ax.set_ylim(0, 2.5)
    ax.set_aspect('equal')
    ax.set_title(name, color='white', fontsize=10)

# Classification flowchart info
ax = axes.flat[5]
ax.set_facecolor('#111827')
ax.axis('off')
info = """WALLPAPER GROUP CLASSIFICATION

17 groups total, distinguished by:
  - Rotation order: 1, 2, 3, 4, or 6
  - Reflections: present or absent
  - Glide reflections: present or absent
  - Lattice type: oblique, rectangular,
    rhombic, square, hexagonal

Rotation 1: p1, pm, pg, cm
Rotation 2: p2, pmm, pmg, pgg, cmm
Rotation 3: p3, p3m1, p31m
Rotation 4: p4, p4m, p4g
Rotation 6: p6, p6m

Every repeating 2D pattern belongs
to exactly one of these 17 groups.
"""
ax.text(0.05, 0.95, info, transform=ax.transAxes, fontsize=9, color='white',
        fontfamily='monospace', verticalalignment='top')

plt.tight_layout()
plt.show()

print("Wallpaper Groups Demonstrated")
print("=" * 50)
print("Group   Rotations  Mirrors  Glides  Lattice")
print("-" * 50)
data = [
    ("p1", "none", "no", "no", "oblique"),
    ("p2", "2-fold", "no", "no", "oblique"),
    ("pm", "none", "yes", "no", "rectangular"),
    ("p4", "4-fold", "no", "no", "square"),
    ("p6", "6-fold", "no", "no", "hexagonal"),
    ("p6m", "6-fold", "yes", "yes", "hexagonal"),
]
for name, rot, mir, gli, lat in data:
    print(f"  {name:<6} {rot:<10} {mir:<8} {gli:<7} {lat}")`,
      challenge: 'Implement p6m (the most complex wallpaper group, with 6-fold rotation plus mirrors). Generate a pattern that resembles traditional Assamese textile motifs. Then classify 5 real wallpaper/textile patterns by photographing them and applying the classification decision tree.',
      successHint: 'The 17 wallpaper groups are a complete classification — there will never be an 18th. This mathematical certainty underlies all repeating pattern design, from ancient mosaics to modern digital wallpaper to the atomic structure of crystals.',
    },
    {
      title: 'Conical geometry & the Japi surface',
      concept: `The Japi is a cone, not a flat surface. Patterns that look regular on a flat plane become distorted when wrapped onto a cone. Understanding **conical geometry** is essential for designing patterns that appear correct on the finished hat. When you cut a cone along a straight line from apex to base and flatten it, you get a **sector** of a circle. The sector angle theta = 2*pi*r/s, where r is the base radius and s is the slant height.

For a typical Japi with base radius 25 cm and slant height 30 cm: theta = 2*pi*25/30 = 5.24 radians = 300 degrees. The missing 60 degrees is the "overlap" that creates the conical shape. A pattern designed on this sector must account for the fact that circumferential distances vary with height — at the apex, the circumference is zero, and it increases linearly to 2*pi*r at the base.

This means a pattern element that appears the same size everywhere on the flat sector will appear **larger near the base** and **smaller near the apex** on the actual cone. To maintain visual uniformity, pattern elements must be scaled inversely with their distance from the apex. Additionally, the number of pattern repeats around each ring must be chosen to maintain even spacing. If you want 12 repeats at the base, you might need only 6 at the halfway point and none at the apex. This radial gradation is a hallmark of good Japi design.`,
      analogy: 'Wrapping a flat pattern onto a cone is like putting a flat map onto a globe (cartographic projection). On a Mercator map, Greenland looks as big as Africa, even though Africa is 14 times larger. The distortion happens because the map preserves angles but distorts areas. Similarly, a pattern designed flat and wrapped onto a cone will have correct angles at each point but distorted sizes — large at the base, cramped at the apex. Correcting for this is the same problem map-makers face.',
      storyConnection: 'The magic of the Japi in the story is that its patterns seem to shift and dance as you view it from different angles. This visual magic has a geometric explanation: the conical surface means the same pattern appears differently depending on your viewing angle. A motif that looks circular from the side appears elliptical from above. The weaver accounts for this by adjusting the pattern to look best from the most common viewing angle.',
      checkQuestion: 'A Japi has base radius 20 cm, apex angle 60 degrees (half-angle 30 degrees), and slant height 40 cm. What is the sector angle when flattened? How many identical motifs can fit around the base ring and around a ring at half-height?',
      checkAnswer: 'Sector angle = 2*pi*r/s = 2*pi*20/40 = pi radians = 180 degrees (a semicircle). At the base, the arc length is pi*40 = 125.7 cm. At half-height (slant distance 20), the arc length is pi*20 = 62.8 cm. If each motif is 10 cm wide: base ring fits 12 motifs, half-height ring fits 6 motifs. The pattern must halve its repeat count at each halving of distance from the apex.',
      codeIntro: 'Model the Japi as a cone, compute the sector geometry, and design patterns that account for conical distortion.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Japi dimensions (typical)
R_base = 0.25    # base radius (m)
H = 0.20         # height (m)
slant = np.sqrt(R_base**2 + H**2)  # slant height
half_angle = np.arctan(R_base / H)   # cone half-angle
sector_angle = 2 * np.pi * R_base / slant  # flattened sector angle

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Japi Conical Geometry: From Flat Pattern to 3D Surface',
             color='white', fontsize=14, fontweight='bold')

# 1. Cone cross-section
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Draw cone profile
ax.plot([-R_base*100, 0, R_base*100], [0, H*100, 0], color='#f59e0b', linewidth=3)
ax.plot([-R_base*100, R_base*100], [0, 0], color='#f59e0b', linewidth=2)
ax.annotate(f'R = {R_base*100:.0f} cm', xy=(R_base*50, -1), color='white', fontsize=9, ha='center')
ax.annotate(f'H = {H*100:.0f} cm', xy=(1, H*50), color='white', fontsize=9)
ax.annotate(f'slant = {slant*100:.1f} cm', xy=(R_base*50 + 2, H*50), color='#3b82f6', fontsize=9, rotation=-55)
ax.set_xlabel('Width (cm)', color='white')
ax.set_ylabel('Height (cm)', color='white')
ax.set_title('Japi cone profile', color='white', fontsize=11)
ax.set_aspect('equal')

# 2. Flattened sector
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
theta_range = np.linspace(-sector_angle/2, sector_angle/2, 200)
# Outer arc (base)
ax.plot(slant*100*np.cos(theta_range), slant*100*np.sin(theta_range), color='#f59e0b', linewidth=2)
# Lines from origin to ends
for t in [-sector_angle/2, sector_angle/2]:
    ax.plot([0, slant*100*np.cos(t)], [0, slant*100*np.sin(t)], color='#f59e0b', linewidth=2)
# Inner rings at different heights
ring_fracs = [0.25, 0.5, 0.75]
ring_colors = ['#ef4444', '#22c55e', '#3b82f6']
for frac, col in zip(ring_fracs, ring_colors):
    r = slant * 100 * frac
    ax.plot(r*np.cos(theta_range), r*np.sin(theta_range), color=col, linewidth=1.5, linestyle='--',
            label=f'{frac*100:.0f}% height')
ax.set_title(f'Flattened sector ({np.degrees(sector_angle):.0f}°)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.legend(fontsize=8)

# 3. Pattern on flat sector
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Place motifs on rings with appropriate repeat counts
japi_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
n_rings = 5
for ring in range(1, n_rings + 1):
    r = slant * 100 * ring / (n_rings + 1)
    # Number of repeats proportional to ring circumference
    arc_len = r * sector_angle
    n_motifs = max(3, int(arc_len / 5))  # one motif per ~5 cm
    for m in range(n_motifs):
        theta = -sector_angle/2 + (m + 0.5) * sector_angle / n_motifs
        x = r * np.cos(theta)
        y = r * np.sin(theta)
        # Size decreases toward apex
        size = 1.5 * ring / (n_rings + 1)
        diamond = np.array([[0, size], [size*0.4, 0], [0, -size], [-size*0.4, 0], [0, size]])
        # Rotate to be tangent to ring
        c, s = np.cos(theta + np.pi/2), np.sin(theta + np.pi/2)
        R = np.array([[c, -s], [s, c]])
        rotated = diamond @ R.T + [x, y]
        ax.fill(rotated[:, 0], rotated[:, 1], color=japi_colors[ring-1], alpha=0.6, edgecolor='white', lw=0.3)
# Draw sector outline
ax.plot(slant*100*np.cos(theta_range), slant*100*np.sin(theta_range), color='#f59e0b', linewidth=1.5)
for t in [-sector_angle/2, sector_angle/2]:
    ax.plot([0, slant*100*np.cos(t)], [0, slant*100*np.sin(t)], color='#f59e0b', linewidth=1.5)
ax.set_title('Pattern on flat sector (sized for cone)', color='white', fontsize=10)
ax.set_aspect('equal')

# 4. 3D cone visualization (top view)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
for ring in range(1, n_rings + 1):
    r = R_base * 100 * ring / (n_rings + 1)
    theta_full = np.linspace(0, 2*np.pi, 200)
    ax.plot(r*np.cos(theta_full), r*np.sin(theta_full), color=japi_colors[ring-1], linewidth=0.5, alpha=0.3)
    n_motifs = max(3, int(2*np.pi*r / 5))
    for m in range(n_motifs):
        theta = m * 2*np.pi / n_motifs
        x, y = r * np.cos(theta), r * np.sin(theta)
        size = 1.0 * ring / (n_rings + 1)
        circle = plt.Circle((x, y), size, color=japi_colors[ring-1], alpha=0.4)
        ax.add_patch(circle)
ax.set_xlim(-30, 30); ax.set_ylim(-30, 30)
ax.set_aspect('equal')
ax.set_title('Top view: pattern on 3D cone', color='white', fontsize=10)

# 5. Distortion analysis
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
heights = np.linspace(0.05, 1.0, 20)  # fraction from apex
circumference = 2 * np.pi * R_base * 100 * heights
motif_size_uniform = np.full_like(heights, 3.0)  # uniform on flat
motif_size_corrected = 3.0 * heights  # corrected for cone

ax.plot(heights * 100, circumference, color='#3b82f6', linewidth=2, label='Ring circumference (cm)')
ax.plot(heights * 100, motif_size_uniform * 20, color='#ef4444', linewidth=2, linestyle='--',
        label='Uniform motif (distorted)')
ax.plot(heights * 100, motif_size_corrected * 20, color='#22c55e', linewidth=2,
        label='Corrected motif (uniform appear.)')
ax.set_xlabel('Distance from apex (%)', color='white')
ax.set_ylabel('Size / Circumference', color='white')
ax.set_title('Distortion correction: motif scaling', color='white', fontsize=10)
ax.legend(fontsize=8)

# 6. Repeat count by ring
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
ring_distances = np.arange(1, 11)
target_spacing = 5  # cm between motifs
repeats = np.round(2 * np.pi * R_base * 100 * ring_distances / 10 / target_spacing).astype(int)
repeats = np.maximum(repeats, 1)
ax.bar(ring_distances, repeats, color='#a855f7', alpha=0.8)
ax.set_xlabel('Ring number (1=near apex, 10=base)', color='white')
ax.set_ylabel('Number of motif repeats', color='white')
ax.set_title(f'Repeat count per ring (~{target_spacing}cm spacing)', color='white', fontsize=10)
for i, r in enumerate(repeats):
    ax.text(ring_distances[i], r + 0.3, str(r), ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Japi Cone Geometry")
print("=" * 45)
print(f"Base radius: {R_base*100:.1f} cm")
print(f"Height: {H*100:.1f} cm")
print(f"Slant height: {slant*100:.1f} cm")
print(f"Half-angle: {np.degrees(half_angle):.1f}°")
print(f"Sector angle: {np.degrees(sector_angle):.1f}°")
print(f"Missing angle: {360 - np.degrees(sector_angle):.1f}°")
print()
print("Motif count per ring (5cm target spacing):")
for i, r in enumerate(repeats):
    circ = 2*np.pi*R_base*100*(i+1)/10
    print(f"  Ring {i+1}: circumference={circ:.1f}cm, {r} motifs")`,
      challenge: 'Generate a complete Japi pattern that transitions smoothly from a 6-pointed star at the apex to a complex border at the base, with the motif complexity and count increasing with each ring. Account for the conical distortion so the pattern looks correct when wrapped into a 3D cone.',
      successHint: 'Conical geometry is where the Japi pattern generator meets reality. A pattern that looks beautiful on a flat screen must be deliberately distorted so that it looks beautiful on the curved hat. This is the same challenge faced by cartographers, architectural decorators, and anyone who maps flat designs onto curved surfaces.',
    },
    {
      title: 'Fractal geometry in traditional patterns',
      concept: `Many traditional patterns exhibit **self-similarity** at multiple scales — a hallmark of **fractal geometry**. A fractal is a shape that contains smaller copies of itself, potentially infinitely nested. The Koch snowflake starts with a triangle and replaces each line segment with a smaller triangular bump, repeating forever. The resulting shape has a finite area but an infinite perimeter — a paradox that reveals how fractals lie between dimensions.

The **fractal dimension** D quantifies how "space-filling" a pattern is. For a self-similar fractal composed of N copies scaled by factor r: D = log(N) / log(1/r). The Koch curve replaces each segment with 4 segments at 1/3 scale: D = log(4)/log(3) = 1.26. A straight line has D = 1; a filled plane has D = 2. Fractal dimension measures complexity: D = 1.26 means the Koch curve is more complex than a line but less than a filled area.

Traditional Assamese patterns often show 2-3 levels of self-similarity: a large motif contains medium motifs, which contain small motifs of similar shape. While not true mathematical fractals (which recurse infinitely), these patterns capture the aesthetic appeal of fractal self-similarity. The human visual system is tuned to find fractal dimensions between 1.3 and 1.5 most aesthetically pleasing — the same range found in natural scenes like tree canopies and coastlines. Traditional artisans discovered this sweet spot empirically.`,
      analogy: 'Self-similarity is like Russian nesting dolls (matryoshka). Open the big doll, and inside is a smaller doll of the same shape. Open that, and there is an even smaller one. A fractal is a matryoshka that goes on forever — each doll contains a smaller version of itself. Traditional patterns are like matryoshka that go 3-4 levels deep — not infinite, but enough to create visual richness at every viewing distance.',
      storyConnection: 'The magic of the Japi in the story might be that its patterns seem to reveal new detail the closer you look — a property of fractal-like designs. Traditional Assamese weavers create patterns where the main motif is composed of smaller submotifs of similar shape. This hierarchical structure gives the pattern visual richness at every scale, from arm\'s length to close inspection.',
      checkQuestion: 'A pattern motif is a triangle. At each iteration, each triangle is replaced by 3 triangles at 1/2 scale. What is the fractal dimension? After 5 iterations, how many triangles are there?',
      checkAnswer: 'D = log(3)/log(2) = 1.585. This is the Sierpinski triangle dimension. After 5 iterations: 3^5 = 243 triangles. The total area decreases with each iteration (each triangle is 1/4 the area, but there are 3 copies, so total area multiplies by 3/4 each step). After 5 steps: area = original * (3/4)^5 = 0.237 of original. In the limit, the Sierpinski triangle has zero area but dimension 1.585 — a "fractal dust" that is more than a line but less than a plane.',
      codeIntro: 'Generate fractal patterns inspired by Assamese traditional motifs and calculate their fractal dimensions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def koch_curve(order, p1, p2):
    """Generate Koch curve points between p1 and p2."""
    if order == 0:
        return [p1, p2]
    p1, p2 = np.array(p1), np.array(p2)
    d = (p2 - p1) / 3
    # Normal vector (rotated 60°)
    n = np.array([-d[1], d[0]]) * np.sqrt(3) / 2 + d / 2
    a = p1 + d
    b = p1 + d + np.array([d[0]*np.cos(np.pi/3) - d[1]*np.sin(np.pi/3),
                            d[0]*np.sin(np.pi/3) + d[1]*np.cos(np.pi/3)])
    c = p1 + 2*d
    pts = (koch_curve(order-1, p1, a) +
           koch_curve(order-1, a, b) +
           koch_curve(order-1, b, c) +
           koch_curve(order-1, c, p2))
    return pts

def sierpinski(order, v1, v2, v3, triangles=None):
    """Generate Sierpinski triangle."""
    if triangles is None:
        triangles = []
    if order == 0:
        triangles.append(np.array([v1, v2, v3, v1]))
        return triangles
    m12 = (np.array(v1) + np.array(v2)) / 2
    m23 = (np.array(v2) + np.array(v3)) / 2
    m13 = (np.array(v1) + np.array(v3)) / 2
    sierpinski(order-1, v1, m12, m13, triangles)
    sierpinski(order-1, m12, v2, m23, triangles)
    sierpinski(order-1, m13, m23, v3, triangles)
    return triangles

def fractal_tree(ax, x, y, angle, length, depth, color_base):
    """Draw a fractal tree."""
    if depth == 0 or length < 0.5:
        return
    x2 = x + length * np.cos(angle)
    y2 = y + length * np.sin(angle)
    alpha = min(1.0, 0.3 + 0.7 * depth / 8)
    ax.plot([x, x2], [y, y2], color=color_base, linewidth=max(0.5, depth*0.8), alpha=alpha)
    # Branch
    fractal_tree(ax, x2, y2, angle + np.pi/6, length*0.7, depth-1, color_base)
    fractal_tree(ax, x2, y2, angle - np.pi/5, length*0.65, depth-1, color_base)

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fractal Geometry in Traditional Patterns',
             color='white', fontsize=14, fontweight='bold')

# 1. Koch snowflake iterations
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
colors_koch = ['gray', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
for order in range(5):
    # Equilateral triangle vertices
    s = 2
    vertices = [(0, 0), (s, 0), (s/2, s*np.sqrt(3)/2)]
    all_pts = []
    for i in range(3):
        pts = koch_curve(order, vertices[i], vertices[(i+1)%3])
        all_pts.extend(pts)
    pts_arr = np.array(all_pts)
    offset_y = order * 0.15
    ax.plot(pts_arr[:, 0], pts_arr[:, 1] + offset_y, color=colors_koch[order],
            linewidth=max(0.3, 2-order*0.4), alpha=0.7, label=f'Order {order}')
ax.set_title('Koch snowflake (D=1.26)', color='white', fontsize=10)
ax.legend(fontsize=7)
ax.set_aspect('equal')

# 2. Sierpinski triangle
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
v1, v2, v3 = [0, 0], [4, 0], [2, 4*np.sqrt(3)/2]
triangles = sierpinski(5, v1, v2, v3)
for tri in triangles:
    ax.fill(tri[:, 0], tri[:, 1], color='#a855f7', alpha=0.6, edgecolor='#a855f7', linewidth=0.1)
ax.set_title('Sierpinski triangle (D=1.585)', color='white', fontsize=10)
ax.set_aspect('equal')

# 3. Fractal tree (like Assamese tree of life motif)
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
fractal_tree(ax, 2, 0, np.pi/2, 2.5, 8, '#22c55e')
ax.set_xlim(-1, 5); ax.set_ylim(-0.5, 5)
ax.set_title('Fractal tree (tree of life motif)', color='white', fontsize=10)
ax.set_aspect('equal')

# 4. Self-similar Japi pattern (3 levels)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
def draw_hex_motif(ax, cx, cy, size, depth, max_depth):
    if depth > max_depth or size < 0.05: return
    colors_d = ['#f59e0b', '#ef4444', '#3b82f6']
    angles = np.linspace(0, 2*np.pi, 7)
    hx = cx + size * np.cos(angles)
    hy = cy + size * np.sin(angles)
    ax.fill(hx, hy, color=colors_d[min(depth, 2)], alpha=0.3, edgecolor=colors_d[min(depth, 2)], linewidth=0.5)
    # Recurse: smaller hexagons at vertices
    for i in range(6):
        nx = cx + size * 0.6 * np.cos(i * np.pi/3)
        ny = cy + size * 0.6 * np.sin(i * np.pi/3)
        draw_hex_motif(ax, nx, ny, size * 0.35, depth + 1, max_depth)

draw_hex_motif(ax, 0, 0, 2.0, 0, 3)
ax.set_xlim(-3, 3); ax.set_ylim(-3, 3)
ax.set_title('Self-similar hexagonal (3 levels)', color='white', fontsize=10)
ax.set_aspect('equal')

# 5. Fractal dimension calculation
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
fractals = {
    'Line': (1, 1.0),
    'Koch': (4, 1/3),
    'Sierpinski': (3, 1/2),
    'Vicsek': (5, 1/3),
    'Carpet': (8, 1/3),
    'Plane': (4, 1/2),
}
names = list(fractals.keys())
dims = [np.log(n)/np.log(1/r) for n, r in fractals.values()]
colors_dim = ['gray', '#3b82f6', '#a855f7', '#22c55e', '#f59e0b', 'gray']
bars = ax.barh(names, dims, color=colors_dim, alpha=0.8)
ax.axvline(1, color='white', linewidth=0.5, linestyle='--', alpha=0.5)
ax.axvline(2, color='white', linewidth=0.5, linestyle='--', alpha=0.5)
ax.set_xlabel('Fractal dimension D', color='white')
ax.set_title('Fractal dimensions', color='white', fontsize=10)
for bar, d in zip(bars, dims):
    ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
            f'{d:.3f}', color='white', va='center', fontsize=9)

# 6. Aesthetic preference zone
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
d_range = np.linspace(1.0, 2.0, 200)
# Aesthetic preference curve (Spehar et al., 2003 — approximate)
preference = np.exp(-((d_range - 1.4) / 0.15)**2)
ax.fill_between(d_range, preference, alpha=0.2, color='#22c55e')
ax.plot(d_range, preference, color='#22c55e', linewidth=2.5, label='Aesthetic preference')
for name, d in zip(names, dims):
    if 1.0 <= d <= 2.0:
        ax.axvline(d, color='#f59e0b', linewidth=1, linestyle=':', alpha=0.5)
        ax.text(d, 1.05, name, color='white', fontsize=8, ha='center', rotation=45)
ax.set_xlabel('Fractal dimension', color='white')
ax.set_ylabel('Preference (normalized)', color='white')
ax.set_title('Aesthetic sweet spot: D ≈ 1.3-1.5', color='white', fontsize=10)
ax.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Fractal Geometry Summary")
print("=" * 50)
for name, (n, r) in fractals.items():
    d = np.log(n)/np.log(1/r)
    print(f"  {name:<12} N={n}, r=1/{1/r:.0f}  ->  D = {d:.3f}")
print()
print("Human aesthetic preference peaks at D ≈ 1.3-1.5")
print("This matches fractal dimensions found in nature:")
print("  Coastlines: D ≈ 1.2, Tree canopies: D ≈ 1.4")
print("  Traditional art: D ≈ 1.3-1.5 (cross-culturally)")`,
      challenge: 'Create a fractal Japi pattern: start with a hexagonal motif, and at each of 4 recursion levels, replace each hexagon with 7 smaller hexagons (one center + 6 surrounding). Calculate the fractal dimension and compare it to natural patterns. Does the Japi fractal fall in the aesthetic sweet spot?',
      successHint: 'Fractal geometry reveals why traditional patterns are visually satisfying — they hit the same complexity sweet spot as natural scenes. The intersection of mathematics, aesthetics, and cultural tradition is one of the most fascinating frontiers of computational art.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Geometric Patterns & Tessellation Mathematics
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (geometry fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for geometric transformations, tessellation theory, and fractal analysis. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
