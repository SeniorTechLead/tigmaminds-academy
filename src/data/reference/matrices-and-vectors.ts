import type { ReferenceGuide } from '../reference';
import { practiceMatrices } from '../practice-matrices';

export const guide: ReferenceGuide = {
  slug: 'matrices-and-vectors',
  title: 'Matrices & Vectors',
  category: 'math',
  icon: '📐',
  tagline: 'Arrays of numbers that transform images, solve systems, and power machine learning.',
  relatedStories: ['dragonfly-and-the-paddy-field', 'girl-who-spoke-to-elephants'],
  understand: [
    {
      title: 'Vectors — Magnitude and Direction',
      beginnerContent:
        '**A boat is crossing the Brahmaputra.**\n\n' +
        'The motor pushes the boat north at 8 km/h. The river current pushes it east at 3 km/h. Where does the boat actually go?\n\n' +
        'You cannot answer this with a single number. You need TWO pieces of information: **how fast** and **which direction**. That is what a vector is — a quantity with both magnitude (size) and direction.\n\n' +
        '**Representing the boat as a vector:**\n\n' +
        'Motor: (0, 8) — 0 km/h east, 8 km/h north\n' +
        'Current: (3, 0) — 3 km/h east, 0 km/h north\n\n' +
        'The boat\'s actual motion = motor + current = (0+3, 8+0) = **(3, 8)** — it moves 3 km/h east AND 8 km/h north simultaneously.\n\n' +
        '**How fast is the boat actually going?**\n\n' +
        'The boat moves 3 east and 8 north — a right triangle:\n\n' +
        '[diagram:BoatRiverDiagram]\n\n' +
        '| | Value |\n' +
        '|--|-------|\n' +
        '| Horizontal leg | 3 km/h |\n' +
        '| Vertical leg | 8 km/h |\n' +
        '| Hypotenuse (Pythagorean theorem) | √(3² + 8²) = √(9 + 64) = √73 ≈ **8.5 km/h** |\n\n' +
        'That is the **magnitude** of the vector — the length of the arrow.\n\n' +
        '**What direction is it going?**\n\n' +
        'The angle from east: θ = arctan(8/3) ≈ **69°** north of east.\n\n' +
        '**Try a simpler example:** v = (3, 4)\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Draw | 3 units right, 4 units up |\n' +
        '| Magnitude | √(3² + 4²) = √(9+16) = √25 = **5** |\n' +
        '| Direction | arctan(4/3) ≈ **53°** from horizontal |\n\n' +
        'Notice: 3, 4, 5 is a Pythagorean triple — the magnitude comes out to a whole number.\n\n' +
        '**Scalars vs vectors:**\n\n' +
        '| Scalar (just a number) | Vector (number + direction) |\n' +
        '|----------------------|---------------------------|\n' +
        '| Temperature: 28°C | Velocity: 8 km/h northeast |\n' +
        '| Mass: 50 kg | Force: 100 N downward |\n' +
        '| Speed: 60 km/h | Displacement: 5 km east |\n\n' +
        '**Now try it yourself — drag the vectors and watch the math update:**\n\n' +
        '[diagram:VectorBoatDiagram]',
      intermediateContent:
        '**Working with vectors — one operation at a time.**\n\n' +
        '[diagram:VectorOperationsDiagram]\n\n' +
        'Let **a** = (3, −2) and **b** = (1, 5).\n\n' +
        '**Addition** — add the matching components:\n\n' +
        'a + b = (3+1, −2+5) = **(4, 3)**\n\n' +
        'Geometrically: walk along **a**, then walk along **b**. You end up at (4, 3).\n\n' +
        '**Subtraction** — subtract the matching components:\n\n' +
        'a − b = (3−1, −2−5) = **(2, −7)**\n\n' +
        '**Scalar multiplication** — multiply every component:\n\n' +
        '3**a** = (3×3, 3×(−2)) = **(9, −6)** — same direction, 3× longer.\n\n' +
        '**Magnitude** — length of the vector:\n\n' +
        '|**a**| = √(3² + (−2)²) = √(9 + 4) = √13 ≈ **3.61**\n\n' +
        '**Unit vector** — direction only (magnitude = 1):\n\n' +
        'â = **a** / |**a**| = (3/√13, −2/√13) ≈ (0.832, −0.555). Check: √(0.832² + 0.555²) = √(0.692 + 0.308) = √1 = **1** ✓\n\n' +
        '**Dot product** — a single number that measures how aligned two vectors are:\n\n' +
        '**a** · **b** = 3×1 + (−2)×5 = 3 + (−10) = **−7**\n\n' +
        '| Dot product | Meaning |\n' +
        '|------------|--------|\n' +
        '| Positive | Vectors point in roughly the same direction |\n' +
        '| Zero | Vectors are perpendicular (90°) |\n' +
        '| Negative | Vectors point in roughly opposite directions |\n\n' +
        'Since **a** · **b** = −7 (negative), the angle between them is **obtuse** (> 90°).\n\n' +
        'The exact angle: cos θ = (a·b) / (|a| × |b|) = −7 / (√13 × √26) = −7 / √338 ≈ −0.381, so θ ≈ **112°**.',
      advancedContent:
        'Here\'s something the boat example quietly assumed: **a vector is independent of the coordinate system you describe it in.** The boat moves the same way no matter whether I label my axes "east/north" or "up-valley/across-valley." The *components* change if I rotate my axes. The *vector itself* does not.\n\n' +
        'That invariance — the physical arrow is real, the numbers describing it are just a chosen notation — turns out to be surprisingly deep. It\'s the difference between a vector (a real directional quantity) and any random list of numbers (which may or may not represent one). And it\'s the doorway into **tensors**.\n\n' +
        '**Tensors — the full hierarchy.** Think of tensors as the generalization of this invariance from one-axis quantities to many-axis quantities:\n\n' +
        '| Rank | Name | Example | How many components in 3D |\n' +
        '|------|------|---------|---------------------------|\n' +
        '| 0 | Scalar | Temperature: 25°C | 1 |\n' +
        '| 1 | Vector | Velocity: (3, 4, 0) m/s | 3 |\n' +
        '| 2 | Matrix-like | Stress at a point | 9 (3×3) |\n' +
        '| 3 | | Piezoelectric response | 27 |\n' +
        '| 4 | | Elasticity tensor | 81 |\n\n' +
        'Each step up adds one more "direction" the quantity can depend on. **A rank-2 tensor at a point takes one direction in and gives one direction out** — hence 3×3 in 3D.\n\n' +
        '**Stress as a rank-2 tensor — a vector-idea you can feel.** Squeeze a rubber block. Inside, at every point, there are forces acting on every possible internal slice of material. The **stress tensor** σᵢⱼ tells you: *for a surface facing direction i, what force (in the j direction) is acting on it?*\n\n' +
        '| | Force in x | Force in y | Force in z |\n' +
        '|---|---|---|---|\n' +
        '| Surface facing x | σ_xx (compression) | σ_xy (shear) | σ_xz (shear) |\n' +
        '| Surface facing y | σ_yx (shear) | σ_yy (compression) | σ_yz (shear) |\n' +
        '| Surface facing z | σ_zx (shear) | σ_zy (shear) | σ_zz (compression) |\n\n' +
        '[diagram:StressTensorDiagram]\n\n' +
        'Diagonal entries are compression (squeezing). Off-diagonal are shear (sliding). Nine numbers describe the state of stress at one point inside your material. This 3×3 tensor, evaluated at every point of a bridge, is what civil engineers solve for to check whether the bridge will hold.\n\n' +
        '**The defining test — invariance under rotation.** If you rotate your coordinate axes by 30°, all nine numbers in the stress tensor change. But the *physical stress* hasn\'t changed — the rubber block doesn\'t know which way your axes point. A real tensor\'s components transform by a specific rule under rotation, such that the underlying physical quantity stays the same. A random 3×3 grid of numbers does **not** generally satisfy this rule — and therefore is not a tensor.\n\n' +
        'This is what distinguishes a genuine physical vector from just a list of numbers, generalized to higher rank. It\'s why tensors became indispensable in physics: **the laws of physics can\'t depend on which direction you call "x".** Einstein\'s field equations of general relativity are written in tensor language precisely because they must be true regardless of the observer\'s reference frame. Every "vector" you learn here — velocity, force, field — is really a rank-1 tensor hiding in comfortable clothes.',
    },
    {
      title: 'Vector Operations',
      beginnerContent:
        '**The dot product — "how similar are two vectors?"**\n\n' +
        'You have two vectors: **a** = (2, 3) and **b** = (4, 1). The dot product multiplies matching components and adds:\n\n' +
        '**a** · **b** = 2×4 + 3×1 = 8 + 3 = **11**\n\n' +
        'That is it. Multiply the x\'s together, multiply the y\'s together, add.\n\n' +
        '**What does the number 11 mean?** It tells you how much the two vectors "agree" — how much they point in the same direction.\n\n' +
        '| If the dot product is... | The vectors are... | Example |\n' +
        '|-------------------------|-------------------|--------|\n' +
        '| Large and positive | Pointing in similar directions | (1,0) · (1,0) = 1 |\n' +
        '| Zero | Perpendicular (at 90°) | (1,0) · (0,1) = 0 |\n' +
        '| Negative | Pointing in opposite-ish directions | (1,0) · (−1,0) = −1 |\n\n' +
        '**Try it — drag the vectors and watch the dot product and angle change:**\n\n' +
        '[diagram:DotProductAngleDiagram]\n\n' +
        '**Finding the angle between two vectors:**\n\n' +
        'cos θ = (**a** · **b**) / (|**a**| × |**b**|)\n\n' +
        '|**a**| = √(4+9) = √13 ≈ 3.61. |**b**| = √(16+1) = √17 ≈ 4.12.\n\n' +
        'cos θ = 11 / (3.61 × 4.12) = 11 / 14.87 = 0.74. θ = arccos(0.74) ≈ **42°** — they point in somewhat similar directions.\n\n' +
        '**Checking perpendicularity** (critical for ML):\n\n' +
        'Are (3, 4) and (−4, 3) perpendicular? Dot product = 3×(−4) + 4×3 = −12 + 12 = **0**. Yes — perpendicular. ✓\n\n' +
        '**Why ML cares:** In machine learning, each data point is a vector of features. The dot product measures similarity. Two elephant rumbles with similar frequency and amplitude have a large dot product → likely the same mood. Two with opposite patterns have a negative dot product → different moods.\n\n' +
        '**The cross product (3D only) — finding the direction perpendicular to two vectors:**\n\n' +
        'Given **a** = (1, 2, 3) and **b** = (4, 5, 6):\n\n' +
        '| Component | Calculation | Result |\n' +
        '|-----------|------------|--------|\n' +
        '| x | 2×6 − 3×5 | 12 − 15 = **−3** |\n' +
        '| y | 3×4 − 1×6 | 12 − 6 = **6** |\n' +
        '| z | 1×5 − 2×4 | 5 − 8 = **−3** |\n\n' +
        '**a** × **b** = (−3, 6, −3) — this vector is perpendicular to BOTH **a** and **b**.\n\n' +
        'Verify: (−3, 6, −3) · (1, 2, 3) = −3 + 12 − 9 = **0** ✓ Perpendicular!',
      intermediateContent:
        '**Cross product worked example** — a = (2, 3, 0) and b = (0, 1, 4):\n\n' +
        '| Component | Calculation | Result |\n' +
        '|-----------|------------|--------|\n' +
        '| x | 3×4 − 0×1 | **12** |\n' +
        '| y | 0×0 − 2×4 | **−8** |\n' +
        '| z | 2×1 − 3×0 | **2** |\n\n' +
        'a × b = **(12, −8, 2)**\n\n' +
        '**Magnitude:** |a × b| = √(144 + 64 + 4) = √212 ≈ **14.56** — this equals the area of the parallelogram spanned by a and b.\n\n' +
        '**Scalar triple product:** a · (b × c) gives the volume of the parallelepiped formed by three vectors.\n\n' +
        '**Right-hand rule:** Curl the fingers of your right hand from **a** toward **b** — your thumb points in the direction of **a × b**.',
      advancedContent:
        '**Lambert\'s cosine law — how dot products light 3D scenes:**\n\n' +
        'A surface faces direction **n** (the normal vector). Light comes from direction **L**. How bright is the surface?\n\n' +
        'Brightness = max(0, **n** · **L**) = max(0, |n||L|cos θ)\n\n' +
        'When θ = 0° (light hits straight on): cos 0 = 1 → full brightness.\n' +
        'When θ = 90° (light grazes the surface): cos 90 = 0 → no illumination.\n\n' +
        'This single dot product is computed for every pixel in every frame of every 3D game — billions of times per second. The normal vector at each vertex is the cross product of the triangle\'s two edge vectors.\n\n' +
        '**Homogeneous coordinates — the trick that makes translation a matrix multiply:**\n\n' +
        'Rotation and scaling are matrix multiplications, but translation (moving) is addition: x\' = x + dx. ' +
        'This inconsistency is annoying. Fix: add a 4th coordinate (w=1) to every 3D point: (x, y, z, 1).\n\n' +
        'Now translation is also a matrix multiply:\n' +
        '[1 0 0 dx] [x]   [x+dx]\n' +
        '[0 1 0 dy] [y] = [y+dy]\n' +
        '[0 0 1 dz] [z]   [z+dz]\n' +
        '[0 0 0  1] [1]   [  1 ]\n\n' +
        'ALL transformations (rotate, scale, translate, perspective projection) become 4×4 matrix multiplications. ' +
        'Chain them: T_total = T_translate × T_rotate × T_scale. GPUs are built to multiply 4×4 matrices at extreme speed because of this.\n\n' +
        '**Quaternions** (4D numbers q = w + xi + yj + zk) represent rotations with 4 numbers instead of 9 (rotation matrix). ' +
        'Advantage: smooth interpolation between rotations (SLERP) without gimbal lock — essential for drone flight controllers and game cameras.',
    },
    {
      title: 'Matrices and Multiplication',
      beginnerContent:
        'Click any cell in the result matrix in the diagram above. Watch one row of A and one column of B light up, and see the dot-product recipe that produced that number. **Every cell in a matrix product is a dot product** — learn this one pattern and matrix multiplication stops being mysterious forever.\n\n' +
        '**What is a matrix? A grid of numbers — and why it matters.**\n\n' +
        'Exam scores for 3 students in 2 subjects:\n\n' +
        '| | Maths | Science |\n' +
        '|--|-------|--------|\n' +
        '| Anu | 80 | 70 |\n' +
        '| Bina | 90 | 85 |\n' +
        '| Charu | 75 | 95 |\n\n' +
        'This table IS a matrix: A = [80 70; 90 85; 75 95]. It has 3 rows and 2 columns — a "3×2 matrix."\n\n' +
        '**Matrix multiplication — step by step:**\n\n' +
        'Multiply A = [1 2; 3 4] by B = [5 6; 7 8]. The rule: each entry in the result is a **dot product** of a row from A with a column from B.\n\n' +
        '| Result entry | Row from A | Column from B | Dot product |\n' +
        '|-------------|-----------|--------------|------------|\n' +
        '| Top-left | (1, 2) | (5, 7) | 1×5 + 2×7 = **19** |\n' +
        '| Top-right | (1, 2) | (6, 8) | 1×6 + 2×8 = **22** |\n' +
        '| Bottom-left | (3, 4) | (5, 7) | 3×5 + 4×7 = **43** |\n' +
        '| Bottom-right | (3, 4) | (6, 8) | 3×6 + 4×8 = **50** |\n\n' +
        'Result: [19 22; 43 50]\n\n' +
        '**The determinant — does the matrix "squish" space?**\n\n' +
        'For [a b; c d]: det = ad − bc\n\n' +
        'For [3 1; 2 4]: det = 3×4 − 1×2 = 12 − 2 = **10**\n\n' +
        'What does 10 mean? The matrix stretches areas by a factor of 10. A 1×1 square becomes a parallelogram with area 10.\n' +
        'If det = 0, the matrix squishes everything to a line — it destroys information and cannot be undone (no inverse).\n\n' +
        '**See it — click different transformations and watch the area change:**\n\n' +
        '[diagram:MatrixTransformDiagram]\n\n' +
        '**The inverse — undoing a transformation:**\n\n' +
        'For [3 1; 2 4]: inverse = (1/det) × [d −b; −c a] = (1/10) × [4 −1; −2 3]\n\n' +
        '**Verify:** [3 1; 2 4] × (1/10)[4 −1; −2 3]\n' +
        '= (1/10)[3×4+1×(−2), 3×(−1)+1×3; 2×4+4×(−2), 2×(−1)+4×3]\n' +
        '= (1/10)[10 0; 0 10] = [1 0; 0 1] ✓ — the identity matrix (does nothing).\n\n' +
        '**Solving equations with matrices:**\n\n' +
        '2 apples + 1 banana = ₹8. 5 apples + 3 bananas = ₹19. What does each cost?\n\n' +
        'Write as: [2 1; 5 3] × [apple; banana] = [8; 19]\n\n' +
        'Inverse of [2 1; 5 3]: det = 6−5 = 1. Inverse = [3 −1; −5 2].\n\n' +
        '[apple; banana] = [3 −1; −5 2] × [8; 19] = [24−19; −40+38] = **[5; −2]**\n\n' +
        'Apple = ₹5, banana = ... ₹−2? That means our data is inconsistent (or bananas are giving you a refund). In real problems, check that the answer makes sense!',
        // Intermediate — deepen the themes from beginner rather than repeat them
      intermediateContent:
        'You\'ve seen the mechanics of multiplication, determinant, and inverse. Now let\'s look at what those mechanics *mean*.\n\n' +
        '**Matrix multiplication isn\'t commutative.** Unlike numbers (where 3 × 5 = 5 × 3), AB ≠ BA in general. Try it:\n\n' +
        '| | Calculation | Result |\n' +
        '|---|-------------|--------|\n' +
        '| AB where A = `[0 1; 0 0]`, B = `[0 0; 1 0]` | AB | `[1 0; 0 0]` |\n' +
        '| BA (same matrices, reversed) | BA | `[0 0; 0 1]` |\n\n' +
        'These are *completely different matrices* — one puts a 1 in the top-left, the other in the bottom-right. The next section shows exactly why: each matrix is a transformation, and applying "rotate then scale" generally isn\'t the same as "scale then rotate."\n\n' +
        '**What the determinant really measures.** You saw that det `[3 1; 2 4]` = 10. That number isn\'t arbitrary — it\'s the **area scale factor** of the transformation. A unit square (area 1) becomes a parallelogram of area 10. Some key consequences:\n\n' +
        '| Determinant | Geometric meaning |\n' +
        '|-------------|-------------------|\n' +
        '| det > 0 | Preserves orientation, scales area by det |\n' +
        '| det < 0 | Flips orientation (reflection), area scales by \\|det\\| |\n' +
        '| det = 0 | Collapses 2D to a line (or a point) — irreversible |\n' +
        '| det = 1 | Pure rotation or shear — area is preserved |\n\n' +
        'This is why `det = 0` means no inverse exists: you can\'t un-squish a line back into a plane. Information has been destroyed.\n\n' +
        '**The inverse recipe — why that specific formula works.** For a 2×2 matrix A = `[a b; c d]`:\n\n' +
        '`A⁻¹ = (1/det) × [d −b; −c a]`\n\n' +
        'Swap the diagonal, negate the off-diagonal, divide by det. Verify once by multiplying A × A⁻¹ and watching the determinant cancel everything off-diagonal — it must give you `[1 0; 0 1]`, the identity.\n\n' +
        '**Solving systems of equations — Ax = b.** This is where matrices earn their keep. The Ax = b we saw in beginner (the apples-and-bananas problem) generalizes to hundreds of thousands of unknowns. That\'s how traffic simulations, circuit analysis, weather models, and structural engineering all work — set up a giant system, apply A⁻¹ (or a faster algorithm like Gaussian elimination or LU decomposition), read off x.\n\n' +
        '**Key takeaway for section 4.** All of this — multiplication, determinant, inverse — makes geometric sense once you see a matrix as a **transformation of space**. Which is exactly what comes next.',
      advancedContent:
        '**Eigenvalues — finding them by hand for a 2×2 matrix:**\n\n' +
        'Given A = `[4 1; 2 3]`. An eigenvector **v** satisfies A**v** = λ**v** — the matrix only stretches it, no rotation.\n\n' +
        '| Step | Work | Result |\n' +
        '|------|------|--------|\n' +
        '| Rewrite | (A − λI)**v** = 0; need det(A − λI) = 0 | |\n' +
        '| Expand determinant | (4−λ)(3−λ) − 2 | λ² − 7λ + 10 = 0 |\n' +
        '| Factor | (λ−5)(λ−2) = 0 | **λ₁ = 5, λ₂ = 2** |\n\n' +
        '**Finding the eigenvectors:**\n\n' +
        '| Eigenvalue | Solve (A−λI)**v** = 0 | Eigenvector |\n' +
        '|------------|----------------------|-------------|\n' +
        '| λ₁ = 5 | `[−1 1; 2 −2]`**v** = 0 | **v₁ = (1, 1)** |\n' +
        '| λ₂ = 2 | `[2 1; 2 1]`**v** = 0 | **v₂ = (1, −2)** |\n\n' +
        '**Interpretation:** A stretches the direction (1,1) by factor 5 and the direction (1,−2) by factor 2. Any input vector decomposes into these two directions.\n\n' +
        '**SVD — works for ANY matrix (even non-square):**\n\n' +
        'A = UΣVᵀ, where U and V are rotation matrices and Σ is diagonal (the singular values).\n\n' +
        '**Image compression example:**\n\n' +
        '| | Raw image | After SVD (top 50 values) |\n' +
        '|---|-----------|---------------------------|\n' +
        '| Size | 1000 × 1000 = 1,000,000 values | 50 × (1000 + 1000 + 1) ≈ 100,000 values |\n' +
        '| Compression | 1× | **10× smaller** |\n' +
        '| Quality | Original | Nearly identical — discarded values captured noise, not structure |\n\n' +
        '**PageRank — how Google ranks web pages:**\n\n' +
        'Model the web as a matrix where entry Aᵢⱼ = probability of clicking from page j to page i. The dominant eigenvector (λ = 1) gives the steady-state probability of being on each page — that is the page ranking.',
      diagram: 'MatrixMultiplicationDiagram',
    },
    {
      title: 'Transformations — Matrices in Action',
      beginnerContent:
        'Pick a preset in the diagram above — Rotate 45°, Scale, Shear, Flip — and watch the unit square morph. Or type your own numbers into the 2×2 matrix. The red and green arrows show where the basis vectors î and ĵ land. **The columns of a transformation matrix literally are "where î and ĵ go."** That\'s the whole trick.\n\n' +
        '**What happens when you multiply a matrix by a point?**\n\n' +
        'Start with the point (1, 0) — one unit to the right of the origin.\n\n' +
        '**Scaling:** Multiply by [2 0; 0 3]:\n\n' +
        '[2 0; 0 3] × [1; 0] = [2×1 + 0×0; 0×1 + 3×0] = **(2, 0)** — stretched 2× horizontally.\n\n' +
        'Try (0, 1): [2 0; 0 3] × [0; 1] = **(0, 3)** — stretched 3× vertically.\n\n' +
        'The matrix [2 0; 0 3] scales x by 2 and y by 3. The diagonal entries are the scale factors.\n\n' +
        '**Rotation by 90°:** The rotation matrix for 90° is [0 −1; 1 0].\n\n' +
        '[0 −1; 1 0] × [1; 0] = [0×1 + (−1)×0; 1×1 + 0×0] = **(0, 1)** — the point moved from "east" to "north." ✓\n\n' +
        '[0 −1; 1 0] × [0; 1] = [0×0 + (−1)×1; 1×0 + 0×1] = **(−1, 0)** — "north" moved to "west." ✓\n\n' +
        '**Reflection across x-axis:** [1 0; 0 −1]\n\n' +
        '[1 0; 0 −1] × [3; 4] = **(3, −4)** — x stays, y flips. Like looking in a puddle.\n\n' +
        '**The key idea:** A 2×2 matrix transforms EVERY point in the plane. Multiply each point by the matrix → the whole image rotates, scales, reflects, or shears.\n\n' +
        '**Try each transformation — click the buttons and watch the shape change:**\n\n' +
        '[diagram:MatrixTransformDiagram]\n\n' +
        '**Why this matters for ML:**\n\n' +
        'A neural network layer does exactly this: y = W × x (plus a bias and activation function). The weight matrix W transforms the input vector x into a new representation. ' +
        'An image enters as a vector of pixel values. After multiplying by the first weight matrix, it becomes a vector of "edge features." After the second matrix, "shape features." After the third, "object features." Each matrix transformation reveals more abstract patterns.',
      intermediateContent:
        '**Composing two transformations — do them one at a time, then as one matrix.**\n\n' +
        '[diagram:TransformCompositionDiagram]\n\n' +
        'Rotate the point (1, 0) by 90°, then scale by 2.\n\n' +
        '**Step by step (two separate operations):**\n\n' +
        '| Step | Matrix | Input | Output |\n' +
        '|------|--------|-------|--------|\n' +
        '| 1. Rotate 90° | [0 −1; 1 0] | (1, 0) | (0, 1) |\n' +
        '| 2. Scale ×2 | [2 0; 0 2] | (0, 1) | **(0, 2)** |\n\n' +
        '**As a single matrix (multiply the two matrices):**\n\n' +
        'Combined = Scale × Rotate = [2 0; 0 2] × [0 −1; 1 0]\n\n' +
        '| Entry | Calculation | Result |\n' +
        '|-------|-----------|--------|\n' +
        '| Top-left | 2×0 + 0×1 | 0 |\n' +
        '| Top-right | 2×(−1) + 0×0 | −2 |\n' +
        '| Bottom-left | 0×0 + 2×1 | 2 |\n' +
        '| Bottom-right | 0×(−1) + 2×0 | 0 |\n\n' +
        'Combined = [0 −2; 2 0]. Apply: [0 −2; 2 0] × [1; 0] = **(0, 2)** ✓ Same answer!\n\n' +
        'The single matrix [0 −2; 2 0] does both operations at once. This is why games and ML use matrix composition — multiply 10 transformation matrices into one, then apply that one matrix to millions of points.',
      advancedContent:
        'Composition is the real power of matrices. Each matrix is a single transformation. But because matrix multiplication chains them together, you can build arbitrarily complex transformations out of simple pieces — and that\'s how almost every computational system that matters works.\n\n' +
        '**First, a crucial subtlety: order matters.** With plain numbers 3 × 5 = 5 × 3. With matrices, AB ≠ BA in general. Prove it to yourself — rotate 90° then stretch x by 3, vs. stretch x by 3 then rotate 90°:\n\n' +
        '| Order | Combined matrix | Where (1, 0) ends up |\n' +
        '|-------|----------------|---------------------|\n' +
        '| Rotate, then stretch | `[3 0; 0 1] × [0 −1; 1 0]` = `[0 −3; 1 0]` | **(0, 1)** |\n' +
        '| Stretch, then rotate | `[0 −1; 1 0] × [3 0; 0 1]` = `[0 −1; 3 0]` | **(0, 3)** |\n\n' +
        'Completely different endpoints — from the same two operations. Every 3D animation engine, game physics loop, and robot arm controller is built around this carefully-ordered composition. "Translate, then rotate, then translate again" gives you pivot-point rotations. Scramble the order and the character\'s hand attaches to its shoulder instead of its elbow.\n\n' +
        '(Uniform scaling is the one happy exception: a scale-by-2 matrix commutes with rotation, because stretching equally in all directions doesn\'t care which way you\'re facing.)\n\n' +
        '**Why composition is the whole game.** Once you realise matrix multiplication is composition, you can build enormous pipelines with just simple parts. GPUs and ML libraries exist to do this fast:\n\n' +
        '- **3D graphics:** Model-to-world × world-to-camera × camera-to-screen × perspective. Four 4×4 matrices, multiplied once, then applied to every vertex in the scene. A modern game renders this for a million triangles sixty times per second.\n' +
        '- **Robotics:** A 6-joint robot arm\'s tip position is the product of 6 transformation matrices (one per joint). Change one joint angle, update one matrix, and the tip position falls out automatically.\n' +
        '- **Quantum computing:** Each quantum gate is a unitary matrix. A quantum algorithm is a product of them. Running the algorithm = multiplying a pile of small matrices together.\n\n' +
        '**And this is exactly what a neural network is.** A single layer of a neural network is nothing more than a matrix transformation (with a non-linear "bend" applied at the end):\n\n' +
        '`y = activation(W · x + b)`\n\n' +
        '| Symbol | Shape | Meaning |\n' +
        '|--------|-------|---------|\n' +
        '| x | input vector (e.g., 784×1 pixel values) | What goes in |\n' +
        '| W | weight matrix (e.g., 128×784) | The learned transformation |\n' +
        '| b | bias vector | A shift |\n' +
        '| activation | a simple nonlinearity (ReLU, sigmoid) | Adds the "bend" — a purely linear network would be dull |\n' +
        '| y | output vector (128×1) | The next layer\'s input |\n\n' +
        'A "deep" network just composes many such transformations — the output of layer 1 becomes the input to layer 2, and so on, for dozens of layers. Training is the process of adjusting all those W matrices so the final output is useful (edges → shapes → objects → words → meaning).\n\n' +
        'Look closely and this is *exactly* the same idea as composing a rotation with a scale. The math is identical. The only difference is scale — a game might chain 4 transformation matrices; a large language model chains hundreds, each one with billions of entries. **Linear algebra isn\'t abstract — it\'s the substrate on which modern computing runs.**',
      diagram: 'TransformationMatrixDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the matrix to its transformation',
          pairs: [
            ['[cos θ, −sin θ; sin θ, cos θ]', 'Rotation by angle θ around the origin'],
            ['[sx 0; 0 sy]', 'Scaling by factors sx horizontally and sy vertically'],
            ['[1 0; 0 −1]', 'Reflection across the x-axis'],
            ['[1 k; 0 1]', 'Horizontal shear by factor k'],
          ],
          explanations: [
            'For 90°: cos 90°=0, sin 90°=1 → [0 −1; 1 0]. The point (1,0) maps to (0,1) — east becomes north.',
            'The diagonal entries stretch each axis independently. [2 0; 0 3] doubles x and triples y.',
            'y-component flips sign: (3,4) → (3,−4). Like a mirror on the x-axis.',
            'x shifts by k×y, y stays. The top of a square leans right while the bottom stays put.',
          ],
          transformMatrices: [
            [0, -1, 1, 0],     // rotation 90°
            [2, 0, 0, 3],      // scale
            [1, 0, 0, -1],     // reflect x
            [1, 1, 0, 1],      // shear (k=1)
          ],
        },
      },
      practice: practiceMatrices,
    },
  ],
};
