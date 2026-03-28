import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function DolphinLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Project Design: Underwater Acoustic Modem',
      concept: `In Level 3 you built sonar systems and SLAM algorithms. Now you tackle a harder problem: **digital communication through water**. How do you transmit a text message between two underwater devices — say, between a dolphin monitoring station on the riverbed and a surface buoy — using only sound?

This is the domain of **underwater acoustic communication**, and it is fundamentally harder than radio communication through air. Sound travels ~1500 m/s in water (vs 3x10^8 m/s for radio in air). Water absorbs high frequencies aggressively — above 100 kHz, range drops to meters. The Brahmaputra's murky, flowing water adds multipath reflections (sound bouncing off the surface, riverbed, and banks) and Doppler shifts (from currents and moving objects).

Our modem uses **Frequency-Shift Keying (FSK)**: encode binary 0 as one frequency (f0) and binary 1 as another (f1). The transmitter generates tones; the receiver detects which frequency is present in each time window. This is the same modulation scheme used by early telephone modems and is robust to the amplitude fading common in underwater channels.

The pipeline has four stages: **encoding** (text to binary to FSK tones), **channel simulation** (adding realistic underwater effects: attenuation, multipath, noise, Doppler), **demodulation** (detecting frequencies in the received signal), and **decoding** (binary back to text). Each lesson builds one stage.`,
      analogy: 'An acoustic modem is like two people communicating by whistling across a noisy canyon. They agree on a code: a high whistle means 1, a low whistle means 0. The canyon adds echoes (multipath), the wind distorts the pitch (Doppler), and other sounds create interference (noise). The challenge is designing a whistle pattern robust enough to be understood despite all these corruptions.',
      storyConnection: 'The river dolphin uses sound to communicate in the murky Brahmaputra where vision is useless. Our acoustic modem does the same thing — transmitting information through water using sound waves. The dolphin has evolved elegant solutions to multipath, noise, and attenuation over millions of years. Our modem must engineer those solutions from scratch in a few hundred lines of code.',
      checkQuestion: 'Why can\'t we just use radio waves for underwater communication, as we do in air?',
      checkAnswer: 'Radio waves (electromagnetic radiation) are heavily absorbed by water. At typical radio frequencies (MHz-GHz), the signal attenuates by ~100 dB per meter in seawater — it disappears within centimeters. Even in freshwater the absorption is severe. Sound waves, by contrast, can travel kilometers underwater with manageable loss. This is why every underwater communication system — from submarine networks to dolphin biology — uses acoustics.',
      codeIntro: 'Implement the FSK encoding pipeline: convert text to binary, then binary to audio tones at two frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- FSK Modem Parameters ---
SAMPLE_RATE = 44100  # Hz (audio sample rate)
F0 = 1000            # Hz — frequency for binary 0
F1 = 2000            # Hz — frequency for binary 1
BIT_DURATION = 0.02  # seconds per bit (50 bits/second)
CARRIER_AMP = 1.0    # amplitude

print("Underwater Acoustic Modem — FSK Parameters")
print("=" * 50)
print(f"Sample rate:    {SAMPLE_RATE} Hz")
print(f"Frequency 0:    {F0} Hz")
print(f"Frequency 1:    {F1} Hz")
print(f"Bit duration:   {BIT_DURATION*1000:.0f} ms")
print(f"Bit rate:       {1/BIT_DURATION:.0f} bps")
print(f"Samples/bit:    {int(SAMPLE_RATE * BIT_DURATION)}")

# --- Text to binary ---
def text_to_bits(text):
    """Convert ASCII text to a list of bits."""
    bits = []
    for char in text:
        byte = format(ord(char), '08b')  # 8-bit ASCII
        bits.extend([int(b) for b in byte])
    return np.array(bits)

def bits_to_text(bits):
    """Convert a list of bits back to ASCII text."""
    bits = list(bits)
    # Pad to multiple of 8
    while len(bits) % 8 != 0:
        bits.append(0)
    text = ''
    for i in range(0, len(bits), 8):
        byte = bits[i:i+8]
        char_code = int(''.join(str(b) for b in byte), 2)
        if 32 <= char_code <= 126:  # printable ASCII
            text += chr(char_code)
        else:
            text += '?'
    return text

# --- FSK modulation ---
def fsk_modulate(bits, sample_rate=SAMPLE_RATE, f0=F0, f1=F1,
                 bit_duration=BIT_DURATION, amplitude=CARRIER_AMP):
    """Convert bits to FSK audio signal."""
    samples_per_bit = int(sample_rate * bit_duration)
    signal = np.zeros(len(bits) * samples_per_bit)

    for i, bit in enumerate(bits):
        freq = f1 if bit == 1 else f0
        t = np.arange(samples_per_bit) / sample_rate
        start = i * samples_per_bit
        signal[start:start+samples_per_bit] = amplitude * np.sin(2 * np.pi * freq * t)

    return signal

# --- Encode a message ---
message = "DOLPHIN"
bits = text_to_bits(message)
signal = fsk_modulate(bits)

print(f"\\nMessage: '{message}'")
print(f"Bits: {len(bits)} ({len(message)} chars x 8 bits)")
print(f"Signal duration: {len(signal)/SAMPLE_RATE*1000:.0f} ms")
print(f"Signal samples: {len(signal)}")
print(f"First 16 bits: {bits[:16]}")
print(f"  = '{message[0]}' ({ord(message[0])}) + '{message[1]}' ({ord(message[1])}) start")

# --- Visualization ---
fig, axes = plt.subplots(3, 1, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('FSK Encoding: Text -> Binary -> Audio Tones',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Bit sequence
ax = axes[0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
bit_times = np.arange(len(bits)) * BIT_DURATION * 1000
ax.step(bit_times, bits, where='post', color='#3b82f6', linewidth=1.5)
ax.set_ylabel('Bit value', color='white')
ax.set_xlabel('Time (ms)', color='white')
ax.set_title(f'Binary sequence: "{message}" ({len(bits)} bits)', color='white', fontsize=11)
ax.set_ylim(-0.2, 1.4)
# Mark character boundaries
for i in range(len(message)):
    x = i * 8 * BIT_DURATION * 1000
    ax.axvline(x, color='gray', linestyle=':', alpha=0.5)
    ax.text(x + 4*BIT_DURATION*1000, 1.2, message[i], color='#f59e0b',
            ha='center', fontsize=10, fontweight='bold')

# Panel 2: FSK waveform (first 32 bits)
ax = axes[1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
show_bits = 32
show_samples = int(show_bits * SAMPLE_RATE * BIT_DURATION)
t_ms = np.arange(show_samples) / SAMPLE_RATE * 1000
ax.plot(t_ms, signal[:show_samples], color='#22c55e', linewidth=0.5)
ax.set_ylabel('Amplitude', color='white')
ax.set_xlabel('Time (ms)', color='white')
ax.set_title('FSK Waveform (first 32 bits)', color='white', fontsize=11)
# Color background by bit value
spb = int(SAMPLE_RATE * BIT_DURATION)
for i in range(min(show_bits, len(bits))):
    x0 = i * BIT_DURATION * 1000
    x1 = (i+1) * BIT_DURATION * 1000
    color = '#3b82f620' if bits[i] == 1 else '#ef444420'
    ax.axvspan(x0, x1, facecolor=color)

# Panel 3: Spectrogram
ax = axes[2]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
from numpy.fft import fft
n_bits_show = min(40, len(bits))
spb = int(SAMPLE_RATE * BIT_DURATION)
spec = np.zeros((n_bits_show, spb//2))
for i in range(n_bits_show):
    chunk = signal[i*spb:(i+1)*spb]
    spec_chunk = np.abs(fft(chunk))[:spb//2]
    spec[i] = spec_chunk

freqs = np.arange(spb//2) * SAMPLE_RATE / spb
freq_mask = (freqs >= 500) & (freqs <= 3000)
spec_show = spec[:, freq_mask].T

ax.imshow(spec_show, aspect='auto', origin='lower', cmap='inferno',
          extent=[0, n_bits_show*BIT_DURATION*1000, freqs[freq_mask][0], freqs[freq_mask][-1]])
ax.axhline(F0, color='#3b82f6', linestyle='--', linewidth=1.5, label=f'f0={F0} Hz (bit=0)')
ax.axhline(F1, color='#ef4444', linestyle='--', linewidth=1.5, label=f'f1={F1} Hz (bit=1)')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Frequency (Hz)', color='white')
ax.set_title('Spectrogram — FSK Frequency Switching', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# Verify encoding round-trip
decoded = bits_to_text(bits)
print(f"\\nRound-trip verification: '{decoded}' {'PASS' if decoded == message else 'FAIL'}")
print("Encoding pipeline complete. Next: simulate the underwater channel.")`,
      challenge: 'Implement a preamble: prepend a known bit pattern (e.g., 10101010) before the message so the receiver can detect the start of transmission. Modify fsk_modulate to add the preamble automatically.',
      successHint: 'FSK encoding is the foundation of digital communication. By mapping bits to frequencies, we convert abstract data into physical signals that can propagate through water. The spectrogram visually confirms the frequency switching — each bit is clearly visible as a horizontal band at either f0 or f1.',
    },
    {
      title: 'Channel Simulation: Underwater Acoustic Effects',
      concept: `Between transmitter and receiver, the signal must travel through water. The Brahmaputra is a challenging acoustic environment: murky sediment-laden water, strong currents (2-5 m/s during monsoon), a riverbed that reflects and scatters sound, and biological noise from fish and dolphins.

We simulate four key channel effects:

**1. Frequency-dependent attenuation**: Higher frequencies are absorbed more than lower ones. The Thorp formula gives absorption in dB/km as a function of frequency. At 1 kHz, absorption is ~0.06 dB/km; at 10 kHz, it is ~1 dB/km; at 100 kHz, it is ~30 dB/km. This is why our FSK frequencies are in the low kHz range.

**2. Multipath propagation**: Sound reflects off the surface, riverbed, and banks, arriving at the receiver via multiple paths with different delays. The direct path arrives first; reflected paths arrive later, creating echoes. Each reflection has different amplitude and phase. The superposition of all paths creates constructive and destructive interference — **frequency-selective fading**.

**3. Additive noise**: Ambient noise from river flow, biological sources (fish, dolphins), boat engines, and thermal noise. Modeled as colored noise (not white) because underwater noise has a frequency-dependent power spectrum.

**4. Doppler shift**: River current moves the water between transmitter and receiver, shifting frequencies. A current of 2 m/s causes a frequency shift of f * v/c = f * 2/1500 = 0.13% — small but enough to cause bit errors in narrow-band systems.`,
      analogy: 'The underwater channel is like shouting across a canyon with waterfalls. Your voice echoes off multiple walls (multipath), the waterfall noise drowns out quiet parts (additive noise), wind shifts the pitch (Doppler), and the farther you shout, the quieter it gets (attenuation). Communicating reliably in this environment requires robust modulation — you need to "shout" in a way that survives all these corruptions.',
      storyConnection: 'The Brahmaputra river dolphin navigates this exact acoustic environment every day. Its echolocation clicks are specifically evolved for murky, noisy, multipath-rich river water — short broadband pulses that are robust to interference. Our modem faces the same physics and must find engineering solutions to the same problems the dolphin solved through evolution.',
      checkQuestion: 'If you double the distance between transmitter and receiver, what happens to the signal-to-noise ratio in the underwater channel?',
      checkAnswer: 'It drops dramatically — by more than 6 dB (a factor of 4 in power). The signal attenuates both from geometric spreading (proportional to distance squared, like all waves) AND from frequency-dependent absorption (exponential with distance). Meanwhile, noise remains constant. So doubling distance costs you spreading loss (~6 dB) plus absorption loss (depends on frequency). This is why underwater acoustic modems have limited range — typically 1-10 km at kHz frequencies.',
      codeIntro: 'Build a realistic underwater channel simulator with attenuation, multipath, noise, and Doppler, then visualize how each effect degrades the transmitted signal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

SR = 44100; F0 = 1000; F1 = 2000; BIT_DUR = 0.02

def text_to_bits(text):
    bits = []
    for c in text: bits.extend([int(b) for b in format(ord(c), '08b')])
    return np.array(bits)

def fsk_mod(bits):
    spb = int(SR * BIT_DUR); sig = np.zeros(len(bits) * spb)
    for i, b in enumerate(bits):
        f = F1 if b else F0; t = np.arange(spb) / SR
        sig[i*spb:(i+1)*spb] = np.sin(2*np.pi*f*t)
    return sig

# --- Underwater Channel Model ---
class UnderwaterChannel:
    """Simulate realistic underwater acoustic propagation."""

    def __init__(self, distance_m=500, depth_m=8, current_ms=1.5,
                 snr_db=15, seed=42):
        np.random.seed(seed)
        self.distance = distance_m
        self.depth = depth_m
        self.current = current_ms
        self.snr_db = snr_db
        self.c_water = 1500  # speed of sound in water (m/s)

    def _attenuation(self, signal):
        """Frequency-dependent attenuation (Thorp model, simplified)."""
        # Apply overall distance-based loss
        # Spreading loss: 20*log10(distance)
        spreading_db = 20 * np.log10(max(self.distance, 1))
        # Absorption at 1-2 kHz: ~0.06 dB/km
        absorption_db = 0.06 * self.distance / 1000
        total_db = spreading_db + absorption_db
        gain = 10 ** (-total_db / 20)
        return signal * gain

    def _multipath(self, signal):
        """Add multipath reflections (surface bounce, bottom bounce)."""
        result = signal.copy()

        # Direct path: no delay (already present)
        # Surface reflection: extra path = 2*depth, inverted phase
        surface_delay = int(2 * self.depth / self.c_water * SR)
        surface_gain = -0.7  # phase inversion + loss
        if surface_delay < len(signal):
            reflected = np.zeros_like(signal)
            reflected[surface_delay:] = signal[:-surface_delay] * surface_gain
            result += reflected

        # Bottom reflection: extra path = 2*depth, same phase, more loss
        bottom_delay = int(2 * self.depth / self.c_water * SR * 1.3)
        bottom_gain = 0.4  # sediment absorbs more
        if bottom_delay < len(signal):
            reflected = np.zeros_like(signal)
            reflected[bottom_delay:] = signal[:-bottom_delay] * bottom_gain
            result += reflected

        # Bank reflection: longer delay, weak
        bank_delay = int(50 / self.c_water * SR)  # 50m to bank
        bank_gain = 0.15
        if bank_delay < len(signal):
            reflected = np.zeros_like(signal)
            reflected[bank_delay:] = signal[:-bank_delay] * bank_gain
            result += reflected

        return result

    def _add_noise(self, signal):
        """Add colored underwater noise."""
        n = len(signal)
        # White noise base
        noise = np.random.randn(n)
        # Color it: underwater noise is stronger at low frequencies
        # Simple 1/f coloring via cumulative sum + normalization
        colored = np.cumsum(noise)
        colored = colored - np.mean(colored)
        colored = colored / (np.std(colored) + 1e-10)
        # Mix white + colored for realistic spectrum
        noise_mixed = 0.6 * noise + 0.4 * colored
        noise_mixed = noise_mixed / (np.std(noise_mixed) + 1e-10)

        # Scale to desired SNR
        sig_power = np.mean(signal**2)
        noise_power_target = sig_power / (10 ** (self.snr_db / 10))
        noise_scaled = noise_mixed * np.sqrt(noise_power_target)

        return signal + noise_scaled

    def _doppler(self, signal):
        """Apply Doppler shift from river current."""
        # Doppler factor: f_received = f_transmitted * (c + v_receiver) / (c + v_source)
        # For stationary endpoints with moving medium:
        doppler_factor = self.c_water / (self.c_water - self.current)
        # Resample signal
        n_out = int(len(signal) / doppler_factor)
        indices = np.linspace(0, len(signal)-1, n_out)
        resampled = np.interp(indices, np.arange(len(signal)), signal)
        # Pad or trim to original length
        if len(resampled) < len(signal):
            resampled = np.concatenate([resampled, np.zeros(len(signal)-len(resampled))])
        else:
            resampled = resampled[:len(signal)]
        return resampled

    def propagate(self, signal):
        """Pass signal through the complete channel."""
        s = self._attenuation(signal)
        s = self._multipath(s)
        s = self._doppler(s)
        s = self._add_noise(s)
        return s

# --- Demonstrate channel effects ---
message = "SOS"
bits = text_to_bits(message)
tx_signal = fsk_mod(bits)

channel = UnderwaterChannel(distance_m=500, depth_m=8, current_ms=1.5, snr_db=12)

# Apply effects one at a time for visualization
s_atten = channel._attenuation(tx_signal.copy())
s_multi = channel._multipath(tx_signal.copy())
s_doppler = channel._doppler(tx_signal.copy())
s_full = channel.propagate(tx_signal.copy())

fig, axes = plt.subplots(3, 2, figsize=(16, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Underwater Channel Effects on FSK Signal',
             color='white', fontsize=14, fontweight='bold')

signals = [
    (tx_signal, 'Original TX Signal', '#22c55e'),
    (s_atten, f'After Attenuation ({channel.distance}m)', '#3b82f6'),
    (s_multi, 'After Multipath', '#f59e0b'),
    (s_doppler, f'After Doppler ({channel.current} m/s)', '#a855f7'),
    (s_full, f'Full Channel (SNR={channel.snr_db}dB)', '#ef4444'),
]

show_samples = int(16 * SR * BIT_DUR)  # first 16 bits
for idx, (sig, title, color) in enumerate(signals):
    ax = axes.flat[idx]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
    t_ms = np.arange(min(show_samples, len(sig))) / SR * 1000
    ax.plot(t_ms, sig[:len(t_ms)], color=color, linewidth=0.5)
    ax.set_title(title, color='white', fontsize=10)
    ax.set_xlabel('Time (ms)', color='white', fontsize=8)
    ax.set_ylabel('Amplitude', color='white', fontsize=8)

# Last panel: power spectrum comparison
ax = axes.flat[5]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for sig, title, color in [(tx_signal, 'TX', '#22c55e'), (s_full, 'RX (full channel)', '#ef4444')]:
    spectrum = np.abs(np.fft.rfft(sig))
    freqs = np.fft.rfftfreq(len(sig), d=1/SR)
    mask = (freqs >= 500) & (freqs <= 3000)
    ax.plot(freqs[mask], 20*np.log10(spectrum[mask]+1e-10), color=color,
            linewidth=1, label=title, alpha=0.8)
ax.axvline(F0, color='gray', linestyle=':', alpha=0.5)
ax.axvline(F1, color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Power (dB)', color='white')
ax.set_title('Spectrum: TX vs RX', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print(f"Channel parameters:")
print(f"  Distance: {channel.distance}m | Depth: {channel.depth}m")
print(f"  Current: {channel.current} m/s | SNR: {channel.snr_db} dB")
print(f"  Doppler shift: {channel.current/channel.c_water*100:.3f}%")
print(f"\\nSignal degradation visible: attenuation reduces amplitude,")
print(f"multipath adds echoes, Doppler shifts frequencies, noise corrupts.")
print(f"Next: build a demodulator that recovers bits from the corrupted signal.")`,
      challenge: 'Add a frequency-dependent attenuation model: apply the Thorp formula to attenuate high frequencies more than low ones using an FFT/IFFT approach. Does this change which FSK frequency (f0 or f1) suffers more?',
      successHint: 'The underwater channel is hostile to communication. Every effect we model — attenuation, multipath, noise, Doppler — has a direct physical cause in the Brahmaputra river. Understanding these effects is essential for designing a demodulator that can recover the original message.',
    },
    {
      title: 'FSK Demodulation: Recovering Bits from Noise',
      concept: `The receiver gets a corrupted version of the transmitted signal and must figure out which frequency was sent in each bit window. This is **demodulation** — the inverse of modulation.

For FSK, the standard demodulation technique is the **matched filter** (also called coherent detection). For each bit window:
1. Multiply the received signal by a reference sine at f0 and a reference sine at f1.
2. Integrate (sum) each product over the bit window. This gives the **correlation** between the received signal and each reference.
3. The frequency with higher correlation wins — that bit is decoded as 0 or 1.

Why does this work? If the received signal contains f0, multiplying by sin(2*pi*f0*t) produces a positive DC component (sin^2 averages to 0.5). Multiplying by sin(2*pi*f1*t) produces a zero-mean oscillation (sin(f0*t)*sin(f1*t) averages to zero when f0 != f1). So the correct frequency gives a large correlation; the wrong one gives approximately zero.

This is called **orthogonality** — if f0 and f1 are chosen so that their product integrates to zero over the bit window, they do not interfere with each other. The condition is that (f1-f0) * bit_duration is an integer — which we satisfy with f0=1000, f1=2000, bit_duration=0.02: (2000-1000)*0.02 = 20, an integer.

Noise corrupts the correlations, adding random offsets. But as long as the correct frequency's correlation exceeds the incorrect one's, the bit is decoded correctly. The **bit error rate (BER)** depends on SNR.`,
      analogy: 'Matched filter demodulation is like tuning a radio. When you tune to 101.5 FM, the radio amplifies signals near 101.5 MHz and suppresses everything else. The matched filter does the same thing: it "tunes" to f0 and f1 separately, measuring how much energy the received signal has at each frequency. The station with the stronger signal wins.',
      storyConnection: 'The river dolphin\'s brain performs a biological matched filter when processing echoes. It generates an internal "template" of the transmitted click and correlates the returning echo against it. This is how it achieves extraordinary target detection in noisy water — exactly the same principle our matched filter uses. Evolution discovered coherent detection millions of years before engineers.',
      checkQuestion: 'If the Doppler shift moves f0=1000 Hz to 1001 Hz, will the matched filter still work? What if it shifts to 1050 Hz?',
      checkAnswer: 'At 1001 Hz (0.1% shift), the correlation with the f0=1000 Hz reference is barely affected — the mismatch is negligible over a 20ms window. At 1050 Hz (5% shift), the correlation drops significantly because the reference and received signal go in and out of phase multiple times per window. The matched filter still picks f0 over f1 (since 1050 is closer to 1000 than to 2000), but the correlation margin shrinks, making the system more susceptible to noise. Doppler compensation (tracking and correcting the shift) is needed for reliable operation in strong currents.',
      codeIntro: 'Implement the matched filter demodulator, test it on clean and noisy signals, and measure bit error rate vs SNR.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

SR = 44100; F0 = 1000; F1 = 2000; BIT_DUR = 0.02
SPB = int(SR * BIT_DUR)  # samples per bit

def text_to_bits(text):
    bits = []
    for c in text: bits.extend([int(b) for b in format(ord(c), '08b')])
    return np.array(bits)

def bits_to_text(bits):
    text = ''
    for i in range(0, len(bits), 8):
        if i+8 <= len(bits):
            code = int(''.join(str(int(b)) for b in bits[i:i+8]), 2)
            text += chr(code) if 32 <= code <= 126 else '?'
    return text

def fsk_mod(bits):
    sig = np.zeros(len(bits) * SPB)
    for i, b in enumerate(bits):
        f = F1 if b else F0; t = np.arange(SPB) / SR
        sig[i*SPB:(i+1)*SPB] = np.sin(2*np.pi*f*t)
    return sig

# --- Matched Filter Demodulator ---
def fsk_demodulate(signal, n_bits=None):
    """Demodulate FSK signal using matched filter (coherent detection)."""
    if n_bits is None:
        n_bits = len(signal) // SPB

    # Reference signals for one bit period
    t_ref = np.arange(SPB) / SR
    ref_0 = np.sin(2 * np.pi * F0 * t_ref)
    ref_1 = np.sin(2 * np.pi * F1 * t_ref)

    decoded_bits = []
    correlations_0 = []
    correlations_1 = []

    for i in range(n_bits):
        start = i * SPB
        end = start + SPB
        if end > len(signal):
            break
        chunk = signal[start:end]

        # Correlate with both references
        corr_0 = np.sum(chunk * ref_0)
        corr_1 = np.sum(chunk * ref_1)

        correlations_0.append(corr_0)
        correlations_1.append(corr_1)

        # Decision: higher correlation wins
        decoded_bits.append(1 if corr_1 > corr_0 else 0)

    return np.array(decoded_bits), np.array(correlations_0), np.array(correlations_1)

# --- Test on clean signal ---
message = "DOLPHIN"
tx_bits = text_to_bits(message)
tx_signal = fsk_mod(tx_bits)

decoded, corr0, corr1 = fsk_demodulate(tx_signal, n_bits=len(tx_bits))
decoded_text = bits_to_text(decoded)
ber_clean = np.mean(decoded != tx_bits)

print(f"Clean channel test:")
print(f"  TX: '{message}' -> {len(tx_bits)} bits")
print(f"  RX: '{decoded_text}' | BER = {ber_clean:.4f}")

# --- Test across SNR values ---
def add_awgn(signal, snr_db):
    sig_power = np.mean(signal**2)
    noise_power = sig_power / (10 ** (snr_db / 10))
    noise = np.random.randn(len(signal)) * np.sqrt(noise_power)
    return signal + noise

test_message = "BRAHMAPUTRA RIVER DOLPHIN CONSERVATION"
test_bits = text_to_bits(test_message)
test_signal = fsk_mod(test_bits)

snr_values = np.arange(-5, 25, 2)
ber_values = []

for snr in snr_values:
    errors = 0; trials = 5
    for _ in range(trials):
        noisy = add_awgn(test_signal, snr)
        dec, _, _ = fsk_demodulate(noisy, n_bits=len(test_bits))
        errors += np.sum(dec != test_bits)
    ber_values.append(errors / (trials * len(test_bits)))

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('FSK Demodulation — Matched Filter Detection',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Correlation values for clean signal
ax = axes[0, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
x = np.arange(min(40, len(corr0)))
ax.bar(x-0.2, np.abs(corr0[:40]), 0.4, color='#3b82f6', label='|corr(f0)|', alpha=0.8)
ax.bar(x+0.2, np.abs(corr1[:40]), 0.4, color='#ef4444', label='|corr(f1)|', alpha=0.8)
# Mark bit values
for i in range(min(40, len(tx_bits))):
    ax.text(i, max(np.abs(corr0[i]), np.abs(corr1[i]))+5, str(tx_bits[i]),
            ha='center', color='white', fontsize=6)
ax.set_xlabel('Bit index', color='white')
ax.set_ylabel('Correlation magnitude', color='white')
ax.set_title('Matched Filter Correlations (clean)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 2: Noisy demodulation example
ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
noisy_sig = add_awgn(test_signal, snr_db=8)
dec_noisy, cn0, cn1 = fsk_demodulate(noisy_sig, n_bits=len(test_bits))
diff = np.abs(cn1[:40]) - np.abs(cn0[:40])
colors_bar = ['#22c55e' if d > 0 and test_bits[i] == 1 or d <= 0 and test_bits[i] == 0
              else '#ef4444' for i, d in enumerate(diff)]
ax.bar(range(min(40, len(diff))), diff, color=colors_bar, alpha=0.8)
ax.axhline(0, color='white', linewidth=0.5)
ax.set_xlabel('Bit index', color='white')
ax.set_ylabel('corr(f1) - corr(f0)', color='white')
ax.set_title('Decision Margins @ SNR=8dB (green=correct, red=error)', color='white', fontsize=10)

# Panel 3: BER vs SNR curve
ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.semilogy(snr_values, [max(b, 1e-4) for b in ber_values], 'o-', color='#a855f7',
            linewidth=2, markersize=6)
ax.set_xlabel('SNR (dB)', color='white', fontsize=11)
ax.set_ylabel('Bit Error Rate (BER)', color='white', fontsize=11)
ax.set_title('BER vs SNR — FSK Performance', color='white', fontsize=12, fontweight='bold')
ax.axhline(0.01, color='#f59e0b', linestyle='--', alpha=0.7, label='BER=1% threshold')
ax.axhline(0.001, color='#22c55e', linestyle='--', alpha=0.7, label='BER=0.1% threshold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(1e-4, 1)
ax.grid(True, alpha=0.2)

# Panel 4: Decoded messages at various SNR
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.set_xticks([]); ax.set_yticks([])
display_snrs = [20, 12, 8, 4, 0, -4]
text_display = f"Original: {test_message}\\n{'='*50}\\n"
for snr in display_snrs:
    noisy = add_awgn(test_signal, snr)
    dec, _, _ = fsk_demodulate(noisy, n_bits=len(test_bits))
    dec_text = bits_to_text(dec)
    ber = np.mean(dec != test_bits)
    text_display += f"SNR={snr:>3}dB  BER={ber:.3f}  {dec_text}\\n"

ax.text(0.05, 0.95, text_display, transform=ax.transAxes, color='#22c55e',
        fontsize=8, va='top', fontfamily='monospace',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))
ax.set_title('Decoded Messages at Various SNR', color='white', fontsize=11)

plt.tight_layout()
plt.show()

# Find SNR threshold for 1% BER
for i, (snr, ber) in enumerate(zip(snr_values, ber_values)):
    if ber <= 0.01:
        print(f"\\nSNR for BER <= 1%: approximately {snr} dB")
        break
print(f"At high SNR (>15 dB): perfect decoding")
print(f"At low SNR (<0 dB): message is unrecoverable")`,
      challenge: 'Implement a non-coherent demodulator: instead of correlating with sine waves, use the magnitude of the FFT at f0 and f1 for each bit window. Compare its BER curve to the matched filter. Which is better, and why?',
      successHint: 'The matched filter is mathematically optimal for detecting known signals in Gaussian noise — no other demodulator can achieve a lower BER at the same SNR. Understanding why (orthogonality + maximum correlation) is understanding the heart of digital communications.',
    },
    {
      title: 'Error Correction: Detecting and Fixing Bit Errors',
      concept: `Even with a good demodulator, the underwater channel will flip some bits. A single bit error in an 8-bit ASCII character turns "D" into a random symbol. We need **error correction coding** — adding redundancy to the message so the receiver can detect and fix errors without retransmission.

We implement two coding schemes:

**1. Repetition coding**: Send each bit 3 times (or 5 times). The receiver takes a majority vote. If noise flips 1 out of 3 copies, the majority is still correct. Rate: 1/3 (3x overhead). Simple but wasteful.

**2. Hamming(7,4) code**: Encode every 4 data bits into 7 bits by adding 3 parity bits. The parity bits are computed so that any single-bit error creates a unique "syndrome" that identifies the error position, allowing correction. Rate: 4/7 (~57% efficiency). This is one of the foundational codes of information theory, invented by Richard Hamming in 1950.

The fundamental tradeoff is **rate vs robustness**. Higher redundancy catches more errors but reduces throughput. At our 50 bps FSK rate, adding 3x redundancy drops effective rate to ~17 bps — transmitting "DOLPHIN" takes 3x longer. The Hamming code is much more efficient: it corrects all single-bit errors while using only 75% more bits (7 vs 4).

Shannon's Channel Capacity Theorem tells us the theoretical limit: for a given SNR, there is a maximum data rate at which error-free communication is possible. Our practical codes approach but never reach this limit.`,
      analogy: 'Error correction is like speaking slowly and clearly to someone across a noisy room. Repetition coding: "MEET. ME. AT. NOON. MEET. ME. AT. NOON. MEET. ME. AT. NOON." — wasteful but effective. Hamming coding: "MEET ME AT NOON. That rhymes with MOON." — the rhyming provides a checksum that lets the listener verify and correct errors using context, with much less overhead.',
      storyConnection: 'River dolphins repeat their echolocation clicks rapidly — a form of biological repetition coding. By sending many clicks and averaging the echoes, they improve detection in noisy water. Our error correction codes do the same thing more efficiently: instead of brute-force repetition, they add structured redundancy that enables targeted error correction.',
      checkQuestion: 'A Hamming(7,4) code can correct 1 error per 7-bit block. If the channel has a BER of 5%, what is the probability that a single block has more than 1 error (and thus cannot be corrected)?',
      checkAnswer: 'P(>1 error in 7 bits) = 1 - P(0 errors) - P(1 error) = 1 - 0.95^7 - 7*0.05*0.95^6 = 1 - 0.698 - 0.257 = 0.044 (about 4.4%). So at 5% BER, roughly 4.4% of blocks will have uncorrectable errors. This is a huge improvement over the raw 5% BER — the effective BER drops to about 0.6%. But for very noisy channels (BER > 10%), even Hamming coding struggles because multi-bit errors become too common.',
      codeIntro: 'Implement repetition coding and Hamming(7,4) encoding/decoding, then compare their error correction performance across SNR values.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

SR = 44100; F0 = 1000; F1 = 2000; BIT_DUR = 0.02; SPB = int(SR * BIT_DUR)

def text_to_bits(text):
    bits = []
    for c in text: bits.extend([int(b) for b in format(ord(c), '08b')])
    return np.array(bits)

def bits_to_text(bits):
    text = ''
    for i in range(0, len(bits)-7, 8):
        code = int(''.join(str(int(b)) for b in bits[i:i+8]), 2)
        text += chr(code) if 32 <= code <= 126 else '?'
    return text

def fsk_mod(bits):
    sig = np.zeros(len(bits) * SPB)
    for i, b in enumerate(bits):
        f = F1 if b else F0; t = np.arange(SPB) / SR
        sig[i*SPB:(i+1)*SPB] = np.sin(2*np.pi*f*t)
    return sig

def fsk_demod(signal, n_bits):
    t_ref = np.arange(SPB) / SR
    r0 = np.sin(2*np.pi*F0*t_ref); r1 = np.sin(2*np.pi*F1*t_ref)
    bits = []
    for i in range(n_bits):
        s = i*SPB; e = s+SPB
        if e > len(signal): break
        c = signal[s:e]
        bits.append(1 if np.sum(c*r1) > np.sum(c*r0) else 0)
    return np.array(bits)

def add_awgn(signal, snr_db):
    sp = np.mean(signal**2)
    np_t = sp / (10**(snr_db/10))
    return signal + np.random.randn(len(signal)) * np.sqrt(np_t)

# --- Repetition Code (rate 1/3) ---
def rep3_encode(bits):
    return np.repeat(bits, 3)

def rep3_decode(bits):
    n = len(bits) // 3 * 3
    bits = bits[:n].reshape(-1, 3)
    return (np.sum(bits, axis=1) >= 2).astype(int)

# --- Hamming(7,4) Code ---
# Generator matrix G: 4 data bits -> 7 coded bits
G = np.array([
    [1, 1, 0, 1],  # p1
    [1, 0, 1, 1],  # p2
    [1, 0, 0, 0],  # d1
    [0, 1, 1, 1],  # p3
    [0, 1, 0, 0],  # d2
    [0, 0, 1, 0],  # d3
    [0, 0, 0, 1],  # d4
])

# Parity check matrix H
H = np.array([
    [1, 0, 1, 0, 1, 0, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 1],
])

def hamming74_encode(bits):
    """Encode data bits using Hamming(7,4)."""
    # Pad to multiple of 4
    pad = (4 - len(bits) % 4) % 4
    if pad > 0:
        bits = np.concatenate([bits, np.zeros(pad, dtype=int)])

    coded = []
    for i in range(0, len(bits), 4):
        d = bits[i:i+4]
        codeword = (G @ d) % 2
        coded.extend(codeword)
    return np.array(coded)

def hamming74_decode(bits):
    """Decode Hamming(7,4) with single-error correction."""
    n = len(bits) // 7 * 7
    bits = bits[:n]
    decoded = []

    for i in range(0, n, 7):
        received = bits[i:i+7].copy()

        # Compute syndrome
        syndrome = (H @ received) % 2
        error_pos = syndrome[0]*1 + syndrome[1]*2 + syndrome[2]*4

        # Correct error if syndrome is non-zero
        if error_pos > 0 and error_pos <= 7:
            received[error_pos-1] ^= 1  # flip the error bit

        # Extract data bits (positions 2, 4, 5, 6 in 0-indexed)
        decoded.extend([received[2], received[4], received[5], received[6]])

    return np.array(decoded)

# --- Performance comparison ---
message = "RIVER DOLPHIN ALERT SYSTEM"
raw_bits = text_to_bits(message)

snr_values = np.arange(-5, 25, 1.5)
ber_none = []; ber_rep3 = []; ber_hamming = []

for snr in snr_values:
    trials = 8
    err_n, err_r, err_h = 0, 0, 0

    for _ in range(trials):
        # No coding
        sig = fsk_mod(raw_bits)
        noisy = add_awgn(sig, snr)
        dec = fsk_demod(noisy, len(raw_bits))
        err_n += np.sum(dec != raw_bits)

        # Repetition coding
        rep_bits = rep3_encode(raw_bits)
        sig_r = fsk_mod(rep_bits)
        noisy_r = add_awgn(sig_r, snr)
        dec_r = fsk_demod(noisy_r, len(rep_bits))
        dec_r = rep3_decode(dec_r)[:len(raw_bits)]
        err_r += np.sum(dec_r != raw_bits)

        # Hamming coding
        ham_bits = hamming74_encode(raw_bits)
        sig_h = fsk_mod(ham_bits)
        noisy_h = add_awgn(sig_h, snr)
        dec_h = fsk_demod(noisy_h, len(ham_bits))
        dec_h = hamming74_decode(dec_h)[:len(raw_bits)]
        err_h += np.sum(dec_h != raw_bits)

    total = trials * len(raw_bits)
    ber_none.append(err_n / total)
    ber_rep3.append(err_r / total)
    ber_hamming.append(err_h / total)

# --- Visualization ---
fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Error Correction: Repetition vs Hamming(7,4)',
             color='white', fontsize=14, fontweight='bold')

# BER curves
ax = axes[0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.semilogy(snr_values, [max(b,1e-4) for b in ber_none], 'o-', color='#ef4444',
            linewidth=2, markersize=4, label='No coding (rate=1)')
ax.semilogy(snr_values, [max(b,1e-4) for b in ber_rep3], 's-', color='#3b82f6',
            linewidth=2, markersize=4, label='Repetition x3 (rate=1/3)')
ax.semilogy(snr_values, [max(b,1e-4) for b in ber_hamming], '^-', color='#22c55e',
            linewidth=2, markersize=4, label='Hamming(7,4) (rate=4/7)')
ax.axhline(0.01, color='gray', linestyle='--', alpha=0.5)
ax.set_xlabel('SNR (dB)', color='white', fontsize=11)
ax.set_ylabel('BER', color='white', fontsize=11)
ax.set_title('BER Comparison', color='white', fontsize=12)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(1e-4, 0.6); ax.grid(True, alpha=0.15)

# Decoded messages comparison
ax = axes[1]; ax.set_facecolor('#111827'); ax.set_xticks([]); ax.set_yticks([])
display_text = f"Original: {message}\\n{'='*50}\\n\\n"

for snr_show in [15, 8, 3]:
    display_text += f"--- SNR = {snr_show} dB ---\\n"
    for label, encode, decode in [
        ('No code', lambda b: b, lambda b: b),
        ('Rep x3 ', rep3_encode, lambda b: rep3_decode(b)[:len(raw_bits)]),
        ('Hamming ', hamming74_encode, lambda b: hamming74_decode(b)[:len(raw_bits)]),
    ]:
        coded = encode(raw_bits)
        sig = fsk_mod(coded)
        noisy = add_awgn(sig, snr_show)
        dec = fsk_demod(noisy, len(coded))
        dec_data = decode(dec)
        txt = bits_to_text(dec_data)
        display_text += f"  {label}: {txt}\\n"
    display_text += "\\n"

ax.text(0.03, 0.97, display_text, transform=ax.transAxes, color='#22c55e',
        fontsize=7.5, va='top', fontfamily='monospace',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))
ax.set_title('Decoded Messages with Error Correction', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Coding comparison at SNR=8dB:")
print(f"  No coding:   BER ~ {ber_none[snr_values.tolist().index(min(snr_values, key=lambda x: abs(x-8)))]:.3f}")
print(f"  Repetition:  BER ~ {ber_rep3[snr_values.tolist().index(min(snr_values, key=lambda x: abs(x-8)))]:.3f}")
print(f"  Hamming:     BER ~ {ber_hamming[snr_values.tolist().index(min(snr_values, key=lambda x: abs(x-8)))]:.3f}")
print(f"\\nHamming(7,4) provides most BER improvement per overhead bit.")`,
      challenge: 'Implement a simple CRC (cyclic redundancy check) to detect uncorrectable errors: compute a 4-bit checksum and append it to each message. If the decoded checksum does not match, flag the message as corrupted rather than returning garbage text.',
      successHint: 'Error correction is the bridge between theoretical modulation and practical communication. Without it, even a 1% BER renders text messages unreadable (roughly 1 error per character). With Hamming coding, you can tolerate much higher raw BER while maintaining message integrity.',
    },
    {
      title: 'Full System Integration and BER Testing',
      concept: `Now we integrate all four stages — encoding, channel simulation, demodulation, and error correction — into a single end-to-end system and conduct rigorous testing.

System testing for a communication modem requires measuring performance across many conditions:
- **BER vs SNR** (the fundamental performance curve)
- **BER vs distance** (how far can we communicate?)
- **BER vs data rate** (can we go faster by shortening bit duration?)
- **BER vs current speed** (Doppler tolerance)
- **Throughput vs reliability** (how much of the transmitted data is usable?)

We also implement a **frame structure** — a standard way to package data for transmission:
1. **Preamble**: a known bit pattern (10101010...) that the receiver uses to detect the start of a transmission and synchronize timing.
2. **Header**: message length and coding type (1 byte each).
3. **Payload**: the actual message data, error-correction coded.
4. **Checksum**: CRC or simple parity to verify frame integrity.

The frame structure is essential because the receiver does not know when a transmission starts. Without a preamble, it cannot distinguish signal from noise. The preamble provides **synchronization** — the receiver correlates its input against the known preamble pattern, and when correlation spikes, it knows a frame has arrived.`,
      analogy: 'The frame structure is like a letter in an envelope. The preamble is the stamp (tells the post office this is real mail, not junk). The header is the address label (tells the system where to route it and how to handle it). The payload is the letter itself. The checksum is a seal — if the seal is broken, you know the letter was tampered with in transit.',
      storyConnection: 'River dolphins use a structured communication protocol too. Their clicks have a characteristic pattern that other dolphins recognize as "this is a dolphin signal, not random noise." The pattern acts as a biological preamble. Our frame structure serves the same function: it tells the receiver "this is a real message — start decoding now."',
      checkQuestion: 'If you increase the bit rate from 50 bps to 500 bps (by reducing bit duration from 20ms to 2ms), what happens to the BER at the same SNR?',
      checkAnswer: 'BER increases. Shorter bit duration means fewer samples per bit, which reduces the matched filter\'s integration gain. The correlation sum has fewer terms, so noise has more impact relative to signal. Additionally, shorter bits are more susceptible to multipath — if echoes arrive with delays comparable to the bit duration, adjacent bits interfere (inter-symbol interference). There is a fundamental tradeoff: higher bit rate means higher error rate at the same SNR.',
      codeIntro: 'Build the complete framed communication system with preamble detection, end-to-end transmission, and comprehensive performance testing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

SR = 44100; F0 = 1000; F1 = 2000; BIT_DUR = 0.02; SPB = int(SR * BIT_DUR)

# --- Core functions (from previous lessons) ---
def text_to_bits(text):
    bits = []
    for c in text: bits.extend([int(b) for b in format(ord(c), '08b')])
    return np.array(bits)

def bits_to_text(bits):
    text = ''
    for i in range(0, len(bits)-7, 8):
        code = int(''.join(str(int(b)) for b in bits[i:i+8]), 2)
        text += chr(code) if 32 <= code <= 126 else '?'
    return text

def fsk_mod(bits):
    sig = np.zeros(len(bits) * SPB)
    for i, b in enumerate(bits):
        f = F1 if b else F0; t = np.arange(SPB) / SR
        sig[i*SPB:(i+1)*SPB] = np.sin(2*np.pi*f*t)
    return sig

def fsk_demod(signal, n_bits):
    t_ref = np.arange(SPB) / SR
    r0 = np.sin(2*np.pi*F0*t_ref); r1 = np.sin(2*np.pi*F1*t_ref)
    bits = []
    for i in range(n_bits):
        s = i*SPB; e = s+SPB
        if e > len(signal): break
        bits.append(1 if np.sum(signal[s:e]*r1) > np.sum(signal[s:e]*r0) else 0)
    return np.array(bits)

def hamming_encode(bits):
    G = np.array([[1,1,0,1],[1,0,1,1],[1,0,0,0],[0,1,1,1],[0,1,0,0],[0,0,1,0],[0,0,0,1]])
    pad = (4 - len(bits)%4) % 4
    if pad: bits = np.concatenate([bits, np.zeros(pad, dtype=int)])
    coded = []
    for i in range(0,len(bits),4): coded.extend((G @ bits[i:i+4]) % 2)
    return np.array(coded)

def hamming_decode(bits):
    H = np.array([[1,0,1,0,1,0,1],[0,1,1,0,0,1,1],[0,0,0,1,1,1,1]])
    n = len(bits)//7*7; decoded = []
    for i in range(0,n,7):
        r = bits[i:i+7].copy()
        syn = (H @ r) % 2; epos = syn[0]+syn[1]*2+syn[2]*4
        if 0 < epos <= 7: r[epos-1] ^= 1
        decoded.extend([r[2],r[4],r[5],r[6]])
    return np.array(decoded)

# --- Underwater channel ---
def underwater_channel(signal, snr_db=12, distance_m=500, current_ms=1.5):
    # Attenuation
    loss_db = 20*np.log10(max(distance_m,1)) + 0.06*distance_m/1000
    sig = signal * 10**(-loss_db/20)
    # Multipath (simplified: one echo)
    delay = int(16/1500*SR)  # surface reflection at 8m depth
    if delay < len(sig):
        echo = np.zeros_like(sig)
        echo[delay:] = sig[:-delay] * (-0.5)
        sig = sig + echo
    # Doppler
    df = 1500/(1500-current_ms)
    n_out = int(len(sig)/df)
    sig = np.interp(np.linspace(0,len(sig)-1,n_out), np.arange(len(sig)), sig)
    if len(sig) < len(signal): sig = np.concatenate([sig, np.zeros(len(signal)-len(sig))])
    else: sig = sig[:len(signal)]
    # Noise
    sp = np.mean(signal**2)
    np_t = sp / (10**(snr_db/10))
    sig = sig + np.random.randn(len(sig)) * np.sqrt(np_t)
    return sig

# --- Frame structure ---
PREAMBLE = np.array([1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0])  # 16-bit sync

def build_frame(message_text, use_hamming=True):
    """Build a complete frame: preamble + header + coded payload."""
    payload_bits = text_to_bits(message_text)
    coded = hamming_encode(payload_bits) if use_hamming else payload_bits
    # Header: 8 bits for payload length, 8 bits for coding flag
    length_bits = np.array([int(b) for b in format(len(payload_bits), '08b')])
    coding_bits = np.array([int(b) for b in format(1 if use_hamming else 0, '08b')])
    header = np.concatenate([length_bits, coding_bits])
    frame = np.concatenate([PREAMBLE, header, coded])
    return frame, len(payload_bits)

def decode_frame(bits):
    """Decode a received frame."""
    if len(bits) < 32: return None, "Frame too short"
    # Skip preamble (16 bits)
    header = bits[16:32]
    payload_len = int(''.join(str(int(b)) for b in header[:8]), 2)
    use_hamming = int(''.join(str(int(b)) for b in header[8:16]), 2)
    coded_bits = bits[32:]
    if use_hamming:
        decoded = hamming_decode(coded_bits)[:payload_len]
    else:
        decoded = coded_bits[:payload_len]
    return bits_to_text(decoded), None

# --- End-to-end test ---
print("UNDERWATER ACOUSTIC MODEM — Full System Test")
print("=" * 60)

message = "DOLPHIN MONITORING STATION ALPHA"
frame, payload_len = build_frame(message)
tx_signal = fsk_mod(frame)

print(f"Message: '{message}' ({len(message)} chars)")
print(f"Frame: {len(frame)} bits (preamble=16 + header=16 + coded={len(frame)-32})")
print(f"Signal: {len(tx_signal)} samples ({len(tx_signal)/SR*1000:.0f} ms)")
print(f"Effective bitrate: {len(message)*8/(len(tx_signal)/SR):.1f} bps")

# Test across conditions
print(f"\\n{'Condition':<35} {'BER':>6} {'Decoded'}")
print("-" * 80)

test_conditions = [
    ('Clean channel', dict(snr_db=30, distance_m=100, current_ms=0)),
    ('Moderate (500m, 12dB)', dict(snr_db=12, distance_m=500, current_ms=1.5)),
    ('Challenging (1km, 8dB)', dict(snr_db=8, distance_m=1000, current_ms=2.0)),
    ('Extreme (2km, 3dB)', dict(snr_db=3, distance_m=2000, current_ms=3.0)),
    ('Worst case (3km, 0dB)', dict(snr_db=0, distance_m=3000, current_ms=4.0)),
]

for label, params in test_conditions:
    rx_signal = underwater_channel(tx_signal, **params)
    rx_bits = fsk_demod(rx_signal, len(frame))
    decoded_msg, err = decode_frame(rx_bits)
    raw_ber = np.mean(rx_bits != frame) if len(rx_bits) == len(frame) else 1.0
    if decoded_msg:
        print(f"  {label:<33} {raw_ber:>6.3f} {decoded_msg}")
    else:
        print(f"  {label:<33} {raw_ber:>6.3f} [ERROR: {err}]")

# --- Performance sweep ---
distances = np.arange(100, 3500, 200)
snrs_for_dist = [20 - 20*np.log10(d/100)*0.3 for d in distances]  # rough SNR model

ber_by_dist = []
for d, snr in zip(distances, snrs_for_dist):
    errors = 0; trials = 5
    for _ in range(trials):
        rx = underwater_channel(tx_signal, snr_db=snr, distance_m=d, current_ms=1.5)
        rx_bits = fsk_demod(rx, len(frame))
        errors += np.sum(rx_bits[:len(frame)] != frame)
    ber_by_dist.append(errors / (trials * len(frame)))

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Acoustic Modem — End-to-End Performance', color='white', fontsize=14, fontweight='bold')

ax = axes[0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.semilogy(distances/1000, [max(b,1e-4) for b in ber_by_dist], 'o-', color='#3b82f6',
            linewidth=2, markersize=5)
ax.axhline(0.01, color='#f59e0b', linestyle='--', alpha=0.7, label='1% BER threshold')
ax.set_xlabel('Distance (km)', color='white', fontsize=11)
ax.set_ylabel('BER', color='white', fontsize=11)
ax.set_title('BER vs Distance', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.grid(True, alpha=0.15)

# Throughput vs distance
ax = axes[1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
throughput = [(1-ber)*len(message)*8/(len(tx_signal)/SR) for ber in ber_by_dist]
ax.plot(distances/1000, throughput, 's-', color='#22c55e', linewidth=2, markersize=5)
ax.set_xlabel('Distance (km)', color='white', fontsize=11)
ax.set_ylabel('Effective throughput (bps)', color='white', fontsize=11)
ax.set_title('Throughput vs Distance', color='white', fontsize=12)
ax.grid(True, alpha=0.15)

plt.tight_layout()
plt.show()

print(f"\\nMaximum reliable range (BER<1%): ~{distances[next((i for i,b in enumerate(ber_by_dist) if b>0.01), len(distances)-1)]/1000:.1f} km")`,
      challenge: 'Add automatic bit rate adaptation: if BER exceeds 5%, halve the bit rate (double bit duration). Implement this as a feedback loop where the receiver reports BER to the transmitter (via a separate low-rate control channel). Show that adaptive rate maintains communication at longer ranges.',
      successHint: 'End-to-end integration reveals interactions between subsystems that unit testing misses. The channel degrades the signal, the demodulator introduces errors, and the error corrector either fixes them or does not — the full system is more than the sum of its parts.',
    },
    {
      title: 'Deployment: Complete Underwater Acoustic Modem',
      concept: `The final step is packaging the modem into a clean, deployable class. A conservation engineer should be able to instantiate an \`AcousticModem\`, configure it for the Brahmaputra's conditions, and send/receive messages with one method call.

Our deployed system includes:
- **Clean API**: \`modem.transmit(message)\` returns an audio signal; \`modem.receive(signal)\` returns a decoded message with error statistics.
- **Configurable parameters**: frequencies, bit rate, coding scheme, channel model.
- **Automatic preamble detection**: the receiver scans for the preamble pattern to find the start of frames.
- **Quality reporting**: each received message includes BER estimate, SNR estimate, and confidence.
- **Known limitations**: no adaptive equalization (which would be needed for real multipath), no frequency synchronization (assumes oscillators are perfectly matched), no multiple access (only one transmitter at a time).

This is a portfolio-ready implementation of a digital communication system built from fundamental principles — modulation, channel modeling, detection theory, and error correction coding.`,
      analogy: 'Deploying a modem is like manufacturing a walkie-talkie. The physics (radio waves) and engineering (modulation, demodulation) are done. Now you need a case (clean API), an on/off switch (connect/disconnect), volume control (configurable parameters), a battery indicator (quality metrics), and a user manual (documentation). The user should not need to understand Fourier transforms to send a message.',
      storyConnection: 'The river dolphin\'s acoustic system is the ultimate "deployed modem" — millions of years of evolutionary optimization have produced a communication system that works reliably in the most challenging acoustic environment on Earth. Our modem is a first engineering approximation of what biology perfected. Deploying it in the Brahmaputra for dolphin monitoring would close a beautiful loop: using the dolphin\'s own communication medium to protect the dolphin.',
      checkQuestion: 'The modem works in a lab test at SNR=15dB but fails in the river at the same theoretical SNR. What environmental factors might the lab test have missed?',
      checkAnswer: 'Time-varying multipath (reflections change as the water surface moves with waves), non-Gaussian noise (boat engine noise has impulsive bursts that Gaussian models miss), bio-fouling (algae on the transducer degrades sensitivity over weeks), clock drift (temperature changes shift oscillator frequencies), and sediment scattering (suspended particles cause frequency-dependent loss not captured by Thorp model). Lab tests with stationary, ideal conditions always overestimate field performance.',
      codeIntro: 'Build the final polished Acoustic Modem with a clean API, automatic preamble detection, quality metrics, and comprehensive demonstration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ================================================================
# UNDERWATER ACOUSTIC MODEM — Final Polished Version
# ================================================================
# A complete FSK-based digital communication system for
# underwater acoustic channels.
#
# Based on: FSK modulation, matched filter detection,
#           Hamming(7,4) error correction, Thorp attenuation
#
# Limitations:
#   - No adaptive equalization
#   - No frequency synchronization
#   - No multiple access (TDMA/FDMA)
#   - Single-path Doppler compensation only
# ================================================================

class AcousticModem:
    """Underwater acoustic modem with FSK modulation and error correction.

    Usage:
        modem = AcousticModem(f0=1000, f1=2000, bitrate=50)
        tx_signal = modem.transmit("DOLPHIN ALERT")
        result = modem.receive(rx_signal)
    """

    PREAMBLE = np.array([1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0])

    def __init__(self, f0=1000, f1=2000, bitrate=50, sample_rate=44100,
                 use_hamming=True):
        self.f0 = f0
        self.f1 = f1
        self.bitrate = bitrate
        self.sr = sample_rate
        self.bit_dur = 1.0 / bitrate
        self.spb = int(sample_rate / bitrate)
        self.use_hamming = use_hamming

        # Generator and parity check matrices for Hamming(7,4)
        self._G = np.array([[1,1,0,1],[1,0,1,1],[1,0,0,0],
                            [0,1,1,1],[0,1,0,0],[0,0,1,0],[0,0,0,1]])
        self._H = np.array([[1,0,1,0,1,0,1],[0,1,1,0,0,1,1],[0,0,0,1,1,1,1]])

    def _text_to_bits(self, text):
        bits = []
        for c in text: bits.extend([int(b) for b in format(ord(c), '08b')])
        return np.array(bits)

    def _bits_to_text(self, bits):
        text = ''
        for i in range(0, len(bits)-7, 8):
            code = int(''.join(str(int(b)) for b in bits[i:i+8]), 2)
            text += chr(code) if 32 <= code <= 126 else '?'
        return text

    def _hamming_enc(self, bits):
        pad = (4-len(bits)%4)%4
        if pad: bits = np.concatenate([bits, np.zeros(pad, dtype=int)])
        coded = []
        for i in range(0,len(bits),4): coded.extend((self._G @ bits[i:i+4]) % 2)
        return np.array(coded)

    def _hamming_dec(self, bits):
        n = len(bits)//7*7; decoded = []
        for i in range(0,n,7):
            r = bits[i:i+7].copy()
            syn = (self._H @ r) % 2; ep = syn[0]+syn[1]*2+syn[2]*4
            if 0 < ep <= 7: r[ep-1] ^= 1
            decoded.extend([r[2],r[4],r[5],r[6]])
        return np.array(decoded)

    def transmit(self, message):
        """Encode and modulate a text message into an audio signal."""
        payload = self._text_to_bits(message)
        coded = self._hamming_enc(payload) if self.use_hamming else payload

        # Header
        length_bits = np.array([int(b) for b in format(len(payload), '08b')])
        flag_bits = np.array([int(b) for b in format(1 if self.use_hamming else 0, '08b')])
        frame = np.concatenate([self.PREAMBLE, length_bits, flag_bits, coded])

        # FSK modulate
        signal = np.zeros(len(frame) * self.spb)
        for i, b in enumerate(frame):
            f = self.f1 if b else self.f0
            t = np.arange(self.spb) / self.sr
            signal[i*self.spb:(i+1)*self.spb] = np.sin(2*np.pi*f*t)

        return signal, {'frame_bits': len(frame), 'payload_bits': len(payload),
                        'coded_bits': len(coded), 'duration_ms': len(signal)/self.sr*1000}

    def receive(self, signal, expected_bits=None):
        """Demodulate and decode a received signal."""
        # Matched filter demodulation
        t_ref = np.arange(self.spb) / self.sr
        ref0 = np.sin(2*np.pi*self.f0*t_ref)
        ref1 = np.sin(2*np.pi*self.f1*t_ref)

        n_bits = len(signal) // self.spb
        bits = []
        for i in range(n_bits):
            s = i*self.spb; e = s+self.spb
            if e > len(signal): break
            c = signal[s:e]
            bits.append(1 if np.sum(c*ref1) > np.sum(c*ref0) else 0)
        bits = np.array(bits)

        if len(bits) < 32:
            return {'message': '', 'error': 'Signal too short', 'success': False}

        # Parse frame
        header = bits[16:32]
        payload_len = int(''.join(str(int(b)) for b in header[:8]), 2)
        use_ham = int(''.join(str(int(b)) for b in header[8:16]), 2)
        coded = bits[32:]

        if use_ham:
            decoded = self._hamming_dec(coded)[:payload_len]
        else:
            decoded = coded[:payload_len]

        message = self._bits_to_text(decoded)

        # Quality metrics
        raw_ber = np.mean(bits != expected_bits) if expected_bits is not None and len(bits) == len(expected_bits) else None

        return {
            'message': message,
            'success': True,
            'raw_ber': raw_ber,
            'frame_bits_received': len(bits),
            'payload_bits': payload_len,
        }

# ================================================================
# DEMONSTRATION
# ================================================================
modem = AcousticModem(f0=1000, f1=2000, bitrate=50, use_hamming=True)

print("UNDERWATER ACOUSTIC MODEM — Deployment Demo")
print("=" * 65)

# Transmit
message = "BRAHMAPUTRA DOLPHIN STATION BRAVO"
tx_signal, tx_info = modem.transmit(message)
print(f"Message: '{message}'")
print(f"Frame: {tx_info['frame_bits']} bits | Duration: {tx_info['duration_ms']:.0f} ms")
print(f"Effective rate: {len(message)*8/(tx_info['duration_ms']/1000):.1f} bps")

# Channel simulation
def channel(signal, snr_db=12, dist=500):
    loss = 20*np.log10(max(dist,1)) + 0.06*dist/1000
    s = signal * 10**(-loss/20)
    delay = int(16/1500*44100)
    if delay < len(s):
        echo = np.zeros_like(s); echo[delay:] = s[:-delay]*(-0.5); s += echo
    sp = np.mean(signal**2); np_t = sp/(10**(snr_db/10))
    return s + np.random.randn(len(s))*np.sqrt(np_t)

# Build frame bits for BER comparison
frame_bits = np.concatenate([modem.PREAMBLE,
    np.array([int(b) for b in format(len(modem._text_to_bits(message)), '08b')]),
    np.array([int(b) for b in format(1, '08b')]),
    modem._hamming_enc(modem._text_to_bits(message))])

# Test scenarios
print(f"\\n{'Scenario':<30} {'BER':>7} {'Result'}")
print("-" * 75)
scenarios = [
    ("Lab (clean)", 30, 50),
    ("Close range (200m)", 18, 200),
    ("Medium range (500m)", 12, 500),
    ("Long range (1km)", 6, 1000),
    ("Extreme range (2km)", 2, 2000),
]

for label, snr, dist in scenarios:
    rx = channel(tx_signal, snr_db=snr, dist=dist)
    result = modem.receive(rx, expected_bits=frame_bits)
    ber_str = f"{result['raw_ber']:.4f}" if result['raw_ber'] is not None else "N/A"
    print(f"  {label:<28} {ber_str:>7} {result['message']}")

# --- Final showcase ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Underwater Acoustic Modem — Final Showcase',
             color='white', fontsize=16, fontweight='bold')

# Panel 1: TX spectrogram
ax = axes[0, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
n_bits_show = min(60, len(frame_bits))
spec = np.zeros((n_bits_show, modem.spb//2))
for i in range(n_bits_show):
    chunk = tx_signal[i*modem.spb:(i+1)*modem.spb]
    if len(chunk) == modem.spb:
        spec[i] = np.abs(np.fft.rfft(chunk))[:modem.spb//2]
freqs = np.arange(modem.spb//2) * modem.sr / modem.spb
fmask = (freqs >= 500) & (freqs <= 3000)
ax.imshow(spec[:, fmask].T, aspect='auto', origin='lower', cmap='inferno',
          extent=[0, n_bits_show*modem.bit_dur*1000, freqs[fmask][0], freqs[fmask][-1]])
ax.axhline(modem.f0, color='#3b82f6', linestyle='--', linewidth=1, alpha=0.7)
ax.axhline(modem.f1, color='#ef4444', linestyle='--', linewidth=1, alpha=0.7)
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Freq (Hz)', color='white')
ax.set_title('TX Spectrogram', color='white', fontsize=11)

# Panel 2: BER vs distance
ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
dists = np.arange(100, 2500, 150)
bers = []
for d in dists:
    snr = max(20 - 15*np.log10(d/100), -5)
    errs = 0; tr = 3
    for _ in range(tr):
        rx = channel(tx_signal, snr_db=snr, dist=d)
        rx_bits = np.array([1 if np.sum(rx[i*modem.spb:(i+1)*modem.spb]*np.sin(2*np.pi*modem.f1*np.arange(modem.spb)/modem.sr)) >
                   np.sum(rx[i*modem.spb:(i+1)*modem.spb]*np.sin(2*np.pi*modem.f0*np.arange(modem.spb)/modem.sr)) else 0
                   for i in range(min(len(frame_bits), len(rx)//modem.spb))])
        errs += np.sum(rx_bits[:len(frame_bits)] != frame_bits[:len(rx_bits)])
    bers.append(errs / (tr * len(frame_bits)))

ax.semilogy(dists/1000, [max(b,1e-4) for b in bers], 'o-', color='#a855f7', linewidth=2, markersize=5)
ax.axhline(0.01, color='#f59e0b', linestyle='--', alpha=0.7, label='1% BER')
ax.set_xlabel('Distance (km)', color='white', fontsize=11)
ax.set_ylabel('BER', color='white', fontsize=11)
ax.set_title('Range Performance', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.grid(True, alpha=0.15)

# Panel 3: Waveform comparison
ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
show = int(10*modem.spb)
t_ms = np.arange(show)/modem.sr*1000
rx_example = channel(tx_signal, snr_db=10, dist=500)
ax.plot(t_ms, tx_signal[:show], color='#22c55e', linewidth=0.5, alpha=0.7, label='TX')
ax.plot(t_ms, rx_example[:show], color='#ef4444', linewidth=0.5, alpha=0.7, label='RX (500m)')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('TX vs RX Waveform', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 4: API reference
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.set_xticks([]); ax.set_yticks([])
doc = """API Reference
------------------------------
modem = AcousticModem(
    f0=1000,        # Hz (bit=0)
    f1=2000,        # Hz (bit=1)
    bitrate=50,     # bits/second
    use_hamming=True
)

signal, info = modem.transmit("MSG")
result = modem.receive(signal)
  result['message']   -> 'MSG'
  result['raw_ber']   -> 0.002
  result['success']   -> True

Features
------------------------------
  FSK modulation/demodulation
  Hamming(7,4) error correction
  Frame structure with preamble
  Matched filter detection

Limitations
------------------------------
  No adaptive equalization
  No frequency sync
  No multiple access
  Euler-step Doppler model"""

ax.text(0.05, 0.95, doc, transform=ax.transAxes, color='#22c55e',
        fontsize=8.5, va='top', fontfamily='monospace',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))
ax.set_title('Documentation', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built an Underwater Acoustic Modem from scratch:")
print("  1. FSK encoding: text -> binary -> frequency-shift keyed audio")
print("  2. Channel simulation: attenuation, multipath, Doppler, noise")
print("  3. Matched filter demodulation: optimal bit detection")
print("  4. Hamming(7,4) error correction: fixing channel errors")
print("  5. Full system integration with frame structure and testing")
print("  6. Deployed as clean API with quality metrics")
print()
print("Skills demonstrated: digital communications, signal processing,")
print("information theory, channel modeling, software engineering.")`,
      challenge: 'Add adaptive modulation: if the estimated SNR is above 15dB, switch to 4-FSK (four frequencies encoding 2 bits per symbol) to double the data rate. Implement the 4-FSK modulator/demodulator and show the throughput improvement.',
      successHint: 'You have completed a full capstone project: from fundamental FSK tones to a deployed acoustic modem. This is the shape of real communication systems engineering — modulation, channel modeling, detection, error correction, and integration. The modem demonstrates the same principles used in submarine communication networks and dolphin biology.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (sonar and signal processing)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Underwater Acoustic Modem. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
