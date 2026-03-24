import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function PaintedRainLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'RGB vs CMYK — two languages of color',
      concept: `In Level 1, we learned that light uses additive primaries (RGB) and pigments use subtractive primaries (CMY). Now let's get precise about how these systems encode color digitally.

**RGB (Red, Green, Blue):**
- Each channel: 0-255 (8 bits) → 256 levels per channel
- Total colors: 256 × 256 × 256 = **16,777,216** (16.7 million)
- (0, 0, 0) = black, (255, 255, 255) = white
- (255, 0, 0) = pure red, (0, 255, 0) = pure green
- Used by: monitors, cameras, web, phones

**CMYK (Cyan, Magenta, Yellow, Key/Black):**
- Each channel: 0-100%
- (0, 0, 0, 0) = white (no ink), (0, 0, 0, 100) = black
- K (Key) exists because C+M+Y in practice makes muddy brown, not true black
- Used by: printers, offset printing, packaging

**The gamut problem:** RGB can represent colors that CMYK cannot (especially vivid blues and greens), and vice versa. Converting between them always loses some colors. This is why a photo that looks vivid on screen often looks duller when printed.`,
      analogy: 'RGB and CMYK are like Celsius and Fahrenheit — two scales measuring the same thing (color/temperature) but with different ranges and strengths. You can convert between them, but the conversion is imperfect because their gamuts (ranges) don\'t perfectly overlap.',
      storyConnection: 'If the girl who painted rain posted a photo of her painting online, the colors would shift twice: once when the camera converted real pigments to RGB, and again if someone printed the photo (RGB to CMYK). The monsoon gray she mixed with real pigments cannot be perfectly captured by either digital system.',
      checkQuestion: 'Why does CMYK need a separate black (K) channel when mixing C+M+Y should theoretically produce black?',
      checkAnswer: 'Three reasons: (1) Real inks are impure — CMY mixed gives muddy brown, not black. (2) Using K for dark areas saves expensive color ink. (3) Black text printed with CMY would require perfect alignment of three ink passes; a single K pass is sharper and faster. Economics and physics both demand the K channel.',
      codeIntro: 'Convert between RGB and CMYK and visualize the gamut difference.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def rgb_to_cmyk(r, g, b):
    """Convert RGB (0-255) to CMYK (0-100%)."""
    r, g, b = r/255, g/255, b/255
    k = 1 - max(r, g, b)
    if k == 1:
        return 0, 0, 0, 100
    c = (1 - r - k) / (1 - k) * 100
    m = (1 - g - k) / (1 - k) * 100
    y = (1 - b - k) / (1 - k) * 100
    return round(c, 1), round(m, 1), round(y, 1), round(k * 100, 1)

def cmyk_to_rgb(c, m, y, k):
    """Convert CMYK (0-100%) to RGB (0-255)."""
    c, m, y, k = c/100, m/100, y/100, k/100
    r = 255 * (1 - c) * (1 - k)
    g = 255 * (1 - m) * (1 - k)
    b = 255 * (1 - y) * (1 - k)
    return int(round(r)), int(round(g)), int(round(b))

# Show some color conversions
test_colors = [
    ('Pure Red', 255, 0, 0),
    ('Pure Green', 0, 255, 0),
    ('Pure Blue', 0, 0, 255),
    ('Vivid Cyan', 0, 255, 255),
    ('Muga Gold', 218, 165, 32),
    ('Indigo', 75, 0, 130),
    ('Monsoon Gray', 128, 128, 128),
]

fig, axes = plt.subplots(len(test_colors), 3, figsize=(12, len(test_colors) * 1.2))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('RGB → CMYK → RGB Round-Trip', color='white', fontsize=14, y=1.02)

for i, (name, r, g, b) in enumerate(test_colors):
    # Original RGB
    c, m, y, k = rgb_to_cmyk(r, g, b)
    # Round-trip back
    r2, g2, b2 = cmyk_to_rgb(c, m, y, k)

    # Original color swatch
    axes[i, 0].set_facecolor((r/255, g/255, b/255))
    axes[i, 0].set_xlim(0, 1); axes[i, 0].set_ylim(0, 1)
    axes[i, 0].text(0.5, 0.5, f'{name}\\nRGB({r},{g},{b})', ha='center', va='center',
                     color='white' if (r+g+b) < 400 else 'black', fontsize=8, fontweight='bold')
    axes[i, 0].set_xticks([]); axes[i, 0].set_yticks([])

    # CMYK values
    axes[i, 1].set_facecolor('#111827')
    axes[i, 1].set_xlim(0, 1); axes[i, 1].set_ylim(0, 1)
    axes[i, 1].text(0.5, 0.5, f'C={c}% M={m}%\\nY={y}% K={k}%', ha='center', va='center',
                     color='white', fontsize=8)
    axes[i, 1].set_xticks([]); axes[i, 1].set_yticks([])

    # Round-trip color
    axes[i, 2].set_facecolor((r2/255, g2/255, b2/255))
    axes[i, 2].set_xlim(0, 1); axes[i, 2].set_ylim(0, 1)
    diff = abs(r-r2) + abs(g-g2) + abs(b-b2)
    axes[i, 2].text(0.5, 0.5, f'RGB({r2},{g2},{b2})\\nDrift: {diff}', ha='center', va='center',
                     color='white' if (r2+g2+b2) < 400 else 'black', fontsize=8, fontweight='bold')
    axes[i, 2].set_xticks([]); axes[i, 2].set_yticks([])

axes[0, 0].set_title('Original (RGB)', color='white', fontsize=10)
axes[0, 1].set_title('Converted (CMYK)', color='white', fontsize=10)
axes[0, 2].set_title('Round-trip (back to RGB)', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("RGB -> CMYK -> RGB round-trip is lossless for pure math,")
print("but REAL printers have limited gamuts.")
print("Vivid screen blues often become duller in print.")
print("This is the #1 frustration for digital artists going to print.")`,
      challenge: 'Find an RGB color that produces negative CMYK values (which is impossible to print). What does this tell you about the CMYK gamut?',
      successHint: 'Every designer and photographer must understand the RGB-CMYK boundary. If you design on screen and print without checking, you will be disappointed. Always soft-proof your work in CMYK before printing.',
    },
    {
      title: 'Color spaces — mapping all possible colors',
      concept: `RGB and CMYK are **device-dependent** color spaces — the same RGB values look different on different monitors. We need a **device-independent** system to describe color absolutely.

**HSL (Hue, Saturation, Lightness):**
- Hue: the angle on the color wheel (0° = red, 120° = green, 240° = blue)
- Saturation: 0% = gray, 100% = vivid
- Lightness: 0% = black, 50% = full color, 100% = white
- Intuitive for humans: "make it more orange" = shift hue, "make it muted" = reduce saturation

**HSV (Hue, Saturation, Value):**
- Similar to HSL but Value = brightness of the brightest channel
- Preferred by many artists because it separates color (hue) from intensity (value)

**Lab (CIELAB):**
- L = lightness (0-100), a = green-red axis, b = blue-yellow axis
- Designed so that equal numerical distances correspond to equal **perceptual** differences
- The gold standard for color comparison in industry (paint, textiles, food)

The key insight: there are many ways to parameterize color space. Each has trade-offs between intuitiveness, perceptual uniformity, and computational convenience.`,
      analogy: 'Color spaces are like map projections. A globe (reality) can be projected onto flat paper in many ways — Mercator, Robinson, Peters. Each projection preserves some property (area, shape, direction) while distorting others. RGB preserves screen hardware logic, HSL preserves human intuition, Lab preserves perceptual distance.',
      storyConnection: 'The girl who painted rain mixed her pigments by intuition — adjusting hue, making colors brighter or duller. She was working in HSL space without knowing it. A scientist analyzing the same colors would use Lab space to measure the exact perceptual difference between her monsoon gray and the real sky.',
      checkQuestion: 'In RGB, (128, 128, 128) and (130, 128, 128) differ by just 2 units. Is this the same perceptual difference as (250, 0, 0) and (252, 0, 0)?',
      checkAnswer: 'No. Human color perception is nonlinear. We are much more sensitive to changes in dark colors and mid-tones than in bright saturated colors. The two-unit change in gray is more noticeable than the same two-unit change in bright red. This is exactly why Lab space was invented — to make equal numerical differences correspond to equal perceptual differences.',
      codeIntro: 'Visualize the HSL color space as a hue-saturation wheel.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import colorsys

# Create an HSL color wheel
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# HSL Hue-Saturation wheel (Lightness = 0.5)
n = 360
m = 50
hue_wheel = np.zeros((m, n, 3))
for i in range(m):  # saturation: outer = 1, inner = 0
    sat = i / m
    for j in range(n):  # hue: 0-360 degrees
        hue = j / n
        r, g, b = colorsys.hls_to_rgb(hue, 0.5, sat)
        hue_wheel[i, j] = [r, g, b]

ax1.set_facecolor('#111827')
# Convert to polar-like image in cartesian
size = 200
img = np.zeros((size, size, 3))
center = size // 2
for y in range(size):
    for x in range(size):
        dx, dy = x - center, y - center
        dist = np.sqrt(dx**2 + dy**2) / center
        if dist <= 1.0:
            angle = (np.arctan2(dy, dx) + np.pi) / (2 * np.pi)
            r, g, b = colorsys.hls_to_rgb(angle, 0.5, dist)
            img[y, x] = [r, g, b]

ax1.imshow(img, extent=[-1, 1, -1, 1])
ax1.set_title('HSL Color Wheel\\n(Hue = angle, Saturation = radius, L=0.5)', color='white', fontsize=10)
ax1.set_xlabel('← Green / Cyan          Red / Magenta →', color='gray', fontsize=8)
ax1.set_ylabel('← Blue / Violet          Yellow / Orange →', color='gray', fontsize=8)
ax1.tick_params(colors='gray')

# Show lightness strip for a fixed hue (blue, H=240)
lightness_vals = np.linspace(0, 1, 100)
sat_vals = np.linspace(0, 1, 50)
ls_grid = np.zeros((50, 100, 3))
for i, s in enumerate(sat_vals):
    for j, l in enumerate(lightness_vals):
        r, g, b = colorsys.hls_to_rgb(240/360, l, s)
        ls_grid[i, j] = [r, g, b]

ax2.imshow(ls_grid, extent=[0, 100, 0, 100], aspect='auto', origin='lower')
ax2.set_xlabel('Lightness (%)', color='white', fontsize=10)
ax2.set_ylabel('Saturation (%)', color='white', fontsize=10)
ax2.set_title('Blue (H=240°): Saturation vs Lightness', color='white', fontsize=10)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("HSL separates three intuitive properties:")
print("  Hue: WHAT color (red, blue, green...)")
print("  Saturation: HOW vivid (gray to pure)")
print("  Lightness: HOW bright (black to white)")
print()
print("This is how CSS works: hsl(240, 100%, 50%) = pure blue")
print("Designers think in HSL. Hardware thinks in RGB.")`,
      challenge: 'Create a similar wheel but for HSV instead of HSL. The difference: in HSL, L=100% is white; in HSV, V=100% is the brightest version of the color. Which feels more intuitive to you?',
      successHint: 'Color spaces are not just theory — CSS uses hsl(), Photoshop uses Lab, and every camera sensor outputs raw RGB. Knowing which space to use for which task separates beginners from professionals.',
    },
    {
      title: 'CIE chromaticity — mapping human vision',
      concept: `In 1931, the **Commission Internationale de l'Eclairage** (CIE) ran experiments where observers matched colors by adjusting three light sources. The result was the **CIE 1931 chromaticity diagram** — a map of all colors visible to the average human eye.

Key features of the CIE diagram:
- The **horseshoe shape** represents the boundary of all visible (spectral) colors
- The curved edge = monochromatic light (single wavelengths: 380-700 nm)
- The straight bottom edge = the "line of purples" (mixtures of red and violet, not in the spectrum)
- Any two colors connected by a straight line can be mixed to produce any color on that line
- The **white point** (D65 illuminant) sits near the center: (0.3127, 0.3290)
- The area enclosed = the full gamut of human vision (~10 million distinguishable colors)

**Color gamuts** are triangles or polygons drawn on this diagram:
- **sRGB** (standard screens): a small triangle covering about 35% of visible colors
- **Adobe RGB**: a larger triangle (~50%), better greens
- **DCI-P3** (modern Apple displays): similar to Adobe RGB but different shape
- **Rec. 2020** (HDR video): much larger, approaching 75% of visible colors`,
      analogy: 'The CIE diagram is like a map of an island (all visible colors). RGB is a small village on that island — it can only represent colors within its borders. Adobe RGB is a larger town. Rec. 2020 is a big city. But none of them cover the entire island. Some colors you can see with your eyes simply cannot be displayed on any screen.',
      storyConnection: 'The vivid greens of Assam\'s monsoon rice paddies and the deep indigo of hand-dyed Muga silk sit outside the sRGB gamut. When the girl\'s paintings are photographed and uploaded to the web, those colors are clipped to the nearest sRGB equivalent — losing the very intensity that made them special.',
      checkQuestion: 'If sRGB covers only ~35% of visible colors, why do photos on sRGB screens look "realistic" to most people?',
      checkAnswer: 'Two reasons: (1) Most common everyday colors (skin tones, sky blue, grass green, wood brown) fall well within sRGB. The missing 65% are mostly extremely vivid greens, cyans, and deep violets that rarely appear in everyday scenes. (2) People have no reference to compare — if you have never seen a wider gamut screen showing the same image, you don\'t know what you\'re missing.',
      codeIntro: 'Plot the CIE 1931 chromaticity diagram with color gamut triangles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# CIE 1931 spectral locus (approximate xy coordinates)
spectral_x = [0.1741, 0.1740, 0.1738, 0.1736, 0.1733, 0.1730, 0.1726, 0.1721, 0.1714, 0.1703,
              0.1689, 0.1669, 0.1644, 0.1611, 0.1566, 0.1510, 0.1440, 0.1355, 0.1241, 0.1096,
              0.0913, 0.0687, 0.0454, 0.0235, 0.0082, 0.0039, 0.0139, 0.0389, 0.0743, 0.1142,
              0.1547, 0.1929, 0.2296, 0.2658, 0.3016, 0.3373, 0.3731, 0.4087, 0.4441, 0.4788,
              0.5125, 0.5448, 0.5752, 0.6029, 0.6270, 0.6482, 0.6658, 0.6801, 0.6915, 0.7006,
              0.7079, 0.7140, 0.7190, 0.7230, 0.7260, 0.7283, 0.7300, 0.7311, 0.7320, 0.7327,
              0.7334, 0.7340, 0.7344, 0.7346]
spectral_y = [0.0050, 0.0050, 0.0049, 0.0049, 0.0048, 0.0048, 0.0048, 0.0048, 0.0051, 0.0058,
              0.0069, 0.0086, 0.0109, 0.0138, 0.0177, 0.0227, 0.0297, 0.0399, 0.0578, 0.0868,
              0.1327, 0.2007, 0.2950, 0.4127, 0.5384, 0.6548, 0.7502, 0.8120, 0.8338, 0.8262,
              0.8059, 0.7816, 0.7543, 0.7243, 0.6923, 0.6589, 0.6245, 0.5896, 0.5547, 0.5202,
              0.4866, 0.4544, 0.4242, 0.3965, 0.3725, 0.3514, 0.3340, 0.3197, 0.3083, 0.2993,
              0.2920, 0.2859, 0.2809, 0.2770, 0.2740, 0.2717, 0.2700, 0.2689, 0.2680, 0.2673,
              0.2666, 0.2660, 0.2656, 0.2654]

# Close the horseshoe with line of purples
spectral_x_closed = spectral_x + [spectral_x[0]]
spectral_y_closed = spectral_y + [spectral_y[0]]

fig, ax = plt.subplots(figsize=(8, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Fill the spectral locus area
ax.fill(spectral_x_closed, spectral_y_closed, alpha=0.15, color='white')
ax.plot(spectral_x_closed, spectral_y_closed, color='white', linewidth=1.5)

# Color gamut triangles
gamuts = {
    'sRGB': {'coords': [(0.64, 0.33), (0.30, 0.60), (0.15, 0.06)], 'color': '#ef4444'},
    'Adobe RGB': {'coords': [(0.64, 0.33), (0.21, 0.71), (0.15, 0.06)], 'color': '#3b82f6'},
    'DCI-P3': {'coords': [(0.680, 0.320), (0.265, 0.690), (0.150, 0.060)], 'color': '#22c55e'},
}

for name, data in gamuts.items():
    coords = data['coords'] + [data['coords'][0]]
    xs, ys = zip(*coords)
    ax.plot(xs, ys, color=data['color'], linewidth=2, label=name)
    ax.fill(xs, ys, alpha=0.05, color=data['color'])

# White point D65
ax.plot(0.3127, 0.3290, 'o', color='white', markersize=8, zorder=5)
ax.annotate('D65 (white)', xy=(0.3127, 0.3290), xytext=(0.35, 0.36),
            color='white', fontsize=9, arrowprops=dict(arrowstyle='->', color='white'))

# Label some wavelengths
wl_labels = [(0, '380nm'), (15, '460nm'), (20, '480nm'), (25, '500nm'),
             (30, '520nm'), (35, '540nm'), (40, '560nm'), (50, '600nm'),
             (55, '620nm'), (60, '660nm')]
for idx, label in wl_labels:
    if idx < len(spectral_x):
        ax.annotate(label, xy=(spectral_x[idx], spectral_y[idx]),
                    fontsize=7, color='gray', textcoords='offset points',
                    xytext=(10, 5))

ax.set_xlabel('x', color='white', fontsize=12)
ax.set_ylabel('y', color='white', fontsize=12)
ax.set_title('CIE 1931 Chromaticity Diagram', color='white', fontsize=14)
ax.set_xlim(-0.05, 0.8)
ax.set_ylim(-0.05, 0.9)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The horseshoe = all colors visible to the human eye")
print("Gamut areas (approximate):")
print("  sRGB:      ~35% of visible colors (standard screens)")
print("  Adobe RGB: ~50% (professional photography)")
print("  DCI-P3:    ~45% (modern Apple displays, cinema)")
print("  Rec. 2020: ~75% (future HDR standard)")`,
      challenge: 'The Rec. 2020 gamut has primaries at (0.708, 0.292), (0.170, 0.797), and (0.131, 0.046). Add it to the plot. How much bigger is it than sRGB?',
      successHint: 'The CIE diagram is the Rosetta Stone of color science. Every display specification, every printer profile, every camera sensor is defined by its triangle on this map. Mastering it means understanding the limits of every color device.',
    },
    {
      title: 'Color perception — how your brain invents color',
      concept: `Here is the most unsettling truth about color: **it doesn't exist outside your brain**. There is no "red" in the physical world — only electromagnetic radiation at ~620-700 nm. "Red" is an experience your brain constructs.

Your retina has three types of **cone cells**:
- **S-cones** (short wavelength): peak sensitivity ~420 nm (blue)
- **M-cones** (medium): peak sensitivity ~530 nm (green)
- **L-cones** (long): peak sensitivity ~560 nm (yellow-green, not red!)

Color perception is a **comparison** of signals from these three cone types. Your brain computes ratios, not absolute values. This is why:

- **Color constancy**: a white shirt looks white in sunlight AND under yellow indoor light, even though the wavelengths reaching your eye are completely different
- **Simultaneous contrast**: a gray square looks bluer on a yellow background and yellower on a blue background
- **Optical illusions**: the famous "checker shadow" illusion — squares that are physically identical in RGB appear completely different colors

The takeaway: what you "see" is a processed interpretation, not raw data. Your visual cortex is doing heavy computation to construct a stable, useful color experience from messy, ambiguous input.`,
      analogy: 'Your eye is like a camera with only three color filters (S, M, L cones), but your brain is like Photoshop running a massive auto-correction algorithm. It adjusts white balance, compensates for lighting, fills in missing data, and produces a final "image" that is useful for survival — but not necessarily accurate to the physics.',
      storyConnection: 'The girl painting monsoon rain knew that the same river looked different at dawn (golden), noon (silver-blue), and dusk (gray-purple). The water molecules were identical — the light changed, and her brain recalculated the colors. Her greatest skill was overriding her brain\'s auto-correction to see and paint the actual wavelengths.',
      checkQuestion: 'A banana looks yellow. But if you put it under pure blue light (no yellow wavelengths at all), what color does it look? Is it still yellow?',
      checkAnswer: 'Under pure blue light, the banana appears very dark — almost black. Yellow pigment in the banana skin absorbs blue and reflects yellow/green/red. But if the only available light is blue, there is no yellow light to reflect. The banana absorbs the blue and reflects almost nothing. Color is not a fixed property of objects — it depends entirely on the illumination.',
      codeIntro: 'Model the three cone types and show how they respond to different wavelengths.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.arange(380, 701)

# Approximate cone sensitivity curves (normalized Gaussian approximations)
def cone_response(wl, peak, width):
    return np.exp(-0.5 * ((wl - peak) / width) ** 2)

s_cone = cone_response(wavelengths, 420, 26)  # Blue-sensitive
m_cone = cone_response(wavelengths, 530, 44)  # Green-sensitive
l_cone = cone_response(wavelengths, 560, 48)  # Red-sensitive (peak actually yellowish)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Cone sensitivity curves
ax1.set_facecolor('#111827')
ax1.fill_between(wavelengths, s_cone, alpha=0.2, color='#3b82f6')
ax1.fill_between(wavelengths, m_cone, alpha=0.2, color='#22c55e')
ax1.fill_between(wavelengths, l_cone, alpha=0.2, color='#ef4444')
ax1.plot(wavelengths, s_cone, color='#3b82f6', linewidth=2, label='S-cone (peak 420nm)')
ax1.plot(wavelengths, m_cone, color='#22c55e', linewidth=2, label='M-cone (peak 530nm)')
ax1.plot(wavelengths, l_cone, color='#ef4444', linewidth=2, label='L-cone (peak 560nm)')
ax1.axvline(420, color='#3b82f6', linestyle=':', alpha=0.3)
ax1.axvline(530, color='#22c55e', linestyle=':', alpha=0.3)
ax1.axvline(560, color='#ef4444', linestyle=':', alpha=0.3)
ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Relative sensitivity', color='white')
ax1.set_title('Human Cone Cell Sensitivity', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# How the brain sees different colors
test_wavelengths = [450, 520, 580, 620, 500, 570]
test_names = ['Blue', 'Green', 'Yellow', 'Red', 'Cyan', 'Yellow-green']

responses = []
for wl in test_wavelengths:
    s = cone_response(wl, 420, 26)
    m = cone_response(wl, 530, 44)
    l = cone_response(wl, 560, 48)
    total = s + m + l
    responses.append((s/total if total > 0 else 0,
                       m/total if total > 0 else 0,
                       l/total if total > 0 else 0))

ax2.set_facecolor('#111827')
x = np.arange(len(test_wavelengths))
width = 0.25
s_vals = [r[0] for r in responses]
m_vals = [r[1] for r in responses]
l_vals = [r[2] for r in responses]

ax2.bar(x - width, s_vals, width, color='#3b82f6', label='S-cone', alpha=0.8)
ax2.bar(x, m_vals, width, color='#22c55e', label='M-cone', alpha=0.8)
ax2.bar(x + width, l_vals, width, color='#ef4444', label='L-cone', alpha=0.8)

ax2.set_xticks(x)
ax2.set_xticklabels([f'{n}\\n({w}nm)' for n, w in zip(test_names, test_wavelengths)],
                     color='white', fontsize=9)
ax2.set_ylabel('Relative cone response', color='white')
ax2.set_title('Cone Response Ratios for Different Colors', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Your brain reads color as RATIOS between S, M, and L cones:")
print("  Blue (450nm): S high, M low, L low")
print("  Green (520nm): S low, M high, L medium")
print("  Yellow (580nm): S zero, M high, L high (no yellow cone!)")
print("  Red (620nm): S zero, M low, L high")
print()
print("Key insight: there is no 'yellow' cone.")
print("Yellow = M and L cones firing equally. Your brain INFERS yellow.")`,
      challenge: 'Monochromatic yellow (580nm) and a mix of red (620nm) + green (520nm) look identical to your eyes — both stimulate M and L cones equally. Plot both scenarios to prove it.',
      successHint: 'Color perception is not passive observation — it is active computation by your brain. This is why color illusions work, why colorblind people see differently, and why AI needs special training to handle color the way humans do.',
    },
    {
      title: 'Color blindness — when cones are different',
      concept: `About 8% of men and 0.5% of women have some form of **color vision deficiency** (CVD). It's not "blindness" — it's a difference in cone cell response curves.

Types of color vision deficiency:
- **Protanopia** (~1% of males): L-cones missing or shifted. Red looks dark/brownish. Confuse red/green.
- **Deuteranopia** (~1% of males): M-cones missing or shifted. Most common type. Also confuse red/green.
- **Tritanopia** (very rare, ~0.003%): S-cones missing. Confuse blue/yellow.
- **Anomalous trichromacy** (~6% of males): all three cones present, but one has a shifted sensitivity curve. Colors are distinguishable but less vivid.

CVD is usually **X-linked recessive** — the gene for L and M cones is on the X chromosome. Men (XY) have only one X, so one defective copy means CVD. Women (XX) need two defective copies, which is much rarer.

Design implications:
- Never use red/green as the only way to distinguish information (traffic lights add position: top/bottom)
- Always provide redundant cues: text labels, patterns, shapes — not just color
- Tools like Coblis and Color Oracle simulate CVD for designers`,
      analogy: 'Color blindness is like listening to music through speakers that are missing certain frequencies. If your subwoofer is broken (like missing L-cones), bass-heavy sounds (red) disappear or sound strange. The music is still there — you just perceive it differently. And you might not even know what you\'re missing if you\'ve never heard full-range speakers.',
      storyConnection: 'If the girl who painted rain had protanopia, her monsoon paintings would look completely different — the warm reds and oranges of Assamese sunsets would appear as muddy browns and yellows. Her art would be just as beautiful, but it would represent a genuinely different perceptual reality. About 1 in 12 viewers of her art would see it differently from what she intended.',
      checkQuestion: 'Traffic lights use red (stop) and green (go). How do colorblind drivers tell them apart?',
      checkAnswer: 'Position: red is always on top, green on bottom (or left/right at horizontal lights). Additionally, modern traffic lights use specific shades — the "green" has blue mixed in, and the "red" has orange mixed in — making them more distinguishable even to people with red-green CVD. Japan actually calls traffic lights "blue" instead of "green" because their green light has such a strong blue tint.',
      codeIntro: 'Simulate how an image appears to people with different types of color vision deficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate CVD using transformation matrices
# Based on Machado et al. (2009) simulation

def simulate_protanopia(rgb):
    """Simulate protanopia (no L-cones) using LMS transformation."""
    # Simplified: shift red channel toward green
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    new_r = 0.152 * r + 1.053 * g - 0.205 * b
    new_g = 0.115 * r + 0.786 * g + 0.099 * b
    new_b = -0.004 * r - 0.048 * g + 1.052 * b
    return np.clip(np.stack([new_r, new_g, new_b], axis=-1), 0, 1)

def simulate_deuteranopia(rgb):
    """Simulate deuteranopia (no M-cones)."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    new_r = 0.367 * r + 0.861 * g - 0.228 * b
    new_g = 0.280 * r + 0.673 * g + 0.047 * b
    new_b = -0.012 * r + 0.043 * g + 0.969 * b
    return np.clip(np.stack([new_r, new_g, new_b], axis=-1), 0, 1)

def simulate_tritanopia(rgb):
    """Simulate tritanopia (no S-cones)."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    new_r = 1.256 * r - 0.077 * g - 0.179 * b
    new_g = -0.078 * r + 0.931 * g + 0.148 * b
    new_b = 0.005 * r + 0.691 * g + 0.304 * b
    return np.clip(np.stack([new_r, new_g, new_b], axis=-1), 0, 1)

# Create a test image: color gradient
x = np.linspace(0, 1, 300)
y = np.linspace(0, 1, 60)
X, Y = np.meshgrid(x, y)

# Rainbow gradient
img = np.zeros((60, 300, 3))
for i in range(300):
    hue = i / 300
    # Simple HSV to RGB
    h = hue * 6
    c = 1.0
    x_val = c * (1 - abs(h % 2 - 1))
    if h < 1: r, g, b = c, x_val, 0
    elif h < 2: r, g, b = x_val, c, 0
    elif h < 3: r, g, b = 0, c, x_val
    elif h < 4: r, g, b = 0, x_val, c
    elif h < 5: r, g, b = x_val, 0, c
    else: r, g, b = c, 0, x_val
    img[:, i] = [r, g, b]

fig, axes = plt.subplots(4, 1, figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Color Vision Deficiency Simulation', color='white', fontsize=14)

titles = ['Normal vision', 'Protanopia (no L-cones, ~1% males)',
          'Deuteranopia (no M-cones, ~1% males)', 'Tritanopia (no S-cones, rare)']
images = [img, simulate_protanopia(img), simulate_deuteranopia(img), simulate_tritanopia(img)]

for ax, title, image in zip(axes, titles, images):
    ax.imshow(image, aspect='auto')
    ax.set_ylabel(title, color='white', fontsize=8, rotation=0, ha='right', va='center')
    ax.set_xticks([])
    ax.set_yticks([])

plt.tight_layout()
plt.show()

print("What each type confuses:")
print("  Protanopia: red/green -> both look brownish-yellow")
print("  Deuteranopia: red/green -> both look brownish-yellow")
print("  Tritanopia: blue/yellow -> both look pinkish")
print()
print("Design rule: NEVER rely on color alone.")
print("Use labels, patterns, and position as redundant cues.")
print(f"About 300 million people worldwide have some form of CVD.")`,
      challenge: 'Create a 2x2 grid of colored squares (red, green, blue, yellow) and run all three CVD simulations on it. Which pairs become indistinguishable under each type?',
      successHint: 'Designing for color blindness is not optional — it is a requirement for accessible design. Every chart, map, UI, and data visualization should be tested with CVD simulation before release.',
    },
    {
      title: 'Digital color manipulation with Python',
      concept: `Now we combine everything into practical programming. Digital images are 3D arrays: height × width × 3 (RGB channels). Each pixel is three numbers from 0-255. Manipulating these numbers = manipulating color.

Common color operations in code:
- **Grayscale conversion**: weighted average of RGB (not equal — human eyes are most sensitive to green)
  - Formula: Gray = 0.299R + 0.587G + 0.114B
- **Brightness**: multiply all channels by a factor
- **Contrast**: stretch the histogram (map darkest to 0, lightest to 255)
- **Hue shift**: convert to HSL, add offset to H, convert back
- **Color filtering**: zero out one or two channels
- **Thresholding**: convert to binary (black/white) based on brightness cutoff

These operations are the foundation of Instagram filters, Photoshop adjustments, and computer vision preprocessing. Every "filter" is just math applied to arrays of numbers.`,
      analogy: 'A digital image is a spreadsheet with millions of rows (pixels), three columns (R, G, B), and values from 0-255. Color manipulation is applying formulas to these columns — multiply, add, threshold, swap. Photoshop is just a fancy spreadsheet editor for pixels.',
      storyConnection: 'If the girl\'s monsoon paintings were digitized, each brushstroke would become thousands of RGB pixels. A Python script could analyze her palette — which colors she favored, how she mixed them, whether her style shifted between dry and wet season paintings. Digital color analysis turns art into data.',
      checkQuestion: 'Why is the grayscale formula weighted (0.299R + 0.587G + 0.114B) instead of a simple average ((R+G+B)/3)?',
      checkAnswer: 'Because human eyes are not equally sensitive to all colors. We are most sensitive to green (hence the 0.587 weight), moderately sensitive to red (0.299), and least sensitive to blue (0.114). A simple average would make blue areas appear too bright and green areas too dark compared to how we perceive luminance.',
      codeIntro: 'Build a set of image color manipulation tools from scratch.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a synthetic "monsoon landscape" image
np.random.seed(42)
h, w = 150, 300

# Sky gradient (blue to gray)
sky = np.zeros((75, w, 3))
for y in range(75):
    t = y / 75
    sky[y, :, 0] = 100 + 80 * t  # R: gray increases
    sky[y, :, 1] = 120 + 60 * t  # G
    sky[y, :, 2] = 180 - 20 * t  # B: blue decreases

# Ground (green paddy fields with brown river)
ground = np.zeros((75, w, 3))
for x in range(w):
    if 120 < x < 180:  # River
        ground[:, x, 0] = 100 + np.random.randint(0, 20, 75)
        ground[:, x, 1] = 80 + np.random.randint(0, 20, 75)
        ground[:, x, 2] = 60 + np.random.randint(0, 20, 75)
    else:  # Paddy
        ground[:, x, 0] = 30 + np.random.randint(0, 30, 75)
        ground[:, x, 1] = 120 + np.random.randint(0, 40, 75)
        ground[:, x, 2] = 20 + np.random.randint(0, 20, 75)

img = np.vstack([sky, ground]).astype(np.uint8)

# Color operations
def to_grayscale(img):
    return (0.299 * img[:,:,0] + 0.587 * img[:,:,1] + 0.114 * img[:,:,2]).astype(np.uint8)

def adjust_brightness(img, factor):
    return np.clip(img * factor, 0, 255).astype(np.uint8)

def isolate_channel(img, channel):
    result = np.zeros_like(img)
    result[:,:,channel] = img[:,:,channel]
    return result

def invert(img):
    return (255 - img).astype(np.uint8)

def warm_filter(img):
    result = img.astype(np.float64)
    result[:,:,0] = np.clip(result[:,:,0] * 1.2, 0, 255)  # boost red
    result[:,:,2] = np.clip(result[:,:,2] * 0.8, 0, 255)  # reduce blue
    return result.astype(np.uint8)

fig, axes = plt.subplots(2, 4, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Digital Color Manipulation', color='white', fontsize=14)

operations = [
    ('Original', img),
    ('Grayscale', np.stack([to_grayscale(img)]*3, axis=-1)),
    ('Bright (+50%)', adjust_brightness(img, 1.5)),
    ('Red channel', isolate_channel(img, 0)),
    ('Green channel', isolate_channel(img, 1)),
    ('Blue channel', isolate_channel(img, 2)),
    ('Inverted', invert(img)),
    ('Warm filter', warm_filter(img)),
]

for ax, (title, image) in zip(axes.flat, operations):
    ax.imshow(image)
    ax.set_title(title, color='white', fontsize=9)
    ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Every Instagram filter is combinations of these operations:")
print("  Grayscale: 0.299R + 0.587G + 0.114B")
print("  Brightness: multiply all channels")
print("  Warm filter: boost red, reduce blue")
print("  Sepia: grayscale + warm tint")
print()
print("An image is just a numpy array. Color is just math.")`,
      challenge: 'Create a "monsoon filter": increase blue by 20%, decrease saturation by 30%, and add a slight blur. These three steps would give any photo a rainy, moody feel.',
      successHint: 'You now understand color from photons to pixels to code. Level 1 gave you the physics and chemistry; Level 2 gave you the math and programming. Combined, you can analyze, create, and manipulate color at every level — which is exactly what painters, designers, photographers, and vision scientists do.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 color science foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for digital color manipulation. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
