import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function OrchidLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Pigment biochemistry — the molecules of color',
      concept: `Flower color comes from three major pigment families, each absorbing different wavelengths of light:

**1. Anthocyanins** (reds, purples, blues): Water-soluble flavonoid pigments stored in cell vacuoles. Their color depends on pH: acidic = red, neutral = purple, basic = blue. This is why hydrangeas change color with soil pH. Anthocyanins absorb green/yellow light (500-580nm) and reflect red/blue.

**2. Carotenoids** (yellows, oranges): Fat-soluble pigments in chromoplasts. They are polyene chains (long chains of alternating single/double carbon bonds) that absorb blue/violet light (400-500nm). Carotenoids are also essential for photosynthesis as accessory pigments and photoprotective agents.

**3. Chlorophylls** (greens): The photosynthetic pigments. Chlorophyll a absorbs red (680nm) and blue (430nm), reflecting green. In flowers, chlorophyll is usually absent or masked by other pigments, but some orchids have green flowers where chlorophyll dominates.

The final perceived color is the sum of reflected light after all pigments have absorbed their wavelengths. A purple orchid has both anthocyanins (absorbing green) and some carotenoids (absorbing blue) — the remaining reflected light combines to appear purple to our eyes.

Orchids have evolved exceptional control over pigment production, producing over 200 distinct color patterns from just these three pigment classes.`,
      analogy: 'Pigments are like colored filters on a white spotlight. Each filter removes (absorbs) certain colors and lets others through (reflects). Stack a blue filter (absorbs red/green) on a yellow filter (absorbs blue), and you get green — the only color both filters let through. A flower with anthocyanins and carotenoids works the same way: each pigment removes some wavelengths, and what remains is the flower\'s perceived color.',
      storyConnection: 'NE India\'s orchid diversity is legendary — over 900 species in the region. The Khasi Hills alone host orchids in every color: Dendrobium nobile (white-purple from anthocyanins), Renanthera imschootiana (red from anthocyanin accumulation), Vanda coerulea (the famous Blue Vanda, one of the few truly blue flowers, using a rare pH-modified anthocyanin). Each color represents a different biochemical strategy.',
      checkQuestion: 'If you extracted the pigments from a red orchid and dissolved them in a basic (alkaline) solution, what color would you expect the solution to turn?',
      checkAnswer: 'Blue or purple. Red orchid color typically comes from anthocyanins at low (acidic) pH. In basic solution, the anthocyanin molecules undergo a conformational change: the flavylium cation (red) deprotonates to the quinoidal base (blue/purple). This pH-dependent color shift is the same chemistry that makes red cabbage juice work as a pH indicator in chemistry class.',
      codeIntro: 'Model the absorption spectra of the three major pigment classes and simulate how their concentrations produce different perceived colors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Pigment absorption spectra (simplified Gaussian models)
wavelengths = np.linspace(380, 750, 500)  # visible spectrum

def anthocyanin_absorption(wl, ph=4.5):
    """Anthocyanin absorption depends on pH."""
    if ph < 4:  # acidic: red form, absorbs green
        peak = 520
        width = 40
    elif ph < 6:  # moderate: purple form
        peak = 545
        width = 50
    else:  # basic: blue form
        peak = 580
        width = 45
    return 0.8 * np.exp(-0.5 * ((wl - peak) / width)**2)

def carotenoid_absorption(wl):
    """Carotenoids absorb blue/violet."""
    return 0.7 * np.exp(-0.5 * ((wl - 450) / 35)**2) + 0.3 * np.exp(-0.5 * ((wl - 480) / 30)**2)

def chlorophyll_absorption(wl):
    """Chlorophyll has two absorption peaks: blue and red."""
    blue_peak = 0.9 * np.exp(-0.5 * ((wl - 430) / 20)**2)
    red_peak = 0.7 * np.exp(-0.5 * ((wl - 680) / 25)**2)
    return blue_peak + red_peak

# Reflectance = 1 - absorption (simplified)
def flower_reflectance(wl, anthocyanin=0, carotenoid=0, chlorophyll=0, ph=4.5):
    total_abs = (anthocyanin * anthocyanin_absorption(wl, ph) +
                 carotenoid * carotenoid_absorption(wl) +
                 chlorophyll * chlorophyll_absorption(wl))
    return np.clip(1 - total_abs, 0, 1)

# Convert reflectance spectrum to approximate RGB color
def spectrum_to_rgb(reflectance, wavelengths):
    """Approximate RGB from reflectance spectrum."""
    # Simplified CIE color matching
    r_response = np.exp(-0.5 * ((wavelengths - 610) / 40)**2)
    g_response = np.exp(-0.5 * ((wavelengths - 540) / 35)**2)
    b_response = np.exp(-0.5 * ((wavelengths - 450) / 30)**2)

    r = np.trapz(reflectance * r_response, wavelengths)
    g = np.trapz(reflectance * g_response, wavelengths)
    b = np.trapz(reflectance * b_response, wavelengths)

    # Normalize
    mx = max(r, g, b, 0.01)
    return np.clip([r/mx, g/mx, b/mx], 0, 1)

# Define orchid varieties
orchids = {
    'White (no pigment)':    {'anthocyanin': 0, 'carotenoid': 0, 'chlorophyll': 0, 'ph': 5},
    'Red (acid anthocyanin)': {'anthocyanin': 1.0, 'carotenoid': 0, 'chlorophyll': 0, 'ph': 3.5},
    'Purple (neutral anth.)': {'anthocyanin': 0.8, 'carotenoid': 0, 'chlorophyll': 0, 'ph': 5.5},
    'Blue (basic anth.)':     {'anthocyanin': 0.9, 'carotenoid': 0, 'chlorophyll': 0, 'ph': 7.0},
    'Yellow (carotenoid)':    {'anthocyanin': 0, 'carotenoid': 0.9, 'chlorophyll': 0, 'ph': 5},
    'Orange (anth+carot)':    {'anthocyanin': 0.5, 'carotenoid': 0.7, 'chlorophyll': 0, 'ph': 4},
    'Green (chlorophyll)':    {'anthocyanin': 0, 'carotenoid': 0.1, 'chlorophyll': 0.8, 'ph': 5},
    'Dark red (all three)':   {'anthocyanin': 0.9, 'carotenoid': 0.3, 'chlorophyll': 0.2, 'ph': 4},
}

fig, axes = plt.subplots(2, 4, figsize=(18, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Orchid Pigment Biochemistry', color='white', fontsize=14, fontweight='bold')

for idx, (name, params) in enumerate(orchids.items()):
    ax = axes[idx // 4, idx % 4]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

    refl = flower_reflectance(wavelengths, **params)
    rgb = spectrum_to_rgb(refl, wavelengths)

    # Plot reflectance spectrum
    ax.fill_between(wavelengths, refl, alpha=0.3, color=rgb)
    ax.plot(wavelengths, refl, color='white', linewidth=1.5)

    # Show absorption components
    if params['anthocyanin'] > 0:
        ax.plot(wavelengths, params['anthocyanin'] * anthocyanin_absorption(wavelengths, params['ph']),
                '--', color='#ef4444', linewidth=1, alpha=0.7, label='Anth.')
    if params['carotenoid'] > 0:
        ax.plot(wavelengths, params['carotenoid'] * carotenoid_absorption(wavelengths),
                '--', color='#f59e0b', linewidth=1, alpha=0.7, label='Carot.')
    if params['chlorophyll'] > 0:
        ax.plot(wavelengths, params['chlorophyll'] * chlorophyll_absorption(wavelengths),
                '--', color='#22c55e', linewidth=1, alpha=0.7, label='Chl.')

    # Color swatch
    ax.add_patch(plt.Rectangle((700, 0.8), 40, 0.18, facecolor=rgb, edgecolor='white', linewidth=0.5,
                                transform=ax.transData))

    ax.set_xlim(380, 750)
    ax.set_ylim(0, 1.1)
    ax.set_xlabel('Wavelength (nm)', color='white', fontsize=7)
    ax.set_ylabel('Reflectance', color='white', fontsize=7)
    ax.set_title(name, color='white', fontsize=9)
    if idx == 0:
        ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Pigment concentration -> perceived color:")
for name, params in orchids.items():
    refl = flower_reflectance(wavelengths, **params)
    rgb = spectrum_to_rgb(refl, wavelengths)
    print(f"  {name:<28} RGB=({rgb[0]:.2f}, {rgb[1]:.2f}, {rgb[2]:.2f})  "
          f"anth={params['anthocyanin']:.1f} carot={params['carotenoid']:.1f} chl={params['chlorophyll']:.1f} pH={params['ph']}")`,
      challenge: 'Create a "color mixer": vary anthocyanin from 0 to 1 while keeping carotenoid at 0.5. Plot the resulting RGB color as a gradient bar. At what anthocyanin concentration does yellow transition to orange to red?',
      successHint: 'Color in flowers is not a single pigment — it is the sum of all absorption spectra. Understanding this additive biochemistry is the foundation for predicting flower color from gene expression.',
    },
    {
      title: 'Light absorption spectra — the physics of color',
      concept: `To understand flower color deeply, you need the physics of **light absorption**. When light hits a pigment molecule, specific wavelengths are absorbed because their energy matches the energy gap between electron orbitals in the molecule.

**Beer-Lambert Law** governs light absorption: A = epsilon * c * l, where:
- A = absorbance (optical density)
- epsilon = molar extinction coefficient (how strongly the pigment absorbs at a given wavelength)
- c = pigment concentration (mol/L)
- l = path length through the tissue (cm)

**Transmittance** T = 10^(-A), and **reflectance** in flowers is approximated by R = 1 - (1-T)*k, where k is a scattering factor.

The perceived color depends on the **reflectance spectrum** integrated against the human **cone response functions**:
- S-cones (blue): peak sensitivity ~420nm
- M-cones (green): peak sensitivity ~530nm
- L-cones (red): peak sensitivity ~560nm

The brain interprets the ratios of S:M:L cone signals as color. This is why we can perceive millions of colors from just three receptor types — and why flowers can manipulate our perception by fine-tuning their absorption spectra.

Orchids have evolved remarkably precise control over absorption spectra, producing colors that maximize contrast against their background to attract specific pollinators.`,
      analogy: 'Light absorption is like a sieve with specific mesh sizes. Each pigment molecule is a sieve that lets some wavelength "particles" through and catches others. The mesh size (energy gap) determines which colors are caught. Stack multiple sieves with different mesh sizes (multiple pigments), and only specific wavelengths make it through — the perceived color is what survives the filtering.',
      storyConnection: 'The Blue Vanda (Vanda coerulea) of NE India is one of the world\'s most prized orchids. Its blue color is exceptionally rare in flowers because it requires anthocyanins at unusually high pH (near neutral) combined with metal ion copigmentation. Most anthocyanins are red or purple; achieving blue requires precise biochemical engineering that only a few species have evolved.',
      checkQuestion: 'If you doubled the concentration of anthocyanin in a red orchid petal, would the color become twice as red?',
      checkAnswer: 'No. Beer-Lambert Law says absorbance increases linearly with concentration, but reflectance is an exponential function of absorbance: R = 10^(-A). Doubling concentration doubles A, which means R is squared (roughly). The flower gets darker, not "more red." At very high concentrations, the flower approaches black (all visible light absorbed). There is a diminishing return on color intensity from adding more pigment — this is why petals have optimal pigment concentrations.',
      codeIntro: 'Model the Beer-Lambert law for flower petals and simulate how pigment concentration and pH control the absorption spectrum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Beer-Lambert Law and color perception model

wavelengths = np.linspace(380, 750, 500)

# Molar extinction coefficients (simplified Gaussian models)
def extinction_anthocyanin(wl, ph=4.5):
    if ph < 4:
        return 40000 * np.exp(-0.5 * ((wl - 520) / 40)**2)
    elif ph < 6:
        return 35000 * np.exp(-0.5 * ((wl - 545) / 50)**2)
    else:
        return 30000 * np.exp(-0.5 * ((wl - 580) / 45)**2)

def extinction_carotenoid(wl):
    return 25000 * (np.exp(-0.5 * ((wl - 450) / 35)**2) + 0.4 * np.exp(-0.5 * ((wl - 480) / 30)**2))

# Beer-Lambert: Absorbance = epsilon * c * l
def petal_reflectance(wl, conc_anth=0, conc_carot=0, ph=4.5, path_length=0.02):
    """Calculate reflectance from pigment concentrations (mol/L) and path length (cm)."""
    absorbance = (conc_anth * extinction_anthocyanin(wl, ph) * path_length +
                  conc_carot * extinction_carotenoid(wl) * path_length)
    transmittance = 10**(-absorbance)
    # Approximate reflectance (accounting for scattering)
    reflectance = 0.1 + 0.9 * transmittance * 0.8  # 10% base reflection, 80% scattering
    return np.clip(reflectance, 0, 1)

def spectrum_to_rgb(refl, wl):
    r = np.trapz(refl * np.exp(-0.5*((wl-610)/40)**2), wl)
    g = np.trapz(refl * np.exp(-0.5*((wl-540)/35)**2), wl)
    b = np.trapz(refl * np.exp(-0.5*((wl-450)/30)**2), wl)
    mx = max(r, g, b, 0.01)
    return np.clip([r/mx, g/mx, b/mx], 0, 1)

# Concentration sweep
concentrations = np.linspace(0, 0.005, 50)  # mol/L

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Beer-Lambert Law: Light Absorption in Orchid Petals', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: Anthocyanin spectra at different concentrations
for conc in [0.0005, 0.001, 0.002, 0.004]:
    refl = petal_reflectance(wavelengths, conc_anth=conc, ph=4)
    rgb = spectrum_to_rgb(refl, wavelengths)
    axes[0, 0].plot(wavelengths, refl, color=rgb, linewidth=2, label=f'{conc*1000:.1f} mM')
axes[0, 0].set_xlabel('Wavelength (nm)', color='white')
axes[0, 0].set_ylabel('Reflectance', color='white')
axes[0, 0].set_title('Anthocyanin concentration effect (pH 4)', color='white', fontsize=10)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: pH effect on anthocyanin color
for ph in [3.0, 4.0, 5.0, 6.0, 7.0]:
    refl = petal_reflectance(wavelengths, conc_anth=0.002, ph=ph)
    rgb = spectrum_to_rgb(refl, wavelengths)
    axes[0, 1].plot(wavelengths, refl, color=rgb, linewidth=2, label=f'pH {ph}')
axes[0, 1].set_xlabel('Wavelength (nm)', color='white')
axes[0, 1].set_ylabel('Reflectance', color='white')
axes[0, 1].set_title('pH shifts anthocyanin color', color='white', fontsize=10)
axes[0, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3: Color gradient with concentration
color_bar = np.zeros((20, len(concentrations), 3))
for i, conc in enumerate(concentrations):
    refl = petal_reflectance(wavelengths, conc_anth=conc, ph=4)
    rgb = spectrum_to_rgb(refl, wavelengths)
    color_bar[:, i] = rgb
axes[0, 2].imshow(color_bar, aspect='auto', extent=[0, 5, 0, 1])
axes[0, 2].set_xlabel('Anthocyanin (mM)', color='white')
axes[0, 2].set_title('Color gradient: white to dark red', color='white', fontsize=10)
axes[0, 2].set_yticks([])

# 4: Beer-Lambert verification (absorbance vs concentration)
peak_abs = []
for conc in concentrations:
    A = conc * extinction_anthocyanin(np.array([520]), 4)[0] * 0.02
    peak_abs.append(A)
axes[1, 0].plot(concentrations * 1000, peak_abs, color='#ef4444', linewidth=2.5)
axes[1, 0].set_xlabel('Concentration (mM)', color='white')
axes[1, 0].set_ylabel('Absorbance at 520nm', color='white')
axes[1, 0].set_title('Beer-Lambert: linear A vs c', color='white', fontsize=10)

# 5: Human cone responses and color perception
s_cone = np.exp(-0.5 * ((wavelengths - 420) / 25)**2)
m_cone = np.exp(-0.5 * ((wavelengths - 530) / 35)**2)
l_cone = np.exp(-0.5 * ((wavelengths - 560) / 40)**2)
axes[1, 1].plot(wavelengths, s_cone, color='#3b82f6', linewidth=2, label='S (blue)')
axes[1, 1].plot(wavelengths, m_cone, color='#22c55e', linewidth=2, label='M (green)')
axes[1, 1].plot(wavelengths, l_cone, color='#ef4444', linewidth=2, label='L (red)')
axes[1, 1].fill_between(wavelengths, s_cone, alpha=0.1, color='#3b82f6')
axes[1, 1].fill_between(wavelengths, m_cone, alpha=0.1, color='#22c55e')
axes[1, 1].fill_between(wavelengths, l_cone, alpha=0.1, color='#ef4444')
axes[1, 1].set_xlabel('Wavelength (nm)', color='white')
axes[1, 1].set_ylabel('Sensitivity', color='white')
axes[1, 1].set_title('Human cone response functions', color='white', fontsize=10)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6: Mixing two pigments — color space
n_mix = 20
mix_colors = np.zeros((n_mix, n_mix, 3))
for i, ca in enumerate(np.linspace(0, 0.004, n_mix)):
    for j, cc in enumerate(np.linspace(0, 0.003, n_mix)):
        refl = petal_reflectance(wavelengths, conc_anth=ca, conc_carot=cc, ph=4)
        mix_colors[j, i] = spectrum_to_rgb(refl, wavelengths)

axes[1, 2].imshow(mix_colors, aspect='auto', origin='lower',
                    extent=[0, 4, 0, 3])
axes[1, 2].set_xlabel('Anthocyanin (mM)', color='white')
axes[1, 2].set_ylabel('Carotenoid (mM)', color='white')
axes[1, 2].set_title('Two-pigment color space', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Beer-Lambert Law demonstration:")
print(f"  Doubling concentration doubles absorbance: {peak_abs[10]:.3f} -> {peak_abs[20]:.3f}")
print(f"  But reflectance is NOT halved (exponential relationship)")
print(f"\\\nColor depends on THREE factors:")
print(f"  1. Which pigments are present (absorption spectra)")
print(f"  2. Their concentrations (Beer-Lambert intensity)")
print(f"  3. The vacuolar pH (shifts anthocyanin peak)")`,
      challenge: 'Add a "copigmentation" effect: when metal ions (Al3+, Fe3+) are present, anthocyanin absorption shifts by 20-40nm toward blue. This is how Vanda coerulea achieves its blue color. Model this and show the spectrum.',
      successHint: 'The physics of color perception is quantitative and predictable. From pigment concentrations and pH, you can calculate the exact reflectance spectrum and perceived color. This is computational biochemistry.',
    },
    {
      title: 'Pollinator coevolution — colors as communication',
      concept: `Flower colors are not random — they are **signals** optimized by natural selection to attract specific pollinators. Different pollinator groups see different wavelength ranges and have different color preferences:

**Bees** see UV, blue, and green (but not red). They prefer blue, purple, and UV-patterned flowers. Many "white" flowers have UV patterns invisible to humans but stunning to bees — called **nectar guides**.

**Butterflies** see a broad spectrum including red. They prefer red, orange, and pink flowers with landing platforms.

**Hummingbirds** have excellent red vision. They prefer red, tubular flowers (in the Americas; Asia has equivalent bird pollinators).

**Moths** (nocturnal) rely on scent more than color, but prefer white or pale flowers that reflect moonlight.

**Flies** prefer dark red, brown, and purple flowers — especially those mimicking rotting flesh (carrion flowers).

**Beetles** are attracted to white and green, often large flat flowers for landing.

This pollinator-mediated selection has driven the extraordinary color diversity in orchids. Orchids are masters of **pollinator deception**: some mimic female insects (sexual deception), some mimic food sources, and some use UV patterns visible only to bees. The color is the critical communication channel.

Coevolution creates **pollination syndromes**: suites of traits (color, shape, scent, nectar composition) that correlate with specific pollinators. The color alone is often diagnostic.`,
      analogy: 'Flower-pollinator coevolution is like a radio station and its listeners. The flower "broadcasts" on a specific frequency (color wavelength) that its target pollinator is "tuned to." A bee-pollinated flower broadcasts on the UV/blue channel; a hummingbird-pollinated flower broadcasts on the red channel. Broadcasting on the wrong channel means no pollinator visits, no seeds, no offspring. Natural selection quickly tunes the broadcast to the right frequency.',
      storyConnection: 'NE India\'s orchids demonstrate the full range of pollination syndromes. Dendrobium species with purple flowers attract bees. Red Renanthera species are bird-pollinated. White Coelogyne species open at dusk for moth pollination. The extraordinary orchid diversity of Meghalaya is driven partly by the diversity of pollinators — each pollinator group exerts different color selection pressures, diversifying the color palette.',
      checkQuestion: 'A bee-pollinated orchid evolves a red mutant (loses the ability to produce anthocyanins at the right pH). What happens to its reproductive success?',
      checkAnswer: 'Reproductive success would plummet. Bees cannot see red (they lack long-wavelength photoreceptors). A red flower is effectively invisible to bees — it appears dark/black to them. No bee visits means no pollination, no seed production. The red mutant would be strongly selected against. However, if hummingbirds or butterflies are present, the red mutant might attract a NEW pollinator and potentially found a new lineage. This is how pollinator shifts drive speciation in orchids.',
      codeIntro: 'Model pollinator vision systems and show how the same flower appears different to different pollinators.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(300, 750, 500)  # include UV

# Pollinator vision models (spectral sensitivity curves)
def bee_vision(wl):
    """Bees see UV, blue, green — NOT red."""
    uv = np.exp(-0.5 * ((wl - 350) / 30)**2)
    blue = np.exp(-0.5 * ((wl - 440) / 35)**2)
    green = np.exp(-0.5 * ((wl - 540) / 40)**2)
    return {'UV': uv, 'Blue': blue, 'Green': green}

def butterfly_vision(wl):
    """Butterflies see UV through red."""
    uv = np.exp(-0.5 * ((wl - 360) / 25)**2)
    blue = np.exp(-0.5 * ((wl - 460) / 30)**2)
    green = np.exp(-0.5 * ((wl - 530) / 35)**2)
    red = np.exp(-0.5 * ((wl - 620) / 40)**2)
    return {'UV': uv, 'Blue': blue, 'Green': green, 'Red': red}

def human_vision(wl):
    """Humans see blue, green, red — NOT UV."""
    blue = np.exp(-0.5 * ((wl - 420) / 25)**2) * (wl > 380)
    green = np.exp(-0.5 * ((wl - 530) / 35)**2)
    red = np.exp(-0.5 * ((wl - 560) / 40)**2)
    return {'Blue': blue, 'Green': green, 'Red': red}

# Flower reflectance spectra (including UV patterns)
flowers = {
    'White orchid + UV guides': lambda wl: np.where((wl > 340) & (wl < 380), 0.2, 0.9),  # UV-absorbing center
    'Purple Dendrobium': lambda wl: np.clip(1 - 0.8*np.exp(-0.5*((wl-540)/50)**2), 0, 1),
    'Red Renanthera': lambda wl: np.clip(0.9 * (wl > 600).astype(float) + 0.1, 0, 1),
    'Yellow Dendrobium': lambda wl: np.clip(1 - 0.7*np.exp(-0.5*((wl-450)/35)**2), 0, 1),
    'Green Cymbidium': lambda wl: np.clip(1 - 0.8*np.exp(-0.5*((wl-430)/20)**2) - 0.6*np.exp(-0.5*((wl-680)/25)**2), 0, 1),
}

def perceived_color(reflectance, vision_func, wl):
    """Calculate how a pollinator perceives a flower."""
    channels = vision_func(wl)
    perceived = {}
    for name, sensitivity in channels.items():
        perceived[name] = np.trapz(reflectance * sensitivity, wl)
    # Normalize
    total = sum(perceived.values())
    if total > 0:
        for k in perceived:
            perceived[k] /= total
    return perceived

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Pollinator Vision: How Different Animals See Orchids', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: Vision system comparison
vision_systems = {'Bee': bee_vision, 'Butterfly': butterfly_vision, 'Human': human_vision}
vis_colors = {'UV': '#8b5cf6', 'Blue': '#3b82f6', 'Green': '#22c55e', 'Red': '#ef4444'}
for idx, (name, vis_func) in enumerate(vision_systems.items()):
    channels = vis_func(wavelengths)
    for ch_name, ch_vals in channels.items():
        axes[0, idx].plot(wavelengths, ch_vals, color=vis_colors[ch_name], linewidth=2, label=ch_name)
        axes[0, idx].fill_between(wavelengths, ch_vals, alpha=0.1, color=vis_colors[ch_name])
    axes[0, idx].set_xlabel('Wavelength (nm)', color='white')
    axes[0, idx].set_ylabel('Sensitivity', color='white')
    axes[0, idx].set_title(f'{name} vision', color='white', fontsize=10)
    axes[0, idx].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
    axes[0, idx].axvline(380, color='white', linestyle=':', alpha=0.3)  # UV/visible boundary

# 2: How each pollinator sees each flower
flower_names = list(flowers.keys())
pollinators = ['Bee', 'Butterfly', 'Human']
vis_funcs = [bee_vision, butterfly_vision, human_vision]

perception_matrix = np.zeros((len(flower_names), len(pollinators)))
for i, (fname, frefl) in enumerate(flowers.items()):
    refl = frefl(wavelengths)
    for j, (pname, pfunc) in enumerate(zip(pollinators, vis_funcs)):
        perc = perceived_color(refl, pfunc, wavelengths)
        # "Attractiveness" = how much signal in the pollinator's preferred channels
        if pname == 'Bee':
            perception_matrix[i, j] = perc.get('Blue', 0) + perc.get('UV', 0)
        elif pname == 'Butterfly':
            perception_matrix[i, j] = perc.get('Red', 0) + perc.get('UV', 0)
        else:
            perception_matrix[i, j] = max(perc.values()) - min(perc.values())  # contrast

# Normalize rows
for i in range(len(flower_names)):
    mx = max(perception_matrix[i].max(), 0.01)
    perception_matrix[i] /= mx

im = axes[1, 0].imshow(perception_matrix, cmap='RdYlGn', aspect='auto', vmin=0, vmax=1)
axes[1, 0].set_xticks(range(len(pollinators)))
axes[1, 0].set_xticklabels(pollinators, fontsize=9, color='white')
axes[1, 0].set_yticks(range(len(flower_names)))
axes[1, 0].set_yticklabels([f[:15] for f in flower_names], fontsize=7, color='white')
axes[1, 0].set_title('Flower visibility to pollinators', color='white', fontsize=10)
for i in range(len(flower_names)):
    for j in range(len(pollinators)):
        axes[1, 0].text(j, i, f'{perception_matrix[i,j]:.2f}', ha='center', va='center',
                         color='black' if perception_matrix[i,j] > 0.5 else 'white', fontsize=8)

# 3: Flower spectra
for fname, frefl in flowers.items():
    refl = frefl(wavelengths)
    axes[1, 1].plot(wavelengths, refl, linewidth=2, label=fname[:15])
axes[1, 1].axvspan(300, 380, alpha=0.1, color='#8b5cf6', label='UV range')
axes[1, 1].set_xlabel('Wavelength (nm)', color='white')
axes[1, 1].set_ylabel('Reflectance', color='white')
axes[1, 1].set_title('Flower reflectance spectra', color='white', fontsize=10)
axes[1, 1].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4: Pollination syndrome matching
syndromes = {
    'Bee syndrome': {'preferred_color': 'blue/purple', 'score': [0.9, 0.8, 0.2, 0.3, 0.1]},
    'Bird syndrome': {'preferred_color': 'red', 'score': [0.1, 0.2, 0.9, 0.1, 0.1]},
    'Moth syndrome': {'preferred_color': 'white', 'score': [0.8, 0.1, 0.1, 0.3, 0.1]},
    'Butterfly syn.': {'preferred_color': 'orange/red', 'score': [0.3, 0.7, 0.7, 0.8, 0.2]},
}

x = np.arange(len(flower_names))
for i, (syn, data) in enumerate(syndromes.items()):
    axes[1, 2].plot(x, data['score'], 'o-', linewidth=1.5, label=syn, alpha=0.8)
axes[1, 2].set_xticks(x)
axes[1, 2].set_xticklabels([f[:10] for f in flower_names], fontsize=7, color='white', rotation=30)
axes[1, 2].set_ylabel('Syndrome match', color='white')
axes[1, 2].set_title('Pollination syndrome matching', color='white', fontsize=10)
axes[1, 2].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Pollination syndrome analysis:")
for fname in flower_names:
    best_match = max(syndromes.items(), key=lambda s: s[1]['score'][flower_names.index(fname)])
    print(f"  {fname[:25]:<28} -> {best_match[0]} ({best_match[1]['preferred_color']})")`,
      challenge: 'Add a "moth vision" model (peak sensitivity at 380nm UV and 500nm green, no red). How does the white orchid with UV guides appear to a moth? Is the UV pattern visible?',
      successHint: 'Flowers are communication devices, not decorations. Their colors are precisely tuned to the visual systems of their pollinators. Understanding this coevolution explains why flowers look the way they do.',
    },
    {
      title: 'Structural color — iridescence without pigments',
      concept: `Not all flower color comes from pigments. Some orchids produce **structural color** — color generated by the physical structure of cells rather than by chemical pigments. This creates **iridescence**: color that shifts with viewing angle, like a soap bubble or peacock feather.

Structural color arises from **thin-film interference** and **diffraction gratings**:
- When light hits a thin transparent layer (e.g., the cuticle of a petal), some reflects off the top surface and some off the bottom surface
- The two reflected beams interfere: if the path difference equals a whole number of wavelengths, they constructively interfere (bright); if half a wavelength, they destructively interfere (dark)
- The condition for constructive interference: 2*n*d*cos(theta) = m*lambda, where n is refractive index, d is layer thickness, theta is viewing angle, m is an integer, lambda is wavelength
- Because the condition depends on theta (viewing angle), the reflected color changes with angle — iridescence

Some orchid petals have **multiple thin layers** (like a Bragg reflector) that reinforce specific wavelengths, producing brilliant metallic colors. Others have **surface striations** (regular ridges) that act as diffraction gratings, splitting white light into its component colors.

Structural color has advantages over pigment color: it does not fade with UV exposure (pigments bleach), it can produce colors impossible with pigments alone (metallic sheens), and it is angle-dependent — attracting pollinators from specific approach angles.`,
      analogy: 'Structural color is like the rainbow you see on a CD. The CD has no colored dye — its rainbow comes from tiny grooves that split white light by diffraction. Similarly, an iridescent orchid petal has no special pigment for its shimmer — the shimmer comes from the physical arrangement of nanoscale cellular structures that diffract light into specific colors.',
      storyConnection: 'Several NE Indian orchids exhibit subtle iridescence, particularly Dendrobium and Bulbophyllum species from Meghalaya\'s forests. The iridescent sheen is most visible in dim forest light, where it creates a metallic flash that catches the eye of pollinators from specific approach angles. This structural color is an adaptation to the low-light conditions of the forest understory.',
      checkQuestion: 'If a structural color depends on a thin film of thickness d, and the orchid grows in a warmer climate where thermal expansion increases d by 5%, how does the reflected color change?',
      checkAnswer: 'The condition is 2*n*d*cos(theta) = m*lambda. If d increases by 5%, then lambda must also increase by 5% for the same interference condition. A 5% increase in reflected wavelength shifts the color toward longer wavelengths (red-shift). A blue structural color (450nm) would shift to 450*1.05 = 473nm (blue-green). This temperature sensitivity means structural colors can vary with climate — a potential issue under climate change.',
      codeIntro: 'Model thin-film interference and diffraction to simulate structural color in orchid petals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 750, 500)

# Thin-film interference model
def thin_film_reflectance(wl, thickness_nm, n_film=1.45, n_air=1.0, angle_deg=0):
    """Calculate reflectance from a thin film (single layer)."""
    angle = np.radians(angle_deg)
    # Snell's law for refracted angle
    sin_refracted = n_air / n_film * np.sin(angle)
    cos_refracted = np.sqrt(1 - sin_refracted**2)

    # Path difference
    path_diff = 2 * n_film * thickness_nm * cos_refracted  # in nm

    # Phase difference (in radians)
    phase = 2 * np.pi * path_diff / wl + np.pi  # +pi for phase change at denser medium

    # Reflectance (simplified Fabry-Perot)
    r = ((n_film - n_air) / (n_film + n_air))**2
    reflectance = 2 * r * (1 + np.cos(phase)) / (1 + r**2 + 2*r*np.cos(phase))
    return reflectance

# Multi-layer (Bragg reflector) model
def bragg_reflectance(wl, n_layers=5, d1=120, d2=80, n1=1.5, n2=1.3, angle_deg=0):
    """Simplified Bragg reflector: alternating high/low index layers."""
    total_refl = np.zeros_like(wl)
    for layer in range(n_layers):
        # Each layer contributes with increasing phase
        r1 = thin_film_reflectance(wl, d1 * (layer + 1), n1, 1.0, angle_deg)
        r2 = thin_film_reflectance(wl, d2 * (layer + 1), n2, 1.0, angle_deg)
        total_refl += r1 + r2
    return np.clip(total_refl / (n_layers * 2), 0, 1)

def spectrum_to_rgb(refl, wl):
    r = np.trapz(refl * np.exp(-0.5*((wl-610)/40)**2), wl)
    g = np.trapz(refl * np.exp(-0.5*((wl-540)/35)**2), wl)
    b = np.trapz(refl * np.exp(-0.5*((wl-450)/30)**2), wl)
    mx = max(r, g, b, 0.01)
    return np.clip([r/mx, g/mx, b/mx], 0, 1)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Structural Color in Orchid Petals', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1: Single thin film at different thicknesses
for d in [100, 150, 200, 250, 300]:
    refl = thin_film_reflectance(wavelengths, d)
    rgb = spectrum_to_rgb(refl, wavelengths)
    axes[0, 0].plot(wavelengths, refl, color=rgb, linewidth=2, label=f'd={d}nm')
axes[0, 0].set_xlabel('Wavelength (nm)', color='white')
axes[0, 0].set_ylabel('Reflectance', color='white')
axes[0, 0].set_title('Thin film: thickness controls color', color='white', fontsize=10)
axes[0, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: Angle dependence (iridescence!)
angles = [0, 15, 30, 45, 60]
for ang in angles:
    refl = thin_film_reflectance(wavelengths, 200, angle_deg=ang)
    rgb = spectrum_to_rgb(refl, wavelengths)
    axes[0, 1].plot(wavelengths, refl, color=rgb, linewidth=2, label=f'{ang}deg')
axes[0, 1].set_xlabel('Wavelength (nm)', color='white')
axes[0, 1].set_ylabel('Reflectance', color='white')
axes[0, 1].set_title('Iridescence: color shifts with angle', color='white', fontsize=10)
axes[0, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3: Bragg reflector (multi-layer, vivid color)
for n_layers in [1, 3, 5, 10]:
    refl = bragg_reflectance(wavelengths, n_layers=n_layers)
    axes[0, 2].plot(wavelengths, refl, linewidth=2, label=f'{n_layers} layers')
axes[0, 2].set_xlabel('Wavelength (nm)', color='white')
axes[0, 2].set_ylabel('Reflectance', color='white')
axes[0, 2].set_title('Bragg reflector: more layers = purer color', color='white', fontsize=10)
axes[0, 2].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4: Iridescence map (angle vs wavelength)
angle_range = np.linspace(0, 70, 100)
irid_map = np.zeros((100, len(wavelengths)))
for i, ang in enumerate(angle_range):
    irid_map[i] = thin_film_reflectance(wavelengths, 200, angle_deg=ang)
axes[1, 0].imshow(irid_map, aspect='auto', extent=[380, 750, 70, 0], cmap='magma')
axes[1, 0].set_xlabel('Wavelength (nm)', color='white')
axes[1, 0].set_ylabel('Viewing angle (deg)', color='white')
axes[1, 0].set_title('Iridescence map (d=200nm)', color='white', fontsize=10)

# 5: Pigment vs structural color comparison
pigment_refl = 1 - 0.8 * np.exp(-0.5*((wavelengths-520)/40)**2)  # green pigment
struct_refl = bragg_reflectance(wavelengths, n_layers=5, d1=100, d2=70)
axes[1, 1].plot(wavelengths, pigment_refl, color='#22c55e', linewidth=2.5, label='Pigment green')
axes[1, 1].plot(wavelengths, struct_refl, color='#06b6d4', linewidth=2.5, label='Structural blue-green')
axes[1, 1].set_xlabel('Wavelength (nm)', color='white')
axes[1, 1].set_ylabel('Reflectance', color='white')
axes[1, 1].set_title('Pigment vs structural color', color='white', fontsize=10)
axes[1, 1].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6: Color swatch grid (thickness x angle)
thicknesses = np.linspace(80, 350, 30)
angles_grid = np.linspace(0, 60, 20)
color_grid = np.zeros((len(angles_grid), len(thicknesses), 3))
for i, ang in enumerate(angles_grid):
    for j, d in enumerate(thicknesses):
        refl = thin_film_reflectance(wavelengths, d, angle_deg=ang)
        color_grid[i, j] = spectrum_to_rgb(refl, wavelengths)

axes[1, 2].imshow(color_grid, aspect='auto', origin='lower',
                    extent=[80, 350, 0, 60])
axes[1, 2].set_xlabel('Film thickness (nm)', color='white')
axes[1, 2].set_ylabel('Viewing angle (deg)', color='white')
axes[1, 2].set_title('Structural color space', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Structural color key concepts:")
print(f"  Color is determined by thin film thickness and viewing angle")
print(f"  More layers (Bragg reflector) = purer, more vivid color")
print(f"  Color shifts toward blue at steeper viewing angles")
print(f"  Unlike pigments, structural color does not fade with UV exposure")`,
      challenge: 'Combine structural and pigment color: add a green pigment absorption to a thin-film spectrum. The resulting color is the product of pigment reflectance and structural reflectance. What unique colors can you create that neither mechanism alone can produce?',
      successHint: 'Structural color demonstrates that biology can produce optical effects rivaling human nanotechnology. The precision required — layer thicknesses accurate to tens of nanometers — is achieved by biological self-assembly.',
    },
    {
      title: 'Gene regulation of color — from DNA to petals',
      concept: `Flower color is ultimately controlled by **gene expression** — which genes are turned on, how strongly, and when. The **anthocyanin biosynthesis pathway** is one of the best-understood gene regulatory networks in plants:

**Pathway steps:**
1. **Phenylalanine** (amino acid) -> cinnamic acid (enzyme: PAL)
2. Cinnamic acid -> p-coumaric acid (enzyme: C4H)
3. p-Coumaric acid -> chalcone (enzyme: CHS — **chalcone synthase**, the gateway enzyme)
4. Chalcone -> naringenin (enzyme: CHI)
5. Naringenin -> dihydroflavonol (enzyme: F3H)
6. Dihydroflavonol -> leucoanthocyanidin (enzyme: DFR — **dihydroflavonol reductase**)
7. Leucoanthocyanidin -> anthocyanidin (enzyme: ANS)
8. Anthocyanidin -> anthocyanin (enzyme: UFGT — adds sugar, stabilizes the pigment)

Each enzyme is encoded by a gene. Mutations in any gene disrupt the pathway downstream:
- **CHS knockout** = no flavonoids at all = white flowers
- **DFR knockout** = no anthocyanins = yellow flowers (carotenoids visible)
- **F3\'5\'H mutation** = changes which anthocyanidin is made = shifts between blue and red

**Transcription factors** (MYB, bHLH, WD40) regulate when and where these genes are expressed. A flower can be red at the tips (high MYB expression) and white at the base (low MYB expression) — creating the bicolor patterns common in orchids.`,
      analogy: 'The anthocyanin pathway is like an assembly line in a factory. Raw material (phenylalanine) enters at one end, and each worker (enzyme) adds or modifies something. If worker #3 (CHS) calls in sick, everything downstream stops — no product comes out the end. If worker #6 (DFR) uses a different tool (mutant enzyme), the final product has a different color. The factory manager (transcription factors) decides how many workers to put on each shift and which factory (petal cell) to operate.',
      storyConnection: 'Orchid breeders in Assam and Nagaland use knowledge of color genetics to create new varieties. By crossing a red Dendrobium (active DFR, CHS, ANS) with a white one (CHS knockout), they can predict which offspring will be pink (one functional copy of CHS, producing half the normal anthocyanin). This is applied genetics — understanding the pathway lets you predict crosses.',
      checkQuestion: 'An orchid has a mutation that doubles CHS expression (the gateway enzyme). Does this necessarily double the anthocyanin content and make the flower twice as red?',
      checkAnswer: 'Not necessarily. If CHS is the rate-limiting step, doubling it could increase anthocyanin production. But if another downstream enzyme (e.g., DFR or ANS) is rate-limiting, extra CHS product would accumulate as intermediates without being converted to anthocyanin. The flower might not change color at all. Gene expression is a pathway — bottlenecks can occur at any step. You need to know which step is limiting.',
      codeIntro: 'Model the anthocyanin biosynthesis pathway as a series of enzyme reactions and simulate how gene expression levels control flower color.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Anthocyanin biosynthesis pathway simulation
# Each enzyme is modeled with Michaelis-Menten kinetics

def simulate_pathway(gene_expression, hours=48, dt=0.1):
    """Simulate anthocyanin production from gene expression levels.

    gene_expression: dict with keys 'CHS', 'CHI', 'F3H', 'DFR', 'ANS', 'UFGT'
    Values are relative expression levels (0-2, where 1 = normal)
    """
    t = np.arange(0, hours, dt)
    n = len(t)

    # Metabolite pools (uM)
    pools = {
        'phenylalanine': np.zeros(n),
        'chalcone': np.zeros(n),
        'naringenin': np.zeros(n),
        'dihydroflavonol': np.zeros(n),
        'leucoanthocyanidin': np.zeros(n),
        'anthocyanidin': np.zeros(n),
        'anthocyanin': np.zeros(n),
    }

    # Initial phenylalanine supply
    pools['phenylalanine'][0] = 100

    # Enzyme parameters (Vmax, Km)
    enzymes = {
        'CHS': {'Vmax': 5.0, 'Km': 10, 'substrate': 'phenylalanine', 'product': 'chalcone'},
        'CHI': {'Vmax': 8.0, 'Km': 5, 'substrate': 'chalcone', 'product': 'naringenin'},
        'F3H': {'Vmax': 6.0, 'Km': 8, 'substrate': 'naringenin', 'product': 'dihydroflavonol'},
        'DFR': {'Vmax': 4.0, 'Km': 6, 'substrate': 'dihydroflavonol', 'product': 'leucoanthocyanidin'},
        'ANS': {'Vmax': 5.0, 'Km': 7, 'substrate': 'leucoanthocyanidin', 'product': 'anthocyanidin'},
        'UFGT': {'Vmax': 3.0, 'Km': 5, 'substrate': 'anthocyanidin', 'product': 'anthocyanin'},
    }

    for i in range(1, n):
        # Continuous phenylalanine supply
        pools['phenylalanine'][i] = pools['phenylalanine'][i-1] + 2.0 * dt

        for enz_name, enz in enzymes.items():
            expr = gene_expression.get(enz_name, 1.0)
            Vmax = enz['Vmax'] * expr  # expression modulates Vmax
            Km = enz['Km']
            S = pools[enz['substrate']][i-1 if enz['substrate'] != 'phenylalanine' else i]
            rate = Vmax * S / (Km + S) * dt
            rate = min(rate, S)  # can't consume more than available

            pools[enz['substrate']][i] = max(0, pools[enz['substrate']][i] - rate) if enz['substrate'] != 'phenylalanine' else pools[enz['substrate']][i] - rate
            pools[enz['product']][i] = pools[enz['product']][i-1] + rate

    return t, pools

# Define genetic scenarios
scenarios = {
    'Wild type': {'CHS': 1, 'CHI': 1, 'F3H': 1, 'DFR': 1, 'ANS': 1, 'UFGT': 1},
    'CHS knockout (white)': {'CHS': 0, 'CHI': 1, 'F3H': 1, 'DFR': 1, 'ANS': 1, 'UFGT': 1},
    'DFR low (pale pink)': {'CHS': 1, 'CHI': 1, 'F3H': 1, 'DFR': 0.2, 'ANS': 1, 'UFGT': 1},
    'CHS doubled (deep red)': {'CHS': 2, 'CHI': 1, 'F3H': 1, 'DFR': 1, 'ANS': 1, 'UFGT': 1},
    'All enhanced (super red)': {'CHS': 2, 'CHI': 2, 'F3H': 2, 'DFR': 2, 'ANS': 2, 'UFGT': 2},
}

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Gene Regulation of Flower Color', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = ['#22c55e', '#ffffff', '#fca5a5', '#ef4444', '#7f1d1d']

# 1: Anthocyanin accumulation over time
for idx, (name, expr) in enumerate(scenarios.items()):
    t, pools = simulate_pathway(expr)
    axes[0, 0].plot(t, pools['anthocyanin'], color=colors[idx], linewidth=2, label=name)
axes[0, 0].set_xlabel('Hours', color='white')
axes[0, 0].set_ylabel('Anthocyanin (uM)', color='white')
axes[0, 0].set_title('Anthocyanin production over time', color='white', fontsize=10)
axes[0, 0].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2: Final anthocyanin level by scenario
final_levels = []
for name, expr in scenarios.items():
    _, pools = simulate_pathway(expr)
    final_levels.append(pools['anthocyanin'][-1])
axes[0, 1].barh(list(scenarios.keys()), final_levels, color=colors, alpha=0.8)
axes[0, 1].set_xlabel('Final anthocyanin (uM)', color='white')
axes[0, 1].set_title('Gene expression -> color intensity', color='white', fontsize=10)
axes[0, 1].tick_params(axis='y', labelsize=7)

# 3: Pathway intermediate accumulation (wild type)
_, pools_wt = simulate_pathway(scenarios['Wild type'])
metabolites = ['phenylalanine', 'chalcone', 'naringenin', 'dihydroflavonol', 'anthocyanin']
met_colors = ['#f59e0b', '#f97316', '#ef4444', '#a855f7', '#3b82f6']
t_wt, _ = simulate_pathway(scenarios['Wild type'])
for met, mc in zip(metabolites, met_colors):
    axes[0, 2].plot(t_wt, pools_wt[met], color=mc, linewidth=2, label=met[:10])
axes[0, 2].set_xlabel('Hours', color='white')
axes[0, 2].set_ylabel('Concentration (uM)', color='white')
axes[0, 2].set_title('Pathway intermediates (wild type)', color='white', fontsize=10)
axes[0, 2].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4: CHS expression sweep
chs_levels = np.linspace(0, 3, 30)
final_anth = []
for c in chs_levels:
    _, p = simulate_pathway({'CHS': c, 'CHI': 1, 'F3H': 1, 'DFR': 1, 'ANS': 1, 'UFGT': 1})
    final_anth.append(p['anthocyanin'][-1])
axes[1, 0].plot(chs_levels, final_anth, color='#ef4444', linewidth=2.5)
axes[1, 0].set_xlabel('CHS expression level', color='white')
axes[1, 0].set_ylabel('Final anthocyanin', color='white')
axes[1, 0].set_title('CHS dose-response (gateway enzyme)', color='white', fontsize=10)

# 5: DFR expression sweep
dfr_levels = np.linspace(0, 3, 30)
final_anth_dfr = []
for d in dfr_levels:
    _, p = simulate_pathway({'CHS': 1, 'CHI': 1, 'F3H': 1, 'DFR': d, 'ANS': 1, 'UFGT': 1})
    final_anth_dfr.append(p['anthocyanin'][-1])
axes[1, 1].plot(dfr_levels, final_anth_dfr, color='#a855f7', linewidth=2.5)
axes[1, 1].set_xlabel('DFR expression level', color='white')
axes[1, 1].set_ylabel('Final anthocyanin', color='white')
axes[1, 1].set_title('DFR dose-response (commitment step)', color='white', fontsize=10)

# 6: Rate-limiting step identification
enzyme_names = ['CHS', 'CHI', 'F3H', 'DFR', 'ANS', 'UFGT']
sensitivity = []
for enz in enzyme_names:
    expr_base = {e: 1 for e in enzyme_names}
    _, p_base = simulate_pathway(expr_base)
    expr_up = {e: 1 for e in enzyme_names}
    expr_up[enz] = 1.5  # 50% increase
    _, p_up = simulate_pathway(expr_up)
    pct_change = (p_up['anthocyanin'][-1] - p_base['anthocyanin'][-1]) / p_base['anthocyanin'][-1] * 100
    sensitivity.append(pct_change)

axes[1, 2].bar(enzyme_names, sensitivity, color='#22c55e', alpha=0.8)
axes[1, 2].set_ylabel('% increase in anthocyanin', color='white')
axes[1, 2].set_title('Rate-limiting step (50% expression boost)', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Rate-limiting step analysis:")
for enz, sens in zip(enzyme_names, sensitivity):
    print(f"  {enz}: +50% expression -> {sens:+.1f}% anthocyanin")
bottleneck = enzyme_names[np.argmax(sensitivity)]
print(f"\\\nBottleneck enzyme: {bottleneck}")
print(f"Enhancing {bottleneck} has the greatest effect on flower color.")`,
      challenge: 'Model a bicolor flower: CHS expression is 2x in the petal tips (outer 30%) and 0.3x in the base (inner 70%). Simulate both zones and create a gradient showing the resulting color pattern.',
      successHint: 'The anthocyanin pathway is a beautiful example of how gene regulation creates visible phenotypes. Every color mutation in flowers maps to a specific enzyme in this pathway. Understanding the pathway lets you predict color from genotype.',
    },
    {
      title: 'UV patterns invisible to humans',
      concept: `Many flowers that appear plain white or yellow to humans have elaborate patterns visible only in **ultraviolet (UV) light**. These patterns are invisible to us because our eyes cannot detect wavelengths below ~380nm, but they are vividly visible to bees, butterflies, and other UV-sensitive pollinators.

**UV-absorbing pigments** create these patterns. Flavonoids (including anthocyanins and flavonols) absorb strongly in the UV range (300-380nm). When concentrated in specific petal regions, they create dark marks in the UV — **nectar guides** that point pollinators toward the nectar reward.

Common UV pattern types:
- **Bull\'s-eye**: UV-absorbing center, UV-reflecting periphery (directs pollinators to the center)
- **Landing strips**: UV-absorbing lines radiating from the center (guides for approaching insects)
- **Speckled**: UV-absorbing dots (visual texture that attracts certain pollinators)
- **Full UV reflection**: entire flower reflects UV (signals availability to distant pollinators)

UV photography reveals these hidden patterns. What appears to humans as a uniform yellow sunflower is actually a stunning target with dark UV center and bright UV rim to a bee.

Orchids use UV patterns extensively. Many Dendrobium species have UV guides invisible to human collectors but critical for pollination success. Removing these patterns (through genetic modification) dramatically reduces pollinator visits even though the flower looks unchanged to humans.`,
      analogy: 'UV patterns are like invisible ink messages that only certain people can read. Imagine a white letter that looks blank to you but under a UV lamp reveals a detailed map. The flower is doing the same thing: it writes instructions for pollinators in UV "ink" that is invisible to most predators but readable by the intended audience. The flower is simultaneously camouflaged (to predators who see visible light) and signaling (to pollinators who see UV).',
      storyConnection: 'NE India\'s forest orchids often grow in deep shade where UV light is scarce. Orchids in these habitats rely more on scent than UV patterns. But orchids on exposed ridges and clearings — like those in Meghalaya\'s sacred groves — display elaborate UV patterns to attract bees from a distance. The UV pattern is an adaptation to the light environment.',
      checkQuestion: 'Why would a flower benefit from having its nectar guide visible only in UV (invisible to humans and many predators)?',
      checkAnswer: 'UV-only patterns provide a private communication channel between flower and pollinator. Predators (like crab spiders hiding on flowers to ambush pollinators) cannot see UV patterns, so the pattern does not help predators locate prey. Meanwhile, pollinators can see the pattern from a distance and find the nectar efficiently. The flower gets pollinated more often (pollinators find the reward quickly and move on), while predators are not attracted by the signal. It is a secure communication channel that excludes eavesdroppers.',
      codeIntro: 'Simulate UV patterns in orchid petals and visualize how they appear to bees versus humans.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# UV pattern simulation

# Create a synthetic petal image (radial pattern)
size = 200
x = np.linspace(-1, 1, size)
y = np.linspace(-1, 1, size)
X, Y = np.meshgrid(x, y)
R = np.sqrt(X**2 + Y**2)
Theta = np.arctan2(Y, X)

# Petal mask (elliptical)
petal_mask = (X**2 / 0.8**2 + Y**2 / 0.6**2) < 1

# UV absorption patterns
def bull_eye_uv(R, petal_mask):
    """Bull's eye: UV-absorbing center."""
    pattern = np.where(R < 0.3, 0.9, 0.1)  # center absorbs UV
    return pattern * petal_mask

def landing_strip_uv(R, Theta, petal_mask):
    """Radial landing strips."""
    n_stripes = 5
    stripe = 0.5 + 0.4 * np.cos(n_stripes * Theta)
    pattern = stripe * (R < 0.7)
    return pattern * petal_mask

def spotted_uv(X, Y, petal_mask):
    """Spotted UV pattern."""
    np.random.seed(42)
    pattern = np.zeros_like(X)
    for _ in range(15):
        cx, cy = np.random.uniform(-0.5, 0.5, 2)
        pattern += 0.5 * np.exp(-((X-cx)**2 + (Y-cy)**2) / 0.02)
    return np.clip(pattern, 0, 1) * petal_mask

# Visible light reflectance (what humans see: uniform yellow)
visible_refl = np.ones((size, size)) * 0.9 * petal_mask

# Create comparison images
patterns = {
    'Bull\'s eye': bull_eye_uv(R, petal_mask),
    'Landing strips': landing_strip_uv(R, Theta, petal_mask),
    'Spotted': spotted_uv(X, Y, petal_mask),
}

fig, axes = plt.subplots(3, 4, figsize=(16, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('UV Patterns: The Hidden Language of Flowers', color='white', fontsize=14, fontweight='bold')

for row, (name, uv_pattern) in enumerate(patterns.items()):
    # Column 1: Human vision (visible light only)
    human_img = np.zeros((size, size, 3))
    human_img[:, :, 0] = visible_refl * 0.95  # yellow
    human_img[:, :, 1] = visible_refl * 0.85
    human_img[:, :, 2] = visible_refl * 0.2
    human_img[~petal_mask] = [0.12, 0.10, 0.16]  # background
    axes[row, 0].imshow(human_img, extent=[-1,1,-1,1])
    axes[row, 0].set_title(f'Human view: "{name}"' if row == 0 else '', color='white', fontsize=9)
    axes[row, 0].set_ylabel(name, color='white', fontsize=10, fontweight='bold')
    axes[row, 0].set_xticks([]); axes[row, 0].set_yticks([])

    # Column 2: UV image (what bees see in UV channel)
    uv_img = np.zeros((size, size, 3))
    # High UV absorption = dark in UV photo
    uv_intensity = 1 - uv_pattern  # invert: absorbed UV appears dark
    uv_img[:, :, 0] = uv_intensity * 0.5  # show in purple
    uv_img[:, :, 1] = uv_intensity * 0.1
    uv_img[:, :, 2] = uv_intensity * 0.8
    uv_img[~petal_mask] = [0.12, 0.10, 0.16]
    axes[row, 1].imshow(uv_img, extent=[-1,1,-1,1])
    axes[row, 1].set_title('UV photo' if row == 0 else '', color='white', fontsize=9)
    axes[row, 1].set_xticks([]); axes[row, 1].set_yticks([])

    # Column 3: Bee vision (combined UV + visible)
    bee_img = np.zeros((size, size, 3))
    # Bee sees UV as "blue", green as "green", no red
    bee_img[:, :, 0] = (1 - uv_pattern) * 0.3  # UV channel (mapped to display blue)
    bee_img[:, :, 1] = visible_refl * 0.7  # green channel
    bee_img[:, :, 2] = uv_pattern * 0.9  # UV absorption mapped to display blue
    bee_img[~petal_mask] = [0.12, 0.10, 0.16]
    axes[row, 2].imshow(np.clip(bee_img, 0, 1), extent=[-1,1,-1,1])
    axes[row, 2].set_title('Bee vision (approximate)' if row == 0 else '', color='white', fontsize=9)
    axes[row, 2].set_xticks([]); axes[row, 2].set_yticks([])

    # Column 4: Radial profile
    axes[row, 3].set_facecolor('#111827')
    axes[row, 3].tick_params(colors='gray')
    # Radial average
    r_bins = np.linspace(0, 0.8, 50)
    uv_profile = []
    vis_profile = []
    for r in r_bins:
        mask = (R > r - 0.02) & (R < r + 0.02) & petal_mask
        if mask.any():
            uv_profile.append(uv_pattern[mask].mean())
            vis_profile.append(visible_refl[mask].mean())
        else:
            uv_profile.append(0)
            vis_profile.append(0)
    axes[row, 3].plot(r_bins, vis_profile, color='#f59e0b', linewidth=2, label='Visible')
    axes[row, 3].plot(r_bins, uv_profile, color='#8b5cf6', linewidth=2, label='UV absorption')
    axes[row, 3].set_xlabel('Radius', color='white', fontsize=8)
    axes[row, 3].set_ylabel('Reflectance', color='white', fontsize=8)
    axes[row, 3].set_title('Radial profile' if row == 0 else '', color='white', fontsize=9)
    if row == 0:
        axes[row, 3].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("UV pattern analysis:")
print(f"  Human vision: all three flowers appear uniformly yellow")
print(f"  Bee vision: each flower has a distinct, visible pattern")
print(f"\\\n  Bull's eye: directs pollinators to center (nectar)")
print(f"  Landing strips: guides approach trajectory")
print(f"  Spotted: creates visual texture for species recognition")
print(f"\\\n  These patterns are invisible to predators but essential for pollination.")`,
      challenge: 'Create a "mimicry" scenario: design a UV pattern that copies the bull\'s eye pattern of a rewarding flower species, but the flower has no nectar. This is how some orchids deceive pollinators. How would you quantify the mimicry accuracy?',
      successHint: 'UV patterns reveal that flowers have a hidden visual language optimized for pollinator communication. What humans see is only part of the story — the UV world is equally rich and biologically important.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Flower Color Biology
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Pigments, physics, genetics & pollinator vision</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for color science modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
