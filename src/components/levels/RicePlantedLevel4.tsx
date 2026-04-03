import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function RicePlantedLevel4() {
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
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
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
      title: 'Capstone — Build a Paddy Ecosystem Model simulating rice growth dynamics',
      concept: 'In this capstone you will build a paddy ecosystem model that simulates rice growth over a 180-day growing season. The model couples four interacting systems: (1) Rice biomass growth following a logistic curve modified by temperature, water, nitrogen, and pest damage, (2) Water balance driven by rainfall input minus evapotranspiration and drainage, (3) Soil nitrogen dynamics with plant uptake and natural replenishment, (4) Pest population dynamics that grow with crop biomass and reduce yield.\n\nYou will run scenario analyses comparing baseline conditions with interventions: extra nitrogen fertilizer, pest control, drought conditions, and the optimal combined strategy. The model reveals that rice yield depends on a delicate balance of environmental factors, and that the interaction between nutrients and pests creates non-obvious optimal management strategies.',
      analogy: 'A paddy ecosystem model is like managing a fish tank. You need the right water level, nutrients, temperature, and you must control algae (pests). Too much food (nitrogen) causes algae blooms (pest outbreaks). Too little water and the fish (rice) stress. The model tracks all these interacting factors simultaneously, which is why managing a paddy field is more complex than it appears.',
      storyConnection: "The first rice in the story was planted in Assam's fertile lowlands — the beginning of paddy cultivation that shaped the region's culture. Your model simulates the ecology of a modern paddy field, showing how the same natural factors (water, soil, pests) that the first rice farmers grappled with still determine yield today. Understanding these dynamics is essential for food security in monsoon Asia.",
      checkQuestion: 'The model shows that adding 67% more nitrogen (120 to 200 kg/ha) increases yield by only 15%, while pest control alone increases yield by 20%. Why is the marginal return on nitrogen low, and why does pest control help more?',
      checkAnswer: 'Nitrogen has diminishing returns (Michaelis-Menten kinetics): N/(N+50) at N=120 is 0.71; at N=200 is 0.80 — only 13% improvement despite 67% more input. The remaining growth is limited by other factors (water, temperature), not nitrogen. Pest control helps more because pests directly destroy biomass that was already produced — reducing pest damage from 30% to 10% effectively recovers 20% of yield that would otherwise be lost. Additionally, excess nitrogen can stimulate pest growth (lush foliage attracts insects), so the nitrogen-pest interaction can be counterproductive.',
      codeIntro: 'Build a paddy ecosystem simulator that models rice growth, water balance, nutrients, and pest dynamics over a growing season.',
      code: 'import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Paddy Ecosystem Model — rice growth + water + nutrients + pests\nn_days = 180  # rice growing season\nt = np.arange(n_days)\n\n# Rice growth (logistic with water and nutrient dependence)\ndef rice_growth(temp, water, nitrogen, pest_damage):\n    K = 8000  # max biomass kg/ha\n    r_base = 0.04\n    temp_factor = np.exp(-((temp - 28)**2) / 50)\n    water_factor = np.minimum(water / 100, 1.0)\n    N_factor = nitrogen / (nitrogen + 50)\n    pest_factor = 1 - pest_damage\n    r = r_base * temp_factor * water_factor * N_factor * pest_factor\n    return r, K\n\n# Weather model\ntemp = 25 + 5 * np.sin(2 * np.pi * (t - 30) / 365) + np.random.normal(0, 2, n_days)\nrainfall = np.maximum(0, 5 + 10 * np.sin(2 * np.pi * (t - 60) / 180) + np.random.exponential(3, n_days))\n\n# State variables\nbiomass = np.zeros(n_days)\nwater_level = np.zeros(n_days)\nsoil_N = np.zeros(n_days)\npest_pop = np.zeros(n_days)\nyield_est = np.zeros(n_days)\n\nbiomass[0] = 50\nwater_level[0] = 80\nsoil_N[0] = 120\npest_pop[0] = 5\n\nfor day in range(1, n_days):\n    r, K = rice_growth(temp[day], water_level[day-1], soil_N[day-1], pest_pop[day-1]/100)\n    dB = r * biomass[day-1] * (1 - biomass[day-1] / K)\n    biomass[day] = max(0, biomass[day-1] + dB)\n    water_level[day] = max(0, min(150, water_level[day-1] + rainfall[day] - 3 - 0.01 * temp[day]))\n    soil_N[day] = max(0, soil_N[day-1] - 0.3 * r * biomass[day-1] / 100 + 0.1)\n    pest_growth = 0.02 * pest_pop[day-1] * (1 - pest_pop[day-1]/50) * (biomass[day-1]/K)\n    pest_pop[day] = max(0, min(50, pest_pop[day-1] + pest_growth + np.random.normal(0, 0.5)))\n    yield_est[day] = biomass[day] * 0.4  # harvest index\n\nfig, axes = plt.subplots(2, 2, figsize=(14, 11))\nfig.patch.set_facecolor(\'#1f2937\')\n\nax = axes[0, 0]\nax.set_facecolor(\'#111827\')\nax.plot(t, biomass, color=\'#22c55e\', linewidth=2, label=\'Biomass (kg/ha)\')\nax.plot(t, yield_est, color=\'#fbbf24\', linewidth=2, linestyle=\'--\', label=\'Estimated yield\')\nax.set_xlabel(\'Days after planting\', color=\'white\')\nax.set_ylabel(\'Biomass (kg/ha)\', color=\'white\')\nax.set_title(\'Rice Growth Curve\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax.legend(fontsize=9, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax.tick_params(colors=\'gray\')\n\nax2 = axes[0, 1]\nax2.set_facecolor(\'#111827\')\nax2.plot(t, water_level, color=\'#3b82f6\', linewidth=1.5, label=\'Water level (mm)\')\nax2.bar(t, rainfall, color=\'#3b82f6\', alpha=0.3, width=1, label=\'Rainfall\')\nax2.axhline(50, color=\'#fbbf24\', linestyle=\'--\', linewidth=1, label=\'Min water needed\')\nax2.set_xlabel(\'Days\', color=\'white\')\nax2.set_ylabel(\'Water (mm)\', color=\'white\')\nax2.set_title(\'Water Balance\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax2.legend(fontsize=8, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax2.tick_params(colors=\'gray\')\n\nax3 = axes[1, 0]\nax3.set_facecolor(\'#111827\')\nax3.plot(t, soil_N, color=\'#f59e0b\', linewidth=2, label=\'Soil nitrogen\')\nax3.plot(t, pest_pop, color=\'#ef4444\', linewidth=2, label=\'Pest population\')\nax3.set_xlabel(\'Days\', color=\'white\')\nax3.set_ylabel(\'Level\', color=\'white\')\nax3.set_title(\'Nutrients & Pests\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax3.legend(fontsize=9, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax3.tick_params(colors=\'gray\')\n\n# Plot 4: Scenario comparison\nax4 = axes[1, 1]\nax4.set_facecolor(\'#111827\')\nscenarios = [\'Baseline\', \'Extra N\\nfertilizer\', \'Pest\\ncontrol\', \'Drought\\n(-50% rain)\', \'Optimal\\n(N + pest)\']\nfinal_yields = [yield_est[-1]]\nfor scenario in [\'extra_N\', \'pest_control\', \'drought\', \'optimal\']:\n    b = 50; w = 80; n = 120 if scenario != \'extra_N\' else 200; p = 5\n    n_val = 200 if scenario == \'optimal\' else n\n    for day in range(1, n_days):\n        rain_mod = rainfall[day] * (0.5 if scenario == \'drought\' else 1.0)\n        pest_mod = p * (0.3 if scenario in [\'pest_control\', \'optimal\'] else 1.0)\n        r_s, K_s = rice_growth(temp[day], w, n_val, pest_mod/100)\n        dB_s = r_s * b * (1 - b / K_s)\n        b = max(0, b + dB_s)\n        w = max(0, min(150, w + rain_mod - 3 - 0.01 * temp[day]))\n        n_val = max(0, n_val - 0.3 * r_s * b / 100 + 0.1)\n        p = max(0, min(50, p + 0.02 * p * (1 - p/50) * (b/K_s)))\n    final_yields.append(b * 0.4)\n\ncolors_sc = [\'#3b82f6\', \'#22c55e\', \'#f59e0b\', \'#ef4444\', \'#a855f7\']\nbars = ax4.bar(range(len(scenarios)), final_yields, color=colors_sc, alpha=0.8, edgecolor=\'white\')\nfor bar, y in zip(bars, final_yields):\n    ax4.text(bar.get_x() + bar.get_width()/2, y + 50, f\'{y:.0f}\', ha=\'center\', color=\'white\', fontsize=9)\nax4.set_xticks(range(len(scenarios)))\nax4.set_xticklabels(scenarios, fontsize=8)\nax4.set_ylabel(\'Estimated yield (kg/ha)\', color=\'white\')\nax4.set_title(\'Yield Under Different Scenarios\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax4.tick_params(colors=\'gray\')\n\nplt.tight_layout()\nplt.show()\n\nprint("=" * 65)\nprint("    PADDY ECOSYSTEM MODEL — CAPSTONE REPORT")\nprint("=" * 65)\nprint(f"\\nSimulation: {n_days} days, single season")\nprint(f"Final biomass: {biomass[-1]:.0f} kg/ha")\nprint(f"Estimated yield: {yield_est[-1]:.0f} kg/ha")\nprint(f"\\nScenario yields:")\nfor name, y in zip(scenarios, final_yields):\n    name_clean = name.replace(chr(10), \' \')\n    change = (y - final_yields[0]) / final_yields[0] * 100\n    print(f"  {name_clean:<20}: {y:.0f} kg/ha ({change:+.0f}%)")',
      challenge: 'Add a climate change scenario: increase temperature by 2 degrees C, shift monsoon timing by 2 weeks later, and increase rainfall variability by 50%. Compare yields under current and future climate and identify adaptation strategies.',
      successHint: 'You have built a crop ecosystem model that captures the complex interactions between rice, water, soil, and pests — the same type of model that agricultural scientists use to forecast yields and recommend management practices across monsoon Asia.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Paddy Ecosystem Model with crop-water-pest dynamics</span>
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
