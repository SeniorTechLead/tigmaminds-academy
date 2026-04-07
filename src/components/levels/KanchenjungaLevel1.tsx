import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KanchenjungaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is a glacier? — Rivers of ice that carve mountains',
      concept: `**Glaciers** are massive bodies of ice that form when snow accumulates and compresses over centuries. Unlike a frozen lake, a glacier *moves* — it flows downhill under its own weight, carving valleys and shaping landscapes.

Kanchenjunga, the third-highest peak on Earth at 8,586 m, hosts over 120 glaciers. The Zemu Glacier on its eastern face stretches 26 km — the longest glacier in the eastern Himalayas.

How glaciers form:
1. **Snowfall accumulates** year after year in high basins (cirques)
2. **Compression**: weight of new snow crushes lower layers, squeezing out air
3. **Recrystallization**: after ~2 years, snow becomes **firn** (dense granular ice)
4. **Glacier ice**: after ~50-100 years, firn compresses into solid glacier ice with a density of ~900 kg/m³

Fresh snow has a density of about 50-70 kg/m³. Glacier ice is ~900 kg/m³. That is a 12-15× compression — like squeezing a pillow into a marble.

📚 *We will use Python variables and arithmetic to model this compression process step by step.*`,
      analogy: 'Imagine stacking hundreds of blankets on top of each other. The bottom blankets get crushed flat — all the air squeezed out. Over enough time, they would fuse into a single dense sheet. That is what happens to snow becoming glacier ice, except it takes decades instead of minutes.',
      storyConnection: 'In the story, the five treasures of Kanchenjunga include gold, silver, gems, grain, and sacred texts. The glaciers are a sixth treasure — frozen reservoirs that feed rivers sustaining millions of people downstream. Without glaciers, the rivers would run dry in summer when water is needed most.',
      checkQuestion: 'If fresh snow has a density of 60 kg/m³ and glacier ice is 900 kg/m³, how many meters of fresh snow are needed to produce 1 meter of glacier ice?',
      checkAnswer: 'Since mass is conserved: 60 × h_snow = 900 × 1, so h_snow = 900/60 = 15 meters. You need 15 meters of fresh snow to produce just 1 meter of glacier ice. This is why glaciers take decades to form — they need enormous amounts of accumulated snowfall.',
      codeIntro: 'Calculate how snow compresses into glacier ice through each stage of transformation.',
      code: `# Snow to glacier ice: a compression journey

# Densities in kg/m³ at each stage
fresh_snow = 60
settled_snow = 200   # after a few weeks
firn = 550           # after 1-2 years
glacier_ice = 900    # after 50-100 years

stages = ["Fresh snow", "Settled snow", "Firn", "Glacier ice"]
densities = [fresh_snow, settled_snow, firn, glacier_ice]

print("=== Snow-to-Ice Compression on Kanchenjunga ===")
print()

for i, (stage, density) in enumerate(zip(stages, densities)):
    # How many meters of this stage to make 1m of glacier ice
    meters_needed = glacier_ice / density
    compression = density / fresh_snow
    print(f"Stage {i+1}: {stage}")
    print(f"  Density: {density} kg/m³")
    print(f"  Compression from fresh snow: {compression:.1f}x")
    print(f"  Meters needed for 1m ice: {meters_needed:.1f}m")
    print()

total_compression = glacier_ice / fresh_snow
print(f"Total compression: {total_compression:.0f}x")
print(f"A 15-story building of snow becomes 1 story of ice!")`,
      challenge: 'Add a "wet snow" stage between fresh and settled snow with a density of 150 kg/m³. How does it fit into the compression sequence?',
      successHint: 'You have learned that glacier formation is a slow, relentless compression process. The density numbers are not arbitrary — they represent real physical stages that glaciologists measure with ice cores.',
    },
    {
      title: 'Temperature and altitude — why mountains are cold',
      concept: `As you climb higher, temperature drops. This is called the **lapse rate** — the rate at which air cools with altitude. In the troposphere (the lowest layer of atmosphere), temperature decreases by roughly **6.5°C per 1,000 m** of elevation gain.

Why? Two reasons:
1. **Pressure decreases** with altitude. Lower pressure means air expands, and expanding gas cools (adiabatic cooling).
2. **Less infrared absorption**: the ground absorbs sunlight and re-emits infrared. Air near the ground absorbs this heat. Higher up, there is less re-radiated heat.

At Kanchenjunga's base camp (~5,100 m), expect temperatures about 33°C colder than sea level on the same day. At the summit (8,586 m), it is about 56°C colder.

If sea level is 25°C (a warm day in Gangtok), the summit is about -31°C. In winter, summit temperatures drop below -40°C with wind chill far worse.

📚 *We will use Python's basic math operations to compute temperature at any altitude.*`,
      analogy: 'Think of the atmosphere as a stack of blankets on your bed. The blanket closest to you (the ground) is warmest. Each blanket above is a little cooler. By the time you reach the top blanket (high altitude), it is quite cold. The "heat source" (your body = the Earth\'s surface) is at the bottom.',
      storyConnection: 'The story tells of the five treasures hidden in Kanchenjunga\'s snowy peaks. Those peaks stay frozen precisely because of the lapse rate — at 8,586 m, it is perpetually below freezing. The "treasures" are locked in ice that exists only because altitude steals heat from the air.',
      checkQuestion: 'At what altitude would the temperature reach 0°C on a day when sea level is 20°C? (Use a lapse rate of 6.5°C/km)',
      checkAnswer: 'We need to lose 20°C. At 6.5°C per km: altitude = 20 / 6.5 = 3.08 km = 3,077 m. This is the "freezing line" — above it, precipitation falls as snow instead of rain. This line is critical for glacier survival.',
      codeIntro: 'Model the temperature profile from Gangtok to the summit of Kanchenjunga.',
      code: `# Temperature vs altitude on Kanchenjunga

lapse_rate = 6.5  # °C per 1000 m
sea_level_temp = 25  # °C (warm day)

# Key elevations in meters
locations = {
    "Gangtok (capital)": 1650,
    "Yuksom (trek start)": 1780,
    "Dzongri viewpoint": 4020,
    "Goecha La pass": 4940,
    "Base camp": 5100,
    "Camp 2": 6400,
    "Summit": 8586
}

print("=== Temperature Profile: Gangtok to Summit ===")
print(f"Sea level temperature: {sea_level_temp}°C")
print(f"Lapse rate: {lapse_rate}°C per 1000m")
print()

freezing_alt = sea_level_temp / lapse_rate * 1000

for name, alt in locations.items():
    temp = sea_level_temp - (lapse_rate * alt / 1000)
    frozen = "❄️ FROZEN" if temp < 0 else ""
    print(f"{name:25s} {alt:5d}m → {temp:6.1f}°C {frozen}")

print(f"\\\nFreezing line: {freezing_alt:.0f}m")
print("Everything above this line builds glaciers!")`,
      challenge: 'What if global warming raises sea-level temperature by 2°C? Recalculate the freezing line. How much higher does it move?',
      successHint: 'The lapse rate is one of the most important numbers in mountain science. A small change at sea level shifts the freezing line by hundreds of meters, potentially dooming glaciers that have existed for millennia.',
    },
    {
      title: 'Snowfall and accumulation — feeding the glacier',
      concept: `Glaciers need a constant diet of snow. The **accumulation zone** is the upper part of a glacier where snowfall exceeds melting. The **ablation zone** is the lower part where melting exceeds snowfall.

The boundary between them is the **equilibrium line altitude (ELA)** — where accumulation exactly equals ablation over a year.

On Kanchenjunga's glaciers:
- **Accumulation zone**: above ~5,500 m, receives 1-3 m of snow per year
- **ELA**: approximately 5,400-5,600 m
- **Ablation zone**: below 5,400 m, ice melts and calves

The Indian summer monsoon (June-September) delivers ~80% of the annual snowfall to Kanchenjunga. This is unusual — most Himalayan glaciers get winter snow. Kanchenjunga's eastern face catches monsoon moisture directly from the Bay of Bengal.

If annual snowfall drops below annual melting, the ELA rises and the glacier shrinks. This is happening now — the ELA on many Himalayan glaciers has risen 100-200 m in the past 50 years.

📚 *We will use Python lists and loops to track snowfall over a simulated year.*`,
      analogy: 'A glacier is like a bank account. Snowfall is income (deposits). Melting is spending (withdrawals). The ELA is the break-even point. If you spend more than you earn, your balance (glacier) shrinks. If climate change cuts your income and increases your spending, bankruptcy (glacier disappearance) is inevitable.',
      storyConnection: 'The five treasures of Kanchenjunga are said to be revealed only when the world is in desperate need. In a grim irony, as glaciers shrink from warming, the "treasures" — the rocks and sediment hidden under ice for millennia — are indeed being revealed. But this revelation signals crisis, not salvation.',
      checkQuestion: 'If a glacier receives 2 m of snow per year (water equivalent 0.4 m) and loses 0.5 m of ice per year to melting, is it growing or shrinking?',
      checkAnswer: 'Convert snow to ice: 2 m of snow at density ~200 kg/m³ = 0.4 m water equivalent. Melt loss: 0.5 m of ice ≈ 0.45 m water equivalent (ice density 900 kg/m³). Since 0.4 < 0.45, the glacier is shrinking — losing about 0.05 m water equivalent per year. Over decades, this adds up.',
      codeIntro: 'Simulate monthly snowfall and melting on a Kanchenjunga glacier over one year.',
      code: `# Annual snow budget for a Kanchenjunga glacier

months = ["Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"]

# Monthly snowfall in cm (monsoon-dominated)
snowfall = [15, 12, 10, 8, 20, 45, 80, 75, 40, 10, 5, 12]

# Monthly melt in cm (temperature-driven)
melt =     [2,  3,  5, 12, 25, 30, 20, 18, 15, 8,  3,  2]

print("=== Monthly Snow Budget (Kanchenjunga Glacier) ===")
print(f"{'Month':>5} {'Snow(cm)':>10} {'Melt(cm)':>10} {'Net(cm)':>10}")
print("-" * 40)

total_snow = 0
total_melt = 0
cumulative = 0

for i in range(12):
    net = snowfall[i] - melt[i]
    cumulative += net
    total_snow += snowfall[i]
    total_melt += melt[i]
    sign = "+" if net >= 0 else ""
    print(f"{months[i]:>5} {snowfall[i]:>10} {melt[i]:>10} {sign}{net:>9}")

print("-" * 40)
print(f"{'Total':>5} {total_snow:>10} {total_melt:>10} {total_snow - total_melt:>+10}")
print()

if total_snow > total_melt:
    print(f"Glacier GAINS {total_snow - total_melt} cm this year ✓")
else:
    print(f"Glacier LOSES {total_melt - total_snow} cm this year ✗")

monsoon = sum(snowfall[5:9])
print(f"\\\nMonsoon (Jun-Sep) delivers {monsoon} of {total_snow} cm = {monsoon/total_snow*100:.0f}% of annual snow")`,
      challenge: 'Increase each month\'s melt by 20% to simulate a warmer year. Does the glacier still gain mass? At what percentage increase does it start losing mass?',
      successHint: 'You have built a simple mass balance model. Real glaciologists do exactly this — they measure snow and melt month by month to determine if a glacier is healthy or dying. The monsoon dependence makes Kanchenjunga\'s glaciers especially vulnerable to changing rainfall patterns.',
    },
    {
      title: 'Glacier flow — ice that moves like honey',
      concept: `Glaciers are not static blocks of ice — they **flow**. The enormous weight of accumulated ice creates pressure that causes the ice to deform plastically and slide downhill. Glacier flow speeds range from a few centimeters to several meters per day.

Two mechanisms drive glacier movement:
1. **Internal deformation (creep)**: ice crystals slide past each other under pressure. This happens throughout the glacier but is strongest near the base.
2. **Basal sliding**: meltwater at the base lubricates the interface between ice and rock. The glacier slides over bedrock like a sled on a wet surface.

Flow speed depends on:
- **Thickness**: thicker = more pressure = faster flow
- **Slope**: steeper = stronger gravitational pull
- **Temperature**: warmer base = more meltwater = more sliding
- **Bed roughness**: smooth bedrock = faster sliding

The Zemu Glacier on Kanchenjunga flows at about 20-40 m/year. That is roughly 5-11 cm/day — too slow to see, but measurable over weeks.

📚 *We will use multiplication and division to estimate glacier velocity from simple physical properties.*`,
      analogy: 'Pour honey on a tilted plate. It flows — slowly, thickly, pulled by gravity. Now imagine that honey is 200 meters thick and the plate is a mountain slope. That is a glacier. The thicker the honey (ice), the steeper the plate (slope), the faster it flows.',
      storyConnection: 'The story speaks of Kanchenjunga as eternal and unchanging. But its glaciers are anything but — they are rivers of ice in constant, imperceptible motion. The "eternal snows" are actually flowing downhill at centimeters per day, carving the very mountain the story reveres.',
      checkQuestion: 'If the Zemu Glacier flows at 30 m/year and is 26 km long, how many years would it take for a snowflake at the top to reach the bottom? (Assume constant speed.)',
      checkAnswer: '26,000 m ÷ 30 m/year = 867 years. A snowflake that fell on Kanchenjunga during the reign of the Chogyal dynasty in the 12th century might only now be reaching the glacier\'s terminus. Glaciers are slow-motion time machines.',
      codeIntro: 'Estimate glacier flow speed based on thickness and slope angle.',
      code: `# Simplified glacier flow velocity model
# v = k * thickness^n * sin(slope)
# where k is a constant and n ≈ 3-4 for ice

import math

# Glen's flow law simplified parameters
k = 0.00015  # empirical constant (m/yr units)
n = 3        # flow law exponent for ice

# Zemu Glacier parameters
thickness_m = 200     # meters of ice
slope_deg = 5         # degrees

slope_rad = math.radians(slope_deg)

# Internal deformation velocity (simplified)
v_deform = k * (thickness_m ** n) * math.sin(slope_rad)

# Basal sliding (roughly equal to deformation for temperate glaciers)
v_slide = v_deform * 0.8

v_total = v_deform + v_slide

print("=== Zemu Glacier Flow Estimate ===")
print(f"Ice thickness: {thickness_m} m")
print(f"Slope angle: {slope_deg}°")
print()
print(f"Internal deformation: {v_deform:.1f} m/year")
print(f"Basal sliding:       {v_slide:.1f} m/year")
print(f"Total flow speed:    {v_total:.1f} m/year")
print(f"That is {v_total/365:.2f} m/day = {v_total/365*100:.1f} cm/day")
print()

# Compare different thicknesses
print("=== How Thickness Affects Speed ===")
for t in [50, 100, 150, 200, 250, 300]:
    v = k * (t ** n) * math.sin(slope_rad) * 1.8
    print(f"  {t:3d}m thick → {v:7.1f} m/year")

print()
print("Notice: doubling thickness increases speed 8x (because n=3)")`,
      challenge: 'Try changing the slope from 5° to 10°. How much faster does the glacier flow? What if the slope is only 2°?',
      successHint: 'You have learned that glacier flow follows a power law — small changes in thickness cause dramatic speed changes. This is Glen\'s Flow Law, one of the fundamental equations of glaciology. The cubic relationship means thick glaciers are incredibly fast movers.',
    },
    {
      title: 'Glacial retreat — measuring what we are losing',
      concept: `**Glacial retreat** means the glacier\'s terminus (lower end) is moving uphill because melting outpaces accumulation. It does not mean the ice is flowing backward — it means the front is melting faster than new ice arrives.

The Himalayan glaciers are retreating at alarming rates:
- **Zemu Glacier** (Kanchenjunga): retreated ~1.5 km since 1976, losing ~35 m/year
- **Gangotri Glacier** (source of the Ganges): retreating ~20 m/year
- **Global average**: mountain glaciers have lost ~30% of their mass since 1900

Why does this matter?
- **1.9 billion people** depend on Himalayan glacier meltwater
- Rivers like the Teesta (fed by Kanchenjunga glaciers) provide drinking water, irrigation, and hydropower
- Glacial lakes form behind debris dams — these can burst catastrophically (**GLOF**: Glacial Lake Outburst Flood)
- In 2023, a GLOF from South Lhonak Lake in Sikkim killed over 40 people and destroyed a dam

📚 *We will use Python loops and running totals to track glacier length over time.*`,
      analogy: 'Imagine an ice cream cone on a hot day. The top (summit) gets new scoops (snowfall), but the bottom melts and drips. If the day gets hotter (climate change), the melting speeds up. The cone gets shorter even though you keep adding scoops. Eventually, you are left holding an empty cone.',
      storyConnection: 'The five treasures of Kanchenjunga were meant to be protected forever by ice. But the ice itself is disappearing. The glaciers that feed Sikkim\'s rivers — the Teesta, the Rangit — are losing mass every year. The story\'s promise of eternal protection is being broken by a warming climate.',
      checkQuestion: 'If the Zemu Glacier retreats at 35 m/year and is currently 26 km long, how many years until it is half its current length?',
      checkAnswer: 'It needs to lose 13 km = 13,000 m. At 35 m/year: 13,000/35 = 371 years. But this assumes a constant retreat rate — in reality, retreat is accelerating. Some models predict Himalayan glaciers could lose 50% of their mass by 2100 at current emission rates, much sooner than this linear estimate.',
      codeIntro: 'Simulate the retreat of the Zemu Glacier over 100 years with accelerating melt rates.',
      code: `# Zemu Glacier retreat simulation

initial_length = 26000  # meters (26 km)
base_retreat = 35       # m/year (current rate)
acceleration = 0.5      # m/year² (retreat speeds up)

length = initial_length
year = 2024

print("=== Zemu Glacier Retreat Projection ===")
print(f"{'Year':>6} {'Length(km)':>12} {'Retreat(m/yr)':>14} {'Lost(%)':>9}")
print("-" * 45)

for i in range(0, 101, 10):
    retreat_rate = base_retreat + acceleration * i
    pct_lost = (1 - length / initial_length) * 100
    print(f"{year + i:>6} {length/1000:>12.2f} {retreat_rate:>14.1f} {pct_lost:>8.1f}%")

    # Advance 10 years
    for y in range(10):
        rate = base_retreat + acceleration * (i + y)
        length -= rate
        if length < 0:
            length = 0

print()
total_lost = initial_length - length
print(f"Total retreat by 2124: {total_lost/1000:.1f} km")
print(f"Remaining: {length/1000:.1f} km ({length/initial_length*100:.1f}%)")
print()
print("Every meter of retreat = less water for Sikkim")`,
      challenge: 'What if we reduce the acceleration to 0.2 (by cutting emissions)? How much more glacier remains in 2124? What about acceleration = 0 (holding current rate steady)?',
      successHint: 'You have built a glacier retreat model with acceleration — a key concept in climate science. The difference between scenarios shows why emission reduction matters: even small changes in the rate of warming save enormous amounts of ice over a century.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Glaciology fundamentals with basic Python</span>
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
