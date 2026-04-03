import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AlgebraQuadraticDiagram from '../diagrams/AlgebraQuadraticDiagram';
import AlgebraAlgorithmDiagram from '../diagrams/AlgebraAlgorithmDiagram';
import AlgebraLinearDiagram from '../diagrams/AlgebraLinearDiagram';
import MatrixMultiplicationDiagram from '../diagrams/MatrixMultiplicationDiagram';
import DecisionTreeDiagram from '../diagrams/DecisionTreeDiagram';
import FlowchartDiagram from '../diagrams/FlowchartDiagram';

export default function AlKhwarizmiLevel3() {
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
      title: 'Polynomial equations — beyond quadratics',
      concept: `Al-Khwarizmi solved linear (degree 1) and quadratic (degree 2) equations. What about higher degrees?

A **polynomial** of degree n is: aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀

- Degree 3 (**cubic**): x³ − 6x² + 11x − 6 = 0
- Degree 4 (**quartic**): formulas exist but are extremely complex
- Degree 5+ (**quintic**): Galois proved in 1832 that NO general formula exists — one of the most profound results in mathematics

For cubics and beyond, we use **numerical methods** — algorithms that find approximate solutions by iteration. The most famous is **Newton’s method**: start with a guess, then repeatedly improve it using the derivative.

The code below uses NumPy’s polynomial root finder and also implements Newton’s method from scratch.`,
      analogy: 'Imagine finding where a roller coaster crosses ground level. A linear function is a straight slide (one crossing). A quadratic is a bump (up to two crossings). A cubic is an S-curve (up to three crossings). Higher-degree polynomials are wilder roller coasters with more humps and crossings.',
      storyConnection: 'Al-Khwarizmi solved degrees 1 and 2. Omar Khayyam (another Islamic mathematician, 1048–1131) solved degree 3 using the intersections of conic sections — a geometric approach in al-Khwarizmi’s tradition. The quest to solve higher-degree equations drove mathematics forward for centuries.',
      checkQuestion: 'Why can’t there be a general formula for degree 5+ polynomials?',
      checkAnswer: 'Évariste Galois proved (using group theory) that the roots of a general quintic cannot be expressed using only addition, subtraction, multiplication, division, and nth roots. The proof is deep and connects to the symmetry structure of the polynomial’s roots. This does NOT mean they have no solutions — just that no formula using basic operations can express them.',
      codeIntro: 'Find roots of cubic polynomials using NumPy and Newton’s method.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cubic: x^3 - 6x^2 + 11x - 6 = 0
# Factors: (x-1)(x-2)(x-3) = 0, so roots are 1, 2, 3

coefficients = [1, -6, 11, -6]  # highest power first
roots = np.roots(coefficients)
print("=== Cubic: x³ - 6x² + 11x - 6 = 0 ===")
print(f"Roots (NumPy): {roots}")
print()

# Newton's method: find roots iteratively
def newton(f, df, x0, tol=1e-10, max_iter=50):
    """Find root of f(x) = 0 starting from x0."""
    x = x0
    history = [x]
    for i in range(max_iter):
        fx = f(x)
        dfx = df(x)
        if abs(dfx) < 1e-15: break
        x = x - fx / dfx
        history.append(x)
        if abs(fx) < tol: break
    return x, history

f = lambda x: x**3 - 6*x**2 + 11*x - 6
df = lambda x: 3*x**2 - 12*x + 11

print("=== Newton's Method ===")
for guess in [0.5, 1.5, 2.5]:
    root, hist = newton(f, df, guess)
    print(f"  Start at x={guess}: converges to x={root:.6f} in {len(hist)-1} steps")
print()

# Plot the cubic and its roots
x = np.linspace(-0.5, 4, 200)
y = x**3 - 6*x**2 + 11*x - 6

plt.figure(figsize=(8, 5))
plt.plot(x, y, linewidth=2.5, color='#6366f1')
plt.axhline(0, color='gray', linewidth=0.5)
for r in [1, 2, 3]:
    plt.plot(r, 0, 'o', color='#10b981', markersize=10, zorder=5)
    plt.annotate(f'x={r}', xy=(r, 0), xytext=(r+0.1, 1), fontsize=10, color='#10b981')

plt.xlabel('x', fontsize=12)
plt.ylabel('f(x)', fontsize=12)
plt.title('Cubic: x³ - 6x² + 11x - 6', fontsize=13)
plt.grid(alpha=0.3)
plt.show()

print("Al-Khwarizmi's methods scale up: same idea (isolate, simplify, solve),")
print("but for higher degrees we need iteration instead of exact formulas.")`,
      challenge: 'Try f(x) = x⁵ − x − 1 (a quintic). NumPy can find its roots numerically. Use Newton’s method with different starting guesses to find the real root near x = 1.17.',
      successHint: 'When exact formulas run out, algorithms take over. Newton’s method is an algorithm that converges to a root by iterating: guess, improve, repeat. This is al-Khwarizmi’s legacy applied to problems he could not have imagined.',
    },
    {
      title: 'Matrices — systems of equations at scale',
      concept: `In Level 1 you solved systems of 2 equations with 2 unknowns. Real problems have hundreds or thousands of variables: circuit analysis, structural engineering, machine learning. The tool for this is **matrices**.

A matrix is a rectangular grid of numbers. A system of equations becomes:
- **A** × **x** = **b**, where A is the coefficient matrix, x is the variable vector, b is the constants.

For example: 2x + 3y = 8 and x − y = 1 becomes:
\`[[2,3],[1,-1]] @ [x,y] = [8,1]\`

NumPy solves this in one line: \`np.linalg.solve(A, b)\`.

Behind the scenes, it uses **Gaussian elimination** — an algorithm that methodically reduces the matrix to find the solution. This is al-Khwarizmi’s balance method (do the same operation to both sides) applied to many equations simultaneously.`,
      analogy: 'A matrix is a spreadsheet. Each row is an equation, each column is a variable. Gaussian elimination is like using the spreadsheet to cancel out variables row by row until you can read the answers directly.',
      storyConnection: 'Chinese mathematicians developed matrix methods in the Nine Chapters on the Mathematical Art (c. 200 BCE). Islamic mathematicians, including those at the House of Wisdom, built on this. The connection between al-Khwarizmi’s algebraic methods and matrix algebra is a direct line in mathematical history.',
      checkQuestion: 'A system of 3 equations in 3 unknowns has its equations represented as three planes in 3D space. What does the solution represent geometrically?',
      checkAnswer: 'The solution is the point where all three planes intersect. If the three planes meet at a single point, there is one unique solution. If they intersect in a line, there are infinitely many solutions. If they do not all share a common intersection point, there is no solution.',
      codeIntro: 'Solve systems of equations with matrices using NumPy.',
      code: `import numpy as np

# System: 2x + 3y = 8, x - y = 1
A = np.array([[2, 3],
              [1, -1]])
b = np.array([8, 1])

solution = np.linalg.solve(A, b)
print("=== 2x2 System ===")
print(f"2x + 3y = 8")
print(f"x - y = 1")
print(f"Solution: x = {solution[0]:.2f}, y = {solution[1]:.2f}")
print(f"Check: 2({solution[0]:.2f}) + 3({solution[1]:.2f}) = {2*solution[0]+3*solution[1]:.2f}")
print()

# Larger system: 3 equations, 3 unknowns
A3 = np.array([[1, 2, -1],
               [2, -1, 3],
               [3, 1, 2]])
b3 = np.array([4, 9, 11])

sol3 = np.linalg.solve(A3, b3)
print("=== 3x3 System ===")
print(f"x + 2y - z = 4")
print(f"2x - y + 3z = 9")
print(f"3x + y + 2z = 11")
print(f"Solution: x={sol3[0]:.2f}, y={sol3[1]:.2f}, z={sol3[2]:.2f}")
print(f"Check eq1: {sol3[0]+2*sol3[1]-sol3[2]:.2f} = 4")
print()

# How fast is NumPy for large systems?
import time
for n in [10, 100, 500, 1000]:
    A_big = np.random.rand(n, n)
    b_big = np.random.rand(n)
    t = time.time()
    np.linalg.solve(A_big, b_big)
    elapsed = time.time() - t
    print(f"  {n:5d} equations: {elapsed:.4f} seconds")

print()
print("NumPy solves 1000 equations in a fraction of a second.")
print("This is al-Khwarizmi's balance method running on modern hardware.")`,
      challenge: 'Create a 4x4 system that represents a real-world problem (e.g., traffic flow through 4 intersections, or mixing 4 chemicals to get desired concentrations). Solve it with NumPy.',
      successHint: 'Matrices are the bridge between algebra and computation. Every modern application — from search engines to self-driving cars — uses matrix equations solved by algorithms descended from al-Khwarizmi’s methods.',
    },
    {
      title: 'Algorithm complexity — Big-O notation',
      concept: `Not all algorithms are equal. Some take longer as the input grows. **Big-O notation** describes how an algorithm’s running time scales with input size n.

- **O(1)** — constant: looking up an array element by index
- **O(log n)** — logarithmic: binary search
- **O(n)** — linear: scanning every element once
- **O(n log n)** — merge sort, the best possible comparison sort
- **O(n²)** — quadratic: bubble sort, naive matrix multiplication
- **O(2ⁿ)** — exponential: brute-force trying every combination

The difference matters enormously. For n = 1,000,000:
- O(n) = 1,000,000 operations
- O(n²) = 1,000,000,000,000 operations (a million times slower)
- O(2ⁿ) = more operations than atoms in the universe

Al-Khwarizmi’s genius was finding efficient algorithms — methods that do not waste steps. Big-O formalises that intuition.`,
      analogy: 'Big-O is like fuel efficiency for cars. A car that gets O(n) miles per gallon uses fuel proportional to distance. An O(n²) car uses fuel proportional to the SQUARE of the distance — fine for short trips, ruinous for long ones. Choosing the right algorithm is like choosing the right car for the journey.',
      storyConnection: 'Al-Khwarizmi chose efficient methods. His completing-the-square for quadratics is O(1) — a fixed number of steps regardless of how large the coefficients are. Newton’s method converges in O(log n) iterations. The House of Wisdom valued practical, efficient methods because merchants needed answers quickly.',
      checkQuestion: 'An algorithm takes 0.001 seconds for n = 100. If it is O(n²), how long for n = 10,000?',
      checkAnswer: '10,000/100 = 100 times larger input. O(n²) means 100² = 10,000 times slower. So 0.001 × 10,000 = 10 seconds. If it were O(n³), it would be 100³ = 1,000,000 times slower = 1,000 seconds ≈ 17 minutes.',
      codeIntro: 'Measure and compare algorithm complexities empirically.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import time

def time_function(f, n_values, repeats=3):
    """Time a function for different input sizes."""
    times = []
    for n in n_values:
        total = 0
        for _ in range(repeats):
            data = list(range(n))
            t = time.time()
            f(data)
            total += time.time() - t
        times.append(total / repeats)
    return times

# O(n) — linear scan
def linear_scan(data):
    total = 0
    for x in data:
        total += x
    return total

# O(n^2) — nested loop
def quadratic_scan(data):
    count = 0
    for i in data:
        for j in data:
            count += 1
    return count

# O(n log n) — sort
def sort_data(data):
    return sorted(data)

# Measure
n_vals = [100, 500, 1000, 2000, 3000, 5000]
t_linear = time_function(linear_scan, n_vals)
t_nlogn = time_function(sort_data, n_vals)
t_quad = time_function(quadratic_scan, n_vals[:4])  # limit quadratic

plt.figure(figsize=(8, 5))
plt.plot(n_vals, t_linear, 'o-', linewidth=2, color='#10b981', label='O(n) - linear scan')
plt.plot(n_vals, t_nlogn, 's-', linewidth=2, color='#3b82f6', label='O(n log n) - sort')
plt.plot(n_vals[:4], t_quad, '^-', linewidth=2, color='#ef4444', label='O(n²) - nested loop')
plt.xlabel('Input size (n)', fontsize=12)
plt.ylabel('Time (seconds)', fontsize=12)
plt.title('Algorithm Complexity: How Running Time Scales', fontsize=13)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print("Key insight: as n grows, the GAP between complexities widens.")
print("For large n, choosing O(n log n) over O(n²) saves hours or days.")`,
      challenge: 'Add an O(log n) algorithm (binary search on sorted data) to the comparison. Plot all four on the same chart. For n = 5000, calculate the ratio of O(n²) to O(log n).',
      successHint: 'Big-O analysis is how computer scientists choose algorithms. It is not about making code fast on one computer — it is about understanding how algorithms fundamentally scale. Al-Khwarizmi’s methods were efficient because he minimised unnecessary steps. Big-O quantifies that intuition.',
    },
    {
      title: 'Graph algorithms — finding the shortest path',
      concept: `A **graph** is a set of nodes connected by edges. Cities on a map, pages on the web, friends on social media — all are graphs.

One of the most important graph algorithms is **Dijkstra’s shortest path**: given a weighted graph (edges have costs), find the cheapest route from a source to every other node.

The algorithm:
1. Set distance to source = 0, all others = ∞
2. Pick the unvisited node with smallest distance
3. For each neighbour, update distance if going through current node is shorter
4. Mark current as visited
5. Repeat until all nodes visited

This is an algorithm in al-Khwarizmi’s sense: a precise, step-by-step procedure that always gives the correct answer. Modern GPS navigation runs Dijkstra’s algorithm (or its variant A*) every time you ask for directions.`,
      analogy: 'Imagine you are in a city and want to find the fastest route to the airport. You check all roads from where you stand, pick the fastest, go there, check all roads from THERE, and keep going. At each step you pick the best option available. This greedy, systematic approach is Dijkstra’s algorithm.',
      storyConnection: 'Baghdad was at the centre of trade routes connecting the entire known world. Finding the shortest route between cities was a real, practical problem. Al-Khwarizmi’s emphasis on systematic, algorithmic thinking laid the groundwork for the graph algorithms that would eventually solve exactly this kind of problem.',
      checkQuestion: 'Can Dijkstra’s algorithm handle negative edge weights?',
      checkAnswer: 'No. Dijkstra’s assumes all edge weights are non-negative. With negative weights, a visited node could later be reached via a shorter path through a negative edge, violating the algorithm’s assumption. For negative weights, use the Bellman-Ford algorithm (slower but handles negatives).',
      codeIntro: 'Implement Dijkstra’s shortest path algorithm on a small graph.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Graph as adjacency dict: node -> [(neighbor, cost)]
graph = {
    'Baghdad':  [('Damascus', 7), ('Isfahan', 5), ('Basra', 3)],
    'Damascus': [('Baghdad', 7), ('Cairo', 6), ('Istanbul', 8)],
    'Isfahan':  [('Baghdad', 5), ('Samarkand', 9)],
    'Basra':    [('Baghdad', 3), ('Isfahan', 4)],
    'Cairo':    [('Damascus', 6), ('Istanbul', 10)],
    'Istanbul': [('Damascus', 8), ('Cairo', 10)],
    'Samarkand':[('Isfahan', 9)],
}

def dijkstra(graph, start):
    """Dijkstra's shortest path algorithm."""
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    prev = {node: None for node in graph}
    visited = set()

    while len(visited) < len(graph):
        # Pick unvisited node with smallest distance
        current = min((n for n in graph if n not in visited), key=lambda n: dist[n])
        visited.add(current)

        for neighbor, cost in graph[current]:
            new_dist = dist[current] + cost
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                prev[neighbor] = current

    return dist, prev

def get_path(prev, target):
    path = []
    current = target
    while current:
        path.append(current)
        current = prev[current]
    return list(reversed(path))

# Find shortest paths from Baghdad
distances, prev = dijkstra(graph, 'Baghdad')

print("=== Shortest Paths from Baghdad ===")
print()
for city in sorted(distances.keys()):
    path = get_path(prev, city)
    print(f"  {city}: distance = {distances[city]}, path = {' -> '.join(path)}")

print()
print("Dijkstra's algorithm: systematic, optimal, guaranteed correct.")
print("Your GPS uses this every time you ask for directions.")`,
      challenge: 'Add a new city "Cordoba" connected to Istanbul (cost 12) and Cairo (cost 8). Find the shortest path from Baghdad to Cordoba. Does it go through Damascus or through Basra?',
      successHint: 'Graph algorithms are among the most important in computer science. They power social networks, logistics, internet routing, and navigation. Every one is a descendant of al-Khwarizmi’s core idea: solve complex problems with precise, repeatable steps.',
    },
    {
      title: 'Cryptography — algebra protects your data',
      concept: `Modern encryption is built on algebra. The RSA algorithm, which secures most internet communication, relies on a simple algebraic fact: multiplying two large prime numbers is easy, but factoring the result back into primes is extremely hard.

The mathematical foundation:
1. Choose two large primes p and q
2. Compute n = p × q (easy)
3. The public key is based on n (everyone can see it)
4. The private key requires knowing p and q separately
5. Breaking the encryption means factoring n (extremely hard for large n)

This connects directly to al-Khwarizmi’s work: modular arithmetic (clock arithmetic), exponentiation, and the study of prime numbers were all part of Islamic mathematical tradition.

The code below demonstrates the core concepts: prime checking, modular arithmetic, and a simplified RSA-like encryption.`,
      analogy: 'Encryption is like a lock on a box. The public key is the open lock (anyone can snap it shut). The private key is the only key that opens it. Making a lock is easy. Making a key from scratch that fits the lock? Nearly impossible — you would have to try billions of combinations.',
      storyConnection: 'The House of Wisdom was not just a library — it was the intelligence hub of the Abbasid Caliphate. Secure communication between Baghdad and provincial governors required codes and ciphers. Islamic mathematicians’ work on number theory laid the groundwork for the encryption that protects your passwords today.',
      checkQuestion: 'Why does RSA use PRIME numbers specifically? Why not just any large numbers?',
      checkAnswer: 'If n = p × q and both p and q are prime, then the ONLY way to factor n is to find p and q. If p or q were composite (non-prime), they would have additional factors, potentially making n easier to break down. Primes are the "atoms" of multiplication — they cannot be broken down further, making the factoring problem maximally difficult.',
      codeIntro: 'Explore primes, modular arithmetic, and simplified RSA encryption.',
      code: `import random

def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0: return False
    return True

# Find some primes
primes = [n for n in range(2, 100) if is_prime(n)]
print(f"Primes under 100: {primes}")
print(f"Count: {len(primes)}")
print()

# Modular arithmetic — the clock
print("=== Modular Arithmetic (Clock Math) ===")
print(f"  17 mod 5 = {17 % 5}   (17 divided by 5, remainder 2)")
print(f"  25 mod 7 = {25 % 7}   (25 divided by 7, remainder 4)")
print(f"  100 mod 12 = {100 % 12} (100 hours on a 12-hour clock)")
print()

# Simplified RSA demonstration
p, q = 61, 53
n = p * q
print(f"=== Simplified RSA ===")
print(f"Primes: p={p}, q={q}")
print(f"n = p * q = {n}")

phi = (p - 1) * (q - 1)
e = 17  # public exponent (must be coprime to phi)

# Find d such that (d * e) % phi == 1
d = pow(e, -1, phi)
print(f"Public key: (e={e}, n={n})")
print(f"Private key: (d={d}, n={n})")
print()

# Encrypt and decrypt a message
message = 42
encrypted = pow(message, e, n)
decrypted = pow(encrypted, d, n)

print(f"Original message: {message}")
print(f"Encrypted: {encrypted} (looks like random noise)")
print(f"Decrypted: {decrypted} (back to original!)")
print(f"Match: {message == decrypted}")
print()

# Why is this secure?
print("=== Why Is This Secure? ===")
print(f"n = {n}")
print(f"To break this, an attacker must factor {n} into {p} x {q}.")
print(f"For small numbers this is trivial. But real RSA uses")
print(f"primes with 300+ digits. Factoring their product would")
print(f"take all the world's computers billions of years.")`,
      challenge: 'Try factoring n = 3233 by brute force (check all primes up to sqrt(3233)). How many divisions does it take? Now imagine n has 600 digits instead of 4. That is real RSA.',
      successHint: 'The algebra you learned in this lesson — variables, equations, modular arithmetic, algorithms — is the foundation of internet security. Al-Khwarizmi’s work on systematic mathematical methods, transmitted through centuries of Islamic scholarship, ultimately protects every online transaction you make.',
    },
    {
      title: 'Dynamic programming — remembering subproblems',
      concept: `In Level 2 you wrote a recursive Fibonacci function. It was elegant but slow. Why? Because it recalculates the same values over and over. fib(5) calls fib(4) and fib(3). But fib(4) also calls fib(3). The same subproblem is solved multiple times.

**Dynamic programming** (DP) fixes this: solve each subproblem once and **store** the result. The next time you need it, look it up instead of recalculating. This is called **memoisation**.

DP turns the exponential O(2ⁿ) Fibonacci into linear O(n). The same technique solves:
- Shortest paths in graphs (Dijkstra is a form of DP)
- Optimal text alignment (how spell-checkers suggest corrections)
- Resource allocation (knapsack problem)

The key insight: if a problem can be broken into overlapping subproblems that are solved independently, DP applies.`,
      analogy: 'Imagine being asked "What is 37 × 18?" many times. The first time, you calculate it (666). After that, you just remember the answer. Dynamic programming is this "calculate once, remember forever" approach applied to every step of an algorithm.',
      storyConnection: 'Al-Khwarizmi’s methods were practical because they did not waste effort. He would never recalculate something already known. Dynamic programming formalises this: store partial results, build on them. It is the principle of scholarly accumulation — the House of Wisdom’s entire operating model.',
      checkQuestion: 'The naive recursive Fibonacci makes approximately 2ⁿ function calls for fib(n). The DP version makes n calls. For n = 50, how many times faster is DP?',
      checkAnswer: '2⁵⁰ ≈ 1.13 quadrillion calls vs 50. The DP version is roughly 22 trillion times faster. This is the difference between "finishes instantly" and "the heat death of the universe arrives first."',
      codeIntro: 'Compare naive recursion with dynamic programming on Fibonacci.',
      code: `import time
import matplotlib.pyplot as plt

# Naive recursive Fibonacci — SLOW
def fib_naive(n):
    if n <= 1: return n
    return fib_naive(n-1) + fib_naive(n-2)

# DP Fibonacci with memoisation — FAST
def fib_dp(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib_dp(n-1, memo) + fib_dp(n-2, memo)
    return memo[n]

# Bottom-up DP (no recursion at all)
def fib_bottom_up(n):
    if n <= 1: return n
    prev2, prev1 = 0, 1
    for _ in range(2, n+1):
        curr = prev1 + prev2
        prev2, prev1 = prev1, curr
    return prev1

# Compare results
print("=== Fibonacci Values ===")
for i in [5, 10, 20, 30]:
    print(f"  fib({i}) = {fib_dp(i)}")
print()

# Speed comparison
print("=== Speed Comparison ===")
naive_times = []
dp_times = []
ns = list(range(5, 32, 2))

for n in ns:
    t = time.time()
    fib_naive(n)
    naive_times.append(time.time() - t)

    t = time.time()
    fib_dp.__defaults__[0].clear()
    fib_dp(n)
    dp_times.append(time.time() - t)

    print(f"  n={n:2d}: naive={naive_times[-1]:.6f}s, dp={dp_times[-1]:.8f}s")

# DP can handle huge n
t = time.time()
big = fib_bottom_up(1000)
print(f"\\nfib(1000) has {len(str(big))} digits! Computed in {time.time()-t:.6f}s")
print()

plt.figure(figsize=(8, 5))
plt.plot(ns, naive_times, 'o-', color='#ef4444', linewidth=2, label='Naive recursion')
plt.plot(ns, dp_times, 's-', color='#10b981', linewidth=2, label='Dynamic programming')
plt.xlabel('n', fontsize=12)
plt.ylabel('Time (seconds)', fontsize=12)
plt.title('Fibonacci: Recursion vs Dynamic Programming', fontsize=13)
plt.legend(fontsize=10)
plt.yscale('log')
plt.grid(alpha=0.3)
plt.show()

print("DP is not just faster — it makes the IMPOSSIBLE possible.")
print("Naive recursion cannot compute fib(50) in your lifetime.")
print("DP computes fib(1000) in microseconds.")`,
      challenge: 'Implement a DP solution for the coin change problem: given coins of denominations [1, 5, 10, 25], find the minimum number of coins needed to make 67 cents. How many coins do you need?',
      successHint: 'Dynamic programming is one of the most powerful algorithmic techniques in computer science. It transforms exponential problems into polynomial ones by storing and reusing partial results. Al-Khwarizmi’s emphasis on not repeating work is the philosophical ancestor of DP.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced algebra and algorithm design</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced algebra and algorithm design. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={[AlgebraQuadraticDiagram, MatrixMultiplicationDiagram, AlgebraAlgorithmDiagram, FlowchartDiagram, DecisionTreeDiagram, AlgebraLinearDiagram][i] ? createElement([AlgebraQuadraticDiagram, MatrixMultiplicationDiagram, AlgebraAlgorithmDiagram, FlowchartDiagram, DecisionTreeDiagram, AlgebraLinearDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
