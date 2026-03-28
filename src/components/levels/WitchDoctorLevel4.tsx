import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function WitchDoctorLevel4() {
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
      title: 'Capstone — Build a Medicinal Plant Database with bioactivity prediction',
      concept: `In this capstone you will build a complete medicinal plant database system with machine learning-powered bioactivity prediction. The database stores plants with their phytochemical profiles (alkaloid, terpenoid, phenolic content), traditional uses, and validated bioactivities. The ML model uses k-nearest neighbors (KNN) to predict which diseases a newly discovered plant might treat, based on its chemical similarity to known medicinal plants.

You will implement: (1) A structured database of 50 plants with 8 chemical features each, (2) A KNN classifier that finds the k most chemically similar plants and predicts therapeutic uses by majority vote, (3) A recommendation engine that suggests which plants to investigate for a given disease target, (4) Network visualization showing plant-compound-disease relationships.

The chemical similarity metric uses cosine similarity on standardized phytochemical profiles: sim(A,B) = (A·B)/(|A|×|B|). Plants with similar chemical profiles are expected to share therapeutic properties — this is the principle of chemotaxonomic prediction. You will evaluate this prediction by leave-one-out cross-validation: for each plant, hide its known uses, predict them from neighbors, and compare with ground truth.`,
      analogy: 'The medicinal plant database is like a dating app for drug discovery. Each plant has a profile (chemical features) and preferences (diseases it treats). When a new plant joins (is discovered), the algorithm finds its best matches (most chemically similar plants) and predicts what diseases it might treat based on what its matches treat. The recommendation engine works in reverse — given a disease, it finds the best plant candidates, just like searching for a specific type of person on the app.',
      storyConnection: 'The witch doctor\'s knowledge is the training data — decades of empirical observation about which plants treat which ailments. Your database digitizes this knowledge, and the KNN model extends it: by finding chemical patterns in what the witch doctor already knows, it can predict the therapeutic potential of plants the witch doctor has never tried. The capstone bridges traditional knowledge and computational drug discovery.',
      checkQuestion: 'Your KNN model (k=5) predicts that a newly found plant treats inflammation with 80% confidence (4 of 5 nearest neighbors treat inflammation). The same plant has 60% confidence for antimicrobial and 20% for antidiabetic. How would you prioritize lab testing? What if the 4 neighbors that treat inflammation also share a specific compound not found in the 5th neighbor?',
      checkAnswer: 'Priority: (1) Inflammation — highest confidence at 80%, test first. (2) Antimicrobial — 60% is still strong, test second. (3) Antidiabetic — 20% is weak, low priority. If the 4 inflammation-treating neighbors share a specific compound, that compound is the likely active ingredient for inflammation. Check if the new plant contains it. If yes, confidence increases to near-certainty and you have identified both the therapeutic use AND the responsible compound — a much more valuable finding than just knowing the plant is anti-inflammatory.',
      codeIntro: 'Build a medicinal plant database with KNN-based bioactivity prediction, cross-validation evaluation, and therapeutic recommendation engine.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Medicinal Plant Database ---
n_plants = 50
plant_names = [f'Plant_{i+1}' for i in range(n_plants)]
# Chemical features: alkaloids, terpenoids, phenolics, flavonoids, saponins, tannins, essential_oils, glycosides
feature_names = ['Alkaloids', 'Terpenoids', 'Phenolics', 'Flavonoids', 'Saponins', 'Tannins', 'Essent. oils', 'Glycosides']
n_features = len(feature_names)

# Generate realistic chemical profiles (clustered by plant family)
n_families = 6
family_centers = np.random.uniform(1, 8, (n_families, n_features))
family_labels = np.random.randint(0, n_families, n_plants)
X = np.zeros((n_plants, n_features))
for i in range(n_plants):
    X[i] = family_centers[family_labels[i]] + np.random.normal(0, 1.5, n_features)
X = np.maximum(X, 0)

# Disease labels (multi-label: each plant can treat multiple diseases)
diseases = ['Anti-inflam', 'Antimicrobial', 'Antidiabetic', 'Analgesic',
            'Anticancer', 'Anxiolytic', 'Antihypertens', 'Digestive']
n_diseases = len(diseases)
Y = np.zeros((n_plants, n_diseases), dtype=int)
# Assign based on chemical profiles (certain chemicals → certain activities)
for i in range(n_plants):
    if X[i, 0] > 4: Y[i, 3] = 1; Y[i, 5] = 1  # high alkaloids → analgesic, anxiolytic
    if X[i, 1] > 5: Y[i, 0] = 1; Y[i, 1] = 1   # high terpenoids → anti-inflam, antimicrobial
    if X[i, 2] > 4: Y[i, 0] = 1; Y[i, 4] = 1   # high phenolics → anti-inflam, anticancer
    if X[i, 3] > 5: Y[i, 0] = 1                  # high flavonoids → anti-inflammatory
    if X[i, 4] > 4: Y[i, 2] = 1                  # high saponins → antidiabetic
    if X[i, 5] > 4: Y[i, 1] = 1; Y[i, 7] = 1   # high tannins → antimicrobial, digestive
    if X[i, 6] > 5: Y[i, 1] = 1                  # high essential oils → antimicrobial
    if X[i, 7] > 4: Y[i, 6] = 1                  # high glycosides → antihypertensive
    if Y[i].sum() == 0: Y[i, np.random.randint(n_diseases)] = 1  # at least one use

# Standardize features
X_std = (X - X.mean(axis=0)) / (X.std(axis=0) + 1e-10)

# --- KNN Classifier ---
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10)

def knn_predict(X_train, Y_train, x_query, k=5):
    sims = np.array([cosine_similarity(x_query, x) for x in X_train])
    top_k = np.argsort(sims)[::-1][:k]
    # Weighted vote by similarity
    weights = sims[top_k]
    weighted_votes = np.zeros(Y_train.shape[1])
    for idx, w in zip(top_k, weights):
        weighted_votes += w * Y_train[idx]
    confidence = weighted_votes / (weights.sum() + 1e-10)
    return confidence, top_k, sims[top_k]

# Leave-one-out cross-validation
predictions = np.zeros_like(Y, dtype=float)
for i in range(n_plants):
    mask = np.ones(n_plants, dtype=bool)
    mask[i] = False
    conf, _, _ = knn_predict(X_std[mask], Y[mask], X_std[i], k=5)
    predictions[i] = conf

# Evaluate
threshold = 0.4
Y_pred = (predictions > threshold).astype(int)
per_disease_acc = np.mean(Y_pred == Y, axis=0)
overall_acc = np.mean(Y_pred == Y)

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Chemical profile heatmap (top 20 plants)
ax = axes[0, 0]
ax.set_facecolor('#111827')
show_n = 20
im = ax.imshow(X[:show_n], cmap='YlOrRd', aspect='auto')
ax.set_xticks(range(n_features))
ax.set_xticklabels(feature_names, fontsize=7, rotation=45, ha='right')
ax.set_yticks(range(show_n))
ax.set_yticklabels([f'P{i+1}' for i in range(show_n)], fontsize=7)
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Content level', color='white')
cbar.ax.tick_params(colors='gray')
ax.set_title('Chemical Profiles (Top 20 Plants)', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 2: KNN prediction accuracy by disease
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
colors_acc = ['#22c55e' if a > 0.8 else '#f59e0b' if a > 0.7 else '#ef4444' for a in per_disease_acc]
bars2 = ax2.barh(diseases, per_disease_acc, color=colors_acc, alpha=0.8,
                 edgecolor='white', linewidth=0.5)
for bar, acc in zip(bars2, per_disease_acc):
    ax2.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height()/2,
             f'{acc:.0%}', va='center', color='white', fontsize=10)
ax2.axvline(0.8, color='#fbbf24', linestyle='--', linewidth=1)
ax2.set_xlabel('Prediction accuracy (LOO-CV)', color='white')
ax2.set_title(f'KNN Accuracy by Disease (overall: {overall_acc:.0%})', color='white', fontsize=11, fontweight='bold')
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 1.1)

# Plot 3: Plant similarity network (2D projection)
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Simple PCA-like projection (use top 2 SVD components)
U, S, Vt = np.linalg.svd(X_std, full_matrices=False)
proj = U[:, :2] * S[:2]
# Color by primary therapeutic use
primary_use = np.argmax(Y * predictions, axis=1)
scatter3 = ax3.scatter(proj[:, 0], proj[:, 1], c=primary_use, cmap='Set3',
                       s=60, alpha=0.8, edgecolors='white', linewidths=0.5)
# Draw edges for highly similar plants
for i in range(n_plants):
    for j in range(i+1, n_plants):
        sim = cosine_similarity(X_std[i], X_std[j])
        if sim > 0.85:
            ax3.plot([proj[i,0], proj[j,0]], [proj[i,1], proj[j,1]],
                    color='gray', linewidth=0.5, alpha=0.3)
ax3.set_xlabel('Component 1', color='white')
ax3.set_ylabel('Component 2', color='white')
ax3.set_title('Plant Similarity Network (SVD projection)', color='white', fontsize=11, fontweight='bold')
ax3.tick_params(colors='gray')
# Legend for diseases
for d_idx in range(min(6, n_diseases)):
    ax3.scatter([], [], c=[plt.cm.Set3(d_idx / n_diseases)], s=30, label=diseases[d_idx])
ax3.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=2)

# Plot 4: Recommendation engine — top plants for each disease
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# For each disease, rank plants by prediction confidence
rec_matrix = np.zeros((n_diseases, 5))  # top 5 plants per disease
rec_labels = []
for d in range(n_diseases):
    top5 = np.argsort(predictions[:, d])[::-1][:5]
    rec_matrix[d] = predictions[top5, d]
    rec_labels.append([f'P{idx+1}' for idx in top5])

im4 = ax4.imshow(rec_matrix, cmap='RdYlGn', aspect='auto', vmin=0, vmax=1)
ax4.set_yticks(range(n_diseases))
ax4.set_yticklabels(diseases, fontsize=8)
ax4.set_xticks(range(5))
ax4.set_xticklabels(['Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5'], fontsize=8)
for i in range(n_diseases):
    for j in range(5):
        ax4.text(j, i, f'{rec_labels[i][j]}\\n{rec_matrix[i,j]:.0%}',
                ha='center', va='center', color='white', fontsize=7, fontweight='bold')
ax4.set_title('Top Plant Recommendations by Disease', color='white', fontsize=11, fontweight='bold')
ax4.tick_params(colors='gray')
cbar4 = plt.colorbar(im4, ax=ax4)
cbar4.set_label('Confidence', color='white')
cbar4.ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 65)
print("    MEDICINAL PLANT DATABASE — CAPSTONE REPORT")
print("=" * 65)
print(f"\\nDatabase: {n_plants} plants, {n_features} chemical features, {n_diseases} disease targets")
print(f"Model: KNN (k=5) with cosine similarity")
print(f"\\nLeave-one-out cross-validation results:")
print(f"  Overall accuracy: {overall_acc:.1%}")
print(f"\\nPer-disease accuracy:")
for d, acc in sorted(zip(diseases, per_disease_acc), key=lambda x: -x[1]):
    print(f"  {d:<18}: {acc:.1%}")
print(f"\\nTop recommendations for Anticancer:")
top_ac = np.argsort(predictions[:, 4])[::-1][:5]
for rank, idx in enumerate(top_ac):
    print(f"  #{rank+1}: Plant_{idx+1} (confidence: {predictions[idx,4]:.0%})")
    top_features = np.argsort(X[idx])[::-1][:3]
    print(f"       Key compounds: {', '.join(feature_names[f] for f in top_features)}")
print(f"\\nThe database bridges the witch doctor's empirical knowledge with")
print(f"computational prediction — preserving wisdom and enabling discovery.")`,
      challenge: 'Implement a collaborative filtering approach: instead of using chemical features alone, also use the pattern of known therapeutic uses to predict missing uses (similar to how Netflix recommends movies). Compare the feature-based KNN with the use-based collaborative filter.',
      successHint: 'You have built a complete medicinal plant database with ML-powered prediction — a system that preserves traditional knowledge and extends it computationally. This is how modern ethnobotanical research works: bridging centuries of empirical knowledge with data science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Medicinal Plant Database with KNN-based bioactivity prediction</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a medicinal plant database. Click to start.</p>
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
