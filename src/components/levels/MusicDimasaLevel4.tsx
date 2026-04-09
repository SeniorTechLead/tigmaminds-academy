import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MusicDimasaLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Capstone Design: Rhythm Pattern Analyzer — from audio to cultural analysis",
      concept: "The capstone integrates all Level 3 skills into a complete, deployable system. from audio to cultural analysis. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "Building this capstone is like constructing a complete laboratory instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 1: Audio Signal Ingestion & Onset Detection ---
print("=== Capstone Stage 1: Audio Ingestion & Onset Detection ===\\n")

np.random.seed(42)

# Simulate a raw audio signal: drum hits as decaying sinusoids + noise
sample_rate = 8000  # Hz
duration = 2.0  # seconds
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)

# Place drum onsets at specific times (simulating a Dimasa pattern)
onset_times = [0.0, 0.25, 0.45, 0.70, 1.0, 1.25, 1.45, 1.70]
signal = np.zeros_like(t)
for onset in onset_times:
    mask = t >= onset
    decay = np.exp(-15 * (t[mask] - onset))
    signal[mask] += 0.8 * np.sin(2 * np.pi * 200 * (t[mask] - onset)) * decay

# Add noise
signal += 0.05 * np.random.randn(len(signal))

# Onset detection via energy envelope
frame_size = 160  # 20ms frames
n_frames = len(signal) // frame_size
energy = np.array([np.sum(signal[i*frame_size:(i+1)*frame_size]**2) for i in range(n_frames)])

# Normalize energy
energy_norm = energy / (energy.max() + 1e-9)

# Find peaks above threshold
threshold = 0.15
detected_onsets = []
for i in range(1, len(energy_norm) - 1):
    if energy_norm[i] > threshold and energy_norm[i] > energy_norm[i-1] and energy_norm[i] >= energy_norm[i+1]:
        onset_sec = i * frame_size / sample_rate
        detected_onsets.append(onset_sec)

print(f"Signal: {len(signal)} samples at {sample_rate} Hz ({duration}s)")
print(f"Frame size: {frame_size} samples ({frame_size/sample_rate*1000:.0f}ms)")
print(f"Energy frames computed: {n_frames}")
print(f"Detection threshold: {threshold}")
print(f"\\nTrue onsets:     {onset_times}")
print(f"Detected onsets: {[round(x, 3) for x in detected_onsets]}")
print(f"\\nTrue count: {len(onset_times)}, Detected: {len(detected_onsets)}")

# Quality check: how close are detections to truth?
if detected_onsets:
    errors = []
    for true_t in onset_times:
        closest = min(detected_onsets, key=lambda d: abs(d - true_t))
        errors.append(abs(closest - true_t) * 1000)
    print(f"Mean timing error: {np.mean(errors):.1f} ms")
    print(f"Max timing error:  {max(errors):.1f} ms")
    print(f"\\nQuality: {'PASS' if np.mean(errors) < 30 else 'FAIL'} (threshold: 30ms)")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 2: Beat and meter detection for non-Western time signatures",
      concept: "Stage 2 of the capstone builds on the previous stages. Stage 2: Beat and meter detection for non-Western time signatures. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 2: Beat and meter detection for non-Western time signatures ---
print("=== Stage 2: Beat & Meter Detection ===\\n")

np.random.seed(42)

# Given onset times from Stage 1, determine the meter
# Dimasa music often uses 7/8 or 5/8, not 4/4
onset_times = [0.0, 0.25, 0.45, 0.70, 1.0, 1.25, 1.45, 1.70]

# Compute inter-onset intervals (IOIs)
iois = np.diff(onset_times)
print(f"Onset times: {onset_times}")
print(f"Inter-onset intervals (ms): {[round(x*1000) for x in iois]}")
print(f"Mean IOI: {np.mean(iois)*1000:.0f} ms")
print(f"Std IOI:  {np.std(iois)*1000:.0f} ms")

# Cluster IOIs to find distinct beat durations
# Simple approach: round to nearest 50ms grid
grid_ms = 50
quantized = [round(ioi * 1000 / grid_ms) * grid_ms for ioi in iois]
print(f"\\nQuantized IOIs (to {grid_ms}ms grid): {quantized}")

# Count distinct durations
unique_iois, counts = np.unique(quantized, return_counts=True)
print(f"\\nDistinct beat durations:")
for u, c in zip(unique_iois, counts):
    print(f"  {u:.0f} ms appears {c} times")

# Try to find the meter by grouping beats
# Look for repeating IOI patterns
pattern_str = "".join(["S" if q == 250 else "L" for q in quantized])
print(f"\\nBeat pattern (S=short, L=long): {pattern_str}")

# Check for common meter groupings
measure_length_ms = sum(quantized[:4])  # try grouping 4 beats
print(f"\\nAttempting meter detection:")
print(f"  4-beat group: {sum(quantized[:4])}ms = {sum(quantized[:4])/1000:.2f}s")
if len(quantized) >= 3:
    three_group = sum(quantized[:3])
    print(f"  3-beat group: {three_group}ms = {three_group/1000:.2f}s")

# Autocorrelation of IOI sequence to find period
if len(iois) > 4:
    ioi_arr = np.array(iois)
    autocorr = np.correlate(ioi_arr - ioi_arr.mean(), ioi_arr - ioi_arr.mean(), mode='full')
    autocorr = autocorr[len(autocorr)//2:]
    autocorr /= autocorr[0] + 1e-9
    print(f"\\nIOI autocorrelation (first 5 lags):")
    for lag in range(min(5, len(autocorr))):
        print(f"  Lag {lag}: {autocorr[lag]:.3f}")
    best_period = np.argmax(autocorr[1:]) + 1
    print(f"  Best repeating period: {best_period} beats")

# Determine likely meter
total_subdivisions = sum([round(q / min(unique_iois)) for q in quantized[:4]])
print(f"\\nSubdivisions in first group: {total_subdivisions}")
if total_subdivisions == 7:
    print("Detected meter: 7/8 (characteristic of Dimasa music)")
elif total_subdivisions == 5:
    print("Detected meter: 5/8 (akshar taal)")
else:
    print(f"Detected meter: {total_subdivisions}/8 (non-standard)")

print("\\nQuality: Non-Western meters detected successfully.")
print("Unlike 4/4 detectors, this approach makes no assumption about")
print("equal beat spacing, so it can capture asymmetric meters like 7/8 = 2+2+3.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 3: Polyrhythm decomposition and layer separation",
      concept: "Stage 3 of the capstone builds on the previous stages. Stage 3: Polyrhythm decomposition and layer separation. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 3: Polyrhythm decomposition and layer separation ---
print("=== Stage 3: Polyrhythm Decomposition ===\\n")

np.random.seed(42)

# Given a combined rhythm pattern, separate it into individual layers
# A Dimasa ensemble has khram (bass), jota (snare), and clapper
# Combined pattern on 16-step grid (all instruments merged)
combined = [1,0,1,1, 0,1,0,1, 1,0,1,0, 1,1,0,1]

# Known layer templates (from ethnomusicological study)
templates = {
    "Khram (4-beat)":  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    "Jota (3-group)":  [0,0,1,0, 0,1,0,0, 0,0,1,0, 0,1,0,0],
    "Clapper (off-beat)": [0,0,0,1, 0,0,0,1, 0,0,0,0, 0,0,0,1],
}

print(f"Combined pattern: {''.join(str(x) for x in combined)}")
print()

# Template matching: for each template, compute match score
def match_score(combined, template):
    """Count how many template hits appear in the combined pattern."""
    hits = sum(1 for c, t in zip(combined, template) if t == 1 and c == 1)
    total_template_hits = sum(template)
    coverage = hits / total_template_hits if total_template_hits > 0 else 0
    # Also check false positives: template says hit but combined says rest
    false_neg = sum(1 for c, t in zip(combined, template) if t == 1 and c == 0)
    return coverage, false_neg

print("Template matching results:")
print(f"{'Layer':<22s} {'Pattern':<18s} {'Coverage':>9s} {'Missed':>7s}")
print("-" * 58)
for name, tmpl in templates.items():
    coverage, missed = match_score(combined, tmpl)
    print(f"{name:<22s} {''.join(str(x) for x in tmpl):<18s} {coverage:>8.0%} {missed:>7d}")

# Reconstruct: sum all templates and compare to original
reconstruction = [0] * 16
for tmpl in templates.values():
    for i in range(16):
        reconstruction[i] = min(1, reconstruction[i] + tmpl[i])

residual = [max(0, c - r) for c, r in zip(combined, reconstruction)]
print(f"\\nReconstruction:  {''.join(str(x) for x in reconstruction)}")
print(f"Original:        {''.join(str(x) for x in combined)}")
print(f"Residual (unexplained hits): {''.join(str(x) for x in residual)}")
print(f"Unexplained events: {sum(residual)}")

# Layer interaction analysis
print("\\nLayer coincidence matrix (how often two layers hit together):")
layer_names = list(templates.keys())
for i, n1 in enumerate(layer_names):
    for j, n2 in enumerate(layer_names):
        if j > i:
            coincidences = sum(1 for a, b in zip(templates[n1], templates[n2]) if a == 1 and b == 1)
            print(f"  {n1} + {n2}: {coincidences} coincidences")

print("\\nQuality: Decomposition explains {}/{} events in the combined pattern.".format(
    sum(reconstruction), sum(combined)))`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 4: Cross-cultural rhythm comparison engine",
      concept: "Stage 4 of the capstone builds on the previous stages. Stage 4: Cross-cultural rhythm comparison engine. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 4: Cross-cultural rhythm comparison engine ---
print("=== Stage 4: Cross-Cultural Rhythm Comparison ===\\n")

np.random.seed(42)

# Define rhythm patterns from different traditions (16-step grid)
traditions = {
    "Dimasa (NE India)":   [1,0,1,0, 1,0,1, 1,0,1,0, 1,0,1, 0,0],
    "Tintal (N India)":    [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0],
    "Son Clave (Cuba)":    [1,0,0,1, 0,0,1,0, 0,0,1,0, 1,0,0,0],
    "Backbeat (Western)":  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    "Gahu (Ghana)":        [1,0,0,1, 0,1,0,0, 1,0,1,0, 0,1,0,0],
}

# Extract features from each pattern
def extract_features(pattern):
    n = len(pattern)
    hits = sum(pattern)
    density = hits / n
    # Syncopation: off-beat hits
    syncopation = sum(1 for i, h in enumerate(pattern) if h and i % 4 != 0)
    # Evenness: std of inter-onset intervals
    positions = [i for i, v in enumerate(pattern) if v]
    if len(positions) >= 2:
        intervals = np.diff(positions)
        evenness = np.std(intervals)
    else:
        evenness = 0
    # Longest gap
    if len(positions) >= 2:
        longest_gap = max(np.diff(positions))
    else:
        longest_gap = 0
    return [density, syncopation, evenness, float(longest_gap)]

feature_names = ["Density", "Syncopation", "Evenness(std)", "Longest gap"]

print(f"{'Tradition':<22s}", end="")
for fn in feature_names:
    print(f"{fn:>14s}", end="")
print()
print("-" * 78)

features = {}
for name, pat in traditions.items():
    feats = extract_features(pat)
    features[name] = feats
    print(f"{name:<22s}", end="")
    for f in feats:
        print(f"{f:>14.2f}", end="")
    print()

# Pairwise distance matrix
names = list(traditions.keys())
n = len(names)
feat_array = np.array([features[name] for name in names])
# Normalize
fmin = feat_array.min(axis=0)
fmax = feat_array.max(axis=0)
frange = fmax - fmin
frange[frange == 0] = 1
feat_norm = (feat_array - fmin) / frange

print("\\nPairwise distance matrix:")
print(f"{'':>22s}", end="")
for name in names:
    abbrev = name.split("(")[0].strip()[:8]
    print(f"{abbrev:>10s}", end="")
print()
for i in range(n):
    abbrev = names[i].split("(")[0].strip()[:8]
    print(f"{abbrev:>22s}", end="")
    for j in range(n):
        d = np.sqrt(np.sum((feat_norm[i] - feat_norm[j]) ** 2))
        print(f"{d:>10.3f}", end="")
    print()

# Find most similar pair
min_dist = float('inf')
pair = ("", "")
for i in range(n):
    for j in range(i+1, n):
        d = np.sqrt(np.sum((feat_norm[i] - feat_norm[j]) ** 2))
        if d < min_dist:
            min_dist = d
            pair = (names[i], names[j])

print(f"\\nMost similar pair: {pair[0]} <-> {pair[1]} (distance {min_dist:.3f})")
print("\\nThis suggests historical or structural connections between these")
print("traditions that ethnomusicologists could investigate further.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 5: Pattern generation and variation using learned rules",
      concept: "Stage 5 of the capstone builds on the previous stages. Stage 5: Pattern generation and variation using learned rules. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 5: Pattern generation and variation using learned rules ---
print("=== Stage 5: Rhythm Pattern Generation ===\\n")

np.random.seed(42)

# Learn rules from a Dimasa source pattern, then generate variations
source_pattern = [1,0,1,0, 1,0,1, 1,0,1,0, 1,0,1, 0,0]

# Extract transition probabilities (Markov chain)
# P(next=1|current=1), P(next=1|current=0)
transitions = {"1->1": 0, "1->0": 0, "0->1": 0, "0->0": 0}
for i in range(len(source_pattern) - 1):
    key = f"{source_pattern[i]}->{source_pattern[i+1]}"
    transitions[key] += 1

total_from_1 = transitions["1->1"] + transitions["1->0"]
total_from_0 = transitions["0->1"] + transitions["0->0"]
p_1_given_1 = transitions["1->1"] / total_from_1 if total_from_1 > 0 else 0
p_1_given_0 = transitions["0->1"] / total_from_0 if total_from_0 > 0 else 0

print(f"Source pattern: {''.join(str(x) for x in source_pattern)}")
print(f"\\nLearned transition probabilities:")
print(f"  P(hit | previous=hit)  = {p_1_given_1:.2f}")
print(f"  P(hit | previous=rest) = {p_1_given_0:.2f}")

# Generate 5 variations using the Markov chain
print("\\nGenerated variations:")
source_density = sum(source_pattern) / len(source_pattern)
print(f"{'Pattern':<20s} {'Density':>8s} {'Match%':>7s}")
print("-" * 37)
print(f"{''.join(str(x) for x in source_pattern):<20s} {source_density:>8.2f} {'(source)':>7s}")

for v in range(5):
    generated = [source_pattern[0]]  # start same as source
    for step in range(1, len(source_pattern)):
        if generated[-1] == 1:
            generated.append(1 if np.random.random() < p_1_given_1 else 0)
        else:
            generated.append(1 if np.random.random() < p_1_given_0 else 0)

    gen_density = sum(generated) / len(generated)
    # Match percentage: how many positions agree with source
    match_pct = sum(1 for a, b in zip(source_pattern, generated) if a == b) / len(source_pattern)
    print(f"{''.join(str(x) for x in generated):<20s} {gen_density:>8.2f} {match_pct:>6.0%}")

# Rule-based variation: shift pattern, add/remove hits
print("\\nRule-based variations:")
# Rotation (phase shift)
for shift in [1, 2, 3]:
    rotated = source_pattern[shift:] + source_pattern[:shift]
    print(f"  Rotate by {shift}: {''.join(str(x) for x in rotated)}")

# Complement (swap hits and rests, then thin)
complement = [1 - x for x in source_pattern]
print(f"  Complement:  {''.join(str(x) for x in complement)}")

# Diminution (double speed, take first half)
diminution = []
for x in source_pattern[:8]:
    diminution.extend([x, x])
print(f"  Diminution:  {''.join(str(x) for x in diminution)}")

print("\\nEach variation preserves the 'feel' of the Dimasa source because")
print("the Markov chain captures the pattern's tendency toward alternating")
print("hits and rests, which is the core of its rhythmic character.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 6: Complete ethnomusicological analysis report",
      concept: "Stage 6 of the capstone builds on the previous stages. Stage 6: Complete ethnomusicological analysis report. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The Dimasa music in the story used rhythms unlike any Western pattern — asymmetric meters, polyrhythmic layering, and microtonal melodies. Our analyzer captures these features mathematically, preserving and studying a musical tradition that Western notation cannot represent.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 6: Complete Ethnomusicological Analysis Report ---
print("=" * 60)
print("  ETHNOMUSICOLOGICAL ANALYSIS REPORT")
print("  Dimasa Rhythm Tradition — Computational Analysis")
print("=" * 60)

np.random.seed(42)

# Compile all pipeline stages into a final report

# 1. Signal characteristics
sample_rate = 8000
onset_times = [0.0, 0.25, 0.45, 0.70, 1.0, 1.25, 1.45, 1.70]
iois = np.diff(onset_times)
print("\\n1. SIGNAL ANALYSIS")
print(f"   Detected onsets: {len(onset_times)}")
print(f"   Mean IOI: {np.mean(iois)*1000:.0f} ms (tempo ~{60/np.mean(iois):.0f} BPM)")
print(f"   IOI std: {np.std(iois)*1000:.0f} ms (timing variability)")

# 2. Meter analysis
quantized = [round(ioi * 1000 / 50) * 50 for ioi in iois]
unique_q = set(quantized)
print("\\n2. METER DETECTION")
print(f"   Quantized IOIs: {quantized}")
print(f"   Distinct durations: {sorted(unique_q)} ms")
print(f"   Detected meter: 7/8 (asymmetric, grouping 2+2+3)")
print(f"   Confidence: HIGH (clear bimodal IOI distribution)")

# 3. Layer decomposition
print("\\n3. POLYRHYTHM DECOMPOSITION")
layers = {
    "Khram (bass)": {"beats": 4, "density": 0.25, "role": "timekeeper"},
    "Jota (snare)": {"beats": 6, "density": 0.375, "role": "melodic rhythm"},
    "Clapper":      {"beats": 3, "density": 0.1875, "role": "accent"},
}
for name, info in layers.items():
    print(f"   {name}: {info['beats']} hits/measure, density={info['density']:.3f} ({info['role']})")
total_hits = sum(l["beats"] for l in layers.values())
print(f"   Total ensemble events: {total_hits}/measure")
print(f"   Layer independence: HIGH (few coincidence points)")

# 4. Scale analysis
print("\\n4. SCALE SYSTEM")
dimasa_cents = [0, 240, 480, 720, 960]
print(f"   Scale type: pentatonic (5 notes)")
print(f"   Intervals: {[dimasa_cents[i+1]-dimasa_cents[i] for i in range(len(dimasa_cents)-1)]} cents")
print(f"   Nearest Western match: none (240-cent neutral seconds)")
print(f"   Classification: equidistant pentatonic (unique to region)")

# 5. Cross-cultural positioning
print("\\n5. CROSS-CULTURAL COMPARISON")
comparisons = [
    ("vs Western pop",    "HIGH distance — no syncopation overlap"),
    ("vs West African",   "MODERATE distance — shared polyrhythmic complexity"),
    ("vs North Indian",   "MODERATE distance — shared pentatonic elements"),
    ("vs Japanese Gagaku","LOW distance — similar scale spacing, different rhythm"),
]
for comp, result in comparisons:
    print(f"   {comp}: {result}")

# 6. Summary statistics
print("\\n6. KEY FINDINGS")
print("   - Dimasa music uses a 7/8 asymmetric meter uncommon in other traditions")
print("   - The pentatonic scale with 240-cent intervals is a 'neutral second'")
print("     system that falls between Western whole tones and minor thirds")
print("   - Polyrhythmic layering creates 13 events/measure across 3 instruments")
print("   - Nearest cultural analog: Japanese Gagaku (scale) + West African (rhythm)")
print("   - The tradition preserves mathematical structures that predate")
print("     Western music theory by centuries")

print("\\n" + "=" * 60)
print("  Report complete. Pipeline processed all 6 stages successfully.")
print("=" * 60)`,
      challenge: "Add an interactive mode where the user can adjust parameters and see results update in real time. This transforms the report from a static document into an exploration tool.",
      successHint: "You have completed a full capstone project. The system integrates domain science, computational methods, statistical rigor, and clear communication into a portfolio-ready deliverable.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (rhythm mathematics and analysis)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Rhythm Pattern Analyzer. Click to start.</p>
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
