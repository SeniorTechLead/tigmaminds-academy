import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PaintedRainLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is color? — Light, wavelengths, and perception',
      concept: `When the girl in the story painted rain on her canvas, the colors she saw weren't really "in" the paint — they were in her eyes and brain. **Color is how our brains interpret different wavelengths of light.**

Light is an electromagnetic wave. The wavelength — the distance between wave peaks — determines the color we see:
- **Red**: ~700 nm (long wavelength)
- **Orange**: ~600 nm
- **Yellow**: ~580 nm
- **Green**: ~520 nm
- **Blue**: ~470 nm
- **Violet**: ~400 nm (short wavelength)

When white light (all wavelengths mixed together) hits a red pigment, the pigment **absorbs** blue and green wavelengths and **reflects** red. That reflected red light enters your eye, hits cone cells in your retina, and your brain says "red." Color is not a property of objects — it's a property of the light that bounces off them and how your brain interprets that light.`,
      analogy: 'Imagine a crowd of people walking toward a wall. The wall has holes that only let short people through. The tall people bounce back. If you could only see the bounced-back people, you\'d say "that wall is tall-person-colored." Pigments work the same way — they let some wavelengths through (absorb them) and bounce others back (reflect them).',
      storyConnection: 'The girl painted rain using colors found in nature — the grey of clouds, the silver of falling water, the green of wet leaves. Each color she mixed was really a cocktail of wavelengths. Her art succeeded because she understood, intuitively, which wavelengths to reflect off her canvas to recreate the monsoon.',
      checkQuestion: 'If a leaf absorbs red and blue light, what color does it appear?',
      checkAnswer: 'Green. The leaf reflects the wavelengths it does not absorb. Since it absorbs red and blue, the remaining reflected light is primarily green — which is exactly why most leaves look green. The chlorophyll molecule is responsible for this specific absorption pattern.',
      codeIntro: 'Visualize the visible light spectrum and how wavelength maps to color.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import hsv_to_rgb

# Create the visible spectrum (380-750 nm)
wavelengths = np.linspace(380, 750, 1000)

def wavelength_to_rgb(wl):
    """Convert wavelength in nm to approximate RGB."""
    if 380 <= wl < 440:
        r, g, b = -(wl - 440) / (440 - 380), 0.0, 1.0
    elif 440 <= wl < 490:
        r, g, b = 0.0, (wl - 440) / (490 - 440), 1.0
    elif 490 <= wl < 510:
        r, g, b = 0.0, 1.0, -(wl - 510) / (510 - 490)
    elif 510 <= wl < 580:
        r, g, b = (wl - 510) / (580 - 510), 1.0, 0.0
    elif 580 <= wl < 645:
        r, g, b = 1.0, -(wl - 645) / (645 - 580), 0.0
    elif 645 <= wl <= 750:
        r, g, b = 1.0, 0.0, 0.0
    else:
        r, g, b = 0.0, 0.0, 0.0
    # Intensity falls off at edges
    if 380 <= wl < 420:
        factor = 0.3 + 0.7 * (wl - 380) / (420 - 380)
    elif 700 < wl <= 750:
        factor = 0.3 + 0.7 * (750 - wl) / (750 - 700)
    else:
        factor = 1.0
    return [r * factor, g * factor, b * factor]

colors = np.array([wavelength_to_rgb(wl) for wl in wavelengths])

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 5), gridspec_kw={'height_ratios': [1, 2]})
fig.patch.set_facecolor('#1f2937')

# Spectrum bar
ax1.set_facecolor('#111827')
for i in range(len(wavelengths) - 1):
    ax1.axvspan(wavelengths[i], wavelengths[i+1], color=colors[i], alpha=1)
ax1.set_xlim(380, 750)
ax1.set_yticks([])
ax1.set_title('The Visible Light Spectrum', color='white', fontsize=13)
ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.tick_params(colors='gray')

# Cone sensitivity curves
ax2.set_facecolor('#111827')
wl = np.linspace(380, 750, 500)
# Approximate cone response curves (Gaussian)
s_cone = np.exp(-0.5 * ((wl - 440) / 20)**2)  # blue
m_cone = np.exp(-0.5 * ((wl - 535) / 40)**2)  # green
l_cone = np.exp(-0.5 * ((wl - 565) / 45)**2)  # red

ax2.plot(wl, s_cone, color='#3b82f6', linewidth=2, label='S-cone (blue)')
ax2.plot(wl, m_cone, color='#22c55e', linewidth=2, label='M-cone (green)')
ax2.plot(wl, l_cone, color='#ef4444', linewidth=2, label='L-cone (red)')
ax2.fill_between(wl, s_cone, alpha=0.1, color='#3b82f6')
ax2.fill_between(wl, m_cone, alpha=0.1, color='#22c55e')
ax2.fill_between(wl, l_cone, alpha=0.1, color='#ef4444')
ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Relative sensitivity', color='white')
ax2.set_title('Human Cone Cell Responses', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Your eye has 3 types of cone cells:")
print("  S-cones peak at ~440nm (blue)")
print("  M-cones peak at ~535nm (green)")
print("  L-cones peak at ~565nm (red-ish)")
print()
print("Every color you see is your brain mixing")
print("signals from these 3 cone types.")`,
      challenge: 'What happens if you remove the M-cone (green) curve? Plot only S and L cones. How many distinct colors could you perceive with just two cone types? (Hint: dogs have only 2 cone types.)',
      successHint: 'Color is a construction of your nervous system, not a property of the physical world. Understanding this distinction is the foundation of color science, display technology, and vision research.',
    },
    {
      title: 'Primary colors — why light and paint play by different rules',
      concept: `There are two completely different systems of primary colors, and confusing them is one of the most common mistakes in science education:

**Additive primaries (light)**: Red, Green, Blue (RGB)
- Mixing all three = **white** light
- Used in screens, projectors, stage lighting
- Start with darkness, add light

**Subtractive primaries (pigment)**: Cyan, Magenta, Yellow (CMY)
- Mixing all three = **black** (absorbs all light)
- Used in painting, printing, dyeing
- Start with white (paper/canvas reflects all light), add pigments that absorb

Why the difference? Light mixing adds wavelengths together. Pigment mixing subtracts wavelengths (each pigment absorbs some light, leaving less). The girl who painted rain used subtractive mixing — every brushstroke removed wavelengths from the white canvas.

The old "primary colors are red, yellow, blue" taught in schools is actually wrong. The true subtractive primaries are cyan, magenta, and yellow — which is why printers use CMY(K) ink, not RYB.`,
      analogy: 'Additive mixing is like three spotlights on a dark stage — overlap them and you get brighter (more light). Subtractive mixing is like three sunglasses stacked together — each one blocks more light, so stacking them all gives you darkness. Screens use spotlights. Paint uses sunglasses.',
      storyConnection: 'When the girl mixed her pigments to capture the monsoon sky, she was doing subtractive color mixing. The grey of rainclouds? That required mixing pigments that together absorbed most wavelengths, reflecting only a little — creating a muted, desaturated color. The silver of rain required the opposite: pigments that reflected almost everything.',
      checkQuestion: 'If you shine a red spotlight and a green spotlight on the same white wall, what color do you see? What if you mix red paint and green paint?',
      checkAnswer: 'Red + green light = yellow (additive mixing — more wavelengths, brighter). Red + green paint = a muddy brown/olive (subtractive mixing — both paints absorb many wavelengths, leaving very little reflected light). Same "colors," opposite results, because light and paint follow different rules.',
      codeIntro: 'Simulate additive (RGB) and subtractive (CMY) color mixing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# --- Additive mixing (RGB) ---
ax = axes[0]
ax.set_facecolor('#111827')
ax.set_aspect('equal')
ax.set_title('Additive Mixing (Light)', color='white', fontsize=13)

theta = np.linspace(0, 2*np.pi, 300)
r = 0.35
centers = [(0, 0.2), (-0.17, -0.1), (0.17, -0.1)]
colors_rgb = [(1,0,0,0.5), (0,1,0,0.5), (0,0,1,0.5)]
labels = ['Red', 'Green', 'Blue']

for (cx, cy), col, label in zip(centers, colors_rgb, labels):
    circle = plt.Circle((cx, cy), r, color=col[:3], alpha=0.4)
    ax.add_patch(circle)
    ax.text(cx + (cx - 0)*0.8, cy + (cy - 0.03)*0.8, label,
            color='white', ha='center', fontsize=9, fontweight='bold')

# Label overlaps
ax.text(0, 0.0, 'White', color='white', ha='center', fontsize=8, fontweight='bold')
ax.text(-0.12, 0.12, 'Yellow', color='#fbbf24', ha='center', fontsize=7)
ax.text(0.12, 0.12, 'Magenta', color='#d946ef', ha='center', fontsize=7)
ax.text(0, -0.08, 'Cyan', color='#22d3ee', ha='center', fontsize=7)

ax.set_xlim(-0.7, 0.7)
ax.set_ylim(-0.6, 0.7)
ax.set_xticks([]); ax.set_yticks([])

# --- Subtractive mixing (CMY) ---
ax = axes[1]
ax.set_facecolor('#f5f5f0')  # white-ish paper
ax.set_aspect('equal')
ax.set_title('Subtractive Mixing (Pigment)', color='white', fontsize=13)

colors_cmy = [(0, 1, 1, 0.5), (1, 0, 1, 0.5), (1, 1, 0, 0.5)]
labels_cmy = ['Cyan', 'Magenta', 'Yellow']

for (cx, cy), col, label in zip(centers, colors_cmy, labels_cmy):
    circle = plt.Circle((cx, cy), r, color=col[:3], alpha=0.4)
    ax.add_patch(circle)
    ax.text(cx + (cx - 0)*0.8, cy + (cy - 0.03)*0.8, label,
            color='#1f2937', ha='center', fontsize=9, fontweight='bold')

ax.text(0, 0.0, 'Black', color='white', ha='center', fontsize=8,
        fontweight='bold', bbox=dict(boxstyle='round', facecolor='black', alpha=0.8))
ax.text(-0.12, 0.12, 'Red', color='#dc2626', ha='center', fontsize=7, fontweight='bold')
ax.text(0.12, 0.12, 'Blue', color='#2563eb', ha='center', fontsize=7, fontweight='bold')
ax.text(0, -0.08, 'Green', color='#16a34a', ha='center', fontsize=7, fontweight='bold')

ax.set_xlim(-0.7, 0.7)
ax.set_ylim(-0.6, 0.7)
ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("ADDITIVE (light): R+G=Yellow, R+B=Magenta, G+B=Cyan, R+G+B=White")
print("SUBTRACTIVE (pigment): C+M=Blue, C+Y=Green, M+Y=Red, C+M+Y=Black")
print()
print("Key insight: the secondary colors of one system")
print("are the primary colors of the other!")`,
      challenge: 'Printers use CMYK (K = black). Why add a separate black ink when C+M+Y should make black? Try mixing imperfect CMY values (e.g., C=0.8, M=0.75, Y=0.85) and see what color you get.',
      successHint: 'Once you understand additive vs. subtractive mixing, you understand why TV screens use RGB pixels, printers use CMYK ink, and painters mix on palettes. These are not arbitrary choices — they follow directly from the physics of light.',
    },
    {
      title: 'Pigment chemistry — what makes a pigment a pigment?',
      concept: `A **pigment** is a substance that absorbs specific wavelengths of light and reflects the rest. What makes something a good pigment?

1. **Conjugated bonds**: Molecules with alternating single-double bonds have electrons that can absorb visible light. The more conjugated bonds, the longer the wavelength absorbed (and the redder the color).

2. **Stability**: A pigment must not break down in light, water, or air. Some pigments last millennia (iron oxide in cave paintings); others fade in weeks (many organic dyes).

3. **Particle size**: Ground finer = more surface area = more intense color. Medieval artists spent hours grinding pigments with a muller on a stone slab.

Common pigment types:
- **Metal oxides**: Iron oxide (red ochre, yellow ochre), titanium dioxide (white)
- **Metal compounds**: Cobalt blue, cadmium yellow, lead white (toxic!)
- **Organic**: Indigo (from plants), carmine (from insects), saffron yellow
- **Synthetic**: Prussian blue (first modern synthetic pigment, 1706)

The chemistry of a pigment determines exactly which wavelengths it absorbs. Change one atom in the molecule and the color can shift dramatically.`,
      analogy: 'Think of a pigment molecule as a tuning fork. Each tuning fork vibrates at a specific frequency (pitch). Similarly, each pigment molecule absorbs light at specific frequencies (colors). A red pigment is "tuned" to absorb blue and green light. Change the size or shape of the fork, and it vibrates at a different frequency — change the molecule, and it absorbs different colors.',
      storyConnection: 'The girl gathered pigments from the earth around her — ochre from clay, green from crushed leaves, dark tones from charcoal. She was doing what humans have done for 40,000 years: extracting metal oxides and organic compounds from nature to make color. Her monsoon palette was chemistry, applied with intuition.',
      checkQuestion: 'Why did so many historical pigments turn out to be poisonous (lead white, arsenic green, mercury vermilion)?',
      checkAnswer: 'Heavy metals and metalloids form brightly colored compounds because their electron structures absorb visible light effectively. Unfortunately, the same electronic properties that make them colorful also make them reactive in biological systems — they disrupt enzymes, damage DNA, and accumulate in organs. Beautiful color and toxicity often share the same chemical root.',
      codeIntro: 'Simulate the absorption spectra of different pigments.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 750, 500)

def gaussian(x, mu, sigma, amplitude=1.0):
    return amplitude * np.exp(-0.5 * ((x - mu) / sigma) ** 2)

# Pigment absorption spectra (simplified)
pigments = {
    'Red Ochre (Fe2O3)': {
        'absorption': gaussian(wavelengths, 450, 40, 0.8) + gaussian(wavelengths, 530, 50, 0.9),
        'color': '#b5451b'
    },
    'Indigo': {
        'absorption': gaussian(wavelengths, 600, 50, 0.95) + gaussian(wavelengths, 700, 40, 0.7),
        'color': '#284b8c'
    },
    'Saffron Yellow': {
        'absorption': gaussian(wavelengths, 420, 30, 0.9) + gaussian(wavelengths, 460, 35, 0.7),
        'color': '#e6a817'
    },
    'Chlorophyll (leaf green)': {
        'absorption': gaussian(wavelengths, 430, 20, 0.95) + gaussian(wavelengths, 660, 25, 0.85),
        'color': '#2d7a3a'
    },
}

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

for ax, (name, data) in zip(axes.flatten(), pigments.items()):
    ax.set_facecolor('#111827')
    absorption = data['absorption']
    reflectance = 1 - absorption

    ax.fill_between(wavelengths, absorption, alpha=0.3, color='#ef4444', label='Absorbed')
    ax.fill_between(wavelengths, reflectance, alpha=0.3, color='#22c55e', label='Reflected')
    ax.plot(wavelengths, absorption, color='#ef4444', linewidth=1.5)
    ax.plot(wavelengths, reflectance, color='#22c55e', linewidth=1.5)

    # Color swatch
    ax.add_patch(plt.Rectangle((700, 0.75), 45, 0.2, color=data['color'], transform=ax.transData))
    ax.text(722, 0.85, 'Color', color='white', ha='center', fontsize=7, fontweight='bold')

    ax.set_title(name, color='white', fontsize=11)
    ax.set_xlabel('Wavelength (nm)', color='white', fontsize=8)
    ax.set_ylabel('Fraction', color='white', fontsize=8)
    ax.set_ylim(0, 1.05)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='center right')
    ax.tick_params(colors='gray', labelsize=7)

plt.tight_layout()
plt.show()

print("What makes each pigment its color:")
print("  Red Ochre: absorbs blue+green, reflects red+orange")
print("  Indigo: absorbs red+orange, reflects blue")
print("  Saffron: absorbs violet+blue, reflects yellow+orange+red")
print("  Chlorophyll: absorbs violet+blue AND red, reflects GREEN")
print()
print("Chlorophyll has TWO absorption peaks — that's why")
print("leaves are green: it's the only color NOT absorbed.")`,
      challenge: 'Design a pigment that appears purple. What wavelengths should it absorb? Create a new absorption spectrum with peaks in the green region (around 500-560nm) and see if the reflected light looks purple.',
      successHint: 'Every color you see in the world — the blue sky, green leaves, red clay — is determined by which wavelengths are absorbed and which are reflected. Pigment chemistry is the molecular explanation for the visual world.',
    },
    {
      title: 'Mixing colors — the math of subtractive blending',
      concept: `When the girl mixed pigments on her palette, she was performing a mathematical operation: multiplying reflectance curves.

If Pigment A reflects 80% of red light and Pigment B reflects 50% of red light, the mixture reflects approximately **0.8 × 0.5 = 40%** of red light. This is the **multiplicative model** of subtractive mixing:

**R_mix(λ) = R_A(λ) × R_B(λ)**

This is why mixing paints always makes colors **darker** — each pigment removes some light, and the combination removes more. It's also why mixing too many pigments gives you muddy brown/grey: you've absorbed most of the visible spectrum.

Artists learn to mix with as few pigments as possible. A skilled painter can create any color from just 5-6 base pigments. The girl painting rain would need:
- White (titanium dioxide — reflects everything)
- A warm red, a cool blue, a bright yellow
- Black (carbon — absorbs everything)
- Perhaps a green (to avoid mixing blue+yellow, which often turns muddy)`,
      analogy: 'Mixing pigments is like passing light through multiple filters. If you put on red sunglasses (blocks blue and green) and then put blue sunglasses on top (blocks red and green), almost no light gets through — you see near-black. Each filter/pigment subtracts; the combination subtracts more.',
      storyConnection: 'The girl spent hours mixing on her palette to get the exact grey of monsoon clouds — not too blue, not too warm. That grey required a careful balance: enough absorption to darken the white canvas, but evenly across all wavelengths so no single color dominated. Grey is the hardest color to mix because it requires perfect balance.',
      checkQuestion: 'Why does mixing all paint colors together give you a muddy dark brown instead of a clean black?',
      checkAnswer: 'Real pigments are impure — they don\'t absorb exactly the wavelengths they should. Each has absorption "tails" that leak into neighboring wavelengths. When you mix many impure pigments, the overlapping tails leave small amounts of warm (red/orange) light reflected, giving that characteristic muddy brown. A true black requires a pigment like carbon black that absorbs uniformly across all wavelengths.',
      codeIntro: 'Simulate subtractive color mixing by multiplying reflectance curves.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 750, 500)

def gaussian(x, mu, sigma, amp=1.0):
    return amp * np.exp(-0.5 * ((x - mu) / sigma) ** 2)

# Define pigment reflectance curves
cyan_r = 1 - (gaussian(wavelengths, 650, 60, 0.9) + gaussian(wavelengths, 700, 50, 0.7))
cyan_r = np.clip(cyan_r, 0.05, 1)

yellow_r = 1 - (gaussian(wavelengths, 430, 30, 0.9) + gaussian(wavelengths, 400, 25, 0.8))
yellow_r = np.clip(yellow_r, 0.05, 1)

magenta_r = 1 - (gaussian(wavelengths, 530, 40, 0.9))
magenta_r = np.clip(magenta_r, 0.05, 1)

# Subtractive mixing = multiply reflectances
green_mix = cyan_r * yellow_r  # cyan + yellow = green
blue_mix = cyan_r * magenta_r  # cyan + magenta = blue
red_mix = magenta_r * yellow_r  # magenta + yellow = red
dark_mix = cyan_r * magenta_r * yellow_r  # all three ≈ black

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

mixes = [
    ('Cyan + Yellow = Green', [cyan_r, yellow_r], green_mix, ['#06b6d4', '#eab308'], '#22c55e'),
    ('Cyan + Magenta = Blue', [cyan_r, magenta_r], blue_mix, ['#06b6d4', '#d946ef'], '#3b82f6'),
    ('Magenta + Yellow = Red', [magenta_r, yellow_r], red_mix, ['#d946ef', '#eab308'], '#ef4444'),
    ('C + M + Y = Near-Black', [cyan_r, magenta_r, yellow_r], dark_mix, ['#06b6d4', '#d946ef', '#eab308'], '#374151'),
]

for ax, (title, components, result, comp_colors, res_color) in zip(axes.flatten(), mixes):
    ax.set_facecolor('#111827')
    for comp, cc in zip(components, comp_colors):
        ax.plot(wavelengths, comp, color=cc, linewidth=1, alpha=0.5, linestyle='--')
    ax.plot(wavelengths, result, color=res_color, linewidth=2.5, label='Mixed result')
    ax.fill_between(wavelengths, result, alpha=0.2, color=res_color)
    ax.set_title(title, color='white', fontsize=11)
    ax.set_xlabel('Wavelength (nm)', color='white', fontsize=8)
    ax.set_ylabel('Reflectance', color='white', fontsize=8)
    ax.set_ylim(0, 1.05)
    ax.tick_params(colors='gray', labelsize=7)

plt.tight_layout()
plt.show()

print("Subtractive mixing results:")
print("  Cyan + Yellow = Green (both reflect green)")
print("  Cyan + Magenta = Blue (both reflect blue)")
print("  Magenta + Yellow = Red (both reflect red)")
print("  C + M + Y = near-black (almost nothing reflected)")
print()
print("Each pigment REMOVES light. More pigments = less light = darker.")`,
      challenge: 'Mix cyan and yellow at different ratios (e.g., 70% cyan + 30% yellow) by weighting the reflectances: mix = cyan_r**0.7 * yellow_r**0.3. How does the resulting green shift?',
      successHint: 'Color mixing is not guesswork — it is multiplication of reflectance spectra. Every painter, printer, and textile dyer applies this principle, whether they know the math or not.',
    },
    {
      title: 'Natural dyes of Assam — chemistry from the land',
      concept: `Assam has one of the richest natural dyeing traditions in the world. The Bodo, Mishing, and Karbi communities have used plant-based dyes for centuries:

- **Turmeric** (haldi): bright yellow from the molecule **curcumin** — a conjugated diketone
- **Lac** (lakh): deep crimson from scale insects — the molecule **laccaic acid**
- **Indigo** (neel): blue from the Indigofera plant — the molecule **indigotin**
- **Iron mud** (from rice paddy fields): black/dark brown from **iron tannate** compounds
- **Jackfruit wood**: golden-yellow from **morin**, a flavonoid
- **Symplocos bark**: used as a **mordant** — it doesn't give color itself but helps other dyes bond permanently to fibers

A **mordant** is a chemical bridge between the fiber and the dye. Without it, many dyes wash out. Common mordants: alum (aluminum potassium sulfate), iron (ferrous sulfate), tin, and plant-based ones like Symplocos.

The chemistry: mordant metal ions form coordination complexes with both the dye molecule and the fiber molecule, creating a stable three-way bond. Different mordants with the same dye give different colors — iron darkens, alum brightens, tin intensifies.`,
      analogy: 'A mordant is like double-sided tape. The dye is a poster, the fiber is the wall. Without tape (mordant), the poster falls off when it rains (washing). With tape, the poster stays fixed. Different tapes (mordants) hold differently and can even change how the poster looks.',
      storyConnection: 'The girl\'s natural pigments came from the same earth and plants that Assamese weavers have used for generations. When she ground ochre from clay and squeezed green from leaves, she was extracting the same iron oxides and chlorophylls. Her painting was rooted — literally — in the chemistry of Assam\'s soil.',
      checkQuestion: 'Turmeric-dyed cloth fades quickly in sunlight. Indigo-dyed cloth lasts for decades. Both are plant dyes. What makes indigo so much more stable?',
      checkAnswer: 'Indigo (indigotin) is insoluble in water and has a very stable molecular structure — its conjugated ring system resists UV breakdown. Curcumin (turmeric) is partially soluble and has bonds that UV light can break (photodegradation). Stability depends on the specific molecular structure, not just whether it\'s "natural." Some natural dyes outlast synthetics; some fade in days.',
      codeIntro: 'Compare the color stability of natural dyes over time (simulated UV exposure).',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate color fading under UV light (wash/sun cycles)
cycles = np.arange(0, 52)  # 1 year of weekly sun/wash

# Fading models: exponential decay with different half-lives
dyes = {
    'Turmeric (curcumin)': {'half_life': 4, 'color': '#e6a817', 'initial': 100},
    'Saffron': {'half_life': 8, 'color': '#d97706', 'initial': 100},
    'Lac (laccaic acid)': {'half_life': 20, 'color': '#dc2626', 'initial': 100},
    'Indigo (indigotin)': {'half_life': 80, 'color': '#3b82f6', 'initial': 100},
    'Iron mud (iron tannate)': {'half_life': 150, 'color': '#374151', 'initial': 100},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Fading curves
ax1.set_facecolor('#111827')
for name, d in dyes.items():
    decay = d['initial'] * (0.5 ** (cycles / d['half_life']))
    ax1.plot(cycles, decay, color=d['color'], linewidth=2.5, label=name)

ax1.set_xlabel('Weeks of sun/wash exposure', color='white')
ax1.set_ylabel('Color intensity (%)', color='white')
ax1.set_title('Color Fading: Natural Dye Stability', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 105)

# Mordant effect
ax2.set_facecolor('#111827')
mordants = ['No mordant', 'Alum', 'Iron', 'Tin']
# Turmeric with different mordants (half-life improvement)
half_lives = [4, 12, 25, 18]
colors_m = ['#fbbf24', '#f59e0b', '#92400e', '#d97706']

for mordant, hl, col in zip(mordants, half_lives, colors_m):
    decay = 100 * (0.5 ** (cycles / hl))
    ax2.plot(cycles, decay, color=col, linewidth=2.5, label=f'{mordant} (t½={hl}w)')

ax2.set_xlabel('Weeks of exposure', color='white')
ax2.set_ylabel('Color intensity (%)', color='white')
ax2.set_title('Turmeric + Different Mordants', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 105)

plt.tight_layout()
plt.show()

print("Key findings:")
print("  Turmeric fades fastest (half-life: 4 weeks)")
print("  Iron mud is most stable (half-life: 150 weeks)")
print("  Mordants dramatically improve stability:")
print("    Turmeric alone: t½ = 4 weeks")
print("    Turmeric + iron mordant: t½ = 25 weeks (6× better)")
print()
print("This is why traditional dyers always use mordants —")
print("the chemistry of bonding matters as much as the color itself.")`,
      challenge: 'Add a synthetic dye (e.g., "Synthetic reactive dye" with half_life=200) to the first chart. Compare it with the natural dyes. Why have synthetic dyes replaced natural ones in most commercial textiles?',
      successHint: 'Assam\'s natural dye traditions encode centuries of empirical chemistry. Modern textile science is rediscovering these techniques as sustainable alternatives to synthetic dyes.',
    },
    {
      title: 'Color in culture — why colors mean different things everywhere',
      concept: `Color is not just physics and chemistry — it is deeply cultural. The same wavelength of light can mean joy in one culture and mourning in another:

- **White**: purity in Western weddings, mourning in Hindu/Buddhist traditions
- **Red**: danger in traffic signs, prosperity in Chinese culture, bridal color in India
- **Saffron/orange**: sacred in Hinduism, autumn in Western culture
- **Green**: Islam's sacred color, nature/eco in modern branding, Assam's tea gardens

In Assam specifically:
- **Muga gold** (from muga silk): royalty, prestige, Assamese identity — the golden shimmer of muga silk is unique to Assam in the entire world
- **Red** (eri silk border patterns): auspiciousness in mekhela chador designs
- **White with red border**: traditional Assamese bihu gamosa — purity with vitality
- **Green**: the tea gardens, the Brahmaputra's banks, fertility of the land

Color associations are learned, not innate. Babies don't prefer any particular color. Language also shapes perception — the Russian language has separate words for light blue (goluboy) and dark blue (siniy), and Russian speakers can distinguish those shades faster than English speakers.`,
      analogy: 'Color meaning is like word meaning — it depends on the language. The sound "gift" means a present in English but poison in German. Similarly, white means celebration in New York but mourning in Varanasi. The physics (sound waves, light waves) is the same; the interpretation is cultural.',
      storyConnection: 'The girl chose her monsoon colors deliberately — not just for physical accuracy but for emotional truth. The grey of rainclouds carries a cultural weight in Assam: it means the monsoon has arrived, the paddy fields will flood, life will renew. She painted not just wavelengths but meaning.',
      checkQuestion: 'Ancient Greek texts (Homer\'s Iliad) describe the sea as "wine-dark" rather than blue. Does this mean the Greeks couldn\'t see blue?',
      checkAnswer: 'No — their cone cells worked identically to ours. But ancient Greek had no single word for "blue." Without a distinct linguistic category, they grouped blue shades with dark/purple tones. Studies show that language affects how quickly and accurately we categorize colors, though the underlying perception is the same. This is a mild version of the Sapir-Whorf hypothesis.',
      codeIntro: 'Visualize how different cultures associate colors with concepts.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cultural color associations
cultures = ['Western', 'Indian/Hindu', 'Chinese', 'Assamese', 'Japanese']
concepts = ['Joy', 'Mourning', 'Royalty', 'Purity', 'Danger', 'Nature']

# Color associations (approximate RGB values)
associations = {
    'Western':      {'Joy': '#fbbf24', 'Mourning': '#1f2937', 'Royalty': '#7c3aed', 'Purity': '#f5f5f5', 'Danger': '#ef4444', 'Nature': '#22c55e'},
    'Indian/Hindu': {'Joy': '#ef4444', 'Mourning': '#f5f5f5', 'Royalty': '#f59e0b', 'Purity': '#f59e0b', 'Danger': '#1f2937', 'Nature': '#22c55e'},
    'Chinese':      {'Joy': '#ef4444', 'Mourning': '#f5f5f5', 'Royalty': '#fbbf24', 'Purity': '#f5f5f5', 'Danger': '#1f2937', 'Nature': '#22c55e'},
    'Assamese':     {'Joy': '#d4a017', 'Mourning': '#f5f5f5', 'Royalty': '#d4a017', 'Purity': '#f5f5f5', 'Danger': '#ef4444', 'Nature': '#16a34a'},
    'Japanese':     {'Joy': '#ef4444', 'Mourning': '#1f2937', 'Royalty': '#7c3aed', 'Purity': '#f5f5f5', 'Danger': '#ef4444', 'Nature': '#22c55e'},
}

fig, ax = plt.subplots(figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

cell_w, cell_h = 1.0, 0.8
for i, culture in enumerate(cultures):
    for j, concept in enumerate(concepts):
        color = associations[culture][concept]
        rect = plt.Rectangle((j * cell_w + 0.05, (len(cultures) - 1 - i) * cell_h + 0.05),
                              cell_w - 0.1, cell_h - 0.1, facecolor=color, edgecolor='gray', linewidth=0.5)
        ax.add_patch(rect)
        # Add text label for readability
        brightness = sum(int(color[k:k+2], 16) for k in (1, 3, 5)) / (3 * 255)
        text_color = '#1f2937' if brightness > 0.5 else 'white'
        ax.text(j * cell_w + cell_w/2, (len(cultures) - 1 - i) * cell_h + cell_h/2,
                color, ha='center', va='center', color=text_color, fontsize=7, fontfamily='monospace')

# Labels
for i, culture in enumerate(cultures):
    ax.text(-0.15, (len(cultures) - 1 - i) * cell_h + cell_h/2, culture,
            ha='right', va='center', color='white', fontsize=10, fontweight='bold')
for j, concept in enumerate(concepts):
    ax.text(j * cell_w + cell_w/2, len(cultures) * cell_h + 0.1, concept,
            ha='center', va='bottom', color='white', fontsize=10, fontweight='bold')

ax.set_xlim(-0.2, len(concepts) * cell_w + 0.1)
ax.set_ylim(-0.1, len(cultures) * cell_h + 0.4)
ax.set_aspect('equal')
ax.set_xticks([]); ax.set_yticks([])
ax.set_title('Color Associations Across Cultures', color='white', fontsize=14, pad=15)

plt.tight_layout()
plt.show()

print("Same color, different meanings:")
print("  White: wedding dress (West) vs mourning sari (India)")
print("  Red: danger/stop (West) vs prosperity/bridal (India/China)")
print("  Gold: luxury (everywhere) but uniquely Assamese (muga silk)")
print()
print("Color meaning is LEARNED, not built into the wavelength.")
print("A 580nm photon doesn't 'contain' happiness or danger —")
print("your culture taught you what it means.")`,
      challenge: 'Research the color associations of one more culture (e.g., Egyptian, Maori, or Brazilian) and add it to the chart. What patterns do you notice? Are any color associations nearly universal?',
      successHint: 'Understanding color as a cultural phenomenon — not just a physical one — is essential for design, art, communication, and cross-cultural understanding. The girl who painted rain understood this instinctively: she painted not just light but meaning.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for color science simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
