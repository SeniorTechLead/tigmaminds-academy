import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SilkRouteLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone overview — Trade Route Optimizer',
      concept: `In this capstone you will build a **Trade Route Optimizer** — a system that finds the most profitable multi-city trade routes given commodity prices, route costs, transport capacities, and seasonal constraints. The optimizer combines graph algorithms (shortest paths, max flow), economic modeling (supply/demand, price elasticity), and heuristic search (simulated annealing for TSP variants).

A real trade optimization system must answer: Which goods should a merchant carry? Which cities should they visit? In what order? How much of each good? These decisions are interdependent — the best goods to carry depend on which cities you visit, and the best cities to visit depend on what goods you carry.

Your system will implement:
1. **Commodity price model** — prices vary by city based on local supply/demand
2. **Route cost calculator** — incorporating distance, terrain difficulty, and seasonal factors
3. **Profit-maximizing path finder** — modified Dijkstra that maximizes profit instead of minimizing distance
4. **Multi-stop tour optimizer** — TSP variant where the objective is profit, not distance
5. **Seasonal scheduler** — choosing when to travel based on monsoon patterns and market cycles
6. **Risk assessment** — estimating the probability and cost of route disruptions

This architecture mirrors modern supply chain optimization systems used by companies like Amazon, Maersk, and DHL.`,
      analogy: 'Building a trade route optimizer is like building a stock trading algorithm. Both must find profitable opportunities (price differences between markets/exchanges), plan execution sequences (trade routes/order of trades), manage constraints (capacity/capital), and handle uncertainty (weather/market volatility). The mathematics is remarkably similar.',
      storyConnection: 'Silk Route merchants from Sualkuchi were not just transporters — they were arbitrageurs. They bought Muga silk cheap at the source, carried it to markets where it commanded premium prices, and used the proceeds to buy goods (spices, gems, tea) that were cheap at destination and expensive at home. Your optimizer automates this ancient economic logic.',
      checkQuestion: 'If Muga silk costs 100 per unit in Sualkuchi and sells for 300 in Kunming, but transport costs 80 per unit and takes 30 days, what is the profit margin and annualized return? Compare with selling locally at 120 per unit.',
      checkAnswer: 'Kunming trade: Revenue 300 - Cost 100 - Transport 80 = 120 profit per unit. Margin = 120/180 = 66.7%. Time: 30 days each way = 60 days round trip. Annualized return = (120/180) × (365/60) = 405% per year. Local sale: Revenue 120 - Cost 100 = 20 profit. Immediate return. Annualized = very high (instant turnover). The trade route has higher absolute profit but ties up capital for 60 days. The optimizer must compare risk-adjusted returns.',
      codeIntro: 'Build the commodity price model and route cost calculator that form the foundation of the optimizer.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === TRADE ROUTE OPTIMIZER: Module 1 ===
# Commodity prices and route costs

np.random.seed(42)

class TradeWorld:
    """Silk Route trading world model."""

    CITIES = {
        'Sualkuchi': {'lat': 26.2, 'lon': 92.0, 'type': 'producer', 'specialty': 'silk'},
        'Guwahati': {'lat': 26.1, 'lon': 91.7, 'type': 'hub', 'specialty': 'mixed'},
        'Dhaka': {'lat': 23.8, 'lon': 90.4, 'type': 'hub', 'specialty': 'textiles'},
        'Kolkata': {'lat': 22.6, 'lon': 88.4, 'type': 'market', 'specialty': 'spices'},
        'Imphal': {'lat': 24.8, 'lon': 93.9, 'type': 'frontier', 'specialty': 'gems'},
        'Mandalay': {'lat': 21.9, 'lon': 96.1, 'type': 'hub', 'specialty': 'gems'},
        'Kunming': {'lat': 25.0, 'lon': 102.7, 'type': 'market', 'specialty': 'tea'},
        'Hanoi': {'lat': 21.0, 'lon': 105.8, 'type': 'market', 'specialty': 'ceramics'},
        'Chittagong': {'lat': 22.3, 'lon': 91.8, 'type': 'port', 'specialty': 'spices'},
        'Bagan': {'lat': 21.2, 'lon': 94.9, 'type': 'cultural', 'specialty': 'lacquerware'},
    }

    COMMODITIES = ['silk', 'spices', 'tea', 'gems', 'ceramics', 'lacquerware', 'textiles']

    ROUTES = [
        ('Sualkuchi', 'Guwahati', 1, 'easy'),
        ('Guwahati', 'Dhaka', 8, 'moderate'),
        ('Guwahati', 'Imphal', 5, 'mountain'),
        ('Dhaka', 'Kolkata', 4, 'easy'),
        ('Dhaka', 'Chittagong', 5, 'easy'),
        ('Chittagong', 'Mandalay', 12, 'sea+land'),
        ('Imphal', 'Mandalay', 7, 'mountain'),
        ('Mandalay', 'Kunming', 15, 'mountain'),
        ('Mandalay', 'Hanoi', 14, 'moderate'),
        ('Mandalay', 'Bagan', 4, 'easy'),
        ('Kunming', 'Hanoi', 8, 'moderate'),
        ('Bagan', 'Hanoi', 15, 'moderate'),
    ]

    def __init__(self):
        self.cities = list(self.CITIES.keys())
        self.n = len(self.cities)
        self.idx = {c: i for i, c in enumerate(self.cities)}
        self._generate_prices()
        self._build_routes()

    def _generate_prices(self):
        """Generate commodity prices based on supply/demand."""
        self.base_prices = {}
        for city, info in self.CITIES.items():
            prices = {}
            for commodity in self.COMMODITIES:
                # Low price at source, high price far from source
                if commodity == info['specialty']:
                    prices[commodity] = np.random.uniform(50, 80)  # cheap at source
                elif info['type'] == 'market':
                    prices[commodity] = np.random.uniform(150, 300)  # expensive at markets
                else:
                    prices[commodity] = np.random.uniform(80, 200)
            self.base_prices[city] = prices

    def _build_routes(self):
        self.dist = np.full((self.n, self.n), np.inf)
        self.terrain = {}
        np.fill_diagonal(self.dist, 0)
        for c1, c2, days, terrain in self.ROUTES:
            i, j = self.idx[c1], self.idx[c2]
            self.dist[i, j] = self.dist[j, i] = days
            self.terrain[(i, j)] = self.terrain[(j, i)] = terrain

    def route_cost(self, city1, city2, month=6, load_kg=100):
        """Calculate transport cost including terrain and season."""
        i, j = self.idx[city1], self.idx[city2]
        if self.dist[i, j] == np.inf:
            return np.inf

        base = self.dist[i, j] * 5  # 5 coins per day base cost
        terrain = self.terrain.get((i, j), 'moderate')
        terrain_mult = {'easy': 1.0, 'moderate': 1.3, 'mountain': 2.0, 'sea+land': 1.5}
        season_mult = 1.5 if (6 <= month <= 9 and terrain == 'mountain') else 1.0  # monsoon
        load_mult = 1 + (load_kg - 50) * 0.005  # heavier loads cost more

        return base * terrain_mult[terrain] * season_mult * load_mult

    def get_prices(self, city, month=6):
        """Get prices with seasonal variation."""
        prices = self.base_prices[city].copy()
        for commodity in self.COMMODITIES:
            # Seasonal variation ±20%
            seasonal = 1 + 0.2 * np.sin(2 * np.pi * (month - 3) / 12)
            prices[commodity] *= seasonal
        return prices

world = TradeWorld()

# Visualize prices across cities
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Trade Route Optimizer — Market Analysis', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Price heatmap
price_matrix = np.zeros((len(world.COMMODITIES), world.n))
for i, commodity in enumerate(world.COMMODITIES):
    for j, city in enumerate(world.cities):
        price_matrix[i, j] = world.base_prices[city][commodity]

im = axes[0, 0].imshow(price_matrix, cmap='RdYlGn_r', aspect='auto')
axes[0, 0].set_xticks(range(world.n))
axes[0, 0].set_xticklabels([c[:5] for c in world.cities], color='white', fontsize=6, rotation=45)
axes[0, 0].set_yticks(range(len(world.COMMODITIES)))
axes[0, 0].set_yticklabels(world.COMMODITIES, color='white', fontsize=7)
axes[0, 0].set_title('Commodity prices (green=cheap, red=expensive)', color='white', fontsize=11)
plt.colorbar(im, ax=axes[0, 0])

# Best arbitrage opportunities
arb_profits = []
for commodity in world.COMMODITIES:
    prices = [world.base_prices[c][commodity] for c in world.cities]
    buy_city = world.cities[np.argmin(prices)]
    sell_city = world.cities[np.argmax(prices)]
    profit = max(prices) - min(prices)
    arb_profits.append((commodity, buy_city, sell_city, min(prices), max(prices), profit))

arb_profits.sort(key=lambda x: x[5], reverse=True)

# Plot top arbitrage opportunities
commodities_sorted = [a[0] for a in arb_profits]
profits_sorted = [a[5] for a in arb_profits]
axes[0, 1].barh(commodities_sorted, profits_sorted, color='#22c55e', alpha=0.8)
axes[0, 1].set_xlabel('Price spread (buy low → sell high)', color='white')
axes[0, 1].set_title('Arbitrage opportunities', color='white', fontsize=11)

# Route costs by season
months = range(1, 13)
route_labels = ['Guw→Imp', 'Imp→Man', 'Man→Kun', 'Dhk→Kol']
route_pairs = [('Guwahati','Imphal'), ('Imphal','Mandalay'), ('Mandalay','Kunming'), ('Dhaka','Kolkata')]
for (c1, c2), label in zip(route_pairs, route_labels):
    costs = [world.route_cost(c1, c2, m) for m in months]
    axes[1, 0].plot(list(months), costs, linewidth=2, marker='o', markersize=4, label=label)

axes[1, 0].set_xlabel('Month', color='white')
axes[1, 0].set_ylabel('Transport cost', color='white')
axes[1, 0].set_title('Route costs by season (monsoon premium)', color='white', fontsize=11)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[1, 0].axvspan(6, 9, alpha=0.1, color='#3b82f6')
axes[1, 0].annotate('Monsoon', xy=(7.5, axes[1, 0].get_ylim()[1]*0.9), color='#3b82f6', fontsize=8, ha='center')

# Network map with trade volumes
for c1, c2, days, terrain in world.ROUTES:
    x1, y1 = world.CITIES[c1]['lon'], world.CITIES[c1]['lat']
    x2, y2 = world.CITIES[c2]['lon'], world.CITIES[c2]['lat']
    color = {'easy': '#22c55e', 'moderate': '#f59e0b', 'mountain': '#ef4444', 'sea+land': '#3b82f6'}[terrain]
    axes[1, 1].plot([x1, x2], [y1, y2], color=color, linewidth=1.5, alpha=0.7)

for city, info in world.CITIES.items():
    marker = {'producer':'s', 'hub':'D', 'market':'o', 'frontier':'^', 'port':'p', 'cultural':'*'}[info['type']]
    axes[1, 1].scatter(info['lon'], info['lat'], s=80, marker=marker, c='#f59e0b',
                        edgecolors='white', linewidths=0.5, zorder=5)
    axes[1, 1].annotate(city[:6], (info['lon'], info['lat']), textcoords="offset points",
                         xytext=(4, 4), color='white', fontsize=6)

axes[1, 1].set_xlabel('Longitude', color='white')
axes[1, 1].set_ylabel('Latitude', color='white')
axes[1, 1].set_title('Trade network (color=terrain difficulty)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Top arbitrage opportunities:")
for commodity, buy, sell, low, high, profit in arb_profits[:4]:
    print(f"  {commodity:12s}: buy in {buy:12s} at {low:.0f}, sell in {sell:12s} at {high:.0f} → profit {profit:.0f}")`,
      challenge: 'Add demand elasticity: when a merchant sells 100 units of silk in Kunming, the price drops by 10%. How does this change the optimal trade quantity?',
      successHint: 'The price model captures the fundamental economics of trade: goods are cheap where produced and expensive where consumed. Every trade route exploits this gradient.',
    },
    {
      title: 'Profit-maximizing path finder',
      concept: `Standard Dijkstra minimizes cost. For trade, we need to **maximize profit** — which is revenue minus cost. We modify the algorithm: instead of propagating minimum distance, we propagate maximum achievable profit. At each city, the merchant can buy local goods cheaply and sell goods they are carrying.

The state space is richer than simple shortest paths. A merchant's state is (current_city, goods_carried, capital_available, days_elapsed). The transition from one state to another involves: (1) traveling to a neighboring city (costs time and money), (2) selling carried goods at destination prices, (3) buying new goods at destination prices. The optimal path through this state space maximizes final capital minus initial capital.

This is a form of **dynamic programming on graphs**. The Bellman equation is: V(city, goods, capital, day) = max over all neighbor cities of [V(neighbor, new_goods, new_capital, day + travel_time)], where new_goods and new_capital reflect trades made at the neighbor. The dimensionality of the state space makes exact solutions expensive, but greedy heuristics work well for moderate-sized networks.

The key mathematical insight is that profit-maximizing and cost-minimizing paths are often different. The cheapest route from Sualkuchi to Kunming goes through Dhaka (lower terrain costs), but the most profitable route might go through Imphal and Mandalay (where gems can be traded for additional profit despite higher transport costs).`,
      analogy: 'The difference between shortest-path and profit-maximizing path is like the difference between the fastest commute and the best commute. The fastest route avoids all stops. But if you can pick up dry cleaning, grab coffee, and deposit a check along the way, a slightly longer route that passes these errands is better overall. The merchant does not just travel — they trade at every stop.',
      storyConnection: 'Silk merchants from Sualkuchi did not travel empty on return trips. They sold silk in Mandalay, bought rubies, sold rubies in Kunming, bought tea, and returned with tea to sell in Guwahati. Each leg of the journey generated profit. The total return was far more than a simple one-commodity trip — this is the power of multi-commodity route optimization.',
      checkQuestion: 'If a merchant starts with 1000 coins, silk costs 100 in Sualkuchi, sells for 250 in Mandalay, gems cost 200 in Mandalay and sell for 500 in Kunming, and total transport is 300, what is the final capital if they trade optimally?',
      checkAnswer: 'Start: 1000 coins. Buy 10 units silk at 100 each = 1000 spent, 0 coins left. Travel to Mandalay: sell 10 silk at 250 = 2500 coins. Transport cost leg 1: ~150. Net: 2350. Buy gems: 2350/200 = 11 gems (2200 spent), 150 left. Travel to Kunming: sell 11 gems at 500 = 5500. Transport cost leg 2: ~150. Final: 5500 + 150 - 150 = 5500. Total profit: 5500 - 1000 = 4500, a 450% return.',
      codeIntro: 'Implement the profit-maximizing path finder using dynamic programming on the trade graph.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === TRADE ROUTE OPTIMIZER: Module 2 ===
# Profit-maximizing path finder

np.random.seed(42)

# Simplified trade world
cities = ['Sualkuchi', 'Guwahati', 'Imphal', 'Mandalay', 'Kunming',
          'Dhaka', 'Kolkata', 'Chittagong', 'Hanoi']
n = len(cities)
ci = {c: i for i, c in enumerate(cities)}

# Travel costs (days) and transport costs (coins)
edges = {
    (0,1): (1, 10), (1,2): (5, 60), (1,5): (8, 80),
    (2,3): (7, 100), (3,4): (15, 180), (3,8): (14, 160),
    (5,6): (4, 40), (5,7): (5, 50), (7,3): (12, 140),
    (4,8): (8, 90),
}
# Make bidirectional
edges_bi = {}
for (i,j), (d,c) in edges.items():
    edges_bi[(i,j)] = (d,c)
    edges_bi[(j,i)] = (d,c)

# Commodity prices at each city
commodities = ['silk', 'spices', 'gems', 'tea']
prices = {
    'Sualkuchi': [60, 180, 250, 200],
    'Guwahati': [80, 160, 230, 180],
    'Imphal': [120, 150, 100, 190],
    'Mandalay': [200, 120, 80, 170],
    'Kunming': [280, 200, 350, 60],
    'Dhaka': [100, 140, 200, 150],
    'Kolkata': [150, 80, 180, 120],
    'Chittagong': [130, 90, 160, 140],
    'Hanoi': [250, 170, 300, 80],
}

price_matrix = np.array([prices[c] for c in cities])

def find_profitable_routes(start, initial_capital, max_days=60):
    """Find profitable multi-stop routes using beam search."""
    # State: (city, capital, goods_dict, days_used, path, profit_log)
    beam_width = 200
    states = [(start, initial_capital, {}, 0, [start], [])]
    best_results = []

    for step in range(8):  # max 8 stops
        new_states = []
        for city, capital, goods, days, path, plog in states:
            # Option 1: sell everything and record result
            sell_value = sum(goods.get(c, 0) * price_matrix[city, i]
                           for i, c in enumerate(commodities))
            total_value = capital + sell_value
            profit = total_value - initial_capital
            best_results.append((profit, total_value, days, path.copy(), city))

            # Option 2: trade and move to neighbor
            for (ci_from, ci_to), (travel_days, travel_cost) in edges_bi.items():
                if ci_from != city:
                    continue
                if days + travel_days > max_days:
                    continue
                if ci_to in path[-3:]:  # avoid recent revisits
                    continue

                # Sell current goods at current city
                new_capital = capital + sell_value
                new_capital -= travel_cost

                if new_capital <= 0:
                    continue

                # Buy best commodity at current city for resale at destination
                best_commodity = -1
                best_margin = 0
                for c_idx, comm in enumerate(commodities):
                    buy_price = price_matrix[city, c_idx]
                    sell_price = price_matrix[ci_to, c_idx]
                    margin = (sell_price - buy_price) / buy_price
                    if margin > best_margin and buy_price < new_capital:
                        best_margin = margin
                        best_commodity = c_idx

                new_goods = {}
                if best_commodity >= 0:
                    buy_price = price_matrix[city, best_commodity]
                    units = int(new_capital * 0.8 / buy_price)  # invest 80%
                    if units > 0:
                        new_goods[commodities[best_commodity]] = units
                        new_capital -= units * buy_price

                new_path = path + [ci_to]
                new_plog = plog + [(city, ci_to, best_commodity, best_margin)]
                new_states.append((ci_to, new_capital, new_goods,
                                   days + travel_days, new_path, new_plog))

        # Beam: keep top states by estimated value
        if new_states:
            new_states.sort(key=lambda s: s[1] + sum(s[2].get(c, 0) * 200 for c in commodities), reverse=True)
            states = new_states[:beam_width]
        else:
            break

    best_results.sort(key=lambda x: x[0], reverse=True)
    return best_results[:20]

# Run optimizer
results = find_profitable_routes(ci['Sualkuchi'], 1000, max_days=60)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Trade Route Optimizer — Profit Analysis', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Top routes profit comparison
top_10 = results[:10]
route_labels = [' → '.join(cities[c][:3] for c in r[3]) for r in top_10]
profits = [r[0] for r in top_10]
days = [r[2] for r in top_10]

colors_bar = ['#22c55e' if p > 0 else '#ef4444' for p in profits]
axes[0, 0].barh(range(len(top_10)), profits, color=colors_bar, alpha=0.8)
axes[0, 0].set_yticks(range(len(top_10)))
axes[0, 0].set_yticklabels(route_labels, color='white', fontsize=6)
axes[0, 0].set_xlabel('Profit (coins)', color='white')
axes[0, 0].set_title('Top 10 most profitable routes', color='white', fontsize=11)

# Profit vs time scatter
all_profits = [r[0] for r in results]
all_days = [r[2] for r in results]
axes[0, 1].scatter(all_days, all_profits, c=all_profits, cmap='RdYlGn', s=30, alpha=0.7, edgecolors='white', linewidths=0.3)
axes[0, 1].set_xlabel('Travel days', color='white')
axes[0, 1].set_ylabel('Total profit', color='white')
axes[0, 1].set_title('Profit vs travel time', color='white', fontsize=11)

# Best route visualization
if results:
    best = results[0]
    best_path = best[3]
    coords = {
        'Sualkuchi': (92.0, 26.2), 'Guwahati': (91.7, 26.1),
        'Imphal': (93.9, 24.8), 'Mandalay': (96.1, 21.9),
        'Kunming': (102.7, 25.0), 'Dhaka': (90.4, 23.8),
        'Kolkata': (88.4, 22.6), 'Chittagong': (91.8, 22.3),
        'Hanoi': (105.8, 21.0),
    }

    # Draw all routes faintly
    for (i,j) in edges:
        c1, c2 = cities[i], cities[j]
        if c1 in coords and c2 in coords:
            x1, y1 = coords[c1]; x2, y2 = coords[c2]
            axes[1, 0].plot([x1, x2], [y1, y2], color='gray', linewidth=0.5, alpha=0.3)

    # Draw best route
    for k in range(len(best_path) - 1):
        c1, c2 = cities[best_path[k]], cities[best_path[k+1]]
        if c1 in coords and c2 in coords:
            x1, y1 = coords[c1]; x2, y2 = coords[c2]
            axes[1, 0].annotate('', xy=(x2, y2), xytext=(x1, y1),
                                 arrowprops=dict(arrowstyle='->', color='#22c55e', lw=2.5))

    for city_name, (x, y) in coords.items():
        in_path = any(cities[p] == city_name for p in best_path)
        color = '#22c55e' if in_path else '#4b5563'
        axes[1, 0].scatter(x, y, s=80, c=color, edgecolors='white', linewidths=0.5, zorder=5)
        axes[1, 0].annotate(city_name[:6], (x, y), textcoords="offset points",
                             xytext=(4, 4), color='white', fontsize=7)

axes[1, 0].set_title(f'Best route (profit: {best[0]:.0f})', color='white', fontsize=11)

# Profit per day efficiency
efficiencies = [(r[0] / max(r[2], 1), r) for r in results if r[2] > 0]
efficiencies.sort(reverse=True)
eff_labels = [' → '.join(cities[c][:3] for c in e[1][3]) for e in efficiencies[:8]]
eff_values = [e[0] for e in efficiencies[:8]]
axes[1, 1].barh(range(len(eff_labels)), eff_values, color='#f59e0b', alpha=0.8)
axes[1, 1].set_yticks(range(len(eff_labels)))
axes[1, 1].set_yticklabels(eff_labels, color='white', fontsize=6)
axes[1, 1].set_xlabel('Profit per day', color='white')
axes[1, 1].set_title('Most efficient routes (profit/day)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

if results:
    print(f"Best route found:")
    print(f"  Path: {' → '.join(cities[c] for c in best[3])}")
    print(f"  Profit: {best[0]:.0f} coins (from 1000 initial)")
    print(f"  Return: {best[0]/1000*100:.1f}%")
    print(f"  Days: {best[2]}")
    print(f"  Profit/day: {best[0]/max(best[2],1):.1f}")`,
      challenge: 'Add a "reputation" system: each successful trade at a city increases your future prices by 2% there. How many round trips does it take before the reputation bonus exceeds the transport cost?',
      successHint: 'The profit-maximizing path is fundamentally different from the shortest path. Optimizing for the right objective is often more important than optimizing more efficiently.',
    },
    {
      title: 'Seasonal scheduling and monsoon risk modeling',
      concept: `The Silk Route was not a year-round operation. Monsoon rains from June to September made mountain passes impassable, flooded river crossings, and turned roads to mud. Conversely, winter brought clear skies but cold that slowed travel and increased supply costs. The optimal trading schedule had to account for these seasonal patterns.

We model seasonal effects as **time-varying edge weights** — the cost and feasibility of each route changes month by month. A route that takes 7 days in March might take 20 days (or be completely blocked) in July. The optimization becomes a **time-expanded graph** problem: instead of a single graph, we have 12 copies (one per month), connected by "waiting" edges that represent staying in a city for a month.

Monsoon risk can be modeled as a **stochastic process**: each day during monsoon season, there is a probability p of a route being blocked. Over a 7-day journey with p = 0.1 per day, the probability of at least one blocked day is 1 - (1-0.1)^7 = 52%. The merchant must either accept this risk, plan alternative routes, or time the journey to avoid the monsoon.

The expected value of a trade journey is E[profit] = (1-p_block) × profit_if_success + p_block × loss_if_blocked. Risk-averse merchants will avoid high-risk routes even if the expected profit is positive. This is **expected utility theory**: the pain of a loss outweighs the pleasure of an equivalent gain.`,
      analogy: 'Seasonal scheduling is like planning outdoor events. A wedding planner does not schedule an outdoor reception in monsoon season, even if the venue is cheaper. The risk of rain ruining the event outweighs the cost savings. Similarly, a silk merchant does not send caravans through mountain passes in July, even if competition is lower — the risk of losing the entire shipment is too high.',
      storyConnection: 'Assamese merchants historically synchronized their trade with seasons. Silk was produced in spring (when silkworms were active), transported overland in autumn (post-monsoon, clear roads), sold at winter markets (when demand peaked for warm textiles), and the return journey was in early spring. This annual cycle was not arbitrary — it was optimal seasonal scheduling.',
      checkQuestion: 'If a mountain route has a 5% daily chance of blockage during monsoon (June-Sept) and 0.5% during other months, what is the probability of completing a 10-day journey safely in July vs March?',
      checkAnswer: 'July: P(safe) = (1-0.05)^10 = 0.95^10 = 0.599 or 59.9%. March: P(safe) = (1-0.005)^10 = 0.995^10 = 0.951 or 95.1%. The journey is 59% more likely to be disrupted in July. If the cargo is worth 10,000 coins, the expected loss from disruption is 4,010 coins in July but only 490 in March — an 8× difference in risk.',
      codeIntro: 'Build the seasonal risk model and optimize trade timing across the year.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === TRADE ROUTE OPTIMIZER: Module 3 ===
# Seasonal scheduling and risk

np.random.seed(42)

# Monthly risk and cost multipliers by terrain type
monthly_risk = {
    'easy': [0.01, 0.01, 0.01, 0.02, 0.03, 0.08, 0.12, 0.10, 0.06, 0.02, 0.01, 0.01],
    'moderate': [0.02, 0.02, 0.02, 0.03, 0.05, 0.15, 0.22, 0.18, 0.10, 0.03, 0.02, 0.02],
    'mountain': [0.05, 0.04, 0.03, 0.05, 0.10, 0.30, 0.45, 0.40, 0.25, 0.08, 0.05, 0.05],
    'sea+land': [0.03, 0.03, 0.02, 0.03, 0.06, 0.20, 0.25, 0.22, 0.12, 0.04, 0.03, 0.03],
}

monthly_cost_mult = {
    'easy': [1.0, 1.0, 1.0, 1.0, 1.1, 1.3, 1.5, 1.4, 1.2, 1.0, 1.0, 1.0],
    'moderate': [1.0, 1.0, 1.0, 1.1, 1.2, 1.5, 1.8, 1.6, 1.3, 1.1, 1.0, 1.0],
    'mountain': [1.2, 1.1, 1.0, 1.1, 1.3, 2.0, 2.5, 2.3, 1.8, 1.2, 1.2, 1.2],
    'sea+land': [1.0, 1.0, 1.0, 1.1, 1.2, 1.6, 1.8, 1.7, 1.4, 1.1, 1.0, 1.0],
}

routes = [
    ('Sualkuchi', 'Guwahati', 1, 'easy', 10),
    ('Guwahati', 'Imphal', 5, 'mountain', 60),
    ('Imphal', 'Mandalay', 7, 'mountain', 100),
    ('Mandalay', 'Kunming', 15, 'mountain', 180),
    ('Guwahati', 'Dhaka', 8, 'moderate', 80),
    ('Dhaka', 'Chittagong', 5, 'easy', 50),
    ('Chittagong', 'Mandalay', 12, 'sea+land', 140),
]

# Simulate annual trade schedules
def simulate_journey(route_path, start_month, n_simulations=1000):
    """Monte Carlo simulation of journey success and profit."""
    successes = 0
    profits = []
    durations = []

    for _ in range(n_simulations):
        month = start_month
        total_days = 0
        total_cost = 0
        blocked = False

        for route in route_path:
            name1, name2, base_days, terrain, base_cost = route
            m = int(month) % 12

            # Actual days with random variation
            actual_days = base_days * monthly_cost_mult[terrain][m]
            actual_days *= (1 + np.random.randn() * 0.1)
            actual_days = max(1, actual_days)

            # Check for blockage each day
            for day in range(int(actual_days)):
                current_m = int(month + (total_days + day) / 30) % 12
                if np.random.rand() < monthly_risk[terrain][current_m]:
                    blocked = True
                    break

            if blocked:
                break

            total_days += actual_days
            total_cost += base_cost * monthly_cost_mult[terrain][m]
            month = (start_month + total_days / 30) % 12

        if not blocked:
            successes += 1
            # Profit = trade revenue - costs
            base_revenue = 3000  # expected revenue if journey completes
            profit = base_revenue - total_cost
            profits.append(profit)
            durations.append(total_days)

    success_rate = successes / n_simulations
    avg_profit = np.mean(profits) if profits else 0
    avg_duration = np.mean(durations) if durations else 0

    return success_rate, avg_profit, avg_duration, profits

# Define two route options
mountain_route = [r for r in routes if r[0] in ['Sualkuchi', 'Guwahati', 'Imphal', 'Mandalay']
                  and r[1] in ['Guwahati', 'Imphal', 'Mandalay', 'Kunming']]
mountain_route = [routes[0], routes[1], routes[2], routes[3]]  # via Imphal

coastal_route = [routes[0], routes[4], routes[5], routes[6], routes[3]]  # via Dhaka-Chittagong

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Seasonal Trade Route Analysis', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Success rate by month for both routes
months = range(12)
month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

mt_success = []
ct_success = []
mt_profits = []
ct_profits = []

for m in months:
    sr, ap, _, _ = simulate_journey(mountain_route, m, 500)
    mt_success.append(sr * 100)
    mt_profits.append(ap)
    sr, ap, _, _ = simulate_journey(coastal_route, m, 500)
    ct_success.append(sr * 100)
    ct_profits.append(ap)

axes[0, 0].plot(month_names, mt_success, 'o-', color='#ef4444', linewidth=2, label='Mountain route')
axes[0, 0].plot(month_names, ct_success, 's-', color='#3b82f6', linewidth=2, label='Coastal route')
axes[0, 0].axhspan(0, 50, alpha=0.1, color='#ef4444')
axes[0, 0].set_ylabel('Success rate (%)', color='white')
axes[0, 0].set_title('Journey success rate by departure month', color='white', fontsize=11)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Expected profit by month
axes[0, 1].bar(np.arange(12) - 0.2, mt_profits, 0.4, color='#ef4444', alpha=0.8, label='Mountain')
axes[0, 1].bar(np.arange(12) + 0.2, ct_profits, 0.4, color='#3b82f6', alpha=0.8, label='Coastal')
axes[0, 1].set_xticks(range(12))
axes[0, 1].set_xticklabels(month_names, color='white', fontsize=7)
axes[0, 1].set_ylabel('Expected profit (coins)', color='white')
axes[0, 1].set_title('Expected profit by departure month', color='white', fontsize=11)
axes[0, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[0, 1].axhline(0, color='gray', linewidth=0.5)

# Risk heatmap by route segment and month
segments = ['Sul→Guw', 'Guw→Imp', 'Imp→Man', 'Man→Kun']
terrains = ['easy', 'mountain', 'mountain', 'mountain']
risk_heat = np.zeros((len(segments), 12))

for i, (seg, terr) in enumerate(zip(segments, terrains)):
    risk_heat[i] = monthly_risk[terr]

im = axes[1, 0].imshow(risk_heat * 100, cmap='YlOrRd', aspect='auto')
axes[1, 0].set_xticks(range(12))
axes[1, 0].set_xticklabels(month_names, color='white', fontsize=7)
axes[1, 0].set_yticks(range(len(segments)))
axes[1, 0].set_yticklabels(segments, color='white', fontsize=8)
axes[1, 0].set_title('Daily blockage risk (%) by segment and month', color='white', fontsize=11)
plt.colorbar(im, ax=axes[1, 0], label='Risk (%)')

# Profit distribution for best month
best_month_mt = np.argmax(mt_profits)
_, _, _, profits_mt = simulate_journey(mountain_route, best_month_mt, 2000)
best_month_ct = np.argmax(ct_profits)
_, _, _, profits_ct = simulate_journey(coastal_route, best_month_ct, 2000)

if profits_mt:
    axes[1, 1].hist(profits_mt, bins=30, color='#ef4444', alpha=0.6, label=f'Mountain ({month_names[best_month_mt]})')
if profits_ct:
    axes[1, 1].hist(profits_ct, bins=30, color='#3b82f6', alpha=0.6, label=f'Coastal ({month_names[best_month_ct]})')
axes[1, 1].set_xlabel('Profit (coins)', color='white')
axes[1, 1].set_ylabel('Frequency', color='white')
axes[1, 1].set_title('Profit distribution (best departure months)', color='white', fontsize=11)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

best_month_idx = np.argmax([max(m, c) for m, c in zip(mt_profits, ct_profits)])
print(f"Optimal departure: {month_names[best_month_idx]}")
print(f"  Mountain route: {mt_success[best_month_idx]:.0f}% success, {mt_profits[best_month_idx]:.0f} expected profit")
print(f"  Coastal route: {ct_success[best_month_idx]:.0f}% success, {ct_profits[best_month_idx]:.0f} expected profit")`,
      challenge: 'Implement a "wait or go" decision model: at each city, the merchant can wait a month for better conditions. Find the optimal departure month and waiting strategy that maximizes expected annual profit.',
      successHint: 'Seasonal scheduling is dynamic optimization under uncertainty. The same framework applies to any time-varying decision problem: crop planting, product launches, stock trading.',
    },
    {
      title: 'Multi-commodity portfolio optimization for merchants',
      concept: `A merchant does not carry just one commodity — they carry a **portfolio** of goods, diversifying risk just like a financial investor. If silk prices crash at the destination, having spices and gems in the cargo provides a safety net. The optimal cargo mix depends on expected price spreads, transport costs per weight, and correlations between commodity prices.

This is directly analogous to **Markowitz portfolio theory** from finance. Each commodity has an expected return (price spread minus transport cost) and a risk (price volatility). The covariance between commodity returns matters: if silk and spice prices move together (positive correlation), carrying both does not reduce risk. If silk prices and gem prices move in opposite directions (negative correlation), carrying both reduces total portfolio risk.

The **efficient frontier** in commodity space traces the maximum expected profit for each level of risk. A risk-averse merchant chooses a point on the lower-risk end; an aggressive merchant chooses higher-risk, higher-return combinations. The optimal portfolio weights are found by solving a quadratic optimization: maximize μᵀw - λwᵀΣw, where μ is the expected return vector, Σ is the covariance matrix, w is the portfolio weights, and λ is the risk aversion parameter.

This mathematics is identical whether applied to silk, spices, and gems on the ancient Silk Route or to stocks, bonds, and derivatives on the modern stock exchange.`,
      analogy: 'Commodity diversification is like not putting all your eggs in one basket — literally. If a merchant carries 100% silk and the silk market crashes, they lose everything. If they carry 50% silk and 50% spices, a silk crash is offset by stable spice returns. The portfolio approach converts catastrophic risk into manageable variance.',
      storyConnection: 'Successful Silk Route merchants were not just brave travelers — they were sophisticated portfolio managers. Historical records show that caravans carried dozens of different goods precisely because diversification reduced risk. A merchant who lost a bale of silk to water damage still profited from the gems and spices in the same shipment.',
      checkQuestion: 'If silk has expected return 50% with standard deviation 30%, and gems have expected return 40% with std 20%, and their correlation is -0.3, what is the risk of a 50-50 portfolio?',
      checkAnswer: 'Portfolio variance = 0.5² × 0.30² + 0.5² × 0.20² + 2 × 0.5 × 0.5 × (-0.3) × 0.30 × 0.20 = 0.0225 + 0.01 + (-0.009) = 0.0235. Standard deviation = √0.0235 = 15.3%. The portfolio risk (15.3%) is lower than EITHER individual commodity (30% or 20%) because of negative correlation. Diversification genuinely reduces risk when correlations are negative.',
      codeIntro: 'Build a commodity portfolio optimizer using mean-variance optimization theory.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === TRADE ROUTE OPTIMIZER: Module 4 ===
# Multi-commodity portfolio optimization

np.random.seed(42)

# Commodity data
commodities = ['Muga Silk', 'Black Pepper', 'Ruby Gems', 'Pu-erh Tea', 'Lacquerware', 'Cotton Textiles']
n_commodities = len(commodities)

# Expected returns (price spread as fraction of cost)
expected_returns = np.array([0.55, 0.35, 0.70, 0.40, 0.25, 0.30])

# Generate realistic covariance matrix
# Returns with correlations
n_samples = 200
base_returns = np.random.randn(n_samples, n_commodities)

# Introduce correlations
# Silk and textiles positively correlated (both textile sector)
base_returns[:, 5] = 0.5 * base_returns[:, 0] + 0.5 * base_returns[:, 5]
# Gems and silk negatively correlated (luxury substitutes)
base_returns[:, 2] = -0.3 * base_returns[:, 0] + 0.7 * base_returns[:, 2]
# Tea and pepper uncorrelated with textiles

# Scale to match expected volatilities
volatilities = np.array([0.30, 0.20, 0.40, 0.18, 0.15, 0.22])
returns_scaled = base_returns / base_returns.std(axis=0) * volatilities
returns_scaled += expected_returns

cov_matrix = np.cov(returns_scaled.T)
corr_matrix = np.corrcoef(returns_scaled.T)

# Portfolio optimization
def portfolio_stats(weights, expected_returns, cov_matrix):
    ret = np.dot(weights, expected_returns)
    risk = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    return ret, risk

# Generate random portfolios
n_portfolios = 5000
all_weights = np.random.dirichlet(np.ones(n_commodities), n_portfolios)
all_returns = np.dot(all_weights, expected_returns)
all_risks = np.array([np.sqrt(np.dot(w.T, np.dot(cov_matrix, w))) for w in all_weights])

# Find efficient frontier
n_frontier = 50
target_returns = np.linspace(min(expected_returns), max(expected_returns) * 0.95, n_frontier)
frontier_risks = []
frontier_weights = []

for target_ret in target_returns:
    # Simple: find the lowest-risk portfolio for each return target
    best_risk = np.inf
    best_w = None
    for w, ret, risk in zip(all_weights, all_returns, all_risks):
        if abs(ret - target_ret) < 0.03 and risk < best_risk:
            best_risk = risk
            best_w = w
    if best_w is not None:
        frontier_risks.append(best_risk)
        frontier_weights.append(best_w)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Multi-Commodity Portfolio Optimization', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Efficient frontier
sharpe = all_returns / all_risks
sc = axes[0, 0].scatter(all_risks * 100, all_returns * 100, c=sharpe, cmap='viridis',
                          s=5, alpha=0.3)
if frontier_risks:
    axes[0, 0].plot(np.array(frontier_risks) * 100, target_returns[:len(frontier_risks)] * 100,
                     'r-', linewidth=3, label='Efficient frontier')
# Individual commodities
for i, name in enumerate(commodities):
    axes[0, 0].scatter(volatilities[i] * 100, expected_returns[i] * 100,
                        s=100, edgecolors='white', linewidths=2, zorder=5)
    axes[0, 0].annotate(name[:8], (volatilities[i]*100, expected_returns[i]*100),
                         textcoords="offset points", xytext=(5, 5), color='white', fontsize=7)
plt.colorbar(sc, ax=axes[0, 0], label='Sharpe ratio')
axes[0, 0].set_xlabel('Portfolio risk (% std)', color='white')
axes[0, 0].set_ylabel('Expected return (%)', color='white')
axes[0, 0].set_title('Efficient frontier', color='white', fontsize=11)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Correlation matrix
im = axes[0, 1].imshow(corr_matrix, cmap='RdBu_r', vmin=-1, vmax=1)
axes[0, 1].set_xticks(range(n_commodities))
axes[0, 1].set_xticklabels([c[:6] for c in commodities], color='white', fontsize=7, rotation=45)
axes[0, 1].set_yticks(range(n_commodities))
axes[0, 1].set_yticklabels([c[:6] for c in commodities], color='white', fontsize=7)
axes[0, 1].set_title('Correlation matrix', color='white', fontsize=11)
plt.colorbar(im, ax=axes[0, 1])

# Optimal portfolios for different risk preferences
risk_prefs = {'Conservative': 0.3, 'Moderate': 0.5, 'Aggressive': 0.8}
opt_portfolios = {}

for name, target_sharpe_frac in risk_prefs.items():
    target_idx = int(target_sharpe_frac * len(all_risks))
    sorted_by_sharpe = np.argsort(sharpe)[::-1]
    # Pick one near the target risk level
    target_risk = np.percentile(all_risks, target_sharpe_frac * 100)
    near = np.argmin(np.abs(all_risks - target_risk) + np.abs(sharpe - np.percentile(sharpe, 70)))
    opt_portfolios[name] = all_weights[near]

# Portfolio allocation bars
x = np.arange(n_commodities)
width = 0.25
for i, (name, weights) in enumerate(opt_portfolios.items()):
    axes[1, 0].bar(x + i * width, weights * 100, width, label=name, alpha=0.8)

axes[1, 0].set_xticks(x + width)
axes[1, 0].set_xticklabels([c[:8] for c in commodities], color='white', fontsize=7, rotation=30)
axes[1, 0].set_ylabel('Allocation (%)', color='white')
axes[1, 0].set_title('Optimal cargo mix by risk preference', color='white', fontsize=11)
axes[1, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Monte Carlo profit simulation for optimal vs naive
n_mc = 2000

# Naive: 100% silk
naive_returns = returns_scaled[:, 0]
naive_profits = np.random.choice(naive_returns, n_mc) * 1000

# Optimal: efficient frontier portfolio
if frontier_weights:
    opt_w = frontier_weights[len(frontier_weights)//2]  # middle of frontier
    opt_profits = np.array([np.dot(opt_w, returns_scaled[np.random.randint(n_samples)]) * 1000
                            for _ in range(n_mc)])
else:
    opt_w = np.ones(n_commodities) / n_commodities
    opt_profits = np.array([np.dot(opt_w, returns_scaled[np.random.randint(n_samples)]) * 1000
                            for _ in range(n_mc)])

axes[1, 1].hist(naive_profits, bins=40, color='#ef4444', alpha=0.5, label='100% silk')
axes[1, 1].hist(opt_profits, bins=40, color='#22c55e', alpha=0.5, label='Diversified')
axes[1, 1].axvline(np.mean(naive_profits), color='#ef4444', linestyle='--', linewidth=2)
axes[1, 1].axvline(np.mean(opt_profits), color='#22c55e', linestyle='--', linewidth=2)
axes[1, 1].set_xlabel('Profit (coins per 1000 invested)', color='white')
axes[1, 1].set_title('Profit distribution: concentrated vs diversified', color='white', fontsize=11)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print(f"Portfolio comparison (1000 coin investment):")
print(f"  100% Silk: mean profit = {np.mean(naive_profits):.0f}, std = {np.std(naive_profits):.0f}")
print(f"  Diversified: mean profit = {np.mean(opt_profits):.0f}, std = {np.std(opt_profits):.0f}")
print(f"  Risk reduction: {(1 - np.std(opt_profits)/np.std(naive_profits))*100:.0f}%")
print(f"  Sharpe improvement: {np.mean(opt_profits)/np.std(opt_profits) / (np.mean(naive_profits)/np.std(naive_profits)):.2f}x")`,
      challenge: 'Add weight constraints: the caravan can carry 500 kg total, and each commodity has a different weight per unit value (gems are light and valuable, textiles are heavy and cheap). How do weight constraints change the optimal portfolio?',
      successHint: 'Portfolio theory applies to any decision involving multiple uncertain outcomes. The same mathematics that optimizes cargo for a silk merchant optimizes investment portfolios for a hedge fund.',
    },
    {
      title: 'Network design — where to build new routes',
      concept: `Beyond optimizing travel on existing routes, a more fundamental question is: **which new routes should be built?** Adding a road between two cities costs money but creates value by reducing travel times and enabling new trade flows. The problem is deciding which of the many possible new connections provide the greatest benefit per unit cost.

This is the **network design problem**: given a budget, select edges to add to the graph that maximize some network-wide objective (total trade flow, average path length, network resilience). It is computationally hard (NP-hard in general) but amenable to greedy approximation: repeatedly add the edge that provides the greatest marginal improvement.

The value of a new edge depends on the **structural position** it fills. An edge connecting two previously distant clusters (a **bridge**) is far more valuable than a redundant edge between already well-connected nodes. The concept of **structural holes** (Ron Burt, 1992) quantifies this: gaps in a network where a new connection would create disproportionate value.

Modern infrastructure planning uses exactly these tools. When governments decide whether to build a highway, railway, or port, they estimate the network-wide benefits (reduced travel times, increased trade flow) against the construction cost. Cost-benefit ratios of 2:1 or higher justify investment.`,
      analogy: 'Building new trade routes is like adding highways to a road network. You would not build a highway between two suburbs that are already well-connected — the benefit is marginal. Instead, you build where there is a "gap": connecting an isolated town to the highway system, or linking two major regions that currently require a long detour. Each new connection is evaluated by how much it improves the overall network.',
      storyConnection: 'The British colonial administration in Assam made exactly these network design decisions in the 19th century. They built railways and roads not randomly but strategically — connecting tea estates to river ports, linking Guwahati to the broader Indian rail network. Each connection was justified by the trade flow it would enable. Your optimizer formalizes this same logic.',
      checkQuestion: 'If adding a direct route from Guwahati to Mandalay (bypassing Imphal) costs 10,000 coins to build and reduces average journey time by 5 days for 200 journeys per year, what is the payback period if each day saved is worth 10 coins?',
      checkAnswer: 'Annual benefit = 200 journeys × 5 days × 10 coins/day = 10,000 coins/year. Payback period = 10,000 / 10,000 = 1.0 year. A 1-year payback is excellent — the route pays for itself in a single trading season. The cost-benefit ratio is 10,000/10,000 = 1.0 in year 1, but over 10 years it is 100,000/10,000 = 10.0. Nearly any route with a payback under 5 years is worth building.',
      codeIntro: 'Implement a network design optimizer that identifies the highest-value new routes to build.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === TRADE ROUTE OPTIMIZER: Module 5 ===
# Network design: where to build new routes

np.random.seed(42)

cities = ['Sualkuchi', 'Guwahati', 'Imphal', 'Mandalay', 'Kunming',
          'Dhaka', 'Kolkata', 'Chittagong', 'Hanoi', 'Bagan', 'Lhasa', 'Chengdu']
n = len(cities)
ci = {c: i for i, c in enumerate(cities)}

existing = [
    (0,1,1), (1,2,5), (1,5,8), (1,10,25), (2,3,7), (3,4,15),
    (3,8,14), (3,9,4), (4,8,8), (4,11,10), (5,6,4), (5,7,5),
    (7,3,12), (9,8,15), (10,11,18),
]

coords = {
    'Sualkuchi': (92.0, 26.2), 'Guwahati': (91.7, 26.1),
    'Imphal': (93.9, 24.8), 'Mandalay': (96.1, 21.9),
    'Kunming': (102.7, 25.0), 'Dhaka': (90.4, 23.8),
    'Kolkata': (88.4, 22.6), 'Chittagong': (91.8, 22.3),
    'Hanoi': (105.8, 21.0), 'Bagan': (94.9, 21.2),
    'Lhasa': (91.1, 29.7), 'Chengdu': (104.1, 30.6),
}

def build_dist_matrix(edges):
    dist = np.full((n, n), np.inf)
    np.fill_diagonal(dist, 0)
    for i, j, w in edges:
        dist[i,j] = dist[j,i] = w
    # Floyd-Warshall
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i,k] + dist[k,j] < dist[i,j]:
                    dist[i,j] = dist[i,k] + dist[k,j]
    return dist

def network_score(edges):
    """Score: average inverse distance (higher = better connected)."""
    dist = build_dist_matrix(edges)
    connected = dist < np.inf
    np.fill_diagonal(connected, False)
    if connected.sum() == 0:
        return 0
    return np.sum(1.0 / dist[connected]) / connected.sum()

# Candidate new edges (with construction costs)
existing_set = {(min(i,j), max(i,j)) for i,j,_ in existing}
candidates = []
for i in range(n):
    for j in range(i+1, n):
        if (i, j) not in existing_set:
            # Cost proportional to distance
            xi, yi = coords[cities[i]]
            xj, yj = coords[cities[j]]
            dist_km = np.sqrt(((xi-xj)*85)**2 + ((yi-yj)*111)**2)
            travel_days = dist_km / 30
            build_cost = dist_km * 10  # 10 coins per km
            candidates.append((i, j, travel_days, build_cost))

# Greedy route selection: add the candidate with best marginal benefit
base_score = network_score(existing)
budget = 30000

selected = []
remaining_budget = budget
current_edges = existing.copy()

greedy_history = [(0, base_score, remaining_budget)]

while remaining_budget > 0 and candidates:
    best_value = -np.inf
    best_idx = -1

    for idx, (i, j, days, cost) in enumerate(candidates):
        if cost > remaining_budget:
            continue
        test_edges = current_edges + [(i, j, days)]
        new_score = network_score(test_edges)
        value = (new_score - network_score(current_edges)) / (cost / 1000)  # benefit per 1000 coins
        if value > best_value:
            best_value = value
            best_idx = idx

    if best_idx == -1:
        break

    i, j, days, cost = candidates.pop(best_idx)
    current_edges.append((i, j, days))
    selected.append((cities[i], cities[j], days, cost))
    remaining_budget -= cost

    new_score = network_score(current_edges)
    greedy_history.append((len(selected), new_score, remaining_budget))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Network Design Optimizer — New Route Selection', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Network before and after
for panel, (title, edges_to_draw, new_edges) in enumerate([
    ('Before: existing network', existing, []),
    ('After: with new routes', current_edges, [(i,j,d) for i,j,d,_ in [(ci[s[0]],ci[s[1]],s[2],s[3]) for s in selected]])
]):
    ax = axes[0, panel]
    for i, j, w in edges_to_draw:
        x1, y1 = coords[cities[i]]; x2, y2 = coords[cities[j]]
        is_new = any(min(i,j)==min(ni,nj) and max(i,j)==max(ni,nj) for ni,nj,_ in new_edges)
        color = '#22c55e' if is_new else '#60a5fa'
        lw = 2.5 if is_new else 1
        ax.plot([x1, x2], [y1, y2], color=color, linewidth=lw, alpha=0.7)

    for city_name, (x, y) in coords.items():
        ax.scatter(x, y, s=60, c='#f59e0b', edgecolors='white', linewidths=0.5, zorder=5)
        ax.annotate(city_name[:5], (x, y), textcoords="offset points", xytext=(3, 3),
                     color='white', fontsize=6)
    ax.set_title(title, color='white', fontsize=11)

# Greedy improvement curve
steps = [h[0] for h in greedy_history]
scores = [h[1] for h in greedy_history]
axes[1, 0].plot(steps, scores, 'o-', color='#22c55e', linewidth=2, markersize=6)
for i, s in enumerate(selected):
    axes[1, 0].annotate(f'{s[0][:3]}↔{s[1][:3]}', (i+1, scores[i+1]),
                         textcoords="offset points", xytext=(5, 5), color='white', fontsize=6, rotation=20)
axes[1, 0].set_xlabel('Routes added', color='white')
axes[1, 0].set_ylabel('Network connectivity score', color='white')
axes[1, 0].set_title('Greedy improvement (diminishing returns)', color='white', fontsize=11)

# Cost-benefit of selected routes
if selected:
    route_names = [f'{s[0][:4]}↔{s[1][:4]}' for s in selected]
    costs = [s[3] for s in selected]
    # Benefit: reduction in average shortest path
    cumulative_benefit = [scores[i+1] - scores[i] for i in range(len(selected))]
    ratio = [b / (c/1000) for b, c in zip(cumulative_benefit, costs)]

    axes[1, 1].barh(route_names, ratio, color='#f59e0b', alpha=0.8)
    axes[1, 1].set_xlabel('Benefit per 1000 coins invested', color='white')
    axes[1, 1].set_title('Cost-benefit ratio of selected routes', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Network design results (budget: {budget} coins):")
print(f"  Routes added: {len(selected)}")
for s in selected:
    print(f"    {s[0]} ↔ {s[1]}: {s[2]:.1f} days travel, {s[3]:.0f} coins to build")
print(f"  Budget remaining: {remaining_budget:.0f}")
print(f"  Network score: {scores[0]:.4f} → {scores[-1]:.4f} ({(scores[-1]/scores[0]-1)*100:.1f}% improvement)")`,
      challenge: 'Add a "political constraint": routes crossing between certain country boundaries have a 20% tariff. How does this change which routes are worth building? Some routes may become more valuable because they bypass tariff zones.',
      successHint: 'Network design is the ultimate strategic question: not how to use what exists, but what to build for the future. This is infrastructure planning — and the decisions made today shape trade patterns for centuries.',
    },
    {
      title: 'Complete Trade Route Optimizer — integration dashboard',
      concept: `Your capstone integrates all modules into a unified system: given a merchant's starting city, capital, risk tolerance, and time horizon, the optimizer produces a complete trade plan: which goods to buy, which route to take, when to depart, and how much to invest in each commodity.

The integrated workflow is:
1. **Market analysis** — scan commodity prices across all cities to identify arbitrage opportunities
2. **Route planning** — find the profit-maximizing multi-stop route considering transport costs and seasonal risks
3. **Cargo optimization** — determine the optimal commodity portfolio given the planned route and price forecasts
4. **Risk assessment** — Monte Carlo simulation of journey outcomes under uncertainty
5. **Sensitivity report** — which assumptions matter most and where the plan is vulnerable

This system demonstrates a complete **decision support pipeline**: data → model → optimization → uncertainty quantification → recommendation. It is the same architecture used in modern supply chain management, algorithmic trading, and logistics planning.

The key lesson is that each component alone provides partial insight, but the integrated system provides actionable intelligence. A route optimizer without risk analysis recommends dangerous journeys. A risk model without route optimization suggests staying home. Only the combined system balances opportunity against risk — which is what every good decision-maker does intuitively, but now formalized in code.`,
      analogy: 'The integrated optimizer is like a financial advisor for a silk merchant. A good advisor does not just pick stocks (routes) or assess risk (monsoons) or allocate assets (commodities) — they do all three simultaneously, producing a coherent plan that balances growth and safety. Your system is that advisor, expressed in Python.',
      storyConnection: 'The Silk Route story is ultimately about connections — between people, cultures, and markets. Your optimizer captures the mathematical structure of those connections and reveals their economic logic. Every trade route that enriched Sualkuchi is explained by the numbers: price differentials, transport costs, seasonal patterns, and network position. The story provides the human context; your code provides the quantitative foundation.',
      checkQuestion: 'If the optimizer recommends a route with 85% expected success rate, 40% expected return, and the merchant has enough capital for 10 annual trips, what is the expected total return after accounting for failures (assuming failed trips lose 50% of invested capital)?',
      checkAnswer: 'Per trip expected return = 0.85 × 40% + 0.15 × (-50%) = 34% - 7.5% = 26.5%. After 10 trips: (1 + 0.265)^10 = 1.265^10 = 9.44. Starting with 1000 coins, the merchant expects ~9,440 coins after 10 trips. Even with 15% failure rate, the positive expected value compounds powerfully over time. This is why merchants took risks — the math was in their favor.',
      codeIntro: 'Build the integrated Trade Route Optimizer dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === TRADE ROUTE OPTIMIZER: Complete System ===

np.random.seed(42)

class TradeRouteOptimizer:
    """Integrated trade route optimization system."""

    def __init__(self, start_city, capital, risk_tolerance='moderate', max_days=60):
        self.cities = ['Sualkuchi', 'Guwahati', 'Imphal', 'Mandalay', 'Kunming',
                       'Dhaka', 'Kolkata', 'Chittagong', 'Hanoi']
        self.n = len(self.cities)
        self.ci = {c: i for i, c in enumerate(self.cities)}
        self.start = self.ci[start_city]
        self.capital = capital
        self.risk_tol = {'conservative': 0.3, 'moderate': 0.6, 'aggressive': 0.9}[risk_tolerance]
        self.max_days = max_days

        self.commodities = ['silk', 'spices', 'gems', 'tea', 'ceramics']
        self._setup_world()

    def _setup_world(self):
        self.prices = np.array([
            [60, 180, 250, 200, 150],  # Sualkuchi
            [80, 160, 230, 180, 140],  # Guwahati
            [120, 150, 100, 190, 160], # Imphal
            [200, 120, 80, 170, 100],  # Mandalay
            [280, 200, 350, 60, 180],  # Kunming
            [100, 140, 200, 150, 120], # Dhaka
            [150, 80, 180, 120, 110],  # Kolkata
            [130, 90, 160, 140, 100],  # Chittagong
            [250, 170, 300, 80, 90],   # Hanoi
        ])

        self.edges = {
            (0,1): (1, 10), (1,2): (5, 60), (1,5): (8, 80),
            (2,3): (7, 100), (3,4): (15, 180), (3,8): (14, 160),
            (5,6): (4, 40), (5,7): (5, 50), (7,3): (12, 140),
            (4,8): (8, 90),
        }
        for (i,j), v in list(self.edges.items()):
            self.edges[(j,i)] = v

    def find_routes(self, n_best=10):
        """Find profitable multi-stop routes."""
        routes = []
        # BFS-like exploration
        queue = [(self.start, self.capital, 0, [self.start], {})]

        for _ in range(5000):
            if not queue:
                break
            idx = np.random.randint(len(queue))
            city, cap, days, path, goods = queue.pop(idx)

            # Evaluate current position
            sell_val = sum(goods.get(c, 0) * self.prices[city, i]
                         for i, c in enumerate(self.commodities))
            total = cap + sell_val
            profit = total - self.capital

            if len(path) > 2:
                routes.append((profit, total, days, path.copy()))

            if len(path) > 6 or days > self.max_days:
                continue

            for (ci, cj), (td, tc) in self.edges.items():
                if ci != city or days + td > self.max_days or cj in path[-2:]:
                    continue

                new_cap = cap + sell_val - tc
                if new_cap <= 0:
                    continue

                # Buy best commodity
                margins = [(self.prices[cj,k] - self.prices[city,k]) / max(self.prices[city,k], 1)
                          for k in range(len(self.commodities))]
                best_k = np.argmax(margins)
                units = int(new_cap * 0.8 / max(self.prices[city, best_k], 1))
                new_goods = {self.commodities[best_k]: max(units, 0)}
                new_cap -= units * self.prices[city, best_k]

                queue.append((cj, max(new_cap, 0), days + td, path + [cj], new_goods))

        routes.sort(key=lambda r: r[0], reverse=True)
        return routes[:n_best]

    def monte_carlo(self, route_path, n_sim=500):
        """Simulate route with uncertainty."""
        profits = []
        for _ in range(n_sim):
            cap = self.capital
            success = True
            for k in range(len(route_path) - 1):
                ci, cj = route_path[k], route_path[k+1]
                if (ci, cj) not in self.edges:
                    success = False; break
                td, tc = self.edges[(ci, cj)]
                tc *= (1 + np.random.randn() * 0.15)
                if np.random.rand() < 0.05:
                    success = False; break  # blockage

                # Trade
                margins = self.prices[cj] - self.prices[ci]
                best = np.argmax(margins)
                buy_p = self.prices[ci, best] * (1 + np.random.randn() * 0.1)
                sell_p = self.prices[cj, best] * (1 + np.random.randn() * 0.1)
                units = int(cap * 0.7 / max(buy_p, 1))
                cap = cap - units * buy_p - tc + units * sell_p

            if success:
                profits.append(cap - self.capital)
            else:
                profits.append(-self.capital * 0.3)  # loss on failure

        return np.array(profits)

# Run the optimizer
optimizer = TradeRouteOptimizer('Sualkuchi', 1000, 'moderate', 60)
routes = optimizer.find_routes(15)

# Analyze top routes
analyses = []
for profit, total, days, path in routes[:5]:
    mc_profits = optimizer.monte_carlo(path)
    analyses.append({
        'path': path, 'expected_profit': profit,
        'mc_mean': np.mean(mc_profits), 'mc_std': np.std(mc_profits),
        'success_rate': np.mean(mc_profits > 0) * 100,
        'mc_profits': mc_profits, 'days': days,
        'sharpe': np.mean(mc_profits) / max(np.std(mc_profits), 1)
    })

# Sort by risk-adjusted return (Sharpe)
analyses.sort(key=lambda a: a['sharpe'], reverse=True)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Trade Route Optimizer — Complete Dashboard', color='white', fontsize=16, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Route comparison
coords = {
    'Sualkuchi': (92.0, 26.2), 'Guwahati': (91.7, 26.1),
    'Imphal': (93.9, 24.8), 'Mandalay': (96.1, 21.9),
    'Kunming': (102.7, 25.0), 'Dhaka': (90.4, 23.8),
    'Kolkata': (88.4, 22.6), 'Chittagong': (91.8, 22.3), 'Hanoi': (105.8, 21.0),
}
route_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a78bfa']
for idx, a in enumerate(analyses[:3]):
    path = a['path']
    for k in range(len(path)-1):
        c1, c2 = optimizer.cities[path[k]], optimizer.cities[path[k+1]]
        if c1 in coords and c2 in coords:
            x1, y1 = coords[c1]; x2, y2 = coords[c2]
            offset = idx * 0.15
            axes[0, 0].plot([x1+offset, x2+offset], [y1+offset, y2+offset],
                             color=route_colors[idx], linewidth=2, alpha=0.7)

for city, (x, y) in coords.items():
    axes[0, 0].scatter(x, y, s=50, c='#f59e0b', edgecolors='white', linewidths=0.5, zorder=5)
    axes[0, 0].annotate(city[:5], (x, y), textcoords="offset points", xytext=(3, 3),
                         color='white', fontsize=6)
axes[0, 0].set_title('Top 3 routes', color='white', fontsize=11)

# 2. Risk-return scatter
for i, a in enumerate(analyses):
    axes[0, 1].scatter(a['mc_std'], a['mc_mean'], s=100, c=route_colors[i],
                        edgecolors='white', linewidths=1.5, zorder=5)
    label = '→'.join(optimizer.cities[p][:3] for p in a['path'][:3]) + '...'
    axes[0, 1].annotate(label, (a['mc_std'], a['mc_mean']),
                         textcoords="offset points", xytext=(5, 5), color='white', fontsize=6)
axes[0, 1].set_xlabel('Risk (profit std)', color='white')
axes[0, 1].set_ylabel('Expected profit', color='white')
axes[0, 1].set_title('Risk-return analysis', color='white', fontsize=11)

# 3. Profit distributions
for i, a in enumerate(analyses[:3]):
    axes[0, 2].hist(a['mc_profits'], bins=25, color=route_colors[i], alpha=0.4,
                     label=f'Route {i+1}')
    axes[0, 2].axvline(np.mean(a['mc_profits']), color=route_colors[i], linestyle='--', linewidth=1.5)
axes[0, 2].axvline(0, color='white', linewidth=0.5)
axes[0, 2].set_xlabel('Profit (coins)', color='white')
axes[0, 2].set_title('Profit distributions', color='white', fontsize=11)
axes[0, 2].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4. Metrics comparison
metrics = ['E[Profit]', 'Sharpe', 'Success%', 'Days']
for i, a in enumerate(analyses[:4]):
    vals = [a['mc_mean']/500, a['sharpe'], a['success_rate']/100, (60-a['days'])/60]
    angles = np.linspace(0, 2*np.pi, len(metrics), endpoint=False)
    vals_plot = np.append(vals, vals[0])
    angles_plot = np.append(angles, angles[0])
    axes[1, 0].plot(angles_plot, vals_plot, color=route_colors[i], linewidth=2, label=f'Route {i+1}')
    axes[1, 0].fill(angles_plot, vals_plot, color=route_colors[i], alpha=0.1)
axes[1, 0].set_title('Multi-metric comparison', color='white', fontsize=11)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5. Recommendation
best = analyses[0]
axes[1, 1].axis('off')
rec_text = f"RECOMMENDED ROUTE\
"
rec_text += f"{'='*40}\
\
"
rec_text += f"Path: {' → '.join(optimizer.cities[p] for p in best['path'])}\
\
"
rec_text += f"Expected profit: {best['mc_mean']:.0f} coins\
"
rec_text += f"Success rate: {best['success_rate']:.0f}%\
"
rec_text += f"Risk (std): {best['mc_std']:.0f} coins\
"
rec_text += f"Sharpe ratio: {best['sharpe']:.2f}\
"
rec_text += f"Travel days: {best['days']}\
"
rec_text += f"Return on capital: {best['mc_mean']/1000*100:.1f}%\
"
axes[1, 1].text(0.1, 0.9, rec_text, transform=axes[1, 1].transAxes,
                color='#22c55e', fontsize=10, verticalalignment='top', fontfamily='monospace',
                bbox=dict(boxstyle='round', facecolor='#111827', edgecolor='#22c55e', alpha=0.8))
axes[1, 1].set_title('Recommendation', color='white', fontsize=11)

# 6. Annual projection
annual_returns = []
for year in range(10):
    yearly_profit = 0
    trips = int(365 / max(best['days'] + 10, 30))  # trips per year
    for _ in range(trips):
        mc = optimizer.monte_carlo(best['path'], 1)
        yearly_profit += mc[0]
    annual_returns.append(yearly_profit)

cumulative = np.cumsum(annual_returns) + optimizer.capital
axes[1, 2].bar(range(1, 11), annual_returns, color='#22c55e', alpha=0.8, label='Annual profit')
ax2 = axes[1, 2].twinx()
ax2.plot(range(1, 11), cumulative, 'o-', color='#f59e0b', linewidth=2, label='Cumulative wealth')
ax2.tick_params(colors='#f59e0b')
axes[1, 2].set_xlabel('Year', color='white')
axes[1, 2].set_ylabel('Annual profit', color='white')
ax2.set_ylabel('Total wealth', color='#f59e0b')
axes[1, 2].set_title('10-year projection', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("\
" + "=" * 50)
print("  TRADE ROUTE OPTIMIZER — SUMMARY")
print("=" * 50)
print(f"\
Starting capital: {optimizer.capital} coins")
print(f"Risk tolerance: moderate")
print(f"\
Top route: {' → '.join(optimizer.cities[p] for p in best['path'])}")
print(f"Expected return: {best['mc_mean']/1000*100:.1f}% per trip")
print(f"Success rate: {best['success_rate']:.0f}%")
print(f"10-year projection: {cumulative[-1]:.0f} coins from {optimizer.capital} initial")`,
      challenge: 'Add a "competitor" simulation: 5 other merchants follow similar optimization logic. How does competition affect prices (supply increases at popular destinations)? Does the optimal route change when everyone optimizes simultaneously?',
      successHint: 'You built a complete trade optimization system from graph theory, economics, and Monte Carlo simulation. This capstone connects ancient commerce to modern computational methods — proving that the mathematical principles of trade have not changed in 2000 years.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Trade Route Optimizer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Optimize multi-city trade journeys for maximum profit</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete trade route optimization system. Click to load Python.</p>
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
