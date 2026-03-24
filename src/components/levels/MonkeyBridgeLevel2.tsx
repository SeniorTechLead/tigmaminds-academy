import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MonkeyBridgeLevel2() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Optimal foraging theory — the economics of eating',
      concept: `The monkeys in the story crossed a dangerous river to reach fruit trees on the other side. Was the risk worth it? **Optimal foraging theory (OFT)** provides the mathematical framework: an animal should forage in a way that maximizes energy gain per unit time, minus the costs of travel and risk.

The key equation: **E/T = (energy gained - energy spent) / total time**

An animal must "decide":
- **Which food items** to eat (high-calorie fruit vs. abundant but low-calorie leaves?)
- **When to leave** a patch (when the rate of finding food drops below the travel rate to a new patch — the **Marginal Value Theorem**)
- **How far to travel** (crossing a river is costly; is the other side worth it?)

OFT predicts that animals behave like economists — not consciously, but through natural selection favoring individuals that forage efficiently. Inefficient foragers get outcompeted.`,
      analogy: 'Optimal foraging is like deciding where to eat lunch. You could walk 2 minutes to a mediocre cafeteria or 15 minutes to an amazing restaurant. OFT says: calculate the net benefit per minute. If the restaurant meal gives 3x the satisfaction but takes 7x longer to reach, the cafeteria wins — unless the restaurant also saves you dinner (higher total payoff).',
      storyConnection: 'The monkeys built a bridge to cross the river — a massive energy investment. OFT says this only makes sense if the food on the other side is significantly better than nearby options. Real primates make exactly these calculations: macaques remember fruiting schedules and travel to distant trees only when the caloric payoff justifies the journey.',
      checkQuestion: 'A monkey finds a fig tree with 100 figs. It eats quickly at first (10 figs/minute), but as the easy-to-reach figs are gone, its rate drops to 2 figs/minute. A similar tree is 5 minutes away. When should it leave?',
      checkAnswer: 'According to the Marginal Value Theorem: leave when the current foraging rate drops to the average rate including travel time. If the average rate across patches (including 5 min travel) is about 4 figs/min, the monkey should leave this tree when its rate drops below 4 figs/min. Staying longer at a depleting patch wastes time better spent traveling to a full one.',
      codeIntro: 'Implement the Marginal Value Theorem — find the optimal time to leave a food patch.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Marginal Value Theorem
# Cumulative food gain in a patch follows diminishing returns
# G(t) = Gmax * (1 - e^(-a*t))
# Optimal departure: when the tangent from (-travel_time, 0) touches the curve

Gmax = 50  # max food in patch
a = 0.1    # depletion rate

travel_times = [2, 5, 10, 20]  # minutes between patches
t = np.linspace(0, 60, 500)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

for ax, travel in zip(axes.flat, travel_times):
    ax.set_facecolor('#111827')

    # Gain curve
    gain = Gmax * (1 - np.exp(-a * t))
    ax.plot(t, gain, color='#22c55e', linewidth=2)

    # Find optimal departure (tangent from -travel_time, 0)
    # Slope of tangent = G(t*) / (t* + travel_time)
    # Also = dG/dt at t* = Gmax * a * e^(-a*t*)
    # So: Gmax*(1-e^(-a*t)) / (t+travel) = Gmax*a*e^(-a*t)
    # Solve numerically
    best_t = 0
    best_rate = 0
    for ti in t:
        rate = Gmax * (1 - np.exp(-a * ti)) / (ti + travel)
        if rate > best_rate:
            best_rate = rate
            best_t = ti

    # Draw tangent line
    gain_at_best = Gmax * (1 - np.exp(-a * best_t))
    slope = gain_at_best / (best_t + travel)
    tangent_x = np.linspace(-travel, best_t + 10, 100)
    tangent_y = slope * (tangent_x + travel)
    ax.plot(tangent_x, tangent_y, color='#f59e0b', linewidth=1.5, linestyle='--')

    # Mark optimal point
    ax.plot(best_t, gain_at_best, 'o', color='#ef4444', markersize=8)
    ax.annotate(f'Leave at t={best_t:.1f}min\\nGain={gain_at_best:.1f} items\\nRate={best_rate:.2f}/min',
               xy=(best_t, gain_at_best), xytext=(best_t+5, gain_at_best-10),
               color='#ef4444', fontsize=8)

    # Mark travel time
    ax.axvspan(-travel, 0, alpha=0.1, color='#ef4444')
    ax.text(-travel/2, 5, f'Travel\\n{travel}min', color='#ef4444', fontsize=8, ha='center')

    ax.set_xlim(-travel - 2, 60)
    ax.set_ylim(-2, 55)
    ax.set_xlabel('Time in patch (min)', color='white')
    ax.set_ylabel('Cumulative food items', color='white')
    ax.set_title(f'Travel time = {travel} min', color='white', fontsize=11)
    ax.tick_params(colors='gray')

fig.suptitle('Marginal Value Theorem: When to Leave a Patch', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.show()

print("Key insight: longer travel time → stay longer in each patch")
for travel in travel_times:
    best_t = 0; best_rate = 0
    for ti in np.linspace(0, 60, 1000):
        rate = Gmax * (1 - np.exp(-a * ti)) / (ti + travel)
        if rate > best_rate: best_rate = rate; best_t = ti
    print(f"  Travel {travel:2d}min → stay {best_t:.1f}min, rate {best_rate:.2f} items/min")`,
      challenge: 'Add a predation risk to the model: for every minute in the patch, there\'s a 1% chance of being attacked. How does this change the optimal departure time?',
      successHint: 'OFT turns animal behavior into an optimization problem. The same math applies to bees choosing flowers, birds choosing feeding stations, and even humans choosing supermarket checkout lines.',
    },
    {
      title: 'Game theory in animal behavior — the logic of cooperation',
      concept: `The monkey bridge requires cooperation — but why would any individual monkey risk being the bottom of the bridge? **Game theory** analyzes strategic interactions where each individual's best move depends on what others do.

The classic model is the **Prisoner's Dilemma**:
- If both cooperate: both get a moderate reward (mutual aid)
- If one defects while the other cooperates: the defector gets a large reward, the cooperator gets exploited
- If both defect: both get a poor outcome

In a one-shot game, defection is rational. But primates don't play one-shot games — they interact repeatedly with the same individuals. In **iterated games**, cooperation can evolve through:
- **Tit-for-tat**: cooperate first, then copy your partner's last move
- **Reciprocal altruism**: "I'll help you now; you'll help me later"
- **Kin selection**: helping relatives (who share your genes)
- **Punishment**: groups that punish cheaters maintain cooperation`,
      analogy: 'Game theory in monkeys is like a neighborhood where everyone can see who helps and who doesn\'t. If you never help your neighbors, nobody will help you when your roof leaks. Cooperation persists not because monkeys are "nice" but because reputation matters in a group where everyone remembers who cooperated and who cheated.',
      storyConnection: 'The monkey bridge is a Prisoner\'s Dilemma in physical form. Each monkey could "defect" (refuse to be part of the bridge), but then no one crosses. Cooperation works because: (1) they interact daily (iterated game), (2) they\'re related (kin selection), (3) cheaters get punished (exclusion from the group). The story\'s bridge is game theory made visible.',
      checkQuestion: 'In a group of 20 monkeys, 18 cooperate and 2 always cheat (take food shared by others but never share). Why don\'t the cheaters take over the whole group?',
      checkAnswer: 'Because cooperation is conditional. Once the group identifies cheaters (through repeated interactions), cooperators stop sharing with them. The cheaters lose access to the cooperative network. Additionally, groups often punish cheaters through aggression or exclusion. In iterated games with memory, cheating is a short-term strategy that fails long-term.',
      codeIntro: 'Simulate an iterated Prisoner\'s Dilemma tournament between different strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Iterated Prisoner's Dilemma
# Payoff matrix: (cooperate=1, defect=0)
# Both cooperate: 3 each. Both defect: 1 each.
# One defects: defector gets 5, cooperator gets 0.

def payoff(a, b):
    if a == 1 and b == 1: return 3, 3
    if a == 1 and b == 0: return 0, 5
    if a == 0 and b == 1: return 5, 0
    return 1, 1

# Strategies
def always_cooperate(history, opp_history): return 1
def always_defect(history, opp_history): return 0
def tit_for_tat(history, opp_history): return 1 if len(opp_history) == 0 else opp_history[-1]
def random_play(history, opp_history): return np.random.randint(2)
def grudger(history, opp_history): return 0 if 0 in opp_history else 1
def pavlov(history, opp_history):
    if len(history) == 0: return 1
    if history[-1] == opp_history[-1]: return 1
    return 0

strategies = {
    'Always Cooperate': always_cooperate,
    'Always Defect': always_defect,
    'Tit-for-Tat': tit_for_tat,
    'Random': random_play,
    'Grudger': grudger,
    'Pavlov': pavlov,
}

rounds = 200
results = {name: 0 for name in strategies}

# Round-robin tournament
for name1, strat1 in strategies.items():
    for name2, strat2 in strategies.items():
        if name1 == name2: continue
        h1, h2 = [], []
        s1, s2 = 0, 0
        for _ in range(rounds):
            a = strat1(h1, h2)
            b = strat2(h2, h1)
            p1, p2 = payoff(a, b)
            s1 += p1; s2 += p2
            h1.append(a); h2.append(b)
        results[name1] += s1
        results[name2] += s2

# Sort by total score
sorted_results = dict(sorted(results.items(), key=lambda x: x[1], reverse=True))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Tournament results
ax1.set_facecolor('#111827')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#ec4899']
bars = ax1.barh(list(sorted_results.keys()), list(sorted_results.values()), color=colors)
ax1.set_xlabel('Total score', color='white')
ax1.set_title('Prisoner\\'s Dilemma Tournament Results', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_yticklabels(list(sorted_results.keys()), color='white')
for bar, score in zip(bars, sorted_results.values()):
    ax1.text(bar.get_width() + 20, bar.get_y() + bar.get_height()/2, f'{score}', color='white', fontsize=9, va='center')

# Tit-for-tat vs Always Defect over time
ax2.set_facecolor('#111827')
h1, h2 = [], []
cum1, cum2 = [0], [0]
strat1 = tit_for_tat
strat2 = always_defect
for r in range(rounds):
    a = strat1(h1, h2)
    b = strat2(h2, h1)
    p1, p2 = payoff(a, b)
    cum1.append(cum1[-1] + p1)
    cum2.append(cum2[-1] + p2)
    h1.append(a); h2.append(b)

ax2.plot(cum1, color='#22c55e', linewidth=2, label='Tit-for-Tat')
ax2.plot(cum2, color='#ef4444', linewidth=2, label='Always Defect')
ax2.set_xlabel('Round', color='white')
ax2.set_ylabel('Cumulative score', color='white')
ax2.set_title('Tit-for-Tat vs Always Defect', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Tournament winner:", list(sorted_results.keys())[0])
print("\\nKey insight: nice strategies (that start cooperating)")
print("tend to beat nasty ones in tournaments with repeated interactions.")
print("Tit-for-Tat succeeds because it's: nice, retaliatory, forgiving, clear.")`,
      challenge: 'Add a new strategy: "Generous Tit-for-Tat" that cooperates 90% of the time even after the opponent defects. Does it beat regular Tit-for-Tat in a noisy environment where 5% of moves are randomly flipped?',
      successHint: 'Axelrod\'s tournaments showed that cooperation can evolve without central authority. The same dynamics explain everything from primate alliances to international diplomacy to open-source software development.',
    },
    {
      title: 'Social network analysis — mapping primate relationships',
      concept: `A primate troop is not just a group of individuals — it's a **social network**. Each animal has specific relationships (strong bonds, weak bonds, rivalries) that form a graph structure. **Social network analysis (SNA)** maps and measures these connections.

Key network metrics:
- **Degree**: how many connections an individual has (popular = high degree)
- **Betweenness centrality**: how often an individual sits on the shortest path between others (the "broker")
- **Clustering coefficient**: how connected an individual's friends are to each other (cliquishness)
- **Network density**: total connections / possible connections (how tight-knit the group is)

In primate groups, high-ranking individuals often have high betweenness centrality — they control information flow. When a key individual is removed (by death or translocation), the network can fragment, affecting the whole group's cohesion and survival.`,
      analogy: 'A primate social network is like a company org chart, but messier and more honest. The CEO (alpha) has many connections, but the real power might belong to the executive assistant (high betweenness) who controls who gets access to whom. Remove the assistant, and the whole organization slows down — same in a monkey troop.',
      storyConnection: 'The monkey bridge required coordination across the entire troop. In network terms, the bridge only works if the network is connected — every monkey must be linked to the chain. If the troop had two rival subgroups with no connections between them, the bridge would fail. Social network cohesion is literally what held the bridge together.',
      checkQuestion: 'In a troop of 30 macaques, the alpha female grooms 15 individuals. A low-ranking female grooms only 3. Who is more important for group cohesion?',
      checkAnswer: 'Not necessarily the alpha. It depends on betweenness centrality, not just degree. The low-ranking female might be the only connection between two subgroups. If she\'s removed, the network splits in two. The alpha has many connections but they might all be within one subgroup. Network position matters more than number of connections.',
      codeIntro: 'Build a primate social network and calculate centrality measures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate a primate social network
n_monkeys = 20
names = [f'M{i+1}' for i in range(n_monkeys)]

# Adjacency matrix (grooming network)
# Higher-ranked monkeys (lower index) have more connections
adj = np.zeros((n_monkeys, n_monkeys))
for i in range(n_monkeys):
    for j in range(i+1, n_monkeys):
        # Probability of connection decreases with rank distance
        p = 0.3 * np.exp(-0.05 * abs(i - j))
        # Add some random connections
        p += 0.1
        if np.random.random() < p:
            adj[i][j] = 1
            adj[j][i] = 1

# Calculate degree centrality
degree = adj.sum(axis=1)

# Calculate betweenness centrality (simplified BFS approach)
betweenness = np.zeros(n_monkeys)
for s in range(n_monkeys):
    for t in range(s+1, n_monkeys):
        # BFS to find shortest paths
        visited = [False] * n_monkeys
        queue = [(s, [s])]
        visited[s] = True
        paths = []
        min_len = n_monkeys + 1
        while queue:
            node, path = queue.pop(0)
            if node == t:
                if len(path) < min_len:
                    min_len = len(path)
                    paths = [path]
                elif len(path) == min_len:
                    paths.append(path)
                continue
            if len(path) >= min_len:
                continue
            for neighbor in range(n_monkeys):
                if adj[node][neighbor] == 1 and not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append((neighbor, path + [neighbor]))
        for path in paths:
            for node in path[1:-1]:
                betweenness[node] += 1.0 / len(paths)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Network visualization
ax1.set_facecolor('#111827')
# Circular layout
angles = np.linspace(0, 2 * np.pi, n_monkeys, endpoint=False)
x = np.cos(angles)
y = np.sin(angles)

# Draw edges
for i in range(n_monkeys):
    for j in range(i+1, n_monkeys):
        if adj[i][j] == 1:
            ax1.plot([x[i], x[j]], [y[i], y[j]], color='gray', alpha=0.3, linewidth=0.5)

# Draw nodes (size = degree, color = betweenness)
sizes = 50 + degree * 30
sc = ax1.scatter(x, y, s=sizes, c=betweenness, cmap='YlOrRd', edgecolors='white', linewidth=0.5, zorder=5)
plt.colorbar(sc, ax=ax1, label='Betweenness centrality', shrink=0.7)

# Label top 5 most central
top5 = np.argsort(betweenness)[-5:]
for idx in top5:
    ax1.annotate(names[idx], xy=(x[idx], y[idx]), xytext=(x[idx]*1.15, y[idx]*1.15),
                color='white', fontsize=8, ha='center')

ax1.set_title('Grooming Network (size=degree, color=betweenness)', color='white', fontsize=11)
ax1.set_xlim(-1.5, 1.5)
ax1.set_ylim(-1.5, 1.5)
ax1.axis('off')

# Centrality comparison
ax2.set_facecolor('#111827')
norm_degree = degree / degree.max()
norm_between = betweenness / (betweenness.max() + 0.001)
ax2.scatter(norm_degree, norm_between, c=np.arange(n_monkeys), cmap='viridis', s=80, edgecolors='white', linewidth=0.5)
for i in top5:
    ax2.annotate(names[i], xy=(norm_degree[i], norm_between[i]),
                xytext=(norm_degree[i]+0.05, norm_between[i]+0.05), color='white', fontsize=8)
ax2.set_xlabel('Degree centrality (normalized)', color='white')
ax2.set_ylabel('Betweenness centrality (normalized)', color='white')
ax2.set_title('Degree vs Betweenness', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Network statistics:")
print(f"  Nodes: {n_monkeys}")
print(f"  Edges: {int(adj.sum()/2)}")
print(f"  Density: {adj.sum() / (n_monkeys*(n_monkeys-1)):.3f}")
print(f"  Most connected: {names[np.argmax(degree)]} (degree={int(degree.max())})")
print(f"  Most central: {names[np.argmax(betweenness)]} (betweenness={betweenness.max():.1f})")`,
      challenge: 'Remove the monkey with the highest betweenness centrality. Does the network split into disconnected components? Calculate the new density and compare.',
      successHint: 'Social network analysis reveals invisible structures. The same math that maps monkey grooming networks is used to analyze human social media, disease spread, and organizational dynamics.',
    },
    {
      title: 'Habitat fragmentation modeling — when forests break apart',
      concept: `The river in the Monkey Bridge story is a natural barrier. But today, the biggest barriers for primates are human-made: roads, farms, and settlements that fragment continuous forest into isolated patches. **Habitat fragmentation** is one of the greatest threats to biodiversity worldwide.

Fragmentation causes problems through:
- **Reduced area**: smaller patches support fewer species (species-area relationship)
- **Edge effects**: forest edges are hotter, drier, and windier than interiors — many species can't survive there
- **Isolation**: animals can't move between patches to find mates, food, or new territory
- **Genetic drift**: small isolated populations lose genetic diversity, becoming inbred
- **Increased extinction risk**: small populations are vulnerable to random events (storms, disease)

The species-area relationship: **S = cA^z**, where S is species count, A is area, c is a constant, and z is typically 0.15-0.35. This means halving the area doesn't halve the species — it reduces them by 10-25%. But below a critical threshold, collapse is rapid.`,
      analogy: 'Habitat fragmentation is like tearing a novel into separate chapters and scattering them across a city. Each chapter (patch) still contains some story (species), but the narrative connections are lost. Characters that need to travel between chapters (migratory or wide-ranging species) can\'t complete their arc. And the small scraps — individual pages — lose all meaning.',
      storyConnection: 'The monkey bridge was the solution to a natural barrier (a river). Today\'s primates face barriers that have no natural bridges — highways, cleared farmland, urban sprawl. The story\'s message is that connectivity matters. Wildlife biologists design artificial "bridges" — wildlife corridors, canopy bridges, underpasses — to do what the story monkeys did: reconnect fragmented habitats.',
      checkQuestion: 'A 10,000-hectare forest is split into four equal patches of 2,500 hectares each with no corridors between them. Using S = cA^0.25, what fraction of species is lost?',
      checkAnswer: 'Original: S1 = c * 10000^0.25 = c * 10. Each patch: S2 = c * 2500^0.25 = c * 7.07. So each patch retains about 71% of species. But some species are unique to different patches, so across all four, you might retain ~85-90%. However, over time, the isolated small patches will lose more species due to edge effects, inbreeding, and random extinction. The initial cut is just the beginning.',
      codeIntro: 'Model the species-area relationship and simulate fragmentation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Species-Area Relationship: S = c * A^z
c = 5  # constant (depends on taxon)
z_values = [0.15, 0.25, 0.35]  # typical range

areas = np.logspace(0, 5, 200)  # 1 to 100,000 hectares

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Species-area curves
ax1.set_facecolor('#111827')
colors = ['#22c55e', '#3b82f6', '#ef4444']
for z, color in zip(z_values, colors):
    species = c * areas ** z
    ax1.loglog(areas, species, color=color, linewidth=2, label=f'z = {z}')

# Mark fragmentation scenario
original_area = 10000
fragments = [2500, 2500, 2500, 2500]
for z, color in zip(z_values, colors):
    s_orig = c * original_area ** z
    s_frag = c * fragments[0] ** z
    ax1.plot(original_area, s_orig, 'o', color=color, markersize=8)
    ax1.plot(fragments[0], s_frag, 's', color=color, markersize=8)
    ax1.annotate('', xy=(fragments[0], s_frag), xytext=(original_area, s_orig),
                arrowprops=dict(arrowstyle='->', color=color, alpha=0.5))

ax1.set_xlabel('Area (hectares, log scale)', color='white')
ax1.set_ylabel('Species count (log scale)', color='white')
ax1.set_title('Species-Area Relationship', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Fragmentation simulation over time
ax2.set_facecolor('#111827')
years = np.arange(0, 101)
original_species = 100
# Continuous forest: stable
continuous = np.ones(len(years)) * original_species

# Fragmented: gradual loss (relaxation to new equilibrium)
# Large fragment
large_frag_eq = original_species * (5000/10000) ** 0.25  # equilibrium
large_frag = original_species - (original_species - large_frag_eq) * (1 - np.exp(-0.03 * years))

# Small fragment
small_frag_eq = original_species * (500/10000) ** 0.25
small_frag = original_species - (original_species - small_frag_eq) * (1 - np.exp(-0.05 * years))

# Tiny fragment
tiny_frag_eq = original_species * (50/10000) ** 0.25
tiny_frag = original_species - (original_species - tiny_frag_eq) * (1 - np.exp(-0.08 * years))

ax2.plot(years, continuous, color='#22c55e', linewidth=2, label='Continuous (10,000 ha)')
ax2.plot(years, large_frag, color='#3b82f6', linewidth=2, label='Large fragment (5,000 ha)')
ax2.plot(years, small_frag, color='#f59e0b', linewidth=2, label='Small fragment (500 ha)')
ax2.plot(years, tiny_frag, color='#ef4444', linewidth=2, label='Tiny fragment (50 ha)')

ax2.set_xlabel('Years after fragmentation', color='white')
ax2.set_ylabel('Species remaining', color='white')
ax2.set_title('Extinction Debt: Species Loss Over Time', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Species-area predictions (z=0.25):")
for area in [50, 500, 2500, 5000, 10000]:
    s = c * area ** 0.25
    pct = s / (c * 10000 ** 0.25) * 100
    print(f"  {area:6,} ha: {s:.0f} species ({pct:.0f}% of original)")
print("\\nExtinction debt: species don't vanish immediately after fragmentation.")
print("Loss accumulates over decades — a 'debt' that must eventually be 'paid.'")`,
      challenge: 'Add corridors to the model. If a 100m-wide corridor connects two fragments, their effective area is somewhere between (A1 + A2) and max(A1, A2). Model different corridor qualities and their effect on species retention.',
      successHint: 'The species-area relationship and extinction debt are central to conservation planning. Understanding these models is essential for predicting which areas to protect and how corridors can reduce fragmentation impacts.',
    },
    {
      title: 'Corridor design — engineering connections between fragments',
      concept: `If fragmentation is the disease, **wildlife corridors** are the treatment. A corridor is a strip of habitat connecting two or more patches, allowing animals to move between them. But designing a good corridor is a complex engineering problem.

Corridor design considerations:
- **Width**: too narrow and edge effects dominate; most species need corridors at least 100-200m wide
- **Length**: shorter is better (less energy cost, less predation risk during crossing)
- **Habitat quality**: the corridor must contain the right vegetation, not just any green strip
- **Connectivity**: a corridor is only useful if it connects to habitat the target species can use
- **Stepping stones**: an alternative to continuous corridors — isolated patches close enough to hop between

Real examples:
- **Canopy bridges** in India: rope bridges over roads for langurs and macaques
- **Wildlife overpasses** in Banff, Canada: forested bridges over highways for bears and elk
- **Orangutan corridors** in Borneo: replanted forest strips connecting fragments`,
      analogy: 'A wildlife corridor is like a pedestrian bridge over a highway. The highway (farmland/road) is impassable on foot. The bridge (corridor) must be wide enough to feel safe, short enough to cross, and lead somewhere useful on both sides. A narrow plank over a 10-lane highway is technically a bridge — but nobody will use it.',
      storyConnection: 'The monkey bridge in the story IS a corridor — a temporary connection between two separated habitats. Conservation biologists build permanent versions of this: canopy bridges over roads, planted corridors through farmland. The story\'s insight — that connection matters as much as habitat — is the founding principle of corridor ecology.',
      checkQuestion: 'A corridor connecting two forest fragments is 50m wide and 2km long. A langur troop needs 100m-wide forest to feel safe traveling. Will they use this corridor?',
      checkAnswer: 'Probably not. At 50m wide, the entire corridor is "edge habitat" — affected by wind, temperature, and light from the adjacent open area. Langurs would be exposed to predators with no interior forest to hide in. The corridor would need to be at least 200m wide (100m of edge on each side, plus interior) to provide the safety langurs need. Width matters more than length.',
      codeIntro: 'Model corridor effectiveness based on width, length, and species requirements.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Corridor effectiveness model
# Effectiveness depends on: width (edge effects), length (crossing time/risk), quality

# Edge effect: interior habitat = max(0, width - 2*edge_depth)
# Species need a minimum interior width

edge_depth = 50  # meters (typical tropical forest edge effect)
widths = np.arange(10, 500, 5)
interior_widths = np.maximum(0, widths - 2 * edge_depth)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Width vs interior habitat
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.fill_between(widths, 0, widths, alpha=0.15, color='#ef4444', label='Edge habitat')
ax1.fill_between(widths, 0, interior_widths, alpha=0.4, color='#22c55e', label='Interior habitat')
ax1.axvline(2 * edge_depth, color='#f59e0b', linestyle='--', label=f'Min width for interior ({2*edge_depth}m)')
ax1.set_xlabel('Corridor width (m)', color='white')
ax1.set_ylabel('Habitat width (m)', color='white')
ax1.set_title('Edge Effect on Usable Habitat', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Species-specific requirements
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
species_reqs = {
    'Small birds': {'min_width': 30, 'max_length': 5000, 'color': '#22c55e'},
    'Langurs': {'min_width': 150, 'max_length': 2000, 'color': '#3b82f6'},
    'Clouded leopard': {'min_width': 200, 'max_length': 10000, 'color': '#ef4444'},
    'Elephant': {'min_width': 500, 'max_length': 20000, 'color': '#f59e0b'},
}

for species, req in species_reqs.items():
    ax2.add_patch(plt.Rectangle((0, 0), req['max_length'], req['min_width'],
                                 alpha=0.3, color=req['color'], label=species))

ax2.set_xlabel('Corridor length (m)', color='white')
ax2.set_ylabel('Corridor width (m)', color='white')
ax2.set_title('Minimum Requirements by Species', color='white', fontsize=11)
ax2.set_xlim(0, 22000)
ax2.set_ylim(0, 600)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Crossing probability vs corridor length
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
lengths = np.linspace(0, 10000, 200)
# P(cross) = e^(-risk * length)
risk_rates = [0.0002, 0.0005, 0.001]
risk_labels = ['Low predation', 'Medium predation', 'High predation']
risk_colors = ['#22c55e', '#f59e0b', '#ef4444']

for rate, label, color in zip(risk_rates, risk_labels, risk_colors):
    p_cross = np.exp(-rate * lengths)
    ax3.plot(lengths, p_cross * 100, color=color, linewidth=2, label=label)

ax3.set_xlabel('Corridor length (m)', color='white')
ax3.set_ylabel('Crossing probability (%)', color='white')
ax3.set_title('Crossing Success vs Length & Risk', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# Cost-effectiveness
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Cost = width * length * cost_per_m2
# Benefit = species served (based on width threshold)
corridor_widths = np.arange(10, 510, 10)
corridor_length = 1000  # fixed 1km
cost_per_m2 = 10  # USD to restore

costs = corridor_widths * corridor_length * cost_per_m2 / 1e6  # in millions
species_served = np.zeros(len(corridor_widths))
for i, w in enumerate(corridor_widths):
    for sp, req in species_reqs.items():
        if w >= req['min_width']:
            species_served[i] += 1

ax4.plot(costs, species_served, color='#3b82f6', linewidth=2, drawstyle='steps-post')
for sp, req in species_reqs.items():
    cost_at = req['min_width'] * corridor_length * cost_per_m2 / 1e6
    count = sum(1 for s in species_reqs.values() if req['min_width'] >= s['min_width'])
    ax4.plot(cost_at, count, 'o', color=species_reqs[sp]['color'], markersize=8)
    ax4.annotate(f'+{sp}', xy=(cost_at, count), xytext=(cost_at+0.1, count+0.2),
                color=species_reqs[sp]['color'], fontsize=8)

ax4.set_xlabel('Cost (million USD)', color='white')
ax4.set_ylabel('Species served', color='white')
ax4.set_title('Cost-Effectiveness (1km corridor)', color='white', fontsize=11)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Corridor design summary:")
print(f"  Edge depth: {edge_depth}m on each side")
print(f"  Minimum width for interior habitat: {2*edge_depth}m")
for sp, req in species_reqs.items():
    cost = req['min_width'] * 1000 * cost_per_m2 / 1e6
    print(f"  {sp}: width >= {req['min_width']}m, length <= {req['max_length']}m, cost: {cost:.1f}M/km")`,
      challenge: 'Design an optimal corridor for Namdapha: it needs to serve langurs (150m width) over a 3km gap. Calculate the total area of restored habitat, the cost, and the number of trees needed (assuming 400 trees/hectare).',
      successHint: 'Corridor design is where ecology meets engineering and economics. The math of edge effects, crossing probability, and cost-effectiveness is used by conservation planners worldwide to make the best use of limited funding.',
    },
    {
      title: 'Camera trap data analysis — counting the uncountable',
      concept: `How do you count animals that hide from humans, move at night, and live in dense forest? **Camera traps** — motion-triggered cameras bolted to trees — have revolutionized wildlife monitoring. They photograph animals without human presence, 24/7.

But raw photos aren't data. Turning camera trap images into population estimates requires statistics:
- **Capture-recapture**: identify individuals by markings, estimate total population from how often the same individuals appear
- **Occupancy modeling**: from presence/absence at many camera locations, estimate what fraction of the habitat is used
- **Activity patterns**: timestamp analysis reveals when species are active (diurnal, nocturnal, crepuscular)
- **Relative abundance index (RAI)**: number of captures per 100 trap-nights (standardized comparison)

A single camera in Namdapha might photograph 15-20 species in a month: clouded leopards, binturongs, marbled cats, elephants, and of course, primates. Each photo is a data point in the story of who lives there and how they use the forest.`,
      analogy: 'Camera traps are like toll booth records on a highway. You don\'t need to follow every car to know traffic patterns — just record who passes each booth and when. From that data alone, you can estimate total traffic, peak hours, popular routes, and which vehicles are rare. Camera traps do this for wildlife in the forest "highway."',
      storyConnection: 'If the monkey bridge existed in real life, camera traps would be the way to document it. A camera at the crossing point would record which monkeys use the bridge, how often, and when. The data would reveal the social network in action — dominant individuals crossing first, mothers with infants, juveniles learning the route. Camera traps make invisible behavior visible.',
      checkQuestion: 'A camera trap photographs 5 individually identifiable clouded leopards in month 1. In month 2, it photographs 7, of which 3 were already seen in month 1. Estimate the total population.',
      checkAnswer: 'Using the Lincoln-Petersen method: N = (n1 * n2) / m, where n1 = 5 (first capture), n2 = 7 (second capture), m = 3 (recaptured). N = (5 * 7) / 3 = 11.7, so approximately 12 clouded leopards. This is a rough estimate — real studies use more sophisticated models accounting for detection probability, temporary emigration, and individual heterogeneity.',
      codeIntro: 'Simulate camera trap data and estimate population using capture-recapture.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate camera trap study
true_population = 25  # actual number of animals
n_cameras = 10
n_days = 30
detection_prob = 0.15  # probability of being photographed per camera per day

# Generate capture histories
# Each row = an individual, each column = a camera-day
n_occasions = n_cameras * n_days
captures = np.random.random((true_population, n_cameras, n_days)) < detection_prob

# Summarize: was each individual ever captured at each camera?
ever_captured = captures.any(axis=2)  # (animals, cameras)
total_detected = ever_captured.any(axis=1).sum()

# Activity pattern (hour of day)
# Most primates are diurnal (active during day)
n_photos = 500
hours = np.concatenate([
    np.random.normal(9, 2, 200),   # morning peak
    np.random.normal(15, 2, 150),  # afternoon peak
    np.random.normal(12, 1, 100),  # midday
    np.random.uniform(0, 24, 50),  # random (other species triggering camera)
])
hours = hours % 24

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Detection by camera
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
detections_per_camera = ever_captured.sum(axis=0)
ax1.bar(range(n_cameras), detections_per_camera, color='#22c55e', alpha=0.8)
ax1.set_xlabel('Camera station', color='white')
ax1.set_ylabel('Unique individuals detected', color='white')
ax1.set_title(f'Detections per Camera (true pop = {true_population})', color='white', fontsize=11)
ax1.axhline(true_population, color='#ef4444', linestyle='--', label=f'True population: {true_population}')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Discovery curve
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
cumulative_new = []
seen = set()
for day in range(n_days):
    for cam in range(n_cameras):
        for ind in range(true_population):
            if captures[ind, cam, day]:
                seen.add(ind)
    cumulative_new.append(len(seen))

ax2.plot(range(1, n_days+1), cumulative_new, color='#3b82f6', linewidth=2, marker='o', markersize=3)
ax2.axhline(true_population, color='#ef4444', linestyle='--', alpha=0.7, label=f'True: {true_population}')
ax2.axhline(total_detected, color='#f59e0b', linestyle=':', alpha=0.7, label=f'Detected: {total_detected}')
ax2.set_xlabel('Survey day', color='white')
ax2.set_ylabel('Cumulative unique individuals', color='white')
ax2.set_title('Species Accumulation Curve', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Activity pattern
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.hist(hours, bins=24, range=(0, 24), color='#f59e0b', alpha=0.8, edgecolor='none')
ax3.axvspan(6, 18, alpha=0.1, color='#f59e0b', label='Daylight hours')
ax3.set_xlabel('Hour of day', color='white')
ax3.set_ylabel('Photo count', color='white')
ax3.set_title('Activity Pattern (Diurnal Primate)', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Capture-recapture estimation
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Simulate multiple capture-recapture estimates
estimates = []
for trial in range(1000):
    # Split into two "sessions"
    session1 = captures[:, :, :15].any(axis=(1, 2))
    session2_new = np.random.random((true_population, n_cameras, 15)) < detection_prob
    session2 = session2_new.any(axis=(1, 2))
    n1 = session1.sum()
    n2 = session2.sum()
    m = (session1 & session2).sum()
    if m > 0:
        N_hat = (n1 * n2) / m
        estimates.append(N_hat)

ax4.hist(estimates, bins=30, color='#a855f7', alpha=0.8, edgecolor='none')
ax4.axvline(true_population, color='#ef4444', linewidth=2, linestyle='--', label=f'True: {true_population}')
ax4.axvline(np.mean(estimates), color='#22c55e', linewidth=2, linestyle=':', label=f'Mean estimate: {np.mean(estimates):.1f}')
ax4.set_xlabel('Population estimate', color='white')
ax4.set_ylabel('Frequency', color='white')
ax4.set_title('Lincoln-Petersen Estimates (1000 simulations)', color='white', fontsize=11)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"True population: {true_population}")
print(f"Detected in survey: {total_detected}")
print(f"Lincoln-Petersen mean estimate: {np.mean(estimates):.1f}")
print(f"Estimate std dev: {np.std(estimates):.1f}")
print(f"95% CI: [{np.percentile(estimates, 2.5):.1f}, {np.percentile(estimates, 97.5):.1f}]")`,
      challenge: 'What happens to the estimate accuracy if detection probability drops from 0.15 to 0.05 (shy species)? Run the simulation and compare the confidence interval width.',
      successHint: 'Camera trap data analysis combines ecology with statistics and increasingly with computer vision (AI that identifies species from photos). This is one of the most active and exciting fields in conservation biology today.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Behavioral Ecology — builds on Level 1 concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecology modeling. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
