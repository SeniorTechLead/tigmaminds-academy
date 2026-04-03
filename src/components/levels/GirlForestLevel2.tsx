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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Carbon accounting — counting every tonne',
      concept: `**Carbon accounting** is the systematic process of measuring, recording, and reporting greenhouse gas (GHG) emissions. It works like financial accounting but for carbon.

**The GHG Protocol** defines three scopes:
- **Scope 1**: Direct emissions from sources you own (factory smokestacks, company vehicles)
- **Scope 2**: Indirect emissions from purchased electricity and heat
- **Scope 3**: All other indirect emissions (supply chain, employee commuting, product use, waste)

For a country or forest project, the accounting is:
- **Emissions** = fossil fuels burned + deforestation + agriculture + industrial processes
- **Removals** = forest growth + soil carbon increase + ocean absorption
- **Net emissions** = Emissions - Removals

**Units:**
- **tCO₂e** (tonnes of CO₂ equivalent): the standard unit. Methane (CH₄) is 80x more potent than CO₂ over 20 years, so 1 tonne of methane = 80 tCO₂e.
- **GtCO₂** (gigatonnes): global scale. World emits ~40 GtCO₂/year.

Accurate carbon accounting is essential for:
- Setting reduction targets
- Verifying whether targets are met
- Carbon trading (you can only trade what you can measure)
- Climate policy (countries report emissions under the Paris Agreement)`,
      analogy: 'Carbon accounting is bookkeeping for the planet. Emissions are expenses, removals are income, and net emissions are your profit or loss. A net-zero target means your carbon budget must balance — every tonne emitted must be matched by a tonne removed. Right now, the planet is running a massive deficit.',
      storyConnection: 'If we applied carbon accounting to the Girl\'s forest: her emissions (Scope 1) were nearly zero — she used hand tools and walked. Her removals were enormous — thousands of trees absorbing CO₂ for decades. Her forest project would be deeply "carbon negative" — removing far more carbon than it caused. This is the kind of project that generates carbon credits.',
      checkQuestion: 'A company claims to be "carbon neutral" because it bought carbon offsets for all its Scope 1 and 2 emissions. But it ignores Scope 3. Is it truly carbon neutral?',
      checkAnswer: 'No. For most companies, Scope 3 emissions are 70-90% of total emissions (supply chain, product use, employee commuting). Ignoring Scope 3 is like a household claiming it has no expenses because it only counts rent but ignores food, transport, and entertainment. True carbon neutrality requires accounting for all three scopes.',
      codeIntro: 'Build a carbon accounting model for a reforestation project.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Carbon accounting for a 1,000-hectare reforestation project over 30 years
years = np.arange(0, 31)
area_ha = 1000

# EMISSIONS from the project
# Scope 1: machinery for planting (Year 0-2)
scope1 = np.zeros(31)
scope1[0:3] = 50  # tonnes CO2/year for tractors, transport

# Scope 2: nursery electricity
scope2 = np.zeros(31)
scope2[0:5] = 20  # tonnes CO2/year for nursery operations

# Scope 3: supply chain (seedlings, tools, worker transport)
scope3 = np.zeros(31)
scope3[0:3] = 100
scope3[3:10] = 30  # ongoing maintenance

total_emissions = scope1 + scope2 + scope3

# REMOVALS: carbon sequestration by growing trees
# Trees absorb more as they grow, following a sigmoid-derivative pattern
max_annual_removal = area_ha * 8  # 8 tCO2/ha/year at peak
k = 0.2
t_mid = 10
annual_removal = max_annual_removal * k * np.exp(-k * (years - t_mid)) / (1 + np.exp(-k * (years - t_mid)))**2
annual_removal = np.maximum(annual_removal, 0)

# Cumulative balance
net_annual = annual_removal - total_emissions
cumulative = np.cumsum(net_annual)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Annual flows
ax1.set_facecolor('#111827')
ax1.bar(years, -total_emissions, color='#ef4444', alpha=0.8, label='Emissions (project activities)')
ax1.bar(years, annual_removal, color='#22c55e', alpha=0.8, label='Removals (tree growth)')
ax1.plot(years, net_annual, 'o-', color='#f59e0b', linewidth=2, markersize=4, label='Net balance')
ax1.axhline(0, color='#6b7280', linewidth=0.5)
ax1.set_ylabel('tCO₂/year', color='white')
ax1.set_title('Annual Carbon Flows: 1,000 ha Reforestation Project', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Cumulative
ax2.set_facecolor('#111827')
ax2.fill_between(years, cumulative, where=cumulative >= 0, alpha=0.2, color='#22c55e')
ax2.fill_between(years, cumulative, where=cumulative < 0, alpha=0.2, color='#ef4444')
ax2.plot(years, cumulative, color='#22c55e', linewidth=2)
ax2.axhline(0, color='#6b7280', linewidth=0.5)

# Find break-even point
breakeven = np.where(cumulative >= 0)[0]
if len(breakeven) > 0:
    be_year = breakeven[0]
    ax2.plot(be_year, 0, 'o', color='#f59e0b', markersize=12, zorder=5)
    ax2.annotate(f'Break-even: Year {be_year}', xy=(be_year, 0), xytext=(be_year+3, -500),
                color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Cumulative tCO₂', color='white')
ax2.set_title('Cumulative Carbon Balance (when does the project "pay off"?)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

total_emitted = sum(total_emissions)
total_removed = sum(annual_removal)
print(f"30-year carbon account:")
print(f"  Total emissions:  {total_emitted:,.0f} tCO₂")
print(f"  Total removals:   {total_removed:,.0f} tCO₂")
print(f"  Net sequestered:  {total_removed - total_emitted:,.0f} tCO₂")
print(f"  Break-even year:  {be_year}")
print(f"  Removal/emission ratio: {total_removed/total_emitted:.0f}:1")`,
      challenge: 'Add a wildfire in Year 15 that destroys 20% of the forest (releasing 20% of stored carbon back to atmosphere). How does this change the cumulative balance? Does the project still break even? This is called "permanence risk" — a key issue in carbon markets.',
      successHint: 'Carbon accounting transforms climate action from vague intentions to precise measurements. Without it, a reforestation project is just "planting trees." With it, it becomes a quantified carbon removal asset worth real money in carbon markets.',
    },
    {
      title: 'Net-zero calculations — the math of climate targets',
      concept: `**Net zero** means that the total amount of greenhouse gases emitted equals the total amount removed from the atmosphere. It doesn't mean zero emissions — it means the emissions that remain are balanced by removals.

**The global net-zero target:** reach net-zero CO₂ by 2050 to limit warming to 1.5°C.

**The math:**
- Current emissions: ~40 GtCO₂/year
- Current removals (natural sinks): ~20 GtCO₂/year
- Current net: +20 GtCO₂/year (accumulating in atmosphere)
- To reach net zero: either reduce emissions to 20 GtCO₂ OR increase removals to 40 GtCO₂ OR both

**Reduction pathways:**
- 50% reduction by 2030 (from 2019 levels) to stay on track for 1.5°C
- This means cutting ~4% of emissions per year, compounding

**Carbon budget:** the total CO₂ we can still emit before crossing 1.5°C:
- Remaining budget: ~400 GtCO₂ (as of 2024)
- At current rates: budget exhausted by ~2034
- With reductions: budget can last until 2050+

**India's targets:**
- Net-zero by 2070 (20 years after most developed nations)
- 50% electricity from non-fossil sources by 2030
- Reduce carbon intensity of GDP by 45% by 2030 (vs. 2005)`,
      analogy: 'Net zero is like a bathtub. The faucet (emissions) is on full blast. The drain (removals) is half open. The water level (atmospheric CO₂) keeps rising. Net zero means adjusting the faucet and drain until the water level stops rising. You don\'t need to turn the faucet off completely — just match the flow with drainage.',
      storyConnection: 'The Girl\'s forest was a natural removal system — a bigger drain. But no forest can offset an industrial economy. The lesson of her story scales up: every community can contribute to removals, but the real solution requires turning down the faucet (reducing emissions) at the same time.',
      checkQuestion: 'If the world needs to cut emissions by 50% by 2030 (from 40 to 20 GtCO₂), is it realistic to achieve this through reforestation alone?',
      checkAnswer: 'No. All the world\'s reforestation combined could remove at most 3-5 GtCO₂/year (there isn\'t enough suitable land for more). We need to remove 20 GtCO₂ from the current flow. That requires cutting fossil fuel use (energy, transport, industry) — reforestation is a supplement, not a substitute. A common trap is treating tree planting as an alternative to emission reductions. It\'s both, not either/or.',
      codeIntro: 'Model different emission reduction pathways to net zero.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(2024, 2071)
current_emissions = 40  # GtCO2/year

# Pathway 1: Linear reduction to net-zero by 2050
pathway_2050 = current_emissions * (1 - (years - 2024) / (2050 - 2024))
pathway_2050 = np.maximum(pathway_2050, 0)

# Pathway 2: Gradual start, accelerating (India-like, net-zero 2070)
pathway_2070 = current_emissions * np.exp(-0.04 * (years - 2024))
pathway_2070[years > 2065] = pathway_2070[years == 2065]  # plateau near zero

# Pathway 3: Delayed action (no reduction until 2030, then steep)
pathway_delayed = np.where(years < 2030, current_emissions,
                           current_emissions * (1 - (years - 2030) / (2045 - 2030)))
pathway_delayed = np.maximum(pathway_delayed, 0)

# Natural removal capacity
removal_capacity = 20  # GtCO2/year (forests + oceans)
enhanced_removal = np.where(years < 2030, 20, 20 + 0.5 * (years - 2030))
enhanced_removal = np.minimum(enhanced_removal, 30)  # max realistic enhancement

# Carbon budget remaining
budget = 400  # GtCO2 remaining for 1.5°C
cumulative_2050 = np.cumsum(pathway_2050)
cumulative_2070 = np.cumsum(pathway_2070)
cumulative_delayed = np.cumsum(pathway_delayed)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Emission pathways
ax1.set_facecolor('#111827')
ax1.plot(years, pathway_2050, color='#22c55e', linewidth=2, label='Net-zero 2050 (linear)')
ax1.plot(years, pathway_2070, color='#3b82f6', linewidth=2, label='Net-zero 2070 (gradual)')
ax1.plot(years, pathway_delayed, color='#ef4444', linewidth=2, label='Delayed action (2030 start)')
ax1.fill_between(years, enhanced_removal, alpha=0.15, color='#a855f7')
ax1.plot(years, enhanced_removal, color='#a855f7', linewidth=1, linestyle='--', label='Removal capacity')
ax1.axhline(0, color='#6b7280', linewidth=0.5)

ax1.set_ylabel('GtCO₂/year', color='white')
ax1.set_title('Emission Reduction Pathways to Net Zero', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Cumulative emissions vs carbon budget
ax2.set_facecolor('#111827')
ax2.plot(years, cumulative_2050, color='#22c55e', linewidth=2, label='Net-zero 2050')
ax2.plot(years, cumulative_2070, color='#3b82f6', linewidth=2, label='Net-zero 2070')
ax2.plot(years, cumulative_delayed, color='#ef4444', linewidth=2, label='Delayed action')
ax2.axhline(budget, color='#f59e0b', linewidth=2, linestyle='--', label=f'1.5°C budget ({budget} Gt)')

# Find budget exhaustion years
for path, name, color in [(cumulative_2050, '2050', '#22c55e'),
                            (cumulative_2070, '2070', '#3b82f6'),
                            (cumulative_delayed, 'Delayed', '#ef4444')]:
    exceed = np.where(path > budget)[0]
    if len(exceed) > 0:
        yr = years[exceed[0]]
        ax2.plot(yr, budget, 'x', color=color, markersize=12, markeredgewidth=3)
        ax2.annotate(f'Budget exceeded: {yr}', xy=(yr, budget),
                    xytext=(yr+2, budget+50), color=color, fontsize=8)

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Cumulative emissions (GtCO₂)', color='white')
ax2.set_title('Cumulative Emissions vs Carbon Budget', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Pathway analysis:")
print(f"  Net-zero 2050: cumulative = {cumulative_2050[-1]:.0f} GtCO₂")
print(f"  Net-zero 2070: cumulative = {cumulative_2070[-1]:.0f} GtCO₂")
print(f"  Delayed action: cumulative = {cumulative_delayed[-1]:.0f} GtCO₂")
print(f"\\n  1.5°C carbon budget: {budget} GtCO₂")
print(f"  At 40 Gt/year, budget exhausted in {budget/40:.0f} years ({2024 + budget//40})")`,
      challenge: 'India argues it should have a later net-zero date (2070) because its cumulative historical emissions are much lower than the US or EU. Calculate cumulative emissions for India (starting at 3 GtCO₂/year, growing 4%/year) vs. USA (starting at 5 GtCO₂/year, declining 2%/year). Who has the bigger cumulative total by 2070?',
      successHint: 'Net-zero is a math problem with a hard deadline. The carbon budget is finite, pathways are computable, and every year of delay narrows our options. Understanding the math is what separates credible climate plans from political rhetoric.',
    },
    {
      title: 'REDD+ program — paying countries to keep forests standing',
      concept: `**REDD+** stands for Reducing Emissions from Deforestation and Forest Degradation (plus conservation, sustainable management, and enhancement of forest carbon stocks). It's a UN framework that creates financial incentives for developing countries to protect their forests.

**The logic:**
- Tropical deforestation causes ~10% of global emissions
- It's often cheaper to prevent deforestation than to reduce industrial emissions
- Pay forest countries NOT to cut down their trees

**How it works:**
1. Establish a **baseline**: what deforestation rate would occur without the REDD+ program?
2. **Measure** actual deforestation (using satellites)
3. **Calculate** avoided emissions: (baseline deforestation - actual deforestation) × carbon per hectare
4. **Issue credits**: each tonne of CO₂ avoided = 1 credit
5. **Sell credits**: rich countries/companies buy credits to offset their emissions

**Challenges:**
- **Leakage**: protecting forest in one area may just push deforestation to another area
- **Additionality**: would the forest have survived anyway? Credits for forests that weren't threatened are worthless
- **Permanence**: what if the forest is cut down later? The carbon "saved" gets re-released
- **Indigenous rights**: forests are home to 370 million Indigenous people. Their consent and benefit-sharing are essential

**Scale:**
- $5-10 billion/year in REDD+ finance as of 2024
- Could potentially reduce 1-5 GtCO₂/year if fully funded`,
      analogy: 'REDD+ is like paying a farmer NOT to plow a field. The farmer gives up the income from crops; in return, they receive payment for the environmental service the untouched field provides (carbon storage, biodiversity, water). The challenge is proving the farmer would actually have plowed — otherwise you\'re paying for nothing.',
      storyConnection: 'The Girl\'s forest, once established, could qualify for REDD+ credits. If satellite data showed that nearby forests were being cleared but hers remained standing, the "avoided deforestation" credits could generate income for her community. REDD+ turns the Girl\'s environmental work into an economic asset.',
      checkQuestion: 'A REDD+ project claims it prevented deforestation of 10,000 hectares and issues credits for 1.5 million tCO₂ avoided. But critics point out the forest was in a national park that was already protected by law. Is this a valid REDD+ project?',
      checkAnswer: 'Probably not — this fails the "additionality" test. If the forest was legally protected and enforcement was effective, it would have survived without REDD+ money. The credits represent carbon that was never at risk of being released. Issuing them is like selling fire insurance for a building made of fireproof materials. Legitimate REDD+ requires demonstrating that deforestation would genuinely have occurred without the program.',
      codeIntro: 'Model a REDD+ carbon crediting scenario with baseline projections.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# REDD+ scenario: a 100,000 hectare tropical forest
total_forest = 100000  # hectares
carbon_per_ha = 150  # tonnes C per hectare

years = np.arange(2020, 2041)

# Baseline: deforestation without REDD+ (3% per year)
baseline_rate = 0.03
forest_baseline = total_forest * (1 - baseline_rate) ** (years - 2020)

# With REDD+: deforestation reduced to 0.5% per year
redd_rate = 0.005
forest_redd = total_forest * (1 - redd_rate) ** (years - 2020)

# Avoided deforestation
avoided_ha = forest_redd - forest_baseline
avoided_carbon = avoided_ha * carbon_per_ha  # tonnes C
avoided_co2 = avoided_carbon * 3.67  # tonnes CO2

# Annual credits
annual_credits = np.diff(avoided_co2)
annual_credits = np.insert(annual_credits, 0, 0)

# Financial value ($5/tonne CO2)
price_per_tonne = 5
annual_revenue = np.abs(annual_credits) * price_per_tonne

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Forest area comparison
ax1.set_facecolor('#111827')
ax1.fill_between(years, forest_baseline/1000, alpha=0.2, color='#ef4444')
ax1.fill_between(years, forest_redd/1000, alpha=0.2, color='#22c55e')
ax1.plot(years, forest_baseline/1000, color='#ef4444', linewidth=2, label='Without REDD+ (3%/yr loss)')
ax1.plot(years, forest_redd/1000, color='#22c55e', linewidth=2, label='With REDD+ (0.5%/yr loss)')

# Shade avoided deforestation
ax1.fill_between(years, forest_baseline/1000, forest_redd/1000, alpha=0.3, color='#f59e0b',
                 label='Avoided deforestation')

ax1.set_ylabel('Forest area (thousand hectares)', color='white')
ax1.set_title('REDD+ Impact: Forest Area Over Time', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Credits and revenue
ax2.set_facecolor('#111827')
ax2_twin = ax2.twinx()

ax2.bar(years, annual_revenue / 1e6, color='#f59e0b', alpha=0.6, label='Revenue ($M)')
ax2_twin.plot(years, np.cumsum(np.abs(annual_credits)) / 1e6, color='#22c55e', linewidth=2,
              label='Cumulative credits (MtCO₂)')

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Annual revenue ($M)', color='#f59e0b')
ax2_twin.set_ylabel('Cumulative credits (MtCO₂)', color='#22c55e')
ax2.set_title('REDD+ Carbon Credits and Revenue', color='white', fontsize=11)
ax2.tick_params(colors='gray', axis='x')
ax2.tick_params(colors='#f59e0b', axis='y')
ax2_twin.tick_params(colors='#22c55e')

# Combined legend
lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', labelcolor='white', fontsize=9)

plt.tight_layout()
plt.show()

total_avoided = (forest_redd[-1] - forest_baseline[-1])
total_co2 = total_avoided * carbon_per_ha * 3.67
total_revenue = sum(annual_revenue)
print(f"20-year REDD+ results:")
print(f"  Forest saved: {total_avoided:,.0f} hectares")
print(f"  CO₂ avoided: {total_co2/1e6:,.1f} million tonnes")
print(f"  Total revenue at {price_per_tonne}/tonne: {total_revenue/1e6:,.1f} million")
print(f"  Revenue per hectare saved: {total_revenue/total_avoided:,.0f}")
print()
print("Challenges:")
print("  Leakage: does deforestation just move elsewhere?")
print("  Permanence: will the forest still stand in 50 years?")
print("  Additionality: would it have been cut without REDD+?")`,
      challenge: 'Model "leakage": 30% of the avoided deforestation in the REDD+ area shifts to an adjacent unprotected forest. Recalculate the net carbon savings. Is the project still worth funding?',
      successHint: 'REDD+ is the most ambitious attempt to put a price on standing forests. It has real flaws (leakage, additionality, permanence), but the alternative — no financial value for forests — leads to even more deforestation. Understanding the model helps you evaluate which REDD+ projects are legitimate and which are greenwashing.',
    },
    {
      title: 'Carbon credit markets — buying and selling the right to emit',
      concept: `A **carbon credit** represents 1 tonne of CO₂ that has been either avoided (not emitted) or removed (taken from the atmosphere). Carbon markets allow these credits to be bought and sold.

**Two types of carbon markets:**

**1. Compliance markets** (mandatory):
- Governments set a cap on total emissions
- Companies receive or buy allowances (permits to emit)
- If you emit less than your allowance, you can sell surplus
- If you emit more, you must buy from others
- Example: EU Emissions Trading System (EU ETS) — largest at ~$90/tonne (2023)

**2. Voluntary markets** (optional):
- Companies buy credits voluntarily (CSR, branding, genuine climate commitment)
- Credits come from projects: reforestation, renewable energy, cookstoves, etc.
- Prices: $5-50/tonne (huge variation in quality)
- Total market: ~$2 billion/year (small but growing fast)

**Price determines behavior:**
- At $10/tonne: only the cheapest reductions happen (LED lightbulbs, basic efficiency)
- At $50/tonne: renewable energy becomes cheaper than coal
- At $100/tonne: electric vehicles, building efficiency, industrial changes
- At $250+/tonne: direct air capture, green hydrogen, deep decarbonization

The "social cost of carbon" (the true cost of damages from 1 tonne of CO₂) is estimated at $50-200/tonne. Most markets price carbon well below this — a market failure.`,
      analogy: 'A carbon market is like a diet club with tradeable "calorie credits." Members who eat less than their allowance can sell surplus credits to members who overate. The total calories consumed by the group stays the same (the cap), but individuals have flexibility. The cap is tightened each year until the group reaches its target weight.',
      storyConnection: 'The Girl\'s forest generates carbon credits simply by existing and growing. Each year, as the trees absorb CO₂, the forest produces measurable, verifiable credits. A company in Europe might buy those credits to offset its factory emissions. Money flows from the polluter to the forest protector — the Girl\'s community. This is environmental justice through markets.',
      checkQuestion: 'If carbon is priced at $10/tonne and a steel company can reduce emissions by installing new equipment at a cost of $15/tonne, will it reduce emissions or buy credits?',
      checkAnswer: 'It will buy credits ($10/tonne is cheaper than $15/tonne to abate). This means the company keeps polluting. Only when the carbon price rises above $15/tonne will it become economically rational to invest in cleaner equipment. This is why environmentalists push for higher carbon prices — low prices don\'t change behavior enough.',
      codeIntro: 'Model carbon credit market dynamics and price impacts on behavior.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Carbon price vs. abatement behavior
# Different technologies become viable at different carbon prices
technologies = {
    'LED lighting': {'cost': 5, 'potential': 0.5},
    'Solar power': {'cost': 20, 'potential': 8.0},
    'Wind power': {'cost': 25, 'potential': 5.0},
    'Electric vehicles': {'cost': 50, 'potential': 4.0},
    'Building efficiency': {'cost': 60, 'potential': 3.0},
    'Green hydrogen': {'cost': 100, 'potential': 3.0},
    'Industrial CCS': {'cost': 120, 'potential': 4.0},
    'Direct air capture': {'cost': 250, 'potential': 2.0},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Marginal abatement cost curve
ax1.set_facecolor('#111827')
sorted_tech = sorted(technologies.items(), key=lambda x: x[1]['cost'])
cumulative_potential = 0
colors_tech = ['#22c55e', '#3b82f6', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899']

for i, (name, data) in enumerate(sorted_tech):
    ax1.barh(i, data['cost'], height=0.6, color=colors_tech[i], alpha=0.8)
    ax1.text(data['cost'] + 5, i, f'{data["cost"]}/t ({data["potential"]} Gt)',
            color='white', fontsize=8, va='center')

ax1.set_yticks(range(len(sorted_tech)))
ax1.set_yticklabels([t[0] for t in sorted_tech], color='white', fontsize=9)
ax1.set_xlabel('Cost per tonne CO₂ reduced ($)', color='white')
ax1.set_title('Abatement Cost by Technology', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Draw price lines
for price, label, color in [(10, 'Current avg ($10)', '#ef4444'),
                              (90, 'EU ETS ($90)', '#f59e0b'),
                              (200, 'Social cost ($200)', '#22c55e')]:
    ax1.axvline(price, color=color, linestyle='--', linewidth=1.5, alpha=0.7)
    ax1.text(price, len(sorted_tech)-0.5, label, color=color, fontsize=8, rotation=90, va='top')

# Market growth
ax2.set_facecolor('#111827')
market_years = [2017, 2018, 2019, 2020, 2021, 2022, 2023]
compliance_value = [46, 56, 45, 53, 84, 91, 95]  # $ per tonne (EU ETS)
voluntary_size = [0.3, 0.3, 0.4, 0.5, 1.0, 1.8, 2.0]  # billion USD

ax2_twin = ax2.twinx()
ax2.bar(market_years, voluntary_size, color='#22c55e', alpha=0.7, label='Voluntary market ($B)')
ax2_twin.plot(market_years, compliance_value, 'o-', color='#f59e0b', linewidth=2,
              markersize=6, label='EU ETS price ($/tonne)')

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Voluntary market size ($B)', color='#22c55e')
ax2_twin.set_ylabel('EU ETS price ($/tonne)', color='#f59e0b')
ax2.set_title('Carbon Market Growth', color='white', fontsize=12)
ax2.tick_params(colors='gray', axis='x')
ax2.tick_params(colors='#22c55e', axis='y')
ax2_twin.tick_params(colors='#f59e0b')

lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', labelcolor='white', fontsize=9)

plt.tight_layout()
plt.show()

# Calculate total abatement at different prices
print("Total abatement potential at different carbon prices:")
for price in [10, 50, 100, 200, 300]:
    total = sum(d['potential'] for _, d in technologies.items() if d['cost'] <= price)
    print(f"  {price}/tonne: {total:.1f} GtCO₂/year")
print(f"\\nWorld needs: ~20 GtCO₂/year reduction")
print(f"This requires carbon price > $100/tonne to unlock enough technology")`,
      challenge: 'If the Girl\'s forest generates 5,000 credits per year at $10/tonne, the community earns $50,000/year. But at $50/tonne (EU ETS level), they\'d earn $250,000. What carbon price makes community forestry more profitable than palm oil farming (which earns ~$1,000/hectare/year)? This is the critical threshold.',
      successHint: 'Carbon markets are an attempt to put a price on pollution and a value on forests. When the price is right, economic incentives align with environmental needs. When the price is too low, markets fail. Understanding market design is essential for anyone working on climate policy.',
    },
    {
      title: 'Modeling forest growth — predicting the future from data',
      concept: `Forest growth models use mathematics to predict how forests will develop over time. These models are essential for reforestation planning, timber management, and carbon projections.

**Types of forest growth models:**

**1. Empirical models**: fit curves to measured data
- Height-age curves (site index)
- Diameter-age relationships
- Volume equations

**2. Process-based models**: simulate the biology
- Photosynthesis, respiration, water use, nutrient cycling
- Respond to climate inputs (temperature, rainfall, CO₂)
- Can predict growth under future climate scenarios

**3. Gap models**: simulate individual trees
- Each tree grows, competes for light and water, and eventually dies
- New trees fill gaps created by dead trees
- Emergent forest structure arises from individual-level rules

**Key parameters:**
- **Site index**: a measure of site quality (better sites → taller trees at a given age)
- **Stand density**: trees per hectare (more trees → more competition → thinner trees)
- **Basal area**: total cross-sectional area of all tree trunks (measure of forest "fullness")
- **Leaf area index (LAI)**: total leaf area per unit ground area (drives photosynthesis capacity)

**Yield tables**: foresters use lookup tables that predict volume, height, and diameter at different ages for different species and site qualities. These are essentially pre-computed model outputs.`,
      analogy: 'A forest growth model is like a weather forecast for trees. Just as weather models use physics (pressure, temperature, humidity) to predict tomorrow\'s conditions, forest models use biology (photosynthesis, competition, mortality) to predict next decade\'s forest. Both improve with better data and more computing power.',
      storyConnection: 'If the Girl had a forest growth model, she could have predicted exactly when her trees would reach canopy closure, when the first timber harvest would be sustainable, and how much carbon her forest would store by 2050. The model would have validated her intuition with numbers.',
      checkQuestion: 'Why do forest growth models need to account for competition between trees? Why not just model each tree independently?',
      checkAnswer: 'Trees compete for light, water, and nutrients. A tree growing alone in a field behaves very differently from the same tree in a dense stand. In competition, trees grow taller (reaching for light) but thinner (less energy for diameter growth). Dense stands have more total biomass but smaller individual trees. Ignoring competition would overpredict individual tree size and underpredict stand-level carbon storage.',
      codeIntro: 'Build a simple forest growth model with individual trees competing for light.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simple gap model: simulate 100 trees competing for light
n_trees = 100
years = 50
max_height = 35  # meters (tropical hardwood)
max_dbh = 60  # cm (diameter at breast height)

# Each tree has: height, dbh, alive status, growth rate modifier
heights = np.random.uniform(0.5, 2.0, n_trees)  # initial seedling heights
dbh = np.random.uniform(1, 5, n_trees)  # initial diameters (cm)
alive = np.ones(n_trees, dtype=bool)
growth_rate = np.random.uniform(0.7, 1.3, n_trees)  # genetic variation

# Track statistics over time
yearly_data = {'mean_h': [], 'max_h': [], 'alive': [], 'basal_area': [], 'biomass': []}

for year in range(years):
    # Light competition: taller trees get more light
    light_fraction = heights / (np.max(heights) + 0.1)
    light_fraction = np.clip(light_fraction, 0.1, 1.0)

    # Growth: proportional to light received
    h_growth = growth_rate * light_fraction * (1 - heights / max_height) * 0.8
    d_growth = growth_rate * light_fraction * (1 - dbh / max_dbh) * 1.5

    heights[alive] += h_growth[alive]
    dbh[alive] += d_growth[alive]

    # Mortality: smaller trees in dense shade die
    mortality_prob = 0.02 + 0.05 * (1 - light_fraction)
    deaths = np.random.random(n_trees) < mortality_prob
    alive[deaths] = False

    # Record stats
    if np.any(alive):
        yearly_data['mean_h'].append(np.mean(heights[alive]))
        yearly_data['max_h'].append(np.max(heights[alive]))
        yearly_data['alive'].append(np.sum(alive))
        ba = np.sum(np.pi * (dbh[alive]/200)**2)  # m²
        yearly_data['basal_area'].append(ba)
        # Biomass approximation: proportional to dbh^2 * height
        biomass = np.sum(0.05 * dbh[alive]**2 * heights[alive])  # kg
        yearly_data['biomass'].append(biomass / 1000)  # tonnes

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Forest Growth Simulation: {n_trees} Trees, {years} Years', color='white', fontsize=14)

# Height over time
ax1 = axes[0][0]
ax1.set_facecolor('#111827')
ax1.plot(yearly_data['mean_h'], color='#22c55e', linewidth=2, label='Mean height')
ax1.plot(yearly_data['max_h'], color='#f59e0b', linewidth=2, label='Max height')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Tree Height', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Survival
ax2 = axes[0][1]
ax2.set_facecolor('#111827')
ax2.plot(yearly_data['alive'], color='#3b82f6', linewidth=2)
ax2.set_ylabel('Trees alive', color='white')
ax2.set_title(f'Survival (started: {n_trees})', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Basal area
ax3 = axes[1][0]
ax3.set_facecolor('#111827')
ax3.plot(yearly_data['basal_area'], color='#a855f7', linewidth=2)
ax3.set_xlabel('Year', color='white')
ax3.set_ylabel('Basal area (m²)', color='white')
ax3.set_title('Stand Basal Area', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# Biomass (carbon proxy)
ax4 = axes[1][1]
ax4.set_facecolor('#111827')
ax4.fill_between(range(len(yearly_data['biomass'])), yearly_data['biomass'], alpha=0.2, color='#22c55e')
ax4.plot(yearly_data['biomass'], color='#22c55e', linewidth=2)
ax4.set_xlabel('Year', color='white')
ax4.set_ylabel('Biomass (tonnes)', color='white')
ax4.set_title('Total Stand Biomass (~50% is carbon)', color='white', fontsize=11)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

final = yearly_data
print(f"Simulation results after {years} years:")
print(f"  Trees surviving: {final['alive'][-1]} of {n_trees} ({final['alive'][-1]/n_trees*100:.0f}%)")
print(f"  Mean height: {final['mean_h'][-1]:.1f} m")
print(f"  Max height: {final['max_h'][-1]:.1f} m")
print(f"  Total biomass: {final['biomass'][-1]:.1f} tonnes")
print(f"  Estimated carbon: {final['biomass'][-1]*0.5:.1f} tonnes")
print(f"\\nCompetition killed {n_trees - final['alive'][-1]} trees (natural thinning)")
print("Survivors are taller and have more resources per tree.")`,
      challenge: 'Add a "thinning" intervention at Year 20: remove the 30 smallest trees. Does this increase or decrease total biomass at Year 50? Foresters call this "release" — freeing resources for the remaining trees to grow faster.',
      successHint: 'Forest growth models are where biology meets computation. From carbon accounting to net-zero calculations to REDD+ crediting to carbon markets to growth modeling — you now have the full toolkit for understanding forests as both ecosystems and climate assets. The Girl Who Grew a Forest started with a single sapling. You started with a single lesson. Both grew into something much larger.',
    },
    {
      title: 'Remote sensing for deforestation detection — algorithms that watch forests',
      concept: `Modern deforestation detection uses satellite imagery combined with machine learning algorithms to identify forest loss in near-real-time. Systems like **Global Forest Watch** and **DETER** (Brazil) can detect new deforestation within days.

**Detection pipeline:**

1. **Image acquisition**: satellites capture images every 5-16 days
   - Landsat (30m, every 16 days)
   - Sentinel-2 (10m, every 5 days)
   - Planet (3m, daily)

2. **Cloud masking**: remove cloud-covered pixels (critical in tropics)

3. **Change detection algorithms**:
   - **NDVI differencing**: compare current NDVI to baseline; flag drops > threshold
   - **BFAST** (Breaks For Additive Season and Trend): detects breaks in the seasonal NDVI pattern
   - **Time series analysis**: build a model of "normal" seasonal variation; flag anomalies
   - **Machine learning**: train classifiers on labeled deforestation examples

4. **Alert generation**: pixels flagged as probable deforestation → sent to authorities

5. **Verification**: ground teams or high-resolution imagery confirm or reject alerts

**Accuracy challenges:**
- False positives: seasonal deciduous leaf drop looks like deforestation
- False negatives: gradual degradation (selective logging) is harder to detect than clear-cutting
- Cloud cover: in monsoon regions like NE India, optical satellites may see the ground only 30% of days
- SAR (Synthetic Aperture Radar): penetrates clouds but has lower spatial detail

**Impact:** Brazil's DETER system, combined with enforcement, helped reduce Amazon deforestation by 80% between 2004 and 2012. When political enforcement weakened, deforestation surged again — proving that technology alone isn't enough.`,
      analogy: 'Deforestation detection algorithms are like security cameras for forests. The satellites take the pictures, the algorithms are the software that flags suspicious activity, and the enforcement teams are the security guards who respond to alerts. The whole system fails if any link in the chain breaks — especially enforcement.',
      storyConnection: 'The Girl\'s forest would appear as a growing green patch in satellite imagery. But more importantly, algorithms watching the surrounding area could detect threats before they reach her forest — illegal logging creeping closer, fire outbreaks nearby. Remote sensing gives the Girl eyes in the sky, seeing what no single person on the ground could see.',
      checkQuestion: 'A satellite image shows a sharp NDVI drop from 0.8 to 0.2 in a tropical forest area. Is this definitely deforestation?',
      checkAnswer: 'Not necessarily. Possible causes include: (1) Deforestation (most likely for such a large drop). (2) Severe drought causing leaf drop. (3) Wildfire. (4) Flooding (water has negative NDVI). (5) Sensor error or cloud shadow misclassification. This is why detection algorithms use time series (is the drop persistent?) and spatial context (is it adjacent to roads or existing clearings?) to reduce false positives.',
      codeIntro: 'Implement a simple NDVI time series anomaly detection algorithm for deforestation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 3 years of NDVI time series for a forest pixel
# Data every 16 days (Landsat revisit)
n_observations = 3 * 23  # ~23 obs per year

time_days = np.arange(0, n_observations * 16, 16)
time_years = time_days / 365.25

# Normal forest NDVI: seasonal variation around 0.75
seasonal = 0.08 * np.sin(2 * np.pi * time_years)  # seasonal cycle
noise = np.random.normal(0, 0.03, n_observations)  # sensor noise
base_ndvi = 0.75 + seasonal + noise

# Inject deforestation event at month 20 (observation ~38)
deforest_obs = 38
ndvi_with_deforest = base_ndvi.copy()
ndvi_with_deforest[deforest_obs:] = 0.15 + np.random.normal(0, 0.03, n_observations - deforest_obs)

# Inject cloud gaps (missing data)
cloud_mask = np.random.random(n_observations) > 0.3  # 70% clear in tropics is optimistic
ndvi_observed = ndvi_with_deforest.copy()
ndvi_observed[~cloud_mask] = np.nan

# Simple detection: rolling mean anomaly
window = 5  # 5-observation rolling mean
rolling_mean = np.full(n_observations, np.nan)
for i in range(window, n_observations):
    valid = ndvi_observed[i-window:i]
    valid = valid[~np.isnan(valid)]
    if len(valid) >= 2:
        rolling_mean[i] = np.nanmean(valid)

# Detect: where rolling mean drops below threshold
threshold = 0.5
alerts = (rolling_mean < threshold) & ~np.isnan(rolling_mean)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Full NDVI time series
ax1.set_facecolor('#111827')
ax1.plot(time_years, base_ndvi, color='#22c55e', linewidth=1, alpha=0.4, label='True NDVI (no deforestation)')
ax1.plot(time_years, ndvi_with_deforest, color='#3b82f6', linewidth=1, alpha=0.4, label='True NDVI (with deforestation)')

# Observed (with cloud gaps)
valid_mask = ~np.isnan(ndvi_observed)
ax1.scatter(time_years[valid_mask], ndvi_observed[valid_mask], s=15, color='white', zorder=5, label='Satellite observations')
ax1.scatter(time_years[~valid_mask], np.full(np.sum(~valid_mask), 0.05), s=5, color='#6b7280', alpha=0.3, label='Cloud-blocked')

deforest_time = time_years[deforest_obs]
ax1.axvline(deforest_time, color='#ef4444', linestyle='--', linewidth=1.5, label=f'Deforestation event (year {deforest_time:.1f})')

ax1.set_ylabel('NDVI', color='white')
ax1.set_title('NDVI Time Series: Forest Pixel with Deforestation Event', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8, loc='lower left')
ax1.tick_params(colors='gray')
ax1.set_ylim(-0.1, 1.0)

# Detection algorithm output
ax2.set_facecolor('#111827')
ax2.plot(time_years, rolling_mean, color='#f59e0b', linewidth=2, label='Rolling mean NDVI')
ax2.axhline(threshold, color='#ef4444', linestyle='--', linewidth=1, label=f'Alert threshold ({threshold})')

# Mark alerts
alert_times = time_years[alerts]
alert_vals = rolling_mean[alerts]
if len(alert_times) > 0:
    ax2.scatter(alert_times, alert_vals, s=50, color='#ef4444', zorder=5, label='ALERTS')
    first_alert = alert_times[0]
    delay = first_alert - deforest_time
    ax2.annotate(f'First alert: year {first_alert:.2f}\\nDelay: {delay*365:.0f} days',
                xy=(first_alert, alert_vals[0]), xytext=(first_alert+0.3, 0.35),
                color='#ef4444', fontsize=10, arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax2.axvline(deforest_time, color='#ef4444', linestyle='--', linewidth=1, alpha=0.5)
ax2.set_xlabel('Time (years)', color='white')
ax2.set_ylabel('Rolling mean NDVI', color='white')
ax2.set_title('Deforestation Detection Algorithm', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

if len(alert_times) > 0:
    delay_days = (alert_times[0] - deforest_time) * 365
    print(f"Detection results:")
    print(f"  Deforestation event: year {deforest_time:.2f}")
    print(f"  First alert: year {alert_times[0]:.2f}")
    print(f"  Detection delay: {delay_days:.0f} days")
    print(f"  Total alerts: {len(alert_times)}")
else:
    print("No deforestation detected (algorithm may need tuning)")
print(f"\\nCloud cover caused {np.sum(~cloud_mask)} of {n_observations} observations to be lost")
print(f"Effective coverage: {np.sum(cloud_mask)/n_observations*100:.0f}%")`,
      challenge: 'Lower the threshold from 0.5 to 0.6 to detect deforestation faster. What happens to the detection delay? But also count how many false alerts occur before the actual deforestation event. This is the precision-recall trade-off — a fundamental concept in all detection systems.',
      successHint: 'From carbon accounting to net-zero pathways to REDD+ crediting to carbon markets to growth modeling to satellite detection — you now command the full toolkit of climate forestry. The Girl Who Grew a Forest worked by hand and by heart. You work with data and algorithms. Together, both approaches are needed to protect the world\'s forests.',
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
