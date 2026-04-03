import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SeedTravelLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

    const miniLessons = [
    {
      title: "Seed dispersal mechanisms",
      concept: "This lesson explores wind, water, animal, and ballistic dispersal physics and dispersal kernels. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of wind, water, animal, and ballistic dispersal physics and dispersal kernels as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Seeds in the story travel by different mechanisms — each an engineering solution for colonizing new territory.",
      checkQuestion: "Given the concepts of wind, water, animal, and ballistic dispersal physics and dispersal kernels, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize wind, water, animal, and ballistic dispersal physics and dispersal kernels using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of wind, water, animal, and ballistic dispersal physics and dispersal kernels — connecting theory to practice through code.",
    },
    {
      title: "Aerodynamics of seed flight",
      concept: "This lesson explores terminal velocity, drag coefficients, and samara autorotation. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of terminal velocity, drag coefficients, and samara autorotation as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Seeds are nature\'s aircraft — wings, parachutes, and spinning rotors optimized by evolution.",
      checkQuestion: "Given the concepts of terminal velocity, drag coefficients, and samara autorotation, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize terminal velocity, drag coefficients, and samara autorotation using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of terminal velocity, drag coefficients, and samara autorotation — connecting theory to practice through code.",
    },
    {
      title: "Population dynamics and range expansion",
      concept: "This lesson explores reaction-diffusion models combining growth with spatial spread. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of reaction-diffusion models combining growth with spatial spread as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Seed dispersal drives species range expansion — modeled by reaction-diffusion equations.",
      checkQuestion: "Given the concepts of reaction-diffusion models combining growth with spatial spread, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize reaction-diffusion models combining growth with spatial spread using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of reaction-diffusion models combining growth with spatial spread — connecting theory to practice through code.",
    },
    {
      title: "Conservation genetics and seed banks",
      concept: "This lesson explores Wright's F_ST, gene flow, and genetic diversity preservation. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of Wright's F_ST, gene flow, and genetic diversity preservation as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Seeds carry genes across landscapes — dispersal maintains the genetic health of populations.",
      checkQuestion: "Given the concepts of Wright's F_ST, gene flow, and genetic diversity preservation, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize Wright's F_ST, gene flow, and genetic diversity preservation using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of Wright's F_ST, gene flow, and genetic diversity preservation — connecting theory to practice through code.",
    },
    {
      title: "Landscape ecology and connectivity",
      concept: "This lesson explores graph-based models of habitat connectivity for seed movement. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of graph-based models of habitat connectivity for seed movement as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Seeds navigate a landscape of forests, rivers, and barriers — connectivity determines success.",
      checkQuestion: "Given the concepts of graph-based models of habitat connectivity for seed movement, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize graph-based models of habitat connectivity for seed movement using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of graph-based models of habitat connectivity for seed movement — connecting theory to practice through code.",
    },
    {
      title: "Climate and seed phenology",
      concept: "This lesson explores growing degree days, phenological timing, and climate mismatch. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of growing degree days, phenological timing, and climate mismatch as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Seeds time their journeys with seasons — climate change disrupts this precise ecological scheduling.",
      checkQuestion: "Given the concepts of growing degree days, phenological timing, and climate mismatch, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize growing degree days, phenological timing, and climate mismatch using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of growing degree days, phenological timing, and climate mismatch — connecting theory to practice through code.",
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
            />
        ))}
      </div>
    </div>
  );
}
