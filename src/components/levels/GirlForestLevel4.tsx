import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function GirlForestLevel4() {
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
      title: 'Capstone — Build a Forest Growth Simulator using Lotka-Volterra competition',
      concept: 'In this capstone you will build a forest ecosystem simulator that models how multiple tree species compete, coexist, and grow over decades. The model uses Lotka-Volterra competition equations: dNi/dt = ri × Ni × (1 - Sum(αij × Nj/Kj)), where Ni is population of species i, ri is growth rate, Ki is carrying capacity, and αij is the competition coefficient (how much species j affects species i).\n\nThe simulator tracks four tree species common to Assam forests, models carbon sequestration over time, calculates biodiversity indices (Shannon diversity), and includes stochastic disturbance events (storms, disease). You will use the simulator to explore management scenarios: what happens with selective logging? What if a fast-growing species is introduced? How long until a planted forest reaches old-growth diversity?',
      analogy: "A forest growth simulator is like a chess game played by trees. Each species has its own strategy (growth rate, shade tolerance, competition ability). Bamboo is the aggressive player — fast growth, takes space quickly. Hollong is the patient strategist — slow but eventually dominates with massive size. The competition matrix is the rule book that determines who wins each encounter. Your simulator plays thousands of these games to predict the forest's future.",
      storyConnection: 'The girl in the story planted a forest that grew over years into a thriving ecosystem. Your simulator models exactly this process — how a few planted seedlings develop into a complex community through competition, growth, and ecological succession. The simulator reveals what the story shows intuitively: forests are not just collections of trees but dynamic systems where every species plays a role.',
      checkQuestion: 'After 50 years, the simulator shows bamboo dominates (60% of trees) while Hollong is only 5%. Is this a healthy forest? What management action could increase Hollong representation without destroying the bamboo?',
      checkAnswer: 'Bamboo dominating at 60% is ecologically imbalanced — low species evenness despite reasonable species richness. Hollong at 5% is below self-sustaining levels. Management options: (1) Selective bamboo thinning — remove 30% of bamboo every 5 years, creating gaps for Hollong seedlings. (2) Enrichment planting — add Hollong saplings in bamboo-free gaps. (3) Long-term patience — Hollong is slow-growing but eventually out-competes bamboo in the canopy due to greater height and shade tolerance. After 100+ years, natural succession may shift composition. The best approach combines (1) and (2): thin bamboo to accelerate natural succession while planting Hollong to boost its numbers.',
      codeIntro: 'Build a multi-species forest growth simulator with competition dynamics, carbon tracking, and biodiversity analysis.',
      code: 'import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\n\n# Forest Growth Simulator — population dynamics of tree species\nn_years = 100\ndt = 1  # year\nn_species = 4\nspecies = [\'Sal\', \'Teak\', \'Bamboo\', \'Hollong\']\ncolors = [\'#22c55e\', \'#f59e0b\', \'#3b82f6\', \'#ef4444\']\n\n# Growth parameters (logistic growth with competition)\nK = np.array([500, 300, 800, 200])  # carrying capacity (trees/hectare)\nr = np.array([0.08, 0.05, 0.15, 0.03])  # intrinsic growth rate\n# Competition matrix (alpha_ij: effect of species j on species i)\nalpha = np.array([\n    [1.0, 0.6, 0.3, 0.4],\n    [0.5, 1.0, 0.4, 0.3],\n    [0.2, 0.3, 1.0, 0.2],\n    [0.7, 0.5, 0.3, 1.0],\n])\n\n# Initial populations\nN0 = np.array([50, 30, 100, 20])\n\n# Simulate with Lotka-Volterra competition\nN = np.zeros((n_years, n_species))\nN[0] = N0\nfor t in range(1, n_years):\n    for i in range(n_species):\n        competition = sum(alpha[i, j] * N[t-1, j] / K[j] for j in range(n_species))\n        dN = r[i] * N[t-1, i] * (1 - competition) * dt\n        # Add stochastic events (storms, disease)\n        if np.random.random() < 0.05:\n            dN -= N[t-1, i] * np.random.uniform(0.05, 0.2)\n        N[t, i] = max(1, N[t-1, i] + dN)\n\n# Carbon sequestration model\nbiomass_per_tree = np.array([200, 300, 50, 400])  # kg per mature tree\ncarbon_fraction = 0.47\ntotal_carbon = N * biomass_per_tree * carbon_fraction / 1000  # tonnes/ha\n\n# Biodiversity index (Shannon)\nshannon = np.zeros(n_years)\nfor t in range(n_years):\n    total = N[t].sum()\n    if total > 0:\n        p = N[t] / total\n        p = p[p > 0]\n        shannon[t] = -np.sum(p * np.log(p))\n\nfig, axes = plt.subplots(2, 2, figsize=(14, 11))\nfig.patch.set_facecolor(\'#1f2937\')\n\n# Plot 1: Population dynamics\nax = axes[0, 0]\nax.set_facecolor(\'#111827\')\nfor i, (sp, color) in enumerate(zip(species, colors)):\n    ax.plot(range(n_years), N[:, i], color=color, linewidth=2, label=f\'{sp} (K={K[i]})\')\n    ax.axhline(K[i], color=color, linestyle=\':\', linewidth=0.5, alpha=0.5)\nax.set_xlabel(\'Years\', color=\'white\')\nax.set_ylabel(\'Trees per hectare\', color=\'white\')\nax.set_title(\'Forest Growth: Lotka-Volterra Competition\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax.legend(fontsize=8, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax.tick_params(colors=\'gray\')\n\n# Plot 2: Carbon sequestration\nax2 = axes[0, 1]\nax2.set_facecolor(\'#111827\')\nax2.stackplot(range(n_years), total_carbon.T, labels=species, colors=colors, alpha=0.7)\nax2.set_xlabel(\'Years\', color=\'white\')\nax2.set_ylabel(\'Carbon stored (tonnes/ha)\', color=\'white\')\nax2.set_title(\'Carbon Sequestration Over Time\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax2.legend(fontsize=8, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax2.tick_params(colors=\'gray\')\n\n# Plot 3: Species composition over time\nax3 = axes[1, 0]\nax3.set_facecolor(\'#111827\')\ntotal_N = N.sum(axis=1, keepdims=True)\nfractions = N / np.maximum(total_N, 1)\nax3.stackplot(range(n_years), fractions.T, labels=species, colors=colors, alpha=0.7)\nax3.set_xlabel(\'Years\', color=\'white\')\nax3.set_ylabel(\'Species fraction\', color=\'white\')\nax3.set_title(\'Community Composition\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax3.legend(fontsize=8, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax3.tick_params(colors=\'gray\')\n\n# Plot 4: Biodiversity and total biomass\nax4 = axes[1, 1]\nax4.set_facecolor(\'#111827\')\nax4.plot(range(n_years), shannon, color=\'#a855f7\', linewidth=2, label=\'Shannon diversity\')\nax4_twin = ax4.twinx()\ntotal_biomass = (N * biomass_per_tree).sum(axis=1) / 1000\nax4_twin.plot(range(n_years), total_biomass, color=\'#22c55e\', linewidth=2, label=\'Total biomass\')\nax4.set_xlabel(\'Years\', color=\'white\')\nax4.set_ylabel(\'Shannon index\', color=\'#a855f7\')\nax4_twin.set_ylabel(\'Biomass (tonnes/ha)\', color=\'#22c55e\')\nax4.set_title(\'Biodiversity & Biomass Trends\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax4.tick_params(axis=\'y\', colors=\'#a855f7\')\nax4_twin.tick_params(axis=\'y\', colors=\'#22c55e\')\nax4.tick_params(axis=\'x\', colors=\'gray\')\nlines1, labels1 = ax4.get_legend_handles_labels()\nlines2, labels2 = ax4_twin.get_legend_handles_labels()\nax4.legend(lines1+lines2, labels1+labels2, fontsize=9, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\n\nplt.tight_layout()\nplt.show()\n\nprint("=" * 65)\nprint("    FOREST GROWTH SIMULATOR — CAPSTONE REPORT")\nprint("=" * 65)\nprint(f"\\nSimulation: {n_species} species, {n_years} years")\nprint(f"\\nFinal populations (trees/ha):")\nfor i, sp in enumerate(species):\n    print(f"  {sp}: {N[-1, i]:.0f} (carrying capacity: {K[i]})")\nprint(f"\\nTotal carbon at year {n_years}: {total_carbon[-1].sum():.1f} tonnes/ha")\nprint(f"Shannon diversity: {shannon[-1]:.3f} (max possible: {np.log(n_species):.3f})")\nprint(f"\\nThe girl who grew a forest created an ecosystem —")\nprint(f"your simulator models how that ecosystem develops over decades.")',
      challenge: 'Add forest management scenarios: simulate selective logging (removing N% of the largest trees every M years), fire disturbance, and climate change (shifting growth rates). Compare biodiversity outcomes across management strategies.',
      successHint: "You have built an ecological simulator that models forest dynamics over decades — the same type of model that conservation biologists use to plan reforestation and forest management. The girl who grew a forest would need exactly this tool to plan the next century of her forest's development.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Forest Growth Simulator using ecological competition models</span>
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
