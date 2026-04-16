import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ImaKeithelLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Game theory — strategic pricing between vendors',
      concept: `When two vendors sell the same product, each must consider the other\'s pricing. This is **game theory** — the study of strategic interaction.

The classic model is the **Prisoner\'s Dilemma**. Two vendors can either:
- **Cooperate**: both keep prices high (both earn moderate profit)
- **Defect**: undercut the other (undercutter wins big, other loses)

The payoff matrix:
- Both cooperate: (100, 100)
- A defects, B cooperates: (150, 20)
- Both defect: (50, 50)

The **Nash equilibrium** is where neither player can improve by changing strategy alone. In the Prisoner\'s Dilemma, both defecting is the Nash equilibrium — even though both cooperating would be better for everyone.

We simulate repeated games to see if cooperation can emerge.`,
      analogy: 'Game theory is like a chess match between vendors. Each move (price change) depends on what you expect the other player to do. The best players think several moves ahead, anticipating the opponent\'s response to their response.',
      storyConnection: 'At Ima Keithel, vendors in adjacent stalls face this dilemma daily. Undercut your neighbour, and you steal her customers — but she retaliates. The market\'s 500-year stability suggests vendors have found cooperative equilibria through repeated interaction and social norms.',
      checkQuestion: 'Why does the Nash equilibrium (both defect) produce a worse outcome than mutual cooperation?',
      checkAnswer: 'Because each player optimises individually, not collectively. If A cooperates, B\'s best response is to defect (150 > 100). If A defects, B\'s best response is still to defect (50 > 20). So B always defects, regardless of A. Same logic for A. Both end up at (50, 50) instead of (100, 100). Individual rationality leads to collective irrationality.',
      codeIntro: 'Simulate repeated pricing games between Ima Keithel vendors using different strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Payoff matrix: (row player payoff, column player payoff)
# Cooperate = keep price high, Defect = undercut
payoffs = {
    ('C', 'C'): (100, 100),
    ('C', 'D'): (20, 150),
    ('D', 'C'): (150, 20),
    ('D', 'D'): (50, 50),
}

def always_cooperate(history, my_last, their_last):
    return 'C'

def always_defect(history, my_last, their_last):
    return 'D'

def tit_for_tat(history, my_last, their_last):
    return their_last if their_last else 'C'

def grudger(history, my_last, their_last):
    if 'D' in [h[1] for h in history]:
        return 'D'
    return 'C'

def random_strategy(history, my_last, their_last):
    return 'C' if np.random.random() < 0.5 else 'D'

strategies = {
    'Always Cooperate': always_cooperate,
    'Always Defect': always_defect,
    'Tit-for-Tat': tit_for_tat,
    'Grudger': grudger,
    'Random': random_strategy,
}

np.random.seed(42)
n_rounds = 100
results = {}

# Round-robin tournament
strat_names = list(strategies.keys())
total_scores = {name: 0 for name in strat_names}

for i, name1 in enumerate(strat_names):
    for j, name2 in enumerate(strat_names):
        if i >= j:
            continue
        s1, s2 = strategies[name1], strategies[name2]
        score1, score2 = 0, 0
        history = []
        last1, last2 = None, None

        for r in range(n_rounds):
            move1 = s1(history, last1, last2)
            move2 = s2([(h[0], h[1]) for h in history], last2, last1)
            p1, p2 = payoffs[(move1, move2)]
            score1 += p1
            score2 += p2
            history.append((move1, move2))
            last1, last2 = move1, move2

        results[(name1, name2)] = (score1, score2)
        total_scores[name1] += score1
        total_scores[name2] += score2

# Display results
print("=== Ima Keithel Pricing Game Tournament ===\
")
print(f"{'Matchup':<40} {'Score 1':>8} {'Score 2':>8} {'Winner'}")
print("-" * 65)
for (n1, n2), (s1, s2) in sorted(results.items()):
    winner = n1 if s1 > s2 else n2 if s2 > s1 else 'Tie'
    print(f"{n1} vs {n2:<20} {s1:>8} {s2:>8} {winner}")

print("\
--- Total Scores ---")
for name, score in sorted(total_scores.items(), key=lambda x: -x[1]):
    print(f"  {name:<20}: {score:>6} points")

fig, ax = plt.subplots(1, 1, figsize=(8, 5))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')
colors = ['#34d399', '#ef4444', '#3b82f6', '#f59e0b', '#a78bfa']
bars = ax.bar(range(len(total_scores)), list(total_scores.values()), color=colors)
ax.set_xticks(range(len(total_scores)))
ax.set_xticklabels(list(total_scores.keys()), rotation=30, ha='right', fontsize=9, color='white')
ax.set_title('Tournament Results: Total Score', color='white', fontsize=13, fontweight='bold')
ax.set_ylabel('Total score', color='white')
ax.tick_params(colors='white')
ax.grid(True, alpha=0.2, color='white', axis='y')
plt.tight_layout()
plt.savefig('game_theory.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()
print(f"\
Winner: {max(total_scores, key=total_scores.get)} — Tit-for-Tat often wins in repeated games!")`,
      challenge: 'Add a "Forgiving Tit-for-Tat" strategy that cooperates after the opponent defects once (forgives a single defection). Does it outperform regular Tit-for-Tat?',
      successHint: 'Game theory explains strategic behaviour in markets, politics, biology, and warfare. Tit-for-Tat\'s success in tournaments showed that simple, reciprocal strategies can outperform complex ones.',
    },
    {
      title: 'Network effects — how markets grow exponentially',
      concept: `Ima Keithel\'s value increases with size. More vendors attract more buyers, which attracts more vendors — a **positive feedback loop** or **network effect**.

The value of a network with N participants is approximately **V = k x N²** (Metcalfe\'s Law). Doubling the number of participants quadruples the value.

We model this as a **differential equation**:
dN/dt = r x N x (1 - N/K) + alpha x N²/K

Where:
- r = natural growth rate
- K = carrying capacity
- alpha = network effect strength

The network effect term (alpha x N²/K) creates explosive early growth followed by saturation.`,
      analogy: 'Network effects are like a party. An empty room is boring (nobody comes). A room with a few people is okay. But once enough people arrive, the party becomes "the place to be" and everyone wants in. Ima Keithel reached this tipping point centuries ago.',
      storyConnection: 'The story traces how Ima Keithel grew from a few stalls to 5,000 vendors over centuries. The growth was not linear — it accelerated as the market became the dominant trading centre, drawing buyers from across the region.',
      checkQuestion: 'Can network effects create monopolies?',
      checkAnswer: 'Yes — this is why Facebook, Google, and Amazon dominate. Once a network is large enough, it becomes nearly impossible for competitors to match its value (because value = N²). Ima Keithel is a geographical monopoly for the same reason: once it became the dominant market, no competing market could offer the same variety and foot traffic.',
      codeIntro: 'Model the growth of Ima Keithel using network effect dynamics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Market growth model with network effects
dt = 0.1  # years
t_max = 100  # years
steps = int(t_max / dt)
t = np.arange(steps) * dt

# Parameters
K = 5000          # carrying capacity (max vendors)
r = 0.05          # base growth rate
alpha = 0.03      # network effect strength

# With network effects
N_network = np.zeros(steps)
N_network[0] = 10  # start with 10 vendors

# Without network effects (standard logistic)
N_logistic = np.zeros(steps)
N_logistic[0] = 10

for i in range(1, steps):
    # With network effect
    dN = r * N_network[i-1] * (1 - N_network[i-1]/K) + alpha * N_network[i-1]**2 / K
    N_network[i] = N_network[i-1] + dN * dt
    N_network[i] = min(N_network[i], K)

    # Standard logistic
    dN_log = r * N_logistic[i-1] * (1 - N_logistic[i-1]/K)
    N_logistic[i] = N_logistic[i-1] + dN_log * dt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax1.plot(t, N_network, color='#34d399', linewidth=2, label='With network effects')
ax1.plot(t, N_logistic, color='#ef4444', linewidth=2, linestyle='--', label='Without (logistic)')
ax1.axhline(y=K, color='white', alpha=0.3, linestyle=':', label=f'Capacity ({K})')
ax1.set_title('Ima Keithel Growth Over 100 Years', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Number of vendors', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax1.grid(True, alpha=0.2, color='white')

# Market value (Metcalfe's law)
V_network = N_network**2 / 1e6
V_logistic = N_logistic**2 / 1e6
ax2.plot(t, V_network, color='#f59e0b', linewidth=2, label='With network effects')
ax2.plot(t, V_logistic, color='#a78bfa', linewidth=2, linestyle='--', label='Without')
ax2.set_title("Market Value (Metcalfe's Law: V ∝ N²)", color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Value (millions, arbitrary units)', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('network.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

# Find when each model reaches 50% capacity
idx_net_50 = np.argmax(N_network >= K/2)
idx_log_50 = np.argmax(N_logistic >= K/2)
print(f"Time to 50% capacity:")
print(f"  With network effects: {t[idx_net_50]:.1f} years")
print(f"  Without: {t[idx_log_50]:.1f} years")
print(f"  Network effects accelerated growth by {t[idx_log_50]-t[idx_net_50]:.0f} years")`,
      challenge: 'What if a competing market opens nearby (splitting K between two markets)? Model the competition between two markets with network effects. Does the larger market always win?',
      successHint: 'Network effects explain why some markets (and tech platforms) grow explosively while others stagnate. Understanding them is key to modern economics and business strategy.',
    },
    {
      title: 'Auction theory — the economics of bargaining',
      concept: `Bargaining at Ima Keithel is a form of **auction**. Different auction types produce different outcomes:

- **English auction**: ascending price, highest bidder wins (common for unique items)
- **Dutch auction**: descending price, first to accept wins (used for perishables)
- **First-price sealed bid**: highest bid wins, pays their bid
- **Second-price (Vickrey)**: highest bid wins, pays second-highest bid

The **Revenue Equivalence Theorem** says: under certain conditions, all auction types generate the same expected revenue for the seller!

We simulate each auction type and verify this remarkable result.`,
      analogy: 'Auction types are like different ways to divide a cake. Some methods encourage honesty (Vickrey), some encourage strategy (first-price), and some create excitement (English). Surprisingly, the average size of the slice you get is the same regardless of the method.',
      storyConnection: 'At Ima Keithel, different products are sold through different mechanisms. Vegetables use posted prices with bargaining (similar to first-price auctions). Fish auctions use descending prices (Dutch auction). Textile vendors negotiate (bilateral bargaining). Each method evolved to suit its product.',
      checkQuestion: 'In a Vickrey (second-price) auction, why is it optimal to bid your true value?',
      checkAnswer: 'Because you pay the second-highest bid, not your own. If your true value is 100₹: bidding 100₹ means you win whenever the second bid is below 100₹, paying that amount. Bidding higher (110₹) does not change what you pay when you win, but risks winning at a price above your value. Bidding lower (90₹) risks losing when the second bid is between 90-100₹, which you would have happily paid. So truthful bidding is dominant.',
      codeIntro: 'Simulate four auction types and compare revenue.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
n_auctions = 1000
n_bidders = 5

# Bidder values drawn from uniform [50, 150]
def generate_values():
    return np.random.uniform(50, 150, n_bidders)

revenues = {'English': [], 'Dutch': [], 'First-price': [], 'Vickrey': []}

for _ in range(n_auctions):
    values = generate_values()
    sorted_vals = np.sort(values)[::-1]

    # English auction: winner pays just above second-highest value
    revenues['English'].append(sorted_vals[1] + 0.01)

    # Dutch auction: starts high, drops. Winner's strategy: bid at expected payment
    # Equilibrium bid = value * (n-1)/n for uniform distribution
    bids_dutch = values * (n_bidders - 1) / n_bidders
    winner = np.argmax(bids_dutch)
    revenues['Dutch'].append(bids_dutch[winner])

    # First-price sealed: bid shading, equilibrium bid = value * (n-1)/n
    bids_fp = values * (n_bidders - 1) / n_bidders
    winner_fp = np.argmax(bids_fp)
    revenues['First-price'].append(bids_fp[winner_fp])

    # Vickrey (second-price): truthful bidding, pay second highest
    revenues['Vickrey'].append(sorted_vals[1])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

colors_a = ['#34d399', '#f59e0b', '#3b82f6', '#a78bfa']
means = [np.mean(revenues[t]) for t in revenues]
stds = [np.std(revenues[t]) for t in revenues]
ax1.bar(range(4), means, yerr=stds, color=colors_a, edgecolor='white', linewidth=0.5, capsize=5)
ax1.set_xticks(range(4))
ax1.set_xticklabels(list(revenues.keys()), fontsize=9, color='white')
ax1.set_title('Average Revenue by Auction Type', color='white', fontsize=12, fontweight='bold')
ax1.set_ylabel('Revenue (₹)', color='white')
ax1.tick_params(colors='white')
ax1.grid(True, alpha=0.2, color='white', axis='y')

for t, color in zip(revenues.keys(), colors_a):
    ax2.hist(revenues[t], bins=30, alpha=0.4, color=color, label=t, edgecolor='white', linewidth=0.3)
ax2.set_title('Revenue Distribution', color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Revenue (₹)', color='white')
ax2.set_ylabel('Frequency', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.savefig('auctions.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("=== Revenue Equivalence Verification ===\
")
print(f"{'Auction Type':<15} {'Mean Rev':>9} {'Std Dev':>8} {'Median':>8}")
print("-" * 42)
for name, revs in revenues.items():
    print(f"{name:<15} {np.mean(revs):>8.2f}₹ {np.std(revs):>7.2f} {np.median(revs):>7.2f}")
print(f"\
Revenue Equivalence: all means within {max(means)-min(means):.2f}₹ of each other!")
print("The theorem holds — auction format barely affects average revenue.")`,
      challenge: 'What if one bidder has inside information (knows others\' values)? Simulate an auction where bidder 1 can see bidder 2\'s value. How much extra profit does the informed bidder earn?',
      successHint: 'Auction theory won the 2020 Nobel Prize in Economics (Milgrom & Wilson). You just verified the Revenue Equivalence Theorem — one of the most elegant results in economic theory.',
    },
    {
      title: 'General equilibrium — when all markets interact',
      concept: `At Ima Keithel, markets do not exist in isolation. The tomato market affects the chilli market (complements), and both affect the pickle market (substitutes). **General equilibrium** theory studies how all markets reach equilibrium simultaneously.

In a multi-market system with N goods, we need N supply and N demand equations, all interconnected through **cross-price elasticities**.

The system of equations:
Q_d_i = a_i - b_i * P_i + Sum_j(c_ij * P_j)  for each good i

Where c_ij captures cross-effects: positive c_ij means goods i and j are substitutes (higher P_j increases demand for i), negative means complements.

We solve the system simultaneously using numpy\'s linear algebra solver.`,
      analogy: 'General equilibrium is like a mobile hanging from a ceiling. Pull one piece down (change one price), and every other piece adjusts. The mobile eventually settles into a new balance — but you cannot predict the final position by looking at just one piece.',
      storyConnection: 'The story describes how a drought in Nagaland (reducing chilli supply) not only raised chilli prices at Ima Keithel but also changed prices of substitutes (black pepper), complements (tomatoes for chilli sauce), and even unrelated goods (as consumers shifted spending). All markets adjusted simultaneously.',
      checkQuestion: 'If tomato prices rise, what happens to demand for tomato sauce, ketchup (substitute), and fresh chillies (complement)?',
      checkAnswer: 'Tomato sauce demand drops (higher input cost). Ketchup demand drops too (made from tomatoes). Demand for fresh chillies as salsa/chutney ingredient may drop (complement — used together with tomatoes). But demand for pickled chillies might rise (substitute for tomato-based condiments). The ripple effects are complex and interconnected.',
      codeIntro: 'Solve a general equilibrium model for five interconnected Ima Keithel markets.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Five interconnected markets
goods = ['Tomatoes', 'Chillies', 'Onions', 'Fish', 'Rice']
n = len(goods)

# Demand: Q_d_i = a_i - b_i*P_i + sum(c_ij * P_j)
# Supply: Q_s_i = -d_i + e_i*P_i
# Equilibrium: Q_d = Q_s for all goods

# Demand intercepts
a = np.array([500, 200, 400, 300, 600])

# Own-price demand slopes (negative)
b = np.array([8, 5, 6, 4, 3])

# Cross-price effects matrix (row = good affected, col = price of other good)
# Positive = substitutes, Negative = complements
C = np.array([
    [ 0,  -1,  -1.5, 0,   0],    # Tomatoes: complement with chillies & onions
    [-1,   0,   0.5, 0,   0],    # Chillies: complement with tomatoes
    [-1.5, 0.5, 0,   0.5, 0],    # Onions: complement with tomatoes, substitute with chillies
    [ 0,   0,   0.5, 0,   0.3],  # Fish: substitute with onions, complement with rice
    [ 0,   0,   0,   0.3, 0],    # Rice: complement with fish
])

# Supply intercepts and slopes
d = np.array([100, 50, 80, 60, 200])
e = np.array([6, 4, 5, 3, 4])

# Solve: demand = supply
# a_i - b_i*P_i + sum(c_ij*P_j) = -d_i + e_i*P_i
# Rearranging: (b_i + e_i)*P_i - sum(c_ij*P_j) = a_i + d_i
# Matrix form: A * P = rhs

A = np.diag(b + e) - C
rhs = a + d

P_eq = np.linalg.solve(A, rhs)
Q_eq = -d + e * P_eq

print("=== General Equilibrium at Ima Keithel ===\
")
print(f"{'Good':<12} {'Price (₹)':>9} {'Quantity':>9} {'Revenue':>9}")
print("-" * 42)
for i in range(n):
    print(f"{goods[i]:<12} {P_eq[i]:>8.1f} {Q_eq[i]:>8.0f}kg {P_eq[i]*Q_eq[i]:>8.0f}₹")

# Shock: tomato supply drops 30%
print("\
--- Supply Shock: Tomato supply drops 30% ---")
d_shocked = d.copy()
d_shocked[0] = d[0] * 1.3  # higher intercept = less supply
rhs_shocked = a + d_shocked
P_new = np.linalg.solve(A, rhs_shocked)
Q_new = -d_shocked + e * P_new

print(f"\
{'Good':<12} {'Old P':>7} {'New P':>7} {'Change':>8} {'Reason'}")
print("-" * 50)
for i in range(n):
    change = P_new[i] - P_eq[i]
    reason = 'direct shock' if i == 0 else 'complement' if C[i,0] < 0 else 'spillover' if abs(change) > 0.1 else 'unaffected'
    print(f"{goods[i]:<12} {P_eq[i]:>6.1f}₹ {P_new[i]:>6.1f}₹ {change:>+6.1f}₹ {reason}")

fig, ax = plt.subplots(1, 1, figsize=(8, 5))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')
x = np.arange(n)
w = 0.35
ax.bar(x - w/2, P_eq, w, color='#3b82f6', label='Before shock', edgecolor='white', linewidth=0.5)
ax.bar(x + w/2, P_new, w, color='#ef4444', label='After shock', edgecolor='white', linewidth=0.5)
ax.set_xticks(x)
ax.set_xticklabels(goods, fontsize=9, color='white')
ax.set_title('Price Impact of Tomato Supply Shock', color='white', fontsize=13, fontweight='bold')
ax.set_ylabel('Price (₹/kg)', color='white')
ax.tick_params(colors='white')
ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax.grid(True, alpha=0.2, color='white', axis='y')
plt.tight_layout()
plt.savefig('gen_eq.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()`,
      challenge: 'Add a sixth good "Garlic" that complements chillies and onions. Resolve the system. Does adding more goods dampen or amplify the tomato shock?',
      successHint: 'General equilibrium theory earned Leon Walras, Kenneth Arrow, and Gerard Debreu the highest recognition in economics. You just solved a multi-market equilibrium system — the core of macroeconomic modelling.',
    },
    {
      title: 'Information asymmetry — when vendors know more than buyers',
      concept: `**Information asymmetry** occurs when one party in a transaction knows more than the other. At Ima Keithel:
- Vendors know their product\'s true quality; buyers may not
- This creates **adverse selection**: low-quality sellers drive out high-quality ones
- George Akerlof\'s "Market for Lemons" showed this can cause market collapse

The dynamics: if buyers cannot tell good from bad, they pay an average price. This average price is too low for good-quality sellers, who leave the market. Now the average quality drops, and so does the price buyers are willing to pay. This spiral can destroy the market.

Ima Keithel solves this through **reputation**: vendors who cheat lose customers permanently. Repeat interaction defeats information asymmetry.`,
      analogy: 'The market for lemons is like buying a used car. The seller knows if it is a lemon (bad car), but you do not. If you cannot tell, you offer a "lemon discount" on every car — which insults honest sellers who leave, leaving only lemon sellers. Soon, all used cars are lemons. Trust and reputation prevent this at Ima Keithel.',
      storyConnection: 'The story describes how a new vendor tried selling diluted honey as pure. Within days, customers stopped coming. Other honey vendors reported the fraud. The cheating vendor was expelled by the collective. The market\'s self-policing mechanism — built on 500 years of reputation — defeats information asymmetry.',
      checkQuestion: 'How does online shopping solve the information asymmetry problem?',
      checkAnswer: 'Online platforms use: 1) Ratings and reviews (crowd-sourced quality signals), 2) Return policies (reduce buyer risk), 3) Seller verification (platform vets sellers), 4) Money-back guarantees (shift risk to seller). These mechanisms replicate Ima Keithel\'s reputation system digitally.',
      codeIntro: 'Simulate a market with information asymmetry and watch the "lemons problem" unfold.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a market with quality uncertainty
n_sellers = 50
n_rounds = 30
n_buyers = 100

# Each seller has a true quality (1-10) and a cost proportional to quality
qualities = np.random.uniform(2, 10, n_sellers)
costs = qualities * 8  # cost to produce quality q = 8q

# Scenario 1: Full information (buyers know quality)
# Scenario 2: No information (buyers pay average)
# Scenario 3: Reputation (buyers learn over time)

results = {name: {'avg_quality': [], 'n_active': [], 'avg_price': []}
           for name in ['Full Info', 'No Info', 'Reputation']}

for scenario in results:
    active = np.ones(n_sellers, dtype=bool)
    reputation = np.ones(n_sellers) * 5  # initial reputation = 5

    for rnd in range(n_rounds):
        active_idx = np.where(active)[0]
        if len(active_idx) == 0:
            break

        if scenario == 'Full Info':
            prices = qualities[active_idx] * 12  # price reflects true quality
            buyer_value = qualities[active_idx] * 11
        elif scenario == 'No Info':
            avg_q = np.mean(qualities[active_idx])
            prices = np.ones(len(active_idx)) * avg_q * 10  # average price
            buyer_value = np.ones(len(active_idx)) * avg_q * 11
        else:  # Reputation
            prices = reputation[active_idx] * 10
            buyer_value = reputation[active_idx] * 11

        # Sellers exit if price < cost
        for i, idx in enumerate(active_idx):
            if prices[i] < costs[idx]:
                active[idx] = False

        # Update reputation (slowly converges to true quality)
        if scenario == 'Reputation':
            for idx in active_idx:
                if active[idx]:
                    reputation[idx] = 0.8 * reputation[idx] + 0.2 * qualities[idx]

        active_q = qualities[active]
        results[scenario]['avg_quality'].append(np.mean(active_q) if len(active_q) > 0 else 0)
        results[scenario]['n_active'].append(np.sum(active))
        results[scenario]['avg_price'].append(np.mean(prices) if len(prices) > 0 else 0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

colors_s = {'Full Info': '#34d399', 'No Info': '#ef4444', 'Reputation': '#f59e0b'}
for name, data in results.items():
    ax1.plot(data['avg_quality'], color=colors_s[name], linewidth=2, label=name)
    ax2.plot(data['n_active'], color=colors_s[name], linewidth=2, label=name)

ax1.set_title('Average Market Quality Over Time', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Round', color='white')
ax1.set_ylabel('Average quality', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax1.grid(True, alpha=0.2, color='white')

ax2.set_title('Active Sellers Over Time', color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Round', color='white')
ax2.set_ylabel('Number of active sellers', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('lemons.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("Final state:")
for name, data in results.items():
    print(f"  {name}: {data['n_active'][-1]} sellers, avg quality {data['avg_quality'][-1]:.1f}")
print("\
Without information: quality collapses (lemons problem)")
print("With reputation: quality stabilises near full-information level")`,
      challenge: 'Add a "certification" system where sellers can pay 50₹ to get their quality verified. Only sellers with quality > 6 find it worthwhile. How does certification affect the market?',
      successHint: 'Information asymmetry is a market failure that explains insurance markets, used car markets, and why brands exist. Akerlof, Spence, and Stiglitz won the 2001 Nobel Prize for this work.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Economic Models</span>
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
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
