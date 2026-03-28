import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BambooGrowthLevel4() {
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
      title: 'Capstone overview — Plant Growth Simulator',
      concept: `In this capstone you will build a **complete plant growth simulator** that models bamboo growth as a function of four environmental variables: **light**, **water**, **temperature**, and **nutrients**. By the end, you will have a tool that predicts daily growth rates under any combination of conditions.

Real plant growth is a multiplicative process: each environmental factor acts as a limiting constraint. The concept comes from **Liebig's Law of the Minimum** — growth is controlled not by the total amount of resources, but by the **scarcest resource**. A bamboo plant with perfect light, water, and nutrients but insufficient nitrogen will grow at the rate permitted by nitrogen alone.

Your simulator will combine:
1. **Environmental response curves** — how growth responds to each factor individually
2. **Multiplicative interaction model** — combining all factors into a single growth prediction
3. **Temporal dynamics** — day/night cycles, seasonal changes, and developmental stages
4. **Stochastic variation** — random noise that makes the simulation realistic

This is the same approach used in crop models like DSSAT and APSIM that agricultural scientists use worldwide to predict yields and optimize farming practices.`,
      analogy: 'Building a growth simulator is like building a flight simulator. A real airplane responds to hundreds of variables — airspeed, altitude, wind, temperature, weight. A simulator models each response individually, then combines them. The result is not a perfect copy of reality, but a useful tool for understanding "what if" scenarios without needing a real airplane.',
      storyConnection: 'Bamboo farmers in Assam\'s Kamrup district make planting decisions based on experience: "plant near the river for moisture, on south-facing slopes for sun, add cow dung for nutrients." Your simulator formalizes this folk knowledge into equations, letting you quantify exactly how much each factor contributes to growth.',
      checkQuestion: 'If light is at 80% of optimal, water at 60%, temperature at 90%, and nutrients at 70%, what would Liebig\'s Law predict for growth rate versus a multiplicative model?',
      checkAnswer: 'Liebig\'s Law: growth is limited by the minimum factor = 60% (water). So predicted growth = 60% of maximum. Multiplicative model: 0.8 x 0.6 x 0.9 x 0.7 = 0.302, or 30.2% of maximum. The multiplicative model is more conservative — it says ALL factors constrain growth simultaneously. Reality is usually between the two. We will implement both and compare.',
      codeIntro: 'Set up the environmental response functions that form the foundation of the simulator.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Environmental response curves for bamboo growth
# Each returns a value between 0 and 1 (fraction of maximum growth)

def light_response(par):
    """Response to Photosynthetically Active Radiation (umol/m2/s).
    Bamboo saturates around 800 PAR, minimal growth below 100."""
    return 1 - np.exp(-par / 400)  # saturating exponential

def water_response(soil_moisture):
    """Response to soil moisture (fraction, 0-1).
    Optimal at 0.6-0.8, stress below 0.3, waterlogged above 0.95."""
    result = np.where(soil_moisture < 0.15, 0,
             np.where(soil_moisture < 0.6, (soil_moisture - 0.15) / 0.45,
             np.where(soil_moisture < 0.85, 1.0,
             np.where(soil_moisture < 0.98, 1.0 - (soil_moisture - 0.85) / 0.13 * 0.3,
             0.5))))
    return result

def temp_response(temp_c):
    """Response to temperature (Celsius).
    Optimal at 25-30C, zero below 10 and above 45."""
    # Beta function shape
    t_min, t_opt_low, t_opt_high, t_max = 10, 25, 30, 45
    result = np.zeros_like(temp_c, dtype=float)
    # Rising phase
    mask1 = (temp_c >= t_min) & (temp_c < t_opt_low)
    result[mask1] = ((temp_c[mask1] - t_min) / (t_opt_low - t_min)) ** 1.5
    # Optimal phase
    mask2 = (temp_c >= t_opt_low) & (temp_c <= t_opt_high)
    result[mask2] = 1.0
    # Declining phase
    mask3 = (temp_c > t_opt_high) & (temp_c <= t_max)
    result[mask3] = ((t_max - temp_c[mask3]) / (t_max - t_opt_high)) ** 1.5
    return result

def nutrient_response(n_avail):
    """Response to available nitrogen (mg/kg soil).
    Michaelis-Menten kinetics: saturates around 100 mg/kg."""
    Km = 30  # half-saturation constant
    return n_avail / (n_avail + Km)

# Visualize all response curves
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Environmental Response Curves for Bamboo Growth', color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Light
par = np.linspace(0, 1500, 300)
axes[0, 0].plot(par, light_response(par), color='#f59e0b', linewidth=2.5)
axes[0, 0].axhline(0.9, color='gray', linestyle='--', alpha=0.3)
axes[0, 0].set_xlabel('PAR (umol/m2/s)', color='white')
axes[0, 0].set_ylabel('Growth fraction', color='white')
axes[0, 0].set_title('Light response', color='white')
axes[0, 0].fill_between(par, light_response(par), alpha=0.15, color='#f59e0b')

# Water
sm = np.linspace(0, 1, 300)
axes[0, 1].plot(sm, water_response(sm), color='#3b82f6', linewidth=2.5)
axes[0, 1].set_xlabel('Soil moisture (fraction)', color='white')
axes[0, 1].set_ylabel('Growth fraction', color='white')
axes[0, 1].set_title('Water response', color='white')
axes[0, 1].fill_between(sm, water_response(sm), alpha=0.15, color='#3b82f6')

# Temperature
tc = np.linspace(5, 50, 300)
axes[1, 0].plot(tc, temp_response(tc), color='#ef4444', linewidth=2.5)
axes[1, 0].axvspan(25, 30, alpha=0.15, color='#22c55e', label='Optimal zone')
axes[1, 0].set_xlabel('Temperature (C)', color='white')
axes[1, 0].set_ylabel('Growth fraction', color='white')
axes[1, 0].set_title('Temperature response', color='white')
axes[1, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Nutrients
na = np.linspace(0, 200, 300)
axes[1, 1].plot(na, nutrient_response(na), color='#22c55e', linewidth=2.5)
axes[1, 1].axvline(30, color='gray', linestyle='--', alpha=0.3, label='Km = 30')
axes[1, 1].set_xlabel('Available N (mg/kg)', color='white')
axes[1, 1].set_ylabel('Growth fraction', color='white')
axes[1, 1].set_title('Nutrient response (Michaelis-Menten)', color='white')
axes[1, 1].fill_between(na, nutrient_response(na), alpha=0.15, color='#22c55e')
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Test specific conditions
print("Response at typical monsoon conditions (Assam, July):")
print(f"  Light (PAR=600): {light_response(np.array([600]))[0]:.2f}")
print(f"  Water (moisture=0.75): {water_response(np.array([0.75]))[0]:.2f}")
print(f"  Temperature (28C): {temp_response(np.array([28]))[0]:.2f}")
print(f"  Nutrients (N=50): {nutrient_response(np.array([50]))[0]:.2f}")
combined = (light_response(np.array([600]))[0] *
            water_response(np.array([0.75]))[0] *
            temp_response(np.array([28]))[0] *
            nutrient_response(np.array([50]))[0])
print(f"  Combined (multiplicative): {combined:.2f}")
print(f"  At max growth rate of 91 cm/day: predicted = {combined * 91:.1f} cm/day")`,
      challenge: 'Modify the temperature response to model a frost event: if temperature drops below 5C, growth drops to zero AND there is a 3-day recovery period. How would you implement the "memory" of frost damage?',
      successHint: 'These response curves are empirical models fitted to experimental data. Each curve encodes years of plant physiology research into a simple function. The simulator\'s accuracy depends entirely on how well these curves match reality.',
    },
    {
      title: 'The growth engine — combining environmental factors',
      concept: `Now we combine the four response curves into a single **growth prediction engine**. There are three common approaches:

**1. Multiplicative model**: Growth = Gmax * f(light) * f(water) * f(temp) * f(nutrients). All factors constrain simultaneously. This is the most common approach in crop models.

**2. Liebig minimum model**: Growth = Gmax * min(f(light), f(water), f(temp), f(nutrients)). Only the most limiting factor matters. Simpler but often too optimistic.

**3. Weighted geometric mean**: Growth = Gmax * (f1^w1 * f2^w2 * f3^w3 * f4^w4) where weights sum to 1. A compromise between the other two.

We also need to account for the **developmental stage** of the bamboo culm. A newly emerged shoot grows differently from one at peak growth or one approaching lignification. We model this with a **phenological modifier** — a bell-shaped curve that peaks around day 30-40 of the culm\'s life.

The final equation: **Daily_Growth = Gmax * Env_Factor * Phenology * (1 + noise)**

Where Gmax is the maximum possible daily growth (species-specific), Env_Factor comes from the environmental model, Phenology comes from the developmental stage, and noise adds realistic day-to-day variation.`,
      analogy: 'The growth engine is like a car\'s performance. Top speed (Gmax) depends on the engine. But actual speed depends on road conditions (environment) and how hard you press the accelerator (phenological stage). Multiply them: a 200 km/h car on a wet road (0.7) at half throttle (0.5) goes 200 * 0.7 * 0.5 = 70 km/h.',
      storyConnection: 'During Assam\'s monsoon (June-September), all four factors align for bamboo: abundant light between rain showers, soil saturated with water, temperatures of 25-32C, and nutrients washed in by floods. This is why the monsoon is bamboo\'s explosive growth season. The model quantifies what farmers have always known.',
      checkQuestion: 'Why might the multiplicative model be more realistic than Liebig\'s minimum for bamboo, even though Liebig\'s Law is a foundational principle in ecology?',
      checkAnswer: 'Liebig\'s Law assumes factors are completely independent — only the worst matters. But in reality, factors interact. A plant with low water AND low nutrients grows worse than one with just low water, because water is needed to transport nutrients. The multiplicative model captures these synergistic effects. Liebig\'s Law works best for identifying the primary bottleneck; the multiplicative model works better for quantitative prediction.',
      codeIntro: 'Build the complete growth engine combining environmental factors, phenology, and stochastic variation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Redefine response functions
def light_response(par):
    return 1 - np.exp(-par / 400)

def water_response(sm):
    return np.where(sm < 0.15, 0,
           np.where(sm < 0.6, (sm - 0.15) / 0.45,
           np.where(sm < 0.85, 1.0,
           np.where(sm < 0.98, 1.0 - (sm - 0.85) / 0.13 * 0.3, 0.5))))

def temp_response(tc):
    result = np.zeros_like(tc, dtype=float)
    mask1 = (tc >= 10) & (tc < 25)
    result[mask1] = ((tc[mask1] - 10) / 15) ** 1.5
    mask2 = (tc >= 25) & (tc <= 30)
    result[mask2] = 1.0
    mask3 = (tc > 30) & (tc <= 45)
    result[mask3] = ((45 - tc[mask3]) / 15) ** 1.5
    return result

def nutrient_response(n):
    return n / (n + 30)

def phenology_modifier(day_of_culm, peak_day=35, spread=15):
    """Bell curve peaking at peak_day, width controlled by spread."""
    return np.exp(-0.5 * ((day_of_culm - peak_day) / spread) ** 2)

# Growth engine: three models
def predict_growth(gmax, par, sm, tc, n_avail, culm_day, model='multiplicative'):
    fl = light_response(np.array([par]))[0]
    fw = water_response(np.array([sm]))[0]
    ft = temp_response(np.array([tc]))[0]
    fn = nutrient_response(np.array([n_avail]))[0]
    ph = phenology_modifier(np.array([culm_day]))[0]

    if model == 'multiplicative':
        env = fl * fw * ft * fn
    elif model == 'liebig':
        env = min(fl, fw, ft, fn)
    elif model == 'geometric':
        env = (fl ** 0.3 * fw ** 0.3 * ft ** 0.25 * fn ** 0.15)
    else:
        env = fl * fw * ft * fn

    return gmax * env * ph, {'light': fl, 'water': fw, 'temp': ft, 'nutrients': fn, 'phenology': ph, 'env': env}

# Simulate 90 days of bamboo growth
np.random.seed(42)
days = 90
Gmax = 91  # cm/day for Moso bamboo

# Generate realistic weather for Assam monsoon
par_daily = 400 + 300 * np.sin(np.linspace(0, 3 * np.pi, days)) + np.random.randn(days) * 80
par_daily = np.clip(par_daily, 50, 1200)

moisture = 0.5 + 0.2 * np.sin(np.linspace(0, 4 * np.pi, days)) + np.random.randn(days) * 0.05
moisture = np.clip(moisture, 0.2, 0.95)

temp = 26 + 4 * np.sin(np.linspace(0, 2 * np.pi, days)) + np.random.randn(days) * 2
temp = np.clip(temp, 15, 40)

nitrogen = 60 - np.linspace(0, 25, days) + np.random.randn(days) * 5  # depletes over time
nitrogen = np.clip(nitrogen, 10, 100)

# Run all three models
models = ['multiplicative', 'liebig', 'geometric']
results = {m: {'growth': [], 'cumulative': []} for m in models}

for model in models:
    cum = 0
    for d in range(days):
        g, _ = predict_growth(Gmax, par_daily[d], moisture[d], temp[d], nitrogen[d], d, model)
        noise = 1 + np.random.randn() * 0.08
        g = max(0, g * noise)
        cum += g
        results[model]['growth'].append(g)
        results[model]['cumulative'].append(cum)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Plant Growth Simulator — 90-Day Run', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Row 1: Environmental inputs
axes[0, 0].plot(par_daily, color='#f59e0b', linewidth=1)
axes[0, 0].set_ylabel('PAR', color='white')
axes[0, 0].set_title('Light', color='white', fontsize=10)

axes[0, 1].plot(moisture, color='#3b82f6', linewidth=1)
axes[0, 1].plot(temp / 50, color='#ef4444', linewidth=1, alpha=0.7)
axes[0, 1].set_title('Water (blue) & Temp/50 (red)', color='white', fontsize=10)

axes[0, 2].plot(nitrogen, color='#22c55e', linewidth=1)
axes[0, 2].set_title('Soil nitrogen (depleting)', color='white', fontsize=10)

# Row 2: Model outputs
model_colors = {'multiplicative': '#22c55e', 'liebig': '#f59e0b', 'geometric': '#a855f7'}

for model in models:
    axes[1, 0].plot(results[model]['growth'], color=model_colors[model], linewidth=1.5, label=model, alpha=0.8)
axes[1, 0].set_xlabel('Day', color='white')
axes[1, 0].set_ylabel('Daily growth (cm)', color='white')
axes[1, 0].set_title('Daily growth rate', color='white', fontsize=10)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

for model in models:
    axes[1, 1].plot(results[model]['cumulative'], color=model_colors[model], linewidth=2, label=model)
axes[1, 1].set_xlabel('Day', color='white')
axes[1, 1].set_ylabel('Total height (cm)', color='white')
axes[1, 1].set_title('Cumulative height', color='white', fontsize=10)
axes[1, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Factor contributions for multiplicative model
d_test = 35  # peak growth day
_, factors = predict_growth(Gmax, par_daily[d_test], moisture[d_test], temp[d_test], nitrogen[d_test], d_test)
labels = list(factors.keys())[:-1]  # exclude 'env'
values = [factors[k] for k in labels]
bars = axes[1, 2].barh(labels, values, color=['#f59e0b', '#3b82f6', '#ef4444', '#22c55e', '#a855f7'])
axes[1, 2].set_xlabel('Response (0-1)', color='white')
axes[1, 2].set_title(f'Factor contributions (day {d_test})', color='white', fontsize=10)
axes[1, 2].set_xlim(0, 1.1)
for bar, v in zip(bars, values):
    axes[1, 2].text(v + 0.02, bar.get_y() + bar.get_height()/2, f'{v:.2f}', color='white', va='center', fontsize=9)

plt.tight_layout()
plt.show()

print("Simulation results (90 days):")
for model in models:
    h = results[model]['cumulative'][-1]
    peak = max(results[model]['growth'])
    print(f"  {model:<16}: final height = {h:.0f} cm ({h/100:.1f} m), peak = {peak:.1f} cm/day")
print(f"\\nLiebig model is most optimistic (only worst factor limits)")
print(f"Multiplicative is most conservative (all factors compound)")`,
      challenge: 'Add a drought event: set soil moisture to 0.1 for days 40-50. Compare how each model responds. Which model shows the most realistic recovery pattern?',
      successHint: 'You now have a working growth engine. The next steps will add temporal dynamics, calibration against real data, and interactive parameter exploration.',
    },
    {
      title: 'Seasonal weather generation',
      concept: `A growth simulator is only as good as its weather inputs. Rather than using fixed values, we need a **stochastic weather generator** that produces realistic daily weather patterns for a specific location and season.

For Assam\'s climate, the key patterns are:
- **Pre-monsoon (March-May)**: warming temperatures (20-35C), sporadic rain, moderate PAR
- **Monsoon (June-September)**: heavy rain, high humidity, warm temps (25-32C), reduced PAR due to clouds
- **Post-monsoon (October-November)**: decreasing rain, warm days, cool nights
- **Winter (December-February)**: dry, cool (10-20C), high PAR on clear days

Weather variables are **autocorrelated** — today\'s weather depends on yesterday\'s. We model this with **first-order autoregressive (AR1)** processes: X(t) = rho * X(t-1) + (1-rho) * mean + noise, where rho controls how "sticky" the weather is (high rho = weather persists for multiple days).

We also need to model **correlations between variables**: rainy days have lower PAR and temperature. We use a **correlation matrix** to generate multivariate weather.`,
      analogy: 'A weather generator is like a realistic video game world. You do not record every second of real weather and replay it — instead, you capture the statistical patterns (averages, variability, correlations, seasons) and generate new weather that "feels real" without being a copy of any actual year. Each simulation run produces a different but plausible weather sequence.',
      storyConnection: 'Assam\'s Brahmaputra Valley has one of the most dramatic seasonal transitions in the world — from dry winter to explosive monsoon. Bamboo farmers time their activities to this rhythm: harvesting mature culms in winter, protecting new shoots during monsoon floods. The weather generator must capture this seasonality to produce meaningful growth predictions.',
      checkQuestion: 'Why use autocorrelated weather generation instead of just drawing random values from monthly distributions?',
      checkAnswer: 'Independent random draws produce unrealistic day-to-day variation: 35C followed by 15C followed by 30C. Real weather has persistence — warm spells last several days, rain events are clustered. Autocorrelation captures this temporal structure. Plants respond not just to average conditions but to the pattern of conditions, making realistic temporal structure essential for accurate growth simulation.',
      codeIntro: 'Build a stochastic weather generator for Assam and visualize a full year of synthetic weather.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def generate_assam_weather(n_days=365, start_month=1):
    """Generate realistic daily weather for Assam, India."""
    # Monthly climate normals for Guwahati
    # [temp_mean, temp_std, moisture_mean, moisture_std, par_mean, par_std, n_depletion]
    monthly = {
        1:  [16, 3, 0.30, 0.08, 700, 100, 0],    # January - dry, cool
        2:  [19, 3, 0.28, 0.08, 750, 100, 0],
        3:  [23, 4, 0.32, 0.10, 800, 120, 0],    # Pre-monsoon warming
        4:  [26, 4, 0.40, 0.12, 700, 150, 0],
        5:  [28, 3, 0.50, 0.15, 600, 180, 0],    # Pre-monsoon rain starts
        6:  [29, 2, 0.75, 0.10, 400, 150, 0],    # Monsoon onset
        7:  [29, 2, 0.85, 0.08, 350, 130, 0],    # Peak monsoon
        8:  [29, 2, 0.82, 0.08, 380, 140, 0],
        9:  [28, 2, 0.72, 0.10, 450, 150, 0],    # Monsoon retreat
        10: [26, 3, 0.55, 0.12, 600, 130, 0],
        11: [22, 3, 0.38, 0.10, 680, 110, 0],
        12: [17, 3, 0.30, 0.08, 700, 100, 0],
    }

    temp = np.zeros(n_days)
    moisture = np.zeros(n_days)
    par = np.zeros(n_days)

    # AR1 autocorrelation coefficients
    rho_temp = 0.85      # temperature persists strongly
    rho_moisture = 0.75  # moisture moderately sticky
    rho_par = 0.60       # PAR less persistent (clouds come and go)

    # Initialize
    m = ((start_month - 1) % 12) + 1
    temp[0] = monthly[m][0]
    moisture[0] = monthly[m][2]
    par[0] = monthly[m][4]

    for d in range(1, n_days):
        # Current month
        m = (((start_month - 1) + d // 30) % 12) + 1
        tm, ts = monthly[m][0], monthly[m][1]
        mm, ms = monthly[m][2], monthly[m][3]
        pm, ps = monthly[m][4], monthly[m][5]

        # AR1 process with seasonal mean
        temp[d] = rho_temp * temp[d-1] + (1 - rho_temp) * tm + np.random.randn() * ts * (1 - rho_temp**2)**0.5
        moisture[d] = rho_moisture * moisture[d-1] + (1 - rho_moisture) * mm + np.random.randn() * ms * (1 - rho_moisture**2)**0.5
        par[d] = rho_par * par[d-1] + (1 - rho_par) * pm + np.random.randn() * ps * (1 - rho_par**2)**0.5

        # Cross-correlations: rain reduces PAR and moderates temperature
        if moisture[d] > 0.7:
            par[d] -= (moisture[d] - 0.7) * 300  # clouds
            temp[d] -= (moisture[d] - 0.7) * 3   # cooling

        # Clamp to physical bounds
        temp[d] = np.clip(temp[d], 5, 42)
        moisture[d] = np.clip(moisture[d], 0.05, 0.98)
        par[d] = np.clip(par[d], 50, 1200)

    # Nitrogen: starts at 80, depleted by growth, replenished by decomposition/rain
    nitrogen = 60 + 20 * np.sin(np.linspace(0, 2 * np.pi, n_days)) + np.random.randn(n_days) * 5
    nitrogen = np.clip(nitrogen, 10, 120)

    return temp, moisture, par, nitrogen

# Generate a full year
temp, moisture, par, nitrogen = generate_assam_weather(365)
days = np.arange(365)
months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

fig, axes = plt.subplots(4, 1, figsize=(14, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Synthetic Weather for Assam (1 year)', color='white', fontsize=14, fontweight='bold')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    # Month boundaries
    for m in range(12):
        ax.axvline(m * 30.4, color='gray', alpha=0.15, linewidth=0.5)

# Temperature
axes[0].plot(days, temp, color='#ef4444', linewidth=0.8)
axes[0].fill_between(days, temp, alpha=0.2, color='#ef4444')
axes[0].set_ylabel('Temp (C)', color='white')
axes[0].axhspan(25, 30, alpha=0.1, color='#22c55e')
axes[0].set_title('Temperature', color='white', fontsize=10)

# Moisture
axes[1].plot(days, moisture, color='#3b82f6', linewidth=0.8)
axes[1].fill_between(days, moisture, alpha=0.2, color='#3b82f6')
axes[1].set_ylabel('Soil moisture', color='white')
axes[1].set_title('Soil moisture', color='white', fontsize=10)

# PAR
axes[2].plot(days, par, color='#f59e0b', linewidth=0.8)
axes[2].fill_between(days, par, alpha=0.2, color='#f59e0b')
axes[2].set_ylabel('PAR', color='white')
axes[2].set_title('Photosynthetically Active Radiation', color='white', fontsize=10)

# Nitrogen
axes[3].plot(days, nitrogen, color='#22c55e', linewidth=0.8)
axes[3].fill_between(days, nitrogen, alpha=0.2, color='#22c55e')
axes[3].set_ylabel('N (mg/kg)', color='white')
axes[3].set_xlabel('Day of year', color='white')
axes[3].set_title('Soil nitrogen', color='white', fontsize=10)

# Add month labels
ax2 = axes[3].twiny()
ax2.set_xlim(axes[3].get_xlim())
ax2.set_xticks([m * 30.4 + 15 for m in range(12)])
ax2.set_xticklabels(months, color='white', fontsize=9)
ax2.tick_params(colors='gray', length=0)

plt.tight_layout()
plt.show()

print("Weather statistics by season:")
for season, start, end in [('Winter', 0, 59), ('Pre-monsoon', 60, 150),
                             ('Monsoon', 151, 273), ('Post-monsoon', 274, 334)]:
    print(f"  {season}:")
    print(f"    Temp: {temp[start:end].mean():.1f}C (std {temp[start:end].std():.1f})")
    print(f"    Moisture: {moisture[start:end].mean():.2f} (std {moisture[start:end].std():.2f})")
    print(f"    PAR: {par[start:end].mean():.0f} (std {par[start:end].std():.0f})")`,
      challenge: 'Add a "flood event" generator: during monsoon months, there is a 10% daily chance of a flood that sets moisture to 0.98 and PAR to 100 for 3 consecutive days. How does this affect the annual weather statistics?',
      successHint: 'The weather generator is the simulator\'s heartbeat. Realistic temporal patterns and cross-correlations between variables are essential — without them, growth predictions will be systematically biased.',
    },
    {
      title: 'Full simulation — growth over a culm\'s lifetime',
      concept: `Now we integrate everything: environmental responses, the growth engine, weather generation, and phenological staging into a **complete lifecycle simulation** of a bamboo culm from emergence to lignification.

The simulation proceeds in daily timesteps:
1. Read today\'s weather (temperature, moisture, PAR, nitrogen)
2. Calculate environmental response for each factor
3. Combine using the multiplicative model
4. Apply phenological modifier based on culm age
5. Add stochastic noise
6. Update cumulative height
7. Check if meristems have lignified (growth stops permanently)

We will also track **resource consumption**: as the culm grows, it depletes soil nitrogen and uses water. This creates a feedback loop — rapid early growth depletes nutrients, which slows later growth. This is an example of **density-dependent limitation** emerging from the model without being explicitly programmed.

The output will be a complete growth trajectory showing daily height, growth rate, and the contribution of each environmental factor over time.`,
      analogy: 'Running the full simulation is like watching a time-lapse of a bamboo shoot over 90 days, except you can see inside: the hormones flowing, the cells dividing, the water pressure building. You control the weather, the soil, and the starting conditions. Each run is an experiment you could never do in real life because it takes 90 days to run once — but your computer runs it in milliseconds.',
      storyConnection: 'The story describes a bamboo grove growing "faster than you can watch." Your simulator lets you watch. Each simulated culm follows the same arc as the real ones in Assam: tentative emergence, explosive growth during monsoon peak, gradual slowdown, and permanent hardening. The numbers match what Assamese bamboo researchers measure in the field.',
      checkQuestion: 'If your simulation predicts a peak growth rate of 85 cm/day but field measurements show only 60 cm/day, what are the most likely sources of error?',
      checkAnswer: 'Likely sources: (1) Response curves may overestimate growth at real-world conditions — lab-derived curves often represent ideal conditions, not field reality. (2) The model may not account for pest damage, physical wind stress, or competition from neighboring culms. (3) Weather inputs may be too optimistic — the weather generator produces "average" conditions, missing extreme events. (4) Nutrient depletion may be undermodeled. Calibration against real field data is essential.',
      codeIntro: 'Run a complete 90-day bamboo culm growth simulation and analyze the results.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Response functions ---
def f_light(par): return 1 - np.exp(-par / 400)
def f_water(sm): return np.clip((sm - 0.15) / 0.45, 0, 1) if sm < 0.6 else (1.0 if sm < 0.85 else max(0.5, 1.0 - (sm - 0.85) / 0.13 * 0.3))
def f_temp(tc):
    if tc < 10 or tc > 45: return 0
    if 25 <= tc <= 30: return 1.0
    if tc < 25: return ((tc - 10) / 15) ** 1.5
    return ((45 - tc) / 15) ** 1.5
def f_nutrient(n): return n / (n + 30)
def phenology(day, peak=35, spread=15): return np.exp(-0.5 * ((day - peak) / spread) ** 2)

# --- Weather generator (monsoon season, starting June) ---
def gen_weather(n_days):
    temp = np.zeros(n_days)
    moisture = np.zeros(n_days)
    par = np.zeros(n_days)
    temp[0], moisture[0], par[0] = 28, 0.7, 450
    for d in range(1, n_days):
        # Monsoon: warm, wet, variable clouds
        temp[d] = 0.8 * temp[d-1] + 0.2 * 28 + np.random.randn() * 1.5
        moisture[d] = 0.7 * moisture[d-1] + 0.3 * 0.75 + np.random.randn() * 0.06
        par[d] = 0.5 * par[d-1] + 0.5 * 420 + np.random.randn() * 100
        if moisture[d] > 0.8: par[d] -= 150  # clouds
        temp[d] = np.clip(temp[d], 18, 36)
        moisture[d] = np.clip(moisture[d], 0.2, 0.95)
        par[d] = np.clip(par[d], 80, 1000)
    return temp, moisture, par

# --- Run simulation ---
days = 90
Gmax = 91.0  # cm/day maximum
temp, moisture, par = gen_weather(days)

# Soil nitrogen with depletion
nitrogen = np.zeros(days)
nitrogen[0] = 70
for d in range(1, days):
    nitrogen[d] = nitrogen[d-1] - 0.3  # depletion by growth
    nitrogen[d] += np.random.randn() * 1.5  # decomposition adds back
    if moisture[d] > 0.8: nitrogen[d] += 0.5  # flood nutrient input
    nitrogen[d] = np.clip(nitrogen[d], 10, 100)

# Track everything
height = np.zeros(days)
daily_growth = np.zeros(days)
factor_light = np.zeros(days)
factor_water = np.zeros(days)
factor_temp = np.zeros(days)
factor_nutrient = np.zeros(days)
factor_pheno = np.zeros(days)
lignified = False

for d in range(days):
    if lignified:
        daily_growth[d] = 0
        height[d] = height[d-1] if d > 0 else 0
        continue

    fl = f_light(par[d])
    fw = f_water(moisture[d])
    ft = f_temp(temp[d])
    fn = f_nutrient(nitrogen[d])
    ph = phenology(d)

    factor_light[d] = fl
    factor_water[d] = fw
    factor_temp[d] = ft
    factor_nutrient[d] = fn
    factor_pheno[d] = ph

    env = fl * fw * ft * fn
    growth = Gmax * env * ph * (1 + np.random.randn() * 0.06)
    growth = max(0, growth)

    daily_growth[d] = growth
    height[d] = (height[d-1] if d > 0 else 0) + growth

    # Lignification check: after day 65, if phenology < 0.1
    if d > 65 and ph < 0.1:
        lignified = True

fig, axes = plt.subplots(3, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bamboo Culm Growth Simulation (90 days)', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

d_axis = np.arange(days)

# 1: Height trajectory
axes[0, 0].plot(d_axis, height, color='#22c55e', linewidth=2.5)
axes[0, 0].fill_between(d_axis, height, alpha=0.15, color='#22c55e')
axes[0, 0].set_ylabel('Height (cm)', color='white')
axes[0, 0].set_title(f'Cumulative height — final: {height[-1]:.0f} cm ({height[-1]/100:.1f} m)', color='white', fontsize=10)

# 2: Daily growth rate
axes[0, 1].bar(d_axis, daily_growth, color='#f59e0b', alpha=0.8, width=1)
peak_day = np.argmax(daily_growth)
axes[0, 1].annotate(f'Peak: {daily_growth[peak_day]:.1f} cm (day {peak_day})',
                     xy=(peak_day, daily_growth[peak_day]), color='white', fontsize=8,
                     xytext=(peak_day+10, daily_growth[peak_day]+5),
                     arrowprops=dict(arrowstyle='->', color='white'))
axes[0, 1].set_ylabel('Daily growth (cm)', color='white')
axes[0, 1].set_title('Daily growth rate', color='white', fontsize=10)

# 3: Environmental factors stacked
axes[1, 0].stackplot(d_axis,
    [factor_light * 0.25, factor_water * 0.25, factor_temp * 0.25, factor_nutrient * 0.25],
    labels=['Light', 'Water', 'Temp', 'Nutrients'],
    colors=['#f59e0b', '#3b82f6', '#ef4444', '#22c55e'], alpha=0.7)
axes[1, 0].set_ylabel('Combined response', color='white')
axes[1, 0].set_title('Factor contributions (stacked)', color='white', fontsize=10)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper right')
axes[1, 0].set_ylim(0, 1.1)

# 4: Phenology curve
axes[1, 1].plot(d_axis, factor_pheno, color='#a855f7', linewidth=2.5)
axes[1, 1].fill_between(d_axis, factor_pheno, alpha=0.2, color='#a855f7')
axes[1, 1].set_ylabel('Phenological modifier', color='white')
axes[1, 1].set_title('Developmental stage (bell curve)', color='white', fontsize=10)
lignify_day = next((d for d in range(days) if d > 65 and phenology(d) < 0.1), days)
axes[1, 1].axvline(lignify_day, color='red', linestyle='--', alpha=0.7, label=f'Lignification (day {lignify_day})')
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5: Weather inputs
axes[2, 0].plot(d_axis, temp, color='#ef4444', linewidth=1, label='Temp (C)')
ax2 = axes[2, 0].twinx()
ax2.plot(d_axis, moisture, color='#3b82f6', linewidth=1, label='Moisture')
ax2.tick_params(colors='#3b82f6')
axes[2, 0].set_xlabel('Day', color='white')
axes[2, 0].set_ylabel('Temperature (C)', color='#ef4444')
ax2.set_ylabel('Soil moisture', color='#3b82f6')
axes[2, 0].set_title('Weather inputs', color='white', fontsize=10)

# 6: Nitrogen depletion
axes[2, 1].plot(d_axis, nitrogen, color='#22c55e', linewidth=1.5)
axes[2, 1].fill_between(d_axis, nitrogen, alpha=0.15, color='#22c55e')
axes[2, 1].set_xlabel('Day', color='white')
axes[2, 1].set_ylabel('Available N (mg/kg)', color='white')
axes[2, 1].set_title(f'Nitrogen: {nitrogen[0]:.0f} -> {nitrogen[-1]:.0f} mg/kg', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("=== SIMULATION SUMMARY ===")
print(f"Final height: {height[-1]:.0f} cm ({height[-1]/100:.1f} m)")
print(f"Peak daily growth: {daily_growth[peak_day]:.1f} cm on day {peak_day}")
print(f"Growth cessation: day {lignify_day} (lignification)")
print(f"Total growth days: {np.sum(daily_growth > 0.1)}")
print(f"Nitrogen depleted: {nitrogen[0]:.0f} -> {nitrogen[-1]:.0f} mg/kg ({(1-nitrogen[-1]/nitrogen[0])*100:.0f}% reduction)")`,
      challenge: 'Run the simulation 100 times with different random seeds and plot the distribution of final heights. What is the coefficient of variation? This tells you how sensitive the outcome is to weather variability.',
      successHint: 'You have a working plant growth simulator. The S-shaped growth curve, the peak around day 35, the nitrogen depletion — all emerge naturally from the interaction of simple response functions.',
    },
    {
      title: 'Sensitivity analysis — which factor matters most?',
      concept: `Your simulator has many parameters: Gmax, response curve shapes, autocorrelation coefficients, nitrogen depletion rates. But which parameters most influence the outcome? **Sensitivity analysis** answers this systematically.

**One-at-a-time (OAT) sensitivity**: vary one parameter while holding all others constant. Simple but misses interactions between parameters.

**Morris screening**: vary each parameter by a step, measure the output change, repeat at different starting points. The mean effect (mu*) ranks parameter importance; the standard deviation (sigma) indicates interactions.

**Sobol indices**: decompose the total output variance into contributions from each parameter and their interactions. Computationally expensive but rigorous. The **first-order index** (Si) measures the direct effect of parameter i; the **total-order index** (STi) includes all interactions involving parameter i.

For our bamboo simulator, you would expect:
- **Water** to have the highest sensitivity (bamboo is extremely water-dependent)
- **Temperature** to matter mainly through its threshold effects (below 10C = death)
- **Nutrients** to matter in the long run (depletion limits sustained growth)
- **Light** to matter least (bamboo tolerates partial shade)

Sensitivity analysis tells you where to focus data collection: measure the most sensitive parameters carefully, approximate the rest.`,
      analogy: 'Sensitivity analysis is like adjusting the ingredients in a recipe to find out which one matters most. If doubling the salt ruins the dish but doubling the pepper barely changes it, salt is the sensitive parameter. You would measure salt carefully but eyeball the pepper. Same logic applies to simulator parameters.',
      storyConnection: 'Assam bamboo farmers intuitively know the sensitivity ranking: they plant near water sources (water > everything), choose south-facing slopes (temperature), add organic fertilizer (nutrients), and accept whatever light is available (least concern). Their empirical knowledge matches what formal sensitivity analysis reveals.',
      checkQuestion: 'If water has a first-order Sobol index of 0.45 and a total-order index of 0.62, what do those numbers mean?',
      checkAnswer: 'Si = 0.45 means 45% of the output variance is due to water alone (direct effect). STi = 0.62 means water is involved in 62% of total variance, including interactions with other parameters. The difference (0.62 - 0.45 = 0.17) is the variance due to interactions: water combined with temperature, water combined with nutrients, etc. Water is clearly the dominant parameter, and its interactions with other factors are also significant.',
      codeIntro: 'Perform OAT sensitivity analysis on the bamboo growth simulator.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified growth simulator for sensitivity analysis
def simulate_bamboo(Gmax=91, water_base=0.70, temp_base=28, par_base=450,
                     n_base=70, n_depletion=0.3, growth_days=90, peak_day=35):
    """Run one simulation, return final height."""
    height = 0
    nitrogen = n_base
    for d in range(growth_days):
        # Environmental responses
        fl = 1 - np.exp(-par_base / 400)
        fw = np.clip((water_base - 0.15) / 0.45, 0, 1) if water_base < 0.6 else 1.0
        ft = 1.0 if 25 <= temp_base <= 30 else max(0, 1 - abs(temp_base - 27.5) / 17.5)
        fn = nitrogen / (nitrogen + 30)
        ph = np.exp(-0.5 * ((d - peak_day) / 15) ** 2)

        growth = Gmax * fl * fw * ft * fn * ph
        growth *= (1 + np.random.randn() * 0.05)
        height += max(0, growth)
        nitrogen = max(10, nitrogen - n_depletion + np.random.randn() * 0.5)
    return height

# --- OAT Sensitivity Analysis ---
# Baseline
baseline = simulate_bamboo()

# Parameters to test with their ranges
params = {
    'Gmax':         {'base': 91,   'low': 60,   'high': 120,  'unit': 'cm/day'},
    'water_base':   {'base': 0.70, 'low': 0.25, 'high': 0.90, 'unit': 'fraction'},
    'temp_base':    {'base': 28,   'low': 15,   'high': 38,   'unit': 'C'},
    'par_base':     {'base': 450,  'low': 100,  'high': 900,  'unit': 'umol/m2/s'},
    'n_base':       {'base': 70,   'low': 20,   'high': 120,  'unit': 'mg/kg'},
    'n_depletion':  {'base': 0.3,  'low': 0.05, 'high': 0.8,  'unit': 'mg/kg/day'},
    'peak_day':     {'base': 35,   'low': 20,   'high': 50,   'unit': 'day'},
}

# Sweep each parameter
n_points = 30
results = {}

for pname, pinfo in params.items():
    values = np.linspace(pinfo['low'], pinfo['high'], n_points)
    heights = []
    for v in values:
        kwargs = {p: params[p]['base'] for p in params}
        kwargs[pname] = v
        h = simulate_bamboo(**kwargs)
        heights.append(h)
    results[pname] = {'values': values, 'heights': np.array(heights)}

# Calculate sensitivity: (max - min) / baseline
sensitivities = {}
for pname, data in results.items():
    sensitivity = (data['heights'].max() - data['heights'].min()) / baseline
    sensitivities[pname] = sensitivity

# Sort by sensitivity
sorted_params = sorted(sensitivities, key=lambda x: sensitivities[x], reverse=True)

fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Sensitivity Analysis: Which factor controls growth?', color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_list = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#a855f7', '#ec4899', '#06b6d4']

# Individual parameter sweeps
for i, pname in enumerate(sorted_params):
    ax = axes[0, i] if i < 4 else axes[1, i-4]
    data = results[pname]
    ax.plot(data['values'], data['heights'], color=colors_list[i], linewidth=2)
    ax.axhline(baseline, color='gray', linestyle='--', alpha=0.5)
    ax.axvline(params[pname]['base'], color='white', linestyle=':', alpha=0.3)
    ax.set_xlabel(f'{pname} ({params[pname]["unit"]})', color='white', fontsize=8)
    ax.set_ylabel('Final height (cm)', color='white', fontsize=8)
    ax.set_title(f'Sensitivity: {sensitivities[pname]:.2f}', color=colors_list[i], fontsize=10, fontweight='bold')

# Tornado chart in last panel
ax_tornado = axes[1, 3]
y_pos = np.arange(len(sorted_params))
sens_values = [sensitivities[p] for p in sorted_params]
bars = ax_tornado.barh(y_pos, sens_values, color=colors_list[:len(sorted_params)], alpha=0.85)
ax_tornado.set_yticks(y_pos)
ax_tornado.set_yticklabels(sorted_params, fontsize=8, color='white')
ax_tornado.set_xlabel('Relative sensitivity', color='white')
ax_tornado.set_title('SENSITIVITY RANKING', color='white', fontsize=11, fontweight='bold')
for bar, v in zip(bars, sens_values):
    ax_tornado.text(v + 0.01, bar.get_y() + bar.get_height()/2, f'{v:.2f}', color='white', va='center', fontsize=8)

plt.tight_layout()
plt.show()

print("=== SENSITIVITY RANKING ===")
print(f"Baseline final height: {baseline:.0f} cm")
print()
for rank, pname in enumerate(sorted_params, 1):
    data = results[pname]
    print(f"  {rank}. {pname:<16} sensitivity={sensitivities[pname]:.3f}  "
          f"range: {data['heights'].min():.0f}-{data['heights'].max():.0f} cm")

print(f"\\nMost sensitive: {sorted_params[0]} — focus your measurements here!")
print(f"Least sensitive: {sorted_params[-1]} — rough estimates are fine.")`,
      challenge: 'Implement a simple interaction test: sweep water AND temperature simultaneously on a 10x10 grid. Plot a heatmap of final height. Is the interaction additive or multiplicative? Do you see any surprising combinations?',
      successHint: 'Sensitivity analysis is essential for any model. It tells you what to measure carefully and what to approximate. In agriculture, this translates directly to which field measurements are worth the cost.',
    },
    {
      title: 'Capstone finale — interactive scenario explorer',
      concept: `Your Plant Growth Simulator is complete. In this final lesson, you will build a **scenario comparison tool** that runs multiple simulations under different conditions and presents the results as a clear, actionable comparison.

Scenarios to compare:
- **Optimal monsoon**: ideal conditions throughout the growth period
- **Drought year**: 30% less rain during critical growth phase
- **Late planting**: culm emerges 30 days after monsoon onset instead of at onset
- **Nutrient-poor soil**: starting nitrogen at 30 instead of 70
- **Climate change (+2C)**: baseline temperature increased by 2 degrees

For each scenario, you will run an ensemble of 50 simulations (varying the random seed) to capture the **range of outcomes**. The result is a set of **growth probability distributions** showing not just the expected height, but the uncertainty around it.

This is how real agricultural decision-support systems work: they do not give a single answer, they give a range. "Under drought conditions, your bamboo will reach 12-16 meters with 90% confidence, compared to 18-22 meters in a normal year." That range is what farmers need to make informed decisions.`,
      analogy: 'The scenario explorer is like a financial portfolio simulator. Instead of asking "how much will I earn?", you ask "what is the range of outcomes under different market conditions?" A single prediction is useless because the future is uncertain. A distribution of outcomes lets you make informed decisions about risk.',
      storyConnection: 'Climate change is already affecting Assam\'s bamboo. Monsoon patterns are shifting, droughts are more frequent in some areas, and temperatures are rising. Your simulator quantifies these impacts. When a Kamrup farmer asks "should I plant bamboo or switch to teak?", the scenario explorer provides the data to answer.',
      checkQuestion: 'You run 50 simulations under drought conditions. The mean final height is 1400 cm with a standard deviation of 200 cm. Under optimal conditions, the mean is 2000 cm with std 150 cm. What does the smaller standard deviation under optimal conditions tell you?',
      checkAnswer: 'Under optimal conditions, the outcome is more predictable — good conditions are consistently good. Under drought, there is more variability because small differences in timing and intensity of water stress have outsized effects. This is a general principle: stressed systems have higher variance in outcomes. It also means drought predictions are inherently less certain.',
      codeIntro: 'Build the complete scenario comparison tool with ensemble simulations and probability distributions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

def run_ensemble(n_runs=50, Gmax=91, water_mult=1.0, temp_offset=0,
                  n_start=70, start_delay=0, growth_days=90, peak_day=35):
    """Run ensemble of simulations, return array of final heights and growth curves."""
    all_heights = np.zeros((n_runs, growth_days))
    final_h = []

    for run in range(n_runs):
        rng = np.random.RandomState(run * 137 + 42)
        height = 0
        nitrogen = n_start

        # Generate weather for this run
        temp_base = 28 + temp_offset
        water_base = 0.70 * water_mult

        for d in range(growth_days):
            # Effective day (accounts for delayed planting)
            eff_day = max(0, d - start_delay)

            # Daily weather variation
            t = temp_base + rng.randn() * 2.5
            w = water_base + rng.randn() * 0.08
            p = 420 + rng.randn() * 120
            t = np.clip(t, 10, 42)
            w = np.clip(w, 0.1, 0.95)
            p = np.clip(p, 80, 1000)

            # Response functions
            fl = 1 - np.exp(-p / 400)
            fw = np.clip((w - 0.15) / 0.45, 0, 1) if w < 0.6 else (1.0 if w < 0.85 else 0.8)
            ft = 1.0 if 25 <= t <= 30 else max(0, min(1, 1 - abs(t - 27.5) / 17.5))
            fn = nitrogen / (nitrogen + 30)
            ph = np.exp(-0.5 * ((eff_day - peak_day) / 15) ** 2)

            growth = Gmax * fl * fw * ft * fn * ph
            growth *= (1 + rng.randn() * 0.06)
            growth = max(0, growth)

            if eff_day > 70 and ph < 0.05:
                growth = 0  # lignified

            height += growth
            all_heights[run, d] = height
            nitrogen = max(10, nitrogen - 0.3 + rng.randn() * 0.5)

        final_h.append(height)

    return np.array(final_h), all_heights

# Define scenarios
scenarios = {
    'Optimal monsoon':   {'water_mult': 1.0, 'temp_offset': 0, 'n_start': 70, 'start_delay': 0},
    'Drought year':      {'water_mult': 0.55, 'temp_offset': 1, 'n_start': 65, 'start_delay': 0},
    'Late planting':     {'water_mult': 1.0, 'temp_offset': 0, 'n_start': 70, 'start_delay': 25},
    'Poor soil':         {'water_mult': 1.0, 'temp_offset': 0, 'n_start': 30, 'start_delay': 0},
    'Climate +2C':       {'water_mult': 0.85, 'temp_offset': 2, 'n_start': 70, 'start_delay': 0},
}

colors = {'Optimal monsoon': '#22c55e', 'Drought year': '#ef4444', 'Late planting': '#f59e0b',
          'Poor soil': '#a855f7', 'Climate +2C': '#3b82f6'}

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('PLANT GROWTH SIMULATOR — Scenario Comparison (50 runs each)', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

all_results = {}
for name, params in scenarios.items():
    finals, curves = run_ensemble(**params)
    all_results[name] = {'finals': finals, 'curves': curves}

# 1: Growth trajectory envelopes
for name in scenarios:
    curves = all_results[name]['curves']
    mean = curves.mean(axis=0)
    p10 = np.percentile(curves, 10, axis=0)
    p90 = np.percentile(curves, 90, axis=0)
    axes[0, 0].plot(mean, color=colors[name], linewidth=2, label=name)
    axes[0, 0].fill_between(range(90), p10, p90, color=colors[name], alpha=0.1)
axes[0, 0].set_xlabel('Day', color='white')
axes[0, 0].set_ylabel('Height (cm)', color='white')
axes[0, 0].set_title('Growth trajectories (mean + 80% CI)', color='white', fontsize=10)
axes[0, 0].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: Final height distributions
positions = np.arange(len(scenarios))
bp = axes[0, 1].boxplot([all_results[n]['finals'] for n in scenarios],
                          positions=positions, widths=0.6, patch_artist=True,
                          medianprops=dict(color='white', linewidth=2))
for patch, name in zip(bp['boxes'], scenarios):
    patch.set_facecolor(colors[name])
    patch.set_alpha(0.7)
axes[0, 1].set_xticks(positions)
axes[0, 1].set_xticklabels([n.replace(' ', '\\n') for n in scenarios], fontsize=7, color='white')
axes[0, 1].set_ylabel('Final height (cm)', color='white')
axes[0, 1].set_title('Height distributions', color='white', fontsize=10)

# 3: Histograms overlaid
for name in scenarios:
    axes[0, 2].hist(all_results[name]['finals'], bins=15, alpha=0.4,
                     color=colors[name], label=name, density=True)
axes[0, 2].set_xlabel('Final height (cm)', color='white')
axes[0, 2].set_ylabel('Density', color='white')
axes[0, 2].set_title('Probability distributions', color='white', fontsize=10)
axes[0, 2].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4: Mean + std comparison
means = [all_results[n]['finals'].mean() for n in scenarios]
stds = [all_results[n]['finals'].std() for n in scenarios]
bars = axes[1, 0].bar(range(len(scenarios)), means, yerr=stds,
                        color=[colors[n] for n in scenarios], alpha=0.8,
                        capsize=5, error_kw={'color': 'white', 'linewidth': 1.5})
axes[1, 0].set_xticks(range(len(scenarios)))
axes[1, 0].set_xticklabels([n.replace(' ', '\\n') for n in scenarios], fontsize=7, color='white')
axes[1, 0].set_ylabel('Final height (cm)', color='white')
axes[1, 0].set_title('Mean height + std dev', color='white', fontsize=10)

# 5: Coefficient of variation
cvs = [s / m * 100 for m, s in zip(means, stds)]
axes[1, 1].bar(range(len(scenarios)), cvs,
               color=[colors[n] for n in scenarios], alpha=0.8)
axes[1, 1].set_xticks(range(len(scenarios)))
axes[1, 1].set_xticklabels([n.replace(' ', '\\n') for n in scenarios], fontsize=7, color='white')
axes[1, 1].set_ylabel('CV (%)', color='white')
axes[1, 1].set_title('Prediction uncertainty (CV)', color='white', fontsize=10)

# 6: Yield loss relative to optimal
optimal_mean = all_results['Optimal monsoon']['finals'].mean()
losses = [(1 - m / optimal_mean) * 100 for m in means]
bars = axes[1, 2].barh(range(len(scenarios)), losses,
                         color=[colors[n] for n in scenarios], alpha=0.8)
axes[1, 2].set_yticks(range(len(scenarios)))
axes[1, 2].set_yticklabels(list(scenarios.keys()), fontsize=8, color='white')
axes[1, 2].set_xlabel('Growth reduction (%)', color='white')
axes[1, 2].set_title('Impact relative to optimal', color='white', fontsize=10)
for bar, v in zip(bars, losses):
    axes[1, 2].text(max(0, v) + 0.5, bar.get_y() + bar.get_height()/2,
                     f'{v:.1f}%', color='white', va='center', fontsize=9)

plt.tight_layout()
plt.show()

print("=" * 65)
print("SCENARIO COMPARISON RESULTS")
print("=" * 65)
for name in scenarios:
    f = all_results[name]['finals']
    print(f"\\n  {name}:")
    print(f"    Mean height: {f.mean():.0f} cm ({f.mean()/100:.1f} m)")
    print(f"    Std dev: {f.std():.0f} cm  (CV = {f.std()/f.mean()*100:.1f}%)")
    print(f"    Range: {f.min():.0f} - {f.max():.0f} cm")
    print(f"    Growth loss: {(1-f.mean()/optimal_mean)*100:.1f}% vs optimal")

print(f"\\n  RECOMMENDATION:")
print(f"  Biggest risk: Drought ({(1-all_results['Drought year']['finals'].mean()/optimal_mean)*100:.0f}% loss)")
print(f"  Most uncertain: highest CV scenario needs more data")
print(f"  Climate +2C: moderate loss but manageable with irrigation")`,
      challenge: 'Add a sixth scenario: "Optimal + fertilizer" where n_start=120. Does extra fertilizer help when other conditions are already good? Plot the marginal benefit of fertilizer across all scenarios.',
      successHint: 'You built a complete Plant Growth Simulator from scratch. It combines plant physiology (response curves), ecology (resource limitation), mathematics (growth models), statistics (ensemble simulation), and climate science (weather generation). This is real computational biology.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Plant Growth Simulator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Model bamboo growth as a function of environment</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete plant growth simulator. Click to load Python.</p>
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
