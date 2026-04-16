import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PaintedRainLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Rayleigh scattering revisited — why the sky changes color throughout the day",
      concept: "why the sky changes color throughout the day. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Rayleigh scattering revisited --- why the sky changes color throughout the day ---

# Rayleigh scattering intensity is proportional to 1/wavelength^4
# This is why short wavelengths (blue/violet) scatter much more than long ones (red)

wavelengths_nm = np.array([380, 420, 460, 500, 540, 580, 620, 660, 700])
color_names = ["Violet", "Blue-violet", "Blue", "Green", "Yellow-green", "Yellow", "Orange", "Red-orange", "Red"]

# Relative scattering intensity (normalized to red = 1)
scattering = (700 / wavelengths_nm) ** 4

print("=== Rayleigh Scattering Across the Visible Spectrum ===")
print("\
Scattering intensity ~ 1 / wavelength^4")
print("(Normalized so Red at 700nm = 1.0)\
")
print(f"{'Color':<14} {'Wavelength (nm)':<17} {'Relative Scattering':<20}")
print("-" * 51)
for name, wl, s in zip(color_names, wavelengths_nm, scattering):
    bar = "#" * int(s * 3)
    print(f"{name:<14} {wl:<17} {s:<20.2f} {bar}")

# Now model how path length changes scattering at different sun angles
sun_angles_deg = np.array([90, 60, 30, 10, 5, 0])
# Approximate atmospheric path length relative to overhead (using secant)
# At horizon, path is ~38x longer due to atmospheric refraction
path_lengths = np.where(sun_angles_deg > 5, 1 / np.sin(np.radians(sun_angles_deg)), 38.0)
path_lengths[sun_angles_deg == 5] = 11.5

# Blue (460nm) vs Red (700nm) intensity ratio after scattering through atmosphere
# Using Beer-Lambert: I = I0 * exp(-tau * path_length)
tau_blue = 0.15   # optical depth for blue
tau_red = 0.03    # optical depth for red

print("\
\
=== Sky Color vs Sun Angle ===")
print("\
As the sun lowers, light travels through more atmosphere.")
print("Blue scatters away, leaving reds and oranges.\
")
print(f"{'Sun Angle':<12} {'Path Length':<14} {'Blue Remaining':<16} {'Red Remaining':<16} {'Dominant Color'}")
print("-" * 72)
for angle, path in zip(sun_angles_deg, path_lengths):
    blue_remaining = np.exp(-tau_blue * path) * 100
    red_remaining = np.exp(-tau_red * path) * 100
    ratio = blue_remaining / red_remaining if red_remaining > 0 else 0
    if ratio > 0.7:
        color = "Blue sky"
    elif ratio > 0.4:
        color = "Pale / white"
    elif ratio > 0.15:
        color = "Yellow-orange"
    else:
        color = "Deep red"
    print(f"{angle:>5} deg     {path:<14.1f} {blue_remaining:<16.1f} {red_remaining:<16.1f} {color}")

print("\
--- Key Insight ---")
print("Violet scatters {:.1f}x more than red, yet the sky looks blue, not violet.".format(scattering[0]))
print("Why? Our eyes are far more sensitive to blue than violet, and sunlight")
print("contains less violet to begin with. The sky is a combined result of")
print("physics (scattering) AND biology (cone sensitivity).")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Snell's law and dispersion — how raindrops split white light into colors",
      concept: "how raindrops split white light into colors. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Snell's law and dispersion --- how raindrops split white light into colors ---

# Cauchy equation for refractive index of water: n(lambda) = A + B/lambda^2
# where lambda is in micrometers
A = 1.3199
B = 0.00653

wavelengths_nm = np.array([380, 450, 500, 550, 600, 650, 700])
color_names = ["Violet", "Blue", "Cyan", "Green", "Yellow", "Orange", "Red"]
wavelengths_um = wavelengths_nm / 1000.0

# Compute refractive index for each color
n_values = A + B / wavelengths_um**2

print("=== Snell's Law and Dispersion in a Raindrop ===")
print("\
Cauchy equation: n(lambda) = {:.4f} + {:.5f} / lambda^2".format(A, B))
print("\
{:<10} {:<16} {:<18}".format("Color", "Wavelength (nm)", "Refractive Index"))
print("-" * 44)
for name, wl, n in zip(color_names, wavelengths_nm, n_values):
    print(f"{name:<10} {wl:<16} {n:<18.6f}")

# Apply Snell's law: sin(theta_i) = n * sin(theta_r)
# Light enters a raindrop at various incidence angles
# The rainbow angle comes from the minimum deviation angle
print("\
\
=== Refraction at a Water Droplet Surface ===")
print("Snell's law: sin(theta_incident) = n * sin(theta_refracted)\
")

incidence_deg = 60.0
theta_i = np.radians(incidence_deg)
print(f"Incidence angle: {incidence_deg} degrees\
")
print(f"{'Color':<10} {'n':<10} {'Refracted Angle':<18} {'Bending':<12}")
print("-" * 50)
for name, n in zip(color_names, n_values):
    theta_r = np.arcsin(np.sin(theta_i) / n)
    bending = incidence_deg - np.degrees(theta_r)
    print(f"{name:<10} {n:<10.4f} {np.degrees(theta_r):<18.2f} {bending:<12.2f} deg")

# Dispersion: difference in refraction between violet and red
spread = np.degrees(np.arcsin(np.sin(theta_i) / n_values[0])) - np.degrees(np.arcsin(np.sin(theta_i) / n_values[-1]))
print(f"\
Angular spread (violet to red): {abs(spread):.3f} degrees")
print("This tiny spread, amplified by two refractions and one reflection")
print("inside the droplet, creates the full rainbow arc we see in the sky.")

print("\
--- Key Insight ---")
print("Dispersion is small: n_violet - n_red = {:.6f}".format(n_values[0] - n_values[-1]))
print("Yet this tiny difference produces the entire color separation in a rainbow.")
print("The raindrop acts as both a prism (splitting colors) and a mirror (reflecting light back).")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Color mixing — additive vs subtractive color models and CIE color space",
      concept: "additive vs subtractive color models and CIE color space. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Color mixing --- additive vs subtractive color models ---

# Additive mixing (light): R + G + B
# Used in screens, projectors, rainbows
def additive_mix(c1, c2):
    """Mix two RGB colors additively (clamp to 255)."""
    return tuple(min(a + b, 255) for a, b in zip(c1, c2))

# Subtractive mixing (pigments): C + M + Y
# Used in paint, printing, watercolors
def subtractive_mix(c1, c2):
    """Mix two RGB colors subtractively (multiply normalized values)."""
    return tuple(int(a/255 * b/255 * 255) for a, b in zip(c1, c2))

# Define primary colors
red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
cyan = (0, 255, 255)
magenta = (255, 0, 255)
yellow = (255, 255, 0)

print("=== Additive Color Mixing (Light) ===")
print("Primaries: Red, Green, Blue\
")
pairs_add = [("Red + Green", red, green), ("Red + Blue", red, blue), ("Green + Blue", green, blue), ("Red + Green + Blue", red, green)]
for name, c1, c2 in pairs_add:
    result = additive_mix(c1, c2)
    print(f"  {name:<22} = RGB{result}")
rgb_white = additive_mix(additive_mix(red, green), blue)
print(f"  {'Red + Green + Blue':<22} = RGB{rgb_white}  (White!)")

print("\
=== Subtractive Color Mixing (Pigments) ===")
print("Primaries: Cyan, Magenta, Yellow\
")
pairs_sub = [("Cyan + Magenta", cyan, magenta), ("Cyan + Yellow", cyan, yellow), ("Magenta + Yellow", magenta, yellow)]
for name, c1, c2 in pairs_sub:
    result = subtractive_mix(c1, c2)
    print(f"  {name:<22} = RGB{result}")
cmy_black = subtractive_mix(subtractive_mix(cyan, magenta), yellow)
print(f"  {'Cyan + Mag + Yellow':<22} = RGB{cmy_black}  (Black!)")

# CIE xy chromaticity from wavelength (approximate)
print("\
\
=== CIE Chromaticity Coordinates (Simplified) ===")
print("\
The CIE color space maps every visible color to (x, y) coordinates.")
print("All real colors fall inside the horseshoe-shaped gamut boundary.\
")

# Approximate dominant wavelength to CIE xy
cie_data = [
    ("Violet",  380, 0.17, 0.005),
    ("Blue",    460, 0.14, 0.04),
    ("Cyan",    490, 0.06, 0.29),
    ("Green",   520, 0.07, 0.71),
    ("Yellow",  570, 0.44, 0.55),
    ("Orange",  600, 0.63, 0.37),
    ("Red",     700, 0.73, 0.27),
]
print(f"{'Color':<10} {'Wavelength':<12} {'CIE x':<10} {'CIE y':<10}")
print("-" * 42)
for name, wl, x, y in cie_data:
    print(f"{name:<10} {wl:<12} {x:<10.3f} {y:<10.3f}")

# White point
print(f"\
{'D65 White':<10} {'---':<12} {'0.313':<10} {'0.329':<10}")

print("\
--- Key Insight ---")
print("Additive mixing ADDS light (screens, rainbows) -> more light = white.")
print("Subtractive mixing REMOVES light (paint, ink) -> more pigment = black.")
print("A rainbow uses additive mixing: overlapping colors create white bands.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Pigment chemistry — modeling light absorption by paint molecules",
      concept: "modeling light absorption by paint molecules. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Pigment chemistry --- modeling light absorption by paint molecules ---

# Beer-Lambert Law: A = epsilon * c * l
# A = absorbance, epsilon = molar absorptivity, c = concentration, l = path length
# Transmittance T = 10^(-A), so T = fraction of light that passes through

def beer_lambert(epsilon, concentration, path_length):
    """Calculate absorbance and transmittance using Beer-Lambert law."""
    absorbance = epsilon * concentration * path_length
    transmittance = 10 ** (-absorbance)
    return absorbance, transmittance

# Simulate common pigments and their absorption across the spectrum
# Each pigment absorbs certain wavelengths and reflects/transmits others
wavelength_bands = ["Violet", "Blue", "Green", "Yellow", "Orange", "Red"]
wl_centers = [400, 460, 520, 570, 600, 660]

# Molar absorptivity profiles for 4 pigments (arbitrary units)
pigments = {
    "Ultramarine Blue": [0.2, 0.1, 0.6, 0.9, 0.95, 0.98],
    "Cadmium Yellow":   [0.9, 0.85, 0.6, 0.1, 0.05, 0.15],
    "Vermilion Red":    [0.95, 0.9, 0.85, 0.7, 0.3, 0.05],
    "Viridian Green":   [0.7, 0.5, 0.1, 0.3, 0.8, 0.9],
}

concentration = 0.01  # mol/L
path_length = 1.0     # cm

print("=== Beer-Lambert Law: Light Absorption by Pigments ===")
print("\
Formula: Absorbance = epsilon * concentration * path_length")
print(f"Concentration: {concentration} mol/L, Path length: {path_length} cm\
")

for pigment_name, epsilons in pigments.items():
    print(f"--- {pigment_name} ---")
    reflected_colors = []
    for band, eps in zip(wavelength_bands, epsilons):
        absorbance, transmittance = beer_lambert(eps, concentration, path_length)
        pct = transmittance * 100
        bar = "#" * int(pct / 5)
        status = "REFLECTS" if pct > 50 else "absorbs"
        print(f"  {band:<8} eps={eps:<5.2f}  T={pct:>5.1f}%  {bar:<20} {status}")
        if pct > 50:
            reflected_colors.append(band)
    print(f"  => We see: {', '.join(reflected_colors) if reflected_colors else 'Very dark'}\
")

# Mixing two pigments (subtractive): multiply transmittances
print("\
=== Mixing Pigments (Subtractive) ===")
print("When you mix paints, each absorbs independently.")
print("Combined transmittance = T1 * T2 (multiply at each wavelength)\
")

p1_name, p2_name = "Ultramarine Blue", "Cadmium Yellow"
p1_eps = pigments[p1_name]
p2_eps = pigments[p2_name]

print(f"Mixing {p1_name} + {p2_name}:\
")
print(f"{'Band':<10} {'T(blue)':<10} {'T(yellow)':<12} {'T(mixed)':<12} {'Result'}")
print("-" * 52)
mixed_reflects = []
for band, e1, e2 in zip(wavelength_bands, p1_eps, p2_eps):
    _, t1 = beer_lambert(e1, concentration, path_length)
    _, t2 = beer_lambert(e2, concentration, path_length)
    t_mix = t1 * t2
    status = "VISIBLE" if t_mix > 0.3 else "blocked"
    if t_mix > 0.3:
        mixed_reflects.append(band)
    print(f"{band:<10} {t1*100:>6.1f}%   {t2*100:>7.1f}%     {t_mix*100:>7.1f}%    {status}")

print(f"\
=> Mixed color appears: {', '.join(mixed_reflects) if mixed_reflects else 'Very dark'}")
print("\
--- Key Insight ---")
print("Blue pigment absorbs yellow/orange/red; yellow pigment absorbs violet/blue.")
print("Mixed together, only GREEN light passes through both -- that is why")
print("mixing blue and yellow paint gives green, even though blue + yellow LIGHT = white!")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Rainbow geometry — computing rainbow angles from droplet optics",
      concept: "computing rainbow angles from droplet optics. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Rainbow geometry --- computing rainbow angles from droplet optics ---

# A rainbow forms when sunlight enters a raindrop, refracts, reflects
# off the back, and refracts again on exit. The "rainbow angle" is the
# angle of minimum deviation where rays pile up, creating bright color.

def rainbow_angle(n, k=1):
    """
    Compute the rainbow angle for a given refractive index n.
    k=1 for primary rainbow (1 internal reflection)
    k=2 for secondary rainbow (2 internal reflections)
    The incidence angle at minimum deviation: cos(theta_i) = sqrt((n^2 - 1) / (k*(k+2)))
    """
    cos_theta_i = np.sqrt((n**2 - 1) / (k * (k + 2)))
    theta_i = np.arccos(cos_theta_i)
    theta_r = np.arcsin(np.sin(theta_i) / n)
    # Total deviation for k reflections
    deviation = 2 * theta_i - 2 * (k + 1) * theta_r + k * np.pi
    # Rainbow angle measured from the anti-solar point
    rainbow_ang = np.pi - deviation
    return np.degrees(theta_i), np.degrees(theta_r), np.degrees(rainbow_ang)

# Refractive indices for different colors (Cauchy approximation for water)
colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Violet"]
wavelengths = [700, 600, 570, 520, 460, 380]
n_values = [1.3312, 1.3330, 1.3340, 1.3355, 1.3380, 1.3435]

print("=== Primary Rainbow (1 internal reflection) ===")
print("\
Light path: Refract IN -> Reflect -> Refract OUT\
")
print(f"{'Color':<10} {'n':<10} {'Incidence':<12} {'Refraction':<12} {'Rainbow Angle'}")
print("-" * 56)
primary_angles = []
for color, wl, n in zip(colors, wavelengths, n_values):
    ti, tr, ra = rainbow_angle(n, k=1)
    primary_angles.append(ra)
    print(f"{color:<10} {n:<10.4f} {ti:<12.2f} {tr:<12.2f} {ra:<.2f} deg")

print(f"\
Primary rainbow spans: {min(primary_angles):.2f} to {max(primary_angles):.2f} degrees")
print(f"Angular width: {max(primary_angles) - min(primary_angles):.2f} degrees")
print("Red is on the OUTSIDE (larger angle), violet on the INSIDE.")

print("\
\
=== Secondary Rainbow (2 internal reflections) ===")
print("\
Light path: Refract IN -> Reflect -> Reflect -> Refract OUT\
")
print(f"{'Color':<10} {'n':<10} {'Rainbow Angle'}")
print("-" * 32)
secondary_angles = []
for color, n in zip(colors, n_values):
    _, _, ra = rainbow_angle(n, k=2)
    secondary_angles.append(ra)
    print(f"{color:<10} {n:<10.4f} {ra:.2f} deg")

print(f"\
Secondary rainbow spans: {min(secondary_angles):.2f} to {max(secondary_angles):.2f} degrees")
print(f"Angular width: {max(secondary_angles) - min(secondary_angles):.2f} degrees")
print("Colors are REVERSED: red inside, violet outside.")

print("\
=== Alexander's Dark Band ===")
dark_band = min(secondary_angles) - max(primary_angles)
print(f"Gap between primary ({max(primary_angles):.2f} deg) and secondary ({min(secondary_angles):.2f} deg):")
print(f"Dark band width: {dark_band:.2f} degrees")
print("This dark region has no light from either rainbow -- it appears")
print("noticeably darker than the sky above or below the rainbows.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Color perception — modeling human cone response and color matching",
      concept: "modeling human cone response and color matching. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

np.random.seed(42)

# --- Color perception --- modeling human cone response and color matching ---

# Human eyes have 3 types of cone cells: S (short/blue), M (medium/green), L (long/red)
# Each cone type responds to a range of wavelengths with a Gaussian-like sensitivity

def cone_response(wavelength, peak, width):
    """Simplified Gaussian cone sensitivity function."""
    return np.exp(-0.5 * ((wavelength - peak) / width) ** 2)

# Approximate cone peak sensitivities and widths
S_peak, S_width = 420, 30   # Short (blue) cones
M_peak, M_width = 530, 40   # Medium (green) cones
L_peak, L_width = 560, 50   # Long (red) cones

wavelengths = np.arange(380, 720, 10)
color_labels = {380: "Violet", 450: "Blue", 500: "Cyan", 530: "Green",
                570: "Yellow", 600: "Orange", 660: "Red"}

print("=== Human Cone Cell Response ===")
print("\
Three cone types: S (blue, peak 420nm), M (green, peak 530nm), L (red, peak 560nm)\
")
print(f"{'Wavelength':<12} {'S (blue)':<10} {'M (green)':<10} {'L (red)':<10} {'Perceived Color'}")
print("-" * 58)

for wl in range(380, 720, 20):
    s = cone_response(wl, S_peak, S_width)
    m = cone_response(wl, M_peak, M_width)
    l = cone_response(wl, L_peak, L_width)
    # Find closest color label
    closest_label = ""
    for key in sorted(color_labels.keys()):
        if wl >= key:
            closest_label = color_labels[key]
    s_bar = "#" * int(s * 10)
    m_bar = "#" * int(m * 10)
    l_bar = "#" * int(l * 10)
    print(f"{wl:>4} nm      {s:>5.3f} {s_bar:<4}  {m:>5.3f} {m_bar:<4}  {l:>5.3f} {l_bar:<4} {closest_label}")

# Color matching experiment
print("\
\
=== Color Matching: Why Yellow = Red + Green ===")
print("\
Pure yellow light (570nm) activates cones like this:")
s_y = cone_response(570, S_peak, S_width)
m_y = cone_response(570, M_peak, M_width)
l_y = cone_response(570, L_peak, L_width)
print(f"  S = {s_y:.4f},  M = {m_y:.4f},  L = {l_y:.4f}")

print("\
Mixing red (640nm) + green (530nm) light activates cones like this:")
s_mix = cone_response(640, S_peak, S_width) + cone_response(530, S_peak, S_width)
m_mix = cone_response(640, M_peak, M_width) + cone_response(530, M_peak, M_width)
l_mix = cone_response(640, L_peak, L_width) + cone_response(530, L_peak, L_width)
# Normalize to match intensity
scale = (m_y + l_y) / (m_mix + l_mix)
s_mix *= scale
m_mix *= scale
l_mix *= scale
print(f"  S = {s_mix:.4f},  M = {m_mix:.4f},  L = {l_mix:.4f}")

print(f"\
M/L ratio for pure yellow: {m_y/l_y:.3f}")
print(f"M/L ratio for red+green:   {m_mix/l_mix:.3f}")
print("These are close enough that the brain perceives the SAME color!")

# Color blindness
print("\
\
=== Color Vision Deficiency ===")
print("\
Protanopia (no L cones): cannot distinguish red from green")
print("Deuteranopia (no M cones): also confuses red and green")
print("Tritanopia (no S cones): confuses blue and yellow\
")
test_pairs = [("Red (640nm)", 640), ("Green (530nm)", 530)]
for deficiency, missing in [("Protanopia (no L)", "L"), ("Deuteranopia (no M)", "M")]:
    print(f"{deficiency}:")
    for name, wl in test_pairs:
        s = cone_response(wl, S_peak, S_width)
        m = cone_response(wl, M_peak, M_width) if missing != "M" else 0
        l = cone_response(wl, L_peak, L_width) if missing != "L" else 0
        remaining = f"S={s:.3f}" + (f", M={m:.3f}" if missing != "M" else "") + (f", L={l:.3f}" if missing != "L" else "")
        print(f"  {name}: {remaining}")
    print()

print("--- Key Insight ---")
print("Color is not a property of light -- it is a property of our BRAINS.")
print("Any two spectra that trigger the same S, M, L cone ratios look identical,")
print("even if their physical wavelength compositions are completely different.")`,
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
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (optics and wave physics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for color theory and optics of rainbow formation. Click to start.</p>
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
