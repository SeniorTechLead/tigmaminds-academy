import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function StoryGardenLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Sentiment analysis of narratives',
      concept: `**Sentiment analysis of narratives** is a core concept in computational narratology. Kurt Vonnegut proposed that stories have measurable emotional arcs. NLP sentiment analysis confirms 6 core arcs: rags-to-riches, riches-to-rags, man-in-a-hole, Icarus, Cinderella, and Oedipus. The most successful stories follow the man-in-a-hole arc.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between word count and sentiment score follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Sentiment analysis of narratives is like adjusting a recipe: changing one ingredient (word count) affects the final dish (sentiment score) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the story garden reveals that stories themselves follow mathematical patterns. This connects to sentiment analysis of narratives because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the word count, what happens to the sentiment score? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For sentiment analysis of narratives, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how word count affects sentiment score.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Position in text (%)', color='white')
ax1.set_ylabel('Sentiment (-1 to +1)', color='white')
ax1.set_title('Emotional Arc Detection', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Position in text (%)', color='white')
ax2.set_ylabel('Sentiment (-1 to +1)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sentiment analysis of narratives analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for sentiment analysis of narratives. What parameter values best fit observed measurements?',
      successHint: 'Sentiment analysis of narratives is fundamental to computational narratology. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Network analysis of narratives',
      concept: `**Network analysis of narratives** is a core concept in computational narratology. Mapping who interacts with whom in a story creates a social network. Dense, connected networks (Game of Thrones) create complex stories. Star-shaped networks (hero-centric) create simpler ones. Network metrics predict story ratings.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between character count and network complexity follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Network analysis of narratives is like adjusting a recipe: changing one ingredient (character count) affects the final dish (network complexity) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the story garden reveals that stories themselves follow mathematical patterns. This connects to network analysis of narratives because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the character count, what happens to the network complexity? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For network analysis of narratives, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how character count affects network complexity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Characters', color='white')
ax1.set_ylabel('Interaction density', color='white')
ax1.set_title('Character Interaction Networks', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Characters', color='white')
ax2.set_ylabel('Interaction density', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Network analysis of narratives analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for network analysis of narratives. What parameter values best fit observed measurements?',
      successHint: 'Network analysis of narratives is fundamental to computational narratology. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Computational creativity',
      concept: `**Computational creativity** is a core concept in computational narratology. AI can generate stories using language models. But creativity requires constraints: form (sonnet), theme (loss), and coherence (plot). The most creative works emerge from tight constraints, not total freedom.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between constraint count and creativity score follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Computational creativity is like adjusting a recipe: changing one ingredient (constraint count) affects the final dish (creativity score) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the story garden reveals that stories themselves follow mathematical patterns. This connects to computational creativity because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the constraint count, what happens to the creativity score? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For computational creativity, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how constraint count affects creativity score.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Constraints', color='white')
ax1.set_ylabel('Novelty rating', color='white')
ax1.set_title('Creativity Under Constraints', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Constraints', color='white')
ax2.set_ylabel('Novelty rating', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Computational creativity analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for computational creativity. What parameter values best fit observed measurements?',
      successHint: 'Computational creativity is fundamental to computational narratology. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Narrative as simulation',
      concept: `**Narrative as simulation** is a core concept in computational narratology. Neuroscience shows that reading a story activates the same brain regions as experiencing the events. Stories are simulations that let us rehearse situations without real consequences.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between model complexity and predictive power follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Narrative as simulation is like adjusting a recipe: changing one ingredient (model complexity) affects the final dish (predictive power) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the story garden reveals that stories themselves follow mathematical patterns. This connects to narrative as simulation because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the model complexity, what happens to the predictive power? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For narrative as simulation, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how model complexity affects predictive power.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Variables in mental model', color='white')
ax1.set_ylabel('Prediction accuracy (%)', color='white')
ax1.set_title('Stories as Mental Simulations', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Variables in mental model', color='white')
ax2.set_ylabel('Prediction accuracy (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Narrative as simulation analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for narrative as simulation. What parameter values best fit observed measurements?',
      successHint: 'Narrative as simulation is fundamental to computational narratology. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Cross-cultural narrative universals',
      concept: `**Cross-cultural narrative universals** is a core concept in computational narratology. Folklorists have catalogued narrative motifs across 2,500+ cultures. Certain motifs appear everywhere: the trickster, the quest, the transformation, the sacrifice. These universals suggest shared cognitive architecture.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between culture count and shared motifs follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Cross-cultural narrative universals is like adjusting a recipe: changing one ingredient (culture count) affects the final dish (shared motifs) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the story garden reveals that stories themselves follow mathematical patterns. This connects to cross-cultural narrative universals because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the culture count, what happens to the shared motifs? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For cross-cultural narrative universals, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how culture count affects shared motifs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Cultures studied', color='white')
ax1.set_ylabel('Universal motifs found', color='white')
ax1.set_title('Aarne-Thompson Tale Type Index', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Cultures studied', color='white')
ax2.set_ylabel('Universal motifs found', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cross-cultural narrative universals analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for cross-cultural narrative universals. What parameter values best fit observed measurements?',
      successHint: 'Cross-cultural narrative universals is fundamental to computational narratology. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Storytelling as pedagogy',
      concept: `**Storytelling as pedagogy** is a core concept in computational narratology. Students who learn through stories score 15-20% higher on comprehension tests than those who learn from textbooks alone. Stories provide context, motivation, and emotional anchoring that enhance encoding and recall.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between narrative framing and learning outcome follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Storytelling as pedagogy is like adjusting a recipe: changing one ingredient (narrative framing) affects the final dish (learning outcome) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, the story garden reveals that stories themselves follow mathematical patterns. This connects to storytelling as pedagogy because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the narrative framing, what happens to the learning outcome? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For storytelling as pedagogy, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how narrative framing affects learning outcome.',
      code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0.1, 10, 200)
y1 = x ** 2
y2 = x ** 1.5
y3 = np.sqrt(x) * 5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(x, y1, color='#22c55e', linewidth=2, label='Quadratic')
ax1.plot(x, y2, color='#3b82f6', linewidth=2, label='Power 1.5')
ax1.plot(x, y3, color='#f59e0b', linewidth=2, label='Square root')
ax1.set_xlabel('Story integration level', color='white')
ax1.set_ylabel('Test score improvement (%)', color='white')
ax1.set_title('Narrative-Based Learning Outcomes', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Story integration level', color='white')
ax2.set_ylabel('Test score improvement (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Storytelling as pedagogy analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for storytelling as pedagogy. What parameter values best fit observed measurements?',
      successHint: 'Storytelling as pedagogy is fundamental to computational narratology. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Narrative Science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
