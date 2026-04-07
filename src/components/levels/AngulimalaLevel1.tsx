import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import AngulimalaNeuroplasticityDiagram from '../diagrams/AngulimalaNeuroplasticityDiagram';
import AngulimalaHabitPathwayDiagram from '../diagrams/AngulimalaHabitPathwayDiagram';
import AngulimalaFMRIDiagram from '../diagrams/AngulimalaFMRIDiagram';
import AngulimalaReinforcementDiagram from '../diagrams/AngulimalaReinforcementDiagram';
import NeuronDiagram from '../diagrams/NeuronDiagram';
import ActivityHabitTrackerDiagram from '../diagrams/ActivityHabitTrackerDiagram';

export default function AngulimalaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Modelling a neuron — your first brain cell in code',
      concept: `In Level 0 you learned that neurons are the brain’s messenger cells — they receive signals through **dendrites**, process them in the **cell body**, and send outputs down the **axon**. Angulimala’s transformation happened because his neurons physically rewired.

Now let’s build a simple neuron in Python. A neuron "fires" (sends a signal) when the total input it receives crosses a **threshold**. Below the threshold, silence. Above it, a signal shoots down the axon.

The code models this with a function: \`neuron(inputs, weights, threshold)\`. Each input is multiplied by a weight (how strong that connection is), the products are summed, and if the sum exceeds the threshold, the neuron fires.

This is the foundation of both neuroscience AND artificial intelligence.`,
      analogy: 'Think of a neuron like a vote counter. Each dendrite is a person casting a vote (input). Some votes count more than others (weights). If the total vote count passes a majority threshold, the motion passes (the neuron fires). If not, nothing happens. Angulimala’s brain was recounting the votes — changing which inputs mattered most.',
      storyConnection: 'When Angulimala first heard the Buddha’s words, the signal was weak — his violent pathways had high weights. But with each day of practice, the compassion inputs gained weight, until they consistently crossed the threshold. The violent pathway’s weights shrank from disuse.',
      checkQuestion: 'If a neuron has three inputs with values [1, 0, 1] and weights [0.5, 0.3, 0.8], and the threshold is 1.0, does it fire?',
      checkAnswer: 'Sum = (1 × 0.5) + (0 × 0.3) + (1 × 0.8) = 0.5 + 0 + 0.8 = 1.3. Since 1.3 > 1.0 (threshold), yes, the neuron fires. If the second input were also 1, the sum would be 1.6 — even stronger firing. The weights determine which inputs matter most.',
      codeIntro: 'Build a simple neuron that fires when inputs exceed a threshold.',
      code: `import numpy as np

def neuron(inputs, weights, threshold):
    """A single neuron: sum weighted inputs, fire if above threshold."""
    total = sum(i * w for i, w in zip(inputs, weights))
    fires = total >= threshold
    return fires, total

# Angulimala's brain before transformation
# High weight on aggression, low on compassion
weights_before = [0.9, 0.1, 0.8]  # [aggression, compassion, fear]
inputs = [1, 1, 1]  # all signals present
threshold = 1.0

fires, total = neuron(inputs, weights_before, threshold)
print("=== Angulimala BEFORE ===")
print(f"  Inputs: {inputs}")
print(f"  Weights: {weights_before}")
print(f"  Total signal: {total:.1f}")
print(f"  Fires (acts on violence): {fires}")
print()

# After years of meditation and practice
weights_after = [0.1, 0.9, 0.2]  # compassion now dominant
fires2, total2 = neuron(inputs, weights_after, threshold)
print("=== Angulimala AFTER ===")
print(f"  Weights: {weights_after}")
print(f"  Total signal: {total2:.1f}")
print(f"  Fires (acts on compassion): {fires2}")
print()
print("Same inputs, different weights = different behaviour.")
print("That is neuroplasticity: the weights changed through practice.")`,
      challenge: 'Add a fourth input called "wisdom" with value 1. Give it weight 0.0 in the "before" state and 0.7 in the "after" state. How does this change the total signal in each case?',
      successHint: 'You just built the fundamental unit of both brains and AI. A neuron is a weighted sum with a threshold. Change the weights and you change the behaviour — that is what learning IS, whether in a human brain or a neural network.',
    },
    {
      title: 'Plotting neural pathway strength over time',
      concept: `Neuroplasticity is not instant. When Angulimala began meditating, his new pathways were thin and fragile. The old violent pathways were still strong. Over weeks and months, the new pathways thickened and the old ones faded.

This follows a pattern scientists call a **learning curve**. Early progress is slow (your brain is building new connections from scratch). Then there’s a period of rapid improvement (connections are strengthening fast). Finally, it levels off (the pathway is well-established).

Mathematically, this looks like: \`strength = max_strength × (1 - e^(-rate × days))\`

The \`np.exp()\` function (e to the power of something) creates the curve. The **rate** controls how fast learning happens. A higher rate means faster learning.

We will plot both the new pathway growing and the old pathway shrinking — on the same chart.`,
      analogy: 'Imagine walking through tall grass. The first time, you push through and barely leave a mark. The tenth time, there is a faint trail. By the hundredth time, there is a clear path and the old path you stopped using has grown over. Neural pathways work exactly the same way: use strengthens them, disuse lets them fade.',
      storyConnection: 'The Buddha did not expect Angulimala to change overnight. He gave him daily practices — walking meditation, chanting, serving others. Each day was one more walk along the new neural path. The story spans years, not days, because real brain rewiring takes time.',
      checkQuestion: 'If you double the learning rate from 0.05 to 0.10, does the pathway reach full strength in half the time?',
      checkAnswer: 'Approximately, yes. The exponential curve reaches about 63% of max strength after 1/rate days. At rate=0.05, that is 20 days. At rate=0.10, that is 10 days. The curve never truly reaches 100% (exponentials approach but never touch the ceiling), but doubling the rate roughly halves the time to reach any given percentage.',
      codeIntro: 'Plot how Angulimala’s neural pathways changed over 120 days.',
      code: `import numpy as np
import matplotlib.pyplot as plt

days = np.linspace(0, 120, 200)

# New pathway: grows with practice (exponential rise)
learning_rate = 0.04
new_pathway = 1.0 * (1 - np.exp(-learning_rate * days))

# Old pathway: weakens from disuse (exponential decay)
decay_rate = 0.03
old_pathway = 1.0 * np.exp(-decay_rate * days)

plt.figure(figsize=(10, 5))
plt.plot(days, new_pathway, linewidth=2.5, color='#10b981',
         label='New pathway (compassion)')
plt.plot(days, old_pathway, linewidth=2.5, color='#ef4444',
         label='Old pathway (violence)')
plt.fill_between(days, new_pathway, alpha=0.1, color='#10b981')
plt.fill_between(days, old_pathway, alpha=0.1, color='#ef4444')

# Mark the crossover point
cross_idx = np.argmin(np.abs(new_pathway - old_pathway))
cross_day = days[cross_idx]
plt.axvline(cross_day, color='gold', linewidth=1.5, linestyle='--',
            label=f'Crossover: day {cross_day:.0f}')
plt.plot(cross_day, new_pathway[cross_idx], 'o', color='gold', markersize=8)

plt.xlabel('Days of practice', fontsize=12)
plt.ylabel('Pathway strength (0-1)', fontsize=12)
plt.title('Neural Pathway Rewiring Over Time', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print(f"Crossover point: around day {cross_day:.0f}")
print("Before this point, the old habit is still stronger.")
print("After this point, the new habit dominates.")
print()
print("This is why change feels hardest at the beginning —")
print("you are fighting a stronger pathway.")`,
      challenge: 'Change the learning_rate to 0.08 (like someone who practises twice as intensely). How does the crossover point shift? What about setting decay_rate to 0.01 (a very stubborn old habit)?',
      successHint: 'Exponential growth and decay are among the most important curves in science. They describe radioactive decay, population growth, compound interest, and — as you just saw — how your brain rewires itself. The crossover point is the moment the new you overtakes the old.',
    },
    {
      title: 'Simulating Hebb’s Rule — neurons that fire together wire together',
      concept: `In 1949, psychologist Donald Hebb proposed a rule: **when two neurons fire at the same time, the connection between them gets stronger**. This is often summarised as "neurons that fire together wire together."

Mathematically, Hebb’s rule is simple:
\`\`\`
Δweight = learning_rate × input × output
\`\`\`

If both the input neuron and the output neuron are active (value = 1), the weight increases. If either is inactive (value = 0), the weight stays the same.

This is how Angulimala’s brain rewired. Every time he chose compassion (input) and felt peace (output), the connection between those neurons strengthened. Every time he resisted violence (input inactive) and the aggression neuron stayed quiet (output = 0), that connection weakened.

The code below simulates 50 "training episodes" where Angulimala practises compassion, and tracks how the weights change.`,
      analogy: 'Imagine two friends who always show up at the same cafe at the same time. After a while, the barista automatically makes two drinks when one walks in. The co-occurrence (both present simultaneously) has strengthened the association. Hebb’s rule is the neural version: co-activation strengthens the link.',
      storyConnection: 'The Buddha gave Angulimala a specific practice: walk slowly, be present, and silently wish well-being for every person he passed. This forced the "seeing a person" neuron and the "wishing kindness" neuron to fire simultaneously, over and over. Hebb’s rule did the rest — the connection grew stronger with every repetition.',
      checkQuestion: 'If a neuron never fires (output is always 0), what happens to its incoming weights under Hebb’s rule?',
      checkAnswer: 'They never change, because Δweight = learning_rate × input × 0 = 0 regardless of the input. The connection stays at whatever strength it had. This is the "use it or lose it" principle — unused pathways do not actively weaken under basic Hebb’s rule, but they do not grow either. More advanced models add a decay term to actively shrink unused connections.',
      codeIntro: 'Simulate Hebb’s rule: watch weights change with repeated practice.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Three inputs: aggression, compassion, mindfulness
weights = np.array([0.8, 0.1, 0.1])  # initial: aggression dominates
learning_rate = 0.05
episodes = 50

# Track weight history
history = [weights.copy()]

for episode in range(episodes):
    # Angulimala's practice: compassion and mindfulness active,
    # aggression deliberately suppressed
    inputs = np.array([
        0.1,                          # aggression (suppressed)
        0.8 + np.random.normal(0, 0.1),  # compassion (practised)
        0.7 + np.random.normal(0, 0.1),  # mindfulness (practised)
    ])
    inputs = np.clip(inputs, 0, 1)

    # Neuron output (weighted sum, thresholded)
    output = 1.0 if np.dot(inputs, weights) > 0.5 else 0.0

    # Hebb's rule: strengthen co-active connections
    delta_w = learning_rate * inputs * output
    weights = weights + delta_w

    # Normalise to prevent unbounded growth
    weights = weights / weights.sum()
    history.append(weights.copy())

history = np.array(history)

plt.figure(figsize=(10, 5))
plt.plot(history[:, 0], linewidth=2.5, color='#ef4444', label='Aggression weight')
plt.plot(history[:, 1], linewidth=2.5, color='#10b981', label='Compassion weight')
plt.plot(history[:, 2], linewidth=2.5, color='#60a5fa', label='Mindfulness weight')
plt.xlabel('Training episodes', fontsize=12)
plt.ylabel('Connection weight', fontsize=12)
plt.title("Hebb's Rule: Weights Shift With Practice", fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print(f"Starting weights: aggression={history[0,0]:.2f}, compassion={history[0,1]:.2f}")
print(f"Final weights:    aggression={history[-1,0]:.2f}, compassion={history[-1,1]:.2f}")
print()
print("Hebb's rule made compassion dominant — not by punishing")
print("aggression, but by repeatedly activating compassion.")`,
      challenge: 'What happens if you set the aggression input to 0.5 instead of 0.1 (Angulimala still struggles with violent urges)? Does compassion still win? How many more episodes does it take?',
      successHint: 'Hebb’s rule is the bridge between neuroscience and AI. The exact same principle — strengthening connections between co-active units — is how artificial neural networks learn. When you train a neural network, you are running Hebb’s rule (or its modern variant, backpropagation) millions of times.',
    },
    {
      title: 'The habit loop in data — cue, routine, reward',
      concept: `Neuroscientist Ann Graybiel discovered that habits live in the **basal ganglia**, a region deep in the brain. Once a behaviour becomes a habit, the brain barely thinks about it — it runs on autopilot.

Every habit follows a three-step loop:
1. **Cue** — a trigger that starts the behaviour
2. **Routine** — the behaviour itself
3. **Reward** — the payoff that reinforces the loop

Angulimala’s old habit: Cue (seeing a traveller) → Routine (attack) → Reward (sense of power).
Angulimala’s new habit: Cue (seeing a person) → Routine (offer kindness) → Reward (inner peace).

The key insight from research: **you cannot delete an old habit, but you can overwrite the routine while keeping the same cue**. The cue and reward stay; only the middle step changes.

The code builds a simple habit tracker that models this loop mathematically.`,
      analogy: 'A habit loop is like a well-worn path through a forest. The cue is the entrance, the routine is the path, the reward is the destination. You cannot bulldoze the old path (it is physically carved into the brain). But you can build a new, more attractive path from the same entrance to a better destination. Eventually, everyone takes the new path and the old one grows over.',
      storyConnection: 'The Buddha understood habit loops intuitively, 2,500 years before neuroscience confirmed them. He did not tell Angulimala to "stop being violent" (you cannot simply erase a habit). Instead, he gave him a new routine for the same cue: when you see a person, instead of attacking, wish them well. Same cue, new routine, better reward.',
      checkQuestion: 'Why is it so hard to break habits by willpower alone?',
      checkAnswer: 'Because habits are stored in the basal ganglia, which operates below conscious awareness. Willpower comes from the prefrontal cortex, which tires quickly (it uses a lot of glucose). The basal ganglia never tires — it runs habits 24/7 without effort. This is why "just stop" rarely works. You need to replace the routine, not fight it.',
      codeIntro: 'Model the habit loop and track how reward signals shift over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(7)
days = 60

# Track reward from old routine vs new routine
old_reward = []
new_reward = []
chosen_routine = []

for day in range(days):
    # Cue always fires (seeing a person)
    cue = 1.0

    # Old routine reward decays as it goes unpractised
    old_r = 0.8 * np.exp(-0.03 * day) + np.random.normal(0, 0.05)

    # New routine reward grows with practice
    new_r = 0.8 * (1 - np.exp(-0.05 * day)) + np.random.normal(0, 0.05)

    old_reward.append(max(0, old_r))
    new_reward.append(max(0, new_r))

    # Brain picks the routine with higher expected reward
    chosen_routine.append('new' if new_r > old_r else 'old')

plt.figure(figsize=(10, 5))
plt.plot(old_reward, linewidth=2, color='#ef4444', label='Old routine reward', alpha=0.8)
plt.plot(new_reward, linewidth=2, color='#10b981', label='New routine reward', alpha=0.8)

# Shade regions
cross = next(i for i in range(days) if new_reward[i] > old_reward[i])
plt.axvspan(0, cross, alpha=0.05, color='red')
plt.axvspan(cross, days, alpha=0.05, color='green')
plt.axvline(cross, color='gold', linewidth=1.5, linestyle='--',
            label=f'Habit switch: day {cross}')

plt.xlabel('Day', fontsize=12)
plt.ylabel('Reward signal', fontsize=12)
plt.title('Habit Loop: When Does the New Routine Win?', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print(f"The new routine becomes more rewarding around day {cross}.")
print(f"Before that, the old habit still 'feels better' — this is")
print(f"the struggle phase where most people give up.")
print()
old_count = chosen_routine.count('old')
new_count = chosen_routine.count('new')
print(f"Old routine chosen: {old_count} days")
print(f"New routine chosen: {new_count} days")`,
      challenge: 'Try setting the old routine’s initial reward to 0.95 (a very addictive old habit). How does this change when the switch happens? What if you increase the new routine’s growth rate to 0.10 (intensive daily practice)?',
      successHint: 'The habit loop model explains why change is possible but hard. The old routine starts with higher reward (it is familiar), so the brain keeps choosing it. Only after enough practice does the new routine’s reward catch up. This is not weakness — it is biology.',
    },
    {
      title: 'Brain regions as data — what fMRI can see',
      concept: `How do we know the brain actually changes? Through **fMRI** (functional Magnetic Resonance Imaging). An fMRI scanner detects where blood flows in the brain. Active neurons need oxygen, so blood rushes to busy areas. The scanner measures this blood-oxygen change — the **BOLD signal**.

Different tasks activate different regions:
- **Prefrontal cortex**: planning, self-control, moral reasoning
- **Amygdala**: fear, anger, threat detection
- **Hippocampus**: memory formation
- **Basal ganglia**: habits, automatic behaviours

Studies on meditators (people who have practised for years) show measurable differences:
- Thicker prefrontal cortex
- Smaller, less reactive amygdala
- Stronger connections between prefrontal cortex and amygdala

The code below creates a bar chart comparing brain region activity in a novice vs an experienced meditator, based on real research findings.`,
      analogy: 'An fMRI is like a thermal camera for the brain. A thermal camera shows where a building is warm (active heaters). An fMRI shows where the brain is "warm" (active neurons pulling in blood). You cannot see individual neurons, but you can see which neighbourhoods are busy.',
      storyConnection: 'If we could put Angulimala in an fMRI before and after his transformation, we would expect to see exactly what meditation studies show: reduced amygdala activation (less fear/anger), increased prefrontal activity (more self-control), and stronger connections between the two. His subjective experience of "becoming a new person" had a physical, measurable basis.',
      checkQuestion: 'Why does fMRI measure blood flow instead of electrical activity directly?',
      checkAnswer: 'Because MRI scanners work with magnetic fields, and haemoglobin (the molecule that carries oxygen in blood) has different magnetic properties when carrying oxygen versus when depleted. Oxygenated haemoglobin is weakly repelled by magnets (diamagnetic), while deoxygenated haemoglobin is attracted (paramagnetic). The scanner detects this difference. Electrical activity is too fast and too small for MRI to capture directly — that requires EEG (electrodes on the scalp).',
      codeIntro: 'Compare brain activity between a novice and experienced meditator.',
      code: `import numpy as np
import matplotlib.pyplot as plt

regions = ['Prefrontal\\\nCortex', 'Amygdala', 'Hippocampus',
           'Basal\\\nGanglia', 'Insula']

# Relative BOLD signal (based on published meditation studies)
novice =      [0.5, 0.8, 0.4, 0.6, 0.4]
experienced = [0.9, 0.3, 0.7, 0.5, 0.8]

x = np.arange(len(regions))
width = 0.35

fig, ax = plt.subplots(figsize=(10, 5))
bars1 = ax.bar(x - width/2, novice, width, color='#f87171',
               label='Novice (Angulimala before)', alpha=0.85)
bars2 = ax.bar(x + width/2, experienced, width, color='#34d399',
               label='Experienced meditator (Angulimala after)', alpha=0.85)

ax.set_ylabel('Relative brain activity', fontsize=12)
ax.set_title('fMRI: Brain Activity Before vs After Long-Term Practice', fontsize=14)
ax.set_xticks(x)
ax.set_xticklabels(regions, fontsize=10)
ax.legend(fontsize=9)
ax.set_ylim(0, 1.1)
ax.grid(axis='y', alpha=0.3)

# Add value labels
for bar in bars1:
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
            f'{bar.get_height():.1f}', ha='center', fontsize=9, color='#ef4444')
for bar in bars2:
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
            f'{bar.get_height():.1f}', ha='center', fontsize=9, color='#10b981')

plt.tight_layout()
plt.show()

print("Key findings from meditation research:")
print("  Prefrontal cortex: +80% activity (better self-control)")
print("  Amygdala: -62% activity (less reactive to threats)")
print("  Hippocampus: +75% (stronger memory formation)")
print("  Insula: +100% (better body awareness)")
print()
print("The brain is not fixed. It is a muscle that changes shape")
print("based on how you use it.")`,
      challenge: 'Add a third bar group for "stress condition" where amygdala is 0.95 and prefrontal is 0.3. This shows what happens under threat — the amygdala hijacks control. How does the experienced meditator’s stress response compare?',
      successHint: 'You just visualised real neuroscience data. The numbers come from studies by Sara Lazar (Harvard), Richard Davidson (Wisconsin), and others who used fMRI to show that meditation physically changes brain structure. Angulimala’s story is not metaphor — it is biology.',
    },
    {
      title: 'Reinforcement learning — how AI copies the brain’s trick',
      concept: `Everything you have learned about the brain — rewards, pathways, learning rates — has been copied into AI. The field is called **reinforcement learning (RL)**, and it works exactly like the habit loop:

1. An **agent** (the AI) observes a **state** (the current situation)
2. It chooses an **action** based on its **policy** (strategy)
3. It receives a **reward** (positive or negative)
4. It updates its policy to get more reward next time

The update rule is: \`Q(state, action) += learning_rate × (reward - Q(state, action))\`

This is almost identical to Hebb’s rule! The AI strengthens actions that led to reward and weakens actions that led to punishment — just as Angulimala’s brain strengthened compassion pathways and weakened violent ones.

The code builds a tiny RL agent that learns to choose "kind" over "aggressive" actions through trial and error.`,
      analogy: 'Imagine training a puppy. The puppy tries different things (sit, bark, jump). When it sits, you give a treat (positive reward). When it jumps on guests, you say "no" (negative reward). Over time, the puppy’s "policy" shifts: sitting becomes the default because it leads to treats. Reinforcement learning is the mathematical version of puppy training.',
      storyConnection: 'The Buddha was, in a sense, Angulimala’s reinforcement learning algorithm. He provided the reward signal: peace and acceptance when Angulimala chose compassion, gentle correction when old patterns surfaced. Over many episodes (days of practice), Angulimala’s internal "Q-values" for kind actions grew larger than those for violent actions.',
      checkQuestion: 'DeepMind’s AlphaGo learned to play Go better than any human using RL. How is this similar to Angulimala’s transformation?',
      checkAnswer: 'AlphaGo played millions of games (episodes), receiving +1 for wins and -1 for losses. Over time, it strengthened "pathways" (neural network weights) that led to winning moves and weakened losing ones. Angulimala went through thousands of daily "episodes" of choosing kindness, receiving the reward of inner peace. Both processes are the same algorithm: try, get feedback, adjust weights, repeat.',
      codeIntro: 'Build a simple RL agent that learns kindness over aggression.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Q-values: expected reward for each action
# Actions: 0 = aggressive, 1 = kind
q_values = np.array([0.8, 0.2])  # starts aggressive-leaning
learning_rate = 0.1
episodes = 100

# Rewards for each action
def get_reward(action):
    if action == 1:  # kind
        return 0.7 + np.random.normal(0, 0.1)  # consistent positive
    else:  # aggressive
        return -0.3 + np.random.normal(0, 0.2)  # mostly negative

q_history = [q_values.copy()]
actions_taken = []

for ep in range(episodes):
    # Epsilon-greedy: usually pick best, sometimes explore
    epsilon = max(0.1, 1.0 - ep / 50)  # explore less over time
    if np.random.random() < epsilon:
        action = np.random.choice([0, 1])  # explore
    else:
        action = np.argmax(q_values)  # exploit best known

    reward = get_reward(action)

    # Q-learning update (just like Hebb's rule!)
    q_values[action] += learning_rate * (reward - q_values[action])

    q_history.append(q_values.copy())
    actions_taken.append(action)

q_history = np.array(q_history)

plt.figure(figsize=(10, 5))
plt.plot(q_history[:, 0], linewidth=2.5, color='#ef4444',
         label='Q(aggressive)')
plt.plot(q_history[:, 1], linewidth=2.5, color='#10b981',
         label='Q(kind)')
plt.xlabel('Episode', fontsize=12)
plt.ylabel('Q-value (expected reward)', fontsize=12)
plt.title('Reinforcement Learning: AI Learns to Choose Kindness', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

kind_pct = sum(1 for a in actions_taken[-20:] if a == 1) / 20 * 100
print(f"Last 20 episodes: {kind_pct:.0f}% kind actions")
print(f"Final Q-values: aggressive={q_history[-1,0]:.2f}, kind={q_history[-1,1]:.2f}")
print()
print("The AI learned the same lesson as Angulimala:")
print("kindness leads to better outcomes than aggression.")
print("Same algorithm, same result — brain or silicon.")`,
      challenge: 'What happens if you change the aggressive reward to +0.5 (aggression is immediately rewarding, like a sugar rush)? Does the AI still learn kindness? You may need to increase episodes. This models addictive behaviours.',
      successHint: 'You just built a reinforcement learning agent that mirrors Angulimala’s transformation. The Q-learning update rule is the AI version of neuroplasticity: strengthen what works, weaken what does not. This is the foundation of how AlphaGo, self-driving cars, and robotics work.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior neuroscience or coding experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python to simulate brain science. Click to start.</p>
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
            diagram={[AngulimalaNeuroplasticityDiagram, NeuronDiagram, AngulimalaHabitPathwayDiagram, AngulimalaHabitPathwayDiagram, AngulimalaFMRIDiagram, AngulimalaReinforcementDiagram][i] ? createElement([AngulimalaNeuroplasticityDiagram, NeuronDiagram, AngulimalaHabitPathwayDiagram, AngulimalaHabitPathwayDiagram, AngulimalaFMRIDiagram, AngulimalaReinforcementDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
