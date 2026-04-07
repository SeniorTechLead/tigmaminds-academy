import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MarketDayLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Supply and demand curves — the foundation of market pricing',
      concept: `The law of demand states that as price increases, quantity demanded decreases (holding other factors constant). This inverse relationship produces a downward-sloping demand curve: Qd = a - b*P, where a is the maximum quantity demanded at zero price and b is the demand sensitivity. The law of supply states the opposite: higher prices incentivize producers to supply more. The supply curve slopes upward: Qs = c + d*P, where c is base supply and d is supply sensitivity.

Market equilibrium occurs where supply equals demand: Qd = Qs, solving for P* = (a - c)/(b + d) and Q* = a - b*P*. At prices above equilibrium, surplus develops (supply > demand); below equilibrium, shortage occurs (demand > supply). The market naturally corrects toward equilibrium through price adjustment.

Shifts vs. movements: a change in price causes movement along the curves. A change in other factors (income, preferences, input costs, technology) shifts the entire curve. For the Tura market, seasonal factors like harvest timing, festival demand, and monsoon disruptions shift both supply and demand curves throughout the year.`,
      analogy: 'Imagine an auction for oranges. When the auctioneer starts at a high price, few buyers raise their hands (low demand). As the price drops, more people want oranges (movement along demand curve). Meanwhile, at low prices, farmers bring fewer oranges (low supply). The price where the number of willing buyers exactly equals the number of available oranges is the equilibrium — the market finds this price naturally through negotiation.',
      storyConnection: 'On market day in Tura, vendors and buyers negotiate prices for produce, handicrafts, and goods. Each transaction is a micro-experiment in supply and demand. When a bumper crop floods the market (supply shift right), prices drop. When a festival increases demand for specific items (demand shift right), prices rise. The market day is a living demonstration of economic equilibrium.',
      checkQuestion: 'In the Tura market, oranges have demand Qd = 500 - 20P and supply Qs = -100 + 30P (Q in kg, P in Rs). Find the equilibrium. If monsoon damage reduces supply to Qs = -200 + 30P, what happens to price and quantity?',
      checkAnswer: 'Normal equilibrium: 500 - 20P = -100 + 30P → 600 = 50P → P* = 12 Rs, Q* = 500 - 240 = 260 kg. After monsoon (supply shifts left): 500 - 20P = -200 + 30P → 700 = 50P → P* = 14 Rs, Q* = 500 - 280 = 220 kg. The monsoon raises price by Rs 2 (17%) and reduces quantity by 40 kg (15%). Consumers pay more and get less — the cost of the natural disaster is shared between higher prices (consumer burden) and lower sales (producer burden).',
      codeIntro: 'Model supply and demand curves, find equilibrium, and simulate how market shocks affect prices and quantities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Supply and demand model
def demand(P, a=500, b=20):
    return np.maximum(a - b * P, 0)

def supply(P, c=-100, d=30):
    return np.maximum(c + d * P, 0)

def equilibrium(a, b, c, d):
    P_star = (a - c) / (b + d)
    Q_star = a - b * P_star
    return P_star, Q_star

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Basic supply and demand
ax = axes[0, 0]
ax.set_facecolor('#111827')
P_range = np.linspace(0, 25, 200)
Qd = demand(P_range)
Qs = supply(P_range)
P_eq, Q_eq = equilibrium(500, 20, -100, 30)

ax.plot(Qd, P_range, color='#3b82f6', linewidth=2.5, label='Demand')
ax.plot(Qs, P_range, color='#ef4444', linewidth=2.5, label='Supply')
ax.plot(Q_eq, P_eq, 'o', color='#fbbf24', markersize=12, zorder=5)
ax.annotate(f'Equilibrium\\\nP={P_eq:.0f} Rs, Q={Q_eq:.0f} kg',
            (Q_eq, P_eq), textcoords='offset points', xytext=(60, 20),
            color='#fbbf24', fontsize=10, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#fbbf24'))
# Shade surplus and shortage regions
ax.fill_betweenx(P_range, Qd, Qs, where=P_range > P_eq, alpha=0.1, color='#ef4444', label='Surplus')
ax.fill_betweenx(P_range, Qs, Qd, where=P_range < P_eq, alpha=0.1, color='#3b82f6', label='Shortage')
ax.set_xlabel('Quantity (kg)', color='white')
ax.set_ylabel('Price (Rs)', color='white')
ax.set_title('Supply & Demand — Tura Market Oranges', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Supply shift (monsoon damage)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
Qs_normal = supply(P_range)
Qs_monsoon = supply(P_range, c=-200, d=30)
P_eq2, Q_eq2 = equilibrium(500, 20, -200, 30)

ax2.plot(Qd, P_range, color='#3b82f6', linewidth=2.5, label='Demand')
ax2.plot(Qs_normal, P_range, color='#22c55e', linewidth=2, linestyle='--', label='Supply (normal)', alpha=0.6)
ax2.plot(Qs_monsoon, P_range, color='#ef4444', linewidth=2.5, label='Supply (monsoon)')
ax2.plot(Q_eq, P_eq, 'o', color='#22c55e', markersize=10, alpha=0.6)
ax2.plot(Q_eq2, P_eq2, 'o', color='#fbbf24', markersize=12)
ax2.annotate(f'New eq: P={P_eq2:.0f}, Q={Q_eq2:.0f}', (Q_eq2, P_eq2),
            textcoords='offset points', xytext=(50, 10), color='#fbbf24', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#fbbf24'))
ax2.set_xlabel('Quantity (kg)', color='white')
ax2.set_ylabel('Price (Rs)', color='white')
ax2.set_title('Supply Shock: Monsoon Damage', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Multiple goods — seasonal price variation
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
months = np.arange(1, 13)
month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
goods = [
    ('Oranges', [15, 14, 12, 10, 11, 13, 16, 18, 17, 14, 12, 13], '#f59e0b'),
    ('Rice', [25, 24, 23, 22, 22, 24, 26, 28, 27, 25, 23, 24], '#22c55e'),
    ('Ginger', [40, 35, 30, 28, 32, 38, 45, 50, 48, 42, 35, 38], '#ef4444'),
    ('Bamboo shoots', [20, 18, 15, 12, 14, 22, 30, 35, 32, 25, 20, 18], '#3b82f6'),
]
for name, prices, color in goods:
    ax3.plot(months, prices, 'o-', color=color, linewidth=2, label=name, markersize=6)
ax3.axvspan(6, 9, alpha=0.1, color='#3b82f6', label='Monsoon season')
ax3.set_xticks(months)
ax3.set_xticklabels(month_names, fontsize=7)
ax3.set_xlabel('Month', color='white')
ax3.set_ylabel('Price (Rs/kg)', color='white')
ax3.set_title('Seasonal Price Variation in Tura Market', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Price adjustment dynamics
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Simulate market converging to equilibrium
time = np.arange(0, 30)
P_init = 20  # start above equilibrium
P_path = np.zeros(len(time))
P_path[0] = P_init
adjustment_speed = 0.15
for t in range(1, len(time)):
    excess_supply = supply(P_path[t-1]) - demand(P_path[t-1])
    P_path[t] = P_path[t-1] - adjustment_speed * excess_supply / 50
    P_path[t] = max(0, P_path[t])

ax4.plot(time, P_path, color='#3b82f6', linewidth=2.5, label='Price path')
ax4.axhline(P_eq, color='#fbbf24', linestyle='--', linewidth=1.5, label=f'Equilibrium (Rs {P_eq:.0f})')
ax4.fill_between(time, P_eq, P_path, where=P_path > P_eq, alpha=0.2, color='#ef4444', label='Price above eq (surplus)')
ax4.fill_between(time, P_eq, P_path, where=P_path < P_eq, alpha=0.2, color='#22c55e', label='Price below eq (shortage)')
ax4.set_xlabel('Market rounds (time)', color='white')
ax4.set_ylabel('Price (Rs)', color='white')
ax4.set_title('Price Convergence to Equilibrium', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    SUPPLY & DEMAND — TURA MARKET MODEL")
print("=" * 60)
print(f"\\\nNormal equilibrium: P* = Rs {P_eq:.0f}, Q* = {Q_eq:.0f} kg")
print(f"After monsoon: P* = Rs {P_eq2:.0f}, Q* = {Q_eq2:.0f} kg")
print(f"Price increase: Rs {P_eq2 - P_eq:.0f} ({(P_eq2-P_eq)/P_eq*100:.0f}%)")
print(f"Quantity decrease: {Q_eq - Q_eq2:.0f} kg ({(Q_eq-Q_eq2)/Q_eq*100:.0f}%)")`,
      challenge: 'Add a government price floor (minimum support price) to the model. Show what happens when the floor is set above equilibrium — calculate the resulting surplus and the cost to the government of buying the excess.',
      successHint: 'You have modeled the fundamental economic mechanism behind every market day — supply and demand finding equilibrium through price adjustment.',
    },
    {
      title: 'Price elasticity — how sensitive are buyers and sellers to price changes?',
      concept: `Price elasticity of demand (PED) measures how much quantity demanded changes in response to a price change: PED = (%ΔQd) / (%ΔP) = (dQ/dP) × (P/Q). For a linear demand curve Qd = a - bP, PED = -b × P/Q. Elasticity varies along the curve: at high prices (low Q), demand is elastic (|PED| > 1) — a small price cut brings many new buyers. At low prices (high Q), demand is inelastic (|PED| < 0) — further price cuts barely increase sales.

Elastic goods (|PED| > 1) include luxuries and goods with substitutes. Inelastic goods (|PED| < 1) include necessities (rice, salt) and addictive goods. Cross-price elasticity measures how demand for one good responds to another's price: positive means substitutes (beef price rises → chicken demand rises), negative means complements (phone price rises → phone case demand falls).

Revenue maximization occurs at unit elasticity (|PED| = 1): R = P × Q, and dR/dP = Q(1 + 1/PED) = 0 when PED = -1. This has practical implications: if demand is elastic, lowering price increases revenue; if inelastic, raising price increases revenue. The vendor at the Tura market intuitively adjusts prices to maximize revenue, finding the sweet spot where each price change just balances quantity change.`,
      analogy: 'Elasticity is like a rubber band connecting price and quantity. For rice (inelastic), the band is stiff — pulling price up barely stretches demand down. People need rice regardless. For mangoes in mango season (elastic), the band is stretchy — a small price increase causes a big drop in sales because people easily switch to other fruits. The vendor must know how stretchy each good\'s demand band is to set the right price.',
      storyConnection: 'At the Tura market, vendors of essential goods (rice, salt, oil) can charge more because demand is inelastic — buyers must have these items. But vendors of seasonal fruits face elastic demand — if they price too high, customers walk to the next stall or buy a different fruit. Market day is a live experiment in price elasticity, with each vendor unconsciously calculating elasticity for their goods.',
      checkQuestion: 'A ginger vendor at Tura market sells 50 kg/day at Rs 40/kg. She raises the price to Rs 44/kg and sells 42 kg. Calculate PED. Is demand elastic or inelastic? What happened to her daily revenue? Should she raise or lower price to maximize revenue?',
      checkAnswer: 'PED = (%ΔQ/%ΔP) = ((42-50)/50) / ((44-40)/40) = (-16%/10%) = -1.6. |PED| = 1.6 > 1, so demand is elastic. Revenue before: 50 × 40 = Rs 2000. Revenue after: 42 × 44 = Rs 1848. Revenue fell by Rs 152 because demand is elastic — the quantity lost exceeds the per-unit gain. She should lower price (or at least not raise it further). Maximum revenue is at PED = -1, which occurs at P = 25 / 2 × (500/20) = Rs 12.5 for the simple linear model.',
      codeIntro: 'Model price elasticity for different goods, visualize how elasticity varies along the demand curve, and find revenue-maximizing prices.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def demand_linear(P, a, b):
    return np.maximum(a - b * P, 0)

def elasticity(P, a, b):
    Q = demand_linear(P, a, b)
    return np.where(Q > 0, -b * P / Q, 0)

def revenue(P, a, b):
    return P * demand_linear(P, a, b)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Elasticity varies along demand curve
ax = axes[0, 0]
ax.set_facecolor('#111827')
a, b = 500, 20
P = np.linspace(0.5, 24, 200)
Q = demand_linear(P, a, b)
ped = elasticity(P, a, b)

ax.plot(Q, P, color='#3b82f6', linewidth=2.5)
# Color the curve by elasticity
for i in range(len(P)-1):
    color = '#ef4444' if abs(ped[i]) > 1 else '#22c55e'
    ax.plot([Q[i], Q[i+1]], [P[i], P[i+1]], color=color, linewidth=3)
# Mark unit elasticity
idx_unit = np.argmin(np.abs(np.abs(ped) - 1))
ax.plot(Q[idx_unit], P[idx_unit], 'o', color='#fbbf24', markersize=12, zorder=5)
ax.annotate(f'|PED|=1\\\nP={P[idx_unit]:.0f}, Q={Q[idx_unit]:.0f}',
            (Q[idx_unit], P[idx_unit]), textcoords='offset points', xytext=(50, 0),
            color='#fbbf24', fontsize=10, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#fbbf24'))
ax.text(50, 22, 'ELASTIC (|PED|>1)', color='#ef4444', fontsize=10, fontweight='bold')
ax.text(350, 5, 'INELASTIC (|PED|<1)', color='#22c55e', fontsize=10, fontweight='bold')
ax.set_xlabel('Quantity (kg)', color='white')
ax.set_ylabel('Price (Rs)', color='white')
ax.set_title('Elasticity Varies Along Demand Curve', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 2: Revenue vs price (maximum at unit elasticity)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
P_range = np.linspace(0.5, 24, 200)
R = revenue(P_range, a, b)
R_max_idx = np.argmax(R)
ax2.plot(P_range, R, color='#3b82f6', linewidth=2.5)
ax2.fill_between(P_range, 0, R, alpha=0.1, color='#3b82f6')
ax2.plot(P_range[R_max_idx], R[R_max_idx], '*', color='#fbbf24', markersize=15, zorder=5)
ax2.axvline(P_range[R_max_idx], color='#fbbf24', linestyle='--', linewidth=1)
ax2.text(P_range[R_max_idx] + 0.5, R[R_max_idx] - 200,
         f'Max revenue\\\nP = Rs {P_range[R_max_idx]:.0f}\\\nR = Rs {R[R_max_idx]:.0f}',
         color='#fbbf24', fontsize=10)
ax2.set_xlabel('Price (Rs)', color='white')
ax2.set_ylabel('Revenue (Rs)', color='white')
ax2.set_title('Revenue Maximization', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(colors='gray')

# Plot 3: Elasticity comparison across goods
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
goods = [
    ('Rice (necessity)', 1000, 10, '#22c55e'),    # very inelastic
    ('Oranges', 500, 20, '#f59e0b'),              # moderate
    ('Mangoes (seasonal)', 300, 25, '#ef4444'),    # elastic
    ('Handicrafts (luxury)', 100, 15, '#3b82f6'),  # elastic
]
P_test = 15  # reference price
for name, a_g, b_g, color in goods:
    P_g = np.linspace(0.5, a_g/b_g - 0.5, 200)
    Q_g = demand_linear(P_g, a_g, b_g)
    ax3.plot(Q_g, P_g, color=color, linewidth=2, label=name)
    ped_at_test = elasticity(P_test, a_g, b_g)
    if demand_linear(P_test, a_g, b_g) > 0:
        ax3.plot(demand_linear(P_test, a_g, b_g), P_test, 'o', color=color, markersize=8)
ax3.axhline(P_test, color='gray', linestyle=':', linewidth=0.5)
ax3.set_xlabel('Quantity', color='white')
ax3.set_ylabel('Price (Rs)', color='white')
ax3.set_title('Demand Curves: Different Goods', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Cross-price elasticity — substitutes and complements
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
price_change = np.linspace(-30, 30, 200)  # % change in Good A price
substitutes = 0.8 * price_change + np.random.normal(0, 3, 200)  # positive: A↑ → B↑
complements = -0.5 * price_change + np.random.normal(0, 3, 200)  # negative: A↑ → B↓
independent = 0.0 * price_change + np.random.normal(0, 5, 200)

ax4.scatter(price_change, substitutes, c='#ef4444', s=15, alpha=0.5, label='Chicken (sub for fish)')
ax4.scatter(price_change, complements, c='#3b82f6', s=15, alpha=0.5, label='Chili paste (comp)')
ax4.scatter(price_change, independent, c='gray', s=15, alpha=0.3, label='Bamboo (independent)')
# Trend lines
ax4.plot([-30, 30], [-30*0.8, 30*0.8], color='#ef4444', linewidth=2, linestyle='--')
ax4.plot([-30, 30], [30*0.5, -30*0.5], color='#3b82f6', linewidth=2, linestyle='--')
ax4.axhline(0, color='gray', linewidth=0.5)
ax4.axvline(0, color='gray', linewidth=0.5)
ax4.set_xlabel('% change in fish price', color='white')
ax4.set_ylabel('% change in demand for other good', color='white')
ax4.set_title('Cross-Price Elasticity', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    PRICE ELASTICITY ANALYSIS — TURA MARKET")
print("=" * 60)
print(f"\\\nElasticity at reference price P={P_test}:")
for name, a_g, b_g, _ in goods:
    ped_val = elasticity(P_test, a_g, b_g)
    q_val = demand_linear(P_test, a_g, b_g)
    if q_val > 0:
        elasticity_type = "ELASTIC" if abs(ped_val) > 1 else "INELASTIC"
        print(f"  {name:<25}: PED = {ped_val:.2f} ({elasticity_type})")
        rev = P_test * q_val
        print(f"    Revenue at P={P_test}: Rs {rev:.0f}")
print(f"\\\nRevenue-maximizing prices:")
for name, a_g, b_g, _ in goods:
    P_opt = a_g / (2 * b_g)
    R_opt = P_opt * demand_linear(P_opt, a_g, b_g)
    print(f"  {name:<25}: P* = Rs {P_opt:.0f}, R* = Rs {R_opt:.0f}")`,
      challenge: 'Model income elasticity: as Tura gets wealthier, demand for luxury goods increases faster than necessities. Simulate how rising incomes shift market composition from mostly necessities to a mix of goods, and predict which vendors will thrive.',
      successHint: 'You have quantified how sensitive buyers are to price changes — the key insight for vendors at any market. Understanding elasticity explains why rice sellers can charge more during shortages but fruit sellers cannot.',
    },
    {
      title: 'Market equilibrium — the invisible hand and price discovery',
      concept: `Adam Smith\'s "invisible hand" describes how individual self-interest leads to collective efficiency. Each buyer tries to minimize what they pay; each seller tries to maximize revenue. Their competing interests converge on the equilibrium price — the only price where neither buyers nor sellers have incentive to change behavior.

Consumer surplus is the difference between what buyers are willing to pay and what they actually pay: CS = ∫₀^Q* (Pd(Q) - P*)dQ. Producer surplus is the difference between the market price and the minimum price sellers would accept: PS = ∫₀^Q* (P* - Ps(Q))dQ. Total economic surplus = CS + PS is maximized at the competitive equilibrium — any deviation (price controls, taxes, monopoly) reduces total surplus (deadweight loss).

Market efficiency requires: (1) many buyers and sellers (no single entity controls price), (2) perfect information (everyone knows prices), (3) homogeneous goods (one orange is like another), and (4) free entry and exit. The Tura market approximates these conditions: many small vendors, buyers can see and compare goods, produce is similar across stalls, and anyone can set up a stall. This is why local markets often approach textbook competitive equilibrium.`,
      analogy: 'Consumer and producer surplus are like the "deals" each side gets in a transaction. If you would pay Rs 50 for a mango but only pay Rs 30, your surplus is Rs 20 — the value of the deal you got. If the seller would accept Rs 15 but gets Rs 30, their surplus is Rs 15. Together, you created Rs 35 of total value from a single transaction. The market equilibrium is the point where the total of all these "deals" across all transactions is maximized — no other price creates more total value.',
      storyConnection: 'Market day in Tura is the invisible hand in action. No central planner decides prices — they emerge from thousands of small negotiations between vendors and buyers. By afternoon, prices have usually converged to a stable level. This spontaneous price discovery is one of the most remarkable phenomena in economics, and you can watch it happen in real time at any market day.',
      checkQuestion: 'At equilibrium (P*=12, Q*=260), calculate consumer surplus and producer surplus given Qd = 500 - 20P and Qs = -100 + 30P. If the government imposes a price ceiling of Rs 8, what is the deadweight loss?',
      checkAnswer: 'CS = (1/2) × (25 - 12) × 260 = (1/2) × 13 × 260 = Rs 1690 (area of triangle above P* below demand). PS = (1/2) × (12 - 3.33) × 260 = (1/2) × 8.67 × 260 = Rs 1127 (triangle below P* above supply). Total surplus = Rs 2817. At P=8 ceiling: Qd = 340, Qs = 140. Only 140 units trade. New CS ≈ (1/2)(25-8)×140 + 0 correction terms... The deadweight loss = (1/2)(12-8)(260-140) = (1/2)(4)(120) = Rs 240. This represents value destroyed by the price control.',
      codeIntro: 'Calculate consumer and producer surplus, model deadweight loss from price controls, and visualize market efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def demand_inv(Q, a=500, b=20):
    return (a - Q) / b

def supply_inv(Q, c=-100, d=30):
    return (Q - c) / d

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

a, b, c, d_param = 500, 20, -100, 30
P_eq = (a - c) / (b + d_param)
Q_eq = a - b * P_eq
P_max = a / b  # price where demand = 0
P_min = -c / d_param  # price where supply = 0

# Plot 1: Consumer and producer surplus
ax = axes[0, 0]
ax.set_facecolor('#111827')
Q_range = np.linspace(0, 400, 200)
P_demand = demand_inv(Q_range)
P_supply = supply_inv(Q_range)

ax.plot(Q_range, P_demand, color='#3b82f6', linewidth=2.5, label='Demand')
ax.plot(Q_range, P_supply, color='#ef4444', linewidth=2.5, label='Supply')
ax.axhline(P_eq, color='#fbbf24', linestyle='--', linewidth=1)

# Shade CS (above price, below demand, left of Q*)
Q_cs = np.linspace(0, Q_eq, 100)
ax.fill_between(Q_cs, P_eq, demand_inv(Q_cs), alpha=0.3, color='#3b82f6', label='Consumer surplus')
# Shade PS (below price, above supply, left of Q*)
Q_ps = np.linspace(0, Q_eq, 100)
ax.fill_between(Q_ps, supply_inv(Q_ps), P_eq, alpha=0.3, color='#ef4444', label='Producer surplus')

CS = 0.5 * (P_max - P_eq) * Q_eq
PS = 0.5 * (P_eq - P_min) * Q_eq
ax.text(80, 18, f'CS = Rs {CS:.0f}', color='#3b82f6', fontsize=11, fontweight='bold')
ax.text(80, 6, f'PS = Rs {PS:.0f}', color='#ef4444', fontsize=11, fontweight='bold')
ax.set_xlabel('Quantity (kg)', color='white')
ax.set_ylabel('Price (Rs)', color='white')
ax.set_title('Consumer & Producer Surplus', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Price ceiling (deadweight loss)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
P_ceiling = 8
Q_supplied = max(c + d_param * P_ceiling, 0)
Q_demanded = a - b * P_ceiling

ax2.plot(Q_range, P_demand, color='#3b82f6', linewidth=2.5)
ax2.plot(Q_range, P_supply, color='#ef4444', linewidth=2.5)
ax2.axhline(P_ceiling, color='#a855f7', linewidth=2, linestyle='-.', label=f'Price ceiling (Rs {P_ceiling})')
ax2.axhline(P_eq, color='#fbbf24', linewidth=1, linestyle='--', alpha=0.5)

# DWL triangle
Q_dwl = np.linspace(Q_supplied, Q_eq, 50)
P_d_dwl = demand_inv(Q_dwl)
P_s_dwl = supply_inv(Q_dwl)
ax2.fill_between(Q_dwl, P_s_dwl, P_d_dwl, alpha=0.4, color='#a855f7', label='Deadweight loss')

DWL = 0.5 * (P_eq - P_ceiling + (demand_inv(Q_supplied) - supply_inv(Q_supplied))) * 0 # simplified
DWL_simple = 0.5 * (demand_inv(Q_supplied) - supply_inv(Q_supplied)) * (Q_eq - Q_supplied)
ax2.annotate(f'Shortage: {Q_demanded - Q_supplied:.0f} kg', (Q_supplied, P_ceiling),
            textcoords='offset points', xytext=(80, -20), color='#a855f7', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#a855f7'))
ax2.text(200, 20, f'DWL ≈ Rs {DWL_simple:.0f}', color='#a855f7', fontsize=11, fontweight='bold')
ax2.set_xlabel('Quantity (kg)', color='white')
ax2.set_ylabel('Price (Rs)', color='white')
ax2.set_title('Price Ceiling Creates Deadweight Loss', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Tax incidence
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
tax = 4  # Rs per kg
# New supply curve with tax: Qs = c + d*(P - tax)
P_eq_tax = (a - c + d_param * tax) / (b + d_param)
Q_eq_tax = a - b * P_eq_tax
P_seller = P_eq_tax - tax

ax3.plot(Q_range, demand_inv(Q_range), color='#3b82f6', linewidth=2.5, label='Demand')
ax3.plot(Q_range, supply_inv(Q_range), color='#22c55e', linewidth=2, linestyle='--', label='Supply (no tax)', alpha=0.6)
ax3.plot(Q_range, supply_inv(Q_range) + tax, color='#ef4444', linewidth=2.5, label=f'Supply (+ Rs {tax} tax)')
ax3.plot(Q_eq_tax, P_eq_tax, 'o', color='#fbbf24', markersize=10)

# Tax wedge
ax3.annotate('', xy=(Q_eq_tax + 10, P_eq_tax), xytext=(Q_eq_tax + 10, P_seller),
            arrowprops=dict(arrowstyle='<->', color='#f59e0b', lw=2))
ax3.text(Q_eq_tax + 15, (P_eq_tax + P_seller) / 2, f'Tax = Rs {tax}', color='#f59e0b', fontsize=10)

buyer_burden = P_eq_tax - P_eq
seller_burden = P_eq - P_seller
ax3.text(50, 22, f'Buyer pays: +Rs {buyer_burden:.1f}', color='#3b82f6', fontsize=10)
ax3.text(50, 20, f'Seller gets: -Rs {seller_burden:.1f}', color='#ef4444', fontsize=10)
ax3.set_xlabel('Quantity (kg)', color='white')
ax3.set_ylabel('Price (Rs)', color='white')
ax3.set_title(f'Tax Incidence (Rs {tax}/kg tax)', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Total surplus comparison
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
scenarios = ['Free\\\nmarket', f'Price\\\nceiling (Rs {P_ceiling})', f'Tax\\\n(Rs {tax}/kg)', 'Monopoly\\\n(est.)']
cs_vals = [CS, 0.5*(P_max - P_ceiling)*Q_supplied, 0.5*(P_max - P_eq_tax)*Q_eq_tax, 0.5*(P_max-18)*200]
ps_vals = [PS, 0.5*(P_ceiling - P_min)*Q_supplied, 0.5*(P_seller - P_min)*Q_eq_tax, 0.5*(18-P_min)*200]
gov_rev = [0, 0, tax * Q_eq_tax, 0]
dwl_vals = [0, CS+PS - cs_vals[1] - ps_vals[1], CS+PS - cs_vals[2] - ps_vals[2] - gov_rev[2],
            CS+PS - cs_vals[3] - ps_vals[3]]

x = np.arange(len(scenarios))
width = 0.2
ax4.bar(x - 1.5*width, cs_vals, width, color='#3b82f6', alpha=0.8, label='Consumer surplus')
ax4.bar(x - 0.5*width, ps_vals, width, color='#ef4444', alpha=0.8, label='Producer surplus')
ax4.bar(x + 0.5*width, gov_rev, width, color='#22c55e', alpha=0.8, label='Gov. revenue')
ax4.bar(x + 1.5*width, dwl_vals, width, color='#a855f7', alpha=0.8, label='Deadweight loss')
ax4.set_xticks(x)
ax4.set_xticklabels(scenarios, fontsize=8)
ax4.set_ylabel('Value (Rs)', color='white')
ax4.set_title('Welfare Comparison Across Market Structures', color='white', fontsize=11, fontweight='bold')
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    MARKET EQUILIBRIUM & WELFARE ANALYSIS")
print("=" * 60)
print(f"\\\nFree market: CS = Rs {CS:.0f}, PS = Rs {PS:.0f}, Total = Rs {CS+PS:.0f}")
print(f"\\\nPrice ceiling (Rs {P_ceiling}):")
print(f"  Shortage: {Q_demanded - Q_supplied:.0f} kg")
print(f"  DWL: Rs {DWL_simple:.0f}")
print(f"\\\nTax (Rs {tax}/kg):")
print(f"  Buyer burden: Rs {buyer_burden:.1f}/kg ({buyer_burden/tax*100:.0f}% of tax)")
print(f"  Seller burden: Rs {seller_burden:.1f}/kg ({seller_burden/tax*100:.0f}% of tax)")
print(f"  Gov revenue: Rs {tax * Q_eq_tax:.0f}")`,
      challenge: 'Model a price war between two vendors selling the same good. Implement a Cournot duopoly where each vendor chooses quantity to maximize profit given the other\'s quantity choice. Find the Nash equilibrium and compare it to perfect competition and monopoly.',
      successHint: 'You have quantified economic welfare — consumer surplus, producer surplus, and deadweight loss. These concepts explain why free markets are efficient and why price controls create unintended consequences.',
    },
    {
      title: 'Game theory — strategic interactions between market vendors',
      concept: `In a market with multiple vendors selling similar goods, pricing decisions become strategic — each vendor's best price depends on what competitors charge. This is the domain of game theory. The simplest model is the Prisoner's Dilemma applied to pricing: two vendors can either price High (cooperate) or price Low (defect). If both price high, they split the market at good margins. If one prices low while the other stays high, the low-pricer captures most customers. If both price low, they split the market at poor margins.

The Nash equilibrium — where neither player benefits from changing strategy — often results in both pricing low, even though both would prefer the cooperative outcome. This "race to the bottom" explains why competitive markets drive prices toward marginal cost.

More sophisticated models include: Bertrand competition (price competition — firms undercut until P = marginal cost), Cournot competition (quantity competition — firms choose output levels), and Stackelberg (leader-follower, where one firm moves first). For the Tura market, repeated interactions add reputation effects: a vendor who defects (undercuts) today may face retaliation tomorrow, making cooperation sustainable through tit-for-tat strategies.`,
      analogy: 'Game theory at the market is like two neighboring fruit stalls deciding on prices each morning. If both charge Rs 30 for oranges, they each get 50 customers and earn well. If one secretly drops to Rs 25, they steal most customers from the other. But if both drop to Rs 25, they each get 50 customers again — at lower profit. The temptation to undercut is always there, but the fear of retaliation keeps prices stable. This is the market\'s implicit "gentleman\'s agreement."',
      storyConnection: 'On market day in Tura, vendors watch each other\'s prices carefully. A vendor who consistently undercuts neighbors may win short-term sales but face consequences: other vendors might refuse to share customers during their breaks, or coordinate against the undercutter. These social enforcement mechanisms sustain cooperative pricing — game theory in action, enforced by community relationships.',
      checkQuestion: 'Two fish vendors have marginal cost Rs 20/kg. If both price at Rs 40, each sells 30 kg (profit Rs 600 each). If one prices Rs 30 while the other stays at Rs 40, the low-pricer sells 50 kg (profit Rs 500) and the high-pricer sells 10 kg (profit Rs 200). If both price Rs 30, each sells 30 kg (profit Rs 300). What is the Nash equilibrium? Is it efficient?',
      checkAnswer: 'Payoff matrix: (High, High) = (600, 600); (Low, High) = (500, 200); (High, Low) = (200, 500); (Low, Low) = (300, 300). If A prices High: B gets 600 (High) or 500 (Low) → B prefers High. If A prices Low: B gets 200 (High) or 300 (Low) → B prefers Low. Wait — this is NOT a classic PD because B prefers High when A is High. Nash equilibrium is (High, High) = (600, 600) — the cooperative outcome IS the equilibrium here because the undercutting penalty (volume gain doesn\'t offset price loss). This market sustains cooperation naturally.',
      codeIntro: 'Simulate strategic pricing games between market vendors, find Nash equilibria, and model how repeated interactions affect cooperation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Game theory for market vendors
def market_payoff(p1, p2, mc=20, total_demand=60, sensitivity=2):
    """Calculate profit for vendor 1 given both prices."""
    if p1 < p2:
        q1 = min(total_demand * 0.7, total_demand / (1 + np.exp(-sensitivity * (p2 - p1))))
    elif p1 > p2:
        q1 = total_demand - min(total_demand * 0.7, total_demand / (1 + np.exp(-sensitivity * (p1 - p2))))
    else:
        q1 = total_demand / 2
    q1 = max(0, q1)
    return (p1 - mc) * q1

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Payoff matrix heatmap
ax = axes[0, 0]
ax.set_facecolor('#111827')
prices = np.arange(22, 46, 2)
payoff_matrix = np.zeros((len(prices), len(prices)))
for i, p1 in enumerate(prices):
    for j, p2 in enumerate(prices):
        payoff_matrix[i, j] = market_payoff(p1, p2)

im = ax.imshow(payoff_matrix, cmap='RdYlGn', aspect='auto')
ax.set_xticks(range(0, len(prices), 2))
ax.set_yticks(range(0, len(prices), 2))
ax.set_xticklabels([str(p) for p in prices[::2]], fontsize=8)
ax.set_yticklabels([str(p) for p in prices[::2]], fontsize=8)
cbar = plt.colorbar(im, ax=ax)
cbar.set_label('Vendor 1 profit (Rs)', color='white')
cbar.ax.tick_params(colors='gray')
# Mark Nash equilibrium (best response to best response)
best_responses_1 = [np.argmax(payoff_matrix[i, :]) for i in range(len(prices))]
best_responses_2 = [np.argmax(payoff_matrix[:, j]) for j in range(len(prices))]
for i in range(len(prices)):
    if best_responses_2[best_responses_1[i]] == i:
        ax.plot(best_responses_1[i], i, '*', color='white', markersize=15, markeredgecolor='black')
ax.set_xlabel('Vendor 2 price (Rs)', color='white')
ax.set_ylabel('Vendor 1 price (Rs)', color='white')
ax.set_title('Payoff Landscape (Vendor 1)', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 2: Best response curves
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
p2_range = np.linspace(22, 45, 100)
br1 = []
br2 = []
p_test = np.linspace(22, 45, 100)
for p2 in p2_range:
    profits = [market_payoff(p1, p2) for p1 in p_test]
    br1.append(p_test[np.argmax(profits)])
    profits2 = [market_payoff(p2, p1) for p1 in p_test]
    br2.append(p_test[np.argmax(profits2)])

ax2.plot(p2_range, br1, color='#3b82f6', linewidth=2.5, label='Vendor 1 best response')
ax2.plot(br2, p2_range, color='#ef4444', linewidth=2.5, label='Vendor 2 best response')
ax2.plot([22, 45], [22, 45], ':', color='gray', linewidth=0.5)
# Find intersection (Nash equilibrium)
diffs = np.abs(np.array(br1) - p2_range)
ne_idx = np.argmin(diffs)
ax2.plot(p2_range[ne_idx], br1[ne_idx], '*', color='#fbbf24', markersize=15, zorder=5)
ax2.annotate(f'Nash Eq\\\n({p2_range[ne_idx]:.0f}, {br1[ne_idx]:.0f})',
            (p2_range[ne_idx], br1[ne_idx]), textcoords='offset points',
            xytext=(20, 20), color='#fbbf24', fontsize=10, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#fbbf24'))
ax2.set_xlabel('Vendor 2 price (Rs)', color='white')
ax2.set_ylabel('Vendor 1 price (Rs)', color='white')
ax2.set_title('Best Response Curves', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Repeated game — tit-for-tat dynamics
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
n_rounds = 50
strategies = {
    'Always cooperate': lambda hist1, hist2, t: 40,
    'Always defect': lambda hist1, hist2, t: 28,
    'Tit-for-tat': lambda hist1, hist2, t: hist2[t-1] if t > 0 else 40,
    'Random': lambda hist1, hist2, t: np.random.choice([28, 34, 40]),
}
# Simulate tit-for-tat vs always defect
p_tft = np.zeros(n_rounds)
p_defect = np.zeros(n_rounds)
profit_tft = np.zeros(n_rounds)
profit_defect = np.zeros(n_rounds)
for t in range(n_rounds):
    p_tft[t] = p_defect[t-1] if t > 0 else 40
    p_defect[t] = 28
    profit_tft[t] = market_payoff(p_tft[t], p_defect[t])
    profit_defect[t] = market_payoff(p_defect[t], p_tft[t])

ax3.plot(range(n_rounds), np.cumsum(profit_tft), color='#3b82f6', linewidth=2, label='Tit-for-tat')
ax3.plot(range(n_rounds), np.cumsum(profit_defect), color='#ef4444', linewidth=2, label='Always defect')
# Also simulate tit-for-tat vs tit-for-tat
p_tft2a = np.full(n_rounds, 40.0)
profit_tft2 = np.array([market_payoff(40, 40)] * n_rounds)
ax3.plot(range(n_rounds), np.cumsum(profit_tft2), color='#22c55e', linewidth=2,
         linestyle='--', label='TFT vs TFT (cooperation)')
ax3.set_xlabel('Market day (round)', color='white')
ax3.set_ylabel('Cumulative profit (Rs)', color='white')
ax3.set_title('Repeated Game: Strategy Comparison', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Tournament — multiple strategies compete
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
strategy_names = ['Cooperate', 'Defect', 'Tit-for-tat', 'Gradual', 'Random']
n_strat = len(strategy_names)
tournament_profits = np.zeros((n_strat, n_strat))
for i in range(n_strat):
    for j in range(n_strat):
        # Simplified: assign average profit based on strategy pairing
        if i == j:
            tournament_profits[i, j] = 500  # similar strategies → moderate
        elif strategy_names[i] == 'Defect':
            tournament_profits[i, j] = 450 if strategy_names[j] != 'Defect' else 300
        elif strategy_names[i] == 'Cooperate':
            tournament_profits[i, j] = 250 if strategy_names[j] == 'Defect' else 600
        elif strategy_names[i] == 'Tit-for-tat':
            tournament_profits[i, j] = 550 if strategy_names[j] != 'Defect' else 350
        elif strategy_names[i] == 'Gradual':
            tournament_profits[i, j] = 520 if strategy_names[j] != 'Defect' else 380
        else:
            tournament_profits[i, j] = 400 + np.random.randint(-50, 50)

avg_profits = tournament_profits.mean(axis=1)
sorted_idx = np.argsort(avg_profits)[::-1]
colors_strat = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
bars = ax4.barh([strategy_names[i] for i in sorted_idx],
                [avg_profits[i] for i in sorted_idx],
                color=[colors_strat[i] for i in sorted_idx],
                alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, val in zip(bars, [avg_profits[i] for i in sorted_idx]):
    ax4.text(val + 5, bar.get_y() + bar.get_height()/2,
             f'Rs {val:.0f}', va='center', color='white', fontsize=10)
ax4.set_xlabel('Average profit per round (Rs)', color='white')
ax4.set_title('Strategy Tournament Results', color='white', fontsize=12, fontweight='bold')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    GAME THEORY — MARKET VENDOR STRATEGY")
print("=" * 60)
print(f"\\\nNash equilibrium price: Rs {p2_range[ne_idx]:.0f}")
print(f"Equilibrium profit: Rs {market_payoff(p2_range[ne_idx], p2_range[ne_idx]):.0f}")
print(f"\\\nCooperative profit (both at Rs 40): Rs {market_payoff(40, 40):.0f}")
print(f"Defection profit (Rs 28 vs Rs 40): Rs {market_payoff(28, 40):.0f}")
print(f"\\\nTournament rankings:")
for rank, i in enumerate(sorted_idx):
    print(f"  #{rank+1}: {strategy_names[i]:<15} avg profit = Rs {avg_profits[i]:.0f}")`,
      challenge: 'Implement an evolutionary game theory simulation: start with equal populations of each strategy, and after each round, strategies with above-average profit grow while below-average ones shrink. Show which strategy eventually dominates the market.',
      successHint: 'You have modeled the strategic dynamics of market competition — game theory explains why vendors behave as they do and why cooperative market norms persist through repeated interactions.',
    },
    {
      title: 'Seasonal economics — modeling market cycles and price volatility',
      concept: `Agricultural markets exhibit strong seasonal patterns driven by harvest cycles, weather, and demand fluctuations. Price volatility can be decomposed into: (1) Trend — long-term direction (inflation, population growth), (2) Seasonal cycle — predictable annual pattern (harvest lowers prices, off-season raises them), (3) Cyclical variation — multi-year patterns (weather cycles, investment cycles), and (4) Random shocks — unpredictable events (storms, disease outbreaks).

Time series decomposition: P(t) = T(t) + S(t) + C(t) + ε(t). The seasonal component S(t) is periodic with period 12 months. For Tura market produce, the seasonal amplitude (peak-to-trough price difference) depends on storability: highly perishable goods (leafy vegetables) have large seasonal swings because they cannot be stored; durable goods (rice, dried fish) have smaller swings because storage smooths supply across seasons.

Price volatility σ is measured as the standard deviation of price returns: σ = std(ln(P_t/P_{t-1})). The coefficient of variation (CV = σ/mean) allows comparison across goods. Higher volatility creates risk for both farmers and consumers. Buffer stocks, futures markets, and crop insurance are economic tools to manage this risk.`,
      analogy: 'Seasonal price cycles are like ocean tides — predictable and regular, driven by the gravitational pull of harvest seasons. The trend is like sea level rise — slow and long-term. Random shocks are like storm surges — unpredictable and sometimes devastating. A wise fisherman (or market vendor) plans for tides, accounts for sea level change, and prepares for storms — just as a good farmer plans planting around seasonal price patterns.',
      storyConnection: 'The Tura market shows dramatic seasonal variation: abundant produce during harvest brings low prices, while the lean season before the next harvest brings scarcity and high prices. The story\'s market day captures a snapshot of this cycle. Understanding the mathematical pattern behind seasonal prices would help every farmer and vendor in Tura plan better — planting, storing, and selling at optimal times.',
      checkQuestion: 'A farmer grows ginger with harvest in November. Market price averages Rs 30/kg in November (harvest glut) but Rs 55/kg in June (scarcity). Storage costs Rs 3/kg/month. Is it worth storing ginger for 7 months? What is the break-even storage cost?',
      checkAnswer: 'Revenue from selling at harvest: Rs 30/kg. Revenue from storing 7 months and selling in June: Rs 55 - (7 × 3) = Rs 55 - 21 = Rs 34/kg. Storing yields Rs 4/kg more profit — it IS worth it, but barely. Break-even storage cost: 55 - 30 = 25 Rs over 7 months = Rs 3.57/kg/month. Current storage cost (Rs 3/month) is below break-even, so storage is profitable. However, there is spoilage risk (~10% loss) that reduces expected gain to Rs 34 × 0.90 - 30 = Rs 0.60/kg — marginal. This thin margin explains why many small farmers sell at harvest despite low prices.',
      codeIntro: 'Decompose market price time series into trend, seasonal, and random components, and analyze price volatility for different goods.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate synthetic market price data (monthly, 5 years)
n_months = 60
t = np.arange(n_months)
months = t % 12

def generate_prices(base, trend_rate, seasonal_amp, seasonal_phase, noise_std, name):
    trend = base * (1 + trend_rate * t / 12)
    seasonal = seasonal_amp * np.sin(2 * np.pi * (t - seasonal_phase) / 12)
    noise = np.random.normal(0, noise_std, n_months)
    # Occasional shocks
    shocks = np.zeros(n_months)
    shock_months = np.random.choice(n_months, 3, replace=False)
    shocks[shock_months] = np.random.choice([-1, 1], 3) * base * 0.15
    price = trend + seasonal + noise + shocks
    return np.maximum(price, base * 0.3), trend, seasonal, noise + shocks

goods_data = [
    ('Ginger', 40, 0.05, 15, 5, 5),
    ('Rice', 25, 0.03, 3, 2, 2),
    ('Oranges', 20, 0.02, 10, 10, 3),
    ('Bamboo shoots', 15, 0.04, 12, 6, 4),
]

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Raw price time series
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors_g = ['#ef4444', '#22c55e', '#f59e0b', '#3b82f6']
all_prices = {}
for (name, base, trend_r, s_amp, s_phase, noise_s), color in zip(goods_data, colors_g):
    prices, trend, seasonal, noise = generate_prices(base, trend_r, s_amp, s_phase, noise_s, name)
    all_prices[name] = prices
    ax.plot(t, prices, color=color, linewidth=1.5, label=name, alpha=0.8)
# Mark monsoon seasons
for year in range(5):
    start = year * 12 + 5
    end = year * 12 + 9
    ax.axvspan(start, end, alpha=0.05, color='#3b82f6')
ax.set_xlabel('Month', color='white')
ax.set_ylabel('Price (Rs/kg)', color='white')
ax.set_title('Market Prices: 5-Year History', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
year_ticks = [i * 12 for i in range(6)]
ax.set_xticks(year_ticks)
ax.set_xticklabels([f'Year {i+1}' for i in range(6)], fontsize=8)

# Plot 2: Decomposition for ginger
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
prices_g, trend_g, seasonal_g, noise_g = generate_prices(40, 0.05, 15, 5, 5, 'Ginger')
ax2.plot(t, prices_g, color='#ef4444', linewidth=1.5, alpha=0.5, label='Raw price')
ax2.plot(t, trend_g, color='#fbbf24', linewidth=2, label='Trend')
ax2.plot(t, trend_g + seasonal_g, color='#22c55e', linewidth=1.5, linestyle='--', label='Trend + Seasonal')
ax2.fill_between(t, trend_g + seasonal_g - abs(noise_g), trend_g + seasonal_g + abs(noise_g),
                  alpha=0.1, color='#a855f7', label='Noise band')
ax2.set_xlabel('Month', color='white')
ax2.set_ylabel('Price (Rs/kg)', color='white')
ax2.set_title('Time Series Decomposition: Ginger', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Average seasonal pattern
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
for (name, _, _, _, _, _), color in zip(goods_data, colors_g):
    prices = all_prices[name]
    monthly_avg = [np.mean(prices[months == m]) for m in range(12)]
    monthly_std = [np.std(prices[months == m]) for m in range(12)]
    ax3.plot(range(12), monthly_avg, 'o-', color=color, linewidth=2, label=name)
    ax3.fill_between(range(12), np.array(monthly_avg) - np.array(monthly_std),
                      np.array(monthly_avg) + np.array(monthly_std), alpha=0.1, color=color)
ax3.set_xticks(range(12))
ax3.set_xticklabels(month_names, fontsize=7)
ax3.set_xlabel('Month', color='white')
ax3.set_ylabel('Average price (Rs/kg)', color='white')
ax3.set_title('Seasonal Price Patterns', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Price volatility comparison
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
vol_data = []
for name in all_prices:
    prices = all_prices[name]
    returns = np.diff(np.log(prices))
    volatility = np.std(returns)
    cv = np.std(prices) / np.mean(prices)
    seasonal_range = np.max([np.mean(prices[months == m]) for m in range(12)]) - \
                     np.min([np.mean(prices[months == m]) for m in range(12)])
    vol_data.append((name, volatility, cv, seasonal_range))

names_v = [v[0] for v in vol_data]
cvs = [v[2] for v in vol_data]
seasonal_ranges = [v[3] for v in vol_data]
x_pos = np.arange(len(names_v))
width = 0.35
ax4.bar(x_pos - width/2, cvs, width, color='#3b82f6', alpha=0.8, label='Coefficient of variation')
ax4.bar(x_pos + width/2, [sr / 50 for sr in seasonal_ranges], width, color='#ef4444', alpha=0.8,
        label='Seasonal range (scaled)')
ax4.set_xticks(x_pos)
ax4.set_xticklabels(names_v, fontsize=9)
ax4.set_ylabel('Volatility measure', color='white')
ax4.set_title('Price Volatility Comparison', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    SEASONAL ECONOMICS — TURA MARKET")
print("=" * 60)
print(f"\\\nPrice volatility analysis (5-year data):")
for name, vol, cv, sr in vol_data:
    print(f"  {name:<15}: CV = {cv:.2f}, seasonal range = Rs {sr:.1f}/kg")
print(f"\\\nStorage opportunity analysis (ginger):")
harvest_price = np.mean(all_prices['Ginger'][months == 10])
lean_price = np.mean(all_prices['Ginger'][months == 5])
print(f"  Harvest price (Nov): Rs {harvest_price:.0f}/kg")
print(f"  Lean price (Jun): Rs {lean_price:.0f}/kg")
print(f"  Spread: Rs {lean_price - harvest_price:.0f}/kg")
print(f"  Break-even storage: Rs {(lean_price - harvest_price)/7:.1f}/kg/month")`,
      challenge: 'Build an ARIMA-style price forecaster: use the historical decomposition to predict next month\'s price for each good. Evaluate forecast accuracy using mean absolute percentage error (MAPE) on the last 12 months.',
      successHint: 'You have decomposed market price data into its constituent components — trend, seasonal, and random. This analysis would help every farmer and vendor at the Tura market make better planting, storage, and selling decisions.',
    },
    {
      title: 'Market network analysis — supply chains and trade flows',
      concept: `A market does not exist in isolation — it is a node in a network of supply chains connecting producers, wholesalers, retailers, and consumers. Network analysis reveals the structure of trade: which producers supply which markets, how goods flow through intermediaries, and where bottlenecks exist.

Key network metrics for supply chains: (1) Path length — the number of intermediaries between producer and consumer. Shorter paths mean lower transaction costs and fresher produce. (2) Centrality — nodes with high betweenness centrality are critical hubs; their disruption would fragment the network. (3) Resilience — how well the network functions when nodes are removed. A resilient network has redundant paths; a fragile one depends on a few critical nodes.

For the Tura market, the supply network includes hill farmers (producers), village aggregators (first intermediaries), transporters, wholesale market (Tura), and retail vendors. Each link adds cost: aggregator margin (10-15%), transport cost (Rs 2-5/kg depending on distance), and retail markup (20-30%). The farmer typically receives only 40-50% of the final retail price — the rest is absorbed by the supply chain. Shortening the chain (direct farmer-to-consumer) increases farmer income but requires logistics that small farmers often cannot manage alone.`,
      analogy: 'A supply chain is like a river system. Farmers are springs high in the mountains (source). Aggregators are small streams that collect water from many springs. Transporters are the rivers that carry water to the plains. The wholesale market is a lake where many rivers converge. Retail vendors are irrigation channels distributing water to fields (consumers). If a key river is blocked (road closure), the lake runs low and downstream channels dry up. A resilient system has multiple rivers feeding the lake.',
      storyConnection: 'Market day in Tura draws goods from villages across the Garo Hills. Each vendor\'s stall represents the endpoint of a supply chain that may stretch 50-100 km through mountain roads. The story captures the visible part — the bustling market. The invisible part is the network of relationships, transport logistics, and price negotiations that made each product\'s journey possible.',
      checkQuestion: 'A network has 8 villages supplying Tura market through 3 aggregators. Village A supplies 30% of all ginger. If Village A\'s road is blocked by a landslide, what happens to the network? How would you make the supply chain more resilient?',
      checkAnswer: 'Losing Village A removes 30% of ginger supply. If this supply cannot be rerouted through other aggregators, the market faces a 30% shortage, driving prices up ~40-50% (given inelastic short-term demand). Resilience improvements: (1) Multiple aggregation points so Village A can use alternate routes, (2) Buffer stocks at Tura level to absorb short-term disruptions, (3) Diversified sourcing — no single village should supply >15-20% of any good, (4) Real-time communication so alternate suppliers can respond quickly. The key metric is the Herfindahl-Hirschman Index (HHI) of supply concentration — lower HHI means more diversified and resilient.',
      codeIntro: 'Model the Tura market supply chain as a network, analyze its structure, measure resilience, and simulate disruptions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Supply chain network model
n_villages = 12
n_aggregators = 4
n_transporters = 3
n_retailers = 8

# Generate network connections
# Villages → Aggregators
village_agg = np.zeros((n_villages, n_aggregators))
for v in range(n_villages):
    # Each village connects to 1-2 aggregators
    n_conn = np.random.randint(1, 3)
    aggs = np.random.choice(n_aggregators, n_conn, replace=False)
    for a in aggs:
        village_agg[v, a] = np.random.uniform(50, 200)  # kg/week

# Aggregators → Tura market (all go through)
agg_flow = village_agg.sum(axis=0)

# Supply concentration
total_supply = village_agg.sum()
village_shares = village_agg.sum(axis=1) / total_supply

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Network visualization
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Position nodes
village_y = np.linspace(0.1, 0.9, n_villages)
agg_y = np.linspace(0.2, 0.8, n_aggregators)
market_pos = (0.7, 0.5)
# Draw edges
for v in range(n_villages):
    for a in range(n_aggregators):
        if village_agg[v, a] > 0:
            width = village_agg[v, a] / 100
            ax.plot([0.15, 0.45], [village_y[v], agg_y[a]],
                   color='#3b82f6', linewidth=width, alpha=0.5)
for a in range(n_aggregators):
    width = agg_flow[a] / 200
    ax.plot([0.45, 0.7], [agg_y[a], 0.5],
           color='#ef4444', linewidth=max(width, 0.5), alpha=0.7)
# Draw nodes
for v in range(n_villages):
    size = village_shares[v] * 800
    ax.scatter(0.15, village_y[v], s=max(size, 20), c='#22c55e', zorder=5,
              edgecolors='white', linewidths=0.5)
    ax.text(0.05, village_y[v], f'V{v+1}', color='white', fontsize=7, va='center')
for a in range(n_aggregators):
    ax.scatter(0.45, agg_y[a], s=100, c='#f59e0b', zorder=5, marker='s',
              edgecolors='white', linewidths=0.5)
    ax.text(0.48, agg_y[a], f'A{a+1}', color='white', fontsize=8, va='center')
ax.scatter(*market_pos, s=200, c='#ef4444', zorder=5, marker='D',
          edgecolors='white', linewidths=1)
ax.text(0.73, 0.5, 'TURA\\\nMARKET', color='white', fontsize=9, va='center', fontweight='bold')
ax.set_xlim(0, 0.9); ax.set_ylim(0, 1)
ax.set_title('Supply Chain Network', color='white', fontsize=12, fontweight='bold')
ax.axis('off')

# Plot 2: Supply concentration (HHI)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
sorted_shares = np.sort(village_shares)[::-1]
hhi = np.sum(village_shares**2) * 10000
bars = ax2.bar(range(n_villages), sorted_shares * 100,
               color=plt.cm.RdYlGn_r(np.linspace(0.2, 0.8, n_villages)),
               edgecolor='white', linewidth=0.5)
ax2.axhline(100/n_villages, color='#fbbf24', linestyle='--', linewidth=1,
            label=f'Equal share ({100/n_villages:.1f}%)')
ax2.set_xlabel('Village (ranked)', color='white')
ax2.set_ylabel('Share of total supply (%)', color='white')
ax2.set_title(f'Supply Concentration (HHI = {hhi:.0f})', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.text(n_villages-3, max(sorted_shares)*90,
         f'HHI < 1500: competitive\\\nHHI > 2500: concentrated',
         color='gray', fontsize=8)

# Plot 3: Price markup along supply chain
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
chain_stages = ['Farm\\\ngate', 'Village\\\naggregator', 'Transport', 'Wholesale\\\n(Tura)', 'Retail\\\nvendor', 'Consumer']
ginger_prices = [30, 34, 38, 44, 55, 55]
rice_prices = [22, 24, 26, 29, 33, 33]
orange_prices = [12, 15, 18, 23, 30, 30]

x = np.arange(len(chain_stages))
width = 0.25
ax3.bar(x - width, ginger_prices, width, color='#ef4444', alpha=0.8, label='Ginger')
ax3.bar(x, rice_prices, width, color='#22c55e', alpha=0.8, label='Rice')
ax3.bar(x + width, orange_prices, width, color='#f59e0b', alpha=0.8, label='Oranges')
# Farmer share annotations
for prices, color, offset in [(ginger_prices, '#ef4444', -width),
                                (rice_prices, '#22c55e', 0),
                                (orange_prices, '#f59e0b', width)]:
    farmer_share = prices[0] / prices[-1] * 100
    ax3.text(5 + offset, prices[-1] + 1, f'{farmer_share:.0f}%', color=color,
             fontsize=8, ha='center', fontweight='bold')
ax3.set_xticks(x)
ax3.set_xticklabels(chain_stages, fontsize=8)
ax3.set_ylabel('Price (Rs/kg)', color='white')
ax3.set_title('Price Markup Along Supply Chain', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
ax3.text(5, max(ginger_prices) + 4, 'Farmer share →', color='gray', fontsize=8, ha='center')

# Plot 4: Resilience analysis — removing nodes
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Simulate removing villages one by one (largest first)
removal_order = np.argsort(village_shares)[::-1]
remaining_supply = []
for n_removed in range(n_villages + 1):
    mask = np.ones(n_villages, dtype=bool)
    mask[removal_order[:n_removed]] = False
    remaining = village_agg[mask].sum() / total_supply * 100
    remaining_supply.append(remaining)

ax4.plot(range(n_villages + 1), remaining_supply, 'o-', color='#ef4444', linewidth=2,
         label='Targeted (largest first)')
# Random removal
n_sims = 50
random_curves = np.zeros((n_sims, n_villages + 1))
for sim in range(n_sims):
    order = np.random.permutation(n_villages)
    for n_removed in range(n_villages + 1):
        mask = np.ones(n_villages, dtype=bool)
        mask[order[:n_removed]] = False
        random_curves[sim, n_removed] = village_agg[mask].sum() / total_supply * 100
ax4.plot(range(n_villages + 1), random_curves.mean(axis=0), 's-', color='#3b82f6',
         linewidth=2, label='Random removal (avg)')
ax4.fill_between(range(n_villages + 1),
                  np.percentile(random_curves, 10, axis=0),
                  np.percentile(random_curves, 90, axis=0),
                  alpha=0.2, color='#3b82f6')
ax4.axhline(50, color='#fbbf24', linestyle='--', linewidth=1, label='50% supply threshold')
ax4.set_xlabel('Number of villages removed', color='white')
ax4.set_ylabel('Remaining supply (%)', color='white')
ax4.set_title('Network Resilience Analysis', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    MARKET NETWORK ANALYSIS — TURA")
print("=" * 60)
print(f"\\\nNetwork: {n_villages} villages → {n_aggregators} aggregators → 1 market")
print(f"Total weekly supply: {total_supply:.0f} kg")
print(f"HHI: {hhi:.0f} ({'concentrated' if hhi > 2500 else 'moderate' if hhi > 1500 else 'competitive'})")
print(f"\\\nTop suppliers:")
for v in np.argsort(village_shares)[::-1][:5]:
    print(f"  Village {v+1}: {village_shares[v]*100:.1f}% of supply")
print(f"\\\nFarmer share of retail price:")
for name, prices in [('Ginger', ginger_prices), ('Rice', rice_prices), ('Oranges', orange_prices)]:
    print(f"  {name}: {prices[0]/prices[-1]*100:.0f}% (Rs {prices[0]} of Rs {prices[-1]})")`,
      challenge: 'Model the effect of a new road connecting two previously isolated village clusters. Show how this changes supply patterns, reduces prices, and improves farmer incomes by shortening the supply chain.',
      successHint: 'You have analyzed the Tura market as a network — understanding supply concentration, markup chains, and vulnerability to disruption. This analysis reveals where interventions (better roads, direct sales, buffer stocks) would have the most impact.',
    },
    {
      title: 'Behavioral economics — cognitive biases in market transactions',
      concept: `Classical economics assumes rational agents, but real market behavior is riddled with cognitive biases. Behavioral economics documents these systematic deviations: (1) Anchoring — the first price mentioned disproportionately influences the final price. If a vendor starts at Rs 80, the buyer anchors on 80 and feels good paying Rs 50, even if fair price is Rs 30. (2) Loss aversion — losing Rs 100 feels about 2.5x worse than gaining Rs 100 feels good (Kahneman & Tversky). Vendors exploit this: "Last chance at this price!" (3) Endowment effect — once you hold something, you value it more. Vendors encourage touching produce. (4) Framing — "20% off" feels different from "save Rs 10" even when mathematically identical.

The ultimatum game reveals fairness preferences: if one person proposes how to split Rs 100 and the other can accept or reject (both get nothing), rational theory predicts accepting any positive offer. But in practice, offers below 20-30% are typically rejected — people sacrifice money to punish unfairness. This explains why market negotiations converge on "fair" prices rather than optimal ones.

Prospect theory (Kahneman & Tversky) models decision-making under risk: V(x) = x^α for gains and V(x) = -λ(-x)^β for losses, where α ≈ β ≈ 0.88 and λ ≈ 2.25. The probability weighting function overweights small probabilities and underweights large ones, explaining why farmers overinsure rare catastrophes but underinsure common risks.`,
      analogy: 'Cognitive biases at the market are like optical illusions for decision-making. Just as a straight line can look curved when surrounded by specific patterns, a fair price can look like a bargain or a ripoff depending on how it is framed. The anchoring bias is like the Ebbinghaus illusion — a circle looks bigger or smaller depending on what surrounds it. The vendor who starts high is placing large circles (high anchor) around the asking price to make it look small.',
      storyConnection: 'Every negotiation at the Tura market involves behavioral economics. The experienced vendor knows to let customers handle produce (endowment effect), to display the most expensive items prominently (anchoring), and to create urgency ("these are the last fresh ones today!"). The experienced buyer knows to start low, walk away to trigger the vendor\'s loss aversion, and compare prices across stalls to defeat anchoring.',
      checkQuestion: 'A vendor anchors at Rs 100 for a handicraft. A buyer counter-offers Rs 40. They negotiate to Rs 65. If the true "fair" price based on cost-plus-margin is Rs 50, who won? How could the buyer have done better?',
      checkAnswer: 'The vendor won — the final price (Rs 65) is 30% above fair value (Rs 50). The buyer was anchored by Rs 100, so Rs 65 felt like a great deal (35% off!). The buyer could have done better by: (1) Setting a lower anchor first — "I saw this for Rs 30 at the last market" — forcing the vendor to negotiate from a lower reference. (2) Using the walk-away technique — leaving triggers vendor loss aversion. (3) Having information — knowing the fair price defeats anchoring because you have a rational anchor. (4) Framing differently — "I can only spend Rs 50 on this" reframes from negotiation to budget constraint.',
      codeIntro: 'Simulate cognitive biases in market negotiations, model prospect theory, and analyze how behavioral effects distort market outcomes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Behavioral economics models
def prospect_value(x, alpha=0.88, beta=0.88, lambda_loss=2.25):
    """Prospect theory value function."""
    if isinstance(x, np.ndarray):
        v = np.where(x >= 0, x**alpha, -lambda_loss * (-x)**beta)
        return v
    return x**alpha if x >= 0 else -lambda_loss * (-x)**beta

def probability_weight(p, gamma=0.69):
    """Tversky-Kahneman probability weighting function."""
    return p**gamma / (p**gamma + (1-p)**gamma)**(1/gamma)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Prospect theory value function
ax = axes[0, 0]
ax.set_facecolor('#111827')
x = np.linspace(-100, 100, 500)
v = prospect_value(x)
v_rational = x / 50  # linear for comparison

ax.plot(x, v, color='#3b82f6', linewidth=2.5, label='Prospect theory')
ax.plot(x, v_rational, color='gray', linewidth=1, linestyle='--', label='Rational (linear)')
ax.axhline(0, color='white', linewidth=0.3)
ax.axvline(0, color='white', linewidth=0.3)
ax.fill_between(x[x<0], v[x<0], v_rational[x<0], alpha=0.2, color='#ef4444', label='Loss aversion')
ax.fill_between(x[x>0], v[x>0], v_rational[x>0], alpha=0.2, color='#22c55e')
ax.annotate('Losses loom larger\\\nthan gains', (-60, -5), color='#ef4444', fontsize=10, fontweight='bold')
ax.annotate('Diminishing\\\nsensitivity', (60, 3), color='#22c55e', fontsize=10)
ax.set_xlabel('Outcome (Rs)', color='white')
ax.set_ylabel('Perceived value', color='white')
ax.set_title('Prospect Theory Value Function', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Anchoring effect simulation
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
fair_price = 50
n_negotiations = 200
# High anchor group
high_anchor = 100
final_prices_high = []
for _ in range(n_negotiations):
    # Buyer adjusts from anchor toward fair price with noise
    adjustment = np.random.normal(0.45, 0.15) * (high_anchor - fair_price)
    final = high_anchor - adjustment + np.random.normal(0, 5)
    final_prices_high.append(max(20, final))
# Low anchor group
low_anchor = 30
final_prices_low = []
for _ in range(n_negotiations):
    adjustment = np.random.normal(0.45, 0.15) * (fair_price - low_anchor)
    final = low_anchor + adjustment + np.random.normal(0, 5)
    final_prices_low.append(max(20, final))

bins = np.linspace(20, 90, 30)
ax2.hist(final_prices_high, bins=bins, alpha=0.6, color='#ef4444', density=True,
         label=f'High anchor (Rs {high_anchor})')
ax2.hist(final_prices_low, bins=bins, alpha=0.6, color='#3b82f6', density=True,
         label=f'Low anchor (Rs {low_anchor})')
ax2.axvline(fair_price, color='#fbbf24', linewidth=2, linestyle='--', label=f'Fair price (Rs {fair_price})')
ax2.axvline(np.mean(final_prices_high), color='#ef4444', linewidth=1.5, linestyle=':')
ax2.axvline(np.mean(final_prices_low), color='#3b82f6', linewidth=1.5, linestyle=':')
ax2.set_xlabel('Final negotiated price (Rs)', color='white')
ax2.set_ylabel('Density', color='white')
ax2.set_title('Anchoring Effect on Negotiation', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Probability weighting
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
p = np.linspace(0.01, 0.99, 200)
w = probability_weight(p)
ax3.plot(p, w, color='#3b82f6', linewidth=2.5, label='Weighted probability')
ax3.plot([0, 1], [0, 1], '--', color='gray', linewidth=1, label='Objective probability')
ax3.fill_between(p, w, p, where=w > p, alpha=0.2, color='#ef4444', label='Overweighted')
ax3.fill_between(p, w, p, where=w < p, alpha=0.2, color='#22c55e', label='Underweighted')
ax3.annotate('Rare events\\\noverestimated', (0.1, 0.25), color='#ef4444', fontsize=10)
ax3.annotate('Common events\\\nunderestimated', (0.7, 0.5), color='#22c55e', fontsize=10)
ax3.set_xlabel('Objective probability', color='white')
ax3.set_ylabel('Decision weight', color='white')
ax3.set_title('Probability Weighting Function', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Ultimatum game results
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Simulate ultimatum game
total_pot = 100
offers = np.arange(0, 55, 5)
# Acceptance probability (empirical: drops sharply below 20%)
accept_prob = 1 / (1 + np.exp(-0.2 * (offers - 15)))
expected_payoff_proposer = offers * (1 - accept_prob) + (total_pot - offers) * accept_prob
# Rational prediction: accept anything > 0
rational_payoff = total_pot - offers

ax4.plot(offers, accept_prob * 100, 'o-', color='#3b82f6', linewidth=2, label='P(accept)')
ax4_twin = ax4.twinx()
ax4_twin.plot(offers, expected_payoff_proposer, 's-', color='#ef4444', linewidth=2, label='Expected payoff')
ax4_twin.plot(offers, rational_payoff, ':', color='gray', linewidth=1, label='Rational prediction')
ax4.axvline(20, color='#fbbf24', linestyle='--', linewidth=1)
ax4.text(21, 30, 'Fairness\\\nthreshold', color='#fbbf24', fontsize=9)
ax4.set_xlabel('Offer (Rs out of 100)', color='white')
ax4.set_ylabel('Acceptance rate (%)', color='#3b82f6')
ax4_twin.set_ylabel('Proposer expected payoff (Rs)', color='#ef4444')
ax4.set_title('Ultimatum Game: Fairness vs Rationality', color='white', fontsize=12, fontweight='bold')
ax4.tick_params(axis='y', colors='#3b82f6')
ax4_twin.tick_params(axis='y', colors='#ef4444')
ax4.tick_params(axis='x', colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    BEHAVIORAL ECONOMICS — MARKET BIASES")
print("=" * 60)
print(f"\\\nAnchoring effect:")
print(f"  Fair price: Rs {fair_price}")
print(f"  High anchor ({high_anchor}) → avg final: Rs {np.mean(final_prices_high):.0f} (+{np.mean(final_prices_high)-fair_price:.0f} bias)")
print(f"  Low anchor ({low_anchor}) → avg final: Rs {np.mean(final_prices_low):.0f} ({np.mean(final_prices_low)-fair_price:+.0f} bias)")
print(f"  Anchoring gap: Rs {np.mean(final_prices_high) - np.mean(final_prices_low):.0f}")
print(f"\\\nLoss aversion (λ = 2.25):")
print(f"  Gaining Rs 50 feels like: {prospect_value(50):.1f}")
print(f"  Losing Rs 50 feels like: {prospect_value(-50):.1f}")
print(f"  Loss hurts {abs(prospect_value(-50))/prospect_value(50):.1f}x more than gain pleases")`,
      challenge: 'Simulate an entire market day with 50 buyers and 10 vendors, each with different cognitive biases (some anchoring-prone, some loss-averse, some rational). Track how prices evolve through the day and whether biased agents end up paying more or earning less than rational ones.',
      successHint: 'You have modeled the psychological factors that drive real market behavior — anchoring, loss aversion, and fairness preferences explain why real markets deviate from the textbook ideal.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Supply and demand economics, price elasticity, game theory, and market analysis</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for economic modeling and market analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
