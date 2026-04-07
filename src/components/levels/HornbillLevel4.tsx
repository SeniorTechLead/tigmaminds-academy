import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HornbillLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Design: Bird Census Analyzer Pipeline',
      concept: `In Level 3 you learned aerodynamics, casque resonance, seed dispersal networks, mark-recapture estimation, casque biomechanics, and habitat modeling. Now you integrate these into a complete Bird Census Analyzer — a tool that processes field survey data to estimate population size, map habitat suitability, and quantify conservation status.

The pipeline has four stages: (1) **Data ingestion** — reading survey records with coordinates, species counts, environmental measurements, and observer metadata. (2) **Population estimation** — applying mark-recapture methods and density extrapolation to convert raw sightings into population estimates with confidence intervals. (3) **Habitat assessment** — scoring each surveyed location and interpolating to create a continuous suitability map. (4) **Conservation reporting** — computing species richness indices, identifying critical habitats, and generating actionable recommendations.

This capstone uses all the computational tools from Level 3 — logistic regression for habitat modeling, network analysis for ecological interactions, and statistical estimation for population sizes — woven into a single deployable system.`,
      analogy: 'Building a Bird Census Analyzer is like building a complete weather station. Individual instruments (thermometer, barometer, rain gauge) are useful alone, but a weather station integrates them into a unified system that produces forecasts. Similarly, each Level 3 technique is powerful alone, but the census analyzer combines them into a system that produces conservation recommendations.',
      storyConnection: 'The hornbill\'s crown represents leadership and oversight of the forest. A Bird Census Analyzer provides that same oversight computationally — surveying the kingdom, counting the subjects, mapping the territory, and identifying where the crown\'s protection is needed most.',
      checkQuestion: 'Why do we need both mark-recapture estimates AND habitat suitability models in the same system? Why not just use one?',
      checkAnswer: 'Mark-recapture tells you how many birds are in surveyed areas but says nothing about unsurveyed areas. Habitat models predict where birds SHOULD be based on environmental features but do not directly count individuals. Together, they give you population estimates for surveyed sites (calibration data) AND predictions for the full landscape. The habitat model extends the census beyond the survey footprint — essential when you can only survey 5% of a forest.',
      codeIntro: 'Build the data ingestion and survey generation module for the Bird Census Analyzer.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# BIRD CENSUS ANALYZER — Module 1: Data Ingestion & Generation
# ============================================================

class SurveyRegion:
    """Defines the survey landscape with environmental gradients."""

    def __init__(self, size_km=50, resolution=100):
        self.size = size_km
        self.res = resolution
        self.x = np.linspace(0, size_km, resolution)
        self.y = np.linspace(0, size_km, resolution)
        self.X, self.Y = np.meshgrid(self.x, self.y)

        # Environmental layers
        self.canopy_height = self._generate_canopy()
        self.forest_cover = self._generate_forest()
        self.fig_density = self._generate_figs()
        self.elevation = self._generate_elevation()
        self.disturbance = self._generate_disturbance()

    def _generate_canopy(self):
        """Canopy height: high in center, low at edges (simulating intact core forest)."""
        cx, cy = self.size/2, self.size/2
        dist = np.sqrt((self.X - cx)**2 + (self.Y - cy)**2)
        base = 40 * np.exp(-dist**2 / (2 * 15**2))
        noise = 3 * np.random.randn(self.res, self.res)
        return np.clip(base + noise + 5, 3, 45)

    def _generate_forest(self):
        """Forest cover fraction: fragmented at edges."""
        cx, cy = self.size/2, self.size/2
        dist = np.sqrt((self.X - cx)**2 + (self.Y - cy)**2)
        return np.clip(0.95 - 0.03 * dist + 0.05 * np.random.randn(self.res, self.res), 0, 1)

    def _generate_figs(self):
        """Fig tree density: correlated with canopy height."""
        return np.clip(self.canopy_height * 0.5 + np.random.randn(self.res, self.res) * 2, 0, 30)

    def _generate_elevation(self):
        """Elevation: gradient from SW (low) to NE (high)."""
        return 100 + 15 * self.X + 10 * self.Y + 50 * np.random.randn(self.res, self.res)

    def _generate_disturbance(self):
        """Human disturbance: high near edges (settlements)."""
        cx, cy = self.size/2, self.size/2
        dist = np.sqrt((self.X - cx)**2 + (self.Y - cy)**2)
        return np.clip(0.1 + 0.03 * dist + 0.05 * np.random.randn(self.res, self.res), 0, 1)

    def get_env_at(self, px, py):
        """Interpolate environmental values at a point."""
        ix = int(np.clip(px / self.size * (self.res-1), 0, self.res-1))
        iy = int(np.clip(py / self.size * (self.res-1), 0, self.res-1))
        return {
            'canopy_height': self.canopy_height[iy, ix],
            'forest_cover': self.forest_cover[iy, ix],
            'fig_density': self.fig_density[iy, ix],
            'elevation': self.elevation[iy, ix],
            'disturbance': self.disturbance[iy, ix],
        }

# Create landscape
region = SurveyRegion(size_km=50)

# Generate survey sites (stratified random)
n_surveys = 80
survey_x = np.random.uniform(2, 48, n_surveys)
survey_y = np.random.uniform(2, 48, n_surveys)

# For each site, compute true hornbill density based on habitat
true_density = []
env_data = []
for sx, sy in zip(survey_x, survey_y):
    env = region.get_env_at(sx, sy)
    env_data.append(env)
    # True density model (birds per km^2)
    d = (0.3 * env['canopy_height']
         + 0.15 * env['fig_density']
         - 5 * env['disturbance']
         - 0.005 * env['elevation']
         + 2 * env['forest_cover'])
    d = max(0, d + np.random.normal(0, 1))
    true_density.append(d)

true_density = np.array(true_density)

# Simulate observed counts (imperfect detection)
detection_prob = 0.4  # only detect 40% of birds present
survey_area = 0.5  # km^2 per survey
observed_counts = np.random.poisson(true_density * survey_area * detection_prob)

# Visualize
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bird Census Analyzer — Survey Region & Data', color='white', fontsize=14)

layers = [
    ('Canopy Height (m)', region.canopy_height, 'YlGn'),
    ('Forest Cover', region.forest_cover, 'Greens'),
    ('Fig Density', region.fig_density, 'YlOrRd'),
    ('Elevation (m)', region.elevation, 'terrain'),
    ('Disturbance Index', region.disturbance, 'Reds'),
]

for idx, (title, data, cmap) in enumerate(layers):
    ax = axes[idx // 3, idx % 3]
    ax.set_facecolor('#111827')
    im = ax.imshow(data, extent=[0, 50, 0, 50], origin='lower', cmap=cmap, aspect='equal')
    ax.scatter(survey_x, survey_y, c='white', s=10, alpha=0.5, edgecolors='none')
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray')
    plt.colorbar(im, ax=ax, shrink=0.8)

# Survey results
ax = axes[1, 2]
ax.set_facecolor('#111827')
sc = ax.scatter(survey_x, survey_y, c=observed_counts, cmap='YlGn', s=40,
                edgecolors='white', linewidth=0.5)
ax.set_title('Observed Hornbill Counts', color='white', fontsize=10)
ax.set_xlim(0, 50); ax.set_ylim(0, 50)
ax.tick_params(colors='gray')
plt.colorbar(sc, ax=ax, shrink=0.8, label='Count')

plt.tight_layout()
plt.show()

print("BIRD CENSUS ANALYZER — Data Summary")
print("=" * 50)
print(f"Survey region: {region.size} x {region.size} km")
print(f"Survey sites: {n_surveys}")
print(f"Survey area per site: {survey_area} km²")
print(f"Detection probability: {detection_prob:.0%}")
print(f"Total hornbills observed: {observed_counts.sum()}")
print(f"Mean count per site: {observed_counts.mean():.1f}")
print(f"Sites with zero detections: {(observed_counts == 0).sum()}")`,
      challenge: 'Add a second species (Oriental Pied Hornbill) with different habitat preferences (prefers forest edges rather than core forest). Generate survey data for both species simultaneously.',
      successHint: 'Data ingestion and survey design are the foundation of any census system. Garbage in, garbage out — understanding how detection probability and survey design affect raw counts is essential before any modeling step.',
    },
    {
      title: 'Population Estimation Module',
      concept: `Raw counts underestimate true population size because of imperfect detection. Our Bird Census Analyzer needs a **detection-corrected population estimator**.

The N-mixture model (Royle 2004) estimates both abundance (N) and detection probability (p) simultaneously from repeated count data. At each site i, the true abundance Ni follows a Poisson distribution with mean lambda. On each visit j, each individual is detected independently with probability p, so the observed count Cij ~ Binomial(Ni, p).

The likelihood for a single site with K visits is:
L(lambda, p | C) = sum over N from max(C) to infinity of [Poisson(N|lambda) * product over j of Binomial(Cij|N,p)]

In practice, we truncate the sum at a reasonable maximum (e.g., 3*max(C)). We maximize the total log-likelihood over all sites to estimate lambda and p.

For our analyzer, we simulate repeated visits to each site and use maximum likelihood to jointly estimate abundance and detectability. This is far more accurate than dividing raw counts by an assumed detection probability.`,
      analogy: 'Imagine trying to count fish in a murky pond by dipping a net 5 times. Each dip catches some fraction of the fish. If your 5 dips catch 3, 5, 4, 2, 6 fish, you can estimate both the total fish (abundance) and the net\'s efficiency (detection probability) from the variation in catches. More variation means lower detection probability; more consistent catches mean higher detection. The N-mixture model does exactly this.',
      storyConnection: 'The hornbill census requires looking beyond what we can see. Just as the hornbill\'s crown hints at hidden depths (the casque\'s internal structure), raw bird counts hint at a larger unseen population. The N-mixture model reveals the true number behind the observed counts.',
      checkQuestion: 'You visit 30 sites three times each. At one site, you count 8, 10, and 7 hornbills. At another, you count 0, 0, and 1. What can you infer about detection probability from these patterns?',
      checkAnswer: 'The first site (8, 10, 7) shows moderate variation — the counts are all similar, suggesting decent detection probability (p ~ 0.5-0.7). The second site (0, 0, 1) has a single detection across three visits, suggesting either very low abundance (N~1-2) or low detection probability. Across all 30 sites, the pattern of variation informs the global p estimate. If most sites show high variation (counts ranging from 0 to their max), detection is likely low. If counts are consistent, detection is high.',
      codeIntro: 'Implement an N-mixture population estimator with repeated surveys and maximum likelihood estimation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# BIRD CENSUS ANALYZER — Module 2: Population Estimation
# ============================================================

class PopulationEstimator:
    """N-mixture model for abundance estimation from repeated counts."""

    def __init__(self, max_N=100):
        self.max_N = max_N
        self.lambda_hat = None
        self.p_hat = None

    def _log_poisson(self, k, lam):
        """Log of Poisson PMF."""
        lam = max(lam, 1e-10)
        return k * np.log(lam) - lam - sum(np.log(range(1, int(k)+1))) if k > 0 else -lam

    def _log_binom(self, k, n, p):
        """Log of Binomial PMF."""
        if k > n or p <= 0 or p >= 1:
            return -np.inf
        # Log combination
        log_comb = sum(np.log(range(1, int(n)+1))) - sum(np.log(range(1, int(k)+1))) - sum(np.log(range(1, int(n-k)+1)))
        return log_comb + k * np.log(p) + (n - k) * np.log(1 - p)

    def site_log_likelihood(self, counts, lam, p):
        """Log-likelihood for one site with multiple visits."""
        max_count = int(max(counts))
        N_range = range(max_count, min(self.max_N, max_count + 50))

        log_terms = []
        for N in N_range:
            log_pois = self._log_poisson(N, lam)
            log_binom_sum = sum(self._log_binom(c, N, p) for c in counts)
            log_terms.append(log_pois + log_binom_sum)

        if not log_terms:
            return -np.inf
        max_log = max(log_terms)
        return max_log + np.log(sum(np.exp(lt - max_log) for lt in log_terms))

    def fit(self, count_matrix, n_grid=30):
        """Fit N-mixture model via grid search MLE.
        count_matrix: (n_sites, n_visits)
        """
        lam_range = np.linspace(0.5, 40, n_grid)
        p_range = np.linspace(0.05, 0.95, n_grid)

        best_ll = -np.inf
        best_lam, best_p = 5.0, 0.5

        for lam in lam_range:
            for p in p_range:
                total_ll = sum(self.site_log_likelihood(counts, lam, p)
                              for counts in count_matrix)
                if total_ll > best_ll:
                    best_ll = total_ll
                    best_lam, best_p = lam, p

        self.lambda_hat = best_lam
        self.p_hat = best_p
        return best_lam, best_p, best_ll

    def estimate_site_abundance(self, counts):
        """Posterior mean abundance for a site."""
        max_count = int(max(counts))
        N_range = range(max_count, min(self.max_N, max_count + 50))

        log_posteriors = []
        for N in N_range:
            lp = self._log_poisson(N, self.lambda_hat)
            lb = sum(self._log_binom(c, N, self.p_hat) for c in counts)
            log_posteriors.append(lp + lb)

        max_lp = max(log_posteriors)
        posteriors = np.array([np.exp(lp - max_lp) for lp in log_posteriors])
        posteriors /= posteriors.sum()

        N_values = np.array(list(N_range))
        return np.sum(N_values * posteriors)


# --- Generate simulated multi-visit survey data ---
n_sites = 50
n_visits = 4
true_lambda = 12.0
true_p = 0.35

true_N = np.random.poisson(true_lambda, n_sites)
count_matrix = np.zeros((n_sites, n_visits), dtype=int)
for i in range(n_sites):
    for j in range(n_visits):
        count_matrix[i, j] = np.random.binomial(true_N[i], true_p)

# Fit model
estimator = PopulationEstimator()
lam_est, p_est, ll = estimator.fit(count_matrix)

# Site-level abundance estimates
site_estimates = np.array([estimator.estimate_site_abundance(count_matrix[i])
                           for i in range(n_sites)])

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bird Census Analyzer — Population Estimation', color='white', fontsize=14)

# --- Raw counts vs true abundance ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
mean_counts = count_matrix.mean(axis=1)
ax.scatter(true_N, mean_counts, color='#f59e0b', s=30, alpha=0.7, edgecolors='none')
ax.plot([0, 30], [0, 30], '--', color='gray', label='1:1 line')
ax.plot([0, 30], [0, 30 * true_p], '--', color='#ef4444', label=f'Expected (p={true_p})')
ax.set_xlabel('True Abundance', color='white')
ax.set_ylabel('Mean Observed Count', color='white')
ax.set_title('Raw Counts Underestimate True N', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- N-mixture estimates vs true abundance ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.scatter(true_N, site_estimates, color='#22c55e', s=30, alpha=0.7, edgecolors='none')
ax.plot([0, 30], [0, 30], '--', color='gray', label='1:1 line')
ax.set_xlabel('True Abundance', color='white')
ax.set_ylabel('N-mixture Estimate', color='white')
ax.set_title(f'Corrected Estimates (λ={lam_est:.1f}, p={p_est:.2f})', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Likelihood surface ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
lam_grid = np.linspace(2, 25, 40)
p_grid = np.linspace(0.1, 0.8, 40)
LL_surface = np.zeros((len(p_grid), len(lam_grid)))
for li, lam in enumerate(lam_grid):
    for pi, p in enumerate(p_grid):
        LL_surface[pi, li] = sum(estimator.site_log_likelihood(count_matrix[s], lam, p)
                                  for s in range(min(10, n_sites)))
LL_surface[LL_surface < LL_surface.max() - 50] = LL_surface.max() - 50
im = ax.contourf(lam_grid, p_grid, LL_surface, levels=20, cmap='viridis')
ax.scatter([true_lambda], [true_p], marker='*', s=200, color='#ef4444', zorder=5, label='True values')
ax.scatter([lam_est], [p_est], marker='x', s=200, color='white', linewidths=3, zorder=5, label='MLE')
ax.set_xlabel('Lambda (mean abundance)', color='white')
ax.set_ylabel('Detection probability p', color='white')
ax.set_title('Log-Likelihood Surface', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Detection probability effect ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
p_values = [0.1, 0.2, 0.35, 0.5, 0.7]
for p_test in p_values:
    counts_test = np.array([[np.random.binomial(true_N[i], p_test) for _ in range(4)]
                            for i in range(n_sites)])
    est_test = PopulationEstimator()
    l_t, p_t, _ = est_test.fit(counts_test)
    site_est_t = np.array([est_test.estimate_site_abundance(counts_test[i]) for i in range(n_sites)])
    rmse = np.sqrt(np.mean((site_est_t - true_N)**2))
    ax.bar(p_values.index(p_test), rmse, color='#3b82f6', alpha=0.7)
ax.set_xticks(range(len(p_values)))
ax.set_xticklabels([f'{p:.0%}' for p in p_values])
ax.set_xlabel('True Detection Probability', color='white')
ax.set_ylabel('RMSE of Abundance Estimates', color='white')
ax.set_title('Estimation Error vs Detectability', color='white')
ax.tick_params(colors='gray')

# --- Visit count effect ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
visit_counts = [2, 3, 4, 6, 8]
rmses = []
for nv in visit_counts:
    counts_v = np.array([[np.random.binomial(true_N[i], true_p) for _ in range(nv)]
                          for i in range(n_sites)])
    est_v = PopulationEstimator()
    l_v, p_v, _ = est_v.fit(counts_v)
    site_v = np.array([est_v.estimate_site_abundance(counts_v[i]) for i in range(n_sites)])
    rmses.append(np.sqrt(np.mean((site_v - true_N)**2)))
ax.plot(visit_counts, rmses, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax.set_xlabel('Number of Visits per Site', color='white')
ax.set_ylabel('RMSE of Abundance Estimates', color='white')
ax.set_title('More Visits = Better Estimates', color='white')
ax.tick_params(colors='gray')

# --- Total population estimate ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
total_true = true_N.sum()
total_raw = count_matrix.max(axis=1).sum()
total_corrected = site_estimates.sum()
bars = ax.bar(['True Total', 'Raw Max Count', 'N-mixture Est.'],
              [total_true, total_raw, total_corrected],
              color=['#22c55e', '#ef4444', '#3b82f6'])
for bar, val in zip(bars, [total_true, total_raw, total_corrected]):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5, f'{val:.0f}',
            ha='center', color='white', fontsize=11)
ax.set_ylabel('Total Birds', color='white')
ax.set_title('Population Total: Raw vs Corrected', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("POPULATION ESTIMATION RESULTS")
print("=" * 50)
print(f"True parameters: lambda={true_lambda}, p={true_p}")
print(f"Estimated:        lambda={lam_est:.1f}, p={p_est:.2f}")
print(f"True total population: {total_true}")
print(f"Raw max-count total: {total_raw} ({total_raw/total_true:.0%} of true)")
print(f"N-mixture corrected: {total_corrected:.0f} ({total_corrected/total_true:.0%} of true)")`,
      challenge: 'Add heterogeneous detection: make detection probability depend on canopy density (harder to see birds in dense canopy). Fit the model with a covariate on detection and compare with the constant-p model.',
      successHint: 'The N-mixture model is a cornerstone of modern wildlife monitoring. It separates the ecological process (how many birds are there) from the observation process (how many can we detect), giving unbiased population estimates from imperfect survey data.',
    },
    {
      title: 'Habitat Suitability Mapping Module',
      concept: `The third module of our Bird Census Analyzer maps habitat suitability across the entire landscape. We combine the population estimates from Module 2 with environmental data to train a spatial model that predicts hornbill density everywhere — not just at surveyed sites.

We use **Gaussian Process Regression (GPR)**, simplified here as **inverse-distance weighted interpolation** with environmental covariates. The key insight is that sites with similar environments should have similar bird densities.

The model works in two stages:
1. **Environmental regression**: fit a linear model predicting abundance from environmental variables (canopy height, forest cover, fig density, elevation, disturbance).
2. **Spatial interpolation of residuals**: the regression captures broad patterns, but local variations remain. We interpolate these residuals using inverse-distance weighting from nearby survey sites.

The final prediction at any unsampled point is: predicted = regression_prediction + interpolated_residual.

This two-stage approach captures both the global habitat-abundance relationship (regression) and local spatial autocorrelation (interpolation) that the environmental variables alone cannot explain.`,
      analogy: 'Think of predicting house prices. The regression model says "houses near good schools in low-crime areas with big lots cost more" (global pattern). But the residual interpolation says "this specific block has a great view that the data does not capture, and nearby houses sold for more than expected" (local correction). Both are needed for accurate predictions.',
      storyConnection: 'The hornbill\'s territory spans vast stretches of forest that no single surveyor can cover entirely. The habitat suitability map extends our knowledge from the few sites we visited to the entire landscape — predicting where hornbills thrive and where they struggle, even in places no human has surveyed.',
      checkQuestion: 'Why might a pure spatial interpolation (ignoring environmental variables) produce bad predictions in areas far from survey sites?',
      checkAnswer: 'Spatial interpolation assumes that nearby points are similar. But a survey site on a forested hilltop 5 km from an unsurveyed clearcut would predict high density at the clearcut simply because it is "nearby." Environmental variables correct this: the clearcut has zero canopy height and zero forest cover, so the regression predicts near-zero density regardless of proximity to a good site. Environment + space > space alone.',
      codeIntro: 'Build the habitat suitability mapping module with environmental regression and spatial residual interpolation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# BIRD CENSUS ANALYZER — Module 3: Habitat Suitability Mapping
# ============================================================

# --- Recreate landscape and survey data from Module 1 ---
size_km = 50
res = 100
x_grid = np.linspace(0, size_km, res)
y_grid = np.linspace(0, size_km, res)
XG, YG = np.meshgrid(x_grid, y_grid)

# Environmental layers (simplified recreation)
cx, cy = size_km/2, size_km/2
dist_center = np.sqrt((XG - cx)**2 + (YG - cy)**2)
canopy = np.clip(40 * np.exp(-dist_center**2 / (2*15**2)) + 3*np.random.randn(res,res) + 5, 3, 45)
forest = np.clip(0.95 - 0.03*dist_center + 0.05*np.random.randn(res,res), 0, 1)
figs = np.clip(canopy*0.5 + 2*np.random.randn(res,res), 0, 30)
elev = 100 + 15*XG + 10*YG + 50*np.random.randn(res,res)
disturb = np.clip(0.1 + 0.03*dist_center + 0.05*np.random.randn(res,res), 0, 1)

# Survey sites
n_sites = 80
sx = np.random.uniform(2, 48, n_sites)
sy = np.random.uniform(2, 48, n_sites)

def get_env(px, py):
    ix = int(np.clip(px/size_km*(res-1), 0, res-1))
    iy = int(np.clip(py/size_km*(res-1), 0, res-1))
    return np.array([canopy[iy,ix], forest[iy,ix], figs[iy,ix], elev[iy,ix], disturb[iy,ix]])

# True density and N-mixture corrected estimates (simulated)
env_matrix = np.array([get_env(x, y) for x, y in zip(sx, sy)])
true_density = np.clip(0.3*env_matrix[:,0] + 0.15*env_matrix[:,2] - 5*env_matrix[:,4]
                       - 0.005*env_matrix[:,3] + 2*env_matrix[:,1] + np.random.normal(0,1,n_sites), 0, None)
estimated_density = true_density * (1 + np.random.normal(0, 0.15, n_sites))  # N-mixture estimates with noise

# --- Stage 1: Environmental regression ---
X_env = env_matrix.copy()
mu_env = X_env.mean(axis=0)
sig_env = X_env.std(axis=0) + 1e-10
X_std = (X_env - mu_env) / sig_env
X_design = np.column_stack([np.ones(n_sites), X_std])

# Ordinary least squares
beta = np.linalg.lstsq(X_design, estimated_density, rcond=None)[0]
regression_pred = X_design @ beta
residuals = estimated_density - regression_pred

# --- Stage 2: Spatial interpolation of residuals ---
def idw_interpolate(target_x, target_y, source_x, source_y, values, power=2, n_neighbors=10):
    """Inverse distance weighted interpolation."""
    dists = np.sqrt((source_x - target_x)**2 + (source_y - target_y)**2)
    nearest = np.argsort(dists)[:n_neighbors]
    d = dists[nearest]
    d = np.maximum(d, 0.01)
    weights = 1.0 / d**power
    return np.sum(weights * values[nearest]) / np.sum(weights)

# --- Predict across entire landscape ---
pred_regression = np.zeros((res, res))
pred_residual = np.zeros((res, res))
pred_total = np.zeros((res, res))

for i in range(res):
    for j in range(res):
        env_point = np.array([canopy[i,j], forest[i,j], figs[i,j], elev[i,j], disturb[i,j]])
        env_std_point = (env_point - mu_env) / sig_env
        reg_pred = np.dot(np.concatenate([[1], env_std_point]), beta)
        res_pred = idw_interpolate(x_grid[j], y_grid[i], sx, sy, residuals)
        pred_regression[i,j] = max(0, reg_pred)
        pred_residual[i,j] = res_pred
        pred_total[i,j] = max(0, reg_pred + res_pred)

# True density surface for comparison
true_surface = np.clip(0.3*canopy + 0.15*figs - 5*disturb - 0.005*elev + 2*forest, 0, None)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bird Census Analyzer — Habitat Suitability Map', color='white', fontsize=14)

# True density surface
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(true_surface, extent=[0,50,0,50], origin='lower', cmap='YlGn', aspect='equal')
ax.scatter(sx, sy, c='white', s=8, alpha=0.5)
ax.set_title('True Density Surface', color='white', fontsize=10)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

# Regression prediction
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(pred_regression, extent=[0,50,0,50], origin='lower', cmap='YlGn', aspect='equal')
ax.set_title('Regression Prediction', color='white', fontsize=10)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

# Full prediction (regression + residual)
ax = axes[0, 2]
ax.set_facecolor('#111827')
im = ax.imshow(pred_total, extent=[0,50,0,50], origin='lower', cmap='YlGn', aspect='equal')
ax.set_title('Full Prediction (regression + spatial)', color='white', fontsize=10)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

# Residual surface
ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(pred_residual, extent=[0,50,0,50], origin='lower', cmap='RdBu', aspect='equal')
ax.set_title('Spatial Residuals', color='white', fontsize=10)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

# Scatter: predicted vs observed
ax = axes[1, 1]
ax.set_facecolor('#111827')
reg_at_sites = regression_pred
full_at_sites = np.array([pred_total[int(np.clip(sy[i]/50*99,0,99)), int(np.clip(sx[i]/50*99,0,99))]
                           for i in range(n_sites)])
ax.scatter(estimated_density, reg_at_sites, color='#f59e0b', s=20, alpha=0.5, label='Regression only')
ax.scatter(estimated_density, full_at_sites, color='#22c55e', s=20, alpha=0.5, label='Full model')
ax.plot([0, 20], [0, 20], '--', color='gray')
ax.set_xlabel('Estimated Density (N-mixture)', color='white')
ax.set_ylabel('Predicted Density', color='white')
ax.set_title('Predicted vs Observed', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Feature importance
ax = axes[1, 2]
ax.set_facecolor('#111827')
feat_names = ['Canopy Ht', 'Forest Cov', 'Fig Density', 'Elevation', 'Disturbance']
sort_idx = np.argsort(np.abs(beta[1:]))[::-1]
colors_bar = ['#22c55e' if beta[1+i] > 0 else '#ef4444' for i in sort_idx]
ax.barh([feat_names[i] for i in sort_idx], beta[1+sort_idx], color=colors_bar)
ax.set_xlabel('Coefficient (standardized)', color='white')
ax.set_title('Environmental Drivers of Density', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

rmse_reg = np.sqrt(np.mean((regression_pred - estimated_density)**2))
rmse_full = np.sqrt(np.mean((full_at_sites - estimated_density)**2))
print("HABITAT SUITABILITY MAPPING RESULTS")
print("=" * 50)
print(f"Regression-only RMSE: {rmse_reg:.2f}")
print(f"Full model RMSE: {rmse_full:.2f}")
print(f"Improvement: {(1 - rmse_full/rmse_reg)*100:.0f}%")
print(f"\\\nTotal predicted population (landscape): {pred_total.sum() * (50/res)**2:.0f}")
print(f"Total surveyed population: {estimated_density.sum():.0f}")
print(f"Extrapolation factor: {pred_total.sum() * (50/res)**2 / estimated_density.sum():.1f}x")`,
      challenge: 'Add an uncertainty map: at each grid cell, compute the distance to the nearest survey site and use it to flag areas where predictions are unreliable (extrapolation zones). Visualize confidence alongside the suitability map.',
      successHint: 'Habitat suitability maps are the primary output that conservation managers use. A map showing "hornbills are concentrated HERE" with quantified uncertainty directly informs which forest patches to protect, where to establish corridors, and how to prioritize limited conservation budgets.',
    },
    {
      title: 'Species Richness and Diversity Indices',
      concept: `A complete Bird Census Analyzer must go beyond single-species abundance to assess **community-level biodiversity**. This requires computing diversity indices that capture different aspects of species assemblages.

**Alpha diversity** (within-site richness) measures how many species and how evenly they are distributed at a single location:
- **Species richness (S)**: simple count of species present.
- **Shannon index (H')**: H' = -sum(pi * ln(pi)), where pi is the proportion of individuals belonging to species i. Higher H' means more species and more even distribution.
- **Simpson index (D)**: D = sum(pi^2). Probability that two randomly chosen individuals belong to the same species. Lower D means higher diversity. Often reported as 1-D (Simpson's diversity) or 1/D (inverse Simpson).

**Beta diversity** (between-site turnover) measures how different two sites are in species composition:
- **Jaccard index**: J = |A intersection B| / |A union B|. Ranges from 0 (completely different) to 1 (identical).
- **Bray-Curtis dissimilarity**: accounts for abundances, not just presence/absence.

**Rarefaction curves** address the sampling problem: sites with more individuals sampled will naturally show more species. Rarefaction standardizes by subsampling to equal effort, enabling fair comparison.`,
      analogy: 'Imagine two fruit markets. Market A has 100 oranges. Market B has 25 each of oranges, apples, bananas, and mangoes. Both have the same total (100 fruits) but Market B is more diverse. Shannon index captures this: it rewards both variety (number of types) and evenness (equal proportions). A single number that says "how surprising is a random fruit from this market?"',
      storyConnection: 'The hornbill\'s forest is not a single-species realm — it is a community of hundreds of bird species. The census analyzer must assess the health of the entire community, not just the hornbills. Diversity indices tell us whether the forest ecosystem as a whole is intact or degraded.',
      checkQuestion: 'Two forests each have 20 bird species. Forest A has 95% of individuals from one dominant species and 5% split among the other 19. Forest B has roughly 5% per species. Both have S=20. How do their Shannon indices compare?',
      checkAnswer: 'Forest A has very low Shannon index (near 0, dominated by one species — H\' ≈ -0.95*ln(0.95) - 19*(0.0026*ln(0.0026)) ≈ 0.35). Forest B has high Shannon index (near ln(20) ≈ 3.0, maximum possible for 20 species with perfect evenness). Species richness alone (S=20 for both) completely misses this difference. Shannon index captures what richness cannot: community evenness.',
      codeIntro: 'Compute alpha and beta diversity indices, build rarefaction curves, and create a biodiversity dashboard for the census analyzer.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# BIRD CENSUS ANALYZER — Module 4: Diversity Indices
# ============================================================

# --- Generate multi-species survey data ---
species_names = [
    'Great Hornbill', 'Wreathed Hornbill', 'Pied Hornbill',
    'Green Pigeon', 'Imperial Pigeon', 'Great Barbet',
    'Scarlet Minivet', 'Sultan Tit', 'Blue-winged Leafbird',
    'Emerald Dove', 'Asian Fairy-bluebird', 'Black-naped Oriole',
    'Red Junglefowl', 'Grey Peacock-Pheasant', 'Kalij Pheasant',
    'White-bellied Heron', 'Oriental Darter', 'Black Stork',
    'Crested Serpent Eagle', 'Mountain Hawk-Eagle'
]
n_species = len(species_names)
n_sites = 30

# True community: abundance varies by habitat quality
# Core forest sites (0-15): high diversity, even abundance
# Edge sites (15-25): moderate diversity, some dominance
# Degraded sites (25-30): low diversity, high dominance
abundance_matrix = np.zeros((n_sites, n_species), dtype=int)

for site in range(n_sites):
    if site < 15:  # Core forest
        probs = np.random.dirichlet(np.ones(n_species) * 2)
        total = np.random.poisson(200)
    elif site < 25:  # Edge
        probs = np.random.dirichlet(np.concatenate([np.ones(10)*2, np.ones(10)*0.3]))
        total = np.random.poisson(150)
    else:  # Degraded
        probs = np.random.dirichlet(np.concatenate([np.ones(3)*5, np.ones(17)*0.1]))
        total = np.random.poisson(100)
    abundance_matrix[site] = np.random.multinomial(total, probs)

# --- Alpha diversity indices ---
def shannon_index(abundances):
    total = abundances.sum()
    if total == 0: return 0
    p = abundances[abundances > 0] / total
    return -np.sum(p * np.log(p))

def simpson_index(abundances):
    total = abundances.sum()
    if total <= 1: return 0
    p = abundances / total
    return np.sum(p**2)

def species_richness(abundances):
    return np.sum(abundances > 0)

# Compute for all sites
richness = np.array([species_richness(abundance_matrix[i]) for i in range(n_sites)])
shannon = np.array([shannon_index(abundance_matrix[i]) for i in range(n_sites)])
simpson_div = np.array([1 - simpson_index(abundance_matrix[i]) for i in range(n_sites)])

# --- Rarefaction ---
def rarefaction_curve(abundances, n_steps=20):
    """Compute expected species richness at different sampling efforts."""
    total = abundances.sum()
    if total == 0: return [], []
    efforts = np.linspace(1, total, min(n_steps, total)).astype(int)
    expected_S = []
    for n in efforts:
        # Exact rarefaction: E[S(n)] = S - sum(C(N-Ni, n) / C(N, n))
        # Approximate with simulation
        species_found = set()
        for _ in range(20):
            sample = np.random.choice(len(abundances), n, replace=True,
                                       p=abundances/total)
            species_found.update(set(np.where(np.bincount(sample, minlength=len(abundances)) > 0)[0]))
        expected_S.append(len(species_found) / 1)  # simplified
    return efforts, expected_S

# --- Beta diversity (Jaccard) ---
def jaccard(a, b):
    present_a = set(np.where(a > 0)[0])
    present_b = set(np.where(b > 0)[0])
    if len(present_a | present_b) == 0: return 0
    return len(present_a & present_b) / len(present_a | present_b)

jaccard_matrix = np.zeros((n_sites, n_sites))
for i in range(n_sites):
    for j in range(n_sites):
        jaccard_matrix[i, j] = jaccard(abundance_matrix[i], abundance_matrix[j])

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bird Census Analyzer — Biodiversity Dashboard', color='white', fontsize=14)

# --- Richness by site type ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
site_types = ['Core']*15 + ['Edge']*10 + ['Degraded']*5
colors_type = {'Core': '#22c55e', 'Edge': '#f59e0b', 'Degraded': '#ef4444'}
for st in ['Core', 'Edge', 'Degraded']:
    mask = [t == st for t in site_types]
    ax.scatter(np.array(range(n_sites))[mask], richness[mask],
              color=colors_type[st], s=50, label=st, edgecolors='white', linewidth=0.5)
ax.set_xlabel('Site Index', color='white')
ax.set_ylabel('Species Richness', color='white')
ax.set_title('Species Richness by Site Type', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Shannon vs Simpson ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
for st in ['Core', 'Edge', 'Degraded']:
    mask = [t == st for t in site_types]
    ax.scatter(shannon[mask], simpson_div[mask], color=colors_type[st], s=50, label=st,
              edgecolors='white', linewidth=0.5)
ax.set_xlabel("Shannon Index (H')", color='white')
ax.set_ylabel("Simpson's Diversity (1-D)", color='white')
ax.set_title('Shannon vs Simpson Diversity', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Rarefaction curves ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
for site_idx, col, lbl in [(0, '#22c55e', 'Core site 1'), (7, '#3b82f6', 'Core site 8'),
                            (18, '#f59e0b', 'Edge site 4'), (27, '#ef4444', 'Degraded site 3')]:
    efforts, expected = rarefaction_curve(abundance_matrix[site_idx])
    ax.plot(efforts, expected, 'o-', color=col, linewidth=1.5, markersize=3, label=lbl)
ax.set_xlabel('Number of Individuals Sampled', color='white')
ax.set_ylabel('Expected Species', color='white')
ax.set_title('Rarefaction Curves', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Beta diversity heatmap ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(jaccard_matrix, cmap='YlGn', aspect='equal')
ax.set_title('Jaccard Similarity Between Sites', color='white', fontsize=10)
ax.set_xlabel('Site', color='white')
ax.set_ylabel('Site', color='white')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

# --- Rank-abundance curves ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
for site_idx, col, lbl in [(0, '#22c55e', 'Core'), (20, '#f59e0b', 'Edge'), (28, '#ef4444', 'Degraded')]:
    sorted_ab = np.sort(abundance_matrix[site_idx])[::-1]
    sorted_ab = sorted_ab[sorted_ab > 0]
    total_ab = sorted_ab.sum()
    ax.semilogy(range(1, len(sorted_ab)+1), sorted_ab/total_ab, 'o-', color=col,
               linewidth=1.5, markersize=4, label=lbl)
ax.set_xlabel('Species Rank', color='white')
ax.set_ylabel('Relative Abundance (log)', color='white')
ax.set_title('Rank-Abundance Curves', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Summary statistics ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
summary_text = "BIODIVERSITY SUMMARY\\\n" + "=" * 35 + "\\\n\\\n"
for st in ['Core', 'Edge', 'Degraded']:
    mask = [t == st for t in site_types]
    summary_text += f"{st} Forest:\\\n"
    summary_text += f"  Mean richness: {richness[mask].mean():.1f}\\\n"
    summary_text += f"  Mean Shannon:  {shannon[mask].mean():.2f}\\\n"
    summary_text += f"  Mean Simpson:  {simpson_div[mask].mean():.2f}\\\n\\\n"
ax.text(0.05, 0.95, summary_text, transform=ax.transAxes, fontsize=10, color='white',
        verticalalignment='top', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("BIODIVERSITY ANALYSIS COMPLETE")
print("=" * 50)
for st in ['Core', 'Edge', 'Degraded']:
    mask = [t == st for t in site_types]
    print(f"\\\n{st} Forest (n={sum(mask)} sites):")
    print(f"  Species richness: {richness[mask].mean():.1f} +/- {richness[mask].std():.1f}")
    print(f"  Shannon H':       {shannon[mask].mean():.2f} +/- {shannon[mask].std():.2f}")
    print(f"  Simpson (1-D):    {simpson_div[mask].mean():.2f} +/- {simpson_div[mask].std():.2f}")`,
      challenge: 'Compute the Bray-Curtis dissimilarity matrix (using abundances, not just presence/absence) and compare it with the Jaccard matrix. Identify which site pairs are classified differently by the two metrics.',
      successHint: 'Diversity indices compress complex community data into interpretable numbers. But no single index tells the whole story — richness misses evenness, Shannon is insensitive to rare species, Simpson emphasizes dominant species. A good census analyzer reports multiple indices and lets the ecologist interpret them in context.',
    },
    {
      title: 'Conservation Priority Scoring System',
      concept: `The final module of the Bird Census Analyzer integrates everything into a **conservation priority score** for each location. Conservation planning requires ranking areas so that limited resources protect the most valuable sites first.

A priority score typically combines multiple criteria with weights:
- **Biodiversity value** (species richness, presence of threatened species, endemism)
- **Population importance** (what fraction of the regional population does this site hold?)
- **Habitat quality** (suitability score, forest integrity, connectivity)
- **Threat level** (proximity to deforestation fronts, planned development, hunting pressure)
- **Feasibility** (cost of protection, existing legal framework, community support)

The scoring function is: Priority = w1*Biodiversity + w2*Population + w3*Habitat + w4*Threat + w5*Feasibility

Different weighting schemes reflect different conservation philosophies. **Reactive** conservation weights threat highly (protect what is about to be lost). **Proactive** conservation weights habitat quality (protect the best remaining areas). **Representation** conservation weights endemism (protect unique species found nowhere else).

The output is a ranked list of sites and a priority map that conservation managers can use to allocate patrol effort, propose protected areas, or target restoration.`,
      analogy: 'Conservation priority scoring is like hospital triage. You cannot treat every patient at once, so you assess severity (threat), treatability (feasibility), and importance (a rare condition that only this hospital can handle). The triage score determines who gets seen first. Similarly, conservation priority determines which forest patches get protection first when budgets are limited.',
      storyConnection: 'The hornbill\'s crown carries the weight of responsibility for the forest. Our priority scoring system bears the same weight — deciding which parts of the forest to protect first. A poor scoring system wastes resources on low-priority sites while critical habitats are lost. Getting it right is the difference between effective conservation and expensive failure.',
      checkQuestion: 'A site has the highest biodiversity score but the lowest threat score (no immediate danger). Another site has moderate biodiversity but extreme threat (logging planned next year). Under reactive conservation, which site gets priority? Under proactive conservation?',
      checkAnswer: 'Under reactive conservation (high threat weight), the moderate-biodiversity high-threat site gets priority — if we do not act now, it is lost forever. Under proactive conservation (high habitat weight), the high-biodiversity low-threat site gets priority — it is the best remaining area and protecting it now is cheap. Neither approach is universally correct. Many modern frameworks use a mixed approach: protect the best AND rescue the most threatened.',
      codeIntro: 'Build the conservation priority scoring system with multiple weighting schemes and generate a final priority map.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# BIRD CENSUS ANALYZER — Module 5: Conservation Priority Scoring
# ============================================================

# --- Generate landscape-scale scores ---
res = 80
size_km = 50
x = np.linspace(0, size_km, res)
y = np.linspace(0, size_km, res)
X, Y = np.meshgrid(x, y)
cx, cy = size_km/2, size_km/2
dist_center = np.sqrt((X - cx)**2 + (Y - cy)**2)

# Component scores (0-1 scale)
biodiversity = np.clip(0.9 * np.exp(-dist_center**2/(2*12**2)) + 0.1*np.random.randn(res,res), 0, 1)
population = np.clip(0.85 * np.exp(-dist_center**2/(2*14**2)) + 0.1*np.random.randn(res,res), 0, 1)
habitat_quality = np.clip(0.95 * np.exp(-dist_center**2/(2*15**2)) + 0.08*np.random.randn(res,res), 0, 1)

# Threat: high at edges (development pressure), low in core
threat = np.clip(0.8 - 0.6*np.exp(-dist_center**2/(2*10**2)) + 0.1*np.random.randn(res,res), 0, 1)

# Feasibility: moderate everywhere, higher near existing protected areas (center)
feasibility = np.clip(0.5 + 0.3*np.exp(-dist_center**2/(2*20**2)) + 0.1*np.random.randn(res,res), 0, 1)

# --- Three conservation strategies ---
strategies = {
    'Proactive': {'biodiversity': 0.35, 'population': 0.25, 'habitat': 0.25, 'threat': 0.05, 'feasibility': 0.10},
    'Reactive':  {'biodiversity': 0.15, 'population': 0.15, 'habitat': 0.10, 'threat': 0.45, 'feasibility': 0.15},
    'Balanced':  {'biodiversity': 0.25, 'population': 0.20, 'habitat': 0.20, 'threat': 0.20, 'feasibility': 0.15},
}

priority_maps = {}
for name, weights in strategies.items():
    score = (weights['biodiversity'] * biodiversity +
             weights['population'] * population +
             weights['habitat'] * habitat_quality +
             weights['threat'] * threat +
             weights['feasibility'] * feasibility)
    priority_maps[name] = score

fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bird Census Analyzer — Conservation Priority Maps', color='white', fontsize=14)

# Component maps
components = [
    ('Biodiversity', biodiversity, 'YlGn'),
    ('Threat Level', threat, 'YlOrRd'),
    ('Habitat Quality', habitat_quality, 'Greens'),
    ('Feasibility', feasibility, 'Blues'),
]
for idx, (title, data, cmap) in enumerate(components):
    ax = axes[0, idx]
    ax.set_facecolor('#111827')
    im = ax.imshow(data, extent=[0,50,0,50], origin='lower', cmap=cmap, aspect='equal', vmin=0, vmax=1)
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=6)
    plt.colorbar(im, ax=ax, shrink=0.7)

# Strategy maps
strat_colors = ['Greens', 'Reds', 'viridis']
for idx, (name, score) in enumerate(priority_maps.items()):
    ax = axes[1, idx]
    ax.set_facecolor('#111827')
    im = ax.imshow(score, extent=[0,50,0,50], origin='lower', cmap=strat_colors[idx], aspect='equal')
    # Mark top 10% priority areas
    threshold = np.percentile(score, 90)
    contour_data = (score >= threshold).astype(float)
    ax.contour(x, y, contour_data, levels=[0.5], colors='white', linewidths=1.5)
    ax.set_title(f'{name} Strategy', color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=6)
    plt.colorbar(im, ax=ax, shrink=0.7)

# Strategy comparison
ax = axes[1, 3]
ax.set_facecolor('#111827')
# Overlap analysis: top 20% for each strategy
top20_masks = {}
for name, score in priority_maps.items():
    thresh = np.percentile(score, 80)
    top20_masks[name] = score >= thresh

# Compute overlap
all_three = top20_masks['Proactive'] & top20_masks['Reactive'] & top20_masks['Balanced']
any_two = ((top20_masks['Proactive'] & top20_masks['Reactive']) |
           (top20_masks['Proactive'] & top20_masks['Balanced']) |
           (top20_masks['Reactive'] & top20_masks['Balanced']))
only_one = top20_masks['Proactive'] | top20_masks['Reactive'] | top20_masks['Balanced']

overlap_map = np.zeros((res, res))
overlap_map[only_one & ~any_two] = 1
overlap_map[any_two & ~all_three] = 2
overlap_map[all_three] = 3

colors_overlap = plt.cm.YlOrRd(np.linspace(0.1, 0.9, 4))
from matplotlib.colors import ListedColormap
cmap_overlap = ListedColormap(['#111827', '#3b82f6', '#f59e0b', '#22c55e'])
ax.imshow(overlap_map, extent=[0,50,0,50], origin='lower', cmap=cmap_overlap, aspect='equal', vmin=0, vmax=3)
ax.set_title('Strategy Agreement (green=all 3)', color='white', fontsize=10)
ax.tick_params(colors='gray', labelsize=6)

plt.tight_layout()
plt.show()

# --- Quantitative summary ---
print("CONSERVATION PRIORITY ANALYSIS")
print("=" * 60)
print(f"\\\n{'Strategy':<12} {'Top 10% area (km²)':>18} {'Mean priority':>14} {'Max':>6}")
print("-" * 52)
cell_area = (50/res)**2
for name, score in priority_maps.items():
    thresh90 = np.percentile(score, 90)
    top_area = np.sum(score >= thresh90) * cell_area
    print(f"{name:<12} {top_area:>18.0f} {score.mean():>14.3f} {score.max():>6.3f}")

# Overlap statistics
total_cells = res * res
print(f"\\\nStrategy Agreement:")
print(f"  All 3 agree (top 20%): {all_three.sum()/total_cells*100:.1f}% of landscape")
print(f"  At least 2 agree:       {any_two.sum()/total_cells*100:.1f}% of landscape")
print(f"  Unique to 1 strategy:   {(only_one.sum()-any_two.sum())/total_cells*100:.1f}% of landscape")
print()
print("RECOMMENDATION: Areas where all three strategies agree are")
print("no-regret conservation investments — high priority regardless")
print("of conservation philosophy.")`,
      challenge: 'Add a cost-effectiveness analysis: assign a protection cost to each cell (based on land value, accessibility, etc.) and compute the priority-per-dollar ratio. Identify the most cost-effective 20% of the landscape.',
      successHint: 'Conservation priority scoring turns complex ecological data into actionable decisions. The fact that different strategies identify different priority areas is not a flaw — it reflects genuine trade-offs in conservation. The areas where strategies agree are the most defensible investments.',
    },
    {
      title: 'Deployment: The Complete Bird Census Analyzer',
      concept: `The final step integrates all five modules into a single, runnable Bird Census Analyzer with a clean API. A deployable system needs three things that research code does not: **input validation** (rejecting bad data before it corrupts results), **error handling** (graceful failure with informative messages), and **interpretable output** (reports that a non-programmer conservation manager can understand).

Our complete pipeline:
1. **Input**: survey CSV with coordinates, species counts, environmental measurements, dates, observer IDs.
2. **Population module**: N-mixture estimates with confidence intervals.
3. **Habitat module**: suitability map with uncertainty flags.
4. **Diversity module**: alpha and beta diversity indices, rarefaction.
5. **Priority module**: conservation priority scores under multiple strategies.
6. **Output**: summary report with key metrics, maps, and recommendations.

This capstone demonstrates the full arc from scientific concept to deployable tool — the same arc that conservation technology organizations follow when building real monitoring systems for hornbills and other endangered species.`,
      analogy: 'Deploying the census analyzer is like publishing a cookbook rather than just cooking a meal. The individual recipes (modules) are important, but the cookbook needs an introduction (documentation), a table of contents (API), ingredient lists (input validation), and troubleshooting tips (error handling). Only then can someone else use your recipes successfully.',
      storyConnection: 'The hornbill\'s crown is the culmination of millions of years of evolution — not a single adaptation but an integrated system of flight mechanics, acoustic engineering, structural design, and ecological role. Our Bird Census Analyzer mirrors this integration: not a single algorithm but a complete system where each module supports and depends on the others.',
      checkQuestion: 'A conservation manager uploads survey data where one site has coordinates outside the study region. Should the system (a) silently ignore it, (b) include it anyway, or (c) reject the entire upload? Why?',
      checkAnswer: 'Option (c) is safest in most cases: reject the upload with a clear error message pointing to the problematic site. Silent ignoring (a) risks the manager not realizing a data entry error. Including it (b) could corrupt spatial models with an outlier. The system should explain exactly which record is problematic and why, so the manager can fix it and re-upload. Fail loudly and helpfully.',
      codeIntro: 'Integrate all modules into the complete Bird Census Analyzer with validation, error handling, and a summary report.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# BIRD CENSUS ANALYZER — Complete Integrated System
# ============================================================

class BirdCensusAnalyzer:
    """Complete bird census analysis pipeline."""

    def __init__(self, region_size_km=50, resolution=60):
        self.region_size = region_size_km
        self.res = resolution
        self.survey_data = None
        self.population_estimates = None
        self.habitat_map = None
        self.diversity_indices = None
        self.priority_scores = None

    def validate_input(self, coords, counts, env_data):
        """Validate survey input data."""
        errors = []
        if coords.shape[0] != counts.shape[0]:
            errors.append(f"Coordinate rows ({coords.shape[0]}) != count rows ({counts.shape[0]})")
        if np.any(coords < 0) or np.any(coords > self.region_size):
            bad = np.where((coords < 0) | (coords > self.region_size))
            errors.append(f"Coordinates out of bounds at rows: {np.unique(bad[0])[:5]}")
        if np.any(counts < 0):
            errors.append("Negative counts detected")
        if np.any(np.isnan(env_data)):
            errors.append("NaN values in environmental data")
        return errors

    def estimate_population(self, counts_repeated):
        """Simplified N-mixture estimation."""
        n_sites = counts_repeated.shape[0]
        max_counts = counts_repeated.max(axis=1)
        mean_counts = counts_repeated.mean(axis=1)

        # Estimate detection probability from count variation
        cv = np.std(counts_repeated, axis=1) / (np.mean(counts_repeated, axis=1) + 0.1)
        p_est = np.clip(1 - cv.mean() * 0.5, 0.1, 0.9)

        # Corrected abundance
        abundance_est = mean_counts / p_est
        ci_low = abundance_est * 0.7  # approximate 95% CI
        ci_high = abundance_est * 1.4

        return {
            'abundance': abundance_est,
            'ci_low': ci_low,
            'ci_high': ci_high,
            'detection_prob': p_est,
            'total': abundance_est.sum(),
        }

    def compute_habitat_suitability(self, coords, abundance, env_data):
        """Environmental regression + spatial interpolation."""
        # Standardize
        mu = env_data.mean(axis=0)
        sigma = env_data.std(axis=0) + 1e-10
        X_std = (env_data - mu) / sigma
        X_design = np.column_stack([np.ones(len(coords)), X_std])

        # OLS regression
        beta = np.linalg.lstsq(X_design, abundance, rcond=None)[0]
        pred = X_design @ beta
        r2 = 1 - np.sum((abundance - pred)**2) / np.sum((abundance - abundance.mean())**2)

        return {'beta': beta, 'mu': mu, 'sigma': sigma, 'r_squared': r2, 'predictions': pred}

    def compute_diversity(self, species_counts):
        """Alpha diversity indices."""
        richness = np.sum(species_counts > 0, axis=1)
        shannon = np.zeros(len(species_counts))
        simpson = np.zeros(len(species_counts))
        for i in range(len(species_counts)):
            total = species_counts[i].sum()
            if total > 0:
                p = species_counts[i][species_counts[i] > 0] / total
                shannon[i] = -np.sum(p * np.log(p))
                simpson[i] = 1 - np.sum(p**2)
        return {'richness': richness, 'shannon': shannon, 'simpson': simpson}

    def compute_priority(self, biodiv_score, pop_score, hab_score, threat_score):
        """Conservation priority under three strategies."""
        strategies = {
            'Proactive': np.array([0.35, 0.25, 0.25, 0.05]),
            'Reactive':  np.array([0.15, 0.15, 0.10, 0.45]),
            'Balanced':  np.array([0.25, 0.20, 0.20, 0.20]),
        }
        scores = np.column_stack([biodiv_score, pop_score, hab_score, threat_score])
        results = {}
        for name, weights in strategies.items():
            results[name] = scores @ weights
        return results

    def generate_report(self, pop_results, hab_results, div_results, priority_results):
        """Generate text summary."""
        lines = []
        lines.append("=" * 60)
        lines.append("     BIRD CENSUS ANALYZER — FINAL REPORT")
        lines.append("=" * 60)
        lines.append(f"\\n--- POPULATION ---")
        lines.append(f"Total estimated abundance: {pop_results['total']:.0f}")
        lines.append(f"Detection probability: {pop_results['detection_prob']:.2f}")
        lines.append(f"Sites surveyed: {len(pop_results['abundance'])}")
        lines.append(f"\\n--- HABITAT MODEL ---")
        lines.append(f"R-squared: {hab_results['r_squared']:.3f}")
        lines.append(f"\\n--- DIVERSITY ---")
        lines.append(f"Mean richness: {div_results['richness'].mean():.1f}")
        lines.append(f"Mean Shannon H': {div_results['shannon'].mean():.2f}")
        lines.append(f"Mean Simpson (1-D): {div_results['simpson'].mean():.2f}")
        lines.append(f"\\n--- PRIORITY ---")
        for name, scores in priority_results.items():
            lines.append(f"{name}: mean={scores.mean():.3f}, max={scores.max():.3f}")
        return "\\n".join(lines)


# ============================================================
# RUN THE COMPLETE PIPELINE
# ============================================================

analyzer = BirdCensusAnalyzer(region_size_km=50)

# Generate test data
n_sites = 60
n_visits = 4
n_species = 15

coords = np.column_stack([np.random.uniform(2, 48, n_sites),
                           np.random.uniform(2, 48, n_sites)])
env_data = np.column_stack([
    np.random.uniform(5, 45, n_sites),     # canopy height
    np.random.uniform(0.1, 1.0, n_sites),  # forest cover
    np.random.uniform(0, 25, n_sites),      # fig density
    np.random.uniform(100, 1500, n_sites),  # elevation
    np.random.uniform(0, 1, n_sites),       # disturbance
])

# Repeated counts for focal species
true_N = np.random.poisson(10, n_sites)
counts_repeated = np.array([[np.random.binomial(true_N[i], 0.4) for _ in range(n_visits)]
                             for i in range(n_sites)])

# Multi-species counts for diversity
species_counts = np.random.multinomial(100, np.random.dirichlet(np.ones(n_species)),
                                        size=n_sites)

# Step 1: Validate
errors = analyzer.validate_input(coords, counts_repeated, env_data)
print(f"Validation: {'PASSED' if not errors else 'FAILED: ' + '; '.join(errors)}")

# Step 2: Population estimation
pop_results = analyzer.estimate_population(counts_repeated)

# Step 3: Habitat suitability
hab_results = analyzer.compute_habitat_suitability(coords, pop_results['abundance'], env_data)

# Step 4: Diversity indices
div_results = analyzer.compute_diversity(species_counts)

# Step 5: Conservation priority
# Normalize scores to 0-1
biodiv_norm = (div_results['shannon'] - div_results['shannon'].min()) / (div_results['shannon'].max() - div_results['shannon'].min() + 1e-10)
pop_norm = (pop_results['abundance'] - pop_results['abundance'].min()) / (pop_results['abundance'].max() - pop_results['abundance'].min() + 1e-10)
hab_norm = (hab_results['predictions'] - hab_results['predictions'].min()) / (hab_results['predictions'].max() - hab_results['predictions'].min() + 1e-10)
threat_norm = env_data[:, 4]  # disturbance as threat proxy

priority_results = analyzer.compute_priority(biodiv_norm, pop_norm, hab_norm, threat_norm)

# Step 6: Generate report
report = analyzer.generate_report(pop_results, hab_results, div_results, priority_results)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('BIRD CENSUS ANALYZER — Complete Results', color='white', fontsize=14, fontweight='bold')

# Population estimates with CI
ax = axes[0, 0]
ax.set_facecolor('#111827')
sort_idx = np.argsort(pop_results['abundance'])[::-1][:20]
ax.errorbar(range(20), pop_results['abundance'][sort_idx],
           yerr=[pop_results['abundance'][sort_idx] - pop_results['ci_low'][sort_idx],
                 pop_results['ci_high'][sort_idx] - pop_results['abundance'][sort_idx]],
           fmt='o', color='#22c55e', ecolor='#22c55e', alpha=0.7, markersize=5)
ax.scatter(range(20), true_N[sort_idx], marker='x', color='#ef4444', s=50, zorder=5, label='True N')
ax.set_xlabel('Site (ranked)', color='white')
ax.set_ylabel('Abundance', color='white')
ax.set_title('Population Estimates (top 20 sites)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Habitat model fit
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.scatter(pop_results['abundance'], hab_results['predictions'], color='#3b82f6', s=20, alpha=0.7)
ax.plot([0, pop_results['abundance'].max()], [0, pop_results['abundance'].max()], '--', color='gray')
ax.set_xlabel('Estimated Abundance', color='white')
ax.set_ylabel('Habitat Model Prediction', color='white')
ax.set_title(f'Habitat Model (R²={hab_results["r_squared"]:.3f})', color='white')
ax.tick_params(colors='gray')

# Diversity scatter
ax = axes[0, 2]
ax.set_facecolor('#111827')
sc = ax.scatter(coords[:, 0], coords[:, 1], c=div_results['shannon'], cmap='YlGn',
               s=40, edgecolors='white', linewidth=0.5)
ax.set_xlabel('X (km)', color='white')
ax.set_ylabel('Y (km)', color='white')
ax.set_title('Shannon Diversity by Site', color='white')
ax.tick_params(colors='gray')
plt.colorbar(sc, ax=ax, shrink=0.8, label="H'")

# Priority comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
for name, scores in priority_results.items():
    sorted_s = np.sort(scores)[::-1]
    ax.plot(range(n_sites), sorted_s, 'o-', markersize=3, linewidth=1.5, label=name)
ax.set_xlabel('Site Rank', color='white')
ax.set_ylabel('Priority Score', color='white')
ax.set_title('Priority Rankings by Strategy', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Spatial priority map
ax = axes[1, 1]
ax.set_facecolor('#111827')
balanced = priority_results['Balanced']
sc = ax.scatter(coords[:, 0], coords[:, 1], c=balanced, cmap='RdYlGn',
               s=60, edgecolors='white', linewidth=0.5)
# Mark top 5
top5 = np.argsort(balanced)[-5:]
ax.scatter(coords[top5, 0], coords[top5, 1], s=200, facecolors='none',
          edgecolors='#ef4444', linewidth=2.5, label='Top 5 priority')
ax.set_xlabel('X (km)', color='white')
ax.set_ylabel('Y (km)', color='white')
ax.set_title('Balanced Priority Map', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
plt.colorbar(sc, ax=ax, shrink=0.8, label='Score')

# Report
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
ax.text(0.02, 0.98, report, transform=ax.transAxes, fontsize=7, color='white',
        verticalalignment='top', fontfamily='monospace')

plt.tight_layout()
plt.show()

print()
print(report)
print()
print("CAPSTONE COMPLETE")
print("=" * 60)
print("You built a Bird Census Analyzer from scratch:")
print("  1. Data ingestion with input validation")
print("  2. N-mixture population estimation with confidence intervals")
print("  3. Habitat suitability mapping with environmental regression")
print("  4. Biodiversity assessment with multiple diversity indices")
print("  5. Conservation priority scoring under three strategies")
print("  6. Integrated pipeline with report generation")
print()
print("Skills demonstrated: ecology, statistics, spatial analysis,")
print("machine learning, software engineering, conservation science.")`,
      challenge: 'Add a temporal module: simulate 5 years of annual surveys and track population trends. Flag sites where abundance is declining significantly (Mann-Kendall trend test) and add a "declining population" alert to the priority scoring system.',
      successHint: 'You have completed a full capstone project: from raw survey data to conservation recommendations. This is the shape of real conservation technology — not a single clever algorithm, but an integrated system where ecology, statistics, spatial analysis, and software engineering work together. The Bird Census Analyzer is portfolio-ready.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (hornbill biomechanics and ecology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Bird Census Analyzer. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
