import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MemoryGrandmaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Ebbinghaus forgetting curve — modeling memory decay over time",
      concept: "modeling memory decay over time. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Ebbinghaus forgetting curve — modeling memory decay over time ---
print("=== The Ebbinghaus Forgetting Curve ===\
")

# Ebbinghaus (1885) discovered that memory decays exponentially:
# R(t) = e^(-t/S) where R = retention, t = time, S = memory strength

def forgetting_curve(t, strength):
    """Retention as a function of time and memory strength."""
    return np.exp(-t / strength)

# Simulate memory decay for different strengths
time_hours = np.array([0, 0.33, 1, 2, 6, 24, 48, 168])  # up to 1 week
time_labels = ["0", "20min", "1h", "2h", "6h", "1day", "2days", "1week"]

print("Retention (%) over time for different memory strengths:")
print(f"{'Time':<8s}", end="")
strengths = [1, 5, 10, 24, 100]
for s in strengths:
    print(f"{'S=' + str(s):>8s}", end="")
print()
print("-" * 48)

for t, label in zip(time_hours, time_labels):
    print(f"{label:<8s}", end="")
    for s in strengths:
        r = forgetting_curve(t, s) * 100
        print(f"{r:>7.1f}%", end="")
    print()

# Key observations
s_weak = 1
s_strong = 24
print(f"\
After 24 hours:")
print(f"  Weak memory (S=1):    {forgetting_curve(24, s_weak)*100:.1f}% retained")
print(f"  Strong memory (S=24): {forgetting_curve(24, s_strong)*100:.1f}% retained")

# Half-life: time to forget 50%
# R(t) = 0.5 -> t = S * ln(2)
print(f"\
Half-life (time to 50% retention):")
for s in strengths:
    half_life = s * np.log(2)
    if half_life < 1:
        print(f"  S={s:>3d}: {half_life*60:.0f} minutes")
    elif half_life < 24:
        print(f"  S={s:>3d}: {half_life:.1f} hours")
    else:
        print(f"  S={s:>3d}: {half_life/24:.1f} days")

# Practical example: learning vocabulary
print(f"\
Practical example — learning 20 new words:")
words_learned = 20
for t, label in [(1, "1 hour"), (24, "1 day"), (168, "1 week")]:
    retained = int(words_learned * forgetting_curve(t, 5))
    print(f"  After {label}: ~{retained}/{words_learned} words remembered (S=5)")

print(f"\
Key insight: The curve is steepest in the first hour. If you review")
print(f"within that window, you reset the curve AND increase S (strength).")
print(f"This is exactly what the grandmother in the story did intuitively —")
print(f"she retold stories soon after the first telling.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Hippocampal encoding — simulating how memories form and consolidate",
      concept: "simulating how memories form and consolidate. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Hippocampal encoding — simulating how memories form and consolidate ---
print("=== Hippocampal Encoding Simulation ===\
")

np.random.seed(42)

# The hippocampus stores memories as patterns of neural activation.
# We model this as a simple associative network (Hopfield-like).

n_neurons = 20  # simplified network size

# Encode a memory as a binary pattern (like a story the grandmother tells)
def create_memory(n, sparsity=0.3):
    """Create a random binary memory pattern."""
    return (np.random.random(n) < sparsity).astype(int)

# Store 4 memories (4 stories the grandmother tells)
stories = {
    "Elephant story":  create_memory(n_neurons),
    "River tale":      create_memory(n_neurons),
    "Mountain legend":  create_memory(n_neurons),
    "Festival memory":  create_memory(n_neurons),
}

print(f"Neural network: {n_neurons} neurons\
")
print("Stored memory patterns (1=active neuron, 0=silent):")
for name, pattern in stories.items():
    active = sum(pattern)
    print(f"  {name:<18s}: {''.join(str(x) for x in pattern)} ({active} active)")

# Build weight matrix (Hebbian learning: neurons that fire together wire together)
W = np.zeros((n_neurons, n_neurons))
for pattern in stories.values():
    p = pattern.reshape(-1, 1)
    W += p @ p.T
np.fill_diagonal(W, 0)  # no self-connections
W /= len(stories)  # normalize

print(f"\
Weight matrix: {n_neurons}x{n_neurons}, range [{W.min():.3f}, {W.max():.3f}]")

# Test retrieval: give a partial cue, can the network complete it?
def retrieve(cue, W, steps=5):
    """Retrieve a memory from a partial cue using iterative update."""
    state = cue.copy().astype(float)
    for _ in range(steps):
        activation = W @ state
        state = (activation > np.median(activation)).astype(float)
    return state.astype(int)

def similarity(a, b):
    """Fraction of matching bits."""
    return np.mean(a == b)

print("\
Memory retrieval from partial cues:")
for name, pattern in stories.items():
    # Corrupt 40% of the pattern (partial cue)
    cue = pattern.copy()
    mask = np.random.random(n_neurons) < 0.4
    cue[mask] = 0
    corrupted_bits = sum(mask)

    retrieved = retrieve(cue, W)
    sim = similarity(retrieved, pattern) * 100

    print(f"  {name}:")
    print(f"    Original:  {''.join(str(x) for x in pattern)}")
    print(f"    Cue ({corrupted_bits} bits lost): {''.join(str(x) for x in cue)}")
    print(f"    Retrieved: {''.join(str(x) for x in retrieved)}")
    print(f"    Accuracy: {sim:.0f}%")

# Capacity limit: too many memories cause interference
print("\
Capacity test: what happens with too many stored memories?")
for n_memories in [2, 4, 8, 12]:
    W_test = np.zeros((n_neurons, n_neurons))
    test_patterns = [create_memory(n_neurons) for _ in range(n_memories)]
    for p in test_patterns:
        pt = p.reshape(-1, 1)
        W_test += pt @ pt.T
    np.fill_diagonal(W_test, 0)
    W_test /= n_memories

    # Test retrieval accuracy
    accuracies = []
    for p in test_patterns:
        cue = p.copy()
        cue[np.random.random(n_neurons) < 0.3] = 0
        retrieved = retrieve(cue, W_test)
        accuracies.append(similarity(retrieved, p))

    print(f"  {n_memories:>2d} memories: avg retrieval accuracy = {np.mean(accuracies)*100:.0f}%")

print(f"\
Key insight: The network works well with a few memories but degrades")
print(f"as more are added. This is why the grandmother focused on a small")
print(f"set of core stories — quality over quantity prevents interference.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Spaced repetition theory — optimizing review intervals for retention",
      concept: "optimizing review intervals for retention. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Spaced repetition theory — optimizing review intervals for retention ---
print("=== Spaced Repetition: Optimal Review Scheduling ===\
")

# The SM-2 algorithm (used in Anki): after each review, the interval
# grows by a multiplier that depends on how well you recalled.

def sm2_schedule(quality_scores, initial_interval=1, initial_ef=2.5):
    """SM-2 spaced repetition algorithm.
    quality_scores: list of scores 0-5 per review (5=perfect, 0=forgot).
    Returns list of (day, interval, ef) tuples."""
    ef = initial_ef  # easiness factor
    interval = initial_interval
    schedule = []

    for review_num, q in enumerate(quality_scores):
        schedule.append((sum(s[1] for s in schedule) if schedule else 0, interval, ef, q))

        # Update easiness factor
        ef = max(1.3, ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

        # Update interval
        if q < 3:  # forgot — reset
            interval = 1
        elif review_num == 0:
            interval = 1
        elif review_num == 1:
            interval = 6
        else:
            interval = round(interval * ef)

    return schedule

# Simulate a student reviewing a card with varying performance
print("--- Perfect recall (all 5s) ---")
perfect = sm2_schedule([5, 5, 5, 5, 5, 5, 5])
print(f"{'Review':>7s} {'Day':>5s} {'Interval':>9s} {'EF':>5s}")
for i, (day, interval, ef, q) in enumerate(perfect):
    print(f"{i+1:>7d} {day:>5.0f} {interval:>8d}d {ef:>5.2f}")

print("\
--- Struggling student (mix of scores) ---")
struggling = sm2_schedule([3, 2, 4, 3, 5, 4, 5])
print(f"{'Review':>7s} {'Day':>5s} {'Interval':>9s} {'EF':>5s} {'Score':>6s}")
for i, (day, interval, ef, q) in enumerate(struggling):
    print(f"{i+1:>7d} {day:>5.0f} {interval:>8d}d {ef:>5.2f} {q:>6d}")

# Compare: cramming vs spaced repetition
print("\
--- Cramming vs Spaced: 30-day simulation ---")
def retention_over_time(days, reviews_at, strength_boost=5):
    """Simulate retention with reviews at given days."""
    strength = strength_boost
    retentions = []
    last_review = 0
    review_idx = 0
    for d in range(days):
        # Decay since last review
        time_since = d - last_review
        retention = np.exp(-time_since / strength)
        retentions.append(retention)
        # Check if review happens today
        if review_idx < len(reviews_at) and d == reviews_at[review_idx]:
            strength *= 1.5  # each review strengthens the memory
            last_review = d
            review_idx += 1
    return retentions

# Cramming: 5 reviews on day 1
cram_reviews = [0, 0, 0, 0, 0]
cram_retention = retention_over_time(30, [0])  # all on day 0, counts as 1 session

# Spaced: 5 reviews spread out
spaced_reviews = [0, 1, 3, 7, 14]
spaced_retention = retention_over_time(30, spaced_reviews)

checkpoints = [0, 1, 3, 7, 14, 29]
print(f"{'Day':>5s} {'Cramming':>10s} {'Spaced':>10s}")
print("-" * 27)
for d in checkpoints:
    print(f"{d:>5d} {cram_retention[d]*100:>9.0f}% {spaced_retention[d]*100:>9.0f}%")

print(f"\
At day 30: cramming retains {cram_retention[29]*100:.0f}%, spaced retains {spaced_retention[29]*100:.0f}%")
print(f"Spaced repetition wins because each review happens just before")
print(f"forgetting, which strengthens the memory trace more efficiently")
print(f"than massing all reviews together.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Memory interference — modeling how new learning disrupts old memories",
      concept: "modeling how new learning disrupts old memories. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Memory interference — modeling how new learning disrupts old memories ---
print("=== Memory Interference Model ===\
")

np.random.seed(42)

# Two types of interference:
# 1. Retroactive: new learning hurts old memories
# 2. Proactive: old memories make new learning harder

# Model: each memory is a vector; similar vectors interfere more

def cosine_similarity(a, b):
    dot = np.dot(a, b)
    return dot / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9)

# Create memories with controlled similarity
n_features = 10
memory_A = np.array([1, 0, 1, 0, 1, 0, 1, 0, 1, 0], dtype=float)  # "elephant story"
memory_B_similar = np.array([1, 0, 1, 0, 1, 1, 0, 0, 1, 0], dtype=float)  # similar story
memory_C_different = np.array([0, 1, 0, 1, 0, 0, 0, 1, 0, 1], dtype=float)  # very different story

print("Memory vectors (features like characters, setting, plot elements):")
print(f"  Story A (elephant):  {memory_A.astype(int).tolist()}")
print(f"  Story B (similar):   {memory_B_similar.astype(int).tolist()}")
print(f"  Story C (different): {memory_C_different.astype(int).tolist()}")

sim_AB = cosine_similarity(memory_A, memory_B_similar)
sim_AC = cosine_similarity(memory_A, memory_C_different)
print(f"\
Similarity A-B: {sim_AB:.3f} (high overlap)")
print(f"Similarity A-C: {sim_AC:.3f} (low overlap)")

# Simulate retroactive interference
# After learning B, retrieval of A is degraded proportional to similarity
def retrieve_with_interference(target, interferer, interference_strength=0.5):
    """Simulate retrieval of target after learning interferer."""
    sim = cosine_similarity(target, interferer)
    interference = interference_strength * sim
    noise = np.random.normal(0, interference, len(target))
    retrieved = target + noise
    # Threshold to binary
    retrieved_binary = (retrieved > 0.5).astype(int)
    accuracy = np.mean(retrieved_binary == target.astype(int))
    return accuracy, interference

print("\
--- Retroactive Interference ---")
print("(Learning a new story right after an old one)")
n_trials = 100
for interferer_name, interferer in [("B (similar)", memory_B_similar), ("C (different)", memory_C_different)]:
    accuracies = []
    for _ in range(n_trials):
        acc, interf = retrieve_with_interference(memory_A, interferer)
        accuracies.append(acc)
    print(f"  After learning {interferer_name}:")
    print(f"    Avg retrieval accuracy of A: {np.mean(accuracies)*100:.1f}%")
    print(f"    Interference level: {interf:.3f}")

# Proactive interference: how many old memories make new learning harder
print("\
--- Proactive Interference ---")
print("(Old memories making it harder to learn new ones)")
for n_prior in [0, 2, 5, 10]:
    # More prior memories = more cumulative interference
    prior_memories = [np.random.randint(0, 2, n_features).astype(float) for _ in range(n_prior)]
    new_memory = np.random.randint(0, 2, n_features).astype(float)
    total_interference = sum(cosine_similarity(new_memory, p) for p in prior_memories) * 0.1
    effective_retention = max(0, 1.0 - total_interference)
    print(f"  {n_prior:>2d} prior memories: interference = {total_interference:.3f}, retention = {effective_retention*100:.0f}%")

# Spacing effect on interference
print("\
--- How spacing reduces interference ---")
print("  Back-to-back study: interference at full strength")
print("  1 hour gap: interference reduced ~40%")
print("  1 day gap: interference reduced ~70%")
print("  1 week gap: interference reduced ~90%")
print("\
Key insight: The grandmother never told two similar stories on the")
print("same day. By spacing similar content apart, she minimized interference")
print("and gave each story time to consolidate independently.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Sleep and consolidation — simulating overnight memory strengthening",
      concept: "simulating overnight memory strengthening. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Sleep and consolidation — simulating overnight memory strengthening ---
print("=== Sleep & Memory Consolidation ===\
")

np.random.seed(42)

# During sleep, the brain replays memories, strengthening important ones
# and pruning unimportant ones. We model this as a competitive process.

# Memories have a strength (how well-encoded) and an emotional tag
memories = [
    {"name": "Grandmother's elephant story",  "strength": 0.6, "emotional": 0.9, "rehearsals": 3},
    {"name": "Math homework formulas",         "strength": 0.7, "emotional": 0.2, "rehearsals": 5},
    {"name": "Friend's birthday party",        "strength": 0.5, "emotional": 0.8, "rehearsals": 1},
    {"name": "Bus route to school",            "strength": 0.8, "emotional": 0.1, "rehearsals": 50},
    {"name": "New vocabulary words",           "strength": 0.3, "emotional": 0.3, "rehearsals": 2},
    {"name": "Scary thunderstorm",             "strength": 0.4, "emotional": 0.95, "rehearsals": 1},
]

print("Memories before sleep:")
print(f"{'Memory':<35s} {'Strength':>9s} {'Emotion':>8s} {'Rehearsals':>11s}")
print("-" * 66)
for m in memories:
    print(f"{m['name']:<35s} {m['strength']:>9.2f} {m['emotional']:>8.2f} {m['rehearsals']:>11d}")

# Sleep consolidation model
def consolidate(memories, n_cycles=5, replay_noise=0.05):
    """Simulate sleep consolidation over N sleep cycles."""
    results = []
    for m in memories:
        s = m["strength"]
        # During each sleep cycle:
        for cycle in range(n_cycles):
            # 1. Emotional memories get preferential replay
            replay_prob = 0.3 + 0.5 * m["emotional"]
            if np.random.random() < replay_prob:
                # Successful replay strengthens the memory
                boost = 0.05 + 0.03 * m["emotional"]
                s = min(1.0, s + boost + np.random.normal(0, replay_noise))
            else:
                # No replay: slight decay
                s *= 0.98
        # 2. Well-rehearsed memories are more stable
        rehearsal_factor = 1.0 - np.exp(-m["rehearsals"] / 10)
        s = s * (0.7 + 0.3 * rehearsal_factor)
        results.append({**m, "post_sleep": s, "change": s - m["strength"]})
    return results

# Run consolidation
post_sleep = consolidate(memories)

print("\
Memories after one night of sleep:")
print(f"{'Memory':<35s} {'Before':>7s} {'After':>7s} {'Change':>7s}")
print("-" * 59)
for m in post_sleep:
    sign = "+" if m["change"] >= 0 else ""
    print(f"{m['name']:<35s} {m['strength']:>7.2f} {m['post_sleep']:>7.2f} {sign}{m['change']:>6.2f}")

# Analyze which factors matter most
print("\
What predicts memory strengthening during sleep?")
changes = np.array([m["change"] for m in post_sleep])
emotions = np.array([m["emotional"] for m in post_sleep])
rehearsals = np.array([m["rehearsals"] for m in post_sleep])

corr_emotion = np.corrcoef(emotions, changes)[0, 1]
corr_rehearsal = np.corrcoef(rehearsals, changes)[0, 1]
print(f"  Correlation with emotional intensity: {corr_emotion:+.3f}")
print(f"  Correlation with prior rehearsals:    {corr_rehearsal:+.3f}")

# Multi-night simulation
print("\
Multi-night consolidation (grandmother's story):")
story_strength = 0.6
for night in range(7):
    replay_boost = 0.05 + 0.03 * 0.9  # high emotional tag
    story_strength = min(1.0, story_strength + replay_boost * 0.8)
    print(f"  Night {night+1}: strength = {story_strength:.3f}")

print(f"\
Key insight: Emotional memories (like grandmother's stories) get")
print(f"preferential replay during sleep. After 7 nights, the story's memory")
print(f"strength reaches {story_strength:.2f}, while low-emotion memories fade.")
print(f"This is why we remember stories better than facts.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Adaptive scheduling — building an algorithm that learns your forgetting rate",
      concept: "building an algorithm that learns your forgetting rate. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Adaptive scheduling — learning your personal forgetting rate ---
print("=== Adaptive Forgetting Rate Estimator ===\
")

np.random.seed(42)

# Each person forgets at a different rate. The algorithm estimates YOUR
# personal decay constant from your review history.

class AdaptiveScheduler:
    def __init__(self):
        self.items = {}  # item_id -> {strength, decay_rate, history}

    def add_item(self, item_id, name):
        self.items[item_id] = {
            "name": name,
            "strength": 5.0,  # initial guess
            "decay_rate": 0.3,  # initial guess (personal parameter)
            "history": [],
            "interval": 1,  # days until next review
        }

    def predict_retention(self, item_id, days_since_review):
        item = self.items[item_id]
        return np.exp(-item["decay_rate"] * days_since_review / item["strength"])

    def record_review(self, item_id, days_since, recalled):
        """Update model based on whether the student recalled the item."""
        item = self.items[item_id]
        item["history"].append({"days": days_since, "recalled": recalled})

        predicted = self.predict_retention(item_id, days_since)

        # Bayesian-like update of decay rate
        if recalled:
            # Recalled: maybe decay is slower than we thought
            item["decay_rate"] *= 0.9
            item["strength"] *= 1.2
            item["interval"] = int(item["interval"] * 2.0)
        else:
            # Forgot: decay is faster than predicted
            item["decay_rate"] *= 1.3
            item["strength"] *= 0.8
            item["interval"] = max(1, item["interval"] // 2)

        return predicted

    def get_schedule(self, item_id):
        item = self.items[item_id]
        return item["interval"]

# Simulate two students with different forgetting rates
scheduler = AdaptiveScheduler()

# Student A: fast learner (remembers well)
scheduler.add_item("A", "Elephant Story")
# Student B: needs more practice
scheduler.add_item("B", "Elephant Story")

print("Simulating review sessions over 30 days...\
")

# Student A review history (mostly recalls)
reviews_A = [(1, True), (3, True), (7, True), (14, True), (28, True)]
# Student B review history (struggles more)
reviews_B = [(1, True), (3, False), (4, True), (7, False), (8, True), (14, True)]

print("--- Student A (strong recall) ---")
print(f"{'Day':>5s} {'Recalled':>9s} {'Predicted':>10s} {'Decay rate':>11s} {'Next interval':>14s}")
for day, recalled in reviews_A:
    pred = scheduler.record_review("A", day, recalled)
    item = scheduler.items["A"]
    print(f"{day:>5d} {'Yes' if recalled else 'No':>9s} {pred*100:>9.0f}% {item['decay_rate']:>11.4f} {item['interval']:>13d}d")

print("\
--- Student B (needs more practice) ---")
print(f"{'Day':>5s} {'Recalled':>9s} {'Predicted':>10s} {'Decay rate':>11s} {'Next interval':>14s}")
for day, recalled in reviews_B:
    pred = scheduler.record_review("B", day, recalled)
    item = scheduler.items["B"]
    print(f"{day:>5d} {'Yes' if recalled else 'No':>9s} {pred*100:>9.0f}% {item['decay_rate']:>11.4f} {item['interval']:>13d}d")

# Compare final parameters
print("\
Final learned parameters:")
for sid in ["A", "B"]:
    item = scheduler.items[sid]
    print(f"  Student {sid}: decay_rate={item['decay_rate']:.4f}, strength={item['strength']:.2f}, next_review_in={item['interval']}d")

print(f"\
  Student A's interval grew to {scheduler.items['A']['interval']}d (learns fast)")
print(f"  Student B's interval is {scheduler.items['B']['interval']}d (needs more frequent review)")

# Predict retention at day 30
for sid in ["A", "B"]:
    ret = scheduler.predict_retention(sid, 30)
    print(f"  Student {sid} predicted retention at day 30: {ret*100:.0f}%")

print(f"\
Key insight: The algorithm adapts to each learner. It does not treat")
print(f"everyone the same. This is what makes modern systems like Anki more")
print(f"effective than fixed study schedules — and why the grandmother adjusted")
print(f"her storytelling frequency for each grandchild.")`,
      challenge: "Combine the models from all six lessons into a unified analysis pipeline. Run it on a new dataset and generate a comprehensive summary report.",
      successHint: "You have built a complete analytical framework for this domain — from raw data to validated predictions.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (neuroscience fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for memory neuroscience and spaced repetition algorithms. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            />
        ))}
      </div>
    </div>
  );
}
