import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IbnAlHaythamLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Optical instrument design — microscope and telescope magnification',
      concept: `A **compound microscope** uses two converging lenses: an **objective** (short focal length, close to the specimen) and an **eyepiece** (longer focal length, close to your eye). The objective forms a magnified real image inside the tube, and the eyepiece magnifies that image further.

Total magnification: **M = M_objective × M_eyepiece = (L/f_obj) × (25cm/f_eye)**

where L is the tube length (distance between lenses minus their focal lengths) and 25 cm is the standard near point of the human eye.

A **refracting telescope** (Keplerian) also uses two lenses, but the objective has a LONG focal length (to gather light from distant objects) and the eyepiece has a short focal length. Magnification: **M = f_objective / f_eyepiece**.

The key trade-off: higher magnification requires either longer focal lengths (bigger instruments) or shorter eyepiece focal lengths (which introduce more aberrations).

📚 *Ibn al-Haytham's analysis of magnification through curved glass — how a convex surface enlarges objects behind it — was the theoretical foundation for reading stones, spectacles, and eventually compound optical instruments.*`,
      analogy: 'A microscope is like using two magnifying glasses in series. The first one (objective) creates an enlarged image floating in the air inside the tube. The second one (eyepiece) magnifies THAT image. If the first magnifies 40× and the second 10×, you see 400× — each lens multiplies the other\'s effect.',
      storyConnection: 'Ibn al-Haytham described how a segment of a glass sphere magnifies objects viewed through it — the principle behind reading stones used in medieval monasteries. When two such lenses were combined in a tube centuries later, the microscope and telescope were born. His optical theory made the design of these instruments possible.',
      checkQuestion: 'A microscope has an objective with f = 4 mm, an eyepiece with f = 25 mm, and a tube length of 160 mm. What is the total magnification?',
      checkAnswer: 'M_obj = L/f_obj = 160/4 = 40×. M_eye = 250/f_eye = 250/25 = 10×. Total M = 40 × 10 = 400×. This is a typical laboratory microscope magnification — enough to see individual cells (about 10 µm) as objects 4 mm across.',
      codeIntro: 'Design microscopes and telescopes — calculate magnification, resolution, and field of view.',
      code: `import numpy as np

def microscope_mag(f_obj_mm, f_eye_mm, tube_length_mm=160, near_point_mm=250):
    """Compound microscope total magnification."""
    m_obj = tube_length_mm / f_obj_mm
    m_eye = near_point_mm / f_eye_mm
    return m_obj, m_eye, m_obj * m_eye

def telescope_mag(f_obj_mm, f_eye_mm):
    """Keplerian telescope magnification."""
    return f_obj_mm / f_eye_mm

def rayleigh_limit(wavelength_nm, aperture_mm):
    """Rayleigh resolution limit: θ = 1.22 λ/D (radians)."""
    lam_mm = wavelength_nm / 1e6
    theta_rad = 1.22 * lam_mm / aperture_mm
    return np.degrees(theta_rad) * 3600  # convert to arcseconds

# Microscope design exploration
print("=== Compound Microscope Design ===")
print(f"Tube length: 160 mm | Near point: 250 mm")
print(f"\\\n{'Objective f':>12} {'Eyepiece f':>11} {'M_obj':>7} {'M_eye':>7} {'Total M':>9}")
print("-" * 48)

for f_obj in [2, 4, 10, 20, 40]:
    for f_eye in [10, 25]:
        m_o, m_e, m_t = microscope_mag(f_obj, f_eye)
        print(f"{f_obj:>10} mm {f_eye:>8} mm {m_o:>6.0f}× {m_e:>6.0f}× {m_t:>8.0f}×")

# Telescope design exploration
print("\\\n=== Keplerian Telescope Design ===")
print(f"\\\n{'Objective f':>12} {'Eyepiece f':>11} {'Magnification':>14} {'Tube length':>12}")
print("-" * 51)

for f_obj in [500, 1000, 1500, 2000]:
    for f_eye in [10, 20, 40]:
        mag = telescope_mag(f_obj, f_eye)
        tube = f_obj + f_eye
        print(f"{f_obj:>10} mm {f_eye:>8} mm {mag:>12.0f}× {tube:>10} mm")

# Resolution limits
print("\\\n=== Angular Resolution (Rayleigh Limit) ===")
print(f"Wavelength: 550 nm (green light)")
print(f"\\\n{'Aperture':>12} {'Resolution':>14} {'Can resolve':<30}")
print("-" * 58)

examples = [
    (7, "human pupil (dark)"),
    (50, "binoculars"),
    (100, "small telescope"),
    (200, "8-inch telescope"),
    (2400, "Hubble (2.4 m)"),
    (6500, "James Webb (6.5 m)"),
]

for d, name in examples:
    res = rayleigh_limit(550, d)
    print(f"{d:>10} mm {res:>12.2f}\" {name:<30}")

print("\\\nSmaller resolution = sharper image = can see finer detail")`,
      challenge: 'A telescope needs to resolve two stars separated by 0.5 arcseconds. What minimum aperture is required? Now calculate for a microscope: what is the minimum resolvable feature size for an objective with numerical aperture NA = 0.65 at 550 nm? Use d = 0.61λ/NA. This resolution limit is why electron microscopes exist — electrons have much shorter wavelengths than light.',
      successHint: 'You just designed optical instruments using the same principles that guide real lens engineers. Every microscope, telescope, camera, and projector is designed by combining focal lengths, magnifications, and resolution limits — the exact calculations you performed.',
    },
    {
      title: 'Wave optics — interference and Young\'s double slit',
      concept: `When two light waves overlap, they **interfere**: if their peaks align (in phase), they produce a brighter result (**constructive interference**). If a peak meets a trough (out of phase), they cancel (**destructive interference**).

**Young's double slit experiment** (1801) splits light through two narrow slits. Each slit acts as a new wave source. The two waves travel different distances to reach each point on a screen — when the path difference is a whole number of wavelengths, you get a bright fringe; when it's a half-wavelength, you get a dark fringe.

Bright fringes: **d sin θ = mλ** (m = 0, ±1, ±2, ...)
Dark fringes: **d sin θ = (m + ½)λ**

The fringe spacing on the screen: **Δy = λL/d**, where L is the screen distance and d is the slit separation. This equation lets you MEASURE the wavelength of light from the fringe pattern — the first precise determination of wavelength in history.

📚 *Young's experiment proved that light is a wave. Ibn al-Haytham's earlier observation that two candle flames in a dark room produce overlapping light without "colliding" was an early hint of superposition — the principle underlying all interference.*`,
      analogy: 'Drop two pebbles in a pond simultaneously, a few centimetres apart. The expanding circles of ripples overlap — at some points the waves reinforce (bigger ripples), at others they cancel (flat water). The pattern of reinforcement and cancellation is interference. Young\'s double slit creates the same pattern with light waves.',
      storyConnection: 'Ibn al-Haytham set up experiments with multiple light sources in a darkened room and observed that the beams passed through each other without disruption — a key property of waves. His insistence on experimental verification over philosophical argument set the standard for the scientific method. Young\'s later double slit experiment confirmed the wave nature of light that Ibn al-Haytham\'s observations hinted at.',
      checkQuestion: 'Two slits separated by 0.2 mm are illuminated with 600 nm light. What is the fringe spacing on a screen 1.5 m away?',
      checkAnswer: 'Δy = λL/d = (600 × 10⁻⁹ × 1.5) / (0.2 × 10⁻³) = 9 × 10⁻⁴ / 2 × 10⁻⁴ = 4.5 mm. The bright fringes are 4.5 mm apart — easily visible. This is how Young measured the wavelength of light in 1801, confirming the wave theory.',
      codeIntro: 'Simulate Young\'s double slit interference pattern and explore how slit separation and wavelength affect fringes.',
      code: `import numpy as np

def double_slit_intensity(y_mm, d_mm, wavelength_nm, L_mm, slit_width_um=20):
    """
    Double slit interference pattern including single-slit envelope.
    I = I₀ × cos²(π d y / λL) × [sin(β)/β]²
    """
    lam_mm = wavelength_nm / 1e6
    # Interference term
    phi = np.pi * d_mm * y_mm / (lam_mm * L_mm)
    interference = np.cos(phi) ** 2
    # Single slit envelope
    a_mm = slit_width_um / 1000
    beta = np.pi * a_mm * y_mm / (lam_mm * L_mm)
    if abs(beta) < 1e-10:
        envelope = 1.0
    else:
        envelope = (np.sin(beta) / beta) ** 2
    return interference * envelope

# Standard double slit parameters
d = 0.25       # mm slit separation
lam = 550      # nm wavelength (green)
L = 1500       # mm screen distance (1.5 m)
slit_w = 30    # µm slit width

print("=== Young's Double Slit Interference Pattern ===")
print(f"Slit separation: {d} mm | Wavelength: {lam} nm | Screen: {L/1000:.1f} m")
fringe_spacing = lam / 1e6 * L / d
print(f"Predicted fringe spacing: {fringe_spacing:.2f} mm\\\n")

print(f"{'Position (mm)':>14} {'Intensity':>10} {'Pattern':<30}")
print("-" * 56)

for y in np.arange(-8, 8.1, 0.5):
    I = double_slit_intensity(y, d, lam, L, slit_w)
    bar = "█" * int(I * 25)
    print(f"{y:>12.1f} mm {I:>9.4f} {bar}")

# Wavelength measurement from fringe spacing
print("\\\n=== Measuring Wavelength from Fringe Spacing ===")
print("If we observe the pattern and measure fringe spacing Δy:")
print(f"Δy = λL/d → λ = Δy × d / L")
print(f"\\\nMeasured Δy = {fringe_spacing:.2f} mm")
print(f"Calculated λ = {fringe_spacing:.2f} × {d} / {L} = {fringe_spacing * d / L * 1e6:.0f} nm ✓")

# Compare different wavelengths
print("\\\n=== Fringe Spacing vs Wavelength ===")
print(f"d = {d} mm, L = {L/1000} m\\\n")
print(f"{'Colour':<10} {'λ (nm)':>7} {'Spacing (mm)':>13}")
print("-" * 32)

colours = [("Violet", 400), ("Blue", 470), ("Green", 550),
           ("Yellow", 580), ("Orange", 610), ("Red", 700)]

for colour, wl in colours:
    sp = wl / 1e6 * L / d
    print(f"{colour:<10} {wl:>5} nm {sp:>11.2f} mm")

# Effect of slit separation
print("\\\n=== Fringe Spacing vs Slit Separation ===")
print(f"λ = {lam} nm, L = {L/1000} m\\\n")
print(f"{'d (mm)':>7} {'Spacing (mm)':>13} {'Fringes in ±10mm':>18}")
print("-" * 40)

for d_val in [0.05, 0.10, 0.25, 0.50, 1.00, 2.00]:
    sp = lam / 1e6 * L / d_val
    n_fringes = int(20 / sp)
    print(f"{d_val:>5.2f} mm {sp:>11.2f} mm {n_fringes:>16}")`,
      challenge: 'A diffraction grating has 500 lines per mm (d = 0.002 mm). Calculate the angular positions of the first three orders for 550 nm light. Gratings produce MUCH sharper fringes than a double slit — this is why they are used in spectrometers to precisely measure wavelengths.',
      successHint: 'Young\'s double slit experiment is one of the most important experiments in physics. It proved light is a wave, it measured wavelengths precisely, and in the 20th century it revealed the wave-particle duality of quantum mechanics. The same interference mathematics governs radio antenna arrays, noise-cancelling headphones, and gravitational wave detectors.',
    },
    {
      title: 'The human eye — accommodation, near point, and far point',
      concept: `The human eye is a remarkable optical instrument: a **converging lens** (the crystalline lens + cornea) that projects a real, inverted image onto the **retina** (a curved detector at the back of the eye).

The cornea provides about 2/3 of the eye's refracting power (f ≈ 24 mm total). The crystalline lens provides the remaining 1/3 and can CHANGE its shape — **accommodation** — to focus on objects at different distances.

**Near point**: the closest distance at which the eye can focus clearly (about 25 cm for a young adult, increasing with age as the lens stiffens — **presbyopia**).

**Far point**: the farthest distance for clear focus (infinity for a normal eye). A **myopic** (nearsighted) eye has a far point closer than infinity — distant objects are blurry. A **hyperopic** (farsighted) eye cannot focus at the near point.

Corrective lenses compensate: a diverging lens for myopia (moves the far point to infinity), a converging lens for hyperopia (moves the near point closer).

📚 *Ibn al-Haytham was the first to correctly describe the eye as a device that receives light rather than emitting it. His detailed anatomy of the eye — cornea, lens, vitreous humor, retina — was accurate enough that it was used as a medical reference for 600 years.*`,
      analogy: 'Your eye works like a camera: the cornea and lens are the camera lens, the iris is the aperture (controlling brightness), and the retina is the film (or sensor). Accommodation is like autofocus — the lens changes shape to keep things sharp. Presbyopia is like a camera whose autofocus motor is wearing out — it can only focus at certain distances.',
      storyConnection: 'Ibn al-Haytham\'s greatest contribution was his model of vision. He proved that we see because light enters the eye — not because the eye emits rays (the "extramission" theory of Euclid and Ptolemy). His detailed description of the eye\'s optical system in the Book of Optics was the first correct account of image formation in the eye.',
      checkQuestion: 'A myopic person has a far point of 2 m. What lens power (in dioptres) do they need to see distant objects clearly?',
      checkAnswer: 'The corrective lens must form a virtual image of a distant object at 2 m (the far point). 1/f = 1/dᵢ - 1/dₒ = 1/(-2) - 1/(-∞) = -0.5 D. They need a -0.5 dioptre diverging lens. The negative sign indicates a diverging (concave) lens.',
      codeIntro: 'Model the human eye as an optical system — compute accommodation, diagnose vision defects, and prescribe corrections.',
      code: `import numpy as np

class HumanEye:
    """Model of the human eye as an optical system."""

    def __init__(self, age=25, eye_length_mm=24.0, cornea_power_D=43.0):
        self.age = age
        self.eye_length = eye_length_mm
        self.cornea_power = cornea_power_D  # dioptres
        # Accommodation range decreases with age
        self.max_accommodation = self._calc_accommodation()

    def _calc_accommodation(self):
        """Max accommodation (dioptres) decreases with age."""
        if self.age <= 10:
            return 14.0
        elif self.age >= 70:
            return 0.5
        else:
            return 14.0 * np.exp(-0.03 * (self.age - 10))

    def total_power(self, accommodation=0):
        """Total refractive power of eye (dioptres)."""
        # Relaxed eye focuses at infinity: P = 1000/f_mm
        base_power = 1000 / self.eye_length
        return base_power + accommodation

    def near_point_cm(self):
        """Closest focus distance."""
        # P_near = P_base + accommodation = 1000/d_image
        # For clear focus: 1/d_obj + 1/d_img = P (in dioptres with metres)
        p_total = self.total_power(self.max_accommodation)
        p_base = self.total_power(0)
        if self.max_accommodation < 0.1:
            return float('inf')
        return 100 / self.max_accommodation  # cm

    def far_point_cm(self):
        """Farthest focus distance (infinity for normal eye)."""
        return float('inf')  # normal eye

    def diagnose(self):
        """Diagnose vision condition."""
        np_ = self.near_point_cm()
        if np_ > 40:
            return "Presbyopia (age-related farsightedness)"
        elif np_ > 25:
            return "Mild presbyopia"
        else:
            return "Normal vision"

# Age-related accommodation loss
print("=== Human Eye Accommodation vs Age ===")
print(f"\\\n{'Age':>5} {'Max Accomm (D)':>15} {'Near point (cm)':>16} {'Diagnosis':<30}")
print("-" * 68)

for age in [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]:
    eye = HumanEye(age=age)
    np_cm = eye.near_point_cm()
    diag = eye.diagnose()
    np_str = f"{np_cm:.0f}" if np_cm < 1000 else "∞"
    print(f"{age:>5} {eye.max_accommodation:>13.1f} {np_str:>14} cm {diag:<30}")

# Corrective lens prescription
print("\\\n=== Corrective Lens Prescriptions ===")

conditions = [
    ("Myopia (far point 1m)",    -1.00),
    ("Myopia (far point 50cm)",  -2.00),
    ("Myopia (far point 25cm)",  -4.00),
    ("Hyperopia (mild)",         +1.00),
    ("Hyperopia (moderate)",     +2.50),
    ("Presbyopia (age 50)",      +2.00),
]

print(f"\\\n{'Condition':<28} {'Prescription (D)':>16} {'Lens type':<18}")
print("-" * 64)

for name, power in conditions:
    lens_type = "Diverging (concave)" if power < 0 else "Converging (convex)"
    print(f"{name:<28} {power:>+14.2f} D {lens_type:<18}")

# Retinal image size
print("\\\n=== Retinal Image Size ===")
print("Eye focal length ≈ 17 mm (effective)")
f_eye = 17  # mm

objects = [
    ("Full moon", 3474, 384400e3),      # diameter km, distance km → m
    ("Person (1.7m) at 10m", 1.7, 10),
    ("Book text (5mm) at 25cm", 0.005, 0.25),
    ("Bacterium (5µm) at 25cm", 5e-6, 0.25),
]

print(f"\\\n{'Object':<30} {'Retinal image':>14}")
print("-" * 46)
for name, size, dist in objects:
    image_size_mm = f_eye * size / (dist * 1000)  # convert dist to mm
    if abs(image_size_mm) > 1:
        print(f"{name:<30} {image_size_mm:>12.2f} mm")
    elif abs(image_size_mm) > 0.001:
        print(f"{name:<30} {image_size_mm*1000:>12.1f} µm")
    else:
        print(f"{name:<30} {image_size_mm*1e6:>12.2f} nm")`,
      challenge: 'A 50-year-old person with normal distance vision needs reading glasses. Their near point has receded to 50 cm, but they want to read at 25 cm. Calculate the required lens power. Then calculate how the same glasses affect their distance vision — why do people take off their reading glasses to look across the room?',
      successHint: 'You modelled the human eye as an optical system — exactly what ophthalmologists and optometrists do when prescribing corrective lenses. Ibn al-Haytham would recognise every element of this model: he described the cornea, lens, and retina in the Book of Optics over a thousand years ago.',
    },
    {
      title: 'Aberrations — chromatic and spherical distortions in real lenses',
      concept: `Ideal lenses form perfect images. Real lenses don't — they suffer from **aberrations** that blur, distort, or colour-fringe the image.

**Spherical aberration**: rays far from the axis focus at a different point than rays near the axis. The lens has ONE focal length in theory, but in practice the focal length varies across the lens diameter. Solution: use only the central part of the lens (smaller aperture) or use aspherical surfaces.

**Chromatic aberration**: different wavelengths focus at different points because the refractive index varies with wavelength (dispersion). Blue light focuses shorter than red light. Solution: combine a converging crown glass lens with a diverging flint glass lens — an **achromatic doublet** — to bring two wavelengths to the same focus.

The **longitudinal chromatic aberration** (LCA) is the difference in focal length between two wavelengths: LCA = f_red - f_blue.

The **transverse chromatic aberration** (TCA) is the difference in image size — it creates colour fringes at the edges of the image.

📚 *Ibn al-Haytham observed that images formed by glass spheres were imperfect — blurred at the edges, sharper in the centre. This is the earliest recorded observation of spherical aberration, documented in the Book of Optics around 1021 CE.*`,
      analogy: 'A funhouse mirror distorts your reflection because its surface isn\'t perfectly flat. A real lens distorts images in subtler ways: spherical aberration is like the mirror being slightly too curved at the edges, and chromatic aberration is like looking through a prism — the image gets rainbow fringes because different colours focus at different distances.',
      storyConnection: 'Ibn al-Haytham noticed that light passing through the edges of a glass sphere did not focus at the same point as light through the centre. He documented this effect carefully, noting that it worsened with larger spheres. This observation — the first recorded description of spherical aberration — motivated later opticians to develop aspherical lens designs and compound lens systems.',
      checkQuestion: 'A simple lens has f = 100.0 mm at 550 nm but f = 98.5 mm at 450 nm. What is the longitudinal chromatic aberration?',
      checkAnswer: 'LCA = f_red - f_blue ≈ 100.0 - 98.5 = 1.5 mm. This means the blue image forms 1.5 mm closer to the lens than the green image. At the green focus plane, blue light is spread into a circle (blur disc) instead of a point — creating a blue fringe around bright objects.',
      codeIntro: 'Quantify spherical and chromatic aberrations for real lenses and design achromatic corrections.',
      code: `import numpy as np

def spherical_aberration(f_paraxial, y_ray, lens_radius):
    """
    Longitudinal spherical aberration (LSA) for a thin lens.
    LSA ≈ -y² / (2 × f × n × (n-1)) — simplified third-order model.
    In practice: rays at height y focus at f - LSA.
    """
    # Simplified model: LSA proportional to y²
    lsa = 0.05 * (y_ray / lens_radius) ** 2 * f_paraxial
    return lsa

def chromatic_focal(f_d, abbe_number, wavelength_nm):
    """
    Focal length at a given wavelength using the Abbe number.
    f(λ) ≈ f_d × [1 + (λ - 587.6) × correction_factor]
    """
    # Simplified: spread over visible range
    delta_n_factor = 1.0 / abbe_number
    # Map wavelength to deviation from d-line
    delta = (587.6 - wavelength_nm) / 200  # normalised offset
    return f_d * (1 + delta * delta_n_factor)

# Spherical aberration
print("=== Spherical Aberration Analysis ===")
f = 100  # mm paraxial focal length
R_lens = 25  # mm lens radius

print(f"Paraxial focal length: {f} mm | Lens radius: {R_lens} mm")
print(f"\\\n{'Ray height (mm)':>16} {'LSA (mm)':>10} {'Actual focus (mm)':>18} {'Blur at f':>10}")
print("-" * 56)

for y in [1, 3, 5, 8, 10, 15, 20, 25]:
    if y > R_lens:
        continue
    lsa = spherical_aberration(f, y, R_lens)
    actual_f = f - lsa
    # Blur disc diameter at paraxial focus
    blur = 2 * y * lsa / f
    print(f"{y:>14} mm {lsa:>8.3f} {actual_f:>16.3f} {blur:>8.3f} mm")

print(f"\\\nEdge rays focus {spherical_aberration(f, R_lens, R_lens):.1f} mm shorter than centre rays")

# Stopping down reduces SA
print("\\\n=== Effect of Aperture Stop (f-number) ===")
for f_num in [2, 2.8, 4, 5.6, 8, 11, 16]:
    y_max = f / (2 * f_num)
    if y_max > R_lens:
        y_max = R_lens
    lsa = spherical_aberration(f, y_max, R_lens)
    print(f"f/{f_num:<4} → max ray height: {y_max:>5.1f} mm, LSA: {lsa:.3f} mm")

# Chromatic aberration
print("\\\n=== Chromatic Aberration ===")
f_d = 100  # mm at d-line (587.6 nm)

for glass, abbe in [("Crown BK7", 64), ("Flint SF11", 26), ("Plastic CR39", 58)]:
    print(f"\\\n{glass} (Abbe V = {abbe}):")
    print(f"  {'Wavelength':>12} {'f (mm)':>10} {'Δf from d-line':>16}")
    for wl in [450, 486, 550, 587.6, 656, 700]:
        f_wl = chromatic_focal(f_d, abbe, wl)
        delta = f_wl - f_d
        print(f"  {wl:>9.1f} nm {f_wl:>10.2f} {delta:>+14.2f} mm")

# Achromatic doublet design
print("\\\n=== Achromatic Doublet Design ===")
V1, V2 = 64.2, 25.8  # crown, flint Abbe numbers
f_target = 100  # mm combined focal length

f1 = f_target * (1 - V2/V1)
f2 = f_target * (1 - V1/V2)

print(f"Target combined f: {f_target} mm")
print(f"Crown lens (V={V1}): f1 = {f1:.1f} mm (converging)")
print(f"Flint lens (V={V2}): f2 = {f2:.1f} mm (diverging)")
print(f"Combined: 1/f = 1/{f1:.1f} + 1/{f2:.1f} = {1/f1 + 1/f2:.4f} → f = {1/(1/f1+1/f2):.1f} mm")
print(f"\\\nThe flint element cancels the crown's chromatic aberration")
print(f"while preserving most of its converging power.")`,
      challenge: 'An apochromatic triplet brings THREE wavelengths to the same focus. If you add a third element with Abbe number V₃ = 81 (fluorite), set up the three equations to solve for f₁, f₂, f₃. Apochromats are used in high-end camera lenses and microscope objectives where colour fringing is unacceptable.',
      successHint: 'Understanding aberrations is what separates a good lens from a great one. Every camera lens, from phone cameras to cinema lenses, is designed by balancing spherical and chromatic aberrations across multiple elements. Ibn al-Haytham\'s observation of edge blurring through glass spheres was the starting point for this entire field of optical engineering.',
    },
    {
      title: 'Experimental design methodology — Ibn al-Haytham\'s scientific method',
      concept: `Ibn al-Haytham is often called the "father of the scientific method" because he articulated a systematic approach to investigation centuries before Francis Bacon:

1. **State the problem** clearly
2. **Form a hypothesis** (a testable prediction)
3. **Design an experiment** to test the hypothesis
4. **Control variables** — change only one thing at a time
5. **Collect quantitative data** (measurements, not just descriptions)
6. **Analyse the data** — does it support or refute the hypothesis?
7. **Draw conclusions** — and acknowledge limitations

He applied this rigorously in the Book of Optics: he hypothesised that light travels in straight lines, then designed a darkened room experiment with a pinhole to test it. He varied the hole size, the distance to the screen, and the number of light sources — controlling variables systematically.

In modern science, experimental design also requires **statistical power** (enough data points), **randomisation** (to avoid bias), and **reproducibility** (others must be able to repeat the experiment).

📚 *Ibn al-Haytham explicitly criticised the Greek tradition of deriving conclusions from first principles alone. He wrote: "The duty of the seeker of truth is to doubt, and to critically investigate — not merely to follow authority."*`,
      analogy: 'Imagine you suspect that a particular fertiliser makes tomatoes grow larger. You don\'t just use it and see what happens — you plant two groups of identical plants, give one the fertiliser and the other plain water, keep everything else the same (sunlight, soil, watering schedule), and measure the tomatoes. That\'s controlled experimental design — exactly what Ibn al-Haytham did with light.',
      storyConnection: 'Ibn al-Haytham\'s darkened room experiments were methodological masterpieces. To test whether light travels in straight lines, he set up candles at known positions, admitted light through a small hole, and measured where the light spots appeared on the opposite wall. He varied the hole size and noted that smaller holes gave sharper (but dimmer) images — discovering the pinhole camera principle through systematic experimentation.',
      checkQuestion: 'An experiment tests whether lens shape affects image sharpness. What variables must be controlled?',
      checkAnswer: 'Light source (same brightness, wavelength, distance), lens material (same glass type and quality), measurement method (same screen distance, same camera/detector), ambient light (same dark room conditions), and sample size (test multiple lenses of each shape). Only lens shape should vary between the test groups.',
      codeIntro: 'Design and analyse a controlled optics experiment — applying Ibn al-Haytham\'s methodology to measure the refractive index of glass.',
      code: `import numpy as np

np.random.seed(42)

class OpticsExperiment:
    """Framework for a controlled optics experiment."""

    def __init__(self, name, hypothesis):
        self.name = name
        self.hypothesis = hypothesis
        self.data = []

    def run_trial(self, true_value, measurement_error, n_trials=20):
        """Simulate n measurements with random error."""
        measurements = np.random.normal(true_value, measurement_error, n_trials)
        self.data.extend(measurements)
        return measurements

    def analyse(self):
        """Statistical analysis of collected data."""
        d = np.array(self.data)
        return {
            "mean": np.mean(d),
            "std": np.std(d, ddof=1),
            "sem": np.std(d, ddof=1) / np.sqrt(len(d)),
            "n": len(d),
            "ci_95": 1.96 * np.std(d, ddof=1) / np.sqrt(len(d)),
        }

# Experiment: Measure refractive index of glass using Snell's law
print("=== Experiment: Measuring Refractive Index of Glass ===")
print("Method: Shine laser at glass block, measure incidence & refraction angles")
print("Hypothesis: n_glass = 1.520 ± 0.005 (manufacturer spec)\\\n")

exp = OpticsExperiment(
    "Refractive index measurement",
    "n_glass = 1.520 ± 0.005"
)

# True value (unknown to experimenter)
true_n = 1.518

# Different angles of incidence
angles_of_incidence = [15, 25, 35, 45, 55, 65]
angle_error = 0.5  # degrees measurement uncertainty

print("--- Raw Data Collection ---")
print(f"{'Trial':>6} {'θ_i (°)':>8} {'θ_r measured (°)':>16} {'n calculated':>12}")
print("-" * 44)

all_n = []
for trial, theta_i in enumerate(angles_of_incidence * 3, 1):  # 3 repeats each
    # Simulate: true refracted angle + measurement error
    true_theta_r = np.degrees(np.arcsin(np.sin(np.radians(theta_i)) / true_n))
    measured_theta_r = true_theta_r + np.random.normal(0, angle_error)
    # Calculate n from measurements
    n_calc = np.sin(np.radians(theta_i)) / np.sin(np.radians(measured_theta_r))
    all_n.append(n_calc)
    if trial <= 12:  # show first 12 of 18
        print(f"{trial:>6} {theta_i:>6.0f}° {measured_theta_r:>14.2f}° {n_calc:>10.4f}")

if len(all_n) > 12:
    print(f"  ... ({len(all_n) - 12} more trials)")

exp.data = all_n
stats = exp.analyse()

print(f"\\\n--- Statistical Analysis ---")
print(f"Number of measurements: {stats['n']}")
print(f"Mean refractive index: {stats['mean']:.4f}")
print(f"Standard deviation: {stats['std']:.4f}")
print(f"Standard error of mean: {stats['sem']:.4f}")
print(f"95% confidence interval: {stats['mean']:.4f} ± {stats['ci_95']:.4f}")
print(f"  → n = ({stats['mean'] - stats['ci_95']:.4f}, {stats['mean'] + stats['ci_95']:.4f})")

# Does the result agree with the manufacturer?
mfg_n = 1.520
within = abs(stats['mean'] - mfg_n) < stats['ci_95']
print(f"\\\nManufacturer specification: {mfg_n:.3f}")
print(f"Our measurement: {stats['mean']:.4f} ± {stats['ci_95']:.4f}")
print(f"Agreement: {'YES — within 95% CI' if within else 'NO — significant difference'}")

# Systematic vs random error
print(f"\\\n--- Error Analysis ---")
print(f"Random error (std): {stats['std']:.4f} (from angle measurement precision)")
print(f"Systematic error: {abs(stats['mean'] - true_n):.4f} (if true n is {true_n})")
print(f"\\\nIbn al-Haytham's principle: repeat measurements reduce random error")
print(f"(SEM decreases as 1/√n), but cannot eliminate systematic error.")`,
      challenge: 'Add a "sample size power analysis" — how many measurements do you need to distinguish n = 1.518 from n = 1.520 with 95% confidence? Calculate for angle measurement uncertainties of 0.5°, 0.2°, and 0.1°. This is how researchers plan experiments — they determine the required sample size BEFORE collecting data.',
      successHint: 'You applied the scientific method that Ibn al-Haytham pioneered: hypothesis, controlled experiment, quantitative data, statistical analysis, and honest assessment of error. This methodology — refined over a thousand years but fundamentally unchanged — is how all modern science operates.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced optics, wave theory, and experimental design</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers optical instruments, wave interference, eye modelling, lens aberrations, and experimental methodology.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
