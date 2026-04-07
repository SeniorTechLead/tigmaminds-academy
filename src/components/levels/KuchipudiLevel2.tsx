import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KuchipudiLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Resonance — when a vibration amplifies itself',
      concept: `Every object has a **natural frequency** — the frequency at which it vibrates most easily. Push a child on a swing at exactly the right moment and the swing goes higher and higher. This is **resonance**: when an external force matches an object's natural frequency, energy accumulates and the amplitude grows dramatically.

A ghungroo bell has a natural frequency determined by its size, shape, and material. When the dancer's foot strike sends a vibration at that exact frequency through the bell, it rings loudly. At other frequencies, the bell barely responds. This selective amplification is what makes each bell's sound distinct.

Resonance can be constructive (musical instruments, bells) or destructive (bridges collapsing, wine glasses shattering). The key parameter is the **quality factor Q** — a measure of how sharply tuned the resonance is. A high-Q system resonates strongly at one frequency and ignores others. A low-Q system responds to a wide range of frequencies.

📚 *Quality factor Q = resonant_frequency / bandwidth. A bell with Q = 100 at 3000 Hz responds to frequencies within 3000/100 = 30 Hz of its resonant frequency.*`,
      analogy: 'Imagine pushing someone on a swing. If you push at random times, the swing barely moves. But if you push at exactly the right moment — when the swing reaches its peak and starts to come back — each push adds energy and the swing goes higher. That "right moment" is the swing natural period, and matching it is resonance.',
      storyConnection: 'When a Kuchipudi dancer strikes the floor, the impact contains many frequencies (like a drum hit). Each ghungroo bell "selects" its own natural frequency from that broadband impulse and rings at that pitch. This is why a single foot stamp produces a chord of many pitches simultaneously — each bell is a resonator tuned to its own frequency.',
      checkQuestion: 'A bell has a natural frequency of 2500 Hz and Q = 80. What is its bandwidth (the range of frequencies it responds to)?',
      checkAnswer: 'Bandwidth = resonant frequency / Q = 2500 / 80 = 31.25 Hz. The bell responds to frequencies from about 2484 Hz to 2516 Hz and ignores everything outside that narrow band.',
      codeIntro: 'Model resonance: how a driven oscillator responds at different frequencies.',
      code: `import numpy as np

# Resonance response of a bell (driven harmonic oscillator)
def resonance_response(drive_freq, natural_freq, Q):
    """
    Amplitude response of a damped harmonic oscillator.
    Peak at drive_freq = natural_freq, width controlled by Q.
    """
    ratio = drive_freq / natural_freq
    denominator = np.sqrt((1 - ratio**2)**2 + (ratio / Q)**2)
    return 1.0 / denominator

# A ghungroo bell with natural frequency 3000 Hz
f_natural = 3000  # Hz
Q_values = [10, 50, 200]

# Sweep driving frequency from 1000 to 5000 Hz
f_drive = np.linspace(1000, 5000, 500)

print("=== Resonance Response of a Brass Bell ===")
print(f"Natural frequency: {f_natural} Hz")
print()

for Q in Q_values:
    response = resonance_response(f_drive, f_natural, Q)
    peak = np.max(response)
    bandwidth = f_natural / Q

    # Find -3dB points (where response drops to 70.7% of peak)
    half_power = peak / np.sqrt(2)
    above = f_drive[response >= half_power]

    print(f"Q = {Q:>4}: Peak amplitude = {peak:>6.1f}x | "
          f"Bandwidth = {bandwidth:>6.1f} Hz | "
          f"Range: {above[0]:.0f} - {above[-1]:.0f} Hz")

print()
print("=== Multiple Bells (Chord of Resonances) ===")

bells = [
    {"name": "Bell A", "freq": 2400, "Q": 80},
    {"name": "Bell B", "freq": 2800, "Q": 100},
    {"name": "Bell C", "freq": 3200, "Q": 60},
    {"name": "Bell D", "freq": 3600, "Q": 90},
    {"name": "Bell E", "freq": 4000, "Q": 70},
]

# Apply a broadband impulse (all frequencies equally)
f_sweep = np.linspace(2000, 4500, 300)

print(f"{'Freq (Hz)':<12}", end="")
for b in bells:
    print(f" {b['name']:>8}", end="")
print(f" {'Total':>8}")
print("-" * 60)

for f in [2400, 2800, 3000, 3200, 3600, 4000]:
    idx = np.argmin(np.abs(f_sweep - f))
    total = 0
    row = f"{f:<12}"
    for b in bells:
        r = resonance_response(f, b["freq"], b["Q"])
        total += r
        row += f" {r:>8.1f}"
    row += f" {total:>8.1f}"
    print(row)

print()
print("Each bell resonates strongly only near its natural frequency.")
print("The combined response gives the ghungroo its rich timbre.")`,
      challenge: 'Add a sixth bell at 3000 Hz with Q = 200 (very sharp resonance). How does it change the total response at 3000 Hz vs 3100 Hz? What would happen if ALL bells had the same frequency? (Hint: it would sound like a single loud tone, not a shimmer.)',
      successHint: 'Resonance is everywhere: radio tuners use it to select one station from thousands of signals, MRI machines use nuclear magnetic resonance to image your body, and microwave ovens resonate water molecules to heat food. You have just modeled the same physics.',
    },
    {
      title: 'Harmonics — the hidden frequencies inside a single note',
      concept: `When a bell rings, it does not produce just one frequency. It produces a **fundamental frequency** (the lowest and usually loudest) plus a series of **harmonics** — higher frequencies that are (approximately) integer multiples of the fundamental. The 2nd harmonic is 2x the fundamental, the 3rd is 3x, and so on.

These harmonics are what give each instrument its distinctive **timbre** (tone color). A flute and a trumpet can play the same note (same fundamental frequency) but sound completely different because they produce different relative strengths of harmonics.

A brass ghungroo bell produces a rich set of harmonics. The fundamental might be 2500 Hz, with the 2nd harmonic at 5000 Hz, the 3rd at 7500 Hz, and so on. The relative strengths of these harmonics give the bell its characteristic bright, metallic ring.

📚 *Harmonics arise because a vibrating object can vibrate in multiple patterns (modes) simultaneously. The fundamental is the simplest mode; each harmonic adds a more complex vibration pattern on top.*`,
      analogy: 'Pluck a guitar string and watch it closely. You can see the string vibrating in a large arc (the fundamental). But it is also vibrating in halves, thirds, and quarters simultaneously — these smaller vibrations are the harmonics. Your ear hears all of them combined into one rich tone.',
      storyConnection: 'The brightness of brass ghungroo comes from strong upper harmonics. If you were to coat the bells with rubber (damping the harmonics), they would sound dull and thuddy. Traditional ghungroo makers polish the bells to a smooth finish not just for appearance — a smooth surface allows the metal to vibrate freely, preserving the harmonics that give the bells their ring.',
      checkQuestion: 'A bell has a fundamental frequency of 2000 Hz. What are its first four harmonics?',
      checkAnswer: '1st harmonic (fundamental): 2000 Hz. 2nd harmonic: 4000 Hz. 3rd harmonic: 6000 Hz. 4th harmonic: 8000 Hz. Each is an integer multiple of the fundamental. In practice, real bells are not perfectly harmonic — the ratios may be 2.1x or 2.9x instead of exactly 2x and 3x.',
      codeIntro: 'Build a tone from harmonics and see how different harmonic profiles create different timbres.',
      code: `import numpy as np

# Harmonics: building complex tones from sine waves
sample_rate = 44100
duration = 0.02  # 20 ms

t = np.linspace(0, duration, int(sample_rate * duration))

fundamental = 2500  # Hz (typical ghungroo bell)

# Different harmonic profiles (relative amplitudes)
timbres = {
    "Pure tone (no harmonics)": [1.0],
    "Brass bell (strong harmonics)": [1.0, 0.6, 0.4, 0.3, 0.2, 0.1],
    "Soft bell (weak harmonics)": [1.0, 0.2, 0.05, 0.01],
    "Nasal (odd harmonics only)": [1.0, 0, 0.33, 0, 0.2, 0, 0.14],
    "Square-ish (odd, equal)": [1.0, 0, 1.0, 0, 1.0, 0, 1.0],
}

print("=== Harmonic Profiles ===")
print(f"Fundamental: {fundamental} Hz")
print()

for name, harmonics in timbres.items():
    # Build the waveform
    wave = np.zeros_like(t)
    for n, amp in enumerate(harmonics):
        freq = fundamental * (n + 1)
        wave += amp * np.sin(2 * np.pi * freq * t)

    # Normalize
    wave /= np.max(np.abs(wave))

    # Measure complexity (crest factor)
    rms = np.sqrt(np.mean(wave**2))
    crest = np.max(np.abs(wave)) / rms

    # Count harmonics present
    active = sum(1 for a in harmonics if a > 0.01)

    print(f"{name}")
    print(f"  Harmonics present: {active}")
    print(f"  Frequencies: {', '.join(str(fundamental * (i+1)) for i, a in enumerate(harmonics) if a > 0.01)} Hz")
    print(f"  Crest factor: {crest:.2f} (1.41 = pure sine)")
    print(f"  RMS amplitude: {rms:.3f}")
    print()

# Show how harmonics add up at specific time points
print("=== Waveform Build-Up (Brass Bell at t=0.001s) ===")
t_sample = 0.001
cumulative = 0
brass = [1.0, 0.6, 0.4, 0.3, 0.2, 0.1]
print(f"{'Harmonic':<14} {'Freq':>8} {'Amplitude':>10} {'Cumulative':>12}")
print("-" * 46)
for n, amp in enumerate(brass):
    freq = fundamental * (n + 1)
    value = amp * np.sin(2 * np.pi * freq * t_sample)
    cumulative += value
    print(f"  {n+1}{'st' if n==0 else 'nd' if n==1 else 'rd' if n==2 else 'th':<11} {freq:>8} Hz {value:>10.4f} {cumulative:>12.4f}")`,
      challenge: 'Create a "rich ghungroo" timbre with 10 harmonics where each harmonic has amplitude 1/n (1st = 1.0, 2nd = 0.5, 3rd = 0.33, etc.). This is called a sawtooth-like spectrum. Compare its crest factor and RMS to the other timbres.',
      successHint: 'Every sound you hear — voice, music, traffic — is a sum of harmonics at different strengths. Understanding harmonics is the foundation of audio engineering, music production, and speech recognition.',
    },
    {
      title: 'Standing waves — vibration patterns on a fixed object',
      concept: `When a bell vibrates, waves travel across its surface, reflect off the edges, and travel back. The outgoing and returning waves **superimpose**. At certain frequencies, the waves align perfectly and create a **standing wave** — a pattern that appears to stand still, with fixed **nodes** (points of zero vibration) and **antinodes** (points of maximum vibration).

Standing waves only form at specific frequencies — the **resonant frequencies** of the object. For a simple string fixed at both ends, the resonant frequencies are: f_n = n * v / (2L), where n = 1, 2, 3..., v is the wave speed on the string, and L is the string length.

A bell is more complex than a string, but the principle is the same: only certain vibration patterns are allowed. Each pattern (called a **mode**) corresponds to a specific frequency. The first mode is the fundamental; higher modes are the overtones that give the bell its character.

📚 *A node is a point that never moves. An antinode is a point that moves the most. In a guitar string, the ends are always nodes (they are fixed); the middle is an antinode for the fundamental mode.*`,
      analogy: 'Shake a jump rope held by a friend. At the right speed, the rope forms a smooth arch — one hump (the fundamental mode). Shake faster and you get two humps. Faster still, three humps. Each pattern is a standing wave. The points between humps (where the rope barely moves) are nodes.',
      storyConnection: 'When a ghungroo bell is struck, its rim vibrates in standing wave patterns. The simplest pattern has two nodes and two antinodes around the rim — the rim flexes into an oval shape, alternating between two perpendicular ovals. Higher modes create more complex patterns with more nodes. The mix of active modes determines the bell timbre.',
      checkQuestion: 'A string is 0.5 m long with wave speed 200 m/s. What are the first three resonant frequencies?',
      checkAnswer: 'f_1 = 1 * 200 / (2 * 0.5) = 200 Hz. f_2 = 2 * 200 / (2 * 0.5) = 400 Hz. f_3 = 3 * 200 / (2 * 0.5) = 600 Hz. Each resonant frequency is an integer multiple of the fundamental — exactly the harmonic series.',
      codeIntro: 'Simulate standing wave patterns on a vibrating string and visualize the mode shapes.',
      code: `import numpy as np

# Standing waves on a string fixed at both ends
# Mode n: y(x, t) = sin(n * pi * x / L) * cos(2 * pi * f_n * t)

L = 1.0      # string length (m)
v = 200.0    # wave speed (m/s)
num_points = 200

x = np.linspace(0, L, num_points)

print("=== Standing Wave Modes ===")
print(f"String length: {L} m | Wave speed: {v} m/s")
print()

for n in range(1, 7):
    freq = n * v / (2 * L)
    wavelength = 2 * L / n
    nodes = n + 1  # including endpoints
    antinodes = n

    # Mode shape (snapshot at t=0, when cos = 1)
    mode_shape = np.sin(n * np.pi * x / L)

    # Find node positions (where mode_shape is near zero, excluding endpoints)
    node_positions = []
    for i in range(1, n):
        node_positions.append(i * L / n)

    print(f"Mode {n}: f = {freq:.0f} Hz | lambda = {wavelength:.3f} m | "
          f"Nodes: {nodes} | Antinodes: {antinodes}")
    if node_positions:
        pos_str = ", ".join(f"{p:.3f}" for p in node_positions)
        print(f"  Interior node positions: {pos_str} m")

    # Show mode shape as text visualization
    width = 50
    mid = width // 2
    row = [" "] * width
    for xi, yi in zip(x, mode_shape):
        col = int(xi / L * (width - 1))
        bar = int(yi * (mid - 1))
        if 0 <= col < width:
            row[col] = "|" if abs(yi) > 0.5 else "." if abs(yi) > 0.1 else " "
    print(f"  Shape: [{''.join(row)}]")
    print()

# Bell modes (2D, not simple string harmonics)
print("=== Bell Rim Vibration Modes ===")
print("A bell rim vibrates in 2D — modes are labeled (m,n)")
print("where m = circumferential nodes, n = radial nodes")
print()

bell_modes = [
    (2, 0, 1.00, "Fundamental — rim flexes into oval"),
    (3, 0, 1.65, "Rim flexes into triangle shape"),
    (4, 0, 2.44, "Rim flexes into square shape"),
    (2, 1, 3.01, "Oval with one radial node"),
    (5, 0, 3.36, "Rim flexes into pentagon"),
]

f_fund = 2500  # fundamental frequency
print(f"{'Mode':<10} {'Ratio':>8} {'Frequency':>12} {'Description'}")
print("-" * 65)
for m, n, ratio, desc in bell_modes:
    freq = f_fund * ratio
    print(f"({m},{n}){'':>5} {ratio:>8.2f} {freq:>10.0f} Hz  {desc}")`,
      challenge: 'For the string, what happens if you double the wave speed (stiffer string) but keep the length the same? What if you double the length but keep the speed? Predict first, then modify the code to verify. This is how instrument makers tune strings.',
      successHint: 'Standing waves explain why instruments have fixed pitches. A guitar string can only vibrate at its resonant frequencies — you cannot make it vibrate at an arbitrary frequency. This quantization of allowed frequencies is also the basis of quantum mechanics, where electrons form standing waves around atoms.',
    },
    {
      title: 'Beat frequency — when two close frequencies interact',
      concept: `When two waves with **slightly different frequencies** are played together, the listener hears a pulsing effect called **beats**. The volume rises and falls at the **beat frequency**, which equals the difference between the two frequencies: f_beat = |f1 - f2|.

If two bells ring at 3000 Hz and 3005 Hz, the beat frequency is 5 Hz — the combined sound pulses 5 times per second. This pulsing is the "shimmer" of ghungroo. If the frequencies are too far apart (say 3000 Hz and 3200 Hz), the beating is too fast to hear as a pulse and instead creates a sensation of roughness or dissonance.

Beats are a direct consequence of superposition. Adding two sine waves with frequencies f1 and f2 produces a wave with a carrier frequency of (f1+f2)/2 and an **envelope** that oscillates at (f1-f2)/2. The envelope is what you perceive as the beating.

📚 *Musicians use beats to tune instruments. When two strings are nearly in tune, you hear slow beats. As you adjust the strings closer together in pitch, the beats slow down and eventually disappear when the frequencies match exactly.*`,
      analogy: 'Imagine two clocks ticking at almost the same rate — one tick per second vs 1.02 ticks per second. Sometimes the ticks coincide (loud combined tick). Sometimes they are offset (the ticks seem to alternate). The pattern of coincidence and offset repeats every 50 seconds — that is the "beat" between the two clocks.',
      storyConnection: 'The shimmering sound of ghungroo is literally the beat frequencies between dozens of slightly detuned bells. A skilled ghungroo maker tests the set by shaking it and listening — if the shimmer is too slow (bells too similar), the sound lacks sparkle. If it is too fast (bells too different), the sound becomes harsh. The ideal shimmer rate is typically 3 to 10 beats per second.',
      checkQuestion: 'Two bells ring at 2990 Hz and 3010 Hz. What is the beat frequency? What is the perceived pitch?',
      checkAnswer: 'Beat frequency = |3010 - 2990| = 20 Hz, meaning the volume pulses 20 times per second. The perceived pitch is the average: (2990 + 3010) / 2 = 3000 Hz. So you hear a 3000 Hz tone that wobbles in volume 20 times per second.',
      codeIntro: 'Simulate beat frequencies and find the optimal shimmer rate for a ghungroo anklet.',
      code: `import numpy as np

# Beat frequency demonstration
sample_rate = 44100
duration = 0.5  # half second — enough to hear beats

t = np.linspace(0, duration, int(sample_rate * duration))

# Two bells with close frequencies
f1 = 3000
f2 = 3005
beat_freq = abs(f2 - f1)

wave1 = np.sin(2 * np.pi * f1 * t)
wave2 = np.sin(2 * np.pi * f2 * t)
combined = wave1 + wave2

# The envelope (what you hear as the beating)
envelope = 2 * np.cos(2 * np.pi * beat_freq / 2 * t)

print("=== Beat Frequency Demo ===")
print(f"Bell 1: {f1} Hz")
print(f"Bell 2: {f2} Hz")
print(f"Beat frequency: {beat_freq} Hz (pulses {beat_freq} times/sec)")
print(f"Perceived pitch: {(f1 + f2) / 2:.0f} Hz")
print()

# Show envelope at key time points
print("=== Envelope Over Time ===")
print(f"{'Time (ms)':<12} {'Envelope':>10} {'Perception':<20}")
print("-" * 44)
for ms in [0, 25, 50, 75, 100, 125, 150, 175, 200]:
    idx = int(ms / 1000 * sample_rate)
    if idx < len(envelope):
        env_val = abs(envelope[idx])
        if env_val > 1.8:
            perception = "LOUD (constructive)"
        elif env_val < 0.3:
            perception = "QUIET (destructive)"
        else:
            perception = "moderate"
        print(f"{ms:<12} {env_val:>10.2f} {perception}")

print()
print("=== Ghungroo Shimmer Analysis ===")
# Multiple bell pairs and their beat frequencies
bell_freqs = [2850, 2920, 2980, 3010, 3060, 3150]
print(f"Bells: {bell_freqs}")
print()

beat_freqs = []
print("Beat frequencies between all pairs:")
for i in range(len(bell_freqs)):
    for j in range(i + 1, len(bell_freqs)):
        bf = abs(bell_freqs[j] - bell_freqs[i])
        beat_freqs.append(bf)
        category = "shimmer" if bf < 15 else "roughness" if bf < 50 else "separate tones"
        print(f"  {bell_freqs[i]} & {bell_freqs[j]}: beat = {bf} Hz ({category})")

print()
avg_beat = np.mean(beat_freqs)
print(f"Average beat frequency: {avg_beat:.1f} Hz")
print(f"Shimmer quality: {'good' if 5 < avg_beat < 30 else 'too slow' if avg_beat <= 5 else 'too rough'}")`,
      challenge: 'Design a set of 5 bell frequencies that produces an "ideal shimmer" — average beat frequency between 5 and 10 Hz between adjacent bells, but no beats slower than 3 Hz (too sluggish). Print all pairwise beat frequencies and verify your design meets the criteria.',
      successHint: 'Beat frequencies are used in radar (measuring speed via Doppler beats), medical ultrasound (detecting blood flow), and radio technology (heterodyne receivers mix two frequencies to produce a beat at a desired intermediate frequency). The ghungroo anklet is a natural heterodyne instrument.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Resonance, harmonics, and standing waves</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model resonance, harmonics, standing waves, and beat frequencies.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
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
