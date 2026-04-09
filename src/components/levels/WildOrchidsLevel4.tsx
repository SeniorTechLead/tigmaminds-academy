import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function WildOrchidsLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone: Symbiosis Network Visualizer — graph data structures',
      concept: `Your capstone project is to build a **Symbiosis Network Visualizer** that maps mycorrhizal connections between trees, fungi, and orchids, and analyzes network properties to predict ecosystem resilience.

This is a **graph analysis** problem. The mycorrhizal network is a graph where:
- **Nodes** = organisms (trees, fungi, orchids)
- **Edges** = mycorrhizal connections with resource flow
- **Node attributes** = species, size, resource production
- **Edge attributes** = connection strength, resource flow rate

Graph metrics that predict ecosystem health:
- **Degree distribution**: how many connections each node has
- **Clustering coefficient**: how interconnected your neighbors are
- **Betweenness centrality**: which nodes are bridges between communities
- **Network diameter**: maximum shortest path between any two nodes
- **Robustness**: how many nodes can be removed before the network fragments

We will build the network from scratch using adjacency matrices and implement key graph algorithms in numpy.`,
      analogy: 'Building a network visualizer is like mapping a city\'s road system. You start with intersections (nodes) and roads (edges). Then you ask: which intersections are the busiest (highest degree)? Which roads, if closed, would split the city in two (betweenness centrality)? How many roads must you close before the east side is completely cut off from the west (robustness)? The answers tell you where to invest in infrastructure — just as network metrics tell ecologists where to focus conservation efforts.',
      storyConnection: 'The wild orchids in the story depend on invisible connections between trees and fungi. Your visualizer makes these connections visible — transforming an abstract ecological concept into a concrete, analyzable network. When a logger looks at a forest, they see timber. When your visualizer looks at the same forest, it sees a network where removing one tree can cascade into orchid extinction.',
      checkQuestion: 'A mycorrhizal network has 50 trees and 200 connections. Is this a dense or sparse network? How do you know?',
      checkAnswer: 'A complete graph of 50 nodes would have 50*49/2 = 1,225 edges. With 200 edges, the density is 200/1225 = 16%. This is relatively sparse — typical of real mycorrhizal networks where connections are limited by physical distance and fungal species compatibility. Sparse networks are more vulnerable to fragmentation because there are fewer alternative paths between nodes.',
      codeIntro: 'Build a mycorrhizal network data structure from scratch and compute basic graph properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Build mycorrhizal network from scratch
class MycorrhizalNetwork:
    def __init__(self):
        self.nodes = {}  # id -> {type, x, y, size, species}
        self.adj_matrix = None
        self.edge_weights = None

    def add_node(self, node_id, node_type, x, y, size=1.0, species=''):
        self.nodes[node_id] = {'type': node_type, 'x': x, 'y': y,
                                'size': size, 'species': species}

    def build_adjacency(self, max_dist_tree_fungus=3.0, max_dist_orchid_fungus=2.0):
        n = len(self.nodes)
        self.adj_matrix = np.zeros((n, n))
        self.edge_weights = np.zeros((n, n))
        ids = sorted(self.nodes.keys())

        for i, id1 in enumerate(ids):
            for j, id2 in enumerate(ids):
                if i >= j:
                    continue
                n1, n2 = self.nodes[id1], self.nodes[id2]
                dist = np.sqrt((n1['x']-n2['x'])**2 + (n1['y']-n2['y'])**2)

                can_connect = False
                if n1['type'] == 'tree' and n2['type'] == 'fungus':
                    can_connect = dist < max_dist_tree_fungus
                elif n1['type'] == 'fungus' and n2['type'] == 'tree':
                    can_connect = dist < max_dist_tree_fungus
                elif n1['type'] == 'orchid' and n2['type'] == 'fungus':
                    can_connect = dist < max_dist_orchid_fungus
                elif n1['type'] == 'fungus' and n2['type'] == 'orchid':
                    can_connect = dist < max_dist_orchid_fungus

                if can_connect:
                    weight = 1.0 / (dist + 0.5)
                    self.adj_matrix[i, j] = 1
                    self.adj_matrix[j, i] = 1
                    self.edge_weights[i, j] = weight
                    self.edge_weights[j, i] = weight

    def degree(self):
        return np.sum(self.adj_matrix, axis=1)

    def clustering_coefficient(self):
        n = len(self.nodes)
        cc = np.zeros(n)
        for i in range(n):
            neighbors = np.where(self.adj_matrix[i] > 0)[0]
            k = len(neighbors)
            if k < 2:
                cc[i] = 0
                continue
            # Count edges between neighbors
            edges_between = 0
            for ni in range(len(neighbors)):
                for nj in range(ni+1, len(neighbors)):
                    if self.adj_matrix[neighbors[ni], neighbors[nj]] > 0:
                        edges_between += 1
            cc[i] = 2 * edges_between / (k * (k-1))
        return cc

    def betweenness_centrality(self):
        """Simplified betweenness using BFS shortest paths."""
        n = len(self.nodes)
        bc = np.zeros(n)
        for s in range(n):
            # BFS from s
            visited = np.zeros(n, dtype=bool)
            dist = np.full(n, -1)
            paths = np.zeros(n)
            visited[s] = True
            dist[s] = 0
            paths[s] = 1
            queue = [s]
            order = []
            while queue:
                v = queue.pop(0)
                order.append(v)
                for w in range(n):
                    if self.adj_matrix[v, w] > 0:
                        if not visited[w]:
                            visited[w] = True
                            dist[w] = dist[v] + 1
                            queue.append(w)
                        if dist[w] == dist[v] + 1:
                            paths[w] += paths[v]
            # Back-propagate
            delta = np.zeros(n)
            for v in reversed(order):
                for w in range(n):
                    if self.adj_matrix[v, w] > 0 and dist[w] == dist[v] + 1:
                        delta[v] += (paths[v] / (paths[w]+1e-10)) * (1 + delta[w])
                if v != s:
                    bc[v] += delta[v]
        return bc / ((n-1)*(n-2)+1e-10)

# Create forest network
net = MycorrhizalNetwork()
n_trees, n_fungi, n_orchids = 20, 12, 10

for i in range(n_trees):
    net.add_node(i, 'tree', np.random.uniform(0,12), np.random.uniform(0,12),
                 size=np.random.exponential(2)+1, species=f'Tree_{i}')
for i in range(n_fungi):
    net.add_node(n_trees+i, 'fungus', np.random.uniform(0,12), np.random.uniform(0,12),
                 size=1, species=f'Fungus_{i}')
for i in range(n_orchids):
    net.add_node(n_trees+n_fungi+i, 'orchid', np.random.uniform(0,12), np.random.uniform(0,12),
                 size=0.5, species=f'Orchid_{i}')

net.build_adjacency()

degrees = net.degree()
cc = net.clustering_coefficient()
bc = net.betweenness_centrality()

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Network visualization
ax = axes[0, 0]
ax.set_facecolor('#111827')
ids = sorted(net.nodes.keys())
n_total = len(ids)

# Draw edges
for i in range(n_total):
    for j in range(i+1, n_total):
        if net.adj_matrix[i,j] > 0:
            n1, n2 = net.nodes[ids[i]], net.nodes[ids[j]]
            ax.plot([n1['x'], n2['x']], [n1['y'], n2['y']],
                    color='#94a3b8', linewidth=net.edge_weights[i,j]*2, alpha=0.3)

# Draw nodes
for i, nid in enumerate(ids):
    nd = net.nodes[nid]
    if nd['type'] == 'tree':
        ax.scatter([nd['x']], [nd['y']], s=nd['size']*40, c='#22c55e',
                   edgecolors='white', linewidths=0.5, zorder=5)
    elif nd['type'] == 'fungus':
        ax.scatter([nd['x']], [nd['y']], s=40, c='#f59e0b', marker='s',
                   edgecolors='white', zorder=5)
    else:
        ax.scatter([nd['x']], [nd['y']], s=50, c='#a855f7', marker='*',
                   edgecolors='white', zorder=5)

ax.set_title(f'Mycorrhizal network ({int(np.sum(net.adj_matrix)/2)} edges)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Degree distribution
ax = axes[0, 1]
ax.set_facecolor('#111827')
tree_deg = degrees[:n_trees]
fungi_deg = degrees[n_trees:n_trees+n_fungi]
orchid_deg = degrees[n_trees+n_fungi:]
ax.hist(tree_deg, bins=10, alpha=0.6, color='#22c55e', label=f'Trees (mean={np.mean(tree_deg):.1f})')
ax.hist(fungi_deg, bins=10, alpha=0.6, color='#f59e0b', label=f'Fungi (mean={np.mean(fungi_deg):.1f})')
ax.hist(orchid_deg, bins=10, alpha=0.6, color='#a855f7', label=f'Orchids (mean={np.mean(orchid_deg):.1f})')
ax.set_xlabel('Degree (connections)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Degree distribution by organism type', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Betweenness centrality
ax = axes[1, 0]
ax.set_facecolor('#111827')
sorted_bc = np.argsort(bc)[::-1][:15]
names = [f"{'T' if ids[i]<n_trees else 'F' if ids[i]<n_trees+n_fungi else 'O'}{ids[i]}" for i in sorted_bc]
colors_bc = ['#22c55e' if ids[i]<n_trees else '#f59e0b' if ids[i]<n_trees+n_fungi else '#a855f7' for i in sorted_bc]
ax.barh(range(len(sorted_bc)), bc[sorted_bc], color=colors_bc, edgecolor='none')
ax.set_yticks(range(len(sorted_bc)))
ax.set_yticklabels(names, color='white', fontsize=8)
ax.set_xlabel('Betweenness centrality', color='white')
ax.set_title('Most critical nodes (bridges)', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.invert_yaxis()

# Network summary
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
n_edges = int(np.sum(net.adj_matrix) / 2)
density = n_edges / (n_total * (n_total-1) / 2)
summary = [
    ['Nodes (total)', str(n_total)],
    ['  Trees', str(n_trees)],
    ['  Fungi', str(n_fungi)],
    ['  Orchids', str(n_orchids)],
    ['Edges', str(n_edges)],
    ['Density', f'{density:.3f}'],
    ['Mean degree', f'{np.mean(degrees):.1f}'],
    ['Mean clustering', f'{np.mean(cc):.3f}'],
    ['Max betweenness', f'{np.max(bc):.3f}'],
]
table = ax.table(cellText=summary, colLabels=['Metric', 'Value'],
                  loc='center', cellLoc='left')
table.auto_set_font_size(False)
table.set_fontsize(10)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937'); cell.set_edgecolor('#374151')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Network Properties', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("MYCORRHIZAL NETWORK ANALYSIS")
print(f"Nodes: {n_total} ({n_trees} trees, {n_fungi} fungi, {n_orchids} orchids)")
print(f"Edges: {n_edges}, Density: {density:.3f}")
print(f"Mean degree: trees={np.mean(tree_deg):.1f}, fungi={np.mean(fungi_deg):.1f}, orchids={np.mean(orchid_deg):.1f}")
print(f"Most central node: {names[0]} (betweenness={bc[sorted_bc[0]]:.3f})")`,
      challenge: 'Implement community detection using spectral clustering on the adjacency matrix. Do the detected communities correspond to spatial clusters in the forest?',
      successHint: 'Graph data structures are the foundation of network science. The same algorithms you implemented for mycorrhizal networks apply to social networks, the internet, neural circuits, and gene regulatory networks.',
    },
    {
      title: 'Resource flow simulation — carbon and nutrients through the network',
      concept: `The network structure determines HOW resources flow. We now simulate resource dynamics on the graph: trees produce carbon, fungi extract a commission, and orchids receive the surplus.

The resource flow model:
- Each tree node produces carbon proportional to its canopy size
- Carbon flows along edges weighted by connection strength
- Fungi retain 20-30% (their "commission" for providing mineral nutrients)
- Remaining carbon is available to connected orchids
- The flow reaches equilibrium when production equals consumption

This is a **network flow problem** — similar to water flowing through pipes, traffic through road networks, or packets through the internet. The maximum flow between two nodes is constrained by the weakest link (bottleneck edge) on the path.`,
      analogy: 'Resource flow through a mycorrhizal network is like a water distribution system. Trees are the reservoirs (water sources). Pipes (fungal hyphae) carry water through the system. Fungi are the pumping stations that take a percentage for maintenance. Orchids are the end consumers. The amount of water each consumer gets depends on how many pipes connect to them and how close they are to a reservoir. Cut a main pipe and downstream consumers go dry.',
      storyConnection: 'The wild orchids in the story survive because carbon flows from towering trees through fungal networks to their tiny roots. Your simulation quantifies this flow: how many grams of carbon per day reach each orchid? Which trees are the biggest suppliers? Which fungal connections are the bottlenecks?',
      checkQuestion: 'A tree connected to 5 orchids through a single fungal node is producing 100 units of carbon. The fungal commission is 25%. How much carbon does each orchid get?',
      checkAnswer: 'The tree shares carbon with the fungus: 100 units flow to the fungal node. The fungus keeps 25% = 25 units. The remaining 75 units are divided among 5 orchids = 15 units each. BUT this assumes the tree sends ALL its carbon to this fungus and none to other connections. In reality, the tree distributes carbon across all its fungal connections proportional to their demand, so each orchid likely gets less than 15 units.',
      codeIntro: 'Simulate resource flow dynamics on the mycorrhizal network with production, transport, and consumption.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Network setup
n_trees, n_fungi, n_orchids = 20, 12, 10
n_total = n_trees + n_fungi + n_orchids

positions = np.random.uniform(0, 12, (n_total, 2))
types = ['tree']*n_trees + ['fungus']*n_fungi + ['orchid']*n_orchids
tree_sizes = np.concatenate([np.random.exponential(2, n_trees)+1, np.ones(n_fungi+n_orchids)])

# Build adjacency
adj = np.zeros((n_total, n_total))
for i in range(n_total):
    for j in range(i+1, n_total):
        dist = np.linalg.norm(positions[i] - positions[j])
        if types[i]=='tree' and types[j]=='fungus' and dist < 3.5:
            adj[i,j] = adj[j,i] = 1.0 / (dist + 0.5)
        elif types[i]=='fungus' and types[j]=='tree' and dist < 3.5:
            adj[i,j] = adj[j,i] = 1.0 / (dist + 0.5)
        elif types[i]=='orchid' and types[j]=='fungus' and dist < 2.5:
            adj[i,j] = adj[j,i] = 0.5 / (dist + 0.5)
        elif types[i]=='fungus' and types[j]=='orchid' and dist < 2.5:
            adj[i,j] = adj[j,i] = 0.5 / (dist + 0.5)

# Resource flow simulation
def simulate_flow(adj, types, tree_sizes, n_steps=100, fungal_commission=0.25):
    n = len(types)
    resources = np.zeros(n)
    # Trees start with proportional production
    for i in range(n):
        if types[i] == 'tree':
            resources[i] = tree_sizes[i] * 10

    history = np.zeros((n_steps, n))
    flow_matrix = np.zeros((n, n))

    for step in range(n_steps):
        # Trees produce
        for i in range(n):
            if types[i] == 'tree':
                resources[i] += tree_sizes[i] * 0.5

        # Flow along edges
        new_resources = resources.copy()
        for i in range(n):
            if types[i] != 'tree':
                continue
            # Tree distributes to connected fungi
            neighbors = np.where(adj[i] > 0)[0]
            fungal_neighbors = [j for j in neighbors if types[j] == 'fungus']
            if not fungal_neighbors:
                continue
            total_weight = sum(adj[i, j] for j in fungal_neighbors)
            export = resources[i] * 0.3  # export 30% of resources
            for j in fungal_neighbors:
                flow = export * adj[i, j] / (total_weight + 1e-10)
                new_resources[i] -= flow
                new_resources[j] += flow * (1 - fungal_commission)
                flow_matrix[i, j] += flow

        # Fungi distribute to orchids
        for i in range(n):
            if types[i] != 'fungus':
                continue
            neighbors = np.where(adj[i] > 0)[0]
            orchid_neighbors = [j for j in neighbors if types[j] == 'orchid']
            if not orchid_neighbors or new_resources[i] < 1:
                continue
            export = new_resources[i] * 0.4
            for j in orchid_neighbors:
                flow = export / len(orchid_neighbors)
                new_resources[i] -= flow
                new_resources[j] += flow
                flow_matrix[i, j] += flow

        # Consumption
        for i in range(n):
            if types[i] == 'orchid':
                new_resources[i] = max(0, new_resources[i] - 0.5)  # metabolic cost
            elif types[i] == 'fungus':
                new_resources[i] = max(0, new_resources[i] - 0.3)

        resources = np.clip(new_resources, 0, 200)
        history[step] = resources

    return history, flow_matrix

history, flows = simulate_flow(adj, types, tree_sizes)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Resource dynamics over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i in range(n_trees):
    ax.plot(history[:, i], color='#22c55e', alpha=0.3, linewidth=1)
for i in range(n_trees, n_trees+n_fungi):
    ax.plot(history[:, i], color='#f59e0b', alpha=0.5, linewidth=1)
for i in range(n_trees+n_fungi, n_total):
    ax.plot(history[:, i], color='#a855f7', alpha=0.7, linewidth=1.5)
ax.set_xlabel('Time steps', color='white')
ax.set_ylabel('Resource level', color='white')
ax.set_title('Resource dynamics (green=trees, orange=fungi, purple=orchids)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Final resources by type
ax = axes[0, 1]
ax.set_facecolor('#111827')
final = history[-1]
parts = [final[:n_trees], final[n_trees:n_trees+n_fungi], final[n_trees+n_fungi:]]
labels = ['Trees', 'Fungi', 'Orchids']
colors = ['#22c55e', '#f59e0b', '#a855f7']
bp = ax.boxplot(parts, labels=labels, patch_artist=True)
for patch, color in zip(bp['boxes'], colors):
    patch.set_facecolor(color)
    patch.set_alpha(0.6)
for element in ['whiskers', 'caps', 'medians']:
    plt.setp(bp[element], color='white')
ax.set_ylabel('Final resources', color='white')
ax.set_title('Resource distribution by organism type', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Flow network visualization
ax = axes[1, 0]
ax.set_facecolor('#111827')
for i in range(n_total):
    for j in range(n_total):
        if flows[i,j] > 0.5:
            ax.annotate('', xy=positions[j], xytext=positions[i],
                        arrowprops=dict(arrowstyle='->', color='#60a5fa',
                                       lw=min(flows[i,j]/10, 3), alpha=0.4))
type_colors = {'tree': '#22c55e', 'fungus': '#f59e0b', 'orchid': '#a855f7'}
for i in range(n_total):
    ax.scatter([positions[i,0]], [positions[i,1]], c=type_colors[types[i]],
               s=max(20, final[i]*3), edgecolors='white', linewidths=0.5, zorder=5)
ax.set_title('Resource flow network (arrow = flow direction)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Orchid survival analysis
ax = axes[1, 1]
ax.set_facecolor('#111827')
orchid_resources = final[n_trees+n_fungi:]
orchid_connections = [np.sum(adj[i] > 0) for i in range(n_trees+n_fungi, n_total)]
survival_threshold = 2.0
survived = orchid_resources > survival_threshold

ax.scatter(orchid_connections, orchid_resources,
           c=['#22c55e' if s else '#ef4444' for s in survived],
           s=80, edgecolors='white', zorder=5)
ax.axhline(survival_threshold, color='#f59e0b', linestyle='--', label='Survival threshold')
ax.set_xlabel('Network connections', color='white')
ax.set_ylabel('Final resources', color='white')
ax.set_title(f'Orchid survival: {sum(survived)}/{n_orchids} survive', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("RESOURCE FLOW ANALYSIS")
print(f"Tree mean resources: {np.mean(final[:n_trees]):.1f}")
print(f"Fungi mean resources: {np.mean(final[n_trees:n_trees+n_fungi]):.1f}")
print(f"Orchid mean resources: {np.mean(final[n_trees+n_fungi:]):.1f}")
print(f"Orchids surviving: {sum(survived)}/{n_orchids}")
print(f"Orchids with 0 connections: {sum(np.array(orchid_connections)==0)} (all die)")`,
      challenge: 'Implement a "drought year" where tree production drops by 50% for 20 time steps. Which orchids survive and which die? Is connectivity or proximity to large trees more important for drought survival?',
      successHint: 'Network flow simulation reveals the hidden dynamics of ecosystems. Resources do not distribute equally — network structure creates winners and losers. Understanding this is essential for conservation: protect the connections, not just the species.',
    },
    {
      title: 'Network robustness — how the forest survives disturbance',
      concept: `Real forests face constant disturbance: storms topple trees, diseases kill fungi, logging removes canopy. How resilient is the mycorrhizal network to these shocks?

**Robustness analysis** systematically removes nodes and measures network fragmentation:

1. **Random failure**: remove nodes randomly (simulates natural mortality). Networks with broad degree distributions are robust to random failure.
2. **Targeted attack**: remove the highest-degree nodes first (simulates selective logging of biggest trees). Scale-free networks are extremely vulnerable to targeted attack.
3. **Cascade failure**: removing one node causes connected nodes to fail (simulates disease spreading through the network).

Key metric: **largest connected component size** after removal. When it drops below 50% of original, the network is effectively fragmented — isolated subgroups can no longer share resources.

The **percolation threshold** is the fraction of nodes that must be removed to fragment the network. For random networks, this is approximately 1 - 1/k (where k is mean degree). For scale-free networks, targeted attack can fragment the network by removing only 1-5% of the nodes (the hubs).`,
      analogy: 'Network robustness is like testing a bridge by removing bolts. Remove random bolts (random failure) and the bridge holds — there are thousands of bolts and most are redundant. But remove the 5 bolts at the key stress points (targeted attack) and the bridge collapses. The mycorrhizal network has the same vulnerability: random tree loss is tolerable, but losing the biggest, most connected trees (hub nodes) can fragment the entire network.',
      storyConnection: 'The wild orchids in the story thrive in an old-growth forest with ancient, well-connected trees. If a storm knocks down a few young trees, the orchids barely notice — the network reroutes around the damage. But if loggers take the biggest trees (which are always the most connected), the network shatters and orchids across the forest lose their lifeline.',
      checkQuestion: 'A conservation manager has budget to protect 5 trees from logging. Should they protect the 5 biggest trees or 5 randomly chosen trees?',
      checkAnswer: 'Protect the 5 biggest trees. In mycorrhizal networks (like most ecological networks), the biggest trees are the most connected hub nodes. Removing hubs causes disproportionate network fragmentation. Protecting 5 hubs preserves network connectivity far more than protecting 5 random (likely low-connectivity) trees. This is one of the most actionable insights from network ecology: prioritize hub protection.',
      codeIntro: 'Implement robustness analysis with random failure, targeted attack, and cascade failure simulations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Build network
n_t, n_f, n_o = 25, 15, 12
n_all = n_t + n_f + n_o
pos = np.random.uniform(0, 15, (n_all, 2))
tp = ['tree']*n_t + ['fungus']*n_f + ['orchid']*n_o
sizes = np.concatenate([np.random.exponential(2, n_t)+1, np.ones(n_f+n_o)])

adj = np.zeros((n_all, n_all))
for i in range(n_all):
    for j in range(i+1, n_all):
        d = np.linalg.norm(pos[i]-pos[j])
        connect = False
        if tp[i]=='tree' and tp[j]=='fungus' and d < 4: connect = True
        if tp[i]=='fungus' and tp[j]=='tree' and d < 4: connect = True
        if tp[i]=='orchid' and tp[j]=='fungus' and d < 3: connect = True
        if tp[i]=='fungus' and tp[j]=='orchid' and d < 3: connect = True
        if connect:
            adj[i,j] = adj[j,i] = 1

def largest_component(adj_matrix):
    """Find size of largest connected component using BFS."""
    n = adj_matrix.shape[0]
    visited = np.zeros(n, dtype=bool)
    max_comp = 0
    for start in range(n):
        if visited[start]:
            continue
        queue = [start]
        visited[start] = True
        comp_size = 0
        while queue:
            v = queue.pop(0)
            comp_size += 1
            for w in range(n):
                if adj_matrix[v,w] > 0 and not visited[w]:
                    visited[w] = True
                    queue.append(w)
        max_comp = max(max_comp, comp_size)
    return max_comp

original_lcc = largest_component(adj)

# Robustness test: remove nodes and track LCC
def robustness_test(adj, removal_order, n_removals):
    lcc_sizes = [largest_component(adj)]
    current_adj = adj.copy()
    remaining = list(range(adj.shape[0]))

    for step in range(min(n_removals, len(removal_order))):
        node = removal_order[step]
        if node in remaining:
            idx = remaining.index(node)
            # Remove node from adjacency
            current_adj[node, :] = 0
            current_adj[:, node] = 0
            lcc_sizes.append(largest_component(current_adj))

    return lcc_sizes

# Random failure
n_remove = n_t  # remove up to all trees
random_order = np.random.permutation(n_t)  # only remove trees
lcc_random = robustness_test(adj, random_order, n_remove)

# Targeted attack (remove highest-degree trees first)
degrees = np.sum(adj[:n_t], axis=1)
targeted_order = np.argsort(-degrees)  # highest degree first
lcc_targeted = robustness_test(adj, targeted_order, n_remove)

# Random order for 10 trials
lcc_random_trials = []
for trial in range(10):
    order = np.random.permutation(n_t)
    lcc_random_trials.append(robustness_test(adj, order, n_remove))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Robustness curves
ax = axes[0, 0]
ax.set_facecolor('#111827')
x_remove = np.arange(len(lcc_targeted)) / n_t * 100

# Random trials (spread)
for trial in lcc_random_trials:
    x_t = np.arange(len(trial)) / n_t * 100
    ax.plot(x_t, np.array(trial)/original_lcc*100, color='#3b82f6', alpha=0.2, linewidth=1)

ax.plot(x_remove[:len(lcc_random)], np.array(lcc_random)/original_lcc*100,
        color='#3b82f6', linewidth=2, label='Random failure')
ax.plot(x_remove[:len(lcc_targeted)], np.array(lcc_targeted)/original_lcc*100,
        color='#ef4444', linewidth=2, label='Targeted attack (hubs)')

ax.axhline(50, color='#f59e0b', linestyle='--', alpha=0.5, label='Fragmentation threshold')
ax.set_xlabel('Trees removed (%)', color='white')
ax.set_ylabel('Largest component (% of original)', color='white')
ax.set_title('Network robustness: random vs targeted removal', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Degree distribution
ax = axes[0, 1]
ax.set_facecolor('#111827')
all_degrees = np.sum(adj, axis=1)
ax.hist(all_degrees[all_degrees > 0], bins=15, color='#a855f7', edgecolor='none', alpha=0.7)
ax.set_xlabel('Degree (connections)', color='white')
ax.set_ylabel('Node count', color='white')
ax.set_title('Degree distribution (right-skewed = vulnerable to targeted attack)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Hub identification
ax = axes[1, 0]
ax.set_facecolor('#111827')
for i in range(n_all):
    for j in range(i+1, n_all):
        if adj[i,j] > 0:
            ax.plot([pos[i,0], pos[j,0]], [pos[i,1], pos[j,1]], color='#94a3b8', linewidth=0.5, alpha=0.2)

# Color by degree (larger = redder = more critical)
node_colors = all_degrees / (np.max(all_degrees) + 1e-10)
for i in range(n_all):
    if tp[i] == 'tree':
        color = plt.cm.RdYlGn_r(node_colors[i])
        ax.scatter([pos[i,0]], [pos[i,1]], s=sizes[i]*30+20, c=[color],
                   edgecolors='white', linewidths=0.5, zorder=5)

# Mark top 3 hubs
top3 = np.argsort(-all_degrees[:n_t])[:3]
for idx in top3:
    ax.annotate(f'HUB (deg={int(all_degrees[idx])})',
                xy=pos[idx], fontsize=8, color='white',
                bbox=dict(boxstyle='round', facecolor='#ef4444', alpha=0.7))

ax.set_title('Hub trees (red = high degree = critical)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Orchid survival under different scenarios
ax = axes[1, 1]
ax.set_facecolor('#111827')
scenarios = ['Intact\\nforest', 'Random\\n10% loss', 'Random\\n30% loss',
             'Target\\ntop 3 hubs', 'Target\\ntop 5 hubs']
orchid_survival = []

# Intact
orchid_conn = [np.sum(adj[i] > 0) for i in range(n_t+n_f, n_all)]
orchid_survival.append(sum(1 for c in orchid_conn if c > 0) / n_o * 100)

# Random 10%
for pct in [0.1, 0.3]:
    n_rem = int(n_t * pct)
    removed = np.random.choice(n_t, n_rem, replace=False)
    adj_mod = adj.copy()
    for r in removed:
        adj_mod[r, :] = 0; adj_mod[:, r] = 0
    oc = [np.sum(adj_mod[i] > 0) for i in range(n_t+n_f, n_all)]
    orchid_survival.append(sum(1 for c in oc if c > 0) / n_o * 100)

# Targeted top 3, top 5
for n_hub in [3, 5]:
    hubs = np.argsort(-all_degrees[:n_t])[:n_hub]
    adj_mod = adj.copy()
    for r in hubs:
        adj_mod[r, :] = 0; adj_mod[:, r] = 0
    oc = [np.sum(adj_mod[i] > 0) for i in range(n_t+n_f, n_all)]
    orchid_survival.append(sum(1 for c in oc if c > 0) / n_o * 100)

colors_sc = ['#22c55e', '#fbbf24', '#f59e0b', '#ef4444', '#7f1d1d']
ax.bar(range(len(scenarios)), orchid_survival, color=colors_sc, edgecolor='none')
ax.set_xticks(range(len(scenarios)))
ax.set_xticklabels(scenarios, color='white', fontsize=8)
ax.set_ylabel('Orchids with connections (%)', color='white')
ax.set_title('Orchid survival under disturbance', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("ROBUSTNESS ANALYSIS")
print(f"Original LCC: {original_lcc} nodes")
print(f"After 30% random removal: LCC = {lcc_random[min(int(n_t*0.3), len(lcc_random)-1)]} ({lcc_random[min(int(n_t*0.3), len(lcc_random)-1)]/original_lcc:.0%})")
print(f"After removing top 3 hubs: LCC = {lcc_targeted[min(3, len(lcc_targeted)-1)]} ({lcc_targeted[min(3, len(lcc_targeted)-1)]/original_lcc:.0%})")
print()
print("Targeted removal of 3 hub trees causes more damage than random removal of 30%.")
print("This is the network vulnerability that conservation policy must address.")`,
      challenge: 'Implement cascade failure: when a tree is removed, connected fungi lose 50% of their resources. If a fungus drops below a threshold, it dies too, disconnecting its orchids. How does cascade failure compare to simple node removal?',
      successHint: 'Network robustness analysis is directly actionable for conservation. The finding that hub trees are disproportionately important has changed logging practices in some regions — selective logging now considers network connectivity, not just timber volume.',
    },
    {
      title: 'Capstone visualization — interactive network dashboard',
      concept: `The final step is creating a comprehensive visualization dashboard that communicates your network analysis to non-technical audiences (conservation managers, policymakers, the public).

The dashboard must answer four questions:
1. **What does the network look like?** (spatial visualization)
2. **Which nodes are most important?** (centrality highlighting)
3. **How vulnerable is the network?** (robustness curves)
4. **What should we protect?** (actionable recommendations)

Visualization principles for scientific communication:
- Use color to encode information (node type, vulnerability level)
- Use size to encode importance (degree, betweenness)
- Use layout to show spatial relationships (real positions, not abstract)
- Include quantitative summaries alongside visualizations
- Make the message clear: "Protecting these 5 trees preserves 90% of the network"`,
      analogy: 'The network dashboard is like a military strategic map. It shows the terrain (forest layout), the infrastructure (network connections), the critical assets (hub trees), and the vulnerabilities (what happens if bridges are destroyed). A general uses the map to decide where to deploy resources. A conservation manager uses your dashboard to decide where to focus protection efforts.',
      storyConnection: 'The wild orchids and trees in the story live in a web of connections invisible to the naked eye. Your dashboard makes this web visible — transforming ecological intuition ("the forest feels connected") into quantitative evidence ("removing tree #7 disconnects 40% of orchids"). This is how science informs conservation: by making the invisible visible and the intuitive measurable.',
      checkQuestion: 'A policymaker looks at your dashboard and says "just plant more trees to replace the ones we log." Why is this insufficient?',
      checkAnswer: 'New trees take decades to grow large enough to become hub nodes with extensive mycorrhizal connections. A 5-year-old planted tree has 1-2 connections; a 100-year-old hub tree has 15-20. The network function of an old-growth tree cannot be replicated by planting — it takes 50-100 years for a planted tree to reach similar connectivity. This is why old-growth protection is not interchangeable with replanting. The dashboard should show this time dimension.',
      codeIntro: 'Build the complete Symbiosis Network Visualizer dashboard with spatial layout, centrality analysis, robustness curves, and conservation recommendations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# SYMBIOSIS NETWORK VISUALIZER — COMPLETE DASHBOARD
# ============================================================

# Build realistic forest network
n_t, n_f, n_o = 25, 15, 12
n_all = n_t + n_f + n_o
pos = np.random.uniform(0, 15, (n_all, 2))
tp = ['tree']*n_t + ['fungus']*n_f + ['orchid']*n_o
sizes = np.concatenate([np.random.exponential(2, n_t)+1, np.ones(n_f+n_o)])

adj = np.zeros((n_all, n_all))
for i in range(n_all):
    for j in range(i+1, n_all):
        d = np.linalg.norm(pos[i]-pos[j])
        if tp[i]=='tree' and tp[j]=='fungus' and d < 4: adj[i,j] = adj[j,i] = 1
        if tp[i]=='fungus' and tp[j]=='tree' and d < 4: adj[i,j] = adj[j,i] = 1
        if tp[i]=='orchid' and tp[j]=='fungus' and d < 3: adj[i,j] = adj[j,i] = 1
        if tp[i]=='fungus' and tp[j]=='orchid' and d < 3: adj[i,j] = adj[j,i] = 1

deg = np.sum(adj, axis=1)
n_edges = int(np.sum(adj)/2)

# Betweenness (simplified)
bc = np.zeros(n_all)
for s in range(n_all):
    vis = np.zeros(n_all, dtype=bool); dist = np.full(n_all, -1); paths = np.zeros(n_all)
    vis[s]=True; dist[s]=0; paths[s]=1; q=[s]; order=[]
    while q:
        v=q.pop(0); order.append(v)
        for w in range(n_all):
            if adj[v,w]>0:
                if not vis[w]: vis[w]=True; dist[w]=dist[v]+1; q.append(w)
                if dist[w]==dist[v]+1: paths[w]+=paths[v]
    delta=np.zeros(n_all)
    for v in reversed(order):
        for w in range(n_all):
            if adj[v,w]>0 and dist[w]==dist[v]+1:
                delta[v]+=(paths[v]/(paths[w]+1e-10))*(1+delta[w])
        if v!=s: bc[v]+=delta[v]
bc /= (n_all-1)*(n_all-2)+1e-10

# Find top 5 critical trees
tree_importance = deg[:n_t] * 0.5 + bc[:n_t] * 100
top5 = np.argsort(-tree_importance)[:5]

# Robustness
def lcc(a):
    n=a.shape[0]; vis=np.zeros(n,dtype=bool); mx=0
    for s in range(n):
        if vis[s]: continue
        q=[s]; vis[s]=True; sz=0
        while q:
            v=q.pop(0); sz+=1
            for w in range(n):
                if a[v,w]>0 and not vis[w]: vis[w]=True; q.append(w)
        mx=max(mx,sz)
    return mx

orig_lcc = lcc(adj)
# Targeted removal
lcc_targeted = [orig_lcc]
a_t = adj.copy()
for node in np.argsort(-deg[:n_t]):
    a_t[node,:]=0; a_t[:,node]=0
    lcc_targeted.append(lcc(a_t))

# ============================================================
# DASHBOARD VISUALIZATION
# ============================================================
fig, axes = plt.subplots(2, 3, figsize=(18, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('SYMBIOSIS NETWORK VISUALIZER', color='white', fontsize=16, fontweight='bold')

# 1. Network map with vulnerability coloring
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i in range(n_all):
    for j in range(i+1, n_all):
        if adj[i,j]>0:
            ax.plot([pos[i,0],pos[j,0]], [pos[i,1],pos[j,1]], color='#94a3b8', linewidth=0.5, alpha=0.2)

# Trees colored by importance
for i in range(n_t):
    vuln = tree_importance[i] / (np.max(tree_importance)+1e-10)
    color = plt.cm.RdYlGn_r(vuln)
    ax.scatter([pos[i,0]], [pos[i,1]], s=sizes[i]*40, c=[color],
               edgecolors='white', linewidths=0.5, zorder=5)
for i in range(n_t, n_t+n_f):
    ax.scatter([pos[i,0]], [pos[i,1]], s=30, c='#f59e0b', marker='s', edgecolors='white', zorder=4)
for i in range(n_t+n_f, n_all):
    ax.scatter([pos[i,0]], [pos[i,1]], s=50, c='#a855f7', marker='*', edgecolors='white', zorder=4)

for idx in top5:
    ax.annotate(f'PROTECT', xy=pos[idx], fontsize=7, color='white', fontweight='bold',
                bbox=dict(boxstyle='round', facecolor='#ef4444', alpha=0.8))

ax.set_title('Network map (red trees = most critical)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 2. Robustness curve
ax = axes[0, 1]
ax.set_facecolor('#111827')
x_pct = np.arange(len(lcc_targeted)) / n_t * 100
ax.plot(x_pct, np.array(lcc_targeted)/orig_lcc*100, color='#ef4444', linewidth=2)
ax.axhline(50, color='#f59e0b', linestyle='--', alpha=0.5, label='50% fragmentation')
# Find threshold
threshold_idx = np.argmax(np.array(lcc_targeted)/orig_lcc < 0.5)
if threshold_idx > 0:
    ax.axvline(threshold_idx/n_t*100, color='#ef4444', linestyle=':', alpha=0.5,
               label=f'Threshold: {threshold_idx} trees ({threshold_idx/n_t*100:.0f}%)')
ax.set_xlabel('Hub trees removed (%)', color='white')
ax.set_ylabel('Network connectivity (%)', color='white')
ax.set_title('Fragmentation under targeted removal', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 3. Node importance ranking
ax = axes[0, 2]
ax.set_facecolor('#111827')
top10 = np.argsort(-tree_importance)[:10]
colors_rank = ['#ef4444']*5 + ['#f59e0b']*5
ax.barh(range(10), tree_importance[top10], color=colors_rank, edgecolor='none')
ax.set_yticks(range(10))
ax.set_yticklabels([f'Tree {i} (deg={int(deg[i])})' for i in top10], color='white', fontsize=8)
ax.set_xlabel('Importance score', color='white')
ax.set_title('Top 10 trees to protect (red = top 5)', color='white', fontsize=10)
ax.tick_params(colors='gray')
ax.invert_yaxis()

# 4. Orchid dependency map
ax = axes[1, 0]
ax.set_facecolor('#111827')
orchid_deps = []
for i in range(n_t+n_f, n_all):
    # Which trees is this orchid ultimately connected to?
    connected_fungi = [j for j in range(n_all) if adj[i,j]>0 and tp[j]=='fungus']
    connected_trees = set()
    for f in connected_fungi:
        for t in range(n_t):
            if adj[f,t] > 0:
                connected_trees.add(t)
    orchid_deps.append(connected_trees)

orchid_labels = [f'O{i-n_t-n_f}' for i in range(n_t+n_f, n_all)]
dep_counts = [len(d) for d in orchid_deps]
hub_deps = [len(d.intersection(set(top5))) for d in orchid_deps]

x = np.arange(n_o)
ax.bar(x, dep_counts, 0.4, color='#3b82f6', label='All tree connections')
ax.bar(x+0.4, hub_deps, 0.4, color='#ef4444', label='Hub tree connections')
ax.set_xticks(x+0.2)
ax.set_xticklabels(orchid_labels, color='white', fontsize=8)
ax.set_ylabel('Connected trees', color='white')
ax.set_title('Orchid dependency on hub trees', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 5. Conservation recommendation
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
# Calculate impact of protecting top 5
a_without5 = adj.copy()
for t in top5:
    a_without5[t,:]=0; a_without5[:,t]=0
lcc_without5 = lcc(a_without5)
orchid_conn_without5 = sum(1 for i in range(n_t+n_f, n_all) if np.sum(a_without5[i])>0)

recs = [
    ['Protect these trees', ', '.join([f'T{i}' for i in top5])],
    ['Network connectivity saved', f'{(orig_lcc-lcc_without5)/orig_lcc*100:.0f}% at risk'],
    ['Orchids dependent on hubs', f'{sum(1 for h in hub_deps if h>0)}/{n_o}'],
    ['Cost of losing hubs', f'{n_o - orchid_conn_without5} orchids disconnected'],
    ['Fragmentation threshold', f'{threshold_idx} trees ({threshold_idx/n_t*100:.0f}%)'],
]
table = ax.table(cellText=recs, colLabels=['Recommendation', 'Detail'],
                  loc='center', cellLoc='left')
table.auto_set_font_size(False)
table.set_fontsize(10)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937'); cell.set_edgecolor('#374151')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('CONSERVATION RECOMMENDATIONS', color='#22c55e', fontsize=11, pad=20)

# 6. Network health score
ax = axes[1, 2]
ax.set_facecolor('#111827')
density = n_edges / (n_all*(n_all-1)/2)
mean_cc = np.mean([0])  # simplified
resilience = threshold_idx / n_t if threshold_idx > 0 else 1.0
orchid_coverage = sum(1 for c in dep_counts if c > 0) / n_o

health_metrics = ['Connectivity', 'Density', 'Resilience', 'Orchid\\ncoverage']
health_values = [orig_lcc/n_all, density*10, resilience, orchid_coverage]
health_colors = ['#22c55e' if v > 0.5 else '#f59e0b' if v > 0.3 else '#ef4444' for v in health_values]

bars = ax.bar(health_metrics, health_values, color=health_colors, edgecolor='none')
ax.set_ylim(0, 1.2)
ax.set_title('Network Health Score', color='white', fontsize=10)
ax.tick_params(colors='gray')
for bar, val in zip(bars, health_values):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.03,
            f'{val:.2f}', ha='center', color='white', fontsize=10, fontweight='bold')

overall_health = np.mean(health_values)
fig.text(0.5, 0.02, f'OVERALL NETWORK HEALTH: {overall_health:.0%}', ha='center',
         color='#22c55e' if overall_health > 0.6 else '#ef4444',
         fontsize=14, fontweight='bold')

plt.tight_layout(rect=[0, 0.05, 1, 0.95])
plt.show()

print("=" * 60)
print("SYMBIOSIS NETWORK VISUALIZER — REPORT")
print("=" * 60)
print(f"Network: {n_t} trees, {n_f} fungi, {n_o} orchids, {n_edges} connections")
print(f"Top 5 critical trees: {[f'T{i}(deg={int(deg[i])})' for i in top5]}")
print(f"Fragmentation threshold: {threshold_idx} trees ({threshold_idx/n_t:.0%})")
print(f"Orchids connected: {sum(1 for c in dep_counts if c>0)}/{n_o}")
print(f"Overall health: {overall_health:.0%}")
print()
print("RECOMMENDATION: Protect trees", [f'T{i}' for i in top5])
print("Losing these 5 trees would disconnect", n_o-orchid_conn_without5, "orchids.")`,
      challenge: 'Add temporal dynamics: simulate 50 years of tree growth, new connections forming, and random mortality. Track how the network evolves and whether orchid populations are stable. Does the network self-heal after disturbance?',
      successHint: 'You have built a complete ecological network analysis tool from scratch: graph construction, centrality analysis, flow simulation, robustness testing, and conservation recommendations. This same framework powers real-world conservation decisions in forests, coral reefs, and savanna ecosystems worldwide.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Symbiosis Network Visualizer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (symbiotic ecology & epiphyte biology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Build a mycorrhizal network visualizer and analyzer. Click to start Python.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            />
        ))}
      </div>
    </div>
  );
}
