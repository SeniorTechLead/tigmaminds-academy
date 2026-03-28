import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function PaperUmbrellaLevel4() {
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
      title: 'Capstone — Build a Paper Strength Predictor using multivariate regression',
      concept: `In this capstone you will build a machine learning model that predicts paper strength from its composition and processing parameters. The model takes six input features: cellulose degree of polymerization (DP), crystallinity index, fiber length (mm), oil coating layers, paper thickness (mm), and moisture content (%). It predicts three output properties: tensile strength (MPa), tear resistance (mN), and fold endurance (cycles).

You will implement multivariate linear regression from scratch using the normal equation: β = (X^T X)^{-1} X^T y. Then you will extend this to polynomial regression by adding interaction terms (e.g., DP × crystallinity, moisture × coating) that capture non-linear relationships. The model will learn that moisture and coating interact — coated paper loses less strength when wet than uncoated paper.

You will evaluate the model using R² score, mean absolute error, and residual analysis. Then you will use the trained model to find the optimal paper recipe for umbrella panels — maximizing the combined score of strength, tear resistance, and fold endurance subject to constraints (cost, availability, weight). This optimization problem mirrors the real engineering challenge faced by the umbrella maker: finding the best trade-off among competing requirements.`,
      analogy: 'A paper strength predictor is like a recipe optimizer for a chef. The chef knows that adding more butter (DP) makes pastry richer, more flour (thickness) makes it sturdier, and too much water (moisture) makes it soggy. But the interactions matter: butter + flour + just a little water = perfect croissant; butter + flour + too much water = paste. Your regression model learns these interactions from data instead of experience.',
      storyConnection: 'The umbrella maker tests paper by touch, sound, and flexibility — decades of experience compressed into intuition. Your predictor model formalizes this intuition into equations, learning from hundreds of paper samples what properties produce the best umbrella panels. The model\'s optimal recipe is the mathematical equivalent of the master maker\'s secret formula.',
      checkQuestion: 'Your model predicts that paper with DP=1200, CI=0.65, fiber=2.5mm, 2 oil coats, 0.3mm thick, 8% moisture has tensile strength 42 MPa. The model coefficient for the DP×moisture interaction term is -0.003. If moisture increases to 15%, how does the interaction term alone change the prediction? Why is this coefficient negative?',
      checkAnswer: 'The interaction term contribution changes from -0.003 × 1200 × 8 = -28.8 to -0.003 × 1200 × 15 = -54.0, a decrease of 25.2 units. The coefficient is negative because moisture and DP interact destructively: longer cellulose chains (high DP) have more hydrogen bonds, and moisture specifically attacks hydrogen bonds. So the damage from moisture is proportionally greater for high-DP paper — the interaction amplifies the degradation beyond what either factor alone would predict.',
      codeIntro: 'Build a multivariate regression model to predict paper strength, find optimal paper recipes for umbrella panels, and visualize the prediction landscape.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate synthetic paper dataset ---
n_samples = 500
# Features: DP, crystallinity, fiber_length(mm), oil_coats, thickness(mm), moisture(%)
DP = np.random.uniform(500, 3000, n_samples)
crystallinity = np.random.uniform(0.3, 0.85, n_samples)
fiber_length = np.random.uniform(0.5, 4.0, n_samples)
oil_coats = np.random.randint(0, 5, n_samples).astype(float)
thickness = np.random.uniform(0.1, 0.8, n_samples)
moisture = np.random.uniform(3, 40, n_samples)

# True relationship (with interactions and noise)
tensile_strength = (
    15 * np.log10(DP) +
    25 * crystallinity +
    8 * fiber_length +
    -0.5 * moisture +
    12 * thickness +
    3 * oil_coats +
    -0.003 * DP * moisture / 100 +
    10 * crystallinity * fiber_length +
    5 * oil_coats * (1 - moisture / 50) +
    np.random.normal(0, 3, n_samples)
)
tensile_strength = np.maximum(tensile_strength, 5)

tear_resistance = (
    200 + 80 * fiber_length**0.8 +
    50 * thickness +
    -2 * moisture +
    20 * oil_coats +
    np.random.normal(0, 20, n_samples)
)
tear_resistance = np.maximum(tear_resistance, 50)

fold_endurance = (
    100 * fiber_length +
    -300 * crystallinity +
    500 * oil_coats +
    -20 * moisture +
    -200 * thickness +
    1000 * np.exp(-0.05 * moisture) +
    np.random.normal(0, 100, n_samples)
)
fold_endurance = np.maximum(fold_endurance, 10)

# Build feature matrix with interactions
X_raw = np.column_stack([DP, crystallinity, fiber_length, oil_coats, thickness, moisture])
feature_names = ['DP', 'Crystallinity', 'Fiber length', 'Oil coats', 'Thickness', 'Moisture']

# Add polynomial and interaction terms
X_poly = np.column_stack([
    X_raw,
    DP * moisture / 1000,           # DP-moisture interaction
    crystallinity * fiber_length,    # CI-fiber interaction
    oil_coats * moisture,            # oil-moisture interaction
    np.log10(DP),                    # log transform
])
poly_names = feature_names + ['DP×Moist', 'CI×Fiber', 'Oil×Moist', 'log(DP)']

# Add intercept
X_design = np.column_stack([np.ones(n_samples), X_poly])

# Train-test split
idx = np.random.permutation(n_samples)
n_train = int(0.7 * n_samples)
X_train, X_test = X_design[idx[:n_train]], X_design[idx[n_train:]]
y_train_ts = tensile_strength[idx[:n_train]]
y_test_ts = tensile_strength[idx[n_train:]]

# --- Multivariate Linear Regression (Normal Equation) ---
def fit_regression(X, y):
    beta = np.linalg.lstsq(X, y, rcond=None)[0]
    return beta

def predict(X, beta):
    return X @ beta

def r_squared(y_true, y_pred):
    ss_res = np.sum((y_true - y_pred)**2)
    ss_tot = np.sum((y_true - np.mean(y_true))**2)
    return 1 - ss_res / ss_tot

beta_ts = fit_regression(X_train, y_train_ts)
y_pred_train = predict(X_train, beta_ts)
y_pred_test = predict(X_test, beta_ts)

r2_train = r_squared(y_train_ts, y_pred_train)
r2_test = r_squared(y_test_ts, y_pred_test)
mae = np.mean(np.abs(y_test_ts - y_pred_test))

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Predicted vs actual
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(y_train_ts, y_pred_train, c='#3b82f6', s=15, alpha=0.4, label=f'Train (R²={r2_train:.3f})')
ax.scatter(y_test_ts, y_pred_test, c='#ef4444', s=20, alpha=0.6, label=f'Test (R²={r2_test:.3f})')
lims = [min(min(y_train_ts), min(y_test_ts)), max(max(y_train_ts), max(y_test_ts))]
ax.plot(lims, lims, '--', color='#fbbf24', linewidth=1.5, label='Perfect prediction')
ax.set_xlabel('Actual tensile strength (MPa)', color='white')
ax.set_ylabel('Predicted tensile strength (MPa)', color='white')
ax.set_title(f'Regression: Predicted vs Actual (MAE={mae:.1f})', color='white', fontsize=11, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Feature importance (coefficient magnitudes, standardized)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
# Standardize coefficients
X_std = X_design[:, 1:].std(axis=0)
X_std[X_std == 0] = 1
std_coefs = beta_ts[1:] * X_std
importance = np.abs(std_coefs)
sorted_idx = np.argsort(importance)
colors_imp = ['#3b82f6' if c > 0 else '#ef4444' for c in std_coefs[sorted_idx]]
ax2.barh([poly_names[i] for i in sorted_idx], importance[sorted_idx],
         color=colors_imp, alpha=0.8, edgecolor='white', linewidth=0.5)
ax2.set_xlabel('|Standardized coefficient|', color='white')
ax2.set_title('Feature Importance for Tensile Strength', color='white', fontsize=11, fontweight='bold')
ax2.tick_params(colors='gray')

# Plot 3: Optimal recipe search
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Grid search for optimal paper recipe
n_grid = 50
dp_grid = np.linspace(800, 2500, n_grid)
moisture_grid = np.linspace(5, 30, n_grid)
DP_G, M_G = np.meshgrid(dp_grid, moisture_grid)

# Fixed: CI=0.65, fiber=2.5, oil=2, thickness=0.3
pred_grid = np.zeros_like(DP_G)
for i in range(n_grid):
    for j in range(n_grid):
        x = [1, DP_G[i,j], 0.65, 2.5, 2, 0.3, M_G[i,j],
             DP_G[i,j]*M_G[i,j]/1000, 0.65*2.5, 2*M_G[i,j], np.log10(DP_G[i,j])]
        pred_grid[i,j] = np.dot(x, beta_ts)

contour = ax3.contourf(DP_G, M_G, pred_grid, levels=20, cmap='RdYlGn')
cbar = plt.colorbar(contour, ax=ax3)
cbar.set_label('Predicted strength (MPa)', color='white')
cbar.ax.tick_params(colors='gray')
# Mark optimum
opt_idx = np.unravel_index(np.argmax(pred_grid), pred_grid.shape)
ax3.plot(DP_G[opt_idx], M_G[opt_idx], '*', color='white', markersize=15, markeredgecolor='black')
ax3.set_xlabel('Degree of polymerization', color='white')
ax3.set_ylabel('Moisture content (%)', color='white')
ax3.set_title('Strength Landscape (CI=0.65, 2 coats)', color='white', fontsize=11, fontweight='bold')
ax3.tick_params(colors='gray')

# Plot 4: Multi-objective optimization
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Fit models for all three targets
beta_tear = fit_regression(X_train, tear_resistance[idx[:n_train]])
beta_fold = fit_regression(X_train, fold_endurance[idx[:n_train]])

# Generate candidate recipes
n_candidates = 1000
cand_dp = np.random.uniform(800, 2500, n_candidates)
cand_ci = np.random.uniform(0.5, 0.8, n_candidates)
cand_fl = np.random.uniform(1.5, 3.5, n_candidates)
cand_oil = np.random.choice([1, 2, 3], n_candidates).astype(float)
cand_th = np.random.uniform(0.2, 0.5, n_candidates)
cand_mo = np.random.uniform(5, 15, n_candidates)

X_cand = np.column_stack([
    np.ones(n_candidates), cand_dp, cand_ci, cand_fl, cand_oil, cand_th, cand_mo,
    cand_dp * cand_mo / 1000, cand_ci * cand_fl, cand_oil * cand_mo, np.log10(cand_dp)
])

pred_ts_c = predict(X_cand, beta_ts)
pred_tr_c = predict(X_cand, beta_tear)
pred_fe_c = predict(X_cand, beta_fold)

# Normalize to 0-1
norm_ts = (pred_ts_c - pred_ts_c.min()) / (pred_ts_c.max() - pred_ts_c.min() + 1e-10)
norm_tr = (pred_tr_c - pred_tr_c.min()) / (pred_tr_c.max() - pred_tr_c.min() + 1e-10)
norm_fe = (pred_fe_c - pred_fe_c.min()) / (pred_fe_c.max() - pred_fe_c.min() + 1e-10)
combined = 0.4 * norm_ts + 0.3 * norm_tr + 0.3 * norm_fe

scatter = ax4.scatter(pred_ts_c, pred_fe_c, c=combined, cmap='plasma', s=15, alpha=0.6)
cbar4 = plt.colorbar(scatter, ax=ax4)
cbar4.set_label('Overall umbrella score', color='white')
cbar4.ax.tick_params(colors='gray')
best_idx = np.argmax(combined)
ax4.plot(pred_ts_c[best_idx], pred_fe_c[best_idx], '*', color='#22c55e',
         markersize=20, markeredgecolor='white', markeredgewidth=1.5)
ax4.set_xlabel('Tensile strength (MPa)', color='white')
ax4.set_ylabel('Fold endurance (cycles)', color='white')
ax4.set_title('Multi-Objective Optimization', color='white', fontsize=11, fontweight='bold')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 65)
print("    PAPER STRENGTH PREDICTOR — CAPSTONE REPORT")
print("=" * 65)
print(f"\\nDataset: {n_samples} samples, {len(poly_names)} features (with interactions)")
print(f"Train/test: {n_train}/{n_samples - n_train}")
print(f"\\nTensile Strength Model:")
print(f"  Train R²: {r2_train:.4f}")
print(f"  Test R²:  {r2_test:.4f}")
print(f"  Test MAE: {mae:.2f} MPa")
print(f"\\nOptimal recipe for umbrella paper:")
print(f"  DP: {cand_dp[best_idx]:.0f}")
print(f"  Crystallinity: {cand_ci[best_idx]:.2f}")
print(f"  Fiber length: {cand_fl[best_idx]:.1f} mm")
print(f"  Oil coats: {cand_oil[best_idx]:.0f}")
print(f"  Thickness: {cand_th[best_idx]:.2f} mm")
print(f"  Moisture: {cand_mo[best_idx]:.1f}%")
print(f"\\nPredicted properties:")
print(f"  Tensile strength: {pred_ts_c[best_idx]:.1f} MPa")
print(f"  Tear resistance: {pred_tr_c[best_idx]:.0f} mN")
print(f"  Fold endurance: {pred_fe_c[best_idx]:.0f} cycles")
print(f"\\nThe predictor formalizes the umbrella maker's intuition into")
print(f"a mathematical model that can optimize paper recipes automatically.")`,
      challenge: 'Implement regularized regression (Ridge and Lasso) and compare their performance. Show how Lasso automatically selects the most important features by driving some coefficients to zero, revealing which paper properties truly matter for umbrella quality.',
      successHint: 'You have built a complete machine learning pipeline — from data generation through feature engineering, model training, evaluation, and multi-objective optimization. The Paper Strength Predictor translates centuries of umbrella-making craft into a data-driven engineering tool.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Paper Strength Predictor using multivariate regression</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a paper strength predictor. Click to start.</p>
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
