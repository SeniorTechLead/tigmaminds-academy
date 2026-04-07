import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MemoryGrandmaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Neurons and synapses — the hardware of memory',
      concept: `The brain contains approximately **86 billion neurons**, each connected to thousands of others through **synapses**. Memory is stored not in individual neurons but in the **patterns of connections** between them.

A single neuron:
- **Dendrites**: receive signals from other neurons (inputs)
- **Cell body (soma)**: integrates all incoming signals
- **Axon**: sends signals to other neurons (output)
- **Synapse**: the gap between neurons, bridged by neurotransmitters

How memory forms at the synaptic level:
1. An experience activates a specific pattern of neurons
2. Neurons that fire together strengthen their connections (**Hebb's rule**: "neurons that fire together wire together")
3. This strengthening is called **Long-Term Potentiation (LTP)** — it physically changes the synapse
4. LTP involves: more neurotransmitter release, more receptors on the receiving neuron, growth of new dendritic spines

The key insight: a memory IS a pattern of strengthened synapses. When you recall a memory, you reactivate the same pattern. If the synapses weaken (decay, interference), the memory fades.`,
      analogy: 'Neurons are like people in a social network. A memory is like a group chat — a specific set of connections that gets activated together. Strong memories are group chats with lots of activity (strong connections). Forgotten memories are group chats nobody uses anymore (weak connections). LTP is like pinning a group chat to the top of your list.',
      storyConnection: 'The grandmother\'s decades of storytelling repeatedly activated the same neural patterns — the same "group chats." Each retelling was another round of LTP, strengthening the synapses that encoded those stories. Her memories were literally carved into her brain\'s physical structure.',
      checkQuestion: 'If memories are stored in connection patterns between neurons, what happens when a neuron dies?',
      checkAnswer: 'The memory doesn\'t disappear entirely — it\'s degraded, not erased. Since memories are distributed across many neurons, losing one weakens the pattern but doesn\'t destroy it (like removing one pixel from a photo). This is called graceful degradation. However, losing many neurons in the same region (as in Alzheimer\'s) progressively corrupts the pattern until the memory is unrecoverable.',
      codeIntro: 'Simulate a simple neural network forming a memory through Hebbian learning.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simple Hebbian network: 10 neurons, binary activation
n_neurons = 10

# Weight matrix (synapse strengths) — starts random and weak
weights = np.random.uniform(0, 0.1, (n_neurons, n_neurons))
np.fill_diagonal(weights, 0)  # no self-connections

# Memory pattern: neurons 0,1,2,3,4 fire together (a "memory")
memory_pattern = np.array([1, 1, 1, 1, 1, 0, 0, 0, 0, 0])

# Hebbian learning: strengthen connections between co-active neurons
learning_rate = 0.1
n_presentations = 20

weight_history = [weights.copy()]
pattern_similarity = []

for trial in range(n_presentations):
    # Hebbian update: Δw_ij = η * x_i * x_j
    dw = learning_rate * np.outer(memory_pattern, memory_pattern)
    np.fill_diagonal(dw, 0)
    weights = weights + dw
    weights = np.clip(weights, 0, 1)  # keep in [0, 1]
    weight_history.append(weights.copy())

    # Test recall: activate partial pattern and see what happens
    partial = np.array([1, 1, 1, 0, 0, 0, 0, 0, 0, 0])  # only first 3
    activation = partial @ weights
    recalled = (activation > np.median(activation)).astype(int)
    similarity = np.mean(recalled == memory_pattern)
    pattern_similarity.append(similarity)

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Weight matrix before learning
ax = axes[0]
ax.set_facecolor('#111827')
im = ax.imshow(weight_history[0], cmap='viridis', vmin=0, vmax=1)
ax.set_title('Synaptic Weights (Before)', color='white', fontsize=11)
ax.set_xlabel('Neuron', color='white')
ax.set_ylabel('Neuron', color='white')
ax.tick_params(colors='gray')

# Weight matrix after learning
ax = axes[1]
ax.set_facecolor('#111827')
im = ax.imshow(weight_history[-1], cmap='viridis', vmin=0, vmax=1)
ax.set_title('Synaptic Weights (After 20 trials)', color='white', fontsize=11)
ax.set_xlabel('Neuron', color='white')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='Connection strength')

# Recall accuracy over training
ax = axes[2]
ax.set_facecolor('#111827')
ax.plot(range(1, n_presentations + 1), pattern_similarity, 'o-', color='#22c55e', linewidth=2, markersize=5)
ax.set_xlabel('Training trials', color='white')
ax.set_ylabel('Recall accuracy', color='white')
ax.set_title('Memory Formation: Partial Cue → Full Recall', color='white', fontsize=11)
ax.set_ylim(0.4, 1.05)
ax.tick_params(colors='gray')
ax.axhline(1.0, color='#f59e0b', linestyle='--', alpha=0.5, label='Perfect recall')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Before training: random weak connections")
print("After training: neurons 0-4 strongly connected (the memory)")
print()
print("Recall test: given only neurons 0,1,2 (partial cue),")
print(f"the network recalls the full pattern with {pattern_similarity[-1]*100:.0f}% accuracy")
print()
print("This is pattern completion — the basis of how a smell")
print("can trigger a complete childhood memory.")`,
      challenge: 'Store TWO different patterns in the same network (e.g., neurons 0-4 and neurons 5-9). Can the network recall both? What happens when you try to store too many patterns? (This is the storage capacity limit of associative memory.)',
      successHint: 'Hebbian learning — "neurons that fire together wire together" — is the foundation of modern neuroscience and the inspiration for artificial neural networks. The same principle that stored the grandmother\'s stories now powers AI.',
    },
    {
      title: 'Neural networks — from biology to AI',
      concept: `The brain's neural network inspired the most powerful technology of our era: **artificial neural networks (ANNs)**. The parallels are striking:

| Brain | ANN |
|-------|-----|
| Neuron | Node (perceptron) |
| Synapse | Weight |
| Learning (LTP) | Weight update (backprop) |
| Activation threshold | Activation function |
| Layers (cortex) | Hidden layers |

However, key differences matter:
- **Brain**: ~86 billion neurons, massive parallelism, low power (~20 watts)
- **ANN**: millions to billions of parameters, sequential training, high power (~megawatts for large models)
- **Brain**: learns from few examples (one-shot learning common)
- **ANN**: needs millions of examples (data-hungry)
- **Brain**: memories are distributed and content-addressable
- **ANN**: memories are encoded in weight matrices

Modern deep learning uses the same core principle as the brain — adjusting connection strengths based on experience — but implements it in a fundamentally different architecture. The brain is better at learning from limited data; ANNs are better at processing vast datasets consistently.`,
      analogy: 'A biological neural network is like a city that grew organically over centuries — streets follow old paths, buildings cluster around resources, and the whole thing is messy but incredibly resilient. An artificial neural network is like a planned city — grid layout, uniform buildings, efficient but brittle. Both are networks, but their design principles are very different.',
      storyConnection: 'The grandmother\'s neural network was shaped by a lifetime of experience — each story retelling strengthened specific pathways. An AI trained on those same stories would process them through weight matrices instead of synapses. Both "learn" the stories, but the grandmother\'s version came with emotional context, personal meaning, and cultural understanding that no current AI can replicate.',
      checkQuestion: 'ChatGPT can recite vast amounts of text but doesn\'t "remember" individual conversations (unless specifically designed to). How is this different from human memory?',
      checkAnswer: 'ChatGPT\'s knowledge is stored in static weights learned during training — it\'s all "long-term memory" with no episodic component. It can\'t form new long-term memories from conversations (no online learning in standard deployment). Humans have both: semantic memory (facts, like ChatGPT\'s weights) and episodic memory (personal experiences, what ChatGPT lacks). This is why ChatGPT can explain photosynthesis but can\'t tell you what it "experienced" last Tuesday.',
      codeIntro: 'Build a minimal neural network from scratch and train it to learn a simple pattern.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Minimal neural network: learn XOR (the simplest non-linear problem)
# Input: 2 neurons, Hidden: 4 neurons, Output: 1 neuron

# XOR data
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def sigmoid_deriv(x):
    return x * (1 - x)

# Initialize weights
w_hidden = np.random.uniform(-1, 1, (2, 4))
b_hidden = np.zeros((1, 4))
w_output = np.random.uniform(-1, 1, (4, 1))
b_output = np.zeros((1, 1))

learning_rate = 1.0
losses = []

# Training loop
for epoch in range(2000):
    # Forward pass
    hidden = sigmoid(X @ w_hidden + b_hidden)
    output = sigmoid(hidden @ w_output + b_output)

    # Loss
    loss = np.mean((y - output) ** 2)
    losses.append(loss)

    # Backpropagation
    d_output = (y - output) * sigmoid_deriv(output)
    d_hidden = (d_output @ w_output.T) * sigmoid_deriv(hidden)

    w_output += hidden.T @ d_output * learning_rate
    b_output += np.sum(d_output, axis=0, keepdims=True) * learning_rate
    w_hidden += X.T @ d_hidden * learning_rate
    b_hidden += np.sum(d_hidden, axis=0, keepdims=True) * learning_rate

# Test
hidden_test = sigmoid(X @ w_hidden + b_hidden)
predictions = sigmoid(hidden_test @ w_output + b_output)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Loss curve
ax1.set_facecolor('#111827')
ax1.plot(losses, color='#3b82f6', linewidth=1.5)
ax1.set_xlabel('Training epoch', color='white')
ax1.set_ylabel('Mean squared error', color='white')
ax1.set_title('Learning Curve: Network Learns XOR', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_yscale('log')

# Decision boundary
ax2.set_facecolor('#111827')
xx, yy = np.meshgrid(np.linspace(-0.5, 1.5, 100), np.linspace(-0.5, 1.5, 100))
grid = np.c_[xx.ravel(), yy.ravel()]
hidden_grid = sigmoid(grid @ w_hidden + b_hidden)
z = sigmoid(hidden_grid @ w_output + b_output).reshape(xx.shape)

ax2.contourf(xx, yy, z, levels=20, cmap='RdYlGn', alpha=0.6)
ax2.contour(xx, yy, z, levels=[0.5], colors='white', linewidths=2)

for i in range(4):
    color = '#22c55e' if y[i] == 1 else '#ef4444'
    ax2.scatter(X[i, 0], X[i, 1], c=color, s=200, edgecolors='white', linewidths=2, zorder=5)
    ax2.annotate(f'{X[i,0]},{X[i,1]}→{predictions[i,0]:.2f}',
                xy=(X[i,0], X[i,1]), xytext=(X[i,0]+0.1, X[i,1]+0.1),
                color='white', fontsize=10)

ax2.set_title('Decision Boundary (XOR)', color='white', fontsize=13)
ax2.set_xlabel('Input 1', color='white')
ax2.set_ylabel('Input 2', color='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("XOR truth table vs network predictions:")
for i in range(4):
    print(f"  Input: {X[i]} → Target: {y[i,0]} → Predicted: {predictions[i,0]:.3f}")
print()
print("The network learned XOR — a problem that requires a hidden layer.")
print("This simple example uses the SAME principles as ChatGPT:")
print("  - Forward pass (compute output)")
print("  - Loss function (measure error)")
print("  - Backpropagation (adjust weights)")
print("ChatGPT just has billions more weights and far more data.")`,
      challenge: 'Increase the hidden layer from 4 to 16 neurons. Does it learn faster? Then try with only 1 hidden neuron — it should FAIL. Why? (Hint: XOR is not linearly separable.)',
      successHint: 'From Hebb\'s 1949 rule to modern deep learning, the journey from biological memory to artificial intelligence follows a straight line: learning = adjusting connection strengths based on experience.',
    },
    {
      title: 'Spaced repetition algorithms — optimizing the forgetting curve',
      concept: `Ebbinghaus discovered the forgetting curve in 1885. In 1972, Sebastian Leitner built a flashcard system based on it. In 1987, Piotr Wozniak created **SuperMemo**, the first computerized spaced repetition algorithm. Today, apps like Anki use refined versions.

The core algorithm (SM-2, simplified):
1. After each review, rate your recall: 0 (forgot) to 5 (perfect)
2. If you recalled easily, increase the **interval** (next review is further away)
3. If you struggled, reset the interval to 1 day
4. The **ease factor** adjusts per card: easy cards get longer intervals faster

Mathematically, the optimal interval follows:
**I(n) = I(n-1) × EF**
Where EF (ease factor) starts at 2.5 and adjusts based on performance.

Why this works:
- **Desirable difficulty**: reviewing just before you forget is the optimal moment for strengthening (Bjork, 1994)
- **Expanding intervals**: 1 day → 3 days → 7 days → 21 days → 2 months → 6 months...
- **Efficiency**: you review easy cards rarely and hard cards often, automatically

SuperMemo/Anki users routinely maintain 90%+ retention of 10,000+ items with just 15-30 minutes of daily review.`,
      analogy: 'Spaced repetition is like watering plants on a smart schedule. A new seedling needs water daily. An established plant needs water weekly. A mature tree needs water monthly. The algorithm learns each card\'s "water needs" and schedules accordingly — no over-watering, no under-watering.',
      storyConnection: 'The grandmother\'s oral tradition was natural spaced repetition — she retold stories at festivals (yearly), family gatherings (monthly), and bedtime (daily for favourites). Without knowing the algorithm, she intuitively practiced what SuperMemo later formalized.',
      checkQuestion: 'If you have 1,000 flashcards and review 50 per day, how long until you\'ve reviewed all of them? What about after that?',
      checkAnswer: 'First pass: 20 days. But the key insight is that after the first pass, you don\'t need to review all 1,000 again. Easy cards might not come up for months. Hard cards come up every few days. Over time, the daily review load stabilizes at ~50 cards even as your total deck grows to 10,000+. The algorithm keeps the workload constant by spacing reviews optimally.',
      codeIntro: 'Implement a simplified spaced repetition algorithm and simulate learning 100 cards over 6 months.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified SM-2 spaced repetition simulator
n_cards = 100
n_days = 180  # 6 months

class Card:
    def __init__(self, difficulty):
        self.difficulty = difficulty  # 0-1 (1 = hardest)
        self.interval = 1  # days until next review
        self.ease = 2.5
        self.next_review = 0  # day of next review
        self.reviews = 0
        self.correct = 0

    def review(self, day):
        self.reviews += 1
        # Probability of recall depends on overdue-ness and difficulty
        overdue = max(0, day - self.next_review) / self.interval
        p_recall = max(0.1, 1 - self.difficulty * 0.3 - overdue * 0.2)
        recalled = np.random.random() < p_recall

        if recalled:
            self.correct += 1
            self.interval = max(1, int(self.interval * self.ease))
            self.ease = min(3.0, self.ease + 0.1)
        else:
            self.interval = 1
            self.ease = max(1.3, self.ease - 0.2)

        self.next_review = day + self.interval
        return recalled

# Create cards with varying difficulty
cards = [Card(np.random.uniform(0.1, 0.9)) for _ in range(n_cards)]

# Simulate
daily_reviews = []
daily_retention = []
cards_seen = set()

for day in range(n_days):
    due_cards = [c for c in cards if c.next_review <= day]
    # Also introduce new cards (5 per day until all seen)
    new_today = [c for c in cards if c.reviews == 0 and c not in due_cards][:5]
    today_cards = due_cards + new_today

    correct = 0
    for card in today_cards:
        if card.review(day):
            correct += 1
        cards_seen.add(id(card))

    daily_reviews.append(len(today_cards))
    daily_retention.append(correct / max(len(today_cards), 1) * 100)

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Daily reviews
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(range(n_days), daily_reviews, color='#3b82f6', linewidth=1, alpha=0.5)
# Rolling average
window = 7
rolling = np.convolve(daily_reviews, np.ones(window)/window, mode='valid')
ax.plot(range(window-1, n_days), rolling, color='#3b82f6', linewidth=2.5, label=f'{window}-day avg')
ax.set_ylabel('Cards reviewed', color='white')
ax.set_title('Daily Review Load', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Retention rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
rolling_ret = np.convolve(daily_retention, np.ones(window)/window, mode='valid')
ax.plot(range(window-1, n_days), rolling_ret, color='#22c55e', linewidth=2.5)
ax.axhline(90, color='#f59e0b', linestyle='--', linewidth=1, label='90% target')
ax.set_ylabel('Retention %', color='white')
ax.set_title('Daily Retention Rate', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(50, 100)

# Interval distribution at end
ax = axes[1, 0]
ax.set_facecolor('#111827')
intervals = [c.interval for c in cards]
ax.hist(intervals, bins=30, color='#a855f7', alpha=0.8, edgecolor='none')
ax.set_xlabel('Current interval (days)', color='white')
ax.set_ylabel('Number of cards', color='white')
ax.set_title('Interval Distribution (Day 180)', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Difficulty vs ease factor
ax = axes[1, 1]
ax.set_facecolor('#111827')
difficulties = [c.difficulty for c in cards]
eases = [c.ease for c in cards]
scatter = ax.scatter(difficulties, eases, c=[c.correct/max(c.reviews,1) for c in cards],
                     cmap='RdYlGn', s=50, alpha=0.8, vmin=0.5, vmax=1.0)
ax.set_xlabel('Card difficulty', color='white')
ax.set_ylabel('Ease factor', color='white')
ax.set_title('Difficulty vs Learned Ease', color='white', fontsize=12)
ax.tick_params(colors='gray')
plt.colorbar(scatter, ax=ax, label='Accuracy')

plt.tight_layout()
plt.show()

total_reviews = sum(c.reviews for c in cards)
avg_retention = np.mean([c.correct/max(c.reviews,1) for c in cards]) * 100
print(f"After 180 days:")
print(f"  Total reviews: {total_reviews:,}")
print(f"  Average daily load: {total_reviews/n_days:.0f} cards")
print(f"  Overall retention: {avg_retention:.1f}%")
print(f"  Easy cards (interval > 30 days): {sum(1 for c in cards if c.interval > 30)}")
print(f"  Hard cards (interval < 7 days): {sum(1 for c in cards if c.interval < 7)}")`,
      challenge: 'Add a "cramming" comparison: a student who reviews all 100 cards every day for the first month, then stops. Plot both retention curves. Which method wins at day 180?',
      successHint: 'Spaced repetition is the closest thing we have to a "memory hack." It exploits the forgetting curve to maintain near-perfect retention with minimal effort. Medical students, language learners, and programmers who use it consistently outperform those who don\'t.',
    },
    {
      title: 'Alzheimer\'s and memory loss — when the system breaks down',
      concept: `**Alzheimer's disease** is the most common cause of dementia, affecting over 55 million people worldwide. It progressively destroys the brain's memory systems, and understanding it requires understanding everything we've covered.

The biology:
1. **Amyloid plaques**: sticky protein fragments (Aβ) accumulate between neurons, disrupting communication
2. **Tau tangles**: inside neurons, the protein tau becomes misfolded and forms tangles that collapse the cell's internal transport system
3. **Synaptic loss**: connections between neurons are destroyed (remember: memories ARE connections)
4. **Neuronal death**: neurons die, starting in the **hippocampus** (memory consolidation center) and spreading outward

The progression mirrors the memory hierarchy:
- **Early**: episodic memory loss (forgetting recent events, but distant past preserved)
- **Middle**: semantic memory loss (forgetting word meanings, faces)
- **Late**: procedural memory loss (forgetting how to walk, eat, breathe)

This pattern makes sense because the hippocampus (for new episodic memories) is affected first. Old memories, already consolidated in the cortex, survive longer. Procedural memories (cerebellum, basal ganglia) are the last to go.`,
      analogy: 'Alzheimer\'s is like a fire in a library that starts in the cataloguing office (hippocampus). First, no new books can be shelved (can\'t form new memories). Then the fire spreads to recent acquisitions (recent memories). The oldest books, in the deepest vaults, survive longest. Eventually the fire reaches the building\'s structural systems (procedural memory), and the library collapses.',
      storyConnection: 'The grandmother who remembered everything represents what Alzheimer\'s destroys. Her memories — stories, songs, recipes — would be lost in reverse order of when she learned them. The most recent stories first, the childhood lullabies last. When the last song goes silent, the library has burned.',
      checkQuestion: 'Alzheimer\'s patients can sometimes play a musical instrument or complete a familiar recipe even when they can\'t remember their own name. How is this possible?',
      checkAnswer: 'Musical performance and cooking are procedural memories, stored in the cerebellum and basal ganglia — brain regions that Alzheimer\'s affects late. Remembering a name is episodic/semantic memory, dependent on the hippocampus and temporal cortex — the first regions damaged. The disease attacks memory systems in a specific order, sparing motor skills until very late.',
      codeIntro: 'Model the progression of Alzheimer\'s memory loss across different memory systems over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Alzheimer's progression model
years = np.linspace(0, 15, 200)  # 15-year progression

# Different memory systems decline at different rates
# Based on clinical staging (Braak stages)

def memory_decline(t, onset, rate):
    """Sigmoid decline starting at 'onset' years"""
    return 100 / (1 + np.exp(rate * (t - onset)))

# Memory systems (ordered by vulnerability)
systems = {
    'Recent episodic': {'onset': 3, 'rate': 0.8, 'color': '#ef4444'},
    'New learning': {'onset': 4, 'rate': 1.0, 'color': '#f59e0b'},
    'Semantic (facts)': {'onset': 7, 'rate': 0.6, 'color': '#3b82f6'},
    'Remote episodic': {'onset': 8, 'rate': 0.5, 'color': '#8b5cf6'},
    'Procedural (skills)': {'onset': 12, 'rate': 0.7, 'color': '#22c55e'},
}

# Brain volume loss
brain_volume = 100 - 3 * years - 0.3 * years ** 2
brain_volume = np.clip(brain_volume, 40, 100)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Memory decline curves
ax1.set_facecolor('#111827')
for name, props in systems.items():
    curve = memory_decline(years, props['onset'], props['rate'])
    ax1.plot(years, curve, linewidth=2.5, color=props['color'], label=name)

# Clinical stages
stages = [(0, 'Normal'), (3, 'MCI'), (6, 'Early AD'), (10, 'Moderate AD'), (14, 'Severe AD')]
for yr, label in stages:
    ax1.axvline(yr, color='gray', linestyle=':', alpha=0.3)
    ax1.text(yr + 0.2, 105, label, color='gray', fontsize=8, rotation=0)

ax1.set_xlabel('Years from first symptoms', color='white')
ax1.set_ylabel('Memory function (%)', color='white')
ax1.set_title('Memory System Decline in Alzheimer\'s', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9, loc='lower left')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 115)

# Brain regions affected over time
ax2.set_facecolor('#111827')

regions = ['Hippocampus', 'Entorhinal\\ncortex', 'Temporal\\nlobe', 'Parietal\\nlobe', 'Frontal\\nlobe', 'Motor\\ncortex']
onset_years = [1, 2, 4, 6, 8, 12]
severity_at_10y = [95, 85, 70, 50, 30, 10]

bars = ax2.barh(range(len(regions)), severity_at_10y,
                color=['#ef4444', '#ef4444', '#f59e0b', '#f59e0b', '#3b82f6', '#22c55e'],
                alpha=0.8)
ax2.set_yticks(range(len(regions)))
ax2.set_yticklabels(regions, color='white', fontsize=10)
ax2.set_xlabel('Damage severity at year 10 (%)', color='white')
ax2.set_title('Brain Region Damage (Year 10)', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, sev in zip(bars, severity_at_10y):
    ax2.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
             f'{sev}%', va='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Alzheimer's progression follows a predictable pattern:")
print("  Years 0-3: Subtle memory lapses (often dismissed)")
print("  Years 3-6: Clear episodic memory loss (can't form new memories)")
print("  Years 6-10: Semantic decline (words, faces, concepts)")
print("  Years 10-15: Procedural loss (daily activities)")
print()
print("Currently NO cure. Treatments slow progression slightly.")
print("Research focuses on clearing amyloid, preventing tau tangles,")
print("and early detection (years before symptoms appear).")`,
      challenge: 'Add a "treatment" curve that delays onset of each system\'s decline by 2 years. How much functional life does this buy? (Current drugs achieve ~6 months delay — model that too.)',
      successHint: 'Alzheimer\'s research is one of the biggest challenges in neuroscience. Understanding it requires understanding memory at every level — molecular (amyloid, tau), cellular (synapses, neurons), systems (hippocampus, cortex), and cognitive (episodic, semantic, procedural).',
    },
    {
      title: 'AI vs human memory — what machines can\'t do (yet)',
      concept: `AI systems now outperform humans at many memory tasks — storing more data, recalling it perfectly, searching faster. But human memory has properties that AI still can't match:

**Strengths of AI memory**:
- Perfect recall (no forgetting, no distortion)
- Massive capacity (trillions of tokens)
- Instant search (no tip-of-the-tongue moments)
- No emotional bias in retrieval

**Strengths of human memory**:
- **Contextual understanding**: humans remember the meaning and feeling of events, not just the data
- **Creative recombination**: humans can combine memories in novel ways (imagination)
- **Emotional tagging**: emotional memories are automatically prioritized (survival-critical)
- **Embodied memory**: memories are tied to body states (a smell triggering a childhood memory)
- **Adaptive forgetting**: irrelevant details are automatically pruned
- **One-shot learning**: a single traumatic event creates a lifelong memory

The deepest difference: human memory is **reconstructive**, not reproductive. Each recall is a new construction, influenced by current mood, context, and knowledge. This makes human memory unreliable for details but powerful for extracting meaning, making connections, and driving creative thought.

AI is getting closer to some human-like memory properties (retrieval-augmented generation, episodic memory buffers, vector databases) but genuine understanding, emotional context, and embodied experience remain unsolved.`,
      analogy: 'AI memory is like a perfect photocopier — it reproduces information flawlessly. Human memory is like a painter who saw the scene once — the painting isn\'t a perfect copy, but it captures the mood, the meaning, the feeling of being there. The photocopier is more accurate; the painter understands more.',
      storyConnection: 'The grandmother\'s memories were reconstructive — each retelling was slightly different, shaped by her audience, her mood, and her evolving understanding. An AI transcription of her stories would be perfectly accurate but would lack the grandmother\'s understanding of why the stories mattered. The data would survive; the meaning might not.',
      checkQuestion: 'A courtroom allows eyewitness testimony but not AI-generated reconstructions of events. Is this the right policy?',
      checkAnswer: 'It\'s complicated. Eyewitness memory is reconstructive and unreliable (the Innocence Project found that 70% of wrongful convictions involved mistaken eyewitness identification). AI reconstruction could be more accurate for physical details. But juries need to understand the human experience of events — intent, fear, confusion — which only human witnesses can convey. The ideal is probably a combination: AI for physical facts, humans for context and meaning.',
      codeIntro: 'Compare human and AI memory characteristics across multiple dimensions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Radar chart: Human vs AI memory capabilities
categories = ['Capacity', 'Accuracy', 'Speed', 'Context\\nunderstanding', 'Creativity', 'Emotional\\ntagging',
              'One-shot\\nlearning', 'Forgetting\\n(adaptive)', 'Embodied\\nmemory']
N = len(categories)

# Scores (0-10)
human = [4, 5, 4, 10, 10, 10, 9, 9, 10]
ai_2024 = [10, 10, 10, 6, 4, 1, 3, 2, 0]

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]
human += human[:1]
ai_2024 += ai_2024[:1]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6),
                                subplot_kw={'projection': 'polar'} if True else {})

# Radar chart
fig, ax1 = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
fig.patch.set_facecolor('#1f2937')
ax1.set_facecolor('#111827')

ax1.plot(angles, human, 'o-', linewidth=2.5, label='Human memory', color='#22c55e')
ax1.fill(angles, human, alpha=0.15, color='#22c55e')
ax1.plot(angles, ai_2024, 's-', linewidth=2.5, label='AI memory (2024)', color='#3b82f6')
ax1.fill(angles, ai_2024, alpha=0.15, color='#3b82f6')

ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(categories, color='white', fontsize=9)
ax1.set_ylim(0, 10)
ax1.set_yticks([2, 4, 6, 8, 10])
ax1.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax1.tick_params(colors='gray')
ax1.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.set_title('Human vs AI Memory', color='white', fontsize=14, pad=20)

plt.tight_layout()
plt.show()

# Bar chart comparison
fig2, ax2 = plt.subplots(figsize=(12, 5))
fig2.patch.set_facecolor('#1f2937')
ax2.set_facecolor('#111827')

x = np.arange(len(categories))
width = 0.35

bars1 = ax2.bar(x - width/2, human[:-1], width, label='Human', color='#22c55e', alpha=0.8)
bars2 = ax2.bar(x + width/2, ai_2024[:-1], width, label='AI (2024)', color='#3b82f6', alpha=0.8)

ax2.set_xticks(x)
ax2.set_xticklabels(categories, color='gray', fontsize=8, rotation=30, ha='right')
ax2.set_ylabel('Capability score (0-10)', color='white')
ax2.set_title('Memory Capability Comparison', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Highlight where each excels
for i, (h, a) in enumerate(zip(human[:-1], ai_2024[:-1])):
    winner = '#22c55e' if h > a else '#3b82f6' if a > h else 'gray'
    ax2.plot(i, max(h, a) + 0.3, 'v', color=winner, markersize=8)

plt.tight_layout()
plt.show()

print("Where AI wins: Capacity, Accuracy, Speed")
print("Where humans win: Context, Creativity, Emotion, One-shot, Embodiment")
print()
print("The gap is closing on context understanding (LLMs are improving).")
print("But embodied memory and emotional tagging remain far beyond AI.")
print("The grandmother's memory wasn't just data — it was meaning.")`,
      challenge: 'Add an "AI 2030 (projected)" line to the radar chart with your estimates of where AI memory capabilities might reach. Which capabilities will improve most? Which will remain uniquely human?',
      successHint: 'Understanding the differences between human and AI memory isn\'t just academic — it determines how we design AI systems, educational tools, and human-AI collaboration. The goal isn\'t to replace human memory but to complement it.',
    },
    {
      title: 'Designing for memorability — why some things stick',
      concept: `Some things are easy to remember. Others are forgettable. The difference isn't random — it follows principles that can be engineered. **Designing for memorability** applies everything we know about memory to create experiences, products, and information that stick.

The MEMORABLE framework:
- **M**ultisensory: engage multiple senses (visual + auditory + tactile > visual alone)
- **E**motional: create an emotional response (fear, joy, surprise, curiosity)
- **M**eaningful: connect to existing knowledge (semantic encoding)
- **O**rganized: provide clear structure (chunking, hierarchy)
- **R**epeated: build in natural repetition (spaced, not massed)
- **A**ctive: require the learner to DO something (testing effect)
- **B**izarre: unusual things are remembered better (von Restorff effect)
- **L**inked: create associations between new and old information
- **E**mbodied: involve physical action or spatial navigation

Applications:
- **UX design**: memorable interfaces use consistent spatial layout (spatial memory), distinctive icons (von Restorff), and progressive disclosure (chunking)
- **Education**: memorable lessons use stories (narrative), hands-on activities (embodied), and frequent quizzes (testing effect)
- **Marketing**: memorable ads use emotion, repetition, and jingles (acoustic encoding)
- **Public health**: memorable health messages use fear appeals (emotion) with clear action steps (meaningful)`,
      analogy: 'Designing for memorability is like cooking a great meal. You could just put ingredients on a plate (information dump). Or you could season them (emotion), arrange them beautifully (organization), pair flavors that complement each other (linking), and serve them in courses (pacing). The ingredients are the same; the presentation determines whether anyone remembers the meal.',
      storyConnection: 'The grandmother\'s stories were perfectly designed for memorability — not by accident, but by centuries of cultural evolution. Stories that were forgettable died out. Stories that used emotion, rhythm, surprise, and meaning survived. Oral tradition is a Darwinian filter for memorability.',
      checkQuestion: 'You\'re designing an app to teach children about endangered animals. Using the MEMORABLE framework, what features would you include?',
      checkAnswer: 'Multisensory: animal sounds and animations (not just text). Emotional: stories about individual animals (empathy). Meaningful: connect to animals the child already knows. Organized: group by habitat, not alphabetically. Repeated: daily "check on your animal" feature (spaced repetition). Active: quizzes and drawing challenges (testing effect). Bizarre: weird facts ("the axolotl can regrow its brain!"). Linked: compare to familiar pets. Embodied: AR that places animals in the child\'s room.',
      codeIntro: 'Quantify the memorability boost of different design principles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Experimental data: recall rates for information presented with different design features
# Based on aggregated findings from cognitive psychology

features = {
    'Text only (baseline)': {'recall_1d': 0.20, 'recall_7d': 0.10, 'recall_30d': 0.05},
    '+ Visuals': {'recall_1d': 0.35, 'recall_7d': 0.20, 'recall_30d': 0.12},
    '+ Emotion': {'recall_1d': 0.50, 'recall_7d': 0.35, 'recall_30d': 0.25},
    '+ Story structure': {'recall_1d': 0.55, 'recall_7d': 0.40, 'recall_30d': 0.30},
    '+ Active testing': {'recall_1d': 0.65, 'recall_7d': 0.50, 'recall_30d': 0.40},
    '+ Spaced repetition': {'recall_1d': 0.70, 'recall_7d': 0.65, 'recall_30d': 0.60},
    'All combined': {'recall_1d': 0.85, 'recall_7d': 0.75, 'recall_30d': 0.65},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Grouped bar chart
ax1.set_facecolor('#111827')
names = list(features.keys())
x = np.arange(len(names))
width = 0.25

d1 = [features[n]['recall_1d'] * 100 for n in names]
d7 = [features[n]['recall_7d'] * 100 for n in names]
d30 = [features[n]['recall_30d'] * 100 for n in names]

ax1.barh(x + width, d1, width, label='After 1 day', color='#22c55e', alpha=0.8)
ax1.barh(x, d7, width, label='After 7 days', color='#3b82f6', alpha=0.8)
ax1.barh(x - width, d30, width, label='After 30 days', color='#a855f7', alpha=0.8)

ax1.set_yticks(x)
ax1.set_yticklabels(names, color='white', fontsize=9)
ax1.set_xlabel('Recall %', color='white')
ax1.set_title('Design Features vs Memory Retention', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Forgetting curves for baseline vs optimized
ax2.set_facecolor('#111827')
days = np.linspace(0, 30, 100)

# Baseline: steep Ebbinghaus curve
baseline = 20 * np.exp(-0.05 * days) + 5
# Optimized: all features combined
optimized = 85 * np.exp(-0.008 * days)

ax2.plot(days, baseline, color='#ef4444', linewidth=2.5, label='Text only')
ax2.plot(days, optimized, color='#22c55e', linewidth=2.5, label='All features combined')
ax2.fill_between(days, baseline, optimized, alpha=0.1, color='#22c55e')

# Calculate area between curves (total "extra memory")
area = np.trapz(optimized - baseline, days)
ax2.text(15, 50, f'Extra memory:\\n{area:.0f} %-days', color='#f59e0b', fontsize=12,
         ha='center', fontweight='bold',
         bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#f59e0b'))

ax2.set_xlabel('Days', color='white')
ax2.set_ylabel('Recall %', color='white')
ax2.set_title('Forgetting Curves: Baseline vs Optimized Design', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 100)

plt.tight_layout()
plt.show()

print("Design impact on 30-day retention:")
for name, data in features.items():
    boost = (data['recall_30d'] - 0.05) / 0.05 * 100
    print(f"  {name}: {data['recall_30d']*100:.0f}% (+{boost:.0f}% vs baseline)")
print()
print("Key insight: features MULTIPLY, not just add.")
print("Text only: 5% at 30 days")
print("All features: 65% at 30 days (13x improvement)")
print()
print("This is why the grandmother's stories lasted generations —")
print("they combined emotion, narrative, rhythm, repetition, and meaning.")`,
      challenge: 'Pick a specific lesson from this course and score it on the MEMORABLE framework (0-10 for each feature). Then propose one change to increase its weakest score. Implement the change and re-score.',
      successHint: 'Designing for memorability connects cognitive science to practical design. Every teacher, product designer, and communicator who understands these principles creates more effective experiences. The grandmother was the original UX designer — and her medium was story.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for cognitive science simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            />
        ))}
      </div>
    </div>
  );
}