import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function GoldenDeerLevel4() {
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
      title: 'Project design — building a spectral analyzer from scratch',
      concept: `In this capstone project you will build a complete spectral analyzer: a software tool that takes an unknown emission or absorption spectrum and identifies which elements produced it. This is exactly what astronomers, chemists, and environmental scientists do daily — except they use instruments costing tens of thousands of dollars. You will build the algorithm from pure Python.

The architecture has four core components: (1) a spectral database containing reference emission lines for known elements, (2) a signal processing pipeline that cleans noisy input spectra, (3) a peak detection algorithm that finds emission or absorption lines in unknown spectra, and (4) a matching engine that compares detected peaks against the database and ranks candidate elements by match quality.

We will design the system to be modular — each component is an independent function that can be tested and improved separately. The database can grow without changing the matching algorithm. The peak detector can be swapped for a better one without touching the database. This modular design is not just good software engineering; it mirrors how real scientific instruments are built. The spectrometer hardware, calibration software, and analysis software are all separate, interchangeable modules.`,
      analogy: 'Building the spectral analyzer is like building a music recognition app (like Shazam). You need a database of known songs (reference spectra), a way to extract key features from a noisy audio clip (peak detection), and an algorithm to match those features against the database (spectral matching). Each piece is simple; the power comes from combining them.',
      storyConnection: 'If you could capture the golden light of the Kamakhya deer and pass it through a prism, the resulting spectrum would reveal every element in its fur, every mineral in the soil it walked on, every compound in the temple incense it passed through. Your spectral analyzer is the tool that reads that light and translates it into chemistry. You are building the instrument that could decode the deer\'s golden glow.',
      checkQuestion: 'Why is modular design critical for a spectral analyzer? What happens if the peak detector and the database are tightly coupled?',
      checkAnswer: 'If they are tightly coupled, improving the peak detector means rewriting database code, and adding new elements means changing the detector. Modular design means you can upgrade any component independently. Real spectrometers are modular for the same reason — you can swap the detector (CCD vs photomultiplier), change the dispersive element (grating vs prism), or update the software without rebuilding the entire instrument.',
      codeIntro: 'Set up the project skeleton: define the data structures and interfaces for all four components.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# =====================================================
# SPECTRAL ANALYZER - Project Architecture
# =====================================================

class SpectralAnalyzer:
    """
    A complete spectral analysis system with four modules:
    1. Database   - reference spectra for known elements
    2. Processor  - noise filtering and normalization
    3. Detector   - peak finding in spectra
    4. Matcher    - element identification
    """

    def __init__(self):
        self.database = {}       # element -> list of (wavelength, relative_intensity)
        self.tolerance = 2.0     # nm tolerance for peak matching
        self.min_match_score = 0.3  # minimum fraction of lines matched

    def add_element(self, name, lines):
        """Add element with its spectral lines to the database."""
        self.database[name] = sorted(lines, key=lambda x: x[0])

    def preprocess(self, wavelengths, intensities, smooth_width=3):
        """Clean and normalize a raw spectrum."""
        # Moving average smoothing
        kernel = np.ones(smooth_width) / smooth_width
        smoothed = np.convolve(intensities, kernel, mode='same')
        # Normalize to [0, 1]
        mn, mx = smoothed.min(), smoothed.max()
        if mx > mn:
            smoothed = (smoothed - mn) / (mx - mn)
        return smoothed

    def find_peaks(self, wavelengths, intensities, threshold=0.15, min_distance_nm=3):
        """Find peaks in a spectrum above threshold."""
        peaks = []
        for i in range(1, len(intensities) - 1):
            if (intensities[i] > intensities[i-1] and
                intensities[i] > intensities[i+1] and
                intensities[i] > threshold):
                # Check minimum distance from previous peak
                if not peaks or (wavelengths[i] - peaks[-1][0]) > min_distance_nm:
                    peaks.append((wavelengths[i], intensities[i]))
        return peaks

    def match_element(self, detected_peaks, element_name):
        """Score how well detected peaks match a reference element."""
        ref_lines = self.database[element_name]
        if not ref_lines or not detected_peaks:
            return 0.0

        detected_wl = [p[0] for p in detected_peaks]
        matched = 0
        for ref_wl, _ in ref_lines:
            for det_wl in detected_wl:
                if abs(det_wl - ref_wl) <= self.tolerance:
                    matched += 1
                    break
        return matched / len(ref_lines)

    def identify(self, wavelengths, intensities):
        """Full pipeline: preprocess -> detect peaks -> match all elements."""
        clean = self.preprocess(wavelengths, intensities)
        peaks = self.find_peaks(wavelengths, clean)
        results = {}
        for elem in self.database:
            score = self.match_element(peaks, elem)
            if score >= self.min_match_score:
                results[elem] = score
        return sorted(results.items(), key=lambda x: -x[1]), peaks

# --- Demo: create analyzer and show architecture ---
analyzer = SpectralAnalyzer()

# Visualize the architecture
fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Draw module boxes
modules = [
    (0.5, 3, 'SPECTRAL\\nDATABASE', '#3b82f6', 'Reference lines\\nfor known elements'),
    (3.5, 3, 'SIGNAL\\nPROCESSOR', '#22c55e', 'Smoothing,\\nnormalization'),
    (6.5, 3, 'PEAK\\nDETECTOR', '#f59e0b', 'Find emission/\\nabsorption lines'),
    (9.5, 3, 'SPECTRAL\\nMATCHER', '#ef4444', 'Cross-reference\\n& identify'),
]

for x, y, label, color, desc in modules:
    rect = plt.Rectangle((x, y-0.8), 2.2, 1.6, facecolor=color, alpha=0.3,
                          edgecolor=color, linewidth=2, zorder=2)
    ax.add_patch(rect)
    ax.text(x+1.1, y+0.15, label, ha='center', va='center', color='white',
            fontsize=10, fontweight='bold', zorder=3)
    ax.text(x+1.1, y-1.3, desc, ha='center', va='center', color='gray',
            fontsize=8, zorder=3)

# Draw arrows
for x_start, x_end in [(2.7, 3.5), (5.7, 6.5), (8.7, 9.5)]:
    ax.annotate('', xy=(x_end, 3), xytext=(x_start, 3),
                arrowprops=dict(arrowstyle='->', color='#fbbf24', lw=2))

# Input/output labels
ax.text(0.5, 4.5, 'INPUT:\\nUnknown spectrum', color='#a855f7', fontsize=10, fontweight='bold')
ax.text(9.5, 4.5, 'OUTPUT:\\nElement IDs + confidence', color='#a855f7', fontsize=10, fontweight='bold')

ax.set_xlim(-0.5, 12.5)
ax.set_ylim(0.5, 5.5)
ax.set_title('Spectral Analyzer Architecture', color='white', fontsize=14, fontweight='bold')
ax.axis('off')

plt.tight_layout()
plt.show()

print("Spectral Analyzer - Project Architecture")
print("=" * 50)
print()
print("Module 1: Spectral Database")
print("  - Stores reference emission lines for each element")
print("  - Format: element -> [(wavelength, intensity), ...]")
print("  - Easily extensible: add_element() method")
print()
print("Module 2: Signal Processor")
print("  - Moving average smoothing (configurable width)")
print("  - Min-max normalization to [0, 1]")
print("  - Handles noisy real-world input")
print()
print("Module 3: Peak Detector")
print("  - Local maximum detection with threshold")
print("  - Minimum distance filter (avoids double-counting)")
print("  - Returns (wavelength, intensity) pairs")
print()
print("Module 4: Spectral Matcher")
print("  - Compares detected peaks to reference lines")
print("  - Tolerance-based matching (default: \u00b12nm)")
print("  - Returns ranked list of candidate elements")
print()
print("Full pipeline: identify(wavelengths, intensities)")
print("  preprocess -> find_peaks -> match_element (for each) -> rank")
print()
print("This is the same architecture used in real spectrometers.")
print("The code is ready -- we build each module in the next lessons.")`,
      challenge: 'Extend the SpectralAnalyzer class with a method to export/import the database as a JSON string. This would let you save and load databases between sessions.',
      successHint: 'Good architecture saves you from rewriting everything when requirements change. The modular design means each of the next five lessons improves one component without breaking the others. This is how real scientific software is built.',
    },
    {
      title: 'Building a spectral database — reference spectra for common elements',
      concept: `The database is the foundation of any spectral analyzer. Without accurate reference data, even the best peak detector and matching algorithm are useless. Real spectral databases like NIST's Atomic Spectra Database contain millions of lines for thousands of elements and ions. We will build a curated subset: the strongest visible emission lines for elements commonly found in stars, minerals, and laboratory experiments.

Each element entry contains a list of (wavelength, relative_intensity) tuples. The wavelength is in nanometers, and the intensity is normalized so the strongest line is 1.0. Relative intensities matter because not all lines are equally strong — hydrogen's H-alpha line at 656.3nm is much brighter than its H-delta at 410.2nm. A good matcher should weight strong lines more heavily than weak ones.

We also need to handle practical challenges. Real spectral lines have width (they are not infinitely sharp) due to thermal broadening, pressure broadening, and the instrument's own resolution. Two lines from different elements might overlap if they are closer than the instrument's resolution. Our database should store not just line positions but also typical line widths, so the matcher can account for blending.`,
      analogy: 'The spectral database is like a fingerprint database at a crime lab. Each person (element) has a unique fingerprint (emission pattern). The database stores high-quality reference prints. When you find a partial print at a crime scene (noisy spectrum), you compare it against every reference. The more points of similarity, the more confident the match. Quality of the reference prints determines how well the system works.',
      storyConnection: 'The golden light of the Kamakhya deer contains the spectral fingerprints of every element it interacts with. Sodium from salt deposits produces the 589nm yellow glow. Calcium in bones and antlers shows lines at 393nm and 397nm. Iron in blood has lines scattered across the visible spectrum. Building the database is building the dictionary that lets us read the deer\'s golden light as chemistry.',
      checkQuestion: 'Two elements each have a line near 589nm (sodium at 589.0nm and an unknown at 590.5nm). Your instrument has 2nm resolution. Can you distinguish them?',
      checkAnswer: 'No. With 2nm resolution, any two lines within 2nm appear as a single blended feature. The sodium doublet (589.0 and 589.6nm) would also be unresolved. You would need better resolution (< 1.5nm) to separate 589.0 from 590.5. This is why the tolerance parameter in our matcher must match the instrument resolution — claiming a match within tolerance is only valid if the instrument can actually resolve the lines.',
      codeIntro: 'Build a comprehensive spectral database with real emission lines and visualize each element\'s spectral fingerprint.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# =====================================================
# SPECTRAL DATABASE - Real emission lines (visible range)
# Format: (wavelength_nm, relative_intensity)
# Data sourced from NIST Atomic Spectra Database
# =====================================================

spectral_database = {
    'Hydrogen': [
        (410.2, 0.15),   # H-delta
        (434.0, 0.25),   # H-gamma
        (486.1, 0.50),   # H-beta
        (656.3, 1.00),   # H-alpha (strongest)
    ],
    'Helium': [
        (388.9, 0.20),
        (447.1, 0.30),
        (471.3, 0.15),
        (492.2, 0.20),
        (501.6, 0.25),
        (587.6, 1.00),   # strongest He line
        (667.8, 0.35),
        (706.5, 0.25),
    ],
    'Sodium': [
        (589.0, 1.00),   # D1 line
        (589.6, 0.85),   # D2 line
        (568.8, 0.10),
        (615.4, 0.05),
    ],
    'Calcium': [
        (393.4, 1.00),   # Ca K
        (396.8, 0.85),   # Ca H
        (422.7, 0.60),
        (443.5, 0.15),
        (445.5, 0.12),
        (527.0, 0.20),
        (616.2, 0.10),
    ],
    'Iron': [
        (382.0, 0.45),
        (385.9, 0.50),
        (404.6, 0.40),
        (438.4, 0.55),
        (466.8, 0.30),
        (495.8, 0.35),
        (516.7, 0.60),
        (527.0, 0.45),
        (532.8, 1.00),
        (537.1, 0.40),
        (561.6, 0.25),
    ],
    'Neon': [
        (585.2, 0.50),
        (588.2, 0.40),
        (603.0, 0.45),
        (607.4, 0.35),
        (616.4, 0.55),
        (621.7, 0.30),
        (626.6, 0.40),
        (633.4, 0.65),
        (640.2, 1.00),
        (650.6, 0.55),
        (659.9, 0.35),
    ],
    'Mercury': [
        (404.7, 0.70),
        (435.8, 1.00),
        (546.1, 0.85),
        (577.0, 0.50),
        (579.1, 0.45),
    ],
    'Lithium': [
        (460.3, 0.10),
        (610.4, 0.20),
        (670.8, 1.00),   # strong red line
    ],
}

def wavelength_to_rgb(w):
    if 380 <= w < 440:
        r, g, b = -(w-440)/60, 0.0, 1.0
    elif 440 <= w < 490:
        r, g, b = 0.0, (w-440)/50, 1.0
    elif 490 <= w < 510:
        r, g, b = 0.0, 1.0, -(w-510)/20
    elif 510 <= w < 580:
        r, g, b = (w-510)/70, 1.0, 0.0
    elif 580 <= w < 645:
        r, g, b = 1.0, -(w-645)/65, 0.0
    elif 645 <= w <= 750:
        r, g, b = 1.0, 0.0, 0.0
    else:
        r, g, b = 0.3, 0.3, 0.3
    return (r, g, b)

# Visualize the database
n_elements = len(spectral_database)
fig, axes = plt.subplots(n_elements, 1, figsize=(12, 2.2 * n_elements))
fig.patch.set_facecolor('#1f2937')

for ax, (element, lines) in zip(axes, spectral_database.items()):
    ax.set_facecolor('#111827')
    ax.set_xlim(370, 720)

    for wl, intensity in lines:
        color = wavelength_to_rgb(wl)
        ax.axvline(wl, color=color, linewidth=2 + 3*intensity, alpha=0.6 + 0.4*intensity)
        ax.axvline(wl, color=color, linewidth=8*intensity, alpha=0.15)

    ax.set_title(f'{element} ({len(lines)} lines)', color='white', fontsize=10,
                 fontweight='bold', loc='left')
    ax.set_yticks([])
    ax.tick_params(colors='gray', labelsize=7)

    # Subtle visible background
    for w in range(380, 750):
        ax.axvspan(w, w+1, alpha=0.02, color=wavelength_to_rgb(w))

axes[-1].set_xlabel('Wavelength (nm)', color='white', fontsize=10)
fig.suptitle('Spectral Database: Element Fingerprints', color='white',
             fontsize=14, fontweight='bold', y=1.01)

plt.tight_layout()
plt.show()

# Database statistics
print("Spectral Database Summary")
print("=" * 55)
print(f"{'Element':<12} {'Lines':>6} {'Range (nm)':>14} {'Strongest':>12}")
print("-" * 55)
total_lines = 0
for element, lines in spectral_database.items():
    wls = [l[0] for l in lines]
    strongest_wl = max(lines, key=lambda x: x[1])[0]
    total_lines += len(lines)
    print(f"{element:<12} {len(lines):>6} {min(wls):>6.1f}-{max(wls):.1f}  {strongest_wl:>8.1f} nm")

print("-" * 55)
print(f"{'TOTAL':<12} {total_lines:>6} lines across {len(spectral_database)} elements")

# Check for potential line overlaps
print("\\nPotential line overlaps (within 3nm):")
all_lines = []
for elem, lines in spectral_database.items():
    for wl, _ in lines:
        all_lines.append((wl, elem))
all_lines.sort()

for i in range(len(all_lines)-1):
    if all_lines[i+1][0] - all_lines[i][0] < 3.0:
        w1, e1 = all_lines[i]
        w2, e2 = all_lines[i+1]
        if e1 != e2:
            print(f"  {e1} {w1:.1f}nm <-> {e2} {w2:.1f}nm (gap: {w2-w1:.1f}nm)")

print()
print("Overlaps are where identification gets tricky.")
print("Our matcher will need to consider ALL matched lines,")
print("not just one, to resolve ambiguous cases.")`,
      challenge: 'Add three more elements to the database: Potassium (K), Strontium (Sr), and Barium (Ba). Look up their visible emission lines from the NIST database. Then check for new overlaps with existing entries.',
      successHint: 'A spectral database is only as good as its data. Real spectroscopy labs spend years curating and verifying their reference spectra. The database you built here, while simplified, follows the same principles as NIST\'s world-standard Atomic Spectra Database.',
    },
    {
      title: 'Peak detection algorithm — finding emission lines in noisy data',
      concept: `Real spectra are noisy. Detector noise, thermal fluctuations, stray light, and cosmic rays all add random signals on top of the true spectral lines. A peak detection algorithm must find the real emission or absorption lines while ignoring noise spikes. This is a fundamental signal processing problem that appears everywhere — from ECG heartbeat detection to audio pitch tracking.

Our approach uses three strategies layered together. First, smoothing: a moving average or Savitzky-Golay filter reduces high-frequency noise while preserving the broader spectral peaks. Second, thresholding: we only consider peaks above a minimum intensity, eliminating low-amplitude noise. Third, minimum distance: real emission lines from a single element are rarely closer than a few nanometers, so we reject peaks that are too close together (likely noise artifacts or detector glitches).

More sophisticated peak detectors use the second derivative (peaks are where d\u00b2I/d\u03bb\u00b2 is most negative), wavelet transforms, or matched filtering (correlating with an expected peak shape). But the simple three-strategy approach works remarkably well for clean-to-moderate noise levels and teaches the core concepts. The key insight is that peak detection is always a tradeoff: lower thresholds catch weak real lines but also catch more noise (false positives); higher thresholds miss weak lines (false negatives) but have fewer false detections.`,
      analogy: 'Peak detection in a noisy spectrum is like spotting mountain peaks from a bumpy airplane. The big peaks (strong emission lines) are obvious even through turbulence. But are those small bumps real hills or just air pockets? You smooth out the turbulence first (filtering), ignore anything below the cloud layer (threshold), and require peaks to be separated by at least a few kilometers (minimum distance). The result is a reliable list of actual mountains.',
      storyConnection: 'Imagine trying to see the golden deer through thick monsoon fog. The deer\'s golden glow is the real signal; the fog scatter is noise. Your eyes naturally smooth the scene (averaging over time), ignore dim patches (threshold), and expect the deer to be a single coherent shape (spatial filtering). Peak detection applies the same strategies to spectral data — finding the golden signal through the noise.',
      checkQuestion: 'You lower the peak detection threshold and suddenly detect 50 peaks instead of 8. Are you now more or less confident in your results?',
      checkAnswer: 'Less confident. Most elements have only 5-15 strong visible lines. Detecting 50 peaks means most are noise artifacts (false positives). The threshold was too low. The right approach is to start with a higher threshold, confirm strong peaks, then carefully lower it to find weaker real lines while monitoring the false positive rate. Peak detection always involves this sensitivity vs specificity tradeoff.',
      codeIntro: 'Implement a peak detector with smoothing, thresholding, and minimum distance filtering. Test it on a noisy synthetic spectrum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate a synthetic noisy spectrum with known peaks
wavelengths = np.linspace(380, 750, 2000)

# True emission lines (hydrogen + sodium)
true_lines = [
    (410.2, 0.15, 1.5),  # (center, amplitude, width_nm)
    (434.0, 0.25, 1.5),
    (486.1, 0.50, 2.0),
    (589.0, 0.90, 1.8),
    (589.6, 0.75, 1.8),
    (656.3, 1.00, 2.0),
]

# Build clean spectrum
clean = np.zeros_like(wavelengths)
for center, amp, width in true_lines:
    clean += amp * np.exp(-0.5 * ((wavelengths - center) / width) ** 2)

# Add noise at different levels
noise_levels = [0.02, 0.08, 0.20]
noisy_spectra = {}
for noise in noise_levels:
    noisy_spectra[noise] = clean + noise * np.random.randn(len(wavelengths))

# =====================================================
# PEAK DETECTION ALGORITHM
# =====================================================

def smooth_spectrum(intensities, width=5):
    """Moving average smoothing."""
    kernel = np.ones(width) / width
    return np.convolve(intensities, kernel, mode='same')

def detect_peaks(wavelengths, intensities, threshold=0.1, min_distance_nm=4.0, smooth_width=5):
    """
    Find peaks in a spectrum.
    1. Smooth to reduce noise
    2. Find local maxima above threshold
    3. Enforce minimum distance between peaks
    """
    # Step 1: Smooth
    smoothed = smooth_spectrum(intensities, smooth_width)

    # Normalize
    mn, mx = smoothed.min(), smoothed.max()
    if mx > mn:
        smoothed = (smoothed - mn) / (mx - mn)

    # Step 2: Find local maxima above threshold
    candidates = []
    for i in range(2, len(smoothed) - 2):
        if (smoothed[i] > smoothed[i-1] and
            smoothed[i] > smoothed[i+1] and
            smoothed[i] > smoothed[i-2] and
            smoothed[i] > smoothed[i+2] and
            smoothed[i] > threshold):
            candidates.append((wavelengths[i], smoothed[i]))

    # Step 3: Enforce minimum distance (keep stronger peak)
    if not candidates:
        return [], smoothed

    peaks = [candidates[0]]
    for wl, intensity in candidates[1:]:
        if wl - peaks[-1][0] > min_distance_nm:
            peaks.append((wl, intensity))
        elif intensity > peaks[-1][1]:
            peaks[-1] = (wl, intensity)

    return peaks, smoothed

# Run peak detection on all noise levels
fig, axes = plt.subplots(len(noise_levels) + 1, 1, figsize=(12, 12))
fig.patch.set_facecolor('#1f2937')

# Plot clean spectrum
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(wavelengths, clean, color='#22c55e', linewidth=1.5, label='Clean signal')
for center, amp, _ in true_lines:
    ax.plot(center, amp, 'v', color='#fbbf24', markersize=10)
    ax.annotate(f'{center:.1f}', xy=(center, amp), xytext=(center, amp+0.08),
                color='#fbbf24', fontsize=8, ha='center')
ax.set_title('Clean Spectrum (ground truth: 6 lines)', color='white', fontsize=11)
ax.set_ylabel('Intensity', color='white')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot noisy spectra with detection results
for idx, noise in enumerate(noise_levels):
    ax = axes[idx + 1]
    ax.set_facecolor('#111827')

    noisy = noisy_spectra[noise]
    peaks, smoothed = detect_peaks(wavelengths, noisy, threshold=0.15, min_distance_nm=5)

    ax.plot(wavelengths, noisy, color='gray', linewidth=0.3, alpha=0.5, label='Noisy')
    ax.plot(wavelengths, smoothed * (noisy.max() - noisy.min()) + noisy.min(),
            color='#3b82f6', linewidth=1.5, label='Smoothed')

    # Mark detected peaks
    for wl, intensity in peaks:
        ax.axvline(wl, color='#ef4444', linewidth=1, linestyle='--', alpha=0.6)
        ax.plot(wl, intensity * (noisy.max() - noisy.min()) + noisy.min(),
                'v', color='#ef4444', markersize=8)

    # Mark true peaks for comparison
    for center, amp, _ in true_lines:
        ax.plot(center, amp, '^', color='#22c55e', markersize=6, alpha=0.7)

    n_true = len(true_lines)
    n_detected = len(peaks)
    # Count correct detections (within 5nm of a true line)
    correct = sum(1 for wl, _ in peaks
                  if any(abs(wl - tl[0]) < 5 for tl in true_lines))
    false_pos = n_detected - correct
    missed = n_true - correct

    ax.set_title(f'Noise={noise:.0%} | Detected: {n_detected} '
                 f'(correct: {correct}, false+: {false_pos}, missed: {missed})',
                 color='white', fontsize=10)
    ax.set_ylabel('Intensity', color='white')
    ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper right')
    ax.tick_params(colors='gray')

axes[-1].set_xlabel('Wavelength (nm)', color='white')

plt.tight_layout()
plt.show()

# Detection performance analysis
print("Peak Detection Performance Analysis")
print("=" * 55)
print(f"{'Noise':<10} {'Detected':>10} {'Correct':>10} {'False+':>10} {'Missed':>10}")
print("-" * 55)
for noise in noise_levels:
    noisy = noisy_spectra[noise]
    peaks, _ = detect_peaks(wavelengths, noisy, threshold=0.15, min_distance_nm=5)
    n_detected = len(peaks)
    correct = sum(1 for wl, _ in peaks
                  if any(abs(wl - tl[0]) < 5 for tl in true_lines))
    print(f"{noise:<10.0%} {n_detected:>10} {correct:>10} "
          f"{n_detected-correct:>10} {len(true_lines)-correct:>10}")

print()
print("True lines: ", [f"{l[0]:.1f}nm" for l in true_lines])
print()
print("Key insight: as noise increases, weak lines get lost first.")
print("The H-alpha (656.3nm) and Na D (589.0nm) survive high noise")
print("because they\'re the strongest lines. Weak lines like H-delta")
print("(410.2nm, intensity=0.15) vanish into the noise floor.")
print()
print("This is why astronomers need dark skies and long exposures:")
print("reducing noise reveals weaker spectral lines.")`,
      challenge: 'Implement a second-derivative peak detector: compute d\u00b2I/d\u03bb\u00b2 using np.diff twice, and find where it is most negative (peak centers). Compare its performance to the local-maximum approach at high noise levels.',
      successHint: 'Peak detection is where signal processing meets the real world. Every detection system in science faces the same fundamental tradeoff between sensitivity (catching weak signals) and specificity (rejecting noise). Tuning the threshold is not a one-time decision — it depends on the noise level and the question you are asking.',
    },
    {
      title: 'Spectral matching — cross-referencing unknown spectra against the database',
      concept: `With a database of reference spectra and a peak detector in hand, the matching engine ties everything together. Given a set of detected peaks from an unknown sample, it compares them against every element in the database and computes a match score. The element(s) with the highest scores are the most likely constituents of the sample.

The simplest matching metric is the fraction of reference lines matched: for each element, count how many of its reference lines have a detected peak within the tolerance window, then divide by the total number of reference lines. If 4 out of 5 sodium lines match, the score is 0.80. But this naive approach has a problem: an element with only 2 reference lines might score 1.0 (both matched) purely by coincidence with noise peaks. A weighted scoring system solves this: weight each matched line by its reference intensity (strong lines matter more) and penalize unmatched detected peaks (which suggest contamination or misidentification).

Real spectral matching also considers line ratios. If hydrogen's H-alpha is detected 10x stronger than H-beta, and the reference says it should be 2x stronger, something is off — maybe the sample is optically thick, or there is contamination at the H-alpha wavelength. Advanced matchers use chi-squared fitting against the full spectral shape, not just peak positions. But even our simple peak-matching approach works well for clean spectra with well-separated elements.`,
      analogy: 'Spectral matching is like a detective matching partial fingerprints at a crime scene. You find 12 ridge points in the unknown print and compare against a database of millions. A match is not all-or-nothing — you score how many ridge points align within tolerance, weighted by how distinctive each point is. More matching points = higher confidence. And you must account for smudges (noise) and overlapping prints (mixed elements).',
      storyConnection: 'If the golden deer of Kamakhya left behind a glowing hoofprint — a spectrum of light — the matching engine would decode it. The 589nm sodium line from salt-lick minerals, the 656nm hydrogen line from water vapor in the deer\'s breath, the iron lines from laterite soil. Each element leaves its fingerprint in the light, and the matcher reads them all simultaneously, untangling the golden glow into its chemical ingredients.',
      checkQuestion: 'An unknown spectrum has peaks at 589.2nm and 656.1nm. Both hydrogen (656.3nm) and sodium (589.0nm) are in the database. The matcher reports sodium=50% and hydrogen=25%. Why is sodium ranked higher despite both having one line matched?',
      checkAnswer: 'Sodium has 4 reference lines in our database, and 1 matched, giving 1/4 = 25%. Wait — if sodium scores 50%, perhaps 2 of its 4 lines matched. Hydrogen has 4 Balmer lines and 1 matched = 25%. The ranking depends on the fraction of reference lines matched. If the matcher uses weighted scoring with intensity weights, the strong Na D line (intensity 1.0) contributes more than a weaker hydrogen line. The exact scores depend on the weighting scheme.',
      codeIntro: 'Build the complete matching engine with weighted scoring and test it on synthetic mixed-element spectra.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Full spectral database
spectral_database = {
    'Hydrogen': [(410.2, 0.15), (434.0, 0.25), (486.1, 0.50), (656.3, 1.00)],
    'Helium': [(388.9, 0.20), (447.1, 0.30), (501.6, 0.25), (587.6, 1.00), (667.8, 0.35), (706.5, 0.25)],
    'Sodium': [(568.8, 0.10), (589.0, 1.00), (589.6, 0.85), (615.4, 0.05)],
    'Calcium': [(393.4, 1.00), (396.8, 0.85), (422.7, 0.60), (527.0, 0.20)],
    'Iron': [(382.0, 0.45), (385.9, 0.50), (438.4, 0.55), (516.7, 0.60), (532.8, 1.00), (537.1, 0.40)],
    'Neon': [(585.2, 0.50), (603.0, 0.45), (616.4, 0.55), (633.4, 0.65), (640.2, 1.00), (650.6, 0.55)],
    'Mercury': [(404.7, 0.70), (435.8, 1.00), (546.1, 0.85), (577.0, 0.50), (579.1, 0.45)],
    'Lithium': [(460.3, 0.10), (610.4, 0.20), (670.8, 1.00)],
}

def weighted_match_score(detected_peaks, ref_lines, tolerance=2.5):
    """
    Compute weighted match score.
    - Each matched reference line contributes its relative intensity to the score
    - Normalized by total reference intensity
    - Penalizes unmatched detected peaks slightly
    """
    if not ref_lines or not detected_peaks:
        return 0.0, []

    det_wl = [p[0] for p in detected_peaks]
    total_ref_weight = sum(intensity for _, intensity in ref_lines)
    matched_weight = 0.0
    matched_pairs = []

    for ref_wl, ref_int in ref_lines:
        best_dist = float('inf')
        best_det = None
        for d_wl in det_wl:
            dist = abs(d_wl - ref_wl)
            if dist < best_dist:
                best_dist = dist
                best_det = d_wl
        if best_dist <= tolerance:
            matched_weight += ref_int
            matched_pairs.append((ref_wl, best_det, best_dist))

    # Base score: fraction of reference intensity matched
    score = matched_weight / total_ref_weight if total_ref_weight > 0 else 0

    # Penalty for many unmatched detected peaks (suggests contamination)
    n_unmatched = len(detected_peaks) - len(matched_pairs)
    if len(detected_peaks) > 0:
        penalty = 0.1 * (n_unmatched / len(detected_peaks))
        score = max(0, score - penalty)

    return score, matched_pairs

def identify_elements(detected_peaks, database, tolerance=2.5, min_score=0.2):
    """Identify elements from detected peaks."""
    results = []
    for element, ref_lines in database.items():
        score, matches = weighted_match_score(detected_peaks, ref_lines, tolerance)
        if score >= min_score:
            results.append({
                'element': element,
                'score': score,
                'matches': matches,
                'ref_lines': len(ref_lines),
                'matched_lines': len(matches),
            })
    return sorted(results, key=lambda x: -x['score'])

# =====================================================
# TEST CASES
# =====================================================

# Test 1: Pure hydrogen spectrum
hydrogen_peaks = [(410.5, 0.14), (434.2, 0.24), (486.3, 0.48), (656.1, 0.98)]

# Test 2: Mixed hydrogen + sodium (like a star with sodium in atmosphere)
mixed_peaks = [(410.5, 0.14), (434.2, 0.24), (486.3, 0.48),
               (589.1, 0.92), (589.8, 0.78), (656.1, 0.98)]

# Test 3: "Golden deer" spectrum - sodium + calcium + iron (minerals)
golden_peaks = [(393.6, 0.88), (396.9, 0.73), (422.5, 0.52),
                (532.6, 0.85), (537.3, 0.35), (589.1, 0.95), (589.7, 0.80)]

test_cases = [
    ('Pure Hydrogen', hydrogen_peaks),
    ('Hydrogen + Sodium (stellar)', mixed_peaks),
    ('Golden Deer Spectrum (Na+Ca+Fe)', golden_peaks),
]

fig, axes = plt.subplots(len(test_cases), 1, figsize=(12, 4 * len(test_cases)))
fig.patch.set_facecolor('#1f2937')

def wavelength_to_rgb(w):
    if 380 <= w < 440: return (-(w-440)/60, 0.0, 1.0)
    elif 440 <= w < 490: return (0.0, (w-440)/50, 1.0)
    elif 490 <= w < 510: return (0.0, 1.0, -(w-510)/20)
    elif 510 <= w < 580: return ((w-510)/70, 1.0, 0.0)
    elif 580 <= w < 645: return (1.0, -(w-645)/65, 0.0)
    elif 645 <= w <= 750: return (1.0, 0.0, 0.0)
    return (0.3, 0.3, 0.3)

for ax, (name, peaks) in zip(axes, test_cases):
    ax.set_facecolor('#111827')
    ax.set_xlim(370, 720)

    # Draw detected peaks
    for wl, intensity in peaks:
        color = wavelength_to_rgb(wl)
        ax.axvline(wl, color=color, linewidth=3*intensity, alpha=0.8)
        ax.axvline(wl, color=color, linewidth=10*intensity, alpha=0.15)

    # Run identification
    results = identify_elements(peaks, spectral_database)

    # Build result string
    result_str = ' | '.join(f"{r['element']}: {r['score']:.0%} ({r['matched_lines']}/{r['ref_lines']})"
                           for r in results[:4])
    ax.set_title(f'{name}', color='white', fontsize=12, fontweight='bold')
    ax.text(0.5, -0.15, f'Matches: {result_str}', transform=ax.transAxes,
            ha='center', color='#22c55e', fontsize=9, fontweight='bold')
    ax.set_yticks([])
    ax.tick_params(colors='gray')

    # Visible background
    for w in range(380, 750):
        ax.axvspan(w, w+1, alpha=0.02, color=wavelength_to_rgb(w))

axes[-1].set_xlabel('Wavelength (nm)', color='white')
fig.suptitle('Spectral Matching Results', color='white', fontsize=14, fontweight='bold')

plt.tight_layout()
plt.show()

# Detailed results
for name, peaks in test_cases:
    results = identify_elements(peaks, spectral_database)
    print(f"\\n{'='*55}")
    print(f"Test: {name}")
    print(f"Detected peaks: {len(peaks)}")
    print(f"{'='*55}")
    for r in results:
        print(f"  {r['element']:<12} Score: {r['score']:.2%} "
              f"({r['matched_lines']}/{r['ref_lines']} lines matched)")
        for ref_wl, det_wl, dist in r['matches']:
            print(f"    ref {ref_wl:.1f}nm <-> det {det_wl:.1f}nm (off by {dist:.1f}nm)")
    if not results:
        print("  No matches above threshold")

print()
print("The Golden Deer spectrum matches:")
print("  Sodium (Na) -- golden 589nm glow from mineral salts")
print("  Calcium (Ca) -- from bones, antlers, limestone soil")
print("  Iron (Fe) -- from laterite soil of Assam's red hills")
print("Each element confirmed by multiple matching spectral lines.")`,
      challenge: 'Add a "confusion matrix" analysis: for each element in the database, generate its pure spectrum (with noise), run identification, and check if the correct element ranks first. Compute the overall accuracy across all elements.',
      successHint: 'Spectral matching is pattern recognition at its most elegant. The weighted scoring handles the fact that not all evidence is equally strong — a match on a bright, distinctive line is worth more than a match on a faint one. This same weighted-evidence principle underlies forensic science, medical diagnosis, and machine learning classifiers.',
    },
    {
      title: 'Interactive spectrum viewer — visualization with element identification',
      concept: `A spectral analyzer is only useful if its results are interpretable. Visualization transforms raw numbers into understanding. The best scientific visualizations do three things simultaneously: show the data (the observed spectrum), show the analysis (detected peaks and matched elements), and show the context (reference lines and confidence levels).

Our interactive spectrum viewer will display the unknown spectrum with detected peaks annotated, overlay matched reference lines from identified elements using color-coded markers, and present a confidence bar chart showing match scores. The viewer should make it immediately obvious which elements are present and how confident the identification is.

Good scientific visualization follows principles from Edward Tufte: maximize the data-to-ink ratio (every visual element should convey information), avoid chartjunk (decorations that do not encode data), and use small multiples (repeated panels) to enable comparison. Our viewer uses color to encode element identity, line thickness to encode intensity, and spatial position (wavelength axis) to encode the fundamental physical quantity. Every pixel carries information.`,
      analogy: 'The spectrum viewer is like a detective\'s evidence board. The spectrum itself is the crime scene photo. The detected peaks are pins marking key evidence. The color-coded element identifications are threads connecting evidence to suspects. And the confidence bar chart is the detective\'s ranking of suspects. One glance at the board tells the whole story.',
      storyConnection: 'Imagine the spectrum viewer as a magical lens that lets you see the chemistry of the golden deer\'s glow. Point it at the deer, and the screen lights up: sodium highlighted in yellow, calcium in violet, iron in blue — each element tagged, each spectral line labeled. The ancient temple priests sensed the golden light was special. Your viewer proves it, breaking the glow into its elemental ingredients with quantified confidence.',
      checkQuestion: 'Your viewer shows a strong match for sodium (85%) and a weaker match for neon (35%) in the same spectrum. The sodium D line (589.0nm) and a neon line (585.2nm) are only 4nm apart. How should the viewer communicate this potential ambiguity?',
      checkAnswer: 'The viewer should highlight the 585-590nm region as an overlap zone and show both reference lines with their respective element colors. A tooltip or annotation should note that both elements have lines in this region. The confidence difference (85% vs 35%) already suggests sodium is more likely, but the viewer should let the user see exactly which lines contribute to each score. Transparency about ambiguity is essential in scientific visualization.',
      codeIntro: 'Build a comprehensive spectrum viewer with element identification overlays, confidence bars, and a residual panel.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

np.random.seed(42)

# Full database
db = {
    'Hydrogen': [(410.2, 0.15), (434.0, 0.25), (486.1, 0.50), (656.3, 1.00)],
    'Sodium':   [(568.8, 0.10), (589.0, 1.00), (589.6, 0.85), (615.4, 0.05)],
    'Calcium':  [(393.4, 1.00), (396.8, 0.85), (422.7, 0.60), (527.0, 0.20)],
    'Iron':     [(382.0, 0.45), (385.9, 0.50), (438.4, 0.55), (516.7, 0.60), (532.8, 1.00), (537.1, 0.40)],
    'Mercury':  [(404.7, 0.70), (435.8, 1.00), (546.1, 0.85), (577.0, 0.50), (579.1, 0.45)],
}

elem_colors = {
    'Hydrogen': '#ef4444',
    'Sodium':   '#f59e0b',
    'Calcium':  '#a855f7',
    'Iron':     '#3b82f6',
    'Mercury':  '#22c55e',
}

# Generate a "golden deer" spectrum: Na + Ca + Fe + some H
wavelengths = np.linspace(370, 720, 3000)
true_spectrum = np.zeros_like(wavelengths)
sample_elements = {
    'Sodium': 0.9,
    'Calcium': 0.7,
    'Iron': 0.6,
    'Hydrogen': 0.3,
}

for elem, strength in sample_elements.items():
    for wl, intensity in db[elem]:
        true_spectrum += strength * intensity * np.exp(-0.5 * ((wavelengths - wl) / 1.5) ** 2)

# Add continuum background + noise
continuum = 0.05 + 0.03 * np.sin(2 * np.pi * (wavelengths - 400) / 300)
observed = true_spectrum + continuum + 0.04 * np.random.randn(len(wavelengths))
observed = np.maximum(observed, 0)

# Peak detection
def smooth(y, w=7):
    return np.convolve(y, np.ones(w)/w, mode='same')

def find_peaks(wl, intensity, threshold=0.08, min_dist=4):
    s = smooth(intensity)
    s = (s - s.min()) / (s.max() - s.min())
    peaks = []
    for i in range(2, len(s)-2):
        if (s[i] > s[i-1] and s[i] > s[i+1] and
            s[i] > s[i-2] and s[i] > s[i+2] and s[i] > threshold):
            if not peaks or (wl[i] - peaks[-1][0]) > min_dist:
                peaks.append((wl[i], s[i]))
            elif s[i] > peaks[-1][1]:
                peaks[-1] = (wl[i], s[i])
    return peaks

def match_elements(peaks, database, tol=3.0, min_score=0.2):
    results = {}
    for elem, lines in database.items():
        total_w = sum(i for _, i in lines)
        matched_w = 0
        matches = []
        for rw, ri in lines:
            for pw, pi in peaks:
                if abs(pw - rw) <= tol:
                    matched_w += ri
                    matches.append((rw, pw))
                    break
        score = matched_w / total_w if total_w > 0 else 0
        if score >= min_score:
            results[elem] = {'score': score, 'matches': matches,
                            'total': len(lines), 'matched': len(matches)}
    return dict(sorted(results.items(), key=lambda x: -x[1]['score']))

detected = find_peaks(wavelengths, observed)
matches = match_elements(detected, db)

# =====================================================
# COMPREHENSIVE SPECTRUM VIEWER
# =====================================================

fig = plt.figure(figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')

# Layout: spectrum (top, big), element overlays (middle), confidence bars (bottom)
gs = fig.add_gridspec(4, 1, height_ratios=[3, 1.5, 1, 1.5], hspace=0.35)

# --- Panel 1: Main spectrum with peak annotations ---
ax1 = fig.add_subplot(gs[0])
ax1.set_facecolor('#111827')
ax1.plot(wavelengths, observed, color='white', linewidth=0.6, alpha=0.7, label='Observed')
ax1.plot(wavelengths, smooth(observed, 11), color='#f59e0b', linewidth=1.5, label='Smoothed')

# Mark detected peaks
for wl, intensity in detected:
    # Find which element this peak matches
    peak_color = 'gray'
    peak_label = f'{wl:.1f}'
    for elem, info in matches.items():
        for rw, pw in info['matches']:
            if abs(pw - wl) < 1:
                peak_color = elem_colors.get(elem, 'gray')
                peak_label = f'{elem[:2]} {wl:.0f}'
                break
    ax1.axvline(wl, color=peak_color, linewidth=1, linestyle='--', alpha=0.4)
    ax1.plot(wl, intensity * (observed.max() - observed.min()) + observed.min(),
             'v', color=peak_color, markersize=8)

ax1.set_title('Spectral Analyzer: Golden Deer Spectrum', color='white',
              fontsize=14, fontweight='bold')
ax1.set_ylabel('Intensity', color='white')
ax1.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# --- Panel 2: Element reference line overlay ---
ax2 = fig.add_subplot(gs[1], sharex=ax1)
ax2.set_facecolor('#111827')

y_positions = {}
for idx, (elem, info) in enumerate(matches.items()):
    y = len(matches) - idx
    y_positions[elem] = y
    color = elem_colors.get(elem, 'gray')

    # Draw all reference lines (faint for unmatched, bright for matched)
    matched_wls = set(rw for rw, _ in info['matches'])
    for rw, ri in db[elem]:
        is_matched = any(abs(rw - mw) < 1 for mw in matched_wls)
        alpha = 0.9 if is_matched else 0.2
        lw = 3 if is_matched else 1
        ax2.plot([rw, rw], [y - 0.35, y + 0.35], color=color,
                linewidth=lw, alpha=alpha, solid_capstyle='round')

    ax2.text(372, y, f'{elem} ({info["score"]:.0%})', color=color,
             fontsize=9, fontweight='bold', va='center')

ax2.set_ylim(0, len(matches) + 1)
ax2.set_title('Matched Reference Lines (bright=matched, faint=unmatched)',
              color='white', fontsize=11)
ax2.set_yticks([])
ax2.tick_params(colors='gray')

# --- Panel 3: Residual (what\'s unexplained) ---
ax3 = fig.add_subplot(gs[2], sharex=ax1)
ax3.set_facecolor('#111827')

# Reconstruct matched spectrum
reconstructed = np.zeros_like(wavelengths) + continuum.mean()
for elem, info in matches.items():
    strength = info['score']
    for wl_ref, intensity in db[elem]:
        reconstructed += strength * intensity * np.exp(-0.5 * ((wavelengths - wl_ref) / 1.5) ** 2)

residual = smooth(observed, 7) - smooth(reconstructed, 7)
ax3.fill_between(wavelengths, 0, residual, where=residual > 0,
                 color='#22c55e', alpha=0.5, label='Unexplained signal')
ax3.fill_between(wavelengths, 0, residual, where=residual < 0,
                 color='#ef4444', alpha=0.5, label='Over-explained')
ax3.axhline(0, color='gray', linewidth=0.5)
ax3.set_title('Residual (observed - reconstructed)', color='white', fontsize=10)
ax3.set_ylabel('Residual', color='white')
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# --- Panel 4: Confidence bar chart ---
ax4 = fig.add_subplot(gs[3])
ax4.set_facecolor('#111827')

elements = list(matches.keys())
scores = [matches[e]['score'] for e in elements]
colors_bar = [elem_colors.get(e, 'gray') for e in elements]
bars = ax4.barh(elements, scores, color=colors_bar, edgecolor='none', height=0.6, alpha=0.8)

for bar, score, elem in zip(bars, scores, elements):
    info = matches[elem]
    ax4.text(score + 0.02, bar.get_y() + bar.get_height()/2,
             f'{score:.0%} ({info["matched"]}/{info["total"]} lines)',
             color='white', va='center', fontsize=9)

ax4.set_xlim(0, 1.15)
ax4.set_xlabel('Match confidence', color='white')
ax4.set_title('Element Identification Confidence', color='white', fontsize=11)
ax4.tick_params(colors='gray')
ax4.invert_yaxis()

plt.tight_layout()
plt.show()

print("SPECTRAL ANALYSIS REPORT")
print("=" * 55)
print("Sample: Golden Deer of Kamakhya")
print(f"Wavelength range: {wavelengths[0]:.0f}-{wavelengths[-1]:.0f} nm")
print(f"Peaks detected: {len(detected)}")
print(f"Elements identified: {len(matches)}")
print("-" * 55)
for elem, info in matches.items():
    print(f"\\n  {elem}")
    print(f"    Confidence: {info['score']:.1%}")
    print(f"    Lines matched: {info['matched']}/{info['total']}")
    for rw, pw in info['matches']:
        print(f"      ref {rw:.1f}nm <-> detected {pw:.1f}nm")
print()
print("Interpretation:")
print("  The golden deer's glow contains sodium (temple salts),")
print("  calcium (limestone hills), iron (Assam's red laterite),")
print("  and trace hydrogen (atmospheric water vapor).")
print("  The 589nm sodium lines dominate -- producing the golden color.")`,
      challenge: 'Add a "zoom" feature to the viewer: create an inset axes that magnifies the 580-600nm region (the sodium doublet area). Show both Na D lines resolved and annotated with their exact wavelengths.',
      successHint: 'Good visualization is not decoration — it is communication. Every element in your viewer encodes data: position encodes wavelength, height encodes intensity, color encodes element identity, brightness encodes match confidence. When the viewer is done right, a single glance tells the complete story.',
    },
    {
      title: 'Portfolio and extensions — packaging your spectral analyzer for the real world',
      concept: `You have built a complete spectral analysis system from scratch: a reference database, signal processor, peak detector, matching engine, and interactive viewer. This is a genuine scientific instrument implemented in pure Python. To turn it into a portfolio-worthy project, you need three things: clean documentation, comprehensive testing, and a clear path for extension.

Documentation means more than comments. Write a README that explains what the tool does, why it matters (spectroscopy is one of the most important analytical techniques in science), how to use it (API examples), and what its limitations are (resolution, noise tolerance, database completeness). Honesty about limitations is a hallmark of real scientific software — it builds trust.

Testing means running the analyzer against known spectra and verifying correct identification. Create a test suite with pure single-element spectra, mixed multi-element spectra, and adversarial cases (heavy noise, missing lines, overlapping elements). Report precision (fraction of identifications that are correct) and recall (fraction of present elements that are detected). These metrics are standard in both machine learning and analytical chemistry.

The extension path is where this project connects to real-world spectroscopy. You could add absorption spectrum analysis (detect dark lines), implement wavelength calibration using known reference lamps, add Doppler shift detection for moving sources, or interface with real spectrometer hardware via USB. Each extension uses the same modular architecture you already built.`,
      analogy: 'Packaging a project is like publishing a scientific paper. The code is the experiment. The documentation is the methods section — detailed enough for someone to reproduce your work. The test suite is the results section — proving your claims with data. And the extensions are the future work section — showing where the research leads. A great portfolio project, like a great paper, stands on its own.',
      storyConnection: 'Your spectral analyzer is now a complete tool for reading light — exactly what centuries of scientists worked toward. Kirchhoff and Bunsen identified elements in the Sun. Hubble measured galaxy velocities from spectral shifts. Your tool follows their tradition: converting light into knowledge. The golden deer\'s glow is no longer magical — it is sodium, calcium, iron, and hydrogen, identified with quantified confidence. The magic is not gone; it is deeper. You understand what makes the gold.',
      checkQuestion: 'Your analyzer correctly identifies 7 out of 8 elements in a test suite (87.5% recall) but also falsely identifies 3 elements that are not present (precision = 7/10 = 70%). Which metric should you prioritize improving, and how?',
      checkAnswer: 'It depends on the application. In safety-critical analysis (detecting toxic mercury in water), high recall is essential — missing a real element is dangerous. In pure research, high precision matters more — false identifications waste time on nonexistent signals. To improve precision, raise the match threshold or require more matching lines. To improve recall, lower the threshold or improve the peak detector. The tradeoff between precision and recall is fundamental to all detection systems.',
      codeIntro: 'Build the complete test suite, compute precision/recall metrics, and generate a comprehensive performance report with visualizations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Complete spectral database
db = {
    'Hydrogen': [(410.2, 0.15), (434.0, 0.25), (486.1, 0.50), (656.3, 1.00)],
    'Helium':   [(447.1, 0.30), (501.6, 0.25), (587.6, 1.00), (667.8, 0.35)],
    'Sodium':   [(568.8, 0.10), (589.0, 1.00), (589.6, 0.85)],
    'Calcium':  [(393.4, 1.00), (396.8, 0.85), (422.7, 0.60), (527.0, 0.20)],
    'Iron':     [(382.0, 0.45), (438.4, 0.55), (516.7, 0.60), (532.8, 1.00)],
    'Neon':     [(585.2, 0.50), (603.0, 0.45), (633.4, 0.65), (640.2, 1.00)],
    'Mercury':  [(404.7, 0.70), (435.8, 1.00), (546.1, 0.85), (577.0, 0.50)],
    'Lithium':  [(460.3, 0.10), (610.4, 0.20), (670.8, 1.00)],
}

# =====================================================
# COMPLETE SPECTRAL ANALYZER (all modules)
# =====================================================

def generate_spectrum(wavelengths, elements, db, noise_level=0.05):
    """Generate a synthetic spectrum from a list of elements."""
    spectrum = np.zeros_like(wavelengths)
    for elem, strength in elements.items():
        if elem in db:
            for wl, intensity in db[elem]:
                spectrum += strength * intensity * np.exp(
                    -0.5 * ((wavelengths - wl) / 1.5) ** 2)
    spectrum += noise_level * np.random.randn(len(wavelengths))
    return np.maximum(spectrum, 0)

def smooth(y, w=7):
    return np.convolve(y, np.ones(w)/w, mode='same')

def find_peaks(wl, intensity, threshold=0.12, min_dist=4):
    s = smooth(intensity)
    s_norm = (s - s.min()) / (s.max() - s.min() + 1e-10)
    peaks = []
    for i in range(2, len(s_norm)-2):
        if (s_norm[i] > s_norm[i-1] and s_norm[i] > s_norm[i+1] and
            s_norm[i] > s_norm[i-2] and s_norm[i] > s_norm[i+2] and
            s_norm[i] > threshold):
            if not peaks or (wl[i] - peaks[-1][0]) > min_dist:
                peaks.append((wl[i], s_norm[i]))
            elif s_norm[i] > peaks[-1][1]:
                peaks[-1] = (wl[i], s_norm[i])
    return peaks

def identify(peaks, database, tolerance=3.0, min_score=0.3):
    results = {}
    for elem, lines in database.items():
        total_w = sum(i for _, i in lines)
        matched_w = 0
        n_matched = 0
        for rw, ri in lines:
            for pw, pi in peaks:
                if abs(pw - rw) <= tolerance:
                    matched_w += ri
                    n_matched += 1
                    break
        score = matched_w / total_w if total_w > 0 else 0
        if score >= min_score:
            results[elem] = score
    return results

# =====================================================
# TEST SUITE
# =====================================================

wavelengths = np.linspace(370, 720, 3000)

# Test cases: (name, true_elements, description)
test_cases = [
    ('Pure H', {'Hydrogen': 1.0}, 'Single element: hydrogen'),
    ('Pure Na', {'Sodium': 1.0}, 'Single element: sodium'),
    ('Pure Fe', {'Iron': 1.0}, 'Single element: iron'),
    ('Pure Ne', {'Neon': 1.0}, 'Single element: neon'),
    ('Pure Hg', {'Mercury': 1.0}, 'Single element: mercury'),
    ('H + Na', {'Hydrogen': 0.8, 'Sodium': 0.9}, 'Two elements'),
    ('Na + Ca + Fe', {'Sodium': 0.9, 'Calcium': 0.7, 'Iron': 0.6}, 'Three elements (golden deer)'),
    ('All strong', {'Hydrogen': 0.5, 'Sodium': 0.8, 'Iron': 0.6, 'Mercury': 0.7}, 'Four elements'),
]

noise_levels = [0.03, 0.06, 0.10, 0.15]

# Run all tests
results_matrix = {}  # (test_name, noise) -> (true_set, detected_set)

for noise in noise_levels:
    for name, true_elems, desc in test_cases:
        spectrum = generate_spectrum(wavelengths, true_elems, db, noise)
        peaks = find_peaks(wavelengths, spectrum)
        detected = identify(peaks, db)
        true_set = set(true_elems.keys())
        det_set = set(detected.keys())
        results_matrix[(name, noise)] = (true_set, det_set)

# Compute metrics
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Precision vs noise level
ax = axes[0, 0]
ax.set_facecolor('#111827')

for noise in noise_levels:
    total_tp, total_fp, total_fn = 0, 0, 0
    for name, _, _ in test_cases:
        true_set, det_set = results_matrix[(name, noise)]
        tp = len(true_set & det_set)
        fp = len(det_set - true_set)
        fn = len(true_set - det_set)
        total_tp += tp; total_fp += fp; total_fn += fn

    precision = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0
    recall = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0

    ax.scatter(noise, precision, color='#3b82f6', s=100, zorder=5)
    ax.scatter(noise, recall, color='#22c55e', s=100, zorder=5)

# Connect with lines
precisions = []
recalls = []
for noise in noise_levels:
    total_tp, total_fp, total_fn = 0, 0, 0
    for name, _, _ in test_cases:
        true_set, det_set = results_matrix[(name, noise)]
        tp = len(true_set & det_set); fp = len(det_set - true_set); fn = len(true_set - det_set)
        total_tp += tp; total_fp += fp; total_fn += fn
    precisions.append(total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0)
    recalls.append(total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0)

ax.plot(noise_levels, precisions, 'o-', color='#3b82f6', linewidth=2, label='Precision')
ax.plot(noise_levels, recalls, 's-', color='#22c55e', linewidth=2, label='Recall')
ax.set_xlabel('Noise level', color='white')
ax.set_ylabel('Score', color='white')
ax.set_title('Precision & Recall vs Noise', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 1.1)
ax.tick_params(colors='gray')

# Plot 2: Per-element recall at low noise
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

elem_recall = {}
noise_test = 0.06
for elem in db:
    # Find test cases containing this element
    detected_count = 0
    present_count = 0
    for name, true_elems, _ in test_cases:
        if elem in true_elems:
            present_count += 1
            true_set, det_set = results_matrix[(name, noise_test)]
            if elem in det_set:
                detected_count += 1
    if present_count > 0:
        elem_recall[elem] = detected_count / present_count

elements_sorted = sorted(elem_recall.keys(), key=lambda x: -elem_recall[x])
bars = ax2.barh(elements_sorted, [elem_recall[e] for e in elements_sorted],
                color='#f59e0b', edgecolor='none', height=0.6)
for bar, elem in zip(bars, elements_sorted):
    ax2.text(bar.get_width() + 0.02, bar.get_y() + bar.get_height()/2,
             f'{elem_recall[elem]:.0%}', color='white', va='center', fontsize=10)
ax2.set_xlim(0, 1.2)
ax2.set_xlabel('Recall', color='white')
ax2.set_title(f'Per-Element Recall (noise={noise_test})', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(colors='gray')
ax2.invert_yaxis()

# Plot 3: Confusion-style matrix
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')

# For each test case at noise=0.06, show true vs detected
test_names = [tc[0] for tc in test_cases]
test_results = []
for name, true_elems, _ in test_cases:
    true_set, det_set = results_matrix[(name, 0.06)]
    tp = len(true_set & det_set)
    fp = len(det_set - true_set)
    fn = len(true_set - det_set)
    test_results.append((tp, fp, fn))

x = np.arange(len(test_names))
w = 0.25
ax3.bar(x - w, [r[0] for r in test_results], w, color='#22c55e', label='Correct (TP)')
ax3.bar(x, [r[1] for r in test_results], w, color='#ef4444', label='False + (FP)')
ax3.bar(x + w, [r[2] for r in test_results], w, color='#f59e0b', label='Missed (FN)')
ax3.set_xticks(x)
ax3.set_xticklabels(test_names, rotation=45, ha='right', fontsize=8, color='gray')
ax3.set_ylabel('Count', color='white')
ax3.set_title('Detection Results per Test Case', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: F1 score vs threshold
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

thresholds = np.arange(0.1, 0.8, 0.05)
f1_scores = []
for thresh in thresholds:
    total_tp, total_fp, total_fn = 0, 0, 0
    for name, true_elems, _ in test_cases:
        spectrum = generate_spectrum(wavelengths, true_elems, db, 0.06)
        peaks = find_peaks(wavelengths, spectrum)
        detected = identify(peaks, db, min_score=thresh)
        true_set = set(true_elems.keys())
        det_set = set(detected.keys())
        total_tp += len(true_set & det_set)
        total_fp += len(det_set - true_set)
        total_fn += len(true_set - det_set)
    p = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0
    r = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0
    f1 = 2*p*r/(p+r) if (p+r) > 0 else 0
    f1_scores.append(f1)

ax4.plot(thresholds, f1_scores, 'o-', color='#a855f7', linewidth=2, markersize=5)
best_idx = np.argmax(f1_scores)
ax4.plot(thresholds[best_idx], f1_scores[best_idx], '*', color='#fbbf24',
         markersize=15, zorder=5)
ax4.annotate(f'Best: threshold={thresholds[best_idx]:.2f}, F1={f1_scores[best_idx]:.2f}',
             xy=(thresholds[best_idx], f1_scores[best_idx]),
             xytext=(thresholds[best_idx]+0.1, f1_scores[best_idx]-0.1),
             color='#fbbf24', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#fbbf24'))
ax4.set_xlabel('Match threshold', color='white')
ax4.set_ylabel('F1 Score', color='white')
ax4.set_title('Threshold Optimization (F1 Score)', color='white', fontsize=12, fontweight='bold')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Comprehensive report
print("SPECTRAL ANALYZER - PERFORMANCE REPORT")
print("=" * 60)
print(f"Database: {len(db)} elements, {sum(len(v) for v in db.values())} total lines")
print(f"Test suite: {len(test_cases)} test cases \u00d7 {len(noise_levels)} noise levels")
print()

for noise in noise_levels:
    total_tp, total_fp, total_fn = 0, 0, 0
    for name, true_elems, _ in test_cases:
        true_set, det_set = results_matrix[(name, noise)]
        total_tp += len(true_set & det_set)
        total_fp += len(det_set - true_set)
        total_fn += len(true_set - det_set)
    p = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0
    r = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0
    f1 = 2*p*r/(p+r) if (p+r) > 0 else 0
    print(f"  Noise {noise:.0%}: Precision={p:.1%}  Recall={r:.1%}  F1={f1:.2f}")

print(f"\\nOptimal threshold: {thresholds[best_idx]:.2f} (F1={f1_scores[best_idx]:.2f})")
print()
print("EXTENSIONS FOR REAL-WORLD USE:")
print("-" * 60)
print("1. Absorption spectra: detect dark lines on bright continuum")
print("2. Wavelength calibration: use Hg/Ne lamp as reference")
print("3. Doppler shift: detect redshift/blueshift from line positions")
print("4. Temperature estimation: from relative line intensities")
print("5. Hardware interface: USB spectrometer via pyserial")
print("6. Machine learning: train a neural net on spectral features")
print()
print("PROJECT COMPLETE.")
print("You built a spectral analyzer that reads light and identifies")
print("elements -- the same principle astronomers use to decode starlight")
print("and the same science that explains the golden deer's glow.")
print()
print("The golden deer of Kamakhya glows at 589nm because of sodium.")
print("Now you can prove it.")`,
      challenge: 'Add one real extension: implement Doppler shift detection. If all lines in a matched element are systematically shifted by the same amount, calculate the radial velocity using v/c = delta_lambda/lambda. Test with a "star moving away" that has all hydrogen lines shifted +2nm toward the red.',
      successHint: 'You have built a complete scientific instrument in pure Python. The same modular architecture — database, processor, detector, matcher, viewer — is used in real spectroscopy software. The difference is scale (millions of reference lines) and hardware integration. But the core algorithm you wrote is the same one that discovered helium in the Sun.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Build a Spectral Analyzer</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete spectral analysis system. Click to start.</p>
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
