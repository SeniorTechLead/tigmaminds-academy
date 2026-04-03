import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AlgebraBalanceScaleDiagram from '../diagrams/AlgebraBalanceScaleDiagram';
import AlgebraLinearDiagram from '../diagrams/AlgebraLinearDiagram';
import AlgebraQuadraticDiagram from '../diagrams/AlgebraQuadraticDiagram';
import AlgebraAlgorithmDiagram from '../diagrams/AlgebraAlgorithmDiagram';
import BalanceScaleDiagram from '../diagrams/BalanceScaleDiagram';
import SlopeInterceptDiagram from '../diagrams/SlopeInterceptDiagram';

export default function AlKhwarizmiLevel1() {
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
      title: 'Variables — naming the unknown',
      concept: `In the House of Wisdom, al-Khwarizmi faced problems like: "A merchant has some coins. He earns 5 more and now has 12. How many did he start with?"

You could guess. But al-Khwarizmi’s breakthrough was to give the unknown quantity a **name** — he called it *shay* (Arabic for "thing"). We write it as **x**.

Once you name the unknown, the problem becomes an equation: **x + 5 = 12**. The letter x is a **variable** — a placeholder for a number you do not yet know.

In Python, variables work the same way. You write \`coins = 7\` to store a number, or \`x = 12 - 5\` to calculate one. The code below introduces Python variables and shows how they correspond to al-Khwarizmi’s *shay*.`,
      analogy: 'A variable is like a labelled box. You write "x" on the outside. Inside is a number you have not opened yet. The equation tells you the rules: "the box plus 5 equals 12." Your job is to figure out what is inside the box.',
      storyConnection: 'When al-Khwarizmi wrote his book, he did not use x — he wrote problems in words. "A thing, added to five, equals twelve." The move from words to symbols took centuries, but the idea is the same: name the unknown, then find it.',
      checkQuestion: 'If y + 8 = 20, what is y? How did you find it?',
      checkAnswer: 'y = 12. You subtract 8 from both sides: y = 20 − 8 = 12. This is the same operation al-Khwarizmi described: do the same thing to both sides of the equation to keep it balanced.',
      codeIntro: 'Use Python variables to solve a simple equation.',
      code: `# Al-Khwarizmi's "thing" — we call it x
# Problem: x + 5 = 12

# In Python, we can solve it directly:
x = 12 - 5
print(f"x + 5 = 12")
print(f"x = 12 - 5")
print(f"x = {x}")
print()

# Let's verify: plug x back in
print(f"Check: {x} + 5 = {x + 5}")
print(f"Does it equal 12? {x + 5 == 12}")
print()

# Variables can store anything
merchant_coins = x
extra_earned = 5
total = merchant_coins + extra_earned
print(f"The merchant started with {merchant_coins} coins.")
print(f"He earned {extra_earned} more.")
print(f"Now he has {total} coins.")`,
      challenge: 'A farmer has some sheep. She buys 13 more and now has 41. Write a Python equation to find how many she started with. Name your variable \`sheep\`.',
      successHint: 'You just used a variable to represent an unknown and solved for it — exactly what al-Khwarizmi did 1,200 years ago. Variables are the foundation of both algebra and programming.',
    },
    {
      title: 'The balance scale — what an equation really means',
      concept: `Al-Khwarizmi’s key insight was that an equation is a **balance**. Whatever is on the left side must weigh the same as the right side. If you add something to one side, you must add the same to the other. If you subtract from one side, subtract from the other.

This is the most important idea in algebra: **whatever you do to one side, you must do to the other**.

The name of his book, *Al-Jabr*, literally means "restoration" — the act of moving a term from one side to the other to restore the balance. His other technique, *al-Muqabala* ("balancing"), means combining like terms.

In the code below, you will solve **2x + 3 = 11** step by step, keeping the balance at every stage.`,
      analogy: 'Imagine a see-saw with blocks on each end. If both ends are level, the weights are equal. To find what one mystery block weighs, you remove known blocks from both sides until the mystery block is alone.',
      storyConnection: 'Al-Khwarizmi was not just solving puzzles. Merchants in Baghdad needed algebra for trade: dividing inheritance, calculating profit shares, surveying land. The balance metaphor made sense because merchants used real balance scales every day.',
      checkQuestion: 'To solve 3x + 7 = 22, what is the first step? What do you do to both sides?',
      checkAnswer: 'Subtract 7 from both sides: 3x = 15. Then divide both sides by 3: x = 5. Check: 3(5) + 7 = 15 + 7 = 22. Correct.',
      codeIntro: 'Solve 2x + 3 = 11 step by step, printing the balance at each stage.',
      code: `# Solving 2x + 3 = 11 — step by step
print("=== The Balance Method ===")
print()

# Start
left = "2x + 3"
right = 11
print(f"Start:  {left} = {right}")
print()

# Step 1: Subtract 3 from both sides (al-Jabr: "restoration")
print("Step 1: Subtract 3 from both sides")
right_after = right - 3
print(f"  2x + 3 - 3 = {right} - 3")
print(f"  2x = {right_after}")
print()

# Step 2: Divide both sides by 2 (al-Muqabala: "balancing")
print("Step 2: Divide both sides by 2")
x = right_after // 2
print(f"  2x / 2 = {right_after} / 2")
print(f"  x = {x}")
print()

# Verify
print(f"Check: 2({x}) + 3 = {2*x + 3}")
print(f"That equals 11? {2*x + 3 == 11}")`,
      challenge: 'Modify the code to solve 5x + 8 = 33. Change the numbers in each step. What is x?',
      successHint: 'Every equation you will ever solve uses these two moves: move terms across the equals sign (al-Jabr), and combine like terms (al-Muqabala). Al-Khwarizmi gave us both techniques — and their names.',
    },
    {
      title: 'Plotting a line — y = mx + b',
      concept: `An equation with **two** variables — like y = 2x + 1 — does not have a single answer. It has infinitely many. When x = 0, y = 1. When x = 1, y = 3. When x = 2, y = 5. Each (x, y) pair is a point, and all these points form a **straight line**.

The equation y = mx + b is the **slope-intercept form**:
- **m** is the slope — how steep the line is (rise ÷ run)
- **b** is the y-intercept — where the line crosses the y-axis

Al-Khwarizmi worked with linear equations constantly: if a merchant sells x units at 2 dinars each and has 1 dinar already, his total is y = 2x + 1.

The code below uses NumPy and Matplotlib to plot a line and show how m and b change its shape.`,
      analogy: 'Think of climbing a hill. The slope (m) is how steep the hill is. The intercept (b) is your starting altitude before you begin climbing. A steeper slope (bigger m) means each step forward gains more height. A higher intercept means you started higher up.',
      storyConnection: 'In Baghdad’s markets, merchants needed to calculate totals quickly. "Each carpet costs 3 dinars, and there is a 2-dinar delivery fee." That is y = 3x + 2. Plotting it shows the total cost for any number of carpets — a straight line.',
      checkQuestion: 'For y = 3x + 2, what is the slope and what is the y-intercept? What is y when x = 4?',
      checkAnswer: 'Slope m = 3 (every 1 step right, the line goes up 3). Y-intercept b = 2 (the line crosses the y-axis at 2). When x = 4: y = 3(4) + 2 = 14.',
      codeIntro: 'Plot y = 2x + 1 and explore how slope and intercept work.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create x values from -2 to 5
x = np.linspace(-2, 5, 100)

# y = mx + b — the line
m = 2    # slope: rise over run
b = 1    # y-intercept: where the line crosses y-axis
y = m * x + b

# Plot the line
plt.figure(figsize=(8, 6))
plt.plot(x, y, linewidth=2.5, color='#3b82f6', label=f'y = {m}x + {b}')

# Mark the y-intercept
plt.plot(0, b, 'o', color='#10b981', markersize=10, zorder=5)
plt.annotate(f'y-intercept: (0, {b})', xy=(0, b), xytext=(1, b - 1.5),
             fontsize=10, color='#10b981',
             arrowprops=dict(arrowstyle='->', color='#10b981'))

# Show the slope triangle
plt.plot([1, 2], [m*1+b, m*1+b], '--', color='#f59e0b', linewidth=1.5)
plt.plot([2, 2], [m*1+b, m*2+b], '--', color='#f59e0b', linewidth=1.5)
plt.annotate('run = 1', xy=(1.5, m*1+b - 0.5), fontsize=9, color='#f59e0b')
plt.annotate(f'rise = {m}', xy=(2.2, (m*1+b + m*2+b)/2), fontsize=9, color='#f59e0b')

# Plot some points
for xi in range(0, 5):
    yi = m * xi + b
    plt.plot(xi, yi, 'o', color='#3b82f6', markersize=6)
    plt.annotate(f'({xi},{yi:.0f})', xy=(xi, yi), xytext=(xi+0.2, yi+0.5), fontsize=8)

plt.axhline(0, color='gray', linewidth=0.5)
plt.axvline(0, color='gray', linewidth=0.5)
plt.xlabel('x', fontsize=12)
plt.ylabel('y', fontsize=12)
plt.title(f'y = {m}x + {b}', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print(f"Slope (m) = {m}: for every 1 step right, the line goes up {m}.")
print(f"Intercept (b) = {b}: the line crosses the y-axis at y = {b}.")`,
      challenge: 'Change m to -1 and b to 4. What does a negative slope look like? Then try m = 0. What kind of line has zero slope?',
      successHint: 'A line is the simplest relationship between two variables. It says: "for every unit increase in x, y changes by exactly m." Every linear equation in the world — from physics to economics — follows this pattern.',
    },
    {
      title: 'Completing the square — al-Khwarizmi’s geometric proof',
      concept: `Al-Khwarizmi’s most brilliant technique was for **quadratic** equations (equations with x²). Consider: x² + 6x = 7.

He did not use formulas. He drew a **picture**:
1. Draw a square with side x — area = x²
2. Add a rectangle of area 6x (width 6, height x)
3. Split the rectangle: put half (3x) on the right, half (3x) on the bottom
4. Now you almost have a bigger square with side (x + 3), but there is a gap: a 3×3 = 9 corner is missing
5. Add 9 to both sides: x² + 6x + 9 = 7 + 9 = 16
6. The left side IS a perfect square: (x + 3)² = 16
7. Take the square root: x + 3 = 4, so x = 1

This is **completing the square** — and al-Khwarizmi invented it. The code below lets you solve any quadratic this way.`,
      analogy: 'Imagine you have an L-shaped garden and you want to make it into a perfect square. You need to add a small square patch in the corner. That extra patch is the "completing" part. Once the garden is a perfect square, you can measure one side to find x.',
      storyConnection: 'Al-Khwarizmi used geometry because his readers understood land measurement. Baghdad’s surveyors divided plots using exactly these shapes. A quadratic equation was not abstract — it was a real field with real dimensions.',
      checkQuestion: 'To complete the square for x² + 10x = 11, what number do you add to both sides?',
      checkAnswer: 'Add 25 (half of 10 is 5, and 5² = 25). Then x² + 10x + 25 = 36, which is (x + 5)² = 36. Take the square root: x + 5 = 6, so x = 1.',
      codeIntro: 'Solve x² + 6x = 7 by completing the square, step by step.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Solve x^2 + bx = c by completing the square
b_coeff = 6
c_value = 7

print("=== Completing the Square ===")
print(f"Equation: x² + {b_coeff}x = {c_value}")
print()

# Step 1: Half of b
half_b = b_coeff / 2
print(f"Step 1: Half of {b_coeff} = {half_b}")

# Step 2: Square it
square = half_b ** 2
print(f"Step 2: ({half_b})² = {square}")

# Step 3: Add to both sides
new_right = c_value + square
print(f"Step 3: Add {square:.0f} to both sides")
print(f"  x² + {b_coeff}x + {square:.0f} = {c_value} + {square:.0f} = {new_right:.0f}")
print(f"  (x + {half_b:.0f})² = {new_right:.0f}")

# Step 4: Square root
root = np.sqrt(new_right)
x_solution = root - half_b
print(f"Step 4: x + {half_b:.0f} = {root:.0f}")
print(f"  x = {x_solution:.0f}")
print()

# Verify
check = x_solution**2 + b_coeff * x_solution
print(f"Check: ({x_solution:.0f})² + {b_coeff}({x_solution:.0f}) = {check:.0f}")
print(f"Correct? {abs(check - c_value) < 0.001}")

# Plot the parabola and solution
x = np.linspace(-5, 4, 200)
y = x**2 + b_coeff * x - c_value  # = 0 at solution

plt.figure(figsize=(8, 5))
plt.plot(x, y, linewidth=2.5, color='#6366f1')
plt.axhline(0, color='gray', linewidth=0.5)
plt.plot(x_solution, 0, 'o', color='#10b981', markersize=10, zorder=5)
plt.annotate(f'x = {x_solution:.0f}', xy=(x_solution, 0), xytext=(x_solution + 1, 5),
             fontsize=11, color='#10b981', fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#10b981'))
plt.xlabel('x', fontsize=12)
plt.ylabel('x² + 6x - 7', fontsize=12)
plt.title('Finding Where the Parabola Crosses Zero', fontsize=13)
plt.grid(alpha=0.3)
plt.show()`,
      challenge: 'Change b_coeff to 10 and c_value to 11. Complete the square for x² + 10x = 11. What is x?',
      successHint: 'Al-Khwarizmi solved quadratics using geometry 600 years before the quadratic formula was written down. Completing the square is the method behind the formula — understanding it means you understand why the formula works, not just how to use it.',
    },
    {
      title: 'From procedure to algorithm',
      concept: `Al-Khwarizmi did something no one before him had done: he wrote down **step-by-step procedures** that work for every equation of a given type. Not just one problem — a general method.

His procedure for solving ax² + bx = c:
1. Divide everything by a (so you have x² + (b/a)x = c/a)
2. Take half of b/a
3. Square it
4. Add that to both sides
5. Take the square root
6. Subtract to find x

This is an **algorithm** — a finite, step-by-step procedure that always produces the correct answer. The word "algorithm" itself comes from the Latin version of his name: *Algoritmi*.

Every computer program is built from algorithms. When you write a for-loop, an if-statement, or a function, you are writing an algorithm. Al-Khwarizmi invented the concept.`,
      analogy: 'A recipe is an algorithm for cooking. "Add 2 cups flour, 1 egg, mix, bake at 180°C for 20 minutes." Follow the steps, get the result. Al-Khwarizmi wrote the first mathematical recipes — procedures anyone could follow to get the right answer every time.',
      storyConnection: 'The Caliph al-Ma’mun asked al-Khwarizmi to write a book that merchants, lawyers, and surveyors could all use. The result had to be practical: step-by-step, clear, no special knowledge required. That demand for clarity gave us the algorithm.',
      checkQuestion: 'What makes an algorithm different from just "figuring it out"?',
      checkAnswer: 'An algorithm is (1) a finite set of steps, (2) each step is precisely defined, (3) it works for every valid input, not just one specific problem, and (4) it always terminates with a result. "Figuring it out" might involve intuition, guessing, or trial and error. An algorithm is mechanical — a computer can execute it.',
      codeIntro: 'Write a general-purpose equation solver — an algorithm that solves ANY equation of the form ax + b = c.',
      code: `# Al-Khwarizmi's algorithm: solve ax + b = c for ANY a, b, c

def solve_linear(a, b, c):
    """
    Solve ax + b = c
    Algorithm:
      Step 1: Subtract b from both sides -> ax = c - b
      Step 2: Divide both sides by a -> x = (c - b) / a
    """
    print(f"Equation: {a}x + {b} = {c}")

    # Step 1: al-Jabr (move b to the other side)
    right = c - b
    print(f"  Step 1: {a}x = {c} - {b} = {right}")

    # Step 2: al-Muqabala (divide both sides)
    x = right / a
    print(f"  Step 2: x = {right} / {a} = {x}")

    # Verify
    check = a * x + b
    print(f"  Check: {a}({x}) + {b} = {check}")
    print()
    return x

# Test with different equations
print("=== The Algorithm Works for ANY Linear Equation ===")
print()
solve_linear(2, 3, 11)    # 2x + 3 = 11
solve_linear(5, -8, 17)   # 5x - 8 = 17
solve_linear(3, 7, 22)    # 3x + 7 = 22
solve_linear(1, 100, 250) # x + 100 = 250

print("One algorithm, infinite equations.")
print("This is al-Khwarizmi's gift to the world.")`,
      challenge: 'Extend the function to handle quadratic equations too (ax² + bx = c). Use the completing-the-square method from the previous lesson inside the function. Call it solve_quadratic(a, b, c).',
      successHint: 'You just wrote a function that is an algorithm: it takes any input, follows precise steps, and always gives the right answer. This is exactly what al-Khwarizmi described in 820 CE. The word "algorithm" is his name.',
    },
    {
      title: 'Solving systems — two equations, two unknowns',
      concept: `What if you have **two** unknowns? A merchant says: "I bought some apples and some oranges. 3 apples and 2 oranges cost 16 dinars. 1 apple and 4 oranges cost 18 dinars." How much does each fruit cost?

You need **two equations**:
- 3a + 2r = 16
- 1a + 4r = 18

Al-Khwarizmi’s method: use one equation to express one variable in terms of the other, then substitute into the second equation. This is **substitution** — and it is another algorithm.

From equation 2: a = 18 − 4r. Substitute into equation 1: 3(18 − 4r) + 2r = 16, which gives 54 − 12r + 2r = 16, so −10r = −38, and r = 3.8. Then a = 18 − 4(3.8) = 2.8.

The code below solves systems of equations using both substitution and NumPy’s linear algebra solver.`,
      analogy: 'Two equations with two unknowns are like two lines on a graph. Each line represents all the (x, y) pairs that satisfy one equation. The **intersection point** — where both lines cross — is the one (x, y) that satisfies BOTH equations simultaneously.',
      storyConnection: 'Baghdad was a trading hub connecting China, India, Persia, and the Mediterranean. Merchants constantly needed to solve multi-variable problems: exchange rates between three currencies, profit splits among partners, dividing land among heirs. Al-Khwarizmi’s methods made these calculations systematic.',
      checkQuestion: 'Two lines on a graph never intersect (they are parallel). What does that mean about the system of equations?',
      checkAnswer: 'It means the system has **no solution**. The two equations are contradictory — no single (x, y) pair satisfies both. In slope-intercept form, parallel lines have the same slope but different intercepts (e.g., y = 2x + 1 and y = 2x + 5). They describe incompatible constraints.',
      codeIntro: 'Solve a system of two equations and visualise the intersection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# System of equations:
# 3a + 2r = 16   (equation 1)
# 1a + 4r = 18   (equation 2)

# Method 1: Substitution (al-Khwarizmi's way)
print("=== Substitution Method ===")
print("From equation 2: a = 18 - 4r")
print("Substitute into equation 1: 3(18 - 4r) + 2r = 16")
print("  54 - 12r + 2r = 16")
print("  -10r = -38")
r = 38 / 10
a = 18 - 4 * r
print(f"  r = {r}")
print(f"  a = 18 - 4({r}) = {a}")
print()

# Method 2: NumPy (modern computer algebra)
print("=== NumPy Method (one line!) ===")
coefficients = np.array([[3, 2], [1, 4]])
constants = np.array([16, 18])
solution = np.linalg.solve(coefficients, constants)
print(f"  a = {solution[0]}, r = {solution[1]}")
print()

# Plot both lines to see the intersection
x_vals = np.linspace(0, 8, 100)
# 3a + 2r = 16 -> r = (16 - 3a) / 2
line1 = (16 - 3 * x_vals) / 2
# a + 4r = 18 -> r = (18 - a) / 4
line2 = (18 - x_vals) / 4

plt.figure(figsize=(8, 6))
plt.plot(x_vals, line1, linewidth=2, color='#3b82f6', label='3a + 2r = 16')
plt.plot(x_vals, line2, linewidth=2, color='#f59e0b', label='a + 4r = 18')
plt.plot(a, r, 'o', color='#10b981', markersize=12, zorder=5)
plt.annotate(f'Solution: a={a}, r={r}', xy=(a, r), xytext=(a+1, r+1),
             fontsize=11, color='#10b981', fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#10b981'))
plt.xlabel('Apples (a)', fontsize=12)
plt.ylabel('Oranges (r)', fontsize=12)
plt.title('Two Equations, One Intersection', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print("The intersection of two lines = the solution of two equations.")
print("One picture, two methods, same answer.")`,
      challenge: 'Change the equations to: 2x + y = 10 and x - y = 2. Solve by substitution first, then verify with np.linalg.solve. Plot both lines.',
      successHint: 'Systems of equations are everywhere: physics (forces in two directions), economics (supply and demand), and computer graphics (finding where two lines cross). NumPy solves them in one line, but understanding the method gives you insight no library can replace.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior algebra or coding experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for algebra visualisations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[AlgebraBalanceScaleDiagram, BalanceScaleDiagram, AlgebraLinearDiagram, AlgebraQuadraticDiagram, AlgebraAlgorithmDiagram, SlopeInterceptDiagram][i] ? createElement([AlgebraBalanceScaleDiagram, BalanceScaleDiagram, AlgebraLinearDiagram, AlgebraQuadraticDiagram, AlgebraAlgorithmDiagram, SlopeInterceptDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
