import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'numpy',
  title: 'NumPy',
  category: 'data-science',
  tags: ['math'],
  keywords: ['linear algebra', 'matrix', 'vector', 'eigenvalue', 'dot product', 'broadcasting', 'gaussian'],
  icon: '🔢',
  tagline: 'Fast math on arrays of numbers',
  relatedStories: ['girl-who-spoke-to-elephants', 'bamboo-flute-of-nagaland', 'how-majuli-island-was-born', 'why-the-muga-silk-is-golden'],

  understand: [
    {
      title: 'Why Arrays Matter',
      beginnerContent:
        'Imagine you have 1,000 temperature readings and you want to convert all of them from ' +
        'Celsius to Fahrenheit. With a plain Python list, you would write a loop that visits each ' +
        'value one by one — 1,000 trips. NumPy does the same conversion in a single operation ' +
        'on the whole array at once, often 50-100x faster. The secret is that NumPy stores numbers ' +
        'in a tightly packed block of memory (like seats in a cinema row), so the processor can ' +
        'blast through them without stopping to look up each one. This speed difference does not ' +
        'matter for 10 numbers, but it is essential for millions — which is what real data science, ' +
        'machine learning, and image processing involve.',
      intermediateContent:
        'NumPy arrays vs Python lists: np.arange(1_000_000).sum() runs **50-100× faster** than sum(range(1_000_000)) because NumPy uses compiled C loops on contiguous memory. Array creation: np.zeros((3,4)), np.ones(5), np.linspace(0, 2*np.pi, 100), np.random.randn(1000). Array attributes: a.shape, a.dtype, a.ndim, a.size. Reshaping: np.arange(12).reshape(3,4). Broadcasting: a * 2 doubles every element; a + np.array([1,2,3,4]) adds to every row.',
      advancedContent:
        '**Linear algebra in NumPy — the operations behind ML:**\n\n' +
        '| Operation | Code | What it does |\n' +
        '|---|---|---|\n' +
        '| Matrix multiply | A @ B | Rows of A dot columns of B — core of neural networks |\n' +
        '| Inverse | np.linalg.inv(A) | A⁻¹ such that A @ A⁻¹ = I — used in least-squares regression |\n' +
        '| Eigenvalues | np.linalg.eig(A) | Finds directions where A only scales (no rotation) — PCA |\n' +
        '| SVD | np.linalg.svd(A) | Decomposes any matrix into rotation × stretch × rotation — image compression, recommendation systems |\n' +
        '| FFT | np.fft.fft(signal) | Converts time-domain signal to frequency spectrum |\n\n' +
        '**Memory layout matters for speed:**\n' +
        'A 2D array can be stored row-by-row (C order, default) or column-by-column (Fortran order). ' +
        'CPUs load data in chunks (cache lines). If you iterate along the contiguous axis, each cache load gets you 8 useful values. ' +
        'If you iterate the wrong way, each cache load gets 1 useful value and 7 wasted ones → 3-10× slower.\n\n' +
        '**Practical rule:** If your array is C-order (default), iterate over rows (axis=1) for fast inner loops. ' +
        'If operations are slow, check with `a.flags` — if C_CONTIGUOUS is False, call `np.ascontiguousarray(a)` to fix it.\n\n' +
        '**Advanced indexing:**\n' +
        '- Boolean mask: `a[a > threshold]` — select elements matching a condition\n' +
        '- Fancy indexing: `a[[0, 3, 7]]` — select specific indices\n' +
        '- np.where(condition, x, y) — element-wise if/else: `np.where(temps > 30, "hot", "ok")`',
      diagram: 'NumPyRulerDiagram',
    },
    {
      title: 'The Speed Difference — Lists vs Arrays',
      beginnerContent:
        'A Python list is like a drawer of labeled envelopes — each envelope can hold any type of ' +
        'object, so the computer has to open each one individually. A NumPy array is like a sheet ' +
        'of graph paper where every cell holds the same type of number. Because the computer knows ' +
        'exactly where each number is and that they are all the same type, it can process them in ' +
        'bulk using special CPU instructions (SIMD). For 1 million additions, a Python list loop ' +
        'might take 200 milliseconds; NumPy does it in 2 milliseconds. This is not a minor ' +
        'optimization — it is the difference between a program that feels instant and one that ' +
        'makes you wait.',
      intermediateContent:
        'NumPy achieves 50-100× speed over Python lists through: (1) contiguous memory layout (no pointer chasing), (2) compiled C/Fortran inner loops (no Python interpreter overhead), (3) SIMD instructions (Single Instruction Multiple Data — process 4-8 numbers simultaneously). Benchmark: squaring 1 million numbers — Python list: ~150ms, NumPy: ~1.5ms. The speedup increases with array size because the fixed overhead of calling NumPy becomes negligible. Memory efficiency: a Python list of 1M integers uses ~28 MB (each int is a 28-byte object), while a NumPy int64 array uses ~8 MB (raw 8-byte values in contiguous memory).',
      advancedContent:
        '**The performance stack under NumPy:**\n\n' +
        'When you write `A @ B` for 1000×1000 matrices, NumPy doesn\'t use Python at all. It calls down through layers of optimization:\n\n' +
        '```\n' +
        'Your code: A @ B (Python)\n' +
        '  → NumPy C code: selects the right BLAS routine\n' +
        '    → BLAS library (OpenBLAS or Intel MKL): dgemm\n' +
        '      → Cache-blocked loops (process 64×64 tiles that fit in L1 cache)\n' +
        '        → SIMD instructions (process 4-8 multiplications simultaneously)\n' +
        '          → Multiple CPU cores (if MKL/OpenBLAS is multithreaded)\n' +
        '```\n\n' +
        '**The speed difference is staggering:**\n' +
        '| Method | 1000×1000 matrix multiply | Why |\n' +
        '|---|---|---|\n' +
        '| Python triple loop | ~3 hours | Interpreter overhead per operation |\n' +
        '| NumPy (OpenBLAS) | ~20 ms | Compiled C with SIMD + cache blocking |\n' +
        '| Speedup | **~500,000×** | |\n\n' +
        '**Debugging slow NumPy code:**\n' +
        'If your NumPy code is slow, you almost certainly have an accidental Python loop. Common culprits:\n' +
        '- `for i in range(len(a)): result[i] = a[i] * b[i]` → replace with `result = a * b`\n' +
        '- Appending to a list in a loop, then converting → pre-allocate with np.empty() and fill\n' +
        '- Calling a Python function per element → use np.vectorize() (still slow) or rewrite as array operations',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A NumPy array stores all elements as the same data type, which makes it faster than a Python list.', answer: true, explanation: 'Uniform type means the CPU can process elements in bulk using SIMD instructions, avoiding per-element type checks.' },
            { text: 'For 10 numbers, NumPy is significantly faster than a regular Python list.', answer: false, explanation: 'NumPy has startup overhead. For tiny arrays the speed difference is negligible. The gains appear with thousands or millions of elements.' },
          ],
        },
      },
    },
    {
      title: 'Creating Arrays — From Lists and From Scratch',
      beginnerContent:
        'You can create a NumPy array from any Python list: np.array([1, 2, 3]). But NumPy also ' +
        'has helper functions to generate common arrays without typing every value. np.zeros(100) ' +
        'gives you 100 zeros. np.ones((3, 4)) gives a 3-by-4 grid of ones. np.arange(0, 10, 0.5) ' +
        'counts from 0 to 10 in steps of 0.5 — like Python\'s range() but for decimals. ' +
        'np.linspace(0, 1, 50) gives 50 evenly spaced points from 0 to 1, which is perfect for ' +
        'plotting smooth curves. np.random.randn(1000) gives 1,000 random numbers from a bell ' +
        'curve — useful for simulations.',
      intermediateContent:
        'Array creation patterns: np.zeros((rows, cols)) for initialized arrays, np.empty((rows, cols)) for uninitialized (faster but contains garbage), np.full((3,3), 7) for a specific value, np.eye(n) for identity matrix, np.diag([1,2,3]) for diagonal matrix. Random: np.random.seed(42) for reproducibility, np.random.randint(0, 100, size=(5,5)) for integers, np.random.normal(mean, std, size) for Gaussian. Structured arrays: dt = np.dtype([("name", "U20"), ("weight", "f4")]); data = np.array([("Ranga", 4500)], dtype=dt) — named fields like a database row.',
      advancedContent:
        '**Views vs copies — the most common NumPy bug:**\n\n' +
        'Slicing an array creates a **view** — a window into the same memory, not a separate copy:\n' +
        '```\n' +
        'a = np.array([10, 20, 30, 40, 50])\n' +
        'b = a[1:4]    # b is a VIEW of a\n' +
        'b[0] = 999    # THIS MODIFIES a!\n' +
        'print(a)      # [10, 999, 30, 40, 50]  — surprise!\n' +
        '```\n' +
        'Fix: `b = a[1:4].copy()` creates an independent copy. Check with `np.shares_memory(a, b)`.\n\n' +
        '**Rules of thumb:**\n' +
        '- Basic slicing (a[1:4], a[::2]) → **view** (fast, shares memory)\n' +
        '- Fancy indexing (a[[0, 2, 4]]) → **copy** (new memory)\n' +
        '- Boolean indexing (a[a > 3]) → **copy**\n' +
        '- Reshape → **view** (if possible) or copy (if memory layout requires it)\n\n' +
        '**Memory-mapped files — when data exceeds RAM:**\n' +
        'A satellite image might be 50 GB. np.memmap maps the file directly to virtual memory:\n' +
        '```\n' +
        'data = np.memmap("satellite.dat", dtype="float32", mode="r", shape=(100000, 50000))\n' +
        'patch = data[1000:1100, 2000:2100]  # only this 100×100 patch is loaded into RAM\n' +
        '```\n' +
        'The OS transparently pages data in/out — you write normal NumPy code, but only the accessed slices actually occupy RAM.',
    },
    {
      title: 'Math on Entire Arrays — No Loops Needed',
      beginnerContent:
        'The most powerful idea in NumPy is *vectorized operations*: math applies to every element ' +
        'at once. If `a = np.array([1, 2, 3])`, then `a * 2` gives `[2, 4, 6]` — no loop required. ' +
        'You can add arrays together (`a + b` adds element by element), compare them (`a > 2` gives ' +
        '`[False, False, True]`), and even apply functions like `np.sqrt(a)` to every element. ' +
        'This is not just faster — it is also easier to read. Compare `[x**2 for x in my_list]` ' +
        'with `my_array ** 2`. The NumPy version is shorter and clearer about what it does.',
      intermediateContent:
        'Element-wise operations: a + b, a * b, a ** 2, np.sqrt(a), np.sin(a) all operate on every element without loops. Comparison: a > 5 returns a boolean array. Aggregation: a.sum(), a.mean(), a.max(), a.min(), a.std() — add axis= parameter for row/column operations: a.sum(axis=0) sums each column, axis=1 sums each row. Universal functions (ufuncs) like np.add, np.multiply accept an out= parameter for in-place operation, avoiding temporary array allocation.',
      advancedContent:
        '**Broadcasting rules — how NumPy handles mismatched shapes:**\n\n' +
        'When you add a (3,4) array to a (4,) array, NumPy doesn\'t crash — it "broadcasts" the smaller array to match.\n\n' +
        '**The two rules:**\n' +
        '1. If shapes have different numbers of dimensions, prepend 1s to the shorter shape: (4,) becomes (1,4)\n' +
        '2. Dimensions of size 1 stretch to match the other: (1,4) stretches to (3,4)\n\n' +
        '**Step-by-step example:**\n' +
        '```\n' +
        'data = np.array([[1,2,3,4],    # shape (3,4)\n' +
        '                 [5,6,7,8],\n' +
        '                 [9,10,11,12]])\n' +
        'row_means = data.mean(axis=0)   # shape (4,) → [5.0, 6.0, 7.0, 8.0]\n' +
        'centered = data - row_means     # (3,4) - (4,) → (3,4) - (1,4) → (3,4)\n' +
        '```\n' +
        'Each row has the column mean subtracted — WITHOUT creating a (3,4) temporary copy of row_means. Broadcasting operates element-by-element using the original (4,) array.\n\n' +
        '**Outer product via broadcasting:**\n' +
        '```\n' +
        'a = np.array([1,2,3]).reshape(3,1)  # shape (3,1)\n' +
        'b = np.array([10,20,30,40])          # shape (4,)\n' +
        'result = a * b                       # (3,1) × (1,4) → (3,4) multiplication table\n' +
        '```\n\n' +
        '**Einstein summation** — a compact notation for complex operations:\n' +
        '`np.einsum("ij,jk->ik", A, B)` = matrix multiplication. "ij,jk->ik" means: sum over shared index j, keep i and k. ' +
        'Einsum can express matrix multiply, trace, transpose, outer product, and batch operations in one line.',
    },
    {
      title: 'Filtering Data — Boolean Indexing',
      beginnerContent:
        'One of NumPy\'s most useful tricks is filtering with boolean arrays. If `temps` is an ' +
        'array of temperatures, then `temps > 30` gives you an array of True/False values — True ' +
        'where the temperature exceeds 30. You can use this as a filter: `temps[temps > 30]` returns ' +
        'only the hot days. You can combine conditions: `temps[(temps > 25) & (temps < 35)]` returns ' +
        'temperatures between 25 and 35. This replaces multi-line loops with a single, readable ' +
        'expression. Data scientists use this constantly to select subsets of data for analysis.',
      intermediateContent:
        'Statistical operations: weights = np.array([4500, 3200, 4800, 5100, 3800]). Mean: np.mean(weights) = **4280**. Median: np.median(weights) = 4500. Std dev: np.std(weights) ≈ 716. Percentiles: np.percentile(weights, 75) = 4800. Sorting: np.sort(weights). Argmax: np.argmax(weights) = 3 (index of 5100). Boolean indexing: heavy = weights[weights > 4000] → [4500, 4800, 5100]. These operations run on entire arrays without Python loops.',
      advancedContent:
        '**Linear regression with NumPy — the math behind "best fit line":**\n\n' +
        'Given data points (x₁,y₁)…(xₙ,yₙ), find the line y = β₀ + β₁x that minimizes the sum of squared errors.\n\n' +
        'The solution: **β = (XᵀX)⁻¹ Xᵀy**, where X is the design matrix (column of 1s + column of x values).\n\n' +
        '**Worked example in NumPy:**\n' +
        '```\n' +
        'x = np.array([1, 2, 3, 4, 5])     # study hours\n' +
        'y = np.array([52, 58, 65, 70, 78]) # exam scores\n' +
        'X = np.column_stack([np.ones(5), x])  # [[1,1],[1,2],[1,3],[1,4],[1,5]]\n' +
        'beta = np.linalg.lstsq(X, y, rcond=None)[0]\n' +
        '# beta[0] = intercept ≈ 44.6, beta[1] = slope ≈ 6.4\n' +
        '# Interpretation: each extra study hour ≈ +6.4 points\n' +
        '```\n\n' +
        '**Image processing — images are just arrays:**\n' +
        'A 640×480 grayscale photo is a (480, 640) array of integers 0-255. ' +
        'Cropping: `image[100:200, 50:150]`. Brightening: `np.clip(image + 50, 0, 255)`. ' +
        'Blurring: convolve with a 3×3 averaging kernel. Edge detection: convolve with a Sobel kernel. ' +
        'A color image is (480, 640, 3) — the third axis is [R, G, B]. Grayscale conversion: `0.299*R + 0.587*G + 0.114*B` (human eye sensitivity).',
    },
    {
      title: 'Real-World Data Shapes',
      beginnerContent:
        'A 1D array is a row of numbers (a single measurement over time). A 2D array is a grid ' +
        '(rows and columns) like a spreadsheet — each row might be a student, each column a subject. ' +
        'A 3D array adds depth: a color image is rows x columns x 3 (red, green, blue channels). ' +
        'A video is a 4D array: frames x rows x columns x channels. NumPy handles all of these ' +
        'with the same tools. The `.shape` attribute tells you the dimensions: (1000,) for 1D, ' +
        '(480, 640, 3) for an image. Thinking in shapes is the key to working with real data.',
      intermediateContent:
        'Data dimensionality: 1D array = time series or sensor readings, 2D = spreadsheet/table or grayscale image, 3D = color image (height × width × channels) or time series of 2D frames, 4D = batch of images (batch × height × width × channels). Reshape without copying: a.reshape(3, -1) infers the second dimension. Transpose: a.T swaps axes. Stacking: np.vstack((a, b)) vertical, np.hstack horizontal, np.concatenate along any axis. The shape attribute is your most-used diagnostic tool — print(data.shape) should be your first debugging step.',
      advancedContent:
        '**The data pipeline — how NumPy connects to everything:**\n\n' +
        'NumPy is the foundation layer. Every data science library in Python converts to/from NumPy arrays:\n\n' +
        '**Tabular data pipeline:**\n' +
        '```\n' +
        'CSV file → pandas.read_csv() → DataFrame (labeled columns, handles NaN)\n' +
        '  → df.values → NumPy array → scikit-learn model.fit(X, y)\n' +
        '```\n\n' +
        '**Image pipeline:**\n' +
        '```\n' +
        'JPEG/PNG → PIL.Image.open() or cv2.imread() → np.array\n' +
        '  → shape: (height, width, 3) with dtype uint8 (0-255)\n' +
        '  → normalize: image / 255.0 → float64 (0.0-1.0)\n' +
        '  → reshape for model: (batch, channels, height, width) for PyTorch\n' +
        '```\n\n' +
        '**Audio pipeline:**\n' +
        '```\n' +
        'WAV file → scipy.io.wavfile.read() → (sample_rate, np.array)\n' +
        '  → shape: (num_samples,) for mono, (num_samples, 2) for stereo\n' +
        '  → np.fft.fft() → frequency spectrum\n' +
        '  → scipy.signal.spectrogram() → time-frequency representation\n' +
        '```\n\n' +
        '**Satellite/GIS pipeline:**\n' +
        '```\n' +
        'GeoTIFF → rasterio.open() → np.array + coordinate metadata\n' +
        '  → shape: (bands, height, width) — bands might be [Red, Green, Blue, NIR, SWIR]\n' +
        '  → NDVI = (NIR - Red) / (NIR + Red) → vegetation health map\n' +
        '```\n\n' +
        'The pattern: every domain loads data into NumPy arrays, then the same tools (statistics, linear algebra, FFT, ML) work regardless of source.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the NumPy function to what it does',
          pairs: [
            ['np.array([1,2,3])', 'Create an array from a Python list'],
            ['np.zeros(100)', 'Create an array of 100 zeros'],
            ['np.linspace(0, 1, 50)', 'Create 50 evenly spaced values from 0 to 1'],
            ['np.mean(a)', 'Calculate the average of all values'],
            ['a[a > 5]', 'Filter to keep only values greater than 5'],
            ['a.reshape(3, 4)', 'Rearrange into a 3-row, 4-column grid'],
          ],
        },
      },
    },
  ],

  build: [
    {
      title: 'Creating Arrays',
      beginnerContent:
        'Arrays can be created from lists, or generated with helper functions for common patterns.',
      code: `import numpy as np

# From a Python list
temps = np.array([28.1, 30.5, 27.3, 32.0, 29.4])
print(temps)        # [28.1 30.5 27.3 32.  29.4]
print(temps.dtype)  # float64

# Generated arrays
zeros = np.zeros(5)              # [0. 0. 0. 0. 0.]
ones = np.ones((3, 4))           # 3x4 grid of 1s
rng = np.arange(0, 10, 0.5)     # 0.0, 0.5, 1.0, ... 9.5
lin = np.linspace(0, 1, 5)      # [0.   0.25 0.5  0.75 1.  ]
ints = np.arange(1, 11)          # [1, 2, 3, ..., 10]

# Random arrays
normal = np.random.randn(1000)           # 1000 values from bell curve
uniform = np.random.uniform(0, 100, 50)  # 50 values between 0 and 100

# Check shape and size
print(temps.shape)   # (5,)     — 1D, 5 elements
print(ones.shape)    # (3, 4)   — 2D, 3 rows x 4 columns
print(ones.size)     # 12       — total element count`,
    },
    {
      title: 'Vectorized Math — No Loops',
      beginnerContent:
        'Operations apply element-by-element. This is the core superpower of NumPy.',
      code: `import numpy as np

a = np.array([1, 2, 3, 4, 5])

# Arithmetic on every element at once
print(a * 2)       # [ 2  4  6  8 10]
print(a ** 2)      # [ 1  4  9 16 25]
print(a + 10)      # [11 12 13 14 15]

# Element-wise operations between two arrays
b = np.array([10, 20, 30, 40, 50])
print(a + b)       # [11 22 33 44 55]
print(a * b)       # [ 10  40  90 160 250]

# Math functions apply to every element
print(np.sqrt(a))  # [1.   1.41 1.73 2.   2.24]
print(np.log(a))   # [0.   0.69 1.10 1.39 1.61]

# Celsius to Fahrenheit — the whole array at once
celsius = np.array([0, 20, 37, 100])
fahrenheit = celsius * 9/5 + 32
print(fahrenheit)  # [ 32.  68.  98.6 212. ]

# Compare: Python loop vs NumPy for 1 million values
# Loop:  [x * 2 for x in range(1_000_000)]  ~120ms
# NumPy: np.arange(1_000_000) * 2            ~2ms`,
    },
    {
      title: 'Statistics on Arrays',
      beginnerContent:
        'NumPy has built-in functions for all common statistical operations.',
      code: `import numpy as np

scores = np.array([72, 85, 90, 68, 95, 88, 76, 82, 91, 79])

# Central tendency
print(f"Mean:   {np.mean(scores):.1f}")    # 82.6
print(f"Median: {np.median(scores):.1f}")  # 83.5

# Spread
print(f"Std:    {np.std(scores):.1f}")     # 8.5
print(f"Var:    {np.var(scores):.1f}")     # 72.4
print(f"Range:  {scores.max() - scores.min()}")  # 27

# Percentiles / quartiles
print(f"25th:   {np.percentile(scores, 25):.1f}")
print(f"75th:   {np.percentile(scores, 75):.1f}")

# Sorting and ranking
sorted_scores = np.sort(scores)
print(f"Sorted: {sorted_scores}")
print(f"Rank order: {np.argsort(scores)}")  # indices that would sort it

# Cumulative sum (running total)
print(f"Cumsum: {np.cumsum(scores)}")

# Correlation between two arrays
hours = np.array([2, 3, 1, 5, 4, 6, 3, 7, 5, 8])
r = np.corrcoef(hours, scores)[0, 1]
print(f"Correlation study hours vs scores: {r:.3f}")`,
    },
    {
      title: 'Boolean Indexing — Filtering Data',
      beginnerContent:
        'Use comparisons to create boolean masks, then use those masks to select matching elements.',
      intermediateContent:
        'Pearson correlation r measures linear association: r = Σ[(xᵢ-x̄)(yᵢ-ȳ)] / √[Σ(xᵢ-x̄)² × Σ(yᵢ-ȳ)²]. r = +1 (perfect positive), r = 0 (no linear relationship), r = -1 (perfect negative). Example: elephant height vs weight r ≈ 0.85 (strong positive). **Correlation ≠ causation**: ice cream sales and drowning deaths are correlated (both increase in summer) but ice cream doesn\'t cause drowning — the confounding variable is temperature. Always ask: is there a plausible mechanism? Could a third variable explain both?',
      advancedContent:
        '**Spearman vs Pearson — choosing the right correlation:**\n\n' +
        'Pearson r measures LINEAR association. Spearman rₛ measures MONOTONIC association (any consistently increasing/decreasing relationship, even curved).\n\n' +
        '**When they differ:** If study hours vs scores follows a curve (diminishing returns — going from 1→2 hours helps a lot, ' +
        '7→8 hours barely helps), Pearson might give r = 0.85, but Spearman gives rₛ = 0.98 — correctly detecting the near-perfect monotonic trend.\n\n' +
        '**How Spearman works:** Replace each value with its rank (1st, 2nd, 3rd…), then compute Pearson r on the ranks. ' +
        'Ranks are immune to outliers — a temperature of 9999°C just becomes "rank 1" instead of distorting the entire calculation.\n\n' +
        '**Partial correlation — removing confounders:**\n' +
        'Ice cream sales correlate with drowning (r ≈ 0.85). But both are driven by temperature. ' +
        'Partial correlation removes the effect of temperature from both variables, then measures what is left. ' +
        'Formula: r₁₂.₃ = (r₁₂ − r₁₃ × r₂₃) / √((1−r₁₃²)(1−r₂₃²)). The result: r ≈ 0.05 — the apparent correlation vanishes.',
      code: `import numpy as np

temps = np.array([22, 28, 35, 19, 31, 40, 27, 33, 18, 29])
days = np.array(["Mon","Tue","Wed","Thu","Fri","Sat","Sun",
                "Mon","Tue","Wed"])

# Boolean mask: which days were hot?
hot = temps > 30
print(hot)  # [False False True False True True False True False False]

# Use the mask to filter
print(f"Hot temps: {temps[hot]}")   # [35 31 40 33]
print(f"Hot days:  {days[hot]}")    # ['Wed' 'Fri' 'Sat' 'Mon']

# Combine conditions with & (and), | (or), ~ (not)
comfortable = (temps >= 20) & (temps <= 30)
print(f"Comfortable: {temps[comfortable]}")  # [22 28 27 29]

# Count and percentage
print(f"Hot days: {hot.sum()} out of {len(temps)}")
print(f"Percentage: {hot.mean() * 100:.0f}%")

# Replace values conditionally
capped = np.where(temps > 35, 35, temps)  # cap at 35
print(f"Capped: {capped}")  # [22 28 35 19 31 35 27 33 18 29]`,
    },
    {
      title: 'Reshaping and Slicing',
      beginnerContent:
        'Change the shape of data to match what your analysis needs, and select subsets with powerful slicing.',
      code: `import numpy as np

# Reshape: turn 1D into 2D
data = np.arange(12)           # [0, 1, 2, ..., 11]
grid = data.reshape(3, 4)     # 3 rows, 4 columns

print(grid)
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]

# Slicing: grid[rows, cols]
print(grid[0, :])      # first row:      [0 1 2 3]
print(grid[:, 2])      # third column:   [2 6 10]
print(grid[1:, 1:3])   # rows 1-2, cols 1-2: [[5 6] [9 10]]
print(grid[-1, -1])    # bottom-right:   11

# Transpose: swap rows and columns
print(grid.T)
# [[ 0  4  8]
#  [ 1  5  9]
#  [ 2  6 10]
#  [ 3  7 11]]

# Flatten back to 1D
flat = grid.flatten()
print(flat)  # [ 0  1  2  3  4  5  6  7  8  9 10 11]

# Stack arrays together
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(np.vstack([a, b]))   # [[1 2 3], [4 5 6]]  — vertical
print(np.hstack([a, b]))   # [1 2 3 4 5 6]        — horizontal`,
    },
    {
      title: 'Real-World Example: Analyzing Sensor Data',
      beginnerContent:
        'Putting it all together — load, clean, analyze, and summarize a dataset using NumPy.',
      code: `import numpy as np

# Simulate 30 days of temperature readings (3 sensors per day)
np.random.seed(42)
data = np.random.normal(28, 5, (30, 3))  # 30 days x 3 sensors

# Add some "bad" readings (sensor glitches)
data[5, 1] = -999   # sensor 2 glitched on day 6
data[20, 0] = 999    # sensor 1 glitched on day 21

print(f"Shape: {data.shape}")  # (30, 3)
print(f"Raw mean: {data.mean():.1f}")  # skewed by glitches

# Clean: replace extreme values with NaN
data[(data < -50) | (data > 50)] = np.nan

# nanmean ignores NaN values
print(f"Clean mean: {np.nanmean(data):.1f}")

# Per-sensor statistics (axis=0 means "along rows" → one value per column)
for i, label in enumerate(["Sensor A", "Sensor B", "Sensor C"]):
  col = data[:, i]
  print(f"{label}: mean={np.nanmean(col):.1f}, "
        f"std={np.nanstd(col):.1f}, "
        f"valid={np.count_nonzero(~np.isnan(col))}/30")

# Daily average across sensors
daily_avg = np.nanmean(data, axis=1)  # one value per row
hottest_day = np.nanargmax(daily_avg)
print(f"Hottest day: #{hottest_day + 1} ({daily_avg[hottest_day]:.1f}°C)")`,
    },
  ],
};
