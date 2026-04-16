import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SeedKeeperLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is a seed bank — vaults for the future',
      concept: `A **seed bank** is a facility that stores seeds at low temperatures and low humidity to preserve plant genetic diversity for the future. Seeds are living things in suspended animation — dried to 3-7% moisture and cooled to -18°C or lower, they can remain viable for decades, centuries, or even millennia.

The world's major seed banks:
- **Svalbard Global Seed Vault** (Norway): backup copies of 1.3 million seed samples from worldwide collections
- **Millennium Seed Bank** (UK): 2.4 billion seeds from 40,000+ species
- **National Bureau of Plant Genetic Resources** (India): 450,000+ accessions of crop diversity
- **IRRI Gene Bank** (Philippines): 132,000+ rice varieties

Why build seed banks?
- **Insurance**: if crops are wiped out by disease, drought, or war, we can restart from stored seeds
- **Breeding**: old varieties carry genes for disease resistance, drought tolerance, nutrition
- **Research**: understanding genetic diversity helps us improve crops
- **Cultural heritage**: traditional varieties are living history`,
      analogy: 'A seed bank is like a backup hard drive for Earth\'s agricultural software. If your computer crashes, you restore from backup. If a crop is devastated by disease, you restore from the seed bank. The seeds contain the "source code" (DNA) for rebuilding any lost variety.',
      storyConnection: 'The Seed Keeper of Nagaland preserves traditional rice varieties that her ancestors cultivated for generations. Each variety is adapted to specific conditions — some for steep hillsides, some for flooded paddies, some for short growing seasons. Without seed keepers, this diversity would be lost to modern monoculture.',
      checkQuestion: 'The Svalbard vault is built into a mountain on an Arctic island. Why that location?',
      checkAnswer: 'Permafrost keeps the vault naturally cold (-3 to -4°C) even without electricity, providing a passive backup if refrigeration fails. The remote Arctic location is politically stable, far from conflict zones, and above sea level rise projections. It\'s the "doomsday vault" — designed to survive even if the institutions that built it don\'t.',
      codeIntro: 'Visualize global seed bank holdings and the rate of crop diversity loss.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Major seed banks by holdings
ax1.set_facecolor('#111827')
banks = ['Svalbard\
(Norway)', 'IRRI\
(Philippines)', 'NBPGR\
(India)',
         'Millennium\
(UK)', 'USDA\
(USA)', 'VIR\
(Russia)']
holdings = [1300000, 132000, 450000, 97000, 600000, 320000]
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#ec4899']

bars = ax1.barh(banks, holdings, color=colors, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, val in zip(bars, holdings):
    ax1.text(bar.get_width() + 20000, bar.get_y() + bar.get_height()/2,
             f'{val:,}', va='center', color='white', fontsize=9)
ax1.set_xlabel('Seed accessions', color='white')
ax1.set_title('Major Global Seed Banks', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Crop diversity loss over time
ax2.set_facecolor('#111827')
years = np.arange(1900, 2030, 10)
# Approximate percentage of varieties still in cultivation
varieties_pct = np.array([100, 95, 85, 70, 50, 35, 25, 18, 12, 10, 8, 7, 6])
ax2.plot(years, varieties_pct, 'o-', color='#ef4444', linewidth=2, markersize=6)
ax2.fill_between(years, varieties_pct, alpha=0.15, color='#ef4444')
ax2.axhline(100, color='#4b5563', linestyle=':', alpha=0.3)

# Annotate key events
ax2.annotate('Green Revolution\
begins', xy=(1960, 50), xytext=(1940, 70),
             color='#f59e0b', fontsize=8, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.annotate('94% of varieties\
lost by 2020', xy=(2020, 6), xytext=(1990, 30),
             color='#ef4444', fontsize=8, arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('% of original varieties still grown', color='white')
ax2.set_title('Crop Variety Loss (1900-2020)', color='white', fontsize=13)
ax2.set_ylim(0, 110)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Crop diversity loss:")
print("  In 1900: thousands of apple varieties grown commercially")
print("  By 2020: 90%+ of those varieties have disappeared")
print("  US example: 86% of apple varieties lost, 91% of corn varieties lost")
print()
print("The seed keeper's work is not nostalgia — it's survival insurance.")
print("Every lost variety is a lost set of genes we might need someday.")`,
      challenge: 'Research how many traditional rice varieties exist in Nagaland alone (estimated 1,000+). Compare this to the number of varieties a typical Indian supermarket sells (usually 5-10). What does this tell us about agricultural diversity?',
      successHint: 'Seed banks are humanity\'s insurance policy against agricultural disaster. The Seed Keeper of Nagaland and the scientists at Svalbard are doing the same work — preserving the genetic options that future generations will need.',
    },
    {
      title: 'Why genetic diversity matters — the monoculture trap',
      concept: `**Genetic diversity** is the variety of genes within a species. More diversity means more options for adapting to change. Less diversity means vulnerability.

The danger of low genetic diversity:
- **Irish Potato Famine (1845-1852)**: Ireland grew one potato variety (Lumper). A fungus (*Phytophthora infestans*) wiped it out. 1 million people died, 1 million emigrated.
- **Gros Michel banana (1950s)**: The world's commercial banana — all clones of one plant. Panama disease destroyed it. We switched to Cavendish, also a clone, now threatened by a new Panama disease strain.
- **Southern corn leaf blight (1970)**: 85% of US corn shared one genetic trait (T-cytoplasm). A fungus exploited it. 15% of the US corn crop was lost in one year.

The lesson: **monoculture is efficient but fragile**. Diversity is inefficient but resilient. The seed keeper's traditional varieties are a hedge against the monoculture trap.`,
      analogy: 'Genetic diversity is like a stock portfolio. Putting all your money in one stock (monoculture) gives great returns when that stock is up — but you lose everything if it crashes. Diversifying across many stocks (genetic diversity) gives lower average returns but protects against catastrophe. No financial advisor recommends a single-stock portfolio. No ecologist recommends a single-variety crop.',
      storyConnection: 'The Seed Keeper of Nagaland maintains dozens of rice varieties — some are drought-resistant, some are flood-tolerant, some are disease-resistant, some taste best, some store longest. She doesn\'t know which trait will be critical in the future. That uncertainty is exactly why she keeps them all.',
      checkQuestion: 'If a farmer grows 10 different rice varieties instead of 1, her average yield might be 10% lower. Why would she do this?',
      checkAnswer: 'Because in the year a disease hits, she loses maybe 20% of her crop (only the susceptible varieties) instead of 100%. Over 20 years, the diversified farmer has more reliable total production, even if each individual year is slightly lower. This is the same logic behind insurance: you pay a small premium (lower yield) for protection against catastrophe.',
      codeIntro: 'Simulate the monoculture trap: compare monoculture vs. diverse farming over 50 years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

years = 50
n_varieties_diverse = 10
base_yield = 100  # tons per variety

# Monoculture: one high-yield variety
mono_yields = np.ones(years) * base_yield * 1.2  # 20% higher base yield

# Disease strikes randomly (10% chance each year)
for y in range(years):
    if np.random.rand() < 0.10:
        mono_yields[y] *= 0.1  # 90% loss in disease year

# Diverse: 10 varieties, each slightly lower yield
diverse_yields = np.zeros(years)
for y in range(years):
    year_total = 0
    for v in range(n_varieties_diverse):
        variety_yield = base_yield * (0.8 + 0.1 * np.random.rand())  # 80-90% of mono
        if np.random.rand() < 0.10:  # same disease chance
            if np.random.rand() < 0.3:  # but only 30% of varieties susceptible
                variety_yield *= 0.1
        year_total += variety_yield / n_varieties_diverse
    diverse_yields[y] = year_total

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Annual yields
ax1.set_facecolor('#111827')
ax1.plot(range(years), mono_yields, color='#ef4444', linewidth=2, label='Monoculture (1 variety)', alpha=0.8)
ax1.plot(range(years), diverse_yields, color='#22c55e', linewidth=2, label=f'Diverse ({n_varieties_diverse} varieties)', alpha=0.8)
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Yield (tons)', color='white')
ax1.set_title('Annual Yields: Monoculture vs. Diversity', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Cumulative yields
ax2.set_facecolor('#111827')
ax2.plot(range(years), np.cumsum(mono_yields), color='#ef4444', linewidth=2, label='Monoculture (cumulative)')
ax2.plot(range(years), np.cumsum(diverse_yields), color='#22c55e', linewidth=2, label='Diverse (cumulative)')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Cumulative yield (tons)', color='white')
ax2.set_title('Cumulative Production Over 50 Years', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

mono_total = np.sum(mono_yields)
diverse_total = np.sum(diverse_yields)
mono_min = np.min(mono_yields)
diverse_min = np.min(diverse_yields)

print(f"50-year comparison:")
print(f"  Monoculture: total={mono_total:.0f}, worst year={mono_min:.0f}, mean={np.mean(mono_yields):.0f}")
print(f"  Diverse:     total={diverse_total:.0f}, worst year={diverse_min:.0f}, mean={np.mean(diverse_yields):.0f}")
print()
print(f"Monoculture crashes devastate total production.")
print(f"Diversity smooths out the bumps — lower highs, much higher lows.")
print(f"Over 50 years, which farmer is better off?")`,
      challenge: 'Change the disease probability from 10% to 30% (simulating climate change increasing disease pressure). How does the comparison change? At what disease probability does diversity clearly win?',
      successHint: 'The monoculture trap is one of the most important concepts in agriculture and ecology. Every major crop failure in history was caused by low genetic diversity. The seed keeper\'s work isn\'t romantic — it\'s rational risk management.',
    },
    {
      title: 'Crop wild relatives — untapped genetic treasure',
      concept: `Every domesticated crop has wild ancestors that still grow in nature. These **crop wild relatives** (CWRs) carry genetic traits that were lost during domestication:

- **Wild wheat** (*Aegilops*): genes for drought resistance, disease immunity
- **Wild rice** (*Oryza rufipogon*): flood tolerance, pest resistance
- **Wild potato** (many *Solanum* species): cold tolerance, late blight resistance
- **Wild tomato** (*Solanum pimpinellifolium*): salt tolerance, disease resistance

During domestication (last ~10,000 years), humans selected for yield, taste, and ease of harvest. But they inadvertently lost other useful traits: disease resistance, drought tolerance, nutrient content.

CWRs are the "backup copies" of those lost traits. Breeders can cross domesticated crops with wild relatives to reintroduce specific genes. This has already saved billions: the gene for rice blast resistance (*Pi-ta*) came from a wild rice relative.`,
      analogy: 'Crop wild relatives are like the deleted scenes on a DVD. The movie (domesticated crop) was edited for a general audience (high yield, good taste). But the deleted scenes (wild genes) contain material that might be perfect for a different situation (drought, disease). You can\'t get them back once the DVD is destroyed.',
      storyConnection: 'The Seed Keeper of Nagaland preserves not just cultivated rice varieties but also the wild relatives that grow in the forests and field margins. These wild rices look scraggly and produce little grain, but they carry irreplaceable genetic traits that modern breeding programs desperately need.',
      checkQuestion: 'Why can\'t we just engineer drought resistance from scratch instead of looking for it in wild relatives?',
      checkAnswer: 'Because drought resistance isn\'t one gene — it\'s dozens of genes working together in complex networks that evolved over millions of years. Engineering each gene from scratch would take decades and might not work (we don\'t fully understand the networks). Wild relatives already have the working system — we just need to cross-breed it in. Nature already solved the engineering problem.',
      codeIntro: 'Map the genetic diversity of rice: wild vs. cultivated varieties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Trait space: drought tolerance vs yield
ax1.set_facecolor('#111827')

# Wild rice: high diversity, low yield, variable drought tolerance
n_wild = 50
wild_drought = np.random.uniform(3, 10, n_wild)
wild_yield = np.random.uniform(1, 4, n_wild)

# Cultivated modern: low diversity, high yield, low drought tolerance
n_modern = 30
modern_drought = np.random.normal(3, 0.8, n_modern)
modern_yield = np.random.normal(8, 0.5, n_modern)

# Traditional varieties: medium diversity
n_trad = 40
trad_drought = np.random.uniform(4, 8, n_trad)
trad_yield = np.random.uniform(4, 7, n_trad)

ax1.scatter(wild_drought, wild_yield, c='#22c55e', s=40, alpha=0.6, label='Wild relatives', edgecolors='white', linewidths=0.5)
ax1.scatter(modern_drought, modern_yield, c='#ef4444', s=40, alpha=0.6, label='Modern cultivars', edgecolors='white', linewidths=0.5)
ax1.scatter(trad_drought, trad_yield, c='#f59e0b', s=40, alpha=0.6, label='Traditional varieties', edgecolors='white', linewidths=0.5)

ax1.set_xlabel('Drought tolerance (1-10)', color='white')
ax1.set_ylabel('Yield (tons/hectare)', color='white')
ax1.set_title('Trait Space: Rice Diversity', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Arrow showing breeding potential
ax1.annotate('Breeding target:\
high yield +\
drought tolerant',
             xy=(8, 8), fontsize=9, color='#a855f7', ha='center',
             bbox=dict(boxstyle='round', facecolor='#a855f7', alpha=0.2))
ax1.annotate('', xy=(8, 8), xytext=(6, 5.5),
             arrowprops=dict(arrowstyle='->', color='#a855f7', lw=2))

# Genetic diversity comparison
ax2.set_facecolor('#111827')
categories = ['Wild\
relatives', 'Traditional\
varieties', 'Modern\
cultivars']
diversity_metrics = {
    'Allele count': [450, 280, 85],
    'Disease resistance genes': [35, 20, 5],
    'Stress tolerance genes': [40, 25, 8],
}

x = np.arange(3)
width = 0.25
colors_bars = ['#22c55e', '#3b82f6', '#f59e0b']

for i, (metric, values) in enumerate(diversity_metrics.items()):
    ax2.bar(x + i*width, values, width, label=metric, color=colors_bars[i], alpha=0.8)

ax2.set_xticks(x + width)
ax2.set_xticklabels(categories, color='white')
ax2.set_ylabel('Count', color='white')
ax2.set_title('Genetic Diversity: What Domestication Lost', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The domestication bottleneck:")
print("  Wild rice: ~450 alleles across key traits")
print("  Traditional varieties: ~280 (38% lost)")
print("  Modern cultivars: ~85 (81% lost!)")
print()
print("We bred for yield but lost resilience.")
print("Wild relatives and traditional varieties hold the missing genes.")`,
      challenge: 'Simulate breeding: cross a modern cultivar (yield=8, drought=3) with a wild relative (yield=2, drought=9). The offspring gets random traits between the parents. After 5 generations of selection, can you get yield>7 AND drought>7?',
      successHint: 'Crop wild relatives are the genetic library that modern agriculture desperately needs. Protecting their habitats is as important as building seed vaults — you can\'t store what you\'ve already driven to extinction.',
    },
    {
      title: 'The Svalbard Global Seed Vault — design for eternity',
      concept: `The **Svalbard Global Seed Vault**, opened in 2008, is the ultimate backup for Earth's crop diversity. Built 120 meters inside a sandstone mountain on the Norwegian archipelago of Svalbard, 1,300 km from the North Pole.

Design features:
- **Location**: permafrost zone, naturally -3 to -4°C even without power
- **Storage**: seeds kept at -18°C in sealed aluminum foil packets
- **Capacity**: 4.5 million seed samples (currently holds ~1.3 million)
- **Security**: reinforced concrete, steel airlock doors, motion sensors
- **Governance**: owned by Norway, managed by the Crop Trust and NordGen
- **Cost**: $9 million to build (incredibly cheap for what it protects)

In 2015, the vault made its first withdrawal: ICARDA (a Syrian seed bank) needed seeds back after their collection in Aleppo was destroyed by civil war. The system worked exactly as designed.`,
      analogy: 'Svalbard is like a safe deposit box for humanity\'s agricultural future. Individual seed banks around the world are like personal safes — useful, but vulnerable to local disasters. Svalbard holds copies of those collections, protected by Arctic permafrost, military neutrality, and international law.',
      storyConnection: 'The Seed Keeper of Nagaland maintains a community seed bank — a small-scale version of Svalbard. Her methods are different (clay pots, dried gourds, cool storage rooms) but the principle is identical: keep seeds viable through careful drying, cooling, and protection. The technology differs; the purpose doesn\'t.',
      checkQuestion: 'Seeds stored at -18°C can last centuries. But can they last forever? What limits seed longevity?',
      checkAnswer: 'No — seeds slowly deteriorate even at -18°C because DNA accumulates damage from background radiation and chemical degradation. Orthodox seeds (most crops) can last 100-1,000+ years at -18°C. But eventually, viability drops. The solution: periodically grow out stored seeds, harvest fresh seeds, and re-store them. It\'s maintenance, not permanent storage.',
      codeIntro: 'Model seed viability over time at different storage temperatures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Seed viability model: exponential decay
# Half-life depends on temperature and moisture
# Ellis & Roberts equation (simplified)

temperatures = {'Room temp (25°C)': 25, 'Cool (5°C)': 5,
                'Svalbard (-18°C)': -18, 'Cryo (-196°C)': -196}

# Simplified: viability halving time (years)
halving_times = {'Room temp (25°C)': 5, 'Cool (5°C)': 20,
                 'Svalbard (-18°C)': 200, 'Cryo (-196°C)': 10000}

ax1.set_facecolor('#111827')
years = np.linspace(0, 500, 1000)
colors_temp = ['#ef4444', '#f59e0b', '#3b82f6', '#a855f7']

for (name, t_half), color in zip(halving_times.items(), colors_temp):
    viability = 100 * (0.5 ** (years / t_half))
    ax1.plot(years, viability, color=color, linewidth=2, label=name)

ax1.axhline(50, color='#4b5563', linestyle=':', alpha=0.5)
ax1.text(480, 52, '50% viability', color='#9ca3af', fontsize=8, ha='right')
ax1.set_xlabel('Years in storage', color='white')
ax1.set_ylabel('Viability (%)', color='white')
ax1.set_title('Seed Viability vs. Storage Temperature', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 105)

# Svalbard vault contents by region
ax2.set_facecolor('#111827')
regions = ['Asia-\
Pacific', 'Africa', 'Americas', 'Europe', 'Near\
East']
samples = [380000, 220000, 280000, 310000, 110000]
colors_reg = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#ef4444']

wedges, texts, autotexts = ax2.pie(samples, labels=regions, colors=colors_reg, autopct='%1.0f%%',
                                    pctdistance=0.75, labeldistance=1.15,
                                    textprops={'color': 'white', 'fontsize': 9})
for t in autotexts:
    t.set_fontsize(8)
    t.set_color('white')

ax2.set_title('Svalbard Vault: Seeds by Region', color='white', fontsize=13)

plt.tight_layout()
plt.show()

print("Svalbard Global Seed Vault:")
print(f"  Capacity: 4,500,000 seed samples")
print(f"  Current holdings: ~1,300,000 samples")
print(f"  Temperature: -18°C (powered) / -3°C (natural permafrost backup)")
print(f"  Cost: $9 million (less than a single fighter jet)")
print()
print("Seed viability at -18°C:")
print("  After 100 years: ~71% viable")
print("  After 200 years: ~50% viable")
print("  After 500 years: ~18% viable")
print("  Solution: grow out and re-store periodically")`,
      challenge: 'Calculate: if a seed bank stores 1 million samples and needs to regenerate (grow out and re-harvest) each sample every 200 years, how many samples must be regenerated per year? Per day? Is this feasible?',
      successHint: 'The Svalbard vault is one of humanity\'s most important infrastructure projects. For $9 million — less than a single military aircraft — it protects the genetic foundation of global food security.',
    },
    {
      title: 'Traditional seed saving — ancient technology, living practice',
      concept: `Long before scientific seed banks, communities worldwide developed sophisticated seed-saving practices. In Nagaland, traditional seed keeping involves:

**Selection**: The seed keeper chooses the best plants for next year's seed — not just the highest yielding, but the healthiest, most vigorous, most disease-resistant. This is **mass selection** — the same principle as natural selection, directed by human judgment.

**Processing**: Seeds are dried carefully (too fast and they crack; too slow and they mold), cleaned to remove debris and diseased seeds, and sorted by size and quality.

**Storage**: Traditional containers include:
- Clay pots sealed with cow dung (naturally antimicrobial)
- Bamboo containers with ash (absorbs moisture, repels insects)
- Dried gourds (airtight, naturally insulated)
- Hanging above the cooking fire (smoke repels insects, warmth keeps humidity low)

**Social systems**: Seed exchange networks between villages maintain diversity across the landscape. If one village loses a variety, neighbors can resupply it.`,
      analogy: 'Traditional seed saving is like an oral history tradition — knowledge preserved not in books (vaults) but in living practice, passed from generation to generation. Both methods work. Both are vulnerable (oral history to language death, seed saving to cultural disruption). The best strategy is both: living practice AND institutional backup.',
      storyConnection: 'The Seed Keeper of Nagaland embodies a tradition that predates agriculture itself — gatherers selecting the best wild plants to return to. Her knowledge is irreplaceable: which seeds need 3 days of drying vs. 5, which containers work for which varieties, which moon phase is best for planting (sometimes correlating with actual weather patterns). This is empirical knowledge accumulated over millennia.',
      checkQuestion: 'Traditional seed keepers often store different varieties in different containers. Modern seed banks store all seeds the same way. Which approach is better?',
      checkAnswer: 'The traditional approach acknowledges that different varieties have different storage needs — some need drier conditions, some need specific temperatures. Modern seed banks standardize for efficiency (one protocol for millions of samples). The ideal is a hybrid: standardized base protocol with adjustments for varieties with unusual requirements. Traditional knowledge informs those adjustments.',
      codeIntro: 'Compare traditional vs. modern seed storage conditions and viability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Compare storage methods
ax1.set_facecolor('#111827')
methods = ['Open air', 'Clay pot\
(sealed)', 'Bamboo +\
ash', 'Above\
cooking fire', 'Refrigerator\
(5°C)', 'Svalbard\
(-18°C)']
# Estimated viability after 5 years (%)
viability_5yr = [15, 65, 70, 55, 85, 98]
# Temperature (°C)
temps = [30, 25, 22, 28, 5, -18]
# Moisture content (%)
moisture = [14, 8, 7, 6, 5, 3]

colors_bar = ['#ef4444', '#f59e0b', '#22c55e', '#f97316', '#3b82f6', '#a855f7']
bars = ax1.bar(methods, viability_5yr, color=colors_bar, alpha=0.8, edgecolor='white', linewidth=0.5)

for bar, v, t, m in zip(bars, viability_5yr, temps, moisture):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{v}%\
({t}°C, {m}%)', ha='center', color='white', fontsize=7)

ax1.set_ylabel('Seed viability after 5 years (%)', color='white')
ax1.set_title('Storage Method Comparison', color='white', fontsize=13)
ax1.tick_params(colors='gray', labelsize=8)
ax1.set_ylim(0, 115)

# Seed exchange network visualization
ax2.set_facecolor('#111827')

# Simulate 8 villages in a network
n_villages = 8
np.random.seed(42)
angles = np.linspace(0, 2*np.pi, n_villages, endpoint=False)
vx = 4 * np.cos(angles)
vy = 4 * np.sin(angles)

# Each village has some varieties (overlapping but not identical)
all_varieties = 20
village_varieties = []
for i in range(n_villages):
    n_local = np.random.randint(8, 14)
    varieties = set(np.random.choice(all_varieties, n_local, replace=False))
    village_varieties.append(varieties)

# Draw exchange connections (villages share varieties)
for i in range(n_villages):
    for j in range(i+1, n_villages):
        shared = len(village_varieties[i] & village_varieties[j])
        if shared > 3:
            alpha = min(shared / 8, 0.8)
            ax2.plot([vx[i], vx[j]], [vy[i], vy[j]], color='#22c55e', alpha=alpha, linewidth=shared/3)

# Draw villages
for i in range(n_villages):
    n_var = len(village_varieties[i])
    ax2.scatter(vx[i], vy[i], s=n_var * 30, c='#3b82f6', edgecolors='white',
                linewidths=1.5, zorder=5)
    ax2.text(vx[i], vy[i], str(n_var), ha='center', va='center',
             color='white', fontsize=9, fontweight='bold', zorder=6)
    ax2.text(vx[i], vy[i] - 0.7, f'Village {i+1}', ha='center',
             color='#9ca3af', fontsize=7)

# Network statistics
total_unique = len(set().union(*village_varieties))
avg_per_village = np.mean([len(v) for v in village_varieties])
ax2.text(0, 0, f'Network:\
{total_unique} varieties\
(avg {avg_per_village:.0f}/village)',
         ha='center', va='center', color='#f59e0b', fontsize=9, fontweight='bold')

ax2.set_title('Village Seed Exchange Network', color='white', fontsize=13)
ax2.set_aspect('equal')
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Traditional seed storage works because:")
print("  1. Low moisture (drying) prevents mold and premature germination")
print("  2. Cool temperatures slow metabolic degradation")
print("  3. Sealed containers prevent moisture re-absorption")
print("  4. Ash/smoke repels insects naturally")
print()
print(f"Village network preserves {total_unique} varieties total")
print(f"  No single village has all {total_unique} — redundancy is the key")
print(f"  If Village 3 loses a variety, Village 5 likely still has it")`,
      challenge: 'What happens if you remove a village from the network? Simulate deleting Village 4 and recalculate total network diversity. How many varieties are lost?',
      successHint: 'Traditional seed saving isn\'t "primitive" — it\'s a sophisticated, distributed, resilient system for maintaining genetic diversity. Modern seed banks add institutional backing, but the principles are the same: dry, cool, dark, redundant.',
    },
    {
      title: 'Monoculture risks — lessons from history',
      concept: `**Monoculture** — growing a single crop variety over a large area — is the dominant model of modern agriculture. It's efficient, but it creates systemic risk:

Historical monoculture failures:
- **Irish Potato Famine (1845)**: 1 variety, 1 million dead
- **Ceylon coffee (1869)**: coffee rust destroyed the industry; Sri Lanka switched to tea
- **US Southern corn blight (1970)**: 15% of US corn crop lost in one year
- **Cavendish banana (ongoing)**: Tropical Race 4 threatening the world's banana supply

Why monoculture dominates despite the risk:
- **Economies of scale**: one variety = one set of equipment, one planting schedule
- **Market demand**: consumers want uniform products
- **Industrial processing**: machines need uniform inputs
- **Short-term profit**: monoculture maximizes yield per acre per year

The fundamental problem: **efficiency and resilience are inversely correlated**. Maximum efficiency means minimum diversity. Minimum diversity means maximum vulnerability. Every monoculture collapse in history followed the same pattern: optimize for yield → reduce diversity → new threat appears → catastrophic loss.`,
      analogy: 'Monoculture is like having an entire army equipped with one type of weapon. If the enemy has a defense against that weapon, your entire army is useless. A diverse army (genetic diversity) can always counter new threats because different units have different capabilities. Military strategists and ecologists agree: never put all your resources in one basket.',
      storyConnection: 'The Seed Keeper of Nagaland practices the opposite of monoculture: polyculture, with dozens of rice varieties in her fields. When modern agriculture pushes farmers toward a single high-yield variety, the seed keeper pushes back — not from stubbornness, but from generations of experience watching single-variety fields fail.',
      checkQuestion: 'The Cavendish banana (what you eat today) is a clone — every Cavendish plant in the world is genetically identical. A new fungus (Tropical Race 4) can kill it. What should we do?',
      checkAnswer: 'Three strategies: (1) Find resistant varieties in wild banana relatives or traditional landraces and breed resistance into Cavendish (requires the genetic diversity that seed keepers preserve). (2) Develop genetically modified Cavendish with resistance genes. (3) Diversify — grow and sell multiple banana varieties instead of one. All three require genetic diversity. Without it, we lose the banana industry.',
      codeIntro: 'Simulate the catastrophic dynamics of monoculture vulnerability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Epidemic simulation: disease spread in monoculture vs diverse field
field_size = 50
days = 60

# Monoculture: all plants identical, disease spreads to all neighbors
def simulate_epidemic(diversity_level, spread_prob=0.3):
    field = np.ones((field_size, field_size), dtype=int)  # 1 = healthy
    # Assign varieties (0 to diversity_level-1)
    varieties = np.random.randint(0, diversity_level, (field_size, field_size))
    # Infect center
    field[field_size//2, field_size//2] = 0  # 0 = infected
    infected_variety = varieties[field_size//2, field_size//2]

    daily_infected = [1]
    for day in range(days):
        new_field = field.copy()
        for i in range(1, field_size-1):
            for j in range(1, field_size-1):
                if field[i, j] == 0:  # infected cell
                    for di, dj in [(-1,0),(1,0),(0,-1),(0,1)]:
                        ni, nj = i+di, j+dj
                        if field[ni, nj] == 1:  # healthy neighbor
                            # Same variety = high spread, different = low spread
                            if varieties[ni, nj] == infected_variety:
                                if np.random.rand() < spread_prob:
                                    new_field[ni, nj] = 0
                            else:
                                if np.random.rand() < spread_prob * 0.05:  # 95% less likely
                                    new_field[ni, nj] = 0
        field = new_field
        daily_infected.append((field == 0).sum())
    return daily_infected, field

# Run simulations
mono_infected, mono_field = simulate_epidemic(1)  # monoculture
diverse_infected, diverse_field = simulate_epidemic(10)  # 10 varieties

# Epidemic curves
ax1.set_facecolor('#111827')
ax1.plot(range(len(mono_infected)), mono_infected, color='#ef4444', linewidth=2, label='Monoculture (1 variety)')
ax1.plot(range(len(diverse_infected)), diverse_infected, color='#22c55e', linewidth=2, label='Diverse (10 varieties)')
ax1.set_xlabel('Days', color='white')
ax1.set_ylabel('Infected plants', color='white')
ax1.set_title('Disease Spread: Monoculture vs Diversity', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Final field comparison
ax2.set_facecolor('#111827')
combined = np.zeros((field_size, field_size*2 + 2))
combined[:, :field_size] = mono_field
combined[:, field_size+2:] = diverse_field
cmap = plt.cm.colors.ListedColormap(['#ef4444', '#22c55e'])
ax2.imshow(combined, cmap=cmap, aspect='equal')
ax2.axvline(field_size + 0.5, color='white', linewidth=2)
ax2.text(field_size//2, -2, 'Monoculture', ha='center', color='#ef4444', fontsize=10, fontweight='bold')
ax2.text(field_size + 2 + field_size//2, -2, 'Diverse', ha='center', color='#22c55e', fontsize=10, fontweight='bold')
ax2.set_title(f'Field After {days} Days (green=healthy, red=infected)', color='white', fontsize=11)
ax2.axis('off')

plt.tight_layout()
plt.show()

mono_loss = mono_infected[-1] / (field_size**2) * 100
diverse_loss = diverse_infected[-1] / (field_size**2) * 100
print(f"After {days} days:")
print(f"  Monoculture: {mono_loss:.1f}% of field infected")
print(f"  Diverse (10 varieties): {diverse_loss:.1f}% of field infected")
print()
print("Diversity acts as a firebreak:")
print("  Disease can't jump easily between different varieties.")
print("  Susceptible plants are surrounded by resistant ones.")
print("  The epidemic is contained, not catastrophic.")`,
      challenge: 'Try 2, 5, 10, 20, and 50 varieties. Plot the final infection rate vs. number of varieties. Is there a point of diminishing returns? What\'s the minimum diversity needed to prevent catastrophic spread?',
      successHint: 'From seed banks to genetic diversity to wild relatives to Svalbard to traditional practices to monoculture risks — the message is consistent: diversity is survival. The Seed Keeper of Nagaland is not preserving the past. She is safeguarding the future.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Seed Banks & Genetic Preservation — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for genetics and ecology simulations. Click to start.</p>
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