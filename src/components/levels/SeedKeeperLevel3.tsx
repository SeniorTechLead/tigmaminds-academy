import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SeedKeeperLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Soil seed banks — the hidden reservoir of biodiversity',
      concept: `Beneath every forest floor and grassland lies an invisible army: the **soil seed bank** — millions of dormant seeds waiting for the right conditions to germinate. A single square meter of temperate soil can hold 2,000-50,000 viable seeds from dozens of species.

Soil seed banks are nature\'s insurance policy. When fire, flood, or drought kills the standing vegetation, the seed bank enables recovery. Seeds can persist in soil for years, decades, or even centuries depending on species and conditions.

**Seed bank types**:
- **Transient**: seeds persist less than 1 year (most trees, large-seeded species). These rely on annual seed rain for regeneration.
- **Short-term persistent**: 1-5 years (many grasses, herbs). Provides a buffer against a few bad years.
- **Long-term persistent**: 5-200+ years (many weeds, some legumes). Remarkable dormancy mechanisms.

**Depth distribution**: Most seeds are in the top 5 cm of soil. Burial by earthworms, tillage, or soil movement pushes seeds deeper. Deeper seeds are more protected from predation and temperature extremes but also less likely to receive the light or temperature signals needed for germination.

**Seed rain** is the continuous input from standing plants. Without seed rain, the bank depletes over time as seeds germinate, die, or are eaten. The balance between seed rain and depletion determines the bank's composition.`,
      analogy: 'A soil seed bank is like a savings account with automatic deposits (seed rain) and withdrawals (germination, death). The balance fluctuates with seasons. Some accounts (transient bank) are like checking accounts — always active but low balance. Others (persistent bank) are like a trust fund — locked away for decades, only accessible in emergencies.',
      storyConnection: 'The seed keeper in our story knew that the most important seeds were not the ones you could see — they were the ones buried in the earth, waiting. She knew that a field looked empty but held within it the memory of a thousand plants, ready to return when the time was right.',
      checkQuestion: 'A grassland has a seed bank of 10,000 seeds/m^2 with an annual depletion rate of 30% (from germination, decay, predation). If seed rain is 3,000 seeds/m^2/year, what is the equilibrium seed bank size? Is the bank growing or shrinking?',
      checkAnswer: 'At equilibrium: input = output. If bank size = N, then depletion = 0.30 * N, and rain = 3000. Equilibrium: 3000 = 0.30 * N, so N = 10,000. The bank is exactly at equilibrium! If seed rain decreases (e.g., from overgrazing), the bank shrinks. If it increases (e.g., after a good year), the bank grows. This simple dynamic equation governs the hidden biodiversity beneath our feet.',
      codeIntro: 'Model soil seed bank dynamics including seed rain, germination, mortality, and depth distribution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Seed bank dynamics model
class SeedBank:
    def __init__(self, species_data):
        """species_data: list of (name, initial_count, annual_rain, germ_rate, decay_rate, color)"""
        self.species = species_data
        self.n_species = len(species_data)

    def simulate(self, years, disturbance_year=None):
        """Simulate seed bank over time."""
        history = {sp[0]: [sp[1]] for sp in self.species}
        total_history = []

        for yr in range(years):
            total = 0
            for i, (name, _, rain, germ, decay, _) in enumerate(self.species):
                current = history[name][-1]
                # Seed rain (varies ±30% randomly)
                new_rain = rain * (1 + 0.3 * np.random.randn())
                # Germination (increases after disturbance)
                if disturbance_year and yr == disturbance_year:
                    germ_rate = min(germ * 5, 0.9)  # burst of germination
                else:
                    germ_rate = germ
                # Losses
                germinated = current * germ_rate
                decayed = current * decay
                predated = current * 0.05 * np.random.random()
                # Update
                new_count = max(0, current - germinated - decayed - predated + new_rain)
                history[name].append(new_count)
                total += new_count
            total_history.append(total)

        return history, total_history

# Define species with different persistence strategies
species = [
    ('Annual grass', 5000, 3000, 0.30, 0.10, '#22c55e'),      # transient
    ('Perennial herb', 3000, 1000, 0.10, 0.05, '#3b82f6'),     # short persistent
    ('Legume', 2000, 800, 0.05, 0.02, '#f59e0b'),              # long persistent
    ('Pioneer shrub', 1500, 500, 0.03, 0.01, '#a855f7'),       # very persistent
    ('Tree (sal)', 500, 200, 0.20, 0.15, '#ef4444'),           # transient (large seeds)
]

bank = SeedBank(species)
history, totals = bank.simulate(50)
history_dist, totals_dist = bank.simulate(50, disturbance_year=25)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Seed bank dynamics (no disturbance)
ax = axes[0, 0]
for name, _, _, _, _, color in species:
    ax.plot(history[name], color=color, linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Seeds per m²', color='white')
ax.set_title('Seed Bank Dynamics (stable)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: With disturbance at year 25
ax = axes[0, 1]
for name, _, _, _, _, color in species:
    ax.plot(history_dist[name], color=color, linewidth=2, label=name)
ax.axvline(25, color='white', linestyle='--', linewidth=1, label='Fire/clearing')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Seeds per m²', color='white')
ax.set_title('Seed Bank After Disturbance', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Depth distribution
ax = axes[0, 2]
depths = np.array([0, 1, 2, 3, 5, 8, 12, 20])  # cm
for name, init, _, _, _, color in species:
    # Exponential decrease with depth
    if 'tree' in name.lower() or 'sal' in name.lower():
        dist = init * np.exp(-0.8 * depths)  # large seeds stay near surface
    elif 'legume' in name.lower():
        dist = init * np.exp(-0.2 * depths)  # hard seeds penetrate deeper
    else:
        dist = init * np.exp(-0.4 * depths)
    ax.plot(dist, depths, color=color, linewidth=2, marker='o', markersize=4, label=name)
ax.set_xlabel('Seeds per m² per cm depth', color='white')
ax.set_ylabel('Soil depth (cm)', color='white')
ax.set_title('Vertical Seed Distribution', color='white', fontsize=11)
ax.invert_yaxis()
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Seed viability over time
ax = axes[1, 0]
years_viab = np.arange(0, 101)
viability_curves = {
    'Sal (1-2 years)': np.exp(-1.5 * years_viab),
    'Wheat (5-10 years)': np.exp(-0.15 * years_viab),
    'Lotus (100+ years)': np.exp(-0.005 * years_viab),
    'Legume (20-50 years)': np.exp(-0.03 * years_viab),
}
colors_viab = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']
for (name, viab), color in zip(viability_curves.items(), colors_viab):
    ax.plot(years_viab, viab * 100, color=color, linewidth=2, label=name)
ax.set_xlabel('Years in soil', color='white')
ax.set_ylabel('Viability (%)', color='white')
ax.set_title('Seed Longevity Curves', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Species composition pie
ax = axes[1, 1]
final_counts = [history[sp[0]][-1] for sp in species]
colors_pie = [sp[5] for sp in species]
names_pie = [sp[0] for sp in species]
ax.pie(final_counts, labels=names_pie, colors=colors_pie, autopct='%1.0f%%',
       textprops={'color': 'white', 'fontsize': 8})
ax.set_title('Seed Bank Composition (year 50)', color='white', fontsize=11)

# Plot 6: Recovery after disturbance
ax = axes[1, 2]
ax.plot(totals, color='#3b82f6', linewidth=2, label='Stable (no disturbance)')
ax.plot(totals_dist, color='#ef4444', linewidth=2, label='After fire at year 25')
ax.axvline(25, color='white', linestyle='--', linewidth=1, alpha=0.5)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Total seeds per m²', color='white')
ax.set_title('Total Seed Bank Recovery', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Soil Seed Bank Summary:")
print(f"  Total species modeled: {len(species)}")
print(f"  Equilibrium bank size: {sum(history[sp[0]][-1] for sp in species):.0f} seeds/m²")
print(f"  After disturbance, bank drops by {(1 - totals_dist[26]/totals_dist[24])*100:.0f}%")
print(f"  Recovery to 90% takes ~{next(i for i, t in enumerate(totals_dist[26:]) if t > 0.9*totals_dist[24])} years")
print(f"  Persistent species (legume, shrub) drive recovery")`,
      challenge: 'Model a worst case: fire at year 25, drought years 26-28 (seed rain drops 80%), and herbivore pressure (predation doubles). Which species survives? This is why persistent seed banks are essential for ecosystem resilience.',
      successHint: 'The soil seed bank is an invisible biodiversity reservoir. Seed keepers — both human and ecological — maintain this bank through careful stewardship. Understanding its dynamics is essential for restoration ecology.',
    },
    {
      title: 'Seed viability & longevity — the biochemistry of survival',
      concept: `A seed is a living time capsule — an embryo in suspended animation, surrounded by a food reserve, sealed in a protective coat. How long it remains viable depends on the biochemistry of deterioration.

**What kills seeds?**
1. **Oxidative damage**: even in dormancy, cellular respiration produces reactive oxygen species (ROS) that damage DNA, proteins, and membranes. Lower moisture and temperature slow respiration and thus ROS production.
2. **Maillard reactions**: sugars react with amino acids non-enzymatically, producing brown pigments and cross-linked proteins. This is the same chemistry that browns toast — but in seeds, it slowly destroys cellular machinery.
3. **Membrane degradation**: phospholipid membranes lose integrity over time. When a seed hydrates for germination, damaged membranes leak, and the seed cannot maintain cellular compartments.
4. **DNA damage**: cumulative mutations from background radiation and spontaneous depurination. If enough critical genes are damaged, the seed cannot germinate.

**Harrington's rule of thumb**: for every 5°C decrease in storage temperature OR every 1% decrease in seed moisture content, seed lifespan roughly doubles. This means:
- Seeds at 20°C, 10% moisture: lifespan X years
- Seeds at 15°C, 9% moisture: lifespan 4X years
- Seeds at 5°C, 7% moisture: lifespan 64X years

This is why the **Svalbard Global Seed Vault** stores seeds at -18°C and low moisture — extending viability by thousands of times.

The **viability equation** (Ellis & Roberts, 1980) formalizes this: log(p50) = KE - Cw*log(m) - Ch*T - Cq*T^2, where p50 is the time for viability to drop to 50%, m is moisture, T is temperature, and K/C are species-specific constants.`,
      analogy: 'Seed viability is like battery self-discharge. A battery stored in a cool, dry place retains its charge for years. Left in a hot, humid drawer, it dies in months. The chemistry is different, but the principle is the same: chemical reactions proceed slower at lower temperature and lower moisture, preserving the "charge" (viability).',
      storyConnection: 'The seed keeper understood something remarkable: the seeds she stored in the cool, dark corner of her granary lasted three times longer than those left in the sun. She did not know the biochemistry, but she knew the practice — and her practice was exactly what Harrington\'s rule predicts.',
      checkQuestion: 'A rice variety has p50 = 5 years at 25°C and 12% moisture. Using Harrington\'s rule (halving both temperature and moisture doubles lifespan), estimate p50 at 5°C and 6% moisture.',
      checkAnswer: 'Temperature drop: 25 to 5 = 20°C = 4 steps of 5°C, so 2^4 = 16x longer. Moisture drop: 12% to 6% = 6 steps of 1%, so 2^6 = 64x longer. Combined: 5 years * 16 * 64 = 5,120 years! This is why gene banks can store seeds for millennia. The real number is lower (Harrington\'s rule is approximate), but the principle holds — cold + dry = long-lived seeds.',
      codeIntro: 'Implement the seed viability equation and model how storage conditions affect longevity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Ellis-Roberts viability equation
# v(p) = Ki + (sigma_inverse) * probit(p)
# Where p50 = 10^(KE - Cw*log(m) - Ch*T - Cq*T^2)

def seed_viability(time_years, temp_c, moisture_pct, species_params):
    """Calculate fraction of seeds still viable."""
    KE, Cw, Ch, Cq = species_params
    log_sigma = KE - Cw * np.log10(moisture_pct) - Ch * temp_c - Cq * temp_c**2
    sigma = 10**log_sigma  # sigma is the time for viability to drop from 84% to 50%
    # Probit model: viability = Phi(Ki/sigma - t/sigma)
    Ki_over_sigma = 2.0  # initial quality parameter
    z = Ki_over_sigma - time_years / max(sigma, 0.01)
    # Approximate probit (normal CDF)
    from math import erf
    viability = 0.5 * (1 + erf(z / np.sqrt(2)))
    return np.clip(viability, 0, 1)

# Species parameters (approximate values from literature)
species_params = {
    'Rice':     (9.0, 4.5, 0.04, 0.00015),
    'Wheat':    (8.5, 4.0, 0.04, 0.00014),
    'Tomato':   (7.5, 3.8, 0.04, 0.00016),
    'Lettuce':  (6.0, 3.5, 0.05, 0.00020),
    'Onion':    (5.5, 3.0, 0.06, 0.00025),
    'Sacred lotus': (12.0, 5.0, 0.02, 0.00005),  # extraordinary longevity
}
species_colors = {
    'Rice': '#22c55e', 'Wheat': '#f59e0b', 'Tomato': '#ef4444',
    'Lettuce': '#3b82f6', 'Onion': '#a855f7', 'Sacred lotus': '#ec4899',
}

# Storage conditions to compare
conditions = [
    ('Room temp (25°C, 12%)', 25, 12),
    ('Cool dry (15°C, 8%)', 15, 8),
    ('Gene bank (5°C, 5%)', 5, 5),
    ('Svalbard (-18°C, 5%)', -18, 5),
]

times = np.linspace(0, 100, 500)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Viability curves for rice under different conditions
ax = axes[0, 0]
for cond_name, temp, moist in conditions:
    viab = [seed_viability(t, temp, moist, species_params['Rice']) for t in times]
    ax.plot(times, np.array(viab) * 100, linewidth=2, label=cond_name)
ax.axhline(50, color='gray', linestyle=':', alpha=0.5, label='50% viability')
ax.set_xlabel('Years in storage', color='white')
ax.set_ylabel('Viability (%)', color='white')
ax.set_title('Rice Seed Viability by Storage', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Species comparison at gene bank conditions
ax = axes[0, 1]
for sp_name, params in species_params.items():
    viab = [seed_viability(t, 5, 5, params) for t in times]
    ax.plot(times, np.array(viab) * 100, color=species_colors[sp_name],
            linewidth=2, label=sp_name)
ax.set_xlabel('Years in gene bank (5°C, 5%)', color='white')
ax.set_ylabel('Viability (%)', color='white')
ax.set_title('Species Comparison (Gene Bank)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Harrington's rule — temperature effect
ax = axes[0, 2]
temps = np.linspace(-20, 40, 100)
moisture = 8  # fixed
p50_by_temp = []
for t in temps:
    params = species_params['Rice']
    log_sigma = params[0] - params[1] * np.log10(moisture) - params[2] * t - params[3] * t**2
    p50_by_temp.append(10**log_sigma)
ax.semilogy(temps, p50_by_temp, color='#22c55e', linewidth=2)
ax.set_xlabel('Storage temperature (°C)', color='white')
ax.set_ylabel('p50 (years to 50% viability)', color='white')
ax.set_title("Harrington's Rule: Temperature", color='white', fontsize=11)
ax.axvline(-18, color='#3b82f6', linestyle='--', label='Svalbard (-18°C)')
ax.axvline(25, color='#ef4444', linestyle='--', label='Room temp (25°C)')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Moisture effect
ax = axes[1, 0]
moistures = np.linspace(3, 20, 100)
temp_fixed = 15  # fixed
p50_by_moist = []
for m in moistures:
    params = species_params['Rice']
    log_sigma = params[0] - params[1] * np.log10(m) - params[2] * temp_fixed - params[3] * temp_fixed**2
    p50_by_moist.append(10**log_sigma)
ax.semilogy(moistures, p50_by_moist, color='#3b82f6', linewidth=2)
ax.set_xlabel('Seed moisture content (%)', color='white')
ax.set_ylabel('p50 (years)', color='white')
ax.set_title("Harrington's Rule: Moisture", color='white', fontsize=11)

# Plot 5: Svalbard vault — how long will seeds last?
ax = axes[1, 1]
svalbard_times = np.linspace(0, 10000, 1000)
for sp_name in ['Rice', 'Wheat', 'Sacred lotus', 'Onion']:
    viab = [seed_viability(t, -18, 5, species_params[sp_name]) for t in svalbard_times]
    ax.plot(svalbard_times, np.array(viab) * 100, color=species_colors[sp_name],
            linewidth=2, label=sp_name)
ax.axhline(50, color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('Years in Svalbard vault', color='white')
ax.set_ylabel('Viability (%)', color='white')
ax.set_title('Svalbard Storage Projections', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: World seed vaults map (simplified as bar chart)
ax = axes[1, 2]
vaults = ['Svalbard\\\n(Norway)', 'NBPGR\\\n(India)', 'Fort Collins\\\n(USA)', 'Kunming\\\n(China)', 'Tsukuba\\\n(Japan)']
accessions = [1200000, 435000, 600000, 82000, 220000]
colors_vaults = ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#a855f7']
bars = ax.bar(vaults, np.array(accessions) / 1000, color=colors_vaults, edgecolor='none', width=0.6)
for bar, acc in zip(bars, accessions):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 10,
            f'{acc//1000}K', ha='center', color='white', fontsize=9)
ax.set_ylabel('Seed accessions (thousands)', color='white')
ax.set_title('Major Global Seed Banks', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Seed Viability Summary:")
for sp_name, params in species_params.items():
    p50_room = seed_viability(5, 25, 12, params)  # viability at 5 years room temp
    p50_vault = seed_viability(100, -18, 5, params)  # viability at 100 years Svalbard
    print(f"  {sp_name:15s}: 5yr room={p50_room*100:.0f}%, 100yr Svalbard={p50_vault*100:.0f}%")`,
      challenge: 'Model a scenario where a gene bank loses power and temperature rises from -18°C to 5°C for 6 months, then returns to -18°C. How much viability is lost during the outage? Which species are most affected?',
      successHint: 'Seed viability follows precise physical and chemical laws. Understanding these laws lets us predict how long seeds will last under any conditions — essential for designing seed banks that must safeguard genetic diversity for centuries.',
    },
    {
      title: 'Ex situ conservation — the Svalbard vault and humanity\'s backup plan',
      concept: `The **Svalbard Global Seed Vault** is humanity's ultimate insurance policy against crop loss. Built into a mountainside on a Norwegian arctic island, it stores backup copies of seeds from gene banks worldwide at -18°C in a permafrost environment.

Why Svalbard?
- **Geopolitically neutral**: Norway, stable democracy, international treaty
- **Permafrost**: even if the cooling system fails, natural permafrost keeps seeds at -3.5°C
- **Elevation**: 130m above sea level, safe from sea level rise
- **Remote**: minimal conflict or sabotage risk

The vault holds ~1.2 million seed samples representing ~6,000 crop species and wild relatives. It does NOT own the seeds — it is a safety deposit box. Each country owns its deposits and can withdraw them.

**Why ex situ conservation matters:**
- Wars destroy gene banks (Iraq, Syria, Afghanistan have all lost seed collections)
- Natural disasters hit (the Philippines' national gene bank was flooded by a typhoon)
- Funding gaps cause gene banks to deteriorate
- Climate change threatens in situ (field) conservation

The vault has already been used: In 2015, ICARDA (International Center for Agricultural Research in the Dry Areas) withdrew seeds from Svalbard after their Aleppo, Syria gene bank was destroyed in the civil war. Those seeds were regrown and re-deposited — the system worked exactly as designed.`,
      analogy: 'Svalbard is the "cloud backup" for Earth\'s agricultural diversity. Your local gene bank is your laptop — it might crash, get stolen, or be damaged. Svalbard is the offsite backup that survives even if everything else fails. Just like you should never rely on a single copy of your data, humanity should never rely on a single copy of its seeds.',
      storyConnection: 'The seed keeper in our story maintained a personal seed vault — clay pots sealed with wax, stored in the coolest corner of her home. She was doing ex situ conservation before the term existed, protecting her village\'s food security through the same principles that govern Svalbard.',
      checkQuestion: 'Svalbard stores seeds at -18°C. If the cooling fails, permafrost maintains -3.5°C. For a rice variety with p50 = 500 years at -18°C, what would p50 be at -3.5°C? (Use Harrington: each 5°C halves lifespan.)',
      checkAnswer: 'Temperature increase: -18 to -3.5 = 14.5°C ≈ 3 steps of 5°C. So lifespan halves 3 times: 500 / 2^3 = 500/8 = 62.5 years. Even without active cooling, the vault maintains rice viability for over 60 years — enough time to repair the system. This redundancy is what makes Svalbard so robust.',
      codeIntro: 'Model the Svalbard vault: coverage analysis, failure scenarios, and the global conservation network.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Global crop diversity model
# Each crop has: (name, total_varieties, in_gene_banks, in_svalbard, at_risk, color)
crops = [
    ('Rice', 120000, 80000, 230000, 40000, '#22c55e'),
    ('Wheat', 100000, 70000, 150000, 30000, '#f59e0b'),
    ('Maize', 50000, 35000, 30000, 15000, '#ef4444'),
    ('Soybean', 30000, 20000, 20000, 10000, '#3b82f6'),
    ('Potato', 8000, 5000, 8000, 3000, '#a855f7'),
    ('Sorghum', 45000, 30000, 50000, 15000, '#ec4899'),
    ('Pearl millet', 30000, 15000, 10000, 15000, '#14b8a6'),
    ('Chickpea', 20000, 12000, 15000, 8000, '#6b7280'),
]

# Failure scenario simulation
def simulate_gene_bank_network(n_banks, n_samples, redundancy, annual_risk, years):
    """Simulate gene bank network with random disasters."""
    # Each sample stored in 'redundancy' different banks
    banks = list(range(n_banks))
    sample_locations = {}
    for s in range(n_samples):
        locs = set(np.random.choice(banks, min(redundancy, n_banks), replace=False))
        sample_locations[s] = locs

    samples_lost = []
    banks_lost_total = set()

    for yr in range(years):
        # Random disasters: each bank has annual_risk of being destroyed
        for b in banks:
            if b not in banks_lost_total and np.random.random() < annual_risk:
                banks_lost_total.add(b)
                # Remove this bank from all samples
                for s in sample_locations:
                    sample_locations[s].discard(b)

        # Count samples with zero copies remaining
        lost_this_year = sum(1 for s in sample_locations if len(sample_locations[s]) == 0)
        samples_lost.append(lost_this_year)

    return samples_lost, len(banks_lost_total)

# Run scenarios
n_banks = 30
n_samples = 50000
annual_risk = 0.01  # 1% chance per year per bank

scenarios_redundancy = [1, 2, 3, 5]
all_losses = {}
for r in scenarios_redundancy:
    losses = []
    for _ in range(10):  # multiple trials
        l, _ = simulate_gene_bank_network(n_banks, n_samples, r, annual_risk, 100)
        losses.append(l[-1])
    all_losses[r] = np.mean(losses)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Crop diversity coverage
ax = axes[0, 0]
names = [c[0] for c in crops]
in_banks = [c[2] for c in crops]
in_svalbard_vals = [c[3] for c in crops]
at_risk_vals = [c[4] for c in crops]
x = np.arange(len(names))
width = 0.25
ax.bar(x - width, np.array(in_banks) / 1000, width, color='#3b82f6', label='In gene banks')
ax.bar(x, np.array(in_svalbard_vals) / 1000, width, color='#22c55e', label='In Svalbard')
ax.bar(x + width, np.array(at_risk_vals) / 1000, width, color='#ef4444', label='At risk')
ax.set_xticks(x)
ax.set_xticklabels(names, rotation=45, ha='right', color='white', fontsize=8)
ax.set_ylabel('Samples (thousands)', color='white')
ax.set_title('Global Crop Seed Conservation', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Redundancy vs loss
ax = axes[0, 1]
redundancies = list(all_losses.keys())
losses_vals = [all_losses[r] for r in redundancies]
ax.bar(redundancies, losses_vals, color='#ef4444', edgecolor='none', width=0.6)
for r, l in zip(redundancies, losses_vals):
    ax.text(r, l + 200, f'{l:.0f}', ha='center', color='white', fontsize=10)
ax.set_xlabel('Copies per sample (redundancy)', color='white')
ax.set_ylabel('Samples permanently lost (of 50K)', color='white')
ax.set_title('Redundancy Saves Diversity', color='white', fontsize=11)

# Plot 3: Timeline of real gene bank losses
ax = axes[0, 2]
events = [
    (2003, 'Iraq gene bank\\\nlooted', '#ef4444'),
    (2006, 'Philippines\\\nflood', '#f59e0b'),
    (2012, 'Syria (ICARDA)\\\ncivil war', '#ef4444'),
    (2015, 'Svalbard\\\nwithdrawal!', '#22c55e'),
    (2020, 'COVID disrupts\\\nmaintenance', '#a855f7'),
]
for yr, label, color in events:
    ax.plot(yr, 0.5, 'o', color=color, markersize=12)
    ax.annotate(label, (yr, 0.5), textcoords='offset points',
                xytext=(0, 20 if events.index((yr, label, color)) % 2 == 0 else -30),
                ha='center', color=color, fontsize=8,
                arrowprops=dict(arrowstyle='->', color=color))
ax.set_xlim(2000, 2025)
ax.set_ylim(0, 1)
ax.set_yticks([])
ax.set_xlabel('Year', color='white')
ax.set_title('Gene Bank Losses Timeline', color='white', fontsize=11)

# Plot 4: Svalbard vault capacity
ax = axes[1, 0]
years_deposit = np.arange(2008, 2026)
deposits = [300000, 400000, 500000, 600000, 700000, 750000, 800000, 850000,
            900000, 950000, 1000000, 1050000, 1100000, 1130000, 1150000, 1170000, 1190000, 1200000]
capacity = 4500000
ax.fill_between(years_deposit, deposits, color='#22c55e', alpha=0.3)
ax.plot(years_deposit, deposits, color='#22c55e', linewidth=2, label='Deposited')
ax.axhline(capacity, color='#f59e0b', linestyle='--', label=f'Capacity: {capacity/1e6:.1f}M')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Seed samples', color='white')
ax.set_title('Svalbard Vault Deposits', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Insurance value calculation
ax = axes[1, 1]
# Value of crop diversity: each variety worth potential yield improvement
variety_values = np.logspace(2, 7, 100)  # $100 to $10M per variety
n_varieties_saved = [50000 / max(v, 1) * 1e6 for v in variety_values]  # how many saved
insurance_value = variety_values * 50000 / 1e9  # total portfolio value in billions
ax.semilogx(variety_values, insurance_value, color='#f59e0b', linewidth=2)
ax.set_xlabel('Value per variety (USD)', color='white')
ax.set_ylabel('Total insurance value (B USD)', color='white')
ax.set_title('Insurance Value of Seed Vault', color='white', fontsize=11)
# Mark Svalbard operating cost
ax.axhline(0.05, color='#22c55e', linestyle='--', label='Annual operating cost ($50M)')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
text = """Svalbard Global Seed Vault
==============================

Location: Svalbard, Norway (78°N)
Temperature: -18°C (backup: -3.5°C permafrost)
Current deposits: ~1.2 million samples
Capacity: 4.5 million samples
Annual cost: ~$300K (incredibly cheap)

Critical role:
- Backup for 1,700+ gene banks worldwide
- Already used: Syria 2015 withdrawal
- Protects against war, climate, disaster

Without Svalbard and gene banks,
a single catastrophe could erase
thousands of years of crop breeding.

The seed keeper's clay pots scaled
to a global insurance system."""
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Ex situ conservation is humanity's backup plan for food security.")
print(f"With {n_banks} gene banks and redundancy of 3, we lose {all_losses[3]:.0f} of 50,000 samples")
print(f"With redundancy of 1, we lose {all_losses[1]:.0f} — that's why Svalbard exists.")`,
      challenge: 'Model climate change impact: permafrost at Svalbard is warming. If the backup temperature rises from -3.5°C to 0°C over 50 years, how does this affect the "cooling failure" safety margin? At what point does the vault need an engineering upgrade?',
      successHint: 'The Svalbard vault embodies a simple truth: redundancy saves diversity. Every seed keeper who stores backup seeds in a different location practices the same principle. Understanding the math of redundancy and viability is essential for designing systems that protect our food future.',
    },
    {
      title: 'Germination physiology — breaking dormancy',
      concept: `A viable seed does not automatically germinate — it must first break **dormancy**. Dormancy is an active state of suppressed germination controlled by hormones, seed coats, and environmental signals.

**Types of dormancy:**
1. **Physical dormancy**: hard, waterproof seed coat prevents water absorption. Common in legumes. Broken by scarification (mechanical damage), fire, or passage through animal guts.
2. **Physiological dormancy**: internal hormone balance (ABA/GA ratio) suppresses germination. ABA (abscisic acid) maintains dormancy; GA (gibberellic acid) promotes germination. Broken by cold stratification or after-ripening.
3. **Morphological dormancy**: embryo is underdeveloped at seed dispersal. Needs time at warm+moist conditions for embryo to grow.
4. **Combinational dormancy**: multiple types stacked. Requires sequential treatments.

**Germination requirements** (once dormancy is broken):
- **Water**: imbibition triggers metabolic restart. Seed absorbs 2-3x its dry weight.
- **Temperature**: optimal range species-specific. Too cold: enzymes inactive. Too hot: proteins denature.
- **Oxygen**: aerobic respiration needed for growth.
- **Light**: some seeds (positively photoblastic) need light; others (negatively photoblastic) germinate in darkness.

The **germination time course** follows a sigmoidal curve: slow start (imbibition), rapid phase (radicle emergence), then plateau (establishment). The time to 50% germination (T50) is a key viability metric.`,
      analogy: 'Seed dormancy is like a locked safe with a combination. Physical dormancy is a mechanical lock (needs a key/force). Physiological dormancy is an electronic lock (needs the right code/hormone signal). Combinational dormancy is a bank vault with both locks — you must crack them in the right order.',
      storyConnection: 'The seed keeper knew each seed\'s secret: this one needs a night in the cold before planting, that one needs its coat nicked with a knife, another must pass through a goat\'s belly first. She was an expert in dormancy-breaking — an empirical physiologist.',
      checkQuestion: 'A legume seed has physical dormancy (hard coat). You have 1000 seeds. Without treatment, 5% germinate (through natural cracks). After scarification (sandpaper treatment), 85% germinate. Why not 100%?',
      checkAnswer: 'The 15% that fail include: (1) seeds damaged too deeply by scarification (embryo injured), (2) seeds that were not viable to begin with (dead embryo, stored too long), (3) seeds with additional physiological dormancy that scarification does not address. No treatment achieves 100% because seed lots always contain some non-viable or multiply-dormant individuals.',
      codeIntro: 'Model germination kinetics: dormancy breaking, temperature response, and time-course curves.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def germination_curve(time_hours, T50, uniformity=0.2, max_germ=0.90):
    """Cumulative germination curve (sigmoid)."""
    # T50: time to 50% germination
    # uniformity: lower = more spread out germination
    b = 4 * uniformity / T50  # slope parameter
    return max_germ / (1 + np.exp(-b * (time_hours - T50)))

# Temperature response of germination
def temp_response(temp, T_base=5, T_opt=28, T_max=42):
    """Normalized germination rate as function of temperature."""
    if temp <= T_base or temp >= T_max:
        return 0.0
    if temp <= T_opt:
        return (temp - T_base) / (T_opt - T_base)
    else:
        return (T_max - temp) / (T_max - T_opt)

# Dormancy breaking model
def dormancy_fraction(treatment, seed_type='legume'):
    """Fraction of seeds with dormancy broken by treatment."""
    if seed_type == 'legume':  # physical dormancy
        responses = {
            'none': 0.05,
            'hot_water': 0.60,
            'scarification': 0.85,
            'acid': 0.75,
            'fire': 0.70,
        }
    elif seed_type == 'grass':  # physiological dormancy
        responses = {
            'none': 0.20,
            'cold_stratification_2wk': 0.50,
            'cold_stratification_6wk': 0.80,
            'gibberellic_acid': 0.85,
            'smoke_water': 0.70,
        }
    elif seed_type == 'tree':  # combinational
        responses = {
            'none': 0.02,
            'scarification': 0.30,
            'cold_stratification_6wk': 0.40,
            'scarif_then_cold': 0.75,
            'full_treatment': 0.88,
        }
    else:
        responses = {'none': 0.5}
    return responses.get(treatment, 0.1)

hours = np.linspace(0, 240, 500)  # 10 days

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Germination curves at different temperatures
ax = axes[0, 0]
for temp, color in [(10, '#3b82f6'), (20, '#22c55e'), (28, '#f59e0b'), (35, '#ef4444')]:
    rate = temp_response(temp)
    if rate > 0:
        T50 = 48 / rate  # faster germination at optimal temp
        germ = germination_curve(hours, T50, max_germ=0.90 * rate)
        ax.plot(hours, germ * 100, color=color, linewidth=2, label=f'{temp}°C (T50={T50:.0f}h)')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Germination (%)', color='white')
ax.set_title('Temperature Effect on Germination', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Temperature response curve
ax = axes[0, 1]
temps = np.linspace(0, 45, 200)
responses = [temp_response(t) for t in temps]
ax.plot(temps, responses, color='#22c55e', linewidth=2)
ax.fill_between(temps, responses, alpha=0.15, color='#22c55e')
ax.axvline(5, color='#3b82f6', linestyle=':', label='T_base (5°C)')
ax.axvline(28, color='#f59e0b', linestyle=':', label='T_opt (28°C)')
ax.axvline(42, color='#ef4444', linestyle=':', label='T_max (42°C)')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Relative germination rate', color='white')
ax.set_title('Thermal Germination Response', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Dormancy breaking treatments (legume)
ax = axes[0, 2]
treatments = ['None', 'Hot water', 'Scarification', 'Acid', 'Fire']
treatment_keys = ['none', 'hot_water', 'scarification', 'acid', 'fire']
fractions = [dormancy_fraction(t, 'legume') for t in treatment_keys]
colors_treat = ['#6b7280', '#ef4444', '#22c55e', '#f59e0b', '#a855f7']
bars = ax.bar(treatments, np.array(fractions) * 100, color=colors_treat, edgecolor='none', width=0.6)
for bar, f in zip(bars, fractions):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{f*100:.0f}%', ha='center', color='white', fontsize=10)
ax.set_ylabel('Germination (%)', color='white')
ax.set_title('Legume Dormancy Breaking', color='white', fontsize=11)

# Plot 4: Three seed types comparison
ax = axes[1, 0]
for seed_type, color, treatments_list in [
    ('legume', '#22c55e', ['none', 'hot_water', 'scarification']),
    ('grass', '#3b82f6', ['none', 'cold_stratification_2wk', 'cold_stratification_6wk']),
    ('tree', '#f59e0b', ['none', 'scarification', 'scarif_then_cold']),
]:
    for i, treat in enumerate(treatments_list):
        frac = dormancy_fraction(treat, seed_type)
        T50 = 72 / max(frac, 0.01)
        germ = germination_curve(hours, T50, max_germ=frac)
        style = ['-', '--', ':'][i]
        ax.plot(hours, germ * 100, color=color, linewidth=1.5, linestyle=style)
    ax.plot([], [], color=color, linewidth=2, label=seed_type)
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Germination (%)', color='white')
ax.set_title('Dormancy Types & Treatments', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Imbibition (water uptake) phases
ax = axes[1, 1]
time_imb = np.linspace(0, 48, 200)
# Phase I: rapid water uptake (physical)
# Phase II: plateau (metabolic activation)
# Phase III: radicle emergence
water_content = np.where(
    time_imb < 8,
    10 + 30 * (1 - np.exp(-0.5 * time_imb)),  # Phase I
    np.where(
        time_imb < 24,
        38 + 2 * (time_imb - 8) / 16,  # Phase II (slow)
        40 + 20 * (1 - np.exp(-0.2 * (time_imb - 24)))  # Phase III
    )
)
ax.plot(time_imb, water_content, color='#3b82f6', linewidth=2)
ax.axvspan(0, 8, alpha=0.1, color='#22c55e', label='Phase I: Imbibition')
ax.axvspan(8, 24, alpha=0.1, color='#f59e0b', label='Phase II: Activation')
ax.axvspan(24, 48, alpha=0.1, color='#a855f7', label='Phase III: Growth')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Seed water content (%)', color='white')
ax.set_title('Imbibition Phases', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Hormone balance during germination
ax = axes[1, 2]
time_germ = np.linspace(0, 72, 200)
aba = 100 * np.exp(-0.08 * time_germ)  # ABA decreases
ga = 10 + 90 * (1 - np.exp(-0.05 * time_germ))  # GA increases
ratio = ga / (aba + 1)
ax.plot(time_germ, aba, color='#ef4444', linewidth=2, label='ABA (dormancy)')
ax.plot(time_germ, ga, color='#22c55e', linewidth=2, label='GA (germination)')
ax2 = ax.twinx()
ax2.plot(time_germ, ratio, color='#f59e0b', linewidth=2, linestyle='--', label='GA/ABA ratio')
ax.set_xlabel('Time after imbibition (hours)', color='white')
ax.set_ylabel('Hormone level (relative)', color='white')
ax2.set_ylabel('GA/ABA ratio', color='#f59e0b')
ax.set_title('Hormone Balance Controls Germination', color='white', fontsize=11)
ax.legend(fontsize=8, loc='center left', facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Germination is not passive — it is an actively controlled process.")
print("The seed integrates temperature, moisture, light, and hormonal signals")
print("to decide WHEN to germinate. Getting this wrong means death.")
print("The seed keeper's knowledge of these signals is what makes her invaluable.")`,
      challenge: 'Model climate change: if spring temperatures arrive 2 weeks earlier but last frost date stays the same, what happens to seeds that germinate based on accumulated temperature (thermal time)? They might germinate into a frost — model the risk.',
      successHint: 'Germination physiology is a decision-making system optimized by millions of years of evolution. The seed integrates multiple environmental signals to time its emergence precisely. Understanding these signals is essential for agriculture, restoration, and conservation.',
    },
    {
      title: 'Crop genetic diversity — why uniformity is dangerous',
      concept: `Modern agriculture is built on genetic uniformity. Most wheat fields contain a single variety; most banana plantations grow one clone (Cavendish). This uniformity maximizes yield in good conditions but creates catastrophic vulnerability.

**Historical disasters from genetic uniformity:**
- **Irish Potato Famine (1845-1852)**: one million dead. All potatoes were genetically identical (Irish Lumper variety), and all susceptible to Phytophthora infestans.
- **US corn blight (1970)**: 15% of the US corn crop destroyed. Nearly all hybrid corn carried the same Texas male-sterile cytoplasm, which happened to be vulnerable to a new fungal race.
- **Gros Michel banana extinction (1950s)**: the world's commercial banana wiped out by Fusarium wilt. Replaced by Cavendish — which is now threatened by the same fungus (TR4).

**Genetic diversity** is the number and frequency of different alleles in a population. High diversity means some individuals carry resistance to any given threat. Low diversity means if one is vulnerable, all are.

Metrics:
- **Allelic richness**: number of different alleles per gene
- **Expected heterozygosity (He)**: probability that two randomly sampled alleles differ
- **Effective population size (Ne)**: corrected population size that accounts for unequal reproduction

Modern crop varieties contain ~10-20% of the genetic diversity of their wild ancestors. The rest was lost through domestication bottlenecks and modern breeding.`,
      analogy: 'A genetically uniform crop is like a class where every student has the same password. If a hacker (pathogen) cracks one, they crack all. Genetic diversity is like each student having a unique, randomly generated password — even if some are cracked, most survive. The seed keeper\'s job is to maintain a large "password library" of diverse varieties.',
      storyConnection: 'The seed keeper grew thirty varieties of rice — each with different disease resistance, flood tolerance, drought adaptation, and cooking qualities. The agricultural officer wanted her to plant just one "high-yielding" variety. She refused, and when the blight came that year, her diverse field survived while the monoculture fields were devastated.',
      checkQuestion: 'A farmer plants 100 hectares of a single wheat variety. A new rust strain appears to which this variety is susceptible. Expected yield loss: 90%. If the farmer had planted 10 different varieties, and the rust can attack 3 of them, what is the expected loss?',
      checkAnswer: 'With 10 varieties equally distributed: each covers 10 hectares. Three vulnerable varieties lose 90% = 3 * 10 * 0.9 = 27 hectares lost. Seven resistant varieties: 0 loss. Total loss: 27 out of 100 hectares = 27%. Genetic diversity reduced loss from 90% to 27% — a 3.3x improvement. And if varieties are chosen to be as genetically different as possible, the chance of any future pathogen attacking more than a few is small.',
      codeIntro: 'Simulate crop disease epidemics in monocultures vs diverse fields and quantify the value of genetic diversity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_epidemic(n_varieties, n_plants_per_variety, pathogen_virulence,
                      transmission_rate=0.1, seasons=20):
    """Simulate disease epidemic in a field.
    pathogen_virulence: fraction of varieties susceptible to each pathogen.
    """
    total_plants = n_varieties * n_plants_per_variety
    # Each variety is susceptible to the pathogen with probability = virulence
    susceptible = np.random.random(n_varieties) < pathogen_virulence

    yields = []
    infected_history = []

    for season in range(seasons):
        # New pathogen strain each season (small chance of new virulence)
        if season > 0 and np.random.random() < 0.1:
            # Pathogen evolves: some resistant varieties become susceptible
            for v in range(n_varieties):
                if not susceptible[v] and np.random.random() < 0.05:
                    susceptible[v] = True

        # Infection spreads within susceptible varieties
        infected = np.zeros(n_varieties)
        for v in range(n_varieties):
            if susceptible[v]:
                # SIR-like spread within variety
                initial_infected = 0.01  # 1% initial infection
                final_infected = 1 / (1 + (1/initial_infected - 1) * np.exp(-transmission_rate * n_plants_per_variety * 0.1))
                infected[v] = final_infected
            else:
                infected[v] = 0

        total_infected = np.sum(infected * n_plants_per_variety) / total_plants
        infected_history.append(total_infected)

        # Yield: healthy plants produce 1.0, infected produce 0.1
        healthy_frac = 1 - total_infected
        season_yield = healthy_frac * 1.0 + total_infected * 0.1
        yields.append(season_yield)

    return yields, infected_history

# Compare monoculture vs diverse
n_trials = 100
diversity_levels = [1, 3, 5, 10, 20, 50]
mean_yields = []
yield_vars = []
worst_yields = []

for n_var in diversity_levels:
    trial_yields = []
    for _ in range(n_trials):
        yields, _ = simulate_epidemic(n_var, 1000 // n_var, pathogen_virulence=0.3)
        trial_yields.append(np.mean(yields))
    mean_yields.append(np.mean(trial_yields))
    yield_vars.append(np.std(trial_yields))
    worst_yields.append(np.percentile(trial_yields, 5))

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Mean yield vs diversity
ax = axes[0, 0]
ax.plot(diversity_levels, mean_yields, 'o-', color='#22c55e', linewidth=2, markersize=8, label='Mean yield')
ax.fill_between(diversity_levels,
                [m - s for m, s in zip(mean_yields, yield_vars)],
                [m + s for m, s in zip(mean_yields, yield_vars)],
                alpha=0.2, color='#22c55e')
ax.plot(diversity_levels, worst_yields, 's--', color='#ef4444', linewidth=2, label='Worst 5% yield')
ax.set_xlabel('Number of varieties', color='white')
ax.set_ylabel('Relative yield', color='white')
ax.set_title('Yield vs Genetic Diversity', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Single epidemic comparison
ax = axes[0, 1]
yields_mono, inf_mono = simulate_epidemic(1, 1000, 0.3, seasons=30)
yields_div, inf_div = simulate_epidemic(20, 50, 0.3, seasons=30)
ax.plot(inf_mono, color='#ef4444', linewidth=2, label='Monoculture (1 variety)')
ax.plot(inf_div, color='#22c55e', linewidth=2, label='Diverse (20 varieties)')
ax.set_xlabel('Season', color='white')
ax.set_ylabel('Fraction infected', color='white')
ax.set_title('Epidemic Spread', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Historical crop losses
ax = axes[0, 2]
events = ['Irish Potato\\\n1845', 'US Corn\\\n1970', 'Gros Michel\\\nBanana 1950', 'Rice Blast\\\n1975']
losses = [100, 15, 95, 30]  # percent
colors_loss = ['#ef4444', '#f59e0b', '#ef4444', '#3b82f6']
bars = ax.bar(events, losses, color=colors_loss, edgecolor='none', width=0.6)
for bar, l in zip(bars, losses):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{l}%', ha='center', color='white', fontsize=10)
ax.set_ylabel('Crop loss (%)', color='white')
ax.set_title('Historical Genetic Uniformity Disasters', color='white', fontsize=11)

# Plot 4: Diversity loss through domestication
ax = axes[1, 0]
stages = ['Wild\\\nancestor', 'Early\\\ndomestic.', 'Landrace\\\nera', 'Green\\\nRevolution', 'Modern\\\nbreeding']
diversity = [100, 60, 45, 20, 12]
colors_stage = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
ax.bar(stages, diversity, color=colors_stage, edgecolor='none', width=0.6)
for i, (stage, d) in enumerate(zip(stages, diversity)):
    ax.text(i, d + 2, f'{d}%', ha='center', color='white', fontsize=10)
ax.set_ylabel('Genetic diversity (% of wild)', color='white')
ax.set_title('Diversity Loss Through History', color='white', fontsize=11)

# Plot 5: Risk distribution
ax = axes[1, 1]
# Monte Carlo: crop failure probability vs diversity
failure_threshold = 0.5  # yield below 50% = crop failure
for vir, color, label in [(0.2, '#22c55e', 'Mild pathogen'),
                            (0.5, '#f59e0b', 'Moderate'),
                            (0.8, '#ef4444', 'Severe')]:
    failure_probs = []
    for n_var in diversity_levels:
        failures = 0
        for _ in range(200):
            yields, _ = simulate_epidemic(n_var, 1000//n_var, vir, seasons=5)
            if np.mean(yields) < failure_threshold:
                failures += 1
        failure_probs.append(failures / 200)
    ax.plot(diversity_levels, failure_probs, 'o-', color=color, linewidth=2, label=label)
ax.set_xlabel('Number of varieties', color='white')
ax.set_ylabel('Probability of crop failure', color='white')
ax.set_title('Failure Risk vs Diversity', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
text = """Crop Genetic Diversity Summary
==================================

Monoculture (1 variety):
  Mean yield: %.2f
  Worst case: %.2f
  Failure risk: HIGH

Diverse (20 varieties):
  Mean yield: %.2f
  Worst case: %.2f
  Failure risk: LOW

Diversity costs a little in peak yield
but provides massive insurance against
catastrophic loss.

The seed keeper's 30 rice varieties
are not nostalgia — they are
the village's food security.""" % (
    mean_yields[0], worst_yields[0],
    mean_yields[-2], worst_yields[-2],
)
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Genetic diversity is biological insurance.")
print(f"  Monoculture yield: {mean_yields[0]:.2f} (5th pctl: {worst_yields[0]:.2f})")
print(f"  20-variety yield:  {mean_yields[-2]:.2f} (5th pctl: {worst_yields[-2]:.2f})")
print(f"  Diversity reduces worst-case loss by {(worst_yields[-2] - worst_yields[0])*100:.0f} percentage points")`,
      challenge: 'Add pathogen evolution: each season, the pathogen has a 5% chance of gaining virulence against a previously resistant variety. With 20 varieties and evolving pathogens, how many seasons until diversity no longer protects? This is the "Red Queen" dynamic.',
      successHint: 'Genetic diversity is the foundation of food security. Every time we replace diverse landraces with a single high-yield variety, we trade resilience for productivity. The seed keeper knew this instinctively — and the science confirms her wisdom.',
    },
    {
      title: 'Agrobiodiversity & food security — the seed keeper\'s role in the world',
      concept: `**Agrobiodiversity** encompasses the full diversity of crops, livestock, and their wild relatives that support human food systems. It is the most undervalued resource on Earth.

The numbers are staggering:
- Humans have cultivated ~7,000 plant species for food throughout history
- Today, just **3 species** (rice, wheat, maize) provide 60% of global calories
- **75% of crop genetic diversity** has been lost in the past century
- Only ~30 crops feed the world; the other 6,970 are neglected or forgotten

**Why this matters for food security:**
1. **Climate adaptation**: as temperatures rise and rainfall patterns shift, we need crop varieties that tolerate new conditions. Those genes exist in traditional varieties and wild relatives — not in modern monocultures.
2. **Nutrition**: traditional crops often have higher micronutrient content. Replacing 100 varieties of greens with 3 means nutritional diversity collapses.
3. **Pest resistance**: every new pest or disease requires new resistance genes. The wider the gene pool, the more resistance options available.
4. **Cultural identity**: food is culture. Losing crop diversity means losing cuisines, traditions, and knowledge systems.

**The seed keeper's role**: In every traditional farming community, there is someone who maintains, selects, and shares seeds of diverse varieties. These are the custodians of crop genetic diversity — the original gene bankers. They practice what scientists call **in situ conservation** — maintaining living diversity in the fields where it evolved.`,
      analogy: 'Agrobiodiversity is like a library. Modern agriculture keeps only the bestsellers on the shelf and discards everything else. But when the bestseller goes out of print (disease, climate change), you need those forgotten books. The seed keeper is the librarian who never threw anything away — and one day, the world will need what she saved.',
      storyConnection: 'Our seed keeper was not just preserving seeds — she was preserving the agricultural knowledge of her ancestors. Every variety she maintained was a story: this rice survives floods, that millet grows in poor soil, this bean fixes nitrogen. Her seed collection was a living encyclopedia of agricultural adaptation.',
      checkQuestion: 'If 75% of crop genetic diversity has been lost, what would it cost to recreate it through modern breeding? Is this even possible?',
      checkAnswer: 'It is effectively impossible. Genetic diversity arises through thousands of years of mutation, selection, and adaptation in diverse environments. Modern breeding can recombine existing genes but cannot recreate alleles that have been permanently lost. The cost of attempting to restore diversity through breeding from a narrow base would be billions of dollars over centuries — and would still produce less diversity than what was lost. Prevention (conservation) is infinitely cheaper than cure (re-creation).',
      codeIntro: 'Model the global agrobiodiversity crisis and quantify the value of seed keeper conservation networks.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Global crop diversity model over time
years_history = np.arange(1900, 2030)

# Number of varieties in active cultivation (approximate)
def varieties_in_use(year, crop='all'):
    if crop == 'rice':
        # Rice: 100,000+ traditional varieties → ~5,000 widely grown
        peak = 100000
        modern_start = 1965  # Green Revolution
        decline_rate = 0.03
    elif crop == 'wheat':
        peak = 50000
        modern_start = 1960
        decline_rate = 0.035
    elif crop == 'all':
        peak = 300000
        modern_start = 1960
        decline_rate = 0.025
    else:
        peak = 10000
        modern_start = 1970
        decline_rate = 0.02

    if year < modern_start:
        return peak * (0.9 + 0.1 * (year - 1900) / (modern_start - 1900))
    else:
        years_since = year - modern_start
        return max(peak * 0.05, peak * np.exp(-decline_rate * years_since))

# Food security metrics
def food_security_index(diversity_fraction, yield_level, climate_stability):
    """Composite food security index (0-100)."""
    resilience = 30 * diversity_fraction  # diversity contributes 30%
    productivity = 40 * yield_level      # yield contributes 40%
    stability = 30 * climate_stability   # stability contributes 30%
    return resilience + productivity + stability

# Climate change scenarios
def climate_impact(year, scenario='moderate'):
    """Climate stability factor (0-1)."""
    if scenario == 'moderate':
        return max(0.3, 1.0 - 0.005 * max(0, year - 2000))
    elif scenario == 'severe':
        return max(0.1, 1.0 - 0.01 * max(0, year - 2000))
    else:
        return 0.95

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Variety loss over time
ax = axes[0, 0]
for crop, color in [('rice', '#22c55e'), ('wheat', '#f59e0b'), ('all', '#3b82f6')]:
    varieties = [varieties_in_use(y, crop) for y in years_history]
    ax.plot(years_history, np.array(varieties) / 1000, color=color, linewidth=2, label=crop.title())
ax.axvline(1965, color='gray', linestyle=':', alpha=0.5, label='Green Revolution')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Varieties in use (thousands)', color='white')
ax.set_title('Crop Variety Loss', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Calorie concentration
ax = axes[0, 1]
crops_pct = {
    'Rice': 23, 'Wheat': 17, 'Maize': 10, 'Soy': 5, 'Barley': 3,
    'Potato': 3, 'Sugar cane': 6, 'Palm oil': 3, 'Other (6990 species)': 30,
}
colors_crops = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7',
                '#14b8a6', '#ec4899', '#6b7280', '#ddd']
ax.pie(crops_pct.values(), labels=crops_pct.keys(), colors=colors_crops,
       autopct='%d%%', textprops={'fontsize': 7, 'color': 'white'},
       pctdistance=0.8, labeldistance=1.15)
ax.set_title('Global Calorie Sources', color='white', fontsize=11)

# Plot 3: Seed keeper network value
ax = axes[0, 2]
n_keepers = np.arange(0, 501)
varieties_per_keeper = 25
redundancy = 3
total_varieties_maintained = n_keepers * varieties_per_keeper / redundancy
# Diminishing returns (overlap between keepers)
unique_varieties = 10000 * (1 - np.exp(-n_keepers * varieties_per_keeper / (redundancy * 10000)))
ax.plot(n_keepers, unique_varieties, color='#22c55e', linewidth=2, label='Unique varieties')
ax.plot(n_keepers, total_varieties_maintained, color='#3b82f6', linewidth=2,
        linestyle='--', label='Total with redundancy')
ax.set_xlabel('Number of seed keepers in network', color='white')
ax.set_ylabel('Varieties conserved', color='white')
ax.set_title('Seed Keeper Network Scaling', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Food security under different diversity scenarios
ax = axes[1, 0]
future_years = np.arange(2020, 2101)
for div_scenario, color, label in [
    (0.1, '#ef4444', 'Continued loss (10% diversity)'),
    (0.3, '#f59e0b', 'Stabilized (30%)'),
    (0.5, '#22c55e', 'Restored (50%)'),
]:
    fsi = []
    for yr in future_years:
        yield_level = min(1.0, 0.7 + 0.003 * (yr - 2020))  # yields keep improving
        climate = climate_impact(yr, 'moderate')
        fs = food_security_index(div_scenario, yield_level, climate)
        fsi.append(fs)
    ax.plot(future_years, fsi, color=color, linewidth=2, label=label)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Food security index (0-100)', color='white')
ax.set_title('Food Security Projections', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Cost-benefit of conservation
ax = axes[1, 1]
conservation_cost = np.linspace(0, 100, 50)  # million USD/year
# Benefits: reduced crop failure risk
base_loss_risk = 0.15  # 15% annual crop loss risk without conservation
loss_with_conservation = base_loss_risk * np.exp(-0.03 * conservation_cost)
global_crop_value = 3000  # billion USD
losses_avoided = (base_loss_risk - loss_with_conservation) * global_crop_value * 1000  # million USD
net_benefit = losses_avoided - conservation_cost

ax.plot(conservation_cost, losses_avoided, color='#22c55e', linewidth=2, label='Losses avoided')
ax.plot(conservation_cost, conservation_cost, color='#ef4444', linewidth=2, linestyle='--', label='Cost')
ax.plot(conservation_cost, net_benefit, color='#f59e0b', linewidth=2, label='Net benefit')
ax.fill_between(conservation_cost, net_benefit, where=net_benefit > 0,
                alpha=0.15, color='#22c55e')
ax.set_xlabel('Conservation spending (M USD/year)', color='white')
ax.set_ylabel('Value (M USD/year)', color='white')
ax.set_title('Conservation ROI', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
text = """Agrobiodiversity & Food Security
====================================

The crisis:
  - 75% of crop diversity lost since 1900
  - 3 crops = 60% of global calories
  - 6,970 species neglected or forgotten

The solution:
  - Seed keepers maintain diversity in situ
  - Gene banks store backup copies ex situ
  - Both are needed — neither alone suffices

The economics:
  - Global crop value: $3 trillion/year
  - Conservation cost: ~$100 million/year
  - ROI: >1000x

  One dollar spent on seed conservation
  prevents thousands in crop losses.

  The seed keeper is not a relic of the
  past — she is humanity's most important
  insurance agent."""
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Agrobiodiversity is the foundation of food security.")
print("Seed keepers are the guardians of this foundation.")
print("Investing in their knowledge and networks is the")
print("highest-return investment in human food security.")`,
      challenge: 'Model a "seed keeper retirement" scenario: 50% of active seed keepers retire over 20 years without successors. What fraction of varieties is permanently lost if there is no gene bank backup? This is happening right now in rural communities worldwide.',
      successHint: 'The seed keeper\'s story is not just local folklore — it is a globally relevant narrative about the value of diversity, the danger of uniformity, and the critical role of community-based conservation. Every variety she maintains is a gene set that might save a crop someday.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Seed Science & Conservation Biology
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (biology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for seed biology and conservation modeling. Click to start.</p>
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
