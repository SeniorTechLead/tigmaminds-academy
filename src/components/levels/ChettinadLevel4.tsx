import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ChettinadLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Trade route optimizer — multi-objective voyage planner',
      concept: `A real trade voyage must optimize multiple objectives simultaneously: **minimize cost**, **minimize time**, **maximize profit**, and **minimize risk**. These objectives often conflict — the fastest route is not the cheapest, and the most profitable cargo is often the riskiest.

**Multi-objective optimization** finds the set of solutions where no objective can be improved without worsening another — called the **Pareto frontier**. Every point on the Pareto frontier is "optimal" in the sense that no other solution dominates it (is better in all objectives).

In this capstone, you build a complete voyage planner that generates Pareto-optimal route-cargo combinations, letting the trader make informed trade-offs.

*The Pareto frontier is named after Italian economist Vilfredo Pareto, who studied income distribution. In engineering, multi-objective Pareto optimization is used to design aircraft (speed vs fuel efficiency), drugs (efficacy vs side effects), and investments (return vs risk).*`,
      analogy: 'Imagine shopping for a car. You want low price, high speed, and good fuel economy. No car is best in all three. The "Pareto frontier" is the set of cars where you cannot improve one feature without sacrificing another: a cheap efficient car that is slow, a fast expensive car, etc. The best choice depends on your personal priorities.',
      storyConnection: 'Every Chettinad merchant made Pareto trade-offs. A voyage to distant Saigon was more profitable but riskier and longer. A short run to Colombo was safe but less profitable. The master trader considered all factors and chose the voyage that best matched the current family finances, season, and market conditions.',
      checkQuestion: 'Route A: 30 days, $5000 profit, 10% risk. Route B: 15 days, $3000 profit, 5% risk. Does either dominate the other?',
      checkAnswer: 'Neither dominates. Route B is better in time and risk, but Route A is better in profit. Both are on the Pareto frontier. The choice depends on whether the trader values time/safety (choose B) or profit (choose A).',
      codeIntro: 'Build a multi-objective voyage optimizer with Pareto frontier analysis.',
      code: `import numpy as np

np.random.seed(42)

class VoyagePlanner:
    def __init__(self, ports, routes, spices):
        self.ports = ports
        self.routes = routes
        self.spices = spices

    def evaluate_voyage(self, route_indices, cargo_mix):
        """Evaluate a voyage on multiple objectives."""
        total_cost = 0
        total_days = 0
        total_risk = 1.0  # probability of NO loss

        for idx in route_indices:
            r = self.routes[idx]
            total_cost += r["cost"]
            total_days += r["days"]
            total_risk *= (1 - r["risk"])

        total_risk = 1 - total_risk  # probability of SOME loss

        # Calculate profit from cargo
        total_profit = 0
        for spice, qty in cargo_mix.items():
            for s in self.spices:
                if s["name"] == spice:
                    total_profit += qty * s["profit_per_kg"]
                    total_cost += qty * s["buy_price"]

        return {
            "cost": total_cost,
            "days": total_days,
            "risk": total_risk,
            "profit": total_profit,
            "net_profit": total_profit - total_cost,
        }

    def generate_random_voyages(self, n=200):
        """Generate random voyage configurations for Pareto analysis."""
        results = []
        n_routes = len(self.routes)
        spice_names = [s["name"] for s in self.spices]

        for _ in range(n):
            # Random route (2-4 legs)
            n_legs = np.random.randint(2, min(5, n_routes + 1))
            legs = list(np.random.choice(n_routes, n_legs, replace=False))

            # Random cargo
            cargo = {}
            budget = 5000
            for spice in np.random.choice(spice_names, np.random.randint(1, 4), replace=False):
                for s in self.spices:
                    if s["name"] == spice:
                        max_qty = budget / s["buy_price"]
                        qty = np.random.uniform(10, min(max_qty, 500))
                        cargo[spice] = qty
                        budget -= qty * s["buy_price"]
                        if budget <= 0:
                            break

            result = self.evaluate_voyage(legs, cargo)
            result["legs"] = legs
            result["cargo"] = cargo
            results.append(result)

        return results

    def find_pareto_frontier(self, results, objectives):
        """Find Pareto-optimal solutions."""
        pareto = []
        for i, r in enumerate(results):
            dominated = False
            for j, s in enumerate(results):
                if i == j:
                    continue
                better_in_all = True
                better_in_some = False
                for obj, direction in objectives:
                    if direction == "min":
                        if s[obj] > r[obj]:
                            better_in_all = False
                        if s[obj] < r[obj]:
                            better_in_some = True
                    else:
                        if s[obj] < r[obj]:
                            better_in_all = False
                        if s[obj] > r[obj]:
                            better_in_some = True
                if better_in_all and better_in_some:
                    dominated = True
                    break
            if not dominated:
                pareto.append(r)
        return pareto

# Define the network
routes = [
    {"name": "Karaikal-Colombo", "cost": 300, "days": 5, "risk": 0.02},
    {"name": "Colombo-Penang", "cost": 800, "days": 14, "risk": 0.08},
    {"name": "Penang-Singapore", "cost": 250, "days": 3, "risk": 0.01},
    {"name": "Singapore-Saigon", "cost": 500, "days": 6, "risk": 0.05},
    {"name": "Colombo-Singapore", "cost": 900, "days": 16, "risk": 0.10},
    {"name": "Karaikal-Penang", "cost": 750, "days": 12, "risk": 0.06},
]

spices = [
    {"name": "Pepper", "buy_price": 15, "profit_per_kg": 12},
    {"name": "Cardamom", "buy_price": 80, "profit_per_kg": 60},
    {"name": "Cloves", "buy_price": 60, "profit_per_kg": 45},
    {"name": "Cinnamon", "buy_price": 30, "profit_per_kg": 22},
]

planner = VoyagePlanner([], routes, spices)
all_voyages = planner.generate_random_voyages(300)

# Find Pareto frontier
objectives = [("net_profit", "max"), ("days", "min"), ("risk", "min")]
pareto = planner.find_pareto_frontier(all_voyages, objectives)

print("=== Multi-Objective Voyage Optimizer ===")
print(f"Generated {len(all_voyages)} random voyages")
print(f"Pareto-optimal voyages: {len(pareto)}")
print()

# Show top Pareto solutions sorted by profit
pareto_sorted = sorted(pareto, key=lambda x: -x["net_profit"])

header = "Rank  Net Profit   Days   Risk%   Cost     Cargo"
print(header)
print("-" * 65)

for i, v in enumerate(pareto_sorted[:10]):
    cargo_str = ", ".join(f"{s}:{q:.0f}kg" for s, q in v["cargo"].items())
    print(f"{i+1:>4}  USD {v['net_profit']:>8,.0f}   {v['days']:>4}   "
          f"{v['risk']*100:>5.1f}   USD {v['cost']:>6,.0f}  {cargo_str}")

print()
print("Each Pareto solution represents a different trade-off.")
print("High profit = more days and higher risk.")
print("The trader chooses based on current priorities.")`,
      challenge: 'Add seasonal monsoon effects: routes through the Bay of Bengal have 3x higher risk during June-September. Re-run the optimizer for each season and show how the Pareto frontier shifts. The optimal voyage changes dramatically with the monsoons.',
      successHint: 'You built a multi-objective optimizer with Pareto analysis. This exact approach is used in engineering design (aircraft, bridges), financial portfolio management, and AI/ML hyperparameter tuning. The Chettinad traders were intuitive Pareto optimizers.',
    },
    {
      title: 'Warehouse network — optimal storage and distribution',
      concept: `The Chettinad trading house maintained warehouses at multiple ports. Each warehouse decision involves: **how much** of each spice to store, **where** to store it (which ports), and **when** to ship it to market. This is a **facility location and inventory optimization** problem.

The trade-off is between **holding cost** (rent, spoilage, capital tied up) and **stockout cost** (missing a sale because the warehouse is empty). Holding too much inventory wastes money; holding too little loses sales. The optimal inventory level balances these costs.

In this exercise, you build a warehouse network simulator that determines optimal stock levels and distribution timing for the entire Chettinad trade network.

*Inventory optimization is one of the most important problems in supply chain management. Amazon, Walmart, and every major retailer use sophisticated versions of these models to decide what to stock in each warehouse.*`,
      analogy: 'Imagine a chain of water tanks along a pipeline. Each tank costs money to maintain and water evaporates over time (holding cost). But if a tank is empty when someone needs water, you lose a customer (stockout cost). The optimal strategy is to keep each tank partially full — enough to serve customers but not so much that you waste water to evaporation.',
      storyConnection: 'The grand Chettinad mansions (some with over 100 rooms) included massive storerooms for spices. Different rooms were kept at different temperatures: cool underground rooms for delicate spices like saffron and cardamom, ventilated upper rooms for robust spices like pepper. The warehouse design was optimized for preservation cost and quality.',
      checkQuestion: 'If holding cost is $2/ton/month and stockout cost is $50/ton, what is the target service level?',
      checkAnswer: 'The critical ratio = stockout cost / (stockout + holding) = 50 / (50 + 2) = 0.96. This means you should stock enough to meet demand 96% of the time. The remaining 4% risk of stockout is the optimal balance between holding cost and lost sales.',
      codeIntro: 'Simulate a warehouse network and optimize inventory levels across ports.',
      code: `import numpy as np

np.random.seed(42)

class Warehouse:
    def __init__(self, name, capacity_tons, holding_cost_per_ton_month,
                 spoilage_rate_per_month):
        self.name = name
        self.capacity = capacity_tons
        self.holding_cost = holding_cost_per_ton_month
        self.spoilage_rate = spoilage_rate_per_month
        self.inventory = 0
        self.history = []
        self.total_cost = 0
        self.total_spoilage = 0
        self.stockouts = 0

    def receive(self, tons):
        received = min(tons, self.capacity - self.inventory)
        self.inventory += received
        return received

    def ship(self, tons):
        shipped = min(tons, self.inventory)
        if shipped < tons:
            self.stockouts += 1
        self.inventory -= shipped
        return shipped

    def monthly_update(self):
        # Spoilage
        spoiled = self.inventory * self.spoilage_rate
        self.inventory -= spoiled
        self.total_spoilage += spoiled

        # Holding cost
        cost = self.inventory * self.holding_cost
        self.total_cost += cost

        self.history.append(self.inventory)

class TradeNetwork:
    def __init__(self):
        self.warehouses = {}
        self.monthly_demand = {}
        self.monthly_supply = {}

    def add_warehouse(self, wh):
        self.warehouses[wh.name] = wh

    def set_demand(self, port, monthly_avg, monthly_std):
        self.monthly_demand[port] = (monthly_avg, monthly_std)

    def set_supply(self, port, monthly_avg, monthly_std):
        self.monthly_supply[port] = (monthly_avg, monthly_std)

    def simulate(self, months=24):
        for month in range(months):
            for name, wh in self.warehouses.items():
                # Supply arrives
                if name in self.monthly_supply:
                    avg, std = self.monthly_supply[name]
                    supply = max(0, np.random.normal(avg, std))
                    wh.receive(supply)

                # Demand (shipments out)
                if name in self.monthly_demand:
                    avg, std = self.monthly_demand[name]
                    demand = max(0, np.random.normal(avg, std))
                    wh.ship(demand)

                wh.monthly_update()

# Build the Chettinad warehouse network
network = TradeNetwork()

warehouses = [
    Warehouse("Cochin", 500, 1.5, 0.005),
    Warehouse("Colombo", 300, 2.0, 0.008),
    Warehouse("Penang", 400, 2.5, 0.010),
    Warehouse("Singapore", 600, 3.0, 0.006),
]

for wh in warehouses:
    wh.receive(wh.capacity * 0.5)  # start half full
    network.add_warehouse(wh)

# Set supply and demand patterns
network.set_supply("Cochin", 100, 30)       # Spice origin
network.set_supply("Colombo", 20, 10)       # Some local supply
network.set_demand("Cochin", 40, 15)        # Local demand
network.set_demand("Colombo", 60, 20)
network.set_demand("Penang", 80, 25)        # Major market
network.set_demand("Singapore", 120, 35)    # Largest market

# Simulate 24 months
network.simulate(24)

print("=== Warehouse Network Performance (24 months) ===")
print()

header = "Warehouse    Capacity  Final Inv  Spoilage  Hold Cost  Stockouts"
print(header)
print("-" * len(header))

for name, wh in network.warehouses.items():
    print(f"{name:<13} {wh.capacity:>6}t   {wh.inventory:>7.0f}t  "
          f"{wh.total_spoilage:>7.0f}t  USD {wh.total_cost:>8,.0f}  {wh.stockouts:>8}")

total_cost = sum(wh.total_cost for wh in network.warehouses.values())
total_spoilage = sum(wh.total_spoilage for wh in network.warehouses.values())
total_stockouts = sum(wh.stockouts for wh in network.warehouses.values())

print()
print(f"Total holding cost: \{total_cost:,.0f}")
print(f"Total spoilage: {total_spoilage:.0f} tons")
print(f"Total stockouts: {total_stockouts}")
print(f"Service level: {(24*4 - total_stockouts)/(24*4)*100:.1f}%")

# Inventory level analysis
print()
print("=== Monthly Inventory Levels (Singapore) ===")
sg = network.warehouses["Singapore"]
for i, inv in enumerate(sg.history):
    bar = "#" * int(inv / 10)
    print(f"  Month {i+1:>2}: {inv:>5.0f}t  {bar}")`,
      challenge: 'Implement a reorder policy: when inventory drops below a "reorder point," automatically ship from Cochin to replenish. Find the optimal reorder point and reorder quantity that minimize total cost (holding + stockout + shipping) for each warehouse.',
      successHint: 'You built an inventory management simulation. This same approach is used by Amazon, Walmart, and every major supply chain. The Economic Order Quantity (EOQ) model you are approximating was developed in 1913 and remains the foundation of inventory theory.',
    },
    {
      title: 'Ledger and accounting — tracking profit across the network',
      concept: `The Chettinad trading houses maintained meticulous **double-entry accounting** records. Every transaction was recorded twice: a debit and a credit, ensuring the books always balanced. This allowed them to track profit and loss across multiple ports, currencies, and time periods.

A modern accounting system for the trade network must track: **inventory value** at each warehouse, **cost of goods sold** (purchase price of spices that have been sold), **shipping costs**, **holding costs**, **revenue** from sales, and **profit** (revenue minus all costs).

In this exercise, you build a complete accounting engine that tracks every financial transaction across the Chettinad trade network and produces a profit-and-loss statement.

*Double-entry bookkeeping was developed by Luca Pacioli in 1494 (though used earlier by Italian merchants). It is the foundation of all modern accounting and business finance. The Chettinad Nattukotai Chettiars were among the first non-European merchant communities to adopt formal bookkeeping systems.*`,
      analogy: 'Think of double-entry accounting as a balance scale. Every transaction puts a weight on both sides. Buying pepper: one side gains inventory (asset), the other side loses cash (also an asset). Selling pepper: one side gains cash, the other side records revenue. The scale must always balance. If it does not, something is wrong.',
      storyConnection: 'The Chettinad mansions often had a dedicated "accounts room" where clerks maintained ledgers recording every transaction. These ledgers, written in Tamil on palm-leaf manuscripts, tracked debts, credits, exchange rates, and profit shares across the entire trading network. Some of these ledgers survive today and are studied by economic historians.',
      checkQuestion: 'A trader buys 100 kg of pepper at $15/kg and sells it at $28/kg. Shipping cost is $200 and holding cost was $50. What is the gross profit and net profit?',
      checkAnswer: 'Revenue: 100 x $28 = $2800. Cost of goods: 100 x $15 = $1500. Gross profit: $2800 - $1500 = $1300. Net profit: $1300 - $200 (shipping) - $50 (holding) = $1050. Gross margin: 46.4%. Net margin: 37.5%.',
      codeIntro: 'Build a complete accounting engine for the spice trade network.',
      code: `import numpy as np

class TradeLedger:
    def __init__(self):
        self.transactions = []
        self.accounts = {
            "cash": 0,
            "inventory_value": 0,
            "inventory_kg": 0,
            "revenue": 0,
            "cogs": 0,  # cost of goods sold
            "shipping_cost": 0,
            "holding_cost": 0,
            "spoilage_loss": 0,
        }

    def purchase(self, spice, qty_kg, price_per_kg, port):
        total = qty_kg * price_per_kg
        self.accounts["cash"] -= total
        self.accounts["inventory_value"] += total
        self.accounts["inventory_kg"] += qty_kg
        self.transactions.append({
            "type": "PURCHASE", "spice": spice, "qty": qty_kg,
            "price": price_per_kg, "total": total, "port": port,
        })

    def sell(self, spice, qty_kg, sell_price_per_kg, port):
        # Average cost basis
        if self.accounts["inventory_kg"] > 0:
            avg_cost = self.accounts["inventory_value"] / self.accounts["inventory_kg"]
        else:
            avg_cost = 0

        qty_sold = min(qty_kg, self.accounts["inventory_kg"])
        revenue = qty_sold * sell_price_per_kg
        cost_basis = qty_sold * avg_cost

        self.accounts["cash"] += revenue
        self.accounts["revenue"] += revenue
        self.accounts["cogs"] += cost_basis
        self.accounts["inventory_value"] -= cost_basis
        self.accounts["inventory_kg"] -= qty_sold

        self.transactions.append({
            "type": "SALE", "spice": spice, "qty": qty_sold,
            "price": sell_price_per_kg, "total": revenue, "port": port,
        })

    def ship(self, cost, from_port, to_port):
        self.accounts["cash"] -= cost
        self.accounts["shipping_cost"] += cost
        self.transactions.append({
            "type": "SHIPPING", "total": cost,
            "port": from_port + " -> " + to_port,
        })

    def record_holding_cost(self, cost):
        self.accounts["cash"] -= cost
        self.accounts["holding_cost"] += cost

    def record_spoilage(self, qty_kg):
        if self.accounts["inventory_kg"] > 0:
            avg_cost = self.accounts["inventory_value"] / self.accounts["inventory_kg"]
        else:
            avg_cost = 0
        loss = qty_kg * avg_cost
        self.accounts["inventory_kg"] -= qty_kg
        self.accounts["inventory_value"] -= loss
        self.accounts["spoilage_loss"] += loss

    def profit_and_loss(self):
        a = self.accounts
        gross_profit = a["revenue"] - a["cogs"]
        operating_expenses = a["shipping_cost"] + a["holding_cost"] + a["spoilage_loss"]
        net_profit = gross_profit - operating_expenses
        margin = net_profit / a["revenue"] * 100 if a["revenue"] > 0 else 0

        return {
            "revenue": a["revenue"],
            "cogs": a["cogs"],
            "gross_profit": gross_profit,
            "shipping": a["shipping_cost"],
            "holding": a["holding_cost"],
            "spoilage": a["spoilage_loss"],
            "operating_expenses": operating_expenses,
            "net_profit": net_profit,
            "net_margin": margin,
        }

# Simulate a complete trading year
ledger = TradeLedger()
ledger.accounts["cash"] = 100000  # starting capital

# Trading activity
trades = [
    ("purchase", "Pepper", 2000, 15, "Cochin"),
    ("purchase", "Cardamom", 200, 80, "Cochin"),
    ("purchase", "Cloves", 300, 60, "Cochin"),
    ("ship", 800, "Cochin", "Colombo"),
    ("holding", 150),
    ("sell", "Pepper", 500, 22, "Colombo"),
    ("ship", 1500, "Colombo", "Penang"),
    ("holding", 200),
    ("spoilage", 30),
    ("sell", "Pepper", 800, 25, "Penang"),
    ("sell", "Cardamom", 150, 140, "Penang"),
    ("ship", 1200, "Penang", "Singapore"),
    ("holding", 180),
    ("sell", "Pepper", 670, 28, "Singapore"),
    ("sell", "Cloves", 300, 105, "Singapore"),
    ("sell", "Cardamom", 50, 150, "Singapore"),
]

for trade in trades:
    if trade[0] == "purchase":
        ledger.purchase(trade[1], trade[2], trade[3], trade[4])
    elif trade[0] == "sell":
        ledger.sell(trade[1], trade[2], trade[3], trade[4])
    elif trade[0] == "ship":
        ledger.ship(trade[1], trade[2], trade[3])
    elif trade[0] == "holding":
        ledger.record_holding_cost(trade[1])
    elif trade[0] == "spoilage":
        ledger.record_spoilage(trade[1])

pnl = ledger.profit_and_loss()

print("=" * 50)
print("  CHETTINAD TRADING HOUSE")
print("  PROFIT AND LOSS STATEMENT")
print("=" * 50)
print(f"  Revenue:              USD {pnl['revenue']:>10,.0f}")
print(f"  Cost of Goods Sold:   USD {pnl['cogs']:>10,.0f}")
print(f"                        {'-'*12}")
print(f"  Gross Profit:         USD {pnl['gross_profit']:>10,.0f}")
print()
print(f"  Operating Expenses:")
print(f"    Shipping:           USD {pnl['shipping']:>10,.0f}")
print(f"    Holding/Storage:    USD {pnl['holding']:>10,.0f}")
print(f"    Spoilage Loss:      USD {pnl['spoilage']:>10,.0f}")
print(f"                        {'-'*12}")
print(f"  Total Expenses:       USD {pnl['operating_expenses']:>10,.0f}")
print()
print(f"  NET PROFIT:           USD {pnl['net_profit']:>10,.0f}")
print(f"  Net Margin:           {pnl['net_margin']:>9.1f}%")
print("=" * 50)

print()
print("=== Transaction Log (first 8) ===")
for t in ledger.transactions[:8]:
    if t["type"] == "PURCHASE":
        print(f"  BUY  {t['qty']:>5}kg {t['spice']:<10} @USD {t['price']}/kg at {t['port']}")
    elif t["type"] == "SALE":
        print(f"  SELL {t['qty']:>5}kg {t['spice']:<10} @USD {t['price']}/kg at {t['port']}")
    elif t["type"] == "SHIPPING":
        print(f"  SHIP USD {t['total']:>5} via {t['port']}")`,
      challenge: 'Add multi-currency support: purchases in Indian Rupees, sales in Malay Dollars and Straits Dollars. Track exchange rate gains/losses as a separate P&L line item. Historical Chettinad traders had to manage 5-6 different currencies.',
      successHint: 'You built a complete accounting system. Every business in the world, from a street vendor to a multinational corporation, uses the same profit-and-loss structure. You have connected 19th-century Chettinad commerce to modern financial accounting.',
    },
    {
      title: 'Complete spice trade simulator — from harvest to market',
      concept: `In this final capstone, you integrate everything into a complete end-to-end spice trade simulator. Starting from the spice harvest, it models: drying and preservation, quality degradation during storage, optimal cargo selection, route optimization, warehouse management, market price dynamics, and financial accounting.

The simulator runs a full trading year, making decisions at each step: when to buy (based on harvest timing and prices), how to preserve (based on journey length), which route to take (based on monsoon season and costs), and when to sell (based on market prices). The output is a complete financial report showing profit, loss, and return on investment.

This is a **supply chain simulation** — the same type of model used by Amazon, Walmart, and every major logistics company to plan their operations.

*Supply chain management is the coordination of all activities from raw material to final customer. It is one of the most important applications of operations research, combining optimization, simulation, statistics, and economics.*`,
      analogy: 'Think of it as a board game where you play as a Chettinad merchant. Each turn, you make decisions: buy spices (how much, which type, at what price), ship them (which route, at what risk), store them (which warehouse, for how long), and sell them (at which market, at what price). The simulator plays this game automatically, tracking every decision and its financial impact.',
      storyConnection: 'This simulator captures the essence of what the Chettinad Nattukotai Chettiars did for centuries: manage a complex, multi-port, multi-commodity trading operation across the Indian Ocean. Their success depended on optimizing every link in the supply chain — from harvest timing to market selection — using accumulated knowledge passed down through generations.',
      checkQuestion: 'If you had to choose one thing to optimize in this supply chain, what would give the biggest profit improvement?',
      checkAnswer: 'Typically, the biggest single improvement comes from better market timing — buying when prices are low (post-harvest glut) and selling when prices are high (pre-festival demand). A 20% improvement in buying price translates directly to 20% more profit, while a 20% reduction in shipping cost might only improve profit by 5-10% because shipping is a smaller fraction of total cost.',
      codeIntro: 'Run a complete end-to-end spice trade simulation for a full trading year.',
      code: `import numpy as np

np.random.seed(42)

class SpiceTradeSimulator:
    def __init__(self, starting_capital):
        self.capital = starting_capital
        self.initial_capital = starting_capital
        self.inventory = {}  # {spice: {"qty": kg, "cost_basis": $/kg, "age_months": int}}
        self.log = []
        self.monthly_capital = [starting_capital]

    def buy_spices(self, month, market_prices):
        """Buy spices based on seasonal pricing."""
        # Buy more when prices are low (harvest season)
        budget = self.capital * 0.3  # spend up to 30% of capital
        for spice, price in market_prices.items():
            if budget <= 0:
                break
            # Simple strategy: buy if price is below 12-month average
            qty = min(budget / price, 500)
            cost = qty * price
            if cost > budget:
                qty = budget / price
                cost = qty * price

            self.capital -= cost
            if spice in self.inventory:
                old = self.inventory[spice]
                total_qty = old["qty"] + qty
                avg_cost = (old["qty"] * old["cost_basis"] + cost) / total_qty
                self.inventory[spice] = {"qty": total_qty, "cost_basis": avg_cost, "age_months": 0}
            else:
                self.inventory[spice] = {"qty": qty, "cost_basis": price, "age_months": 0}

            budget -= cost
            self.log.append(f"  Month {month}: BUY {qty:.0f}kg {spice} @\{price:.1f}")

    def sell_spices(self, month, market_prices):
        """Sell spices when prices are high."""
        for spice, data in list(self.inventory.items()):
            if spice not in market_prices:
                continue
            sell_price = market_prices[spice]
            margin = (sell_price - data["cost_basis"]) / data["cost_basis"]

            # Sell if margin > 40% or spice is getting old (> 4 months)
            if margin > 0.4 or data["age_months"] > 4:
                qty = data["qty"]
                revenue = qty * sell_price
                self.capital += revenue
                self.log.append(f"  Month {month}: SELL {qty:.0f}kg {spice} @\{sell_price:.1f} "
                                f"(margin: {margin*100:.0f}%)")
                del self.inventory[spice]

    def apply_spoilage(self):
        """Monthly spoilage based on spice age."""
        for spice, data in self.inventory.items():
            spoilage_rate = 0.005 * (1 + data["age_months"] * 0.1)
            loss = data["qty"] * spoilage_rate
            data["qty"] -= loss
            data["age_months"] += 1

    def apply_costs(self):
        """Monthly storage and overhead costs."""
        total_kg = sum(d["qty"] for d in self.inventory.values())
        holding_cost = total_kg * 0.5  # $0.50/kg/month
        overhead = 500  # fixed monthly overhead
        self.capital -= (holding_cost + overhead)

    def simulate_year(self):
        months = ["Jan","Feb","Mar","Apr","May","Jun",
                   "Jul","Aug","Sep","Oct","Nov","Dec"]

        # Seasonal price patterns (base price multipliers)
        seasonal = {
            "Pepper":   [1.0, 0.95, 0.90, 0.85, 0.90, 1.00, 1.10, 1.15, 1.20, 0.80, 0.75, 0.85],
            "Cardamom": [1.0, 1.05, 1.10, 1.05, 1.00, 0.95, 0.90, 0.95, 1.15, 1.20, 1.10, 1.00],
            "Cloves":   [0.95, 0.90, 0.95, 1.00, 1.05, 1.10, 1.15, 1.10, 1.05, 0.85, 0.80, 0.90],
        }
        base_prices = {"Pepper": 15, "Cardamom": 80, "Cloves": 60}

        for m in range(12):
            # Generate market prices with noise
            buy_prices = {}
            sell_prices = {}
            for spice in base_prices:
                noise = np.random.normal(1.0, 0.08)
                buy_prices[spice] = base_prices[spice] * seasonal[spice][m] * noise
                sell_prices[spice] = buy_prices[spice] * 1.6 * np.random.normal(1.0, 0.05)

            self.log.append(f"--- {months[m]} ---")

            # Buy during harvest months (low prices)
            if seasonal["Pepper"][m] < 0.92:
                self.buy_spices(m, buy_prices)

            # Sell during high-price months
            self.sell_spices(m, sell_prices)

            self.apply_spoilage()
            self.apply_costs()
            self.monthly_capital.append(self.capital + sum(
                d["qty"] * d["cost_basis"] for d in self.inventory.values()))

        # Liquidate remaining inventory at current prices
        for spice, data in list(self.inventory.items()):
            sell_price = base_prices[spice] * 1.3  # liquidation discount
            revenue = data["qty"] * sell_price
            self.capital += revenue
            self.log.append(f"  LIQUIDATE {data['qty']:.0f}kg {spice} @\{sell_price:.1f}")
        self.inventory.clear()

# Run simulation
sim = SpiceTradeSimulator(starting_capital=100000)
sim.simulate_year()

print("=" * 55)
print("  ANNUAL SPICE TRADE SIMULATION REPORT")
print("=" * 55)
print()

# Print key transactions
for entry in sim.log:
    if "BUY" in entry or "SELL" in entry or "LIQUIDATE" in entry:
        print(entry)

print()
roi = (sim.capital - sim.initial_capital) / sim.initial_capital * 100
print(f"Starting capital:  USD {sim.initial_capital:>10,.0f}")
print(f"Final capital:     USD {sim.capital:>10,.0f}")
print(f"Profit/Loss:       USD {sim.capital - sim.initial_capital:>10,.0f}")
print(f"Return on Investment: {roi:>8.1f}%")
print()

# Monthly portfolio value
print("=== Monthly Portfolio Value ===")
months_labels = ["Start","Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"]
for i, val in enumerate(sim.monthly_capital):
    bar = "#" * int(val / 5000)
    label = months_labels[i] if i < len(months_labels) else f"M{i}"
    print(f"  {label:<6} \{val:>9,.0f} {bar}")`,
      challenge: 'Add multiple traders competing in the same market: when one trader buys heavily, prices rise (reducing the others\' margins). Simulate 3 competing trading houses and see how competition affects profitability. This is the beginning of game theory applied to markets.',
      successHint: 'You have built a complete supply chain simulator — from harvest to market to financial reporting. This is the same type of model that modern logistics companies, commodity traders, and supply chain consultants use every day. You have bridged centuries of Chettinad trading wisdom with modern computational supply chain management.',
    },
    {
      title: 'Decision dashboard — real-time trade intelligence system',
      concept: `The Chettinad trading house needs a **decision dashboard** — a single view that combines market prices, inventory status, route conditions, risk levels, and financial performance into actionable insights. Modern supply chain dashboards aggregate data from thousands of sensors and sources into key performance indicators (KPIs).

The dashboard answers three questions every morning: (1) What should we buy today? (based on current prices vs historical averages), (2) What should we ship? (based on inventory levels and market demand), and (3) What is our financial position? (profit, cash flow, risk exposure).

In this final exercise, you build the complete decision dashboard that a Chettinad trading house manager would check each morning to make the day's trading decisions.

*Business intelligence dashboards are used by every major company. Amazon's supply chain dashboard monitors millions of data points in real time. The principles are the same as the Chettinad dashboard — aggregate data, compute KPIs, and highlight actionable insights.*`,
      analogy: 'Think of a car dashboard. The speedometer, fuel gauge, temperature, and warning lights give you everything you need to drive safely. You do not need to understand the engine internals — just the key indicators. A trading dashboard does the same: it distils complex supply chain data into a few numbers that guide decisions.',
      storyConnection: 'The Chettinad trading houses had their own version of a dashboard: a daily ledger summary prepared by the head clerk each morning, showing cash position, outstanding debts, inventory levels at each port, and any urgent messages from agents. The modern dashboard automates and extends this centuries-old practice.',
      checkQuestion: 'If pepper price is 20% below the 6-month average, inventory is at 30% capacity, and cash reserves are at 80%, what action does the dashboard recommend?',
      checkAnswer: 'BUY aggressively. Price is low (good buying opportunity), inventory is low (room to stock up), and cash is high (can afford to buy). All three indicators align for a buy signal. If any one were different (e.g., cash at 10%), the recommendation would change to "hold" or "buy cautiously."',
      codeIntro: 'Build a real-time trade decision dashboard.',
      code: `import numpy as np

np.random.seed(42)

class TradeDashboard:
    def __init__(self):
        self.spices = {
            "Pepper":   {"price": 16, "avg_6mo": 15, "inventory_kg": 1500, "capacity": 5000},
            "Cardamom": {"price": 72, "avg_6mo": 80, "inventory_kg": 100,  "capacity": 500},
            "Cloves":   {"price": 65, "avg_6mo": 60, "inventory_kg": 300,  "capacity": 800},
            "Cinnamon": {"price": 28, "avg_6mo": 30, "inventory_kg": 800,  "capacity": 2000},
        }
        self.cash = 75000
        self.total_capital = 120000
        self.active_shipments = 3
        self.days_at_sea = [12, 5, 22]
        self.route_risks = {"Colombo-Penang": 0.05, "Penang-Singapore": 0.02}

    def price_signal(self, spice):
        s = self.spices[spice]
        deviation = (s["price"] - s["avg_6mo"]) / s["avg_6mo"]
        if deviation < -0.15:
            return "STRONG BUY", deviation
        elif deviation < -0.05:
            return "BUY", deviation
        elif deviation > 0.15:
            return "STRONG SELL", deviation
        elif deviation > 0.05:
            return "SELL", deviation
        return "HOLD", deviation

    def inventory_status(self, spice):
        s = self.spices[spice]
        fill_pct = s["inventory_kg"] / s["capacity"] * 100
        if fill_pct < 20:
            return "LOW", fill_pct
        elif fill_pct > 80:
            return "HIGH", fill_pct
        return "OK", fill_pct

    def generate_report(self):
        print("=" * 60)
        print("  CHETTINAD TRADING HOUSE  -  MORNING DASHBOARD")
        print("  " + "=" * 56)

        # Financial summary
        cash_pct = self.cash / self.total_capital * 100
        print(f"\\\n  FINANCIAL POSITION:")
        print(f"    Cash: ${self.cash:,.0f} ({cash_pct:.0f}% of capital)")
        print(f"    Active shipments: {self.active_shipments}")

        # Market signals
        print(f"\\\n  MARKET SIGNALS:")
        header = "    Spice        Price  6mo Avg  Signal       Deviation"
        print(header)
        print("    " + "-" * 52)

        buy_list = []
        sell_list = []
        for spice in self.spices:
            signal, dev = self.price_signal(spice)
            s = self.spices[spice]
            marker = "<--" if "STRONG" in signal else ""
            print(f"    {spice:<12} ${s['price']:>4}   ${s['avg_6mo']:>4}    "
                  f"{signal:<12} {dev:>+6.0%}  {marker}")
            if "BUY" in signal:
                buy_list.append(spice)
            elif "SELL" in signal:
                sell_list.append(spice)

        # Inventory status
        print(f"\\\n  INVENTORY STATUS:")
        header2 = "    Spice        Stock(kg)  Capacity  Fill%   Status"
        print(header2)
        print("    " + "-" * 48)

        for spice in self.spices:
            status, fill = self.inventory_status(spice)
            s = self.spices[spice]
            alert = "!!!" if fill < 15 or fill > 90 else ""
            print(f"    {spice:<12} {s['inventory_kg']:>7}    {s['capacity']:>6}    "
                  f"{fill:>4.0f}%   {status}  {alert}")

        # Recommendations
        print(f"\\\n  RECOMMENDATIONS:")
        if buy_list:
            print(f"    BUY: {', '.join(buy_list)} (prices below average)")
        if sell_list:
            print(f"    SELL: {', '.join(sell_list)} (prices above average)")

        # Risk summary
        total_risk = 1 - np.prod([1 - r for r in self.route_risks.values()])
        print(f"\\\n  RISK EXPOSURE:")
        print(f"    Portfolio risk index: {total_risk:.1%}")
        for route, risk in self.route_risks.items():
            print(f"    {route}: {risk:.1%} loss probability")

        # Score
        score = 0
        if cash_pct > 50: score += 1
        if len(buy_list) > 0: score += 1
        if total_risk < 0.10: score += 1
        overall = ["CAUTION", "MODERATE", "FAVORABLE", "EXCELLENT"][score]
        print(f"\\\n  OVERALL TRADING CONDITIONS: {overall}")
        print("=" * 60)

dashboard = TradeDashboard()
dashboard.generate_report()`,
      challenge: 'Add a "what-if" mode: let the user change one input (e.g., pepper price drops 30%) and instantly see how all recommendations and financial projections change. This is scenario analysis — the most powerful tool for strategic decision-making.',
      successHint: 'You have built a complete business intelligence dashboard — the same type of tool used by commodity traders, supply chain managers, and business executives worldwide. The Chettinad trading tradition, spanning centuries of accumulated wisdom about markets, risk, and logistics, has been transformed into a computational decision-support system.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Optimize a complete spice trade route</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These capstone exercises build a complete spice trade simulation from harvest to market.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
