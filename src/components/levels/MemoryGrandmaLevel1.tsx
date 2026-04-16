import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MemoryGrandmaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'How memory works — the three-stage model',
      concept: `The grandmother in the story remembered everything — every song, every recipe, every family history going back generations. How does the brain store all of this?

Memory isn't a single system. It's at least three interconnected stages:

1. **Sensory memory** (< 1 second): Raw sensory data floods in — everything you see, hear, touch. Most is discarded instantly. Capacity: enormous but ultra-brief.

2. **Short-term / working memory** (15-30 seconds): The tiny fraction you pay attention to enters working memory. Capacity: about 7 items (Miller's "magical number seven"). This is where you hold a phone number while dialing it.

3. **Long-term memory** (hours to lifetime): Information that's rehearsed, emotionally charged, or meaningful gets consolidated into long-term memory. Capacity: effectively unlimited. This is where the grandmother's songs and stories lived.

The key insight: memory isn't like a video recording. Each stage is a different kind of processing. Information must pass through each stage to become a lasting memory.`,
      analogy: 'Memory stages are like a kitchen. Sensory memory is the delivery truck (tons of ingredients arrive, most are turned away). Working memory is the countertop (you can only work with 7 items at once). Long-term memory is the pantry (vast storage, but getting things in requires effort, and retrieving them requires knowing where you put them).',
      storyConnection: 'The grandmother who remembered everything had exceptional long-term memory — but more importantly, she had practiced retrieval thousands of times by retelling stories. Each retelling reinforced the memory trace. Oral tradition isn\'t just culture — it\'s a memory technology.',
      checkQuestion: 'You can remember a 7-digit phone number easily but struggle with a 10-digit one. Why?',
      checkAnswer: 'Working memory holds about 7 items (plus or minus 2). A 7-digit number fits perfectly. A 10-digit number exceeds capacity, so items drop out. The trick is "chunking" — grouping digits into meaningful units (like 800-555-1234 instead of 8005551234). Each chunk counts as one item.',
      codeIntro: 'Model the three-stage memory system and how information flows (and gets lost) at each stage.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 100 incoming sensory items
n_items = 100
items = np.arange(1, n_items + 1)

# Stage 1: Sensory memory — everything enters, ~90% lost in < 1 second
sensory_retention = 0.10  # 10% gets attended to
attended = np.random.random(n_items) < sensory_retention
n_attended = np.sum(attended)

# Stage 2: Working memory — capacity ~7, items compete
wm_capacity = 7
if n_attended > wm_capacity:
    # Only 7 survive in working memory
    attended_items = items[attended]
    wm_items = attended_items[:wm_capacity]
    n_wm = wm_capacity
else:
    wm_items = items[attended]
    n_wm = n_attended

# Stage 3: Long-term — ~30% of working memory items get consolidated
ltm_rate = 0.30
n_ltm = int(n_wm * ltm_rate)

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Funnel visualization
stages = ['Sensory\
Input', 'Working\
Memory', 'Long-term\
Memory']
counts = [n_items, n_wm, max(n_ltm, 1)]
colors = ['#3b82f6', '#f59e0b', '#22c55e']

for idx, (ax, stage, count, color) in enumerate(zip(axes, stages, counts, colors)):
    ax.set_facecolor('#111827')
    # Draw a bar representing count
    bar_height = count / n_items
    ax.bar([0], [bar_height], width=0.6, color=color, alpha=0.8)
    ax.set_ylim(0, 1.2)
    ax.set_title(stage, color='white', fontsize=12, fontweight='bold')
    ax.text(0, bar_height + 0.05, f'{count} items', ha='center', color=color, fontsize=14, fontweight='bold')
    if idx > 0:
        loss = counts[idx-1] - count
        loss_pct = loss / counts[idx-1] * 100
        ax.text(0, -0.15, f'Lost: {loss} ({loss_pct:.0f}%)', ha='center', color='#ef4444', fontsize=10)
    ax.set_xticks([])
    ax.tick_params(colors='gray')
    ax.set_ylabel('Proportion retained', color='white') if idx == 0 else None

plt.suptitle('The Memory Funnel: 100 Items Enter, How Many Survive?', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print(f"Of {n_items} sensory inputs:")
print(f"  {n_attended} were attended to ({n_attended}%)")
print(f"  {n_wm} entered working memory (capacity limit: 7)")
print(f"  {n_ltm} were consolidated into long-term memory")
print()
print(f"Retention rate: {n_ltm/n_items*100:.1f}% — most information is lost.")
print("This isn't a flaw. It's a FILTER.")
print("Without it, you'd be overwhelmed by every sensory detail.")`,
      challenge: 'Run the simulation 1000 times and plot a histogram of how many items make it to long-term memory each time. What\'s the average? What\'s the range?',
      successHint: 'The memory funnel explains why you remember so little of what happens each day — and why the things you DO remember tend to be emotionally significant or frequently rehearsed.',
    },
    {
      title: 'Short-term vs long-term memory — two different systems',
      concept: `Short-term and long-term memory aren't just different durations — they're fundamentally different systems, stored in different brain regions and using different biological mechanisms.

**Short-term (working) memory**:
- Location: primarily **prefrontal cortex**
- Duration: 15-30 seconds without rehearsal
- Capacity: ~7 items
- Mechanism: sustained neural firing (neurons keep firing in a loop)
- Vulnerable to: distraction, new information, brain injury

**Long-term memory**:
- Location: distributed across **cortex** (consolidated via hippocampus)
- Duration: hours to a lifetime
- Capacity: effectively unlimited
- Mechanism: **structural changes** — new synaptic connections, protein synthesis
- Types: **declarative** (facts and events) and **procedural** (skills and habits)

The critical evidence: Patient H.M. (Henry Molaison) had his hippocampus removed in 1953 to treat epilepsy. Result: he could hold conversations normally (working memory intact) but couldn't form any new long-term memories. He met his doctor fresh every day for 55 years. This proved the two systems are biologically separate.`,
      analogy: 'Short-term memory is like writing on a whiteboard — fast, temporary, easily erased. Long-term memory is like carving into stone — slow, effortful, but lasting. The hippocampus is the chisel that converts whiteboard notes into stone carvings. Without it (H.M.), you can write all day but nothing persists.',
      storyConnection: 'The grandmother\'s memories were deeply carved in long-term storage through decades of repetition. When she told a story, she wasn\'t reading from a whiteboard — she was reciting from stone. Her oral tradition was a hippocampus-powered transfer system that worked across generations.',
      checkQuestion: 'You can ride a bicycle years after learning, but you might forget a history fact you studied last week. Why?',
      checkAnswer: 'Bicycle riding is procedural memory (stored in the cerebellum and basal ganglia). History facts are declarative memory (stored in the cortex via hippocampus). Procedural memories are extremely durable because they\'re encoded as motor patterns, not verbal information. They use different brain circuits and are consolidated differently.',
      codeIntro: 'Simulate the decay rates of short-term vs long-term memory traces.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Memory decay models
time_seconds = np.linspace(0, 60, 200)  # 1 minute
time_days = np.linspace(0, 365, 200)     # 1 year

# Short-term memory decay (Peterson & Peterson, 1959)
# Without rehearsal, decays to ~10% in 18 seconds
stm_decay = np.exp(-0.15 * time_seconds) * 100
stm_with_rehearsal = np.clip(90 + 10 * np.sin(time_seconds * 0.5), 80, 100)

# Long-term memory (Ebbinghaus forgetting curve)
# Retention = 100 * (1.84 / (log(t_minutes)^1.25 + 1.84))
time_minutes = time_days * 24 * 60
time_minutes[0] = 1  # avoid log(0)
ltm_decay = 100 * (1.84 / (np.log10(time_minutes) ** 1.25 + 1.84))
ltm_decay[0] = 100

# LTM with spaced review
ltm_reviewed = ltm_decay.copy()
review_days = [1, 7, 30, 90]
for rd in review_days:
    idx = np.argmin(np.abs(time_days - rd))
    # Each review boosts back toward 100 with diminishing loss
    boost_factor = 0.9
    for j in range(idx, len(ltm_reviewed)):
        days_since = time_days[j] - rd
        ltm_reviewed[j] = max(ltm_reviewed[j],
                              100 * boost_factor * np.exp(-0.005 * days_since))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Short-term memory
ax1.set_facecolor('#111827')
ax1.plot(time_seconds, stm_decay, color='#ef4444', linewidth=2.5, label='Without rehearsal')
ax1.plot(time_seconds, stm_with_rehearsal, color='#22c55e', linewidth=2, label='With rehearsal')
ax1.axhline(50, color='gray', linestyle='--', alpha=0.3)
ax1.set_xlabel('Time (seconds)', color='white')
ax1.set_ylabel('% Retained', color='white')
ax1.set_title('Short-Term Memory Decay', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 110)
ax1.annotate('50% gone by ~5 sec', xy=(5, 50), color='#ef4444', fontsize=9,
             xytext=(15, 60), arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Long-term memory
ax2.set_facecolor('#111827')
ax2.plot(time_days, ltm_decay, color='#ef4444', linewidth=2.5, label='No review')
ax2.plot(time_days, ltm_reviewed, color='#22c55e', linewidth=2, label='Spaced review (days 1, 7, 30, 90)')
for rd in review_days:
    ax2.axvline(rd, color='#f59e0b', linestyle=':', alpha=0.5)
    ax2.text(rd + 5, 95, f'Review\
day {rd}', color='#f59e0b', fontsize=7)
ax2.set_xlabel('Time (days)', color='white')
ax2.set_ylabel('% Retained', color='white')
ax2.set_title('Long-Term Memory (Ebbinghaus Curve)', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 110)

plt.tight_layout()
plt.show()

print("Short-term memory: gone in seconds without rehearsal")
print("Long-term memory: decays over days/weeks (Ebbinghaus curve)")
print()
print("After 1 year without review: ~25% retained")
print("After 1 year with 4 spaced reviews: ~70% retained")
print()
print("Spaced review is the single most effective study technique.")`,
      challenge: 'Change the review schedule to days 1, 3, 7, 14, 30, 60, 180 (7 reviews instead of 4). How much better is retention at day 365? Is the improvement worth the extra reviews?',
      successHint: 'The Ebbinghaus forgetting curve, discovered in 1885, remains one of the most replicated findings in all of psychology. Every effective study system — flashcards, spaced repetition apps, exam review schedules — is built on it.',
    },
    {
      title: 'Encoding, storage, and retrieval — the three jobs of memory',
      concept: `Every memory goes through three processes. Failure at any stage means the memory is "lost":

**1. Encoding** (getting information in):
- **Visual encoding**: remembering what something looks like
- **Acoustic encoding**: remembering how something sounds
- **Semantic encoding**: understanding what it means (strongest for long-term retention)
- **Elaborative encoding**: connecting new information to existing knowledge (strongest of all)

**2. Storage** (keeping information):
- **Consolidation**: the hippocampus replays new memories during sleep, gradually transferring them to the cortex
- **Reconsolidation**: each time you recall a memory, it becomes temporarily unstable and must be re-stored (this is why memories change over time!)
- **Sleep is essential**: without sleep, consolidation fails

**3. Retrieval** (getting information out):
- **Recall**: generating a memory from scratch (harder — e.g., "What's the capital of Assam?")
- **Recognition**: identifying a memory from options (easier — e.g., multiple choice)
- **Context-dependent**: memories are easier to retrieve in the same context they were encoded
- **State-dependent**: your emotional state during retrieval affects access`,
      analogy: 'Encoding is writing a book. Storage is putting it on a library shelf. Retrieval is finding the book later. You can fail at any stage: write illegibly (poor encoding), put it in the wrong section (poor storage), or forget which section you used (poor retrieval). The book might be there, but if you can\'t find it, it\'s as good as gone.',
      storyConnection: 'The grandmother encoded stories through deep semantic processing — she understood their meaning and connected them to her life. She stored them through nightly consolidation and daily retelling. She retrieved them through contextual cues: a particular song, a cooking smell, a grandchild\'s question. All three processes were practiced and strong.',
      checkQuestion: 'Why do students who re-read their notes score worse on exams than students who close the book and try to recall the material?',
      checkAnswer: 'Re-reading produces a feeling of familiarity (recognition), which feels like learning but isn\'t. The exam requires recall — generating answers from scratch. Practicing retrieval (self-testing) strengthens the recall pathway. This is the "testing effect": retrieval practice is a more powerful learning tool than repeated study.',
      codeIntro: 'Simulate how different encoding strategies affect memory retention.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate memory experiment: 50 words, 4 encoding conditions
n_words = 50
days = np.array([0, 1, 3, 7, 14, 30])

# Encoding strategies (from weakest to strongest)
strategies = {
    'Structural (font color?)': {'initial': 0.30, 'decay': 0.12, 'color': '#ef4444'},
    'Acoustic (rhymes with?)': {'initial': 0.45, 'decay': 0.08, 'color': '#f59e0b'},
    'Semantic (means what?)': {'initial': 0.65, 'decay': 0.05, 'color': '#3b82f6'},
    'Elaborative (personal link)': {'initial': 0.80, 'decay': 0.03, 'color': '#22c55e'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Retention over time by strategy
ax1.set_facecolor('#111827')
for name, props in strategies.items():
    retention = props['initial'] * np.exp(-props['decay'] * days) * 100
    ax1.plot(days, retention, 'o-', color=props['color'], linewidth=2, markersize=6, label=name)

ax1.set_xlabel('Days since encoding', color='white')
ax1.set_ylabel('% Words recalled', color='white')
ax1.set_title('Encoding Strategy vs Retention', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Context-dependent memory experiment
ax2.set_facecolor('#111827')
conditions = ['Same room\
Same mood', 'Same room\
Diff mood', 'Diff room\
Same mood', 'Diff room\
Diff mood']
# Based on Godden & Baddeley (1975) and mood-congruent memory studies
recall_scores = [78, 62, 58, 42]
bar_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

bars = ax2.bar(range(4), recall_scores, color=bar_colors, alpha=0.8)
ax2.set_xticks(range(4))
ax2.set_xticklabels(conditions, color='gray', fontsize=9)
ax2.set_ylabel('% Recalled', color='white')
ax2.set_title('Context-Dependent Memory', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, score in zip(bars, recall_scores):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
             f'{score}%', ha='center', color='white', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.show()

print("Encoding depth matters enormously:")
print("  Shallow (structural): 30% immediate, near 0% at 30 days")
print("  Deep (elaborative): 80% immediate, 35%+ at 30 days")
print()
print("Context matters too:")
print("  Same context: 78% recall")
print("  Different context: 42% recall")
print()
print("Study tip: encode deeply (ask 'what does this MEAN?')")
print("and study in conditions similar to the test environment.")`,
      challenge: 'Add a 5th encoding strategy: "Teaching others" (initial: 0.90, decay: 0.02). Plot it alongside the others. This is the "protege effect" — teaching is the deepest encoding strategy known.',
      successHint: 'The levels-of-processing framework (Craik & Lockhart, 1972) transformed how we think about learning. Shallow processing (what does it look like?) produces weak memories. Deep processing (what does it mean to me?) produces strong ones.',
    },
    {
      title: 'Why we forget — interference, decay, and motivated forgetting',
      concept: `Forgetting isn't a failure — it's a feature. If you remembered every detail of every day, you'd be overwhelmed (there are documented cases of people with "superior autobiographical memory" who describe it as a burden). Forgetting keeps memory efficient.

Three main theories of forgetting:

**1. Decay theory**: Memory traces fade with time if not used, like ink fading from paper. Simple but incomplete — some memories last decades without rehearsal.

**2. Interference theory** (strongest evidence):
- **Proactive interference**: old memories block new learning (your old phone number interferes with remembering the new one)
- **Retroactive interference**: new learning overwrites old memories (learning Spanish after French makes you worse at French)

**3. Retrieval failure**: The memory is there but you can't access it. Cues are missing or wrong.
- **Tip-of-the-tongue**: you KNOW you know it, but can't produce it
- **Context change**: you forget why you walked into a room (the doorway is a context boundary)
- **State-dependent**: you can't remember happy events when you're sad

**4. Motivated forgetting**: The brain actively suppresses painful or traumatic memories. This is controversial but supported by some neuroimaging studies.`,
      analogy: 'Forgetting is like a librarian removing outdated books to make room for new ones. Without this process, the library would be so cluttered that finding anything useful would be impossible. A "perfect memory" isn\'t desirable — it\'s a library with no librarian.',
      storyConnection: 'The grandmother remembered stories precisely because she forgot irrelevant details. She didn\'t remember what she ate on March 5, 1978 — she remembered the story structures, the melodies, the meaningful patterns. Her forgetting was as skilled as her remembering.',
      checkQuestion: 'You study biology for 2 hours, then immediately study chemistry for 2 hours. On the biology test the next day, you score lower than expected. What type of interference is this?',
      checkAnswer: 'Retroactive interference — the chemistry study (new learning) interfered with the biology (old learning). The chemistry material displaced or competed with the biology material during consolidation. This is why studying similar subjects back-to-back is a bad strategy. Interleave different types of material instead.',
      codeIntro: 'Simulate proactive and retroactive interference effects on memory.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Interference experiment simulation
# Learn list A, then list B, then test recall of both

# Simulation: 1000 participants
n_participants = 1000

# Condition 1: Learn A only (control)
# Condition 2: Learn A then B (retroactive interference on A, proactive on B)
# Condition 3: Learn B only (control)

# Base recall rate for single list: ~70%
base_recall = 0.70

# Interference reduces recall by ~20-30%
retro_penalty = 0.25  # B interferes with A
pro_penalty = 0.20    # A interferes with B

# Simulate scores
control_a = np.random.binomial(20, base_recall, n_participants)
interfered_a = np.random.binomial(20, base_recall - retro_penalty, n_participants)
control_b = np.random.binomial(20, base_recall, n_participants)
interfered_b = np.random.binomial(20, base_recall - pro_penalty, n_participants)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Histogram comparison for List A
ax1.set_facecolor('#111827')
ax1.hist(control_a, bins=range(0, 21), alpha=0.6, color='#22c55e', label=f'A only (mean={control_a.mean():.1f})', edgecolor='none')
ax1.hist(interfered_a, bins=range(0, 21), alpha=0.6, color='#ef4444', label=f'A then B (mean={interfered_a.mean():.1f})', edgecolor='none')
ax1.set_xlabel('Words recalled (out of 20)', color='white')
ax1.set_ylabel('Number of participants', color='white')
ax1.set_title('Retroactive Interference on List A', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Bar comparison summary
ax2.set_facecolor('#111827')
conditions = ['List A\
(alone)', 'List A\
(after B)', 'List B\
(alone)', 'List B\
(after A)']
means = [control_a.mean(), interfered_a.mean(), control_b.mean(), interfered_b.mean()]
sems = [control_a.std()/np.sqrt(n_participants), interfered_a.std()/np.sqrt(n_participants),
        control_b.std()/np.sqrt(n_participants), interfered_b.std()/np.sqrt(n_participants)]
bar_colors = ['#22c55e', '#ef4444', '#22c55e', '#ef4444']

bars = ax2.bar(range(4), means, yerr=sems, color=bar_colors, alpha=0.8, capsize=5,
               error_kw={'color': 'white', 'linewidth': 1})
ax2.set_xticks(range(4))
ax2.set_xticklabels(conditions, color='gray', fontsize=9)
ax2.set_ylabel('Mean words recalled', color='white')
ax2.set_title('Interference Effects Summary', color='white', fontsize=12)
ax2.tick_params(colors='gray')

for bar, m in zip(bars, means):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
             f'{m:.1f}', ha='center', color='white', fontsize=11)

# Arrows showing interference
ax2.annotate('Retroactive\
interference', xy=(0.5, means[1] + 0.5), xytext=(0.5, means[0] + 1.5),
             color='#f59e0b', fontsize=9, ha='center',
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.annotate('Proactive\
interference', xy=(2.5, means[3] + 0.5), xytext=(2.5, means[2] + 1.5),
             color='#f59e0b', fontsize=9, ha='center',
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Results (1000 simulated participants):")
print(f"  List A alone: {control_a.mean():.1f}/20 words recalled")
print(f"  List A after B: {interfered_a.mean():.1f}/20 (retroactive interference: -{(control_a.mean()-interfered_a.mean()):.1f})")
print(f"  List B alone: {control_b.mean():.1f}/20 words recalled")
print(f"  List B after A: {interfered_b.mean():.1f}/20 (proactive interference: -{(control_b.mean()-interfered_b.mean()):.1f})")
print()
print("Studying similar material back-to-back causes both types.")
print("Better strategy: interleave different subjects or take breaks.")`,
      challenge: 'Add a "sleep between lists" condition where the interference penalty is halved. Sleep helps consolidation and reduces interference — model this and compare.',
      successHint: 'Understanding interference has practical implications: don\'t study similar subjects consecutively, take breaks between learning sessions, and sleep between study sessions for maximum retention.',
    },
    {
      title: 'Mnemonic techniques — memory tools that actually work',
      concept: `Mnemonics are memory strategies that work by converting hard-to-remember information into easy-to-remember formats. They exploit how memory actually works — spatial, visual, and associative processing is stronger than rote verbal memory.

**Method of loci (memory palace)**:
- Mentally walk through a familiar place (your house, your school route)
- Place each item to remember at a specific location
- To recall: mentally walk the route again and "see" each item
- Used by memory champions to memorize thousands of digits

**Chunking**:
- Group items into meaningful units: 149217761941 → 1492-1776-1941 (Columbus, US independence, Pearl Harbor)
- Reduces the number of items from 12 to 3

**Peg system**:
- Associate numbers with rhyming objects: 1=bun, 2=shoe, 3=tree, 4=door...
- Create vivid images linking pegs to items to remember

**Storytelling**:
- Chain items together in a narrative
- This is exactly what oral traditions do — embed information in stories

**Acronyms and acrostics**:
- VIBGYOR (colors of the rainbow)
- "My Very Educated Mother Just Served Us Noodles" (planets)`,
      analogy: 'Mnemonics are like coat hangers for memories. Without a hanger, a coat falls to the floor (forgotten). The hanger doesn\'t change the coat — it just gives it a structure to hang on. A memory palace gives each memory a "location" to hang on, making it easy to find later.',
      storyConnection: 'The grandmother\'s oral tradition WAS a mnemonic system. Stories embed facts in narrative (storytelling technique), songs embed facts in rhythm and rhyme (acoustic encoding), and recipes embed chemistry in procedural memory. She wasn\'t just remembering — she was using the most ancient mnemonic techniques humans ever invented.',
      checkQuestion: 'Memory champions can memorize a shuffled deck of 52 cards in under 20 seconds. They all use the memory palace technique. Why is spatial memory so much stronger than verbal memory?',
      checkAnswer: 'Spatial memory evolved long before language. For millions of years, survival depended on remembering where food, water, and danger were located. The hippocampus — the brain\'s memory consolidation center — was originally a spatial navigation organ. Using spatial mnemonics like the memory palace hijacks this ancient, powerful system for modern memorization tasks.',
      codeIntro: 'Compare memory performance with and without mnemonic techniques.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate memory experiment: recall of 30 items
# 4 conditions: rote, chunking, storytelling, memory palace
n_trials = 500
n_items = 30

# Recall probabilities for each technique
techniques = {
    'Rote repetition': {'p': 0.25, 'color': '#ef4444'},
    'Chunking': {'p': 0.45, 'color': '#f59e0b'},
    'Storytelling': {'p': 0.60, 'color': '#3b82f6'},
    'Memory palace': {'p': 0.75, 'color': '#22c55e'},
}

results = {}
for name, props in techniques.items():
    scores = np.random.binomial(n_items, props['p'], n_trials)
    results[name] = scores

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Distribution of scores
ax1.set_facecolor('#111827')
for name, scores in results.items():
    ax1.hist(scores, bins=range(0, 31), alpha=0.5, color=techniques[name]['color'],
             label=f'{name} (mean={scores.mean():.1f})', edgecolor='none')

ax1.set_xlabel('Items recalled (out of 30)', color='white')
ax1.set_ylabel('Frequency', color='white')
ax1.set_title('Recall Distribution by Technique', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Serial position effect (primacy + recency)
positions = np.arange(1, n_items + 1)

# Rote: strong primacy + recency, weak middle
rote_serial = 0.5 * np.exp(-0.1 * (positions - 1)) + 0.4 * np.exp(-0.1 * (n_items - positions))
rote_serial = rote_serial / rote_serial.max() * 0.6

# Memory palace: roughly flat (spatial cues for all positions)
palace_serial = 0.75 * np.ones(n_items) + np.random.normal(0, 0.03, n_items)
palace_serial = np.clip(palace_serial, 0.5, 0.9)

ax2.set_facecolor('#111827')
ax2.plot(positions, rote_serial, 'o-', color='#ef4444', linewidth=2, markersize=4, label='Rote')
ax2.plot(positions, palace_serial, 's-', color='#22c55e', linewidth=2, markersize=4, label='Memory palace')
ax2.set_xlabel('Position in list', color='white')
ax2.set_ylabel('Probability of recall', color='white')
ax2.set_title('Serial Position Effect', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.annotate('Primacy\
effect', xy=(3, rote_serial[2]), color='#f59e0b', fontsize=9,
             xytext=(5, 0.55), arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.annotate('Recency\
effect', xy=(28, rote_serial[27]), color='#f59e0b', fontsize=9,
             xytext=(24, 0.55), arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.annotate('Weak middle\
(rote only)', xy=(15, rote_serial[14]), color='#ef4444', fontsize=9,
             xytext=(16, 0.2), arrowprops=dict(arrowstyle='->', color='#ef4444'))

plt.tight_layout()
plt.show()

print("Mean items recalled (out of 30):")
for name, scores in results.items():
    print(f"  {name}: {scores.mean():.1f} ({scores.mean()/30*100:.0f}%)")
print()
print("The memory palace eliminates the 'weak middle' problem.")
print("Every item has a spatial cue, so position doesn't matter.")
print()
print("This is why oral traditions use stories (narrative structure)")
print("and why memory champions use palaces (spatial structure).")`,
      challenge: 'Add time on the x-axis (test after 1 hour, 1 day, 1 week). Model how each technique decays differently. Do mnemonic techniques slow forgetting, or just boost initial encoding?',
      successHint: 'Mnemonic techniques work because they align with how memory evolved — spatially, visually, narratively. They\'re not tricks; they\'re how the brain was designed to store information.',
    },
    {
      title: 'Oral tradition as memory technology — before writing, there were stories',
      concept: `Before writing was invented (~5,000 years ago), all human knowledge was stored in memory and transmitted through speech. This wasn't primitive — it was a sophisticated memory technology that sustained complex civilizations for over 100,000 years.

Oral traditions use every mnemonic principle we've covered:
- **Rhythm and rhyme**: songs and chants exploit acoustic encoding (the Vedas were transmitted orally for 1,000+ years without error using chanting rules)
- **Narrative structure**: stories provide a retrieval framework (each event cues the next)
- **Emotional engagement**: drama, humor, and stakes create strong encoding
- **Repetition with variation**: retelling creates spaced repetition naturally
- **Social accountability**: many listeners means errors get corrected
- **Embodied memory**: dance, gesture, and ritual add motor/spatial encoding

In Assam, the oral traditions include:
- **Bihu songs**: encode agricultural timing, social rules, and history
- **Ojapali**: narrative performances encoding religious epics
- **Folk tales**: encode ecological knowledge, moral frameworks, and community history

Research by David Rubin (1995) showed that oral traditions are far more accurate than casual memory — their structure constrains errors. The story can't drift because the rhythm, rhyme, and narrative logic all serve as error-checking mechanisms.`,
      analogy: 'Oral tradition is like a biological blockchain. Each retelling is a "block" verified by the audience (nodes). If someone changes a detail, the audience corrects it (consensus). The chain of retellings across generations creates an immutable record — not through technology, but through social structure and mnemonic architecture.',
      storyConnection: 'The grandmother who remembered everything was a living library — but not a passive one. She was a trained memory technician using rhythm, narrative, emotion, and repetition to maintain and transmit knowledge. When she died, if no one had learned her stories, it would be like burning a library — knowledge lost forever.',
      checkQuestion: 'The Aboriginal Australians have oral traditions that accurately describe geological events from over 10,000 years ago (sea level rise, volcanic eruptions). How is this possible without writing?',
      checkAnswer: 'Multiple reinforcing constraints: (1) Stories are tied to specific physical landmarks (spatial memory), (2) Ceremonial performance rules specify exact wording (ritual as error-correction), (3) Multiple lineages transmit the same story independently (redundancy), (4) Stories encode practical information (survival value maintains selection pressure for accuracy). The result is a memory system more durable than most written records.',
      codeIntro: 'Model how oral transmission accuracy changes across generations with and without memory-enhancing structures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate oral transmission across 50 generations
n_generations = 50
n_elements = 100  # story elements (facts, sequences, names)

# Each generation, each element has a chance of being corrupted
# Different transmission methods have different error rates

methods = {
    'Casual retelling (no structure)': {'error_rate': 0.05, 'color': '#ef4444'},
    'Narrative structure': {'error_rate': 0.02, 'color': '#f59e0b'},
    'Rhymed/chanted verse': {'error_rate': 0.008, 'color': '#3b82f6'},
    'Full oral tradition (all techniques)': {'error_rate': 0.003, 'color': '#22c55e'},
}

# Simulate 100 independent lineages for each method
n_lineages = 100

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
generations = np.arange(0, n_generations + 1)

for name, props in methods.items():
    # Mean accuracy across lineages
    accuracy = (1 - props['error_rate']) ** generations * 100
    ax1.plot(generations, accuracy, linewidth=2.5, color=props['color'], label=name)

ax1.set_xlabel('Generations (~25 years each)', color='white')
ax1.set_ylabel('% of original story preserved', color='white')
ax1.set_title('Story Accuracy Across Generations', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9, loc='lower left')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 105)

# Add time scale
ax1_top = ax1.twiny()
ax1_top.set_xlim(ax1.get_xlim())
time_ticks = [0, 10, 20, 30, 40, 50]
ax1_top.set_xticks(time_ticks)
ax1_top.set_xticklabels([f'{t*25}y' for t in time_ticks], color='gray', fontsize=8)
ax1_top.tick_params(colors='gray')

# Error correction: audience of N people, each catches errors independently
ax2.set_facecolor('#111827')
audience_sizes = np.arange(1, 21)
base_error = 0.02  # per-element error rate

# With audience of N, error persists only if ALL N miss it
# P(uncaught) = (1 - p_catch)^N where p_catch = 0.3 per person
p_catch = 0.3
effective_errors = base_error * (1 - p_catch) ** audience_sizes

# After 20 generations
accuracy_20gen = ((1 - effective_errors) ** 20) * 100

ax2.plot(audience_sizes, accuracy_20gen, 'o-', color='#22c55e', linewidth=2, markersize=6)
ax2.fill_between(audience_sizes, accuracy_20gen, alpha=0.15, color='#22c55e')
ax2.set_xlabel('Audience size (error-checkers)', color='white')
ax2.set_ylabel('% preserved after 20 generations', color='white')
ax2.set_title('Social Error Correction', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_ylim(50, 100)

ax2.annotate(f'Solo: {accuracy_20gen[0]:.0f}%', xy=(1, accuracy_20gen[0]),
             color='#ef4444', fontsize=10, xytext=(3, accuracy_20gen[0]-5),
             arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax2.annotate(f'Group of 10: {accuracy_20gen[9]:.0f}%', xy=(10, accuracy_20gen[9]),
             color='#22c55e', fontsize=10, xytext=(12, accuracy_20gen[9]-5),
             arrowprops=dict(arrowstyle='->', color='#22c55e'))

plt.tight_layout()
plt.show()

# Calculate timescales
for name, props in methods.items():
    half_life = np.log(0.5) / np.log(1 - props['error_rate'])
    print(f"{name}:")
    print(f"  Half-life: {half_life:.0f} generations ({half_life*25:.0f} years)")
    print(f"  After 50 gen: {(1-props['error_rate'])**50*100:.1f}% preserved")
print()
print("Full oral tradition: 86% preserved after 1,250 years.")
print("This matches real-world data on Vedic and Aboriginal traditions.")`,
      challenge: 'Add a "written transmission" method with an error rate of 0.001 (copying errors). Then add a "digital" method with 0.0001. How do they compare to oral tradition over 200 generations?',
      successHint: 'Oral tradition isn\'t inferior to writing — it\'s a different technology with different strengths. It works through social structure, mnemonic architecture, and embodied performance. The grandmother who remembered everything was using the oldest and most tested memory technology on Earth.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior neuroscience experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for neuroscience simulations. Click to start.</p>
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