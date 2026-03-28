import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function SnowLeopardLevel4() {
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
      title: 'Capstone — Build an Altitude Physiology Calculator modeling oxygen transport',
      concept: 'In this capstone you will build a calculator that models how altitude affects physiology — from atmospheric pressure through oxygen transport to exercise capacity. The model computes: (1) Atmospheric pressure and O2 partial pressure using the barometric formula, (2) Blood oxygen saturation (SpO2) using the Hill equation for hemoglobin binding, (3) VO2max reduction and heart rate compensation at altitude, (4) Comparison of altitude adaptations across species including snow leopards, yaks, and bar-headed geese.\n\nThe calculator reveals why snow leopards thrive at 3000-5500m where humans require weeks of acclimatization. Snow leopard hemoglobin has higher oxygen affinity, their lungs have greater capacity relative to body size, and their hearts pump more efficiently at low oxygen — adaptations refined over millions of years of evolution at altitude.',
      analogy: "An altitude physiology calculator is like a fuel efficiency calculator for a car engine at different altitudes. At sea level, the engine (your body) gets a full tank of oxygen with every breath. At 5000m, each breath delivers only 50% as much oxygen — like running on half a tank. The calculator shows how different 'engines' (species) handle this fuel shortage: humans sputter and stall, while snow leopards purr along on their specially tuned high-altitude engines.",
      storyConnection: "The snow leopard in the story roams mountain passes that would leave a human gasping for air. Your calculator quantifies this difference: at 4500m, a human's blood oxygen drops to 82% and exercise capacity falls by 30%, while the snow leopard's adaptations maintain near-normal function. Understanding altitude physiology explains why these cats are perfectly matched to their extreme habitat.",
      checkQuestion: "At 4500m, a human's SpO2 drops from 98% to 82%. A snow leopard maintains ~93% due to higher hemoglobin oxygen affinity. If VO2max scales with SpO2, what is the exercise capacity reduction for each species at 4500m compared to sea level?",
      checkAnswer: "Human: VO2max reduction = 82/98 = 0.837, so 16.3% reduction. Snow leopard: 93/98 = 0.949, only 5.1% reduction. The snow leopard retains 95% of its exercise capacity at 4500m while the human loses 16% — enough to make the difference between effective predation and exhaustion. Additionally, the human reduction is actually worse because compensatory heart rate increase (from 65 to ~80 bpm) adds cardiac workload, further reducing sustainable effort. The snow leopard's adapted cardiovascular system avoids this penalty.",
      codeIntro: 'Build an altitude physiology calculator that models oxygen transport, exercise capacity, and species-specific adaptations.',
      code: 'import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Altitude Physiology Calculator\ndef atmospheric_pressure(altitude_m):\n    return 101325 * (1 - 2.25577e-5 * altitude_m)**5.25588\n\ndef O2_partial_pressure(altitude_m):\n    return 0.2095 * atmospheric_pressure(altitude_m)\n\ndef SpO2_model(altitude_m, acclimatized=False):\n    pO2 = O2_partial_pressure(altitude_m) / 133.322  # mmHg\n    if acclimatized:\n        p50 = 26  # mmHg (shifted hemoglobin curve)\n        n = 2.8\n    else:\n        p50 = 26.6\n        n = 2.7\n    sat = pO2**n / (p50**n + pO2**n)\n    return sat * 100\n\ndef VO2max_altitude(altitude_m, sea_level_VO2max=45):\n    factor = SpO2_model(altitude_m) / SpO2_model(0)\n    return sea_level_VO2max * factor\n\ndef heart_rate_altitude(altitude_m, resting_hr=65):\n    factor = SpO2_model(0) / max(SpO2_model(altitude_m), 50)\n    return resting_hr * factor\n\naltitudes = np.linspace(0, 8000, 500)\n\nfig, axes = plt.subplots(2, 2, figsize=(14, 11))\nfig.patch.set_facecolor(\'#1f2937\')\n\nax = axes[0, 0]\nax.set_facecolor(\'#111827\')\npressures = [atmospheric_pressure(a) / 1000 for a in altitudes]\npO2s = [O2_partial_pressure(a) / 1000 for a in altitudes]\nax.plot(altitudes / 1000, pressures, color=\'#3b82f6\', linewidth=2, label=\'Total pressure\')\nax.plot(altitudes / 1000, pO2s, color=\'#ef4444\', linewidth=2, label=\'O2 partial pressure\')\nax.axhline(101.325, color=\'gray\', linestyle=\':\', linewidth=0.5)\nfor alt, name in [(3500, \'Tawang\'), (4500, \'Snow leopard\\nhabitat\'), (5500, \'Extreme\'), (8848, \'Everest\')]:\n    if alt <= 8000:\n        ax.axvline(alt/1000, color=\'gray\', linestyle=\':\', linewidth=0.5, alpha=0.5)\n        ax.text(alt/1000 + 0.1, max(pressures)*0.85, name, color=\'gray\', fontsize=7, rotation=90)\nax.set_xlabel(\'Altitude (km)\', color=\'white\')\nax.set_ylabel(\'Pressure (kPa)\', color=\'white\')\nax.set_title(\'Atmospheric Pressure vs Altitude\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax.legend(fontsize=9, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax.tick_params(colors=\'gray\')\n\nax2 = axes[0, 1]\nax2.set_facecolor(\'#111827\')\nspo2_normal = [SpO2_model(a, False) for a in altitudes]\nspo2_acclim = [SpO2_model(a, True) for a in altitudes]\nax2.plot(altitudes / 1000, spo2_normal, color=\'#ef4444\', linewidth=2, label=\'Unacclimatized\')\nax2.plot(altitudes / 1000, spo2_acclim, color=\'#22c55e\', linewidth=2, label=\'Acclimatized\')\nax2.axhline(90, color=\'#fbbf24\', linestyle=\'--\', linewidth=1, label=\'Clinical concern (90%)\')\nax2.axhline(80, color=\'#ef4444\', linestyle=\'--\', linewidth=1, label=\'Danger zone (80%)\')\nax2.fill_between(altitudes / 1000, 80, spo2_normal, where=np.array(spo2_normal) < 80, alpha=0.2, color=\'#ef4444\')\nax2.set_xlabel(\'Altitude (km)\', color=\'white\')\nax2.set_ylabel(\'Blood oxygen saturation (%)\', color=\'white\')\nax2.set_title(\'SpO2 vs Altitude\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax2.legend(fontsize=8, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\')\nax2.tick_params(colors=\'gray\')\nax2.set_ylim(60, 102)\n\nax3 = axes[1, 0]\nax3.set_facecolor(\'#111827\')\nvo2_vals = [VO2max_altitude(a) for a in altitudes]\nhr_vals = [heart_rate_altitude(a) for a in altitudes]\nax3.plot(altitudes / 1000, vo2_vals, color=\'#3b82f6\', linewidth=2, label=\'VO2max (mL/kg/min)\')\nax3_twin = ax3.twinx()\nax3_twin.plot(altitudes / 1000, hr_vals, color=\'#ef4444\', linewidth=2, label=\'Resting HR (bpm)\')\nax3.set_xlabel(\'Altitude (km)\', color=\'white\')\nax3.set_ylabel(\'VO2max\', color=\'#3b82f6\')\nax3_twin.set_ylabel(\'Heart rate (bpm)\', color=\'#ef4444\')\nax3.set_title(\'Exercise Capacity & Heart Rate vs Altitude\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax3.tick_params(axis=\'y\', colors=\'#3b82f6\')\nax3_twin.tick_params(axis=\'y\', colors=\'#ef4444\')\nax3.tick_params(axis=\'x\', colors=\'gray\')\n\n# Plot 4: Snow leopard adaptations comparison\nax4 = axes[1, 1]\nax4.set_facecolor(\'#111827\')\nspecies = [\'Human\\n(sea level)\', \'Human\\n(acclimatized)\', \'Snow\\nleopard\', \'Yak\', \'Bar-headed\\ngoose\']\nadaptation_scores = {\n    \'Hemoglobin\': [1, 2, 4, 5, 4],\n    \'Lung capacity\': [1, 1.5, 3, 3, 5],\n    \'Heart efficiency\': [1, 2, 4, 4, 3],\n    \'Capillary density\': [1, 2, 4, 5, 3],\n    \'Metabolic rate\': [1, 1.5, 3, 4, 5],\n}\nx = np.arange(len(species))\nwidth = 0.15\nadapt_colors = [\'#ef4444\', \'#3b82f6\', \'#22c55e\', \'#f59e0b\', \'#a855f7\']\nfor i, (trait, scores) in enumerate(adaptation_scores.items()):\n    ax4.bar(x + i * width - 2 * width, scores, width, color=adapt_colors[i], alpha=0.8, label=trait)\nax4.set_xticks(x)\nax4.set_xticklabels(species, fontsize=7)\nax4.set_ylabel(\'Adaptation score (1-5)\', color=\'white\')\nax4.set_title(\'Altitude Adaptations by Species\', color=\'white\', fontsize=12, fontweight=\'bold\')\nax4.legend(fontsize=7, facecolor=\'#1f2937\', edgecolor=\'gray\', labelcolor=\'white\', ncol=2)\nax4.tick_params(colors=\'gray\')\n\nplt.tight_layout()\nplt.show()\n\nprint("=" * 65)\nprint("    ALTITUDE PHYSIOLOGY CALCULATOR — CAPSTONE REPORT")\nprint("=" * 65)\nfor alt_m in [0, 2000, 3500, 4500, 6000]:\n    p = atmospheric_pressure(alt_m)\n    spo2 = SpO2_model(alt_m)\n    vo2 = VO2max_altitude(alt_m)\n    hr = heart_rate_altitude(alt_m)\n    print(f"\\n{alt_m}m: P={p/1000:.1f}kPa, SpO2={spo2:.0f}%, VO2max={vo2:.0f}, HR={hr:.0f}bpm")\nprint(f"\\nSnow leopards thrive at 3000-5500m where humans struggle")\nprint(f"because of evolved adaptations in hemoglobin, lung capacity,")\nprint(f"and cardiovascular efficiency — nature\'s altitude engineering.")',
      challenge: "Add acclimatization dynamics: model how a human's physiology changes over 2 weeks at altitude (increasing red blood cell production, hemoglobin levels, and ventilatory response). Show the time course of adaptation and how it narrows the gap with snow leopard performance.",
      successHint: 'You have built a physiological model that explains how altitude affects oxygen transport across species — connecting atmospheric physics, biochemistry, and evolutionary biology. The altitude physiology calculator reveals why snow leopards are supremely adapted to their high-altitude domain.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build an Altitude Physiology Calculator comparing species adaptations</span>
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
