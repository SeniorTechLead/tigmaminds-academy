import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function PitcherPlantLevel2() {
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
      title: 'Enzyme kinetics — how fast reactions really go',
      concept: `In Level 1, we saw that pitcher plants digest prey with enzymes. Now let's understand how fast these enzymes work using **Michaelis-Menten kinetics** — the foundational model of enzyme behaviour.

**Michaelis-Menten equation:** v = Vmax * [S] / (Km + [S])

Where:
- **v** = reaction rate (how fast product is formed)
- **Vmax** = maximum rate (when all enzyme molecules are busy)
- **[S]** = substrate concentration (how much "food" the enzyme has)
- **Km** = Michaelis constant (the [S] at which v = Vmax/2)

What Km tells you:
- **Low Km**: enzyme binds substrate tightly → efficient even at low concentrations
- **High Km**: enzyme binds weakly → needs lots of substrate to work fast

Nepenthesin (the pitcher plant protease) has Km ≈ 0.15 mM for typical protein substrates — relatively low, meaning it works efficiently even when prey concentrations are low. This makes sense: the plant can't control how much prey falls in.`,
      analogy: 'An enzyme is like a cashier at a store. Vmax is how fast they can scan items when there\'s a line (maximum throughput). Km is the customer arrival rate at which the cashier is 50% busy. A cashier with low Km gets busy easily (efficient); one with high Km needs a huge crowd before they\'re fully occupied.',
      storyConnection: 'The pitcher plant\'s digestive efficiency — dissolving a whole ant in days — comes from enzymes with precisely tuned kinetics. Nepenthesin\'s low Km means it starts working effectively the moment prey falls in, not waiting for a full pitcher.',
      checkQuestion: 'If you doubled the amount of nepenthesin in the pitcher fluid, would prey digest twice as fast?',
      checkAnswer: 'Only if substrate (prey) concentration is high enough to keep all enzyme molecules busy. Doubling enzyme doubles Vmax, but if there\'s only one ant in the pitcher, the original amount of enzyme may already be sufficient. You\'d see a difference with large prey (lots of substrate) but not with small prey.',
      codeIntro: 'Model Michaelis-Menten kinetics and explore how Km and Vmax affect digestion.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Michaelis-Menten: v = Vmax * [S] / (Km + [S])
substrate = np.linspace(0, 2, 200)  # mM

# Different enzyme scenarios
enzymes = {
    'Nepenthesin (Km=0.15)': {'Vmax': 1.0, 'Km': 0.15, 'color': '#22c55e'},
    'Pepsin (Km=0.30)': {'Vmax': 1.2, 'Km': 0.30, 'color': '#ef4444'},
    'Slow protease (Km=0.80)': {'Vmax': 0.8, 'Km': 0.80, 'color': '#3b82f6'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Michaelis-Menten curves
ax1.set_facecolor('#111827')
for name, params in enzymes.items():
    v = params['Vmax'] * substrate / (params['Km'] + substrate)
    ax1.plot(substrate, v, linewidth=2, label=name, color=params['color'])
    # Mark Km point
    v_half = params['Vmax'] / 2
    ax1.plot(params['Km'], v_half, 'o', color=params['color'], markersize=6)
    ax1.plot([params['Km'], params['Km']], [0, v_half], ':', color=params['color'], linewidth=0.5)
    ax1.plot([0, params['Km']], [v_half, v_half], ':', color=params['color'], linewidth=0.5)

ax1.set_xlabel('[Substrate] (mM)', color='white')
ax1.set_ylabel('Reaction rate (v)', color='white')
ax1.set_title('Michaelis-Menten Kinetics', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Lineweaver-Burk (double reciprocal) plot
ax2.set_facecolor('#111827')
substrate_nz = substrate[substrate > 0.05]  # avoid division by zero
for name, params in enzymes.items():
    v = params['Vmax'] * substrate_nz / (params['Km'] + substrate_nz)
    ax2.plot(1/substrate_nz, 1/v, linewidth=2, label=name, color=params['color'])

ax2.set_xlabel('1/[S] (1/mM)', color='white')
ax2.set_ylabel('1/v', color='white')
ax2.set_title('Lineweaver-Burk Plot (linearized)', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_xlim(-5, 20)
ax2.set_ylim(0, 10)

plt.tight_layout()
plt.show()

print("Michaelis-Menten parameters:")
for name, params in enzymes.items():
    eff = params['Vmax'] / params['Km']
    print(f"  {name}:")
    print(f"    Vmax = {params['Vmax']}, Km = {params['Km']} mM")
    print(f"    Catalytic efficiency (Vmax/Km) = {eff:.2f}")
print()
print("Higher Vmax/Km = more efficient enzyme")
print("Nepenthesin's low Km makes it ideal for unpredictable prey input.")`,
      challenge: 'Add a competitive inhibitor to the nepenthesin model. A competitive inhibitor increases the apparent Km without changing Vmax. If an insect produces a protease inhibitor (some do!), how would you model it?',
      successHint: 'Michaelis-Menten kinetics is the language of biochemistry. Every drug design, every metabolic model, every fermentation process uses these equations. Master them, and you can understand any enzyme.',
    },
    {
      title: 'pH and digestion — why acidity matters',
      concept: `Pitcher plant fluid is acidic (pH 2-3), and this isn't arbitrary. pH profoundly affects enzyme function through its effect on **protein structure**.

Enzymes are proteins — long chains of amino acids folded into precise 3D shapes. The active site (where substrate binds) depends on this shape. pH affects structure because:

1. **Ionization of amino acids**: at different pH values, amino acid side chains gain or lose protons (H⁺). This changes their charge.
2. **Charge changes alter folding**: electrostatic interactions hold the protein shape together. Change the charges → change the shape → change the function.
3. **Optimal pH**: every enzyme has a pH where its shape is exactly right for maximum activity. Deviate too far → denaturation (permanent shape loss).

**Why pH 2-3 for pitcher plants:**
- Nepenthesin is an **aspartic protease** (like pepsin), with two aspartate residues in its active site. These need to be partially protonated (one protonated, one not) — which happens at pH 2-3.
- Low pH denatures prey proteins, exposing peptide bonds for cleavage.
- Low pH kills most bacteria, reducing microbial competition for nutrients.`,
      analogy: 'pH and enzymes are like temperature and chocolate. Too cold, it\'s hard and won\'t melt (enzyme inactive). At the right temperature, it melts perfectly (optimal pH). Too hot, it burns and is ruined permanently (denatured). Each type of chocolate (enzyme) has its own ideal temperature (pH).',
      storyConnection: 'The pitcher plant\'s acidic "stomach" is a precisely controlled chemical environment. Just as we saw in Level 1 that the anatomy was engineered by evolution, the chemistry is equally refined — millions of years of natural selection optimized the pH for maximum digestion efficiency.',
      checkQuestion: 'If rain dilutes the pitcher fluid and raises pH from 2.5 to 5, what happens to digestion? Is it temporary or permanent damage?',
      checkAnswer: 'Temporary. Enzyme activity drops dramatically (nepenthesin at pH 5 has less than 10% of its optimal activity), so digestion nearly stops. But the protein isn\'t denatured — nepenthesin is stable across a wide pH range. Once the plant secretes more acid and the pH drops back to 2-3, full activity resumes. The lid exists specifically to prevent this dilution.',
      codeIntro: 'Model the relationship between pH, enzyme activity, and protein denaturation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

pH = np.linspace(0, 14, 500)

# Enzyme activity profiles (bell curves at different optima)
def activity(pH_range, optimum, width, stability_range):
    """Activity with denaturation at extreme pH."""
    active = np.exp(-0.5 * ((pH_range - optimum) / width) ** 2)
    # Denaturation: activity drops to 0 permanently at extreme pH
    denatured = np.where(np.abs(pH_range - optimum) > stability_range,
                         np.exp(-((np.abs(pH_range - optimum) - stability_range) / 1.5) ** 2),
                         1.0)
    return active * denatured

nepenthesin = activity(pH, 2.5, 0.8, 4)
pepsin = activity(pH, 2.0, 0.7, 3.5)
trypsin = activity(pH, 8.0, 1.0, 4)
amylase = activity(pH, 7.0, 0.8, 3)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Activity curves
ax1.set_facecolor('#111827')
curves = [
    ('Nepenthesin\\n(pitcher plant)', nepenthesin, '#22c55e'),
    ('Pepsin\\n(human stomach)', pepsin, '#ef4444'),
    ('Trypsin\\n(human intestine)', trypsin, '#3b82f6'),
    ('Amylase\\n(human saliva)', amylase, '#f59e0b'),
]
for name, curve, color in curves:
    ax1.plot(pH, curve, linewidth=2, label=name, color=color)

# pH zones
zones = [(0, 3, 'Acidic', '#ef4444'), (3, 6, 'Mildly acidic', '#f59e0b'),
         (6, 8, 'Neutral', '#22c55e'), (8, 14, 'Basic/alkaline', '#3b82f6')]
for lo, hi, name, color in zones:
    ax1.axvspan(lo, hi, alpha=0.05, color=color)

ax1.set_xlabel('pH', color='white')
ax1.set_ylabel('Relative activity', color='white')
ax1.set_title('Enzyme Activity vs pH', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper right')
ax1.tick_params(colors='gray')

# Simulate digestion rate at different pH values
ax2.set_facecolor('#111827')
pH_test = [1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 7.0]
nep_activity = [float(activity(np.array([p]), 2.5, 0.8, 4)) for p in pH_test]

# Time to digest 90% of protein at each pH
# time ~ 1 / activity (proportional)
digest_times = [7 / max(a, 0.01) for a in nep_activity]  # days (7 days at optimal)

bars = ax2.bar(range(len(pH_test)), digest_times,
               color=['#22c55e' if a > 0.7 else '#f59e0b' if a > 0.3 else '#ef4444'
                      for a in nep_activity])
ax2.set_xticks(range(len(pH_test)))
ax2.set_xticklabels([f'pH {p}' for p in pH_test], color='white', fontsize=8)
ax2.set_ylabel('Days to digest prey', color='white')
ax2.set_title('Digestion Time vs Pitcher Fluid pH', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, min(max(digest_times), 100))

for bar, days in zip(bars, digest_times):
    if days < 80:
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
                 f'{days:.0f}d', ha='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Digestion time at different pH values:")
for p, a, t in zip(pH_test, nep_activity, digest_times):
    status = "optimal" if a > 0.7 else "suboptimal" if a > 0.3 else "nearly inactive"
    print(f"  pH {p}: activity {a:.1%}, digest time {t:.0f} days ({status})")
print()
print("pH 2-3: prey digested in ~7-10 days")
print("pH 5+: digestion essentially stops")
print("This is why the lid exists — to prevent rain dilution.")`,
      challenge: 'Some pitcher plants host a community of bacteria that help with digestion. These bacteria prefer pH 4-5. Model a "dual digestion" system: nepenthesin at pH 2.5 + bacterial enzymes at pH 4.5. What total pH is optimal?',
      successHint: 'pH is one of the most important variables in all of chemistry and biology. Controlling pH is controlling the speed of life itself — from pitcher plants to your blood to industrial fermentation.',
    },
    {
      title: 'Prey capture efficiency — the economics of carnivory',
      concept: `Is carnivory worth it? This isn't a philosophical question — it's an **energy budget** question. We can calculate whether the nutrients gained from prey exceed the cost of building and maintaining traps.

**Costs of carnivory:**
- Construction: building the pitcher (modified leaf) uses carbon and energy
- Maintenance: secreting enzymes and acid continuously
- Opportunity cost: a pitcher doesn't photosynthesize as well as a flat leaf (reduced surface area)

**Benefits:**
- Nitrogen from prey (8-12mg per ant)
- Phosphorus from prey (1-2mg per ant)
- These nutrients enable faster photosynthesis (nitrogen is needed for chlorophyll and RuBisCO)

The **break-even point**: a pitcher must catch enough prey to compensate for its construction cost. Research shows this is typically 1-3 insects per pitcher per week. Below this, the plant would be better off with a normal leaf.

This is why carnivorous plants only thrive in nutrient-poor, sunny habitats. In rich soil, normal roots are cheaper. In shade, there's not enough energy to fund traps.`,
      analogy: 'A pitcher plant\'s trap is like a fishing boat. The boat (trap) costs money to build and maintain. You only profit if you catch enough fish (insects) to cover costs. In a river full of fish (nutrient-rich soil), you don\'t need a boat — just wade in (use roots). You only invest in a boat when wading doesn\'t work.',
      storyConnection: 'The pitcher plant "learned to catch" because the economics of carnivory made sense in Meghalaya\'s leached soils. In a garden, a pitcher plant would waste energy on traps it doesn\'t need. Evolution is an economist — it invests where returns exceed costs.',
      checkQuestion: 'Some pitcher plants have lost their carnivory and evolved into "toilet pitchers" — they collect nutrients from animal droppings instead of catching prey. Why might this be more efficient?',
      checkAnswer: 'Animal droppings are pre-digested and nutrient-dense — no need for expensive digestive enzymes. The "toilet pitcher" (*Nepenthes lowii*) attracts tree shrews with nectar on its lid, and the shrew defecates into the pitcher while feeding. The cost is just nectar production (cheap) vs. enzyme production (expensive). Same nutrients, lower cost.',
      codeIntro: 'Build a cost-benefit model of carnivory.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cost-benefit analysis of a single pitcher
# Costs (in carbon equivalents, mg C per month)
construction_cost = 50  # one-time, amortized over 3-month lifespan -> 17/month
maintenance_cost = 15   # enzyme + acid secretion per month
opportunity_cost = 10   # lost photosynthesis from using leaf as pitcher
total_cost_per_month = construction_cost/3 + maintenance_cost + opportunity_cost

# Benefits from prey (mg C equivalent per insect captured)
# N from insect -> enables additional photosynthesis -> C gain
n_per_insect = 8  # mg N
c_per_mg_n = 3    # mg C gained per mg N (through enhanced photosynthesis)
benefit_per_insect = n_per_insect * c_per_mg_n  # mg C

prey_per_month = np.arange(0, 30)
total_benefit = prey_per_month * benefit_per_insect
total_cost = np.full_like(prey_per_month, total_cost_per_month, dtype=float)
net_profit = total_benefit - total_cost

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Cost-benefit chart
ax1.set_facecolor('#111827')
ax1.plot(prey_per_month, total_benefit, color='#22c55e', linewidth=2, label='Benefit (from prey)')
ax1.axhline(total_cost_per_month, color='#ef4444', linewidth=2, linestyle='--', label='Cost (trap maintenance)')
ax1.fill_between(prey_per_month, total_benefit, total_cost_per_month,
                 where=total_benefit > total_cost_per_month, alpha=0.2, color='#22c55e', label='Profit')
ax1.fill_between(prey_per_month, total_benefit, total_cost_per_month,
                 where=total_benefit < total_cost_per_month, alpha=0.2, color='#ef4444', label='Loss')

# Break-even point
breakeven = total_cost_per_month / benefit_per_insect
ax1.axvline(breakeven, color='#f59e0b', linestyle=':', linewidth=1.5)
ax1.annotate(f'Break-even:\\n{breakeven:.1f} insects/month', xy=(breakeven, total_cost_per_month),
             xytext=(breakeven+3, total_cost_per_month+50), color='#f59e0b', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax1.set_xlabel('Insects captured per month', color='white')
ax1.set_ylabel('Carbon equivalents (mg C)', color='white')
ax1.set_title('Economics of Carnivory: Is It Worth It?', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Sensitivity analysis: how does soil nutrient level affect break-even?
ax2.set_facecolor('#111827')
soil_n = np.linspace(1, 50, 100)  # mg N/kg soil
# At higher soil N, the marginal benefit of insect N decreases
c_per_mg_n_variable = 3 * np.exp(-0.05 * soil_n)  # diminishing returns
benefit_variable = n_per_insect * c_per_mg_n_variable
breakeven_variable = total_cost_per_month / benefit_variable

ax2.plot(soil_n, breakeven_variable, color='#a855f7', linewidth=2)
ax2.fill_between(soil_n, breakeven_variable, 100, alpha=0.1, color='#ef4444')
ax2.fill_between(soil_n, 0, breakeven_variable, alpha=0.1, color='#22c55e')

ax2.axhline(10, color='gray', linestyle=':', linewidth=0.5)
ax2.text(40, 12, 'Typical capture rate (~10/month)', color='gray', fontsize=8)

ax2.axvspan(5, 15, alpha=0.1, color='#22c55e')
ax2.text(10, 80, 'Carnivory\\nviable', ha='center', color='#22c55e', fontsize=9)
ax2.axvspan(30, 50, alpha=0.1, color='#ef4444')
ax2.text(40, 80, 'Roots\\ncheaper', ha='center', color='#ef4444', fontsize=9)

ax2.set_xlabel('Soil nitrogen (mg/kg)', color='white')
ax2.set_ylabel('Insects needed to break even (per month)', color='white')
ax2.set_title('When Does Carnivory Stop Being Worth It?', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 100)

plt.tight_layout()
plt.show()

print(f"Monthly cost of one pitcher: {total_cost_per_month:.0f} mg C")
print(f"Benefit per insect: {benefit_per_insect:.0f} mg C")
print(f"Break-even: {breakeven:.1f} insects per month")
print()
print("At typical capture rates (5-15/month), carnivory is profitable")
print("only when soil N < ~15 mg/kg.")
print("Above 20 mg/kg, normal roots are more cost-effective.")
print("This is why you never see pitcher plants in rich garden soil.")`,
      challenge: 'What if the pitcher plant could increase its capture rate by making the rim more slippery (spending more energy on wax production)? Model the trade-off: +5 mg C cost per month = +3 more insects caught. Is it worth it?',
      successHint: 'Every biological trait has a cost and a benefit. Thinking in terms of energy budgets — costs, benefits, break-even points — is how ecologists understand why organisms do what they do.',
    },
    {
      title: 'Modeling nutrient budgets — inputs, outputs, and steady states',
      concept: `A nutrient budget tracks all inputs and outputs of a nutrient for an organism. For a pitcher plant:

**Nitrogen inputs:**
- From soil (roots): 10-20% of total N
- From insects (pitchers): 50-80% of total N
- From rain (atmospheric deposition): 5-10%
- From symbionts (bacteria in pitcher fluid): variable

**Nitrogen outputs:**
- Lost in dead leaves/pitchers
- Lost through leaching when pitcher overflows
- Used for growth (new tissue)
- Stored for future use

At **steady state**: total input = total output. The plant is neither gaining nor losing nitrogen over time.

If input > output → plant grows (accumulating N)
If input < output → plant shrinks or dies

This is the same framework used in ecosystem ecology, personal finance, and chemical engineering. It's a **mass balance**: what goes in must either stay or come out.`,
      analogy: 'A nutrient budget is like a bank account. Income (prey, soil, rain) comes in; expenses (growth, loss) go out. If income > expenses, savings grow. If expenses > income, you go into deficit. Steady state is when your balance stays the same month to month.',
      storyConnection: 'The pitcher plant\'s survival in Meghalaya\'s leached soils is a triumph of budget management. It diversified its income (prey + soil + rain + bacteria) and minimized its expenses (slow growth, tough tissues). Like a frugal household in an economically depressed area.',
      checkQuestion: 'If climate change reduces insect populations by 50%, what happens to the pitcher plant\'s nitrogen budget?',
      checkAnswer: 'Insect N input drops by 50%, which is 25-40% of total N input. The plant can\'t immediately reduce N output (it still needs to maintain tissues). Short-term: N deficit → slowed growth → fewer/smaller pitchers. Long-term: population decline unless the plant can compensate (larger pitchers, better capture, more reliance on other N sources). This is a real concern in a warming world.',
      codeIntro: 'Build a dynamic nutrient budget model for a pitcher plant.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Dynamic nutrient budget model
# Track nitrogen pool over time (months)
months = 120  # 10 years
dt = 1  # month

# Parameters (mg N per month)
n_from_soil = 5
n_from_rain = 3
n_from_insects_base = 30  # per month
n_for_growth = 20  # used for new tissue
n_lost_dead = 10  # lost in dead pitchers/leaves
n_lost_leach = 3  # leached

# Scenarios
scenarios = {
    'Normal': {'insect_factor': 1.0, 'color': '#22c55e'},
    'Insect decline (-50%)': {'insect_factor': 0.5, 'color': '#f59e0b'},
    'Severe decline (-80%)': {'insect_factor': 0.2, 'color': '#ef4444'},
    'Enhanced (more pitchers)': {'insect_factor': 1.5, 'color': '#3b82f6'},
}

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8))
fig.patch.set_facecolor('#1f2937')

# Top: N pool over time
ax1.set_facecolor('#111827')
for name, params in scenarios.items():
    n_pool = np.zeros(months)
    n_pool[0] = 200  # starting N pool (mg)

    for t in range(1, months):
        insect_n = n_from_insects_base * params['insect_factor']
        total_input = n_from_soil + n_from_rain + insect_n

        # Growth demand scales with pool size (bigger plant needs more)
        growth_demand = n_for_growth * (n_pool[t-1] / 200)
        total_output = growth_demand + n_lost_dead + n_lost_leach

        n_pool[t] = max(n_pool[t-1] + total_input - total_output, 0)

    ax1.plot(range(months), n_pool, linewidth=2, label=name, color=params['color'])

ax1.set_xlabel('Months', color='white')
ax1.set_ylabel('Nitrogen pool (mg)', color='white')
ax1.set_title('Pitcher Plant Nitrogen Budget Over Time', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Bottom: steady-state analysis
ax2.set_facecolor('#111827')
insect_capture_rates = np.linspace(0, 60, 100)
steady_states = []
for rate in insect_capture_rates:
    # At steady state: input = output
    # n_from_soil + n_from_rain + rate = n_for_growth * (N_ss/200) + n_lost_dead + n_lost_leach
    # Solve for N_ss:
    total_in = n_from_soil + n_from_rain + rate
    # n_for_growth * (N_ss/200) + n_lost_dead + n_lost_leach = total_in
    # N_ss = (total_in - n_lost_dead - n_lost_leach) * 200 / n_for_growth
    n_ss = (total_in - n_lost_dead - n_lost_leach) * 200 / n_for_growth
    steady_states.append(max(n_ss, 0))

ax2.plot(insect_capture_rates, steady_states, color='#a855f7', linewidth=2)
ax2.fill_between(insect_capture_rates, steady_states, alpha=0.15, color='#a855f7')
ax2.axhline(200, color='gray', linestyle=':', linewidth=0.5)
ax2.text(50, 210, 'Healthy plant baseline', color='gray', fontsize=8)

# Mark minimum viable
min_viable = 50  # minimum N pool for survival
viable_rate = insect_capture_rates[np.argmin(np.abs(np.array(steady_states) - min_viable))]
ax2.axhline(min_viable, color='#ef4444', linestyle='--', linewidth=1)
ax2.axvline(viable_rate, color='#ef4444', linestyle='--', linewidth=1)
ax2.annotate(f'Minimum viable\\n({viable_rate:.0f} insects/month)', xy=(viable_rate, min_viable),
             xytext=(viable_rate+10, min_viable+50), color='#ef4444', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax2.set_xlabel('Insect capture rate (mg N/month)', color='white')
ax2.set_ylabel('Steady-state N pool (mg)', color='white')
ax2.set_title('Steady-State Analysis: How Many Insects Are Enough?', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Steady-state analysis:")
for name, params in scenarios.items():
    rate = n_from_insects_base * params['insect_factor']
    total_in = n_from_soil + n_from_rain + rate
    n_ss = max((total_in - n_lost_dead - n_lost_leach) * 200 / n_for_growth, 0)
    print(f"  {name}: insect N = {rate:.0f} mg/month -> steady N pool = {n_ss:.0f} mg")
print()
print(f"Minimum viable capture: ~{viable_rate:.0f} mg N/month from insects")`,
      challenge: 'Add seasonal variation: insect capture is 2x higher in monsoon (June-September) and 0.5x in winter (December-February). How does the N pool oscillate? Does the plant survive the winter dip?',
      successHint: 'Mass balance models are used everywhere: nutrient budgets in ecology, cash flow in business, energy balance in climate science. The math is the same — only the units change.',
    },
    {
      title: 'Evolutionary pathways to carnivory — how did it evolve?',
      concept: `Carnivory evolved independently at least **6 times** in plants. This means six different plant lineages independently "invented" the ability to trap and digest animals. How?

The evolutionary pathway (reconstructed from molecular phylogenetics):
1. **Sticky glands** → many plants have glandular hairs that produce sticky mucilage (a defense against herbivores). Some insects get stuck.
2. **Accidental nutrient uptake** → stuck insects decompose. Nutrients are passively absorbed through the leaf surface. The plant benefits without any investment.
3. **Enhanced stickiness** → plants that make stickier, more numerous glands catch more insects → natural selection favours them.
4. **Digestive enzyme evolution** → existing defense enzymes (chitinases, proteases that fight fungal infection) are repurposed for digesting prey.
5. **Structural traps** → leaves roll, curve, or form tubes to retain prey → pitchers, snap traps, suction traps.

Key evidence:
- Many "protocarnivorous" plants exist today (sticky but without digestive enzymes)
- Carnivorous plant enzymes are homologous to pathogen-defense enzymes
- The genetic toolkit for carnivory is largely repurposed from existing genes`,
      analogy: 'The evolution of carnivory is like the evolution of restaurants from street vendors. Stage 1: someone accidentally sells good food from their doorstep. Stage 2: they put up a sign (sticky glands). Stage 3: they add tables (leaf modifications). Stage 4: they hire a chef (digestive enzymes). Stage 5: they build a restaurant (pitcher). Each step was a small improvement that increased profits.',
      storyConnection: 'The story says the pitcher plant "learned to catch" — and evolution works similarly to learning, just on a geological timescale. Each generation of pitcher plants was slightly better at catching than the last, not through individual learning but through differential survival and reproduction.',
      checkQuestion: 'If carnivory evolved independently 6 times, is it an "easy" or "hard" adaptation to evolve?',
      checkAnswer: 'Easier than you\'d think. The building blocks — sticky glands, defense enzymes, leaf curvature — already exist in non-carnivorous plants. Carnivory doesn\'t require inventing new genes; it requires repurposing existing ones. This is why convergent evolution of carnivory is so common: the raw materials are already in the toolkit.',
      codeIntro: 'Simulate the evolutionary pathway from non-carnivorous ancestor to full carnivore.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate evolution of carnivory over generations
generations = 500
pop_size = 100

# Traits: stickiness (0-1), enzyme_activity (0-1), trap_structure (0-1)
# Fitness depends on soil nutrient level
soil_n = 10  # very low (carnivory-promoting)

# Initialize: non-carnivorous ancestor
stickiness = np.random.normal(0.1, 0.05, pop_size)
enzyme = np.random.normal(0.05, 0.02, pop_size)
structure = np.random.normal(0.0, 0.01, pop_size)

history = {'stickiness': [], 'enzyme': [], 'structure': [], 'fitness': []}

for gen in range(generations):
    stickiness = np.clip(stickiness, 0, 1)
    enzyme = np.clip(enzyme, 0, 1)
    structure = np.clip(structure, 0, 1)

    # Prey captured proportional to stickiness * structure
    prey = stickiness * (0.3 + 0.7 * structure)
    # Nutrients gained proportional to prey * enzyme
    nutrients_from_prey = prey * enzyme * 50

    # Total nutrients
    total_n = soil_n + nutrients_from_prey

    # Fitness: growth rate based on total nitrogen
    # Cost of carnivory: stickiness + enzyme + structure
    cost = 5 * (stickiness + enzyme + structure)
    fitness = total_n - cost
    fitness = np.clip(fitness, 0.1, None)

    history['stickiness'].append(np.mean(stickiness))
    history['enzyme'].append(np.mean(enzyme))
    history['structure'].append(np.mean(structure))
    history['fitness'].append(np.mean(fitness))

    # Selection
    fitness_norm = fitness / fitness.sum()
    parents = np.random.choice(pop_size, pop_size, p=fitness_norm)

    # Reproduce with mutation
    stickiness = stickiness[parents] + np.random.normal(0, 0.01, pop_size)
    enzyme = enzyme[parents] + np.random.normal(0, 0.01, pop_size)
    structure = structure[parents] + np.random.normal(0, 0.008, pop_size)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8))
fig.patch.set_facecolor('#1f2937')

# Trait evolution
ax1.set_facecolor('#111827')
gens = np.arange(generations)
ax1.plot(gens, history['stickiness'], color='#f59e0b', linewidth=2, label='Stickiness (glands)')
ax1.plot(gens, history['enzyme'], color='#22c55e', linewidth=2, label='Enzyme activity')
ax1.plot(gens, history['structure'], color='#3b82f6', linewidth=2, label='Trap structure')

# Mark evolutionary stages
stages = [
    (0, 'Ancestor:\\nnon-carnivorous', '#6b7280'),
    (80, 'Proto-carnivore:\\nsticky glands', '#f59e0b'),
    (200, 'Early carnivore:\\nenzymes appear', '#22c55e'),
    (350, 'Full carnivore:\\nstructured trap', '#3b82f6'),
]
for gen, label, color in stages:
    ax1.axvline(gen, color=color, linestyle=':', linewidth=0.5)
    ax1.text(gen+5, 0.9, label, color=color, fontsize=7)

ax1.set_xlabel('Generations', color='white')
ax1.set_ylabel('Trait value (0-1)', color='white')
ax1.set_title('Evolution of Carnivory: From Ancestor to Trap', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Fitness over time
ax2.set_facecolor('#111827')
ax2.plot(gens, history['fitness'], color='#a855f7', linewidth=2)
ax2.fill_between(gens, history['fitness'], alpha=0.15, color='#a855f7')
ax2.set_xlabel('Generations', color='white')
ax2.set_ylabel('Mean fitness', color='white')
ax2.set_title('Fitness Increases as Carnivory Evolves', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Evolutionary stages:")
print(f"  Gen 0: stickiness={history['stickiness'][0]:.2f}, enzyme={history['enzyme'][0]:.2f}, structure={history['structure'][0]:.2f}")
print(f"  Gen 100: stickiness={history['stickiness'][100]:.2f}, enzyme={history['enzyme'][100]:.2f}, structure={history['structure'][100]:.2f}")
print(f"  Gen 300: stickiness={history['stickiness'][300]:.2f}, enzyme={history['enzyme'][300]:.2f}, structure={history['structure'][300]:.2f}")
print(f"  Gen 499: stickiness={history['stickiness'][-1]:.2f}, enzyme={history['enzyme'][-1]:.2f}, structure={history['structure'][-1]:.2f}")
print()
print("Key insight: stickiness evolves FIRST (cheapest, most immediate payoff)")
print("Enzymes evolve SECOND (increase nutrient extraction from prey)")
print("Structure evolves LAST (most expensive, but most effective)")`,
      challenge: 'Run the simulation again with soil_n = 50 (rich soil). Does carnivory still evolve? What trait values stabilize at? This tests the prediction that carnivory is only favoured in poor soils.',
      successHint: 'Evolution is not random — it follows predictable paths when the selective pressures are clear. The fact that carnivory evolved independently 6+ times tells us the path from sticky glands to full traps is a well-worn evolutionary highway.',
    },
    {
      title: 'Biomimicry from carnivorous plants — engineering inspired by nature',
      concept: `Carnivorous plants have solved engineering problems that humans are still working on. Scientists and engineers are studying these solutions and applying them to technology:

**From pitcher plants:**
- **SLIPS (Slippery Liquid-Infused Porous Surfaces)**: inspired by the pitcher's peristome. A micro-textured surface infused with lubricant creates one of the most slippery surfaces ever made. Applications: anti-fouling coatings for ships, self-cleaning medical devices, anti-icing surfaces for aircraft.

**From sundews:**
- **Adhesive microstructures**: the sundew's mucilage inspired new biocompatible adhesives for wound closure and surgical tape. The key: strong wet adhesion (most adhesives fail when wet).

**From Venus flytraps:**
- **Bistable snap mechanisms**: the flytrap's rapid closure uses a bistable shell (like an inverted umbrella). Engineers use this principle for energy-free actuators — switches that snap between two states without continuous power.

**From bladderworts:**
- **Micro-suction devices**: the fastest-known plant movement inspires microfluidic pumps and sampling devices that capture tiny particles from fluids.`,
      analogy: 'Biomimicry is like an engineering student studying nature\'s best graduates. Evolution has been running R&D for 3.8 billion years with trillions of test subjects. When a human engineer faces a problem, checking if nature solved it first is the smartest shortcut available.',
      storyConnection: 'The pitcher plant of Meghalaya didn\'t just evolve a trap — it evolved solutions to surface science, fluid dynamics, and enzyme chemistry that human engineers are only now catching up to. The story\'s "wisdom of the plant" is literal: these are engineering blueprints tested over millions of years.',
      checkQuestion: 'SLIPS coatings (inspired by pitcher plants) prevent barnacles from sticking to ship hulls. How much fuel could this save the global shipping industry?',
      checkAnswer: 'Biofouling (barnacles, algae, etc. growing on hulls) increases drag by 40-60%, costing the shipping industry ~$150 billion per year in extra fuel. Effective anti-fouling coatings inspired by pitcher plant surfaces could reduce this by 30-50%, saving ~$50-75 billion and reducing CO2 emissions equivalent to taking millions of cars off the road.',
      codeIntro: 'Model the SLIPS surface: how surface texture and lubricant create extreme slipperiness.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# SLIPS surface model: contact angle and sliding angle
# Inspired by pitcher plant peristome

# Surface types
surfaces = {
    'Glass (smooth)': {'roughness': 0.01, 'lubricant': 0, 'contact_angle': 30},
    'Teflon (non-stick)': {'roughness': 0.1, 'lubricant': 0, 'contact_angle': 110},
    'Lotus leaf': {'roughness': 0.9, 'lubricant': 0, 'contact_angle': 160},
    'Pitcher peristome': {'roughness': 0.8, 'lubricant': 0.9, 'contact_angle': 5},
    'SLIPS (bio-inspired)': {'roughness': 0.7, 'lubricant': 0.95, 'contact_angle': 3},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Contact angle comparison
ax1.set_facecolor('#111827')
names = list(surfaces.keys())
angles = [s['contact_angle'] for s in surfaces.values()]
colors = ['#6b7280', '#3b82f6', '#22c55e', '#ef4444', '#a855f7']

bars = ax1.barh(range(len(names)), angles, color=colors, alpha=0.85)
ax1.set_yticks(range(len(names)))
ax1.set_yticklabels(names, color='white', fontsize=9)
ax1.set_xlabel('Sliding angle (degrees) — lower = more slippery', color='white')
ax1.set_title('Surface Slipperiness Comparison', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.invert_yaxis()

for bar, angle in zip(bars, angles):
    ax1.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
             f'{angle}°', va='center', color='white', fontsize=10)

# How SLIPS works: roughness + lubricant
ax2.set_facecolor('#111827')
roughness = np.linspace(0, 1, 50)
lubricant = np.linspace(0, 1, 50)
R, L = np.meshgrid(roughness, lubricant)

# Slipperiness model: high when both roughness and lubricant are high
# Roughness creates texture; lubricant fills it
slipperiness = R * L * 10  # simplified
# Lotus effect: high roughness + no lubricant = hydrophobic (different mechanism)
lotus_effect = R * (1 - L) * 6

total_repellency = slipperiness + lotus_effect

im = ax2.contourf(R, L, total_repellency, levels=20, cmap='viridis', alpha=0.9)
plt.colorbar(im, ax=ax2, label='Repellency score')

# Mark key surfaces
ax2.plot(0.01, 0, 'o', color='#6b7280', markersize=10)  # glass
ax2.text(0.05, 0.05, 'Glass', color='white', fontsize=8)
ax2.plot(0.9, 0, 'o', color='#22c55e', markersize=10)  # lotus
ax2.text(0.75, 0.05, 'Lotus leaf', color='white', fontsize=8)
ax2.plot(0.8, 0.9, 'o', color='#ef4444', markersize=10)  # pitcher
ax2.text(0.55, 0.92, 'Pitcher/SLIPS', color='white', fontsize=8)

ax2.set_xlabel('Surface roughness', color='white')
ax2.set_ylabel('Lubricant infusion', color='white')
ax2.set_title('SLIPS Design Space: Roughness + Lubricant', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Biomimicry from carnivorous plants:")
print()
print("SLIPS (from pitcher plants):")
print("  - Ships: anti-fouling, saves billions in fuel")
print("  - Medical: anti-bacterial surfaces for implants")
print("  - Aviation: anti-icing for aircraft wings")
print()
print("Sundew adhesives:")
print("  - Surgical tape that works on wet tissue")
print("  - Wound closure without sutures")
print()
print("Venus flytrap snap mechanism:")
print("  - Bistable actuators for robotics")
print("  - Energy-free switches for space applications")
print()
print("Nature's R&D budget: 3.8 billion years of evolution.")
print("Our job: learn from it.")`,
      challenge: 'Research one more biomimicry application from carnivorous plants and add it to the comparison. Calculate the potential economic value if the technology saves even 1% of costs in its target industry.',
      successHint: 'Biomimicry is where biology meets engineering, and carnivorous plants are a goldmine of solutions. From Level 1\'s biology to Level 2\'s chemistry and engineering — you\'ve traced the full arc from "how does it work?" to "how can we use it?"',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Extreme Biology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced biology and engineering simulations. Click to start.</p>
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