import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CherawDanceLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is periodic motion?',
      concept: `**Periodic motion** is any motion that repeats itself at regular time intervals. A pendulum swinging, a heartbeat, the Earth orbiting the Sun — all periodic.

The key property is the **period** (T): the time for one complete cycle. Its inverse is **frequency** (f): how many cycles happen per second.

\`f = 1 / T\`

Frequency is measured in **Hertz (Hz)**. If your heart beats 72 times per minute, that is 72/60 = 1.2 Hz, with a period of 1/1.2 = 0.833 seconds.

📚 *In Python, we use variables to store numbers and \`print()\` to display results. The f-string syntax \`f"text {variable}"\` lets you embed calculations inside strings.*`,
      analogy: 'Think of a grandfather clock. The pendulum swings left, swings right, and returns to where it started — that is one cycle. The time for that full swing is the period. If it takes 2 seconds per swing, the frequency is 0.5 Hz (half a swing per second).',
      storyConnection: 'In the Cheraw bamboo dance of Mizoram, dancers step between bamboo poles that clap together in a steady rhythm. Each open-close-open cycle of the bamboos is one period of periodic motion. The dancers must internalize this period to avoid getting their feet caught.',
      checkQuestion: 'If the bamboo poles in Cheraw clap together every 0.8 seconds, what is the frequency of the clapping?',
      checkAnswer: 'Frequency = 1 / period = 1 / 0.8 = 1.25 Hz. That means the bamboos clap 1.25 times per second, or 75 times per minute — similar to a resting heart rate.',
      codeIntro: 'Calculate period and frequency for different Cheraw dance tempos.',
      code: `# Periodic motion in the Cheraw bamboo dance
# The bamboo poles clap at a steady beat

# Different dance tempos (beats per minute)
slow_bpm = 60
medium_bpm = 90
fast_bpm = 120

for bpm in [slow_bpm, medium_bpm, fast_bpm]:
    period = 60 / bpm        # seconds per beat
    frequency = 1 / period   # beats per second (Hz)

    print(f"Tempo: {bpm} BPM")
    print(f"  Period:    {period:.3f} seconds")
    print(f"  Frequency: {frequency:.2f} Hz")
    print(f"  Time for 10 claps: {10 * period:.1f} seconds")
    print()

# How many claps in a 3-minute performance?
performance_minutes = 3
for bpm in [slow_bpm, medium_bpm, fast_bpm]:
    total_claps = bpm * performance_minutes
    print(f"At {bpm} BPM: {total_claps} claps in {performance_minutes} min")`,
      challenge: 'Add a new tempo of 150 BPM (very fast). At what point does the period become so short that a dancer could not physically step between the bamboos? (Hint: a human foot step takes about 0.2 seconds.)',
      successHint: 'You learned that period and frequency are inversely related. Faster tempos mean shorter periods and higher frequencies. The physical limits of human movement set a ceiling on how fast the Cheraw can be performed.',
    },
    {
      title: 'Beats per minute and musical tempo',
      concept: `**BPM (beats per minute)** is the standard way musicians measure tempo. It directly relates to the physics of periodic motion:

\`period_seconds = 60 / BPM\`
\`frequency_Hz = BPM / 60\`

Standard musical tempos have Italian names:
- **Largo**: 40-60 BPM (very slow)
- **Andante**: 76-108 BPM (walking pace)
- **Allegro**: 120-156 BPM (fast, lively)
- **Presto**: 168-200 BPM (very fast)

The Cheraw dance typically runs at 80-120 BPM, placing it in the andante to allegro range. The dancers adjust their stepping pattern based on the tempo.

📚 *In Python, \`range(start, stop, step)\` creates a sequence of numbers. We use it to loop through different BPM values.*`,
      analogy: 'BPM is like the speed setting on a treadmill. A slow walk is 60 BPM, a brisk walk is 100 BPM, a jog is 140 BPM, and a sprint is 180 BPM. Just as you change your gait at different treadmill speeds, Cheraw dancers change their stepping pattern at different tempos.',
      storyConnection: 'The bamboo holders in Cheraw set the tempo. Young performers start at slower tempos (around 80 BPM) and gradually increase speed as they gain confidence. Master dancers can perform at tempos exceeding 120 BPM, requiring split-second timing.',
      checkQuestion: 'A Cheraw performance starts at 80 BPM and accelerates to 120 BPM. By what percentage does the period decrease?',
      checkAnswer: 'At 80 BPM: period = 60/80 = 0.75 s. At 120 BPM: period = 60/120 = 0.5 s. Decrease = (0.75 - 0.5)/0.75 = 33.3%. The period drops by a third, meaning the dancer has one-third less time to step between the bamboos.',
      codeIntro: 'Map BPM values to musical tempo names and calculate the available stepping time for dancers.',
      code: `# BPM to musical tempo mapping for Cheraw dance

def tempo_name(bpm):
    """Return the musical tempo name for a given BPM."""
    if bpm < 60:
        return "Largo (very slow)"
    elif bpm < 76:
        return "Adagio (slow)"
    elif bpm < 108:
        return "Andante (walking pace)"
    elif bpm < 120:
        return "Moderato (moderate)"
    elif bpm < 156:
        return "Allegro (fast)"
    elif bpm < 168:
        return "Vivace (lively)"
    else:
        return "Presto (very fast)"

print("Cheraw Dance Tempo Analysis")
print("=" * 45)

for bpm in range(60, 161, 10):
    period = 60 / bpm
    # Bamboos are open for roughly half the period
    open_time = period / 2
    name = tempo_name(bpm)

    difficulty = "Easy" if open_time > 0.35 else "Medium" if open_time > 0.25 else "Hard"

    print(f"{bpm:3d} BPM | {name:25s} | "
          f"Open: {open_time:.3f}s | {difficulty}")`,
      challenge: 'Modify the code to also print the frequency in Hz for each BPM. At what BPM does the open time first drop below 0.2 seconds (physically impossible to step through)?',
      successHint: 'You learned how BPM maps to physics (period and frequency) and to music (tempo names). The Cheraw dance lives at the intersection of rhythm, physics, and human athletic ability.',
    },
    {
      title: 'Phase — where are you in the cycle?',
      concept: `**Phase** tells you where you are within a single cycle of periodic motion. It is measured in degrees (0° to 360°) or radians (0 to 2π).

Think of a clock:
- **0° (0 rad)**: bamboos fully open (starting position)
- **90° (π/2 rad)**: bamboos halfway closed, moving inward
- **180° (π rad)**: bamboos fully closed (clap!)
- **270° (3π/2 rad)**: bamboos halfway open, moving outward
- **360° (2π rad)**: back to fully open — one complete cycle

Two objects with different phases are "out of sync." If two sets of bamboos have a **phase difference** of 180°, when one is open the other is closed. Dancers must track multiple phases simultaneously.

📚 *Python's math module provides \`math.pi\` for π and \`math.sin()\` for the sine function. Sine naturally describes periodic motion.*`,
      analogy: 'Phase is like the position of a runner on a circular track. Two runners can run at the same speed (same frequency) but be at different positions on the track (different phases). If one runner is at the starting line while the other is at the halfway point, they have a phase difference of 180°.',
      storyConnection: 'In advanced Cheraw formations, multiple pairs of bamboo poles operate at different phases. The dancer must navigate poles that open and close at staggered times — like a combination lock where each tumbler rotates at the same speed but is offset from the others.',
      checkQuestion: 'If two bamboo pairs clap at the same frequency but with a 90° phase difference, and pair A is fully open right now, what position is pair B in?',
      checkAnswer: 'Pair B is at 90° — it is halfway through closing. The dancer has about a quarter of a period before pair B closes completely. Phase differences create windows of opportunity that skilled dancers exploit.',
      codeIntro: 'Model the position of bamboo poles as a sine wave and visualize phase.',
      code: `import math

# Model bamboo position using sine wave
# Position: 1 = fully open, -1 = fully closed, 0 = halfway

frequency = 1.5  # Hz (90 BPM)
period = 1 / frequency

print(f"Frequency: {frequency} Hz, Period: {period:.3f} s")
print()
print("Bamboo position over one complete cycle:")
print("-" * 50)

# Sample 12 points in one cycle
steps = 12
for i in range(steps + 1):
    t = i * period / steps
    phase_deg = i * 360 / steps
    phase_rad = i * 2 * math.pi / steps

    position = math.sin(phase_rad)

    # Visual bar
    bar_len = int((position + 1) * 15)
    bar = "█" * bar_len + "░" * (30 - bar_len)

    state = "OPEN" if position > 0.5 else "CLOSED" if position < -0.5 else "moving"

    print(f"t={t:.3f}s | {phase_deg:3.0f}° | {bar} | {state}")`,
      challenge: 'Add a second bamboo pair with a 90° phase offset. Print both positions side by side. When is the only safe moment to step from pair A to pair B?',
      successHint: 'You learned that phase describes position within a cycle. Sine waves are the mathematical language of periodic motion, and phase differences create the complex timing patterns that make Cheraw dance so challenging.',
    },
    {
      title: 'Rhythm patterns — subdividing the beat',
      concept: `A single beat can be **subdivided** into smaller units. In music, a whole note splits into 2 half notes, 4 quarter notes, 8 eighth notes, and so on. Each subdivision doubles the frequency.

In Cheraw, the basic clap is the **downbeat**. But the dancers' feet create subdivisions:
- **1 step per beat**: matching the bamboo frequency
- **2 steps per beat**: double-time, feet move at 2× bamboo frequency
- **3 steps per beat**: triplet feel, feet at 3× bamboo frequency

This is the physics of **harmonics**: frequencies that are integer multiples of a fundamental frequency. The fundamental is the bamboo clap; the harmonics are the dancers' footwork patterns.

📚 *Python lists can store sequences of values. We use \`for\` loops to iterate through them and \`len()\` to count items.*`,
      analogy: 'Subdivisions are like zooming in on a ruler. The inch marks are the main beats. Between them are half-inch marks (2 subdivisions), then quarter-inch marks (4 subdivisions). Each level of detail doubles the number of marks — just as each subdivision doubles the rhythmic frequency.',
      storyConnection: 'Expert Cheraw dancers create complex polyrhythmic patterns by combining different subdivisions. Their feet might do triplets while the bamboos maintain a steady duple meter — a 3-against-2 pattern called a hemiola, one of the most sophisticated rhythmic devices in world music.',
      checkQuestion: 'If the bamboos clap at 100 BPM and a dancer takes 3 steps per beat, what is the frequency of the dancer\'s footsteps in Hz?',
      checkAnswer: 'Bamboo frequency = 100/60 = 1.667 Hz. Dancer frequency = 3 × 1.667 = 5.0 Hz. That is 5 footsteps per second, or 300 steps per minute — extremely fast footwork comparable to competitive tap dancing.',
      codeIntro: 'Generate rhythm patterns by subdividing beats and calculate the resulting frequencies.',
      code: `# Rhythm subdivisions in Cheraw dance

base_bpm = 90
base_freq = base_bpm / 60  # Hz

print(f"Base tempo: {base_bpm} BPM ({base_freq:.2f} Hz)")
print()

# Different subdivision patterns
subdivisions = [1, 2, 3, 4, 6]
names = ["quarter notes", "eighth notes", "triplets",
         "sixteenth notes", "sextuplets"]

for sub, name in zip(subdivisions, names):
    sub_freq = base_freq * sub
    sub_bpm = base_bpm * sub
    sub_period = 1 / sub_freq

    print(f"{sub}x subdivision ({name}):")
    print(f"  Frequency: {sub_freq:.2f} Hz")
    print(f"  Effective BPM: {sub_bpm}")
    print(f"  Time per step: {sub_period*1000:.0f} ms")
    print()

# Create a simple rhythm pattern using 1s and 0s
# 1 = step, 0 = rest
print("Sample Cheraw dance rhythm (8 beats):")
pattern = [1,0,1,1, 0,1,1,0,  # dancer feet
           1,0,0,0, 1,0,0,0]  # bamboo claps (every 4th)

for i, hit in enumerate(pattern):
    symbol = "●" if hit else "○"
    bar = "|" if i % 4 == 0 else " "
    print(f"{bar}{symbol}", end="")
print("|")`,
      challenge: 'Create a 3-against-2 polyrhythm: one pattern with hits every 2 subdivisions and another with hits every 3. Print them aligned to show where they coincide.',
      successHint: 'You learned that rhythm subdivisions are really frequency multiplication — a direct application of harmonics from physics. The interplay of different subdivisions creates the rhythmic richness of Cheraw dance.',
    },
    {
      title: 'Timing precision — human limits and practice',
      concept: `Humans are remarkably good at maintaining periodic timing. Research shows trained musicians can keep a beat with a **standard deviation of just 10-20 milliseconds** — that is 0.01 to 0.02 seconds of variation.

But we are not perfect. Our timing has **random jitter** (small unpredictable variations) and sometimes **drift** (gradually speeding up or slowing down). The Cheraw dance demands both:
- **Low jitter**: each clap must be precisely timed so the dancer is safe
- **Zero drift**: the tempo must stay constant throughout the performance

**Reaction time** also matters. The fastest human reaction to a visual cue is about 200 ms. To an auditory cue (like a bamboo clap), it is about 150 ms. But Cheraw dancers do not react — they **predict** based on internalized rhythm.

📚 *Python's \`random\` module lets us simulate uncertainty. \`random.gauss(mean, std)\` generates random numbers with a bell-curve distribution.*`,
      analogy: 'Imagine a metronome with a slightly wobbly spring. Each tick is close to the target time but not exact. The wobble is jitter. If the spring also slowly loosens over time, the metronome gradually slows down — that is drift. A good musician, like a quality metronome, minimizes both.',
      storyConnection: 'The bamboo holders in Cheraw are the human metronomes of the performance. Their timing precision determines whether the dance is safe and beautiful. Young performers practice for years to reduce their timing jitter to the point where the dance becomes second nature.',
      checkQuestion: 'If a bamboo holder has 15 ms of timing jitter and the bamboos are open for 300 ms, what percentage of the open window is "lost" to timing uncertainty?',
      checkAnswer: 'The jitter could shorten the safe window by 15 ms on each side (opening late, closing early), so 30 ms total. That is 30/300 = 10% of the window lost to timing uncertainty. At faster tempos where the window is only 200 ms, the same jitter consumes 15% — which is why fast Cheraw requires years of practice.',
      codeIntro: 'Simulate human timing with jitter and measure how it affects dance safety.',
      code: `import random

random.seed(42)  # For reproducible results

# Simulate a Cheraw performance with timing jitter
bpm = 100
ideal_period = 60 / bpm  # 0.6 seconds
num_beats = 20

# Different skill levels (timing jitter in milliseconds)
skill_levels = {
    "Beginner":    40,  # 40 ms jitter
    "Intermediate": 20, # 20 ms jitter
    "Master":       8,  # 8 ms jitter
}

print(f"Tempo: {bpm} BPM, Ideal period: {ideal_period*1000:.0f} ms")
print(f"Safe window: {ideal_period*500:.0f} ms (half period)")
print()

for level, jitter_ms in skill_levels.items():
    jitter_s = jitter_ms / 1000

    # Simulate beat timings
    errors = []
    for _ in range(num_beats):
        actual_period = random.gauss(ideal_period, jitter_s)
        error = abs(actual_period - ideal_period) * 1000
        errors.append(error)

    avg_error = sum(errors) / len(errors)
    max_error = max(errors)
    safe_window = ideal_period * 500  # half period in ms
    danger_pct = sum(1 for e in errors if e > safe_window * 0.3) / num_beats * 100

    print(f"{level} (±{jitter_ms} ms jitter):")
    print(f"  Avg timing error: {avg_error:.1f} ms")
    print(f"  Max timing error: {max_error:.1f} ms")
    print(f"  Risky beats (>30% of safe window): {danger_pct:.0f}%")
    print()`,
      challenge: 'Add a "drift" component: the period gradually increases by 0.5 ms per beat. How many beats before the performer is noticeably off-tempo (error > 50 ms)?',
      successHint: 'You learned that human timing has measurable precision limits. The Cheraw dance is a remarkable demonstration of how practice can push those limits, with master performers achieving timing precision comparable to mechanical metronomes.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Periodic Motion & Rhythm Physics</span>
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
