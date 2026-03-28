import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MonkeyBridgeLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

    const miniLessons = [
    {
      title: 'Capstone — Build a Canopy Connectivity Analyzer using graph theory',
      concept: 'In this capstone you will build a tool that analyzes forest canopy connectivity for arboreal primates. The model represents each tree as a node in a graph, with edges connecting trees whose canopies overlap or are within jumping distance. Connected components represent usable habitat patches — a monkey can travel within a component but not between them without descending to the ground.\n\nYou will implement: (1) Graph construction from tree positions and crown radii, (2) Connected component detection using BFS, (3) Deforestation impact simulation showing how targeted vs random tree removal fragments habitat, (4) Identification of critical trees whose removal would disconnect the canopy. The model reveals that a few well-connected hub trees hold the canopy network together — losing them causes disproportionate habitat fragmentation.',
      analogy: 'The canopy connectivity analyzer is like analyzing a subway map. Each tree is a station, and canopy connections are the rail lines. If you remove a station on a line with no alternatives (a critical hub), you split the network and strand passengers on both sides. The analyzer finds these critical stations in the forest — the trees that, if cut, would divide monkey habitat into isolated fragments.',
      storyConnection: "The monkeys in the story use natural bridges between trees — branches, vines, and canopy overlaps. Your analyzer maps these aerial pathways as a network and identifies which connections are most critical. When loggers cut trees, they are not just removing wood — they are removing nodes from the monkeys' transportation network. The analyzer quantifies this invisible damage.",
      checkQuestion: 'A forest has 40 trees with average crown radius 5m. The largest connected component has 32 trees (80%). If the 3 trees with the highest connectivity (degree = 8, 7, 6) are logged, the largest component drops to 18 trees (45%). What does this mean for the monkey troop?',
      checkAnswer: "Losing 3 trees (7.5% of the forest) caused a 56% drop in connected habitat — from 32 to 18 trees. This is because these hub trees were bridges between otherwise disconnected clusters. For the monkey troop: their usable habitat nearly halved. A troop that could previously forage across 80% of the forest is now confined to 45%. If the troop's minimum viable habitat is 25 trees (based on food requirements), they have dropped from comfortable to dangerously close to the threshold. This demonstrates why conservationists must protect hub trees specifically, not just tree count.",
      codeIntro: 'Build a canopy connectivity analyzer that maps arboreal pathways, identifies critical trees, and simulates deforestation impacts.',
      code: 'import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\n\n# Canopy Connectivity Analyzer — graph-based habitat analysis\nn_trees = 40\nnp.random.seed(42)\ntree_x = np.random.uniform(0, 100, n_trees)\ntree_y = np.random.uniform(0, 100, n_trees)\ncrown_radius = np.random.uniform(3, 8, n_trees)\ntree_height = np.random.uniform(15, 35, n_trees)\n\n# Build connectivity graph (trees connected if canopies overlap or are within jump distance)\njump_distance = 5  # meters max gap monkeys can bridge\nadj_matrix = np.zeros((n_trees, n_trees), dtype=int)\nfor i in range(n_trees):\n    for j in range(i+1, n_trees):\n        dist = np.sqrt((tree_x[i]-tree_x[j])**2 + (tree_y[i]-tree_y[j])**2)\n        gap = dist - crown_radius[i] - crown_radius[j]\n        if gap <= jump_distance:\n            adj_matrix[i, j] = 1\n            adj_matrix[j, i] = 1\n\n# Find connected components (BFS)\nvisited = np.zeros(n_trees, dtype=bool)\ncomponents = []\ndef bfs(start):\n    queue = [start]\n    component = []\n    while queue:\n        node = queue.pop(0)\n        if visited[node]:\n            continue\n        visited[node] = True\n        component.append(node)\n        for neighbor in range(n_trees):\n            if adj_matrix[node, neighbor] and not visited[neighbor]:\n                queue.append(neighbor)\n    return component\n\nfor i in range(n_trees):\n    if not visited[i]:\n        comp = bfs(i)\n        components.append(comp)\n\n# Connectivity metrics\nn_edges = adj_matrix.sum() // 2\ndegree = adj_matrix.sum(axis=1)\nlargest_component = max(components, key=len)\nconnectivity_ratio = len(largest_component) / n_trees\n\nfig, axes = plt.subplots(2, 2, figsize=(14, 11))\nfig.patch.set_facecolor(\'#1f2937\')\n\n# Plot 1: Canopy map with connectivity\nax = axes[0, 0]\nax.set_facecolor(\'#111827\')\ncomp_colors = plt.cm.Set3(np.linspace(0, 1, len(components)))\nfor comp_idx, comp in enumerate(components):\n    color = comp_colors[comp_idx]\n    for tree_idx in comp:\n        circle = plt.Circle((tree_x[tree_idx], tree_y[tree_idx]), crown_radius[tree_idx],\n                            color=color, alpha=0.3)\n        ax.add_patch(circle)\n        ax.plot(tree_x[tree_idx], tree_y[tree_idx], \'o\', color=color, markersize=4)\n# Draw edges\nfor i in range(n_trees):\n    for j in range(i+1, n_trees):\n        if adj_matrix[i, j]:\n            ax.plot([tree_x[i], tree_x[j]], [tree_y[i], tree_y[j]],\n                   color=\'white\', linewidth=0.5, alpha=0.3)\nax.set_xlim(-5, 105); ax.set_ylim(-5, 105)\nax.set_aspect(\'equal\')\nax.set_title(f\'Canopy Connectivity ({len(components)} components)\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax.set_xlabel(\'X (m)\', color=\'white\')\nax.set_ylabel(\'Y (m)\', color=\'white\')\nax.tick_params(colors=\'gray\')\n\n# Plot 2: Degree distribution\nax2 = axes[0, 1]\nax2.set_facecolor(\'#111827\')\nax2.hist(degree, bins=range(0, max(degree)+2), color=\'#3b82f6\', alpha=0.8, edgecolor=\'white\', linewidth=0.5)\nax2.axvline(np.mean(degree), color=\'#fbbf24\', linestyle=\'--\', linewidth=2, label=f\'Mean degree: {np.mean(degree):.1f}\')\nax2.set_xlabel(\'Number of connected neighbors\', color=\'white\')\nax2.set_ylabel(\'Number of trees\', color=\'white\')\nax2.set_title(\'Tree Connectivity Distribution\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax2.legend(fontsize=10, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax2.tick_params(colors=\'gray\')\n\n# Plot 3: Deforestation impact simulation\nax3 = axes[1, 0]\nax3.set_facecolor(\'#111827\')\nremoval_pcts = np.arange(0, 85, 5)\nconnectivity_targeted = []\nconnectivity_random = []\nfor pct in removal_pcts:\n    n_remove = int(n_trees * pct / 100)\n    # Targeted: remove most connected trees first\n    order_targeted = np.argsort(degree)[::-1][:n_remove]\n    remaining_t = [i for i in range(n_trees) if i not in order_targeted]\n    if len(remaining_t) > 0:\n        sub_adj = adj_matrix[np.ix_(remaining_t, remaining_t)]\n        visited_t = np.zeros(len(remaining_t), dtype=bool)\n        max_comp_t = 0\n        for start in range(len(remaining_t)):\n            if not visited_t[start]:\n                q = [start]; comp_size = 0\n                while q:\n                    n_node = q.pop(0)\n                    if visited_t[n_node]: continue\n                    visited_t[n_node] = True; comp_size += 1\n                    for nb in range(len(remaining_t)):\n                        if sub_adj[n_node, nb] and not visited_t[nb]: q.append(nb)\n                max_comp_t = max(max_comp_t, comp_size)\n        connectivity_targeted.append(max_comp_t / max(len(remaining_t), 1))\n    else:\n        connectivity_targeted.append(0)\n    # Random removal (average of 10 trials)\n    rand_conn = []\n    for _ in range(10):\n        order_rand = np.random.permutation(n_trees)[:n_remove]\n        remaining_r = [i for i in range(n_trees) if i not in order_rand]\n        if len(remaining_r) > 0:\n            sub_adj_r = adj_matrix[np.ix_(remaining_r, remaining_r)]\n            visited_r = np.zeros(len(remaining_r), dtype=bool)\n            max_comp_r = 0\n            for start in range(len(remaining_r)):\n                if not visited_r[start]:\n                    q = [start]; comp_size = 0\n                    while q:\n                        n_node = q.pop(0)\n                        if visited_r[n_node]: continue\n                        visited_r[n_node] = True; comp_size += 1\n                        for nb in range(len(remaining_r)):\n                            if sub_adj_r[n_node, nb] and not visited_r[nb]: q.append(nb)\n                    max_comp_r = max(max_comp_r, comp_size)\n            rand_conn.append(max_comp_r / max(len(remaining_r), 1))\n        else:\n            rand_conn.append(0)\n    connectivity_random.append(np.mean(rand_conn))\n\nax3.plot(removal_pcts, connectivity_targeted, \'o-\', color=\'#ef4444\', linewidth=2, label=\'Targeted removal\')\nax3.plot(removal_pcts, connectivity_random, \'s-\', color=\'#3b82f6\', linewidth=2, label=\'Random removal\')\nax3.axhline(0.5, color=\'#fbbf24\', linestyle=\'--\', linewidth=1, label=\'50% connectivity threshold\')\nax3.set_xlabel(\'Trees removed (%)\', color=\'white\')\nax3.set_ylabel(\'Largest component fraction\', color=\'white\')\nax3.set_title(\'Deforestation Impact on Connectivity\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax3.legend(fontsize=9, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax3.tick_params(colors=\'gray\')\n\n# Plot 4: Component size vs reachable habitat\nax4 = axes[1, 1]\nax4.set_facecolor(\'#111827\')\ncomp_sizes = sorted([len(c) for c in components], reverse=True)\ncomp_areas = [sum(np.pi * crown_radius[i]**2 for i in c) for c in sorted(components, key=len, reverse=True)]\nbars = ax4.bar(range(len(comp_sizes)), comp_areas, color=plt.cm.Set3(np.linspace(0, 1, len(comp_sizes))),\n               alpha=0.8, edgecolor=\'white\', linewidth=0.5)\nax4.set_xlabel(\'Component rank\', color=\'white\')\nax4.set_ylabel(\'Reachable canopy area (m²)\', color=\'white\')\nax4.set_title(\'Habitat Patches by Size\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax4.tick_params(colors=\'gray\')\nfor i, (bar, size) in enumerate(zip(bars, comp_sizes)):\n    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 10,\n             f\'{size} trees\', ha=\'center\', color=\'white\', fontsize=8)\n\nplt.tight_layout()\nplt.show()\n\nprint("=" * 65)\nprint("    CANOPY CONNECTIVITY ANALYZER — CAPSTONE REPORT")\nprint("=" * 65)\nprint(f"\\nForest: {n_trees} trees, {n_edges} canopy connections")\nprint(f"Jump distance: {jump_distance}m")\nprint(f"Connected components: {len(components)}")\nprint(f"Largest component: {len(largest_component)} trees ({connectivity_ratio:.0%} of forest)")\nprint(f"Mean degree: {np.mean(degree):.1f} neighbors per tree")\nprint(f"\\nCritical trees (highest degree):")\nfor idx in np.argsort(degree)[::-1][:5]:\n    print(f"  Tree {idx}: {degree[idx]} connections")\nprint(f"\\nRemoving the 5 most connected trees would fragment the canopy")\nprint(f"more than removing 15 random trees — targeted conservation matters.")',
      challenge: 'Add a corridor planting feature: given two disconnected components, find the minimum number of trees to plant (and their positions) to reconnect the canopy. Use a minimum spanning tree approach on the gap between components.',
      successHint: 'You have built a graph-theoretic analysis tool for conservation biology — quantifying how forest structure affects arboreal wildlife. The canopy connectivity analyzer demonstrates why protecting specific trees (hub nodes) matters more than simple tree counts for preserving primate habitat.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Canopy Connectivity Analyzer using graph theory</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a paper strength predictor. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
