import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PitcherPlantLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Carnivorous plant adaptations — why eat animals?',
      concept: `Plants are autotrophs — they make their own food from sunlight, water, and CO2. So why would a plant evolve to eat insects? The answer lies in **nutrient limitation**, specifically **nitrogen** and **phosphorus**.

Most plants get nitrogen from the soil, where bacteria convert atmospheric N2 into usable ammonium and nitrate (**nitrogen fixation**). But some habitats have almost no available nitrogen: **bogs**, **heathlands**, and **nutrient-poor montane forests**. The soil is waterlogged and acidic, decomposition is slow, and bacterial activity is minimal.

In these nitrogen deserts, carnivorous plants found an alternative: they get nitrogen directly from **animal protein**. An insect body is about 10% nitrogen by dry weight — a rich source in an otherwise barren landscape. The plant digests the insect using **proteolytic enzymes** (similar to your stomach enzymes) and absorbs the amino acids.

There are approximately 800 known carnivorous plant species worldwide, spanning at least 12 independent evolutionary origins. They have evolved five main trap mechanisms:
- **Pitfall traps** (pitcher plants): slippery funnels filled with digestive fluid
- **Snap traps** (Venus flytrap): rapid leaf closure triggered by touch
- **Flypaper traps** (sundews): sticky mucilage on tentacle-like glands
- **Bladder traps** (bladderworts): underwater vacuum chambers
- **Lobster-pot traps** (corkscrew plants): inward-pointing hairs force prey deeper

Northeast India, particularly Meghalaya, hosts an extraordinary diversity of pitcher plants (Nepenthes) due to its combination of high rainfall, acidic soils, and montane topography.`,
      analogy: 'Imagine a town where the grocery stores are all closed. Most residents would starve. But some clever people start catching fish from the river for protein. They still need sunlight for vitamin D and gardens for carbohydrates — they have not stopped being human. They have just found an alternative protein source. Carnivorous plants are the same: they still photosynthesize for energy, but catch insects for the nitrogen their soil cannot provide.',
      storyConnection: 'The pitcher plants of Meghalaya\'s Khasi Hills grow in mossy cloud forests where rainfall exceeds 11,000 mm per year. The constant rain leaches nutrients from the soil, creating one of the most nitrogen-poor terrestrial habitats on Earth. In this landscape, the pitcher plant\'s carnivory is not a luxury — it is a survival strategy evolved over millions of years.',
      checkQuestion: 'If carnivorous plants get nitrogen from insects, why do they still need roots? Could a pitcher plant survive without soil?',
      checkAnswer: 'Roots provide water, phosphorus, potassium, and structural anchoring. Insects supply primarily nitrogen (and some phosphorus). A pitcher plant without roots would dehydrate and lack essential minerals. Some epiphytic pitcher plants (like Nepenthes growing on tree branches) have minimal roots but still need rainfall and decomposing leaf matter. Carnivory supplements nutrition — it does not replace it.',
      codeIntro: 'Model the nitrogen budget of a carnivorous vs. non-carnivorous plant in a nutrient-poor environment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Nitrogen budget model: carnivorous vs non-carnivorous plant
days = 365
dt = 1  # day

# Soil nitrogen availability (very low for bogs)
soil_n_supply = 0.05  # mg N per day from soil (extremely low)

# Insect capture rate for carnivorous plant
insects_per_day = 0.3  # average (some days zero, some days multiple)
n_per_insect = 2.0     # mg N per insect

# Plant nitrogen demand for growth
base_demand = 0.8  # mg N per day for maintenance
growth_demand = 1.5  # mg N per day for new tissue

np.random.seed(42)

# Simulate both plant types
n_pool_carn = np.zeros(days)   # carnivorous plant N pool
n_pool_norm = np.zeros(days)   # normal plant N pool
biomass_carn = np.zeros(days)
biomass_norm = np.zeros(days)
captures = np.zeros(days)

n_pool_carn[0] = 5.0
n_pool_norm[0] = 5.0
biomass_carn[0] = 10.0
biomass_norm[0] = 10.0

for d in range(1, days):
    # Soil nitrogen input (both plants)
    soil_input = soil_n_supply * (1 + 0.3 * np.sin(2 * np.pi * d / 365))  # seasonal

    # Insect capture (carnivorous only, Poisson-distributed)
    n_insects = np.random.poisson(insects_per_day)
    insect_n = n_insects * n_per_insect
    captures[d] = n_insects

    # Nitrogen pools
    n_pool_norm[d] = n_pool_norm[d-1] + soil_input
    n_pool_carn[d] = n_pool_carn[d-1] + soil_input + insect_n

    # Growth: limited by nitrogen availability
    # Demand = maintenance + growth
    demand = base_demand + growth_demand * (biomass_carn[d-1] / (biomass_carn[d-1] + 50))

    # Carnivorous plant growth
    if n_pool_carn[d] >= demand:
        n_pool_carn[d] -= demand
        biomass_carn[d] = biomass_carn[d-1] + 0.15 * (n_pool_carn[d] / (n_pool_carn[d] + 5))
    else:
        n_pool_carn[d] = max(0, n_pool_carn[d] - base_demand * 0.5)
        biomass_carn[d] = biomass_carn[d-1] * 0.999  # slight decline

    # Normal plant growth
    if n_pool_norm[d] >= demand * 0.7:  # lower demand (no trap cost)
        n_pool_norm[d] -= demand * 0.7
        biomass_norm[d] = biomass_norm[d-1] + 0.1 * (n_pool_norm[d] / (n_pool_norm[d] + 5))
    else:
        n_pool_norm[d] = max(0, n_pool_norm[d] - base_demand * 0.3)
        biomass_norm[d] = biomass_norm[d-1] * 0.998

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Nitrogen Budget: Carnivorous vs Normal Plant', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

d_axis = np.arange(days)

# Biomass comparison
axes[0, 0].plot(d_axis, biomass_carn, color='#ef4444', linewidth=2, label='Pitcher plant')
axes[0, 0].plot(d_axis, biomass_norm, color='#22c55e', linewidth=2, label='Normal plant')
axes[0, 0].set_ylabel('Biomass (arb.)', color='white')
axes[0, 0].set_title('Biomass over 1 year', color='white', fontsize=10)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Nitrogen pools
axes[0, 1].plot(d_axis, n_pool_carn, color='#ef4444', linewidth=1.5, label='Pitcher plant', alpha=0.8)
axes[0, 1].plot(d_axis, n_pool_norm, color='#22c55e', linewidth=1.5, label='Normal plant', alpha=0.8)
axes[0, 1].set_ylabel('N pool (mg)', color='white')
axes[0, 1].set_title('Internal nitrogen reserves', color='white', fontsize=10)
axes[0, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Insect captures
weekly_captures = np.convolve(captures, np.ones(7)/7, mode='same')
axes[1, 0].bar(d_axis, captures, color='#f59e0b', alpha=0.3, width=1)
axes[1, 0].plot(d_axis, weekly_captures, color='#f59e0b', linewidth=2, label='7-day avg')
axes[1, 0].set_xlabel('Day', color='white')
axes[1, 0].set_ylabel('Insects caught', color='white')
axes[1, 0].set_title('Daily insect captures', color='white', fontsize=10)
axes[1, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Nitrogen sources pie chart
total_soil = soil_n_supply * days
total_insect = captures.sum() * n_per_insect
axes[1, 1].pie([total_soil, total_insect],
               labels=['Soil N', 'Insect N'],
               colors=['#22c55e', '#ef4444'],
               autopct='%1.0f%%',
               textprops={'color': 'white', 'fontsize': 11})
axes[1, 1].set_title('Nitrogen sources (pitcher plant)', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Annual nitrogen budget:")
print(f"  Soil supply: {total_soil:.1f} mg N/year")
print(f"  Insect supply: {total_insect:.1f} mg N/year")
print(f"  Insect N is {total_insect/(total_soil+total_insect)*100:.0f}% of total intake")
print(f"\\\nFinal biomass:")
print(f"  Pitcher plant: {biomass_carn[-1]:.1f} (started at {biomass_carn[0]:.1f})")
print(f"  Normal plant: {biomass_norm[-1]:.1f} (started at {biomass_norm[0]:.1f})")
print(f"  Advantage: {(biomass_carn[-1]/biomass_norm[-1] - 1)*100:.0f}% more biomass from carnivory")`,
      challenge: 'Change soil_n_supply to 0.5 (rich soil). Does the carnivorous plant still have an advantage? Find the threshold soil nitrogen where carnivory stops being beneficial (considering the metabolic cost of building traps).',
      successHint: 'Carnivory is only advantageous when soil nitrogen is scarce. In rich soils, the metabolic cost of building traps outweighs the nitrogen gained from insects. This is why carnivorous plants are found almost exclusively in nutrient-poor habitats.',
    },
    {
      title: 'Nitrogen-limited ecosystems — the chemistry of scarcity',
      concept: `Nitrogen is the fourth most abundant element in living organisms (after carbon, hydrogen, oxygen), making up about **3% of human body mass** and **1.5-3% of plant dry weight**. Despite being 78% of the atmosphere, nitrogen gas (N2) is inert — its triple bond requires enormous energy to break.

The **nitrogen cycle** converts N2 into biologically available forms:
1. **Nitrogen fixation**: N2 + 8H+ + 8e- + 16ATP -> 2NH3 + H2. Only certain bacteria (Rhizobium, Azotobacter) and archaea can do this. Lightning also fixes small amounts.
2. **Nitrification**: NH3 -> NO2- -> NO3- (done by Nitrosomonas and Nitrobacter bacteria). Requires oxygen.
3. **Assimilation**: Plants absorb NH4+ and NO3- through roots and build amino acids.
4. **Ammonification**: Dead organisms decomposed back to NH4+ by soil microbes.
5. **Denitrification**: NO3- -> N2 (anaerobic bacteria return N to atmosphere).

In **bogs and peat lands**, the nitrogen cycle breaks down:
- Waterlogged soil lacks oxygen, killing nitrifying bacteria
- Acidic conditions (pH 3-5) inhibit decomposition and nitrogen fixation
- Cold temperatures slow all microbial activity
- Sphagnum moss actively acidifies its environment, making conditions worse for other plants

The result: available nitrogen can be **10-100x lower** than in normal forest soil. This creates the evolutionary pressure for carnivory — the nitrogen is there in the ecosystem (in insects), just not in the soil.`,
      analogy: 'Imagine a town surrounded by grain silos, but all the grain is locked in steel containers that nobody has the key to. The grain (N2) is abundant but inaccessible. The few locksmiths (nitrogen-fixing bacteria) charge exorbitant prices and are rarely available. Most residents (plants) go hungry. But one clever family (pitcher plants) sets up a fishing business — catching visitors (insects) who carry their own food (nitrogen in their bodies).',
      storyConnection: 'The pitcher plant bogs of Meghalaya sit atop quartzite rock, which weathers into extremely nutrient-poor, acidic soil. The heavy rains (Cherrapunji gets 11,777 mm annually) leach away what little nitrogen bacteria produce. In this double constraint — poor parent rock and relentless leaching — carnivorous plants thrive precisely because conventional nutrition fails.',
      checkQuestion: 'Why does waterlogging inhibit the nitrogen cycle? Explain the specific biochemical mechanisms.',
      checkAnswer: 'Waterlogging fills soil pores with water, displacing oxygen. Nitrification (NH3 to NO3-) is an aerobic process — Nitrosomonas and Nitrobacter bacteria need O2 as an electron acceptor. Without oxygen, nitrification stops, and ammonium accumulates but is not converted to the nitrate form most plants prefer. Simultaneously, anaerobic conditions promote denitrification (NO3- to N2), which removes whatever nitrate existed. The result is a nitrogen sink, not a nitrogen source.',
      codeIntro: 'Simulate the nitrogen cycle in normal soil vs. waterlogged bog, showing how available nitrogen diverges.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Nitrogen cycle simulation
days = 365
dt = 1

def simulate_n_cycle(waterlogged=False, temp_mean=20, rainfall_mm=1500):
    """Simulate soil nitrogen dynamics over one year."""
    # Pools (mg N per kg soil)
    organic_n = np.zeros(days)  # dead organic matter
    nh4 = np.zeros(days)        # ammonium
    no3 = np.zeros(days)        # nitrate
    available = np.zeros(days)  # total available (nh4 + no3)

    organic_n[0] = 100
    nh4[0] = 5
    no3[0] = 10

    np.random.seed(42)

    for d in range(1, days):
        # Temperature effect (seasonal)
        temp = temp_mean + 8 * np.sin(2 * np.pi * (d - 90) / 365)
        temp_factor = max(0, (temp - 5) / 25)  # 0 at 5C, 1 at 30C

        # Oxygen availability
        o2 = 0.1 if waterlogged else 0.8  # fraction of saturation

        # 1. Nitrogen fixation (very low in bogs)
        fixation = 0.05 * temp_factor * (0.3 if waterlogged else 1.0)

        # 2. Ammonification (decomposition of organic N to NH4+)
        # Slower in acidic, waterlogged, cold conditions
        ammonification = 0.003 * organic_n[d-1] * temp_factor * (0.2 if waterlogged else 1.0)

        # 3. Nitrification (NH4+ to NO3-, requires oxygen)
        nitrification = 0.1 * nh4[d-1] * o2 * temp_factor

        # 4. Denitrification (NO3- to N2, occurs in anaerobic conditions)
        denitrification = 0.05 * no3[d-1] * (1 - o2) * temp_factor

        # 5. Plant uptake
        plant_uptake_nh4 = 0.02 * nh4[d-1] * temp_factor
        plant_uptake_no3 = 0.03 * no3[d-1] * temp_factor

        # 6. Leaching (proportional to rainfall)
        daily_rain = rainfall_mm / 365 * (1 + 0.5 * np.sin(2 * np.pi * (d - 180) / 365))
        leaching = 0.001 * no3[d-1] * daily_rain / 4  # NO3 is mobile

        # 7. Litter input (adds to organic N)
        litter = 0.3 * (1 + 0.5 * np.sin(2 * np.pi * (d - 270) / 365))  # more in autumn

        # Update pools
        organic_n[d] = organic_n[d-1] + litter - ammonification
        nh4[d] = nh4[d-1] + fixation + ammonification - nitrification - plant_uptake_nh4
        no3[d] = no3[d-1] + nitrification - denitrification - plant_uptake_no3 - leaching
        available[d] = max(0, nh4[d]) + max(0, no3[d])

        # Clamp
        organic_n[d] = max(0, organic_n[d])
        nh4[d] = max(0, nh4[d])
        no3[d] = max(0, no3[d])

    return organic_n, nh4, no3, available

# Run both scenarios
org_n, nh4_n, no3_n, avail_n = simulate_n_cycle(waterlogged=False)
org_b, nh4_b, no3_b, avail_b = simulate_n_cycle(waterlogged=True, rainfall_mm=11000)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Nitrogen Cycle: Normal Soil vs Waterlogged Bog', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

d_axis = np.arange(days)

# Ammonium
axes[0, 0].plot(d_axis, nh4_n, color='#22c55e', linewidth=2, label='Normal soil')
axes[0, 0].plot(d_axis, nh4_b, color='#ef4444', linewidth=2, label='Bog')
axes[0, 0].set_ylabel('mg N / kg soil', color='white')
axes[0, 0].set_title('Ammonium (NH4+)', color='white', fontsize=10)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Nitrate
axes[0, 1].plot(d_axis, no3_n, color='#22c55e', linewidth=2, label='Normal soil')
axes[0, 1].plot(d_axis, no3_b, color='#ef4444', linewidth=2, label='Bog')
axes[0, 1].set_ylabel('mg N / kg soil', color='white')
axes[0, 1].set_title('Nitrate (NO3-)', color='white', fontsize=10)
axes[0, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Total available
axes[0, 2].plot(d_axis, avail_n, color='#22c55e', linewidth=2, label='Normal soil')
axes[0, 2].plot(d_axis, avail_b, color='#ef4444', linewidth=2, label='Bog')
axes[0, 2].set_ylabel('mg N / kg soil', color='white')
axes[0, 2].set_title('Total available nitrogen', color='white', fontsize=10)
axes[0, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Ratio comparison
ratio = avail_n / np.maximum(avail_b, 0.01)
axes[1, 0].plot(d_axis, ratio, color='#f59e0b', linewidth=2)
axes[1, 0].axhline(1, color='gray', linestyle='--', alpha=0.5)
axes[1, 0].set_xlabel('Day', color='white')
axes[1, 0].set_ylabel('Ratio', color='white')
axes[1, 0].set_title('Normal/Bog nitrogen ratio', color='white', fontsize=10)

# Organic matter accumulation
axes[1, 1].plot(d_axis, org_n, color='#22c55e', linewidth=2, label='Normal (decomposing)')
axes[1, 1].plot(d_axis, org_b, color='#ef4444', linewidth=2, label='Bog (accumulating!)')
axes[1, 1].set_xlabel('Day', color='white')
axes[1, 1].set_ylabel('Organic N (mg/kg)', color='white')
axes[1, 1].set_title('Organic matter (peat formation)', color='white', fontsize=10)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Process rates comparison
processes = ['Fixation', 'Ammonif.', 'Nitrif.', 'Denitrif.', 'Leaching']
normal_rates = [0.05, 0.003*100, 0.1*5, 0.05*10*0.2, 0.001*10*4]
bog_rates = [0.05*0.3, 0.003*100*0.2, 0.1*5*0.1, 0.05*10*0.9, 0.001*10*30]
x = np.arange(len(processes))
axes[1, 2].bar(x - 0.2, normal_rates, 0.35, color='#22c55e', label='Normal', alpha=0.8)
axes[1, 2].bar(x + 0.2, bog_rates, 0.35, color='#ef4444', label='Bog', alpha=0.8)
axes[1, 2].set_xticks(x)
axes[1, 2].set_xticklabels(processes, fontsize=8, color='white')
axes[1, 2].set_ylabel('Relative rate', color='white')
axes[1, 2].set_title('Process rates comparison', color='white', fontsize=10)
axes[1, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Annual nitrogen availability:")
print(f"  Normal soil: {avail_n.mean():.1f} mg N/kg (mean)")
print(f"  Bog soil: {avail_b.mean():.1f} mg N/kg (mean)")
print(f"  Ratio: {avail_n.mean()/max(avail_b.mean(),0.01):.1f}x more in normal soil")
print(f"\\\nOrganic matter trend:")
print(f"  Normal: {org_n[-1]:.0f} mg/kg (decomposition keeps up)")
print(f"  Bog: {org_b[-1]:.0f} mg/kg (accumulating -> peat formation)")
print(f"\\\nThis nitrogen scarcity is why pitcher plants evolved carnivory.")`,
      challenge: 'Add a "pH effect" parameter: in bogs, pH is 3.5 (vs 6.5 in normal soil). Enzyme activity drops exponentially below pH 5. How does explicit pH modeling change the nitrogen availability gap?',
      successHint: 'Bogs are nitrogen prisons: organic matter accumulates because decomposition is blocked, and the nitrogen locked inside cannot be recycled. Carnivorous plants bypass this bottleneck entirely by harvesting nitrogen from mobile animals.',
    },
    {
      title: 'Enzyme biochemistry — digesting prey',
      concept: `Once an insect falls into a pitcher plant\'s trap, it must be **digested** — broken down into absorbable nutrients. Pitcher plants secrete a cocktail of **hydrolytic enzymes** remarkably similar to the enzymes in your own stomach.

Key digestive enzymes:
- **Proteases** (nepenthesin I and II): break proteins into amino acids. These are aspartic acid proteases, active at pH 2-4 — the same acidic range as human pepsin.
- **Esterases**: break lipid bonds, releasing fatty acids
- **Chitinases**: break down chitin (the insect exoskeleton polymer)
- **Phosphatases**: release phosphorus from organic compounds
- **Ribonucleases**: break down RNA and DNA

Enzyme kinetics follow the **Michaelis-Menten equation**: v = Vmax * [S] / (Km + [S]), where:
- v = reaction rate
- Vmax = maximum rate when enzyme is saturated
- [S] = substrate concentration
- Km = Michaelis constant (substrate concentration at half-Vmax)

Low Km means the enzyme works efficiently even at low substrate concentrations — important when you are digesting a single small insect. Pitcher plant proteases have remarkably low Km values, meaning they are optimized for dilute solutions.

Digestion takes **5-12 days** depending on insect size, fluid volume, and temperature. The resulting amino acid solution is absorbed through specialized **glandular cells** lining the inner wall of the pitcher, using active transport proteins similar to those in your intestinal lining.`,
      analogy: 'Pitcher plant digestion is like a slow cooker. Your stomach is a high-powered blender — high enzyme concentration, vigorous churning, done in hours. The pitcher is a slow cooker — dilute enzymes, no churning, takes days. But the end result is the same: proteins broken into amino acids. The pitcher plant trades speed for simplicity, needing no muscles or nervous system.',
      storyConnection: 'Khasi tribal healers in Meghalaya have traditionally used pitcher plant fluid as a digestive remedy — they recognized its acidic, enzyme-rich nature centuries before biochemists isolated nepenthesin. The fluid has also been studied for antimicrobial properties, as the pitcher must prevent bacterial overgrowth that would compete for nutrients.',
      checkQuestion: 'If a pitcher plant\'s protease has Km = 0.5 mM and an insect dissolves to give 2 mM protein concentration, what fraction of Vmax is the enzyme operating at?',
      checkAnswer: 'Using Michaelis-Menten: v/Vmax = [S]/(Km + [S]) = 2/(0.5 + 2) = 2/2.5 = 0.80 or 80% of Vmax. The enzyme is operating efficiently but not at full capacity. As digestion proceeds and [S] drops, the rate will slow. When [S] = Km = 0.5 mM, the rate is 50% of Vmax. When [S] = 0.1 mM, it drops to 0.1/0.6 = 17%. The last bits of protein are digested very slowly.',
      codeIntro: 'Model enzyme kinetics of pitcher plant digestion, tracking substrate depletion and nutrient absorption over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Michaelis-Menten enzyme kinetics for pitcher plant digestion
hours = 288  # 12 days
dt = 0.5

# Enzyme parameters (protease)
Vmax_protease = 0.15  # mM/hour at optimal pH
Km_protease = 0.5     # mM

# pH effects on enzyme activity
def ph_activity(ph, optimal_ph=3.0, width=1.5):
    """Bell-shaped pH-activity curve."""
    return np.exp(-0.5 * ((ph - optimal_ph) / width) ** 2)

# Temperature effects (Arrhenius-like)
def temp_activity(temp_c, optimal=30, q10=2.0):
    """Temperature coefficient model."""
    return q10 ** ((temp_c - optimal) / 10) if temp_c <= optimal else q10 ** ((optimal - temp_c) / 15)

# Simulate digestion of a medium insect (~5 mg protein)
protein = np.zeros(int(hours / dt))
amino_acids = np.zeros(int(hours / dt))
chitin = np.zeros(int(hours / dt))
enzyme_rate = np.zeros(int(hours / dt))

# Initial conditions (insect dissolved in 5 mL fluid)
protein[0] = 3.0     # mM protein
chitin[0] = 1.5      # mM chitin

# Simulate with varying conditions
for i in range(1, len(protein)):
    h = i * dt
    # Day/night temperature cycle
    hour_of_day = h % 24
    temp = 22 + 6 * np.sin(2 * np.pi * (hour_of_day - 6) / 24)

    # pH changes as digestion proceeds (starts at 3, rises as acids are consumed)
    ph = 2.5 + 0.5 * (1 - protein[i-1] / protein[0])

    # Enzyme activity modifiers
    ph_mod = ph_activity(ph)
    temp_mod = temp_activity(temp)

    # Michaelis-Menten for protein digestion
    v_protein = Vmax_protease * protein[i-1] / (Km_protease + protein[i-1])
    v_protein *= ph_mod * temp_mod

    # Chitin digestion (slower, different enzyme)
    Vmax_chitin = 0.03  # much slower
    Km_chitin = 1.0
    v_chitin = Vmax_chitin * chitin[i-1] / (Km_chitin + chitin[i-1])
    v_chitin *= ph_mod * temp_mod * 0.7  # chitinase less pH sensitive

    # Update pools
    protein[i] = max(0, protein[i-1] - v_protein * dt)
    chitin[i] = max(0, chitin[i-1] - v_chitin * dt)
    amino_acids[i] = amino_acids[i-1] + v_protein * dt * 0.9  # 90% recovery
    enzyme_rate[i] = v_protein

time = np.arange(len(protein)) * dt

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Pitcher Plant Digestion Kinetics', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Substrate depletion
axes[0, 0].plot(time / 24, protein, color='#ef4444', linewidth=2, label='Protein')
axes[0, 0].plot(time / 24, chitin, color='#f59e0b', linewidth=2, label='Chitin')
axes[0, 0].set_xlabel('Days', color='white')
axes[0, 0].set_ylabel('Concentration (mM)', color='white')
axes[0, 0].set_title('Substrate depletion', color='white', fontsize=10)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Amino acid accumulation
axes[0, 1].plot(time / 24, amino_acids, color='#22c55e', linewidth=2)
axes[0, 1].fill_between(time / 24, amino_acids, alpha=0.2, color='#22c55e')
axes[0, 1].set_xlabel('Days', color='white')
axes[0, 1].set_ylabel('Amino acids (mM)', color='white')
axes[0, 1].set_title('Nutrient accumulation', color='white', fontsize=10)

# Enzyme rate over time
axes[0, 2].plot(time / 24, enzyme_rate, color='#a855f7', linewidth=1.5)
axes[0, 2].set_xlabel('Days', color='white')
axes[0, 2].set_ylabel('Digestion rate (mM/hr)', color='white')
axes[0, 2].set_title('Protease reaction rate', color='white', fontsize=10)

# Michaelis-Menten curve
s_range = np.linspace(0, 5, 200)
v_range = Vmax_protease * s_range / (Km_protease + s_range)
axes[1, 0].plot(s_range, v_range, color='#3b82f6', linewidth=2.5)
axes[1, 0].axhline(Vmax_protease, color='gray', linestyle='--', alpha=0.5, label='Vmax')
axes[1, 0].axhline(Vmax_protease/2, color='gray', linestyle=':', alpha=0.5, label='Vmax/2')
axes[1, 0].axvline(Km_protease, color='gray', linestyle=':', alpha=0.5, label=f'Km={Km_protease}')
axes[1, 0].set_xlabel('[Substrate] (mM)', color='white')
axes[1, 0].set_ylabel('Rate (mM/hr)', color='white')
axes[1, 0].set_title('Michaelis-Menten curve', color='white', fontsize=10)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# pH-activity profile
ph_range = np.linspace(1, 8, 200)
axes[1, 1].plot(ph_range, ph_activity(ph_range), color='#ef4444', linewidth=2, label='Protease')
axes[1, 1].plot(ph_range, ph_activity(ph_range, 5.0, 2.0), color='#3b82f6', linewidth=2, label='Chitinase')
axes[1, 1].set_xlabel('pH', color='white')
axes[1, 1].set_ylabel('Relative activity', color='white')
axes[1, 1].set_title('pH-activity profiles', color='white', fontsize=10)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Digestion progress (% complete)
pct_protein = (1 - protein / protein[0]) * 100
pct_chitin = (1 - chitin / chitin[0]) * 100
axes[1, 2].plot(time / 24, pct_protein, color='#ef4444', linewidth=2, label='Protein')
axes[1, 2].plot(time / 24, pct_chitin, color='#f59e0b', linewidth=2, label='Chitin')
axes[1, 2].axhline(90, color='gray', linestyle='--', alpha=0.5, label='90% digested')
axes[1, 2].set_xlabel('Days', color='white')
axes[1, 2].set_ylabel('% digested', color='white')
axes[1, 2].set_title('Digestion progress', color='white', fontsize=10)
axes[1, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Find time to 90% digestion
t90_protein = time[np.argmax(pct_protein >= 90)] / 24 if np.any(pct_protein >= 90) else float('inf')
t90_chitin = time[np.argmax(pct_chitin >= 90)] / 24 if np.any(pct_chitin >= 90) else float('inf')
print(f"Digestion summary:")
print(f"  Protein 90% digested in: {t90_protein:.1f} days")
print(f"  Chitin 90% digested in: {t90_chitin:.1f} days")
print(f"  Total amino acids recovered: {amino_acids[-1]:.2f} mM")
print(f"  Recovery efficiency: {amino_acids[-1]/(protein[0]*0.9)*100:.1f}%")`,
      challenge: 'Simulate digestion of three differently-sized insects (1 mg, 5 mg, 20 mg). Plot the time to 90% digestion for each. Does digestion scale linearly with prey size?',
      successHint: 'Michaelis-Menten kinetics govern almost all enzyme-catalyzed reactions in biology. Understanding this equation lets you predict reaction rates in any biological context — from pitcher plant digestion to drug metabolism in your liver.',
    },
    {
      title: 'Surface tension and wetting — the physics of the trap',
      concept: `The pitcher plant\'s trap is a marvel of **surface physics**. The rim (peristome) is covered in microscopic ridges that create a **superhydrophilic** (extremely water-loving) surface when wet. This causes a thin film of water to spread across the rim, making it impossibly slippery for insects.

**Surface tension** (gamma) is the force per unit length along a liquid surface, caused by cohesive forces between liquid molecules. Water has high surface tension (72.8 mN/m at 20C) because of hydrogen bonding. This is why small insects can walk on water — their weight is supported by surface tension.

On the pitcher rim, the physics reverses:
- The ridged microstructure channels water into a continuous film via **capillary action**
- The water film thickness (~10-50 micrometers) is just enough to prevent insect claws and pads from gripping
- **Contact angle** (theta) drops to nearly 0 degrees — the surface becomes fully wetting
- Insect adhesive pads (which work by van der Waals forces) fail on wet surfaces because the water layer prevents molecular contact

The **Young equation** relates contact angle to surface energies: cos(theta) = (gamma_SV - gamma_SL) / gamma_LV, where S=solid, L=liquid, V=vapor. The pitcher rim\'s microstructure effectively amplifies the hydrophilicity (Wenzel model).

Remarkably, the rim is only slippery when wet. In dry conditions, insects can walk on it safely. This is why pitcher plants in humid climates (like Meghalaya) are more effective traps — the rim is almost always wet from condensation and rain.`,
      analogy: 'The pitcher rim is like a water slide. A dry water slide has enough friction for you to climb up. But add a thin film of water, and the same surface becomes frictionless — you slide down uncontrollably. The pitcher plant\'s rim works the same way: microscopically smooth when wet, creating a one-way slide into the digestive fluid below.',
      storyConnection: 'In Meghalaya\'s cloud forests, the air is saturated with moisture year-round. Pitcher plants here are almost always "armed" — their rims perpetually wet from condensation. Insects visiting the nectar glands on the rim have no chance of maintaining their footing. The climate itself is the pitcher plant\'s ally, keeping its trap in permanent hunting mode.',
      checkQuestion: 'Why would a pitcher plant in a desert (dry climate) be a poor hunter, even if it had the same rim microstructure as a tropical species?',
      checkAnswer: 'In dry conditions, the rim is not wet, so insects can walk on it with normal traction. The superhydrophilic microstructure only creates a slippery surface when water is present to form a film. No water = no water film = no slipperiness. This is why carnivorous plants are overwhelmingly found in wet habitats — the trap mechanism depends on ambient humidity as much as on the structure itself.',
      codeIntro: 'Model the surface physics of the pitcher plant rim, including contact angles, capillary wetting, and friction coefficients.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Surface physics of the pitcher plant peristome

# 1. Contact angle as a function of surface roughness (Wenzel model)
# cos(theta_w) = r * cos(theta_y)
# r = roughness ratio (actual area / projected area), always >= 1

def wenzel_contact_angle(theta_young_deg, roughness):
    """Wenzel model: roughness amplifies wettability."""
    theta_young = np.radians(theta_young_deg)
    cos_wenzel = roughness * np.cos(theta_young)
    cos_wenzel = np.clip(cos_wenzel, -1, 1)
    return np.degrees(np.arccos(cos_wenzel))

# 2. Capillary rise in peristome ridges
def capillary_rise(ridge_width_um, gamma=0.0728, theta=10, rho=998, g=9.81):
    """Height water rises in a groove of given width."""
    w = ridge_width_um * 1e-6  # convert to meters
    theta_rad = np.radians(theta)
    h = 2 * gamma * np.cos(theta_rad) / (rho * g * w)
    return h * 1e3  # return in mm

# 3. Friction model: insect foot on wet vs dry surface
def friction_coefficient(water_film_um, mu_dry=0.8, mu_wet_min=0.05):
    """Friction drops exponentially with water film thickness."""
    # Transition from dry to wet friction
    transition = 5  # micrometers for full transition
    mu = mu_wet_min + (mu_dry - mu_wet_min) * np.exp(-water_film_um / transition)
    return mu

# Generate plots
fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Surface Physics of the Pitcher Plant Trap', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: Wenzel model — roughness vs contact angle
roughness = np.linspace(1, 5, 200)
for theta_y, color, label in [(80, '#3b82f6', 'Hydrophobic (80°)'),
                                (60, '#f59e0b', 'Moderate (60°)'),
                                (40, '#22c55e', 'Hydrophilic (40°)'),
                                (20, '#ef4444', 'Very hydrophilic (20°)')]:
    angles = wenzel_contact_angle(theta_y, roughness)
    axes[0, 0].plot(roughness, angles, color=color, linewidth=2, label=label)
axes[0, 0].axhline(0, color='white', linestyle='--', alpha=0.3, label='Superhydrophilic')
axes[0, 0].set_xlabel('Surface roughness ratio', color='white')
axes[0, 0].set_ylabel('Effective contact angle (°)', color='white')
axes[0, 0].set_title('Wenzel model: roughness amplifies wetting', color='white', fontsize=10)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: Capillary rise in ridges
widths = np.linspace(1, 100, 200)  # micrometers
heights = [capillary_rise(w) for w in widths]
axes[0, 1].plot(widths, heights, color='#3b82f6', linewidth=2.5)
axes[0, 1].axhspan(0, 5, alpha=0.1, color='#22c55e', label='Rim coverage zone')
axes[0, 1].set_xlabel('Ridge width (um)', color='white')
axes[0, 1].set_ylabel('Capillary rise (mm)', color='white')
axes[0, 1].set_title('Water rise in peristome grooves', color='white', fontsize=10)
axes[0, 1].set_yscale('log')
axes[0, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3: Friction coefficient vs water film
film_thickness = np.linspace(0, 50, 200)
mu = friction_coefficient(film_thickness)
axes[0, 2].plot(film_thickness, mu, color='#ef4444', linewidth=2.5)
axes[0, 2].axhline(0.3, color='#f59e0b', linestyle='--', alpha=0.7, label='Min for insect grip')
axes[0, 2].fill_between(film_thickness, mu, 0.3, where=(mu < 0.3),
                          alpha=0.2, color='#ef4444', label='Slip zone')
axes[0, 2].set_xlabel('Water film thickness (um)', color='white')
axes[0, 2].set_ylabel('Friction coefficient', color='white')
axes[0, 2].set_title('Insect friction on wet peristome', color='white', fontsize=10)
axes[0, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4: Contact angle visualization
theta_vals = [90, 60, 30, 5]  # degrees
for i, theta in enumerate(theta_vals):
    # Draw droplet cross-section
    t = np.linspace(0, np.pi, 100)
    r = 1
    x = r * np.cos(t)
    # Adjust y based on contact angle
    y = r * np.sin(t) * np.sin(np.radians(theta))
    x_shift = i * 3
    axes[1, 0].plot(x + x_shift, y, color=['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][i], linewidth=2)
    axes[1, 0].plot([x[0]+x_shift, x[-1]+x_shift], [0, 0], color='gray', linewidth=1)
    axes[1, 0].text(x_shift, -0.3, f'{theta}°', color='white', ha='center', fontsize=10, fontweight='bold')
axes[1, 0].set_xlim(-2, 11)
axes[1, 0].set_ylim(-0.5, 1.2)
axes[1, 0].set_title('Contact angle shapes', color='white', fontsize=10)
axes[1, 0].set_aspect('equal')
axes[1, 0].axis('off')

# 5: Humidity effect on trap success
humidity = np.linspace(20, 100, 200)
# Water film thickness depends on humidity
film = np.where(humidity < 60, 0.1 * humidity / 60,
        np.where(humidity < 85, 0.1 + 10 * (humidity - 60) / 25,
                 10 + 30 * (humidity - 85) / 15))
success_rate = 1 - friction_coefficient(film) / 0.8  # fraction that slip
success_rate = np.clip(success_rate, 0, 1)

axes[1, 1].plot(humidity, success_rate * 100, color='#a855f7', linewidth=2.5)
axes[1, 1].fill_between(humidity, success_rate * 100, alpha=0.15, color='#a855f7')
axes[1, 1].axvline(80, color='#22c55e', linestyle='--', alpha=0.5, label='Meghalaya avg')
axes[1, 1].set_xlabel('Relative humidity (%)', color='white')
axes[1, 1].set_ylabel('Trap success rate (%)', color='white')
axes[1, 1].set_title('Humidity controls trap effectiveness', color='white', fontsize=10)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6: Force balance on insect
insect_mass_mg = np.linspace(0.1, 50, 200)
gravity_force = insect_mass_mg * 1e-6 * 9.81 * 1000  # mN
adhesion_dry = 0.8 * gravity_force  # friction * normal force on slope
adhesion_wet = 0.05 * gravity_force

axes[1, 2].plot(insect_mass_mg, gravity_force, color='#ef4444', linewidth=2, label='Gravity (slope)')
axes[1, 2].plot(insect_mass_mg, adhesion_dry, color='#22c55e', linewidth=2, label='Grip (dry)')
axes[1, 2].plot(insect_mass_mg, adhesion_wet, color='#3b82f6', linewidth=2, label='Grip (wet)')
axes[1, 2].fill_between(insect_mass_mg, adhesion_wet, gravity_force, alpha=0.1, color='#ef4444')
axes[1, 2].set_xlabel('Insect mass (mg)', color='white')
axes[1, 2].set_ylabel('Force (mN)', color='white')
axes[1, 2].set_title('Force balance: gravity vs grip', color='white', fontsize=10)
axes[1, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Trap physics summary:")
print(f"  Dry peristome friction: {friction_coefficient(0):.2f}")
print(f"  Wet peristome friction (10um film): {friction_coefficient(10):.2f}")
print(f"  Friction reduction: {(1-friction_coefficient(10)/friction_coefficient(0))*100:.0f}%")
print(f"  Capillary rise in 10um groove: {capillary_rise(10):.1f} mm")
print(f"  At 80% humidity: ~{success_rate[np.argmin(np.abs(humidity-80))]*100:.0f}% trap success")`,
      challenge: 'Model what happens when the pitcher plant is tilted at different angles (0-90 degrees). How does the critical friction coefficient change with slope angle? At what angle does even a dry rim become a trap?',
      successHint: 'The pitcher plant has evolved a surface that exploits fundamental physics: capillary action keeps the rim wet, and the water film eliminates the friction that insects need for locomotion. It is passive, energy-free, and devastatingly effective.',
    },
    {
      title: 'Evolutionary convergence — independent origins of traps',
      concept: `One of the most compelling arguments for natural selection is **convergent evolution**: the independent evolution of similar traits in unrelated lineages. Carnivorous plants are a textbook example — at least **12 separate lineages** evolved carnivory independently.

The five major trap types arose multiple times:
- **Pitfall traps**: evolved in Nepenthes (Asia), Sarracenia (N. America), Cephalotus (Australia), and Heliamphora (S. America) — four independent origins on four continents
- **Flypaper traps**: Drosera (worldwide), Pinguicula (N. hemisphere), Byblis (Australia) — at least three origins
- **Snap traps**: Only in Dionaea (Venus flytrap) and Aldrovanda (waterwheel plant) — likely one origin
- **Bladder traps**: Only in Utricularia (bladderworts) — one origin, but spectacularly successful (230+ species)
- **Lobster-pot traps**: Genlisea (corkscrew plants) — one origin

**Why convergence?** When different lineages face the same selective pressure (nitrogen-poor soil) and have the same raw material (modified leaves), they arrive at similar solutions. The physics of trapping small prey constrains the design space — there are only so many ways to catch an insect with a leaf.

Molecular phylogenetics shows that carnivory evolved at different times: Nepenthes ~70 million years ago, Drosera ~85 million years ago, Sarracenia ~45 million years ago. Each lineage independently "discovered" the same strategy.`,
      analogy: 'Convergent evolution is like different civilizations independently inventing the wheel. The Sumerians, Chinese, and Mesoamericans all faced the same problem (moving heavy objects) with the same physical constraints (friction, gravity). They arrived at the same solution (a round disc on an axle) not because they copied each other, but because the problem has a limited number of good solutions. Carnivorous traps are the "wheels" of the plant kingdom.',
      storyConnection: 'Northeast India hosts carnivorous plants from multiple independent lineages: Nepenthes pitcher plants, Drosera sundews, Utricularia bladderworts, and Pinguicula butterworts. All evolved carnivory separately but coexist in the same Meghalaya bogs. Walking through a single hectare of Khasi Hills peatland, you are witnessing four independent evolutionary experiments that converged on the same survival strategy.',
      checkQuestion: 'If pitfall traps evolved independently four times, does this mean the genetic changes are the same in all four lineages?',
      checkAnswer: 'No. Convergent evolution means similar phenotypes (physical traits), not similar genotypes (DNA changes). Each lineage used different genetic pathways to build superficially similar traps. Nepenthes uses different genes to produce its pitcher than Sarracenia does. However, some "toolkit" genes (like those for digestive enzymes) show parallel molecular evolution — similar amino acid changes in similar genes, suggesting the available genetic paths are also constrained.',
      codeIntro: 'Build a phylogenetic analysis showing the independent origins of carnivory across plant lineages.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Phylogenetic convergence analysis
# Simplified plant phylogeny with carnivorous lineages marked

# Define lineages with divergence times (million years ago)
lineages = {
    'Nepenthales': {'trap': 'Pitfall', 'origin_mya': 70, 'species': 170, 'continent': 'Asia',
                     'color': '#ef4444'},
    'Sarraceniaceae': {'trap': 'Pitfall', 'origin_mya': 45, 'species': 35, 'continent': 'N. America',
                        'color': '#f59e0b'},
    'Cephalotaceae': {'trap': 'Pitfall', 'origin_mya': 55, 'species': 1, 'continent': 'Australia',
                       'color': '#22c55e'},
    'Droseraceae': {'trap': 'Flypaper', 'origin_mya': 85, 'species': 250, 'continent': 'Global',
                     'color': '#3b82f6'},
    'Lentibulariaceae': {'trap': 'Bladder/Lobster', 'origin_mya': 40, 'species': 360, 'continent': 'Global',
                          'color': '#a855f7'},
    'Dionaea': {'trap': 'Snap', 'origin_mya': 60, 'species': 2, 'continent': 'N. America',
                 'color': '#ec4899'},
    'Byblidaceae': {'trap': 'Flypaper', 'origin_mya': 50, 'species': 8, 'continent': 'Australia',
                     'color': '#06b6d4'},
    'Pinguicula': {'trap': 'Flypaper', 'origin_mya': 35, 'species': 100, 'continent': 'N. Hemisphere',
                    'color': '#84cc16'},
    'Heliamphora': {'trap': 'Pitfall', 'origin_mya': 25, 'species': 23, 'continent': 'S. America',
                     'color': '#fb923c'},
    'Roridulaceae': {'trap': 'Flypaper*', 'origin_mya': 65, 'species': 2, 'continent': 'Africa',
                      'color': '#64748b'},
}

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Convergent Evolution of Carnivorous Plants', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: Timeline of carnivory origins
names = list(lineages.keys())
origins = [lineages[n]['origin_mya'] for n in names]
colors = [lineages[n]['color'] for n in names]
sorted_idx = np.argsort(origins)[::-1]

for i, idx in enumerate(sorted_idx):
    name = names[idx]
    d = lineages[name]
    axes[0, 0].barh(i, d['origin_mya'], color=d['color'], alpha=0.8, height=0.7)
    axes[0, 0].text(d['origin_mya'] + 1, i, f"{d['trap']}", color='white', fontsize=7, va='center')
axes[0, 0].set_yticks(range(len(names)))
axes[0, 0].set_yticklabels([names[i] for i in sorted_idx], fontsize=8, color='white')
axes[0, 0].set_xlabel('Origin (million years ago)', color='white')
axes[0, 0].set_title('Independent origins of carnivory', color='white', fontsize=10)
axes[0, 0].invert_xaxis()

# 2: Species count by trap type
trap_types = {}
for name, d in lineages.items():
    trap = d['trap'].split('*')[0].split('/')[0]
    if trap not in trap_types:
        trap_types[trap] = {'species': 0, 'origins': 0, 'colors': []}
    trap_types[trap]['species'] += d['species']
    trap_types[trap]['origins'] += 1
    trap_types[trap]['colors'].append(d['color'])

trap_names = list(trap_types.keys())
species_counts = [trap_types[t]['species'] for t in trap_names]
origin_counts = [trap_types[t]['origins'] for t in trap_names]
trap_colors = ['#ef4444', '#3b82f6', '#a855f7', '#ec4899', '#64748b']

axes[0, 1].bar(trap_names, species_counts, color=trap_colors[:len(trap_names)], alpha=0.8)
for i, (s, o) in enumerate(zip(species_counts, origin_counts)):
    axes[0, 1].text(i, s + 10, f'{o} origins', ha='center', color='white', fontsize=8, fontweight='bold')
axes[0, 1].set_ylabel('Number of species', color='white')
axes[0, 1].set_title('Species diversity by trap type', color='white', fontsize=10)
axes[0, 1].tick_params(axis='x', labelsize=8)

# 3: Geographic distribution
continents = {}
for name, d in lineages.items():
    c = d['continent']
    if c not in continents:
        continents[c] = 0
    continents[c] += d['species']
cont_names = list(continents.keys())
cont_counts = list(continents.values())
axes[0, 2].pie(cont_counts, labels=cont_names, autopct='%1.0f%%',
                colors=['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'],
                textprops={'color': 'white', 'fontsize': 8})
axes[0, 2].set_title('Geographic distribution', color='white', fontsize=10)

# 4: Convergence matrix (which trait combinations evolved independently)
traits = ['Pitfall', 'Flypaper', 'Snap', 'Bladder', 'Lobster']
convergence_matrix = np.array([
    [4, 0, 0, 0, 0],  # Pitfall: 4 independent origins
    [0, 3, 0, 0, 0],  # Flypaper: 3 origins
    [0, 0, 1, 0, 0],  # Snap: 1 origin
    [0, 0, 0, 1, 0],  # Bladder: 1 origin
    [0, 0, 0, 0, 1],  # Lobster: 1 origin
])
im = axes[1, 0].imshow(convergence_matrix, cmap='YlOrRd', aspect='auto')
axes[1, 0].set_xticks(range(5))
axes[1, 0].set_xticklabels(traits, fontsize=8, color='white', rotation=45)
axes[1, 0].set_yticks(range(5))
axes[1, 0].set_yticklabels(traits, fontsize=8, color='white')
axes[1, 0].set_title('Independent origins per trap type', color='white', fontsize=10)
for i in range(5):
    for j in range(5):
        if convergence_matrix[i, j] > 0:
            axes[1, 0].text(j, i, str(convergence_matrix[i, j]), ha='center', va='center',
                            color='white', fontsize=14, fontweight='bold')

# 5: Species richness vs origin age
ages = [lineages[n]['origin_mya'] for n in names]
spp = [lineages[n]['species'] for n in names]
for i, name in enumerate(names):
    axes[1, 1].scatter(ages[i], spp[i], color=lineages[name]['color'], s=100,
                        edgecolors='white', linewidth=0.5, zorder=5)
    axes[1, 1].annotate(name[:8], (ages[i], spp[i]), fontsize=6, color='white',
                          xytext=(5, 5), textcoords='offset points')
axes[1, 1].set_xlabel('Origin (mya)', color='white')
axes[1, 1].set_ylabel('Species count', color='white')
axes[1, 1].set_title('Age vs diversity', color='white', fontsize=10)
axes[1, 1].set_yscale('log')

# 6: Trap effectiveness comparison
trap_data = {
    'Pitfall': {'capture_rate': 0.7, 'size_range': (2, 30), 'energy_cost': 0.4},
    'Flypaper': {'capture_rate': 0.5, 'size_range': (0.5, 5), 'energy_cost': 0.6},
    'Snap': {'capture_rate': 0.9, 'size_range': (3, 15), 'energy_cost': 0.8},
    'Bladder': {'capture_rate': 0.8, 'size_range': (0.1, 2), 'energy_cost': 0.3},
}
x_pos = np.arange(len(trap_data))
trap_n = list(trap_data.keys())
rates = [trap_data[t]['capture_rate'] for t in trap_n]
costs = [trap_data[t]['energy_cost'] for t in trap_n]
efficiency = [r / c for r, c in zip(rates, costs)]

axes[1, 2].bar(x_pos - 0.15, rates, 0.25, color='#22c55e', label='Capture rate', alpha=0.8)
axes[1, 2].bar(x_pos + 0.15, costs, 0.25, color='#ef4444', label='Energy cost', alpha=0.8)
axes[1, 2].plot(x_pos, efficiency, 'wo-', linewidth=2, markersize=8, label='Efficiency (rate/cost)')
axes[1, 2].set_xticks(x_pos)
axes[1, 2].set_xticklabels(trap_n, fontsize=9, color='white')
axes[1, 2].set_ylabel('Score (0-1 or ratio)', color='white')
axes[1, 2].set_title('Trap performance comparison', color='white', fontsize=10)
axes[1, 2].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Convergent evolution summary:")
print(f"  Total independent origins of carnivory: ~12")
print(f"  Total species: {sum(d['species'] for d in lineages.values())}")
print(f"  Most successful: Bladder traps ({lineages['Lentibulariaceae']['species']} species from 1 origin)")
print(f"  Most convergent: Pitfall traps (4 independent origins)")
print(f"  Oldest lineage: Droseraceae ({lineages['Droseraceae']['origin_mya']} mya)")`,
      challenge: 'Calculate the "evolutionary rate" for each lineage: species / million years since origin. Which lineage has diversified fastest? Does trap type predict diversification rate?',
      successHint: 'Convergent evolution is one of the strongest pieces of evidence for natural selection. When the same solution evolves independently multiple times, it strongly suggests that the solution is adaptive — not accidental.',
    },
    {
      title: 'Ecological niche theory — where pitcher plants fit',
      concept: `Every species occupies an **ecological niche** — the set of environmental conditions and resources it needs to survive and reproduce. The niche concept was formalized by G. Evelyn Hutchinson as an **n-dimensional hypervolume**: each axis represents an environmental variable (temperature, moisture, pH, light, nitrogen, etc.), and the niche is the region of this space where the species can persist.

**Fundamental niche**: the full range of conditions a species can tolerate in the absence of competition and predation.
**Realized niche**: the subset of the fundamental niche actually occupied, reduced by competition, predation, and dispersal limitations.

Pitcher plants occupy a narrow niche defined by:
- **Low nitrogen**: < 5 mg N/kg soil (carnivory only pays off below this threshold)
- **High moisture**: > 70% soil saturation year-round (trap mechanism requires humidity)
- **Acidic pH**: 3.0-5.5 (bogs and peat)
- **High light**: open or semi-open canopy (pitcher plants are poor shade competitors)
- **Moderate temperature**: 15-35C growing season

**Competitive exclusion principle** (Gause): two species with identical niches cannot coexist indefinitely — one will outcompete the other. Pitcher plants coexist with sundews because they partition the niche: pitchers capture flying insects, sundews capture crawling insects. Different trap types = different prey spectra = niche partitioning.

**Niche width** varies: generalist species have wide niches (tolerate many conditions), specialists have narrow niches. Pitcher plants are specialists — highly adapted to a narrow set of conditions but dominant within that niche.`,
      analogy: 'An ecological niche is like a job description. A "generalist" job description says "can work anywhere, any hours, any task." A "specialist" job description says "must work in a specific clean room, using specific tools, between 6am-2pm." The specialist is less flexible but dominates their domain. Pitcher plants have a very specific job description: nutrient-poor, wet, acidic, sunny. In that niche, they outperform all non-carnivorous competitors.',
      storyConnection: 'The Khasi Hills of Meghalaya provide a perfect pitcher plant niche: quartzite-derived acidic soils, 11,000+ mm rainfall, open grasslands above 1,200m elevation, and year-round mild temperatures. Remove any one of these conditions — drain the bogs, shade the canopy, add fertilizer — and pitcher plants disappear. Their niche is specific, and Meghalaya\'s unique geography provides it.',
      checkQuestion: 'If you added nitrogen fertilizer to a pitcher plant bog, what would happen to the pitcher plant population over 5-10 years? Think through the mechanism step by step.',
      checkAnswer: 'Step 1: Added nitrogen removes the competitive advantage of carnivory. Step 2: Non-carnivorous plants (grasses, sedges) can now grow in the formerly nitrogen-poor soil. Step 3: These faster-growing plants shade out the pitcher plants, which are poor shade competitors. Step 4: Pitcher plants decline because they invest metabolic energy in traps that no longer provide an advantage, while competitors invest that energy in height and leaf area. Step 5: Within 5-10 years, the pitcher plant population crashes. This has been demonstrated experimentally in bog fertilization studies.',
      codeIntro: 'Model the ecological niche of pitcher plants as a multidimensional space and simulate competitive exclusion under changing conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Ecological niche modeling

# Define species fitness as a function of environmental conditions
def pitcher_fitness(nitrogen, moisture, ph, light):
    """Pitcher plant fitness (0-1) as function of environment."""
    # Low nitrogen specialist
    f_n = np.exp(-((nitrogen - 3) / 4) ** 2)  # peaks at 3 mg/kg
    # High moisture required
    f_m = 1 / (1 + np.exp(-10 * (moisture - 0.65)))  # sigmoid, needs >0.65
    # Acidic pH specialist
    f_ph = np.exp(-((ph - 4.0) / 1.5) ** 2)  # peaks at pH 4
    # Moderate-high light
    f_l = light / (light + 300)  # saturating, needs good light
    return f_n * f_m * f_ph * f_l

def grass_fitness(nitrogen, moisture, ph, light):
    """Grass/sedge fitness — benefits from nitrogen."""
    f_n = nitrogen / (nitrogen + 15)  # benefits from more N
    f_m = np.exp(-((moisture - 0.5) / 0.3) ** 2)  # moderate moisture
    f_ph = np.exp(-((ph - 6.0) / 2.0) ** 2)  # near-neutral pH
    f_l = light / (light + 200)
    return f_n * f_m * f_ph * f_l

def sundew_fitness(nitrogen, moisture, ph, light):
    """Sundew (Drosera) — similar niche to pitcher but different prey."""
    f_n = np.exp(-((nitrogen - 4) / 5) ** 2)
    f_m = 1 / (1 + np.exp(-8 * (moisture - 0.6)))
    f_ph = np.exp(-((ph - 4.5) / 1.8) ** 2)
    f_l = light / (light + 250)
    return f_n * f_m * f_ph * f_l * 0.85  # slightly less competitive

# Generate niche plots
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Ecological Niche Analysis: Pitcher Plants', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: Nitrogen response comparison
n_range = np.linspace(0, 50, 200)
axes[0, 0].plot(n_range, [pitcher_fitness(n, 0.8, 4.0, 600) for n in n_range],
                 color='#ef4444', linewidth=2.5, label='Pitcher plant')
axes[0, 0].plot(n_range, [grass_fitness(n, 0.5, 6.0, 600) for n in n_range],
                 color='#22c55e', linewidth=2.5, label='Grass')
axes[0, 0].plot(n_range, [sundew_fitness(n, 0.8, 4.5, 600) for n in n_range],
                 color='#3b82f6', linewidth=2.5, label='Sundew')
axes[0, 0].axvline(5, color='#f59e0b', linestyle='--', alpha=0.7, label='Carnivory threshold')
axes[0, 0].set_xlabel('Soil nitrogen (mg/kg)', color='white')
axes[0, 0].set_ylabel('Fitness', color='white')
axes[0, 0].set_title('Nitrogen niche', color='white', fontsize=10)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: 2D niche (nitrogen x moisture)
n_grid = np.linspace(0, 40, 100)
m_grid = np.linspace(0, 1, 100)
N, M = np.meshgrid(n_grid, m_grid)
Z_pitcher = np.array([[pitcher_fitness(n, m, 4.0, 600) for n in n_grid] for m in m_grid])
Z_grass = np.array([[grass_fitness(n, m, 6.0, 600) for n in n_grid] for m in m_grid])

# Who wins at each point?
winner = np.where(Z_pitcher > Z_grass, 1, 2)  # 1=pitcher, 2=grass
axes[0, 1].contourf(N, M, winner, levels=[0.5, 1.5, 2.5], colors=['#ef4444', '#22c55e'], alpha=0.3)
axes[0, 1].contour(N, M, Z_pitcher, levels=[0.2, 0.5, 0.8], colors=['#ef4444'], linestyles='--')
axes[0, 1].contour(N, M, Z_grass, levels=[0.2, 0.5, 0.8], colors=['#22c55e'], linestyles='-')
axes[0, 1].set_xlabel('Soil nitrogen', color='white')
axes[0, 1].set_ylabel('Soil moisture', color='white')
axes[0, 1].set_title('Niche space (red=pitcher wins, green=grass)', color='white', fontsize=10)

# 3: Competition simulation over time
years = 50
dt_year = 1
pop_pitcher = np.zeros(years)
pop_grass = np.zeros(years)
pop_sundew = np.zeros(years)
soil_nitrogen = np.zeros(years)

pop_pitcher[0] = 50
pop_grass[0] = 10
pop_sundew[0] = 30
soil_nitrogen[0] = 3  # naturally low

for y in range(1, years):
    n = soil_nitrogen[y-1]
    # Fitness determines reproduction rate
    fp = pitcher_fitness(n, 0.8, 4.0, 600)
    fg = grass_fitness(n, 0.8, 6.0, 600)
    fs = sundew_fitness(n, 0.8, 4.5, 600)

    # Lotka-Volterra competition
    K = 100  # carrying capacity
    total = pop_pitcher[y-1] + pop_grass[y-1] + pop_sundew[y-1]

    pop_pitcher[y] = pop_pitcher[y-1] * (1 + 0.3 * fp * (1 - total/K))
    pop_grass[y] = pop_grass[y-1] * (1 + 0.4 * fg * (1 - total/K))
    pop_sundew[y] = pop_sundew[y-1] * (1 + 0.25 * fs * (1 - total/K))

    # Clamp
    pop_pitcher[y] = max(0, pop_pitcher[y])
    pop_grass[y] = max(0, pop_grass[y])
    pop_sundew[y] = max(0, pop_sundew[y])

    # Soil nitrogen stays low naturally
    soil_nitrogen[y] = 3 + np.random.randn() * 0.5

axes[0, 2].plot(range(years), pop_pitcher, color='#ef4444', linewidth=2, label='Pitcher')
axes[0, 2].plot(range(years), pop_grass, color='#22c55e', linewidth=2, label='Grass')
axes[0, 2].plot(range(years), pop_sundew, color='#3b82f6', linewidth=2, label='Sundew')
axes[0, 2].set_xlabel('Years', color='white')
axes[0, 2].set_ylabel('Population', color='white')
axes[0, 2].set_title('Natural conditions (low N)', color='white', fontsize=10)
axes[0, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4: Same competition but with fertilization at year 15
pop_p2 = np.zeros(years); pop_g2 = np.zeros(years); pop_s2 = np.zeros(years); soil_n2 = np.zeros(years)
pop_p2[0] = 50; pop_g2[0] = 10; pop_s2[0] = 30; soil_n2[0] = 3

for y in range(1, years):
    # Fertilization event at year 15
    n = soil_n2[y-1]
    if y >= 15:
        n = 25 + np.random.randn() * 2  # high N from fertilizer

    fp = pitcher_fitness(n, 0.8, 4.0, 600)
    fg = grass_fitness(n, 0.8, 6.0, 600)
    fs = sundew_fitness(n, 0.8, 4.5, 600)

    K = 100
    total = pop_p2[y-1] + pop_g2[y-1] + pop_s2[y-1]
    pop_p2[y] = max(0, pop_p2[y-1] * (1 + 0.3 * fp * (1 - total/K)))
    pop_g2[y] = max(0, pop_g2[y-1] * (1 + 0.4 * fg * (1 - total/K)))
    pop_s2[y] = max(0, pop_s2[y-1] * (1 + 0.25 * fs * (1 - total/K)))
    soil_n2[y] = n

axes[1, 0].plot(range(years), pop_p2, color='#ef4444', linewidth=2, label='Pitcher')
axes[1, 0].plot(range(years), pop_g2, color='#22c55e', linewidth=2, label='Grass')
axes[1, 0].plot(range(years), pop_s2, color='#3b82f6', linewidth=2, label='Sundew')
axes[1, 0].axvline(15, color='#f59e0b', linestyle='--', linewidth=2, label='Fertilization')
axes[1, 0].set_xlabel('Years', color='white')
axes[1, 0].set_ylabel('Population', color='white')
axes[1, 0].set_title('With nitrogen fertilization at year 15', color='white', fontsize=10)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5: Niche width comparison
env_gradient = np.linspace(0, 10, 200)
specialist = np.exp(-((env_gradient - 3) / 1.0) ** 2)
generalist = np.exp(-((env_gradient - 5) / 3.0) ** 2)
axes[1, 1].plot(env_gradient, specialist, color='#ef4444', linewidth=2.5, label='Specialist (pitcher)')
axes[1, 1].plot(env_gradient, generalist, color='#22c55e', linewidth=2.5, label='Generalist (grass)')
axes[1, 1].fill_between(env_gradient, specialist, alpha=0.15, color='#ef4444')
axes[1, 1].fill_between(env_gradient, generalist, alpha=0.15, color='#22c55e')
axes[1, 1].set_xlabel('Environmental gradient', color='white')
axes[1, 1].set_ylabel('Performance', color='white')
axes[1, 1].set_title('Niche width: specialist vs generalist', color='white', fontsize=10)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6: Multidimensional niche summary
dims = ['Nitrogen\\n(low)', 'Moisture\\n(high)', 'pH\\n(acidic)', 'Light\\n(high)', 'Prey\\n(insects)']
pitcher_scores = [0.9, 0.85, 0.8, 0.7, 0.9]
sundew_scores = [0.8, 0.8, 0.75, 0.65, 0.7]
grass_scores = [0.3, 0.5, 0.4, 0.6, 0]

x = np.arange(len(dims))
axes[1, 2].bar(x - 0.25, pitcher_scores, 0.22, color='#ef4444', label='Pitcher', alpha=0.8)
axes[1, 2].bar(x, sundew_scores, 0.22, color='#3b82f6', label='Sundew', alpha=0.8)
axes[1, 2].bar(x + 0.25, grass_scores, 0.22, color='#22c55e', label='Grass', alpha=0.8)
axes[1, 2].set_xticks(x)
axes[1, 2].set_xticklabels(dims, fontsize=8, color='white')
axes[1, 2].set_ylabel('Niche suitability', color='white')
axes[1, 2].set_title('Multidimensional niche profile', color='white', fontsize=10)
axes[1, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Competition outcomes:")
print(f"  Natural (low N): Pitcher dominates ({pop_pitcher[-1]:.0f} vs grass {pop_grass[-1]:.0f})")
print(f"  Fertilized (high N): Grass dominates ({pop_g2[-1]:.0f} vs pitcher {pop_p2[-1]:.0f})")
print(f"  Nitrogen addition eliminates the pitcher plant's competitive advantage.")`,
      challenge: 'Add a climate change scenario: moisture drops by 20% due to reduced rainfall. Run the competition model. Does drought hurt the pitcher plant or the grass more? Who wins under combined nitrogen addition + drought?',
      successHint: 'Niche theory explains not just where species live, but why they disappear when conditions change. The pitcher plant\'s narrow niche makes it vulnerable to any environmental shift — which is why these species are conservation priorities worldwide.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Carnivorous Plant Biology
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Adaptations, biochemistry & ecology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for biological modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
