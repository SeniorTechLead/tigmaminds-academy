import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TripuraSundariLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Sedimentary layers — reading the rock record',
      concept: `The ground beneath Tripura Sundari Temple is made of **sedimentary rock** — layers of sand, clay, and organic matter deposited over millions of years.

Each layer (stratum) records a period of Earth's history:
- **Sandstone**: deposited by fast-flowing rivers or beaches
- **Shale/Mudstone**: deposited in calm, deep water
- **Limestone**: formed from marine organisms (shells, coral)
- **Conglomerate**: deposited by very fast water (pebbles cemented together)

The **Law of Superposition**: in undisturbed layers, older rocks are at the bottom, younger at the top.

Tripura's rocks are from the **Tertiary period** (2-65 million years ago), when the area was a shallow sea that gradually filled with sediment from the rising Himalayas.

📚 *We will use Python lists and dictionaries to model sedimentary layers and calculate their properties.*`,
      analogy: 'Sedimentary layers are like the layers of a cake — each one was added on top of the previous. The bottom layer was made first, the top last. A geologist reads rock layers like reading a history book from bottom to top.',
      storyConnection: 'The hill on which Tripura Sundari Temple sits is made of Tertiary sedimentary rocks — ancient seabed pushed upward by tectonic forces. The temple literally stands on the compressed remains of a prehistoric ocean floor.',
      checkQuestion: 'If a 100-metre cliff shows 50 visible layers, what is the average thickness of each layer?',
      checkAnswer: '100/50 = 2 metres per layer. But layers are rarely uniform — some might be 10 cm (brief events) and others 10 metres (long stable periods). The variation tells us about changing conditions over geological time.',
      codeIntro: 'Model the sedimentary layers beneath Tripura Sundari Temple.',
      code: `# Sedimentary column model for Tripura
layers = [
    {"name": "Topsoil", "type": "soil", "thickness_m": 0.5, "age_mya": 0, "density_kg_m3": 1500},
    {"name": "Laterite", "type": "weathered", "thickness_m": 3.0, "age_mya": 0.5, "density_kg_m3": 2000},
    {"name": "Dupitila Sandstone", "type": "sandstone", "thickness_m": 50, "age_mya": 2, "density_kg_m3": 2300},
    {"name": "Tipam Sandstone", "type": "sandstone", "thickness_m": 80, "age_mya": 10, "density_kg_m3": 2400},
    {"name": "Bhuban Formation", "type": "shale", "thickness_m": 200, "age_mya": 20, "density_kg_m3": 2500},
    {"name": "Barail Group", "type": "sandstone/shale", "thickness_m": 500, "age_mya": 35, "density_kg_m3": 2550},
    {"name": "Disang Formation", "type": "shale", "thickness_m": 1000, "age_mya": 50, "density_kg_m3": 2600},
]

print("GEOLOGICAL COLUMN — TRIPURA SUNDARI TEMPLE SITE")
print("=" * 70)
print(f"{'Layer':<22} {'Type':<16} {'Thick (m)':>9} {'Age (Mya)':>9} {'ρ (kg/m³)':>9}")
print("-" * 70)

total_thickness = 0
total_mass = 0

for layer in layers:
    total_thickness += layer['thickness_m']
    mass = layer['thickness_m'] * layer['density_kg_m3']  # per m²
    total_mass += mass
    print(f"{layer['name']:<22} {layer['type']:<16} {layer['thickness_m']:>9.1f} {layer['age_mya']:>9.1f} {layer['density_kg_m3']:>9}")

print("-" * 70)
print(f"{'TOTAL':<22} {'':16} {total_thickness:>9.1f} {'':>9} {'':>9}")
print()

# Pressure at each depth
g = 9.81
print("PRESSURE AT EACH LAYER BOUNDARY")
print("-" * 45)
depth = 0
pressure = 0
for layer in layers:
    depth += layer['thickness_m']
    pressure += layer['thickness_m'] * layer['density_kg_m3'] * g
    print(f"  At {depth:>7.1f}m: {pressure/1e6:>8.2f} MPa ({pressure/1e6/101.325*1000:.0f} atm)")

print(f"\\\nThe Disang Formation at ~1800m depth experiences {pressure/1e6:.0f} MPa")
print("That is enough to compress and harden the sediment into solid rock.")`,
      challenge: 'If the average sedimentation rate was 0.1 mm/year, how long did it take to deposit the entire 1833m column? Does this match the oldest layer age?',
      successHint: 'Every layer of rock tells a story — of ancient rivers, seas, and mountains. The geological column beneath Tripura is a 50-million-year diary written in stone.',
    },
    {
      title: 'Plate tectonics — why India moved north',
      concept: `The Earth's surface is divided into **tectonic plates** that float on the semi-liquid mantle below. The **Indian Plate** has been moving north for 70+ million years:

- **130 Mya**: India was part of Gondwana (attached to Africa, Australia, Antarctica)
- **70 Mya**: India separated and began moving north at ~15 cm/year
- **50 Mya**: India collided with the Eurasian Plate
- **Today**: India continues pushing north at ~5 cm/year

This collision:
- Created the **Himalayas** (and is still raising them)
- Folded Tripura's sedimentary layers into hills and valleys
- Generated the earthquakes that affect the region

Tripura sits on the **Indian Plate**, near the junction with the **Burma Plate** — one of Earth's most tectonically active zones.

📚 *We will calculate India's speed, distance travelled, and the forces involved using basic arithmetic.*`,
      analogy: 'Imagine pushing a rug across a smooth floor. The rug (Indian Plate) slides easily until it hits a wall (Eurasian Plate). The front edge crumples and folds upward — those folds are the Himalayas, and the wrinkles are Tripura\'s hills.',
      storyConnection: 'The hill on which Tripura Sundari Temple stands was pushed upward by the same tectonic forces that created the Himalayas. The temple sits on a fold — a wrinkle in the Earth\'s crust caused by two continents colliding.',
      checkQuestion: 'If India moves north at 5 cm/year, how far will it move in a human lifetime (80 years)?',
      checkAnswer: '5 × 80 = 400 cm = 4 metres. In your lifetime, India moves about 4 metres north. That seems tiny, but over 50 million years it amounts to 2,500 km — the distance from Sri Lanka to the Himalayas.',
      codeIntro: 'Track India\'s journey north over geological time.',
      code: `# India's tectonic journey
events = [
    {"age_mya": 130, "lat": -35, "event": "Part of Gondwana"},
    {"age_mya": 100, "lat": -25, "event": "Separating from Africa"},
    {"age_mya": 70,  "lat": -10, "event": "Crossing equator region"},
    {"age_mya": 50,  "lat": 10,  "event": "COLLISION with Eurasia begins"},
    {"age_mya": 35,  "lat": 18,  "event": "Himalayas forming, Tripura folding"},
    {"age_mya": 20,  "lat": 22,  "event": "Tripura Sundari hill emerges"},
    {"age_mya": 10,  "lat": 23,  "event": "Modern Tripura landscape"},
    {"age_mya": 0,   "lat": 23.8,"event": "Present day"},
]

print("INDIA'S TECTONIC JOURNEY")
print("=" * 65)
print(f"{'Age (Mya)':>9} | {'Latitude':>9} | {'Speed':>10} | Event")
print("-" * 65)

for i, e in enumerate(events):
    if i > 0:
        dt = events[i-1]['age_mya'] - e['age_mya']
        dlat = e['lat'] - events[i-1]['lat']
        dist_km = dlat * 111  # ~111 km per degree latitude
        speed_cm_yr = dist_km * 1e5 / (dt * 1e6) if dt > 0 else 0
        speed_str = f"{speed_cm_yr:.1f} cm/yr"
    else:
        speed_str = "—"

    print(f"{e['age_mya']:>9} | {e['lat']:>8.1f}° | {speed_str:>10} | {e['event']}")

# Total distance
total_lat = events[-1]['lat'] - events[0]['lat']
total_km = total_lat * 111
print(f"\\\nTotal northward movement: {total_lat:.1f}° = {total_km:.0f} km")
print(f"Time taken: {events[0]['age_mya']} million years")
print(f"Average speed: {total_km * 1e5 / (events[0]['age_mya'] * 1e6):.1f} cm/year")
print()

# Current speed and implications
speed_now = 5  # cm/year
print("AT CURRENT SPEED (5 cm/year):")
distances = [1, 10, 100, 1000]
for years in distances:
    dist = speed_now * years / 100  # metres
    print(f"  In {years:>5,} years: {dist:>8.1f} metres")

print("\\\nThe Himalayas grow ~5mm/year (erosion offsets some of the uplift)")`,
      challenge: 'India\'s speed changed from ~15 cm/year (before collision) to ~5 cm/year (after). Calculate the kinetic energy change. Where did the lost energy go?',
      successHint: 'Plate tectonics explains everything about Tripura\'s landscape — the hills, the earthquakes, the rock types. The temple stands on evidence of a continent-scale collision.',
    },
    {
      title: 'Anticlines and synclines — folded rock layers',
      concept: `When tectonic forces compress sedimentary layers, they fold into:
- **Anticlines**: upward arches (hills) — oldest rocks in the centre
- **Synclines**: downward troughs (valleys) — youngest rocks in the centre

Tripura's landscape is a series of **long, narrow anticlines** running north-south — long ridges of folded rock with valleys (synclines) between them.

The fold geometry depends on:
- **Wavelength**: distance between anticline crests (5-20 km in Tripura)
- **Amplitude**: height of the fold (100-500 m in Tripura)
- **Plunge**: whether the fold axis tilts along its length

The temple hill is an **anticline** — the layers curve upward, with the oldest (and hardest) rocks exposed at the crest.

📚 *We will model anticline/syncline geometry using sine functions and calculate fold parameters.*`,
      analogy: 'Push the ends of a tablecloth toward each other. It buckles into a series of ridges (anticlines) and troughs (synclines). The bigger the push, the taller and tighter the folds — exactly what tectonic compression does to rock layers.',
      storyConnection: 'Tripura Sundari Temple sits atop an anticline — a ridge of folded rock. The Raghunandan Hill where the temple stands is not a random bump; it is the crest of a geological fold created by the India-Eurasia collision.',
      checkQuestion: 'In an anticline, are the rocks at the centre of the fold older or younger than those at the edges?',
      checkAnswer: 'Older. The anticline brings deeper (older) layers to the surface at its crest. This is how geologists find ancient rocks without drilling — they look for anticlines where erosion has exposed the deep layers.',
      codeIntro: 'Model the anticline-syncline fold pattern of Tripura\'s geology.',
      code: `import math

# Fold parameters for Tripura
wavelength_km = 12    # distance between anticline crests
amplitude_m = 300     # height of fold
n_folds = 5           # number of complete folds to model

# Model the fold profile
width_km = wavelength_km * n_folds
n_points = 200

print("FOLD PROFILE — TRIPURA CROSS-SECTION")
print("=" * 55)
print(f"Wavelength: {wavelength_km} km | Amplitude: {amplitude_m} m")
print()

# Calculate elevation at key points
print(f"{'Distance (km)':>13} | {'Elevation (m)':>13} | Feature")
print("-" * 50)

for i in range(n_folds * 2 + 1):
    x_km = i * wavelength_km / 2
    angle = 2 * math.pi * x_km / wavelength_km
    elevation = amplitude_m * math.cos(angle)
    if i % 2 == 0:
        feature = "ANTICLINE (crest)" if elevation > 0 else "ANTICLINE (crest)"
        feature = "ANTICLINE crest" if abs(math.cos(angle) - 1) < 0.01 else "SYNCLINE trough"
    else:
        feature = "Fold limb (slope)"

    print(f"{x_km:>13.1f} | {elevation:>13.0f} | {feature}")

print()

# Layer depths at an anticline
print("ROCK LAYERS AT ANTICLINE CREST vs SYNCLINE TROUGH")
print("-" * 55)
layers = [
    ("Dupitila Ss", 50), ("Tipam Ss", 80), ("Bhuban Shale", 200),
    ("Barail Group", 500), ("Disang Fm", 1000),
]

print(f"{'Layer':<15} | {'At crest (m)':>12} | {'At trough (m)':>13}")
print("-" * 45)
depth_crest = 0
depth_trough = 0
for name, thickness in layers:
    # At anticline crest, layers are closer to surface
    depth_crest += thickness * 0.7  # thinned by folding
    depth_trough += thickness * 1.3  # thickened in trough
    print(f"{name:<15} | {depth_crest:>12.0f} | {depth_trough:>13.0f}")

print()
print(f"The same Barail Group that is at {sum(t for _,t in layers[:4]) * 0.7:.0f}m")
print(f"below the anticline crest is at {sum(t for _,t in layers[:4]) * 1.3:.0f}m")
print("below the syncline trough. Folding brings deep rocks to the surface.")`,
      challenge: 'Tripura has "plunging" anticlines where the fold axis dips. If the plunge angle is 5°, how deep is the crest after 10 km along the fold axis?',
      successHint: 'Anticlines and synclines are the signature of tectonic compression. Every hill in Tripura is an anticline, and every valley is a syncline — a landscape sculpted by continental collision.',
    },
    {
      title: 'Erosion — sculpting the landscape',
      concept: `Once tectonic forces push rock layers upward, **erosion** begins sculpting them:

- **Water erosion**: rivers cut valleys, rain dissolves soft rock
- **Chemical weathering**: CO₂ in rainwater dissolves limestone (acid rain is natural)
- **Physical weathering**: temperature changes crack rock (freeze-thaw)
- **Biological weathering**: tree roots split rock, bacteria dissolve minerals

Erosion rates depend on:
- **Rock hardness**: sandstone erodes faster than granite
- **Rainfall**: Tripura gets 2,000+ mm/year — very erosive
- **Slope**: steeper = faster erosion
- **Vegetation**: plants protect soil from erosion

The balance between **uplift** (tectonics) and **erosion** determines landscape height. If erosion exceeds uplift, mountains shrink.

📚 *We will calculate erosion rates and model how Tripura's landscape changes over geological time.*`,
      analogy: 'Erosion is like a sculptor with infinite patience. Water, wind, and weather slowly chip away at rock, revealing the forms within. Tripura\'s hills are not just pushed up by tectonics — they are carved by millions of years of rain.',
      storyConnection: 'The hill where Tripura Sundari Temple stands has been eroded for millions of years. The temple survives because the hill is made of relatively hard sandstone. If it were soft shale, the hill would have eroded away long ago.',
      checkQuestion: 'If Tripura gets 2,000 mm of rain per year and each mm removes 0.001 mm of rock, how fast does the landscape erode?',
      checkAnswer: '2,000 × 0.001 = 2 mm/year of erosion. Over 1 million years: 2,000 m = 2 km of rock removed. This is why Tripura\'s hills are only a few hundred metres high despite millions of years of tectonic uplift — erosion removes most of what tectonics creates.',
      codeIntro: 'Model erosion rates and landscape evolution for the Tripura Sundari Temple hill.',
      code: `# Erosion model for Tripura
rainfall_mm_yr = 2100  # annual rainfall

# Erosion rates by rock type (mm/year)
erosion_rates = {
    "Soft shale":     0.5,
    "Mudstone":       0.3,
    "Sandstone":      0.1,
    "Hard sandstone": 0.05,
    "Laterite":       0.02,
    "Granite":        0.01,
}

print("EROSION RATES BY ROCK TYPE (Tripura climate)")
print("=" * 55)
print(f"{'Rock type':<18} | {'Rate (mm/yr)':>12} | {'Metres/Myr':>10} | {'km/10Myr':>8}")
print("-" * 55)

for rock, rate in erosion_rates.items():
    m_per_myr = rate * 1000  # mm/yr * 1000 years
    km_per_10myr = m_per_myr * 10 / 1000
    print(f"{rock:<18} | {rate:>12.3f} | {m_per_myr:>10.0f} | {km_per_10myr:>8.1f}")

# Landscape evolution
print("\\\nTRIPURA SUNDARI HILL EVOLUTION")
print("-" * 50)
uplift_rate = 0.3  # mm/year (tectonic uplift)
erosion_rate = 0.1  # mm/year (sandstone)
net_rate = uplift_rate - erosion_rate  # mm/year

height = 0
print(f"{'Time (Mya)':>10} | {'Height (m)':>11} | Event")
print("-" * 50)

time_steps = [
    (20, "Folding begins, anticline emerges"),
    (15, "Hill growing, rivers forming"),
    (10, "Near peak height"),
    (5,  "Active erosion, valleys deepen"),
    (2,  "Modern landscape forming"),
    (0,  "Present day (temple built ~500 years ago)"),
]

for age, event in time_steps:
    # Simple model: height grows then stabilises
    if age > 10:
        height = (20 - age) * net_rate * 1e6 / 1000  # m
    else:
        # Uplift slowing, erosion catching up
        peak = 10 * net_rate * 1e6 / 1000
        height = peak - (10 - age) * erosion_rate * 0.5 * 1e6 / 1000
    height = max(0, height)
    print(f"{age:>10} | {height:>11.0f} | {event}")

print(f"\\\nCurrent temple hill height: ~50m above surroundings")
print(f"Net uplift rate: {net_rate:.2f} mm/yr ({net_rate * 1e6 / 1000:.0f} m/Myr)")
print("The hill exists because uplift exceeds erosion for hard sandstone.")`,
      challenge: 'Climate change may increase Tripura\'s rainfall by 15%. How does this change the erosion rate and the net height change? Will the temple hill grow or shrink?',
      successHint: 'Erosion is the sculptor of landscapes. The hills of Tripura exist in a dynamic balance between tectonic uplift and relentless erosion. Understanding both forces explains every feature of the landscape.',
    },
    {
      title: 'Earthquakes — living on a plate boundary',
      concept: `Tripura is seismically active because it sits near the **India-Burma plate boundary**. Earthquakes occur when built-up stress in rocks is suddenly released.

Key concepts:
- **Magnitude** (Richter/Moment): measures energy released (logarithmic — each unit = 32× more energy)
- **Intensity** (Mercalli): measures shaking at a location (depends on distance, soil type)
- **Epicentre**: point on surface directly above the earthquake source
- **Focus/hypocentre**: actual point underground where the rupture starts

Tripura falls in **Seismic Zone V** (highest risk in India). Major historical earthquakes:
- 1869 Cachar earthquake (M7.5)
- 1897 Assam earthquake (M8.1)
- 1950 Assam earthquake (M8.6)

📚 *We will calculate earthquake energy, estimate shaking intensity with distance, and assess risk.*`,
      analogy: 'Bend a stick slowly. It stores energy as it bends (tectonic stress). When it snaps, the energy releases suddenly — that is an earthquake. The longer between earthquakes, the more energy stored, and the bigger the eventual snap.',
      storyConnection: 'Tripura Sundari Temple has survived earthquakes for over 500 years. Its location on hard sandstone (an anticline crest) provides better ground than the soft valley soils, where shaking is amplified. The ancient builders may have chosen the hilltop partly for its seismic stability.',
      checkQuestion: 'If an M6 earthquake releases X joules of energy, how much does an M8 earthquake release?',
      checkAnswer: 'Each magnitude unit = 32× more energy. M6 to M8 = 2 units = 32² = 1,024× more energy. An M8 earthquake releases about 1,000 times more energy than an M6. This is why magnitude 8+ events are so catastrophically destructive.',
      codeIntro: 'Calculate earthquake energy and estimate shaking intensity for the Tripura Sundari Temple area.',
      code: `import math

# Earthquake energy: log10(E) = 1.5*M + 4.8 (in joules)
def quake_energy(magnitude):
    return 10 ** (1.5 * magnitude + 4.8)

print("EARTHQUAKE ENERGY SCALE")
print("=" * 55)
print(f"{'Magnitude':>9} | {'Energy (J)':>14} | {'TNT equiv':>12} | Comparison")
print("-" * 55)

comparisons = {
    2: "Minor (felt nearby)",
    4: "Light (shaking, no damage)",
    5: "Moderate (some damage)",
    6: "Strong (destructive near epicentre)",
    7: "Major (widespread damage)",
    8: "Great (regional catastrophe)",
    9: "Massive (2004 tsunami, 2011 Japan)",
}

for m in range(2, 10):
    E = quake_energy(m)
    tnt_kg = E / 4.184e6  # 1 kg TNT = 4.184 MJ
    if tnt_kg > 1e9:
        tnt_str = f"{tnt_kg/1e9:.0f} Mt"
    elif tnt_kg > 1e6:
        tnt_str = f"{tnt_kg/1e6:.0f} kt"
    elif tnt_kg > 1e3:
        tnt_str = f"{tnt_kg/1e3:.0f} t"
    else:
        tnt_str = f"{tnt_kg:.0f} kg"
    print(f"    M{m:.0f}    | {E:>14.2e} | {tnt_str:>12} | {comparisons.get(m, '')}")

# Intensity decay with distance
print("\\\nSHAKING INTENSITY vs DISTANCE (M6.5 earthquake)")
print("-" * 50)
M = 6.5
for dist_km in [5, 10, 20, 50, 100, 200, 500]:
    # Simplified attenuation: I = M - 1.5*log10(dist) - 0.5
    intensity = M - 1.5 * math.log10(dist_km) - 0.5
    level = "Destructive" if intensity > 6 else "Strong" if intensity > 5 else "Moderate" if intensity > 4 else "Light" if intensity > 3 else "Weak"
    print(f"  {dist_km:>5} km: Intensity ≈ {intensity:.1f} ({level})")

# Historical earthquakes near Tripura
print("\\\nHISTORICAL EARTHQUAKES NEAR TRIPURA")
print("-" * 55)
quakes = [
    (1869, 7.5, "Cachar", 80),
    (1897, 8.1, "Shillong", 250),
    (1918, 7.6, "Srimangal", 120),
    (1950, 8.6, "Assam", 400),
    (1988, 6.8, "Bihar-Nepal", 600),
    (2016, 6.7, "Imphal", 150),
]
for year, mag, location, dist in quakes:
    intensity = mag - 1.5 * math.log10(dist) - 0.5
    print(f"  {year}: M{mag} {location:12s} ({dist:>3}km) → Intensity {intensity:.1f} at temple")`,
      challenge: 'If the "seismic gap" theory is correct, the India-Burma boundary near Tripura is overdue for a major earthquake. Estimate the magnitude if 100 years of strain (5 cm/year slip deficit) releases at once.',
      successHint: 'Earthquake science explains the risks facing Tripura\'s heritage structures. Understanding seismology helps protect temples like Tripura Sundari for future generations.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Geology & Plate Tectonics</span>
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
