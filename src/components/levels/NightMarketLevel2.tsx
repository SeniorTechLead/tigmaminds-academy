import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function NightMarketLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Demand curves — the mathematics of wanting things',
      concept: `Level 1 showed demand as a straight line. Reality is more complex. **Demand curves** capture how quantity demanded responds to price, and they can take many shapes.

**Linear demand**: Qd = a - bP
- Simple, often a good approximation for narrow price ranges
- Constant slope: each ₹1 increase reduces demand by the same amount

**Log-linear (constant elasticity)**: ln(Qd) = a - b×ln(P)
- Each 1% price increase reduces demand by b% (constant elasticity)
- More realistic for wide price ranges

**Demand shifters** (factors that move the entire curve):
- **Income**: higher income → demand curve shifts right (for normal goods)
- **Substitutes' price**: if chicken price rises, fish demand increases (rightward shift)
- **Complements' price**: if rice price rises, fish demand might fall (leftward shift)
- **Tastes/preferences**: festival season → increased demand for specific foods
- **Population**: more people → more demand

**Estimating demand** from market data:
- Observe prices and quantities over many days
- Use regression: fit Qd = a - bP + cIncome + dP_substitute + error
- The coefficient b is the price sensitivity`,
      analogy: 'A demand curve is like a thermometer for desire. At low prices (cool), everyone wants it (high quantity). As price heats up, demand drops — first the casual buyers leave, then the regular ones, until only the desperate remain at the top. The shape of the curve tells you how quickly people give up as price rises. A steep curve means people really need the good (inelastic); a flat curve means they will easily switch to alternatives (elastic).',
      storyConnection: 'The vendors of the Ima Keithel intuitively understand demand curves. They know that doubling the price of tomatoes cuts sales by 70% (elastic — buyers switch to other vegetables), but doubling the price of chillies cuts sales by only 20% (inelastic — there is no substitute for that heat). This knowledge lets them set prices for maximum revenue: higher margins on inelastic goods, lower margins but higher volume on elastic goods.',
      checkQuestion: 'A vendor sells 100 kg of fish at ₹300/kg and 60 kg at ₹400/kg. Estimate the linear demand function Qd = a - bP.',
      checkAnswer: 'Two points: (300, 100) and (400, 60). Slope b = (100-60)/(400-300) = 0.4. Using point (300, 100): 100 = a - 0.4×300, so a = 220. Demand function: Qd = 220 - 0.4P. At ₹0, demand would be 220 kg. At ₹550, demand would be 0. In reality, the function only holds for the observed price range — extrapolation beyond it is risky.',
      codeIntro: 'Estimate and plot demand curves from simulated market data using regression.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate realistic market data: 100 days of price/quantity observations
num_days = 100
# Price varies due to supply conditions
base_price = 300
prices = base_price + np.random.normal(0, 60, num_days)
prices = np.clip(prices, 100, 500)

# Quantity depends on price + random factors (weather, festival, day of week)
true_a, true_b = 800, 1.5
noise = np.random.normal(0, 30, num_days)
quantities = true_a - true_b * prices + noise
quantities = np.clip(quantities, 0, 1000)

# Fit linear regression: Q = a - bP
# Using least squares: minimize sum of (Q - a + bP)^2
A = np.vstack([np.ones(num_days), -prices]).T
result = np.linalg.lstsq(A, quantities, rcond=None)
est_a, est_b = result[0][0], -result[0][1]

# Fit log-linear: ln(Q) = c - d*ln(P)
log_P = np.log(prices)
log_Q = np.log(np.maximum(quantities, 1))
A_log = np.vstack([np.ones(num_days), -log_P]).T
result_log = np.linalg.lstsq(A_log, log_Q, rcond=None)
est_c, est_d = result_log[0][0], -result_log[0][1]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Scatter + linear fit
ax1.set_facecolor('#111827')
ax1.scatter(prices, quantities, alpha=0.5, s=20, color='#3b82f6', label='Observed data')

p_range = np.linspace(100, 500, 100)
q_linear = est_a - est_b * p_range
q_log = np.exp(est_c) * p_range**(-est_d)

ax1.plot(p_range, q_linear, color='#22c55e', linewidth=2, label=f'Linear: Q = {est_a:.0f} - {est_b:.2f}P')
ax1.plot(p_range, q_log, color='#f59e0b', linewidth=2, linestyle='--', label=f'Log: elasticity = {est_d:.2f}')
ax1.plot(p_range, true_a - true_b * p_range, color='#ef4444', linewidth=1, linestyle=':', label='True demand')

ax1.set_xlabel('Price (₹/kg)', color='white')
ax1.set_ylabel('Quantity demanded (kg)', color='white')
ax1.set_title('Demand Curve Estimation', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Revenue curve: R = P × Q
ax2.set_facecolor('#111827')
revenue_linear = p_range * (est_a - est_b * p_range)
revenue_log = p_range * np.exp(est_c) * p_range**(-est_d)

ax2.plot(p_range, revenue_linear / 1000, color='#22c55e', linewidth=2, label='Revenue (linear model)')
ax2.plot(p_range, revenue_log / 1000, color='#f59e0b', linewidth=2, linestyle='--', label='Revenue (log model)')

# Optimal price (max revenue)
opt_price_linear = est_a / (2 * est_b)
opt_revenue_linear = opt_price_linear * (est_a - est_b * opt_price_linear)
ax2.plot(opt_price_linear, opt_revenue_linear / 1000, '*', color='#ef4444', markersize=15, zorder=5)
ax2.annotate(f'Max revenue\\n₹{opt_price_linear:.0f}/kg', xy=(opt_price_linear, opt_revenue_linear/1000),
             xytext=(opt_price_linear + 40, opt_revenue_linear/1000 - 10),
             color='#ef4444', fontsize=10, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax2.set_xlabel('Price (₹/kg)', color='white')
ax2.set_ylabel('Revenue (₹ thousands)', color='white')
ax2.set_title('Revenue vs Price', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Demand curve estimation results:")
print(f"  True model: Q = {true_a} - {true_b}P")
print(f"  Estimated linear: Q = {est_a:.0f} - {est_b:.2f}P")
print(f"  Estimated log elasticity: {est_d:.2f}")
print(f"  Revenue-maximising price: ₹{opt_price_linear:.0f}/kg")
print(f"  Max daily revenue: ₹{opt_revenue_linear:.0f}")
print()
print(f"  At ₹300: quantity = {est_a - est_b*300:.0f}kg, revenue = ₹{300*(est_a-est_b*300):.0f}")
print(f"  At ₹{opt_price_linear:.0f}: quantity = {est_a - est_b*opt_price_linear:.0f}kg, revenue = ₹{opt_revenue_linear:.0f}")`,
      challenge: 'Add income as a demand shifter: on weekends (higher spending), demand increases by 30%. Re-estimate the model including a weekend dummy variable. How does the demand curve shift?',
      successHint: 'Demand estimation is the foundation of pricing strategy, market analysis, and economic policy. Every business — from a market stall to Amazon — tries to estimate its demand curve to optimise pricing.',
    },
    {
      title: 'Equilibrium price — where markets settle',
      concept: `Market equilibrium is not just a point on a graph — it is a **stable attractor** that markets constantly move toward. Understanding the mathematics of equilibrium reveals powerful insights.

**Static equilibrium**: solve Qd = Qs
- Qd = a - bP (demand)
- Qs = c + dP (supply)
- Equilibrium: a - bP* = c + dP* → P* = (a - c) / (b + d)
- Q* = a - bP* = a - b(a-c)/(b+d)

**Dynamic equilibrium** (cobweb model): in many markets, today's supply depends on yesterday's price (farmers plant based on last season's price).
- If |b/d| < 1 (supply more responsive than demand): prices converge to equilibrium (**stable**)
- If |b/d| > 1 (demand more responsive than supply): prices diverge (**unstable**)
- If |b/d| = 1: prices oscillate permanently

**Multiple equilibria**: some markets have more than one equilibrium (network effects — everyone uses WhatsApp because everyone else does). Moving between equilibria requires a large shock.

**General equilibrium**: the entire economy is interconnected. The fish price depends on the chicken price depends on the feed price depends on the crop price depends on the fish price... Solving all markets simultaneously is **general equilibrium theory** (which won multiple Nobel Prizes).`,
      analogy: 'Equilibrium is like a ball in a bowl. Push it (price shock) and it rolls back to the bottom (equilibrium). The steepness of the bowl determines how quickly it returns. A shallow bowl (low elasticity) means slow return — prices stay distorted for a long time. A steep bowl (high elasticity) means quick return. An unstable equilibrium is like a ball balanced on top of an upside-down bowl — any push sends it rolling away, never to return.',
      storyConnection: 'The Imphal night market reaches equilibrium every evening — but it is a dynamic equilibrium that shifts throughout the night. At 6pm (market opens), prices are high (limited supply, high demand). By 9pm, equilibrium has shifted as more vendors arrive and some customers leave. By 11pm (closing), perishable goods fall to fire-sale prices (supply unchanged, demand collapsing). The market traces out a path through multiple equilibria in a single evening.',
      checkQuestion: 'If the government imposes a minimum support price (MSP) for a crop that is above the market equilibrium, what happens?',
      checkAnswer: 'At the MSP (above equilibrium), supply > demand — farmers produce more at the higher price, but consumers buy less. The result is a surplus. The government must either: (1) buy the surplus itself (expensive — this is how India\'s food procurement works), (2) export the surplus (needs international demand), or (3) let the surplus rot (wasteful). MSP supports farmers but can create persistent surpluses if set too high. India\'s rice and wheat procurement system demonstrates both the benefits (farmer income protection) and costs (massive government stocks, storage waste).',
      codeIntro: 'Model equilibrium dynamics: the cobweb model showing how markets converge (or don\'t).',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cobweb model: Qd(t) = a - b*P(t), Qs(t) = c + d*P(t-1)
# Farmers base planting on last period's price

def cobweb(a, b, c, d, P0, periods=30):
    prices = [P0]
    quantities = [a - b * P0]  # initial demand
    for t in range(1, periods):
        # Supply based on last period's price
        Qs = c + d * prices[-1]
        # Price adjusts to clear the market: Qd = Qs → a - bP = Qs → P = (a - Qs)/b
        P = (a - Qs) / b
        P = max(0, P)  # price can't be negative
        prices.append(P)
        quantities.append(Qs)
    return np.array(prices), np.array(quantities)

# Equilibrium: P* = (a-c)/(b+d)
a, c = 800, -100

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

scenarios = [
    ('Stable (b > d)', 2.0, 1.0, axes[0, 0]),
    ('Unstable (b < d)', 1.0, 2.0, axes[0, 1]),
    ('Oscillating (b = d)', 1.5, 1.5, axes[1, 0]),
]

for title, b, d, ax in scenarios:
    P_eq = (a - c) / (b + d)
    Q_eq = a - b * P_eq
    P0 = P_eq * 1.5  # start 50% above equilibrium

    prices, quantities = cobweb(a, b, c, d, P0, 25)

    ax.set_facecolor('#111827')

    # Plot supply and demand curves
    p_range = np.linspace(0, 600, 100)
    qd = a - b * p_range
    qs = c + d * p_range
    ax.plot(qd, p_range, color='#3b82f6', linewidth=1.5, alpha=0.5, label='Demand')
    ax.plot(qs, p_range, color='#ef4444', linewidth=1.5, alpha=0.5, label='Supply')

    # Plot cobweb
    for t in range(len(prices) - 1):
        # Horizontal: at price P(t), supply Q(t+1)
        q_supply = c + d * prices[t]
        ax.plot([quantities[t], q_supply], [prices[t], prices[t]], color='#22c55e', linewidth=1, alpha=0.6)
        # Vertical: at quantity Q, price adjusts
        p_new = (a - q_supply) / b
        ax.plot([q_supply, q_supply], [prices[t], max(0, p_new)], color='#22c55e', linewidth=1, alpha=0.6)

    ax.plot(Q_eq, P_eq, '*', color='#f59e0b', markersize=15, zorder=5, label=f'Equilibrium (₹{P_eq:.0f})')
    ax.set_xlabel('Quantity', color='white')
    ax.set_ylabel('Price (₹)', color='white')
    ax.set_title(title, color='white', fontsize=12)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
    ax.tick_params(colors='gray')
    ax.set_xlim(0, 800)
    ax.set_ylim(0, 600)

# Price over time for all scenarios
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
for title, b, d, _ in scenarios:
    P_eq = (a - c) / (b + d)
    prices, _ = cobweb(a, b, c, d, P_eq * 1.5, 25)
    ax4.plot(prices, linewidth=2, label=title.split('(')[0].strip())
    ax4.axhline(P_eq, color='gray', linestyle=':', linewidth=0.5)

ax4.set_xlabel('Time period', color='white')
ax4.set_ylabel('Price (₹)', color='white')
ax4.set_title('Price Convergence Over Time', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cobweb model results:")
for title, b, d, _ in scenarios:
    P_eq = (a - c) / (b + d)
    ratio = b / d
    stability = 'STABLE' if ratio > 1 else 'UNSTABLE' if ratio < 1 else 'OSCILLATING'
    print(f"  {title}: P*=₹{P_eq:.0f}, |b/d|={ratio:.1f} → {stability}")`,
      challenge: 'Add adaptive expectations: instead of using last period\'s price, farmers use a weighted average of the last 3 periods. Does this stabilise the unstable cobweb?',
      successHint: 'Equilibrium dynamics explain real-world phenomena: why commodity prices cycle (agricultural cobwebs), why housing markets boom and bust (slow supply response), and why some markets stay distorted for years (sticky prices, information lags).',
    },
    {
      title: 'Elasticity — measuring responsiveness',
      concept: `**Price elasticity of demand** measures how sensitive quantity demanded is to a price change:

**Ed = (% change in Qd) / (% change in P)**

- |Ed| > 1: **elastic** — demand is very responsive (luxury goods, goods with substitutes)
- |Ed| < 1: **inelastic** — demand is not responsive (necessities, addictive goods)
- |Ed| = 1: **unit elastic** — % change in Q equals % change in P
- |Ed| = 0: **perfectly inelastic** — quantity doesn't change at all (life-saving drugs)
- |Ed| = ∞: **perfectly elastic** — any price increase kills all demand (perfect substitutes)

**At the night market**:
- Fish: Ed ≈ -1.5 (elastic — buyers switch to chicken or eggs)
- Rice: Ed ≈ -0.3 (inelastic — it's a staple, few substitutes)
- Chilli: Ed ≈ -0.2 (very inelastic — no substitute in Manipuri cuisine)
- Imported chocolate: Ed ≈ -2.5 (very elastic — pure luxury)

**Revenue implications**:
- If demand is elastic (|Ed| > 1): raising price DECREASES revenue (lost sales > higher price)
- If demand is inelastic (|Ed| < 1): raising price INCREASES revenue (higher price > lost sales)
- Revenue is maximised where |Ed| = 1

This is why governments tax inelastic goods (tobacco, petrol) — the tax raises lots of revenue without killing demand. And why luxury brands must be careful with price increases — their customers are elastic.`,
      analogy: 'Elasticity is like a rubber band. An elastic good is like a stretchy band — pull (raise price) and the quantity stretches (falls) a lot. An inelastic good is like a stiff band — pull hard and it barely moves. Rice in Manipur is like a steel cable: no matter how hard you pull (raise price), people still buy nearly the same amount. Imported chocolate is like a rubber band: a small pull sends the quantity flying.',
      storyConnection: 'The women of the Ima Keithel are experts at intuitive elasticity. They know exactly which goods can absorb a price increase (inelastic goods with captive demand) and which will lose customers instantly (elastic goods with ready substitutes). A vendor selling fermented bamboo shoot (unique, no substitute) has pricing power. A vendor selling tomatoes (available at 20 other stalls) has none. Elasticity determines bargaining power.',
      checkQuestion: 'If the government wants to reduce smoking, should it tax cigarettes heavily? What does elasticity predict?',
      checkAnswer: 'Cigarettes have inelastic demand (Ed ≈ -0.4 in India). A 10% price increase reduces consumption by only 4%. So heavy taxation reduces smoking somewhat but not dramatically — it is more effective as a revenue tool than a health tool. However, elasticity is higher for young people (who haven\'t formed habits yet) — a 10% increase reduces youth smoking by 7-8%. So tobacco tax IS effective at preventing new smokers while generating revenue from existing ones. The most effective anti-smoking strategy combines taxation (targeting elasticity) with education (shifting the demand curve itself).',
      codeIntro: 'Calculate and visualise price elasticity for different goods at the night market.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Demand functions for different goods
goods = {
    'Fish': {'a': 800, 'b': 1.5, 'color': '#3b82f6'},
    'Rice': {'a': 500, 'b': 0.3, 'color': '#22c55e'},
    'Chilli': {'a': 200, 'b': 0.08, 'color': '#ef4444'},
    'Chocolate': {'a': 300, 'b': 2.5, 'color': '#a855f7'},
}

prices = np.linspace(50, 400, 200)

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Demand curves
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
for name, params in goods.items():
    q = params['a'] - params['b'] * prices
    ax1.plot(prices, np.maximum(q, 0), color=params['color'], linewidth=2, label=name)
ax1.set_xlabel('Price (₹)', color='white')
ax1.set_ylabel('Quantity (kg)', color='white')
ax1.set_title('Demand Curves', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Elasticity along each curve
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
for name, params in goods.items():
    q = params['a'] - params['b'] * prices
    q = np.maximum(q, 1)  # avoid division by zero
    elasticity = -params['b'] * prices / q
    ax2.plot(prices, np.abs(elasticity), color=params['color'], linewidth=2, label=name)

ax2.axhline(1, color='#f59e0b', linestyle='--', linewidth=2, label='Unit elastic (|Ed|=1)')
ax2.set_xlabel('Price (₹)', color='white')
ax2.set_ylabel('|Elasticity|', color='white')
ax2.set_title('Price Elasticity of Demand', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 5)

# Revenue curves
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
for name, params in goods.items():
    q = np.maximum(params['a'] - params['b'] * prices, 0)
    revenue = prices * q / 1000
    ax3.plot(prices, revenue, color=params['color'], linewidth=2, label=name)
    # Mark revenue-maximising price
    opt_idx = np.argmax(revenue)
    ax3.plot(prices[opt_idx], revenue[opt_idx], '*', color=params['color'], markersize=12)

ax3.set_xlabel('Price (₹)', color='white')
ax3.set_ylabel('Revenue (₹ thousands)', color='white')
ax3.set_title('Revenue vs Price (★ = optimal)', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# Tax impact simulation
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
tax_rates = np.linspace(0, 100, 50)  # % tax on price
base_price = 200  # original equilibrium price

tax_revenue = {}
for name, params in goods.items():
    revenues = []
    for tax in tax_rates:
        new_price = base_price * (1 + tax/100)
        q = max(0, params['a'] - params['b'] * new_price)
        tax_rev = (tax/100 * base_price) * q
        revenues.append(tax_rev)
    tax_revenue[name] = revenues
    ax4.plot(tax_rates, np.array(revenues)/1000, color=params['color'], linewidth=2, label=name)

ax4.set_xlabel('Tax rate (%)', color='white')
ax4.set_ylabel('Tax revenue (₹ thousands)', color='white')
ax4.set_title('Laffer Curve: Tax Revenue vs Tax Rate', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Elasticity at ₹200 for each good:")
for name, params in goods.items():
    q = params['a'] - params['b'] * 200
    ed = -params['b'] * 200 / q
    opt_p = params['a'] / (2 * params['b'])
    category = 'ELASTIC' if abs(ed) > 1 else 'INELASTIC'
    print(f"  {name}: Ed = {ed:.2f} ({category}), revenue-max price = ₹{opt_p:.0f}")`,
      challenge: 'Cross-price elasticity: if fish price rises 10%, by how much does chicken demand increase? Model two goods with interdependent demand curves (Qfish = 800 - 1.5Pfish + 0.5Pchicken).',
      successHint: 'Elasticity is the single most useful concept in applied economics. It determines pricing strategy, tax policy, trade outcomes, and market regulation. Measuring it accurately from data is one of the core skills of econometrics.',
    },
    {
      title: 'Market simulation with Python — building a virtual night market',
      concept: `Now we combine everything: supply, demand, elasticity, multiple goods, multiple agents, and time dynamics into a complete **agent-based market simulation**.

**Agent-based modeling** simulates an economy by modeling individual agents (buyers, sellers) with simple rules. Complex market phenomena **emerge** from these simple rules:
- Price discovery emerges from buyers choosing cheapest sellers
- Market clearing emerges from sellers adjusting prices based on inventory
- Business cycles emerge from feedback loops between supply and demand

Our virtual night market has:
- **Sellers**: each with inventory, cost structure, and pricing strategy
- **Buyers**: each with budget, preferences, and willingness to pay
- **Market mechanism**: buyers visit sellers, compare prices, and buy from the best deal
- **Dynamics**: sellers adjust prices based on sales; buyers adjust behaviour based on experience

This is how modern economics research works — not just equations on a blackboard, but simulated economies that can test policies, predict crises, and train AI trading agents. The same techniques power stock market simulations, urban planning models, and epidemic forecasting.`,
      analogy: 'An agent-based simulation is like SimCity for economics. You don\'t tell the city what to do — you create the buildings (agents), set the rules (buy low, sell high, go where it\'s cheapest), and watch what happens. Traffic jams, booms, busts, and market equilibria all emerge from individual agents following simple rules. The beauty is that the macro outcome (market price) emerges from micro behaviour (individual choices) — just like in a real market.',
      storyConnection: 'If we could simulate the Ima Keithel digitally — 5,000 vendors, 50,000 daily customers, monsoon disruptions, festival demand spikes — we could test policies before implementing them. What happens if we add 500 new stalls? If we ban plastic bags? If we impose a minimum price for handloom? The simulation would reveal unintended consequences that intuition alone might miss.',
      checkQuestion: 'Why do agent-based models sometimes produce surprising results that differ from simple supply-and-demand predictions?',
      checkAnswer: 'Because simple models assume: (1) perfect information (everyone knows all prices), (2) rational agents (everyone optimises perfectly), (3) instant adjustment (markets clear immediately), and (4) no interaction effects (one person\'s choice doesn\'t affect another\'s options). Agent-based models relax all of these: agents have limited information, make imperfect decisions, adjust gradually, and their actions affect each other. This is why ABMs can capture phenomena like herding (everyone buys because everyone else is buying), market crashes, and persistent inequality that simple models miss.',
      codeIntro: 'Build a complete agent-based simulation of the Imphal night market.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# === AGENT-BASED MARKET SIMULATION ===

# Sellers
num_sellers = 20
sellers = {
    'price': np.random.uniform(200, 400, num_sellers),  # initial prices
    'inventory': np.random.uniform(30, 80, num_sellers),  # kg
    'cost': np.random.uniform(150, 250, num_sellers),  # cost per kg
    'sales': np.zeros(num_sellers),
    'revenue': np.zeros(num_sellers),
}

# Buyers
num_buyers = 200
buyers = {
    'budget': np.random.uniform(100, 600, num_buyers),  # max willing to pay
    'demand': np.random.uniform(1, 5, num_buyers),  # kg wanted
}

# Simulation: 50 trading rounds
num_rounds = 50
price_history = []
transaction_history = []
avg_price_history = []
total_quantity_history = []

for round_num in range(num_rounds):
    # Reset daily sales
    sellers['sales'] = np.zeros(num_sellers)
    sellers['revenue'] = np.zeros(num_sellers)
    round_transactions = []

    # Shuffle buyer order (random arrival)
    buyer_order = np.random.permutation(num_buyers)

    for b_idx in buyer_order:
        budget = buyers['budget'][b_idx]
        demand = buyers['demand'][b_idx]

        # Buyer checks 5 random sellers
        checked = np.random.choice(num_sellers, min(5, num_sellers), replace=False)

        # Find cheapest seller with stock, within budget
        best_seller = None
        best_price = float('inf')
        for s in checked:
            if sellers['price'][s] <= budget and sellers['inventory'][s] >= demand:
                if sellers['price'][s] < best_price:
                    best_price = sellers['price'][s]
                    best_seller = s

        if best_seller is not None:
            # Transaction
            qty = min(demand, sellers['inventory'][best_seller])
            sellers['inventory'][best_seller] -= qty
            sellers['sales'][best_seller] += qty
            sellers['revenue'][best_seller] += best_price * qty
            round_transactions.append(best_price)

    # Price adjustment by sellers
    for s in range(num_sellers):
        if sellers['sales'][s] > 0:
            # Sold well → raise price slightly
            demand_ratio = sellers['sales'][s] / max(1, 50 - sellers['inventory'][s])
            if demand_ratio > 0.7:
                sellers['price'][s] *= 1.03  # raise 3%
            elif demand_ratio < 0.3:
                sellers['price'][s] *= 0.95  # lower 5%
        else:
            # No sales → lower price
            sellers['price'][s] *= 0.92

        # Don't sell below cost
        sellers['price'][s] = max(sellers['price'][s], sellers['cost'][s] * 1.05)

        # Restock
        sellers['inventory'][s] = np.random.uniform(30, 80)

    price_history.append(sellers['price'].copy())
    if round_transactions:
        avg_price_history.append(np.mean(round_transactions))
        total_quantity_history.append(len(round_transactions))
        transaction_history.extend(round_transactions)

price_history = np.array(price_history)

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Price evolution
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
for s in range(num_sellers):
    ax1.plot(price_history[:, s], alpha=0.3, linewidth=1, color='#3b82f6')
ax1.plot(avg_price_history, color='#f59e0b', linewidth=3, label='Avg transaction price')
ax1.set_xlabel('Trading round', color='white')
ax1.set_ylabel('Price (₹/kg)', color='white')
ax1.set_title('Price Evolution (20 Sellers)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Transaction volume
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.bar(range(len(total_quantity_history)), total_quantity_history, color='#22c55e', alpha=0.7)
ax2.set_xlabel('Trading round', color='white')
ax2.set_ylabel('Transactions', color='white')
ax2.set_title('Trading Volume per Round', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Price distribution (early vs late)
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
early_prices = price_history[:5].flatten()
late_prices = price_history[-5:].flatten()
ax3.hist(early_prices, bins=20, alpha=0.5, color='#ef4444', label='Early rounds', edgecolor='none')
ax3.hist(late_prices, bins=20, alpha=0.5, color='#22c55e', label='Late rounds', edgecolor='none')
ax3.set_xlabel('Price (₹/kg)', color='white')
ax3.set_ylabel('Count', color='white')
ax3.set_title('Price Distribution: Convergence', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Seller profitability
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
final_prices = price_history[-1]
profits = final_prices - sellers['cost']
colors_profit = ['#22c55e' if p > 0 else '#ef4444' for p in profits]
ax4.bar(range(num_sellers), profits, color=colors_profit, alpha=0.8)
ax4.axhline(0, color='white', linewidth=1)
ax4.set_xlabel('Seller ID', color='white')
ax4.set_ylabel('Profit margin (₹/kg)', color='white')
ax4.set_title('Seller Profitability (Final Round)', color='white', fontsize=12)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Night Market Simulation Results:")
print(f"  Sellers: {num_sellers}, Buyers: {num_buyers}, Rounds: {num_rounds}")
print(f"  Starting avg price: ₹{price_history[0].mean():.0f} (spread: ₹{price_history[0].std():.0f})")
print(f"  Final avg price: ₹{price_history[-1].mean():.0f} (spread: ₹{price_history[-1].std():.0f})")
print(f"  Average transaction price: ₹{np.mean(avg_price_history):.0f}")
print(f"  Total transactions: {sum(total_quantity_history)}")
profitable = np.sum(profits > 0)
print(f"  Profitable sellers: {profitable}/{num_sellers}")
print(f"  Avg profit margin: ₹{np.mean(profits):.0f}/kg")`,
      challenge: 'Add a "shock" at round 25: half the sellers leave the market (supply shock). How do prices respond? How long until they stabilise? Then at round 35, the sellers return. Does the market return to the original equilibrium?',
      successHint: 'Agent-based modeling is the cutting edge of economic simulation. It bridges the gap between elegant theory and messy reality, and it is the tool that central banks, hedge funds, and policy institutes use to stress-test their strategies.',
    },
    {
      title: 'Game theory basics — strategic thinking at the market',
      concept: `When two vendors sell the same fish, each must consider the other's pricing strategy. This is **game theory** — the mathematics of strategic interaction.

**The Prisoner's Dilemma (vendor version)**:
Two fish vendors can each price High (₹350) or Low (₹250).
- Both High: each sells 50 kg, profit ₹5,000 each
- Both Low: each sells 60 kg, profit ₹3,000 each
- One High, one Low: Low sells 90 kg (₹4,500), High sells 20 kg (₹2,000)

The **dominant strategy** is to price Low (regardless of what the other does, you're better off pricing Low). But if both price Low, they both earn ₹3,000 — worse than if both priced High (₹5,000 each). This is the dilemma: individual rationality leads to collective suboptimality.

**Nash Equilibrium**: a set of strategies where no player can improve by unilaterally changing. In the vendor dilemma, (Low, Low) is the Nash Equilibrium — even though (High, High) is better for both.

**Repeated games**: if the vendors interact daily (as at the Ima Keithel), cooperation becomes possible through:
- **Tit-for-tat**: start cooperative, then mirror the other's last move
- **Reputation**: building trust over time
- **Punishment**: if one undercuts, the other retaliates tomorrow`,
      analogy: 'Game theory is like chess for economics. In chess, every move depends on what you think your opponent will do. In the market, every price you set depends on what you think competitors will charge. The Nash Equilibrium is like a chess position where neither player can improve — not necessarily the best possible position, just one where nobody wants to change unilaterally. Game theory formalises the strategic thinking that market vendors do intuitively.',
      storyConnection: 'At the Ima Keithel, vendors of the same product often sit next to each other. Over decades, they develop tacit understanding — not explicit collusion, but a mutual recognition that price wars hurt everyone. A new vendor who undercuts aggressively will face retaliation (other vendors also lower prices) and social pressure (the market has its own governance). The repeated-game equilibrium favours cooperation. This is game theory playing out in real time, without anyone having studied it formally.',
      checkQuestion: 'If the Nash Equilibrium is "both price low" (suboptimal), why don\'t the two vendors just agree to both price high?',
      checkAnswer: 'They could, and sometimes do (tacit collusion). But such agreements are unstable: each vendor has an incentive to secretly undercut the agreed price to steal customers. In a one-shot game, cheating is always profitable. In repeated interactions (daily market), cheating is punished in future rounds, making cooperation sustainable. The key insight: cooperation requires repeated interaction and the ability to punish cheaters. This is why cartels (formal price-fixing agreements) are illegal — they hurt consumers — and why they tend to collapse over time as members cheat.',
      codeIntro: 'Simulate the Prisoner\'s Dilemma for market vendors and explore different strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Payoff matrix for two vendors
# Strategies: H = High price, L = Low price
# Payoffs: (Vendor A profit, Vendor B profit)
payoffs = {
    ('H', 'H'): (5000, 5000),
    ('H', 'L'): (2000, 4500),
    ('L', 'H'): (4500, 2000),
    ('L', 'L'): (3000, 3000),
}

# Strategies for repeated game
def always_high(history_self, history_other):
    return 'H'

def always_low(history_self, history_other):
    return 'L'

def tit_for_tat(history_self, history_other):
    if not history_other:
        return 'H'  # start cooperative
    return history_other[-1]  # mirror last move

def random_strategy(history_self, history_other):
    return np.random.choice(['H', 'L'])

def grudge(history_self, history_other):
    if 'L' in history_other:
        return 'L'  # never forgive
    return 'H'

strategies = {
    'Always High': always_high,
    'Always Low': always_low,
    'Tit-for-Tat': tit_for_tat,
    'Random': random_strategy,
    'Grudge': grudge,
}

# Run round-robin tournament
num_rounds = 100
results = {}

for name_a, strat_a in strategies.items():
    for name_b, strat_b in strategies.items():
        history_a, history_b = [], []
        profit_a, profit_b = 0, 0

        for _ in range(num_rounds):
            move_a = strat_a(history_a, history_b)
            move_b = strat_b(history_b, history_a)
            pa, pb = payoffs[(move_a, move_b)]
            profit_a += pa
            profit_b += pb
            history_a.append(move_a)
            history_b.append(move_b)

        results[(name_a, name_b)] = (profit_a, profit_b)

# Total profit per strategy (averaged over all opponents)
total_profits = {}
for name in strategies:
    profits = [results[(name, opp)][0] for opp in strategies]
    total_profits[name] = np.mean(profits)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Tournament results
ax1.set_facecolor('#111827')
sorted_strats = sorted(total_profits.items(), key=lambda x: x[1], reverse=True)
names = [s[0] for s in sorted_strats]
profits = [s[1] / 1000 for s in sorted_strats]
colors_strat = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
bars = ax1.barh(names, profits, color=colors_strat[:len(names)], alpha=0.8)
ax1.set_xlabel('Average profit (₹ thousands)', color='white')
ax1.set_title('Strategy Tournament (100 rounds)', color='white', fontsize=13)
ax1.tick_params(colors='gray')
for bar, p in zip(bars, profits):
    ax1.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2,
             f'₹{p:.0f}k', va='center', color='white', fontsize=10)

# Tit-for-tat vs Always Low detail
ax2.set_facecolor('#111827')
# Re-run detailed for visualization
history_tft, history_low = [], []
cum_tft, cum_low = [0], [0]
for r in range(num_rounds):
    m_tft = tit_for_tat(history_tft, history_low)
    m_low = always_low(history_low, history_tft)
    p_tft, p_low = payoffs[(m_tft, m_low)]
    cum_tft.append(cum_tft[-1] + p_tft)
    cum_low.append(cum_low[-1] + p_low)
    history_tft.append(m_tft)
    history_low.append(m_low)

ax2.plot(cum_tft, color='#22c55e', linewidth=2, label='Tit-for-Tat')
ax2.plot(cum_low, color='#ef4444', linewidth=2, label='Always Low')

# Also show TFT vs TFT (mutual cooperation)
history_a, history_b = [], []
cum_coop = [0]
for r in range(num_rounds):
    ma = tit_for_tat(history_a, history_b)
    mb = tit_for_tat(history_b, history_a)
    pa, _ = payoffs[(ma, mb)]
    cum_coop.append(cum_coop[-1] + pa)
    history_a.append(ma)
    history_b.append(mb)
ax2.plot(cum_coop, color='#f59e0b', linewidth=2, linestyle='--', label='TFT vs TFT (cooperation)')

ax2.set_xlabel('Round', color='white')
ax2.set_ylabel('Cumulative profit (₹)', color='white')
ax2.set_title('Strategy Matchups Over Time', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Tournament results (100 rounds, averaged over all opponents):")
for name, profit in sorted_strats:
    print(f"  {name}: ₹{profit:,.0f} avg profit")
print()
print("Key findings:")
print(f"  Winner: {sorted_strats[0][0]}")
print("  Tit-for-Tat succeeds by cooperating with cooperators")
print("  and punishing defectors — it never initiates conflict.")
print("  'Always Low' loses because it triggers retaliation.")
print("  Cooperation emerges through repeated interaction.")`,
      challenge: 'Add a "Forgiving Tit-for-Tat" that forgives one defection before retaliating. How does it perform against regular Tit-for-Tat and against Random? In noisy environments (where moves are sometimes misread), forgiving strategies often outperform strict ones.',
      successHint: 'Game theory revolutionised economics, political science, biology, and computer science. The insight that strategic interaction produces outcomes different from individual optimisation explains cartels, arms races, evolution, and market competition.',
    },
    {
      title: 'Behavioral economics — when humans aren\'t "rational"',
      concept: `Classical economics assumes people are perfectly rational: they calculate, compare, and choose the option that maximises their utility. **Behavioral economics** studies how real humans actually decide — and they deviate from rationality in predictable ways.

**Key biases at the night market**:

1. **Anchoring**: the first price you see sets your expectation. A vendor who starts at ₹500 and "discounts" to ₹350 seems generous. A vendor who starts at ₹350 seems expensive — even though the final price is the same.

2. **Loss aversion**: losing ₹100 feels worse than gaining ₹100 feels good. Vendors exploit this: "Limited stock! Last 5 kg!" creates fear of losing out.

3. **Herd behavior**: if a stall has a long queue, people assume it must be good and join. The queue signals quality, even if the food is average.

4. **Status quo bias**: buyers return to familiar vendors even when cheaper options exist. Changing vendors feels risky.

5. **Mental accounting**: a buyer might refuse ₹300/kg fish for home cooking but happily pay ₹400/kg at a restaurant — different "mental accounts" for food.

6. **Decoy effect**: a vendor offers Small (₹100), Large (₹250), and XL (₹260). Nobody buys Small (too little) or XL (barely bigger than Large). Large seems like the best value — which is exactly what the vendor intended. XL is the "decoy."

These biases aren't irrational — they're **heuristics** (mental shortcuts) that work well most of the time but can be exploited.`,
      analogy: 'Classical economics models humans as computers — perfectly calculating every option. Behavioral economics models humans as humans — using shortcuts, influenced by context, and sometimes making decisions that a computer would reject. A computer would never pay more because of a long queue. A human does — because the queue IS information (social proof), and processing it is cheaper than researching every stall independently. The "bias" is actually efficient cognition in an uncertain world.',
      storyConnection: 'The Ima Keithel vendors are natural behavioral economists. They arrange products to create anchoring (the expensive item displayed first), use scarcity framing ("fresh today only!"), build loyalty through personal relationships (status quo bias), and strategically place decoy options. They learned these techniques not from textbooks but from five centuries of observing customer behaviour. Behavioral economics is the science; market vendors are the practitioners.',
      checkQuestion: 'A study finds that people buy more jam when offered 6 varieties than when offered 24 varieties (the "paradox of choice"). Why?',
      checkAnswer: 'Too many options cause "choice overload" — the cognitive effort of comparing 24 jams is exhausting, leading people to defer the decision (not buy). With 6 options, comparison is manageable and people feel confident in their choice. This has practical implications: night market vendors who display 5-6 well-chosen items sell more than those who display 20 similar items. Apple offers 3-4 iPhone models; supermarkets are reducing product lines. Less choice often means more sales.',
      codeIntro: 'Simulate how behavioral biases affect market outcomes and compare to the "rational" prediction.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 1000 buyers choosing between 5 fish stalls
num_buyers = 1000
num_stalls = 5

# Stall prices and actual quality (1-10)
stall_prices = np.array([280, 300, 310, 350, 320])
stall_quality = np.array([7, 8, 7, 6, 9])  # actual quality
stall_names = ['Stall A', 'Stall B', 'Stall C', 'Stall D', 'Stall E']

# Rational model: buyers choose best quality/price ratio
value_ratio = stall_quality / stall_prices * 100

# Behavioral model: includes biases
def rational_choice(prices, quality):
    value = quality / prices
    return np.argmax(value)

def behavioral_choice(prices, quality, queue_lengths, anchor_price):
    choices = np.zeros(len(prices))
    for i in range(len(prices)):
        # Base value
        value = quality[i] / prices[i] * 100

        # Anchoring: compare to first price seen (anchor)
        if prices[i] < anchor_price:
            value *= 1.2  # seems like a deal

        # Herd effect: long queue = must be good
        value *= (1 + 0.05 * queue_lengths[i])

        # Loss aversion: prices above average feel "expensive"
        avg_price = np.mean(prices)
        if prices[i] > avg_price:
            value *= 0.85  # penalty for being above average

        choices[i] = value
    return np.argmax(choices)

# Simulation
rational_choices = np.zeros(num_stalls)
behavioral_choices = np.zeros(num_stalls)
queue_lengths = np.zeros(num_stalls)

for buyer in range(num_buyers):
    # Rational
    r_choice = rational_choice(stall_prices, stall_quality)
    rational_choices[r_choice] += 1

    # Behavioral (anchor = first stall they see, queue updates)
    anchor = stall_prices[np.random.randint(num_stalls)]
    b_choice = behavioral_choice(stall_prices, stall_quality, queue_lengths, anchor)
    behavioral_choices[b_choice] += 1
    queue_lengths[b_choice] += 1
    # Queues decay
    queue_lengths = np.maximum(0, queue_lengths - 0.5)

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Choice distribution
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
x = np.arange(num_stalls)
width = 0.35
ax1.bar(x - width/2, rational_choices, width, color='#3b82f6', alpha=0.8, label='Rational')
ax1.bar(x + width/2, behavioral_choices, width, color='#ef4444', alpha=0.8, label='Behavioral')
ax1.set_xticks(x)
ax1.set_xticklabels(stall_names, color='white')
ax1.set_ylabel('Customers', color='white')
ax1.set_title('Customer Distribution: Rational vs Behavioral', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Stall properties
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
colors_stall = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
ax2.bar(x - width/2, stall_prices, width, color=[c for c in colors_stall], alpha=0.5, label='Price')
ax2_twin = ax2.twinx()
ax2_twin.bar(x + width/2, stall_quality, width, color=[c for c in colors_stall], alpha=0.8, label='Quality')
ax2.set_xticks(x)
ax2.set_xticklabels(stall_names, color='white')
ax2.set_ylabel('Price (₹)', color='white')
ax2_twin.set_ylabel('Quality (1-10)', color='white')
ax2.set_title('Stall Properties', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='white')

# Anchoring experiment
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
anchors = np.linspace(200, 500, 50)
stall_b_choices = []
for anchor in anchors:
    choices = 0
    for _ in range(200):
        c = behavioral_choice(stall_prices, stall_quality, np.ones(5)*5, anchor)
        if c == 1:  # Stall B
            choices += 1
    stall_b_choices.append(choices / 200 * 100)

ax3.plot(anchors, stall_b_choices, color='#22c55e', linewidth=2)
ax3.fill_between(anchors, stall_b_choices, alpha=0.15, color='#22c55e')
ax3.axvline(stall_prices[1], color='#f59e0b', linestyle='--', linewidth=1,
            label=f'Stall B actual price (₹{stall_prices[1]})')
ax3.set_xlabel('Anchor price seen first (₹)', color='white')
ax3.set_ylabel('% choosing Stall B', color='white')
ax3.set_title('Anchoring Effect on Stall B Choice', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Revenue comparison
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
rational_revenue = rational_choices * stall_prices / 1000
behavioral_revenue = behavioral_choices * stall_prices / 1000
ax4.bar(x - width/2, rational_revenue, width, color='#3b82f6', alpha=0.8, label='Rational')
ax4.bar(x + width/2, behavioral_revenue, width, color='#ef4444', alpha=0.8, label='Behavioral')
ax4.set_xticks(x)
ax4.set_xticklabels(stall_names, color='white')
ax4.set_ylabel('Revenue (₹ thousands)', color='white')
ax4.set_title('Revenue: Rational vs Behavioral World', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Rational vs Behavioral market outcomes:")
print(f"{'Stall':10s} {'Price':>6s} {'Quality':>8s} {'Rational':>10s} {'Behavioral':>12s} {'Difference':>10s}")
for i in range(num_stalls):
    diff = (behavioral_choices[i] - rational_choices[i]) / max(rational_choices[i], 1) * 100
    print(f"  {stall_names[i]:8s} ₹{stall_prices[i]:>4.0f} {stall_quality[i]:>6.0f} {rational_choices[i]:>8.0f} {behavioral_choices[i]:>10.0f} {diff:>+8.0f}%")
print()
print("Key insight: the 'best' stall (E: highest quality/price) wins")
print("in the rational model. In the behavioral model, herding,")
print("anchoring, and loss aversion redistribute customers — some")
print("stalls win customers they 'shouldn't' have, and vice versa.")
print()
print("This is why marketing, branding, and stall placement MATTER.")
print("In a world of behavioral humans, being objectively best is")
print("not enough — you must also be perceived as best.")`,
      challenge: 'Add a "decoy stall" (Stall F) with price ₹340 and quality 6.5. It is dominated by Stall B on both dimensions. Does adding this decoy change the number of customers choosing Stall B? This is the "asymmetric dominance effect" (decoy effect) in action.',
      successHint: 'From demand curves to equilibrium to elasticity to simulation to game theory to behavioral economics — you have covered the complete spectrum of economic thinking. The Imphal night market is a microcosm of the global economy, and the tools you have learned here apply at every scale, from a single stall to international trade.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Economic Modeling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for economic modeling. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
