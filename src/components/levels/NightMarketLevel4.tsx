import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function NightMarketLevel4() {
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
      title: 'Project Architecture: Market Price Prediction Model',
      concept: `This capstone builds a complete market intelligence system: a Price Prediction Model that ingests historical market data, identifies patterns, accounts for seasonal and event-driven demand shifts, and predicts prices for perishable goods at Ima Keithel. This is a tool that could help vendors make better stocking decisions and help consumers plan purchases.

The system has five modules:

1. **Data Generation & Feature Engineering**: Creates synthetic historical market data with realistic patterns — seasonal cycles, festival spikes, weather effects, supply disruptions. Extracts features: day of week, month, festival proximity, rainfall, temperature, supply volume, and previous prices.

2. **Exploratory Analysis**: Visualizes price patterns, identifies correlations between features and prices, detects seasonality and trends, and flags anomalies (unusual price spikes or crashes).

3. **Prediction Engine**: Implements three models — (a) simple moving average, (b) seasonal decomposition with trend, (c) a feature-based regression model. Compares their accuracy using RMSE and R-squared on held-out test data.

4. **Risk & Opportunity Detection**: Identifies upcoming price spikes (festivals, weather events) and price dips (glut periods) to advise vendors and consumers. Calculates optimal stocking quantities to maximize profit while minimizing waste.

5. **Dashboard & Decision Support**: Integrates all modules into a multi-panel display showing current market state, 7-day price forecast, risk alerts, and recommendations for vendors and consumers.

This is practical data science applied to a real market — the skills transfer directly to any predictive analytics role.`,
      analogy: 'Building a market price predictor is like building a weather forecast for economics. Just as a weather model ingests temperature, pressure, humidity, and wind data to predict tomorrow\'s weather, our model ingests supply volumes, seasonal patterns, festival calendars, and historical prices to predict tomorrow\'s market prices. Both are fundamentally about finding patterns in noisy data and extrapolating them forward.',
      storyConnection: 'In the story, the girl\'s mother always knows when to stock up on certain goods and when to hold back. This is experiential pattern recognition — built over decades of market participation. Our model encodes the same patterns computationally: festival demand surges, monsoon supply disruptions, seasonal availability. The model does not replace the mother\'s intuition; it augments it with data-driven precision.',
      checkQuestion: 'Why is predicting prices for perishable goods at Ima Keithel fundamentally different from predicting stock market prices?',
      checkAnswer: 'Three key differences. (1) Perishable goods have a hard deadline — unsold fish at market close is worth zero, creating a time-dependent price decline that stocks do not have. (2) Supply is constrained by nature (harvest, catch), not by manufacturing decisions — you cannot "print more fish" the way a company can issue more shares. (3) Demand is driven by biological needs (hunger, nutrition) and cultural events (festivals) rather than speculation and sentiment. These differences make perishable market prices more predictable than stock prices because the underlying drivers are more physical and less psychological.',
      codeIntro: 'Define the project architecture and build Module 1: generate 2 years of synthetic market data with realistic patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# MARKET PRICE PREDICTION MODEL — Module 1: Data Generation
# ============================================================

class MarketDataGenerator:
    """Generate synthetic market data for Ima Keithel."""

    PRODUCTS = {
        'King Chilli': {'base_price': 800, 'volatility': 0.15, 'seasonal_amp': 0.30,
                        'peak_month': 8, 'perishability': 0.8},
        'Fresh Fish': {'base_price': 300, 'volatility': 0.20, 'seasonal_amp': 0.15,
                       'peak_month': 3, 'perishability': 0.95},
        'Rice': {'base_price': 45, 'volatility': 0.05, 'seasonal_amp': 0.10,
                 'peak_month': 5, 'perishability': 0.1},
        'Vegetables': {'base_price': 60, 'volatility': 0.25, 'seasonal_amp': 0.35,
                       'peak_month': 4, 'perishability': 0.9},
        'Handloom Textile': {'base_price': 1500, 'volatility': 0.08, 'seasonal_amp': 0.20,
                             'peak_month': 10, 'perishability': 0.0},
    }

    FESTIVALS = {
        'Yaoshang (Holi)': {'month': 3, 'day': 10, 'demand_boost': 0.40},
        'Cheiraoba (New Year)': {'month': 4, 'day': 15, 'demand_boost': 0.50},
        'Ningol Chakouba': {'month': 11, 'day': 5, 'demand_boost': 0.60},
        'Kut Festival': {'month': 11, 'day': 1, 'demand_boost': 0.35},
        'Christmas/Year End': {'month': 12, 'day': 25, 'demand_boost': 0.25},
    }

    def __init__(self, n_days=730):
        self.n_days = n_days

    def generate(self, product_name):
        """Generate daily price data for a product."""
        p = self.PRODUCTS[product_name]
        days = np.arange(self.n_days)
        dates_month = (days % 365) // 30 + 1  # approximate month
        dates_dow = days % 7  # day of week (0=Mon, 6=Sun)

        # Base seasonal pattern
        seasonal = p['seasonal_amp'] * np.sin(2 * np.pi * (days - (p['peak_month'] - 1) * 30) / 365)

        # Day-of-week effect (market busier on weekends)
        dow_effect = np.where(dates_dow >= 5, 0.05, -0.02)

        # Festival effects
        festival_effect = np.zeros(self.n_days)
        for f_name, f_data in self.FESTIVALS.items():
            for year_offset in [0, 365]:
                f_day = (f_data['month'] - 1) * 30 + f_data['day'] + year_offset
                if f_day < self.n_days:
                    # Demand builds 5 days before, peaks on day, drops after
                    for d in range(-5, 3):
                        idx = int(f_day + d)
                        if 0 <= idx < self.n_days:
                            weight = max(0, 1 - abs(d) / 5)
                            festival_effect[idx] += f_data['demand_boost'] * weight

        # Weather effect (monsoon reduces supply of perishables)
        monsoon = np.where((dates_month >= 6) & (dates_month <= 9), 0.15, 0)
        monsoon *= p['perishability']  # only affects perishable goods

        # Random supply shocks (road closures, bandhs)
        supply_shocks = np.zeros(self.n_days)
        n_shocks = int(self.n_days * 0.03)  # ~3% of days
        shock_days = np.random.choice(self.n_days, n_shocks, replace=False)
        supply_shocks[shock_days] = np.random.uniform(0.1, 0.4, n_shocks)

        # Trend (slight inflation)
        trend = 0.0003 * days  # ~10% annual inflation

        # Combine all effects
        price_factor = (1 + seasonal + dow_effect + festival_effect +
                        monsoon + supply_shocks + trend)

        # Add noise
        noise = np.random.normal(0, p['volatility'] * 0.5, self.n_days)
        price = p['base_price'] * price_factor * (1 + noise)
        price = np.maximum(price, p['base_price'] * 0.3)  # floor

        # Features for ML
        features = np.column_stack([
            days,                           # day index
            dates_month,                    # month (1-12)
            dates_dow,                      # day of week
            seasonal,                       # seasonal component
            festival_effect,                # festival proximity
            monsoon,                        # monsoon effect
            supply_shocks,                  # supply disruptions
            np.roll(price, 1),             # previous day price (lag-1)
            np.roll(price, 7),             # 7-day lag
        ])
        features[0, 7] = price[0]  # fix first lag
        features[:7, 8] = price[:7]  # fix 7-day lag

        return price, features, ['day', 'month', 'dow', 'seasonal', 'festival',
                                  'monsoon', 'supply_shock', 'lag1', 'lag7']

# --- Generate data ---
gen = MarketDataGenerator(n_days=730)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Module 1: Synthetic Market Data for Ima Keithel (2 Years)',
             color='white', fontsize=14, fontweight='bold')

colors_prod = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7']
all_data = {}

for idx, (product, color) in enumerate(zip(gen.PRODUCTS.keys(), colors_prod)):
    price, features, feat_names = gen.generate(product)
    all_data[product] = {'price': price, 'features': features, 'feat_names': feat_names}

    if idx < 5:
        ax = axes.flat[idx]
        ax.set_facecolor('#111827')
        ax.tick_params(colors='gray')
        ax.plot(price, color=color, linewidth=1, alpha=0.7)

        # 30-day moving average
        ma30 = np.convolve(price, np.ones(30)/30, mode='same')
        ax.plot(ma30, color='white', linewidth=2, alpha=0.8, label='30-day MA')

        # Mark festivals
        for f_name, f_data in gen.FESTIVALS.items():
            f_day = (f_data['month'] - 1) * 30 + f_data['day']
            if f_day < 730:
                ax.axvline(x=f_day, color='#ec4899', linewidth=1, alpha=0.3)

        ax.set_title(f'{product} (Rs/kg)', color=color, fontsize=11)
        ax.set_xlabel('Day', color='white', fontsize=9)
        if idx == 0:
            ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Summary panel
ax = axes.flat[5]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

products = list(gen.PRODUCTS.keys())
means = [np.mean(all_data[p]['price']) for p in products]
stds = [np.std(all_data[p]['price']) for p in products]
cvs = [s/m*100 for s, m in zip(stds, means)]

ax.barh(products, cvs, color=colors_prod, edgecolor='none', height=0.5)
for i, (cv, m) in enumerate(zip(cvs, means)):
    ax.text(cv + 0.5, i, f'CV={cv:.1f}% (mean Rs{m:.0f})', va='center', color='white', fontsize=8)
ax.set_xlabel('Coefficient of variation (%)', color='white', fontsize=10)
ax.set_title('Price volatility comparison', color='white', fontsize=11)
ax.tick_params(axis='y', labelcolor='white', labelsize=8)

plt.tight_layout()
plt.show()

print("Data Generation Summary")
print("=" * 60)
print(f"Period: {gen.n_days} days (2 years)")
print(f"Products: {len(gen.PRODUCTS)}")
print(f"Features per product: {len(feat_names)}")
print(f"Festivals modeled: {len(gen.FESTIVALS)}")
print()
for product in products:
    p = all_data[product]['price']
    print(f"  {product:20s}: mean=Rs{np.mean(p):.0f}, std=Rs{np.std(p):.0f}, "
          f"min=Rs{np.min(p):.0f}, max=Rs{np.max(p):.0f}")`,
      challenge: 'Add a "bandh effect" (general strike, common in Manipur): on bandh days, supply drops to near zero for all products, causing extreme price spikes the following day. Generate realistic bandh frequencies (2-3 per month in peak periods) and show their cumulative economic impact.',
      successHint: 'Module 1 delivers a realistic dataset that captures the key drivers of market prices: seasonality, festivals, monsoon, supply disruptions, and inflation. This is the foundation for all subsequent analysis.',
    },
    {
      title: 'Exploratory Analysis — finding patterns in market noise',
      concept: `Before building prediction models, we must understand the data. Exploratory analysis reveals the patterns that models will learn and the anomalies that models must handle.

**Seasonal decomposition**: Every time series can be decomposed into three components: trend (long-term direction), seasonal (repeating pattern within a year), and residual (random noise). For Ima Keithel prices, the trend captures inflation and structural changes; the seasonal component captures monsoon supply disruptions and festival demand surges; the residual captures unpredictable events (bandhs, weather anomalies).

**Correlation analysis**: Which features most strongly predict price? We compute Pearson correlation between each feature and the target price. Strong correlations indicate useful predictors. At Ima Keithel, we expect: festival proximity (positive — demand surge), monsoon indicator (positive — supply constraint), previous price (positive — price persistence/autocorrelation), and day of week (weak — slight weekend premium).

**Autocorrelation**: Price on day t is correlated with price on day t-1, t-2, etc. The **autocorrelation function (ACF)** measures this. Strong short-term autocorrelation (lags 1-7) means yesterday's price is a good predictor of today's. Seasonal autocorrelation (lag ~365) means last year's price for the same date is informative. For perishable goods, autocorrelation decays faster than for durable goods because perishable supply is "reset" daily.

**Anomaly detection**: Prices more than 2 standard deviations from the 30-day moving average are flagged as anomalies. These represent bandhs, weather disasters, or data errors. Anomalies must be understood (not just removed) because they often carry the most economic information.`,
      analogy: 'Exploratory analysis is like a doctor\'s examination before prescribing treatment. You would not trust a doctor who prescribed medicine without first checking your blood pressure, temperature, and symptoms. Similarly, you should not trust a prediction model built without first examining the data\'s patterns, correlations, and anomalies. The examination reveals what the model needs to learn.',
      storyConnection: 'The experienced vendors at Ima Keithel already do exploratory analysis intuitively. They know that Umorok prices peak in August (seasonal pattern), that Ningol Chakouba drives a demand spike (festival effect), and that a bandh yesterday means high prices today (autocorrelation). Our computational analysis simply quantifies what they already know — and may reveal patterns too subtle for intuition to catch.',
      checkQuestion: 'The autocorrelation at lag 1 for fish prices is 0.85, while for rice prices it is 0.98. What does this difference tell you about the two markets?',
      checkAnswer: 'Rice\'s high autocorrelation (0.98) means today\'s rice price is very similar to yesterday\'s — rice prices are stable and change slowly. This makes sense: rice is non-perishable, supply is stable (stored in warehouses), and demand is constant. Fish\'s lower autocorrelation (0.85) means prices are more volatile day-to-day. This reflects daily variation in the catch, perishability (yesterday\'s unsold fish is gone, not carried over), and weather-dependent fishing. For prediction: a simple "use yesterday\'s price" model works well for rice (error ~2%) but poorly for fish (error ~15%). Fish prices need more sophisticated features.',
      codeIntro: 'Perform exploratory analysis: seasonal decomposition, feature correlations, autocorrelation, and anomaly detection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Regenerate data (from Module 1) ---
class QuickDataGen:
    def generate(self, base, vol, seas_amp, peak_m, perish, n=730):
        days = np.arange(n)
        months = (days % 365) // 30 + 1
        seasonal = seas_amp * np.sin(2*np.pi*(days-(peak_m-1)*30)/365)
        monsoon = np.where((months>=6)&(months<=9), 0.15*perish, 0)
        festival = np.zeros(n)
        for fm, fd, boost in [(3,10,0.4),(4,15,0.5),(11,5,0.6),(11,1,0.35),(12,25,0.25)]:
            for yo in [0,365]:
                f = (fm-1)*30+fd+yo
                for d in range(-5,3):
                    idx = int(f+d)
                    if 0<=idx<n:
                        festival[idx] += boost * max(0,1-abs(d)/5)
        shocks = np.zeros(n)
        shocks[np.random.choice(n, int(n*0.03), replace=False)] = np.random.uniform(0.1,0.4,int(n*0.03))
        trend = 0.0003 * days
        noise = np.random.normal(0, vol*0.5, n)
        price = base * (1+seasonal+monsoon+festival+shocks+trend) * (1+noise)
        return np.maximum(price, base*0.3), months, seasonal, festival, monsoon, shocks

gen = QuickDataGen()
fish_price, months, seasonal, festival, monsoon, shocks = gen.generate(300, 0.2, 0.15, 3, 0.95)
chilli_price, _, _, _, _, _ = gen.generate(800, 0.15, 0.30, 8, 0.8)
rice_price, _, _, _, _, _ = gen.generate(45, 0.05, 0.10, 5, 0.1)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Exploratory Analysis: Price Patterns at Ima Keithel',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Seasonal decomposition (fish)
ax = axes[0, 0]
# Trend: 30-day moving average
trend = np.convolve(fish_price, np.ones(30)/30, mode='same')
detrended = fish_price - trend
# Seasonal: average by day-of-year
days_of_year = np.arange(730) % 365
seasonal_comp = np.zeros(365)
for d in range(365):
    mask = days_of_year == d
    if np.sum(mask) > 0:
        seasonal_comp[d] = np.mean(detrended[mask])
seasonal_full = seasonal_comp[days_of_year]
residual = fish_price - trend - seasonal_full

ax.plot(fish_price, color='#3b82f6', linewidth=0.5, alpha=0.5, label='Actual')
ax.plot(trend, color='white', linewidth=2, label='Trend (30-day MA)')
ax.plot(trend + seasonal_full, color='#22c55e', linewidth=1.5, alpha=0.7, label='Trend + seasonal')
ax.set_xlabel('Day', color='white', fontsize=9)
ax.set_ylabel('Price (Rs)', color='white', fontsize=9)
ax.set_title('Fresh Fish: Seasonal decomposition', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Feature correlations
ax = axes[0, 1]
features = np.column_stack([months, seasonal, festival, monsoon, shocks,
                             np.roll(fish_price, 1), np.roll(fish_price, 7)])
features[0, 5] = fish_price[0]
features[:7, 6] = fish_price[:7]
feat_names = ['Month', 'Seasonal', 'Festival', 'Monsoon', 'Supply shock', 'Lag-1 price', 'Lag-7 price']

correlations = [np.corrcoef(features[:, i], fish_price)[0, 1] for i in range(features.shape[1])]
colors_corr = ['#22c55e' if c > 0 else '#ef4444' for c in correlations]
bars = ax.barh(feat_names, correlations, color=colors_corr, edgecolor='none', height=0.5)
ax.axvline(x=0, color='white', linewidth=0.5)
for bar, c in zip(bars, correlations):
    x = c + 0.02 if c > 0 else c - 0.02
    ha = 'left' if c > 0 else 'right'
    ax.text(x, bar.get_y() + bar.get_height()/2, f'{c:.3f}',
            va='center', ha=ha, color='white', fontsize=8)
ax.set_xlabel('Correlation with price', color='white', fontsize=10)
ax.set_title('Feature-price correlations (Fish)', color='white', fontsize=11)
ax.tick_params(axis='y', labelcolor='white', labelsize=8)

# Plot 3: Autocorrelation function
ax = axes[0, 2]
max_lag = 60
acf_fish = [np.corrcoef(fish_price[lag:], fish_price[:-lag])[0,1] if lag > 0 else 1.0
            for lag in range(max_lag)]
acf_rice = [np.corrcoef(rice_price[lag:], rice_price[:-lag])[0,1] if lag > 0 else 1.0
            for lag in range(max_lag)]
acf_chilli = [np.corrcoef(chilli_price[lag:], chilli_price[:-lag])[0,1] if lag > 0 else 1.0
              for lag in range(max_lag)]

ax.plot(acf_fish, color='#3b82f6', linewidth=2, label='Fish')
ax.plot(acf_rice, color='#22c55e', linewidth=2, label='Rice')
ax.plot(acf_chilli, color='#ef4444', linewidth=2, label='King Chilli')
ax.axhline(y=0, color='white', linewidth=0.5, alpha=0.3)
ax.axhline(y=2/np.sqrt(730), color='white', linestyle=':', alpha=0.3, label='95% significance')
ax.axhline(y=-2/np.sqrt(730), color='white', linestyle=':', alpha=0.3)
ax.set_xlabel('Lag (days)', color='white', fontsize=11)
ax.set_ylabel('Autocorrelation', color='white', fontsize=11)
ax.set_title('Autocorrelation function', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Anomaly detection
ax = axes[1, 0]
ma = np.convolve(fish_price, np.ones(30)/30, mode='same')
std_rolling = np.array([np.std(fish_price[max(0,i-15):i+15]) for i in range(730)])
upper = ma + 2 * std_rolling
lower = ma - 2 * std_rolling
anomalies = (fish_price > upper) | (fish_price < lower)

ax.plot(fish_price, color='#3b82f6', linewidth=0.8, alpha=0.6)
ax.fill_between(range(730), lower, upper, alpha=0.15, color='#f59e0b', label='Normal range (2\\u03c3)')
ax.scatter(np.where(anomalies)[0], fish_price[anomalies], color='#ef4444', s=20,
           zorder=5, label=f'Anomalies ({np.sum(anomalies)})')
ax.set_xlabel('Day', color='white', fontsize=11)
ax.set_ylabel('Price (Rs)', color='white', fontsize=11)
ax.set_title(f'Anomaly detection: Fish prices', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Monthly box plots
ax = axes[1, 1]
monthly_prices = [fish_price[(months == m)] for m in range(1, 13)]
bp = ax.boxplot(monthly_prices, positions=range(1, 13), widths=0.6,
                patch_artist=True, medianprops=dict(color='white', linewidth=2))
month_labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
ax.set_xticks(range(1, 13))
ax.set_xticklabels(month_labels, color='white')
monsoon_months = [6, 7, 8, 9]
for i, patch in enumerate(bp['boxes']):
    if i + 1 in monsoon_months:
        patch.set_facecolor('#3b82f6')
    else:
        patch.set_facecolor('#22c55e')
    patch.set_alpha(0.6)
ax.set_ylabel('Price (Rs)', color='white', fontsize=11)
ax.set_title('Monthly price distribution (Fish)', color='white', fontsize=11)

# Plot 6: Day-of-week effect
ax = axes[1, 2]
dow_labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
dow = np.arange(730) % 7
for product, price_data, color in [('Fish', fish_price, '#3b82f6'),
                                     ('King Chilli', chilli_price, '#ef4444'),
                                     ('Rice', rice_price, '#22c55e')]:
    dow_means = [np.mean(price_data[dow == d]) for d in range(7)]
    dow_means_pct = [(m / np.mean(price_data) - 1) * 100 for m in dow_means]
    ax.plot(dow_labels, dow_means_pct, 'o-', color=color, linewidth=2, label=product)

ax.axhline(y=0, color='white', linewidth=0.5, alpha=0.3)
ax.set_ylabel('Price deviation from mean (%)', color='white', fontsize=10)
ax.set_title('Day-of-week price effect', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(axis='x', labelcolor='white', labelsize=9)

plt.tight_layout()
plt.show()

print("Exploratory Analysis Summary")
print("=" * 55)
print()
print("Feature correlations with Fish price:")
for name, corr in sorted(zip(feat_names, correlations), key=lambda x: -abs(x[1])):
    print(f"  {name:20s}: r = {corr:+.3f}")
print()
print(f"Anomalies detected: {np.sum(anomalies)} days ({np.sum(anomalies)/730*100:.1f}%)")
print(f"Autocorrelation at lag 1: Fish={acf_fish[1]:.3f}, Rice={acf_rice[1]:.3f}, Chilli={acf_chilli[1]:.3f}")
print()
print("Key finding: Lag-1 price is the strongest predictor (persistence).")
print("Festival and monsoon effects are strong but episodic.")`,
      challenge: 'Add a cross-correlation analysis: does a price spike in one product predict price changes in other products? For example, does a fish price spike (supply disruption) predict a vegetable price spike the next day (same weather event affecting both)? Compute cross-correlations and identify the strongest inter-product linkages.',
      successHint: 'The exploratory analysis reveals the data\'s structure: strong autocorrelation means simple models can work, seasonal patterns are clear, and anomalies correspond to identifiable events. This guides model selection in the next module.',
    },
    {
      title: 'Prediction Engine — three approaches to forecasting',
      concept: `Module 3 implements three prediction models of increasing sophistication and compares their accuracy on held-out test data.

**Model 1: Moving Average (MA)**. The simplest model: predict tomorrow's price as the average of the last k days. The 7-day MA smooths daily noise but lags behind sudden changes. This is the "naive baseline" — any serious model must beat it.

**Model 2: Seasonal Trend Decomposition (STL)**. Decompose the time series into trend, seasonal, and residual components. Forecast by extrapolating the trend and adding the seasonal pattern for the target date. The residual is assumed to be zero (unpredictable). This model captures the calendar-driven patterns (monsoon, festivals) that the MA misses.

**Model 3: Feature-based Regression**. Use multiple linear regression with all engineered features: month, day-of-week, festival proximity, monsoon indicator, supply shock history, and lagged prices. This model can learn complex relationships between features and prices. We use **ridge regression** (L2 regularization) to prevent overfitting when features are correlated.

**Evaluation**: We split the data into training (first 500 days) and test (last 230 days). Each model is fitted on training data and evaluated on test data using RMSE (root mean squared error) and R-squared. We also compute the **Mean Absolute Percentage Error (MAPE)** — the average absolute percentage error, which is intuitive for market participants: "Our model is off by 8% on average."

**Model selection**: The best model balances accuracy and simplicity. A complex model that is 1% more accurate but requires 10x more data and computation may not be worth it. For a daily market forecast, the model must also be explainable — vendors need to understand why the model predicts a price spike, not just that it does.`,
      analogy: 'The three models are like three navigation strategies. The Moving Average is like driving by looking in the rearview mirror — you only know where you have been. The Seasonal Decomposition is like following a planned route — it knows about upcoming turns (festivals) but cannot react to unexpected obstacles. The Regression model is like GPS navigation — it integrates real-time data (lagged prices, weather) with map knowledge (seasonal patterns) to give the best route. Each is useful, but GPS is most accurate.',
      storyConnection: 'The vendors at Ima Keithel are already running mental prediction models. When a vendor stocks up on Umorok before Ningol Chakouba, she is using Model 2 (seasonal knowledge). When she adjusts today\'s prices based on yesterday\'s sales, she is using Model 1 (recent average). Our computational Model 3 combines both strategies and adds features she might not track consciously (exact rainfall correlation, cross-product substitution effects).',
      checkQuestion: 'The 7-day MA has RMSE of Rs 45, the seasonal model has RMSE of Rs 38, and the regression model has RMSE of Rs 30. But on a day following a sudden bandh, the regression model predicts Rs 350 while actual price is Rs 500. What happened and how should we handle it?',
      checkAnswer: 'The regression model learned from historical average relationships, but a bandh is a rare event (3% of days) that creates an extreme supply shock. The model likely underpredicts because: (1) it was trained on average bandh effects, not extreme ones, (2) the features may not fully capture bandh severity (partial vs complete shutdown). Solutions: (1) add a binary "bandh expected" feature with a stronger coefficient, (2) use a nonlinear model (e.g., random forest) that can learn the extreme price response to rare events, (3) apply a post-hoc adjustment — if a bandh is known, multiply the prediction by a bandh amplification factor estimated from historical bandh days. This illustrates why prediction models need human oversight for extreme events.',
      codeIntro: 'Implement three prediction models, train on historical data, and compare their accuracy on held-out test data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Regenerate fish data ---
n = 730
days = np.arange(n)
months = (days % 365) // 30 + 1
dow = days % 7
seasonal = 0.15 * np.sin(2*np.pi*(days-60)/365)
monsoon = np.where((months>=6)&(months<=9), 0.15*0.95, 0)
festival = np.zeros(n)
for fm,fd,b in [(3,10,0.4),(4,15,0.5),(11,5,0.6),(11,1,0.35),(12,25,0.25)]:
    for yo in [0,365]:
        f = (fm-1)*30+fd+yo
        for d in range(-5,3):
            idx=int(f+d)
            if 0<=idx<n:
                festival[idx]+=b*max(0,1-abs(d)/5)
shocks = np.zeros(n)
shocks[np.random.choice(n,22,replace=False)] = np.random.uniform(0.1,0.4,22)
trend = 0.0003 * days
noise = np.random.normal(0, 0.1, n)
price = 300 * (1+seasonal+monsoon+festival+shocks+trend) * (1+noise)
price = np.maximum(price, 90)

# Train/test split
split = 500
train_price = price[:split]
test_price = price[split:]
test_days = days[split:]

# ============================================================
# MODEL 1: Moving Average
# ============================================================
def moving_average_forecast(prices, window=7):
    """Predict next day as average of last 'window' days."""
    predictions = np.zeros(len(prices))
    for i in range(len(prices)):
        if i < window:
            predictions[i] = np.mean(prices[:i+1])
        else:
            predictions[i] = np.mean(prices[i-window:i])
    return predictions

# Forecast test period
ma_pred = np.zeros(len(test_price))
all_prices = np.concatenate([train_price, np.zeros(len(test_price))])
for i in range(len(test_price)):
    idx = split + i
    all_prices[idx] = test_price[i]  # reveal actual for next step
    ma_pred[i] = np.mean(all_prices[max(0,idx-7):idx])

# ============================================================
# MODEL 2: Seasonal Trend Decomposition
# ============================================================
# Extract seasonal pattern from training data
train_doy = days[:split] % 365
seasonal_pattern = np.zeros(365)
for d in range(365):
    mask = train_doy == d
    if np.sum(mask) > 0:
        seasonal_pattern[d] = np.mean(train_price[mask])
    else:
        seasonal_pattern[d] = np.mean(train_price)

# Trend: linear fit to training data
trend_coeffs = np.polyfit(days[:split], train_price, 1)

stl_pred = np.zeros(len(test_price))
for i, d in enumerate(test_days):
    doy = d % 365
    trend_val = trend_coeffs[0] * d + trend_coeffs[1]
    seasonal_val = seasonal_pattern[doy] - np.mean(seasonal_pattern)
    stl_pred[i] = trend_val + seasonal_val

# ============================================================
# MODEL 3: Ridge Regression
# ============================================================
# Build feature matrix
def build_features(days_arr, price_arr, all_price):
    n_feat = len(days_arr)
    X = np.zeros((n_feat, 9))
    for i, d in enumerate(days_arr):
        X[i, 0] = (d % 365) // 30 + 1           # month
        X[i, 1] = d % 7                            # dow
        X[i, 2] = 0.15 * np.sin(2*np.pi*(d-60)/365)  # seasonal
        m = int((d % 365) // 30 + 1)
        X[i, 3] = 1.0 if 6 <= m <= 9 else 0.0   # monsoon
        # Festival proximity
        f_eff = 0
        for fm,fd,b in [(3,10,0.4),(4,15,0.5),(11,5,0.6),(11,1,0.35),(12,25,0.25)]:
            f_day = (fm-1)*30+fd
            dist = min(abs(d%365 - f_day), abs(d%365 - f_day - 365), abs(d%365 - f_day + 365))
            if dist < 10:
                f_eff += b * max(0, 1-dist/5)
        X[i, 4] = f_eff
        X[i, 5] = d                              # trend proxy
        # Lagged prices
        if d > 0 and d-1 < len(all_price):
            X[i, 6] = all_price[d-1]
        if d > 6 and d-7 < len(all_price):
            X[i, 7] = all_price[d-7]
        if d > 29 and d-30 < len(all_price):
            X[i, 8] = all_price[d-30]
    return X

# Training
X_train = build_features(days[:split], train_price, price)
y_train = train_price

# Ridge regression: w = (X'X + lambda*I)^-1 X'y
ridge_lambda = 10.0
XtX = X_train.T @ X_train + ridge_lambda * np.eye(X_train.shape[1])
Xty = X_train.T @ y_train
w = np.linalg.solve(XtX, Xty)

# Predict test
X_test = build_features(test_days, test_price, price)
ridge_pred = X_test @ w

# ============================================================
# EVALUATION
# ============================================================
def rmse(actual, predicted):
    return np.sqrt(np.mean((actual - predicted)**2))

def mape(actual, predicted):
    return np.mean(np.abs((actual - predicted) / actual)) * 100

def r_squared(actual, predicted):
    ss_res = np.sum((actual - predicted)**2)
    ss_tot = np.sum((actual - np.mean(actual))**2)
    return 1 - ss_res / ss_tot

models = {
    '7-day MA': ma_pred,
    'Seasonal+Trend': stl_pred,
    'Ridge Regression': ridge_pred,
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Prediction Engine: Three Models Compared',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: All predictions vs actual
ax = axes[0, 0]
ax.plot(test_days, test_price, color='white', linewidth=1.5, alpha=0.7, label='Actual')
for (name, pred), color in zip(models.items(), ['#ef4444', '#f59e0b', '#22c55e']):
    ax.plot(test_days, pred, color=color, linewidth=1.5, label=f'{name}')
ax.set_xlabel('Day', color='white', fontsize=11)
ax.set_ylabel('Price (Rs)', color='white', fontsize=11)
ax.set_title('Predictions vs actual (test period)', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Error metrics comparison
ax = axes[0, 1]
metric_names = ['RMSE (Rs)', 'MAPE (%)', 'R\\u00b2']
model_names = list(models.keys())
metrics_data = []
for name, pred in models.items():
    metrics_data.append([rmse(test_price, pred), mape(test_price, pred), r_squared(test_price, pred)])

x_pos = np.arange(len(metric_names))
width = 0.25
colors_models = ['#ef4444', '#f59e0b', '#22c55e']
for i, (name, metrics, color) in enumerate(zip(model_names, metrics_data, colors_models)):
    # Normalize for display
    display_vals = [metrics[0], metrics[1], metrics[2] * 50]  # scale R^2 for visibility
    bars = ax.bar(x_pos + i*width - width, display_vals, width, color=color,
                  label=name, edgecolor='none')
    for bar, val, raw in zip(bars, display_vals, metrics):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
                f'{raw:.1f}' if abs(raw) > 1 else f'{raw:.3f}',
                ha='center', color='white', fontsize=7)

ax.set_xticks(x_pos)
ax.set_xticklabels(metric_names, color='white')
ax.set_title('Model comparison (lower RMSE/MAPE = better, higher R\\u00b2 = better)',
             color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Prediction error distribution (Ridge)
ax = axes[1, 0]
errors = test_price - ridge_pred
ax.hist(errors, bins=40, color='#22c55e', edgecolor='none', alpha=0.8, density=True)
ax.axvline(x=0, color='white', linewidth=1)
ax.axvline(x=np.mean(errors), color='#ef4444', linewidth=2, linestyle='--',
           label=f'Mean error: Rs {np.mean(errors):.1f}')
ax.set_xlabel('Prediction error (Rs)', color='white', fontsize=11)
ax.set_ylabel('Density', color='white', fontsize=11)
ax.set_title('Ridge regression error distribution', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Feature importance (Ridge coefficients)
ax = axes[1, 1]
feat_labels = ['Month', 'DoW', 'Seasonal', 'Monsoon', 'Festival',
               'Trend', 'Lag-1', 'Lag-7', 'Lag-30']
# Standardize coefficients for comparison
X_std = np.std(X_train, axis=0)
X_std[X_std == 0] = 1
standardized_w = w * X_std

colors_imp = ['#22c55e' if c > 0 else '#ef4444' for c in standardized_w]
ax.barh(feat_labels, np.abs(standardized_w), color=colors_imp, edgecolor='none', height=0.5)
for i, (v, s) in enumerate(zip(np.abs(standardized_w), standardized_w)):
    ax.text(v + 0.5, i, f'{s:+.1f}', va='center', color='white', fontsize=8)
ax.set_xlabel('|Standardized coefficient|', color='white', fontsize=10)
ax.set_title('Feature importance (Ridge regression)', color='white', fontsize=11)
ax.tick_params(axis='y', labelcolor='white', labelsize=9)

plt.tight_layout()
plt.show()

print("Prediction Model Comparison")
print("=" * 60)
print(f"{'Model':25s} {'RMSE':>8} {'MAPE':>8} {'R-squared':>10}")
print("-" * 55)
for name, pred in models.items():
    print(f"{name:25s} {rmse(test_price, pred):>8.1f} {mape(test_price, pred):>7.1f}% {r_squared(test_price, pred):>10.3f}")

print()
print("Best model: Ridge Regression")
print(f"Average prediction error: Rs {np.mean(np.abs(errors)):.0f} ({mape(test_price, ridge_pred):.1f}%)")
print(f"On 90% of days, error is within Rs {np.percentile(np.abs(errors), 90):.0f}")`,
      challenge: 'Implement a fourth model: a simple feedforward neural network (1 hidden layer with 20 neurons, trained with gradient descent). Compare its accuracy to Ridge regression. Does the added complexity improve predictions enough to justify the loss of interpretability?',
      successHint: 'Module 3 demonstrates that even simple models can achieve useful accuracy when features are well-engineered. The Ridge regression\'s 8% MAPE means predictions are typically within Rs 25 of the actual price — useful for stocking decisions.',
    },
    {
      title: 'Risk Detection & Optimal Stocking',
      concept: `Module 4 uses the prediction model to identify upcoming risks and opportunities, and calculates optimal stocking quantities for vendors.

**Price spike detection**: When the model predicts a price significantly above the 30-day average (>20%), it flags an upcoming spike. Spikes can be anticipated (festivals — known calendar events) or unanticipated (weather disruptions — only detectable 1-2 days ahead). Early warning allows vendors to stock up before the spike and consumers to buy early.

**Price dip detection**: When supply is abundant and prices are predicted to drop below average, consumers should buy in bulk (for storable goods) and vendors should reduce orders to avoid waste. The model identifies these windows by tracking the seasonal component and supply indicators.

**Optimal stocking (newsvendor problem)**: The classic operations research problem: how much perishable inventory should a vendor order? Too much leads to waste (unsold goods spoil). Too little leads to lost sales. The optimal order quantity Q* depends on: price (p), cost (c), and the demand distribution. The solution is Q* = F^-1(p-c)/p, where F^-1 is the inverse of the demand cumulative distribution function, and (p-c)/p is the critical ratio. For a vendor with 30% margin (cost Rs 210, sell Rs 300), the critical ratio is 0.30, meaning she should stock to the 30th percentile of expected demand — accepting a 70% chance of running out rather than overstocking.

**Waste quantification**: We model waste as the expected unsold quantity: E[waste] = integral from Q to infinity of (Q - demand) * f(demand). This is the cost of overstocking. The lost-sale cost is the expected unmet demand: integral from 0 to Q of (demand - Q) * f(demand). The optimal Q balances these two costs.`,
      analogy: 'The optimal stocking problem is like packing for a trip where you might or might not need an umbrella. If you bring it and it does not rain, you carried unnecessary weight (waste). If you leave it and it rains, you get wet (lost sales). The critical ratio tells you: if rain probability is 70%, bring the umbrella (stock up). If it is 30%, leave it (stock less). The "cost of getting wet" (lost margin) vs "cost of carrying" (waste cost) determines your threshold.',
      storyConnection: 'The girl in the story watches her mother agonize over how much fish to buy at dawn. Too much and it spoils; too little and she turns away afternoon customers. The newsvendor model quantifies this intuition: given the mother\'s cost (Rs 210/kg), selling price (Rs 300/kg), and the typical demand distribution, the optimal stocking quantity is calculable. The model might tell her: "Buy 8 kg on normal days, 12 kg before Ningol Chakouba, 5 kg during bandh season."',
      checkQuestion: 'A fish vendor has cost Rs 200/kg and sells at Rs 300/kg. Unsold fish is worth Rs 50/kg (sold as animal feed). What is the critical ratio, and if daily demand is normally distributed with mean 10 kg and std 3 kg, how much should she order?',
      checkAnswer: 'Critical ratio = (selling price - cost) / (selling price - salvage value) = (300 - 200) / (300 - 50) = 100/250 = 0.40. She should order at the 40th percentile of demand. For normal distribution with mean 10 and std 3: Q* = 10 + 3 * Z(0.40). From standard normal tables, Z(0.40) = -0.253. So Q* = 10 + 3 * (-0.253) = 10 - 0.76 = 9.24 kg. Round to 9 kg. She should order slightly LESS than average demand because her margin is only 40% — the cost of waste is relatively high compared to the margin.',
      codeIntro: 'Build the risk detection and optimal stocking module with price forecasting, spike alerts, and newsvendor optimization.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy import stats as scipy_stats

np.random.seed(42)

# ============================================================
# MARKET PRICE MODEL — Module 4: Risk Detection & Stocking
# ============================================================

# --- Generate forecast data ---
n_days = 730
days = np.arange(n_days)
months = (days % 365) // 30 + 1
seasonal = 0.15 * np.sin(2*np.pi*(days-60)/365)
monsoon = np.where((months>=6)&(months<=9), 0.15*0.95, 0)
festival = np.zeros(n_days)
for fm,fd,b in [(3,10,0.4),(4,15,0.5),(11,5,0.6),(11,1,0.35),(12,25,0.25)]:
    for yo in [0,365]:
        f=(fm-1)*30+fd+yo
        for d in range(-5,3):
            idx=int(f+d)
            if 0<=idx<n_days:
                festival[idx]+=b*max(0,1-abs(d)/5)
shocks = np.zeros(n_days)
shocks[np.random.choice(n_days,22,replace=False)] = np.random.uniform(0.1,0.4,22)
trend = 0.0003 * days
noise = np.random.normal(0, 0.1, n_days)
price = 300 * (1+seasonal+monsoon+festival+shocks+trend) * (1+noise)
price = np.maximum(price, 90)

# Simple forecast (30-day MA + seasonal adjustment)
ma30 = np.convolve(price, np.ones(30)/30, mode='same')
forecast = ma30 * (1 + seasonal * 0.5 + festival * 0.8)

# --- Risk Detection ---
spike_threshold = 1.20  # 20% above MA
dip_threshold = 0.85    # 15% below MA
spikes = forecast > ma30 * spike_threshold
dips = forecast < ma30 * dip_threshold

# --- Newsvendor Optimization ---
class NewsvendorModel:
    def __init__(self, cost, price_sell, salvage=0, demand_mean=10, demand_std=3):
        self.cost = cost
        self.price = price_sell
        self.salvage = salvage
        self.demand_mean = demand_mean
        self.demand_std = demand_std
        self.critical_ratio = (price_sell - cost) / (price_sell - salvage)

    def optimal_quantity(self):
        z = scipy_stats.norm.ppf(self.critical_ratio)
        return self.demand_mean + self.demand_std * z

    def expected_profit(self, Q):
        """Expected profit for order quantity Q."""
        # Expected sales = E[min(Q, D)]
        z = (Q - self.demand_mean) / self.demand_std
        expected_sales = Q - self.demand_std * (z * scipy_stats.norm.cdf(z) + scipy_stats.norm.pdf(z))
        expected_waste = Q - expected_sales
        return (self.price * expected_sales - self.cost * Q + self.salvage * expected_waste)

    def expected_waste(self, Q):
        z = (Q - self.demand_mean) / self.demand_std
        return self.demand_std * (z * scipy_stats.norm.cdf(z) + scipy_stats.norm.pdf(z))

nv = NewsvendorModel(cost=210, price_sell=300, salvage=50, demand_mean=10, demand_std=3)
Q_star = nv.optimal_quantity()

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Risk Detection & Optimal Stocking for Ima Keithel',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Price forecast with spike/dip alerts
ax = axes[0, 0]
# Show last 180 days
display_range = slice(550, 730)
d_range = days[display_range]
ax.plot(d_range, price[display_range], color='#3b82f6', linewidth=1, alpha=0.6, label='Actual')
ax.plot(d_range, forecast[display_range], color='white', linewidth=2, label='Forecast')
ax.fill_between(d_range, ma30[display_range]*spike_threshold,
                ma30[display_range]*1.6,
                where=spikes[display_range], alpha=0.2, color='#ef4444', label='Spike alert')
ax.fill_between(d_range, ma30[display_range]*0.5,
                ma30[display_range]*dip_threshold,
                where=dips[display_range], alpha=0.2, color='#22c55e', label='Dip opportunity')
ax.set_xlabel('Day', color='white', fontsize=11)
ax.set_ylabel('Price (Rs/kg)', color='white', fontsize=11)
ax.set_title('Price forecast with alerts (last 180 days)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Newsvendor optimal quantity
ax = axes[0, 1]
quantities = np.linspace(2, 20, 100)
profits = [nv.expected_profit(Q) for Q in quantities]
wastes = [nv.expected_waste(Q) for Q in quantities]

ax.plot(quantities, profits, color='#22c55e', linewidth=2.5, label='Expected profit')
ax.axvline(x=Q_star, color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Optimal: {Q_star:.1f} kg')
ax.axvline(x=nv.demand_mean, color='white', linestyle=':', alpha=0.3,
           label=f'Mean demand: {nv.demand_mean} kg')

# Show profit at optimal
opt_profit = nv.expected_profit(Q_star)
ax.plot(Q_star, opt_profit, 'o', color='#f59e0b', markersize=12, zorder=5)
ax.text(Q_star + 0.5, opt_profit, f'Rs {opt_profit:.0f}', color='#f59e0b', fontsize=10)

ax.set_xlabel('Order quantity (kg)', color='white', fontsize=11)
ax.set_ylabel('Expected daily profit (Rs)', color='white', fontsize=11)
ax.set_title('Newsvendor: profit vs order quantity', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Waste vs stockout tradeoff
ax = axes[1, 0]
ax2 = ax.twinx()

waste_vals = [nv.expected_waste(Q) for Q in quantities]
stockout_prob = [1 - scipy_stats.norm.cdf((Q - nv.demand_mean) / nv.demand_std) for Q in quantities]

ax.plot(quantities, waste_vals, color='#ef4444', linewidth=2, label='Expected waste (kg)')
ax2.plot(quantities, np.array(stockout_prob) * 100, color='#3b82f6', linewidth=2,
         label='Stockout probability (%)')

ax.axvline(x=Q_star, color='#f59e0b', linewidth=2, linestyle='--')
ax.set_xlabel('Order quantity (kg)', color='white', fontsize=11)
ax.set_ylabel('Expected waste (kg)', color='#ef4444', fontsize=11)
ax2.set_ylabel('Stockout probability (%)', color='#3b82f6', fontsize=11)
ax2.tick_params(colors='gray')
ax.set_title('Waste vs stockout tradeoff', color='white', fontsize=11)
ax.legend(loc='upper left', fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.legend(loc='upper right', fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Annotate optimal point
opt_waste = nv.expected_waste(Q_star)
opt_stockout = (1 - scipy_stats.norm.cdf((Q_star - nv.demand_mean) / nv.demand_std)) * 100
ax.text(Q_star + 0.5, opt_waste + 0.3, f'Waste: {opt_waste:.1f} kg\\nStockout: {opt_stockout:.0f}%',
        color='#f59e0b', fontsize=9)

# Plot 4: Adaptive stocking (varies with predicted demand)
ax = axes[1, 1]
# Different scenarios affect demand
scenarios = {
    'Normal day': {'mean': 10, 'std': 3, 'color': '#3b82f6'},
    'Festival (Ningol)': {'mean': 18, 'std': 4, 'color': '#ef4444'},
    'Monsoon disruption': {'mean': 6, 'std': 4, 'color': '#f59e0b'},
    'Weekend': {'mean': 12, 'std': 3.5, 'color': '#22c55e'},
}

x_demand = np.linspace(0, 30, 200)
for name, s in scenarios.items():
    nv_scenario = NewsvendorModel(210, 300, 50, s['mean'], s['std'])
    Q_opt = nv_scenario.optimal_quantity()
    pdf = scipy_stats.norm.pdf(x_demand, s['mean'], s['std'])
    ax.plot(x_demand, pdf, color=s['color'], linewidth=2, label=f"{name}: order {Q_opt:.0f} kg")
    ax.axvline(x=Q_opt, color=s['color'], linestyle='--', alpha=0.5, linewidth=1.5)

ax.set_xlabel('Demand (kg)', color='white', fontsize=11)
ax.set_ylabel('Probability density', color='white', fontsize=11)
ax.set_title('Adaptive stocking by scenario', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Risk Detection & Stocking Optimization")
print("=" * 60)
print()
print("ALERTS (next 180 days):")
n_spikes = np.sum(spikes[550:730])
n_dips = np.sum(dips[550:730])
print(f"  Price spike alerts: {n_spikes} days")
print(f"  Price dip opportunities: {n_dips} days")
print()
print("NEWSVENDOR OPTIMIZATION:")
print(f"  Cost: Rs {nv.cost}/kg, Selling price: Rs {nv.price}/kg, Salvage: Rs {nv.salvage}/kg")
print(f"  Critical ratio: {nv.critical_ratio:.2f}")
print(f"  Optimal order: {Q_star:.1f} kg")
print(f"  Expected daily profit: Rs {nv.expected_profit(Q_star):.0f}")
print(f"  Expected daily waste: {nv.expected_waste(Q_star):.1f} kg ({nv.expected_waste(Q_star)/Q_star*100:.0f}%)")
print()
print("ADAPTIVE STOCKING RECOMMENDATIONS:")
for name, s in scenarios.items():
    nv_s = NewsvendorModel(210, 300, 50, s['mean'], s['std'])
    Q = nv_s.optimal_quantity()
    profit = nv_s.expected_profit(Q)
    print(f"  {name:25s}: order {Q:.0f} kg -> profit Rs {profit:.0f}")`,
      challenge: 'Extend the model to handle multiple products simultaneously: the vendor has a fixed budget of Rs 5000 for morning purchases. How should she allocate across fish, vegetables, and spices to maximize total expected profit? This is a constrained optimization problem (the multi-product newsvendor).',
      successHint: 'Module 4 transforms predictions into decisions. The newsvendor model turns a price forecast into an order quantity. The alert system turns trend analysis into early warnings. This is the bridge between data science and business value.',
    },
    {
      title: 'Dashboard & Decision Support — the complete Market Intelligence System',
      concept: `Module 5 integrates all previous modules into a single dashboard that delivers actionable market intelligence. This is the deployable product — a tool that any Ima Keithel vendor could use (with a simple mobile interface) to make better daily decisions.

The dashboard answers five questions every morning:
1. **What are today's predicted prices?** For each product, the forecast with confidence interval.
2. **Should I stock more or less than usual?** The newsvendor optimal quantity adjusted for today's conditions.
3. **Are any price spikes or dips coming?** 7-day forward alerts for anticipated events.
4. **How did yesterday's predictions perform?** Accuracy tracking builds trust in the system.
5. **What is the monthly outlook?** Seasonal and trend information for medium-term planning.

The system also generates a simple text summary that could be sent as an SMS — critical for vendors who may not have smartphones. Example: "Tomorrow: fish Rs 310-340 (normal), stock 9kg. Wed: Cheiraoba — fish to Rs 400+, stock 14kg. Buy today."

This capstone demonstrates the complete data science pipeline: data collection, feature engineering, exploratory analysis, model building, evaluation, deployment, and communication. The same pipeline applies to any prediction problem — stock prices, weather, demand forecasting, medical diagnosis. The domain changes; the methodology is universal.`,
      analogy: 'The dashboard is a daily newspaper for market intelligence. Just as a newspaper has different sections (front page = today\'s headlines/prices, weather = forecast, sports = performance tracking, opinion = recommendations), our dashboard has panels for each type of information a vendor needs. The key is that every piece of information is actionable — it tells the vendor what to DO, not just what to KNOW.',
      storyConnection: 'The story ends with the girl deciding she will someday take her mother\'s place at Ima Keithel. Our dashboard is the tool she will use — combining her mother\'s decades of intuition with computational precision. She will not replace her mother\'s knowledge; she will augment it. The best market intelligence comes from human experience informed by data, not data alone.',
      checkQuestion: 'A vendor receives the SMS: "Tomorrow: fish Rs 310-340, stock 9kg. Rain expected, actual demand may be lower." She knows from experience that rainy days at Ima Keithel have 30% fewer customers. Should she follow the model\'s recommendation or reduce her order? What does this illustrate about human-AI collaboration?',
      checkAnswer: 'She should reduce her order. The model said "stock 9 kg" based on its features, but its rain feature may not fully capture the customer count effect (it models supply disruption, not demand reduction from fewer shoppers). Her experiential knowledge that rain reduces customers by 30% is additional information. Adjusted order: 9 * 0.7 = 6.3, round to 6 kg. This illustrates that the best decisions combine model predictions with domain expertise. The model handles complex pattern recognition (seasonal trends, festival effects, price persistence); the human handles contextual knowledge (today\'s weather feels worse than the forecast, there\'s a rival market opening nearby). Human + AI > either alone.',
      codeIntro: 'Build the complete integrated dashboard combining all modules into a market intelligence system.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy import stats as scipy_stats

np.random.seed(42)

# ============================================================
# MARKET PRICE PREDICTION MODEL — Complete Dashboard
# ============================================================

class MarketDashboard:
    """Complete Market Intelligence System for Ima Keithel."""

    def __init__(self):
        self.products = {
            'Fresh Fish': {'base': 300, 'cost': 210, 'salvage': 50,
                           'demand_mean': 10, 'demand_std': 3, 'color': '#3b82f6'},
            'King Chilli': {'base': 800, 'cost': 560, 'salvage': 100,
                            'demand_mean': 5, 'demand_std': 2, 'color': '#ef4444'},
            'Vegetables': {'base': 60, 'cost': 36, 'salvage': 5,
                           'demand_mean': 25, 'demand_std': 8, 'color': '#22c55e'},
            'Rice': {'base': 45, 'cost': 38, 'salvage': 35,
                     'demand_mean': 50, 'demand_std': 10, 'color': '#f59e0b'},
        }

    def generate_forecast(self, product, day_of_year, is_festival=False,
                          is_monsoon=False, is_bandh=False):
        p = self.products[product]
        base = p['base']

        # Seasonal effect
        seasonal = 0.15 * np.sin(2*np.pi*(day_of_year-60)/365)
        # Festival
        fest = 0.5 if is_festival else 0
        # Monsoon
        mons = 0.15 if is_monsoon else 0
        # Bandh
        bandh = 0.3 if is_bandh else 0

        predicted = base * (1 + seasonal + fest + mons + bandh)
        # Uncertainty
        std = base * 0.10
        ci_low = predicted - 1.96 * std
        ci_high = predicted + 1.96 * std

        return predicted, ci_low, ci_high, std

    def optimal_stock(self, product, demand_multiplier=1.0):
        p = self.products[product]
        adj_mean = p['demand_mean'] * demand_multiplier
        adj_std = p['demand_std'] * demand_multiplier
        cr = (p['base'] - p['cost']) / (p['base'] - p['salvage'])
        z = scipy_stats.norm.ppf(min(cr, 0.99))
        Q = adj_mean + adj_std * z
        profit = (p['base'] - p['cost']) * adj_mean - (p['cost'] - p['salvage']) * adj_std * scipy_stats.norm.pdf(z)
        return max(1, Q), profit

    def generate_dashboard(self):
        # Current conditions
        today_doy = 105  # mid-April (Cheiraoba season)
        upcoming_festival = True  # Cheiraoba in 3 days

        fig = plt.figure(figsize=(20, 13))
        fig.patch.set_facecolor('#1f2937')
        fig.suptitle('IMA KEITHEL MARKET INTELLIGENCE DASHBOARD\\n'
                     'Date: April 15 | Cheiraoba in 3 days | Weather: Clear',
                     color='white', fontsize=16, fontweight='bold')

        # PANEL 1: Today's price forecast
        ax1 = fig.add_subplot(2, 3, 1)
        ax1.set_facecolor('#111827')
        ax1.tick_params(colors='gray')

        prod_names = list(self.products.keys())
        forecasts = {}
        for prod in prod_names:
            pred, low, high, std = self.generate_forecast(prod, today_doy)
            forecasts[prod] = (pred, low, high)

        y_pos = np.arange(len(prod_names))
        for i, prod in enumerate(prod_names):
            pred, low, high = forecasts[prod]
            color = self.products[prod]['color']
            ax1.barh(i, pred, color=color, alpha=0.7, height=0.5, edgecolor='none')
            ax1.errorbar(pred, i, xerr=[[pred-low], [high-pred]], color='white',
                        capsize=5, capthick=2, linewidth=2)
            ax1.text(high + 5, i, f'Rs {pred:.0f} ({low:.0f}-{high:.0f})',
                    va='center', color='white', fontsize=9)

        ax1.set_yticks(y_pos)
        ax1.set_yticklabels(prod_names, color='white', fontsize=10)
        ax1.set_xlabel('Predicted price (Rs/kg)', color='white')
        ax1.set_title('TODAY\'S PRICE FORECAST', color='#22c55e', fontsize=12, fontweight='bold')

        # PANEL 2: Stocking recommendations
        ax2 = fig.add_subplot(2, 3, 2)
        ax2.set_facecolor('#111827')
        ax2.tick_params(colors='gray')

        scenarios = [('Today (normal)', 1.0), ('Cheiraoba (3 days)', 1.6), ('If bandh', 0.4)]
        x_pos = np.arange(len(prod_names))
        width = 0.25

        for i, (label, mult) in enumerate(scenarios):
            stocks = [self.optimal_stock(p, mult)[0] for p in prod_names]
            offset = (i - 1) * width
            colors_scen = ['#3b82f6', '#ef4444', '#f59e0b']
            ax2.bar(x_pos + offset, stocks, width, color=colors_scen[i],
                   label=label, edgecolor='none', alpha=0.8)
            for j, s in enumerate(stocks):
                ax2.text(j + offset, s + 0.3, f'{s:.0f}', ha='center',
                        color='white', fontsize=7)

        ax2.set_xticks(x_pos)
        ax2.set_xticklabels(prod_names, color='white', fontsize=8)
        ax2.set_ylabel('Optimal order (kg)', color='white')
        ax2.set_title('STOCKING RECOMMENDATIONS', color='#f59e0b', fontsize=12, fontweight='bold')
        ax2.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

        # PANEL 3: 7-day forward alerts
        ax3 = fig.add_subplot(2, 3, 3)
        ax3.set_facecolor('#111827')
        ax3.tick_params(colors='gray')

        next_7_days = np.arange(today_doy, today_doy + 7)
        alerts = ['NORMAL', 'NORMAL', 'PREP', 'FESTIVAL!', 'HIGH', 'SETTLING', 'NORMAL']
        alert_colors = {'NORMAL': '#22c55e', 'PREP': '#f59e0b', 'FESTIVAL!': '#ef4444',
                       'HIGH': '#ef4444', 'SETTLING': '#f59e0b'}

        # Show prices for fish over 7 days
        fish_7day = []
        for d, alert in zip(next_7_days, alerts):
            is_fest = 'FESTIVAL' in alert or alert == 'HIGH'
            pred, _, _, _ = self.generate_forecast('Fresh Fish', d, is_festival=is_fest)
            fish_7day.append(pred)

        bars = ax3.bar(range(7), fish_7day, color=[alert_colors.get(a, '#22c55e') for a in alerts],
                      edgecolor='none')
        day_labels = ['Today', '+1', '+2', '+3\\nCheiraoba', '+4', '+5', '+6']
        ax3.set_xticks(range(7))
        ax3.set_xticklabels(day_labels, color='white', fontsize=8)
        for i, (b, a) in enumerate(zip(bars, alerts)):
            ax3.text(i, fish_7day[i] + 5, a, ha='center', color='white', fontsize=7, fontweight='bold')
        ax3.set_ylabel('Fish price forecast (Rs)', color='white')
        ax3.set_title('7-DAY ALERT CALENDAR', color='#ef4444', fontsize=12, fontweight='bold')

        # PANEL 4: Model accuracy tracker
        ax4 = fig.add_subplot(2, 3, 4)
        ax4.set_facecolor('#111827')
        ax4.tick_params(colors='gray')

        # Simulated accuracy over last 30 days
        last_30 = np.arange(30)
        actual_prices = 300 + 30 * np.random.randn(30)
        predicted_prices = actual_prices + 20 * np.random.randn(30)
        errors = np.abs(actual_prices - predicted_prices) / actual_prices * 100

        ax4.plot(last_30, errors, 'o-', color='#3b82f6', linewidth=1.5, markersize=4)
        ax4.axhline(y=np.mean(errors), color='#f59e0b', linestyle='--',
                    label=f'Mean error: {np.mean(errors):.1f}%')
        ax4.fill_between(last_30, 0, 10, alpha=0.1, color='#22c55e')
        ax4.text(15, 5, 'Good (<10%)', color='#22c55e', fontsize=9, ha='center')
        ax4.set_xlabel('Days ago', color='white')
        ax4.set_ylabel('Prediction error (%)', color='white')
        ax4.set_title('MODEL ACCURACY (last 30 days)', color='#3b82f6', fontsize=12, fontweight='bold')
        ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

        # PANEL 5: Monthly profit projection
        ax5 = fig.add_subplot(2, 3, 5)
        ax5.set_facecolor('#111827')
        ax5.tick_params(colors='gray')

        months_future = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
        demand_mults = [1.2, 1.0, 0.8, 0.7, 0.75, 0.9]  # seasonal demand
        price_mults = [1.1, 1.0, 1.15, 1.20, 1.15, 1.0]  # seasonal pricing

        monthly_profits = []
        for dm, pm in zip(demand_mults, price_mults):
            total_profit = 0
            for prod in prod_names:
                Q, profit = self.optimal_stock(prod, dm)
                total_profit += profit * 26 * pm  # 26 market days
            monthly_profits.append(total_profit)

        colors_monthly = ['#22c55e' if p > np.mean(monthly_profits) else '#f59e0b' for p in monthly_profits]
        ax5.bar(months_future, np.array(monthly_profits)/1000, color=colors_monthly, edgecolor='none')
        for i, p in enumerate(monthly_profits):
            ax5.text(i, p/1000 + 0.5, f'Rs {p/1000:.0f}k', ha='center', color='white', fontsize=9)
        ax5.set_ylabel('Monthly profit (Rs thousands)', color='white')
        ax5.set_title('6-MONTH PROFIT PROJECTION', color='#a855f7', fontsize=12, fontweight='bold')
        ax5.tick_params(axis='x', labelcolor='white')

        # PANEL 6: SMS summary
        ax6 = fig.add_subplot(2, 3, 6)
        ax6.set_facecolor('#111827')
        ax6.axis('off')

        sms_text = """SMS ALERT FOR VENDORS
====================================
Today (Apr 15):
  Fish: Rs310 (stock 9kg)
  Chilli: Rs800 (stock 5kg)
  Vegetables: Rs65 (stock 22kg)
  Rice: Rs47 (stock 48kg)

ALERT: Cheiraoba in 3 days!
  Fish will reach Rs400+
  Stock 14kg fish on Apr 17
  Chilli will reach Rs1100+
  Stock 8kg chilli on Apr 17

Weather: Clear all week
No bandh expected

Monthly tip: Monsoon starts Jun.
Build ice box inventory now.
====================================
Powered by Market Intelligence v1.0
"""
        ax6.text(0.05, 0.95, sms_text, transform=ax6.transAxes,
                fontfamily='monospace', fontsize=8, color='#22c55e',
                verticalalignment='top',
                bbox=dict(boxstyle='round', facecolor='#0a0a0a', alpha=0.9, edgecolor='#22c55e'))

        plt.tight_layout(rect=[0, 0, 1, 0.92])
        plt.show()

# --- Run dashboard ---
dashboard = MarketDashboard()
dashboard.generate_dashboard()

# Print comprehensive report
print("=" * 70)
print("MARKET PRICE PREDICTION MODEL — DAILY INTELLIGENCE REPORT")
print("=" * 70)
print()
print("Date: April 15 | Market: Ima Keithel, Imphal")
print("Upcoming: Cheiraoba (Manipur New Year) on April 18")
print()
print("TODAY'S FORECAST & RECOMMENDATIONS")
print("-" * 70)
for prod in dashboard.products:
    pred, low, high, _ = dashboard.generate_forecast(prod, 105)
    Q, profit = dashboard.optimal_stock(prod)
    Q_fest, profit_fest = dashboard.optimal_stock(prod, 1.6)
    p = dashboard.products[prod]
    print(f"  {prod:15s}: Rs {pred:.0f} (CI: {low:.0f}-{high:.0f})")
    print(f"    Stock today: {Q:.0f} kg | Expected profit: Rs {profit:.0f}")
    print(f"    Stock for Cheiraoba: {Q_fest:.0f} kg | Expected profit: Rs {profit_fest:.0f}")
    print()

print("7-DAY OUTLOOK")
print("  Days 1-2: Normal prices, normal stocking")
print("  Day 3: START STOCKING FOR FESTIVAL (+60% order)")
print("  Day 4: CHEIRAOBA — peak prices, maximum stocking")
print("  Days 5-6: Prices settling, reduce to normal")
print()
print("SEASONAL ADVISORY")
print("  Monsoon begins in ~6 weeks. Invest in cold chain now.")
print("  Rs 200 thermocol box + Rs 45/day ice = Rs 1100/day extra revenue.")
print()
print("SYSTEM STATUS")
print("  Model accuracy (30-day MAPE): ~8%")
print("  Data freshness: real-time (updated daily)")
print("  Next model retrain: May 1")
print()
print("Report generated by Market Intelligence System v1.0")
print("Built from: data engineering, statistical modeling,")
print("operations research, and food science.")`,
      challenge: 'Build a multi-vendor version: 5 fish vendors in the same row compete for customers. Each vendor uses the model but with different risk tolerances (some stock aggressively, some conservatively). Simulate 30 market days and show how competition affects profits and optimal strategies.',
      successHint: 'You have built a complete market intelligence system from first principles. It integrates economics (supply/demand), food science (cold chain), operations research (newsvendor), statistics (forecasting), and communication design (dashboard). This is portfolio-quality work that demonstrates full-stack data science thinking — from raw data to actionable decisions delivered via SMS to women vendors at Ima Keithel.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (market economics foundations)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Market Price Prediction Model. Click to start.</p>
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
