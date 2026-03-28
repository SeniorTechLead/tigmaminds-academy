import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function NightMarketLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Supply and demand — the invisible hand at Ima Keithel',
      concept: `Ima Keithel (Mothers' Market) in Imphal is one of the world's largest all-women-run markets, with over 5,000 women vendors. Understanding how prices form in this remarkable institution requires the foundational concepts of microeconomics: supply and demand.

**Demand**: The quantity of a good that buyers are willing and able to purchase at various prices. The **law of demand** states that, all else being equal, quantity demanded decreases as price increases. This is represented by a downward-sloping demand curve. The slope depends on **price elasticity of demand**: essential goods like rice have inelastic demand (quantity barely changes with price), while luxury goods like imported fruit have elastic demand (quantity drops sharply with price increase).

**Supply**: The quantity sellers are willing to offer at various prices. The **law of supply** states that quantity supplied increases with price (higher price = more profit = more vendors enter). The supply curve slopes upward. For perishable goods at Ima Keithel, supply is constrained by what was harvested or caught that morning — it cannot increase in the short run regardless of price. This makes short-run supply perfectly **inelastic** (vertical supply curve).

**Equilibrium**: Where supply and demand curves intersect, the market "clears" — every willing buyer finds a willing seller. The equilibrium price P* and quantity Q* emerge without any central authority setting them. Adam Smith called this the "invisible hand." At Ima Keithel, this happens organically every morning: vendors arrive with goods, buyers arrive with money, and through thousands of individual negotiations, prices converge to equilibrium.

**Surplus and shortage**: If price is above equilibrium, supply exceeds demand — vendors have unsold goods (surplus). Perishable goods spoil, so vendors lower prices. If price is below equilibrium, demand exceeds supply — buyers cannot find goods (shortage), and vendors raise prices. Both pressures push toward equilibrium.`,
      analogy: 'Think of price as a thermostat. If the room (market) is too hot (price too high), the air conditioner kicks in (vendors lower prices to sell their perishable goods). If it is too cold (price too low), the heater turns on (vendors raise prices because demand exceeds what they brought). The thermostat (price) adjusts until the room reaches a comfortable temperature (equilibrium). Nobody programs the thermostat — it responds automatically to conditions.',
      storyConnection: 'In the story of the Night Market of Imphal, a young girl watches her mother negotiate the price of king chillies (Umorok/Bhut Jolokia). In the morning, when supply is fresh and plentiful, the price is moderate. By evening, remaining chillies are wilting and the seller drops the price — a real-time demonstration of supply shifting inward along a demand curve. But during Ningol Chakouba festival, demand surges and even wilted chillies sell at premium prices — the demand curve has shifted outward.',
      checkQuestion: 'At Ima Keithel, a sudden rainstorm floods the farms outside Imphal, destroying 40% of the day\'s vegetable harvest. What happens to the equilibrium price and quantity of vegetables at the market? Draw the shift mentally.',
      checkAnswer: 'The supply curve shifts leftward (less supply at every price level). Since demand has not changed (people still need vegetables), the new equilibrium has a higher price and lower quantity. Specifically: with inelastic demand for essential vegetables, the price increase is large relative to the quantity decrease — vendors sell fewer vegetables but at much higher prices. Total revenue for vendors may actually increase. This is the economics behind food price spikes after natural disasters.',
      codeIntro: 'Model supply and demand curves for Ima Keithel goods, find equilibrium, and simulate supply and demand shocks.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Supply and Demand Model ---
def demand_curve(price, a, b, elasticity):
    """Quantity demanded = a - b * price^elasticity."""
    return np.maximum(0, a - b * price**elasticity)

def supply_curve(price, c, d):
    """Quantity supplied = c + d * price (linear for simplicity)."""
    return np.maximum(0, c + d * price)

def find_equilibrium(a, b, elasticity, c, d, p_range):
    """Find price where demand = supply."""
    demand = demand_curve(p_range, a, b, elasticity)
    supply = supply_curve(p_range, c, d)
    diff = np.abs(demand - supply)
    idx = np.argmin(diff)
    return p_range[idx], demand[idx]

# Price range (rupees per kg)
prices = np.linspace(1, 200, 500)

# Market goods at Ima Keithel
goods = {
    'Rice (essential)': {
        'demand': (500, 1.5, 0.7),   # inelastic
        'supply': (-100, 3.0),
        'color': '#22c55e',
    },
    'King Chilli (Umorok)': {
        'demand': (200, 0.8, 1.0),    # moderate elasticity
        'supply': (-50, 1.5),
        'color': '#ef4444',
    },
    'Imported Apple': {
        'demand': (150, 2.0, 1.3),    # elastic
        'supply': (-80, 2.0),
        'color': '#f59e0b',
    },
    'Fresh Fish (Ngari)': {
        'demand': (300, 1.0, 0.8),    # inelastic (staple)
        'supply': (-20, 1.2),         # limited by catch
        'color': '#3b82f6',
    },
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Supply & Demand at Ima Keithel (Mothers\\' Market)',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: All goods — equilibrium
ax = axes[0, 0]
equilibria = {}
for name, g in goods.items():
    a, b, e = g['demand']
    c, d = g['supply']
    D = demand_curve(prices, a, b, e)
    S = supply_curve(prices, c, d)
    ax.plot(D, prices, color=g['color'], linewidth=2, label=f'{name} (D)')
    ax.plot(S, prices, color=g['color'], linewidth=2, linestyle='--')

    p_eq, q_eq = find_equilibrium(a, b, e, c, d, prices)
    equilibria[name] = (p_eq, q_eq)
    ax.plot(q_eq, p_eq, 'o', color=g['color'], markersize=10, zorder=5)

ax.set_xlabel('Quantity (kg)', color='white', fontsize=11)
ax.set_ylabel('Price (Rs/kg)', color='white', fontsize=11)
ax.set_title('Market equilibrium for 4 goods', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 500)
ax.set_ylim(0, 200)

# Plot 2: Supply shock — flood destroys 40% of vegetables
ax = axes[0, 1]
name = 'Fresh Fish (Ngari)'
g = goods[name]
a, b, e = g['demand']
c, d = g['supply']

D = demand_curve(prices, a, b, e)
S_normal = supply_curve(prices, c, d)
S_shock = supply_curve(prices, c * 0.6, d * 0.6)  # 40% reduction

ax.plot(D, prices, color='#3b82f6', linewidth=2.5, label='Demand (unchanged)')
ax.plot(S_normal, prices, color='#22c55e', linewidth=2, label='Supply (normal)')
ax.plot(S_shock, prices, color='#ef4444', linewidth=2, linestyle='--', label='Supply (flood: -40%)')

p_eq1, q_eq1 = find_equilibrium(a, b, e, c, d, prices)
p_eq2, q_eq2 = find_equilibrium(a, b, e, c*0.6, d*0.6, prices)
ax.plot(q_eq1, p_eq1, 'o', color='#22c55e', markersize=10, zorder=5)
ax.plot(q_eq2, p_eq2, 'o', color='#ef4444', markersize=10, zorder=5)
ax.annotate(f'Normal: Rs{p_eq1:.0f}', xy=(q_eq1, p_eq1), xytext=(q_eq1+50, p_eq1-10),
            color='#22c55e', fontsize=9, arrowprops=dict(arrowstyle='->', color='#22c55e'))
ax.annotate(f'After flood: Rs{p_eq2:.0f}', xy=(q_eq2, p_eq2), xytext=(q_eq2+50, p_eq2+10),
            color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax.set_xlabel('Quantity (kg)', color='white', fontsize=11)
ax.set_ylabel('Price (Rs/kg)', color='white', fontsize=11)
ax.set_title(f'{name}: Supply shock (flood)', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(0, 400)

# Plot 3: Demand shock — festival season
ax = axes[1, 0]
name = 'King Chilli (Umorok)'
g = goods[name]
a, b, e = g['demand']
c, d = g['supply']

D_normal = demand_curve(prices, a, b, e)
D_festival = demand_curve(prices, a * 1.8, b, e)  # 80% demand increase
S = supply_curve(prices, c, d)

ax.plot(D_normal, prices, color='#3b82f6', linewidth=2, label='Demand (normal)')
ax.plot(D_festival, prices, color='#a855f7', linewidth=2, linestyle='--', label='Demand (Ningol Chakouba)')
ax.plot(S, prices, color='#22c55e', linewidth=2.5, label='Supply (fixed)')

p_eq1, q_eq1 = find_equilibrium(a, b, e, c, d, prices)
p_eq2, q_eq2 = find_equilibrium(a*1.8, b, e, c, d, prices)
ax.plot(q_eq1, p_eq1, 'o', color='#3b82f6', markersize=10, zorder=5)
ax.plot(q_eq2, p_eq2, 'o', color='#a855f7', markersize=10, zorder=5)

ax.set_xlabel('Quantity (kg)', color='white', fontsize=11)
ax.set_ylabel('Price (Rs/kg)', color='white', fontsize=11)
ax.set_title(f'{name}: Festival demand surge', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Price elasticity comparison
ax = axes[1, 1]
price_increase = np.linspace(0, 50, 100)  # % increase from equilibrium
for name, g in goods.items():
    a, b, e = g['demand']
    p_eq = equilibria[name][0]
    q_eq = equilibria[name][1]
    new_prices = p_eq * (1 + price_increase/100)
    new_demand = demand_curve(new_prices, a, b, e)
    pct_q_change = (new_demand - q_eq) / q_eq * 100
    ax.plot(price_increase, pct_q_change, color=g['color'], linewidth=2, label=name)

ax.axhline(y=0, color='white', linewidth=0.5, alpha=0.3)
ax.set_xlabel('Price increase (%)', color='white', fontsize=11)
ax.set_ylabel('Demand change (%)', color='white', fontsize=11)
ax.set_title('Price elasticity: essentials vs luxuries', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Ima Keithel Market Equilibrium")
print("=" * 55)
for name, (p, q) in equilibria.items():
    print(f"  {name:30s}: Price = Rs{p:.0f}/kg, Qty = {q:.0f} kg")
print()
print("Supply shock (flood, -40% fish supply):")
print(f"  Price: Rs{p_eq1:.0f} -> Rs{p_eq2:.0f} (+{(p_eq2/p_eq1-1)*100:.0f}%)")
print(f"  Quantity: {q_eq1:.0f} -> {q_eq2:.0f} (-{(1-q_eq2/q_eq1)*100:.0f}%)")
print()
print("Key insight: essential goods (rice, fish) have inelastic demand,")
print("so supply shocks cause LARGE price increases but SMALL quantity drops.")
print("Luxury goods (imported apple) have elastic demand — price rises")
print("cause large drops in quantity sold.")`,
      challenge: 'Add a "time-of-day" effect: at Ima Keithel, prices for perishable goods drop throughout the day as vendors try to sell remaining stock before it spoils. Model the supply curve shifting rightward (vendors accepting lower prices) as closing time approaches, and plot the equilibrium price trajectory from 6 AM to 6 PM.',
      successHint: 'You now understand the fundamental mechanism of price formation. Ima Keithel is a textbook example of market microstructure — thousands of individual price negotiations converging on equilibrium without any central planning.',
    },
    {
      title: 'Food preservation science — why the cold chain matters',
      concept: `At Ima Keithel, perishable goods must be sold the same day they arrive. This constraint dominates market economics — it forces the intraday price decline you see for fish, vegetables, and flowers. Understanding food spoilage reveals why, and points to interventions that could transform the market.

**Microbial growth kinetics**: Food spoilage is primarily caused by bacteria (Pseudomonas, Salmonella, E. coli) and fungi (molds, yeasts). Microbial growth follows a predictable pattern: lag phase (adapting to the food), exponential phase (rapid doubling), stationary phase (nutrients exhausted), and death phase. The key parameter is **doubling time** — how long it takes the microbial population to double. At 30 degrees C (typical Imphal daytime temperature), bacteria double every 20-30 minutes. At 5 degrees C (refrigeration), doubling time extends to 8-12 hours.

**Arrhenius kinetics**: The rate of spoilage reactions (enzymatic browning, lipid oxidation, protein denaturation) follows the Arrhenius equation: k = A * exp(-Ea / (R * T)), where k is the reaction rate, A is the pre-exponential factor, Ea is activation energy, R is the gas constant, and T is absolute temperature. For most food spoilage reactions, a 10 degree C decrease in temperature halves the reaction rate (the Q10 rule). This means refrigeration at 5 degrees C extends shelf life by roughly 4-6 times compared to 30 degrees C.

**Water activity**: Microbes need water to grow. Water activity (aw) measures the "available" water in food on a scale of 0 to 1. Fresh fish has aw = 0.99 (perfect for bacteria). Dried fish (like Ngari, the fermented fish essential to Manipuri cuisine) has aw = 0.60-0.75 (too dry for most bacteria, but fermentation organisms thrive). Fermentation is actually a **controlled spoilage** — desirable microbes (Lactobacillus) are encouraged to produce acid that prevents growth of harmful ones.

**Cold chain**: The continuous maintenance of low temperature from harvest to consumer. At Ima Keithel, the cold chain is almost nonexistent: fish is caught at dawn, transported in open baskets, and displayed on open tables in 30 degree C heat. By afternoon, bacterial counts may be 100-1000 times higher than at morning. A simple intervention — insulated boxes with ice packs — could extend the viable selling window from 6 hours to 18 hours, transforming the economics.`,
      analogy: 'Food spoilage is a race between you and the bacteria, and temperature is the track speed. At 30 degrees C, the bacteria are sprinting — you have maybe 4 hours before they win. At 5 degrees C, the bacteria are crawling — you have 24+ hours. Ice packs at Ima Keithel are like speed bumps on the bacteria\'s track. You cannot stop them entirely, but you can slow them enough to change the game.',
      storyConnection: 'In the story, the girl\'s mother sells fresh fish. By afternoon, the remaining fish smells strong and the price drops to half. This is not just market dynamics — it is microbiology. The bacteria on the fish have been doubling every 20 minutes for 8 hours: that is 24 doublings, a factor of 16 million. The fish is genuinely less safe and less appealing. If her mother had an insulated box with ice, the fish would still be fresh at 4 PM, and she could command morning prices all day.',
      checkQuestion: 'A vendor at Ima Keithel has 10 kg of fresh fish at 6 AM. The initial bacterial count is 10^4 CFU/g (colony forming units per gram). At 30 degrees C, bacteria double every 25 minutes. At what time does the bacterial count exceed 10^7 CFU/g (the safety threshold for rejection)?',
      checkAnswer: 'We need 10^4 to reach 10^7, which is a factor of 1000 = 2^10 (approximately). So we need 10 doublings. At 25 minutes per doubling: 10 * 25 = 250 minutes = 4 hours 10 minutes. Starting at 6 AM, the fish exceeds the safety threshold at approximately 10:10 AM. With ice packs (reducing temperature to ~10 degrees C, doubling time ~4 hours), 10 doublings take 40 hours — the fish stays safe until the next day. This is why cold chain matters enormously.',
      codeIntro: 'Model microbial growth kinetics on fresh fish at different temperatures and calculate the economic impact of cold chain interventions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Microbial growth model ---
def bacterial_growth(t_hours, N0, temp_C, lag_hours=0.5):
    """Model bacterial growth with temperature-dependent doubling time."""
    # Doubling time (hours) depends on temperature
    # Approximate: td = td_optimal * exp(0.1 * (T_optimal - T))
    td_optimal = 0.33  # 20 min at 37C (optimal for most food-borne pathogens)
    T_optimal = 37
    td = td_optimal * np.exp(0.08 * (T_optimal - temp_C))

    # Growth with lag phase
    growth = np.where(t_hours < lag_hours, 0,
                      (t_hours - lag_hours) / td)
    N = N0 * 2**growth

    # Stationary phase (nutrient limitation)
    N_max = 1e10  # carrying capacity per gram
    N = N_max * N / (N_max + N - N0)

    return N

# Time axis
hours = np.linspace(0, 24, 1000)
N0 = 1e4  # initial count (CFU/g)

# Temperature scenarios
temps = {
    '30\\u00b0C (open table)': (30, '#ef4444'),
    '20\\u00b0C (shade)': (20, '#f59e0b'),
    '10\\u00b0C (ice box)': (10, '#3b82f6'),
    '5\\u00b0C (refrigerator)': (5, '#22c55e'),
    '0\\u00b0C (ice)': (0, '#a855f7'),
}

# Safety thresholds
safety_limit = 1e7      # rejection threshold (CFU/g)
danger_limit = 1e8       # dangerous level

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Food Preservation Science: Microbial Growth & Cold Chain',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Bacterial growth at different temperatures
ax = axes[0, 0]
time_to_unsafe = {}
for label, (temp, color) in temps.items():
    N = bacterial_growth(hours, N0, temp)
    ax.semilogy(hours, N, color=color, linewidth=2, label=label)

    # Find time to safety limit
    unsafe_idx = np.argmax(N > safety_limit)
    if unsafe_idx > 0:
        time_to_unsafe[label] = hours[unsafe_idx]
    else:
        time_to_unsafe[label] = float('inf')

ax.axhline(y=safety_limit, color='#f59e0b', linestyle='--', alpha=0.5, label='Safety limit (10\\u2077)')
ax.axhline(y=danger_limit, color='#ef4444', linestyle='--', alpha=0.5, label='Danger (10\\u2078)')
ax.set_xlabel('Time (hours)', color='white', fontsize=11)
ax.set_ylabel('Bacterial count (CFU/g)', color='white', fontsize=11)
ax.set_title('Bacterial growth: temperature is everything', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(1e3, 1e11)
ax.set_xlim(0, 24)

# Plot 2: Shelf life (hours until unsafe) vs temperature
ax = axes[0, 1]
temp_range = np.linspace(-2, 40, 100)
shelf_life = []
for temp in temp_range:
    N = bacterial_growth(hours, N0, temp)
    idx = np.argmax(N > safety_limit)
    if idx > 0:
        shelf_life.append(hours[idx])
    else:
        shelf_life.append(24)

ax.plot(temp_range, shelf_life, color='#3b82f6', linewidth=2.5)
ax.fill_between(temp_range, 0, shelf_life, alpha=0.15, color='#3b82f6')

# Annotate key points
for label, (temp, color) in temps.items():
    t = time_to_unsafe.get(label, 24)
    if t <= 24:
        ax.plot(temp, t, 'o', color=color, markersize=10, zorder=5)
        ax.annotate(f'{t:.1f}h', xy=(temp, t), xytext=(temp+2, t+1),
                    color=color, fontsize=9)

# Ima Keithel operating window
ax.axvspan(25, 35, alpha=0.1, color='#ef4444', label='Imphal daytime (25-35\\u00b0C)')
ax.axhline(y=6, color='#f59e0b', linestyle=':', alpha=0.5, label='Typical market day (6 hours)')

ax.set_xlabel('Temperature (\\u00b0C)', color='white', fontsize=11)
ax.set_ylabel('Shelf life (hours)', color='white', fontsize=11)
ax.set_title('Shelf life vs storage temperature', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Arrhenius reaction rate
ax = axes[1, 0]
Ea_values = {
    'Enzymatic browning': (50000, '#f59e0b'),
    'Lipid oxidation': (60000, '#3b82f6'),
    'Bacterial growth': (80000, '#ef4444'),
    'Vitamin C loss': (40000, '#22c55e'),
}

R = 8.314  # J/(mol*K)
T_range = np.linspace(0, 40, 100) + 273.15  # K
T_ref = 25 + 273.15

for name, (Ea, color) in Ea_values.items():
    rate_ratio = np.exp(-Ea/R * (1/T_range - 1/T_ref))
    ax.plot(T_range - 273.15, rate_ratio, color=color, linewidth=2, label=name)

ax.axvline(x=5, color='#a855f7', linestyle=':', alpha=0.5, label='Refrigeration (5\\u00b0C)')
ax.axhline(y=1.0, color='white', linestyle=':', alpha=0.3)
ax.set_xlabel('Temperature (\\u00b0C)', color='white', fontsize=11)
ax.set_ylabel('Reaction rate (relative to 25\\u00b0C)', color='white', fontsize=11)
ax.set_title('Arrhenius kinetics: spoilage reaction rates', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Economic impact of cold chain
ax = axes[1, 1]
# Model: vendor brings 10 kg fish worth Rs 300/kg at 6 AM
# Without cold chain: price drops over the day as quality degrades
# With cold chain: price stays near morning level

hours_market = np.arange(6, 19)  # 6 AM to 6 PM

# Without cold chain (30C): quality degrades, price drops
quality_no_cold = np.exp(-0.15 * (hours_market - 6))
price_no_cold = 300 * quality_no_cold

# With ice box (10C): quality maintained much longer
quality_cold = np.exp(-0.03 * (hours_market - 6))
price_cold = 300 * quality_cold

# Sales model: sell 1 kg per hour at the current price
revenue_no_cold = np.cumsum(price_no_cold)
revenue_cold = np.cumsum(price_cold)

ax.plot(hours_market, revenue_no_cold, 'o-', color='#ef4444', linewidth=2,
        label='No cold chain')
ax.plot(hours_market, revenue_cold, 's-', color='#22c55e', linewidth=2,
        label='With ice box')
ax.fill_between(hours_market, revenue_no_cold, revenue_cold, alpha=0.15, color='#22c55e')

# Cost of ice box
ice_cost = 50  # Rs per day for ice
ax.axhline(y=revenue_cold[-1] - ice_cost, color='#22c55e', linestyle=':', alpha=0.5)

ax.set_xlabel('Hour of day', color='white', fontsize=11)
ax.set_ylabel('Cumulative revenue (Rs)', color='white', fontsize=11)
ax.set_title('Daily revenue: cold chain vs none', color='white', fontsize=12)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

additional_revenue = revenue_cold[-1] - revenue_no_cold[-1] - ice_cost
ax.text(14, (revenue_cold[-1] + revenue_no_cold[-1])/2,
        f'Additional profit:\\nRs {additional_revenue:.0f}/day\\n(minus Rs {ice_cost} ice)',
        color='#22c55e', fontsize=9, ha='center',
        bbox=dict(facecolor='#1f2937', alpha=0.8, boxstyle='round'))

plt.tight_layout()
plt.show()

print("Food Preservation Analysis")
print("=" * 55)
print("Time to reach safety limit (10^7 CFU/g) from 10^4:")
for label, t in time_to_unsafe.items():
    if t < 24:
        print(f"  {label:30s}: {t:.1f} hours")
    else:
        print(f"  {label:30s}: >24 hours (safe all day)")
print()
print("Economic impact (per vendor, per day):")
print(f"  Revenue without cold chain: Rs {revenue_no_cold[-1]:.0f}")
print(f"  Revenue with ice box:       Rs {revenue_cold[-1]:.0f}")
print(f"  Ice cost:                   Rs {ice_cost:.0f}")
print(f"  Net additional profit:      Rs {additional_revenue:.0f}/day")
print(f"  Monthly gain (26 market days): Rs {additional_revenue * 26:.0f}")
print()
print("The cold chain is the highest-ROI intervention for Ima Keithel vendors.")`,
      challenge: 'Model the fermentation of Ngari (fermented fish): Lactobacillus bacteria produce lactic acid that drops pH from 6.5 to 4.5 over 3-7 days, which inhibits pathogenic bacteria. Plot the pH trajectory and the growth curves of both Lactobacillus (beneficial) and E. coli (harmful) during fermentation.',
      successHint: 'You now understand the science behind Ima Keithel\'s daily price decline: it is microbiology, not just economics. The cold chain intervention is a scientifically backed solution to a real economic problem facing 5,000 women vendors.',
    },
    {
      title: 'Price formation in informal markets — game theory at the bargaining table',
      concept: `Prices at Ima Keithel are not posted on labels — they emerge through face-to-face bargaining between vendor and buyer. This negotiation is a **game** in the game-theoretic sense, and understanding it reveals deep economic principles.

**Bilateral monopoly**: In a standard market, there are many buyers and many sellers, and no individual has market power. But each individual bargaining encounter at Ima Keithel is a **bilateral monopoly** — one seller negotiating with one buyer. The outcome depends on each party's **reservation price**: the maximum the buyer will pay (their willingness to pay) and the minimum the seller will accept (their cost plus minimum profit margin).

**Nash bargaining solution**: John Nash showed that in a symmetric bilateral bargaining game, the equilibrium price splits the surplus (the gap between buyer's and seller's reservation prices) equally. If the buyer values the good at Rs 100 and the seller's minimum is Rs 60, the Nash solution is Rs 80 — each gains Rs 20. In practice, the split depends on **bargaining power**: which party has more alternatives, more information, and more patience.

**Information asymmetry**: The seller knows her cost, the morning's supply level, and how much stock she has left. The buyer may not know these. This asymmetry gives the seller an advantage early in the day. But as closing time approaches, the buyer gains power — the seller's goods are perishable and she needs to sell. The information advantage shifts through the day.

**Repeated game effects**: Ima Keithel vendors and regular customers play a **repeated game** — they interact daily over years. In repeated games, reputation matters. A vendor who cheats (selling bad quality at high price) loses her repeat customers. This creates a powerful incentive for honest dealing without any formal regulation. Trust emerges from the structure of the game, not from law enforcement.`,
      analogy: 'Bargaining at Ima Keithel is like a dance where both partners know the music but improvise the steps. The vendor opens high ("Rs 300, fresh this morning!"). The buyer counters low ("Rs 200, I saw the same at the next stall."). They negotiate toward a middle ground, each signal revealing information: the vendor\'s willingness to come down reveals she has plenty of stock; the buyer\'s willingness to walk away reveals she has alternatives. The final price encodes all this information into a single number.',
      storyConnection: 'The story depicts the girl watching her mother negotiate with a regular customer. Neither is angry — they are both smiling, because both know they will agree on a fair price. This is the repeated game at work. The customer knows that if she pays too little, the mother will sell to someone else tomorrow. The mother knows that if she charges too much, the customer will switch to another vendor. The equilibrium is maintained by mutual respect and the threat of future consequences — the essence of game theory.',
      checkQuestion: 'A vendor has 5 kg of fish left at 3 PM, and the market closes at 5 PM. A buyer offers Rs 150/kg (below the morning price of Rs 300/kg). Should the vendor accept? What game-theoretic concepts apply?',
      checkAnswer: 'The vendor should consider: (1) Her reservation price — what is the minimum she will accept? If the fish will be worthless after 5 PM (zero salvage value), any positive price beats throwing it away. (2) The probability of another buyer — at 3 PM, fewer buyers remain, so the alternative might be selling at an even lower price or not selling at all. (3) The signaling effect — if she accepts Rs 150 today, this buyer may always wait until 3 PM to get the low price (a repeated game consideration). The optimal strategy is to accept if Rs 150 exceeds her per-kg cost and she believes no higher offer is coming. This is essentially the "declining price auction" that naturally occurs in perishable goods markets.',
      codeIntro: 'Simulate the bargaining process, model information asymmetry, and demonstrate how repeated game dynamics create trust at Ima Keithel.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Bargaining simulation ---
def simulate_bargaining(seller_min, buyer_max, n_rounds=10,
                        seller_aggression=0.5, buyer_aggression=0.5):
    """Simulate alternating-offer bargaining."""
    if buyer_max < seller_min:
        return None, []  # no deal possible

    surplus = buyer_max - seller_min
    offers = []

    # Seller opens high, buyer opens low
    seller_offer = buyer_max + 0.2 * surplus  # above buyer's max (ambitious)
    buyer_offer = seller_min - 0.1 * surplus   # below seller's min (ambitious)

    for round_num in range(n_rounds):
        # Each round, both move toward center
        seller_concession = seller_aggression * (seller_offer - seller_min) / (n_rounds - round_num + 1)
        buyer_concession = buyer_aggression * (buyer_max - buyer_offer) / (n_rounds - round_num + 1)

        seller_offer -= seller_concession + np.random.normal(0, surplus * 0.02)
        buyer_offer += buyer_concession + np.random.normal(0, surplus * 0.02)

        offers.append({
            'round': round_num + 1,
            'seller': max(seller_min, seller_offer),
            'buyer': min(buyer_max, buyer_offer),
        })

        # Check for agreement
        if buyer_offer >= seller_offer:
            agreed_price = (buyer_offer + seller_offer) / 2
            return agreed_price, offers

    # Last resort: split the remaining gap
    final_price = (seller_offer + buyer_offer) / 2
    if final_price >= seller_min and final_price <= buyer_max:
        return final_price, offers
    return None, offers

# Run multiple bargaining simulations
n_sims = 1000
seller_min = 180  # Rs/kg
buyer_max = 350   # Rs/kg
nash_solution = (seller_min + buyer_max) / 2

# Different power balances
scenarios = {
    'Equal power': (0.5, 0.5),
    'Seller dominant (morning)': (0.3, 0.7),
    'Buyer dominant (evening)': (0.7, 0.3),
    'Both aggressive': (0.3, 0.3),
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Game Theory at Ima Keithel: Bargaining Dynamics',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Single bargaining process
ax = axes[0, 0]
price, offers = simulate_bargaining(seller_min, buyer_max, n_rounds=8,
                                     seller_aggression=0.5, buyer_aggression=0.5)
rounds = [o['round'] for o in offers]
seller_offers = [o['seller'] for o in offers]
buyer_offers = [o['buyer'] for o in offers]

ax.plot(rounds, seller_offers, 'o-', color='#ef4444', linewidth=2, markersize=8, label='Seller offers')
ax.plot(rounds, buyer_offers, 's-', color='#3b82f6', linewidth=2, markersize=8, label='Buyer offers')
ax.axhline(y=nash_solution, color='#22c55e', linestyle='--', linewidth=2,
           label=f'Nash solution (Rs {nash_solution:.0f})')
ax.axhline(y=seller_min, color='#ef4444', linestyle=':', alpha=0.3, label=f'Seller min (Rs {seller_min})')
ax.axhline(y=buyer_max, color='#3b82f6', linestyle=':', alpha=0.3, label=f'Buyer max (Rs {buyer_max})')
if price:
    ax.axhline(y=price, color='#f59e0b', linewidth=2, alpha=0.5)
    ax.text(max(rounds), price + 5, f'Agreed: Rs {price:.0f}', color='#f59e0b', fontsize=10)
ax.set_xlabel('Bargaining round', color='white', fontsize=11)
ax.set_ylabel('Price (Rs/kg)', color='white', fontsize=11)
ax.set_title('Single negotiation process', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Price distribution under different power balances
ax = axes[0, 1]
colors_scen = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b']
for (label, (s_agg, b_agg)), color in zip(scenarios.items(), colors_scen):
    prices = []
    for _ in range(n_sims):
        p, _ = simulate_bargaining(seller_min, buyer_max, n_rounds=8,
                                    seller_aggression=s_agg, buyer_aggression=b_agg)
        if p is not None:
            prices.append(p)
    if prices:
        ax.hist(prices, bins=30, color=color, alpha=0.4, label=f'{label} (mean={np.mean(prices):.0f})',
                edgecolor='none', density=True)

ax.axvline(x=nash_solution, color='white', linewidth=2, linestyle='--', label='Nash solution')
ax.set_xlabel('Agreed price (Rs/kg)', color='white', fontsize=11)
ax.set_ylabel('Density', color='white', fontsize=11)
ax.set_title('Price distribution by power balance', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Intraday price trajectory
ax = axes[1, 0]
hours_of_day = np.arange(6, 19)

# Morning: seller has power (fresh goods, many buyers)
# Evening: buyer has power (goods perishable, fewer buyers)
seller_power = 0.3 + 0.4 * np.exp(-0.3 * (hours_of_day - 6))
buyer_power = 0.3 + 0.4 * (1 - np.exp(-0.3 * (hours_of_day - 6)))

intraday_prices = []
for h, sp, bp in zip(hours_of_day, seller_power, buyer_power):
    # Also adjust reservation prices
    # Seller's minimum drops (perishable goods, must sell)
    s_min = seller_min * (1 - 0.4 * (h - 6) / 12)
    # Buyer's max stays roughly constant
    b_max = buyer_max

    hourly_prices = []
    for _ in range(100):
        p, _ = simulate_bargaining(s_min, b_max, n_rounds=5,
                                    seller_aggression=sp, buyer_aggression=bp)
        if p is not None:
            hourly_prices.append(p)
    intraday_prices.append(hourly_prices)

medians = [np.median(p) if p else 0 for p in intraday_prices]
p25 = [np.percentile(p, 25) if p else 0 for p in intraday_prices]
p75 = [np.percentile(p, 75) if p else 0 for p in intraday_prices]

ax.fill_between(hours_of_day, p25, p75, alpha=0.2, color='#3b82f6', label='25th-75th percentile')
ax.plot(hours_of_day, medians, 'o-', color='#3b82f6', linewidth=2.5, label='Median price')
ax.plot(hours_of_day, seller_power * 200 + 100, '--', color='#ef4444', linewidth=1.5,
        alpha=0.5, label='Seller power (scaled)')
ax.set_xlabel('Hour of day', color='white', fontsize=11)
ax.set_ylabel('Price (Rs/kg)', color='white', fontsize=11)
ax.set_title('Intraday price: power shifts to buyer', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Repeated game — trust and reputation
ax = axes[1, 1]
# Simulate vendor reputation over 100 market days
days = np.arange(1, 101)

# Honest vendor: charges fair price, good quality
honest_revenue = np.cumsum(np.random.normal(280, 20, 100))
honest_customers = 5 + 0.05 * days + np.random.normal(0, 0.5, 100)
honest_customers = np.cumsum(np.maximum(honest_customers, 0)) / days

# Cheating vendor: high price today, loses customers tomorrow
cheat_revenue_daily = np.zeros(100)
cheat_customers = np.zeros(100)
n_customers = 5
for d in range(100):
    cheat_revenue_daily[d] = n_customers * np.random.normal(350, 30)
    # Lose 10% of customers per day due to reputation
    n_customers = max(1, n_customers * 0.95 + np.random.normal(0, 0.3))
    cheat_customers[d] = n_customers
cheat_revenue = np.cumsum(cheat_revenue_daily)

ax.plot(days, honest_revenue / 1000, color='#22c55e', linewidth=2, label='Honest vendor')
ax.plot(days, cheat_revenue / 1000, color='#ef4444', linewidth=2, label='Cheating vendor')
ax.set_xlabel('Market days', color='white', fontsize=11)
ax.set_ylabel('Cumulative revenue (\\u00d71000 Rs)', color='white', fontsize=11)
ax.set_title('Repeated game: honesty pays in the long run', color='white', fontsize=12)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

crossover = np.argmax(honest_revenue > cheat_revenue)
if crossover > 0:
    ax.axvline(x=crossover, color='#f59e0b', linestyle=':', alpha=0.5)
    ax.text(crossover + 2, (honest_revenue[crossover] + cheat_revenue[crossover]) / 2000,
            f'Crossover: day {crossover}', color='#f59e0b', fontsize=9)

plt.tight_layout()
plt.show()

print("Game Theory Analysis")
print("=" * 55)
print(f"Nash bargaining solution: Rs {nash_solution:.0f}")
print()
print("Scenario results (1000 simulations each):")
for (label, (s_agg, b_agg)), color in zip(scenarios.items(), colors_scen):
    prices_list = []
    for _ in range(1000):
        p, _ = simulate_bargaining(seller_min, buyer_max, 8, s_agg, b_agg)
        if p: prices_list.append(p)
    if prices_list:
        print(f"  {label:25s}: mean=Rs {np.mean(prices_list):.0f}, std=Rs {np.std(prices_list):.0f}")
print()
print(f"Honest vendor total (100 days): Rs {honest_revenue[-1]/1000:.0f}k")
print(f"Cheating vendor total (100 days): Rs {cheat_revenue[-1]/1000:.0f}k")
print(f"Honesty premium: Rs {(honest_revenue[-1]-cheat_revenue[-1])/1000:.0f}k over 100 days")`,
      challenge: 'Model information cascades: if one buyer is seen paying a low price, subsequent buyers demand the same (social proof). Simulate how one low-price transaction can cascade through the market, temporarily driving prices below equilibrium. How long does it take for prices to recover?',
      successHint: 'You now see Ima Keithel as a game-theoretic system. Prices are not arbitrary — they emerge from the strategic interaction of bargaining power, information, perishability, and repeated relationships. The all-women tradition adds another dimension: trust networks built over generations.',
    },
    {
      title: 'Cold chain physics — thermodynamics of food preservation',
      concept: `The cold chain is ultimately a thermodynamics problem: how to maintain a low temperature in a warm environment with minimal energy and cost. For Ima Keithel vendors who cannot afford electric refrigeration, passive cooling solutions are the answer.

**Heat transfer**: Heat flows from hot to cold through three mechanisms. **Conduction**: heat flows through solid materials (ice pack to fish). Rate: Q = k * A * dT / dx, where k is thermal conductivity, A is contact area, dT is temperature difference, dx is material thickness. **Convection**: heat flows through moving air or liquid. Rate: Q = h * A * dT, where h is the convective heat transfer coefficient (~5 W/(m^2*K) for still air, ~25 for light breeze). **Radiation**: heat radiates from warm surfaces. Rate: Q = epsilon * sigma * A * (T_hot^4 - T_cold^4), where sigma is Stefan-Boltzmann constant.

**Insulation**: The R-value (thermal resistance) of a material determines how well it blocks heat flow. R = thickness / conductivity. Expanded polystyrene (thermocol, common in India) has R ~1 per cm. A 5 cm thermocol box has R = 5, meaning heat transfer is 5 times slower than through the same thickness of concrete. For the vendors, a simple thermocol box is the most cost-effective insulation available.

**Phase change cooling**: Ice melts at 0 degrees C, absorbing 334 kJ/kg of heat without changing temperature (latent heat of fusion). This is why ice is so effective for cooling: 1 kg of ice absorbs as much heat as raising 1 kg of water by 80 degrees C. For a typical fish vendor at Ima Keithel with 10 kg of fish in a thermocol box, approximately 3-4 kg of ice provides 10-14 hours of cooling.

**Evaporative cooling**: In Manipur's moderate humidity, evaporative cooling is partially effective. A wet cloth wrapped around a clay pot loses water through evaporation, absorbing heat and cooling the contents by 5-10 degrees C below ambient. This is the traditional "matka" cooling method used across India. It works best in dry, hot conditions — somewhat less effective in Manipur's humid climate.`,
      analogy: 'Heat transfer into a cooler box is like water leaking into a boat. Insulation is the hull thickness — thicker hull, less leaking. Ice is the bilge pump — it absorbs heat (pumps water out) to keep the inside cool (the boat afloat). The question is whether the pump capacity (ice mass) exceeds the leak rate (heat inflow). If the ice melts before market closes, the fish warms up — the boat sinks.',
      storyConnection: 'In the story, the girl notices that the fish seller two stalls down has a blue thermocol box with ice. That seller\'s fish stays fresh all day and commands higher prices. The girl wonders: "Why doesn\'t everyone do this?" The answer is economics — the thermocol box costs Rs 200 and ice costs Rs 50/day. For a vendor earning Rs 500/day in profit, that is a 10% daily cost. Our analysis will show whether the investment pays for itself through higher prices on maintained-quality fish.',
      checkQuestion: 'A thermocol box (5 cm walls, internal dimensions 40x30x20 cm) containing 10 kg of fish and 3 kg of ice is placed in 32 degrees C ambient air. The thermal conductivity of thermocol is 0.033 W/(m*K). How long will the ice last?',
      checkAnswer: 'Surface area: 2*(40*30 + 40*20 + 30*20) = 2*(1200 + 800 + 600) = 5200 cm^2 = 0.52 m^2. Heat flow rate: Q = k*A*dT/dx = 0.033 * 0.52 * 32 / 0.05 = 10.97 W (watts = joules per second). Add convective losses (~20% extra): total ~13 W. Heat to melt 3 kg ice: 3 * 334,000 = 1,002,000 J. Time: 1,002,000 / 13 = 77,077 seconds = 21.4 hours. The ice lasts about 21 hours — more than enough for a full market day. This confirms that a simple thermocol box with 3 kg of ice is sufficient for a 6 AM to 6 PM market day at Ima Keithel.',
      codeIntro: 'Model heat transfer into a cooler box, calculate ice requirements, and optimize the design for Ima Keithel vendors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Cooler box thermal model ---
class CoolerBox:
    """Thermal model for an insulated fish cooler."""

    def __init__(self, length_cm, width_cm, height_cm,
                 wall_thickness_cm, insulation_k=0.033,
                 ice_mass_kg=3, ambient_temp_C=32):
        # Dimensions in meters
        self.L = length_cm / 100
        self.W = width_cm / 100
        self.H = height_cm / 100
        self.dx = wall_thickness_cm / 100
        self.k = insulation_k  # W/(m*K)
        self.ice_mass = ice_mass_kg
        self.T_ambient = ambient_temp_C
        self.T_internal = 0  # starts at 0C with ice

        # Latent heat of ice
        self.L_ice = 334000  # J/kg

        # Surface area (external)
        self.A = 2 * (self.L * self.W + self.L * self.H + self.W * self.H)

    def heat_inflow_rate(self, T_internal):
        """Heat flow into box (W) at given internal temperature."""
        dT = self.T_ambient - T_internal
        # Conduction through walls
        Q_cond = self.k * self.A * dT / self.dx
        # Convective losses (opening the lid ~10% of time, air gaps)
        Q_conv = 5.0 * self.A * dT * 0.1  # h=5 W/(m2K), 10% time open
        # Radiation (small contribution)
        sigma = 5.67e-8
        Q_rad = 0.9 * sigma * self.A * ((self.T_ambient + 273)**4 - (T_internal + 273)**4)
        return Q_cond + Q_conv + Q_rad

    def simulate(self, duration_hours=18, dt_seconds=60):
        """Simulate temperature over time."""
        n_steps = int(duration_hours * 3600 / dt_seconds)
        times = np.zeros(n_steps)
        temps = np.zeros(n_steps)
        ice_remaining = np.zeros(n_steps)

        T = self.T_internal
        ice = self.ice_mass
        fish_mass = 10  # kg
        fish_cp = 3500  # J/(kg*K) for fish

        for i in range(n_steps):
            times[i] = i * dt_seconds / 3600  # hours
            temps[i] = T
            ice_remaining[i] = ice

            Q = self.heat_inflow_rate(T)
            energy_in = Q * dt_seconds  # Joules

            if ice > 0:
                # Ice absorbs heat
                ice_melted = energy_in / self.L_ice
                ice = max(0, ice - ice_melted)
                T = 0  # temperature stays at 0 while ice exists
            else:
                # No ice — temperature rises
                T += energy_in / (fish_mass * fish_cp)

        return times, temps, ice_remaining

# --- Compare cooler designs ---
designs = {
    'No insulation (open table)': CoolerBox(40, 30, 20, 0.1, insulation_k=50, ice_mass_kg=0),
    'Thermocol 3cm, no ice': CoolerBox(40, 30, 20, 3, insulation_k=0.033, ice_mass_kg=0),
    'Thermocol 3cm + 2kg ice': CoolerBox(40, 30, 20, 3, insulation_k=0.033, ice_mass_kg=2),
    'Thermocol 5cm + 3kg ice': CoolerBox(40, 30, 20, 5, insulation_k=0.033, ice_mass_kg=3),
    'Thermocol 5cm + 5kg ice': CoolerBox(40, 30, 20, 5, insulation_k=0.033, ice_mass_kg=5),
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Cold Chain Physics: Cooler Box Design for Ima Keithel',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_design = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7']

# Plot 1: Temperature over time
ax = axes[0, 0]
for (name, box), color in zip(designs.items(), colors_design):
    times, temps, ice = box.simulate(duration_hours=14)
    ax.plot(times + 6, temps, color=color, linewidth=2, label=name)

ax.axhline(y=5, color='white', linestyle=':', alpha=0.3, label='Safe zone (<5\\u00b0C)')
ax.axhline(y=15, color='#f59e0b', linestyle=':', alpha=0.3, label='Caution zone (15\\u00b0C)')
ax.fill_between([6, 20], 0, 5, alpha=0.05, color='#22c55e')
ax.set_xlabel('Time of day (hours)', color='white', fontsize=11)
ax.set_ylabel('Temperature (\\u00b0C)', color='white', fontsize=11)
ax.set_title('Internal temperature over market day', color='white', fontsize=12)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(6, 20)
ax.set_ylim(-2, 35)

# Plot 2: Ice remaining
ax = axes[0, 1]
for (name, box), color in zip(designs.items(), colors_design):
    times, temps, ice = box.simulate(duration_hours=14)
    if box.ice_mass > 0:
        ax.plot(times + 6, ice, color=color, linewidth=2, label=name)

ax.set_xlabel('Time of day', color='white', fontsize=11)
ax.set_ylabel('Ice remaining (kg)', color='white', fontsize=11)
ax.set_title('Ice consumption rate', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_xlim(6, 20)

# Plot 3: Heat flow breakdown (for 5cm + 3kg design)
ax = axes[1, 0]
box = designs['Thermocol 5cm + 3kg ice']
T_internal_range = np.linspace(0, 30, 100)

Q_cond = box.k * box.A * (box.T_ambient - T_internal_range) / box.dx
Q_conv = 5.0 * box.A * (box.T_ambient - T_internal_range) * 0.1
sigma = 5.67e-8
Q_rad = 0.9 * sigma * box.A * ((box.T_ambient + 273)**4 - (T_internal_range + 273)**4)

ax.plot(T_internal_range, Q_cond, color='#ef4444', linewidth=2, label='Conduction')
ax.plot(T_internal_range, Q_conv, color='#3b82f6', linewidth=2, label='Convection (lid opening)')
ax.plot(T_internal_range, Q_rad, color='#f59e0b', linewidth=2, label='Radiation')
ax.plot(T_internal_range, Q_cond + Q_conv + Q_rad, color='white', linewidth=2.5,
        linestyle='--', label='Total')
ax.set_xlabel('Internal temperature (\\u00b0C)', color='white', fontsize=11)
ax.set_ylabel('Heat inflow (W)', color='white', fontsize=11)
ax.set_title('Heat flow mechanisms', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Cost-benefit analysis
ax = axes[1, 1]
# Daily cost of different designs
design_costs = {
    'Open table': {'fixed': 0, 'daily_ice': 0, 'revenue': 2100},
    'Thermocol\\n+ 2kg ice': {'fixed': 200/180, 'daily_ice': 30, 'revenue': 2700},
    'Thermocol\\n+ 3kg ice': {'fixed': 200/180, 'daily_ice': 45, 'revenue': 3200},
    'Thermocol\\n+ 5kg ice': {'fixed': 300/180, 'daily_ice': 75, 'revenue': 3400},
}

names = list(design_costs.keys())
revenues = [d['revenue'] for d in design_costs.values()]
costs = [d['fixed'] + d['daily_ice'] for d in design_costs.values()]
profits = [r - c for r, c in zip(revenues, costs)]

x_pos = np.arange(len(names))
ax.bar(x_pos - 0.2, revenues, 0.35, color='#22c55e', label='Revenue (Rs/day)', edgecolor='none')
ax.bar(x_pos + 0.2, costs, 0.35, color='#ef4444', label='Cold chain cost (Rs/day)', edgecolor='none')

for i, p in enumerate(profits):
    ax.text(i, revenues[i] + 50, f'Profit: Rs {p:.0f}', ha='center', color='white', fontsize=8)

ax.set_xticks(x_pos)
ax.set_xticklabels(names, color='white', fontsize=8)
ax.set_ylabel('Rs per day', color='white', fontsize=11)
ax.set_title('Cost-benefit: which cooler design wins?', color='white', fontsize=12)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Cold Chain Design Analysis")
print("=" * 55)
for (name, box), color in zip(designs.items(), colors_design):
    times, temps, ice = box.simulate(duration_hours=14)
    # Time to reach 5C
    above_5 = np.argmax(temps > 5)
    if above_5 > 0:
        time_safe = times[above_5]
    else:
        time_safe = 14
    print(f"  {name:35s}: safe for {time_safe:.1f} hours")

print()
print("Cost-benefit (daily):")
for name, d in design_costs.items():
    profit = d['revenue'] - d['fixed'] - d['daily_ice']
    print(f"  {name:20s}: revenue=Rs{d['revenue']}, cost=Rs{d['fixed']+d['daily_ice']:.0f}, profit=Rs{profit:.0f}")

print()
print("Optimal design: Thermocol 5cm + 3kg ice")
print("  Keeps fish <5C for >12 hours")
print("  Daily ice cost: Rs 45")
print("  Additional revenue: Rs 1100/day over open table")
print("  Payback period: <1 day for the thermocol box")`,
      challenge: 'Model the effect of ambient temperature variation through the day (cooler at 6 AM, hottest at 2 PM, cooling by 6 PM). How does this affect ice consumption and the optimal ice mass? Also model periodic lid openings (every 15 minutes for 30 seconds) and their thermal impact.',
      successHint: 'You now understand the thermodynamics behind a simple intervention that could transform 5,000 vendors\' livelihoods. A Rs 200 thermocol box and Rs 45 of daily ice generates Rs 1100 in additional revenue — a 24x return on investment.',
    },
    {
      title: 'Informal economy modeling — quantifying the invisible market',
      concept: `Ima Keithel is part of the **informal economy** — economic activity that occurs outside government regulation, taxation, and measurement. In India, the informal sector employs approximately 80% of the workforce and generates ~50% of GDP, yet it is largely invisible in official statistics. Modeling informal markets requires different tools than formal economy analysis.

**Transaction recording**: In a formal market (supermarket), every transaction is digitally recorded — price, quantity, timestamp, product ID. At Ima Keithel, no transaction is recorded. To estimate total market turnover, we must sample: observe a representative subset of vendors, record their transactions for several hours, and extrapolate. This introduces sampling bias and estimation uncertainty.

**Multiplier effects**: Every rupee spent at Ima Keithel circulates through the local economy. The vendor buys supplies from farmers. Farmers buy seeds and tools. Toolmakers buy raw materials. This is the **economic multiplier**. For informal markets in developing economies, the multiplier is typically 1.5-2.5x — every Rs 100 in market sales generates Rs 150-250 in total economic activity.

**Network structure**: Ima Keithel is not just 5,000 independent vendors — it is a network. Vendors buy from each other (a fruit seller buys lunch from a food vendor). Regular customers form long-term relationships. Credit is extended without formal contracts, based on trust within the network. This network structure creates **resilience** — the market has survived wars, insurgencies, and natural disasters for over 500 years precisely because it is a distributed, trust-based network with no single point of failure.

**Gender economics**: Ima Keithel is run exclusively by women — a tradition dating back centuries. Research shows that women-controlled income is disproportionately spent on family nutrition, education, and healthcare compared to male-controlled income. The economic impact of Ima Keithel thus extends far beyond its market turnover: it funds human capital development across thousands of families.`,
      analogy: 'The informal economy is like dark matter in astrophysics. It makes up the majority of the economic "universe" but is invisible to standard measurement instruments (tax records, GDP statistics). Just as astronomers infer dark matter from its gravitational effects, economists infer the informal economy from its effects: employment, consumption patterns, and multiplier-driven GDP. Ima Keithel is a concentrated cluster of this "dark matter" — a massive economic engine that does not appear in any government spreadsheet.',
      storyConnection: 'The story describes the Night Market as "the beating heart of Imphal" — and the data supports this. With over 5,000 vendors and an estimated daily turnover of Rs 50-100 lakh (5-10 million), Ima Keithel is the economic engine of Manipur\'s capital. Yet because it is "informal," it receives minimal government investment in infrastructure, cold chain, or logistics. Our model quantifies its true economic value, making the case for investment.',
      checkQuestion: 'A government official argues that Ima Keithel should be "formalized" — vendors should register, pay taxes, and use digital payment systems. What would a balanced economic analysis of this proposal include?',
      checkAnswer: 'Benefits of formalization: (1) Tax revenue for government (~5-10% of turnover), (2) Digital transaction records for better economic planning, (3) Access to formal credit (bank loans instead of informal lenders), (4) Consumer protection. Costs: (1) Compliance burden falls disproportionately on poorest vendors (registration fees, time, literacy requirements), (2) Tax may be passed to consumers as higher prices, reducing demand, (3) Loss of flexibility (informal credit, flexible hours, negotiated prices), (4) Risk of elite capture (formal rules may benefit organized groups over individual women). A balanced approach: offer voluntary registration with benefits (access to cold chain infrastructure, micro-loans) rather than mandatory formalization with penalties. The priority should be investing in market infrastructure, not extracting tax revenue.',
      codeIntro: 'Build an economic model of Ima Keithel: estimate total turnover, multiplier effects, and the impact of infrastructure investment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Ima Keithel Economic Model ---
class InformalMarketModel:
    """Economic model for Ima Keithel (Mothers' Market)."""

    def __init__(self):
        # Market structure
        self.n_vendors = 5000
        self.market_days_per_month = 26
        self.months_per_year = 12

        # Vendor categories
        self.categories = {
            'Vegetables': {'n': 1500, 'avg_daily_revenue': 1200, 'margin': 0.25},
            'Fish/Meat': {'n': 800, 'avg_daily_revenue': 2500, 'margin': 0.20},
            'Textiles/Handloom': {'n': 1000, 'avg_daily_revenue': 3000, 'margin': 0.35},
            'Spices/Condiments': {'n': 600, 'avg_daily_revenue': 1500, 'margin': 0.30},
            'Flowers/Puja items': {'n': 400, 'avg_daily_revenue': 800, 'margin': 0.40},
            'Prepared food': {'n': 500, 'avg_daily_revenue': 1800, 'margin': 0.30},
            'Other': {'n': 200, 'avg_daily_revenue': 1000, 'margin': 0.25},
        }

    def daily_turnover(self):
        """Estimate daily market turnover."""
        total = 0
        for cat, data in self.categories.items():
            total += data['n'] * data['avg_daily_revenue']
        return total

    def annual_turnover(self):
        return self.daily_turnover() * self.market_days_per_month * self.months_per_year

    def multiplier_effect(self, multiplier=2.0):
        """Total economic impact including multiplier."""
        return self.annual_turnover() * multiplier

    def vendor_income_distribution(self, n_samples=5000):
        """Generate synthetic income distribution."""
        incomes = []
        for cat, data in self.categories.items():
            n = data['n']
            # Log-normal distribution (right-skewed, realistic)
            daily_profit = data['avg_daily_revenue'] * data['margin']
            monthly = daily_profit * self.market_days_per_month
            samples = np.random.lognormal(
                np.log(monthly) - 0.5, 0.7, n)
            incomes.extend(samples)
        return np.array(incomes[:n_samples])

    def cold_chain_impact(self, adoption_rate=0.5, revenue_increase=0.35):
        """Model impact of cold chain adoption on perishable goods vendors."""
        perishable_vendors = self.categories['Vegetables']['n'] + self.categories['Fish/Meat']['n']
        adopters = int(perishable_vendors * adoption_rate)
        daily_increase = adopters * 1200 * revenue_increase  # average perishable vendor revenue * increase
        annual_increase = daily_increase * self.market_days_per_month * self.months_per_year
        return {
            'adopters': adopters,
            'daily_increase': daily_increase,
            'annual_increase': annual_increase,
            'cost_per_vendor_daily': 50,  # ice + amortized box cost
            'annual_cost': adopters * 50 * self.market_days_per_month * self.months_per_year,
        }

model = InformalMarketModel()

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Ima Keithel Economic Model: Quantifying the Invisible Market',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Vendor categories
ax = axes[0, 0]
cat_names = list(model.categories.keys())
cat_vendors = [model.categories[c]['n'] for c in cat_names]
cat_revenues = [model.categories[c]['n'] * model.categories[c]['avg_daily_revenue'] / 1e5
                for c in cat_names]
colors_cat = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899', '#ef4444', '#6b7280']

ax.barh(cat_names, cat_revenues, color=colors_cat, edgecolor='none', height=0.6)
for i, v in enumerate(cat_revenues):
    ax.text(v + 0.3, i, f'Rs {v:.1f}L', va='center', color='white', fontsize=8)
ax.set_xlabel('Daily revenue (Rs lakh)', color='white', fontsize=10)
ax.set_title(f'Revenue by category (daily total: Rs {model.daily_turnover()/1e5:.0f}L)',
             color='white', fontsize=11)
ax.tick_params(axis='y', labelcolor='white', labelsize=8)

# Plot 2: Income distribution
ax = axes[0, 1]
incomes = model.vendor_income_distribution()
ax.hist(incomes/1000, bins=50, color='#3b82f6', edgecolor='none', alpha=0.8, density=True)
median_income = np.median(incomes)
mean_income = np.mean(incomes)
ax.axvline(x=median_income/1000, color='#22c55e', linewidth=2, linestyle='--',
           label=f'Median: Rs {median_income/1000:.1f}k/month')
ax.axvline(x=mean_income/1000, color='#f59e0b', linewidth=2, linestyle=':',
           label=f'Mean: Rs {mean_income/1000:.1f}k/month')
ax.set_xlabel('Monthly income (Rs thousands)', color='white', fontsize=11)
ax.set_ylabel('Density', color='white', fontsize=11)
ax.set_title('Vendor income distribution', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Multiplier effect
ax = axes[0, 2]
multipliers = np.linspace(1.0, 3.0, 50)
annual = model.annual_turnover()
total_impact = annual * multipliers

ax.plot(multipliers, total_impact / 1e7, color='#a855f7', linewidth=2.5)
ax.fill_between(multipliers, 0, total_impact / 1e7, alpha=0.15, color='#a855f7')
ax.axvline(x=2.0, color='#f59e0b', linestyle='--', alpha=0.5, label='Estimated multiplier (2.0)')
ax.axhline(y=annual * 2.0 / 1e7, color='#f59e0b', linestyle=':', alpha=0.3)

ax.set_xlabel('Economic multiplier', color='white', fontsize=11)
ax.set_ylabel('Total economic impact (Rs crore)', color='white', fontsize=11)
ax.set_title('Multiplier effect on total impact', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Cold chain investment impact
ax = axes[1, 0]
adoption_rates = np.linspace(0, 1, 20)
annual_benefits = []
annual_costs = []
net_benefits = []

for rate in adoption_rates:
    impact = model.cold_chain_impact(adoption_rate=rate)
    annual_benefits.append(impact['annual_increase'] / 1e7)
    annual_costs.append(impact['annual_cost'] / 1e7)
    net_benefits.append((impact['annual_increase'] - impact['annual_cost']) / 1e7)

ax.plot(adoption_rates * 100, annual_benefits, color='#22c55e', linewidth=2, label='Revenue increase')
ax.plot(adoption_rates * 100, annual_costs, color='#ef4444', linewidth=2, label='Cold chain cost')
ax.plot(adoption_rates * 100, net_benefits, color='#3b82f6', linewidth=2.5, linestyle='--',
        label='Net benefit')
ax.fill_between(adoption_rates * 100, annual_costs, annual_benefits,
                where=np.array(annual_benefits) > np.array(annual_costs),
                alpha=0.15, color='#22c55e')
ax.set_xlabel('Cold chain adoption rate (%)', color='white', fontsize=11)
ax.set_ylabel('Annual value (Rs crore)', color='white', fontsize=11)
ax.set_title('Cold chain investment: cost vs benefit', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: 10-year projection with investment
ax = axes[1, 1]
years_proj = np.arange(2024, 2035)
baseline_turnover = model.annual_turnover()
organic_growth = 0.05  # 5% annual growth

projected_baseline = baseline_turnover * (1 + organic_growth) ** (years_proj - 2024)
projected_with_investment = projected_baseline.copy()
# Cold chain + infrastructure investment adds 15% boost starting year 2
for i in range(2, len(years_proj)):
    projected_with_investment[i] *= 1.15

ax.plot(years_proj, projected_baseline / 1e7, 'o-', color='#3b82f6', linewidth=2,
        label='Baseline (organic growth)')
ax.plot(years_proj, projected_with_investment / 1e7, 's-', color='#22c55e', linewidth=2,
        label='With cold chain + infrastructure')
ax.fill_between(years_proj, projected_baseline/1e7, projected_with_investment/1e7,
                alpha=0.15, color='#22c55e')
ax.set_xlabel('Year', color='white', fontsize=11)
ax.set_ylabel('Annual turnover (Rs crore)', color='white', fontsize=11)
ax.set_title('10-year market projection', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Impact on family welfare (gender economics)
ax = axes[1, 2]
categories_welfare = ['Child\\neducation', 'Family\\nnutrition', 'Healthcare', 'Housing\\nimprovement', 'Savings']
# Women-controlled income allocation (research-based estimates)
women_pct = [35, 30, 15, 10, 10]
men_pct = [15, 15, 10, 25, 35]

x_pos = np.arange(len(categories_welfare))
ax.bar(x_pos - 0.18, women_pct, 0.35, color='#ec4899', label='Women-controlled income',
       edgecolor='none')
ax.bar(x_pos + 0.18, men_pct, 0.35, color='#3b82f6', label='Men-controlled income',
       edgecolor='none')
ax.set_xticks(x_pos)
ax.set_xticklabels(categories_welfare, color='white', fontsize=8)
ax.set_ylabel('% of income', color='white', fontsize=10)
ax.set_title('How income is spent (gender effect)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Summary report
print("Ima Keithel Economic Model Summary")
print("=" * 60)
print(f"Total vendors: {model.n_vendors}")
print(f"Daily turnover: Rs {model.daily_turnover()/1e5:.0f} lakh")
print(f"Annual turnover: Rs {model.annual_turnover()/1e7:.0f} crore")
print(f"Total economic impact (2x multiplier): Rs {model.multiplier_effect()/1e7:.0f} crore")
print()
print(f"Vendor income: median Rs {np.median(incomes):.0f}/month, mean Rs {np.mean(incomes):.0f}/month")
print(f"Bottom 20% earn below Rs {np.percentile(incomes, 20):.0f}/month")
print(f"Top 20% earn above Rs {np.percentile(incomes, 80):.0f}/month")
print()
impact_50 = model.cold_chain_impact(0.5)
print(f"Cold chain (50% adoption):")
print(f"  Adopting vendors: {impact_50['adopters']}")
print(f"  Annual revenue increase: Rs {impact_50['annual_increase']/1e7:.1f} crore")
print(f"  Annual cost: Rs {impact_50['annual_cost']/1e7:.1f} crore")
print(f"  Net benefit: Rs {(impact_50['annual_increase']-impact_50['annual_cost'])/1e7:.1f} crore")
print()
print("Key finding: Ima Keithel generates Rs {:.0f} crore in total economic".format(model.multiplier_effect()/1e7))
print("impact annually — making the case for government infrastructure investment.")`,
      challenge: 'Add a network simulation: model the 5,000 vendors as a network where each vendor has 5-20 regular customers and 2-5 vendor-vendor connections. Simulate the spread of a cold chain innovation through the network (each adopter has a probability of influencing connected vendors to adopt). How long until 80% adoption, and does the network structure speed or slow diffusion?',
      successHint: 'You have built a comprehensive economic model that quantifies the "invisible" market. The key numbers — Rs 60+ crore annual turnover, 2x multiplier effect, 7x return on cold chain investment — make a compelling case for policy attention to informal markets.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Market Economics & Food Science
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (data analysis fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for economic modeling and food science simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
