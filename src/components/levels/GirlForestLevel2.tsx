import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function GirlForestLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Carbon accounting — measuring what matters',
      concept: `**Carbon accounting** is the systematic process of measuring, recording, and reporting greenhouse gas (GHG) emissions. It is the foundation of all climate policy: you cannot reduce what you do not measure.

**The GHG Protocol** divides emissions into three scopes:
- **Scope 1**: direct emissions from sources you own (your factory's smokestack, your company vehicles)
- **Scope 2**: indirect emissions from purchased energy (the power plant that generates your electricity)
- **Scope 3**: all other indirect emissions in your value chain (suppliers, transportation, product use, waste)

For most companies, Scope 3 is the largest (often 70-90% of total emissions) but the hardest to measure.

**Units:**
- Emissions are reported in **tonnes of CO₂ equivalent (tCO₂e)**
- "Equivalent" because different GHGs have different warming potentials:
  - CO₂: GWP = 1 (baseline)
  - Methane (CH₄): GWP = 28 (28× stronger than CO₂ over 100 years)
  - Nitrous oxide (N₂O): GWP = 265
  - HFCs: GWP = 1,000-10,000+

**Forests in carbon accounting:**
- A hectare of restored forest absorbs ~5-15 tCO₂/year (depends on species, age, climate)
- This absorption is called a **carbon sink** or **negative emissions**
- Forest degradation and fires are positive emissions (releasing stored carbon)`,
      analogy: 'Carbon accounting is like a bank statement for greenhouse gases. Scope 1 is your cash spending (direct). Scope 2 is your credit card bill (indirect, energy). Scope 3 is everything your money touches along the supply chain. Just as you need to see all three to understand your financial situation, you need all three scopes to understand your carbon footprint.',
      storyConnection: 'The Girl Who Grew a Forest was, unknowingly, creating a carbon sink — a negative entry in the atmospheric carbon ledger. If her forest covered 100 hectares and absorbed 10 tCO₂/hectare/year, she was removing 1,000 tonnes of CO₂ annually. Carbon accounting turns her intuitive good deed into measurable climate action.',
      checkQuestion: 'A factory emits 5,000 tCO₂ per year (Scope 1). It buys electricity that generates 3,000 tCO₂ (Scope 2). Its supply chain generates 20,000 tCO₂ (Scope 3). The factory installs solar panels and eliminates Scope 2. Has it made a significant dent?',
      checkAnswer: 'Not really. Total was 28,000 tCO₂. Eliminating Scope 2 saves 3,000 tCO₂ (only 11% of the total). Scope 3 at 20,000 tCO₂ (71%) remains untouched. This is why companies focusing only on their own operations and electricity miss the big picture. Real emissions reduction requires supply chain engagement.',
      codeIntro: 'Build a carbon accounting model for a hypothetical company with forest offset.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Company carbon accounting
years = np.arange(2020, 2031)

# Scope 1: direct emissions (slowly declining with efficiency improvements)
scope1 = 5000 * np.exp(-0.03 * (years - 2020))

# Scope 2: electricity (drops sharply with solar installation in 2024)
scope2 = np.where(years < 2024, 3000, 3000 * np.exp(-0.4 * (years - 2024)))

# Scope 3: supply chain (slowly declining as suppliers decarbonize)
scope3 = 20000 * np.exp(-0.02 * (years - 2020))

# Forest offset: planted in 2022, growing capacity
forest_offset = np.where(years < 2022, 0,
                np.minimum(2000, 200 * (years - 2022)**1.3))

# Net emissions
total = scope1 + scope2 + scope3
net = total - forest_offset

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Stacked area chart
ax1.set_facecolor('#111827')
ax1.fill_between(years, 0, scope1, alpha=0.7, color='#ef4444', label='Scope 1 (direct)')
ax1.fill_between(years, scope1, scope1+scope2, alpha=0.7, color='#f59e0b', label='Scope 2 (electricity)')
ax1.fill_between(years, scope1+scope2, total, alpha=0.7, color='#3b82f6', label='Scope 3 (supply chain)')
ax1.fill_between(years, 0, -forest_offset, alpha=0.5, color='#22c55e', label='Forest offset')
ax1.plot(years, net, 'o-', color='white', linewidth=2, markersize=4, label='Net emissions')
ax1.axhline(0, color='#6b7280', linewidth=0.5)

ax1.set_ylabel('tCO₂e per year', color='white')
ax1.set_title('Company Carbon Account (2020-2030)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9, loc='upper right')
ax1.tick_params(colors='gray')

# Scope breakdown comparison: 2020 vs 2030
ax2.set_facecolor('#111827')
labels = ['Scope 1', 'Scope 2', 'Scope 3', 'Forest offset', 'NET']
vals_2020 = [scope1[0], scope2[0], scope3[0], -forest_offset[0], net[0]]
vals_2030 = [scope1[-1], scope2[-1], scope3[-1], -forest_offset[-1], net[-1]]
colors_bar = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', 'white']

x = np.arange(len(labels))
w = 0.35
bars1 = ax2.bar(x - w/2, vals_2020, w, color=colors_bar, alpha=0.5, edgecolor='white', linewidth=0.5, label='2020')
bars2 = ax2.bar(x + w/2, vals_2030, w, color=colors_bar, alpha=0.9, edgecolor='white', linewidth=0.5, label='2030')

ax2.set_xticks(x)
ax2.set_xticklabels(labels, color='white')
ax2.set_ylabel('tCO₂e', color='white')
ax2.set_title('2020 vs 2030: Emissions by Scope', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.axhline(0, color='#6b7280', linewidth=0.5)

plt.tight_layout()
plt.show()

reduction = (1 - net[-1]/net[0]) * 100
print(f"Carbon accounting summary:")
print(f"  2020 total: {total[0]:,.0f} tCO₂e | Net: {net[0]:,.0f} tCO₂e")
print(f"  2030 total: {total[-1]:,.0f} tCO₂e | Net: {net[-1]:,.0f} tCO₂e")
print(f"  Reduction: {reduction:.1f}%")
print(f"  Forest offset in 2030: {forest_offset[-1]:,.0f} tCO₂e")
print()
print(f"Scope 3 remains the elephant in the room:")
print(f"  2020: {scope3[0]:,.0f} ({scope3[0]/total[0]*100:.0f}% of total)")
print(f"  2030: {scope3[-1]:,.0f} ({scope3[-1]/total[-1]*100:.0f}% of total)")`,
      challenge: 'The company wants to reach "net zero" by 2040. How much additional forest would need to be planted, OR how much faster must Scope 3 decline? Model both pathways and compare them.',
      successHint: 'Carbon accounting is the language of climate action. Without it, pledges like "net zero by 2050" are meaningless. With it, you can track progress, identify priorities, and hold companies and countries accountable — exactly what the Girl\'s forest does, one tonne at a time.',
    },
    {
      title: 'Net-zero calculations — the math of climate targets',
      concept: `**Net zero** means that the total amount of greenhouse gases emitted equals the total amount removed from the atmosphere. It does NOT mean zero emissions — it means emissions minus removals equals zero.

**The global net-zero math:**
- Current annual emissions: ~50 Gt CO₂e
- Paris Agreement goal: limit warming to 1.5°C
- Carbon budget remaining (for 50% chance of 1.5°C): ~400 Gt CO₂
- At current rates, budget exhausted by ~2030
- To stay within budget: emissions must halve by 2030, reach net zero by ~2050

**Pathways to net zero:**
1. **Reduce emissions**: efficiency, renewables, electrification, behavior change (~80% of the solution)
2. **Remove carbon**: forests, soil, direct air capture, BECCS (~20% of the solution)

**Carbon removal options:**
- Reforestation: $5-50/tCO₂, limited by land availability
- Soil carbon: $10-100/tCO₂, uncertain permanence
- BECCS (bioenergy + CCS): $100-200/tCO₂, unproven at scale
- Direct Air Capture (DAC): $250-600/tCO₂, energy-intensive but scalable
- Enhanced weathering: $50-200/tCO₂, slow but permanent

The Girl's forest is the cheapest carbon removal option. But even if we reforested every available hectare on Earth, it would offset only ~10% of current emissions. Forests are necessary but not sufficient — emission reductions are the priority.`,
      analogy: 'Net zero is like a bathtub. The faucet (emissions) is running. The drain (removals) is open. Net zero means adjusting both until the water level (atmospheric CO₂) stops rising. Right now, the faucet is blasting and the drain is a trickle. We need to mostly turn off the faucet (reduce emissions) and slightly widen the drain (increase removals).',
      storyConnection: 'The Girl\'s forest was a local drain — removing carbon from her patch of atmosphere. But net zero requires thinking globally. Her 100 hectares might offset the emissions of a small factory. The world needs millions of such projects PLUS massive emission reductions. Her story is inspiring but must be multiplied a million-fold.',
      checkQuestion: 'If global emissions are 50 Gt CO₂/year and all available land for reforestation could absorb 5 Gt CO₂/year, what percentage of emissions can reforestation offset? Why is this number important for policy?',
      checkAnswer: 'Only 10%. This means 90% of the solution MUST come from reducing emissions at source (clean energy, efficiency, industrial processes). Reforestation is vital but insufficient alone. Policy must prioritize emission reduction. Over-relying on tree planting risks "greenwashing" — using forests as an excuse to keep emitting.',
      codeIntro: 'Model pathways to net zero and the role of carbon removal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(2024, 2061)

# Business as usual: 1% annual growth
bau = 50 * 1.01**(years - 2024)

# Paris-aligned pathway: rapid decline to net zero by 2050
decline_rate = np.log(50) / (2050 - 2024)  # exponential decline
paris = 50 * np.exp(-decline_rate * (years - 2024))
paris = np.maximum(paris, 0)

# Realistic pathway: slower decline, needs carbon removal
realistic_emissions = 50 * np.exp(-0.05 * (years - 2024))

# Carbon removal ramp-up
removal_forest = np.minimum(5, 0.2 * (years - 2024))  # forests max at 5 Gt
removal_tech = np.where(years < 2030, 0, np.minimum(5, 0.3 * (years - 2030)**1.2))
total_removal = removal_forest + removal_tech

net_realistic = realistic_emissions - total_removal

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Emission pathways
ax1.set_facecolor('#111827')
ax1.plot(years, bau, color='#ef4444', linewidth=2, linestyle='--', label='Business as usual')
ax1.plot(years, paris, color='#22c55e', linewidth=2, label='Paris-aligned (1.5°C)')
ax1.plot(years, realistic_emissions, color='#f59e0b', linewidth=2, label='Realistic emissions')
ax1.fill_between(years, realistic_emissions, net_realistic,
                alpha=0.3, color='#3b82f6', label='Carbon removal')
ax1.plot(years, net_realistic, color='white', linewidth=2, label='Net emissions (realistic)')
ax1.axhline(0, color='#6b7280', linewidth=1)

# Find net-zero year
nz_idx = np.argmin(np.abs(net_realistic))
ax1.plot(years[nz_idx], net_realistic[nz_idx], '*', color='#f59e0b', markersize=15, zorder=5)
ax1.annotate(f'Net zero: ~{years[nz_idx]}', xy=(years[nz_idx], 0),
            xytext=(years[nz_idx]-5, 15), color='#f59e0b', fontsize=11,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax1.set_ylabel('Gt CO₂e / year', color='white')
ax1.set_title('Pathways to Net Zero', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Carbon removal breakdown
ax2.set_facecolor('#111827')
ax2.fill_between(years, 0, removal_forest, alpha=0.7, color='#22c55e', label='Forest restoration')
ax2.fill_between(years, removal_forest, total_removal, alpha=0.7, color='#3b82f6', label='Technology (DAC, BECCS)')
ax2.plot(years, total_removal, color='white', linewidth=1.5)

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Carbon removal (Gt CO₂e/year)', color='white')
ax2.set_title('Carbon Removal Ramp-Up Required', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Carbon budget calculation
cumulative_bau = np.cumsum(bau)
cumulative_real = np.cumsum(net_realistic)
budget = 400  # Gt CO2 remaining for 1.5C

print(f"Carbon budget analysis (remaining ~400 Gt CO₂ for 1.5°C):")
bau_exhausted = 2024 + np.argmax(cumulative_bau > budget)
real_exhausted = 2024 + np.argmax(cumulative_real > budget) if any(cumulative_real > budget) else 'Never'
print(f"  Business as usual: budget exhausted by {bau_exhausted}")
print(f"  Realistic pathway: budget exhausted by {real_exhausted}")
print(f"  Net zero year: ~{years[nz_idx]}")
print()
print(f"Removal in 2050: {total_removal[2050-2024]:.1f} Gt/year")
print(f"  Forests: {removal_forest[2050-2024]:.1f} Gt")
print(f"  Technology: {removal_tech[2050-2024]:.1f} Gt")`,
      challenge: 'What if Direct Air Capture costs fall from $500/tCO₂ to $100/tCO₂ by 2040 (following a learning curve)? Model the cost of removal over time. At what point does technological removal become cheaper than forest restoration?',
      successHint: 'Net-zero math is unforgiving: the numbers must add up. Forests provide the cheapest early removal, but technology must scale for the long term. The Girl\'s forest is part of the answer, but only the global accounting tells us whether we\'re on track.',
    },
    {
      title: 'REDD+ program — paying forests to stand',
      concept: `**REDD+** (Reducing Emissions from Deforestation and Forest Degradation) is a UN-backed framework that creates financial incentives for developing countries to preserve their forests.

**The logic:**
- Standing forests absorb and store carbon
- Cutting them releases that carbon
- If we pay landowners MORE to keep forests standing than they'd earn by cutting them, rational economics keeps the forest alive

**How REDD+ works:**
1. **Baseline**: establish how much deforestation would happen without intervention
2. **Monitoring**: use satellites to track actual deforestation
3. **Credits**: if actual deforestation is less than baseline, the difference generates carbon credits
4. **Payment**: credits are sold on carbon markets; revenue goes to forest communities and governments

**REDD+ in practice:**
- Covers 350+ million hectares across 65+ countries
- Has reduced deforestation in some areas by 30-50%
- Total investment: $10+ billion since 2008

**Criticisms:**
- **Baseline gaming**: setting artificially high baselines to generate more credits
- **Leakage**: protecting one forest may just push deforestation to a neighboring area
- **Permanence**: what if a protected forest burns 10 years later?
- **Indigenous rights**: some REDD+ projects displaced communities who lived in the forests
- **Additionality**: does the credit represent real additional emission reductions?`,
      analogy: 'REDD+ is like paying a farmer NOT to plow a field. It sounds strange, but if that field stores carbon worth more than the crops it would produce, paying the farmer to leave it alone is economically rational. The challenge is proving the farmer would have plowed (additionality) and that they won\'t secretly plow next year (permanence).',
      storyConnection: 'If the Girl\'s community had access to REDD+, they could have received payments for keeping their restored forest standing. The carbon stored in her trees would have generated credits sellable on international markets. Her environmental work would have become economic work too — aligning the community\'s financial interests with the forest\'s survival.',
      checkQuestion: 'A REDD+ project claims it "saved" 10,000 hectares of forest from deforestation. But the baseline assumed 50% of the forest would be cut (5,000 ha), while historically only 10% was ever cut. How many credits should the project legitimately receive?',
      checkAnswer: 'The legitimate baseline is 10% (1,000 hectares), not 50%. The project should receive credits for preventing 1,000 hectares of deforestation, not 5,000. If the inflated baseline stands, the project generates 4,000 hectares worth of "phantom" credits — carbon savings that were never at risk. This is the baseline gaming problem that undermines REDD+ credibility.',
      codeIntro: 'Model a REDD+ project: baseline deforestation, actual outcomes, and credit generation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# REDD+ project simulation over 20 years
years = np.arange(2025, 2046)
n_years = len(years)

# Forest area (hectares)
initial_forest = 50000

# Historical deforestation rate: 3% per year
hist_rate = 0.03

# Without REDD+ (counterfactual baseline)
forest_no_redd = initial_forest * (1 - hist_rate)**np.arange(n_years)

# With REDD+ (reduced deforestation to 1% per year)
redd_rate = 0.01
forest_with_redd = initial_forest * (1 - redd_rate)**np.arange(n_years)

# Inflated baseline (bad practice: claims 5% would be lost)
inflated_rate = 0.05
forest_inflated = initial_forest * (1 - inflated_rate)**np.arange(n_years)

# Carbon per hectare: 150 tonnes C = 550 tCO2
carbon_per_ha = 550  # tCO2

# Credits generated per year (legitimate vs inflated)
saved_legit = (forest_no_redd - forest_with_redd) * carbon_per_ha / 1e6  # MtCO2
saved_inflated = (forest_inflated - forest_with_redd) * carbon_per_ha / 1e6

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Forest area under different scenarios
ax1.set_facecolor('#111827')
ax1.plot(years, forest_no_redd, color='#ef4444', linewidth=2, label='Without REDD+ (3%/yr loss)')
ax1.plot(years, forest_with_redd, color='#22c55e', linewidth=2, label='With REDD+ (1%/yr loss)')
ax1.plot(years, forest_inflated, color='#f59e0b', linewidth=2, linestyle='--', label='Inflated baseline (5%/yr)')
ax1.fill_between(years, forest_no_redd, forest_with_redd, alpha=0.15, color='#22c55e',
                label='Legitimate savings')
ax1.fill_between(years, forest_inflated, forest_no_redd, alpha=0.1, color='#f59e0b',
                label='Phantom savings (inflated)')

ax1.set_ylabel('Forest area (hectares)', color='white')
ax1.set_title('REDD+ Project: Forest Preservation Scenarios', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Credits and revenue
ax2.set_facecolor('#111827')
price_per_tco2 = 15  # USD
revenue_legit = np.cumsum(saved_legit) * price_per_tco2
revenue_inflated = np.cumsum(saved_inflated) * price_per_tco2

ax2.plot(years, revenue_legit, color='#22c55e', linewidth=2, label='Legitimate revenue')
ax2.plot(years, revenue_inflated, color='#f59e0b', linewidth=2, linestyle='--', label='Revenue with inflated baseline')
ax2.fill_between(years, revenue_legit, revenue_inflated, alpha=0.15, color='#ef4444',
                label='Over-credited revenue')

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Cumulative revenue ($ millions)', color='white')
ax2.set_title('REDD+ Revenue: Legitimate vs Inflated Credits', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"20-year REDD+ project results:")
print(f"  Forest saved (legitimate): {forest_with_redd[-1] - forest_no_redd[-1]:,.0f} hectares")
print(f"  Carbon credits (legitimate): {np.sum(saved_legit):.2f} MtCO₂")
print(f"  Carbon credits (inflated):   {np.sum(saved_inflated):.2f} MtCO₂")
print(f"  Over-crediting: {np.sum(saved_inflated) - np.sum(saved_legit):.2f} MtCO₂ ({((np.sum(saved_inflated)/np.sum(saved_legit))-1)*100:.0f}% excess)")
print(f"\\n  Revenue at $15/tCO₂:")
print(f"    Legitimate: ${revenue_legit[-1]:.1f}M")
print(f"    Inflated:   ${revenue_inflated[-1]:.1f}M")
print(f"    Over-payment: ${revenue_inflated[-1] - revenue_legit[-1]:.1f}M")`,
      challenge: 'Add a "leakage" scenario: REDD+ reduces deforestation in the project area but 30% of the prevented deforestation shifts to a neighboring unprotected area. Recalculate the NET carbon savings after accounting for leakage.',
      successHint: 'REDD+ is the most ambitious attempt to financially value standing forests. Its problems (baselines, leakage, permanence) are real but solvable with better monitoring and governance. The Girl\'s forest, registered as a REDD+ project, could generate income for her community while protecting the climate.',
    },
    {
      title: 'Carbon credit markets — trading the right to emit',
      concept: `A **carbon credit** represents one tonne of CO₂ equivalent either reduced or removed from the atmosphere. Credits are traded on markets, creating a price signal that makes pollution costly and conservation profitable.

**Two types of carbon markets:**

1. **Compliance markets** (regulated):
   - Government sets a cap on total emissions
   - Companies receive or buy allowances (permits to emit)
   - If you emit less than your allowance, you sell the surplus
   - If you emit more, you must buy credits from others
   - EU ETS price: ~€80-100/tCO₂ (2024)

2. **Voluntary markets** (unregulated):
   - Companies buy credits voluntarily to offset their emissions
   - Credits come from projects: forests, renewables, cookstoves, etc.
   - Much lower prices: $5-50/tCO₂
   - Growing rapidly but plagued by quality concerns

**The pricing problem:**
- The "social cost of carbon" (true damage per tonne) is estimated at $50-200
- Most carbon credits trade at $5-20 (voluntary) or $80-100 (compliance)
- The gap between market price and true cost means carbon is still underpriced globally
- Underpriced carbon = insufficient incentive to reduce emissions

**Forest carbon credits:**
- Reforestation: grows trees, generates credits as trees absorb CO₂
- Avoided deforestation (REDD+): prevents emissions by keeping forests standing
- Improved forest management: sustainable logging practices vs. clear-cutting`,
      analogy: 'A carbon market is like a parking permit system. The city (government) decides how many cars (emissions) the downtown area can handle. It issues permits. If you don\'t need yours, sell it. If you need more, buy one. Over time, the city reduces the total number of permits, forcing everyone to find alternatives to driving (emitting).',
      storyConnection: 'The Girl\'s restored forest could generate carbon credits sold to a company in Mumbai or New York that needs to offset its emissions. Her trees absorb the CO₂; the company pays for the removal. It\'s an invisible trade route — carbon flows up into the trees, money flows to the community. A modern silk route where the commodity is clean air.',
      checkQuestion: 'Company A buys cheap carbon credits at $5/tonne from a questionable tree-planting project instead of reducing its own emissions (which would cost $50/tonne). What\'s wrong with this picture?',
      checkAnswer: 'Multiple problems: (1) If the credits don\'t represent real, permanent, additional carbon removal, the company is paying $5 for nothing — its emissions continue and no offsetting occurs. (2) Even if credits are legitimate, $5/tonne is far below the social cost of carbon ($50-200), meaning the true damage isn\'t being priced. (3) Offsetting delays the structural changes (clean energy, efficiency) that are needed for long-term decarbonization. Cheap credits can be a license to keep polluting.',
      codeIntro: 'Model carbon credit pricing, supply, demand, and market dynamics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Carbon market simulation
prices = np.linspace(1, 200, 100)  # USD per tCO2

# Supply: at higher prices, more projects become viable
# Forests: cheap (viable at $5+)
forest_supply = 3 * (1 - np.exp(-0.03 * prices))  # GtCO2, max ~3

# Tech removal (DAC): expensive (viable at $100+)
tech_supply = np.where(prices < 80, 0, 5 * (1 - np.exp(-0.01 * (prices - 80))))

# Renewables/efficiency credits
efficiency_supply = 10 * (1 - np.exp(-0.02 * prices))

total_supply = forest_supply + tech_supply + efficiency_supply

# Demand: compliance + voluntary
compliance_demand = 15 * np.exp(-0.005 * prices)  # regulated market
voluntary_demand = 3 * np.exp(-0.02 * prices)  # voluntary market
total_demand = compliance_demand + voluntary_demand

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Supply and demand curves
ax1.set_facecolor('#111827')
ax1.plot(total_supply, prices, color='#22c55e', linewidth=2, label='Total supply')
ax1.plot(total_demand, prices, color='#3b82f6', linewidth=2, label='Total demand')

# Supply components
ax1.fill_betweenx(prices, 0, forest_supply, alpha=0.15, color='#22c55e')
ax1.fill_betweenx(prices, forest_supply, forest_supply+efficiency_supply, alpha=0.15, color='#f59e0b')
ax1.fill_betweenx(prices, forest_supply+efficiency_supply, total_supply, alpha=0.15, color='#a855f7')

# Labels for supply components
ax1.text(1.5, 15, 'Forests', color='#22c55e', fontsize=9)
ax1.text(5, 50, 'Efficiency', color='#f59e0b', fontsize=9)
ax1.text(7, 150, 'DAC', color='#a855f7', fontsize=9)

# Equilibrium
diff = np.abs(total_supply - total_demand)
eq_idx = np.argmin(diff)
ax1.plot(total_supply[eq_idx], prices[eq_idx], 'o', color='#f59e0b', markersize=12, zorder=5)
ax1.annotate(f'Equilibrium\\n${prices[eq_idx]:.0f}/tCO₂',
            xy=(total_supply[eq_idx], prices[eq_idx]),
            xytext=(total_supply[eq_idx]+3, prices[eq_idx]+20),
            color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Social cost range
ax1.axhspan(50, 200, alpha=0.05, color='#ef4444')
ax1.text(1, 120, 'Social cost\\nof carbon\\n($50-200)', color='#ef4444', fontsize=8)

ax1.set_xlabel('Quantity (GtCO₂/year)', color='white')
ax1.set_ylabel('Price ($/tCO₂)', color='white')
ax1.set_title('Global Carbon Credit Market', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Price scenarios and their impact
ax2.set_facecolor('#111827')
price_scenarios = [5, 15, 50, 100, 200]
scenario_labels = ['$5\\n(current\\nvoluntary)', '$15\\n(avg\\nvoluntary)', '$50\\n(low\\nsocial cost)',
                   '$100\\n(EU ETS)', '$200\\n(high\\nsocial cost)']

for p, label in zip(price_scenarios, scenario_labels):
    forest_s = 3 * (1 - np.exp(-0.03 * p))
    tech_s = max(0, 5 * (1 - np.exp(-0.01 * (p - 80)))) if p > 80 else 0
    eff_s = 10 * (1 - np.exp(-0.02 * p))

    ax2.bar(label, forest_s, color='#22c55e', label='Forest' if p == 5 else '')
    ax2.bar(label, eff_s, bottom=forest_s, color='#f59e0b', label='Efficiency' if p == 5 else '')
    ax2.bar(label, tech_s, bottom=forest_s+eff_s, color='#a855f7', label='Technology' if p == 5 else '')

ax2.set_ylabel('Carbon reduction (GtCO₂/year)', color='white')
ax2.set_title('Carbon Reduction at Different Prices', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')
plt.setp(ax2.get_xticklabels(), color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Carbon price impact:")
for p in price_scenarios:
    forest_s = 3 * (1 - np.exp(-0.03 * p))
    tech_s = max(0, 5 * (1 - np.exp(-0.01 * (p - 80)))) if p > 80 else 0
    eff_s = 10 * (1 - np.exp(-0.02 * p))
    total = forest_s + tech_s + eff_s
    print(f"  At ${p:>3}/tCO₂: {total:.1f} GtCO₂/year reduced")
print()
print("Key insight: at $5/tCO₂, only forests are viable.")
print("At $100+/tCO₂, technology kicks in and reductions multiply.")`,
      challenge: 'If the Girl\'s forest covers 200 hectares and sequesters 10 tCO₂/ha/year, calculate her annual credit income at $5, $15, $50, and $100/tCO₂. At which price does forest conservation become more profitable than converting the land to agriculture ($500/ha/year)?',
      successHint: 'Carbon markets are the mechanism that turns the Girl\'s environmental work into economic value. The price of carbon determines whether forests are worth more standing or cut. Getting that price right is one of the most important policy challenges of the 21st century.',
    },
    {
      title: 'Modeling forest growth — predicting the future',
      concept: `Forest growth models predict how a forest will develop over time — how much carbon it will store, what species will dominate, and when it will reach maturity. These models are essential for planning reforestation and estimating carbon credits.

**Key modeling approaches:**

1. **Empirical models**: use measured data from real forests to predict growth
   - Growth tables: average height and diameter by age for each species
   - Site index: classification of land quality that predicts growth potential

2. **Process-based models**: simulate the underlying biology
   - Photosynthesis, respiration, water use, nutrient cycling
   - Can predict growth under changing climate conditions

3. **Gap models**: simulate individual trees competing for light and space
   - Trees grow, reproduce, and die based on resources
   - Forest composition changes over decades (succession)

**The Chapman-Richards growth model** (widely used):
**H(t) = H_max × (1 - e^(-k×t))^p**
- H_max: maximum height the species can reach
- k: growth rate parameter
- p: shape parameter (determines when growth is fastest)
- t: age in years

**Forest succession:**
- **Pioneer species** (years 0-15): fast-growing, sun-loving (bamboo, alder)
- **Secondary species** (years 10-50): moderate growth, partial shade tolerance
- **Climax species** (years 30-200+): slow-growing, shade-tolerant (dipterocarp, sal)`,
      analogy: 'Forest growth modeling is like a weather forecast but for decades instead of days. Just as meteorologists use physics equations to predict tomorrow\'s rain, forest modelers use biological equations to predict next decade\'s canopy. Both are imperfect but essential for planning.',
      storyConnection: 'If the Girl could model her forest\'s growth, she\'d know that the fast-growing pioneers she planted first would be overtaken by slower climax species within 30 years. The forest she started is not the forest that will stand a century from now. Growth models let us see this future, plan for succession, and maximize long-term carbon storage.',
      checkQuestion: 'A reforestation project plants fast-growing eucalyptus because it grows 3x faster than native species. Is this a good strategy for maximizing long-term carbon storage?',
      checkAnswer: 'No. Eucalyptus grows fast but is short-lived (30-50 years), stores relatively little carbon per tree, and creates low-biodiversity monocultures that are vulnerable to disease. Native climax species grow slower but ultimately store far more total carbon (they live for centuries) and support diverse ecosystems. Short-term speed is not the same as long-term capacity. The best strategy is mixed species: pioneers for quick cover, climax species for permanent storage.',
      codeIntro: 'Simulate forest growth and succession using the Chapman-Richards model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Chapman-Richards growth model: H(t) = Hmax * (1 - exp(-k*t))^p
years = np.arange(0, 201)

# Species parameters
species = {
    'Bamboo (pioneer)': {'hmax': 25, 'k': 0.15, 'p': 1.5, 'lifespan': 60, 'c_density': 30},
    'Alder (pioneer)': {'hmax': 20, 'k': 0.08, 'p': 2.0, 'lifespan': 80, 'c_density': 50},
    'Teak (secondary)': {'hmax': 35, 'k': 0.04, 'p': 2.5, 'lifespan': 150, 'c_density': 120},
    'Sal (climax)': {'hmax': 40, 'k': 0.025, 'p': 3.0, 'lifespan': 300, 'c_density': 200},
    'Hollong (climax)': {'hmax': 50, 'k': 0.02, 'p': 3.5, 'lifespan': 500, 'c_density': 300},
}

colors_sp = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Height growth curves
ax1.set_facecolor('#111827')
for (name, params), color in zip(species.items(), colors_sp):
    height = params['hmax'] * (1 - np.exp(-params['k'] * years))**params['p']
    # Apply mortality (decline after lifespan)
    mortality = np.where(years > params['lifespan'],
                        np.exp(-0.05 * (years - params['lifespan'])), 1.0)
    effective_height = height * mortality
    ax1.plot(years, effective_height, color=color, linewidth=2, label=name)

ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Tree Growth Curves: Pioneer → Climax Succession', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8, loc='upper left')
ax1.tick_params(colors='gray')

# Shade phases
ax1.axvspan(0, 15, alpha=0.05, color='#22c55e')
ax1.axvspan(15, 50, alpha=0.05, color='#f59e0b')
ax1.axvspan(50, 200, alpha=0.05, color='#a855f7')
ax1.text(7, 45, 'Pioneer phase', color='#22c55e', fontsize=8, ha='center')
ax1.text(32, 45, 'Secondary', color='#f59e0b', fontsize=8, ha='center')
ax1.text(125, 45, 'Climax phase', color='#a855f7', fontsize=8, ha='center')

# Carbon storage over time (forest-level)
ax2.set_facecolor('#111827')

# Simplified forest carbon: weighted sum of species contributions
# Early: dominated by pioneers. Late: dominated by climax
forest_carbon = np.zeros_like(years, dtype=float)
for name, params in species.items():
    # Abundance shifts over time (succession)
    if 'pioneer' in name:
        abundance = np.exp(-0.02 * years) * 0.5
    elif 'secondary' in name:
        abundance = 0.3 * np.exp(-0.005 * (years - 30)**2 / 500)
    else:
        abundance = 0.3 * (1 - np.exp(-0.02 * years))

    height = params['hmax'] * (1 - np.exp(-params['k'] * years))**params['p']
    # Carbon ~ height^2.5 (allometric relationship)
    tree_carbon = params['c_density'] * (height / params['hmax'])**2.5
    forest_carbon += abundance * tree_carbon

ax2.fill_between(years, forest_carbon, alpha=0.3, color='#22c55e')
ax2.plot(years, forest_carbon, color='#22c55e', linewidth=2)
ax2.set_xlabel('Years since planting', color='white')
ax2.set_ylabel('Carbon stored (tC/ha)', color='white')
ax2.set_title('Forest-Level Carbon Accumulation (with succession)', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Annotate phases
ax2.annotate(f'50 yr: {forest_carbon[50]:.0f} tC/ha', xy=(50, forest_carbon[50]),
            xytext=(70, forest_carbon[50]+20), color='#f59e0b', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.annotate(f'100 yr: {forest_carbon[100]:.0f} tC/ha', xy=(100, forest_carbon[100]),
            xytext=(120, forest_carbon[100]+15), color='#f59e0b', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Forest growth phases:")
print("  0-15 years:  Pioneer species dominate, rapid canopy closure")
print("  15-50 years: Secondary species overtake, carbon accumulates fast")
print("  50-200 years: Climax species dominate, maximum carbon storage")
print()
print(f"Carbon storage milestones:")
for yr in [10, 25, 50, 100, 200]:
    print(f"  Year {yr:>3}: {forest_carbon[yr]:>6.1f} tC/ha ({forest_carbon[yr]*3.67:>6.0f} tCO₂/ha)")`,
      challenge: 'Climate change increases temperature by 2°C, which increases the growth rate (k) by 20% but also increases drought stress (reduce Hmax by 15%). Model this climate-change scenario alongside the baseline. Does the forest store more or less carbon under warming?',
      successHint: 'Forest growth models turn ecology into data science. With the right parameters, you can predict how much carbon a reforestation project will store decades into the future. This is how REDD+ credits are calculated, how reforestation projects are evaluated, and how the Girl\'s forest can be valued in the global carbon economy.',
    },
    {
      title: 'Remote sensing for deforestation detection — algorithms that save forests',
      concept: `Detecting deforestation from satellite imagery is a **classification problem** — for each pixel, determine whether it's forest, non-forest, or recently deforested. Modern systems combine multiple data sources and algorithms.

**Data sources:**
- **Optical** (Landsat, Sentinel-2): NDVI, color, texture. Resolution: 10-30m. Problem: clouds.
- **Radar** (Sentinel-1): SAR backscatter. Penetrates clouds. Lower resolution but always available.
- **LiDAR** (airborne): measures canopy height with cm accuracy. Expensive, limited coverage.
- **Nighttime light** (VIIRS): detects fires and human activity expansion.

**Detection algorithms:**

1. **Thresholding**: if NDVI drops below 0.3, flag as deforested. Simple, fast, many false positives.

2. **Time-series analysis** (BFAST, LandTrendr): analyze the NDVI history of each pixel over years. A sudden drop indicates deforestation. A gradual decline may indicate degradation.

3. **Machine learning** (Random Forest, CNN): train on labeled examples of "forest" and "not forest." Can achieve 90%+ accuracy. Requires training data.

4. **Change detection (differencing)**: subtract before-image from after-image. Large negative values = loss.

**Global Forest Watch** uses a combination of these methods to provide near-real-time deforestation alerts worldwide. Alert latency: ~1 week for tropical regions.

**NE India challenge:** persistent monsoon cloud cover means optical satellites can be blinded for months. Radar (Sentinel-1) is critical for year-round monitoring in this region.`,
      analogy: 'Deforestation detection is like a security camera system for forests. Optical satellites are daytime cameras (useless in fog/clouds). Radar is an infrared camera (works in any weather). Time-series analysis is like reviewing security footage — looking for the moment something changed. Machine learning is a trained security guard who can spot intruders in the footage automatically.',
      storyConnection: 'If the Girl\'s region had access to real-time deforestation alerts, the illegal logging that destroyed the original forest might have been caught and stopped. Today, anyone can go to Global Forest Watch, type in a location in NE India, and see exactly where forests are being lost, week by week. The technology exists — the challenge is using it to drive action.',
      checkQuestion: 'A deforestation detection algorithm flags 100 pixels as "deforested." Ground truthing reveals only 60 are actually deforested; 40 are false alarms (clouds, seasonal leaf drop). What is the precision? Is this acceptable?',
      checkAnswer: 'Precision = true positives / (true positives + false positives) = 60/100 = 60%. This is not great — 40% false alarm rate wastes investigation resources. However, the alternative is missing deforestation entirely. In practice, systems are tuned for high recall (catching all real deforestation, even at the cost of false alarms) because missing real deforestation is worse than investigating a false alarm.',
      codeIntro: 'Implement a simple deforestation detection algorithm using NDVI time series.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate NDVI time series for 3 pixels over 5 years (monthly data)
months = np.arange(60)  # 5 years of monthly data
dates = [f'{2020 + m//12}-{(m%12)+1:02d}' for m in months]

# Pixel 1: Stable forest (seasonal variation only)
seasonal = 0.15 * np.sin(2 * np.pi * months / 12)
forest_stable = 0.75 + seasonal + np.random.normal(0, 0.03, 60)

# Pixel 2: Deforestation event at month 30
forest_deforested = np.copy(forest_stable)
forest_deforested[30:] = 0.15 + np.random.normal(0, 0.05, 30)
forest_deforested[30:33] = np.linspace(forest_stable[29], 0.15, 3)  # transition

# Pixel 3: Gradual degradation
forest_degraded = 0.75 + seasonal - 0.008 * months + np.random.normal(0, 0.03, 60)

# Detection: BFAST-like breakpoint detection (simplified)
def detect_change(ndvi, window=12):
    """Simple change detection: compare recent mean to historical mean"""
    alerts = []
    for i in range(window, len(ndvi)):
        historical_mean = np.mean(ndvi[max(0, i-2*window):i-window])
        recent_mean = np.mean(ndvi[i-window:i])
        change = recent_mean - historical_mean
        if change < -0.2:  # significant drop
            alerts.append((i, change))
    return alerts

fig, axes = plt.subplots(3, 1, figsize=(14, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('NDVI Time Series: Deforestation Detection', color='white', fontsize=14)

pixels = [
    ('Stable forest', forest_stable, '#22c55e'),
    ('Deforestation (month 30)', forest_deforested, '#ef4444'),
    ('Gradual degradation', forest_degraded, '#f59e0b'),
]

for idx, (label, ndvi, color) in enumerate(pixels):
    ax = axes[idx]
    ax.set_facecolor('#111827')
    ax.plot(months, ndvi, color=color, linewidth=1.5, alpha=0.8)

    # Detection threshold
    ax.axhline(0.3, color='#6b7280', linestyle=':', linewidth=1, alpha=0.5)
    ax.text(58, 0.32, 'Alert threshold', color='#6b7280', fontsize=7, ha='right')

    # Run detection
    alerts = detect_change(ndvi)
    for alert_month, change_val in alerts:
        ax.axvline(alert_month, color='#ef4444', linestyle='--', linewidth=1, alpha=0.7)
        ax.text(alert_month + 0.5, 0.9, f'ALERT\\n(Δ={change_val:.2f})',
               color='#ef4444', fontsize=7)

    # Confidence bands (rolling mean ± std)
    window = 6
    rolling_mean = np.convolve(ndvi, np.ones(window)/window, mode='same')
    rolling_std = np.array([np.std(ndvi[max(0,i-window):i+1]) for i in range(len(ndvi))])
    ax.fill_between(months, rolling_mean - 2*rolling_std, rolling_mean + 2*rolling_std,
                   alpha=0.1, color=color)

    ax.set_ylabel('NDVI', color='white')
    ax.set_title(label, color=color, fontsize=11)
    ax.tick_params(colors='gray')
    ax.set_ylim(-0.1, 1.0)

axes[-1].set_xlabel('Month', color='white')
# Add year labels
for yr in range(5):
    axes[-1].text(yr*12 + 6, -0.05, f'{2020+yr}', color='#9ca3af', ha='center', fontsize=8)

plt.tight_layout()
plt.show()

print("Detection results:")
for label, ndvi, _ in pixels:
    alerts = detect_change(ndvi)
    print(f"  {label}:")
    if alerts:
        for month, change in alerts:
            print(f"    Alert at month {month} (NDVI drop: {change:.2f})")
    else:
        print(f"    No alerts (forest intact)")
print()
print("Detection challenges:")
print("  - Cloud cover creates false NDVI drops")
print("  - Seasonal leaf drop mimics degradation")
print("  - Gradual degradation is harder to detect than abrupt clearing")
print("  - Radar (SAR) data helps fill gaps when clouds block optical sensors")`,
      challenge: 'Add noise to the deforestation signal (simulate cloud contamination by randomly setting 20% of pixels to NDVI=0.1). How does this affect the detection algorithm? Implement a cloud filter that ignores anomalously low single-month readings.',
      successHint: 'From carbon accounting to net-zero math to REDD+ to carbon markets to growth models to remote sensing — you now have the full toolkit of climate-forest science. The Girl Who Grew a Forest did the planting. The science quantifies the impact. Together, they represent humanity\'s best response to the climate crisis.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 reforestation and carbon foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for climate science and carbon modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
