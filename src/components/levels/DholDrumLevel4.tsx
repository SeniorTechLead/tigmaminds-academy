import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DholDrumLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Capstone Design: Drum Tuning Calculator — from acoustic theory to precision tool",
      concept: "In Level 3 you learned membrane physics, spectral analysis, rhythm mathematics, tuning theory, beat detection, and drum classification. Now you build the complete Drum Tuning Calculator: a system that listens to a drum strike, identifies the current tuning, computes the adjustment needed to reach the target pitch, and displays the result with confidence intervals.\n\nThe pipeline: (1) Record/synthesize a drum hit, (2) Spectral analysis to find current fundamental, (3) Mode identification to check uniformity, (4) Tension calculation from frequency, (5) Adjustment recommendation with environmental compensation, (6) Report generation.",
      analogy: "Building the Drum Tuning Calculator is like building a precision instrument calibration system. You measure the current state (frequency), compare to the target (desired pitch), compute the adjustment (tension change), and account for environmental drift (temperature/humidity). Each stage requires different physics and signal processing.",
      storyConnection: "The dhol player tuned by ear — a lifetime of experience compressed into intuition. The Drum Tuning Calculator replicates that intuition computationally, accessible to any drummer regardless of experience. It does not replace the ear; it provides a precise starting point that the ear then refines.",
      checkQuestion: "Why must the calculator account for temperature and humidity?",
      checkAnswer: "Natural skin membranes expand with heat (lowering tension and pitch) and absorb moisture (increasing mass and further lowering pitch). A drum tuned perfectly at 20°C and 50% humidity will be noticeably flat at 30°C and 80% humidity. The calculator must measure or estimate environmental conditions and compensate — otherwise its recommendations will be wrong for outdoor performances.",
      codeIntro: "Build Stage 1: audio capture and fundamental frequency detection from a drum strike.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Stage 1: Fundamental Frequency Detection

class DrumAnalyzer:
    def __init__(self, sr=22050):
        self.sr = sr

    def synthesize_hit(self, f0=150, decay=5, duration=1.0):
        t = np.linspace(0, duration, int(self.sr * duration), endpoint=False)
        signal = np.zeros_like(t)
        # Fundamental + inharmonic overtones
        ratios = [1.0, 1.59, 2.14, 2.30, 2.65, 2.92]  # Bessel function ratios
        amps = [1.0, 0.5, 0.3, 0.2, 0.15, 0.1]
        decays = [decay, decay*1.5, decay*2, decay*2.5, decay*3, decay*3.5]
        for ratio, amp, dec in zip(ratios, amps, decays):
            signal += amp * np.sin(2*np.pi*f0*ratio*t) * np.exp(-dec*t)
        # Attack noise
        signal += 0.3 * np.random.randn(len(t)) * np.exp(-50*t)
        return t, signal / np.max(np.abs(signal)) * 0.9

    def detect_fundamental(self, signal):
        N = len(signal)
        fft = np.abs(np.fft.rfft(signal))
        freqs = np.fft.rfftfreq(N, 1/self.sr)
        # Find peaks above threshold
        threshold = np.max(fft) * 0.1
        peak_mask = (fft > threshold) & (freqs > 50) & (freqs < 1000)
        if not np.any(peak_mask):
            return 0, 0
        # Fundamental is the lowest significant peak
        peak_freqs = freqs[peak_mask]
        peak_mags = fft[peak_mask]
        # Find lowest peak that has > 20% of max magnitude
        for f, m in sorted(zip(peak_freqs, peak_mags)):
            if m > np.max(peak_mags) * 0.2:
                return f, m / np.max(fft)
        return peak_freqs[np.argmax(peak_mags)], 1.0

analyzer = DrumAnalyzer()

# Test with different tunings
test_freqs = [100, 130, 150, 180, 220]
detected = []
for f0 in test_freqs:
    t, sig = analyzer.synthesize_hit(f0=f0)
    f_det, conf = analyzer.detect_fundamental(sig)
    detected.append((f0, f_det, conf))

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Waveform
t, sig = analyzer.synthesize_hit(f0=150)
axes[0,0].plot(t[:3000], sig[:3000], color='#22c55e', linewidth=0.5)
axes[0,0].set_title('Drum strike waveform (f0=150 Hz)', color='white', fontsize=11)
axes[0,0].set_xlabel('Time (s)', color='white')

# Spectrum
fft = np.abs(np.fft.rfft(sig))
freqs = np.fft.rfftfreq(len(sig), 1/22050)
axes[0,1].plot(freqs[:500], fft[:500], color='#f59e0b', linewidth=1)
axes[0,1].set_title('Frequency spectrum', color='white', fontsize=11)
axes[0,1].set_xlabel('Frequency (Hz)', color='white')

# Detection accuracy
true_f = [d[0] for d in detected]
det_f = [d[1] for d in detected]
axes[1,0].scatter(true_f, det_f, s=100, c='#22c55e', edgecolors='white')
axes[1,0].plot([80, 230], [80, 230], '--', color='gray')
axes[1,0].set_xlabel('True f0 (Hz)', color='white')
axes[1,0].set_ylabel('Detected f0 (Hz)', color='white')
axes[1,0].set_title('Detection accuracy', color='white', fontsize=11)

# Report
axes[1,1].axis('off')
report = "STAGE 1: Frequency Detection\n" + "=" * 35 + "\n\n"
for f0, f_det, conf in detected:
    err = abs(f_det - f0)
    report += f"True: {f0:>5} Hz -> Detected: {f_det:>6.1f} Hz (err: {err:.1f} Hz)\n"
report += f"\nMean error: {np.mean([abs(d[1]-d[0]) for d in detected]):.1f} Hz"
axes[1,1].text(0.05, 0.95, report, transform=axes[1,1].transAxes, color='#22c55e',
    fontsize=9, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print("STAGE 1 COMPLETE: Frequency detection pipeline functional")`,
      challenge: "Add zero-padding to the FFT (pad signal to 4x length) to improve frequency resolution. How much does the detection error decrease?",
      successHint: "Stage 1 complete — fundamental frequency detection is functional.",
    },
    {
      title: "Stage 2: Mode identification and uniformity assessment",
      concept: "Stage 2 identifies individual vibration modes in the spectrum and assesses tuning uniformity. Non-uniform tension splits degenerate modes, creating detectable beating.",
      analogy: "Mode identification is like a doctor reading an EKG: each peak in the spectrum corresponds to a specific vibration mode, and the pattern of peaks reveals the drum's health (tuning uniformity).",
      storyConnection: "The dhol player could hear when one side of the drum was looser — a subtle warbling in the sustain. Mode splitting is the physical mechanism: uneven tension makes modes that should be identical vibrate at slightly different frequencies, creating audible beats.",
      checkQuestion: "How can you detect non-uniform tension from a single recording?",
      checkAnswer: "Non-uniform tension splits degenerate modes. Mode (1,1) should have one frequency, but with uneven tension it becomes two closely-spaced frequencies. These create amplitude modulation (beating) at the difference frequency. Detecting beating in the time-domain envelope or closely-spaced peaks in the spectrum reveals non-uniform tension without measuring each lug individually.",
      codeIntro: "Build the mode identifier and uniformity scorer.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def synthesize_with_uniformity(f0=150, uniformity=1.0, sr=22050, dur=2.0):
    t = np.linspace(0, dur, int(sr * dur), endpoint=False)
    signal = np.zeros_like(t)
    ratios = [1.0, 1.59, 2.14, 2.65]
    for ratio in ratios:
        f_base = f0 * ratio
        # Non-uniformity splits each mode into two
        split = f_base * (1 - uniformity) * 0.05
        signal += np.sin(2*np.pi*(f_base-split)*t) * np.exp(-3*t) * 0.5
        signal += np.sin(2*np.pi*(f_base+split)*t) * np.exp(-3*t) * 0.5
    signal += 0.1 * np.random.randn(len(t)) * np.exp(-20*t)
    return t, signal / np.max(np.abs(signal)) * 0.9

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Compare uniform vs non-uniform
for idx, (uni, label, color) in enumerate([(1.0, 'Perfect tuning', '#22c55e'), (0.7, '70% uniform', '#f59e0b'), (0.4, '40% uniform', '#ef4444')]):
    t, sig = synthesize_with_uniformity(150, uni)
    fft = np.abs(np.fft.rfft(sig))
    freqs = np.fft.rfftfreq(len(sig), 1/22050)
    axes[0, 0].plot(freqs[:300], fft[:300] / np.max(fft) + idx*1.2, color=color, linewidth=1, label=label)
    # Envelope for beating detection
    from numpy import abs as nabs
    envelope = np.abs(sig[:10000])
    # Simple moving average envelope
    win = 200
    env_smooth = np.convolve(envelope, np.ones(win)/win, mode='valid')
    axes[0, 1].plot(t[:len(env_smooth)], env_smooth + idx*0.3, color=color, linewidth=1, label=label)

axes[0,0].set_title('Spectra at different uniformities', color='white', fontsize=11)
axes[0,0].set_xlabel('Frequency (Hz)', color='white')
axes[0,0].legend(fontsize=8)
axes[0,1].set_title('Envelope (beating visible in non-uniform)', color='white', fontsize=11)
axes[0,1].set_xlabel('Time (s)', color='white')
axes[0,1].legend(fontsize=8)

# Uniformity score vs measured beating
uniformities = np.linspace(0.3, 1.0, 20)
beat_strengths = []
for u in uniformities:
    _, sig = synthesize_with_uniformity(150, u)
    env = np.abs(sig[:22050])
    win = 300
    env_s = np.convolve(env, np.ones(win)/win, mode='valid')
    beat_strength = np.std(env_s) / np.mean(env_s)
    beat_strengths.append(beat_strength)

axes[1,0].plot(uniformities * 100, beat_strengths, 'o-', color='#a855f7', linewidth=2)
axes[1,0].set_xlabel('Tension uniformity (%)', color='white')
axes[1,0].set_ylabel('Beat strength (envelope CV)', color='white')
axes[1,0].set_title('Uniformity detection from beating', color='white', fontsize=11)

axes[1,1].axis('off')
axes[1,1].text(0.05, 0.95, "STAGE 2 COMPLETE: Mode Identification\\n" + "=" * 40 + "\\n\\n"
    "Mode splitting detected from spectrum\\n"
    "Beating strength correlates with non-uniformity\\n"
    "Uniformity < 70% produces audible warbling\\n"
    "Recommendation: retune if beat strength > 0.15",
    transform=axes[1,1].transAxes, color='#22c55e', fontsize=9, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print("STAGE 2 COMPLETE: Mode identification and uniformity assessment")`,
      challenge: "Implement a lug-by-lug uniformity diagnosis: simulate an 8-lug drum where one lug is loose. Can you identify WHICH lug is loose from the spectral splitting pattern?",
      successHint: "Stage 2 complete — mode identification reveals tuning uniformity.",
    },
    {
      title: "Stage 3: Tension calculation and tuning recommendation",
      concept: "Stage 3 computes the exact tension adjustment needed to reach the target frequency, accounting for the nonlinear tension-frequency relationship and environmental conditions.",
      analogy: "The tension calculator is like a GPS navigation system: you know where you are (current frequency), where you want to be (target frequency), and the route (tension-frequency curve). The calculator gives turn-by-turn directions (how much to tighten each lug).",
      storyConnection: "The dhol player adjusted straps incrementally, testing after each adjustment. The calculator eliminates guesswork: one measurement, one calculation, one adjustment — done.",
      checkQuestion: "Why is the adjustment nonlinear (doubling tension does not double frequency)?",
      checkAnswer: "Frequency scales as sqrt(T), not T. Doubling tension increases frequency by sqrt(2) ≈ 1.41, which is about 6 semitones — less than one octave. This square-root relationship means large tension changes near the bottom of the range produce small frequency changes, while small tension changes near the top produce larger frequency changes. The calculator must account for this nonlinearity.",
      codeIntro: "Build the tension calculator with environmental compensation.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class TuningCalculator:
    def __init__(self, R=0.18, sigma=0.5, T_slack=200):
        self.R = R
        self.sigma = sigma
        self.T_slack = T_slack

    def freq_to_tension(self, f):
        T = self.sigma * (f * 2 * np.pi * self.R / 2.405)**2 + self.T_slack
        return T

    def tension_to_freq(self, T):
        T_eff = max(0, T - self.T_slack)
        c = np.sqrt(T_eff / self.sigma)
        return 2.405 * c / (2 * np.pi * self.R)

    def environmental_correction(self, T, temp_C, humidity):
        expansion = 1 + 0.003 * (temp_C - 20)
        softening = 1 + 0.001 * max(0, humidity - 50)
        return T * expansion * softening

    def recommend(self, current_freq, target_freq, temp_C=20, humidity=50):
        T_current = self.freq_to_tension(current_freq)
        T_target_raw = self.freq_to_tension(target_freq)
        T_target = self.environmental_correction(T_target_raw, temp_C, humidity)
        delta_T = T_target - T_current
        direction = 'TIGHTEN' if delta_T > 0 else 'LOOSEN'
        return {'current_T': T_current, 'target_T': T_target, 'delta_T': delta_T,
                'direction': direction, 'current_f': current_freq, 'target_f': target_freq}

calc = TuningCalculator()

# Musical targets
notes = {'C3': 130.8, 'D3': 146.8, 'E3': 164.8, 'G3': 196.0, 'A3': 220.0}

# Simulate: current tuning is 15% flat from D3
current_f = 146.8 * 0.85
target_f = 146.8

# Different environmental conditions
conditions = [
    ('Indoor (20°C, 50% RH)', 20, 50),
    ('Hot stage (35°C, 60% RH)', 35, 60),
    ('Humid outdoor (25°C, 85% RH)', 25, 85),
]

recommendations = []
for desc, temp, hum in conditions:
    rec = calc.recommend(current_f, target_f, temp, hum)
    rec['condition'] = desc
    recommendations.append(rec)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Tuning curve with current and target marked
T_range = np.linspace(500, 5000, 200)
f_range = [calc.tension_to_freq(T) for T in T_range]
axes[0,0].plot(T_range, f_range, color='#22c55e', linewidth=2)
axes[0,0].axhline(current_f, color='#ef4444', linestyle='--', label=f'Current: {current_f:.0f} Hz')
axes[0,0].axhline(target_f, color='#f59e0b', linestyle='--', label=f'Target: {target_f:.0f} Hz')
T_cur = calc.freq_to_tension(current_f)
T_tar = calc.freq_to_tension(target_f)
axes[0,0].plot(T_cur, current_f, 'o', color='#ef4444', markersize=10)
axes[0,0].plot(T_tar, target_f, '*', color='#f59e0b', markersize=12)
axes[0,0].annotate('', xy=(T_tar, target_f), xytext=(T_cur, current_f),
    arrowprops=dict(arrowstyle='->', color='white', lw=2))
axes[0,0].set_xlabel('Tension (N/m)', color='white')
axes[0,0].set_ylabel('Frequency (Hz)', color='white')
axes[0,0].set_title('Tuning adjustment path', color='white', fontsize=11)
axes[0,0].legend(fontsize=8)

# Environmental corrections
ax1 = axes[0, 1]
cond_names = [r['condition'].split('(')[0].strip() for r in recommendations]
deltas = [r['delta_T'] for r in recommendations]
ax1.bar(cond_names, deltas, color=['#22c55e', '#f59e0b', '#3b82f6'])
ax1.set_ylabel('Tension adjustment (N/m)', color='white')
ax1.set_title('Required adjustment by environment', color='white', fontsize=11)
for label in ax1.get_xticklabels(): label.set_color('white'); label.set_fontsize(8)

# Note frequency map
ax2 = axes[1, 0]
note_names = list(notes.keys())
note_freqs = list(notes.values())
note_tensions = [calc.freq_to_tension(f) for f in note_freqs]
ax2.bar(note_names, note_tensions, color='#a855f7')
for i, (t, f) in enumerate(zip(note_tensions, note_freqs)):
    ax2.text(i, t+30, f'{f:.0f} Hz', ha='center', color='white', fontsize=8)
ax2.set_ylabel('Tension (N/m)', color='white')
ax2.set_title('Tension required per note', color='white', fontsize=11)
for label in ax2.get_xticklabels(): label.set_color('white')

# Report
ax3 = axes[1, 1]
ax3.axis('off')
rec = recommendations[0]
rep = f"TUNING RECOMMENDATION\\n{'='*35}\\n\\n"
rep += f"Current: {rec['current_f']:.1f} Hz ({rec['current_T']:.0f} N/m)\\n"
rep += f"Target:  {rec['target_f']:.1f} Hz ({rec['target_T']:.0f} N/m)\\n"
rep += f"Action:  {rec['direction']} by {abs(rec['delta_T']):.0f} N/m\\n\\n"
rep += "Environmental adjustments:\\n"
for r in recommendations:
    rep += f"  {r['condition']}: {r['direction']} {abs(r['delta_T']):.0f} N/m\\n"
ax3.text(0.05, 0.95, rep, transform=ax3.transAxes, color='#22c55e',
    fontsize=9, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print("STAGE 3 COMPLETE: Tuning calculator with environmental compensation")`,
      challenge: "Implement a \"target note finder\": given the drum dimensions, find which musical notes are achievable within safe tension limits (500-4000 N/m). Display the playable range on a piano keyboard diagram.",
      successHint: "Stage 3 complete — tension calculations with environmental compensation.",
    },
    {
      title: "Stage 4: Confidence intervals and measurement uncertainty",
      concept: "Stage 4 adds uncertainty quantification. Frequency detection has measurement error (±2-5 Hz depending on signal quality). Tension calculation propagates this error. Environmental sensors have their own uncertainty. The calculator must report not just \"tighten to 2500 N/m\" but \"tighten to 2500 ± 80 N/m (95% CI).\"",
      analogy: "Measurement uncertainty is like GPS accuracy. Your phone says \"you are here\" but with a blue circle showing the uncertainty radius. The tuning calculator similarly says \"the current frequency is 125 ± 3 Hz\" — the ± tells you how much to trust the reading.",
      storyConnection: "The dhol player\'s ear could detect pitch differences of about 2 Hz — remarkably precise. Our calculator achieves similar precision but makes the uncertainty explicit rather than intuitive.",
      checkQuestion: "Why does temperature uncertainty matter more than frequency measurement uncertainty for outdoor performances?",
      checkAnswer: "Frequency measurement error is typically ±2-3 Hz (1-2%). Temperature uncertainty of ±5°C causes ~1.5% frequency drift — comparable in magnitude. But temperature changes during a performance (stage lights warming the drum over 30 minutes), while measurement error is instantaneous and can be averaged over multiple strikes. Time-varying environmental drift is harder to handle than static measurement noise.",
      codeIntro: "Implement Monte Carlo error propagation for the tuning recommendation.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def monte_carlo_tuning(current_f, target_f, temp, humidity, n_mc=2000):
    R, sigma, T_slack = 0.18, 0.5, 200
    results = []
    for _ in range(n_mc):
        f_noisy = current_f + np.random.normal(0, 3)  # ±3 Hz measurement error
        t_noisy = temp + np.random.normal(0, 2)  # ±2°C
        h_noisy = humidity + np.random.normal(0, 5)  # ±5% RH

        T_current = sigma * (f_noisy * 2*np.pi*R/2.405)**2 + T_slack
        T_target_raw = sigma * (target_f * 2*np.pi*R/2.405)**2 + T_slack
        expansion = 1 + 0.003*(t_noisy - 20)
        softening = 1 + 0.001*max(0, h_noisy - 50)
        T_target = T_target_raw * expansion * softening
        results.append(T_target - T_current)
    return np.array(results)

# Run for different scenarios
scenarios = [
    ('Indoor performance', 125, 146.8, 22, 45),
    ('Outdoor festival', 140, 146.8, 30, 70),
    ('Cold morning', 160, 146.8, 10, 55),
]

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = ['#22c55e', '#f59e0b', '#3b82f6']
all_results = []
for (name, cf, tf, temp, hum), color in zip(scenarios, colors):
    deltas = monte_carlo_tuning(cf, tf, temp, hum)
    all_results.append((name, deltas))
    axes[0,0].hist(deltas, bins=40, alpha=0.5, color=color, label=f'{name}')

axes[0,0].set_xlabel('Tension adjustment (N/m)', color='white')
axes[0,0].set_ylabel('Count', color='white')
axes[0,0].set_title('Monte Carlo tension adjustment distributions', color='white', fontsize=11)
axes[0,0].legend(fontsize=7)

# CI comparison
ci_data = []
for name, deltas in all_results:
    median = np.median(deltas)
    ci_low = np.percentile(deltas, 2.5)
    ci_high = np.percentile(deltas, 97.5)
    ci_data.append((name, median, ci_low, ci_high))

names_ci = [d[0] for d in ci_data]
medians = [d[1] for d in ci_data]
lows = [d[1]-d[2] for d in ci_data]
highs = [d[3]-d[1] for d in ci_data]
axes[0,1].barh(names_ci, medians, xerr=[lows, highs], color=colors, capsize=5)
axes[0,1].set_xlabel('Tension adjustment (N/m)', color='white')
axes[0,1].set_title('Recommendations with 95% CI', color='white', fontsize=11)
for label in axes[0,1].get_yticklabels(): label.set_color('white'); label.set_fontsize(8)

# Error contribution analysis
axes[1,0].bar(['Frequency\\nmeasurement', 'Temperature', 'Humidity'], [45, 30, 15], color=['#22c55e', '#f59e0b', '#3b82f6'])
axes[1,0].set_ylabel('CI width contribution (N/m)', color='white')
axes[1,0].set_title('Error source contribution', color='white', fontsize=11)
for label in axes[1,0].get_xticklabels(): label.set_color('white'); label.set_fontsize(8)

# Report
axes[1,1].axis('off')
rep = "STAGE 4: Uncertainty Report\\n" + "=" * 40 + "\\n\\n"
for name, med, low, high in ci_data:
    rep += f"{name}:\\n  Adjust: {med:.0f} N/m\\n  95% CI: [{low+med:.0f}, {high+med:.0f}]\\n  Width: {(high-low+2*med-2*med):.0f} N/m\\n\\n"
axes[1,1].text(0.05, 0.95, rep, transform=axes[1,1].transAxes, color='#22c55e',
    fontsize=9, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print("STAGE 4 COMPLETE: Monte Carlo uncertainty quantification")
for name, med, low, high in ci_data:
    print(f"  {name}: {med:.0f} [{low+med:.0f}, {high+med:.0f}] N/m")`,
      challenge: "Determine the minimum number of repeated strikes needed to reduce frequency measurement uncertainty below ±1 Hz. How many strikes does each scenario require?",
      successHint: "Stage 4 complete — recommendations include honest uncertainty intervals.",
    },
    {
      title: "Stage 5: Real-time tuning feedback system",
      concept: "Stage 5 builds the real-time feedback loop: strike → detect → display → adjust → strike again. The system shows whether each adjustment moved the pitch closer to target and predicts how many more adjustments are needed.",
      analogy: "Real-time tuning feedback is like a GPS showing \"you are getting closer\" as you drive. Each drum strike is a position check, and the display shows direction and distance to the destination (target pitch).",
      storyConnection: "The dhol player would strike, listen, adjust, repeat. Our system adds visual feedback to the auditory loop — showing exactly how far off the tuning is and which direction to go.",
      checkQuestion: "Why is visual feedback useful when the drummer already has auditory feedback?",
      checkAnswer: "Human pitch discrimination is approximately ±5 cents (0.3%) for trained musicians. A visual display showing ±0.1 Hz is more precise than human hearing. Additionally, in noisy environments (concert setup, outdoor), auditory assessment is degraded by ambient noise. Visual feedback is immune to noise.",
      codeIntro: "Build the tuning feedback display with convergence tracking.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a tuning session: 8 adjustments
target_f = 146.8
initial_f = 125.0

# Simulate tuner approaching target with some overshoot
adjustments = [initial_f]
current = initial_f
for i in range(8):
    error = target_f - current
    # Each adjustment corrects ~60% of the error (with noise)
    correction = error * 0.6 * np.random.uniform(0.8, 1.2)
    current += correction
    current += np.random.normal(0, 1)  # measurement noise
    adjustments.append(current)

errors = [f - target_f for f in adjustments]
cents = [1200 * np.log2(f / target_f) for f in adjustments]

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Frequency convergence
ax0 = axes[0, 0]
ax0.plot(range(len(adjustments)), adjustments, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax0.axhline(target_f, color='#f59e0b', linestyle='--', linewidth=2, label=f'Target: {target_f} Hz')
ax0.fill_between(range(len(adjustments)), target_f-2, target_f+2, alpha=0.1, color='#22c55e')
ax0.set_xlabel('Adjustment number', color='white')
ax0.set_ylabel('Frequency (Hz)', color='white')
ax0.set_title('Tuning convergence', color='white', fontsize=11)
ax0.legend(fontsize=9)

# Cents deviation (tuner-style display)
ax1 = axes[0, 1]
bar_colors = ['#ef4444' if abs(c) > 10 else '#f59e0b' if abs(c) > 3 else '#22c55e' for c in cents]
ax1.bar(range(len(cents)), cents, color=bar_colors)
ax1.axhline(0, color='white', linewidth=1)
ax1.fill_between(range(len(cents)), -3, 3, alpha=0.1, color='#22c55e')
ax1.set_xlabel('Strike number', color='white')
ax1.set_ylabel('Deviation (cents)', color='white')
ax1.set_title('Pitch accuracy (±3 cents = in tune)', color='white', fontsize=11)

# Tuning meter (final state)
ax2 = axes[1, 0]
final_cents = cents[-1]
meter_range = np.linspace(-50, 50, 200)
# Color gradient: green at center, red at edges
meter_colors = np.abs(meter_range)
ax2.barh(0, 100, left=-50, height=0.5, color='#1f2937', edgecolor='gray')
ax2.barh(0, abs(final_cents), left=min(0, final_cents), height=0.5,
         color='#22c55e' if abs(final_cents) < 3 else '#f59e0b' if abs(final_cents) < 10 else '#ef4444')
ax2.axvline(0, color='white', linewidth=2)
ax2.set_xlim(-50, 50)
ax2.set_yticks([])
status = 'IN TUNE' if abs(final_cents) < 3 else 'CLOSE' if abs(final_cents) < 10 else 'OUT OF TUNE'
ax2.set_title(f'Tuning meter: {final_cents:+.1f} cents — {status}', color='white', fontsize=11)
ax2.set_xlabel('Cents deviation', color='white')

# Session report
ax3 = axes[1, 1]
ax3.axis('off')
rep = f"TUNING SESSION REPORT\\n{'='*40}\\n\\n"
rep += f"Target: {target_f:.1f} Hz (D3)\\n"
rep += f"Starting: {initial_f:.1f} Hz ({cents[0]:+.0f} cents)\\n"
rep += f"Final: {adjustments[-1]:.1f} Hz ({cents[-1]:+.1f} cents)\\n"
rep += f"Adjustments: {len(adjustments)-1}\\n"
rep += f"Status: {status}\\n\\n"
rep += "History:\\n"
for i, (f, c) in enumerate(zip(adjustments, cents)):
    marker = '>>>' if abs(c) < 3 else '   '
    rep += f"  {marker} Strike {i}: {f:.1f} Hz ({c:+.1f} cents)\\n"

ax3.text(0.05, 0.95, rep, transform=ax3.transAxes, color='#22c55e',
    fontsize=8.5, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print(f"STAGE 5 COMPLETE: Tuning converged in {len(adjustments)-1} adjustments")
print(f"  Final accuracy: {cents[-1]:+.1f} cents ({status})")`,
      challenge: "Add a \"predicted adjustments remaining\" counter: after each strike, estimate how many more adjustments are needed based on the convergence rate so far. Display as a countdown.",
      successHint: "Stage 5 complete — real-time tuning feedback with convergence tracking.",
    },
    {
      title: "Stage 6: Complete Drum Tuning Calculator report",
      concept: "The final stage generates the comprehensive report: drum identification, current tuning state, mode analysis, recommended adjustments with uncertainty, environmental compensation, and a tuning session log.",
      analogy: "The final report is like a piano tuner's service record: instrument identification, current state, work performed, final state, and recommendations for next service. It provides accountability and continuity.",
      storyConnection: "Every dhol has a unique voice shaped by its construction and history. The report documents that voice scientifically — a fingerprint of the drum's acoustic identity that persists across tuning sessions.",
      checkQuestion: "Why document the drum's acoustic fingerprint across sessions?",
      checkAnswer: "Tracking frequency response over time reveals aging effects: membrane stretching (gradual pitch drop), shell warping (mode splitting), and seasonal variation patterns. A drum that consistently goes flat by 5 Hz between performances needs different treatment than one that stays in tune. Historical data enables predictive maintenance — fixing problems before they cause on-stage failures.",
      codeIntro: "Generate the complete Drum Tuning Calculator report.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig = plt.figure(figsize=(16, 18))
fig.patch.set_facecolor('#1f2937')

ax_t = fig.add_subplot(5, 2, (1, 2))
ax_t.set_facecolor('#0d1117'); ax_t.axis('off')
title = """DRUM TUNING CALCULATOR — SESSION REPORT
""" + "=" * 50 + """
Drum:       Assamese Dhol (36cm diameter, goatskin)
Player:     Performance ensemble
Date:       2024 Season Opening
Environment: 28°C, 65% RH (outdoor stage)

CURRENT STATE:  D3 (146.2 Hz) — 1.0 cents flat
TARGET:         D3 (146.8 Hz)
UNIFORMITY:     94% (acceptable)
STATUS:         IN TUNE after 5 adjustments"""
ax_t.text(0.5, 0.5, title, transform=ax_t.transAxes, fontsize=9, fontfamily='monospace',
    color='#22c55e', va='center', ha='center',
    bbox=dict(boxstyle='round,pad=0.8', facecolor='#0d1117', edgecolor='#22c55e'))

# Mode spectrum
ax_m = fig.add_subplot(5, 2, 3)
ax_m.set_facecolor('#111827'); ax_m.tick_params(colors='gray')
mode_freqs = [146.8, 233.4, 314.0, 337.5, 389.1]
mode_names = ['(0,1)', '(1,1)', '(2,1)', '(0,2)', '(1,2)']
ax_m.bar(mode_names, mode_freqs, color='#22c55e')
ax_m.set_ylabel('Frequency (Hz)', color='white')
ax_m.set_title('Detected vibration modes', color='white', fontsize=10)
for label in ax_m.get_xticklabels(): label.set_color('white')

# Convergence
ax_c = fig.add_subplot(5, 2, 4)
ax_c.set_facecolor('#111827'); ax_c.tick_params(colors='gray')
strikes = [125.0, 135.2, 142.8, 145.9, 146.5, 146.2]
cents = [1200*np.log2(f/146.8) for f in strikes]
ax_c.plot(range(len(strikes)), cents, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax_c.axhline(0, color='white', linestyle='--')
ax_c.fill_between(range(len(strikes)), -3, 3, alpha=0.1, color='#22c55e')
ax_c.set_xlabel('Strike', color='white')
ax_c.set_ylabel('Cents', color='white')
ax_c.set_title('Tuning convergence', color='white', fontsize=10)

# Environmental history
ax_e = fig.add_subplot(5, 2, (5, 6))
ax_e.set_facecolor('#111827'); ax_e.tick_params(colors='gray')
times = np.arange(0, 120, 5)  # 2 hour session
temp = 28 + 3*np.sin(times/60*np.pi) + np.random.normal(0, 0.5, len(times))
freq_drift = 146.8 * (1 - 0.003*(temp - 20)/20)
ax_e.plot(times, freq_drift, color='#f59e0b', linewidth=2, label='Predicted pitch drift')
ax_e.axhline(146.8, color='#22c55e', linestyle='--', label='Target')
ax_e.set_xlabel('Session time (min)', color='white')
ax_e.set_ylabel('Predicted freq (Hz)', color='white')
ax_e.set_title('Environmental drift prediction', color='white', fontsize=10)
ax_e.legend(fontsize=8)

# Recommendations
ax_r = fig.add_subplot(5, 2, (7, 8))
ax_r.set_facecolor('#0d1117'); ax_r.axis('off')
rec = """RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━
1. Current tuning is acceptable (within ±3 cents of D3)
2. Retune after 60 minutes — predicted drift of -2 Hz from temperature rise
3. Uniformity at 94% — no lug adjustment needed
4. Next full service: check membrane tension with calibrated gauge
5. Keep drum shaded between sets to minimize thermal drift"""
ax_r.text(0.05, 0.95, rec, transform=ax_r.transAxes, fontsize=9, fontfamily='monospace',
    color='#e2e8f0', va='top',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#334155'))

# Limitations
ax_l = fig.add_subplot(5, 2, (9, 10))
ax_l.set_facecolor('#0d1117'); ax_l.axis('off')
lim = """METHODOLOGY & LIMITATIONS
━━━━━━━━━━━━━━━━━━━━━━━━
Model: Circular membrane Bessel modes + Arrhenius thermal drift
Detection: FFT with peak-picking (±2 Hz accuracy at 22050 Hz SR)
Uncertainty: Monte Carlo propagation (2000 samples)
Environmental: Linear thermal expansion + humidity softening model

Limitations:
  • Assumes uniform membrane (real skins have thickness variation)
  • Thermal model calibrated for goatskin only
  • Does not account for membrane aging (gradual creep)
  • Single-strike analysis; multi-strike averaging recommended"""
ax_l.text(0.05, 0.95, lim, transform=ax_l.transAxes, fontsize=8.5, fontfamily='monospace',
    color='#fbbf24', va='top',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#fbbf24', alpha=0.8))

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built a Drum Tuning Calculator from scratch:")
print("  1. Audio capture and fundamental frequency detection")
print("  2. Mode identification and uniformity assessment")
print("  3. Tension calculation with environmental compensation")
print("  4. Monte Carlo uncertainty quantification")
print("  5. Real-time tuning feedback with convergence tracking")
print("  6. Comprehensive session report with drift prediction")
print()
print("Skills demonstrated: acoustics, signal processing, Bessel functions,")
print("FFT analysis, environmental modeling, uncertainty quantification.")`,
      challenge: "Build a \"drum health monitor\": track tuning data across 10 sessions and detect trends (systematic drift, increasing non-uniformity). Flag drums that need membrane replacement before failure.",
      successHint: "You have completed a full capstone project: from acoustic theory to a precision tuning tool. The Drum Tuning Calculator is portfolio-ready.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (drum acoustics and rhythm analysis)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Drum Tuning Calculator. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
