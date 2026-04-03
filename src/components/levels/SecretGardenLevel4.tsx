import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function SecretGardenLevel4() {
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
      title: 'Capstone — Build a Wetland Health Index for Loktak Lake',
      concept: `In this capstone project you will build a complete Wetland Health Index (WHI) that combines water chemistry, vegetation coverage, and biodiversity indicators into a single composite score. This is the same approach used by the Ramsar Convention and national wetland monitoring programs worldwide.

Your WHI will ingest multi-parameter data from simulated monitoring stations around Loktak Lake. For each station you have: dissolved oxygen (mg/L), BOD₅ (mg/L), pH, total phosphorus (μg/L), Secchi disk depth (m), phumdi coverage (% of local area), macrophyte species richness, fish species count, and waterbird abundance. Each raw measurement is converted to a 0-100 sub-score using scientifically grounded scoring functions (e.g., DO scored against saturation, pH scored by distance from neutral, species counts scored against reference conditions).

The sub-scores are grouped into three pillars — Water Quality (DO, BOD, pH, total P, Secchi), Vegetation (phumdi coverage, macrophyte richness), and Biodiversity (fish species, bird abundance) — each computed as the weighted mean of its components. The final WHI is the weighted mean of the three pillars. You will visualize station-level results on a spatial map, compare pillars across stations, and identify which stations and which indicators are driving low scores. This is a real decision-support tool.`,
      analogy: 'Building a WHI is like creating a medical dashboard for a patient. Blood pressure, heart rate, temperature, and blood tests are like DO, pH, nutrients, and biodiversity counts. Each measurement is converted to a standardized score, grouped by organ system (cardiovascular, respiratory, etc. = water quality, vegetation, biodiversity), and combined into an overall health rating. The dashboard tells the doctor — or the wetland manager — where to intervene first.',
      storyConnection: 'The secret garden of Loktak is not a single ecosystem but a mosaic of microhabitats — open water, thick phumdis, degraded margins, and riverine zones. A single water sample cannot capture this diversity. The WHI you build here treats each monitoring station as a window into one part of the garden, and the composite score tells the story of the whole. This is the tool that could save Loktak\'s floating world.',
      checkQuestion: 'Station A scores 85 on Water Quality but only 30 on Biodiversity. Station B scores 50 on both. Which station has a higher overall WHI (equal pillar weights), and which station would you prioritize for conservation action?',
      checkAnswer: 'Station A WHI ≈ (85 + 30) / 2 = 57.5 (assuming two pillars for simplicity). Station B WHI = (50 + 50) / 2 = 50. Station A has a higher overall WHI, but Station B is more balanced. You would prioritize Station A for biodiversity restoration (its bottleneck is clear) and Station B for general improvement. The WHI identifies not just the score but the specific weakness.',
      codeIntro: 'Build the complete Wetland Health Index — scoring functions, three-pillar aggregation, spatial visualization, and management recommendations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Scoring functions (raw measurement → 0-100 score) ---
def score_DO(do):
    return np.clip(do / 9.1 * 100, 0, 100)

def score_BOD(bod):
    return np.clip(100 - bod * 10, 0, 100)

def score_pH(ph):
    return np.clip(100 - 30 * np.abs(ph - 7.0), 0, 100)

def score_TP(tp):
    # Total phosphorus: 100 at <10 μg/L, 0 at >80 μg/L
    return np.clip((80 - tp) / 70 * 100, 0, 100)

def score_secchi(depth):
    return np.clip((depth - 0.2) / 3.8 * 100, 0, 100)

def score_phumdi(pct):
    # Phumdi coverage: optimal ~40-60%, too low or too high is bad
    return np.clip(100 - 3 * np.abs(pct - 50), 0, 100)

def score_macrophyte(n_spp, ref=25):
    return np.clip(n_spp / ref * 100, 0, 100)

def score_fish(n_spp, ref=50):
    return np.clip(n_spp / ref * 100, 0, 100)

def score_birds(count, ref=200):
    return np.clip(count / ref * 100, 0, 100)

# --- Simulated monitoring stations around Loktak Lake ---
np.random.seed(42)
stations = {
    'S1-Keibul Lamjao': {
        'x': 0.7, 'y': 0.6,
        'DO': 4.8, 'BOD': 9.2, 'pH': 6.2, 'TP': 55,
        'Secchi': 1.0, 'Phumdi%': 70, 'Macrophytes': 18, 'Fish': 15, 'Birds': 120,
    },
    'S2-Northern open': {
        'x': 0.5, 'y': 0.8,
        'DO': 7.2, 'BOD': 4.5, 'pH': 7.1, 'TP': 25,
        'Secchi': 2.8, 'Phumdi%': 10, 'Macrophytes': 12, 'Fish': 28, 'Birds': 85,
    },
    'S3-Thanga Island': {
        'x': 0.4, 'y': 0.5,
        'DO': 5.5, 'BOD': 7.0, 'pH': 6.5, 'TP': 45,
        'Secchi': 1.5, 'Phumdi%': 45, 'Macrophytes': 20, 'Fish': 22, 'Birds': 150,
    },
    'S4-Southern inlet': {
        'x': 0.3, 'y': 0.2,
        'DO': 3.2, 'BOD': 14.0, 'pH': 5.8, 'TP': 78,
        'Secchi': 0.5, 'Phumdi%': 25, 'Macrophytes': 8, 'Fish': 10, 'Birds': 40,
    },
    'S5-Western margin': {
        'x': 0.15, 'y': 0.55,
        'DO': 6.0, 'BOD': 6.5, 'pH': 6.7, 'TP': 38,
        'Secchi': 1.8, 'Phumdi%': 55, 'Macrophytes': 22, 'Fish': 30, 'Birds': 170,
    },
    'S6-Ithai Barrage': {
        'x': 0.6, 'y': 0.15,
        'DO': 4.0, 'BOD': 11.0, 'pH': 6.0, 'TP': 65,
        'Secchi': 0.7, 'Phumdi%': 15, 'Macrophytes': 6, 'Fish': 12, 'Birds': 30,
    },
}

# --- Compute scores for each station ---
results = {}
for name, data in stations.items():
    wq_scores = {
        'DO': score_DO(data['DO']),
        'BOD': score_BOD(data['BOD']),
        'pH': score_pH(data['pH']),
        'Total P': score_TP(data['TP']),
        'Secchi': score_secchi(data['Secchi']),
    }
    veg_scores = {
        'Phumdi': score_phumdi(data['Phumdi%']),
        'Macrophytes': score_macrophyte(data['Macrophytes']),
    }
    bio_scores = {
        'Fish': score_fish(data['Fish']),
        'Birds': score_birds(data['Birds']),
    }

    wq_pillar = np.mean(list(wq_scores.values()))
    veg_pillar = np.mean(list(veg_scores.values()))
    bio_pillar = np.mean(list(bio_scores.values()))

    # WHI = weighted mean of pillars (equal weights)
    whi = 0.40 * wq_pillar + 0.30 * veg_pillar + 0.30 * bio_pillar

    results[name] = {
        'wq': wq_scores, 'veg': veg_scores, 'bio': bio_scores,
        'wq_pillar': wq_pillar, 'veg_pillar': veg_pillar, 'bio_pillar': bio_pillar,
        'whi': whi, 'x': data['x'], 'y': data['y'],
    }

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Spatial map with WHI scores
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Draw lake outline (simplified ellipse)
theta = np.linspace(0, 2*np.pi, 100)
lake_x = 0.45 + 0.35 * np.cos(theta)
lake_y = 0.5 + 0.35 * np.sin(theta)
ax.fill(lake_x, lake_y, color='#1e3a5f', alpha=0.3)
ax.plot(lake_x, lake_y, color='#3b82f6', linewidth=1.5)

for name, r in results.items():
    whi = r['whi']
    color = '#22c55e' if whi >= 60 else '#f59e0b' if whi >= 40 else '#ef4444'
    ax.scatter(r['x'], r['y'], s=whi * 5 + 50, c=color, edgecolors='white',
              linewidth=1.5, zorder=5)
    short = name.split('-', 1)[1] if '-' in name else name
    ax.annotate(f'{short}\\nWHI={whi:.0f}', xy=(r['x'], r['y']),
               xytext=(r['x'] + 0.05, r['y'] + 0.06),
               color='white', fontsize=7, fontweight='bold',
               arrowprops=dict(arrowstyle='->', color='gray', lw=0.5))
ax.set_xlim(-0.05, 1.0); ax.set_ylim(-0.05, 1.05)
ax.set_title('Loktak Lake — Station WHI Scores', color='white', fontsize=12, fontweight='bold')
ax.set_xlabel('Longitude (relative)', color='white')
ax.set_ylabel('Latitude (relative)', color='white')
ax.tick_params(colors='gray')

# Plot 2: Pillar comparison across stations
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
station_names = [n.split('-')[0] for n in results.keys()]
wq_pillars = [r['wq_pillar'] for r in results.values()]
veg_pillars = [r['veg_pillar'] for r in results.values()]
bio_pillars = [r['bio_pillar'] for r in results.values()]
x = np.arange(len(station_names))
w = 0.25
ax2.bar(x - w, wq_pillars, w, color='#3b82f6', label='Water Quality')
ax2.bar(x, veg_pillars, w, color='#22c55e', label='Vegetation')
ax2.bar(x + w, bio_pillars, w, color='#f59e0b', label='Biodiversity')
ax2.set_xticks(x); ax2.set_xticklabels(station_names, fontsize=9)
ax2.set_ylabel('Pillar score (0-100)', color='white')
ax2.set_title('Three-Pillar Comparison', color='white', fontsize=11)
ax2.axhline(60, color='#22c55e', linewidth=0.8, linestyle='--')
ax2.axhline(40, color='#f59e0b', linewidth=0.8, linestyle='--')
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Detailed breakdown for worst station
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
worst = min(results.items(), key=lambda x: x[1]['whi'])
worst_name, worst_r = worst
all_scores = {**worst_r['wq'], **worst_r['veg'], **worst_r['bio']}
indicators = list(all_scores.keys())
values = list(all_scores.values())
bar_colors = ['#3b82f6']*5 + ['#22c55e']*2 + ['#f59e0b']*2

bars = ax3.barh(indicators, values, color=bar_colors, alpha=0.8, edgecolor='white', linewidth=0.5)
ax3.axvline(60, color='#22c55e', linewidth=1, linestyle='--')
ax3.axvline(40, color='#f59e0b', linewidth=1, linestyle='--')
for bar, val in zip(bars, values):
    ax3.text(val + 1, bar.get_y() + bar.get_height()/2,
            f'{val:.0f}', va='center', color='white', fontsize=9)
ax3.set_xlabel('Score (0-100)', color='white')
ax3.set_title(f'Worst Station: {worst_name} (WHI={worst_r["whi"]:.0f})', color='white', fontsize=11)
ax3.tick_params(colors='gray')
ax3.set_xlim(0, 110)

# Plot 4: Overall WHI ranking
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
sorted_stations = sorted(results.items(), key=lambda x: x[1]['whi'], reverse=True)
names_sorted = [n.split('-')[0] + '\\n' + n.split('-',1)[1][:12] for n, _ in sorted_stations]
whis_sorted = [r['whi'] for _, r in sorted_stations]
bar_colors = ['#22c55e' if w >= 60 else '#f59e0b' if w >= 40 else '#ef4444' for w in whis_sorted]

bars = ax4.barh(range(len(names_sorted)), whis_sorted, color=bar_colors, alpha=0.8,
               edgecolor='white', linewidth=0.5)
ax4.set_yticks(range(len(names_sorted)))
ax4.set_yticklabels(names_sorted, fontsize=8)
ax4.axvline(60, color='#22c55e', linewidth=1, linestyle='--', label='Good')
ax4.axvline(40, color='#f59e0b', linewidth=1, linestyle='--', label='Fair')
for bar, val in zip(bars, whis_sorted):
    ax4.text(val + 1, bar.get_y() + bar.get_height()/2,
            f'{val:.0f}', va='center', color='white', fontsize=10, fontweight='bold')
ax4.set_xlabel('Wetland Health Index', color='white')
ax4.set_title('Station Ranking', color='white', fontsize=11, fontweight='bold')
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')
ax4.invert_yaxis()

plt.tight_layout()
plt.show()

# Print full report
print("=" * 70)
print("     LOKTAK LAKE WETLAND HEALTH INDEX — FULL REPORT")
print("=" * 70)
lake_whi = np.mean([r['whi'] for r in results.values()])
print(f"\\nLake-wide average WHI: {lake_whi:.1f}/100 — {'GOOD' if lake_whi >= 60 else 'FAIR' if lake_whi >= 40 else 'POOR'}")
print()
for name, r in sorted(results.items(), key=lambda x: -x[1]['whi']):
    status = 'GOOD' if r['whi'] >= 60 else 'FAIR' if r['whi'] >= 40 else 'POOR'
    print(f"  {name}: WHI = {r['whi']:.1f} [{status}]")
    print(f"    Water Quality: {r['wq_pillar']:.0f}  Vegetation: {r['veg_pillar']:.0f}  Biodiversity: {r['bio_pillar']:.0f}")

    # Find weakest indicator
    all_sc = {**r['wq'], **r['veg'], **r['bio']}
    weakest = min(all_sc.items(), key=lambda x: x[1])
    print(f"    Weakest indicator: {weakest[0]} = {weakest[1]:.0f}")
    print()

print("MANAGEMENT PRIORITIES:")
for name, r in sorted(results.items(), key=lambda x: x[1]['whi']):
    if r['whi'] < 40:
        all_sc = {**r['wq'], **r['veg'], **r['bio']}
        critical = [k for k, v in all_sc.items() if v < 30]
        print(f"  CRITICAL — {name}: address {', '.join(critical)}")
    elif r['whi'] < 60:
        print(f"  WATCH — {name}: overall fair, monitor closely")

print("\\nThis WHI framework integrates hydrology, chemistry, and ecology")
print("into actionable management intelligence for Loktak Lake.")`,
      challenge: 'Extend the WHI with a temporal component: simulate 5 years of monthly monitoring data for each station. Add trend detection — is each station improving, stable, or declining? Plot the trend lines and flag stations with statistically significant decline.',
      successHint: 'You have built a real environmental decision-support tool. Composite indices like the WHI reduce complex multi-dimensional data into scores that non-scientists (policymakers, community leaders) can understand and act on. The challenge is always balancing scientific rigor with practical usability.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Wetland Health Index from water chemistry, vegetation, and biodiversity data</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a composite environmental index. Click to start.</p>
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
