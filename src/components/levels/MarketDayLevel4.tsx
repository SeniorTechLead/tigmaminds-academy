import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MarketDayLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone — Build a Market Price Predictor using seasonal regression',
      concept: `In this capstone you will build a market price prediction model that forecasts commodity prices for the Tura market. The model combines trend analysis, seasonal decomposition, and regression to predict next-month prices for multiple goods simultaneously.

You will implement: (1) Seasonal decomposition using moving averages to extract trend, seasonal, and residual components. (2) A regression model with features including month-of-year (one-hot encoded), lagged prices (last 1, 3, 6 months), rainfall proxy, and festival indicators. (3) Multi-output prediction for 4 goods simultaneously. (4) Confidence intervals using residual standard deviation.

The model learns that ginger prices spike during monsoon (supply disruption) and oranges are cheapest during harvest (November-January). Cross-commodity correlations emerge too: when transport costs rise (monsoon road damage), all goods prices increase together. The prediction helps farmers decide when to sell and buyers when to stock up — turning market intuition into quantified forecasts.`,
      analogy: 'A market price predictor is like a weather forecast for economics. Just as meteorologists use past temperature patterns, seasonal cycles, and current conditions to predict tomorrow\'s weather, your model uses past prices, seasonal patterns, and current conditions to predict next month\'s market prices. Both are imperfect — random shocks are unpredictable — but the systematic patterns are surprisingly forecastable.',
      storyConnection: 'The vendors at Tura market use intuition built over years to anticipate price movements — storing ginger when cheap, selling when expensive. Your predictor formalizes this intuition into a mathematical model, learning the same patterns from historical data. The model\'s seasonal coefficients are the mathematical equivalent of the experienced vendor\'s gut feeling about when prices will rise or fall.',
      checkQuestion: 'Your model predicts ginger price will increase 25% next month (monsoon approaching). The 95% confidence interval is 15-35%. A farmer has 100 kg in storage. Should they sell now at Rs 38/kg or wait? What additional information would narrow the confidence interval?',
      checkAnswer: 'Expected price next month: Rs 38 x 1.25 = Rs 47.50/kg. At 15% increase (lower bound): Rs 43.70. At 35% increase (upper bound): Rs 51.30. Expected gain from waiting: Rs 9.50/kg x 100 kg = Rs 950. But there\'s storage cost and spoilage risk. If storage is Rs 2/kg/month and 5% spoilage expected: net gain = 95 x 47.50 - 100 x 38 - 100 x 2 = Rs 4512.50 - 3800 - 200 = Rs 512.50. Worth waiting. Narrowing CI: recent rainfall data, road condition reports, and this year\'s planting area data would all improve the forecast.',
      codeIntro: 'Build a multi-commodity price prediction model with seasonal features, evaluate forecast accuracy, and generate actionable trading signals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 5 years of monthly price data for 4 goods
n_months = 60
t = np.arange(n_months)
months = t % 12

def gen_prices(base, trend, s_amp, s_phase, noise):
    tr = base * (1 + trend * t / 12)
    ss = s_amp * np.sin(2 * np.pi * (t - s_phase) / 12)
    return tr + ss + np.random.normal(0, noise, n_months)

goods = ['Ginger', 'Rice', 'Oranges', 'Bamboo']
bases = [40, 25, 20, 15]
trends = [0.05, 0.03, 0.02, 0.04]
amps = [15, 3, 10, 12]
phases = [5, 2, 10, 6]
noises = [5, 2, 3, 4]
prices = np.column_stack([gen_prices(b, tr, a, p, n) for b, tr, a, p, n in zip(bases, trends, amps, phases, noises)])
prices = np.maximum(prices, 5)

# Build feature matrix
month_onehot = np.eye(12)[months]
lag1 = np.vstack([prices[0], prices[:-1]])
lag3 = np.vstack([prices[:3].mean(axis=0)] * 3 + [np.array([prices[max(0,i-3):i].mean(axis=0) for i in range(3, n_months)])])
if lag3.ndim == 1:
    lag3 = lag3.reshape(-1, 4)
rainfall = 0.5 + 0.5 * np.sin(2 * np.pi * (t - 6) / 12)
X = np.column_stack([month_onehot, lag1, rainfall])
X_design = np.column_stack([np.ones(n_months), X])

# Train on first 48 months, test on last 12
n_train = 48
X_train, X_test = X_design[:n_train], X_design[n_train:]
Y_train, Y_test = prices[:n_train], prices[n_train:]

# Fit multivariate regression
betas = np.linalg.lstsq(X_train, Y_train, rcond=None)[0]
Y_pred_train = X_train @ betas
Y_pred_test = X_test @ betas
residuals = Y_test - Y_pred_test

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')
colors = ['#ef4444', '#22c55e', '#f59e0b', '#3b82f6']

# Plot 1: Price predictions vs actual
ax = axes[0, 0]
ax.set_facecolor('#111827')
test_t = np.arange(n_train, n_months)
for i, (name, color) in enumerate(zip(goods, colors)):
    ax.plot(t[:n_train], prices[:n_train, i], color=color, linewidth=1, alpha=0.4)
    ax.plot(test_t, Y_test[:, i], 'o', color=color, markersize=5, label=f'{name} actual')
    ax.plot(test_t, Y_pred_test[:, i], '-', color=color, linewidth=2)
    std_res = np.std(Y_train[:, i] - Y_pred_train[:, i])
    ax.fill_between(test_t, Y_pred_test[:, i] - 2*std_res, Y_pred_test[:, i] + 2*std_res, alpha=0.15, color=color)
ax.axvline(n_train, color='white', linewidth=1, linestyle='--')
ax.text(n_train + 1, max(prices.max(axis=1)) * 0.95, 'Forecast\
period', color='white', fontsize=9)
ax.set_xlabel('Month', color='white')
ax.set_ylabel('Price (Rs/kg)', color='white')
ax.set_title('Price Forecast vs Actual (12-month test)', color='white', fontsize=11, fontweight='bold')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=2)
ax.tick_params(colors='gray')

# Plot 2: Forecast accuracy by good
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
mapes = [np.mean(np.abs(residuals[:, i]) / Y_test[:, i]) * 100 for i in range(4)]
r2s = [1 - np.sum(residuals[:, i]**2) / np.sum((Y_test[:, i] - Y_test[:, i].mean())**2) for i in range(4)]
x_pos = np.arange(4)
width = 0.35
ax2.bar(x_pos - width/2, mapes, width, color=colors, alpha=0.8, label='MAPE (%)')
ax2_twin = ax2.twinx()
ax2_twin.bar(x_pos + width/2, r2s, width, color=colors, alpha=0.4, edgecolor=colors, linewidth=2)
ax2.set_xticks(x_pos)
ax2.set_xticklabels(goods)
ax2.set_ylabel('MAPE (%)', color='white')
ax2_twin.set_ylabel('R-squared', color='white')
ax2.set_title('Forecast Accuracy by Commodity', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='gray')

# Plot 3: Seasonal coefficients
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
seasonal_coefs = betas[1:13, :]  # month one-hot coefficients
for i, (name, color) in enumerate(zip(goods, colors)):
    ax3.plot(range(12), seasonal_coefs[:, i], 'o-', color=color, linewidth=2, label=name)
ax3.axhline(0, color='gray', linewidth=0.5)
ax3.set_xticks(range(12))
ax3.set_xticklabels(month_names, fontsize=7)
ax3.set_xlabel('Month', color='white')
ax3.set_ylabel('Seasonal price effect (Rs)', color='white')
ax3.set_title('Learned Seasonal Patterns', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Trading signals
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ginger_pred = Y_pred_test[:, 0]
ginger_actual = Y_test[:, 0]
buy_signal = np.diff(ginger_pred) > 0  # price going up = buy now
sell_signal = np.diff(ginger_pred) < 0
for i in range(len(buy_signal)):
    if buy_signal[i]:
        ax4.axvspan(test_t[i], test_t[i+1], alpha=0.2, color='#22c55e')
    else:
        ax4.axvspan(test_t[i], test_t[i+1], alpha=0.2, color='#ef4444')
ax4.plot(test_t, ginger_actual, 'o-', color='white', linewidth=2, label='Ginger actual')
ax4.plot(test_t, ginger_pred, '--', color='#fbbf24', linewidth=2, label='Predicted')
ax4.set_xlabel('Month', color='white')
ax4.set_ylabel('Ginger price (Rs/kg)', color='white')
ax4.set_title('Trading Signals: Green=Buy, Red=Sell', color='white', fontsize=11, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 65)
print("    MARKET PRICE PREDICTOR — CAPSTONE REPORT")
print("=" * 65)
print(f"\
Model: Multivariate regression with seasonal + lag features")
print(f"Training: {n_train} months, Testing: {n_months - n_train} months")
for i, name in enumerate(goods):
    print(f"\
{name}:")
    print(f"  MAPE: {mapes[i]:.1f}%")
    print(f"  R-squared: {r2s[i]:.3f}")
    print(f"  Best month to buy: {month_names[np.argmin(seasonal_coefs[:, i])]}")
    print(f"  Best month to sell: {month_names[np.argmax(seasonal_coefs[:, i])]}")`,
      challenge: 'Extend the model to include cross-commodity correlations: use a VAR (vector autoregression) model where each good\'s price depends on lagged values of ALL goods. Show how a rice price shock propagates to other commodities.',
      successHint: 'You have built a complete market price forecasting system — turning seasonal intuition into quantified predictions with confidence intervals. This model could help every farmer and vendor at the Tura market make better economic decisions.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Market Price Predictor using time series regression</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib. Click to start.</p>
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
