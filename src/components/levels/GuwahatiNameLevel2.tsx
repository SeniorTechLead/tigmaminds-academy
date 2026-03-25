import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function GuwahatiNameLevel2() {
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
      title: 'Historical linguistics',
      concept: `**Historical linguistics** is a core concept in urban science. Languages diverge at roughly constant rates. Comparing cognate percentages (shared words) between languages estimates when they split. Assamese diverged from Bengali about 900 years ago, reflected in distinct place-naming patterns.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between time depth and language divergence follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Historical linguistics is like adjusting a recipe: changing one ingredient (time depth) affects the final dish (language divergence) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, Guwahati evolves from a betel nut market to a metropolis, revealing urban dynamics. This connects to historical linguistics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the time depth, what happens to the language divergence? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For historical linguistics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how time depth affects language divergence.',
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
ax1.set_xlabel('Centuries', color='white')
ax1.set_ylabel('Cognate percentage (%)', color='white')
ax1.set_title('Glottochronology', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Centuries', color='white')
ax2.set_ylabel('Cognate percentage (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Historical linguistics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for historical linguistics. What parameter values best fit observed measurements?',
      successHint: 'Historical linguistics is fundamental to urban science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Agent-based urban growth models',
      concept: `**Agent-based urban growth models** is a core concept in urban science. Urban growth can be modeled as cellular automata where cells transition from rural to urban based on neighbor states, transport access, and terrain. Simple rules produce realistic urban sprawl patterns.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between agent rules and emergent patterns follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Agent-based urban growth models is like adjusting a recipe: changing one ingredient (agent rules) affects the final dish (emergent patterns) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, Guwahati evolves from a betel nut market to a metropolis, revealing urban dynamics. This connects to agent-based urban growth models because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the agent rules, what happens to the emergent patterns? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For agent-based urban growth models, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how agent rules affects emergent patterns.',
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
ax1.set_xlabel('Number of agents', color='white')
ax1.set_ylabel('Urban form complexity', color='white')
ax1.set_title('Cellular Automata for Urban Growth', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Number of agents', color='white')
ax2.set_ylabel('Urban form complexity', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Agent-based urban growth models analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for agent-based urban growth models. What parameter values best fit observed measurements?',
      successHint: 'Agent-based urban growth models is fundamental to urban science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Network science for city planning',
      concept: `**Network science for city planning** is a core concept in urban science. Road intersections are nodes, roads are edges. Betweenness centrality identifies critical intersections whose failure would disrupt the entire network. For Guwahati, bridges across the Brahmaputra are highest-centrality links.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between betweenness centrality and traffic load follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Network science for city planning is like adjusting a recipe: changing one ingredient (betweenness centrality) affects the final dish (traffic load) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, Guwahati evolves from a betel nut market to a metropolis, revealing urban dynamics. This connects to network science for city planning because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the betweenness centrality, what happens to the traffic load? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For network science for city planning, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how betweenness centrality affects traffic load.',
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
ax1.set_xlabel('Node centrality', color='white')
ax1.set_ylabel('Daily traffic volume', color='white')
ax1.set_title('Graph Theory Applied to Road Networks', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Node centrality', color='white')
ax2.set_ylabel('Daily traffic volume', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Network science for city planning analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for network science for city planning. What parameter values best fit observed measurements?',
      successHint: 'Network science for city planning is fundamental to urban science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Environmental carrying capacity',
      concept: `**Environmental carrying capacity** is a core concept in urban science. Every city has limits: water supply, sewage capacity, air quality, and food access. Guwahati population has grown from 0.5M to 1.1M in 20 years, straining infrastructure beyond designed capacity.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between population density and resource stress follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Environmental carrying capacity is like adjusting a recipe: changing one ingredient (population density) affects the final dish (resource stress) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, Guwahati evolves from a betel nut market to a metropolis, revealing urban dynamics. This connects to environmental carrying capacity because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the population density, what happens to the resource stress? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For environmental carrying capacity, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how population density affects resource stress.',
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
ax1.set_xlabel('Population (millions)', color='white')
ax1.set_ylabel('Water stress index', color='white')
ax1.set_title('Urban Carrying Capacity', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Population (millions)', color='white')
ax2.set_ylabel('Water stress index', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Environmental carrying capacity analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for environmental carrying capacity. What parameter values best fit observed measurements?',
      successHint: 'Environmental carrying capacity is fundamental to urban science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Smart city data analytics',
      concept: `**Smart city data analytics** is a core concept in urban science. Smart city sensors monitor traffic, air quality, water flow, and energy use in real-time. Machine learning on this data predicts traffic jams, floods, and infrastructure failures hours in advance.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between sensor density and prediction accuracy follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Smart city data analytics is like adjusting a recipe: changing one ingredient (sensor density) affects the final dish (prediction accuracy) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, Guwahati evolves from a betel nut market to a metropolis, revealing urban dynamics. This connects to smart city data analytics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the sensor density, what happens to the prediction accuracy? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For smart city data analytics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how sensor density affects prediction accuracy.',
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
ax1.set_xlabel('IoT sensors per km2', color='white')
ax1.set_ylabel('Anomaly detection rate (%)', color='white')
ax1.set_title('IoT for Urban Management', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('IoT sensors per km2', color='white')
ax2.set_ylabel('Anomaly detection rate (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Smart city data analytics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for smart city data analytics. What parameter values best fit observed measurements?',
      successHint: 'Smart city data analytics is fundamental to urban science. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Climate adaptation for cities',
      concept: `**Climate adaptation for cities** is a core concept in urban science. For every rupee invested in flood walls, drainage, and early warning, 4-8 rupees in damage is avoided. Climate adaptation is not a cost; it is an investment with measurable returns.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between adaptation investment and damage reduction follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Climate adaptation for cities is like adjusting a recipe: changing one ingredient (adaptation investment) affects the final dish (damage reduction) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, Guwahati evolves from a betel nut market to a metropolis, revealing urban dynamics. This connects to climate adaptation for cities because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the adaptation investment, what happens to the damage reduction? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For climate adaptation for cities, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how adaptation investment affects damage reduction.',
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
ax1.set_xlabel('Adaptation spending (crore)', color='white')
ax1.set_ylabel('Flood damage avoided (crore)', color='white')
ax1.set_title('Return on Climate Adaptation Investment', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Adaptation spending (crore)', color='white')
ax2.set_ylabel('Flood damage avoided (crore)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climate adaptation for cities analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for climate adaptation for cities. What parameter values best fit observed measurements?',
      successHint: 'Climate adaptation for cities is fundamental to urban science. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Linguistics & City Planning</span>
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
