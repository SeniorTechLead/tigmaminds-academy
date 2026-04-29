import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'sine-waves',
  title: 'Sine Waves',
  category: 'math',
  icon: '〰️',
  tagline: 'The building block of all waves',
  relatedStories: ['girl-who-spoke-to-elephants', 'bamboo-flute-of-nagaland', 'bamboo-taught-wind', 'dhol-drum', 'music-dimasa'],

  understand: [
    {
      title: 'The Circle Connection',
      beginnerContent:
        '**Tara on a swing.** Push her once and she swings back and forth. Plot her height against time — the result is a smooth, repeating curve. Not a zig-zag. Not a square wave. *A sine wave.*\n\n' +
        '[diagram:SwingPendulumScene]\n\n' +
        'Imagine a point moving around a circle at a steady speed, like a seat on a Ferris wheel. ' +
        'If you only watch the seat\'s height as the wheel spins and plot it against time, you get ' +
        'a smooth, repeating S-curve — that\'s a sine wave. The radius of the wheel determines how ' +
        'tall the wave is (amplitude), and the speed of rotation determines how quickly the wave ' +
        'repeats (frequency). Every sine wave is secretly a circle viewed from the side. This is ' +
        'why trigonometry (the math of triangles and circles) is at the heart of wave science.',
      intermediateContent:
        'A sine wave y = A sin(2πft + φ) has amplitude A, frequency f (Hz), and phase φ (radians). Period T = 1/f. Angular frequency ω = 2πf. For 440 Hz (middle A): T = 2.27 ms, ω = 2764.6 rad/s. Wavelength λ = v/f: sound at 440 Hz in air (343 m/s): λ = 0.78 m. Light at 5×10¹⁴ Hz: λ = 600 nm (orange). The unit circle connection: sin(θ) = y-coordinate of a point moving around a unit circle at constant angular velocity ω — the projection of circular motion onto a straight line is a sine wave.',
      advancedContent:
        '**Why sine waves are special — eigenfunctions of LTI systems:**\n\n' +
        'A Linear Time-Invariant (LTI) system (any circuit, filter, or acoustic space) has a remarkable property: ' +
        'if you put a pure sine wave in, you get a pure sine wave out — same frequency, only the amplitude and phase change. ' +
        'No other waveform has this property.\n\n' +
        '**Why Fourier analysis works — the consequence:**\n' +
        'Any signal (voice, music, sensor data) can be decomposed into a sum of sine waves at different frequencies. ' +
        'Since each sine passes through an LTI system independently, you can:\n' +
        '1. Decompose the input into sine components (FFT)\n' +
        '2. Multiply each component by the system\'s gain at that frequency\n' +
        '3. Shift each component by the system\'s phase delay at that frequency\n' +
        '4. Add them back up to get the output\n\n' +
        'This is called the **frequency response** approach and is the foundation of ALL signal processing.\n\n' +
        '**The Hilbert transform — extracting the envelope:**\n' +
        'An AM radio signal is a high-frequency carrier (say 1 MHz) whose amplitude varies slowly (the audio). ' +
        'The Hilbert transform creates the "analytic signal" z(t) = x(t) + iH{x(t)}. Its magnitude |z(t)| is the envelope ' +
        '(the slowly-varying audio), and the rate of change of its phase gives the instantaneous frequency. ' +
        'This is how AM radio demodulation works, how vibration analysts extract machine fault signatures, ' +
        'and how MRI reconstructs images from radio-frequency signals bouncing off hydrogen atoms in your body.',
      diagram: 'UnitCircleDiagram',
    },
    {
      title: 'Frequency — How Fast It Repeats',
      beginnerContent:
        '**Three sine waves, side by side. Same height, different speed.**\n\n' +
        '[diagram:FrequencyScene]\n\n' +
        'Frequency tells you how many complete cycles happen in one second, measured in Hertz (Hz). ' +
        'A wave at 2 Hz completes two full up-down cycles per second. A guitar\'s low E string ' +
        'vibrates at about 82 Hz; the highest note on a piano is about 4,186 Hz. Your ears can ' +
        'hear frequencies roughly from 20 Hz to 20,000 Hz. Below 20 Hz, you feel vibrations ' +
        'rather than hear them — elephants communicate with infrasound down around 14 Hz. ' +
        'The *period* is the inverse: a 100 Hz wave has a period of 1/100 = 0.01 seconds per cycle.',
      intermediateContent:
        'Musical intervals are frequency ratios: octave = 2:1, fifth = 3:2, fourth = 4:3. Equal temperament: 12 semitones, each 2^(1/12) ≈ 1.0595. Note formula: f = 440 × 2^((n-69)/12) for MIDI note n. Middle C (n=60): f ≈ **261.6 Hz**. The mel scale models human pitch perception (roughly logarithmic). Cent = 1/100 of a semitone: 1200 cents per octave. Tuning systems (Pythagorean, just intonation, equal temperament) make different tradeoffs between pure intervals and transposability.',
      advancedContent:
        '**How the ear distinguishes frequencies — two mechanisms:**\n\n' +
        '**Place coding (above ~4 kHz):** The basilar membrane in the cochlea vibrates at different locations for different frequencies — ' +
        'high frequencies near the base (stiff end), low frequencies near the apex (floppy end). Each location has hair cells that fire ' +
        'when their spot vibrates. The brain reads which hair cells fire to determine the frequency.\n\n' +
        '**Temporal coding (below ~4 kHz):** Neurons fire in sync with the wave\'s peaks. A 200 Hz tone causes neurons to fire ' +
        'every 5 ms (1/200 s). The brain measures the time between spikes to determine the frequency. Above ~4 kHz, ' +
        'neurons can\'t fire fast enough to keep up, so only place coding works.\n\n' +
        '**The missing fundamental — the brain fills in gaps:**\n' +
        'Play 200 Hz, 300 Hz, and 400 Hz together. These are the 2nd, 3rd, and 4th harmonics of 100 Hz. ' +
        'Your brain perceives 100 Hz — a pitch that isn\'t physically present. This is how telephone calls work: ' +
        'phone lines cut off below ~300 Hz, yet you hear bass voices clearly because the harmonics are present ' +
        'and your brain reconstructs the missing fundamental.\n\n' +
        '**Autocorrelation pitch detection (used in software):**\n' +
        'Take a snippet of audio. Shift a copy of it by delay τ. Multiply and sum (correlate). ' +
        'The delay τ that gives the highest correlation equals the period T. Frequency = 1/T. ' +
        'This is how guitar tuner apps work — they use autocorrelation to find the fundamental frequency of the string.',
      diagram: 'SineWaveDiagram',
    },
    {
      title: 'Amplitude — How Strong the Wave Is',
      beginnerContent:
        '**Same note, three volumes.** Amplitude controls loudness for sound, brightness for light, intensity for any wave.\n\n' +
        '[diagram:AmplitudeScene]\n\n' +
        'Amplitude is the height of the wave from the center line to the peak. Think of it as ' +
        'how hard the Ferris wheel pushes the seat away from the middle. A whisper has tiny ' +
        'amplitude; a shout has large amplitude. On a graph, a wave with amplitude 3 swings from ' +
        '+3 to -3. Doubling the amplitude doubles the energy carried by the wave — which is why ' +
        'turning up the volume on a speaker uses more battery. In the formula y = A * sin(2*pi*f*t), ' +
        'A is the amplitude.',
      intermediateContent:
        'Amplitude A is the peak value of the wave — half the distance from trough to crest. For sound, amplitude determines loudness; for light, it determines brightness; for a pendulum, it is the maximum displacement. The energy carried by a wave is proportional to A² — doubling the amplitude quadruples the energy. Decibels (dB) measure loudness on a logarithmic scale: dB = 20 × log₁₀(A/A_ref). Doubling the amplitude adds ~6 dB. The human hearing range spans ~120 dB — from a pin drop (0 dB) to a jet engine (120 dB), a factor of 10⁶ in amplitude.',
      advancedContent:
        '**RMS amplitude — measuring the "effective" strength of a varying signal:**\n\n' +
        'A sine wave swings between +A and −A. Its simple average is zero (positive and negative cancel). ' +
        'But it clearly carries energy. The RMS (Root Mean Square) solves this:\n' +
        '1. Square every value (makes all positive)\n' +
        '2. Take the mean of the squares\n' +
        '3. Take the square root\n\n' +
        'For a sine wave: A_rms = A_peak / √2 ≈ 0.707 × A_peak.\n\n' +
        '**Worked example — Indian mains electricity:**\n' +
        'India\'s supply is rated "230V" — that is the RMS voltage. The actual voltage swings between ' +
        '+325V and −325V (V_peak = 230 × √2 ≈ 325V), 50 times per second. The RMS value means: ' +
        'this AC supply delivers the same power as a 230V DC battery. A 100W bulb draws the same power either way.\n\n' +
        '**Parseval\'s theorem — energy conservation across domains:**\n' +
        'Total signal energy = Σ(amplitude²) in the time domain = Σ|X(f)|² in the frequency domain. ' +
        'In words: the energy you see in the waveform must equal the energy you see in the spectrum. ' +
        'Practical use: if you filter out a frequency band (e.g., noise above 10 kHz), you can calculate exactly how much ' +
        'energy you removed by summing |X(f)|² in that band. This is the mathematical foundation of equalizers, ' +
        'noise reduction, and audio compression (MP3 removes frequencies your ear can\'t detect, preserving the energy you can hear).',
      interactive: {
        type: 'slider',
        props: {
          component: 'FrequencySlider',
          title: 'Adjust amplitude and frequency',
          description: 'Drag the sliders to see how amplitude and frequency change a sine wave.',
        },
      },
    },
    {
      title: 'Phase — Where the Wave Starts',
      beginnerContent:
        '**Two waves of identical shape, but one starts a quarter-cycle ahead.** That horizontal offset is the *phase*.\n\n' +
        '[diagram:PhaseShiftScene]\n\n' +
        'Phase is the horizontal shift of a wave, measured in radians or degrees. Imagine two ' +
        'people on the same Ferris wheel, but one got on a quarter-turn later. They trace the same ' +
        'path at the same speed, but one is always a quarter-cycle behind — that\'s a 90-degree ' +
        '(pi/2 radian) phase difference. Phase matters when you combine waves: two identical waves ' +
        'perfectly in phase double in strength (constructive interference), but two waves exactly ' +
        'half a cycle apart (180 degrees) cancel each other to zero (destructive interference). ' +
        'Noise-canceling headphones exploit this by generating a wave with opposite phase to the noise.',
      intermediateContent:
        'Phase φ shifts a sine wave in time: y = sin(2πft + φ). φ = 0 starts at zero crossing (rising). φ = π/2 starts at the peak (= cosine). φ = π starts at zero (falling). φ = 3π/2 starts at the trough. Two waves at the same frequency with different phases: Δφ = 0 → perfectly in sync (constructive interference, double amplitude). Δφ = π → perfectly opposite (destructive interference, cancel out). Phase difference is measured in degrees or radians: 90° = π/2 rad, 180° = π rad.',
      advancedContent:
        '**Phase in AC circuits — why capacitors and inductors shift phase:**\n\n' +
        'Apply a sine-wave voltage to a capacitor. The current flows BEFORE the voltage peaks (the capacitor charges, ' +
        'current is highest when voltage is changing fastest, which is at the zero crossing). Current leads voltage by 90°.\n\n' +
        'For an inductor, the opposite: the inductor resists changes in current, so current peaks AFTER voltage. ' +
        'Current lags voltage by 90°.\n\n' +
        '**Complex impedance — the math that makes this tractable:**\n' +
        'Instead of tracking phase shifts with trigonometry, engineers use complex numbers:\n' +
        '- Resistor: Z_R = R (real — no phase shift)\n' +
        '- Capacitor: Z_C = 1/(jωC) (imaginary — 90° phase lead in current)\n' +
        '- Inductor: Z_L = jωL (imaginary — 90° phase lag in current)\n\n' +
        'where j = √(−1) and ω = 2πf. A series RLC circuit has Z_total = R + jωL + 1/(jωC). ' +
        'At resonance (ωL = 1/ωC), the imaginary parts cancel: Z = R (purely real, no phase shift). ' +
        'This is how a radio tuner selects one station — the RLC circuit resonates at the desired frequency.\n\n' +
        '**Noise cancellation — destructive interference in practice:**\n' +
        'A microphone picks up ambient noise x(t). The headphone generates −x(t) (same waveform, phase-shifted by π). ' +
        'At your ear: x(t) + (−x(t)) = 0. In practice, the cancellation is imperfect (delay, microphone position) ' +
        'but achieves 20-30 dB reduction — making a subway sound like a quiet room.',
      diagram: 'PhaseDiagram',
    },
    {
      title: 'Harmonics — The Overtone Series',
      beginnerContent:
        '**Pluck a bamboo flute and you don\'t get one sine wave — you get many at once.** The fundamental and its harmonics give every instrument its unique colour.\n\n' +
        '[diagram:HarmonicsScene]\n\n' +
        'When a guitar string vibrates, it does not just vibrate at one frequency. It vibrates at ' +
        'its fundamental frequency (say 100 Hz) and also at 200 Hz, 300 Hz, 400 Hz, and so on — ' +
        'these are called harmonics. The fundamental gives the note its pitch; the harmonics give ' +
        'it its *timbre* (tone color). A flute and a violin playing the same note sound different ' +
        'because they have different mixes of harmonics. A pure sine wave has no harmonics at all, ' +
        'which is why it sounds plain and electronic. Real-world sounds are always combinations ' +
        'of many sine waves at harmonic frequencies.',
      intermediateContent:
        'A musical note is not a single frequency but a fundamental plus harmonics. A violin A4 (440 Hz) contains harmonics at 880, 1320, 1760, 2200 Hz — integer multiples of the fundamental. The relative amplitudes of harmonics determine timbre (tone color): a flute has weak harmonics (nearly pure sine), while a trumpet has strong upper harmonics (bright, brassy). Fourier analysis decomposes any periodic waveform into its harmonic components. A square wave = fundamental + 1/3 × 3rd harmonic + 1/5 × 5th + 1/7 × 7th + ... (only odd harmonics).',
      advancedContent:
        '**Inharmonicity — why pianos need "stretch tuning":**\n\n' +
        'An ideal string has harmonics at exact integer multiples: f, 2f, 3f, 4f… But real piano strings have stiffness ' +
        '(they resist bending), which makes higher harmonics vibrate slightly FASTER than integer multiples. ' +
        'The formula: fₙ = n × f₁ × √(1 + B × n²), where B is the inharmonicity coefficient. ' +
        'For a piano\'s middle C (f₁ ≈ 262 Hz), the 8th harmonic might be at 2104 Hz instead of the ideal 2096 Hz — ' +
        '8 Hz sharp. Piano tuners compensate by tuning octaves slightly wider than 2:1 ("stretch tuning") ' +
        'so that the harmonics of lower notes align with the fundamentals of higher notes.\n\n' +
        '**Three approaches to building sound from sine waves:**\n\n' +
        '| Method | How it works | Character |\n' +
        '|---|---|---|\n' +
        '| **Additive synthesis** | Add sine waves: A₁sin(f₁t) + A₂sin(2f₁t) + … Control each harmonic\'s amplitude and frequency independently | Clean, precise — organs, flutes |\n' +
        '| **Subtractive synthesis** | Start with a harmonically rich wave (sawtooth = all harmonics, square = odd harmonics). Remove unwanted harmonics with a filter | Warm, analog — bass, pads |\n' +
        '| **FM synthesis** | Modulate one sine wave\'s frequency with another: y = sin(2πf_c × t + β × sin(2πf_m × t)). Generates sidebands at f_c ± n×f_m | Metallic, bell-like, electric piano |\n\n' +
        'The Yamaha DX7 (1983) used FM synthesis with 6 operators (sine wave generators). By varying the modulation index β and operator routing, ' +
        'it could mimic bells (inharmonic sidebands), brass (many harmonics), and electric pianos — all from pure sine waves.',
      diagram: 'MusicalWavesDiagram',
    },
    {
      title: 'Beats — When Close Frequencies Meet',
      beginnerContent:
        '**Two notes very close in pitch make a wobble — a "beat" you can hear.** Piano tuners use this to match strings.\n\n' +
        '[diagram:BeatsScene]\n\n' +
        'When two sine waves have slightly different frequencies, they create a pulsing effect ' +
        'called *beats*. Imagine two tuning forks at 440 Hz and 442 Hz played together. Sometimes ' +
        'their peaks align (loud), sometimes their peaks and troughs align (quiet). You hear a ' +
        '"wah-wah-wah" pulsing at 2 Hz — the difference between the two frequencies. Piano tuners ' +
        'use this effect: they adjust a string until the beats disappear, meaning the string matches ' +
        'the reference fork exactly. The beat frequency is always |f1 - f2|.',
      intermediateContent:
        'When two sine waves of slightly different frequencies (f₁ and f₂) combine, the result pulsates at the **beat frequency** = |f₁ - f₂|. Example: 440 Hz + 442 Hz → you hear 441 Hz (average) with 2 beats per second (2 Hz pulsation). Musicians use beats to tune instruments: play two notes that should be identical, listen for beats, adjust until beats disappear (frequencies match). The mathematical explanation: sin(2πf₁t) + sin(2πf₂t) = 2cos(2π(f₁-f₂)t/2) × sin(2π(f₁+f₂)t/2) — the product of a slow envelope and a fast carrier.',
      advancedContent:
        '**Heterodyning — how radios tune stations:**\n\n' +
        'Your local FM station broadcasts at, say, 98.3 MHz. Your radio generates a local oscillator at 108.8 MHz. ' +
        'Mixing these two creates a beat frequency at the difference: 108.8 − 98.3 = 10.5 MHz (the "intermediate frequency" or IF). ' +
        'Every station gets converted to the same IF, regardless of its broadcast frequency — then a single IF filter/amplifier handles them all.\n\n' +
        '**The math:** sin(f₁t) × sin(f₂t) = ½[cos((f₁−f₂)t) − cos((f₁+f₂)t)]. ' +
        'The sum frequency (207.1 MHz) is filtered out; the difference frequency (10.5 MHz) is kept. ' +
        'Tuning the radio = changing the local oscillator frequency.\n\n' +
        '**Room modes — why bass sounds uneven in rooms:**\n' +
        'Sound reflects off walls. At certain frequencies, the reflected wave perfectly reinforces or cancels the original. ' +
        'For a room L meters long, standing waves form at f = n × v/(2L), where v = 343 m/s and n = 1, 2, 3…\n\n' +
        'Example: Room length 4 m. First mode: f = 343/(2×4) = **42.9 Hz** (deep bass). At this frequency, the center of the room ' +
        'has maximum pressure variation (loud) while ¼ and ¾ positions have minimum (quiet). This is why your subwoofer sounds different ' +
        'depending on where you sit. Acoustic treatment (bass traps in corners) absorbs these standing waves to even out the response.',
      diagram: 'AmplitudeModDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the sine wave concept to its meaning',
          pairs: [
            ['Frequency', 'Number of complete cycles per second (Hz)'],
            ['Amplitude', 'Height of the wave from center to peak'],
            ['Phase', 'Horizontal shift of the wave, measured in degrees or radians'],
            ['Harmonics', 'Integer multiples of the fundamental frequency'],
            ['Beat frequency', 'The difference between two close frequencies, |f1 - f2|'],
          ],
        },
      },
    },
  ],

  build: [
    {
      title: 'Anatomy of a Sine Wave',
      beginnerContent:
        '**One labelled wave, every key term in one place.**\n\n' +
        '[diagram:SineAnatomyScene]\n\n' +
        'The sine function has three parameters: amplitude (A), frequency (f), and phase (phi). ' +
        'The formula is y = A * sin(2*pi*f*t + phi).',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 1, 1000)  # 1 second of time

# y = A * sin(2π * f * t + φ)
A = 1.0      # amplitude (height of peaks)
f = 3.0      # frequency (3 cycles per second)
phi = 0.0    # phase (horizontal shift in radians)

y = A * np.sin(2 * np.pi * f * t + phi)

plt.figure(figsize=(10, 4))
plt.plot(t, y, "b-", linewidth=2)

# Annotate the key features
plt.annotate("Amplitude", xy=(0.08, 1.0), fontsize=10,
           arrowprops=dict(arrowstyle="->"), xytext=(0.15, 0.7))
plt.annotate("Period = 1/f = 0.33s", xy=(0.0, 0), fontsize=10,
           xytext=(0.35, -0.7),
           arrowprops=dict(arrowstyle="<->"))

plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.title(f"Sine wave: A={A}, f={f} Hz, φ={phi}")
plt.axhline(0, color="gray", linewidth=0.5)
plt.grid(True, alpha=0.3)
plt.show()`,
    },
    {
      title: 'Changing Frequency and Amplitude',
      beginnerContent:
        'See how different values of A and f change the shape of the wave.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 1, 1000)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

configs = [
  (1.0, 2, "A=1, f=2 Hz (slow, normal height)"),
  (1.0, 8, "A=1, f=8 Hz (fast, normal height)"),
  (3.0, 2, "A=3, f=2 Hz (slow, tall)"),
  (0.5, 8, "A=0.5, f=8 Hz (fast, short)"),
]

for ax, (A, f, label) in zip(axes.flat, configs):
  y = A * np.sin(2 * np.pi * f * t)
  ax.plot(t, y, linewidth=2)
  ax.set_title(label)
  ax.set_ylim(-3.5, 3.5)
  ax.axhline(0, color="gray", linewidth=0.5)
  ax.grid(True, alpha=0.3)
  ax.set_xlabel("Time (s)")

plt.tight_layout()
plt.show()`,
    },
    {
      title: 'Phase and Superposition',
      beginnerContent:
        'Phase shifts waves in time. Adding waves (superposition) creates constructive or destructive interference.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 1, 1000)
f = 5  # Hz

# Three waves with different phase shifts
wave1 = np.sin(2 * np.pi * f * t)
wave2 = np.sin(2 * np.pi * f * t + np.pi / 2)   # 90° shift
wave3 = np.sin(2 * np.pi * f * t + np.pi)        # 180° shift (opposite)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))

# Show individual waves
ax1.plot(t, wave1, label="φ = 0°")
ax1.plot(t, wave2, "--", label="φ = 90°")
ax1.plot(t, wave3, ":", label="φ = 180° (opposite)")
ax1.set_title("Three Phase-Shifted Waves")
ax1.legend()
ax1.grid(True, alpha=0.3)

# Show constructive vs destructive interference
ax2.plot(t, wave1 + wave2, label="0° + 90° (constructive)", linewidth=2)
ax2.plot(t, wave1 + wave3, label="0° + 180° (cancel out!)", linewidth=2)
ax2.set_title("Superposition Results")
ax2.legend()
ax2.grid(True, alpha=0.3)
ax2.set_xlabel("Time (s)")

plt.tight_layout()
plt.show()`,
    },
    {
      title: 'Harmonics — Building Complex Tones',
      beginnerContent:
        'Add harmonic frequencies together to build richer, more realistic sounds from pure sine waves.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 0.02, 1000)  # 20 ms
fundamental = 220  # Hz (A3 note)

# Pure sine — just the fundamental
pure = np.sin(2 * np.pi * fundamental * t)

# Add harmonics (each quieter than the last)
rich = (1.0 * np.sin(2 * np.pi * 1 * fundamental * t) +   # 1st harmonic
      0.5 * np.sin(2 * np.pi * 2 * fundamental * t) +   # 2nd harmonic
      0.3 * np.sin(2 * np.pi * 3 * fundamental * t) +   # 3rd
      0.15 * np.sin(2 * np.pi * 4 * fundamental * t) +  # 4th
      0.1 * np.sin(2 * np.pi * 5 * fundamental * t))    # 5th

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))

ax1.plot(t * 1000, pure)
ax1.set_title("Pure Sine Wave (fundamental only)")
ax1.set_ylabel("Amplitude")
ax1.grid(True, alpha=0.3)

ax2.plot(t * 1000, rich, color="darkorange")
ax2.set_title("With 5 Harmonics (richer sound)")
ax2.set_xlabel("Time (ms)")
ax2.set_ylabel("Amplitude")
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()
# The rich wave has a more complex shape — that's timbre!`,
    },
    {
      title: 'Beat Frequencies',
      beginnerContent:
        'When two close frequencies play together, you hear a pulsing rhythm called beats.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 2, 10000)  # 2 seconds

f1 = 440    # Hz (A4 note)
f2 = 444    # Hz (slightly sharp)

wave1 = np.sin(2 * np.pi * f1 * t)
wave2 = np.sin(2 * np.pi * f2 * t)
combined = wave1 + wave2

# The envelope (what your ear perceives)
beat_freq = abs(f2 - f1)  # 4 Hz
envelope = 2 * np.cos(2 * np.pi * beat_freq / 2 * t)

plt.figure(figsize=(12, 4))
plt.plot(t, combined, alpha=0.5, label="Combined signal")
plt.plot(t, envelope, "r-", linewidth=2, label=f"Beat envelope ({beat_freq} Hz)")
plt.plot(t, -envelope, "r-", linewidth=2)
plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.title(f"Beat frequency: |{f1} - {f2}| = {beat_freq} Hz")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
# You'll see 4 pulses per second — the wah-wah-wah sound`,
    },
  ],
};
