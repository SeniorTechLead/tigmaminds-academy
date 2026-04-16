import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ImaKeithelLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Ima Keithel — the world\'s only all-women market',
      concept: `**Ima Keithel** ("Mother\'s Market") in Imphal is the world\'s largest all-women-run market. Over 5,000 women vendors sell everything from vegetables to textiles. It has operated for over 500 years.

Economics begins with a simple idea: **price** is what a buyer pays and a seller receives. The **profit** is:

**Profit = Revenue - Cost**
**Revenue = Price x Quantity sold**

Every Ima Keithel vendor makes this calculation daily. If she buys 50 kg of tomatoes at 20 rupees/kg and sells them at 35 rupees/kg:
- Cost = 50 x 20 = 1000 rupees
- Revenue = 50 x 35 = 1750 rupees
- Profit = 1750 - 1000 = 750 rupees

In Python, variables store these values and arithmetic gives us the answer.`,
      analogy: 'A market vendor\'s profit calculation is like a lemonade stand. You buy lemons and sugar (cost), sell lemonade (revenue), and pocket the difference (profit). If you cannot sell all your lemonade before it goes bad, your real profit is less than your calculated profit.',
      storyConnection: 'The story describes how a young girl\'s mother teaches her to calculate profit at their Ima Keithel stall. The mother does it in her head — 500 years of tradition has made these calculations instinctive. We are making them explicit with code.',
      checkQuestion: 'If a vendor buys 100 kg of rice at 40 rupees/kg and sells 80 kg at 55 rupees/kg (20 kg is unsold), what is her profit?',
      checkAnswer: 'Cost = 100 x 40 = 4000 rupees. Revenue = 80 x 55 = 4400 rupees. Profit = 4400 - 4000 = 400 rupees. But she still has 20 kg unsold. If she can sell it later at 40 (no profit), total profit stays 400. If it spoils (worth 0), she still made 400 on the 80 kg she sold, but lost 800 on the 20 kg that spoiled — net loss of 400.',
      codeIntro: 'Calculate daily profit for an Ima Keithel vegetable vendor.',
      code: `# Ima Keithel profit calculator
products = [
    ('Tomatoes',   50, 20, 35, 45),   # (name, bought_kg, buy_price, sell_price, sold_kg)
    ('Potatoes',   80, 15, 25, 75),
    ('Onions',     40, 18, 30, 38),
    ('Chillies',   15, 40, 80, 14),
    ('Coriander',  10, 30, 60, 9),
]

print("=== Ima Keithel Daily Profit Report ===\
")
print(f"{'Product':<12} {'Bought':>7} {'Cost':>7} {'Sold':>6} {'Revenue':>8} {'Profit':>7} {'Margin':>7}")
print("-" * 60)

total_cost = 0
total_revenue = 0

for name, bought, buy_price, sell_price, sold in products:
    cost = bought * buy_price
    revenue = sold * sell_price
    profit = revenue - cost
    margin = (profit / revenue * 100) if revenue > 0 else 0
    unsold = bought - sold
    waste_cost = unsold * buy_price

    total_cost += cost
    total_revenue += revenue

    print(f"{name:<12} {bought:>5}kg {cost:>6}₹ {sold:>4}kg {revenue:>7}₹ {profit:>6}₹ {margin:>5.1f}%")

total_profit = total_revenue - total_cost
print("-" * 60)
print(f"{'TOTAL':<12} {'':>7} {total_cost:>6}₹ {'':>6} {total_revenue:>7}₹ {total_profit:>6}₹ {total_profit/total_revenue*100:>5.1f}%")
print(f"\
Daily profit: {total_profit}₹")
print(f"If she works 25 days/month: {total_profit * 25:,}₹/month")`,
      challenge: 'Add transport cost (200 rupees/day) and stall rent (150 rupees/day) as fixed costs. Recalculate the true profit. What percentage do fixed costs eat from the margin?',
      successHint: 'Profit calculation is the most fundamental concept in economics. Every business in the world — from Ima Keithel stalls to multinational corporations — starts here.',
    },
    {
      title: 'Supply and demand — why prices change',
      concept: `**Supply** is how much sellers want to sell at each price. **Demand** is how much buyers want to buy. The price where supply equals demand is the **equilibrium price**.

- When price is HIGH: sellers want to sell lots (high supply), but buyers want less (low demand)
- When price is LOW: buyers want lots (high demand), but sellers offer less (low supply)

The supply curve slopes upward (higher price = more supply).
The demand curve slopes downward (higher price = less demand).

Where they cross is **equilibrium** — the natural resting price in a free market.

In Python, we use **lists** to store prices and quantities, then find where supply equals demand.`,
      analogy: 'Supply and demand is like an auction. If too many people want a painting (high demand, low supply), the price goes up. If nobody wants it (low demand), the price drops. The final price is where exactly one person is willing to pay what the seller accepts.',
      storyConnection: 'At Ima Keithel, prices change throughout the day. In the morning, fresh vegetables command high prices (supply just arrived, demand is high). By evening, unsold vegetables are discounted (supply exceeds demand). The vendors are supply-demand curves in action.',
      checkQuestion: 'If a sudden rainstorm destroys half the tomato crop, what happens to the price at Ima Keithel?',
      checkAnswer: 'Supply drops dramatically (fewer tomatoes available). Demand stays the same (people still want tomatoes). With less supply and same demand, the equilibrium price increases. The supply curve shifts left, and the intersection with the demand curve moves to a higher price. Vendors who still have tomatoes make more profit per kg.',
      codeIntro: 'Find the equilibrium price for tomatoes at Ima Keithel.',
      code: `# Supply and Demand at Ima Keithel
prices = list(range(10, 61, 5))  # rupees per kg

# Demand: more people buy at lower prices
# Q_demand = 500 - 8 * price
demand = [max(0, 500 - 8 * p) for p in prices]

# Supply: vendors supply more at higher prices
# Q_supply = -100 + 6 * price
supply = [max(0, -100 + 6 * p) for p in prices]

print("=== Tomato Supply & Demand at Ima Keithel ===\
")
print(f"{'Price (₹/kg)':>12} {'Demand (kg)':>12} {'Supply (kg)':>12} {'Surplus/Shortage':>16}")
print("-" * 55)

equilibrium_price = 0
for p, d, s in zip(prices, demand, supply):
    diff = s - d
    status = f"+{diff} surplus" if diff > 0 else f"{diff} shortage" if diff < 0 else "EQUILIBRIUM"
    marker = " <<<" if abs(diff) < 30 else ""
    print(f"{p:>8}₹/kg {d:>10} kg {s:>10} kg {status:>16}{marker}")
    if abs(diff) < 30 and equilibrium_price == 0:
        equilibrium_price = p

# Find exact equilibrium
# 500 - 8p = -100 + 6p → 600 = 14p → p = 42.86
p_eq = 600 / 14
q_eq = 500 - 8 * p_eq
print(f"\
Exact equilibrium: {p_eq:.2f} ₹/kg, {q_eq:.0f} kg traded")
print(f"At equilibrium, vendors earn: {p_eq * q_eq:.0f}₹ total revenue")`,
      challenge: 'If the government sets a maximum price of 30 rupees/kg (a price ceiling), calculate the shortage. How many kg of demand go unmet?',
      successHint: 'Supply and demand is the most powerful idea in economics. It explains prices for everything from tomatoes to houses to labour. You just found the equilibrium — the invisible hand at work.',
    },
    {
      title: 'Price elasticity — how sensitive are buyers?',
      concept: `**Price elasticity of demand** measures how much demand changes when price changes:

**E = (% change in quantity) / (% change in price)**

If E > 1: demand is **elastic** — buyers are very sensitive to price changes (luxury goods)
If E < 1: demand is **inelastic** — buyers buy regardless of price (necessities)
If E = 1: **unit elastic**

At Ima Keithel:
- Rice is **inelastic** — people need it regardless of price
- Decorative items are **elastic** — people skip them when prices rise
- Chillies are somewhere in between

Elasticity helps vendors set prices. For inelastic goods, raising the price increases revenue. For elastic goods, lowering the price increases revenue.`,
      analogy: 'Elasticity is like a rubber band. An elastic good stretches a lot when you pull (raise price) — demand drops dramatically. An inelastic good is like a stiff rope — pull it all you want (raise price), and the quantity barely changes. Rice is a rope. Silk scarves are rubber bands.',
      storyConnection: 'In the story, a vendor raises her chilli price by 10% and loses half her customers. Another vendor raises rice price by 10% and loses almost none. The first good is elastic, the second is inelastic. The vendors learn to price accordingly.',
      checkQuestion: 'If the price of tomatoes rises from 30 to 36 rupees (20% increase) and quantity demanded falls from 260 to 208 kg (20% decrease), what is the elasticity?',
      checkAnswer: 'E = 20% / 20% = 1.0 — unit elastic. Revenue stays the same: 30 x 260 = 7800 and 36 x 208 = 7488 (approximately the same). For unit elastic goods, price changes do not significantly affect total revenue.',
      codeIntro: 'Calculate price elasticity for different products at Ima Keithel.',
      code: `# Price elasticity of demand at Ima Keithel
products = {
    'Rice':       {'base_price': 40, 'base_qty': 200, 'elasticity': 0.3},
    'Tomatoes':   {'base_price': 30, 'base_qty': 150, 'elasticity': 1.2},
    'Silk cloth': {'base_price': 500, 'base_qty': 20, 'elasticity': 2.5},
    'Chillies':   {'base_price': 60, 'base_qty': 50, 'elasticity': 0.8},
    'Fish':       {'base_price': 150, 'base_qty': 80, 'elasticity': 0.6},
}

print("=== Price Elasticity at Ima Keithel ===\
")
print("Effect of a 10% price increase:\
")
print(f"{'Product':<12} {'Old Price':>9} {'New Price':>9} {'Old Qty':>8} {'New Qty':>8} {'Old Rev':>8} {'New Rev':>8} {'Change':>7}")
print("-" * 75)

for name, data in products.items():
    p0 = data['base_price']
    q0 = data['base_qty']
    e = data['elasticity']

    # 10% price increase
    p1 = p0 * 1.10
    # Quantity change: % change in Q = -E * % change in P
    q1 = q0 * (1 - e * 0.10)

    rev0 = p0 * q0
    rev1 = p1 * q1
    rev_change = (rev1 - rev0) / rev0 * 100

    category = 'inelastic' if e < 1 else 'elastic' if e > 1 else 'unit'
    print(f"{name:<12} {p0:>7}₹ {p1:>7.0f}₹ {q0:>6} {q1:>6.0f} {rev0:>7}₹ {rev1:>7.0f}₹ {rev_change:>+5.1f}%")

print("\
--- Key insight ---")
print("Inelastic goods (E<1): raising price INCREASES revenue")
print("Elastic goods (E>1):   raising price DECREASES revenue")
print("\
Smart vendors raise prices on rice (inelastic)")
print("and lower prices on silk (elastic, to attract more buyers)")`,
      challenge: 'Find the revenue-maximising price for silk cloth. Try price increases from 0% to 50% in steps of 5%. At what price is revenue highest?',
      successHint: 'Price elasticity is how companies like Amazon and airlines set prices. Inelastic goods get premium prices. Elastic goods get competitive prices. You now understand the strategic logic behind pricing.',
    },
    {
      title: 'Market competition — why no vendor gets too rich',
      concept: `At Ima Keithel, hundreds of vendors sell similar products. This is **perfect competition**:
- Many sellers, no one controls the market
- Products are similar (one vendor\'s tomatoes ≈ another\'s)
- Buyers can easily compare prices
- New vendors can enter freely

In perfect competition, economic profit tends toward **zero** in the long run. Why? If one vendor earns high profits, new vendors enter, increasing supply, driving the price down until the extra profit disappears.

We model this with a **for loop** that simulates vendors entering the market over time.`,
      analogy: 'Perfect competition is like a game of musical chairs where new chairs keep appearing. If there are too few chairs (high profits attract new players), more chairs appear. If there are too many (losses drive vendors away), some chairs disappear. The system naturally balances.',
      storyConnection: 'The story describes how a new vendor with a clever marketing strategy initially earns high profits. But within weeks, other vendors copy her approach, and profits return to normal. This is the competitive equilibrium — innovation is quickly imitated in a transparent market.',
      checkQuestion: 'If one Ima Keithel vendor sells tomatoes at 35₹/kg while all others charge 30₹/kg, what happens?',
      checkAnswer: 'In a market with identical products and informed buyers, almost nobody buys from the expensive vendor. Buyers walk 10 metres to the next stall and save 5₹/kg. The expensive vendor must either lower her price to match or offer something extra (better quality, fresher product, friendlier service) to justify the premium.',
      codeIntro: 'Simulate how competition drives prices to equilibrium at Ima Keithel.',
      code: `# Market competition simulation
import math

n_vendors_initial = 10
cost_per_kg = 20           # same for all vendors
total_demand = 500         # kg per day
months = 24

print("=== Ima Keithel Competition Over 2 Years ===\
")
print(f"{'Month':>5} {'Vendors':>8} {'Price':>7} {'Qty/vendor':>11} {'Revenue':>8} {'Profit':>7} {'Entry':>6}")
print("-" * 58)

n_vendors = n_vendors_initial
for month in range(1, months + 1):
    # Each vendor gets equal share of demand
    qty_per_vendor = total_demand / n_vendors

    # Price depends on competition (more vendors = lower price)
    # P = cost + markup / sqrt(n_vendors)
    markup = 25 / math.sqrt(n_vendors)
    price = cost_per_kg + markup

    revenue = price * qty_per_vendor
    cost = cost_per_kg * qty_per_vendor + 200  # 200 = fixed costs (rent, transport)
    profit = revenue - cost

    # Entry/exit dynamics
    if profit > 100:
        new_vendors = max(1, int(profit / 150))
        entry = f"+{new_vendors}"
    elif profit < -50:
        new_vendors = -max(1, int(-profit / 100))
        entry = str(new_vendors)
    else:
        new_vendors = 0
        entry = "0"

    if month % 3 == 0 or month <= 3 or abs(new_vendors) > 0:
        print(f"{month:>5} {n_vendors:>8} {price:>6.1f}₹ {qty_per_vendor:>9.1f}kg {revenue:>7.0f}₹ {profit:>6.0f}₹ {entry:>6}")

    n_vendors = max(5, n_vendors + new_vendors)

print(f"\
Started with {n_vendors_initial} vendors, ended with {n_vendors}")
print(f"Final profit per vendor: {profit:.0f}₹/day")
print("In perfect competition, economic profit → 0 over time")`,
      challenge: 'What if the government limits the market to 15 vendors (an entry barrier)? Run the simulation again. How does the price and profit differ from the free-entry model?',
      successHint: 'Competition is the most powerful force in economics. It drives prices down, quality up, and innovation forward. Ima Keithel\'s 500-year success is a testament to competitive markets.',
    },
    {
      title: 'The invisible hand — how individual choices create order',
      concept: `Adam Smith\'s **invisible hand** describes how individual self-interest creates a well-functioning market without central planning. At Ima Keithel:

- Each vendor sets her own price (self-interest)
- Buyers choose the best deal (self-interest)
- The result: fair prices, efficient allocation, wide variety

No central authority tells vendors what to sell or what to charge. Yet the market provides everything Imphal needs, in the right quantities, at competitive prices.

This is an **emergent phenomenon** — complex, organised behaviour arising from simple individual rules. We simulate it by giving each "agent" simple rules and watching order emerge.`,
      analogy: 'The invisible hand is like a flock of starlings. No bird is "in charge," yet the flock moves in beautiful, coordinated patterns. Each bird follows simple rules: stay close to neighbours, avoid collisions, match their speed. The result is spectacular order from individual chaos.',
      storyConnection: 'The story culminates with the realisation that Ima Keithel has run smoothly for 500 years without a CEO, without a pricing algorithm, without central planning. Just thousands of individual women making individual decisions — and collectively creating one of the most efficient markets on Earth.',
      checkQuestion: 'Can the invisible hand fail? When does self-interest NOT lead to good outcomes?',
      checkAnswer: 'Yes — in cases of market failure: 1) Monopoly (one seller dominates), 2) Externalities (pollution costs borne by society, not the producer), 3) Public goods (lighthouses, national defence — nobody pays voluntarily), 4) Information asymmetry (seller knows product is defective, buyer does not). In these cases, the invisible hand leads to inefficient or unfair outcomes, and intervention may help.',
      codeIntro: 'Simulate an agent-based market model to see the invisible hand at Ima Keithel.',
      code: `# Agent-based market simulation — the invisible hand
import random

random.seed(42)

class Vendor:
    def __init__(self, name, product, cost):
        self.name = name
        self.product = product
        self.cost = cost
        self.price = cost + random.uniform(5, 20)  # initial markup
        self.sales = 0
        self.profit = 0

    def adjust_price(self, avg_market_price, my_sales, avg_sales):
        """Vendors adjust prices based on their sales vs average."""
        if my_sales < avg_sales * 0.7:
            self.price *= 0.95  # lower price to attract buyers
        elif my_sales > avg_sales * 1.3:
            self.price *= 1.03  # raise price (demand is high)
        # Never sell below cost
        self.price = max(self.cost + 2, self.price)

class Buyer:
    def __init__(self, budget):
        self.budget = budget

    def choose_vendor(self, vendors):
        """Buy from cheapest vendor (with some randomness)."""
        affordable = [v for v in vendors if v.price <= self.budget]
        if not affordable:
            return None
        # 80% buy cheapest, 20% buy random (convenience, loyalty)
        if random.random() < 0.8:
            return min(affordable, key=lambda v: v.price)
        return random.choice(affordable)

# Setup
n_vendors = 15
n_buyers = 100
days = 30

vendors = [Vendor(f"Ima-{i+1}", "tomatoes", 20) for i in range(n_vendors)]

print("=== Invisible Hand Simulation: 30 Days ===\
")
print(f"{'Day':>4} {'Avg Price':>9} {'Min Price':>9} {'Max Price':>9} {'Price Spread':>12}")
print("-" * 48)

for day in range(1, days + 1):
    # Reset daily sales
    for v in vendors:
        v.sales = 0
        v.profit = 0

    # Each buyer makes a purchase
    buyers = [Buyer(random.uniform(25, 45)) for _ in range(n_buyers)]
    for buyer in buyers:
        chosen = buyer.choose_vendor(vendors)
        if chosen:
            chosen.sales += 1
            chosen.profit += chosen.price - chosen.cost

    # Vendors adjust prices
    avg_sales = sum(v.sales for v in vendors) / n_vendors
    avg_price = sum(v.price for v in vendors) / n_vendors
    for v in vendors:
        v.adjust_price(avg_price, v.sales, avg_sales)

    prices = [v.price for v in vendors]
    if day % 5 == 0 or day <= 3:
        print(f"{day:>4} {sum(prices)/len(prices):>8.1f}₹ {min(prices):>8.1f}₹ {max(prices):>8.1f}₹ {max(prices)-min(prices):>10.1f}₹")

print(f"\
--- After 30 days ---")
prices = sorted([(v.name, v.price, v.sales, v.profit) for v in vendors], key=lambda x: -x[2])
print(f"{'Vendor':<10} {'Price':>7} {'Sales':>6} {'Profit':>7}")
for name, price, sales, profit in prices[:5]:
    print(f"{name:<10} {price:>6.1f}₹ {sales:>6} {profit:>6.0f}₹")
print("...")
for name, price, sales, profit in prices[-3:]:
    print(f"{name:<10} {price:>6.1f}₹ {sales:>6} {profit:>6.0f}₹")

print(f"\
Price convergence: spread went from {20:.0f}₹ to {max(prices, key=lambda x:x[1])[1]-min(prices, key=lambda x:x[1])[1]:.1f}₹")
print("The invisible hand drives prices toward equilibrium!")`,
      challenge: 'Add a "dishonest vendor" who sells lower quality at the same price. What happens when buyers can detect quality 50% of the time? Does the market punish dishonesty?',
      successHint: 'The invisible hand is one of the most important ideas in human history. Markets coordinate millions of decisions without central planning. Ima Keithel is living proof that this works — and has worked for 500 years.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Economics Fundamentals</span>
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
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
