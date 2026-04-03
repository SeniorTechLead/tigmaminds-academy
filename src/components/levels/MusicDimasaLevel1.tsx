import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MusicDimasaLevel1() {
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
      title: 'Rhythm and beats — the heartbeat of music',
      concept: `In the Dimasa kingdom, music was born when a young drummer noticed that the rhythm of rain on the palace roof matched the beating of his own heart. **Rhythm** is the pattern of sounds and silences in time, and the **beat** is the basic unit — the steady pulse that listeners tap their feet to.

Music divides time into equal segments called **beats**. When you clap along to a song, you're tracking the beat. Beats are grouped into **measures** (or bars), and the number of beats per measure defines the **time signature**.

Key concepts:
- **Beat**: the basic pulse of the music
- **Tempo**: how fast or slow the beats come (measured in BPM — beats per minute)
- **Rhythm**: the pattern of long and short sounds layered on top of the beat
- **Rest**: silence that occupies a beat (rests are as important as sounds)

A human resting heart beats at about 60-80 BPM. Most pop music sits around 120 BPM. Dimasa folk drumming often uses complex polyrhythms where multiple rhythmic patterns overlap.`,
      analogy: 'A beat is like the ticking of a clock — steady, predictable, always there. Rhythm is what you do on top of that ticking: sometimes you speak on the tick, sometimes between ticks, sometimes you pause. The clock (beat) keeps going regardless.',
      storyConnection: 'The Dimasa drummer discovered that the rhythm of rain was not random — it had a pulse, an underlying regularity. This is exactly what musicians do: they find the beat in nature and build patterns on top of it. The palace roof was the first drum.',
      checkQuestion: 'If a song has a tempo of 120 BPM and uses 4/4 time (4 beats per measure), how many measures pass in one minute?',
      checkAnswer: '30 measures. At 120 BPM, you get 120 beats per minute. With 4 beats per measure, that is 120 / 4 = 30 measures per minute. This is why most pop songs at 120 BPM feel "medium" paced — 2 measures per second.',
      codeIntro: 'Visualize a simple rhythmic pattern as a beat grid.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Define a 4/4 rhythm pattern over 2 measures (8 beats)
# 1 = hit, 0 = rest
kick =  [1, 0, 0, 0, 1, 0, 0, 0]  # bass drum on beats 1, 5
snare = [0, 0, 1, 0, 0, 0, 1, 0]  # snare on beats 3, 7
hihat = [1, 1, 1, 1, 1, 1, 1, 1]  # hi-hat on every beat

beats = np.arange(1, 9)

fig, ax = plt.subplots(figsize=(10, 4))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

instruments = [('Hi-hat', hihat, '#f59e0b'), ('Snare', snare, '#3b82f6'), ('Kick', kick, '#ef4444')]
for idx, (name, pattern, color) in enumerate(instruments):
    for beat_i, val in enumerate(pattern):
        if val:
            ax.scatter(beats[beat_i], idx, s=300, color=color, zorder=5)
        else:
            ax.scatter(beats[beat_i], idx, s=100, color='#374151', zorder=5)

ax.set_yticks([0, 1, 2])
ax.set_yticklabels(['Kick', 'Snare', 'Hi-hat'], color='white', fontsize=11)
ax.set_xticks(beats)
ax.set_xticklabels([f'Beat {b}' for b in beats], color='white', fontsize=9)
ax.set_xlabel('Time (beats)', color='white')
ax.set_title('Basic 4/4 Rock Beat Pattern (2 measures)', color='white', fontsize=13)
ax.tick_params(colors='gray')

# Mark measure boundaries
ax.axvline(4.5, color='#6b7280', linestyle='--', linewidth=1, alpha=0.5)
ax.text(2.5, 2.5, 'Measure 1', color='#9ca3af', ha='center', fontsize=10)
ax.text(6.5, 2.5, 'Measure 2', color='#9ca3af', ha='center', fontsize=10)

ax.set_xlim(0.5, 8.5)
ax.set_ylim(-0.5, 3)
plt.tight_layout()
plt.show()

print("Basic 4/4 beat pattern:")
print("  Kick drum:  beats 1 and 5 (downbeats)")
print("  Snare drum: beats 3 and 7 (backbeats)")
print("  Hi-hat:     every beat (steady pulse)")
print()
print("This is the most common drum pattern in rock and pop music.")
print("At 120 BPM, each beat lasts 0.5 seconds.")`,
      challenge: 'Modify the pattern to create a syncopated rhythm: move the kick to beats 1, 4, and 6 instead. How does the visual pattern change? Syncopation means accenting the "off" beats.',
      successHint: 'Every piece of music, from Dimasa folk drums to electronic dance music, starts with a beat pattern. Understanding rhythm as a grid of on/off values is the first step to both music theory and digital music production.',
    },
    {
      title: 'Tempo and time signatures — the speed and shape of music',
      concept: `**Tempo** is how fast the beats arrive, measured in **BPM** (beats per minute). A lullaby might be 60 BPM (one beat per second). A fast dance track might be 160 BPM.

**Time signatures** tell you how beats are grouped. The two numbers mean:
- **Top number**: how many beats per measure
- **Bottom number**: which note value gets one beat (4 = quarter note)

Common time signatures:
- **4/4** (four-four): 4 beats per measure — most pop, rock, and folk music
- **3/4** (three-four): 3 beats per measure — waltzes, some ballads
- **6/8** (six-eight): 6 eighth-note beats per measure — creates a lilting, swinging feel
- **7/8** (seven-eight): 7 beats — common in Balkan and some Indian folk music

Dimasa music often uses complex rhythmic cycles that don't fit neatly into Western time signatures. The **khram** (Dimasa drum) can maintain patterns in 5, 7, or even 11 beats — cycles that feel natural once you internalize them.`,
      analogy: 'Tempo is the speed of your footsteps while walking. Time signature is the pattern of your steps — are you walking in a steady left-right (2/4), a waltz-step left-right-right (3/4), or a march left-right-left-right (4/4)? Same speed, different groupings.',
      storyConnection: 'The Dimasa musicians discovered that different tempos evoked different emotions. Slow, deep drumming summoned reverence. Fast rhythms brought joy and dance. The kingdom learned that the speed of music could change the mood of an entire gathering.',
      checkQuestion: 'A piece in 3/4 time at 90 BPM has 24 measures. How long does the piece last in seconds?',
      checkAnswer: '48 seconds. Each measure has 3 beats, so 24 measures = 72 beats total. At 90 BPM, each beat lasts 60/90 = 0.667 seconds. Total time = 72 x 0.667 = 48 seconds.',
      codeIntro: 'Plot how different tempos feel by visualizing the timing of beats over a few seconds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Show beat patterns at different tempos over 4 seconds
tempos = [60, 90, 120, 160]
labels = ['60 BPM (Largo)', '90 BPM (Andante)', '120 BPM (Allegro)', '160 BPM (Presto)']
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
duration = 4  # seconds

fig, axes = plt.subplots(4, 1, figsize=(10, 6), sharex=True)
fig.patch.set_facecolor('#1f2937')

for idx, (tempo, label, color) in enumerate(zip(tempos, labels, colors)):
    ax = axes[idx]
    ax.set_facecolor('#111827')

    beat_interval = 60.0 / tempo  # seconds between beats
    beat_times = np.arange(0, duration, beat_interval)

    ax.vlines(beat_times, 0, 1, color=color, linewidth=3)
    ax.set_ylabel(label, color='white', fontsize=8, rotation=0, labelpad=100, va='center')
    ax.set_ylim(0, 1)
    ax.set_yticks([])
    ax.tick_params(colors='gray')
    ax.text(duration + 0.1, 0.5, f'{len(beat_times)} beats', color=color, fontsize=9, va='center')

axes[-1].set_xlabel('Time (seconds)', color='white')
axes[0].set_title('Beat Spacing at Different Tempos (4 seconds)', color='white', fontsize=13)
plt.tight_layout()
plt.show()

print("Tempo and feel:")
print("  60 BPM  — 1 beat/sec — calm, meditative (resting heart rate)")
print("  90 BPM  — 1.5 beats/sec — walking pace")
print("  120 BPM — 2 beats/sec — energetic, danceable")
print("  160 BPM — 2.67 beats/sec — fast, exciting, breathless")
print()
print("Your brain naturally prefers tempos close to your heart rate.")
print("That's why 120 BPM feels 'right' for exercise — it matches elevated heart rate.")`,
      challenge: 'Add a 5th tempo of 72 BPM (Dimasa ceremonial drumming). How does its spacing compare to the others? Then try 7/8 time — mark every 7th beat with a different color.',
      successHint: 'Tempo is measured in BPM, but experienced as emotion. Slow tempos feel serious or sad; fast tempos feel happy or urgent. Understanding this connection between math and feeling is what separates a musician from a metronome.',
    },
    {
      title: 'Melody basics — intervals and the distance between notes',
      concept: `A **melody** is a sequence of musical notes played one after another. What makes one melody different from another? The **intervals** — the distance between consecutive notes.

An **interval** is the gap between two pitches, measured in **semitones** (the smallest step on a piano — one key to the next). Common intervals:
- **Unison** (0 semitones): same note repeated
- **Minor second** (1 semitone): tense, dissonant (theme from *Jaws*)
- **Major second** (2 semitones): the first step in a scale
- **Perfect fifth** (7 semitones): strong, stable (*Twinkle Twinkle* opening)
- **Octave** (12 semitones): same note, doubled in frequency

Every melody in the world is just a sequence of intervals. The Dimasa musicians discovered that certain intervals sounded pleasing together (**consonant**) while others created tension (**dissonant**). This was the birth of melody in the kingdom.

The frequency ratio between notes determines whether they sound consonant:
- Octave: 2:1 (most consonant)
- Perfect fifth: 3:2
- Perfect fourth: 4:3
- These simple ratios are why these intervals sound "good" — they are deeply rooted in physics.`,
      analogy: 'If rhythm is the footsteps, melody is the path you walk. Two different walks might have the same steps-per-minute (same rhythm) but take you to completely different places (different melodies). The intervals are the direction changes — left turn, right turn, straight ahead.',
      storyConnection: 'When the first Dimasa flute player carved a bamboo tube with holes at specific spacings, each hole produced a different pitch. The distances between the holes — and thus between the pitches — were the intervals that defined the melody. The tube\'s physics dictated what sounded beautiful.',
      checkQuestion: 'If a note has a frequency of 440 Hz (the note A4), what frequency is one octave above? What about one perfect fifth above?',
      checkAnswer: 'One octave above = 880 Hz (multiply by 2). One perfect fifth above = 660 Hz (multiply by 3/2 = 1.5). These simple frequency ratios are why octaves and fifths sound so natural to the human ear.',
      codeIntro: 'Visualize common musical intervals as frequency ratios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Musical intervals and their frequency ratios
intervals = [
    ('Unison', 1, 1/1),
    ('Minor 2nd', 1, 16/15),
    ('Major 2nd', 2, 9/8),
    ('Minor 3rd', 3, 6/5),
    ('Major 3rd', 4, 5/4),
    ('Perfect 4th', 5, 4/3),
    ('Tritone', 6, 45/32),
    ('Perfect 5th', 7, 3/2),
    ('Minor 6th', 8, 8/5),
    ('Major 6th', 9, 5/3),
    ('Minor 7th', 10, 9/5),
    ('Major 7th', 11, 15/8),
    ('Octave', 12, 2/1),
]

names = [i[0] for i in intervals]
semitones = [i[1] for i in intervals]
ratios = [i[2] for i in intervals]

# Consonance: simple ratios are more consonant
# Measure complexity as sum of numerator + denominator
from fractions import Fraction
complexity = []
for r in ratios:
    frac = Fraction(r).limit_denominator(100)
    complexity.append(frac.numerator + frac.denominator)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')

# Frequency ratios
ax1.set_facecolor('#111827')
colors_bar = ['#22c55e' if c <= 5 else '#f59e0b' if c <= 10 else '#ef4444' for c in complexity]
bars = ax1.bar(names, ratios, color=colors_bar, edgecolor='none')
ax1.set_ylabel('Frequency ratio', color='white')
ax1.set_title('Musical Intervals: Frequency Ratios', color='white', fontsize=13)
ax1.tick_params(colors='gray')
plt.setp(ax1.get_xticklabels(), rotation=45, ha='right', fontsize=8, color='white')

# Consonance (lower = more consonant)
ax2.set_facecolor('#111827')
ax2.bar(names, complexity, color=colors_bar, edgecolor='none')
ax2.set_ylabel('Complexity (lower = more consonant)', color='white')
ax2.set_title('Interval Consonance (simple ratios sound "better")', color='white', fontsize=13)
ax2.tick_params(colors='gray')
plt.setp(ax2.get_xticklabels(), rotation=45, ha='right', fontsize=8, color='white')

plt.tight_layout()
plt.show()

print("Most consonant intervals (simplest ratios):")
print("  Unison  1:1  — same note")
print("  Octave  2:1  — doubled frequency")
print("  Perf 5th 3:2 — the 'power chord' interval")
print()
print("Most dissonant:")
print("  Tritone  45:32 — historically called 'the devil in music'")
print("  Minor 2nd 16:15 — tense, clashing")`,
      challenge: 'Play a melody by plotting two sine waves: one at 440 Hz and another at 440 * 3/2 = 660 Hz (a perfect fifth). Then try 440 and 440 * 16/15 (minor second). Overlay them and see the difference in the combined waveforms.',
      successHint: 'Music theory and physics meet at intervals. The reason a perfect fifth sounds "right" is pure mathematics: the 3:2 frequency ratio means the wave peaks align regularly. Dissonance happens when peaks rarely align, creating a "beating" pattern.',
    },
    {
      title: 'Musical scales — organizing notes into families',
      concept: `A **scale** is a set of notes arranged in order from low to high. Different scales create different moods and are the foundation of melody and harmony in every musical tradition.

The **major scale** uses this pattern of intervals (in semitones): 2-2-1-2-2-2-1. Starting from C: C-D-E-F-G-A-B-C. It sounds bright, happy, and resolved.

The **minor scale** uses: 2-1-2-2-1-2-2. Starting from A: A-B-C-D-E-F-G-A. It sounds darker, sadder, or more mysterious.

The **pentatonic scale** uses only 5 notes (instead of 7). Pattern: 2-2-3-2-3. It's found in folk music worldwide — from Dimasa songs to Chinese classical music to blues. It works everywhere because it avoids the most dissonant intervals.

Indian classical music uses **ragas** — scales with specific ascending and descending patterns, associated with times of day, seasons, and emotions. Northeast Indian music has its own modal systems that share characteristics with both South Asian and Southeast Asian scales.

Every culture independently discovered similar patterns because the physics of sound is universal.`,
      analogy: 'A scale is like a color palette. A painter doesn\'t use every color at once — they choose a set of colors that work well together. The major scale is a bright, sunny palette. The minor scale is moody and dramatic. The pentatonic scale is a minimal palette that works for almost any painting.',
      storyConnection: 'The Dimasa kingdom\'s musicians organized their melodies into specific scales for different occasions. Harvest celebrations used bright, ascending patterns. Mourning songs used descending, minor-like scales. The choice of scale told the listener what kind of story was being told before a single word was sung.',
      checkQuestion: 'The pentatonic scale appears in folk music across Africa, Asia, Europe, and the Americas. These cultures had no contact with each other. Why did they all independently arrive at the same 5-note scale?',
      checkAnswer: 'The pentatonic scale consists of intervals that form the simplest frequency ratios (no semitone steps, no tritones). It avoids all strongly dissonant intervals. Since the physics of vibration is universal and human ears are built the same way everywhere, every culture converged on the same mathematically "cleanest" set of notes.',
      codeIntro: 'Visualize the frequency structure of different musical scales.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Define scales as semitone steps from the root note
scales = {
    'Major': [0, 2, 4, 5, 7, 9, 11, 12],
    'Natural Minor': [0, 2, 3, 5, 7, 8, 10, 12],
    'Pentatonic Major': [0, 2, 4, 7, 9, 12],
    'Blues': [0, 3, 5, 6, 7, 10, 12],
}

root_freq = 261.63  # C4

note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C5']
colors_scale = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Musical Scales: Note Frequencies', color='white', fontsize=14)

for idx, (name, semitones) in enumerate(scales.items()):
    ax = axes[idx // 2][idx % 2]
    ax.set_facecolor('#111827')

    freqs = [root_freq * (2 ** (s / 12)) for s in semitones]
    notes = [note_names[s] for s in semitones]

    color = colors_scale[idx]
    bars = ax.bar(range(len(freqs)), freqs, color=color, alpha=0.8, edgecolor='none')

    for i, (freq, note) in enumerate(zip(freqs, notes)):
        ax.text(i, freq + 10, f'{note}\\n{freq:.0f}Hz', ha='center', color='white', fontsize=7)

    ax.set_title(f'{name} Scale', color='white', fontsize=11)
    ax.set_ylabel('Frequency (Hz)', color='white', fontsize=9)
    ax.set_xticks([])
    ax.tick_params(colors='gray')
    ax.set_ylim(0, 600)

plt.tight_layout()
plt.show()

print("Scale structures (semitone gaps):")
for name, semitones in scales.items():
    gaps = [semitones[i+1] - semitones[i] for i in range(len(semitones)-1)]
    print(f"  {name:20s}: {gaps}")
print()
print("Notice: Pentatonic has no 1-semitone steps.")
print("This is why it sounds 'safe' — no dissonant clashes.")`,
      challenge: 'Create a Dimasa-inspired scale by choosing any 5-7 notes from the 12 semitones. Plot it alongside the major scale. What mood does your scale evoke?',
      successHint: 'Scales are the vocabulary of music. Just as learning words lets you form sentences, learning scales lets you understand (and create) melodies. Every genre of music is built on specific scale choices.',
    },
    {
      title: 'Vibration and pitch — why strings and drums make sound',
      concept: `All sound is **vibration**. When a drum skin vibrates, it pushes air molecules back and forth, creating pressure waves that travel to your ear. Your eardrum vibrates in sympathy, and your brain interprets this as sound.

**Pitch** is determined by **frequency** — how many times per second the source vibrates. Frequency is measured in **Hertz (Hz)**: 1 Hz = 1 vibration per second.

Key relationships:
- Human hearing range: 20 Hz to 20,000 Hz
- A4 (concert pitch): 440 Hz
- Shorter/tighter/thinner strings vibrate faster → higher pitch
- Larger drums vibrate slower → lower pitch

For a vibrating string, frequency depends on:
- **Length (L)**: halve the length → double the frequency (one octave up)
- **Tension (T)**: more tension → higher frequency
- **Mass (m)**: lighter string → higher frequency

Formula: **f = (1/2L) × sqrt(T/m)**

This is why a guitar has different string thicknesses and why pressing a fret (shortening the string) raises the pitch. The Dimasa **khram** drum produces different pitches by varying the drum head tension and striking different areas of the skin.`,
      analogy: 'A vibrating string is like a jump rope. Swing it slowly and it makes big, lazy waves (low pitch). Swing it fast and it makes tight, rapid waves (high pitch). Tighten the rope and it moves faster (higher pitch). Use a heavier rope and it moves slower (lower pitch). Same physics, different scales.',
      storyConnection: 'The Dimasa musicians learned to control pitch by tightening drum heads with leather straps and carving bamboo flutes at specific lengths. Each adjustment changed the frequency of vibration. They were doing physics without equations — tuning by ear alone, arriving at the same mathematical relationships that scientists would formalize centuries later.',
      checkQuestion: 'A string on a Dimasa instrument is 60 cm long and produces a note at 300 Hz. If you press it at the midpoint (30 cm), what frequency does it produce?',
      checkAnswer: '600 Hz. Halving the length doubles the frequency (inversely proportional). The new note is exactly one octave above the original. This is why the 12th fret on a guitar (the halfway point) always produces a note one octave higher.',
      codeIntro: 'Model how string length, tension, and mass affect vibration frequency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# String vibration: f = (1 / 2L) * sqrt(T / mu)
# L = length, T = tension, mu = linear mass density

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('What Controls Pitch? String Vibration Physics', color='white', fontsize=14)

# 1. Frequency vs Length
ax1 = axes[0]
ax1.set_facecolor('#111827')
lengths = np.linspace(0.1, 1.0, 50)  # meters
T, mu = 100, 0.001  # tension in N, linear density kg/m
freq_L = (1 / (2 * lengths)) * np.sqrt(T / mu)
ax1.plot(lengths * 100, freq_L, color='#22c55e', linewidth=2)
ax1.set_xlabel('String length (cm)', color='white')
ax1.set_ylabel('Frequency (Hz)', color='white')
ax1.set_title('Shorter = Higher pitch', color='white', fontsize=11)
ax1.tick_params(colors='gray')
ax1.fill_between(lengths * 100, freq_L, alpha=0.1, color='#22c55e')

# 2. Frequency vs Tension
ax2 = axes[1]
ax2.set_facecolor('#111827')
tensions = np.linspace(10, 200, 50)  # Newtons
L, mu2 = 0.5, 0.001
freq_T = (1 / (2 * L)) * np.sqrt(tensions / mu2)
ax2.plot(tensions, freq_T, color='#3b82f6', linewidth=2)
ax2.set_xlabel('Tension (N)', color='white')
ax2.set_ylabel('Frequency (Hz)', color='white')
ax2.set_title('Tighter = Higher pitch', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.fill_between(tensions, freq_T, alpha=0.1, color='#3b82f6')

# 3. Frequency vs Mass density
ax3 = axes[2]
ax3.set_facecolor('#111827')
masses = np.linspace(0.0005, 0.005, 50)
L3, T3 = 0.5, 100
freq_m = (1 / (2 * L3)) * np.sqrt(T3 / masses)
ax3.plot(masses * 1000, freq_m, color='#f59e0b', linewidth=2)
ax3.set_xlabel('String mass density (g/m)', color='white')
ax3.set_ylabel('Frequency (Hz)', color='white')
ax3.set_title('Heavier = Lower pitch', color='white', fontsize=11)
ax3.tick_params(colors='gray')
ax3.fill_between(masses * 1000, freq_m, alpha=0.1, color='#f59e0b')

plt.tight_layout()
plt.show()

print("String vibration: f = (1/2L) * sqrt(T/mu)")
print()
print("Three ways to change pitch:")
print("  1. Shorten the string → higher pitch (inverse)")
print("  2. Increase tension  → higher pitch (square root)")
print("  3. Use lighter string → higher pitch (inverse square root)")
print()
print("Guitar frets shorten the string (method 1).")
print("Tuning pegs change tension (method 2).")
print("Different strings have different thickness (method 3).")`,
      challenge: 'A Dimasa khram drum has a skin diameter of 30 cm. Model it as a circular membrane. How does the diameter affect the fundamental frequency? (Hint: for a drum, f is proportional to 1/diameter.)',
      successHint: 'The physics of vibration is the bridge between music and science. Every instrument — from a bamboo flute to a grand piano — obeys these same equations. The Dimasa musicians mastered these relationships by ear; we now understand them through math.',
    },
    {
      title: 'The physics of drums — vibration modes and overtones',
      concept: `A drum is not a simple instrument. When you strike a drum head, it vibrates in multiple patterns simultaneously. These patterns are called **vibration modes** or **harmonics**.

The simplest mode is the **fundamental** — the whole drum head moves up and down as one unit. This produces the lowest pitch.

Higher modes create complex patterns:
- **Mode (0,1)**: the whole head bounces — the fundamental
- **Mode (1,1)**: the head splits into two halves vibrating opposite directions
- **Mode (2,1)**: the head splits into four quadrants
- **Mode (0,2)**: a ring pattern with the center and edge moving opposite

Unlike strings (where harmonics are simple multiples of the fundamental), **drum harmonics are not evenly spaced**. This is why drums produce less clear pitches than strings or wind instruments.

The Dimasa **khram** drum can produce different modes depending on where you strike it:
- Center strike → emphasizes the fundamental (deep, boomy)
- Off-center strike → emphasizes higher modes (brighter, more attack)
- Edge strike → mostly high frequencies (sharp, cracking sound)`,
      analogy: 'Vibration modes are like ripples in a pond. Drop one stone and you get circular waves (fundamental mode). Drop two stones and the ripples interact, creating complex patterns of peaks and valleys. A drum head does the same thing — every strike creates a unique combination of ripple patterns.',
      storyConnection: 'The master drummer in the Dimasa court could produce a dozen different tones from a single drum by varying where and how hard they struck. They were intuitively controlling which vibration modes dominated — selecting the physics of the sound through technique alone. Each mode told a different part of the story.',
      checkQuestion: 'Why does a kettle drum (timpani) have a clearer pitch than a snare drum? Both are struck drums.',
      checkAnswer: 'A timpani has a large, smooth, uniformly tensioned head mounted over a resonating bowl. The bowl reinforces the fundamental and suppresses dissonant higher modes. A snare drum has wires (snares) against the bottom head that rattle, adding noise and high-frequency content that masks the fundamental pitch.',
      codeIntro: 'Visualize the vibration modes of a circular drum head.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib import cm

# Drum head vibration modes using Bessel-like approximation
# Mode (m, n): m = angular nodes, n = radial nodes

fig, axes = plt.subplots(2, 3, figsize=(14, 8), subplot_kw={'projection': 'polar'})
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Drum Head Vibration Modes', color='white', fontsize=14, y=1.02)

r = np.linspace(0, 1, 50)
theta = np.linspace(0, 2 * np.pi, 100)
R, Theta = np.meshgrid(r, theta)

# Approximate mode shapes (simplified Bessel patterns)
modes = [
    ((0, 1), 'Mode (0,1) — Fundamental', np.cos(np.pi * R / 2)),
    ((1, 1), 'Mode (1,1) — First overtone', np.cos(Theta) * np.cos(np.pi * R / 2)),
    ((2, 1), 'Mode (2,1) — Second overtone', np.cos(2 * Theta) * np.cos(np.pi * R / 2)),
    ((0, 2), 'Mode (0,2) — Ring mode', np.cos(np.pi * R)),
    ((3, 1), 'Mode (3,1) — Third overtone', np.cos(3 * Theta) * np.cos(np.pi * R / 2)),
    ((1, 2), 'Mode (1,2) — Complex', np.cos(Theta) * np.cos(np.pi * R)),
]

for idx, ((m, n), title, Z) in enumerate(modes):
    ax = axes[idx // 3][idx % 3]
    ax.set_facecolor('#111827')
    c = ax.pcolormesh(Theta, R, Z, cmap='RdBu', shading='auto', vmin=-1, vmax=1)
    ax.set_title(title, color='white', fontsize=9, pad=10)
    ax.set_yticks([])
    ax.set_xticks([])

plt.tight_layout()
plt.show()

print("Drum vibration modes:")
print("  (0,1): Whole head moves together — deepest tone")
print("  (1,1): Two halves, opposite phase — first overtone")
print("  (2,1): Four quadrants — second overtone")
print("  (0,2): Ring pattern — a 'ping' sound")
print()
print("Striking the center emphasizes (0,1) — the bass tone.")
print("Striking off-center emphasizes higher modes — brighter sound.")
print("A skilled drummer controls which modes dominate by touch.")`,
      challenge: 'Real drum modes use Bessel functions. The frequency ratios for a circular membrane are: 1.00, 1.59, 2.14, 2.30, 2.65, 2.92 (compared to 1, 2, 3, 4, 5, 6 for a string). Plot both series on the same chart. Why do strings sound more "musical" than drums?',
      successHint: 'From rhythm to tempo to melody to scales to vibrations to drum physics — you have covered the fundamentals of how music works, grounded in the story of the Dimasa kingdom. Level 2 takes these principles into the digital world.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior music theory experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for music and physics simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
