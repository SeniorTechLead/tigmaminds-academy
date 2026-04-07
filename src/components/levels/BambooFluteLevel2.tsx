import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BambooFluteLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Sound waves in code — generating sine waves as audio',
      concept: `In Level 1, Liyo carved bamboo flutes to make music. Now we become Liyo — but our bamboo is code, and our knife is math. We will generate sound from nothing but numbers.

A sound wave is a pattern of air pressure over time. A **sine wave** is the simplest possible sound — a single, pure frequency with no harmonics. In code, generating a sine wave means creating an array of numbers where each value represents the air pressure at a specific moment in time.

The formula: **y(t) = A * sin(2 * pi * f * t)**
- **A** = amplitude (how loud)
- **f** = frequency in Hz (what pitch)
- **t** = time in seconds
- **2 * pi** = one full rotation in radians

To turn this mathematical function into actual sound, we need to **sample** it — calculate its value at regular intervals. The standard sampling rate for audio is **44,100 samples per second** (44.1 kHz). This means we calculate 44,100 pressure values for every second of audio. The reason for this specific number comes from the Nyquist theorem: to faithfully reproduce a frequency, you need at least twice as many samples per second. Since humans hear up to ~20,000 Hz, we need at least 40,000 samples/s — and 44,100 gives a small safety margin.`,
      analogy: 'Generating a sine wave in code is like making a flipbook animation. Each page (sample) shows the position of a pendulum at one instant. Flip through the pages fast enough (44,100 pages per second) and you see smooth motion. Play the corresponding pressure values through a speaker fast enough and you hear a smooth tone. More pages per second = smoother motion = more accurate sound.',
      storyConnection: 'Liyo\'s bamboo flute created sound by physically vibrating air. We are doing the same thing — but instead of carving bamboo and blowing, we calculate numbers and send them to a speaker. The speaker\'s membrane pushes air in exactly the pattern our numbers describe. Digital Liyo, same forest song.',
      checkQuestion: 'If you generate a sine wave at 440 Hz with a sample rate of 44100 Hz, how many samples make up one complete cycle of the wave?',
      checkAnswer: '44100 / 440 = 100.23 samples per cycle. Since we cannot have fractional samples, the wave is approximated — each cycle uses about 100 samples. At lower frequencies (e.g., 100 Hz), each cycle gets 441 samples and the approximation is more accurate. At higher frequencies (e.g., 10000 Hz), each cycle gets only 4.41 samples — which is why very high frequencies need high sample rates.',
      codeIntro: 'Generate and visualize a pure sine wave at different frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Audio parameters
sample_rate = 44100  # samples per second
duration = 0.02      # 20 milliseconds (for visualization)
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)

# Generate sine waves at different frequencies
frequencies = [220, 440, 880]  # A3, A4, A5
labels = ['A3 (220 Hz)', 'A4 (440 Hz)', 'A5 (880 Hz)']
colors = ['#3b82f6', '#22c55e', '#ef4444']

fig, axes = plt.subplots(3, 1, figsize=(10, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')

for ax, freq, label, color in zip(axes, frequencies, labels, colors):
    ax.set_facecolor('#111827')

    # Generate sine wave
    wave = np.sin(2 * np.pi * freq * t)

    # Plot continuous-looking wave
    ax.plot(t * 1000, wave, color=color, linewidth=2, label=label)

    # Show individual samples (zoom into first 2 ms)
    mask = t < 0.002
    ax.plot(t[mask] * 1000, wave[mask], '.', color='#f59e0b', markersize=3, alpha=0.7)

    ax.axhline(0, color='gray', linewidth=0.3, linestyle='--')
    ax.set_ylabel('Amplitude', color='white')
    ax.legend(loc='upper right', facecolor='#1f2937', edgecolor='gray', labelcolor='white')
    ax.set_ylim(-1.4, 1.4)
    ax.tick_params(colors='gray')

    # Annotate samples per cycle
    spc = sample_rate / freq
    ax.text(19, -1.1, f'{spc:.1f} samples/cycle', color=color, fontsize=9, ha='right')

axes[-1].set_xlabel('Time (milliseconds)', color='white')
axes[0].set_title('Sine waves: same amplitude, different frequencies', color='white', fontsize=13)

plt.tight_layout()
plt.show()

# Generate 1 second of A4 and show stats
full_wave = np.sin(2 * np.pi * 440 * np.linspace(0, 1, sample_rate, endpoint=False))
print(f"Generated 1 second of A4 (440 Hz):")
print(f"  Sample rate: {sample_rate} Hz")
print(f"  Total samples: {len(full_wave)}")
print(f"  Samples per cycle: {sample_rate/440:.2f}")
print(f"  Complete cycles: {440}")
print(f"  Min value: {full_wave.min():.4f}")
print(f"  Max value: {full_wave.max():.4f}")
print(f"  Data size: {full_wave.nbytes / 1024:.1f} KB (float64)")
print(f"  As 16-bit audio: {len(full_wave) * 2 / 1024:.1f} KB")`,
      challenge: 'Generate a 1-second sine wave at 440 Hz, then add a second sine wave at 660 Hz (a perfect fifth above). Plot the combined waveform. This is additive synthesis — the basis of all digital sound generation.',
      successHint: 'You have just done what every digital audio system does: represent sound as a sequence of numbers. Every MP3, every streaming song, every phone call — it is all arrays of numbers describing air pressure over time. You are now speaking the language of digital audio.',
    },
    {
      title: 'Waveforms — sine, square, sawtooth, and their sounds',
      concept: `A sine wave is pure but lifeless — no real instrument sounds like one. Real sounds are complex waveforms with rich harmonic content. In audio engineering, there are four fundamental waveforms that serve as building blocks:

**Sine wave**: Only the fundamental frequency. Sounds smooth, hollow, electronic. Think: tuning fork, test tone, early electronic music.

**Square wave**: Contains odd harmonics (1, 3, 5, 7...) with amplitudes decreasing as 1/n. Sounds buzzy, hollow, retro. Think: old video game music, clarinet-like.

**Sawtooth wave**: Contains all harmonics (1, 2, 3, 4...) with amplitudes decreasing as 1/n. Sounds bright, brassy, aggressive. Think: trumpet-like, string-like, many synth leads.

**Triangle wave**: Contains odd harmonics like a square wave, but amplitudes decrease as 1/n². Sounds softer than square, flute-like. Think: mellow synth pads, vibraphone-like.

Each waveform has a different harmonic recipe, which gives it a different timbre. The fascinating connection to Level 1: these waveforms can be built by adding sine waves together (Fourier synthesis). A square wave is literally the sum of an infinite number of sine waves at odd harmonics.`,
      analogy: 'Waveforms are like drawing styles. A sine wave is a smooth cursive letter — one flowing curve. A square wave is blocky pixel art — hard edges, digital feel. A sawtooth is a jagged mountain range — sharp ascents, sudden drops. A triangle is a zigzag — angular but softer than square. Each "drawing style" creates a different visual impression; each waveform creates a different sonic impression.',
      storyConnection: 'Liyo\'s bamboo flute produced something close to a sine wave — breathy and pure. But when his friend struck a bamboo percussion instrument, the sharp attack created something closer to a sawtooth wave — bright and cutting. The Naga ensemble combined these different waveforms into a rich sonic texture, just as a synthesizer mixes waveforms to create complex timbres.',
      checkQuestion: 'A square wave contains only odd harmonics. If the fundamental is 100 Hz, which harmonics are present below 1000 Hz?',
      checkAnswer: '100, 300, 500, 700, and 900 Hz (the 1st, 3rd, 5th, 7th, and 9th harmonics). The even harmonics (200, 400, 600, 800) are completely absent. This is why a square wave sounds "hollow" compared to a sawtooth — it is missing half the frequency content.',
      codeIntro: 'Generate and compare the four fundamental waveforms and their harmonic content.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 44100
duration = 0.01  # 10 ms for visualization
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
f0 = 440  # Hz

# Generate waveforms mathematically (not from built-in functions)
sine = np.sin(2 * np.pi * f0 * t)

# Square wave from harmonics: sum of sin(n*2pi*f*t)/n for odd n
square = np.zeros_like(t)
for n in range(1, 20, 2):  # odd harmonics 1,3,5,...,19
    square += (1/n) * np.sin(2 * np.pi * n * f0 * t)
square *= 4 / np.pi  # normalize

# Sawtooth from harmonics: sum of sin(n*2pi*f*t)/n for all n
sawtooth = np.zeros_like(t)
for n in range(1, 30):
    sawtooth += ((-1)**(n+1)) * (1/n) * np.sin(2 * np.pi * n * f0 * t)
sawtooth *= 2 / np.pi

# Triangle from harmonics: sum of sin(n*2pi*f*t)/n^2 for odd n
triangle = np.zeros_like(t)
for n in range(0, 10):
    k = 2 * n + 1
    triangle += ((-1)**n) * (1/k**2) * np.sin(2 * np.pi * k * f0 * t)
triangle *= 8 / (np.pi**2)

waveforms = [
    ('Sine', sine, '#22c55e', 'Pure, hollow — tuning fork'),
    ('Square', square, '#3b82f6', 'Buzzy, retro — video games'),
    ('Sawtooth', sawtooth, '#f59e0b', 'Bright, brassy — synth lead'),
    ('Triangle', triangle, '#a855f7', 'Soft, mellow — flute-like'),
]

fig, axes = plt.subplots(4, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

for ax, (name, wave, color, desc) in zip(axes, waveforms):
    ax.set_facecolor('#111827')
    ax.plot(t * 1000, wave, color=color, linewidth=2)
    ax.axhline(0, color='gray', linewidth=0.3, linestyle='--')
    ax.set_ylabel(name, color=color, fontsize=11, rotation=0, labelpad=70)
    ax.set_ylim(-1.4, 1.4)
    ax.tick_params(colors='gray')
    ax.text(9.8, -1.1, desc, color='gray', fontsize=8, ha='right')

axes[-1].set_xlabel('Time (milliseconds)', color='white')
axes[0].set_title('Four fundamental waveforms at 440 Hz', color='white', fontsize=13)

plt.tight_layout()
plt.show()

# Show harmonic content
print("Harmonic content of each waveform:")
print(f"  {'Sine':<12s}: H1 only")
print(f"  {'Square':<12s}: H1, H3, H5, H7, H9... (odd, amplitude 1/n)")
print(f"  {'Sawtooth':<12s}: H1, H2, H3, H4, H5... (all, amplitude 1/n)")
print(f"  {'Triangle':<12s}: H1, H3, H5, H7, H9... (odd, amplitude 1/n²)")
print()
print("Building a square wave from sines (first 5 odd harmonics):")
for n in range(1, 11, 2):
    amp = 4 / (np.pi * n)
    print(f"  H{n}: {n*f0:5.0f} Hz, amplitude = {amp:.4f}")`,
      challenge: 'Build a square wave by adding harmonics one at a time. Start with just H1 (a sine wave), then add H3, then H5, then H7. Plot each stage. Watch how the waveform gets "squarer" with each harmonic. This is Fourier synthesis in action.',
      successHint: 'Every sound in the digital world — from synth pads to sampled pianos — is ultimately built from combinations of these basic waveforms. Understanding them is understanding the DNA of digital audio. Jean-Baptiste Fourier proved in 1822 that ANY periodic waveform can be decomposed into sine waves. That insight powers all modern audio technology.',
    },
    {
      title: 'Frequency analysis — FFT to decompose complex sounds',
      concept: `Fourier synthesis lets us build complex sounds from simple sine waves. The **Fast Fourier Transform (FFT)** does the reverse: it takes a complex sound and decomposes it back into its constituent frequencies. This is like taking a smoothie and figuring out exactly which fruits went into it.

The FFT is one of the most important algorithms in all of computing. It takes a time-domain signal (amplitude vs. time) and converts it to a **frequency-domain** representation (amplitude vs. frequency). The result is called a **spectrum** — a map showing how much energy exists at each frequency.

Practical applications are everywhere:
- **Music production**: equalizers, spectrograms, pitch detection
- **Voice recognition**: Siri/Alexa analyze your voice's frequency content
- **Medical imaging**: MRI uses Fourier transforms to create images
- **Earthquake analysis**: seismologists decompose ground vibrations
- **Noise cancellation**: headphones analyze ambient frequencies to cancel them

The algorithm runs in O(n log n) time — vastly faster than the naive O(n²) Discrete Fourier Transform. This efficiency, discovered by Cooley and Tukey in 1965, is what makes real-time audio analysis possible on your phone.`,
      analogy: 'The FFT is like a prism splitting white light into a rainbow. White light looks like one thing (a complex waveform), but the prism reveals it is actually made of many colors (frequencies) mixed together. The FFT is a prism for sound — it reveals the hidden frequency components of any audio signal.',
      storyConnection: 'If Liyo could run an FFT on the forest sounds around him, he would see the bird calls as sharp spikes at high frequencies, the river as a broad wash of low frequencies, and his own flute as a clean spike at the fundamental with small spikes at each harmonic. The forest is a complex waveform; the FFT would reveal its hidden musical structure.',
      checkQuestion: 'An FFT of a 1-second audio clip at 44100 Hz sample rate produces a spectrum. What is the frequency resolution (the spacing between frequency bins)?',
      checkAnswer: 'Frequency resolution = sample_rate / number_of_samples = 44100 / 44100 = 1 Hz. For a 0.1-second clip, it would be 44100 / 4410 = 10 Hz. Longer recordings give finer frequency resolution. This is the time-frequency trade-off: you cannot have both perfect time resolution and perfect frequency resolution simultaneously (the uncertainty principle of signal processing).',
      codeIntro: 'Build a complex signal from multiple frequencies, then use FFT to decompose it.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a complex signal: a "chord"
sample_rate = 44100
duration = 0.5  # 500ms for good frequency resolution
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)

# A major chord: A4 (440), C#5 (554.37), E5 (659.25)
f1, f2, f3 = 440, 554.37, 659.25
signal = (np.sin(2 * np.pi * f1 * t) +
          0.8 * np.sin(2 * np.pi * f2 * t) +
          0.6 * np.sin(2 * np.pi * f3 * t))

# Add some harmonics to make it more realistic
signal += 0.3 * np.sin(2 * np.pi * 2 * f1 * t)  # A4 2nd harmonic
signal += 0.2 * np.sin(2 * np.pi * 3 * f1 * t)  # A4 3rd harmonic

# Normalize
signal = signal / np.max(np.abs(signal))

# Compute FFT
fft_vals = np.fft.rfft(signal)
fft_freqs = np.fft.rfftfreq(len(signal), 1 / sample_rate)
fft_magnitude = np.abs(fft_vals) / len(signal) * 2  # normalize

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Time domain (zoomed to 20ms)
ax1.set_facecolor('#111827')
mask = t < 0.02
ax1.plot(t[mask] * 1000, signal[mask], color='#22c55e', linewidth=1.5)
ax1.set_xlabel('Time (ms)', color='white')
ax1.set_ylabel('Amplitude', color='white')
ax1.set_title('Time domain: A major chord (complex waveform)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Full spectrum
ax2.set_facecolor('#111827')
freq_mask = fft_freqs < 2000
ax2.plot(fft_freqs[freq_mask], fft_magnitude[freq_mask], color='#3b82f6', linewidth=1.5)
ax2.set_xlabel('Frequency (Hz)', color='white')
ax2.set_ylabel('Magnitude', color='white')
ax2.set_title('Frequency domain (FFT): the hidden structure revealed', color='white', fontsize=13)
ax2.tick_params(colors='gray')

# Annotate peaks
peaks = [(440, 'A4'), (554.37, 'C#5'), (659.25, 'E5'), (880, 'A5 (H2)'), (1320, 'E6 (H3)')]
for freq, name in peaks:
    idx = np.argmin(np.abs(fft_freqs - freq))
    mag = fft_magnitude[idx]
    if mag > 0.05:
        ax2.annotate(f'{name}\\\n{freq:.0f} Hz', xy=(freq, mag),
                    xytext=(freq + 40, mag + 0.05),
                    color='#f59e0b', fontsize=8,
                    arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Zoomed spectrum around fundamental
ax3.set_facecolor('#111827')
zoom_mask = (fft_freqs > 400) & (fft_freqs < 700)
ax3.bar(fft_freqs[zoom_mask], fft_magnitude[zoom_mask], width=1.5, color='#ef4444', alpha=0.8)
ax3.set_xlabel('Frequency (Hz)', color='white')
ax3.set_ylabel('Magnitude', color='white')
ax3.set_title('Zoomed: the three chord notes clearly separated', color='white', fontsize=11)
ax3.tick_params(colors='gray')

for freq, name in [(440, 'A4'), (554.37, 'C#5'), (659.25, 'E5')]:
    ax3.axvline(freq, color='#f59e0b', linestyle='--', linewidth=1, alpha=0.5)
    ax3.text(freq, ax3.get_ylim()[1] * 0.9, name, color='#f59e0b', fontsize=9, ha='center')

plt.tight_layout()
plt.show()

print("FFT decomposition of A major chord:")
print(f"  Frequency resolution: {fft_freqs[1]:.2f} Hz")
print(f"  Total frequency bins: {len(fft_freqs)}")
print()
print("Detected peaks:")
for freq, name in peaks:
    idx = np.argmin(np.abs(fft_freqs - freq))
    mag = fft_magnitude[idx]
    if mag > 0.05:
        print(f"  {name:10s} at {fft_freqs[idx]:7.1f} Hz, magnitude = {mag:.4f}")`,
      challenge: 'Add some random noise to the signal (signal += 0.5 * np.random.randn(len(signal))) and re-run the FFT. Can you still see the chord frequencies above the noise floor? This is signal detection in noisy environments — the same problem radar and sonar systems solve.',
      successHint: 'The FFT is one of the most powerful tools in all of engineering and science. You have just used it to reverse-engineer a chord — extracting the individual notes from a complex waveform. Every equalizer on every music player does exactly this, 44,100 times per second.',
    },
    {
      title: 'Building a digital instrument — mapping keyboard to frequencies',
      concept: `Now we combine everything: sine wave generation, waveform selection, and frequency mapping to build a digital musical instrument. The core idea is simple: map each key on a keyboard to a specific frequency, generate the corresponding waveform in real time, and send it to the speaker.

A digital instrument needs four components:
1. **Frequency map**: which key produces which Hz (the chromatic scale)
2. **Oscillator**: generates the waveform at the requested frequency
3. **Envelope**: shapes the volume over time (attack, decay, sustain, release — ADSR)
4. **Mixer**: combines multiple simultaneous notes (polyphony)

The **ADSR envelope** is crucial for making a digital instrument sound natural:
- **Attack**: how quickly the sound reaches full volume (fast for piano, slow for violin)
- **Decay**: the initial drop from peak volume to sustain level
- **Sustain**: the steady volume while the key is held
- **Release**: how the sound fades after the key is released

Without an envelope, every note would start and stop abruptly — like a light switch instead of a dimmer. The envelope is what gives digital instruments their character.`,
      analogy: 'Building a digital instrument is like building a player piano. The frequency map is the sheet music (which notes to play). The oscillator is the mechanism that strikes the strings. The ADSR envelope is the felt hammer — it controls how the string is struck (hard attack = loud) and how long the sound rings (long release = sustain pedal). The mixer is the piano itself, combining the vibrations of all strings into one sound.',
      storyConnection: 'Liyo\'s bamboo flute had a natural ADSR envelope: the attack was the breath hitting the edge (quick but not instant), the sustain was the steady airflow, and the release was the breath trailing off. When we build a digital flute sound, we recreate this envelope in code — modeling the physics of breath and bamboo in numbers.',
      checkQuestion: 'A piano has a fast attack, quick decay, moderate sustain, and long release. A flute has a moderate attack, no real decay, steady sustain, and quick release. How would you set ADSR values (in seconds) for each?',
      checkAnswer: 'Piano: A=0.01s, D=0.3s, S=0.6 (60% volume), R=1.0s. Flute: A=0.1s, D=0.05s, S=0.9 (90% volume), R=0.15s. The piano\'s character comes from its long release (the string ringing out) and dynamic decay. The flute\'s character comes from its steady sustain (continuous breath) and quick release (breath stops).',
      codeIntro: 'Build a complete digital instrument with frequency mapping, waveform generation, and ADSR envelopes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 44100

# Chromatic scale frequency map (one octave from C4)
note_freqs = {}
note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
c4 = 261.63
for i, name in enumerate(note_names):
    note_freqs[f'{name}4'] = c4 * (2 ** (i / 12))
note_freqs['C5'] = c4 * 2

# ADSR envelope generator
def make_adsr(duration, attack=0.05, decay=0.1, sustain_level=0.7, release=0.2, sr=44100):
    total_samples = int(sr * duration)
    env = np.zeros(total_samples)

    a_samples = int(sr * attack)
    d_samples = int(sr * decay)
    r_samples = int(sr * release)
    s_samples = total_samples - a_samples - d_samples - r_samples

    if s_samples < 0:
        s_samples = 0
        r_samples = total_samples - a_samples - d_samples

    idx = 0
    # Attack
    env[idx:idx+a_samples] = np.linspace(0, 1, a_samples)
    idx += a_samples
    # Decay
    env[idx:idx+d_samples] = np.linspace(1, sustain_level, d_samples)
    idx += d_samples
    # Sustain
    env[idx:idx+s_samples] = sustain_level
    idx += s_samples
    # Release
    env[idx:idx+r_samples] = np.linspace(sustain_level, 0, r_samples)

    return env

# Generate a note with a given waveform and envelope
def make_note(freq, duration, waveform='sine', **adsr_params):
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)

    if waveform == 'sine':
        wave = np.sin(2 * np.pi * freq * t)
    elif waveform == 'square':
        wave = np.sign(np.sin(2 * np.pi * freq * t))
    elif waveform == 'sawtooth':
        wave = 2 * (freq * t - np.floor(freq * t + 0.5))
    elif waveform == 'triangle':
        wave = 2 * np.abs(2 * (freq * t - np.floor(freq * t + 0.5))) - 1

    env = make_adsr(duration, **adsr_params)
    return wave * env

# Play a melody: first 7 notes of a scale
melody_notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
note_duration = 0.4

fig, axes = plt.subplots(3, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Show ADSR envelope shapes for different instruments
ax1 = axes[0]
ax1.set_facecolor('#111827')
t_env = np.linspace(0, 0.5, int(sample_rate * 0.5))

piano_env = make_adsr(0.5, attack=0.01, decay=0.15, sustain_level=0.5, release=0.2)
flute_env = make_adsr(0.5, attack=0.08, decay=0.05, sustain_level=0.85, release=0.1)
pluck_env = make_adsr(0.5, attack=0.005, decay=0.3, sustain_level=0.1, release=0.15)

t_plot = np.linspace(0, 0.5, len(piano_env))
ax1.plot(t_plot * 1000, piano_env, color='#3b82f6', linewidth=2, label='Piano')
ax1.plot(t_plot * 1000, flute_env, color='#22c55e', linewidth=2, label='Flute')
ax1.plot(t_plot * 1000, pluck_env, color='#f59e0b', linewidth=2, label='Plucked string')
ax1.set_xlabel('Time (ms)', color='white')
ax1.set_ylabel('Volume', color='white')
ax1.set_title('ADSR Envelopes: different instruments, different shapes', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# 2. Show same note with different waveforms + envelope
ax2 = axes[1]
ax2.set_facecolor('#111827')
waveforms = ['sine', 'square', 'sawtooth', 'triangle']
wf_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']

for wf, color in zip(waveforms, wf_colors):
    note = make_note(440, 0.3, waveform=wf, attack=0.02, decay=0.1, sustain_level=0.6, release=0.1)
    t_note = np.linspace(0, 0.3, len(note))
    # Only show first 20ms for waveform detail
    mask = t_note < 0.02
    ax2.plot(t_note[mask] * 1000, note[mask], color=color, linewidth=1.5, label=wf, alpha=0.8)

ax2.set_xlabel('Time (ms)', color='white')
ax2.set_ylabel('Amplitude', color='white')
ax2.set_title('A4 (440 Hz) with envelope: four waveforms', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# 3. Build a complete melody
ax3 = axes[2]
ax3.set_facecolor('#111827')

full_melody = np.array([])
for note_name in melody_notes:
    freq = note_freqs[note_name]
    note = make_note(freq, note_duration, waveform='sine',
                     attack=0.08, decay=0.05, sustain_level=0.8, release=0.1)
    full_melody = np.concatenate([full_melody, note])

t_melody = np.linspace(0, len(full_melody) / sample_rate, len(full_melody))
ax3.plot(t_melody, full_melody, color='#22c55e', linewidth=0.5)
ax3.set_xlabel('Time (seconds)', color='white')
ax3.set_ylabel('Amplitude', color='white')
ax3.set_title('C major scale — a digital flute melody', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# Mark notes
for i, name in enumerate(melody_notes):
    ax3.text(i * note_duration + note_duration/2, 1.05, name,
             color='#f59e0b', fontsize=9, ha='center')

plt.tight_layout()
plt.show()

print("Digital instrument: C major scale")
print(f"{'Note':<6s} {'Frequency (Hz)':<16s} {'Duration (s)':<14s}")
print("-" * 36)
for name in melody_notes:
    print(f"{name:<6s} {note_freqs[name]:<16.2f} {note_duration:<14.1f}")`,
      challenge: 'Change the melody to play a minor scale (C, D, Eb, F, G, Ab, Bb, C) by using the correct frequencies. What emotional difference does the minor scale create? Then try changing the waveform from sine to sawtooth.',
      successHint: 'You have built a complete digital instrument from scratch — frequency mapping, waveform generation, ADSR envelopes, and melody sequencing. This is exactly how early synthesizers like the Moog worked, and the same principles power every software instrument today.',
    },
    {
      title: 'Recording and playback — digital audio, sample rates, and bit depth',
      concept: `So far we have generated sound from math. But what about recording real sounds — like Liyo's actual bamboo flute? Recording converts continuous analog sound into discrete digital numbers through two processes:

**Sampling**: Measuring the air pressure at regular intervals. The **sample rate** determines how many measurements per second. Common rates:
- 44,100 Hz: CD quality (enough for all audible frequencies)
- 48,000 Hz: standard for video
- 96,000 Hz: "high resolution" audio
- 192,000 Hz: overkill for human ears, used in mastering

**Quantization**: Converting each measurement to a number with limited precision. The **bit depth** determines how many possible values each sample can take:
- 8-bit: 256 possible values (lo-fi, retro game audio)
- 16-bit: 65,536 values (CD quality — good enough for most ears)
- 24-bit: 16.7 million values (professional recording standard)
- 32-bit float: ~4 billion values (internal processing)

The bit depth determines the **dynamic range** — the ratio between the loudest and quietest sounds: roughly 6 dB per bit. So 16-bit audio has ~96 dB dynamic range (from a whisper to a rock concert).`,
      analogy: 'Sampling is like taking photos of a moving car. Take photos once per second and you see jerky motion. Take 30 photos per second and it looks smooth. Take 1000 photos per second and you can see the wheels rotating. Bit depth is like the resolution of each photo — 8-bit is a blurry thumbnail, 16-bit is a decent phone photo, 24-bit is a professional DSLR shot.',
      storyConnection: 'If we could record Liyo\'s flute in the forest, the microphone would convert the air vibrations from his bamboo flute into an electrical signal, and the recorder would sample that signal 44,100 times per second, storing each sample as a 16-bit number. A 3-minute recording would be 44100 x 180 x 2 bytes = about 15.9 MB of raw audio (before compression). His forest song, preserved as numbers.',
      checkQuestion: 'A 3-minute stereo song at CD quality (44100 Hz, 16-bit, 2 channels) takes about 31.8 MB uncompressed. An MP3 of the same song is about 3 MB. What is the compression ratio, and what is lost?',
      checkAnswer: 'The compression ratio is about 10:1. MP3 uses psychoacoustic models to remove frequencies that human ears are unlikely to notice — sounds masked by louder nearby frequencies, very high frequencies above ~16 kHz, and subtle details during loud passages. The data is gone forever (lossy compression). A trained ear can sometimes hear the difference; most people cannot at 320 kbps.',
      codeIntro: 'Visualize how sample rate and bit depth affect audio quality.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate a "reference" high-quality signal
# A bamboo flute note with harmonics
sr_high = 44100
duration = 0.02  # 20ms for visualization
t_high = np.linspace(0, duration, int(sr_high * duration), endpoint=False)

# Flute-like signal: fundamental + weak harmonics
f0 = 440
signal = (1.0 * np.sin(2 * np.pi * f0 * t_high) +
          0.15 * np.sin(2 * np.pi * 2 * f0 * t_high) +
          0.05 * np.sin(2 * np.pi * 3 * f0 * t_high))
signal = signal / np.max(np.abs(signal))

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Effect of sample rate
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(t_high * 1000, signal, color='gray', linewidth=1, alpha=0.5, label='44100 Hz (original)')

for sr, color, label in [(8000, '#ef4444', '8000 Hz (phone)'),
                          (22050, '#f59e0b', '22050 Hz (AM radio)'),
                          (44100, '#22c55e', '44100 Hz (CD)')]:
    t_low = np.linspace(0, duration, int(sr * duration), endpoint=False)
    sig_low = (1.0 * np.sin(2 * np.pi * f0 * t_low) +
               0.15 * np.sin(2 * np.pi * 2 * f0 * t_low) +
               0.05 * np.sin(2 * np.pi * 3 * f0 * t_low))
    sig_low = sig_low / np.max(np.abs(sig_low))
    ax1.plot(t_low * 1000, sig_low, 'o-', color=color, linewidth=1, markersize=2, alpha=0.7, label=label)

ax1.set_title('Effect of sample rate', color='white', fontsize=11)
ax1.set_xlabel('Time (ms)', color='white')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# 2. Effect of bit depth
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

for bits, color, label in [(3, '#ef4444', '3-bit (8 levels)'),
                            (8, '#f59e0b', '8-bit (256 levels)'),
                            (16, '#22c55e', '16-bit (65536 levels)')]:
    levels = 2 ** bits
    quantized = np.round(signal * (levels / 2 - 1)) / (levels / 2 - 1)
    ax2.plot(t_high * 1000, quantized, color=color, linewidth=1.5, alpha=0.7, label=label)

ax2.set_title('Effect of bit depth', color='white', fontsize=11)
ax2.set_xlabel('Time (ms)', color='white')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# 3. Quantization error (noise)
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')

for bits, color in [(4, '#ef4444'), (8, '#f59e0b'), (16, '#22c55e')]:
    levels = 2 ** bits
    quantized = np.round(signal * (levels / 2 - 1)) / (levels / 2 - 1)
    error = signal - quantized
    ax3.plot(t_high * 1000, error, color=color, linewidth=1, alpha=0.7, label=f'{bits}-bit error')

ax3.set_title('Quantization error (noise)', color='white', fontsize=11)
ax3.set_xlabel('Time (ms)', color='white')
ax3.set_ylabel('Error', color='white')
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# 4. File size comparison
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

# File sizes for 3 minutes of mono audio
duration_sec = 180
configs = [
    ('8kHz/8bit\\\n(phone)', 8000, 8),
    ('22kHz/16bit\\\n(radio)', 22050, 16),
    ('44.1kHz/16bit\\\n(CD)', 44100, 16),
    ('96kHz/24bit\\\n(studio)', 96000, 24),
    ('192kHz/32bit\\\n(master)', 192000, 32),
]

names = [c[0] for c in configs]
sizes_mb = [c[1] * (c[2] / 8) * duration_sec / (1024 * 1024) for c in configs]
bar_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

bars = ax4.barh(range(len(names)), sizes_mb, color=bar_colors, alpha=0.8)
ax4.set_yticks(range(len(names)))
ax4.set_yticklabels(names, color='white', fontsize=9)
ax4.set_xlabel('File size for 3 min mono (MB)', color='white')
ax4.set_title('Storage cost of quality', color='white', fontsize=11)
ax4.tick_params(colors='gray')

for bar, size in zip(bars, sizes_mb):
    ax4.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
             f'{size:.1f} MB', color='white', fontsize=9, va='center')

plt.tight_layout()
plt.show()

print("Digital audio quality guide:")
print(f"{'Config':<25s} {'Max freq':<12s} {'Dynamic range':<15s} {'Size/min':<10s}")
print("-" * 62)
for name, sr, bits in [(n, s, b) for n, s, b in configs]:
    max_freq = sr // 2
    dyn_range = bits * 6.02
    size_per_min = sr * (bits/8) / (1024*1024) * 60
    clean_name = name.replace('\\\n', ' ')
    print(f"{clean_name:<25s} {max_freq:<12,d} Hz {dyn_range:<15.0f} dB {size_per_min:<10.1f} MB")`,
      challenge: 'Calculate the total storage needed for every song on Spotify (~100 million songs, average 3.5 minutes) at CD quality vs. MP3 320kbps. Why does compression matter at scale?',
      successHint: 'The tension between quality and file size drives the entire digital audio industry. CD quality was the gold standard for 30 years. Streaming services use compressed formats to save bandwidth. Audiophiles insist on lossless. The math you just explored is the foundation of every decision in that debate.',
    },
    {
      title: 'From bamboo to synthesizers — analog vs. digital sound',
      concept: `Liyo's bamboo flute is an **analog** instrument — it creates sound through physical vibration of air. A synthesizer is a **digital** instrument — it creates sound through mathematical computation. Both produce pressure waves that reach your ear. The question that has divided musicians for decades: can you tell the difference?

**Analog sound** is continuous — the air pressure changes smoothly, with infinite resolution in both time and amplitude. A bamboo flute, a violin, a human voice are all analog. The sound is generated by physical resonance, and it carries the subtle imperfections and complexities of the physical world.

**Digital sound** is discrete — it exists as a sequence of numbers, sampled at fixed intervals, quantized to fixed precision. At CD quality (44.1 kHz, 16-bit), the approximation is so good that controlled listening tests consistently show most people cannot distinguish digital from analog.

The real advantage of digital is **control and reproducibility**. You can copy a digital signal perfectly (analog degrades with each copy). You can manipulate it precisely (equalize, compress, reverse, pitch-shift). You can store it indefinitely (tape deteriorates; a hard drive does not). You can transmit it globally (streaming).

Modern audio combines both worlds: record analog instruments with digital systems, process them with digital effects, and play them back through analog speakers. The bamboo flute and the synthesizer are not opponents — they are collaborators.`,
      analogy: 'Analog vs. digital is like painting vs. photography. A painting captures the artist\'s interpretation with continuous brushstrokes. A photograph captures reality as millions of discrete pixels. At high enough resolution, the photograph is indistinguishable from reality. At high enough sample rate and bit depth, digital audio is indistinguishable from analog. But a painting has something a photograph does not: the texture of the brush, the intention of the hand. Some argue analog sound has the same quality.',
      storyConnection: 'Liyo\'s bamboo flute carries the imperfections of hand-carved bamboo — tiny irregularities in the bore, natural variations in wall thickness, the grain of the wood. These imperfections give his flute its unique voice. A digital model of his flute could replicate the physics perfectly, but it would need to model those imperfections too. The irony: to make digital sound "natural," engineers add carefully calculated imperfections. Perfection sounds artificial; imperfection sounds real.',
      checkQuestion: 'Vinyl records are analog, and many audiophiles claim they sound "warmer" than CDs. Is there a scientific basis for this, or is it purely subjective?',
      checkAnswer: 'Both. Vinyl introduces specific, measurable distortions: harmonic distortion (adds subtle overtones), frequency roll-off (reduces harsh high frequencies), and surface noise (broadband rumble). These distortions are technically imperfections, but human ears may perceive them as pleasant — they add richness and reduce harshness. CDs are technically more accurate, but "accurate" and "preferred" are different things. The brain is not a measurement instrument.',
      codeIntro: 'Compare analog and digital representations of the same flute sound, and visualize the analog-to-digital conversion process.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate an "analog" bamboo flute sound (high-resolution)
sr_analog = 441000  # 10x oversampled as "analog" reference
duration = 0.01
t_analog = np.linspace(0, duration, int(sr_analog * duration), endpoint=False)

# Flute sound with natural imperfections
f0 = 440
# Slight vibrato (natural pitch wobble)
vibrato = 3 * np.sin(2 * np.pi * 5 * t_analog)  # 5 Hz vibrato, ±3 Hz
# Breath noise
noise = 0.03 * np.random.randn(len(t_analog))

analog = (1.0 * np.sin(2 * np.pi * (f0 + vibrato) * t_analog) +
          0.12 * np.sin(2 * np.pi * 2 * (f0 + vibrato) * t_analog) +
          0.04 * np.sin(2 * np.pi * 3 * (f0 + vibrato) * t_analog) +
          noise)
analog = analog / np.max(np.abs(analog))

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# 1. "Analog" waveform (continuous)
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(t_analog * 1000, analog, color='#f59e0b', linewidth=1, alpha=0.8)
ax1.set_title('Analog: continuous (bamboo flute)', color='white', fontsize=11)
ax1.set_xlabel('Time (ms)', color='white')
ax1.set_ylabel('Amplitude', color='white')
ax1.tick_params(colors='gray')

# 2. Digital sampling process
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
sr_digital = 44100
t_digital = np.linspace(0, duration, int(sr_digital * duration), endpoint=False)
# Resample
digital = np.interp(t_digital, t_analog, analog)
# Quantize to 16-bit
levels = 2 ** 16
digital_q = np.round(digital * (levels / 2 - 1)) / (levels / 2 - 1)

ax2.plot(t_analog * 1000, analog, color='#f59e0b', linewidth=0.5, alpha=0.3, label='Analog')
ax2.stem(t_digital[:50] * 1000, digital_q[:50], linefmt='#22c55e', markerfmt='o',
         basefmt='gray', label='Digital samples')
ax2.set_title('Sampling: analog → digital', color='white', fontsize=11)
ax2.set_xlabel('Time (ms)', color='white')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 2)  # zoom to 2ms

# 3. Reconstruction (digital back to "analog")
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Sinc interpolation (conceptually)
t_recon = np.linspace(0, duration, int(sr_analog * duration), endpoint=False)
recon = np.interp(t_recon, t_digital, digital_q)

ax3.plot(t_analog * 1000, analog, color='#f59e0b', linewidth=1, alpha=0.5, label='Original analog')
ax3.plot(t_recon * 1000, recon, color='#22c55e', linewidth=1.5, alpha=0.8, label='Reconstructed from digital')
ax3.set_title('Reconstruction: digital → analog', color='white', fontsize=11)
ax3.set_xlabel('Time (ms)', color='white')
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# 4. Error analysis
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
error = analog - recon
ax4.plot(t_analog * 1000, error, color='#ef4444', linewidth=0.5, alpha=0.7)
ax4.set_title(f'Reconstruction error (max: {np.max(np.abs(error)):.6f})', color='white', fontsize=11)
ax4.set_xlabel('Time (ms)', color='white')
ax4.set_ylabel('Error', color='white')
ax4.tick_params(colors='gray')

# Add SNR info
signal_power = np.mean(analog ** 2)
noise_power = np.mean(error ** 2)
if noise_power > 0:
    snr = 10 * np.log10(signal_power / noise_power)
    ax4.text(5, ax4.get_ylim()[1] * 0.8, f'SNR: {snr:.1f} dB', color='#22c55e', fontsize=11)

plt.tight_layout()
plt.show()

print("Analog vs. Digital comparison:")
print(f"  Analog 'sample rate': {sr_analog:,} (continuous approximation)")
print(f"  Digital sample rate: {sr_digital:,} Hz")
print(f"  Bit depth: 16-bit ({levels:,} levels)")
print(f"  Max reconstruction error: {np.max(np.abs(error)):.6f}")
if noise_power > 0:
    print(f"  Signal-to-noise ratio: {snr:.1f} dB")
print()
print("The journey of sound:")
print("  1. Liyo blows into bamboo → air vibrates (analog)")
print("  2. Microphone converts vibration → electrical signal (analog)")
print("  3. ADC samples signal → numbers (digital)")
print("  4. Storage/processing → manipulation (digital)")
print("  5. DAC converts numbers → electrical signal (analog)")
print("  6. Speaker converts signal → air vibration (analog)")
print("  7. Your ear receives vibration → you hear Liyo's flute")`,
      challenge: 'Increase the vibrato depth from 3 Hz to 20 Hz and the noise from 0.03 to 0.15. This simulates a more expressive, imperfect performance. How does the reconstruction error change? At what point does the digital version lose the character of the analog original?',
      successHint: 'From a boy carving bamboo on a Nagaland hillside to the mathematics of Fourier transforms and digital audio — the physics is the same. Liyo\'s flute vibrates air; your speaker vibrates air. The only difference is the path the signal takes. Understanding that path — analog to digital and back — is understanding modern audio engineering. You now speak both the language of bamboo and the language of code.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Audio Engineering — builds on Level 1 acoustics concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for audio engineering simulations. Click to start.</p>
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
