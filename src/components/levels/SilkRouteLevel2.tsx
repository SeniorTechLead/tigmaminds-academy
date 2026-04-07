import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SilkRouteLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'GDP and economic indicators — measuring an economy',
      concept: `**GDP** (Gross Domestic Product) is the total value of all goods and services produced in a country in a year. It is the single most widely used measure of economic size and health.

**Three ways to calculate GDP** (all give the same answer):
- **Production approach**: sum of value added at each stage of production
- **Income approach**: sum of all wages, profits, rents, and interest
- **Expenditure approach**: C + I + G + (X - M)
  - C = Consumer spending
  - I = Business investment
  - G = Government spending
  - X = Exports, M = Imports

**GDP per capita** (GDP / population) is a better measure of living standards. India's GDP is $3.7 trillion (5th largest), but GDP per capita is ~$2,500 (139th), because 1.4 billion people share that output.

**Other key indicators:**
- **Inflation rate**: how fast prices are rising (measured by CPI)
- **Unemployment rate**: percentage of labor force without jobs
- **HDI** (Human Development Index): combines income, education, and life expectancy
- **Gini coefficient**: measures income inequality (0 = perfect equality, 1 = one person has everything)`,
      analogy: 'GDP is like the total score in a cricket match — it tells you the overall output but not how well individual batsmen played. GDP per capita is like the average runs per batsman. And the Gini coefficient is like measuring whether one batsman scored all the runs while the rest got out for ducks.',
      storyConnection: 'The silk route kingdoms measured wealth differently — in granary stores, in military strength, in temple gold. GDP is the modern version: a single number that captures a nation\'s economic output. The ancient Kamrupa kingdom (Assam) was "wealthy" in silk and rice, but without GDP accounting, we can only estimate its economic size from archaeological remains.',
      checkQuestion: 'Country A has GDP of $1 trillion and population of 50 million. Country B has GDP of $500 billion and population of 10 million. Which country\'s citizens are wealthier on average?',
      checkAnswer: 'Country B. GDP per capita: A = $1T / 50M = $20,000. B = $500B / 10M = $50,000. B\'s citizens are 2.5x wealthier on average, despite the economy being half the total size. This is why GDP per capita matters more than raw GDP for measuring living standards.',
      codeIntro: 'Visualize GDP composition and compare economies across multiple indicators.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# GDP composition for selected countries (approximate 2023 data, % of GDP)
countries = ['India', 'China', 'USA', 'Germany', 'Japan']
consumption = [60, 38, 68, 52, 55]
investment = [28, 43, 18, 21, 24]
government = [12, 16, 17, 20, 20]
net_exports = [0, 3, -3, 7, 1]  # X - M

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Stacked bar: GDP composition
ax1.set_facecolor('#111827')
x = np.arange(len(countries))
w = 0.6
p1 = ax1.bar(x, consumption, w, color='#22c55e', label='Consumption (C)')
p2 = ax1.bar(x, investment, w, bottom=consumption, color='#3b82f6', label='Investment (I)')
p3 = ax1.bar(x, government, w, bottom=np.array(consumption)+np.array(investment), color='#f59e0b', label='Government (G)')

ax1.set_xticks(x)
ax1.set_xticklabels(countries, color='white')
ax1.set_ylabel('% of GDP', color='white')
ax1.set_title('GDP Composition by Expenditure', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Multi-indicator comparison (normalized to 0-1)
indicators = {
    'GDP per capita ($K)': [2.5, 12.7, 76.3, 51.4, 33.8],
    'HDI': [0.633, 0.768, 0.921, 0.942, 0.925],
    'Gini': [0.357, 0.382, 0.398, 0.317, 0.329],
    'Growth rate (%)': [6.5, 5.2, 2.1, 0.3, 1.9],
}

ax2.set_facecolor('#111827')
indicator_names = list(indicators.keys())
n_ind = len(indicator_names)
n_countries = len(countries)
bar_width = 0.15
colors_c = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#a855f7']

for i, (country, color) in enumerate(zip(countries, colors_c)):
    vals = [indicators[ind][i] for ind in indicator_names]
    # Normalize each indicator to 0-1 range for comparison
    max_vals = [max(indicators[ind]) for ind in indicator_names]
    norm_vals = [v/m if m > 0 else 0 for v, m in zip(vals, max_vals)]
    positions = np.arange(n_ind) + i * bar_width
    ax2.bar(positions, norm_vals, bar_width, color=color, label=country, alpha=0.8)

ax2.set_xticks(np.arange(n_ind) + bar_width * 2)
ax2.set_xticklabels(indicator_names, color='white', fontsize=8, rotation=10)
ax2.set_ylabel('Normalized value (0-1)', color='white')
ax2.set_title('Economic Indicators Comparison', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key takeaways:")
print("  China: high investment (43%) drives growth; relatively low consumption")
print("  USA: consumption-driven (68%); trade deficit (imports > exports)")
print("  India: fastest growth (6.5%) but lowest GDP per capita ($2,500)")
print("  Germany: high net exports (7%) — export powerhouse")
print()
print("GDP alone doesn't capture well-being.")
print("HDI adds education and health. Gini measures equality.")
print("A good economy scores well on ALL indicators, not just GDP.")`,
      challenge: 'India\'s GDP grows at 6.5% per year. Starting from $3.7 trillion, how many years until it reaches $10 trillion? Use the compound growth formula: years = ln(target/start) / ln(1 + rate). Plot the growth curve.',
      successHint: 'Economic indicators are the dashboard of a nation. GDP is the speedometer, inflation is the temperature gauge, unemployment is the fuel level, and inequality is the engine health. You need all of them to understand how the economy is actually performing.',
    },
    {
      title: 'Trade balance — who sells more than they buy?',
      concept: `The **trade balance** is the difference between a country's exports and imports:
- **Trade surplus**: exports > imports (you sell more than you buy)
- **Trade deficit**: imports > exports (you buy more than you sell)

A trade deficit is NOT necessarily bad. The US has run a trade deficit for decades while remaining the world's richest country. A deficit means a country is consuming more than it produces — which is fine if it's investing the imports productively.

**Balance of payments** is the complete picture:
- **Current account**: trade in goods + services + income from abroad
- **Capital account**: foreign investment in/out of the country
- **Financial account**: changes in foreign reserves

By definition: Current Account + Capital Account + Financial Account = 0
A trade deficit must be balanced by a capital surplus (foreigners investing in your country).

**India's trade:**
- Exports: IT services ($194B), petroleum products, textiles, pharmaceuticals
- Imports: crude oil ($210B), electronics, gold, machinery
- Trade deficit: ~$250 billion (2023)
- Partially offset by IT service exports and remittances`,
      analogy: 'A trade balance is like a household budget. If you spend more than you earn (deficit), you must borrow or sell assets. If you earn more than you spend (surplus), you save or invest. Neither is inherently good or bad — it depends on whether the spending is on productive investments (education, tools) or consumption (luxury goods).',
      storyConnection: 'The silk route kingdoms naturally ran trade surpluses or deficits with each other. Assam exported silk but imported salt — a trade deficit in salt, surplus in silk. The balance was maintained through commodity money and barter. When the balance tilted too far, routes would shift, new goods would enter trade, and equilibrium would restore.',
      checkQuestion: 'Germany has a large trade surplus. China has a large trade surplus. The US has a large trade deficit. Why might the US actually prefer this arrangement?',
      checkAnswer: 'The US trade deficit means Americans consume more imported goods (cheaper, more variety). The dollars that flow out return as foreign investment — Germany and China buy US Treasury bonds, stocks, and real estate. This capital inflow funds US innovation and keeps interest rates low. The US essentially trades pieces of paper (dollars, bonds) for real goods — a remarkable deal as long as the dollar remains the world\'s reserve currency.',
      codeIntro: 'Visualize trade balances and how they flow between countries.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Trade balance data (approximate 2023, billions USD)
countries = ['China', 'Germany', 'Japan', 'S. Korea', 'India', 'USA', 'UK', 'France']
exports = [3380, 1810, 756, 632, 453, 2020, 468, 617]
imports = [2560, 1370, 785, 632, 714, 3150, 690, 713]
balance = [e - i for e, i in zip(exports, imports)]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Trade balance bar chart
ax1.set_facecolor('#111827')
colors_bal = ['#22c55e' if b >= 0 else '#ef4444' for b in balance]
bars = ax1.bar(countries, balance, color=colors_bal, edgecolor='none')
ax1.axhline(0, color='#6b7280', linewidth=1)
ax1.set_ylabel('Trade balance (B USD)', color='white')
ax1.set_title('Trade Balances: Surplus vs Deficit Countries (2023)', color='white', fontsize=13)
ax1.tick_params(colors='gray')
plt.setp(ax1.get_xticklabels(), color='white')

for bar, val in zip(bars, balance):
    ax1.text(bar.get_x() + bar.get_width()/2,
            bar.get_height() + (20 if val >= 0 else -40),
            f'{"+" if val >= 0 else ""}{val}B', ha='center', color='white', fontsize=9)

# Trade flow visualization (simplified bilateral flows)
ax2.set_facecolor('#111827')
flow_data = {
    'China→USA': 500, 'USA→China': 150,
    'China→EU': 400, 'EU→China': 250,
    'India→USA': 80, 'USA→India': 40,
    'India→EU': 60, 'EU→India': 50,
    'Japan→USA': 130, 'USA→Japan': 75,
}

flows = list(flow_data.items())
y_positions = range(len(flows))
values = [v for _, v in flows]
flow_labels = [k for k, _ in flows]
flow_colors = ['#22c55e' if '→USA' in k or '→EU' in k else '#3b82f6' for k, _ in flows]

ax2.barh(y_positions, values, color=flow_colors, edgecolor='none', height=0.6)
ax2.set_yticks(y_positions)
ax2.set_yticklabels(flow_labels, color='white', fontsize=9)
ax2.set_xlabel('Trade flow (B USD)', color='white')
ax2.set_title('Major Bilateral Trade Flows', color='white', fontsize=11)
ax2.tick_params(colors='gray')

for i, v in enumerate(values):
    ax2.text(v + 5, i, f'{v}B', color='white', fontsize=9, va='center')

plt.tight_layout()
plt.show()

print("Key patterns:")
print("  China: world's largest trade surplus (+$820B)")
print("  USA:   world's largest trade deficit (-$1,130B)")
print("  India: significant deficit (-$261B), mostly from oil imports")
print()
print("Trade isn't zero-sum. Global trade creates value.")
print("The deficit/surplus is about FLOW DIRECTION, not winning/losing.")`,
      challenge: 'Calculate what would happen to India\'s trade balance if it eliminated oil imports (by switching to renewables). Oil imports ≈ $210B. Would India have a surplus or deficit? What would this mean for the rupee?',
      successHint: 'Trade balances are the scoreboard of international economics. But unlike a cricket score, a deficit doesn\'t mean you\'re losing. What matters is what you do with the imports — invest them productively, and a deficit can power growth.',
    },
    {
      title: 'Exchange rates — the price of money itself',
      concept: `An **exchange rate** is the price of one currency in terms of another. When you trade internationally, you need to convert currencies, and the exchange rate determines the cost.

**1 USD ≈ 83 INR** (2024). This means it takes 83 rupees to buy one US dollar.

**What determines exchange rates:**
- **Interest rates**: higher rates attract foreign capital → currency strengthens
- **Inflation**: higher inflation → currency weakens (purchasing power drops)
- **Trade balance**: trade surplus → currency strengthens (demand for your currency)
- **Speculation**: traders betting on future currency movements

**Types of exchange rate systems:**
- **Floating**: market determines the rate (USD, EUR, GBP)
- **Managed float**: central bank intervenes occasionally (INR, CNY)
- **Fixed**: pegged to another currency (Hong Kong dollar pegged to USD)

**Real-world impact:**
- Weak rupee: Indian exports become cheaper (good for exporters), imports become expensive (bad for oil, electronics)
- Strong rupee: imports are cheap, but exports suffer
- The silk route traders faced the same problem: exchange rates between muga silk and Tibetan salt fluctuated based on season, supply, and political stability`,
      analogy: 'An exchange rate is like the conversion rate between different types of measurement. Just as 1 mile = 1.6 kilometers, 1 USD = 83 INR. But unlike miles and kilometers, exchange rates change daily — as if the metric system kept shifting. Traders must constantly recalculate.',
      storyConnection: 'On the ancient silk route, there was no fixed exchange rate between muga silk and salt. The "rate" depended on how many traders had arrived that season, how harsh the winter was (driving salt demand), and how much silk had been produced. Modern exchange rate markets work the same way but with billions of participants instead of dozens.',
      checkQuestion: 'An Indian software company earns $1 million in revenue from a US client. If the rupee weakens from 80 to 85 per dollar, does the company gain or lose? By how much?',
      checkAnswer: 'The company gains. At 80 INR/USD: revenue = ₹80 million. At 85 INR/USD: revenue = ₹85 million. The company gains ₹5 million without doing any extra work. This is why Indian IT companies benefit from a weak rupee — their costs are in rupees but revenue is in dollars.',
      codeIntro: 'Model exchange rate dynamics and their impact on trade.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate INR/USD exchange rate over 2 years (simplified random walk with drift)
days = 500
daily_returns = np.random.normal(0.0001, 0.005, days)  # slight depreciation bias

# Add some events
daily_returns[100] -= 0.02  # oil price shock (rupee weakens)
daily_returns[250] += 0.015  # strong GDP report (rupee strengthens)
daily_returns[400] -= 0.01  # global risk-off (rupee weakens)

rate = np.zeros(days)
rate[0] = 82.0  # starting rate
for i in range(1, days):
    rate[i] = rate[i-1] * (1 + daily_returns[i])

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Exchange rate over time
ax1.set_facecolor('#111827')
ax1.plot(range(days), rate, color='#22c55e', linewidth=1.5)
ax1.fill_between(range(days), rate, rate[0], where=rate > rate[0], alpha=0.1, color='#ef4444')
ax1.fill_between(range(days), rate, rate[0], where=rate < rate[0], alpha=0.1, color='#22c55e')
ax1.axhline(rate[0], color='#6b7280', linestyle='--', linewidth=0.5)

# Mark events
events = [(100, 'Oil shock', '#ef4444'), (250, 'Strong GDP', '#22c55e'), (400, 'Risk-off', '#f59e0b')]
for day, label, color in events:
    ax1.axvline(day, color=color, linestyle=':', alpha=0.7)
    ax1.text(day, ax1.get_ylim()[1]*0.98, label, color=color, fontsize=8, ha='center')

ax1.set_ylabel('INR per USD', color='white')
ax1.set_title('Simulated INR/USD Exchange Rate (2 years)', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.text(days*0.02, rate[0]+1, '↑ Weaker rupee', color='#ef4444', fontsize=9)
ax1.text(days*0.02, rate[0]-1, '↓ Stronger rupee', color='#22c55e', fontsize=9)

# Impact on trade: export revenue in INR for $1M USD contract
ax2.set_facecolor('#111827')
usd_revenue = 1_000_000  # $1M USD
inr_revenue = rate * usd_revenue / 1e6  # in crores
ax2.plot(range(days), inr_revenue, color='#3b82f6', linewidth=1.5)
ax2.fill_between(range(days), inr_revenue, inr_revenue[0], where=inr_revenue > inr_revenue[0],
                alpha=0.15, color='#22c55e', label='Gain from weak rupee')
ax2.fill_between(range(days), inr_revenue, inr_revenue[0], where=inr_revenue < inr_revenue[0],
                alpha=0.15, color='#ef4444', label='Loss from strong rupee')
ax2.axhline(inr_revenue[0], color='#6b7280', linestyle='--', linewidth=0.5)
ax2.set_xlabel('Trading days', color='white')
ax2.set_ylabel('Revenue (₹ crores for $1M)', color='white')
ax2.set_title('Export Revenue Impact: Same $1M Contract, Changing Exchange Rate', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Exchange rate range: {rate.min():.2f} - {rate.max():.2f} INR/USD")
print(f"Starting: {rate[0]:.2f}, Ending: {rate[-1]:.2f}")
print(f"Change: {((rate[-1]/rate[0])-1)*100:+.1f}%")
print()
print(f"Impact on $1M export contract:")
print(f"  At start ({rate[0]:.0f} INR/USD): ₹{rate[0]/10:.1f} lakh")
print(f"  At end   ({rate[-1]:.0f} INR/USD): ₹{rate[-1]/10:.1f} lakh")
print(f"  Difference: ₹{(rate[-1]-rate[0])/10:+.1f} lakh — just from exchange rate!")`,
      challenge: 'Add a "hedging" strategy: the company buys a forward contract that locks in the exchange rate at 83 INR/USD for 6 months. Plot the hedged vs. unhedged revenue. When does hedging help and when does it hurt?',
      successHint: 'Exchange rates are the hidden variable in every international transaction. The silk route traders managed currency risk by carrying multiple commodities. Modern companies use financial instruments. The problem is the same; the tools have evolved.',
    },
    {
      title: 'Modeling trade flows — the gravity model of trade',
      concept: `The **gravity model of trade** is one of the most successful empirical models in economics. It predicts trade between two countries using the same logic as Newton's law of gravity:

**Trade(A,B) = G × GDP(A) × GDP(B) / Distance(A,B)²**

Where:
- Trade increases with the economic size of both countries (bigger economies trade more)
- Trade decreases with distance (farther apart = less trade)
- G is a constant that captures other factors

This model, despite its simplicity, explains about 80% of variation in bilateral trade flows. The remaining 20% comes from:
- **Language**: shared language increases trade by ~50%
- **Colonial history**: former colonial ties boost trade
- **Trade agreements**: FTAs reduce barriers
- **Border effects**: crossing a border reduces trade significantly (even without tariffs)

The gravity model works because:
- Large economies produce more goods to export AND have more purchasing power to import
- Distance is a proxy for transportation costs, time zones, cultural distance, and information barriers

This is the same physics that governed the silk route: Kamrupa (Assam) traded most with nearby Bengal, less with distant Tibet, and the volume depended on both kingdoms' wealth.`,
      analogy: 'Just as planets with more mass exert more gravitational pull on each other, countries with bigger economies exert more "trade pull." And just as gravity weakens with distance, trade weakens as countries are farther apart. The economic universe obeys similar laws to the physical universe.',
      storyConnection: 'The silk route connected Assam (medium economy, high silk output) to Tibet (medium economy, high salt output) across a large distance (high mountains). The gravity model predicts moderate trade volume — high enough to justify the journey for luxury goods, but not for bulk commodities. This is exactly what the historical record shows.',
      checkQuestion: 'According to the gravity model, should India trade more with China (GDP $18T, 3,000 km away) or Germany (GDP $4T, 6,500 km away)?',
      checkAnswer: 'Gravity model predicts: India-China trade ∝ GDP_India × 18 / 3000² = 18/9M. India-Germany trade ∝ GDP_India × 4 / 6500² = 4/42.25M. The India-China ratio is about 47x larger. In reality, China is India\'s 2nd largest trade partner; Germany is 8th. The model works.',
      codeIntro: 'Implement the gravity model and test it against real trade data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Gravity model: Trade = G * GDP_i * GDP_j / Distance^2
# Test with India's trade partners

partners = {
    'China': {'gdp': 17.8, 'dist': 3000, 'actual_trade': 118},
    'USA': {'gdp': 25.5, 'dist': 13500, 'actual_trade': 128},
    'UAE': {'gdp': 0.5, 'dist': 2800, 'actual_trade': 84},
    'Saudi': {'gdp': 1.1, 'dist': 3500, 'actual_trade': 53},
    'Germany': {'gdp': 4.1, 'dist': 6500, 'actual_trade': 28},
    'S. Korea': {'gdp': 1.7, 'dist': 5200, 'actual_trade': 25},
    'Japan': {'gdp': 4.2, 'dist': 5800, 'actual_trade': 21},
    'UK': {'gdp': 3.1, 'dist': 7700, 'actual_trade': 18},
    'Singapore': {'gdp': 0.4, 'dist': 3900, 'actual_trade': 27},
    'Australia': {'gdp': 1.7, 'dist': 7800, 'actual_trade': 16},
}

india_gdp = 3.7  # trillion USD
names = list(partners.keys())
gdps = [partners[n]['gdp'] for n in names]
dists = [partners[n]['dist'] for n in names]
actual = [partners[n]['actual_trade'] for n in names]

# Calculate gravity model prediction
gravity_raw = [india_gdp * g / (d/1000)**2 for g, d in zip(gdps, dists)]
# Scale to match actual trade magnitude
scale = np.mean(actual) / np.mean(gravity_raw)
predicted = [g * scale for g in gravity_raw]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Predicted vs Actual
ax1.set_facecolor('#111827')
ax1.scatter(actual, predicted, s=100, color='#22c55e', zorder=5)
for i, name in enumerate(names):
    ax1.annotate(name, xy=(actual[i], predicted[i]), xytext=(5, 5),
                textcoords='offset points', color='white', fontsize=8)

# Perfect prediction line
max_val = max(max(actual), max(predicted)) * 1.1
ax1.plot([0, max_val], [0, max_val], '--', color='#f59e0b', linewidth=1, label='Perfect prediction')
ax1.set_xlabel('Actual trade (B USD)', color='white')
ax1.set_ylabel('Gravity model prediction (B USD)', color='white')
ax1.set_title('Gravity Model: Predicted vs Actual Trade', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# R-squared
ss_res = sum((a - p)**2 for a, p in zip(actual, predicted))
ss_tot = sum((a - np.mean(actual))**2 for a in actual)
r_squared = 1 - ss_res / ss_tot
ax1.text(0.05, 0.95, f'R² = {r_squared:.2f}', transform=ax1.transAxes,
        color='#f59e0b', fontsize=12, va='top')

# Distance vs trade
ax2.set_facecolor('#111827')
ax2.scatter(dists, actual, s=[g*30 for g in gdps], color='#3b82f6', alpha=0.7, zorder=5)
for i, name in enumerate(names):
    ax2.annotate(name, xy=(dists[i], actual[i]), xytext=(5, 5),
                textcoords='offset points', color='white', fontsize=8)

# Fit curve
d_range = np.linspace(min(dists), max(dists), 100)
# Average GDP partner
avg_gdp = np.mean(gdps)
fit_trade = scale * india_gdp * avg_gdp / (d_range/1000)**2
ax2.plot(d_range, fit_trade, '--', color='#f59e0b', linewidth=1, label='Gravity decay (avg GDP)')

ax2.set_xlabel('Distance from India (km)', color='white')
ax2.set_ylabel('Actual trade (B USD)', color='white')
ax2.set_title('Trade vs Distance (bubble size = partner GDP)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Gravity Model R² = {r_squared:.2f}")
print(f"  The model explains {r_squared*100:.0f}% of trade variation")
print()
print("Notable outliers:")
print("  UAE: trades MORE than predicted (oil imports)")
print("  USA: trades MORE than predicted (IT services, diaspora)")
print("  China: trades LESS than predicted (political barriers)")`,
      challenge: 'Add a "language" dummy variable: give +50% trade bonus to English-speaking partners (USA, UK, Singapore, Australia). Does the R-squared improve? This is how economists refine the gravity model.',
      successHint: 'The gravity model is a beautiful example of how simple physics-inspired models can explain complex human behavior. It bridges the silk route (where distance literally meant weeks of walking) to modern trade (where distance still matters, despite technology).',
    },
    {
      title: 'Globalization data — measuring interconnectedness',
      concept: `**Globalization** is the increasing interconnectedness of the world's economies, cultures, and populations. It's driven by trade, investment, migration, and information technology.

**Measuring globalization** — the KOF Globalization Index tracks three dimensions:
- **Economic**: trade, FDI (foreign direct investment), tariffs
- **Social**: information flows, personal contacts, cultural proximity
- **Political**: international organizations, treaties, embassies

**Key globalization facts (2024):**
- Global trade = $32 trillion/year (25% of world GDP)
- Cross-border data flows grew 148x from 2005-2023
- 281 million people live outside their country of birth
- The internet connects 5.4 billion people

**Waves of globalization:**
1. **First wave** (1870-1914): steamships, telegraph, gold standard
2. **Retreat** (1914-1945): two world wars, protectionism, depression
3. **Second wave** (1945-1980): Bretton Woods, GATT, reconstruction
4. **Hyper-globalization** (1980-2008): containers, WTO, China's rise, internet
5. **Slowbalization** (2008-present): financial crisis, trade wars, pandemic, reshoring

India was deeply globalized in ancient times (silk routes, spice trade), isolated during colonial rule, protectionist after independence (1947-1991), then rapidly globalizing after the 1991 liberalization reforms.`,
      analogy: 'Globalization is like a web being woven. Each new trade agreement is a thread, each migration flow is a thread, each fiber optic cable is a thread. The web started sparse (a few silk routes) and has become so dense that pulling one thread (a pandemic, a trade war) shakes the entire structure.',
      storyConnection: 'The silk route of the caterpillars was globalization in miniature: connecting distant cultures, moving goods and ideas, creating interdependence. When political instability disrupted the route, both Assam and Tibet suffered. Modern globalization creates the same vulnerability at a planetary scale.',
      checkQuestion: 'If globalization makes everyone richer on average, why do some people oppose it?',
      checkAnswer: 'Because gains from globalization are unevenly distributed. On average, a country benefits — but within the country, some groups win (export industries, consumers of cheap imports) and some lose (workers in industries that can\'t compete with imports). A factory worker whose job moves overseas doesn\'t care about average GDP growth. This is the equity problem of globalization.',
      codeIntro: 'Visualize globalization trends across multiple dimensions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Globalization indicators over time
years = np.array([1970, 1980, 1990, 2000, 2005, 2010, 2015, 2020, 2023])

# Trade as % of world GDP
trade_gdp = [25, 35, 38, 46, 51, 51, 44, 42, 46]

# FDI inflows (trillions USD, approximate)
fdi = [0.01, 0.05, 0.2, 1.4, 1.0, 1.4, 2.0, 1.0, 1.4]

# International migrants (millions)
migrants = [84, 102, 153, 174, 191, 220, 248, 281, 290]

# Internet users (billions)
internet = [0, 0, 0.003, 0.4, 1.0, 2.0, 3.2, 4.9, 5.4]

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Four Dimensions of Globalization', color='white', fontsize=14)

data = [
    (trade_gdp, 'Trade (% of world GDP)', '#22c55e'),
    (fdi, 'FDI inflows (T USD)', '#3b82f6'),
    (migrants, "Int'l migrants (millions)", '#f59e0b'),
    (internet, 'Internet users (billions)', '#a855f7'),
]

for idx, (values, label, color) in enumerate(data):
    ax = axes[idx // 2][idx % 2]
    ax.set_facecolor('#111827')
    ax.fill_between(years, values, alpha=0.2, color=color)
    ax.plot(years, values, 'o-', color=color, linewidth=2, markersize=5)
    ax.set_title(label, color='white', fontsize=11)
    ax.tick_params(colors='gray')
    ax.set_xlabel('Year', color='white', fontsize=9)

    # Mark the "slowbalization" period
    ax.axvspan(2008, 2023, alpha=0.05, color='#ef4444')
    if idx == 0:
        ax.text(2015, max(values)*0.85, 'Slow-\\nbalization?', color='#ef4444', fontsize=8, ha='center')

plt.tight_layout()
plt.show()

# KOF Index for selected countries
print("Globalization waves:")
print("  1870-1914: First wave (trade grew 4x)")
print("  1914-1945: Retreat (wars, protectionism)")
print("  1945-1980: Second wave (institutions)")
print("  1980-2008: Hyper-globalization (trade grew 6x)")
print("  2008-now:  Slowbalization (trade share plateaued)")
print()
print("India's globalization journey:")
print("  Pre-1947:  Deeply connected (silk, spice, colonial trade)")
print("  1947-1991: Protectionist (License Raj, import substitution)")
print("  1991-now:  Rapid opening (trade grew from 15% to 44% of GDP)")`,
      challenge: 'Plot India\'s trade-to-GDP ratio from 1960 to 2023. The key inflection point is 1991 (economic liberalization). Fit separate trend lines for pre-1991 and post-1991. How different are the slopes?',
      successHint: 'Globalization is not a single phenomenon but a multi-dimensional process with advances and retreats. Understanding it requires data across economic, social, and political dimensions — exactly the kind of multi-variable analysis that makes data science essential for modern economics.',
    },
    {
      title: 'Economic inequality metrics — who gets what?',
      concept: `Economic growth matters, but so does **distribution**. Two countries with identical GDP per capita can have radically different living standards if one distributes income evenly and the other concentrates it among a few.

**Key inequality metrics:**

**1. Gini coefficient** (0 to 1):
- 0 = perfect equality (everyone earns the same)
- 1 = perfect inequality (one person earns everything)
- Scandinavia ≈ 0.25, India ≈ 0.35, USA ≈ 0.40, South Africa ≈ 0.63

**2. Lorenz curve**: plots cumulative % of population (x-axis) against cumulative % of income (y-axis). A 45-degree line = perfect equality. The bigger the bow below the line, the more inequality.

**3. Palma ratio**: income share of top 10% / income share of bottom 40%. More intuitive than Gini — tells you how many times richer the top is compared to the bottom.

**4. Income share ratios**: what fraction of national income goes to the top 1%, top 10%, bottom 50%?

**India's inequality:**
- Top 10% earn 57% of national income
- Bottom 50% earn 13%
- Inequality has been rising since 1991 liberalization
- Urban-rural divide is one of the widest in the world

The silk route created inequality too: traders and middlemen captured most of the value, while silk weavers and salt miners earned subsistence wages. The pattern is ancient.`,
      analogy: 'Imagine a pizza split among 10 people. Perfect equality: 10 equal slices. Reality (India): 1 person takes 6 slices, 4 people share 3 slices, and 5 people split the last slice. The Gini coefficient measures how far the actual split deviates from equal slices.',
      storyConnection: 'The silk route made some traders wealthy and left others poor. The caterpillar silk weavers — the ones who actually produced the valuable goods — received a fraction of the final sale price. The middlemen who carried silk across mountains captured the arbitrage profit. This producer-trader inequality echoes in every modern supply chain.',
      checkQuestion: 'Between 1980 and 2020, India\'s GDP grew 8x. But the income share of the top 1% went from 6% to 22%. Did the bottom 50% get richer or poorer?',
      checkAnswer: 'Richer in absolute terms (GDP grew 8x, so even a shrinking share of a much bigger pie can be more than the old share of the small pie). But the bottom 50%\'s share fell from 23% to 13%. So their income roughly doubled (8 × 13/23 ≈ 4.5x), while the top 1%\'s income grew 29x (8 × 22/6). The poor got richer; the rich got richer much faster. Relative inequality increased dramatically.',
      codeIntro: 'Visualize inequality using Lorenz curves and Gini coefficients.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Income distributions for different countries (simplified)
# Each array: income deciles (share of total income for each 10% of population)
distributions = {
    'Sweden (Gini 0.25)': [3.5, 5.0, 6.5, 7.5, 8.5, 9.5, 10.5, 12.0, 14.5, 22.5],
    'India (Gini 0.35)': [1.5, 3.0, 4.0, 5.0, 6.5, 8.0, 10.0, 13.0, 18.0, 31.0],
    'USA (Gini 0.40)': [1.0, 2.5, 3.5, 5.0, 6.0, 7.5, 10.0, 13.5, 19.0, 32.0],
    'S. Africa (Gini 0.63)': [0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 7.0, 11.0, 19.0, 50.0],
}

colors = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Lorenz curves
ax1.set_facecolor('#111827')
pop_pct = np.linspace(0, 100, 11)

ax1.plot([0, 100], [0, 100], '--', color='#6b7280', linewidth=1, label='Perfect equality')

for (name, deciles), color in zip(distributions.items(), colors):
    cumulative = np.cumsum([0] + deciles)
    ax1.plot(pop_pct, cumulative, 'o-', color=color, linewidth=2, markersize=4, label=name)
    ax1.fill_between(pop_pct, cumulative, pop_pct, alpha=0.05, color=color)

ax1.set_xlabel('Cumulative % of population (poorest to richest)', color='white')
ax1.set_ylabel('Cumulative % of income', color='white')
ax1.set_title('Lorenz Curves: Income Distribution', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Income share comparison
ax2.set_facecolor('#111827')
country_names = list(distributions.keys())
short_names = ['Sweden', 'India', 'USA', 'S. Africa']
top10 = [d[-1] for d in distributions.values()]
bottom50 = [sum(d[:5]) for d in distributions.values()]
middle = [100 - t - b for t, b in zip(top10, bottom50)]

x = np.arange(len(short_names))
w = 0.5
ax2.bar(x, bottom50, w, color='#22c55e', label='Bottom 50%')
ax2.bar(x, middle, w, bottom=bottom50, color='#3b82f6', label='Middle 40%')
ax2.bar(x, top10, w, bottom=[b+m for b, m in zip(bottom50, middle)], color='#ef4444', label='Top 10%')

for i in range(len(short_names)):
    ax2.text(i, bottom50[i]/2, f'{bottom50[i]}%', ha='center', color='white', fontsize=9)
    ax2.text(i, bottom50[i]+middle[i]/2, f'{middle[i]}%', ha='center', color='white', fontsize=9)
    ax2.text(i, bottom50[i]+middle[i]+top10[i]/2, f'{top10[i]}%', ha='center', color='white', fontsize=9)

ax2.set_xticks(x)
ax2.set_xticklabels(short_names, color='white')
ax2.set_ylabel('% of national income', color='white')
ax2.set_title('Who Gets What? Income Share by Group', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Calculate Gini from Lorenz curve
def calc_gini(deciles):
    cum = np.cumsum([0] + deciles) / 100
    pop = np.linspace(0, 1, 11)
    area_under = np.trapz(cum, pop)
    return 1 - 2 * area_under

print("Calculated Gini coefficients:")
for name, deciles in distributions.items():
    gini = calc_gini(deciles)
    print(f"  {name}: {gini:.3f}")
print()
print("Palma ratios (top 10% / bottom 40%):")
for name, deciles in distributions.items():
    palma = deciles[-1] / sum(deciles[:4])
    print(f"  {name}: {palma:.1f}x")`,
      challenge: 'Model what happens if India implements a policy that transfers 5% of the top decile\'s income to the bottom 5 deciles evenly. Recalculate the Gini coefficient. How much does it change? Is this redistribution large or small in practical terms?',
      successHint: 'From GDP to trade balance to exchange rates to gravity models to globalization to inequality — you now have the full toolkit of economic analysis. The silk route of the caterpillars was a thread in a vast economic web. Understanding that web requires data, models, and a commitment to measuring not just growth, but fairness.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 trade and economics foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for economic data analysis and modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
