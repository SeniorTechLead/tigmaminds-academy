import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MahabalipuramLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Penrose tilings — aperiodic patterns that never repeat',
      concept: `In 1974, mathematician Roger Penrose discovered that two simple shapes — a "kite" and a "dart" — can tile the plane but **never periodically**. The tiling has no translational symmetry — you cannot slide it to match itself. Yet it has a beautiful 5-fold rotational symmetry that periodic tilings cannot have.

This was a mathematical bombshell. For centuries, mathematicians believed that any tiling that covers the plane must eventually repeat. Penrose proved them wrong. His aperiodic tilings exhibit long-range order without periodicity — a property later discovered in real materials called **quasicrystals** (Dan Shechtman, Nobel Prize 2011).

In the code below, you will construct Penrose tilings using the **substitution method**: start with a large kite or dart, subdivide it into smaller kites and darts, and repeat. Each subdivision produces a finer tiling that approaches the true Penrose pattern.

*Aperiodic means the pattern never repeats by translation. No matter how large a section you copy, you cannot find an identical copy elsewhere by sliding it. Yet the pattern is not random — it follows strict rules.*`,
      analogy: 'Imagine a jigsaw puzzle where the pieces fit together according to strict rules, but the completed puzzle has no repeating section. If you take a photo of any region and try to find a matching region elsewhere, you never will — yet every local arrangement follows the same rules. This is aperiodicity: local order without global repetition.',
      storyConnection: 'While the Mahabalipuram carvers used periodic tilings (patterns that repeat), the mathematical discovery of aperiodic tilings shows that non-repeating patterns with perfect local order are possible. Some Islamic geometric art from medieval Spain and Central Asia appears to use near-Penrose tilings, suggesting that artisans may have discovered aperiodicity before mathematicians.',
      checkQuestion: 'Why can a Penrose tiling have 5-fold symmetry when periodic tilings cannot?',
      checkAnswer: 'Periodic tilings are constrained by the crystallographic restriction: only 2, 3, 4, and 6-fold rotations are compatible with translational symmetry. Since Penrose tilings have no translational symmetry, they are not bound by this restriction and can exhibit 5-fold (or any other) rotational symmetry.',
      codeIntro: 'Generate a Penrose tiling using the kite-and-dart substitution method.',
      code: `import numpy as np

# Penrose tiling via Robinson triangle decomposition
# Uses "thin" and "thick" Robinson triangles

PHI = (1 + np.sqrt(5)) / 2  # golden ratio = 1.618...

def subdivide_triangles(triangles):
    """Subdivide Robinson triangles to create finer Penrose tiling."""
    new_triangles = []
    for tri_type, A, B, C in triangles:
        if tri_type == "thick":
            # Thick triangle (36-108-36) subdivides into:
            # 1 thick + 1 thin triangle
            P = A + (B - A) / PHI
            new_triangles.append(("thick", C, P, B))
            new_triangles.append(("thin", C, P, A))
        else:
            # Thin triangle (108-36-36) subdivides into:
            # 1 thick + 1 thin triangle
            Q = B + (A - B) / PHI
            new_triangles.append(("thin", Q, C, A))
            new_triangles.append(("thick", Q, C, B))
    return new_triangles

def create_initial_star():
    """Create initial 10-triangle star (5-fold symmetric seed)."""
    triangles = []
    for i in range(10):
        angle1 = np.pi * (2 * i) / 10
        angle2 = np.pi * (2 * i + 2) / 10
        B = np.array([np.cos(angle1), np.sin(angle1)])
        C = np.array([np.cos(angle2), np.sin(angle2)])
        A = np.array([0.0, 0.0])
        if i % 2 == 0:
            triangles.append(("thick", A, B, C))
        else:
            triangles.append(("thick", A, C, B))
    return triangles

# Generate Penrose tiling
print("=== Penrose Tiling Generator ===")
print(f"Golden ratio (phi): {PHI:.6f}")
print()

triangles = create_initial_star()
print(f"Initial seed: {len(triangles)} triangles (5-fold star)")

for generation in range(1, 6):
    triangles = subdivide_triangles(triangles)
    thick = sum(1 for t in triangles if t[0] == "thick")
    thin = len(triangles) - thick
    ratio = thick / thin if thin > 0 else 0
    print(f"Generation {generation}: {len(triangles)} triangles "
          f"(thick: {thick}, thin: {thin}, ratio: {ratio:.4f})")

print()
print(f"The thick/thin ratio approaches phi = {PHI:.4f}")
print("This is a signature of the golden ratio in Penrose tilings.")

# Analyse local patterns
print()
print("=== Local Pattern Analysis ===")
print("(Checking vertex environments)")

# Count unique vertex angles
vertex_angles = {}
for tri_type, A, B, C in triangles[:100]:
    # Angle at vertex A
    v1 = B - A
    v2 = C - A
    cos_a = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-10)
    angle = np.degrees(np.arccos(np.clip(cos_a, -1, 1)))
    bucket = round(angle / 36) * 36
    vertex_angles[bucket] = vertex_angles.get(bucket, 0) + 1

print("Vertex angle distribution (multiples of 36 degrees):")
for angle in sorted(vertex_angles.keys()):
    count = vertex_angles[angle]
    print(f"  {angle:>3} degrees: {count} occurrences")

print()
print("All angles are multiples of 36 degrees (= 180/5),")
print("reflecting the 5-fold symmetry of Penrose tilings.")`,
      challenge: 'Compute the "deflation ratio" — after each subdivision, measure the average triangle area and verify it shrinks by a factor of 1/phi^2. Also verify that the number of thick triangles follows the Fibonacci-like recursion: T(n+1) = 2*T(n) + T(n) where T is thick and t is thin count.',
      successHint: 'You just generated one of the most famous mathematical objects of the 20th century. Penrose tilings connect geometry to number theory (the golden ratio), crystallography (quasicrystals), and even quantum mechanics (quantum spin models on Penrose lattices).',
    },
    {
      title: 'Ammann bars — hidden order in aperiodic patterns',
      concept: `Penrose tilings appear random at first glance, but they contain hidden long-range order. One way to reveal this order is through **Ammann bars** — straight lines that, when drawn across a Penrose tiling following specific rules, form a pattern of parallel lines with two spacings (long L and short S) in a sequence that never repeats periodically.

The ratio of long to short spacings is the **golden ratio** phi = 1.618..., and the sequence of L and S spacings follows the **Fibonacci word** — an infinite, non-repeating sequence related to Fibonacci numbers.

In the code below, you will generate the Fibonacci word (the 1D analog of Penrose tilings) and analyse its properties. This sequence appears in the spacing of Ammann bars, in quasicrystal diffraction patterns, and throughout mathematics.

*The Fibonacci word is generated by substitution: start with "L", replace L with "LS" and S with "L" at each step. The result is an infinite sequence that is ordered but never periodic: L, LS, LSL, LSLLS, LSLLSLSL, ...*`,
      analogy: 'Imagine a poet writing verse with two line lengths — long and short — following a rule: every long line is followed by "long short" and every short line is followed by "long." The resulting poem has a definite rhythm but never repeats the same stanza. It is ordered but not periodic — like the Fibonacci word.',
      storyConnection: 'If you look at the spacing of columns in certain Pallava temples at Mahabalipuram, you find two alternating spacings — wide and narrow — in patterns that are nearly (but not quite) periodic. While these were not true Fibonacci sequences, the aesthetic effect is similar: a rhythm that engages the eye because it almost repeats but never quite does.',
      checkQuestion: 'The Fibonacci word starts L, LS, LSL, LSLLS, ... How many characters are in the 7th generation?',
      checkAnswer: 'The lengths follow Fibonacci numbers: 1, 2, 3, 5, 8, 13, 21, ... So the 7th generation has 21 characters. Each generation length is the sum of the previous two — the defining property of Fibonacci numbers.',
      codeIntro: 'Generate and analyse the Fibonacci word and its connection to Penrose tilings.',
      code: `import numpy as np

def fibonacci_word(generations):
    """Generate the Fibonacci word by substitution.
    Rule: L -> LS, S -> L
    """
    word = "L"
    history = [word]
    for g in range(generations):
        new_word = ""
        for ch in word:
            if ch == "L":
                new_word += "LS"
            else:
                new_word += "L"
        word = new_word
        history.append(word)
    return history

# Generate Fibonacci words
print("=== Fibonacci Word Generator ===")
print("Rule: L -> LS, S -> L")
print()

words = fibonacci_word(10)
for i, w in enumerate(words[:8]):
    display = w if len(w) <= 50 else w[:50] + "..."
    L_count = w.count("L")
    S_count = w.count("S")
    ratio = L_count / S_count if S_count > 0 else float('inf')
    print(f"Gen {i}: len={len(w):>5}  L={L_count:>4}  S={S_count:>4}  "
          f"L/S={ratio:.4f}  {display}")

PHI = (1 + np.sqrt(5)) / 2
print(f"\
The L/S ratio converges to phi = {PHI:.6f}")

# Ammann bar spacing analysis
print()
print("=== Ammann Bar Spacings ===")
print("(Converting Fibonacci word to physical spacings)")
print()

L_spacing = PHI  # long spacing
S_spacing = 1.0  # short spacing

word = words[8]  # use generation 8
positions = [0]
for ch in word:
    if ch == "L":
        positions.append(positions[-1] + L_spacing)
    else:
        positions.append(positions[-1] + S_spacing)

print(f"Total bars: {len(positions)}")
print(f"Total length: {positions[-1]:.2f}")
print()

# Analyse spacings
spacings = [positions[i+1] - positions[i] for i in range(len(positions)-1)]
print("First 30 spacings (L=phi, S=1):")
line = ""
for s in spacings[:30]:
    ch = "L" if abs(s - L_spacing) < 0.01 else "S"
    line += ch
print(f"  {line}")

# Check for forbidden substrings (SS never appears in Fibonacci word)
has_SS = "SS" in word
has_LLL = "LLL" in word
print(f"\
Contains 'SS': {has_SS} (forbidden in Fibonacci word)")
print(f"Contains 'LLL': {has_LLL} (forbidden in Fibonacci word)")
print()

# Autocorrelation (self-similarity test)
print("=== Self-Similarity Test ===")
print("Comparing word with every-other-character subsampled version:")
subsampled = word[::2]
match = sum(1 for a, b in zip(word, subsampled) if a == b)
total = min(len(word), len(subsampled))
print(f"  Full word length: {len(word)}")
print(f"  Subsampled length: {len(subsampled)}")
print(f"  Character matches: {match}/{total} = {match/total:.1%}")`,
      challenge: 'Implement a "local isomorphism" check: show that every finite substring of the Fibonacci word appears infinitely many times. Search for all substrings of length 5 in a long Fibonacci word and count how many times each appears.',
      successHint: 'The Fibonacci word is one of the simplest examples of a quasiperiodic sequence — ordered but not periodic. It appears in quasicrystal diffraction patterns, musical composition theory, and even the arrangement of leaves on plant stems (phyllotaxis). You have touched one of mathematics\' most beautiful connections between order and complexity.',
    },
    {
      title: 'Voronoi tessellation — letting nature design the pattern',
      concept: `Not all tessellations come from regular polygons. A **Voronoi tessellation** divides a plane based on distance to a set of seed points: each region contains all points closer to its seed than to any other seed. The result is a tessellation of irregular convex polygons.

Voronoi tessellations appear everywhere in nature: the pattern of cracks in dried mud, the territories of animals, the domains in a polycrystalline metal, and the pattern of spots on a giraffe. When the seed points are arranged in a regular lattice, the Voronoi tessellation produces regular polygons (hexagons for a triangular lattice, squares for a square lattice).

In the code below, you will generate Voronoi tessellations from different seed point distributions and analyse the resulting polygon statistics. This connects the regular tessellations of Mahabalipuram to the organic patterns found in nature.

*The dual of a Voronoi tessellation is a Delaunay triangulation — connecting every pair of adjacent seeds. Together, they are among the most important structures in computational geometry.*`,
      analogy: 'Imagine dropping food colouring at several spots on a wet paper towel. Each drop spreads outward in a circle. Where two expanding circles meet, they form a straight boundary. The resulting pattern of regions — each "owned" by the nearest drop — is a Voronoi tessellation.',
      storyConnection: 'The natural crack patterns in ancient Mahabalipuram granite follow Voronoi-like patterns, influenced by the crystal grain structure of the stone. The carvers learned to read these patterns — carving along natural grain boundaries was easier and produced smoother edges than carving across grains.',
      checkQuestion: 'If you place seed points on a perfect triangular lattice, what polygon does the Voronoi tessellation produce?',
      checkAnswer: 'Regular hexagons. Each point on a triangular lattice is equidistant from its six neighbours, and the Voronoi region is the set of points closer to the centre than to any neighbour. For a triangular lattice, this is a regular hexagon. This is why honeycombs are hexagonal — bees optimize their Voronoi domains.',
      codeIntro: 'Generate Voronoi tessellations and analyse their polygon statistics.',
      code: `import numpy as np

def compute_voronoi_stats(seed_points, grid_resolution=200):
    """Compute Voronoi tessellation statistics using a grid approach.
    Returns the number of cells and approximate area of each.
    """
    xs = np.linspace(0, 10, grid_resolution)
    ys = np.linspace(0, 10, grid_resolution)
    xx, yy = np.meshgrid(xs, ys)

    # Assign each grid point to nearest seed
    assignments = np.zeros((grid_resolution, grid_resolution), dtype=int)
    for i in range(grid_resolution):
        for j in range(grid_resolution):
            distances = [np.sqrt((xx[i,j] - sx)**2 + (yy[i,j] - sy)**2)
                         for sx, sy in seed_points]
            assignments[i, j] = np.argmin(distances)

    # Count cells and areas
    cell_areas = {}
    pixel_area = (10 / grid_resolution) ** 2
    for cell_id in range(len(seed_points)):
        count = np.sum(assignments == cell_id)
        cell_areas[cell_id] = count * pixel_area

    # Count neighbours (cells that share a boundary)
    neighbour_counts = {i: set() for i in range(len(seed_points))}
    for i in range(grid_resolution - 1):
        for j in range(grid_resolution - 1):
            current = assignments[i, j]
            right = assignments[i, j + 1]
            below = assignments[i + 1, j]
            if current != right:
                neighbour_counts[current].add(right)
                neighbour_counts[right].add(current)
            if current != below:
                neighbour_counts[current].add(below)
                neighbour_counts[below].add(current)

    n_neighbours = [len(neighbour_counts[i]) for i in range(len(seed_points))]
    areas = [cell_areas[i] for i in range(len(seed_points))]

    return areas, n_neighbours

# Test different seed distributions
np.random.seed(42)

distributions = [
    ("Regular grid (4x4)", [(i*2.5+1.25, j*2.5+1.25) for i in range(4) for j in range(4)]),
    ("Random uniform (16 pts)", [(np.random.uniform(0.5, 9.5), np.random.uniform(0.5, 9.5)) for _ in range(16)]),
    ("Hexagonal lattice", [(i*2.5 + (j%2)*1.25, j*2.165+1) for j in range(4) for i in range(4)]),
]

for name, seeds in distributions:
    areas, neighbours = compute_voronoi_stats(seeds, grid_resolution=100)
    avg_area = np.mean(areas)
    std_area = np.std(areas)
    avg_n = np.mean(neighbours)
    cv = std_area / avg_area  # coefficient of variation

    print(f"=== {name} ===")
    print(f"  Seeds: {len(seeds)}")
    print(f"  Avg area: {avg_area:.2f} | Std: {std_area:.2f} | CV: {cv:.3f}")
    print(f"  Avg neighbours: {avg_n:.1f}")
    print(f"  Neighbour distribution: ", end="")
    for n in sorted(set(neighbours)):
        count = neighbours.count(n)
        print(f"{n}-sided:{count} ", end="")
    print()
    print()

print("Regular grids produce uniform cells (low CV).")
print("Random points produce varied cells (high CV).")
print("Hexagonal lattice gives the most uniform Voronoi (hexagons).")`,
      challenge: 'Implement Lloyd relaxation: iteratively move each seed to the centroid of its Voronoi cell. After 10 iterations, the random distribution should produce a much more uniform tessellation (lower CV). This is the algorithm behind the "blue noise" sampling used in computer graphics.',
      successHint: 'Voronoi tessellations bridge pure geometry and real-world phenomena. They are used in city planning (service areas for hospitals), ecology (animal territories), materials science (grain structures), and computer graphics (procedural texture generation). You have connected ancient Mahabalipuram geometry to modern computational science.',
    },
    {
      title: 'Computational complexity — how fast can we generate tilings?',
      concept: `As tessellation patterns get larger, the time needed to generate and analyse them grows. How fast? That depends on the **computational complexity** of the algorithm. A naive approach that checks every polygon against every other polygon has O(n squared) complexity — doubling the pattern size quadruples the computation time.

Better algorithms exist. Using a **spatial index** (like a grid or quadtree), you can check only nearby polygons, reducing complexity to O(n log n). For Voronoi tessellations, Fortune's algorithm achieves O(n log n) complexity. For Penrose tilings, the substitution method is O(n) — each triangle is subdivided independently.

In the code below, you will measure the actual running time of different tessellation generation algorithms and verify their theoretical complexity by plotting time versus pattern size.

*Big-O notation describes how an algorithm's running time scales with input size. O(n) means time is proportional to n. O(n squared) means time is proportional to n squared. O(n log n) is between them and is often the best achievable for geometric problems.*`,
      analogy: 'Imagine hand-addressing envelopes. Addressing n envelopes takes n minutes (O(n) — linear). Comparing every pair takes n(n-1)/2 comparisons (O(n squared) — quadratic). Sorting them alphabetically takes about n * log(n) steps using a clever algorithm (O(n log n)). The difference is huge at large n: 1 million envelopes take 1 million, 20 million, or 1 trillion operations depending on the algorithm.',
      storyConnection: 'A Mahabalipuram carver creating a jali screen with 1000 openings does not need to check every opening against every other — they work locally, carving one cell at a time and checking alignment only with neighbouring cells. This is the ancient equivalent of an O(n) algorithm with local spatial indexing. Scale matters: a 10x10 grid is trivial, a 100x100 grid requires systematic method.',
      checkQuestion: 'If generating a 100-polygon tessellation takes 0.1 seconds with an O(n squared) algorithm, how long will a 10000-polygon tessellation take?',
      checkAnswer: 'n increases by 100x (from 100 to 10000). With O(n squared), time increases by 100 squared = 10000x. So 0.1 * 10000 = 1000 seconds (about 17 minutes). With an O(n log n) algorithm, time would increase by only 100 * log(100)/log(1) ~ 200x, giving 0.1 * 200 = 20 seconds.',
      codeIntro: 'Measure and compare algorithm complexity for tessellation generation.',
      code: `import numpy as np
import time

def generate_square_naive(n):
    """O(n^2) approach: check all pairs for adjacency."""
    squares = []
    for i in range(n):
        for j in range(n):
            squares.append((i, j))
    # Naive adjacency: check all pairs
    adjacency_count = 0
    for idx1 in range(len(squares)):
        for idx2 in range(idx1 + 1, len(squares)):
            x1, y1 = squares[idx1]
            x2, y2 = squares[idx2]
            if abs(x1 - x2) + abs(y1 - y2) == 1:
                adjacency_count += 1
    return adjacency_count

def generate_square_smart(n):
    """O(n) approach: only check 4 neighbours per cell."""
    adjacency_count = 0
    for i in range(n):
        for j in range(n):
            # Check right and down neighbours only
            if i + 1 < n:
                adjacency_count += 1
            if j + 1 < n:
                adjacency_count += 1
    return adjacency_count

def generate_penrose(generations):
    """O(k * phi^gen) substitution method."""
    triangles = [("thick", 0)]  # simplified
    for g in range(generations):
        new_tri = []
        for t_type, _ in triangles:
            new_tri.append(("thick", g))
            new_tri.append(("thin", g))
        triangles = new_tri
    return len(triangles)

# Benchmark
print("=== Algorithm Complexity Benchmark ===")
print()

# Naive O(n^2) vs Smart O(n)
print("Square tessellation adjacency detection:")
header = "Grid Size    Squares   Naive Time(ms)  Smart Time(ms)  Speedup"
print(header)
print("-" * len(header))

for n in [5, 10, 15, 20, 25, 30]:
    start = time.time()
    adj_naive = generate_square_naive(n)
    t_naive = (time.time() - start) * 1000

    start = time.time()
    adj_smart = generate_square_smart(n)
    t_smart = (time.time() - start) * 1000

    speedup = t_naive / t_smart if t_smart > 0 else float('inf')
    print(f"{n:>7}x{n:<4} {n*n:>7}   {t_naive:>12.2f}    {t_smart:>12.2f}    {speedup:>7.1f}x")

print()
print("=== Complexity Verification ===")
print("If naive is O(n^4) for grid, doubling n should 16x the time.")
print("If smart is O(n^2) for grid, doubling n should 4x the time.")
print()

# Penrose scaling
print("Penrose tiling (substitution method):")
header2 = "Generations  Triangles  Time(ms)"
print(header2)
print("-" * len(header2))

for gen in range(1, 16):
    start = time.time()
    count = generate_penrose(gen)
    t = (time.time() - start) * 1000
    print(f"{gen:>10}  {count:>9}  {t:>8.3f}")

print()
print("Substitution is O(phi^n) in output size —")
print("exponential in generations but linear per triangle.")`,
      challenge: 'Implement a spatial hash grid for the naive adjacency check: divide the plane into cells, assign each square to a cell, and only check squares in the same or neighbouring cells. Measure the speedup and verify it is closer to O(n) than O(n squared).',
      successHint: 'Computational complexity is the bridge between theoretical algorithms and practical software engineering. The same analysis applies to database queries, search engines, physics simulations, and machine learning. Understanding complexity lets you predict whether an algorithm will finish in milliseconds or millennia.',
    },
    {
      title: 'Defect analysis — when tessellations have imperfections',
      concept: `Real tessellations — whether carved in stone or computed by algorithm — have imperfections. A **defect** in a tessellation is a point where the expected pattern breaks: a polygon with the wrong number of sides, a vertex where angles do not sum to 360 degrees, or an edge that does not match its neighbour.

In crystallography, defects are classified as: **point defects** (a single polygon is wrong), **line defects** (a row of misaligned tiles), and **grain boundaries** (where two perfect regions meet at the wrong angle). The same classification applies to stone carvings, where a chisel slip can create a point defect or a misaligned template can create a line defect.

In the code below, you will generate a tessellation, introduce controlled defects, and then build a defect detector that identifies and classifies them. This connects geometry to quality control — the same problem the Mahabalipuram carvers faced.

*Defects are not always bad. In materials science, controlled defects give materials useful properties: the phosphorus atoms "defecting" in a silicon crystal make it a semiconductor. In art, intentional imperfections (called "wabi-sabi" in Japanese) add character.*`,
      analogy: 'Imagine a marching band in formation. A point defect is one musician in the wrong position. A line defect is an entire row shifted half a step. A grain boundary is where two groups that practiced separately try to merge — their formations are perfect individually but misaligned with each other.',
      storyConnection: 'Modern archaeologists studying Mahabalipuram screens use defect analysis to determine whether a panel was carved by one craftsman or several. A single carver produces consistent small errors (personal "signature"). Multiple carvers produce grain boundaries where their sections meet. Defect patterns are forensic evidence of the construction process.',
      checkQuestion: 'In a hexagonal tessellation, each interior vertex has 3 hexagons meeting (angle sum 360 degrees). If you find a vertex with only 2 hexagons (240 degrees), what happened?',
      checkAnswer: 'A pentagon defect: one of the three hexagons has been replaced by a pentagon (which has an interior angle of 108 degrees instead of 120 degrees). The missing 120 degrees creates a 240-degree vertex. This is a point defect — it introduces curvature into the otherwise flat surface. This is exactly how a soccer ball works: 12 pentagons among 20 hexagons curve the surface into a sphere.',
      codeIntro: 'Build a defect detector for tessellation patterns.',
      code: `import numpy as np

class TessellationDefectAnalyser:
    def __init__(self, grid_size):
        self.size = grid_size
        # Create a perfect hexagonal-ish grid (6 neighbours each)
        self.grid = {}
        for r in range(grid_size):
            for c in range(grid_size):
                self.grid[(r, c)] = {
                    "sides": 6,
                    "angle": 120.0,
                    "position": (r, c),
                    "defect": None,
                }

    def introduce_point_defect(self, r, c, new_sides):
        """Change one polygon's side count (e.g., hexagon -> pentagon)."""
        if (r, c) in self.grid:
            self.grid[(r, c)]["sides"] = new_sides
            self.grid[(r, c)]["angle"] = (new_sides - 2) * 180.0 / new_sides

    def introduce_line_defect(self, row, shift=0.5):
        """Shift an entire row (dislocation)."""
        for c in range(self.size):
            if (row, c) in self.grid:
                self.grid[(row, c)]["defect"] = "shifted"

    def introduce_grain_boundary(self, col):
        """Misalignment boundary between left and right regions."""
        for r in range(self.size):
            if (r, col) in self.grid:
                self.grid[(r, col)]["defect"] = "grain_boundary"

    def detect_defects(self):
        """Scan the grid and classify all defects."""
        point_defects = []
        line_defects = []
        boundary_defects = []

        for (r, c), cell in self.grid.items():
            if cell["sides"] != 6:
                point_defects.append({
                    "position": (r, c),
                    "type": "polygon",
                    "expected_sides": 6,
                    "actual_sides": cell["sides"],
                    "angle_deficit": 120.0 - cell["angle"],
                })
            if cell["defect"] == "shifted":
                line_defects.append({"position": (r, c), "type": "dislocation"})
            if cell["defect"] == "grain_boundary":
                boundary_defects.append({"position": (r, c), "type": "grain_boundary"})

        return point_defects, line_defects, boundary_defects

# Create and analyse a tessellation with defects
analyser = TessellationDefectAnalyser(15)

# Introduce defects
analyser.introduce_point_defect(3, 5, 5)    # pentagon at (3,5)
analyser.introduce_point_defect(3, 6, 7)    # heptagon at (3,6)
analyser.introduce_point_defect(8, 8, 5)    # pentagon at (8,8)
analyser.introduce_line_defect(7)            # dislocation at row 7
analyser.introduce_grain_boundary(10)        # boundary at column 10

points, lines, boundaries = analyser.detect_defects()

print("=== Tessellation Defect Analysis Report ===")
print(f"Grid size: {analyser.size}x{analyser.size} = {analyser.size**2} cells")
print()

print(f"Point defects found: {len(points)}")
for d in points:
    print(f"  Position {d['position']}: {d['actual_sides']}-gon "
          f"(expected 6-gon, angle deficit: {d['angle_deficit']:.1f} deg)")

print(f"\
Line defects found: {len(lines)}")
if lines:
    rows = set(d["position"][0] for d in lines)
    print(f"  Affected rows: {sorted(rows)}")
    print(f"  Total displaced cells: {len(lines)}")

print(f"\
Grain boundaries found: {len(boundaries)}")
if boundaries:
    cols = set(d["position"][1] for d in boundaries)
    print(f"  Boundary columns: {sorted(cols)}")
    print(f"  Total boundary cells: {len(boundaries)}")

# Curvature analysis
print()
print("=== Curvature from Point Defects ===")
total_deficit = sum(d["angle_deficit"] for d in points)
print(f"Total angle deficit: {total_deficit:.1f} degrees")
print(f"  Pentagon (5-gon): +12 deg deficit --> positive curvature (dome)")
print(f"  Heptagon (7-gon): -8.6 deg deficit --> negative curvature (saddle)")
print(f"  Net curvature: {'positive (dome)' if total_deficit > 0 else 'negative (saddle)' if total_deficit < 0 else 'flat'}")`,
      challenge: 'Create a "soccer ball" by introducing exactly 12 pentagons into a hexagonal grid (with no heptagons). Verify that the total angle deficit is exactly 720 degrees — the amount needed to close a flat surface into a sphere (Gauss-Bonnet theorem again).',
      successHint: 'Defect analysis in tessellations is directly analogous to defect analysis in crystals. Point defects in crystals (vacancies, interstitials) control electrical conductivity. Line defects (dislocations) control mechanical strength. You have connected ancient stone carving geometry to modern materials science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Penrose tilings, aperiodicity, and computational geometry</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises explore aperiodic tilings, Voronoi tessellations, and computational geometry.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
