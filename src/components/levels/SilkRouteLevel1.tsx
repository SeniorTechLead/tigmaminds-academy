import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SilkRouteLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is trade — exchanging what you have for what you need',
      concept: `Trade is the voluntary exchange of goods or services between people, communities, or nations. It is one of the oldest human activities — archaeological evidence shows trade networks dating back over 100,000 years.

Trade exists because no single person, village, or country can produce everything it needs. The Brahmaputra Valley had abundant silk and tea. The Tibetan plateau had salt and yak wool. The Bay of Bengal coast had spices and shells. Each region had something others wanted, and **trade** was the mechanism that connected them.

**Barter** is the simplest form of trade: I give you silk, you give me salt. But barter has a problem called the **double coincidence of wants** — both parties must want what the other has, at the same time. This is why **money** was invented: a universally accepted medium that separates the act of selling from the act of buying.

Key terms:
- **Exports**: goods sent out of a region
- **Imports**: goods brought into a region
- **Surplus**: producing more than you consume (the prerequisite for trade)
- **Specialization**: focusing on producing what you're best at`,
      analogy: 'Trade is like a potluck dinner. Everyone brings what they cook best. Instead of each person making a full meal (inefficient, mediocre), each contributes their specialty. The result: everyone eats better than if they cooked alone. Trade is a global potluck.',
      storyConnection: 'The Silk Route of the Caterpillars tells of ancient NE Indian traders who carried muga silk along mountain paths to Tibet and Burma. They didn\'t make the journey because they loved walking — they made it because muga silk was worth ten times its weight in salt at the other end. The story is about courage, but the economics are about surplus and demand.',
      checkQuestion: 'A village produces 100 kg of rice but only needs 60 kg. A neighboring village produces 50 kg of fish but only needs 30 kg. Can they trade? What determines the "price"?',
      checkAnswer: 'Yes — the first village has a 40 kg rice surplus and wants fish; the second has a 20 kg fish surplus and wants rice. The "price" (exchange rate) depends on how badly each wants the other\'s surplus. If fish is harder to catch than rice is to grow, 1 kg of fish might trade for 3 kg of rice. Supply, demand, and effort all factor in.',
      codeIntro: 'Simulate a simple barter economy and track exchange rates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Two villages, two goods: rice and fish
# Village A: good at rice, needs fish
# Village B: good at fish, needs rice

# Production per day
village_a_rice = 100  # kg
village_a_fish = 10   # kg
village_b_rice = 20   # kg
village_b_fish = 80   # kg

# Needs per day
need_rice = 60
need_fish = 30

# Without trade
a_surplus_rice = village_a_rice - need_rice  # 40
a_deficit_fish = need_fish - village_a_fish  # 20
b_surplus_fish = village_b_fish - need_fish  # 50
b_deficit_rice = need_rice - village_b_rice  # 40

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Without trade
ax1.set_facecolor('#111827')
categories = ['Rice produced', 'Rice needed', 'Fish produced', 'Fish needed']
a_vals = [village_a_rice, need_rice, village_a_fish, need_fish]
b_vals = [village_b_rice, need_rice, village_b_fish, need_fish]
x = np.arange(len(categories))
w = 0.35
ax1.bar(x - w/2, a_vals, w, color='#22c55e', label='Village A (rice farmers)')
ax1.bar(x + w/2, b_vals, w, color='#3b82f6', label='Village B (fishers)')
ax1.set_xticks(x)
ax1.set_xticklabels(categories, color='white', fontsize=8, rotation=15)
ax1.set_ylabel('kg per day', color='white')
ax1.set_title('Production vs Needs (No Trade)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# With trade — surplus and deficit
ax2.set_facecolor('#111827')
trade_items = ['A: Rice surplus', 'A: Fish deficit', 'B: Fish surplus', 'B: Rice deficit']
trade_vals = [a_surplus_rice, a_deficit_fish, b_surplus_fish, b_deficit_rice]
trade_colors = ['#22c55e', '#ef4444', '#3b82f6', '#ef4444']
bars = ax2.bar(trade_items, trade_vals, color=trade_colors)
ax2.set_ylabel('kg per day', color='white')
ax2.set_title('Surpluses and Deficits (Opportunity for Trade)', color='white', fontsize=12)
ax2.tick_params(colors='gray')
plt.setp(ax2.get_xticklabels(), rotation=15, ha='right', color='white', fontsize=8)

for bar, val in zip(bars, trade_vals):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{val} kg', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Without trade:")
print(f"  Village A: has {a_surplus_rice}kg extra rice, needs {a_deficit_fish}kg more fish")
print(f"  Village B: has {b_surplus_fish}kg extra fish, needs {b_deficit_rice}kg more rice")
print()
print("With trade: A sends rice to B, B sends fish to A.")
print("Both villages end up with enough of everything.")
print("This is the fundamental logic of ALL trade.")`,
      challenge: 'Add a third village that produces 60 kg of salt but needs both rice and fish. How does three-way trade work? (Hint: you might need a medium of exchange — proto-money.)',
      successHint: 'Trade exists because specialization is efficient. Every modern economy, from local markets to international shipping, runs on the same principle the silk route traders understood: make what you are good at, trade for what you need.',
    },
    {
      title: 'Why people trade — comparative advantage',
      concept: `Even if one country is better at making *everything*, trade still makes both countries better off. This counterintuitive insight is called **comparative advantage**, discovered by David Ricardo in 1817.

The key is **opportunity cost**: what you give up to produce something. If Assam can produce either 10 kg of silk OR 50 kg of rice per worker per day, the opportunity cost of 1 kg of silk is 5 kg of rice.

If Tibet can produce either 2 kg of silk OR 20 kg of rice per worker per day, the opportunity cost of 1 kg of silk is 10 kg of rice.

Assam has a **comparative advantage** in silk (lower opportunity cost: 5 rice vs. 10 rice). Tibet has a comparative advantage in rice (opportunity cost of 1 kg rice: 1/10 silk in Tibet vs. 1/5 silk in Assam).

Even though Assam is better at BOTH products (absolute advantage), both regions benefit if:
- Assam specializes in silk
- Tibet specializes in rice
- They trade

This is one of the most important and non-obvious results in all of economics.`,
      analogy: 'Imagine a doctor who can type faster than their secretary. Should the doctor type their own letters? No — even though the doctor has an absolute advantage in typing, the opportunity cost is huge (every minute typing is a minute not seeing patients). The doctor should specialize in medicine, the secretary in typing. Both are better off.',
      storyConnection: 'The silk route traders didn\'t carry muga silk to Tibet because Tibetans couldn\'t make any cloth — they could, from yak wool. But the opportunity cost of silk production in Tibet was enormous (silkworms need specific forests that don\'t exist on the plateau). The caterpillars gave Assam a comparative advantage that made the dangerous mountain journey worthwhile.',
      checkQuestion: 'Country A can make 100 cars or 200 computers. Country B can make 50 cars or 300 computers. Which country has the comparative advantage in cars? In computers?',
      checkAnswer: 'Country A: opportunity cost of 1 car = 2 computers. Country B: opportunity cost of 1 car = 6 computers. A has comparative advantage in cars (lower opportunity cost). Country B: opportunity cost of 1 computer = 1/6 car. Country A: 1 computer = 1/2 car. B has comparative advantage in computers.',
      codeIntro: 'Model comparative advantage and show how trade creates mutual gains.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Production possibilities for Assam and Tibet
# Workers can produce silk OR rice (per worker per day)

# Assam: 10 kg silk OR 50 kg rice per worker
# Tibet: 2 kg silk OR 20 kg rice per worker
# Each region has 10 workers

workers = 10

# Production possibility frontiers
silk_assam = np.linspace(0, 10 * workers, 50)  # max 100 kg silk
rice_assam = (10 * workers - silk_assam) * 5  # for each kg silk given up, get 5 rice

silk_tibet = np.linspace(0, 2 * workers, 50)  # max 20 kg silk
rice_tibet = (2 * workers - silk_tibet) * 10  # for each kg silk given up, get 10 rice

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# PPF curves
ax1.set_facecolor('#111827')
ax1.plot(silk_assam, rice_assam, color='#22c55e', linewidth=2, label='Assam PPF')
ax1.plot(silk_tibet, rice_tibet, color='#3b82f6', linewidth=2, label='Tibet PPF')
ax1.fill_between(silk_assam, rice_assam, alpha=0.1, color='#22c55e')
ax1.fill_between(silk_tibet, rice_tibet, alpha=0.1, color='#3b82f6')

# Without trade: each produces both (split workers 5/5)
a_no_trade = (50, 250)  # 5 workers silk, 5 workers rice
t_no_trade = (10, 100)
ax1.plot(*a_no_trade, 'o', color='#f59e0b', markersize=10, zorder=5)
ax1.plot(*t_no_trade, 's', color='#f59e0b', markersize=10, zorder=5)
ax1.annotate('Assam no trade', xy=a_no_trade, xytext=(55, 280), color='#f59e0b', fontsize=9)
ax1.annotate('Tibet no trade', xy=t_no_trade, xytext=(12, 130), color='#f59e0b', fontsize=9)

ax1.set_xlabel('Silk (kg)', color='white')
ax1.set_ylabel('Rice (kg)', color='white')
ax1.set_title('Production Possibility Frontiers', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Gains from trade
ax2.set_facecolor('#111827')
scenarios = ['No Trade', 'With Trade']
# No trade totals
total_silk_no = 50 + 10
total_rice_no = 250 + 100

# With trade: Assam all silk (100), Tibet all rice (200)
# Trade: Assam gives 30 silk to Tibet for 120 rice
assam_silk_after = 100 - 30
assam_rice_after = 0 + 120
tibet_silk_after = 0 + 30
tibet_rice_after = 200 - 120

x = np.arange(2)
w = 0.35
ax2.bar(x - w/2, [50, assam_silk_after], w, color='#22c55e', label='Assam Silk')
ax2.bar(x + w/2, [10, tibet_silk_after], w, color='#3b82f6', label='Tibet Silk')

# Add rice as text annotations
for i, (ar, tr) in enumerate([(250, 100), (assam_rice_after, tibet_rice_after)]):
    ax2.text(i - w/2, [50, assam_silk_after][i] + 2, f'+{ar}kg rice', color='#22c55e', fontsize=8, ha='center')
    ax2.text(i + w/2, [10, tibet_silk_after][i] + 2, f'+{tr}kg rice', color='#3b82f6', fontsize=8, ha='center')

ax2.set_xticks(x)
ax2.set_xticklabels(scenarios, color='white')
ax2.set_ylabel('Silk (kg)', color='white')
ax2.set_title('Gains from Specialization + Trade', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Without trade (each splits workers 50/50):")
print(f"  Assam: 50 kg silk, 250 kg rice")
print(f"  Tibet: 10 kg silk, 100 kg rice")
print(f"  Total: 60 kg silk, 350 kg rice")
print()
print("With specialization + trade:")
print(f"  Assam makes: 100 kg silk, trades 30 for 120 rice")
print(f"  Tibet makes: 200 kg rice, trades 120 for 30 silk")
print(f"  Assam gets: 70 kg silk, 120 kg rice")
print(f"  Tibet gets: 30 kg silk, 80 kg rice")
print(f"  Total: 100 kg silk, 200 kg rice")
print()
print("Assam: +20 silk, -130 rice (better off in silk)")
print("Tibet: +20 silk, -20 rice (better off in silk)")
print("Trade creates value that didn't exist before!")`,
      challenge: 'What if a new technology doubles Tibet\'s silk production to 4 kg per worker? Recalculate the opportunity costs. Does Assam still have a comparative advantage in silk?',
      successHint: 'Comparative advantage is the single most important concept in economics. It explains why trade happens, why countries specialize, and why protectionism usually backfires. The silk route traders lived it; Ricardo named it.',
    },
    {
      title: 'Ancient trade routes — networks of exchange',
      concept: `Trade routes are not random paths — they follow geography, connecting surplus regions to demand regions along the easiest terrain. The great trade routes of history were networks that shaped civilizations.

**Major historical trade routes:**
- **Silk Road** (200 BCE - 1450 CE): China → Central Asia → Mediterranean. Carried silk, spices, paper, gunpowder. 6,400 km.
- **Trans-Saharan routes** (300 CE - 1500s): West Africa → North Africa. Carried gold, salt, slaves. Enabled the Mali Empire.
- **Maritime Spice Route**: Southeast Asia → India → Arabia → Europe. Drove European exploration.
- **NE India trade corridors**: Assam ↔ Tibet (via Tawang), Assam ↔ Burma (via Manipur), Assam ↔ Bengal (via Brahmaputra). Carried silk, tea, salt, amber.

**Why routes form where they do:**
- Mountain passes (the only way through)
- River valleys (flat terrain, water for transport)
- Oasis towns (water in deserts)
- Port cities (where land meets sea)

Trade routes didn't just move goods — they moved ideas, languages, religions, technologies, and diseases. The Silk Road brought Buddhism from India to China and papermaking from China to the West.`,
      analogy: 'Trade routes are like the internet of the ancient world. Just as data flows through cables and routers along the fastest paths, goods flowed along routes through mountain passes and port cities. Oasis towns were routers — nodes where routes intersected and goods changed hands.',
      storyConnection: 'The caterpillar silk traders of NE India walked paths through some of the most difficult terrain on Earth — the Eastern Himalayas. These weren\'t arbitrary trails. Each route followed a river valley or mountain pass, optimized over centuries for the balance between distance, difficulty, and safety. The routes were infrastructure, as vital as any modern highway.',
      checkQuestion: 'Why did trade routes often follow rivers rather than cutting straight across land?',
      checkAnswer: 'Three reasons: (1) Rivers provide flat terrain with no mountains to cross. (2) Rivers provide water for drinking, cooking, and animal needs along the way. (3) Rivers allow boat transport, which can carry 10-100x more cargo than pack animals for the same effort. The Brahmaputra was NE India\'s trade superhighway for exactly these reasons.',
      codeIntro: 'Model a simplified ancient trade network as a graph and find optimal routes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified NE India trade network
# Nodes: cities/trade posts
cities = {
    'Guwahati': (91.7, 26.1),
    'Tezpur': (92.8, 26.6),
    'Dibrugarh': (95.0, 27.5),
    'Tawang': (91.9, 27.6),
    'Imphal': (93.9, 24.8),
    'Silchar': (92.8, 24.8),
    'Shillong': (91.9, 25.6),
    'Kohima': (94.1, 25.7),
    'Lhasa': (91.1, 29.7),
    'Mandalay': (96.1, 21.9),
    'Dhaka': (90.4, 23.8),
    'Kolkata': (88.4, 22.6),
}

# Trade connections (edges) with approximate difficulty (1=easy, 5=hard)
routes = [
    ('Guwahati', 'Tezpur', 1, 'River'),
    ('Tezpur', 'Dibrugarh', 1, 'River'),
    ('Guwahati', 'Shillong', 2, 'Mountain'),
    ('Shillong', 'Silchar', 3, 'Mountain'),
    ('Silchar', 'Imphal', 3, 'Mountain'),
    ('Imphal', 'Kohima', 3, 'Mountain'),
    ('Imphal', 'Mandalay', 4, 'Mountain'),
    ('Tezpur', 'Tawang', 5, 'High pass'),
    ('Tawang', 'Lhasa', 5, 'High pass'),
    ('Guwahati', 'Dhaka', 2, 'River/plain'),
    ('Dhaka', 'Kolkata', 1, 'River/plain'),
    ('Dibrugarh', 'Kohima', 3, 'Mountain'),
]

fig, ax = plt.subplots(figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Draw routes
difficulty_colors = {1: '#22c55e', 2: '#3b82f6', 3: '#f59e0b', 4: '#ef4444', 5: '#dc2626'}
for c1, c2, diff, rtype in routes:
    x1, y1 = cities[c1]
    x2, y2 = cities[c2]
    ax.plot([x1, x2], [y1, y2], color=difficulty_colors[diff], linewidth=3-diff*0.3, alpha=0.7)
    mx, my = (x1+x2)/2, (y1+y2)/2
    ax.text(mx, my, rtype, color='#9ca3af', fontsize=6, ha='center',
           bbox=dict(boxstyle='round,pad=0.2', facecolor='#1f2937', edgecolor='none', alpha=0.8))

# Draw cities
for name, (x, y) in cities.items():
    is_major = name in ['Guwahati', 'Lhasa', 'Mandalay', 'Kolkata']
    size = 120 if is_major else 60
    color = '#f59e0b' if is_major else '#e5e7eb'
    ax.scatter(x, y, s=size, color=color, zorder=5, edgecolors='white', linewidth=0.5)
    ax.annotate(name, xy=(x, y), xytext=(5, 5), textcoords='offset points',
               color='white', fontsize=9, fontweight='bold' if is_major else 'normal')

# Legend for difficulty
for diff, color in difficulty_colors.items():
    ax.plot([], [], color=color, linewidth=2, label=f'Difficulty {diff}')
ax.legend(facecolor='#1f2937', labelcolor='white', loc='lower left', fontsize=9)

ax.set_xlabel('Longitude', color='white')
ax.set_ylabel('Latitude', color='white')
ax.set_title('Ancient Trade Network of NE India', color='white', fontsize=14)
ax.tick_params(colors='gray')
plt.tight_layout()
plt.show()

print("Key trade corridors:")
print("  Brahmaputra Valley (Guwahati-Dibrugarh): easiest, river transport")
print("  Tawang-Lhasa: hardest, high Himalayan passes (4,500m+)")
print("  Imphal-Mandalay: difficult but vital Burma connection")
print("  Guwahati-Kolkata: the link to global maritime trade")
print()
print("Difficulty determined: travel time, cargo capacity, seasonal access.")
print("The hardest routes carried the most valuable goods (silk, gems).")`,
      challenge: 'If a trader in Dibrugarh wants to reach Kolkata, what is the lowest-difficulty path? Add up the difficulty scores for each possible route and find the minimum. This is essentially the shortest-path problem — the foundation of modern routing algorithms.',
      successHint: 'Trade routes are networks, and network analysis is one of the most powerful tools in modern data science. The same algorithms that find optimal trade routes power GPS navigation, internet routing, and social media recommendation systems.',
    },
    {
      title: 'Silk as currency — when goods become money',
      concept: `Before coins and paper money, certain trade goods served as **commodity money** — items that were both useful in themselves and accepted as payment for other goods.

**Properties that make a good commodity money:**
- **Durable**: doesn't rot or break (salt works; fish doesn't)
- **Portable**: high value per unit weight (silk works; rice doesn't)
- **Divisible**: can be split into smaller units (gold works; diamonds don't)
- **Recognizable**: easy to verify quality (silk works — you can feel and see the grade)
- **Scarce**: limited supply maintains value (muga silk works — only grows in Assam)

**Muga silk** (Antheraea assamica) was an ideal commodity money in NE India:
- Extremely durable (lasts 50+ years)
- Light and portable (a small bundle = high value)
- Quality is visible (golden sheen = genuine muga)
- Geographically limited (only Assam has the right climate and host trees)

Other historical commodity monies: cowrie shells (Africa, Asia), salt (Rome — "salary" comes from "sal"), tea bricks (Tibet, Mongolia), cacao beans (Mesoamerica), beaver pelts (North America).

The transition from commodity money to coins to paper to digital money is one of the great stories of human civilization.`,
      analogy: 'Commodity money is like using frequent-flyer miles as a second currency. The miles represent something real (flights), but people trade them, save them, and even use them to buy non-flight things. Silk worked the same way: it was cloth you could wear, but also "money" you could trade for anything.',
      storyConnection: 'In the story, the silk route traders didn\'t just carry silk as a product — they carried it as wealth. A bundle of muga silk in Tawang could buy a yak. In Mandalay, it could buy rubies. The silk was simultaneously the cargo, the currency, and the insurance policy. If trade fell through, you still had valuable cloth.',
      checkQuestion: 'Salt was used as money in ancient Rome, but we don\'t use salt as money today. What changed?',
      checkAnswer: 'Three things: (1) Industrial salt mining made salt abundant and cheap (scarcity disappeared). (2) Better preservation techniques (refrigeration) reduced demand for salt as a food preservative. (3) Standardized metal coins proved more practical — precisely measurable, harder to counterfeit, and more durable. Money evolved toward more abstract forms as trust in institutions grew.',
      codeIntro: 'Compare commodity monies on the key properties required for money.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Rate commodity monies on key monetary properties (1-10)
commodities = {
    'Muga silk': {'Durable': 9, 'Portable': 8, 'Divisible': 6, 'Recognizable': 8, 'Scarce': 9},
    'Gold': {'Durable': 10, 'Portable': 7, 'Divisible': 9, 'Recognizable': 9, 'Scarce': 9},
    'Salt': {'Durable': 7, 'Portable': 5, 'Divisible': 10, 'Recognizable': 7, 'Scarce': 6},
    'Cowrie shells': {'Durable': 8, 'Portable': 9, 'Divisible': 7, 'Recognizable': 8, 'Scarce': 7},
    'Rice': {'Durable': 3, 'Portable': 2, 'Divisible': 10, 'Recognizable': 6, 'Scarce': 3},
    'Tea bricks': {'Durable': 5, 'Portable': 6, 'Divisible': 7, 'Recognizable': 7, 'Scarce': 6},
}

properties = list(list(commodities.values())[0].keys())
N = len(properties)
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

colors = ['#f59e0b', '#e5e7eb', '#22c55e', '#ec4899', '#ef4444', '#3b82f6']

fig, ax = plt.subplots(figsize=(9, 9), subplot_kw=dict(polar=True))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

for (name, scores), color in zip(commodities.items(), colors):
    values = [scores[p] for p in properties]
    values += values[:1]
    ax.plot(angles, values, 'o-', linewidth=2, label=name, color=color)
    ax.fill(angles, values, alpha=0.08, color=color)

ax.set_xticks(angles[:-1])
ax.set_xticklabels(properties, color='white', fontsize=10)
ax.set_ylim(0, 10)
ax.set_yticks([2, 4, 6, 8, 10])
ax.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax.tick_params(colors='gray')
ax.legend(loc='upper right', bbox_to_anchor=(1.35, 1.1), facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_title('Commodity Money: Property Comparison', color='white', fontsize=13, pad=20)

plt.tight_layout()
plt.show()

print("Overall money scores (sum of all properties):")
for name, scores in commodities.items():
    total = sum(scores.values())
    print(f"  {name:15s}: {total}/50")
print()
print("Gold wins overall — which is why it became the global standard.")
print("Muga silk is close — which is why it served as currency in NE India.")
print("Rice fails badly — too heavy, too perishable. Never used as money.")`,
      challenge: 'Add Bitcoin to the chart. Rate it on the same 5 properties. How does a purely digital "commodity" compare to physical ones? Where does it excel and where does it fail?',
      successHint: 'Understanding what makes good money is understanding what makes a good medium of exchange. This analysis applies to everything from ancient silk to modern cryptocurrencies. The properties are universal; only the materials change.',
    },
    {
      title: 'Supply and demand for luxury goods',
      concept: `**Supply and demand** is the most fundamental model in economics. It explains how prices are set in a market:

- **Demand**: as price goes up, fewer people buy (demand curve slopes downward)
- **Supply**: as price goes up, more producers want to sell (supply curve slopes upward)
- **Equilibrium**: where supply meets demand — the market price

For **luxury goods** like muga silk, demand behaves differently:
- **Veblen goods**: demand INCREASES as price rises (people buy BECAUSE it's expensive — it signals wealth)
- **Price elasticity**: luxury demand is more elastic (sensitive to price) than necessities like rice
- **Income effect**: as people get richer, they spend proportionally more on luxuries

Muga silk was the ultimate luxury: golden color, extreme durability, geographic exclusivity. At the Tibet end of the silk route, a bolt of muga could command prices 50-100x the production cost. This price premium justified the weeks of dangerous travel through mountain passes.

The silk route existed because the **price differential** between producer markets and consumer markets was enormous — large enough to cover transportation costs, risks, and still leave profit.`,
      analogy: 'Supply and demand is like a seesaw. When demand is heavy (many buyers), the price-end tips up. When supply is heavy (many sellers), the price-end tips down. Equilibrium is when both sides balance. Luxury goods add a twist: some buyers actually prefer the high end of the seesaw.',
      storyConnection: 'The caterpillar silk traders understood supply and demand intuitively. They knew to time their Tibet journey for late autumn, when Tibetan nomads had fresh yak butter and salt to trade but no warm, beautiful cloth for winter. Maximum demand + limited supply = maximum price. The traders were economists who did their math in profit, not equations.',
      checkQuestion: 'If a new silk road opened and doubled the supply of muga silk in Tibet, what would happen to the price? And what would happen to the traders\' total revenue?',
      checkAnswer: 'Price would fall (more supply at each price point shifts the supply curve right). Whether total revenue rises or falls depends on the price elasticity of demand. If demand is elastic (luxury good), the percentage drop in price is greater than the percentage increase in quantity sold, so total revenue would actually decrease. The traders would be worse off selling more silk.',
      codeIntro: 'Model supply and demand curves and find equilibrium for muga silk.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Supply and demand for muga silk in Tibet market
# Price in units of "salt blocks" per bolt of silk

price = np.linspace(1, 50, 100)

# Demand: decreases with price (with Veblen effect at high end)
base_demand = 100 * np.exp(-0.05 * price)
# Add slight Veblen effect for luxury goods
veblen = 5 * np.exp(-0.01 * (price - 30)**2)
demand = base_demand + veblen

# Supply: increases with price (more traders make the journey if price is high)
supply = 2 * price**1.3

# Find equilibrium
diff = np.abs(demand - supply)
eq_idx = np.argmin(diff)
eq_price = price[eq_idx]
eq_qty = demand[eq_idx]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Supply and demand curves
ax1.set_facecolor('#111827')
ax1.plot(demand, price, color='#3b82f6', linewidth=2, label='Demand')
ax1.plot(supply, price, color='#ef4444', linewidth=2, label='Supply')
ax1.plot(eq_qty, eq_price, 'o', color='#f59e0b', markersize=12, zorder=5, label=f'Equilibrium')
ax1.annotate(f'Price: {eq_price:.0f} salt blocks\\nQty: {eq_qty:.0f} bolts',
            xy=(eq_qty, eq_price), xytext=(eq_qty+20, eq_price+5),
            color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Shade surplus areas
ax1.fill_betweenx(price[:eq_idx], demand[:eq_idx], eq_qty, alpha=0.1, color='#3b82f6')
ax1.fill_betweenx(price[:eq_idx], supply[:eq_idx], eq_qty, alpha=0.1, color='#ef4444')

ax1.set_xlabel('Quantity (bolts of silk)', color='white')
ax1.set_ylabel('Price (salt blocks per bolt)', color='white')
ax1.set_title('Muga Silk: Supply and Demand in Tibet', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Revenue vs price
ax2.set_facecolor('#111827')
revenue = demand * price  # total revenue at each price point
trader_profit = (price - 5) * np.minimum(demand, supply)  # profit = (price - cost) * qty sold

ax2.plot(price, revenue, color='#22c55e', linewidth=2, label='Total revenue')
ax2.plot(price, trader_profit, color='#f59e0b', linewidth=2, label='Trader profit')
ax2.axvline(eq_price, color='#6b7280', linestyle='--', alpha=0.5)
ax2.set_xlabel('Price (salt blocks)', color='white')
ax2.set_ylabel('Value', color='white')
ax2.set_title('Revenue and Profit vs Price', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Market equilibrium:")
print(f"  Price: {eq_price:.0f} salt blocks per bolt of silk")
print(f"  Quantity: {eq_qty:.0f} bolts traded")
print(f"  Total market value: {eq_price * eq_qty:.0f} salt blocks")
print()
print("The Veblen effect: notice the bump in demand around price 30.")
print("Some Tibetan nobles wanted silk BECAUSE it was expensive.")
print("Status goods defy the normal law of demand.")`,
      challenge: 'Model what happens when a war blocks the trade route (supply drops to 1/3). Shift the supply curve and find the new equilibrium. How much does price rise? Who benefits and who suffers?',
      successHint: 'Supply and demand governs every market from ancient silk routes to modern stock exchanges. The model is simple, but it explains an enormous range of economic behavior — including why luxury goods like muga silk could sustain dangerous, weeks-long trade journeys.',
    },
    {
      title: 'Modern trade networks — from silk routes to shipping lanes',
      concept: `The ancient silk routes moved hundreds of kilograms of goods per year. Modern container shipping moves **11 billion tonnes per year** — that's roughly 1.4 tonnes for every person on Earth.

The principles are the same; the scale is different:
- **Container shipping** (1956-present): standardized 20-foot and 40-foot containers revolutionized trade. A single container ship carries 20,000+ containers.
- **Air freight**: fast but expensive. Used for high-value, time-sensitive goods (electronics, flowers, medicines).
- **Rail**: efficient for heavy bulk goods over land (coal, grain, cars).
- **Digital trade**: the newest "route" — services, software, and data cross borders instantly.

**Modern trade facts:**
- 80% of global trade by volume travels by sea
- The Strait of Malacca (between Malaysia and Indonesia) carries 25% of all sea trade
- China, the US, and Germany are the top 3 trading nations
- India exports $450+ billion/year (IT services, textiles, pharmaceuticals)
- NE India's trade position is rising: tea, silk, spices, and increasingly tech services

**Trade infrastructure** has replaced geographic features as the key determinant of trade routes. Ports, highways, railways, and fiber optic cables are the modern mountain passes and river valleys.`,
      analogy: 'If ancient trade routes were dirt roads, modern shipping lanes are superhighways. If silk route traders were individual pedestrians, container ships are freight trains. The fundamental physics of trade (move goods from surplus to deficit) hasn\'t changed — but the bandwidth has increased by a factor of a billion.',
      storyConnection: 'The caterpillar silk traders would be astonished to learn that their journey (weeks through mountains carrying silk bundles) has been replaced by container ships that move millions of silk garments in days. But the logic is identical: Assam still produces silk, other regions still want it, and the route follows the cheapest path. The mountains have been replaced by shipping lanes.',
      checkQuestion: 'Why did container shipping (invented 1956) have a bigger impact on global trade than the internet (1990s)?',
      checkAnswer: 'Before containers, loading and unloading a ship took weeks and was labor-intensive. Containers standardized cargo handling, reducing port time from weeks to hours and cutting shipping costs by 90%+. This made it economical to ship low-value goods globally for the first time. The internet improved information flow, but containers transformed physical goods movement — and 80% of trade is still physical goods.',
      codeIntro: 'Visualize how global trade volumes have grown over the centuries.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Global trade volume estimates (rough, in billions of USD, 2020 dollars)
years = [1500, 1600, 1700, 1800, 1850, 1900, 1950, 1970, 1990, 2000, 2010, 2020]
trade_volume = [0.5, 1, 2, 5, 15, 50, 150, 500, 4000, 8000, 18000, 22000]

# Key events
events = [
    (1498, 'Vasco da Gama\\nreaches India', 0.4),
    (1869, 'Suez Canal\\nopens', 12),
    (1956, 'Container\\nshipping invented', 120),
    (1995, 'WTO\\nestablished', 5000),
]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Linear scale
ax1.set_facecolor('#111827')
ax1.fill_between(years, trade_volume, alpha=0.2, color='#22c55e')
ax1.plot(years, trade_volume, 'o-', color='#22c55e', linewidth=2, markersize=6)
for year, label, ypos in events:
    ax1.axvline(year, color='#f59e0b', linestyle=':', alpha=0.5)
    ax1.text(year, max(trade_volume)*0.7, label, color='#f59e0b', fontsize=7,
            ha='center', va='bottom')
ax1.set_ylabel('Trade volume (B USD, 2020)', color='white')
ax1.set_title('Global Trade: 500 Years of Growth', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Log scale (shows exponential growth more clearly)
ax2.set_facecolor('#111827')
ax2.fill_between(years, trade_volume, alpha=0.2, color='#3b82f6')
ax2.plot(years, trade_volume, 'o-', color='#3b82f6', linewidth=2, markersize=6)
ax2.set_yscale('log')
for year, label, _ in events:
    ax2.axvline(year, color='#f59e0b', linestyle=':', alpha=0.5)
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Trade volume (log scale)', color='white')
ax2.set_title('Same Data, Log Scale (constant slope = exponential growth)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Growth rate annotations
periods = [(1500, 1800, '1500-1800'), (1800, 1950, '1800-1950'), (1950, 2020, '1950-2020')]
for y1, y2, label in periods:
    i1 = years.index(y1)
    i2 = years.index(y2)
    growth = (trade_volume[i2] / trade_volume[i1]) ** (1 / (y2 - y1)) - 1
    ax2.annotate(f'{label}\\n{growth*100:.1f}%/yr',
                xy=((y1+y2)/2, np.sqrt(trade_volume[i1]*trade_volume[i2])),
                color='#e5e7eb', fontsize=8, ha='center',
                bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#4b5563'))

plt.tight_layout()
plt.show()

print("Growth rates by era:")
print("  1500-1800: ~0.8%/year (sail power, limited routes)")
print("  1800-1950: ~2.3%/year (steam, Suez Canal, colonialism)")
print("  1950-2020: ~7.3%/year (containers, air freight, WTO)")
print()
print("Trade has grown 44,000x in 500 years.")
print("The ancient silk route was a trickle; modern trade is an ocean.")`,
      challenge: 'Plot NE India\'s specific trade commodities over time: tea (1840s-present), petroleum (1890s-present), silk (ancient-present). How has the region\'s trade basket changed?',
      successHint: 'From barter between villages to a $22 trillion global trade system, the principles remain: produce what you are good at, exchange for what you need. The silk route of the caterpillars was one small thread in a web that now spans the entire planet. Level 2 digs into the data and mathematics that govern modern trade.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior economics experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for economics and trade simulations. Click to start.</p>
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
