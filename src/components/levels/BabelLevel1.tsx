import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BabelForcesDiagram from '../diagrams/BabelForcesDiagram';
import BabelBucklingDiagram from '../diagrams/BabelBucklingDiagram';
import BabelSkyscraperDiagram from '../diagrams/BabelSkyscraperDiagram';
import BabelNLPDiagram from '../diagrams/BabelNLPDiagram';
import WorkForceDiagram from '../diagrams/WorkForceDiagram';
import VariablesDiagram from '../diagrams/VariablesDiagram';

export default function BabelLevel1() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Compression — the force that squeezes',
      concept: `Every building on Earth must handle **compression** — the squeezing force caused by gravity pulling weight downward. When you stack bricks, each brick compresses the one below it. The bottom brick carries the weight of every brick above.

The Tower of Babel was built from sun-dried mud bricks. Mud brick can handle about **2 MPa** of compressive stress (2 million Pascals). Stone handles about 50 MPa. Modern concrete: 30–70 MPa. Steel: 250+ MPa.

In the code below, we calculate the compressive stress at the base of a brick tower. The formula is simple: **stress = force / area = (mass × g) / area**. When stress exceeds the material’s strength, the material crushes.`,
      analogy: 'Stack textbooks on your hand. One book is fine. Five books, you feel pressure. Twenty books and your arm shakes. The books have not changed — but the compressive force on your hand has grown with each one. That is exactly what happens to the bottom of a tower.',
      storyConnection: 'The people of Babel used bricks instead of stone and tar instead of mortar. Mud brick is weaker than cut stone, which limited how high they could build before the base bricks began to crumble under the compressive load.',
      checkQuestion: 'A column has a cross-section of 0.5 m² and supports 100,000 kg. What is the compressive stress?',
      checkAnswer: 'Stress = (100,000 × 9.8) / 0.5 = 1,960,000 Pa = 1.96 MPa. That is within the limit for mud brick (2 MPa) but dangerously close. Add a few more floors and the brick crushes.',
      codeIntro: 'Calculate compressive stress for different building materials.',
      code: `import numpy as np

# Material compressive strengths (MPa = MegaPascals)
materials = {
    "Mud brick":      2.0,
    "Fired brick":    10.0,
    "Limestone":      30.0,
    "Granite":        130.0,
    "Concrete":       40.0,
    "Steel":          250.0,
}

# Tower parameters
height = 100          # metres
base_area = 10 * 10   # 10m x 10m base (m²)
density = 1800        # kg/m³ (mud brick)
g = 9.8               # gravity (m/s²)

# Mass of tower
volume = base_area * height
mass = volume * density

# Compressive stress at base
force = mass * g
stress_pa = force / base_area
stress_mpa = stress_pa / 1e6

print(f"Tower: {height}m tall, {base_area}m² base")
print(f"Volume: {volume:,.0f} m³")
print(f"Mass: {mass:,.0f} kg")
print(f"Base stress: {stress_mpa:.1f} MPa")
print()
print("Can each material support this?")
print("=" * 40)
for name, strength in materials.items():
    safe = "YES" if strength > stress_mpa else "NO — CRUSHED"
    margin = (strength - stress_mpa) / strength * 100
    print(f"  {name:<14s} {strength:>6.1f} MPa  {safe}")`,
      challenge: 'Try increasing the tower height to 200m, 300m, 500m. At what height does even granite fail? What does this tell you about building solid stone towers to "reach the heavens"?',
      successHint: 'Compression is the most basic structural force. Ancient builders understood it intuitively — stack heavy things and eventually the bottom crumbles. The real question is: what is the limit?',
    },
    {
      title: 'Tension and shear — the other two forces',
      concept: `Compression squeezes. But structures also face **tension** (pulling apart) and **shear** (sliding).

Hang a weight from a rope: the rope is in **tension**. The molecules in the rope are being pulled apart. Steel is excellent at resisting tension — that is why we use steel cables in bridges and elevators. Mud brick is terrible at tension; it just cracks and falls apart.

Now imagine pushing the side of a tall tower with wind. The wind does not compress or stretch the tower — it tries to **slide** the top sideways relative to the base. That is **shear**. Diagonal bracing (the X-patterns you see on construction sites) resists shear by converting it into compression and tension in the bracing members.

The code below compares how well different materials handle all three forces.`,
      analogy: 'Pull a piece of string — it resists beautifully (strong in tension). Now try pushing that same string — it buckles instantly (zero compression strength). A brick column is the opposite: strong in compression, weak in tension. The best structures use the right material for the right force.',
      storyConnection: 'The Tower of Babel had no steel, no cables, no diagonal bracing. Mud brick and tar handle compression adequately but are catastrophically weak in tension and shear. The first strong wind or earthquake would have ripped the upper sections apart.',
      checkQuestion: 'Why do suspension bridges use steel cables but not steel columns?',
      checkAnswer: 'The main cables of a suspension bridge are in pure tension — they are being pulled by the hanging roadway. Steel cables are perfect for this because steel has enormous tensile strength and cables are flexible enough to distribute loads evenly. Columns would not work because the forces are horizontal and tensile, not vertical and compressive.',
      codeIntro: 'Compare material strengths in compression, tension, and shear.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material strengths in MPa
materials = ["Mud brick", "Stone", "Wood", "Concrete", "Steel"]
compression = [2, 50, 30, 40, 250]
tension =     [0.2, 3, 50, 3, 400]
shear =       [0.3, 5, 8, 5, 150]

x = np.arange(len(materials))
w = 0.25

fig, ax = plt.subplots(figsize=(10, 5))
ax.bar(x - w, compression, w, label='Compression', color='#ef4444')
ax.bar(x, tension, w, label='Tension', color='#60a5fa')
ax.bar(x + w, shear, w, label='Shear', color='#a78bfa')

ax.set_ylabel('Strength (MPa)', fontsize=12)
ax.set_title('Material Strengths: Compression vs Tension vs Shear', fontsize=13)
ax.set_xticks(x)
ax.set_xticklabels(materials, fontsize=10)
ax.legend(fontsize=10)
ax.set_yscale('log')
ax.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.show()

print("Key insight: Mud brick is 10x weaker in tension than compression.")
print("Stone is 10x weaker in tension too.")
print("Only steel and wood are strong in BOTH compression AND tension.")
print()
print("This is why modern buildings use steel + concrete together:")
print("  Concrete handles compression, steel handles tension.")`,
      challenge: 'Add "Bamboo" to the chart (compression: 60, tension: 160, shear: 12). Where does bamboo fit? Why was bamboo scaffolding used throughout Asia for centuries?',
      successHint: 'Understanding all three forces is what separates ancient builders (compression only) from modern engineers (all three). Reinforced concrete was the breakthrough: steel rebar inside concrete gives you compression AND tension strength in one material.',
    },
    {
      title: 'Why tall towers need wide bases',
      concept: `There is a simple rule in structural engineering: the taller you build, the wider your base must be. This is because of **buckling** — the tendency of a tall, thin column to bow outward and collapse sideways under load.

The mathematician **Leonhard Euler** figured out the formula in 1757: **P = π²EI / L²**. Here P is the maximum load before buckling, E is the material’s stiffness, I is the cross-section’s moment of inertia (how spread out the material is), and L is the height. The crucial insight: P depends on **1/L²** — double the height, and the buckling load drops to **one quarter**.

The Great Pyramid of Giza is 146 m tall with a 230 m base — a height-to-base ratio of 0.63:1. It has stood for 4,500 years. The Tower of Babel, if built as a narrow column 90 m tall, would need an impossibly wide base to avoid buckling.

The code computes the critical buckling load for columns of different heights.`,
      analogy: 'Hold a ruler vertically on a table and press down on the top. A 15 cm ruler stays straight. A 30 cm ruler bows. A full metre ruler buckles and snaps with barely any force. The ruler material has not changed — only its height. Taller = weaker. That is Euler buckling.',
      storyConnection: 'The Babel builders wanted to reach heaven — effectively infinite height. But the taller their tower grew, the more unstable it became. Without understanding buckling, they could not have known why the tower swayed and cracked. God scattering their language is the story’s explanation, but the physics would have stopped them regardless.',
      checkQuestion: 'If you double both the height AND the base width of a column, is it more or less stable?',
      checkAnswer: 'More stable. Doubling height divides buckling load by 4 (P ∝ 1/L²). But doubling the width increases the moment of inertia I by a factor of 16 (I ∝ d⁴ for a circular cross-section). So the net effect: 16/4 = 4× stronger. This is why pyramids and wide-base structures last millennia.',
      codeIntro: 'Plot buckling load versus column height to see why height is the enemy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Euler buckling: P_critical = pi^2 * E * I / L^2

# Column properties
E = 2e9          # Young's modulus for mud brick (Pa)
diameter = 2.0   # metres
I = np.pi * (diameter/2)**4 / 4  # moment of inertia (m^4)

# Heights from 10m to 200m
heights = np.linspace(10, 200, 100)

# Critical buckling load (Newtons -> tonnes)
P_critical = (np.pi**2 * E * I) / heights**2
P_tonnes = P_critical / (9.8 * 1000)

plt.figure(figsize=(10, 5))
plt.plot(heights, P_tonnes, linewidth=2.5, color='#ef4444')
plt.fill_between(heights, P_tonnes, alpha=0.1, color='#ef4444')

# Mark danger zone
tower_weight = 1800 * np.pi * (diameter/2)**2 * heights / 1000  # tonnes
plt.plot(heights, tower_weight, linewidth=2, color='#60a5fa',
         linestyle='--', label='Tower self-weight')

plt.xlabel('Column Height (m)', fontsize=12)
plt.ylabel('Load (tonnes)', fontsize=12)
plt.title('Euler Buckling: Taller = Weaker', fontsize=14)
plt.legend(['Buckling limit', 'Tower self-weight'], fontsize=10)
plt.grid(alpha=0.3)
plt.show()

# Find intersection
for i in range(len(heights)-1):
    if tower_weight[i+1] > P_tonnes[i+1]:
        print(f"Column buckles under its own weight at ~{heights[i]:.0f} m!")
        break
print()
print("This is why you cannot build a narrow mud-brick tower to heaven.")
print("The column buckles before it reaches meaningful height.")`,
      challenge: 'Try changing the diameter to 5m, then 10m. How much taller can you build? What diameter would you need for a 500m tower? This is the fundamental trade-off: height demands width.',
      successHint: 'Euler’s buckling formula is one of the most important equations in engineering. It explains why skyscrapers are not just tall columns — they need wide bases, diagonal bracing, and careful cross-section design.',
    },
    {
      title: 'The skyscraper — Babel achieved',
      concept: `The Burj Khalifa is 828 m tall — far higher than any Tower of Babel could have been. How did modern engineers solve the problems that defeated the Babel builders?

Three key innovations:
1. **Steel frame**: handles both compression AND tension, with a central core that acts as the spine
2. **Deep foundations**: piles driven 50 m into bedrock transfer the entire building’s weight into solid rock
3. **Wind engineering**: the building’s shape is designed to break up vortices that would cause swaying

The Burj Khalifa uses a **buttressed core** design — a central Y-shaped concrete core with three wings. Each wing supports the others, creating stability without needing a massive base.

The code compares famous tall structures across history.`,
      analogy: 'Think of the difference between stacking blocks (ancient construction) and building with an Erector set (modern steel-frame construction). Blocks can only push down — compression. An Erector set has bolted connections that handle pushing, pulling, and twisting. The connectors are the key innovation.',
      storyConnection: 'The Babel story says God scattered the builders because they aimed too high. In reality, the engineering would have stopped them first. But modern engineering has effectively solved every problem Babel faced — we can build 800+ metres. The only limit now is cost and wind, not physics.',
      checkQuestion: 'Why is the Burj Khalifa Y-shaped instead of a simple rectangle?',
      checkAnswer: 'A Y-shape breaks up wind vortices that form when wind flows around a symmetrical shape. A rectangular building creates rhythmic vortex shedding that causes dangerous swaying (resonance). The Y-shape disrupts this pattern because the wind encounters a different cross-section from every direction. The three wings also structurally buttress each other, resisting overturning moments.',
      codeIntro: 'Compare the great towers of history — from Babel to Burj Khalifa.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Famous structures
structures = [
    ("Great Pyramid\\n(2560 BCE)", 146, 230, "Stone"),
    ("Babel (est.)\\n(~600 BCE)", 91, 91, "Mud brick"),
    ("Eiffel Tower\\n(1889)", 330, 125, "Iron"),
    ("Empire State\\n(1931)", 443, 129, "Steel"),
    ("Burj Khalifa\\n(2010)", 828, 73, "Steel+Conc"),
    ("Jeddah Tower\\n(planned)", 1000, 80, "Steel+Conc"),
]

names = [s[0] for s in structures]
heights = [s[1] for s in structures]
bases = [s[2] for s in structures]
ratios = [h/b for h, b in zip(heights, bases)]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Height comparison
colors = ['#f59e0b', '#ef4444', '#94a3b8', '#60a5fa', '#22c55e', '#a78bfa']
ax1.barh(names, heights, color=colors)
ax1.set_xlabel('Height (m)', fontsize=11)
ax1.set_title('Tower Heights Through History', fontsize=13)
for i, h in enumerate(heights):
    ax1.text(h + 10, i, f'{h}m', va='center', fontsize=9, color='white')

# Height-to-base ratio
ax2.barh(names, ratios, color=colors)
ax2.set_xlabel('Height / Base Width Ratio', fontsize=11)
ax2.set_title('Slenderness Ratio', fontsize=13)
for i, r in enumerate(ratios):
    ax2.text(r + 0.1, i, f'{r:.1f}', va='center', fontsize=9, color='white')

plt.tight_layout()
plt.show()

print("Key insight: the Pyramid has ratio 0.6 (very wide, very stable).")
print("Modern skyscrapers reach ratio 11+ (incredibly slender).")
print("The difference? Steel, concrete, and engineering knowledge.")`,
      challenge: 'Calculate the total weight of the Burj Khalifa (500,000 tonnes) spread over its foundation area (~8,000 m²). What is the ground pressure? Compare to the Pyramid of Giza (6,000,000 tonnes on 53,000 m²). Which exerts more pressure on the ground?',
      successHint: 'The history of tall buildings is the history of material science. Mud brick → stone → iron → steel → reinforced concrete. Each material unlocked new height possibilities by being stronger in more types of force.',
    },
    {
      title: 'The confusion of tongues — how languages diverge',
      concept: `The Babel story explains language diversity as divine punishment. Linguistics offers a different explanation: all languages share common ancestors and **diverged over time** through isolation, migration, and cultural change.

The world’s ~7,000 languages belong to a few hundred **language families**. The largest is Indo-European, which includes English, Hindi, Russian, and Farsi — all descended from a single language spoken ~5,000 years ago.

How do linguists prove this? By finding **cognates** — words that share a common ancestor. "Mother" in English, "mater" in Latin, "mātā" in Hindi, "mādar" in Persian. These are not coincidences — they trace back to a Proto-Indo-European root *mēh₂tēr.

The code below compares word similarities across languages to detect families.`,
      analogy: 'Languages are like tree branches. Two twigs on the same branch (English and German) share recent ancestry. Two twigs on different branches (English and Chinese) diverged long ago. Linguists reconstruct the trunk by comparing the twigs — just as biologists reconstruct evolution by comparing species.',
      storyConnection: 'At Babel, God is said to have confused the languages overnight. In reality, language change is gradual — Old English is unintelligible to modern English speakers, and they are only 1,000 years apart. The Babel story compresses thousands of years of linguistic divergence into one dramatic moment.',
      checkQuestion: 'English borrowed "jungle" from Hindi, "coffee" from Arabic, and "ketchup" from Malay. What does this tell you about language change?',
      checkAnswer: 'Languages are not isolated systems — they borrow words constantly through trade, conquest, and cultural contact. English has absorbed words from over 350 languages. Borrowing is one of the main ways languages change over time, alongside sound shifts, grammatical simplification, and geographic isolation.',
      codeIntro: 'Detect language families by comparing cognate words.',
      code: `# Comparing words across languages to find families
# Cognates: words with shared ancestry

languages = {
    "English":    {"mother": "mother",  "water": "water",  "night": "night",  "new": "new"},
    "German":     {"mother": "mutter",  "water": "wasser", "night": "nacht",  "new": "neu"},
    "Dutch":      {"mother": "moeder",  "water": "water",  "night": "nacht",  "new": "nieuw"},
    "French":     {"mother": "mere",    "water": "eau",    "night": "nuit",   "new": "nouveau"},
    "Spanish":    {"mother": "madre",   "water": "agua",   "night": "noche",  "new": "nuevo"},
    "Italian":    {"mother": "madre",   "water": "acqua",  "night": "notte",  "new": "nuovo"},
    "Hindi":      {"mother": "mata",    "water": "jal",    "night": "raat",   "new": "naya"},
    "Mandarin":   {"mother": "muqin",   "water": "shui",   "night": "ye",     "new": "xin"},
}

# Simple similarity: count shared first 2 characters
def similarity(w1, w2):
    w1, w2 = w1.lower(), w2.lower()
    score = 0
    if w1[0] == w2[0]: score += 1
    if len(w1) > 1 and len(w2) > 1 and w1[:2] == w2[:2]: score += 1
    return score

print("Language Similarity Matrix (based on cognate comparison)")
print("=" * 60)
langs = list(languages.keys())
for i, l1 in enumerate(langs):
    scores = []
    for l2 in langs:
        total = 0
        for word in languages[l1]:
            total += similarity(languages[l1][word], languages[l2][word])
        scores.append(total)
    print(f"{l1:>10s}: {scores}")

print()
print("Higher scores = more closely related.")
print("English-German-Dutch cluster (Germanic family)")
print("French-Spanish-Italian cluster (Romance family)")
print("Hindi shares some roots (Indo-European)")
print("Mandarin is unrelated (Sino-Tibetan family)")`,
      challenge: 'Add Japanese (mother: "haha", water: "mizu", night: "yoru", new: "atarashii") and Arabic (mother: "umm", water: "maa", night: "layl", new: "jadid"). Do they cluster with any existing group?',
      successHint: 'Language families are real, measurable, and scientifically traceable. The tools of computational linguistics can now process thousands of languages and reconstruct ancestral words that were spoken 10,000 years ago.',
    },
    {
      title: 'NLP — machines that reverse Babel',
      concept: `If the Tower of Babel scattered human language into 7,000 pieces, **Natural Language Processing (NLP)** is putting it back together. Google Translate processes 100 billion words per day across 133 languages.

The breakthrough came with **transformer models** (2017). Instead of translating word-by-word, transformers use **attention** — the model learns which words in the input sentence are most relevant to each word in the output. "The cat sat on the mat" → in French, "cat" maps to "chat", but the word order changes. Attention handles this.

Modern systems like GPT and BERT are trained on billions of sentences in hundreds of languages. They develop **internal representations** where similar meanings cluster together, regardless of language. The word "dog" in English and "chien" in French end up near each other in the model’s number space.

The code builds a simple word embedding and translation system.`,
      analogy: 'Imagine an interpreter at the United Nations. She does not translate word-by-word. She listens to the whole sentence, understands the MEANING, then expresses that meaning in the target language. Transformer models do the same thing — they encode meaning as numbers, then decode those numbers into any language.',
      storyConnection: 'Babel is the story of lost communication. NLP is the engineering of restored communication. Every time Google Translate converts a sentence, every time a chatbot understands your question in any language, the "curse of Babel" is being reversed by mathematics and computation.',
      checkQuestion: 'Why is translating idioms ("it’s raining cats and dogs") harder than translating literal sentences?',
      checkAnswer: 'Idioms are non-compositional — the meaning of the whole phrase is different from the meanings of the individual words. A word-by-word translator would produce nonsense. Transformer models handle this because attention looks at the entire phrase and learns that this specific combination of words means "heavy rain" — essentially memorising the idiom as a unit.',
      codeIntro: 'Build a simple word embedding space to see how NLP represents meaning.',
      code: `import numpy as np

# Simple word vectors (in real NLP, these have 768+ dimensions)
# Each number represents a semantic feature
# [animate, size, domestic, human, liquid]
word_vectors = {
    "cat":    np.array([1.0, 0.3, 0.9, 0.0, 0.0]),
    "dog":    np.array([1.0, 0.5, 0.9, 0.0, 0.0]),
    "lion":   np.array([1.0, 0.8, 0.1, 0.0, 0.0]),
    "human":  np.array([1.0, 0.7, 0.0, 1.0, 0.0]),
    "water":  np.array([0.0, 0.0, 0.0, 0.0, 1.0]),
    "river":  np.array([0.0, 0.5, 0.0, 0.0, 0.9]),
    "chair":  np.array([0.0, 0.4, 0.8, 0.0, 0.0]),
}

# Cosine similarity: how similar are two vectors?
def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Compare all pairs
words = list(word_vectors.keys())
print("Word Similarity (cosine distance)")
print("=" * 50)
for i in range(len(words)):
    for j in range(i+1, len(words)):
        sim = cosine_sim(word_vectors[words[i]], word_vectors[words[j]])
        bar = "#" * int(sim * 20)
        print(f"  {words[i]:>8s} <-> {words[j]:<8s}: {sim:.2f}  {bar}")

print()
print("cat-dog similarity is HIGH (both domestic animals)")
print("cat-water similarity is LOW (unrelated concepts)")
print()
print("In real NLP, these vectors have 768 dimensions")
print("and are learned from billions of sentences.")
print("Similar meanings cluster together — in ANY language.")`,
      challenge: 'Add French words: "chat" (same vector as cat), "chien" (same as dog), "eau" (same as water). Compute similarity between "cat" and "chat". What do you notice? This is how multilingual models work — different words, same meaning, same vector.',
      successHint: 'Word embeddings are the foundation of modern NLP. By representing meaning as numbers, machines can compare, translate, and reason about language. The Tower of Babel scattered language; vectors reunite it.',
    },
  ];

  return (
    <div className="space-y-8">
      {loading && (
        <div className="flex items-center gap-3 bg-amber-500/10 text-amber-300 px-4 py-3 rounded-lg text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadProgress}
        </div>
      )}
      {miniLessons.map((lesson, i) => (
        <MiniLesson
          key={i}
          id={`babel-l1-${i + 1}`}
          number={i + 1}
          title={lesson.title}
          concept={lesson.concept}
          analogy={lesson.analogy}
          storyConnection={lesson.storyConnection}
          checkQuestion={lesson.checkQuestion}
          checkAnswer={lesson.checkAnswer}
          diagram={i === 0 ? createElement(BabelForcesDiagram) : i === 2 ? createElement(BabelBucklingDiagram) : i === 3 ? createElement(BabelSkyscraperDiagram) : i === 5 ? createElement(BabelNLPDiagram) : undefined}
          code={lesson.code}
          codeIntro={lesson.codeIntro}
          challenge={lesson.challenge}
          successHint={lesson.successHint}
          pyodideRef={pyodideRef}
          onLoadPyodide={loadPyodide}
          pyReady={pyReady}
        />
      ))}
    </div>
  );
}
