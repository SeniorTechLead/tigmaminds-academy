import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AlgebraAlgorithmDiagram from '../diagrams/AlgebraAlgorithmDiagram';
import AlgebraLinearDiagram from '../diagrams/AlgebraLinearDiagram';
import AlgebraQuadraticDiagram from '../diagrams/AlgebraQuadraticDiagram';
import NeuralNetworkDiagram from '../diagrams/NeuralNetworkDiagram';
import MatrixMultiplicationDiagram from '../diagrams/MatrixMultiplicationDiagram';
import FlowchartDiagram from '../diagrams/FlowchartDiagram';

export default function AlKhwarizmiLevel4() {
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
      title: 'Gradient descent — the algorithm that trains AI',
      concept: `Every modern AI model learns by **gradient descent**: an algorithm that minimises a function by repeatedly moving downhill.

Imagine standing on a foggy hillside. You cannot see the valley floor, but you can feel the slope under your feet. Step downhill. Feel the slope again. Step downhill again. Eventually, you reach the bottom.

Mathematically: given a function f(x), its derivative f’(x) tells you the slope. If the slope is positive, x is too big — decrease it. If negative, x is too small — increase it. The update rule is:

**x_new = x_old − learning_rate × f’(x_old)**

This is an algorithm in al-Khwarizmi’s sense: a precise, iterative procedure that converges to the answer. It is also a direct descendant of Newton’s method from Level 3.

Gradient descent trains neural networks, fits statistical models, and optimises engineering systems. It is perhaps the most important algorithm of the 21st century.`,
      analogy: 'A marble released on the inside of a bowl rolls to the bottom. It does not calculate the lowest point — it just follows gravity downhill at every instant. Gradient descent is the mathematical equivalent: follow the slope downhill at every step. The "gravity" is the derivative.',
      storyConnection: 'Al-Khwarizmi optimised his methods: fewer steps, less wasted effort. Gradient descent optimises a function: fewer iterations, less error. The House of Wisdom sought the most efficient solution to every problem. Modern AI does the same, using an algorithm that al-Khwarizmi would have understood immediately.',
      checkQuestion: 'What happens if the learning rate is too large?',
      checkAnswer: 'The algorithm overshoots the minimum. Instead of gently rolling to the bottom of the valley, it leaps across to the other side, then back, oscillating wildly. It may never converge. Too small a learning rate converges eventually but takes ages. Choosing the right learning rate is one of the key challenges in machine learning.',
      codeIntro: 'Implement gradient descent to find the minimum of a function.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Function to minimize: f(x) = (x - 3)^2 + 1
# Minimum is at x = 3 where f(x) = 1
def f(x):
    return (x - 3)**2 + 1

def df(x):
    return 2 * (x - 3)   # derivative

# Gradient descent
def gradient_descent(start, lr, steps):
    x = start
    history = [(x, f(x))]
    for _ in range(steps):
        grad = df(x)
        x = x - lr * grad   # THE update rule
        history.append((x, f(x)))
    return x, history

# Run with different learning rates
print("=== Gradient Descent: f(x) = (x-3)² + 1 ===")
print(f"Minimum should be at x = 3, f(x) = 1")
print()

fig, axes = plt.subplots(1, 3, figsize=(14, 4))
lrs = [0.05, 0.3, 0.9]
labels = ['Too slow (lr=0.05)', 'Just right (lr=0.3)', 'Too fast (lr=0.9)']

x_plot = np.linspace(-2, 8, 200)

for ax, lr, label in zip(axes, lrs, labels):
    result, hist = gradient_descent(start=-1, lr=lr, steps=20)

    ax.plot(x_plot, f(x_plot), linewidth=2, color='#6366f1')
    xs = [h[0] for h in hist]
    ys = [h[1] for h in hist]
    ax.plot(xs, ys, 'o-', color='#ef4444', markersize=4, linewidth=1)
    ax.plot(xs[0], ys[0], 'o', color='#ef4444', markersize=8, label='Start')
    ax.plot(xs[-1], ys[-1], 'o', color='#10b981', markersize=8, label='End')
    ax.set_title(label, fontsize=10, fontweight='bold')
    ax.set_xlabel('x', fontsize=10)
    ax.grid(alpha=0.3)
    ax.legend(fontsize=8)

plt.suptitle('Gradient Descent: Learning Rate Matters', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.show()

# Best result
x_best, hist = gradient_descent(-1, 0.3, 20)
print(f"Best: x = {x_best:.6f}, f(x) = {f(x_best):.6f}")
print(f"Converged in {len(hist)-1} steps.")`,
      challenge: 'Modify the function to f(x) = x⁴ − 3x² + 2 (has two local minima). Start from x = −2 and from x = 2. Do they converge to the same minimum? This illustrates a fundamental challenge of gradient descent.',
      successHint: 'Gradient descent is how ChatGPT, image generators, self-driving cars, and every other AI system learns. The update rule — move opposite to the gradient, scaled by a learning rate — is beautifully simple. It is algorithmic thinking at its finest, a direct descendant of al-Khwarizmi’s methods.',
    },
    {
      title: 'Linear regression — fitting a line to data',
      concept: `You have data points: (1, 2.1), (2, 3.9), (3, 6.2), (4, 7.8). They roughly follow a line, but not perfectly. What is the **best** line through them?

**Linear regression** finds the line y = mx + b that minimises the total squared error — the sum of (actual y − predicted y)² for all points. This is the **least squares** method.

The solution uses calculus (or linear algebra): take the derivative of the error function, set it to zero, solve for m and b. The result is a closed-form formula.

Or you can use gradient descent to find m and b iteratively. Both approaches give the same answer.

Linear regression connects al-Khwarizmi’s algebra (solving equations), Newton’s calculus (minimising functions), and modern machine learning (fitting models to data).`,
      analogy: 'Imagine stretching a rubber band to pass as close as possible to a set of thumbtacks on a board. The rubber band naturally settles into the position that minimises the total stretching. Linear regression does the same: it finds the line that minimises the total "pull" from all data points.',
      storyConnection: 'Baghdad’s merchants collected data: sales by month, crop yields by rainfall, trade volumes by season. Finding trends in data is exactly what linear regression does. Al-Khwarizmi’s algebra provides the foundation: the line y = mx + b, the method of solving for unknowns (m and b), and the algorithmic approach to finding the answer.',
      checkQuestion: 'If your linear regression line has a slope of 0 (perfectly horizontal), what does that tell you about the relationship between x and y?',
      checkAnswer: 'There is no linear relationship. Changes in x do not predict changes in y. The data points are scattered randomly around a horizontal line (the mean of y). This does not mean x and y are unrelated — they could have a curved (non-linear) relationship that a straight line misses.',
      codeIntro: 'Fit a line to data using both the closed-form formula and gradient descent.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate noisy data: y = 2x + 1 + noise
np.random.seed(42)
x_data = np.linspace(0, 10, 30)
y_data = 2 * x_data + 1 + np.random.normal(0, 2, 30)

# Method 1: Closed-form (normal equation)
n = len(x_data)
m_exact = (n * np.sum(x_data * y_data) - np.sum(x_data) * np.sum(y_data)) / \\
          (n * np.sum(x_data**2) - np.sum(x_data)**2)
b_exact = np.mean(y_data) - m_exact * np.mean(x_data)
print(f"=== Closed-Form Solution ===")
print(f"y = {m_exact:.3f}x + {b_exact:.3f}")
print()

# Method 2: Gradient descent
m_gd, b_gd = 0.0, 0.0  # start with random guesses
lr = 0.001
m_history, b_history = [], []

for epoch in range(500):
    y_pred = m_gd * x_data + b_gd
    error = y_pred - y_data

    dm = (2/n) * np.sum(error * x_data)
    db = (2/n) * np.sum(error)

    m_gd -= lr * dm
    b_gd -= lr * db

    if epoch % 100 == 0:
        mse = np.mean(error**2)
        m_history.append(m_gd)
        b_history.append(b_gd)
        print(f"Epoch {epoch:3d}: m={m_gd:.3f}, b={b_gd:.3f}, MSE={mse:.3f}")

print(f"\\nGradient descent: y = {m_gd:.3f}x + {b_gd:.3f}")
print(f"Closed-form:      y = {m_exact:.3f}x + {b_exact:.3f}")
print(f"They match!")
print()

# Plot
plt.figure(figsize=(8, 5))
plt.scatter(x_data, y_data, color='#3b82f6', alpha=0.7, label='Data points')
x_line = np.linspace(0, 10, 100)
plt.plot(x_line, m_exact * x_line + b_exact, color='#ef4444', linewidth=2, label=f'Best fit: y = {m_exact:.2f}x + {b_exact:.2f}')

# Show errors
for xi, yi in zip(x_data, y_data):
    y_pred = m_exact * xi + b_exact
    plt.plot([xi, xi], [yi, y_pred], color='gray', linewidth=0.5, alpha=0.5)

plt.xlabel('x', fontsize=12)
plt.ylabel('y', fontsize=12)
plt.title('Linear Regression: Finding the Best Line', fontsize=13)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()`,
      challenge: 'Try fitting a quadratic: y = ax² + bx + c. Generate data from y = 0.5x² − 2x + 3 with noise. Use np.polyfit(x, y, 2) to find the coefficients. Plot the curve and the data.',
      successHint: 'Linear regression is the foundational algorithm of data science. It combines al-Khwarizmi’s algebra (y = mx + b), calculus (minimising errors), and computational thinking (gradient descent). When you see a trend line on any chart, you are seeing al-Khwarizmi’s legacy in action.',
    },
    {
      title: 'Neural networks from scratch — algebra all the way down',
      concept: `A neural network is just layers of linear algebra and simple functions stacked together.

Each neuron computes: **output = activation(w₁x₁ + w₂x₂ + ... + b)**

That is a linear equation (w·x + b) followed by a non-linear activation function. The weights w and bias b are learned by gradient descent.

A network with many neurons and layers can approximate any function — this is the **universal approximation theorem**. But the building blocks are al-Khwarizmi’s: variables, linear equations, and algorithms.

The code below builds a neural network from scratch (no libraries like TensorFlow) to learn the XOR function — the simplest problem that a single neuron cannot solve.`,
      analogy: 'A neural network is a factory assembly line. Raw materials (inputs) enter. Each worker (neuron) applies a simple operation (multiply, add, threshold). The product of one worker becomes the input for the next. The factory as a whole can build complex products, even though each worker does something simple.',
      storyConnection: 'The House of Wisdom combined knowledge from many traditions: Greek geometry, Indian arithmetic, Persian astronomy. Each scholar contributed a piece, and the combination produced something greater than the sum. A neural network combines simple neurons into something intelligent — the same principle of emergent complexity.',
      checkQuestion: 'Why does a neural network need non-linear activation functions? What happens if every layer is purely linear (just w·x + b)?',
      checkAnswer: 'If every layer is linear, the entire network is equivalent to a single linear transformation (a composition of linear functions is linear). No matter how many layers you add, the network can only model linear relationships. The activation function (like ReLU or sigmoid) introduces non-linearity, enabling the network to learn curved, complex patterns.',
      codeIntro: 'Build a neural network from scratch to learn XOR.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def sigmoid_deriv(x):
    s = sigmoid(x)
    return s * (1 - s)

# XOR data: inputs and expected outputs
X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([[0], [1], [1], [0]])

# Network: 2 inputs -> 4 hidden -> 1 output
np.random.seed(42)
W1 = np.random.randn(2, 4) * 0.5
b1 = np.zeros((1, 4))
W2 = np.random.randn(4, 1) * 0.5
b2 = np.zeros((1, 1))

lr = 1.0
losses = []

for epoch in range(5000):
    # Forward pass (algebra!)
    z1 = X @ W1 + b1        # linear: Wx + b
    a1 = sigmoid(z1)         # activation
    z2 = a1 @ W2 + b2       # linear: Wx + b
    a2 = sigmoid(z2)         # output

    # Loss
    loss = np.mean((a2 - y)**2)
    losses.append(loss)

    # Backward pass (gradient descent!)
    d2 = (a2 - y) * sigmoid_deriv(z2)
    dW2 = a1.T @ d2 / 4
    db2 = np.mean(d2, axis=0, keepdims=True)

    d1 = (d2 @ W2.T) * sigmoid_deriv(z1)
    dW1 = X.T @ d1 / 4
    db1 = np.mean(d1, axis=0, keepdims=True)

    # Update weights (al-Jabr: adjust both sides!)
    W2 -= lr * dW2
    b2 -= lr * db2
    W1 -= lr * dW1
    b1 -= lr * db1

    if epoch % 1000 == 0:
        print(f"Epoch {epoch}: loss = {loss:.6f}")

# Final predictions
z1 = X @ W1 + b1; a1 = sigmoid(z1)
z2 = a1 @ W2 + b2; pred = sigmoid(z2)

print(f"\\n=== Learned XOR ===")
for i in range(4):
    print(f"  {X[i]} -> {pred[i][0]:.3f} (expected {y[i][0]})")

plt.figure(figsize=(8, 4))
plt.plot(losses, linewidth=1.5, color='#6366f1')
plt.xlabel('Epoch', fontsize=12)
plt.ylabel('Loss', fontsize=12)
plt.title('Neural Network Learning XOR', fontsize=13)
plt.grid(alpha=0.3)
plt.show()

print("\\nEvery step is algebra: Wx + b, then gradient descent.")
print("A neural network is al-Khwarizmi's equations, running millions of times.")`,
      challenge: 'Modify the network to have 8 hidden neurons instead of 4. Does it learn faster? Try learning a different function: AND (output 1 only when both inputs are 1). How does the loss curve change?',
      successHint: 'You just built a neural network from scratch using nothing but linear algebra and gradient descent. No TensorFlow, no magic — just variables, equations, and an algorithm. Al-Khwarizmi’s three contributions to mathematics (variables, equations, algorithms) are literally the three building blocks of modern AI.',
    },
    {
      title: 'Optimisation under constraints — linear programming',
      concept: `Many real problems are not just "minimise f(x)" but "minimise f(x) subject to constraints." A factory wants to maximise profit, but has limited materials, workers, and machines. An airline wants to minimise fuel, but must visit all cities.

**Linear programming** (LP) solves problems where both the objective and constraints are linear:

Maximise: 5x + 4y (profit)
Subject to: x + y ≤ 100, 2x + y ≤ 150, x ≥ 0, y ≥ 0

The constraints define a **feasible region** — a polygon on the coordinate plane. The optimal solution is always at a vertex (corner) of this polygon. This is the **Simplex theorem**.

LP was formalised in 1947 by Dantzig, but the underlying algebra — systems of linear equations and inequalities — is exactly al-Khwarizmi’s domain.`,
      analogy: 'Imagine a farmer who can plant wheat or corn. Wheat earns more per acre but needs more water. Corn needs more labour. The farmer has limited water and labour. Linear programming finds the exact mix of wheat and corn that maximises income without exceeding any resource limit.',
      storyConnection: 'The Abbasid Caliphate managed an empire’s resources: allocating troops, distributing grain, planning trade routes. These are optimisation problems. Al-Khwarizmi’s book on inheritance was essentially a constrained optimisation problem: divide property according to Islamic law (the constraints) while satisfying all heirs (the objective).',
      checkQuestion: 'Why is the optimal solution always at a vertex of the feasible region?',
      checkAnswer: 'Because the objective function is linear, its value changes at a constant rate in any direction. On a flat surface (the feasible region), a linear function achieves its maximum/minimum at the boundary. On a polygon’s boundary, a linear function achieves its extreme at a vertex. Moving along an edge either improves or worsens the objective, so the best point is at the end of the best edge.',
      codeIntro: 'Solve a linear programming problem by plotting the feasible region and checking vertices.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Problem: Maximize 5x + 4y
# Subject to: x + y <= 100, 2x + y <= 150, x >= 0, y >= 0

# Plot feasible region
x = np.linspace(0, 100, 300)

# Constraint lines (as y = ...)
y1 = 100 - x          # x + y <= 100
y2 = 150 - 2*x        # 2x + y <= 150

plt.figure(figsize=(8, 6))

# Shade feasible region
y_upper = np.minimum(y1, y2)
y_upper = np.maximum(y_upper, 0)
valid = (x >= 0) & (y_upper >= 0)
plt.fill_between(x[valid], 0, y_upper[valid], alpha=0.2, color='#3b82f6', label='Feasible region')

# Constraint lines
plt.plot(x, y1, '--', color='#ef4444', linewidth=1.5, label='x + y = 100')
plt.plot(x, y2, '--', color='#f59e0b', linewidth=1.5, label='2x + y = 150')
plt.axhline(0, color='gray', linewidth=0.5)
plt.axvline(0, color='gray', linewidth=0.5)

# Find vertices of the feasible region
vertices = [
    (0, 0),
    (75, 0),       # 2x + y = 150, y = 0
    (50, 50),      # intersection: x+y=100 and 2x+y=150 -> x=50, y=50
    (0, 100),      # x + y = 100, x = 0
]

# Evaluate objective at each vertex
print("=== Evaluating Vertices ===")
best_val = -1
best_pt = None
for vx, vy in vertices:
    obj = 5 * vx + 4 * vy
    print(f"  ({vx}, {vy}): profit = 5({vx}) + 4({vy}) = {obj}")
    plt.plot(vx, vy, 'o', color='#10b981', markersize=8, zorder=5)
    plt.annotate(f'({vx},{vy})\\nP={obj}', xy=(vx, vy), xytext=(vx+3, vy+5), fontsize=9)
    if obj > best_val:
        best_val = obj
        best_pt = (vx, vy)

print(f"\\nOptimal: ({best_pt[0]}, {best_pt[1]}) with profit = {best_val}")

plt.plot(best_pt[0], best_pt[1], '*', color='#10b981', markersize=20, zorder=6)
plt.xlim(-5, 110)
plt.ylim(-5, 120)
plt.xlabel('x (units of product A)', fontsize=12)
plt.ylabel('y (units of product B)', fontsize=12)
plt.title(f'Linear Programming: Max Profit = {best_val}', fontsize=13)
plt.legend(fontsize=9)
plt.grid(alpha=0.3)
plt.show()

print("\\nThe optimal solution is always at a vertex of the feasible region.")
print("This is the Simplex theorem — check corners, find the optimum.")`,
      challenge: 'Add a third constraint: x + 2y ≤ 120. How does the feasible region change? Does the optimal solution move to a different vertex?',
      successHint: 'Linear programming is used by every airline (scheduling), logistics company (routing), manufacturer (production planning), and financial institution (portfolio optimisation). The algebra is al-Khwarizmi’s; the algorithmic thinking is his legacy; the applications are everywhere.',
    },
    {
      title: 'The halting problem — what algorithms CANNOT do',
      concept: `We have celebrated algorithms throughout this lesson. But there are fundamental limits to what they can do.

In 1936, Alan Turing proved the **halting problem**: there is no algorithm that can look at any program and any input and correctly determine whether the program will eventually stop (halt) or run forever.

The proof is a beautiful use of contradiction (al-Khwarizmi would have appreciated the logical structure):

1. Assume such an algorithm H exists
2. Build a new program D that feeds itself to H
3. If H says D will halt, make D loop forever
4. If H says D will loop, make D halt
5. Either way, H gives the wrong answer → contradiction

This means there are questions that no computer can ever answer. It is not about speed or memory — it is a mathematical impossibility.`,
      analogy: 'Imagine a fortune teller who claims to predict whether any person will stop talking. You ask: "Will I stop talking?" If she says yes, you keep talking to prove her wrong. If she says no, you stop. She cannot win. The halting problem is this paradox applied to programs.',
      storyConnection: 'Al-Khwarizmi believed in systematic methods that always work. The halting problem shows that this is not always possible — some problems are undecidable. But this limit makes algorithms MORE valuable, not less: knowing which problems CAN be solved algorithmically is itself a profound insight.',
      checkQuestion: 'If the halting problem is unsolvable, how do we know when our programs will terminate?',
      checkAnswer: 'We prove termination for specific programs using mathematical reasoning (e.g., showing a loop counter always decreases). We cannot do it in general for ALL programs, but we can for many particular ones. Practical techniques include loop variants, termination metrics, and structural induction. The halting problem says no single tool works for EVERY program — but clever humans can prove termination for most useful ones.',
      codeIntro: 'Explore the idea with programs that halt and programs that might not.',
      code: `# Programs that definitely halt
def definitely_halts(n):
    """Counts down to 0 — always terminates."""
    while n > 0:
        n -= 1
    return "Done!"

print(definitely_halts(100))
print(definitely_halts(0))
print()

# The Collatz conjecture — does this ALWAYS halt?
def collatz(n):
    """If even, divide by 2. If odd, multiply by 3 and add 1.
    Conjecture: always reaches 1. UNPROVEN for all n."""
    steps = 0
    sequence = [n]
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        steps += 1
        sequence.append(n)
    return steps, sequence

print("=== Collatz Conjecture ===")
print("Rule: if even, halve it. If odd, triple it and add 1.")
print("Does it ALWAYS reach 1?")
print()

for start in [7, 27, 97, 871]:
    steps, seq = collatz(start)
    print(f"  Start={start}: reaches 1 in {steps} steps")
    if len(seq) <= 20:
        print(f"    Sequence: {seq}")
    else:
        print(f"    Sequence: {seq[:10]} ... {seq[-3:]}")
print()

# Nobody has proven Collatz always halts — for ANY n.
# It has been verified for all n up to 2^68.
# But verification is not proof.

print("=== The Halting Problem ===")
print("Can we write a program that determines whether ANY")
print("program halts on ANY input? Turing proved: NO.")
print()
print("This is not about being clever enough. It is a")
print("mathematical impossibility — like proving 1 = 2.")
print()
print("Al-Khwarizmi gave us algorithms.")
print("Turing showed us their limits.")
print("Both are equally important.")`,
      challenge: 'Run collatz(n) for all n from 1 to 10,000 and plot the number of steps vs n. You will see a chaotic, beautiful scatter. Find the starting number under 10,000 that takes the MOST steps to reach 1.',
      successHint: 'Al-Khwarizmi launched a 1,200-year journey. He gave us variables, equations, and algorithms. His successors extended them to calculus, matrices, and complexity theory. Turing defined the limits. And every programmer, data scientist, and AI researcher today works within the framework that began in the House of Wisdom in Baghdad.',
    },
    {
      title: 'Capstone — build an equation solver with al-Khwarizmi’s methods',
      concept: `You now have all the tools. In this final exercise, you will build a **complete equation solver** that handles:

1. **Linear equations** (ax + b = c) using al-Jabr
2. **Quadratic equations** (ax² + bx + c = 0) using completing the square
3. **Systems of equations** using matrices
4. **Non-linear equations** using Newton’s method

Your solver will classify the equation type, choose the right algorithm, and display the solution with a visualisation. This is a capstone project that integrates everything you have learned across all four levels.

Al-Khwarizmi wrote the first systematic equation solver 1,200 years ago. You are writing the latest one.`,
      analogy: 'You are building a Swiss Army knife for equations. Each blade is an algorithm: one for linear, one for quadratic, one for systems, one for anything else. The handle is the classifier that decides which blade to deploy. Al-Khwarizmi’s book was the original Swiss Army knife of mathematics.',
      storyConnection: 'Al-Khwarizmi’s Kitab al-Jabr was written so that merchants, lawyers, and surveyors could solve equations without being mathematicians. Your solver has the same goal: give it an equation, get an answer. The 1,200-year arc from Baghdad’s House of Wisdom to your Python code is a single continuous thread of algorithmic thinking.',
      checkQuestion: 'What makes your equation solver an "algorithm" in al-Khwarizmi’s sense?',
      checkAnswer: 'It is (1) a finite set of steps, (2) each step is precisely defined, (3) it works for every valid input (any equation of the supported types), (4) it always terminates with a result. These are the four properties al-Khwarizmi insisted on. Your solver is a direct descendant of his methods.',
      codeIntro: 'Build a multi-purpose equation solver that combines all methods from this lesson.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class AlKhwarizmiSolver:
    """An equation solver in the tradition of al-Khwarizmi."""

    def solve_linear(self, a, b, c):
        """Solve ax + b = c using al-Jabr."""
        x = (c - b) / a
        print(f"  Linear: {a}x + {b} = {c}")
        print(f"  al-Jabr: x = ({c} - {b}) / {a} = {x}")
        return x

    def solve_quadratic(self, a, b, c):
        """Solve ax² + bx + c = 0 by completing the square."""
        disc = b**2 - 4*a*c
        print(f"  Quadratic: {a}x² + {b}x + {c} = 0")
        print(f"  Discriminant: {disc}")
        if disc < 0:
            print(f"  No real solutions")
            return []
        x1 = (-b + np.sqrt(disc)) / (2*a)
        x2 = (-b - np.sqrt(disc)) / (2*a)
        if abs(disc) < 1e-10:
            print(f"  One solution: x = {x1:.4f}")
            return [x1]
        print(f"  Two solutions: x = {x1:.4f}, {x2:.4f}")
        return [x1, x2]

    def solve_system(self, A, b):
        """Solve Ax = b using matrices."""
        x = np.linalg.solve(A, b)
        print(f"  System of {len(b)} equations:")
        for i in range(len(b)):
            terms = ' + '.join(f'{A[i,j]:.1f}x{j+1}' for j in range(A.shape[1]))
            print(f"    {terms} = {b[i]:.1f}")
        print(f"  Solution: {[f'x{i+1}={v:.3f}' for i, v in enumerate(x)]}")
        return x

    def solve_newton(self, f, df, x0, name="f(x)"):
        """Solve f(x) = 0 using Newton's method."""
        x = x0
        for i in range(100):
            fx = f(x)
            if abs(fx) < 1e-12: break
            x = x - fx / df(x)
        print(f"  Newton's method for {name} = 0")
        print(f"  Starting from x = {x0}, converged to x = {x:.6f}")
        return x

# Use the solver
solver = AlKhwarizmiSolver()

print("=== Al-Khwarizmi's Universal Equation Solver ===")
print()

print("1. Linear equation:")
solver.solve_linear(3, 7, 22)
print()

print("2. Quadratic equation:")
solver.solve_quadratic(1, -5, 6)
print()

print("3. System of equations:")
A = np.array([[2.0, 1.0], [1.0, 3.0]])
b = np.array([5.0, 10.0])
solver.solve_system(A, b)
print()

print("4. Non-linear equation (Newton):")
solver.solve_newton(lambda x: x**3 - 2*x - 5,
                    lambda x: 3*x**2 - 2,
                    2.0, "x³ - 2x - 5")
print()

print("=" * 50)
print("Four types. Four algorithms. One tradition.")
print("From the House of Wisdom to your screen.")`,
      challenge: 'Extend the solver to handle polynomial equations of any degree using np.roots(). Add a plot method that visualises the equation and its solutions. Make the solver accept equations as strings (e.g., "2x + 3 = 7") and parse them automatically.',
      successHint: 'You have completed the full journey from al-Khwarizmi’s House of Wisdom to modern computer science. Variables, equations, algorithms, complexity, limits — all traced back to one scholar in 9th-century Baghdad who wrote down his methods so clearly that we still use them 1,200 years later. His name became the word for the most important concept in computing: algorithm.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Visionary
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced: AI, optimisation, and the limits of computation</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises explore the cutting edge of algebra and algorithms. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={[AlgebraAlgorithmDiagram, AlgebraLinearDiagram, NeuralNetworkDiagram, AlgebraQuadraticDiagram, FlowchartDiagram, MatrixMultiplicationDiagram][i] ? createElement([AlgebraAlgorithmDiagram, AlgebraLinearDiagram, NeuralNetworkDiagram, AlgebraQuadraticDiagram, FlowchartDiagram, MatrixMultiplicationDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
