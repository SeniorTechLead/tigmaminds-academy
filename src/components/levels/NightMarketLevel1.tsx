import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function NightMarketLevel1() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Supply and demand — the invisible hand of the market',
      concept: `At the Imphal night market, a vendor has 50 kg of fresh fish. Hundreds of customers want fish for dinner. How does the price get set? Nobody decides it centrally — it emerges from **supply and demand**.

**Demand**: the quantity buyers are willing to purchase at each price. As price rises, fewer people buy (they switch to chicken, or eat less). Demand slopes **downward**.

**Supply**: the quantity sellers are willing to offer at each price. As price rises, more vendors bring fish (it's more profitable). Supply slopes **upward**.

Where supply meets demand is the **equilibrium** — the price at which exactly the amount produced equals the amount consumed. No surplus, no shortage.

If the price is too high: supply > demand → fish goes unsold → vendors lower prices
If the price is too low: demand > supply → customers can't find fish → they bid prices up

This self-correcting mechanism is what Adam Smith called the "invisible hand." No one plans it. It emerges from thousands of individual decisions by buyers and sellers, each acting in their own interest.

The Imphal night market demonstrates this every evening: prices for fresh produce start high when the market opens, and drop as closing time approaches and vendors try to sell remaining stock.`,
      analogy: 'Supply and demand is like a see-saw. On one side sit the buyers (demand), on the other the sellers (supply). The price is the fulcrum point. If too many buyers pile on (high demand), the see-saw tips and the price rises until some buyers get off. If too many sellers pile on (high supply), the price drops until some sellers give up. Equilibrium is when the see-saw balances perfectly.',
      storyConnection: 'The night market of Imphal is a living economics classroom. The Ima Keithel (Mothers\' Market), run entirely by women, is one of the largest women-run markets in Asia. Over 5,000 women vendors set prices, negotiate, and trade — creating a functioning market economy without any central authority. The "invisible hand" works through their collective decisions.',
      checkQuestion: 'During a festival, demand for flowers at the night market doubles. If supply stays the same, what happens to the price?',
      checkAnswer: 'The price rises. With double the demand and the same supply, more customers compete for the same flowers, bidding the price up. The new equilibrium is at a higher price and the same quantity (since supply hasn\'t changed). This is why flowers cost 2-3x more during Diwali, weddings, and festivals. Vendors anticipate this and sometimes grow extra flowers specifically for festival seasons — eventually increasing supply to partially offset the price spike.',
      codeIntro: 'Model supply and demand curves and find the market equilibrium price.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Supply and demand model for fish at Imphal night market
prices = np.linspace(50, 500, 200)  # ₹ per kg

# Demand: Q_d = 1000 - 1.5 * P (linear, downward sloping)
demand = 1000 - 1.5 * prices

# Supply: Q_s = -200 + 2 * P (linear, upward sloping)
supply = -200 + 2 * prices

# Equilibrium: where supply = demand
# 1000 - 1.5P = -200 + 2P → 1200 = 3.5P → P = 342.86
eq_price = 1200 / 3.5
eq_quantity = 1000 - 1.5 * eq_price

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Supply and demand
ax1.set_facecolor('#111827')
ax1.plot(demand, prices, color='#3b82f6', linewidth=2, label='Demand')
ax1.plot(supply, prices, color='#ef4444', linewidth=2, label='Supply')
ax1.plot(eq_quantity, eq_price, 'o', color='#f59e0b', markersize=15, zorder=5)
ax1.annotate(f'Equilibrium\\n₹{eq_price:.0f}/kg, {eq_quantity:.0f} kg',
             xy=(eq_quantity, eq_price), xytext=(eq_quantity + 100, eq_price + 50),
             color='#f59e0b', fontsize=10, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Surplus and shortage zones
ax1.fill_betweenx(prices[prices > eq_price], demand[prices > eq_price], supply[prices > eq_price],
                  where=supply[prices > eq_price] > demand[prices > eq_price],
                  alpha=0.1, color='#ef4444', label='Surplus (price too high)')
ax1.fill_betweenx(prices[prices < eq_price], demand[prices < eq_price], supply[prices < eq_price],
                  where=demand[prices < eq_price] > supply[prices < eq_price],
                  alpha=0.1, color='#3b82f6', label='Shortage (price too low)')

ax1.set_xlabel('Quantity (kg)', color='white')
ax1.set_ylabel('Price (₹/kg)', color='white')
ax1.set_title('Supply & Demand: Fish at Imphal Night Market', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_xlim(0, max(demand.max(), supply.max()))
ax1.set_ylim(50, 500)

# Shift scenarios
ax2.set_facecolor('#111827')
# Festival: demand doubles
demand_festival = 2000 - 1.5 * prices
eq_fest_price = 2200 / 3.5
eq_fest_qty = 2000 - 1.5 * eq_fest_price

# Monsoon: supply halves
supply_monsoon = -100 + 1.0 * prices
eq_mon_price = 1100 / 2.5
eq_mon_qty = 1000 - 1.5 * eq_mon_price

ax2.plot(demand, prices, color='#3b82f6', linewidth=2, label='Normal demand')
ax2.plot(supply, prices, color='#ef4444', linewidth=2, label='Normal supply')
ax2.plot(demand_festival, prices, color='#3b82f6', linewidth=2, linestyle='--', label='Festival demand (2x)')
ax2.plot(supply_monsoon, prices, color='#ef4444', linewidth=2, linestyle='--', label='Monsoon supply (½)')

ax2.plot(eq_quantity, eq_price, 'o', color='#f59e0b', markersize=12, zorder=5)
ax2.plot(eq_fest_qty, eq_fest_price, 's', color='#a855f7', markersize=12, zorder=5)
ax2.plot(eq_mon_qty, eq_mon_price, '^', color='#22c55e', markersize=12, zorder=5)

ax2.annotate(f'Normal\\n₹{eq_price:.0f}', xy=(eq_quantity, eq_price),
             xytext=(eq_quantity+50, eq_price-40), color='#f59e0b', fontsize=8)
ax2.annotate(f'Festival\\n₹{eq_fest_price:.0f}', xy=(eq_fest_qty, eq_fest_price),
             xytext=(eq_fest_qty+50, eq_fest_price+20), color='#a855f7', fontsize=8)
ax2.annotate(f'Monsoon\\n₹{eq_mon_price:.0f}', xy=(eq_mon_qty, eq_mon_price),
             xytext=(eq_mon_qty+50, eq_mon_price-40), color='#22c55e', fontsize=8)

ax2.set_xlabel('Quantity (kg)', color='white')
ax2.set_ylabel('Price (₹/kg)', color='white')
ax2.set_title('Demand & Supply Shifts', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 1200)
ax2.set_ylim(50, 500)

plt.tight_layout()
plt.show()

print("Imphal Night Market — Fish Price Analysis:")
print(f"  Normal: ₹{eq_price:.0f}/kg, {eq_quantity:.0f} kg sold")
print(f"  Festival (2x demand): ₹{eq_fest_price:.0f}/kg, {eq_fest_qty:.0f} kg sold")
print(f"  Monsoon (½ supply): ₹{eq_mon_price:.0f}/kg, {eq_mon_qty:.0f} kg sold")
print(f"  Festival price increase: +{(eq_fest_price-eq_price)/eq_price*100:.0f}%")
print(f"  Monsoon price increase: +{(eq_mon_price-eq_price)/eq_price*100:.0f}%")`,
      challenge: 'What if the government sets a price ceiling of ₹200/kg to keep fish affordable? At that price, what is the demand? What is the supply? What is the shortage?',
      successHint: 'Supply and demand is the most fundamental model in economics. Every price — from fish in Imphal to oil in global markets — is determined by this interaction. Understanding it helps you predict price changes, evaluate policies, and recognise market manipulation.',
    },
    {
      title: 'Price discovery — how the market finds the right price',
      concept: `The equilibrium price doesn't appear magically. It is **discovered** through the interaction of buyers and sellers over time. This process is called **price discovery**.

At the Imphal night market, price discovery happens through:
1. **Opening prices**: vendors set initial prices based on yesterday's prices, today's supply, and expectations
2. **Negotiation**: buyers and sellers haggle, each revealing how much they value the goods
3. **Competition**: if one vendor prices too high, customers go to the next stall
4. **Information**: word spreads that "fish is cheap at stall 14" — prices converge

Price discovery requires:
- **Many buyers and sellers**: no single person controls the price
- **Information flow**: participants know what others are charging
- **Freedom to trade**: buyers can choose any vendor, vendors can refuse any offer
- **Repeat interactions**: today's prices influence tomorrow's decisions

**Auction** is a formalised price discovery mechanism:
- **English auction** (ascending): bidders raise prices until one remains (eBay)
- **Dutch auction** (descending): price starts high and drops until someone buys
- **Sealed bid**: everyone submits a price privately, highest wins

The night market is essentially a continuous, informal English auction — buyers "bid" by their willingness to pay, and vendors "accept" or "reject" in real time.`,
      analogy: 'Price discovery is like a game of hot-and-cold. The market "guesses" a price (hot!), and buyers and sellers react — too expensive (cold!), too cheap (warm!). Through constant adjustment, the price converges on the equilibrium (burning hot!). No one tells the market where the equilibrium is — it discovers it through trial and error, repeated thousands of times a day.',
      storyConnection: 'At the Ima Keithel, the women vendors are master price discoverers. They observe how fast their neighbours sell, how many customers are in the market, what the wholesale price was that morning, and how fresh their stock is. They adjust prices minute by minute — raising them during rush hour, dropping them as closing time approaches. Their collective intelligence discovers the right price more accurately than any economic model.',
      checkQuestion: 'Why do identical vegetables sometimes have different prices at different stalls in the same market?',
      checkAnswer: 'Price differences reflect imperfect information and non-price factors: (1) Location — a stall near the entrance gets more foot traffic and can charge more. (2) Reputation — a trusted vendor charges a premium for quality assurance. (3) Search costs — customers don\'t check every stall, so some pay more simply because they stopped searching. (4) Freshness — even "identical" vegetables differ in quality. (5) Relationships — regular customers get discounts. In a perfectly efficient market, prices would converge instantly. Real markets are imperfect, which is why shopping skill (information gathering) has economic value.',
      codeIntro: 'Simulate price discovery through repeated interactions between buyers and sellers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate price discovery over an evening at the night market
num_rounds = 100  # trading rounds (minutes)
num_sellers = 10
num_buyers_per_round = 15

# True equilibrium price (unknown to participants)
true_eq = 300  # ₹/kg

# Sellers start with estimated prices (spread around true eq)
seller_prices = np.random.normal(true_eq, 60, num_sellers)
seller_prices = np.clip(seller_prices, 150, 500)

# Track price history
price_history = [seller_prices.copy()]
transaction_prices = []
convergence = []

for round_num in range(num_rounds):
    # Buyers arrive with willingness to pay (WTP)
    buyer_wtp = np.random.normal(true_eq + 20, 50, num_buyers_per_round)
    buyer_wtp = np.clip(buyer_wtp, 100, 500)

    round_transactions = []

    # Each buyer visits 3 random sellers and buys from cheapest (if WTP >= price)
    for wtp in buyer_wtp:
        visited = np.random.choice(num_sellers, min(3, num_sellers), replace=False)
        affordable = [(s, seller_prices[s]) for s in visited if seller_prices[s] <= wtp]
        if affordable:
            best_seller, best_price = min(affordable, key=lambda x: x[1])
            # Transaction occurs at seller's price
            round_transactions.append(best_price)
            # Seller adjusts: sold → maybe raise price slightly
            seller_prices[best_seller] *= 1.01
        else:
            # No affordable seller: signal that prices are too high
            for s in visited:
                seller_prices[s] *= 0.99  # lower price slightly

    # Sellers who didn't sell lower prices
    sales_count = np.zeros(num_sellers)
    for price in round_transactions:
        closest = np.argmin(np.abs(seller_prices - price))
        sales_count[closest] += 1

    for s in range(num_sellers):
        if sales_count[s] == 0:
            seller_prices[s] *= 0.97  # no sales → drop price faster

    price_history.append(seller_prices.copy())
    transaction_prices.extend(round_transactions)
    convergence.append(np.std(seller_prices))

price_history = np.array(price_history)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Price convergence over time
ax1.set_facecolor('#111827')
for s in range(num_sellers):
    ax1.plot(price_history[:, s], color=f'C{s}', alpha=0.5, linewidth=1)
ax1.axhline(true_eq, color='#f59e0b', linestyle='--', linewidth=2, label=f'True equilibrium (₹{true_eq})')
ax1.fill_between(range(len(price_history)),
                 np.mean(price_history, axis=1) - np.std(price_history, axis=1),
                 np.mean(price_history, axis=1) + np.std(price_history, axis=1),
                 alpha=0.2, color='#22c55e')
ax1.plot(np.mean(price_history, axis=1), color='#22c55e', linewidth=2, label='Mean price')
ax1.set_xlabel('Trading round (minutes)', color='white')
ax1.set_ylabel('Price (₹/kg)', color='white')
ax1.set_title('Price Discovery: 10 Sellers Converging to Equilibrium', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Price spread (convergence)
ax2.set_facecolor('#111827')
ax2.plot(convergence, color='#a855f7', linewidth=2)
ax2.fill_between(range(len(convergence)), convergence, alpha=0.15, color='#a855f7')
ax2.set_xlabel('Trading round', color='white')
ax2.set_ylabel('Price spread (std dev, ₹)', color='white')
ax2.set_title('Market Convergence: Price Spread Decreasing', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Price discovery simulation:")
print(f"  Starting prices: mean ₹{price_history[0].mean():.0f}, spread ₹{price_history[0].std():.0f}")
print(f"  Final prices: mean ₹{price_history[-1].mean():.0f}, spread ₹{price_history[-1].std():.0f}")
print(f"  True equilibrium: ₹{true_eq}")
print(f"  Convergence: {convergence[0]:.0f} → {convergence[-1]:.0f} (₹ std dev)")
print(f"  Total transactions: {len(transaction_prices)}")
print(f"  Avg transaction price: ₹{np.mean(transaction_prices):.0f}")`,
      challenge: 'What if one seller starts with perfect information (price = true equilibrium)? Do other sellers converge faster? What if that informed seller is a monopolist (only seller)?',
      successHint: 'Price discovery is one of the most important functions markets perform. Stock exchanges, commodity markets, and even night markets all discover prices through the same fundamental process: interaction, information, and adjustment.',
    },
    {
      title: 'Barter vs money — why we invented currency',
      concept: `Before money, people traded directly: rice for fish, cloth for firewood. This is **barter** — exchanging goods for goods. Barter works but has severe limitations:

1. **Double coincidence of wants**: you need fish, the fisher needs rice, AND you happen to meet. Three conditions must align simultaneously.
2. **Indivisibility**: if a cow is worth 100 kg of rice, but you only need 5 kg, how do you make change?
3. **No standard of value**: is 1 fish worth 2 kg of rice or 3? Every pair of goods needs its own exchange rate.
4. **Perishability**: you can't store fish for months to trade later. Money doesn't rot.

With N goods in a barter economy, you need **N(N-1)/2** exchange rates. With 100 goods, that's 4,950 rates. Money reduces this to just **N** prices (100). This is why every civilisation independently invented money.

**Money** works because everyone agrees it has value (social convention). It must be:
- **Medium of exchange**: accepted by everyone
- **Store of value**: doesn't lose value over time
- **Unit of account**: provides a common measure
- **Divisible**: can make change

At the Imphal night market, cash and increasingly UPI (digital payments) serve as money. But informal barter still happens: a fishmonger exchanges fish with the vegetable vendor next door, bypassing cash entirely.`,
      analogy: 'Barter is like trying to communicate in a room where everyone speaks a different language. You speak Hindi, the person with fish speaks Meitei, the rice seller speaks Naga. Communication (trade) requires finding someone who speaks YOUR language AND has what you want. Money is like a universal translator — everyone can communicate through it, making trade possible between any two people regardless of what they produce.',
      storyConnection: 'The Ima Keithel has operated for over 500 years. In its early history, barter was common — handwoven cloth for dried fish, bamboo for rice. As Manipur\'s economy developed, cowrie shells, then coins, then paper currency became the medium of exchange. Today, a vendor might accept cash, UPI, or even barter with a neighbouring vendor. The market preserves the full history of economic exchange systems.',
      checkQuestion: 'Bitcoin and other cryptocurrencies are sometimes called "digital money." Do they fulfil the three functions of money (medium of exchange, store of value, unit of account)?',
      checkAnswer: 'Partially. Medium of exchange: limited — most shops don\'t accept Bitcoin, and transactions are slow. Store of value: volatile — Bitcoin\'s price can swing 20% in a day, making it risky. Unit of account: rarely used — almost no one prices goods in Bitcoin (they price in rupees/dollars and convert). By economists\' standards, Bitcoin is more like a speculative asset (digital gold) than a functional currency. The most successful "digital money" in India is UPI — it meets all three criteria because it is backed by the rupee and widely accepted.',
      codeIntro: 'Simulate a barter economy vs a money economy and compare efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulation: N agents, each produces one good and wants another
num_agents = 50
num_goods = 10  # types of goods
num_rounds = 200

# Each agent: produces one good, wants one other good
produces = np.random.randint(0, num_goods, num_agents)
wants = np.random.randint(0, num_goods, num_agents)
# Ensure wants ≠ produces
for i in range(num_agents):
    while wants[i] == produces[i]:
        wants[i] = np.random.randint(0, num_goods)

# Barter economy: trade only if double coincidence of wants
def barter_round(produces, wants, num_agents):
    trades = 0
    satisfied = np.zeros(num_agents, dtype=bool)
    for i in range(num_agents):
        if satisfied[i]:
            continue
        for j in range(i+1, num_agents):
            if satisfied[j]:
                continue
            # Double coincidence: i has what j wants AND j has what i wants
            if produces[i] == wants[j] and produces[j] == wants[i]:
                trades += 1
                satisfied[i] = True
                satisfied[j] = True
                break
    return trades, np.sum(satisfied)

# Money economy: sell your good for money, buy what you want with money
def money_round(produces, wants, num_agents):
    # Everyone can trade: sell production for money, buy wants with money
    # Simplified: if anyone produces what you want, you can trade
    trades = 0
    satisfied = np.zeros(num_agents, dtype=bool)
    supply = np.zeros(num_goods)
    demand = np.zeros(num_goods)

    for i in range(num_agents):
        supply[produces[i]] += 1
        demand[wants[i]] += 1

    for i in range(num_agents):
        # Can I sell my product? (is there demand?)
        can_sell = demand[produces[i]] > 0
        # Can I buy what I want? (is there supply?)
        can_buy = supply[wants[i]] > 0
        if can_sell and can_buy:
            satisfied[i] = True
            trades += 1

    return trades, np.sum(satisfied)

# Run simulation
barter_trades_history = []
money_trades_history = []
barter_satisfied_history = []
money_satisfied_history = []

for _ in range(num_rounds):
    # Reshuffle wants each round (simulating different days)
    for i in range(num_agents):
        wants[i] = np.random.randint(0, num_goods)
        while wants[i] == produces[i]:
            wants[i] = np.random.randint(0, num_goods)

    bt, bs = barter_round(produces, wants, num_agents)
    mt, ms = money_round(produces, wants, num_agents)
    barter_trades_history.append(bt)
    money_trades_history.append(mt)
    barter_satisfied_history.append(bs)
    money_satisfied_history.append(ms)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Trades per round
ax1.set_facecolor('#111827')
ax1.hist(barter_satisfied_history, bins=20, color='#ef4444', alpha=0.6, label='Barter', edgecolor='none')
ax1.hist(money_satisfied_history, bins=20, color='#22c55e', alpha=0.6, label='Money', edgecolor='none')
ax1.set_xlabel('Agents satisfied per round', color='white')
ax1.set_ylabel('Count', color='white')
ax1.set_title('Trade Efficiency: Barter vs Money', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Cumulative satisfaction
ax2.set_facecolor('#111827')
cum_barter = np.cumsum(barter_satisfied_history)
cum_money = np.cumsum(money_satisfied_history)
ax2.plot(cum_barter, color='#ef4444', linewidth=2, label='Barter (cumulative)')
ax2.plot(cum_money, color='#22c55e', linewidth=2, label='Money (cumulative)')
ax2.set_xlabel('Trading round', color='white')
ax2.set_ylabel('Total satisfied trades', color='white')
ax2.set_title('Cumulative Trade Success', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

avg_barter = np.mean(barter_satisfied_history)
avg_money = np.mean(money_satisfied_history)
print(f"Barter vs Money ({num_agents} agents, {num_goods} goods, {num_rounds} rounds):")
print(f"  Barter: avg {avg_barter:.1f} agents satisfied per round ({avg_barter/num_agents*100:.0f}%)")
print(f"  Money: avg {avg_money:.1f} agents satisfied per round ({avg_money/num_agents*100:.0f}%)")
print(f"  Money is {avg_money/max(avg_barter,0.1):.1f}x more efficient")
print(f"  Exchange rates needed: Barter={num_goods*(num_goods-1)//2}, Money={num_goods}")`,
      challenge: 'Increase num_goods from 10 to 50. How does this change the barter efficiency? Money efficiency? The gap should widen dramatically — this is why complex economies NEED money.',
      successHint: 'Money is one of humanity\'s most important inventions. Understanding why it works (and when it fails — inflation, counterfeiting, loss of trust) is fundamental to understanding economics, history, and society.',
    },
    {
      title: 'Market types — from street stalls to stock exchanges',
      concept: `Not all markets are like the Imphal night market. Markets come in many forms, each suited to different types of goods:

**By structure**:
- **Perfect competition**: many sellers, identical products, no one controls price (rice market)
- **Monopoly**: one seller controls the market (Indian Railways for trains)
- **Oligopoly**: few large sellers (Indian telecom: Jio, Airtel, Vi)
- **Monopolistic competition**: many sellers, slightly different products (restaurants)

**By physical form**:
- **Spot market**: buy and pay now (night market)
- **Futures market**: agree today to trade at a future date and price (commodity exchanges)
- **Online market**: digital platform connecting buyers and sellers (Amazon, OLX)
- **Auction market**: competitive bidding (eBay, government tenders)

**By geographic scope**:
- **Local market**: Ima Keithel serves Imphal and nearby villages
- **Regional market**: Northeast India markets connect through wholesalers
- **National market**: agricultural mandis connected by APMC system
- **Global market**: international commodity exchanges (NCDEX, MCX)

The Imphal night market is closest to **monopolistic competition** with **spot trading**: many sellers, slightly differentiated products (this vendor's fish is fresher than that one's), and immediate exchange. Understanding which market type you're in determines your strategy as buyer or seller.`,
      analogy: 'Market types are like different sports. Perfect competition is like a sprint — everyone follows the same rules, the fastest wins, and no one can change the rules. Monopoly is like being the only person with a ball — everyone has to play your game at your price. Oligopoly is like a basketball team — a few big players dominate and coordinate (sometimes cooperate, sometimes compete). The night market is like a crowded pickup game — many players, loose rules, and your reputation matters as much as your skill.',
      storyConnection: 'The Ima Keithel evolved over centuries from a purely local spot market to a regional hub. Vendors now source goods from across the Northeast and even Bangladesh. The market structure has changed too: some stalls have become semi-monopolies (the only vendor of certain traditional textiles), while vegetables remain fiercely competitive. Understanding these structures helps vendors set better prices and buyers make smarter choices.',
      checkQuestion: 'If all vendors at the night market secretly agreed to charge ₹400/kg for fish (instead of the equilibrium ₹300), would this work?',
      checkAnswer: 'This is called collusion (forming a cartel), and it tends to fail for three reasons: (1) Incentive to cheat — if all others charge ₹400, one vendor can steal all customers by charging ₹380. (2) Entry — high prices attract new vendors who undercut the cartel. (3) Detection — in a market with 5,000 vendors, secret agreements are nearly impossible to enforce. Cartels can work temporarily in oligopolies (few sellers, easy to monitor), but not in competitive markets like the night market. This is why competition is the consumer\'s best friend.',
      codeIntro: 'Simulate different market structures and their effect on price and quantity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

prices = np.linspace(50, 500, 200)

# Demand (same for all market types)
demand = 1000 - 1.5 * prices

# Market structures
# 1. Perfect competition: price = marginal cost
mc = 100 + 0.5 * demand  # marginal cost increases with output
pc_price = 200  # where P = MC (approximately)
pc_qty = 1000 - 1.5 * pc_price

# 2. Monopoly: set quantity where MR = MC, charge higher price
# MR = 667 - Q/0.75 (derived from inverse demand)
# MC = 100 + 0.5Q
# MR = MC → optimal Q → higher P
mon_qty = 350  # simplified
mon_price = (1000 - mon_qty) / 1.5

# 3. Oligopoly (Cournot with 3 firms): between monopoly and perfect competition
oli_qty = 500  # between mon_qty and pc_qty
oli_price = (1000 - oli_qty) / 1.5

# 4. Monopolistic competition: slightly above PC due to differentiation
moc_price = 250
moc_qty = 1000 - 1.5 * moc_price

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Price and quantity comparison
ax1.set_facecolor('#111827')
ax1.plot(demand, prices, color='#3b82f6', linewidth=2, label='Market demand')

markets = [
    ('Perfect\\ncompetition', pc_price, pc_qty, '#22c55e'),
    ('Monopolistic\\ncompetition', moc_price, moc_qty, '#3b82f6'),
    ('Oligopoly\\n(3 firms)', oli_price, oli_qty, '#f59e0b'),
    ('Monopoly', mon_price, mon_qty, '#ef4444'),
]

for name, price, qty, color in markets:
    ax1.plot(qty, price, 'o', color=color, markersize=12, zorder=5)
    ax1.annotate(f'{name}\\n₹{price:.0f}, {qty:.0f}kg', xy=(qty, price),
                 xytext=(qty+30, price+15), color=color, fontsize=8, fontweight='bold')

ax1.set_xlabel('Quantity (kg)', color='white')
ax1.set_ylabel('Price (₹/kg)', color='white')
ax1.set_title('Market Structure → Price & Quantity', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Consumer and producer welfare
ax2.set_facecolor('#111827')
market_names = [m[0].replace('\\n', ' ') for m in markets]
market_prices = [m[1] for m in markets]
market_qtys = [m[2] for m in markets]
market_colors = [m[3] for m in markets]

# Consumer surplus ∝ (max_wtp - price) × quantity / 2
max_wtp = 667  # price at Q=0
consumer_surplus = [(max_wtp - p) * q / 2 / 1000 for p, q in zip(market_prices, market_qtys)]
producer_surplus = [(p - 100) * q / 2 / 1000 for p, q in zip(market_prices, market_qtys)]  # simplified

x_pos = np.arange(len(market_names))
width = 0.35
bars1 = ax2.bar(x_pos - width/2, consumer_surplus, width, color='#3b82f6', alpha=0.8, label='Consumer surplus')
bars2 = ax2.bar(x_pos + width/2, producer_surplus, width, color='#ef4444', alpha=0.8, label='Producer surplus')

ax2.set_xticks(x_pos)
ax2.set_xticklabels(market_names, fontsize=7, color='white')
ax2.set_ylabel('Surplus (₹ thousands)', color='white')
ax2.set_title('Who Benefits? Consumer vs Producer', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Market structure comparison:")
print(f"{'Structure':25s} {'Price':>8s} {'Quantity':>10s} {'Consumer':>10s} {'Producer':>10s}")
for name, price, qty, cs, ps in zip(market_names, market_prices, market_qtys, consumer_surplus, producer_surplus):
    print(f"  {name:23s} ₹{price:>5.0f} {qty:>8.0f}kg {cs:>8.0f}k {ps:>8.0f}k")
print()
print("Key insight: more competition → lower prices, higher quantity, more consumer surplus")
print("Monopoly maximises producer surplus at the expense of consumers and efficiency")`,
      challenge: 'Add a government-imposed price ceiling at ₹250. In which market structures does the ceiling have an effect? Where does it cause a shortage?',
      successHint: 'Market structure determines who holds power — sellers or buyers. Understanding it helps consumers avoid overpaying, helps producers find profitable niches, and helps policymakers design fair regulations.',
    },
    {
      title: 'Supply chains basics — from farm to night market stall',
      concept: `The fish at the Imphal night market didn't appear by magic. It travelled through a **supply chain** — the network of people, activities, and resources that move a product from origin to consumer.

A typical fish supply chain in Manipur:
1. **Fisherman**: catches fish in Loktak Lake or river (₹80/kg cost)
2. **Aggregator**: collects from multiple fishermen, sorts by quality (adds ₹20/kg)
3. **Transporter**: trucks fish from lake to market (adds ₹30/kg for fuel, ice, vehicle)
4. **Wholesaler**: buys in bulk at the mandi, sells to retailers (adds ₹40/kg markup)
5. **Retailer** (market vendor): buys from wholesaler, sells to consumer (adds ₹60/kg for stall, labour, wastage)
6. **Consumer**: buys at ₹230/kg — 2.9× the fisherman's cost

Each step adds cost (transport, handling, markup) and value (sorting, freshness preservation, convenience). The **value chain** asks: which steps add real value and which just add cost?

**Supply chain challenges**:
- **Cold chain**: fish must stay cold from catch to consumer. One break = spoilage
- **Wastage**: 20-30% of fish is wasted in India's supply chain (compared to 5% in Japan)
- **Information asymmetry**: the fisherman doesn't know the retail price; the consumer doesn't know the catch cost
- **Seasonality**: monsoon affects fishing, transportation, and demand simultaneously`,
      analogy: 'A supply chain is like a relay race. Each runner (stage) carries the baton (fish) for one leg. If one runner drops the baton (cold chain breaks), the race is lost (fish spoils). The total time depends on every runner, not just the fastest one. And the customer waiting at the finish line pays for ALL runners\' efforts — each leg adds cost to the final price.',
      storyConnection: 'The women of the Ima Keithel are the final link in dozens of supply chains. Each vendor maintains relationships with specific wholesalers, who maintain relationships with specific aggregators, who maintain relationships with specific fishermen. These relationship chains are the supply chain — built on trust, maintained through repeated transactions, and resilient because of redundancy (multiple sources for each good).',
      checkQuestion: 'If the consumer pays ₹230/kg and the fisherman receives ₹80/kg, is the supply chain "unfair" to the fisherman?',
      checkAnswer: 'Not necessarily. The ₹150 difference pays for real services: aggregation, transportation (including ice and fuel), wholesaling, and retail (stall rent, labour, wastage). Without these services, the fisherman would have to transport, market, and sell the fish individually — costing far more than ₹150 in time and effort. However, the chain CAN be exploitative if middlemen extract excessive margins without adding proportional value. Direct farmer-to-consumer platforms (like India\'s e-NAM) try to reduce unnecessary intermediaries.',
      codeIntro: 'Model a supply chain from fisherman to consumer and identify where value and cost are added.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fish supply chain: Loktak Lake to Imphal night market
stages = ['Fisherman', 'Aggregator', 'Transport', 'Wholesaler', 'Retailer', 'Consumer']
costs = [80, 20, 30, 40, 60, 0]  # cost added at each stage (₹/kg)
cumulative_price = np.cumsum(costs)

# Value added at each stage
value_add = {
    'Fisherman': 'Catching, cleaning',
    'Aggregator': 'Sorting, grading, bulk collection',
    'Transport': 'Cold chain, delivery to market',
    'Wholesaler': 'Storage, bulk breaking, credit',
    'Retailer': 'Convenience, freshness, customer service',
}

# Wastage at each stage
wastage_pct = [5, 3, 8, 5, 10]  # % of fish lost
starting_kg = 100  # start with 100 kg
remaining = [starting_kg]
for w in wastage_pct:
    remaining.append(remaining[-1] * (1 - w/100))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Price build-up (waterfall chart)
ax1.set_facecolor('#111827')
colors_stage = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#94a3b8']
bottoms = [0] + list(cumulative_price[:-1])
bars = ax1.bar(stages[:-1], costs[:-1], bottom=bottoms[:-1], color=colors_stage[:-1], alpha=0.8, width=0.5)

# Show cumulative price
for i, (stage, price) in enumerate(zip(stages[:-1], cumulative_price[:-1])):
    ax1.text(i, price + 5, f'₹{price}', ha='center', color='white', fontsize=9, fontweight='bold')

ax1.axhline(cumulative_price[-2], color='#f59e0b', linestyle='--', linewidth=1)
ax1.set_ylabel('Price build-up (₹/kg)', color='white')
ax1.set_title('Supply Chain Cost Structure', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Fisherman's share
fish_share = costs[0] / cumulative_price[-2] * 100
ax1.annotate(f'Fisherman gets {fish_share:.0f}%\\nof consumer price',
             xy=(0, costs[0]/2), xytext=(2, 50),
             color='#22c55e', fontsize=10, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#22c55e'))

# Wastage along the chain
ax2.set_facecolor('#111827')
ax2.plot(stages, remaining, color='#ef4444', linewidth=2, marker='o', markersize=8)
ax2.fill_between(stages, remaining, alpha=0.15, color='#ef4444')

for i, (stage, rem) in enumerate(zip(stages, remaining)):
    ax2.annotate(f'{rem:.0f} kg', xy=(i, rem), xytext=(0, 12),
                 textcoords='offset points', ha='center', color='white', fontsize=9)
    if i < len(wastage_pct):
        lost = remaining[i] * wastage_pct[i] / 100
        ax2.annotate(f'-{lost:.1f} kg\\n({wastage_pct[i]}%)', xy=(i+0.5, (remaining[i]+remaining[i+1])/2),
                     color='#ef4444', fontsize=7, ha='center')

ax2.set_ylabel('Fish remaining (kg)', color='white')
ax2.set_title('Wastage Along the Supply Chain', color='white', fontsize=13)
ax2.tick_params(colors='gray')
total_waste = starting_kg - remaining[-1]
ax2.annotate(f'Total waste: {total_waste:.0f} kg ({total_waste/starting_kg*100:.0f}%)',
             xy=(4, remaining[-1] + 5), color='#ef4444', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

print("Fish supply chain analysis (100 kg caught):")
for i, stage in enumerate(stages[:-1]):
    print(f"  {stage}: +₹{costs[i]}/kg, cumulative ₹{cumulative_price[i]}/kg, {remaining[i+1]:.0f}kg remaining")
print(f"  Consumer pays: ₹{cumulative_price[-2]}/kg")
print(f"  Fisherman receives: ₹{costs[0]}/kg ({fish_share:.0f}% of final price)")
print(f"  Total wastage: {total_waste:.0f}/{starting_kg} kg ({total_waste/starting_kg*100:.0f}%)")
print(f"  Effective cost (accounting for waste): ₹{cumulative_price[-2] * starting_kg / remaining[-1]:.0f}/kg")`,
      challenge: 'Model a "direct-to-consumer" supply chain that skips the aggregator and wholesaler. The fisherman transports directly but at higher per-kg transport cost (₹60 vs ₹30). Is it cheaper for the consumer? Is it better for the fisherman?',
      successHint: 'Supply chain analysis reveals where money goes and where it is wasted. Reducing supply chain inefficiency is one of the biggest opportunities for improving food security, farmer incomes, and consumer prices — in Manipur and globally.',
    },
    {
      title: 'Local vs global markets — how the night market connects to the world',
      concept: `The Imphal night market seems purely local, but it is connected to global markets through invisible threads:

**Local → Regional**:
- Manipuri fish trade supplies neighbouring states
- Handloom products (Moirang phee, Wangkhei phee) are sold across Northeast India
- Vegetables flow between Manipur, Nagaland, and Myanmar

**Regional → National**:
- Rice prices in Imphal track national rates (influenced by MSP policy)
- Fuel prices (affecting transport costs) are set nationally
- GST and tax policy affects all vendors

**National → Global**:
- Global oil prices → Indian fuel prices → transport costs → food prices in Imphal
- International rice demand → Indian export policy → domestic rice prices
- Global fertiliser prices → farming costs → vegetable prices
- Climate change → monsoon patterns → crop yields → market prices

The **law of one price** says identical goods should cost the same everywhere (after transport costs). In practice, local markets often have different prices due to:
- Transport costs (remote areas pay more)
- Information gaps (vendors don't know prices elsewhere)
- Market power (local monopolies)
- Regulations (state taxes, trade barriers)

Manipur's geographic isolation makes it particularly sensitive to supply chain disruptions — the National Highway 2 (Imphal-Jiribam) is the lifeline, and blockades or landslides can cause prices to spike 2-3x within days.`,
      analogy: 'The night market is like a leaf on a tree. The leaf (local market) seems independent, but it is connected to a branch (regional market), which connects to the trunk (national economy), which connects to roots (global supply chains). A drought at the root level (global oil price spike) eventually affects the leaf (higher prices in Imphal). The connection is invisible but real — and understanding it helps you predict which way prices will move.',
      storyConnection: 'The vendors of the Ima Keithel experienced this connection during the 2020-2021 blockades, when supplies on NH-2 were cut for weeks. Prices of rice doubled, cooking oil tripled, and some goods disappeared entirely. The vendors adapted: sourcing from Myanmar through informal border trade, substituting local alternatives, and rationing stock. Their resilience demonstrated that local market knowledge — understanding both global connections and local alternatives — is the ultimate economic survival skill.',
      checkQuestion: 'When global oil prices rise, why do vegetable prices in Imphal rise even though vegetables are grown locally (not imported)?',
      checkAnswer: 'Three connections: (1) Transport cost — vegetables are transported from farms to market by truck. Higher fuel prices → higher transport costs → higher retail prices. (2) Fertiliser — most fertilisers are petroleum-derived or energy-intensive to produce. Higher oil → higher fertiliser → higher farming costs → higher prices. (3) Opportunity cost — if nationally/globally traded crops become more profitable, farmers switch away from local vegetables, reducing local supply. Global markets transmit price signals through these indirect channels.',
      codeIntro: 'Model how global price shocks transmit to the Imphal night market.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 365 days of price transmission
days = np.arange(365)

# Global oil price (base + shock)
oil_base = 80  # $/barrel
oil_price = oil_base + 5 * np.sin(2 * np.pi * days / 365) + np.random.randn(365) * 3
# Oil shock at day 100
oil_price[100:] += 30 * np.exp(-(days[100:] - 100) / 60)

# Transmission: oil → fuel → transport → food prices
# Each stage has a delay and dampening
def transmit(source, delay_days, dampening, base_level):
    result = np.full_like(source, base_level, dtype=float)
    for i in range(delay_days, len(source)):
        change = (source[i-delay_days] - source[0]) / source[0]  # % change from baseline
        result[i] = base_level * (1 + change * dampening)
    return result + np.random.randn(len(source)) * base_level * 0.02

# Fuel price in India (7-day delay, 60% pass-through)
fuel_price = transmit(oil_price, 7, 0.6, 100)  # ₹/litre base

# Transport cost (14-day delay from fuel change, 40% pass-through)
transport_cost = transmit(fuel_price, 14, 0.4, 30)  # ₹/kg base

# Vegetable price in Imphal (21-day delay from transport, 50% pass-through)
veg_price = transmit(transport_cost, 21, 0.5, 60)  # ₹/kg base

# NH-2 blockade at day 200 for 10 days
blockade_start, blockade_end = 200, 210
veg_price[blockade_start:blockade_end] *= 2.5  # prices spike
veg_price[blockade_end:blockade_end+20] *= 1.3  # gradual recovery

fig, axes = plt.subplots(4, 1, figsize=(12, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Global to Local Price Transmission — Imphal Night Market', color='white', fontsize=14)

datasets = [
    (oil_price, 'Global Oil Price ($/barrel)', '#ef4444', axes[0]),
    (fuel_price, 'India Fuel Price (₹/litre)', '#f59e0b', axes[1]),
    (transport_cost, 'Transport Cost (₹/kg)', '#3b82f6', axes[2]),
    (veg_price, 'Imphal Vegetable Price (₹/kg)', '#22c55e', axes[3]),
]

for data, title, color, ax in datasets:
    ax.set_facecolor('#111827')
    ax.plot(days, data, color=color, linewidth=1.5)
    ax.fill_between(days, data, alpha=0.1, color=color)
    ax.set_ylabel(title.split('(')[0], color='white', fontsize=8)
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray')

# Mark events
axes[0].axvline(100, color='white', linestyle=':', linewidth=1)
axes[0].annotate('Oil shock', xy=(100, oil_price[100]), xytext=(120, oil_price.max()),
                 color='white', fontsize=9, arrowprops=dict(arrowstyle='->', color='white'))

axes[3].axvspan(blockade_start, blockade_end, alpha=0.3, color='#ef4444')
axes[3].annotate('NH-2 Blockade', xy=(205, veg_price[205]), xytext=(230, veg_price.max()),
                 color='#ef4444', fontsize=9, fontweight='bold',
                 arrowprops=dict(arrowstyle='->', color='#ef4444'))

axes[3].set_xlabel('Day of year', color='white')

plt.tight_layout()
plt.show()

# Correlation analysis
from numpy import corrcoef
oil_veg_corr = corrcoef(oil_price[30:], veg_price[30:])[0, 1]
print("Price transmission analysis:")
print(f"  Oil shock at day 100: +{30/oil_base*100:.0f}% spike")
print(f"  Fuel impact (day 107): +{(fuel_price[107]/fuel_price[99]-1)*100:.0f}% increase")
print(f"  Transport impact (day 121): +{(transport_cost[121]/transport_cost[99]-1)*100:.0f}% increase")
print(f"  Vegetable impact (day 142): +{(veg_price[142]/veg_price[99]-1)*100:.0f}% increase")
print(f"  Oil-vegetable correlation: {oil_veg_corr:.2f}")
print()
print(f"NH-2 blockade impact:")
print(f"  Normal price: ₹{veg_price[blockade_start-1]:.0f}/kg")
print(f"  Blockade price: ₹{veg_price[blockade_start+5]:.0f}/kg (+{(veg_price[blockade_start+5]/veg_price[blockade_start-1]-1)*100:.0f}%)")
print(f"  Recovery time: ~20 days after blockade ends")
print()
print("The local market is never truly local.")
print("Global events reach Imphal — delayed, dampened, but real.")`,
      challenge: 'Add a "buffer stock" policy: the government maintains 10 days of vegetable reserves. During the blockade, reserves are released to keep prices at +50% instead of +150%. Model this and calculate the cost of maintaining the buffer.',
      successHint: 'From supply and demand to price discovery to money to market types to supply chains to global connections — you have traced the complete economics of a night market. Level 2 takes you into quantitative economics: demand curves, equilibrium analysis, elasticity, and economic modeling with Python.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Supply Chains & Market Economics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for economics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
