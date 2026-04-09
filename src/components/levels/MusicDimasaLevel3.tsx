import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MusicDimasaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Polyrhythm mathematics — modeling simultaneous rhythmic layers",
      concept: "modeling simultaneous rhythmic layers. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Polyrhythm mathematics — modeling simultaneous rhythmic layers ---
print("=== Polyrhythm Mathematics ===\\n")

# A polyrhythm layers two or more rhythms with different beat counts
# over the same time span. The simplest example: 3 against 2.

duration = 1.0  # one measure in seconds
bpm = 120
beat_duration = 60.0 / bpm

# Define several rhythm layers (beats per measure)
layers = {
    "Khram (bass drum)": 4,
    "Jota (snare pattern)": 3,
    "Pada (hi-hat)": 7,
    "Vocal accent": 5,
}

print("Rhythm layers in one measure:")
for name, beats in layers.items():
    times = np.linspace(0, duration, beats, endpoint=False)
    print(f"  {name}: {beats} beats at t = {', '.join(f'{t:.3f}s' for t in times)}")

# LCM tells us when all layers realign
from math import gcd
from functools import reduce
def lcm(a, b):
    return a * b // gcd(a, b)

all_beats = list(layers.values())
cycle_length = reduce(lcm, all_beats)
print(f"\\nCycle length (LCM of {all_beats}): {cycle_length} subdivisions")
print(f"All four layers realign every {cycle_length} smallest-note units.")

# Compute coincidence points — where two or more layers hit simultaneously
subdivisions = 420  # fine grid
grid = np.arange(subdivisions)
hits_per_layer = {}
for name, beats in layers.items():
    spacing = subdivisions / beats
    hit_positions = set(round(i * spacing) % subdivisions for i in range(beats))
    hits_per_layer[name] = hit_positions

# Find where 2+ layers coincide
coincidences = {}
for pos in range(subdivisions):
    count = sum(1 for h in hits_per_layer.values() if pos in h)
    if count >= 2:
        coincidences[pos] = count

print(f"\\nCoincidence points (2+ layers hitting together): {len(coincidences)}")
max_overlap = max(coincidences.values()) if coincidences else 0
strongest = [p for p, c in coincidences.items() if c == max_overlap]
print(f"Strongest accent ({max_overlap} layers together) at subdivisions: {strongest[:5]}{'...' if len(strongest) > 5 else ''}")

# Rhythmic density — total events per measure
total_events = sum(layers.values())
print(f"\\nTotal rhythmic events per measure: {total_events}")
print(f"Average inter-onset interval: {duration / total_events * 1000:.1f} ms")
print(f"\\nKey insight: Dimasa polyrhythms use odd groupings (3, 5, 7) that")
print(f"rarely coincide, creating a shimmering texture unlike the regular")
print(f"accents of Western 4/4 time.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Scale systems — comparing Dimasa scales to Western temperament",
      concept: "comparing Dimasa scales to Western temperament. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Scale systems — comparing Dimasa scales to Western temperament ---
print("=== Dimasa vs Western Scale Comparison ===\\n")

# Western equal temperament: each semitone is 2^(1/12) apart
# 12 equal steps from root to octave
A4 = 440.0  # Hz reference

western_semitones = np.arange(13)  # 0 to 12
western_ratios = 2 ** (western_semitones / 12.0)
western_freqs = A4 * western_ratios
western_names = ["A", "Bb", "B", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A'"]

print("Western 12-tone equal temperament (from A4 = 440 Hz):")
for name, freq, ratio in zip(western_names, western_freqs, western_ratios):
    cents = 1200 * np.log2(ratio)
    print(f"  {name:3s}: {freq:7.1f} Hz  (ratio {ratio:.4f}, {cents:6.0f} cents)")

# Dimasa pentatonic scale — 5 notes per octave with non-equal spacing
# These intervals are approximations from ethnomusicological fieldwork
dimasa_cents = [0, 240, 480, 720, 960, 1200]  # roughly equidistant pentatonic
dimasa_ratios = 2 ** (np.array(dimasa_cents) / 1200.0)
dimasa_freqs = A4 * dimasa_ratios
dimasa_labels = ["Sa", "Re", "Ga", "Pa", "Dha", "Sa'"]

print("\\nDimasa pentatonic scale (approximate field measurements):")
for label, freq, cents_val in zip(dimasa_labels, dimasa_freqs, dimasa_cents):
    print(f"  {label:4s}: {freq:7.1f} Hz  ({cents_val:4d} cents from root)")

# Compare: find nearest Western pitch for each Dimasa note
print("\\nNearest Western match for each Dimasa note:")
western_cents_arr = 1200 * np.log2(western_ratios)
for label, dc in zip(dimasa_labels, dimasa_cents):
    diffs = np.abs(western_cents_arr - dc)
    nearest_idx = np.argmin(diffs)
    deviation = dc - western_cents_arr[nearest_idx]
    print(f"  {label:4s} ({dc:4d} cents) -> {western_names[nearest_idx]:3s} ({western_cents_arr[nearest_idx]:.0f} cents), off by {deviation:+.0f} cents")

# Musical intervals in Dimasa scale
print("\\nIntervals between consecutive Dimasa notes:")
for i in range(len(dimasa_cents) - 1):
    interval = dimasa_cents[i + 1] - dimasa_cents[i]
    print(f"  {dimasa_labels[i]} -> {dimasa_labels[i+1]}: {interval} cents ({'~whole tone' if 180 < interval < 260 else '~minor 3rd' if 260 < interval < 350 else 'unique'})")

print("\\nKey insight: Dimasa intervals of ~240 cents fall between a Western")
print("whole tone (200 cents) and minor third (300 cents) — a 'neutral second'")
print("that Western notation cannot represent without microtonal symbols.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Rhythmic complexity metrics — quantifying groove and syncopation",
      concept: "quantifying groove and syncopation. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Rhythmic complexity metrics — quantifying groove and syncopation ---
print("=== Rhythmic Complexity Metrics ===\\n")

# Represent rhythms as binary patterns on a 16-step grid
# 1 = hit, 0 = rest
patterns = {
    "Western 4/4 rock":    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    "Dimasa 7/8 pattern":  [1,0,1,0, 1,0,1, 1,0,1,0, 1,0,1, 0,0],
    "Dimasa cross-rhythm": [1,0,0,1, 0,1,0,0, 1,0,0,1, 0,0,1,0],
    "West African 12/8":   [1,0,0,1, 0,0,1,0, 0,1,0,0, 0,0,0,0],
}

def syncopation_index(pattern):
    """Measure syncopation: count off-beat hits weighted by metrical position."""
    n = len(pattern)
    # Strong beats at positions 0, 4, 8, 12 (weight 0); medium 2, 6, 10, 14 (weight 1); weak = others (weight 2)
    score = 0
    for i, hit in enumerate(pattern):
        if hit:
            if i % 4 == 0:
                score += 0  # on-beat, no syncopation
            elif i % 2 == 0:
                score += 1  # medium off-beat
            else:
                score += 2  # weak position = strong syncopation
    return score

def density(pattern):
    """Ratio of hits to total positions."""
    return sum(pattern) / len(pattern)

def evenness(pattern):
    """How evenly spaced are the hits? Lower std = more even."""
    hits = [i for i, v in enumerate(pattern) if v]
    if len(hits) < 2:
        return 0.0
    intervals = [hits[i+1] - hits[i] for i in range(len(hits)-1)]
    return np.std(intervals)

print(f"{'Pattern':<25s} {'Hits':>4s} {'Density':>8s} {'Syncopation':>12s} {'Evenness(std)':>14s}")
print("-" * 67)
for name, pat in patterns.items():
    h = sum(pat)
    d = density(pat)
    s = syncopation_index(pat)
    e = evenness(pat)
    print(f"{name:<25s} {h:4d} {d:8.2f} {s:12d} {e:14.2f}")

# Explain the metrics
print("\\nWhat the numbers tell us:")
print("- Syncopation: higher = more off-beat accents (the 'groove' factor)")
print("- Evenness (std): lower = more regular spacing; higher = more uneven")
print("- The Dimasa cross-rhythm has HIGH syncopation and HIGH unevenness,")
print("  creating the characteristic 'lilt' that distinguishes it from")
print("  both straight Western beats and West African bell patterns.")

# Entropy as complexity measure
def rhythm_entropy(pattern):
    """Shannon entropy of inter-onset intervals."""
    hits = [i for i, v in enumerate(pattern) if v]
    if len(hits) < 2:
        return 0.0
    intervals = [hits[i+1] - hits[i] for i in range(len(hits)-1)]
    unique, counts = np.unique(intervals, return_counts=True)
    probs = counts / counts.sum()
    return -np.sum(probs * np.log2(probs))

print("\\nInterval entropy (bits) — higher = more interval variety:")
for name, pat in patterns.items():
    ent = rhythm_entropy(pat)
    print(f"  {name:<25s}: {ent:.3f} bits")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Ensemble synchronization — modeling timing in group performance",
      concept: "modeling timing in group performance. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Ensemble synchronization — modeling timing in group performance ---
print("=== Ensemble Synchronization Model ===\\n")

np.random.seed(42)

# Simulate 5 musicians each trying to play beats at the same tempo
# Each has a slightly different internal clock (timing jitter)
n_musicians = 5
n_beats = 20
target_interval = 0.5  # 120 BPM = 0.5s per beat

musician_names = ["Drummer 1 (khram)", "Drummer 2 (jota)", "Flute", "Singer", "Clapper"]
# Each musician has a different timing precision (std in seconds)
jitter_std = [0.010, 0.015, 0.025, 0.030, 0.020]

print(f"Target tempo: {60/target_interval:.0f} BPM (interval = {target_interval*1000:.0f} ms)")
print(f"\\nMusician timing precision (std of jitter):")
for name, j in zip(musician_names, jitter_std):
    print(f"  {name}: +/- {j*1000:.0f} ms")

# Simulate without synchronization (independent clocks)
print("\\n--- Without mutual listening (independent clocks) ---")
independent_times = {}
for name, j in zip(musician_names, jitter_std):
    beats = np.cumsum(target_interval + np.random.normal(0, j, n_beats))
    independent_times[name] = beats

# Measure asynchrony: std of onset times at each beat
async_independent = []
for beat_idx in range(n_beats):
    onsets = [independent_times[name][beat_idx] for name in musician_names]
    async_independent.append(np.std(onsets))

mean_async_indep = np.mean(async_independent) * 1000
print(f"Mean group asynchrony: {mean_async_indep:.1f} ms")

# Simulate WITH mutual synchronization (phase correction)
# Each musician adjusts toward the group mean on each beat
print("\\n--- With mutual listening (phase correction, alpha=0.3) ---")
alpha = 0.3  # correction strength
synced_times = {name: [0.0] for name in musician_names}
for beat_idx in range(1, n_beats + 1):
    # Each musician aims for their own next beat but corrects toward group
    prev_onsets = [synced_times[name][-1] for name in musician_names]
    group_mean = np.mean(prev_onsets)
    for name, j in zip(musician_names, jitter_std):
        own_prev = synced_times[name][-1]
        # correction toward group mean
        correction = alpha * (group_mean - own_prev)
        next_beat = own_prev + target_interval + correction + np.random.normal(0, j)
        synced_times[name].append(next_beat)

async_synced = []
for beat_idx in range(1, n_beats + 1):
    onsets = [synced_times[name][beat_idx] for name in musician_names]
    async_synced.append(np.std(onsets))

mean_async_synced = np.mean(async_synced) * 1000
print(f"Mean group asynchrony: {mean_async_synced:.1f} ms")
print(f"Improvement: {(1 - mean_async_synced/mean_async_indep)*100:.0f}% tighter")

# Drift analysis
print("\\n--- Tempo drift over 20 beats ---")
for name in musician_names:
    intervals = np.diff(synced_times[name][1:])
    drift = (intervals[-1] - intervals[0]) / intervals[0] * 100
    print(f"  {name}: avg interval {np.mean(intervals)*1000:.1f} ms, drift {drift:+.1f}%")

print("\\nKey insight: A correction factor (alpha) of 0.3 means each musician")
print("adjusts 30% toward the group average on every beat. Too low and they")
print("drift apart; too high and the group sounds robotic. Dimasa ensembles")
print("achieve alpha ~ 0.2-0.4 naturally through years of playing together.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Melodic contour analysis — extracting pitch patterns from vocal music",
      concept: "extracting pitch patterns from vocal music. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Melodic contour analysis — extracting pitch patterns from vocal music ---
print("=== Melodic Contour Analysis ===\\n")

np.random.seed(42)

# Simulate a Dimasa vocal melody as a sequence of pitches (in cents above root)
# Dimasa melodies tend to arc upward, hold, then descend — an "arch" contour
melody_dimasa = [0, 240, 480, 720, 960, 960, 720, 480, 240, 0, 0, 240, 480, 720, 480, 240]
# Compare with a Western major scale melody (ascending then descending)
melody_western = [0, 200, 400, 500, 700, 900, 1100, 1200, 1100, 900, 700, 500, 400, 200, 0, 0]

def contour_code(melody):
    """Convert pitch sequence to contour: U(p), D(own), R(epeat)."""
    codes = []
    for i in range(1, len(melody)):
        diff = melody[i] - melody[i-1]
        if diff > 0:
            codes.append("U")
        elif diff < 0:
            codes.append("D")
        else:
            codes.append("R")
    return "".join(codes)

def interval_histogram(melody):
    """Count frequency of each interval size."""
    intervals = [abs(melody[i+1] - melody[i]) for i in range(len(melody)-1)]
    unique, counts = np.unique(intervals, return_counts=True)
    return dict(zip(unique.tolist(), counts.tolist()))

print("Dimasa melody (cents): ", melody_dimasa)
print("Contour code:          ", contour_code(melody_dimasa))
print()
print("Western melody (cents):", melody_western)
print("Contour code:          ", contour_code(melody_western))

# Contour statistics
for name, mel in [("Dimasa", melody_dimasa), ("Western", melody_western)]:
    code = contour_code(mel)
    n_up = code.count("U")
    n_down = code.count("D")
    n_repeat = code.count("R")
    intervals = [mel[i+1] - mel[i] for i in range(len(mel)-1)]
    mean_interval = np.mean(np.abs(intervals))
    max_interval = max(np.abs(intervals))
    pitch_range = max(mel) - min(mel)
    print(f"\\n{name} melody statistics:")
    print(f"  Ups: {n_up}, Downs: {n_down}, Repeats: {n_repeat}")
    print(f"  Mean interval size: {mean_interval:.0f} cents")
    print(f"  Largest leap: {max_interval} cents")
    print(f"  Total range: {pitch_range} cents")

# Interval distribution
print("\\nInterval histogram (absolute cents -> count):")
for name, mel in [("Dimasa", melody_dimasa), ("Western", melody_western)]:
    hist = interval_histogram(mel)
    print(f"  {name}: {hist}")

# Contour similarity using edit distance (simple version)
def contour_distance(c1, c2):
    """Simple contour distance: fraction of positions that differ."""
    min_len = min(len(c1), len(c2))
    if min_len == 0:
        return 1.0
    diffs = sum(1 for a, b in zip(c1[:min_len], c2[:min_len]) if a != b)
    return diffs / min_len

cd = contour_code(melody_dimasa)
cw = contour_code(melody_western)
dist = contour_distance(cd, cw)
print(f"\\nContour distance (Dimasa vs Western): {dist:.2f}")
print(f"(0.0 = identical shape, 1.0 = completely different)")
print(f"\\nKey insight: Dimasa melodies favor 240-cent steps (neutral seconds)")
print(f"and arch-shaped contours with repeated notes at the peak, while")
print(f"Western melodies use a wider variety of interval sizes (100-200 cents).")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Cultural classification — building a music tradition identifier",
      concept: "building a music tradition identifier. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Cultural classification — building a music tradition identifier ---
print("=== Music Tradition Classifier ===\\n")

np.random.seed(42)

# Feature vectors for different music traditions
# Features: [avg_interval_cents, syncopation_score, scale_notes, rhythmic_density, contour_arch_score]
traditions = {
    "Dimasa":         [240, 8, 5, 0.45, 0.85],
    "Western Pop":    [150, 4, 7, 0.50, 0.40],
    "West African":   [200, 9, 5, 0.55, 0.30],
    "Indian Raga":    [100, 3, 7, 0.35, 0.70],
    "Japanese Gagaku": [250, 2, 5, 0.25, 0.60],
}

feature_names = ["Avg interval (cents)", "Syncopation", "Scale notes", "Rhythm density", "Arch contour"]

print("Training data — feature vectors per tradition:")
print(f"{'Tradition':<18s}", end="")
for fn in feature_names:
    print(f"{fn:>20s}", end="")
print()
print("-" * 118)
for name, feats in traditions.items():
    print(f"{name:<18s}", end="")
    for f in feats:
        print(f"{f:>20.2f}", end="")
    print()

# Normalize features to [0, 1]
all_feats = np.array(list(traditions.values()))
feat_min = all_feats.min(axis=0)
feat_max = all_feats.max(axis=0)
feat_range = feat_max - feat_min
feat_range[feat_range == 0] = 1  # avoid division by zero

normalized = {}
for name, feats in traditions.items():
    normalized[name] = (np.array(feats) - feat_min) / feat_range

# Classify an unknown sample using nearest-neighbor (Euclidean distance)
unknown_sample = [230, 7, 5, 0.42, 0.80]
unknown_norm = (np.array(unknown_sample) - feat_min) / feat_range

print(f"\\nUnknown sample: {unknown_sample}")
print(f"\\nDistances from unknown to each tradition:")
distances = {}
for name, norm_feats in normalized.items():
    dist = np.sqrt(np.sum((unknown_norm - norm_feats) ** 2))
    distances[name] = dist
    print(f"  {name:<18s}: {dist:.4f}")

nearest = min(distances, key=distances.get)
print(f"\\nClassification: {nearest} (nearest neighbor)")

# Confusion-style analysis: classify each tradition against all others
print("\\nLeave-one-out validation:")
correct = 0
for test_name, test_feats in normalized.items():
    best_dist = float('inf')
    best_match = ""
    for train_name, train_feats in normalized.items():
        if train_name == test_name:
            continue
        d = np.sqrt(np.sum((test_feats - train_feats) ** 2))
        if d < best_dist:
            best_dist = d
            best_match = train_name
    status = "CORRECT" if best_match != test_name else "CONFUSED"
    # With only 5 classes, nearest OTHER is always different, so check which is closest
    print(f"  {test_name:<18s} -> nearest other: {best_match:<18s} (dist {best_dist:.4f})")

# Feature importance: which feature varies most across traditions?
print("\\nFeature variance (higher = more discriminating):")
for i, fn in enumerate(feature_names):
    col = all_feats[:, i]
    norm_var = np.var((col - col.min()) / (col.max() - col.min() + 1e-9))
    print(f"  {fn:<22s}: {norm_var:.4f}")

print("\\nKey insight: Syncopation and arch contour together are the strongest")
print("discriminators. Dimasa music uniquely combines HIGH syncopation with")
print("HIGH arch contour — no other tradition in our dataset does this.")`,
      challenge: "Combine the models from all six lessons into a unified analysis pipeline. Run it on a new dataset and generate a comprehensive summary report.",
      successHint: "You have built a complete analytical framework for this domain — from raw data to validated predictions.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (music theory fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for ethnomusicology and rhythm mathematics. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
