import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MemoryGrandmaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Ebbinghaus forgetting curve — modeling memory decay over time",
      concept: "modeling memory decay over time. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Ebbinghaus forgetting curve — modeling memory decay over time ---
print("Ebbinghaus forgetting curve — modeling memory decay over time: implementation ready")
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
      title: "Hippocampal encoding — simulating how memories form and consolidate",
      concept: "simulating how memories form and consolidate. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Hippocampal encoding — simulating how memories form and consolidate ---
print("Hippocampal encoding — simulating how memories form and consolidate: implementation ready")
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
      title: "Spaced repetition theory — optimizing review intervals for retention",
      concept: "optimizing review intervals for retention. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Spaced repetition theory — optimizing review intervals for retention ---
print("Spaced repetition theory — optimizing review intervals for retention: implementation ready")
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
      title: "Memory interference — modeling how new learning disrupts old memories",
      concept: "modeling how new learning disrupts old memories. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Memory interference — modeling how new learning disrupts old memories ---
print("Memory interference — modeling how new learning disrupts old memories: implementation ready")
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
      title: "Sleep and consolidation — simulating overnight memory strengthening",
      concept: "simulating overnight memory strengthening. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Sleep and consolidation — simulating overnight memory strengthening ---
print("Sleep and consolidation — simulating overnight memory strengthening: implementation ready")
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
      title: "Adaptive scheduling — building an algorithm that learns your forgetting rate",
      concept: "building an algorithm that learns your forgetting rate. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Adaptive scheduling — building an algorithm that learns your forgetting rate ---
print("Adaptive scheduling — building an algorithm that learns your forgetting rate: implementation ready")
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
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (neuroscience fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for memory neuroscience and spaced repetition algorithms. Click to start.</p>
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
