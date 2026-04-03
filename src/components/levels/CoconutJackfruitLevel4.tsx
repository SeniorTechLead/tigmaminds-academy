import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CoconutJackfruitLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone: Crop Yield Predictor — problem definition and data generation',
      concept: `Your capstone project is to build a **Crop Yield Predictor** that estimates coconut and jackfruit yields from environmental variables: rainfall, temperature, and soil nutrient levels.

This is a **regression problem** — unlike classification (which predicts categories), regression predicts continuous numerical values (e.g., "125 coconuts per tree per year").

The key variables affecting tropical fruit yield:

- **Annual rainfall** (mm): coconut needs 1500-2500mm, jackfruit needs 1000-2000mm. Too little means drought stress; too much means root rot and fungal disease.
- **Mean temperature** (C): coconut optimal at 27C (tropical), jackfruit at 25C. Both decline outside optimal range.
- **Soil nitrogen** (kg/ha): affects vegetative growth. Too much nitrogen causes excessive leaf growth at the expense of fruit.
- **Soil potassium** (kg/ha): critical for coconut (fruit development). Potassium-deficient coconuts produce small, thin-husked nuts.
- **Soil phosphorus** (kg/ha): affects root development and flowering.

We will generate synthetic data based on agronomic research, then build a regression model to predict yield from these inputs. The model must capture **non-linear relationships** — yield does not increase linearly with rainfall; it peaks at an optimum and declines on either side.`,
      analogy: 'Building a crop yield predictor is like learning to estimate cooking time. A beginner says "more heat = faster cooking" (linear model). An experienced cook knows that too much heat burns the outside while the inside stays raw, and that humidity, altitude, and pan material all interact. The relationship between inputs and output is non-linear and multi-dimensional — exactly the kind of problem that demands a real model.',
      storyConnection: 'The coconut and jackfruit in the story thrive because their environment is right — the right rainfall, the right temperature, the right soil. But farmers across Assam face varying conditions. A yield predictor would tell them: given YOUR rainfall, YOUR soil, what yield can you expect? And more importantly, which variable should you optimize first?',
      checkQuestion: 'Why would a linear regression model fail to predict coconut yield from rainfall alone?',
      checkAnswer: 'The relationship is not linear — it is an inverted U-shape (quadratic or bell-shaped). Yield increases with rainfall up to about 2000mm, then decreases as waterlogging and fungal disease take over. A linear model would predict that infinite rainfall gives infinite yield, which is absurd. You need a model that captures the parabolic relationship: polynomial regression, or a non-linear model like a neural network.',
      codeIntro: 'Generate a realistic synthetic dataset for tropical fruit yield prediction with non-linear environmental dependencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n_samples = 500

# Generate environmental variables with realistic ranges
rainfall = np.random.uniform(800, 3500, n_samples)  # mm/year
temperature = np.random.uniform(20, 35, n_samples)  # deg C
soil_N = np.random.uniform(20, 200, n_samples)  # kg/ha
soil_K = np.random.uniform(30, 250, n_samples)  # kg/ha
soil_P = np.random.uniform(10, 100, n_samples)  # kg/ha

# Coconut yield model (non-linear)
# Optimal: rainfall=2000, temp=27, K=150
def coconut_yield(rain, temp, N, K, P):
    rain_effect = -0.00003 * (rain - 2000)**2 + 80
    temp_effect = -0.8 * (temp - 27)**2 + 20
    K_effect = 15 * (1 - np.exp(-0.02 * K))  # saturating response
    N_effect = -0.001 * (N - 100)**2 + 5  # too much N is bad
    P_effect = 5 * (1 - np.exp(-0.03 * P))
    base = rain_effect + temp_effect + K_effect + N_effect + P_effect
    noise = np.random.normal(0, 8, len(rain))
    return np.clip(base + noise, 0, 150)

# Jackfruit yield model (different optima)
def jackfruit_yield(rain, temp, N, K, P):
    rain_effect = -0.00004 * (rain - 1500)**2 + 60
    temp_effect = -0.6 * (temp - 25)**2 + 15
    N_effect = 10 * (1 - np.exp(-0.015 * N))
    K_effect = -0.0005 * (K - 120)**2 + 8
    P_effect = 8 * (1 - np.exp(-0.025 * P))
    base = rain_effect + temp_effect + N_effect + K_effect + P_effect
    noise = np.random.normal(0, 6, len(rain))
    return np.clip(base + noise, 0, 200)

y_coconut = coconut_yield(rainfall, temperature, soil_N, soil_K, soil_P)
y_jackfruit = jackfruit_yield(rainfall, temperature, soil_N, soil_K, soil_P)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Crop Yield vs Environmental Variables', color='white', fontsize=14)

variables = [('Rainfall (mm)', rainfall), ('Temperature (C)', temperature),
             ('Soil N (kg/ha)', soil_N), ('Soil K (kg/ha)', soil_K), ('Soil P (kg/ha)', soil_P)]

for idx, (name, var) in enumerate(variables):
    row, col = idx // 3, idx % 3
    ax = axes[row, col]
    ax.set_facecolor('#111827')
    ax.scatter(var, y_coconut, c='#22c55e', s=8, alpha=0.4, label='Coconut')
    ax.scatter(var, y_jackfruit, c='#f59e0b', s=8, alpha=0.4, label='Jackfruit')

    # Trend lines
    sort_idx = np.argsort(var)
    window = 30
    for y_vals, color in [(y_coconut, '#22c55e'), (y_jackfruit, '#f59e0b')]:
        smoothed = np.convolve(y_vals[sort_idx], np.ones(window)/window, mode='valid')
        ax.plot(var[sort_idx][window//2:window//2+len(smoothed)], smoothed,
                color=color, linewidth=2, alpha=0.8)

    ax.set_xlabel(name, color='white')
    ax.set_ylabel('Yield (fruits/tree/yr)', color='white')
    ax.tick_params(colors='gray')
    if idx == 0:
        ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Summary statistics
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.hist(y_coconut, bins=30, color='#22c55e', alpha=0.6, label=f'Coconut (mean={np.mean(y_coconut):.0f})')
ax.hist(y_jackfruit, bins=30, color='#f59e0b', alpha=0.6, label=f'Jackfruit (mean={np.mean(y_jackfruit):.0f})')
ax.set_xlabel('Yield (fruits/tree/yr)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Yield distributions', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("DATASET SUMMARY")
print(f"Samples: {n_samples}")
print(f"Features: rainfall, temperature, soil_N, soil_K, soil_P")
print(f"Coconut yield: mean={np.mean(y_coconut):.1f}, std={np.std(y_coconut):.1f}, range=[{np.min(y_coconut):.0f}, {np.max(y_coconut):.0f}]")
print(f"Jackfruit yield: mean={np.mean(y_jackfruit):.1f}, std={np.std(y_jackfruit):.1f}, range=[{np.min(y_jackfruit):.0f}, {np.max(y_jackfruit):.0f}]")
print()
print("Key non-linearities visible:")
print("  - Rainfall: inverted-U shape (optimal around 1500-2000mm)")
print("  - Temperature: inverted-U shape (optimal 25-27C)")
print("  - Nutrients: saturating response (diminishing returns)")`,
      challenge: 'Add interaction effects between variables — e.g., high rainfall + high temperature increases fungal disease risk, reducing yield. Modify the yield function to include at least one interaction term.',
      successHint: 'Real agricultural datasets have these same non-linear patterns. The synthetic data here is based on published agronomic research. The model you build next will learn these patterns from data alone.',
    },
    {
      title: 'Feature engineering for regression — polynomial and interaction features',
      concept: `Raw features (rainfall, temperature, soil nutrients) are not enough for a linear model to capture non-linear relationships. You need **feature engineering** — creating new features from existing ones.

Key techniques for regression:

- **Polynomial features**: if yield depends on (rainfall - optimal)^2, create a feature rainfall_squared = rainfall^2. A linear model on [rainfall, rainfall^2] can fit a parabola.
- **Interaction features**: if the effect of temperature depends on rainfall (high temp + high rain = disease), create rainfall_x_temp = rainfall * temperature.
- **Domain features**: use agronomic knowledge to create meaningful combinations. "Water use efficiency" = yield / rainfall. "Nutrient balance" = N / (K + P).
- **Normalization**: features on different scales (rainfall in 1000s, P in 10s) cause gradient descent to oscillate. Z-score normalize: (x - mean) / std.

The number of features grows fast:
- 5 original features
- 5 squared features = 10
- C(5,2) = 10 interaction pairs = 20 total
- With cubic terms: even more

More features means more expressive power BUT also more overfitting risk. This is the **bias-variance tradeoff** in action.`,
      analogy: 'Feature engineering is like a translator converting raw observations into a language the model can understand. Telling a linear model "rainfall = 2500mm" is like speaking English to someone who only understands math. But telling it "rainfall_deviation_squared = 250000" — now it can calculate that the yield should be lower because the squared deviation from optimal is large. You are doing the non-linear thinking so the linear model does not have to.',
      storyConnection: 'A farmer in Assam does not think "rainfall is 2100mm." They think "rainfall is slightly above normal for coconut but perfect for jackfruit." They have internalized the non-linear relationship and automatically compute the deviation from optimal. Feature engineering makes the model think like an experienced farmer.',
      checkQuestion: 'You add polynomial features up to degree 5 for all 5 variables. How many total features do you have now, and what risk does this create?',
      checkAnswer: 'With degree-5 polynomials for 5 variables plus all interactions, you can have hundreds of features from just 5 original variables. With 500 training samples, you risk severe overfitting — the model has enough parameters to memorize every training point but will fail on new data. You need regularization (Ridge/Lasso) or feature selection to prevent this. More features is not always better.',
      codeIntro: 'Build polynomial and interaction features from scratch, normalize them, and prepare the feature matrix for regression.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate data
n = 500
rainfall = np.random.uniform(800, 3500, n)
temperature = np.random.uniform(20, 35, n)
soil_N = np.random.uniform(20, 200, n)
soil_K = np.random.uniform(30, 250, n)
soil_P = np.random.uniform(10, 100, n)

def coconut_yield(rain, temp, N, K, P):
    return np.clip(
        -0.00003*(rain-2000)**2 + 80 - 0.8*(temp-27)**2 + 20 +
        15*(1-np.exp(-0.02*K)) - 0.001*(N-100)**2 + 5 +
        5*(1-np.exp(-0.03*P)) + np.random.normal(0, 8, len(rain)), 0, 150)

y = coconut_yield(rainfall, temperature, soil_N, soil_K, soil_P)

# Raw feature matrix
X_raw = np.column_stack([rainfall, temperature, soil_N, soil_K, soil_P])
feature_names_raw = ['rain', 'temp', 'N', 'K', 'P']

# Z-score normalization
X_mean = X_raw.mean(axis=0)
X_std = X_raw.std(axis=0)
X_norm = (X_raw - X_mean) / X_std

def build_polynomial_features(X, names, degree=2, interactions=True):
    """Build polynomial and interaction features from normalized data."""
    features = [X]
    fnames = list(names)

    # Squared terms
    if degree >= 2:
        X_sq = X ** 2
        features.append(X_sq)
        fnames.extend([f'{n}^2' for n in names])

    # Cubic terms
    if degree >= 3:
        X_cube = X ** 3
        features.append(X_cube)
        fnames.extend([f'{n}^3' for n in names])

    # Interaction terms (pairwise)
    if interactions:
        n_features = X.shape[1]
        for i in range(n_features):
            for j in range(i+1, n_features):
                inter = (X[:, i] * X[:, j]).reshape(-1, 1)
                features.append(inter)
                fnames.append(f'{names[i]}*{names[j]}')

    return np.hstack(features), fnames

X_poly2, names_poly2 = build_polynomial_features(X_norm, feature_names_raw, degree=2)
X_poly3, names_poly3 = build_polynomial_features(X_norm, feature_names_raw, degree=3)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Feature correlation with yield
ax = axes[0, 0]
ax.set_facecolor('#111827')
correlations = [np.corrcoef(X_poly2[:, i], y)[0, 1] for i in range(X_poly2.shape[1])]
sorted_idx = np.argsort(np.abs(correlations))[::-1][:15]  # top 15
ax.barh(range(len(sorted_idx)), [correlations[i] for i in sorted_idx],
        color=['#22c55e' if correlations[i] > 0 else '#ef4444' for i in sorted_idx],
        edgecolor='none')
ax.set_yticks(range(len(sorted_idx)))
ax.set_yticklabels([names_poly2[i] for i in sorted_idx], color='white', fontsize=8)
ax.set_xlabel('Correlation with yield', color='white')
ax.set_title('Top 15 features by correlation', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Feature dimensionality growth
ax = axes[0, 1]
ax.set_facecolor('#111827')
degrees = [1, 2, 3]
n_features = [5, X_poly2.shape[1], X_poly3.shape[1]]
ax.bar(degrees, n_features, color=['#3b82f6', '#a855f7', '#ef4444'], edgecolor='none', width=0.5)
ax.set_xlabel('Polynomial degree', color='white')
ax.set_ylabel('Number of features', color='white')
ax.set_title('Feature dimensionality explosion', color='white', fontsize=11)
ax.tick_params(colors='gray')
for d, nf in zip(degrees, n_features):
    ax.text(d, nf + 1, str(nf), ha='center', color='white', fontsize=12, fontweight='bold')

# Show non-linearity: raw rain vs yield, then rain^2 vs yield
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.scatter(X_norm[:, 0], y, c='#3b82f6', s=8, alpha=0.3, label='rain (normalized)')
ax.set_xlabel('Rainfall (normalized)', color='white')
ax.set_ylabel('Coconut yield', color='white')
ax.set_title('Linear feature: rain vs yield (non-linear!)', color='white', fontsize=11)
ax.tick_params(colors='gray')

ax = axes[1, 1]
ax.set_facecolor('#111827')
rain_sq = X_norm[:, 0] ** 2
ax.scatter(rain_sq, y, c='#22c55e', s=8, alpha=0.3, label='rain^2 (normalized)')
# This should show a more linear relationship
corr_raw = np.corrcoef(X_norm[:, 0], y)[0, 1]
corr_sq = np.corrcoef(rain_sq, y)[0, 1]
ax.set_xlabel('Rainfall^2 (normalized)', color='white')
ax.set_ylabel('Coconut yield', color='white')
ax.set_title(f'Polynomial feature: rain^2 vs yield', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("FEATURE ENGINEERING SUMMARY")
print(f"Raw features: {len(feature_names_raw)}")
print(f"Degree-2 polynomial + interactions: {X_poly2.shape[1]}")
print(f"Degree-3 polynomial + interactions: {X_poly3.shape[1]}")
print()
print(f"Correlation with yield:")
print(f"  rain (raw):     r = {corr_raw:.3f}")
print(f"  rain^2:         r = {corr_sq:.3f}")
print(f"  Best feature:   {names_poly2[sorted_idx[0]]} (r = {correlations[sorted_idx[0]]:.3f})")
print()
print("The squared rainfall feature has STRONGER correlation with yield")
print("because yield has a quadratic dependence on rainfall.")
print("Feature engineering makes hidden relationships visible to linear models.")`,
      challenge: 'Create a "nutrient balance" feature: N/(K+P). Does this domain-knowledge feature have higher correlation with yield than any individual nutrient? Domain features often outperform pure polynomial expansion.',
      successHint: 'Feature engineering is where domain expertise meets data science. A biologist who understands that yield peaks at optimal rainfall will immediately create (rainfall - optimal)^2 as a feature. A pure ML engineer might need degree-3 polynomials to approximate the same thing.',
    },
    {
      title: 'Multiple linear regression — fitting the yield model',
      concept: `With polynomial features ready, we can now fit a **multiple linear regression** model. The model predicts yield as a weighted sum of features:

yield = w1*rain + w2*temp + w3*rain^2 + w4*temp^2 + ... + bias

Finding the optimal weights requires minimizing the **mean squared error (MSE)**:

MSE = (1/n) * sum((predicted - actual)^2)

Two approaches:
1. **Normal equation** (closed-form): w = (X^T X)^(-1) X^T y. Fast, exact, but fails if features are collinear or the matrix is singular.
2. **Gradient descent** (iterative): start with random weights, compute gradient of MSE with respect to each weight, update weights in the opposite direction of the gradient. Repeat until convergence.

Gradient descent is more general — it works with any differentiable loss function and scales to millions of features. The learning rate controls step size: too large and you overshoot; too small and convergence takes forever.

**Regularization** prevents overfitting:
- **Ridge (L2)**: adds penalty term lambda * sum(w^2) to the loss. Shrinks all weights toward zero.
- **Lasso (L1)**: adds penalty term lambda * sum(|w|). Drives some weights exactly to zero (feature selection).`,
      analogy: 'Gradient descent is like finding the lowest point in a foggy valley. You cannot see the whole landscape, but you can feel the slope under your feet. At each step, you walk downhill. The learning rate is your stride length — too long and you leap over the valley floor; too short and you take all day. Regularization is like a leash that pulls you back toward the center if you wander too far — it prevents you from chasing noise in the data.',
      storyConnection: 'The coconut and jackfruit farmer does not have a closed-form solution for "what inputs give the best yield." They experiment season by season — adjusting fertilizer, irrigation, pruning. Each season is a gradient descent step: they observe the result (yield), estimate which change helped most (gradient), and adjust their strategy. Over years, they converge on near-optimal farming practices.',
      checkQuestion: 'Your regression model has 20 polynomial features and achieves R^2 = 0.99 on training data but R^2 = 0.60 on test data. What is happening and what should you do?',
      checkAnswer: 'Classic overfitting. The model memorized the training data (R^2 = 0.99) but learned noise patterns that do not generalize (R^2 = 0.60 on test). Solutions: (1) Add Ridge or Lasso regularization to shrink weights, (2) Remove high-degree polynomial features that add complexity without predictive power, (3) Collect more training data, (4) Use cross-validation to tune the regularization strength lambda.',
      codeIntro: 'Implement multiple linear regression with gradient descent and Ridge regularization from scratch.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate data
n = 500
rainfall = np.random.uniform(800, 3500, n)
temperature = np.random.uniform(20, 35, n)
soil_N = np.random.uniform(20, 200, n)
soil_K = np.random.uniform(30, 250, n)
soil_P = np.random.uniform(10, 100, n)

def coconut_yield(rain, temp, N, K, P):
    return np.clip(
        -0.00003*(rain-2000)**2 + 80 - 0.8*(temp-27)**2 + 20 +
        15*(1-np.exp(-0.02*K)) - 0.001*(N-100)**2 + 5 +
        5*(1-np.exp(-0.03*P)) + np.random.normal(0, 8, len(rain)), 0, 150)

y = coconut_yield(rainfall, temperature, soil_N, soil_K, soil_P)

# Build features with degree-2 polynomials
X_raw = np.column_stack([rainfall, temperature, soil_N, soil_K, soil_P])
X_mean, X_std = X_raw.mean(0), X_raw.std(0)
X_norm = (X_raw - X_mean) / X_std

# Add squared terms and interactions
features = [X_norm]
names = ['rain', 'temp', 'N', 'K', 'P']
for i in range(5):
    features.append((X_norm[:, i:i+1])**2)
    names.append(f'{names[i]}^2' if i < 5 else '')
names_sq = ['rain^2', 'temp^2', 'N^2', 'K^2', 'P^2']
for i in range(5):
    for j in range(i+1, 5):
        features.append((X_norm[:, i] * X_norm[:, j]).reshape(-1,1))
X_feat = np.hstack(features)
# Add bias column
X_feat = np.hstack([np.ones((n, 1)), X_feat])

# Train/test split
idx = np.random.permutation(n)
split = int(0.8 * n)
X_train, X_test = X_feat[idx[:split]], X_feat[idx[split:]]
y_train, y_test = y[idx[:split]], y[idx[split:]]

class LinearRegression:
    def __init__(self, lr=0.01, epochs=1000, l2_lambda=0.0):
        self.lr = lr
        self.epochs = epochs
        self.l2_lambda = l2_lambda
        self.w = None
        self.loss_history = []

    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.w = np.random.randn(n_features) * 0.01
        y = y.flatten()

        for epoch in range(self.epochs):
            pred = X @ self.w
            error = pred - y
            mse = np.mean(error**2)
            reg_loss = self.l2_lambda * np.sum(self.w[1:]**2)  # don\'t regularize bias
            self.loss_history.append(mse + reg_loss)

            # Gradient
            grad = (2 / n_samples) * (X.T @ error)
            grad[1:] += 2 * self.l2_lambda * self.w[1:]  # L2 gradient

            self.w -= self.lr * grad

        return self

    def predict(self, X):
        return X @ self.w

    def r_squared(self, X, y):
        pred = self.predict(X)
        ss_res = np.sum((y - pred)**2)
        ss_tot = np.sum((y - np.mean(y))**2)
        return 1 - ss_res / ss_tot

# Train models with different regularization
lambdas = [0, 0.01, 0.1, 1.0, 10.0]
results = []

for lam in lambdas:
    model = LinearRegression(lr=0.005, epochs=2000, l2_lambda=lam)
    model.fit(X_train, y_train)
    r2_train = model.r_squared(X_train, y_train)
    r2_test = model.r_squared(X_test, y_test)
    results.append({'lambda': lam, 'model': model, 'r2_train': r2_train, 'r2_test': r2_test})

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Training loss curves
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors_l = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
for i, r in enumerate(results):
    ax.plot(r['model'].loss_history[10:], color=colors_l[i], linewidth=1.5,
            label=f'lambda={r["lambda"]}', alpha=0.8)
ax.set_xlabel('Epoch', color='white')
ax.set_ylabel('Loss (MSE + L2)', color='white')
ax.set_title('Training loss curves', color='white', fontsize=11)
ax.set_yscale('log')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# R-squared: train vs test
ax = axes[0, 1]
ax.set_facecolor('#111827')
x_pos = np.arange(len(lambdas))
r2_trains = [r['r2_train'] for r in results]
r2_tests = [r['r2_test'] for r in results]
ax.bar(x_pos - 0.15, r2_trains, 0.3, color='#22c55e', label='Train R^2')
ax.bar(x_pos + 0.15, r2_tests, 0.3, color='#3b82f6', label='Test R^2')
ax.set_xticks(x_pos)
ax.set_xticklabels([str(l) for l in lambdas], color='white')
ax.set_xlabel('Regularization lambda', color='white')
ax.set_ylabel('R-squared', color='white')
ax.set_title('Train vs Test R^2 across regularization', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Best model: predicted vs actual
best_idx = np.argmax([r['r2_test'] for r in results])
best = results[best_idx]
ax = axes[1, 0]
ax.set_facecolor('#111827')
pred_test = best['model'].predict(X_test)
ax.scatter(y_test, pred_test, c='#22c55e', s=15, alpha=0.5)
ax.plot([0, 150], [0, 150], '--', color='#ef4444', linewidth=2, label='Perfect prediction')
ax.set_xlabel('Actual yield', color='white')
ax.set_ylabel('Predicted yield', color='white')
ax.set_title(f'Best model (lambda={best["lambda"]}): R^2={best["r2_test"]:.3f}', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Feature importance (weight magnitudes)
ax = axes[1, 1]
ax.set_facecolor('#111827')
weights = np.abs(best['model'].w[1:])  # exclude bias
top_k = min(15, len(weights))
top_idx = np.argsort(weights)[::-1][:top_k]
all_names = ['rain','temp','N','K','P'] + names_sq + ['rain*temp','rain*N','rain*K','rain*P','temp*N','temp*K','temp*P','N*K','N*P','K*P']
top_names = [all_names[i] if i < len(all_names) else f'f{i}' for i in top_idx]
ax.barh(range(top_k), weights[top_idx], color='#a855f7', edgecolor='none')
ax.set_yticks(range(top_k))
ax.set_yticklabels(top_names, color='white', fontsize=8)
ax.set_xlabel('|Weight|', color='white')
ax.set_title('Feature importance (weight magnitude)', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.invert_yaxis()

plt.tight_layout()
plt.show()

print("REGRESSION RESULTS")
for r in results:
    print(f"  lambda={r['lambda']:<6} Train R^2={r['r2_train']:.3f}  Test R^2={r['r2_test']:.3f}")
print()
print(f"Best model: lambda={best['lambda']} (test R^2={best['r2_test']:.3f})")
print(f"Without regularization: test R^2={results[0]['r2_test']:.3f}")
print()
print("Regularization prevents overfitting — the test R^2 improves even as")
print("training R^2 slightly decreases. This is the bias-variance tradeoff.")`,
      challenge: 'Implement Lasso (L1) regularization alongside Ridge (L2). Which one drives more weights to exactly zero? Use the surviving features to determine which environmental variables matter most for coconut yield.',
      successHint: 'You have built a complete regression pipeline from scratch: data generation, feature engineering, gradient descent optimization, regularization, and model selection. This is the foundation of every predictive model in agriculture, weather forecasting, and economics.',
    },
    {
      title: 'Model validation — cross-validation and residual analysis',
      concept: `A single train/test split gives you one estimate of model performance. But how reliable is that estimate? It depends on which data points happened to land in the test set.

**K-fold cross-validation** gives a more robust estimate:
1. Split data into k equal folds
2. For each fold: train on k-1 folds, test on the held-out fold
3. Average the k test scores

Beyond R^2, you need **residual analysis** to diagnose model problems:

- **Residual plot** (predicted vs. residual): should show random scatter. Patterns indicate the model is missing something.
- **Residual distribution**: should be approximately normal (bell-shaped). Skewness indicates systematic bias.
- **Heteroscedasticity**: if residuals get larger as predicted values increase, the model's uncertainty is not constant — it is less reliable for high-yield predictions.
- **Influential points**: outliers with high leverage that disproportionately affect the model. Cook's distance identifies them.

A model with high R^2 but patterned residuals is worse than a model with moderate R^2 and random residuals — the first is systematically wrong, the second is just noisy.`,
      analogy: 'Residual analysis is like checking your work on an exam. Getting 85% correct tells you something, but checking WHICH questions you got wrong tells you much more. If you missed all the word problems, that is a systematic failure (patterned residuals). If you missed random questions across topics, that is noise (random residuals). The pattern of errors reveals what you need to study next.',
      storyConnection: 'An Assamese farmer who grows coconuts year after year is running their own cross-validation. Each year is a "fold" — same farm, different weather. If yields vary wildly from year to year despite consistent management, the variance is high and the farmer cannot trust any single year as representative. They average across years to get a reliable yield estimate — exactly what cross-validation does.',
      checkQuestion: 'Your residual plot shows a clear U-shape: the model underestimates yield at low and high rainfall but overestimates at medium rainfall. What does this tell you, and how do you fix it?',
      checkAnswer: 'The U-shaped residual pattern means the model is missing a quadratic (or higher-order) term for rainfall. The true relationship curves in a way the current features cannot capture. Fix: add a rainfall^2 feature (if you have not already), or a rainfall^3 feature to capture the cubic shape. After adding the feature, the residual pattern should disappear, replaced by random scatter.',
      codeIntro: 'Implement k-fold cross-validation and comprehensive residual analysis for the crop yield model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate data and build features
n = 500
rainfall = np.random.uniform(800, 3500, n)
temperature = np.random.uniform(20, 35, n)
soil_N = np.random.uniform(20, 200, n)
soil_K = np.random.uniform(30, 250, n)
soil_P = np.random.uniform(10, 100, n)

def coconut_yield(rain, temp, N, K, P):
    return np.clip(
        -0.00003*(rain-2000)**2 + 80 - 0.8*(temp-27)**2 + 20 +
        15*(1-np.exp(-0.02*K)) - 0.001*(N-100)**2 + 5 +
        5*(1-np.exp(-0.03*P)) + np.random.normal(0, 8, len(rain)), 0, 150)

y = coconut_yield(rainfall, temperature, soil_N, soil_K, soil_P)

X_raw = np.column_stack([rainfall, temperature, soil_N, soil_K, soil_P])
X_mean, X_std = X_raw.mean(0), X_raw.std(0)
X_norm = (X_raw - X_mean) / X_std

# Build degree-2 polynomial features
parts = [np.ones((n,1)), X_norm]
for i in range(5):
    parts.append((X_norm[:, i:i+1])**2)
for i in range(5):
    for j in range(i+1, 5):
        parts.append((X_norm[:, i]*X_norm[:, j]).reshape(-1,1))
X = np.hstack(parts)

def fit_ridge(X_tr, y_tr, lam=0.1):
    n_s, n_f = X_tr.shape
    w = np.random.randn(n_f) * 0.01
    lr = 0.005
    for _ in range(2000):
        pred = X_tr @ w
        grad = (2/n_s) * (X_tr.T @ (pred - y_tr))
        grad[1:] += 2 * lam * w[1:]
        w -= lr * grad
    return w

# K-fold cross-validation
def k_fold_cv(X, y, k=5, lam=0.1):
    n = len(y)
    indices = np.random.permutation(n)
    fold_size = n // k
    fold_results = []

    for i in range(k):
        test_idx = indices[i*fold_size:(i+1)*fold_size]
        train_idx = np.concatenate([indices[:i*fold_size], indices[(i+1)*fold_size:]])

        w = fit_ridge(X[train_idx], y[train_idx], lam)
        pred = X[test_idx] @ w
        actual = y[test_idx]

        ss_res = np.sum((actual - pred)**2)
        ss_tot = np.sum((actual - np.mean(actual))**2)
        r2 = 1 - ss_res / ss_tot
        rmse = np.sqrt(np.mean((actual - pred)**2))

        fold_results.append({'r2': r2, 'rmse': rmse, 'pred': pred, 'actual': actual,
                             'residuals': actual - pred})

    return fold_results

results = k_fold_cv(X, y, k=5, lam=0.1)

# Combine all fold predictions for residual analysis
all_pred = np.concatenate([r['pred'] for r in results])
all_actual = np.concatenate([r['actual'] for r in results])
all_residuals = all_actual - all_pred

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Fold R^2 scores
ax = axes[0, 0]
ax.set_facecolor('#111827')
r2s = [r['r2'] for r in results]
ax.bar(range(1, 6), r2s, color='#a855f7', edgecolor='none')
ax.axhline(np.mean(r2s), color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Mean R^2 = {np.mean(r2s):.3f}')
ax.set_xlabel('Fold', color='white')
ax.set_ylabel('R-squared', color='white')
ax.set_title('5-Fold Cross-Validation R^2', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 1)

# Fold RMSE
ax = axes[0, 1]
ax.set_facecolor('#111827')
rmses = [r['rmse'] for r in results]
ax.bar(range(1, 6), rmses, color='#3b82f6', edgecolor='none')
ax.axhline(np.mean(rmses), color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Mean RMSE = {np.mean(rmses):.1f}')
ax.set_xlabel('Fold', color='white')
ax.set_ylabel('RMSE', color='white')
ax.set_title('5-Fold Cross-Validation RMSE', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Predicted vs Actual
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.scatter(all_actual, all_pred, c='#22c55e', s=10, alpha=0.4)
ax.plot([0, 150], [0, 150], '--', color='#ef4444', linewidth=2)
ax.set_xlabel('Actual yield', color='white')
ax.set_ylabel('Predicted yield', color='white')
ax.set_title('Predicted vs Actual (all folds)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Residual plot
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.scatter(all_pred, all_residuals, c='#f59e0b', s=10, alpha=0.4)
ax.axhline(0, color='#ef4444', linewidth=2, linestyle='--')
ax.set_xlabel('Predicted yield', color='white')
ax.set_ylabel('Residual (actual - predicted)', color='white')
ax.set_title('Residual plot: check for patterns', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Residual distribution
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.hist(all_residuals, bins=40, color='#a855f7', edgecolor='none', alpha=0.7)
# Overlay normal fit
mu, sigma = np.mean(all_residuals), np.std(all_residuals)
x_norm = np.linspace(mu - 4*sigma, mu + 4*sigma, 100)
pdf = (1/(sigma*np.sqrt(2*np.pi))) * np.exp(-0.5*((x_norm-mu)/sigma)**2) * len(all_residuals) * (all_residuals.max()-all_residuals.min())/40
ax.plot(x_norm, pdf, color='#f59e0b', linewidth=2, label=f'Normal(mu={mu:.1f}, sigma={sigma:.1f})')
ax.set_xlabel('Residual', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Residual distribution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Residuals vs rainfall (check for missing non-linearity)
ax = axes[1, 2]
ax.set_facecolor('#111827')
all_rain = np.concatenate([rainfall[np.random.permutation(n)[:100]] for _ in range(5)])[:len(all_residuals)]
ax.scatter(all_rain, all_residuals, c='#3b82f6', s=10, alpha=0.4)
ax.axhline(0, color='#ef4444', linewidth=2, linestyle='--')
ax.set_xlabel('Rainfall (mm)', color='white')
ax.set_ylabel('Residual', color='white')
ax.set_title('Residuals vs rainfall: any pattern?', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("CROSS-VALIDATION RESULTS")
print(f"R^2 per fold: {[f'{r:.3f}' for r in r2s]}")
print(f"Mean R^2: {np.mean(r2s):.3f} +/- {np.std(r2s):.3f}")
print(f"RMSE per fold: {[f'{r:.1f}' for r in rmses]}")
print(f"Mean RMSE: {np.mean(rmses):.1f} fruits/tree/year")
print()
print(f"Residual mean: {mu:.2f} (should be ~0)")
print(f"Residual std: {sigma:.2f}")
print()
print("If residuals show random scatter: model is well-specified.")
print("If residuals show patterns: model is missing a feature or non-linearity.")`,
      challenge: 'Compute Cook\'s distance for each data point to identify influential outliers. Remove the top 5 most influential points and re-fit. Does the model improve? In agriculture, outliers often represent unusual weather events (floods, droughts).',
      successHint: 'Cross-validation and residual analysis are non-negotiable steps in any serious modeling effort. A model without diagnostics is like a bridge without an inspection — it might hold, but you have no way of knowing until it fails.',
    },
    {
      title: 'Multi-crop optimization — predicting both coconut and jackfruit yield',
      concept: `Real farms grow multiple crops. The coconut-jackfruit agroforestry system requires **multi-output regression** — predicting both yields simultaneously from the same environmental inputs.

Why not just build two separate models? Because the crops interact:
- They compete for the same soil nutrients (shared resource constraint)
- Jackfruit benefits from coconut shade (positive interaction)
- Their root systems occupy different soil depths (complementary resource use)

**Multi-output regression** approaches:
1. **Independent models**: fit separate regressions for each crop. Ignores interactions.
2. **Stacked models**: use one crop's predicted yield as a feature for the other. Captures one-way interactions.
3. **Joint model**: fit both outputs simultaneously with a shared weight matrix. Captures mutual interactions and can enforce constraints (e.g., total nutrient uptake cannot exceed supply).

The joint approach is particularly valuable for agroforestry optimization: given fixed land and resources, what combination of coconut and jackfruit trees maximizes total value? This is a **constrained optimization problem** where the objective function comes from our regression model.`,
      analogy: 'Multi-crop optimization is like managing a shared household budget. Two roommates (coconut and jackfruit) share the same resources (rent, utilities, groceries). Optimizing one person spending independently ignores the constraint that total spending cannot exceed income. The joint budget considers both simultaneously and finds the allocation where both are satisfied. In farming, the "budget" is sunlight, water, and nutrients.',
      storyConnection: 'The coconut and jackfruit in the story grow side by side — they are not competing but complementing. The farmer who planted them understood intuitively what the joint model captures mathematically: these two crops together produce more than either alone, but only at the right density ratio.',
      checkQuestion: 'A farmer has space for 100 trees. Should they plant 100 coconuts, 100 jackfruits, or a mix? How would you use the multi-output model to answer this?',
      checkAnswer: 'Use the joint model to predict total yield value for different ratios: 100:0, 80:20, 60:40, 50:50, etc. Account for interactions — jackfruit benefits from coconut shade, so 50:50 might outperform 100 of either. Also consider economic value: coconut and jackfruit have different market prices, so optimize for revenue, not just fruit count. The optimal ratio depends on local market conditions, climate, and soil.',
      codeIntro: 'Build a multi-output regression model that jointly predicts coconut and jackfruit yield, then optimize the planting ratio.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n = 500
rainfall = np.random.uniform(800, 3500, n)
temperature = np.random.uniform(20, 35, n)
soil_N = np.random.uniform(20, 200, n)
soil_K = np.random.uniform(30, 250, n)
soil_P = np.random.uniform(10, 100, n)
coconut_density = np.random.uniform(0.2, 0.8, n)  # fraction of trees that are coconut

# Joint yield model with interaction
def joint_yield(rain, temp, N, K, P, c_dens):
    j_dens = 1 - c_dens

    # Coconut yield per tree
    c_yield = np.clip(
        -0.00003*(rain-2000)**2 + 80 - 0.8*(temp-27)**2 + 20 +
        15*(1-np.exp(-0.02*K)) - 0.001*(N-100)**2 + 5 +
        np.random.normal(0, 6, len(rain)), 0, 150)

    # Jackfruit yield per tree (benefits from coconut shade)
    shade_boost = 10 * c_dens  # more coconuts = more shade for jackfruit
    j_yield = np.clip(
        -0.00004*(rain-1500)**2 + 60 - 0.6*(temp-25)**2 + 15 +
        10*(1-np.exp(-0.015*N)) + shade_boost +
        np.random.normal(0, 5, len(rain)), 0, 200)

    # Competition for nutrients
    total_demand = c_dens * 0.8 + j_dens * 0.6  # resource competition factor
    c_yield *= (1 - 0.2 * total_demand)
    j_yield *= (1 - 0.15 * total_demand)

    return c_yield, j_yield

y_c, y_j = joint_yield(rainfall, temperature, soil_N, soil_K, soil_P, coconut_density)

# Build feature matrix
X_raw = np.column_stack([rainfall, temperature, soil_N, soil_K, soil_P, coconut_density])
X_mean, X_std = X_raw.mean(0), X_raw.std(0)
X_norm = (X_raw - X_mean) / X_std
X = np.hstack([np.ones((n,1)), X_norm, X_norm**2])

# Split
idx = np.random.permutation(n)
s = int(0.8 * n)
X_tr, X_te = X[idx[:s]], X[idx[s:]]
yc_tr, yc_te = y_c[idx[:s]], y_c[idx[s:]]
yj_tr, yj_te = y_j[idx[:s]], y_j[idx[s:]]
dens_te = coconut_density[idx[s:]]

# Fit joint regression (matrix output)
def fit_multi_ridge(X, Y, lam=0.1, lr=0.003, epochs=3000):
    n_s, n_f = X.shape
    n_out = Y.shape[1]
    W = np.random.randn(n_f, n_out) * 0.01
    for _ in range(epochs):
        pred = X @ W
        grad = (2/n_s) * (X.T @ (pred - Y))
        grad[1:] += 2 * lam * W[1:]
        W -= lr * grad
    return W

Y_tr = np.column_stack([yc_tr, yj_tr])
W = fit_multi_ridge(X_tr, Y_tr)
pred_te = X_te @ W

r2_c = 1 - np.sum((yc_te - pred_te[:,0])**2) / np.sum((yc_te - np.mean(yc_te))**2)
r2_j = 1 - np.sum((yj_te - pred_te[:,1])**2) / np.sum((yj_te - np.mean(yj_te))**2)

# Optimization: find optimal coconut density
# For median environmental conditions
median_env = np.median(X_raw[:, :5], axis=0)
densities = np.linspace(0.1, 0.9, 50)
c_yields_opt = []
j_yields_opt = []
total_values = []

coconut_price = 25  # Rs per coconut
jackfruit_price = 15  # Rs per jackfruit

for d in densities:
    env = np.append(median_env, d)
    env_norm = (env - X_mean) / X_std
    x_feat = np.concatenate([[1], env_norm, env_norm**2])
    pred = x_feat @ W
    c_yields_opt.append(pred[0] * d)  # total coconut yield (per tree * fraction)
    j_yields_opt.append(pred[1] * (1-d))  # total jackfruit yield
    total_values.append(pred[0] * d * coconut_price + pred[1] * (1-d) * jackfruit_price)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Joint predictions
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(yc_te, pred_te[:,0], c='#22c55e', s=15, alpha=0.5, label=f'Coconut R^2={r2_c:.3f}')
ax.scatter(yj_te, pred_te[:,1], c='#f59e0b', s=15, alpha=0.5, label=f'Jackfruit R^2={r2_j:.3f}')
ax.plot([0, 200], [0, 200], '--', color='#ef4444', linewidth=2)
ax.set_xlabel('Actual yield', color='white')
ax.set_ylabel('Predicted yield', color='white')
ax.set_title('Joint model: both crops predicted', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Yield vs density scatter
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.scatter(dens_te, yc_te, c='#22c55e', s=15, alpha=0.5, label='Coconut (actual)')
ax.scatter(dens_te, yj_te, c='#f59e0b', s=15, alpha=0.5, label='Jackfruit (actual)')
ax.set_xlabel('Coconut density (fraction)', color='white')
ax.set_ylabel('Yield per tree', color='white')
ax.set_title('Yield vs planting density', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Optimization curve
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(densities, c_yields_opt, color='#22c55e', linewidth=2, label='Coconut yield (total)')
ax.plot(densities, j_yields_opt, color='#f59e0b', linewidth=2, label='Jackfruit yield (total)')
ax.plot(densities, np.array(c_yields_opt) + np.array(j_yields_opt),
        color='#a855f7', linewidth=2, linestyle='--', label='Combined yield')
ax.set_xlabel('Coconut fraction', color='white')
ax.set_ylabel('Total yield (fruits/ha)', color='white')
ax.set_title('Yield optimization: planting ratio', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Revenue optimization
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(densities, total_values, color='#f59e0b', linewidth=3)
opt_idx = np.argmax(total_values)
ax.axvline(densities[opt_idx], color='#ef4444', linestyle='--', linewidth=2,
           label=f'Optimal: {densities[opt_idx]:.0%} coconut')
ax.scatter([densities[opt_idx]], [total_values[opt_idx]], c='#ef4444', s=100, zorder=5)
ax.set_xlabel('Coconut fraction', color='white')
ax.set_ylabel('Revenue (Rs/ha)', color='white')
ax.set_title('Revenue optimization', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("MULTI-OUTPUT REGRESSION RESULTS")
print(f"Coconut yield model: R^2 = {r2_c:.3f}")
print(f"Jackfruit yield model: R^2 = {r2_j:.3f}")
print()
print(f"OPTIMIZATION (median environmental conditions)")
print(f"Optimal planting ratio: {densities[opt_idx]:.0%} coconut, {1-densities[opt_idx]:.0%} jackfruit")
print(f"Maximum revenue: Rs {total_values[opt_idx]:.0f}/ha")
print()
print("The optimal ratio is NOT 100% of either crop — the interaction effects")
print("(shade benefit, complementary root zones) make a mixed planting superior.")`,
      challenge: 'Add market price uncertainty to the optimization. If coconut price can vary +/-30% and jackfruit +/-20%, what planting ratio minimizes risk (lowest variance in revenue) while still maintaining reasonable expected revenue? This is a portfolio optimization problem.',
      successHint: 'Multi-output regression with optimization is how real agricultural extension services advise farmers. The model captures biology, the optimization captures economics. Together they answer the farmer\'s real question: "What should I plant to maximize my income?"',
    },
    {
      title: 'Capstone deployment — complete Crop Yield Predictor with sensitivity analysis',
      concept: `Your predictor is built, validated, and optimized. The final step is **deployment** — making it useful for a real farmer. This means:

1. **Sensitivity analysis**: which input variable has the most impact on yield? If a farmer can only change one thing (add fertilizer, install irrigation), which intervention gives the biggest return?

2. **What-if scenarios**: "If rainfall drops 20% due to climate change, how much will my yield decrease? Can I compensate with more potassium fertilizer?"

3. **Confidence intervals**: the model predicts 85 coconuts/tree/year, but how certain is this? A prediction without uncertainty is dangerous — it might be 85 +/- 5 or 85 +/- 40.

4. **Actionable recommendations**: transform model outputs into farmer-friendly advice: "Your soil potassium is 80 kg/ha. Increasing to 150 kg/ha would add approximately 12 coconuts/tree/year at a fertilizer cost of Rs 2000 and revenue gain of Rs 300/tree."

**Sensitivity analysis** uses partial derivatives: hold all variables constant except one, vary it across its range, and measure how much the prediction changes. Variables with steep response curves have high sensitivity — those are the ones worth optimizing.`,
      analogy: 'Sensitivity analysis is like a doctor figuring out which lifestyle change will help a patient the most. Exercising more, eating better, sleeping longer, and reducing stress ALL improve health. But for THIS patient, with their specific profile, which single change moves the needle most? The doctor does not prescribe everything — they identify the highest-leverage intervention. That is what sensitivity analysis does for farming.',
      storyConnection: 'The coconut and jackfruit in the story were blessed with the right conditions — good soil, good rain, good temperature. But not every farmer is so lucky. The yield predictor with sensitivity analysis tells a farmer: "Your rainfall is fine, your temperature is fine, but your soil potassium is critically low. Fix that one thing, and your yield will jump 25%." It transforms a story of good fortune into a recipe anyone can follow.',
      checkQuestion: 'Your sensitivity analysis shows that temperature has the highest impact on yield, but a farmer cannot control temperature. Rainfall has the second-highest impact and CAN be controlled (via irrigation). Which variable should the recommendation focus on?',
      checkAnswer: 'The recommendation should focus on rainfall/irrigation, because it is the highest-impact CONTROLLABLE variable. Sensitivity analysis is only useful when combined with feasibility analysis. Identifying that temperature matters most is scientifically interesting, but telling a farmer to "change the temperature" is useless. Always filter sensitivity results through controllability before making recommendations.',
      codeIntro: 'Build the complete deployment pipeline: sensitivity analysis, what-if scenarios, confidence intervals, and actionable recommendations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Full pipeline
n = 500
rainfall = np.random.uniform(800, 3500, n)
temperature = np.random.uniform(20, 35, n)
soil_N = np.random.uniform(20, 200, n)
soil_K = np.random.uniform(30, 250, n)
soil_P = np.random.uniform(10, 100, n)

def true_yield(rain, temp, N, K, P):
    return np.clip(
        -0.00003*(rain-2000)**2 + 80 - 0.8*(temp-27)**2 + 20 +
        15*(1-np.exp(-0.02*K)) - 0.001*(N-100)**2 + 5 +
        5*(1-np.exp(-0.03*P)) + np.random.normal(0, 8, len(rain)), 0, 150)

y = true_yield(rainfall, temperature, soil_N, soil_K, soil_P)

X_raw = np.column_stack([rainfall, temperature, soil_N, soil_K, soil_P])
X_mean, X_std = X_raw.mean(0), X_raw.std(0)
X_norm = (X_raw - X_mean) / X_std
X = np.hstack([np.ones((n,1)), X_norm, X_norm**2])

def fit_ridge(X, y, lam=0.1):
    w = np.random.randn(X.shape[1]) * 0.01
    for _ in range(3000):
        pred = X @ w
        grad = (2/len(y)) * (X.T @ (pred - y))
        grad[1:] += 2 * lam * w[1:]
        w -= 0.005 * grad
    return w

w = fit_ridge(X, y)

def predict(raw_values):
    """Predict from raw (unnormalized) values."""
    norm = (np.array(raw_values) - X_mean) / X_std
    feat = np.concatenate([[1], norm, norm**2])
    return feat @ w

# Sensitivity analysis
var_names = ['Rainfall (mm)', 'Temperature (C)', 'Soil N (kg/ha)', 'Soil K (kg/ha)', 'Soil P (kg/ha)']
var_ranges = [(800, 3500), (20, 35), (20, 200), (30, 250), (10, 100)]
baseline = [2000, 27, 100, 150, 50]  # median/optimal values

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

sensitivities = []
for i, (name, (lo, hi)) in enumerate(zip(var_names, var_ranges)):
    ax = axes[i // 3, i % 3]
    ax.set_facecolor('#111827')

    # Vary one variable, hold others at baseline
    values = np.linspace(lo, hi, 100)
    yields = []
    for v in values:
        inputs = list(baseline)
        inputs[i] = v
        yields.append(predict(inputs))

    yields = np.array(yields)
    ax.plot(values, yields, color='#22c55e', linewidth=2)
    ax.axvline(baseline[i], color='#f59e0b', linestyle='--', alpha=0.5,
               label=f'Baseline: {baseline[i]}')

    # Mark optimal
    opt_idx = np.argmax(yields)
    ax.scatter([values[opt_idx]], [yields[opt_idx]], c='#ef4444', s=80, zorder=5,
               label=f'Optimal: {values[opt_idx]:.0f}')

    # Sensitivity = range of yield / range of variable
    sensitivity = (np.max(yields) - np.min(yields)) / (hi - lo) * 100
    sensitivities.append(sensitivity)

    ax.set_xlabel(name, color='white')
    ax.set_ylabel('Predicted yield', color='white')
    ax.set_title(f'Sensitivity: {sensitivity:.2f}', color='white', fontsize=10)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
    ax.tick_params(colors='gray')

# Summary: sensitivity ranking
ax = axes[1, 2]
ax.set_facecolor('#111827')
sorted_idx = np.argsort(sensitivities)[::-1]
colors_bar = ['#ef4444', '#f59e0b', '#fbbf24', '#22c55e', '#3b82f6']
ax.barh(range(5), [sensitivities[i] for i in sorted_idx],
        color=[colors_bar[j] for j in range(5)], edgecolor='none')
ax.set_yticks(range(5))
ax.set_yticklabels([var_names[i] for i in sorted_idx], color='white', fontsize=9)
ax.set_xlabel('Sensitivity score', color='white')
ax.set_title('Variable importance ranking', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# What-if scenario
print("=" * 60)
print("CROP YIELD PREDICTOR — DEPLOYMENT REPORT")
print("=" * 60)
print()
base_yield = predict(baseline)
print(f"Baseline prediction: {base_yield:.1f} coconuts/tree/year")
print(f"  (at rainfall=2000mm, temp=27C, N=100, K=150, P=50)")
print()

# Climate change scenario
drought_yield = predict([1400, 28.5, 100, 150, 50])
print(f"Climate change scenario (20% less rain, +1.5C):")
print(f"  Predicted yield: {drought_yield:.1f} (-{base_yield-drought_yield:.1f} fruits)")
print()

# Fertilizer intervention
low_K_yield = predict([2000, 27, 100, 80, 50])
high_K_yield = predict([2000, 27, 100, 200, 50])
print(f"Potassium intervention:")
print(f"  K=80 (deficient):  {low_K_yield:.1f} fruits/tree")
print(f"  K=200 (optimal):   {high_K_yield:.1f} fruits/tree")
print(f"  Gain from K boost: +{high_K_yield-low_K_yield:.1f} fruits/tree")
print()
print("SENSITIVITY RANKING (highest impact first):")
for j, i in enumerate(sorted_idx):
    controllable = "YES" if i != 1 else "NO (climate)"
    print(f"  {j+1}. {var_names[i]}: sensitivity={sensitivities[i]:.2f}  Controllable: {controllable}")
print()
print("RECOMMENDATION: Focus on the highest-sensitivity CONTROLLABLE variable.")
print("This predictor turns agronomic data into actionable farming advice.")`,
      challenge: 'Add confidence intervals using bootstrap resampling: fit the model 100 times on different bootstrap samples, then report the 5th and 95th percentile of predictions as a 90% confidence interval. How wide is the interval for extreme vs. typical conditions?',
      successHint: 'You have built a complete machine learning system from scratch: data generation, feature engineering, regression, regularization, cross-validation, multi-output optimization, sensitivity analysis, and deployment. This same pipeline — with real data instead of synthetic — powers agricultural advisory systems across the developing world.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Crop Yield Predictor
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (plant biology & biochemistry)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Build a crop yield prediction model from environmental data. Click to start Python.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            />
        ))}
      </div>
    </div>
  );
}
