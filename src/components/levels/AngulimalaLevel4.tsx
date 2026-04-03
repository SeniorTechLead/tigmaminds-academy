import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AngulimalaReinforcementDiagram from '../diagrams/AngulimalaReinforcementDiagram';
import AngulimalaFMRIDiagram from '../diagrams/AngulimalaFMRIDiagram';
import AngulimalaNeuroplasticityDiagram from '../diagrams/AngulimalaNeuroplasticityDiagram';
import AngulimalaHabitPathwayDiagram from '../diagrams/AngulimalaHabitPathwayDiagram';
import NeuralNetworkDiagram from '../diagrams/NeuralNetworkDiagram';
import ActivityHabitTrackerDiagram from '../diagrams/ActivityHabitTrackerDiagram';

export default function AngulimalaLevel4() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Deep Q-Network — neural networks as function approximators for RL',
      concept: `In Level 3 you used Q-tables. But tables do not scale: a 100×100 grid with 4 actions needs 40,000 entries. A video game with pixel inputs has millions of possible states. **Deep Q-Networks (DQN)** replace the table with a neural network that generalises across states.

Instead of Q[state, action] as a table lookup, a neural network takes the state as input and outputs Q-values for all actions. The network learns to interpolate between seen states, predicting Q-values for states it has never encountered.

DeepMind’s 2015 DQN was the breakthrough: it learned to play 49 Atari games from raw pixels, achieving superhuman performance on 29 of them. The same algorithm — just a neural network approximating Q-values.

Key innovations:
- **Experience replay**: store transitions in a buffer and sample randomly for training (breaks temporal correlations)
- **Target network**: a slowly-updated copy of the Q-network for stable training targets`,
      analogy: 'A Q-table is like a phonebook: to look up a name, it must be exactly in the book. A DQN is like a search engine: you can type approximate queries ("John Sm...") and it generalises to find the best match. The neural network learns the underlying patterns rather than memorising individual entries.',
      storyConnection: 'Angulimala’s brain did not store a separate "how to respond" rule for every possible situation. His neural networks generalised: compassion training in one context transferred to novel situations. When he encountered a person he had never met, in a place he had never been, his brain generalised from training and still chose kindness. That is exactly what DQN does.',
      checkQuestion: 'Why is experience replay important? What goes wrong without it?',
      checkAnswer: 'Without experience replay, the network trains on consecutive experiences that are highly correlated (state_1 is similar to state_2). This causes the network to overfit to recent experiences and "forget" earlier lessons. Experience replay breaks these correlations by randomly sampling from a large buffer of past experiences, creating a more diverse training set. It is like reviewing old notes mixed with new ones instead of only studying the most recent lecture.',
      codeIntro: 'Build a DQN with experience replay for a simple environment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simple environment: 1D position, goal is at position 5
# State: current position (float)
# Actions: move left (-1) or right (+1)

class SimpleEnv:
    def __init__(self):
        self.pos = 0.0
        self.goal = 5.0

    def reset(self):
        self.pos = np.random.uniform(-3, 3)
        return np.array([self.pos])

    def step(self, action):
        move = 1.0 if action == 1 else -1.0
        self.pos += move + np.random.normal(0, 0.1)
        self.pos = np.clip(self.pos, -5, 7)
        dist = abs(self.pos - self.goal)
        reward = -dist * 0.1
        done = dist < 0.5
        if done:
            reward = 10.0
        return np.array([self.pos]), reward, done

# Simple neural network (1 hidden layer)
class DQN:
    def __init__(self, lr=0.01):
        self.W1 = np.random.randn(1, 16) * 0.3
        self.b1 = np.zeros(16)
        self.W2 = np.random.randn(16, 2) * 0.3
        self.b2 = np.zeros(2)
        self.lr = lr

    def predict(self, state):
        self.h = np.maximum(0, state @ self.W1 + self.b1)  # ReLU
        return self.h @ self.W2 + self.b2

    def update(self, state, action, target):
        q_vals = self.predict(state)
        error = np.zeros(2)
        error[action] = target - q_vals[0, action]

        # Backprop
        dW2 = self.h.T @ error.reshape(1, -1)
        dh = error @ self.W2.T
        dh[self.h <= 0] = 0  # ReLU gradient

        dW1 = state.T @ dh
        self.W2 += self.lr * dW2
        self.b2 += self.lr * error
        self.W1 += self.lr * dW1
        self.b1 += self.lr * dh.flatten()

# Experience replay buffer
replay_buffer = []
max_buffer = 500

env = SimpleEnv()
dqn = DQN(lr=0.005)
gamma = 0.95
episodes = 300
rewards_history = []

for ep in range(episodes):
    state = env.reset().reshape(1, -1)
    total_reward = 0
    epsilon = max(0.05, 1.0 - ep / 150)

    for step in range(30):
        if np.random.random() < epsilon:
            action = np.random.randint(2)
        else:
            action = np.argmax(dqn.predict(state))

        next_state, reward, done = env.step(action)
        next_state = next_state.reshape(1, -1)
        total_reward += reward

        # Store in replay buffer
        replay_buffer.append((state, action, reward, next_state, done))
        if len(replay_buffer) > max_buffer:
            replay_buffer.pop(0)

        # Sample from buffer and train
        if len(replay_buffer) >= 32:
            batch = [replay_buffer[i] for i in
                     np.random.choice(len(replay_buffer), 16)]
            for s, a, r, ns, d in batch:
                target = r if d else r + gamma * np.max(dqn.predict(ns))
                dqn.update(s, a, target)

        state = next_state
        if done:
            break

    rewards_history.append(total_reward)

plt.figure(figsize=(10, 5))
window = 20
smoothed = np.convolve(rewards_history, np.ones(window)/window, mode='valid')
plt.plot(smoothed, linewidth=2.5, color='#8b5cf6')
plt.xlabel('Episode', fontsize=12)
plt.ylabel('Total reward (smoothed)', fontsize=12)
plt.title('DQN with Experience Replay: Learning to Navigate to Peace', fontsize=14)
plt.grid(alpha=0.3)
plt.show()

# Show learned Q-values across state space
positions = np.linspace(-5, 7, 50).reshape(-1, 1)
q_vals = np.array([dqn.predict(p.reshape(1, -1)).flatten() for p in positions])

print("Learned strategy:")
for pos in [-3, 0, 3, 5, 7]:
    qv = dqn.predict(np.array([[pos]])).flatten()
    best = "RIGHT (toward goal)" if np.argmax(qv) == 1 else "LEFT"
    print(f"  Position {pos:+d}: Q(left)={qv[0]:.1f}, Q(right)={qv[1]:.1f} -> {best}")`,
      challenge: 'Add a "temptation" zone at position 2 that gives +3 immediate reward but blocks progress to the goal. Does the DQN learn to avoid it? How does gamma affect this?',
      successHint: 'You just built the core algorithm behind DeepMind’s Atari breakthroughs. DQN with experience replay and target networks was the first demonstration that deep RL could learn complex behaviours from raw observations. Your version is simplified but contains all the essential ideas.',
    },
    {
      title: 'Reward shaping and intrinsic motivation — curiosity-driven learning',
      concept: `One problem with RL: what if the reward is sparse? Angulimala might go weeks without a clear positive signal. How does the brain keep learning?

The answer is **intrinsic motivation** — the brain generates its own reward signal. Curiosity, surprise, and the satisfaction of understanding something new all produce dopamine, independent of external rewards.

In AI, this is modelled through **reward shaping**: adding an intrinsic bonus to the external reward:
\`total_reward = external_reward + β × intrinsic_reward\`

One popular intrinsic reward is **prediction error**: if the agent’s model of the world is surprised by what happens, that surprise is rewarding. This drives exploration toward novel, informative states.

This models curiosity: you explore not because someone rewards you, but because uncertainty is inherently motivating.`,
      analogy: 'A child does not need a treat to explore a new room. The novelty itself is rewarding — what is behind that door? what does this button do? Curiosity is the brain’s intrinsic reward system. When AI researchers add prediction-error bonuses, they are giving machines the same drive that makes children learn without instruction.',
      storyConnection: 'Angulimala’s early meditation practice probably had little external reward. The internal reward came from curiosity: "What happens if I sit still for an hour? What changes when I wish someone well?" Each new observation about his own mind was intrinsically rewarding, keeping him engaged during the long plateau before external rewards (acceptance, peace) became clear.',
      checkQuestion: 'Can intrinsic motivation lead to bad outcomes? When does curiosity become harmful?',
      checkAnswer: 'Yes — intrinsic motivation can drive dangerous exploration if not balanced with external consequences. A curious agent might explore a "cliff" state because it is novel, even though falling is catastrophic. In humans, curiosity without safety constraints leads to risk-taking. This is why intrinsic rewards are usually combined with safety constraints or penalty terms. The β parameter controls how much intrinsic motivation influences decisions relative to external consequences.',
      codeIntro: 'Add curiosity-driven intrinsic reward to an RL agent.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Environment: 10 rooms, some with hidden treasures
n_rooms = 10
treasures = {3: 5.0, 7: 8.0, 9: 10.0}  # room: reward
visit_counts = np.zeros(n_rooms)

# Agent with curiosity
q_values = np.zeros(n_rooms)
alpha = 0.1
gamma = 0.9
beta = 2.0  # intrinsic motivation strength
episodes = 200

reward_no_curiosity = []
reward_with_curiosity = []

# Run WITHOUT curiosity
q_nc = np.zeros(n_rooms)
vc_nc = np.zeros(n_rooms)
for ep in range(episodes):
    room = np.random.randint(n_rooms)
    ext_reward = treasures.get(room, -0.1)
    q_nc[room] += alpha * (ext_reward - q_nc[room])
    vc_nc[room] += 1
    reward_no_curiosity.append(ext_reward)

# Run WITH curiosity
q_wc = np.zeros(n_rooms)
vc_wc = np.zeros(n_rooms)
for ep in range(episodes):
    # Choose room: prefer high Q-value and low visit count
    curiosity_bonus = beta / (1 + vc_wc)
    scores = q_wc + curiosity_bonus
    room = np.argmax(scores + np.random.normal(0, 0.3, n_rooms))
    room = np.clip(room, 0, n_rooms - 1)

    ext_reward = treasures.get(room, -0.1)
    intrinsic = beta / (1 + vc_wc[room])  # novelty bonus
    total = ext_reward + intrinsic

    q_wc[room] += alpha * (total - q_wc[room])
    vc_wc[room] += 1
    reward_with_curiosity.append(ext_reward)

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Cumulative rewards
cum_nc = np.cumsum(reward_no_curiosity)
cum_wc = np.cumsum(reward_with_curiosity)
axes[0].plot(cum_nc, linewidth=2, color='#94a3b8', label='Without curiosity')
axes[0].plot(cum_wc, linewidth=2, color='#10b981', label='With curiosity')
axes[0].set_xlabel('Episode', fontsize=10)
axes[0].set_ylabel('Cumulative reward', fontsize=10)
axes[0].set_title('Cumulative External Reward', fontsize=12)
axes[0].legend(fontsize=9); axes[0].grid(alpha=0.3)

# Visit distribution
x = np.arange(n_rooms)
width = 0.35
axes[1].bar(x - width/2, vc_nc, width, color='#94a3b8', label='Without')
axes[1].bar(x + width/2, vc_wc, width, color='#10b981', label='With')
for t in treasures:
    axes[1].axvline(t, color='gold', linewidth=1, linestyle='--', alpha=0.5)
axes[1].set_xlabel('Room', fontsize=10)
axes[1].set_ylabel('Visit count', fontsize=10)
axes[1].set_title('Room Exploration Pattern', fontsize=12)
axes[1].legend(fontsize=9); axes[1].grid(alpha=0.3)

# Q-values learned
axes[2].bar(x - width/2, q_nc, width, color='#94a3b8', label='Without')
axes[2].bar(x + width/2, q_wc, width, color='#10b981', label='With')
axes[2].set_xlabel('Room', fontsize=10)
axes[2].set_ylabel('Learned Q-value', fontsize=10)
axes[2].set_title('Learned Room Values', fontsize=12)
axes[2].legend(fontsize=9); axes[2].grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Total external reward WITHOUT curiosity: {cum_nc[-1]:.1f}")
print(f"Total external reward WITH curiosity:    {cum_wc[-1]:.1f}")
print()
print("Curiosity drives exploration to rooms the agent hasn't visited,")
print("helping it discover all treasures faster.")`,
      challenge: 'What happens when beta = 0.1 (weak curiosity) vs beta = 10.0 (overwhelming curiosity)? Find the optimal beta. Too much curiosity means the agent keeps exploring even after finding the best rooms.',
      successHint: 'Curiosity-driven learning is an active research area. OpenAI’s Random Network Distillation (RND) and DeepMind’s Go-Explore use intrinsic motivation to solve hard exploration problems. The insight that the brain generates its own reward signals has been one of the most productive bridges between neuroscience and AI.',
    },
    {
      title: 'Multi-agent RL — learning cooperation and social behaviour',
      concept: `Angulimala did not transform in isolation. He lived in a community. His behaviour affected others, and their responses affected him. This is **multi-agent reinforcement learning** (MARL).

In MARL, multiple agents share an environment. Each agent’s reward depends not just on its own actions but on what others do. This creates complex dynamics:
- **Cooperation**: agents can achieve more together than alone
- **Competition**: agents’ goals may conflict
- **Social norms**: behaviours that emerge to coordinate without explicit communication

The challenge: from each agent’s perspective, the environment is **non-stationary** — it changes as other agents learn. This makes learning much harder than single-agent RL.

We model a simple community where agents choose between selfish and cooperative actions. Cooperation gives lower individual reward but higher total reward.`,
      analogy: 'Think of a traffic intersection. If everyone drives selfishly (never yielding), there are crashes (low total reward). If everyone cooperates (taking turns), traffic flows smoothly (high total reward). But yielding has a cost (you wait longer), so each individual is tempted to be selfish. MARL studies how cooperation emerges despite individual incentives to defect.',
      storyConnection: 'Angulimala’s community was a multi-agent environment. When he acted violently, others feared him (negative reward for everyone). When he acted kindly, others responded with acceptance (positive reward for everyone). His transformation changed not just his own reward but the entire community’s dynamics. MARL captures this interdependence.',
      checkQuestion: 'In the Prisoner’s Dilemma, mutual cooperation is better than mutual defection, yet rational agents defect. How do real communities achieve cooperation?',
      checkAnswer: 'Through repeated interactions (iterated Prisoner’s Dilemma), reputation systems, reciprocity ("I cooperate because you cooperated last time"), and punishment of defectors. Robert Axelrod’s tournaments showed that "Tit-for-Tat" (cooperate first, then mirror the other’s last action) is remarkably effective. In human societies, social norms, gossip, and legal systems serve the same function as Tit-for-Tat: rewarding cooperation and punishing defection.',
      codeIntro: 'Simulate a community of RL agents learning cooperation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n_agents = 5
episodes = 300

# Payoff matrix (Prisoner's Dilemma variant)
# Each agent chooses: cooperate (1) or defect (0)
def get_rewards(actions):
    n_coop = sum(actions)
    rewards = []
    for a in actions:
        if a == 1:  # cooperate
            rewards.append(0.5 * n_coop / len(actions))  # scales with cooperation
        else:  # defect
            rewards.append(0.3 + 0.2 * n_coop / len(actions))  # free-rider bonus
    return np.array(rewards)

# Each agent has Q-values for [defect, cooperate]
agent_q = np.zeros((n_agents, 2))
alpha = 0.1

coop_rate_history = []
total_reward_history = []

for ep in range(episodes):
    epsilon = max(0.05, 0.5 * (1 - ep / 200))
    actions = []
    for i in range(n_agents):
        if np.random.random() < epsilon:
            a = np.random.randint(2)
        else:
            a = np.argmax(agent_q[i])
        actions.append(a)

    rewards = get_rewards(actions)

    for i in range(n_agents):
        agent_q[i, actions[i]] += alpha * (rewards[i] - agent_q[i, actions[i]])

    coop_rate = sum(actions) / n_agents
    coop_rate_history.append(coop_rate)
    total_reward_history.append(rewards.sum())

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

window = 15
smooth_coop = np.convolve(coop_rate_history, np.ones(window)/window, mode='valid')
smooth_reward = np.convolve(total_reward_history, np.ones(window)/window, mode='valid')

ax1.plot(smooth_coop, linewidth=2.5, color='#10b981')
ax1.set_xlabel('Episode', fontsize=11)
ax1.set_ylabel('Cooperation rate', fontsize=11)
ax1.set_title('Community Cooperation Over Time', fontsize=13)
ax1.set_ylim(0, 1); ax1.grid(alpha=0.3)

ax2.plot(smooth_reward, linewidth=2.5, color='#8b5cf6')
ax2.set_xlabel('Episode', fontsize=11)
ax2.set_ylabel('Total community reward', fontsize=11)
ax2.set_title('Community Welfare Over Time', fontsize=13)
ax2.grid(alpha=0.3)

plt.suptitle('Multi-Agent RL: Can a Community Learn Cooperation?', fontsize=14)
plt.tight_layout()
plt.show()

print(f"Final cooperation rate: {coop_rate_history[-1]:.0%}")
print(f"Final Q-values per agent:")
for i in range(n_agents):
    print(f"  Agent {i}: Q(defect)={agent_q[i,0]:.2f}, Q(cooperate)={agent_q[i,1]:.2f}")
print()
if np.mean(coop_rate_history[-30:]) > 0.5:
    print("The community learned cooperation!")
else:
    print("Defection dominated — the social dilemma was not resolved.")
print("Try changing the payoff structure to see what enables cooperation.")`,
      challenge: 'Add a "punishment" mechanism: if a defector is surrounded by cooperators, it gets -0.5 penalty. Does this change the outcome? This models social enforcement — the mechanism most human communities use to maintain cooperation.',
      successHint: 'Multi-agent RL is at the frontier of AI research. OpenAI’s hide-and-seek agents, DeepMind’s StarCraft II AI, and traffic optimisation systems all use MARL. The social dilemma — individual vs collective reward — is one of the deepest problems in both AI and human civilisation.',
    },
    {
      title: 'Network connectivity analysis — graph theory meets neuroscience',
      concept: `The brain is not just a collection of regions — it is a **network**. Regions are connected by white matter tracts, and the pattern of connections (the **connectome**) determines function.

Graph theory provides the tools to analyse brain networks:
- **Nodes** = brain regions
- **Edges** = connections between regions
- **Degree** = how many connections a node has (hub regions have high degree)
- **Path length** = shortest route between two nodes
- **Clustering coefficient** = how interconnected a node’s neighbours are

Meditation studies have found that long-term practice increases **functional connectivity** between the prefrontal cortex and other regions, creating more integrated brain networks. The brain becomes more "small-world" — well-connected with short path lengths.`,
      analogy: 'Think of the brain as an airline network. Major airports (hub regions like the prefrontal cortex) have many connections. Small airports (specialised regions) have few. The network is efficient when you can fly between any two cities in a few hops (short path length) while nearby cities are well-connected (high clustering). Meditation seems to add new "routes" to the network, making it more efficient.',
      storyConnection: 'Angulimala’s transformation changed his brain’s network structure. Before: the amygdala was a hub (fear drove many connections). After: the prefrontal cortex became more central (self-control coordinated more regions). The graph-theoretic properties of his connectome shifted from a fear-dominated network to an integration-dominated one.',
      checkQuestion: 'What is the "small-world" property and why is it beneficial for brains?',
      checkAnswer: 'A small-world network has high clustering (like a regular lattice — neighbours are well-connected) and short path lengths (like a random network — you can reach any node in a few hops). This combines local specialisation (clustered processing) with global integration (fast communication between distant regions). Real brains are small-world: nearby neurons form dense local circuits, while long-range white matter tracts connect distant regions. This architecture maximises computational power while minimising wiring cost.',
      codeIntro: 'Analyse brain network properties before and after meditation practice.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

regions = ['PFC', 'AMY', 'HPC', 'INS', 'ACC', 'TPJ', 'PCC', 'MTG']
n = len(regions)

# Connectivity matrix BEFORE practice (amygdala-dominated)
conn_before = np.array([
    [0, .3, .2, .1, .2, .1, .1, .1],  # PFC: weakly connected
    [.3, 0, .4, .5, .3, .2, .1, .2],  # AMY: hub (high connectivity)
    [.2, .4, 0, .2, .1, .1, .1, .1],  # HPC
    [.1, .5, .2, 0, .2, .1, .1, .1],  # INS
    [.2, .3, .1, .2, 0, .1, .2, .1],  # ACC
    [.1, .2, .1, .1, .1, 0, .2, .3],  # TPJ
    [.1, .1, .1, .1, .2, .2, 0, .2],  # PCC
    [.1, .2, .1, .1, .1, .3, .2, 0],  # MTG
])

# Connectivity matrix AFTER practice (PFC-dominated, more integrated)
conn_after = np.array([
    [0, .5, .5, .4, .5, .3, .3, .2],  # PFC: hub now!
    [.5, 0, .2, .2, .2, .1, .1, .1],  # AMY: reduced connectivity
    [.5, .2, 0, .3, .3, .2, .2, .2],  # HPC: stronger
    [.4, .2, .3, 0, .3, .2, .2, .2],  # INS: stronger
    [.5, .2, .3, .3, 0, .3, .3, .2],  # ACC: stronger
    [.3, .1, .2, .2, .3, 0, .3, .3],  # TPJ
    [.3, .1, .2, .2, .3, .3, 0, .3],  # PCC
    [.2, .1, .2, .2, .2, .3, .3, 0],  # MTG
])

# Calculate graph metrics
def graph_metrics(conn):
    degree = conn.sum(axis=1)
    # Average path length (simplified: inverse of connectivity)
    with np.errstate(divide='ignore'):
        dist = np.where(conn > 0, 1/conn, 10)
    np.fill_diagonal(dist, 0)
    avg_path = dist[dist > 0].mean()
    # Clustering coefficient (simplified)
    clustering = np.zeros(n)
    for i in range(n):
        neighbors = np.where(conn[i] > 0.15)[0]
        if len(neighbors) < 2:
            continue
        links = sum(conn[ni, nj] > 0.15
                    for ni in neighbors for nj in neighbors if ni < nj)
        possible = len(neighbors) * (len(neighbors) - 1) / 2
        clustering[i] = links / possible if possible > 0 else 0
    return degree, avg_path, clustering

deg_b, path_b, clust_b = graph_metrics(conn_before)
deg_a, path_a, clust_a = graph_metrics(conn_after)

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Degree comparison
x = np.arange(n)
width = 0.35
axes[0].bar(x - width/2, deg_b, width, color='#f87171', label='Before')
axes[0].bar(x + width/2, deg_a, width, color='#34d399', label='After')
axes[0].set_xticks(x); axes[0].set_xticklabels(regions, fontsize=9)
axes[0].set_ylabel('Degree (total connectivity)', fontsize=10)
axes[0].set_title('Node Connectivity', fontsize=12)
axes[0].legend(fontsize=9); axes[0].grid(axis='y', alpha=0.3)

# Connectivity matrices
im1 = axes[1].imshow(conn_before, cmap='YlOrRd', vmin=0, vmax=0.6)
axes[1].set_xticks(x); axes[1].set_xticklabels(regions, fontsize=8)
axes[1].set_yticks(x); axes[1].set_yticklabels(regions, fontsize=8)
axes[1].set_title('Before: Amygdala Hub', fontsize=12)
plt.colorbar(im1, ax=axes[1], fraction=0.046, pad=0.04)

im2 = axes[2].imshow(conn_after, cmap='YlGn', vmin=0, vmax=0.6)
axes[2].set_xticks(x); axes[2].set_xticklabels(regions, fontsize=8)
axes[2].set_yticks(x); axes[2].set_yticklabels(regions, fontsize=8)
axes[2].set_title('After: PFC Hub', fontsize=12)
plt.colorbar(im2, ax=axes[2], fraction=0.046, pad=0.04)

plt.suptitle('Brain Network Reorganisation Through Practice', fontsize=14)
plt.tight_layout()
plt.show()

print("Before practice:")
print(f"  Hub region: {regions[np.argmax(deg_b)]} (degree={deg_b.max():.2f})")
print(f"  Avg clustering: {clust_b.mean():.2f}")
print()
print("After practice:")
print(f"  Hub region: {regions[np.argmax(deg_a)]} (degree={deg_a.max():.2f})")
print(f"  Avg clustering: {clust_a.mean():.2f}")
print()
print("The network shifted from amygdala-dominated (fear)")
print("to PFC-dominated (self-regulation) — with greater overall integration.")`,
      challenge: 'Compute the "small-world index" for both networks: S = (C/C_random) / (L/L_random) where C is clustering and L is path length. A small-world network has S >> 1. Does meditation increase the small-world property?',
      successHint: 'Connectome analysis is a major area of neuroscience. The Human Connectome Project has mapped the wiring of hundreds of brains. Graph theory provides the mathematical tools to compare healthy, diseased, and transformed brains. You just applied these tools to a meditation study — the same approach used in published research.',
    },
    {
      title: 'Meta-learning — learning to learn (the ultimate neuroplasticity)',
      concept: `The deepest form of neuroplasticity is not learning a specific skill — it is **learning to learn better**. After years of meditation, Angulimala did not just master compassion; he became better at acquiring ANY new skill. His brain had optimised its own learning machinery.

In AI, this is called **meta-learning** or "learning to learn." The idea: train a model on many different tasks, so it learns not just any single task but HOW to learn tasks quickly.

The simplest version: **MAML (Model-Agnostic Meta-Learning)** trains a neural network to find initial weights that can be quickly fine-tuned for any new task. After meta-training, the model can learn a brand new task from just a few examples.

This mirrors how experienced meditators can rapidly adapt to new practices: their brains have meta-learned efficient learning strategies.`,
      analogy: 'Learning a specific skill is like learning one language. Meta-learning is like becoming a skilled linguist who can learn ANY new language quickly. The linguist has not memorised every language — they have learned the patterns that underlie all languages: grammar structures, phoneme categories, word order rules. Meta-learning gives AI the same "linguist ability" for any type of task.',
      storyConnection: 'At the start, Angulimala struggled with every aspect of his new life. By the end, he could adapt quickly to new challenges because his brain had learned HOW to learn. This is the meta-level of neuroplasticity: not just changing specific pathways, but improving the brain’s general capacity for change. The Buddha’s training was, in effect, a meta-learning curriculum.',
      checkQuestion: 'How is meta-learning different from transfer learning?',
      checkAnswer: 'Transfer learning takes a model trained on task A and fine-tunes it for task B. It works because tasks A and B share some features. Meta-learning goes further: it trains on many tasks (A, B, C, D...) specifically to optimise the ability to learn NEW tasks quickly. The meta-learned model does not just transfer knowledge; it transfers the learning PROCESS itself. Transfer learning is like using your French to help learn Spanish. Meta-learning is like becoming good at language learning itself.',
      codeIntro: 'Implement a simplified meta-learning loop that learns to learn new tasks.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Meta-learning: learn to quickly adapt to new regression tasks
# Each "task" is a simple linear function: y = a*x + b + noise
# The model must learn to quickly estimate a and b from few examples

class SimpleModel:
    def __init__(self):
        self.w = np.random.randn() * 0.5  # slope
        self.b = np.random.randn() * 0.5  # intercept

    def predict(self, x):
        return self.w * x + self.b

    def loss(self, x, y):
        return np.mean((self.predict(x) - y) ** 2)

    def update(self, x, y, lr):
        pred = self.predict(x)
        error = pred - y
        self.w -= lr * np.mean(2 * error * x)
        self.b -= lr * np.mean(2 * error)

    def copy(self):
        m = SimpleModel()
        m.w, m.b = self.w, self.b
        return m

def generate_task():
    a = np.random.uniform(-3, 3)
    b = np.random.uniform(-2, 2)
    return a, b

def get_data(a, b, n=10):
    x = np.random.uniform(-1, 1, n)
    y = a * x + b + np.random.normal(0, 0.1, n)
    return x, y

# Meta-training
meta_model = SimpleModel()
meta_lr = 0.01
inner_lr = 0.1
inner_steps = 5
meta_episodes = 100
n_tasks_per_episode = 5

meta_losses = []

for ep in range(meta_episodes):
    total_meta_loss = 0

    for _ in range(n_tasks_per_episode):
        a, b = generate_task()
        x_train, y_train = get_data(a, b, n=5)   # few-shot
        x_test, y_test = get_data(a, b, n=20)     # evaluation

        # Inner loop: adapt to this task
        adapted = meta_model.copy()
        for _ in range(inner_steps):
            adapted.update(x_train, y_train, inner_lr)

        # Meta loss: how well does the adapted model perform?
        meta_loss = adapted.loss(x_test, y_test)
        total_meta_loss += meta_loss

        # Meta update: adjust meta_model to produce better starting points
        meta_model.w -= meta_lr * (meta_model.w - adapted.w) * 0.1
        meta_model.b -= meta_lr * (meta_model.b - adapted.b) * 0.1

    meta_losses.append(total_meta_loss / n_tasks_per_episode)

# Test: compare meta-learned vs random initialization
a_test, b_test = 2.0, -1.0
x_test, y_test = get_data(a_test, b_test, n=5)

random_model = SimpleModel()
meta_adapted = meta_model.copy()

random_losses = []
meta_losses_adapt = []

for step in range(20):
    random_losses.append(random_model.loss(x_test, y_test))
    meta_losses_adapt.append(meta_adapted.loss(x_test, y_test))
    random_model.update(x_test, y_test, inner_lr)
    meta_adapted.update(x_test, y_test, inner_lr)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(meta_losses, linewidth=2.5, color='#8b5cf6')
ax1.set_xlabel('Meta-training episode', fontsize=11)
ax1.set_ylabel('Average task loss', fontsize=11)
ax1.set_title('Meta-Training: Learning to Learn', fontsize=13)
ax1.grid(alpha=0.3)

ax2.plot(random_losses, linewidth=2.5, color='#ef4444', label='Random start')
ax2.plot(meta_losses_adapt, linewidth=2.5, color='#10b981', label='Meta-learned start')
ax2.set_xlabel('Adaptation steps', fontsize=11)
ax2.set_ylabel('Loss on new task', fontsize=11)
ax2.set_title('New Task: Meta-Learned Adapts Faster', fontsize=13)
ax2.legend(fontsize=10); ax2.grid(alpha=0.3)

plt.suptitle('Meta-Learning: The AI That Learns to Learn', fontsize=14)
plt.tight_layout()
plt.show()

print(f"After 5 adaptation steps on a new task:")
print(f"  Random start loss: {random_losses[5]:.3f}")
print(f"  Meta-learned loss: {meta_losses_adapt[5]:.3f}")
print(f"  Meta-learning advantage: {random_losses[5]/meta_losses_adapt[5]:.1f}x faster")
print()
print("Meta-learning finds initial weights that ADAPT quickly —")
print("just as a practiced meditator's brain can learn any new")
print("skill faster because it has meta-learned HOW to learn.")`,
      challenge: 'Increase the range of task parameters (a from -10 to 10). Does meta-learning still help? What about tasks that are completely different (e.g., quadratic instead of linear)? Meta-learning struggles when the task distribution is too diverse — just as a person cannot meta-learn equally well across all possible domains.',
      successHint: 'You just implemented the core idea behind MAML, one of the most influential papers in modern AI (Finn et al., 2017). Meta-learning bridges neuroscience (the brain’s ability to learn to learn) and AI (systems that adapt from few examples). It is the computational formulation of the deepest kind of neuroplasticity — the kind that made Angulimala not just compassionate, but fundamentally adaptable.',
    },
    {
      title: 'Capstone — the complete transformation model',
      concept: `Let us build a complete computational model of Angulimala’s transformation, integrating everything from all four levels:

1. **Neural pathway dynamics** (Level 1): exponential growth/decay of pathways
2. **Habit loop model** (Level 1): cue-routine-reward with dopamine
3. **Backpropagation** (Level 2): error-driven weight updates
4. **Actor-Critic** (Level 3): prefrontal actor + basal ganglia critic
5. **Network reorganisation** (Level 4): graph-theoretic hub shifting

The model tracks Angulimala through 365 days, simulating daily episodes of practice, relapse risk, community interaction, and brain network changes. It outputs a comprehensive dashboard showing the transformation from all perspectives simultaneously.

This is a synthesis project: no new concepts, but the challenge of integrating everything into a coherent whole.`,
      analogy: 'Each level gave you one lens to view the same phenomenon. Level 1 was a magnifying glass (individual neurons). Level 2 was a microscope (network learning). Level 3 was an MRI scanner (brain regions). Level 4 was a satellite view (whole-brain networks). The capstone combines all lenses into a single coherent picture — like a medical imaging suite that fuses CT, MRI, PET, and EEG into one patient model.',
      storyConnection: 'Angulimala’s story is ultimately about a single question: can a person fundamentally change? The answer from neuroscience is unequivocal: yes. The brain is plastic. Pathways rewire. Habits replace. Networks reorganise. The Buddha knew this 2,500 years ago. Computational neuroscience has now given us the mathematical tools to model it, measure it, and build AI systems inspired by it.',
      checkQuestion: 'If we could build a perfect computational model of neuroplasticity, could we predict exactly how long a person’s transformation would take?',
      checkAnswer: 'No, because the model would need to account for genetics, epigenetics, life experiences, social environment, nutrition, sleep, and countless other factors. Brain plasticity is deterministic at the molecular level but effectively stochastic at the behavioural level due to its complexity. We can model averages and trends, but individual trajectories are inherently unpredictable. This is the boundary between science (understanding mechanisms) and wisdom (knowing that each person’s path is unique).',
      codeIntro: 'Build the complete transformation dashboard: 365 days, 5 metrics, 1 story.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
days = 365

# 1. Neural pathway strength (exponential dynamics)
compassion_path = np.zeros(days)
violence_path = np.zeros(days)
lr_grow = 0.015
lr_decay = 0.01

# 2. Habit loop reward signals
dopamine_compassion = np.zeros(days)
dopamine_violence = np.zeros(days)

# 3. Actor-Critic values
actor_p_kind = np.zeros(days)
critic_value = np.zeros(days)

# 4. Network integration (PFC centrality)
pfc_centrality = np.zeros(days)
amygdala_centrality = np.zeros(days)

c_path = 0.1  # initial compassion
v_path = 0.9  # initial violence
p_kind = 0.1  # initial P(kind)
cv = 0.0      # critic value
pfc_c = 0.2   # PFC centrality
amy_c = 0.8   # amygdala centrality

for d in range(days):
    # Practice happens most days (occasional relapse)
    practised = np.random.random() < (0.6 + 0.3 * d / days)

    if practised:
        c_path += lr_grow * (1 - c_path)
        v_path -= lr_decay * v_path * 0.5
        reward = 0.5 + 0.3 * c_path + np.random.normal(0, 0.1)
    else:
        c_path -= 0.005
        v_path += 0.003
        reward = -0.2 + np.random.normal(0, 0.15)

    c_path = np.clip(c_path, 0, 1)
    v_path = np.clip(v_path, 0, 1)
    compassion_path[d] = c_path
    violence_path[d] = v_path

    # Dopamine (TD error)
    td_error = reward - cv
    cv += 0.05 * td_error
    dopamine_compassion[d] = max(0, td_error)
    dopamine_violence[d] = max(0, -td_error)

    # Actor update
    p_kind += 0.01 * td_error * (1 - p_kind) if td_error > 0 else 0.005 * td_error * p_kind
    p_kind = np.clip(p_kind, 0.01, 0.99)
    actor_p_kind[d] = p_kind
    critic_value[d] = cv

    # Network reorganisation
    pfc_c += 0.001 * c_path
    amy_c -= 0.0008 * c_path
    pfc_c = np.clip(pfc_c, 0, 1)
    amy_c = np.clip(amy_c, 0.1, 1)
    pfc_centrality[d] = pfc_c
    amygdala_centrality[d] = amy_c

# Dashboard
fig, axes = plt.subplots(3, 2, figsize=(14, 10))

axes[0, 0].plot(compassion_path, linewidth=2, color='#10b981', label='Compassion')
axes[0, 0].plot(violence_path, linewidth=2, color='#ef4444', label='Violence')
axes[0, 0].set_title('Pathway Strength', fontsize=12)
axes[0, 0].legend(fontsize=9); axes[0, 0].grid(alpha=0.3)

axes[0, 1].plot(actor_p_kind, linewidth=2, color='#8b5cf6')
axes[0, 1].set_title('P(Kindness) — Actor Policy', fontsize=12)
axes[0, 1].set_ylim(0, 1); axes[0, 1].grid(alpha=0.3)

window = 14
dop_smooth = np.convolve(dopamine_compassion, np.ones(window)/window, mode='valid')
axes[1, 0].plot(dop_smooth, linewidth=2, color='#f59e0b')
axes[1, 0].set_title('Dopamine Signal (smoothed)', fontsize=12)
axes[1, 0].grid(alpha=0.3)

axes[1, 1].plot(critic_value, linewidth=2, color='#60a5fa')
axes[1, 1].set_title('Critic Value Estimate', fontsize=12)
axes[1, 1].grid(alpha=0.3)

axes[2, 0].plot(pfc_centrality, linewidth=2, color='#10b981', label='PFC')
axes[2, 0].plot(amygdala_centrality, linewidth=2, color='#ef4444', label='Amygdala')
axes[2, 0].set_title('Network Hub Centrality', fontsize=12)
axes[2, 0].legend(fontsize=9); axes[2, 0].grid(alpha=0.3)
axes[2, 0].set_xlabel('Day', fontsize=10)

# Phase portrait
axes[2, 1].scatter(violence_path, compassion_path, c=np.arange(days),
                    cmap='viridis', s=3, alpha=0.7)
axes[2, 1].set_xlabel('Violence pathway', fontsize=10)
axes[2, 1].set_ylabel('Compassion pathway', fontsize=10)
axes[2, 1].set_title('Phase Portrait (trajectory)', fontsize=12)
axes[2, 1].grid(alpha=0.3)

plt.suptitle('Angulimala\\'s Transformation: 365-Day Computational Model',
             fontsize=15, fontweight='bold')
plt.tight_layout()
plt.show()

cross_day = np.argmax(compassion_path > violence_path)
print(f"=== Transformation Summary ===")
print(f"  Crossover day: {cross_day}")
print(f"  Final P(kindness): {actor_p_kind[-1]:.2f}")
print(f"  Final PFC centrality: {pfc_centrality[-1]:.2f}")
print(f"  Final amygdala centrality: {amygdala_centrality[-1]:.2f}")
print()
print("The model integrates all 4 levels: pathway dynamics, habit loops,")
print("actor-critic learning, and network reorganisation into a single")
print("coherent simulation of human transformation.")`,
      challenge: 'Add a "setback" event at day 180 (a traumatic trigger that boosts violence_path by 0.3 and reduces p_kind by 0.2). Does the model recover? How long does recovery take? This models the non-linear, setback-filled reality of real transformation.',
      successHint: 'You have built a complete computational model of behavioural transformation, integrating neuroscience (pathways, brain regions, fMRI) with AI (reinforcement learning, neural networks, meta-learning). The story of Angulimala is 2,500 years old. The science confirming it is 50 years old. The computational tools to model it are 10 years old. You just used all three.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Research-level neuroscience and advanced AI systems</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises build research-level models of brain change and advanced RL. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[AngulimalaReinforcementDiagram, AngulimalaReinforcementDiagram, NeuralNetworkDiagram, AngulimalaFMRIDiagram, AngulimalaNeuroplasticityDiagram, AngulimalaNeuroplasticityDiagram][i] ? createElement([AngulimalaReinforcementDiagram, AngulimalaReinforcementDiagram, NeuralNetworkDiagram, AngulimalaFMRIDiagram, AngulimalaNeuroplasticityDiagram, AngulimalaNeuroplasticityDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
