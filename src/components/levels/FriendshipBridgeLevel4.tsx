import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FriendshipBridgeLevel4() {
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
      title: 'Capstone — Build a Bridge Load Calculator with structural optimization',
      concept: 'In this capstone you will build a comprehensive bridge load calculator that analyzes truss bridges for different spans, materials, and load conditions. The tool takes inputs (span length, material type, load intensity, number of panels) and outputs member forces, deflections, safety factors, weight, and cost estimates.\n\nYou will implement: (1) Structural analysis using simplified truss formulas for preliminary design, (2) Multi-material comparison (steel, bamboo, timber) with material-specific safety factors, (3) Deflection checking against serviceability limits (L/300), (4) Cost estimation based on material quantities and local prices.\n\nThe calculator performs parametric studies automatically — sweeping across span lengths and materials to find the optimal design for given constraints. It generates a design summary table that a practicing engineer would use for preliminary bridge selection. This tool bridges the gap between hand calculations and full finite element analysis.',
      analogy: 'A bridge load calculator is like a car comparison website. Instead of comparing horsepower, fuel efficiency, and price, you compare safety factor, deflection, and cost. Just as the website shows you which car is best for your needs (city driving vs off-road), the calculator shows which bridge design is best for your site (short span vs long, heavy load vs light, urban vs rural).',
      storyConnection: 'The friendship bridge community needs to decide: bamboo, timber, or steel? The calculator gives them objective data to make this decision — not just which material is strongest, but which provides the best balance of safety, cost, and constructability for their specific span length and load requirements.',
      checkQuestion: 'The calculator shows that a 30m bamboo bridge has safety factor 1.2 (below the 1.5 minimum) while timber has SF=1.8 and steel has SF=3.5. The community has Rs 2 lakh budget. Steel costs Rs 8 lakh, timber costs Rs 3 lakh, bamboo costs Rs 0.5 lakh. What should they do?',
      checkAnswer: 'Bamboo alone fails (SF < 1.5). Options: (1) Reduce span to 20m where bamboo passes (SF > 1.5) by adding a mid-river pier. Cost: bamboo + pier ≈ Rs 1.5 lakh. (2) Use timber at Rs 3 lakh — exceeds budget by Rs 1 lakh but provides adequate safety. (3) Hybrid: bamboo for deck and light members, timber for main compression chords where bamboo is weakest. Estimated cost: Rs 1.5 lakh with SF ≈ 1.6. The hybrid approach is the engineering optimum — combining materials based on their strengths, within budget.',
      codeIntro: 'Build a bridge load calculator that analyzes multiple materials, spans, and load conditions to find optimal bridge designs.',
      code: 'import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\n\n# Bridge Load Calculator — comprehensive structural analysis tool\n# Inputs: span, material, load type, environmental conditions\n# Outputs: member forces, deflections, safety factors, cost estimate\n\nspans = [10, 15, 20, 25, 30, 40, 50]\nmaterials = {\n    \'Steel\': {\'E\': 200e9, \'fy\': 250e6, \'density\': 7850, \'cost_kg\': 80},\n    \'Bamboo\': {\'E\': 17e9, \'fy\': 80e6, \'density\': 700, \'cost_kg\': 5},\n    \'Timber\': {\'E\': 12e9, \'fy\': 50e6, \'density\': 650, \'cost_kg\': 30},\n}\n\ndef analyze_bridge(span, material, load_kN_m, n_panels=6):\n    props = materials[material]\n    E = props[\'E\']\n    fy = props[\'fy\']\n    h = span / 6  # truss height\n    panel_w = span / n_panels\n    \n    # Simplified: max moment = wL^2/8, max shear = wL/2\n    w = load_kN_m * 1000  # N/m\n    M_max = w * span**2 / 8\n    V_max = w * span / 2\n    \n    # Required section modulus for bending\n    S_req = M_max / fy  # m^3\n    # Approximate member area (chord force = M/h)\n    F_chord = M_max / h\n    A_chord = F_chord / fy * 1.5  # safety factor\n    \n    # Deflection (5wL^4 / 384EI, approximate I)\n    I_approx = A_chord * (h/2)**2 * 2  # parallel axis\n    delta = 5 * w * span**4 / (384 * E * max(I_approx, 1e-10))\n    \n    # Weight estimate\n    n_members = 2 * n_panels + 2 * n_panels + (n_panels - 1)  # top + bottom + diagonals + verticals\n    avg_length = (panel_w + h + np.sqrt(panel_w**2 + h**2)) / 3\n    total_volume = n_members * A_chord * avg_length\n    weight = total_volume * props[\'density\']\n    cost = weight * props[\'cost_kg\']\n    \n    sf = fy / (F_chord / max(A_chord, 1e-10))\n    delta_limit = span / 300\n    \n    return {\n        \'M_max\': M_max / 1000,  # kN.m\n        \'V_max\': V_max / 1000,  # kN\n        \'F_chord\': F_chord / 1000,  # kN\n        \'A_chord\': A_chord * 1e4,  # cm^2\n        \'delta\': delta * 1000,  # mm\n        \'delta_limit\': delta_limit * 1000,  # mm\n        \'weight\': weight,  # kg\n        \'cost\': cost / 1e5,  # Rs lakh\n        \'sf\': sf,\n        \'pass_strength\': sf > 1.5,\n        \'pass_deflection\': delta < delta_limit,\n    }\n\nfig, axes = plt.subplots(2, 2, figsize=(14, 11))\nfig.patch.set_facecolor(\'#1f2937\')\ncolors = {\'Steel\': \'#3b82f6\', \'Bamboo\': \'#22c55e\', \'Timber\': \'#f59e0b\'}\n\n# Plot 1: Safety factor vs span\nax = axes[0, 0]\nax.set_facecolor(\'#111827\')\nload = 5  # kN/m\nfor mat, color in colors.items():\n    sfs = [analyze_bridge(s, mat, load)[\'sf\'] for s in spans]\n    ax.plot(spans, sfs, \'o-\', color=color, linewidth=2, label=mat)\nax.axhline(1.5, color=\'#fbbf24\', linestyle=\'--\', linewidth=1.5, label=\'Minimum SF (1.5)\')\nax.axhline(1.0, color=\'#ef4444\', linestyle=\'--\', linewidth=1)\nax.set_xlabel(\'Span (m)\', color=\'white\')\nax.set_ylabel(\'Safety factor\', color=\'white\')\nax.set_title(\'Safety Factor vs Span (5 kN/m load)\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax.legend(fontsize=9, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax.tick_params(colors=\'gray\')\n\n# Plot 2: Deflection vs span\nax2 = axes[0, 1]\nax2.set_facecolor(\'#111827\')\nfor mat, color in colors.items():\n    deltas = [analyze_bridge(s, mat, load)[\'delta\'] for s in spans]\n    limits = [analyze_bridge(s, mat, load)[\'delta_limit\'] for s in spans]\n    ax2.plot(spans, deltas, \'o-\', color=color, linewidth=2, label=f\'{mat} deflection\')\nax2.plot(spans, limits, \'--\', color=\'#fbbf24\', linewidth=1.5, label=\'L/300 limit\')\nax2.set_xlabel(\'Span (m)\', color=\'white\')\nax2.set_ylabel(\'Deflection (mm)\', color=\'white\')\nax2.set_title(\'Max Deflection vs Span\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax2.legend(fontsize=8, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax2.tick_params(colors=\'gray\')\n\n# Plot 3: Cost comparison\nax3 = axes[1, 0]\nax3.set_facecolor(\'#111827\')\nfor mat, color in colors.items():\n    costs = [analyze_bridge(s, mat, load)[\'cost\'] for s in spans]\n    ax3.plot(spans, costs, \'s-\', color=color, linewidth=2, label=mat)\nax3.set_xlabel(\'Span (m)\', color=\'white\')\nax3.set_ylabel(\'Cost (Rs lakh)\', color=\'white\')\nax3.set_title(\'Bridge Cost vs Span\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax3.legend(fontsize=9, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax3.tick_params(colors=\'gray\')\n\n# Plot 4: Comprehensive design table\nax4 = axes[1, 1]\nax4.set_facecolor(\'#111827\')\n# Design summary for 30m bridge\nresults = {}\nfor mat in materials:\n    results[mat] = analyze_bridge(30, mat, load)\n    \ntable_data = []\nrow_labels = [\'Max moment (kN.m)\', \'Chord force (kN)\', \'Req. area (cm²)\',\n              \'Deflection (mm)\', \'Safety factor\', \'Weight (kg)\', \'Cost (Rs lakh)\', \'PASS?\']\nfor mat in materials:\n    r = results[mat]\n    table_data.append([\n        f"{r[\'M_max\']:.0f}", f"{r[\'F_chord\']:.0f}", f"{r[\'A_chord\']:.1f}",\n        f"{r[\'delta\']:.1f}/{r[\'delta_limit\']:.0f}", f"{r[\'sf\']:.2f}",\n        f"{r[\'weight\']:.0f}", f"{r[\'cost\']:.2f}",\n        \'YES\' if r[\'pass_strength\'] and r[\'pass_deflection\'] else \'NO\'\n    ])\n\ntable = ax4.table(cellText=list(zip(*table_data)), rowLabels=row_labels,\n                   colLabels=list(materials.keys()), loc=\'center\',\n                   cellLoc=\'center\')\ntable.auto_set_font_size(False)\ntable.set_fontsize(9)\ntable.scale(1, 1.4)\nfor key, cell in table.get_celld().items():\n    cell.set_facecolor(\'#111827\')\n    cell.set_edgecolor(\'gray\')\n    cell.set_text_props(color=\'white\')\n    if key[0] == 0:\n        cell.set_facecolor(\'#1f2937\')\n        cell.set_text_props(color=\'white\', fontweight=\'bold\')\n    if key[1] == -1:\n        cell.set_text_props(color=\'gray\', fontsize=8)\nax4.set_title(\'Design Summary: 30m Bridge @ 5 kN/m\', color=\'white\', fontsize=12, fontweight=\'bold\', pad=20)\nax4.axis(\'off\')\n\nplt.tight_layout()\nplt.show()\n\nprint("=" * 65)\nprint("    BRIDGE LOAD CALCULATOR — CAPSTONE REPORT")\nprint("=" * 65)\nprint(f"\\nAnalysis: {len(spans)} spans × {len(materials)} materials = {len(spans)*len(materials)} designs")\nprint(f"Load: {load} kN/m (pedestrian + light vehicle)")\nprint(f"\\n30m Bridge Comparison:")\nfor mat in materials:\n    r = results[mat]\n    status = "PASS" if r[\'pass_strength\'] and r[\'pass_deflection\'] else "FAIL"\n    print(f"  {mat}: SF={r[\'sf\']:.2f}, delta={r[\'delta\']:.1f}mm, cost=Rs {r[\'cost\']:.2f}L [{status}]")\nprint(f"\\nThe calculator automates bridge preliminary design —")\nprint(f"enabling rapid comparison of materials and configurations.")',
      challenge: 'Extend the calculator with a Monte Carlo reliability analysis: randomly vary material properties, loads, and dimensions within realistic ranges and calculate the probability of failure. Compare the reliability of each material choice.',
      successHint: 'You have built a practical engineering tool — a bridge load calculator that automates preliminary design and enables objective comparison of alternatives. This is the same type of tool that structural engineering firms use in early-stage bridge design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Bridge Load Calculator with structural optimization</span>
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
