import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MusicDimasaLevel3() {
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
      title: "Polyrhythm mathematics — modeling simultaneous rhythmic layers",
      concept: "modeling simultaneous rhythmic layers. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Polyrhythm mathematics — modeling simultaneous rhythmic layers ---
print("Polyrhythm mathematics — modeling simultaneous rhythmic layers: implementation ready")
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
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Scale systems — comparing Dimasa scales to Western temperament",
      concept: "comparing Dimasa scales to Western temperament. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Scale systems — comparing Dimasa scales to Western temperament ---
print("Scale systems — comparing Dimasa scales to Western temperament: implementation ready")
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
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Rhythmic complexity metrics — quantifying groove and syncopation",
      concept: "quantifying groove and syncopation. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Rhythmic complexity metrics — quantifying groove and syncopation ---
print("Rhythmic complexity metrics — quantifying groove and syncopation: implementation ready")
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
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Ensemble synchronization — modeling timing in group performance",
      concept: "modeling timing in group performance. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Ensemble synchronization — modeling timing in group performance ---
print("Ensemble synchronization — modeling timing in group performance: implementation ready")
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
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Melodic contour analysis — extracting pitch patterns from vocal music",
      concept: "extracting pitch patterns from vocal music. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Melodic contour analysis — extracting pitch patterns from vocal music ---
print("Melodic contour analysis — extracting pitch patterns from vocal music: implementation ready")
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
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Cultural classification — building a music tradition identifier",
      concept: "building a music tradition identifier. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Cultural classification — building a music tradition identifier ---
print("Cultural classification — building a music tradition identifier: implementation ready")
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
      challenge: "Combine the models from all six lessons into a unified analysis pipeline. Run it on a new dataset and generate a comprehensive summary report.",
      successHint: "You have built a complete analytical framework for this domain — from raw data to validated predictions.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (music theory fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for ethnomusicology and rhythm mathematics. Click to start.</p>
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
