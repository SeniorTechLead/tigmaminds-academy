import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MishingFishLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Population genetics — how fish populations diverge',
      concept: `Fish in different tributaries of the Brahmaputra are not genetically identical. Geographic separation leads to **genetic drift** and **local adaptation**, gradually making each population distinct.

Key population genetics concepts:
- **Gene flow**: fish migrating between populations share genes, keeping populations similar
- **Genetic drift**: random changes in allele frequencies, stronger in small populations
- **Selection**: local conditions favor certain traits (deeper bodies in fast water, streamlined in slow)
- **Founder effect**: when a few fish colonize a new habitat, they carry only a fraction of the original population's genetic diversity

The **F_ST statistic** measures genetic differentiation between populations:
- F_ST = 0: populations are genetically identical
- F_ST = 0.05-0.15: moderate differentiation
- F_ST > 0.25: very different populations (possibly separate species)

For fisheries management, this matters: if each tributary has a genetically distinct population, overfishing one tributary cannot be compensated by fish from another — the unique genetic adaptations are lost forever.`,
      analogy: 'Population genetics is like accents in language. Villages separated by a mountain develop different accents over time (genetic drift). Occasional visitors between villages keep the accents from diverging too much (gene flow). If a village becomes completely isolated, its accent becomes unintelligible to outsiders (speciation).',
      storyConnection: 'The Mishing fished many tributaries and intuitively recognized that fish from different rivers looked slightly different — color, size, behavior. Modern genetics confirms this: each tributary holds a partially distinct population, shaped by its unique habitat. The Mishing practice of not overfishing any single tributary protected this genetic diversity.',
      checkQuestion: 'Why is genetic diversity important for a fish population\'s survival?',
      checkAnswer: 'Genetic diversity provides raw material for adaptation. When conditions change (temperature increase, new disease, altered habitat), a diverse population is more likely to contain individuals with traits suited to the new conditions. A genetically uniform population (low diversity) is vulnerable — like a monoculture crop that can be wiped out by a single disease. The banana (all clones) vs. wild apple (genetically diverse) comparison applies to fish too.',
      codeIntro: 'Simulate genetic drift in small vs. large fish populations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Genetic drift simulation
# Track frequency of allele A in a population over generations
def simulate_drift(N, generations, initial_freq=0.5, n_sims=10):
    """N = population size, track allele frequency over time."""
    results = np.zeros((n_sims, generations))
    for sim in range(n_sims):
        freq = initial_freq
        for gen in range(generations):
            # Each generation: sample 2N alleles from binomial
            n_A = np.random.binomial(2 * N, freq)
            freq = n_A / (2 * N)
            results[sim, gen] = freq
    return results

generations = 200

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Small population (N=20)
ax1.set_facecolor('#111827')
results_small = simulate_drift(20, generations)
for i in range(10):
    ax1.plot(range(generations), results_small[i], linewidth=1, alpha=0.7)
ax1.axhline(0.5, color='gray', linestyle='--', alpha=0.3)
ax1.set_xlabel('Generations', color='white')
ax1.set_ylabel('Allele frequency', color='white')
ax1.set_title('Small Population (N=20): Strong Drift', color='white', fontsize=11)
ax1.set_ylim(-0.05, 1.05)
ax1.tick_params(colors='gray')

fixed = np.sum((results_small[:, -1] == 0) | (results_small[:, -1] == 1))
ax1.text(100, 0.9, f'{fixed}/10 alleles fixed\
or lost', color='#ef4444', fontsize=10)

# Large population (N=500)
ax2.set_facecolor('#111827')
results_large = simulate_drift(500, generations)
for i in range(10):
    ax2.plot(range(generations), results_large[i], linewidth=1, alpha=0.7)
ax2.axhline(0.5, color='gray', linestyle='--', alpha=0.3)
ax2.set_xlabel('Generations', color='white')
ax2.set_ylabel('Allele frequency', color='white')
ax2.set_title('Large Population (N=500): Weak Drift', color='white', fontsize=11)
ax2.set_ylim(-0.05, 1.05)
ax2.tick_params(colors='gray')

fixed2 = np.sum((results_large[:, -1] == 0) | (results_large[:, -1] == 1))
ax2.text(100, 0.9, f'{fixed2}/10 alleles fixed\
or lost', color='#22c55e', fontsize=10)

plt.tight_layout()
plt.show()

print("Genetic drift is RANDOM change in allele frequencies.")
print(f"Small populations (N=20): alleles frequently fixed/lost ({fixed}/10)")
print(f"Large populations (N=500): frequencies stay near 0.5 ({fixed2}/10)")
print()
print("This is why small, isolated fish populations lose diversity.")
print("Conservation must maintain large populations or gene flow.")`,
      challenge: 'Add gene flow between two populations. Each generation, 5% of population A\'s alleles come from population B (and vice versa). Does this prevent fixation in small populations?',
      successHint: 'Population genetics is the theoretical foundation of conservation biology. Every endangered species plan involves maintaining genetic diversity — and the mathematics of drift is central to that effort.',
    },
    {
      title: 'Biomechanics of swimming — how fish move through water',
      concept: `Fish swimming is a masterclass in **biomechanics** — the application of mechanical principles to biological systems. Different fish shapes are optimized for different swimming styles:

- **Thunniform** (tuna, mackerel): crescent tail, streamlined body. Built for speed. Drag coefficient ~0.01.
- **Carangiform** (bass, mahseer): moderate body flex, forked tail. Good balance of speed and maneuverability.
- **Anguilliform** (eel): entire body undulates. Excellent for navigating tight spaces and burrowing.
- **Labriform** (wrasse): pectoral fin rowing. Precise, slow movement for feeding in complex habitats.

Key physics:
- **Drag** = ½ ρ v² C_D A (increases with speed squared!)
- **Thrust** from tail oscillation: T = m × a (tail pushes water backward, fish goes forward — Newton's 3rd law)
- **Reynolds number** determines whether flow is laminar or turbulent around the fish

Mishing fish traps exploit these swimming mechanics: the jakoi's conical shape forces fish to try to turn in a confined space — something most fish cannot do efficiently because their body plan is optimized for forward thrust, not tight turns.`,
      analogy: 'Fish body shapes are like car designs. A tuna is a sports car (sleek, fast, terrible at parking). An eel is a motorcycle (maneuverable, can squeeze through gaps). A bass is an SUV (good all-rounder). Each shape is optimized for a different "driving style" — and each has trade-offs.',
      storyConnection: 'The Mishing designed different traps for different fish because they understood — from experience — that different fish move differently. A catfish can slither out of a gap a mahseer cannot. A fast mahseer can escape a net a slow catfish cannot. Fish shape determines trap design.',
      checkQuestion: 'Why do fast fish like tuna have crescent-shaped tails while slow fish like sunfish have round tails?',
      checkAnswer: 'Crescent (lunate) tails have high aspect ratio — tall and narrow. This minimizes drag while maximizing thrust at high speeds (like a narrow airplane wing). Round tails have low aspect ratio — short and wide. These are better for rapid acceleration from a standstill (like a paddle). Tuna cruise at speed; sunfish dart from ambush positions. The tail shape matches the locomotion strategy.',
      codeIntro: 'Model fish swimming efficiency for different body shapes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fish swimming model: power required vs speed for different body shapes
speeds = np.linspace(0.1, 5, 100)  # body lengths per second
rho = 1000  # water density kg/m³

# Different fish types
fish_types = {
    'Tuna (thunniform)': {'Cd': 0.01, 'length': 1.0, 'width': 0.15, 'color': '#3b82f6'},
    'Mahseer (carangiform)': {'Cd': 0.03, 'length': 0.5, 'width': 0.12, 'color': '#22c55e'},
    'Catfish (subcarangiform)': {'Cd': 0.05, 'length': 0.6, 'width': 0.15, 'color': '#f59e0b'},
    'Eel (anguilliform)': {'Cd': 0.08, 'length': 0.8, 'width': 0.04, 'color': '#ef4444'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Power vs speed
ax1.set_facecolor('#111827')
for name, props in fish_types.items():
    area = np.pi * (props['width']/2)**2  # frontal area
    v_ms = speeds * props['length']  # convert BL/s to m/s
    drag = 0.5 * rho * v_ms**2 * props['Cd'] * area  # Newtons
    power = drag * v_ms  # Watts

    ax1.plot(speeds, power, color=props['color'], linewidth=2, label=name)

ax1.set_xlabel('Speed (body lengths/second)', color='white')
ax1.set_ylabel('Power required (Watts)', color='white')
ax1.set_title('Swimming Cost: Power vs Speed', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 5)

# Cost of transport (energy per distance)
ax2.set_facecolor('#111827')
for name, props in fish_types.items():
    area = np.pi * (props['width']/2)**2
    v_ms = speeds * props['length']
    drag = 0.5 * rho * v_ms**2 * props['Cd'] * area
    cot = drag  # Cost of transport = force (energy per distance)

    ax2.plot(speeds, cot, color=props['color'], linewidth=2, label=name)

ax2.set_xlabel('Speed (body lengths/second)', color='white')
ax2.set_ylabel('Cost of transport (J/m)', color='white')
ax2.set_title('Energy Per Meter: Efficiency', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fish swimming styles:")
for name, props in fish_types.items():
    area = np.pi * (props['width']/2)**2
    max_speed = 4 * props['length']  # ~4 BL/s typical max sustained
    drag_max = 0.5 * rho * max_speed**2 * props['Cd'] * area
    print(f"  {name}: Cd={props['Cd']}, max drag={drag_max:.2f}N at {max_speed:.1f}m/s")

print()
print("Key insight: drag ∝ v² means power ∝ v³")
print("Doubling speed requires 8x more power!")`,
      challenge: 'A salmon needs to swim upstream at 2 m/s against a 1 m/s current. Its effective speed is 1 m/s but it must push through water at 2 m/s. How does this change the power calculation?',
      successHint: 'Fish biomechanics has inspired submarine design, underwater robots, and swimsuit technology. The same drag equations that describe a mahseer describe a torpedo.',
    },
    {
      title: 'River ecology monitoring — eDNA and modern techniques',
      concept: `How do scientists know which fish species live in a river without catching them? **Environmental DNA (eDNA)** — DNA fragments shed by organisms into the water through mucus, scales, feces, and urine.

eDNA workflow:
1. Collect a water sample (just 1-2 liters)
2. Filter to capture DNA fragments
3. Extract and amplify DNA using PCR (polymerase chain reaction)
4. Sequence the DNA and match to species databases
5. Result: a complete species list without catching a single fish

Advantages over traditional surveys:
- Non-invasive (no harm to organisms)
- Can detect rare and cryptic species
- Much faster (hours vs. weeks of netting)
- Sensitive (can detect a single fish in a lake)

Limitations:
- Cannot determine population size (only presence/absence)
- DNA degrades in warm, acidic water (tropical rivers are challenging)
- Cannot distinguish living from recently dead organisms
- Contamination is a major concern

eDNA is revolutionizing biodiversity monitoring. A single liter of ocean water can reveal hundreds of fish species. For the Mishing's rivers, eDNA surveys could track species diversity without disrupting traditional fishing.`,
      analogy: 'eDNA is like fingerprint dust at a crime scene. Every fish that swims through leaves behind invisible traces — molecular fingerprints. Scientists collect these traces from water, amplify them, and identify who was there. Like forensic science, eDNA tells you who visited a location without needing to see them.',
      storyConnection: 'The Mishing knew which fish were in which river from experience and direct observation. eDNA gives scientists the same knowledge in hours, from a water sample. Both are methods of reading the river — one through generations of experience, the other through molecular biology.',
      checkQuestion: 'A water sample from the Brahmaputra contains eDNA from 47 fish species. Does this mean all 47 species live in that exact spot?',
      checkAnswer: 'Not necessarily. eDNA is transported downstream by current. A fish 10 km upstream could shed DNA that flows to your sampling site. The DNA persists for hours to days depending on temperature, UV light, and microbial activity. So eDNA gives a "regional inventory" more than a "local census." Researchers account for this by sampling at multiple points and using decay rate models.',
      codeIntro: 'Model eDNA detection probability based on fish abundance and water conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# eDNA detection model
# Detection probability depends on:
# 1. Fish abundance (more fish = more DNA)
# 2. DNA decay rate (warm water = faster decay)
# 3. Distance from source (DNA transported downstream)
# 4. Sample volume (more water = more DNA captured)

def detection_prob(abundance, temperature, distance, volume):
    """Probability of detecting eDNA from a fish population."""
    # DNA production rate (proportional to abundance)
    production = abundance * 0.001  # DNA units/day
    # Decay rate (higher in warm water)
    decay_rate = 0.1 * np.exp(0.05 * (temperature - 15))  # per day
    # Dilution with distance
    dilution = np.exp(-distance / 1000)  # 1/e per 1000m
    # Effective concentration
    concentration = production * dilution / decay_rate
    # Detection probability (logistic function of concentration * volume)
    p = 1 - np.exp(-concentration * volume)
    return np.clip(p, 0, 1)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Abundance effect
ax = axes[0, 0]
ax.set_facecolor('#111827')
abundances = np.linspace(1, 200, 100)
for temp in [10, 20, 30]:
    probs = detection_prob(abundances, temp, 100, 2)
    ax.plot(abundances, probs, linewidth=2, label=f'{temp}°C')
ax.set_xlabel('Fish abundance', color='white')
ax.set_ylabel('Detection probability', color='white')
ax.set_title('Effect of Abundance', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=9, title='Water temp', title_fontsize=8)
ax.tick_params(colors='gray')

# Distance effect
ax = axes[0, 1]
ax.set_facecolor('#111827')
distances = np.linspace(0, 5000, 100)
for abund in [10, 50, 200]:
    probs = detection_prob(abund, 20, distances, 2)
    ax.plot(distances, probs, linewidth=2, label=f'N={abund}')
ax.set_xlabel('Distance from source (m)', color='white')
ax.set_ylabel('Detection probability', color='white')
ax.set_title('Effect of Distance', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Temperature effect
ax = axes[1, 0]
ax.set_facecolor('#111827')
temps = np.linspace(5, 35, 100)
for vol in [1, 2, 5]:
    probs = detection_prob(50, temps, 100, vol)
    ax.plot(temps, probs, linewidth=2, label=f'{vol}L sample')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Detection probability', color='white')
ax.set_title('Effect of Temperature', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Sample volume effect
ax = axes[1, 1]
ax.set_facecolor('#111827')
volumes = np.linspace(0.5, 10, 100)
for dist in [100, 500, 2000]:
    probs = detection_prob(50, 20, dist, volumes)
    ax.plot(volumes, probs, linewidth=2, label=f'{dist}m away')
ax.set_xlabel('Sample volume (L)', color='white')
ax.set_ylabel('Detection probability', color='white')
ax.set_title('Effect of Sample Volume', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("eDNA survey design recommendations:")
print("  - Sample at least 2L per site")
print("  - Sample within 500m of expected habitat")
print("  - Sample in cool season if possible (slower decay)")
print("  - Take 3+ replicates per site (account for variability)")
print("  - For rare species: increase volume to 5-10L")`,
      challenge: 'Design an eDNA survey for the Brahmaputra. If you have budget for 20 water samples, where would you place them to maximize species detection? Consider tributaries, main channel, and confluence zones.',
      successHint: 'eDNA is transforming biodiversity science — from marine reserves to tropical rivers to underground caves. A liter of water can tell you more about aquatic biodiversity than months of traditional surveying.',
    },
    {
      title: 'Climate change impacts on river fisheries',
      concept: `Climate change threatens river fisheries through multiple pathways:

1. **Temperature**: river temperatures rising 1-3°C by 2050. Fish have narrow thermal tolerances.
2. **Flow regime**: monsoon intensification → more extreme floods AND droughts. Flash floods destroy spawning habitat; droughts concentrate fish.
3. **Glacial melt**: Himalayan glaciers feed Brahmaputra tributaries. Initially more water (melt), eventually less (glaciers gone).
4. **Dissolved oxygen**: warmer water holds less O₂. Combined with increased monsoon runoff (nutrients → algal blooms), hypoxia events increase.
5. **Species range shifts**: cold-water species (mahseer, trout) move upstream; warm-water species expand. New invasive species arrive.

For the Mishing:
- Mahseer (cold-water, sensitive) populations declining
- Catfish (warm-tolerant) increasing
- Spawning timing shifting (monsoon patterns changing)
- Flood frequency and severity increasing
- Traditional seasonal calendar becoming less reliable

Adaptation strategies:
- Species diversification in aquaculture
- Improved flood-resistant housing (traditional Mishing houses on stilts)
- Flexible fishing seasons that track actual conditions, not calendar dates
- Habitat restoration for resilient species`,
      analogy: 'Climate change on fisheries is like slowly turning up the heat on a stove while cooking. At first, the ingredients (fish) adjust. But eventually, some boil over (species crash), the recipe changes (community composition shifts), and the timing is off (seasons misalign). The Mishing are like experienced chefs trying to cook with a stove they no longer control.',
      storyConnection: 'The Mishing people have always adapted to the river\'s moods — floods, droughts, seasonal changes. But climate change is introducing variability outside the range of their experience. The story of Mishing fishing is entering a new chapter, one that requires combining traditional knowledge with modern climate science.',
      checkQuestion: 'If river temperature rises 2°C, some fish species will move upstream to cooler water. What happens to species already at the top of the watershed with nowhere cooler to go?',
      checkAnswer: 'They face local extinction — called "summit trapping." Species at the top of a river system cannot move to cooler water because there is none above them. This is already happening to cold-water fish (trout, mahseer) in Himalayan streams. It is the aquatic equivalent of mountain species being pushed off the top of a mountain by warming temperatures.',
      codeIntro: 'Model how temperature changes shift fish species distributions in a river system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Species thermal tolerance model
# River temperature varies by altitude
altitude = np.linspace(0, 3000, 300)  # meters

# Current temperature profile (decreases with altitude)
temp_current = 28 - altitude * 0.006  # lapse rate ~6°C/1000m

# Future temperature (+2°C warming)
temp_future = temp_current + 2

# Fish species thermal ranges
species = {
    'Catfish (warm)': {'opt': 25, 'range': 7, 'color': '#f59e0b'},
    'Rohu (moderate)': {'opt': 22, 'range': 6, 'color': '#22c55e'},
    'Mahseer (cool)': {'opt': 18, 'range': 5, 'color': '#3b82f6'},
    'Snow trout (cold)': {'opt': 12, 'range': 4, 'color': '#a855f7'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.plot(altitude, temp_current, color='#3b82f6', linewidth=2, label='Current temp')
ax1.plot(altitude, temp_future, color='#ef4444', linewidth=2, linestyle='--', label='Future (+2°C)')
ax1.fill_between(altitude, temp_current, temp_future, alpha=0.1, color='#ef4444')

for name, props in species.items():
    # Habitat suitability
    suit_current = np.exp(-((temp_current - props['opt'])/props['range'])**2)
    suit_future = np.exp(-((temp_future - props['opt'])/props['range'])**2)

    # Find optimal altitude range
    good_current = altitude[suit_current > 0.5]
    good_future = altitude[suit_future > 0.5]

    if len(good_current) > 0:
        ax1.fill_between(good_current, temp_current[suit_current > 0.5],
                        alpha=0.2, color=props['color'])
        ax1.text(good_current[len(good_current)//2], props['opt'],
                name, color=props['color'], fontsize=8, ha='center')

ax1.set_xlabel('Altitude (m)', color='white')
ax1.set_ylabel('Water temperature (°C)', color='white')
ax1.set_title('River Temperature Profile & Fish Zones', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Range shifts
ax2.set_facecolor('#111827')
bar_width = 0.35
species_names = list(species.keys())
y_pos = np.arange(len(species_names))

for i, (name, props) in enumerate(species.items()):
    suit_current = np.exp(-((temp_current - props['opt'])/props['range'])**2)
    suit_future = np.exp(-((temp_future - props['opt'])/props['range'])**2)

    range_current = altitude[suit_current > 0.5]
    range_future = altitude[suit_future > 0.5]

    low_c = range_current[0] if len(range_current) > 0 else 0
    high_c = range_current[-1] if len(range_current) > 0 else 0
    low_f = range_future[0] if len(range_future) > 0 else 0
    high_f = range_future[-1] if len(range_future) > 0 else 0

    ax2.barh(i - bar_width/2, high_c - low_c, bar_width, left=low_c,
            color=props['color'], alpha=0.6, label='Current' if i == 0 else '')
    ax2.barh(i + bar_width/2, high_f - low_f, bar_width, left=low_f,
            color=props['color'], alpha=0.9, edgecolor='white', linewidth=0.5,
            label='Future' if i == 0 else '')

    shift = low_f - low_c
    ax2.annotate(f'↑{shift:.0f}m', xy=(high_f, i + bar_width/2),
                xytext=(high_f + 50, i + bar_width/2),
                color=props['color'], fontsize=9)

ax2.set_yticks(y_pos)
ax2.set_yticklabels(species_names, color='white', fontsize=9)
ax2.set_xlabel('Altitude range (m)', color='white')
ax2.set_title('Species Range Shifts Under Warming', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

for name, props in species.items():
    suit_current = np.exp(-((temp_current - props['opt'])/props['range'])**2)
    suit_future = np.exp(-((temp_future - props['opt'])/props['range'])**2)
    habitat_current = np.sum(suit_current > 0.5) / len(altitude) * 3000
    habitat_future = np.sum(suit_future > 0.5) / len(altitude) * 3000
    change = (habitat_future - habitat_current) / habitat_current * 100
    print(f"  {name}: {habitat_current:.0f}m → {habitat_future:.0f}m ({change:+.0f}%)")`,
      challenge: 'Add a 4°C warming scenario. Which species loses ALL suitable habitat? At what warming level does mahseer disappear from the Brahmaputra lowlands entirely?',
      successHint: 'Climate adaptation for fisheries requires exactly this kind of species-by-species, river-by-river analysis. The math is not complicated — the challenge is acting on what the models tell us.',
    },
    {
      title: 'IoT sensors for smart fisheries management',
      concept: `The future of fisheries combines traditional knowledge with **Internet of Things (IoT)** sensors. A smart river monitoring system might include:

- **Temperature sensors**: continuous water temp at multiple depths
- **Dissolved oxygen probes**: real-time O₂ monitoring
- **Turbidity sensors**: measure water clarity (related to sediment, algae)
- **Flow meters**: current speed at different positions
- **Camera traps (underwater)**: visual fish counts using computer vision
- **Acoustic sensors**: listen for fish sounds (many species vocalize)

These sensors feed data to a **dashboard** that:
1. Alerts fishermen when conditions are optimal (temperature, O₂, flow)
2. Warns of hypoxia events (fish kills imminent)
3. Tracks seasonal patterns and long-term trends
4. Estimates fish abundance from camera and acoustic data
5. Recommends sustainable catch limits based on real-time population estimates

The Mishing fisherman's intuition — "the water feels right today" — can now be quantified and shared. A sensor network does not replace traditional knowledge; it extends it to places and times the fisherman cannot personally monitor.`,
      analogy: 'IoT river monitoring is like a dashboard in a modern car. Traditional fishing is like driving without instruments — experienced drivers (fishermen) can feel the engine, hear problems, and judge speed by sound. IoT adds a speedometer, fuel gauge, and engine diagnostics — making the driver more informed, not replacing their skill.',
      storyConnection: 'The Mishing knew the river through decades of direct experience. IoT sensors can learn a river in months. Combined, traditional knowledge provides context and interpretation, while sensors provide continuous data. The future is not traditional vs. modern — it is both, integrated.',
      checkQuestion: 'A dissolved oxygen sensor shows DO dropping from 7 mg/L to 3 mg/L over 6 hours at night. What should the fisherman do?',
      checkAnswer: 'Immediate action: fish are stressed at 4 mg/L and dying at 2 mg/L. If the trend continues, a fish kill is likely by dawn. Options: (1) Emergency harvest — catch as many fish as possible before they die. (2) Aeration — if pond-based, run aerators immediately. (3) Stop feeding — uneaten feed decomposes and worsens O₂ depletion. (4) Alert downstream users — low O₂ water moves downstream. This is the value of real-time monitoring: hours of warning before a crisis.',
      codeIntro: 'Design a real-time river monitoring dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 24 hours of sensor data
hours = np.linspace(0, 24, 288)  # 5-minute intervals

# Temperature (follows solar heating)
temp = 22 + 3 * np.sin(2 * np.pi * (hours - 6) / 24) + np.random.normal(0, 0.2, len(hours))

# Dissolved oxygen (inverse of temperature + photosynthesis)
do_base = 8 - 0.3 * (temp - 20)
do_photo = 2 * np.maximum(0, np.sin(2 * np.pi * (hours - 6) / 24))  # daytime photosynthesis
do_vals = do_base + do_photo + np.random.normal(0, 0.3, len(hours))

# Turbidity (spikes during rain events)
turbidity = 20 + np.random.normal(0, 3, len(hours))
# Rain event at 14:00
rain_start = int(14 * 12)
turbidity[rain_start:rain_start+24] += 50 * np.exp(-np.arange(24) / 8)

# Flow speed
flow = 0.8 + 0.2 * np.sin(2 * np.pi * hours / 24) + np.random.normal(0, 0.05, len(hours))
flow[rain_start:rain_start+24] += 0.5 * np.exp(-np.arange(24) / 10)

fig, axes = plt.subplots(4, 1, figsize=(14, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Smart River Monitoring Dashboard', color='white', fontsize=14, y=0.98)

# Temperature
axes[0].set_facecolor('#111827')
axes[0].plot(hours, temp, color='#ef4444', linewidth=1.5)
axes[0].fill_between(hours, temp, alpha=0.1, color='#ef4444')
axes[0].axhspan(20, 25, alpha=0.1, color='#22c55e')
axes[0].set_ylabel('Temp (°C)', color='white')
axes[0].text(0.5, 25.5, 'OPTIMAL RANGE', color='#22c55e', fontsize=8)
axes[0].tick_params(colors='gray')

# Dissolved oxygen
axes[1].set_facecolor('#111827')
axes[1].plot(hours, do_vals, color='#3b82f6', linewidth=1.5)
axes[1].fill_between(hours, do_vals, alpha=0.1, color='#3b82f6')
axes[1].axhline(4, color='#f59e0b', linestyle='--', linewidth=1, alpha=0.7)
axes[1].axhline(2, color='#ef4444', linestyle='--', linewidth=1, alpha=0.7)
axes[1].text(0.5, 4.2, 'STRESS', color='#f59e0b', fontsize=8)
axes[1].text(0.5, 2.2, 'LETHAL', color='#ef4444', fontsize=8)
axes[1].set_ylabel('DO (mg/L)', color='white')
axes[1].tick_params(colors='gray')

# Turbidity
axes[2].set_facecolor('#111827')
axes[2].plot(hours, turbidity, color='#f59e0b', linewidth=1.5)
axes[2].fill_between(hours, turbidity, alpha=0.1, color='#f59e0b')
axes[2].annotate('Rain event!', xy=(14, 70), xytext=(16, 65),
                color='#ef4444', fontsize=10, arrowprops=dict(arrowstyle='->', color='#ef4444'))
axes[2].set_ylabel('Turbidity (NTU)', color='white')
axes[2].tick_params(colors='gray')

# Flow speed
axes[3].set_facecolor('#111827')
axes[3].plot(hours, flow, color='#22c55e', linewidth=1.5)
axes[3].fill_between(hours, flow, alpha=0.1, color='#22c55e')
axes[3].set_ylabel('Flow (m/s)', color='white')
axes[3].set_xlabel('Hour of day', color='white')
axes[3].tick_params(colors='gray')

# Add night shading
for ax in axes:
    ax.axvspan(0, 6, alpha=0.05, color='white')
    ax.axvspan(18, 24, alpha=0.05, color='white')

plt.tight_layout()
plt.show()

# Alert summary
alerts = []
if np.any(do_vals < 4):
    alerts.append(f"LOW O₂ WARNING: DO dropped to {do_vals.min():.1f} mg/L")
if np.any(turbidity > 50):
    alerts.append(f"HIGH TURBIDITY: peak {turbidity.max():.0f} NTU (rain event)")
if np.any(temp > 26):
    alerts.append(f"HIGH TEMP: reached {temp.max():.1f}°C")

print("DASHBOARD ALERTS:")
for alert in alerts:
    print(f"  ⚠ {alert}")
print()
print("FISHING RECOMMENDATION:")
if do_vals[int(6*12)] > 6 and temp[int(6*12)] < 25:
    print("  ✓ Dawn conditions GOOD for fishing")
else:
    print("  ✗ Dawn conditions POOR — wait for improvement")`,
      challenge: 'Add a "fish activity" prediction based on the sensor data. Fish are most active when: temp 20-25°C, DO > 6 mg/L, turbidity < 30 NTU, flow 0.5-1.0 m/s. Plot the activity score over 24 hours.',
      successHint: 'From bamboo traps to IoT dashboards — fishing technology has come full circle. The Mishing read the river with their senses; sensors read it with electronics. Both are measuring the same variables: temperature, clarity, flow, oxygen. The tools change; the science endures.',
    },
    {
      title: 'Machine learning for fish species identification',
      concept: `Can a computer identify fish species from photographs? **Convolutional Neural Networks (CNNs)** can be trained to classify fish images with >95% accuracy — sometimes better than trained biologists.

How CNN fish identification works:
1. **Training data**: thousands of labeled photos of each species
2. **Feature extraction**: the CNN learns to detect edges, shapes, colors, patterns automatically
3. **Classification**: final layers output probability for each species
4. **Deployment**: a phone app takes a photo → CNN identifies the species

Key features the CNN learns:
- Body shape (length-to-width ratio)
- Fin position and shape
- Color patterns and markings
- Scale patterns
- Eye position and size

For the Mishing: a fish ID app could help younger fishermen learn species identification, verify catches for market pricing, and record biodiversity data for conservation.

This is not hypothetical — apps like FishVerify, iNaturalist, and PictureFish already do this. The technology works because fish species have consistent, measurable visual differences — exactly what neural networks excel at detecting.`,
      analogy: 'A CNN learning to identify fish is like a child learning to tell cats from dogs. The child sees hundreds of examples, gradually learning that cats have pointed ears and dogs have floppy ears (not always, but usually). The CNN does the same — except it can learn subtle features invisible to humans, like the exact ratio of fin length to body depth.',
      storyConnection: 'The Mishing teach fish identification through apprenticeship — years of handling fish, learning the subtle differences between species. A CNN compresses this apprenticeship into training on thousands of images. It learns what the Mishing master knows, but in a different way — through statistical patterns rather than lived experience.',
      checkQuestion: 'A fish ID app trained on photographs from one river might fail on the same species in another river. Why?',
      checkAnswer: 'Fish of the same species can look different in different habitats — darker in murky water, lighter in clear streams, different sizes due to food availability, different body proportions due to current speed adaptation. This is called phenotypic plasticity. The CNN might learn habitat-specific features rather than species-specific ones. Solution: train on diverse images from many habitats, or use geometric morphometrics (body shape ratios) that are more consistent than color.',
      codeIntro: 'Build a simplified fish species classifier using body measurements.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified fish classifier based on two measurements:
# 1. Length-to-depth ratio (body shape)
# 2. Fin-to-body ratio (fin prominence)

# Generate training data for 4 species
def generate_fish(n, length_depth_mean, length_depth_std, fin_ratio_mean, fin_ratio_std):
    ld = np.random.normal(length_depth_mean, length_depth_std, n)
    fr = np.random.normal(fin_ratio_mean, fin_ratio_std, n)
    return ld, fr

# Species characteristics
n = 50
species_data = {
    'Mahseer': generate_fish(n, 3.5, 0.3, 0.15, 0.02),
    'Catfish': generate_fish(n, 5.0, 0.4, 0.08, 0.02),
    'Rohu': generate_fish(n, 3.0, 0.25, 0.12, 0.02),
    'Puntius': generate_fish(n, 2.5, 0.2, 0.18, 0.03),
}
colors = {'Mahseer': '#22c55e', 'Catfish': '#f59e0b', 'Rohu': '#3b82f6', 'Puntius': '#ef4444'}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.5))
fig.patch.set_facecolor('#1f2937')

# Scatter plot of species in feature space
ax1.set_facecolor('#111827')
for name, (ld, fr) in species_data.items():
    ax1.scatter(ld, fr, c=colors[name], s=30, alpha=0.6, label=name)

ax1.set_xlabel('Length/Depth ratio', color='white')
ax1.set_ylabel('Fin/Body ratio', color='white')
ax1.set_title('Fish Species in Measurement Space', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Decision boundary (simple nearest-centroid classifier)
centroids = {}
for name, (ld, fr) in species_data.items():
    centroids[name] = (np.mean(ld), np.mean(fr))
    ax1.plot(np.mean(ld), np.mean(fr), 'X', color=colors[name], markersize=15,
            markeredgecolor='white', markeredgewidth=1.5)

# Classify a grid of points
xx, yy = np.meshgrid(np.linspace(1.5, 6.5, 200), np.linspace(0, 0.3, 200))
grid_class = np.zeros_like(xx)

name_to_num = {n: i for i, n in enumerate(species_data.keys())}
for i in range(xx.shape[0]):
    for j in range(xx.shape[1]):
        dists = {n: np.sqrt((xx[i,j]-c[0])**2 + (yy[i,j]-c[1])**2) for n, c in centroids.items()}
        nearest = min(dists, key=dists.get)
        grid_class[i,j] = name_to_num[nearest]

ax1.contourf(xx, yy, grid_class, alpha=0.1, levels=[-0.5, 0.5, 1.5, 2.5, 3.5],
            colors=[colors[n] for n in species_data.keys()])

# Confusion matrix (test with new data)
ax2.set_facecolor('#111827')
n_test = 20
confusion = np.zeros((4, 4))
species_list = list(species_data.keys())

for true_idx, (name, (ld_mean, fr_mean)) in enumerate([(n, (np.mean(d[0]), np.mean(d[1]))) for n, d in species_data.items()]):
    ld_test, fr_test = species_data[name]
    for k in range(min(n_test, len(ld_test))):
        dists = {n2: np.sqrt((ld_test[k]-c[0])**2 + (fr_test[k]-c[1])**2) for n2, c in centroids.items()}
        pred = min(dists, key=dists.get)
        pred_idx = species_list.index(pred)
        confusion[true_idx, pred_idx] += 1

# Normalize
confusion_pct = confusion / confusion.sum(axis=1, keepdims=True) * 100

im = ax2.imshow(confusion_pct, cmap='Greens', vmin=0, vmax=100)
ax2.set_xticks(range(4))
ax2.set_yticks(range(4))
ax2.set_xticklabels(species_list, color='white', fontsize=9, rotation=30, ha='right')
ax2.set_yticklabels(species_list, color='white', fontsize=9)
ax2.set_xlabel('Predicted', color='white')
ax2.set_ylabel('Actual', color='white')
ax2.set_title('Classification Accuracy (%)', color='white', fontsize=12)
for i in range(4):
    for j in range(4):
        ax2.text(j, i, f'{confusion_pct[i,j]:.0f}%', ha='center', va='center',
                color='white' if confusion_pct[i,j] > 50 else 'gray', fontsize=10)

plt.tight_layout()
plt.show()

overall_accuracy = np.trace(confusion) / confusion.sum() * 100
print(f"Overall classification accuracy: {overall_accuracy:.1f}%")
print()
for i, name in enumerate(species_list):
    acc = confusion_pct[i, i]
    print(f"  {name}: {acc:.0f}% correctly identified")`,
      challenge: 'Add a 5th species with measurements that overlap heavily with an existing species. How does this affect accuracy? What additional measurement would help distinguish them?',
      successHint: 'From traditional knowledge to machine learning — the full journey of Mishing fishing technology. The bamboo trap, the cast net, the sonar fish finder, and the AI species classifier are all solving the same set of problems: find fish, catch fish, identify fish, sustain fish.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced fisheries analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            />
        ))}
      </div>
    </div>
  );
}
