import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TalkingParrotLevel2() {
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
      title: 'Markov chains — predicting the next word',
      concept: `A **Markov chain** predicts what comes next based only on the current state, ignoring everything before it. In language: given the current word, what is the most likely next word?

If we analyze enough text, we can build a transition matrix: "the" is followed by "parrot" 15% of the time, "road" 8%, "old" 12%, etc. This is a first-order Markov model.

Higher-order Markov chains use more context:
- Order 1: P(next | current word)
- Order 2: P(next | previous 2 words)
- Order 3: P(next | previous 3 words)

Markov chains were used for text generation before neural networks. They produce locally coherent text but lack long-range structure — a sentence might start about parrots and end about cooking, because the model has no memory beyond its window.

Modern language models (GPT, Claude) are essentially very high-order Markov chains with enormous context windows and billions of learned parameters.`,
      analogy: 'A Markov chain is like autocomplete on your phone. It looks at the last few words you typed and predicts the next one. It works well for short phrases but loses the plot over longer passages — just like your phone sometimes suggests bizarre completions for long sentences.',
      storyConnection: 'The parrot of Hajo could produce convincing phrases because it had internalized the Markov structure of human speech — common word pairs and triplets. "Good morning" always followed the same pattern. But ask the parrot a novel question, and it would fail — no long-range understanding, just local pattern matching.',
      checkQuestion: 'Why does a Markov text generator produce grammatically correct short phrases but nonsensical long paragraphs?',
      checkAnswer: 'Short phrases work because local word transitions (bigrams, trigrams) are well-captured by the model. But coherent paragraphs require understanding topic, argument structure, and reference — these span dozens or hundreds of words, far beyond the Markov window. It is like navigating with a flashlight that only illuminates 3 feet ahead: you can avoid the next obstacle but cannot plan a route.',
      codeIntro: 'Build a simple Markov chain text generator from a training corpus.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Training corpus
corpus = """the parrot sat on the branch and spoke to the travelers
the parrot knew the names of all the people in the village
the old priest said the parrot was blessed by the goddess
the travelers stopped and listened to the parrot speak
the parrot spoke in many tongues to many people
the bird sat on the branch and sang a song
the priest prayed at the temple every morning
the village people came to hear the parrot every day"""

# Build bigram model
words = corpus.lower().split()
bigrams = {}
for i in range(len(words)-1):
    w1, w2 = words[i], words[i+1]
    if w1 not in bigrams:
        bigrams[w1] = {}
    bigrams[w1][w2] = bigrams[w1].get(w2, 0) + 1

# Convert to probabilities
for w1 in bigrams:
    total = sum(bigrams[w1].values())
    for w2 in bigrams[w1]:
        bigrams[w1][w2] /= total

# Generate text
def generate(start_word, length=15):
    result = [start_word]
    current = start_word
    for _ in range(length):
        if current not in bigrams:
            break
        next_words = list(bigrams[current].keys())
        probs = list(bigrams[current].values())
        current = np.random.choice(next_words, p=probs)
        result.append(current)
    return ' '.join(result)

# Generate 5 sentences
print("Generated sentences:")
for i in range(5):
    print(f"  {i+1}. {generate('the', 12)}")
print()

# Visualize transition probabilities for "the"
fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

if 'the' in bigrams:
    next_w = list(bigrams['the'].keys())
    probs = list(bigrams['the'].values())
    sorted_pairs = sorted(zip(next_w, probs), key=lambda x: -x[1])
    words_sorted = [p[0] for p in sorted_pairs]
    probs_sorted = [p[1] for p in sorted_pairs]

    bars = ax.barh(range(len(words_sorted)), probs_sorted, color='#22c55e', alpha=0.8)
    ax.set_yticks(range(len(words_sorted)))
    ax.set_yticklabels(words_sorted, color='white', fontsize=10)
    ax.set_xlabel('Probability', color='white')
    ax.set_title('What word follows "the"? (Bigram probabilities)', color='white', fontsize=12)
    ax.tick_params(colors='gray')
    for bar, prob in zip(bars, probs_sorted):
        ax.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height()/2,
                f'{prob:.2f}', va='center', color='#f59e0b', fontsize=9)

plt.tight_layout()
plt.show()`,
      challenge: 'Extend this to a trigram model (predict next word from the previous TWO words). Does the generated text improve? How much more training data would you need?',
      successHint: 'Markov chains are the ancestor of all modern language models. Understanding them helps you understand what GPT and Claude are doing — just at a much larger scale with much more context.',
    },
    {
      title: 'Chomsky hierarchy — the layers of language complexity',
      concept: `Noam Chomsky classified languages into four levels of complexity, from simplest to most powerful:

- **Type 3 — Regular languages**: patterns like "ab", "aabb", "aaabbb". Can be recognized by simple state machines. Bird calls are roughly at this level.
- **Type 2 — Context-free languages**: nested structures like matching parentheses ((())). Most programming languages are here. Allows recursion.
- **Type 1 — Context-sensitive languages**: rules that depend on surrounding context. Natural languages have many context-sensitive features.
- **Type 0 — Recursively enumerable**: anything a computer can process. No restrictions.

Human language sits somewhere between Type 2 and Type 1. The key feature that separates human language from animal communication is **recursion** — the ability to embed structures inside structures:

"The parrot [that the boy [who lived in Hajo] trained] spoke."

Each bracket is a sentence within a sentence. No known animal communication system has true recursion.`,
      analogy: 'The Chomsky hierarchy is like levels of building complexity. Type 3 is a straight wall (simple repetition). Type 2 is an arch (matched, nested structure). Type 1 is a load-bearing wall (depends on surrounding structures). Type 0 is an entire city (anything goes, but it can be built).',
      storyConnection: 'The parrot of Hajo could produce Type 3 patterns — repeated phrases, simple sequences. But it could not produce truly recursive sentences. The jump from parrot mimicry to human language is not just more vocabulary — it is a jump up the Chomsky hierarchy from regular to context-free (or beyond).',
      checkQuestion: 'Programming languages are mostly context-free (Type 2). Why are natural languages harder for computers to parse than programming languages?',
      checkAnswer: 'Programming languages are designed to be unambiguous — every statement has exactly one parse. Natural languages are full of ambiguity: "I saw the man with the telescope" has two parses (I used a telescope, or the man had a telescope). Natural language also uses context-sensitivity, pragmatics, and world knowledge that go beyond grammar rules.',
      codeIntro: 'Demonstrate the Chomsky hierarchy with pattern matching at each level.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Type 3: Regular language - can be matched by finite automaton
def is_regular(s):
    """Matches pattern: a*b* (any number of a's followed by any number of b's)"""
    state = 'a_phase'
    for c in s:
        if state == 'a_phase':
            if c == 'a': continue
            elif c == 'b': state = 'b_phase'
            else: return False
        elif state == 'b_phase':
            if c == 'b': continue
            else: return False
    return True

# Type 2: Context-free language - matched parentheses
def is_context_free(s):
    """Matches balanced parentheses: (), (()), ((())), etc."""
    depth = 0
    for c in s:
        if c == '(': depth += 1
        elif c == ')': depth -= 1
        if depth < 0: return False
    return depth == 0

# Test strings
regular_tests = ['aabb', 'aaabbb', 'abab', 'aab', 'ba', 'aaabb']
cf_tests = ['()', '(())', '((()))', '()()', '(()', ')(', '(()())']

print("Type 3 (Regular): a*b* pattern")
for s in regular_tests:
    print(f"  '{s}' -> {'ACCEPT' if is_regular(s) else 'REJECT'}")

print()
print("Type 2 (Context-Free): balanced parentheses")
for s in cf_tests:
    print(f"  '{s}' -> {'ACCEPT' if is_context_free(s) else 'REJECT'}")

# Visualize the hierarchy
fig, ax = plt.subplots(figsize=(8, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')

# Concentric circles
circles = [
    (0.9, '#ef4444', 'Type 0: Recursively Enumerable\\n(Turing machines)'),
    (0.7, '#f59e0b', 'Type 1: Context-Sensitive\\n(Human language features)'),
    (0.5, '#3b82f6', 'Type 2: Context-Free\\n(Programming languages)'),
    (0.3, '#22c55e', 'Type 3: Regular\\n(Bird calls, simple patterns)'),
]

for radius, color, label in circles:
    circle = plt.Circle((0.5, 0.5), radius, fill=True, facecolor=color, alpha=0.2, edgecolor=color, linewidth=2)
    ax.add_patch(circle)
    y_offset = 0.5 + radius - 0.08
    ax.text(0.5, y_offset, label, ha='center', va='center', color='white', fontsize=9, fontweight='bold')

ax.set_xlim(-0.5, 1.5)
ax.set_ylim(-0.5, 1.5)
ax.set_aspect('equal')
ax.set_title('Chomsky Hierarchy of Formal Languages', color='white', fontsize=13, pad=15)
ax.axis('off')

plt.tight_layout()
plt.show()

print()
print("Each level is strictly more powerful than the one below it.")
print("A machine that can handle Type 2 can also handle Type 3,")
print("but NOT necessarily Type 1.")`,
      challenge: 'Write a function that checks for Type 1 context-sensitive patterns: a^n b^n c^n (equal numbers of a, b, c in order). This CANNOT be done with a context-free grammar. Why not?',
      successHint: 'The Chomsky hierarchy is the theoretical backbone of computer science. Every compiler, parser, and language model operates within this framework — even if the engineers building them do not always think about it explicitly.',
    },
    {
      title: 'Word embeddings — mapping words to numbers',
      concept: `How do you teach a computer what a word means? You cannot just look it up in a dictionary — dictionaries define words using other words (circular). The breakthrough idea: represent words as **vectors** (lists of numbers) in a high-dimensional space.

**Word2Vec** (2013) showed that if you train a neural network to predict a word from its neighbors (or vice versa), the resulting vectors capture meaning:
- Similar words are close together: "parrot" is near "bird", "macaw", "cockatoo"
- Relationships are encoded as directions: king - man + woman ≈ queen
- Analogies emerge naturally: Paris:France :: Tokyo:Japan

Each word becomes a point in 100-300 dimensional space. Distance between points = semantic similarity.

This is how search engines find relevant results even when you do not use the exact words in the document. It is how translation works across languages. And it is the foundation of modern AI language models.`,
      analogy: 'Word embeddings are like GPS coordinates for meaning. "Parrot" and "bird" are nearby locations. "Parrot" and "algebra" are far apart. "King" and "queen" are the same distance apart as "man" and "woman" — the direction encodes the gender relationship.',
      storyConnection: 'If we embedded the parrot of Hajo\'s vocabulary into vector space, we would find clusters: greetings near greetings, names near names, religious words near religious words. The parrot did not understand meaning, but the statistical patterns in its speech would reveal the meaning structure of the language it mimicked.',
      checkQuestion: 'If "king - man + woman = queen" works in word embeddings, what would "Guwahati - Assam + Maharashtra" approximate?',
      checkAnswer: 'Mumbai (the capital/major city of Maharashtra). The vector operation captures the "major-city-of" relationship. Guwahati is to Assam as Mumbai is to Maharashtra. These analogies work because word embeddings learn relational structure from patterns in text, not from explicit geographic knowledge.',
      codeIntro: 'Create a simple 2D word embedding and visualize semantic relationships.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated word embeddings (2D for visualization)
# In reality, embeddings are 100-300 dimensions
words = {
    # Birds
    'parrot': [2.1, 3.5], 'bird': [2.5, 3.8], 'eagle': [3.0, 4.2],
    'crow': [2.3, 3.2], 'sparrow': [2.0, 3.0],
    # Animals
    'tiger': [5.0, 3.0], 'elephant': [5.5, 2.5], 'deer': [4.5, 3.5],
    # Places
    'hajo': [1.0, 7.0], 'guwahati': [1.5, 7.5], 'temple': [1.8, 6.5],
    # Actions
    'speak': [3.5, 5.5], 'sing': [3.0, 5.8], 'fly': [3.8, 5.0],
    # People
    'priest': [6.0, 6.5], 'traveler': [6.5, 6.0], 'merchant': [7.0, 5.5],
}

fig, ax = plt.subplots(figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Color by category
categories = {
    'Birds': (['parrot', 'bird', 'eagle', 'crow', 'sparrow'], '#22c55e'),
    'Animals': (['tiger', 'elephant', 'deer'], '#ef4444'),
    'Places': (['hajo', 'guwahati', 'temple'], '#3b82f6'),
    'Actions': (['speak', 'sing', 'fly'], '#f59e0b'),
    'People': (['priest', 'traveler', 'merchant'], '#a855f7'),
}

for cat, (word_list, color) in categories.items():
    xs = [words[w][0] for w in word_list]
    ys = [words[w][1] for w in word_list]
    ax.scatter(xs, ys, c=color, s=100, label=cat, zorder=5)
    for w in word_list:
        ax.annotate(w, xy=(words[w][0], words[w][1]),
                   xytext=(5, 5), textcoords='offset points',
                   color='white', fontsize=9)

# Draw similarity lines for nearest neighbors
def dist(w1, w2):
    return np.sqrt(sum((a-b)**2 for a,b in zip(words[w1], words[w2])))

pairs = [('parrot', 'bird'), ('parrot', 'crow'), ('speak', 'sing'),
         ('hajo', 'guwahati'), ('priest', 'traveler')]
for w1, w2 in pairs:
    ax.plot([words[w1][0], words[w2][0]], [words[w1][1], words[w2][1]],
            '--', color='gray', alpha=0.3, linewidth=1)

ax.set_title('Word Embeddings: Words as Points in Space', color='white', fontsize=13)
ax.set_xlabel('Dimension 1', color='white')
ax.set_ylabel('Dimension 2', color='white')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Distances between words:")
test_pairs = [('parrot','bird'), ('parrot','tiger'), ('parrot','temple'),
              ('speak','sing'), ('speak','elephant')]
for w1, w2 in test_pairs:
    d = dist(w1, w2)
    print(f"  {w1} <-> {w2}: {d:.2f}")`,
      challenge: 'Add 5 more words to the embedding (choose any category). Place them so that semantically similar words are close together. Can you create an analogy that works like king-man+woman=queen?',
      successHint: 'Word embeddings revolutionized NLP in 2013. Every modern AI system — from search engines to chatbots to translation — uses some form of embedding to convert human language into numbers that machines can process.',
    },
    {
      title: 'Syntax trees — the hidden structure of sentences',
      concept: `Every sentence has a hidden tree structure. The sentence "The parrot of Hajo spoke wisely" parses as:

\`\`\`
       S (sentence)
      / \\
    NP    VP
   / \\   / \\
  D   N  V  Adv
  |  / \\  |   |
 The N  PP spoke wisely
     |  / \\
  parrot P  NP
         |   |
        of  Hajo
\`\`\`

**Constituents** are groups of words that function as a unit:
- NP (noun phrase): "The parrot of Hajo"
- VP (verb phrase): "spoke wisely"
- PP (prepositional phrase): "of Hajo"

This tree structure explains:
- Why "The parrot of Hajo spoke wisely" is grammatical
- Why "Parrot the of wisely spoke Hajo" is not
- Why "The parrot spoke wisely of Hajo" means something different (the PP attaches to VP, not NP)

Parsing — figuring out the tree structure — is what your brain does automatically in milliseconds and what NLP systems must learn to do computationally.`,
      analogy: 'A syntax tree is like an organizational chart. The CEO (sentence) has two direct reports: the subject department (NP) and the action department (VP). Each department has sub-departments. The chart tells you who reports to whom — the tree tells you which words modify which.',
      storyConnection: 'When the parrot of Hajo repeated a phrase, it reproduced the words in order but not the tree. A child learning language acquires both. The parrot could say "The priest said the parrot was blessed" but could not distinguish whether "the priest" or "the parrot" was blessed — because it had no parse tree.',
      checkQuestion: '"I saw the man with the telescope" is ambiguous. Draw (or describe) the two possible parse trees.',
      checkAnswer: 'Tree 1: "with the telescope" attaches to "saw" (I used a telescope to see the man). Tree 2: "with the telescope" attaches to "the man" (the man had a telescope). The ambiguity arises because the PP can attach to either the VP or the NP. Context usually resolves it, but the grammar alone cannot.',
      codeIntro: 'Implement a simple recursive descent parser for a tiny grammar.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# A tiny grammar for parrot sentences
# S -> NP VP
# NP -> Det N | Det N PP
# VP -> V | V Adv | V NP
# PP -> P NP
# Det -> the | a
# N -> parrot | priest | branch | hajo | temple
# V -> spoke | sat | flew | sang
# Adv -> wisely | loudly | softly
# P -> on | of | in | to

def parse_tree_to_coords(tree, x=0, y=0, dx=2.0, level_dy=1.5):
    """Convert parse tree to coordinates for plotting."""
    nodes = []
    edges = []

    def traverse(node, x, y, spread):
        label = node[0]
        nodes.append((x, y, label))

        if len(node) == 2 and isinstance(node[1], str):
            # Terminal node
            child_y = y - level_dy
            nodes.append((x, child_y, node[1]))
            edges.append((x, y, x, child_y))
        else:
            children = node[1:]
            n_children = len(children)
            start_x = x - spread * (n_children - 1) / 2
            for i, child in enumerate(children):
                child_x = start_x + i * spread
                child_y = y - level_dy
                edges.append((x, y, child_x, child_y))
                traverse(child, child_x, child_y, spread * 0.5)

    traverse(tree, x, y, dx)
    return nodes, edges

# Parse tree for "The parrot of Hajo spoke wisely"
tree = ('S',
    ('NP',
        ('Det', 'the'),
        ('N', 'parrot'),
        ('PP', ('P', 'of'), ('NP', ('N', 'Hajo')))
    ),
    ('VP',
        ('V', 'spoke'),
        ('Adv', 'wisely')
    )
)

nodes, edges = parse_tree_to_coords(tree, x=0, y=0, dx=3.0)

fig, ax = plt.subplots(figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Draw edges
for x1, y1, x2, y2 in edges:
    ax.plot([x1, x2], [y1, y2], '-', color='gray', linewidth=1, alpha=0.5)

# Draw nodes
for x, y, label in nodes:
    is_terminal = label[0].islower() or label == 'Hajo'
    color = '#22c55e' if is_terminal else '#3b82f6'
    fontsize = 11 if is_terminal else 10
    fontstyle = 'italic' if is_terminal else 'normal'
    ax.annotate(label, xy=(x, y), ha='center', va='center',
               fontsize=fontsize, color=color, fontstyle=fontstyle,
               bbox=dict(boxstyle='round,pad=0.3', facecolor='#1f2937', edgecolor=color, alpha=0.8))

ax.set_title('"The parrot of Hajo spoke wisely" — Parse Tree', color='white', fontsize=13)
ax.set_xlim(-6, 6)
ax.set_ylim(-8, 1.5)
ax.axis('off')

plt.tight_layout()
plt.show()

print("Grammar rules used:")
print("  S  -> NP VP")
print("  NP -> Det N PP")
print("  VP -> V Adv")
print("  PP -> P NP")
print()
print("Constituency tests:")
print("  'the parrot of Hajo' is a NP (can be replaced by 'he')")
print("  'spoke wisely' is a VP (answers 'what did it do?')")
print("  'of Hajo' is a PP (can be moved: 'of Hajo, the parrot spoke')")`,
      challenge: 'Draw the parse tree for "The priest said the parrot spoke." Notice the embedded sentence (a sentence inside a sentence). This is recursion — S contains another S.',
      successHint: 'Syntax trees are what compilers use to understand programming languages too. Every line of Python, JavaScript, or C is parsed into a tree before the computer can execute it.',
    },
    {
      title: 'Language evolution — how new languages are born',
      concept: `Languages change over time, split into dialects, and eventually become separate languages. This process follows patterns remarkably similar to biological evolution:

- **Mutation**: pronunciation shifts, new slang, borrowed words
- **Selection**: useful innovations spread; confusing ones die out
- **Drift**: small populations develop unique features by chance
- **Isolation**: geographic separation allows independent changes

The **comparative method** traces language families by finding cognates — words that share a common ancestor:
- English "mother", German "Mutter", Sanskrit "matar", Assamese "maa" → all from Proto-Indo-European *méh₂tēr

**Glottochronology** estimates when languages diverged by measuring the percentage of shared core vocabulary. Languages lose core words at a roughly constant rate (~14% per millennium).

Assamese evolved from Magadhi Prakrit through Kamarupi Prakrit over ~1500 years. It shares cognates with Bengali, Odia, and Maithili — all siblings from the same parent language.`,
      analogy: 'Language evolution is like a river delta. A single river (proto-language) splits into branches (language families), which split into smaller streams (dialects), which eventually become separate rivers (distinct languages). Sometimes streams merge (language contact). The delta grows more complex over time.',
      storyConnection: 'The parrot of Hajo spoke "many tongues" — multiple languages. Each of those tongues has a family tree. If the parrot spoke Assamese, Bengali, and Hindi, it was speaking three branches of the same Indo-Aryan family. The family resemblances are not coincidence — they are inheritance.',
      checkQuestion: 'Why do isolated island languages change faster than languages spoken on large continents?',
      checkAnswer: 'Small, isolated populations experience more linguistic drift (random changes stick because there are fewer speakers to resist them) and less contact with other languages (no borrowing that might standardize). Islands like Papua New Guinea have extraordinary linguistic diversity — over 800 languages — partly because of geographic isolation between valleys.',
      codeIntro: 'Simulate language divergence using a simple mutation model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate language divergence
# Start with a "proto-language" of 100 core words
# Each word is represented by a random number (its "form")
n_words = 100
proto_language = np.arange(n_words)

def evolve(language, generations, mutation_rate=0.14):
    """Simulate language change over time."""
    history = [language.copy()]
    current = language.copy()
    for _ in range(generations):
        # Each word has a chance of changing
        mutations = np.random.random(n_words) < mutation_rate
        current[mutations] = np.random.randint(1000, 9999, size=np.sum(mutations))
        history.append(current.copy())
    return history

# Two languages diverge from the same proto-language
n_gen = 10  # 10 generations (roughly 1000 years each)
lang_a = evolve(proto_language.copy(), n_gen)
lang_b = evolve(proto_language.copy(), n_gen)

# Calculate shared vocabulary percentage over time
shared_pct = []
for gen in range(n_gen + 1):
    shared = np.sum(lang_a[gen] == lang_b[gen]) / n_words * 100
    shared_pct.append(shared)

# Theoretical Swadesh decay: S(t) = S(0) * (1 - r)^(2t) for two languages
theoretical = [100 * (1 - 0.14)**( 2*g) for g in range(n_gen + 1)]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Divergence over time
ax1.set_facecolor('#111827')
gens = np.arange(n_gen + 1)
ax1.plot(gens, shared_pct, 'o-', color='#22c55e', linewidth=2, label='Simulated')
ax1.plot(gens, theoretical, '--', color='#f59e0b', linewidth=2, label='Theoretical decay')
ax1.set_xlabel('Generations (x1000 years)', color='white')
ax1.set_ylabel('Shared vocabulary (%)', color='white')
ax1.set_title('Language Divergence Over Time', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 105)

# Language family tree (simplified)
ax2.set_facecolor('#111827')
tree_data = {
    'Proto-Indo-European': (5, 10),
    'Indo-Iranian': (3, 8),
    'European': (7, 8),
    'Indo-Aryan': (2, 6),
    'Iranian': (4, 6),
    'Germanic': (6, 6),
    'Romance': (8, 6),
    'Assamese': (1, 4),
    'Bengali': (2, 4),
    'Hindi': (3, 4),
    'English': (6, 4),
    'German': (7, 4),
}
edges_tree = [
    ('Proto-Indo-European', 'Indo-Iranian'),
    ('Proto-Indo-European', 'European'),
    ('Indo-Iranian', 'Indo-Aryan'),
    ('Indo-Iranian', 'Iranian'),
    ('European', 'Germanic'),
    ('European', 'Romance'),
    ('Indo-Aryan', 'Assamese'),
    ('Indo-Aryan', 'Bengali'),
    ('Indo-Aryan', 'Hindi'),
    ('Germanic', 'English'),
    ('Germanic', 'German'),
]
for parent, child in edges_tree:
    px, py = tree_data[parent]
    cx, cy = tree_data[child]
    ax2.plot([px, cx], [py, cy], '-', color='gray', linewidth=1, alpha=0.5)
for name, (x, y) in tree_data.items():
    color = '#22c55e' if y == 4 else '#3b82f6'
    ax2.annotate(name, xy=(x, y), ha='center', va='center', fontsize=7,
                color=color, bbox=dict(boxstyle='round,pad=0.2', facecolor='#1f2937', edgecolor=color, alpha=0.8))

ax2.set_title('Indo-European Language Family (simplified)', color='white', fontsize=11)
ax2.axis('off')
ax2.set_xlim(-0.5, 9.5)

plt.tight_layout()
plt.show()

print(f"After {n_gen} generations:")
print(f"  Shared vocabulary: {shared_pct[-1]:.0f}%")
print(f"  Theoretical prediction: {theoretical[-1]:.0f}%")`,
      challenge: 'Run the simulation with a higher mutation rate (0.25). How quickly do the languages become mutually unintelligible (< 30% shared vocabulary)? What real-world scenarios would cause high mutation rates?',
      successHint: 'Language evolution is one of the best-studied examples of cultural evolution. The same mathematical tools that biologists use for species divergence work for language divergence — because the underlying process (copying with errors, selection, drift) is the same.',
    },
    {
      title: 'Transformers and attention — how modern AI processes language',
      concept: `Modern language models (GPT, Claude, BERT) are built on the **transformer architecture** (2017). The key innovation is the **attention mechanism** — the ability to look at all words in a sentence simultaneously and decide which words are relevant to which.

How attention works:
1. Each word is converted to a vector (embedding)
2. For each word, compute "attention scores" with every other word
3. Words with high attention scores influence each other's representations
4. This happens in parallel across all words (unlike older sequential models)

Example: "The parrot that sat on the branch spoke wisely"
- When processing "spoke," attention focuses heavily on "parrot" (the subject) and less on "branch" (irrelevant to the action)
- When processing "sat," attention focuses on "parrot" and "branch"

**Multi-head attention** runs multiple attention patterns simultaneously:
- Head 1 might track subject-verb relationships
- Head 2 might track adjective-noun relationships
- Head 3 might track positional patterns

This is why transformers are so powerful — they can learn arbitrary long-range dependencies, unlike Markov chains or simple RNNs.`,
      analogy: 'Attention is like a spotlight operator at a theatre. When an actor speaks, the spotlight operator (attention) decides which other actors on stage are relevant and illuminates them. Different spotlight operators (attention heads) focus on different relationships — one tracks who is talking to whom, another tracks who is near whom on stage.',
      storyConnection: 'The parrot of Hajo processed language sequentially — hear a sound, repeat it. Transformers process all words simultaneously with attention. This is the fundamental difference: the parrot was a tape recorder; a transformer is a network that understands relationships. The parrot could never understand "The boy who trained the parrot loved it" because "it" refers back to "parrot" — a long-range dependency that requires attention.',
      checkQuestion: 'Why did transformers replace RNNs (recurrent neural networks) for language tasks, even though RNNs were designed specifically for sequential data?',
      checkAnswer: 'Two main reasons: (1) Parallelization — RNNs process words one at a time; transformers process all words simultaneously, making training much faster on GPUs. (2) Long-range dependencies — RNNs struggle to connect distant words because information degrades as it passes through many steps. Transformers use attention to directly connect any two words regardless of distance.',
      codeIntro: 'Visualize a simplified attention mechanism for a sample sentence.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified attention mechanism
sentence = ["The", "parrot", "of", "Hajo", "spoke", "wisely"]
n = len(sentence)

# Simulated attention scores (what a trained model might produce)
# Each row shows how much that word "attends to" each other word
attention = np.array([
    [0.1, 0.5, 0.1, 0.1, 0.1, 0.1],  # The -> parrot (determiner attends to its noun)
    [0.1, 0.2, 0.1, 0.2, 0.3, 0.1],  # parrot -> spoke (subject attends to verb)
    [0.1, 0.3, 0.1, 0.4, 0.05, 0.05], # of -> Hajo (preposition attends to object)
    [0.05, 0.3, 0.3, 0.2, 0.1, 0.05], # Hajo -> parrot,of (name attends to context)
    [0.05, 0.5, 0.05, 0.1, 0.1, 0.2], # spoke -> parrot (verb attends to subject)
    [0.05, 0.15, 0.05, 0.05, 0.5, 0.2], # wisely -> spoke (adverb attends to verb)
])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Attention heatmap
ax1.set_facecolor('#111827')
im = ax1.imshow(attention, cmap='Greens', vmin=0, vmax=0.6)
ax1.set_xticks(range(n))
ax1.set_yticks(range(n))
ax1.set_xticklabels(sentence, color='white', fontsize=10, rotation=45, ha='right')
ax1.set_yticklabels(sentence, color='white', fontsize=10)
ax1.set_xlabel('Attended to', color='white')
ax1.set_ylabel('Current word', color='white')
ax1.set_title('Attention Matrix', color='white', fontsize=12)
for i in range(n):
    for j in range(n):
        ax1.text(j, i, f'{attention[i,j]:.2f}', ha='center', va='center',
                color='white' if attention[i,j] > 0.3 else 'gray', fontsize=9)
plt.colorbar(im, ax=ax1)

# Attention flow diagram
ax2.set_facecolor('#111827')
y_positions = np.linspace(0.9, 0.1, n)
x_left, x_right = 0.15, 0.85

for i, word in enumerate(sentence):
    ax2.text(x_left - 0.02, y_positions[i], word, ha='right', va='center',
            color='#22c55e', fontsize=11, fontweight='bold')
    ax2.text(x_right + 0.02, y_positions[i], word, ha='left', va='center',
            color='#3b82f6', fontsize=11, fontweight='bold')

# Draw attention lines (only strong ones)
for i in range(n):
    for j in range(n):
        if attention[i, j] > 0.2:
            alpha = attention[i, j]
            ax2.plot([x_left, x_right], [y_positions[i], y_positions[j]],
                    '-', color='#f59e0b', alpha=alpha, linewidth=attention[i,j]*5)

ax2.set_title('Attention Flow (strong connections)', color='white', fontsize=12)
ax2.set_xlim(0, 1)
ax2.set_ylim(0, 1)
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Key attention patterns:")
print("  'spoke' strongly attends to 'parrot' (subject-verb)")
print("  'wisely' strongly attends to 'spoke' (adverb-verb)")
print("  'of' strongly attends to 'Hajo' (preposition-object)")
print("  'The' strongly attends to 'parrot' (determiner-noun)")
print()
print("These patterns emerge from training, not from rules.")
print("The model LEARNS grammar by seeing millions of sentences.")`,
      challenge: 'Add a seventh word "today" to the sentence. What should its attention pattern be? Which existing words should increase their attention to "today"?',
      successHint: 'From a talking parrot to transformer attention — you have traced the full arc of language science. The parrot mimics; Markov chains predict locally; transformers attend globally. Each is a step closer to true language understanding.',
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
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced language analysis. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
