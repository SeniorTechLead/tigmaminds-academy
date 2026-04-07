import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MusicDimasaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'MIDI basics — music as data',
      concept: `**MIDI** (Musical Instrument Digital Interface) is a protocol invented in 1983 that represents music as data, not sound. A MIDI message doesn't contain audio — it contains instructions like "play note C4 at velocity 80 for 500 milliseconds."

A MIDI note has three key properties:
- **Note number** (0-127): which pitch to play. 60 = middle C (C4), 69 = A4 (440 Hz)
- **Velocity** (0-127): how hard the note is struck (volume/intensity)
- **Duration**: how long the note is held

MIDI messages:
- **Note On**: start playing a note (note number + velocity)
- **Note Off**: stop playing a note
- **Control Change**: adjust a parameter (volume, pan, sustain pedal)
- **Program Change**: switch to a different instrument sound

The beauty of MIDI is that the same data can drive any instrument. A MIDI piano performance can be replayed through a violin, a synthesizer, or a Dimasa drum sample. The notes are the same; the sound is different.

MIDI note number to frequency: **f = 440 × 2^((n - 69) / 12)** where n is the MIDI note number.`,
      analogy: 'MIDI is like sheet music for computers. Sheet music tells a musician "play this note, this loud, for this long" but makes no sound itself. A MIDI file does the same for a computer. Just as different musicians interpret the same sheet music differently, different synthesizers produce different sounds from the same MIDI data.',
      storyConnection: 'The Dimasa kingdom preserved its music through oral tradition — master to student, generation to generation. MIDI is the digital equivalent: it captures the "instructions" of a performance, not the performance itself. A Dimasa drum pattern encoded in MIDI could be played back centuries later on any instrument imaginable.',
      checkQuestion: 'MIDI note 60 is middle C. What MIDI note number is one octave above? What about the A above middle C (A4 = 440 Hz)?',
      checkAnswer: 'One octave above middle C = MIDI 72 (60 + 12, since an octave is 12 semitones). A4 = MIDI 69. You can verify: f = 440 * 2^((69-69)/12) = 440 * 2^0 = 440 Hz.',
      codeIntro: 'Convert MIDI note numbers to frequencies and visualize the piano keyboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# MIDI note number to frequency conversion
# f = 440 * 2^((n - 69) / 12)
midi_notes = np.arange(21, 109)  # Piano range: A0 to C8
frequencies = 440 * 2**((midi_notes - 69) / 12)

# Note names
note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')

# Frequency vs MIDI note (exponential relationship)
ax1.set_facecolor('#111827')
ax1.plot(midi_notes, frequencies, color='#22c55e', linewidth=2)
ax1.fill_between(midi_notes, frequencies, alpha=0.1, color='#22c55e')

# Highlight specific notes
highlights = [(60, 'C4'), (69, 'A4\\\n440Hz'), (48, 'C3'), (72, 'C5'), (84, 'C6')]
for note, label in highlights:
    freq = 440 * 2**((note - 69) / 12)
    ax1.plot(note, freq, 'o', color='#f59e0b', markersize=8)
    ax1.annotate(label, xy=(note, freq), xytext=(note+2, freq*1.1),
                color='#f59e0b', fontsize=9)

ax1.set_xlabel('MIDI Note Number', color='white')
ax1.set_ylabel('Frequency (Hz)', color='white')
ax1.set_title('MIDI Note to Frequency: Exponential Relationship', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# One octave piano roll visualization (C4 to C5)
ax2.set_facecolor('#111827')
octave_notes = list(range(60, 73))
is_black = [False, True, False, True, False, False, True, False, True, False, True, False, False]
bar_colors = ['#e5e7eb' if not b else '#374151' for b in is_black]

for i, (note, black, color) in enumerate(zip(octave_notes, is_black, bar_colors)):
    width = 0.6 if black else 0.8
    ax2.bar(i, 1, width=width, color=color, edgecolor='#6b7280', linewidth=0.5)
    name = note_names[note % 12]
    freq = 440 * 2**((note - 69) / 12)
    ax2.text(i, 0.5, f'{name}\\\n{freq:.0f}Hz', ha='center', va='center',
            color='black' if not black else 'white', fontsize=7)
    ax2.text(i, -0.1, f'M{note}', ha='center', color='#9ca3af', fontsize=7)

ax2.set_title('One Octave: C4 to C5 (MIDI 60-72)', color='white', fontsize=11)
ax2.set_ylim(-0.3, 1.2)
ax2.set_yticks([])
ax2.set_xticks([])
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("MIDI note to frequency: f = 440 * 2^((n - 69) / 12)")
print()
print("Key MIDI values:")
print(f"  MIDI 21 (A0, lowest piano): {440 * 2**((21-69)/12):.1f} Hz")
print(f"  MIDI 60 (C4, middle C):     {440 * 2**((60-69)/12):.1f} Hz")
print(f"  MIDI 69 (A4, concert A):    {440 * 2**((69-69)/12):.1f} Hz")
print(f"  MIDI 108 (C8, highest piano): {440 * 2**((108-69)/12):.1f} Hz")`,
      challenge: 'Create a MIDI sequence for "Twinkle Twinkle Little Star" starting on C4 (MIDI 60). The notes are: C C G G A A G, F F E E D D C. Plot the MIDI note numbers over time as a piano roll.',
      successHint: 'MIDI turned music into a digital language. Every DAW (Digital Audio Workstation), every electronic instrument, every music app speaks MIDI. Understanding it is the first step to digital music production.',
    },
    {
      title: 'Digital audio representation — sound as numbers',
      concept: `When you record sound digitally, you **sample** the continuous sound wave at regular intervals. Each sample is a number representing the wave's amplitude at that instant.

Two parameters define digital audio quality:
- **Sample rate**: how many samples per second (measured in Hz). CD quality = 44,100 Hz (44.1 kHz). This means 44,100 numbers per second.
- **Bit depth**: how precisely each sample is measured. CD quality = 16 bits = 65,536 possible values per sample.

**Nyquist theorem**: to accurately capture a frequency f, you need a sample rate of at least 2f. Since humans hear up to ~20,000 Hz, a 44,100 Hz sample rate captures everything we can hear.

File sizes add up fast:
- 1 second of CD-quality stereo audio = 44,100 samples × 2 bytes × 2 channels = 176,400 bytes ≈ 172 KB
- A 3-minute song = ~31 MB uncompressed
- MP3 compression reduces this to ~3 MB by removing sounds humans can't easily hear

This is how the Dimasa kingdom's drum rhythms — once carried only by memory and live performance — can now be preserved as a precise sequence of numbers, playable forever.`,
      analogy: 'Digital audio sampling is like a flipbook animation. A movie is continuous motion, but a flipbook captures individual frames. If you draw 24 frames per second, it looks smooth. If you only draw 5, it looks choppy. Audio sampling works the same way — more samples per second means smoother, more accurate sound.',
      storyConnection: 'The Dimasa musicians relied on human memory to preserve their music across generations — imprecise, subject to drift. Digital audio captures every nuance of a drum strike as numbers. A recording made today will sound identical in a thousand years. This is preservation through mathematics.',
      checkQuestion: 'Why is the CD sample rate 44,100 Hz specifically (not a rounder number like 40,000 or 50,000)?',
      checkAnswer: 'The Nyquist theorem requires at least 2x the highest frequency you want to capture. Humans hear up to ~20,000 Hz, so you need at least 40,000 Hz. The extra 4,100 Hz provides headroom for the anti-aliasing filter (which isn\'t perfect). The specific number 44,100 was also chosen for compatibility with early video recording equipment used for digital audio storage.',
      codeIntro: 'Visualize how sampling rate affects the accuracy of capturing a sound wave.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Original continuous signal: a 440 Hz sine wave (A4)
t_continuous = np.linspace(0, 0.01, 10000)  # 10ms, very fine
signal_continuous = np.sin(2 * np.pi * 440 * t_continuous)

# Sample at different rates
sample_rates = [1000, 2000, 5000, 44100]
labels = ['1,000 Hz (too low)', '2,000 Hz (still too low)',
          '5,000 Hz (adequate)', '44,100 Hz (CD quality)']
colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']

fig, axes = plt.subplots(4, 1, figsize=(12, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Sampling a 440 Hz Sine Wave at Different Rates', color='white', fontsize=14)

for idx, (sr, label, color) in enumerate(zip(sample_rates, labels, colors)):
    ax = axes[idx]
    ax.set_facecolor('#111827')

    # Sample points
    t_samples = np.arange(0, 0.01, 1/sr)
    samples = np.sin(2 * np.pi * 440 * t_samples)

    # Plot original signal
    ax.plot(t_continuous * 1000, signal_continuous, color='#4b5563', linewidth=1, alpha=0.5, label='Original')
    # Plot samples
    ax.stem(t_samples * 1000, samples, linefmt=color, markerfmt='o', basefmt=' ', label=f'{sr:,} Hz ({len(t_samples)} samples)')
    ax.set_ylabel('Amplitude', color='white', fontsize=8)
    ax.set_title(label, color=color, fontsize=10)
    ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8, loc='upper right')
    ax.tick_params(colors='gray')
    ax.set_ylim(-1.5, 1.5)

axes[-1].set_xlabel('Time (ms)', color='white')
plt.tight_layout()
plt.show()

print("Nyquist theorem: sample rate must be >= 2 * highest frequency")
print(f"  440 Hz signal needs >= {440*2} Hz sample rate")
print()
print("Samples in 10ms of audio:")
for sr, label in zip(sample_rates, labels):
    n = int(sr * 0.01)
    print(f"  {sr:>6,} Hz: {n:>4} samples — {'ALIASED' if sr < 880 else 'OK'}")`,
      challenge: 'What happens if you sample a 440 Hz signal at exactly 440 Hz? (Set sample_rate = 440.) This is called aliasing — the sampled version looks like a completely different signal. Try it and see!',
      successHint: 'Every audio file on your phone, every streaming song, every voice call uses this exact process: continuous sound waves converted to sequences of numbers through sampling. Understanding this is the foundation of all digital audio.',
    },
    {
      title: 'Beats per minute and time math — the mathematics of rhythm',
      concept: `Music is deeply mathematical. **BPM** (beats per minute) defines tempo, but the real math comes when you subdivide beats and combine rhythms.

**Time calculations in music:**
- Beat duration = 60 / BPM seconds
- At 120 BPM: one beat = 0.5 seconds
- A quarter note at 120 BPM = 0.5s
- An eighth note = 0.25s
- A sixteenth note = 0.125s
- A dotted quarter = 0.75s (1.5× the base value)

**Polyrhythms** are when two different rhythmic patterns overlap:
- **3 against 2**: one hand plays 3 evenly spaced beats while the other plays 2
- **4 against 3**: one pattern divides the measure into 4, the other into 3

The Dimasa drumming tradition uses complex polyrhythms. The mathematical relationship is the **LCM** (least common multiple): 3-against-2 has an LCM of 6, meaning the patterns realign every 6 subdivisions.

Polyrhythms are also how time signatures interact in ensemble music. A drummer playing in 3/4 over a bass player in 4/4 creates a 12-beat cycle before the patterns coincide again.`,
      analogy: 'Polyrhythms are like two runners on a circular track, one taking 3 steps per lap and the other taking 2. They start together, diverge, and meet again at the LCM of their step counts. The moment they realign creates a satisfying "click" — the downbeat of the cycle.',
      storyConnection: 'Dimasa ensemble drumming required multiple drummers to maintain different rhythmic patterns simultaneously. The lead drummer played in cycles of 7, while the support drummer played in cycles of 4. They would converge every 28 beats — creating a massive rhythmic resolution that made crowds cheer.',
      checkQuestion: 'Two Dimasa drummers play simultaneously. One plays a pattern that repeats every 5 beats, the other every 3 beats. After how many beats will both patterns start together again?',
      checkAnswer: 'LCM(5, 3) = 15 beats. Since 5 and 3 share no common factors, their LCM is simply 5 x 3 = 15. At 120 BPM, this cycle takes 15 x 0.5 = 7.5 seconds.',
      codeIntro: 'Visualize polyrhythms and the mathematics of beat subdivision.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Polyrhythm visualization: 3 against 2, 4 against 3, 5 against 4
fig, axes = plt.subplots(3, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Polyrhythms: When Patterns Collide', color='white', fontsize=14)

polyrhythms = [(3, 2), (4, 3), (5, 4)]
colors_top = ['#22c55e', '#3b82f6', '#f59e0b']
colors_bot = ['#ef4444', '#a855f7', '#ec4899']

for idx, ((a, b), ct, cb) in enumerate(zip(polyrhythms, colors_top, colors_bot)):
    ax = axes[idx]
    ax.set_facecolor('#111827')

    lcm = np.lcm(a, b)
    duration = 1.0  # one cycle

    # Pattern A: evenly spaced
    times_a = np.linspace(0, duration, a, endpoint=False)
    # Pattern B: evenly spaced
    times_b = np.linspace(0, duration, b, endpoint=False)

    # Subdivision grid
    subdiv = np.linspace(0, duration, lcm, endpoint=False)
    for s in subdiv:
        ax.axvline(s, color='#374151', linewidth=0.5, alpha=0.5)

    ax.scatter(times_a, [1.2]*a, s=200, color=ct, zorder=5, label=f'Pattern A: {a} beats')
    ax.scatter(times_b, [0.8]*b, s=200, color=cb, zorder=5, label=f'Pattern B: {b} beats')

    # Mark coincidence points
    coincidences = []
    for ta in times_a:
        for tb in times_b:
            if abs(ta - tb) < 0.001:
                coincidences.append(ta)
    for c in coincidences:
        ax.axvline(c, color='#f59e0b', linewidth=2, alpha=0.7)
        ax.scatter([c, c], [1.2, 0.8], s=300, color='#f59e0b', zorder=6, marker='*')

    ax.set_title(f'{a} against {b} (LCM = {lcm})', color='white', fontsize=11)
    ax.set_ylim(0.4, 1.6)
    ax.set_yticks([0.8, 1.2])
    ax.set_yticklabels([f'B ({b})', f'A ({a})'], color='white', fontsize=9)
    ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8, loc='upper right')
    ax.tick_params(colors='gray')
    ax.set_xlim(-0.05, 1.05)

axes[-1].set_xlabel('Time (one cycle)', color='white')
plt.tight_layout()
plt.show()

print("Polyrhythm mathematics:")
for a, b in polyrhythms:
    lcm = np.lcm(a, b)
    print(f"  {a} against {b}: LCM = {lcm}, subdivisions = {lcm}")
    print(f"    At 120 BPM: cycle = {lcm * 0.5:.1f} seconds")
print()
print("Stars mark where both patterns coincide (the downbeat).")
print("More complex polyrhythms have fewer coincidence points,")
print("creating greater tension before resolution.")`,
      challenge: 'Create a 7-against-5 polyrhythm (common in Indian classical music). What is its LCM? How does the density of coincidence points compare to simpler polyrhythms?',
      successHint: 'Polyrhythms are where music meets number theory. The LCM determines cycle length; the GCD determines how often patterns align. Complex polyrhythms create rhythmic tension through mathematical divergence.',
    },
    {
      title: 'Chord progressions — the architecture of harmony',
      concept: `A **chord** is three or more notes played simultaneously. A **chord progression** is a sequence of chords that forms the harmonic backbone of a song.

Chords are built by stacking intervals on top of a root note:
- **Major chord**: root + major third (4 semitones) + perfect fifth (7 semitones) — sounds bright, happy
- **Minor chord**: root + minor third (3 semitones) + perfect fifth (7 semitones) — sounds dark, sad
- **Diminished chord**: root + minor third + diminished fifth (6 semitones) — sounds tense, unstable

In any major key, each scale degree produces a specific chord type:
- I (C): major, IV (F): major, V (G): major — the "happy" chords
- ii (Dm): minor, iii (Em): minor, vi (Am): minor — the "sad" chords
- vii° (Bdim): diminished — the "tense" chord

The most common progression in pop music: **I - V - vi - IV** (C - G - Am - F). It appears in hundreds of hits from "Let It Be" to "Someone Like You."

Music theory treats chord progressions like sentence structures — certain chords naturally "want" to move to others. V → I is the strongest resolution (called a "perfect cadence"), like the period at the end of a sentence.`,
      analogy: 'Chords are like colors mixed from primary components. A major chord is warm sunlight; a minor chord is a blue shadow. A chord progression is a color palette applied across a painting — it sets the overall mood. The I-V-vi-IV progression is the "sunset palette" of music: warm, then bright, then bittersweet, then resolved.',
      storyConnection: 'When the Dimasa court musicians accompanied singers, they discovered that certain combinations of notes beneath a melody made it more powerful. They didn\'t name them "chords," but they knew that a deep drone (the root), a bright middle note (the third), and a resonant upper note (the fifth) together created something greater than the sum.',
      checkQuestion: 'Why does the I-V-vi-IV progression sound satisfying even though it includes a minor chord (vi)?',
      checkAnswer: 'The vi chord (Am in C major) shares two notes with both the I (C) and IV (F) chords, so it feels connected rather than jarring. It introduces a moment of sadness or longing before the IV chord resolves back toward warmth. The progression creates a tension-release cycle: stable (I) → expectant (V) → poignant (vi) → warm resolution (IV).',
      codeIntro: 'Visualize common chord progressions and their frequency components.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Define notes and chords in C major
note_freqs = {
    'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23,
    'G': 392.00, 'A': 440.00, 'B': 493.88
}

# Common progressions
progressions = {
    'I-V-vi-IV (Pop)': [('C','E','G'), ('G','B','D'), ('A','C','E'), ('F','A','C')],
    'I-IV-V-I (Blues)': [('C','E','G'), ('F','A','C'), ('G','B','D'), ('C','E','G')],
    'vi-IV-I-V (Emotional)': [('A','C','E'), ('F','A','C'), ('C','E','G'), ('G','B','D')],
    'I-vi-IV-V (50s)': [('C','E','G'), ('A','C','E'), ('F','A','C'), ('G','B','D')],
}

prog_labels = {
    'I-V-vi-IV (Pop)': ['I (C)', 'V (G)', 'vi (Am)', 'IV (F)'],
    'I-IV-V-I (Blues)': ['I (C)', 'IV (F)', 'V (G)', 'I (C)'],
    'vi-IV-I-V (Emotional)': ['vi (Am)', 'IV (F)', 'I (C)', 'V (G)'],
    'I-vi-IV-V (50s)': ['I (C)', 'vi (Am)', 'IV (F)', 'V (G)'],
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Common Chord Progressions in C Major', color='white', fontsize=14)

chord_colors = {'C': '#22c55e', 'D': '#3b82f6', 'E': '#f59e0b',
                'F': '#ef4444', 'G': '#a855f7', 'A': '#ec4899', 'B': '#06b6d4'}

for idx, (name, chords) in enumerate(progressions.items()):
    ax = axes[idx // 2][idx % 2]
    ax.set_facecolor('#111827')
    labels = prog_labels[name]

    for chord_idx, (chord, label) in enumerate(zip(chords, labels)):
        for note_idx, note in enumerate(chord):
            freq = note_freqs[note]
            ax.barh(chord_idx, freq, left=note_idx*500, height=0.3,
                   color=chord_colors[note], alpha=0.8)
            ax.text(note_idx*500 + freq/2, chord_idx, f'{note} ({freq:.0f}Hz)',
                   ha='center', va='center', color='white', fontsize=7)

    ax.set_yticks(range(4))
    ax.set_yticklabels(labels, color='white', fontsize=9)
    ax.set_title(name, color='white', fontsize=11)
    ax.set_xticks([])
    ax.tick_params(colors='gray')
    ax.invert_yaxis()

plt.tight_layout()
plt.show()

print("The 4 most common chord progressions:")
for name in progressions:
    print(f"  {name}")
print()
print("I-V-vi-IV alone appears in:")
print("  Let It Be, Someone Like You, No Woman No Cry,")
print("  With or Without You, Under the Bridge, and hundreds more.")
print()
print("These progressions work because of tension and resolution.")
print("V → I is the strongest resolution in Western harmony.")`,
      challenge: 'Create a "Dimasa" progression using notes from a pentatonic scale (C, D, E, G, A). Build 3-note chords from only these notes. How do they differ from standard major/minor chords?',
      successHint: 'Chord progressions are the grammar of music. Just as you can write infinite sentences with grammar rules, you can write infinite songs with chord progressions. The rules describe what sounds natural — breaking them creates surprise.',
    },
    {
      title: 'Music generation with code — algorithmic composition',
      concept: `**Algorithmic composition** uses rules, randomness, and computation to generate music. This is not new — Mozart composed a "Dice Game" (Musikalisches Wurfelspiel) in 1787, where dice rolls selected pre-composed measures to create unique compositions.

Modern algorithmic approaches:
- **Rule-based**: encode music theory rules (stay in key, resolve dissonance) and let the computer make choices within those constraints
- **Markov chains**: analyze existing music to learn transition probabilities (if the current note is C, there's a 30% chance the next is G)
- **L-systems**: recursive rules that generate self-similar patterns (fractal music)
- **Neural networks**: train on thousands of songs to learn musical patterns, then generate new ones

The simplest approach is a **random walk on a scale**: start on a note, then move up or down by a random interval. Add constraints (stay within an octave, prefer small intervals, resolve to the root note at the end) and it starts to sound musical.

Key insight: **music is constrained randomness**. Total randomness sounds like noise. Total predictability sounds boring. The sweet spot — surprising but logical — is what we call "musical."`,
      analogy: 'Algorithmic composition is like a "choose your own adventure" book. The author (programmer) designs the possible paths and branch points (rules). The reader (algorithm) makes choices at each branch. No two readings are identical, but every path tells a coherent story.',
      storyConnection: 'The Dimasa tradition had rules: certain melodic patterns for harvest songs, certain rhythmic patterns for ceremonies. Within these rules, musicians improvised — each performance unique, all recognizably Dimasa. Algorithmic composition does the same thing: rules define the tradition, randomness creates the individual expression.',
      checkQuestion: 'If you generate a melody by picking notes completely at random from all 12 semitones, it will sound terrible. Why? And what is the minimum constraint you need to add to make it sound more musical?',
      checkAnswer: 'Random notes from all 12 semitones include many dissonant intervals (minor seconds, tritones). The minimum useful constraint is to restrict to a scale (e.g., pentatonic — just 5 notes). Since the pentatonic scale has no semitone intervals, nearly any combination of its notes sounds acceptable.',
      codeIntro: 'Generate a random melody using a constrained random walk on a pentatonic scale.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Pentatonic scale degrees (in semitones from root)
pentatonic = [0, 2, 4, 7, 9]  # C D E G A
scale_notes = []
for octave in range(3):
    for note in pentatonic:
        scale_notes.append(note + octave * 12)

note_names_full = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

# Generate melody via constrained random walk
n_notes = 32
melody = [len(scale_notes) // 2]  # start in the middle

for i in range(n_notes - 1):
    step = np.random.choice([-2, -1, 0, 1, 2], p=[0.1, 0.25, 0.15, 0.3, 0.2])
    next_idx = np.clip(melody[-1] + step, 0, len(scale_notes) - 1)
    melody.append(next_idx)

# Resolve to root at the end
melody[-1] = scale_notes.index(0) if 0 in scale_notes else 0

melody_semitones = [scale_notes[i] for i in melody]
melody_freqs = [261.63 * 2**(s/12) for s in melody_semitones]
melody_names = [note_names_full[s % 12] + str(4 + s//12) for s in melody_semitones]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Piano roll style
ax1.set_facecolor('#111827')
for i, (semi, name) in enumerate(zip(melody_semitones, melody_names)):
    color = '#22c55e' if i != len(melody_semitones)-1 else '#f59e0b'
    ax1.bar(i, 1, bottom=semi-0.5, color=color, edgecolor='none', alpha=0.8)
    if i % 4 == 0:
        ax1.text(i, semi + 1, name, color='white', fontsize=7, ha='center')

ax1.set_xlabel('Beat', color='white')
ax1.set_ylabel('Semitones from C4', color='white')
ax1.set_title('Generated Melody (Pentatonic Random Walk)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Mark measure boundaries
for m in range(0, n_notes, 4):
    ax1.axvline(m - 0.5, color='#4b5563', linewidth=0.5, linestyle='--')

# Interval histogram
intervals = [melody_semitones[i+1] - melody_semitones[i] for i in range(len(melody_semitones)-1)]
ax2.set_facecolor('#111827')
unique_intervals = sorted(set(intervals))
counts = [intervals.count(iv) for iv in unique_intervals]
bar_colors = ['#22c55e' if abs(iv) <= 2 else '#f59e0b' if abs(iv) <= 4 else '#ef4444' for iv in unique_intervals]
ax2.bar(unique_intervals, counts, color=bar_colors, edgecolor='none')
ax2.set_xlabel('Interval (semitones)', color='white')
ax2.set_ylabel('Count', color='white')
ax2.set_title('Interval Distribution (small steps preferred)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Generated {n_notes} notes on C pentatonic scale")
print(f"Melody: {' '.join(melody_names[:16])}")
print(f"         {' '.join(melody_names[16:])}")
print(f"\\\nInterval stats: mean={np.mean(intervals):.1f}, std={np.std(intervals):.1f}")
print("Small intervals dominate → stepwise motion → sounds melodic")`,
      challenge: 'Add a rhythm component: assign each note a random duration (quarter note = 1, eighth note = 0.5, half note = 2). Plot the melody as a time series (x = cumulative time, y = pitch). Does varying rhythm make it sound more or less musical?',
      successHint: 'Algorithmic composition is the intersection of computer science, music theory, and creativity. Every generated melody follows the same physics and mathematics that the Dimasa musicians used intuitively — but now the "musician" is code.',
    },
    {
      title: 'Audio visualization — seeing sound',
      concept: `Audio visualization turns sound into images, revealing structure invisible to the ear. The three most important visualizations:

**1. Waveform**: amplitude over time. Shows the raw shape of the sound wave. Useful for seeing volume, duration, and general envelope.

**2. Spectrum (FFT)**: frequency content at a single moment. Uses the **Fast Fourier Transform** to decompose a complex wave into its component frequencies. Shows which pitches are present and their relative strengths.

**3. Spectrogram**: frequency content over time. It's a spectrum taken at many consecutive moments, displayed as a heatmap (x = time, y = frequency, color = intensity). This is the most powerful visualization — it shows how the frequency content of sound changes over time.

Spectrograms reveal:
- **Speech patterns**: vowels show as horizontal bands (formants); consonants show as noise bursts
- **Musical instruments**: each instrument has a unique spectral "fingerprint" (timbre)
- **Bird songs**: species identification from spectrogram patterns
- **Environmental sound**: rain, wind, traffic — each has a distinct spectrogram signature

The Dimasa drum's spectrogram would show a broad burst of frequencies on each strike, with the fundamental as the strongest band and overtones fading above it.`,
      analogy: 'A waveform is like a photograph — it shows exactly what something looks like at the surface. A spectrum is like an X-ray — it shows the hidden structure underneath. A spectrogram is like an MRI movie — it shows the hidden structure changing over time. Each reveals a deeper layer of the same sound.',
      storyConnection: 'The Dimasa musicians could hear the difference between a drum struck at the center and one struck at the edge. A spectrogram makes that difference visible: center strikes show a strong fundamental with few overtones; edge strikes show a broad spread of higher frequencies. Science makes audible knowledge visible.',
      checkQuestion: 'Why does a piano and a flute playing the same note (say A4 = 440 Hz) sound different, even though they have the same fundamental frequency?',
      checkAnswer: 'They differ in their **overtone content** (also called timbre or tone color). A piano string vibrates at 440 Hz but also at 880, 1320, 1760 Hz, etc. — the harmonics. A flute produces fewer and weaker harmonics. The spectrum (FFT) of each instrument at A4 would show 440 Hz as the tallest peak, but the relative heights of the overtone peaks would be completely different.',
      codeIntro: 'Generate a synthetic sound signal and visualize it as waveform, spectrum, and spectrogram.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate a signal: A4 (440Hz) + harmonics (simulating a Dimasa drum strike)
sr = 44100  # sample rate
duration = 0.5  # seconds
t = np.linspace(0, duration, int(sr * duration), endpoint=False)

# Drum-like signal: fundamental + decaying harmonics
fundamental = 150  # Hz (low drum)
signal = np.zeros_like(t)
harmonics = [1, 2.14, 3.5, 4.2, 5.1]  # drum-like non-integer ratios
amplitudes = [1.0, 0.6, 0.3, 0.15, 0.08]
decays = [5, 8, 12, 15, 20]

for h, a, d in zip(harmonics, amplitudes, decays):
    signal += a * np.exp(-d * t) * np.sin(2 * np.pi * fundamental * h * t)

# Add a sharp attack
attack = np.exp(-50 * t) * np.random.randn(len(t)) * 0.3
signal += attack
signal = signal / np.max(np.abs(signal))

fig, axes = plt.subplots(3, 1, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Audio Visualization: Three Views of a Drum Strike', color='white', fontsize=14)

# 1. Waveform
ax1 = axes[0]
ax1.set_facecolor('#111827')
ax1.plot(t * 1000, signal, color='#22c55e', linewidth=0.5)
ax1.set_xlabel('Time (ms)', color='white')
ax1.set_ylabel('Amplitude', color='white')
ax1.set_title('Waveform (amplitude over time)', color='white', fontsize=11)
ax1.tick_params(colors='gray')

# 2. Spectrum (FFT of first 50ms)
ax2 = axes[1]
ax2.set_facecolor('#111827')
window = signal[:int(sr * 0.05)]  # first 50ms
fft_vals = np.abs(np.fft.rfft(window))
fft_freqs = np.fft.rfftfreq(len(window), 1/sr)
mask = fft_freqs < 2000  # show up to 2kHz
ax2.plot(fft_freqs[mask], fft_vals[mask], color='#3b82f6', linewidth=1)
ax2.fill_between(fft_freqs[mask], fft_vals[mask], alpha=0.2, color='#3b82f6')

# Mark harmonics
for h, label_h in zip(harmonics[:3], ['Fund.', '2nd', '3rd']):
    freq = fundamental * h
    ax2.axvline(freq, color='#f59e0b', linestyle=':', alpha=0.7)
    ax2.text(freq, max(fft_vals[mask]) * 0.9, f'{label_h}\\\n{freq:.0f}Hz',
            color='#f59e0b', fontsize=8, ha='center')

ax2.set_xlabel('Frequency (Hz)', color='white')
ax2.set_ylabel('Magnitude', color='white')
ax2.set_title('Spectrum (frequency content at attack)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# 3. Spectrogram
ax3 = axes[2]
ax3.set_facecolor('#111827')
spec = ax3.specgram(signal, NFFT=512, Fs=sr, noverlap=480, cmap='inferno',
                     vmin=-80, vmax=0)
ax3.set_ylim(0, 2000)
ax3.set_xlabel('Time (s)', color='white')
ax3.set_ylabel('Frequency (Hz)', color='white')
ax3.set_title('Spectrogram (frequency over time)', color='white', fontsize=11)
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Three views of the same drum strike:")
print("  Waveform: sharp attack, exponential decay")
print("  Spectrum: multiple peaks at non-integer ratios (drum physics)")
print("  Spectrogram: high frequencies fade first, fundamental persists")
print()
print("Unlike string instruments, drum harmonics are NOT integer multiples.")
print("This is why drums have less clear pitch than strings.")`,
      challenge: 'Modify the signal to simulate a string instrument instead: change the harmonics to integer multiples [1, 2, 3, 4, 5] and use slower decay rates. Compare the spectrogram to the drum. Which has cleaner horizontal lines?',
      successHint: 'Audio visualization is the bridge between hearing and understanding. From Level 1\'s rhythm grids to Level 2\'s spectrograms, you now have both the musical intuition and the computational tools to analyze any sound. The Dimasa kingdom\'s music lives on — not just as memory, but as data.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 music theory foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for digital music and audio simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
