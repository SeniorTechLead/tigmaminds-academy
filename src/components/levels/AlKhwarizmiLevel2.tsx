import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AlgebraBalanceScaleDiagram from '../diagrams/AlgebraBalanceScaleDiagram';
import AlgebraLinearDiagram from '../diagrams/AlgebraLinearDiagram';
import AlgebraQuadraticDiagram from '../diagrams/AlgebraQuadraticDiagram';
import AlgebraAlgorithmDiagram from '../diagrams/AlgebraAlgorithmDiagram';
import FlowchartDiagram from '../diagrams/FlowchartDiagram';
import SequencePatternDiagram from '../diagrams/SequencePatternDiagram';

export default function AlKhwarizmiLevel2() {
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
      title: 'Expressions, equations, and inequalities',
      concept: `In Level 1 you solved equations. Now let’s be precise about vocabulary.

An **expression** is a mathematical phrase: \`3x + 5\`. It has no equals sign — it is just a value that depends on x.

An **equation** sets two expressions equal: \`3x + 5 = 20\`. It has exactly one (or a few) solutions.

An **inequality** uses < or >: \`3x + 5 < 20\`. It has infinitely many solutions — every x less than 5 works.

Al-Khwarizmi classified equations into six types based on which terms appeared (things, squares, numbers). We classify expressions by their **degree** — the highest power of x. Degree 1 = linear. Degree 2 = quadratic. Degree 3 = cubic.

The code below evaluates expressions, solves equations, and plots the solution set of an inequality.`,
      analogy: 'An expression is like a sentence fragment ("the tall building"). An equation is a complete sentence ("the tall building is 50 metres high"). An inequality is an open-ended claim ("the tall building is more than 30 metres high") — many buildings could satisfy it.',
      storyConnection: 'Al-Khwarizmi’s six types of equations were the first systematic classification of algebraic problems. He listed every possible combination of "things" (x), "squares" (x²), and "numbers" (constants), and gave a solution algorithm for each. Modern algebra generalises this to polynomials of any degree.',
      checkQuestion: 'Is "5x² − 3x + 1" an expression or an equation? What is its degree?',
      checkAnswer: 'It is an expression (no equals sign). Its degree is 2 (the highest power of x is x²), making it a quadratic expression.',
      codeIntro: 'Evaluate expressions, solve equations, and plot inequalities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Expression: 3x + 5
def expr(x):
    return 3 * x + 5

# Evaluate for several x values
print("=== Expression: 3x + 5 ===")
for x_val in [-2, 0, 1, 3, 5]:
    print(f"  x = {x_val}: 3({x_val}) + 5 = {expr(x_val)}")
print()

# Equation: 3x + 5 = 20 -> x = 5
x_solution = (20 - 5) / 3
print(f"Equation: 3x + 5 = 20  ->  x = {x_solution}")
print()

# Inequality: 3x + 5 < 20 -> x < 5
print("Inequality: 3x + 5 < 20  ->  x < 5")
print("Solutions: ALL numbers less than 5")
print()

# Plot the inequality
x = np.linspace(-3, 8, 200)
y = 3 * x + 5

plt.figure(figsize=(8, 5))
plt.plot(x, y, linewidth=2, color='#3b82f6', label='3x + 5')
plt.axhline(20, color='#ef4444', linewidth=1.5, linestyle='--', label='y = 20')

# Shade the region where 3x + 5 < 20
mask = y < 20
plt.fill_between(x, y, 20, where=mask, alpha=0.15, color='#10b981')
plt.plot(5, 20, 'o', color='white', markersize=8, markeredgecolor='#10b981', markeredgewidth=2)
plt.annotate('x < 5 (open circle: not included)', xy=(5, 20), xytext=(5.5, 22),
             fontsize=9, color='#10b981',
             arrowprops=dict(arrowstyle='->', color='#10b981'))

plt.xlabel('x', fontsize=12)
plt.ylabel('3x + 5', fontsize=12)
plt.title('Inequality: Where is 3x + 5 Less Than 20?', fontsize=13)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()`,
      challenge: 'Plot the inequality 2x² − 8 > 0. The solution is not a single range — it splits into two parts. What are they?',
      successHint: 'Classifying mathematical objects (expression vs equation vs inequality, linear vs quadratic) is not pedantic — each type requires a different algorithm to solve. Al-Khwarizmi’s genius was recognising this and providing the right method for each type.',
    },
    {
      title: 'Functions — the input-output machine',
      concept: `A **function** takes an input, applies a rule, and produces an output. In Python: \`def f(x): return 2*x + 3\`. In math: f(x) = 2x + 3.

This is a profound idea. A function is an **abstraction** — it packages a computation into a reusable unit. Once you define f, you can call f(1), f(100), f(-7) without rewriting the formula each time.

Al-Khwarizmi thought in terms of procedures: "take the thing, double it, add three." That IS a function. The modern notation f(x) was invented later, but the concept goes back to Baghdad.

Functions can be:
- **Linear**: f(x) = mx + b (straight line)
- **Quadratic**: f(x) = ax² + bx + c (parabola)
- **Piecewise**: different rules for different inputs

The code below defines functions, plots them, and composes them (applying one function to the output of another).`,
      analogy: 'A function is a vending machine. You put in a number (input), the machine does something to it (the rule), and a result comes out (output). The machine always does the same thing for the same input. You can chain machines: put the output of one into the input of another.',
      storyConnection: 'Al-Khwarizmi’s algorithms were functions before anyone used that word. His "procedure for the square and the thing" took coefficients as input and produced the solution as output. The generality of functions — one definition, many uses — is what made his methods revolutionary.',
      checkQuestion: 'If f(x) = x² + 1, what is f(3)? What is f(f(2))?',
      checkAnswer: 'f(3) = 9 + 1 = 10. For f(f(2)): first f(2) = 4 + 1 = 5, then f(5) = 25 + 1 = 26. This is function composition — feeding one function’s output into another.',
      codeIntro: 'Define, plot, and compose mathematical functions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Define three functions
def linear(x):
    return 2 * x + 1

def quadratic(x):
    return x ** 2 - 4

def absolute(x):
    return np.abs(x - 2)

# Evaluate each
print("=== Function Evaluation ===")
for x_val in [-2, 0, 1, 3]:
    print(f"  linear({x_val}) = {linear(x_val)}")
    print(f"  quadratic({x_val}) = {quadratic(x_val)}")
    print(f"  absolute({x_val}) = {absolute(x_val)}")
    print()

# Composition: quadratic(linear(x))
def composed(x):
    return quadratic(linear(x))

print(f"composed(1) = quadratic(linear(1)) = quadratic({linear(1)}) = {composed(1)}")
print()

# Plot all three
x = np.linspace(-3, 5, 200)

fig, axes = plt.subplots(1, 3, figsize=(12, 4))

for ax, fn, name, color in zip(axes,
    [linear, quadratic, absolute],
    ['f(x) = 2x + 1', 'g(x) = x² - 4', 'h(x) = |x - 2|'],
    ['#3b82f6', '#6366f1', '#f59e0b']):
    ax.plot(x, fn(x), linewidth=2.5, color=color)
    ax.axhline(0, color='gray', linewidth=0.5)
    ax.axvline(0, color='gray', linewidth=0.5)
    ax.set_title(name, fontsize=11)
    ax.set_xlabel('x', fontsize=10)
    ax.grid(alpha=0.3)

plt.suptitle('Three Function Types', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.show()

print("Linear -> straight line, one slope, one intercept")
print("Quadratic -> parabola, symmetric, has a minimum/maximum")
print("Absolute value -> V-shape, sharp corner at the vertex")`,
      challenge: 'Define a piecewise function: f(x) = x² for x < 0, f(x) = 2x for x >= 0. Plot it. Where does the rule change?',
      successHint: 'Functions are the building blocks of all mathematics and programming. Every Python function you write is a descendant of al-Khwarizmi’s procedures. Once you can think in functions, you can model anything.',
    },
    {
      title: 'The quadratic formula — deriving it yourself',
      concept: `In Level 1 you completed the square for specific equations. Now let’s do it for the **general** quadratic: ax² + bx + c = 0.

Follow the steps:
1. Divide by a: x² + (b/a)x + c/a = 0
2. Move c/a: x² + (b/a)x = −c/a
3. Half of b/a = b/(2a). Square it: b²/(4a²)
4. Add to both sides: (x + b/(2a))² = b²/(4a²) − c/a
5. Simplify the right side: (b² − 4ac)/(4a²)
6. Square root: x + b/(2a) = ±√(b² − 4ac)/(2a)
7. Subtract: **x = (−b ± √(b² − 4ac)) / (2a)**

That’s the quadratic formula. You just derived it. It is not magic — it is completing the square applied to the general case.

The expression under the square root, b² − 4ac, is the **discriminant**. If it is positive, there are two solutions. If zero, one. If negative, none (in real numbers).`,
      analogy: 'Deriving the quadratic formula is like writing a recipe that works for every cake, not just chocolate cake. You keep the ingredients as variables (a, b, c) instead of specific numbers, and the procedure still works. The result is a universal formula.',
      storyConnection: 'Al-Khwarizmi completed the square for each of his six equation types separately. It took centuries for mathematicians to combine them into the single quadratic formula. But the method is his — completing the square IS the derivation.',
      checkQuestion: 'For 2x² − 7x + 3 = 0, what is the discriminant? How many solutions are there?',
      checkAnswer: 'Discriminant = b² − 4ac = (−7)² − 4(2)(3) = 49 − 24 = 25. Since 25 > 0, there are two real solutions. They are x = (7 ± 5)/4, giving x = 3 and x = 0.5.',
      codeIntro: 'Implement the quadratic formula and explore the discriminant.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def quadratic_solve(a, b, c):
    """Solve ax^2 + bx + c = 0 using the quadratic formula."""
    discriminant = b**2 - 4*a*c
    print(f"Equation: {a}x² + {b}x + {c} = 0")
    print(f"Discriminant: {b}² - 4({a})({c}) = {discriminant}")

    if discriminant > 0:
        x1 = (-b + np.sqrt(discriminant)) / (2*a)
        x2 = (-b - np.sqrt(discriminant)) / (2*a)
        print(f"Two solutions: x = {x1:.4f} and x = {x2:.4f}")
        return [x1, x2]
    elif discriminant == 0:
        x = -b / (2*a)
        print(f"One solution: x = {x:.4f}")
        return [x]
    else:
        print("No real solutions (discriminant < 0)")
        return []

# Solve three equations with different discriminants
print("=== Quadratic Formula ===")
print()
sols1 = quadratic_solve(1, -5, 6)    # x^2 - 5x + 6 = 0
print()
sols2 = quadratic_solve(1, -6, 9)    # x^2 - 6x + 9 = 0
print()
sols3 = quadratic_solve(1, 2, 5)     # x^2 + 2x + 5 = 0
print()

# Plot all three parabolas
x = np.linspace(-4, 8, 300)
fig, axes = plt.subplots(1, 3, figsize=(12, 4))
equations = [(1,-5,6,'D > 0: two roots'), (1,-6,9,'D = 0: one root'), (1,2,5,'D < 0: no real roots')]
colors = ['#10b981', '#f59e0b', '#ef4444']

for ax, (a,b,c,title), color in zip(axes, equations, colors):
    y = a*x**2 + b*x + c
    ax.plot(x, y, linewidth=2.5, color=color)
    ax.axhline(0, color='gray', linewidth=0.5)
    ax.set_title(title, fontsize=10, fontweight='bold')
    ax.set_xlabel('x', fontsize=10)
    ax.grid(alpha=0.3)
    # Mark roots if they exist
    d = b**2 - 4*a*c
    if d >= 0:
        roots = [(-b + np.sqrt(d))/(2*a), (-b - np.sqrt(d))/(2*a)] if d > 0 else [(-b)/(2*a)]
        for r in roots:
            ax.plot(r, 0, 'o', color=color, markersize=8, zorder=5)

plt.suptitle('The Discriminant Decides Everything', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.show()`,
      challenge: 'Find values of a, b, c that give a discriminant of exactly 0 (one solution) but where the solution is x = 7. Hint: if x = 7 is a double root, then (x − 7)² = 0.',
      successHint: 'The quadratic formula is one of the most powerful tools in all of mathematics. And now you know it is not a magic trick — it is al-Khwarizmi’s completing-the-square method, applied once and for all.',
    },
    {
      title: 'Sorting algorithms — al-Khwarizmi’s legacy in computer science',
      concept: `Al-Khwarizmi’s name gave us the word "algorithm." In computer science, algorithms solve computational problems: searching, sorting, pathfinding, encryption.

The simplest sorting algorithm is **bubble sort**: repeatedly compare adjacent items and swap them if they are out of order. Keep going until the list is sorted. It is easy to understand but slow for large lists.

A faster algorithm is **merge sort**: split the list in half, sort each half (recursively), then merge the two sorted halves. It is harder to understand but much faster.

Both are algorithms in al-Khwarizmi’s sense: step-by-step procedures that always produce the correct result for any valid input.

The code below implements both and measures how they compare.`,
      analogy: 'Bubble sort is like sorting a hand of cards by repeatedly swapping adjacent cards that are out of order. Merge sort is like splitting your hand in half, sorting each pile separately, then interleaving them back together. The second approach is faster because each "merge" step is simple.',
      storyConnection: 'Al-Khwarizmi would have recognised both algorithms immediately. His approach was always: break the problem into simpler steps, handle each step with a clear procedure, combine the results. Merge sort follows this divide-and-conquer pattern perfectly.',
      checkQuestion: 'If bubble sort takes 100 seconds to sort 1,000 items, roughly how long would it take to sort 10,000 items?',
      checkAnswer: 'About 10,000 seconds (100 times longer). Bubble sort is O(n²), meaning 10x more items takes 10² = 100x longer. Merge sort, which is O(n log n), would take only about 1,330 seconds — 13x longer instead of 100x. This is why algorithm choice matters enormously.',
      codeIntro: 'Implement bubble sort and merge sort, then compare their speed.',
      code: `import time

def bubble_sort(arr):
    """Bubble sort: swap adjacent out-of-order pairs."""
    a = arr.copy()
    n = len(a)
    for i in range(n):
        for j in range(n - 1 - i):
            if a[j] > a[j+1]:
                a[j], a[j+1] = a[j+1], a[j]
    return a

def merge_sort(arr):
    """Merge sort: divide, sort halves, merge."""
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    # Merge two sorted lists
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Test with a small list
import random
small = [64, 34, 25, 12, 22, 11, 90]
print(f"Original: {small}")
print(f"Bubble:   {bubble_sort(small)}")
print(f"Merge:    {merge_sort(small)}")
print()

# Speed comparison
print("=== Speed Comparison ===")
for size in [100, 500, 1000, 2000]:
    data = [random.randint(1, 10000) for _ in range(size)]

    t1 = time.time()
    bubble_sort(data)
    bubble_time = time.time() - t1

    t2 = time.time()
    merge_sort(data)
    merge_time = time.time() - t2

    ratio = bubble_time / max(merge_time, 0.0001)
    print(f"  n={size:5d}: Bubble={bubble_time:.4f}s, Merge={merge_time:.4f}s, Bubble is {ratio:.0f}x slower")

print()
print("As n grows, the gap widens dramatically.")
print("Algorithm choice matters more than hardware speed.")`,
      challenge: 'Add a counter to each sort that counts the total number of comparisons. For n = 1000, how many comparisons does bubble sort make vs merge sort?',
      successHint: 'Every time you use Python’s built-in sort(), it runs an algorithm called Timsort (a merge sort variant). Al-Khwarizmi’s idea — solve problems with precise, repeatable steps — is the foundation of all of computer science.',
    },
    {
      title: 'Binary search — the algorithm you use every day',
      concept: `Imagine looking up a word in a dictionary. You do not start at page 1 and read every page. You open to the middle, see if your word is before or after that page, and jump to the middle of the remaining half. Each step eliminates half the pages.

This is **binary search**: to find an item in a sorted list, check the middle element. If your target is smaller, search the left half. If larger, search the right half. Repeat until found.

Binary search is incredibly efficient. A sorted list of 1,000,000 items requires at most 20 comparisons (log₂(1,000,000) ≈ 20). Linear search (checking one by one) would need up to 1,000,000.

This is algorithmic thinking at its finest: by exploiting the structure of the data (it is sorted), we turn a million-step problem into a twenty-step problem.`,
      analogy: 'Guessing a number between 1 and 100 with "higher/lower" hints. The optimal strategy is always guess the middle: 50, then 25 or 75, and so on. You will find any number in at most 7 guesses (log₂(100) ≈ 7).',
      storyConnection: 'The House of Wisdom was one of the greatest libraries in history. Finding a specific manuscript among thousands required systematic methods. Binary search on a sorted catalogue would have been a practical necessity — al-Khwarizmi’s algorithmic thinking applied to library science.',
      checkQuestion: 'If you have a sorted list of 1,000,000,000 (one billion) items, what is the maximum number of comparisons binary search needs?',
      checkAnswer: 'log₂(1,000,000,000) ≈ 30. Just 30 comparisons to search a billion items. This is the power of logarithmic algorithms — they grow incredibly slowly.',
      codeIntro: 'Implement binary search and compare it to linear search.',
      code: `import time
import random

def linear_search(arr, target):
    """Check every element one by one."""
    comparisons = 0
    for i, val in enumerate(arr):
        comparisons += 1
        if val == target:
            return i, comparisons
    return -1, comparisons

def binary_search(arr, target):
    """Cut the search space in half each step."""
    comparisons = 0
    low, high = 0, len(arr) - 1
    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid, comparisons
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1, comparisons

# Create a sorted list of 100,000 numbers
data = sorted(random.sample(range(1, 1_000_000), 100_000))
target = data[73_456]  # pick a number we know exists

print("=== Linear Search vs Binary Search ===")
print(f"List size: {len(data):,}")
print(f"Target: {target:,}")
print()

_, lin_comp = linear_search(data, target)
_, bin_comp = binary_search(data, target)

print(f"Linear search: {lin_comp:,} comparisons")
print(f"Binary search: {bin_comp} comparisons")
print(f"Binary search was {lin_comp // max(bin_comp, 1):,}x more efficient!")
print()

# Demonstrate the halving process
print("=== Watch Binary Search Work ===")
small = list(range(1, 33))  # 1 to 32
target_small = 23
low, high = 0, len(small) - 1
step = 0
while low <= high:
    mid = (low + high) // 2
    step += 1
    print(f"  Step {step}: search [{small[low]}..{small[high]}], check middle = {small[mid]}", end="")
    if small[mid] == target_small:
        print(f"  FOUND!")
        break
    elif small[mid] < target_small:
        print(f"  too small, go right")
        low = mid + 1
    else:
        print(f"  too big, go left")
        high = mid - 1

print(f"\\nFound {target_small} in {step} steps (log2(32) = 5)")`,
      challenge: 'Modify binary_search to return the index of the closest value if the exact target is not found. Test it with target = 42 in a list that does not contain 42.',
      successHint: 'Binary search is the algorithm behind every database index, search engine, and autocomplete feature. It works because a sorted list has structure — and the algorithm exploits that structure. This connection between data structure and algorithm efficiency is one of the deepest ideas in computer science.',
    },
    {
      title: 'Recursion — an algorithm that calls itself',
      concept: `Some algorithms solve a big problem by solving smaller versions of the same problem. This is **recursion**.

Consider the factorial: 5! = 5 × 4 × 3 × 2 × 1. But notice: 5! = 5 × 4! And 4! = 4 × 3! All the way down to 1! = 1.

In code: \`def factorial(n): return 1 if n <= 1 else n * factorial(n-1)\`

The function calls **itself** with a smaller input. Each call gets closer to the **base case** (n = 1), where it stops.

Merge sort from the previous lesson was recursive: it split the list in half and called merge_sort on each half. Al-Khwarizmi’s completing the square can also be seen recursively: reduce the problem step by step until it is trivial to solve.

Recursion is powerful but requires two things:
1. A **base case** (when to stop)
2. A **recursive step** (how to reduce the problem)`,
      analogy: 'Russian nesting dolls (matryoshka). To open the biggest doll, you find a slightly smaller doll inside, then a smaller one inside that, until you reach the tiny solid doll at the centre (the base case). Each doll "contains" the solution to a smaller version of the same problem.',
      storyConnection: 'Al-Khwarizmi’s method for solving equations was implicitly recursive: "if the equation has these terms, move them and simplify, then solve the resulting simpler equation." Each step reduced the complexity until the answer was trivial. The recursive structure of problem-solving is his lasting legacy.',
      checkQuestion: 'What happens if a recursive function has no base case?',
      checkAnswer: 'It calls itself forever (infinite recursion). In practice, the computer runs out of memory and crashes with a "stack overflow" error. The base case is essential — it is what stops the recursion. Every recursive algorithm must eventually reach its base case for every valid input.',
      codeIntro: 'Implement recursive functions for factorial, Fibonacci, and a recursive power function.',
      code: `# Recursion: functions that call themselves

def factorial(n):
    """n! = n * (n-1) * ... * 1"""
    if n <= 1:
        return 1          # Base case
    return n * factorial(n - 1)  # Recursive step

print("=== Factorial ===")
for n in range(1, 8):
    print(f"  {n}! = {factorial(n)}")
print()

def fibonacci(n):
    """F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)"""
    if n <= 0: return 0
    if n == 1: return 1
    return fibonacci(n - 1) + fibonacci(n - 2)

print("=== Fibonacci Sequence ===")
fibs = [fibonacci(i) for i in range(12)]
print(f"  {fibs}")
print()

def power(base, exp):
    """base^exp using recursion"""
    if exp == 0: return 1     # Anything^0 = 1
    if exp == 1: return base   # Anything^1 = itself
    return base * power(base, exp - 1)

print("=== Recursive Power ===")
print(f"  2^10 = {power(2, 10)}")
print(f"  3^5  = {power(3, 5)}")
print()

# Trace the calls
def factorial_traced(n, depth=0):
    indent = "  " * depth
    print(f"{indent}factorial({n})")
    if n <= 1:
        print(f"{indent}-> returns 1")
        return 1
    result = n * factorial_traced(n - 1, depth + 1)
    print(f"{indent}-> returns {n} * ... = {result}")
    return result

print("=== Tracing factorial(5) ===")
factorial_traced(5)`,
      challenge: 'Write a recursive function sum_digits(n) that returns the sum of a number’s digits. Example: sum_digits(1234) = 10. Hint: the last digit is n % 10, and the remaining digits are n // 10.',
      successHint: 'Recursion is how computers solve complex problems: break them into smaller identical problems until they become trivial. Al-Khwarizmi’s step-by-step reduction of equations is the same pattern. Recursive thinking is one of the most powerful skills in computer science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for algebra and algorithm exploration. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[AlgebraBalanceScaleDiagram, AlgebraAlgorithmDiagram, AlgebraQuadraticDiagram, FlowchartDiagram, SequencePatternDiagram, AlgebraLinearDiagram][i] ? createElement([AlgebraBalanceScaleDiagram, AlgebraAlgorithmDiagram, AlgebraQuadraticDiagram, FlowchartDiagram, SequencePatternDiagram, AlgebraLinearDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
