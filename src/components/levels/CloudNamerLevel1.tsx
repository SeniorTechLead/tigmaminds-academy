import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudNamerLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Why we classify — making sense of the world',
      concept: `The child in the story named every cloud she saw, giving each a shape, a mood, a category. She wasn't just playing — she was doing what every scientist does: **classifying**. Classification is the act of sorting things into groups based on shared properties.

Why bother classifying?
- **Communication**: When a doctor says "streptococcus," every doctor worldwide knows what organism is meant
- **Prediction**: If you know an animal is a mammal, you can predict it has warm blood, hair, and feeds milk to its young — even if you've never seen that species before
- **Discovery**: Patterns in classification reveal evolutionary relationships

Without classification, biology would be a chaotic list of 8.7 million species with no organizing principle. Classification turns chaos into understanding.`,
      analogy: 'Classification is like organizing a library. Without it, every book is just thrown in a pile. With the Dewey Decimal System, you can find any book among millions. Biological classification (taxonomy) is the Dewey Decimal System for all life on Earth.',
      storyConnection: 'The child who named the clouds was doing taxonomy instinctively — grouping puffy clouds separately from wispy ones, dark storm clouds from bright fair-weather ones. Luke Howard did the same thing formally in 1802, and meteorologists still use his system today.',
      checkQuestion: 'A platypus lays eggs like a reptile but produces milk like a mammal. How should we classify it, and what does this tell us about classification systems?',
      checkAnswer: 'The platypus is classified as a mammal (class Mammalia, order Monotremata). It tells us that classification systems are human constructs that sometimes struggle with organisms that blur boundaries. The platypus didn\'t read our textbook — nature doesn\'t always fit neatly into boxes. That\'s why taxonomy keeps evolving.',
      codeIntro: 'Visualize a simple classification tree for the animal kingdom.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')

# Build a simple classification tree
nodes = {
    'Life': (0.5, 0.95),
    'Animals': (0.3, 0.78),
    'Plants': (0.7, 0.78),
    'Vertebrates': (0.15, 0.6),
    'Invertebrates': (0.4, 0.6),
    'Flowering': (0.6, 0.6),
    'Non-flowering': (0.82, 0.6),
    'Mammals': (0.05, 0.4),
    'Birds': (0.15, 0.4),
    'Reptiles': (0.25, 0.4),
    'Fish': (0.08, 0.22),
    'Insects': (0.35, 0.4),
    'Spiders': (0.45, 0.4),
    'Roses': (0.55, 0.4),
    'Grasses': (0.65, 0.4),
    'Ferns': (0.78, 0.4),
    'Mosses': (0.88, 0.4),
}

edges = [
    ('Life', 'Animals'), ('Life', 'Plants'),
    ('Animals', 'Vertebrates'), ('Animals', 'Invertebrates'),
    ('Plants', 'Flowering'), ('Plants', 'Non-flowering'),
    ('Vertebrates', 'Mammals'), ('Vertebrates', 'Birds'), ('Vertebrates', 'Reptiles'),
    ('Mammals', 'Fish'),
    ('Invertebrates', 'Insects'), ('Invertebrates', 'Spiders'),
    ('Flowering', 'Roses'), ('Flowering', 'Grasses'),
    ('Non-flowering', 'Ferns'), ('Non-flowering', 'Mosses'),
]

colors_map = {
    'Life': '#f59e0b', 'Animals': '#ef4444', 'Plants': '#22c55e',
    'Vertebrates': '#ef4444', 'Invertebrates': '#ef4444',
    'Flowering': '#22c55e', 'Non-flowering': '#22c55e',
    'Mammals': '#f97316', 'Birds': '#f97316', 'Reptiles': '#f97316', 'Fish': '#f97316',
    'Insects': '#ec4899', 'Spiders': '#ec4899',
    'Roses': '#10b981', 'Grasses': '#10b981',
    'Ferns': '#14b8a6', 'Mosses': '#14b8a6',
}

for parent, child in edges:
    x = [nodes[parent][0], nodes[child][0]]
    y = [nodes[parent][1], nodes[child][1]]
    ax.plot(x, y, color='#4b5563', linewidth=1.5, zorder=1)

for name, (x, y) in nodes.items():
    c = colors_map.get(name, '#9ca3af')
    ax.scatter(x, y, s=120, color=c, zorder=2, edgecolors='white', linewidths=0.5)
    ax.annotate(name, (x, y), textcoords="offset points", xytext=(0, 10),
                ha='center', fontsize=8, color='white', fontweight='bold')

ax.set_xlim(-0.05, 1.05)
ax.set_ylim(0.1, 1.05)
ax.set_title('A Simple Tree of Life — Classification in Action', color='white', fontsize=13)
ax.axis('off')

plt.tight_layout()
plt.show()

print("Classification creates a hierarchy:")
print("  Life > Kingdom > Phylum > Class > Order > Family > Genus > Species")
print()
print("Each level groups organisms by shared traits.")
print("The deeper you go, the more specific the group.")
print("Humans: Animalia > Chordata > Mammalia > Primates > Hominidae > Homo > sapiens")`,
      challenge: 'Add "Amphibians" as a child of "Vertebrates" and "Worms" as a child of "Invertebrates." What happens to the tree?',
      successHint: 'Every classification tree is a hypothesis about relationships. As we learn more (especially from DNA), we redraw the tree. Classification isn\'t fixed — it\'s a living, evolving framework.',
    },
    {
      title: 'Kingdoms of life — the biggest groups',
      concept: `All living things on Earth are sorted into major groups. The most widely used modern system recognizes **six kingdoms**:

1. **Bacteria** — single-celled, no nucleus (prokaryotes). The most abundant life form.
2. **Archaea** — single-celled, no nucleus, but biochemically distinct from bacteria. Thrive in extreme environments (hot springs, salt lakes).
3. **Protista** — mostly single-celled with a nucleus (eukaryotes). Amoebas, algae, slime molds.
4. **Fungi** — multicellular (mostly), absorb nutrients from dead matter. Mushrooms, yeasts, molds.
5. **Plantae** — multicellular, photosynthetic. From mosses to redwood trees.
6. **Animalia** — multicellular, consume other organisms. From sponges to blue whales.

The key dividing line: **prokaryote vs. eukaryote** (no nucleus vs. nucleus). This is a bigger difference than the one between a mushroom and a whale.`,
      analogy: 'Think of the six kingdoms as six different countries. Bacteria and Archaea are the oldest nations — they\'ve been around for 3.8 billion years. Plantae and Animalia are relatively new arrivals — only about 500 million years old. The "passport" that determines your kingdom is your cell structure.',
      storyConnection: 'The child who named the clouds didn\'t just classify clouds — she classified everything. In biology, the broadest classification is the kingdom. Every organism the child could ever name falls into one of these six groups, from the bacteria on her hands to the clouds of pollen from the trees.',
      checkQuestion: 'Mushrooms look like plants — they grow in soil, they don\'t move. Why aren\'t they classified as plants?',
      checkAnswer: 'Mushrooms don\'t photosynthesize. They lack chloroplasts and chlorophyll entirely. Instead, they absorb nutrients from dead or living organic matter (they\'re decomposers or parasites). Their cell walls are made of chitin (like insect exoskeletons), not cellulose (like plant cell walls). DNA analysis confirms fungi are actually more closely related to animals than to plants.',
      codeIntro: 'Compare the six kingdoms by key features.',
      code: `import numpy as np
import matplotlib.pyplot as plt

kingdoms = ['Bacteria', 'Archaea', 'Protista', 'Fungi', 'Plantae', 'Animalia']

# Features (0-10 scale)
features = {
    'Cell complexity': [2, 2, 7, 8, 9, 9],
    'Avg organism size': [1, 1, 3, 5, 8, 7],
    'Species diversity': [9, 4, 7, 5, 6, 10],
    'Age (billions yrs)': [10, 10, 5, 3, 2, 2],
    'Ecological impact': [10, 6, 5, 7, 9, 8],
}

fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

x = np.arange(len(kingdoms))
width = 0.15
colors = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

for i, (feature, values) in enumerate(features.items()):
    offset = (i - len(features)/2 + 0.5) * width
    bars = ax.bar(x + offset, values, width, label=feature, color=colors[i], alpha=0.85)

ax.set_xlabel('Kingdom', color='white', fontsize=11)
ax.set_ylabel('Score (0-10)', color='white', fontsize=11)
ax.set_title('Six Kingdoms of Life — Compared', color='white', fontsize=13)
ax.set_xticks(x)
ax.set_xticklabels(kingdoms, color='white', fontsize=9)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key insights:")
print("  Bacteria: tiny but ecologically dominant (they run the planet)")
print("  Archaea: ancient extremophiles, often overlooked")
print("  Protista: the 'catch-all' kingdom (most diverse cell types)")
print("  Fungi: decomposers that recycle all dead matter")
print("  Plantae: the oxygen producers and base of food chains")
print("  Animalia: the consumers — entirely dependent on other kingdoms")`,
      challenge: 'Add a 6th feature: "Photosynthesis ability" with values [3, 1, 5, 0, 10, 0]. Some bacteria and protists photosynthesize, but no fungi or animals do. How does this change the picture?',
      successHint: 'The six kingdoms are humanity\'s best attempt to organize all life into manageable groups. It\'s imperfect — Protista especially is a "leftover" kingdom — but it gives us a starting framework for understanding 8.7 million species.',
    },
    {
      title: 'Binomial nomenclature — the universal naming system',
      concept: `In the 1700s, a Swedish botanist named **Carl Linnaeus** solved a massive problem: every country had different names for the same species. The Indian house crow was called "kauwa" in Hindi, "kaak" in Assamese, "crow" in English, and "corvus" in Latin folk speech.

Linnaeus invented **binomial nomenclature**: every species gets exactly two Latin names.
- First name: **Genus** (capitalized) — the group of closely related species
- Second name: **species** (lowercase) — the specific member

Examples:
- Humans: *Homo sapiens* (wise man)
- House crow: *Corvus splendens* (shining crow)
- Indian tulsi: *Ocimum tenuiflorum* (slender-flowered basil)
- Rice: *Oryza sativa* (cultivated rice)

The rules are strict: always Latin or Latinized, always italicized, genus capitalized, species lowercase. This system has been universal since 1753.`,
      analogy: 'Binomial nomenclature works like an email address: username@domain. The genus is the domain (like gmail.com — a big group), and the species is the username (your unique identity within that group). Just as email addresses are universal across countries and languages, so are scientific names.',
      storyConnection: 'The child who named the clouds used her own names — personal, creative, poetic. But science needs universal names. Luke Howard gave clouds Latin names (cumulus, stratus, cirrus) for the same reason Linnaeus gave organisms Latin names: so that a scientist in India, Brazil, or Norway all mean exactly the same thing.',
      checkQuestion: 'Why Latin? Nobody speaks Latin anymore. Why not use English, which more people understand?',
      checkAnswer: 'Precisely because nobody speaks Latin. A living language changes and carries cultural baggage — English "robin" means different birds in America and Britain. Latin is dead (no native speakers to change it), neutral (no country "owns" it), and was the universal language of scholarship when Linnaeus created the system. It\'s a frozen, universal code.',
      codeIntro: 'Build a visual taxonomy chart for common organisms.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')

# Taxonomy examples
organisms = [
    ('Homo sapiens', 'Human', 'Animalia', 'Chordata', 'Mammalia', 'Primates'),
    ('Corvus splendens', 'House crow', 'Animalia', 'Chordata', 'Aves', 'Passeriformes'),
    ('Panthera tigris', 'Tiger', 'Animalia', 'Chordata', 'Mammalia', 'Carnivora'),
    ('Oryza sativa', 'Rice', 'Plantae', 'Angiosperm', 'Monocot', 'Poales'),
    ('Ocimum tenuiflorum', 'Tulsi', 'Plantae', 'Angiosperm', 'Eudicot', 'Lamiales'),
    ('Agaricus bisporus', 'Mushroom', 'Fungi', 'Basidiomycota', 'Agaricomycetes', 'Agaricales'),
]

levels = ['Kingdom', 'Phylum/Div', 'Class', 'Order']
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

y_pos = np.arange(len(organisms))
cell_width = 0.22

for i, level in enumerate(levels):
    for j, org in enumerate(organisms):
        text = org[2 + i]
        x = i * 1.2
        rect = plt.Rectangle((x - 0.5, j - 0.35), 1.1, 0.7,
                              facecolor=colors[i], alpha=0.2, edgecolor=colors[i], linewidth=1)
        ax.add_patch(rect)
        ax.text(x, j, text, ha='center', va='center', color='white', fontsize=7, fontweight='bold')

# Labels on left
for j, org in enumerate(organisms):
    ax.text(-0.8, j, f'{org[1]}\\n({org[0]})', ha='right', va='center',
            color='#d1d5db', fontsize=8, fontstyle='italic')

# Column headers
for i, level in enumerate(levels):
    ax.text(i * 1.2, len(organisms) + 0.1, level, ha='center', va='bottom',
            color=colors[i], fontsize=10, fontweight='bold')

ax.set_xlim(-2.5, 4.5)
ax.set_ylim(-0.8, len(organisms) + 0.5)
ax.set_title('Binomial Nomenclature — Universal Names for Life', color='white', fontsize=13)
ax.axis('off')

plt.tight_layout()
plt.show()

print("Binomial nomenclature rules:")
print("  1. Always two words: Genus + species")
print("  2. Genus capitalized, species lowercase")
print("  3. Always italicized (or underlined)")
print("  4. Latin or Latinized words")
print()
print("Human: Homo (genus = 'man') + sapiens (species = 'wise')")
print("Tiger: Panthera (genus = 'panther') + tigris (species = 'tiger')")
print("Rice:  Oryza (genus = 'rice') + sativa (species = 'cultivated')")`,
      challenge: 'Look up the binomial name for the Asian elephant, the muga silkworm, and the one-horned rhinoceros. Add them to the chart.',
      successHint: 'Every species on Earth has (or will have) a binomial name. There are currently about 1.5 million named species, with an estimated 7 million still unnamed. Taxonomy is far from finished.',
    },
    {
      title: 'Dichotomous keys — the decision tree for identification',
      concept: `How do you figure out what species you're looking at? You use a **dichotomous key** — a series of yes/no questions that narrows down the possibilities step by step.

"Dichotomous" means "dividing into two." At each step, you choose between two options:
1. Does it have a backbone? → Yes: Vertebrate / No: Invertebrate
2. Does it have feathers? → Yes: Bird / No: continue
3. Does it have fur? → Yes: Mammal / No: continue

Dichotomous keys are used by:
- **Botanists** identifying unknown plants in the field
- **Doctors** diagnosing diseases from symptoms
- **IT support** troubleshooting problems ("Is it plugged in? Yes/No")
- **Machine learning** engineers building decision tree classifiers

The concept is ancient, but the formalization as a tool happened in the 1700s alongside Linnaeus's taxonomy.`,
      analogy: 'A dichotomous key is like a game of Twenty Questions. Each question eliminates half the possibilities. With 20 yes/no questions, you can distinguish between over a million items (2²⁰ = 1,048,576). That\'s why it\'s so efficient — each question doubles the precision.',
      storyConnection: 'The child who named the clouds was building her own dichotomous key without knowing it: "Is the cloud flat? → Yes: stratus. No: Is it puffy? → Yes: cumulus. No: Is it wispy? → Yes: cirrus." Every classification starts with questions that split groups in two.',
      checkQuestion: 'You find an unknown animal in a forest. It has no legs, no backbone, and it\'s soft-bodied. Using a dichotomous key, what group would you narrow it down to?',
      checkAnswer: 'No backbone → Invertebrate. No legs → eliminates insects, spiders, crustaceans. Soft-bodied → likely a mollusk (slug, snail without shell) or a worm (annelid). You\'d need more questions: "Is it segmented? Yes → Annelid (earthworm). No → Mollusk (slug)." Each question halves the options.',
      codeIntro: 'Build and visualize a dichotomous key for identifying tree types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')

# Dichotomous key as a binary tree
questions = {
    (0.5, 0.92): ('Leaves present?', True),
    (0.25, 0.72): ('Broad leaves?', True),
    (0.75, 0.72): ('Has needles?', True),
    (0.12, 0.50): ('Leaves opposite?', True),
    (0.38, 0.50): ('Simple leaves?', True),
    (0.62, 0.50): ('Needles in\\nbundles?', True),
    (0.88, 0.50): ('Cactus-like?', True),
}

answers = {
    (0.05, 0.30): 'MAPLE',
    (0.19, 0.30): 'OAK',
    (0.31, 0.30): 'ROSE FAMILY',
    (0.45, 0.30): 'PALM',
    (0.55, 0.30): 'PINE',
    (0.69, 0.30): 'SPRUCE',
    (0.81, 0.30): 'CACTUS',
    (0.95, 0.30): 'DEAD TREE',
}

# Draw connections
edges = [
    ((0.5, 0.92), (0.25, 0.72), 'Yes'),
    ((0.5, 0.92), (0.75, 0.72), 'No'),
    ((0.25, 0.72), (0.12, 0.50), 'Yes'),
    ((0.25, 0.72), (0.38, 0.50), 'No'),
    ((0.75, 0.72), (0.62, 0.50), 'Yes'),
    ((0.75, 0.72), (0.88, 0.50), 'No'),
    ((0.12, 0.50), (0.05, 0.30), 'Yes'),
    ((0.12, 0.50), (0.19, 0.30), 'No'),
    ((0.38, 0.50), (0.31, 0.30), 'Yes'),
    ((0.38, 0.50), (0.45, 0.30), 'No'),
    ((0.62, 0.50), (0.55, 0.30), 'Yes'),
    ((0.62, 0.50), (0.69, 0.30), 'No'),
    ((0.88, 0.50), (0.81, 0.30), 'Yes'),
    ((0.88, 0.50), (0.95, 0.30), 'No'),
]

for start, end, label in edges:
    ax.plot([start[0], end[0]], [start[1], end[1]], color='#4b5563', linewidth=1.5)
    mid_x = (start[0] + end[0]) / 2
    mid_y = (start[1] + end[1]) / 2
    ax.text(mid_x, mid_y + 0.02, label, ha='center', fontsize=7,
            color='#22c55e' if label == 'Yes' else '#ef4444', fontweight='bold')

for (x, y), (text, is_q) in questions.items():
    bbox = dict(boxstyle='round,pad=0.3', facecolor='#3b82f6', alpha=0.3, edgecolor='#3b82f6')
    ax.text(x, y, text, ha='center', va='center', fontsize=8, color='white',
            fontweight='bold', bbox=bbox)

for (x, y), text in answers.items():
    bbox = dict(boxstyle='round,pad=0.3', facecolor='#22c55e', alpha=0.3, edgecolor='#22c55e')
    ax.text(x, y, text, ha='center', va='center', fontsize=8, color='white',
            fontweight='bold', bbox=bbox)

ax.set_xlim(-0.02, 1.02)
ax.set_ylim(0.18, 1.02)
ax.set_title('Dichotomous Key — Identify a Tree in 3 Questions', color='white', fontsize=13)
ax.axis('off')

plt.tight_layout()
plt.show()

print("How a dichotomous key works:")
print("  Start at the top question.")
print("  Answer Yes or No.")
print("  Follow the branch.")
print("  Repeat until you reach an identification.")
print()
print("With N questions, you can distinguish 2^N species:")
print(f"  3 questions: {2**3} species")
print(f"  10 questions: {2**10} species")
print(f"  20 questions: {2**20:,} species — enough for all known species!")`,
      challenge: 'Design your own dichotomous key to identify 8 common fruits (apple, banana, grape, orange, strawberry, watermelon, mango, cherry). What questions would you ask?',
      successHint: 'Dichotomous keys are the foundation of all classification algorithms in computer science. Decision trees in machine learning work on exactly the same principle — a series of binary splits that narrow down to an answer.',
    },
    {
      title: 'Cloud classification — Luke Howard names the sky',
      concept: `In 1802, an English pharmacist named **Luke Howard** gave a lecture that changed meteorology forever. He proposed classifying clouds into three basic types using Latin names:

- **Cumulus** (heap): puffy, cotton-like clouds with flat bases. Fair weather.
- **Stratus** (layer): flat, sheet-like clouds that cover the sky. Overcast, drizzle.
- **Cirrus** (curl): thin, wispy clouds at high altitude. Made of ice crystals.

He also described combinations:
- **Cumulonimbus**: towering cumulus + rain (nimbus) = thunderstorms
- **Cirrostratus**: high ice + layer = thin veil (halos around sun/moon)
- **Stratocumulus**: layer + heap = lumpy blanket (most common cloud type)

Howard's system worked because it was based on **observable properties** (shape, altitude, precipitation), not on unseen causes. This is the same principle behind all good classification: sort by what you can see and measure.`,
      analogy: 'Howard treated clouds the way Linnaeus treated organisms — he observed, grouped, and named. Before Howard, clouds were just "weather." After Howard, they were data. Naming things is the first step toward understanding them.',
      storyConnection: 'The child who named the clouds was a little Luke Howard. She looked up, saw differences, and gave each type a name. Howard\'s genius was formalizing this instinct into a system that anyone, anywhere could use. The child\'s personal names became science\'s universal names.',
      checkQuestion: 'You see a dark, flat cloud covering the whole sky and it\'s raining lightly. What type of cloud is it, using Howard\'s system?',
      checkAnswer: 'Nimbostratus. "Nimbus" means rain-bearing, "stratus" means layered. A dark, flat, rain-producing cloud is nimbostratus. If it were puffy and producing heavy rain with thunder, it would be cumulonimbus. The combination of shape + precipitation gives you the classification.',
      codeIntro: 'Visualize the cloud classification system by altitude and type.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#0c1524')

# Cloud types with altitude ranges (km)
clouds = [
    ('Cirrus', 7, 12, 0.15, '#e0e7ff', 'Wispy, ice crystals'),
    ('Cirrocumulus', 6, 10, 0.35, '#c7d2fe', 'Small ripples'),
    ('Cirrostratus', 6, 10, 0.55, '#a5b4fc', 'Thin veil, halos'),
    ('Altocumulus', 3, 7, 0.15, '#93c5fd', 'Medium clumps'),
    ('Altostratus', 3, 6, 0.45, '#60a5fa', 'Gray sheet'),
    ('Stratocumulus', 0.5, 2.5, 0.15, '#9ca3af', 'Lumpy blanket'),
    ('Stratus', 0, 2, 0.45, '#6b7280', 'Flat, gray, drizzle'),
    ('Cumulus', 0.5, 3, 0.7, '#fbbf24', 'Puffy, fair weather'),
    ('Nimbostratus', 0, 4, 0.85, '#4b5563', 'Dark, steady rain'),
    ('Cumulonimbus', 0.5, 12, 0.95, '#ef4444', 'Towers, thunder'),
]

for name, low, high, x, color, desc in clouds:
    rect = plt.Rectangle((x - 0.08, low), 0.16, high - low,
                          facecolor=color, alpha=0.4, edgecolor=color, linewidth=1.5)
    ax.add_patch(rect)
    mid_y = (low + high) / 2
    ax.text(x, mid_y, name, ha='center', va='center', color='white',
            fontsize=7, fontweight='bold', rotation=90 if (high - low) > 4 else 0)
    ax.text(x, low - 0.3, desc, ha='center', va='top', color='#9ca3af', fontsize=6)

# Altitude bands
for y, label, c in [(2, 'Low clouds (0-2 km)', '#6b7280'),
                     (6, 'Mid clouds (2-7 km)', '#60a5fa'),
                     (10, 'High clouds (6-12 km)', '#a5b4fc')]:
    ax.axhline(y, color=c, linestyle=':', alpha=0.3)
    ax.text(1.05, y, label, color=c, fontsize=8, va='center')

ax.set_xlim(0, 1.15)
ax.set_ylim(-1, 13)
ax.set_ylabel('Altitude (km)', color='white', fontsize=11)
ax.set_title('Luke Howard\\'s Cloud Classification (1802)', color='white', fontsize=13)
ax.set_xticks([])
ax.tick_params(axis='y', colors='gray')

plt.tight_layout()
plt.show()

print("Howard's system uses two properties:")
print("  1. Shape: cumulus (heap), stratus (layer), cirrus (curl)")
print("  2. Altitude: cirro- (high), alto- (mid), no prefix (low)")
print("  + nimbus/nimbo- for rain-bearing")
print()
print("This gives us 10 main cloud types — still used today, 220+ years later.")
print("Good classification systems are timeless.")`,
      challenge: 'Track the clouds for a week. Each day, identify the dominant cloud type and record the weather. Do certain cloud types reliably predict certain weather?',
      successHint: 'Howard\'s cloud classification is a perfect example of taxonomy done right: based on observable features, universally applicable, and useful for prediction. The same principles apply to classifying rocks, diseases, or data.',
    },
    {
      title: 'The periodic table — classification in chemistry',
      concept: `The periodic table is arguably the greatest classification achievement in all of science. In 1869, **Dmitri Mendeleev** arranged the 63 known elements by atomic weight and noticed a pattern: properties **repeated periodically**.

He organized elements into:
- **Rows (periods)**: elements with increasing atomic number
- **Columns (groups)**: elements with similar chemical properties

Key groups:
- **Alkali metals** (Group 1): soft, reactive, one electron to give away (Li, Na, K)
- **Halogens** (Group 17): reactive, one electron short of a full shell (F, Cl, Br)
- **Noble gases** (Group 18): unreactive, full electron shells (He, Ne, Ar)

Mendeleev's genius: he left **gaps** for undiscovered elements and predicted their properties. When gallium (1875), scandium (1879), and germanium (1886) were discovered, their properties matched his predictions almost exactly. That's the power of classification — it lets you predict what you haven't yet seen.`,
      analogy: 'The periodic table is like a seating chart at a wedding. People at the same table (group) share something in common — they\'re all from the groom\'s family, or all college friends. People in the same row (period) arrived in the same generation. The chart lets you predict who will get along (react) and who won\'t.',
      storyConnection: 'The child who named the clouds classified one domain — weather. Linnaeus classified life. Howard classified clouds. Mendeleev classified the very atoms that make up everything. Classification is a universal tool: the same logic works at every scale, from clouds to atoms.',
      checkQuestion: 'Mendeleev predicted an element he called "eka-silicon" would have atomic weight ~72 and density ~5.5 g/cm³. When germanium was discovered in 1886, it had atomic weight 72.6 and density 5.3. How did Mendeleev know?',
      checkAnswer: 'He used the pattern of his classification. Silicon (above) and tin (below) in Group 14 had known properties. Mendeleev averaged their values to predict the missing element between them. Classification reveals patterns, and patterns enable prediction. This is the deepest reason we classify.',
      codeIntro: 'Visualize the periodic table colored by element category.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')

# Simplified periodic table (first 36 elements)
elements = [
    ('H', 1, 1, 'nonmetal'), ('He', 18, 1, 'noble'),
    ('Li', 1, 2, 'alkali'), ('Be', 2, 2, 'alkaline'),
    ('B', 13, 2, 'metalloid'), ('C', 14, 2, 'nonmetal'),
    ('N', 15, 2, 'nonmetal'), ('O', 16, 2, 'nonmetal'),
    ('F', 17, 2, 'halogen'), ('Ne', 18, 2, 'noble'),
    ('Na', 1, 3, 'alkali'), ('Mg', 2, 3, 'alkaline'),
    ('Al', 13, 3, 'metal'), ('Si', 14, 3, 'metalloid'),
    ('P', 15, 3, 'nonmetal'), ('S', 16, 3, 'nonmetal'),
    ('Cl', 17, 3, 'halogen'), ('Ar', 18, 3, 'noble'),
    ('K', 1, 4, 'alkali'), ('Ca', 2, 4, 'alkaline'),
    ('Sc', 3, 4, 'transition'), ('Ti', 4, 4, 'transition'),
    ('V', 5, 4, 'transition'), ('Cr', 6, 4, 'transition'),
    ('Mn', 7, 4, 'transition'), ('Fe', 8, 4, 'transition'),
    ('Co', 9, 4, 'transition'), ('Ni', 10, 4, 'transition'),
    ('Cu', 11, 4, 'transition'), ('Zn', 12, 4, 'transition'),
    ('Ga', 13, 4, 'metal'), ('Ge', 14, 4, 'metalloid'),
    ('As', 15, 4, 'metalloid'), ('Se', 16, 4, 'nonmetal'),
    ('Br', 17, 4, 'halogen'), ('Kr', 18, 4, 'noble'),
]

category_colors = {
    'alkali': '#ef4444', 'alkaline': '#f97316', 'transition': '#f59e0b',
    'metal': '#84cc16', 'metalloid': '#22c55e', 'nonmetal': '#06b6d4',
    'halogen': '#3b82f6', 'noble': '#a855f7',
}

for symbol, col, row, cat in elements:
    color = category_colors[cat]
    rect = plt.Rectangle((col - 0.45, -row - 0.45), 0.9, 0.9,
                          facecolor=color, alpha=0.3, edgecolor=color, linewidth=1)
    ax.add_patch(rect)
    ax.text(col, -row, symbol, ha='center', va='center', color='white',
            fontsize=9, fontweight='bold')

# Legend
for i, (cat, color) in enumerate(category_colors.items()):
    ax.plot([], [], 's', color=color, markersize=10, label=cat.capitalize())
ax.legend(loc='lower left', facecolor='#1f2937', edgecolor='gray',
          labelcolor='white', fontsize=8, ncol=2)

ax.set_xlim(0, 19)
ax.set_ylim(-5, 0)
ax.set_title('Periodic Table — The Greatest Classification in Chemistry', color='white', fontsize=13)
ax.axis('off')

plt.tight_layout()
plt.show()

print("The periodic table classifies elements by:")
print("  Rows (periods): increasing atomic number")
print("  Columns (groups): similar chemical behavior")
print()
print("Mendeleev's prediction power:")
print("  Predicted 'eka-silicon' (1871): weight ~72, density ~5.5")
print("  Discovered germanium (1886):   weight 72.6, density 5.3")
print()
print("Classification doesn't just organize — it PREDICTS.")`,
      challenge: 'Why are noble gases (He, Ne, Ar, Kr) unreactive? Look at their electron configurations. What do they all have in common? How does the periodic table make this obvious?',
      successHint: 'From clouds to kingdoms to species names to identification keys to the periodic table — classification is the master skill of science. Level 2 takes this into the digital world: how do computers classify data?',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Classification & Taxonomy — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for classification simulations. Click to start.</p>
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