import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FishJumpLevel4() {
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
      title: 'Capstone — Build a Fish Activity Predictor from environmental data',
      concept: `In this capstone you will build a predictive model that forecasts fish jumping frequency from three environmental variables: water temperature, dissolved oxygen concentration, and barometric pressure. This is a real-world application of multiple regression — the same approach used by fisheries scientists, aquaculture managers, and ecological modelers.

Your model will use synthetic data generated from known biological relationships. Water temperature affects fish metabolism (Q10 rule: metabolic rate roughly doubles per 10°C increase). Dissolved oxygen determines whether fish are in respiratory distress (Michaelis-Menten kinetics, with stress jumping below Pcrit). Barometric pressure affects swim bladder buoyancy (Boyle's Law) and is correlated with weather fronts that change water conditions.

You will fit a multiple linear regression: Jump_freq = β₀ + β₁×Temp + β₂×DO + β₃×Pressure + ε, then evaluate it using R², residual analysis, and prediction intervals. The real insight comes from the interaction terms and non-linear effects: the DO effect is strongest at low DO (below Pcrit), and the temperature effect saturates at high temperatures (thermal stress). Your final model will generate 24-hour jump forecasts from weather data and identify the conditions under which jumping is most likely — answering the story's question "Why do fish jump?" with a quantitative prediction.`,
      analogy: 'Building a fish activity predictor is like building a weather forecast model, but for fish behavior. Just as meteorologists combine temperature, pressure, and humidity to predict rain, you will combine water temperature, dissolved oxygen, and barometric pressure to predict jumping. The model learns the statistical relationships from data and then extrapolates to new conditions — turning observation into prediction.',
      storyConnection: 'The story asks a simple question: why do fish jump? Your capstone answers it with a quantitative model. Fish jump most when DO is low (predawn), temperature is moderate (metabolically active but not heat-stressed), and barometric pressure is falling (approaching storm front changes water chemistry). The model turns the story\'s wonder into a testable, predictive framework.',
      checkQuestion: 'Your model predicts Jump_freq = 12.5 - 0.3×Temp + 8.2×(1/DO) - 0.01×Pressure. At Temp=25°C, DO=3.0 mg/L, Pressure=1010 hPa, what is the predicted jump frequency? Which variable has the strongest effect?',
      checkAnswer: 'Jump_freq = 12.5 - 0.3×25 + 8.2×(1/3.0) - 0.01×1010 = 12.5 - 7.5 + 2.73 - 10.1 = -2.37. A negative value is nonsensical, which reveals that the linear model is inappropriate for this system — the 1/DO term creates a non-linearity, and the pressure term dominates unreasonably. This is why model validation matters. The DO term (8.2/DO) has the strongest relative effect at low DO values, confirming that oxygen stress is the primary driver of jumping.',
      codeIntro: 'Build the complete fish activity prediction model — data generation, multiple regression, residual analysis, and 24-hour forecast visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate synthetic training data ---
n_obs = 500

# Environmental variables
temperature = np.random.uniform(15, 32, n_obs)    # °C
DO = np.random.uniform(1.5, 10.0, n_obs)          # mg/L
pressure = np.random.uniform(995, 1025, n_obs)    # hPa

# True relationship (non-linear with interactions)
def true_jump_rate(temp, do, pres):
    """Biological model of fish jumping frequency."""
    # Metabolic component (Q10 rule, peaks ~25°C, declines at extremes)
    metabolic = np.exp(-0.02 * (temp - 25)**2)
    # Oxygen stress (sigmoid below Pcrit=4 mg/L)
    o2_stress = 15 / (1 + np.exp(2 * (do - 3.5)))
    # Pressure effect (falling pressure increases activity)
    pres_effect = 2 * (1015 - pres) / 20
    # Base rate + components + noise
    rate = 3 * metabolic + o2_stress + np.clip(pres_effect, -2, 5)
    return np.maximum(rate, 0)

jumps_true = true_jump_rate(temperature, DO, pressure)
jumps_observed = jumps_true + np.random.normal(0, 1.5, n_obs)
jumps_observed = np.maximum(jumps_observed, 0)

# --- Fit multiple linear regression (using normal equations) ---
# Design matrix: [1, temp, 1/DO, pressure, temp*DO_inv]
DO_inv = 1.0 / DO
X = np.column_stack([np.ones(n_obs), temperature, DO_inv, pressure, temperature * DO_inv])
feature_names = ['Intercept', 'Temperature', '1/DO', 'Pressure', 'Temp × 1/DO']

# Normal equation: beta = (X^T X)^{-1} X^T y
XtX_inv = np.linalg.inv(X.T @ X)
beta = XtX_inv @ X.T @ jumps_observed

# Predictions and residuals
y_pred = X @ beta
residuals = jumps_observed - y_pred
SS_res = np.sum(residuals**2)
SS_tot = np.sum((jumps_observed - jumps_observed.mean())**2)
R2 = 1 - SS_res / SS_tot
RMSE = np.sqrt(SS_res / n_obs)

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Predicted vs Observed
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(jumps_observed, y_pred, c=DO, cmap='RdYlBu', s=15, alpha=0.6, edgecolors='none')
ax.plot([0, 20], [0, 20], '--', color='#ef4444', linewidth=2, label='Perfect prediction')
ax.set_xlabel('Observed jump frequency', color='white')
ax.set_ylabel('Predicted jump frequency', color='white')
ax.set_title(f'Model Performance (R² = {R2:.3f}, RMSE = {RMSE:.2f})', color='white',
             fontsize=12, fontweight='bold')
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
sm = plt.cm.ScalarMappable(cmap='RdYlBu', norm=plt.Normalize(1.5, 10))
plt.colorbar(sm, ax=ax, label='DO (mg/L)')
ax.tick_params(colors='gray')

# Plot 2: Partial dependence plots
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
# Temperature effect (holding DO=mean, pressure=mean)
temp_range = np.linspace(15, 32, 100)
do_mean = DO.mean()
pres_mean = pressure.mean()
jump_vs_temp = true_jump_rate(temp_range, do_mean, pres_mean)
ax2.plot(temp_range, jump_vs_temp, color='#ef4444', linewidth=2.5, label=f'Temp effect (DO={do_mean:.1f})')

# DO effect (holding temp=25, pressure=mean)
do_range = np.linspace(1.5, 10, 100)
jump_vs_do = true_jump_rate(25, do_range, pres_mean)
ax2_twin = ax2.twinx()
ax2_twin.plot(do_range, jump_vs_do, color='#3b82f6', linewidth=2.5, linestyle='--',
              label=f'DO effect (T=25°C)')
ax2.set_xlabel('Temperature (°C) / DO (mg/L)', color='white')
ax2.set_ylabel('Jump freq (temp)', color='#ef4444')
ax2_twin.set_ylabel('Jump freq (DO)', color='#3b82f6')
ax2.set_title('Partial Dependence (univariate effects)', color='white', fontsize=11)
lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1+lines2, labels1+labels2, fontsize=8, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray'); ax2_twin.tick_params(colors='gray')

# Plot 3: 24-hour forecast
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
hours_24 = np.linspace(0, 24, 200)
# Simulate realistic 24-hour environmental data
temp_24 = 22 + 5 * np.sin(2 * np.pi * (hours_24 - 14) / 24)  # peak at 2pm
DO_24 = 7.5 - 3.0 * np.sin(2 * np.pi * (hours_24 - 4) / 24)  # min at 4am
DO_24 = np.clip(DO_24, 2.0, 10.0)
pres_24 = 1012 - 3 * np.sin(2 * np.pi * hours_24 / 24)  # slight diurnal

jump_forecast = true_jump_rate(temp_24, DO_24, pres_24)
# Add prediction uncertainty
jump_upper = jump_forecast + 1.96 * RMSE
jump_lower = np.maximum(jump_forecast - 1.96 * RMSE, 0)

ax3.plot(hours_24, jump_forecast, color='#f59e0b', linewidth=2.5, label='Predicted jumps/hr')
ax3.fill_between(hours_24, jump_lower, jump_upper, color='#f59e0b', alpha=0.15,
                  label='95% prediction interval')
# Overlay environmental drivers
ax3_t = ax3.twinx()
ax3_t.plot(hours_24, DO_24, color='#3b82f6', linewidth=1.5, linestyle=':', alpha=0.6, label='DO')
ax3_t.plot(hours_24, temp_24, color='#ef4444', linewidth=1.5, linestyle=':', alpha=0.6, label='Temp')

# Mark peak jumping
peak_idx = np.argmax(jump_forecast)
ax3.axvline(hours_24[peak_idx], color='#fbbf24', linewidth=1.5, linestyle='--')
ax3.text(hours_24[peak_idx]+0.5, jump_forecast[peak_idx],
         f'Peak: {hours_24[peak_idx]:.0f}:00\\n{jump_forecast[peak_idx]:.1f} jumps/hr',
         color='#fbbf24', fontsize=9, fontweight='bold')

ax3.set_xlabel('Hour of day', color='white')
ax3.set_ylabel('Predicted jump frequency', color='#f59e0b')
ax3_t.set_ylabel('Temp (°C) / DO (mg/L)', color='gray')
ax3.set_title('24-Hour Fish Activity Forecast', color='white', fontsize=12, fontweight='bold')
lines1, labels1 = ax3.get_legend_handles_labels()
lines2, labels2 = ax3_t.get_legend_handles_labels()
ax3.legend(lines1+lines2, labels1+labels2, fontsize=7, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray'); ax3_t.tick_params(colors='gray')

# Plot 4: Feature importance (coefficient magnitudes)
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Standardized coefficients for fair comparison
X_std = (X[:, 1:] - X[:, 1:].mean(axis=0)) / X[:, 1:].std(axis=0)
X_std_full = np.column_stack([np.ones(n_obs), X_std])
beta_std = np.linalg.inv(X_std_full.T @ X_std_full) @ X_std_full.T @ jumps_observed

importance = np.abs(beta_std[1:])  # skip intercept
colors_imp = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7']
bars = ax4.barh(feature_names[1:], importance, color=colors_imp, alpha=0.8,
               edgecolor='white', linewidth=0.5)
for bar, val, b in zip(bars, importance, beta_std[1:]):
    sign = '+' if b > 0 else '-'
    ax4.text(val + 0.02, bar.get_y() + bar.get_height()/2,
            f'{sign}{val:.2f}', va='center', color='white', fontsize=10)
ax4.set_xlabel('|Standardized coefficient|', color='white')
ax4.set_title('Feature Importance (standardized)', color='white', fontsize=11)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Print model report
print("=" * 65)
print("    FISH ACTIVITY PREDICTION MODEL — REPORT")
print("=" * 65)
print(f"\\nTraining data: {n_obs} observations")
print(f"Model: Jump_freq = β₀ + β₁·Temp + β₂·(1/DO) + β₃·Pres + β₄·Temp/DO")
print()
print("Regression Coefficients:")
for name, b in zip(feature_names, beta):
    print(f"  {name:<15} β = {b:>8.4f}")
print(f"\\nModel fit:")
print(f"  R² = {R2:.4f}")
print(f"  RMSE = {RMSE:.2f} jumps/hr")
print(f"  Adjusted R² = {1 - (1-R2)*(n_obs-1)/(n_obs-len(beta)-1):.4f}")

print(f"\\n24-Hour Forecast Summary:")
print(f"  Peak jumping: {hours_24[peak_idx]:.0f}:00 ({jump_forecast[peak_idx]:.1f} jumps/hr)")
print(f"  Minimum jumping: {hours_24[np.argmin(jump_forecast)]:.0f}:00 ({jump_forecast.min():.1f} jumps/hr)")
print(f"  At peak: Temp={temp_24[peak_idx]:.1f}°C, DO={DO_24[peak_idx]:.1f} mg/L")
print()
print("Key finding: Fish jump most when DO is low (predawn, ~4-6 AM)")
print("and temperature is moderate (metabolically active but not stressed).")
print("This model answers 'Why do fish jump?' with a quantitative prediction.")`,
      challenge: 'Replace the linear regression with a decision tree or random forest approach (implement a simple decision tree from scratch in numpy). Compare its R² against the linear model. Does the non-linear model capture the true relationship better? Add cross-validation to avoid overfitting.',
      successHint: 'You have built a predictive ecological model from first principles — defining the biology, generating data, fitting a statistical model, and producing actionable forecasts. This workflow is used throughout ecology, from fisheries management to wildlife conservation to climate impact assessment.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Fish Activity Predictor from water temperature, dissolved O₂, and barometric pressure</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a predictive regression model. Click to start.</p>
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
