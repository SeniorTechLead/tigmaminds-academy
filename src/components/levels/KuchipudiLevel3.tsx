import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KuchipudiLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fourier analysis — decomposing sound into frequencies',
      concept: `Joseph Fourier proved in 1807 that **any periodic signal can be expressed as a sum of sine waves** at different frequencies. This is the **Fourier transform** — one of the most important mathematical tools in science and engineering.

Given a complex waveform (like the sound of 100 ghungroo bells), the Fourier transform tells you which frequencies are present and how strong each one is. The result is a **frequency spectrum** — a graph showing amplitude vs frequency. Each peak in the spectrum corresponds to one frequency component of the sound.

The **Discrete Fourier Transform (DFT)** works on sampled data (like digital audio). It converts N time-domain samples into N/2 frequency bins. The Fast Fourier Transform (**FFT**) is an efficient algorithm that computes the DFT in O(N log N) operations instead of O(N^2) — making it practical to analyze millions of samples in real time.

📚 *The Fourier transform converts a signal from the time domain (amplitude vs time) to the frequency domain (amplitude vs frequency). It is reversible — you can reconstruct the original signal from its spectrum.*`,
      analogy: 'Imagine hearing an orchestra play a chord. Your brain somehow separates the chord into individual instruments — violin, flute, trumpet — even though only one combined sound wave reaches your ear. The Fourier transform does the same thing mathematically: it takes one complex wave and separates it into its individual frequency components.',
      storyConnection: 'If you recorded the sound of a Kuchipudi dancer ghungroo and applied a Fourier transform, you would see dozens of peaks — one for each bell. The spacing and heights of those peaks encode the information a master craftsman hears: which bells are too similar, which are too different, and whether the overall shimmer rate is correct.',
      checkQuestion: 'A signal is sampled at 44100 Hz and you take 1024 samples. What is the frequency resolution of the FFT? What is the highest frequency you can detect?',
      checkAnswer: 'Frequency resolution = sample_rate / N = 44100 / 1024 = 43.07 Hz (each bin covers 43 Hz). Highest detectable frequency (Nyquist) = sample_rate / 2 = 22050 Hz. You get 512 useful frequency bins from 0 to 22050 Hz.',
      codeIntro: 'Use the FFT to analyze the frequency content of a simulated ghungroo sound.',
      code: `import numpy as np

# Fourier Transform: decompose a ghungroo sound into frequencies

sample_rate = 44100
duration = 0.1  # 100 ms
N = int(sample_rate * duration)
t = np.linspace(0, duration, N, endpoint=False)

# Simulate a ghungroo with 8 bells
np.random.seed(42)
bell_freqs = [2400, 2650, 2880, 3050, 3200, 3480, 3700, 3950]
bell_amps = [0.8, 1.0, 0.9, 0.7, 1.0, 0.6, 0.8, 0.5]

# Build the combined signal
signal = np.zeros(N)
for freq, amp in zip(bell_freqs, bell_amps):
    signal += amp * np.sin(2 * np.pi * freq * t)

# Add slight noise (real-world imperfection)
signal += 0.1 * np.random.randn(N)

# Compute the FFT
fft_result = np.fft.rfft(signal)
fft_magnitude = np.abs(fft_result) / N * 2  # normalize
fft_freqs = np.fft.rfftfreq(N, 1 / sample_rate)

# Find peaks (frequencies with magnitude above threshold)
threshold = 0.1
peak_indices = []
for i in range(1, len(fft_magnitude) - 1):
    if (fft_magnitude[i] > fft_magnitude[i-1] and
        fft_magnitude[i] > fft_magnitude[i+1] and
        fft_magnitude[i] > threshold):
        peak_indices.append(i)

print("=== Fourier Analysis of Ghungroo Sound ===")
print(f"Signal: {len(bell_freqs)} bells + noise")
print(f"Samples: {N} | Sample rate: {sample_rate} Hz")
print(f"Frequency resolution: {sample_rate / N:.1f} Hz")
print()

print("Known bell frequencies vs detected peaks:")
print(f"{'Known (Hz)':<14} {'Detected (Hz)':>14} {'Amplitude':>10} {'Error (Hz)':>12}")
print("-" * 52)

detected = [(fft_freqs[i], fft_magnitude[i]) for i in peak_indices]
detected.sort(key=lambda x: x[0])

for known_f, known_a in zip(bell_freqs, bell_amps):
    # Find closest detected peak
    closest = min(detected, key=lambda d: abs(d[0] - known_f))
    error = closest[0] - known_f
    print(f"{known_f:<14} {closest[0]:>12.1f} {closest[1]:>10.3f} {error:>10.1f}")

print()
print(f"Total peaks detected above threshold: {len(peak_indices)}")
print(f"Frequency resolution limits accuracy to +/- {sample_rate/N/2:.1f} Hz")`,
      challenge: 'Increase the duration to 1.0 seconds (more samples). How does the frequency resolution improve? Can you now distinguish two bells that are only 20 Hz apart? This is the fundamental tradeoff: longer recordings give better frequency resolution.',
      successHint: 'The FFT is one of the most important algorithms ever invented. It powers audio compression (MP3), image compression (JPEG), wireless communication (WiFi, 4G, 5G), medical imaging (MRI), and speech recognition. You just used the same tool that Shazam uses to identify songs.',
    },
    {
      title: 'Spectral decomposition — separating overtones from the fundamental',
      concept: `Real instrument sounds contain a **fundamental** plus many **overtones** (harmonics and inharmonic partials). Spectral decomposition means taking the FFT output and identifying which peaks belong to the harmonic series of a single note versus which are independent tones.

For a harmonic sound (like a vibrating string), the overtones are at integer multiples of the fundamental: f, 2f, 3f, 4f... For an **inharmonic** sound (like a bell), the overtones are at non-integer ratios: f, 2.3f, 3.7f, 5.1f... This inharmonicity is what makes bells sound "bell-like" rather than "string-like."

To decompose a spectrum, you: (1) find the strongest peak (likely the fundamental), (2) check if other peaks fall at integer multiples (harmonic) or non-integer ratios (inharmonic), (3) group related peaks into "voices," and (4) identify the residual as noise.

📚 *Inharmonicity is the degree to which overtones deviate from perfect integer multiples. Strings have low inharmonicity. Bells, gongs, and cymbals have high inharmonicity — this gives them their distinctive metallic character.*`,
      analogy: 'Imagine a group photo of three families mixed together at a party. "Decomposing" the photo means figuring out which people belong to which family — perhaps by looking at similar features or clothing. Spectral decomposition does the same thing: it groups frequency peaks into "families" (harmonic series) based on their mathematical relationships.',
      storyConnection: 'Each ghungroo bell produces not just its fundamental but several inharmonic overtones. When 100 bells ring together, the spectrum contains hundreds of peaks. Decomposing this spectrum into individual bell voices is a significant signal processing challenge — and it is exactly what a trained ghungroo maker does by ear.',
      checkQuestion: 'A bell has peaks at 2500, 5750, 8250, and 12750 Hz. Are these harmonic (integer multiples of 2500)?',
      checkAnswer: 'Ratios: 5750/2500 = 2.30, 8250/2500 = 3.30, 12750/2500 = 5.10. These are NOT integer multiples, so the bell is inharmonic. A harmonic series would have peaks at 2500, 5000, 7500, 10000 Hz (ratios 2.0, 3.0, 4.0).',
      codeIntro: 'Decompose a complex spectrum into harmonic groups and identify inharmonicity.',
      code: `import numpy as np

# Spectral decomposition: identify harmonic groups in a spectrum

# Simulate a sound with two "bells" each having inharmonic overtones
fundamental_1 = 2500
overtone_ratios_1 = [1.0, 2.32, 3.65, 5.08, 6.74]  # inharmonic brass bell
amplitudes_1 = [1.0, 0.5, 0.3, 0.2, 0.1]

fundamental_2 = 3200
overtone_ratios_2 = [1.0, 2.28, 3.58, 4.95]  # slightly different bell
amplitudes_2 = [0.8, 0.4, 0.25, 0.15]

sample_rate = 44100
duration = 0.2
N = int(sample_rate * duration)
t = np.linspace(0, duration, N, endpoint=False)

signal = np.zeros(N)
for ratio, amp in zip(overtone_ratios_1, amplitudes_1):
    signal += amp * np.sin(2 * np.pi * fundamental_1 * ratio * t)
for ratio, amp in zip(overtone_ratios_2, amplitudes_2):
    signal += amp * np.sin(2 * np.pi * fundamental_2 * ratio * t)

# FFT
fft_mag = np.abs(np.fft.rfft(signal)) / N * 2
fft_freq = np.fft.rfftfreq(N, 1 / sample_rate)

# Find peaks
peaks = []
for i in range(1, len(fft_mag) - 1):
    if fft_mag[i] > fft_mag[i-1] and fft_mag[i] > fft_mag[i+1] and fft_mag[i] > 0.02:
        peaks.append((fft_freq[i], fft_mag[i]))

print("=== Spectral Decomposition ===")
print(f"Detected {len(peaks)} peaks in spectrum")
print()

# Group peaks by checking if they form harmonic series
def find_harmonic_group(peaks, fundamental, tolerance=0.08):
    """Find peaks that are near-integer multiples of fundamental"""
    group = []
    for freq, amp in peaks:
        ratio = freq / fundamental
        nearest_int = round(ratio)
        if nearest_int > 0 and abs(ratio - nearest_int) / nearest_int < tolerance:
            group.append((freq, amp, ratio, nearest_int))
    return group

# Try to decompose using known fundamentals
for fund, label in [(fundamental_1, "Bell 1"), (fundamental_2, "Bell 2")]:
    group = find_harmonic_group(peaks, fund, tolerance=0.15)
    print(f"--- {label} (fundamental ~ {fund} Hz) ---")
    print(f"{'Freq (Hz)':<12} {'Amplitude':>10} {'Ratio':>8} {'Nearest int':>12} {'Inharmonicity':>14}")
    print("-" * 58)
    for freq, amp, ratio, nearest in group:
        inharm = abs(ratio - nearest) / nearest * 100
        print(f"{freq:<12.1f} {amp:>10.3f} {ratio:>8.2f} {nearest:>12} {inharm:>12.1f}%")
    avg_inharm = np.mean([abs(r - n) / n * 100 for _, _, r, n in group]) if group else 0
    print(f"Average inharmonicity: {avg_inharm:.1f}%")
    print()

print("Inharmonicity > 5% = clearly bell-like (not string-like)")
print("Inharmonicity < 1% = nearly harmonic (string/flute-like)")`,
      challenge: 'Try changing one bell to have perfectly harmonic overtones (ratios: 1.0, 2.0, 3.0, 4.0, 5.0) — like a vibrating string. How does the inharmonicity change? How would this sound different from a real brass bell?',
      successHint: 'Spectral decomposition is the core of modern audio technology. Auto-tune identifies the fundamental of a singer voice and shifts it. Hearing aids selectively amplify speech frequencies. Music transcription software decomposes recordings into individual notes — all using the techniques you just applied.',
    },
    {
      title: 'Overtone series — the natural frequency hierarchy',
      concept: `The **overtone series** is the complete set of frequencies produced by a vibrating object. For an ideal string, the overtones form a perfect **harmonic series**: f, 2f, 3f, 4f... This mathematical sequence has deep connections to music, physics, and number theory.

The intervals between consecutive harmonics correspond to musical intervals: the 2nd harmonic is an **octave** above the fundamental, the 3rd is an octave plus a **perfect fifth**, the 4th is two octaves, the 5th is two octaves plus a **major third**. The entire Western scale system is derived from the harmonic series.

For bells and metallic objects, the overtone series is **inharmonic** — the ratios are not perfect integers. This is because bells are 2D vibrating surfaces, not 1D strings. The physics of 2D vibration produces modes at frequencies governed by **Bessel functions**, not simple integers.

📚 *The harmonic series 1/1 + 1/2 + 1/3 + 1/4 + ... diverges (grows without bound). The overtone amplitudes of real instruments decrease with frequency, so the energy series converges — but the frequency series extends infinitely in theory.*`,
      analogy: 'Think of the overtone series as a family tree. The fundamental is the parent. The 2nd harmonic is the first child (an octave away). The 3rd harmonic is the next child (a fifth above that). Each generation adds another member to the musical family. For bells, the family tree has a quirk — the children are spaced unevenly, giving the family its distinctive character.',
      storyConnection: 'Traditional Telugu bell makers (who also craft temple bells and ghungroo) learned through centuries of trial and error that certain bell shapes produce "sweeter" overtone series — closer to harmonic ratios. Modern acoustics reveals why: bells with certain wall thickness profiles have overtones that align more closely with the harmonic series, producing tones that sound more musical to human ears.',
      checkQuestion: 'The 3rd harmonic of 1000 Hz is 3000 Hz. What musical interval is this above the fundamental?',
      checkAnswer: 'The interval from the fundamental to the 3rd harmonic spans an octave (to 2000 Hz) plus a perfect fifth (from 2000 to 3000 Hz). In frequency terms, 3000/1000 = 3.0, and log2(3) = 1.585 octaves = 1 octave + 7.02 semitones (a perfect fifth is 7 semitones).',
      codeIntro: 'Explore the overtone series, its musical intervals, and the difference between harmonic and inharmonic spectra.',
      code: `import numpy as np

# The overtone series and its musical significance

def freq_ratio_to_cents(ratio):
    """Convert a frequency ratio to cents (1200 cents = 1 octave)"""
    return 1200 * np.log2(ratio)

def cents_to_interval_name(cents):
    """Approximate musical interval name from cents"""
    intervals = [
        (0, "Unison"), (100, "Minor 2nd"), (200, "Major 2nd"),
        (300, "Minor 3rd"), (400, "Major 3rd"), (500, "Perfect 4th"),
        (600, "Tritone"), (700, "Perfect 5th"), (800, "Minor 6th"),
        (900, "Major 6th"), (1000, "Minor 7th"), (1100, "Major 7th"),
        (1200, "Octave"),
    ]
    reduced = cents % 1200
    closest = min(intervals, key=lambda x: abs(x[0] - reduced))
    octaves = int(cents // 1200)
    if octaves > 0:
        return str(octaves) + " oct + " + closest[1]
    return closest[1]

# Ideal harmonic series (string)
print("=== Harmonic Series (Ideal String) ===")
fundamental = 440  # A4
print(f"Fundamental: {fundamental} Hz")
print(f"{'Harmonic':<10} {'Freq (Hz)':>10} {'Ratio':>8} {'Cents':>8} {'Interval':<20}")
print("-" * 60)

for n in range(1, 13):
    freq = fundamental * n
    ratio = n
    cents = freq_ratio_to_cents(ratio)
    interval = cents_to_interval_name(cents)
    print(f"{n:<10} {freq:>10.0f} {ratio:>8.2f} {cents:>8.0f} {interval}")

print()

# Inharmonic bell series
print("=== Inharmonic Bell Overtone Series ===")
bell_fund = 2500
# Typical brass bell mode ratios (from Rayleigh's theory)
bell_ratios = [1.00, 2.32, 3.65, 5.08, 6.74, 8.52, 10.44]

print(f"Fundamental: {bell_fund} Hz")
print(f"{'Mode':<8} {'Freq (Hz)':>10} {'Ratio':>8} {'Nearest':>9} {'Deviation':>10} {'Character'}")
print("-" * 65)

for i, ratio in enumerate(bell_ratios):
    freq = bell_fund * ratio
    nearest_int = round(ratio)
    deviation_pct = abs(ratio - nearest_int) / nearest_int * 100
    character = "harmonic" if deviation_pct < 2 else "slightly off" if deviation_pct < 8 else "inharmonic"
    print(f"{i+1:<8} {freq:>10.0f} {ratio:>8.2f} {nearest_int:>9} {deviation_pct:>8.1f}% {character}")

print()
# Energy distribution
print("=== Energy in Overtones ===")
string_amps = [1/n for n in range(1, 8)]  # ideal plucked string: 1/n
bell_amps = [1.0, 0.45, 0.28, 0.18, 0.10, 0.06, 0.03]

total_string = sum(a**2 for a in string_amps)
total_bell = sum(a**2 for a in bell_amps)

print(f"{'Overtone':<10} {'String amp':>12} {'String energy%':>15} {'Bell amp':>10} {'Bell energy%':>13}")
print("-" * 62)
for i in range(7):
    s_pct = string_amps[i]**2 / total_string * 100
    b_pct = bell_amps[i]**2 / total_bell * 100
    print(f"{i+1:<10} {string_amps[i]:>12.3f} {s_pct:>13.1f}% {bell_amps[i]:>10.3f} {b_pct:>11.1f}%")`,
      challenge: 'The 7th harmonic (ratio 7.0) is a "natural seventh" — 968.8 cents above the octave, which is 31 cents flatter than the equal-tempered minor seventh. Compute the cent values for harmonics 1 through 16 and identify which ones fall close to standard Western scale notes (within 15 cents) and which sound "out of tune" to Western ears.',
      successHint: 'The overtone series is the physical basis of music itself. Major chords sound consonant because they contain the lower harmonics (ratios 4:5:6). Dissonant intervals correspond to complex ratios that do not appear low in the series. You have just connected physics, mathematics, and music.',
    },
    {
      title: 'Spectral envelope and formants — the shape of sound',
      concept: `The **spectral envelope** is the smooth curve that traces the peaks of a frequency spectrum. While individual harmonics give a sound its pitch, the spectral envelope gives it its **timbre** — the quality that lets you distinguish a trumpet from a violin playing the same note.

**Formants** are broad peaks in the spectral envelope. In human speech, formants are created by resonances in the vocal tract — the throat, mouth, and nasal cavities act as resonant chambers that amplify certain frequency ranges. Each vowel sound has a characteristic formant pattern.

For musical instruments, formants are created by the body's resonances. A brass bell has formants determined by its shape and thickness. The ghungroo's overall tonal character — bright, warm, harsh, or mellow — is determined by its spectral envelope, which is the combined effect of all its individual bells' formants.

📚 *A formant is a concentration of acoustic energy around a particular frequency. The first two formants (F1 and F2) of a human voice are enough to identify which vowel is being spoken.*`,
      analogy: 'Imagine a mountain range viewed from far away. You cannot see individual trees (individual harmonics), but you can see the overall contour of the peaks and valleys (the spectral envelope). The shape of the mountain range tells you what region you are in, just as the spectral envelope tells you what instrument you are hearing.',
      storyConnection: 'A Kuchipudi dancer does not just use ghungroo for rhythm — the tonal quality communicates mood. Bright, high-formant ghungroo suggest joy and energy. Softer, low-formant ghungroo suggest grace and restraint. The spectral envelope of the anklet is as much a part of the performance as the rhythm pattern.',
      checkQuestion: 'Two violins play the same note at the same loudness, but one sounds "bright" and the other sounds "warm." What is different about their spectra?',
      checkAnswer: 'They have the same fundamental frequency and similar harmonic frequencies, but different spectral envelopes. The bright violin has stronger high-frequency harmonics (its envelope peaks are higher at high frequencies). The warm violin has weaker high-frequency harmonics (its envelope drops off faster).',
      codeIntro: 'Compute spectral envelopes and identify formants in simulated instrument sounds.',
      code: `import numpy as np

# Spectral envelope and formant analysis

def generate_tone_with_envelope(fundamental, harmonics_count, formants, sample_rate=44100, duration=0.1):
    """
    Generate a tone where harmonic amplitudes are shaped by formant resonances.
    formants: list of (center_freq, bandwidth, amplitude)
    """
    N = int(sample_rate * duration)
    t = np.linspace(0, duration, N, endpoint=False)
    signal = np.zeros(N)

    harm_freqs = []
    harm_amps = []

    for n in range(1, harmonics_count + 1):
        freq = fundamental * n
        # Amplitude shaped by formants
        amp = 0
        for fc, bw, a in formants:
            amp += a * np.exp(-((freq - fc) / bw) ** 2)
        signal += amp * np.sin(2 * np.pi * freq * t)
        harm_freqs.append(freq)
        harm_amps.append(amp)

    return signal, harm_freqs, harm_amps

# Define different timbres via formants
timbres = {
    "Bright ghungroo": [
        (3000, 800, 1.0),
        (5000, 600, 0.7),
        (7000, 500, 0.4),
    ],
    "Warm ghungroo": [
        (2500, 1000, 1.0),
        (4000, 800, 0.3),
    ],
    "Temple bell": [
        (1500, 500, 1.0),
        (3500, 400, 0.5),
        (6000, 300, 0.3),
    ],
    "Harsh cymbal": [
        (4000, 2000, 0.8),
        (8000, 1500, 0.6),
        (12000, 1000, 0.4),
    ],
}

fundamental = 500

print("=== Spectral Envelope Analysis ===")
print(f"Fundamental: {fundamental} Hz | Harmonics: 20")
print()

for name, formants in timbres.items():
    signal, freqs, amps = generate_tone_with_envelope(
        fundamental, 20, formants
    )

    print(f"--- {name} ---")
    print(f"Formants: ", end="")
    for fc, bw, a in formants:
        print(f"{fc}Hz(bw={bw},a={a:.1f}) ", end="")
    print()

    # Show harmonic amplitudes
    print(f"{'Harmonic':<10} {'Freq':>8} {'Amplitude':>10} {'Bar'}")
    print("-" * 50)
    max_amp = max(amps) if max(amps) > 0 else 1
    for i in range(min(12, len(freqs))):
        bar_len = int(amps[i] / max_amp * 30)
        bar = "#" * bar_len
        print(f"{i+1:<10} {freqs[i]:>8} {amps[i]:>10.3f} {bar}")

    # Spectral centroid (brightness indicator)
    total_energy = sum(a**2 for a in amps)
    if total_energy > 0:
        centroid = sum(f * a**2 for f, a in zip(freqs, amps)) / total_energy
    else:
        centroid = 0
    print(f"Spectral centroid (brightness): {centroid:.0f} Hz")
    print()

print("Higher spectral centroid = brighter sound")
print("Lower spectral centroid = warmer/darker sound")`,
      challenge: 'Design a "mellow flute" formant profile with a single broad formant centered at 1000 Hz (bandwidth 1500, amplitude 1.0). Compare its spectral centroid to the bright ghungroo. Then try shifting the formant center to 6000 Hz — how does the character change?',
      successHint: 'Spectral envelope analysis is the foundation of speech synthesis, voice recognition, and audio effects. When you use a voice assistant, it identifies your words partly by matching the formant patterns of your vowels. Equalizers in music apps let you reshape the spectral envelope to make music sound brighter or warmer.',
    },
    {
      title: 'Window functions and spectral leakage — FFT in practice',
      concept: `In practice, the FFT has an important limitation: **spectral leakage**. When you take a finite-length sample of a signal, the FFT assumes the sample repeats infinitely. If the sample does not contain an exact integer number of wave cycles, the "edges" of the sample are discontinuous, and the FFT smears the energy of each frequency across nearby bins.

The solution is a **window function** — a smooth curve (typically bell-shaped) that you multiply with your signal before computing the FFT. The window tapers the signal to zero at both ends, eliminating the discontinuity. Common windows include **Hann**, **Hamming**, **Blackman**, and **flat-top**.

Each window has a tradeoff: better **frequency resolution** (narrower main lobe, distinguishing close frequencies) vs better **amplitude accuracy** (lower side lobes, less leakage). The Hann window is a good general-purpose choice. The flat-top window gives the best amplitude accuracy but poor frequency resolution.

📚 *Spectral leakage occurs because the FFT's basis functions (sines and cosines) extend infinitely, but your signal sample is finite. The window function solves this by smoothing the transition at the sample boundaries.*`,
      analogy: 'Imagine looking through a rectangular window at a wallpaper pattern. At the edges, the pattern is abruptly cut off — you see partial repeats that confuse the eye. Now imagine the window has frosted glass at the edges that gradually fades to opaque. The center of the pattern is clear, and the edges fade smoothly to nothing. That frosted-edge window is the windowing function — it prevents the abrupt cutoff from distorting your analysis.',
      storyConnection: 'If you recorded ghungroo in a live performance and analyzed the spectrum, you would need windowing to get clean frequency peaks. Without it, the spectral leakage would blur the individual bell frequencies together, making it impossible to count or identify individual bells — defeating the purpose of the analysis.',
      checkQuestion: 'You are analyzing two bells at 3000 Hz and 3050 Hz. Your FFT has a frequency resolution of 43 Hz. Can you distinguish the two bells? What if you use a Hann window (which widens the main lobe by about 2x)?',
      checkAnswer: 'Without windowing: frequency resolution is 43 Hz, and the bells are 50 Hz apart, so they are barely resolvable (just over one bin apart). With a Hann window: the effective resolution is about 86 Hz (2x wider), so the two peaks would merge into one broad peak. You need a longer sample to resolve them.',
      codeIntro: 'Compare FFT results with and without window functions and observe spectral leakage.',
      code: `import numpy as np

# Window functions and spectral leakage

sample_rate = 44100
duration = 0.05  # 50 ms — deliberately short to show leakage
N = int(sample_rate * duration)
t = np.linspace(0, duration, N, endpoint=False)

# Signal: single tone at 3000.7 Hz (NOT an exact bin frequency)
freq = 3000.7
signal = np.sin(2 * np.pi * freq * t)

# Define window functions
def hann_window(n):
    return 0.5 * (1 - np.cos(2 * np.pi * np.arange(n) / n))

def hamming_window(n):
    return 0.54 - 0.46 * np.cos(2 * np.pi * np.arange(n) / n)

def blackman_window(n):
    return (0.42 - 0.5 * np.cos(2 * np.pi * np.arange(n) / n)
            + 0.08 * np.cos(4 * np.pi * np.arange(n) / n))

windows = {
    "No window (rectangular)": np.ones(N),
    "Hann": hann_window(N),
    "Hamming": hamming_window(N),
    "Blackman": blackman_window(N),
}

print("=== Spectral Leakage Comparison ===")
print(f"True frequency: {freq} Hz")
print(f"Frequency resolution: {sample_rate/N:.1f} Hz")
print(f"Nearest bin: {round(freq * N / sample_rate) * sample_rate / N:.1f} Hz")
print()

for name, window in windows.items():
    windowed = signal * window
    fft_mag = np.abs(np.fft.rfft(windowed)) / N * 2
    fft_freq = np.fft.rfftfreq(N, 1 / sample_rate)

    # Find the peak
    peak_idx = np.argmax(fft_mag)
    peak_freq = fft_freq[peak_idx]
    peak_mag = fft_mag[peak_idx]

    # Measure leakage: energy outside the main lobe
    # Main lobe = peak +/- 3 bins
    lobe_start = max(0, peak_idx - 3)
    lobe_end = min(len(fft_mag), peak_idx + 4)
    main_energy = np.sum(fft_mag[lobe_start:lobe_end] ** 2)
    total_energy = np.sum(fft_mag ** 2)
    leakage_pct = (1 - main_energy / total_energy) * 100

    # Side lobe level
    side_region = np.concatenate([fft_mag[:lobe_start], fft_mag[lobe_end:]])
    max_side = np.max(side_region) if len(side_region) > 0 else 0
    side_lobe_db = 20 * np.log10(max_side / peak_mag) if peak_mag > 0 and max_side > 0 else -100

    print(f"--- {name} ---")
    print(f"  Peak: {peak_freq:.1f} Hz (error: {abs(peak_freq - freq):.1f} Hz)")
    print(f"  Peak magnitude: {peak_mag:.4f}")
    print(f"  Leakage: {leakage_pct:.1f}% of energy outside main lobe")
    print(f"  Highest side lobe: {side_lobe_db:.1f} dB below peak")
    print()

print("Lower leakage = cleaner spectrum = better frequency identification")
print("Blackman has least leakage but widest main lobe (worst resolution)")`,
      challenge: 'Try changing the signal frequency to exactly 3000.0 Hz (an integer that may align with a bin). Does the leakage disappear? Now try 3000.5 Hz (halfway between bins) — this is the worst case for leakage. This demonstrates why windowing is essential for real-world signals.',
      successHint: 'Window functions are used in every real-time audio analyzer, radar system, and communications receiver. Your phone applies a window function every time it processes a voice call. The choice of window is one of the first decisions a signal processing engineer makes.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Fourier analysis and spectral decomposition</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to perform Fourier analysis, spectral decomposition, and windowing.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
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
