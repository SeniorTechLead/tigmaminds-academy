import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MarketDayLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Supply and demand — why market prices change',
      concept: `On market day, the price of mangoes rises in the afternoon. Why? More people arrive (demand up) but the farmer's mangoes are running low (supply down). This is **supply and demand** — the most fundamental concept in economics.

**Demand curve**: as price goes UP, quantity demanded goes DOWN (people buy less). Slopes downward.
**Supply curve**: as price goes UP, quantity supplied goes UP (sellers produce more). Slopes upward.

The **equilibrium price** is where the two curves cross — the price where the quantity people want to buy exactly equals the quantity sellers want to sell.

If the price is ABOVE equilibrium: surplus (too much supply) → price falls.
If the price is BELOW equilibrium: shortage (too much demand) → price rises.

Markets naturally tend toward equilibrium — like a ball rolling to the bottom of a bowl. This is Adam Smith's "invisible hand."`,
      analogy: 'Supply and demand is like a seesaw. If one side (demand) goes up, the fulcrum (price) shifts. If the other side (supply) goes up, the fulcrum shifts back. Equilibrium is when the seesaw is balanced. Markets are always adjusting, always seeking balance.',
      storyConnection: 'On market day, the village farmer sets prices based on how many people show up and how much produce they have. When the festival crowd arrives, prices go up. When the monsoon delivers a bumper crop, prices go down. The farmer is intuitively tracing supply and demand curves without ever seeing a graph.',
      checkQuestion: 'A drought destroys half the rice crop. What happens to rice prices? Who benefits and who suffers?',
      checkAnswer: 'The supply curve shifts LEFT (less rice available at every price). The equilibrium price rises. Farmers who still have rice benefit (higher prices). Consumers suffer (pay more, might not afford enough). The poorest are hit hardest because rice is a larger share of their budget. This is why droughts cause not just hunger but economic crises.',
      codeIntro: 'Plot supply and demand curves and find the market equilibrium.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Demand: Qd = 100 - 2P (linear, slopes down)
# Supply: Qs = -20 + 3P (linear, slopes up)
price = np.linspace(0, 50, 200)
demand = 100 - 2 * price
supply = -20 + 3 * price

# Equilibrium: Qd = Qs -> 100 - 2P = -20 + 3P -> P = 24, Q = 52
eq_price = 24
eq_quantity = 52

# Shifted supply (drought)
supply_drought = -50 + 3 * price
eq_price_drought = 30
eq_quantity_drought = 40

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Normal market
ax1.set_facecolor('#111827')
ax1.plot(demand, price, color='#3b82f6', linewidth=2, label='Demand')
ax1.plot(supply, price, color='#22c55e', linewidth=2, label='Supply')
ax1.plot(eq_quantity, eq_price, 'o', color='#f59e0b', markersize=12, zorder=5)
ax1.annotate(f'Equilibrium\
P=₹{eq_price}, Q={eq_quantity}kg', xy=(eq_quantity, eq_price),
             xytext=(eq_quantity+15, eq_price+5), color='#f59e0b', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax1.set_xlabel('Quantity (kg)', color='white')
ax1.set_ylabel('Price (₹/kg)', color='white')
ax1.set_title('Normal Market Day', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 100)
ax1.set_ylim(0, 50)

# After drought
ax2.set_facecolor('#111827')
ax2.plot(demand, price, color='#3b82f6', linewidth=2, label='Demand (unchanged)')
ax2.plot(supply, price, color='#22c55e', linewidth=1, linestyle='--', alpha=0.5, label='Old supply')
ax2.plot(supply_drought, price, color='#ef4444', linewidth=2, label='New supply (drought)')
ax2.plot(eq_quantity_drought, eq_price_drought, 'o', color='#f59e0b', markersize=12, zorder=5)
ax2.annotate(f'New equilibrium\
P=₹{eq_price_drought}, Q={eq_quantity_drought}kg',
             xy=(eq_quantity_drought, eq_price_drought),
             xytext=(eq_quantity_drought+15, eq_price_drought+5), color='#f59e0b', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.set_xlabel('Quantity (kg)', color='white')
ax2.set_ylabel('Price (₹/kg)', color='white')
ax2.set_title('After Drought: Supply Shock', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 100)
ax2.set_ylim(0, 50)

plt.tight_layout()
plt.show()

print("Normal market day:")
print(f"  Equilibrium: ₹{eq_price}/kg, {eq_quantity} kg sold")
print(f"After drought:")
print(f"  New equilibrium: ₹{eq_price_drought}/kg, {eq_quantity_drought} kg sold")
print(f"  Price increased by ₹{eq_price_drought - eq_price} ({(eq_price_drought/eq_price - 1)*100:.0f}%)")
print(f"  Quantity decreased by {eq_quantity - eq_quantity_drought} kg ({(1 - eq_quantity_drought/eq_quantity)*100:.0f}%)")`,
      challenge: 'What if the government sets a maximum price of ₹20/kg (price ceiling) during the drought? Calculate the shortage (demand at ₹20 minus supply at ₹20). This is why price controls during crises are controversial.',
      successHint: 'Supply and demand is the grammar of economics. Every price you see — from rice at the market to gasoline at the pump — is the result of these two curves meeting. Understanding them is understanding how the world allocates scarce resources.',
    },
    {
      title: 'Comparative advantage — why trade makes everyone richer',
      concept: `In the market, the farmer sells rice and buys cloth. The weaver sells cloth and buys rice. Why don't they each make everything themselves? Because of **comparative advantage**.

Even if the farmer is BETTER at making both rice AND cloth than the weaver, it still makes sense to specialize. What matters is **opportunity cost** — what you give up to produce something.

Example:
- Farmer: can make 10kg rice OR 5m cloth per day
- Weaver: can make 4kg rice OR 8m cloth per day

Opportunity costs:
- Farmer: 1kg rice costs 0.5m cloth (give up 5m to make 10kg)
- Weaver: 1kg rice costs 2m cloth (give up 8m to make 4kg)

The farmer has lower opportunity cost for rice → comparative advantage in rice.
The weaver has lower opportunity cost for cloth → comparative advantage in cloth.

If each specializes and they trade, BOTH get more than they would alone. This is David Ricardo's insight (1817), and it's why markets and international trade exist.`,
      analogy: 'Comparative advantage is like two chefs in a kitchen. Chef A is better at everything — chopping AND cooking. But Chef A is much FASTER at cooking than chopping (relative to Chef B). So Chef A should cook and Chef B should chop. Even though B is slower at everything, specializing based on relative strength makes the whole kitchen more productive.',
      storyConnection: 'The market day brings together the farmer, the weaver, the potter, and the fisherman. Each specializes in what they do relatively best and trades for the rest. The market isn\'t just a place to buy things — it\'s a mechanism that allows specialization and comparative advantage to make the whole village richer.',
      checkQuestion: 'If China can make EVERYTHING cheaper than India, why does India still export things to China?',
      checkAnswer: 'Because trade is based on COMPARATIVE advantage, not ABSOLUTE advantage. Even if China is cheaper at everything, there are some goods where India\'s cost disadvantage is smallest (e.g., IT services, pharmaceuticals). India should specialize in those. China should specialize in goods where its advantage is LARGEST. Both countries end up better off than if they tried to make everything domestically.',
      codeIntro: 'Demonstrate comparative advantage: how specialization and trade expand what\'s possible.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Production Possibility Frontiers (PPF)
# Farmer: 10 rice or 5 cloth (or any combination)
# Weaver: 4 rice or 8 cloth

farmer_rice_max = 10
farmer_cloth_max = 5
weaver_rice_max = 4
weaver_cloth_max = 8

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

# Individual PPFs
for ax, rice_max, cloth_max, name, color in [
    (ax1, farmer_rice_max, farmer_cloth_max, 'Farmer', '#22c55e'),
    (ax1, weaver_rice_max, weaver_cloth_max, 'Weaver', '#3b82f6')]:
    rice = np.linspace(0, rice_max, 100)
    cloth = cloth_max * (1 - rice / rice_max)
    ax.set_facecolor('#111827')
    ax.plot(rice, cloth, linewidth=2, color=color, label=name)
    ax.fill_between(rice, cloth, alpha=0.1, color=color)

ax1.set_xlabel('Rice (kg)', color='white')
ax1.set_ylabel('Cloth (m)', color='white')
ax1.set_title('Individual Production Possibilities', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Without trade: each makes half and half
farmer_rice_self = 5; farmer_cloth_self = 2.5
weaver_rice_self = 2; weaver_cloth_self = 4
total_rice_self = farmer_rice_self + weaver_rice_self
total_cloth_self = farmer_cloth_self + weaver_cloth_self

ax2.set_facecolor('#111827')
ax2.bar(['Rice', 'Cloth'], [total_rice_self, total_cloth_self], color=['#22c55e', '#3b82f6'], width=0.5)
ax2.set_title(f'Without Trade: Self-Sufficiency', color='white', fontsize=12)
ax2.set_ylabel('Total output', color='white')
ax2.tick_params(colors='gray')
for i, v in enumerate([total_rice_self, total_cloth_self]):
    ax2.text(i, v + 0.2, f'{v}', ha='center', color='white', fontsize=12)

# With trade: specialize based on comparative advantage
farmer_rice_trade = 10; farmer_cloth_trade = 0  # all rice
weaver_rice_trade = 0; weaver_cloth_trade = 8   # all cloth
total_rice_trade = farmer_rice_trade + weaver_rice_trade
total_cloth_trade = farmer_cloth_trade + weaver_cloth_trade

ax3.set_facecolor('#111827')
ax3.bar(['Rice', 'Cloth'], [total_rice_trade, total_cloth_trade], color=['#22c55e', '#3b82f6'], width=0.5)
ax3.set_title(f'With Trade: Specialization', color='white', fontsize=12)
ax3.set_ylabel('Total output', color='white')
ax3.tick_params(colors='gray')
for i, v in enumerate([total_rice_trade, total_cloth_trade]):
    ax3.text(i, v + 0.2, f'{v}', ha='center', color='white', fontsize=12)

# Gains from trade
ax3.text(0.5, 11, f'+{total_rice_trade-total_rice_self} rice, +{total_cloth_trade-total_cloth_self:.1f} cloth!',
         transform=ax3.transData, color='#f59e0b', fontsize=11, ha='center', fontweight='bold')

plt.tight_layout()
plt.show()

print("Without trade (self-sufficiency):")
print(f"  Total: {total_rice_self}kg rice + {total_cloth_self}m cloth")
print(f"With trade (specialization):")
print(f"  Total: {total_rice_trade}kg rice + {total_cloth_trade}m cloth")
print(f"Gains from trade:")
print(f"  +{total_rice_trade-total_rice_self}kg rice ({(total_rice_trade/total_rice_self-1)*100:.0f}% more)")
print(f"  +{total_cloth_trade-total_cloth_self:.1f}m cloth ({(total_cloth_trade/total_cloth_self-1)*100:.0f}% more)")
print()
print("BOTH the farmer and weaver end up with more of everything.")
print("This is the magic of comparative advantage.")`,
      challenge: 'What if a road is built connecting the village to a city, reducing trade costs? Model this by allowing the farmer to trade rice for cloth at a better exchange rate. How does cheaper trade affect total village output?',
      successHint: 'Comparative advantage is why markets exist, why countries trade, and why specialization makes everyone better off. The village market is a miniature version of the global economy.',
    },
    {
      title: 'Money — from barter to currency',
      concept: `Before money, markets used **barter** — direct exchange of goods. Barter has a critical problem: the **double coincidence of wants**. The farmer wants cloth, but the weaver wants pottery, not rice. The farmer needs to find someone who has cloth AND wants rice.

Money solves this by serving three functions:
1. **Medium of exchange**: everyone accepts it, so you don't need a double coincidence
2. **Unit of account**: a common measure for comparing values (1 cloth = 5 rice = ₹50)
3. **Store of value**: you can save it for later (rice rots; money doesn't)

Historical money forms:
- **Cowrie shells** (used across Asia and Africa for thousands of years)
- **Salt** (Roman soldiers were paid in salt — origin of "salary")
- **Gold/silver coins** (standardized by Lydia, ~600 BCE)
- **Paper money** (China, ~1000 CE)
- **Digital money** (today)

Money is a **social technology** — it works because everyone agrees it works.`,
      analogy: 'Money is like a universal translator. In a barter economy, you need to speak every language (know the exchange rate for every pair of goods). Money translates everything into one language: price. Instead of knowing "how many fish per basket of rice," you just know "rice = ₹40/kg, fish = ₹200/kg." One language instead of thousands.',
      storyConnection: 'In the story, the market starts with barter — the farmer trades rice directly for cloth. But as the market grows, a wise elder introduces cowrie shells as money. Suddenly, trade becomes faster and more complex. More people participate, more goods are available, and the market thrives. Money didn\'t create wealth — it lubricated the exchange of wealth.',
      checkQuestion: 'Bitcoin is a form of money. Which of the three functions of money does it perform well, and which does it perform poorly?',
      checkAnswer: 'Medium of exchange: poor (slow transactions, high fees, few merchants accept it). Unit of account: very poor (prices in Bitcoin fluctuate wildly — a coffee might cost 0.0001 BTC today and 0.0002 BTC tomorrow). Store of value: debatable (it has appreciated enormously long-term, but crashes 50%+ regularly). Bitcoin is currently more like digital gold (speculative asset) than money in the economic sense.',
      codeIntro: 'Simulate a barter economy vs. a money economy and measure trade efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a village with 20 people, each producing one good and wanting another
n_people = 20
n_goods = 5  # rice, cloth, pottery, fish, firewood

# Each person produces one good and wants one other good
produces = np.random.randint(0, n_goods, n_people)
wants = np.random.randint(0, n_goods, n_people)
# Make sure no one wants what they produce
for i in range(n_people):
    while wants[i] == produces[i]:
        wants[i] = np.random.randint(0, n_goods)

# BARTER: count successful trades (need double coincidence of wants)
barter_trades = 0
barter_rounds = 50
for _ in range(barter_rounds):
    for i in range(n_people):
        for j in range(i+1, n_people):
            # i has what j wants AND j has what i wants
            if produces[i] == wants[j] and produces[j] == wants[i]:
                barter_trades += 1

# MONEY: everyone can trade (sell for money, buy with money)
money_trades = 0
money_rounds = 50
for _ in range(money_rounds):
    # Each person sells their good for money, then buys what they want
    # As long as someone produces what you want, trade happens
    for i in range(n_people):
        if any(produces[j] == wants[i] for j in range(n_people) if j != i):
            money_trades += 1

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Trade comparison
ax1.set_facecolor('#111827')
ax1.bar(['Barter', 'Money'], [barter_trades, money_trades],
        color=['#ef4444', '#22c55e'], width=0.5)
ax1.set_ylabel('Successful trades', color='white')
ax1.set_title('Barter vs. Money Economy', color='white', fontsize=13)
ax1.tick_params(colors='gray')
for i, v in enumerate([barter_trades, money_trades]):
    ax1.text(i, v + 10, str(v), ha='center', color='white', fontsize=14, fontweight='bold')

# Network visualization: barter creates sparse connections, money creates dense ones
ax2.set_facecolor('#111827')
theta = np.linspace(0, 2 * np.pi, n_people, endpoint=False)
x = np.cos(theta)
y = np.sin(theta)

# Draw barter connections (only double coincidences)
barter_edges = 0
for i in range(n_people):
    for j in range(i+1, n_people):
        if produces[i] == wants[j] and produces[j] == wants[i]:
            ax2.plot([x[i], x[j]], [y[i], y[j]], color='#ef4444', alpha=0.5, linewidth=1)
            barter_edges += 1

# Draw money connections (anyone can trade with anyone)
for i in range(min(n_people, 10)):
    for j in range(i+1, min(n_people, 10)):
        ax2.plot([x[i], x[j]], [y[i], y[j]], color='#22c55e', alpha=0.05, linewidth=0.5)

ax2.scatter(x, y, c='white', s=80, zorder=5)
ax2.set_title(f'Trade Networks: Barter ({barter_edges} links) vs Money', color='white', fontsize=12)
ax2.set_xlim(-1.5, 1.5)
ax2.set_ylim(-1.5, 1.5)
ax2.set_aspect('equal')
ax2.axis('off')

plt.tight_layout()
plt.show()

print(f"With {n_people} people and {n_goods} goods:")
print(f"  Barter: {barter_trades} trades over {barter_rounds} rounds")
print(f"  Money:  {money_trades} trades over {money_rounds} rounds")
print(f"  Money is {money_trades/max(barter_trades,1):.1f}x more efficient")
print()
print("The double coincidence problem cripples barter.")
print("Money doesn't create value — it removes friction from exchange.")`,
      challenge: 'Increase n_goods from 5 to 20. How does the barter-to-money efficiency ratio change? As the economy becomes more complex (more goods), does money become MORE or LESS important?',
      successHint: 'Money is one of humanity\'s most important inventions. It enabled specialization, trade, and the complex economies that support billions of people. The village market\'s transition from barter to currency mirrors humanity\'s economic evolution.',
    },
    {
      title: 'Elasticity — why some prices matter more than others',
      concept: `Not all goods respond the same way to price changes. **Price elasticity of demand** measures how much quantity demanded changes when price changes.

**Elasticity = % change in quantity demanded / % change in price**

- **Elastic (> 1)**: luxury goods, things with substitutes. Price goes up 10% → demand drops more than 10%. (Example: brand-name shoes — people switch to cheaper brands)
- **Inelastic (< 1)**: necessities, things without substitutes. Price goes up 10% → demand drops less than 10%. (Example: rice in a rice-eating village — people can't easily switch)
- **Unit elastic (= 1)**: rare, but the dividing line

Why it matters for the market:
- If a farmer raises the price of a NECESSITY (rice), they earn MORE money (demand barely drops)
- If a potter raises the price of a LUXURY (decorative vases), they earn LESS money (demand drops sharply)

Elasticity determines who has pricing power in a market.`,
      analogy: 'Elasticity is like a rubber band. An elastic good stretches a lot when you pull (price up = demand way down). An inelastic good barely stretches (price up = demand barely moves). Medicine is like a steel rod (totally inelastic) — you\'ll pay whatever it costs. Fashion is like a bungee cord (very elastic) — raise the price and customers bounce away.',
      storyConnection: 'On market day, the rice seller raises prices and still sells everything. The silk merchant raises prices and watches customers walk away. The rice seller has a product with low elasticity (necessity). The silk merchant has a product with high elasticity (luxury). The market teaches this lesson to every vendor.',
      checkQuestion: 'Gasoline prices spike by 50%. People still drive to work. Why is gasoline inelastic in the short run but more elastic in the long run?',
      checkAnswer: 'Short run: people can\'t immediately change their commute, sell their car, or move closer to work. They MUST buy gas at any price. Long run: people buy more fuel-efficient cars, take public transit, move closer to work, or switch to electric vehicles. Elasticity increases over time as substitutes become available. This is why gas price spikes don\'t reduce consumption immediately but do shift behavior over years.',
      codeIntro: 'Calculate and visualize price elasticity for different goods at the village market.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Demand curves for different goods
price = np.linspace(1, 100, 200)

# Elastic demand (luxury): Q = 1000 * P^(-2)
luxury_q = 1000 * price ** (-2)

# Inelastic demand (necessity): Q = 100 * P^(-0.3)
necessity_q = 100 * price ** (-0.3)

# Unit elastic: Q = 500 * P^(-1)
unit_q = 500 * price ** (-1)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Demand curves
ax1.set_facecolor('#111827')
ax1.plot(luxury_q, price, color='#a855f7', linewidth=2, label='Luxury (elastic, ε=2)')
ax1.plot(unit_q, price, color='#f59e0b', linewidth=2, label='Moderate (unit elastic, ε=1)')
ax1.plot(necessity_q, price, color='#22c55e', linewidth=2, label='Necessity (inelastic, ε=0.3)')
ax1.set_xlabel('Quantity demanded', color='white')
ax1.set_ylabel('Price (₹)', color='white')
ax1.set_title('Demand Curves: Different Elasticities', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 50)

# Revenue when price changes
prices_test = np.linspace(10, 80, 50)
revenue_luxury = prices_test * 1000 * prices_test ** (-2)
revenue_necessity = prices_test * 100 * prices_test ** (-0.3)
revenue_unit = prices_test * 500 * prices_test ** (-1)

ax2.set_facecolor('#111827')
ax2.plot(prices_test, revenue_luxury, color='#a855f7', linewidth=2, label='Luxury: revenue FALLS with price')
ax2.plot(prices_test, revenue_necessity, color='#22c55e', linewidth=2, label='Necessity: revenue RISES with price')
ax2.plot(prices_test, revenue_unit, color='#f59e0b', linewidth=2, linestyle='--', label='Unit elastic: revenue CONSTANT')
ax2.set_xlabel('Price (₹)', color='white')
ax2.set_ylabel('Total revenue (₹)', color='white')
ax2.set_title('Revenue vs. Price: Elasticity Determines Strategy', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Market day pricing strategies:")
print("  Rice seller (inelastic): raise prices -> earn MORE (people still buy)")
print("  Silk vendor (elastic): raise prices -> earn LESS (people stop buying)")
print("  The elasticity tells you which direction to push prices")
print()
print("Real-world elasticities:")
print("  Salt: 0.1 (extremely inelastic — you need it regardless)")
print("  Rice: 0.4 (inelastic in rice-eating cultures)")
print("  Restaurant meals: 1.5 (elastic — cook at home instead)")
print("  Luxury watches: 2.5+ (very elastic — skip the purchase)")`,
      challenge: 'The government taxes rice at 20%. Who bears the burden — the farmer or the consumer? (Hint: with inelastic demand, the consumer bears most of the tax because they keep buying.) Model this with the inelastic demand curve.',
      successHint: 'Elasticity is the hidden force behind every pricing decision. Understanding it explains why medicine is expensive, why luxury brands limit supply, and why governments tax cigarettes (inelastic) to raise revenue without reducing consumption much.',
    },
    {
      title: 'Inflation — when prices rise everywhere',
      concept: `On market day, everything costs more than last year. The farmer's rice, the weaver's cloth, the potter's pots — all up by about 10%. This is **inflation**: a general rise in the price level across the economy.

Causes of inflation:
- **Demand-pull**: too much money chasing too few goods (everyone has more cash, prices rise)
- **Cost-push**: input costs rise, pushing all prices up (oil price spike → transport costs → everything costs more)
- **Monetary expansion**: government prints more money → each unit buys less

Measuring inflation: **CPI (Consumer Price Index)** — track the price of a "basket" of typical goods over time.

Inflation isn't always bad:
- **Low inflation (2-3%)**: sign of a healthy, growing economy
- **High inflation (10%+)**: erodes savings, hurts the poor, creates uncertainty
- **Hyperinflation (50%+ per month)**: economy collapses (Zimbabwe 2008: 79.6 billion % per month)
- **Deflation (negative)**: can be worse — people delay purchases, businesses cut jobs, downward spiral`,
      analogy: 'Inflation is like a shrinking ruler. If every ruler in the world shrank by 10%, everything would "measure" as bigger — but nothing actually changed size. Inflation doesn\'t make things worth more; it makes money worth less. The real question is always: can my wages buy more or fewer goods than before?',
      storyConnection: 'The market elder remembers when a sack of rice cost ₹10. Now it costs ₹200. Has rice become 20× more valuable? No — the rupee has become 20× less valuable. Inflation over decades transforms the numbers on price tags while the real economy underneath stays more stable.',
      checkQuestion: 'If inflation is 10% and your salary increases by 8%, are you richer or poorer than last year?',
      checkAnswer: 'Poorer. Your "nominal" salary went up 8%, but prices went up 10%. Your "real" salary (purchasing power) decreased by about 2%. You can buy less with your paycheck than you could a year ago. This is why economists always distinguish between nominal values (the number on the check) and real values (what you can actually buy).',
      codeIntro: 'Track inflation in a village market over 20 years and see how purchasing power erodes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(2005, 2026)
n_years = len(years)

# Nominal prices of market goods (₹)
rice_price = 20 * (1.07) ** (years - 2005)  # 7% annual inflation
cloth_price = 50 * (1.07) ** (years - 2005)
fish_price = 80 * (1.07) ** (years - 2005)

# Wages
nominal_wage = 200 * (1.05) ** (years - 2005)  # wages grow slower (5%)

# Real wage (purchasing power in 2005 rupees)
cpi = (1.07) ** (years - 2005)
real_wage = nominal_wage / cpi

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Price trends
ax1.set_facecolor('#111827')
ax1.plot(years, rice_price, color='#22c55e', linewidth=2, label='Rice (₹/kg)')
ax1.plot(years, cloth_price, color='#3b82f6', linewidth=2, label='Cloth (₹/m)')
ax1.plot(years, fish_price, color='#ef4444', linewidth=2, label='Fish (₹/kg)')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Price (₹)', color='white')
ax1.set_title('Market Prices Over 20 Years (7% inflation)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Nominal vs real wages
ax2.set_facecolor('#111827')
ax2.plot(years, nominal_wage, color='#f59e0b', linewidth=2, label='Nominal daily wage (₹)')
ax2.plot(years, real_wage, color='#ef4444', linewidth=2, label='Real wage (2005 ₹)')
ax2.fill_between(years, real_wage, nominal_wage, alpha=0.1, color='#ef4444')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Daily wage (₹)', color='white')
ax2.set_title('The Inflation Gap: Nominal vs Real Wages', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

ax2.annotate('Purchasing power\
DECLINES even as\
nominal wage rises',
             xy=(2018, (nominal_wage[13] + real_wage[13])/2),
             color='#ef4444', fontsize=10, ha='center')

plt.tight_layout()
plt.show()

print("After 20 years of 7% inflation:")
print(f"  Rice: ₹{rice_price[0]:.0f} -> ₹{rice_price[-1]:.0f} (+{(rice_price[-1]/rice_price[0]-1)*100:.0f}%)")
print(f"  Nominal wage: ₹{nominal_wage[0]:.0f} -> ₹{nominal_wage[-1]:.0f} (+{(nominal_wage[-1]/nominal_wage[0]-1)*100:.0f}%)")
print(f"  Real wage: ₹{real_wage[0]:.0f} -> ₹{real_wage[-1]:.0f} ({(real_wage[-1]/real_wage[0]-1)*100:.0f}%)")
print()
print("The nominal wage TRIPLED but real purchasing power FELL by a third.")
print("This is why inflation matters — especially for the poor.")`,
      challenge: 'What inflation rate would wages need to match (5% growth rate = what inflation rate means no real wage loss)? Now model hyperinflation at 100% per year. How quickly does the real wage collapse?',
      successHint: 'Inflation is the silent tax. Understanding the difference between nominal and real values is essential for anyone who earns, saves, or spends money — which is everyone. The village market teaches this lesson every year as prices creep upward.',
    },
    {
      title: 'Market failures — when markets don\'t work',
      concept: `Markets are powerful, but they fail in predictable ways. **Market failure** occurs when the free market doesn't allocate resources efficiently.

Types of market failure:
1. **Externalities**: costs/benefits that affect people outside the transaction
   - Negative: factory pollution harms villagers (cost not paid by factory)
   - Positive: a beekeeper's bees pollinate neighbors' crops (benefit not paid for)

2. **Public goods**: non-excludable (can't prevent use) and non-rivalrous (one person's use doesn't reduce another's). Example: clean air, streetlights, national defense. Markets won't provide them because no one will pay if they can free-ride.

3. **Information asymmetry**: one party knows more than the other. The used-car seller knows the car's flaws; the buyer doesn't. This leads to **adverse selection** — the market fills with lemons.

4. **Market power**: monopolies charge higher prices and produce less than competitive markets.

Government intervention (taxes, regulations, public provision) can sometimes correct market failures — but government failure is also real.`,
      analogy: 'Market failure is like a sports game without a referee. Most of the time, players follow the rules (markets work). But sometimes a player cheats (externalities), or the field is poorly maintained (public goods), or one player has steroids (market power). A referee (government) is needed — but a bad referee can make things worse.',
      storyConnection: 'On market day, the dye-maker dumps waste in the river, which kills the fisherman\'s catch downstream. The dye-maker doesn\'t pay for this damage — it\'s a negative externality. The village council must intervene: either taxing the dye-maker or requiring clean disposal. This is market failure in the village, and it requires collective action to fix.',
      checkQuestion: 'Why can\'t the free market solve climate change without government intervention?',
      checkAnswer: 'Climate change is a massive negative externality + public goods problem. (1) Burning fossil fuels imposes costs (floods, droughts, sea level rise) on people who don\'t benefit from the burning. (2) A stable climate is a public good — everyone benefits, so no one wants to pay (free-rider problem). (3) The costs are spread across the whole world and future generations — the people causing the damage aren\'t the ones bearing the cost. Markets fail because the price of carbon doesn\'t reflect its true social cost.',
      codeIntro: 'Model a negative externality (pollution) and show how a tax can correct the market failure.',
      code: `import numpy as np
import matplotlib.pyplot as plt

quantity = np.linspace(0, 100, 200)

# Private cost of production (what the factory pays)
private_cost = 10 + 0.5 * quantity

# External cost (pollution damage to others)
external_cost = 0.3 * quantity

# Social cost = private + external
social_cost = private_cost + external_cost

# Market demand
demand = 80 - 0.5 * quantity

# Market equilibrium (private cost = demand)
# 10 + 0.5Q = 80 - 0.5Q -> Q = 70, P = 45
q_market = 70
p_market = 45

# Social optimum (social cost = demand)
# 10 + 0.8Q = 80 - 0.5Q -> Q = 53.8, P = 53.1
q_optimal = 53.8
p_optimal = 53.1

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Market with externality
ax1.set_facecolor('#111827')
ax1.plot(quantity, private_cost, color='#3b82f6', linewidth=2, label='Private cost (factory)')
ax1.plot(quantity, social_cost, color='#ef4444', linewidth=2, label='Social cost (factory + pollution)')
ax1.plot(quantity, demand, color='#22c55e', linewidth=2, label='Demand')

# Deadweight loss triangle
ax1.fill_between(quantity[(quantity >= q_optimal) & (quantity <= q_market)],
                 social_cost[(quantity >= q_optimal) & (quantity <= q_market)],
                 demand[(quantity >= q_optimal) & (quantity <= q_market)],
                 alpha=0.3, color='#ef4444', label='Deadweight loss (overproduction)')

ax1.plot(q_market, p_market, 'o', color='#f59e0b', markersize=10)
ax1.annotate(f'Market: Q={q_market}', xy=(q_market, p_market),
             xytext=(q_market+5, p_market+5), color='#f59e0b', fontsize=9)
ax1.plot(q_optimal, p_optimal, 'o', color='#22c55e', markersize=10)
ax1.annotate(f'Optimal: Q={q_optimal:.0f}', xy=(q_optimal, p_optimal),
             xytext=(q_optimal-25, p_optimal+5), color='#22c55e', fontsize=9)

ax1.set_xlabel('Quantity', color='white')
ax1.set_ylabel('Price / Cost (₹)', color='white')
ax1.set_title('Market Failure: Negative Externality', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Pigouvian tax correction
tax = 0.3  # tax per unit = external cost per unit
private_cost_taxed = private_cost + tax * quantity

ax2.set_facecolor('#111827')
ax2.plot(quantity, private_cost, color='#3b82f6', linewidth=1, linestyle='--', alpha=0.5, label='Old private cost')
ax2.plot(quantity, private_cost_taxed, color='#a855f7', linewidth=2, label='Private cost + tax')
ax2.plot(quantity, social_cost, color='#ef4444', linewidth=2, label='Social cost')
ax2.plot(quantity, demand, color='#22c55e', linewidth=2, label='Demand')

ax2.plot(q_optimal, p_optimal, 'o', color='#22c55e', markersize=12, zorder=5)
ax2.annotate(f'New equilibrium = optimal!\
Q={q_optimal:.0f}', xy=(q_optimal, p_optimal),
             xytext=(q_optimal-25, p_optimal+8), color='#22c55e', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#22c55e'))

ax2.set_xlabel('Quantity', color='white')
ax2.set_ylabel('Price / Cost (₹)', color='white')
ax2.set_title('Pigouvian Tax: Making Polluters Pay', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Without tax: market produces Q=70 (TOO MUCH)")
print(f"With Pigouvian tax: market produces Q={q_optimal:.0f} (OPTIMAL)")
print()
print("The tax forces the factory to 'internalize' the external cost.")
print("Now the private cost includes the pollution damage.")
print("The market naturally reaches the socially optimal quantity.")
print()
print("Carbon tax works the same way: make polluters pay for CO2 emissions,")
print("and the market automatically reduces pollution to the efficient level.")`,
      challenge: 'Model a positive externality instead: a beekeeper whose bees pollinate neighboring farms. The social benefit exceeds the private benefit. What kind of intervention corrects this? (Hint: subsidy instead of tax.)',
      successHint: 'Markets are powerful but imperfect. Knowing when markets fail — and how to fix them — is the difference between good economics and dogmatic free-market thinking. The village market on its best day still has externalities, information gaps, and public goods problems. Understanding them is the first step to solving them.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Economics & Trade</span>
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
            />
        ))}
      </div>
    </div>
  );
}
