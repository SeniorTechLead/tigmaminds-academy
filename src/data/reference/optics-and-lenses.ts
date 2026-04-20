import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'optics-and-lenses',
  title: 'Optics & Lenses',
  category: 'physics',
  icon: '🔍',
  tagline: 'How lenses bend light to let us see the very small and the very far.',
  relatedStories: ['kingfisher-blue', 'the-girl-who-painted-rain', 'stars-ziro-valley', 'dragonfly-and-the-paddy-field'],
  understand: [
    {
      title: 'Reflection -- Mirrors and Images',
      beginnerContent:
        '**The law of reflection** is beautifully simple: the angle of incidence equals the angle of reflection, both measured from the **normal** (the line perpendicular to the mirror surface).\n\n' +
        '> *Think of bouncing a ball off a wall -- it rebounds at the same angle it arrived. Light does the same thing.*\n\n' +
        '**Three types of mirrors:**\n\n' +
        '| Mirror type | Shape | Image | Real or virtual? | Everyday use |\n' +
        '|------------|-------|-------|-----------------|-------------|\n' +
        '| Plane (flat) | Flat surface | Same size, upright, laterally inverted | Virtual | Bathroom mirror, dressing mirror |\n' +
        '| Concave (curved inward) | Like inside of a spoon | Varies with object distance | Real or virtual | Shaving mirror, torch reflector, solar cooker |\n' +
        '| Convex (curved outward) | Like back of a spoon | Smaller, upright, wide field of view | Virtual | Vehicle side mirrors, shop security mirrors |\n\n' +
        '**Key terms:**\n\n' +
        '| Term | Meaning |\n' +
        '|------|---------|\n' +
        '| Virtual image | Light rays only *appear* to come from behind the mirror -- cannot be projected on a screen |\n' +
        '| Real image | Light rays actually converge -- can be projected on a screen |\n' +
        '| Focal point (F) | Where parallel rays converge (concave) or appear to diverge from (convex) |\n' +
        '| Focal length (f) | Distance from mirror to focal point; f = R/2 where R is radius of curvature |\n' +
        '| Laterally inverted | Left and right swapped (your left hand looks like right in a plane mirror) |\n\n' +
        '**Concave mirrors** converge parallel rays to a focal point. Place an object beyond F and you get a real, inverted image that can be projected onto a screen -- this is how reflecting telescopes and solar concentrators work. Place an object closer than F and the mirror produces an enlarged virtual image -- which is why shaving mirrors and makeup mirrors are concave.\n\n' +
        '**Convex mirrors** diverge light rays, producing a smaller, upright, virtual image that covers a wider field of view. Vehicle side mirrors carry the warning "objects in mirror are closer than they appear" because the image is always smaller than reality.\n\n' +
        'The parabolic solar cookers used by the Indian Army at high-altitude posts in Arunachal Pradesh use concave reflectors to focus sunlight onto a cooking vessel -- the same optics principle as a satellite dish, just applied to heat instead of radio signals.',
      intermediateContent:
        '**The mirror equation:**\n\n' +
        '`1/f = 1/v + 1/u`\n\n' +
        'where f = focal length, v = image distance, u = object distance (sign convention: distances in front of mirror are negative for the object).\n\n' +
        '**Worked example 1 -- Concave mirror:**\n\n' +
        'f = 20 cm, object at u = 60 cm.\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Apply mirror equation | 1/v = 1/f - 1/u = 1/20 - 1/60 |\n' +
        '| Find common denominator | = 3/60 - 1/60 = 2/60 |\n' +
        '| Solve for v | v = **30 cm** (real image, in front of mirror) |\n' +
        '| Magnification | m = -v/u = -30/60 = **-0.5** (inverted, half-size) |\n\n' +
        '**Worked example 2 -- Convex mirror:**\n\n' +
        'f = -15 cm (negative for convex), object at u = 30 cm.\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Apply mirror equation | 1/v = 1/(-15) - 1/30 = -2/30 - 1/30 = -3/30 |\n' +
        '| Solve for v | v = **-10 cm** (virtual, behind mirror) |\n' +
        '| Magnification | m = -(-10)/30 = **+0.33** (upright, one-third size) |\n\n' +
        '**Image summary for concave mirrors:**\n\n' +
        '| Object position | Image position | Image nature | Size |\n' +
        '|----------------|---------------|-------------|------|\n' +
        '| At infinity | At F | Real, inverted | Highly diminished |\n' +
        '| Beyond C | Between F and C | Real, inverted | Diminished |\n' +
        '| At C | At C | Real, inverted | Same size |\n' +
        '| Between F and C | Beyond C | Real, inverted | Magnified |\n' +
        '| At F | At infinity | -- | -- |\n' +
        '| Between F and P | Behind mirror | Virtual, upright | Magnified |\n\n' +
        'The radius of curvature R relates to f by **f = R/2**. Parabolic mirrors eliminate **spherical aberration** (the imperfect focusing of rays far from the principal axis) that plagues spherical mirrors in telescopes.',
      advancedContent:
        '**Ray transfer matrices (ABCD matrices):**\n\n' +
        'Real optical systems are analysed by representing each element as a 2x2 matrix. A curved mirror with radius R:\n\n' +
        '`M = [[1, 0], [-2/R, 1]]`\n\n' +
        'Cascading optical elements is done by matrix multiplication. For a Cassegrain telescope with primary mirror M1 (f1 = 10 m) and secondary M2 (f2 = 0.5 m), the system matrix gives the effective focal length and magnification.\n\n' +
        '**Adaptive optics:**\n\n' +
        '| Parameter | Typical value |\n' +
        '|-----------|-------------|\n' +
        '| Deformable mirror actuators | 100-1000+ |\n' +
        '| Correction frequency | ~1 kHz |\n' +
        '| Wavefront accuracy | lambda/20 |\n' +
        '| Angular resolution achieved | 0.02 arcseconds (Keck) |\n\n' +
        'Atmospheric turbulence distorts incoming starlight. Adaptive optics systems measure the distortion using a guide star (real or laser-generated), then deform the mirror surface in real time to cancel the error -- achieving diffraction-limited resolution from the ground.\n\n' +
        '**X-ray telescopes -- Wolter optics:**\n\n' +
        'X-rays penetrate most surfaces at normal incidence. **Wolter telescopes** use grazing-incidence reflection at angles < 2 degrees from the surface, arranged in nested paraboloid-hyperboloid pairs. The Chandra X-ray Observatory achieves 0.5 arcsecond resolution using this technique -- sharper than most ground-based optical telescopes.',
      diagram: 'MirrorReflectionDiagram',
    },
    {
      title: 'Refraction -- How Lenses Bend Light',
      beginnerContent:
        '**Why does light bend?**\n\n' +
        'Light changes speed when passing from one transparent medium to another. The side that enters the slower medium first decelerates while the other side keeps going, causing the ray to bend -- like a car driving from a road onto sand at an angle.\n\n' +
        '**Snell\'s law:** `n1 sin(theta1) = n2 sin(theta2)`\n\n' +
        'where n is the **refractive index** -- the ratio of light\'s speed in vacuum to its speed in the material.\n\n' +
        '| Material | Refractive index (n) | Speed of light |\n' +
        '|----------|---------------------|----------------|\n' +
        '| Vacuum | 1.000 | 300,000 km/s |\n' +
        '| Air | 1.0003 | ~300,000 km/s |\n' +
        '| Water | 1.33 | 225,000 km/s |\n' +
        '| Crown glass | 1.52 | 197,000 km/s |\n' +
        '| Diamond | 2.42 | 124,000 km/s |\n\n' +
        'A higher refractive index means more bending.\n\n' +
        '**Two types of lenses:**\n\n' +
        '| Lens type | Shape | What it does | Used in |\n' +
        '|-----------|-------|--------------|---------|\n' +
        '| Convex (converging) | Thicker in the middle | Bends parallel rays inward to a focal point | Magnifying glass, camera, projector |\n' +
        '| Concave (diverging) | Thinner in the middle | Spreads parallel rays apart | Correcting myopia, peepholes, laser beam expanders |\n\n' +
        '**Everyday refraction:** A swimming pool always looks shallower than it actually is. Light from the bottom bends away from the normal as it exits the water, and your brain traces rays back in straight lines -- placing the bottom closer than reality. A 2-metre pool appears only about 1.5 metres deep.\n\n' +
        'Kingfishers in Assam\'s wetlands must compensate for refraction when diving for fish. The fish they spot from the air appears to be in a slightly different position from its true location. These birds instinctively correct for this optical shift, striking the water at a steeper angle to hit the real position of the fish.',
      intermediateContent:
        '**The thin lens equation:**\n\n' +
        '`1/f = 1/v - 1/u`\n\n' +
        'where f = focal length, v = image distance, u = object distance.\n\n' +
        '**Lens power** is measured in **dioptres (D):** `P = 1/f` (f in metres).\n\n' +
        '| Lens | Focal length | Power | Type |\n' +
        '|------|-------------|-------|------|\n' +
        '| +2.5 D | 40 cm | Positive | Converging |\n' +
        '| -1.5 D | -67 cm | Negative | Diverging |\n' +
        '| Human eye (total) | ~17 mm | **+60 D** | Converging |\n\n' +
        '**Worked example -- Object at 30 cm from a convex lens (f = 20 cm):**\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Apply lens equation | 1/v = 1/f + 1/u = 1/20 + 1/(-30) |\n' +
        '| Find common denominator | = 3/60 - 2/60 = 1/60 |\n' +
        '| Solve for v | v = **60 cm** (real image, opposite side of lens) |\n' +
        '| Magnification | m = v/u = 60/(-30) = **-2** (inverted, twice the size) |\n\n' +
        '**The lensmaker\'s equation** gives the focal length of a thin lens from its physical shape:\n\n' +
        '`1/f = (n - 1) [1/R1 - 1/R2]`\n\n' +
        '**Worked example -- Biconvex lens:**\n\n' +
        'R1 = 20 cm, R2 = -20 cm, n = 1.5:\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Substitute | 1/f = 0.5 x [1/20 - 1/(-20)] |\n' +
        '| Simplify | = 0.5 x [1/20 + 1/20] = 0.5 x 0.1 |\n' +
        '| Result | 1/f = 0.05, so f = **20 cm** |\n' +
        '| Power | P = 1/0.20 = **+5 D** |\n\n' +
        'The eye\'s total power of ~+60 D comes from the cornea (~+43 D, fixed) and the crystalline lens (~+17 D, adjustable). Accommodation changes the lens power by +/- 4 D in a young eye.',
      advancedContent:
        '**Chromatic aberration and dispersion:**\n\n' +
        'Refractive index varies with wavelength -- blue light bends more than red. The **Abbe number** quantifies dispersion:\n\n' +
        '`V = (n_d - 1) / (n_F - n_C)`\n\n' +
        'where d, F, C refer to specific spectral lines (587.6 nm, 486.1 nm, 656.3 nm).\n\n' +
        '| Glass type | Abbe number (V) | Dispersion | Use |\n' +
        '|-----------|----------------|-----------|-----|\n' +
        '| Crown glass | ~60 | Low | Achromatic doublet (positive element) |\n' +
        '| Flint glass | ~35 | High | Achromatic doublet (negative element) |\n' +
        '| Fluorite (CaF2) | ~95 | Very low | Apochromatic lenses |\n\n' +
        'An **achromatic doublet** -- crown + flint cemented together -- cancels chromatic aberration at two wavelengths. **Apochromatic** lenses correct at three wavelengths using exotic glass or fluorite.\n\n' +
        '**The five Seidel aberrations:**\n\n' +
        '| Aberration | Effect | Corrected by |\n' +
        '|-----------|--------|-------------|\n' +
        '| Spherical | Outer rays focus closer than central rays | Aspheric surfaces |\n' +
        '| Coma | Off-axis points appear comet-shaped | Aplanatic design |\n' +
        '| Astigmatism | Different focal lengths in two perpendicular planes | Compound lens groups |\n' +
        '| Field curvature | Flat object produces curved image | Field-flattener element |\n' +
        '| Distortion | Straight lines appear curved (barrel or pincushion) | Symmetric lens design |\n\n' +
        'Modern camera lenses with 10-15 elements use computer-optimised designs to minimise all five simultaneously.\n\n' +
        '**Gradient-index (GRIN) lenses** have a continuously varying refractive index: n(r) = n0(1 - alpha*r^2/2). They bend light without curved surfaces. Used in endoscopes, photocopiers, and fibre-optic couplers. A GRIN rod of length L = pi/(2*sqrt(alpha)) acts as a quarter-pitch lens, transforming a point source into a parallel beam.',
      diagram: 'LensRayDiagram',
      interactive: {
        type: 'python-playground' as const,
        props: {
          starterCode:
            'import math\n\n' +
            '# Thin lens equation calculator\n' +
            '# 1/f = 1/v - 1/u\n' +
            '# (using convention: u negative for real objects)\n\n' +
            'f = 20   # focal length in cm (positive = converging)\n' +
            'u = -30  # object distance in cm (negative = real object)\n\n' +
            '# Calculate image distance\n' +
            'v = 1 / (1/f - 1/u)\n' +
            'm = v / u  # magnification\n\n' +
            'print(f"Focal length:     f = {f} cm")\n' +
            'print(f"Object distance:  u = {u} cm")\n' +
            'print(f"Image distance:   v = {v:.1f} cm")\n' +
            'print(f"Magnification:    m = {m:.2f}")\n' +
            'print()\n' +
            'if v > 0:\n' +
            '    print("Image is REAL (opposite side of lens)")\n' +
            'else:\n' +
            '    print("Image is VIRTUAL (same side as object)")\n' +
            'if abs(m) > 1:\n' +
            '    print(f"Image is MAGNIFIED ({abs(m):.1f}x)")\n' +
            'else:\n' +
            '    print(f"Image is DIMINISHED ({abs(m):.2f}x)")\n' +
            'if m < 0:\n' +
            '    print("Image is INVERTED")\n' +
            'else:\n' +
            '    print("Image is UPRIGHT")\n\n' +
            '# Try changing f and u to explore different setups!\n' +
            '# What happens when |u| < f? (object inside focal length)',
          title: 'Try it -- Thin Lens Equation Calculator',
        },
      },
    },
    {
      title: 'How the Human Eye Works',
      beginnerContent:
        '**The eye is a biological camera:**\n\n' +
        '| Eye part | Camera equivalent | Function |\n' +
        '|----------|------------------|----------|\n' +
        '| Cornea | Front lens element | Provides ~2/3 of total focusing power |\n' +
        '| Iris / pupil | Aperture (f-stop) | Controls light entry (2 mm bright, 8 mm dark) |\n' +
        '| Crystalline lens | Autofocus lens | Adjustable focus via ciliary muscles |\n' +
        '| Retina | Image sensor (film) | 120 million rods + 7 million cones |\n' +
        '| Fovea | Centre of sensor | Sharpest vision -- packed with cones |\n' +
        '| Optic nerve | Data cable | Carries signals to visual cortex |\n\n' +
        '**How focusing works (accommodation):**\n\n' +
        'Ciliary muscles squeeze the lens to make it fatter (shorter focal length) for near objects and relax to let it flatten (longer focal length) for distant objects. This is why staring at your phone for hours causes eye strain -- the ciliary muscles are constantly contracted.\n\n' +
        '**Rods vs cones:**\n\n' +
        '| Property | Rods | Cones |\n' +
        '|----------|------|-------|\n' +
        '| Number | ~120 million | ~7 million |\n' +
        '| Sensitivity | High (low-light vision) | Lower (bright-light vision) |\n' +
        '| Colour | No (black & white) | Yes (red, green, blue types) |\n' +
        '| Location | Mostly peripheral retina | Concentrated in fovea |\n' +
        '| Detail | Low | High |\n\n' +
        'This is why you can sometimes see a faint star by looking slightly to the side -- the peripheral rods are more sensitive than the central cones.\n\n' +
        '**Common vision defects:**\n\n' +
        '| Defect | Cause | Correction |\n' +
        '|--------|-------|------------|\n' +
        '| Myopia (nearsightedness) | Eyeball too long or cornea too curved | Concave (diverging) lens |\n' +
        '| Hyperopia (farsightedness) | Eyeball too short | Convex (converging) lens |\n' +
        '| Presbyopia | Lens stiffens with age (usually after 45) | Reading glasses (convex) |\n' +
        '| Astigmatism | Cornea curved unevenly | Cylindrical lens |\n\n' +
        'Globally, myopia is increasing rapidly -- about 30% of the world population is currently myopic, projected to reach 50% by 2050, likely driven by increased screen time and less time outdoors.\n\n' +
        'The Adi and Apatani tribes of Arunachal Pradesh traditionally spent most of their time outdoors in natural light. Studies across Asia show that children who spend more time outdoors have significantly lower myopia rates -- outdoor light stimulates dopamine release in the retina, which appears to regulate eye growth and prevent excessive elongation.',
      intermediateContent:
        '**The eye\'s optical system in numbers:**\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| Total optical power | ~+60 dioptres (f = 17 mm) |\n' +
        '| Cornea power (fixed) | ~+43 D |\n' +
        '| Lens power (adjustable) | ~+17 D (range: +13 to +21 D in youth) |\n' +
        '| Near point (age 20) | ~25 cm |\n' +
        '| Near point (age 50) | ~100 cm |\n' +
        '| Angular resolution | ~1 arcminute (1/60 degree) |\n\n' +
        '**Corrective lens calculations:**\n\n' +
        '**Example 1 -- Myopia:** A person\'s far point is 50 cm (cannot see beyond 50 cm clearly).\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Need to image infinity at 50 cm | 1/f = 1/v - 1/u = 1/(-0.5) - 1/infinity |\n' +
        '| Solve | P = 1/f = **-2 D** (diverging lens) |\n\n' +
        '**Example 2 -- Hyperopia:** Near point at 100 cm, wants to read at 25 cm.\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| Need to image 25 cm at 100 cm | P = 1/0.25 - 1/1.0 = 4 - 1 |\n' +
        '| Solve | P = **+3 D** (converging lens) |\n\n' +
        '**Diffraction limit of the eye:**\n\n' +
        'Using the Rayleigh criterion: theta = 1.22 x lambda / D = 1.22 x 550e-9 / 0.005 = **1.34 x 10^-4 rad = 0.46 arcminutes**. The eye nearly achieves its diffraction limit -- cone spacing in the fovea (~5 micrometre centre-to-centre) closely matches the Airy disc size, meaning evolution has optimised the retina to match the optics.',
      advancedContent:
        '**Modulation transfer function (MTF):**\n\n' +
        'The eye\'s MTF plots contrast transmission versus spatial frequency:\n\n' +
        '| Spatial frequency (cycles/degree) | Contrast sensitivity |\n' +
        '|----------------------------------|---------------------|\n' +
        '| 1 | Moderate |\n' +
        '| 3-5 | **Peak** |\n' +
        '| 30 | Low |\n' +
        '| 60 | Zero (resolution limit) |\n\n' +
        '**Wavefront aberrometry** using Hartmann-Shack sensors maps the eye\'s higher-order aberrations beyond simple sphere and cylinder -- including spherical aberration, coma, and trefoil.\n\n' +
        '**LASIK surgery:**\n\n' +
        '| Parameter | Detail |\n' +
        '|-----------|--------|\n' +
        '| Laser type | Excimer (193 nm ArF) |\n' +
        '| Ablation precision | Submicron |\n' +
        '| Modern approach | Wavefront-guided (corrects higher-order aberrations) |\n' +
        '| Corneal flap thickness | ~100-160 micrometres |\n\n' +
        '**Retinal neural preprocessing:** The retina is not a passive sensor -- it performs remarkable computation before signals reach the brain:\n\n' +
        '- **Lateral inhibition** between neighbouring cells enhances edge contrast (Mach bands)\n' +
        '- **Centre-surround** receptive fields detect spatial frequency and contrast\n' +
        '- **Motion-detection** circuits in retinal ganglion cells respond to movement direction\n' +
        '- **Compression ratio:** 120 million photoreceptors are compressed to ~1 million optic nerve fibres -- a 120:1 data reduction before the signal even reaches the brain\n\n' +
        'This preprocessing is why the eye adapts so well to varying conditions -- the retina adjusts its processing strategy depending on illumination, contrast, and motion.',
      diagram: 'EyeAnatomyDiagram',
    },
    {
      title: 'Telescopes and Microscopes',
      beginnerContent:
        '**Two instruments, one principle -- using lenses (or mirrors) to see what the naked eye cannot.**\n\n' +
        '**Refracting telescope (2 convex lenses):**\n\n' +
        '| Component | Role | Typical spec |\n' +
        '|-----------|------|--------------|\n' +
        '| Objective lens | Gathers light, forms real image | Long focal length (e.g. 1000 mm) |\n' +
        '| Eyepiece lens | Magnifies the real image for your eye | Short focal length (e.g. 10 mm) |\n' +
        '| **Magnification** | **= f_objective / f_eyepiece** | **= 1000/10 = 100x** |\n\n' +
        '**Reflecting telescope (concave mirror + eyepiece):**\n\n' +
        'Replaces the objective lens with a concave mirror, which avoids chromatic aberration and can be made much larger. The largest telescope mirrors today exceed 8 metres, while the largest practical lens is only about 1 metre.\n\n' +
        '| Telescope | Type | Mirror/lens size | What it sees |\n' +
        '|-----------|------|-----------------|-------------|\n' +
        '| Galileo\'s (1609) | Refractor | 3.7 cm lens | Jupiter\'s moons |\n' +
        '| Hubble (1990) | Reflector | 2.4 m mirror | Galaxies billions of light-years away |\n' +
        '| JWST (2021) | Reflector | 6.5 m mirror | Infrared light from the earliest galaxies |\n\n' +
        '**Compound microscope (2 convex lenses, reversed):**\n\n' +
        '| Component | Role |\n' +
        '|-----------|------|\n' +
        '| Objective lens (close to specimen) | Creates magnified real image |\n' +
        '| Eyepiece | Magnifies that image further |\n' +
        '| Total magnification | = objective x eyepiece (e.g. 40x x 10x = **400x**) |\n\n' +
        '**Resolution limits -- why magnification alone is not enough:**\n\n' +
        '| Instrument | Resolution limit | Can see |\n' +
        '|-----------|-----------------|--------|\n' +
        '| Naked eye | ~0.1 mm | A grain of sand |\n' +
        '| Light microscope | ~200 nm | Individual cells, large bacteria |\n' +
        '| Electron microscope (SEM) | ~1 nm | Viruses, cell organelles |\n' +
        '| Electron microscope (TEM) | ~0.05 nm | **Individual atoms** |\n\n' +
        'Researchers at the Institute of Advanced Study in Science and Technology (IASST) in Guwahati use electron microscopes to study the nanostructure of Muga silk -- the golden silk unique to Assam. The silk\'s distinctive lustre comes from its triangular cross-section and the specific arrangement of fibroin proteins, visible only under high-powered microscopy.',
      intermediateContent:
        '**Telescope performance metrics:**\n\n' +
        '| Metric | Formula | Example (200 mm telescope) |\n' +
        '|--------|---------|---------------------------|\n' +
        '| Light-gathering power | pi x (D/2)^2 | (200/7)^2 = **816x** more than your 7 mm pupil |\n' +
        '| Magnitude gain | 2.5 x log10(D/d_pupil)^2 | 2.5 x log10(816) = **7.3 magnitudes** fainter |\n' +
        '| Resolving power (Rayleigh) | theta = 1.22 x lambda / D | 1.22 x 550e-9 / 0.2 = **0.69 arcseconds** |\n' +
        '| Useful magnification range | D(mm) to 2 x D(mm) | 200x to 400x |\n\n' +
        '**Microscope resolution:**\n\n' +
        '`d = 0.61 x lambda / NA`\n\n' +
        'where NA = n x sin(alpha) is the **numerical aperture**.\n\n' +
        '| Objective type | n (medium) | NA | Resolution at 550 nm |\n' +
        '|---------------|-----------|-----|---------------------|\n' +
        '| Dry (air) | 1.0 | 0.65 | 516 nm |\n' +
        '| Water immersion | 1.33 | 1.0 | 336 nm |\n' +
        '| Oil immersion | 1.52 | **1.4** | **240 nm** (limit) |\n\n' +
        'Oil immersion works because the oil (n = 1.52) matches the glass cover slip, eliminating the refraction that would otherwise prevent high-angle rays from entering the objective.',
      advancedContent:
        '**James Webb Space Telescope (JWST) -- engineering at the limit:**\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| Primary mirror | 6.5 m, 18 hexagonal beryllium segments |\n' +
        '| Segment alignment accuracy | **25 nm RMS** wavefront error |\n' +
        '| Actuators per segment | 7 |\n' +
        '| Operating temperature | -233 C (40 K) |\n' +
        '| Diffraction limit at 2 micrometre | theta = 1.22 x 2e-6/6.5 = **0.063 arcseconds** |\n\n' +
        '**Super-resolution microscopy (beyond the diffraction limit):**\n\n' +
        '| Technique | Principle | Resolution | Nobel Prize |\n' +
        '|-----------|-----------|-----------|-------------|\n' +
        '| STED | Doughnut-shaped depletion beam narrows point spread function | ~20-50 nm | 2014 |\n' +
        '| PALM/STORM | Stochastic single-molecule switching + localisation | ~10 nm | 2014 |\n' +
        '| SIM (structured illumination) | Moire pattern analysis | ~100 nm | -- |\n\n' +
        '**Electron microscopy -- why it works:**\n\n' +
        'The de Broglie wavelength of a 200 keV electron:\n\n' +
        'lambda = h / p = h / sqrt(2mE) = **0.0025 nm** -- thousands of times shorter than visible light.\n\n' +
        'Aberration-corrected scanning transmission electron microscopes (STEM) now achieve sub-angstrom resolution, imaging individual atoms and their chemical bonds. This is how researchers confirm crystal structures, detect single-atom impurities in semiconductors, and study protein structures at near-atomic resolution.',
      interactive: {
        type: 'python-playground' as const,
        props: {
          starterCode:
            'import math\n\n' +
            '# Telescope vs Microscope resolution calculator\n\n' +
            '# --- TELESCOPE ---\n' +
            'D_telescope = 0.200  # mirror diameter in metres\n' +
            'wavelength = 550e-9  # green light in metres\n\n' +
            'theta_rad = 1.22 * wavelength / D_telescope\n' +
            'theta_arcsec = theta_rad * (180/math.pi) * 3600\n\n' +
            'print("=== TELESCOPE (Rayleigh criterion) ===")\n' +
            'print(f"Mirror diameter: {D_telescope*100:.0f} cm")\n' +
            'print(f"Resolving power: {theta_arcsec:.2f} arcseconds")\n' +
            'print(f"Light gathering vs eye: {(D_telescope/0.007)**2:.0f}x")\n' +
            'print()\n\n' +
            '# --- MICROSCOPE ---\n' +
            'NA = 1.4  # oil-immersion numerical aperture\n' +
            'lam_nm = 550  # wavelength in nm\n\n' +
            'd_min = 0.61 * lam_nm / NA\n\n' +
            'print("=== MICROSCOPE (Abbe limit) ===")\n' +
            'print(f"Numerical aperture: {NA}")\n' +
            'print(f"Resolution limit: {d_min:.0f} nm")\n' +
            'print()\n' +
            'print("Try changing D_telescope or NA to see how resolution changes!")',
          title: 'Try it -- Resolution Calculator',
        },
      },
    },
    {
      title: 'Total Internal Reflection and Fibre Optics',
      beginnerContent:
        '**When does light get trapped inside a material?**\n\n' +
        'When light travels from a denser medium (glass, water) to a less dense one (air), it bends away from the normal. Increase the angle enough and the refracted ray bends to 90 degrees -- this is the **critical angle**. Beyond it, ALL light reflects back inside. Zero escapes. This is **total internal reflection (TIR)**.\n\n' +
        '> *Imagine throwing a ball at a wall from a shallow angle -- it bounces off. TIR is light bouncing off the boundary because the angle is too steep for it to escape.*\n\n' +
        '**Critical angles for common materials:**\n\n' +
        '| Material | Refractive index (n) | Critical angle (to air) | Consequence |\n' +
        '|----------|---------------------|------------------------|-------------|\n' +
        '| Water | 1.33 | 48.8 degrees | Snell\'s window for fish |\n' +
        '| Crown glass | 1.52 | 41.1 degrees | Used in prisms |\n' +
        '| Diamond | 2.42 | 24.4 degrees | Extraordinary sparkle -- light bounces many times inside |\n' +
        '| Optical fibre core | 1.62 | 69.7 degrees (to cladding) | Data transmission |\n\n' +
        '**Why diamonds sparkle:** The critical angle is only 24.4 degrees, so light entering the top of a well-cut diamond bounces off the internal facets many times before finally escaping back out the top. A round brilliant diamond has 57 facets engineered so that light strikes the pavilion facets at angles exceeding 24.4 degrees.\n\n' +
        '**Fibre optic cables:**\n\n' +
        '| Feature | Detail |\n' +
        '|---------|--------|\n' +
        '| Core diameter | ~9 micrometres (single-mode) or ~50 micrometres (multi-mode) |\n' +
        '| Cladding | Glass with slightly lower n |\n' +
        '| How it works | Light bounces along the fibre via continuous TIR |\n' +
        '| Speed | Up to hundreds of terabits per second |\n' +
        '| Loss | ~0.2 dB/km (signal travels 100+ km before needing a boost) |\n\n' +
        'The Indian government\'s BharatNet project is laying fibre optic cables to connect gram panchayats across Assam and the Northeast. These cables use the same TIR principle -- light pulses carrying internet data bounce along glass fibres thinner than a human hair, bringing broadband connectivity to remote villages in the Brahmaputra valley and hill districts.\n\n' +
        '**Snell\'s window:** A fish looking up from underwater sees the entire above-water world compressed into a bright circle directly overhead, bounded by the critical angle (~49 degrees). Beyond that circle, the water surface acts as a perfect mirror reflecting the underwater scene. Kingfishers hunting in Assam\'s beel (wetland) ecosystems must account for the refraction at this boundary when striking.',
      intermediateContent:
        '**Calculating the critical angle:**\n\n' +
        '`theta_c = arcsin(n2/n1)`\n\n' +
        '**Worked examples:**\n\n' +
        '| Interface | n1 | n2 | Calculation | theta_c |\n' +
        '|----------|-----|-----|------------|--------|\n' +
        '| Glass to air | 1.50 | 1.00 | arcsin(1/1.50) = arcsin(0.667) | **41.8 degrees** |\n' +
        '| Water to air | 1.33 | 1.00 | arcsin(1/1.33) = arcsin(0.752) | **48.8 degrees** |\n' +
        '| Diamond to air | 2.42 | 1.00 | arcsin(1/2.42) = arcsin(0.413) | **24.4 degrees** |\n\n' +
        '**Numerical aperture (NA) of an optical fibre:**\n\n' +
        'The acceptance angle theta_a at the fibre entrance determines which rays can enter and undergo TIR:\n\n' +
        '`NA = sin(theta_a) = sqrt(n1^2 - n2^2)`\n\n' +
        '**Worked example:** Core n1 = 1.62, cladding n2 = 1.52:\n\n' +
        '| Step | Calculation |\n' +
        '|------|------------|\n' +
        '| n1^2 - n2^2 | 2.6244 - 2.3104 = 0.3140 |\n' +
        '| NA | sqrt(0.3140) = **0.56** |\n' +
        '| Acceptance angle | theta_a = arcsin(0.56) = **34.1 degrees** |\n\n' +
        '**Types of optical fibre:**\n\n' +
        '| Type | Core size | NA | Bandwidth | Use |\n' +
        '|------|----------|-----|-----------|-----|\n' +
        '| Single-mode | ~9 um | 0.12 | Very high (100+ Gbps) | Long-haul telecom |\n' +
        '| Multi-mode (step index) | ~50 um | 0.2-0.5 | Moderate | Short links |\n' +
        '| Multi-mode (graded index) | ~50 um | 0.2 | High | Data centres |\n\n' +
        'Graded-index fibres have a parabolic refractive index profile -- rays near the edge travel faster through the lower-n region, compensating for their longer path, so all rays arrive at the same time. This eliminates **modal dispersion** and increases bandwidth.',
      advancedContent:
        '**The evanescent wave:**\n\n' +
        'During TIR, the electromagnetic field does not stop abruptly at the boundary. An **evanescent wave** penetrates into the rarer medium:\n\n' +
        '`I = I0 x exp(-2z/delta)`\n\n' +
        'where the penetration depth:\n\n' +
        '`delta = lambda / (2*pi * sqrt(n1^2 * sin^2(theta) - n2^2))`\n\n' +
        'Typically 100-200 nm -- less than one wavelength of light.\n\n' +
        '**Applications of the evanescent wave:**\n\n' +
        '| Technique | How it uses the evanescent wave | Application |\n' +
        '|-----------|-------------------------------|------------|\n' +
        '| ATR spectroscopy | Measures absorption of evanescent wave by sample pressed against high-index crystal | Chemical identification without thin-film prep |\n' +
        '| TIRF microscopy | Excites only fluorophores within ~100 nm of surface | Single-molecule imaging with excellent signal-to-noise |\n' +
        '| Frustrated TIR | Second high-index medium within evanescent field allows light to tunnel across gap | Beam splitter cubes, variable optical attenuators |\n\n' +
        '**Frustrated TIR** is the optical analogue of quantum tunnelling -- if a second high-index medium is brought within the evanescent field depth (typically < 200 nm), light "tunnels" across the gap. The transmission probability decays exponentially with gap width, exactly like a quantum particle tunnelling through a potential barrier.\n\n' +
        '**The Goos-Hanchen effect (1947):**\n\n' +
        'Totally reflected beams experience a small lateral shift (~lambda) along the surface. This is a consequence of the evanescent wave propagating briefly along the interface before re-entering the denser medium. The shift depends on polarisation and angle of incidence:\n\n' +
        '| Polarisation | Shift magnitude |\n' +
        '|-------------|----------------|\n' +
        '| TE (s-polarised) | Smaller |\n' +
        '| TM (p-polarised) | Larger (diverges near critical angle) |\n\n' +
        'This effect is negligible for single reflections but becomes significant in waveguides and fibre sensors where light undergoes thousands of reflections.',
      diagram: 'TotalInternalReflectionDiagram',
      interactive: {
        type: 'python-playground' as const,
        props: {
          starterCode:
            'import math\n\n' +
            '# Critical angle and fibre optics calculator\n\n' +
            '# --- CRITICAL ANGLE ---\n' +
            'n1 = 1.50  # denser medium (glass)\n' +
            'n2 = 1.00  # rarer medium (air)\n\n' +
            'theta_c = math.degrees(math.asin(n2/n1))\n' +
            'print(f"=== CRITICAL ANGLE ===")\n' +
            'print(f"n1 = {n1} (glass), n2 = {n2} (air)")\n' +
            'print(f"Critical angle = {theta_c:.1f} degrees")\n' +
            'print()\n\n' +
            '# --- FIBRE OPTICS ---\n' +
            'n_core = 1.62\n' +
            'n_clad = 1.52\n\n' +
            'NA = math.sqrt(n_core**2 - n_clad**2)\n' +
            'theta_a = math.degrees(math.asin(NA))\n' +
            'theta_c_fibre = math.degrees(math.asin(n_clad/n_core))\n\n' +
            'print(f"=== OPTICAL FIBRE ===")\n' +
            'print(f"Core n = {n_core}, Cladding n = {n_clad}")\n' +
            'print(f"Numerical Aperture = {NA:.3f}")\n' +
            'print(f"Acceptance angle = {theta_a:.1f} degrees")\n' +
            'print(f"Critical angle (core-cladding) = {theta_c_fibre:.1f} degrees")\n' +
            'print()\n\n' +
            '# Try diamond: set n1 = 2.42\n' +
            '# Why does diamond sparkle so much?',
          title: 'Try it -- Critical Angle & Fibre Optics',
        },
      },
    },
  ],
};
