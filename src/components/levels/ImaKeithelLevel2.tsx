import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ImaKeithelLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Visualising supply and demand curves',
      concept: `Supply and demand are best understood visually. The **demand curve** slopes downward (higher price = less demand) and the **supply curve** slopes upward (higher price = more supply). Where they cross is **equilibrium**.

Using matplotlib, we plot both curves and shade the **consumer surplus** (area between demand curve and price — what buyers "save" compared to their maximum willingness to pay) and **producer surplus** (area between price and supply curve — what sellers earn above their minimum acceptable price).

Total **economic surplus** = consumer surplus + producer surplus. A free market maximises this total surplus — this is the efficiency of the invisible hand.`,
      analogy: 'Consumer surplus is the joy of getting a bargain. If you would pay 50₹ for mangoes but the market price is 30₹, you "save" 20₹ of value. Producer surplus is the vendor\'s equivalent — earning above the minimum she would accept. The market creates value for both sides.',
      storyConnection: 'At Ima Keithel, both buyers and sellers leave happy. Buyers get goods cheaper than their maximum price. Vendors earn more than their minimum. The market creates value that did not exist before the exchange — this is the fundamental magic of trade.',
      checkQuestion: 'If the government fixes the price below equilibrium, who benefits and who loses?',
      checkAnswer: 'Buyers who can still purchase benefit (lower price). But many buyers cannot find goods (shortage). Vendors lose (lower revenue). Total economic surplus decreases because fewer transactions happen. Price controls always create deadweight loss — value that is destroyed rather than captured by either side.',
      codeIntro: 'Plot supply and demand curves with consumer and producer surplus for Ima Keithel.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Supply and demand functions
price = np.linspace(10, 60, 200)
demand = 500 - 8 * price        # Q_d = 500 - 8P
supply = np.maximum(0, -100 + 6 * price)  # Q_s = -100 + 6P

# Equilibrium
p_eq = 600 / 14  # ≈ 42.86
q_eq = 500 - 8 * p_eq

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Standard S&D plot
ax1.plot(demand, price, color='#3b82f6', linewidth=2, label='Demand')
ax1.plot(supply, price, color='#ef4444', linewidth=2, label='Supply')
ax1.plot(q_eq, p_eq, 'o', color='#f59e0b', markersize=12, zorder=5, label=f'Equilibrium ({q_eq:.0f}kg, {p_eq:.0f}₹)')

# Consumer surplus (area above price, below demand)
mask_cs = (price >= p_eq) & (demand > 0)
ax1.fill_betweenx(price[mask_cs], 0, demand[mask_cs], alpha=0.2, color='#3b82f6', label='Consumer surplus')
# Producer surplus (area below price, above supply)
mask_ps = (price <= p_eq) & (supply >= 0)
ax1.fill_betweenx(price[mask_ps], 0, supply[mask_ps], alpha=0.2, color='#ef4444', label='Producer surplus')

ax1.set_title('Supply & Demand at Ima Keithel', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Quantity (kg)', color='white')
ax1.set_ylabel('Price (₹/kg)', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
ax1.grid(True, alpha=0.2, color='white')
ax1.set_xlim(0, 500)
ax1.set_ylim(10, 60)

# Shift analysis: what if supply decreases (bad harvest)?
supply_shifted = np.maximum(0, -200 + 6 * price)  # supply shifts left
p_eq_new = 700 / 14  # new equilibrium
q_eq_new = 500 - 8 * p_eq_new

ax2.plot(demand, price, color='#3b82f6', linewidth=2, label='Demand')
ax2.plot(supply, price, color='#ef4444', linewidth=1, linestyle='--', alpha=0.5, label='Old Supply')
ax2.plot(supply_shifted, price, color='#ef4444', linewidth=2, label='New Supply (bad harvest)')
ax2.plot(q_eq, p_eq, 'o', color='#f59e0b', markersize=10, alpha=0.5)
ax2.plot(q_eq_new, p_eq_new, 'o', color='#f59e0b', markersize=12, zorder=5, label=f'New eq. ({q_eq_new:.0f}kg, {p_eq_new:.0f}₹)')
ax2.annotate('', xy=(q_eq_new, p_eq_new), xytext=(q_eq, p_eq),
            arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2))

ax2.set_title('Supply Shock: Bad Harvest', color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Quantity (kg)', color='white')
ax2.set_ylabel('Price (₹/kg)', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
ax2.grid(True, alpha=0.2, color='white')
ax2.set_xlim(0, 500)
ax2.set_ylim(10, 60)

plt.tight_layout()
plt.savefig('supply_demand.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

CS = 0.5 * q_eq * (62.5 - p_eq)  # triangle area
PS = 0.5 * q_eq * (p_eq - 100/6)
print(f"Equilibrium: P={p_eq:.1f}₹, Q={q_eq:.0f}kg")
print(f"Consumer surplus: ~{CS:.0f}₹")
print(f"Producer surplus: ~{PS:.0f}₹")
print(f"Total surplus: ~{CS+PS:.0f}₹")
print(f"\\nAfter bad harvest: P={p_eq_new:.1f}₹ (+{p_eq_new-p_eq:.1f}), Q={q_eq_new:.0f}kg ({q_eq_new-q_eq:.0f})")`,
      challenge: 'Model a demand shock: a festival increases demand by 50%. Shift the demand curve right and find the new equilibrium. Plot both the old and new equilibria.',
      successHint: 'Supply and demand curves are the most fundamental graphs in economics. You just visualised market equilibrium, surplus, and supply shocks — the tools economists use to analyse real markets.',
    },
    {
      title: 'Market basket analysis — what do customers buy together?',
      concept: `Vendors at Ima Keithel notice patterns: customers who buy tomatoes often buy onions and chillies too. This is **market basket analysis** — finding products that are frequently purchased together.

The key metric is **support**: the fraction of transactions containing a particular combination.
**Support(A, B) = count(A and B) / total_transactions**

If support is high, the vendor should place these products together and offer bundle discounts.

We also measure **lift**: how much more likely A and B are bought together versus independently.
**Lift(A, B) = Support(A, B) / (Support(A) x Support(B))**

Lift > 1 means the products are positively associated (bought together more than by chance).`,
      analogy: 'Market basket analysis is like noticing that people who order coffee also order muffins. The coffee shop puts muffins next to the counter, and sales go up. Ima Keithel vendors do the same — stacking complementary products together.',
      storyConnection: 'The story describes how experienced Ima Keithel vendors arrange their stalls strategically: tomatoes next to onions, chillies next to garlic, spices near rice. This is not random — it is the result of centuries of observing what customers buy together.',
      checkQuestion: 'If 80% of customers buy rice and 30% buy fish, but 28% buy both, what is the lift?',
      checkAnswer: 'Lift = Support(rice, fish) / (Support(rice) x Support(fish)) = 0.28 / (0.80 x 0.30) = 0.28 / 0.24 = 1.17. Lift > 1 means rice and fish are positively associated — customers are 17% more likely to buy them together than by random chance.',
      codeIntro: 'Analyse purchase patterns at Ima Keithel using market basket analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 500 customer transactions
products = ['Rice', 'Tomatoes', 'Onions', 'Chillies', 'Fish', 'Potatoes', 'Oil', 'Spices']
n_transactions = 500

# Purchase probabilities and correlations
base_probs = [0.7, 0.5, 0.6, 0.4, 0.3, 0.5, 0.35, 0.25]

transactions = []
for _ in range(n_transactions):
    basket = []
    bought = [np.random.random() < p for p in base_probs]
    # Add correlations: if tomatoes → likely onions and chillies
    if bought[1]:  # tomatoes
        if np.random.random() < 0.7: bought[2] = True  # onions
        if np.random.random() < 0.6: bought[3] = True  # chillies
    if bought[0]:  # rice
        if np.random.random() < 0.5: bought[4] = True  # fish
    transactions.append(bought)

transactions = np.array(transactions)

# Calculate support for all pairs
n_products = len(products)
support_matrix = np.zeros((n_products, n_products))
lift_matrix = np.zeros((n_products, n_products))

for i in range(n_products):
    for j in range(n_products):
        support_i = np.mean(transactions[:, i])
        support_j = np.mean(transactions[:, j])
        support_ij = np.mean(transactions[:, i] & transactions[:, j])
        support_matrix[i, j] = support_ij
        if support_i * support_j > 0:
            lift_matrix[i, j] = support_ij / (support_i * support_j)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

im1 = ax1.imshow(support_matrix, cmap='YlOrRd', aspect='auto')
ax1.set_xticks(range(n_products))
ax1.set_yticks(range(n_products))
ax1.set_xticklabels(products, rotation=45, ha='right', fontsize=8, color='white')
ax1.set_yticklabels(products, fontsize=8, color='white')
ax1.set_title('Co-purchase Support', color='white', fontsize=12, fontweight='bold')
plt.colorbar(im1, ax=ax1, fraction=0.046)

im2 = ax2.imshow(lift_matrix, cmap='RdYlGn', aspect='auto', vmin=0.5, vmax=2.0)
ax2.set_xticks(range(n_products))
ax2.set_yticks(range(n_products))
ax2.set_xticklabels(products, rotation=45, ha='right', fontsize=8, color='white')
ax2.set_yticklabels(products, fontsize=8, color='white')
ax2.set_title('Lift (>1 = positive association)', color='white', fontsize=12, fontweight='bold')
plt.colorbar(im2, ax=ax2, fraction=0.046)

plt.tight_layout()
plt.savefig('basket.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

# Top associations
print("=== Top Product Associations ===\\n")
pairs = []
for i in range(n_products):
    for j in range(i+1, n_products):
        pairs.append((products[i], products[j], support_matrix[i,j], lift_matrix[i,j]))

pairs.sort(key=lambda x: -x[3])
print(f"{'Product A':<12} {'Product B':<12} {'Support':>8} {'Lift':>6}")
print("-" * 42)
for a, b, sup, lift in pairs[:8]:
    indicator = '***' if lift > 1.5 else '**' if lift > 1.2 else ''
    print(f"{a:<12} {b:<12} {sup:>7.1%} {lift:>5.2f} {indicator}")`,
      challenge: 'If a vendor offers a 10% discount on bundles (tomato+onion+chilli), estimate the revenue impact. Does the increased volume from bundling offset the discount?',
      successHint: 'Market basket analysis is the foundation of recommendation engines used by Amazon, Netflix, and every e-commerce platform. You just built one for an ancient market.',
    },
    {
      title: 'Price trends — time series analysis of market data',
      concept: `Prices at Ima Keithel fluctuate with seasons, festivals, and weather. Analysing these patterns helps vendors plan inventory and pricing strategy.

Key time series concepts:
- **Trend**: the long-term direction (rising, falling, flat)
- **Seasonality**: regular patterns that repeat (monsoon → high prices, harvest → low prices)
- **Moving average**: smooths out noise to reveal the trend
- **Volatility**: how much prices bounce around (standard deviation)

A vendor who understands these patterns can buy inventory when prices are low and sell when prices are high — the same principle as stock trading.`,
      analogy: 'Price trends at a market are like tides at the ocean. There is a predictable rhythm (seasons), a long-term trend (climate change), and daily noise (waves). A smart fisherman knows the tide schedule. A smart vendor knows the price schedule.',
      storyConnection: 'The story describes how the most successful Ima Keithel vendors are those who plan months ahead — buying rice after harvest when prices are low and storing it for the lean season when prices are high. They are, in effect, time series analysts.',
      checkQuestion: 'If tomato prices follow a clear seasonal pattern (high in May-July, low in October-December), how could a vendor profit from this?',
      checkAnswer: 'Buy extra tomatoes (or related products) in October-December when prices are low. Process them into dried tomatoes, pickles, or sauce. Sell during May-July when fresh tomato prices are high. The profit comes from buying low, adding value (processing), and selling high. This is arbitrage across time.',
      codeIntro: 'Analyse seasonal price patterns at Ima Keithel over two years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
months = np.arange(24)
month_names = ['J','F','M','A','M','J','J','A','S','O','N','D'] * 2

# Tomato price: seasonal pattern + trend + noise
seasonal = 15 * np.sin(2 * np.pi * months / 12 - np.pi/3)  # peak in summer
trend = 0.3 * months  # slight upward trend
noise = np.random.normal(0, 3, 24)
tomato_price = 30 + seasonal + trend + noise

# Moving average (3-month window)
ma_3 = np.convolve(tomato_price, np.ones(3)/3, mode='valid')
# Moving average (6-month window)
ma_6 = np.convolve(tomato_price, np.ones(6)/6, mode='valid')

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax1.plot(months, tomato_price, 'o-', color='#ef4444', linewidth=1, markersize=4, label='Actual price')
ax1.plot(months[1:-1], ma_3, color='#f59e0b', linewidth=2, label='3-month MA')
ax1.plot(months[2:-3], ma_6, color='#34d399', linewidth=2, label='6-month MA')
ax1.set_xticks(months)
ax1.set_xticklabels(month_names, fontsize=8, color='white')
ax1.set_title('Tomato Prices at Ima Keithel (2 years)', color='white', fontsize=13, fontweight='bold')
ax1.set_ylabel('Price (₹/kg)', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax1.grid(True, alpha=0.2, color='white')

# Monthly volatility
monthly_returns = np.diff(tomato_price) / tomato_price[:-1] * 100
ax2.bar(months[1:], monthly_returns, color=np.where(monthly_returns > 0, '#ef4444', '#34d399'), alpha=0.7)
ax2.axhline(y=0, color='white', alpha=0.3)
ax2.set_xticks(months)
ax2.set_xticklabels(month_names, fontsize=8, color='white')
ax2.set_title('Monthly Price Change (%)', color='white', fontsize=13, fontweight='bold')
ax2.set_xlabel('Month', color='white')
ax2.set_ylabel('Change (%)', color='white')
ax2.tick_params(colors='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('price_trends.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print(f"Average price: {np.mean(tomato_price):.1f}₹")
print(f"Std deviation: {np.std(tomato_price):.1f}₹")
print(f"Min: {np.min(tomato_price):.1f}₹ (month {np.argmin(tomato_price)+1})")
print(f"Max: {np.max(tomato_price):.1f}₹ (month {np.argmax(tomato_price)+1})")
print(f"Annual trend: +{trend[-1]-trend[0]:.1f}₹ over 2 years")`,
      challenge: 'Add price data for rice and fish. Do their seasonal patterns align with tomatoes or move in opposite directions? If they move opposite, a vendor who sells both has less risk.',
      successHint: 'Time series analysis is the foundation of financial trading, weather forecasting, and demand planning. You just applied it to market prices — the same techniques work for stock prices and sales forecasts.',
    },
    {
      title: 'Revenue optimisation — finding the profit-maximising price',
      concept: `Every vendor faces a key question: what price maximises profit? This is the **revenue optimisation** problem.

Revenue = Price x Quantity. But quantity depends on price (demand curve). So:
**Revenue(P) = P x Q(P) = P x (a - b x P)**

This is a parabola that opens downward. The maximum revenue occurs at:
**P_optimal = a / (2b)**

But profit = revenue - cost. Including variable costs:
**Profit(P) = P x Q(P) - c x Q(P) = (P - c) x (a - b x P)**

The profit-maximising price is different from the revenue-maximising price. We find it with calculus (or by plotting and finding the peak).`,
      analogy: 'Revenue optimisation is like filling a bucket with a hole. If you pour too fast (price too high), most water misses the bucket (customers leave). If you pour too slow (price too low), the bucket fills but only a little. The optimal flow rate (price) maximises the water in the bucket (profit).',
      storyConnection: 'The smartest Ima Keithel vendors do not just set the highest possible price. They find the sweet spot where total profit is maximised — often at a lower price than expected, because the increased volume more than compensates for the lower margin.',
      checkQuestion: 'If Revenue = P x (500 - 8P), what price maximises revenue?',
      checkAnswer: 'Revenue = 500P - 8P². Take derivative: dR/dP = 500 - 16P. Set to zero: P = 500/16 = 31.25₹. At this price, Q = 500 - 8(31.25) = 250 kg, and Revenue = 31.25 x 250 = 7812.50₹. Any higher or lower price gives less revenue.',
      codeIntro: 'Find the profit-maximising price for an Ima Keithel vendor.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Demand function: Q = 500 - 8P
a, b = 500, 8
cost_per_unit = 20  # rupees per kg

price = np.linspace(15, 55, 200)
quantity = np.maximum(0, a - b * price)
revenue = price * quantity
cost = cost_per_unit * quantity
profit = revenue - cost

# Analytical optima
p_revenue_max = a / (2 * b)  # = 31.25
p_profit_max = (a + b * cost_per_unit) / (2 * b)  # = (500 + 160) / 16 = 41.25

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax1.plot(price, revenue, color='#3b82f6', linewidth=2, label='Revenue')
ax1.plot(price, cost, color='#ef4444', linewidth=2, label='Cost')
ax1.plot(price, profit, color='#34d399', linewidth=2, label='Profit')
ax1.axvline(x=p_revenue_max, color='#3b82f6', linestyle='--', alpha=0.5, label=f'Max Rev @ {p_revenue_max:.1f}₹')
ax1.axvline(x=p_profit_max, color='#34d399', linestyle='--', alpha=0.5, label=f'Max Profit @ {p_profit_max:.1f}₹')
ax1.set_title('Revenue, Cost & Profit vs Price', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Price (₹/kg)', color='white')
ax1.set_ylabel('₹', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
ax1.grid(True, alpha=0.2, color='white')

# Profit margin analysis
margin_pct = np.where(revenue > 0, profit / revenue * 100, 0)
ax2.plot(price, margin_pct, color='#a78bfa', linewidth=2)
ax2.axvline(x=p_profit_max, color='#34d399', linestyle='--', alpha=0.7)
ax2.set_title('Profit Margin vs Price', color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Price (₹/kg)', color='white')
ax2.set_ylabel('Margin (%)', color='white')
ax2.tick_params(colors='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('optimisation.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

idx_max_profit = np.argmax(profit)
print(f"Revenue-maximising price: {p_revenue_max:.2f}₹ → Revenue = {p_revenue_max*(a-b*p_revenue_max):.0f}₹")
print(f"Profit-maximising price:  {p_profit_max:.2f}₹ → Profit = {profit[idx_max_profit]:.0f}₹")
print(f"\\nAt max profit: Q = {quantity[idx_max_profit]:.0f}kg, Rev = {revenue[idx_max_profit]:.0f}₹, Margin = {margin_pct[idx_max_profit]:.1f}%")
print(f"\\nKey insight: profit is maximised at a HIGHER price than revenue!")
print(f"This is because costs are avoided on the units you don't sell.")`,
      challenge: 'If the vendor has fixed costs of 500₹/day (rent + transport), how does this change the break-even point? At what minimum price does the vendor make any profit at all?',
      successHint: 'Revenue optimisation is used by every business. Airlines, hotels, and ride-sharing apps use dynamic versions of this model to adjust prices in real time. You just derived the fundamental theory.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Market Analysis & Visualization</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
