import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AngulimalaFMRIDiagram from '../diagrams/AngulimalaFMRIDiagram';
import AngulimalaReinforcementDiagram from '../diagrams/AngulimalaReinforcementDiagram';
import AngulimalaNeuroplasticityDiagram from '../diagrams/AngulimalaNeuroplasticityDiagram';
import AngulimalaHabitPathwayDiagram from '../diagrams/AngulimalaHabitPathwayDiagram';
import NeuralNetworkDiagram from '../diagrams/NeuralNetworkDiagram';
import NeuronDiagram from '../diagrams/NeuronDiagram';

export default function AngulimalaLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Q-learning with a grid world \u2014 navigating from violence to peace',
      concept: `In Level 2 you learned TD learning for value estimation. Now we build a full **Q-learning** agent that learns to navigate a grid world. Q-learning maintains a table of Q(state, action) values \u2014 the expected reward for taking each action in each state.

The update: \`Q(s,a) += \u03b1 \u00d7 [r + \u03b3\u00b7max_a\u2019 Q(s\u2019,a\u2019) - Q(s,a)]\`

The key difference from TD: Q-learning uses the **maximum** future Q-value, which means the agent always plans assuming it will act optimally in the future. This is called an **off-policy** method.

We model Angulimala\u2019s journey as a 5\u00d75 grid. The top-left is the "violent" state, the bottom-right is the "peaceful" state. Obstacles (triggers, temptations) block some paths. The agent must learn the optimal path from violence to peace.`,
      analogy: 'Q-learning is like a taxi driver learning the city. At each intersection, they estimate the value of going north, south, east, or west. After many trips, they know: "at 5th and Main, go east" because that route has historically led to the biggest tips. The Q-table is the driver\u2019s mental map of the best routes.',
      storyConnection: 'Angulimala\u2019s journey from bandit to saint was not a straight line. He hit obstacles: old companions, familiar triggers, moments of doubt. Q-learning models this \u2014 the agent must navigate around obstacles, sometimes taking indirect paths, to reach the goal. The optimal path is rarely the obvious one.',
      checkQuestion: 'What happens if you set the discount factor \u03b3 to 0? Does the agent still find the goal?',
      checkAnswer: 'With \u03b3=0, the agent only values immediate reward and completely ignores future states. It would only learn to take actions that give immediate reward, making it unable to plan multi-step paths to distant goals. It would get stuck near any local reward even if the goal is far away. This models impulsive behaviour \u2014 unable to sacrifice immediate comfort for long-term gain.',
      codeIntro: 'Build a Q-learning agent that navigates a grid from violence to peace.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 5x5 grid world
grid_size = 5
n_states = grid_size * grid_size
n_actions = 4  # up, down, left, right
actions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
action_names = ['Up', 'Down', 'Left', 'Right']

# Rewards: -0.1 per step, -1 for obstacles, +10 for goal
rewards = np.full((grid_size, grid_size), -0.1)
rewards[4, 4] = 10.0    # goal: peace
rewards[1, 2] = -1.0    # trigger/temptation
rewards[3, 1] = -1.0    # old companion
rewards[2, 3] = -1.0    # anger trigger

# Q-table
Q = np.zeros((grid_size, grid_size, n_actions))
alpha = 0.1
gamma = 0.95
episodes = 500
epsilon = 0.3

episode_rewards = []

for ep in range(episodes):
    row, col = 0, 0  # start: violent state
    total_reward = 0

    for step in range(50):
        # Epsilon-greedy action selection
        if np.random.random() < max(0.01, epsilon * (1 - ep/400)):
            action = np.random.randint(n_actions)
        else:
            action = np.argmax(Q[row, col])

        # Take action
        dr, dc = actions[action]
        new_row = np.clip(row + dr, 0, grid_size - 1)
        new_col = np.clip(col + dc, 0, grid_size - 1)

        reward = rewards[new_row, new_col]
        total_reward += reward

        # Q-learning update
        best_next = np.max(Q[new_row, new_col])
        Q[row, col, action] += alpha * (reward + gamma * best_next - Q[row, col, action])

        row, col = new_row, new_col
        if row == 4 and col == 4:
            break

    episode_rewards.append(total_reward)

# Plot learning curve
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Smoothed rewards
window = 20
smoothed = np.convolve(episode_rewards, np.ones(window)/window, mode='valid')
ax1.plot(smoothed, linewidth=2, color='#10b981')
ax1.set_xlabel('Episode', fontsize=11)
ax1.set_ylabel('Total reward', fontsize=11)
ax1.set_title('Q-Learning: Reward Over Time', fontsize=13)
ax1.grid(alpha=0.3)

# Optimal policy visualization
policy_arrows = {0: '\u2191', 1: '\u2193', 2: '\u2190', 3: '\u2192'}
ax2.set_xlim(-0.5, grid_size - 0.5)
ax2.set_ylim(-0.5, grid_size - 0.5)
ax2.invert_yaxis()

for r in range(grid_size):
    for c in range(grid_size):
        color = '#1f2937'
        if rewards[r, c] == -1.0:
            ax2.add_patch(plt.Rectangle((c-0.4, r-0.4), 0.8, 0.8,
                facecolor='#ef4444', alpha=0.3))
            color = '#ef4444'
        if r == 4 and c == 4:
            ax2.add_patch(plt.Rectangle((c-0.4, r-0.4), 0.8, 0.8,
                facecolor='#10b981', alpha=0.3))
        best_a = np.argmax(Q[r, c])
        ax2.text(c, r, policy_arrows[best_a], ha='center', va='center',
                fontsize=16, color=color, fontweight='bold')

ax2.set_title('Learned Policy (arrows = best action)', fontsize=13)
ax2.set_xlabel('Column', fontsize=11)
ax2.set_ylabel('Row', fontsize=11)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("The agent learned to navigate from Violence (0,0) to Peace (4,4)")
print("while avoiding triggers (red squares).")
print(f"Average reward (last 50 episodes): {np.mean(episode_rewards[-50:]):.2f}")`,
      challenge: 'Add a "relapse" square at (2,2) with reward -5 that teleports the agent back to (0,0). Does the agent learn to avoid it? How does this change the optimal path?',
      successHint: 'Q-learning is the algorithm behind many real-world AI systems. DeepMind used deep Q-networks (DQN) to play Atari games at superhuman level. The grid world you just built is a miniature version of the same problem \u2014 navigating a complex environment to maximise long-term reward.',
    },
    {
      title: 'Policy gradient methods \u2014 learning probability distributions over actions',
      concept: `Q-learning assigns a value to each action. **Policy gradient** methods directly learn a probability distribution over actions \u2014 a "soft" policy that says "in this state, choose action A with 70% probability and action B with 30%."

Why is this better? Because many real situations require **stochastic** (probabilistic) behaviour. A poker player who always bets the same way is predictable. A person learning to manage anger needs flexibility, not rigid rules.

The update: \`\u03b8 += \u03b1 \u00d7 R \u00d7 \u2207_\u03b8 log \u03c0(a|s)\`

Where \u03b8 are the policy parameters, R is the reward, and \u03c0(a|s) is the probability of choosing action a in state s. If an action led to high reward, increase its probability. If it led to low reward, decrease it.

This models Angulimala\u2019s gradual shift. He did not switch from 100% violence to 100% compassion overnight. His probability of choosing kindness gradually increased from 5% to 95% over months of practice.`,
      analogy: 'Q-learning is like having a rule book: "In situation X, always do Y." Policy gradient is like having intuition: "In situation X, I tend to do Y about 70% of the time, but sometimes Z feels right." The second approach is more flexible and more human. It allows for the messy, gradual process of real change.',
      storyConnection: 'In the early days of his practice, Angulimala probably chose compassion only 10% of the time. The rest was old habit. But each time compassion led to peace (positive reward), his policy gradient shifted: 10% became 20%, then 40%, then 80%. The probability changed continuously, not in a sudden switch.',
      checkQuestion: 'Why do policy gradient methods sometimes outperform Q-learning?',
      checkAnswer: 'In environments with continuous action spaces (like controlling a robot arm angle) or high-dimensional state spaces, maintaining a Q-table is impossible. Policy gradients parameterise the policy directly, scaling much better. They also naturally handle stochastic optimal policies (situations where the best strategy involves randomness). Q-learning always picks the single best action, which can be suboptimal in adversarial or partially-observed environments.',
      codeIntro: 'Implement REINFORCE, the simplest policy gradient algorithm.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simple 2-action problem: kind vs aggressive
# The policy is parameterised by a single value theta
# P(kind) = sigmoid(theta), P(aggressive) = 1 - P(kind)

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -10, 10)))

theta = -2.0  # starts aggressive-leaning (P(kind) ~ 0.12)
lr = 0.3
episodes = 150

prob_kind_history = []
reward_history = []

for ep in range(episodes):
    p_kind = sigmoid(theta)
    prob_kind_history.append(p_kind)

    # Sample action from policy
    action = 1 if np.random.random() < p_kind else 0  # 1=kind, 0=aggressive

    # Get reward
    if action == 1:
        reward = 0.8 + np.random.normal(0, 0.2)
    else:
        reward = -0.3 + np.random.normal(0, 0.3)

    reward_history.append(reward)

    # Policy gradient update (REINFORCE)
    if action == 1:
        grad = 1 - p_kind  # d/dtheta log P(kind) = 1 - sigmoid(theta)
    else:
        grad = -p_kind     # d/dtheta log P(aggressive) = -sigmoid(theta)

    theta += lr * reward * grad

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(prob_kind_history, linewidth=2.5, color='#10b981')
ax1.set_xlabel('Episode', fontsize=11)
ax1.set_ylabel('P(kind)', fontsize=11)
ax1.set_title('Policy Gradient: P(Kindness) Over Time', fontsize=13)
ax1.axhline(0.5, color='gray', linewidth=1, linestyle=':')
ax1.set_ylim(0, 1)
ax1.grid(alpha=0.3)

# Smoothed reward
window = 10
smoothed = np.convolve(reward_history, np.ones(window)/window, mode='valid')
ax2.plot(smoothed, linewidth=2, color='#8b5cf6')
ax2.set_xlabel('Episode', fontsize=11)
ax2.set_ylabel('Average reward', fontsize=11)
ax2.set_title('Reward: Improves as Kindness Increases', fontsize=13)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"P(kind) at start:  {prob_kind_history[0]:.2f}")
print(f"P(kind) at end:    {prob_kind_history[-1]:.2f}")
print(f"Theta: {-2.0:.1f} -> {theta:.1f}")
print()
print("The policy shifted gradually from mostly-aggressive to")
print("mostly-kind — a smooth curve, not a sudden switch.")
print("This matches how real behaviour change works.")`,
      challenge: 'Start with theta = +2.0 (already kind). Give aggressive actions a high reward of 1.5 (temptation). Can the policy gradient be pushed backward? This models relapse when rewards for bad behaviour are high.',
      successHint: 'REINFORCE is the foundation of modern policy gradient methods like PPO (used in ChatGPT\u2019s RLHF training), A2C, and TRPO. You just implemented the core algorithm that powers the training of the most advanced AI systems in the world.',
    },
    {
      title: 'Simulating fMRI data \u2014 the BOLD signal as a time series',
      concept: `Real fMRI data is a 4D dataset: 3D brain volume \u00d7 time. Each volumetric "pixel" (called a **voxel**, typically 2mm\u00b3) has a time series showing BOLD signal fluctuations.

The BOLD signal is not a direct readout of neural activity. It is a **haemodynamic response** \u2014 the blood flow change that follows neural firing with a 4-6 second delay. The shape of this response is well-characterised:

1. Neural activity begins (t=0)
2. Initial dip in oxygen (t\u22481 sec)
3. Blood rushes in, overshooting need (peak at t\u22485 sec)
4. Signal returns to baseline (t\u224812 sec)
5. Brief undershoot before settling (t\u224815 sec)

This **haemodynamic response function (HRF)** is convolved with the neural activity to produce the measured signal. The code simulates this for a meditation study.`,
      analogy: 'The BOLD signal is like a traffic report for the brain. When lots of cars (blood) rush to an intersection (active brain area), you know something is happening there (neural activity). But the traffic report is delayed \u2014 it takes a few seconds for the cars to arrive. You never see the event directly; you see the traffic jam it causes.',
      storyConnection: 'If we scanned Angulimala\u2019s brain during meditation, we would see the HRF in his prefrontal cortex: a delayed rise in blood flow as he focused on compassion, peaking after 5 seconds, then settling. Over months, the resting level of prefrontal activity would increase \u2014 the "baseline" shifts upward with practice.',
      checkQuestion: 'Why is fMRI spatial resolution (~2mm) much better than EEG (~2cm) but temporal resolution (~2sec) much worse than EEG (~1ms)?',
      checkAnswer: 'fMRI measures blood flow changes, which are localised to specific brain areas (good spatial resolution) but sluggish (blood takes seconds to respond). EEG measures electrical fields at the scalp, which are fast (millisecond resolution) but spread out and overlap (poor spatial resolution because signals blur as they pass through skull and skin). They are complementary tools: EEG for "when" and fMRI for "where."',
      codeIntro: 'Simulate the BOLD signal from neural activity using the haemodynamic response function.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Haemodynamic Response Function (double gamma)
def hrf(t, peak=5.0, undershoot=15.0, peak_amp=1.0, undershoot_amp=0.35):
    from math import gamma as gamma_fn
    # Double gamma function (canonical HRF model)
    a1, b1 = peak, 1.0
    a2, b2 = undershoot, 1.0
    h = (t ** (a1 - 1) * np.exp(-b1 * t) / gamma_fn(a1) -
         undershoot_amp * t ** (a2 - 1) * np.exp(-b2 * t) / gamma_fn(a2))
    return h / np.max(h) * peak_amp

# Time axis (seconds)
t = np.linspace(0, 30, 300)
dt = t[1] - t[0]

# HRF
h = hrf(t)

# Neural activity: meditation blocks (30 sec on, 30 sec off)
total_time = np.linspace(0, 120, 1200)
neural = np.zeros_like(total_time)
neural[100:400] = 1.0   # meditation block 1 (10-40 sec)
neural[600:900] = 1.0   # meditation block 2 (60-90 sec)

# Convolve neural activity with HRF to get BOLD signal
bold = np.convolve(neural, hrf(np.linspace(0, 30, 300)), mode='full')[:len(total_time)]
bold = bold / np.max(bold) * 2.0  # scale to typical % signal change
bold += np.random.normal(0, 0.3, len(total_time))  # add noise

fig, axes = plt.subplots(3, 1, figsize=(12, 8))

axes[0].plot(t, h, linewidth=2.5, color='#f59e0b')
axes[0].set_title('Haemodynamic Response Function (HRF)', fontsize=13)
axes[0].set_xlabel('Time after neural activity (sec)', fontsize=10)
axes[0].set_ylabel('Response', fontsize=10)
axes[0].annotate('Peak: ~5 sec delay', xy=(5, 1), xytext=(10, 0.8),
    fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
axes[0].grid(alpha=0.3)

axes[1].fill_between(total_time, neural, alpha=0.3, color='#ef4444')
axes[1].plot(total_time, neural, linewidth=2, color='#ef4444')
axes[1].set_title('Neural Activity (meditation blocks)', fontsize=13)
axes[1].set_ylabel('Activity', fontsize=10)
axes[1].grid(alpha=0.3)

axes[2].plot(total_time, bold, linewidth=1.5, color='#60a5fa', alpha=0.7)
axes[2].set_title('Measured BOLD Signal (what fMRI sees)', fontsize=13)
axes[2].set_xlabel('Time (sec)', fontsize=10)
axes[2].set_ylabel('% signal change', fontsize=10)
axes[2].grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("The BOLD signal is DELAYED and SMOOTHED compared to neural activity.")
print("This is because blood flow takes time to respond.")
print("fMRI never sees neurons fire directly — it sees the echo.")`,
      challenge: 'Add a third meditation block from 90-110 seconds but with half the intensity (neural activity = 0.5). Does the BOLD response scale proportionally? Test if the BOLD signal is truly linear with neural activity.',
      successHint: 'You just implemented the core signal processing pipeline used in real fMRI research. The convolution of neural activity with the HRF is how researchers model the BOLD signal. Tools like SPM and FSL use this exact approach to analyse brain imaging data from meditation, addiction, and neuroplasticity studies.',
    },
    {
      title: 'Statistical analysis of brain regions \u2014 t-tests and effect sizes',
      concept: `When a neuroscientist publishes "meditators have a thicker prefrontal cortex," they need statistical proof. The standard tool is a **t-test**: does the difference between two groups (meditators vs controls) exceed what random variation could produce?

The t-statistic: \`t = (mean1 - mean2) / sqrt(s1\u00b2/n1 + s2\u00b2/n2)\`

If |t| is large enough (typically > 2 for 95% confidence), the difference is **statistically significant** \u2014 unlikely to be due to chance.

But significance alone is not enough. We also need **effect size** (Cohen\u2019s d):
\`d = (mean1 - mean2) / pooled_std\`

Effect size tells you **how big** the difference is:
- d = 0.2: small effect
- d = 0.5: medium effect
- d = 0.8: large effect

Meditation studies typically find d = 0.3-0.6 for cortical thickness changes \u2014 real but moderate effects that require careful measurement.`,
      analogy: 'The t-test is like a fair judge. You claim your fertiliser makes plants grow taller. The judge measures both groups and asks: "Could this difference have happened by chance, with no fertiliser at all?" If the answer is "very unlikely" (p < 0.05), the judge rules in your favour. Effect size is the follow-up question: "OK, the fertiliser works, but does it add 1mm or 1 metre?"',
      storyConnection: 'If researchers studied Angulimala before and after transformation, they would run t-tests on his brain measurements. The question is not "did anything change?" (of course it did \u2014 he is a different person). The question is: "Is the change in prefrontal cortex thickness statistically significant, and is the effect size large enough to be meaningful?"',
      checkQuestion: 'A study finds p = 0.03 but d = 0.15. Should you be impressed?',
      checkAnswer: 'Not really. The p-value (0.03) says the result is statistically significant \u2014 unlikely due to chance. But the effect size (d = 0.15) is tiny. This often happens in studies with very large sample sizes: even trivial differences become "significant" because the large n makes the denominator small. Always look at both p-value AND effect size. A significant but tiny effect may not be practically meaningful.',
      codeIntro: 'Run a t-test comparing brain measurements between meditators and controls.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated prefrontal cortex thickness (mm)
# Based on Lazar et al. (2005) findings
n_controls = 30
n_meditators = 25

controls = np.random.normal(2.5, 0.3, n_controls)      # mean 2.5mm
meditators = np.random.normal(2.75, 0.28, n_meditators)  # mean 2.75mm

# Manual t-test
mean_c, mean_m = controls.mean(), meditators.mean()
std_c, std_m = controls.std(ddof=1), meditators.std(ddof=1)
se = np.sqrt(std_c**2/n_controls + std_m**2/n_meditators)
t_stat = (mean_m - mean_c) / se

# Degrees of freedom (Welch's approximation)
df = (std_c**2/n_controls + std_m**2/n_meditators)**2 / (
    (std_c**2/n_controls)**2/(n_controls-1) + (std_m**2/n_meditators)**2/(n_meditators-1))

# Effect size (Cohen's d)
pooled_std = np.sqrt(((n_controls-1)*std_c**2 + (n_meditators-1)*std_m**2) /
                     (n_controls + n_meditators - 2))
cohens_d = (mean_m - mean_c) / pooled_std

# Plot
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Box plot
bp = ax1.boxplot([controls, meditators], labels=['Controls', 'Meditators'],
                  patch_artist=True)
bp['boxes'][0].set_facecolor('#f87171')
bp['boxes'][1].set_facecolor('#34d399')
ax1.set_ylabel('Prefrontal cortex thickness (mm)', fontsize=11)
ax1.set_title('Brain Measurement Comparison', fontsize=13)
ax1.grid(axis='y', alpha=0.3)

# Histogram overlap
bins = np.linspace(1.8, 3.5, 25)
ax2.hist(controls, bins, alpha=0.6, color='#f87171', label='Controls')
ax2.hist(meditators, bins, alpha=0.6, color='#34d399', label='Meditators')
ax2.axvline(mean_c, color='#ef4444', linewidth=2, linestyle='--')
ax2.axvline(mean_m, color='#10b981', linewidth=2, linestyle='--')
ax2.set_xlabel('Thickness (mm)', fontsize=11)
ax2.set_ylabel('Count', fontsize=11)
ax2.set_title('Distribution Overlap', fontsize=13)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Controls:    mean = {mean_c:.2f} mm, std = {std_c:.2f}")
print(f"Meditators:  mean = {mean_m:.2f} mm, std = {std_m:.2f}")
print(f"Difference:  {mean_m - mean_c:.2f} mm")
print(f"t-statistic: {t_stat:.2f} (df = {df:.0f})")
print(f"Significant: {'Yes' if abs(t_stat) > 2.0 else 'No'} (|t| > 2.0)")
print(f"Cohen's d:   {cohens_d:.2f} ({'small' if cohens_d < 0.5 else 'medium' if cohens_d < 0.8 else 'large'} effect)")`,
      challenge: 'Reduce n_meditators to 5. Is the result still significant? What about n=100? This shows how sample size affects statistical power. Many early meditation studies had tiny samples \u2014 their results should be interpreted cautiously.',
      successHint: 'You just performed a real statistical analysis of the kind published in neuroscience journals. The t-test and effect size are the bread and butter of research evaluation. Next time you read "meditation changes the brain," you can ask: what was the sample size, t-statistic, and effect size?',
    },
    {
      title: 'Actor-critic methods \u2014 separating decisions from evaluation',
      concept: `Q-learning has one network doing everything. **Actor-critic** methods split the job into two:
- The **Actor** chooses actions (the policy)
- The **Critic** evaluates how good the state is (the value function)

This is remarkably similar to how the brain works. The **prefrontal cortex** (actor) makes decisions. The **basal ganglia** (critic) evaluates outcomes and sends dopamine signals to update the actor.

The advantage: the critic provides a baseline for the reward signal. Instead of asking "was this action good?" (which depends on the baseline), the actor asks "was this action **better than average**?" This reduces variance and stabilises learning.

The update:
- Critic: \`V(s) += \u03b1_c \u00d7 [r + \u03b3V(s\u2019) - V(s)]\`
- Actor: \`\u03b8 += \u03b1_a \u00d7 advantage \u00d7 \u2207log\u03c0(a|s)\`
- Advantage = r + \u03b3V(s\u2019) - V(s) (the TD error from the critic)`,
      analogy: 'Imagine a student (actor) and a teacher (critic). The student takes actions (answers questions). The teacher does not answer the questions herself \u2014 she just says "that was better than usual" or "that was worse than usual." Over time, the student learns to consistently give good answers. The separation of roles makes both more effective.',
      storyConnection: 'The Buddha played the critic role in Angulimala\u2019s transformation. He did not make Angulimala\u2019s decisions for him (that would be supervised learning, not RL). He simply observed and provided evaluative feedback: "You are on the right path" or "Consider whether this action serves your goal." Angulimala\u2019s own prefrontal cortex was the actor, learning from the critic\u2019s signal.',
      checkQuestion: 'Why is the "advantage" (r + \u03b3V(s\u2019) - V(s)) better than raw reward for training the actor?',
      checkAnswer: 'Raw reward can be noisy and misleading. If all actions in a state give positive reward, the actor cannot distinguish good from great. The advantage subtracts the baseline V(s), measuring "how much better was this action than average?" This centres the signal: positive advantage = better than expected, negative = worse. The result is much more stable training, especially in environments with varying reward scales.',
      codeIntro: 'Build a simple actor-critic system for the kindness-learning problem.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def sigmoid(x):
    return 1 / (1 + np.exp(-np.clip(x, -10, 10)))

# Actor: policy parameters (logits for 2 actions)
actor_theta = np.array([-1.0, 0.0])  # [aggressive, kind] logits
# Critic: value estimate
critic_v = 0.0

lr_actor = 0.1
lr_critic = 0.2
gamma = 0.9
episodes = 200

# Environment: 3 states (angry=0, neutral=1, calm=2)
state = 0

actor_history = []
critic_history = []
reward_history = []

for ep in range(episodes):
    # Softmax policy
    probs = np.exp(actor_theta) / np.sum(np.exp(actor_theta))
    actor_history.append(probs[1])  # P(kind)

    # Sample action
    action = np.random.choice([0, 1], p=probs)  # 0=aggressive, 1=kind

    # Get reward and next state
    if action == 1:  # kind
        reward = 0.7 + np.random.normal(0, 0.15)
        next_state = min(state + 1, 2)
    else:  # aggressive
        reward = -0.3 + np.random.normal(0, 0.2)
        next_state = max(state - 1, 0)

    reward_history.append(reward)

    # Critic: estimate value of next state
    next_v = critic_v  # simplified: one shared value

    # TD error (advantage)
    advantage = reward + gamma * next_v - critic_v

    # Update critic
    critic_v += lr_critic * advantage
    critic_history.append(critic_v)

    # Update actor using advantage
    # Increase log-prob of chosen action proportional to advantage
    grad = np.zeros(2)
    grad[action] = advantage * (1 - probs[action])
    grad[1 - action] = -advantage * probs[1 - action]
    actor_theta += lr_actor * grad

    state = next_state

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

axes[0].plot(actor_history, linewidth=2, color='#10b981')
axes[0].set_title('Actor: P(kind)', fontsize=12)
axes[0].set_xlabel('Episode', fontsize=10)
axes[0].set_ylim(0, 1); axes[0].grid(alpha=0.3)

axes[1].plot(critic_history, linewidth=2, color='#8b5cf6')
axes[1].set_title('Critic: Value estimate', fontsize=12)
axes[1].set_xlabel('Episode', fontsize=10)
axes[1].grid(alpha=0.3)

window = 15
smoothed = np.convolve(reward_history, np.ones(window)/window, mode='valid')
axes[2].plot(smoothed, linewidth=2, color='#f59e0b')
axes[2].set_title('Average Reward', fontsize=12)
axes[2].set_xlabel('Episode', fontsize=10)
axes[2].grid(alpha=0.3)

plt.suptitle('Actor-Critic: Prefrontal Cortex (Actor) + Basal Ganglia (Critic)', fontsize=14)
plt.tight_layout()
plt.show()

print(f"Final P(kind): {actor_history[-1]:.2f}")
print(f"Final value estimate: {critic_history[-1]:.2f}")
print()
print("Actor-Critic mirrors the brain's architecture:")
print("  Prefrontal cortex = Actor (makes decisions)")
print("  Basal ganglia = Critic (evaluates via dopamine)")`,
      challenge: 'Add a "stress" condition every 30 episodes where the aggressive reward temporarily spikes to 1.0. Does the actor-critic maintain its kindness policy or relapse? Compare with a pure policy gradient approach.',
      successHint: 'Actor-critic is the backbone of state-of-the-art RL. PPO (Proximal Policy Optimization), used to train ChatGPT via RLHF, is an actor-critic algorithm. A2C and A3C (used in real-time strategy games) are also actor-critic. You just implemented the core architecture.',
    },
    {
      title: 'Cortical thickness changes \u2014 real data analysis pipeline',
      concept: `Let us build a complete analysis pipeline for a hypothetical neuroplasticity study. We will:

1. Generate realistic brain measurement data for multiple regions
2. Run t-tests across all regions
3. Apply **multiple comparison correction** (Bonferroni)
4. Visualise significant results with confidence intervals

Multiple comparison correction is critical. If you test 20 brain regions at p < 0.05, you expect 1 false positive purely by chance. Bonferroni correction divides the threshold by the number of tests: p < 0.05/20 = 0.0025.

This is a real concern in neuroimaging. Early meditation studies tested many brain regions without correction, leading to false positives. Modern studies use stricter thresholds.`,
      analogy: 'Testing 20 brain regions without correction is like flipping 20 coins and being amazed that one lands on heads. Of course one did \u2014 with 20 tries, you expect roughly one "significant" result by chance. Bonferroni correction says: "I will only be impressed if you get 20 heads in a row" (roughly). It raises the bar to account for multiple attempts.',
      storyConnection: 'If a researcher scanned Angulimala\u2019s brain and tested 50 regions, finding 3 "significant" changes, a skeptic would rightly ask: "Did you correct for multiple comparisons?" Without correction, 50 \u00d7 0.05 = 2.5 expected false positives. The 3 findings might be noise. Rigorous analysis protects against seeing change where none exists.',
      checkQuestion: 'Is Bonferroni correction too conservative? Are there better alternatives?',
      checkAnswer: 'Yes, Bonferroni is often too strict because it assumes all tests are independent, which brain regions are not (nearby regions are correlated). Better alternatives include False Discovery Rate (FDR/Benjamini-Hochberg), which controls the proportion of false positives rather than the probability of ANY false positive. FDR is now standard in neuroimaging because it balances sensitivity and specificity better than Bonferroni.',
      codeIntro: 'Build a complete brain measurement analysis pipeline with multiple comparison correction.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

regions = ['Prefrontal', 'Amygdala', 'Hippocampus', 'Insula',
           'ACC', 'Temporal', 'Parietal', 'Motor',
           'Visual', 'Cerebellum']

# True effects (mm difference): some regions change, some don't
true_effects = [0.25, -0.15, 0.20, 0.12, 0.08, 0.02, -0.01, 0.03, 0.01, 0.05]

n_per_group = 30
results = []

for region, true_eff in zip(regions, true_effects):
    controls = np.random.normal(2.5, 0.3, n_per_group)
    meditators = np.random.normal(2.5 + true_eff, 0.28, n_per_group)

    diff = meditators.mean() - controls.mean()
    se = np.sqrt(controls.var(ddof=1)/n_per_group + meditators.var(ddof=1)/n_per_group)
    t_stat = diff / se
    # Approximate p-value using normal distribution
    p_val = 2 * (1 - 0.5 * (1 + np.sign(abs(t_stat)) *
        (1 - np.exp(-2/np.pi * t_stat**2))))
    p_val = max(0.0001, min(p_val, 1.0))

    pooled_std = np.sqrt((controls.var(ddof=1) + meditators.var(ddof=1)) / 2)
    d = diff / pooled_std

    results.append({
        'region': region, 'diff': diff, 'se': se,
        't': t_stat, 'p': p_val, 'd': d
    })

# Sort by p-value
results.sort(key=lambda x: x['p'])
bonferroni_threshold = 0.05 / len(regions)

# Plot
fig, ax = plt.subplots(figsize=(12, 6))
colors = []
for r in results:
    if r['p'] < bonferroni_threshold:
        colors.append('#10b981')
    elif r['p'] < 0.05:
        colors.append('#f59e0b')
    else:
        colors.append('#94a3b8')

y_pos = np.arange(len(results))
ax.barh(y_pos, [r['diff'] for r in results], xerr=[1.96*r['se'] for r in results],
        color=colors, height=0.6, capsize=3)
ax.set_yticks(y_pos)
ax.set_yticklabels([f"{r['region']} (p={r['p']:.3f}, d={r['d']:.2f})" for r in results],
                    fontsize=10)
ax.axvline(0, color='white', linewidth=1)
ax.set_xlabel('Thickness difference (mm)', fontsize=11)
ax.set_title('Brain Region Analysis: Meditators vs Controls', fontsize=14)
ax.grid(axis='x', alpha=0.3)

# Legend
from matplotlib.patches import Patch
legend_elements = [
    Patch(facecolor='#10b981', label=f'Bonferroni significant (p<{bonferroni_threshold:.4f})'),
    Patch(facecolor='#f59e0b', label='Nominally significant (p<0.05)'),
    Patch(facecolor='#94a3b8', label='Not significant'),
]
ax.legend(handles=legend_elements, fontsize=9, loc='lower right')

plt.tight_layout()
plt.show()

print(f"Bonferroni threshold: p < {bonferroni_threshold:.4f}")
print()
for r in results:
    sig = "***" if r['p'] < bonferroni_threshold else "* " if r['p'] < 0.05 else "  "
    print(f"  {sig} {r['region']:12s}: diff={r['diff']:+.3f}mm, t={r['t']:+.2f}, p={r['p']:.4f}, d={r['d']:.2f}")`,
      challenge: 'Increase n_per_group to 100 (larger study). Which "nominally significant" results become Bonferroni-significant? This shows the value of larger sample sizes in neuroimaging research.',
      successHint: 'You just built a complete neuroimaging statistical pipeline. Real fMRI studies use this exact approach (with additional spatial corrections). Understanding these methods lets you critically evaluate claims about meditation, neuroplasticity, and brain training \u2014 distinguishing real effects from noise.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced RL algorithms and real neuroscience data analysis</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced RL and brain data analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[AngulimalaReinforcementDiagram, AngulimalaReinforcementDiagram, AngulimalaFMRIDiagram, AngulimalaFMRIDiagram, AngulimalaHabitPathwayDiagram, AngulimalaFMRIDiagram][i] ? createElement([AngulimalaReinforcementDiagram, AngulimalaReinforcementDiagram, AngulimalaFMRIDiagram, AngulimalaFMRIDiagram, AngulimalaHabitPathwayDiagram, AngulimalaFMRIDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
