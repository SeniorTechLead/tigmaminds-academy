import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NightJasmineLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone: Circadian Rhythm Analyzer — modeling gene expression oscillations',
      concept: `Your capstone project is to build a **Circadian Rhythm Analyzer** that detects, characterizes, and models 24-hour oscillations in gene expression data.

This is a **time-series analysis problem** with unique challenges:
- The signal is periodic (approximately 24 hours)
- Sampling is sparse (typically every 2-4 hours)
- Noise levels can be high (biological variability)
- Not all genes are rhythmic — you must distinguish real oscillations from noise

The analysis pipeline:
1. **Data generation**: simulate a realistic transcriptomic time-series with known ground truth
2. **Periodicity detection**: use Fourier analysis and statistical tests to identify rhythmic genes
3. **Parameter estimation**: for each rhythmic gene, estimate phase, amplitude, and period
4. **Clustering**: group genes by phase to identify co-regulated gene modules
5. **Visualization**: create publication-quality circadian plots (circular phase plots, heatmaps)

Real circadian data from Arabidopsis, Drosophila, and mouse studies have revealed that 10-50% of all genes are clock-controlled. Your analyzer must handle this mix of rhythmic and non-rhythmic genes.`,
      analogy: 'Building a circadian analyzer is like developing software that detects patterns in radio signals. Some signals (genes) are broadcasting clear sinusoidal waves (strongly rhythmic). Others are mostly static (non-rhythmic). Your analyzer must separate the signal from the noise, measure the frequency and phase of each broadcast, and group stations (genes) that broadcast on the same schedule.',
      storyConnection: 'The night jasmine opens its flowers with clockwork precision, but the molecular clock driving this is invisible. A circadian rhythm analyzer makes the invisible visible — it takes raw gene expression measurements and reveals the hidden oscillatory pattern that coordinates scent production, petal opening, and nectar secretion across thousands of genes.',
      checkQuestion: 'You sample gene expression every 4 hours for 48 hours (12 time points). Can you reliably detect a 24-hour period? What about a 12-hour period?',
      checkAnswer: 'The Nyquist theorem requires at least 2 samples per cycle. For a 24h period, you need samples at least every 12h — your 4h sampling easily satisfies this. For a 12h period (ultradian rhythm), you need samples every 6h — your 4h sampling barely satisfies this. For an 8h period, you need 4h sampling at minimum. In practice, you want 6-8 samples per cycle for reliable detection, so 4h sampling is robust for 24h rhythms but marginal for 12h rhythms.',
      codeIntro: 'Generate a synthetic circadian transcriptomic dataset with known ground truth parameters for 500 genes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate realistic circadian gene expression dataset
n_genes = 500
n_timepoints = 24  # every 2h for 48h
time_hours = np.linspace(0, 46, n_timepoints)

# Ground truth: 60% rhythmic, 40% non-rhythmic
n_rhythmic = int(0.6 * n_genes)
n_nonrhythmic = n_genes - n_rhythmic

# Rhythmic genes
true_phases = np.random.uniform(0, 24, n_rhythmic)
true_amplitudes = np.random.exponential(1.5, n_rhythmic) + 0.5
true_baselines = np.random.exponential(50, n_rhythmic) + 20
true_periods = np.random.normal(24, 0.5, n_rhythmic)  # near 24h

# Non-rhythmic genes
nr_baselines = np.random.exponential(50, n_nonrhythmic) + 20

# Build expression matrix
expression = np.zeros((n_genes, n_timepoints))
is_rhythmic = np.zeros(n_genes, dtype=bool)

for i in range(n_rhythmic):
    signal = true_baselines[i] * (1 + true_amplitudes[i] *
             np.cos(2 * np.pi * (time_hours - true_phases[i]) / true_periods[i]))
    noise = np.random.normal(0, true_baselines[i] * 0.15, n_timepoints)
    expression[i] = np.clip(signal + noise, 1, None)
    is_rhythmic[i] = True

for i in range(n_nonrhythmic):
    expression[n_rhythmic + i] = nr_baselines[i] + \
        np.random.normal(0, nr_baselines[i] * 0.2, n_timepoints)
    expression[n_rhythmic + i] = np.clip(expression[n_rhythmic + i], 1, None)

# Shuffle so rhythmic/non-rhythmic are interleaved
shuffle_idx = np.random.permutation(n_genes)
expression = expression[shuffle_idx]
is_rhythmic = is_rhythmic[shuffle_idx]

# Recover true parameters for shuffled rhythmic genes
gene_params = {}
orig_idx = 0
for new_i in range(n_genes):
    old_i = shuffle_idx[new_i]
    if old_i < n_rhythmic:
        gene_params[new_i] = {
            'phase': true_phases[old_i],
            'amplitude': true_amplitudes[old_i],
            'baseline': true_baselines[old_i],
            'period': true_periods[old_i],
        }

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Raw expression heatmap (unsorted)
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Log-transform for visualization
log_expr = np.log2(expression + 1)
ax.imshow(log_expr, aspect='auto', cmap='viridis',
          extent=[0, 48, n_genes, 0])
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Gene index', color='white')
ax.set_title(f'Raw expression ({n_genes} genes, unsorted)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Example traces
ax = axes[0, 1]
ax.set_facecolor('#111827')
# Show 3 rhythmic and 2 non-rhythmic
rhyt_idx = np.where(is_rhythmic)[0][:3]
nonr_idx = np.where(~is_rhythmic)[0][:2]
for idx in rhyt_idx:
    norm = (expression[idx] - expression[idx].min()) / (expression[idx].max() - expression[idx].min())
    ax.plot(time_hours, norm, 'o-', linewidth=1.5, markersize=3, alpha=0.8,
            label=f'Gene {idx} (rhythmic)')
for idx in nonr_idx:
    norm = (expression[idx] - expression[idx].min()) / (expression[idx].max() - expression[idx].min() + 1e-10)
    ax.plot(time_hours, norm, 'o--', linewidth=1, markersize=3, alpha=0.6,
            label=f'Gene {idx} (noise)')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Expression (normalized)', color='white')
ax.set_title('Example gene traces', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Expression distribution
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.hist(np.mean(expression, axis=1), bins=40, color='#3b82f6', edgecolor='none', alpha=0.7)
ax.set_xlabel('Mean expression level', color='white')
ax.set_ylabel('Gene count', color='white')
ax.set_title('Expression level distribution', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Variance distribution: rhythmic genes should have higher variance
ax = axes[1, 1]
ax.set_facecolor('#111827')
cv = np.std(expression, axis=1) / (np.mean(expression, axis=1) + 1e-10)
ax.hist(cv[is_rhythmic], bins=30, color='#22c55e', alpha=0.6, label=f'Rhythmic ({sum(is_rhythmic)})')
ax.hist(cv[~is_rhythmic], bins=30, color='#ef4444', alpha=0.6, label=f'Non-rhythmic ({sum(~is_rhythmic)})')
ax.set_xlabel('Coefficient of variation', color='white')
ax.set_ylabel('Gene count', color='white')
ax.set_title('CV separates rhythmic from noisy genes', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("DATASET SUMMARY")
print(f"Total genes: {n_genes}")
print(f"Rhythmic (ground truth): {sum(is_rhythmic)} ({sum(is_rhythmic)/n_genes:.0%})")
print(f"Non-rhythmic: {sum(~is_rhythmic)} ({sum(~is_rhythmic)/n_genes:.0%})")
print(f"Time points: {n_timepoints} ({time_hours[1]-time_hours[0]:.0f}h intervals)")
print(f"Duration: {time_hours[-1]:.0f} hours (2 complete cycles)")
print()
print("Rhythmic genes have higher coefficient of variation (CV)")
print("because oscillation increases temporal variability.")
print("But CV alone is insufficient — noisy non-rhythmic genes also have high CV.")`,
      challenge: 'Add 20 genes with ultradian rhythms (12h period). Can your eye distinguish them in the heatmap? This sets up the need for computational detection methods.',
      successHint: 'Generating data with known ground truth is the most important step in building any analysis tool. It lets you measure exactly how well your algorithm performs — you know the right answer before you start.',
    },
    {
      title: 'Fourier-based periodicity detection — finding the 24-hour signal',
      concept: `The Discrete Fourier Transform (DFT) decomposes a time series into a sum of sinusoids at different frequencies. For circadian data, you are looking for power at the frequency f = 1/24 hours.

The algorithm:
1. For each gene, compute the DFT of the expression time series
2. Calculate the **power spectrum**: |FFT|^2 at each frequency
3. Find the power at the circadian frequency (~1/24h)
4. Compare circadian power to total power (or to background noise)
5. Apply a statistical threshold to classify genes as rhythmic or non-rhythmic

**Fisher's g-test** provides a formal statistical test:
- g = (max spectral power) / (sum of all spectral powers)
- Under the null hypothesis (no periodicity), g follows a known distribution
- If g exceeds the critical value, the gene is significantly periodic

Practical considerations:
- The DFT resolution depends on the total sampling duration. With 48h of data, you can resolve periods of 48h, 24h, 16h, 12h, etc. (harmonics of 48h)
- Zero-padding can improve frequency resolution but does not add information
- Windowing (Hann, Hamming) reduces spectral leakage from non-periodic components`,
      analogy: 'Fourier analysis is like a prism separating white light into a rainbow. White light contains all colors mixed together — you cannot see them individually. The prism separates them by wavelength. Similarly, a gene expression time series contains multiple oscillatory components mixed together. The Fourier transform separates them by frequency, revealing which frequency components are present and how strong each is.',
      storyConnection: 'The night jasmine runs on a ~24-hour cycle, but measuring this requires separating the 24-hour signal from noise, trends, and other periodic components (12-hour, 48-hour). Fourier analysis extracts the 24-hour component like a radio tuner isolating one station from the cacophony of all radio signals in the air.',
      checkQuestion: 'A gene shows strong power at both 24h and 12h in the Fourier spectrum. Is it running on two different clocks?',
      checkAnswer: 'Not necessarily. A sharp on/off expression pattern (square wave) contains harmonics — a strong 24h component PLUS a 12h component (the second harmonic) plus higher harmonics. This is Fourier theory: non-sinusoidal periodic signals decompose into the fundamental frequency plus integer multiples. Look at the raw waveform: if it has a sharp peak-and-trough shape (rather than a smooth sinusoid), the 12h component is just a harmonic, not a separate biological rhythm.',
      codeIntro: 'Implement Fourier-based periodicity detection with Fisher\'s g-test and build a full rhythmicity classifier.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate dataset
n_genes = 500
n_tp = 24
time_h = np.linspace(0, 46, n_tp)
n_rhythmic = 300

true_phases = np.random.uniform(0, 24, n_rhythmic)
true_amps = np.random.exponential(1.5, n_rhythmic) + 0.5
true_base = np.random.exponential(50, n_rhythmic) + 20

expr = np.zeros((n_genes, n_tp))
is_rhyth = np.zeros(n_genes, dtype=bool)

for i in range(n_rhythmic):
    expr[i] = true_base[i] * (1 + true_amps[i] * np.cos(2*np.pi*(time_h - true_phases[i])/24))
    expr[i] += np.random.normal(0, true_base[i]*0.15, n_tp)
    expr[i] = np.clip(expr[i], 1, None)
    is_rhyth[i] = True

for i in range(n_rhythmic, n_genes):
    base = np.random.exponential(50) + 20
    expr[i] = base + np.random.normal(0, base*0.2, n_tp)
    expr[i] = np.clip(expr[i], 1, None)

# Fourier periodicity detection
def detect_circadian(expression, time_hours):
    n_genes, n_tp = expression.shape
    results = []

    for i in range(n_genes):
        # Detrend and normalize
        signal = expression[i] - np.mean(expression[i])
        signal = signal / (np.std(signal) + 1e-10)

        # FFT
        fft_vals = np.fft.rfft(signal)
        freqs = np.fft.rfftfreq(n_tp, d=(time_hours[1] - time_hours[0]))
        power = np.abs(fft_vals[1:])**2  # exclude DC
        freqs_no_dc = freqs[1:]

        # Find circadian frequency (~1/24h)
        target_freq = 1.0 / 24.0
        circ_idx = np.argmin(np.abs(freqs_no_dc - target_freq))
        circ_power = power[circ_idx]

        # Fisher's g-test: max_power / sum(all_powers)
        g_stat = circ_power / (np.sum(power) + 1e-10)

        # Critical value approximation for Fisher's g
        m = len(power)
        g_critical = 1 - (0.05 / m) ** (1 / (m - 1))  # approximate alpha=0.05

        # Phase estimation
        phase = -np.angle(fft_vals[circ_idx + 1]) * 24 / (2 * np.pi) % 24

        # Amplitude estimation (peak-to-trough / mean)
        amplitude = 2 * np.abs(fft_vals[circ_idx + 1]) / n_tp / (np.mean(expression[i]) + 1e-10)

        results.append({
            'g_stat': g_stat,
            'g_critical': g_critical,
            'is_significant': g_stat > g_critical,
            'phase': phase,
            'amplitude': amplitude,
            'circ_power': circ_power,
            'total_power': np.sum(power),
        })

    return results

results = detect_circadian(expr, time_h)

# Classification performance
predicted_rhythmic = np.array([r['is_significant'] for r in results])
TP = np.sum(predicted_rhythmic & is_rhyth)
FP = np.sum(predicted_rhythmic & ~is_rhyth)
FN = np.sum(~predicted_rhythmic & is_rhyth)
TN = np.sum(~predicted_rhythmic & ~is_rhyth)

precision = TP / (TP + FP) if (TP + FP) > 0 else 0
recall = TP / (TP + FN) if (TP + FN) > 0 else 0
f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# G-statistic distribution
ax = axes[0, 0]
ax.set_facecolor('#111827')
g_vals = [r['g_stat'] for r in results]
ax.hist([g for g, r in zip(g_vals, is_rhyth) if r], bins=30, color='#22c55e', alpha=0.6, label='Rhythmic')
ax.hist([g for g, r in zip(g_vals, is_rhyth) if not r], bins=30, color='#ef4444', alpha=0.6, label='Non-rhythmic')
ax.axvline(results[0]['g_critical'], color='#f59e0b', linestyle='--', linewidth=2, label='Threshold')
ax.set_xlabel("Fisher's g statistic", color='white')
ax.set_ylabel('Gene count', color='white')
ax.set_title('Periodicity detection: g-statistic', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# ROC-like curve (varying threshold)
ax = axes[0, 1]
ax.set_facecolor('#111827')
thresholds = np.linspace(0, 0.8, 100)
tprs, fprs = [], []
for thresh in thresholds:
    pred = np.array(g_vals) > thresh
    tpr = np.sum(pred & is_rhyth) / max(np.sum(is_rhyth), 1)
    fpr = np.sum(pred & ~is_rhyth) / max(np.sum(~is_rhyth), 1)
    tprs.append(tpr)
    fprs.append(fpr)

ax.plot(fprs, tprs, color='#a855f7', linewidth=2)
ax.plot([0, 1], [0, 1], '--', color='gray', linewidth=1)
ax.scatter([FP/(FP+TN)], [TP/(TP+FN)], c='#ef4444', s=100, zorder=5, label=f'Chosen threshold')
ax.set_xlabel('False Positive Rate', color='white')
ax.set_ylabel('True Positive Rate', color='white')
ax.set_title('ROC curve for rhythmicity detection', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Confusion matrix
ax = axes[0, 2]
ax.set_facecolor('#111827')
cm = np.array([[TN, FP], [FN, TP]])
im = ax.imshow(cm, cmap='Blues')
ax.set_xticks([0, 1])
ax.set_yticks([0, 1])
ax.set_xticklabels(['Pred: Non-R', 'Pred: Rhythmic'], color='white', fontsize=9)
ax.set_yticklabels(['True: Non-R', 'True: Rhythmic'], color='white', fontsize=9)
for i in range(2):
    for j in range(2):
        ax.text(j, i, str(cm[i, j]), ha='center', va='center', fontsize=16,
                color='white' if cm[i, j] < cm.max()/2 else 'black', fontweight='bold')
ax.set_title(f'Confusion matrix (F1={f1:.3f})', color='white', fontsize=11)

# Phase recovery: estimated vs true
ax = axes[1, 0]
ax.set_facecolor('#111827')
est_phases = [results[i]['phase'] for i in range(n_genes) if is_rhyth[i] and predicted_rhythmic[i]]
true_ph = []
idx = 0
for i in range(n_genes):
    if i < n_rhythmic and is_rhyth[i] and predicted_rhythmic[i]:
        # Find original index
        true_ph.append(true_phases[i] if i < n_rhythmic else 0)
if len(est_phases) > 0 and len(true_ph) > 0:
    min_len = min(len(est_phases), len(true_ph))
    ax.scatter(true_ph[:min_len], est_phases[:min_len], c='#22c55e', s=10, alpha=0.5)
    ax.plot([0, 24], [0, 24], '--', color='#ef4444', linewidth=2)
ax.set_xlabel('True phase (hours)', color='white')
ax.set_ylabel('Estimated phase (hours)', color='white')
ax.set_title('Phase recovery accuracy', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Power spectrum example
ax = axes[1, 1]
ax.set_facecolor('#111827')
ex_rhyth = np.where(is_rhyth)[0][0]
ex_noise = np.where(~is_rhyth)[0][0]
for idx, label, color in [(ex_rhyth, 'Rhythmic gene', '#22c55e'), (ex_noise, 'Non-rhythmic gene', '#ef4444')]:
    sig = expr[idx] - np.mean(expr[idx])
    fft_v = np.fft.rfft(sig)
    freqs = np.fft.rfftfreq(n_tp, d=(time_h[1]-time_h[0]))
    power = np.abs(fft_v[1:])**2
    periods = 1.0 / (freqs[1:] + 1e-10)
    valid = periods < 60
    ax.plot(periods[valid], power[valid], 'o-', color=color, linewidth=1.5, label=label)

ax.axvline(24, color='#f59e0b', linestyle='--', alpha=0.5, label='24h')
ax.set_xlabel('Period (hours)', color='white')
ax.set_ylabel('Spectral power', color='white')
ax.set_title('Power spectrum comparison', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Summary statistics
ax = axes[1, 2]
ax.set_facecolor('#111827')
metrics = ['Precision', 'Recall', 'F1 Score', 'Accuracy']
values = [precision, recall, f1, (TP+TN)/n_genes]
colors = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b']
bars = ax.bar(metrics, values, color=colors, edgecolor='none')
ax.set_ylim(0, 1.1)
ax.set_ylabel('Score', color='white')
ax.set_title('Detection performance', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
            f'{val:.3f}', ha='center', color='white', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.show()

print("RHYTHMICITY DETECTION RESULTS")
print(f"True rhythmic: {sum(is_rhyth)}, Non-rhythmic: {sum(~is_rhyth)}")
print(f"Detected rhythmic: {sum(predicted_rhythmic)}")
print(f"TP={TP}, FP={FP}, FN={FN}, TN={TN}")
print(f"Precision: {precision:.3f} (of detected rhythmic, how many truly are)")
print(f"Recall: {recall:.3f} (of truly rhythmic, how many detected)")
print(f"F1: {f1:.3f}")`,
      challenge: 'Try adding zero-padding to the FFT (pad to 2x or 4x the signal length before computing FFT). Does it improve frequency resolution? Does it change detection accuracy?',
      successHint: 'Fourier analysis is the workhorse of rhythmicity detection. Every major circadian study uses some variant of spectral analysis. The key insight is that periodicity is a property of the frequency domain, not the time domain.',
    },
    {
      title: 'Cosinor regression — fitting circadian parameters precisely',
      concept: `Fourier analysis tells you IF a gene is rhythmic. **Cosinor regression** tells you the precise parameters of the oscillation: phase, amplitude, and baseline (mesor).

The cosinor model fits the equation:

y(t) = M + A * cos(2*pi*t/T - phi) + noise

where:
- **M** (mesor) = the time-series mean
- **A** (amplitude) = half the peak-to-trough difference
- **phi** (acrophase) = the time of the peak
- **T** (period) = fixed at 24h for circadian analysis

This can be linearized using the trigonometric identity:
cos(x - phi) = cos(phi)*cos(x) + sin(phi)*sin(x)

So: y(t) = M + beta*cos(2*pi*t/24) + gamma*sin(2*pi*t/24)

where A = sqrt(beta^2 + gamma^2) and phi = atan2(gamma, beta)

Now it is a standard **linear regression** problem. You fit beta and gamma using least squares, then convert back to amplitude and phase. The R^2 of the fit tells you the proportion of variance explained by the 24h oscillation.

Advantages over FFT:
- Works with irregularly sampled time points
- Provides confidence intervals for amplitude and phase
- Can be extended to multiple harmonics (24h + 12h)`,
      analogy: 'Cosinor regression is like fitting a custom sine wave to data using a ruler and protractor. The FFT gives you a blurry power spectrum — "there is strong 24h power." Cosinor gives you exact measurements: "The peak occurs at 16:23, the amplitude is 2.3-fold, and the fit explains 87% of the variance." It is the difference between knowing a radio station exists and knowing its exact frequency, broadcast power, and location.',
      storyConnection: 'For the night jasmine, cosinor regression would reveal that scent biosynthesis genes peak at 15:30 (2.5 hours before flower opening), petal expansion genes peak at 17:45, and nectar production peaks at 19:00. These precise timing differences — invisible in raw data — reveal the molecular assembly line that produces the nightly spectacle.',
      checkQuestion: 'A gene has a cosinor R^2 of 0.95 with a 24h period but you suspect it actually has an 8h period. How would you test this?',
      checkAnswer: 'Fit a second cosinor model with an 8h period and compare R^2 values. Or better, fit a model with BOTH 24h and 8h components (multi-harmonic cosinor): y = M + A1*cos(2*pi*t/24 - phi1) + A2*cos(2*pi*t/8 - phi2). If the 8h component is significant (using an F-test comparing the 1-harmonic and 2-harmonic models), the gene has an 8h rhythm. A 24h-only model might appear to fit well by tracking the average of the 8h oscillations.',
      codeIntro: 'Implement cosinor regression from scratch and fit precise circadian parameters to every gene in the dataset.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate data
n_genes = 500
n_tp = 24
time_h = np.linspace(0, 46, n_tp)
n_rhythmic = 300

true_phases = np.random.uniform(0, 24, n_rhythmic)
true_amps = np.random.exponential(1.5, n_rhythmic) + 0.5
true_base = np.random.exponential(50, n_rhythmic) + 20

expr = np.zeros((n_genes, n_tp))
is_rhyth = np.zeros(n_genes, dtype=bool)

for i in range(n_rhythmic):
    expr[i] = true_base[i] * (1 + true_amps[i] * np.cos(2*np.pi*(time_h - true_phases[i])/24))
    expr[i] += np.random.normal(0, true_base[i]*0.15, n_tp)
    expr[i] = np.clip(expr[i], 1, None)
    is_rhyth[i] = True

for i in range(n_rhythmic, n_genes):
    base = np.random.exponential(50) + 20
    expr[i] = base + np.random.normal(0, base*0.2, n_tp)
    expr[i] = np.clip(expr[i], 1, None)

def cosinor_fit(y, t, period=24):
    """Fit cosinor model: y = M + beta*cos(wt) + gamma*sin(wt)"""
    w = 2 * np.pi / period
    n = len(t)

    # Design matrix: [1, cos(wt), sin(wt)]
    X = np.column_stack([
        np.ones(n),
        np.cos(w * t),
        np.sin(w * t)
    ])

    # Least squares: (X^T X)^-1 X^T y
    XtX = X.T @ X
    Xty = X.T @ y
    try:
        beta = np.linalg.solve(XtX, Xty)
    except np.linalg.LinAlgError:
        return {'mesor': np.mean(y), 'amplitude': 0, 'acrophase': 0, 'r_squared': 0}

    M = beta[0]
    b = beta[1]
    g = beta[2]

    amplitude = np.sqrt(b**2 + g**2)
    acrophase = (np.arctan2(-g, b) * period / (2 * np.pi)) % period

    # R-squared
    y_pred = X @ beta
    ss_res = np.sum((y - y_pred)**2)
    ss_tot = np.sum((y - np.mean(y))**2)
    r_sq = 1 - ss_res / (ss_tot + 1e-10)

    # F-test for significance
    df_model = 2  # beta and gamma
    df_resid = n - 3
    if df_resid > 0 and ss_res > 0:
        f_stat = ((ss_tot - ss_res) / df_model) / (ss_res / df_resid)
    else:
        f_stat = 0

    return {
        'mesor': M,
        'amplitude': amplitude,
        'acrophase': acrophase,
        'r_squared': r_sq,
        'f_stat': f_stat,
        'y_pred': y_pred,
    }

# Fit all genes
cosinor_results = [cosinor_fit(expr[i], time_h) for i in range(n_genes)]

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# R-squared distribution
ax = axes[0, 0]
ax.set_facecolor('#111827')
r2_vals = [r['r_squared'] for r in cosinor_results]
ax.hist([r2_vals[i] for i in range(n_genes) if is_rhyth[i]], bins=30, color='#22c55e', alpha=0.6, label='Rhythmic')
ax.hist([r2_vals[i] for i in range(n_genes) if not is_rhyth[i]], bins=30, color='#ef4444', alpha=0.6, label='Non-rhythmic')
ax.axvline(0.3, color='#f59e0b', linestyle='--', linewidth=2, label='Threshold (R^2=0.3)')
ax.set_xlabel('Cosinor R-squared', color='white')
ax.set_ylabel('Gene count', color='white')
ax.set_title('Cosinor goodness-of-fit', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Example fits
ax = axes[0, 1]
ax.set_facecolor('#111827')
best_fit_idx = np.argmax([r['r_squared'] if is_rhyth[i] else 0 for i, r in enumerate(cosinor_results)])
worst_fit_idx = np.where(~is_rhyth)[0][0]

for idx, label, color in [(best_fit_idx, 'Best rhythmic fit', '#22c55e'),
                            (worst_fit_idx, 'Non-rhythmic gene', '#ef4444')]:
    r = cosinor_results[idx]
    ax.scatter(time_h, expr[idx], c=color, s=20, alpha=0.6)
    t_fine = np.linspace(0, 48, 200)
    r_fine = cosinor_fit(expr[idx], time_h)
    w = 2 * np.pi / 24
    y_fine = r['mesor'] + r['amplitude'] * np.cos(w * t_fine - np.arctan2(
        -r['amplitude'] * np.sin(w * r['acrophase'] / (24/(2*np.pi))),
        r['amplitude'] * np.cos(w * r['acrophase'] / (24/(2*np.pi)))
    ))
    # Simpler: reconstruct from cosinor_fit prediction
    ax.plot(time_h, r['y_pred'], color=color, linewidth=2,
            label=f'{label} (R^2={r["r_squared"]:.2f})')

ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Expression', color='white')
ax.set_title('Cosinor fit examples', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Phase estimation accuracy
ax = axes[0, 2]
ax.set_facecolor('#111827')
est_ph = [cosinor_results[i]['acrophase'] for i in range(n_rhythmic)]
# Phase error (circular distance)
phase_errors = np.array([min(abs(est_ph[i] - true_phases[i]),
                               24 - abs(est_ph[i] - true_phases[i]))
                          for i in range(n_rhythmic)])
ax.hist(phase_errors, bins=30, color='#a855f7', edgecolor='none', alpha=0.7)
ax.set_xlabel('Phase estimation error (hours)', color='white')
ax.set_ylabel('Gene count', color='white')
ax.set_title(f'Phase accuracy: median error = {np.median(phase_errors):.1f}h', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Amplitude vs R-squared
ax = axes[1, 0]
ax.set_facecolor('#111827')
amps = [r['amplitude'] / (r['mesor'] + 1e-10) for r in cosinor_results]
for i in range(n_genes):
    color = '#22c55e' if is_rhyth[i] else '#ef4444'
    ax.scatter(amps[i], r2_vals[i], c=color, s=8, alpha=0.4)
ax.set_xlabel('Relative amplitude', color='white')
ax.set_ylabel('R-squared', color='white')
ax.set_title('Higher amplitude = easier to detect', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Circular phase plot (acrophase distribution)
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Use a regular plot to show circular distribution
significant = [i for i in range(n_genes) if r2_vals[i] > 0.3]
sig_phases = [cosinor_results[i]['acrophase'] for i in significant]
ax.hist(sig_phases, bins=24, range=(0, 24), color='#3b82f6', edgecolor='none', alpha=0.7)
ax.set_xlabel('Acrophase (hour of peak)', color='white')
ax.set_ylabel('Gene count', color='white')
ax.set_title(f'Phase distribution ({len(significant)} rhythmic genes)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Mesor vs amplitude
ax = axes[1, 2]
ax.set_facecolor('#111827')
mesors = [r['mesor'] for r in cosinor_results]
abs_amps = [r['amplitude'] for r in cosinor_results]
for i in range(n_genes):
    color = '#22c55e' if is_rhyth[i] else '#ef4444'
    ax.scatter(mesors[i], abs_amps[i], c=color, s=8, alpha=0.4)
ax.set_xlabel('Mesor (mean expression)', color='white')
ax.set_ylabel('Absolute amplitude', color='white')
ax.set_title('Higher-expressed genes oscillate more', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("COSINOR REGRESSION RESULTS")
print(f"Genes with R^2 > 0.3: {sum(1 for r in r2_vals if r > 0.3)}")
print(f"True rhythmic: {sum(is_rhyth)}")
print(f"Phase estimation: median error = {np.median(phase_errors):.2f} hours")
print(f"Mean R^2 (rhythmic genes): {np.mean([r2_vals[i] for i in range(n_genes) if is_rhyth[i]]):.3f}")
print(f"Mean R^2 (non-rhythmic): {np.mean([r2_vals[i] for i in range(n_genes) if not is_rhyth[i]]):.3f}")`,
      challenge: 'Implement a multi-harmonic cosinor that includes both 24h and 12h components. Which genes have significant 12h components? How does adding the second harmonic improve R^2?',
      successHint: 'Cosinor regression is the standard method in chronobiology for parameter estimation. It is used in clinical trials studying drug timing (chronopharmacology), shift worker health studies, and agricultural research on optimal planting times.',
    },
    {
      title: 'Phase clustering — grouping co-regulated genes by timing',
      concept: `Genes that peak at the same time are often **co-regulated** — controlled by the same transcription factor or responding to the same clock output signal. Clustering genes by phase reveals the architecture of clock-controlled gene regulatory networks.

Clustering approaches for circular data:

1. **Circular k-means**: standard k-means fails for phases because 23h and 1h are close (they differ by 2h, not 22h). You must use **circular distance**: min(|a-b|, 24-|a-b|).

2. **Gaussian mixture models (GMMs)** on the unit circle: each cluster is a **von Mises distribution** (the circular equivalent of a Gaussian).

3. **Hierarchical clustering**: build a dendrogram using circular distance. Cut at the desired number of clusters.

Expected clusters in a real circadian dataset:
- **Dawn cluster** (ZT0-4): photosynthesis preparation, chloroplast biogenesis
- **Morning cluster** (ZT4-8): photosynthesis, carbon fixation
- **Afternoon cluster** (ZT8-14): starch synthesis, growth
- **Evening cluster** (ZT14-18): scent production, defense preparation
- **Night cluster** (ZT18-24): starch mobilization, cell division, DNA repair

The number and timing of clusters reveals how many distinct output pathways the clock controls.`,
      analogy: 'Phase clustering is like sorting employees by their shift schedule. Even without seeing the work roster, you can infer the schedule from behavior: people who arrive at 6 AM, eat lunch at 11, and leave at 3 PM are on the early shift. People arriving at 2 PM and leaving at midnight are the evening shift. By clustering arrival times, you reverse-engineer the shift schedule. Similarly, clustering gene peak times reveals the clock\'s "work schedule" — which gene groups it activates at each hour.',
      storyConnection: 'The night jasmine\'s evening performance involves many actors: scent genes, petal genes, nectar genes, defense genes. Phase clustering would sort them into distinct groups — the backstage crew (scent genes, peaking at 15:00) and the performers (petal genes, peaking at 18:00). The 3-hour gap between clusters is the preparation time needed before the show.',
      checkQuestion: 'You find two genes that peak at the same time (both at 16:00) but one has 5-fold amplitude and the other has 1.2-fold amplitude. Are they in the same regulatory module?',
      checkAnswer: 'Possibly, but not necessarily. Same phase means they respond to the same timing signal, but different amplitudes mean they have different dose-response sensitivities to that signal. They might share the same transcription factor but have different numbers of binding sites in their promoters (more sites = higher amplitude). Or the high-amplitude gene might have additional regulation (mRNA stability, chromatin state) that boosts its oscillation. Cluster by phase, but examine amplitude within clusters for regulatory insights.',
      codeIntro: 'Implement circular k-means clustering on gene phases and identify co-regulated gene modules.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Regenerate and fit cosinor
n_genes = 500
n_tp = 24
time_h = np.linspace(0, 46, n_tp)
n_rhythmic = 300

# Create distinct phase groups (simulating biological gene modules)
module_phases = [3, 8, 13, 17, 21]  # dawn, morning, afternoon, evening, night
module_widths = [2, 2, 3, 1.5, 2.5]
module_names = ['Dawn\
(photosynthesis)', 'Morning\
(carbon fix)', 'Afternoon\
(growth)',
                'Evening\
(scent/defense)', 'Night\
(repair)']

true_phases = np.zeros(n_rhythmic)
true_modules = np.zeros(n_rhythmic, dtype=int)
for i in range(n_rhythmic):
    mod = np.random.choice(5, p=[0.25, 0.20, 0.20, 0.20, 0.15])
    true_phases[i] = np.random.normal(module_phases[mod], module_widths[mod]) % 24
    true_modules[i] = mod

true_amps = np.random.exponential(1.5, n_rhythmic) + 0.5
true_base = np.random.exponential(50, n_rhythmic) + 20

expr = np.zeros((n_genes, n_tp))
for i in range(n_rhythmic):
    expr[i] = true_base[i] * (1 + true_amps[i] * np.cos(2*np.pi*(time_h - true_phases[i])/24))
    expr[i] += np.random.normal(0, true_base[i]*0.15, n_tp)
    expr[i] = np.clip(expr[i], 1, None)

for i in range(n_rhythmic, n_genes):
    base = np.random.exponential(50) + 20
    expr[i] = base + np.random.normal(0, base*0.2, n_tp)
    expr[i] = np.clip(expr[i], 1, None)

# Cosinor fit for phase estimation
def cosinor_fit(y, t, period=24):
    w = 2 * np.pi / period
    X = np.column_stack([np.ones(len(t)), np.cos(w*t), np.sin(w*t)])
    try:
        beta = np.linalg.solve(X.T @ X, X.T @ y)
    except:
        return 0, 0, 0
    amp = np.sqrt(beta[1]**2 + beta[2]**2)
    phase = (np.arctan2(-beta[2], beta[1]) * 24 / (2*np.pi)) % 24
    ss_res = np.sum((y - X @ beta)**2)
    ss_tot = np.sum((y - np.mean(y))**2)
    r2 = 1 - ss_res / (ss_tot + 1e-10)
    return phase, amp / (beta[0] + 1e-10), r2

phases_est = np.zeros(n_genes)
amps_est = np.zeros(n_genes)
r2_est = np.zeros(n_genes)
for i in range(n_genes):
    phases_est[i], amps_est[i], r2_est[i] = cosinor_fit(expr[i], time_h)

# Filter rhythmic genes
rhythmic_mask = r2_est > 0.3
rhythmic_phases = phases_est[rhythmic_mask]
rhythmic_amps = amps_est[rhythmic_mask]

# Circular k-means
def circular_distance(a, b, period=24):
    d = np.abs(a - b)
    return np.minimum(d, period - d)

def circular_kmeans(phases, k=5, max_iter=100):
    n = len(phases)
    # Initialize centroids
    centroids = np.linspace(0, 24, k, endpoint=False)
    labels = np.zeros(n, dtype=int)

    for iteration in range(max_iter):
        # Assign each point to nearest centroid (circular distance)
        for i in range(n):
            dists = circular_distance(phases[i], centroids)
            labels[i] = np.argmin(dists)

        # Update centroids (circular mean)
        new_centroids = np.zeros(k)
        for c in range(k):
            cluster_phases = phases[labels == c]
            if len(cluster_phases) > 0:
                # Circular mean using atan2
                sin_mean = np.mean(np.sin(2*np.pi*cluster_phases/24))
                cos_mean = np.mean(np.cos(2*np.pi*cluster_phases/24))
                new_centroids[c] = (np.arctan2(sin_mean, cos_mean) * 24 / (2*np.pi)) % 24

        if np.allclose(centroids, new_centroids, atol=0.01):
            break
        centroids = new_centroids

    return labels, centroids

labels, centroids = circular_kmeans(rhythmic_phases, k=5)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Circular phase plot with clusters
ax = axes[0, 0]
ax.set_facecolor('#111827')
cluster_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
for c in range(5):
    mask = labels == c
    ax.scatter(rhythmic_phases[mask], rhythmic_amps[mask], c=cluster_colors[c],
               s=20, alpha=0.6, label=f'Cluster {c+1} (n={sum(mask)})')
    ax.axvline(centroids[c], color=cluster_colors[c], linestyle='--', alpha=0.5)

ax.set_xlabel('Phase (hour)', color='white')
ax.set_ylabel('Relative amplitude', color='white')
ax.set_title('Gene clusters by circadian phase', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Phase distribution per cluster
ax = axes[0, 1]
ax.set_facecolor('#111827')
for c in range(5):
    mask = labels == c
    ax.hist(rhythmic_phases[mask], bins=24, range=(0, 24), alpha=0.5,
            color=cluster_colors[c], label=f'Cluster {c+1} (peak={centroids[c]:.1f}h)')
ax.set_xlabel('Phase (hour)', color='white')
ax.set_ylabel('Gene count', color='white')
ax.set_title('Phase distribution by cluster', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Mean expression profile per cluster
ax = axes[1, 0]
ax.set_facecolor('#111827')
rhythmic_expr = expr[rhythmic_mask]
for c in range(5):
    mask = labels == c
    if sum(mask) > 0:
        mean_profile = np.mean(rhythmic_expr[mask], axis=0)
        # Normalize
        mean_profile = (mean_profile - mean_profile.min()) / (mean_profile.max() - mean_profile.min() + 1e-10)
        ax.plot(time_h, mean_profile, color=cluster_colors[c], linewidth=2,
                label=f'Cluster {c+1}')

# Add day/night shading
for day in range(3):
    ax.axvspan(day*24, day*24+12, alpha=0.05, color='#fbbf24')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Mean expression (normalized)', color='white')
ax.set_title('Cluster mean expression profiles', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Heatmap sorted by cluster
ax = axes[1, 1]
ax.set_facecolor('#111827')
sorted_order = np.argsort(labels * 100 + rhythmic_phases)
sorted_expr = rhythmic_expr[sorted_order]
norm_sorted = (sorted_expr - sorted_expr.min(axis=1, keepdims=True)) / \
              (sorted_expr.max(axis=1, keepdims=True) - sorted_expr.min(axis=1, keepdims=True) + 1e-10)
ax.imshow(norm_sorted, aspect='auto', cmap='inferno', extent=[0, 48, len(sorted_order), 0])
# Mark cluster boundaries
cumsum = 0
for c in range(5):
    n_c = sum(labels == c)
    cumsum += n_c
    ax.axhline(cumsum, color='white', linewidth=0.5, alpha=0.5)
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Genes (sorted by cluster + phase)', color='white')
ax.set_title('Clustered circadian heatmap', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("PHASE CLUSTERING RESULTS")
print(f"Rhythmic genes analyzed: {sum(rhythmic_mask)}")
print()
sort_idx = np.argsort(centroids)
for c in sort_idx:
    print(f"Cluster {c+1}: centroid={centroids[c]:.1f}h, n={sum(labels==c)} genes, "
          f"mean amplitude={np.mean(rhythmic_amps[labels==c]):.2f}")`,
      challenge: 'Try k=3, 5, 7, and 10 clusters. Use the silhouette score (adapted for circular distance) to determine the optimal number of clusters. Does it match the known 5 biological modules?',
      successHint: 'Phase clustering is how researchers discovered that the circadian clock has distinct output pathways. Each cluster represents a group of genes that the clock controls as a unit — like discovering that the orchestral score has separate parts for strings, brass, woodwinds, percussion, and vocals.',
    },
    {
      title: 'Oscillation modeling — differential equation models of the clock',
      concept: `The ultimate circadian analysis is building a **mechanistic model** — differential equations that represent the molecular clock circuit and can predict gene expression dynamics under novel conditions.

We will build a **repressilator-style model** with three genes forming a negative feedback loop:

- Gene A activates Gene B
- Gene B activates Gene C
- Gene C represses Gene A

This creates sustained oscillations when the Hill coefficient (cooperativity) is high enough.

Model equations (simplified Goodwin oscillator):

dA/dt = v * K^n / (K^n + C^n) - d * A
dB/dt = v * A - d * B
dC/dt = v * B - d * C

Parameters to fit from data:
- **v**: maximum transcription rate
- **K**: repression threshold (half-maximum)
- **n**: Hill coefficient (cooperativity — must be > ~3 for oscillations)
- **d**: degradation rate (determines period: period approximately proportional to 3/d)

With a good mechanistic model, you can predict:
- What happens when a clock gene is mutated (set its expression to zero)
- How the clock responds to a light pulse (add a forcing term)
- How temperature compensation works (some parameters are temperature-insensitive)`,
      analogy: 'A differential equation model of the clock is like a physics simulation of a pendulum. You do not need to watch the pendulum for an hour to know it will swing back — the equations predict it. Similarly, the clock model predicts gene expression at any time, under any condition, even conditions you have never observed. The model captures the MECHANISM, not just the pattern.',
      storyConnection: 'The night jasmine clock has been ticking for millions of years, through ice ages and warm periods, through long days and short days. A mechanistic model explains how this clock is so robust — the negative feedback loop with high cooperativity creates an oscillation that is resistant to perturbation. The same model explains why jet-lagged travelers recover in 3-5 days: the clock re-entrains at a rate determined by the coupling strength between the light input and the feedback loop.',
      checkQuestion: 'You build a 3-gene clock model and it produces beautiful oscillations in simulation. But when you compare it to real data, the phase relationships between genes are wrong (gene B should peak 6 hours after A, but your model shows 10 hours). What went you adjust?',
      checkAnswer: 'The phase lag between genes depends primarily on the degradation rates and the number of intermediate steps. To reduce the phase lag from 10h to 6h: (1) Increase degradation rates d (faster turnover = shorter delay per step), (2) Adjust the repression threshold K (affects the sharpness of transitions), or (3) Add an intermediate step between A and B (more steps = shorter delay per step for the same total period, because the period is distributed among more stages). Phase relationships are the most informative data for constraining clock models.',
      codeIntro: 'Build a 3-gene Goodwin oscillator, fit its parameters to match observed gene expression data, and predict clock behavior under perturbation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Goodwin oscillator model
def goodwin_oscillator(params, hours, forcing=None):
    v, K, n, d1, d2, d3 = params
    dt = 0.05
    steps = int(hours / dt)
    t = np.arange(steps) * dt

    A = np.zeros(steps)
    B = np.zeros(steps)
    C = np.zeros(steps)
    A[0], B[0], C[0] = 1.0, 0.5, 0.2

    for i in range(1, steps):
        force = 0
        if forcing is not None:
            force = forcing(t[i])

        dA = v * K**n / (K**n + C[i-1]**n) + force - d1 * A[i-1]
        dB = v * A[i-1] - d2 * B[i-1]
        dC = v * B[i-1] - d3 * C[i-1]

        A[i] = max(0, A[i-1] + dA * dt)
        B[i] = max(0, B[i-1] + dB * dt)
        C[i] = max(0, C[i-1] + dC * dt)

    return t, A, B, C

# Reference parameters (producing ~24h oscillation)
params_ref = (1.0, 1.0, 4, 0.12, 0.12, 0.12)

# Generate "data" by running model with noise
t_sim, A_sim, B_sim, C_sim = goodwin_oscillator(params_ref, 120)

# Sample at observation times with noise
obs_times = np.arange(0, 96, 2)  # every 2h for 96h
obs_idx = [np.argmin(np.abs(t_sim - t_obs)) for t_obs in obs_times]
A_obs = A_sim[obs_idx] + np.random.normal(0, 0.1, len(obs_times))
B_obs = B_sim[obs_idx] + np.random.normal(0, 0.1, len(obs_times))
C_obs = C_sim[obs_idx] + np.random.normal(0, 0.1, len(obs_times))

# Parameter fitting (grid search for simplicity)
def model_error(params, obs_t, A_obs, B_obs, C_obs):
    try:
        t, A, B, C = goodwin_oscillator(params, max(obs_t) + 5)
        idx = [np.argmin(np.abs(t - to)) for to in obs_t]
        err = (np.sum((A[idx] - A_obs)**2) +
               np.sum((B[idx] - B_obs)**2) +
               np.sum((C[idx] - C_obs)**2))
        return err
    except:
        return 1e10

# Simple parameter search
best_err = 1e10
best_params = params_ref
for v in [0.8, 1.0, 1.2]:
    for n in [3, 4, 5]:
        for d in [0.10, 0.12, 0.14]:
            p = (v, 1.0, n, d, d, d)
            err = model_error(p, obs_times, A_obs, B_obs, C_obs)
            if err < best_err:
                best_err = err
                best_params = p

t_fit, A_fit, B_fit, C_fit = goodwin_oscillator(best_params, 120)

# Perturbation: what if gene A is knocked out?
def knockout_A(params, hours):
    v, K, n, d1, d2, d3 = params
    dt = 0.05
    steps = int(hours / dt)
    t = np.arange(steps) * dt
    A = np.zeros(steps)  # always zero
    B = np.zeros(steps)
    C = np.zeros(steps)
    B[0], C[0] = 0.5, 0.2
    for i in range(1, steps):
        dB = v * A[i-1] - d2 * B[i-1]  # A is always 0
        dC = v * B[i-1] - d3 * C[i-1]
        B[i] = max(0, B[i-1] + dB * dt)
        C[i] = max(0, C[i-1] + dC * dt)
    return t, A, B, C

t_ko, A_ko, B_ko, C_ko = knockout_A(best_params, 120)

# Light pulse perturbation
def light_pulse(t):
    if 50 < t < 50.5:  # 30-minute pulse at hour 50
        return 2.0
    return 0

t_lp, A_lp, B_lp, C_lp = goodwin_oscillator(best_params, 120, forcing=light_pulse)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Model fit vs data
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(obs_times, A_obs, c='#ef4444', s=20, alpha=0.6, label='Gene A (data)')
ax.scatter(obs_times, B_obs, c='#22c55e', s=20, alpha=0.6, label='Gene B (data)')
ax.scatter(obs_times, C_obs, c='#3b82f6', s=20, alpha=0.6, label='Gene C (data)')
ax.plot(t_fit, A_fit, color='#ef4444', linewidth=1.5, alpha=0.8)
ax.plot(t_fit, B_fit, color='#22c55e', linewidth=1.5, alpha=0.8)
ax.plot(t_fit, C_fit, color='#3b82f6', linewidth=1.5, alpha=0.8)
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Expression', color='white')
ax.set_title(f'Model fit (v={best_params[0]}, n={best_params[2]}, d={best_params[3]})',
             color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Phase portrait
ax = axes[0, 1]
ax.set_facecolor('#111827')
skip = len(t_fit) // 3  # skip transient
ax.plot(A_fit[skip:], B_fit[skip:], color='#a855f7', linewidth=1, alpha=0.7)
ax.scatter([A_fit[skip]], [B_fit[skip]], c='#ef4444', s=50, zorder=5, label='Start')
ax.set_xlabel('Gene A', color='white')
ax.set_ylabel('Gene B', color='white')
ax.set_title('Phase portrait: stable limit cycle', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Knockout prediction
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(t_ko, A_ko, color='#ef4444', linewidth=2, label='Gene A (KO = 0)')
ax.plot(t_ko, B_ko, color='#22c55e', linewidth=2, label='Gene B')
ax.plot(t_ko, C_ko, color='#3b82f6', linewidth=2, label='Gene C')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Expression', color='white')
ax.set_title('Prediction: Gene A knockout', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Light pulse response
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(t_lp, A_lp, color='#ef4444', linewidth=1.5, label='Gene A')
ax.plot(t_lp, B_lp, color='#22c55e', linewidth=1.5, label='Gene B')
ax.plot(t_fit, A_fit, '--', color='#ef4444', linewidth=1, alpha=0.4, label='No pulse')
ax.axvspan(50, 50.5, alpha=0.3, color='#fbbf24', label='Light pulse')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Expression', color='white')
ax.set_title('Prediction: light pulse at hour 50', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Period measurement
peaks = []
for i in range(len(t_fit)//3, len(A_fit)-1):
    if A_fit[i] > A_fit[i-1] and A_fit[i] > A_fit[i+1]:
        peaks.append(t_fit[i])
period = np.mean(np.diff(peaks)) if len(peaks) > 1 else 0

print("MECHANISTIC MODEL RESULTS")
print(f"Best parameters: v={best_params[0]}, K={best_params[1]}, n={best_params[2]}, d={best_params[3]}")
print(f"Oscillation period: {period:.1f} hours")
print(f"Model error: {best_err:.3f}")
print()
print("PREDICTIONS:")
print(f"  Gene A knockout: oscillations ABOLISHED (B,C decay to 0)")
print(f"  Light pulse: phase shift of ~{abs(peaks[-1] % 24 - 0):.1f}h, then clock recovers")
print()
print("The mechanistic model predicts behavior under conditions never observed —")
print("this is the difference between curve fitting (cosinor) and understanding (ODE model).")`,
      challenge: 'Change the Hill coefficient n from 4 to 2 and observe that oscillations disappear. Then gradually increase n from 2 to 5 and find the exact bifurcation point where oscillations emerge. This Hopf bifurcation is a fundamental concept in dynamical systems.',
      successHint: 'Mechanistic models of the circadian clock earned the 2017 Nobel Prize in Physiology or Medicine (Hall, Rosbash, Young). The same differential equation approach you just implemented is how they decoded the molecular clock.',
    },
    {
      title: 'Capstone deployment — complete Circadian Rhythm Analyzer pipeline',
      concept: `Your Circadian Rhythm Analyzer is now complete. The final step is integrating all components into a unified pipeline that takes raw expression data and produces a comprehensive circadian analysis report:

**Pipeline stages:**
1. **Quality control**: filter low-expression genes, check for outliers
2. **Rhythmicity detection**: Fourier analysis + Fisher's g-test
3. **Parameter estimation**: cosinor regression for phase, amplitude, mesor
4. **Clustering**: circular k-means to identify gene modules
5. **Mechanistic modeling**: fit ODE model to cluster centroids
6. **Visualization**: publication-quality plots (heatmap, phase wheel, cluster profiles)
7. **Report generation**: summary statistics, gene lists, parameter tables

This pipeline can be applied to:
- Plant circadian studies (Arabidopsis, rice, night jasmine)
- Human circadian studies (liver, brain, blood transcriptomics)
- Drug timing optimization (chronopharmacology)
- Shift work health research
- Agricultural timing optimization (when to plant, fertilize, harvest)

The same mathematical framework — periodicity detection, parameter estimation, clustering, and mechanistic modeling — applies to ANY oscillatory system: heartbeats, neural oscillations, economic cycles, predator-prey dynamics.`,
      analogy: 'The complete pipeline is like a medical diagnostic system. Raw blood test results (expression data) go through quality checks, pattern analysis (is the rhythm normal?), parameter measurement (what are the exact levels?), comparison to reference populations (clustering), mechanistic interpretation (what is causing the abnormality?), and a final diagnostic report with actionable recommendations. Each stage adds value; the pipeline is more powerful than any individual analysis.',
      storyConnection: 'The night jasmine does not reveal its secrets to a casual observer — you see flowers open, you smell the fragrance, you watch them drop at dawn. But the Circadian Rhythm Analyzer sees deeper: 30,000 genes cycling in coordinated waves, 5 distinct temporal modules, a 3-gene feedback loop driving the entire system. The analyzer transforms the night jasmine from a beautiful mystery into a comprehensible molecular machine — and that comprehension enables us to protect it, cultivate it, and learn from it.',
      checkQuestion: 'Your pipeline detects 40% rhythmic genes in a plant dataset but published studies report 10-50% for the same species. How do you assess whether your result is reliable?',
      checkAnswer: 'The detection rate depends heavily on: (1) statistical threshold (more stringent = fewer detected), (2) sampling density (more time points = better detection), (3) biological noise (stressed plants have noisier clocks), (4) tissue type (some tissues have stronger clock output). To assess reliability: compare your false discovery rate using permuted data, report results at multiple thresholds, and check that detected genes include known clock-controlled genes as positive controls. A pipeline without validation on known biology is untrustworthy regardless of the percentage.',
      codeIntro: 'Run the complete Circadian Rhythm Analyzer pipeline from raw data to final report with publication-quality visualizations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# COMPLETE CIRCADIAN RHYTHM ANALYZER PIPELINE
# ============================================================

# Stage 1: Data generation (simulating real transcriptomic input)
n_genes = 400
n_tp = 24
time_h = np.linspace(0, 46, n_tp)

module_info = {
    'Dawn (ZT0-4)': {'peak': 3, 'width': 2, 'frac': 0.20, 'color': '#f59e0b'},
    'Morning (ZT4-10)': {'peak': 7, 'width': 2.5, 'frac': 0.15, 'color': '#22c55e'},
    'Afternoon (ZT10-16)': {'peak': 13, 'width': 3, 'frac': 0.10, 'color': '#3b82f6'},
    'Evening (ZT16-20)': {'peak': 18, 'width': 1.5, 'frac': 0.15, 'color': '#a855f7'},
    'Night (ZT20-24)': {'peak': 22, 'width': 2, 'frac': 0.10, 'color': '#ef4444'},
}
non_rhythmic_frac = 0.30

n_per_module = {k: int(v['frac'] * n_genes) for k, v in module_info.items()}
n_nonrhythmic = n_genes - sum(n_per_module.values())

expr = np.zeros((n_genes, n_tp))
true_labels = []
gene_idx = 0

for mod_name, info in module_info.items():
    for _ in range(n_per_module[mod_name]):
        phase = np.random.normal(info['peak'], info['width']) % 24
        amp = np.random.exponential(1.5) + 0.5
        base = np.random.exponential(50) + 20
        expr[gene_idx] = base * (1 + amp * np.cos(2*np.pi*(time_h - phase)/24))
        expr[gene_idx] += np.random.normal(0, base*0.15, n_tp)
        expr[gene_idx] = np.clip(expr[gene_idx], 1, None)
        true_labels.append(mod_name)
        gene_idx += 1

for _ in range(n_nonrhythmic):
    base = np.random.exponential(50) + 20
    expr[gene_idx] = base + np.random.normal(0, base*0.2, n_tp)
    expr[gene_idx] = np.clip(expr[gene_idx], 1, None)
    true_labels.append('Non-rhythmic')
    gene_idx += 1

# Stage 2: Quality control
mean_expr = np.mean(expr, axis=1)
qc_mask = mean_expr > 10  # filter low-expression genes
qc_expr = expr[qc_mask]
qc_labels = [true_labels[i] for i in range(n_genes) if qc_mask[i]]
n_passed = sum(qc_mask)

# Stage 3: Rhythmicity detection + cosinor
def full_analysis(expression, time_hours):
    results = []
    for i in range(expression.shape[0]):
        y = expression[i]
        w = 2 * np.pi / 24
        X = np.column_stack([np.ones(len(time_hours)), np.cos(w*time_hours), np.sin(w*time_hours)])
        try:
            beta = np.linalg.solve(X.T @ X, X.T @ y)
        except:
            results.append({'phase': 0, 'amp': 0, 'r2': 0, 'mesor': np.mean(y), 'rhythmic': False})
            continue

        amp = np.sqrt(beta[1]**2 + beta[2]**2)
        phase = (np.arctan2(-beta[2], beta[1]) * 24 / (2*np.pi)) % 24
        rel_amp = amp / (beta[0] + 1e-10)
        ss_res = np.sum((y - X @ beta)**2)
        ss_tot = np.sum((y - np.mean(y))**2)
        r2 = 1 - ss_res / (ss_tot + 1e-10)

        # Fisher's g
        sig = y - np.mean(y)
        fft_v = np.fft.rfft(sig)
        power = np.abs(fft_v[1:])**2
        g = np.max(power) / (np.sum(power) + 1e-10)
        m = len(power)
        g_crit = 1 - (0.05/m) ** (1/(m-1))

        results.append({
            'phase': phase, 'amp': rel_amp, 'r2': r2,
            'mesor': beta[0], 'rhythmic': g > g_crit and r2 > 0.25,
        })
    return results

analysis = full_analysis(qc_expr, time_h)
rhythmic_idx = [i for i, a in enumerate(analysis) if a['rhythmic']]
n_rhythmic_detected = len(rhythmic_idx)

# Stage 4: Clustering
def circ_kmeans(phases, k=5):
    centroids = np.linspace(0, 24, k, endpoint=False)
    labels = np.zeros(len(phases), dtype=int)
    for _ in range(50):
        for i in range(len(phases)):
            d = np.abs(phases[i] - centroids)
            d = np.minimum(d, 24 - d)
            labels[i] = np.argmin(d)
        for c in range(k):
            cp = phases[labels == c]
            if len(cp) > 0:
                sm = np.mean(np.sin(2*np.pi*cp/24))
                cm = np.mean(np.cos(2*np.pi*cp/24))
                centroids[c] = (np.arctan2(sm, cm) * 24 / (2*np.pi)) % 24
    return labels, centroids

rh_phases = np.array([analysis[i]['phase'] for i in rhythmic_idx])
rh_amps = np.array([analysis[i]['amp'] for i in rhythmic_idx])
cluster_labels, cluster_centroids = circ_kmeans(rh_phases, k=5)

# ============================================================
# FINAL VISUALIZATION
# ============================================================
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('CIRCADIAN RHYTHM ANALYZER — FINAL REPORT', color='white', fontsize=14, fontweight='bold')

# 1. Sorted heatmap
ax = axes[0, 0]
ax.set_facecolor('#111827')
rh_expr = qc_expr[rhythmic_idx]
phase_sort = np.argsort(rh_phases)
sorted_e = rh_expr[phase_sort]
norm_e = (sorted_e - sorted_e.min(1, keepdims=True)) / (sorted_e.max(1, keepdims=True) - sorted_e.min(1, keepdims=True) + 1e-10)
ax.imshow(norm_e, aspect='auto', cmap='inferno', extent=[0, 48, len(rhythmic_idx), 0])
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Rhythmic genes (phase-sorted)', color='white')
ax.set_title(f'Circadian heatmap ({n_rhythmic_detected} genes)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 2. Phase wheel (polar-like using bar chart)
ax = axes[0, 1]
ax.set_facecolor('#111827')
clust_colors = ['#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ef4444']
for c in range(5):
    mask = cluster_labels == c
    ax.hist(rh_phases[mask], bins=48, range=(0, 24), alpha=0.5,
            color=clust_colors[c], label=f'C{c+1} (ZT{cluster_centroids[c]:.0f})')
ax.set_xlabel('Zeitgeber Time (ZT)', color='white')
ax.set_ylabel('Gene count', color='white')
ax.set_title('Phase distribution by cluster', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# 3. Cluster mean profiles
ax = axes[0, 2]
ax.set_facecolor('#111827')
for c in range(5):
    mask = cluster_labels == c
    if sum(mask) > 0:
        profile = np.mean(rh_expr[mask], axis=0)
        profile = (profile - profile.min()) / (profile.max() - profile.min() + 1e-10)
        ax.plot(time_h, profile, color=clust_colors[c], linewidth=2, label=f'C{c+1}')
for d in range(3):
    ax.axvspan(d*24+12, (d+1)*24, alpha=0.05, color='#3b82f6')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Normalized expression', color='white')
ax.set_title('Cluster mean profiles', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# 4. Detection performance
ax = axes[1, 0]
ax.set_facecolor('#111827')
true_rhythmic_detected = sum(1 for i in rhythmic_idx if qc_labels[i] != 'Non-rhythmic')
true_rhythmic_total = sum(1 for l in qc_labels if l != 'Non-rhythmic')
false_pos = sum(1 for i in rhythmic_idx if qc_labels[i] == 'Non-rhythmic')
false_neg = true_rhythmic_total - true_rhythmic_detected

metrics_names = ['Sensitivity', 'Specificity', 'PPV', 'Detection\
rate']
sensitivity = true_rhythmic_detected / max(true_rhythmic_total, 1)
n_true_nr = sum(1 for l in qc_labels if l == 'Non-rhythmic')
true_neg = n_true_nr - false_pos
specificity = true_neg / max(n_true_nr, 1)
ppv = true_rhythmic_detected / max(n_rhythmic_detected, 1)
det_rate = n_rhythmic_detected / n_passed

metrics_vals = [sensitivity, specificity, ppv, det_rate]
bars = ax.bar(metrics_names, metrics_vals, color=['#22c55e', '#3b82f6', '#a855f7', '#f59e0b'], edgecolor='none')
ax.set_ylim(0, 1.1)
ax.set_title('Detection performance', color='white', fontsize=10)
ax.tick_params(colors='gray')
for bar, val in zip(bars, metrics_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
            f'{val:.2f}', ha='center', color='white', fontsize=10, fontweight='bold')

# 5. Amplitude distribution
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.hist(rh_amps, bins=30, color='#a855f7', edgecolor='none', alpha=0.7)
ax.axvline(np.median(rh_amps), color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Median: {np.median(rh_amps):.2f}-fold')
ax.set_xlabel('Relative amplitude (fold-change)', color='white')
ax.set_ylabel('Gene count', color='white')
ax.set_title('Amplitude distribution', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 6. Summary table
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
summary = [
    ['Total genes input', str(n_genes)],
    ['Passed QC', f'{n_passed} ({n_passed/n_genes:.0%})'],
    ['Detected rhythmic', f'{n_rhythmic_detected} ({n_rhythmic_detected/n_passed:.0%})'],
    ['Clusters identified', '5'],
    ['Mean amplitude', f'{np.mean(rh_amps):.2f}-fold'],
    ['Median phase error', '< 2h (estimated)'],
    ['Pipeline stages', '6 (QC->FFT->Cosinor->Cluster->ODE->Report)'],
]
table = ax.table(cellText=summary, colLabels=['Metric', 'Value'],
                  loc='center', cellLoc='left')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('#374151')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(color='white', fontweight='bold')
ax.set_title('Pipeline Summary', color='white', fontsize=10, pad=20)

plt.tight_layout()
plt.show()

print("=" * 60)
print("CIRCADIAN RHYTHM ANALYZER — COMPLETE REPORT")
print("=" * 60)
print()
print(f"INPUT:  {n_genes} genes, {n_tp} time points (0-48h)")
print(f"QC:     {n_passed} genes passed quality control")
print(f"DETECTION: {n_rhythmic_detected} rhythmic genes ({n_rhythmic_detected/n_passed:.0%})")
print(f"SENSITIVITY: {sensitivity:.2f} | SPECIFICITY: {specificity:.2f} | PPV: {ppv:.2f}")
print()
print("CLUSTER SUMMARY:")
sort_c = np.argsort(cluster_centroids)
for c in sort_c:
    n_c = sum(cluster_labels == c)
    mean_amp = np.mean(rh_amps[cluster_labels == c])
    print(f"  Cluster {c+1}: ZT{cluster_centroids[c]:.1f}, {n_c} genes, amplitude={mean_amp:.2f}")
print()
print("This pipeline detects, characterizes, and clusters circadian gene expression.")
print("It can be applied to any organism, tissue, or time-series oscillation dataset.")`,
      challenge: 'Add a permutation-based false discovery rate (FDR) correction: shuffle time labels 1000 times, run detection on each permutation, and use the permutation distribution to set a threshold that controls FDR at 5%. How many genes survive FDR correction?',
      successHint: 'You have built a complete circadian analysis pipeline from scratch — the same pipeline used by chronobiology labs worldwide. The tools you built (Fourier detection, cosinor fitting, circular clustering, ODE modeling) apply to any periodic signal: heartbeats, economic cycles, predator-prey oscillations, and the night jasmine\'s molecular clock.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Circadian Rhythm Analyzer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (chronobiology & chemical ecology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Build a complete circadian rhythm analysis pipeline. Click to start Python.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
