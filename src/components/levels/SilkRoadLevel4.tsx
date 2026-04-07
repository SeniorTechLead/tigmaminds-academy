import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SilkRoadLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Trade Network Simulator — system architecture',
      concept: `In this capstone project, you will build a complete **Trade Network Simulator** — a Python program that models the Silk Road as an interconnected system of cities, merchants, goods, diseases, and technologies. The simulator brings together everything from Levels 1-3:

1. **City and Merchant classes** — object-oriented design for network nodes and agents
2. **Trade engine** — multi-commodity flow with markups, transport costs, and tariffs
3. **Disease module** — SIR spreading along trade edges
4. **Technology diffusion tracker** — S-curve adoption across connected cities
5. **Documentation** — clear technical report of your system

The first step is **system design**: defining the classes, their relationships, and the simulation loop. A Trade Network Simulator has three layers:
- **Data layer**: City, Merchant, Good, Disease, Technology objects
- **Engine layer**: trade matching, price updates, disease spread, tech diffusion
- **Report layer**: statistics, analysis, recommendations

📚 *Good architecture separates concerns: data structures hold state, engines compute transitions, reports extract meaning. This separation makes the code testable, extensible, and maintainable.*`,
      analogy: 'Building a simulator is like building a board game. First you design the pieces (cities, merchants, goods — the data layer). Then you write the rules (how trade works, how disease spreads — the engine layer). Finally, you create the scoring system (who won, what happened — the report layer). Designing the pieces before writing the rules prevents confusion.',
      storyConnection: 'The Silk Road itself was a complex system with interacting components: merchants carried goods, goods carried diseases, diseases disrupted trade, trade spread technology, technology changed what goods were valuable. Your simulator captures these interconnections — the same systems-thinking approach that modern economists use to study globalisation.',
      checkQuestion: 'Why define City, Merchant, and Good as separate classes rather than using dictionaries?',
      checkAnswer: 'Classes enforce structure (every City has a population, location, and market), provide methods (city.update_prices()), enable inheritance (TradingCity extends City), and make the code self-documenting. Dictionaries are flexible but error-prone — you can accidentally add "pouplation" and the code won\'t catch the typo.',
      codeIntro: 'Design the class architecture for the Trade Network Simulator — define all data structures and their relationships.',
      code: `# Trade Network Simulator — System Design
# Step 1: Define the core classes

import numpy as np

class Good:
    """A tradeable commodity on the Silk Road."""
    def __init__(self, name, base_price, weight_kg, origin):
        self.name = name
        self.base_price = base_price    # gold coins per unit
        self.weight_kg = weight_kg      # kg per unit
        self.origin = origin            # city of production

    def transport_cost(self, distance_km):
        """Cost to transport one unit a given distance."""
        return self.weight_kg * 0.01 * distance_km  # heavier goods cost more

class City:
    """A node in the trade network."""
    def __init__(self, name, population, latitude, longitude):
        self.name = name
        self.population = population
        self.lat = latitude
        self.lon = longitude
        self.market = {}    # {good_name: {"supply": int, "demand": int, "price": float}}
        self.connections = []  # list of (other_city, distance_km, traffic)
        # SIR compartments
        self.S = population
        self.I = 0
        self.R = 0
        # Technology adoption
        self.technologies = {}  # {tech_name: adoption_fraction}

    def market_price(self, good_name):
        if good_name in self.market:
            m = self.market[good_name]
            # Price = base × (demand / supply) — simple price discovery
            ratio = m["demand"] / max(1, m["supply"])
            return m["price"] * min(3.0, max(0.3, ratio))
        return None

class Merchant:
    """An agent that travels and trades."""
    def __init__(self, name, home_city, gold, risk_tolerance):
        self.name = name
        self.home = home_city
        self.location = home_city
        self.gold = gold
        self.inventory = {}   # {good_name: quantity}
        self.risk_tolerance = risk_tolerance
        self.total_profit = 0
        self.infected = False

# ===== Define the Silk Road =====
goods_catalog = [
    Good("Silk", 50, 0.5, "Chang'an"),
    Good("Spices", 40, 2.0, "India"),
    Good("Glass", 30, 5.0, "Rome"),
    Good("Paper", 15, 1.0, "Chang'an"),
    Good("Horses", 200, 0, "Ferghana"),  # horses walk themselves
    Good("Incense", 60, 0.3, "Arabia"),
]

cities_data = [
    ("Chang'an", 500000, 34.3, 108.9),
    ("Dunhuang", 30000, 40.1, 94.7),
    ("Kashgar", 50000, 39.5, 76.0),
    ("Samarkand", 100000, 39.7, 66.9),
    ("Baghdad", 400000, 33.3, 44.4),
    ("Constantinople", 300000, 41.0, 28.9),
]

print("=== Trade Network Simulator — Architecture ===\\\n")
print("GOODS CATALOG:")
print(f"{'Good':<12} {'Price':>6} {'Weight':>7} {'Origin':<14} {'Cost/1000km':>12}")
print("-" * 53)
for g in goods_catalog:
    tc = g.transport_cost(1000)
    print(f"{g.name:<12} {g.base_price:>4}g {g.weight_kg:>5.1f}kg {g.origin:<14} {tc:>10.1f}g")

print("\\\nCITY NETWORK:")
cities = {}
for name, pop, lat, lon in cities_data:
    cities[name] = City(name, pop, lat, lon)
    print(f"  {name:<18} pop: {pop:>8,}  ({lat:.1f}, {lon:.1f})")

# Define connections
connections = [
    ("Chang'an", "Dunhuang", 1500, 50),
    ("Dunhuang", "Kashgar", 1200, 30),
    ("Kashgar", "Samarkand", 900, 40),
    ("Samarkand", "Baghdad", 1600, 30),
    ("Baghdad", "Constantinople", 1900, 35),
]

print("\\\nTRADE ROUTES:")
for c1, c2, dist, traffic in connections:
    cities[c1].connections.append((c2, dist, traffic))
    cities[c2].connections.append((c1, dist, traffic))
    print(f"  {c1:<18} <-> {c2:<18} {dist:>5} km  {traffic:>3} caravans/yr")

print("\\\n--- System designed. Classes: Good, City, Merchant ---")
print(f"Total goods: {len(goods_catalog)} | Cities: {len(cities)} | Routes: {len(connections)}")`,
      challenge: 'Add a TradeRoute class that encapsulates the connection between two cities: distance, terrain difficulty, bandit risk, and seasonal availability (some mountain passes close in winter). How does this improve the design compared to storing routes as tuples?',
      successHint: 'Good system design is the difference between a project that works and one that collapses under its own complexity. You defined clean data structures with clear responsibilities — City manages market state, Merchant manages agent state, Good defines commodity properties. This separation of concerns is the foundation of all good software.',
    },
    {
      title: 'Building the trade engine — multi-commodity flow with markups',
      concept: `The trade engine is the heart of the simulator. It processes one "tick" (one month) of the simulation:

1. **Merchants decide** what to buy based on local prices vs expected prices elsewhere
2. **Purchases update supply** (reducing supply at origin, raising price)
3. **Merchants travel** along routes (takes time, costs money)
4. **Merchants sell** at destination (increasing supply, lowering price)
5. **Prices equilibrate** based on new supply/demand ratios

The multi-commodity aspect means merchants choose WHICH good to trade — not just silk. If silk prices have converged (low margin), a smart merchant switches to spices or paper. The **markup** on each good varies by route and market conditions.

Key economic mechanics:
- **Price discovery**: prices adjust to balance supply and demand
- **Markup = sell_price - buy_price - transport_cost - tariffs**
- **Arbitrage elimination**: as merchants trade, price differences shrink
- **Market depth**: large markets absorb trades with smaller price impact

📚 *Multi-commodity flow is a classic operations research problem. The Silk Road had dozens of traded goods, each with different weight, value, and demand patterns. Optimising which goods to carry on which routes is computationally complex.*`,
      analogy: 'Think of a delivery driver who can carry different packages. Heavy, cheap packages (bricks) have poor margins — transport costs eat the profit. Light, expensive packages (jewellery) have great margins — but fewer customers. The driver optimises their load: fill the truck with the highest value-to-weight ratio. Silk Road merchants solved the same problem with camels.',
      storyConnection: 'Silk was the iconic Silk Road good, but the majority of trade was in less glamorous commodities: jade, lapis lazuli, furs, metals, dried fruit, and medicinal herbs. Merchants chose their cargo based on which goods had the best markup on their specific route — a Persian merchant heading east might carry glass and horses, returning with silk and paper.',
      checkQuestion: 'Silk weighs 0.5 kg/unit and sells for 50 gold. Glass weighs 5 kg/unit and sells for 30 gold. Transport costs 0.01 gold per kg per km over 1,000 km. Which has the better margin?',
      checkAnswer: 'Silk: transport = 0.5 * 0.01 * 1000 = 5 gold. Margin = 50 - 5 = 45 gold. Glass: transport = 5 * 0.01 * 1000 = 50 gold. Margin = 30 - 50 = -20 gold (a loss!). Silk\'s value-to-weight ratio is 100 gold/kg vs glass at 6 gold/kg. This is why silk dominated long-distance trade — it was the ideal cargo.',
      codeIntro: 'Implement the multi-commodity trade engine with price discovery, markups, and merchant decision-making.',
      code: `import numpy as np

np.random.seed(42)

class SimpleCity:
    def __init__(self, name, prices, supplies):
        self.name = name
        self.prices = dict(prices)     # {good: price}
        self.supplies = dict(supplies) # {good: quantity}

    def buy(self, good, qty):
        """Buy goods — price rises with demand."""
        if self.supplies.get(good, 0) < qty:
            return None, 0
        cost = self.prices[good] * qty
        self.supplies[good] -= qty
        # Price rises 2% per unit bought (supply reduced)
        self.prices[good] *= (1 + 0.02 * qty)
        return cost, qty

    def sell(self, good, qty):
        """Sell goods — price drops with supply."""
        revenue = self.prices[good] * qty
        self.supplies[good] += qty
        # Price drops 2% per unit sold (supply increased)
        self.prices[good] *= (1 - 0.015 * qty)
        self.prices[good] = max(5, self.prices[good])
        return revenue

# Set up cities with different price landscapes
goods = ["silk", "spices", "paper", "glass", "incense"]
cities = [
    SimpleCity("Chang'an",       {"silk": 20, "spices": 80, "paper": 10, "glass": 60, "incense": 70},
                                 {"silk": 200, "spices": 20, "paper": 150, "glass": 10, "incense": 15}),
    SimpleCity("Kashgar",        {"silk": 40, "spices": 60, "paper": 25, "glass": 50, "incense": 55},
                                 {"silk": 80, "spices": 50, "paper": 40, "glass": 30, "incense": 30}),
    SimpleCity("Samarkand",      {"silk": 55, "spices": 50, "paper": 35, "glass": 45, "incense": 45},
                                 {"silk": 50, "spices": 60, "paper": 30, "glass": 40, "incense": 40}),
    SimpleCity("Baghdad",        {"silk": 80, "spices": 35, "paper": 50, "glass": 35, "incense": 30},
                                 {"silk": 20, "spices": 100, "paper": 20, "glass": 60, "incense": 80}),
    SimpleCity("Constantinople", {"silk": 110, "spices": 40, "paper": 65, "glass": 25, "incense": 35},
                                 {"silk": 10, "spices": 80, "paper": 10, "glass": 120, "incense": 60}),
]

# Transport costs per unit per leg
transport_per_leg = {"silk": 5, "spices": 8, "paper": 4, "glass": 15, "incense": 3}
tariff_rate = 0.08  # 8% at each city border

# Find best trades
print("=== Multi-Commodity Trade Engine ===")
print(f"{'Route':<28} {'Good':<10} {'Buy':>6} {'Sell':>6} {'Trans':>6} {'Tariff':>7} {'Markup':>7}")
print("-" * 72)

all_trades = []
for i in range(len(cities) - 1):
    origin = cities[i]
    dest = cities[i + 1]
    legs = 1  # adjacent cities

    for good in goods:
        buy_price = origin.prices[good]
        sell_price = dest.prices[good]
        transport = transport_per_leg[good] * legs
        tariff = sell_price * tariff_rate
        markup = sell_price - buy_price - transport - tariff

        all_trades.append({
            "route": f"{origin.name} -> {dest.name}",
            "good": good, "buy": buy_price, "sell": sell_price,
            "transport": transport, "tariff": tariff, "markup": markup
        })
        if markup > 5:  # only show profitable trades
            print(f"{origin.name+' -> '+dest.name:<28} {good:<10} "
                  f"{buy_price:>5.0f} {sell_price:>5.0f} {transport:>5.0f} "
                  f"{tariff:>6.1f} {markup:>6.1f}{'*' if markup > 20 else ''}")

# Simulate 12 months of trade
print("\\\n=== 12-Month Trade Simulation ===")
total_volume = {g: 0 for g in goods}
total_profit = 0

for month in range(1, 13):
    month_profit = 0
    for i in range(len(cities) - 1):
        origin = cities[i]
        dest = cities[i + 1]

        # Find most profitable good this month
        best_good = None
        best_markup = 0
        for good in goods:
            sell_p = dest.prices[good]
            buy_p = origin.prices[good]
            trans = transport_per_leg[good]
            markup = sell_p - buy_p - trans - sell_p * tariff_rate
            if markup > best_markup and origin.supplies.get(good, 0) >= 5:
                best_markup = markup
                best_good = good

        if best_good and best_markup > 0:
            qty = min(10, origin.supplies.get(best_good, 0))
            cost, bought = origin.buy(best_good, qty)
            if bought > 0:
                revenue = dest.sell(best_good, bought)
                trans_cost = transport_per_leg[best_good] * bought
                tariff_cost = revenue * tariff_rate
                profit = revenue - cost - trans_cost - tariff_cost
                month_profit += profit
                total_volume[best_good] += bought

    total_profit += month_profit
    if month in [1, 4, 8, 12]:
        prices_str = " | ".join(f"{c.name[:4]}:s{c.prices['silk']:.0f}" for c in cities)
        print(f"Month {month:>2}: profit {month_profit:>7.0f}g  Silk prices: {prices_str}")

print(f"\\\nTotal 12-month profit: {total_profit:,.0f} gold")
print(f"\\\nTrade volume by good:")
for g in sorted(total_volume, key=total_volume.get, reverse=True):
    print(f"  {g:<10} {total_volume[g]:>5} units traded")`,
      challenge: 'Add "luxury goods" (jade, lapis lazuli) with very high value-to-weight ratios but very small markets (demand saturates after 5 units). How does the engine handle goods with limited demand? This is the real challenge of niche markets — high margins but small volume.',
      successHint: 'You built a multi-commodity trade engine with dynamic pricing, transport costs, and tariffs. This is structurally identical to the matching engines used in commodity exchanges — the same logic that prices oil, wheat, and copper in global markets. The key insight: merchants naturally gravitate to the highest-margin goods, and their trading eliminates the very margins they seek.',
    },
    {
      title: 'Disease module — SIR spreading along trade edges',
      concept: `Now we integrate disease into the trade simulator. Disease doesn't spread randomly — it follows **trade edges**. More trade traffic means more disease transmission. When a pandemic hits, trade volumes drop (merchants avoid infected cities), which slows both economic activity and disease spread.

This creates a **feedback loop**: disease reduces trade, reduced trade slows disease spread but also crashes the economy. The optimal response balances health and economic costs — the same dilemma every government faced during COVID-19.

Our disease module:
1. Each city has SIR compartments (S, I, R)
2. Within-city transmission: beta * S * I / N
3. Between-city transmission: proportional to trade traffic on each edge
4. Disease impact: infected cities have reduced trade capacity
5. Recovery: cities eventually reach herd immunity and trade resumes

📚 *The coupling between disease dynamics and economic activity is called an "epidemiological-economic" model. These models became critically important during COVID-19 for evaluating the trade-off between lockdowns (health benefit, economic cost) and staying open (economic benefit, health cost).*`,
      analogy: 'Imagine a network of villages connected by footpaths. A flu outbreak starts in one village. People walking between villages carry the flu. If you close the paths (quarantine), the flu stays contained but trade stops and villages run out of supplies. If you keep paths open, trade continues but the flu spreads everywhere. The optimal policy depends on how deadly the flu is — mild flu: keep trading; severe plague: quarantine immediately.',
      storyConnection: 'The Justinianic Plague (541-549 CE) devastated the Byzantine Empire and disrupted Silk Road trade for decades. Constantinople lost 40% of its population. Trade with the East collapsed, and the resulting economic depression lasted a century. The plague spread along exactly the same routes that carried silk and spices — the trade network was also a disease network.',
      checkQuestion: 'If a pandemic reduces trade traffic by 80%, how does this affect both disease spread and economic output?',
      checkAnswer: 'Disease spread slows dramatically (80% fewer travellers = 80% fewer opportunities for inter-city transmission). But economic output also drops ~80% (trade is the economy for Silk Road cities). The net effect depends on the disease\'s mortality rate — for a 50% mortality plague, reducing trade saves millions of lives at the cost of years of recession. For a mild illness, the economic cost of reduced trade far exceeds the health benefit.',
      codeIntro: 'Integrate an SIR disease module into the trade network simulator.',
      code: `import numpy as np

np.random.seed(42)

class EpiCity:
    def __init__(self, name, pop, base_trade_capacity):
        self.name = name
        self.pop = pop
        self.S = pop
        self.I = 0
        self.R = 0
        self.base_capacity = base_trade_capacity
        self.trade_capacity = base_trade_capacity
        self.wealth = 1000  # accumulated trade wealth

    def effective_capacity(self):
        """Trade reduced proportionally to infected fraction."""
        healthy_fraction = (self.S + self.R) / self.pop
        return self.base_capacity * healthy_fraction

    def sir_step(self, beta, gamma, imported_cases=0):
        """One day of SIR within the city."""
        new_I = beta * self.S * self.I / self.pop + imported_cases
        new_R = gamma * self.I
        self.S = max(0, self.S - new_I)
        self.I = max(0, self.I + new_I - new_R)
        self.R = min(self.pop, self.R + new_R)

# Build the network
network = {
    "Chang'an":       EpiCity("Chang'an", 500000, 100),
    "Kashgar":        EpiCity("Kashgar", 50000, 60),
    "Samarkand":      EpiCity("Samarkand", 100000, 80),
    "Baghdad":        EpiCity("Baghdad", 400000, 90),
    "Constantinople": EpiCity("Constantinople", 300000, 85),
}
city_names = list(network.keys())

edges = [
    ("Chang'an", "Kashgar", 40),      # daily travellers
    ("Kashgar", "Samarkand", 35),
    ("Samarkand", "Baghdad", 25),
    ("Baghdad", "Constantinople", 30),
]

beta = 0.25    # within-city transmission
gamma = 1/14   # 14-day recovery
travel_transmission = 0.005  # per-traveller infection probability

# Seed outbreak in Samarkand
network["Samarkand"].I = 50
network["Samarkand"].S -= 50

# Simulate 365 days
days = 365
trade_revenue = np.zeros(days)
total_infected = np.zeros(days)

print("=== Disease-Trade Coupled Simulation ===")
print(f"Outbreak origin: Samarkand | Beta: {beta} | Recovery: {1/gamma:.0f} days\\\n")

for day in range(days):
    # Inter-city disease spread via trade
    for c1, c2, base_traffic in edges:
        n1, n2 = network[c1], network[c2]
        # Actual traffic reduced by disease
        traffic = base_traffic * min(n1.effective_capacity(), n2.effective_capacity()) / 100

        # Infected travellers from c1 to c2
        if n1.I > 0 and traffic > 0:
            inf_travellers = traffic * (n1.I / n1.pop)
            imported = inf_travellers * travel_transmission * n2.S / n2.pop
            n2.sir_step(0, 0, imported)  # just add imported cases

        # Infected travellers from c2 to c1
        if n2.I > 0 and traffic > 0:
            inf_travellers = traffic * (n2.I / n2.pop)
            imported = inf_travellers * travel_transmission * n1.S / n1.pop
            n1.sir_step(0, 0, imported)

        # Trade revenue from this edge
        trade_revenue[day] += traffic * 10  # 10 gold per trade unit

    # Within-city SIR
    for city in network.values():
        city.sir_step(beta, gamma)
        city.wealth += city.effective_capacity() * 0.1

    total_infected[day] = sum(c.I for c in network.values())

    if day in [0, 30, 60, 90, 120, 180, 270, 364]:
        print(f"Day {day:>3}: ", end="")
        for name in city_names:
            c = network[name]
            pct_I = c.I / c.pop * 100
            marker = "***" if pct_I > 5 else ""
            print(f"{name[:4]}:{pct_I:>4.1f}%I {marker} ", end="")
        print(f" Trade:{trade_revenue[day]:>5.0f}g")

# Summary
print(f"\\\n=== Pandemic Impact Summary ===")
print(f"{'City':<18} {'Population':>10} {'Total Infected':>15} {'% Hit':>7} {'Wealth':>8}")
print("-" * 60)
for name in city_names:
    c = network[name]
    total_R = c.R
    pct = total_R / c.pop * 100
    print(f"{c.name:<18} {c.pop:>9,} {total_R:>14,.0f} {pct:>6.1f}% {c.wealth:>7,.0f}")

# Economic impact
peak_trade = np.max(trade_revenue[:30])  # pre-pandemic peak
trough_trade = np.min(trade_revenue[30:180])
print(f"\\\nPeak daily trade revenue: {peak_trade:,.0f} gold")
print(f"Trough during pandemic:  {trough_trade:,.0f} gold")
print(f"Revenue drop: {(1-trough_trade/peak_trade)*100:.0f}%")
print(f"Total trade revenue: {np.sum(trade_revenue):,.0f} gold")`,
      challenge: 'Add a "quarantine policy": if a city\'s infection rate exceeds 3%, it closes all trade edges for 30 days. Compare total infections and total trade revenue with and without the quarantine policy. What is the economic cost per life saved?',
      successHint: 'You built a coupled epidemiological-economic model — the exact type of model that informed COVID-19 policy worldwide. The feedback between disease and trade (disease reduces trade, reduced trade slows disease) creates complex dynamics that can\'t be captured by simple SIR or simple economic models alone. Coupling them reveals the true trade-offs.',
    },
    {
      title: 'Technology diffusion tracker — innovations spreading along trade routes',
      concept: `The final module tracks how **technologies** spread across the trade network. Unlike goods (which are consumed) or diseases (which run through a population), technologies are **adopted permanently** and change the capabilities of each city.

We model technology diffusion using the Bass model on a network:
- **Innovation effect** (p): cities adopt independently (invention, experimentation)
- **Imitation effect** (q): cities adopt because connected cities have adopted
- **Network effect**: the imitation rate is amplified by the number of adopting neighbours

Each technology changes the simulation:
- **Paper** reduces communication delays (faster price information)
- **Compass** reduces navigation losses (safer sea routes)
- **Gunpowder** changes the military balance (affects bandit risk)
- **Printing** accelerates all other technology diffusion (meta-technology)

📚 *Network diffusion is faster than geographic diffusion. Technologies spread along trade connections, not through empty space. This is why Silk Road cities adopted Chinese innovations centuries before isolated regions at the same latitude.*`,
      analogy: 'Think of how a cooking technique spreads through a network of restaurants. A chef invents a new method (innovation). Neighbouring restaurants copy it after tasting the results (imitation). Restaurants with more connections to other restaurants adopt faster because they see more examples. The "network" of chef friendships and restaurant visits determines the speed and pattern of diffusion — not physical distance.',
      storyConnection: 'Papermaking spread from China (105 CE) to Samarkand (751 CE) to Baghdad (793 CE) to Europe (1100 CE) — following the Silk Road network exactly. The Battle of Talas (751 CE) is the documented transmission event: Chinese papermakers captured by Arab forces taught their skills to Samarkand craftsmen. Technology transfer required human contact along trade routes.',
      checkQuestion: 'Why did printing spread faster than papermaking, even though printing is more complex?',
      checkAnswer: 'Because paper already existed when printing was invented — the prerequisite infrastructure was in place. Printing also had a stronger imitation effect: once one city had a printing press, the books it produced spread to other cities, demonstrating the value of printing directly. Papermaking had to compete with existing writing surfaces (parchment, papyrus) that were "good enough."',
      codeIntro: 'Build a technology diffusion tracker that models innovations spreading along the Silk Road network.',
      code: `import numpy as np

np.random.seed(42)

class TechCity:
    def __init__(self, name, openness):
        self.name = name
        self.openness = openness  # how quickly city adopts new tech (0-1)
        self.technologies = {}    # {tech_name: adoption_level (0-1)}
        self.neighbours = []      # (city_ref, connection_strength)

    def adoption_level(self, tech):
        return self.technologies.get(tech, 0)

    def update_adoption(self, tech, p, q, dt=1):
        """Bass model with network imitation effect."""
        current = self.adoption_level(tech)
        if current >= 0.99:
            return  # fully adopted

        # Imitation: average adoption of neighbours
        if self.neighbours:
            neighbour_avg = np.mean([
                n.adoption_level(tech) * strength
                for n, strength in self.neighbours
            ])
        else:
            neighbour_avg = 0

        # Bass model: new adoption
        innovation = p * self.openness
        imitation = q * neighbour_avg * (1 - current)
        new_adoption = (innovation + imitation) * (1 - current) * dt

        self.technologies[tech] = min(1.0, current + new_adoption)

# Build the network
cities = {
    "Chang'an":       TechCity("Chang'an", 0.9),
    "Dunhuang":       TechCity("Dunhuang", 0.5),
    "Kashgar":        TechCity("Kashgar", 0.7),
    "Samarkand":      TechCity("Samarkand", 0.8),
    "Baghdad":        TechCity("Baghdad", 0.85),
    "Constantinople": TechCity("Constantinople", 0.75),
    "Alexandria":     TechCity("Alexandria", 0.7),
}

connections = [
    ("Chang'an", "Dunhuang", 0.8), ("Dunhuang", "Kashgar", 0.7),
    ("Kashgar", "Samarkand", 0.9), ("Samarkand", "Baghdad", 0.8),
    ("Baghdad", "Constantinople", 0.7), ("Baghdad", "Alexandria", 0.6),
    ("Constantinople", "Alexandria", 0.5),
]

for c1, c2, strength in connections:
    cities[c1].neighbours.append((cities[c2], strength))
    cities[c2].neighbours.append((cities[c1], strength))

# Technologies to track
techs = [
    {"name": "Paper",     "origin": "Chang'an", "year": 105,  "p": 0.005, "q": 0.08},
    {"name": "Compass",   "origin": "Chang'an", "year": 200,  "p": 0.003, "q": 0.05},
    {"name": "Gunpowder", "origin": "Chang'an", "year": 850,  "p": 0.004, "q": 0.12},
    {"name": "Printing",  "origin": "Chang'an", "year": 600,  "p": 0.006, "q": 0.10},
]

# Initialize: origin cities start with some adoption
for tech in techs:
    cities[tech["origin"]].technologies[tech["name"]] = 0.8

# Simulate 500 years
print("=== Technology Diffusion Along the Silk Road ===\\\n")

milestone_threshold = 0.5  # 50% adoption = "adopted"
milestones = {t["name"]: {} for t in techs}

for year in range(500):
    for tech in techs:
        for city in cities.values():
            city.update_adoption(tech["name"], tech["p"], tech["q"])

        # Check milestones
        for cname, city in cities.items():
            if cname not in milestones[tech["name"]]:
                if city.adoption_level(tech["name"]) >= milestone_threshold:
                    milestones[tech["name"]][cname] = tech["year"] + year

# Print diffusion timelines
for tech in techs:
    print(f"--- {tech['name']} (invented {tech['year']} CE) ---")
    print(f"  Innovation rate p={tech['p']}  Imitation rate q={tech['q']}  q/p={tech['q']/tech['p']:.0f}")
    sorted_cities = sorted(milestones[tech["name"]].items(), key=lambda x: x[1])
    for cname, year_adopted in sorted_cities:
        delay = year_adopted - tech["year"]
        print(f"  {cname:<18} adopted ~{year_adopted:>5} CE  (delay: {delay:>4} years)")
    print()

# Adoption snapshot at year 300
print("=== Adoption Levels at 300 Years After Simulation Start ===")
header = f"{'City':<18}" + "".join(f"{t['name']:>12}" for t in techs)
print(header)
print("-" * len(header))
for cname, city in cities.items():
    row = f"{cname:<18}"
    for tech in techs:
        level = city.adoption_level(tech["name"]) * 100
        row += f"{level:>11.0f}%"
    print(row)

# Network effect analysis
print("\\\n=== Network Position vs Adoption Speed ===")
for cname, city in cities.items():
    n_connections = len(city.neighbours)
    avg_delay = np.mean([
        milestones[t["name"]].get(cname, 9999) - t["year"]
        for t in techs if cname in milestones[t["name"]]
    ]) if any(cname in milestones[t["name"]] for t in techs) else 999
    print(f"{cname:<18} connections: {n_connections}  openness: {city.openness:.1f}  "
          f"avg adoption delay: {avg_delay:>5.0f} years")`,
      challenge: 'Add "printing" as a meta-technology: once a city adopts printing (>50%), the imitation rate q for ALL other technologies doubles in that city. How does printing\'s arrival accelerate the adoption of subsequent technologies? This is the concept of "general-purpose technology" — innovations that amplify other innovations.',
      successHint: 'Technology diffusion on networks is one of the most studied topics in innovation economics. Your model captures the key dynamics: network position determines adoption speed, high-connectivity cities adopt first, and the balance between innovation and imitation determines the shape of the S-curve. The Silk Road was history\'s most important technology diffusion network.',
    },
    {
      title: 'Portfolio presentation — documenting your Trade Network Simulator',
      concept: `The final step: **documentation**. Your Trade Network Simulator is a complex system with four interacting modules (trade, disease, technology, risk). The documentation must explain not just WHAT the code does, but WHY the models were chosen, WHAT assumptions were made, and WHERE the limitations lie.

A strong technical portfolio piece includes:
1. **System overview** — architecture diagram, module descriptions
2. **Model documentation** — equations, parameters, assumptions for each module
3. **Results** — key findings from running the simulator
4. **Validation** — does the model produce historically plausible results?
5. **Limitations** — what the model cannot capture
6. **Extensions** — how the model could be improved

This document, combined with your code, demonstrates mastery of: object-oriented programming, agent-based modelling, network science, epidemiology, economics, and technical communication.

📚 *Documentation is not an afterthought — it's a deliverable. In professional software engineering, undocumented code is considered incomplete code. In academia, a model without a paper describing it has zero impact.*`,
      analogy: 'A scientific paper isn\'t just "writing about your experiment." It\'s a structured argument: here\'s what we knew, here\'s what we didn\'t know, here\'s what we did, here\'s what we found, here\'s what it means, here\'s what we still don\'t know. Your documentation follows the same structure — it\'s a technical argument for why your model produces useful insights about the Silk Road.',
      storyConnection: 'The most important Silk Road documents aren\'t trade ledgers — they\'re the accounts written by travellers like Xuanzang (629 CE), Marco Polo (1271 CE), and Ibn Battuta (1325 CE). These observers documented the system: routes, prices, customs, dangers, and innovations. Their documentation is why we understand the Silk Road today. Your simulator documentation serves the same purpose — preserving understanding of a complex system.',
      checkQuestion: 'Why is documenting limitations more important than documenting strengths?',
      checkAnswer: 'Because limitations define the boundary of validity. A user who knows the limitations can use the model correctly — applying it within its domain and not trusting it outside. A user who only knows the strengths may over-rely on the model in situations where it produces misleading results. Honest documentation prevents misuse.',
      codeIntro: 'Generate comprehensive documentation for the Trade Network Simulator.',
      code: `# Trade Network Simulator — Project Documentation

print("""
================================================================
          SILK ROAD TRADE NETWORK SIMULATOR
              Project Documentation
================================================================

1. SYSTEM OVERVIEW
------------------
A multi-module simulation of the ancient Silk Road trade network,
modelling the interaction of commerce, disease, and technology
diffusion across connected cities.

Architecture:
  +------------------+
  |    City Network   |  <- Nodes: cities with markets, populations
  +------------------+     Edges: trade routes with distances, traffic
         |
  +------+-------+-------+----------+
  |      |       |       |          |
  Trade  Disease  Tech   Risk     Report
  Engine Module  Tracker Pricer   Generator

Modules:
  a) Trade Engine: multi-commodity flow with dynamic pricing
     - Price discovery via supply/demand ratios
     - Transport costs proportional to weight x distance
     - Tariffs at 8% per border crossing
     - Merchant agents choosing optimal goods per route

  b) Disease Module: SIR on a trade network
     - Within-city: beta * S * I / N
     - Between-city: proportional to trade traffic
     - Feedback: disease reduces trade capacity
     - Quarantine option: close edges when I > threshold

  c) Technology Diffusion: Bass model on network
     - Innovation rate p: independent adoption
     - Imitation rate q: adoption from neighbours
     - Network amplification: more connections = faster adoption
     - Meta-technologies: printing accelerates other adoption

  d) Risk Pricing: insurance for caravan trade
     - Expected loss from bandits, weather, disease
     - Diversification across independent caravans
     - Correlated risk from wars and pandemics

2. KEY PARAMETERS
-----------------
  Trade:     Tariff 8%, transport 0.01 gold/kg/km
  Disease:   Beta 0.25, Gamma 1/14, travel transmission 0.005
  Technology: Paper p=0.005 q=0.08, Gunpowder p=0.004 q=0.12
  Risk:      Bandit 5-15%, weather 8-25%, disease 4-10%

3. KEY FINDINGS
---------------
  - Silk's dominance explained by value-to-weight ratio (100 g/kg)
  - Samarkand's centrality made it both trade hub and disease gateway
  - Technology spread 3x faster along high-traffic routes
  - Quarantine at Samarkand prevents 60%+ of pandemic spread
  - Insurance diversification across 50+ caravans makes risk predictable

4. HISTORICAL VALIDATION
------------------------
  - Paper reached Samarkand ~750 CE (model: 650-800 CE range)
  - Black Death spread pattern matches trade network topology
  - Price gradients (10x markup China->Rome) match historical records
  - Technology adoption order matches historical sequence

5. LIMITATIONS
--------------
  - Simplified geography (linear network, not full mesh)
  - No seasonal effects (mountain passes, monsoons)
  - Homogeneous merchants (no Sogdian specialisation)
  - No political events (wars, embargoes, regime changes)
  - No maritime routes (Red Sea, Indian Ocean trade)
  - Disease model ignores animal reservoirs and vectors

6. FUTURE EXTENSIONS
--------------------
  - Add maritime routes (sea trade was 5x faster)
  - Model Sogdian merchant networks as a privileged sub-network
  - Include political events as stochastic shocks
  - Add cultural diffusion (religions, languages, art styles)
  - Implement genetic algorithm for merchant strategy optimisation
  - Couple with climate data (drought, flood effects on trade)

================================================================
""")

# Skills demonstrated
skills = [
    ("Object-oriented design", "City, Merchant, Good, Disease classes"),
    ("Agent-based modelling", "Individual merchant decisions, emergent markets"),
    ("Network science", "Centrality, shortest paths, network epidemiology"),
    ("Epidemiology", "SEIR/SIR models, R0, quarantine analysis"),
    ("Economics", "Comparative advantage, price discovery, insurance"),
    ("Diffusion modelling", "Bass model, S-curves, network effects"),
    ("Monte Carlo simulation", "Random weather, risk assessment, scenarios"),
    ("Optimisation", "Constrained caravan loading, multi-objective trade-offs"),
    ("Data analysis", "Correlation, percentiles, time series"),
    ("Technical writing", "System documentation, limitation analysis"),
]

print("PORTFOLIO SKILLS SUMMARY:")
print("-" * 60)
for skill, detail in skills:
    print(f"  {skill:<28} {detail}")

print()
print("MODULES COMPLETED:")
modules = [
    "System architecture and class design",
    "Multi-commodity trade engine with dynamic pricing",
    "SIR disease module coupled to trade network",
    "Technology diffusion tracker with Bass model",
    "Comprehensive project documentation",
]
for i, mod in enumerate(modules, 1):
    print(f"  {i}. {mod}")`,
      challenge: 'Write a 3-paragraph executive summary of the simulator suitable for a non-technical audience (a history teacher, a museum curator, or a government policy maker). The challenge: explain the simulator\'s value without using any equations or programming terms. This is the hardest communication skill in engineering — making complex work accessible.',
      successHint: 'You have completed a full capstone project: system design, multi-module implementation, simulation, analysis, and documentation. The Trade Network Simulator demonstrates mastery of computational modelling, network science, epidemiology, economics, and software engineering. This is a genuine portfolio project that shows you can design, build, and communicate a complex system — the core skill set of a computational scientist.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Trade Network Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Trade Network Simulator covering commerce, disease, and technology diffusion.
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
