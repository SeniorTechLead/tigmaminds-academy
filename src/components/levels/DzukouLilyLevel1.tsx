import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DzukouLilyLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Altitude and air pressure — why mountain air feels thin',
      concept: `**Atmospheric pressure** decreases as altitude increases. At sea level, air pressure is about 101,325 Pascals (1 atm). By the time you reach Dzukou Valley at ~2,450 m, pressure has dropped to roughly 75% of sea level.

Why? The atmosphere is a column of air above you. Climb higher and there is less air above — less weight pressing down — so pressure falls.

This matters enormously for plants. Lower pressure means:
- Less CO₂ available per breath of air (affects photosynthesis)
- Water boils at lower temperatures (cooking takes longer!)
- Less oxygen for animals (humans get altitude sickness)

📚 *In Python, we store numbers in **variables** using the = sign. A variable is just a name that points to a value.*`,
      analogy: 'Imagine a stack of blankets on your bed. Lying at the bottom, you feel the weight of all blankets above you (high pressure). Climb to the middle of the stack and only half the blankets are above — less weight. At the top, almost no weight at all. The atmosphere works the same way: climb higher, less air above, less pressure.',
      storyConnection: 'The Dzukou Lily grows at 2,450 m altitude in Nagaland, where air pressure is only 75% of sea level. Every aspect of the plant — from how it absorbs CO₂ to how it moves water through its stems — has adapted to this thin-air environment.',
      checkQuestion: 'If air pressure at sea level is 101,325 Pa, and it drops by roughly 12 Pa for every meter you climb (near sea level), why does the rate of decrease slow down at higher altitudes?',
      checkAnswer: 'Because the air at higher altitudes is less dense — there is less mass per meter of height. The pressure drop per meter depends on air density, which itself decreases with altitude. So each additional meter of height removes less air weight than the meter below it. This is why the relationship is exponential, not linear.',
      codeIntro: 'Calculate air pressure at different altitudes using the barometric formula.',
      code: `# Atmospheric pressure vs altitude
# Using the simplified barometric formula

sea_level_pressure = 101325  # Pascals
temperature = 288.15         # Kelvin (15°C standard)
lapse_rate = 0.0065          # K/m temperature drop with altitude
g = 9.81                     # gravity m/s²
M = 0.029                    # molar mass of air kg/mol
R = 8.314                    # gas constant J/(mol·K)

# Calculate pressure at different altitudes
altitudes = [0, 500, 1000, 1500, 2000, 2450, 3000, 4000, 5000]

print("Altitude (m) | Pressure (Pa) | % of sea level")
print("-" * 48)

for alt in altitudes:
    # Barometric formula
    pressure = sea_level_pressure * (1 - lapse_rate * alt / temperature) ** (g * M / (R * lapse_rate))
    percent = pressure / sea_level_pressure * 100
    marker = " <-- Dzukou Valley" if alt == 2450 else ""
    print(f"  {alt:>5} m    |  {pressure:>8.0f} Pa  |  {percent:5.1f}%{marker}")`,
      challenge: 'Add Mount Everest (8,849 m) to the altitude list. What percentage of sea-level pressure remains at the summit? Why do climbers need supplemental oxygen above ~8,000 m?',
      successHint: 'You have learned that air pressure drops exponentially with altitude, and this single factor shapes everything about mountain ecosystems — from plant photosynthesis to animal respiration.',
    },
    {
      title: 'UV radiation — the invisible threat that increases with altitude',
      concept: `**Ultraviolet (UV) radiation** from the Sun increases by about 10-12% for every 1,000 m of altitude gained. At Dzukou Valley (2,450 m), UV intensity is roughly 25-30% higher than at sea level.

Why? Two reasons:
1. Less atmosphere above to absorb UV
2. Less particulate matter and water vapor to scatter it

UV comes in three types:
- **UV-A** (315-400 nm): penetrates deep into skin/leaves, causes aging
- **UV-B** (280-315 nm): causes sunburn, DNA damage, but also vitamin D production
- **UV-C** (100-280 nm): blocked entirely by the ozone layer

For plants, excess UV-B is dangerous — it damages DNA and proteins. Mountain plants must evolve defenses.

📚 *Python **loops** let us repeat calculations. The **for** loop runs code once for each item in a list.*`,
      analogy: 'Think of the atmosphere as sunscreen. At sea level, you have a thick layer of sunscreen (lots of atmosphere). At 2,450 m, you have wiped off about a quarter of it. The "sunscreen" still helps, but more UV gets through. This is why you sunburn faster in the mountains, even when it feels cold.',
      storyConnection: 'The Dzukou Lily must survive UV levels 25-30% higher than lowland flowers. This is why it has evolved special pigments — the same reason mountain flowers worldwide tend to have vivid, deep colors. The lily\'s beauty is literally a survival mechanism.',
      checkQuestion: 'Why are UV levels even higher on snow-covered mountains than bare-rock mountains at the same altitude?',
      checkAnswer: 'Snow reflects up to 80-90% of UV radiation back upward, which then bounces off particles in the air and comes back down. This creates a "double dose" effect — you receive UV from above AND reflected UV from below. Bare rock and soil only reflect 2-10% of UV. This is why snow blindness is a real danger for mountaineers.',
      codeIntro: 'Model how UV intensity changes with altitude.',
      code: `# UV radiation intensity vs altitude

sea_level_uv = 1.0  # normalized UV index at sea level

altitudes = [0, 500, 1000, 1500, 2000, 2450, 3000, 4000]

print("How UV radiation increases with altitude")
print("=" * 50)
print(f"{'Altitude':>10} | {'UV (relative)':>14} | {'Increase':>8}")
print("-" * 50)

for alt in altitudes:
    # UV increases ~10-12% per 1000m
    uv = sea_level_uv * (1 + 0.11 * alt / 1000)
    increase = (uv - 1.0) * 100
    bar = "█" * int(uv * 20)
    tag = " <-- Dzukou" if alt == 2450 else ""
    print(f"  {alt:>5} m  |  {uv:>12.2f}x | +{increase:5.1f}% {bar}{tag}")

print()
dzukou_uv = sea_level_uv * (1 + 0.11 * 2450 / 1000)
print(f"At Dzukou Valley: UV is {dzukou_uv:.2f}x sea level")
print(f"A plant here receives {(dzukou_uv-1)*100:.0f}% more UV damage than a lowland cousin")`,
      challenge: 'What if the plant is on a south-facing slope (receives 15% more direct sunlight than flat ground)? Multiply the UV factor by 1.15 for south-facing slopes and compare.',
      successHint: 'You now understand why altitude increases UV exposure, and why mountain plants need special pigments to survive. This connects directly to why the Dzukou Lily has evolved its distinctive coloration.',
    },
    {
      title: 'Anthocyanins — nature\'s sunscreen for plants',
      concept: `**Anthocyanins** are pigments that give plants their red, purple, and blue colors. They are one of the most important UV-defense molecules in the plant kingdom.

How they work:
- Anthocyanins absorb UV-B and blue light (wavelengths 270-560 nm)
- They act as a "sunscreen" layer in the outer cells of petals and leaves
- They also function as **antioxidants**, neutralizing free radicals caused by UV damage

The color depends on pH:
- **Acidic** (pH < 3): red
- **Neutral** (pH ~7): purple
- **Basic** (pH > 11): blue

Mountain plants produce MORE anthocyanins than lowland relatives because they face more UV. This is measurable — you can extract anthocyanins and measure their concentration.

📚 *In Python, we can use **if/elif/else** statements to make decisions based on conditions.*`,
      analogy: 'Anthocyanins are like adjustable sunglasses for plants. In low UV (lowlands), the plant wears light-tinted lenses. In high UV (mountains), it puts on the darkest lenses it has. The "tint" is the purple-red color you see in mountain flowers. The deeper the color, the more protection.',
      storyConnection: 'The Dzukou Lily\'s distinctive color comes from anthocyanins — the plant\'s defense against intense mountain UV. When local people admire the lily\'s beauty, they are actually seeing a survival adaptation millions of years in the making.',
      checkQuestion: 'If anthocyanins protect against UV, why don\'t ALL plants produce maximum anthocyanins all the time?',
      checkAnswer: 'Because producing anthocyanins costs energy. The plant must divert sugars and amino acids from growth to pigment production. In low-UV environments, this cost is wasted — the plant grows slower for no benefit. Evolution favors the minimum anthocyanin production needed for the local UV level. This is why lowland flowers are often paler than their mountain relatives.',
      codeIntro: 'Model anthocyanin concentration based on UV exposure level.',
      code: `# Anthocyanin production model
# Plants produce more anthocyanin pigment under higher UV

uv_levels = [0.5, 0.8, 1.0, 1.2, 1.5, 1.8, 2.0, 2.5, 3.0]

print("Anthocyanin production vs UV exposure")
print("=" * 60)
print(f"{'UV level':>10} | {'Anthocyanin':>12} | {'Color':>10} | Visual")
print("-" * 60)

for uv in uv_levels:
    # Anthocyanin production follows a saturating curve
    # Michaelis-Menten-like: A = Amax * UV / (Km + UV)
    a_max = 100  # max anthocyanin (arbitrary units)
    km = 1.5     # half-saturation constant
    anthocyanin = a_max * uv / (km + uv)

    # Color intensity depends on concentration
    if anthocyanin < 20:
        color = "pale pink"
    elif anthocyanin < 40:
        color = "pink"
    elif anthocyanin < 60:
        color = "rose"
    elif anthocyanin < 80:
        color = "deep red"
    else:
        color = "purple"

    bar = "▓" * int(anthocyanin / 5)
    print(f"  {uv:>6.1f}x  |  {anthocyanin:>8.1f} AU  | {color:>10} | {bar}")

print()
dzukou_uv = 1.27  # UV at 2450m
dzukou_anth = a_max * dzukou_uv / (km + dzukou_uv)
print(f"Dzukou Valley UV: {dzukou_uv:.2f}x → anthocyanin: {dzukou_anth:.1f} AU")
print(f"The lily produces ~{dzukou_anth:.0f}% of its maximum pigment capacity")`,
      challenge: 'Add a "growth cost" column: for every 10 units of anthocyanin, growth rate decreases by 3%. At what UV level does the protection benefit outweigh the growth cost?',
      successHint: 'You have modeled a real biological trade-off: UV protection vs growth. This trade-off drives the evolution of flower color across altitudes.',
    },
    {
      title: 'Temperature and altitude — the lapse rate',
      concept: `Temperature drops with altitude at a rate called the **lapse rate**. In dry air, this is approximately **9.8°C per 1,000 m** (dry adiabatic lapse rate). In moist air (common in Nagaland\'s monsoon), it is about **6°C per 1,000 m** (saturated adiabatic lapse rate).

At Dzukou Valley (2,450 m), if the lowland temperature at sea level is 30°C:
- Dry lapse rate: 30 - (9.8 × 2.45) = 6°C
- Moist lapse rate: 30 - (6.0 × 2.45) = 15.3°C

This temperature difference is enormous for plants. The Dzukou Lily must survive:
- **Cool summers**: 10-20°C when lowlands are 30-35°C
- **Freezing winters**: below 0°C with frost
- **Rapid temperature swings**: 15-20°C difference between day and night

📚 *Python can do **arithmetic** with standard operators: + (add), - (subtract), * (multiply), / (divide).*`,
      analogy: 'Think of the atmosphere as a building with no heating. The ground floor (sea level) is warm because it is heated by the Earth\'s surface. Each floor above is a little cooler because the warm air from below has expanded and lost energy. By the 25th floor (2,500 m), it is significantly colder — like moving from a heated room to an unheated attic.',
      storyConnection: 'The Dzukou Valley experiences temperatures much colder than the lowlands of Nagaland just 30 km away. The lily blooms in summer when temperatures are briefly warm enough, then survives harsh winters as a dormant bulb underground — a strategy shaped entirely by the lapse rate.',
      checkQuestion: 'Why is the moist lapse rate (6°C/km) lower than the dry lapse rate (9.8°C/km)?',
      checkAnswer: 'When moist air rises and cools, water vapor condenses into droplets. Condensation releases latent heat, which partially offsets the cooling due to expansion. So moist air cools more slowly than dry air as it rises. This is why cloudy mountain slopes are warmer than you would predict from the dry lapse rate alone.',
      codeIntro: 'Compare temperatures at different altitudes using both lapse rates.',
      code: `# Temperature lapse rate comparison

sea_level_temp = 30  # °C, typical hot day in Nagaland lowlands
dry_lapse = 9.8      # °C per 1000m
moist_lapse = 6.0    # °C per 1000m (monsoon conditions)

altitudes = [0, 500, 1000, 1500, 2000, 2450, 3000]

print(f"Sea level temperature: {sea_level_temp}°C")
print(f"Dry lapse rate: {dry_lapse}°C/km | Moist lapse rate: {moist_lapse}°C/km")
print("=" * 58)
print(f"{'Altitude':>10} | {'Dry temp':>10} | {'Moist temp':>11} | {'Difference':>10}")
print("-" * 58)

for alt in altitudes:
    dry_temp = sea_level_temp - dry_lapse * alt / 1000
    moist_temp = sea_level_temp - moist_lapse * alt / 1000
    diff = moist_temp - dry_temp
    tag = " <-- Dzukou" if alt == 2450 else ""
    print(f"  {alt:>5} m  | {dry_temp:>8.1f}°C | {moist_temp:>9.1f}°C | {diff:>8.1f}°C{tag}")

print()
dzukou_dry = sea_level_temp - dry_lapse * 2.45
dzukou_moist = sea_level_temp - moist_lapse * 2.45
print(f"Dzukou Valley range: {dzukou_dry:.1f}°C (dry season) to {dzukou_moist:.1f}°C (monsoon)")
print(f"The lily must tolerate a {dzukou_moist - dzukou_dry:.1f}°C seasonal swing at this altitude")`,
      challenge: 'Calculate the altitude at which water would freeze (0°C) under both lapse rates, starting from 30°C at sea level. At what altitude does frost become a risk for plants?',
      successHint: 'You can now calculate mountain temperatures from sea-level data. This is how ecologists predict where plant species can survive — their altitudinal range is set by temperature.',
    },
    {
      title: 'Quadrat sampling — measuring plant populations',
      concept: `**Quadrat sampling** is a fundamental ecology method for estimating plant populations. A quadrat is simply a frame (often 1m × 1m) placed on the ground. You count every plant of your target species inside the frame, then repeat at random locations.

The method:
1. Define your study area (e.g., a meadow in Dzukou Valley)
2. Place quadrats at random locations
3. Count the target species in each quadrat
4. Calculate mean density = total count / total area sampled
5. Multiply by total area to estimate population

Why random placement? If you choose "good spots" where flowers are dense, you overestimate. If you avoid steep slopes, you miss populations there. Random sampling gives an unbiased estimate.

📚 *Python **lists** store multiple values in order. Create them with square brackets: counts = [3, 5, 2, 7]. Access items by index: counts[0] gives 3.*`,
      analogy: 'Imagine estimating the number of chocolate chips in a huge cookie. You cannot count them all, so you cut out 10 small squares from random spots and count the chips in each. Some squares have many, some few. The average chips-per-square times the total number of possible squares gives your estimate. That is quadrat sampling.',
      storyConnection: 'Conservation biologists use quadrat sampling to monitor the Dzukou Lily population each year. Is the population growing, shrinking, or stable? The answer determines whether conservation action is needed — and it all starts with counting lilies in small squares.',
      checkQuestion: 'If your quadrat counts are [3, 0, 5, 2, 8, 1, 4, 0, 6, 3], what is the mean density per quadrat? Why are the zeros important?',
      checkAnswer: 'Mean = (3+0+5+2+8+1+4+0+6+3)/10 = 32/10 = 3.2 plants per quadrat. The zeros are crucial — they represent locations where the lily does not grow. Excluding them would overestimate the average density. Real populations are patchy, and the zeros capture the gaps.',
      codeIntro: 'Simulate a quadrat survey of Dzukou Lily and estimate the total population.',
      code: `# Quadrat sampling simulation for Dzukou Lily

import numpy as np

# Simulate a real survey
np.random.seed(42)

# Study area: 500m x 500m meadow in Dzukou Valley
area_length = 500  # meters
area_width = 500
total_area = area_length * area_width  # 250,000 m²

# Quadrat size: 1m x 1m
quadrat_area = 1  # m²
n_quadrats = 20   # number of random samples

# True density varies across the meadow (patchy distribution)
# Poisson distribution with mean = 2.5 plants per m²
true_mean_density = 2.5
quadrat_counts = np.random.poisson(true_mean_density, n_quadrats)

print("Dzukou Lily Quadrat Survey Results")
print("=" * 40)
print(f"Study area: {area_length}m × {area_width}m = {total_area:,} m²")
print(f"Quadrat size: {quadrat_area} m² | Quadrats placed: {n_quadrats}")
print()
print("Counts per quadrat:")
for i, count in enumerate(quadrat_counts):
    bar = "🌸" * count if count > 0 else "  (empty)"
    print(f"  Quadrat {i+1:>2}: {count} {bar}")

mean_density = np.mean(quadrat_counts)
std_density = np.std(quadrat_counts, ddof=1)
estimated_pop = mean_density * total_area
std_error = std_density / np.sqrt(n_quadrats)
ci_low = (mean_density - 1.96 * std_error) * total_area
ci_high = (mean_density + 1.96 * std_error) * total_area

print(f"\\nMean density: {mean_density:.2f} ± {std_error:.2f} plants/m²")
print(f"Estimated population: {estimated_pop:,.0f} lilies")
print(f"95% confidence interval: {ci_low:,.0f} to {ci_high:,.0f} lilies")
print(f"True density was: {true_mean_density} plants/m² ({true_mean_density * total_area:,.0f} expected)")`,
      challenge: 'Try increasing n_quadrats from 20 to 50 and then 100. Watch what happens to the confidence interval width. How many quadrats do you need for the estimate to be within 10% of the true value?',
      successHint: 'You have learned the most fundamental method in field ecology. Every conservation estimate — from endangered species counts to forest biomass — uses some variant of quadrat sampling.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Alpine Botany Foundations</span>
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
