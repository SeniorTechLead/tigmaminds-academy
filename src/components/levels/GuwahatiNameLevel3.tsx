import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GuwahatiNameLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

    const miniLessons = [
    {
      title: "Etymology and historical linguistics",
      concept: "This lesson explores word origins and sound changes across language families. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of word origins and sound changes across language families as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "The name Guwahati preserves linguistic history — guwa (areca nut) + hati (market).",
      checkQuestion: "Given the concepts of word origins and sound changes across language families, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize word origins and sound changes across language families using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of word origins and sound changes across language families — connecting theory to practice through code.",
    },
    {
      title: "Phonetics and vowel acoustics",
      concept: "This lesson explores formant frequencies and the acoustic properties of speech sounds. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of formant frequencies and the acoustic properties of speech sounds as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "The sounds of Guwahati reveal the phonological structure of Assamese.",
      checkQuestion: "Given the concepts of formant frequencies and the acoustic properties of speech sounds, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize formant frequencies and the acoustic properties of speech sounds using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of formant frequencies and the acoustic properties of speech sounds — connecting theory to practice through code.",
    },
    {
      title: "Computational phonology and edit distance",
      concept: "This lesson explores measuring linguistic similarity using string algorithms. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of measuring linguistic similarity using string algorithms as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Historical variants of Guwahati (Gauhati, Gohatti) show systematic sound changes.",
      checkQuestion: "Given the concepts of measuring linguistic similarity using string algorithms, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize measuring linguistic similarity using string algorithms using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of measuring linguistic similarity using string algorithms — connecting theory to practice through code.",
    },
    {
      title: "Morphological analysis",
      concept: "This lesson explores decomposing words into meaningful units (morphemes). You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of decomposing words into meaningful units (morphemes) as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Place names like Guwahati decompose into morphemes that reveal their semantic origins.",
      checkQuestion: "Given the concepts of decomposing words into meaningful units (morphemes), describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize decomposing words into meaningful units (morphemes) using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of decomposing words into meaningful units (morphemes) — connecting theory to practice through code.",
    },
    {
      title: "NLP foundations — tokenization and TF-IDF",
      concept: "This lesson explores text processing, n-grams, and term weighting for information retrieval. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of text processing, n-grams, and term weighting for information retrieval as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Processing texts about Guwahati with NLP reveals the linguistic fingerprint of the region.",
      checkQuestion: "Given the concepts of text processing, n-grams, and term weighting for information retrieval, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize text processing, n-grams, and term weighting for information retrieval using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of text processing, n-grams, and term weighting for information retrieval — connecting theory to practice through code.",
    },
    {
      title: "Sentiment analysis and text mining",
      concept: "This lesson explores extracting emotional tone and structured information from text. You will learn the mathematical foundations, build computational models, and visualize the key relationships.",
      analogy: "Think of extracting emotional tone and structured information from text as a system with inputs, processes, and outputs — your code models each step.",
      storyConnection: "Analyzing sentiment in texts about Guwahati reveals the city reputation across different contexts.",
      checkQuestion: "Given the concepts of extracting emotional tone and structured information from text, describe how you would apply them to analyze real-world data.",
      checkAnswer: "Apply the mathematical framework to the data, compute relevant metrics, visualize the results, and interpret them in context.",
      codeIntro: "Model and visualize extracting emotional tone and structured information from text using Python.",
      code: "import numpy as np\nimport matplotlib.pyplot as plt\nnp.random.seed(42)\n\n# Data analysis\nn = 200\nx = np.random.normal(0, 1, n)\ny = 2 * x + np.random.normal(0, 0.5, n)\ncategories = np.random.choice(['A', 'B', 'C', 'D'], n)\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.patch.set_facecolor('#1f2937')\n\nax = axes[0, 0]; ax.set_facecolor('#111827')\nax.scatter(x, y, c='#3b82f6', s=20, alpha=0.6)\nz = np.polyfit(x, y, 1)\nax.plot(np.sort(x), np.polyval(z, np.sort(x)), color='#fbbf24', linewidth=2)\nax.set_xlabel('Feature 1', color='white'); ax.set_ylabel('Feature 2', color='white')\nax.set_title('Correlation Analysis', color='white', fontsize=12, fontweight='bold')\nax.tick_params(colors='gray')\n\nax2 = axes[0, 1]; ax2.set_facecolor('#111827')\nfor cat, color in zip(['A','B','C','D'], ['#ef4444','#3b82f6','#22c55e','#f59e0b']):\n    mask = categories == cat\n    ax2.scatter(x[mask], y[mask], c=color, s=20, alpha=0.6, label=cat)\nax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')\nax2.set_title('Category Distribution', color='white', fontsize=12, fontweight='bold')\nax2.tick_params(colors='gray')\n\nax3 = axes[1, 0]; ax3.set_facecolor('#111827')\nax3.hist(x, bins=30, color='#3b82f6', alpha=0.7, edgecolor='white', linewidth=0.5)\nax3.set_title('Feature Distribution', color='white', fontsize=12, fontweight='bold')\nax3.tick_params(colors='gray')\n\nax4 = axes[1, 1]; ax4.set_facecolor('#111827')\ncorr = np.corrcoef(x, y)[0, 1]\nax4.bar(['Correlation'], [corr], color='#22c55e', alpha=0.8)\nax4.set_title(f'R = {corr:.3f}', color='white', fontsize=12, fontweight='bold')\nax4.tick_params(colors='gray')\n\nplt.tight_layout()\nplt.show()\nprint(\"Analysis complete\")",
      challenge: "Extend the model to include additional variables and test sensitivity to parameter changes.",
      successHint: "You have built a computational model of extracting emotional tone and structured information from text — connecting theory to practice through code.",
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
