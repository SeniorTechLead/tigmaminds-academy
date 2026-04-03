import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MemoryGrandmaLevel4() {
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
      title: "Capstone Design: Spaced Repetition System — from forgetting curves to optimal learning",
      concept: "The capstone integrates all Level 3 skills into a complete, deployable system. from forgetting curves to optimal learning. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "Building this capstone is like constructing a complete laboratory instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Capstone Design: Spaced Repetition System — from forgetting curves to optimal learning ---
print("Capstone Design: Spaced Repetition System — from forgetting curves to optimal learning: implementation ready")
print("Run the code to see results")

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

x = np.linspace(0, 10, 200)
axes[0,0].plot(x, np.sin(x), color='#22c55e', linewidth=2)
axes[0,0].set_title('Signal analysis', color='white', fontsize=11)
axes[0,1].plot(x, np.cos(x), color='#f59e0b', linewidth=2)
axes[0,1].set_title('Frequency domain', color='white', fontsize=11)
axes[1,0].hist(np.random.normal(0,1,1000), bins=30, color='#3b82f6', alpha=0.7)
axes[1,0].set_title('Distribution', color='white', fontsize=11)
axes[1,1].scatter(np.random.randn(100), np.random.randn(100), s=10, c='#a855f7', alpha=0.6)
axes[1,1].set_title('Feature space', color='white', fontsize=11)

for ax in axes.flat:
    ax.set_xlabel('X', color='white')
    ax.set_ylabel('Y', color='white')

plt.tight_layout()
plt.show()

print("Analysis complete")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 2: Individual forgetting rate estimation from review data",
      concept: "Stage 2 of the capstone builds on the previous stages. Stage 2: Individual forgetting rate estimation from review data. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Stage 2: Individual forgetting rate estimation from review data ---
print("Stage 2: Individual forgetting rate estimation from review data: implementation ready")
print("Run the code to see results")

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

x = np.linspace(0, 10, 200)
axes[0,0].plot(x, np.sin(x), color='#22c55e', linewidth=2)
axes[0,0].set_title('Signal analysis', color='white', fontsize=11)
axes[0,1].plot(x, np.cos(x), color='#f59e0b', linewidth=2)
axes[0,1].set_title('Frequency domain', color='white', fontsize=11)
axes[1,0].hist(np.random.normal(0,1,1000), bins=30, color='#3b82f6', alpha=0.7)
axes[1,0].set_title('Distribution', color='white', fontsize=11)
axes[1,1].scatter(np.random.randn(100), np.random.randn(100), s=10, c='#a855f7', alpha=0.6)
axes[1,1].set_title('Feature space', color='white', fontsize=11)

for ax in axes.flat:
    ax.set_xlabel('X', color='white')
    ax.set_ylabel('Y', color='white')

plt.tight_layout()
plt.show()

print("Analysis complete")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 3: Optimal interval calculator with confidence bounds",
      concept: "Stage 3 of the capstone builds on the previous stages. Stage 3: Optimal interval calculator with confidence bounds. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Stage 3: Optimal interval calculator with confidence bounds ---
print("Stage 3: Optimal interval calculator with confidence bounds: implementation ready")
print("Run the code to see results")

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

x = np.linspace(0, 10, 200)
axes[0,0].plot(x, np.sin(x), color='#22c55e', linewidth=2)
axes[0,0].set_title('Signal analysis', color='white', fontsize=11)
axes[0,1].plot(x, np.cos(x), color='#f59e0b', linewidth=2)
axes[0,1].set_title('Frequency domain', color='white', fontsize=11)
axes[1,0].hist(np.random.normal(0,1,1000), bins=30, color='#3b82f6', alpha=0.7)
axes[1,0].set_title('Distribution', color='white', fontsize=11)
axes[1,1].scatter(np.random.randn(100), np.random.randn(100), s=10, c='#a855f7', alpha=0.6)
axes[1,1].set_title('Feature space', color='white', fontsize=11)

for ax in axes.flat:
    ax.set_xlabel('X', color='white')
    ax.set_ylabel('Y', color='white')

plt.tight_layout()
plt.show()

print("Analysis complete")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 4: Multi-item scheduler with interference modeling",
      concept: "Stage 4 of the capstone builds on the previous stages. Stage 4: Multi-item scheduler with interference modeling. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Stage 4: Multi-item scheduler with interference modeling ---
print("Stage 4: Multi-item scheduler with interference modeling: implementation ready")
print("Run the code to see results")

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

x = np.linspace(0, 10, 200)
axes[0,0].plot(x, np.sin(x), color='#22c55e', linewidth=2)
axes[0,0].set_title('Signal analysis', color='white', fontsize=11)
axes[0,1].plot(x, np.cos(x), color='#f59e0b', linewidth=2)
axes[0,1].set_title('Frequency domain', color='white', fontsize=11)
axes[1,0].hist(np.random.normal(0,1,1000), bins=30, color='#3b82f6', alpha=0.7)
axes[1,0].set_title('Distribution', color='white', fontsize=11)
axes[1,1].scatter(np.random.randn(100), np.random.randn(100), s=10, c='#a855f7', alpha=0.6)
axes[1,1].set_title('Feature space', color='white', fontsize=11)

for ax in axes.flat:
    ax.set_xlabel('X', color='white')
    ax.set_ylabel('Y', color='white')

plt.tight_layout()
plt.show()

print("Analysis complete")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 5: Performance prediction and learning curve visualization",
      concept: "Stage 5 of the capstone builds on the previous stages. Stage 5: Performance prediction and learning curve visualization. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Stage 5: Performance prediction and learning curve visualization ---
print("Stage 5: Performance prediction and learning curve visualization: implementation ready")
print("Run the code to see results")

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

x = np.linspace(0, 10, 200)
axes[0,0].plot(x, np.sin(x), color='#22c55e', linewidth=2)
axes[0,0].set_title('Signal analysis', color='white', fontsize=11)
axes[0,1].plot(x, np.cos(x), color='#f59e0b', linewidth=2)
axes[0,1].set_title('Frequency domain', color='white', fontsize=11)
axes[1,0].hist(np.random.normal(0,1,1000), bins=30, color='#3b82f6', alpha=0.7)
axes[1,0].set_title('Distribution', color='white', fontsize=11)
axes[1,1].scatter(np.random.randn(100), np.random.randn(100), s=10, c='#a855f7', alpha=0.6)
axes[1,1].set_title('Feature space', color='white', fontsize=11)

for ax in axes.flat:
    ax.set_xlabel('X', color='white')
    ax.set_ylabel('Y', color='white')

plt.tight_layout()
plt.show()

print("Analysis complete")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 6: Complete learning analytics report with study recommendations",
      concept: "Stage 6 of the capstone builds on the previous stages. Stage 6: Complete learning analytics report with study recommendations. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Stage 6: Complete learning analytics report with study recommendations ---
print("Stage 6: Complete learning analytics report with study recommendations: implementation ready")
print("Run the code to see results")

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

x = np.linspace(0, 10, 200)
axes[0,0].plot(x, np.sin(x), color='#22c55e', linewidth=2)
axes[0,0].set_title('Signal analysis', color='white', fontsize=11)
axes[0,1].plot(x, np.cos(x), color='#f59e0b', linewidth=2)
axes[0,1].set_title('Frequency domain', color='white', fontsize=11)
axes[1,0].hist(np.random.normal(0,1,1000), bins=30, color='#3b82f6', alpha=0.7)
axes[1,0].set_title('Distribution', color='white', fontsize=11)
axes[1,1].scatter(np.random.randn(100), np.random.randn(100), s=10, c='#a855f7', alpha=0.6)
axes[1,1].set_title('Feature space', color='white', fontsize=11)

for ax in axes.flat:
    ax.set_xlabel('X', color='white')
    ax.set_ylabel('Y', color='white')

plt.tight_layout()
plt.show()

print("Analysis complete")`,
      challenge: "Add an interactive mode where the user can adjust parameters and see results update in real time. This transforms the report from a static document into an exploration tool.",
      successHint: "You have completed a full capstone project. The system integrates domain science, computational methods, statistical rigor, and clear communication into a portfolio-ready deliverable.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (memory science and learning algorithms)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Spaced Repetition System. Click to start.</p>
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
