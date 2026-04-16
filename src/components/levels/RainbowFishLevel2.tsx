import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RainbowFishLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Wave interference patterns — when light waves collide',
      concept: `Level 1 introduced interference as "waves adding or cancelling." Level 2 dives into the mathematics. Light is a wave with:
- **Amplitude (A)**: the "height" of the wave (determines brightness)
- **Wavelength (λ)**: distance between peaks (determines colour, 400-700 nm for visible)
- **Phase (φ)**: where in its cycle the wave is at a given point

When two waves meet, the result depends on their **phase relationship**:
- **Constructive (Δφ = 0, 2π, 4π...)**: amplitudes add → **bright**
- **Destructive (Δφ = π, 3π, 5π...)**: amplitudes cancel → **dark**
- **Intermediate**: partial addition/cancellation → intermediate brightness

The intensity of the combined wave:
**I = I₁ + I₂ + 2√(I₁I₂)cos(Δφ)**

For equal-intensity beams (I₁ = I₂ = I₀):
- Maximum (constructive): I = 4I₀ (four times one beam alone!)
- Minimum (destructive): I = 0 (complete cancellation)
- Average: I = 2I₀

This is the physics behind Young's double-slit experiment (1801), which proved that light is a wave. The same physics creates the colour patterns in fish scales, butterfly wings, and soap bubbles.`,
      analogy: 'Wave interference is like two people on trampolines next to each other. If they jump in sync (same phase), the surface between them bounces extra high (constructive). If one jumps while the other lands (opposite phase), the surface between them barely moves (destructive). The energy isn\'t destroyed — it\'s redistributed to the bright spots.',
      storyConnection: 'Every shimmer of the rainbow fish is an interference pattern — light waves from different crystal layers combining constructively (bright flash) or destructively (dark band). The colours you see are the wavelengths where constructive interference happens.',
      checkQuestion: 'In a double-slit experiment, constructive interference produces bright fringes and destructive produces dark. But total energy is conserved. Where does the "missing" energy from dark fringes go?',
      checkAnswer: 'It goes to the bright fringes. Energy isn\'t created or destroyed by interference — it\'s redistributed. The bright fringes are brighter than they would be without interference (4I₀ instead of 2I₀). The dark fringes have zero intensity. The total energy integrated across all fringes equals the total energy of both beams. Interference is energy redistribution, not creation or destruction.',
      codeIntro: 'Simulate the double-slit interference pattern and show how it depends on wavelength and slit spacing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Double-slit interference pattern
# I(θ) = 4 * I₀ * cos²(π * d * sin(θ) / λ) * sinc²(π * a * sin(θ) / λ)
# d = slit spacing, a = slit width

wavelength = 550  # nm (green)
d = 5000  # nm (slit spacing)
a = 1000  # nm (slit width)

theta = np.linspace(-0.15, 0.15, 1000)  # radians

def double_slit(theta, lam, d, a):
    """Double slit diffraction pattern"""
    interference = np.cos(np.pi * d * np.sin(theta) / lam) ** 2
    # Single slit envelope
    x = np.pi * a * np.sin(theta) / lam
    envelope = np.where(np.abs(x) < 1e-10, 1.0, (np.sin(x) / x) ** 2)
    return 4 * interference * envelope

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Basic pattern
ax = axes[0, 0]
ax.set_facecolor('#111827')
I = double_slit(theta, wavelength, d, a)
ax.plot(np.degrees(theta), I, color='#22c55e', linewidth=2)
ax.fill_between(np.degrees(theta), I, alpha=0.15, color='#22c55e')
ax.set_xlabel('Angle (degrees)', color='white')
ax.set_ylabel('Intensity (I/I₀)', color='white')
ax.set_title(f'Double Slit: λ={wavelength}nm, d={d}nm', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Effect of wavelength
ax = axes[0, 1]
ax.set_facecolor('#111827')
for lam, color, name in [(450, '#3b82f6', 'Blue 450nm'),
                          (550, '#22c55e', 'Green 550nm'),
                          (650, '#ef4444', 'Red 650nm')]:
    I = double_slit(theta, lam, d, a)
    ax.plot(np.degrees(theta), I, color=color, linewidth=2, label=name)
ax.set_xlabel('Angle (degrees)', color='white')
ax.set_title('Effect of Wavelength', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Effect of slit spacing
ax = axes[1, 0]
ax.set_facecolor('#111827')
for spacing, color in [(2000, '#ef4444'), (5000, '#f59e0b'), (10000, '#22c55e')]:
    I = double_slit(theta, wavelength, spacing, a)
    ax.plot(np.degrees(theta), I, color=color, linewidth=2, label=f'd = {spacing}nm')
ax.set_xlabel('Angle (degrees)', color='white')
ax.set_title('Effect of Slit Spacing', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# White light: all wavelengths together
ax = axes[1, 1]
ax.set_facecolor('#111827')
total = np.zeros_like(theta)
wl_range = np.linspace(400, 700, 50)
for lam in wl_range:
    I = double_slit(theta, lam, d, a)
    total += I
total /= len(wl_range)
ax.plot(np.degrees(theta), total, color='white', linewidth=2)
ax.fill_between(np.degrees(theta), total, alpha=0.15, color='white')
ax.set_xlabel('Angle (degrees)', color='white')
ax.set_title('White Light (all wavelengths)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Add colour fringe indication
for angle_deg in np.linspace(-8, 8, 17):
    if abs(angle_deg) > 1:
        theta_val = np.radians(angle_deg)
        # Dominant wavelength at this angle
        m = round(d * np.sin(theta_val) / 550)
        if m != 0:
            dom_wl = d * np.sin(theta_val) / m
            if 400 <= dom_wl <= 700:
                pass  # would add colour indicator

plt.tight_layout()
plt.show()

print("Interference pattern properties:")
print(f"  Fringe spacing ∝ λ/d (smaller slit spacing → wider fringes)")
print(f"  Fringe width ∝ λ/a (smaller slit → wider envelope)")
print()
print("With white light, each colour interferes at a different angle,")
print("creating rainbow-coloured fringes — exactly what fish scales do.")`,
      challenge: 'Replace the two slits with 10 equally-spaced slits (a diffraction grating). The pattern has the same fringe positions but MUCH sharper peaks. Model this and explain why gratings produce better spectral separation.',
      successHint: 'Wave interference is the foundation of all structural colour. Understanding the math — phases, path differences, constructive and destructive conditions — unlocks the ability to engineer colour from structure.',
    },
    {
      title: 'Diffraction gratings — splitting light with grooves',
      concept: `A **diffraction grating** is a surface with many parallel grooves, spaced at regular intervals (typically 300-1800 grooves per mm). When light hits a grating, each groove acts as a source of scattered light, and these scattered waves interfere.

The grating equation:
**d × sin(θ) = m × λ**
Where d is groove spacing, θ is diffraction angle, m is the order (0, ±1, ±2...), and λ is wavelength.

Why gratings are special:
- **Many slits >> 2 slits**: more slits means sharper, more intense peaks
- **Spectral resolution**: a grating with N grooves can resolve wavelengths differing by λ/N (a 10,000-groove grating resolves 0.05 nm)
- **Angular dispersion**: different wavelengths exit at different angles, perfectly separating colours

Gratings appear everywhere in nature:
- **CD/DVD surfaces**: the data tracks act as a diffraction grating (~1600 nm spacing for CDs)
- **Butterfly wing scales**: regular ridges on scale surfaces (500-1000 nm spacing)
- **Beetle shells**: hexagonal gratings create metallic-looking structural colour
- **Morpho butterfly**: the most famous example — the brilliant blue is from a combination of multilayer reflectors and diffraction gratings`,
      analogy: 'A diffraction grating is like a stadium full of fans doing "the wave." If everyone starts at the same time and goes at the same speed, the wave looks coherent and powerful. If the spacing between fans (grooves) matches the wavelength of the "wave," the effect is maximized. More fans (grooves) → more powerful and sharper wave.',
      storyConnection: 'Fish scales sometimes have surface grooves that act as diffraction gratings in addition to their multilayer reflector properties. The rainbow fish\'s dazzling display could be a combination of both effects — gratings creating rainbow dispersion and multilayers boosting specific colours.',
      checkQuestion: 'A CD reflects rainbow colours even though it\'s just silver-coloured plastic. Why?',
      checkAnswer: 'The CD\'s data track spirals have a regular spacing of about 1,600 nm — comparable to visible light wavelengths. This acts as a diffraction grating, sending different wavelengths at different angles. The "silver" is just the aluminium reflective layer. The rainbows are pure structural colour from the periodic groove pattern. A blank CD without data tracks would reflect uniformly.',
      codeIntro: 'Model a diffraction grating and show how it separates white light into a spectrum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Diffraction grating simulation
# N slits with spacing d

def grating_pattern(theta, wavelength, d, N):
    """N-slit diffraction grating intensity"""
    beta = np.pi * d * np.sin(theta) / wavelength
    # Avoid division by zero
    with np.errstate(divide='ignore', invalid='ignore'):
        multi_slit = np.where(np.abs(np.sin(beta)) < 1e-10,
                              N**2,
                              (np.sin(N * beta) / np.sin(beta))**2)
    return multi_slit / N**2

theta = np.linspace(-0.3, 0.3, 2000)
d = 1667  # nm (600 grooves/mm)

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Effect of number of slits
ax = axes[0, 0]
ax.set_facecolor('#111827')
for N, color in [(2, '#ef4444'), (5, '#f59e0b'), (20, '#3b82f6'), (100, '#22c55e')]:
    I = grating_pattern(theta, 550, d, N)
    ax.plot(np.degrees(theta), I, color=color, linewidth=1.5, label=f'N = {N}')
ax.set_xlabel('Angle (degrees)', color='white')
ax.set_ylabel('Normalized intensity', color='white')
ax.set_title('More Grooves = Sharper Peaks', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 1.1)

# Spectral separation
ax = axes[0, 1]
ax.set_facecolor('#111827')
N_grating = 50
for lam, color, name in [(450, '#3b82f6', 'Blue'), (520, '#22c55e', 'Green'),
                          (580, '#f59e0b', 'Yellow'), (650, '#ef4444', 'Red')]:
    I = grating_pattern(theta, lam, d, N_grating)
    ax.plot(np.degrees(theta), I * 0.8, color=color, linewidth=2, label=f'{name} ({lam}nm)')
ax.set_xlabel('Angle (degrees)', color='white')
ax.set_title(f'Spectral Separation (N={N_grating})', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Grating equation visualization
ax = axes[1, 0]
ax.set_facecolor('#111827')
wavelengths = np.linspace(400, 700, 100)
for m in [1, 2, 3]:
    angles = np.degrees(np.arcsin(np.clip(m * wavelengths / d, -1, 1)))
    valid = m * wavelengths / d <= 1
    ax.plot(wavelengths[valid], angles[valid], linewidth=2.5, label=f'Order m = {m}')

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Diffraction angle (degrees)', color='white')
ax.set_title('Grating Equation: d sin(θ) = mλ', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# CD/DVD groove comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
media = {'CD (1600nm)': 1600, 'DVD (740nm)': 740, 'Blu-ray (320nm)': 320,
         'Fish scale (~500nm)': 500}
colors = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b']

for (name, spacing), color in zip(media.items(), colors):
    # First-order angles for visible spectrum
    wl_range = np.linspace(400, 700, 50)
    angles = np.degrees(np.arcsin(np.clip(wl_range / spacing, -1, 1)))
    valid = wl_range / spacing <= 1
    if np.any(valid):
        ax.plot(wl_range[valid], angles[valid], color=color, linewidth=2.5, label=name)

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('1st order angle (degrees)', color='white')
ax.set_title('Diffraction by Different Groove Spacings', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Diffraction grating properties:")
print(f"  Groove spacing: {d} nm (600 grooves/mm)")
print()
print("First-order diffraction angles:")
for wl, name in [(450, 'Blue'), (550, 'Green'), (650, 'Red')]:
    angle = np.degrees(np.arcsin(wl / d))
    print(f"  {name} ({wl}nm): {angle:.1f}°")
print()
print("Resolution: R = m × N")
print(f"  With N=1000 grooves at m=1: can resolve {550/1000:.2f}nm difference")
print("  Spectrometers use gratings with N > 10,000 for precise measurements")`,
      challenge: 'Design a grating that separates the sodium doublet (589.0 nm and 589.6 nm — a 0.6 nm difference). What minimum number of grooves N do you need? Use R = mN where R = λ/Δλ.',
      successHint: 'Diffraction gratings are one of the most important tools in science — every spectrometer, from lab instruments to the Hubble Space Telescope, uses them to separate light into its component wavelengths. Nature invented them first, on fish scales and butterfly wings.',
    },
    {
      title: 'Photonic crystals in nature — forbidden light',
      concept: `A **photonic crystal** is a material with a periodic structure that affects the flow of light, analogous to how a semiconductor crystal affects the flow of electrons. If the periodicity matches the wavelength of light, a **photonic band gap** forms — a range of wavelengths that **cannot propagate** through the material.

In a photonic band gap:
- Light of that wavelength is perfectly reflected (100%, not absorbed)
- The colour is incredibly vivid and saturated
- It doesn't fade (no pigment to bleach)
- It's angle-dependent (iridescent)

Types of photonic crystals:
- **1D**: multilayer stack (fish scales, soap bubbles) — band gap in one direction
- **2D**: periodic array of rods or holes — band gap in a plane
- **3D**: full 3D periodic structure — band gap in ALL directions (rare and difficult to make)

Natural 3D photonic crystals:
- **Opal gemstones**: close-packed silica spheres (~250 nm diameter) create brilliant play-of-colour
- **Weevil scales**: *Lamprocyphus* weevil has diamond-lattice photonic crystals in its scales (the only known biological 3D photonic crystal)
- **Sea mouse bristles**: hollow tubes with a 2D hexagonal photonic crystal structure

These are among the most sophisticated optical structures found in nature — evolved over millions of years, only recently understood by physics.`,
      analogy: 'A photonic crystal is like a room where certain musical notes are "forbidden." If you try to play an A440, the room\'s acoustics cancel the sound wave perfectly — silence. Other notes pass through normally. The room\'s physical structure creates a "sound band gap." Photonic crystals do the same for light — certain colours literally cannot exist inside the material.',
      storyConnection: 'The rainbow fish\'s most vivid colours may come from quasi-photonic-crystal arrangements of guanine platelets. When the platelets are ordered enough to create even a partial band gap, the reflected colour is far more vivid than simple thin-film interference alone. It\'s the difference between a mirror and a coloured spotlight.',
      checkQuestion: 'Opals have been valued as gemstones for thousands of years because of their "play of colour" — colours that change and flash as you rotate the stone. What makes an opal different from a diamond?',
      checkAnswer: 'Diamond\'s brilliance comes from total internal reflection and high dispersion (splitting white light into rainbows at surfaces). Opal\'s play-of-colour comes from 3D photonic crystal diffraction — the ordered silica spheres create band gaps that shift with viewing angle. Diamond bends light; opal forbids it. Diamond is transparent; opal is translucent. Both are beautiful, but by completely different physics.',
      codeIntro: 'Simulate a 1D photonic crystal (Bragg reflector) and find its photonic band gap.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1D Photonic crystal: Bragg reflector (multilayer stack)
# Transfer matrix method

def transfer_matrix_reflectance(wavelengths, layers, angle_deg=0):
    """
    Calculate reflectance spectrum using transfer matrix method.
    layers: list of (n, d) tuples (refractive index, thickness in nm)
    """
    angle_rad = np.radians(angle_deg)
    R = np.zeros_like(wavelengths)

    for i, wl in enumerate(wavelengths):
        # Initialize transfer matrix
        M = np.array([[1, 0], [0, 1]], dtype=complex)

        for n, d in layers:
            # Angle in this layer (Snell's law)
            cos_theta = np.sqrt(1 - (np.sin(angle_rad) / n) ** 2 + 0j)

            # Phase
            delta = 2 * np.pi * n * d * cos_theta / wl

            # Transfer matrix for this layer
            p = n * cos_theta  # for s-polarization
            layer_matrix = np.array([
                [np.cos(delta), 1j * np.sin(delta) / p],
                [1j * p * np.sin(delta), np.cos(delta)]
            ])
            M = M @ layer_matrix

        # Reflectance
        n_in = 1.0  # air
        n_out = 1.33  # water (substrate)
        p_in = n_in * np.cos(angle_rad)
        p_out = n_out * np.sqrt(1 - (np.sin(angle_rad) / n_out) ** 2 + 0j)

        r = (M[0, 0] * p_out + M[0, 1] * p_in * p_out - M[1, 0] - M[1, 1] * p_in) / \
            (M[0, 0] * p_out + M[0, 1] * p_in * p_out + M[1, 0] + M[1, 1] * p_in)
        R[i] = abs(r) ** 2

    return R

# Build photonic crystal: 15 periods of high-n / low-n
n_high = 1.83  # guanine
n_low = 1.33   # cytoplasm
n_periods = 15

# Quarter-wave stack (optimal for band gap)
center_wl = 550  # nm (green)
d_high = center_wl / (4 * n_high)
d_low = center_wl / (4 * n_low)

layers = []
for _ in range(n_periods):
    layers.append((n_high, d_high))
    layers.append((n_low, d_low))

wavelengths = np.linspace(350, 800, 500)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Reflectance spectrum at normal incidence
ax1.set_facecolor('#111827')
R_normal = transfer_matrix_reflectance(wavelengths, layers, 0)
ax1.plot(wavelengths, R_normal * 100, color='#22c55e', linewidth=2.5)
ax1.fill_between(wavelengths, R_normal * 100, alpha=0.15, color='#22c55e')
ax1.axhspan(95, 100, alpha=0.1, color='#ef4444')
ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance (%)', color='white')
ax1.set_title(f'Photonic Crystal Band Gap ({n_periods} periods)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Find band gap edges (>90% reflectance)
in_gap = R_normal > 0.9
if np.any(in_gap):
    gap_wls = wavelengths[in_gap]
    gap_low, gap_high = gap_wls[0], gap_wls[-1]
    gap_center = (gap_low + gap_high) / 2
    gap_width = gap_high - gap_low
    ax1.axvspan(gap_low, gap_high, alpha=0.15, color='#ef4444')
    ax1.annotate(f'Band gap: {gap_low:.0f}-{gap_high:.0f}nm\
(width: {gap_width:.0f}nm)',
                xy=(gap_center, 98), color='#ef4444', fontsize=10, ha='center')

# Band structure diagram (angle vs reflected wavelength)
ax2.set_facecolor('#111827')
angles = np.linspace(0, 60, 50)
band_map = np.zeros((len(angles), len(wavelengths)))

for j, angle in enumerate(angles):
    band_map[j] = transfer_matrix_reflectance(wavelengths, layers, angle) * 100

im = ax2.pcolormesh(wavelengths, angles, band_map, cmap='inferno', vmin=0, vmax=100)
plt.colorbar(im, ax=ax2, label='Reflectance %')
ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Viewing angle (degrees)', color='white')
ax2.set_title('Band Gap Shift with Angle (Iridescence Map)', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Photonic crystal parameters:")
print(f"  High-n layer: n={n_high}, d={d_high:.1f}nm (guanine)")
print(f"  Low-n layer: n={n_low}, d={d_low:.1f}nm (cytoplasm)")
print(f"  Number of periods: {n_periods}")
print(f"  Band gap center: ~{center_wl}nm")
if np.any(in_gap):
    print(f"  Band gap width: {gap_width:.0f}nm ({gap_low:.0f}-{gap_high:.0f}nm)")
    print(f"  Peak reflectance: {R_normal.max()*100:.1f}%")
print()
print("The band gap shifts to shorter wavelengths (blue shift)")
print("as viewing angle increases — this IS iridescence.")`,
      challenge: 'Change center_wl from 550 (green) to 480 (blue) to design a "Morpho butterfly" reflector. What layer thicknesses do you need? Then add disorder: randomly vary each layer thickness by ±10%. How does this affect the band gap?',
      successHint: 'Photonic crystals represent the deepest level of structural colour — light literally cannot propagate at certain wavelengths. Understanding them has led to photonic crystal fibers, LEDs, and solar cells.',
    },
    {
      title: 'Butterfly wing nanostructures — nature\'s most vivid blue',
      concept: `The **Morpho butterfly** of South America has the most studied structural colour in nature. Its wings are a brilliant, iridescent blue — visible from hundreds of meters away — yet contain **no blue pigment**. The colour is entirely structural.

The Morpho wing structure:
1. Wing scales are covered in parallel **ridges** (lamellae), spaced ~220 nm apart
2. Each ridge has a **Christmas tree profile**: stacked shelves of chitin (n ≈ 1.56) separated by air (n = 1.0)
3. These shelves form a multilayer reflector tuned to blue (~470 nm)
4. The ridges are slightly irregular in height — this creates a **matte** blue (scattered in many directions) rather than a **specular** blue (mirror-like in one direction)

The engineering genius:
- **Multilayer reflectors** boost blue reflection to >75%
- **Ridge irregularity** diffuses the reflection so it's visible from wide angles
- **Absorption layer**: beneath the photonic structure, a dark melanin layer absorbs transmitted light, preventing it from muddying the blue
- The combination produces one of the **most vivid colours in nature** — visible from aircraft

Human engineers are copying this: Qualcomm's Mirasol display technology, Morphotex fabrics, and biomimetic paint all attempt to replicate the Morpho's structural blue.`,
      analogy: 'The Morpho butterfly wing is like a stadium jumbotron made of tiny blue LEDs — except each "LED" is a passive reflector, not powered by electricity. The Christmas tree ridges are like thousands of tiny angled mirrors, each reflecting blue and absorbing everything else. The slight randomness is like pixels at slightly different angles, ensuring the image is visible from every seat.',
      storyConnection: 'The rainbow fish creates shimmer through similar (though simpler) nanostructures. If the Morpho is a concert grand piano of structural colour, the rainbow fish is an acoustic guitar — both produce beautiful music through physical structure, just at different levels of complexity.',
      checkQuestion: 'The Morpho\'s blue fades when you soak it in alcohol (which fills the air gaps between chitin layers). Why?',
      checkAnswer: 'The multilayer reflector works because of the refractive index CONTRAST between chitin (n=1.56) and air (n=1.0). When alcohol (n≈1.36) fills the air gaps, the contrast drops dramatically. Less contrast means weaker reflection at the blue wavelength — the colour fades. When the alcohol evaporates, the air returns, contrast is restored, and the blue returns. This proves the colour is structural, not chemical.',
      codeIntro: 'Model the Morpho butterfly wing multilayer reflector and simulate the effect of filling air gaps.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Morpho butterfly wing reflector model
# Chitin/air multilayer with absorption backing

n_chitin = 1.56
n_air = 1.0
n_alcohol = 1.36

# Morpho parameters
d_chitin = 62   # nm (chitin shelf)
d_air = 127     # nm (air gap)
n_layers = 12   # 6 pairs

wavelengths = np.linspace(350, 750, 400)

def morpho_reflectance(wls, n_gap, d_c, d_g, n_pairs, randomness=0):
    """Simplified Morpho reflectance with optional disorder"""
    R = np.zeros_like(wls)
    for i, wl in enumerate(wls):
        # Sum of reflected amplitudes from each layer
        r_total = 0 + 0j
        for p in range(n_pairs):
            # Layer thicknesses with optional randomness
            dc = d_c * (1 + randomness * np.random.uniform(-1, 1))
            dg = d_g * (1 + randomness * np.random.uniform(-1, 1))

            # Phase accumulated to this layer and back
            phase = 2 * 2 * np.pi * (p * (n_chitin * dc + n_gap * dg)) / wl
            # Fresnel reflection amplitude
            r = (n_chitin - n_gap) / (n_chitin + n_gap)
            r_total += r * np.exp(1j * phase)

        R[i] = abs(r_total) ** 2 / n_pairs ** 2
    return R

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Normal Morpho reflectance
ax = axes[0, 0]
ax.set_facecolor('#111827')
R_normal = morpho_reflectance(wavelengths, n_air, d_chitin, d_air, 6)
ax.plot(wavelengths, R_normal * 100, color='#3b82f6', linewidth=2.5, label='Normal (air gaps)')
ax.fill_between(wavelengths, R_normal * 100, alpha=0.2, color='#3b82f6')

# With alcohol
R_alcohol = morpho_reflectance(wavelengths, n_alcohol, d_chitin, d_air, 6)
ax.plot(wavelengths, R_alcohol * 100, color='#ef4444', linewidth=2, linestyle='--', label='Soaked in alcohol')

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance (%)', color='white')
ax.set_title('Morpho Wing: Normal vs Alcohol-Soaked', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Effect of disorder (diffuse vs specular)
ax = axes[0, 1]
ax.set_facecolor('#111827')
for disorder, label, color in [(0, 'Perfect order', '#3b82f6'),
                                (0.05, '5% disorder', '#22c55e'),
                                (0.15, '15% disorder', '#f59e0b'),
                                (0.30, '30% disorder', '#ef4444')]:
    np.random.seed(42)
    R = morpho_reflectance(wavelengths, n_air, d_chitin, d_air, 6, disorder)
    ax.plot(wavelengths, R * 100, linewidth=2, color=color, label=label)

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_title('Effect of Structural Disorder', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Angular reflectance (iridescence)
ax = axes[1, 0]
ax.set_facecolor('#111827')
peak_wavelengths = []
angles = np.arange(0, 61, 5)
for angle in angles:
    # Blue shift with angle: λ_peak = λ_0 * cos(θ)
    cos_factor = np.cos(np.radians(angle))
    peak_wl = 470 * cos_factor
    peak_wavelengths.append(peak_wl)

ax.plot(angles, peak_wavelengths, 'o-', color='#3b82f6', linewidth=2, markersize=6)
ax.fill_between(angles, peak_wavelengths, alpha=0.15, color='#3b82f6')
ax.axhspan(380, 490, alpha=0.1, color='#3b82f6')
ax.axhspan(490, 570, alpha=0.1, color='#22c55e')
ax.text(50, 450, 'Blue', color='#3b82f6', fontsize=10)
ax.text(50, 530, 'Green', color='#22c55e', fontsize=10)
ax.set_xlabel('Viewing angle (degrees)', color='white')
ax.set_ylabel('Peak wavelength (nm)', color='white')
ax.set_title('Iridescence: Blue Shifts with Angle', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Comparison: structural vs pigment colour stability
ax = axes[1, 1]
ax.set_facecolor('#111827')
years = np.arange(0, 51)
structural_stability = 100 * np.ones_like(years, dtype=float)  # doesn't fade
pigment_stability = 100 * np.exp(-0.03 * years)  # fades over decades
structural_stability[20:] -= np.random.uniform(0, 2, 31)  # slight physical degradation

ax.plot(years, structural_stability, color='#3b82f6', linewidth=2.5, label='Structural colour (Morpho)')
ax.plot(years, pigment_stability, color='#ef4444', linewidth=2.5, label='Pigment colour (typical dye)')
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Colour intensity (%)', color='white')
ax.set_title('Colour Durability: Structure vs Pigment', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 110)

plt.tight_layout()
plt.show()

print("Morpho butterfly wing engineering:")
print(f"  Chitin layers: {d_chitin}nm (n={n_chitin})")
print(f"  Air gaps: {d_air}nm (n={n_air})")
print(f"  Peak reflectance: ~{R_normal.max()*100:.0f}% at ~470nm (blue)")
print()
print("With alcohol in gaps: peak drops to ~{:.0f}% (colour fades)".format(R_alcohol.max()*100))
print("Proof that colour is STRUCTURAL, not chemical.")
print()
print("Key advantage: structural colour never fades from UV exposure.")
print("Museum Morpho specimens from 100+ years ago are still vivid blue.")`,
      challenge: 'Design a "Morpho-inspired" reflector for red (650nm) instead of blue. What chitin and air thicknesses do you need? Would this be possible in nature?',
      successHint: 'The Morpho butterfly represents nature\'s most sophisticated optical engineering — a combination of multilayer reflectors, controlled disorder, and absorption backing that took millions of years to evolve and that human engineers are still trying to replicate.',
    },
    {
      title: 'Applications — anti-counterfeiting, displays, and biomimetic optics',
      concept: `Structural colour from nature is being translated into technology at an accelerating pace:

**Anti-counterfeiting**:
- Banknotes and ID cards use **optical variable devices (OVDs)** — thin-film or grating structures that show different colours at different angles
- Nearly impossible to photocopy (copiers can't replicate angle-dependent colour)
- Inspired by butterfly wings and beetle shells
- Canadian $20 bill uses a holographic stripe based on photonic crystal principles

**Displays**:
- **Qualcomm Mirasol** (now discontinued): display technology that used Morpho-inspired interference for energy-efficient, sunlight-readable screens
- **E-ink developments**: structural colour pixels that reflect ambient light instead of emitting, using 0 energy to maintain a static image
- **Colour e-paper**: stacked photonic crystals that can be electrically tuned to reflect different wavelengths

**Materials**:
- **Morphotex fabric**: fibers with multilayer structure that appear coloured without dyes (no fading, no chemical pollution)
- **Cool roofing**: structural colour coatings that reflect infrared without absorbing it (reducing building cooling costs)
- **Automotive paint**: Ford and Toyota use interference-based paints that shift colour with viewing angle

**Sensors**:
- Photonic crystals change colour when they absorb specific chemicals — basis for **visual gas sensors** and **food freshness indicators**`,
      analogy: 'Nature invented structural colour, and humans are photocopying her homework — but it\'s not plagiarism, it\'s **biomimicry**. A 100-million-year-old butterfly wing design is being translated into banknote security, fabric dye alternatives, and energy-efficient displays. The R&D department was evolution; the human engineers are just catching up.',
      storyConnection: 'The rainbow fish\'s shimmer — once just a beautiful natural phenomenon — is now the blueprint for technologies worth billions of dollars. The fish doesn\'t know it\'s carrying patent-worthy nanotechnology in its scales. Understanding nature isn\'t just academic — it\'s the foundation of innovation.',
      checkQuestion: 'A food company wants a "freshness indicator" label that changes from green to red as food spoils. How could photonic crystals accomplish this?',
      checkAnswer: 'Design a photonic crystal that swells when exposed to gases produced by spoiling food (ammonia, hydrogen sulfide). As the crystal swells, the lattice spacing increases, shifting the band gap from short wavelengths (green reflection) to longer wavelengths (red reflection). The colour change is automatic, requires no electronics, and is irreversible (once the food has spoiled). This is called a "chemical-responsive photonic crystal" and multiple research groups are developing it.',
      codeIntro: 'Model a tunable photonic crystal sensor: lattice spacing changes with chemical exposure, shifting the reflected colour.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Tunable photonic crystal: swelling shifts the band gap
# Model: quarter-wave stack where layer thicknesses change

n_high = 1.6   # polymer matrix
n_low = 1.0    # air voids

base_d_high = 80  # nm
base_d_low = 100  # nm
n_pairs = 10

wavelengths = np.linspace(350, 800, 400)

def photonic_reflectance(wls, d_h, d_l, n_p):
    """Simplified photonic crystal reflectance"""
    center = 2 * (n_high * d_h + n_low * d_l)
    R = np.zeros_like(wls)
    for i, wl in enumerate(wls):
        delta = 2 * np.pi * (n_high * d_h + n_low * d_l) / wl
        r = (n_high - n_low) / (n_high + n_low)
        R[i] = (2 * n_p * r * np.cos(delta * n_p)) ** 2
        R[i] = min(R[i], 1.0)
    # Smooth with Gaussian envelope
    peak_wl = center
    sigma = center * 0.08
    envelope = np.exp(-0.5 * ((wls - peak_wl) / sigma) ** 2)
    R = R * envelope
    R = R / max(R.max(), 0.01) * (1 - np.exp(-0.3 * n_p))
    return R

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Freshness sensor simulation
ax1.set_facecolor('#111827')
swelling_factors = [1.0, 1.1, 1.2, 1.3, 1.5]
freshness_labels = ['Fresh', 'Day 1', 'Day 3', 'Day 5', 'Spoiled']
sensor_colors = ['#22c55e', '#84cc16', '#f59e0b', '#ef4444', '#dc2626']

for factor, label, color in zip(swelling_factors, freshness_labels, sensor_colors):
    d_h = base_d_high * factor
    d_l = base_d_low * factor
    R = photonic_reflectance(wavelengths, d_h, d_l, n_pairs)
    ax1.plot(wavelengths, R * 100, linewidth=2, color=color, label=label)

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance (%)', color='white')
ax1.set_title('Photonic Crystal Freshness Sensor', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Technology comparison
ax2.set_facecolor('#111827')
technologies = {
    'Banknote OVD': {'performance': [8, 9, 10, 7, 6], 'color': '#f59e0b'},
    'Morpho display': {'performance': [9, 8, 7, 10, 5], 'color': '#3b82f6'},
    'Structural fabric': {'performance': [7, 10, 9, 6, 8], 'color': '#22c55e'},
    'Food sensor': {'performance': [6, 7, 5, 8, 9], 'color': '#ef4444'},
}
categories = ['Colour\
vividness', 'Durability', 'Angle\
dependence', 'Energy\
efficiency', 'Cost\
effective']

angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
angles += angles[:1]

for name, props in technologies.items():
    values = props['performance'] + props['performance'][:1]
    ax2_polar = fig.add_subplot(122, polar=True)
    ax2_polar.set_facecolor('#111827')

# Clear ax2 and use polar
ax2.remove()
ax_radar = fig.add_subplot(122, polar=True)
ax_radar.set_facecolor('#111827')

for name, props in technologies.items():
    values = props['performance'] + props['performance'][:1]
    ax_radar.plot(angles, values, 'o-', linewidth=2, color=props['color'], label=name)
    ax_radar.fill(angles, values, alpha=0.1, color=props['color'])

ax_radar.set_xticks(angles[:-1])
ax_radar.set_xticklabels(categories, color='white', fontsize=8)
ax_radar.set_ylim(0, 10)
ax_radar.set_yticks([2, 4, 6, 8, 10])
ax_radar.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax_radar.legend(loc='upper right', bbox_to_anchor=(1.35, 1.1), facecolor='#1f2937',
                edgecolor='gray', labelcolor='white', fontsize=8)
ax_radar.set_title('Structural Colour Technologies', color='white', fontsize=12, pad=20)

plt.tight_layout()
plt.show()

print("Biomimetic optics applications:")
print()
print("  Anti-counterfeiting: ~$30B market, structural colour OVDs")
print("  Displays: energy-efficient reflective screens (no backlight)")
print("  Textiles: dye-free colour (no water pollution, no fading)")
print("  Sensors: visual chemical detection (no electronics needed)")
print()
print("All inspired by fish scales, butterfly wings, and beetle shells.")`,
      challenge: 'Design a photonic crystal that can detect two different gases (ammonia shifts it red, CO2 shifts it blue). What crystal parameters would you need? How would a consumer read the dual signal?',
      successHint: 'From the rainbow fish of Umiam Lake to anti-counterfeiting technology — the journey through optics shows how understanding nature\'s designs leads directly to innovation.',
    },
    {
      title: 'Biomimetic optics — engineering light the way nature does',
      concept: `**Biomimetics** (also called biomimicry) is the design of materials and systems modeled on biological structures. In optics, nature is centuries ahead of human engineering.

Key biomimetic optical innovations:

**1. Anti-reflective surfaces (moth eye)**:
- Moth eyes have nano-pillars that create a gradient refractive index
- This eliminates surface reflection (moths need to see in the dark without reflective eyes betraying them to predators)
- Now used on solar panels (+3% efficiency), camera lenses, and smartphone screens

**2. Super-white surfaces (Cyphochilus beetle)**:
- This beetle has scales that scatter ALL wavelengths equally with just 5μm of material
- It achieves the whiteness of 100μm of standard white paint
- Being studied for ultra-thin white coatings (paint, paper, toothpaste)

**3. Ultra-black surfaces (Vantablack inspired by deep-sea fish)**:
- Some deep-sea fish have ultra-black skin that absorbs 99.95% of light
- Nano-sized melanin structures trap light through multiple scattering
- Surrey NanoSystems' Vantablack was partly inspired by these structures

**4. Colour-changing surfaces (chameleon/cuttlefish)**:
- Chameleons change colour by stretching photonic crystals in their skin
- Cuttlefish use chromatophores (pigment-containing cells) controlled by muscles
- Both inspire tunable displays and camouflage materials

The design principles: periodicity for colour selection, disorder for broadband effects, hierarchy (structures at multiple scales) for combining effects, and active tuning for responsiveness.`,
      analogy: 'Biomimetic optics is like translating a foreign language. Nature "wrote" the optical designs in the language of evolution (DNA, proteins, minerals). Engineers "translate" them into the language of manufacturing (lithography, deposition, self-assembly). The designs are the same; only the implementation method changes.',
      storyConnection: 'The rainbow fish of Umiam Lake is a textbook of optical engineering. Its scales combine multilayer reflectors (for colour), surface gratings (for dispersion), and guanine crystals (for high reflectivity). Every structural colour technology in development can trace its principles back to fish scales — the original biomimetic blueprint.',
      checkQuestion: 'If nature already has these incredible optical designs, why did it take human engineers thousands of years to understand and copy them?',
      checkAnswer: 'Two reasons: (1) Scale — these structures are nanoscale (100-1000 nm), invisible to the naked eye. We couldn\'t SEE them until electron microscopes were invented in the 1930s. (2) Physics — we didn\'t understand wave optics, interference, and photonic band gaps until the 19th-20th centuries. Nature doesn\'t need to understand the physics — evolution just selects for what works. Humans need to understand it to replicate it. The gap between natural design and human understanding is closing rapidly.',
      codeIntro: 'Compare natural optical structures and their technological analogs in a comprehensive visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Comprehensive comparison: natural vs engineered optical structures

# Efficiency comparison
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Anti-reflection: moth eye vs engineered coatings
ax1.set_facecolor('#111827')
wavelengths = np.linspace(400, 800, 200)

# Bare glass reflectance
n_glass = 1.5
R_bare = ((n_glass - 1) / (n_glass + 1)) ** 2 * 100

# Single-layer AR coating
n_coating = np.sqrt(n_glass)
d_coating = 550 / (4 * n_coating)
delta = 2 * np.pi * n_coating * d_coating / wavelengths
R_single = ((n_glass - 1)**2 * np.cos(delta)**2 + (n_glass * 1 / n_coating**2 - 1)**2 * np.sin(delta)**2) / \
           ((n_glass + 1)**2 * np.cos(delta)**2 + (n_glass * 1 / n_coating**2 + 1)**2 * np.sin(delta)**2) * 100

# Moth-eye (gradient index — very broad, very low)
R_motheye = 0.1 + 0.05 * np.sin(2 * np.pi * wavelengths / 200) ** 2

ax1.axhline(R_bare, color='#ef4444', linewidth=2, linestyle='--', label=f'Bare glass ({R_bare:.1f}%)')
ax1.plot(wavelengths, R_single, color='#f59e0b', linewidth=2, label='Single AR coating')
ax1.plot(wavelengths, R_motheye, color='#22c55e', linewidth=2, label='Moth-eye nanostructure')
ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance (%)', color='white')
ax1.set_title('Anti-Reflection: Nature vs Engineering', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 5)

# Timeline of biomimetic optics
ax2.set_facecolor('#111827')
events = [
    (1665, "Hooke observes peacock\
feather colours", '#a855f7'),
    (1801, "Young's double slit\
proves wave nature", '#3b82f6'),
    (1917, "Lord Rayleigh explains\
thin-film colour", '#f59e0b'),
    (1962, "First observation of\
photonic structure in beetle", '#22c55e'),
    (1987, "Yablonovitch proposes\
photonic crystals", '#ef4444'),
    (2001, "First biomimetic\
moth-eye AR coating", '#3b82f6'),
    (2010, "Qualcomm Mirasol\
Morpho-inspired display", '#f59e0b'),
    (2015, "Structural colour\
fabrics commercialized", '#22c55e'),
    (2024, "Photonic crystal\
sensors in development", '#a855f7'),
]

for i, (year, label, color) in enumerate(events):
    ax2.barh(i, year - 1600, left=1600, color=color, alpha=0.7, height=0.6)
    ax2.text(year + 5, i, f'{year}: {label}', color='white', fontsize=8, va='center')

ax2.set_yticks([])
ax2.set_xlabel('Year', color='white')
ax2.set_title('Timeline: From Nature to Technology', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_xlim(1650, 2050)

plt.tight_layout()
plt.show()

# Summary metrics
fig2, ax3 = plt.subplots(figsize=(12, 6))
fig2.patch.set_facecolor('#1f2937')
ax3.set_facecolor('#111827')

natural = {
    'Morpho butterfly': {'reflectance': 75, 'bandwidth': 50, 'angle_range': 120, 'durability': 95},
    'Fish scale (guanine)': {'reflectance': 60, 'bandwidth': 80, 'angle_range': 180, 'durability': 70},
    'Opal (photonic crystal)': {'reflectance': 85, 'bandwidth': 30, 'angle_range': 60, 'durability': 99},
    'Moth eye (anti-reflect)': {'reflectance': 99.5, 'bandwidth': 200, 'angle_range': 160, 'durability': 60},
}

categories = list(list(natural.values())[0].keys())
x = np.arange(len(categories))
width = 0.2

for i, (name, metrics) in enumerate(natural.items()):
    values = list(metrics.values())
    # Normalize to 0-100
    normalized = [min(v, 100) for v in values]
    ax3.bar(x + i * width, normalized, width, label=name, alpha=0.8)

ax3.set_xticks(x + width * 1.5)
ax3.set_xticklabels(['Peak\
reflectance %', 'Bandwidth\
(nm)', 'Angular\
range (°)', 'Durability\
(years)'],
                     color='gray', fontsize=9)
ax3.set_ylabel('Value', color='white')
ax3.set_title('Natural Optical Structure Performance', color='white', fontsize=13)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("From fish scales to photonic technology:")
print("  1. Nature evolves the structure (millions of years)")
print("  2. Scientists discover and understand it (decades)")
print("  3. Engineers replicate it (years)")
print("  4. Industry scales it (months)")
print()
print("The rainbow fish of Umiam Lake carries nanotechnology")
print("that humans are only beginning to understand and replicate.")
print("Every shimmer is a lesson in wave physics, materials science,")
print("and evolutionary design — waiting to be translated into technology.")`,
      challenge: 'Research one biomimetic optical product that is currently commercially available. Model its optical performance (reflectance spectrum, angle dependence) and compare it to the natural structure it was inspired by. How close is the engineered version to nature\'s original?',
      successHint: 'Biomimetic optics closes the loop: observe nature, understand the physics, engineer the technology, and improve on it. The rainbow fish is both the beginning and the ongoing inspiration of this journey.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for photonics simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}