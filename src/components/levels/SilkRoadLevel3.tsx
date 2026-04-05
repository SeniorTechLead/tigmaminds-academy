import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SilkRoadLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Agent-based trade simulation — merchants making buy/sell decisions',
      concept: `In Level 2, we modelled markets as aggregate supply and demand curves. But real markets are made of **individual merchants** making decisions based on local information, personal wealth, and risk tolerance. **Agent-based modelling (ABM)** simulates each merchant as an independent "agent" with their own rules.

Each merchant agent has:
- A **location** (which city they're in)
- An **inventory** (goods they're carrying)
- A **budget** (gold coins available)
- A **strategy** (rules for when to buy, sell, or travel)

The emergent behaviour of the market — prices, trade volumes, shortages — arises from the interactions of these individual agents, not from top-down equations. This is a fundamentally different approach to modelling.

The key insight: **simple individual rules can produce complex system-level patterns**. No single merchant controls the price of silk, but the collective behaviour of thousands of merchants creates stable price gradients, boom-bust cycles, and market crashes.

📚 *Emergence is when simple individual behaviours create complex group patterns. A flock of birds emerges from each bird following three simple rules: stay close, don't collide, match speed. No bird plans the flock's shape.*`,
      analogy: 'A traffic jam isn\'t "designed" by any single driver. Each driver follows simple rules: maintain distance, don\'t crash, change lanes if faster. Yet the collective result is stop-and-go waves, phantom jams, and gridlock — complex patterns no individual intended. Agent-based modelling captures this emergence by simulating each driver (merchant) individually.',
      storyConnection: 'The Sogdian merchants of Central Asia were the Silk Road\'s most successful traders precisely because of their individual decision-making. Each Sogdian merchant made independent buy/sell choices based on local prices, seasonal demand, and their own network of contacts in distant cities. Their collective behaviour created a remarkably efficient trade network spanning 5,000 km — without any central coordinator.',
      checkQuestion: 'Why can\'t we model a market with 1,000 merchants using a single supply-demand equation?',
      checkAnswer: 'Because the aggregate equation assumes all merchants are identical, have perfect information, and act simultaneously. In reality, merchants have different budgets, knowledge, risk tolerances, and locations. A wealthy Sogdian merchant and a poor local trader respond to the same price signal very differently. Agent-based models capture this heterogeneity.',
      codeIntro: 'Build an agent-based market simulation with individual merchant agents making buy/sell decisions.',
      code: `import numpy as np

np.random.seed(42)

class Merchant:
    """An individual trader on the Silk Road."""
    def __init__(self, name, home, gold, risk_tolerance):
        self.name = name
        self.home = home
        self.location = home
        self.gold = gold
        self.inventory = 0  # units of silk
        self.risk_tolerance = risk_tolerance
        self.total_profit = 0
        self.trades = 0

    def decide(self, local_price, destination_price, transport_cost):
        """Buy, sell, or hold based on expected profit."""
        expected_profit = destination_price - local_price - transport_cost
        # Risk-adjusted decision: need expected profit > threshold
        threshold = (1 - self.risk_tolerance) * 20  # cautious traders need bigger margins
        if expected_profit > threshold and self.gold >= local_price:
            return "BUY"
        elif self.inventory > 0 and local_price > 0:
            return "SELL"
        return "HOLD"

class City:
    def __init__(self, name, base_price, volatility):
        self.name = name
        self.base_price = base_price
        self.price = base_price
        self.volatility = volatility
        self.supply = 100

    def update_price(self, buy_pressure, sell_pressure):
        net = sell_pressure - buy_pressure  # more selling -> lower price
        self.price = max(5, self.price + net * 0.5 + np.random.normal(0, self.volatility))

# Set up the simulation
cities = {
    "Chang'an":       City("Chang'an", 20, 2),
    "Kashgar":        City("Kashgar", 45, 3),
    "Samarkand":      City("Samarkand", 65, 4),
    "Baghdad":        City("Baghdad", 85, 3),
    "Constantinople": City("Constantinople", 120, 5),
}
city_list = list(cities.keys())

# Create merchants with varying wealth and risk tolerance
merchants = []
for i in range(50):
    home = np.random.choice(city_list)
    gold = np.random.uniform(100, 500)
    risk = np.random.uniform(0.2, 0.9)
    merchants.append(Merchant(f"M{i:02d}", home, gold, risk))

# Run simulation for 24 months
transport_costs = {
    ("Chang'an", "Kashgar"): 15, ("Kashgar", "Samarkand"): 10,
    ("Samarkand", "Baghdad"): 12, ("Baghdad", "Constantinople"): 14,
}

print("=== Agent-Based Silk Road Simulation ===")
print(f"50 merchants | 5 cities | 24 months\\n")

for month in range(1, 25):
    # Each merchant acts
    buy_counts = {c: 0 for c in city_list}
    sell_counts = {c: 0 for c in city_list}

    for m in merchants:
        loc = m.location
        city = cities[loc]
        # Find next city in the route
        idx = city_list.index(loc)
        dest_name = city_list[min(idx + 1, len(city_list) - 1)]
        dest = cities[dest_name]
        cost = transport_costs.get((loc, dest_name), 15)

        action = m.decide(city.price, dest.price, cost)

        if action == "BUY" and city.supply > 0:
            units = min(5, int(m.gold / city.price), city.supply)
            if units > 0:
                m.gold -= units * city.price
                m.inventory += units
                city.supply -= units
                buy_counts[loc] += units
                m.trades += 1

        elif action == "SELL" and m.inventory > 0:
            revenue = m.inventory * city.price
            m.gold += revenue
            profit = revenue - m.inventory * cities[m.home].base_price
            m.total_profit += profit
            sell_counts[loc] += m.inventory
            city.supply += m.inventory
            m.trades += 1
            m.inventory = 0

        # Travel: merchants with inventory move east->west
        if m.inventory > 0 and idx < len(city_list) - 1:
            m.location = city_list[idx + 1]
        elif m.inventory == 0:
            # Return home or stay
            if np.random.random() < 0.3:
                m.location = m.home

    # Update prices
    for c in city_list:
        cities[c].update_price(buy_counts[c], sell_counts[c])
        cities[c].supply = max(10, cities[c].supply + np.random.randint(-5, 10))

    if month in [1, 6, 12, 18, 24]:
        prices = " | ".join(f"{c[:4]}:{cities[c].price:>5.0f}" for c in city_list)
        print(f"Month {month:>2}: {prices}")

# Final merchant performance
print("\\n=== Top 10 Merchants by Profit ===")
merchants.sort(key=lambda m: m.total_profit, reverse=True)
print(f"{'Name':>6} {'Home':<16} {'Gold':>7} {'Profit':>8} {'Trades':>7} {'Risk':>5}")
print("-" * 51)
for m in merchants[:10]:
    print(f"{m.name:>6} {m.home:<16} {m.gold:>6.0f} {m.total_profit:>7.0f} "
          f"{m.trades:>6} {m.risk_tolerance:>4.1f}")

# Risk vs return analysis
print("\\n=== Risk Tolerance vs Average Profit ===")
for low, high in [(0.2, 0.4), (0.4, 0.6), (0.6, 0.8), (0.8, 1.0)]:
    group = [m for m in merchants if low <= m.risk_tolerance < high]
    if group:
        avg = np.mean([m.total_profit for m in group])
        print(f"Risk {low:.1f}-{high:.1f}: avg profit {avg:>7.0f} ({len(group)} merchants)")`,
      challenge: 'Add a "reputation" attribute: merchants who complete more trades successfully get better prices (2% discount per 10 completed trades). Does reputation create a "rich get richer" dynamic? This is the Matthew Effect in economics — and it\'s a key driver of inequality in real markets.',
      successHint: 'Agent-based modelling is one of the most powerful tools in modern computational social science. It\'s used to model financial markets, epidemic spread, urban growth, and ecological systems. You just built a model where macro-level patterns (price gradients, trade volumes) emerged from micro-level decisions — the hallmark of complex systems.',
    },
    {
      title: 'Information propagation speed — price signals across the network',
      concept: `On the Silk Road, information about prices travelled at the speed of a camel — about 30 km per day. A price change in Chang'an wouldn't be known in Constantinople for 6-8 months. This **information delay** creates profound economic consequences.

When a drought in China reduces silk production, the price in Chang'an rises immediately. But merchants in Baghdad still buy at the old price, overpaying because they don't know supply has dropped. Months later, when the news arrives, Baghdad's price suddenly jumps — creating a **price shock**.

We model information propagation as a **wave** moving through the network:
**t_arrival(city) = distance / speed_of_information**

The delay creates **temporal arbitrage**: traders who get information first can profit. This is why the Sogdians, positioned in the middle of the network, became so wealthy — they received price signals from both ends before anyone else.

📚 *Information asymmetry — when one party knows something the other doesn't — is the foundation of market microstructure theory. The 2001 Nobel Prize in Economics was awarded for research on information asymmetry.*`,
      analogy: 'Imagine a stock market where some traders get price quotes 6 months late. The traders with current prices buy before the price rises and sell before it falls — making easy profits. The late traders consistently buy high and sell low. This is exactly what happened on the Silk Road: cities in the middle of the network (Samarkand, Kashgar) had an information advantage.',
      storyConnection: 'The Sogdian merchant network maintained relay stations with message riders across Central Asia. These riders could carry price information at 100+ km/day — three times faster than a loaded caravan. This information advantage was the Sogdians\' true "product": they sold timely market intelligence as much as they traded physical goods.',
      checkQuestion: 'A caravan takes 60 days from Samarkand to Baghdad. A price change occurs in Samarkand on day 1. A merchant in Baghdad has a relay rider that takes 20 days. How many days of arbitrage opportunity does the fast merchant have?',
      checkAnswer: '60 - 20 = 40 days. The fast merchant learns about the price change on day 20 and can act immediately (buying or selling based on the new information). Other merchants don\'t learn until day 60 when the next caravan arrives. 40 days of acting on information nobody else has.',
      codeIntro: 'Simulate how price information propagates across the Silk Road network and quantify the value of early information.',
      code: `import numpy as np

np.random.seed(42)

# Network of cities with distances (days of travel)
cities = ["Chang'an", "Dunhuang", "Kashgar", "Samarkand", "Merv",
          "Baghdad", "Palmyra", "Constantinople"]
travel_days = [45, 35, 28, 15, 35, 22, 30]  # between consecutive cities

# Calculate cumulative travel time from Chang'an
cum_days = [0]
for d in travel_days:
    cum_days.append(cum_days[-1] + d)

print("=== Information Travel Times from Chang'an ===")
for i, city in enumerate(cities):
    print(f"  {city:<18} {cum_days[i]:>3} days")

# Simulate a price shock: silk production drops 40% in Chang'an
shock_day = 0
base_price = np.array([20, 35, 50, 65, 75, 90, 100, 120.0])  # baseline prices
shock_magnitude = 0.40  # 40% production drop -> prices rise

print(f"\\n=== Price Shock Propagation ===")
print(f"Event: 40% silk production drop in Chang'an on Day 0\\n")

# Track when each city learns about the shock
# Two information channels: caravan (slow) and relay rider (fast, some cities only)
caravan_speed = 1.0    # multiplier (baseline)
rider_cities = {2, 3, 4}  # Kashgar, Samarkand, Merv have relay riders
rider_speed = 3.0      # 3x faster than caravans

n_days = 250
prices = np.zeros((n_days, len(cities)))
informed = np.zeros(len(cities), dtype=bool)
inform_day = np.full(len(cities), n_days)

for day in range(n_days):
    for i in range(len(cities)):
        # Check if information has arrived via caravan
        caravan_arrival = cum_days[i] / caravan_speed
        rider_arrival = cum_days[i] / rider_speed if i in rider_cities else float('inf')
        arrival = min(caravan_arrival, rider_arrival)

        if day >= arrival and not informed[i]:
            informed[i] = True
            inform_day[i] = day

        # Price responds gradually after information arrives
        if informed[i]:
            days_since = day - inform_day[i]
            adjustment = shock_magnitude * (1 - np.exp(-days_since / 10))
            prices[day][i] = base_price[i] * (1 + adjustment)
        else:
            prices[day][i] = base_price[i] + np.random.normal(0, 1)

print(f"{'City':<18} {'Caravan':>8} {'Rider':>7} {'Informed':>9} {'Price +30d':>11}")
print("-" * 55)
for i, city in enumerate(cities):
    caravan_d = cum_days[i] / caravan_speed
    rider_d = cum_days[i] / rider_speed if i in rider_cities else float('inf')
    actual = inform_day[i]
    day_check = min(actual + 30, n_days - 1)
    p30 = prices[day_check][i] if actual < n_days else base_price[i]
    rider_str = f"{rider_d:.0f}d" if rider_d < float('inf') else "none"
    print(f"{city:<18} {caravan_d:>6.0f}d {rider_str:>7} {actual:>7.0f}d {p30:>9.1f}")

# Value of early information
print("\\n=== Value of Information Advantage ===")
print("A trader who knows about the shock before competitors:")
for i in range(1, len(cities)):
    if i in rider_cities:
        advantage_days = cum_days[i] / caravan_speed - cum_days[i] / rider_speed
        price_before = base_price[i]
        price_after = base_price[i] * (1 + shock_magnitude)
        profit_per_unit = price_after - price_before
        units_traded = int(advantage_days * 2)  # 2 units per day of advantage
        total_value = units_traded * profit_per_unit
        print(f"  {cities[i]:<18} {advantage_days:>3.0f} days early, "
              f"profit potential: {total_value:>6.0f} gold ({units_traded} units)")

# Price correlation vs distance
print("\\n=== Price Correlation Decay with Distance ===")
final_prices = prices[200:]  # last 50 days
for i in range(len(cities)):
    corr_with_changan = np.corrcoef(final_prices[:, 0], final_prices[:, i])[0, 1]
    print(f"  {cities[i]:<18} distance: {cum_days[i]:>3}d  correlation: {corr_with_changan:>.3f}")`,
      challenge: 'Add a third information channel: a pigeon relay that carries one-line price updates at 10x caravan speed but only between cities that have pigeon stations (Chang\'an, Samarkand, Constantinople). How does this change the information landscape? Who benefits most from the pigeon network?',
      successHint: 'Information propagation speed is the core concept behind high-frequency trading, where firms spend billions to shave microseconds off data transmission. The Silk Road\'s information dynamics — delays, asymmetries, and the value of early intelligence — are identical in structure to modern financial markets, just at a different timescale.',
    },
    {
      title: 'Pandemic network modelling — SIR on a trade graph',
      concept: `In Level 2, we modelled disease within a single city using SEIR. Now we model disease spreading **between cities** along the trade network. Each city has its own SIR compartments, and disease transmission between cities occurs when infected travellers move along trade edges.

The **network SIR model** adds a spatial dimension: disease doesn't spread uniformly — it follows the network topology. Cities with more trade connections (higher degree) get infected sooner. Cities on major trade routes (higher betweenness) become disease corridors.

Key addition: **travel rate** along each edge determines how fast disease jumps between cities. High-traffic routes (the main Silk Road) spread disease faster than low-traffic secondary routes.

The equations for each city i:
**dS_i/dt = -beta * S_i * I_i / N_i - sum(travel_rate_ij * I_j / N_j * S_i / N_i)**
**dI_i/dt = beta * S_i * I_i / N_i + sum(travel_rate_ij * I_j / N_j * S_i / N_i) - gamma * I_i**
**dR_i/dt = gamma * I_i**

The second term — transmission from travellers arriving from connected cities — is what makes this a **network epidemic model**.

📚 *Network epidemiology showed that targeted vaccination of high-centrality nodes is far more effective than random vaccination. Vaccinating hub cities first can prevent a pandemic from spreading across the entire network.*`,
      analogy: 'Imagine a fire spreading through a forest where trees are connected by dry brush pathways. A tree catches fire and the flame travels along the brush to neighbouring trees. Trees at junctions where many paths meet (hub trees) catch fire earliest and spread it furthest. Cutting the brush around hub trees (vaccinating hub cities) stops the fire most effectively.',
      storyConnection: 'The Black Death followed the Silk Road with terrifying precision. It reached Caffa (Crimea) via Central Asian trade routes in 1346, then jumped to Constantinople, Sicily, and Marseille by ship — following the maritime trade network. Cities with the most trade connections (Constantinople, Venice, Cairo) were hit hardest and earliest. The network determined the geography of death.',
      checkQuestion: 'If you could quarantine one city to slow a pandemic spreading east to west along the Silk Road, which would you choose: Dunhuang, Samarkand, or Baghdad?',
      checkAnswer: 'Samarkand — it has the highest betweenness centrality on the east-west route. Nearly every path from China to the Mediterranean passes through it. Quarantining Samarkand forces the disease to take longer, less-travelled routes (if they exist), buying time for western cities to prepare.',
      codeIntro: 'Simulate a pandemic spreading across the Silk Road network using city-level SIR with inter-city transmission.',
      code: `import numpy as np

np.random.seed(42)

class CityNode:
    """A city with SIR compartments and trade connections."""
    def __init__(self, name, population):
        self.name = name
        self.pop = population
        self.S = population
        self.I = 0
        self.R = 0
        self.day_infected = -1  # day first case arrived

# Create the network
city_data = [
    ("Chang'an", 500000), ("Dunhuang", 30000), ("Kashgar", 50000),
    ("Samarkand", 100000), ("Bukhara", 80000), ("Merv", 60000),
    ("Baghdad", 400000), ("Palmyra", 40000), ("Antioch", 150000),
    ("Constantinople", 300000), ("Kabul", 35000), ("Peshawar", 25000),
]
nodes = {name: CityNode(name, pop) for name, pop in city_data}

# Trade edges: (city1, city2, daily_travellers)
trade_edges = [
    ("Chang'an", "Dunhuang", 50), ("Dunhuang", "Kashgar", 30),
    ("Kashgar", "Samarkand", 40), ("Kashgar", "Kabul", 15),
    ("Samarkand", "Bukhara", 35), ("Samarkand", "Merv", 25),
    ("Bukhara", "Merv", 20), ("Merv", "Baghdad", 30),
    ("Baghdad", "Palmyra", 25), ("Palmyra", "Antioch", 20),
    ("Antioch", "Constantinople", 35), ("Baghdad", "Antioch", 15),
    ("Kabul", "Peshawar", 10),
]

# SIR parameters
beta = 0.3      # within-city transmission rate
gamma = 1/14    # 14-day infectious period
travel_infection_rate = 0.01  # probability an arriving traveller is infectious

# Seed the outbreak: 10 cases in Samarkand (origin of Black Death)
nodes["Samarkand"].I = 10
nodes["Samarkand"].S -= 10
nodes["Samarkand"].day_infected = 0

# Simulate 365 days
days = 365
history = {name: {"S": [], "I": [], "R": []} for name in nodes}

print("=== Pandemic Spread on the Silk Road Network ===")
print(f"Origin: Samarkand | Beta: {beta} | Recovery: {1/gamma:.0f} days\\n")

for day in range(days):
    # Inter-city transmission
    new_infections = {name: 0 for name in nodes}
    for c1, c2, travellers in trade_edges:
        n1, n2 = nodes[c1], nodes[c2]
        # Travellers from c1 to c2
        if n1.I > 0:
            infected_travellers = travellers * (n1.I / n1.pop)
            new_inf = infected_travellers * travel_infection_rate * n2.S / n2.pop
            new_infections[c2] += new_inf
        # Travellers from c2 to c1
        if n2.I > 0:
            infected_travellers = travellers * (n2.I / n2.pop)
            new_inf = infected_travellers * travel_infection_rate * n1.S / n1.pop
            new_infections[c1] += new_inf

    # Within-city SIR dynamics + imported cases
    for name, node in nodes.items():
        internal = beta * node.S * node.I / node.pop
        imported = new_infections[name]
        new_I = internal + imported
        new_R = gamma * node.I

        node.S = max(0, node.S - new_I)
        node.I = max(0, node.I + new_I - new_R)
        node.R = min(node.pop, node.R + new_R)

        if node.I >= 1 and node.day_infected < 0:
            node.day_infected = day

        history[name]["S"].append(node.S)
        history[name]["I"].append(node.I)
        history[name]["R"].append(node.R)

# Report: arrival times and peak infections
print(f"{'City':<18} {'Pop':>8} {'Day Arrived':>12} {'Peak I':>8} {'Total R':>8} {'% Hit':>6}")
print("-" * 62)
arrival_order = sorted(nodes.values(), key=lambda n: n.day_infected if n.day_infected >= 0 else 9999)
for node in arrival_order:
    peak_I = max(history[node.name]["I"])
    total_R = node.R
    pct = total_R / node.pop * 100
    day_str = f"{node.day_infected}" if node.day_infected >= 0 else "never"
    print(f"{node.name:<18} {node.pop:>7,} {day_str:>11} {peak_I:>7,.0f} {total_R:>7,.0f} {pct:>5.1f}%")

# Quarantine simulation
print("\\n=== Impact of Quarantining Samarkand on Day 30 ===")
nodes2 = {name: CityNode(name, pop) for name, pop in city_data}
nodes2["Samarkand"].I = 10
nodes2["Samarkand"].S -= 10

for day in range(days):
    new_infections = {name: 0 for name in nodes2}
    for c1, c2, travellers in trade_edges:
        # Quarantine: no travel to/from Samarkand after day 30
        if day >= 30 and (c1 == "Samarkand" or c2 == "Samarkand"):
            continue
        n1, n2 = nodes2[c1], nodes2[c2]
        if n1.I > 0:
            new_infections[c2] += travellers * (n1.I/n1.pop) * travel_infection_rate * n2.S/n2.pop
        if n2.I > 0:
            new_infections[c1] += travellers * (n2.I/n2.pop) * travel_infection_rate * n1.S/n1.pop

    for name, node in nodes2.items():
        internal = beta * node.S * node.I / node.pop
        new_I = internal + new_infections[name]
        new_R = gamma * node.I
        node.S = max(0, node.S - new_I)
        node.I = max(0, node.I + new_I - new_R)
        node.R = min(node.pop, node.R + new_R)

total_no_q = sum(n.R for n in nodes.values())
total_q = sum(n.R for n in nodes2.values())
print(f"Total infected without quarantine: {total_no_q:>10,.0f}")
print(f"Total infected with quarantine:    {total_q:>10,.0f}")
print(f"Lives saved by quarantine:         {total_no_q - total_q:>10,.0f}")`,
      challenge: 'Instead of quarantining an entire city, model "traveller screening": reduce the travel_infection_rate by 80% on all edges connected to Samarkand. How does screening compare to full quarantine? This is the debate between lockdowns and testing — the same trade-off faced during COVID-19.',
      successHint: 'Network epidemiology is how modern pandemic response is planned. The models used for COVID-19 are structurally identical to what you just built — SIR dynamics within populations, connected by a travel network. Your model shows why travel restrictions on hub cities are disproportionately effective — they cut the network at its most connected points.',
    },
    {
      title: 'Technology adoption curves — S-curves for paper, compass, and gunpowder',
      concept: `The Silk Road didn't just carry goods — it carried **ideas and technology**. Paper, the magnetic compass, and gunpowder all originated in China and spread westward along trade routes. But technology adoption isn't instant — it follows a characteristic **S-curve** (logistic curve):

**Adoption(t) = K / (1 + e^(-r(t - t_mid)))**

Where K is the maximum adoption level (market saturation), r is the adoption rate, and t_mid is the time of fastest adoption (inflection point).

Why the S-shape? Early adopters take risks on unproven technology (slow start). Once the technology proves useful, adoption accelerates (steep middle). Finally, the remaining holdouts adopt slowly or never (plateau).

Different technologies have different S-curves: **paper** spread relatively quickly (clear advantage over alternatives), **compass** spread slowly (required specialised knowledge), **gunpowder weapons** spread fastest of all (military urgency).

📚 *The Bass diffusion model separates adoption into "innovators" (who adopt independently) and "imitators" (who adopt because others have). The ratio of innovators to imitators determines the shape of the S-curve.*`,
      analogy: 'Think of how smartphones spread. In 2007, a few tech enthusiasts bought iPhones (innovators). By 2010, seeing others use smartphones convinced mainstream users (imitators). By 2015, nearly everyone had one. The S-curve captures this pattern: slow start, rapid acceleration, eventual saturation. Every technology from fire to AI follows this curve.',
      storyConnection: 'Paper was invented in China around 105 CE. It reached Samarkand by 751 CE (the Battle of Talas, where Chinese papermakers were captured). It reached Baghdad by 800 CE, Cairo by 900 CE, and Europe by 1100 CE. Each city\'s adoption followed a local S-curve — once paper arrived, it took decades to replace existing writing materials (parchment, papyrus, bamboo strips).',
      checkQuestion: 'Why did gunpowder weapons spread faster than paper? Both came from China.',
      checkAnswer: 'Military urgency. If your neighbour adopts gunpowder weapons and you don\'t, you lose the next war. The cost of non-adoption is existential. Paper, by contrast, competes with existing alternatives (parchment) that still work adequately. The adoption rate r is driven by the cost of NOT adopting — which is highest for military technology.',
      codeIntro: 'Model and compare technology adoption curves for paper, compass, and gunpowder across Silk Road civilisations.',
      code: `import numpy as np

def logistic_adoption(t, K, r, t_mid):
    """S-curve: logistic adoption model."""
    return K / (1 + np.exp(-r * (t - t_mid)))

def bass_model(t, K, p, q):
    """
    Bass diffusion model.
    p = innovation rate (external influence)
    q = imitation rate (word-of-mouth)
    """
    adoption = np.zeros(len(t))
    cumulative = 0
    for i in range(len(t)):
        remaining = K - cumulative
        new = (p + q * cumulative / K) * remaining
        cumulative += max(0, new)
        adoption[i] = cumulative
    return adoption

# Technologies spreading along the Silk Road
technologies = [
    {"name": "Paper", "origin_year": 105, "K": 100,
     "regions": [
         ("China", 105, 0.015, 100),
         ("Central Asia", 751, 0.020, 90),
         ("Middle East", 800, 0.025, 95),
         ("N. Africa", 900, 0.018, 85),
         ("Europe", 1100, 0.030, 98),
     ]},
    {"name": "Magnetic Compass", "origin_year": 200, "K": 100,
     "regions": [
         ("China", 200, 0.008, 80),
         ("Islamic World", 1100, 0.012, 75),
         ("Europe", 1190, 0.015, 90),
     ]},
    {"name": "Gunpowder Weapons", "origin_year": 850, "K": 100,
     "regions": [
         ("China", 850, 0.020, 100),
         ("Islamic World", 1240, 0.035, 95),
         ("Europe", 1320, 0.040, 100),
     ]},
]

years = np.arange(0, 1500)

print("=== Technology Adoption Along the Silk Road ===\\n")

for tech in technologies:
    print(f"--- {tech['name']} (invented {tech['origin_year']} CE) ---")
    print(f"{'Region':<16} {'Arrived':>8} {'25% adopt':>10} {'50% adopt':>10} {'90% adopt':>10} {'Spread time':>12}")
    print("-" * 68)

    for region, start, rate, max_adopt in tech["regions"]:
        t = np.arange(0, 500)
        adoption = logistic_adoption(t, max_adopt, rate, 100)  # midpoint at ~100 years after arrival

        # Find milestone years
        t25 = start + np.searchsorted(adoption, max_adopt * 0.25)
        t50 = start + np.searchsorted(adoption, max_adopt * 0.50)
        t90 = start + np.searchsorted(adoption, max_adopt * 0.90)
        spread = t90 - start

        print(f"{region:<16} {start:>6} CE {t25:>8} CE {t50:>8} CE {t90:>8} CE {spread:>10} yr")
    print()

# Bass model comparison: innovators vs imitators
print("=== Bass Diffusion: Innovation vs Imitation ===")
t = np.arange(300)
print(f"{'Technology':<22} {'p (innov)':>10} {'q (imit)':>10} {'q/p ratio':>10} {'Peak year':>10}")
print("-" * 64)

bass_techs = [
    ("Paper", 0.005, 0.05),              # mostly imitation
    ("Compass", 0.008, 0.03),            # balanced
    ("Gunpowder weapons", 0.003, 0.08),  # strongly imitation-driven
    ("Printing press", 0.010, 0.06),      # high innovation + imitation
]

for name, p, q in bass_techs:
    adoption = bass_model(t, 1000, p, q)
    # Find peak new adoption rate
    new_per_period = np.diff(adoption)
    peak_year = np.argmax(new_per_period)
    ratio = q / p
    print(f"{name:<22} {p:>9.3f} {q:>9.3f} {ratio:>9.1f} {peak_year:>9}")

print()
print("High q/p ratio -> technology spreads mainly through social influence")
print("Low q/p ratio -> technology spreads through independent discovery")
print("Gunpowder has highest q/p: military necessity forces rapid imitation")`,
      challenge: 'Add the internet/smartphones to the Bass model. Smartphones have p=0.03, q=0.4 (very high imitation rate from social pressure and network effects). Plot how adoption timescale has compressed from centuries (paper) to years (smartphones). What drove this compression?',
      successHint: 'S-curves and the Bass model are used to predict adoption of every new technology: electric vehicles, solar panels, AI assistants. Understanding these curves is essential for technology strategy, venture capital, and innovation policy. The Silk Road was one of history\'s most important technology diffusion networks.',
    },
    {
      title: 'Risk pricing — insurance for caravan trade',
      concept: `Every Silk Road caravan faced risks: bandits, sandstorms, disease, political upheaval, and simple mishaps. Merchants needed a way to manage this risk. The solution: **mutual risk-sharing arrangements** — the precursors to modern insurance.

The mathematics of insurance pricing:

**Premium = Expected Loss + Risk Loading + Administrative Cost**
**Expected Loss = Probability(Loss) * Severity(Loss)**

A fair premium equals the expected loss. But insurers charge MORE than the expected loss — the **risk loading** compensates for uncertainty and provides profit. The risk loading depends on the **variance** of losses: more unpredictable risks require higher loadings.

Key concepts:
- **Diversification**: insuring many independent caravans reduces per-caravan risk (law of large numbers)
- **Moral hazard**: insured merchants may take more risks (they don't bear the full loss)
- **Adverse selection**: high-risk merchants are more likely to buy insurance
- **Correlated risk**: if a war disrupts ALL caravans, diversification fails

📚 *The law of large numbers: as you insure more independent risks, the actual loss converges to the expected loss. This is why insurance companies need many customers — one bad year for one customer averages out across thousands.*`,
      analogy: 'Imagine 100 farmers, each facing a 10% chance of crop failure. If each farmer self-insures (saves enough to cover a total loss), they need enormous reserves. But if all 100 pool their risk, about 10 will fail each year — predictable and manageable. Each pays a small premium (1/10 of a full loss), and the pool covers the unlucky 10. That\'s insurance.',
      storyConnection: 'The Silk Road\'s Sogdian merchant houses operated as informal insurance pools. Merchants from the same family or guild shared risks: if one caravan was lost, the group absorbed the loss. This mutual insurance is documented in Sogdian letters found in watchtowers along the Great Wall — letters from merchants reporting losses and requesting compensation from their network.',
      checkQuestion: 'A caravan worth 10,000 gold has a 15% chance of total loss. What is the fair premium?',
      checkAnswer: 'Expected loss = 0.15 * 10,000 = 1,500 gold. This is the minimum premium — charging less means the insurer loses money on average. A practical premium might be 2,000-2,500 gold (33-67% risk loading) to cover uncertainty and provide profit. The merchant still benefits: paying 2,500 with certainty is better than risking 10,000.',
      codeIntro: 'Build a risk pricing model for Silk Road caravan insurance with diversification and correlated risks.',
      code: `import numpy as np

np.random.seed(42)

class CaravanRisk:
    """Models the risk profile of a Silk Road caravan."""
    def __init__(self, route, value, bandit_prob, weather_prob, disease_prob):
        self.route = route
        self.value = value
        self.bandit_prob = bandit_prob
        self.weather_prob = weather_prob
        self.disease_prob = disease_prob

    def expected_loss(self):
        # Probability of ANY loss event
        p_none = (1-self.bandit_prob) * (1-self.weather_prob) * (1-self.disease_prob)
        p_loss = 1 - p_none
        # Average loss severity (partial or total)
        avg_severity = 0.6  # average 60% of cargo lost per event
        return p_loss * self.value * avg_severity

    def simulate_losses(self, n_years):
        losses = []
        for _ in range(n_years):
            loss = 0
            if np.random.random() < self.bandit_prob:
                loss += self.value * np.random.uniform(0.3, 1.0)
            if np.random.random() < self.weather_prob:
                loss += self.value * np.random.uniform(0.1, 0.5)
            if np.random.random() < self.disease_prob:
                loss += self.value * np.random.uniform(0.2, 0.8)
            losses.append(min(loss, self.value))  # cap at total value
        return np.array(losses)

# Define route risk profiles
routes = [
    CaravanRisk("Chang'an-Kashgar (north)", 10000, 0.08, 0.15, 0.05),
    CaravanRisk("Chang'an-Kashgar (south)", 10000, 0.12, 0.25, 0.08),
    CaravanRisk("Kashgar-Samarkand",        8000,  0.10, 0.10, 0.06),
    CaravanRisk("Samarkand-Baghdad",         12000, 0.15, 0.12, 0.10),
    CaravanRisk("Baghdad-Constantinople",    15000, 0.06, 0.08, 0.04),
]

print("=== Caravan Insurance Pricing ===\\n")
print(f"{'Route':<30} {'Value':>7} {'E[Loss]':>8} {'Fair Prem':>10} {'Loaded':>8}")
print("-" * 65)

for r in routes:
    el = r.expected_loss()
    fair = el
    loaded = el * 1.4  # 40% risk loading
    print(f"{r.route:<30} {r.value:>6,} {el:>7,.0f} {fair:>9,.0f} {loaded:>7,.0f}")

# Diversification effect
print("\\n=== Diversification: Insuring N Independent Caravans ===")
route = routes[3]  # Samarkand-Baghdad (highest risk)
print(f"Route: {route.route} | Value: {route.value:,}\\n")

for n_caravans in [1, 5, 10, 25, 50, 100]:
    per_caravan_losses = []
    for _ in range(1000):  # 1000 simulations
        total_loss = 0
        for _ in range(n_caravans):
            losses = route.simulate_losses(1)
            total_loss += losses[0]
        per_caravan_losses.append(total_loss / n_caravans)

    pcl = np.array(per_caravan_losses)
    mean_loss = np.mean(pcl)
    std_loss = np.std(pcl)
    worst_5 = np.percentile(pcl, 95)
    print(f"N={n_caravans:>3}: mean loss/caravan={mean_loss:>6,.0f}  "
          f"std={std_loss:>5,.0f}  95th pctile={worst_5:>6,.0f}")

print("\\nAs N increases, std shrinks -> losses become predictable -> lower risk loading needed")

# Correlated risk: war disrupts ALL caravans
print("\\n=== Correlated Risk: What If War Breaks Out? ===")
war_probability = 0.05  # 5% per year
war_loss_multiplier = 3.0  # triples all loss probabilities

for scenario in ["Normal", "With War Risk"]:
    total_claims = []
    for _ in range(1000):
        year_claims = 0
        war = np.random.random() < war_probability if scenario == "With War Risk" else False
        for r in routes:
            mult = war_loss_multiplier if war else 1.0
            p = 1 - (1-r.bandit_prob*mult) * (1-r.weather_prob) * (1-r.disease_prob)
            if np.random.random() < min(p, 0.95):
                year_claims += r.value * np.random.uniform(0.3, 0.9)
        total_claims.append(year_claims)

    tc = np.array(total_claims)
    print(f"\\n{scenario}:")
    print(f"  Mean annual claims: {np.mean(tc):>10,.0f}")
    print(f"  Std of claims:      {np.std(tc):>10,.0f}")
    print(f"  Worst 5% year:      {np.percentile(tc, 95):>10,.0f}")
    print(f"  Worst 1% year:      {np.percentile(tc, 99):>10,.0f}")`,
      challenge: 'Add "moral hazard": insured merchants take 20% riskier routes (higher bandit probability) because they don\'t bear the full loss. How does this change the insurer\'s profitability? Insurers combat moral hazard with deductibles (the merchant pays the first 20% of any loss). Model a deductible and show how it changes merchant behaviour.',
      successHint: 'You just built the mathematical foundation of the insurance industry: expected loss calculation, risk loading, diversification benefits, and correlated risk. These same models price everything from car insurance to reinsurance for natural disasters. The Silk Road\'s merchant guilds pioneered mutual insurance 1,500 years before Lloyd\'s of London.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling: agents, networks, epidemics, and diffusion</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers agent-based trade simulation, information propagation, pandemic network modelling, technology adoption S-curves, and risk pricing.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
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
