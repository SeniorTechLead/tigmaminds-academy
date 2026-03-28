import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function RainbowFishLevel4() {
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
      title: 'Capstone — Build a Lake Biodiversity Monitor using species accumulation curves and diversity indices',
      concept: `In this capstone you will build a complete lake biodiversity monitoring system. You will simulate eDNA and traditional survey data from Umiam Lake, compute species accumulation curves to assess sampling completeness, calculate multiple diversity indices (Shannon, Simpson, Chao1), and produce a comprehensive biodiversity report that compares sites and detects changes over time.

Species accumulation curves plot the cumulative number of species detected as sampling effort increases. The curve shape tells you whether you have sampled enough: if it flattens (asymptotes), you have captured most species; if it is still rising steeply, more sampling is needed. The Chao1 estimator uses the number of singletons (species detected once) and doubletons (species detected twice) to estimate total species richness: S_Chao1 = S_obs + (f1² / 2f2), where f1 = singletons and f2 = doubletons.

Diversity is not just richness (number of species) but also evenness (how equitably individuals are distributed). The Shannon index H' = -Σ(pi × ln(pi)) captures both. A community of 10 species with equal abundances has higher H' than one where 95% of individuals belong to a single species. Simpson's index D = 1 - Σ(pi²) measures the probability that two randomly chosen individuals belong to different species. Together, these indices give a multi-dimensional view of biodiversity that no single number can capture.`,
      analogy: 'A species accumulation curve is like reading a new author\'s complete works. The first book introduces many new characters. By the fifth book, fewer new characters appear. By the twentieth, almost every character is familiar. If you plotted "new characters vs books read," the curve would flatten. Diversity indices are like literary criticism — richness counts the characters, but evenness asks whether the story is dominated by one protagonist or gives all characters equal voice.',
      storyConnection: 'Monitoring the rainbow fish of Umiam Lake requires more than just counting one species. The lake harbors an entire community of endemic freshwater life, each species playing a role in the ecosystem that supports the rainbow fish. Your biodiversity monitor will track the health of this entire community — from common species to rare endemics that might disappear before anyone notices.',
      checkQuestion: 'Lake A has 10 species with abundances [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]. Lake B has 10 species with abundances [910, 10, 10, 10, 10, 10, 10, 10, 10, 10]. Both have the same richness. Which has higher Shannon diversity and why?',
      checkAnswer: 'Lake A has higher Shannon diversity. H\'(A) = -10 × (0.1 × ln(0.1)) = 2.30. For Lake B: p1=0.91, p2-10=0.01 each. H\'(B) = -(0.91×ln(0.91) + 9×0.01×ln(0.01)) = -(−0.086 + 9×(−0.046)) = 0.086 + 0.414 = 0.50. Lake A (H\'=2.30) has much higher diversity than Lake B (H\'=0.50) because evenness matters enormously. A lake dominated by one species is functionally less diverse, even with equal richness.',
      codeIntro: 'Build the complete biodiversity monitoring system — species accumulation curves, Chao1 estimation, Shannon and Simpson indices, and a multi-site comparison dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Simulate Umiam Lake fish community data ---
# True species pool with log-normal abundance distribution
n_true_species = 45
true_abundances = np.random.lognormal(mean=4, sigma=1.5, size=n_true_species).astype(int)
true_abundances = np.sort(true_abundances)[::-1]  # sort by abundance
species_names = [f'Species_{i+1}' for i in range(n_true_species)]

# Simulate sampling: each sample detects species with prob ~ abundance
def simulate_survey(true_abundances, n_samples=20, detection_scale=0.001):
    """Simulate species detections across multiple samples."""
    n_species = len(true_abundances)
    detections = np.zeros((n_samples, n_species), dtype=int)
    for s in range(n_samples):
        for sp in range(n_species):
            p_detect = 1 - np.exp(-detection_scale * true_abundances[sp])
            if np.random.random() < p_detect:
                detections[s, sp] = np.random.poisson(max(1, true_abundances[sp] * detection_scale * 10))
    return detections

# Generate data for 3 sites
sites = {
    'Site A — Deep open water': simulate_survey(true_abundances * np.array([1.0 if i < 25 else 0.3 for i in range(n_true_species)]), n_samples=20),
    'Site B — Littoral zone': simulate_survey(true_abundances * np.array([0.5 if i < 15 else 1.5 for i in range(n_true_species)]), n_samples=20),
    'Site C — Degraded margin': simulate_survey(true_abundances * np.array([1.5 if i < 5 else 0.2 for i in range(n_true_species)]), n_samples=20),
}

# --- Biodiversity metrics ---
def species_accumulation(detections):
    """Compute species accumulation curve (randomized order, 100 permutations)."""
    n_samples, n_species = detections.shape
    curves = []
    for _ in range(100):
        order = np.random.permutation(n_samples)
        cumulative = np.zeros(n_species, dtype=bool)
        curve = []
        for i in order:
            cumulative |= (detections[i] > 0)
            curve.append(cumulative.sum())
        curves.append(curve)
    return np.mean(curves, axis=0), np.std(curves, axis=0)

def shannon_index(abundances):
    """Shannon diversity H' = -sum(pi * ln(pi))"""
    total = abundances.sum()
    if total == 0: return 0
    p = abundances[abundances > 0] / total
    return -np.sum(p * np.log(p))

def simpson_index(abundances):
    """Simpson's diversity 1 - sum(pi^2)"""
    total = abundances.sum()
    if total == 0: return 0
    p = abundances[abundances > 0] / total
    return 1 - np.sum(p**2)

def chao1(detections):
    """Chao1 richness estimator."""
    total_per_species = detections.sum(axis=0)
    S_obs = np.sum(total_per_species > 0)
    f1 = np.sum(total_per_species == 1)  # singletons
    f2 = max(np.sum(total_per_species == 2), 1)  # doubletons (avoid /0)
    return S_obs + (f1 * (f1 - 1)) / (2 * (f2 + 1))

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Species accumulation curves
ax = axes[0, 0]
ax.set_facecolor('#111827')
site_colors = ['#3b82f6', '#22c55e', '#f59e0b']
for (name, data), color in zip(sites.items(), site_colors):
    mean_curve, std_curve = species_accumulation(data)
    x = np.arange(1, len(mean_curve) + 1)
    ax.plot(x, mean_curve, color=color, linewidth=2.5, label=name.split('—')[0].strip())
    ax.fill_between(x, mean_curve - std_curve, mean_curve + std_curve, color=color, alpha=0.15)

    # Chao1 estimate
    c1 = chao1(data)
    ax.axhline(c1, color=color, linewidth=1, linestyle=':', alpha=0.5)

ax.axhline(n_true_species, color='#ef4444', linewidth=1.5, linestyle='--',
           label=f'True richness ({n_true_species})')
ax.set_xlabel('Number of samples', color='white')
ax.set_ylabel('Cumulative species detected', color='white')
ax.set_title('Species Accumulation Curves', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Rank-abundance diagrams
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
for (name, data), color in zip(sites.items(), site_colors):
    total_abundance = data.sum(axis=0)
    sorted_ab = np.sort(total_abundance[total_abundance > 0])[::-1]
    ranks = np.arange(1, len(sorted_ab) + 1)
    ax2.semilogy(ranks, sorted_ab, 'o-', color=color, linewidth=2, markersize=4,
                 label=name.split('—')[0].strip())
ax2.set_xlabel('Species rank', color='white')
ax2.set_ylabel('Total abundance (log scale)', color='white')
ax2.set_title('Rank-Abundance Diagrams', color='white', fontsize=11)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Diversity indices comparison
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
site_labels = ['Site A', 'Site B', 'Site C']
shannon_vals = []
simpson_vals = []
richness_vals = []
chao1_vals = []
for name, data in sites.items():
    total_ab = data.sum(axis=0)
    shannon_vals.append(shannon_index(total_ab))
    simpson_vals.append(simpson_index(total_ab))
    richness_vals.append(np.sum(total_ab > 0))
    chao1_vals.append(chao1(data))

x = np.arange(3)
w = 0.2
# Normalize all to 0-1 for comparison
max_H = np.log(n_true_species)  # theoretical max Shannon
bars1 = ax3.bar(x - 1.5*w, np.array(shannon_vals) / max_H, w, color='#3b82f6',
                label=f"Shannon (norm'd)")
bars2 = ax3.bar(x - 0.5*w, simpson_vals, w, color='#22c55e', label='Simpson')
bars3 = ax3.bar(x + 0.5*w, np.array(richness_vals) / n_true_species, w, color='#f59e0b',
                label=f"Richness (frac of {n_true_species})")
bars4 = ax3.bar(x + 1.5*w, np.array(chao1_vals) / n_true_species, w, color='#a855f7',
                label=f"Chao1 (frac of {n_true_species})")

ax3.set_xticks(x)
ax3.set_xticklabels(site_labels, fontsize=10)
ax3.set_ylabel('Normalized index value', color='white')
ax3.set_title('Diversity Index Comparison', color='white', fontsize=11)
ax3.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Temporal monitoring — simulated quarterly surveys over 3 years
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
quarters = np.arange(12)  # 3 years × 4 quarters
quarter_labels = [f'Q{q%4+1}\\nY{q//4+1}' for q in quarters]

# Simulate declining trend at degraded site, stable at others
shannon_temporal = {
    'Site A': 2.5 + 0.05 * np.random.randn(12) + np.linspace(0, 0.1, 12),
    'Site B': 2.8 + 0.08 * np.random.randn(12) + np.linspace(0, -0.05, 12),
    'Site C': 1.8 + 0.1 * np.random.randn(12) + np.linspace(0, -0.5, 12),
}
for (site, values), color in zip(shannon_temporal.items(), site_colors):
    ax4.plot(quarters, values, 'o-', color=color, linewidth=2, markersize=5, label=site)
    # Add trend line
    z = np.polyfit(quarters, values, 1)
    ax4.plot(quarters, np.polyval(z, quarters), '--', color=color, linewidth=1, alpha=0.5)

ax4.set_xticks(quarters)
ax4.set_xticklabels(quarter_labels, fontsize=7)
ax4.set_ylabel("Shannon diversity H'", color='white')
ax4.set_title('Quarterly Biodiversity Monitoring', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Full report
print("=" * 70)
print("     UMIAM LAKE BIODIVERSITY MONITORING REPORT")
print("=" * 70)
print(f"\\nTrue species pool: {n_true_species} species")
print()
for (name, data), sh, si, rich, c1 in zip(sites.items(), shannon_vals, simpson_vals, richness_vals, chao1_vals):
    short = name.split('—')[0].strip()
    print(f"{short} ({name.split('—')[1].strip()}):")
    print(f"  Observed richness:  {rich}")
    print(f"  Chao1 estimate:     {c1:.1f} (sampling completeness: {rich/c1*100:.0f}%)")
    print(f"  Shannon H':         {sh:.3f} (max possible: {np.log(rich):.3f})")
    print(f"  Shannon evenness:   {sh/np.log(rich):.3f}" if rich > 1 else "  Shannon evenness:   N/A")
    print(f"  Simpson 1-D:        {si:.3f}")
    total = data.sum(axis=0)
    singletons = np.sum(total == 1)
    print(f"  Singletons:         {singletons} ({singletons/max(rich,1)*100:.0f}% of observed)")
    print()

print("ASSESSMENT:")
for (name, _), sh_t in zip(sites.items(), shannon_temporal.values()):
    trend = np.polyfit(quarters, list(sh_t.values()) if isinstance(sh_t, dict) else sh_t, 1)[0]
    status = 'DECLINING' if trend < -0.02 else 'STABLE' if abs(trend) < 0.02 else 'IMPROVING'
    short = name.split('—')[0].strip()
    print(f"  {short}: {status} (trend = {trend:+.3f} H'/quarter)")

print("\\nThis monitoring framework combines accumulation analysis, diversity")
print("indices, and temporal trends into actionable conservation intelligence.")`,
      challenge: 'Add beta diversity analysis: compute Jaccard and Bray-Curtis dissimilarity between all pairs of sites. Visualize site similarity using a dendrogram (hierarchical clustering). This tells managers which sites share communities and which are unique.',
      successHint: 'You have built a professional-grade biodiversity monitoring system. The combination of accumulation curves (are we sampling enough?), diversity indices (how diverse is the community?), and temporal trends (is it getting better or worse?) gives managers the complete picture they need to protect Umiam Lake\'s irreplaceable biodiversity.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Lake Biodiversity Monitor with species accumulation curves and diversity indices</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a biodiversity monitoring system. Click to start.</p>
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
