import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SilkRoadLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Transport economics — why silk traveled 7,000 km but grain stayed home',
      concept: `Not everything is worth trading over long distances. The key concept is the **value-to-weight ratio** — the price of a good divided by its weight. Goods with a high value-to-weight ratio are worth the cost of transport; goods with a low ratio are not.

Silk has an extraordinarily high value-to-weight ratio. A single bolt of Chinese silk weighed about 2 kg and could sell for the equivalent of 100 days' wages in Rome. A camel can carry about 200 kg, meaning one camel-load of silk was worth a fortune. Grain, by contrast, is heavy and cheap — a camel-load of wheat might be worth only a few days' wages.

**Transport cost** on the Silk Road was roughly **1 silver coin per ton per km** by camel caravan. Over 7,000 km from Xi'an to Rome, that adds up fast. If the transport cost exceeds the good's value, trade makes no economic sense.

This is why the Silk Road carried:
- **Silk** (value-to-weight: ~50 gold coins/kg)
- **Spices** (value-to-weight: ~30 gold coins/kg)
- **Gemstones** (value-to-weight: ~500 gold coins/kg)
- **Paper** and **gunpowder** recipes (value-to-weight: effectively infinite — pure knowledge)

But NOT:
- **Grain** (value-to-weight: ~0.05 gold coins/kg)
- **Timber** (value-to-weight: ~0.01 gold coins/kg)
- **Stone** (value-to-weight: ~0.005 gold coins/kg)

📚 This same principle governs modern logistics. Microchips fly by air (high value-to-weight). Coal travels by ship (low value-to-weight, but ships are cheap per ton-km). Amazon uses algorithms to optimize this daily.`,
      analogy: 'Imagine you can carry one backpack on a 10-hour hike to a market. Would you fill it with diamonds or with sand? Obviously diamonds — because the effort of carrying is the same, but the payoff is wildly different. Every Silk Road merchant made this calculation: is this good valuable enough per kilogram to justify months of dangerous travel?',
      storyConnection: 'The Silk Road earned its name because silk was the perfect trade good — light, compact, and worth a fortune at the other end. Merchants did not call it the "Wheat Road" or the "Lumber Road" because those goods could never justify the cost of a 7,000 km journey by camel. The economics of value-to-weight shaped which goods moved and which stayed local.',
      checkQuestion: 'A merchant can transport goods from Samarkand to Constantinople (3,000 km) at a cost of 0.5 gold coins per kg. Silk is worth 60 gold/kg at origin and 120 gold/kg at destination. Wheat is worth 0.1 gold/kg at origin and 0.15 gold/kg at destination. Which good should the merchant carry?',
      checkAnswer: 'Transport cost = 0.5 × 3,000/1,000 = 1.5 gold/kg. Silk profit = 120 - 60 - 1.5 = 58.5 gold/kg. Wheat profit = 0.15 - 0.1 - 1.5 = -1.35 gold/kg (a loss). Silk is profitable; wheat loses money. The merchant carries silk.',
      codeIntro: 'Calculate the profitability of different goods along the Silk Road based on value-to-weight ratios and transport distance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Silk Road goods: name, value at origin (gold/kg), value at destination (gold/kg), weight class
goods = {
    'Silk':       {'origin_val': 50,  'dest_val': 120, 'color': '#f59e0b'},
    'Spices':     {'origin_val': 30,  'dest_val': 90,  'color': '#ef4444'},
    'Gemstones':  {'origin_val': 500, 'dest_val': 1200,'color': '#8b5cf6'},
    'Paper':      {'origin_val': 5,   'dest_val': 40,  'color': '#3b82f6'},
    'Porcelain':  {'origin_val': 8,   'dest_val': 35,  'color': '#06b6d4'},
    'Grain':      {'origin_val': 0.05,'dest_val': 0.08,'color': '#84cc16'},
    'Timber':     {'origin_val': 0.01,'dest_val': 0.02,'color': '#78716c'},
}

# Transport cost: gold per kg per 1000 km
transport_rate = 0.5  # gold/kg per 1000 km
distances = np.linspace(100, 8000, 200)  # km

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Plot profit vs distance for each good
ax1.set_facecolor('#111827')
for name, g in goods.items():
    profit = (g['dest_val'] - g['origin_val']) - transport_rate * distances / 1000
    ax1.plot(distances, profit, color=g['color'], linewidth=2, label=name)

ax1.axhline(y=0, color='white', linestyle='--', alpha=0.5, linewidth=1)
ax1.set_xlabel('Distance (km)', color='white')
ax1.set_ylabel('Profit per kg (gold coins)', color='white')
ax1.set_title('Profit vs Distance by Good', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(-5, 50)

# Bar chart: profit at 7000 km (Xi'an to Rome)
ax2.set_facecolor('#111827')
dist = 7000
names = list(goods.keys())
profits = [(g['dest_val'] - g['origin_val']) - transport_rate * dist / 1000 for g in goods.values()]
colors = [g['color'] for g in goods.values()]
bars = ax2.barh(names, profits, color=colors)
ax2.axvline(x=0, color='white', linestyle='--', alpha=0.5)
ax2.set_xlabel('Profit per kg at 7,000 km (gold coins)', color='white')
ax2.set_title("Xi'an to Rome: What's Worth Trading?", color='white', fontsize=13)
ax2.tick_params(colors='gray')
for bar, val in zip(bars, profits):
    x_pos = max(val, 0) + 0.5 if val >= 0 else val - 3
    ax2.text(x_pos, bar.get_y() + bar.get_height()/2,
            f'{val:.1f}', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("At 7,000 km (Xi'an to Rome):")
for name, g in goods.items():
    p = (g['dest_val'] - g['origin_val']) - transport_rate * 7000 / 1000
    status = "PROFITABLE" if p > 0 else "LOSS"
    print(f"  {name:12s}: profit = {p:8.2f} gold/kg  [{status}]")
print()
print("Only high value-to-weight goods survive long distances.")
print("This is why the Silk Road carried silk, not wheat.")`,
      challenge: 'Add a "sea route" option with transport cost of 0.05 gold/kg per 1000 km (10x cheaper than camels). Which goods become profitable by sea that were not by land? This explains why maritime trade eventually replaced the overland Silk Road.',
      successHint: 'Value-to-weight ratio is the invisible hand that determined what moved on the Silk Road. The same principle drives every logistics decision today — it costs $0.02 to ship a kg by sea and $4.00 by air, which is why bananas come by ship and microchips fly.',
    },
    {
      title: 'Supply chain markups — how a 1-coin good becomes 100 coins',
      concept: `No single merchant traveled the entire 7,000 km Silk Road. Instead, goods passed through a **chain of intermediaries** — each one buying from the previous, adding a markup, and selling to the next.

A typical Silk Road supply chain had **10-12 intermediaries**: Chinese producer → Chinese merchant → caravan leader → Dunhuang trader → Sogdian middleman → Persian wholesaler → Palmyra broker → Mediterranean shipper → Roman importer → Roman retailer → final buyer.

Each intermediary added a **markup** — typically 20-40% above their purchase price — to cover their costs, risks, and profit. The mathematical effect is **compound multiplication**, not addition.

If each of 12 intermediaries adds a 30% markup:
- Final price = origin price × (1.30)^12
- (1.30)^12 = 23.3
- A bolt of silk worth 1 gold coin in China costs **23.3 gold coins** in Rome

This is why Roman senators complained that silk was "worth its weight in gold." It was not that silk was inherently that expensive — the compounding markups through a dozen hands made it so.

📚 The formula is: **P_final = P_origin × (1 + r)^n** where r is the per-intermediary markup rate and n is the number of intermediaries. This is the same formula as compound interest — one of the most powerful ideas in mathematics.

📚 Modern supply chains have the same structure. A t-shirt manufactured for $2 in Bangladesh sells for $30 in New York after factory markup, exporter, shipper, customs, importer, distributor, and retailer each take their cut.`,
      analogy: 'Imagine a game of telephone where each person adds 30% to the price they heard. Person 1 says "1 gold." Person 2 says "1.30." Person 3 says "1.69." By person 12, it is "23.30 gold." Each addition seems small, but compounding makes it enormous — just like compound interest turns small savings into large sums over time.',
      storyConnection: 'The Silk Road was not one road but a relay race of merchants. No Chinese silk weaver ever met a Roman toga-maker. Between them stood a dozen traders, each in a different city, each speaking a different language, each adding their markup. The final price in Rome was not set by the value of silk — it was set by the length of the chain.',
      checkQuestion: 'If silk costs 2 gold coins at origin and passes through 8 intermediaries, each adding a 25% markup, what is the final price? What if you could cut the chain to 4 intermediaries?',
      checkAnswer: 'With 8 intermediaries: 2 × (1.25)^8 = 2 × 5.96 = 11.92 gold coins. With 4 intermediaries: 2 × (1.25)^4 = 2 × 2.44 = 4.88 gold coins. Cutting the chain in half cuts the final price by 59%. This is why merchants who controlled longer stretches of the route became enormously wealthy — they eliminated intermediaries.',
      codeIntro: 'Model how compound markups through the Silk Road supply chain inflate prices, and see how chain length and markup rate interact.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Compound markup model
def supply_chain_price(origin_price, markup_rate, num_intermediaries):
    """Calculate final price after compounding markups"""
    return origin_price * (1 + markup_rate) ** num_intermediaries

# Historical Silk Road chain
intermediaries = ['Producer', 'Local merchant', 'Caravan leader',
                  'Dunhuang trader', 'Sogdian broker', 'Samarkand dealer',
                  'Persian wholesaler', 'Palmyra agent', 'Mediterranean shipper',
                  'Antioch importer', 'Roman retailer', 'Final buyer']

origin_price = 1.0  # gold coins
markup = 0.30  # 30% per intermediary

# Track price at each step
prices = [origin_price]
for i in range(len(intermediaries) - 1):
    prices.append(prices[-1] * (1 + markup))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Price through the chain
ax1.set_facecolor('#111827')
ax1.bar(range(len(intermediaries)), prices, color='#f59e0b')
ax1.set_xticks(range(len(intermediaries)))
ax1.set_xticklabels(intermediaries, rotation=45, ha='right', color='white', fontsize=7)
ax1.set_ylabel('Price (gold coins)', color='white')
ax1.set_title('Price of Silk Through the Supply Chain', color='white', fontsize=12)
ax1.tick_params(colors='gray')
for i, p in enumerate(prices):
    ax1.text(i, p + 0.3, f'{p:.1f}', ha='center', color='white', fontsize=7)

# Sensitivity: markup rate vs chain length
ax2.set_facecolor('#111827')
chain_lengths = np.arange(1, 16)
markup_rates = [0.15, 0.20, 0.25, 0.30, 0.40]
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

for rate, color in zip(markup_rates, colors):
    final_prices = supply_chain_price(1.0, rate, chain_lengths)
    ax2.plot(chain_lengths, final_prices, 'o-', color=color, linewidth=2,
             label=f'{rate:.0%} markup', markersize=4)

ax2.set_xlabel('Number of intermediaries', color='white')
ax2.set_ylabel('Price multiplier (from origin)', color='white')
ax2.set_title('Compound Markup: Rate × Chain Length', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.set_yscale('log')
ax2.set_ylabel('Price multiplier (log scale)', color='white')

plt.tight_layout()
plt.show()

print("Silk Road supply chain (30% markup per intermediary):")
print(f"  Origin price:  {origin_price:.1f} gold")
print(f"  Final price:   {prices[-1]:.1f} gold ({len(intermediaries)-1} intermediaries)")
print(f"  Total markup:  {prices[-1]/origin_price:.1f}x")
print()
print("Effect of cutting intermediaries:")
for n in [4, 6, 8, 11]:
    p = supply_chain_price(1.0, 0.30, n)
    print(f"  {n:2d} intermediaries: {p:.1f}x origin price")`,
      challenge: 'Model a scenario where the Mongol Empire unifies the Silk Road under one authority, reducing intermediaries from 12 to 5 and the markup rate from 30% to 15% (due to reduced risk and taxes). How much cheaper does silk become? (This actually happened under Pax Mongolica, 1250-1350.)',
      successHint: 'Compound markups explain why ancient luxury goods were so expensive and why controlling trade routes meant controlling wealth. The same mathematics — (1+r)^n — governs compound interest, inflation, and every supply chain on Earth.',
    },
    {
      title: 'Currency exchange — how prices signal across continents',
      concept: `The Silk Road connected civilizations that used completely different currencies. Chinese merchants used **bronze cash coins** (round with a square hole). Persians used **silver drachms**. Romans used **gold aurei** and **silver denarii**. Indians used **punch-marked silver karshapanas**.

For trade to work across these systems, merchants needed **exchange rates** — how many Chinese cash equal one Roman denarius? These rates were not set by governments but emerged from **supply and demand** at trading posts.

Key concepts:
- **Exchange rate**: the price of one currency in terms of another
- **Arbitrage**: profiting from price differences between markets
- **Price signal propagation**: when a price change in one city ripples through the network

If silk becomes scarce in China, its price rises in Chinese cash. Sogdian merchants notice and offer more cash per bolt. This raises the cash-to-drachm exchange rate in Samarkand. Persian merchants then raise their drachm price, which eventually reaches Rome as higher denarius prices. A price change in Xi'an reaches Rome — but it takes **months**, not milliseconds.

📚 The **law of one price** says that identical goods should cost the same everywhere (adjusted for transport costs). In practice, the Silk Road had enormous price discrepancies because information traveled slowly. Modern markets approach this ideal because electronic communication is instant — forex markets trade $7.5 trillion per day.

📚 **Gresham's Law**: "Bad money drives out good." When a government debases its coins (mixing in cheaper metals), people hoard the good coins and spend the bad ones. This happened repeatedly along the Silk Road.`,
      analogy: 'Currency exchange is like translation between languages. If you translate English to French to Arabic to Chinese, each translation introduces small errors and costs. The more "translations" (exchanges) your money goes through, the more value you lose to fees and rate fluctuations. Merchants who could minimize currency conversions kept more profit.',
      storyConnection: 'Every Silk Road trading post was a babel of currencies. A Sogdian merchant in Samarkand might hold Chinese cash, Persian silver, Byzantine gold, and Indian karshapanas simultaneously — functioning as a human currency exchange. The story of the Silk Road is partly a story of how humans solved the problem of exchanging value across incompatible monetary systems.',
      checkQuestion: 'If 1 Roman aureus = 25 denarii, 1 denarius = 3 Persian drachms, and 1 drachm = 200 Chinese cash, how many Chinese cash equal 1 aureus? If silk costs 50,000 cash in Xi\'an, what does it cost in aurei?',
      checkAnswer: '1 aureus = 25 × 3 × 200 = 15,000 cash. Silk at 50,000 cash = 50,000 / 15,000 = 3.33 aurei. A Roman would pay about 3.3 gold coins for a bolt of Chinese silk — before adding transport and markup costs, which would push it much higher.',
      codeIntro: 'Model a multi-currency exchange network and simulate how a price change in China propagates along the Silk Road to Rome.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Historical exchange rates (approximate, ~100 CE)
# Base unit: grams of silver equivalent
currencies = {
    'Chinese Cash':     {'silver_g': 0.5,   'symbol': '文'},
    'Kushan Dinar':     {'silver_g': 8.0,   'symbol': 'KD'},
    'Persian Drachm':   {'silver_g': 3.5,   'symbol': 'Dr'},
    'Roman Denarius':   {'silver_g': 3.4,   'symbol': 'Den'},
    'Byzantine Solidus':{'silver_g': 14.0,  'symbol': 'Sol'},
}

# Exchange rate matrix
names = list(currencies.keys())
n = len(names)
rates = np.zeros((n, n))
for i in range(n):
    for j in range(n):
        rates[i][j] = currencies[names[j]]['silver_g'] / currencies[names[i]]['silver_g']

# Silk Road cities and their primary currencies
cities = ['Xi\'an', 'Dunhuang', 'Kashgar', 'Samarkand', 'Merv',
          'Ctesiphon', 'Palmyra', 'Antioch', 'Constantinople', 'Rome']
city_currencies = [0, 0, 1, 1, 2, 2, 3, 3, 4, 3]  # index into names

# Price signal propagation: silk price shock in Xi'an
days = 300
price_in_cash = np.zeros((len(cities), days))
price_in_cash[0, :] = 50000  # base price
price_in_cash[0, 50:] = 65000  # 30% price shock at day 50

# Propagation delay: ~20-30 days between adjacent cities
delay_per_city = 25  # days for information to travel one hop

for c in range(1, len(cities)):
    delay = delay_per_city * c
    for d in range(days):
        if d < delay:
            price_in_cash[c, d] = 50000 * rates[0, city_currencies[c]]
        else:
            source_day = d - delay_per_city
            price_in_cash[c, d] = price_in_cash[c-1, max(0,source_day)] * rates[city_currencies[c-1], city_currencies[c]]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

# Price signal propagation
ax1.set_facecolor('#111827')
colors_prop = plt.cm.plasma(np.linspace(0.1, 0.9, len(cities)))
for c in [0, 2, 4, 6, 9]:  # show key cities
    local_price = price_in_cash[c] / rates[0, city_currencies[c]]  # normalize to silver
    ax1.plot(range(days), local_price / local_price[0], color=colors_prop[c],
             linewidth=2, label=cities[c])

ax1.axvline(x=50, color='red', linestyle='--', alpha=0.5, label='Price shock in Xi\'an')
ax1.set_xlabel('Days', color='white')
ax1.set_ylabel('Price index (1.0 = baseline)', color='white')
ax1.set_title('Price Signal Propagation: Silk Shortage in Xi\'an', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Exchange rate matrix heatmap
ax2.set_facecolor('#111827')
im = ax2.imshow(rates, cmap='YlOrRd', aspect='auto')
ax2.set_xticks(range(n))
ax2.set_yticks(range(n))
ax2.set_xticklabels([f'{names[i]}\
({currencies[names[i]]["symbol"]})' for i in range(n)],
                    color='white', fontsize=8)
ax2.set_yticklabels(names, color='white', fontsize=8)
ax2.set_title('Exchange Rate Matrix (how many column-currency per 1 row-currency)', color='white', fontsize=11)
for i in range(n):
    for j in range(n):
        ax2.text(j, i, f'{rates[i,j]:.1f}', ha='center', va='center',
                color='black' if rates[i,j] > 5 else 'white', fontsize=9)

plt.tight_layout()
plt.show()

print("Exchange rates (per 1 unit of row currency):")
for i in range(n):
    print(f"  1 {names[i]:20s} = {rates[i,1]:.1f} Kushan Dinar = {rates[i,3]:.1f} Denarius")
print()
delay_xian_rome = delay_per_city * 9
print(f"Price signal delay Xi'an to Rome: ~{delay_xian_rome} days ({delay_xian_rome/30:.0f} months)")
print("Modern forex: same signal travels in milliseconds.")`,
      challenge: 'Add an arbitrage detector: find any cycle of 3 currencies where exchanging A→B→C→A yields more than you started with. (Hint: multiply the exchange rates around the cycle. If the product > 1, there is an arbitrage opportunity.)',
      successHint: 'Exchange rates are prices of money itself. On the Silk Road, price signals traveled at camel speed — 30 km/day. Today, forex markets transmit price signals at light speed — 300,000 km/second. The mathematics is identical; only the speed has changed.',
    },
    {
      title: 'The SIR epidemic model — the Black Death on trade routes',
      concept: `The Silk Road did not only carry goods — it carried **disease**. The Black Death (bubonic plague, caused by *Yersinia pestis*) traveled from Central Asia to Europe along Silk Road trade routes between 1346-1353, killing an estimated **75-200 million people** (30-60% of Europe's population).

Epidemiologists model disease spread using the **SIR model**:
- **S** = Susceptible (can catch the disease)
- **I** = Infected (currently sick and contagious)
- **R** = Recovered (immune) or dead

The model uses differential equations:
- **dS/dt = -β × S × I / N** (susceptible people become infected)
- **dI/dt = β × S × I / N - γ × I** (infected people either infect others or recover)
- **dR/dt = γ × I** (infected people recover or die)

The key parameter is **R₀** (R-naught) — the **basic reproduction number**:
- **R₀ = β / γ**
- If R₀ > 1, the epidemic grows. If R₀ < 1, it dies out.
- The Black Death had an estimated R₀ of **2.5-5.0** depending on the transmission route (flea-borne vs. pneumonic).

📚 **Quarantine** works by reducing β (the contact rate). The word "quarantine" itself comes from the Italian *quarantina* — the 40-day isolation period Venice imposed on ships during plague outbreaks in 1377. This was one of the first public health interventions, and it worked because reducing contact reduces R₀.

📚 **Herd immunity** occurs when enough people are immune that the disease cannot spread: the threshold is **1 - 1/R₀**. For R₀ = 3, you need 67% immunity.`,
      analogy: 'An epidemic spreading along trade routes is like a rumor spreading through a chain of friends. Each infected person "tells" (infects) several others, who tell several more. The rumor spreads fastest through the most connected people (major trading cities). Quarantine is like telling everyone to stop talking for 40 days — the rumor dies if no one passes it on.',
      storyConnection: 'The Black Death is the dark side of the Silk Road story. The same trade networks that carried silk, spices, and ideas also carried plague-infected fleas on merchant ships and camel caravans. Kaffa (Crimea), a major Silk Road port, was besieged by Mongols who catapulted plague-infected corpses over the walls in 1346. Fleeing Genoese merchants carried the plague to Constantinople, then to Italy, then to all of Europe. Connectivity has costs.',
      checkQuestion: 'A city of 100,000 people has an outbreak with β = 0.4 (contact rate) and γ = 0.1 (recovery rate). What is R₀? What fraction of the population must be immune for herd immunity?',
      checkAnswer: 'R₀ = β/γ = 0.4/0.1 = 4.0. Herd immunity threshold = 1 - 1/R₀ = 1 - 1/4 = 0.75 or 75%. This means 75,000 of the 100,000 people must be immune (recovered or vaccinated) before the epidemic stops spreading. With R₀ = 4, this is a devastating epidemic.',
      codeIntro: 'Simulate the Black Death spreading along Silk Road trade routes using the SIR model, and see how quarantine changes the outcome.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def sir_model(S0, I0, R0, beta, gamma, days):
    """Simulate SIR epidemic model using Euler method"""
    N = S0 + I0 + R0
    S, I, R = np.zeros(days), np.zeros(days), np.zeros(days)
    S[0], I[0], R[0] = S0, I0, R0
    for d in range(1, days):
        dS = -beta * S[d-1] * I[d-1] / N
        dI = beta * S[d-1] * I[d-1] / N - gamma * I[d-1]
        dR = gamma * I[d-1]
        S[d] = max(0, S[d-1] + dS)
        I[d] = max(0, I[d-1] + dI)
        R[d] = max(0, R[d-1] + dR)
    return S, I, R

# Black Death parameters
population = 100000
initial_infected = 10
beta_normal = 0.35       # contact rate (no quarantine)
beta_quarantine = 0.12   # reduced contact rate (quarantine)
gamma = 0.1              # recovery/death rate (10-day infectious period)
days = 300

R0_normal = beta_normal / gamma
R0_quarantine = beta_quarantine / gamma

# Simulate both scenarios
S1, I1, R1 = sir_model(population - initial_infected, initial_infected, 0, beta_normal, gamma, days)
S2, I2, R2 = sir_model(population - initial_infected, initial_infected, 0, beta_quarantine, gamma, days)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# No quarantine
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(S1, color='#3b82f6', linewidth=2, label='Susceptible')
ax.plot(I1, color='#ef4444', linewidth=2, label='Infected')
ax.plot(R1, color='#22c55e', linewidth=2, label='Recovered/Dead')
ax.set_title(f'No Quarantine (R₀ = {R0_normal:.1f})', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Population', color='white')
ax.tick_params(colors='gray')

# With quarantine
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(S2, color='#3b82f6', linewidth=2, label='Susceptible')
ax.plot(I2, color='#ef4444', linewidth=2, label='Infected')
ax.plot(R2, color='#22c55e', linewidth=2, label='Recovered/Dead')
ax.set_title(f'With Quarantine (R₀ = {R0_quarantine:.1f})', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Population', color='white')
ax.tick_params(colors='gray')

# Compare infection peaks
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.fill_between(range(days), I1, alpha=0.4, color='#ef4444', label='No quarantine')
ax.fill_between(range(days), I2, alpha=0.4, color='#f59e0b', label='With quarantine')
ax.set_title('Infection Curves Compared', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Active infections', color='white')
ax.tick_params(colors='gray')

# R0 sensitivity
ax = axes[1, 1]
ax.set_facecolor('#111827')
r0_values = np.linspace(0.5, 6, 50)
final_infected_pct = []
for r0 in r0_values:
    b = r0 * gamma
    _, I_temp, R_temp = sir_model(population - 10, 10, 0, b, gamma, 500)
    final_infected_pct.append(R_temp[-1] / population * 100)

ax.plot(r0_values, final_infected_pct, color='#ef4444', linewidth=2)
ax.axvline(x=1.0, color='white', linestyle='--', alpha=0.5, label='R₀ = 1 threshold')
ax.axvline(x=R0_normal, color='#ef4444', linestyle=':', alpha=0.7, label=f'Black Death R₀≈{R0_normal:.1f}')
ax.set_xlabel('R₀ (basic reproduction number)', color='white')
ax.set_ylabel('% population eventually infected', color='white')
ax.set_title('Final Epidemic Size vs R₀', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

peak1, peak2 = np.max(I1), np.max(I2)
print(f"R₀ without quarantine: {R0_normal:.1f}")
print(f"R₀ with quarantine:    {R0_quarantine:.1f}")
print(f"Peak infections (no quarantine):   {peak1:,.0f} ({peak1/population*100:.1f}%)")
print(f"Peak infections (with quarantine): {peak2:,.0f} ({peak2/population*100:.1f}%)")
print(f"Herd immunity threshold: {(1 - 1/R0_normal)*100:.0f}%")
print(f"Quarantine reduced peak by {(1-peak2/peak1)*100:.0f}%")`,
      challenge: 'Add a multi-city model where plague spreads from Kaffa to Constantinople to Venice to Paris to London, with a travel delay between cities. Show how closing trade routes (reducing connectivity) slows the pandemic — but also halts trade.',
      successHint: 'The SIR model captures the essential dynamics of every epidemic in history. The Silk Road was a network optimized for connectivity — which makes it equally efficient at spreading disease. R₀ is the single most important number in epidemiology, and quarantine works by pushing it below 1.',
    },
    {
      title: 'Technology transfer speed — paper, gunpowder, compass to Europe',
      concept: `The Silk Road's most important cargo was not physical goods but **ideas and technology**. Three Chinese inventions — **paper** (105 CE), **gunpowder** (~850 CE), and the **magnetic compass** (~1040 CE) — transformed the world. But they took centuries to reach Europe.

Technology transfer timelines:
- **Paper**: invented 105 CE in China → reached Samarkand 751 CE → Baghdad 793 CE → Egypt 900 CE → Spain 1056 CE → England 1494 CE. Total: **~1,400 years** from China to England.
- **Gunpowder**: first recorded ~850 CE → Arab world ~1240 CE → Europe ~1280 CE. Total: **~430 years**.
- **Compass**: Chinese use ~1040 CE → Arab navigators ~1190 CE → European sailors ~1190 CE. Total: **~150 years**.

Why the acceleration? Each technology transferred faster than the last because:
1. **Trade networks expanded** (Mongol Empire unified the route 1206-1368)
2. **More intermediaries** meant more opportunities for knowledge to spread
3. **Demand pulled technology westward** — European states at war desperately wanted gunpowder
4. **Previous transfers built capacity** — paper enabled faster communication of later ideas

📚 We can model this as **diffusion** — the same mathematics that describes how a drop of ink spreads in water. The **diffusion rate** D describes how fast an innovation spreads: **distance² = 2 × D × time**. Higher D means faster spread.

📚 Modern technology transfer is nearly instant. The internet eliminated the Silk Road's bottleneck: physical transport of knowledge. A paper published in Beijing is readable in Boston within seconds.`,
      analogy: 'Technology transfer along the Silk Road was like passing a recipe through a chain of kitchens. Each cook learns the recipe from the previous one, perhaps improving it, perhaps losing some nuance. Paper took 1,400 years because each "kitchen" had to learn, adapt, and teach the next one. The internet is like giving everyone the recipe simultaneously.',
      storyConnection: 'The Silk Road was the internet of the ancient world — slow, unreliable, but transformative. Paper made the Silk Road faster (letters replaced messengers). Gunpowder reshaped every empire it reached. The compass made sea routes possible, eventually bypassing the overland Silk Road entirely. Each technology accelerated the transfer of the next, creating a positive feedback loop that ultimately ended the Silk Road by making it obsolete.',
      checkQuestion: 'Paper took 1,400 years to travel ~10,000 km from China to England. Gunpowder took 430 years for ~8,000 km. What is the effective "speed" of each technology transfer in km/year?',
      checkAnswer: 'Paper: 10,000 km / 1,400 years ≈ 7.1 km/year. Gunpowder: 8,000 km / 430 years ≈ 18.6 km/year. Gunpowder traveled 2.6x faster than paper. The compass was faster still (~53 km/year). Technology transfer accelerated over time as networks improved.',
      codeIntro: 'Model the diffusion of Chinese inventions along the Silk Road and visualize how transfer speed accelerated over centuries.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Historical technology transfer data
# (name, origin_year, data points: [(city, distance_km, arrival_year)])
technologies = {
    'Paper (105 CE)': {
        'origin': 105, 'color': '#3b82f6',
        'points': [("Xi'an", 0, 105), ('Samarkand', 3800, 751),
                   ('Baghdad', 5200, 793), ('Cairo', 6800, 900),
                   ('Fez', 8600, 1100), ('Spain', 9200, 1056),
                   ('Italy', 9500, 1276), ('England', 10000, 1494)]
    },
    'Gunpowder (~850 CE)': {
        'origin': 850, 'color': '#ef4444',
        'points': [("Xi'an", 0, 850), ('Samarkand', 3800, 1100),
                   ('Baghdad', 5200, 1240), ('Cairo', 6800, 1260),
                   ('Spain', 9200, 1270), ('England', 10000, 1280)]
    },
    'Compass (~1040 CE)': {
        'origin': 1040, 'color': '#22c55e',
        'points': [("Xi'an", 0, 1040), ('India', 4500, 1100),
                   ('Arab world', 6000, 1190), ('Italy', 8500, 1190),
                   ('England', 10000, 1200)]
    },
    'Printing (~1040 CE)': {
        'origin': 1040, 'color': '#f59e0b',
        'points': [("Xi'an", 0, 1040), ('Korea', 1500, 1234),
                   ('Persia', 5000, 1300), ('Germany', 9000, 1440),
                   ('England', 10000, 1476)]
    }
}

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(16, 6))
fig.patch.set_facecolor('#1f2937')

# Distance vs time for each technology
ax1.set_facecolor('#111827')
for name, tech in technologies.items():
    dists = [p[1] for p in tech['points']]
    years = [p[2] for p in tech['points']]
    ax1.plot(years, dists, 'o-', color=tech['color'], linewidth=2,
             markersize=5, label=name)
    for city, d, y in tech['points']:
        if city in ["Xi'an", 'England', 'Baghdad']:
            ax1.annotate(city, (y, d), color=tech['color'],
                        fontsize=6, textcoords="offset points",
                        xytext=(5, 5))

ax1.set_xlabel('Year CE', color='white')
ax1.set_ylabel('Distance from China (km)', color='white')
ax1.set_title('Technology Diffusion Along the Silk Road', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8, loc='upper left')
ax1.tick_params(colors='gray')

# Effective speed (km/year) for each technology
ax2.set_facecolor('#111827')
for name, tech in technologies.items():
    points = tech['points']
    speeds = []
    midpoints = []
    for i in range(1, len(points)):
        dd = points[i][1] - points[i-1][1]
        dt = points[i][2] - points[i-1][2]
        if dt > 0:
            speeds.append(dd / dt)
            midpoints.append((points[i][2] + points[i-1][2]) / 2)
    ax2.plot(midpoints, speeds, 's-', color=tech['color'], linewidth=2,
             markersize=6, label=name)

ax2.set_xlabel('Year CE', color='white')
ax2.set_ylabel('Transfer speed (km/year)', color='white')
ax2.set_title('How Fast Did Technology Travel?', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Overall transfer time comparison
ax3.set_facecolor('#111827')
tech_names_short = ['Paper', 'Gunpowder', 'Compass', 'Printing']
total_times = []
total_speeds = []
for name, tech in technologies.items():
    pts = tech['points']
    total_t = pts[-1][2] - pts[0][2]
    total_d = pts[-1][1]
    total_times.append(total_t)
    total_speeds.append(total_d / total_t if total_t > 0 else 0)

colors_bar = [t['color'] for t in technologies.values()]
bars = ax3.bar(tech_names_short, total_times, color=colors_bar)
ax3.set_ylabel('Years from China to Europe', color='white')
ax3.set_title('Total Transfer Time', color='white', fontsize=12)
ax3.tick_params(colors='gray')
plt.setp(ax3.get_xticklabels(), color='white')
for bar, t, s in zip(bars, total_times, total_speeds):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 20,
            f'{t} yrs\
{s:.0f} km/yr', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Technology transfer summary:")
for name, tech in technologies.items():
    pts = tech['points']
    total_t = pts[-1][2] - pts[0][2]
    total_d = pts[-1][1]
    speed = total_d / total_t if total_t > 0 else float('inf')
    print(f"  {name}: {total_d:,} km in {total_t} years = {speed:.1f} km/year")
print()
print("The acceleration is clear: later technologies spread faster.")
print("The Silk Road itself was a technology for spreading technology.")`,
      challenge: 'Add the internet to the plot: a technology that spreads ~10,000 km in ~5 years (1990-1995). Plot all five on the same axes and calculate how many times faster the internet diffused compared to paper.',
      successHint: 'Technology diffusion along the Silk Road followed a pattern: each innovation traveled faster than the last because the infrastructure for knowledge transfer was improving. Paper enabled faster spread of gunpowder recipes. Printing enabled faster spread of everything. The internet compressed millennia of diffusion into moments.',
    },
    {
      title: 'Network graph analysis — the Silk Road as a weighted graph',
      concept: `The Silk Road was not a single road but a **network** of interconnected routes spanning 7,000+ km. We can model it as a **weighted graph** — one of the most powerful tools in mathematics and computer science.

In graph theory:
- **Nodes** (vertices) are cities: Xi'an, Dunhuang, Kashgar, Samarkand, Merv, Baghdad, Constantinople, Rome, and dozens of others
- **Edges** are trade routes between cities, weighted by **distance** (km) or **travel time** (days)
- **Degree** of a node = number of routes passing through it
- **Betweenness centrality** = how often a city appears on shortest paths between all pairs of other cities

Key cities had high **centrality** — meaning most trade had to pass through them:
- **Samarkand** connected the Chinese, Indian, and Persian branches
- **Palmyra** connected the Persian and Mediterranean branches
- **Constantinople** controlled the gateway between Asia and Europe

📚 **Dijkstra's algorithm** finds the shortest (cheapest, fastest) path between any two nodes in a weighted graph. It is the same algorithm your GPS uses to find the best driving route. On the Silk Road, merchants implicitly solved this problem: which sequence of cities minimizes my travel time or cost?

📚 **Network robustness**: if a key node is destroyed (by war, plague, or politics), the network may be disconnected. The fall of Palmyra in 273 CE disrupted Mediterranean trade for decades. The Mongol destruction of Baghdad in 1258 rerouted the entire western Silk Road.

📚 The internet is also a graph. Router failures are analogous to Silk Road city destructions — and modern networks are designed with **redundancy** to avoid single points of failure.`,
      analogy: 'The Silk Road graph is like an airline route map. Major hubs (like Samarkand) are like Atlanta or Dubai — not necessarily the origin or destination, but the place where routes converge. If the hub shuts down, everyone is stranded. Betweenness centrality measures exactly how "hub-like" a city is.',
      storyConnection: 'The Silk Road story is ultimately a story about network topology. Why did some cities become wealthy beyond imagination (Samarkand, Constantinople) while others remained small? Because network centrality — being on the path between everyone else — is the geography of power. When the Mongols unified the network under one authority, trade flourished. When key nodes fell, entire branches of the network went dark.',
      checkQuestion: 'In a network of 5 cities (A-B-C-D-E) connected in a line, which city has the highest betweenness centrality? What happens to the network if that city is destroyed?',
      checkAnswer: 'City C (the middle one) has the highest betweenness centrality because all paths from the A-B side to the D-E side must pass through C. If C is destroyed, the network splits into two disconnected components (A-B and D-E) with no trade possible between them. This is why controlling the center of the Silk Road meant controlling Eurasian trade.',
      codeIntro: 'Build the Silk Road as a weighted graph, find shortest paths, calculate centrality, and simulate what happens when key cities are destroyed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Silk Road as a weighted graph (cities and distances in km)
cities = ["Xi'an", 'Lanzhou', 'Dunhuang', 'Kashgar', 'Samarkand',
          'Merv', 'Baghdad', 'Palmyra', 'Antioch', 'Constantinople',
          'Rome', 'Alexandria', 'Kabul', 'Taxila']

n = len(cities)

# Adjacency matrix (0 = no direct route, positive = distance in km)
adj = np.zeros((n, n))
edges = [
    (0,1,600), (1,2,1100), (2,3,1500), (3,4,700),   # Xi'an to Samarkand
    (4,5,400), (5,6,900), (6,7,750), (7,8,300),      # Samarkand to Antioch
    (8,9,1000), (9,10,1400),                           # Antioch to Rome
    (6,11,1200), (3,12,700), (12,13,250),              # branches
    (4,12,1100), (5,12,800), (7,11,800),               # cross-connections
    (9,11,1000),                                        # Constantinople-Alexandria
]
for i, j, d in edges:
    adj[i][j] = d
    adj[j][i] = d

# Dijkstra's shortest path
def dijkstra(adj, start):
    n = len(adj)
    dist = np.full(n, np.inf)
    dist[start] = 0
    prev = np.full(n, -1, dtype=int)
    visited = np.zeros(n, dtype=bool)
    for _ in range(n):
        u = -1
        for v in range(n):
            if not visited[v] and (u == -1 or dist[v] < dist[u]):
                u = v
        if dist[u] == np.inf:
            break
        visited[u] = True
        for v in range(n):
            if adj[u][v] > 0 and dist[u] + adj[u][v] < dist[v]:
                dist[v] = dist[u] + adj[u][v]
                prev[v] = u
    return dist, prev

def get_path(prev, target):
    path = []
    current = target
    while current != -1:
        path.append(current)
        current = prev[current]
    return path[::-1]

# Betweenness centrality (simplified)
centrality = np.zeros(n)
for s in range(n):
    dist_s, prev_s = dijkstra(adj, s)
    for t in range(n):
        if s != t and dist_s[t] < np.inf:
            path = get_path(prev_s, t)
            for node in path[1:-1]:  # exclude endpoints
                centrality[node] += 1
# Normalize
max_pairs = (n-1) * (n-2)
if max_pairs > 0:
    centrality = centrality / max_pairs

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
fig.patch.set_facecolor('#1f2937')

# Network visualization (using positions)
ax1.set_facecolor('#111827')
positions = {
    0:(2,5), 1:(4,5.5), 2:(6,6), 3:(8,6.5), 4:(10,6),
    5:(11,5), 6:(12,3.5), 7:(12,5), 8:(13,5.5), 9:(14,5),
    10:(15,4), 11:(13,2.5), 12:(9,4), 13:(9,3)
}

# Draw edges
for i, j, d in edges:
    x = [positions[i][0], positions[j][0]]
    y = [positions[i][1], positions[j][1]]
    ax1.plot(x, y, '-', color='#4b5563', linewidth=1, alpha=0.6)

# Draw nodes (size = centrality)
for i in range(n):
    size = 100 + centrality[i] * 2000
    color_val = plt.cm.YlOrRd(centrality[i] / max(centrality) if max(centrality) > 0 else 0)
    ax1.scatter(*positions[i], s=size, c=[color_val], edgecolors='white',
               linewidth=1, zorder=5)
    ax1.annotate(cities[i], positions[i], color='white', fontsize=7,
                ha='center', va='bottom', textcoords="offset points", xytext=(0,8))

# Highlight shortest path Xi'an to Rome
dist_xr, prev_xr = dijkstra(adj, 0)
path_xr = get_path(prev_xr, 10)
for k in range(len(path_xr)-1):
    x = [positions[path_xr[k]][0], positions[path_xr[k+1]][0]]
    y = [positions[path_xr[k]][1], positions[path_xr[k+1]][1]]
    ax1.plot(x, y, '-', color='#f59e0b', linewidth=3, alpha=0.8)

ax1.set_title("Silk Road Network (shortest Xi'an→Rome in gold)", color='white', fontsize=12)
ax1.set_xlim(0, 17)
ax1.set_ylim(1, 8)
ax1.axis('off')

# Centrality bar chart
ax2.set_facecolor('#111827')
sorted_idx = np.argsort(centrality)[::-1]
sorted_names = [cities[i] for i in sorted_idx]
sorted_cent = centrality[sorted_idx]
colors_cent = plt.cm.YlOrRd(sorted_cent / max(sorted_cent) if max(sorted_cent) > 0 else sorted_cent)
ax2.barh(range(n), sorted_cent, color=colors_cent)
ax2.set_yticks(range(n))
ax2.set_yticklabels(sorted_names, color='white', fontsize=9)
ax2.set_xlabel('Betweenness Centrality', color='white')
ax2.set_title('Which Cities Control the Silk Road?', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.invert_yaxis()

plt.tight_layout()
plt.show()

# Results
path_names = [cities[i] for i in path_xr]
print(f"Shortest path Xi'an to Rome: {' → '.join(path_names)}")
print(f"Total distance: {dist_xr[10]:,.0f} km")
print()
print("Betweenness centrality (who controls the network):")
for i in sorted_idx[:5]:
    print(f"  {cities[i]:18s}: {centrality[i]:.3f}")
print()
# Simulate removing highest-centrality city
top_city = sorted_idx[0]
adj_broken = adj.copy()
adj_broken[top_city, :] = 0
adj_broken[:, top_city] = 0
dist_b, _ = dijkstra(adj_broken, 0)
if dist_b[10] == np.inf:
    print(f"If {cities[top_city]} is destroyed: Xi'an-Rome route BROKEN")
else:
    print(f"If {cities[top_city]} is destroyed: new distance = {dist_b[10]:,.0f} km (was {dist_xr[10]:,.0f})")`,
      challenge: 'Add a "Mongol Empire" scenario: add direct edges Kashgar→Merv (skipping Samarkand) and Baghdad→Constantinople (new route). Recalculate shortest paths and centrality. How does network redundancy change which cities hold power?',
      successHint: 'Graph theory reveals the hidden structure of the Silk Road. Centrality explains why Samarkand and Baghdad became some of the wealthiest cities in history — not because of what they produced, but because of where they sat in the network. The same mathematics now governs internet routing, social networks, and supply chain optimization.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior economics or graph theory experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for trade economics, epidemic modeling, and network analysis. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
