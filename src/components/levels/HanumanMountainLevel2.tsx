import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Rocket } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import HanumanDichotomousKeyDiagram from '../diagrams/HanumanDichotomousKeyDiagram';
import HanumanAltitudeZonesDiagram from '../diagrams/HanumanAltitudeZonesDiagram';
import HanumanTectonicDiagram from '../diagrams/HanumanTectonicDiagram';
import HanumanMedicineDiagram from '../diagrams/HanumanMedicineDiagram';
import PlateBoundaryDiagram from '../diagrams/PlateBoundaryDiagram';
import ActivityHerbIdentifyDiagram from '../diagrams/ActivityHerbIdentifyDiagram';

export default function HanumanMountainLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plant databases — structuring botanical knowledge',
      concept: `In Level 1, you built a simple dichotomous key as nested dictionaries. Real botanical databases store thousands of species with dozens of attributes: leaf type, flower structure, altitude range, soil preference, chemical compounds.

A **data structure** for a plant species needs:
- **Taxonomy**: family, genus, species
- **Morphology**: leaf shape, flower color, height
- **Ecology**: altitude range, preferred habitat
- **Chemistry**: known active compounds

In Python, we represent this as a **dictionary of dictionaries** or, better, a **list of dictionaries** — each entry is one species. This lets us search, filter, and sort by any attribute.

The code below builds a mini botanical database and queries it using list comprehensions — Python's powerful filtering syntax.`,
      analogy: 'A botanical database is like a library catalogue. Each book (species) has a card with title, author, subject, and shelf number. The catalogue lets you find books by any field: "show me all books by Indian authors about chemistry." A plant database does the same: "show me all species above 4,000 m with yellow flowers."',
      storyConnection: 'If Hanuman had a botanical database, he could have queried: "species = healing, altitude > 4000, region = Himalayas" and found the Sanjeevani without lifting the mountain. Databases turn impossible searches into instant lookups.',
      checkQuestion: 'Why is a list of dictionaries better than a nested dictionary for a plant database?',
      checkAnswer: 'A list of dictionaries lets you iterate, filter, and sort easily using list comprehensions. Each dictionary is a self-contained record. With nested dicts, you need to know the key hierarchy in advance, making queries harder.',
      codeIntro: 'Build a botanical database and query it for high-altitude medicinal plants.',
      code: `# Mini botanical database
plants = [
    {"name": "Tulsi", "genus": "Ocimum", "species": "sanctum",
     "altitude": (0, 1800), "leaf": "simple", "flower": "purple",
     "compound": "eugenol", "use": "anti-inflammatory"},
    {"name": "Turmeric", "genus": "Curcuma", "species": "longa",
     "altitude": (0, 1500), "leaf": "compound", "flower": "yellow",
     "compound": "curcumin", "use": "antioxidant"},
    {"name": "Neem", "genus": "Azadirachta", "species": "indica",
     "altitude": (0, 700), "leaf": "compound", "flower": "white",
     "compound": "azadirachtin", "use": "antibacterial"},
    {"name": "Sarpagandha", "genus": "Rauvolfia", "species": "serpentina",
     "altitude": (0, 1300), "leaf": "simple", "flower": "white",
     "compound": "reserpine", "use": "blood pressure"},
    {"name": "Himalayan Yew", "genus": "Taxus", "species": "wallichiana",
     "altitude": (2400, 3800), "leaf": "needle", "flower": "none",
     "compound": "taxol", "use": "anti-cancer"},
    {"name": "Aconite", "genus": "Aconitum", "species": "heterophyllum",
     "altitude": (3000, 5000), "leaf": "simple", "flower": "blue",
     "compound": "atisine", "use": "fever/pain (toxic)"},
]

# Query: plants that grow above 2000 m
high_alt = [p for p in plants if p["altitude"][0] >= 2000]
print("=== High-Altitude Medicinal Plants ===")
for p in high_alt:
    lo, hi = p["altitude"]
    print(f"  {p['name']} ({p['genus']} {p['species']})")
    print(f"    Altitude: {lo}-{hi} m | Compound: {p['compound']}")

# Query: plants with anti-cancer/anti-inflammatory use
healing = [p for p in plants if "anti" in p["use"]]
print(f"\\\n{len(healing)} plants with 'anti-' properties:")
for p in healing:
    print(f"  {p['name']}: {p['use']} ({p['compound']})")`,
      challenge: 'Add 3 more plants to the database (research real Himalayan herbs). Then write a query that finds all plants whose altitude range overlaps with 3000-4000 m. Hint: overlap means plant_low < 4000 AND plant_high > 3000.',
      successHint: 'You just built a searchable botanical database from scratch. Real databases like the International Plant Names Index (IPNI) store over a million entries — same structure, bigger data.',
    },
    {
      title: 'Rock types and plate boundaries — reading the Himalayan story',
      concept: `The Himalayas are not made of one type of rock. Different tectonic forces produce different rocks, and geologists read rocks like pages of a history book.

Three types:
- **Igneous**: formed from cooled magma/lava (granite, basalt). Found where plates pull apart or where volcanoes erupt.
- **Sedimentary**: formed from compressed layers of sand, mud, or shells (limestone, sandstone). Found on ocean floors and river deltas.
- **Metamorphic**: formed when existing rock is heated and squeezed without melting (marble from limestone, slate from shale). Found at plate collision zones.

The Himalayas contain all three, but metamorphic rocks dominate — because the collision zone squeezes rock under immense pressure. Marine fossils found at 8,000+ metres on Everest prove that this rock was once an ocean floor, pushed skyward by tectonic forces.`,
      analogy: 'Igneous rock is like pottery fresh from a kiln (formed by heat). Sedimentary rock is like a layered cake (built up layer by layer). Metamorphic rock is like that cake after someone sat on it — the same ingredients, but compressed and transformed by pressure.',
      storyConnection: 'The mountain Hanuman lifted was made of rock that began as ocean floor sediment, was compressed into metamorphic rock by tectonic forces, and was pushed 5,000+ metres into the sky. Marine fossils at the summit prove the Himalayas were once underwater.',
      checkQuestion: 'Why are marine fossils found on top of the Himalayas?',
      checkAnswer: 'Before India collided with Asia, there was an ocean (Tethys Sea) between them. The ocean floor collected shells and marine organisms that became limestone. The collision pushed this ocean floor upward. The fossils rode the rock from the sea floor to the sky — a journey of 50 million years and 8,000+ metres.',
      codeIntro: 'Classify Himalayan rock samples by type, origin, and altitude found.',
      code: `import matplotlib.pyplot as plt
import numpy as np

rocks = {
    'Granite': {'type': 'Igneous', 'altitude': 4500, 'age_my': 500},
    'Limestone': {'type': 'Sedimentary', 'altitude': 7000, 'age_my': 250},
    'Marble': {'type': 'Metamorphic', 'altitude': 5500, 'age_my': 45},
    'Slate': {'type': 'Metamorphic', 'altitude': 3500, 'age_my': 50},
    'Sandstone': {'type': 'Sedimentary', 'altitude': 6000, 'age_my': 200},
    'Gneiss': {'type': 'Metamorphic', 'altitude': 4000, 'age_my': 40},
}

colors = {'Igneous': '#e74c3c', 'Sedimentary': '#f39c12',
          'Metamorphic': '#9b59b6'}

fig, ax = plt.subplots(figsize=(8, 5))
for name, data in rocks.items():
    ax.scatter(data['age_my'], data['altitude'], s=200,
               color=colors[data['type']], edgecolor='white',
               linewidth=1.5, zorder=3)
    ax.annotate(name, (data['age_my'], data['altitude']),
                textcoords="offset points", xytext=(8, 5),
                fontsize=9, color='white')

for rtype, color in colors.items():
    ax.scatter([], [], color=color, s=100, label=rtype)
ax.legend(fontsize=10)
ax.set_xlabel('Age (million years)')
ax.set_ylabel('Altitude Found (m)')
ax.set_title('Himalayan Rock Types: Age vs Altitude')
ax.grid(alpha=0.2)
plt.show()

print("Metamorphic rocks dominate — collision pressure!")
print("Sedimentary rocks found at 7000+ m = ancient ocean floor")
print("Marine fossils on Everest prove it was once underwater.")`,
      challenge: 'Add the rock cycle as arrows: sedimentary → metamorphic (heat+pressure), igneous → sedimentary (weathering), metamorphic → igneous (melting). Use plt.annotate() with arrowprops.',
      successHint: 'Geologists reconstruct millions of years of history from rock type and location. The Himalayas are a living textbook of plate tectonics.',
    },
    {
      title: 'Leaf morphology — classifying by shape and structure',
      concept: `Botanists classify leaves by a precise vocabulary:

**Arrangement**: alternate (one per node), opposite (two per node), whorled (three+ per node)
**Type**: simple (one blade) vs compound (divided into leaflets)
**Shape**: lanceolate (spear), ovate (egg), cordate (heart), linear (grass-like)
**Margin**: entire (smooth), serrate (toothed), lobed (deep cuts)
**Venation**: parallel (monocots) vs reticulate/netted (dicots)

These features are not arbitrary — they reflect the plant's evolutionary strategy. Needle-shaped leaves (conifers) conserve water at high altitude. Broad leaves (tropical trees) maximise light capture in dense forests. Thick waxy leaves (succulents) store water in dry environments.

Each feature is a **data point**. Combine enough data points and you can uniquely identify any species — this is the basis of plant classification and machine learning.`,
      analogy: 'Leaf features are like a fingerprint. No two species have the same combination of shape, edge, vein pattern, and texture. Just as detectives use fingerprints to identify people, botanists use leaf features to identify plants.',
      storyConnection: 'The Sanjeevani herb had specific leaf characteristics that made it identifiable — if you knew what to look for. Hanuman did not know botany, so he could not distinguish the herb from its neighbours. A trained botanist would observe leaf shape, flower structure, and altitude zone to narrow down the species.',
      checkQuestion: 'Why do conifers (pine, spruce) have needle-shaped leaves instead of broad flat ones?',
      checkAnswer: 'Needles have a tiny surface area, which reduces water loss through evaporation. At high altitude, water is scarce (frozen in soil), UV is intense, and wind is strong. Broad leaves would lose water too fast and be damaged by wind. Needles also shed snow easily, preventing branches from breaking under weight.',
      codeIntro: 'Encode leaf features as numerical vectors and compare species using distance.',
      code: `import numpy as np

# Encode leaf features as numbers (0-1 scale)
features = ['length_cm', 'width_cm', 'is_compound',
            'is_toothed', 'is_needle', 'altitude_km']

plants = {
    'Tulsi':      np.array([4.0, 2.5, 0, 0, 0, 0.5]),
    'Neem':       np.array([6.0, 1.5, 1, 1, 0, 0.3]),
    'Pine':       np.array([8.0, 0.1, 0, 0, 1, 3.0]),
    'Rhododendron': np.array([12, 5.0, 0, 0, 0, 2.5]),
    'Aconite':    np.array([5.0, 3.0, 0, 1, 0, 4.0]),
    'Juniper':    np.array([1.5, 0.2, 0, 0, 1, 3.5]),
}

# Normalise each feature to 0-1 range
all_vals = np.array(list(plants.values()))
mins = all_vals.min(axis=0)
maxs = all_vals.max(axis=0)
norm = {k: (v - mins) / (maxs - mins + 1e-10)
        for k, v in plants.items()}

# Calculate distance between all pairs
print("=== Plant Similarity (Euclidean Distance) ===")
print(f"{'':12s}", end="")
for name in plants:
    print(f"{name:>12s}", end="")
print()

for n1, v1 in norm.items():
    print(f"{n1:12s}", end="")
    for n2, v2 in norm.items():
        d = np.linalg.norm(v1 - v2)
        print(f"{d:12.2f}", end="")
    print()

print("\\\nSmall distance = similar plants.")
print("Pine and Juniper are closest (both needle-leaved, high alt).")`,
      challenge: 'Find the two MOST similar plants programmatically (exclude self-comparisons). Print which pair has the smallest distance and explain why biologically.',
      successHint: 'You just did something profound — represented biological features as numbers and used geometry (Euclidean distance) to measure similarity. This is the foundation of computational taxonomy and machine learning.',
    },
    {
      title: 'Plate movement over time — reconstructing India\'s journey',
      concept: `India did not always sit where it is today. 150 million years ago, it was attached to **Gondwana** — a supercontinent near the South Pole that included Africa, South America, Australia, and Antarctica.

About 130 million years ago, India broke free and began drifting north across the Tethys Ocean at speeds up to 18 cm/year — unusually fast for a tectonic plate. It traveled roughly 6,000 km before colliding with Asia about 50 million years ago.

How do we know this? **Paleomagnetism**. When lava cools, iron minerals align with Earth's magnetic field, recording the latitude and direction at the time of cooling. By measuring the magnetic orientation of rocks at different ages across India, geologists can trace India's path like GPS breadcrumbs.

The code below reconstructs India's northward drift as an animation of position over geological time.`,
      analogy: 'Paleomagnetism is like a compass frozen in stone. When lava solidifies, its iron minerals lock in the direction of Earth\'s magnetic field at that moment. Millions of years later, geologists read these "frozen compasses" to figure out where the rock was when it formed.',
      storyConnection: 'The Himalayas exist because India traveled 6,000 km to collide with Asia. Without this incredible journey, there would be no mountain, no extreme altitude, no Sanjeevani herb, and no story of Hanuman flying to the Himalayas.',
      checkQuestion: 'If India moved at 18 cm/year for 80 million years before slowing to 5 cm/year for 50 million years, how far did it travel total?',
      checkAnswer: '18 cm/yr x 80M yr = 14,400 km. 5 cm/yr x 50M yr = 2,500 km. Total = 16,900 km. The actual distance is less because the speed varied, but this shows India was one of the fastest-moving plates in geological history.',
      codeIntro: 'Reconstruct India\'s northward drift from Gondwana to the Himalayan collision.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# India's latitude over time (simplified)
time_mya = np.array([130, 100, 80, 60, 50, 40, 20, 0])
latitude = np.array([-40, -20, -5, 10, 20, 24, 26, 28])

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(time_mya, latitude, 'o-', color='#e74c3c',
        linewidth=2, markersize=8, label='India')
ax.axhline(y=28, color='cyan', ls='--', alpha=0.5,
           label='Eurasian Plate (~28°N)')

# Speed between points
for i in range(len(time_mya) - 1):
    dt = (time_mya[i] - time_mya[i+1]) * 1e6
    dlat = latitude[i+1] - latitude[i]
    dist_km = dlat * 111  # 1 degree ≈ 111 km
    speed_cm = dist_km * 1e5 / dt
    mid_t = (time_mya[i] + time_mya[i+1]) / 2
    mid_lat = (latitude[i] + latitude[i+1]) / 2
    ax.annotate(f'{speed_cm:.0f} cm/yr', (mid_t, mid_lat),
                fontsize=8, color='#f39c12', ha='center')

ax.set_xlabel('Million Years Ago')
ax.set_ylabel('Latitude (°)')
ax.set_title("India's Journey: From Gondwana to Asia")
ax.legend()
ax.invert_xaxis()
ax.grid(alpha=0.2)
plt.show()

print("India traveled from 40°S to 28°N — nearly 70 degrees!")
print("Speed peaked around 100-80 mya at ~18 cm/year.")`,
      challenge: 'Add Africa and Australia to the plot. Africa barely moved (stayed near 0-10°N). Australia drifted from -60° to -25°. Plot all three on the same axes to show Gondwana breaking apart.',
      successHint: 'You just reconstructed 130 million years of tectonic history from data. Geologists do exactly this — combining paleomagnetic data, fossil evidence, and rock types to trace the movement of continents.',
    },
    {
      title: 'Altitude and plant chemistry — why stressed plants make medicine',
      concept: `Here is a remarkable pattern: many of the world's most powerful plant medicines come from species that grow under **stress** — high altitude, drought, extreme cold, or intense UV.

Why? Plants under stress produce more **secondary metabolites** as a defense mechanism. These compounds include:
- **Alkaloids** (caffeine, morphine, quinine): nitrogen-containing, often bitter, deter herbivores
- **Terpenes** (menthol, camphor, THC): aromatic, repel insects, protect against UV
- **Phenolics** (tannins, flavonoids, curcumin): antioxidants, protect cells from UV damage

At high altitude, UV radiation is 2-3x stronger (thinner atmosphere filters less), and plants respond by producing more UV-protective phenolics. Cold stress triggers production of antifreeze compounds and stress proteins. These same compounds often have beneficial effects in human medicine.

This is not coincidence — it is chemistry shaped by natural selection.`,
      analogy: 'A plant under stress is like a factory switching to emergency production. Normally it makes growth compounds (like a factory making toys). Under UV stress, it switches to producing UV shields (like a factory switching to armour). These "emergency products" — phenolics, alkaloids — are what we harvest as medicine.',
      storyConnection: 'The Sanjeevani herb grew at extreme altitude precisely because those harsh conditions triggered the production of powerful healing compounds. The same stress that makes the herb rare also makes it medicinally potent. Remove the stress (grow it in a greenhouse at sea level), and it may lose its chemical power.',
      checkQuestion: 'If a tea plantation at 2,000 m produces tea with more antioxidants than one at 500 m, why?',
      checkAnswer: 'Higher altitude means stronger UV radiation. The tea plants respond by producing more polyphenols (catechins, EGCG) as UV shields. These polyphenols are the antioxidants that make high-altitude tea more valued. Darjeeling tea (grown at 2,000+ m) is prized partly for this reason.',
      codeIntro: 'Model the relationship between altitude stress and secondary metabolite production.',
      code: `import numpy as np
import matplotlib.pyplot as plt

alt = np.linspace(0, 5000, 200)

# UV index increases with altitude
uv = 3 + alt / 1000 * 1.8

# Secondary metabolite production (arbitrary units)
# Follows a sigmoid: low at low alt, jumps after 2000 m
metabolites = 20 + 80 / (1 + np.exp(-0.003 * (alt - 2500)))

# Growth rate decreases with altitude
growth = 100 * np.exp(-0.0005 * alt)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

ax1.plot(alt, uv, 'purple', linewidth=2, label='UV Index')
ax1.plot(alt, metabolites, 'g-', linewidth=2, label='Metabolites')
ax1.set_xlabel('Altitude (m)')
ax1.set_ylabel('Relative Level')
ax1.set_title('UV Stress → Chemical Defense')
ax1.legend(fontsize=9)
ax1.grid(alpha=0.2)

ax2.plot(alt, growth, 'b-', linewidth=2, label='Growth Rate')
ax2.plot(alt, metabolites, 'g-', linewidth=2, label='Metabolites')
ax2.set_xlabel('Altitude (m)')
ax2.set_title('Growth vs Defense Trade-off')
ax2.legend(fontsize=9)
ax2.grid(alpha=0.2)

plt.tight_layout()
plt.show()

print("As UV stress increases, metabolite production rises.")
print("But growth rate falls — energy goes to defense, not growth.")
print("This trade-off explains why medicinal herbs are small and slow.")`,
      challenge: 'Overlay real data: Darjeeling tea polyphenol content increases ~15% from 500 m to 2,000 m. Add tea data points and see if they match your model curve.',
      successHint: 'You have discovered the evolutionary logic behind ethnobotany. Traditional healers, over millennia, learned to seek medicinal plants in harsh environments — the same places where stress-induced chemistry is strongest.',
    },
    {
      title: 'Building a plant identification system — features to classification',
      concept: `You now have the pieces: leaf morphology, altitude zones, chemical compounds. Combine them and you have a **classification system** — given a set of features, predict the species.

This is exactly what machine learning does. A **decision tree** asks questions about features in sequence (just like a dichotomous key) but learns the best questions automatically from data.

The algorithm:
1. Start with all samples
2. Find the feature that best splits them into groups (highest **information gain**)
3. Split on that feature
4. Repeat for each subgroup until every sample is classified

For plant identification, good splitting features might be: altitude > 3000 m? leaf compound? flower present?

The code below implements a simple decision tree classifier for our plant database — the same algorithm that powers real plant identification apps.`,
      analogy: 'A decision tree is an automated dichotomous key. Instead of a botanist deciding which questions to ask, the algorithm looks at all the data and figures out the most efficient sequence of questions. It is like a detective who reads 10,000 case files and figures out: "always ask about the fingerprint first — it splits suspects most efficiently."',
      storyConnection: 'If Hanuman had a plant identification app powered by a decision tree, he could photograph the plants on the mountainside and the algorithm would classify each one by species, flagging the Sanjeevani herb instantly. Machine learning turns botanical knowledge into automated identification.',
      checkQuestion: 'Why is "altitude > 3000 m?" likely a better first question than "leaf length > 5 cm?" for identifying Himalayan herbs?',
      checkAnswer: 'Altitude sharply divides the plant list into distinct groups (tropical vs alpine species have very different sets). Leaf length varies within each altitude zone, so it separates species less cleanly. Information gain is higher for altitude — it is the more informative feature.',
      codeIntro: 'Build a decision tree classifier for Himalayan plants from feature vectors.',
      code: `import numpy as np

# Plant database: [alt_km, is_compound, is_toothed, flower_color_code]
# flower_color: 0=none, 1=white, 2=yellow, 3=purple, 4=blue
data = {
    "Tulsi":       [0.5, 0, 0, 3],
    "Neem":        [0.3, 1, 1, 1],
    "Turmeric":    [0.8, 1, 0, 2],
    "Yew":         [3.0, 0, 0, 0],
    "Aconite":     [4.0, 0, 1, 4],
    "Sarpagandha": [0.7, 0, 0, 1],
}

features = ["altitude_km", "is_compound", "is_toothed", "flower"]

def classify(sample):
    """Simple hand-built decision tree."""
    alt, compound, toothed, flower = sample
    if alt > 2.0:
        if flower == 0:
            return "Himalayan Yew"
        else:
            return "Aconite"
    else:
        if compound:
            if toothed:
                return "Neem"
            else:
                return "Turmeric"
        else:
            if flower == 3:
                return "Tulsi"
            else:
                return "Sarpagandha"

# Test all entries
print("=== Decision Tree Classification ===")
correct = 0
for name, feats in data.items():
    pred = classify(feats)
    match = "OK" if pred == name else "WRONG"
    if pred == name:
        correct += 1
    print(f"  {name:15s} -> {pred:15s} [{match}]")

print(f"\\\nAccuracy: {correct}/{len(data)} = {correct/len(data)*100:.0f}%")
print("3 questions max to identify any of 6 species.")
print("A real app uses 100+ features and 10,000+ species.")`,
      challenge: 'Add 3 more species to the database and expand the decision tree to handle them. What is the minimum depth needed for 9 species? (Hint: 2^depth >= number of species.)',
      successHint: 'You just built a classification algorithm by hand — the same logic that powers real plant ID apps like iNaturalist and PlantNet. In Level 4, you will train a machine learning model to do this automatically.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Rocket className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Plant classification, geological data, and botanical databases</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises build botanical databases and classification systems. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Rocket className="w-5 h-5" />Load Python</>)}
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
            diagram={[HanumanDichotomousKeyDiagram, HanumanTectonicDiagram, HanumanAltitudeZonesDiagram, PlateBoundaryDiagram, HanumanMedicineDiagram, ActivityHerbIdentifyDiagram][i] ? createElement([HanumanDichotomousKeyDiagram, HanumanTectonicDiagram, HanumanAltitudeZonesDiagram, PlateBoundaryDiagram, HanumanMedicineDiagram, ActivityHerbIdentifyDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
