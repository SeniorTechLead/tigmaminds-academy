import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import RavanaNeuralNetDiagram from '../diagrams/RavanaNeuralNetDiagram';

export default function RavanaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The perceptron — a single artificial neuron',
      concept: `The simplest neural network has just one node: the **perceptron**, invented in 1958 by Frank Rosenblatt. It mimics a single biological neuron.

A perceptron takes multiple inputs (x1, x2, ...), multiplies each by a **weight** (w1, w2, ...), sums them up, adds a **bias**, and passes the result through an **activation function** that outputs 0 or 1.

**output = activation(w1*x1 + w2*x2 + ... + bias)**

If the weighted sum exceeds a threshold, the perceptron fires (outputs 1). Otherwise, it stays quiet (outputs 0). This is exactly what a biological neuron does: if enough excitatory signals arrive at its dendrites, it fires an action potential down its axon.

A single perceptron can learn to classify things into two categories — like Ravana's war head deciding "threat" or "not a threat" from battlefield signals.`,
      analogy: 'A perceptron is like a judge scoring a diving competition. Each judge gives a score (input), each score is multiplied by a difficulty factor (weight), the scores are summed, and if the total exceeds a passing mark (threshold), the diver advances. Adjusting the weights changes what constitutes a passing dive.',
      storyConnection: 'Each of Ravana\'s heads was a specialised perceptron. The warfare head took inputs (enemy position, weapon type, terrain) and weighted them to produce a single decision: attack or defend. The music head took different inputs (rhythm, pitch, emotion) and weighted them to produce: this note or that note. Same architecture, different weights.',
      checkQuestion: 'A perceptron has inputs [1, 0, 1], weights [0.5, -0.3, 0.8], and bias -0.5. Does it fire? (threshold: sum > 0)',
      checkAnswer: 'Weighted sum = (1×0.5) + (0×-0.3) + (1×0.8) + (-0.5) = 0.5 + 0 + 0.8 - 0.5 = 0.8. Since 0.8 > 0, yes — the perceptron fires (outputs 1).',
      codeIntro: 'Build a perceptron from scratch and train it to learn a logical AND gate.',
      code: `import numpy as np

# === The Perceptron: One Artificial Neuron ===

class Perceptron:
    def __init__(self, n_inputs, learning_rate=0.1):
        self.weights = np.random.randn(n_inputs) * 0.5
        self.bias = 0.0
        self.lr = learning_rate

    def activate(self, x):
        return 1 if x > 0 else 0

    def predict(self, inputs):
        total = np.dot(self.weights, inputs) + self.bias
        return self.activate(total)

    def train(self, inputs, target):
        prediction = self.predict(inputs)
        error = target - prediction
        # Update weights: nudge toward correct answer
        self.weights += self.lr * error * np.array(inputs)
        self.bias += self.lr * error
        return error

# Train a perceptron to learn AND gate
# AND: (0,0)->0, (0,1)->0, (1,0)->0, (1,1)->1
data = [([0,0], 0), ([0,1], 0), ([1,0], 0), ([1,1], 1)]

p = Perceptron(n_inputs=2)
print("=== Training AND Gate ===")
print(f"Initial weights: {p.weights.round(3)}, bias: {p.bias:.3f}")

for epoch in range(20):
    total_error = 0
    for inputs, target in data:
        error = p.train(inputs, target)
        total_error += abs(error)
    if epoch < 5 or total_error == 0:
        print(f"Epoch {epoch+1:>2}: errors={total_error}")
    if total_error == 0:
        print("Converged!")
        break

print(f"\\nFinal weights: {p.weights.round(3)}, bias: {p.bias:.3f}")
print(f"\\n=== Testing ===")
for inputs, target in data:
    pred = p.predict(inputs)
    status = "correct" if pred == target else "WRONG"
    print(f"  {inputs} -> {pred} (expected {target}) {status}")`,
      challenge: 'Train the perceptron to learn OR instead of AND. Then try XOR (exclusive or: 0,0->0, 0,1->1, 1,0->1, 1,1->0). XOR will fail — can you figure out why? (Hint: XOR is not linearly separable.)',
      successHint: 'The perceptron is the atom of neural networks. It can learn any linearly separable pattern — but fails on XOR. This limitation led to the "AI winter" of the 1970s, until researchers discovered that multiple layers of perceptrons could learn anything.',
    },
    {
      title: 'Multi-layer networks — layers of Ravana\'s heads',
      concept: `A single perceptron cannot learn XOR. But **stack multiple layers** and suddenly you can learn anything.

A multi-layer network has:
- **Input layer**: receives the raw data
- **Hidden layers**: extract increasingly abstract features
- **Output layer**: produces the final answer

Each node in a hidden layer is a perceptron. The output of one layer becomes the input of the next. This cascading transformation lets the network learn complex, non-linear patterns.

The key innovation: instead of the hard 0-or-1 activation, we use **sigmoid** — a smooth S-curve that outputs any value between 0 and 1. This makes the network differentiable, which means we can use calculus (gradients) to train it.

**sigmoid(x) = 1 / (1 + e^(-x))**`,
      analogy: 'Think of a detective agency. The front desk (input layer) receives raw clues. Junior detectives (hidden layer 1) sort clues into categories: physical evidence, witness statements, digital records. Senior detectives (hidden layer 2) combine categories into theories. The chief (output layer) decides: guilty or not guilty. Each layer transforms the information into a more useful form.',
      storyConnection: 'Ravana\'s ten heads were not a flat layer — they had hierarchy. The warfare head consulted the astronomy head for timing, which consulted the mathematics head for calculations. Information flowed through layers of expertise before reaching a decision. This is exactly a multi-layer neural network.',
      checkQuestion: 'Why does adding a hidden layer let the network learn XOR when a single perceptron cannot?',
      checkAnswer: 'XOR is not linearly separable — no single straight line can divide the 1s from the 0s. A hidden layer creates an intermediate representation that IS linearly separable. The first layer transforms the inputs into a new space where a line CAN separate the classes. This is the power of depth.',
      codeIntro: 'Build a 2-layer network that solves XOR — what a single perceptron cannot do.',
      code: `import numpy as np

# === Multi-Layer Network: Solving XOR ===

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def sigmoid_derivative(x):
    return x * (1 - x)

# XOR data
X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([[0], [1], [1], [0]])

# Network: 2 inputs -> 4 hidden -> 1 output
np.random.seed(42)
w_hidden = np.random.randn(2, 4) * 0.5
b_hidden = np.zeros((1, 4))
w_output = np.random.randn(4, 1) * 0.5
b_output = np.zeros((1, 1))
lr = 1.0

print("=== Training XOR Network ===")
losses = []
for epoch in range(5000):
    # Forward pass
    hidden = sigmoid(X @ w_hidden + b_hidden)
    output = sigmoid(hidden @ w_output + b_output)

    # Loss
    loss = np.mean((y - output) ** 2)
    if epoch % 1000 == 0:
        losses.append(loss)
        print(f"Epoch {epoch:>5}: loss = {loss:.4f}")

    # Backpropagation
    d_output = (y - output) * sigmoid_derivative(output)
    d_hidden = d_output @ w_output.T * sigmoid_derivative(hidden)

    w_output += lr * hidden.T @ d_output
    b_output += lr * d_output.sum(axis=0, keepdims=True)
    w_hidden += lr * X.T @ d_hidden
    b_hidden += lr * d_hidden.sum(axis=0, keepdims=True)

print(f"\\n=== Results ===")
for i in range(4):
    pred = output[i, 0]
    print(f"  {X[i]} -> {pred:.3f} (rounded: {round(pred)}, target: {y[i,0]})")

correct = sum(round(output[i,0]) == y[i,0] for i in range(4))
print(f"\\nAccuracy: {correct}/4 = {correct/4*100:.0f}%")`,
      challenge: 'Change the hidden layer size from 4 to 2. Does it still learn XOR? What about 8 hidden nodes? Also try reducing the learning rate to 0.1 — how many more epochs does it need?',
      successHint: 'You just implemented backpropagation — the algorithm that powers all of modern deep learning. A single perceptron fails on XOR, but adding one hidden layer makes it learnable. This insight (that depth enables learning) launched the deep learning revolution.',
    },
    {
      title: 'Activation functions — the neuron\'s decision maker',
      concept: `The activation function decides whether a neuron fires and how strongly. Different activations have different properties:

**Sigmoid**: smooth S-curve, outputs 0 to 1. Good for probabilities. Problem: gradients vanish for very large or small inputs (the "vanishing gradient problem").

**ReLU** (Rectified Linear Unit): outputs max(0, x). Dead simple, fast, and solves the vanishing gradient problem. The default choice for modern networks.

**Tanh**: like sigmoid but outputs -1 to 1. Centred at zero, which helps training converge faster.

**Softmax**: used for the output layer when classifying multiple categories. Converts raw scores into probabilities that sum to 1.

The choice of activation function dramatically affects how fast (and whether) a network learns.`,
      analogy: 'Activation functions are like volume knobs on different amplifiers. Sigmoid is a compressor — it squishes everything into a narrow range (0 to 1). ReLU is a noise gate — silence below zero, full volume above. Tanh is a balanced amplifier. The right knob depends on the music (data) you are processing.',
      storyConnection: 'Each of Ravana\'s heads had a different threshold for action. The war head activated at the slightest threat (low threshold, like ReLU). The philosophy head required deep contemplation before producing output (high threshold, like sigmoid with large bias). The activation function is the head\'s personality.',
      checkQuestion: 'Why is ReLU preferred over sigmoid in deep networks?',
      checkAnswer: 'Sigmoid squashes all values into [0,1], and its gradient approaches zero for large inputs (saturation). In a deep network, these tiny gradients multiply together across many layers, becoming effectively zero — the "vanishing gradient problem." ReLU has a constant gradient of 1 for positive inputs, so gradients flow freely through deep networks.',
      codeIntro: 'Visualise and compare the four main activation functions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Activation Functions Gallery ===

x = np.linspace(-5, 5, 200)

def sigmoid(x): return 1 / (1 + np.exp(-x))
def relu(x): return np.maximum(0, x)
def tanh(x): return np.tanh(x)
def leaky_relu(x): return np.where(x > 0, x, 0.01 * x)

# Derivatives
def sigmoid_grad(x):
    s = sigmoid(x)
    return s * (1 - s)
def relu_grad(x): return np.where(x > 0, 1.0, 0.0)
def tanh_grad(x): return 1 - np.tanh(x)**2

funcs = [
    ("Sigmoid", sigmoid, sigmoid_grad, "#60a5fa"),
    ("ReLU", relu, relu_grad, "#22c55e"),
    ("Tanh", tanh, tanh_grad, "#f59e0b"),
    ("Leaky ReLU", leaky_relu, None, "#ef4444"),
]

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
for ax, (name, fn, grad_fn, color) in zip(axes.flat, funcs):
    ax.plot(x, fn(x), color=color, linewidth=2.5, label=name)
    if grad_fn is not None:
        ax.plot(x, grad_fn(x), color=color, linewidth=1.5,
                linestyle='--', alpha=0.6, label=f'{name} gradient')
    ax.axhline(0, color='gray', linewidth=0.5)
    ax.axvline(0, color='gray', linewidth=0.5)
    ax.set_title(name, fontsize=13, fontweight='bold')
    ax.legend(fontsize=9)
    ax.grid(alpha=0.3)
    ax.set_xlim(-5, 5)

plt.suptitle('Activation Functions & Their Gradients', fontsize=15,
             fontweight='bold')
plt.tight_layout()
plt.show()

print("Key properties:")
print("  Sigmoid: range (0,1), gradient vanishes at extremes")
print("  ReLU: range [0,inf), constant gradient=1 for x>0")
print("  Tanh: range (-1,1), zero-centered, steeper gradient")
print("  Leaky ReLU: like ReLU but allows small negative values")`,
      challenge: 'Implement a new activation called "swish": swish(x) = x * sigmoid(x). Plot it alongside the others. Swish was discovered by Google Brain in 2017 and outperforms ReLU in many deep networks. Why might a smooth curve beat ReLU\'s sharp corner at zero?',
      successHint: 'Activation functions are the non-linearity that makes neural networks powerful. Without them, stacking layers would be pointless (a chain of linear functions is just another linear function). ReLU is the workhorse, but the field keeps innovating — GELU, Swish, Mish, and more.',
    },
    {
      title: 'Training a classifier — learning from data',
      concept: `Let's train a complete neural network to classify data — not with pre-built libraries, but with code you understand line by line.

We will generate a simple 2D dataset: two spiral-shaped clusters. A linear classifier cannot separate spirals, but a neural network with a hidden layer can learn the curved decision boundary.

The training loop:
1. **Forward pass**: feed data through the network, get predictions
2. **Compute loss**: measure how wrong the predictions are
3. **Backward pass**: calculate gradients (how to adjust each weight)
4. **Update weights**: nudge weights in the direction that reduces loss
5. **Repeat** thousands of times

This is the same algorithm powering ChatGPT, image recognition, and self-driving cars — just on a much smaller scale.`,
      analogy: 'Training a network is like tuning a guitar by ear. You pluck a string (forward pass), hear that it is sharp (compute loss), turn the peg slightly (update weight), and pluck again. After many tiny adjustments, the string is in tune. The network does this for thousands of "pegs" (weights) simultaneously.',
      storyConnection: 'Ravana\'s heads each became masters through millennia of study — their own form of training. The warfare head adjusted its strategies (weights) after each battle (training example). The music head refined its technique after each performance. Neural network training is accelerated learning: millions of adjustments in seconds.',
      checkQuestion: 'If a network makes a prediction of 0.8 but the target is 0.0, in which direction should the weights change?',
      checkAnswer: 'The weights should change to make the output smaller — closer to 0.0. The gradient of the loss function points in the direction of increasing error, so we move in the opposite direction (gradient descent). The learning rate controls how big each step is.',
      codeIntro: 'Train a neural network to classify spiral data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Spiral Classification ===
np.random.seed(42)

# Generate spiral data
n = 200
theta = np.linspace(0, 4*np.pi, n)
r = np.linspace(0.5, 3, n)
noise = np.random.randn(n) * 0.3

# Class 0: spiral A, Class 1: spiral B
x0 = np.column_stack([r*np.cos(theta)+noise, r*np.sin(theta)+noise])
x1 = np.column_stack([-r*np.cos(theta)+noise, -r*np.sin(theta)+noise])
X = np.vstack([x0, x1])
y = np.array([0]*n + [1]*n).reshape(-1, 1)

# Shuffle
idx = np.random.permutation(len(X))
X, y = X[idx], y[idx]

# Network: 2 -> 16 -> 8 -> 1
def sigmoid(z): return 1/(1+np.exp(-np.clip(z,-500,500)))

w1 = np.random.randn(2,16)*0.3; b1 = np.zeros((1,16))
w2 = np.random.randn(16,8)*0.3; b2 = np.zeros((1,8))
w3 = np.random.randn(8,1)*0.3;  b3 = np.zeros((1,1))
lr = 0.5
losses = []

for epoch in range(3000):
    # Forward
    z1 = X@w1+b1; a1 = np.maximum(0,z1)  # ReLU
    z2 = a1@w2+b2; a2 = np.maximum(0,z2)
    z3 = a2@w3+b3; a3 = sigmoid(z3)

    loss = -np.mean(y*np.log(a3+1e-8)+(1-y)*np.log(1-a3+1e-8))
    if epoch % 500 == 0:
        losses.append(loss)
        acc = np.mean((a3>0.5)==y)*100
        print(f"Epoch {epoch}: loss={loss:.3f}, acc={acc:.0f}%")

    # Backward
    d3 = a3-y
    d2 = (d3@w3.T)*(z2>0)
    d1 = (d2@w2.T)*(z1>0)
    w3-=lr*a2.T@d3/len(X); b3-=lr*d3.mean(0,keepdims=True)
    w2-=lr*a1.T@d2/len(X); b2-=lr*d2.mean(0,keepdims=True)
    w1-=lr*X.T@d1/len(X);  b1-=lr*d1.mean(0,keepdims=True)

# Plot decision boundary
fig,axes = plt.subplots(1,2,figsize=(13,5))
xx,yy = np.meshgrid(np.linspace(-4,4,100),np.linspace(-4,4,100))
grid = np.column_stack([xx.ravel(),yy.ravel()])
h1=np.maximum(0,grid@w1+b1); h2=np.maximum(0,h1@w2+b2)
pred=sigmoid(h2@w3+b3).reshape(xx.shape)
axes[0].contourf(xx,yy,pred,levels=20,cmap='RdYlBu',alpha=0.7)
axes[0].scatter(X[y.ravel()==0,0],X[y.ravel()==0,1],c='red',s=8)
axes[0].scatter(X[y.ravel()==1,0],X[y.ravel()==1,1],c='blue',s=8)
axes[0].set_title('Decision Boundary')

axes[1].plot(range(0,3000,500),losses,'o-',color='#a78bfa',linewidth=2)
axes[1].set_title('Training Loss'); axes[1].set_xlabel('Epoch')
axes[1].set_ylabel('Loss'); axes[1].grid(alpha=0.3)
plt.tight_layout(); plt.show()

acc = np.mean((a3>0.5)==y)*100
print(f"\\nFinal accuracy: {acc:.1f}%")`,
      challenge: 'Try reducing the hidden layers to just one (2->16->1). Can it still learn the spiral? What if you increase to three hidden layers (2->16->16->8->1)? Deeper is not always better — find the sweet spot.',
      successHint: 'You trained a neural network from raw numpy — no PyTorch, no TensorFlow, just matrix multiplication and gradients. This is the foundation that every ML framework builds upon. The decision boundary visualization shows the network learning a non-linear separation that no single line could achieve.',
    },
    {
      title: 'Backpropagation — how networks learn from mistakes',
      concept: `Backpropagation is the algorithm that makes neural networks trainable. The name says it all: propagating errors **backward** through the network.

Here is the intuition. The network makes a prediction. The loss function says "you were off by 0.3." Now the question is: which weights contributed most to this error, and how should each weight change?

The **chain rule** from calculus provides the answer. The loss depends on the output. The output depends on the last layer's weights. Those depend on the previous layer's outputs. And so on, all the way back to the first layer.

For each weight: **gradient = how much the loss changes if this weight changes by a tiny amount**. Weights with large gradients contributed most to the error and get the biggest adjustments.

This is computed efficiently by working backward: output layer gradients first, then hidden layers, then input layer. Each layer's gradients use the next layer's gradients — a chain of dependencies.`,
      analogy: 'Imagine a factory assembly line that produces defective products. You trace the defect backward: final inspection finds the flaw, asks the previous station what went wrong, that station checks the station before it, and so on back to the raw materials. Each station adjusts its process proportionally to how much it contributed to the defect. That is backpropagation.',
      storyConnection: 'When Ravana made a strategic error in battle, which head was responsible? The warfare head for the plan? The astronomy head for bad timing? The mathematics head for wrong calculations? Ravana had to trace the error back through his chain of heads — assigning blame to each head proportionally. This is exactly what backpropagation does with weights.',
      checkQuestion: 'Why do we compute gradients backward (output to input) instead of forward (input to output)?',
      checkAnswer: 'Efficiency. Computing forward would require a separate forward pass for every single weight to see how the loss changes. With millions of weights, that is millions of forward passes. Computing backward uses the chain rule to get ALL gradients in a single backward pass — the same cost as one forward pass. This makes training feasible.',
      codeIntro: 'Visualise backpropagation step by step in a small network.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Backpropagation Visualised ===
np.random.seed(42)

def sigmoid(x): return 1/(1+np.exp(-np.clip(x,-500,500)))

# Tiny network: 2 -> 3 -> 1 (small enough to inspect every weight)
w1 = np.array([[0.5, -0.3, 0.8], [0.2, 0.7, -0.4]])
b1 = np.array([0.1, -0.1, 0.2])
w2 = np.array([[0.6], [-0.5], [0.3]])
b2 = np.array([0.1])

x = np.array([1.0, 0.5])  # input
target = 1.0
lr = 0.5

print("=== Forward Pass ===")
z1 = x @ w1 + b1
a1 = sigmoid(z1)
z2 = a1 @ w2 + b2
output = sigmoid(z2)
loss = (target - output)**2

print(f"Input: {x}")
print(f"Hidden (before activation): {z1.round(3)}")
print(f"Hidden (after sigmoid):     {a1.round(3)}")
print(f"Output: {output[0]:.4f}")
print(f"Target: {target}")
print(f"Loss:   {loss[0]:.4f}")

print(f"\\n=== Backward Pass (Backpropagation) ===")
# Output layer gradients
d_output = 2 * (output - target) * output * (1 - output)
d_w2 = a1.reshape(-1,1) * d_output
d_b2 = d_output

print(f"Output gradient: {d_output[0]:.4f}")
print(f"Weight gradients (w2): {d_w2.ravel().round(4)}")

# Hidden layer gradients
d_hidden = (d_output @ w2.T) * a1 * (1 - a1)
d_w1 = x.reshape(-1,1) @ d_hidden.reshape(1,-1)
d_b1 = d_hidden

print(f"Hidden gradients: {d_hidden.round(4)}")
print(f"Weight gradients (w1):\\n{d_w1.round(4)}")

# Update weights
w2_new = w2 - lr * d_w2
w1_new = w1 - lr * d_w1.reshape(w1.shape)

print(f"\\n=== Weight Updates ===")
print(f"w2 old: {w2.ravel().round(3)} -> new: {w2_new.ravel().round(3)}")
print(f"Change: {(w2_new - w2).ravel().round(4)}")

# Verify improvement
a1_new = sigmoid(x @ w1_new + b1)
output_new = sigmoid(a1_new @ w2_new + b2)
loss_new = (target - output_new)**2
print(f"\\n=== After Update ===")
print(f"Output: {output[0]:.4f} -> {output_new[0]:.4f}")
print(f"Loss:   {loss[0]:.4f} -> {loss_new[0]:.4f}")
print(f"Improvement: {((loss[0]-loss_new[0])/loss[0]*100):.1f}%")`,
      challenge: 'Run the same update 20 times in a loop (applying the weight update each iteration). Plot how the loss and output change over iterations. How many iterations does it take for the output to reach 0.95 (close to the target of 1.0)?',
      successHint: 'You traced every gradient by hand through a small network. In production networks with millions of parameters, this exact process runs on GPUs billions of times. The math is the same — just scaled up massively. Understanding backpropagation at this level means you truly understand how AI learns.',
    },
    {
      title: 'Training curves and overfitting — knowing when to stop',
      concept: `Training a neural network is like studying for an exam. Study too little: you do not know the material (underfitting). Study too much by memorising specific questions: you cannot handle new questions (overfitting). The sweet spot is **generalisation** — learning the underlying patterns, not the specific examples.

We detect overfitting by splitting data into **training** and **validation** sets. We train on the training set and measure performance on the validation set (which the network never sees during training).

- If training loss decreases but validation loss increases: **overfitting** (memorising)
- If both decrease together: **learning** (generalising)
- If neither decreases: **underfitting** (network too small or learning rate wrong)

The training curve — loss plotted against epochs — tells you exactly when to stop training.`,
      analogy: 'A student who memorises every question in the textbook gets 100% on a practice test but fails the real exam because the questions are different. A student who understands the concepts gets 85% on both. The training set is the practice test. The validation set is the real exam. Overfitting is memorisation without understanding.',
      storyConnection: 'Ravana\'s heads each trained for millennia. But they trained on the past — ancient texts, historical battles, known patterns. When Rama brought a new, unprecedented strategy (fighting with divine weapons and the unwavering support of Hanuman\'s army), Ravana\'s training did not generalise. He had overfit on historical patterns and could not adapt to novel threats.',
      checkQuestion: 'Your training loss is 0.01 but your validation loss is 0.45. Is this underfitting, good fit, or overfitting?',
      checkAnswer: 'Overfitting. The huge gap between training loss (0.01 — nearly perfect on training data) and validation loss (0.45 — poor on new data) means the network memorised the training examples but did not learn the underlying patterns. Solutions: add regularisation, get more data, or use a smaller network.',
      codeIntro: 'Train a network, plot training vs validation loss, and detect overfitting.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Overfitting Detection ===
np.random.seed(42)

# Generate noisy data
n = 200
X = np.random.randn(n, 2)
y = ((X[:,0]**2 + X[:,1]**2) < 1.5).astype(float).reshape(-1,1)

# Split: 70% train, 30% validation
split = int(0.7 * n)
X_train, X_val = X[:split], X[split:]
y_train, y_val = y[:split], y[split:]

# Large network (will overfit)
def sigmoid(z): return 1/(1+np.exp(-np.clip(z,-500,500)))
w1 = np.random.randn(2,32)*0.3; b1 = np.zeros((1,32))
w2 = np.random.randn(32,16)*0.3; b2 = np.zeros((1,16))
w3 = np.random.randn(16,1)*0.3; b3 = np.zeros((1,1))
lr = 0.3

train_losses, val_losses = [], []
for epoch in range(2000):
    # Forward on TRAINING data
    h1 = np.maximum(0, X_train@w1+b1)
    h2 = np.maximum(0, h1@w2+b2)
    out = sigmoid(h2@w3+b3)
    train_loss = -np.mean(y_train*np.log(out+1e-8)+(1-y_train)*np.log(1-out+1e-8))

    # Forward on VALIDATION data (no weight update!)
    v1 = np.maximum(0, X_val@w1+b1)
    v2 = np.maximum(0, v1@w2+b2)
    v_out = sigmoid(v2@w3+b3)
    val_loss = -np.mean(y_val*np.log(v_out+1e-8)+(1-y_val)*np.log(1-v_out+1e-8))

    train_losses.append(train_loss)
    val_losses.append(val_loss)

    # Backward (train only)
    d3 = out - y_train
    d2 = (d3@w3.T)*(h2>0)
    d1 = (d2@w2.T)*(h1>0)
    w3-=lr*h2.T@d3/split; b3-=lr*d3.mean(0,keepdims=True)
    w2-=lr*h1.T@d2/split; b2-=lr*d2.mean(0,keepdims=True)
    w1-=lr*X_train.T@d1/split; b1-=lr*d1.mean(0,keepdims=True)

# Plot
fig, axes = plt.subplots(1, 2, figsize=(13, 5))
axes[0].plot(train_losses, color='#60a5fa', linewidth=1.5, label='Train')
axes[0].plot(val_losses, color='#ef4444', linewidth=1.5, label='Validation')
axes[0].set_title('Training Curves (Overfitting Visible)')
axes[0].set_xlabel('Epoch'); axes[0].set_ylabel('Loss')
axes[0].legend(); axes[0].grid(alpha=0.3)

# Mark where validation loss starts increasing
val_min_idx = np.argmin(val_losses)
axes[0].axvline(val_min_idx, color='#22c55e', linestyle='--',
                label=f'Best: epoch {val_min_idx}')
axes[0].legend()

# Accuracy comparison
train_acc = np.mean((out>0.5)==y_train)*100
val_acc = np.mean((v_out>0.5)==y_val)*100
axes[1].bar(['Train', 'Validation'], [train_acc, val_acc],
            color=['#60a5fa', '#ef4444'])
axes[1].set_title('Accuracy Gap = Overfitting')
axes[1].set_ylabel('Accuracy (%)'); axes[1].set_ylim(0,105)
for i, v in enumerate([train_acc, val_acc]):
    axes[1].text(i, v+2, f'{v:.0f}%', ha='center', fontweight='bold')

plt.tight_layout(); plt.show()
print(f"Train acc: {train_acc:.0f}% | Val acc: {val_acc:.0f}%")
print(f"Best epoch (lowest val loss): {val_min_idx}")
print(f"Overfitting after epoch ~{val_min_idx}")`,
      challenge: 'Add L2 regularisation: add 0.001 * (sum of all weights squared) to the loss, and add 0.001 * weights to each gradient update. Does this reduce the gap between training and validation loss? This is called "weight decay" — it prevents any single weight from growing too large.',
      successHint: 'The training curve is the most important diagnostic tool in machine learning. It tells you if you are underfitting (need more capacity), overfitting (need regularisation), or just right. Always plot it. Always check validation loss. Never trust training loss alone.',
    },
  ];

  const diagrams = [RavanaNeuralNetDiagram, null, null, null, null, null];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Neural networks, backpropagation, and training</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises build neural networks from scratch in Python. Click to start.</p>
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
            diagram={diagrams[i] ? createElement(diagrams[i]!) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
