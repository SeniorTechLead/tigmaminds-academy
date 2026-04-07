import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MautamFamineLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is exponential growth?',
      concept: `**Exponential growth** happens when a population multiplies by a constant factor in each time period. If a pair of rats produces 6 offspring every 3 months, and each of those produces 6 more, the numbers explode:

\`P(t) = P₀ × r^t\`

Where:
- P₀ = initial population
- r = growth rate per period
- t = number of periods

Starting with 2 rats, after just 5 generations: 2 → 12 → 72 → 432 → 2,592 → 15,552

That is a 7,776× increase in about 15 months. Exponential growth is deceptively fast — it starts slow, then rockets upward.

📚 *In Python, the \`**\` operator computes powers: \`2**10\` gives 1024. We use loops to track population over multiple generations.*`,
      analogy: 'Exponential growth is like folding a piece of paper. One fold doubles the thickness. After 10 folds: 1,024 layers. After 20 folds: over a million layers. After 42 folds (if possible): the paper would reach the Moon. Each fold seems small, but the cumulative effect is staggering.',
      storyConnection: 'In the Mautam — the great bamboo flowering of Mizoram — rats feast on the massive bamboo seed crop. With unlimited food, rat populations grow exponentially, doubling and redoubling until they number in the millions. When the bamboo seeds run out, the rats devour crops, causing famine.',
      checkQuestion: 'If a rat population doubles every month and starts at 100, how many months until it exceeds 1 million?',
      checkAnswer: '100 × 2^t > 1,000,000. So 2^t > 10,000. Since 2^13 = 8,192 and 2^14 = 16,384, it takes about 14 months. From 100 rats to over a million in just over a year — this is why the Mautam causes such devastation.',
      codeIntro: 'Model exponential rat population growth during the Mautam bamboo flowering.',
      code: `# Exponential growth of rat population during Mautam

initial_rats = 100
growth_rate = 2.5  # population multiplier per month
months = 12

print("Rat Population Growth During Mautam")
print("=" * 45)

population = initial_rats
for month in range(months + 1):
    # Format large numbers with commas
    pop_str = f"{population:,.0f}"
    bar = "█" * min(int(population / 5000), 50)

    print(f"Month {month:2d}: {pop_str:>15} rats  {bar}")

    if month < months:
        population *= growth_rate

print(f"\\\nTotal increase: {population / initial_rats:,.0f}x in {months} months")
print(f"\\\nAt this rate, starting from 100 rats:")
print(f"  After 6 months:  {initial_rats * growth_rate**6:,.0f}")
print(f"  After 12 months: {initial_rats * growth_rate**12:,.0f}")
print(f"  After 18 months: {initial_rats * growth_rate**18:,.0f}")`,
      challenge: 'What if the growth rate were 3.0 instead of 2.5? How much faster does the population reach 1 million? Calculate the "doubling time" for each growth rate.',
      successHint: 'You modeled exponential growth — the most important pattern in population biology. Understanding it explains not just rat plagues but also bacterial infections, compound interest, viral spread, and the early stages of any epidemic.',
    },
    {
      title: 'Carrying capacity — nature\'s speed limit',
      concept: `No population can grow exponentially forever. Resources (food, space, water) are finite. The maximum population an environment can sustain is called the **carrying capacity** (K).

As a population approaches K:
- Food per individual decreases
- Disease spreads more easily
- Predation increases
- Birth rate drops, death rate rises

The **logistic growth** model captures this:
\`P(t+1) = P(t) + r × P(t) × (1 - P(t)/K)\`

The term \`(1 - P/K)\` acts as a brake:
- When P is small: (1 - P/K) ≈ 1, growth is nearly exponential
- When P = K/2: growth is fastest (maximum rate)
- When P = K: (1 - P/K) = 0, growth stops

📚 *This formula uses the current population to calculate the next one — a pattern called a recurrence relation. Loops in Python are perfect for computing these step by step.*`,
      analogy: 'Carrying capacity is like the maximum number of people an elevator can hold. The first few people get in easily. As it fills up, each additional person is harder to fit. At capacity, no one else can enter. If someone forces their way in, someone else gets pushed out (death equals birth).',
      storyConnection: 'Before the Mautam, Mizoram\'s forests support a normal rat population at carrying capacity — maybe a few thousand per square kilometer. The bamboo flowering temporarily raises K by providing an enormous food supply. When the seeds are gone, K crashes back down, and the excess rats devastate crops searching for food.',
      checkQuestion: 'In the logistic model, at what population size is the growth rate fastest?',
      checkAnswer: 'Maximum growth occurs at P = K/2. At this point, the growth term r × P × (1 - P/K) is maximized. Below K/2, there are too few individuals to reproduce quickly. Above K/2, resource competition slows growth. This inflection point is key to understanding population management.',
      codeIntro: 'Compare exponential vs. logistic growth to see how carrying capacity limits rat population.',
      code: `# Exponential vs Logistic growth in Mautam rats

K_normal = 5000      # normal carrying capacity
K_mautam = 500000    # during bamboo flowering
r = 0.3              # intrinsic growth rate
P0 = 100             # initial population
months = 36

# Simulate three scenarios
exp_pop = [P0]
log_normal = [P0]
log_mautam = [P0]

for t in range(months):
    # Exponential (unrestricted)
    exp_pop.append(exp_pop[-1] * (1 + r))

    # Logistic with normal K
    P = log_normal[-1]
    log_normal.append(P + r * P * (1 - P / K_normal))

    # Logistic with Mautam K
    P = log_mautam[-1]
    log_mautam.append(P + r * P * (1 - P / K_mautam))

print("Population Comparison Over 36 Months")
print(f"{'Month':>5} {'Exponential':>15} {'Normal K':>12} {'Mautam K':>12}")
print("-" * 48)

for t in range(0, months + 1, 3):
    print(f"{t:5d} {exp_pop[t]:>15,.0f} {log_normal[t]:>12,.0f} {log_mautam[t]:>12,.0f}")

print(f"\\\nNormal carrying capacity: {K_normal:,}")
print(f"Mautam carrying capacity: {K_mautam:,}")
print(f"\\\nThe Mautam allows {K_mautam/K_normal:.0f}x more rats than normal!")
print(f"When bamboo seeds run out, {K_mautam - K_normal:,} excess rats need food...")`,
      challenge: 'What happens after the Mautam ends at month 18? Switch K back to 5000 and continue the simulation. How fast does the population crash? This crash is when the famine hits.',
      successHint: 'You learned that carrying capacity is the key difference between theoretical exponential growth and real population dynamics. The Mautam tragedy is fundamentally a story of a temporary carrying capacity spike followed by a devastating collapse.',
    },
    {
      title: 'Birth rate, death rate, and population change',
      concept: `Population change depends on the balance between **birth rate** (b) and **death rate** (d):

\`ΔP = (b - d) × P\`

When b > d: population grows (more births than deaths)
When b < d: population shrinks (more deaths than births)
When b = d: population stable (equilibrium)

Both rates depend on conditions:
- **Abundant food**: b increases, d decreases → rapid growth
- **Scarce food**: b decreases, d increases → decline
- **Disease**: d spikes → crash

The **net growth rate** r = b - d determines population trajectory.

📚 *We can track birth and death rates separately using two variables in our loop. This gives us more insight than tracking just the total population.*`,
      analogy: 'A bathtub with the tap running and the drain open. The water level (population) depends on the inflow rate (births) vs. the drain rate (deaths). If you open the tap wide (lots of food → high births), the tub fills. If you open the drain wide (famine → high deaths), it empties. The Mautam is like turning the tap to maximum, then suddenly opening the drain.',
      storyConnection: 'During the bamboo flowering, rat birth rates skyrocket (ample food, healthy mothers, large litters) while death rates drop (no starvation, less competition). After the seeds run out, birth rates crash and death rates soar — but there is a lag. The peak rat population occurs weeks after the food runs out.',
      checkQuestion: 'If the birth rate is 0.4 per month and the death rate is 0.15 per month, with a population of 10,000, how many net new rats are added in one month?',
      checkAnswer: 'Net growth rate r = 0.4 - 0.15 = 0.25. New rats = 0.25 × 10,000 = 2,500. The population grows by 25% in one month. At this rate, it would double in about 3 months (since 1.25³ ≈ 1.95).',
      codeIntro: 'Track birth and death rates separately through the Mautam cycle.',
      code: `# Birth and death rates through the Mautam cycle

months = 36
P = 2000  # initial population

# Phase definitions
# Months 0-6: pre-Mautam (normal)
# Months 7-18: Mautam flowering (abundant food)
# Months 19-30: post-Mautam (food crash)
# Months 31-36: recovery

populations = [P]
birth_rates = []
death_rates = []
net_rates = []

for month in range(months):
    if month < 7:
        b = 0.08   # normal birth rate
        d = 0.07   # normal death rate
    elif month < 19:
        b = 0.25   # high birth rate (abundant seeds)
        d = 0.02   # low death rate (well-fed)
    elif month < 31:
        b = 0.03   # low birth rate (starving)
        d = 0.20   # high death rate (famine)
    else:
        b = 0.06   # recovering
        d = 0.08   # still elevated mortality

    birth_rates.append(b)
    death_rates.append(d)
    net_rates.append(b - d)

    births = int(b * P)
    deaths = int(d * P)
    P = max(P + births - deaths, 50)  # minimum viable population
    populations.append(P)

print("Mautam Cycle: Birth & Death Rates")
print(f"{'Month':>5} {'Pop':>10} {'Births':>8} {'Deaths':>8} {'Net':>8} {'Phase':<15}")
print("-" * 60)

for m in range(0, months, 2):
    phase = "Normal" if m < 7 else "MAUTAM" if m < 19 else "FAMINE" if m < 31 else "Recovery"
    net = birth_rates[m] - death_rates[m]
    sign = "+" if net > 0 else ""
    print(f"{m:5d} {populations[m]:>10,} {birth_rates[m]:>8.2f} {death_rates[m]:>8.2f} {sign}{net:>7.2f} {phase:<15}")

peak_pop = max(populations)
peak_month = populations.index(peak_pop)
print(f"\\\nPeak population: {peak_pop:,} at month {peak_month}")
print(f"Minimum after crash: {min(populations[19:]):,}")
print(f"Crash ratio: {peak_pop / min(populations[19:]):.0f}x decline")`,
      challenge: 'Add a "disease outbreak" at month 22 that temporarily triples the death rate for 3 months. How does this change the crash dynamics? Does the population recover to the same level?',
      successHint: 'You learned to model population change through separate birth and death rates. This decomposition reveals the mechanism behind population booms and crashes — it is not just about total numbers but about the balance between creation and destruction.',
    },
    {
      title: 'The boom-bust cycle',
      concept: `The Mautam follows a **boom-bust cycle**: a rapid population increase followed by a dramatic crash. This pattern repeats in nature:

1. **Resource pulse**: a sudden increase in food (bamboo seeds)
2. **Boom**: population grows exponentially to exploit the resource
3. **Overshoot**: population exceeds sustainable levels
4. **Bust**: resources exhausted, population crashes below carrying capacity
5. **Recovery**: slow return to equilibrium

The **overshoot** is critical. Because reproduction has a lag (gestation, maturation), the population keeps growing even after food starts declining. By the time deaths exceed births, the population is far above what the environment can support.

📚 *We model time delays using arrays that reference past values: \`food[t-delay]\` captures the lag between food availability and population response.*`,
      analogy: 'A boom-bust cycle is like a party that runs out of food. Early arrivals find abundant snacks (boom). Word spreads and more people come (exponential growth). By midnight, the food is gone (resource exhaustion). Hungry guests start leaving (bust). The next morning, only a few people remain (recovery). The bigger the party, the worse the food crash.',
      storyConnection: 'The Mautam bamboo flowering happens every 48 years in Mizoram. Elders who survived the previous Mautam warn the younger generation, but the scale is hard to imagine until it happens. The 1959 and 2007 Mautam events both caused devastating famines, following the same boom-bust pattern.',
      checkQuestion: 'Why does the population overshoot the carrying capacity instead of leveling off exactly at K?',
      checkAnswer: 'Time delays. Rats that are pregnant when food runs out still give birth. Rats born just before the crash are already alive. It takes time for starvation to increase death rates. These delays mean the population sails past the carrying capacity like a car that cannot brake instantly — the faster it was going (higher growth rate), the worse the overshoot.',
      codeIntro: 'Simulate a complete boom-bust cycle showing overshoot and crash.',
      code: `# Complete Mautam boom-bust cycle with overshoot

months = 48
P = 3000
K_base = 5000

populations = [P]
food_supply = []
carrying_caps = []

for month in range(months):
    # Food supply models bamboo seed availability
    if month < 6:
        food = 1.0  # normal
    elif month < 12:
        food = 1.0 + (month - 6) * 1.5  # flowering begins, seeds increasing
    elif month < 20:
        food = 10.0  # peak seed availability
    elif month < 28:
        food = 10.0 - (month - 20) * 1.2  # seeds running out
        food = max(food, 0.3)
    else:
        food = 0.3 + min((month - 28) * 0.035, 0.7)  # slow recovery

    K = K_base * food
    food_supply.append(food)
    carrying_caps.append(K)

    # Growth with 2-month delay in population response
    if month >= 2:
        effective_food = food_supply[month - 2]
    else:
        effective_food = food

    r = 0.15 * effective_food if P < K else -0.1 * (P / K)
    P = max(int(P + r * P), 100)
    populations.append(P)

print("MAUTAM BOOM-BUST CYCLE")
print("=" * 65)
print(f"{'Month':>5} {'Population':>12} {'Food':>6} {'Carry Cap':>12} {'Phase':<15}")
print("-" * 55)

for m in range(0, months, 2):
    phase = ("Normal" if m < 6 else "Flowering" if m < 12 else
             "Peak Seeds" if m < 20 else "Seeds Ending" if m < 28 else "Recovery")
    bar_len = min(int(populations[m] / 2000), 30)
    bar = "█" * bar_len
    print(f"{m:5d} {populations[m]:>12,} {food_supply[m]:>6.1f} {carrying_caps[m]:>12,.0f} {phase:<15} {bar}")

peak = max(populations)
peak_m = populations.index(peak)
trough = min(populations[20:])
trough_m = populations.index(trough, 20)

print(f"\\\nPeak: {peak:,} at month {peak_m}")
print(f"Trough: {trough:,} at month {trough_m}")
print(f"Overshoot above base K: {peak/K_base:.1f}x")
print(f"Crash magnitude: {peak/trough:.0f}x decline")
print(f"Months from peak to trough: {trough_m - peak_m}")`,
      challenge: 'Add a "government intervention" at month 15 that culls 50% of the rat population. Does this prevent the famine, or just delay it? What if the cull is at month 20 instead?',
      successHint: 'You modeled the complete Mautam boom-bust cycle with overshoot and time delays. This pattern is universal: it explains stock market bubbles, epidemic waves, and ecological disasters. The key insight is that overshoot is inevitable when growth responds to past conditions rather than current ones.',
    },
    {
      title: 'The 48-year bamboo cycle',
      concept: `Mizoram's bamboo species (Melocanna baccifera) flowers synchronously every **48 years** — one of the longest cycles in the plant kingdom. This **mast seeding** strategy is an evolutionary puzzle:

Why would a plant wait 48 years to reproduce?
- **Predator satiation**: by producing seeds all at once, the bamboo overwhelms seed predators. Most seeds survive because rats simply cannot eat them all.
- **Synchrony**: if all bamboo flowers together, no single plant is singled out for predation.
- **The cost**: the bamboo dies after flowering. It sacrifices itself for its seeds.

Historical Mautam events: 1862, 1911, 1959, 2007 — approximately every 48 years. Each caused famine.

📚 *We use modular arithmetic (\`year % 48\`) to model cyclic events. The remainder tells us where we are in the cycle.*`,
      analogy: 'Mast seeding is like a school of fish confusing a predator. One fish is easy to catch. A thousand fish swimming together overwhelm the predator — most escape. The bamboo does this with seeds: produce so many that the rats cannot eat them all, ensuring the next generation survives.',
      storyConnection: 'The Mizo people have known about the 48-year cycle for centuries. The word "Mautam" literally means "bamboo death." Elders use the cycle to prepare: stockpiling grain, organizing rat hunts, alerting the government. This indigenous knowledge is a form of ecological science, refined over generations.',
      checkQuestion: 'If predator satiation is the strategy, why does it still cause famine? Has the strategy failed?',
      checkAnswer: 'The strategy works perfectly for the bamboo — most seeds survive and germinate. The famine is a side effect: the rat population boom that the seeds cause. From the bamboo\'s perspective, the rats are a minor tax on a massive seed crop. From the human perspective, the resulting rat plague is devastating. The strategy has not failed; it just was not designed with human agriculture in mind.',
      codeIntro: 'Model the 48-year bamboo flowering cycle and its impact on rat populations across centuries.',
      code: `# Multi-century Mautam cycle simulation

years = 200
start_year = 1860
last_mautam = 1862

rat_pop = 5000  # baseline
grain_stores = 100  # arbitrary units

populations = []
grain_history = []
mautam_years = []

for year in range(start_year, start_year + years):
    cycle_pos = (year - last_mautam) % 48

    # Is this a Mautam year?
    is_mautam = cycle_pos == 0 and year >= last_mautam
    pre_mautam = cycle_pos >= 46
    post_mautam = cycle_pos <= 3 and cycle_pos > 0

    if is_mautam:
        mautam_years.append(year)
        rat_pop *= 8   # massive boom
        grain_stores *= 0.2  # rats destroy 80% of grain
    elif post_mautam:
        rat_pop = int(rat_pop * 0.4)  # crash after seeds gone
        grain_stores = min(grain_stores * 1.3, 100)
    elif pre_mautam:
        rat_pop = int(rat_pop * 1.1)  # slight pre-bloom increase
        grain_stores *= 0.95
    else:
        # Normal year: slow return to baseline
        rat_pop = int(rat_pop + (5000 - rat_pop) * 0.15)
        grain_stores = min(grain_stores + 5, 100)

    populations.append(rat_pop)
    grain_history.append(grain_stores)

print("48-Year Bamboo Flowering Cycle (1860-2060)")
print("=" * 60)

# Show key years around each Mautam
for my in mautam_years:
    idx_base = my - start_year
    print(f"\\\n--- MAUTAM EVENT: {my} ---")
    for offset in [-2, -1, 0, 1, 2, 3, 5, 10]:
        idx = idx_base + offset
        if 0 <= idx < years:
            yr = start_year + idx
            status = " ← MAUTAM!" if offset == 0 else ""
            bar = "█" * min(int(populations[idx] / 2000), 30)
            print(f"  {yr}: Rats {populations[idx]:>8,}  Grain {grain_history[idx]:>5.0f}%  {bar}{status}")

print(f"\\\nMautam years detected: {mautam_years}")
print(f"Cycle length: ~{mautam_years[1] - mautam_years[0]} years")
print(f"\\\nThis cycle has repeated for centuries.")
print(f"Next predicted Mautam: ~{mautam_years[-1] + 48}")`,
      challenge: 'What if climate change shifts the flowering cycle from 48 years to 40 years? Modify the simulation and compare: more frequent but perhaps less intense events, or worse overall? Add grain stockpiling that starts 5 years before each predicted Mautam.',
      successHint: 'You modeled a multi-century ecological cycle using basic Python. The 48-year bamboo cycle is one of nature\'s most dramatic examples of periodic biological events. Understanding it combines ecology, evolutionary biology, and the resilience of indigenous knowledge systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Ecology & Population Dynamics</span>
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
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
