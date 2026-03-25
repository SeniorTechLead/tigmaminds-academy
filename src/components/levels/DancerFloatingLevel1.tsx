import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function DancerFloatingLevel1() {
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
      title: 'Floating market economics',
      concept: `**Floating market economics** is a core concept in trade economics. Water transport is the cheapest form of freight (1/5 the cost of road per ton-km). This is why civilizations developed along rivers. Floating markets exploit this cost advantage, enabling trade that would be uneconomical overland.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between transport cost and trade volume follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Floating market economics is like adjusting a recipe: changing one ingredient (transport cost) affects the final dish (trade volume) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a dancer performs at floating markets along the river, bringing communities together through commerce. This connects to floating market economics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the transport cost, what happens to the trade volume? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For floating market economics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how transport cost affects trade volume.',
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
ax1.set_xlabel('Transport cost per km', color='white')
ax1.set_ylabel('Trade volume', color='white')
ax1.set_title('Transport Cost and Trade', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Transport cost per km', color='white')
ax2.set_ylabel('Trade volume', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Floating market economics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for floating market economics. What parameter values best fit observed measurements?',
      successHint: 'Floating market economics is fundamental to trade economics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Price arbitrage',
      concept: `**Price arbitrage** is a core concept in trade economics. When the same good costs different amounts in different places, traders profit by buying low and selling high. This arbitrage tends to equalize prices across markets over time.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between price difference and profit follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Price arbitrage is like adjusting a recipe: changing one ingredient (price difference) affects the final dish (profit) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a dancer performs at floating markets along the river, bringing communities together through commerce. This connects to price arbitrage because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the price difference, what happens to the profit? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For price arbitrage, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how price difference affects profit.',
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
ax1.set_xlabel('Price gap between markets', color='white')
ax1.set_ylabel('Trader profit', color='white')
ax1.set_title('Spatial Price Arbitrage', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Price gap between markets', color='white')
ax2.set_ylabel('Trader profit', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Price arbitrage analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for price arbitrage. What parameter values best fit observed measurements?',
      successHint: 'Price arbitrage is fundamental to trade economics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Network economics of river trade',
      concept: `**Network economics of river trade** is a core concept in trade economics. Each additional market stop on a river route increases trade value nonlinearly because it creates new trading pairs. A route with n stops has n*(n-1)/2 possible trading pairs.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between number of stops and total commerce follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Network economics of river trade is like adjusting a recipe: changing one ingredient (number of stops) affects the final dish (total commerce) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a dancer performs at floating markets along the river, bringing communities together through commerce. This connects to network economics of river trade because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the number of stops, what happens to the total commerce? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For network economics of river trade, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how number of stops affects total commerce.',
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
ax1.set_xlabel('Market stops', color='white')
ax1.set_ylabel('Total value traded', color='white')
ax1.set_title('River Trade Network Effects', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Market stops', color='white')
ax2.set_ylabel('Total value traded', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Network economics of river trade analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for network economics of river trade. What parameter values best fit observed measurements?',
      successHint: 'Network economics of river trade is fundamental to trade economics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Seasonal economics',
      concept: `**Seasonal economics** is a core concept in trade economics. Floating markets are seasonal: active during high water (monsoon), dormant during dry season. This creates boom-bust cycles that communities must plan for.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between monsoon phase and market activity follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Seasonal economics is like adjusting a recipe: changing one ingredient (monsoon phase) affects the final dish (market activity) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a dancer performs at floating markets along the river, bringing communities together through commerce. This connects to seasonal economics because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the monsoon phase, what happens to the market activity? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For seasonal economics, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how monsoon phase affects market activity.',
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
ax1.set_xlabel('Month', color='white')
ax1.set_ylabel('Market volume', color='white')
ax1.set_title('Seasonal Trade Patterns', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Month', color='white')
ax2.set_ylabel('Market volume', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Seasonal economics analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for seasonal economics. What parameter values best fit observed measurements?',
      successHint: 'Seasonal economics is fundamental to trade economics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Cultural economics of performance',
      concept: `**Cultural economics of performance** is a core concept in trade economics. The dancer draws crowds who then trade at the market. Entertainment has an economic multiplier: every rupee spent on performance generates 3-5 rupees in associated spending (food, crafts, transport).\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between audience size and economic multiplier follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Cultural economics of performance is like adjusting a recipe: changing one ingredient (audience size) affects the final dish (economic multiplier) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a dancer performs at floating markets along the river, bringing communities together through commerce. This connects to cultural economics of performance because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the audience size, what happens to the economic multiplier? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For cultural economics of performance, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how audience size affects economic multiplier.',
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
ax1.set_xlabel('Audience', color='white')
ax1.set_ylabel('Local spending', color='white')
ax1.set_title('Entertainment as Economic Engine', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Audience', color='white')
ax2.set_ylabel('Local spending', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cultural economics of performance analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for cultural economics of performance. What parameter values best fit observed measurements?',
      successHint: 'Cultural economics of performance is fundamental to trade economics. Mastering this relationship gives you predictive power over real-world systems.',
    },    {
      title: 'Supply chain resilience',
      concept: `**Supply chain resilience** is a core concept in trade economics. River trade networks are vulnerable to floods, droughts, and blockages. Multiple route options (resilience) protect against disruption. A single-route network fails completely when blocked.\n\nThis principle connects directly to real-world applications and can be understood through mathematical modeling and visualization. The relationship between disruption probability and system resilience follows predictable patterns that engineers and scientists use to design solutions.`,
      analogy: 'Supply chain resilience is like adjusting a recipe: changing one ingredient (disruption probability) affects the final dish (system resilience) in predictable ways. Understanding this relationship lets you optimize the outcome.',
      storyConnection: 'In the story, a dancer performs at floating markets along the river, bringing communities together through commerce. This connects to supply chain resilience because the physical principles governing the story events are the same ones we model mathematically here.',
      checkQuestion: 'If you double the disruption probability, what happens to the system resilience? Is the relationship linear or nonlinear?',
      checkAnswer: 'It depends on the specific relationship. For supply chain resilience, the relationship is typically nonlinear, meaning doubling the input does not simply double the output. This is why mathematical modeling is essential rather than simple intuition.',
      codeIntro: 'Visualize how disruption probability affects system resilience.',
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
ax1.set_xlabel('Number of alternative routes', color='white')
ax1.set_ylabel('Supply reliability (%)', color='white')
ax1.set_title('Redundancy in Trade Networks', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Sensitivity analysis
params = np.linspace(0.5, 2.0, 6)
ax2.set_facecolor('#111827')
for p in params:
    y = x ** p
    ax2.plot(x, y, linewidth=1.5, label=f'exponent={p:.1f}')
ax2.set_xlabel('Number of alternative routes', color='white')
ax2.set_ylabel('Supply reliability (%)', color='white')
ax2.set_title('Sensitivity to Parameters', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Supply chain resilience analysis:")
print(f"  At x=1: y = {1**2:.1f}, {1**1.5:.1f}, {5*1**0.5:.1f}")
print(f"  At x=5: y = {5**2:.1f}, {5**1.5:.1f}, {5*5**0.5:.1f}")
print(f"  At x=10: y = {10**2:.1f}, {10**1.5:.1f}, {5*10**0.5:.1f}")
print("Nonlinear relationships dominate real-world systems.")`,
      challenge: 'Modify the parameters to match real-world data for supply chain resilience. What parameter values best fit observed measurements?',
      successHint: 'Supply chain resilience is fundamental to trade economics. Mastering this relationship gives you predictive power over real-world systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Economics & Floating Markets</span>
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
