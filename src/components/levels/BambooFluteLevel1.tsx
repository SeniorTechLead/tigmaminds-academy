import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BambooFluteLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is sound — vibrations traveling through air',
      concept: `Deep in the Naga hills, a boy named Liyo carved his first bamboo flute and blew across its edge. What came out was not magic — it was **sound**. But what exactly is sound?

Sound is a **pressure wave** — a pattern of compressed and stretched air molecules traveling outward from a vibrating source. When Liyo blew across the flute's edge, the air inside the bamboo tube vibrated. Those vibrations pushed against the air molecules nearby, which pushed against the next molecules, and so on, creating a wave that traveled through the forest until it reached someone's ear.

The key properties of any sound wave are:
- **Amplitude**: how much the air pressure changes (loudness)
- **Frequency**: how many pressure cycles happen per second (pitch)
- **Wavelength**: the physical distance between two identical points in the wave
- **Speed**: in air at sea level, about 343 meters per second — roughly 1 km every 3 seconds

Sound needs a medium to travel through. It works in air, water, and solids, but not in a vacuum. In space, no one can hear Liyo's flute.`,
      analogy: 'Imagine a row of dominoes standing on a table. When you push the first one, the push travels down the line — but the dominoes themselves don\'t fly across the room. Sound works the same way: individual air molecules just vibrate back and forth in place. It\'s the disturbance — the push — that travels, not the air itself.',
      storyConnection: 'When Liyo played his bamboo flute in the forest clearing, the sound traveled outward in all directions at 343 m/s. Birds 100 meters away heard it about 0.3 seconds later. The forest itself changed the sound — trees reflected it, leaves absorbed high frequencies, and the damp air carried low frequencies farther. His flute sang differently on misty mornings than on dry afternoons.',
      checkQuestion: 'Sound travels faster in water (~1500 m/s) than in air (~343 m/s). Why?',
      checkAnswer: 'Water molecules are much closer together than air molecules. When one molecule is pushed, the next one is already right there to receive the push. The denser the medium, the faster the pressure wave can propagate. In steel, sound travels at ~6000 m/s because the atoms are packed even tighter.',
      codeIntro: 'Visualize a sound wave as a pressure pattern traveling through air.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a simple sound wave visualization
time = np.linspace(0, 0.01, 1000)  # 10 milliseconds
frequency = 440  # Hz (A4 note — concert tuning)

# Sound wave: pressure variation over time
amplitude = 1.0
wave = amplitude * np.sin(2 * np.pi * frequency * time)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')

# Pressure wave over time
ax1.set_facecolor('#111827')
ax1.plot(time * 1000, wave, color='#22c55e', linewidth=2)
ax1.axhline(0, color='gray', linewidth=0.5, linestyle='--')
ax1.set_xlabel('Time (milliseconds)', color='white')
ax1.set_ylabel('Air pressure\\\n(relative)', color='white')
ax1.set_title('Sound Wave: A4 note (440 Hz)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Mark one wavelength
period = 1 / frequency
ax1.annotate('', xy=(period * 1000, 0.8), xytext=(0, 0.8),
            arrowprops=dict(arrowstyle='<->', color='#f59e0b', lw=2))
ax1.text(period * 1000 / 2, 0.9, f'1 period = {period*1000:.2f} ms',
         color='#f59e0b', ha='center', fontsize=10)

# Compare loud vs quiet
ax2.set_facecolor('#111827')
loud = 1.0 * np.sin(2 * np.pi * frequency * time)
quiet = 0.3 * np.sin(2 * np.pi * frequency * time)
ax2.plot(time * 1000, loud, color='#ef4444', linewidth=2, label='Loud (high amplitude)')
ax2.plot(time * 1000, quiet, color='#3b82f6', linewidth=2, label='Quiet (low amplitude)')
ax2.axhline(0, color='gray', linewidth=0.5, linestyle='--')
ax2.set_xlabel('Time (milliseconds)', color='white')
ax2.set_ylabel('Air pressure\\\n(relative)', color='white')
ax2.set_title('Same pitch, different loudness', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sound wave properties:")
print(f"  Frequency: {frequency} Hz (cycles per second)")
print(f"  Period: {period*1000:.2f} ms (time for one cycle)")
print(f"  Wavelength in air: {343/frequency:.2f} meters")
print(f"  Speed in air: 343 m/s")
print(f"  Speed in water: ~1500 m/s")
print(f"  Speed in steel: ~6000 m/s")`,
      challenge: 'Change the frequency from 440 Hz to 220 Hz (one octave lower). How does the wave look different? How does the wavelength change?',
      successHint: 'You have just visualized the most fundamental concept in acoustics: sound is a pressure wave. Every musical note, every voice, every forest sound is just air molecules vibrating at different frequencies and amplitudes.',
    },
    {
      title: 'Frequency and pitch — high frequency, high pitch',
      concept: `When Liyo carved shorter flutes, they played higher notes. When he carved longer ones, the notes were deeper. He was discovering the relationship between **frequency** and **pitch** without knowing any physics.

**Frequency** is the number of complete vibration cycles per second, measured in **Hertz (Hz)**. One Hz means one cycle per second. The human ear can hear roughly 20 Hz to 20,000 Hz. Below 20 Hz is infrasound (elephants use it); above 20,000 Hz is ultrasound (bats and dolphins use it).

**Pitch** is the perceptual quality of frequency — it is how our brain interprets frequency. Higher frequency = higher pitch. But the relationship is not perfectly linear. Our ears perceive pitch on a **logarithmic** scale: doubling the frequency raises the pitch by one **octave** (A4 = 440 Hz, A5 = 880 Hz, A3 = 220 Hz).

Some reference frequencies:
- Lowest piano key: ~27.5 Hz
- Middle C: ~261.6 Hz
- Concert A: 440 Hz
- Highest piano key: ~4186 Hz
- Human speech: roughly 85–255 Hz (fundamental)`,
      analogy: 'Frequency is like the speed of a jump rope. Swing it slowly and it makes big, lazy arcs (low frequency, low pitch). Swing it fast and it makes tight, rapid arcs (high frequency, high pitch). The rope is always the same length — only the speed of oscillation changes. Your ear is the friend at the other end, feeling how fast the rope shakes.',
      storyConnection: 'Liyo noticed that his shortest flute, barely a hand-span long, produced a bright, piercing note that cut through the forest canopy. His longest flute, as tall as his forearm, produced a warm, low tone that seemed to make the ground hum. Without rulers or tuning forks, he was mapping frequency to tube length — the same discovery the ancient Greeks made with stretched strings.',
      checkQuestion: 'If concert A is 440 Hz and each octave doubles the frequency, what frequency is A two octaves above concert A?',
      checkAnswer: 'A5 = 440 x 2 = 880 Hz. A6 = 880 x 2 = 1760 Hz. Two octaves above concert A is 1760 Hz. Each octave is a doubling, so n octaves up multiplies by 2^n.',
      codeIntro: 'Plot several musical frequencies to see and hear the difference between low and high pitch.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Compare different musical notes
time = np.linspace(0, 0.015, 2000)  # 15 milliseconds

notes = {
    'C4 (261.6 Hz)': 261.6,
    'E4 (329.6 Hz)': 329.6,
    'G4 (392.0 Hz)': 392.0,
    'C5 (523.3 Hz)': 523.3,
}
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

fig, axes = plt.subplots(4, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

for ax, (name, freq), color in zip(axes, notes.items(), colors):
    ax.set_facecolor('#111827')
    wave = np.sin(2 * np.pi * freq * time)
    ax.plot(time * 1000, wave, color=color, linewidth=2)
    ax.axhline(0, color='gray', linewidth=0.5, linestyle='--')
    ax.set_ylabel(name, color=color, fontsize=10, rotation=0, labelpad=100)
    ax.set_ylim(-1.3, 1.3)
    ax.tick_params(colors='gray')

    # Count visible cycles
    cycles = freq * 0.015
    ax.text(14.5, 0.8, f'{cycles:.1f} cycles', color=color, fontsize=9, ha='right')

axes[-1].set_xlabel('Time (milliseconds)', color='white')
axes[0].set_title('C Major Chord: same time window, different frequencies', color='white', fontsize=13)

plt.tight_layout()
plt.show()

# Frequency table for one octave
print("Chromatic scale from C4 to C5:")
note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C5']
c4 = 261.63
for i, name in enumerate(note_names):
    freq = c4 * (2 ** (i / 12))
    print(f"  {name:3s} = {freq:7.2f} Hz")
print()
print("Notice: each semitone multiplies by 2^(1/12) ≈ 1.0595")
print("12 semitones = 1 octave = frequency × 2")`,
      challenge: 'Add A4 (440 Hz) to the plot. Then compute the frequency ratio between each adjacent note in the chromatic scale. What pattern do you see?',
      successHint: 'The equal-tempered chromatic scale divides the octave into 12 equal steps on a logarithmic scale. This mathematical structure underlies all Western music — and it started with people like Liyo noticing that shorter tubes make higher notes.',
    },
    {
      title: 'Resonance — why tubes of different lengths produce different notes',
      concept: `Liyo learned that a bamboo tube of a certain length would naturally "prefer" certain notes. Blow into a tube and it does not produce all frequencies equally — it **resonates** at specific frequencies determined by its length.

**Resonance** occurs when a vibrating system is driven at its **natural frequency**. At resonance, small inputs produce large outputs. The bamboo tube acts as a resonating chamber: air bounces back and forth inside, and if the tube length matches the wavelength of the sound wave, the reflections reinforce each other.

For a tube open at both ends (like a basic bamboo flute):
- The fundamental frequency: **f = v / (2L)** where v is the speed of sound and L is the tube length
- A 34.3 cm tube resonates at 500 Hz (343 / (2 × 0.343))
- A 68.6 cm tube resonates at 250 Hz — half the frequency, one octave lower

This is why Liyo's shorter flutes were higher-pitched. The physics is inescapable: shorter tube = shorter wavelength = higher frequency = higher pitch.

Resonance is not just about music. It is how bridges can collapse in wind (Tacoma Narrows, 1940), how radio tuners select stations, and how MRI machines image your body.`,
      analogy: 'Resonance is like pushing a child on a swing. Push at the right moment (the natural frequency) and the swing goes higher and higher with each push. Push at the wrong time and the swing barely moves — or even slows down. A bamboo tube is like a swing for air: only certain frequencies get "pushed" at the right time to build up into a loud sound.',
      storyConnection: 'Liyo collected bamboo stalks of different lengths from the hillside and blew across each one. Some sang clearly; others just hissed. The ones that sang had lengths that matched a resonant frequency — the air column inside was exactly right for a standing wave to form. He was selecting for resonance without knowing the word.',
      checkQuestion: 'A bamboo flute tube is 30 cm long and open at both ends. What is its fundamental frequency? (Speed of sound = 343 m/s)',
      checkAnswer: 'f = v / (2L) = 343 / (2 × 0.30) = 343 / 0.60 = 571.7 Hz. That is roughly between D5 and D#5 on the musical scale. To get middle C (261.6 Hz), you would need a tube about 65.6 cm long.',
      codeIntro: 'Calculate and visualize resonant frequencies for bamboo tubes of different lengths.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Speed of sound in air
v = 343  # m/s

# Bamboo tube lengths (in cm, converted to meters)
lengths_cm = np.array([15, 20, 25, 30, 35, 40, 45, 50, 55, 60])
lengths_m = lengths_cm / 100

# Fundamental frequency for tube open at both ends: f = v / (2L)
fundamentals = v / (2 * lengths_m)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Frequency vs length
ax1.set_facecolor('#111827')
ax1.plot(lengths_cm, fundamentals, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax1.set_xlabel('Tube length (cm)', color='white')
ax1.set_ylabel('Fundamental frequency (Hz)', color='white')
ax1.set_title('Shorter tube = Higher pitch', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Annotate a few
for l, f in zip(lengths_cm[::3], fundamentals[::3]):
    ax1.annotate(f'{f:.0f} Hz', xy=(l, f), xytext=(l+2, f+50),
                color='#f59e0b', fontsize=9,
                arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Standing wave visualization for one tube
ax2.set_facecolor('#111827')
L = 0.30  # 30 cm tube
x = np.linspace(0, L, 500)

# First 4 harmonics of open-open tube
for n in range(1, 5):
    freq = n * v / (2 * L)
    standing_wave = np.sin(n * np.pi * x / L)
    offset = (n - 1) * 2.5
    ax2.plot(x * 100, standing_wave + offset, color=['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'][n-1],
             linewidth=2, label=f'n={n}: {freq:.0f} Hz')
    ax2.axhline(offset, color='gray', linewidth=0.3, linestyle='--')

ax2.set_xlabel('Position along tube (cm)', color='white')
ax2.set_title('Standing waves in a 30 cm tube', color='white', fontsize=13)
ax2.set_yticks([])
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Draw tube walls
ax2.axvline(0, color='white', linewidth=2)
ax2.axvline(30, color='white', linewidth=2)

plt.tight_layout()
plt.show()

print("Resonant frequencies for a 30 cm open tube:")
for n in range(1, 7):
    freq = n * v / (2 * 0.30)
    print(f"  Harmonic {n}: {freq:.1f} Hz")
print()
print("Each harmonic is a whole number multiple of the fundamental.")
print("This is why resonance produces musical (not noisy) sounds.")`,
      challenge: 'A flute player covers one end of the tube (closed-open tube). The formula changes to f = v / (4L) and only odd harmonics exist. Modify the code for a closed tube. How does the fundamental change?',
      successHint: 'Resonance is the reason musical instruments work. Without it, a bamboo tube would just be a noisy air channel. Resonance selects and amplifies specific frequencies, turning noise into music.',
    },
    {
      title: 'Harmonics — why a flute sounds different from a drum',
      concept: `Liyo noticed something puzzling: when he played the same note on his bamboo flute and his friend struck a drum tuned to the same pitch, they sounded completely different. Same frequency, same loudness — but unmistakably different. Why?

The answer is **harmonics** (also called overtones). When any instrument plays a note, it does not produce just one frequency. It produces a **fundamental frequency** (the note you hear as the pitch) plus a series of higher frequencies called harmonics. The pattern of which harmonics are present and how loud each one is creates the instrument's **timbre** — its unique sonic fingerprint.

- **Flute**: strong fundamental, weak upper harmonics — a pure, clear tone
- **Violin**: rich mix of many harmonics — warm, complex tone
- **Clarinet**: only odd harmonics (1st, 3rd, 5th...) — hollow, woody tone
- **Drum**: non-harmonic overtones (not neat multiples) — noisy, percussive

A bamboo flute, being an open tube, produces all integer harmonics (1st, 2nd, 3rd, 4th...) but the fundamental dominates. This gives it that characteristic pure, breathy sound Liyo loved.`,
      analogy: 'Harmonics are like the ingredients in a recipe. Two dishes can use the same base ingredient (same fundamental frequency) but taste completely different because of the spices (different harmonic content). A flute is plain rice — simple and clean. A violin is biryani — rich with many layered flavors. Same rice, different dish.',
      storyConnection: 'The village elder told Liyo that his bamboo flute "spoke with the voice of the wind." Scientifically, this is poetic but accurate — a flute\'s sound is close to a pure sine wave, which is the simplest possible waveform. Wind blowing across a hollow reed produces a similar near-pure tone. Liyo\'s flute mimicked the forest\'s own acoustic signature.',
      checkQuestion: 'A clarinet (closed tube) only produces odd harmonics: 1st, 3rd, 5th, 7th... If the fundamental is 200 Hz, what are the first four harmonics?',
      checkAnswer: '1st harmonic (fundamental): 200 Hz. 3rd harmonic: 600 Hz. 5th harmonic: 1000 Hz. 7th harmonic: 1400 Hz. Notice the missing even harmonics (400, 800, 1200 Hz). This is because one end is closed, so only odd-numbered standing waves can form — the closed end must be a node and the open end must be an antinode.',
      codeIntro: 'Build different instrument tones by mixing harmonics and compare their waveforms.',
      code: `import numpy as np
import matplotlib.pyplot as plt

time = np.linspace(0, 0.01, 2000)  # 10 ms
f0 = 440  # A4 fundamental

# Define instruments by their harmonic content (relative amplitudes)
instruments = {
    'Bamboo Flute': {1: 1.0, 2: 0.15, 3: 0.05, 4: 0.02},
    'Violin': {1: 1.0, 2: 0.8, 3: 0.6, 4: 0.5, 5: 0.3, 6: 0.2, 7: 0.1, 8: 0.05},
    'Clarinet': {1: 1.0, 3: 0.75, 5: 0.5, 7: 0.25, 9: 0.12},
    'Pure Sine': {1: 1.0},
}
colors = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7']

fig, axes = plt.subplots(4, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

for ax, (name, harmonics), color in zip(axes, instruments.items(), colors):
    ax.set_facecolor('#111827')

    # Build waveform by adding harmonics
    wave = np.zeros_like(time)
    for n, amp in harmonics.items():
        wave += amp * np.sin(2 * np.pi * n * f0 * time)

    # Normalize
    wave = wave / np.max(np.abs(wave))

    ax.plot(time * 1000, wave, color=color, linewidth=1.5)
    ax.axhline(0, color='gray', linewidth=0.3, linestyle='--')
    ax.set_ylabel(name, color=color, fontsize=10, rotation=0, labelpad=90)
    ax.set_ylim(-1.3, 1.3)
    ax.tick_params(colors='gray')

    # Show harmonic count
    ax.text(9.8, 0.9, f'{len(harmonics)} harmonics', color=color, fontsize=9, ha='right')

axes[-1].set_xlabel('Time (milliseconds)', color='white')
axes[0].set_title('Same pitch (A4 = 440 Hz), different timbre', color='white', fontsize=13)

plt.tight_layout()
plt.show()

print("Harmonic content determines timbre:")
for name, harmonics in instruments.items():
    present = ', '.join([f'H{n}' for n in harmonics.keys()])
    print(f"  {name:15s}: {present}")
print()
print("Flute: mostly fundamental → pure, breathy")
print("Violin: many harmonics → rich, warm")
print("Clarinet: odd only → hollow, woody")
print("Pure sine: just H1 → electronic, artificial")`,
      challenge: 'Create a "bright trumpet" sound by making all harmonics equally loud: {1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.0}. What does the waveform look like? (Hint: equal harmonics produce something close to a sawtooth wave.)',
      successHint: 'Timbre is what makes music emotionally rich. A flute sounds peaceful, a violin sounds passionate, a drum sounds powerful — all because of different harmonic recipes. Liyo\'s bamboo flute carried the purity of the forest in its simple harmonic profile.',
    },
    {
      title: 'The physics of bamboo flutes — tube length, holes, and standing waves',
      concept: `Now we can understand exactly how Liyo's flute works. A bamboo flute is an air column with finger holes drilled along its length. The physics involves three interconnected ideas:

**1. The air column sets the fundamental pitch.** The effective length of the vibrating air column determines the lowest note. A longer column = lower pitch.

**2. Finger holes shorten the effective air column.** When Liyo lifts a finger off a hole, air escapes at that point, effectively shortening the vibrating column. The closer the open hole is to the mouthpiece, the shorter the effective column, the higher the pitch.

**3. Overblowing excites higher harmonics.** By blowing harder and tightening his lips, Liyo can make the flute "jump" to the second harmonic (an octave higher) or the third (an octave plus a fifth). This is how a six-hole flute can play more than six notes.

The placement of finger holes follows precise mathematical ratios. In traditional Naga flute-making, these ratios were learned by apprenticeship — but they correspond exactly to the frequency ratios of the musical scale. Craft knowledge and physics arrived at the same answer through different paths.`,
      analogy: 'A bamboo flute is like a ruler hanging off the edge of a desk. Flick it and it vibrates. Push it further off the edge (longer vibrating section) and it vibrates more slowly, producing a lower tone. Push it back (shorter section) and it vibrates faster, higher. Finger holes on a flute do the same thing — they change how much of the air column is "hanging off the edge."',
      storyConnection: 'Liyo\'s grandfather taught him the finger spacings by measuring with knuckle-widths — the distance from each hole to the next was a specific number of finger-breadths. This traditional knowledge encoded the mathematical ratios of the musical scale in human anatomy. When Liyo played a scale, he was translating physics through generations of craft wisdom into forest songs.',
      checkQuestion: 'A flute has its lowest hole 80% of the way from the mouthpiece to the end. When this hole is open, what is the effective length of the air column as a fraction of the total tube length?',
      checkAnswer: 'About 80% of the total tube length. The open hole acts roughly as the new "end" of the tube, so the effective vibrating length is the distance from the mouthpiece to the first open hole. This means the frequency increases by a factor of 1/0.80 = 1.25, which is a major third interval.',
      codeIntro: 'Model a bamboo flute with finger holes and calculate the note each fingering produces.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v = 343  # speed of sound in m/s

# Bamboo flute dimensions
total_length = 0.40  # 40 cm tube
hole_positions = [0.58, 0.64, 0.70, 0.76, 0.82, 0.88]  # fraction from mouthpiece

# Calculate effective length and frequency for each fingering
# All holes closed = full length
fingerings = ['All closed']
eff_lengths = [total_length]
freqs = [v / (2 * total_length)]

# Opening holes from bottom (nearest to end) up
for i in range(len(hole_positions)):
    idx = len(hole_positions) - 1 - i
    eff_len = total_length * hole_positions[idx]
    fingerings.append(f'Hole {idx+1} open')
    eff_lengths.append(eff_len)
    freqs.append(v / (2 * eff_len))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')

# Visualize the flute with holes
ax1.set_facecolor('#111827')
# Draw tube
ax1.barh(0, total_length * 100, height=3, color='#92400e', edgecolor='#78350f', linewidth=2)
# Draw holes
for i, pos in enumerate(hole_positions):
    ax1.plot(pos * total_length * 100, 0, 'o', color='#111827', markersize=12)
    ax1.text(pos * total_length * 100, 2.5, f'H{i+1}', color='#f59e0b', fontsize=8, ha='center')
# Mouthpiece
ax1.plot(1, 0, 's', color='#22c55e', markersize=15)
ax1.text(1, 2.5, 'Mouth', color='#22c55e', fontsize=8, ha='center')
ax1.set_xlim(-2, 45)
ax1.set_ylim(-5, 5)
ax1.set_xlabel('Position (cm)', color='white')
ax1.set_title("Liyo's Bamboo Flute (40 cm)", color='white', fontsize=13)
ax1.set_yticks([])
ax1.tick_params(colors='gray')

# Frequency for each fingering
ax2.set_facecolor('#111827')
bars = ax2.barh(range(len(fingerings)), freqs, color='#22c55e', edgecolor='none', alpha=0.8)
ax2.set_yticks(range(len(fingerings)))
ax2.set_yticklabels(fingerings, color='white', fontsize=9)
ax2.set_xlabel('Frequency (Hz)', color='white')
ax2.set_title('Notes produced by each fingering', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, f in zip(bars, freqs):
    ax2.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2,
             f'{f:.1f} Hz', color='#f59e0b', fontsize=9, va='center')

plt.tight_layout()
plt.show()

print("Flute fingering chart:")
print(f"{'Fingering':<20s} {'Eff. length (cm)':<18s} {'Frequency (Hz)':<15s}")
print("-" * 53)
for fing, eff, f in zip(fingerings, eff_lengths, freqs):
    print(f"{fing:<20s} {eff*100:<18.1f} {f:<15.1f}")
print()
print(f"Range: {min(freqs):.1f} Hz to {max(freqs):.1f} Hz")
print(f"That's {max(freqs)/min(freqs):.2f}x — about {12*np.log2(max(freqs)/min(freqs)):.1f} semitones")`,
      challenge: 'Add overblowing: multiply each frequency by 2 (second harmonic). How many total notes can the flute play now? Real flute players combine fingerings with overblowing to get 2-3 octaves from 6 holes.',
      successHint: 'A six-hole bamboo flute, one of the simplest instruments ever made, encodes the physics of resonance, standing waves, and harmonic series in a piece of carved bamboo. Liyo learned all of this through his fingers before anyone taught him the equations.',
    },
    {
      title: 'Music and math — scales, octaves, and frequency ratios',
      concept: `Music is mathematics made audible. Every musical scale is built from **frequency ratios** — simple mathematical relationships between notes that our ears perceive as harmonious.

The most important ratio is the **octave**: a 2:1 frequency ratio. A4 = 440 Hz, A5 = 880 Hz. Your brain perceives these as "the same note, but higher." This is universal across all human cultures.

The next most important ratio is the **perfect fifth**: a 3:2 ratio. From A (440 Hz) to E (660 Hz). This interval sounds powerfully consonant — stable and resolved.

Ancient scale systems were built by stacking fifths:
- Start at C, go up a fifth to G, up a fifth to D, to A, to E, to B...
- After 12 fifths, you almost (but not quite) return to C — this is the **Pythagorean comma**, a tiny discrepancy that haunted music theory for 2000 years.

Modern Western music "solves" this with **equal temperament**: divide the octave into 12 exactly equal steps, each a ratio of 2^(1/12) = 1.05946... This makes every key sound equally in-tune (or equally slightly out-of-tune). It is a mathematical compromise that enabled Bach, Beethoven, and every pop song you have ever heard.`,
      analogy: 'Music theory is like a map projection. The globe (pure mathematical ratios) cannot be perfectly flattened onto paper (a 12-note keyboard) without distortion. Equal temperament is the Mercator projection of music: it distorts everything slightly, but it is consistent and practical enough to navigate the entire world of music.',
      storyConnection: 'Liyo\'s traditional Naga scales were not equal-tempered — they used the pure ratios his ears preferred. His flute\'s finger holes were placed to produce perfect fifths and perfect fourths, the ratios that rang true in the forest. When a visiting music teacher tried to tune Liyo\'s flute to a piano, some notes had to shift slightly. The forest scale and the concert scale were two maps of the same territory.',
      checkQuestion: 'Why does a chord made of frequencies in simple ratios (like 4:5:6, a major triad) sound "pleasant," while random frequency combinations sound "harsh"?',
      checkAnswer: 'Simple ratios mean the waveforms align periodically — they create a combined wave that repeats regularly, which the brain processes easily. Complex ratios create irregular combined waves that never quite repeat, which the auditory system interprets as roughness or dissonance. "Pleasant" is literally "easy to process."',
      codeIntro: 'Explore the mathematics of musical scales — compare pure ratios, Pythagorean tuning, and equal temperament.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Three tuning systems compared
note_names = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C\'']

# Just intonation (pure ratios)
just_ratios = [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2]

# Pythagorean (stacking 3:2 fifths)
pyth_ratios = [1, 9/8, 81/64, 4/3, 3/2, 27/16, 243/128, 2]

# Equal temperament (12-TET)
equal_semitones = [0, 2, 4, 5, 7, 9, 11, 12]
equal_ratios = [2 ** (s/12) for s in equal_semitones]

# Base frequency
f0 = 261.63  # C4

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')

# Compare tuning systems
ax1.set_facecolor('#111827')
x = np.arange(len(note_names))
width = 0.25

just_cents = [1200 * np.log2(r) for r in just_ratios]
pyth_cents = [1200 * np.log2(r) for r in pyth_ratios]
equal_cents = [1200 * np.log2(r) for r in equal_ratios]

# Show deviation from equal temperament (in cents)
just_dev = [j - e for j, e in zip(just_cents, equal_cents)]
pyth_dev = [p - e for p, e in zip(pyth_cents, equal_cents)]

ax1.bar(x - width/2, just_dev, width, color='#22c55e', label='Just intonation', alpha=0.8)
ax1.bar(x + width/2, pyth_dev, width, color='#f59e0b', label='Pythagorean', alpha=0.8)
ax1.axhline(0, color='#3b82f6', linewidth=2, label='Equal temperament (reference)')
ax1.set_xticks(x)
ax1.set_xticklabels(note_names, color='white')
ax1.set_ylabel('Deviation from equal temp. (cents)', color='white')
ax1.set_title('Tuning systems compared (0 = equal temperament)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Consonance: show waveform combinations
ax2.set_facecolor('#111827')
t = np.linspace(0, 0.02, 2000)

# Perfect fifth (3:2 ratio) — consonant
fifth = np.sin(2 * np.pi * f0 * t) + np.sin(2 * np.pi * f0 * 3/2 * t)
# Tritone (sqrt(2) ratio) — dissonant
tritone = np.sin(2 * np.pi * f0 * t) + np.sin(2 * np.pi * f0 * np.sqrt(2) * t)

ax2.plot(t * 1000, fifth / 2 + 1.5, color='#22c55e', linewidth=1.5, label='Perfect 5th (3:2) — consonant')
ax2.plot(t * 1000, tritone / 2 - 1.5, color='#ef4444', linewidth=1.5, label='Tritone (√2:1) — dissonant')
ax2.axhline(1.5, color='gray', linewidth=0.3, linestyle='--')
ax2.axhline(-1.5, color='gray', linewidth=0.3, linestyle='--')
ax2.set_xlabel('Time (milliseconds)', color='white')
ax2.set_title('Consonance vs. dissonance: simple vs. complex ratios', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.set_yticks([])
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Frequency ratios that sound consonant:")
intervals = [('Unison', '1:1'), ('Octave', '2:1'), ('Perfect 5th', '3:2'),
             ('Perfect 4th', '4:3'), ('Major 3rd', '5:4'), ('Minor 3rd', '6:5')]
for name, ratio in intervals:
    print(f"  {name:<15s} {ratio}")
print()
print("Equal temperament approximates these ratios:")
print(f"  Perfect 5th: 3/2 = 1.5000 vs 2^(7/12) = {2**(7/12):.4f}")
print(f"  Major 3rd:   5/4 = 1.2500 vs 2^(4/12) = {2**(4/12):.4f}")
print(f"  The differences are tiny — but trained ears can hear them.")`,
      challenge: 'The Pythagorean comma: stack 12 perfect fifths (multiply by 3/2 twelve times) and compare with 7 octaves (multiply by 2 seven times). How big is the gap? Express it in cents (1200 * log2(ratio)).',
      successHint: 'Music is where physics meets perception meets culture. The mathematics of frequency ratios is universal; the choice of which ratios to use in a scale is cultural. Liyo\'s Naga forest scale and a concert pianist\'s equal-tempered scale are both valid maps of the same mathematical landscape. Level 2 takes these ideas into code — building actual sound from numbers.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Acoustics & Sound — no prior physics experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for sound and wave simulations. Click to start.</p>
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
