import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KuchipudiLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is sound? — vibrations that travel through air',
      concept: `When a Kuchipudi dancer stamps her foot, the ankle bells (**ghungroo**) vibrate rapidly. Each tiny bell swings back and forth, pushing air molecules together and pulling them apart. These alternating compressions and rarefactions travel outward as a **sound wave**.

Sound is a **longitudinal wave** — the air molecules oscillate back and forth in the same direction the wave travels. This is different from a water wave, where the surface moves up and down while the wave moves sideways. The speed of sound in air is about **343 m/s** at room temperature — fast enough to cross a concert hall in a fraction of a second.

In the code below, you will model a sound wave as a sine function. The wave has a **frequency** (how many cycles per second, measured in Hertz) and an **amplitude** (how loud the sound is). Together these two numbers describe the simplest possible sound.

📚 *A sine wave is a smooth, repeating curve described by the function y = A sin(2πft), where A is amplitude, f is frequency, and t is time.*`,
      analogy: 'Imagine a slinky stretched across a table. Push one end forward and pull it back — a pulse of compressed coils travels down the slinky. That is exactly how sound works in air: molecules are the coils, and your vibrating vocal cord (or ghungroo bell) is the hand pushing and pulling.',
      storyConnection: 'In Kuchipudi dance, the ghungroo anklet contains 100 to 200 small brass bells. When the dancer strikes the floor, dozens of bells vibrate simultaneously. Each bell has a slightly different size and therefore a slightly different frequency — this creates the rich, shimmering sound that audiences hear. Understanding frequency is the first step to understanding why ghungroo sound the way they do.',
      checkQuestion: 'If a ghungroo bell vibrates at 2000 Hz, how many times does it vibrate in one second? How many times in 0.5 seconds?',
      checkAnswer: '2000 times in one second (that is the definition of 2000 Hz). In 0.5 seconds it vibrates 2000 * 0.5 = 1000 times. Each vibration pushes a tiny pulse of compressed air outward.',
      codeIntro: 'Generate and display a sine wave representing a simple sound at different frequencies.',
      code: `import numpy as np

# Generate a simple sound wave (sine wave)
# y(t) = amplitude * sin(2 * pi * frequency * t)

sample_rate = 44100  # samples per second (CD quality)
duration = 0.01      # 10 milliseconds — enough to see the wave shape

t = np.linspace(0, duration, int(sample_rate * duration))

# Three different frequencies
frequencies = [440, 880, 1760]  # A4, A5, A6 — each is double the last
names = ["A4 (440 Hz)", "A5 (880 Hz)", "A6 (1760 Hz)"]

amplitude = 1.0

print("=== Sound Wave Generator ===")
print("Showing wave values at selected time points")
print()

for freq, name in zip(frequencies, names):
    wave = amplitude * np.sin(2 * np.pi * freq * t)
    # Show a few sample points
    print(name)
    print(f"  Period: {1/freq*1000:.3f} ms")
    print(f"  Wavelength in air: {343/freq:.2f} m")
    # Count zero crossings in our sample to verify frequency
    crossings = 0
    for i in range(1, len(wave)):
        if wave[i-1] * wave[i] < 0:
            crossings += 1
    cycles = crossings / 2
    measured_freq = cycles / duration
    print(f"  Expected cycles in {duration*1000:.0f} ms: {freq * duration:.1f}")
    print(f"  Measured cycles: {cycles:.1f}")
    print()

print("Notice: doubling the frequency halves the period and wavelength.")
print("This doubling relationship is called an OCTAVE in music.")`,
      challenge: 'Add a frequency of 220 Hz (A3) and 110 Hz (A2) to the list. What pattern do you see in the wavelengths? If a room is 5 metres wide, which of these notes has a wavelength close to the room size? (This matters for acoustics — resonance occurs when wavelength matches room dimensions.)',
      successHint: 'You just generated the mathematical representation of sound. Every audio file on your phone — music, podcasts, voice calls — is stored as a sequence of amplitude values sampled at 44,100 times per second, exactly as you computed here.',
    },
    {
      title: 'Frequency and pitch — why small bells sound higher',
      concept: `Pitch is our perception of **frequency**. A bell that vibrates 2000 times per second (2000 Hz) sounds higher-pitched than one vibrating at 500 Hz. In a ghungroo anklet, the smaller bells vibrate faster and produce higher pitches, while the larger bells vibrate slower and produce lower pitches.

The relationship between a bell's size and its frequency follows a physical law: **frequency is inversely proportional to size**. Halve the diameter of a bell and its frequency roughly doubles. This is because a smaller object has less mass and a shorter distance for vibrations to travel.

Human hearing spans roughly **20 Hz to 20,000 Hz**. Musical instruments operate in the middle of this range. The ghungroo bells produce frequencies between about **1,000 Hz and 5,000 Hz** — right in the range where human hearing is most sensitive.

📚 *Inverse proportionality means when one quantity doubles, the other halves. If frequency is inversely proportional to length, then a bell half the size rings at twice the frequency.*`,
      analogy: 'Think of guitar strings. A short, thin string vibrates quickly and sounds high (like the high E string). A long, thick string vibrates slowly and sounds low (like the low E string). Ghungroo bells follow the same rule: small bells ring high, large bells ring low.',
      storyConnection: 'Master ghungroo makers in Andhra Pradesh carefully select bells of varying sizes. They do not want all bells to sound the same — the mix of frequencies is what gives the ghungroo its characteristic shimmer. A skilled dancer can control which bells ring louder by adjusting the angle and force of her foot strike, effectively playing the anklet like an instrument.',
      checkQuestion: 'If a bell with diameter 8 mm vibrates at 3000 Hz, roughly what frequency would a bell with diameter 4 mm produce?',
      checkAnswer: 'Since frequency is inversely proportional to diameter, halving the diameter doubles the frequency: approximately 6000 Hz. In practice the relationship is not perfectly inverse due to material thickness and shape, but the principle holds.',
      codeIntro: 'Model how bell size affects pitch and explore the frequency range of a ghungroo anklet.',
      code: `import numpy as np

# Model bell frequency vs diameter
# Frequency is roughly inversely proportional to diameter
# f = k / d, where k is a material constant

k_brass = 24.0  # constant for brass bells (fitted to real data)

# Typical ghungroo bell diameters (in mm)
diameters_mm = np.array([4, 5, 6, 7, 8, 9, 10, 12, 14, 16])

# Calculate frequency for each diameter
frequencies = k_brass / (diameters_mm / 1000)  # convert mm to m

print("=== Ghungroo Bell Frequency vs Size ===")
print(f"{'Diameter (mm)':<16} {'Frequency (Hz)':>15} {'Musical Note':>14}")
print("-" * 47)

# Simple note lookup
def freq_to_note(f):
    notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    if f <= 0:
        return "---"
    semitones = 12 * np.log2(f / 440.0)
    note_idx = int(round(semitones)) % 12
    octave = 4 + int(round(semitones + 9)) // 12
    return notes[note_idx] + str(octave)

for d, f in zip(diameters_mm, frequencies):
    print(f"{d:<16} {f:>13.0f} {freq_to_note(f):>14}")

print()
print("=== Frequency Ratios ===")
print(f"Smallest / Largest bell: {frequencies[0]/frequencies[-1]:.1f}x")
print(f"This spans {12 * np.log2(frequencies[0]/frequencies[-1]):.0f} semitones")
print(f"  = {12 * np.log2(frequencies[0]/frequencies[-1]) / 12:.1f} octaves")

print()
# Human hearing sensitivity peaks around 2000-4000 Hz
print("Human hearing is most sensitive at 2000-4000 Hz.")
in_range = [(d, f) for d, f in zip(diameters_mm, frequencies)
            if 2000 <= f <= 4000]
print(f"Bells in the peak sensitivity range: {len(in_range)}")
for d, f in in_range:
    print(f"  {d} mm -> {f:.0f} Hz")`,
      challenge: 'What if the bells were made of steel instead of brass? Steel is stiffer, so k_steel might be about 30.0. Recalculate the frequencies. How does the material change the pitch range? Also try k_copper = 20.0 for softer copper bells.',
      successHint: 'You just discovered the inverse relationship between size and frequency — one of the most fundamental principles in acoustics. This same law governs organ pipes, flutes, drums, and even the resonant frequency of buildings during earthquakes.',
    },
    {
      title: 'Amplitude and loudness — the energy in a sound wave',
      concept: `**Amplitude** is the maximum displacement of air molecules from their resting position. It determines **loudness** — a larger amplitude means a louder sound. When a dancer stamps hard, the bells swing wider and push more air, creating a louder sound.

Loudness is measured in **decibels (dB)**, a logarithmic scale. Every increase of 10 dB sounds roughly twice as loud to human ears. A whisper is about 30 dB. Normal conversation is 60 dB. A Kuchipudi performance might reach 80 dB during vigorous footwork.

The energy carried by a sound wave is proportional to the **square** of its amplitude. This means doubling the amplitude quadruples the energy. This is why a dancer who stamps twice as hard does not just sound twice as loud — the sound carries four times the energy.

📚 *The decibel scale is logarithmic: dB = 20 log10(amplitude / reference_amplitude). A 6 dB increase means the amplitude has doubled.*`,
      analogy: 'Imagine dropping a pebble into a pond versus dropping a bowling ball. Both create circular ripples, but the bowling ball creates much taller waves. The height of the ripple is the amplitude. Taller ripples carry more energy — they can rock a toy boat further. Similarly, louder sounds carry more energy and vibrate your eardrum more.',
      storyConnection: 'In Kuchipudi, dynamics (loud vs soft) are as important as rhythm. A dancer builds intensity by gradually increasing the force of her stamps — pianissimo to fortissimo. The ghungroo respond proportionally: gentle taps produce a soft shimmer (low amplitude), while powerful stamps produce a commanding ring (high amplitude). The dancer controls the sound energy reaching the audience.',
      checkQuestion: 'If a gentle stamp produces a sound at 60 dB and a hard stamp produces 80 dB, how many times louder does the hard stamp sound? How many times more energy does it carry?',
      checkAnswer: 'The difference is 20 dB. Every 10 dB sounds twice as loud, so 20 dB sounds 2 x 2 = 4 times louder. In terms of energy: 20 dB means the amplitude is 10 times larger (20 = 20 log10(10)), so the energy is 10 squared = 100 times greater.',
      codeIntro: 'Explore how amplitude relates to loudness in decibels and sound energy.',
      code: `import numpy as np

# Amplitude, loudness, and energy relationships

# Reference amplitude (threshold of hearing)
ref_amplitude = 2e-5  # 20 micropascals (Pa)

def amplitude_to_db(amp):
    """Convert amplitude (Pa) to decibels (dB SPL)"""
    return 20 * np.log10(amp / ref_amplitude)

def db_to_amplitude(db):
    """Convert decibels back to amplitude"""
    return ref_amplitude * 10 ** (db / 20)

# Common sound levels
sounds = [
    ("Threshold of hearing", 0),
    ("Rustling leaves", 20),
    ("Whisper", 30),
    ("Quiet ghungroo (gentle tap)", 50),
    ("Normal conversation", 60),
    ("Moderate ghungroo (walking)", 65),
    ("Loud ghungroo (stamping)", 80),
    ("Full Kuchipudi performance", 85),
    ("Rock concert", 110),
    ("Pain threshold", 130),
]

print("=== Sound Levels and Energy ===")
print(f"{'Sound':<35} {'dB':>5} {'Amplitude (Pa)':>15} {'Energy Ratio':>13}")
print("-" * 70)

for name, db in sounds:
    amp = db_to_amplitude(db)
    # Energy proportional to amplitude squared
    energy_ratio = (amp / ref_amplitude) ** 2
    print(f"{name:<35} {db:>5} {amp:>15.6f} {energy_ratio:>13.0f}x")

print()
print("=== Dancer Dynamics ===")
# Simulate a dancer increasing stamp intensity
stamp_forces = [0.2, 0.4, 0.6, 0.8, 1.0]  # relative force
base_amplitude = 0.01  # Pa at minimum force

print(f"{'Stamp Force':<15} {'Amplitude (Pa)':>15} {'Loudness (dB)':>15} {'Energy':>10}")
print("-" * 57)

for force in stamp_forces:
    amp = base_amplitude * force
    db = amplitude_to_db(amp)
    energy = amp ** 2
    print(f"{force:<15.1f} {amp:>15.6f} {db:>13.1f} {energy:>10.2e}")

print()
print("Doubling the force doubles the amplitude,")
print("adds 6 dB of loudness, and quadruples the energy.")`,
      challenge: 'A dancer starts at 50 dB and wants to reach 80 dB. By what factor must she increase her stamp amplitude? (Hint: 80 - 50 = 30 dB. Use the formula: amplitude_ratio = 10^(dB_difference/20).) Verify your answer with the code.',
      successHint: 'The logarithmic decibel scale appears throughout engineering — from electronics (signal gain) to earthquake measurement (Richter scale) to astronomy (stellar magnitude). The pattern is always the same: our senses respond logarithmically to physical stimuli.',
    },
    {
      title: 'Wavelength and the speed of sound — how far between peaks',
      concept: `Every sound wave has a **wavelength** — the physical distance between one compression and the next. Wavelength, frequency, and the speed of sound are connected by a simple equation: **wavelength = speed / frequency**, or **λ = v / f**.

In air at room temperature, the speed of sound is about **343 m/s**. A low note at 100 Hz has a wavelength of 343 / 100 = 3.43 metres — about the length of a car. A high ghungroo bell at 4000 Hz has a wavelength of 343 / 4000 = 0.086 metres = 8.6 centimetres — about the length of your palm.

Wavelength matters because it determines how sound interacts with obstacles. Sound waves **diffract** (bend around) obstacles that are smaller than their wavelength and are **blocked** by obstacles larger than their wavelength. This is why you can hear bass notes around corners but high notes are more directional.

📚 *The equation v = f × λ (speed = frequency × wavelength) applies to all waves: sound, light, water, radio. It is one of the most universal equations in physics.*`,
      analogy: 'Imagine ocean waves approaching a harbour wall with a gap. Long waves (large wavelength) spread through the gap and fill the harbour. Short choppy waves pass straight through without spreading. Sound behaves the same way: long-wavelength bass bends around pillars and walls, while short-wavelength treble travels in straight lines like a spotlight.',
      storyConnection: 'In an open-air Kuchipudi performance, low-frequency drum sounds can be heard from far away because their long wavelengths diffract around trees and walls. But the high-frequency ghungroo detail is lost at a distance because those short wavelengths are absorbed and scattered. This is why traditional performances place the audience close — to hear the full frequency range of the bells.',
      checkQuestion: 'A ghungroo bell rings at 3000 Hz. What is its wavelength in air? Would this sound diffract around a pillar that is 30 cm wide?',
      checkAnswer: 'Wavelength = 343 / 3000 = 0.114 m = 11.4 cm. The pillar is 30 cm, which is larger than the wavelength. So the sound will NOT diffract much around it — the pillar will cast an acoustic shadow. A listener behind the pillar would hear less of this bell.',
      codeIntro: 'Calculate wavelength for different frequencies and explore how sound interacts with obstacles.',
      code: `import numpy as np

# Speed of sound in different media
media = {
    "Air (20C)": 343,
    "Air (0C)": 331,
    "Water": 1480,
    "Steel": 5960,
    "Wood (oak)": 3850,
    "Bone": 4080,
}

print("=== Speed of Sound in Different Media ===")
for medium, speed in media.items():
    print(f"  {medium:<16} {speed:>6} m/s")

print()
print("=== Wavelength Calculator (in air at 20C) ===")
speed_air = 343

# Ghungroo frequency range
frequencies = [100, 250, 500, 1000, 2000, 3000, 4000, 5000, 10000, 20000]

print(f"{'Frequency (Hz)':<16} {'Wavelength':>12} {'Comparison':>30}")
print("-" * 60)

for f in frequencies:
    wl = speed_air / f
    # Human-friendly comparison
    if wl >= 1:
        comparison = "length of a car" if wl > 3 else "arm length"
    elif wl >= 0.1:
        comparison = "hand width" if wl >= 0.08 else "finger width"
    elif wl >= 0.01:
        comparison = "coin diameter"
    else:
        comparison = "grain of rice"

    if wl >= 1:
        print(f"{f:<16} {wl:>9.2f} m   ~ {comparison}")
    else:
        print(f"{f:<16} {wl*100:>8.1f} cm   ~ {comparison}")

print()
print("=== Diffraction Around Obstacles ===")
obstacle_sizes = [0.05, 0.10, 0.30, 1.0, 3.0]  # metres
bell_freq = 3000
bell_wl = speed_air / bell_freq
drum_freq = 200
drum_wl = speed_air / drum_freq

print(f"Ghungroo bell at {bell_freq} Hz (wavelength {bell_wl*100:.1f} cm)")
print(f"Mridangam drum at {drum_freq} Hz (wavelength {drum_wl:.1f} m)")
print()
for size in obstacle_sizes:
    bell_diff = "diffracts" if bell_wl > size else "BLOCKED"
    drum_diff = "diffracts" if drum_wl > size else "BLOCKED"
    print(f"  Obstacle {size:.2f} m: Bell = {bell_diff:<10} Drum = {drum_diff}")`,
      challenge: 'The speed of sound increases with temperature: v = 331 + 0.6 * T (where T is in Celsius). On a hot summer day at 40 degrees C, what is the speed of sound? How does this change the wavelength of a 3000 Hz bell? Would an outdoor performance sound different in summer vs winter?',
      successHint: 'The wave equation v = f * lambda is truly universal. Light, radio, WiFi, X-rays, and gravitational waves all follow the same relationship. You have just learned one of the most powerful equations in all of physics.',
    },
    {
      title: 'Superposition — what happens when many bells ring at once',
      concept: `A ghungroo anklet has over 100 bells, each ringing at a slightly different frequency. When two waves meet, they **add together** — this is the **superposition principle**. At any point in space, the total air pressure is the sum of the pressures from each individual wave.

When two waves are **in phase** (peaks align with peaks), they add constructively — the result is louder. When they are **out of phase** (peaks align with troughs), they cancel — the result is quieter. This is called **interference**.

When many frequencies combine, the result is a **complex waveform** — no longer a simple sine wave. The rich, shimmering quality of ghungroo comes from the superposition of many slightly different frequencies. If all bells were identical, the sound would be a pure tone — pleasant but thin. The variation creates richness.

📚 *Superposition: the combined effect of overlapping waves equals the sum of the individual waves. This principle applies to all waves — sound, light, water, and even quantum mechanics.*`,
      analogy: 'Drop two pebbles into a pond at the same time. Where two ripple crests meet, the water rises extra high (constructive interference). Where a crest meets a trough, the water stays flat (destructive interference). The complex ripple pattern you see is the superposition of two simple circular waves.',
      storyConnection: 'The master ghungroo craftsman deliberately uses bells that are slightly different in size. If all 100 bells were identical, they would produce a single sharp tone that could be fatiguing. The slight variation means the frequencies are close but not identical, creating a shimmering chorus effect — similar to how a choir of slightly different voices sounds richer than a single amplified voice.',
      checkQuestion: 'Two identical bells ring at 3000 Hz, perfectly in phase. What is the combined amplitude? What if they are perfectly out of phase?',
      checkAnswer: 'In phase: the amplitudes add, so the combined amplitude is double that of one bell (6 dB louder). Out of phase: the amplitudes cancel to zero — silence. In practice, perfect cancellation is rare because the bells are never exactly the same frequency.',
      codeIntro: 'Combine multiple sine waves to simulate the sound of many ghungroo bells ringing together.',
      code: `import numpy as np

# Superposition of multiple bell frequencies
sample_rate = 44100
duration = 0.05  # 50 ms

t = np.linspace(0, duration, int(sample_rate * duration))

# Single bell (pure tone)
single_bell = np.sin(2 * np.pi * 3000 * t)

# Multiple bells with slightly different frequencies (realistic ghungroo)
np.random.seed(42)
num_bells = 50
base_freq = 3000
# Each bell varies by up to +/- 200 Hz from the base
bell_frequencies = base_freq + np.random.uniform(-200, 200, num_bells)

combined = np.zeros_like(t)
for freq in bell_frequencies:
    combined += np.sin(2 * np.pi * freq * t)
combined /= num_bells  # normalize

print("=== Superposition of Ghungroo Bells ===")
print(f"Number of bells: {num_bells}")
print(f"Frequency range: {bell_frequencies.min():.0f} - {bell_frequencies.max():.0f} Hz")
print(f"Mean frequency: {bell_frequencies.mean():.0f} Hz")
print()

# Compare pure tone vs combined
print("=== Waveform Comparison (first 20 samples) ===")
print(f"{'Sample':<8} {'Pure Tone':>12} {'50 Bells':>12} {'Difference':>12}")
print("-" * 46)
for i in range(0, 20):
    diff = combined[i] - single_bell[i]
    print(f"{i:<8} {single_bell[i]:>12.4f} {combined[i]:>12.4f} {diff:>12.4f}")

print()
# Measure complexity: standard deviation of differences
diff_signal = combined - single_bell
complexity = np.std(diff_signal)
print(f"Waveform complexity (std of difference): {complexity:.4f}")
print()

# Constructive and destructive interference
print("=== Interference Demo ===")
wave_a = np.sin(2 * np.pi * 3000 * t)
wave_b = np.sin(2 * np.pi * 3000 * t)  # same frequency, in phase
constructive = wave_a + wave_b

wave_c = np.sin(2 * np.pi * 3000 * t + np.pi)  # opposite phase
destructive = wave_a + wave_c

print(f"Single wave peak amplitude: {np.max(np.abs(wave_a)):.2f}")
print(f"Constructive (in phase) peak: {np.max(np.abs(constructive)):.2f}")
print(f"Destructive (anti-phase) peak: {np.max(np.abs(destructive)):.6f}")
print()
print("In phase: amplitude doubles (6 dB louder)")
print("Anti-phase: amplitude cancels to zero (silence)")`,
      challenge: 'Try changing the frequency spread from +/- 200 Hz to +/- 50 Hz (bells are more similar) and +/- 500 Hz (bells are very different). How does the waveform complexity change? What sounds better in a real anklet — tightly matched or widely varied bells?',
      successHint: 'Superposition is one of the most powerful principles in physics. Noise-cancelling headphones work by generating a wave that is exactly out of phase with incoming noise — destructive interference eliminates the sound. You just learned the physics behind a billion-dollar technology.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Sound waves and vibrations through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model sound waves, frequency, amplitude, and superposition.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
