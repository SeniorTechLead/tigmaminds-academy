import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import AngulimalaNeuroplasticityDiagram from '../diagrams/AngulimalaNeuroplasticityDiagram';
import AngulimalaHabitPathwayDiagram from '../diagrams/AngulimalaHabitPathwayDiagram';
import AngulimalaFMRIDiagram from '../diagrams/AngulimalaFMRIDiagram';
import AngulimalaReinforcementDiagram from '../diagrams/AngulimalaReinforcementDiagram';
import NeuronDiagram from '../diagrams/NeuronDiagram';
import NeuralNetworkDiagram from '../diagrams/NeuralNetworkDiagram';

export default function AngulimalaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'A multi-layer neuron network — from single cells to circuits',
      concept: `In Level 1, you built a single neuron. But real brains have 86 billion neurons connected in layers. A signal enters through sensory neurons, passes through **hidden layers** of processing neurons, and exits through motor neurons that control behaviour.

The key advance: **hidden layers can detect patterns that single neurons cannot**. A single neuron can only draw a straight line between "fire" and "don’t fire." Two layers can detect curves. Three layers can detect any shape.

This is why Angulimala’s transformation was possible. His brain did not just change one connection — entire networks of neurons reorganised, with hidden layers learning new patterns of association.

The code builds a 3-layer network: input layer (stimuli), hidden layer (processing), output layer (behaviour). We use matrix multiplication to propagate signals through all layers at once.`,
      analogy: 'A single neuron is like a security guard who checks one thing: "Is this person on the guest list?" A network of neurons is like an entire security system: cameras, facial recognition, ID scanners, and human guards all working together. The system can make nuanced decisions that no single component could make alone.',
      storyConnection: 'Angulimala’s initial reaction to seeing a person was a single-layer response: stimulus → attack. The Buddha trained him to insert hidden layers of processing: stimulus → recognise their humanity → feel empathy → choose kindness. More layers means more nuanced, considered responses.',
      checkQuestion: 'Why do deeper networks (more hidden layers) learn more complex patterns?',
      checkAnswer: 'Each layer builds on the previous one’s output. Layer 1 might detect edges. Layer 2 combines edges into shapes. Layer 3 combines shapes into objects. Each additional layer adds a level of abstraction. This is called hierarchical feature learning and it mirrors how the brain’s visual cortex works — from simple cells (detecting lines) to complex cells (detecting faces).',
      codeIntro: 'Build a 3-layer neural network and propagate a signal through it.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def sigmoid(x):
    """Activation function: squashes any number to 0-1 range."""
    return 1 / (1 + np.exp(-x))

# Network architecture: 3 inputs -> 4 hidden -> 2 outputs
np.random.seed(42)

# Random initial weights (like an untrained brain)
W1 = np.random.randn(3, 4) * 0.5  # input -> hidden
W2 = np.random.randn(4, 2) * 0.5  # hidden -> output

# Input: [aggression_signal, compassion_signal, context_signal]
input_before = np.array([0.9, 0.1, 0.5])  # high aggression
input_after  = np.array([0.1, 0.9, 0.5])  # high compassion

def forward(inputs, W1, W2):
    """Pass signal through 3-layer network."""
    hidden = sigmoid(inputs @ W1)     # input -> hidden layer
    output = sigmoid(hidden @ W2)     # hidden -> output layer
    return hidden, output

hidden_b, output_b = forward(input_before, W1, W2)
hidden_a, output_a = forward(input_after, W1, W2)

# Output neurons: [violence_probability, kindness_probability]
labels = ['Violence', 'Kindness']
x = np.arange(2)
width = 0.35

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

axes[0].bar(x, output_b, width, color=['#ef4444', '#10b981'])
axes[0].set_title('Output: High Aggression Input', fontsize=12)
axes[0].set_xticks(x); axes[0].set_xticklabels(labels)
axes[0].set_ylim(0, 1); axes[0].set_ylabel('Activation', fontsize=11)
axes[0].grid(axis='y', alpha=0.3)

axes[1].bar(x, output_a, width, color=['#ef4444', '#10b981'])
axes[1].set_title('Output: High Compassion Input', fontsize=12)
axes[1].set_xticks(x); axes[1].set_xticklabels(labels)
axes[1].set_ylim(0, 1)
axes[1].grid(axis='y', alpha=0.3)

plt.suptitle('3-Layer Network: Different Inputs, Different Outputs', fontsize=14)
plt.tight_layout()
plt.show()

print("Hidden layer activations (before):", np.round(hidden_b, 2))
print("Hidden layer activations (after): ", np.round(hidden_a, 2))
print()
print("The hidden layer transforms the raw input into a richer")
print("representation that the output layer can use for decisions.")`,
      challenge: 'Add a third hidden layer with 3 neurons (so the architecture becomes 3→4→3→2). How does this change the outputs? Does the network become more or less sensitive to input changes?',
      successHint: 'You just built a feedforward neural network — the same architecture used in real AI systems. The sigmoid function, matrix multiplication, and layered structure are the building blocks of deep learning. Your brain runs a biological version of this every millisecond.',
    },
    {
      title: 'Backpropagation — how the network learns from mistakes',
      concept: `In Level 1, we used Hebb’s rule (fire together, wire together). But modern neural networks use a more powerful algorithm: **backpropagation**. The idea:

1. Run an input through the network (forward pass)
2. Compare the output to the desired answer
3. Calculate the **error** (how wrong was it?)
4. Send the error backward through the network, adjusting weights to reduce the error

The weight update rule: \`weight -= learning_rate × gradient\`

The **gradient** tells you which direction to adjust each weight to reduce error. It is calculated using calculus (the chain rule), but the intuition is simple: if a weight contributed to the error, reduce it; if it helped produce the right answer, increase it.

This is a more targeted version of what happened in Angulimala’s brain. When an action led to suffering (error), his brain weakened the pathways that produced it. When an action led to peace (correct output), those pathways strengthened.`,
      analogy: 'Imagine you are throwing darts blindfolded. After each throw, a friend tells you "too far left" or "a bit high." You adjust your aim based on that feedback. Backpropagation is the AI version: the error signal tells each weight in the network which direction to adjust. After many throws (training examples), you hit the bullseye consistently.',
      storyConnection: 'The Buddha served as Angulimala’s "error signal." When Angulimala fell back into old patterns, the Buddha gently pointed out the mismatch between his actions and his goal. When Angulimala acted with compassion, the resulting peace confirmed the correct path. Each correction refined his internal weights.',
      checkQuestion: 'Why is backpropagation more efficient than Hebb’s rule?',
      checkAnswer: 'Hebb’s rule only strengthens connections between co-active neurons — it does not know which connections actually caused the output. Backpropagation traces the error back through every layer, assigning blame precisely. This means it can adjust weights in hidden layers that are far from the output, fixing problems that Hebb’s rule would never detect. It is the difference between "practice makes permanent" (Hebb) and "practice makes perfect" (backprop).',
      codeIntro: 'Train a network using backpropagation to learn compassion over violence.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def sigmoid_derivative(x):
    return x * (1 - x)

np.random.seed(42)

# Training data: [aggression, compassion, mindfulness] -> [should choose kindness]
X = np.array([
    [0.9, 0.1, 0.1],  # aggressive state
    [0.1, 0.9, 0.8],  # compassionate state
    [0.5, 0.5, 0.3],  # ambiguous state
    [0.2, 0.8, 0.9],  # mindful state
])
y = np.array([[0], [1], [0.5], [1]])  # target: kindness probability

# Weights
W1 = np.random.randn(3, 4) * 0.5
W2 = np.random.randn(4, 1) * 0.5
lr = 0.5
losses = []

for epoch in range(500):
    # Forward pass
    hidden = sigmoid(X @ W1)
    output = sigmoid(hidden @ W2)

    # Error
    error = y - output
    loss = np.mean(error ** 2)
    losses.append(loss)

    # Backward pass (backpropagation)
    d_output = error * sigmoid_derivative(output)
    d_hidden = d_output @ W2.T * sigmoid_derivative(hidden)

    # Update weights
    W2 += lr * hidden.T @ d_output
    W1 += lr * X.T @ d_hidden

plt.figure(figsize=(10, 5))
plt.plot(losses, linewidth=2.5, color='#8b5cf6')
plt.xlabel('Training epoch', fontsize=12)
plt.ylabel('Mean squared error', fontsize=12)
plt.title('Backpropagation: Error Decreases With Training', fontsize=14)
plt.grid(alpha=0.3)
plt.show()

print("Final predictions:")
for i, (inp, target) in enumerate(zip(X, y)):
    pred = sigmoid(sigmoid(inp @ W1) @ W2)[0]
    print(f"  Input {inp} -> Predicted: {pred:.2f} (Target: {target[0]:.1f})")
print()
print(f"Final loss: {losses[-1]:.4f}")
print("The network learned to map emotional states to kind behaviour")
print("through 500 cycles of error correction — like 500 days of practice.")`,
      challenge: 'Add a new training example: [0.7, 0.3, 0.1] -> [0] (aggressive with low mindfulness). Does the network correctly predict violence for this case? How many epochs does it take to learn all 5 examples accurately?',
      successHint: 'Backpropagation is the most important algorithm in modern AI. It powers everything from ChatGPT to self-driving cars. You just implemented it from scratch — the forward pass, the error calculation, the backward pass, and the weight update. This is what runs billions of times when training large language models.',
    },
    {
      title: 'Synaptic plasticity types — LTP and LTD',
      concept: `Hebb’s rule and backpropagation are abstractions. In the real brain, the mechanisms are called **Long-Term Potentiation (LTP)** and **Long-Term Depression (LTD)**.

**LTP** = a synapse gets stronger when repeatedly stimulated. The post-synaptic neuron inserts more receptors, making it more sensitive to the neurotransmitter. This is the biological basis of learning.

**LTD** = a synapse gets weaker when it is active but the post-synaptic neuron is not. The receptors are removed. This is the biological basis of forgetting or un-learning.

LTP was discovered in 1973 by Tim Bliss and Terje Lømo. They stimulated a rabbit’s hippocampus with high-frequency electrical pulses and found that the synapse’s response was amplified for hours or days afterward.

The code models LTP and LTD mathematically, showing how synapse strength changes depending on the timing of pre-synaptic and post-synaptic activity.`,
      analogy: 'Think of a synapse like a road. LTP is like widening the road because traffic is heavy (more receptors = wider road = faster signal). LTD is like letting a road crumble from lack of use (fewer receptors = narrower road = weaker signal). The brain is constantly doing road construction based on traffic patterns.',
      storyConnection: 'Angulimala’s violent pathways underwent LTD: without daily activation, receptors were gradually removed and those synapses weakened. His new compassion pathways underwent LTP: daily practice triggered receptor insertion and the synapses grew stronger. The molecular mechanism took weeks to months — matching the story’s timeline.',
      checkQuestion: 'If LTP makes learning permanent, why do we forget things?',
      checkAnswer: 'LTP has phases. Early LTP (lasting minutes to hours) involves temporary changes like phosphorylation of existing receptors. Late LTP (lasting days to years) requires gene expression and synthesis of new proteins to build new receptors. If the stimulation is not repeated, late LTP never kicks in and the memory fades. This is why cramming before an exam produces temporary recall but spaced repetition produces lasting memory.',
      codeIntro: 'Model LTP and LTD: how synapse strength depends on stimulation patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

time = np.linspace(0, 120, 500)  # minutes

# LTP: high-frequency stimulation at t=20
# Synapse strength jumps up and slowly settles
def ltp_response(t, stim_time=20):
    mask = t >= stim_time
    base = np.ones_like(t)
    # Rapid rise then gradual settling to elevated baseline
    response = np.where(mask,
        1.0 + 0.8 * np.exp(-0.01 * (t - stim_time)) + 0.5,
        1.0)
    return response

# LTD: low-frequency stimulation at t=20
def ltd_response(t, stim_time=20):
    mask = t >= stim_time
    response = np.where(mask,
        1.0 - 0.4 * (1 - np.exp(-0.02 * (t - stim_time))),
        1.0)
    return response

ltp = ltp_response(time)
ltd = ltd_response(time)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(time, ltp, linewidth=2.5, color='#10b981')
ax1.axvline(20, color='gold', linewidth=2, linestyle='--', label='Stimulation')
ax1.axhline(1.0, color='gray', linewidth=0.5, linestyle=':')
ax1.fill_between(time, 1.0, ltp, alpha=0.15, color='#10b981')
ax1.set_title('LTP: Long-Term Potentiation', fontsize=13)
ax1.set_xlabel('Time (minutes)', fontsize=11)
ax1.set_ylabel('Synapse strength', fontsize=11)
ax1.set_ylim(0.5, 2.5)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)
ax1.text(70, 2.2, 'Synapse stays stronger\
for hours to days',
         fontsize=10, ha='center', color='#10b981')

ax2.plot(time, ltd, linewidth=2.5, color='#ef4444')
ax2.axvline(20, color='gold', linewidth=2, linestyle='--', label='Stimulation')
ax2.axhline(1.0, color='gray', linewidth=0.5, linestyle=':')
ax2.fill_between(time, ltd, 1.0, alpha=0.15, color='#ef4444')
ax2.set_title('LTD: Long-Term Depression', fontsize=13)
ax2.set_xlabel('Time (minutes)', fontsize=11)
ax2.set_ylim(0.5, 2.5)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)
ax2.text(70, 0.7, 'Synapse weakens\
from disuse',
         fontsize=10, ha='center', color='#ef4444')

plt.suptitle('The Two Sides of Neuroplasticity', fontsize=14)
plt.tight_layout()
plt.show()

print("LTP = practice makes stronger (compassion pathways)")
print("LTD = disuse makes weaker (violence pathways)")
print()
print("Key: LTP requires repeated, high-frequency activation.")
print("One-time effort is not enough — Angulimala practised daily.")`,
      challenge: 'Model what happens with "spaced repetition" — multiple LTP stimulations at t=20, t=50, and t=80. Does the synapse reach a higher plateau than a single stimulation? This explains why distributed practice beats cramming.',
      successHint: 'LTP and LTD are the molecular mechanisms behind everything you have been modelling. Every weight change in an AI neural network is an abstraction of what LTP and LTD do with receptors and neurotransmitters. The gap between brain science and computer science is smaller than most people think.',
    },
    {
      title: 'Spike-timing dependent plasticity — the order matters',
      concept: `Hebb said "fire together, wire together." But modern research added a crucial detail: **the order matters**.

**STDP (Spike-Timing Dependent Plasticity)** says:
- If neuron A fires **just before** neuron B, the connection A→B gets stronger (LTP). A seems to cause B.
- If neuron A fires **just after** neuron B, the connection A→B gets weaker (LTD). A seems irrelevant to B.

The time window is tiny: about ±20 milliseconds. The closer the spikes, the stronger the effect.

This is how the brain learns **causation**, not just correlation. It is also the basis of Pavlov’s conditioning: the bell rings (A fires) just before food arrives (B fires), so the brain strengthens bell→salivation.

For Angulimala: seeing a person (A) followed immediately by a kind thought (B) strengthened seeing→kindness. The timing had to be right.`,
      analogy: 'Imagine you touch a hot stove and feel pain 0.1 seconds later. Your brain connects touch→pain because A (touch) came before B (pain). But if the pain came first and you touched the stove second, your brain would NOT connect them — the sequence is backwards. STDP is the brain’s way of learning cause and effect from timing alone.',
      storyConnection: 'The Buddha’s instructions were precise: when you see a person, IMMEDIATELY wish them well. Not five minutes later — immediately. This timing constraint ensured that the "see person" spike and the "kindness" spike occurred within the STDP window, maximising the strengthening of the connection.',
      checkQuestion: 'Why does the brain care about spike order and not just co-occurrence?',
      checkAnswer: 'Because causation has a direction. "Thunder after lightning" means lightning warns of thunder. "Lightning after thunder" is meaningless. The brain needs to predict future events from current ones, so it only strengthens connections where the first neuron’s firing predicts the second’s. This is why correlation is not causation — the brain implicitly understands this through STDP.',
      codeIntro: 'Plot the STDP learning window: how timing determines strengthening vs weakening.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Time difference: positive = pre before post, negative = post before pre
dt = np.linspace(-50, 50, 500)  # milliseconds

# STDP function
def stdp(dt, A_plus=1.0, A_minus=0.6, tau_plus=20, tau_minus=20):
    result = np.where(dt > 0,
        A_plus * np.exp(-dt / tau_plus),     # LTP: pre before post
        -A_minus * np.exp(dt / tau_minus))   # LTD: post before pre
    result[dt == 0] = 0
    return result

dw = stdp(dt)

plt.figure(figsize=(10, 5))
plt.fill_between(dt[dt > 0], 0, dw[dt > 0], alpha=0.2, color='#10b981')
plt.fill_between(dt[dt <= 0], 0, dw[dt <= 0], alpha=0.2, color='#ef4444')
plt.plot(dt, dw, linewidth=2.5, color='#8b5cf6')
plt.axhline(0, color='gray', linewidth=1)
plt.axvline(0, color='gray', linewidth=1, linestyle=':')

plt.annotate('LTP: Pre fires BEFORE Post\
(connection strengthens)',
    xy=(10, 0.6), fontsize=10, color='#10b981', fontweight='bold')
plt.annotate('LTD: Pre fires AFTER Post\
(connection weakens)',
    xy=(-45, -0.4), fontsize=10, color='#ef4444', fontweight='bold')

plt.xlabel('Time difference: t_post - t_pre (ms)', fontsize=12)
plt.ylabel('Weight change (Δw)', fontsize=12)
plt.title('STDP: Spike-Timing Dependent Plasticity', fontsize=14)
plt.grid(alpha=0.3)
plt.show()

# Demonstrate with a specific example
dt_examples = [-30, -10, -2, 2, 10, 30]
print("Examples:")
for t in dt_examples:
    change = stdp(np.array([t]))[0]
    direction = "strengthens" if change > 0 else "weakens"
    print(f"  dt = {t:+3d} ms: Δw = {change:+.3f} ({direction})")
print()
print("The closer the timing, the stronger the effect.")
print("This is why the Buddha said 'immediately' — timing matters.")`,
      challenge: 'Change tau_plus to 5 (very narrow window). Now only precisely timed spikes cause learning. This models a brain that requires exact, focused attention for change. What does this tell you about distracted practice vs focused practice?',
      successHint: 'STDP is one of the most elegant findings in neuroscience. A simple timing rule explains how the brain learns causation, how Pavlovian conditioning works, and why focused attention is essential for learning. It also inspires new AI algorithms (spike-timing networks) that are more brain-like than traditional neural networks.',
    },
    {
      title: 'The exploration-exploitation tradeoff in RL',
      concept: `In Level 1 you built an RL agent that used ε-greedy exploration: sometimes it tried random actions (exploration), sometimes it picked the best-known action (exploitation). Now let’s formalise this.

The **exploration-exploitation tradeoff** is one of the deepest problems in both AI and psychology:
- **Exploit**: do what you know works (safe, predictable)
- **Explore**: try something new (risky, but might find something better)

Too much exploitation = you get stuck in suboptimal habits. Too much exploration = you never benefit from what you have learned.

Angulimala’s pre-transformation life was pure exploitation of a bad strategy. The Buddha forced him to explore: try a completely different approach. The initial exploration was painful (the new way felt wrong), but it led to discovering a much better strategy.

The code compares different exploration strategies and shows which ones find the optimal behaviour fastest.`,
      analogy: 'Imagine you eat at the same restaurant every day (exploitation). The food is decent. But there might be an amazing restaurant next door that you have never tried. Going there is exploration — risky (it might be terrible) but potentially rewarding (it might be the best meal of your life). The explore-exploit balance determines whether you find the best restaurant or eat mediocre food forever.',
      storyConnection: 'Angulimala was stuck in exploitation: violence was the only strategy he knew, and it produced some reward (fear = power). The Buddha introduced forced exploration: "Try compassion for 30 days." This was deeply uncomfortable — Angulimala was leaving his "known restaurant" — but it led to discovering a far better reward.',
      checkQuestion: 'Should you always explore more? Why not set exploration to 100%?',
      checkAnswer: 'Pure exploration means you never use what you learn — you try random actions every time and never settle into good behaviour. It is like changing restaurants every single meal: you would never enjoy the benefits of finding a great one. The optimal strategy decays exploration over time (high at first, low later), which is exactly what ε-decay does in RL.',
      codeIntro: 'Compare exploration strategies: fixed, decaying, and no exploration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 3 RL strategies over 200 episodes
episodes = 200
n_actions = 5

# True reward for each action (unknown to agent)
true_rewards = np.array([-0.5, 0.2, 0.8, 0.1, -0.3])  # action 2 is best

def run_agent(epsilon_fn, name):
    q_values = np.zeros(n_actions)
    counts = np.zeros(n_actions)
    total_rewards = []
    cumulative = 0

    for ep in range(episodes):
        eps = epsilon_fn(ep)
        if np.random.random() < eps:
            action = np.random.randint(n_actions)  # explore
        else:
            action = np.argmax(q_values)  # exploit

        reward = true_rewards[action] + np.random.normal(0, 0.1)
        counts[action] += 1
        q_values[action] += (reward - q_values[action]) / counts[action]

        cumulative += reward
        total_rewards.append(cumulative / (ep + 1))

    return total_rewards

# Strategy 1: No exploration (pure exploitation)
no_explore = run_agent(lambda ep: 0.0, "No exploration")

# Strategy 2: Fixed exploration (10%)
fixed = run_agent(lambda ep: 0.1, "Fixed 10%")

# Strategy 3: Decaying exploration (like Angulimala)
decay = run_agent(lambda ep: max(0.01, 1.0 - ep/80), "Decaying")

plt.figure(figsize=(10, 5))
plt.plot(no_explore, linewidth=2, color='#ef4444', label='No exploration (stuck)')
plt.plot(fixed, linewidth=2, color='#f59e0b', label='Fixed 10% exploration')
plt.plot(decay, linewidth=2, color='#10b981', label='Decaying exploration (best)')
plt.axhline(0.8, color='gray', linewidth=1, linestyle=':', label='Optimal (action 2)')

plt.xlabel('Episode', fontsize=12)
plt.ylabel('Average reward per episode', fontsize=12)
plt.title('Exploration-Exploitation: Finding the Best Strategy', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print("No exploration: gets stuck with whatever it tried first")
print("Fixed 10%: finds good actions but wastes 10% on random ones forever")
print("Decaying: explores early, then exploits — best long-term performance")
print()
print("Angulimala's strategy: intense exploration (new life) gradually")
print("settling into exploitation of the best path (daily practice).")`,
      challenge: 'Add a "Boltzmann exploration" strategy where the agent picks actions proportional to their Q-values (using softmax). Compare it to ε-greedy. Which finds the optimal action faster?',
      successHint: 'The explore-exploit tradeoff appears everywhere: in AI, in clinical trials (test new drugs vs use known ones), in business (innovate vs optimise), and in personal growth (try new things vs stick with what works). Angulimala’s story is a case study in optimal exploration strategy.',
    },
    {
      title: 'Temporal difference learning — learning from predictions, not just outcomes',
      concept: `Basic RL waits for the final outcome to learn. But **temporal difference (TD) learning** learns at every step by comparing its prediction of future reward to the actual next-step reward.

The update: \`V(state) += α × [reward + γ·V(next_state) - V(state)]\`

Where:
- α = learning rate
- γ = discount factor (how much future rewards matter)
- The term in brackets is the **TD error** — the surprise signal

TD learning is remarkably similar to how **dopamine** works in the brain. Neuroscientist Wolfram Schultz discovered that dopamine neurons fire when reward is **better than expected** and go silent when reward is **worse than expected**. The dopamine signal IS the TD error.

This means the brain runs TD learning! And Angulimala’s transformation was driven by dopamine signals updating his value estimates for different states and actions.`,
      analogy: 'Imagine walking home from school. You know the route takes 20 minutes. One day, after 5 minutes, you see the road is blocked. You immediately update your estimate: "This is going to take 30 minutes." You did not wait to get home — you updated mid-journey based on new information. That is TD learning: update predictions using predictions, not just final outcomes.',
      storyConnection: 'Each day of Angulimala’s practice was a TD update. He did not need to wait years to see the final result. Each small act of kindness produced a small dopamine signal (better than expected!), which immediately updated his value estimates. The daily "surprises" of peace accumulated into a complete transformation.',
      checkQuestion: 'Why does the discount factor γ matter? What happens if γ = 0?',
      checkAnswer: 'If γ = 0, the agent only cares about immediate reward and ignores all future consequences. This models impulsive behaviour — choosing the candy bar now instead of health later. If γ = 1, the agent values future reward equally to present reward, leading to very long-term planning. Most agents work best with γ between 0.9 and 0.99. Angulimala’s transformation required learning to increase his internal γ — valuing future peace over immediate impulses.',
      codeIntro: 'Implement TD learning and watch value estimates converge.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simple grid: 5 states from "violent" (0) to "peaceful" (4)
n_states = 5
state_names = ['Violent', 'Angry', 'Neutral', 'Calm', 'Peaceful']
rewards = [-1.0, -0.5, 0.0, 0.5, 1.0]  # reward at each state

# Value function: estimated long-term reward from each state
V = np.zeros(n_states)
alpha = 0.1   # learning rate
gamma = 0.9   # discount factor
episodes = 200

v_history = [V.copy()]

for ep in range(episodes):
    # Start in a random state
    state = np.random.randint(n_states)

    for step in range(10):
        # Move toward peaceful with some randomness
        if np.random.random() < 0.7:
            next_state = min(state + 1, n_states - 1)  # step toward peace
        else:
            next_state = max(state - 1, 0)  # slip backward

        reward = rewards[next_state]

        # TD update: V(s) += alpha * [r + gamma * V(s') - V(s)]
        td_error = reward + gamma * V[next_state] - V[state]
        V[state] += alpha * td_error

        state = next_state

    v_history.append(V.copy())

v_history = np.array(v_history)

plt.figure(figsize=(10, 5))
for i in range(n_states):
    plt.plot(v_history[:, i], linewidth=2,
             label=state_names[i])

plt.xlabel('Episode', fontsize=12)
plt.ylabel('Estimated value V(state)', fontsize=12)
plt.title('TD Learning: Value Estimates Converge Over Time', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print("Final value estimates:")
for name, val in zip(state_names, V):
    print(f"  {name:10s}: V = {val:+.2f}")
print()
print("Peaceful states have high value — the agent learns to")
print("seek them. This is exactly what dopamine does in the brain:")
print("it signals 'this state is better than expected.'")`,
      challenge: 'Change gamma to 0.1 (very short-sighted agent). How do the value estimates change? The "Violent" state should have less negative value because the agent does not look far enough ahead to see the consequences.',
      successHint: 'TD learning is one of the great unifications in science: the same algorithm runs in silicon (AI agents) and carbon (your dopamine system). Schultz’s discovery that dopamine encodes TD errors won the field of computational neuroscience and inspired modern RL systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 neuron models and RL fundamentals</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for neural network and RL simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[NeuralNetworkDiagram, AngulimalaNeuroplasticityDiagram, AngulimalaNeuroplasticityDiagram, NeuronDiagram, AngulimalaReinforcementDiagram, AngulimalaReinforcementDiagram][i] ? createElement([NeuralNetworkDiagram, AngulimalaNeuroplasticityDiagram, AngulimalaNeuroplasticityDiagram, NeuronDiagram, AngulimalaReinforcementDiagram, AngulimalaReinforcementDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
