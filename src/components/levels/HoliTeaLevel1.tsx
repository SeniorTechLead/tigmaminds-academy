import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HoliTeaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What makes things colourful — absorption and reflection',
      concept: `In the story, the colours of Holi paint the tea gardens in every shade imaginable. But what is colour, physically?

**White light** (sunlight) contains all wavelengths of visible light, from violet (~380 nm) to red (~700 nm). When light hits an object, some wavelengths are **absorbed** and some are **reflected**. The reflected wavelengths are what we see as the object's colour.

- A red flower absorbs blue and green light, reflects red
- A green leaf absorbs red and blue light, reflects green
- A white object reflects all wavelengths
- A black object absorbs all wavelengths

Why do molecules absorb specific colours? Because the energy of light at certain wavelengths matches the energy gap between **electron energy levels** in the molecule. When a photon's energy matches the gap, it is absorbed and the electron jumps to a higher level.

The wavelength-energy relationship: E = hc/lambda, where h is Planck's constant, c is the speed of light, and lambda is the wavelength. Shorter wavelength = higher energy (violet > blue > green > yellow > orange > red).`,
      analogy: 'Imagine white light as a mix of coloured balls thrown at a wall. The wall has holes of specific sizes. Some balls fit through the holes (absorbed). The rest bounce back (reflected). A red wall has holes sized for blue and green balls, so only red balls bounce back to your eyes. The sizes of the holes are determined by the molecules in the wall.',
      storyConnection: 'The Holi colours in the tea garden story turned everything vivid — green tea leaves, golden sunlight, red and yellow powders. Each colour exists because specific molecules in each substance absorb specific wavelengths and reflect the rest. Holi colour powder works the same way as tea pigment, flower petals, and sunset light.',
      checkQuestion: 'Why do tea leaves appear green when alive but turn brown/black when dried and processed for tea?',
      checkAnswer: 'Living tea leaves contain chlorophyll (green) which dominates over other pigments. During processing (withering, oxidation, drying), chlorophyll breaks down and polyphenols oxidize into theaflavins (golden) and thearubigins (brown-red). The absorption spectrum changes as the molecular structure changes. Green tea is less processed (chlorophyll preserved); black tea is fully oxidized (brown pigments dominate).',
      codeIntro: 'Visualize the visible spectrum and show how absorption creates colour.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Visible light spectrum
wavelengths = np.linspace(380, 700, 500)

# Convert wavelength to approximate RGB colour
def wavelength_to_rgb(wl):
    if 380 <= wl < 440:
        r, g, b = -(wl - 440) / (440 - 380), 0, 1
    elif 440 <= wl < 490:
        r, g, b = 0, (wl - 440) / (490 - 440), 1
    elif 490 <= wl < 510:
        r, g, b = 0, 1, -(wl - 510) / (510 - 490)
    elif 510 <= wl < 580:
        r, g, b = (wl - 510) / (580 - 510), 1, 0
    elif 580 <= wl < 645:
        r, g, b = 1, -(wl - 645) / (645 - 580), 0
    elif 645 <= wl <= 700:
        r, g, b = 1, 0, 0
    else:
        r, g, b = 0, 0, 0
    return (r, g, b)

colors_spectrum = [wavelength_to_rgb(w) for w in wavelengths]

fig, axes = plt.subplots(3, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Full spectrum
ax = axes[0]
ax.set_facecolor('#111827')
for i in range(len(wavelengths) - 1):
    ax.axvspan(wavelengths[i], wavelengths[i+1], color=colors_spectrum[i], alpha=0.9)
ax.set_xlim(380, 700)
ax.set_ylabel('Intensity', color='white')
ax.set_title('White Light: The Full Visible Spectrum', color='white', fontsize=13)
ax.tick_params(colors='gray')

# Red object: absorbs blue+green, reflects red
ax = axes[1]
ax.set_facecolor('#111827')
for i in range(len(wavelengths) - 1):
    wl = wavelengths[i]
    if wl > 600:  # reflects red
        ax.axvspan(wl, wavelengths[i+1], color=colors_spectrum[i], alpha=0.9)
    else:  # absorbs blue+green
        ax.axvspan(wl, wavelengths[i+1], color='#111827', alpha=0.9)
        ax.axvspan(wl, wavelengths[i+1], color=colors_spectrum[i], alpha=0.1)
ax.set_xlim(380, 700)
ax.set_ylabel('Reflected', color='white')
ax.set_title('Red Holi Powder: Absorbs blue+green, reflects red', color='#ef4444', fontsize=11)
ax.tick_params(colors='gray')
ax.text(450, 0.5, 'ABSORBED', color='gray', fontsize=14, ha='center', transform=ax.transAxes)

# Green leaf: absorbs red+blue, reflects green
ax = axes[2]
ax.set_facecolor('#111827')
for i in range(len(wavelengths) - 1):
    wl = wavelengths[i]
    if 490 <= wl <= 570:  # reflects green
        ax.axvspan(wl, wavelengths[i+1], color=colors_spectrum[i], alpha=0.9)
    else:  # absorbs red+blue
        ax.axvspan(wl, wavelengths[i+1], color='#111827', alpha=0.9)
        ax.axvspan(wl, wavelengths[i+1], color=colors_spectrum[i], alpha=0.1)
ax.set_xlim(380, 700)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflected', color='white')
ax.set_title('Tea Leaf: Absorbs red+blue (chlorophyll), reflects green', color='#22c55e', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Why things have colour:")
print("  White light contains ALL visible wavelengths")
print("  Objects absorb some wavelengths and reflect others")
print("  We see the REFLECTED wavelengths as colour")
print()
print("Wavelength ranges:")
print("  Violet: 380-440 nm | Blue: 440-490 nm")
print("  Green: 490-570 nm  | Yellow: 570-590 nm")
print("  Orange: 590-620 nm | Red: 620-700 nm")`,
      challenge: 'What colour would an object appear if it absorbed ONLY yellow light (570-590 nm) and reflected everything else? Think about what mixing the remaining colours would produce.',
      successHint: 'Colour is not a property of objects — it is a property of the light they reflect. Change the light source (sunset, fluorescent, LED) and the same object can look different. This is why clothes look different under store lights than in sunlight.',
    },
    {
      title: 'Natural dyes — turmeric, indigo, and lac',
      concept: `Long before synthetic chemistry, humans extracted colour from nature. The tea gardens of Assam sit in a region with centuries of natural dye traditions:

**Turmeric (curcumin)**: deep yellow. Extracted from the rhizome of Curcuma longa. The pigment molecule curcumin absorbs blue-violet light. Widely used in textiles, food, and religious ceremonies. Fades in sunlight (poor lightfastness).

**Indigo (indigotin)**: deep blue. Originally from the Indigofera plant. The molecule is unusual — it absorbs orange-red light, reflecting blue. Requires a reduction-oxidation process to bind to fabric. Jeans are dyed with synthetic indigo, but the molecule is identical to the natural one.

**Lac (lac dye)**: deep red-crimson. Produced by the lac insect (Kerria lacca), which is cultivated across NE India. The resin is processed to extract both shellac (used for polish) and lac dye.

**Tezpur red** (traditionally from Morinda citrifolia roots): orange-red. Used in Assamese textiles.

Natural dyes require **mordants** — metal salts (alum, iron, tin) that bind the dye to the fibre. Different mordants with the same dye produce different colours. Alum + turmeric = bright yellow. Iron + turmeric = olive green.`,
      analogy: 'A mordant is like glue between paint and a wall. Without glue (primer), paint peels off. Without a mordant, dye washes out. The mordant is a metal atom that grabs the dye molecule with one hand and the fibre molecule with the other, holding them together permanently.',
      storyConnection: 'The Holi colours in the tea gardens would historically have been natural: turmeric yellow, indigo blue, kumkum red. These are the colours that grew in the same soil as the tea. The story\'s vivid palette came from the same earth — extracted, ground, and thrown into the air.',
      checkQuestion: 'Why does turmeric stain your hands yellow but washes off your clothes easily (unless mordanted)?',
      checkAnswer: 'Skin has proteins that form weak bonds with curcumin, so the stain persists until skin cells shed (a few days). Cotton is cellulose, which has weaker affinity for curcumin. Without a mordant to bridge the dye and fibre, the curcumin sits loosely on the surface and washes away. With alum mordant, the stain becomes permanent.',
      codeIntro: 'Compare the absorption spectra of three natural dyes and show how mordants shift colour.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 700, 500)

# Simplified absorption spectra (Gaussian peaks)
def absorption_spectrum(wavelengths, peak, width, strength=1.0):
    return strength * np.exp(-0.5 * ((wavelengths - peak) / width) ** 2)

# Natural dye absorption peaks
turmeric = absorption_spectrum(wavelengths, 420, 30, 0.9)  # absorbs blue-violet
indigo = absorption_spectrum(wavelengths, 610, 35, 0.85)    # absorbs orange-red
lac = absorption_spectrum(wavelengths, 520, 25, 0.8)        # absorbs green

# Mordant effect on turmeric
turmeric_alum = absorption_spectrum(wavelengths, 420, 30, 0.9)     # bright yellow
turmeric_iron = absorption_spectrum(wavelengths, 420, 30, 0.7) + \
                absorption_spectrum(wavelengths, 580, 40, 0.5)      # olive (absorbs more)
turmeric_tin = absorption_spectrum(wavelengths, 430, 25, 0.95)     # brighter yellow

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Dye absorption spectra
ax1.set_facecolor('#111827')
ax1.plot(wavelengths, turmeric, linewidth=2, color='#f59e0b', label='Turmeric (absorbs violet-blue)')
ax1.plot(wavelengths, indigo, linewidth=2, color='#3b82f6', label='Indigo (absorbs orange-red)')
ax1.plot(wavelengths, lac, linewidth=2, color='#ef4444', label='Lac dye (absorbs green)')
ax1.fill_between(wavelengths, turmeric, alpha=0.15, color='#f59e0b')
ax1.fill_between(wavelengths, indigo, alpha=0.15, color='#3b82f6')
ax1.fill_between(wavelengths, lac, alpha=0.15, color='#ef4444')

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Absorption', color='white')
ax1.set_title('Absorption Spectra of Natural Dyes', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Colour seen = complement of absorbed colour
ax1.annotate('Absorbs blue\\n-> appears YELLOW', xy=(420, 0.9), xytext=(460, 0.7),
             color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax1.annotate('Absorbs orange\\n-> appears BLUE', xy=(610, 0.85), xytext=(550, 0.7),
             color='#3b82f6', fontsize=9, arrowprops=dict(arrowstyle='->', color='#3b82f6'))
ax1.annotate('Absorbs green\\n-> appears RED', xy=(520, 0.8), xytext=(480, 0.55),
             color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Mordant effect
ax2.set_facecolor('#111827')
ax2.plot(wavelengths, turmeric_alum, linewidth=2, color='#f59e0b', label='Turmeric + alum (bright yellow)')
ax2.plot(wavelengths, turmeric_iron, linewidth=2, color='#65a30d', label='Turmeric + iron (olive green)')
ax2.plot(wavelengths, turmeric_tin, linewidth=2, color='#fbbf24', label='Turmeric + tin (vivid yellow)')
ax2.fill_between(wavelengths, turmeric_iron, alpha=0.15, color='#65a30d')

ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Absorption', color='white')
ax2.set_title('Same Dye, Different Mordants -> Different Colours', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Colour wheel relationship:")
print("  Absorbs violet/blue (380-490nm) -> appears Yellow/Orange")
print("  Absorbs green (490-570nm) -> appears Red/Purple")
print("  Absorbs orange/red (590-700nm) -> appears Blue/Green")
print()
print("Mordant magic:")
print("  Same dye + different metal = different colour")
print("  Alum (Al): brightens | Iron (Fe): darkens/shifts green")
print("  Tin (Sn): intensifies | Copper (Cu): shifts green")`,
      challenge: 'If you mix turmeric (absorbs blue) and indigo (absorbs red), what colour would you expect the mixture to appear? Think about which wavelengths are left after both absorptions.',
      successHint: 'Natural dye chemistry is where chemistry meets culture. The same knowledge that colours a Holi celebration also explains why the sky is blue, why blood is red, and why chlorophyll is green.',
    },
    {
      title: 'Synthetic dyes — chemistry creates colour',
      concept: `In 1856, an 18-year-old chemistry student named William Henry Perkin accidentally created the first synthetic dye: **mauveine** (a purple colour). He was trying to synthesize quinine (an anti-malaria drug) and got a coloured gunk instead. He had the insight to try dyeing fabric with it — and it worked brilliantly.

This accidental discovery launched the synthetic dye industry, which:
- Replaced expensive natural dyes (Tyrian purple from snails cost its weight in gold)
- Made colour affordable for everyone
- Founded the modern chemical industry (BASF, Bayer, Hoechst all began as dye companies)
- Led to the discovery of pharmaceuticals (dye chemistry and drug chemistry overlap)

Modern synthetic dyes are engineered for specific properties:
- **Lightfastness**: resistance to fading in sunlight (rated 1-8)
- **Washfastness**: resistance to washing (rated 1-5)
- **Colour range**: synthetics can create colours impossible with natural dyes (fluorescent, neon)

There are now over **10,000 commercial dye formulations**. The global textile dye market is worth ~$8 billion per year. The environmental cost: textile dyeing is responsible for 20% of global water pollution.`,
      analogy: 'Perkin\'s discovery is like a chef trying to make bread and accidentally inventing pizza. The "mistake" turned out to be far more valuable than the original goal. Synthetic dyes were the "pizza" of chemistry — nobody was looking for them, but once discovered, they changed everything.',
      storyConnection: 'The Holi in the tea gardens story uses colours both natural and synthetic. Before 1856, all Holi colours came from nature. After Perkin, synthetic dyes gradually replaced them — brighter, cheaper, but sometimes toxic. The push to return to natural Holi colours is a modern safety movement with deep historical roots.',
      checkQuestion: 'Some cheap Holi colours contain industrial dyes not meant for skin contact: malachite green (toxic to cells), rhodamine B (suspected carcinogen), metanil yellow (banned food dye). How would you test if a Holi colour is safe?',
      checkAnswer: 'Dissolve a small amount in water. Safe natural dyes dissolve slowly and produce muted colours. Industrial dyes dissolve instantly and produce intense, uniform colour. More precisely: pH test (industrial dyes are often strongly acidic or basic), chromatography (separate components), or spectrophotometry (identify the dye by its absorption spectrum). The safest approach: buy certified natural colours or make your own from turmeric, beetroot, and henna.',
      codeIntro: 'Timeline of dye discoveries and compare cost/performance of natural vs. synthetic.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Timeline of major dye discoveries
ax1.set_facecolor('#111827')
events = [
    (3000, 'Indigo (plant)', '#3b82f6'),
    (2500, 'Tyrian purple (snail)', '#a855f7'),
    (2000, 'Turmeric (plant)', '#f59e0b'),
    (1500, 'Cochineal red (insect)', '#ef4444'),
    (1856, 'Mauveine (Perkin)', '#d946ef'),
    (1858, 'Fuchsine (synthetic red)', '#ec4899'),
    (1878, 'Synthetic indigo', '#3b82f6'),
    (1884, 'Congo red (azo dye)', '#ef4444'),
    (1935, 'Phthalocyanine blue', '#06b6d4'),
    (1956, 'Reactive dyes (ICI)', '#22c55e'),
    (2000, 'Nano-pigments', '#f59e0b'),
]

years = [e[0] for e in events]
names = [e[1] for e in events]
colors = [e[2] for e in events]

# Horizontal timeline
for i, (year, name, color) in enumerate(events):
    ax1.barh(i, 1, left=year, color=color, height=0.6, alpha=0.8)
    ax1.text(year + 50, i, f'{year}: {name}', color='white', fontsize=8, va='center')

ax1.set_xlim(-500, 2100)
ax1.set_yticks([])
ax1.set_xlabel('Year (BCE for negative)', color='white')
ax1.set_title('5000 Years of Dye History', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.axvline(1856, color='#d946ef', linestyle='--', linewidth=1)
ax1.text(1856, len(events), "Perkin's\naccident", color='#d946ef', fontsize=9, ha='center')

# Natural vs Synthetic comparison
ax2.set_facecolor('#111827')
categories = ['Cost per\\nkg', 'Colour\\nrange', 'Light-\\nfastness', 'Wash-\\nfastness', 'Environ-\\nmental', 'Safety']
natural_scores = [3, 4, 3, 4, 9, 8]  # scores out of 10
synthetic_scores = [9, 10, 8, 9, 2, 5]

x = np.arange(len(categories))
w = 0.35
ax2.bar(x - w/2, natural_scores, w, label='Natural dyes', color='#22c55e', alpha=0.8)
ax2.bar(x + w/2, synthetic_scores, w, label='Synthetic dyes', color='#3b82f6', alpha=0.8)
ax2.set_xticks(x)
ax2.set_xticklabels(categories, color='white', fontsize=8)
ax2.set_ylabel('Score (10 = best)', color='white')
ax2.set_title('Natural vs Synthetic Dyes', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 11)

plt.tight_layout()
plt.show()

print("The great trade-off:")
print("  Synthetic: cheaper, more consistent, wider range, more durable")
print("  Natural: safer, more eco-friendly, but limited and variable")
print()
print("The ideal: synthetic precision with natural safety.")
print("This is the direction of modern green chemistry.")`,
      challenge: 'Research: alizarin was the first natural dye to be synthesized (1868, from coal tar). The synthetic version was identical to the natural one from madder root. What happened to the madder farmers?',
      successHint: 'Perkin\'s accident changed the world. Synthetic dyes led to synthetic drugs, synthetic materials, and the entire modern chemical industry. Understanding this history helps you see how science, industry, and society are intertwined.',
    },
    {
      title: 'pH indicators — colours that change with acidity',
      concept: `Some substances change colour depending on the **pH** of their environment. These are **pH indicators**:

pH measures how acidic or basic a solution is:
- pH 0-6: acidic (lemon juice ~2, vinegar ~3, tea ~5)
- pH 7: neutral (pure water)
- pH 8-14: basic/alkaline (baking soda ~9, soap ~10, bleach ~13)

The colour change happens because the indicator molecule exists in two different forms — one for acidic conditions, one for basic — and each form absorbs different wavelengths.

**Natural pH indicators**:
- Red cabbage juice: red in acid, purple at neutral, green/yellow in base
- Turmeric: yellow in acid/neutral, red-brown in base
- Butterfly pea flower tea: blue at neutral, purple in acid, green in base
- Litmus (from lichen): red in acid, blue in base

The tea in the story is itself a pH indicator! Strong black tea turns lighter when you add lemon (acid) and darker when you add baking soda (base). Tea polyphenols (theaflavins) change structure with pH, altering their absorption spectrum.`,
      analogy: 'A pH indicator is like a chameleon that changes colour based on its chemical environment instead of its visual environment. The chameleon has two colour states (acidic-form and basic-form), and the pH of the solution determines which state it is in, just as background colour determines the chameleon\'s appearance.',
      storyConnection: 'In the tea gardens of the Holi story, the colours mixed in unexpected ways — red turning orange, blue turning green. pH indicators do exactly this: a single substance shows different colours depending on its chemical environment. Holi in a tea garden means colours interacting with the slightly acidic tea-soaked soil.',
      checkQuestion: 'If you add lemon juice to blue butterfly pea flower tea, it turns purple. If you add baking soda, it turns green. What happens if you add both lemon juice AND baking soda?',
      checkAnswer: 'The acid (lemon) and base (baking soda) neutralize each other: citric acid + NaHCO3 -> sodium citrate + H2O + CO2. The result depends on which one you add more of. Equal amounts give near-neutral pH (the tea stays blue). Excess lemon: purple. Excess baking soda: green. The fizzing (CO2) is a bonus visual.',
      codeIntro: 'Simulate pH indicator colour changes across the pH scale.',
      code: `import numpy as np
import matplotlib.pyplot as plt

pH_range = np.linspace(0, 14, 200)

# Indicator colour as RGB at each pH
def indicator_color(pH, acid_rgb, neutral_rgb, base_rgb, pKa=7):
    """Blend between acid and base colours based on pH."""
    fraction_base = 1 / (1 + 10**(pKa - pH))
    if pH < pKa:
        f = pH / pKa
        r = acid_rgb[0] * (1-f) + neutral_rgb[0] * f
        g = acid_rgb[1] * (1-f) + neutral_rgb[1] * f
        b = acid_rgb[2] * (1-f) + neutral_rgb[2] * f
    else:
        f = (pH - pKa) / (14 - pKa)
        r = neutral_rgb[0] * (1-f) + base_rgb[0] * f
        g = neutral_rgb[1] * (1-f) + base_rgb[1] * f
        b = neutral_rgb[2] * (1-f) + base_rgb[2] * f
    return (np.clip(r, 0, 1), np.clip(g, 0, 1), np.clip(b, 0, 1))

indicators = {
    'Red cabbage': ((0.9, 0.1, 0.2), (0.5, 0.1, 0.6), (0.4, 0.8, 0.2)),
    'Turmeric': ((0.9, 0.7, 0.1), (0.9, 0.7, 0.1), (0.6, 0.2, 0.1)),
    'Blue tea (butterfly pea)': ((0.6, 0.2, 0.7), (0.2, 0.3, 0.9), (0.2, 0.7, 0.3)),
    'Litmus': ((0.9, 0.2, 0.2), (0.6, 0.2, 0.6), (0.2, 0.2, 0.9)),
    'Black tea': ((0.8, 0.5, 0.2), (0.6, 0.3, 0.1), (0.3, 0.15, 0.05)),
}

fig, axes = plt.subplots(len(indicators), 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Natural pH Indicators: Colour vs pH', color='white', fontsize=14, y=1.01)

for ax, (name, (acid, neutral, base)) in zip(axes, indicators.items()):
    # Create colour strip
    colors = [indicator_color(pH, acid, neutral, base) for pH in pH_range]
    colors_array = np.array(colors).reshape(1, -1, 3)
    ax.imshow(colors_array, aspect='auto', extent=[0, 14, 0, 1])
    ax.set_ylabel(name, color='white', fontsize=9, rotation=0, ha='right', va='center')
    ax.set_yticks([])
    ax.tick_params(colors='gray')

    # Mark common substances
    if name == indicators and list(indicators.keys())[-1]:
        for pH_val, label in [(2, 'Lemon'), (3, 'Vinegar'), (5, 'Tea'), (7, 'Water'),
                               (9, 'Baking\\nsoda'), (13, 'Bleach')]:
            ax.axvline(pH_val, color='white', linewidth=0.5, alpha=0.5)

# Add pH labels to bottom axis
axes[-1].set_xlabel('pH', color='white', fontsize=12)
for pH_val, label in [(2, 'Lemon'), (3, 'Vinegar'), (5, 'Tea'), (7, 'Water'),
                       (9, 'Baking\nsoda'), (13, 'Bleach')]:
    axes[-1].axvline(pH_val, color='white', linewidth=0.5, alpha=0.5)
    axes[-1].text(pH_val, -0.3, label, color='white', fontsize=7, ha='center')

# Add vertical lines to all axes
for ax in axes:
    for pH_val in [2, 3, 5, 7, 9, 13]:
        ax.axvline(pH_val, color='white', linewidth=0.3, alpha=0.3)

plt.tight_layout()
plt.show()

print("pH of common substances:")
print("  Lemon juice: ~2 (acidic)")
print("  Vinegar: ~3 (acidic)")
print("  Black tea: ~5 (mildly acidic)")
print("  Pure water: 7 (neutral)")
print("  Baking soda: ~9 (basic)")
print("  Bleach: ~13 (strongly basic)")
print()
print("Try this at home: boil red cabbage, filter the juice,")
print("and add drops of lemon, vinegar, baking soda, soap.")
print("You'll see the full rainbow from a single indicator!")`,
      challenge: 'Red cabbage juice can act as a "universal indicator" showing many colours across the pH range. Why is it better than litmus, which only shows red or blue?',
      successHint: 'pH indicators turn chemistry into a visual experience. Every colour change is a molecular transformation — electrons rearranging as protons are gained or lost. The science behind Holi colours and tea is the same science behind laboratory chemistry.',
    },
    {
      title: 'Colour reactions — chemistry you can see',
      concept: `Some chemical reactions produce dramatic colour changes. These are not just beautiful — they are diagnostic. Chemists use colour reactions to identify substances.

Famous colour reactions:
- **Iodine + starch -> deep blue-black**: iodine molecules slip inside the starch helix, forming a charge-transfer complex. This tests for starch in food.
- **Flame tests**: metals produce characteristic colours when heated. Sodium = yellow. Copper = green. Potassium = violet. Lithium = red. Each metal's electrons emit specific wavelengths when they fall back from excited states.
- **Biuret test** (protein detection): CuSO4 + NaOH + protein -> violet colour. The copper ions coordinate with peptide bonds.
- **Benedict's test** (reducing sugars): Cu2+ (blue) is reduced to Cu2O (orange-red) by sugars like glucose.
- **Phenolphthalein**: colourless in acid, pink in base. The classic indicator.

Every Holi colour, every food colour, every pigment in nature works because specific molecules absorb specific wavelengths. Colour reactions are the visible proof that chemistry is happening at the molecular level.`,
      analogy: 'Colour reactions are like traffic lights for molecules. Green means "go" (product formed). Red means "stop" (different product or no reaction). Chemists read reactions by colour the way drivers read intersections by light. The colour IS the information.',
      storyConnection: 'When Holi colours mix in the tea gardens, unexpected colours appear — orange from red and yellow mixing, green from blue and yellow, purple from red and blue. These are physical mixing (pigment combination), but real chemical colour reactions are even more dramatic: two colourless liquids mixing to create a vivid colour from nowhere.',
      checkQuestion: 'Why does a flame turn yellow when you sprinkle salt (NaCl) on it?',
      checkAnswer: 'Heat excites sodium electrons to a higher energy level. When they fall back down, they emit light at exactly 589 nm — which is yellow. This is the sodium D line, one of the most distinctive emission lines in spectroscopy. The same phenomenon makes sodium streetlights yellow. Every element has its own set of emission lines — a unique "colour fingerprint."',
      codeIntro: 'Visualize flame test colours by simulating emission spectra for different metals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 700, 1000)

# Emission lines for common metals (simplified to dominant peaks)
metals = {
    'Sodium (Na)': {'peaks': [589], 'color': '#f59e0b', 'flame': 'Yellow'},
    'Copper (Cu)': {'peaks': [510, 520], 'color': '#22c55e', 'flame': 'Green'},
    'Potassium (K)': {'peaks': [405, 766], 'color': '#a855f7', 'flame': 'Violet'},
    'Lithium (Li)': {'peaks': [670], 'color': '#ef4444', 'flame': 'Red'},
    'Barium (Ba)': {'peaks': [524, 553], 'color': '#84cc16', 'flame': 'Yellow-green'},
    'Strontium (Sr)': {'peaks': [606, 640, 680], 'color': '#f43f5e', 'flame': 'Crimson'},
}

fig, axes = plt.subplots(2, 3, figsize=(15, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Flame Test Emission Spectra', color='white', fontsize=14)

for ax, (metal, data) in zip(axes.flat, metals.items()):
    ax.set_facecolor('#111827')

    # Create emission spectrum
    spectrum = np.zeros_like(wavelengths)
    for peak in data['peaks']:
        if 380 <= peak <= 700:
            spectrum += np.exp(-0.5 * ((wavelengths - peak) / 3) ** 2)

    ax.fill_between(wavelengths, spectrum, alpha=0.6, color=data['color'])
    ax.plot(wavelengths, spectrum, color=data['color'], linewidth=2)

    # Mark emission lines
    for peak in data['peaks']:
        if 380 <= peak <= 700:
            ax.axvline(peak, color='white', linestyle=':', linewidth=0.5, alpha=0.5)
            ax.text(peak, max(spectrum) * 1.05, f'{peak}nm', color='white',
                    fontsize=8, ha='center')

    ax.set_title(f'{metal}\\nFlame: {data["flame"]}', color=data['color'], fontsize=10)
    ax.set_xlim(380, 700)
    ax.set_xlabel('Wavelength (nm)', color='white', fontsize=8)
    ax.tick_params(colors='gray', labelsize=7)
    ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Flame test colours (used to identify metals):")
for metal, data in metals.items():
    peaks = ', '.join([f'{p}nm' for p in data['peaks'] if 380 <= p <= 700])
    print(f"  {metal}: {data['flame']} ({peaks})")
print()
print("This is the same physics behind fireworks:")
print("  Red fireworks = strontium compounds")
print("  Green fireworks = barium compounds")
print("  Yellow fireworks = sodium compounds")
print("  Purple fireworks = strontium + copper mix")`,
      challenge: 'Fireworks makers create orange by mixing strontium (red) and sodium (yellow). Model this by adding their spectra together. What does the combined spectrum look like?',
      successHint: 'Colour reactions and flame tests show that colour is information. Every element, every molecule, has a unique spectral signature. Reading these signatures is how astronomers know what stars are made of — the same physics, applied across the universe.',
    },
    {
      title: 'Safe vs unsafe colours — chemistry of Holi safety',
      concept: `Not all Holi colours are equal. The difference between safe and unsafe colours is **chemistry**:

**Safe colours (natural)**:
- Turmeric powder (yellow): curcumin, an antioxidant
- Beetroot powder (red-pink): betalains, food-safe
- Henna powder (green/brown): lawsone, used for millennia
- Multani mitti + sandalwood (skin tones): clay minerals, soothing
- Cornstarch base with food-grade dyes

**Unsafe colours (industrial)**:
- Malachite green: triphenylmethane dye, toxic to liver cells
- Rhodamine B: fluorescent pink, suspected carcinogen, used in textiles not skin
- Lead oxide (sindoor): heavy metal, neurotoxic, causes lead poisoning
- Metanil yellow: azo dye, banned as food additive, causes cancer in animal studies
- Crystal violet: used to dye leather, causes eye damage

How to identify unsafe colours:
- Unnaturally bright or neon (natural dyes are muted)
- Leave persistent stains on skin (natural dyes wash off in 1-2 days)
- Cause immediate irritation (burning, redness, itching)
- Dissolve instantly in water with uniform, intense colour

The chemistry is simple: industrial dyes have molecular structures designed for maximum colour intensity on fabric, not safety on skin. They often contain heavy metals, aromatic amines (cancer-causing), or unreacted intermediates.`,
      analogy: 'Safe vs. unsafe Holi colours is like the difference between food and paint. Both can be coloured. Both can be thrown at someone. But one is designed to be safe for human contact, and the other is designed for walls and fabric. Using industrial dye on skin is like eating paint — the manufacturer never intended it for that use.',
      storyConnection: 'The Holi in the tea gardens story is joyful and harmless — colours that come from the earth and return to the earth. This is only true when the colours are natural. The shift from natural to synthetic Holi colours has introduced a chemistry risk that traditional celebrations never had. Understanding the chemistry lets you celebrate safely.',
      checkQuestion: 'A "herbal" Holi colour brand claims to be 100% natural. How would you verify this scientifically?',
      checkAnswer: 'Three tests: (1) Dissolve in water — natural dyes dissolve slowly and unevenly; synthetic dyes dissolve instantly. (2) Spectrophotometry — compare the absorption spectrum with known natural dye spectra. (3) Heavy metal test — add sodium sulfide solution; a dark precipitate indicates lead or mercury. (4) pH test — extreme pH suggests industrial chemicals. No single test is conclusive, but together they give a reliable picture.',
      codeIntro: 'Compare the toxicity profiles and detection methods for safe vs. unsafe Holi colours.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Safety comparison: natural vs industrial
categories = ['Skin\\nirritation', 'Eye\\ndamage', 'Long-term\\ntoxicity', 'Environ-\\nmental harm', 'Allergen\\nrisk']
natural_risk = [1, 1, 0.5, 1, 2]    # risk score 0-10
industrial_risk = [7, 8, 9, 8, 6]

x = np.arange(len(categories))
w = 0.35
ax1.set_facecolor('#111827')
ax1.bar(x - w/2, natural_risk, w, label='Natural colours', color='#22c55e', alpha=0.8)
ax1.bar(x + w/2, industrial_risk, w, label='Industrial dyes', color='#ef4444', alpha=0.8)
ax1.set_xticks(x)
ax1.set_xticklabels(categories, color='white', fontsize=9)
ax1.set_ylabel('Risk score (0=safe, 10=dangerous)', color='white')
ax1.set_title('Health Risk: Natural vs Industrial Holi Colours', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 11)

# Detection methods
ax2.set_facecolor('#111827')
tests = ['Water\ndissolve', 'Skin\nstain', 'Spectro-\nphotometry', 'Heavy\nmetal test', 'pH\ntest']
natural_result = [3, 2, 5, 1, 6]    # characteristic value (0-10 scale)
industrial_result = [9, 8, 8, 7, 9]

x2 = np.arange(len(tests))
ax2.bar(x2 - w/2, natural_result, w, label='Natural (expected)', color='#22c55e', alpha=0.8)
ax2.bar(x2 + w/2, industrial_result, w, label='Industrial (red flag)', color='#ef4444', alpha=0.8)
ax2.set_xticks(x2)
ax2.set_xticklabels(tests, color='white', fontsize=9)
ax2.set_ylabel('Test intensity (higher = more suspicious)', color='white')
ax2.set_title('Simple Tests to Identify Unsafe Colours', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

# Add threshold line
ax2.axhline(5, color='#f59e0b', linestyle='--', linewidth=1)
ax2.text(len(tests) - 0.5, 5.3, 'Suspicion threshold', color='#f59e0b', fontsize=9)

plt.tight_layout()
plt.show()

print("Quick safety guide for Holi colours:")
print()
print("  SAFE signs:")
print("    - Muted, earthy colours (not neon)")
print("    - Grainy, uneven texture")
print("    - Dissolves slowly in water")
print("    - No skin irritation after 5 minutes")
print("    - Washes off within 1-2 days")
print()
print("  DANGER signs:")
print("    - Neon or unnaturally bright")
print("    - Smooth, uniform powder")
print("    - Dissolves instantly in water")
print("    - Causes burning or redness")
print("    - Stains skin for days")
print()
print("When in doubt: make your own from turmeric, beetroot,")
print("henna, and cornstarch. Chemistry you understand is chemistry you trust.")`,
      challenge: 'Calculate the cost comparison: 1 kg of natural turmeric-based yellow (~$5) vs 1 kg of industrial metanil yellow (~$2). If health costs from exposure average $50 per person affected, what is the true cost of the cheaper option?',
      successHint: 'The chemistry of Holi safety is the chemistry of everyday life: what we put on our skin, in our food, and into the environment. Understanding molecular structures lets you make safe choices — not from fear, but from knowledge.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior chemistry experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for chemistry simulations. Click to start.</p>
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