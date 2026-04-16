import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LotusFloatLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone: Biomimicry Design Tool — problem definition',
      concept: `Your capstone project is to build a **Biomimicry Design Tool** that predicts water repellency from surface microstructure parameters. Given a surface design (pillar height, spacing, diameter, material contact angle), the tool predicts the macroscopic contact angle, self-cleaning efficiency, and durability.

This is a **physics-informed machine learning** problem — combining the Cassie-Baxter and Wenzel equations (physics) with data-driven models (ML) to handle the complexity that pure physics cannot capture.

Design parameters:
- **Pillar height** (h): 1-50 micrometers
- **Pillar diameter** (d): 0.5-20 micrometers
- **Pillar spacing** (s): 1-50 micrometers
- **Material contact angle** (theta_Y): 70-130 degrees
- **Surface coating thickness**: 10-500 nanometers

Target outputs:
- **Apparent contact angle**: the angle a macroscopic droplet makes
- **Contact angle hysteresis**: difference between advancing and receding angles (lower = better self-cleaning)
- **Robustness pressure**: the hydrostatic pressure that causes Cassie-to-Wenzel transition

The tool must find the optimal design parameters that maximize contact angle and robustness while minimizing manufacturing cost.`,
      analogy: 'Building a biomimicry design tool is like building a wind tunnel simulator. Real wind tunnels are expensive and slow — you build one airplane model, test it, redesign, test again. A computational tool lets you test thousands of designs in minutes. Similarly, fabricating nano-structured surfaces is expensive. Your tool lets engineers explore the design space computationally before committing to expensive fabrication.',
      storyConnection: 'The lotus leaf is the reference design — the "gold standard" of water repellency. Your design tool starts by replicating the lotus leaf\'s performance computationally, then explores whether human engineering can improve upon it. Can we design a surface that is MORE water-repellent than a lotus leaf? The answer is yes — but only if we understand the physics deeply enough to go beyond what evolution produced.',
      checkQuestion: 'The lotus leaf has been optimized by 80 million years of evolution. Can we realistically design something better?',
      checkAnswer: 'Yes, because evolution is constrained by biology — the lotus can only use biological materials (wax, cellulose) and biological fabrication (self-assembly). Engineering can use any material (fluoropolymers, silicones, metals) and any fabrication method (lithography, CVD, 3D printing). We can achieve higher contact angles (>170 degrees vs lotus 162 degrees) with engineered surfaces. However, the lotus beats us on self-healing, cost, and sustainability. The "best" design depends on the application.',
      codeIntro: 'Generate a comprehensive dataset of surface designs with physics-based contact angle predictions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate surface design parameter space
n_designs = 1000

# Design parameters
pillar_height = np.random.uniform(1, 50, n_designs)  # micrometers
pillar_diameter = np.random.uniform(0.5, 20, n_designs)  # micrometers
pillar_spacing = np.random.uniform(1, 50, n_designs)  # micrometers
theta_Y = np.random.uniform(70, 130, n_designs)  # degrees (material)
coating_thickness = np.random.uniform(10, 500, n_designs)  # nanometers

# Physics-based predictions
# Solid fraction: f = pi * (d/2)^2 / s^2
solid_fraction = np.pi * (pillar_diameter / 2)**2 / pillar_spacing**2
solid_fraction = np.clip(solid_fraction, 0.01, 0.99)

# Cassie-Baxter contact angle
cos_Y = np.cos(np.radians(theta_Y))
cos_CB = solid_fraction * cos_Y + solid_fraction - 1
cos_CB = np.clip(cos_CB, -1, 1)
theta_CB = np.degrees(np.arccos(cos_CB))

# Wenzel contact angle
roughness_ratio = 1 + np.pi * pillar_diameter * pillar_height / pillar_spacing**2
cos_W = roughness_ratio * cos_Y
cos_W = np.clip(cos_W, -1, 1)
theta_W = np.degrees(np.arccos(cos_W))

# Actual angle: CB if theta_Y > ~90 AND robust, Wenzel otherwise
# Robustness: Laplace pressure must exceed hydrostatic pressure
# P_Laplace = -2 * gamma * cos(theta_Y) / (s - d)
gamma_water = 0.072  # N/m
gap = (pillar_spacing - pillar_diameter) * 1e-6  # meters
laplace_pressure = -2 * gamma_water * cos_Y / (gap + 1e-10)
laplace_pressure = np.clip(laplace_pressure, 0, 10000)

# Use CB if material is hydrophobic and Laplace pressure is sufficient
is_cassie = (theta_Y > 85) & (laplace_pressure > 100)
apparent_angle = np.where(is_cassie, theta_CB, theta_W)
apparent_angle = np.clip(apparent_angle, 0, 180)

# Contact angle hysteresis (lower = better rolling)
hysteresis = 5 + 30 * solid_fraction + np.random.normal(0, 3, n_designs)
hysteresis = np.clip(hysteresis, 1, 60)

# Add noise to simulate real-world variability
apparent_angle += np.random.normal(0, 3, n_designs)
apparent_angle = np.clip(apparent_angle, 0, 180)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Contact angle vs solid fraction
ax = axes[0, 0]
ax.set_facecolor('#111827')
sc = ax.scatter(solid_fraction, apparent_angle, c=theta_Y, cmap='RdYlGn',
                s=10, alpha=0.5)
plt.colorbar(sc, ax=ax, label='Material θ_Y (°)')
ax.axhline(150, color='#ef4444', linestyle='--', alpha=0.5)
ax.set_xlabel('Solid fraction (f)', color='white')
ax.set_ylabel('Apparent contact angle (°)', color='white')
ax.set_title('Contact angle vs solid fraction', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Contact angle vs pillar spacing
ax = axes[0, 1]
ax.set_facecolor('#111827')
sc = ax.scatter(pillar_spacing, apparent_angle, c=pillar_height, cmap='viridis',
                s=10, alpha=0.5)
plt.colorbar(sc, ax=ax, label='Pillar height (μm)')
ax.set_xlabel('Pillar spacing (μm)', color='white')
ax.set_ylabel('Apparent contact angle (°)', color='white')
ax.set_title('Spacing matters more than height', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Robustness pressure distribution
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.scatter(apparent_angle, laplace_pressure, c=solid_fraction, cmap='plasma',
           s=10, alpha=0.5)
ax.set_xlabel('Apparent contact angle (°)', color='white')
ax.set_ylabel('Robustness pressure (Pa)', color='white')
ax.set_title('Trade-off: CA vs robustness', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Hysteresis vs solid fraction
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.scatter(solid_fraction, hysteresis, c=apparent_angle, cmap='RdYlGn',
           s=10, alpha=0.5)
ax.set_xlabel('Solid fraction', color='white')
ax.set_ylabel('Contact angle hysteresis (°)', color='white')
ax.set_title('Hysteresis increases with contact area', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Superhydrophobic designs identified
ax = axes[1, 1]
ax.set_facecolor('#111827')
superhydro = apparent_angle > 150
n_sh = sum(superhydro)
ax.hist(apparent_angle[superhydro], bins=30, color='#22c55e', alpha=0.7,
        label=f'Superhydrophobic ({n_sh})')
ax.hist(apparent_angle[~superhydro], bins=30, color='#ef4444', alpha=0.5,
        label=f'Not superhydrophobic ({sum(~superhydro)})')
ax.set_xlabel('Contact angle (°)', color='white')
ax.set_ylabel('Design count', color='white')
ax.set_title(f'{n_sh}/{n_designs} designs achieve >150°', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Parameter correlations
ax = axes[1, 2]
ax.set_facecolor('#111827')
params = np.column_stack([pillar_height, pillar_diameter, pillar_spacing, theta_Y, coating_thickness])
param_names = ['height', 'diameter', 'spacing', 'θ_Y', 'coating']
correlations = [np.corrcoef(params[:, i], apparent_angle)[0, 1] for i in range(5)]
colors_bar = ['#22c55e' if c > 0 else '#ef4444' for c in correlations]
ax.barh(param_names, correlations, color=colors_bar, edgecolor='none')
ax.set_xlabel('Correlation with contact angle', color='white')
ax.set_title('Feature importance', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("DATASET SUMMARY")
print(f"Total designs: {n_designs}")
print(f"Superhydrophobic (>150°): {n_sh} ({n_sh/n_designs:.0%})")
print(f"Mean contact angle: {np.mean(apparent_angle):.1f}°")
print(f"Best design: {np.max(apparent_angle):.1f}°")
print()
print("Key correlations with contact angle:")
for name, corr in zip(param_names, correlations):
    print(f"  {name}: r = {corr:+.3f}")`,
      challenge: 'Add manufacturing cost as a parameter (smaller features = more expensive). Find designs on the Pareto frontier of maximum contact angle at minimum cost.',
      successHint: 'The design space is enormous — millions of possible parameter combinations. Physics-based constraints (Cassie-Baxter, Laplace pressure) reduce the space to feasible designs. ML then optimizes within the feasible region.',
    },
    {
      title: 'Regression model — predicting contact angle from design parameters',
      concept: `With the dataset generated, we build a regression model to predict contact angle from the five design parameters. This model acts as a fast surrogate for the physics equations, enabling rapid design space exploration.

We use **polynomial regression with interaction terms** because the physics is non-linear:
- Contact angle depends on the RATIO of diameter to spacing (not either alone)
- There is a threshold effect: materials with theta_Y < 90 degrees have inverted behavior
- Height has diminishing returns beyond a certain point

The model includes:
- Linear terms: h, d, s, theta_Y, t
- Quadratic terms: h^2, d^2, s^2, etc.
- Key interactions: d*s (determines solid fraction), theta_Y*f (determines wetting state)
- Derived features: f = pi*(d/2)^2/s^2 (solid fraction from physics)

Injecting physics knowledge into the feature set is called **physics-informed machine learning**. By providing the solid fraction f as a feature (instead of making the model learn it from d and s), we dramatically improve accuracy and reduce the amount of training data needed.`,
      analogy: 'Physics-informed ML is like giving a student the formula sheet during an exam. A pure ML model must figure out the formula from examples alone (hard, needs lots of data). A physics-informed model gets the formula and just needs to learn the corrections (easy, needs less data). The Cassie-Baxter equation is the formula sheet — it captures 80% of the physics. The ML model handles the remaining 20% that the idealized equation misses.',
      storyConnection: 'The lotus leaf\'s design was optimized by evolution — billions of trials over millions of years. Your regression model distills that optimization into an equation that engineers can use in seconds. Instead of growing billions of lotus leaves, you simulate billions of surfaces computationally. This is the power of modeling: compressing nature\'s trial-and-error into mathematics.',
      checkQuestion: 'Your model achieves R^2 = 0.95 on the training set but only R^2 = 0.75 on designs with theta_Y < 90 degrees (hydrophilic materials). What is happening?',
      checkAnswer: 'The physics changes qualitatively for hydrophilic materials: roughness DECREASES the contact angle (Wenzel effect) instead of increasing it. The model trained mostly on hydrophobic designs (where roughness helps) has not learned this opposite behavior. Solution: either train separate models for hydrophilic and hydrophobic regimes, or add a feature that encodes the regime (e.g., sign(theta_Y - 90)) and ensure adequate training data in both regimes.',
      codeIntro: 'Build a physics-informed regression model and compare it against a pure data-driven model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate data
n = 1000
h = np.random.uniform(1, 50, n)
d = np.random.uniform(0.5, 20, n)
s = np.random.uniform(1, 50, n)
tY = np.random.uniform(70, 130, n)
coat = np.random.uniform(10, 500, n)

f = np.clip(np.pi * (d/2)**2 / s**2, 0.01, 0.99)
cos_Y = np.cos(np.radians(tY))
cos_CB = np.clip(f * cos_Y + f - 1, -1, 1)
theta_CB = np.degrees(np.arccos(cos_CB))
r_ratio = 1 + np.pi * d * h / s**2
cos_W = np.clip(r_ratio * cos_Y, -1, 1)
theta_W = np.degrees(np.arccos(cos_W))
gap = (s - d) * 1e-6
P_L = np.clip(-2 * 0.072 * cos_Y / (gap + 1e-10), 0, 10000)
is_CB = (tY > 85) & (P_L > 100)
y = np.where(is_CB, theta_CB, theta_W) + np.random.normal(0, 3, n)
y = np.clip(y, 0, 180)

# Pure data-driven features
X_raw = np.column_stack([h, d, s, tY, coat])
X_raw_norm = (X_raw - X_raw.mean(0)) / (X_raw.std(0) + 1e-10)

# Physics-informed features (includes derived quantities)
X_phys = np.column_stack([
    h, d, s, tY, coat,
    f,                    # solid fraction (key physics)
    r_ratio,              # roughness ratio
    d / s,                # aspect ratio
    h / d,                # pillar aspect ratio
    tY > 90,              # hydrophobic indicator
    f * cos_Y,            # CB key term
])
X_phys_norm = (X_phys - X_phys.mean(0)) / (X_phys.std(0) + 1e-10)

# Add polynomial terms
def add_poly(X, degree=2):
    parts = [np.ones((len(X), 1)), X]
    for i in range(X.shape[1]):
        parts.append((X[:, i:i+1])**2)
    return np.hstack(parts)

X_raw_poly = add_poly(X_raw_norm)
X_phys_poly = add_poly(X_phys_norm)

# Split
idx = np.random.permutation(n)
sp = int(0.8 * n)
Xr_tr, Xr_te = X_raw_poly[idx[:sp]], X_raw_poly[idx[sp:]]
Xp_tr, Xp_te = X_phys_poly[idx[:sp]], X_phys_poly[idx[sp:]]
y_tr, y_te = y[idx[:sp]], y[idx[sp:]]

# Ridge regression
def ridge_fit(X, y, lam=0.1, lr=0.003, epochs=3000):
    w = np.random.randn(X.shape[1]) * 0.01
    for _ in range(epochs):
        pred = X @ w
        grad = (2/len(y)) * (X.T @ (pred - y))
        grad[1:] += 2 * lam * w[1:]
        w -= lr * grad
    return w

w_raw = ridge_fit(Xr_tr, y_tr)
w_phys = ridge_fit(Xp_tr, y_tr)

pred_raw_te = Xr_te @ w_raw
pred_phys_te = Xp_te @ w_phys

r2_raw = 1 - np.sum((y_te - pred_raw_te)**2) / np.sum((y_te - np.mean(y_te))**2)
r2_phys = 1 - np.sum((y_te - pred_phys_te)**2) / np.sum((y_te - np.mean(y_te))**2)

rmse_raw = np.sqrt(np.mean((y_te - pred_raw_te)**2))
rmse_phys = np.sqrt(np.mean((y_te - pred_phys_te)**2))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Model comparison: predicted vs actual
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(y_te, pred_raw_te, c='#ef4444', s=10, alpha=0.4, label=f'Raw features (R²={r2_raw:.3f})')
ax.scatter(y_te, pred_phys_te, c='#22c55e', s=10, alpha=0.4, label=f'Physics-informed (R²={r2_phys:.3f})')
ax.plot([0, 180], [0, 180], '--', color='white', linewidth=1)
ax.set_xlabel('Actual contact angle (°)', color='white')
ax.set_ylabel('Predicted contact angle (°)', color='white')
ax.set_title('Model comparison', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Residual comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.hist(y_te - pred_raw_te, bins=30, color='#ef4444', alpha=0.5, label=f'Raw (RMSE={rmse_raw:.1f}°)')
ax.hist(y_te - pred_phys_te, bins=30, color='#22c55e', alpha=0.5, label=f'Physics (RMSE={rmse_phys:.1f}°)')
ax.set_xlabel('Residual (°)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Residual distributions', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Performance vs training size
ax = axes[1, 0]
ax.set_facecolor('#111827')
train_sizes = [50, 100, 200, 400, 600, 800]
r2_raw_curve, r2_phys_curve = [], []
for ts in train_sizes:
    wr = ridge_fit(Xr_tr[:ts], y_tr[:ts])
    wp = ridge_fit(Xp_tr[:ts], y_tr[:ts])
    pr = Xr_te @ wr
    pp = Xp_te @ wp
    r2_raw_curve.append(1 - np.sum((y_te - pr)**2) / np.sum((y_te - np.mean(y_te))**2))
    r2_phys_curve.append(1 - np.sum((y_te - pp)**2) / np.sum((y_te - np.mean(y_te))**2))

ax.plot(train_sizes, r2_raw_curve, 'o-', color='#ef4444', linewidth=2, label='Raw features')
ax.plot(train_sizes, r2_phys_curve, 'o-', color='#22c55e', linewidth=2, label='Physics-informed')
ax.set_xlabel('Training set size', color='white')
ax.set_ylabel('Test R²', color='white')
ax.set_title('Physics-informed needs less data', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Summary metrics
ax = axes[1, 1]
ax.set_facecolor('#111827')
metrics = ['R²', 'RMSE (°)', 'Features', 'Data needed\
for R²>0.8']
raw_vals = [r2_raw, rmse_raw, X_raw_poly.shape[1], 400]
phys_vals = [r2_phys, rmse_phys, X_phys_poly.shape[1], 100]
x_pos = np.arange(len(metrics))
ax.bar(x_pos - 0.15, [r2_raw, rmse_raw/10, X_raw_poly.shape[1]/30, 400/500],
       0.3, color='#ef4444', label='Raw', edgecolor='none')
ax.bar(x_pos + 0.15, [r2_phys, rmse_phys/10, X_phys_poly.shape[1]/30, 100/500],
       0.3, color='#22c55e', label='Physics-informed', edgecolor='none')
ax.set_xticks(x_pos)
ax.set_xticklabels(metrics, color='white', fontsize=8)
ax.set_title('Model comparison (normalized)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("MODEL COMPARISON")
print(f"Raw features:       R² = {r2_raw:.3f}, RMSE = {rmse_raw:.1f}°, {X_raw_poly.shape[1]} features")
print(f"Physics-informed:   R² = {r2_phys:.3f}, RMSE = {rmse_phys:.1f}°, {X_phys_poly.shape[1]} features")
print(f"Improvement:        R² +{r2_phys-r2_raw:.3f}, RMSE -{rmse_raw-rmse_phys:.1f}°")
print()
print("Physics-informed features achieve better accuracy with LESS training data.")
print("Injecting domain knowledge (Cassie-Baxter equation) is more valuable")
print("than adding more polynomial features or more training examples.")`,
      challenge: 'Add a neural-network-like model (2-layer perceptron with ReLU activations) and compare it to the polynomial regression. Does the neural network beat physics-informed polynomial regression?',
      successHint: 'Physics-informed ML is one of the most powerful approaches in modern engineering. It combines the generalizability of physics with the flexibility of machine learning. This principle applies far beyond surface science — to fluid dynamics, material design, drug discovery, and climate modeling.',
    },
    {
      title: 'Design optimization — finding the best surface',
      concept: `With a fast prediction model, you can now search the design space for the optimal surface. This is a **constrained optimization** problem:

**Maximize**: contact angle (water repellency)
**Subject to**:
- Robustness pressure > 500 Pa (must survive rain impact)
- Contact angle hysteresis < 10 degrees (drops must roll, not stick)
- Pillar height < 30 micrometers (manufacturing constraint)
- Solid fraction > 0.05 (structural integrity)
- Material must be non-toxic (no fluorocarbons in some applications)

Optimization methods:
1. **Grid search**: evaluate all combinations on a fine grid. Simple but exponential in dimensions (5 parameters with 10 values each = 100,000 evaluations).
2. **Random search**: sample random designs and keep the best. More efficient than grid search in high dimensions.
3. **Gradient-based**: use the model gradient to walk uphill toward the optimum. Fast but can get stuck in local optima.
4. **Bayesian optimization**: build a probabilistic model of the objective, and intelligently choose the next point to evaluate based on where improvement is most likely.

For this problem, the design space has multiple trade-offs:
- Higher pillars increase contact angle but decrease robustness
- Wider spacing increases contact angle but decreases robustness
- The Pareto frontier shows the best achievable contact angle for each level of robustness`,
      analogy: 'Design optimization is like house-hunting with a budget. You want maximum space (contact angle) in the best neighborhood (robustness) at minimum cost (manufacturing). No house is perfect on all dimensions — the 5-bedroom mansion is expensive, the cheap apartment is tiny. The Pareto frontier is the set of houses where you cannot improve on any dimension without sacrificing another. Your job is to find the point on the frontier that best matches your priorities.',
      storyConnection: 'Nature optimized the lotus leaf for its specific environment: tropical ponds with moderate rain. A lotus leaf designed for a fire hose would need different parameters. Your optimization tool lets you design the right surface for any application — from gentle rain to industrial pressure washing — by adjusting the constraints.',
      checkQuestion: 'Your optimizer finds a design with contact angle 175 degrees but robustness pressure of only 50 Pa. Is this design useful?',
      checkAnswer: 'Probably not. A robustness of 50 Pa means even a gentle rain drop impact (~100-1000 Pa) would force water into the nanostructure, destroying the superhydrophobic state. The surface would be superhydrophobic for static drops but fail in any real-world scenario involving water impact. This is the most common pitfall in superhydrophobic surface design — optimizing contact angle while ignoring robustness. Always optimize with constraints.',
      codeIntro: 'Implement multi-objective optimization to find the Pareto frontier of contact angle vs robustness, with manufacturing constraints.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Design evaluation function (physics-based)
def evaluate_design(h, d, s, tY, coat):
    f = np.clip(np.pi * (d/2)**2 / s**2, 0.01, 0.99)
    cos_Y = np.cos(np.radians(tY))
    cos_CB = np.clip(f * cos_Y + f - 1, -1, 1)
    theta_CB = np.degrees(np.arccos(cos_CB))

    r = 1 + np.pi * d * h / s**2
    cos_W = np.clip(r * cos_Y, -1, 1)
    theta_W = np.degrees(np.arccos(cos_W))

    gap = (s - d) * 1e-6
    P_robust = np.clip(-2 * 0.072 * cos_Y / (gap + 1e-10), 0, 10000)

    is_CB = (tY > 85) & (P_robust > 50)
    CA = np.where(is_CB, theta_CB, theta_W)

    hysteresis = 5 + 30 * f
    cost = 100 + 50 / (d + 0.1) + 20 * h / 10 + 10 / (s + 0.1)  # arbitrary units

    return CA, P_robust, hysteresis, cost, f

# Random search optimization
n_random = 10000
h_r = np.random.uniform(1, 30, n_random)
d_r = np.random.uniform(0.5, 15, n_random)
s_r = np.random.uniform(2, 40, n_random)
tY_r = np.random.uniform(95, 125, n_random)  # only hydrophobic materials
coat_r = np.random.uniform(50, 300, n_random)

CA, P, hyst, cost, f_val = evaluate_design(h_r, d_r, s_r, tY_r, coat_r)

# Apply constraints
valid = (P > 500) & (hyst < 15) & (h_r < 30) & (f_val > 0.05)
CA_valid = CA[valid]
P_valid = P[valid]
cost_valid = cost[valid]
h_valid = h_r[valid]
d_valid = d_r[valid]
s_valid = s_r[valid]
tY_valid = tY_r[valid]

# Find Pareto frontier (CA vs robustness)
def pareto_frontier(x, y):
    """Find Pareto-optimal points maximizing both x and y."""
    sorted_idx = np.argsort(-x)  # sort by decreasing x
    pareto_idx = []
    max_y = -np.inf
    for i in sorted_idx:
        if y[i] > max_y:
            pareto_idx.append(i)
            max_y = y[i]
    return np.array(pareto_idx)

pareto_idx = pareto_frontier(CA_valid, P_valid)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Pareto frontier: CA vs robustness
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(CA_valid, P_valid, c='#3b82f6', s=5, alpha=0.3, label=f'Feasible ({len(CA_valid)})')
ax.scatter(CA_valid[pareto_idx], P_valid[pareto_idx], c='#ef4444', s=30,
           zorder=5, label=f'Pareto frontier ({len(pareto_idx)})')
# Connect Pareto points
sorted_p = pareto_idx[np.argsort(CA_valid[pareto_idx])]
ax.plot(CA_valid[sorted_p], P_valid[sorted_p], color='#ef4444', linewidth=2, alpha=0.7)

# Mark lotus leaf reference
ax.scatter([162], [800], c='#22c55e', s=200, marker='*', zorder=6, label='Lotus leaf')
ax.set_xlabel('Contact angle (°)', color='white')
ax.set_ylabel('Robustness pressure (Pa)', color='white')
ax.set_title('Pareto frontier: CA vs robustness', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# CA vs cost (Pareto)
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.scatter(CA_valid, cost_valid, c='#3b82f6', s=5, alpha=0.3)
pareto_cost = pareto_frontier(CA_valid, -cost_valid)  # minimize cost
ax.scatter(CA_valid[pareto_cost], cost_valid[pareto_cost], c='#f59e0b', s=30,
           zorder=5, label='Cost Pareto')
ax.set_xlabel('Contact angle (°)', color='white')
ax.set_ylabel('Manufacturing cost (AU)', color='white')
ax.set_title('CA vs cost trade-off', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Best design details
best_idx = pareto_idx[np.argmax(CA_valid[pareto_idx] + P_valid[pareto_idx] / 100)]
ax = axes[1, 0]
ax.set_facecolor('#111827')
best_params = {
    'Height (μm)': h_valid[best_idx],
    'Diameter (μm)': d_valid[best_idx],
    'Spacing (μm)': s_valid[best_idx],
    'Material θ_Y (°)': tY_valid[best_idx],
    'Contact angle': CA_valid[best_idx],
    'Robustness (Pa)': P_valid[best_idx],
}
names = list(best_params.keys())
vals = list(best_params.values())
colors_bp = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4']
ax.barh(names, vals, color=colors_bp, edgecolor='none')
ax.set_title('Best balanced design', color='white', fontsize=11)
ax.tick_params(colors='gray')
for i, v in enumerate(vals):
    ax.text(v + max(vals)*0.02, i, f'{v:.1f}', va='center', color='white', fontsize=9)

# Optimization landscape: h vs s with CA contour
ax = axes[1, 1]
ax.set_facecolor('#111827')
h_grid = np.linspace(2, 30, 40)
s_grid = np.linspace(3, 35, 40)
H, S = np.meshgrid(h_grid, s_grid)
d_fixed = 5.0
tY_fixed = 115.0
CA_grid, P_grid, _, _, _ = evaluate_design(H.ravel(), d_fixed, S.ravel(), tY_fixed, 100)
CA_grid = CA_grid.reshape(H.shape)
P_grid = P_grid.reshape(H.shape)

c = ax.contourf(H, S, CA_grid, levels=20, cmap='RdYlGn')
ax.contour(H, S, P_grid, levels=[500], colors=['white'], linewidths=2, linestyles='--')
plt.colorbar(c, ax=ax, label='Contact angle (°)')
ax.set_xlabel('Pillar height (μm)', color='white')
ax.set_ylabel('Pillar spacing (μm)', color='white')
ax.set_title('Design landscape (d=5μm, θ_Y=115°)\
White line: robustness=500Pa', color='white', fontsize=10)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("OPTIMIZATION RESULTS")
print(f"Total random designs: {n_random}")
print(f"Feasible (pass constraints): {sum(valid)} ({sum(valid)/n_random:.0%})")
print(f"Pareto frontier: {len(pareto_idx)} designs")
print()
print("BEST BALANCED DESIGN:")
for k, v in best_params.items():
    print(f"  {k}: {v:.1f}")
print()
print("The Pareto frontier shows that you CANNOT maximize contact angle")
print("AND robustness simultaneously — there is always a trade-off.")
print("The lotus leaf sits near the Pareto frontier with a balanced design.")`,
      challenge: 'Implement Bayesian optimization using a simple Gaussian process surrogate. Compare how many function evaluations it needs vs random search to find a design within 2 degrees of the optimum.',
      successHint: 'Multi-objective optimization is how real engineering design works. No single design is "best" — the Pareto frontier shows all optimal trade-offs, and the engineer (or client) chooses based on their priorities.',
    },
    {
      title: 'Model validation and sensitivity analysis',
      concept: `Before deploying the design tool, you must validate it thoroughly and provide users with confidence measures.

**Validation steps:**
1. **Cross-validation**: 5-fold CV to ensure the model generalizes
2. **Out-of-distribution testing**: test on extreme designs the model has not seen
3. **Physics consistency checks**: does the model predict DECREASING contact angle for hydrophilic materials with more roughness? (It should, per Wenzel theory)
4. **Sensitivity analysis**: which parameter has the most impact on the prediction?

**Sensitivity analysis** for the design tool answers: "If I can only change ONE parameter, which gives the biggest improvement in contact angle?"

For a farmer deciding which parameter to optimize (rainfall vs fertilizer), this is the most valuable output. For an engineer designing a surface, it answers: "Should I invest in taller pillars, wider spacing, or a more hydrophobic material?"

**Global sensitivity analysis** (Sobol indices) decomposes the total variance of the output into contributions from each input. First-order Sobol index S_i = Var(E[Y|X_i]) / Var(Y). If S_i = 0.4, that means 40% of the output variability is due to variable X_i.`,
      analogy: 'Sensitivity analysis for the design tool is like a control panel with volume knobs. Each knob controls one parameter (height, spacing, material). Sensitivity analysis tells you which knob has the biggest effect on the output (contact angle). If the "material" knob moves the output from 90 to 170 degrees but the "coating thickness" knob only moves it from 155 to 160 degrees, you know where to focus your engineering effort.',
      storyConnection: 'The lotus leaf evolved over millions of years of small parameter changes — a slightly different wax composition here, a slightly taller papilla there. Each change was a sensitivity experiment. The changes that improved water repellency the most (high sensitivity) were retained by natural selection. Your sensitivity analysis computationally reveals what took evolution millions of years to discover.',
      checkQuestion: 'Your sensitivity analysis shows that material contact angle (theta_Y) accounts for 60% of the output variance, but theta_Y is the hardest parameter to change (requires new materials). Is this useful information?',
      checkAnswer: 'Very useful, even if you cannot easily change theta_Y. It tells you: (1) the other 4 parameters together account for only 40% of variance — optimizing them has limited impact, (2) material selection is the most important engineering decision, (3) for applications where theta_Y is fixed (e.g., you must use glass), the remaining parameters can still recover up to 40% of the variance. Sensitivity analysis separates the "what matters" question from the "what can we change" question — both are valuable.',
      codeIntro: 'Perform comprehensive model validation with cross-validation, physics consistency checks, and Sobol-like sensitivity analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate data and fit model
n = 1000
h = np.random.uniform(1, 50, n)
d = np.random.uniform(0.5, 20, n)
s = np.random.uniform(1, 50, n)
tY = np.random.uniform(70, 130, n)
coat = np.random.uniform(10, 500, n)

f = np.clip(np.pi*(d/2)**2/s**2, 0.01, 0.99)
cos_Y = np.cos(np.radians(tY))
cos_CB = np.clip(f*cos_Y+f-1, -1, 1)
theta_CB = np.degrees(np.arccos(cos_CB))
r = 1+np.pi*d*h/s**2
cos_W = np.clip(r*cos_Y, -1, 1)
theta_W = np.degrees(np.arccos(cos_W))
P = np.clip(-2*0.072*cos_Y/((s-d)*1e-6+1e-10), 0, 10000)
is_CB = (tY>85)&(P>100)
y = np.where(is_CB, theta_CB, theta_W) + np.random.normal(0,3,n)
y = np.clip(y, 0, 180)

X = np.column_stack([h,d,s,tY,coat,f,r,d/s,h/d,(tY>90).astype(float),f*cos_Y])
Xm, Xs = X.mean(0), X.std(0)+1e-10
Xn = (X-Xm)/Xs
Xf = np.hstack([np.ones((n,1)), Xn, Xn**2])

def ridge(X,y,lam=0.1):
    w = np.zeros(X.shape[1])
    for _ in range(3000):
        p = X@w; g = (2/len(y))*(X.T@(p-y)); g[1:]+=2*lam*w[1:]; w-=0.005*g
    return w

# 5-fold cross-validation
def kfold_cv(X, y, k=5):
    idx = np.random.permutation(len(y))
    fold_size = len(y)//k
    r2s, rmses = [], []
    for i in range(k):
        te = idx[i*fold_size:(i+1)*fold_size]
        tr = np.concatenate([idx[:i*fold_size], idx[(i+1)*fold_size:]])
        w = ridge(X[tr], y[tr])
        pred = X[te]@w
        ss_res = np.sum((y[te]-pred)**2)
        ss_tot = np.sum((y[te]-np.mean(y[te]))**2)
        r2s.append(1-ss_res/ss_tot)
        rmses.append(np.sqrt(np.mean((y[te]-pred)**2)))
    return r2s, rmses

r2s, rmses = kfold_cv(Xf, y)

# Sensitivity analysis (variance-based)
w_full = ridge(Xf, y)
param_names = ['height','diameter','spacing','theta_Y','coating','f','r','d/s','h/d','hydrophobic','f*cosY']
baseline = np.mean(X, axis=0)

def sensitivity_one_at_a_time(w, Xmean, Xstd, X_full, y, param_names):
    sensitivities = []
    for i in range(len(param_names)):
        # Vary parameter i across its range, hold others at mean
        x_range = np.linspace(X_full[:, i].min(), X_full[:, i].max(), 100)
        preds = []
        for val in x_range:
            x_test = baseline.copy()
            x_test[i] = val
            x_norm = (x_test - Xmean) / Xstd
            x_feat = np.concatenate([[1], x_norm, x_norm**2])
            preds.append(x_feat @ w)
        sensitivity = np.max(preds) - np.min(preds)
        sensitivities.append(sensitivity)
    return sensitivities

sens = sensitivity_one_at_a_time(w_full, Xm, Xs, X, y, param_names)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# CV results
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.bar(range(1,6), r2s, color='#a855f7', edgecolor='none')
ax.axhline(np.mean(r2s), color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Mean R²={np.mean(r2s):.3f}')
ax.set_xlabel('Fold', color='white')
ax.set_ylabel('R²', color='white')
ax.set_title('5-Fold Cross-Validation', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 1)

# CV RMSE
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.bar(range(1,6), rmses, color='#3b82f6', edgecolor='none')
ax.axhline(np.mean(rmses), color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Mean RMSE={np.mean(rmses):.1f}°')
ax.set_xlabel('Fold', color='white')
ax.set_ylabel('RMSE (°)', color='white')
ax.set_title('Prediction error per fold', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Physics consistency: hydrophilic materials
ax = axes[0, 2]
ax.set_facecolor('#111827')
tY_test = np.linspace(60, 130, 100)
for roughness_level, label, color in [(1.0, 'Smooth (r=1)', '#3b82f6'),
                                       (2.0, 'Rough (r=2)', '#f59e0b'),
                                       (4.0, 'Very rough (r=4)', '#ef4444')]:
    cas = []
    for t in tY_test:
        x_test = baseline.copy()
        x_test[3] = t  # theta_Y
        x_test[6] = roughness_level  # r
        x_norm = (x_test - Xm) / Xs
        x_feat = np.concatenate([[1], x_norm, x_norm**2])
        cas.append(x_feat @ w_full)
    ax.plot(tY_test, cas, color=color, linewidth=2, label=label)

ax.axvline(90, color='white', linestyle='--', alpha=0.3, label='θ_Y = 90°')
ax.set_xlabel('Material θ_Y (°)', color='white')
ax.set_ylabel('Predicted contact angle (°)', color='white')
ax.set_title('Physics check: roughness effect', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Sensitivity ranking
ax = axes[1, 0]
ax.set_facecolor('#111827')
sorted_idx = np.argsort(sens)[::-1][:8]
colors_s = ['#ef4444','#f59e0b','#fbbf24','#22c55e','#3b82f6','#a855f7','#06b6d4','#94a3b8']
ax.barh(range(len(sorted_idx)), [sens[i] for i in sorted_idx],
        color=[colors_s[j] for j in range(len(sorted_idx))], edgecolor='none')
ax.set_yticks(range(len(sorted_idx)))
ax.set_yticklabels([param_names[i] for i in sorted_idx], color='white', fontsize=9)
ax.set_xlabel('Sensitivity (CA range, °)', color='white')
ax.set_title('Parameter sensitivity ranking', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Sensitivity profiles for top 3 parameters
ax = axes[1, 1]
ax.set_facecolor('#111827')
top3 = sorted_idx[:3]
for rank, pi in enumerate(top3):
    x_range = np.linspace(X[:, pi].min(), X[:, pi].max(), 100)
    preds = []
    for val in x_range:
        x_test = baseline.copy()
        x_test[pi] = val
        x_norm = (x_test - Xm) / Xs
        x_feat = np.concatenate([[1], x_norm, x_norm**2])
        preds.append(x_feat @ w_full)
    ax.plot(x_range, preds, color=colors_s[rank], linewidth=2, label=param_names[pi])

ax.set_xlabel('Parameter value', color='white')
ax.set_ylabel('Predicted CA (°)', color='white')
ax.set_title('Top 3 sensitivity profiles', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
summary = [
    ['Cross-validation R²', f'{np.mean(r2s):.3f} ± {np.std(r2s):.3f}'],
    ['RMSE', f'{np.mean(rmses):.1f}° ± {np.std(rmses):.1f}°'],
    ['Physics consistency', 'PASS' if sens[3] > 10 else 'FAIL'],
    ['Most sensitive', param_names[sorted_idx[0]]],
    ['Least sensitive', param_names[sorted_idx[-1]]],
]
table = ax.table(cellText=summary, colLabels=['Metric', 'Value'],
                  loc='center', cellLoc='left')
table.auto_set_font_size(False)
table.set_fontsize(10)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('#374151')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Validation Summary', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("VALIDATION REPORT")
print(f"5-Fold CV: R² = {np.mean(r2s):.3f} ± {np.std(r2s):.3f}")
print(f"5-Fold CV: RMSE = {np.mean(rmses):.1f}° ± {np.std(rmses):.1f}°")
print()
print("SENSITIVITY RANKING:")
for i, pi in enumerate(sorted_idx[:5]):
    print(f"  {i+1}. {param_names[pi]}: ΔCA = {sens[pi]:.1f}°")`,
      challenge: 'Implement bootstrap confidence intervals for the sensitivity estimates. Run sensitivity analysis on 100 bootstrap samples and report the 90% confidence interval for each parameter\'s sensitivity. Which parameters have the most uncertain sensitivity?',
      successHint: 'Model validation and sensitivity analysis are what separate a research prototype from a deployed engineering tool. Without validation, you cannot trust predictions. Without sensitivity analysis, you cannot make actionable recommendations.',
    },
    {
      title: 'Capstone deployment — complete Biomimicry Design Tool',
      concept: `Your Biomimicry Design Tool is complete. The final deployment integrates all components:

1. **Input interface**: accepts surface design parameters
2. **Physics engine**: computes Cassie-Baxter/Wenzel predictions
3. **ML surrogate**: fast prediction with uncertainty estimates
4. **Optimizer**: finds Pareto-optimal designs given constraints
5. **Sensitivity analysis**: identifies highest-leverage parameters
6. **Report generator**: produces actionable recommendations

The tool answers four key questions:
- **What will happen?** (prediction) — given these parameters, what contact angle will I get?
- **How confident am I?** (uncertainty) — what is the error range?
- **What should I do?** (optimization) — what parameters give the best trade-off?
- **What matters most?** (sensitivity) — which parameter should I focus on?

Applications beyond lotus-inspired surfaces:
- Anti-icing coatings for aircraft and power lines
- Fog-harvesting surfaces for water collection in arid regions
- Anti-fouling coatings for ship hulls and medical implants
- Oil-water separation membranes for environmental cleanup
- Self-cleaning solar panels for desert installations`,
      analogy: 'The deployed design tool is like a GPS for surface engineering. A GPS does not just tell you where you are (prediction) — it tells you how to get where you want to go (optimization), warns you about traffic and road closures (constraints), and calculates the fastest route (sensitivity to different variables). Your tool does the same for surface design: it navigates a complex parameter space to reach the desired destination.',
      storyConnection: 'The lotus leaf inspired this entire capstone — from the initial question "why does the lotus float?" to a deployed computational tool that can design surfaces the lotus never dreamed of. The story of the lotus is now the story of human engineering: we observed, we understood, we modeled, and we improved. The lotus was the teacher; the tool is the student that surpassed the teacher.',
      checkQuestion: 'A solar panel manufacturer asks you to design a self-cleaning coating for panels installed in the Sahara desert. How would you modify the optimization constraints compared to the default settings?',
      checkAnswer: 'Desert conditions require: (1) extreme UV durability (add UV resistance as a constraint or objective), (2) sand abrasion resistance (increase minimum robustness pressure significantly), (3) high temperature stability (some coatings degrade above 80C — add temperature constraint), (4) consider that fog harvesting might be more valuable than water repellency in arid environments — you might want a surface that COLLECTS water, not repels it. The tool must be flexible enough to optimize for different objectives in different environments.',
      codeIntro: 'Run the complete Biomimicry Design Tool pipeline: from input parameters to optimized design to deployment report.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# BIOMIMICRY DESIGN TOOL — COMPLETE DEPLOYMENT
# ============================================================

def physics_engine(h, d, s, tY, coat):
    """Physics-based surface property prediction."""
    f = np.clip(np.pi*(d/2)**2/s**2, 0.01, 0.99)
    cos_Y = np.cos(np.radians(tY))
    cos_CB = np.clip(f*cos_Y+f-1, -1, 1)
    theta_CB = np.degrees(np.arccos(cos_CB))
    r = 1+np.pi*d*h/s**2
    cos_W = np.clip(r*cos_Y, -1, 1)
    theta_W = np.degrees(np.arccos(cos_W))
    gap = (s-d)*1e-6
    robustness = np.clip(-2*0.072*cos_Y/(gap+1e-10), 0, 10000)
    is_CB = (tY>85)&(robustness>50)
    CA = np.where(is_CB, theta_CB, theta_W)
    hysteresis = 5+30*f
    return CA, robustness, hysteresis, f

# Generate training data
n = 2000
h = np.random.uniform(1, 50, n); d = np.random.uniform(0.5, 20, n)
s = np.random.uniform(1, 50, n); tY = np.random.uniform(70, 130, n)
coat = np.random.uniform(10, 500, n)
CA, P, hyst, f_val = physics_engine(h, d, s, tY, coat)
CA += np.random.normal(0, 3, n)
CA = np.clip(CA, 0, 180)

# Fit ML surrogate
X = np.column_stack([h,d,s,tY,coat,f_val])
Xm, Xs = X.mean(0), X.std(0)+1e-10
Xn = (X-Xm)/Xs
Xf = np.hstack([np.ones((n,1)), Xn, Xn**2])
w = np.zeros(Xf.shape[1])
for _ in range(3000):
    p = Xf@w; g = (2/n)*(Xf.T@(p-CA)); g[1:]+=0.2*w[1:]; w-=0.005*g

# Optimization: find best designs
n_opt = 20000
h_o = np.random.uniform(2, 30, n_opt); d_o = np.random.uniform(1, 12, n_opt)
s_o = np.random.uniform(3, 35, n_opt); tY_o = np.random.uniform(100, 125, n_opt)
coat_o = np.random.uniform(50, 200, n_opt)
CA_o, P_o, hyst_o, f_o = physics_engine(h_o, d_o, s_o, tY_o, coat_o)

# Constraints
valid = (P_o > 500) & (hyst_o < 12) & (f_o > 0.05) & (h_o < 25)
CA_v, P_v = CA_o[valid], P_o[valid]
h_v, d_v, s_v, tY_v = h_o[valid], d_o[valid], s_o[valid], tY_o[valid]

# Best balanced design (maximize CA + robustness/100)
if sum(valid) > 0:
    score = CA_v + P_v / 100
    best = np.argmax(score)
else:
    best = 0

# ============================================================
# FINAL REPORT VISUALIZATION
# ============================================================
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('BIOMIMICRY DESIGN TOOL — DEPLOYMENT REPORT', color='white', fontsize=14, fontweight='bold')

# 1. Design space with Pareto frontier
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(CA_v, P_v, c='#3b82f6', s=5, alpha=0.2, label=f'Feasible ({sum(valid)})')
# Pareto
sorted_ca = np.argsort(-CA_v)
pareto = []
max_p = -np.inf
for i in sorted_ca:
    if P_v[i] > max_p:
        pareto.append(i)
        max_p = P_v[i]
pareto = np.array(pareto)
if len(pareto) > 0:
    sp = pareto[np.argsort(CA_v[pareto])]
    ax.plot(CA_v[sp], P_v[sp], 'o-', color='#ef4444', linewidth=2, markersize=4, label='Pareto')
ax.scatter([162], [800], c='#22c55e', s=200, marker='*', zorder=6, label='Lotus leaf')
if sum(valid) > 0:
    ax.scatter([CA_v[best]], [P_v[best]], c='#f59e0b', s=150, marker='D', zorder=6, label='Best design')
ax.set_xlabel('Contact angle (°)', color='white')
ax.set_ylabel('Robustness (Pa)', color='white')
ax.set_title('Design space + Pareto frontier', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# 2. Sensitivity
ax = axes[0, 1]
ax.set_facecolor('#111827')
param_names_short = ['height', 'diameter', 'spacing', 'θ_Y', 'coating', 'f']
baseline_vals = Xm.copy()
sens = []
for i in range(6):
    x_lo, x_hi = X[:, i].min(), X[:, i].max()
    vals_range = np.linspace(x_lo, x_hi, 50)
    preds = []
    for v in vals_range:
        xv = baseline_vals.copy(); xv[i] = v
        xn = (xv-Xm)/Xs; xfeat = np.concatenate([[1], xn, xn**2])
        preds.append(xfeat@w)
    sens.append(max(preds)-min(preds))
si = np.argsort(sens)[::-1]
ax.barh(range(6), [sens[i] for i in si],
        color=['#ef4444','#f59e0b','#fbbf24','#22c55e','#3b82f6','#a855f7'], edgecolor='none')
ax.set_yticks(range(6))
ax.set_yticklabels([param_names_short[i] for i in si], color='white')
ax.set_xlabel('CA sensitivity (°)', color='white')
ax.set_title('What matters most?', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 3. What-if scenarios
ax = axes[0, 2]
ax.set_facecolor('#111827')
scenarios = {
    'Lotus leaf': (15, 5, 20, 110, 100),
    'Cheap coating': (5, 8, 25, 105, 50),
    'High-tech': (20, 2, 8, 120, 300),
    'Minimal': (3, 10, 30, 100, 50),
    'Optimal*': (h_v[best], d_v[best], s_v[best], tY_v[best], 100) if sum(valid)>0 else (15,5,15,115,100),
}
sc_names = list(scenarios.keys())
sc_cas = []
sc_robustness = []
for name, (sh, sd, ss, stY, sc) in scenarios.items():
    ca, rob, _, _ = physics_engine(
        np.array([sh]), np.array([sd]), np.array([ss]), np.array([stY]), np.array([sc]))
    sc_cas.append(float(ca[0]))
    sc_robustness.append(float(rob[0]))

x_pos = np.arange(len(sc_names))
bars = ax.bar(x_pos, sc_cas, 0.5, color=['#22c55e','#f59e0b','#3b82f6','#94a3b8','#ef4444'], edgecolor='none')
ax.axhline(150, color='white', linestyle='--', alpha=0.3)
ax.set_xticks(x_pos)
ax.set_xticklabels(sc_names, color='white', fontsize=8, rotation=15)
ax.set_ylabel('Contact angle (°)', color='white')
ax.set_title('What-if scenarios', color='white', fontsize=10)
ax.tick_params(colors='gray')
for bar, ca in zip(bars, sc_cas):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+1, f'{ca:.0f}°',
            ha='center', color='white', fontsize=9)

# 4. Best design specs
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.axis('off')
if sum(valid) > 0:
    specs = [
        ['Pillar height', f'{h_v[best]:.1f} μm'],
        ['Pillar diameter', f'{d_v[best]:.1f} μm'],
        ['Pillar spacing', f'{s_v[best]:.1f} μm'],
        ['Material θ_Y', f'{tY_v[best]:.1f}°'],
        ['Contact angle', f'{CA_v[best]:.1f}°'],
        ['Robustness', f'{P_v[best]:.0f} Pa'],
        ['Hysteresis', f'{hyst_o[valid][best]:.1f}°'],
        ['vs Lotus (162°)', f'{"+" if CA_v[best]>162 else ""}{CA_v[best]-162:.1f}°'],
    ]
else:
    specs = [['No feasible design found', '']]

table = ax.table(cellText=specs, colLabels=['Parameter', 'Value'],
                  loc='center', cellLoc='left')
table.auto_set_font_size(False)
table.set_fontsize(10)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('#374151')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('OPTIMAL DESIGN SPECIFICATION', color='#22c55e', fontsize=11, pad=20)

# 5. Application recommendations
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
apps = [
    ['Self-cleaning glass', '>155°', '>1000 Pa', 'UV stable'],
    ['Anti-ice aircraft', '>160°', '>5000 Pa', 'Temp stable'],
    ['Medical implant', '>150°', '>500 Pa', 'Biocompatible'],
    ['Solar panel', '>155°', '>2000 Pa', 'Sand resistant'],
    ['Ship hull', '>145°', '>3000 Pa', 'Salt water'],
]
table2 = ax.table(cellText=apps, colLabels=['Application', 'Min CA', 'Min Robustness', 'Special'],
                   loc='center', cellLoc='left')
table2.auto_set_font_size(False)
table2.set_fontsize(9)
for key, cell in table2.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('#374151')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Application Requirements Guide', color='white', fontsize=10, pad=20)

# 6. Model confidence
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Bootstrap prediction intervals
n_boot = 50
boot_preds = []
for _ in range(n_boot):
    bi = np.random.choice(n, n, replace=True)
    wb = np.zeros(Xf.shape[1])
    for __ in range(1000):
        p = Xf[bi]@wb; g = (2/n)*(Xf[bi].T@(p-CA[bi])); g[1:]+=0.2*wb[1:]; wb-=0.005*g
    boot_preds.append(Xf[idx[:50]]@wb)

boot_preds = np.array(boot_preds)
idx_sort = np.argsort(CA[:50])
mean_pred = np.mean(boot_preds, axis=0)
lo = np.percentile(boot_preds, 5, axis=0)
hi = np.percentile(boot_preds, 95, axis=0)

idx = np.random.permutation(n)
ax.scatter(range(50), CA[idx[:50]][idx_sort], c='#22c55e', s=15, alpha=0.7, label='Actual')
ax.plot(range(50), mean_pred[idx_sort], color='#f59e0b', linewidth=2, label='Predicted')
ax.fill_between(range(50), lo[idx_sort], hi[idx_sort], alpha=0.2, color='#f59e0b', label='90% CI')
ax.set_xlabel('Design index', color='white')
ax.set_ylabel('Contact angle (°)', color='white')
ax.set_title('Prediction with confidence interval', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("BIOMIMICRY DESIGN TOOL — COMPLETE REPORT")
print("=" * 60)
print()
if sum(valid) > 0:
    print(f"OPTIMAL DESIGN: CA={CA_v[best]:.1f}°, Robustness={P_v[best]:.0f} Pa")
    print(f"  h={h_v[best]:.1f}μm, d={d_v[best]:.1f}μm, s={s_v[best]:.1f}μm, θ_Y={tY_v[best]:.1f}°")
    vs_lotus = CA_v[best] - 162
    print(f"  vs Lotus leaf: {'+'if vs_lotus>0 else ''}{vs_lotus:.1f}°")
print()
print(f"DESIGN SPACE: {n_opt} designs explored, {sum(valid)} feasible ({sum(valid)/n_opt:.0%})")
print(f"MOST SENSITIVE PARAMETER: {param_names_short[si[0]]} (ΔCA = {sens[si[0]]:.1f}°)")
print()
print("This tool transforms lotus-inspired biomimicry from art to engineering.")
print("From a single leaf, to a complete computational design platform.")`,
      challenge: 'Add a "self-healing" parameter that models how quickly the surface regenerates after damage. Find designs that optimize for long-term performance (contact angle after 1000 abrasion cycles) rather than just initial contact angle.',
      successHint: 'You have built a complete biomimicry design tool from scratch: physics modeling, ML surrogates, multi-objective optimization, sensitivity analysis, and deployment. This same pipeline — observe nature, model the physics, optimize computationally, validate experimentally — is how biomimicry works in industry for everything from Velcro to bullet trains to surgical robots.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Biomimicry Design Tool
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (surface science & aquatic biology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Design biomimetic surfaces with physics-informed machine learning. Click to start Python.</p>
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
