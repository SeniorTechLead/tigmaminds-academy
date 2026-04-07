import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ImaKeithelLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Market management database — tracking 5,000 vendors',
      concept: `Managing Ima Keithel requires a database tracking thousands of vendors, products, transactions, and stall assignments. We build a complete market management system in SQLite.

Tables:
- **vendors** — name, products, stall number, tenure, fees paid
- **products** — categories, seasonal availability, typical price range
- **daily_sales** — transaction records for each vendor each day
- **stall_assignments** — which vendor gets which stall (lottery-based)

This database answers critical questions: Who are the top earners? Which products have the highest margins? Are fees being paid? Which stalls have the highest foot traffic?`,
      analogy: 'A market management database is like the accounting books of a medieval guild — but searchable and analytical. It tracks every vendor, every transaction, and every fee, enabling fair management of a complex economic ecosystem.',
      storyConnection: 'Ima Keithel has been managed collectively by the vendors themselves for 500 years. Our database digitises this management — preserving the democratic tradition while adding the power of data analysis.',
      checkQuestion: 'Why is a stall assignment lottery fairer than first-come-first-served?',
      checkAnswer: 'First-come-first-served rewards vendors who live nearby and can arrive early. A lottery gives equal probability to all vendors, regardless of location. Prime stalls (near entrances) generate more sales, so fair assignment matters. The lottery can be weighted by tenure — rewarding long-serving vendors while still giving newcomers a chance.',
      codeIntro: 'Build a complete market management system for Ima Keithel.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE vendors (
    id INTEGER PRIMARY KEY, name TEXT, category TEXT,
    years_active INTEGER, stall_id INTEGER, fees_paid REAL
);
CREATE TABLE stalls (
    id INTEGER PRIMARY KEY, location TEXT, size_sqm REAL,
    monthly_fee REAL, foot_traffic_score REAL
);
CREATE TABLE daily_sales (
    id INTEGER PRIMARY KEY, vendor_id INTEGER, sale_date TEXT,
    revenue REAL, items_sold INTEGER, profit REAL,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);
''')

np.random.seed(42)

# Create stalls
locations = ['Gate A (prime)', 'Gate B (prime)', 'Centre', 'Back row', 'Corner']
for i in range(50):
    loc = locations[i % 5]
    traffic = {'Gate A (prime)': 9, 'Gate B (prime)': 8, 'Centre': 7, 'Back row': 5, 'Corner': 4}[loc]
    fee = traffic * 50
    c.execute('INSERT INTO stalls (location,size_sqm,monthly_fee,foot_traffic_score) VALUES (?,?,?,?)',
              (loc, np.random.uniform(4, 12), fee, traffic + np.random.normal(0, 0.5)))

# Create vendors
categories = ['Vegetables', 'Fish', 'Textiles', 'Spices', 'Pottery']
for i in range(50):
    cat = categories[i % 5]
    years = np.random.randint(1, 30)
    fees = np.random.uniform(200, 500) * 12  # annual
    c.execute('INSERT INTO vendors (name,category,years_active,stall_id,fees_paid) VALUES (?,?,?,?,?)',
              (f'Ima {["Devi","Chanu","Singh","Meitei","Laishram"][i%5]}-{i+1}', cat, years, i+1, fees))

# Generate 30 days of sales data
for day in range(1, 31):
    for vid in range(1, 51):
        c.execute('SELECT v.category, s.foot_traffic_score FROM vendors v JOIN stalls s ON v.stall_id=s.id WHERE v.id=?', (vid,))
        cat, traffic = c.fetchone()
        base_rev = {'Vegetables': 800, 'Fish': 1200, 'Textiles': 2000, 'Spices': 600, 'Pottery': 500}[cat]
        revenue = max(0, base_rev * (traffic/7) * np.random.uniform(0.5, 1.5))
        items = int(revenue / np.random.uniform(20, 100))
        profit = revenue * np.random.uniform(0.15, 0.35)
        c.execute('INSERT INTO daily_sales (vendor_id,sale_date,revenue,items_sold,profit) VALUES (?,?,?,?,?)',
                  (vid, f'2024-03-{day:02d}', revenue, items, profit))

# Analytics
print("=== Ima Keithel Market Management Report ===\\\n")

c.execute('''SELECT v.category, COUNT(*) as vendors,
             ROUND(AVG(d.revenue),0) as avg_daily_rev,
             ROUND(AVG(d.profit),0) as avg_daily_profit,
             ROUND(SUM(d.revenue),0) as total_rev
             FROM vendors v JOIN daily_sales d ON v.id=d.vendor_id
             GROUP BY v.category ORDER BY total_rev DESC''')
print(f"{'Category':<12} {'Vendors':>8} {'Avg Rev':>8} {'Avg Profit':>11} {'Total Rev':>10}")
print("-" * 52)
for row in c.fetchall():
    print(f"{row[0]:<12} {row[1]:>8} {row[2]:>7}₹ {row[3]:>10}₹ {row[4]:>9}₹")

print("\\\nTop 5 vendors by profit:")
c.execute('''SELECT v.name, v.category, ROUND(SUM(d.profit),0), ROUND(AVG(d.revenue),0)
             FROM vendors v JOIN daily_sales d ON v.id=d.vendor_id
             GROUP BY v.id ORDER BY SUM(d.profit) DESC LIMIT 5''')
for name, cat, profit, rev in c.fetchall():
    print(f"  {name} ({cat}): profit={profit}₹, avg_rev={rev}₹/day")

c.execute('''SELECT s.location, ROUND(AVG(d.revenue),0)
             FROM stalls s JOIN vendors v ON v.stall_id=s.id JOIN daily_sales d ON v.id=d.vendor_id
             GROUP BY s.location ORDER BY AVG(d.revenue) DESC''')
print("\\\nRevenue by stall location:")
for loc, rev in c.fetchall():
    print(f"  {loc}: avg {rev}₹/day")

db.close()`,
      challenge: 'Add a fee collection system: compare fees_paid against what each vendor should pay based on their stall. Flag vendors who are behind on payments.',
      successHint: 'Market management systems are used in every organised marketplace — from Ima Keithel to shopping malls to online platforms. You just built the database backbone.',
    },
    {
      title: 'Dynamic pricing algorithm — adjusting in real time',
      concept: `Modern markets use **dynamic pricing**: adjusting prices based on real-time demand signals. At Ima Keithel, this happens naturally — vendors lower prices as the day ends and perishables approach their expiry.

Our algorithm:
1. Track sales velocity (items per hour)
2. Compare to target velocity
3. If sales are slow → reduce price (stimulate demand)
4. If sales are fast → maintain or increase price (capture surplus)
5. Log every decision in the database

This is the same logic used by Uber (surge pricing), airlines (yield management), and Amazon (algorithmic pricing).`,
      analogy: 'Dynamic pricing is like a DJ reading the dance floor. If people are leaving (slow sales), change the music (lower the price). If the floor is packed (fast sales), keep playing the hits (maintain price) or even charge a cover (raise price). The key is responsiveness.',
      storyConnection: 'Ima Keithel vendors have practised dynamic pricing for centuries — lowering fish prices at 4 PM, discounting wilting vegetables by noon, and charging premium for the first pick at 6 AM. Our algorithm formalises their intuition.',
      checkQuestion: 'Why not just set the lowest possible price to maximise sales volume?',
      checkAnswer: 'Because revenue = price x quantity. Halving the price might not double quantity (demand has limits). Also, very low prices attract bargain hunters who would have paid more. Dynamic pricing captures maximum revenue by charging high when demand is high and low only when necessary to clear inventory.',
      codeIntro: 'Build a dynamic pricing engine for an Ima Keithel vegetable stall.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE inventory (
    id INTEGER PRIMARY KEY, product TEXT,
    quantity REAL, cost_per_kg REAL, initial_price REAL,
    current_price REAL, shelf_life_hours REAL
);
CREATE TABLE price_log (
    id INTEGER PRIMARY KEY, product_id INTEGER, hour INTEGER,
    price REAL, sales REAL, revenue REAL, reason TEXT
);
''')

products = [
    ('Tomatoes', 50, 20, 35, 12),
    ('Fish', 30, 80, 130, 8),
    ('Spinach', 20, 15, 30, 6),
    ('Potatoes', 40, 12, 22, 48),
]
for name, qty, cost, price, shelf in products:
    c.execute('INSERT INTO inventory (product,quantity,cost_per_kg,initial_price,current_price,shelf_life_hours) VALUES (?,?,?,?,?,?)',
              (name, qty, cost, price, price, shelf))

np.random.seed(42)

# Simulate 12 hours of trading (6 AM to 6 PM)
print("=== Dynamic Pricing Engine ===\\\n")

for hour in range(12):
    actual_hour = 6 + hour
    c.execute('SELECT id, product, quantity, cost_per_kg, current_price, shelf_life_hours FROM inventory')
    for prod_id, name, qty, cost, price, shelf in c.fetchall():
        if qty <= 0:
            continue

        hours_left = max(0, shelf - hour)
        freshness = hours_left / shelf

        # Demand varies by hour (peak at 8-10 AM, low after 2 PM)
        hour_factor = 1.5 if 8 <= actual_hour <= 10 else 1.0 if actual_hour < 14 else 0.6
        # Price sensitivity
        base_demand = 5 * hour_factor * (1 + (price * 0.8 / price - 0.8))
        actual_sales = min(qty, max(0, base_demand * np.random.uniform(0.5, 1.5)))

        # Dynamic pricing logic
        if freshness < 0.2:
            new_price = max(cost * 1.1, price * 0.7)
            reason = 'CLEARANCE — near expiry'
        elif freshness < 0.5 and qty > 15:
            new_price = max(cost * 1.2, price * 0.85)
            reason = 'MARKDOWN — ageing stock'
        elif actual_sales > base_demand * 1.2:
            new_price = min(price * 1.1, price * 1.5)
            reason = 'PREMIUM — high demand'
        elif actual_sales < base_demand * 0.5 and hour > 3:
            new_price = max(cost * 1.15, price * 0.9)
            reason = 'DISCOUNT — slow sales'
        else:
            new_price = price
            reason = 'HOLD — normal sales'

        revenue = actual_sales * price
        new_qty = qty - actual_sales

        c.execute('UPDATE inventory SET quantity=?, current_price=? WHERE id=?', (new_qty, new_price, prod_id))
        c.execute('INSERT INTO price_log (product_id,hour,price,sales,revenue,reason) VALUES (?,?,?,?,?,?)',
                  (prod_id, actual_hour, new_price, actual_sales, revenue, reason))

# Report
print(f"{'Hour':>4} {'Product':<10} {'Price':>7} {'Sales':>6} {'Revenue':>8} {'Action'}")
print("-" * 55)
c.execute('''SELECT pl.hour, i.product, pl.price, ROUND(pl.sales,1), ROUND(pl.revenue,0), pl.reason
             FROM price_log pl JOIN inventory i ON pl.product_id=i.id
             WHERE pl.reason != 'HOLD — normal sales'
             ORDER BY pl.hour, i.product''')
for row in c.fetchall():
    print(f"{row[0]:>4}h {row[1]:<10} {row[2]:>6.1f}₹ {row[3]:>5.1f} {row[4]:>7.0f}₹ {row[5]}")

c.execute('''SELECT i.product, ROUND(SUM(pl.revenue),0), ROUND(SUM(pl.sales),1),
             i.initial_price, i.current_price, ROUND(i.quantity,1)
             FROM price_log pl JOIN inventory i ON pl.product_id=i.id
             GROUP BY i.id''')
print("\\\n--- End of Day Summary ---")
print(f"{'Product':<10} {'Revenue':>8} {'Sold':>7} {'Start ₹':>8} {'End ₹':>6} {'Left':>6}")
for row in c.fetchall():
    print(f"{row[0]:<10} {row[1]:>7}₹ {row[2]:>5.1f}kg {row[3]:>7.1f} {row[4]:>5.1f} {row[5]:>5.1f}kg")

db.close()`,
      challenge: 'Add a "competitor price" input: if the vendor next door lowers tomato prices to 28₹, the algorithm should respond. Implement competitor-aware pricing.',
      successHint: 'Dynamic pricing algorithms power billions of dollars in commerce. You just built one that handles perishability, demand signals, and inventory — the core of modern retail technology.',
    },
    {
      title: 'Supply chain optimisation — from farm to market',
      concept: `Ima Keithel vendors buy from farmers, transport goods to Imphal, and sell to consumers. Optimising this **supply chain** means minimising total cost while meeting demand.

The problem: multiple farms produce goods at different costs. Multiple routes have different transport costs. The market has daily demand. Find the cheapest way to get goods from farms to market.

This is the **transportation problem** — a classic linear programming problem. We solve it using a greedy algorithm that prioritises the cheapest source-route combinations.`,
      analogy: 'Supply chain optimisation is like planning a road trip with multiple gas stations. Each station has different prices and distances. You want to minimise total fuel cost while ensuring you never run empty. The optimal strategy balances price, location, and tank capacity.',
      storyConnection: 'The story describes how Ima Keithel vendors coordinate their sourcing: one vendor buys from the Thoubal farms (cheap but far), another from Bishnupur (closer but pricier). Together, they cover the market\'s needs at minimum total cost — a collective supply chain.',
      checkQuestion: 'Why not just buy everything from the cheapest farm?',
      checkAnswer: 'The cheapest farm has limited capacity and higher transport costs if it is far away. Total cost = purchase cost + transport cost. A slightly more expensive nearby farm might be cheaper overall when transport is included. Also, relying on one source is risky — crop failure would mean no supply at all. Diversification reduces risk.',
      codeIntro: 'Optimise the supply chain for Ima Keithel using the transportation problem.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE farms (
    id INTEGER PRIMARY KEY, name TEXT, product TEXT,
    capacity_kg REAL, price_per_kg REAL, distance_km REAL
);
CREATE TABLE transport_costs (
    farm_id INTEGER, cost_per_kg REAL,
    FOREIGN KEY (farm_id) REFERENCES farms(id)
);
CREATE TABLE optimal_plan (
    farm_id INTEGER, quantity_kg REAL, purchase_cost REAL,
    transport_cost REAL, total_cost REAL
);
''')

farms = [
    ('Thoubal Farm', 'Tomatoes', 200, 15, 45),
    ('Bishnupur Farm', 'Tomatoes', 150, 18, 25),
    ('Churachandpur', 'Tomatoes', 100, 12, 70),
    ('Local Imphal', 'Tomatoes', 80, 22, 5),
    ('Senapati Hills', 'Tomatoes', 120, 14, 55),
]

for name, prod, cap, price, dist in farms:
    c.execute('INSERT INTO farms VALUES (NULL,?,?,?,?,?)', (name, prod, cap, price, dist))
    transport = dist * 0.5  # 0.5₹ per kg per km
    c.execute('INSERT INTO transport_costs VALUES (?,?)', (len(farms), transport))
    farms_idx = len(farms)

# Recalculate after insert
c.execute('''SELECT f.id, f.name, f.capacity_kg, f.price_per_kg, t.cost_per_kg,
             f.price_per_kg + t.cost_per_kg as total_per_kg
             FROM farms f JOIN transport_costs t ON f.id=t.farm_id
             ORDER BY total_per_kg ASC''')
farm_data = c.fetchall()

market_demand = 400  # kg needed today
remaining = market_demand

print("=== Supply Chain Optimisation ===\\\n")
print(f"Market demand: {market_demand} kg of tomatoes\\\n")
print(f"{'Farm':<18} {'Capacity':>9} {'Farm ₹':>7} {'Transport':>10} {'Total ₹/kg':>10}")
print("-" * 58)

total_purchase = 0
total_transport = 0

for fid, name, capacity, price, transport, total in farm_data:
    qty = min(remaining, capacity)
    if qty <= 0:
        qty = 0
    purchase = qty * price
    trans = qty * transport
    total_cost = purchase + trans

    total_purchase += purchase
    total_transport += trans
    remaining -= qty

    c.execute('INSERT INTO optimal_plan VALUES (?,?,?,?,?)', (fid, qty, purchase, trans, total_cost))
    marker = ' <<<' if qty > 0 else ''
    print(f"{name:<18} {capacity:>7.0f}kg {price:>6.0f}₹ {transport:>8.1f}₹ {total:>9.1f}₹{marker}")

print(f"\\\n{'':>18} Demand met: {market_demand - remaining:.0f}/{market_demand} kg")
if remaining > 0:
    print(f"  SHORTAGE: {remaining:.0f} kg unmet!")

c.execute('''SELECT f.name, op.quantity_kg, op.purchase_cost, op.transport_cost, op.total_cost
             FROM optimal_plan op JOIN farms f ON op.farm_id=f.id
             WHERE op.quantity_kg > 0 ORDER BY op.total_cost/op.quantity_kg''')

print("\\\n--- Optimal Procurement Plan ---")
print(f"{'Farm':<18} {'Qty':>6} {'Purchase':>9} {'Transport':>10} {'Total':>8} {'₹/kg':>6}")
print("-" * 60)
for name, qty, pur, trans, total in c.fetchall():
    print(f"{name:<18} {qty:>4.0f}kg {pur:>8.0f}₹ {trans:>9.0f}₹ {total:>7.0f}₹ {total/qty:>5.1f}")

print(f"\\\nTotal cost: {total_purchase + total_transport:.0f}₹ for {market_demand}kg")
print(f"Average cost: {(total_purchase + total_transport)/market_demand:.1f}₹/kg")
print(f"  Purchase: {total_purchase:.0f}₹ ({total_purchase/(total_purchase+total_transport)*100:.0f}%)")
print(f"  Transport: {total_transport:.0f}₹ ({total_transport/(total_purchase+total_transport)*100:.0f}%)")

db.close()`,
      challenge: 'Add fuel price variability: if diesel costs 20% more, transport costs rise proportionally. How does the optimal plan change? Which farms become more or less attractive?',
      successHint: 'Supply chain optimisation is a trillion-dollar industry. Amazon, Walmart, and every major retailer uses algorithms like this to minimise costs. You just solved the same problem for an ancient market.',
    },
    {
      title: 'Full market simulation — Ima Keithel economy engine',
      concept: `The capstone integrates everything: vendors, pricing, supply chains, competition, and demand into a complete economic simulation of Ima Keithel.

Over 30 simulated days:
- Vendors buy from farms (supply chain)
- Set prices (dynamic pricing)
- Compete for customers (game theory)
- Track profits (database logging)
- Adjust strategy based on results (learning)

This is an **agent-based economic model** — each vendor is an independent agent making decisions. The emergent market behaviour arises from their interactions.`,
      analogy: 'The full market simulation is like SimCity for economics. Each vendor is a character with their own goals and strategies. The market emerges from their collective behaviour — producing realistic patterns of prices, profits, and competition that no single vendor planned.',
      storyConnection: 'Ima Keithel has operated as a complex adaptive system for 500 years. Our simulation captures the essential dynamics: individual vendors making self-interested decisions that collectively produce a well-functioning market. The invisible hand, made visible in code.',
      checkQuestion: 'Why do agent-based models produce more realistic results than equation-based models?',
      checkAnswer: 'Equation-based models assume all agents are identical and rational. Agent-based models allow heterogeneity (different strategies, risk tolerance, information) and bounded rationality (agents learn imperfectly). Real markets have diverse, imperfect participants — agent-based models capture this reality.',
      codeIntro: 'Run a complete 30-day economic simulation of Ima Keithel.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE sim_vendors (
    id INTEGER PRIMARY KEY, name TEXT, strategy TEXT,
    capital REAL, daily_cost REAL
);
CREATE TABLE sim_daily (
    day INTEGER, vendor_id INTEGER,
    price REAL, quantity_sold REAL, revenue REAL, profit REAL,
    capital_after REAL
);
CREATE TABLE sim_market (
    day INTEGER, avg_price REAL, total_volume REAL,
    active_vendors INTEGER, consumer_surplus REAL
);
''')

np.random.seed(42)
n_vendors = 20
days = 30

# Vendor strategies
strategies = ['conservative', 'aggressive', 'adaptive', 'premium']
for i in range(n_vendors):
    strategy = strategies[i % 4]
    capital = np.random.uniform(5000, 15000)
    daily_cost = np.random.uniform(300, 600)
    c.execute('INSERT INTO sim_vendors VALUES (?,?,?,?,?)',
              (i+1, f'Vendor-{i+1}', strategy, capital, daily_cost))

print("=== Ima Keithel 30-Day Simulation ===\\\n")

for day in range(1, days + 1):
    base_demand = 150 + 50 * np.sin(2 * np.pi * day / 7)  # weekly cycle
    base_demand *= np.random.uniform(0.8, 1.2)

    c.execute('SELECT id, strategy, capital, daily_cost FROM sim_vendors')
    vendors = c.fetchall()
    active = [(v[0], v[1], v[2], v[3]) for v in vendors if v[2] > 0]

    if not active:
        break

    prices = []
    for vid, strategy, capital, cost in active:
        if strategy == 'conservative':
            price = 30 + np.random.uniform(-2, 2)
        elif strategy == 'aggressive':
            price = 25 + np.random.uniform(-3, 3)
        elif strategy == 'adaptive':
            # Look at yesterday's average
            c.execute('SELECT AVG(price) FROM sim_daily WHERE day=? AND profit>0', (day-1,))
            row = c.fetchone()
            avg_winning = row[0] if row[0] else 30
            price = avg_winning * np.random.uniform(0.95, 1.05)
        else:  # premium
            price = 35 + np.random.uniform(-2, 2)
        prices.append((vid, strategy, price, cost))

    # Allocate demand: cheaper vendors get more customers
    total_demand = base_demand * len(active)
    prices.sort(key=lambda x: x[2])

    results = []
    remaining_demand = total_demand
    for vid, strategy, price, cost in prices:
        share = remaining_demand / max(1, len([p for p in prices if p[2] <= price * 1.1]))
        qty = min(share, remaining_demand * 0.3)  # max 30% of remaining
        qty = max(0, qty * np.random.uniform(0.6, 1.4))
        remaining_demand -= qty

        revenue = price * qty
        profit = revenue - cost - 20 * qty  # 20₹/kg procurement cost
        new_capital = next(v[2] for v in active if v[0] == vid) + profit

        c.execute('UPDATE sim_vendors SET capital=? WHERE id=?', (new_capital, vid))
        c.execute('INSERT INTO sim_daily VALUES (?,?,?,?,?,?,?)',
                  (day, vid, price, qty, revenue, profit, new_capital))
        results.append(profit)

    avg_price = np.mean([p[2] for p in prices])
    total_vol = total_demand - remaining_demand
    cs = sum(max(0, 50 - p[2]) * 5 for p in prices)  # simplified consumer surplus

    c.execute('INSERT INTO sim_market VALUES (?,?,?,?,?)',
              (day, avg_price, total_vol, len(active), cs))

# Final report
print(f"{'Day':>4} {'Vendors':>8} {'Avg Price':>9} {'Volume':>8} {'Surplus':>8}")
print("-" * 40)
c.execute('SELECT * FROM sim_market WHERE day % 5 = 0 OR day = 1 ORDER BY day')
for row in c.fetchall():
    print(f"{row[0]:>4} {row[3]:>8} {row[1]:>8.1f}₹ {row[2]:>7.0f} {row[4]:>7.0f}")

print("\\\n--- Strategy Performance ---")
c.execute('''SELECT v.strategy, COUNT(DISTINCT v.id),
             ROUND(AVG(d.profit),0), ROUND(SUM(d.revenue),0),
             ROUND(AVG(v.capital),0)
             FROM sim_vendors v JOIN sim_daily d ON v.id=d.vendor_id
             GROUP BY v.strategy ORDER BY AVG(v.capital) DESC''')
print(f"{'Strategy':<14} {'Count':>6} {'Avg Profit':>11} {'Total Rev':>10} {'Capital':>8}")
for row in c.fetchall():
    print(f"{row[0]:<14} {row[1]:>6} {row[2]:>10}₹ {row[3]:>9}₹ {row[4]:>7}₹")

c.execute('SELECT name, strategy, capital FROM sim_vendors WHERE capital <= 0')
bankruptcies = c.fetchall()
if bankruptcies:
    print(f"\\\nBankruptcies: {len(bankruptcies)}")
    for name, strat, cap in bankruptcies:
        print(f"  {name} ({strat}): final capital {cap:.0f}₹")
else:
    print("\\\nNo bankruptcies — all vendors survived!")

db.close()`,
      challenge: 'Add seasonal events: a festival on day 15 doubles demand, while a strike on day 22 halves it. How do different strategies handle shocks?',
      successHint: 'You just built a complete agent-based economic model. This is how economists, central banks, and tech companies model complex markets. The Ima Keithel simulation captures the same dynamics that govern global economies.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Market Systems & Simulation</span>
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
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
