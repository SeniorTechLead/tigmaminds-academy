import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BasketWeaverLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Design: Weave Strength Predictor — from fiber selection to load certification',
      concept: `In Level 3 you learned fiber stress-strain analysis, weave pattern mathematics, tensile testing simulation, load distribution modeling, fiber selection optimization, and predictive modeling. Now you build the complete Weave Strength Predictor: an end-to-end system that takes fiber type and weave pattern as inputs and outputs a certified load capacity with confidence intervals.

The predictor pipeline has six stages:
1. **Fiber characterization**: input material type, run virtual tensile tests, fit Weibull parameters.
2. **Weave analysis**: generate pattern matrix, compute crimp/interlock/float metrics.
3. **Load simulation**: spring-network model with progressive failure analysis.
4. **Strength prediction**: regression model combining fiber and weave features.
5. **Uncertainty quantification**: bootstrap confidence intervals on predicted strength.
6. **Design report**: certified load capacity, safety factors, and optimization recommendations.

This mirrors real materials testing laboratories, where engineers characterize materials, model structures, predict performance, and certify products for field use.`,
      analogy: 'Building the Weave Strength Predictor is like developing a bridge load rating system. You do not just test one bridge — you characterize the steel (fiber testing), analyze the truss geometry (weave pattern), model load paths (spring network), predict failure load (regression), quantify uncertainty (bootstrap), and issue a certified weight limit (report). Each stage builds on the previous, and the final certificate carries legal weight.',
      storyConnection: 'The basket weaver certified her work through reputation — years of baskets that never failed under load. The Weave Strength Predictor provides the same certification computationally: given these fibers and this pattern, the basket will safely hold X kilograms with 95% confidence. It translates craft expertise into engineering specifications.',
      checkQuestion: 'Why must the predictor pipeline include both physics-based simulation (spring network) and statistical prediction (regression)?',
      checkAnswer: 'The spring network model is physically accurate but slow — simulating progressive failure for every design candidate is computationally expensive. The regression model is fast but needs training data. The pipeline uses the physics model to generate training data, then the regression model for rapid prediction. This hybrid approach gives you the accuracy of physics simulation with the speed of statistical prediction — the best of both worlds.',
      codeIntro: 'Build Stage 1: automated fiber characterization with Weibull parameter fitting and quality classification.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# CAPSTONE: Weave Strength Predictor
# Stage 1: Fiber Characterization
# ============================================================

class FiberCharacterizer:
    """Automated fiber tensile testing and Weibull parameter fitting."""

    def __init__(self, fiber_name):
        self.name = fiber_name
        self.test_results = []
        self.weibull_m = None
        self.weibull_sigma0 = None
        self.youngs_modulus = None

    def run_tensile_tests(self, n_tests=50, true_sigma0=None, true_m=None, true_E=None):
        """Simulate n tensile tests and record results."""
        u = np.random.uniform(0, 1, n_tests)
        strengths = true_sigma0 * (-np.log(1 - u)) ** (1 / true_m)
        self.test_results = strengths
        self.youngs_modulus = true_E * np.random.lognormal(0, 0.05)
        return strengths

    def fit_weibull(self):
        """Fit Weibull parameters using maximum likelihood estimation."""
        data = np.sort(self.test_results)
        n = len(data)

        # MLE for Weibull: iterative solution
        # Start with method-of-moments estimate
        mean_s = np.mean(data)
        std_s = np.std(data)
        cv = std_s / mean_s
        # Approximate: m ≈ 1.2 / cv
        m_est = 1.2 / max(cv, 0.01)

        # Newton-Raphson refinement
        for _ in range(50):
            log_data = np.log(data)
            data_m = data ** m_est
            sum_data_m = np.sum(data_m)
            sum_data_m_log = np.sum(data_m * log_data)

            f = 1/m_est + np.mean(log_data) - sum_data_m_log / sum_data_m
            # Numerical derivative
            dm = 0.001
            data_m2 = data ** (m_est + dm)
            f2 = 1/(m_est+dm) + np.mean(log_data) - np.sum(data_m2*log_data)/np.sum(data_m2)
            fprime = (f2 - f) / dm

            if abs(fprime) > 1e-10:
                m_est -= f / fprime
                m_est = max(0.5, min(50, m_est))

        self.weibull_m = m_est
        self.weibull_sigma0 = (np.mean(data ** m_est)) ** (1 / m_est)
        return self.weibull_m, self.weibull_sigma0

    def quality_grade(self):
        """Assign quality grade based on Weibull modulus."""
        if self.weibull_m is None:
            return 'UNTESTED'
        if self.weibull_m >= 5:
            return 'A (consistent)'
        elif self.weibull_m >= 3:
            return 'B (moderate variation)'
        elif self.weibull_m >= 2:
            return 'C (high variation)'
        else:
            return 'D (unreliable)'

    def predict_strength_at_reliability(self, reliability=0.95):
        """Strength below which only (1-reliability) fraction fail."""
        if self.weibull_m is None or self.weibull_sigma0 is None:
            return 0
        return self.weibull_sigma0 * (-np.log(reliability)) ** (1 / self.weibull_m)

# --- Characterize multiple fiber types ---
fiber_specs = {
    'Bamboo': {'sigma0': 130, 'm': 3.5, 'E': 18},
    'Cane': {'sigma0': 75, 'm': 3.0, 'E': 8},
    'Jute': {'sigma0': 55, 'm': 2.5, 'E': 20},
    'Palm leaf': {'sigma0': 25, 'm': 4.0, 'E': 4},
}

characterizations = {}
for name, specs in fiber_specs.items():
    fc = FiberCharacterizer(name)
    fc.run_tensile_tests(50, specs['sigma0'], specs['m'], specs['E'])
    fc.fit_weibull()
    characterizations[name] = fc

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Weibull fits
ax0 = axes[0, 0]
colors = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7']
for (name, fc), color in zip(characterizations.items(), colors):
    data = np.sort(fc.test_results)
    n = len(data)
    p = (np.arange(1, n+1) - 0.5) / n
    ax0.plot(data, p, 'o', color=color, markersize=3, alpha=0.6)
    # Fitted Weibull CDF
    x_fit = np.linspace(0, data.max()*1.2, 100)
    cdf_fit = 1 - np.exp(-(x_fit / fc.weibull_sigma0) ** fc.weibull_m)
    ax0.plot(x_fit, cdf_fit, color=color, linewidth=2, label=f'{name} (m={fc.weibull_m:.1f})')
ax0.set_xlabel('Strength (MPa)', color='white')
ax0.set_ylabel('Cumulative probability', color='white')
ax0.set_title('Weibull fits to tensile test data', color='white', fontsize=11)
ax0.legend(fontsize=8)

# Strength at 95% reliability
ax1 = axes[0, 1]
names = list(characterizations.keys())
s95 = [characterizations[n].predict_strength_at_reliability(0.95) for n in names]
s_mean = [np.mean(characterizations[n].test_results) for n in names]
x = np.arange(len(names))
ax1.bar(x - 0.2, s_mean, 0.4, color=[c for c in colors], alpha=0.5, label='Mean strength')
ax1.bar(x + 0.2, s95, 0.4, color=[c for c in colors], label='95% reliable strength')
ax1.set_xticks(x)
ax1.set_xticklabels(names, color='white', fontsize=9)
ax1.set_ylabel('Strength (MPa)', color='white')
ax1.set_title('Mean vs 95%-reliable strength', color='white', fontsize=11)
ax1.legend(fontsize=8)

# Quality grades
ax2 = axes[1, 0]
grades = [characterizations[n].quality_grade() for n in names]
grade_colors = {'A (consistent)': '#22c55e', 'B (moderate variation)': '#f59e0b',
                'C (high variation)': '#ef4444', 'D (unreliable)': '#6b7280'}
bar_colors = [grade_colors.get(g, '#6b7280') for g in grades]
moduli = [characterizations[n].weibull_m for n in names]
ax2.bar(names, moduli, color=bar_colors)
for i, (m, g) in enumerate(zip(moduli, grades)):
    ax2.text(i, m + 0.1, g.split('(')[0].strip(), ha='center', color='white', fontsize=8)
ax2.set_ylabel('Weibull modulus (m)', color='white')
ax2.set_title('Fiber quality grades', color='white', fontsize=11)
for label in ax2.get_xticklabels():
    label.set_color('white')

# Characterization report
ax3 = axes[1, 1]
ax3.axis('off')
report = "FIBER CHARACTERIZATION REPORT\n" + "=" * 45 + "\n\n"
for name, fc in characterizations.items():
    report += f"{name}:\n"
    report += f"  Tests: {len(fc.test_results)}, E: {fc.youngs_modulus:.1f} GPa\n"
    report += f"  Weibull: m={fc.weibull_m:.2f}, sigma0={fc.weibull_sigma0:.1f} MPa\n"
    report += f"  Mean: {np.mean(fc.test_results):.1f}, Std: {np.std(fc.test_results):.1f} MPa\n"
    report += f"  95% reliable: {fc.predict_strength_at_reliability(0.95):.1f} MPa\n"
    report += f"  Grade: {fc.quality_grade()}\n\n"

ax3.text(0.05, 0.95, report, transform=ax3.transAxes, color='#22c55e',
    fontsize=8, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print("STAGE 1 COMPLETE: Fiber Characterization")
for name, fc in characterizations.items():
    print(f"  {name}: m={fc.weibull_m:.2f}, sigma0={fc.weibull_sigma0:.1f} MPa, grade={fc.quality_grade()}")`,
      challenge: 'Test whether 30 samples per fiber gives significantly different Weibull fits than 50. Run 100 iterations at each sample size and compare the variance of fitted parameters.',
      successHint: 'Stage 1 is complete — fibers are characterized with fitted Weibull distributions and quality grades.',
    },
    {
      title: 'Stage 2: Weave pattern analysis and structural scoring',
      concept: `Stage 2 takes a user-specified weave pattern and computes its structural properties automatically. The system accepts patterns in multiple formats: named presets (plain, twill, herringbone), custom binary matrices, or parametric descriptions (float length, repeat unit size).

For each pattern, we compute a comprehensive structural score combining crimp factor, interlocking density, float length distribution, cover factor, and symmetry. These metrics feed into the strength prediction model.`,
      analogy: 'Weave analysis is like grading the blueprint of a building before construction. You check structural redundancy, load paths, and weak points on paper. Finding problems in the blueprint is far cheaper than finding them after the building collapses.',
      storyConnection: 'The basket weaver could look at a weave pattern and estimate its strength by eye — decades of experience encoded as intuition. Our automated analyzer does the same in milliseconds, computing the same structural properties her eyes assessed intuitively.',
      checkQuestion: 'Why does float length distribution matter more than maximum float length for predicting basket strength?',
      checkAnswer: 'A pattern with one long float in an otherwise tight weave has a single weak point. A pattern with many medium floats has distributed weakness. The distribution captures whether weak points are isolated (repairable) or systemic (fundamental design flaw). Maximum alone misses this distinction.',
      codeIntro: 'Build the automated weave analyzer with structural scoring for any input pattern.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class WeaveAnalyzer:
    """Automated structural analysis of weave patterns."""

    def __init__(self, pattern_matrix):
        self.W = np.array(pattern_matrix, dtype=int)
        self.rows, self.cols = self.W.shape

    @classmethod
    def plain(cls, n=20):
        W = np.zeros((n, n), dtype=int)
        for i in range(n):
            for j in range(n):
                W[i,j] = (i+j) % 2
        return cls(W)

    @classmethod
    def twill(cls, n=20, shift=2):
        W = np.zeros((n, n), dtype=int)
        for i in range(n):
            for j in range(n):
                W[i,j] = 1 if ((i+j) % (2*shift)) < shift else 0
        return cls(W)

    @classmethod
    def satin(cls, n=20, float_len=4):
        W = np.zeros((n, n), dtype=int)
        for i in range(n):
            for j in range(n):
                W[i,j] = 1 if (j % (float_len+1)) != (i % (float_len+1)) else 0
        return cls(W)

    def compute_metrics(self):
        """Compute all structural metrics."""
        n, m = self.rows, self.cols

        # Cover factor
        cover = np.mean(self.W)

        # Float length distribution
        floats_warp = []
        for i in range(n):
            run = 0
            for j in range(m):
                if self.W[i,j] == 1:
                    run += 1
                else:
                    if run > 0: floats_warp.append(run)
                    run = 0
            if run > 0: floats_warp.append(run)

        floats_weft = []
        for j in range(m):
            run = 0
            for i in range(n):
                if self.W[i,j] == 1:
                    run += 1
                else:
                    if run > 0: floats_weft.append(run)
                    run = 0
            if run > 0: floats_weft.append(run)

        all_floats = floats_warp + floats_weft
        max_float = max(all_floats) if all_floats else 0
        mean_float = np.mean(all_floats) if all_floats else 0

        # Crimp
        transitions = 0
        for i in range(n):
            for j in range(1, m):
                if self.W[i,j] != self.W[i,j-1]: transitions += 1
        crimp = transitions / (n * max(m-1, 1))

        # Interlocking
        crossings = 0
        for i in range(n-1):
            for j in range(m-1):
                if self.W[i,j] != self.W[i,j+1]: crossings += 1
                if self.W[i,j] != self.W[i+1,j]: crossings += 1
        interlocking = crossings / (n * m)

        # Symmetry score
        h_sym = np.mean(self.W == np.flip(self.W, axis=1))
        v_sym = np.mean(self.W == np.flip(self.W, axis=0))
        symmetry = (h_sym + v_sym) / 2

        # Overall structural score (0-100)
        score = (crimp * 25 +
                 interlocking * 25 +
                 (1 - max_float/max(n,1)) * 20 +
                 cover * 15 +
                 symmetry * 15)

        return {
            'cover_factor': cover, 'crimp': crimp, 'interlocking': interlocking,
            'max_float': max_float, 'mean_float': mean_float,
            'symmetry': symmetry, 'structural_score': score,
            'float_distribution': all_floats,
        }

# --- Analyze multiple patterns ---
patterns = {
    'Plain': WeaveAnalyzer.plain(20),
    'Twill 2/2': WeaveAnalyzer.twill(20, 2),
    'Twill 3/1': WeaveAnalyzer.twill(20, 3),
    'Satin 5': WeaveAnalyzer.satin(20, 5),
}

all_metrics = {}
for name, analyzer in patterns.items():
    all_metrics[name] = analyzer.compute_metrics()

# --- Plot ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Pattern visualizations
for idx, (name, analyzer) in enumerate(list(patterns.items())[:3]):
    ax = axes[0, idx]
    ax.imshow(analyzer.W, cmap='YlGn', aspect='equal', interpolation='nearest')
    m = all_metrics[name]
    ax.set_title(f"{name} (score: {m['structural_score']:.0f}/100)", color='white', fontsize=10)

# Structural scores comparison
ax = axes[1, 0]
names = list(all_metrics.keys())
scores = [all_metrics[n]['structural_score'] for n in names]
colors = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7']
ax.bar(names, scores, color=colors)
ax.set_ylabel('Structural score', color='white')
ax.set_title('Overall structural scores', color='white', fontsize=11)
for label in ax.get_xticklabels():
    label.set_color('white'); label.set_fontsize(8); label.set_rotation(20)

# Float distributions
ax = axes[1, 1]
for (name, m), color in zip(all_metrics.items(), colors):
    if m['float_distribution']:
        ax.hist(m['float_distribution'], bins=range(1, 10), alpha=0.5, color=color, label=name)
ax.set_xlabel('Float length', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Float length distributions', color='white', fontsize=11)
ax.legend(fontsize=8)

# Metrics radar (as grouped bars)
ax = axes[1, 2]
metric_keys = ['crimp', 'interlocking', 'cover_factor', 'symmetry']
x = np.arange(len(metric_keys))
w = 0.2
for i, (name, color) in enumerate(zip(names, colors)):
    vals = [all_metrics[name][k] for k in metric_keys]
    ax.bar(x + i*w, vals, w, color=color, label=name)
ax.set_xticks(x + w*1.5)
ax.set_xticklabels(['Crimp', 'Interlock', 'Coverage', 'Symmetry'], color='white', fontsize=8)
ax.set_title('Detailed metrics comparison', color='white', fontsize=11)
ax.legend(fontsize=7)

plt.tight_layout()
plt.show()

print("STAGE 2 COMPLETE: Weave Pattern Analysis")
print(f"{'Pattern':<15} {'Score':>6} {'Crimp':>6} {'Float':>6} {'Interlock':>9}")
print("-" * 45)
for name, m in all_metrics.items():
    print(f"{name:<15} {m['structural_score']:>5.0f} {m['crimp']:>6.3f} {m['max_float']:>6} {m['interlocking']:>9.3f}")`,
      challenge: 'Design a custom pattern that scores higher than plain weave on structural score. What combination of crimp, float length, and interlocking achieves this?',
      successHint: 'Stage 2 is complete — weave patterns are analyzed and scored for structural performance.',
    },
    {
      title: 'Stage 3: Physics-based strength simulation engine',
      concept: `Stage 3 builds the physics simulation engine that generates training data for the regression model. For each fiber-weave combination, we simulate progressive failure under load: apply force incrementally, break fibers as they reach their Weibull-distributed strength, redistribute load, repeat until catastrophic failure.

The simulation captures nonlinear behavior that simple regression cannot model from first principles: load redistribution after fiber breakage, stress concentration at damaged regions, and the transition from gradual degradation to sudden collapse.`,
      analogy: 'The simulation engine is like a crash test laboratory that runs virtual crashes instead of destroying real cars. Each simulated basket destruction teaches the model something about failure mechanics without wasting actual materials.',
      storyConnection: 'The basket weaver learned from every broken basket — what failed, where, and why. Our simulation engine breaks thousands of virtual baskets in seconds, extracting the same lessons that took the weaver a lifetime to accumulate.',
      checkQuestion: 'Why is progressive failure simulation necessary when you could simply multiply average fiber strength by number of fibers?',
      checkAnswer: 'Simple multiplication assumes all fibers carry equal load and fail simultaneously. Reality is different: the weakest fiber fails first, its load transfers to neighbors, those neighbors now carry extra stress and may fail too, creating a cascade. The actual basket strength is 30-60% lower than the theoretical maximum because of this progressive cascade. Simulation captures the cascade; multiplication does not.',
      codeIntro: 'Build the progressive failure simulation engine and run batch simulations to generate training data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class BasketSimulator:
    """Progressive failure simulation for woven baskets."""

    def __init__(self, n_warp, n_weft, fiber_sigma0, fiber_m, fiber_E, interlock):
        self.nw = n_warp
        self.nf = n_weft
        self.sigma0 = fiber_sigma0
        self.m = fiber_m
        self.E = fiber_E
        self.interlock = interlock

    def generate_fiber_strengths(self):
        n_total = self.nw + self.nf
        u = np.random.uniform(0, 1, n_total)
        return self.sigma0 * (-np.log(1 - u)) ** (1 / self.m)

    def simulate_failure(self):
        """Run progressive failure simulation. Returns max load (N)."""
        strengths = self.generate_fiber_strengths()
        n = len(strengths)
        alive = np.ones(n, dtype=bool)
        tensions = np.ones(n) * 0.5  # initial tension distribution

        # Load redistribution efficiency depends on interlocking
        redist_eff = 0.5 + 0.5 * self.interlock

        max_load = 0
        load = 0
        load_step = 0.5  # Newtons per step
        load_history = []
        alive_history = []

        while alive.sum() > n * 0.2:  # stop at 80% fiber loss
            load += load_step
            tensions[alive] = load / alive.sum()

            # Check for failures
            failed_this_step = False
            for _ in range(5):  # cascade within one load step
                stress_ratios = np.zeros(n)
                stress_ratios[alive] = tensions[alive] / strengths[alive]
                over_stressed = alive & (stress_ratios >= 1.0)

                if not over_stressed.any():
                    break

                # Break over-stressed fibers
                alive[over_stressed] = False
                failed_this_step = True

                # Redistribute load
                if alive.sum() > 0:
                    released_load = tensions[over_stressed].sum()
                    # Only fraction redistributes (rest is lost to slack)
                    redistributed = released_load * redist_eff
                    tensions[alive] += redistributed / alive.sum()

            load_history.append(load)
            alive_history.append(alive.sum())

            if alive.sum() > 0:
                max_load = max(max_load, load)

        return {
            'max_load': max_load,
            'load_history': load_history,
            'alive_history': alive_history,
            'n_fibers': n,
        }

# --- Run batch simulations ---
n_sims = 200
configs = []
results = []

for _ in range(n_sims):
    nw = np.random.randint(15, 60)
    nf = np.random.randint(15, 60)
    sigma0 = np.random.uniform(25, 140)
    m = np.random.uniform(2, 5)
    E = np.random.uniform(3, 22)
    interlock = np.random.uniform(0.2, 0.9)

    sim = BasketSimulator(nw, nf, sigma0, m, E, interlock)
    result = sim.simulate_failure()

    configs.append({'nw': nw, 'nf': nf, 'sigma0': sigma0, 'm': m, 'E': E, 'interlock': interlock})
    results.append(result['max_load'])

configs_arr = np.array([[c['nw'], c['nf'], c['sigma0'], c['m'], c['E'], c['interlock']] for c in configs])
results_arr = np.array(results)

# Show a few individual simulations
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Individual failure curves
ax0 = axes[0, 0]
colors = ['#22c55e', '#f59e0b', '#3b82f6']
demo_configs = [
    (30, 30, 100, 3.5, 15, 0.8),
    (30, 30, 100, 3.5, 15, 0.3),
    (30, 30, 50, 2.5, 8, 0.8),
]
demo_labels = ['Strong + tight weave', 'Strong + loose weave', 'Weak + tight weave']
for (nw,nf,s0,m,E,il), color, label in zip(demo_configs, colors, demo_labels):
    sim = BasketSimulator(nw, nf, s0, m, E, il)
    r = sim.simulate_failure()
    ax0.plot(r['load_history'], r['alive_history'], color=color, linewidth=2, label=f"{label} ({r['max_load']:.0f}N)")
ax0.set_xlabel('Applied load (N)', color='white')
ax0.set_ylabel('Surviving fibers', color='white')
ax0.set_title('Progressive failure curves', color='white', fontsize=11)
ax0.legend(fontsize=8)

# Strength distribution from batch
ax1 = axes[0, 1]
ax1.hist(results_arr, bins=30, color='#22c55e', edgecolor='#111827', alpha=0.7)
ax1.set_xlabel('Maximum load at failure (N)', color='white')
ax1.set_ylabel('Count', color='white')
ax1.set_title(f'Simulated basket strengths (n={n_sims})', color='white', fontsize=11)

# Strength vs interlock
ax2 = axes[1, 0]
sc = ax2.scatter(configs_arr[:, 5], results_arr, c=configs_arr[:, 2], s=15, cmap='viridis', alpha=0.6)
ax2.set_xlabel('Interlocking factor', color='white')
ax2.set_ylabel('Max load (N)', color='white')
ax2.set_title('Strength vs interlocking (color=fiber UTS)', color='white', fontsize=11)
plt.colorbar(sc, ax=ax2, label='Fiber sigma0 (MPa)', shrink=0.8)

# Strength vs total fibers
ax3 = axes[1, 1]
total_fibers = configs_arr[:, 0] + configs_arr[:, 1]
ax3.scatter(total_fibers, results_arr, s=15, c='#f59e0b', alpha=0.5)
ax3.set_xlabel('Total fibers (warp + weft)', color='white')
ax3.set_ylabel('Max load (N)', color='white')
ax3.set_title('Strength vs fiber count', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"STAGE 3 COMPLETE: Physics Simulation Engine")
print(f"  Simulations run: {n_sims}")
print(f"  Strength range: {results_arr.min():.0f} - {results_arr.max():.0f} N")
print(f"  Mean strength: {results_arr.mean():.0f} N")
print(f"  Training data ready for regression model")`,
      challenge: 'Add temperature as a variable: at high temperature, fiber strength decreases by 2% per degree above 25C. Simulate baskets at 25C, 35C, and 45C. How much does mean strength decrease per 10C?',
      successHint: 'Stage 3 is complete — the simulation engine generates realistic training data from physics-based progressive failure.',
    },
    {
      title: 'Stage 4: Regression model training with cross-validation',
      concept: `Stage 4 trains the prediction model on the simulation data. We use ridge regression in log-space with interaction features, validated by 5-fold cross-validation. The model translates fiber properties and weave metrics into predicted basket strength without running expensive simulations for each query.`,
      analogy: 'The regression model is like a lookup table that was built by running thousands of experiments. Instead of re-running the experiment each time you have a new question, you consult the table. The table is fast; the experiments were slow. The model compresses simulation knowledge into instant predictions.',
      storyConnection: 'Years of experience taught the basket weaver what would work without testing every combination. Our regression model is the computational equivalent of that expertise — distilled from thousands of virtual tests into a formula that predicts strength from specifications.',
      checkQuestion: 'Why train on log-transformed strength rather than raw strength values?',
      checkAnswer: 'Basket strength varies over orders of magnitude (10N to 1000N). Linear regression on raw values gives equal weight to a 10N error at 20N (50% off) and at 500N (2% off). In log-space, errors are proportional — a 10% overprediction looks the same whether the true value is 20N or 500N. This matches engineering needs: a 10% error matters equally at any scale.',
      codeIntro: 'Train and cross-validate the strength prediction model with full diagnostic output.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Regenerate simulation data ---
n_sims = 300
configs = []
strengths = []

for _ in range(n_sims):
    nw = np.random.randint(15, 60)
    nf = np.random.randint(15, 60)
    s0 = np.random.uniform(25, 140)
    m_w = np.random.uniform(2, 5)
    E = np.random.uniform(3, 22)
    interlock = np.random.uniform(0.2, 0.9)
    crimp = np.random.uniform(0.1, 0.8)

    # Simplified physics model for speed
    base = s0 * (nw + nf) * 0.01
    weave_eff = 0.3 + 0.7 * interlock * crimp
    synergy = 1.0 + 0.5 * (s0 / 100) * interlock
    variability = 1.0 - 0.1 / max(m_w, 0.5)
    strength = base * weave_eff * synergy * variability * np.random.lognormal(0, 0.12)

    configs.append([nw, nf, s0, m_w, E, interlock, crimp])
    strengths.append(max(1, strength))

X_raw = np.array(configs)
y = np.array(strengths)
log_y = np.log(y)

# Feature engineering
def make_features(X):
    n = X.shape[0]
    return np.column_stack([
        np.ones(n),
        np.log(X[:, 0] + X[:, 1] + 1),  # log(total fibers)
        np.log(X[:, 2] + 1),              # log(sigma0)
        X[:, 3],                           # Weibull m
        np.log(X[:, 4] + 1),              # log(E)
        X[:, 5],                           # interlock
        X[:, 6],                           # crimp
        np.log(X[:, 2]+1) * X[:, 5],      # sigma0 x interlock
        X[:, 5] * X[:, 6],                # interlock x crimp
        np.log(X[:, 0]+X[:, 1]+1) * np.log(X[:, 2]+1),  # fibers x sigma0
    ])

X_feat = make_features(X_raw)

# --- 5-fold cross-validation ---
k = 5
n = len(y)
idx = np.random.permutation(n)
fold_size = n // k

cv_preds = np.zeros(n)
fold_rmses = []

for fold in range(k):
    test_idx = idx[fold*fold_size:(fold+1)*fold_size]
    train_idx = np.concatenate([idx[:fold*fold_size], idx[(fold+1)*fold_size:]])

    X_tr, X_te = X_feat[train_idx], X_feat[test_idx]
    ly_tr = log_y[train_idx]

    lam = 0.5
    XtX = X_tr.T @ X_tr + lam * np.eye(X_tr.shape[1])
    w = np.linalg.solve(XtX, X_tr.T @ ly_tr)

    cv_preds[test_idx] = np.exp(X_te @ w)
    fold_rmse = np.sqrt(np.mean((y[test_idx] - cv_preds[test_idx])**2))
    fold_rmses.append(fold_rmse)

# Overall CV metrics
cv_residuals = y - cv_preds
cv_rmse = np.sqrt(np.mean(cv_residuals**2))
cv_r2 = 1 - np.sum(cv_residuals**2) / np.sum((y - np.mean(y))**2)
cv_mape = np.mean(np.abs(cv_residuals / y)) * 100

# Train final model on all data
lam = 0.5
XtX = X_feat.T @ X_feat + lam * np.eye(X_feat.shape[1])
w_final = np.linalg.solve(XtX, X_feat.T @ log_y)

# Feature importance
feat_names = ['intercept', 'log(fibers)', 'log(sigma0)', 'Weibull_m', 'log(E)',
              'interlock', 'crimp', 'sigma0*interlock', 'interlock*crimp', 'fibers*sigma0']
importance = np.abs(w_final)

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# CV predictions
ax0 = axes[0, 0]
ax0.scatter(y, cv_preds, s=10, c='#22c55e', alpha=0.5)
ax0.plot([0, y.max()], [0, y.max()], '--', color='white', linewidth=1)
ax0.set_xlabel('True strength (N)', color='white')
ax0.set_ylabel('CV predicted (N)', color='white')
ax0.set_title(f'5-fold CV (R²={cv_r2:.3f}, RMSE={cv_rmse:.1f}N)', color='white', fontsize=11)

# Fold stability
ax1 = axes[0, 1]
ax1.bar(range(k), fold_rmses, color='#f59e0b')
ax1.axhline(np.mean(fold_rmses), color='white', linestyle='--', label=f'Mean: {np.mean(fold_rmses):.1f}')
ax1.set_xlabel('Fold', color='white')
ax1.set_ylabel('RMSE (N)', color='white')
ax1.set_title('Fold-by-fold RMSE', color='white', fontsize=11)
ax1.legend(fontsize=9)

# Feature importance
ax2 = axes[1, 0]
sorted_idx = np.argsort(importance[1:])
ax2.barh(range(len(feat_names)-1), importance[1:][sorted_idx], color='#3b82f6')
ax2.set_yticks(range(len(feat_names)-1))
ax2.set_yticklabels([feat_names[i+1] for i in sorted_idx], color='white', fontsize=8)
ax2.set_title('Feature importance', color='white', fontsize=11)

# Residual vs predicted
ax3 = axes[1, 1]
pct_err = cv_residuals / y * 100
ax3.scatter(cv_preds, pct_err, s=10, c='#a855f7', alpha=0.5)
ax3.axhline(0, color='white', linestyle='--')
ax3.set_xlabel('Predicted strength (N)', color='white')
ax3.set_ylabel('Error (%)', color='white')
ax3.set_title(f'Residual analysis (MAPE={cv_mape:.1f}%)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"STAGE 4 COMPLETE: Model Training & Validation")
print(f"  Training samples: {n}")
print(f"  CV R²: {cv_r2:.3f}")
print(f"  CV RMSE: {cv_rmse:.1f} N")
print(f"  CV MAPE: {cv_mape:.1f}%")
print(f"  Fold RMSEs: {[f'{r:.1f}' for r in fold_rmses]}")
print(f"  Top feature: {feat_names[np.argmax(importance[1:])+1]}")`,
      challenge: 'Compare ridge regression with an unregularized model (lambda=0). Which has better CV performance? What happens to the feature weights when you remove regularization?',
      successHint: 'Stage 4 is complete — the prediction model is trained and validated with cross-validation diagnostics.',
    },
    {
      title: 'Stage 5: Confidence intervals and safety factor certification',
      concept: `Stage 5 adds uncertainty quantification through bootstrap confidence intervals and applies engineering safety factors. A basket certified for 50N does not mean it fails at 51N — it means the lower bound of the 95% confidence interval, divided by the safety factor, exceeds 50N. This multi-layer conservatism protects against measurement errors, model uncertainty, and environmental degradation.`,
      analogy: 'A certified bridge weight limit of 10 tons does not mean the bridge collapses at 10.1 tons. It means engineers tested to 20 tons (2x safety factor), are 95% confident the real capacity exceeds 20 tons, and then certified at 10 tons. Three layers of conservatism ensure safety. Our basket certification works the same way.',
      storyConnection: 'The basket weaver built baskets that never failed under expected loads — she built in her own safety factor through experience. Our certification system makes that safety factor explicit and quantified: this basket is certified for X kg with Y% confidence and Z safety factor.',
      checkQuestion: 'Why use a safety factor of 2.0 for hand-woven baskets instead of the 1.5 used for industrial products?',
      checkAnswer: 'Hand-woven baskets have more variability than industrial products: fiber quality varies between harvests, weave tension varies between weavers, and there is no quality control inspection. Higher variability requires a higher safety factor to maintain the same reliability. The 2.0 factor absorbs variability that industrial processes control but craft processes do not.',
      codeIntro: 'Implement bootstrap confidence intervals and engineering certification for basket designs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Recreate model from Stage 4 (simplified) ---
n_sims = 300
X_raw = np.column_stack([
    np.random.randint(15, 60, n_sims),
    np.random.randint(15, 60, n_sims),
    np.random.uniform(25, 140, n_sims),
    np.random.uniform(2, 5, n_sims),
    np.random.uniform(3, 22, n_sims),
    np.random.uniform(0.2, 0.9, n_sims),
    np.random.uniform(0.1, 0.8, n_sims),
]).astype(float)

y = np.array([
    max(1, X_raw[i,2]*(X_raw[i,0]+X_raw[i,1])*0.01 *
    (0.3+0.7*X_raw[i,5]*X_raw[i,6]) *
    (1+0.5*X_raw[i,2]/100*X_raw[i,5]) *
    np.random.lognormal(0, 0.12))
    for i in range(n_sims)
])

def make_features(X):
    n = X.shape[0]
    return np.column_stack([np.ones(n), np.log(X[:,0]+X[:,1]+1), np.log(X[:,2]+1),
        X[:,3], np.log(X[:,4]+1), X[:,5], X[:,6],
        np.log(X[:,2]+1)*X[:,5], X[:,5]*X[:,6],
        np.log(X[:,0]+X[:,1]+1)*np.log(X[:,2]+1)])

X_feat = make_features(X_raw)
log_y = np.log(y)

def bootstrap_predict(X_feat, log_y, x_new, n_boot=500):
    n = len(log_y)
    preds = []
    for _ in range(n_boot):
        idx = np.random.choice(n, n, replace=True)
        X_b, ly_b = X_feat[idx], log_y[idx]
        lam = 0.5
        XtX = X_b.T @ X_b + lam * np.eye(X_b.shape[1])
        w = np.linalg.solve(XtX, X_b.T @ ly_b)
        preds.append(np.exp(x_new @ w))
    return np.array(preds)

# --- Test designs ---
designs = [
    {'name': 'Rice basket (bamboo, plain)', 'nw': 40, 'nf': 40, 's0': 120, 'm': 3.5,
     'E': 18, 'il': 0.75, 'cr': 0.65, 'target_load': 150},
    {'name': 'Fish trap (cane, twill)', 'nw': 25, 'nf': 25, 's0': 70, 'm': 3.0,
     'E': 8, 'il': 0.50, 'cr': 0.40, 'target_load': 50},
    {'name': 'Fruit basket (palm, plain)', 'nw': 35, 'nf': 35, 's0': 25, 'm': 4.0,
     'E': 4, 'il': 0.70, 'cr': 0.60, 'target_load': 30},
    {'name': 'Heavy-duty (bamboo, double)', 'nw': 60, 'nf': 60, 's0': 130, 'm': 3.5,
     'E': 18, 'il': 0.85, 'cr': 0.70, 'target_load': 300},
]

SAFETY_FACTOR = 2.0

cert_results = []
for d in designs:
    x_raw = np.array([[d['nw'], d['nf'], d['s0'], d['m'], d['E'], d['il'], d['cr']]])
    x_feat = make_features(x_raw)[0]

    boot_preds = bootstrap_predict(X_feat, log_y, x_feat, 500)
    point_est = np.median(boot_preds)
    ci_lower = np.percentile(boot_preds, 2.5)
    ci_upper = np.percentile(boot_preds, 97.5)

    certified_load = ci_lower / SAFETY_FACTOR
    meets_target = certified_load >= d['target_load']

    cert_results.append({
        **d, 'point_est': point_est, 'ci_lower': ci_lower, 'ci_upper': ci_upper,
        'certified': certified_load, 'meets_target': meets_target,
        'boot_preds': boot_preds,
    })

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Bootstrap distributions
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
for i, (r, color) in enumerate(zip(cert_results, colors)):
    ax = axes[i // 2, i % 2]
    ax.hist(r['boot_preds'], bins=30, color=color, edgecolor='#111827', alpha=0.7)
    ax.axvline(r['point_est'], color='white', linewidth=2, label=f"Median: {r['point_est']:.0f}N")
    ax.axvline(r['ci_lower'], color=color, linestyle=':', linewidth=1.5)
    ax.axvline(r['certified'], color='#ef4444', linewidth=2, linestyle='--',
               label=f"Certified: {r['certified']:.0f}N")
    ax.axvline(r['target_load'], color='#f59e0b', linewidth=1.5, linestyle='-.',
               label=f"Target: {r['target_load']}N")
    status = 'PASS' if r['meets_target'] else 'FAIL'
    ax.set_title(f"{r['name']} [{status}]", color='white', fontsize=9)
    ax.set_xlabel('Predicted strength (N)', color='white', fontsize=8)
    ax.legend(fontsize=6)

plt.tight_layout()
plt.show()

print(f"STAGE 5 COMPLETE: Certification (Safety Factor = {SAFETY_FACTOR})")
print("=" * 75)
print(f"{'Design':<30} {'Est':>6} {'95% CI':>14} {'Cert':>6} {'Target':>7} {'Status':>7}")
print("-" * 75)
for r in cert_results:
    status = 'PASS' if r['meets_target'] else 'FAIL'
    print(f"  {r['name']:<28} {r['point_est']:>5.0f}N [{r['ci_lower']:>4.0f},{r['ci_upper']:>4.0f}] "
          f"{r['certified']:>5.0f}N {r['target_load']:>6}N  {status}")`,
      challenge: 'Find the minimum fiber count (keeping all other parameters fixed) that allows the fruit basket to pass certification for 50N. Use binary search over fiber counts.',
      successHint: 'Stage 5 is complete — designs are certified with bootstrap confidence intervals and safety factors.',
    },
    {
      title: 'Stage 6: Complete design report and optimization dashboard',
      concept: `The final stage produces a comprehensive Weave Strength Predictor report: the complete deliverable for a basket designer or quality certification agency. It integrates all pipeline stages into a single document with fiber characterization, weave analysis, predicted strength, confidence intervals, certification status, and optimization recommendations.

This report would serve multiple stakeholders: the basket weaver gets design recommendations. The buyer gets a certified load capacity. The materials scientist gets detailed fiber and weave analytics. The quality inspector gets pass/fail status with underlying evidence.`,
      analogy: 'The final report is like a nutrition label on food packaging. Behind that simple label lies extensive testing: ingredient analysis (fiber characterization), preparation assessment (weave analysis), calorie measurement (strength testing), and regulatory compliance (certification). The label compresses all that science into actionable information for the consumer.',
      storyConnection: 'The basket weaver stories will now have a companion: not just the narrative of craft and tradition, but a scientific certificate that validates and quantifies what the weaver knows intuitively. Science and tradition complement each other — the weaver craft is validated, not replaced, by the predictor.',
      checkQuestion: 'Why include optimization recommendations in a report that already provides a pass/fail certification?',
      checkAnswer: 'Certification tells you whether the current design meets requirements. Optimization tells you how to improve it. A basket that barely passes might be made stronger or cheaper with a different fiber-weave combination. A basket that fails might be just one parameter away from passing. Recommendations convert a static assessment into an actionable improvement plan.',
      codeIntro: 'Generate the complete Weave Strength Predictor report with all stages, visualizations, and recommendations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# CAPSTONE COMPLETE: Full Report Generation
# ============================================================

report_data = {
    'design_name': 'Traditional Assam Rice Basket',
    'fiber': {'name': 'Bamboo (Bambusa balcooa)', 'sigma0': 125.3, 'm': 3.42,
              'E': 17.8, 'grade': 'B (moderate variation)', 'n_tests': 50},
    'weave': {'pattern': 'Modified plain weave', 'crimp': 0.62, 'interlock': 0.74,
              'max_float': 2, 'structural_score': 78},
    'geometry': {'n_warp': 42, 'n_weft': 42, 'diameter': 35, 'depth': 20},
    'prediction': {'point': 185, 'ci_lower': 142, 'ci_upper': 238,
                   'certified_load': 71, 'safety_factor': 2.0},
    'target': 50,
}

fig = plt.figure(figsize=(16, 20))
fig.patch.set_facecolor('#1f2937')

# Title
ax_t = fig.add_subplot(5, 2, (1, 2))
ax_t.set_facecolor('#0d1117')
ax_t.axis('off')
title = f"""WEAVE STRENGTH PREDICTOR — CERTIFICATION REPORT
{'='*55}
Design:    {report_data['design_name']}
Fiber:     {report_data['fiber']['name']}
Weave:     {report_data['weave']['pattern']}
Date:      2024 Certification

PREDICTED STRENGTH:  {report_data['prediction']['point']} N ({report_data['prediction']['point']/9.81:.1f} kg)
95% CI:              [{report_data['prediction']['ci_lower']}, {report_data['prediction']['ci_upper']}] N
CERTIFIED LOAD:      {report_data['prediction']['certified_load']} N ({report_data['prediction']['certified_load']/9.81:.1f} kg)
TARGET:              {report_data['target']} N — {'PASS' if report_data['prediction']['certified_load'] >= report_data['target'] else 'FAIL'}"""

ax_t.text(0.5, 0.5, title, transform=ax_t.transAxes, fontsize=9.5, fontfamily='monospace',
    color='#22c55e', va='center', ha='center',
    bbox=dict(boxstyle='round,pad=0.8', facecolor='#0d1117', edgecolor='#22c55e'))

# Fiber Weibull distribution
ax_f = fig.add_subplot(5, 2, 3)
ax_f.set_facecolor('#111827')
ax_f.tick_params(colors='gray')
x = np.linspace(0, 250, 200)
s0, m = report_data['fiber']['sigma0'], report_data['fiber']['m']
pdf = (m/s0) * (x/s0)**(m-1) * np.exp(-(x/s0)**m)
ax_f.fill_between(x, pdf, alpha=0.3, color='#22c55e')
ax_f.plot(x, pdf, color='#22c55e', linewidth=2)
s95 = s0 * (-np.log(0.95))**(1/m)
ax_f.axvline(s95, color='#ef4444', linestyle='--', label=f'95% reliable: {s95:.0f} MPa')
ax_f.axvline(s0, color='white', linestyle=':', label=f'Characteristic: {s0:.0f} MPa')
ax_f.set_xlabel('Strength (MPa)', color='white')
ax_f.set_title(f"Fiber: {report_data['fiber']['name']} (Grade {report_data['fiber']['grade']})", color='white', fontsize=10)
ax_f.legend(fontsize=7)

# Weave pattern (simulated)
ax_w = fig.add_subplot(5, 2, 4)
ax_w.set_facecolor('#111827')
n = 20
W = np.zeros((n, n))
for i in range(n):
    for j in range(n):
        W[i,j] = (i+j) % 2
ax_w.imshow(W, cmap='YlGn', aspect='equal', interpolation='nearest')
ax_w.set_title(f"Weave: {report_data['weave']['pattern']} (score: {report_data['weave']['structural_score']}/100)",
    color='white', fontsize=10)

# Bootstrap distribution
ax_b = fig.add_subplot(5, 2, (5, 6))
ax_b.set_facecolor('#111827')
ax_b.tick_params(colors='gray')
boot_samples = np.random.normal(185, (238-142)/3.92, 1000)
ax_b.hist(boot_samples, bins=40, color='#3b82f6', edgecolor='#111827', alpha=0.7)
ax_b.axvline(185, color='white', linewidth=2, label='Point estimate')
ax_b.axvline(142, color='#f59e0b', linestyle='--', linewidth=1.5, label='95% CI bounds')
ax_b.axvline(238, color='#f59e0b', linestyle='--', linewidth=1.5)
ax_b.axvline(71, color='#ef4444', linewidth=2, linestyle='-.', label=f'Certified: {71}N')
ax_b.axvline(50, color='#22c55e', linewidth=2, label=f'Target: {50}N')
ax_b.set_xlabel('Predicted strength (N)', color='white')
ax_b.set_title('Strength prediction distribution', color='white', fontsize=11)
ax_b.legend(fontsize=8)

# Safety margin visualization
ax_s = fig.add_subplot(5, 2, 7)
ax_s.set_facecolor('#111827')
ax_s.tick_params(colors='gray')
categories = ['Target', 'Certified', '95% CI lower', 'Point estimate', '95% CI upper']
values = [50, 71, 142, 185, 238]
bar_colors = ['#22c55e', '#ef4444', '#f59e0b', 'white', '#f59e0b']
ax_s.barh(categories, values, color=bar_colors, alpha=0.7)
ax_s.set_xlabel('Load (N)', color='white')
ax_s.set_title('Safety margin breakdown', color='white', fontsize=10)
for label in ax_s.get_yticklabels():
    label.set_color('white'); label.set_fontsize(8)

# Design optimization
ax_o = fig.add_subplot(5, 2, 8)
ax_o.set_facecolor('#111827')
ax_o.tick_params(colors='gray')
# Show how certified load changes with fiber count
fiber_counts = np.arange(20, 80, 5)
cert_loads = 71 * (fiber_counts / 42) ** 0.8  # approximate scaling
ax_o.plot(fiber_counts, cert_loads, 'o-', color='#22c55e', linewidth=2)
ax_o.axhline(50, color='#f59e0b', linestyle='--', label='Target (50N)')
ax_o.axvline(42, color='white', linestyle=':', label='Current (42 fibers)')
min_fibers = fiber_counts[np.searchsorted(cert_loads, 50)]
ax_o.axvline(min_fibers, color='#ef4444', linestyle=':', label=f'Min for target: ~{min_fibers}')
ax_o.set_xlabel('Total fiber count', color='white')
ax_o.set_ylabel('Certified load (N)', color='white')
ax_o.set_title('Optimization: fiber count vs certified load', color='white', fontsize=10)
ax_o.legend(fontsize=7)

# Recommendations
ax_r = fig.add_subplot(5, 2, (9, 10))
ax_r.set_facecolor('#0d1117')
ax_r.axis('off')
rec_text = """RECOMMENDATIONS & LIMITATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Design Assessment:
  PASS — Certified load (71N) exceeds target (50N) by 42%
  Safety margin is adequate for intended use (rice transport)

Optimization Suggestions:
  1. Reduce fiber count from 84 to 60 (-29%) while maintaining certification
     -> Saves material cost without compromising safety
  2. Switch to Grade A fiber batch (m > 5) to narrow confidence interval
     -> Certified load increases to ~85N from same fiber count
  3. Increase interlocking to 0.85 by tightening weave tension
     -> Improves load distribution, reduces progressive failure risk

Limitations:
  • Model trained on simulated data (not physical destructive tests)
  • Assumes uniform weave tension (real weaving has tension variation)
  • Does not account for moisture degradation or UV aging
  • Safety factor of 2.0 is conservative; may be reduced with physical testing

Reproducibility:
  • Model: Ridge regression, lambda=0.5, 10 features
  • Bootstrap: 500 resamples, 95% percentile CI
  • Pipeline version: Weave Strength Predictor v1.0"""

ax_r.text(0.05, 0.95, rec_text, transform=ax_r.transAxes, fontsize=8.5,
    fontfamily='monospace', color='#fbbf24', va='top',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#fbbf24', alpha=0.8))

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built a Weave Strength Predictor from scratch:")
print("  1. Fiber characterization with Weibull parameter fitting")
print("  2. Weave pattern analysis with structural scoring")
print("  3. Physics-based progressive failure simulation")
print("  4. Ridge regression with cross-validation")
print("  5. Bootstrap confidence intervals with safety factor certification")
print("  6. Comprehensive design report with optimization recommendations")
print()
print("Skills demonstrated: materials science, statistical distributions,")
print("structural analysis, regression, uncertainty quantification,")
print("engineering certification, technical communication.")`,
      challenge: 'Build a design explorer: sweep fiber UTS from 30-140 MPa and weave interlocking from 0.2-0.9, computing certified load for each combination. Plot the contour map and identify the minimum-cost (UTS x fiber count) design that meets a 100N target.',
      successHint: 'You have completed a full capstone project: from raw fiber properties to certified basket load capacity. This is the shape of real materials engineering — combining materials science, structural analysis, statistics, and engineering judgment into a certified product. The Weave Strength Predictor is portfolio-ready.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (materials science and weave mechanics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Weave Strength Predictor. Click to start.</p>
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
