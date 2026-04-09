import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import BanyanInventoryDiagram from '../diagrams/BanyanInventoryDiagram';
import BanyanBiomassModelDiagram from '../diagrams/BanyanBiomassModelDiagram';
import BanyanCarbonPoolDiagram from '../diagrams/BanyanCarbonPoolDiagram';
import BanyanGrowthModelDiagram from '../diagrams/BanyanGrowthModelDiagram';
import BanyanConservationDiagram from '../diagrams/BanyanConservationDiagram';
import BanyanMonitoringDiagram from '../diagrams/BanyanMonitoringDiagram';

export default function BanyanTreeLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

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
    return TreeMeasurement(canopy, pillars, basal, height, density, known_age=age)

calibration_trees = [simulate_tree(a) for a in cal_ages]
X = np.array([t.feature_vector() for t in calibration_trees])
log_y = np.log(cal_ages)

# Fit ridge regression: log(age) = X @ w
X_aug = np.column_stack([np.ones(n_cal), X])
lam = 1.0
XtX = X_aug.T @ X_aug + lam * np.eye(X_aug.shape[1])
w = np.linalg.solve(XtX, X_aug.T @ log_y)

# Predict and evaluate
pred_log = X_aug @ w
pred_ages = np.exp(pred_log)
residuals = cal_ages - pred_ages
rmse = np.sqrt(np.mean(residuals**2))
mae = np.mean(np.abs(residuals))

print("Tree Age Estimator — Stage 1: Calibration")
print("=" * 50)
print(f"Calibration trees: {n_cal}")
print(f"Age range: {cal_ages.min():.0f} to {cal_ages.max():.0f} years")
print(f"Features: 7 (log-transformed allometrics + interactions)")
print(f"Model: Ridge regression (lambda={lam})")
print()
print(f"Training RMSE: {rmse:.1f} years")
print(f"Training MAE:  {mae:.1f} years")
print(f"Relative error: {np.mean(np.abs(residuals)/cal_ages)*100:.1f}%")
print()
print("Feature weights (regression coefficients):")
names = ['bias', 'log(canopy)', 'log(pillars)', 'log(basal)', 'log(height)',
         'crown_density', 'canopy*pillars', 'basal_density']
for n, c in zip(names, w):
    print(f"  {n:20s}: {c:+.4f}")
print()
print("Sample predictions:")
for i in [0, 25, 50, 75, 99]:
    print(f"  Tree {i}: actual={cal_ages[i]:.0f}y, predicted={pred_ages[i]:.0f}y, "
          f"error={residuals[i]:+.0f}y")`,
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

        # Ridge regression (lambda=1)
        lam = 1.0
        XtX = X_tr_aug.T @ X_tr_aug + lam * np.eye(X_tr_aug.shape[1])
        w_r = np.linalg.solve(XtX, X_tr_aug.T @ ly_tr)
        models_preds['Ridge'][test_idx] = np.exp(X_te_aug @ w_r)

        # Polynomial (degree 2 on top features)
        X_tr_poly = np.column_stack([X_tr, X_tr[:, :3]**2])
        X_te_poly = np.column_stack([X_te, X_te[:, :3]**2])
        X_tr_poly_aug = np.column_stack([np.ones(len(X_tr_poly)), X_tr_poly])
        X_te_poly_aug = np.column_stack([np.ones(len(X_te_poly)), X_te_poly])
        w_p = np.linalg.lstsq(X_tr_poly_aug, ly_tr, rcond=None)[0]
        models_preds['Polynomial'][test_idx] = np.exp(X_te_poly_aug @ w_p)

    return models_preds

cv_preds = kfold_cv(X, y, log_y, k=5)

print("Tree Age Estimator — Stage 2: Cross-Validation")
print("=" * 50)
print(f"Method: {5}-fold cross-validation on {len(y)} trees")
print()
best_rmse = float('inf')
best_model = ''
for model_name, preds in cv_preds.items():
    rmse = np.sqrt(np.mean((preds - y)**2))
    mae = np.mean(np.abs(preds - y))
    rel_err = np.mean(np.abs(preds - y) / y) * 100
    if rmse < best_rmse:
        best_rmse = rmse
        best_model = model_name
    print(f"{model_name}:")
    print(f"  CV RMSE: {rmse:.1f} years")
    print(f"  CV MAE:  {mae:.1f} years")
    print(f"  Mean relative error: {rel_err:.1f}%")
    print()
print(f"Best model: {best_model} (RMSE = {best_rmse:.1f} years)")
print()
print("Sample predictions (Ridge):")
ridge_preds = cv_preds['Ridge']
for i in [0, 25, 50, 75, 99]:
    print(f"  Tree {i}: actual={y[i]:.0f}y, predicted={ridge_preds[i]:.0f}y")`,
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
        'std': np.std(predictions),
        'samples': predictions,
    }

# Test trees with known properties
test_trees = [
    ('Young roadside banyan', 30),
    ('Village square banyan', 120),
    ('Temple compound banyan', 280),
    ('Ancient heritage banyan', 450),
]

print("Tree Age Estimator — Stage 3: Bootstrap Prediction")
print("=" * 55)
print(f"Bootstrap iterations: 500")
print(f"Calibration set: {n_cal} trees")
print()

for name, true_age in test_trees:
    x_new = sim_features(true_age)
    result = bootstrap_predict(X_cal, log_y_cal, x_new, n_bootstrap=500)
    ci_width = result['ci_upper'] - result['ci_lower']
    print(f"{name} (true age: {true_age}y):")
    print(f"  Point estimate: {result['point']:.0f} years")
    print(f"  95% CI: [{result['ci_lower']:.0f}, {result['ci_upper']:.0f}] years")
    print(f"  CI width: {ci_width:.0f} years ({ci_width/result['point']*100:.0f}% of estimate)")
    print(f"  True age {'inside' if result['ci_lower'] <= true_age <= result['ci_upper'] else 'OUTSIDE'} CI")
    print()

print("Key insight: uncertainty grows with age — ancient trees have wider CIs")
print("because the calibration data is sparser at extreme ages.")`,
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
        d_noisy = min(1, max(0, density * (1 + np.random.normal(0, MEASUREMENT_ERRORS['density']))))

        x = raw_to_features(c_noisy, p_noisy, b_noisy, h_noisy, d_noisy)
        x_aug = np.concatenate([[1], x])
        pred = np.exp(x_aug @ w_model)
        predictions.append(pred)

    predictions = np.array(predictions)
    return {
        'point': np.median(predictions),
        'ci_lower': np.percentile(predictions, 2.5),
        'ci_upper': np.percentile(predictions, 97.5),
        'std': np.std(predictions),
    }

def quality_score(canopy, pillars, basal, height, density):
    """Score measurement quality 0-100 based on consistency checks."""
    score = 100
    if canopy < 5: score -= 20     # suspiciously small
    if pillars == 0: score -= 15    # no pillars counted?
    if height > 30: score -= 10     # banyans rarely exceed 30m
    if density < 0.2 or density > 0.98: score -= 10
    if basal > 0.1 * canopy: score -= 10  # ratio check
    return max(0, score)

# Test on sample trees
test_cases = [
    ('Heritage banyan', 45.0, 150, 3.5, 22.0, 0.85),
    ('Village banyan', 28.0, 45, 1.2, 20.0, 0.75),
    ('Young roadside', 8.0, 3, 0.08, 12.0, 0.55),
    ('Ancient giant', 65.0, 280, 8.5, 24.0, 0.92),
]

print("Tree Age Estimator — Stage 4: Error Propagation")
print("=" * 55)
print(f"Monte Carlo samples: 1000 per tree")
print(f"Measurement error model: canopy {MEASUREMENT_ERRORS['canopy']:.0%}, "
      f"pillars {MEASUREMENT_ERRORS['pillars']:.0%}, height {MEASUREMENT_ERRORS['height']:.0%}")
print()

for name, c, p, b, h, d in test_cases:
    result = monte_carlo_propagation(c, p, b, h, d)
    qs = quality_score(c, p, b, h, d)
    ci_width = result['ci_upper'] - result['ci_lower']
    print(f"{name} (canopy={c}m, pillars={p}):")
    print(f"  Age estimate: {result['point']:.0f}y [{result['ci_lower']:.0f}, {result['ci_upper']:.0f}]")
    print(f"  Measurement uncertainty: +/-{result['std']:.0f} years")
    print(f"  Quality score: {qs}/100")
    print()`,
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
    elif n_pillars < 10:
        recs.append(f"STRUCTURAL: Only {n_pillars} pillar roots — tree may be vulnerable "
                    f"to wind damage, consider support structures")

    if canopy_diam > 40:
        recs.append(f"ECOLOGICAL: {canopy_diam:.0f}m canopy supports significant "
                    f"biodiversity — protect as micro-habitat")

    if quality_score < 60:
        recs.append(f"DATA: Measurement quality score {quality_score}/100 is low — "
                    f"recommend resurvey with better equipment")

    return recs

# Assess 8 test trees
test_trees = [
    {'name': 'Kamakhya Temple', 'age_samples': np.random.normal(420, 60, 1000),
     'age_est': 420, 'ci': (345, 510), 'quality': 85, 'pillars': 185, 'canopy': 52},
    {'name': 'Jorhat College', 'age_samples': np.random.normal(280, 50, 1000),
     'age_est': 280, 'ci': (195, 370), 'quality': 78, 'pillars': 95, 'canopy': 38},
    {'name': 'Kaziranga Gate', 'age_samples': np.random.normal(150, 40, 1000),
     'age_est': 150, 'ci': (85, 225), 'quality': 70, 'pillars': 30, 'canopy': 25},
    {'name': 'Sivasagar Road', 'age_samples': np.random.normal(90, 30, 1000),
     'age_est': 90, 'ci': (40, 145), 'quality': 65, 'pillars': 12, 'canopy': 15},
    {'name': 'Majuli Island', 'age_samples': np.random.normal(350, 70, 1000),
     'age_est': 350, 'ci': (230, 475), 'quality': 60, 'pillars': 120, 'canopy': 45},
    {'name': 'Tezpur Park', 'age_samples': np.random.normal(200, 45, 1000),
     'age_est': 200, 'ci': (120, 285), 'quality': 82, 'pillars': 55, 'canopy': 30},
    {'name': 'Dibrugarh School', 'age_samples': np.random.normal(60, 20, 1000),
     'age_est': 60, 'ci': (25, 100), 'quality': 90, 'pillars': 5, 'canopy': 10},
    {'name': 'Nagaon Highway', 'age_samples': np.random.normal(45, 15, 1000),
     'age_est': 45, 'ci': (20, 75), 'quality': 55, 'pillars': 2, 'canopy': 8},
]

print("Tree Age Estimator — Stage 5: Heritage Classification")
print("=" * 60)
print()

for tree in test_trees:
    cls = classify_heritage(tree['age_samples'])
    recs = generate_recommendations(
        tree['age_est'], tree['ci'][0], tree['ci'][1],
        tree['quality'], tree['pillars'], tree['canopy'], cls)

    print(f"{tree['name']}:")
    print(f"  Age: {tree['age_est']}y ({tree['ci'][0]}-{tree['ci'][1]})")
    print(f"  Classification: {cls['classification']} ({cls['confidence']:.0%} confidence)"
          f"{' [BORDERLINE]' if cls['borderline'] else ''}")
    for grade, prob in cls['probabilities'].items():
        if prob > 0.01:
            print(f"    {grade}: {prob:.0%}")
    for rec in recs[:2]:
        print(f"  -> {rec}")
    print()`,
      challenge: 'Add a "threat proximity" layer: assign each tree a distance to the nearest planned construction project. Trees with high heritage grade AND close threat proximity should be flagged as "URGENT" in the recommendations. How many of the 8 trees become urgent?',
      successHint: 'Stage 5 is complete — you have probabilistic heritage classification with evidence-backed conservation recommendations.',
    },
    {
      title: 'Capstone Deliverable: Writing a Conservation Assessment Report',
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
      codeIntro: 'Use the full pipeline to generate a professional conservation assessment report for a real banyan tree. The report must stand on its own — a reader who never ran your code should understand every conclusion, its confidence, and what to do next.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# CAPSTONE DELIVERABLE: Conservation Assessment Report
# ============================================================
# A professional report has: subject, methods, results,
# uncertainty, recommendations, and limitations.
# This code generates one from pipeline data.

# --- Assessment data (from Stages 1-5) ---
tree = {
    'name': 'Great Banyan of Kamakhya',
    'location': 'Kamakhya Temple grounds, Guwahati, Assam',
    'gps': '26.1664 N, 91.7042 E',
    'survey_date': '2024-02-15',
    'surveyor': 'Field team A (2 observers)',
    'canopy_diameter': 52.3,
    'pillar_roots': 185,
    'total_basal_area': 4.8,
    'height': 23.5,
    'crown_density': 0.87,
}

analysis = {
    'age_estimate': 420,
    'ci_lower': 345,
    'ci_upper': 510,
    'model': 'Ridge regression',
    'cv_rmse': 42,
    'bootstrap_n': 500,
    'mc_samples': 1000,
    'quality_score': 85,
    'grade': 'Grade A',
    'grade_confidence': 0.89,
    'grade_probs': {'Grade A': 0.89, 'Grade B': 0.11, 'Notable': 0.00},
    'borderline': False,
}

# --- Section 1: Header and subject ---
SEP = "=" * 65
THIN = "-" * 65
print(SEP)
print("   HERITAGE TREE CONSERVATION ASSESSMENT")
print(SEP)
print(f"Subject:  {tree['name']}")
print(f"Location: {tree['location']}")
print(f"GPS:      {tree['gps']}")
print(f"Date:     {tree['survey_date']}")
print(f"Team:     {tree['surveyor']}")
print()

# --- Section 2: Field measurements ---
print(THIN)
print("FIELD MEASUREMENTS")
print(THIN)
print(f"  Canopy diameter:    {tree['canopy_diameter']:.1f} m")
print(f"  Pillar roots:       {tree['pillar_roots']}")
print(f"  Total basal area:   {tree['total_basal_area']:.1f} m2")
print(f"  Height:             {tree['height']:.1f} m")
print(f"  Crown density:      {tree['crown_density']:.0%}")
qs = analysis['quality_score']
print(f"  Data quality score: {qs}/100 ({'Good' if qs >= 80 else 'Acceptable' if qs >= 60 else 'Low'})")
print()

# --- Section 3: Age estimate with uncertainty ---
print(THIN)
print("AGE ESTIMATE")
print(THIN)
a = analysis
ci_width = a['ci_upper'] - a['ci_lower']
rel_uncertainty = ci_width / a['age_estimate'] * 100
print(f"  Point estimate:   {a['age_estimate']} years")
print(f"  95% confidence:   {a['ci_lower']} - {a['ci_upper']} years")
print(f"  Uncertainty:      +/- {ci_width//2} years ({rel_uncertainty:.0f}% of estimate)")
print(f"  Method:           {a['model']} (CV RMSE = {a['cv_rmse']} years)")
print(f"  Bootstrap:        {a['bootstrap_n']} iterations")
print(f"  Error propagation: {a['mc_samples']} Monte Carlo samples")
print()

# --- Section 4: Heritage classification ---
print(THIN)
print("HERITAGE CLASSIFICATION")
print(THIN)
print(f"  Assigned grade:   {a['grade']} ({a['grade_confidence']:.0%} confidence)")
for grade, prob in a['grade_probs'].items():
    if prob > 0:
        bar = '#' * int(prob * 40)
        print(f"    {grade:15s} {prob:5.0%} {bar}")
if a['borderline']:
    print("  ** BORDERLINE — expert review recommended **")
print()

# --- Section 5: Recommendations ---
print(THIN)
print("RECOMMENDATIONS")
print(THIN)
recs = []
if a['grade'] == 'Grade A':
    recs.append(f"PROTECT: Apply for heritage tree status under Assam "
                f"Tree Preservation Act. Establish {30}m buffer zone.")
if tree['pillar_roots'] > 50:
    recs.append(f"MONITOR: {tree['pillar_roots']} pillar roots provide "
                f"structural redundancy. Inspect annually for root "
                f"cutting by construction.")
if tree['canopy_diameter'] > 40:
    recs.append(f"ECOLOGY: {tree['canopy_diameter']:.0f}m canopy is a "
                f"significant micro-habitat. Survey epiphytes and "
                f"nesting birds before any nearby development.")
recs.append(f"RESURVEY: Schedule follow-up in 3 years to track "
            f"growth rate and detect decline early.")
for i, rec in enumerate(recs, 1):
    print(f"  {i}. {rec}")
print()

# --- Section 6: Methodology limitations ---
print(THIN)
print("LIMITATIONS")
print(THIN)
limitations = [
    "Allometric model calibrated on Assam banyans (n=100). "
    "Applying to other regions may introduce bias.",
    "Model assumes natural, unpruned growth. Human "
    "intervention (root cutting, irrigation) violates assumptions.",
    f"Trees older than 500y are underrepresented in "
    f"calibration data. The upper CI ({a['ci_upper']}y) "
    f"approaches this boundary.",
    "Measurement uncertainty assumes independent Gaussian "
    "errors. Systematic surveyor bias is not modeled.",
]
for i, lim in enumerate(limitations, 1):
    print(f"  {i}. {lim}")
print()

print(SEP)
print("  Report generated by Tree Age Estimator v1.0")
print(f"  Assessment date: {tree['survey_date']}")
print(SEP)`,
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
            diagram={[BanyanInventoryDiagram, BanyanBiomassModelDiagram, BanyanCarbonPoolDiagram, BanyanGrowthModelDiagram, BanyanConservationDiagram, BanyanMonitoringDiagram][i] ? createElement([BanyanInventoryDiagram, BanyanBiomassModelDiagram, BanyanCarbonPoolDiagram, BanyanGrowthModelDiagram, BanyanConservationDiagram, BanyanMonitoringDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
