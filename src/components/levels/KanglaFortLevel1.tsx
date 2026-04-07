import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KanglaFortLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The moat around Kangla — why water protects a fort',
      concept: `**Kangla Fort** in Imphal, Manipur, was the seat of the Meitei kings for nearly 2,000 years. Its most striking feature is the **moat** — a wide channel of water surrounding the entire fort.

A moat is not just decorative. It is a defensive water barrier that:
- **Slows attackers**: soldiers cannot charge across deep water
- **Prevents tunnelling**: water seeps into any tunnel dug beneath it
- **Provides early warning**: splashing water alerts defenders
- **Supplies the fort**: fish, irrigation, and drinking water

The Kangla moat draws from the Imphal River. Meitei engineers controlled its depth using **sluice gates** — doors that slide up and down to regulate water flow.

In Python, we use **variables** to store values like width, depth, and length — the basic measurements any hydraulic engineer needs.`,
      analogy: 'A moat works like the ring of empty space around a chess king. You cannot attack the king without first crossing that space, and crossing it leaves you exposed. Water makes that "empty space" far more dangerous.',
      storyConnection: 'The Kangla Fort story describes how the Meitei people built their capital surrounded by water — not because they feared the land, but because they understood that water is both shield and resource. The moat was engineering, not magic.',
      checkQuestion: 'If a moat is 3 metres deep and 15 metres wide, why is it harder to cross than flat ground of the same width?',
      checkAnswer: 'Soldiers wearing armour sink in water. Swimming is far slower than running — about 2 km/h vs 15 km/h. Weapons are useless while swimming. Defenders can shoot at exposed heads. The water itself is the weapon.',
      codeIntro: 'Calculate the volume of water needed to fill the Kangla Fort moat.',
      code: `# Kangla Fort moat — basic volume calculation
# The moat is roughly rectangular in cross-section

length = 1580    # perimeter of moat in metres (approximate)
width = 15       # average width in metres
depth = 3        # average depth in metres

volume = length * width * depth
print(f"Moat perimeter: {length} m")
print(f"Moat width: {width} m")
print(f"Moat depth: {depth} m")
print(f"Water volume: {volume:,} cubic metres")
print(f"That's {volume * 1000:,} litres!")
print(f"Or about {volume * 1000 / 50:.0f} tanker trucks (50,000 L each)")`,
      challenge: 'Change the depth to 4 metres and the width to 20 metres. How much more water is needed? Calculate the percentage increase.',
      successHint: 'You just learned that volume scales with all three dimensions. Doubling one dimension doubles the volume, but increasing two dimensions multiplies the effect.',
    },
    {
      title: 'Sluice gates — controlling water with simple machines',
      concept: `A **sluice gate** is a sliding barrier used to control water flow. The Kangla Fort engineers used sluice gates to:
- **Fill the moat** during the monsoon by opening gates from the Imphal River
- **Drain sections** for maintenance or to trap invaders in mud
- **Control depth** so the moat stayed deep enough to be impassable

The flow rate through a sluice gate depends on the **opening height** and the **water pressure** behind it. More pressure = faster flow.

In Python, we use **if/else statements** to make decisions — just like a gate operator deciding whether to open or close the gate based on water level.

\`if water_level > max_safe:\` means "check if the water is too high."`,
      analogy: 'A sluice gate is like the valve on a garden hose. Turn it a little — a trickle. Open it fully — a torrent. The water pressure is always there; the gate just decides how much gets through.',
      storyConnection: 'In the story, the fort commanders could flood or drain the moat at will. This was not brute force — it was precise control. A sluice gate gave them power over water the way a steering wheel gives power over a car.',
      checkQuestion: 'Why would defenders want to partially drain the moat rather than keep it full?',
      checkAnswer: 'A half-drained moat creates deep mud — even harder to cross than water. Soldiers get stuck in mud and become easy targets. The defenders could then re-flood the moat to drown anyone trapped in it. Controlling water level was a tactical weapon.',
      codeIntro: 'Simulate a sluice gate operator deciding whether to open or close the gate.',
      code: `# Sluice gate control logic
water_level = 2.8  # current depth in metres
max_safe = 3.5     # maximum safe depth
min_defence = 2.0  # minimum defensive depth
gate_open = True    # is the gate currently open?

print(f"Current water level: {water_level} m")
print(f"Safe range: {min_defence} m to {max_safe} m")
print()

if water_level > max_safe:
    action = "CLOSE gate — water too high, risk of overflow!"
    gate_open = False
elif water_level < min_defence:
    action = "OPEN gate — water too low, moat is crossable!"
    gate_open = True
else:
    action = "HOLD — water level is in safe defensive range."

print(f"Decision: {action}")
print(f"Gate status: {'OPEN' if gate_open else 'CLOSED'}")

# Test different levels
for level in [1.5, 2.5, 3.0, 3.8]:
    if level > max_safe:
        status = "TOO HIGH"
    elif level < min_defence:
        status = "TOO LOW"
    else:
        status = "GOOD"
    print(f"  Level {level}m → {status}")`,
      challenge: 'Add a new condition: if water_level is between 2.0 and 2.5, print a warning that the moat is getting shallow. Test with water_level = 2.3.',
      successHint: 'You just wrote decision logic — the foundation of all automation. Every smart system, from thermostats to self-driving cars, works on the same principle: measure, compare, act.',
    },
    {
      title: 'Rammed earth walls — strength from compression',
      concept: `Kangla Fort's walls were not made of stone or brick — they were built from **rammed earth**. This ancient technique involves:
1. Pouring moist soil into a wooden frame (formwork)
2. **Compacting** it with heavy wooden rammers
3. Removing the frame and repeating layer by layer

Rammed earth is surprisingly strong because:
- **Compression** forces soil particles together, eliminating air gaps
- **Clay content** acts as natural cement when it dries
- **Layer-by-layer** building distributes weight evenly

A well-built rammed earth wall can support **10-20 kg per square centimetre** — enough to build walls 3-4 metres high.

In Python, **for loops** let us repeat an action many times — just like the workers who rammed hundreds of layers to build one wall.`,
      analogy: 'Making rammed earth is like making a snowball. Loose snow is weak, but if you squeeze it hard enough, the crystals lock together and it becomes solid. Rammed earth works the same way — pressure turns loose soil into something almost as hard as concrete.',
      storyConnection: 'The Kangla Fort walls have survived earthquakes, wars, and centuries of monsoon rain. The Meitei builders did not need imported stone — they turned the soil beneath their feet into fortress walls. This is engineering with local materials.',
      checkQuestion: 'Why does ramming the earth make it stronger? What happens to the air gaps?',
      checkAnswer: 'Loose soil is about 40% air. Ramming compresses it to about 10-15% air. The soil particles are forced into direct contact, and friction between them resists movement. Clay particles, when wet, act like glue that hardens as it dries. The result is a material that resists both compression and erosion.',
      codeIntro: 'Simulate building a rammed earth wall layer by layer and track how compression increases density.',
      code: `# Rammed earth wall — layer by layer construction
layers = 20  # number of layers to build
initial_density = 1400  # loose soil density (kg/m³)
max_density = 2000      # fully compacted density (kg/m³)
layer_height = 0.15     # height of each layer in metres

print("Building a rammed earth wall...")
print(f"Target: {layers} layers, {layers * layer_height:.1f}m tall")
print()

total_height = 0
for layer in range(1, layers + 1):
    # Each layer of ramming increases density
    compression_ratio = layer / layers
    density = initial_density + (max_density - initial_density) * compression_ratio
    total_height += layer_height

    if layer % 5 == 0 or layer == 1:
        print(f"Layer {layer:2d}: height = {total_height:.2f}m, density = {density:.0f} kg/m³")

print(f"\\nFinal wall: {total_height:.1f}m tall")
print(f"Final density: {max_density} kg/m³")
print(f"Density increase: {(max_density/initial_density - 1)*100:.0f}%")
print(f"That's {max_density/initial_density:.1f}x denser than loose soil!")`,
      challenge: 'What if workers skip every other ramming step (only ram on even-numbered layers)? Modify the loop to only increase density on even layers. How does the final density compare?',
      successHint: 'You just modelled a real construction process with a for loop. Each iteration is one physical action — and the cumulative effect is what matters.',
    },
    {
      title: 'Water pressure — why deeper moats are deadlier',
      concept: `The deeper a moat, the harder it is to cross — but not just because of depth. **Water pressure** increases with depth:

**P = rho x g x h**

Where:
- P = pressure (Pascals)
- rho = water density (1000 kg/m³)
- g = gravity (9.8 m/s²)
- h = depth (metres)

At 1 metre depth, pressure is about 9,800 Pa (enough to push against your chest). At 3 metres, it is 29,400 Pa — strong enough to make swimming exhausting and to collapse poorly built tunnels.

This is why the Kangla engineers wanted the moat as deep as possible. Deeper water means:
- More pressure on swimmers' lungs
- Stronger current when sluice gates open
- Greater force against tunnel walls

In Python, **multiplication** and **f-strings** let us calculate and display these values clearly.`,
      analogy: 'Water pressure is like the weight of a stack of books. One book on your hand is fine. Ten books hurt. A hundred would crush your hand. Each metre of water is like another "book" pressing down on everything below it.',
      storyConnection: 'The Kangla Fort engineers did not just dig a wide ditch — they dug a deep one. They understood intuitively what the pressure formula tells us mathematically: depth multiplies danger.',
      checkQuestion: 'If you dive to the bottom of the 3-metre moat, how much pressure is on your body compared to standing on the surface?',
      checkAnswer: 'At the surface, atmospheric pressure is about 101,325 Pa. At 3m depth, water adds 29,400 Pa — about a 29% increase. This is why your ears hurt when you dive: the pressure difference pushes on your eardrums. At 10m depth, the pressure doubles.',
      codeIntro: 'Calculate water pressure at different depths in the Kangla moat.',
      code: `# Water pressure vs depth in the Kangla moat
rho = 1000    # water density (kg/m³)
g = 9.8       # gravity (m/s²)

print("Depth (m) | Pressure (Pa) | Pressure (atm)")
print("-" * 45)

for depth in [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0]:
    pressure = rho * g * depth
    atm = pressure / 101325  # convert to atmospheres
    print(f"  {depth:4.1f}     |  {pressure:8.0f}      | {atm:.3f}")

# What force does a diver feel on their chest?
chest_area = 0.15  # square metres (roughly 30cm x 50cm)
depth = 3.0
force = rho * g * depth * chest_area
print(f"\\nAt {depth}m depth, force on a diver's chest: {force:.0f} N")
print(f"That's like holding a {force/g:.0f} kg weight on your chest!")`,
      challenge: 'Calculate the total force on the bottom of the moat per square metre at 3m depth. Then calculate it for the entire moat bottom (length x width). That is the weight of the water the earth must support.',
      successHint: 'You now understand hydrostatic pressure — the same principle that governs dams, submarines, and blood pressure in your own body.',
    },
    {
      title: 'Flood defence — how much rain can the moat handle?',
      concept: `Imphal receives heavy monsoon rainfall — about 1,400 mm per year, mostly in 5 months. The Kangla Fort engineers had to design the moat to handle sudden downpours without flooding the fort.

The key calculation is **inflow vs. outflow**:
- **Inflow**: rain falling into the moat + river water through sluice gates
- **Outflow**: water leaving through drainage channels + evaporation

If inflow > outflow for too long, the moat overflows and floods the fort. The engineers needed **overflow channels** — backup exits for excess water.

In Python, we can simulate this with a **loop** that tracks the water level over time, adding rain and subtracting drainage each hour.`,
      analogy: 'Think of the moat like a bathtub with the tap running and the drain open. If the tap runs faster than the drain empties, the tub overflows. The Kangla engineers made sure they had enough "drains" to handle the monsoon "tap."',
      storyConnection: 'The story describes how the fort survived centuries of monsoons. This was not luck — it was careful hydraulic planning. The moat was designed to fill but never overflow, protecting the fort from both enemies and floods.',
      checkQuestion: 'During a heavy monsoon storm dropping 50mm of rain in one hour, how many cubic metres of water fall into a moat that is 1580m long and 15m wide?',
      checkAnswer: 'Area = 1580 x 15 = 23,700 m². Rain depth = 0.05m. Volume = 23,700 x 0.05 = 1,185 m³ of water in one hour. That is over a million litres dumped into the moat in 60 minutes. Without drainage, the level would rise by 0.05m per hour — which adds up fast over a multi-day monsoon.',
      codeIntro: 'Simulate 24 hours of monsoon rain and track whether the moat overflows.',
      code: `# Monsoon flood simulation for Kangla Fort moat
moat_length = 1580   # metres
moat_width = 15      # metres
moat_depth = 3.0     # metres (max capacity)
moat_area = moat_length * moat_width

water_level = 2.0    # starting level (metres)
drain_rate = 0.03    # metres drained per hour
overflow = False

print("Hour | Rain(mm) | Level(m) | Status")
print("-" * 42)

for hour in range(24):
    # Monsoon rain varies by hour
    if 8 <= hour <= 14:
        rain_mm = 25  # heavy afternoon rain
    elif 14 < hour <= 20:
        rain_mm = 10  # moderate evening rain
    else:
        rain_mm = 2   # light drizzle

    rain_rise = rain_mm / 1000  # convert mm to metres
    water_level = water_level + rain_rise - drain_rate

    if water_level > moat_depth:
        status = "OVERFLOW!"
        overflow = True
    elif water_level > moat_depth - 0.5:
        status = "WARNING"
    else:
        status = "OK"

    if hour % 3 == 0 or status != "OK":
        print(f" {hour:2d}   |   {rain_mm:3d}    |  {water_level:.2f}   | {status}")

if overflow:
    print("\\nThe moat overflowed! Need bigger drainage channels.")
else:
    print(f"\\nMoat held. Final level: {water_level:.2f}m")
    print(f"Remaining capacity: {(moat_depth - water_level)*moat_area:,.0f} cubic metres")`,
      challenge: 'Increase the drain_rate to 0.05 and run again. Does the moat still overflow? Find the minimum drain_rate that prevents overflow during this storm.',
      successHint: 'You just built a simulation — a simplified model of reality. Real hydraulic engineers use the same approach with more variables. The core logic is identical: track inflow, subtract outflow, check limits.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Hydraulic Engineering Basics</span>
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
