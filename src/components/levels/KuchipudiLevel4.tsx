import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KuchipudiLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Build a tone synthesizer — additive synthesis from scratch',
      concept: `**Additive synthesis** builds complex sounds by summing sine waves at different frequencies and amplitudes. This is the direct application of Fourier's theorem: if any sound can be decomposed into sine waves, then any sound can be *constructed* from sine waves.

Your synthesizer will take a **harmonic recipe** — a list of harmonic numbers and their amplitudes — and produce a waveform. By changing the recipe, you can create sounds resembling different instruments: a flute (mostly fundamental), a brass bell (strong upper harmonics), a reed instrument (odd harmonics), or a bowed string (all harmonics with 1/n amplitude decay).

The key design decisions are: (1) how many harmonics to include, (2) how their amplitudes relate to each other, (3) whether to include inharmonicity (non-integer frequency ratios), and (4) how the sound evolves over time (the **envelope**: attack, decay, sustain, release).

📚 *Additive synthesis was one of the earliest electronic sound generation techniques. Modern synthesizers also use subtractive synthesis (filtering a harmonically rich signal), FM synthesis (modulating one oscillator with another), and wavetable synthesis.*`,
      analogy: 'Think of mixing paint colors. You start with pure primary colors (sine waves) and mix them in different proportions to create any color (any timbre). A little more red (more high harmonics) makes the color warmer. More blue (low harmonics) makes it cooler. The recipe of primaries determines the final color, just as the recipe of harmonics determines the final sound.',
      storyConnection: 'The ghungroo anklet is a natural additive synthesizer — each bell contributes one (or a few) frequency components, and the sum of all bells creates the final complex sound. Building a digital synthesizer that recreates the ghungroo sound requires understanding exactly which frequencies are present and at what amplitudes.',
      checkQuestion: 'To synthesize a sound with harmonics at 1000, 2000, 3000, 4000, and 5000 Hz with amplitudes 1.0, 0.5, 0.33, 0.25, 0.2 — how many sine oscillators do you need?',
      checkAnswer: 'Five oscillators, one per harmonic. Each generates a sine wave at the specified frequency and amplitude. The outputs are summed to produce the final waveform. More harmonics = more oscillators = more realistic sound but more computation.',
      codeIntro: 'Build a complete additive synthesizer that can generate different instrument timbres.',
      code: `import numpy as np

# Additive Synthesizer — build any sound from sine waves

class AdditiveSynth:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate

    def generate(self, fundamental, harmonics, duration, envelope=None):
        """
        fundamental: base frequency (Hz)
        harmonics: list of (ratio, amplitude) tuples
        duration: seconds
        envelope: optional ADSR envelope (attack, decay, sustain_level, release) in seconds
        """
        N = int(self.sample_rate * duration)
        t = np.linspace(0, duration, N, endpoint=False)

        signal = np.zeros(N)
        for ratio, amp in harmonics:
            freq = fundamental * ratio
            signal += amp * np.sin(2 * np.pi * freq * t)

        # Apply ADSR envelope if provided
        if envelope:
            a, d, s_level, r = envelope
            env = np.ones(N)
            a_samples = int(a * self.sample_rate)
            d_samples = int(d * self.sample_rate)
            r_samples = int(r * self.sample_rate)

            # Attack: 0 to 1
            if a_samples > 0:
                env[:a_samples] = np.linspace(0, 1, a_samples)
            # Decay: 1 to sustain level
            d_start = a_samples
            d_end = d_start + d_samples
            if d_samples > 0 and d_end <= N:
                env[d_start:d_end] = np.linspace(1, s_level, d_samples)
            # Sustain
            if d_end < N - r_samples:
                env[d_end:N - r_samples] = s_level
            # Release
            if r_samples > 0:
                env[N - r_samples:] = np.linspace(s_level, 0, r_samples)

            signal *= env

        # Normalize
        peak = np.max(np.abs(signal))
        if peak > 0:
            signal /= peak

        return signal, t

# Create synthesizer
synth = AdditiveSynth()

# Define instrument presets
presets = {
    "Ghungroo bell": {
        "harmonics": [(1.0, 1.0), (2.32, 0.5), (3.65, 0.3), (5.08, 0.2), (6.74, 0.1)],
        "envelope": (0.001, 0.05, 0.3, 0.2),
        "fundamental": 3000,
    },
    "Flute": {
        "harmonics": [(1.0, 1.0), (2.0, 0.1), (3.0, 0.03)],
        "envelope": (0.05, 0.1, 0.8, 0.1),
        "fundamental": 880,
    },
    "Brass": {
        "harmonics": [(1.0, 1.0), (2.0, 0.8), (3.0, 0.6), (4.0, 0.4),
                       (5.0, 0.3), (6.0, 0.2), (7.0, 0.15), (8.0, 0.1)],
        "envelope": (0.02, 0.1, 0.7, 0.15),
        "fundamental": 440,
    },
    "Bowed string": {
        "harmonics": [(n, 1.0/n) for n in range(1, 16)],
        "envelope": (0.1, 0.05, 0.9, 0.2),
        "fundamental": 440,
    },
}

print("=== Additive Synthesizer ===")
print()

for name, preset in presets.items():
    signal, t = synth.generate(
        preset["fundamental"],
        preset["harmonics"],
        0.3,
        preset["envelope"]
    )

    # Analyze the result
    rms = np.sqrt(np.mean(signal**2))
    fft_mag = np.abs(np.fft.rfft(signal)) / len(signal) * 2
    fft_freq = np.fft.rfftfreq(len(signal), 1 / synth.sample_rate)

    # Spectral centroid
    total_e = np.sum(fft_mag**2)
    centroid = np.sum(fft_freq * fft_mag**2) / total_e if total_e > 0 else 0

    print(f"--- {name} (f0={preset['fundamental']} Hz) ---")
    print(f"  Harmonics: {len(preset['harmonics'])}")
    print(f"  RMS level: {rms:.3f}")
    print(f"  Spectral centroid: {centroid:.0f} Hz (brightness)")
    print(f"  Duration: 0.3 s | Samples: {len(signal)}")
    print()

print("The synthesizer builds each sound from pure sine waves.")
print("Different harmonic recipes create distinctly different timbres.")`,
      challenge: 'Create a "50-bell ghungroo" preset with 50 harmonics. Each harmonic has a slightly randomized ratio (1.0 + random offset of +/- 0.05, 2.32 + offset, etc.) and amplitude that decreases with harmonic number. Compare its spectral centroid to the single-bell ghungroo preset.',
      successHint: 'You have built a working synthesizer from first principles. Professional synthesizers like those in Ableton Live, Logic Pro, and hardware synthesizers use these same additive synthesis techniques — with more oscillators, more envelope control, and real-time parameter adjustment.',
    },
    {
      title: 'Build a spectrum analyzer — real-time FFT with peak detection',
      concept: `A **spectrum analyzer** takes a stream of audio and continuously computes the FFT, displaying the frequency content in real time. It is the primary tool for audio engineers, acoustic researchers, and instrument makers.

Your analyzer will: (1) take a signal buffer, (2) apply a window function, (3) compute the FFT, (4) find peaks (local maxima above a threshold), (5) estimate the exact frequency of each peak using **parabolic interpolation** (fitting a parabola to the peak and its neighbors for sub-bin accuracy), and (6) track peaks over time to identify stable frequencies.

Parabolic interpolation is crucial: without it, frequency accuracy is limited to the bin spacing (sample_rate / N). With it, you can estimate frequencies to within a fraction of a bin — typically 100x better accuracy.

📚 *Parabolic interpolation for FFT peaks: given three consecutive FFT magnitudes (left, center, right), the peak offset from center is delta = 0.5 * (left - right) / (left - 2*center + right). The interpolated frequency is (bin_index + delta) * sample_rate / N.*`,
      analogy: 'A spectrum analyzer is like a prism for sound. A glass prism splits white light into its rainbow of colors. A spectrum analyzer splits complex sound into its rainbow of frequencies. The brightness of each color corresponds to the amplitude of each frequency.',
      storyConnection: 'If a ghungroo maker had access to a spectrum analyzer, they could instantly see which bells are too close in frequency (and should be swapped out), which are producing unwanted overtones, and whether the overall spectral balance is good. This is exactly how modern bell manufacturers and acoustic engineers work.',
      checkQuestion: 'An FFT has bin spacing of 43 Hz. Without interpolation, you detect a peak at bin 70 (3010 Hz). With parabolic interpolation, the peak is refined to bin 69.7. What is the interpolated frequency?',
      checkAnswer: 'Interpolated frequency = 69.7 * 43 = 2997.1 Hz. The interpolation moved the estimate by 0.3 bins = 12.9 Hz. For applications like instrument tuning, this sub-bin accuracy is essential — a 13 Hz error at 3000 Hz is a noticeable pitch difference.',
      codeIntro: 'Build a spectrum analyzer with peak detection and parabolic interpolation.',
      code: `import numpy as np

# Spectrum Analyzer with peak detection and interpolation

class SpectrumAnalyzer:
    def __init__(self, sample_rate=44100, fft_size=4096):
        self.sample_rate = sample_rate
        self.fft_size = fft_size
        self.bin_spacing = sample_rate / fft_size
        self.window = 0.5 * (1 - np.cos(2 * np.pi * np.arange(fft_size) / fft_size))

    def analyze(self, signal):
        """Compute windowed FFT and return magnitude spectrum"""
        # Take the last fft_size samples
        buf = signal[-self.fft_size:] if len(signal) >= self.fft_size else np.pad(signal, (self.fft_size - len(signal), 0))
        windowed = buf * self.window
        fft_result = np.fft.rfft(windowed)
        magnitude = np.abs(fft_result) / self.fft_size * 2
        freqs = np.fft.rfftfreq(self.fft_size, 1 / self.sample_rate)
        return freqs, magnitude

    def find_peaks(self, magnitude, threshold=0.01):
        """Find local maxima above threshold"""
        peaks = []
        for i in range(1, len(magnitude) - 1):
            if (magnitude[i] > magnitude[i-1] and
                magnitude[i] > magnitude[i+1] and
                magnitude[i] > threshold):
                peaks.append(i)
        return peaks

    def interpolate_peak(self, magnitude, peak_idx):
        """Parabolic interpolation for sub-bin frequency accuracy"""
        if peak_idx <= 0 or peak_idx >= len(magnitude) - 1:
            return peak_idx * self.bin_spacing, magnitude[peak_idx]

        left = magnitude[peak_idx - 1]
        center = magnitude[peak_idx]
        right = magnitude[peak_idx + 1]

        denominator = left - 2 * center + right
        if abs(denominator) < 1e-10:
            return peak_idx * self.bin_spacing, center

        delta = 0.5 * (left - right) / denominator
        interp_freq = (peak_idx + delta) * self.bin_spacing
        interp_mag = center - 0.25 * (left - right) * delta

        return interp_freq, interp_mag

# Create analyzer
analyzer = SpectrumAnalyzer(fft_size=4096)

# Generate test signal: 6 ghungroo bells
bell_freqs_true = [2487, 2753, 3019, 3198, 3512, 3887]
bell_amps_true = [0.8, 1.0, 0.9, 0.7, 0.85, 0.6]

sample_rate = 44100
duration = 0.2
N = int(sample_rate * duration)
t = np.linspace(0, duration, N, endpoint=False)

signal = np.zeros(N)
for freq, amp in zip(bell_freqs_true, bell_amps_true):
    signal += amp * np.sin(2 * np.pi * freq * t)
signal += 0.05 * np.random.randn(N)  # add noise

# Analyze
freqs, magnitude = analyzer.analyze(signal)
peak_indices = analyzer.find_peaks(magnitude, threshold=0.05)

print("=== Spectrum Analyzer Results ===")
print(f"FFT size: {analyzer.fft_size} | Bin spacing: {analyzer.bin_spacing:.1f} Hz")
print(f"Peaks found: {len(peak_indices)}")
print()

print(f"{'True Freq':>10} {'Detected':>10} {'Interpolated':>13} {'Error':>8} {'Amplitude':>10}")
print("-" * 53)

detected_peaks = []
for idx in peak_indices:
    raw_freq = idx * analyzer.bin_spacing
    interp_freq, interp_mag = analyzer.interpolate_peak(magnitude, idx)
    detected_peaks.append((interp_freq, interp_mag))

# Match detected peaks to true frequencies
for true_f, true_a in zip(bell_freqs_true, bell_amps_true):
    if detected_peaks:
        closest = min(detected_peaks, key=lambda p: abs(p[0] - true_f))
        raw_closest = round(true_f / analyzer.bin_spacing) * analyzer.bin_spacing
        error = abs(closest[0] - true_f)
        print(f"{true_f:>10} {raw_closest:>10.1f} {closest[0]:>13.1f} {error:>6.1f} Hz {closest[1]:>10.3f}")

print()
print("Parabolic interpolation improves accuracy from")
print(f"{analyzer.bin_spacing:.1f} Hz bins to sub-Hz precision.")`,
      challenge: 'Add two bells very close together: 3100 Hz and 3120 Hz. Can the analyzer resolve them with fft_size=4096? Try increasing fft_size to 8192 or 16384. At what point can you clearly separate the two peaks? (Hint: you need bin_spacing < 20 Hz.)',
      successHint: 'You have built a professional-grade spectrum analyzer. The same algorithm runs in every audio workstation, concert hall sound system, and hearing aid. The parabolic interpolation technique you used is the industry standard for precise frequency measurement.',
    },
    {
      title: 'Harmonic product spectrum — robust pitch detection',
      concept: `Detecting the fundamental pitch of a complex sound is harder than it seems. The FFT might show many peaks (harmonics), and the fundamental may not even be the strongest. The **Harmonic Product Spectrum (HPS)** algorithm solves this elegantly.

The idea: if a sound has a fundamental at frequency f, it also has harmonics at 2f, 3f, 4f, etc. If you "compress" the spectrum by a factor of 2 (halving all frequencies), the 2nd harmonic lands on top of the fundamental. Compress by 3, and the 3rd harmonic aligns too. **Multiply** the original spectrum with all the compressed versions, and the fundamental frequency gets reinforced while non-harmonic noise cancels out.

HPS is remarkably robust — it works even when the fundamental is missing (common in small speakers that cannot reproduce low frequencies), when there is background noise, and when multiple instruments play simultaneously (though polyphonic pitch detection requires more advanced methods).

📚 *The Harmonic Product Spectrum compresses (downsamples) the magnitude spectrum by factors 1, 2, 3, ..., H and multiplies them together. The product has a strong peak at the fundamental frequency.*`,
      analogy: 'Imagine you have a ruler with marks at 10, 20, 30, 40 cm (the harmonics). Shrink the ruler by 2x: marks at 5, 10, 15, 20. Shrink by 3x: marks at 3.3, 6.7, 10, 13.3. The only position where a mark appears in ALL three versions is 10 cm — the fundamental. Multiplying the patterns together reveals the common point.',
      storyConnection: 'In a noisy performance venue, a recording of ghungroo contains the bells plus crowd noise, drum beats, and vocal music. HPS can extract the dominant bell frequency even from this messy signal because the harmonic structure of bells is consistent, while noise has no harmonic pattern. This is how audio engineers analyze recordings of live performances.',
      checkQuestion: 'A sound has partials at 1000, 2000, 3000, 4000, and 5000 Hz. The strongest partial is at 3000 Hz. What fundamental does HPS detect?',
      checkAnswer: 'HPS detects 1000 Hz. The compressed spectra at 2x, 3x, 4x, and 5x all have peaks that align at 1000 Hz. Even though 3000 Hz is the strongest individual peak, the product of all compressed spectra is maximized at 1000 Hz — the true fundamental.',
      codeIntro: 'Implement the Harmonic Product Spectrum algorithm for robust pitch detection.',
      code: `import numpy as np

# Harmonic Product Spectrum — robust pitch detection

def harmonic_product_spectrum(signal, sample_rate, fft_size=8192, num_harmonics=5):
    """
    Detect fundamental frequency using the HPS algorithm.

    1. Compute magnitude spectrum
    2. Downsample spectrum by factors 2, 3, ..., num_harmonics
    3. Multiply all versions together
    4. Peak of the product = fundamental frequency
    """
    # Window and FFT
    window = 0.5 * (1 - np.cos(2 * np.pi * np.arange(fft_size) / fft_size))
    buf = signal[:fft_size] if len(signal) >= fft_size else np.pad(signal, (0, fft_size - len(signal)))
    windowed = buf * window
    spectrum = np.abs(np.fft.rfft(windowed))

    # HPS: multiply downsampled versions
    min_length = len(spectrum) // num_harmonics
    hps = spectrum[:min_length].copy()

    for h in range(2, num_harmonics + 1):
        downsampled = spectrum[::h][:min_length]
        hps *= downsampled

    # Find the peak
    freqs = np.fft.rfftfreq(fft_size, 1 / sample_rate)[:min_length]
    peak_idx = np.argmax(hps)
    detected_freq = freqs[peak_idx]

    return detected_freq, hps, freqs

# Test 1: Simple harmonic tone
sample_rate = 44100
duration = 0.2
N = int(sample_rate * duration)
t = np.linspace(0, duration, N, endpoint=False)

fundamental = 440  # A4
# Build signal with harmonics (fundamental is NOT the strongest)
signal = (0.3 * np.sin(2 * np.pi * fundamental * t) +      # weak fundamental
          0.5 * np.sin(2 * np.pi * 2 * fundamental * t) +   # stronger 2nd
          0.8 * np.sin(2 * np.pi * 3 * fundamental * t) +   # strongest 3rd!
          0.4 * np.sin(2 * np.pi * 4 * fundamental * t) +
          0.2 * np.sin(2 * np.pi * 5 * fundamental * t))

signal += 0.1 * np.random.randn(N)  # noise

detected, hps, freqs = harmonic_product_spectrum(signal, sample_rate)
print("=== Test 1: Weak Fundamental ===")
print(f"True fundamental: {fundamental} Hz")
print(f"Strongest partial: {3 * fundamental} Hz (3rd harmonic)")
print(f"HPS detected: {detected:.1f} Hz")
print(f"Error: {abs(detected - fundamental):.1f} Hz")
print()

# Test 2: Missing fundamental
signal2 = (0.0 * np.sin(2 * np.pi * fundamental * t) +      # MISSING!
           0.6 * np.sin(2 * np.pi * 2 * fundamental * t) +
           0.5 * np.sin(2 * np.pi * 3 * fundamental * t) +
           0.4 * np.sin(2 * np.pi * 4 * fundamental * t) +
           0.3 * np.sin(2 * np.pi * 5 * fundamental * t))

detected2, _, _ = harmonic_product_spectrum(signal2, sample_rate)
print("=== Test 2: Missing Fundamental ===")
print(f"True fundamental: {fundamental} Hz (not in signal!)")
print(f"HPS detected: {detected2:.1f} Hz")
print(f"HPS correctly identifies the 'phantom' fundamental")
print()

# Test 3: Ghungroo bell (inharmonic)
bell_fund = 2500
bell_signal = np.zeros(N)
bell_ratios = [1.0, 2.32, 3.65, 5.08, 6.74]
for ratio in bell_ratios:
    bell_signal += (1.0 / ratio) * np.sin(2 * np.pi * bell_fund * ratio * t)

detected3, _, _ = harmonic_product_spectrum(bell_signal, sample_rate)
print("=== Test 3: Inharmonic Bell ===")
print(f"True fundamental: {bell_fund} Hz")
print(f"Overtone ratios: {bell_ratios} (NOT integer!)")
print(f"HPS detected: {detected3:.1f} Hz")
error3 = abs(detected3 - bell_fund)
print(f"Error: {error3:.1f} Hz")
print(f"Note: HPS is less accurate for inharmonic sounds")
print(f"because compressed harmonics don't align perfectly.")`,
      challenge: 'Test HPS with two simultaneous notes: 440 Hz and 660 Hz (a perfect fifth). Does HPS detect both? (It should find the stronger one.) Research: how would you detect multiple simultaneous pitches? (Hint: find the first peak, remove its harmonics, then run HPS again.)',
      successHint: 'The HPS algorithm is used in guitar tuners, pitch correction software (like Auto-Tune), and music transcription. Its elegance is in how it uses the structure of the harmonic series — multiplying downsampled spectra — to robustly find the fundamental even in noisy, complex signals.',
    },
    {
      title: 'Sound morphing — blend between two timbres',
      concept: `**Sound morphing** (also called timbral interpolation) smoothly transitions between two different timbres. If you have the spectral recipe for a brass bell and a wooden flute, morphing creates intermediate sounds that are part-bell, part-flute.

The basic technique: (1) analyze both sounds with the FFT to get their spectral envelopes, (2) for each frequency bin, linearly interpolate between the two amplitudes using a **morph factor** (0.0 = pure sound A, 1.0 = pure sound B, 0.5 = halfway), (3) reconstruct the sound using inverse FFT or additive synthesis.

More sophisticated morphing also interpolates the **frequencies** of harmonic peaks (not just amplitudes) and the **temporal envelope** (attack/decay shape). This produces perceptually smoother transitions.

📚 *Linear interpolation: value = A * (1 - factor) + B * factor. When factor = 0, result = A. When factor = 1, result = B. When factor = 0.5, result = average of A and B. This simple formula is the basis of morphing, blending, crossfading, and many animation techniques.*`,
      analogy: 'Think of a dimmer switch between two light bulbs — one red, one blue. At the far left, you see only red light. At the far right, only blue. In between, you see various shades of purple. Sound morphing does the same thing with timbres: smoothly blending between two sonic "colors" by adjusting the mix ratio.',
      storyConnection: 'Imagine morphing between the bright metallic sound of brass ghungroo and the mellow wooden tone of a Kuchipudi mridangam drum. At 0% morph, you hear pure bells. At 100%, pure drum. In between, you get hybrid sounds that never existed in the physical world — a creative tool that blends the cultural character of both instruments.',
      checkQuestion: 'Sound A has amplitude 0.8 at 3000 Hz. Sound B has amplitude 0.2 at 3000 Hz. What is the morphed amplitude at morph factor 0.3?',
      checkAnswer: 'Morphed = 0.8 * (1 - 0.3) + 0.2 * 0.3 = 0.8 * 0.7 + 0.2 * 0.3 = 0.56 + 0.06 = 0.62. The result is closer to Sound A because the morph factor (0.3) is closer to 0.',
      codeIntro: 'Build a sound morpher that blends between different instrument timbres.',
      code: `import numpy as np

# Sound Morpher — blend between two timbres

class SoundMorpher:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate

    def create_timbre(self, fundamental, harmonics, duration):
        """Generate a sound from harmonic recipe"""
        N = int(self.sample_rate * duration)
        t = np.linspace(0, duration, N, endpoint=False)
        signal = np.zeros(N)
        for ratio, amp in harmonics:
            signal += amp * np.sin(2 * np.pi * fundamental * ratio * t)
        return signal

    def spectral_morph(self, signal_a, signal_b, morph_factor):
        """Morph between two signals in the frequency domain"""
        # FFT both signals
        fft_a = np.fft.rfft(signal_a)
        fft_b = np.fft.rfft(signal_b)

        # Interpolate magnitude and phase separately
        mag_a = np.abs(fft_a)
        mag_b = np.abs(fft_b)
        phase_a = np.angle(fft_a)
        phase_b = np.angle(fft_b)

        # Linear interpolation
        mag_morph = mag_a * (1 - morph_factor) + mag_b * morph_factor
        phase_morph = phase_a * (1 - morph_factor) + phase_b * morph_factor

        # Reconstruct
        fft_morph = mag_morph * np.exp(1j * phase_morph)
        return np.fft.irfft(fft_morph, n=len(signal_a))

morpher = SoundMorpher()

# Define two contrasting timbres
ghungroo = [(1.0, 1.0), (2.32, 0.5), (3.65, 0.3), (5.08, 0.2), (6.74, 0.1)]
flute = [(1.0, 1.0), (2.0, 0.1), (3.0, 0.02)]

fundamental = 1000
duration = 0.1

signal_a = morpher.create_timbre(fundamental, ghungroo, duration)
signal_b = morpher.create_timbre(fundamental, flute, duration)

print("=== Sound Morpher ===")
print(f"Sound A: Ghungroo bell ({len(ghungroo)} partials, inharmonic)")
print(f"Sound B: Flute ({len(flute)} partials, harmonic)")
print(f"Fundamental: {fundamental} Hz")
print()

morph_factors = [0.0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0]

print(f"{'Morph':>6} {'RMS':>8} {'Centroid':>10} {'Peak Freq':>11} {'Character'}")
print("-" * 50)

for factor in morph_factors:
    morphed = morpher.spectral_morph(signal_a, signal_b, factor)

    rms = np.sqrt(np.mean(morphed**2))

    # Spectral analysis
    fft_mag = np.abs(np.fft.rfft(morphed))
    fft_freq = np.fft.rfftfreq(len(morphed), 1 / morpher.sample_rate)

    total_e = np.sum(fft_mag**2)
    centroid = np.sum(fft_freq * fft_mag**2) / total_e if total_e > 0 else 0
    peak_freq = fft_freq[np.argmax(fft_mag)]

    if factor < 0.25:
        character = "bell-like"
    elif factor < 0.45:
        character = "bell + flute"
    elif factor < 0.55:
        character = "hybrid"
    elif factor < 0.75:
        character = "flute + bell"
    else:
        character = "flute-like"

    print(f"{factor:>6.1f} {rms:>8.4f} {centroid:>8.0f} Hz {peak_freq:>9.0f} Hz {character}")

print()
print("=== Harmonic Amplitude Comparison ===")
print(f"{'Partial':>8} {'Bell':>8} {'50% Morph':>10} {'Flute':>8}")
print("-" * 36)

fft_a = np.abs(np.fft.rfft(signal_a))
fft_b = np.abs(np.fft.rfft(signal_b))
morphed_50 = morpher.spectral_morph(signal_a, signal_b, 0.5)
fft_m = np.abs(np.fft.rfft(morphed_50))
fft_freq = np.fft.rfftfreq(len(signal_a), 1 / morpher.sample_rate)

for n in range(1, 8):
    target = fundamental * n
    idx = np.argmin(np.abs(fft_freq - target))
    a_val = fft_a[idx] / np.max(fft_a)
    b_val = fft_b[idx] / np.max(fft_b)
    m_val = fft_m[idx] / np.max(fft_m)
    print(f"{n:>8} {a_val:>8.3f} {m_val:>10.3f} {b_val:>8.3f}")`,
      challenge: 'Create a third timbre — "mridangam drum" — with harmonics at integer ratios but strong even harmonics: [(1,1.0), (2,0.8), (3,0.3), (4,0.7), (5,0.2), (6,0.5)]. Morph between ghungroo and mridangam. At what morph factor does the spectral centroid equal the average of the two endpoints?',
      successHint: 'Sound morphing is used in film sound design (transforming one creature sound into another), video game audio (smoothly transitioning between environment sounds), and electronic music production. The spectral morphing technique you built is the same approach used by professional audio tools.',
    },
    {
      title: 'Complete sound analysis pipeline — from recording to report',
      concept: `In this capstone exercise, you will build a complete **sound analysis pipeline** that takes a simulated ghungroo recording and produces a comprehensive acoustic report. The pipeline combines every technique from the previous lessons: FFT, windowing, peak detection, interpolation, harmonic analysis, spectral envelope, and pitch detection.

A real-world audio analysis pipeline follows these steps: (1) **acquire** the signal (record or load), (2) **preprocess** (normalize, remove DC offset, apply window), (3) **transform** (FFT to frequency domain), (4) **detect** peaks (find frequency components), (5) **classify** peaks (group into harmonic families), (6) **extract** features (centroid, bandwidth, inharmonicity), (7) **report** findings.

This pipeline is the foundation of computational acoustics — used in quality control for musical instruments, architectural acoustics, noise monitoring, and forensic audio analysis.

📚 *A pipeline is a sequence of processing stages where the output of each stage feeds into the input of the next. Designing clean, modular pipelines is one of the most important software engineering skills.*`,
      analogy: 'Think of a medical checkup. The doctor does not just do one test — they take blood pressure, listen to your heart, check reflexes, and run blood tests. Each test provides one piece of information. Together, they give a complete picture of your health. Your sound analysis pipeline does the same thing: each stage provides one acoustic measurement, and together they give a complete picture of the sound.',
      storyConnection: 'Imagine a master ghungroo maker who wants to quality-check a new anklet. Instead of relying solely on experienced ears, they can now run the anklet sound through your analysis pipeline and get objective measurements: how many bells are distinguishable, what frequency range they span, how inharmonic they are, what the shimmer rate is, and whether the spectral balance is good. Science and craftsmanship working together.',
      checkQuestion: 'A pipeline has 5 stages. If each stage takes 10 ms, what is the total latency? If you process 100 buffers, what is the throughput?',
      checkAnswer: 'Total latency for one buffer = 5 * 10 ms = 50 ms. For 100 buffers (pipelined): first result at 50 ms, then one result every 10 ms (the pipeline throughput is limited by the slowest stage). Total time = 50 + 99 * 10 = 1040 ms. Throughput = 100 buffers / 1.04 s = 96 buffers/sec.',
      codeIntro: 'Build a complete sound analysis pipeline that analyzes a simulated ghungroo recording.',
      code: `import numpy as np

# Complete Sound Analysis Pipeline

class GhungrooAnalyzer:
    """Full analysis pipeline for ghungroo sound characterization."""

    def __init__(self, sample_rate=44100, fft_size=8192):
        self.sr = sample_rate
        self.fft_size = fft_size
        self.bin_spacing = sample_rate / fft_size

    def preprocess(self, signal):
        """Remove DC offset and normalize."""
        signal = signal - np.mean(signal)
        peak = np.max(np.abs(signal))
        if peak > 0:
            signal = signal / peak
        return signal

    def compute_spectrum(self, signal):
        """Windowed FFT with Hann window."""
        N = min(len(signal), self.fft_size)
        window = 0.5 * (1 - np.cos(2 * np.pi * np.arange(N) / N))
        buf = signal[:N] * window
        mag = np.abs(np.fft.rfft(buf, n=self.fft_size)) / N * 2
        freqs = np.fft.rfftfreq(self.fft_size, 1 / self.sr)
        return freqs, mag

    def detect_peaks(self, freqs, mag, threshold=0.02):
        """Find peaks with parabolic interpolation."""
        peaks = []
        for i in range(1, len(mag) - 1):
            if mag[i] > mag[i-1] and mag[i] > mag[i+1] and mag[i] > threshold:
                # Parabolic interpolation
                left, center, right = mag[i-1], mag[i], mag[i+1]
                denom = left - 2*center + right
                if abs(denom) > 1e-10:
                    delta = 0.5 * (left - right) / denom
                else:
                    delta = 0
                freq = (i + delta) * self.bin_spacing
                amp = center - 0.25 * (left - right) * delta
                peaks.append({"freq": freq, "amp": amp, "bin": i})
        return peaks

    def compute_features(self, freqs, mag, peaks):
        """Extract acoustic features from spectrum."""
        total_energy = np.sum(mag**2)
        centroid = np.sum(freqs * mag**2) / total_energy if total_energy > 0 else 0

        # Spectral bandwidth
        bandwidth = np.sqrt(np.sum((freqs - centroid)**2 * mag**2) / total_energy) if total_energy > 0 else 0

        # Peak statistics
        peak_freqs = [p["freq"] for p in peaks]
        freq_range = (min(peak_freqs), max(peak_freqs)) if peaks else (0, 0)

        # Estimate shimmer rate (average beat freq between adjacent peaks)
        sorted_freqs = sorted(peak_freqs)
        beat_freqs = [sorted_freqs[i+1] - sorted_freqs[i] for i in range(len(sorted_freqs)-1)]
        avg_shimmer = np.mean(beat_freqs) if beat_freqs else 0

        return {
            "centroid": centroid,
            "bandwidth": bandwidth,
            "num_peaks": len(peaks),
            "freq_range": freq_range,
            "avg_spacing": avg_shimmer,
            "total_energy": total_energy,
        }

    def analyze(self, signal):
        """Run the full pipeline."""
        clean = self.preprocess(signal)
        freqs, mag = self.compute_spectrum(clean)
        peaks = self.detect_peaks(freqs, mag)
        features = self.compute_features(freqs, mag, peaks)
        return {"peaks": peaks, "features": features, "spectrum": (freqs, mag)}

# Generate a realistic ghungroo recording
np.random.seed(123)
sr = 44100
duration = 0.5
N = int(sr * duration)
t = np.linspace(0, duration, N, endpoint=False)

# 12 bells with varying frequencies and amplitudes
num_bells = 12
bell_freqs = sorted(np.random.uniform(2200, 4200, num_bells))
bell_amps = np.random.uniform(0.4, 1.0, num_bells)

signal = np.zeros(N)
for freq, amp in zip(bell_freqs, bell_amps):
    # Each bell has 3 inharmonic partials
    signal += amp * np.sin(2 * np.pi * freq * t)
    signal += amp * 0.3 * np.sin(2 * np.pi * freq * 2.3 * t)
    signal += amp * 0.1 * np.sin(2 * np.pi * freq * 3.6 * t)

# Add realistic noise
signal += 0.05 * np.random.randn(N)

# Apply a decay envelope (bells ring and fade)
decay = np.exp(-t * 3)
signal *= decay

# Run the analyzer
analyzer = GhungrooAnalyzer()
result = analyzer.analyze(signal)

print("=" * 55)
print("       GHUNGROO ACOUSTIC ANALYSIS REPORT")
print("=" * 55)
print()
print(f"Signal: {num_bells} bells, {duration}s, {sr} Hz sample rate")
print()
print("--- Detected Frequency Components ---")
print(f"{'#':<4} {'Frequency':>10} {'Amplitude':>10}")
print("-" * 26)
for i, p in enumerate(sorted(result["peaks"], key=lambda x: -x["amp"])[:15]):
    print(f"{i+1:<4} {p['freq']:>9.1f} Hz {p['amp']:>9.4f}")

f = result["features"]
print()
print("--- Acoustic Features ---")
print(f"Number of components: {f['num_peaks']}")
print(f"Frequency range: {f['freq_range'][0]:.0f} - {f['freq_range'][1]:.0f} Hz")
print(f"Spectral centroid: {f['centroid']:.0f} Hz")
print(f"Spectral bandwidth: {f['bandwidth']:.0f} Hz")
print(f"Average peak spacing: {f['avg_spacing']:.0f} Hz")
print()
print("--- Quality Assessment ---")
bright = "bright" if f["centroid"] > 3500 else "balanced" if f["centroid"] > 2800 else "warm"
rich = "rich" if f["num_peaks"] > 20 else "moderate" if f["num_peaks"] > 10 else "thin"
print(f"Tonal character: {bright}")
print(f"Spectral richness: {rich}")
print(f"Shimmer quality: {'good' if 50 < f['avg_spacing'] < 200 else 'needs adjustment'}")`,
      challenge: 'Extend the analyzer to classify each detected peak as "fundamental" or "overtone" by checking if any peak frequency is approximately 2.3x or 3.6x another peak frequency (within 2% tolerance). How many of the 12 original bell fundamentals can the analyzer recover?',
      successHint: 'You have built a complete acoustic analysis system from scratch. Professional audio analysis tools — MATLAB Audio Toolbox, Praat (for speech), Sonic Visualiser — all follow this same pipeline architecture. The skills you have practiced span signal processing, spectral analysis, feature extraction, and system design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a sound analyzer and synthesizer</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These capstone exercises build a complete sound analysis and synthesis system from scratch.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
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
