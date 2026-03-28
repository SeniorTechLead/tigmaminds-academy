import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TakinFaceLevel3() {
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
      title: "Hardy-Weinberg equilibrium",
      concept: "This lesson explores the null model of population genetics — allele and genotype frequency expectations. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of the null model of population genetics — allele and genotype frequency expectations as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "The takin population's genetic equilibrium tells us whether evolutionary forces are at work.",
      checkQuestion: "Given the concepts of the null model of population genetics — allele and genotype frequency expectations, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize the null model of population genetics — allele and genotype frequency expectations using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of the null model of population genetics — allele and genotype frequency expectations — connecting theory to practice through code.",
    },
    {
      title: "Genetic drift in small populations",
      concept: "This lesson explores random allele frequency changes and heterozygosity loss. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of random allele frequency changes and heterozygosity loss as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Small takin populations are vulnerable to genetic drift — random changes eroding diversity.",
      checkQuestion: "Given the concepts of random allele frequency changes and heterozygosity loss, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize random allele frequency changes and heterozygosity loss using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of random allele frequency changes and heterozygosity loss — connecting theory to practice through code.",
    },
    {
      title: "Natural selection and fitness landscapes",
      concept: "This lesson explores selection coefficients, adaptation, and the interplay of selection with drift. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of selection coefficients, adaptation, and the interplay of selection with drift as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "The takin's distinctive features are shaped by selection in mountain environments.",
      checkQuestion: "Given the concepts of selection coefficients, adaptation, and the interplay of selection with drift, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize selection coefficients, adaptation, and the interplay of selection with drift using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of selection coefficients, adaptation, and the interplay of selection with drift — connecting theory to practice through code.",
    },
    {
      title: "Inbreeding and conservation genetics",
      concept: "This lesson explores inbreeding coefficient F, depression effects, and minimum viable population. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of inbreeding coefficient F, depression effects, and minimum viable population as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Fragmented takin populations face inbreeding risk — your model predicts when diversity drops below safe levels.",
      checkQuestion: "Given the concepts of inbreeding coefficient F, depression effects, and minimum viable population, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize inbreeding coefficient F, depression effects, and minimum viable population using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of inbreeding coefficient F, depression effects, and minimum viable population — connecting theory to practice through code.",
    },
    {
      title: "Population viability analysis",
      concept: "This lesson explores Monte Carlo simulation of demographic and environmental stochasticity. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of Monte Carlo simulation of demographic and environmental stochasticity as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "PVA predicts whether the takin population is heading toward stability or extinction.",
      checkQuestion: "Given the concepts of Monte Carlo simulation of demographic and environmental stochasticity, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize Monte Carlo simulation of demographic and environmental stochasticity using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of Monte Carlo simulation of demographic and environmental stochasticity — connecting theory to practice through code.",
    },
    {
      title: "Landscape genetics",
      concept: "This lesson explores resistance surfaces, isolation by resistance, and circuit theory for gene flow. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of resistance surfaces, isolation by resistance, and circuit theory for gene flow as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Mountain geography shapes takin gene flow — ridges as corridors, valleys as barriers.",
      checkQuestion: "Given the concepts of resistance surfaces, isolation by resistance, and circuit theory for gene flow, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize resistance surfaces, isolation by resistance, and circuit theory for gene flow using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of resistance surfaces, isolation by resistance, and circuit theory for gene flow — connecting theory to practice through code.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Building Science & Passive Cooling
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (heat and materials fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for building physics and thermal simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
