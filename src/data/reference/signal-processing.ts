import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'signal-processing',
  title: 'Signals & Frequencies',
  category: 'data-science',
  icon: '🌊',
  tagline: 'Understand the waves hidden in data',
  relatedStories: ['girl-who-spoke-to-elephants', 'bamboo-flute-of-nagaland', 'river-dolphins-secret', 'bamboo-taught-wind', 'mountain-echoes'],

  understand: [
    {
      title: 'What Vibration Is',
      beginnerContent:
        'Pluck a guitar string and watch it blur. It\'s vibrating — moving back and forth ' +
        'rapidly around its resting position. That back-and-forth motion creates a wave in ' +
        'the air, which your ear detects as sound. Almost everything that makes sound — a ' +
        'dhol drum, a bird\'s call, a river\'s rush — does so through vibration.',
      intermediateContent:
        'A signal is any quantity that varies over time or space: sound pressure, voltage, temperature, stock prices. **Analog signals** are continuous; **digital signals** are sampled at discrete steps. The Nyquist theorem: to represent a signal with max frequency f_max, sample at ≥ 2f_max Hz. Human hearing: ~20 kHz, so CD audio uses 44.1 kHz. Sampling below Nyquist causes **aliasing** — high frequencies masquerade as low ones, like wagon wheels appearing to spin backward in film.',
      advancedContent:
        'The **Fourier Transform** converts signals from time to frequency domain: X(f) = ∫x(t)e^(-2πift) dt. The FFT computes the DFT in O(N log N) — for N=1,000,000, a 50,000× speedup. The power spectrum |X(f)|² shows which frequencies dominate. The spectrogram (Short-Time FT) shows how frequency content evolves over time — essential for speech recognition, music analysis, and earthquake seismology. The uncertainty principle (ΔtΔf ≥ 1/4π) means you cannot have perfect time AND frequency resolution simultaneously.',
      diagram: 'TransverseLongitudinalDiagram',
    },
    {
      title: 'Frequency = Speed of Vibration',
      beginnerContent:
        'Frequency tells you how many times something vibrates per second, measured in Hertz ' +
        '(Hz). A low hum might be 100 Hz (100 vibrations per second). A high-pitched whistle ' +
        'might be 4,000 Hz. The higher the frequency, the higher the pitch you hear.',
      intermediateContent:
        'Frequency f (Hz) = cycles per second. A guitar string vibrating 440 times per second = 440 Hz = note A4. Period T = 1/f: T(440 Hz) = 2.27 ms. Human hearing range: ~20 Hz (deep bass rumble) to ~20,000 Hz (highest hiss). The frequency of a vibrating string: f = (1/2L)√(T/μ), where L = length, T = tension, μ = mass per unit length. Shorter string → higher pitch (frets on a guitar), tighter → higher (tuning pegs), thicker → lower (bass strings). This formula connects physics to music.',
      advancedContent:
        'The harmonic series of a vibrating string: f₁ (fundamental), 2f₁ (octave), 3f₁ (perfect fifth above octave), 4f₁ (second octave), 5f₁ (major third), etc. These harmonics determine timbre — why a violin and flute playing the same note sound different (different harmonic amplitudes). The Fourier series decomposes any periodic waveform into its harmonic components. Non-linear systems generate new frequencies: a distorted guitar creates harmonics and intermodulation products (sum and difference frequencies), enriching the sound spectrum.',
      diagram: 'WaveEquationDiagram',
    },
    {
      title: 'Amplitude = Strength of Vibration',
      beginnerContent:
        'Amplitude is how far the vibration swings from the center. A gentle whisper has tiny ' +
        'amplitude; a shout has large amplitude. On a wave diagram, amplitude is the height ' +
        'of the peaks. More amplitude means louder sound or stronger signal.',
      intermediateContent:
        'Bit depth determines amplitude resolution: 8-bit = 256 levels, 16-bit = 65,536 (CD), 24-bit = 16.7 million (pro audio). SNR from quantization: SNR ≈ 6.02n + 1.76 dB. 16-bit: SNR ≈ 98 dB. ADC specs: resolution (bits), sample rate (Hz), input range (Volts). Arduino\'s ADC: 10-bit at up to 10 kHz — adequate for slow signals (temperature, light) but not audio. For audio capture, use an external I2S ADC module (e.g., INMP441 MEMS microphone) with 24-bit resolution at 44.1 kHz.',
      advancedContent:
        'Delta-sigma (ΔΣ) ADCs use 1-bit quantization at MHz rates, then noise-shaping pushes quantization noise to high frequencies where a digital filter removes it — achieving 24-bit effective resolution cheaply. This powers modern audio interfaces and digital scales. The Gabor limit (signal processing\'s uncertainty principle) states ΔtΔf ≥ 1/(4π) — you cannot localize both time and frequency perfectly. Wavelets (Daubechies, Morlet) provide multi-resolution analysis that adapts time-frequency tradeoff to the signal — better than fixed-window FFT for transient events like drum hits, seismic waves, and neural spikes.',
      diagram: 'SineWaveDiagram',
    },
    {
      title: 'How Your Ear Works',
      beginnerContent:
        'Your ear is a biological frequency analyzer. Sound waves enter the ear canal and hit ' +
        'the eardrum, which vibrates. Inside the cochlea (a snail-shaped organ), different ' +
        'positions respond to different frequencies — high pitches near the entrance, low ' +
        'pitches deeper inside. Your brain combines all these responses to let you hear music, ' +
        'speech, and the call of a river dolphin.',
      intermediateContent:
        'Sound enters the ear canal, vibrates the eardrum, which moves three tiny bones (hammer, anvil, stirrup) that amplify vibrations 20× and transmit them to the cochlea. The cochlea is a fluid-filled spiral with ~16,000 hair cells along the basilar membrane. Different positions respond to different frequencies: the base (narrow, stiff) responds to high frequencies, the apex (wide, flexible) to low. When hair cells bend, they generate electrical signals sent to the brain. This frequency-to-position mapping is the basis of place theory of pitch perception.',
      advancedContent:
        'The cochlea performs a real-time Fourier transform mechanically — separating complex sounds into frequency components along the basilar membrane. Each hair cell has ~100 stereocilia that open mechanically-gated ion channels when deflected. Outer hair cells amplify weak signals through electromotility (they physically change length in response to voltage), providing 40-60 dB of cochlear gain. This "cochlear amplifier" gives the ear its remarkable dynamic range (0-120 dB, a factor of 10⁶ in amplitude). Noise-induced hearing loss permanently damages hair cells (they don\'t regenerate in humans), starting with the high-frequency region — which is why hearing loss typically begins with difficulty hearing consonants.',
    },
    {
      title: 'Separating Sounds — The FFT Prism',
      beginnerContent:
        'A prism splits white light into a rainbow of colors. The Fast Fourier Transform (FFT) ' +
        'does the same for sound: it takes a messy, combined signal and separates it into its ' +
        'individual frequencies. This is how noise-canceling headphones know which frequencies ' +
        'to block, and how Priya\'s program could isolate an elephant\'s low-frequency rumble ' +
        'from jungle noise.',
      intermediateContent:
        'The FFT (Fast Fourier Transform) decomposes a signal into its frequency components — like a prism splitting white light into colors. Input: N samples of the signal. Output: N/2 frequency bins, each showing how much energy is at that frequency. The frequency resolution = sample_rate / N. With 44,100 Hz sample rate and N=1024: resolution ≈ 43 Hz per bin. To detect a 440 Hz tone, look at bin 440/43 ≈ bin 10. In Python: spectrum = np.abs(np.fft.rfft(signal)); frequencies = np.fft.rfftfreq(len(signal), 1/sample_rate).',
      advancedContent:
        'Window functions (Hanning, Hamming, Blackman) are multiplied with the signal before FFT to reduce spectral leakage — the smearing of sharp frequency peaks caused by analyzing a finite-length segment. Without windowing, a pure 440 Hz tone appears spread across multiple bins. With a Hanning window, the peak is sharp but the main lobe is wider. The tradeoff: narrower main lobe → better frequency resolution but higher sidelobes. The Short-Time Fourier Transform (STFT) applies windowed FFTs at overlapping positions along the signal, producing a spectrogram — a time-frequency representation essential for speech, music, and vibration analysis.',
      interactive: {
        type: 'slider',
        props: {
          component: 'FrequencySlider',
          title: 'Explore frequency and amplitude',
          description: 'Drag the sliders to see how changing frequency and amplitude affects a wave.',
        },
      },
    },
  ],

  build: [
    {
      title: 'Generating a Sine Wave',
      beginnerContent:
        'A sine wave is the purest tone — a single frequency. All complex sounds are combinations of sine waves.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Parameters
frequency = 440      # Hz (A4 note)
duration = 0.01      # seconds (show 10ms)
sample_rate = 44100  # samples per second

# Generate time array and wave
t = np.linspace(0, duration, int(sample_rate * duration))
wave = np.sin(2 * np.pi * frequency * t)

plt.plot(t * 1000, wave)  # x-axis in milliseconds
plt.xlabel("Time (ms)")
plt.ylabel("Amplitude")
plt.title(f"Sine wave at {frequency} Hz")
plt.grid(True)
plt.show()`,
    },
    {
      title: 'Combining Frequencies',
      beginnerContent:
        'Real sounds are mixtures. Add sine waves of different frequencies to build complex tones.',
      code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 44100
t = np.linspace(0, 0.01, 441)

# Three frequencies
f1, f2, f3 = 220, 440, 660  # fundamental + harmonics
wave = (np.sin(2 * np.pi * f1 * t) +
      0.5 * np.sin(2 * np.pi * f2 * t) +
      0.25 * np.sin(2 * np.pi * f3 * t))

plt.plot(t * 1000, wave)
plt.xlabel("Time (ms)")
plt.ylabel("Amplitude")
plt.title("Three frequencies combined")
plt.grid(True)
plt.show()`,
    },
    {
      title: 'The FFT — Frequency Spectrum',
      beginnerContent:
        'The FFT reveals which frequencies are present in a signal and how strong each one is.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a signal with known frequencies
sample_rate = 44100
duration = 0.5
t = np.linspace(0, duration, int(sample_rate * duration))
signal = (np.sin(2 * np.pi * 220 * t) +
        0.5 * np.sin(2 * np.pi * 440 * t) +
        0.3 * np.sin(2 * np.pi * 880 * t))

# Compute FFT
fft_result = np.fft.fft(signal)
freqs = np.fft.fftfreq(len(signal), 1 / sample_rate)

# Plot only positive frequencies
mask = freqs >= 0
plt.plot(freqs[mask], np.abs(fft_result[mask]) / len(signal))
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude")
plt.title("Frequency Spectrum (FFT)")
plt.xlim(0, 1000)
plt.grid(True)
plt.show()
# You'll see spikes at 220, 440, and 880 Hz`,
    },
    {
      title: 'Filtering a Signal',
      beginnerContent:
        'A low-pass filter removes high frequencies (noise), keeping only the slow, smooth changes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Noisy signal: 5 Hz sine + random noise
sample_rate = 1000
t = np.linspace(0, 1, sample_rate)
clean = np.sin(2 * np.pi * 5 * t)
noisy = clean + 0.5 * np.random.randn(len(t))

# Simple moving-average filter
window = 25
kernel = np.ones(window) / window
filtered = np.convolve(noisy, kernel, mode="same")

plt.figure(figsize=(10, 4))
plt.plot(t, noisy, alpha=0.4, label="Noisy")
plt.plot(t, filtered, "r-", linewidth=2, label="Filtered")
plt.plot(t, clean, "g--", label="Original")
plt.legend()
plt.title("Low-Pass Filtering (Moving Average)")
plt.xlabel("Time (s)")
plt.grid(True)
plt.show()`,
    },
    {
      title: 'Spectrogram — Frequency Over Time',
      beginnerContent:
        'A spectrogram shows how frequencies change over time — essential for analyzing bird calls, speech, and music.',
      diagram: 'SpectrogramDiagram',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Chirp signal: frequency rises from 100 to 1000 Hz
sample_rate = 8000
duration = 2
t = np.linspace(0, duration, int(sample_rate * duration))
freq_start, freq_end = 100, 1000
phase = 2 * np.pi * (freq_start * t +
      (freq_end - freq_start) * t**2 / (2 * duration))
chirp = np.sin(phase)

plt.specgram(chirp, Fs=sample_rate, cmap="viridis")
plt.xlabel("Time (s)")
plt.ylabel("Frequency (Hz)")
plt.colorbar(label="Intensity (dB)")
plt.title("Spectrogram of a Chirp Signal")
plt.show()`,
    },
    {
      title: 'Sampling and Aliasing',
      beginnerContent:
        'The Nyquist theorem says you must sample at least 2x the highest frequency to capture it correctly. Below that, you get aliasing — phantom frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# True signal: 50 Hz
freq = 50
t_fine = np.linspace(0, 0.1, 10000)
true_signal = np.sin(2 * np.pi * freq * t_fine)

# Good sampling: 500 Hz (10x the signal)
sr_good = 500
t_good = np.arange(0, 0.1, 1/sr_good)
s_good = np.sin(2 * np.pi * freq * t_good)

# Bad sampling: 70 Hz (below Nyquist)
sr_bad = 70
t_bad = np.arange(0, 0.1, 1/sr_bad)
s_bad = np.sin(2 * np.pi * freq * t_bad)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))
ax1.plot(t_fine, true_signal, "b-", alpha=0.3)
ax1.stem(t_good, s_good, "g", markerfmt="go", basefmt=" ")
ax1.set_title(f"Good sampling ({sr_good} Hz)")

ax2.plot(t_fine, true_signal, "b-", alpha=0.3)
ax2.stem(t_bad, s_bad, "r", markerfmt="ro", basefmt=" ")
ax2.set_title(f"Aliased sampling ({sr_bad} Hz) — wrong shape!")
plt.tight_layout()
plt.show()`,
    },
  ],
};
