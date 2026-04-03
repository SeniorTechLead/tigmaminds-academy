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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'RGB vs CMYK — the two languages of color',
      concept: `Digital screens and physical printers speak different color languages. Understanding both is essential for anyone working with color professionally.

**RGB (Red, Green, Blue)** — Additive model
- Each channel: 0-255 (8-bit) or 0.0-1.0
- Total colors: 256 × 256 × 256 = **16.7 million**
- (0, 0, 0) = black, (255, 255, 255) = white
- Used in: monitors, cameras, TVs, phones, web design

**CMYK (Cyan, Magenta, Yellow, Key/Black)** — Subtractive model
- Each channel: 0-100%
- K (black) added because CMY inks can't produce a true, deep black
- Used in: offset printing, inkjet printers, publishing

**The conversion problem**: RGB has colors that CMYK cannot reproduce (especially bright blues and greens), and vice versa. This is why a design that looks vibrant on screen can look dull when printed. The set of reproducible colors is called the **gamut** of a device.

The formula (simplified):
- C = 1 - R/255, M = 1 - G/255, Y = 1 - B/255
- K = min(C, M, Y)
- Final C = (C - K)/(1 - K), etc.`,
      analogy: 'RGB and CMYK are like Celsius and Fahrenheit — they measure the same thing (color/temperature) with different scales. Converting between them is possible but not always exact. Some "temperatures" in one scale don\'t map perfectly to the other — just as some RGB colors have no exact CMYK equivalent.',
      storyConnection: 'If the girl who painted rain wanted to share her monsoon painting digitally — scanning it and posting it online — the scanner would convert her subtractive pigment colors into RGB values. Some of her subtle ochre and indigo shades might shift in the process, because the CMYK gamut of her paints and the RGB gamut of a screen don\'t overlap perfectly.',
      checkQuestion: 'A designer creates a logo with RGB value (0, 100, 255) — a vivid electric blue. When printed in CMYK, it looks duller. Why?',
      checkAnswer: 'That specific saturated blue is outside the CMYK gamut. CMYK inks cannot reproduce the pure spectral quality of light emitted by an RGB screen at that value. The printer substitutes the closest available CMYK blue, which appears less saturated. This is called "gamut clipping" and it\'s the #1 source of print disappointments.',
      codeIntro: 'Convert colors between RGB and CMYK and visualize the difference.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def rgb_to_cmyk(r, g, b):
    """Convert RGB (0-255) to CMYK (0-1)."""
    r_, g_, b_ = r/255, g/255, b/255
    k = 1 - max(r_, g_, b_)
    if k == 1:
        return 0, 0, 0, 1
    c = (1 - r_ - k) / (1 - k)
    m = (1 - g_ - k) / (1 - k)
    y = (1 - b_ - k) / (1 - k)
    return c, m, y, k

def cmyk_to_rgb(c, m, y, k):
    """Convert CMYK (0-1) to RGB (0-255)."""
    r = 255 * (1 - c) * (1 - k)
    g = 255 * (1 - m) * (1 - k)
    b = 255 * (1 - y) * (1 - k)
    return int(r), int(g), int(b)

# Test colors
test_colors = {
    'Vivid Red': (255, 0, 0),
    'Electric Blue': (0, 100, 255),
    'Neon Green': (0, 255, 0),
    'Muga Gold': (212, 160, 23),
    'Deep Purple': (75, 0, 130),
    'Coral': (255, 127, 80),
    'Teal': (0, 128, 128),
    'Hot Pink': (255, 20, 147),
}

fig, axes = plt.subplots(2, 4, figsize=(16, 6))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('RGB vs CMYK Round-Trip: What Changes?', color='white', fontsize=14, y=1.02)

for ax, (name, (r, g, b)) in zip(axes.flatten(), test_colors.items()):
    ax.set_facecolor('#111827')

    # Original RGB
    c, m, y, k = rgb_to_cmyk(r, g, b)
    # Round-trip: RGB → CMYK → RGB
    r2, g2, b2 = cmyk_to_rgb(c, m, y, k)

    # Show both colors
    ax.add_patch(plt.Rectangle((0, 0.5), 1, 0.5, color=(r/255, g/255, b/255)))
    ax.add_patch(plt.Rectangle((0, 0), 1, 0.5, color=(r2/255, g2/255, b2/255)))

    ax.text(0.5, 0.75, f'RGB\\n({r},{g},{b})', ha='center', va='center',
            color='white' if (r+g+b)/3 < 128 else '#1f2937', fontsize=7, fontweight='bold')
    ax.text(0.5, 0.25, f'Round-trip\\n({r2},{g2},{b2})', ha='center', va='center',
            color='white' if (r2+g2+b2)/3 < 128 else '#1f2937', fontsize=7, fontweight='bold')

    # Calculate color difference
    diff = np.sqrt((r-r2)**2 + (g-g2)**2 + (b-b2)**2)
    ax.set_title(f'{name}\\ndE={diff:.1f}', color='white', fontsize=9)
    ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("RGB <-> CMYK round-trip results:")
for name, (r, g, b) in test_colors.items():
    c, m, y, k = rgb_to_cmyk(r, g, b)
    r2, g2, b2 = cmyk_to_rgb(c, m, y, k)
    diff = np.sqrt((r-r2)**2 + (g-g2)**2 + (b-b2)**2)
    print(f"  {name}: ({r},{g},{b}) -> CMYK({c:.2f},{m:.2f},{y:.2f},{k:.2f}) -> ({r2},{g2},{b2}) dE={diff:.1f}")`,
      challenge: 'The round-trip should be lossless in theory (it is for these pure math conversions). But real printers have limited ink precision. Add random noise (+-3%) to each CMYK value before converting back and see how much the colors shift.',
      successHint: 'The RGB/CMYK distinction is not academic — it affects every designer, photographer, and print professional. Understanding gamuts prevents costly reprinting mistakes.',
    },
    {
      title: 'Color spaces — mapping all possible colors',
      concept: `RGB and CMYK define how devices produce color, but they don't describe all colors humans can see. For that, we need **color spaces** — mathematical models that map every perceptible color to a coordinate.

Key color spaces:
- **sRGB**: the standard for web and most screens. Covers ~35% of visible colors.
- **Adobe RGB**: wider gamut, used in professional photography. ~50% of visible.
- **Display P3**: Apple's wide-gamut standard. ~45% of visible.
- **ProPhoto RGB**: very wide, covers ~90%, but includes "imaginary" colors.

**HSL/HSV** — more intuitive than RGB:
- **H** (Hue): the color itself, as an angle on a wheel (0°=red, 120°=green, 240°=blue)
- **S** (Saturation): how vivid the color is (0=grey, 100=pure color)
- **L/V** (Lightness/Value): how bright (0=black, 100=white)

HSL is how humans naturally think about color: "a dark, vivid blue" = H:240, S:high, L:low. Designers and artists prefer HSL because adjusting one parameter (e.g., making a color lighter) doesn't affect the other two — unlike RGB where lightening a blue means increasing all three channels.`,
      analogy: 'Color spaces are like different map projections of the Earth. A Mercator projection distorts areas near the poles; a globe doesn\'t distort at all. Similarly, RGB distorts color relationships (small RGB changes can mean big perceived changes or vice versa). CIE Lab is like the globe — it tries to make distances proportional to perceived differences.',
      storyConnection: 'The girl\'s monsoon palette existed in a "color space" defined by her available pigments — a limited gamut of earthy tones. A wider pigment set would have expanded her gamut, just as upgrading from sRGB to Display P3 expands a screen\'s gamut. Her artistic choices were shaped by the boundaries of her color space.',
      checkQuestion: 'Two colors are 10 units apart in RGB space. Are they guaranteed to look different to a human?',
      checkAnswer: 'No. RGB is not perceptually uniform. A 10-unit change in the dark range (e.g., from (5,5,5) to (15,15,15)) is easily visible, but a 10-unit change in bright yellows might be imperceptible. This is why perceptually uniform color spaces like CIE Lab exist — in Lab, equal distances correspond to equal perceived differences.',
      codeIntro: 'Visualize the HSL color wheel and compare sRGB vs wider gamuts.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# --- HSL Color Wheel ---
ax1.set_facecolor('#111827')
theta = np.linspace(0, 2*np.pi, 360)
r_inner, r_outer = 0.5, 1.0
for i in range(360):
    # Convert hue angle to RGB
    h = i / 360.0
    # HSL to RGB (S=1, L=0.5 = fully saturated)
    c = 1.0  # chroma
    x = c * (1 - abs((h * 6) % 2 - 1))
    if h < 1/6: rgb = (c, x, 0)
    elif h < 2/6: rgb = (x, c, 0)
    elif h < 3/6: rgb = (0, c, x)
    elif h < 4/6: rgb = (0, x, c)
    elif h < 5/6: rgb = (x, 0, c)
    else: rgb = (c, 0, x)

    a1 = theta[i]
    a2 = theta[(i+1) % 360]
    wedge = plt.Polygon([
        [0.5 + r_inner * np.cos(a1), 0.5 + r_inner * np.sin(a1)],
        [0.5 + r_outer * np.cos(a1), 0.5 + r_outer * np.sin(a1)],
        [0.5 + r_outer * np.cos(a2), 0.5 + r_outer * np.sin(a2)],
        [0.5 + r_inner * np.cos(a2), 0.5 + r_inner * np.sin(a2)],
    ], color=rgb)
    ax1.add_patch(wedge)

# Label angles
for angle, label in [(0, 'Red 0°'), (60, 'Yellow 60°'), (120, 'Green 120°'),
                      (180, 'Cyan 180°'), (240, 'Blue 240°'), (300, 'Magenta 300°')]:
    rad = np.radians(angle)
    ax1.text(0.5 + 1.15*np.cos(rad), 0.5 + 1.15*np.sin(rad), label,
             ha='center', va='center', color='white', fontsize=7, fontweight='bold')

ax1.set_xlim(-0.8, 1.8); ax1.set_ylim(-0.8, 1.8)
ax1.set_aspect('equal')
ax1.set_xticks([]); ax1.set_yticks([])
ax1.set_title('HSL Hue Wheel (S=100%, L=50%)', color='white', fontsize=12)

# --- Gamut comparison (simplified 2D projection) ---
ax2.set_facecolor('#111827')

# Approximate gamut triangles in CIE xy coordinates
# (simplified vertices)
gamuts = {
    'sRGB': {'verts': [(0.64, 0.33), (0.30, 0.60), (0.15, 0.06)], 'color': '#3b82f6'},
    'Adobe RGB': {'verts': [(0.64, 0.33), (0.21, 0.71), (0.15, 0.06)], 'color': '#22c55e'},
    'Display P3': {'verts': [(0.68, 0.32), (0.265, 0.69), (0.15, 0.06)], 'color': '#f59e0b'},
}

# Draw spectral locus (approximate)
spectral_x = [0.175, 0.12, 0.08, 0.07, 0.10, 0.17, 0.30, 0.44, 0.55, 0.63, 0.69, 0.73]
spectral_y = [0.005, 0.06, 0.15, 0.30, 0.50, 0.65, 0.70, 0.60, 0.50, 0.37, 0.31, 0.27]
ax2.fill(spectral_x, spectral_y, alpha=0.1, color='white')
ax2.plot(spectral_x, spectral_y, color='gray', linewidth=1, linestyle='--', alpha=0.5)

for name, data in gamuts.items():
    verts = data['verts'] + [data['verts'][0]]  # close triangle
    xs, ys = zip(*verts)
    ax2.plot(xs, ys, color=data['color'], linewidth=2, label=name)
    ax2.fill(xs, ys, alpha=0.08, color=data['color'])

ax2.set_xlabel('CIE x', color='white')
ax2.set_ylabel('CIE y', color='white')
ax2.set_title('Color Gamut Comparison (CIE xy)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 0.8); ax2.set_ylim(0, 0.8)

plt.tight_layout()
plt.show()

print("Gamut coverage (approximate % of visible colors):")
print("  sRGB:       ~35% — standard web/screen")
print("  Adobe RGB:  ~50% — professional photography")
print("  Display P3: ~45% — modern Apple devices")
print()
print("Key insight: no RGB gamut covers ALL visible colors.")
print("Some colors you can see cannot be displayed on any screen.")`,
      challenge: 'Create a saturation gradient: pick one hue (e.g., H=200 for blue) and create a row of 10 color swatches from S=0% (grey) to S=100% (vivid blue), all at L=50%. This is how designers explore color variations.',
      successHint: 'Color spaces are the invisible infrastructure of digital color. Every photo you edit, every website you design, every video you watch — all operate within a specific color space. Knowing which one you are in is the difference between professional and amateur color work.',
    },
    {
      title: 'CIE chromaticity — the map of all visible colors',
      concept: `In 1931, the Commission Internationale de l'Éclairage (CIE) created the definitive map of human color perception. The **CIE chromaticity diagram** is a 2D plot where every color a human can see has a specific (x, y) coordinate.

How it was built:
1. Researchers showed observers mixtures of three monochromatic lights (red, green, blue)
2. Observers adjusted the mixture until it matched a test color
3. The amounts of R, G, B needed were recorded as **color matching functions** (x̄, ȳ, z̄)
4. These functions were transformed into a 2D (x, y) diagram

Key features of the diagram:
- The **horseshoe shape** is the spectral locus — pure single-wavelength colors around the edge
- The **straight bottom line** (purple line) connects the extreme red and violet — these purples don't exist as single wavelengths
- The **white point** is near the center (~0.33, 0.33)
- The interior contains all mixable colors
- Any two colors can be mixed by drawing a line between them; all colors on that line are achievable

The CIE diagram is the foundation of all modern color science — display calibration, printing standards, lighting design, and even legal definitions of color (traffic light specifications reference CIE coordinates).`,
      analogy: 'The CIE diagram is like a map of a country. The border (spectral locus) is defined by the purest, most saturated colors — like coastline. Interior points are mixtures — like inland cities. Moving toward the center is like moving away from the coast: colors get less saturated, more grey. The white point is the capital city, where all colors converge.',
      storyConnection: 'Every color the girl mixed on her palette occupies a specific point on the CIE diagram. Her gamut — the range of colors she could create — forms a polygon on this map. Natural pigments tend to cluster in the warm, desaturated region of the diagram. Her monsoon painting lived in a specific, bounded region of color space.',
      checkQuestion: 'Why is the CIE diagram shaped like a horseshoe rather than a circle or triangle?',
      checkAnswer: 'The horseshoe shape comes from how our cone cells respond to light. The spectral locus follows the path of single-wavelength light through CIE color space. Because our three cone types have overlapping, asymmetric response curves, the path of monochromatic light traces a horseshoe, not a smooth circle. The straight purple line at the bottom connects the two ends because purple requires mixing red and violet — it has no single wavelength.',
      codeIntro: 'Plot the CIE 1931 chromaticity diagram with the spectral locus.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# CIE 1931 spectral locus data points (x, y at each wavelength)
# Wavelengths from 380 to 700 nm
wl_data = [
    (380, 0.1741, 0.0050), (390, 0.1740, 0.0050), (400, 0.1714, 0.0051),
    (410, 0.1644, 0.0051), (420, 0.1566, 0.0177), (430, 0.1440, 0.0297),
    (440, 0.1241, 0.0578), (450, 0.0913, 0.1327), (460, 0.0687, 0.2007),
    (470, 0.0454, 0.2950), (480, 0.0235, 0.4127), (490, 0.0082, 0.5384),
    (500, 0.0039, 0.6548), (510, 0.0139, 0.7502), (520, 0.0743, 0.8338),
    (530, 0.1547, 0.8059), (540, 0.2296, 0.7543), (550, 0.3016, 0.6923),
    (560, 0.3731, 0.6245), (570, 0.4441, 0.5547), (580, 0.5125, 0.4866),
    (590, 0.5752, 0.4242), (600, 0.6270, 0.3725), (610, 0.6658, 0.3340),
    (620, 0.6915, 0.3083), (630, 0.7079, 0.2920), (640, 0.7190, 0.2809),
    (650, 0.7260, 0.2740), (660, 0.7300, 0.2700), (670, 0.7320, 0.2680),
    (680, 0.7334, 0.2666), (690, 0.7340, 0.2660), (700, 0.7347, 0.2653),
]

wl = [d[0] for d in wl_data]
cx = [d[1] for d in wl_data]
cy = [d[2] for d in wl_data]

fig, ax = plt.subplots(figsize=(9, 9))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Fill the horseshoe
all_x = cx + [cx[0]]
all_y = cy + [cy[0]]
ax.fill(all_x, all_y, alpha=0.15, color='white')

# Spectral locus
ax.plot(cx, cy, color='white', linewidth=2)
# Purple line (connect ends)
ax.plot([cx[0], cx[-1]], [cy[0], cy[-1]], color='#a855f7', linewidth=2, linestyle='--',
        label='Purple line')

# Label wavelengths
for i in range(0, len(wl_data), 3):
    w, x, y = wl_data[i]
    # Offset direction
    dx = x - 0.33
    dy = y - 0.33
    dist = np.sqrt(dx**2 + dy**2)
    ax.annotate(f'{w}', xy=(x, y), xytext=(x + dx/dist*0.04, y + dy/dist*0.04),
                color='gray', fontsize=7, ha='center')

# Plot gamut triangles
srgb = [(0.64, 0.33), (0.30, 0.60), (0.15, 0.06), (0.64, 0.33)]
p3 = [(0.68, 0.32), (0.265, 0.69), (0.15, 0.06), (0.68, 0.32)]

sx, sy = zip(*srgb)
px, py = zip(*p3)
ax.plot(sx, sy, color='#3b82f6', linewidth=2, label='sRGB', linestyle='-')
ax.plot(px, py, color='#f59e0b', linewidth=2, label='Display P3', linestyle='-')

# White point (D65)
ax.plot(0.3127, 0.3290, '*', color='white', markersize=15, label='D65 White Point')

ax.set_xlabel('CIE x', color='white', fontsize=12)
ax.set_ylabel('CIE y', color='white', fontsize=12)
ax.set_title('CIE 1931 Chromaticity Diagram', color='white', fontsize=14)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=10, loc='upper right')
ax.tick_params(colors='gray')
ax.set_xlim(-0.05, 0.8)
ax.set_ylim(-0.05, 0.9)
ax.set_aspect('equal')
ax.grid(True, alpha=0.1, color='gray')

plt.tight_layout()
plt.show()

print("The CIE 1931 diagram: the complete map of human color vision")
print()
print("Key features:")
print("  Horseshoe boundary = spectral (single-wavelength) colors")
print("  Purple line = non-spectral purples (need R+V mix)")
print("  D65 = standard daylight white point")
print("  sRGB triangle covers only ~35% of the visible area")
print("  Display P3 is wider but still misses saturated cyans/greens")`,
      challenge: 'Plot a line between two colors on the diagram (e.g., 480nm blue and 580nm yellow). All colors along this line can be produced by mixing those two wavelengths. Where does the line cross through the white point? That tells you which pairs of colors are complementary.',
      successHint: 'The CIE diagram is nearly 100 years old and still the foundation of all color science. Every display you buy, every print standard, every color specification ultimately references these coordinates.',
    },
    {
      title: 'Color perception — how the brain constructs color',
      concept: `Color is not "out there" in the world — it is constructed by your brain. The same physical stimulus can appear as completely different colors depending on context. This is not a flaw; it is a feature that helps us perceive consistent colors under changing lighting.

**Color constancy**: A red apple looks red in sunlight, under fluorescent light, at sunset, and in shade — even though the wavelengths reaching your eye are dramatically different each time. Your brain compensates for the illuminant and "adjusts" the perceived color.

**Simultaneous contrast**: A grey patch on a yellow background looks bluish; the same grey on a blue background looks yellowish. The surrounding colors shift your perception.

**Chromatic adaptation**: Walk from outside (blue-white daylight) into a room lit by warm incandescent bulbs. At first everything looks orange, but within minutes your brain adapts and whites look white again. Your cone cells adjust their sensitivity.

**Afterimages**: Stare at a green patch for 30 seconds, then look at a white wall. You see magenta (the opponent color). This is because the green-sensitive cones become fatigued and temporarily underrespond.

These phenomena prove that color is a neural computation, not a direct readout of wavelength.`,
      analogy: 'Your visual system is like an auto-adjusting camera that goes far beyond any real camera. It adjusts white balance (color constancy), contrast (simultaneous contrast), and exposure (chromatic adaptation) — all in real-time, without you knowing. The "photo" your brain produces is heavily processed, not raw.',
      storyConnection: 'The girl painted rain under monsoon clouds — diffused, grey light. Yet she could still see colors accurately because her brain compensated for the dim, blue-shifted illumination. Her ability to match colors on the palette to colors in the scene was a feat of neural color constancy. A camera in auto mode would have struggled more.',
      checkQuestion: 'The famous "dress" photo in 2015 divided the internet: some saw it as blue-and-black, others as white-and-gold. How can the same photo produce opposite color perceptions?',
      checkAnswer: 'The photo was ambiguous about the lighting conditions. People who assumed the dress was in shadow (warm light behind it) compensated by subtracting warm tones, seeing blue-and-black. People who assumed the dress was in bright, blue-white light subtracted blue tones, seeing white-and-gold. Both groups applied color constancy correctly — they just assumed different illuminants. This proved how much of color is constructed by the brain.',
      codeIntro: 'Demonstrate simultaneous contrast — the same grey looks different on different backgrounds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(15, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Color Perception Illusions', color='white', fontsize=14, y=1.02)

# The SAME grey in all patches
grey_value = 0.5

# --- Row 1: Simultaneous contrast ---
backgrounds = [
    ((0.2, 0.2, 0.2), 'Dark grey BG'),
    ((0.8, 0.8, 0.8), 'Light grey BG'),
    ((0.8, 0.6, 0.2), 'Warm BG'),
]

for ax, (bg, label) in zip(axes[0], backgrounds):
    ax.set_facecolor(bg)
    patch = plt.Rectangle((0.3, 0.3), 0.4, 0.4, color=(grey_value, grey_value, grey_value))
    ax.add_patch(patch)
    ax.text(0.5, 0.1, f'Same grey (0.5, 0.5, 0.5)', ha='center', color='white',
            fontsize=8, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='black', alpha=0.7))
    ax.set_title(label, color='white', fontsize=11)
    ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    ax.set_xticks([]); ax.set_yticks([])

# --- Row 2: Chromatic contrast ---
chromatic_bgs = [
    ((0.9, 0.2, 0.2), 'Red BG'),
    ((0.2, 0.9, 0.2), 'Green BG'),
    ((0.2, 0.2, 0.9), 'Blue BG'),
]

for ax, (bg, label) in zip(axes[1], chromatic_bgs):
    ax.set_facecolor(bg)
    patch = plt.Rectangle((0.3, 0.3), 0.4, 0.4, color=(grey_value, grey_value, grey_value))
    ax.add_patch(patch)
    ax.text(0.5, 0.1, f'Same grey (0.5, 0.5, 0.5)', ha='center', color='white',
            fontsize=8, fontweight='bold',
            bbox=dict(boxstyle='round', facecolor='black', alpha=0.7))
    ax.set_title(label, color='white', fontsize=11)
    ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("ALL six grey patches are IDENTICAL: RGB (128, 128, 128)")
print()
print("But they look different because your brain adjusts:")
print("  On dark background: grey looks LIGHTER")
print("  On light background: grey looks DARKER")
print("  On red background: grey looks slightly CYAN (greenish)")
print("  On green background: grey looks slightly MAGENTA (pinkish)")
print("  On blue background: grey looks slightly YELLOW")
print()
print("Your brain pushes perceived color AWAY from the surround.")
print("This is simultaneous contrast — a fundamental law of vision.")`,
      challenge: 'Create the same illusion with a colored patch (e.g., a pale yellow) on different backgrounds. Does the effect get stronger or weaker with chromatic (colored) patches compared to grey?',
      successHint: 'Color perception illusions are not just curiosities — they are fundamental constraints that designers, artists, and display engineers must account for. The same color, in different contexts, WILL look different. There is no escaping this fact of neuroscience.',
    },
    {
      title: 'Color blindness — when cone cells differ',
      concept: `About 8% of men and 0.5% of women have some form of **color vision deficiency** (CVD). This is not blindness — it is a difference in cone cell function.

Types:
- **Protanopia**: missing L-cones (red). Red and green look similar. ~1% of males.
- **Deuteranopia**: missing M-cones (green). Also confuses red/green. ~1% of males.
- **Protanomaly/Deuteranomaly**: shifted L or M-cones (less severe). ~6% of males.
- **Tritanopia**: missing S-cones (blue). Very rare (~0.003%). Blue and yellow confused.
- **Achromatopsia**: no working cones at all. Sees only shades of grey. Extremely rare.

Why mostly males? The genes for L and M-cones are on the **X chromosome**. Males (XY) have only one X — if it carries a defective gene, there's no backup. Females (XX) have two X chromosomes — a working gene on one can compensate for a defective gene on the other.

Designing for CVD means:
- Never use color alone to convey information (add patterns, labels, shapes)
- Avoid red/green as the only distinction
- Use color palettes tested with CVD simulators
- About 300 million people worldwide have CVD — that's more than the population of the USA`,
      analogy: 'Imagine you have three radio receivers tuned to different stations (L, M, S cones). If one receiver is broken, you can still hear two stations — you don\'t go deaf. But you can\'t distinguish songs that differ only in the broken station\'s frequency range. Color blindness is losing one "channel," not all of them.',
      storyConnection: 'If the girl who painted rain had deuteranopia, her monsoon painting would look different to her — the greens of wet leaves and the reds of laterite soil might appear as similar muddy tones. But she could still paint beautifully; she would just work with a different subset of distinguishable colors. Many great artists have had CVD.',
      checkQuestion: 'A traffic light uses red, yellow, and green — all of which can be confused by protanopes. How do traffic lights remain usable for color-blind drivers?',
      checkAnswer: 'Position encodes the information redundantly: red is always on top, green always on bottom. Modern LED traffic lights also use specific shades with added blue (green signal) to increase distinguishability. Some jurisdictions use different shapes for each light. The key principle: never rely on color alone.',
      codeIntro: 'Simulate how different types of color blindness affect color perception.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def simulate_cvd(rgb, cvd_type):
    """Simulate color vision deficiency using transformation matrices."""
    r, g, b = rgb
    if cvd_type == 'normal':
        return rgb
    elif cvd_type == 'protanopia':
        # Missing L-cones
        m = np.array([[0.567, 0.433, 0.000],
                       [0.558, 0.442, 0.000],
                       [0.000, 0.242, 0.758]])
    elif cvd_type == 'deuteranopia':
        # Missing M-cones
        m = np.array([[0.625, 0.375, 0.000],
                       [0.700, 0.300, 0.000],
                       [0.000, 0.300, 0.700]])
    elif cvd_type == 'tritanopia':
        # Missing S-cones
        m = np.array([[0.950, 0.050, 0.000],
                       [0.000, 0.433, 0.567],
                       [0.000, 0.475, 0.525]])
    result = m @ np.array([r, g, b])
    return tuple(np.clip(result, 0, 1))

# Test palette
colors = {
    'Red': (0.9, 0.2, 0.1),
    'Green': (0.2, 0.8, 0.2),
    'Blue': (0.2, 0.3, 0.9),
    'Yellow': (0.95, 0.9, 0.1),
    'Orange': (0.95, 0.5, 0.1),
    'Purple': (0.6, 0.1, 0.8),
    'Cyan': (0.1, 0.8, 0.8),
    'Brown': (0.6, 0.3, 0.1),
}

cvd_types = ['normal', 'protanopia', 'deuteranopia', 'tritanopia']
cvd_labels = ['Normal Vision', 'Protanopia (no red cones)', 'Deuteranopia (no green cones)', 'Tritanopia (no blue cones)']

fig, axes = plt.subplots(4, 1, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

for ax, cvd, label in zip(axes, cvd_types, cvd_labels):
    ax.set_facecolor('#111827')
    for i, (name, rgb) in enumerate(colors.items()):
        simulated = simulate_cvd(rgb, cvd)
        ax.add_patch(plt.Rectangle((i, 0), 0.9, 1, color=simulated))
        ax.text(i + 0.45, -0.15, name, ha='center', va='top', color='white',
                fontsize=7, rotation=30)
    ax.set_xlim(-0.2, len(colors) + 0.1)
    ax.set_ylim(-0.4, 1.1)
    ax.set_title(label, color='white', fontsize=10, loc='left')
    ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Color confusion pairs:")
print("  Protanopia: red≈green, orange≈brown")
print("  Deuteranopia: red≈green (different from protanopia)")
print("  Tritanopia: blue≈green, yellow≈pink")
print()
print("Design rules for accessibility:")
print("  1. Never use color ALONE to convey meaning")
print("  2. Add patterns, text labels, or shapes")
print("  3. Test with CVD simulators")
print(f"  4. ~300 million people have CVD worldwide")`,
      challenge: 'Create a pie chart with 6 categories. First, color it with a standard palette (rainbow colors). Then create a CVD-friendly version using patterns, textures, or a colorblind-safe palette (like viridis). Which is more universally readable?',
      successHint: 'Accessibility is not optional — it is ethical engineering. Understanding color blindness is not just medical knowledge; it is essential for every designer, developer, and data scientist.',
    },
    {
      title: 'Digital color manipulation with Python',
      concept: `Every digital image is a 3D array of numbers: rows × columns × color channels. A 1920×1080 RGB image is a matrix of shape (1080, 1920, 3), containing 6.2 million numbers.

Manipulating images programmatically means manipulating these numbers:
- **Brightness**: multiply all channels by a constant (>1 = brighter, <1 = darker)
- **Contrast**: stretch the range of values (increase the difference between dark and light)
- **Saturation**: in HSL space, adjust the S channel
- **Color balance**: multiply individual R, G, or B channels
- **Inversion**: new_value = 255 - old_value
- **Thresholding**: set pixels above/below a value to white/black
- **Convolution**: apply kernels (blur, sharpen, edge detection)

Instagram filters are literally sequences of these mathematical operations applied to pixel arrays. Every photo editing app — from Photoshop to Snapseed — operates on the same matrix math.

Python libraries: **Pillow** (PIL) for basic operations, **OpenCV** for advanced computer vision, **scikit-image** for scientific image processing, **NumPy** for raw array manipulation. Matplotlib can display the results.`,
      analogy: 'Think of a digital image as a spreadsheet with millions of cells, each containing three numbers (R, G, B). Changing brightness is like multiplying an entire column. Changing color balance is like multiplying only specific columns. Blur is like replacing each cell with the average of its neighbors. Every photo effect is a spreadsheet operation.',
      storyConnection: 'If the girl\'s monsoon painting were photographed and loaded into Python, it would become a matrix of numbers. Adjusting the warmth to capture the golden light before rain, boosting the contrast of dark clouds against bright sky, desaturating to mimic the muted monsoon palette — all possible by manipulating the numbers that encode her colors.',
      checkQuestion: 'Why do JPEG images lose quality when saved repeatedly, but PNG images do not?',
      checkAnswer: 'JPEG uses lossy compression — it approximates blocks of pixels with mathematical functions (DCT), discarding detail to reduce file size. Each save re-approximates, losing more detail (generation loss). PNG uses lossless compression — it encodes the exact pixel values using patterns (like zip), so no information is ever lost. JPEG trades quality for small files; PNG preserves quality at larger sizes.',
      codeIntro: 'Generate a synthetic image and apply color transformations programmatically.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate a synthetic "monsoon scene" gradient
h, w = 200, 400
img = np.zeros((h, w, 3))

# Sky gradient (dark blue-grey at top to lighter at bottom)
for y in range(h):
    t = y / h
    # Top: dark blue-grey, bottom: warm grey
    img[y, :, 0] = 0.25 + 0.2 * t  # R
    img[y, :, 1] = 0.3 + 0.15 * t   # G
    img[y, :, 2] = 0.45 - 0.1 * t   # B

# Add some "rain" texture
np.random.seed(42)
rain = np.random.random((h, w)) > 0.97
img[rain] = [0.7, 0.75, 0.8]

# Apply transformations
def adjust_brightness(img, factor):
    return np.clip(img * factor, 0, 1)

def adjust_contrast(img, factor):
    mean = np.mean(img)
    return np.clip((img - mean) * factor + mean, 0, 1)

def warm_filter(img, strength=0.1):
    result = img.copy()
    result[:,:,0] = np.clip(result[:,:,0] + strength, 0, 1)  # more red
    result[:,:,2] = np.clip(result[:,:,2] - strength, 0, 1)  # less blue
    return result

def cool_filter(img, strength=0.1):
    result = img.copy()
    result[:,:,0] = np.clip(result[:,:,0] - strength, 0, 1)
    result[:,:,2] = np.clip(result[:,:,2] + strength, 0, 1)
    return result

def invert(img):
    return 1.0 - img

def desaturate(img, amount=0.5):
    grey = np.mean(img, axis=2, keepdims=True)
    return np.clip(img * (1 - amount) + grey * amount, 0, 1)

transformations = [
    ('Original', img),
    ('Brighter (×1.5)', adjust_brightness(img, 1.5)),
    ('High Contrast', adjust_contrast(img, 2.0)),
    ('Warm Filter', warm_filter(img, 0.15)),
    ('Cool Filter', cool_filter(img, 0.15)),
    ('Desaturated', desaturate(img, 0.8)),
    ('Inverted', invert(img)),
    ('Dark + Warm', warm_filter(adjust_brightness(img, 0.6), 0.1)),
]

fig, axes = plt.subplots(2, 4, figsize=(16, 6))
fig.patch.set_facecolor('#1f2937')

for ax, (title, transformed) in zip(axes.flatten(), transformations):
    ax.imshow(transformed, aspect='auto')
    ax.set_title(title, color='white', fontsize=10)
    ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Each transformation is pure math on a pixel array:")
print("  Brightness: pixel × factor")
print("  Contrast: (pixel - mean) × factor + mean")
print("  Warm filter: R += amount, B -= amount")
print("  Cool filter: R -= amount, B += amount")
print("  Desaturate: blend toward greyscale")
print("  Invert: 1.0 - pixel")
print()
print("Instagram filters = chains of these basic operations.")
print("Every photo app uses the same underlying math.")`,
      challenge: 'Create a "vintage photo" filter by combining: desaturate by 40%, add warmth, reduce contrast slightly, and add a slight vignette (darken the edges). Chain these operations in sequence.',
      successHint: 'Digital color manipulation is where physics, math, and art converge. Every pixel is a number, and every visual effect is an equation. With Python, you have complete, precise control over every one of those numbers.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Some science background helpful</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for color science and image processing. Click to start.</p>
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
