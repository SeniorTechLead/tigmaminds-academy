import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SilkRoadLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Comparative advantage — why nations trade instead of making everything themselves',
      concept: `**Comparative advantage** (David Ricardo, 1817) explains why trade makes everyone better off, even if one country is better at producing *everything*.

The key insight: what matters is not absolute ability, but **opportunity cost** — what you give up to produce something. If China can make silk cheaply but porcelain even more cheaply, China has a comparative advantage in porcelain. If Persia can make both at higher cost but carpets at a relatively lower cost, Persia has a comparative advantage in carpets.

When each country specialises in the good where its opportunity cost is lowest and trades for the rest, **total output increases**. Both countries end up with more goods than if each tried to be self-sufficient.

The formula: Country A has a comparative advantage in Good X if:
**(Cost of X in A) / (Cost of Y in A) < (Cost of X in B) / (Cost of Y in B)**

This ratio comparison is what separates comparative from absolute advantage. A country can be worse at making everything and still gain from trade.

📚 *Opportunity cost is the value of the best alternative you forgo. If a silk weaver spends a day making pottery instead, the opportunity cost is the silk they didn't weave.*`,
      analogy: 'Imagine a surgeon who also happens to be the fastest typist in the hospital. Should the surgeon type their own reports? No — even though they type faster than any secretary, their time is worth far more in surgery. The surgeon has an absolute advantage in both tasks, but a comparative advantage in surgery. The secretary has a comparative advantage in typing.',
      storyConnection: 'The Silk Road existed because of comparative advantage. China produced silk at an opportunity cost no one could match — its climate, mulberry trees, and centuries of sericulture knowledge made silk "cheap" relative to other goods. Rome produced glassware with Mediterranean sand and furnace technology. Neither could efficiently produce what the other specialised in, so trade across 7,000 km was worthwhile despite enormous transport costs.',
      checkQuestion: 'China can produce 100 bolts of silk or 50 vases per worker-month. Persia can produce 40 bolts of silk or 60 vases. Who has the comparative advantage in each good?',
      checkAnswer: 'China: opportunity cost of 1 silk = 50/100 = 0.5 vases. Persia: opportunity cost of 1 silk = 60/40 = 1.5 vases. China has the comparative advantage in silk (lower opportunity cost). China: opportunity cost of 1 vase = 100/50 = 2 silks. Persia: opportunity cost of 1 vase = 40/60 = 0.67 silks. Persia has the comparative advantage in vases.',
      codeIntro: 'Model Ricardo\'s comparative advantage for Silk Road trading partners and calculate the gains from specialisation.',
      code: `import numpy as np

# Production capacity: units per 1000 worker-months
countries = {
    "China":         {"silk": 100, "spices": 20, "glass": 10, "horses": 5},
    "Persia":        {"silk": 30,  "spices": 40, "glass": 25, "horses": 30},
    "Rome":          {"silk": 5,   "spices": 10, "glass": 60, "horses": 20},
    "India":         {"silk": 15,  "spices": 80, "glass": 15, "horses": 10},
    "Central Asia":  {"silk": 10,  "spices": 5,  "glass": 5,  "horses": 70},
}

goods = ["silk", "spices", "glass", "horses"]

# Calculate opportunity costs
print("=== Opportunity Cost Matrix ===")
print(f"{'Country':<16}", end="")
for g in goods:
    print(f"{'1 '+g:>14}", end="")
print()
print("-" * 72)

opp_costs = {}
for country, prod in countries.items():
    opp_costs[country] = {}
    total = sum(prod.values())
    print(f"{country:<16}", end="")
    for g in goods:
        # Opportunity cost of 1 unit of good g = what else you could produce
        other_output = sum(v for k, v in prod.items() if k != g)
        cost = other_output / prod[g]
        opp_costs[country][g] = cost
        print(f"{cost:>12.2f} u", end="")
    print()

# Find comparative advantages
print("\\\n=== Comparative Advantages ===")
for g in goods:
    costs = {c: opp_costs[c][g] for c in countries}
    best = min(costs, key=costs.get)
    print(f"{g:<10} -> {best:<16} (opp cost: {costs[best]:.2f})")

# Gains from trade: autarky vs specialisation
print("\\\n=== Gains from Specialisation ===")
n_workers = 1000  # per country

# Autarky: each country splits workers equally across goods
print("Autarky (each country makes everything):")
autarky_total = {g: 0 for g in goods}
for country, prod in countries.items():
    workers_per_good = n_workers / len(goods)
    for g in goods:
        output = prod[g] * workers_per_good / 1000
        autarky_total[g] += output
for g in goods:
    print(f"  Total {g:<8}: {autarky_total[g]:>8.0f} units")

# Specialisation: each country focuses on comparative advantage
print("\\\nSpecialisation (each country trades):")
spec_total = {g: 0 for g in goods}
assignments = {}
for g in goods:
    costs = {c: opp_costs[c][g] for c in countries}
    assignments[g] = min(costs, key=costs.get)

for country, prod in countries.items():
    my_goods = [g for g, c in assignments.items() if c == country]
    if my_goods:
        workers_per = n_workers / len(my_goods)
        for g in my_goods:
            spec_total[g] += prod[g] * workers_per / 1000

for g in goods:
    gain = (spec_total[g] / autarky_total[g] - 1) * 100 if autarky_total[g] > 0 else 0
    print(f"  Total {g:<8}: {spec_total[g]:>8.0f} units ({gain:>+.0f}% vs autarky)")`,
      challenge: 'Add a "transport cost" factor: trading silk from China to Rome costs 30% of the goods\' value in caravan fees. Does comparative advantage still hold when transport is expensive? At what transport cost does it become cheaper for Rome to make its own silk?',
      successHint: 'Comparative advantage is the single most powerful idea in economics. It explains why countries trade, why people specialise in careers, and why global supply chains exist. Ricardo proved that even if one party is better at everything, trade still benefits both sides.',
    },
    {
      title: 'Network centrality — which cities controlled the Silk Road?',
      concept: `The Silk Road wasn't a single road — it was a **network** of interconnected routes. Some cities sat at critical junctions where routes converged. These cities became wealthy and powerful not because they produced anything special, but because of their **position** in the network.

**Network centrality** measures how important a node is within a network. Three key types:

1. **Degree centrality**: how many direct connections a node has (number of trade routes)
2. **Betweenness centrality**: how many shortest paths between other nodes pass through this node (gateway cities)
3. **Closeness centrality**: how close a node is to all other nodes on average (access to the whole network)

A city with high betweenness centrality controls trade flow — goods must pass through it. A city with high closeness centrality can reach markets quickly. A city with high degree centrality has many trading partners.

📚 *Betweenness centrality identifies bottlenecks and gatekeepers. In the Silk Road, cities like Samarkand and Kashgar had enormous betweenness — nearly every east-west route passed through them.*`,
      analogy: 'Think of an airport network. A small regional airport might fly to 3 cities (low degree). A major hub like Dubai flies to 200 cities (high degree) and sits between Europe and Asia (high betweenness). Almost every route between East and West passes through Dubai — giving it enormous strategic importance, just like Samarkand on the Silk Road.',
      storyConnection: 'Samarkand, Kashgar, and Palmyra became fabulously wealthy not by producing silk or spices, but by sitting at network crossroads. When Palmyra was destroyed in 273 CE, trade routes had to reroute through Petra and Antioch — demonstrating how removing a high-betweenness node disrupts an entire network.',
      checkQuestion: 'City A connects to 2 other cities but lies on the only path between East and West. City B connects to 5 cities but they all connect to each other. Which city has higher betweenness centrality?',
      checkAnswer: 'City A — despite having fewer connections, ALL east-west traffic must pass through it. City B has high degree centrality (5 neighbours) but low betweenness because traffic can bypass it through the other interconnected cities. Betweenness measures control over flow, not number of connections.',
      codeIntro: 'Build a Silk Road network graph and calculate centrality measures for each city.',
      code: `import numpy as np

# Silk Road network: cities and connections
# Each edge: (city1, city2, distance_km)
cities = [
    "Chang'an", "Dunhuang", "Kashgar", "Samarkand", "Merv",
    "Baghdad", "Palmyra", "Antioch", "Constantinople",
    "Tashkent", "Kabul", "Peshawar", "Taxila",
    "Bukhara", "Tehran", "Alexandria",
]
n = len(cities)
city_idx = {c: i for i, c in enumerate(cities)}

edges = [
    ("Chang'an", "Dunhuang", 1500), ("Dunhuang", "Kashgar", 1200),
    ("Kashgar", "Samarkand", 900), ("Kashgar", "Tashkent", 700),
    ("Kashgar", "Kabul", 800), ("Samarkand", "Bukhara", 250),
    ("Samarkand", "Merv", 400), ("Samarkand", "Tashkent", 300),
    ("Merv", "Tehran", 900), ("Merv", "Baghdad", 1200),
    ("Tehran", "Baghdad", 800), ("Baghdad", "Palmyra", 700),
    ("Palmyra", "Antioch", 300), ("Antioch", "Constantinople", 900),
    ("Baghdad", "Antioch", 900), ("Kabul", "Peshawar", 250),
    ("Peshawar", "Taxila", 60), ("Bukhara", "Merv", 350),
    ("Constantinople", "Alexandria", 1200), ("Palmyra", "Alexandria", 800),
]

# Build adjacency matrix (Floyd-Warshall for all-pairs shortest paths)
INF = float('inf')
dist = np.full((n, n), INF)
adj = np.zeros((n, n), dtype=int)

for i in range(n):
    dist[i][i] = 0

for c1, c2, d in edges:
    i, j = city_idx[c1], city_idx[c2]
    dist[i][j] = dist[j][i] = d
    adj[i][j] = adj[j][i] = 1

# Floyd-Warshall
for k in range(n):
    for i in range(n):
        for j in range(n):
            if dist[i][k] + dist[k][j] < dist[i][j]:
                dist[i][j] = dist[i][k] + dist[k][j]

# Degree centrality
degree = adj.sum(axis=1)

# Closeness centrality: 1 / (average distance to all others)
closeness = np.zeros(n)
for i in range(n):
    reachable = dist[i][dist[i] < INF]
    if len(reachable) > 1:
        closeness[i] = (len(reachable) - 1) / reachable.sum()

# Betweenness centrality (simplified: count shortest paths through each node)
betweenness = np.zeros(n)
for s in range(n):
    for t in range(n):
        if s == t:
            continue
        for v in range(n):
            if v == s or v == t:
                continue
            if dist[s][v] + dist[v][t] == dist[s][t]:
                betweenness[v] += 1

# Normalise betweenness
max_b = betweenness.max()
if max_b > 0:
    betweenness_norm = betweenness / max_b

print("=== Silk Road Network Centrality Analysis ===")
print(f"{'City':<18} {'Degree':>7} {'Closeness':>10} {'Betweenness':>12} {'Role':>16}")
print("-" * 65)

for i in np.argsort(-betweenness):
    role = "HUB" if degree[i] >= 4 else "GATEWAY" if betweenness_norm[i] > 0.3 else "ENDPOINT" if degree[i] <= 1 else "RELAY"
    print(f"{cities[i]:<18} {degree[i]:>5} {closeness[i]:>9.4f} "
          f"{betweenness_norm[i]:>10.2f} {role:>16}")

# What happens if Samarkand is removed?
print("\\\n=== Impact of Removing Samarkand ===")
sam_idx = city_idx["Samarkand"]
dist2 = np.full((n, n), INF)
for i in range(n):
    dist2[i][i] = 0
for c1, c2, d in edges:
    i, j = city_idx[c1], city_idx[c2]
    if i == sam_idx or j == sam_idx:
        continue
    dist2[i][j] = dist2[j][i] = d
for k in range(n):
    for i in range(n):
        for j in range(n):
            if dist2[i][k] + dist2[k][j] < dist2[i][j]:
                dist2[i][j] = dist2[i][k] + dist2[k][j]

changan = city_idx["Chang'an"]
rome = city_idx["Constantinople"]
print(f"Chang'an to Constantinople: {dist[changan][rome]:.0f} km (with Samarkand)")
d2 = dist2[changan][rome]
print(f"Chang'an to Constantinople: {'unreachable' if d2 == INF else f'{d2:.0f} km'} (without Samarkand)")`,
      challenge: 'Remove Kashgar from the network instead. Is its impact larger or smaller than removing Samarkand? What does this tell you about single points of failure in trade networks? Modern supply chains face the same vulnerability — the 2021 Suez Canal blockage demonstrated this.',
      successHint: 'Network centrality is used everywhere: ranking web pages (Google PageRank is a centrality measure), identifying disease superspreaders, finding key influencers in social networks, and designing resilient infrastructure. The Silk Road was one of history\'s first complex networks.',
    },
    {
      title: 'Epidemiological modelling — how plague spread along trade routes',
      concept: `The Silk Road carried more than goods — it carried **disease**. The Black Death (1346-1353) travelled from Central Asia to Europe along trade routes, killing 30-60% of Europe's population. Understanding disease spread requires the **SEIR model**:

- **S** (Susceptible): people who can catch the disease
- **E** (Exposed): infected but not yet infectious (latent period)
- **I** (Infectious): actively spreading the disease
- **R** (Recovered/Removed): immune or dead

The key equations:
**dS/dt = -beta * S * I / N** (infection rate)
**dE/dt = beta * S * I / N - sigma * E** (exposed becoming infectious)
**dI/dt = sigma * E - gamma * I** (infectious recovering)
**dR/dt = gamma * I** (recovery rate)

The **latent period** (1/sigma) is what makes SEIR different from SIR. For plague, a person is infected for 2-6 days before showing symptoms and becoming infectious. During this latent period, they travel — carrying the disease to new cities along trade routes.

📚 *The basic reproduction number R0 = beta / gamma tells you how many people each infected person infects on average. If R0 > 1, the disease spreads. If R0 < 1, it dies out.*`,
      analogy: 'Think of a rumour spreading through a school. First you hear it (Exposed) but don\'t tell anyone for a day. Then you start telling friends (Infectious). Eventually everyone has heard it (Recovered) and stops spreading it. The latent period — the delay between hearing and telling — determines how far the rumour spreads before anyone notices.',
      storyConnection: 'The Black Death reached the Crimean port of Caffa in 1346 via Silk Road caravans. Genoese traders then carried it by ship to Constantinople, Sicily, and Marseille. The disease followed trade routes precisely — high-traffic trade cities were hit first and hardest. The SEIR model explains why: merchants in the Exposed phase travelled to new cities before showing symptoms.',
      checkQuestion: 'Plague has a latent period of 3 days and an infectious period of 5 days. A caravan travels for 10 days between cities. Can an exposed person reach the next city before becoming infectious?',
      checkAnswer: 'Yes — they become infectious on day 3 of the journey but don\'t arrive until day 10. They are infectious for 7 of the 10 travel days, potentially infecting fellow travellers. If the caravan has 30 people in close quarters, a single exposed traveller can start an outbreak in the next city.',
      codeIntro: 'Simulate plague spreading along the Silk Road using an SEIR model with a latent period.',
      code: `import numpy as np

def seir_simulation(population, beta, sigma, gamma, days, initial_exposed=5):
    """
    SEIR model with Euler integration.
    beta: transmission rate
    sigma: rate of becoming infectious (1/latent_period)
    gamma: recovery rate (1/infectious_period)
    """
    S = np.zeros(days)
    E = np.zeros(days)
    I = np.zeros(days)
    R = np.zeros(days)

    S[0] = population - initial_exposed
    E[0] = initial_exposed
    N = population

    for t in range(days - 1):
        new_exposed = beta * S[t] * I[t] / N
        new_infectious = sigma * E[t]
        new_recovered = gamma * I[t]

        S[t+1] = S[t] - new_exposed
        E[t+1] = E[t] + new_exposed - new_infectious
        I[t+1] = I[t] + new_infectious - new_recovered
        R[t+1] = R[t] + new_recovered

    return S, E, I, R

# Silk Road city outbreak
print("=== SEIR Model: Plague in a Silk Road City ===")
print("Population: 50,000 | Latent period: 4 days | Infectious: 7 days\\\n")

pop = 50000
beta = 0.4      # transmission rate
sigma = 1/4     # latent period = 4 days
gamma = 1/7     # infectious period = 7 days
days = 200

S, E, I, R = seir_simulation(pop, beta, sigma, gamma, days)

# R0 calculation
R0 = beta / gamma
print(f"R0 = beta/gamma = {beta}/{gamma:.3f} = {R0:.1f}")
print(f"Expected to infect {R0:.1f} people per case -> epidemic will {'spread' if R0 > 1 else 'die out'}\\\n")

# Key milestones
peak_day = np.argmax(I)
peak_infected = I[peak_day]
total_infected = R[-1]

print(f"{'Day':>6} {'Susceptible':>12} {'Exposed':>10} {'Infectious':>11} {'Recovered':>10}")
print("-" * 51)
for d in [0, 10, 20, 30, 50, 75, 100, peak_day, 150, 199]:
    if d < days:
        print(f"{d:>6} {S[d]:>11,.0f} {E[d]:>9,.0f} {I[d]:>10,.0f} {R[d]:>9,.0f}")

print(f"\\\nPeak infectious: day {peak_day} with {peak_infected:,.0f} people")
print(f"Total infected: {total_infected:,.0f} ({total_infected/pop*100:.1f}% of population)")

# Compare latent periods
print("\\\n=== Impact of Latent Period on Outbreak ===")
for latent in [1, 3, 5, 10, 20]:
    sig = 1/latent
    S2, E2, I2, R2 = seir_simulation(pop, beta, sig, gamma, days)
    peak_d = np.argmax(I2)
    peak_i = I2[peak_d]
    print(f"Latent period {latent:>2}d: peak day {peak_d:>3}, "
          f"peak infected {peak_i:>6,.0f}, total {R2[-1]:>6,.0f} ({R2[-1]/pop*100:.0f}%)")`,
      challenge: 'The Black Death had a mortality rate of about 50%. Modify the model to split R into "Recovered" and "Dead" (with 50% of removals being deaths). How does the death toll compare across different latent periods? Why did longer latent periods lead to wider geographic spread?',
      successHint: 'The SEIR model is the foundation of modern epidemiology. It was used to model COVID-19, Ebola, influenza, and every pandemic since. The latent period is crucial — it determines whether you can detect and isolate cases before they spread. The Silk Road was a natural experiment in disease transmission through trade networks.',
    },
    {
      title: 'Caravan logistics — optimising water, food, and speed',
      concept: `A Silk Road caravan faced a brutal optimisation problem: carry more water and food (heavier load, slower speed, more days in transit, need even MORE water) or carry less (lighter, faster, but risk running out in the desert).

This is a **constrained optimisation** problem. The objective is to **minimise total travel time** subject to constraints:
- Water consumption = f(load, temperature, distance)
- Camel carrying capacity is fixed (max ~200 kg per camel)
- Speed decreases with load: v = v_max * (1 - load/capacity)
- Food consumption is proportional to days in transit
- Water consumption increases in desert segments

The circular dependency (more water -> heavier -> slower -> need more water) creates a **feedback loop** that must be solved simultaneously.

📚 *Constrained optimisation is the mathematical framework for making the best choice when you can't have everything. Every engineering design, business decision, and resource allocation problem is a constrained optimisation.*`,
      analogy: 'Imagine packing for a backpacking trip. A heavier pack means slower walking, which means more nights camping, which means more food, which makes the pack even heavier. There\'s a sweet spot: enough supplies to be safe, light enough to move efficiently. Going too heavy or too light both lead to failure.',
      storyConnection: 'Silk Road caravans typically had 30-100 camels. A Bactrian camel carries ~200 kg and needs 50 litres of water every 5-7 days. Crossing the Taklamakan Desert (800 km of sand) required precise calculation: too little water and the caravan dies. Too much water and there\'s no room for trade goods — the entire journey is unprofitable.',
      checkQuestion: 'A camel carries 200 kg max. Trade goods weigh 120 kg. Water weighs 1 kg/litre and the camel needs 10 litres/day. The journey takes 8 days. Can the camel carry enough water?',
      checkAnswer: 'Water needed: 10 * 8 = 80 kg. Total load: 120 + 80 = 200 kg = exactly at capacity. But this assumes no margin for error. If the journey takes 9 days (sandstorm, lost route), the camel runs out of water with a day still to go. The practical solution: carry 100 kg of goods and 80 kg of water, leaving 20 kg margin.',
      codeIntro: 'Optimise caravan loading for a multi-segment Silk Road journey with varying terrain.',
      code: `import numpy as np

def simulate_caravan(segments, camels, goods_kg_per_camel, water_reserve_days):
    """
    Simulate a caravan journey across multiple segments.
    Returns total days, profit, survival status.
    """
    camel_capacity = 200  # kg per camel
    base_speed = 40       # km/day unloaded
    water_per_day = 8     # litres per camel per day
    food_per_day = 3      # kg per camel per day

    total_days = 0
    total_water_used = 0
    survived = True

    for seg in segments:
        distance = seg["distance"]
        temp_factor = seg["temp_factor"]  # 1.0 normal, 1.5 desert, 0.8 mountain

        # Estimate days for this segment
        load_fraction = goods_kg_per_camel / camel_capacity
        speed = base_speed * (1 - 0.6 * load_fraction)
        est_days = distance / speed

        # Water and food for this segment
        water_needed = water_per_day * temp_factor * est_days * camels
        food_needed = food_per_day * est_days * camels

        # Available water (what we packed)
        water_packed = water_per_day * temp_factor * (est_days + water_reserve_days) * camels
        food_packed = food_per_day * (est_days + water_reserve_days) * camels

        # Check capacity
        total_load = goods_kg_per_camel + water_packed/camels + food_packed/camels
        if total_load > camel_capacity:
            # Overloaded — must reduce goods
            survived = False

        total_days += est_days
        total_water_used += water_needed

    return total_days, survived, total_water_used

# Silk Road segments: Chang'an to Constantinople
segments = [
    {"name": "Chang'an to Dunhuang",     "distance": 1500, "temp_factor": 1.0},
    {"name": "Dunhuang to Kashgar",       "distance": 1200, "temp_factor": 1.5},  # Taklamakan
    {"name": "Kashgar to Samarkand",      "distance": 900,  "temp_factor": 1.2},
    {"name": "Samarkand to Merv",         "distance": 400,  "temp_factor": 1.3},
    {"name": "Merv to Baghdad",           "distance": 1200, "temp_factor": 1.4},
    {"name": "Baghdad to Constantinople", "distance": 1900, "temp_factor": 1.0},
]

total_dist = sum(s["distance"] for s in segments)
print("=== Silk Road Caravan Optimisation ===")
print(f"Total distance: {total_dist:,} km across {len(segments)} segments\\\n")

print(f"{'Goods (kg)':>11} {'Reserve':>8} {'Days':>7} {'Survives':>9} {'Profit':>10}")
print("-" * 47)

camels = 50
silk_value_per_kg = 30  # gold coins per kg at destination
camel_cost_per_day = 2  # maintenance per camel per day

best_profit = -float('inf')
best_config = None

for goods_kg in range(40, 160, 10):
    for reserve in [1, 2, 3, 5, 7]:
        days, survived, water = simulate_caravan(segments, camels, goods_kg, reserve)
        revenue = goods_kg * camels * silk_value_per_kg if survived else 0
        cost = days * camels * camel_cost_per_day
        profit = revenue - cost

        if goods_kg in [60, 100, 140] or (survived and profit > best_profit):
            status = "YES" if survived else "NO"
            if goods_kg in [60, 100, 140]:
                print(f"{goods_kg:>9} kg {reserve:>6}d {days:>6.0f} {status:>8} {profit:>9,.0f}")
            if survived and profit > best_profit:
                best_profit = profit
                best_config = (goods_kg, reserve, days, profit)

print(f"\\\n=== Optimal Configuration ===")
print(f"Goods per camel: {best_config[0]} kg")
print(f"Water reserve: {best_config[1]} days")
print(f"Journey time: {best_config[2]:.0f} days")
print(f"Profit: {best_config[3]:,.0f} gold coins")

# Risk analysis: what if a segment takes longer?
print("\\\n=== Risk: Sandstorm Delays (Taklamakan) ===")
for delay in [0, 3, 7, 14]:
    modified = [dict(s) for s in segments]
    modified[1]["distance"] += delay * 25  # delay adds km equivalent
    days, survived, _ = simulate_caravan(modified, camels, best_config[0], best_config[1])
    revenue = best_config[0] * camels * silk_value_per_kg if survived else 0
    cost = days * camels * camel_cost_per_day
    profit = revenue - cost
    print(f"Delay {delay:>2} days: journey {days:>5.0f}d, "
          f"{'survived' if survived else 'LOST'}, profit {profit:>8,.0f}")`,
      challenge: 'Add oasis resupply points: at Kashgar and Samarkand, the caravan can buy water (expensive — 5 gold coins per litre). Modify the simulation to allow the caravan to start with less water and resupply at oases. Does this change the optimal goods-to-water ratio?',
      successHint: 'You solved a constrained optimisation with feedback loops — the same mathematics behind airline scheduling, warehouse logistics, and space mission planning. The circular dependency (more supplies -> heavier -> need more supplies) appears in rocket science as the Tsiolkovsky equation — same principle, different context.',
    },
    {
      title: 'Exchange rate dynamics — supply, demand, and equilibrium prices',
      concept: `When a Silk Road caravan arrived in a new city, the price of silk depended on **supply and demand**. If many caravans arrived at once (high supply), prices dropped. If a city hadn't seen silk in months (pent-up demand), prices soared.

The **equilibrium price** is where supply equals demand:
**P* = (a * D_base - b * S_base) / (a + b)**

Where a and b are price sensitivities of demand and supply. But the Silk Road never reached perfect equilibrium — information about prices in distant cities took months to arrive, creating **price differentials** that drove trade.

Key dynamics:
- **Arbitrage**: buy where cheap, sell where expensive. Profit = price difference minus transport cost.
- **Price convergence**: as trade flows, supply increases at the destination (lowering prices) and decreases at the origin (raising prices).
- **Information lag**: prices adjust slowly because traders don't know current prices in distant cities.

📚 *Arbitrage is the engine of trade: it exploits price differences between markets. When arbitrage is easy, prices converge quickly. When it's hard (long distances, dangerous routes), price differences persist — which is exactly what made the Silk Road profitable.*`,
      analogy: 'Imagine two lemonade stands on opposite sides of a park. One charges 50 cents, the other charges $2. Customers walk to the cheap stand. The cheap stand raises prices (high demand). The expensive stand lowers prices (losing customers). Eventually both converge to ~$1.25. This is price equilibrium through arbitrage. On the Silk Road, this process took months instead of minutes.',
      storyConnection: 'Silk sold for 10x its Chinese price in Rome — a markup that covered the enormous costs and risks of 7,000 km of overland transport. But this wasn\'t pure profit for any single merchant. Each intermediary (Chinese trader, Sogdian middleman, Persian caravan, Roman importer) captured a piece of the markup. The price gradient across the Silk Road reflected cumulative transport costs, tariffs, and risks at each stage.',
      checkQuestion: 'Silk costs 10 gold coins in Chang\'an and sells for 100 in Rome. Transport costs 50 gold coins per unit. Tariffs total 20 gold coins. What is the trader\'s profit per unit?',
      checkAnswer: 'Revenue: 100. Costs: 10 (purchase) + 50 (transport) + 20 (tariffs) = 80. Profit: 100 - 80 = 20 gold coins per unit = 25% return on the 80 investment. This 25% return, earned over 1-2 years of travel, is what motivated Silk Road trade despite enormous risks.',
      codeIntro: 'Model supply-demand equilibrium and price dynamics across Silk Road trading cities.',
      code: `import numpy as np

np.random.seed(42)

class Market:
    """A trading city with supply, demand, and price dynamics."""
    def __init__(self, name, base_demand, base_supply, price_sensitivity):
        self.name = name
        self.base_demand = base_demand
        self.base_supply = base_supply
        self.sensitivity = price_sensitivity
        self.price = self.equilibrium_price()
        self.inventory = base_supply

    def equilibrium_price(self):
        """Price where supply meets demand."""
        return (self.base_demand - self.base_supply) / self.sensitivity + 50

    def demand_at_price(self, price):
        return max(0, self.base_demand - self.sensitivity * (price - 50))

    def supply_at_price(self, price):
        return max(0, self.base_supply + self.sensitivity * (price - 50) * 0.5)

# Silk Road markets (silk as the traded good)
markets = [
    Market("Chang'an",        200, 300, 2.0),   # surplus producer
    Market("Dunhuang",        80,  50,  1.5),
    Market("Kashgar",         100, 30,  1.5),
    Market("Samarkand",       150, 40,  1.8),
    Market("Baghdad",         180, 20,  2.0),
    Market("Constantinople",  250, 10,  2.5),   # high demand, low supply
]

print("=== Silk Road Price Gradient ===")
print(f"{'City':<18} {'Demand':>7} {'Supply':>7} {'Eq.Price':>9} {'Surplus':>8}")
print("-" * 51)
for m in markets:
    surplus = m.base_supply - m.base_demand
    print(f"{m.name:<18} {m.base_demand:>5} {m.base_supply:>5} "
          f"{m.price:>7.1f} g {'surplus' if surplus > 0 else 'deficit':>8}")

# Simulate trade over 12 months
print("\\\n=== Price Dynamics Over 12 Months ===")
transport_cost_per_leg = 8  # gold per unit between adjacent cities

for month in range(1, 13):
    # Caravans move goods from low-price to high-price cities
    for i in range(len(markets) - 1):
        price_diff = markets[i+1].price - markets[i].price
        if price_diff > transport_cost_per_leg:
            # Profitable to trade — move goods
            trade_volume = min(20, markets[i].inventory * 0.3)
            markets[i].inventory -= trade_volume
            markets[i+1].inventory += trade_volume

    # Update prices based on inventory
    for m in markets:
        supply_ratio = m.inventory / m.base_demand
        m.price = max(10, m.equilibrium_price() * (2 - supply_ratio))
        # Random demand shocks
        m.base_demand *= np.random.uniform(0.9, 1.1)

    if month in [1, 3, 6, 9, 12]:
        prices = [f"{m.price:>6.1f}" for m in markets]
        print(f"Month {month:>2}: " + " -> ".join(prices))

# Arbitrage opportunity analysis
print("\\\n=== Arbitrage Opportunities ===")
print(f"{'Route':<35} {'Buy':>6} {'Sell':>6} {'Cost':>6} {'Profit':>7}")
print("-" * 62)
for i in range(len(markets)):
    for j in range(i+1, len(markets)):
        legs = j - i
        cost = transport_cost_per_leg * legs
        profit = markets[j].price - markets[i].price - cost
        if profit > 0:
            route = f"{markets[i].name} -> {markets[j].name}"
            print(f"{route:<35} {markets[i].price:>5.1f} {markets[j].price:>5.1f} "
                  f"{cost:>5.0f} {profit:>6.1f}{'*' if profit > 30 else ''}")`,
      challenge: 'Add a "tariff" at each city (5-15% of goods value). How do tariffs change the price gradient and which routes remain profitable? This is the fundamental economics question behind modern trade agreements — tariffs reduce trade volume but generate government revenue.',
      successHint: 'You modelled the core mechanism of international trade: price differentials driven by supply-demand imbalances, corrected by arbitrage, distorted by transport costs and tariffs. The same dynamics govern modern commodity markets — oil, grain, semiconductors — just faster thanks to electronic communication.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Trade economics, network science, and epidemiological modelling</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 explores comparative advantage, network centrality, SEIR disease modelling, caravan logistics, and exchange rate dynamics.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
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
