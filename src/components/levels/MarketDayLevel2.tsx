import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MarketDayLevel2() {
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
      title: 'Game theory in markets — strategic pricing',
      concept: `When two rice sellers compete at the market, each must consider what the OTHER will do before setting prices. This is **game theory** — the study of strategic decision-making.

The **Prisoner's Dilemma** in market pricing:
- Both sellers could keep prices high (both profit well)
- But each is tempted to undercut the other (steal all customers)
- If both undercut, BOTH earn less (price war)

The **Nash Equilibrium**: a state where no player can improve their outcome by changing strategy alone. Often, this is the "undercut" strategy — which is why competitive markets drive prices down.

Real-world applications:
- **OPEC**: oil-producing countries trying to keep prices high (cartel = cooperation)
- **Airline pricing**: constant price wars (defection)
- **Tech companies**: feature wars instead of price wars (differentiation)

The market is a game, and game theory is the playbook.`,
      analogy: 'Two rice sellers at the market are like two gas stations across the street from each other. If both charge ₹50/liter, both do fine. If one drops to ₹48, all customers go there. But then the other drops to ₹46... and soon both are selling at near-cost. The Nash Equilibrium is the lowest price that keeps both in business. Competition benefits consumers but squeezes producers.',
      storyConnection: 'On market day, the two cloth merchants eye each other\'s price boards nervously. If one lowers prices, the other must follow or lose all customers. The market\'s competitive dynamic is a repeated Prisoner\'s Dilemma — and the outcome depends on whether the merchants cooperate (implicit agreement to keep prices stable) or defect (start a price war).',
      checkQuestion: 'Why don\'t all competing sellers just agree to keep prices high (collude)?',
      checkAnswer: 'Three reasons: (1) Temptation to cheat — if the other seller keeps prices high and you secretly lower yours, you get all the customers. (2) Trust — each seller fears the other will defect first. (3) Laws — in most countries, price-fixing (collusion) is illegal because it hurts consumers. Cartels are inherently unstable because every member has an incentive to cheat.',
      codeIntro: 'Simulate a pricing game between two sellers and find the Nash Equilibrium.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Pricing game: two rice sellers
# Payoff matrix (profit for seller 1, profit for seller 2)
# Each can set price: High (₹50) or Low (₹40)

# If both High: split market equally -> 25 profit each
# If one High, one Low: Low gets 80% of market -> Low=35, High=10
# If both Low: split market but lower margin -> 18 each

payoff_matrix = {
    ('High', 'High'): (25, 25),
    ('High', 'Low'): (10, 35),
    ('Low', 'High'): (35, 10),
    ('Low', 'Low'): (18, 18),
}

# Repeated game simulation
n_rounds = 50
np.random.seed(42)

# Strategy: Tit-for-Tat (cooperate first, then copy opponent's last move)
seller1_history = []
seller2_history = []
s1_profits = []
s2_profits = []

s1_move = 'High'  # start cooperating
s2_move = 'High'

for round_n in range(n_rounds):
    profit1, profit2 = payoff_matrix[(s1_move, s2_move)]
    seller1_history.append(s1_move)
    seller2_history.append(s2_move)
    s1_profits.append(profit1)
    s2_profits.append(profit2)

    # Seller 2 occasionally defects (probability increases over time)
    old_s2 = s2_move
    if np.random.random() < 0.1 + round_n * 0.005:
        s2_move = 'Low'
    else:
        s2_move = 'High'

    # Seller 1: Tit-for-Tat
    s1_move = old_s2  # copy what seller 2 did last round

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Profits over time
ax1.set_facecolor('#111827')
ax1.plot(s1_profits, color='#22c55e', linewidth=2, label='Seller 1 (Tit-for-Tat)')
ax1.plot(s2_profits, color='#ef4444', linewidth=2, label='Seller 2 (Gradually defects)')
ax1.set_xlabel('Round', color='white')
ax1.set_ylabel('Profit (₹)', color='white')
ax1.set_title('Pricing Game: Cooperation vs. Defection', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.axhline(25, color='gray', linestyle=':', alpha=0.3)
ax1.axhline(18, color='gray', linestyle=':', alpha=0.3)

# Cumulative profits
ax2.set_facecolor('#111827')
ax2.plot(np.cumsum(s1_profits), color='#22c55e', linewidth=2, label='Seller 1 cumulative')
ax2.plot(np.cumsum(s2_profits), color='#ef4444', linewidth=2, label='Seller 2 cumulative')
ax2.set_xlabel('Round', color='white')
ax2.set_ylabel('Cumulative profit (₹)', color='white')
ax2.set_title('Long Run: Who Profits More?', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Payoff matrix:")
for (s1, s2), (p1, p2) in payoff_matrix.items():
    print(f"  S1={s1}, S2={s2}: profits = ({p1}, {p2})")
print()
print(f"Total profits after {n_rounds} rounds:")
print(f"  Seller 1 (Tit-for-Tat): ₹{sum(s1_profits)}")
print(f"  Seller 2 (Gradual defector): ₹{sum(s2_profits)}")
print()
print("Nash Equilibrium: both play Low (₹18 each)")
print("But Tit-for-Tat sustains cooperation longer, earning more for both.")`,
      challenge: 'Implement "Always Defect" (always Low price) for Seller 2 and compare against Tit-for-Tat. Then try "Forgiving Tit-for-Tat" (cooperate if opponent cooperated in ANY of last 3 rounds). Which strategy maximizes long-run profit?',
      successHint: 'Game theory reveals that markets are not just about supply and demand — they\'re about strategy. Every vendor at the market is playing a repeated game against competitors, and the best strategy depends on how the opponent plays.',
    },
    {
      title: 'Behavioral economics — why people aren\'t rational',
      concept: `Classical economics assumes people are rational: they maximize utility, process all information, and make optimal choices. **Behavioral economics** (Kahneman, Tversky) shows this is wrong.

Key biases at the market:
- **Anchoring**: the first price you see sets your expectation. "Was ₹500, now ₹300!" makes ₹300 feel cheap — even if it was always worth ₹200.
- **Loss aversion**: losing ₹100 feels worse than gaining ₹100 feels good. Sellers exploit this: "Only 3 left! Don't miss out!"
- **Status quo bias**: people stick with what they know. The farmer buys from the same seed seller every year, even if a better option exists.
- **Framing effect**: "90% fat-free" sounds better than "10% fat" — same product, different frame.
- **Hyperbolic discounting**: people prefer ₹100 today over ₹120 next month, but they'd prefer ₹120 in 13 months over ₹100 in 12 months. Time preference isn't consistent.

These biases are exploited by marketers, politicians, and anyone who wants to influence your decisions.`,
      analogy: 'The rational economic agent is like a perfect chess computer — evaluates all options, picks the optimal move. Real humans are like beginner chess players — we use shortcuts (heuristics), get distracted by shiny pieces, panic under time pressure, and are biased by our last game. Behavioral economics maps these human "bugs" so we can design systems that account for them.',
      storyConnection: 'At the market, a clever merchant places an expensive vase (₹5000) next to a moderate one (₹1500). Nobody buys the expensive vase — that\'s not the point. The expensive vase anchors the price expectation, making ₹1500 seem reasonable (even though the moderate vase is worth ₹800). The market is a laboratory of behavioral economics.',
      checkQuestion: 'A store sells a ₹1000 shirt. Version A: "20% off — now ₹800." Version B: "Buy for ₹800, save ₹200." Which framing drives more sales?',
      checkAnswer: 'Version A (percentage off) typically drives more sales for expensive items because "20% off" sounds significant. But for cheap items, Version B (₹200 saved) works better because the absolute number sounds bigger relative to the price. The optimal framing depends on whether the percentage or the absolute amount looks more impressive. This is the framing effect in action.',
      codeIntro: 'Demonstrate anchoring bias: how an irrelevant number changes people\'s price estimates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate anchoring experiment
# Two groups estimate the "fair price" of a handloom shawl
# Group A: first shown a high anchor (₹5000 price tag on nearby item)
# Group B: first shown a low anchor (₹500 price tag on nearby item)

n_per_group = 100

# True fair price: ~₹1500
true_price = 1500

# Group A (high anchor): estimates biased upward
group_a_estimates = np.random.normal(2200, 400, n_per_group)  # anchored high

# Group B (low anchor): estimates biased downward
group_b_estimates = np.random.normal(900, 350, n_per_group)   # anchored low

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Histograms
ax1.set_facecolor('#111827')
ax1.hist(group_a_estimates, bins=20, alpha=0.7, color='#ef4444', label='High anchor (₹5000 nearby)')
ax1.hist(group_b_estimates, bins=20, alpha=0.7, color='#3b82f6', label='Low anchor (₹500 nearby)')
ax1.axvline(true_price, color='#22c55e', linewidth=3, linestyle='--', label=f'True value: ₹{true_price}')
ax1.set_xlabel('Estimated fair price (₹)', color='white')
ax1.set_ylabel('Count', color='white')
ax1.set_title('Anchoring Bias: Same Shawl, Different Estimates', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Loss aversion demonstration
gains = np.linspace(0, 1000, 100)
losses = np.linspace(0, 1000, 100)

# Prospect theory value function
utility_gains = gains ** 0.88  # diminishing sensitivity for gains
utility_losses = -2.25 * losses ** 0.88  # steeper for losses (loss aversion coefficient ~2.25)

ax2.set_facecolor('#111827')
ax2.plot(gains, utility_gains, color='#22c55e', linewidth=2, label='Gains')
ax2.plot(-losses, utility_losses, color='#ef4444', linewidth=2, label='Losses')
ax2.axhline(0, color='gray', linestyle='-', alpha=0.3)
ax2.axvline(0, color='gray', linestyle='-', alpha=0.3)

# Annotate the asymmetry
ax2.annotate('Gaining ₹500\\nfeels this good', xy=(500, 500**0.88),
             xytext=(600, 300), color='#22c55e', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#22c55e'))
ax2.annotate('Losing ₹500\\nfeels THIS bad', xy=(-500, -2.25*500**0.88),
             xytext=(-400, -600), color='#ef4444', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax2.set_xlabel('Amount (₹)', color='white')
ax2.set_ylabel('Psychological value', color='white')
ax2.set_title('Loss Aversion: Losses Hurt 2.25x More', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Anchoring experiment results:")
print(f"  High anchor group mean estimate: ₹{np.mean(group_a_estimates):.0f}")
print(f"  Low anchor group mean estimate: ₹{np.mean(group_b_estimates):.0f}")
print(f"  Difference: ₹{np.mean(group_a_estimates) - np.mean(group_b_estimates):.0f}")
print(f"  True value: ₹{true_price}")
print()
print("An IRRELEVANT number (the anchor) shifted estimates by >₹1000!")
print("This is why real estate agents show you an overpriced house first.")`,
      challenge: 'Add a third group: "No anchor" (shown no price at all). Their estimates should cluster around the true value with moderate variance. How much closer to the true price are they?',
      successHint: 'Behavioral economics shows that the "rational consumer" is a myth. Understanding your own biases is the first defense against manipulation — at the village market, online shopping, or in financial decisions.',
    },
    {
      title: 'Network effects and platform economics',
      concept: `Modern markets increasingly operate as **platforms** — systems where value increases as more people join. This is the **network effect**.

Types of network effects:
- **Direct**: each new user makes the platform more valuable for all users (phone network — more people to call)
- **Indirect**: each new user on one side attracts users on the other side (market: more buyers attract more sellers attract more buyers)
- **Data network effects**: more users = more data = better algorithms = better service (Google search improves with usage)

Platform economics follows **winner-take-all** dynamics:
- Small advantages in user count lead to massive advantages in value
- This creates natural monopolies (Google, Amazon, WhatsApp)
- **Metcalfe's Law**: the value of a network is proportional to n² (n = users)

The village market is a platform: more vendors attract more customers attract more vendors. The biggest market in the region becomes dominant — smaller markets die.`,
      analogy: 'A market with network effects is like a party. The first few guests wonder if they should leave. But as more arrive, it becomes more fun, attracting even more people. After a tipping point, EVERYONE wants to be there. The party down the street (competing platform) is empty — not because it\'s worse, but because everyone is already at THIS party. First-mover advantage + network effects = dominance.',
      storyConnection: 'The story\'s market day is the most important day in the village because EVERYONE comes. A market that happens only once a week builds network effects through scarcity: concentrate all buyers and sellers on one day, and the market becomes a platform where everyone benefits from everyone else\'s presence.',
      checkQuestion: 'WhatsApp has 2 billion users. A competitor launches with better features but zero users. Can the competitor win?',
      checkAnswer: 'Extremely unlikely without a strategy to overcome the network effect. Users won\'t switch because their contacts are on WhatsApp (direct network effect). The competitor needs a "bridge strategy": either (1) interoperability (work WITH WhatsApp), (2) niche capture (dominate one group, then expand), or (3) platform shift (new medium like VR where WhatsApp has no advantage). Features alone can\'t beat network effects.',
      codeIntro: 'Model network effects: how platform value scales with users, and why winner-take-all emerges.',
      code: `import numpy as np
import matplotlib.pyplot as plt

users = np.arange(1, 1001)

# Metcalfe's Law: value proportional to n^2
metcalfe_value = users ** 2 / 1000

# Sarnoff's Law (linear): value = n (broadcast model)
sarnoff_value = users

# Reed's Law (exponential): value = 2^n (group-forming networks)
reed_value = np.minimum(2 ** (users / 100), 1e6)  # capped for visualization

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Network value laws
ax1.set_facecolor('#111827')
ax1.plot(users, sarnoff_value, color='#3b82f6', linewidth=2, label="Sarnoff's Law (linear)")
ax1.plot(users, metcalfe_value, color='#22c55e', linewidth=2, label="Metcalfe's Law (n²)")
ax1.set_xlabel('Number of users', color='white')
ax1.set_ylabel('Platform value', color='white')
ax1.set_title('Network Effects: Why Bigger = Exponentially Better', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Two competing platforms
np.random.seed(42)
months = np.arange(0, 36)
platform_a = np.zeros(36)
platform_b = np.zeros(36)
platform_a[0] = 100  # slight head start
platform_b[0] = 80

for m in range(1, 36):
    # Growth rate proportional to current size (network effect)
    growth_a = 0.08 * platform_a[m-1] * (1 - platform_a[m-1] / 10000)
    growth_b = 0.08 * platform_b[m-1] * (1 - platform_b[m-1] / 10000)

    # Users prefer the bigger platform (competitive dynamics)
    share_a = platform_a[m-1] / (platform_a[m-1] + platform_b[m-1])
    switching = 0.02 * platform_b[m-1] * (share_a - 0.5) if share_a > 0.5 else -0.02 * platform_a[m-1] * (0.5 - share_a)

    platform_a[m] = platform_a[m-1] + growth_a + switching + np.random.normal(0, 5)
    platform_b[m] = platform_b[m-1] + growth_b - switching + np.random.normal(0, 5)
    platform_a[m] = max(platform_a[m], 0)
    platform_b[m] = max(platform_b[m], 0)

ax2.set_facecolor('#111827')
ax2.plot(months, platform_a, color='#22c55e', linewidth=2, label='Platform A (started with 100)')
ax2.plot(months, platform_b, color='#ef4444', linewidth=2, label='Platform B (started with 80)')
ax2.set_xlabel('Months', color='white')
ax2.set_ylabel('Users', color='white')
ax2.set_title('Winner Take All: Small Head Start → Dominance', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

ax2.annotate('20-user head start\\nbecomes total dominance', xy=(30, platform_a[30]),
             xytext=(15, platform_a[30]*0.8), color='#f59e0b', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Network effects in action:")
print(f"  Platform A started with 100 users")
print(f"  Platform B started with 80 users")
print(f"  After 36 months: A = {platform_a[-1]:.0f}, B = {platform_b[-1]:.0f}")
print(f"  A 25% initial advantage became a {platform_a[-1]/(platform_b[-1]+1)*100:.0f}% final advantage")
print()
print("This is why tech companies spend billions on user acquisition.")
print("First-mover advantage + network effects = winner-take-all.")`,
      challenge: 'What if Platform B introduces a "killer feature" at month 12 that temporarily doubles its growth rate? Can it overcome A\'s network effect? Model this and find the threshold: how big must the feature boost be to win?',
      successHint: 'Network effects explain why the village\'s biggest market keeps getting bigger while smaller ones fade. The same dynamics drive Google, Amazon, and social media. Understanding platform economics is understanding the 21st-century economy.',
    },
    {
      title: 'Gini coefficient — measuring inequality at the market',
      concept: `After market day, some vendors made ₹10,000 and others made ₹200. How unequal is this distribution? The **Gini coefficient** measures inequality on a 0-to-1 scale:
- **0**: perfect equality (everyone earns the same)
- **1**: perfect inequality (one person earns everything)

It's calculated from the **Lorenz curve** — a graph showing what fraction of total income goes to what fraction of the population:
- If perfectly equal: the Lorenz curve is a 45° line (bottom 50% earns 50%)
- If unequal: the Lorenz curve bows below the 45° line (bottom 50% earns less than 50%)
- The Gini coefficient = the area between the 45° line and the Lorenz curve, divided by the total area under the 45° line

Real-world Gini coefficients:
- **Sweden**: 0.27 (relatively equal)
- **India**: 0.35 (moderate inequality)
- **USA**: 0.39 (high for a developed country)
- **South Africa**: 0.63 (extremely unequal)`,
      analogy: 'The Lorenz curve is like a fairness test for slicing a pie. If 10 people share a pie and each gets 10%, the Lorenz curve is a straight diagonal (fair). If 1 person gets 90% and 9 people share 10%, the curve hugs the bottom (unfair). The Gini coefficient measures how far from fair the slicing is.',
      storyConnection: 'After market day, the village elder looks at who earned what. The cloth merchant earned 40% of all market revenue. The small vegetable sellers earned almost nothing. The elder wonders: is the market making the village richer overall, or just making the richest richer? The Gini coefficient gives a precise answer.',
      checkQuestion: 'A country\'s GDP doubles, but the Gini coefficient increases from 0.30 to 0.50. Are poor people better off?',
      checkAnswer: 'It depends on whether the poor\'s ABSOLUTE income rose. If GDP doubled and the Gini increased, the rich got disproportionately richer — but the poor might still be better off in absolute terms (their income might have grown by 30% even though the rich grew by 200%). You need both metrics: GDP for overall growth, Gini for distribution. A rising tide lifts all boats — but some boats are yachts.',
      codeIntro: 'Calculate the Gini coefficient from market day earnings and plot the Lorenz curve.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Market day earnings for different scenarios
n_vendors = 50

# Scenario 1: Relatively equal village market
earnings_equal = np.random.lognormal(mean=6, sigma=0.5, size=n_vendors)

# Scenario 2: Unequal market (big merchants dominate)
earnings_unequal = np.random.lognormal(mean=5, sigma=1.5, size=n_vendors)

# Scenario 3: Very unequal (monopoly)
earnings_monopoly = np.random.lognormal(mean=4, sigma=2.5, size=n_vendors)

def lorenz_curve(earnings):
    sorted_e = np.sort(earnings)
    cumulative = np.cumsum(sorted_e) / np.sum(sorted_e)
    population = np.arange(1, len(sorted_e) + 1) / len(sorted_e)
    return population, cumulative

def gini(earnings):
    sorted_e = np.sort(earnings)
    n = len(sorted_e)
    cumulative = np.cumsum(sorted_e)
    return (2 * np.sum((np.arange(1, n+1)) * sorted_e) / (n * np.sum(sorted_e))) - (n + 1) / n

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Lorenz curves
ax1.set_facecolor('#111827')
ax1.plot([0, 1], [0, 1], 'w--', linewidth=1, label='Perfect equality')

scenarios = [
    (earnings_equal, '#22c55e', 'Equal village'),
    (earnings_unequal, '#f59e0b', 'Unequal market'),
    (earnings_monopoly, '#ef4444', 'Monopoly market'),
]

gini_values = []
for earnings, color, label in scenarios:
    pop, cum = lorenz_curve(earnings)
    g = gini(earnings)
    gini_values.append(g)
    ax1.plot(np.concatenate([[0], pop]), np.concatenate([[0], cum]),
             color=color, linewidth=2, label=f'{label} (Gini={g:.2f})')
    ax1.fill_between(np.concatenate([[0], pop]), np.concatenate([[0], cum]),
                     np.concatenate([[0], pop]), alpha=0.1, color=color)

ax1.set_xlabel('Cumulative share of vendors (poorest to richest)', color='white')
ax1.set_ylabel('Cumulative share of earnings', color='white')
ax1.set_title('Lorenz Curves: Market Day Inequality', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Earnings distribution
ax2.set_facecolor('#111827')
for earnings, color, label in scenarios:
    sorted_e = np.sort(earnings)
    ax2.plot(range(1, len(sorted_e)+1), sorted_e, color=color, linewidth=2, label=label)

ax2.set_xlabel('Vendor rank (poorest to richest)', color='white')
ax2.set_ylabel('Earnings (₹)', color='white')
ax2.set_title('Individual Earnings Distribution', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_yscale('log')

plt.tight_layout()
plt.show()

for (_, _, label), g in zip(scenarios, gini_values):
    print(f"  {label}: Gini = {g:.3f}")
print()
print("Bottom 50% share of total earnings:")
for (earnings, _, label), _ in zip(scenarios, gini_values):
    sorted_e = np.sort(earnings)
    bottom_half = np.sum(sorted_e[:25]) / np.sum(sorted_e) * 100
    print(f"  {label}: {bottom_half:.1f}%")`,
      challenge: 'Model a government transfer: take 10% of the top 10 vendors\' earnings and redistribute equally to the bottom 20. Recalculate the Gini. How much does redistribution reduce inequality?',
      successHint: 'The Gini coefficient turns a vague feeling ("the market seems unfair") into a precise number. It\'s used by the World Bank, governments, and economists to measure and compare inequality across countries and time. The village market is a microcosm of national and global inequality.',
    },
    {
      title: 'Auction theory — price discovery in action',
      concept: `At the market, rare goods (a prized bull, a special gemstone) aren't sold at fixed prices — they're **auctioned**. Auctions are mechanisms for **price discovery** when the "right" price is unknown.

Types of auctions:
- **English (ascending)**: price rises until one bidder remains. Most common. You know what others are willing to pay.
- **Dutch (descending)**: price starts high and drops. First to bid wins. Used for flowers in Netherlands.
- **First-price sealed bid**: everyone submits one bid secretly. Highest bid wins, pays their bid.
- **Second-price sealed bid (Vickrey)**: everyone bids secretly. Highest bid wins but pays the SECOND-highest price. Nobel Prize-winning design.

The **Revenue Equivalence Theorem** (Vickrey, 1961): under certain conditions, ALL four auction types yield the same expected revenue. The format doesn't matter — what matters is the bidders' valuations.

Why Vickrey (second-price) is special: bidders' optimal strategy is to bid their TRUE valuation. There's no incentive to overbid or underbid. This is called **incentive compatibility** — the auction mechanism forces honesty.`,
      analogy: 'A Vickrey auction is like a truth serum for buyers. You bid what you really think something is worth, because: (1) if you bid lower than your true value and someone bids between your bid and true value, you lose an item you wanted at a price you\'d have paid; (2) if you bid higher than your true value, you might win but overpay. The only safe strategy is honesty.',
      storyConnection: 'On market day, the village auctioneer sells a prized bull. The English auction creates excitement — each bid reveals information about the bull\'s value. The final price is the "market\'s opinion" of what the bull is worth. This is price discovery in its purest form — the auction aggregates everyone\'s private information into a single number.',
      checkQuestion: 'Google sells ad space using a variation of Vickrey auctions. Why is this better than fixed-price advertising?',
      checkAnswer: 'Because Google doesn\'t know the "right" price for an ad slot — it varies by keyword, time, location, and advertiser. The auction lets advertisers reveal their valuations (how much a click is worth to them). The Vickrey mechanism ensures truthful bidding, so Google gets the highest possible revenue while advertisers pay fair prices. It\'s a frictionless market for attention.',
      codeIntro: 'Simulate different auction types and verify the Revenue Equivalence Theorem.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n_simulations = 5000
n_bidders = 5

# Each bidder's true valuation drawn from uniform(0, 1000)
valuations = np.random.uniform(0, 1000, (n_simulations, n_bidders))

# English auction: winner pays second-highest valuation (ascending bids stop there)
english_revenue = np.sort(valuations, axis=1)[:, -2]  # second-highest

# Vickrey (second-price sealed bid): same result
vickrey_revenue = np.sort(valuations, axis=1)[:, -2]

# First-price sealed bid: optimal bid = valuation * (n-1)/n
first_price_bids = valuations * (n_bidders - 1) / n_bidders
first_price_revenue = np.max(first_price_bids, axis=1)

# Dutch auction: equivalent to first-price
dutch_revenue = first_price_revenue.copy()

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Revenue distributions
ax1.set_facecolor('#111827')
data = [english_revenue, vickrey_revenue, first_price_revenue, dutch_revenue]
labels = ['English', 'Vickrey', 'First-price', 'Dutch']
colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']
means = [np.mean(d) for d in data]

positions = range(len(labels))
bp = ax1.boxplot(data, positions=positions, patch_artist=True, widths=0.6)
for patch, color in zip(bp['boxes'], colors):
    patch.set_facecolor(color)
    patch.set_alpha(0.7)
for element in ['whiskers', 'caps', 'medians']:
    for line in bp[element]:
        line.set_color('white')

ax1.set_xticks(positions)
ax1.set_xticklabels(labels, color='white')
ax1.set_ylabel('Seller revenue (₹)', color='white')
ax1.set_title('Revenue Equivalence: All Auctions ≈ Same Revenue', color='white', fontsize=12)
ax1.tick_params(colors='gray')

for i, m in enumerate(means):
    ax1.text(i, m + 30, f'μ={m:.0f}', ha='center', color='white', fontsize=9)

# Bidding strategies comparison
ax2.set_facecolor('#111827')
true_values = np.linspace(0, 1000, 100)
optimal_fp_bid = true_values * (n_bidders - 1) / n_bidders
truthful_bid = true_values

ax2.plot(true_values, truthful_bid, color='#3b82f6', linewidth=2, label='Vickrey: bid = true value')
ax2.plot(true_values, optimal_fp_bid, color='#ef4444', linewidth=2, label=f'First-price: bid = {(n_bidders-1)/n_bidders:.0%} of value')
ax2.plot(true_values, true_values, '--', color='gray', alpha=0.3)
ax2.set_xlabel('True valuation (₹)', color='white')
ax2.set_ylabel('Optimal bid (₹)', color='white')
ax2.set_title('Optimal Bidding Strategy by Auction Type', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

ax2.annotate('In Vickrey: bid honestly\\n(dominant strategy)', xy=(600, 600),
             xytext=(200, 800), color='#3b82f6', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#3b82f6'))

plt.tight_layout()
plt.show()

print("Revenue Equivalence Theorem verified:")
for label, revenue in zip(labels, data):
    print(f"  {label}: mean=₹{np.mean(revenue):.1f}, std=₹{np.std(revenue):.1f}")
print(f"\\nAll four auction types yield ≈₹{np.mean(means):.0f} on average!")
print(f"With {n_bidders} bidders and valuations uniform on [0, 1000]:")
print(f"  Expected revenue = 1000 * (n-1)/(n+1) = {1000*(n_bidders-1)/(n_bidders+1):.0f}")`,
      challenge: 'Add a "reserve price" of ₹300 (no sale if highest bid < 300). How does this affect revenue? Does Revenue Equivalence still hold? (Hint: it changes — reserve prices break the theorem.)',
      successHint: 'Auction theory is one of the most successful applications of economics. It designs billions of dollars worth of markets: spectrum auctions, ad auctions, electricity markets, and Treasury bond auctions. The village auctioneer and Google\'s ad system are solving the same fundamental problem — discovering the right price when nobody knows what it is.',
    },
    {
      title: 'Development economics — can markets lift a village out of poverty?',
      concept: `The big question: can market economics transform a poor village into a prosperous one? **Development economics** studies this across the world.

Key insights:
- **Poverty traps**: you need money to make money. Without initial capital, you can't invest → can't grow → stay poor. Breaking this cycle requires external injection (aid, credit, infrastructure).
- **Microfinance**: small loans to poor entrepreneurs. Muhammad Yunus (Nobel Prize 2006) showed that even $20 loans can start a business. But evidence is mixed — it works for some, creates debt spirals for others.
- **Randomized controlled trials (RCTs)**: Banerjee and Duflo (Nobel Prize 2019) brought rigorous experimentation to development economics. Don't guess what helps — test it.
- **Institutions matter**: property rights, rule of law, transparent governance. Countries with good institutions grow; those without don't — regardless of natural resources.

The village market is the foundation: without a functioning market, specialization, trade, and growth can't happen. But the market alone isn't enough — you also need roads, schools, healthcare, and fair governance.`,
      analogy: 'Economic development is like launching a rocket. You need fuel (capital), a launchpad (infrastructure), navigation (institutions), and thrust (markets + trade). Missing any one component and the rocket doesn\'t launch. Poverty traps are like gravity — you need a minimum escape velocity to break free. Once in orbit (self-sustaining growth), the economy can maintain itself.',
      storyConnection: 'The story\'s market day is a starting point, not an end. The village has trade, specialization, and basic economics. But to grow beyond subsistence, it needs roads (to reach bigger markets), education (to produce higher-value goods), credit (to invest in better tools), and governance (to enforce contracts and prevent fraud). The market is necessary but not sufficient.',
      checkQuestion: 'Many African countries are rich in natural resources (oil, diamonds, minerals) but remain poor. Why doesn\'t natural wealth translate to national prosperity?',
      checkAnswer: 'The "resource curse" (paradox of plenty): (1) Resource wealth concentrates power in whoever controls extraction (usually elites/dictators), not the population. (2) It distorts the economy — other sectors (manufacturing, services) atrophy because resources are more profitable. (3) Revenue volatility (commodity price swings) prevents long-term planning. (4) It weakens institutions — when government revenue comes from oil rather than taxes, government accountability to citizens drops. Norway solved this with a sovereign wealth fund and strong institutions. Most resource-rich countries haven\'t.',
      codeIntro: 'Model a poverty trap and show how a small intervention (loan, road, school) can break the cycle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Poverty trap model
# Income next year = f(income this year)
# Below threshold: income shrinks (poverty trap)
# Above threshold: income grows (escape to prosperity)

income_range = np.linspace(0, 200, 500)
threshold = 50

# Income dynamics: S-shaped function
next_income = 200 / (1 + np.exp(-0.08 * (income_range - threshold))) - 10
# Add some minimum subsistence
next_income = np.maximum(next_income, 5)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Phase diagram
ax1.set_facecolor('#111827')
ax1.plot(income_range, next_income, color='#3b82f6', linewidth=2, label='Next year income')
ax1.plot(income_range, income_range, 'w--', linewidth=1, label='No change line')
ax1.axvline(threshold, color='#f59e0b', linestyle=':', label=f'Poverty threshold (₹{threshold}k)')

# Mark equilibria
ax1.plot(15, 15, 'o', color='#ef4444', markersize=12, zorder=5)
ax1.annotate('Poverty trap\\n(stable)', xy=(15, 15), xytext=(25, 50), color='#ef4444', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax1.plot(170, 170, 'o', color='#22c55e', markersize=12, zorder=5)
ax1.annotate('Prosperity\\n(stable)', xy=(170, 170), xytext=(120, 150), color='#22c55e', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#22c55e'))

ax1.set_xlabel('Current annual income (₹ thousands)', color='white')
ax1.set_ylabel('Next year annual income (₹ thousands)', color='white')
ax1.set_title('Poverty Trap: Two Equilibria', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Simulation: three villages with different interventions
years = 30
village_none = np.zeros(years)    # no intervention
village_loan = np.zeros(years)    # one-time loan at year 5
village_infra = np.zeros(years)   # infrastructure at year 5

village_none[0] = 30  # starting income below threshold
village_loan[0] = 30
village_infra[0] = 30

for y in range(1, years):
    for village, intervention_year, boost in [
        (village_none, -1, 0),
        (village_loan, 5, 30),     # ₹30k loan
        (village_infra, 5, 0),     # infrastructure (permanent growth boost)
    ]:
        inc = village[y-1]
        if y == intervention_year:
            inc += boost
        # Growth dynamics
        growth = 0.05 * (inc - threshold) if inc > threshold else -0.02 * (threshold - inc)
        if village is village_infra and y >= 5:
            growth += 3  # permanent boost from roads/school
        village[y] = max(inc + growth + np.random.normal(0, 2), 5)

ax2.set_facecolor('#111827')
ax2.plot(range(years), village_none, color='#ef4444', linewidth=2, label='No intervention')
ax2.plot(range(years), village_loan, color='#f59e0b', linewidth=2, label='One-time loan (year 5)')
ax2.plot(range(years), village_infra, color='#22c55e', linewidth=2, label='Infrastructure (year 5)')
ax2.axhline(threshold, color='gray', linestyle=':', alpha=0.5)
ax2.axvline(5, color='white', linestyle=':', alpha=0.3)
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Annual income (₹ thousands)', color='white')
ax2.set_title('Breaking the Poverty Trap: Interventions Matter', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Poverty trap simulation (30 years):")
print(f"  No intervention: income = ₹{village_none[-1]:.0f}k (stuck in trap)")
print(f"  One-time loan: income = ₹{village_loan[-1]:.0f}k")
print(f"  Infrastructure: income = ₹{village_infra[-1]:.0f}k")
print()
print("Infrastructure wins because it provides a PERMANENT growth boost,")
print("not just a one-time push. Roads, schools, and clinics change the")
print("underlying dynamics — they bend the growth curve upward.")`,
      challenge: 'Add a fourth intervention: education (takes 10 years to show effect but then doubles the growth rate). Model it and compare. Is delayed but powerful intervention better than immediate but temporary?',
      successHint: 'From supply and demand to game theory to behavioral economics to development — you\'ve traced economics from the village market to the global challenge of poverty. The market is where economics becomes real, where theory meets the farmer, the weaver, and the fisherman.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Economics & Game Theory</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced economic models. Click to start.</p>
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
