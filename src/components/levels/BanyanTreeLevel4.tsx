import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BanyanTreeLevel4() {
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
      title: 'Capstone Design: Tree Age Estimator — from field measurements to age prediction',
      concept: `In Level 3 you learned competition dynamics, aerial root biomechanics, fractal growth, keystone ecology, allometric scaling, and population modeling. Now you build the complete Tree Age Estimator: a system that takes field measurements of any banyan tree and outputs an age estimate with confidence intervals.

The estimator pipeline:
1. **Data collection protocol**: define which measurements to take and how (canopy diameter, pillar root count, total basal area, height, crown density).
2. **Feature engineering**: transform raw measurements into model features (log transforms, interaction terms, derived ratios).
3. **Model training**: fit multiple allometric models (power law, logarithmic, polynomial) on a calibrated dataset.
4. **Model selection**: compare models using cross-validation; select the one with lowest prediction error.
5. **Uncertainty quantification**: bootstrap confidence intervals for each prediction.
6. **Report generation**: output age estimate, confidence interval, measurement quality score, and conservation recommendations.

This is directly useful: conservation agencies need age estimates to prioritize heritage tree protection. A 500-year-old banyan deserves stronger legal protection than a 50-year-old one, but without systematic age estimation, all large banyans look equally old to non-experts.`,
      analogy: 'Building the Tree Age Estimator is like developing a forensic age estimation protocol. Forensic scientists cannot ask a skeleton its age — they measure bone density, tooth wear, cranial suture closure, and joint degeneration. Each measurement gives a rough estimate; together they converge on a precise range. Our tree estimator does the same with canopy, roots, and trunk measurements.',
      storyConnection: 'The ancient banyan in the story was revered as centuries old, but no one knew its true age. The Tree Age Estimator would settle the question scientifically: measure the canopy spread, count the aerial roots, tape the trunk circumference, and let the allometric model translate measurements into years. The tree reverence becomes data-backed — important for legal protection under heritage tree laws.',
      checkQuestion: 'Why do we need multiple measurements rather than just canopy diameter to estimate age reliably?',
      checkAnswer: 'Canopy diameter depends on growing conditions — a banyan in open ground spreads much wider at the same age than one hemmed in by buildings. Total basal area is more environment-independent (it reflects total photosynthetic capacity regardless of shape). Root count increases with age but varies with soil type. By combining multiple measurements, environment-dependent errors in one partially cancel out, reducing overall uncertainty. No single measurement captures age; the ensemble does.',
      codeIntro: 'Build the calibration dataset with realistic measurement variability and train the initial allometric model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# CAPSTONE: Tree Age Estimator
# Stage 1: Calibration Dataset & Initial Model
# ============================================================

class TreeMeasurement:
    """Represents field measurements of a single banyan tree."""

    def __init__(self, canopy_diam, n_pillars, total_basal_area,
                 height, crown_density, known_age=None):
        self.canopy_diam = canopy_diam          # meters
        self.n_pillars = n_pillars              # count
        self.total_basal_area = total_basal_area  # m²
        self.height = height                     # meters
        self.crown_density = crown_density       # 0-1
        self.known_age = known_age               # years (None if unknown)

    def feature_vector(self):
        """Convert to model features (log-transformed)."""
        return np.array([
            np.log(self.canopy_diam + 0.1),
            np.log(self.n_pillars + 1),
            np.log(self.total_basal_area + 0.001),
            np.log(self.height + 0.1),
            self.crown_density,
            np.log(self.canopy_diam + 0.1) * np.log(self.n_pillars + 1),  # interaction
            self.total_basal_area / max(self.canopy_diam**2, 1),  # density ratio
        ])

# --- Generate calibration dataset ---
# 100 trees with known ages (from historical records, radiocarbon, growth ring proxies)
n_cal = 100
cal_ages = np.random.uniform(15, 600, n_cal)
cal_ages.sort()

def simulate_tree(age, noise_level=0.15):
    """Generate realistic measurements for a tree of given age."""
    # Environmental variation
    env = np.random.lognormal(0, noise_level)

    canopy = 2.0 * age**0.45 * env * np.random.uniform(0.8, 1.2)
    pillars = max(0, int(0.015 * age**1.3 * np.random.lognormal(0, 0.3)))
    basal = 0.0008 * age**0.85 * np.random.lognormal(0, 0.2)
    height = 25 * (1 - np.exp(-0.008 * age)) * np.random.uniform(0.85, 1.15)
    density = min(1, 0.3 + 0.5 * (1 - np.exp(-0.01 * age)) + np.random.normal(0, 0.05))

    return TreeMeasurement(canopy, pillars, basal, height, density, age)

trees = [simulate_tree(age) for age in cal_ages]

# Build feature matrix
X = np.array([t.feature_vector() for t in trees])
y = np.array([t.known_age for t in trees])
log_y = np.log(y)

# --- Train multiple models ---
# Model 1: Linear in log space (power law)
X_aug = np.column_stack([np.ones(n_cal), X])
w_linear = np.linalg.lstsq(X_aug, log_y, rcond=None)[0]
pred_linear = np.exp(X_aug @ w_linear)

# Model 2: Polynomial (quadratic terms)
X_quad = np.column_stack([X_aug, X**2])
w_quad = np.linalg.lstsq(X_quad, log_y, rcond=None)[0]
pred_quad = np.exp(X_quad @ w_quad)

# Model 3: Ridge regression (regularized)
lambda_reg = 1.0
XtX = X_aug.T @ X_aug + lambda_reg * np.eye(X_aug.shape[1])
w_ridge = np.linalg.solve(XtX, X_aug.T @ log_y)
pred_ridge = np.exp(X_aug @ w_ridge)

# --- Evaluate each model ---
def eval_model(y_true, y_pred, name):
    residuals = y_true - y_pred
    rmse = np.sqrt(np.mean(residuals**2))
    mae = np.mean(np.abs(residuals))
    mape = np.mean(np.abs(residuals / y_true)) * 100
    ss_res = np.sum(residuals**2)
    ss_tot = np.sum((y_true - np.mean(y_true))**2)
    r2 = 1 - ss_res / ss_tot
    return {'name': name, 'rmse': rmse, 'mae': mae, 'mape': mape, 'r2': r2}

results = [
    eval_model(y, pred_linear, 'Log-linear (power law)'),
    eval_model(y, pred_quad, 'Quadratic'),
    eval_model(y, pred_ridge, 'Ridge regression'),
]

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Model comparison: predicted vs actual
ax0 = axes[0, 0]
for pred, color, name in [(pred_linear, '#22c55e', 'Log-linear'),
                           (pred_quad, '#f59e0b', 'Quadratic'),
                           (pred_ridge, '#3b82f6', 'Ridge')]:
    ax0.scatter(y, pred, s=10, c=color, alpha=0.5, label=name)
ax0.plot([0, 600], [0, 600], '--', color='white', linewidth=1)
ax0.set_xlabel('True age (years)', color='white')
ax0.set_ylabel('Predicted age (years)', color='white')
ax0.set_title('Model comparison', color='white', fontsize=11)
ax0.legend(fontsize=8)

# Residuals
ax1 = axes[0, 1]
for pred, color, name in [(pred_linear, '#22c55e', 'Log-linear'),
                           (pred_ridge, '#3b82f6', 'Ridge')]:
    residuals = y - pred
    ax1.scatter(y, residuals, s=10, c=color, alpha=0.5, label=name)
ax1.axhline(0, color='white', linestyle='--')
ax1.set_xlabel('True age', color='white')
ax1.set_ylabel('Residual (years)', color='white')
ax1.set_title('Residual analysis', color='white', fontsize=11)
ax1.legend(fontsize=8)

# Feature importance
ax2 = axes[1, 0]
feat_names = ['log(canopy)', 'log(pillars)', 'log(basal)', 'log(height)',
              'density', 'canopy×pillars', 'basal/canopy²']
importance = np.abs(w_linear[1:])
sorted_idx = np.argsort(importance)
ax2.barh(range(len(feat_names)), importance[sorted_idx], color='#22c55e')
ax2.set_yticks(range(len(feat_names)))
ax2.set_yticklabels([feat_names[i] for i in sorted_idx], color='white', fontsize=8)
ax2.set_title('Feature importance (|weight|)', color='white', fontsize=11)

# Model metrics table
ax3 = axes[1, 1]
ax3.axis('off')
table_text = "Model Comparison\\n" + "=" * 50 + "\\n"
table_text += f"{'Model':<25} {'R²':>6} {'RMSE':>8} {'MAPE':>7}\\n"
table_text += "-" * 50 + "\\n"
for r in results:
    table_text += f"{r['name']:<25} {r['r2']:>6.3f} {r['rmse']:>7.1f}y {r['mape']:>6.1f}%\\n"
table_text += "-" * 50 + "\\n"
best = min(results, key=lambda r: r['rmse'])
table_text += f"\\nBest model: {best['name']}\\n"
table_text += f"RMSE: {best['rmse']:.1f} years, R²: {best['r2']:.3f}"

ax3.text(0.05, 0.95, table_text, transform=ax3.transAxes,
    fontsize=9.5, fontfamily='monospace', color='#22c55e', va='top',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print("STAGE 1 COMPLETE: Calibration Dataset & Model Training")
print(f"  Calibration trees: {n_cal}")
print(f"  Age range: {cal_ages.min():.0f} - {cal_ages.max():.0f} years")
print(f"  Features: {len(feat_names)}")
print(f"  Best model: {best['name']} (RMSE={best['rmse']:.1f}y, R²={best['r2']:.3f})")`,
      challenge: 'Split the data into trees < 200 years and trees > 200 years. Train separate models for each group. Does specialized modeling improve accuracy for ancient trees?',
      successHint: 'Stage 1 is complete — you have a calibrated model trained on multiple allometric features.',
    },
    {
      title: 'Stage 2: Cross-validation and model selection',
      concept: `In-sample R² is misleading — a complex model can memorize training data perfectly while predicting new data terribly (overfitting). **K-fold cross-validation** gives honest estimates of predictive performance.

Process:
1. Randomly divide the n trees into k roughly equal folds (typically k=5 or 10).
2. For each fold: train on the other k-1 folds, predict on the held-out fold.
3. Combine all held-out predictions and compute metrics.

The cross-validated RMSE tells you how well the model will perform on trees it has never seen — which is exactly the use case (estimating age of new trees).

We compare:
- Log-linear model (7 features)
- Ridge regression (regularized, prevents overfitting)
- Polynomial model (14 features — risk of overfitting)

The model with the lowest cross-validated RMSE wins, regardless of in-sample fit. Simpler models often win cross-validation because they generalize better despite fitting training data less perfectly.

We also check for **age-dependent bias**: does the model systematically overestimate young trees or underestimate old ones? Plotting residuals against true age reveals this.`,
      analogy: 'Cross-validation is like a hiring process with multiple interviews. If you hire based on one interview (in-sample performance), you might pick someone who was lucky that day. If you run five interviews with different panels (5-fold CV), the candidate who performs consistently across all panels is the reliable choice. The model that generalizes across all folds is the one you deploy.',
      storyConnection: 'If we only tested the age estimator on trees we trained it on, we would be like the villagers who only recognized their own banyan. The estimator needs to work on any banyan, anywhere — including ones with unusual growth patterns or environmental conditions. Cross-validation simulates that diversity by ensuring the model is tested on trees it has never seen.',
      checkQuestion: 'Why might a polynomial model with 14 features perform worse in cross-validation than a log-linear model with 7 features, even though it fits the training data better?',
      checkAnswer: 'With 14 features and perhaps 100 training points, the polynomial model has enough flexibility to fit noise — random measurement errors in the training set. These patterns do not repeat in new data, so predictions on held-out folds are poor. The log-linear model, being more constrained, captures the true relationship (power laws) without fitting noise. This is the bias-variance tradeoff: more complex models have lower bias but higher variance.',
      codeIntro: 'Implement k-fold cross-validation, compare all three models, and select the best one with diagnostic plots.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Regenerate calibration data ---
n_cal = 100
cal_ages = np.sort(np.random.uniform(15, 600, n_cal))

def sim_tree_features(age):
    env = np.random.lognormal(0, 0.15)
    canopy = 2.0 * age**0.45 * env * np.random.uniform(0.8, 1.2)
    pillars = max(0, int(0.015 * age**1.3 * np.random.lognormal(0, 0.3)))
    basal = 0.0008 * age**0.85 * np.random.lognormal(0, 0.2)
    height = 25 * (1 - np.exp(-0.008 * age)) * np.random.uniform(0.85, 1.15)
    density = min(1, 0.3 + 0.5 * (1 - np.exp(-0.01 * age)) + np.random.normal(0, 0.05))
    feats = np.array([
        np.log(canopy+0.1), np.log(pillars+1), np.log(basal+0.001),
        np.log(height+0.1), density,
        np.log(canopy+0.1)*np.log(pillars+1),
        basal/max(canopy**2, 1),
    ])
    return feats

X = np.array([sim_tree_features(a) for a in cal_ages])
y = cal_ages
log_y = np.log(y)

# --- K-fold cross-validation ---
def kfold_cv(X_base, y_true, log_y_true, k=5):
    """Run k-fold CV for three model types."""
    n = len(y_true)
    indices = np.random.permutation(n)
    fold_size = n // k

    models_preds = {'Log-linear': np.zeros(n), 'Ridge': np.zeros(n), 'Polynomial': np.zeros(n)}

    for fold in range(k):
        test_idx = indices[fold*fold_size : (fold+1)*fold_size]
        train_idx = np.concatenate([indices[:fold*fold_size], indices[(fold+1)*fold_size:]])

        X_tr, X_te = X_base[train_idx], X_base[test_idx]
        ly_tr = log_y_true[train_idx]

        X_tr_aug = np.column_stack([np.ones(len(X_tr)), X_tr])
        X_te_aug = np.column_stack([np.ones(len(X_te)), X_te])

        # Log-linear
        w = np.linalg.lstsq(X_tr_aug, ly_tr, rcond=None)[0]
        models_preds['Log-linear'][test_idx] = np.exp(X_te_aug @ w)

        # Ridge
        lam = 1.0
        XtX = X_tr_aug.T @ X_tr_aug + lam * np.eye(X_tr_aug.shape[1])
        w_r = np.linalg.solve(XtX, X_tr_aug.T @ ly_tr)
        models_preds['Ridge'][test_idx] = np.exp(X_te_aug @ w_r)

        # Polynomial
        X_tr_poly = np.column_stack([X_tr_aug, X_tr**2])
        X_te_poly = np.column_stack([X_te_aug, X_te**2])
        w_p = np.linalg.lstsq(X_tr_poly, ly_tr, rcond=None)[0]
        models_preds['Polynomial'][test_idx] = np.exp(X_te_poly @ w_p)

    return models_preds

cv_preds = kfold_cv(X, y, log_y, k=5)

# Compute CV metrics
cv_results = {}
for name, preds in cv_preds.items():
    residuals = y - preds
    rmse = np.sqrt(np.mean(residuals**2))
    mae = np.mean(np.abs(residuals))
    mape = np.mean(np.abs(residuals / y)) * 100
    r2 = 1 - np.sum(residuals**2) / np.sum((y - np.mean(y))**2)
    cv_results[name] = {'rmse': rmse, 'mae': mae, 'mape': mape, 'r2': r2, 'preds': preds}

best_model = min(cv_results, key=lambda k: cv_results[k]['rmse'])

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# CV predictions vs true
colors = {'Log-linear': '#22c55e', 'Ridge': '#3b82f6', 'Polynomial': '#f59e0b'}
ax0 = axes[0, 0]
for name, res in cv_results.items():
    ax0.scatter(y, res['preds'], s=10, c=colors[name], alpha=0.5, label=f"{name} (RMSE={res['rmse']:.0f})")
ax0.plot([0, 600], [0, 600], '--', color='white', linewidth=1)
ax0.set_xlabel('True age (years)', color='white')
ax0.set_ylabel('CV predicted age', color='white')
ax0.set_title('Cross-validated predictions', color='white', fontsize=11)
ax0.legend(fontsize=8)

# Residuals by age range
ax1 = axes[0, 1]
best_preds = cv_results[best_model]['preds']
residuals = y - best_preds
ax1.scatter(y, residuals, s=15, c='#22c55e', alpha=0.6)
ax1.axhline(0, color='white', linestyle='--')
# Add loess-like trend
bins = np.linspace(0, 600, 12)
bin_centers = (bins[:-1] + bins[1:]) / 2
bin_means = [np.mean(residuals[(y >= bins[i]) & (y < bins[i+1])]) for i in range(len(bins)-1)]
ax1.plot(bin_centers, bin_means, 'o-', color='#f59e0b', linewidth=2, markersize=6, label='Binned mean')
ax1.set_xlabel('True age', color='white')
ax1.set_ylabel('Residual (years)', color='white')
ax1.set_title(f'Residual analysis ({best_model})', color='white', fontsize=11)
ax1.legend(fontsize=8)

# RMSE comparison
ax2 = axes[1, 0]
model_names = list(cv_results.keys())
rmses = [cv_results[n]['rmse'] for n in model_names]
bar_colors = [colors[n] for n in model_names]
bars = ax2.bar(model_names, rmses, color=bar_colors)
for bar, rmse in zip(bars, rmses):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{rmse:.1f}', ha='center', color='white', fontsize=10)
ax2.set_ylabel('CV RMSE (years)', color='white')
ax2.set_title('Model comparison (lower = better)', color='white', fontsize=11)
for label in ax2.get_xticklabels():
    label.set_color('white')

# Percent error distribution
ax3 = axes[1, 1]
pct_err = np.abs(residuals / y) * 100
ax3.hist(pct_err, bins=25, color='#a855f7', edgecolor='#111827', alpha=0.8)
ax3.axvline(np.median(pct_err), color='#22c55e', linestyle='--', label=f'Median: {np.median(pct_err):.0f}%')
ax3.axvline(np.percentile(pct_err, 90), color='#f59e0b', linestyle='--', label=f'90th: {np.percentile(pct_err, 90):.0f}%')
ax3.set_xlabel('Absolute % error', color='white')
ax3.set_ylabel('Count', color='white')
ax3.set_title(f'Error distribution ({best_model})', color='white', fontsize=11)
ax3.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("STAGE 2 COMPLETE: Cross-Validation & Model Selection")
print("=" * 50)
for name, res in cv_results.items():
    marker = ' *** SELECTED' if name == best_model else ''
    print(f"  {name:15s}: RMSE={res['rmse']:.1f}y, R²={res['r2']:.3f}, MAPE={res['mape']:.1f}%{marker}")
print(f"\\nBest model: {best_model}")
print(f"  Median absolute error: {np.median(np.abs(y-cv_results[best_model]['preds'])):.0f} years")`,
      challenge: 'Implement leave-one-out cross-validation (k=n) and compare its RMSE estimate to 5-fold. Is the additional computation worth the potentially better estimate?',
      successHint: 'Stage 2 is complete — you have a cross-validated model selection with diagnostic plots.',
    },
    {
      title: 'Stage 3: Bootstrap confidence intervals for age predictions',
      concept: `A point estimate of "this tree is 340 years old" is much less useful than "this tree is 340 ± 45 years old (95% CI)." The **bootstrap** provides confidence intervals without requiring distributional assumptions.

Bootstrap procedure:
1. From the calibration dataset of n trees, draw n samples with replacement (some trees appear twice, some not at all).
2. Fit the model on this bootstrap sample.
3. Predict the target tree's age using this bootstrap model.
4. Repeat steps 1-3 B times (typically B=1000).
5. The 2.5th and 97.5th percentiles of the B predictions form the 95% CI.

Why bootstrap works: each resample represents a plausible alternative dataset that could have been collected if we had surveyed different trees. The variation across bootstrap predictions reflects the uncertainty due to limited calibration data.

Bootstrap CIs are wider for:
- **Extrapolation**: predicting ages outside the calibration range (e.g., a 700-year tree when calibration goes to 600).
- **Unusual trees**: trees with measurement combinations not well-represented in calibration data.
- **High-noise features**: when measurement error is large relative to the signal.

The CI width is itself informative: a narrow CI means the measurement pattern strongly constrains age; a wide CI means the measurements are ambiguous.`,
      analogy: 'Bootstrap confidence intervals are like polling uncertainty. If you survey 100 voters and 60% support a candidate, the "true" support might be 55-65%. The bootstrap simulates re-running the poll many times with slightly different samples, revealing how much the 60% might shift. Our age estimate bootstrap does the same: re-training the model on slightly different tree samples reveals how much the age prediction might shift.',
      storyConnection: 'If a conservation agency wants to declare the story banyan a heritage tree (requiring it to be > 200 years old), they need more than a point estimate. A prediction of "280 years (95% CI: 210-370)" confirms heritage status confidently. A prediction of "280 years (95% CI: 150-430)" does not — the tree might be only 150. Bootstrap CIs transform uncertain science into actionable legal evidence.',
      checkQuestion: 'Why does the bootstrap CI widen when predicting age for a tree outside the calibration age range?',
      checkAnswer: 'Extrapolation means the model is projecting allometric relationships beyond where it has data. Different bootstrap samples may include or exclude the few oldest calibration trees, causing the model coefficients to vary substantially in the extrapolation region. Within the calibration range, most samples agree because the relationship is well-constrained by data. Beyond the range, each sample projects differently, producing wide CIs. This is the bootstrap honestly telling you it does not know.',
      codeIntro: 'Implement bootstrap confidence intervals and predict ages for several test trees with uncertainty quantification.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Calibration data ---
n_cal = 100
cal_ages = np.sort(np.random.uniform(15, 600, n_cal))

def sim_features(age):
    env = np.random.lognormal(0, 0.15)
    c = 2.0 * age**0.45 * env * np.random.uniform(0.8, 1.2)
    p = max(0, int(0.015 * age**1.3 * np.random.lognormal(0, 0.3)))
    b = 0.0008 * age**0.85 * np.random.lognormal(0, 0.2)
    h = 25 * (1 - np.exp(-0.008 * age)) * np.random.uniform(0.85, 1.15)
    d = min(1, 0.3 + 0.5 * (1 - np.exp(-0.01 * age)) + np.random.normal(0, 0.05))
    return np.array([np.log(c+0.1), np.log(p+1), np.log(b+0.001), np.log(h+0.1), d,
                     np.log(c+0.1)*np.log(p+1), b/max(c**2, 1)])

X_cal = np.array([sim_features(a) for a in cal_ages])
y_cal = cal_ages
log_y_cal = np.log(y_cal)

# --- Bootstrap prediction ---
def bootstrap_predict(X_cal, log_y_cal, x_new, n_bootstrap=500):
    """Predict age with bootstrap confidence intervals."""
    n = len(log_y_cal)
    predictions = []

    for _ in range(n_bootstrap):
        # Resample with replacement
        idx = np.random.choice(n, size=n, replace=True)
        X_b = X_cal[idx]
        ly_b = log_y_cal[idx]

        # Fit ridge regression
        X_aug = np.column_stack([np.ones(len(X_b)), X_b])
        lam = 1.0
        XtX = X_aug.T @ X_aug + lam * np.eye(X_aug.shape[1])
        w = np.linalg.solve(XtX, X_aug.T @ ly_b)

        # Predict
        x_aug = np.concatenate([[1], x_new])
        pred_log = x_aug @ w
        predictions.append(np.exp(pred_log))

    predictions = np.array(predictions)
    return {
        'point': np.median(predictions),
        'mean': np.mean(predictions),
        'ci_lower': np.percentile(predictions, 2.5),
        'ci_upper': np.percentile(predictions, 97.5),
        'ci_10': np.percentile(predictions, 5),
        'ci_90': np.percentile(predictions, 95),
        'std': np.std(predictions),
        'all_preds': predictions,
    }

# --- Test trees ---
test_trees = [
    {'name': 'Young suburban banyan', 'true_age': 35,
     'canopy': 8, 'pillars': 2, 'basal': 0.05, 'height': 12, 'density': 0.5},
    {'name': 'Mature village banyan', 'true_age': 150,
     'canopy': 25, 'pillars': 30, 'basal': 0.8, 'height': 20, 'density': 0.75},
    {'name': 'Ancient temple banyan', 'true_age': 400,
     'canopy': 55, 'pillars': 200, 'basal': 5.0, 'height': 24, 'density': 0.85},
    {'name': 'Giant roadside banyan', 'true_age': 250,
     'canopy': 40, 'pillars': 80, 'basal': 2.5, 'height': 22, 'density': 0.80},
]

results = []
for t in test_trees:
    feats = np.array([
        np.log(t['canopy']+0.1), np.log(t['pillars']+1), np.log(t['basal']+0.001),
        np.log(t['height']+0.1), t['density'],
        np.log(t['canopy']+0.1)*np.log(t['pillars']+1),
        t['basal']/max(t['canopy']**2, 1),
    ])
    result = bootstrap_predict(X_cal, log_y_cal, feats, n_bootstrap=500)
    result['name'] = t['name']
    result['true_age'] = t['true_age']
    results.append(result)

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Bootstrap distributions
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
for i, (r, color) in enumerate(zip(results, colors)):
    ax = axes[i // 2, i % 2]
    ax.hist(r['all_preds'], bins=30, color=color, edgecolor='#111827', alpha=0.7)
    ax.axvline(r['point'], color='white', linewidth=2, linestyle='-', label=f"Estimate: {r['point']:.0f}y")
    ax.axvline(r['true_age'], color='#ef4444', linewidth=2, linestyle='--', label=f"True: {r['true_age']}y")
    ax.axvline(r['ci_lower'], color=color, linewidth=1, linestyle=':', label=f"95% CI: [{r['ci_lower']:.0f}, {r['ci_upper']:.0f}]")
    ax.axvline(r['ci_upper'], color=color, linewidth=1, linestyle=':')
    ax.set_title(r['name'], color='white', fontsize=10)
    ax.set_xlabel('Predicted age (years)', color='white', fontsize=9)
    ax.legend(fontsize=7)

plt.tight_layout()
plt.show()

print("STAGE 3 COMPLETE: Bootstrap Confidence Intervals")
print("=" * 70)
print(f"{'Tree':<25} {'True':>5} {'Est':>5} {'95% CI':>15} {'Width':>6} {'Covered?':>9}")
print("-" * 70)
for r in results:
    covered = 'YES' if r['ci_lower'] <= r['true_age'] <= r['ci_upper'] else 'NO'
    width = r['ci_upper'] - r['ci_lower']
    print(f"  {r['name']:<23} {r['true_age']:>5} {r['point']:>5.0f} [{r['ci_lower']:>5.0f}, {r['ci_upper']:>5.0f}] {width:>5.0f}y  {covered:>7}")

coverage = sum(1 for r in results if r['ci_lower'] <= r['true_age'] <= r['ci_upper']) / len(results) * 100
print(f"\\nCoverage: {coverage:.0f}% (target: 95%)")`,
      challenge: 'Test the effect of calibration dataset size on CI width: run the bootstrap with n=30, 60, and 100 calibration trees. How does the CI for the ancient temple banyan change? At what n does the CI stabilize?',
      successHint: 'Stage 3 is complete — you have bootstrap confidence intervals for honest uncertainty quantification.',
    },
    {
      title: 'Stage 4: Measurement quality scoring and error propagation',
      concept: `Field measurements are noisy. Canopy diameter is hard to measure under dense cover. Pillar root counting depends on the definition of "pillar" (minimum diameter cutoff). Height estimation from the ground is notoriously inaccurate.

Each measurement has a characteristic error:
- **Canopy diameter**: ±15% (measured by pacing or GPS polygon — irregular canopy outlines)
- **Pillar root count**: ±20% (subjective threshold for "is this a pillar?")
- **Total basal area**: ±10% (tape measure around each trunk — most reliable)
- **Height**: ±25% (clinometer from ground — parallax and canopy obstruction)
- **Crown density**: ±15% (visual estimate — subjective)

**Error propagation** through the model: if each measurement has ±X% error, how much does the age prediction shift? We use Monte Carlo propagation: for each test tree, sample 1000 variations of its measurements (adding noise proportional to measurement uncertainty), predict age for each variation, and compute the prediction spread.

The **measurement quality score** combines:
- Individual measurement precision (known from method)
- Internal consistency (do the measurements agree with allometric expectations?)
- Comparison to calibration data range (is this tree within our calibrated domain?)

A low quality score widens the confidence interval and triggers recommendations for remeasurement.`,
      analogy: 'Error propagation is like a game of telephone with measurements. Each person (measurement step) introduces a small distortion. After five people, the message might be garbled. Monte Carlo propagation simulates the game 1000 times to see how badly the message could be distorted. Some messages (age predictions) are robust — the meaning survives despite noise. Others fall apart. The quality score tells you which case you are in.',
      storyConnection: 'Imagine measuring the story banyan: its canopy is so large you cannot see its edge from the center. Its pillar roots merge into curtains — where does one end and another begin? These measurement challenges are real. The quality score acknowledges the difficulty and adjusts the confidence interval accordingly. Honest uncertainty is more useful than false precision.',
      checkQuestion: 'Why is height measurement error (±25%) less problematic than it sounds for age estimation?',
      checkAnswer: 'Banyan height saturates early — a 100-year-old and a 400-year-old may both be ~22m tall. Once a tree reaches maturity, height adds almost no age information. The model weights for log(height) are correspondingly small. A 25% error in a feature with low weight has minimal impact on the prediction. Canopy diameter and pillar count carry most of the age signal and, fortunately, have lower relative errors.',
      codeIntro: 'Implement Monte Carlo error propagation and measurement quality scoring for the Tree Age Estimator.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Calibration model (from Stage 1) ---
n_cal = 100
cal_ages = np.sort(np.random.uniform(15, 600, n_cal))

def sim_features(age):
    env = np.random.lognormal(0, 0.15)
    c = 2.0 * age**0.45 * env * np.random.uniform(0.8, 1.2)
    p = max(0, int(0.015 * age**1.3 * np.random.lognormal(0, 0.3)))
    b = 0.0008 * age**0.85 * np.random.lognormal(0, 0.2)
    h = 25 * (1 - np.exp(-0.008 * age)) * np.random.uniform(0.85, 1.15)
    d = min(1, 0.3 + 0.5 * (1 - np.exp(-0.01 * age)) + np.random.normal(0, 0.05))
    return c, p, b, h, d

X_raw = np.array([sim_features(a) for a in cal_ages])

def raw_to_features(c, p, b, h, d):
    return np.array([np.log(c+0.1), np.log(p+1), np.log(b+0.001), np.log(h+0.1), d,
                     np.log(c+0.1)*np.log(p+1), b/max(c**2, 1)])

X_cal = np.array([raw_to_features(*row) for row in X_raw])
log_y = np.log(cal_ages)

# Train ridge model
X_aug = np.column_stack([np.ones(n_cal), X_cal])
lam = 1.0
XtX = X_aug.T @ X_aug + lam * np.eye(X_aug.shape[1])
w_model = np.linalg.solve(XtX, X_aug.T @ log_y)

# --- Measurement error model ---
MEASUREMENT_ERRORS = {
    'canopy': 0.15,    # ±15%
    'pillars': 0.20,   # ±20%
    'basal': 0.10,     # ±10%
    'height': 0.25,    # ±25%
    'density': 0.15,   # ±15%
}

def monte_carlo_propagation(canopy, pillars, basal, height, density, n_samples=1000):
    """Propagate measurement errors through the model."""
    predictions = []

    for _ in range(n_samples):
        # Add measurement noise
        c_noisy = max(0.5, canopy * (1 + np.random.normal(0, MEASUREMENT_ERRORS['canopy'])))
        p_noisy = max(0, pillars * (1 + np.random.normal(0, MEASUREMENT_ERRORS['pillars'])))
        b_noisy = max(0.001, basal * (1 + np.random.normal(0, MEASUREMENT_ERRORS['basal'])))
        h_noisy = max(1, height * (1 + np.random.normal(0, MEASUREMENT_ERRORS['height'])))
        d_noisy = np.clip(density + np.random.normal(0, MEASUREMENT_ERRORS['density'] * density), 0, 1)

        feats = raw_to_features(c_noisy, p_noisy, b_noisy, h_noisy, d_noisy)
        x_aug = np.concatenate([[1], feats])
        pred = np.exp(x_aug @ w_model)
        predictions.append(pred)

    predictions = np.array(predictions)
    return predictions

def quality_score(canopy, pillars, basal, height, density):
    """Compute measurement quality score (0-100)."""
    scores = []

    # 1. Allometric consistency: do measurements agree with each other?
    expected_pillars = 0.015 * (canopy / 2.0)**(1.3/0.45)
    pillar_ratio = min(pillars, expected_pillars) / max(pillars, expected_pillars, 1)
    scores.append(pillar_ratio * 30)

    # 2. Calibration range coverage
    cal_canopy = X_raw[:, 0]
    in_range = 1.0 if cal_canopy.min() <= canopy <= cal_canopy.max() else 0.5
    scores.append(in_range * 25)

    # 3. Physical plausibility
    if canopy > 0 and height > 0 and basal > 0:
        scores.append(25)
    else:
        scores.append(0)

    # 4. Measurement precision (assumes standard methods)
    precision_score = 20 * (1 - np.mean(list(MEASUREMENT_ERRORS.values())))
    scores.append(precision_score)

    return min(100, sum(scores))

# --- Test trees ---
test_trees = [
    {'name': 'Well-measured mature tree', 'canopy': 30, 'pillars': 45, 'basal': 1.2, 'height': 21, 'density': 0.78},
    {'name': 'Poorly-measured giant', 'canopy': 60, 'pillars': 300, 'basal': 6.0, 'height': 24, 'density': 0.9},
    {'name': 'Young tree (easy to measure)', 'canopy': 6, 'pillars': 0, 'basal': 0.02, 'height': 8, 'density': 0.4},
    {'name': 'Unusual proportions', 'canopy': 15, 'pillars': 100, 'basal': 3.0, 'height': 18, 'density': 0.7},
]

results = []
for t in test_trees:
    mc_preds = monte_carlo_propagation(t['canopy'], t['pillars'], t['basal'], t['height'], t['density'])
    feats = raw_to_features(t['canopy'], t['pillars'], t['basal'], t['height'], t['density'])
    point_est = np.exp(np.concatenate([[1], feats]) @ w_model)
    qscore = quality_score(t['canopy'], t['pillars'], t['basal'], t['height'], t['density'])

    results.append({
        'name': t['name'],
        'point': point_est,
        'mc_median': np.median(mc_preds),
        'mc_ci_lower': np.percentile(mc_preds, 2.5),
        'mc_ci_upper': np.percentile(mc_preds, 97.5),
        'mc_std': np.std(mc_preds),
        'quality': qscore,
        'mc_preds': mc_preds,
    })

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# MC distributions
colors = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7']
for i, (r, color) in enumerate(zip(results, colors)):
    ax = axes[i // 2, i % 2]
    ax.hist(r['mc_preds'], bins=30, color=color, edgecolor='#111827', alpha=0.7)
    ax.axvline(r['point'], color='white', linewidth=2, label=f"Point: {r['point']:.0f}y")
    ax.axvline(r['mc_ci_lower'], color=color, linestyle=':', label=f"95% CI: [{r['mc_ci_lower']:.0f}, {r['mc_ci_upper']:.0f}]")
    ax.axvline(r['mc_ci_upper'], color=color, linestyle=':')
    q_color = '#22c55e' if r['quality'] > 70 else '#f59e0b' if r['quality'] > 50 else '#ef4444'
    ax.set_title(f"{r['name']} (Q={r['quality']:.0f})", color='white', fontsize=10)
    ax.set_xlabel('Age (years)', color='white', fontsize=9)
    ax.legend(fontsize=7)

plt.tight_layout()
plt.show()

print("STAGE 4 COMPLETE: Measurement Quality & Error Propagation")
print("=" * 75)
print(f"{'Tree':<30} {'Point':>6} {'MC CI (95%)':>18} {'Width':>6} {'Quality':>8}")
print("-" * 75)
for r in results:
    ci_w = r['mc_ci_upper'] - r['mc_ci_lower']
    q_mark = 'GOOD' if r['quality'] > 70 else 'FAIR' if r['quality'] > 50 else 'POOR'
    print(f"  {r['name']:<28} {r['point']:>5.0f}y [{r['mc_ci_lower']:>5.0f}, {r['mc_ci_upper']:>5.0f}] {ci_w:>5.0f}y  {r['quality']:>4.0f} {q_mark}")`,
      challenge: 'Identify which measurement contributes most to prediction uncertainty: run Monte Carlo with only one measurement varied at a time (all others fixed). Which measurement, when uncertain, causes the widest age CI?',
      successHint: 'Stage 4 is complete — you have Monte Carlo error propagation and quality scoring for honest field-deployable predictions.',
    },
    {
      title: 'Stage 5: Heritage classification and conservation recommendations',
      concept: `The Tree Age Estimator is not just an academic exercise — it produces actionable conservation recommendations. Heritage tree laws in many countries and Indian states provide legal protection based on age, size, or ecological significance.

The classification system:
- **Heritage Grade A** (> 300 years, confidence > 80%): Legally protected, no construction within 30m, mandatory monitoring.
- **Heritage Grade B** (100-300 years or Grade A with confidence 50-80%): Protected subject to assessment, buffer zone 15m.
- **Notable** (50-100 years): Registered, considered in planning decisions.
- **Unclassified** (< 50 years or insufficient confidence): No special status.

The estimator must handle **decision uncertainty**: what if the 95% CI spans the boundary between Grade A and Grade B? The system should report the probability of each grade and flag borderline cases for expert review.

Conservation recommendations are generated from the full analysis:
- Age estimate and confidence
- Growth rate assessment (is the tree healthy or declining?)
- Structural integrity (does the pillar root system show adequate redundancy?)
- Ecological significance (estimated species dependency count)
- Threat assessment (proximity to construction, road widening, etc.)

Each recommendation is evidence-backed, traceable to specific measurements and model outputs.`,
      analogy: 'Heritage classification is like a medical diagnosis with treatment recommendations. The doctor does not just say "your cholesterol is 240." They say "your cholesterol is 240 (95% CI: 225-255), which places you in the moderate risk category. Given your age and family history, I recommend dietary changes and monitoring every 6 months." Our estimator does the same: age estimate, confidence, classification, and specific management actions.',
      storyConnection: 'The village banyan in the story was protected by tradition and reverence. But tradition is fragile — a new road or a developer can override it. Heritage classification backed by scientific age estimation gives the tree legal protection. The Tree Age Estimator transforms cultural reverence into legal evidence — much harder to dismiss than "the elders say it is old."',
      checkQuestion: 'Why should the estimator report the probability of each heritage grade rather than just the most likely grade?',
      checkAnswer: 'If a tree has 60% probability of Grade A and 40% probability of Grade B, reporting only "Grade A" hides significant uncertainty. A developer might challenge the classification. Reporting "60% A, 40% B" gives decision-makers the full picture: the tree is almost certainly at least Grade B, and probably Grade A. This honesty actually strengthens protection because it is defensible under scrutiny.',
      codeIntro: 'Build the heritage classification system with probabilistic grade assignment and automated conservation recommendations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Heritage classification with probabilistic grades ---
HERITAGE_GRADES = {
    'Grade A': {'min_age': 300, 'color': '#22c55e', 'protection': 'Full legal protection, 30m buffer'},
    'Grade B': {'min_age': 100, 'color': '#3b82f6', 'protection': 'Protected with assessment, 15m buffer'},
    'Notable': {'min_age': 50,  'color': '#f59e0b', 'protection': 'Registered, planning consideration'},
    'Unclassified': {'min_age': 0, 'color': '#6b7280', 'protection': 'No special status'},
}

def classify_heritage(age_samples):
    """Assign heritage grade probabilities from bootstrap/MC samples."""
    n = len(age_samples)
    probs = {}
    probs['Grade A'] = np.mean(age_samples >= 300)
    probs['Grade B'] = np.mean((age_samples >= 100) & (age_samples < 300))
    probs['Notable'] = np.mean((age_samples >= 50) & (age_samples < 100))
    probs['Unclassified'] = np.mean(age_samples < 50)

    most_likely = max(probs, key=probs.get)
    confidence = probs[most_likely]
    borderline = confidence < 0.7

    return {
        'probabilities': probs,
        'classification': most_likely,
        'confidence': confidence,
        'borderline': borderline,
    }

def generate_recommendations(age_est, ci_lower, ci_upper, quality_score,
                              n_pillars, canopy_diam, classification):
    """Generate conservation recommendations based on full analysis."""
    recs = []

    # Age-based
    if classification['classification'] in ['Grade A', 'Grade B']:
        recs.append(f"PROTECT: Estimated age {age_est:.0f}y ({classification['classification']}) — "
                    f"apply for heritage tree status under state conservation law")

    if classification['borderline']:
        recs.append(f"REVIEW: Classification is borderline ({classification['confidence']:.0%} confidence) — "
                    f"recommend expert dendrochronological assessment")

    # Structural
    if n_pillars > 50:
        recs.append(f"STRUCTURAL: {n_pillars} pillar roots provide good redundancy — "
                    f"monitor for root cutting by construction")
    elif n_pillars > 10:
        recs.append(f"STRUCTURAL: {n_pillars} pillar roots — moderate redundancy. "
                    f"Protect root zone from compaction and cutting")
    else:
        recs.append(f"STRUCTURAL: Only {n_pillars} pillar roots — vulnerable to branch loss. "
                    f"Consider supporting long branches with props")

    # Ecological
    estimated_dependent_species = int(5 + n_pillars * 0.3 + canopy_diam * 0.5)
    recs.append(f"ECOLOGICAL: Estimated {estimated_dependent_species} dependent species — "
                f"{'high' if estimated_dependent_species > 50 else 'moderate'} keystone value")

    # Quality
    if quality_score < 60:
        recs.append(f"REMEASURE: Quality score {quality_score:.0f}/100 — "
                    f"recommend remeasurement with calibrated instruments")

    # Buffer zone
    buffer = 30 if classification['classification'] == 'Grade A' else 15 if classification['classification'] == 'Grade B' else 5
    recs.append(f"BUFFER: Recommend {buffer}m construction-free zone around trunk base")

    return recs

# --- Simulate predictions for 8 trees ---
np.random.seed(42)
trees = [
    {'name': 'Kamakhya Temple Banyan', 'age_est': 420, 'ci_w': 80, 'pillars': 180, 'canopy': 50, 'quality': 85},
    {'name': 'Guwahati University Tree', 'age_est': 180, 'ci_w': 50, 'pillars': 40, 'canopy': 28, 'quality': 75},
    {'name': 'Kaziranga Entry Banyan', 'age_est': 310, 'ci_w': 120, 'pillars': 120, 'canopy': 42, 'quality': 55},
    {'name': 'Jorhat Roadside Giant', 'age_est': 95, 'ci_w': 35, 'pillars': 15, 'canopy': 18, 'quality': 80},
    {'name': 'Majuli Sacred Grove Tree', 'age_est': 550, 'ci_w': 150, 'pillars': 350, 'canopy': 65, 'quality': 60},
    {'name': 'Sivasagar Palace Banyan', 'age_est': 250, 'ci_w': 90, 'pillars': 70, 'canopy': 35, 'quality': 70},
    {'name': 'Tezpur Park Young Tree', 'age_est': 40, 'ci_w': 15, 'pillars': 3, 'canopy': 10, 'quality': 90},
    {'name': 'Dibrugarh Market Banyan', 'age_est': 130, 'ci_w': 45, 'pillars': 25, 'canopy': 22, 'quality': 72},
]

all_results = []
for t in trees:
    # Simulate age distribution
    samples = np.random.normal(t['age_est'], t['ci_w']/3.92, 2000)  # 95% CI ~ 3.92 sigma
    samples = np.maximum(samples, 5)

    cls = classify_heritage(samples)
    ci_l = np.percentile(samples, 2.5)
    ci_u = np.percentile(samples, 97.5)
    recs = generate_recommendations(t['age_est'], ci_l, ci_u, t['quality'],
                                     t['pillars'], t['canopy'], cls)

    all_results.append({**t, 'classification': cls, 'ci_lower': ci_l, 'ci_upper': ci_u,
                        'recommendations': recs, 'samples': samples})

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Classification overview
ax0 = axes[0, 0]
names = [r['name'].split()[-2] + ' ' + r['name'].split()[-1] for r in all_results]
age_ests = [r['age_est'] for r in all_results]
ci_lows = [r['ci_lower'] for r in all_results]
ci_highs = [r['ci_upper'] for r in all_results]
cls_colors = [HERITAGE_GRADES[r['classification']['classification']]['color'] for r in all_results]

y_pos = range(len(all_results))
ax0.barh(y_pos, age_ests, color=cls_colors, alpha=0.7)
ax0.errorbar(age_ests, y_pos, xerr=[np.array(age_ests)-np.array(ci_lows), np.array(ci_highs)-np.array(age_ests)],
             fmt='none', color='white', capsize=3, linewidth=1)
ax0.set_yticks(y_pos)
ax0.set_yticklabels(names, color='white', fontsize=8)
ax0.axvline(300, color='#22c55e', linestyle='--', alpha=0.5, label='Grade A (300y)')
ax0.axvline(100, color='#3b82f6', linestyle='--', alpha=0.5, label='Grade B (100y)')
ax0.axvline(50, color='#f59e0b', linestyle='--', alpha=0.5, label='Notable (50y)')
ax0.set_xlabel('Estimated age (years)', color='white')
ax0.set_title('Heritage classification with 95% CI', color='white', fontsize=11)
ax0.legend(fontsize=7)

# Grade probability heatmap
ax1 = axes[0, 1]
grade_names = list(HERITAGE_GRADES.keys())
prob_matrix = np.array([[r['classification']['probabilities'][g] for g in grade_names] for r in all_results])
im = ax1.imshow(prob_matrix, cmap='YlGn', aspect='auto', vmin=0, vmax=1)
ax1.set_xticks(range(len(grade_names)))
ax1.set_xticklabels(grade_names, color='white', fontsize=8, rotation=30)
ax1.set_yticks(y_pos)
ax1.set_yticklabels(names, color='white', fontsize=8)
for i in range(len(all_results)):
    for j in range(len(grade_names)):
        val = prob_matrix[i, j]
        if val > 0.05:
            ax1.text(j, i, f'{val:.0%}', ha='center', va='center', color='white' if val > 0.5 else 'gray', fontsize=8)
ax1.set_title('Grade probabilities', color='white', fontsize=11)
plt.colorbar(im, ax=ax1, shrink=0.8)

# Borderline cases
ax2 = axes[1, 0]
borderline_trees = [r for r in all_results if r['classification']['borderline']]
if borderline_trees:
    for i, r in enumerate(borderline_trees):
        ax2.hist(r['samples'], bins=40, alpha=0.5, label=r['name'].split()[-2])
    for age_thresh, color in [(300, '#22c55e'), (100, '#3b82f6'), (50, '#f59e0b')]:
        ax2.axvline(age_thresh, color=color, linestyle='--', linewidth=2)
    ax2.set_xlabel('Age (years)', color='white')
    ax2.set_title('Borderline cases (need expert review)', color='white', fontsize=11)
    ax2.legend(fontsize=8)
else:
    ax2.text(0.5, 0.5, 'No borderline cases', color='gray', ha='center', va='center', transform=ax2.transAxes, fontsize=14)
    ax2.set_title('Borderline cases', color='white', fontsize=11)

# Recommendations summary
ax3 = axes[1, 1]
ax3.axis('off')
rec_text = "TOP RECOMMENDATIONS\\n" + "=" * 45 + "\\n"
for r in sorted(all_results, key=lambda x: x['age_est'], reverse=True)[:4]:
    grade = r['classification']['classification']
    rec_text += f"\\n{r['name']} ({grade}):\\n"
    for rec in r['recommendations'][:2]:
        rec_text += f"  - {rec[:60]}\\n"

ax3.text(0.02, 0.98, rec_text, transform=ax3.transAxes, color='#e2e8f0',
    fontsize=7.5, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#334155'))
ax3.set_title('Conservation recommendations', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("STAGE 5 COMPLETE: Heritage Classification & Recommendations")
n_gradeA = sum(1 for r in all_results if r['classification']['classification'] == 'Grade A')
n_borderline = sum(1 for r in all_results if r['classification']['borderline'])
print(f"  Trees assessed: {len(all_results)}")
print(f"  Grade A: {n_gradeA}, Borderline: {n_borderline}")`,
      challenge: 'Add a "threat proximity" layer: assign each tree a distance to the nearest planned construction project. Trees with high heritage grade AND close threat proximity should be flagged as "URGENT" in the recommendations. How many of the 8 trees become urgent?',
      successHint: 'Stage 5 is complete — you have probabilistic heritage classification with evidence-backed conservation recommendations.',
    },
    {
      title: 'Stage 6: Complete report generation and system documentation',
      concept: `The final stage produces the deliverable: a comprehensive Tree Age Estimator report for each assessed banyan. The report includes all six pipeline stages, from raw measurements to conservation recommendations, with full traceability.

A professional report must be:
- **Self-contained**: anyone can understand the conclusions without running the code.
- **Traceable**: every conclusion links back to specific measurements and model outputs.
- **Honest**: uncertainty is prominently displayed, not hidden.
- **Actionable**: recommendations are specific enough for a conservation officer to act on.
- **Reproducible**: parameters are documented so the analysis can be rerun.

The report also includes a **methodology limitations** section:
- Allometric models are calibrated on a specific geographic region; applying them to banyans in different climates may introduce bias.
- The model assumes natural growth; human interventions (pruning, root cutting, irrigation) violate the allometric assumptions.
- Very young (< 20 years) and very old (> 500 years) trees are poorly represented in calibration data.
- Measurement methods vary between surveyors; inter-observer reliability is not quantified.

This is real conservation science: rigorous analysis presented honestly for decision-makers who may not understand the statistics but need to trust the conclusions.`,
      analogy: 'The final report is like an appraisal report for a historic building. The appraiser does not just say "this building is valuable." They document the construction date evidence, architectural significance, structural condition, comparable valuations, uncertainty ranges, and specific recommendations for preservation. Our report does the same for a living heritage tree.',
      storyConnection: 'The story banyan has been protected by community sentiment for generations. But development pressure is increasing. A scientific report — with age estimate, confidence interval, heritage classification, ecological value, and specific protection recommendations — transforms community sentiment into legal-grade evidence. The report is the bridge between the story reverence and modern conservation law.',
      checkQuestion: 'Why must the report include methodology limitations even when the model performs well?',
      checkAnswer: 'A model that works well in Assam may fail in Kerala because rainfall, soil, and temperature differences alter allometric relationships. Without stating this limitation, a conservation agency might apply the model inappropriately and make wrong decisions. Similarly, if someone pruned a tree extensively, its canopy diameter would underpredict its age. Stating limitations protects both the trees (from under-classification) and the scientists (from overconfident claims). Honest science is credible science.',
      codeIntro: 'Generate the complete Tree Age Estimator report with all stages, visualizations, and documentation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# CAPSTONE COMPLETE: Full Report Generation
# ============================================================

# Simulated assessment results
tree_report = {
    'name': 'Great Banyan of Kamakhya',
    'location': 'Kamakhya Temple grounds, Guwahati, Assam',
    'gps': '26.1664°N, 91.7042°E',
    'survey_date': '2024-02-15',
    'measurements': {
        'canopy_diameter': 52.3,
        'pillar_roots': 185,
        'total_basal_area': 4.8,
        'height': 23.5,
        'crown_density': 0.87,
    },
    'age_estimate': 420,
    'ci_95': (345, 510),
    'model': 'Ridge regression (CV RMSE=42y)',
    'quality_score': 85,
    'heritage': {'grade': 'Grade A', 'confidence': 0.89, 'borderline': False},
    'grade_probs': {'Grade A': 0.89, 'Grade B': 0.11, 'Notable': 0.0, 'Unclassified': 0.0},
}

# --- Generate comprehensive report ---
fig = plt.figure(figsize=(16, 22))
fig.patch.set_facecolor('#1f2937')

# 1. Title
ax_title = fig.add_subplot(6, 2, (1, 2))
ax_title.set_facecolor('#0d1117')
ax_title.axis('off')
title_text = f"""TREE AGE ESTIMATOR — ASSESSMENT REPORT
{'='*50}
Tree:      {tree_report['name']}
Location:  {tree_report['location']}
GPS:       {tree_report['gps']}
Survey:    {tree_report['survey_date']}
Assessor:  TigmaMinds Academy Field Team

AGE ESTIMATE:  {tree_report['age_estimate']} years
95% CI:        [{tree_report['ci_95'][0]}, {tree_report['ci_95'][1]}] years
HERITAGE:      {tree_report['heritage']['grade']} ({tree_report['heritage']['confidence']:.0%} confidence)
QUALITY:       {tree_report['quality_score']}/100"""

ax_title.text(0.5, 0.5, title_text, transform=ax_title.transAxes,
    fontsize=9.5, fontfamily='monospace', color='#22c55e', va='center', ha='center',
    bbox=dict(boxstyle='round,pad=0.8', facecolor='#0d1117', edgecolor='#22c55e'))

# 2. Measurements radar chart (approximated with bar chart)
ax_meas = fig.add_subplot(6, 2, 3)
ax_meas.set_facecolor('#111827')
ax_meas.tick_params(colors='gray')
meas = tree_report['measurements']
meas_names = list(meas.keys())
meas_vals = list(meas.values())
# Normalize to 0-1 for display
meas_max = [80, 400, 8, 30, 1]
meas_norm = [v/m for v, m in zip(meas_vals, meas_max)]
bars = ax_meas.barh(range(len(meas_names)), meas_norm, color='#22c55e', alpha=0.7)
ax_meas.set_yticks(range(len(meas_names)))
labels = ['Canopy (52.3m)', 'Pillars (185)', 'Basal (4.8m²)', 'Height (23.5m)', 'Density (0.87)']
ax_meas.set_yticklabels(labels, color='white', fontsize=8)
ax_meas.set_xlim(0, 1.2)
ax_meas.set_title('Measurements (normalized)', color='white', fontsize=10)

# 3. Age distribution
ax_age = fig.add_subplot(6, 2, 4)
ax_age.set_facecolor('#111827')
ax_age.tick_params(colors='gray')
age_samples = np.random.normal(420, (510-345)/3.92, 2000)
ax_age.hist(age_samples, bins=40, color='#22c55e', edgecolor='#111827', alpha=0.7)
ax_age.axvline(420, color='white', linewidth=2, label='Point estimate')
ax_age.axvline(345, color='#f59e0b', linestyle='--', label='95% CI bounds')
ax_age.axvline(510, color='#f59e0b', linestyle='--')
ax_age.axvline(300, color='#ef4444', linestyle=':', linewidth=2, label='Grade A threshold')
ax_age.set_xlabel('Age (years)', color='white')
ax_age.set_title('Bootstrap age distribution', color='white', fontsize=10)
ax_age.legend(fontsize=7)

# 4. Heritage grade probabilities
ax_grade = fig.add_subplot(6, 2, 5)
ax_grade.set_facecolor('#111827')
ax_grade.tick_params(colors='gray')
grades = list(tree_report['grade_probs'].keys())
probs = list(tree_report['grade_probs'].values())
grade_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#6b7280']
ax_grade.bar(grades, probs, color=grade_colors)
for i, p in enumerate(probs):
    if p > 0.01:
        ax_grade.text(i, p + 0.02, f'{p:.0%}', ha='center', color='white', fontsize=10)
ax_grade.set_ylabel('Probability', color='white')
ax_grade.set_title('Heritage grade probabilities', color='white', fontsize=10)
for label in ax_grade.get_xticklabels():
    label.set_color('white')
    label.set_fontsize(8)

# 5. Quality assessment
ax_qual = fig.add_subplot(6, 2, 6)
ax_qual.set_facecolor('#111827')
ax_qual.tick_params(colors='gray')
qual_components = ['Allometric\nconsistency', 'Calibration\nrange', 'Physical\nplausibility', 'Measurement\nprecision']
qual_scores = [28, 25, 25, 17]  # out of 30, 25, 25, 20
qual_maxes = [30, 25, 25, 20]
colors_q = ['#22c55e' if s/m > 0.8 else '#f59e0b' if s/m > 0.6 else '#ef4444' for s, m in zip(qual_scores, qual_maxes)]
ax_qual.bar(range(len(qual_components)), qual_scores, color=colors_q, alpha=0.7)
ax_qual.bar(range(len(qual_components)), qual_maxes, color='gray', alpha=0.2)
ax_qual.set_xticks(range(len(qual_components)))
ax_qual.set_xticklabels(qual_components, color='white', fontsize=7)
ax_qual.set_ylabel('Score', color='white')
ax_qual.set_title(f'Quality assessment ({tree_report["quality_score"]}/100)', color='white', fontsize=10)

# 6. Allometric fit visualization
ax_allo = fig.add_subplot(6, 2, (7, 8))
ax_allo.set_facecolor('#111827')
ax_allo.tick_params(colors='gray')
# Simulated calibration data
cal_canopy = 2.0 * np.sort(np.random.uniform(15, 600, 80))**0.45 * np.random.lognormal(0, 0.15, 80)
cal_age = np.sort(np.random.uniform(15, 600, 80))
ax_allo.scatter(cal_canopy, cal_age, s=15, c='gray', alpha=0.4, label='Calibration trees')
ax_allo.scatter(52.3, 420, s=200, c='#22c55e', marker='*', zorder=5, label='This tree')
ax_allo.errorbar(52.3, 420, yerr=[[420-345], [510-420]], color='#22c55e', capsize=5, linewidth=2)
x_fit = np.linspace(2, 80, 100)
ax_allo.plot(x_fit, (x_fit/2.0)**(1/0.45), color='#f59e0b', linewidth=1.5, label='Allometric fit')
ax_allo.set_xlabel('Canopy diameter (m)', color='white')
ax_allo.set_ylabel('Age (years)', color='white')
ax_allo.set_title('Allometric context', color='white', fontsize=10)
ax_allo.legend(fontsize=8)

# 7. Recommendations
ax_rec = fig.add_subplot(6, 2, (9, 10))
ax_rec.set_facecolor('#0d1117')
ax_rec.axis('off')
rec_text = """CONSERVATION RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PROTECT: Grade A heritage tree (89% confidence) — apply for legal protection
   under Assam Heritage Tree Conservation Act. Priority: HIGH.

2. BUFFER ZONE: Establish 30m construction-free perimeter around trunk base.
   Mark with permanent boundary markers.

3. STRUCTURAL: 185 pillar roots provide excellent structural redundancy.
   Monitor quarterly for unauthorized root cutting.

4. ECOLOGICAL: Estimated 75+ dependent species (high keystone value).
   Conduct baseline biodiversity survey within 6 months.

5. MONITORING: Install canopy health sensors. Annual re-measurement
   to track growth trajectory and detect decline early.

6. COMMUNITY: Engage temple management as co-stewards. Document
   traditional knowledge about the tree's history and cultural significance."""

ax_rec.text(0.05, 0.95, rec_text, transform=ax_rec.transAxes,
    fontsize=8.5, fontfamily='monospace', color='#e2e8f0', va='top',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

# 8. Limitations
ax_lim = fig.add_subplot(6, 2, (11, 12))
ax_lim.set_facecolor('#0d1117')
ax_lim.axis('off')
lim_text = """METHODOLOGY & LIMITATIONS
━━━━━━━━━━━━━━━━━━━━━━━━
Model:     Ridge regression on 7 allometric features (log-transformed)
Training:  100 calibration trees (Assam region, 15-600 years)
CV RMSE:   42 years (5-fold cross-validation)
Bootstrap: 500 resamples for confidence intervals

Limitations:
  • Calibration data from Assam lowlands — highland banyans may differ
  • No correction for human interventions (pruning, irrigation, root cutting)
  • Height measurement via clinometer (±25% error) — low information content
  • Crown density is subjective — inter-observer reliability not quantified
  • Model extrapolates beyond 600 years with unknown accuracy

Reproducibility:
  • Ridge lambda = 1.0, bootstrap n = 500, random seed = 42
  • All measurements in metric units (SI)
  • Report generated by Tree Age Estimator v1.0"""

ax_lim.text(0.05, 0.95, lim_text, transform=ax_lim.transAxes,
    fontsize=8.5, fontfamily='monospace', color='#fbbf24', va='top',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#fbbf24', alpha=0.8))

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built a Tree Age Estimator from scratch:")
print("  1. Calibration dataset with realistic allometric relationships")
print("  2. Cross-validated model selection (3 model types compared)")
print("  3. Bootstrap confidence intervals for honest uncertainty")
print("  4. Monte Carlo error propagation with quality scoring")
print("  5. Heritage classification with probabilistic grade assignment")
print("  6. Comprehensive report with recommendations and limitations")
print()
print("Skills demonstrated: allometric scaling, regression, cross-validation,")
print("bootstrap inference, error propagation, classification, conservation")
print("science, scientific reporting.")`,
      challenge: 'Build a batch assessment mode: generate 50 random trees, assess all of them, and produce a summary dashboard showing the distribution of heritage grades across the population. What fraction of the region banyan population qualifies as Grade A?',
      successHint: 'You have completed a full capstone project: from field measurements to a documented heritage classification report. This is the shape of real conservation science — combining ecology, statistics, and policy into actionable recommendations. The Tree Age Estimator is portfolio-ready.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (ecology and biomechanics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Tree Age Estimator. Click to start.</p>
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
