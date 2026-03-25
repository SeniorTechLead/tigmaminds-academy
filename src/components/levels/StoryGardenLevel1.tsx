import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function StoryGardenLevel1() {
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
      title: 'The hero journey structure',
      concept: `**The hero journey structure** is a core concept in narrative science. Joseph Campbell identified a universal narrative pattern: departure, initiation, return. From Star Wars to the Ramayana, the same 12-stage structure recurs. This universality suggests deep psychological roots.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between story stage and emotional intensity follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'The hero journey structure is like adjusting a recipe: changing one ingredient (story stage) affects the final dish (emotional intensity) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a garden of stories grows, each teaching through different narrative structures. This connects to the hero journey structure because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the story stage, what happens to the emotional intensity? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For the hero journey structure, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how story stage affects emotional intensity.',
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
ax1.set_xlabel('Stage (12 steps)', color='white')
ax1.set_ylabel('Emotional intensity', color='white')
ax1.set_title('Campbell Hero Journey Arc', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Stage (12 steps)', color='white')
ax2.set_ylabel('Emotional intensity', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The hero journey structure analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for the hero journey structure. What parameter values best fit observed measurements?',
      successHint: 'The hero journey structure is fundamental to narrative science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Story as information compression',
      concept: `**Story as information compression** is a core concept in narrative science. Humans remember stories 22x better than isolated facts (Stanford research). Stories encode information in emotional, causal, and spatial frameworks that align with how memory works.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between narrative length and information retention follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Story as information compression is like adjusting a recipe: changing one ingredient (narrative length) affects the final dish (information retention) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a garden of stories grows, each teaching through different narrative structures. This connects to story as information compression because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the narrative length, what happens to the information retention? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For story as information compression, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how narrative length affects information retention.',
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
ax1.set_xlabel('Story length (words)', color='white')
ax1.set_ylabel('Recall rate (%)', color='white')
ax1.set_title('Stories vs Facts: Memory Retention', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Story length (words)', color='white')
ax2.set_ylabel('Recall rate (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Story as information compression analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for story as information compression. What parameter values best fit observed measurements?',
      successHint: 'Story as information compression is fundamental to narrative science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Narrative tension and pacing',
      concept: `**Narrative tension and pacing** is a core concept in narrative science. Classic story structure: exposition, rising action, climax, falling action, resolution. Tension follows a predictable arc. Too little tension and the reader is bored; too much without release and the reader is exhausted.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between scene number and tension level follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Narrative tension and pacing is like adjusting a recipe: changing one ingredient (scene number) affects the final dish (tension level) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a garden of stories grows, each teaching through different narrative structures. This connects to narrative tension and pacing because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the scene number, what happens to the tension level? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For narrative tension and pacing, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how scene number affects tension level.',
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
ax1.set_xlabel('Scene', color='white')
ax1.set_ylabel('Tension (0-10)', color='white')
ax1.set_title('Freytag Pyramid and Story Tension', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Scene', color='white')
ax2.set_ylabel('Tension (0-10)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Narrative tension and pacing analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for narrative tension and pacing. What parameter values best fit observed measurements?',
      successHint: 'Narrative tension and pacing is fundamental to narrative science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Cultural transmission through stories',
      concept: `**Cultural transmission through stories** is a core concept in narrative science. Before writing, stories were the primary technology for transmitting knowledge across generations. Aboriginal Australian stories encode geography that matches geological records from 7,000+ years ago.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between generations and story fidelity follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Cultural transmission through stories is like adjusting a recipe: changing one ingredient (generations) affects the final dish (story fidelity) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a garden of stories grows, each teaching through different narrative structures. This connects to cultural transmission through stories because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the generations, what happens to the story fidelity? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For cultural transmission through stories, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how generations affects story fidelity.',
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
ax1.set_xlabel('Generations of retelling', color='white')
ax1.set_ylabel('Story accuracy (%)', color='white')
ax1.set_title('Oral Tradition as Cultural Memory', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Generations of retelling', color='white')
ax2.set_ylabel('Story accuracy (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cultural transmission through stories analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for cultural transmission through stories. What parameter values best fit observed measurements?',
      successHint: 'Cultural transmission through stories is fundamental to narrative science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Data storytelling',
      concept: `**Data storytelling** is a core concept in narrative science. The most effective data presentations tell a story: set context, introduce tension (the problem in the data), present evidence (charts), and resolve (recommendation). Data without narrative is forgotten.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between chart count and audience engagement follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Data storytelling is like adjusting a recipe: changing one ingredient (chart count) affects the final dish (audience engagement) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a garden of stories grows, each teaching through different narrative structures. This connects to data storytelling because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the chart count, what happens to the audience engagement? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For data storytelling, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how chart count affects audience engagement.',
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
ax1.set_xlabel('Number of visualizations', color='white')
ax1.set_ylabel('Engagement score', color='white')
ax1.set_title('Turning Data Into Narrative', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Number of visualizations', color='white')
ax2.set_ylabel('Engagement score', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Data storytelling analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for data storytelling. What parameter values best fit observed measurements?',
      successHint: 'Data storytelling is fundamental to narrative science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Interactive narrative design',
      concept: `**Interactive narrative design** is a core concept in narrative science. Interactive stories (games, choose-your-own-adventure) create branching narratives. Each choice point doubles possible paths. 10 binary choices create 1024 possible stories. This is also how lesson paths can be personalized.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between choice points and engagement follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Interactive narrative design is like adjusting a recipe: changing one ingredient (choice points) affects the final dish (engagement) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a garden of stories grows, each teaching through different narrative structures. This connects to interactive narrative design because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the choice points, what happens to the engagement? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For interactive narrative design, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how choice points affects engagement.',
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
ax1.set_xlabel('Decision points', color='white')
ax1.set_ylabel('Reader engagement', color='white')
ax1.set_title('Choose Your Own Adventure: Branching Narratives', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Decision points', color='white')
ax2.set_ylabel('Reader engagement', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Interactive narrative design analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for interactive narrative design. What parameter values best fit observed measurements?',
      successHint: 'Interactive narrative design is fundamental to narrative science. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Storytelling & Narrative Structure</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
