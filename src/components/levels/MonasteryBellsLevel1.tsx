import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import BellSoundWaveDiagram from '../diagrams/BellSoundWaveDiagram';
import BellFrequencyDiagram from '../diagrams/BellFrequencyDiagram';
import BellHarmonicsDiagram from '../diagrams/BellHarmonicsDiagram';
import BellFourierDiagram from '../diagrams/BellFourierDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import ActivityBellStrikeDiagram from '../diagrams/ActivityBellStrikeDiagram';

export default function MonasteryBellsLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Your first sound wave — plotting a sine wave',
      concept: `In Level 0 you learned that sound is a pressure wave — air molecules being pushed together (compression) and pulled apart (rarefaction), over and over. The simplest possible sound wave is a **sine wave**: a perfectly smooth, repeating curve.

We will use two Python libraries:
- **NumPy** (\`np\`) — creates arrays of numbers
- **Matplotlib** (\`plt\`) — draws charts

The code below creates a pure 440 Hz sine wave (the musical note A4, used to tune orchestras worldwide). The key line is:

\`y = np.sin(2 * np.pi * frequency * t)\`

This says: at every point in time \`t\`, calculate the sine of (2π × frequency × t). The result is a wave that oscillates between +1 and −1, exactly \`frequency\` times per second.

📚 *New to NumPy? Open the Reference Library for a full guide.*`,
      analogy: 'Think of a swing in a playground. Push it once and it swings back and forth at a steady rate — that rate is its natural frequency. A sine wave is the mathematical description of that back-and-forth motion. The height of the swing at any moment traces out a sine curve over time.',
      storyConnection: 'Dr. Lhamo’s software displayed the bell’s sound as a waveform on screen. That wiggly line is exactly what you are about to plot — pressure variations over time. The pure sine wave is the simplest building block; real bell sounds are made by adding many of these together.',
      checkQuestion: 'If you change the frequency from 440 to 880, what happens to the wave on the plot?',
      checkAnswer: 'The wave oscillates twice as fast — you see twice as many peaks in the same time window. 880 Hz is exactly one octave above 440 Hz. Doubling the frequency always raises the pitch by one octave.',
      codeIntro: 'Generate and plot a pure 440 Hz sine wave — the simplest possible sound.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# A pure 440 Hz tone (the note A4)
frequency = 440  # Hz (vibrations per second)
duration = 0.01  # seconds (10 milliseconds — enough to see a few cycles)

# Create time array: 10,000 points over 0.01 seconds
t = np.linspace(0, duration, 10000)

# The sine wave formula: y = sin(2π × f × t)
y = np.sin(2 * np.pi * frequency * t)

# Plot it
plt.figure(figsize=(10, 4))
plt.plot(t * 1000, y, linewidth=2, color='royalblue')  # t*1000 converts to ms
plt.xlabel('Time (milliseconds)', fontsize=12)
plt.ylabel('Pressure (relative)', fontsize=12)
plt.title(f'Pure Sine Wave at {frequency} Hz', fontsize=14)
plt.grid(alpha=0.3)
plt.axhline(0, color='white', linewidth=0.5, alpha=0.3)
plt.show()

cycles = frequency * duration
print(f"Frequency: {frequency} Hz")
print(f"In {duration*1000} ms, you see {cycles:.1f} complete cycles")
print(f"Wavelength: {343/frequency:.2f} m (speed of sound / frequency)")`,
      challenge: 'Plot a 200 Hz wave and an 800 Hz wave on the same graph (use different colours). Which has more cycles in 10 ms? Calculate the wavelength of each.',
      successHint: 'You just created the building block of ALL sound. Every bell ring, every voice, every piece of music can be constructed by adding sine waves of different frequencies together. That is the core insight of Fourier analysis.',
    },
    {
      title: 'Frequency and pitch — why big bells sound low',
      concept: `The story tells us that Dr. Lhamo tapped eight bells, from smallest to largest, and each produced a lower pitch. Let’s see why with numbers.

A bell’s fundamental frequency depends on its **size**, **thickness**, and **material**. For a simple vibrating object, frequency is roughly inversely proportional to size: **double the diameter, halve the frequency**.

The code below simulates the eight monastery bells. Each is a different size, and we calculate and plot its fundamental frequency. You will see the inverse relationship clearly: as diameter increases, frequency decreases.

The key formula: \`f ∝ 1/D\` (frequency is proportional to 1 divided by diameter). This is why a double bass sounds lower than a violin, why a tuba sounds lower than a trumpet, and why the largest monastery bell has the deepest voice.`,
      analogy: 'Imagine swinging a short rope versus a long rope. The short rope whips back and forth quickly (high frequency). The long rope lumbers slowly (low frequency). A bell’s rim is like a curved rope — a larger rim takes longer to complete one vibration cycle, so it vibrates at a lower frequency.',
      storyConnection: 'The eight bells in the prayer hall form a scale from high to low. Ancient bell-makers tuned them by adjusting diameter and thickness — empirically discovering the same inverse relationship that the formula f ∝ 1/D describes. The monks did not know the equation, but they knew the physics in their ears.',
      checkQuestion: 'Bell A has a diameter of 30 cm and rings at 800 Hz. Bell B has a diameter of 60 cm (double). What is Bell B’s approximate frequency?',
      checkAnswer: 'About 400 Hz. Doubling the diameter roughly halves the frequency (f ∝ 1/D). This is an approximation — thickness and material also matter — but it captures the dominant relationship.',
      codeIntro: 'Calculate and plot how frequency changes with bell size.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Tawang monastery's 8 bells (approximate diameters in cm)
bell_names = ['Bell 1', 'Bell 2', 'Bell 3', 'Bell 4',
              'Bell 5', 'Bell 6', 'Bell 7', 'Bell 8']
diameters = np.array([15, 20, 25, 30, 40, 50, 65, 80])  # cm

# Frequency is roughly inversely proportional to diameter
# Calibrated so that a 30cm bell ≈ 500 Hz
k = 500 * 30  # constant: f × D = constant
frequencies = k / diameters

# Plot
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Bar chart of frequencies
colors = plt.cm.YlOrRd(np.linspace(0.3, 0.9, 8))
ax1.bar(bell_names, frequencies, color=colors)
ax1.set_ylabel('Frequency (Hz)', fontsize=11)
ax1.set_title('Frequency of Each Bell', fontsize=13)
ax1.tick_params(axis='x', rotation=45, labelsize=9)
ax1.grid(axis='y', alpha=0.3)

# Inverse relationship curve
d_range = np.linspace(10, 100, 200)
f_range = k / d_range
ax2.plot(d_range, f_range, linewidth=2.5, color='coral')
ax2.scatter(diameters, frequencies, color='white', edgecolor='coral',
            s=80, zorder=5, linewidth=2)
ax2.set_xlabel('Diameter (cm)', fontsize=11)
ax2.set_ylabel('Frequency (Hz)', fontsize=11)
ax2.set_title('f ∝ 1/D — The Inverse Relationship', fontsize=13)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

for name, d, f in zip(bell_names, diameters, frequencies):
    wl = 343 / f
    print(f"  {name}: {d} cm → {f:.0f} Hz (λ = {wl:.2f} m)")`,
      challenge: 'Add a 9th bell with diameter 100 cm. What is its frequency? What about a tiny 10 cm bell? At what diameter would the bell become inaudible to humans (below 20 Hz)?',
      successHint: 'The inverse relationship between size and frequency is universal. It applies to bells, strings, pipes, drums, and even atoms. Understanding it lets you predict the pitch of any vibrating object from its physical dimensions.',
    },
    {
      title: 'Building a bell tone — adding harmonics',
      concept: `A real bell does not produce a pure sine wave. It produces the fundamental frequency **plus** harmonics (2×, 3×, 4×, etc.). Each harmonic has a lower amplitude than the one before.

The code below builds a bell-like sound step by step:
1. Start with the fundamental (200 Hz)
2. Add the 2nd harmonic (400 Hz) at half the amplitude
3. Add the 3rd harmonic (600 Hz) at one-third amplitude
4. Continue to the 6th harmonic

Watch how the waveform changes from a smooth sine wave to a complex, rich shape. This is why a bell sounds warm and full instead of like a thin electronic beep.

The key idea: \`bell = sin(2π×200×t) + 0.5×sin(2π×400×t) + 0.33×sin(2π×600×t) + ...\``,
      analogy: 'Think of a choir. One person singing a note is a pure sine wave. Add a second person singing the same note an octave higher (2× frequency) at half volume. Add a third singing two octaves up at one-third volume. Each voice blends in, creating a richer, fuller sound. A bell is a one-object choir — its metal vibrates at multiple frequencies simultaneously.',
      storyConnection: 'Dr. Lhamo showed Dorji the frequency bars on her screen — the fundamental at 440 Hz with shorter bars at 880, 1320, 1760 Hz. Each bar is a harmonic, and together they create the bell’s distinctive voice. The code below recreates exactly what her software displayed.',
      checkQuestion: 'If you remove all harmonics and keep only the fundamental, what would the bell sound like?',
      checkAnswer: 'It would sound like a thin, pure electronic tone — like a tuning fork or a phone’s dial tone. All the warmth, richness, and character come from the harmonics. A pure fundamental has no personality; harmonics are what make a bell sound like a bell.',
      codeIntro: 'Build a bell tone by adding harmonics one at a time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fundamental = 200  # Hz (large monastery bell)
duration = 0.025   # 25 ms
t = np.linspace(0, duration, 10000)

# Build the bell tone harmonic by harmonic
fig, axes = plt.subplots(4, 1, figsize=(10, 10), sharex=True)

# 1. Pure fundamental
y1 = np.sin(2 * np.pi * fundamental * t)
axes[0].plot(t * 1000, y1, color='#f59e0b', linewidth=1.5)
axes[0].set_title('Fundamental only (200 Hz)', fontsize=11, color='white')
axes[0].set_ylabel('Pressure', fontsize=9)
axes[0].grid(alpha=0.2)

# 2. Fundamental + 2nd harmonic
y2 = y1 + 0.5 * np.sin(2 * np.pi * 2 * fundamental * t)
axes[1].plot(t * 1000, y2, color='#3b82f6', linewidth=1.5)
axes[1].set_title('+ 2nd harmonic (400 Hz, half amplitude)', fontsize=11, color='white')
axes[1].set_ylabel('Pressure', fontsize=9)
axes[1].grid(alpha=0.2)

# 3. Add 3rd and 4th harmonics
y3 = y2 + 0.33 * np.sin(2 * np.pi * 3 * fundamental * t) \
       + 0.25 * np.sin(2 * np.pi * 4 * fundamental * t)
axes[2].plot(t * 1000, y3, color='#10b981', linewidth=1.5)
axes[2].set_title('+ 3rd & 4th harmonics', fontsize=11, color='white')
axes[2].set_ylabel('Pressure', fontsize=9)
axes[2].grid(alpha=0.2)

# 4. Full bell tone (6 harmonics)
bell = sum(np.sin(2 * np.pi * n * fundamental * t) / n for n in range(1, 7))
axes[3].plot(t * 1000, bell, color='#a855f7', linewidth=1.5)
axes[3].set_title('Full bell tone (6 harmonics)', fontsize=11, color='white')
axes[3].set_xlabel('Time (milliseconds)', fontsize=11)
axes[3].set_ylabel('Pressure', fontsize=9)
axes[3].grid(alpha=0.2)

plt.tight_layout()
plt.show()

print("Each panel adds more harmonics to the sound.")
print("Notice how the waveform becomes more complex and 'textured'.")
print()
print("Harmonics present:")
for n in range(1, 7):
    print(f"  {n}× fundamental = {n*fundamental} Hz (amplitude = 1/{n} = {1/n:.2f})")`,
      challenge: 'Try using amplitude = 1/n² instead of 1/n for each harmonic. How does the waveform change? This approximates a different instrument. Then try equal amplitudes for all harmonics — what does that create?',
      successHint: 'You just synthesized a bell tone from pure mathematics! This is exactly how electronic music and digital audio work: every sound in your phone, computer, and headphones is built from sine waves added together.',
    },
    {
      title: 'Fourier transform — breaking sound back into frequencies',
      concept: `In the previous exercise you built a complex wave by adding harmonics. Now you will do the reverse: take a complex wave and break it apart to find which frequencies are inside.

This reverse process is the **Fast Fourier Transform (FFT)** — one of the most important algorithms in computing. NumPy provides it as \`np.fft.fft()\`.

The code generates a bell-like wave (same as before), then applies FFT to produce a **frequency spectrum**: a plot showing a peak at every frequency present in the signal. You will see clear peaks at 200, 400, 600, 800, 1000, 1200 Hz — the exact harmonics you put in.

This is what Dr. Lhamo’s software did when she tapped the Tawang bells. It listened to the complex sound and decomposed it into its component frequencies.`,
      analogy: 'Imagine someone bakes a cake and serves you a slice. The FFT is like un-baking the cake — figuring out from the finished product that it contains flour, sugar, eggs, butter, and vanilla, and exactly how much of each. You taste the composite; the FFT reveals the recipe.',
      storyConnection: 'When Dr. Lhamo pressed the button and the wiggly waveform transformed into vertical bars, she was running a Fourier transform. Each bar represents one harmonic frequency. The code below does exactly what her software did.',
      checkQuestion: 'If the FFT of a sound shows peaks at 300, 600, 900, and 1200 Hz, what is the fundamental frequency?',
      checkAnswer: '300 Hz. The fundamental is the lowest frequency, and the others are its harmonics (2×, 3×, 4×). The fundamental is always the greatest common divisor of all the peak frequencies.',
      codeIntro: 'Apply the Fast Fourier Transform to decompose a bell sound.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate a bell-like sound (6 harmonics of 200 Hz)
fundamental = 200
sample_rate = 44100  # CD quality
duration = 0.1       # 100 ms
t = np.linspace(0, duration, int(sample_rate * duration))

# Build the bell tone
bell = sum(np.sin(2 * np.pi * n * fundamental * t) / n for n in range(1, 7))

# Apply FFT
fft_result = np.fft.fft(bell)
frequencies = np.fft.fftfreq(len(t), 1 / sample_rate)

# Only keep positive frequencies up to 2000 Hz
mask = (frequencies > 0) & (frequencies < 2000)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))

# Waveform
ax1.plot(t[:2000] * 1000, bell[:2000], color='#a855f7', linewidth=1.5)
ax1.set_xlabel('Time (ms)', fontsize=11)
ax1.set_ylabel('Pressure', fontsize=11)
ax1.set_title('Bell Waveform (what the microphone records)', fontsize=13)
ax1.grid(alpha=0.3)

# Frequency spectrum
magnitudes = np.abs(fft_result[mask])
magnitudes = magnitudes / magnitudes.max()  # normalize
ax2.plot(frequencies[mask], magnitudes, color='#f59e0b', linewidth=1.5)

# Mark the harmonics
for n in range(1, 7):
    ax2.axvline(n * fundamental, color='white', linewidth=0.5, alpha=0.3)
    ax2.annotate(f'{n}×f = {n*fundamental} Hz',
                xy=(n * fundamental, 0.95 / n),
                fontsize=8, color='lightgray', ha='center')

ax2.set_xlabel('Frequency (Hz)', fontsize=11)
ax2.set_ylabel('Relative amplitude', fontsize=11)
ax2.set_title('Frequency Spectrum (what FFT reveals)', fontsize=13)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("The FFT decomposes the complex bell wave into its ingredients:")
for n in range(1, 7):
    print(f"  Harmonic {n}: {n*fundamental} Hz (amplitude ≈ 1/{n})")
print()
print("This is Fourier analysis: complex wave → simple sine components")`,
      challenge: 'Add a mystery frequency — say 550 Hz (not a harmonic of 200) — to the bell signal. Run FFT again. Can you spot the intruder in the spectrum? This simulates how an acoustician might detect a manufacturing defect.',
      successHint: 'You just performed Fourier analysis — the same technique used in MRI scanners, earthquake detection, voice recognition, and music production. Any signal, anywhere, can be decomposed into sine waves.',
    },
    {
      title: 'The cracked bell — beat frequencies',
      concept: `The story’s central mystery: why does Sangha sound terrible? The crack makes one side of the bell slightly stiffer than the other. Instead of both sides vibrating at 200 Hz, one vibrates at 200 Hz and the other at 203 Hz.

When two frequencies are close but not identical, they produce **beats** — a rhythmic pulsing of loudness. The beat frequency equals the difference: 203 − 200 = 3 Hz. You hear a “wah-wah-wah” wobble three times per second.

This is why the cracked bell sounds harsh. Instead of a clean tone, every harmonic is split into two close frequencies, each pair creating its own beat pattern. The result is a clashing, jarring mess.

The code simulates this by adding two slightly detuned sine waves and plotting the resulting beat pattern.`,
      analogy: 'Imagine two people trying to clap in unison but one is slightly faster. Sometimes their claps align (loud — constructive interference) and sometimes they oppose (quiet — destructive interference). The regular alternation between loud and quiet IS the beat. With bells, it is pressure waves instead of clapping hands.',
      storyConnection: 'Sangha’s crack made one side vibrate at a slightly different frequency than the other. Dr. Lhamo’s screen would have shown split peaks — two bars close together instead of one clean bar. The wobble Dorji heard is exactly the beat frequency you are about to simulate.',
      checkQuestion: 'A piano tuner plays a 440 Hz tuning fork alongside a piano string. She hears 2 beats per second. What are the two possible frequencies of the piano string?',
      checkAnswer: 'Either 438 Hz or 442 Hz. The beat frequency equals the difference between the two frequencies. Since beats = |f₁ − f₂|, the piano string is either 2 Hz above or 2 Hz below the tuning fork. The tuner adjusts until the beats disappear (0 Hz difference = perfect tune).',
      codeIntro: 'Simulate the cracked bell’s beat pattern.',
      code: `import numpy as np
import matplotlib.pyplot as plt

duration = 0.5  # half second
sample_rate = 44100
t = np.linspace(0, duration, int(sample_rate * duration))

# Perfect bell: both sides at 200 Hz
perfect = np.sin(2 * np.pi * 200 * t) + np.sin(2 * np.pi * 200 * t)

# Cracked bell: one side at 200 Hz, other at 203 Hz
cracked = np.sin(2 * np.pi * 200 * t) + np.sin(2 * np.pi * 203 * t)

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 8))

# Perfect bell
ax1.plot(t * 1000, perfect, color='#10b981', linewidth=0.5)
ax1.set_title('Perfect bell (200 Hz + 200 Hz = clean tone)', fontsize=11, color='white')
ax1.set_ylabel('Pressure', fontsize=9)
ax1.grid(alpha=0.2)

# Cracked bell
ax2.plot(t * 1000, cracked, color='#ef4444', linewidth=0.5)
ax2.set_title('Cracked bell (200 Hz + 203 Hz = 3 Hz beat)', fontsize=11, color='white')
ax2.set_ylabel('Pressure', fontsize=9)
ax2.grid(alpha=0.2)

# Beat envelope
envelope = 2 * np.abs(np.cos(2 * np.pi * 1.5 * t))  # beat freq / 2
ax2.plot(t * 1000, envelope, color='#fbbf24', linewidth=1.5, linestyle='--', label='Beat envelope')
ax2.plot(t * 1000, -envelope, color='#fbbf24', linewidth=1.5, linestyle='--')
ax2.legend(fontsize=9)

# FFT comparison
fft_cracked = np.abs(np.fft.fft(cracked))
freqs = np.fft.fftfreq(len(t), 1/sample_rate)
mask = (freqs > 150) & (freqs < 250)
ax3.plot(freqs[mask], fft_cracked[mask] / fft_cracked[mask].max(),
         color='#a855f7', linewidth=2)
ax3.set_xlabel('Frequency (Hz)', fontsize=11)
ax3.set_title('FFT of cracked bell — two peaks instead of one', fontsize=11, color='white')
ax3.set_ylabel('Amplitude', fontsize=9)
ax3.grid(alpha=0.3)

plt.tight_layout()
plt.show()

beat_freq = abs(203 - 200)
print(f"Beat frequency: |203 - 200| = {beat_freq} Hz")
print(f"You hear {beat_freq} wobbles per second")
print()
print("This is why Sangha sounds harsh — every harmonic is split,")
print("creating multiple overlapping beat patterns.")`,
      challenge: 'Try different detuning amounts: 201 Hz (1 Hz beat), 205 Hz (5 Hz beat), 210 Hz (10 Hz beat). At what detuning do beats become too fast to hear individually? Above about 15 Hz, beats blend into a rough, dissonant tone rather than distinct wobbles.',
      successHint: 'Beat frequencies are how musicians tune instruments: play two notes together and listen for wobbles. When the wobbles disappear, the notes match. Every piano tuner, every orchestra warm-up, every guitar tuning session relies on this physics.',
    },
    {
      title: 'The speed of sound — how altitude changes everything',
      concept: `Tawang Monastery sits at 3,048 metres. At that altitude, air is thinner (less dense) and the speed of sound is different. The formula is:

**v = 331.4 + 0.6 × T** (metres per second, where T is temperature in °C)

At sea level on a 20°C day: v = 331.4 + 12 = 343.4 m/s
At Tawang in autumn (5°C): v = 331.4 + 3 = 334.4 m/s

The speed of sound depends mainly on **temperature** (which correlates with altitude). Colder air = slower sound. This affects how far the bell’s sound carries and how long it takes to reach distant villages.

The code below calculates the speed of sound at different altitudes and plots how sound would travel from the monastery to a village 5 km away.`,
      analogy: 'Think of a line of people passing a bucket of water hand to hand. If everyone is standing close together (dense air, warm), the bucket moves fast. If they are spread far apart (thin air, cold), it takes longer for each pass. Temperature determines how energetically the air molecules collide and pass along the pressure wave.',
      storyConnection: 'The story says yak herders on mountain passes heard Sangha five kilometres away. Sound at altitude travels slightly slower, but the thin air has less absorption — fewer molecules to steal energy from the wave. Mountain environments can actually carry sound farther than sea level, which is why the monks’ bell reached such distances.',
      checkQuestion: 'At −10°C (a Tawang winter morning), what is the speed of sound?',
      checkAnswer: 'v = 331.4 + 0.6 × (−10) = 331.4 − 6 = 325.4 m/s. That is about 18 m/s slower than at sea level on a warm day. Sound from the bell would take about 15.4 seconds to reach a village 5 km away, versus 14.6 seconds at sea level.',
      codeIntro: 'Calculate how temperature and altitude affect the speed of sound.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Speed of sound: v = 331.4 + 0.6 × T (°C)
temperatures = np.linspace(-20, 40, 200)
speeds = 331.4 + 0.6 * temperatures

# Key locations
locations = {
    'Tawang winter (-10°C)': -10,
    'Tawang autumn (5°C)': 5,
    'Sea level (20°C)': 20,
    'Hot desert (40°C)': 40,
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Speed vs temperature
ax1.plot(temperatures, speeds, linewidth=2.5, color='#3b82f6')
for name, temp in locations.items():
    v = 331.4 + 0.6 * temp
    ax1.scatter(temp, v, s=60, zorder=5, color='white', edgecolor='#3b82f6', linewidth=2)
    ax1.annotate(f'{name}\\n{v:.0f} m/s', xy=(temp, v),
                xytext=(temp, v + 4), fontsize=8, color='lightgray', ha='center')

ax1.set_xlabel('Temperature (°C)', fontsize=11)
ax1.set_ylabel('Speed of sound (m/s)', fontsize=11)
ax1.set_title('Speed of Sound vs Temperature', fontsize=13)
ax1.grid(alpha=0.3)

# Time for bell sound to travel 5 km
distance = 5000  # metres
for name, temp in locations.items():
    v = 331.4 + 0.6 * temp
    time_s = distance / v
    ax2.barh(name, time_s, color='#f59e0b', height=0.5)
    ax2.text(time_s + 0.1, name, f'{time_s:.1f}s', va='center',
             fontsize=10, color='lightgray')

ax2.set_xlabel('Time to travel 5 km (seconds)', fontsize=11)
ax2.set_title('How Long for the Bell to Reach the Village?', fontsize=13)
ax2.grid(axis='x', alpha=0.3)

plt.tight_layout()
plt.show()

print("The bell's sound travels at different speeds depending on temperature:")
for name, temp in locations.items():
    v = 331.4 + 0.6 * temp
    t = distance / v
    wl = v / 200  # wavelength of 200 Hz bell
    print(f"  {name}: {v:.1f} m/s, reaches 5 km in {t:.1f}s, λ = {wl:.2f}m")`,
      challenge: 'Sound in water travels at about 1,480 m/s. If the monastery were underwater (hypothetically), how long would the bell take to reach 5 km? What about in steel (5,960 m/s)?',
      successHint: 'The speed of sound is not a constant — it depends on the medium and temperature. Understanding this helps explain why sound carries differently at altitude, why thunder arrives after lightning, and why sonar works so well in the ocean.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior physics experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for acoustics simulations. Click to start.</p>
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
            diagram={[BellSoundWaveDiagram, BellFrequencyDiagram, BellHarmonicsDiagram, BellFourierDiagram, SineWaveDiagram, ActivityBellStrikeDiagram][i] ? createElement([BellSoundWaveDiagram, BellFrequencyDiagram, BellHarmonicsDiagram, BellFourierDiagram, SineWaveDiagram, ActivityBellStrikeDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
